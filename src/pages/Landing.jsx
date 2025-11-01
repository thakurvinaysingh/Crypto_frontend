// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from "../assets/Gain-USDT-2.png";
import { useDispatch, useSelector } from "react-redux";
import { openPreview, closePreview, setQuery } from "../store/slices/uiSlice";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { FaSearch } from "react-icons/fa";

import useWalletModal from "../hooks/useWalletModal";
import ConnectButton from "../components/ConnectWallet/ConnectButton";
import WalletModal from "../components/ConnectWallet/WalletModal";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";

export default function Landing() {
  const { previewOpen, query } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { connected, address, error } = useEVMWallet();

  const openDashboard = () => {
    // Allow preview for any non-empty user ID; UI unchanged
    if ((query || "").trim().length) {
      nav("/dashboard", { replace: true });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") openDashboard();
  };

  const { isOpen, open, close } = useWalletModal();

  useEffect(() => {
    if (connected) nav("/onboard", { replace: true });
  }, [connected, nav]);

  return (
    <section className="relative">
      {/* Hero */}
      <div className="mx-auto max-w-4xl pt-0 sm:pt-0 md:pt-0">
        <img
          src={Logo}
          alt="Gain USDT"
          className="mx-auto w-[85%] max-w-[920px] md:w-[78%] lg:w-[42%] select-none pointer-events-none"
          draggable="false"
        />
      </div>

      {/* Headline + actions */}
      <div className="mt-0 sm:mt-8 md:mt-0">
        <h1 className="text-center leading-tight font-semibold text-[28px] sm:text-[34px] md:text-[34px]">
          <span className="block">Earn with friends</span>
          <span className="block mt-1.5 bg-gradient-to-r from-gold-400 to-gold-700 bg-clip-text text-transparent">
            here and now.
          </span>
        </h1>

        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          {/* Connect button opens modal */}
          <ConnectButton onOpen={open} />

          <button
            aria-label="Open preview"
            onClick={() => dispatch(openPreview())}
            className="
              btn-circle
              bg-gold-700/15 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60
            "
          >
            <FaSearch className="h-6 w-6 hover:bg-gold-500/25" />
          </button>
        </div>

        {/* Small status line (optional) */}
        <div className="mt-3 text-center text-xs text-white/60">
          {connected ? (
            <>
              Connected: <span className="font-mono">{address}</span>
            </>
          ) : (
            "Not connected"
          )}
          {error ? <span className="text-red-400 ml-2">• {error}</span> : null}
        </div>
      </div>

      {/* Preview modal */}
      <Modal open={previewOpen} onClose={() => dispatch(closePreview())}>
        <h3 className="text-2xl font-semibold mb-1">Preview mode</h3>
        <p className="text-white/70 mb-4">Enter user ID to preview their data</p>
        <input
          autoFocus
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onKeyDown={onKeyDown}
          placeholder="Enter user ID"
          className="input mb-4"
        />
        <Button className="w-full" onClick={openDashboard}>
          Open dashboard
        </Button>
      </Modal>

      {/* Wallet modal (auto-scan WC QR on open) */}
      <WalletModal isOpen={isOpen} onClose={close} autoScanOnOpen />

      <div className="h-safe" />
    </section>
  );
}


