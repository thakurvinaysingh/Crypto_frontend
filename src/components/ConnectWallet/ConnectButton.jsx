import { motion } from "framer-motion";
import { useEVMWallet } from "./EVMWalletProvider";

export default function ConnectButton({ onOpen }) {
  const { connected, address, balance, CHAIN, disconnect, refresh } = useEVMWallet();

  if (connected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={refresh}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white/85"
          title="Refresh balance"
        >
          {short} • {balance?.toFixed?.(4) ?? "—"} {CHAIN.nativeCurrency.symbol}
        </button>
        <button
          onClick={disconnect}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-red-300/90 hover:text-red-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 text-white font-medium shadow-lg shadow-black/30 ring-1 ring-white/10"
    >
      Connect Wallet
    </motion.button>
  );
}


