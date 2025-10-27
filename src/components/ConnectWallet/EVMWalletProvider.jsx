// src/components/ConnectWallet/EVMWalletProvider.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { formatEther, getAddress } from "viem";
import { getPublicClient, getWalletClient, CHAIN, getRequiredChainId } from "../../lib/viemClients";

const EVMWalletContext = createContext(null);
export const useEVMWallet = () => useContext(EVMWalletContext);

function allInjectedProviders() {
  const eth = typeof window !== "undefined" ? window.ethereum : undefined;
  if (!eth) return [];
  if (Array.isArray(eth.providers) && eth.providers.length) return eth.providers;
  return [eth];
}

function matchById(id) {
  // Decide how to detect each wallet
  const tests = {
    metamask: (p) => p?.isMetaMask === true,
    trust:    (p) => p?.isTrust === true || p?.isTrustWallet === true,
    binance:  (p) => p?.isBinance === true || p?.isBinanceChain === true || p?.bnbChain?.isBNB === true,
    okx:      (p) => p?.isOkxWallet === true || p?.isOKExWallet === true,
    safepal:  (p) => p?.isSafePal === true || p?.isSafePalWallet === true,
  };
  return tests[id] || (() => false);
}

function pickInjectedProvider(targetId) {
  const providers = allInjectedProviders();
  if (!providers.length) return null;

  if (targetId) {
    const exact = providers.find((p) => matchById(targetId)(p));
    if (exact) return exact;
    // Explicit choice but not installed → signal to UI
    const err = new Error(`${targetId} not found. Please install or enable it.`);
    err.code = "WALLET_NOT_FOUND";
    throw err;
  }

  // Generic path (no explicit choice): prefer any non-Phantom EVM
  const nonPhantom = providers.find((p) => !p?.isPhantom);
  if (nonPhantom) return nonPhantom;

  return providers[0]; // last resort
}


export default function EVMWalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wcUri, setWcUri] = useState(null);
  const [error, setError] = useState("");

  const eip1193Ref = useRef(null);  // active provider (injected or WC)
  const wcRef = useRef(null);       // WalletConnect provider

  const publicClient = useMemo(() => getPublicClient(), []);

  const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  const setProvider = (prov) => { eip1193Ref.current = prov; };

  async function readState() {
    try {
      if (!eip1193Ref.current?.request) return;
      const [acc] = await eip1193Ref.current.request({ method: "eth_accounts" });
      const cid = await eip1193Ref.current.request({ method: "eth_chainId" });
      const checksummed = acc ? getAddress(acc) : null;
      setAddress(checksummed);
      setChainId(parseInt(cid, 16));
      setConnected(Boolean(checksummed));
      if (checksummed) {
        const bal = await publicClient.getBalance({ address: checksummed });
        setBalance(Number(formatEther(bal)));
      } else {
        setBalance(null);
      }
    } catch (e) {
      setError(e?.message || String(e));
    }
  }

  async function ensureBscChain(provider) {
    const required = getRequiredChainId(); // 56 or 97
    const hex = "0x" + required.toString(16);

    const currentHex = await provider.request({ method: "eth_chainId" });
    if (currentHex?.toLowerCase() === hex.toLowerCase()) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hex }],
      });
    } catch (switchErr) {
      // Add chain if missing
      if (switchErr?.code === 4902) {
        await provider.request({
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
        throw switchErr;
      }
    }
  }

  // ------- PUBLIC ACTIONS -------

  /** Connect a specific injected wallet by id (metamask, trust, binance, okx, safepal) */
  const connectInjected = async (id = "metamask") => {
    setError("");
    const provider = pickInjectedProvider(id);
    if (!provider) throw new Error("No injected wallet found");

    await ensureBscChain(provider);
    await provider.request({ method: "eth_requestAccounts" });
    setProvider(provider);
    await readState();

    // listeners
    provider.on?.("accountsChanged", readState);
    provider.on?.("chainChanged", readState);
    provider.on?.("disconnect", () => disconnect());
  };

  /** WalletConnect v2 (custom QR) */
  const connectWalletConnect = async () => {
    setError("");
    const projectId = import.meta.env.VITE_WC_PROJECT_ID;
    if (!projectId) throw new Error("VITE_WC_PROJECT_ID is missing.");

    try { await wcRef.current?.disconnect?.(); } catch {}

    const provider = await EthereumProvider.init({
      projectId,
      chains: [getRequiredChainId()],
      optionalChains: [getRequiredChainId()],
      showQrModal: false, // we render our own QR
      methods: ["eth_sendTransaction", "eth_signTransaction", "eth_signTypedData", "eth_sign", "personal_sign"],
      events: ["accountsChanged", "chainChanged", "disconnect"],
      rpcMap: { [getRequiredChainId()]: publicClient.transport.url },
    });

    wcRef.current = provider;

    provider.on("display_uri", (uri) => setWcUri(uri));
    provider.on("accountsChanged", readState);
    provider.on("chainChanged", readState);
    provider.on("disconnect", () => {
      setWcUri(null);
      disconnect();
    });

    await provider.enable();
    setWcUri(null);
    setProvider(provider);
    await readState();
  };

  const disconnect = async () => {
    try { await wcRef.current?.disconnect?.(); } catch {}
    eip1193Ref.current = null;
    setConnected(false);
    setAddress(null);
    setChainId(null);
    setBalance(null);
  };

  // expose a walletClient for viem write actions
  const walletClient = useMemo(() => {
    if (!eip1193Ref.current) return null;
    return getWalletClient(eip1193Ref.current);
  }, [eip1193Ref.current, chainId, address]);

  const value = useMemo(() => ({
    connected, address, chainId, balance,
    short, CHAIN,
    provider: eip1193Ref.current,
    walletClient,
    wcUri, error,
    connectInjected, connectWalletConnect, disconnect,
    ensureBscChain: (prov) => ensureBscChain(prov || eip1193Ref.current),
  }), [connected, address, chainId, balance, wcUri, error, walletClient]);

  return <EVMWalletContext.Provider value={value}>{children}</EVMWalletContext.Provider>;
}



