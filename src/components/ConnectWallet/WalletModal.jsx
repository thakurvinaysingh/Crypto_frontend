import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useEVMWallet } from "./EVMWalletProvider";
import WalletList from "./WalletList";
import { featuredWallets, allWallets } from "./wallets";

export default function WalletModal({ isOpen, onClose, autoScanOnOpen = true }) {
  const { connectInjected, connectWalletConnect, connected, address, balance, CHAIN, wcUri,disconnect } = useEVMWallet();
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);
  const [qr, setQr] = useState(null);
  const [qrError, setQrError] = useState(null);
  const startedRef = useRef(false); // prevent multiple WC sessions

  const featured = useMemo(() => featuredWallets, []);
  const all = useMemo(() => allWallets, []);

  // Build QR image when wcUri changes
  useEffect(() => {
    if (!wcUri) { setQr(null); return; }
    QRCode.toDataURL(wcUri, { margin: 1, width: 560 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [wcUri]);

  // Reset “view all” when connected
  useEffect(() => { if (connected) setViewAll(false); }, [connected]);

  // 🔸 Auto-open scanner when modal opens
  useEffect(() => {
    if (!isOpen) { startedRef.current = false; setQrError(null); return; }
    if (autoScanOnOpen && !connected && !wcUri && !startedRef.current) {
      startedRef.current = true;
      connectWalletConnect().catch((err) => {
        setQrError(err?.message || "Failed to start WalletConnect.");
        startedRef.current = false;
      });
    }
  }, [isOpen, autoScanOnOpen, connected, wcUri, connectWalletConnect]);

  const handlePick = async (id) => {
    if (["metamask", "binance", "trust", "okx", "safepal"].includes(id)) {
      await connectInjected();
      return;
    }
    if (id === "walletconnect") {
      await connectWalletConnect(); // user chooses WC explicitly
      return;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm grid place-items-center px-3 sm:px-4"
          aria-modal="true" role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="w-full max-w-[440px] sm:max-w-[520px] rounded-[28px] bg-[#14181F]/95 text-white shadow-2xl ring-1 ring-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold">
                {viewAll ? "Wallets" : connected ? "Wallet connected" : "Connect your wallet"}
              </h2>
              <button
                    onClick={async () => {
                  try { await disconnect(); } finally {
                    onClose?.();
                    navigate("/");
                  }
                }}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              {!connected && !viewAll && (
                <>
                  {/* QR area */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-white/80 mb-2 sm:mb-3">Scan with your mobile wallet</div>

                      <div className="w-full max-w-[320px] sm:max-w-[360px]">
                        <div className="rounded-2xl bg-white text-black p-3 aspect-square grid place-items-center">
                          {qr ? (
                            <img src={qr} alt="WalletConnect QR" className="w-full h-full object-contain rounded-xl" />
                          ) : (
                            <div className="text-black/50 text-xs sm:text-sm text-center px-4">
                              {qrError ? "Couldn’t start session." : "Preparing secure session…"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fallback button only if auto-start fails */}
                      {qrError && (
                        <button
                          onClick={connectWalletConnect}
                          className="mt-3 sm:mt-4 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-white/90 border border-black/10 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Wallets */}
                  <h3 className="mt-4 text-sm text-white/80">Available wallets</h3>
                  <div className="mt-2">
                    <WalletList
                      wallets={featured}
                      compact
                      withViewAllTile
                      onPick={(id) => (id === "view-all" ? setViewAll(true) : handlePick(id))}
                      onViewAll={() => setViewAll(true)}
                      ariaLabel="Featured wallets"
                    />
                  </div>

                  {/* Footer strip */}
                  <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm flex items-center justify-between">
                    <div className="text-white/90">BEP-20 • BNB Smart Chain</div>
                    <div className="text-white/50 text-xs">Chain ID: {CHAIN.chainId}</div>
                  </div>
                </>
              )}

              {!connected && viewAll && (
                <>
                  <WalletList
                    wallets={all}
                    compact={false}
                    withViewAllTile={false}
                    onPick={handlePick}
                    ariaLabel="All wallets"
                  />
                  <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm flex items-center justify-between">
                    <div className="text-white/90">BEP-20 • Wallet list</div>
                    <button
                      onClick={() => setViewAll(false)}
                      className="text-white/80 hover:text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              {connected && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-sm text-white/60">Address</div>
                    <div className="font-mono break-all">{address}</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-sm text-white/60">Balance</div>
                    <div className="text-xl">
                      {balance?.toFixed?.(6) ?? "—"} {CHAIN.nativeCurrency.symbol}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useMemo, useState } from "react";
// import QRCode from "qrcode";
// import { useEVMWallet } from "./EVMWalletProvider";
// import WalletList from "./WalletList";
// import { featuredWallets, allWallets } from "./wallets";

// export default function WalletModal({ isOpen, onClose }) {
//   const { connectInjected, connectWalletConnect, connected, address, balance, CHAIN, wcUri } = useEVMWallet();
//   const [viewAll, setViewAll] = useState(false);
//   const [qr, setQr] = useState(null);

//   const featured = useMemo(() => featuredWallets, []);
//   const all = useMemo(() => allWallets, []);

//   useEffect(() => {
//     if (!wcUri) {
//       setQr(null);
//       return;
//     }
//     QRCode.toDataURL(wcUri, { margin: 1, width: 560 })
//       .then(setQr)
//       .catch(() => setQr(null));
//   }, [wcUri]);

//   useEffect(() => {
//     if (connected) setViewAll(false);
//   }, [connected]);

//   const handlePick = async (id) => {
//     if (["metamask", "binance", "trust", "okx", "safepal"].includes(id)) {
//       await connectInjected();
//       return;
//     }
//     if (id === "walletconnect") {
//       await connectWalletConnect(); // generates wcUri; shows QR
//       return;
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm grid place-items-center px-3 sm:px-4"
//           aria-modal="true"
//           role="dialog"
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
//                 onClick={onClose}
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
//                   {/* QR preview */}
//                   <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
//                     <div className="flex flex-col items-center px-0">
//                       <div className="text-sm text-white/80 mb-2 sm:mb-3">
//                         Scan with your mobile wallet
//                       </div>

//                       <div className="w-full max-w-[300px] sm:max-w-[300px]">
//                         <div className="rounded-2xl bg-white text-black p-3 aspect-square grid place-items-center">
//                           {qr ? (
//                             <img
//                               src={qr}
//                               alt="WalletConnect QR"
//                               className="w-full h-full object-contain rounded-xl"
//                             />
//                           ) : (
//                             <div className="text-black/50 text-xs sm:text-sm text-center px-4">
//                               Pick a wallet or use WalletConnect to generate a QR
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {!qr && (
//                         <button
//                           onClick={connectWalletConnect}
//                           className="mt-3 sm:mt-4 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-white/90 border border-black/10 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
//                         >
//                           Generate QR
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Wallets */}
//                   <h3 id="wallets-heading" className="mt-4 text-sm text-white/80">
//                     Available wallets
//                   </h3>
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
//                   <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm flex items-center justify-between">
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

//               {connected && (
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
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
