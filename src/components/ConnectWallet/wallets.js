import { TbApps } from "react-icons/tb";
import { FiShield, FiKey, FiBox, FiSmartphone, FiClock } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi";

/**
 * Featured wallets - shown first in the modal
 * Priority: Most popular on BSC
 */
export const featuredWallets = [
  { 
    id: "metamask", 
    name: "MetaMask", 
    iconBg: "bg-gradient-to-br from-[#F6851B] to-[#E2761B]", 
    Icon: FiShield, 
    type: "injected",
    badge: "Popular"
  },
  { 
    id: "trust", 
    name: "Trust Wallet", 
    iconBg: "bg-gradient-to-br from-[#3375BB] to-[#2563A8]", 
    Icon: FiSmartphone, 
    type: "injected",
    badge: "Popular"
  },
  { 
    id: "binance", 
    name: "Binance Web3", 
    iconBg: "bg-gradient-to-br from-[#F3BA2F] to-[#E0A71B]", 
    Icon: FiBox, 
    type: "injected"
  },
  { 
    id: "view-all", 
    name: "View All", 
    iconBg: "bg-gradient-to-br from-[#2B2F36] to-[#1A1D23]", 
    Icon: TbApps, 
    isViewAll: true 
  },
];

/**
 * All supported wallets - shown in "View All" mode
 * Includes mobile DApp browsers
 */
export const allWallets = [
  // Desktop & Mobile
  { 
    id: "metamask", 
    name: "MetaMask", 
    iconBg: "bg-gradient-to-br from-[#F6851B] to-[#E2761B]", 
    Icon: FiShield, 
    type: "injected",
    badge: "Popular"
  },
  { 
    id: "trust", 
    name: "Trust Wallet", 
    iconBg: "bg-gradient-to-br from-[#3375BB] to-[#2563A8]", 
    Icon: FiSmartphone, 
    type: "injected",
    badge: "Popular"
  },
  { 
    id: "binance", 
    name: "Binance Web3", 
    iconBg: "bg-gradient-to-br from-[#F3BA2F] to-[#E0A71B]", 
    Icon: FiBox, 
    type: "injected"
  },
  
  // Mobile-First Wallets
  { 
    id: "tokenpocket", 
    name: "TokenPocket", 
    iconBg: "bg-gradient-to-br from-[#2980FE] to-[#1E6DD6]", 
    Icon: FiSmartphone, 
    type: "injected"
  },
  { 
    id: "mathwallet", 
    name: "MathWallet", 
    iconBg: "bg-gradient-to-br from-[#000000] to-[#1A1A1A]", 
    Icon: FiKey, 
    type: "injected"
  },
  { 
    id: "safepal", 
    name: "SafePal", 
    iconBg: "bg-gradient-to-br from-[#5B6BE1] to-[#4857C4]", 
    Icon: FiShield, 
    type: "injected"
  },
  
  // Desktop Wallets
  { 
    id: "okx", 
    name: "OKX Wallet", 
    iconBg: "bg-gradient-to-br from-[#000000] to-[#1A1A1A]", 
    Icon: FiBox, 
    type: "injected"
  },
  
  // WalletConnect (Universal)
  { 
    id: "walletconnect", 
    name: "WalletConnect", 
    iconBg: "bg-gradient-to-br from-[#3B99FC] to-[#2B7FD8]", 
    Icon: HiOutlineGlobeAlt, 
    type: "walletconnect"
  },
];

/**
 * Helper: Get wallet display info by ID
 */
export function getWalletById(id) {
  return allWallets.find(w => w.id === id) || featuredWallets.find(w => w.id === id);
}

/**
 * Helper: Check if wallet is likely available
 * (Checks window injections for mobile wallets)
 */
export function isWalletAvailable(id) {
  if (typeof window === "undefined") return false;

  const checks = {
    metamask: () => window.ethereum?.isMetaMask === true,
    trust: () => window.ethereum?.isTrust === true || window.trustwallet !== undefined,
    binance: () => window.BinanceChain !== undefined || window.ethereum?.isBinance === true,
    tokenpocket: () => window.tokenpocket !== undefined || window.ethereum?.isTokenPocket === true,
    mathwallet: () => window.ethereum?.isMathWallet === true,
    safepal: () => window.safepalProvider !== undefined || window.ethereum?.isSafePal === true,
    okx: () => window.okxwallet !== undefined || window.ethereum?.isOkxWallet === true,
    walletconnect: () => true, // Always available via QR
  };

  return checks[id]?.() || false;
}

/**
 * Helper: Get install URL for wallet
 */
export function getWalletInstallUrl(id) {
  const urls = {
    metamask: "https://metamask.io/download/",
    trust: "https://trustwallet.com/download",
    binance: "https://www.binance.com/en/web3wallet",
    tokenpocket: "https://www.tokenpocket.pro/en/download/app",
    mathwallet: "https://mathwallet.org/",
    safepal: "https://www.safepal.com/download",
    okx: "https://www.okx.com/web3",
    walletconnect: null, // No install needed
  };

  return urls[id];
}




// import { TbApps } from "react-icons/tb";
// import { FiShield, FiKey, FiBox, FiSmartphone } from "react-icons/fi";


// export const featuredWallets = [
//   { id: "metamask", name: "MetaMask",     iconBg: "bg-[#F6851B]", Icon: FiShield,    type: "injected" },
//   { id: "trust",    name: "Trust Wallet", iconBg: "bg-[#3375BB]", Icon: FiSmartphone,type: "injected" },
//   { id: "binance",  name: "Binance Web3", iconBg: "bg-[#F3BA2F]", Icon: FiBox,       type: "injected" },
//   { id: "view-all", name: "View all wallets", iconBg: "bg-[#2B2F36]", Icon: TbApps, isViewAll: true },
// ];

// export const allWallets = [
//   { id: "metamask",      name: "MetaMask",       iconBg: "bg-[#F6851B]", Icon: FiShield,     type: "injected" },
//   { id: "trust",         name: "Trust Wallet",   iconBg: "bg-[#3375BB]", Icon: FiSmartphone, type: "injected" },
//   { id: "binance",       name: "Binance Web3",   iconBg: "bg-[#F3BA2F]", Icon: FiBox,        type: "injected" },
//   { id: "okx",           name: "OKX Wallet",     iconBg: "bg-[#111111]", Icon: FiShield,     type: "injected" },
//   { id: "safepal",       name: "SafePal",        iconBg: "bg-[#5B6BE1]", Icon: FiKey,        type: "injected" },
//   { id: "walletconnect", name: "WalletConnect",  iconBg: "bg-[#3B99FC]", Icon: TbApps,       type: "walletconnect" },
// ];