// // src/components/ConnectWallet/EVMWalletProvider.jsx
// import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// import EthereumProvider from "@walletconnect/ethereum-provider";
// import { formatEther, getAddress } from "viem";
// import { getPublicClient, getWalletClient, CHAIN, getRequiredChainId } from "../../lib/viemClients";

// const EVMWalletContext = createContext(null);
// export const useEVMWallet = () => useContext(EVMWalletContext);

// export default function EVMWalletProvider({ children }) {
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState(null);
//   const [chainId, setChainId] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [wcUri, setWcUri] = useState(null);
//   const [error, setError] = useState("");

//   // live provider refs
//   const eip1193Ref = useRef(null);  // active provider (injected or WC)
//   const wcRef = useRef(null);       // WalletConnect provider instance

//   const publicClient = useMemo(() => getPublicClient(), []);

//   const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

//   const setProvider = (prov) => {
//     eip1193Ref.current = prov;
//   };

//   async function readState() {
//     try {
//       if (!eip1193Ref.current?.request) return;
//       const [acc] = await eip1193Ref.current.request({ method: "eth_accounts" });
//       const cid = await eip1193Ref.current.request({ method: "eth_chainId" });
//       setAddress(acc ? getAddress(acc) : null);
//       setChainId(parseInt(cid, 16));
//       setConnected(Boolean(acc));
//       if (acc) {
//         const bal = await publicClient.getBalance({ address: getAddress(acc) });
//         setBalance(Number(formatEther(bal)));
//       } else {
//         setBalance(null);
//       }
//     } catch (e) {
//       setError(e?.message || "Failed to read wallet state");
//     }
//   }

//   /** Ask wallet to switch/add the required BSC chain before any tx */
//   async function ensureBscChain() {
//     const required = getRequiredChainId();
//     const hex = "0x" + required.toString(16);
//     try {
//       const cidHex = await eip1193Ref.current.request({ method: "eth_chainId" });
//       if (parseInt(cidHex, 16) === required) return;
//     } catch (_) {}

