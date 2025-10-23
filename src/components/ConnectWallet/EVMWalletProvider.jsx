// src/components/ConnectWallet/EVMWalletProvider.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { formatEther, getAddress } from "viem";
import { getPublicClient, getWalletClient, CHAIN, getRequiredChainId } from "../../lib/viemClients";

const EVMWalletContext = createContext(null);
export const useEVMWallet = () => useContext(EVMWalletContext);

export default function EVMWalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wcUri, setWcUri] = useState(null);
  const [error, setError] = useState("");

  // live provider refs
  const eip1193Ref = useRef(null);  // active provider (injected or WC)
  const wcRef = useRef(null);       // WalletConnect provider instance

  const publicClient = useMemo(() => getPublicClient(), []);

  const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  const setProvider = (prov) => {
    eip1193Ref.current = prov;
  };

  async function readState() {
    try {
      if (!eip1193Ref.current?.request) return;
      const [acc] = await eip1193Ref.current.request({ method: "eth_accounts" });
      const cid = await eip1193Ref.current.request({ method: "eth_chainId" });
      setAddress(acc ? getAddress(acc) : null);
      setChainId(parseInt(cid, 16));
      setConnected(Boolean(acc));
      if (acc) {
        const bal = await publicClient.getBalance({ address: getAddress(acc) });
        setBalance(Number(formatEther(bal)));
      } else {
        setBalance(null);
      }
    } catch (e) {
      setError(e?.message || "Failed to read wallet state");
    }
  }

  /** Ask wallet to switch/add the required BSC chain before any tx */
  async function ensureBscChain() {
    const required = getRequiredChainId();
    const hex = "0x" + required.toString(16);
    try {
      const cidHex = await eip1193Ref.current.request({ method: "eth_chainId" });
      if (parseInt(cidHex, 16) === required) return;
    } catch (_) {}

    try {
      await eip1193Ref.current.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hex }],
      });
    } catch (err) {
      // add if missing
      if (String(err?.code) === "4902" || /Unrecognized chain ID/i.test(err?.message || "")) {
        await eip1193Ref.current.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: hex,
            chainName: CHAIN.name,
            nativeCurrency: CHAIN.nativeCurrency,
            rpcUrls: [publicClient.transport.url],
            blockExplorerUrls: [CHAIN.blockExplorers?.default?.url].filter(Boolean),
          }],
        });
      } else {
        throw err;
      }
    }
  }

  async function connectInjected() {
    setError("");
    if (!window.ethereum?.request) {
      setError("No injected wallet found (MetaMask / Trust / OKX / Binance Web3).");
      return;
    }
    setProvider(window.ethereum);

    await window.ethereum.request({ method: "eth_requestAccounts" });
    await ensureBscChain();
    await readState();

    // subscribe to changes
    window.ethereum.on?.("accountsChanged", readState);
    window.ethereum.on?.("chainChanged", readState);
  }

  async function connectWalletConnect() {
    setError("");
    const projectId = import.meta.env.VITE_WC_PROJECT_ID;
    if (!projectId) {
      setError("VITE_WC_PROJECT_ID is missing.");
      return;
    }

    // close previous session
    try { await wcRef.current?.disconnect?.(); } catch (_) {}

    const provider = await EthereumProvider.init({
      projectId,
      chains: [getRequiredChainId()],
      optionalChains: [getRequiredChainId()],
      showQrModal: false, // we'll render our own QR
      methods: ["eth_sendTransaction", "eth_signTransaction", "eth_signTypedData", "personal_sign", "eth_accounts", "eth_requestAccounts", "wallet_switchEthereumChain", "wallet_addEthereumChain"],
      events: ["chainChanged", "accountsChanged", "session_delete", "connect", "disconnect", "display_uri"],
    });

    wcRef.current = provider;

    provider.on("display_uri", (uri) => setWcUri(uri));
    provider.on("connect", async () => {
      setProvider(provider);
      await ensureBscChain();
      await readState();
    });
    provider.on("accountsChanged", readState);
    provider.on("chainChanged", readState);
    provider.on("disconnect", () => {
      setConnected(false);
      setAddress(null);
      setChainId(null);
      setBalance(null);
      setWcUri(null);
    });

    await provider.connect();
  }

  async function disconnect() {
    setError("");
    try { await wcRef.current?.disconnect?.(); } catch (_) {}
    try { await eip1193Ref.current?.disconnect?.(); } catch (_) {}

    setConnected(false);
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setWcUri(null);

    // remove listeners on injected
    window.ethereum?.removeListener?.("accountsChanged", readState);
    window.ethereum?.removeListener?.("chainChanged", readState);
  }

  async function refresh() { await readState(); }

  const value = useMemo(() => ({
    // state
    connected, address, chainId, balance, wcUri, CHAIN,
    // raw provider (pass to viem wallet client)
    provider: eip1193Ref.current,
    // actions
    connectInjected, connectWalletConnect, disconnect, refresh, ensureBscChain,
    error,
    shortAddress: short(address),
  }), [connected, address, chainId, balance, wcUri, error]);

  // initial read if already connected
  useEffect(() => {
    if (window.ethereum?.isConnected?.()) {
      setProvider(window.ethereum);
      readState();
      window.ethereum.on?.("accountsChanged", readState);
      window.ethereum.on?.("chainChanged", readState);
    }
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", readState);
      window.ethereum?.removeListener?.("chainChanged", readState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <EVMWalletContext.Provider value={value}>{children}</EVMWalletContext.Provider>;
}



// // src/components/ConnectWallet/EVMWalletProvider.jsx
// import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { ethers } from "ethers";
// import EthereumProvider from "@walletconnect/ethereum-provider";

// const EVMWalletContext = createContext(null);
// export const useEVMWallet = () => useContext(EVMWalletContext);

// const CHAINS = {
//   mainnet: {
//     chainId: 56,
//     hex: "0x38",
//     name: "BNB Smart Chain",
//     rpc: import.meta.env.VITE_BSC_RPC_MAINNET || "https://bsc-dataseed.binance.org/",
//     explorer: "https://bscscan.com",
//     nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }
//   },
//   testnet: {
//     chainId: 97,
//     hex: "0x61",
//     name: "BNB Smart Chain Testnet",
//     rpc: import.meta.env.VITE_BSC_RPC_TESTNET || "https://data-seed-prebsc-1-s1.binance.org:8545/",
//     explorer: "https://testnet.bscscan.com",
//     nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 }
//   }
// };

// export default function EVMWalletProvider({ children }) {
//   const netKey = (import.meta.env.VITE_BSC_NETWORK || "mainnet").toLowerCase();
//   const CHAIN = CHAINS[netKey] ?? CHAINS.mainnet;
//   const REQUIRED_CHAIN_ID = CHAIN.chainId;

//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState(null);
//   const [chainId, setChainId] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [wcUri, setWcUri] = useState(null);
//   const [error, setError] = useState("");

//   const wcRef = useRef(null);       // WalletConnect EIP-1193 provider
//   const web3Ref = useRef(null);     // Active EIP-1193 provider (injected or WC)
//   const ethersRef = useRef(null);   // ethers BrowserProvider
//   const mounted = useRef(false);

//   const safeSetError = (msg) => setError(typeof msg === "string" ? msg : "Wallet error");

//   const setProvider = (provider) => {
//     web3Ref.current = provider;
//     ethersRef.current = new ethers.BrowserProvider(provider, "any");
//   };

//   const ensureBscChain = async (provider) => {
//     if (!provider) throw new Error("No provider available");
//     try {
//       const current = await provider.request?.({ method: "eth_chainId" });
//       if (Number(current) === REQUIRED_CHAIN_ID) return;

//       await provider.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: CHAIN.hex }]
//       });
//     } catch (err) {
//       // add chain if not present
//       if (err?.code === 4902 || String(err?.message || "").includes("Unrecognized")) {
//         await provider.request({
//           method: "wallet_addEthereumChain",
//           params: [{
//             chainId: CHAIN.hex,
//             chainName: CHAIN.name,
//             nativeCurrency: CHAIN.nativeCurrency,
//             rpcUrls: [CHAIN.rpc],
//             blockExplorerUrls: [CHAIN.explorer]
//           }]
//         });
//       } else {
//         throw err;
//       }
//     }
//   };

//   const readState = async () => {
//     const ethersProvider = ethersRef.current;
//     if (!ethersProvider) return;
//     try {
//       const signer = await ethersProvider.getSigner();
//       const addr = await signer.getAddress();
//       const net = await ethersProvider.getNetwork();
//       const bal = await ethersProvider.getBalance(addr);
//       setAddress(addr);
//       setChainId(Number(net.chainId));
//       setBalance(Number(ethers.formatEther(bal)));
//       setConnected(true);
//     } catch {
//       // swallow; UI will show disconnected
//     }
//   };

//   // Injected connect
//   const connectInjected = async () => {
//     setError("");
//     const provider = window?.ethereum;
//     if (!provider) throw new Error("No injected wallet found");
//     await ensureBscChain(provider);
//     await provider.request({ method: "eth_requestAccounts" });
//     setProvider(provider);
//     await readState();

//     provider.removeAllListeners?.("accountsChanged");
//     provider.removeAllListeners?.("chainChanged");
//     provider.removeAllListeners?.("disconnect");

//     provider.on?.("accountsChanged", async () => readState());
//     provider.on?.("chainChanged", async () => readState());
//     provider.on?.("disconnect", () => disconnect());

//     // persist last connector
//     try { localStorage.setItem("last_connector", "injected"); } catch {}
//   };

//   // WalletConnect connect (custom QR)
//   const connectWalletConnect = async () => {
//     setError("");
//     setWcUri(null);

//     const projectId = import.meta.env.VITE_WC_PROJECT_ID?.trim();
//     if (!projectId) throw new Error("Missing VITE_WC_PROJECT_ID");

//     const chain = CHAIN.chainId;

//     const ethprov = await EthereumProvider.init({
//       projectId,
//       chains: [chain],
//       optionalChains: [chain],
//       rpcMap: { [chain]: CHAIN.rpc },
//       showQrModal: false,
//       methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_sign"],
//       events: ["accountsChanged", "chainChanged", "disconnect"],
//       metadata: {
//         name: "Forton",
//         description: "Forton dApp",
//         url: window.location.origin,
//         icons: [
//           "https://raw.githubusercontent.com/walletconnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.png"
//         ]
//       }
//     });

//     wcRef.current = ethprov;

//     ethprov.removeAllListeners?.("display_uri");
//     ethprov.on("display_uri", (uri) => setWcUri(uri));
//     ethprov.on("disconnect", () => disconnect());

//     await ethprov.connect();        // triggers display_uri first, then connects
//     setProvider(ethprov);
//     await readState();

//     ethprov.removeAllListeners?.("accountsChanged");
//     ethprov.removeAllListeners?.("chainChanged");
//     ethprov.on("accountsChanged", async () => readState());
//     ethprov.on("chainChanged", async () => readState());

//     try { localStorage.setItem("last_connector", "walletconnect"); } catch {}
//   };

//   const disconnect = async () => {
//     setError("");
//     try { await wcRef.current?.disconnect?.(); } catch {}
//     // injected providers usually don't support programmatic disconnect
//     setConnected(false);
//     setAddress(null);
//     setChainId(null);
//     setBalance(null);
//     setWcUri(null);
//     wcRef.current = null;
//     web3Ref.current = null;
//     ethersRef.current = null;
//     try { localStorage.removeItem("last_connector"); } catch {}
//   };

//   const refresh = async () => readState();

//   // Optional: auto-reconnect once per mount (nice UX)
//   useEffect(() => {
//     if (mounted.current) return;
//     mounted.current = true;
//     const tryReconnect = async () => {
//       try {
//         const last = localStorage.getItem("last_connector");
//         if (last === "injected" && window?.ethereum?.selectedAddress) {
//           await connectInjected();
//         } else if (last === "walletconnect") {
//           // only init/display QR when user opens modal; no silent WC connect here
//         }
//       } catch (e) {
//         safeSetError(e?.message);
//       }
//     };
//     tryReconnect();
//   }, []);

//   const value = useMemo(() => ({
//     // state
//     connected, address, chainId,
//     balance, wcUri, CHAIN,
//     chain: { id: chainId, name: CHAIN.name, explorer: CHAIN.explorer },
//     provider: web3Ref.current,
//     error,

//     // actions
//     connectInjected,
//     connectWalletConnect,
//     disconnect,
//     refresh,
//     ensureBscChain: () => ensureBscChain(web3Ref.current),
//   }), [connected, address, chainId, balance, wcUri, error]);

//   return (
//     <EVMWalletContext.Provider value={value}>
//       {children}
//     </EVMWalletContext.Provider>
//   );
// }



// import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { ethers } from "ethers";
// import EthereumProvider from "@walletconnect/ethereum-provider";

// const EVMWalletContext = createContext(null);
// export const useEVMWallet = () => useContext(EVMWalletContext);

// const CHAINS = {
//   mainnet: {
//     chainId: 56,
//     hex: "0x38",
//     name: "BNB Smart Chain",
//     rpc: import.meta.env.VITE_BSC_RPC_MAINNET || "https://bsc-dataseed.binance.org/",
//     explorer: "https://bscscan.com",
//     nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }
//   },
//   testnet: {
//     chainId: 97,
//     hex: "0x61",
//     name: "BNB Smart Chain Testnet",
//     rpc: import.meta.env.VITE_BSC_RPC_TESTNET || "https://data-seed-prebsc-1-s1.binance.org:8545/",
//     explorer: "https://testnet.bscscan.com",
//     nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 }
//   }
// };

// export default function EVMWalletProvider({ children }) {
//   const netKey = (import.meta.env.VITE_BSC_NETWORK || "mainnet").toLowerCase();
//   const CHAIN = CHAINS[netKey] ?? CHAINS.mainnet;

//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState(null);
//   const [chainId, setChainId] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [wcUri, setWcUri] = useState(null);

//   const wcRef = useRef(null);       // WalletConnect provider
//   const web3Ref = useRef(null);     // Current EIP-1193 provider
//   const ethersRef = useRef(null);   // ethers BrowserProvider

//   // Helpers -------------------------------------------------------------

//   const ensureBSC = async (provider) => {
//     try {
//       await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN.hex }] });
//     } catch (err) {
//       // add chain if it doesn't exist
//       if (err?.code === 4902 || String(err?.message || "").includes("Unrecognized")) {
//         await provider.request({
//           method: "wallet_addEthereumChain",
//           params: [{
//             chainId: CHAIN.hex,
//             chainName: CHAIN.name,
//             nativeCurrency: CHAIN.nativeCurrency,
//             rpcUrls: [CHAIN.rpc],
//             blockExplorerUrls: [CHAIN.explorer]
//           }]
//         });
//       } else {
//         throw err;
//       }
//     }
//   };

//   const setProvider = (provider) => {
//     web3Ref.current = provider;
//     ethersRef.current = new ethers.BrowserProvider(provider, "any");
//   };

//   const readState = async () => {
//     const ethersProvider = ethersRef.current;
//     if (!ethersProvider) return;
//     const signer = await ethersProvider.getSigner();
//     const addr = await signer.getAddress();
//     const net = await ethersProvider.getNetwork();
//     const bal = await ethersProvider.getBalance(addr);
//     setAddress(addr);
//     setChainId(Number(net.chainId));
//     setBalance(Number(ethers.formatEther(bal)));
//     setConnected(true);
//   };

//   // Public actions ------------------------------------------------------

//   const connectInjected = async () => {
//     const provider = window.ethereum;
//     if (!provider) throw new Error("No injected wallet found");
//     await ensureBSC(provider);
//     await provider.request({ method: "eth_requestAccounts" });
//     setProvider(provider);
//     await readState();

//     // listeners
//     provider.on?.("accountsChanged", async () => readState());
//     provider.on?.("chainChanged", async () => readState());
//     provider.on?.("disconnect", () => disconnect());
//   };

// //   const connectWalletConnect = async () => {
// //     const projectId = import.meta.env.VITE_WC_PROJECT_ID;
// //     if (!projectId) throw new Error("Missing VITE_WC_PROJECT_ID");

// //     const ethprov = await EthereumProvider.init({
// //       projectId,
// //       chains: [CHAIN.chainId],
// //       optionalChains: [CHAIN.chainId],
// //       showQrModal: false,
// //       rpcMap: { [CHAIN.chainId]: CHAIN.rpc },
// //       methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_sign"],
// //       events: ["accountsChanged", "chainChanged", "disconnect"]
// //     });

// //     wcRef.current = ethprov;

// //     // show the QR (we capture the URI and render our own)
// //     ethprov.on("display_uri", (uri) => setWcUri(uri));

// //     await ethprov.connect();
// //     setProvider(ethprov);
// //     await readState();

// //     ethprov.on("accountsChanged", async () => readState());
// //     ethprov.on("chainChanged", async () => readState());
// //     ethprov.on("disconnect", () => disconnect());
// //   };
// const connectWalletConnect = async () => {
//   setWcUri(null); // reset UI first

//   const projectId = import.meta.env.VITE_WC_PROJECT_ID?.trim();
//   if (!projectId) {
//     console.error("WalletConnect: Missing VITE_WC_PROJECT_ID");
//     throw new Error("Missing VITE_WC_PROJECT_ID");
//   }

//   const chain = CHAIN.chainId;

//   try {
//     const ethprov = await EthereumProvider.init({
//       projectId,
//       chains: [chain],
//       optionalChains: [chain],
//       rpcMap: { [chain]: CHAIN.rpc },
//       showQrModal: false, // we render our own QR
//       methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_sign"],
//       events: ["accountsChanged", "chainChanged", "disconnect"],
//       metadata: {
//         name: "Forton",
//         description: "Forton dApp",
//         url: window.location.origin,
//         icons: ["https://raw.githubusercontent.com/walletconnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.png"]
//       }
//     });

//     wcRef.current = ethprov;

//     // Attach listeners BEFORE connect()
//     ethprov.on("display_uri", (uri) => {
//       console.info("[WC] display_uri:", uri);
//       setWcUri(uri); // this triggers the QR render in the modal
//     });
//     ethprov.on("disconnect", () => {
//       console.info("[WC] disconnected");
//       disconnect();
//     });

//     console.info("[WC] connecting…");
//     await ethprov.connect();        // display_uri should fire here
//     console.info("[WC] connected");
//     setProvider(ethprov);
//     await readState();
//   } catch (err) {
//     console.error("[WC] connect error:", err);
//     setWcUri(null);
//     throw err;
//   }
// };

//   const disconnect = async () => {
//     try { await wcRef.current?.disconnect?.(); } catch {}
//     try { await web3Ref.current?.disconnect?.(); } catch {}
//     setConnected(false);
//     setAddress(null);
//     setChainId(null);
//     setBalance(null);
//     setWcUri(null);
//     wcRef.current = null;
//     web3Ref.current = null;
//     ethersRef.current = null;
//   };

//   const refresh = async () => readState();

//   const value = useMemo(() => ({
//     // state
//     connected, address, chainId, balance, wcUri, CHAIN,
//     // actions
//     connectInjected, connectWalletConnect, disconnect, refresh
//   }), [connected, address, chainId, balance, wcUri]);

//   return (
//     <EVMWalletContext.Provider value={value}>
//       {children}
//     </EVMWalletContext.Provider>
//   );
// }
