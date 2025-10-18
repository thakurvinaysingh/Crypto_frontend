import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";

const EVMWalletContext = createContext(null);
export const useEVMWallet = () => useContext(EVMWalletContext);

const CHAINS = {
  mainnet: {
    chainId: 56,
    hex: "0x38",
    name: "BNB Smart Chain",
    rpc: import.meta.env.VITE_BSC_RPC_MAINNET || "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }
  },
  testnet: {
    chainId: 97,
    hex: "0x61",
    name: "BNB Smart Chain Testnet",
    rpc: import.meta.env.VITE_BSC_RPC_TESTNET || "https://data-seed-prebsc-1-s1.binance.org:8545/",
    explorer: "https://testnet.bscscan.com",
    nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 }
  }
};

export default function EVMWalletProvider({ children }) {
  const netKey = (import.meta.env.VITE_BSC_NETWORK || "mainnet").toLowerCase();
  const CHAIN = CHAINS[netKey] ?? CHAINS.mainnet;

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wcUri, setWcUri] = useState(null);

  const wcRef = useRef(null);       // WalletConnect provider
  const web3Ref = useRef(null);     // Current EIP-1193 provider
  const ethersRef = useRef(null);   // ethers BrowserProvider

  // Helpers -------------------------------------------------------------

  const ensureBSC = async (provider) => {
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN.hex }] });
    } catch (err) {
      // add chain if it doesn't exist
      if (err?.code === 4902 || String(err?.message || "").includes("Unrecognized")) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: CHAIN.hex,
            chainName: CHAIN.name,
            nativeCurrency: CHAIN.nativeCurrency,
            rpcUrls: [CHAIN.rpc],
            blockExplorerUrls: [CHAIN.explorer]
          }]
        });
      } else {
        throw err;
      }
    }
  };

  const setProvider = (provider) => {
    web3Ref.current = provider;
    ethersRef.current = new ethers.BrowserProvider(provider, "any");
  };

  const readState = async () => {
    const ethersProvider = ethersRef.current;
    if (!ethersProvider) return;
    const signer = await ethersProvider.getSigner();
    const addr = await signer.getAddress();
    const net = await ethersProvider.getNetwork();
    const bal = await ethersProvider.getBalance(addr);
    setAddress(addr);
    setChainId(Number(net.chainId));
    setBalance(Number(ethers.formatEther(bal)));
    setConnected(true);
  };

  // Public actions ------------------------------------------------------

  const connectInjected = async () => {
    const provider = window.ethereum;
    if (!provider) throw new Error("No injected wallet found");
    await ensureBSC(provider);
    await provider.request({ method: "eth_requestAccounts" });
    setProvider(provider);
    await readState();

    // listeners
    provider.on?.("accountsChanged", async () => readState());
    provider.on?.("chainChanged", async () => readState());
    provider.on?.("disconnect", () => disconnect());
  };

//   const connectWalletConnect = async () => {
//     const projectId = import.meta.env.VITE_WC_PROJECT_ID;
//     if (!projectId) throw new Error("Missing VITE_WC_PROJECT_ID");

//     const ethprov = await EthereumProvider.init({
//       projectId,
//       chains: [CHAIN.chainId],
//       optionalChains: [CHAIN.chainId],
//       showQrModal: false,
//       rpcMap: { [CHAIN.chainId]: CHAIN.rpc },
//       methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_sign"],
//       events: ["accountsChanged", "chainChanged", "disconnect"]
//     });

//     wcRef.current = ethprov;

//     // show the QR (we capture the URI and render our own)
//     ethprov.on("display_uri", (uri) => setWcUri(uri));

//     await ethprov.connect();
//     setProvider(ethprov);
//     await readState();

//     ethprov.on("accountsChanged", async () => readState());
//     ethprov.on("chainChanged", async () => readState());
//     ethprov.on("disconnect", () => disconnect());
//   };
const connectWalletConnect = async () => {
  setWcUri(null); // reset UI first

  const projectId = import.meta.env.VITE_WC_PROJECT_ID?.trim();
  if (!projectId) {
    console.error("WalletConnect: Missing VITE_WC_PROJECT_ID");
    throw new Error("Missing VITE_WC_PROJECT_ID");
  }

  const chain = CHAIN.chainId;

  try {
    const ethprov = await EthereumProvider.init({
      projectId,
      chains: [chain],
      optionalChains: [chain],
      rpcMap: { [chain]: CHAIN.rpc },
      showQrModal: false, // we render our own QR
      methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_sign"],
      events: ["accountsChanged", "chainChanged", "disconnect"],
      metadata: {
        name: "Forton",
        description: "Forton dApp",
        url: window.location.origin,
        icons: ["https://raw.githubusercontent.com/walletconnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.png"]
      }
    });

    wcRef.current = ethprov;

    // Attach listeners BEFORE connect()
    ethprov.on("display_uri", (uri) => {
      console.info("[WC] display_uri:", uri);
      setWcUri(uri); // this triggers the QR render in the modal
    });
    ethprov.on("disconnect", () => {
      console.info("[WC] disconnected");
      disconnect();
    });

    console.info("[WC] connecting…");
    await ethprov.connect();        // display_uri should fire here
    console.info("[WC] connected");
    setProvider(ethprov);
    await readState();
  } catch (err) {
    console.error("[WC] connect error:", err);
    setWcUri(null);
    throw err;
  }
};

  const disconnect = async () => {
    try { await wcRef.current?.disconnect?.(); } catch {}
    try { await web3Ref.current?.disconnect?.(); } catch {}
    setConnected(false);
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setWcUri(null);
    wcRef.current = null;
    web3Ref.current = null;
    ethersRef.current = null;
  };

  const refresh = async () => readState();

  const value = useMemo(() => ({
    // state
    connected, address, chainId, balance, wcUri, CHAIN,
    // actions
    connectInjected, connectWalletConnect, disconnect, refresh
  }), [connected, address, chainId, balance, wcUri]);

  return (
    <EVMWalletContext.Provider value={value}>
      {children}
    </EVMWalletContext.Provider>
  );
}