//     try {
//       await eip1193Ref.current.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: hex }],
//       });
//     } catch (err) {
//       // add if missing
//       if (String(err?.code) === "4902" || /Unrecognized chain ID/i.test(err?.message || "")) {
//         await eip1193Ref.current.request({
//           method: "wallet_addEthereumChain",
//           params: [{
//             chainId: hex,
//             chainName: CHAIN.name,
//             nativeCurrency: CHAIN.nativeCurrency,
//             rpcUrls: [publicClient.transport.url],
//             blockExplorerUrls: [CHAIN.blockExplorers?.default?.url].filter(Boolean),
//           }],
//         });
//       } else {
//         throw err;
//       }
//     }
//   }

//   async function connectInjected() {
//     setError("");
//     if (!window.ethereum?.request) {
//       setError("No injected wallet found (MetaMask / Trust / OKX / Binance Web3).");
//       return;
//     }
//     setProvider(window.ethereum);

//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     await ensureBscChain();
//     await readState();

//     // subscribe to changes
//     window.ethereum.on?.("accountsChanged", readState);
//     window.ethereum.on?.("chainChanged", readState);
//   }

//   async function connectWalletConnect() {
//     setError("");
//     const projectId = import.meta.env.VITE_WC_PROJECT_ID;
//     if (!projectId) {
//       setError("VITE_WC_PROJECT_ID is missing.");
//       return;
//     }

//     // close previous session
//     try { await wcRef.current?.disconnect?.(); } catch (_) {}

//     const provider = await EthereumProvider.init({
//       projectId,
//       chains: [getRequiredChainId()],
//       optionalChains: [getRequiredChainId()],
//       showQrModal: false, // we'll render our own QR
//       methods: ["eth_sendTransaction", "eth_signTransaction", "eth_signTypedData", "personal_sign", "eth_accounts", "eth_requestAccounts", "wallet_switchEthereumChain", "wallet_addEthereumChain"],
//       events: ["chainChanged", "accountsChanged", "session_delete", "connect", "disconnect", "display_uri"],
//     });

//     wcRef.current = provider;

//     provider.on("display_uri", (uri) => setWcUri(uri));
//     provider.on("connect", async () => {
//       setProvider(provider);
//       await ensureBscChain();
//       await readState();
//     });
//     provider.on("accountsChanged", readState);
//     provider.on("chainChanged", readState);
//     provider.on("disconnect", () => {
//       setConnected(false);
//       setAddress(null);
//       setChainId(null);
//       setBalance(null);
//       setWcUri(null);
//     });

//     await provider.connect();
//   }

//   async function disconnect() {
//     setError("");
//     try { await wcRef.current?.disconnect?.(); } catch (_) {}
//     try { await eip1193Ref.current?.disconnect?.(); } catch (_) {}

//     setConnected(false);
//     setAddress(null);
//     setChainId(null);
//     setBalance(null);
//     setWcUri(null);

//     // remove listeners on injected
//     window.ethereum?.removeListener?.("accountsChanged", readState);
//     window.ethereum?.removeListener?.("chainChanged", readState);
//   }

//   async function refresh() { await readState(); }

//   const value = useMemo(() => ({
//     // state
//     connected, address, chainId, balance, wcUri, CHAIN,
//     // raw provider (pass to viem wallet client)
//     provider: eip1193Ref.current,
//     // actions
//     connectInjected, connectWalletConnect, disconnect, refresh, ensureBscChain,
//     error,
//     shortAddress: short(address),
//   }), [connected, address, chainId, balance, wcUri, error]);

//   // initial read if already connected
//   useEffect(() => {
//     if (window.ethereum?.isConnected?.()) {
//       setProvider(window.ethereum);
//       readState();
//       window.ethereum.on?.("accountsChanged", readState);
//       window.ethereum.on?.("chainChanged", readState);
//     }
//     return () => {
//       window.ethereum?.removeListener?.("accountsChanged", readState);
//       window.ethereum?.removeListener?.("chainChanged", readState);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <EVMWalletContext.Provider value={value}>{children}</EVMWalletContext.Provider>;
// }



