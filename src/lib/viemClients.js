import { createPublicClient, createWalletClient, http, custom } from "viem";
import { bsc, bscTestnet } from "viem/chains";

export const NETWORK = (import.meta.env.VITE_BSC_NETWORK ?? "testnet").toLowerCase();
export const CHAIN = NETWORK === "mainnet" ? bsc : bscTestnet;

/** Prefer explicit RPCs but fall back to stable public endpoints */
export function getRpcUrl() {
  if (NETWORK === "mainnet") {
    return (
      import.meta.env.VITE_BSC_RPC_URL ||
      "https://bsc-dataseed.binance.org/"
    );
  }
  return (
    import.meta.env.VITE_BSC_RPC_TESTNET ||
    "https://bsc-testnet.blockpi.network/v1/rpc/public"
  );
}

export function getPublicClient() {
  return createPublicClient({ chain: CHAIN, transport: http(getRpcUrl()) });
}

export function getWalletClient(eip1193Provider) {
  return createWalletClient({ chain: CHAIN, transport: custom(eip1193Provider) });
}

/** 56 (mainnet) or 97 (testnet) – used by guards & ensure-chain logic */
export function getRequiredChainId() {
  return CHAIN.id;
}




// import { createPublicClient, createWalletClient, http, custom } from "viem";
// import { bsc } from "viem/chains";

// export function getPublicClient() {
//   const rpc = import.meta.env.VITE_BSC_RPC_URL;
//   return createPublicClient({ chain: bsc, transport: http(rpc) });
// }

// // Pass any EIP-1193 provider: window.ethereum OR a WalletConnect provider
// export function getWalletClient(eip1193Provider) {
//   return createWalletClient({ chain: bsc, transport: custom(eip1193Provider) });
// }
