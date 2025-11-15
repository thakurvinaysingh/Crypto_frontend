import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useEVMWallet } from "./EVMWalletProvider";
import WalletList from "./WalletList";
import { featuredWallets, allWallets } from "./wallets";

export default function WalletModal({ isOpen, onClose, autoScanOnOpen = true }) {
  const { 
    connectInjected, 
    connectWalletConnect, 
    connected, 
    address, 
    balance, 
    CHAIN, 
    wcUri, 
    disconnect,
    isConnecting,
    isDisconnecting, // 🆕 Get disconnect state
    error: walletError 
  } = useEVMWallet();
  
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);
  const [qr, setQr] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const startedRef = useRef(false);

  const featured = useMemo(() => featuredWallets, []);
  const all = useMemo(() => allWallets, []);

  // Combine errors
  const displayError = localError || walletError;

  // 🔧 FIX #1: Generate QR with proper sizing
  useEffect(() => {
    if (!wcUri) {
      setQr(null);
      return;
    }
    
    // Responsive QR size
    const isMobile = window.innerWidth < 640;
    const qrSize = isMobile ? 280 : 320;
    
    QRCode.toDataURL(wcUri, { 
      margin: 1, 
      width: qrSize,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    })
      .then(setQr)
      .catch((err) => {
        console.error("QR generation failed:", err);
        setQr(null);
      });
  }, [wcUri]);

  // Reset view when connected
  useEffect(() => {
    if (connected) {
      setViewAll(false);
      setQrError(null);
      setLocalError(null);
    }
  }, [connected]);

  // 🔧 FIX #2: Better auto-connect logic with error handling
  useEffect(() => {
    if (!isOpen) {
      startedRef.current = false;
      setQrError(null);
      setLocalError(null);
      return;
    }

    if (connected && !wcUri && !startedRef.current && !isConnecting) {
      startedRef.current = true;
      
      connectWalletConnect().catch((err) => {
        console.error("Auto WalletConnect failed:", err);
        const message = err?.message || "Failed to start WalletConnect.";
        setQrError(message);
        setLocalError(message);
        startedRef.current = false;
      });
    }
  }, [isOpen, connected, wcUri, isConnecting, connectWalletConnect]);

  // 🔧 FIX #3: Enhanced wallet picker with better error handling
  const handlePick = async (id) => {
    setLocalError(null);
    setQrError(null);

    try {
      if (["metamask", "binance", "trust", "okx", "safepal", "tokenpocket", "mathwallet"].includes(id)) {
        await connectInjected(id);
      } else if (id === "walletconnect") {
        startedRef.current = true;
        await connectWalletConnect();
      }
    } catch (err) {
      console.error(`Connection to ${id} failed:`, err);
      const message = err?.message || `Failed to connect to ${id}`;
      setLocalError(message);
      setQrError(message);
    }
  };

  // 🆕 Handle disconnect and close
  const handleClose = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      onClose?.();
      navigate("/");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // Close on backdrop click
            if (e.target === e.currentTarget) handleClose();
          }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm grid place-items-center px-3 py-4 overflow-y-auto"
          aria-modal="true"
          role="dialog"
          aria-labelledby="wallet-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[520px] rounded-[24px] sm:rounded-[28px] bg-[#14181F]/98 text-white shadow-2xl ring-1 ring-white/10 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔧 FIX #4: Mobile-optimized header */}
            <div className="px-4 sm:px-5 py-3.5 sm:py-5 flex items-center justify-between border-b border-white/5">
              <h2 
                id="wallet-modal-title"
                className="text-base sm:text-lg font-semibold truncate pr-2"
              >
                {viewAll ? "All Wallets" : connected ? "Wallet Connected" : "Connect Wallet"}
              </h2>
              <button
                onClick={handleClose}
                disabled={isConnecting}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 grid place-items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Close wallet modal"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  aria-hidden="true"
                  className="text-white/90"
                >
                  <path 
                    d="M6 6l12 12M18 6l-12 12" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              </button>
            </div>

            {/* 🔧 FIX #5: Responsive body with proper spacing */}
            <div className="px-3 sm:px-5 md:px-6 py-4 sm:py-5 max-h-[calc(100vh-120px)] overflow-y-auto">
              
              {/* Error Banner */}
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 sm:p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <svg 
                      className="w-5 h-5 flex-shrink-0 mt-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <div className="flex-1 break-words">{displayError}</div>
                  </div>
                </motion.div>
              )}

              {/* Not Connected - Main View */}
              {!connected && !viewAll && (
                <>
                  {/* 🔧 FIX #6: Mobile-optimized QR section */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 text-center px-2">
                        Scan with your mobile wallet
                      </div>

                      {/* Responsive QR container */}
                      <div className="w-full max-w-[280px] sm:max-w-[320px]">
                        <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 aspect-square grid place-items-center">
                          {isConnecting && !qr ? (
                            <div className="flex flex-col items-center gap-2 text-black/60">
                              <svg 
                                className="animate-spin h-8 w-8 sm:h-10 sm:w-10" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                />
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <div className="text-xs sm:text-sm text-center">
                                Preparing session...
                              </div>
                            </div>
                          ) : qr ? (
                            <img 
                              src={qr} 
                              alt="WalletConnect QR Code" 
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="text-black/50 text-xs sm:text-sm text-center px-3 sm:px-4">
                              {qrError ? "Session failed to start" : "Select a wallet to begin"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Retry button if QR failed */}
                      {qrError && !isConnecting && (
                        <button
                          onClick={() => {
                            setQrError(null);
                            setLocalError(null);
                            startedRef.current = false;
                            handlePick("walletconnect");
                          }}
                          className="mt-3 sm:mt-4 px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white text-black hover:bg-white/90 active:bg-white/80 border border-black/10 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Wallets Section */}
                  <div className="mb-4">
                    <h3 className="text-xs sm:text-sm text-white/70 font-medium mb-2 sm:mb-3 px-0.5">
                      Available Wallets
                    </h3>
                    <WalletList
                      wallets={featured}
                      compact
                      withViewAllTile
                      onPick={(id) => (id === "view-all" ? setViewAll(true) : handlePick(id))}
                      onViewAll={() => setViewAll(true)}
                      ariaLabel="Featured wallets"
                    />
                  </div>

                  {/* 🔧 FIX #7: Mobile-friendly footer */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                    <div className="text-white/85 font-medium">
                      BEP-20 • BNB Smart Chain
                    </div>
                    <div className="text-white/50 text-xs">
                      Chain ID: {CHAIN.id}
                    </div>
                  </div>
                </>
              )}

              {/* Not Connected - View All */}
              {!connected && viewAll && (
                <>
                  <div className="mb-4">
                    <WalletList
                      wallets={all}
                      compact={false}
                      withViewAllTile={false}
                      onPick={handlePick}
                      ariaLabel="All available wallets"
                    />
                  </div>

                  <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="text-white/85">All Wallets</div>
                    <button
                      onClick={() => setViewAll(false)}
                      className="text-white/70 hover:text-white underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              {/* Connected State */}
              {connected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Address */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">
                      Wallet Address
                    </div>
                    <div className="font-mono text-xs sm:text-sm break-all text-white/95">
                      {address}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">
                      Balance
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-white/95">
                      {balance?.toFixed?.(6) ?? "—"} {CHAIN.nativeCurrency.symbol}
                    </div>
                  </div>

                  {/* Success indicator */}
                  <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-300 text-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Wallet Connected Successfully</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import QRCode from "qrcode";
// import { useEVMWallet } from "./EVMWalletProvider";
// import WalletList from "./WalletList";
// import { featuredWallets, allWallets } from "./wallets";

// export default function WalletModal({ isOpen, onClose, autoScanOnOpen = true }) {
//   const { connectInjected, connectWalletConnect, connected, address, balance, CHAIN, wcUri,disconnect } = useEVMWallet();
//   const navigate = useNavigate();
//   const [viewAll, setViewAll] = useState(false);
//   const [qr, setQr] = useState(null);
//   const [qrError, setQrError] = useState(null);
//   const startedRef = useRef(false); // prevent multiple WC sessions

//   const featured = useMemo(() => featuredWallets, []);
//   const all = useMemo(() => allWallets, []);

//   // Build QR image when wcUri changes
//   useEffect(() => {
//     if (!wcUri) { setQr(null); return; }
//     QRCode.toDataURL(wcUri, { margin: 1, width: 560 })
//       .then(setQr)
//       .catch(() => setQr(null));
//   }, [wcUri]);

//   // Reset “view all” when connected
//   useEffect(() => { if (connected) setViewAll(false); }, [connected]);

//   // 🔸 Auto-open scanner when modal opens
//   useEffect(() => {
//     if (!isOpen) { startedRef.current = false; setQrError(null); return; }
//     if (autoScanOnOpen && !connected && !wcUri && !startedRef.current) {
//       startedRef.current = true;
//       connectWalletConnect().catch((err) => {
//         setQrError(err?.message || "Failed to start WalletConnect.");
//         startedRef.current = false;
//       });
//     }
//   }, [isOpen, autoScanOnOpen, connected, wcUri, connectWalletConnect]);

//   const handlePick = async (id) => {
//     if (["metamask", "binance", "trust", "okx", "safepal"].includes(id)) {
//       await connectInjected(id);
//       return;
//     }
//     if (id === "walletconnect") {
//       await connectWalletConnect(); 
//       return;
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm grid place-items-center px-3 sm:px-4"
//           aria-modal="true" role="dialog"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.98 }}
//             transition={{ type: "spring", stiffness: 260, damping: 24 }}
//             className="w-full max-w-[440px] sm:max-w-[520px] rounded-[28px] bg-[#14181F]/95 text-white shadow-2xl ring-1 ring-white/10 overflow-hidden"
//           >
//             {/* Header */}
//             <div className="px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between">
//               <h2 className="text-base sm:text-lg font-semibold">
//                 {viewAll ? "Wallets" : connected ? "Wallet connected" : "Connect your wallet"}
//               </h2>
//               <button
//                     onClick={async () => {
//                   try { await disconnect(); } finally {
//                     onClose?.();
//                     navigate("/");
//                   }
//                 }}
//                 className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
//                 aria-label="Close"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                   <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="px-4 sm:px-6 pb-4 sm:pb-6">
//               {!connected && !viewAll && (
//                 <>
//                   {/* QR area */}
//                   <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
//                     <div className="flex flex-col items-center">
//                       <div className="text-sm text-white/80 mb-2 sm:mb-3">Scan with your mobile wallet</div>

//                       <div className="w-full max-w-[320px] sm:max-w-[360px]">
//                         <div className="rounded-2xl bg-white text-black p-3 aspect-square grid place-items-center">
//                           {qr ? (
//                             <img src={qr} alt="WalletConnect QR" className="w-full h-full object-contain rounded-xl" />
//                           ) : (
//                             <div className="text-black/50 text-xs sm:text-sm text-center px-4">
//                               {qrError ? "Couldn’t start session." : "Preparing secure session…"}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Fallback button only if auto-start fails */}
//                       {qrError && (
//                         <button
//                           onClick={connectWalletConnect}
//                           className="mt-3 sm:mt-4 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-white/90 border border-black/10 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
//                         >
//                           Try again
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Wallets */}
//                   <h3 className="mt-4 text-sm text-white/80">Available wallets</h3>
//                   <div className="mt-2">
//                     <WalletList
//                       wallets={featured}
//                       compact
//                       withViewAllTile
//                       onPick={(id) => (id === "view-all" ? setViewAll(true) : handlePick(id))}
//                       onViewAll={() => setViewAll(true)}
//                       ariaLabel="Featured wallets"
//                     />
//                   </div>

//                   {/* Footer strip */}
//                   <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm flex items-center justify-between">
//                     <div className="text-white/90">BEP-20 • BNB Smart Chain</div>
//                     <div className="text-white/50 text-xs">Chain ID: {CHAIN.chainId}</div>
//                   </div>
//                 </>
//               )}

//               {!connected && viewAll && (
//                 <>
//                   <WalletList
//                     wallets={all}
//                     compact={false}
//                     withViewAllTile={false}
//                     onPick={handlePick}
//                     ariaLabel="All wallets"
//                   />
//                   <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm flex items-center justify-between">
//                     <div className="text-white/90">BEP-20 • Wallet list</div>
//                     <button
//                       onClick={() => setViewAll(false)}
//                       className="text-white/80 hover:text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
//                     >
//                       Back
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* {connected && (
//                 <div className="space-y-4">
//                   <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
//                     <div className="text-sm text-white/60">Address</div>
//                     <div className="font-mono break-all">{address}</div>
//                   </div>
//                   <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
//                     <div className="text-sm text-white/60">Balance</div>
//                     <div className="text-xl">
//                       {balance?.toFixed?.(6) ?? "—"} {CHAIN.nativeCurrency.symbol}
//                     </div>
//                   </div>
//                 </div>
//               )} */}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }


