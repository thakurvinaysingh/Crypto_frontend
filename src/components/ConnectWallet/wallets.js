import { TbApps } from "react-icons/tb";
import { FiShield, FiKey, FiBox, FiSmartphone } from "react-icons/fi";


export const featuredWallets = [
  { id: "metamask", name: "MetaMask",     iconBg: "bg-[#F6851B]", Icon: FiShield,    type: "injected" },
  { id: "trust",    name: "Trust Wallet", iconBg: "bg-[#3375BB]", Icon: FiSmartphone,type: "injected" },
  { id: "binance",  name: "Binance Web3", iconBg: "bg-[#F3BA2F]", Icon: FiBox,       type: "injected" },
  { id: "view-all", name: "View all wallets", iconBg: "bg-[#2B2F36]", Icon: TbApps, isViewAll: true },
];

export const allWallets = [
  { id: "metamask",      name: "MetaMask",       iconBg: "bg-[#F6851B]", Icon: FiShield,     type: "injected" },
  { id: "trust",         name: "Trust Wallet",   iconBg: "bg-[#3375BB]", Icon: FiSmartphone, type: "injected" },
  { id: "binance",       name: "Binance Web3",   iconBg: "bg-[#F3BA2F]", Icon: FiBox,        type: "injected" },
  { id: "okx",           name: "OKX Wallet",     iconBg: "bg-[#111111]", Icon: FiShield,     type: "injected" },
  { id: "safepal",       name: "SafePal",        iconBg: "bg-[#5B6BE1]", Icon: FiKey,        type: "injected" },
  { id: "walletconnect", name: "WalletConnect",  iconBg: "bg-[#3B99FC]", Icon: TbApps,       type: "walletconnect" },
];
