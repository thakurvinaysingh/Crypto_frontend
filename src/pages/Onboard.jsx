// src/pages/Onboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
import useWalletModal from "../hooks/useWalletModal";
import PackagePicker from "../components/Registration/PackagePicker";
import { checkUserExists, registerUser } from "../lib/api";
import { getWalletClient } from "../lib/viemClients";
import { sendUsdt } from "../lib/usdtTransfer";

import { ALLOWED_PACKAGES } from "../lib/validators";

// Gain USDT: allow empty or 3–32 chars (alnum, _ or -)
const isValidRefId = (s) => !s || /^[a-zA-Z0-9_-]{3,32}$/.test(String(s));

// Receiver wallet configured via env for Gain USDT (BEP-20 USDT)
const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS;

export default function Onboard() {
  const nav = useNavigate();
  const { connected, address, provider, ensureBscChain } = useEVMWallet();
  const { open: openConnectModal } = useWalletModal();

  const [checking, setChecking] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [refId, setRefId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const isPkgAllowed = ALLOWED_PACKAGES.includes(Number(pkg));

  // If connected, check if user exists -> go dashboard
  useEffect(() => {
    let ignore = false;
    if (!connected || !address) return;
    (async () => {
      try {
        setChecking(true);
        const res = await checkUserExists(address);
        if (ignore) return;
        if (res?.exists) nav("/dashboard", { replace: true });
      } catch (e) {
        setErr(e.message || "Failed to check user");
      } finally {
        setChecking(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [connected, address, nav]);

  async function handleSendAndRegister() {
    try {
      setErr("");
      setSuccess("");

      if (!connected) return openConnectModal();
      if (!ALLOWED_PACKAGES.includes(Number(pkg)))
        throw new Error("Select a valid package amount.");

      const trimmedRef = (refId || "").trim();
      if (!isValidRefId(trimmedRef)) throw new Error("Invalid ref ID format.");
      if (!RECEIVER) throw new Error("Receiver address not configured.");

      // Ensure BSC (Binance Smart Chain)
      await ensureBscChain?.();

      setProcessing(true);

      // 1) Send USDT (BEP-20) from user -> receiver
      const walletClient = getWalletClient(provider);
      let hash;
      try {
        const res = await sendUsdt({
          walletClient,
          account: address,
          to: RECEIVER,
          amount: Number(pkg),
          // waitForConfirm: false, // enable if you want to wait for mined confirmation
        });
        hash = res.hash;
      } catch (err) {
        const msg = String(err?.message || err);
        if (/Insufficient USDT balance/i.test(msg)) throw new Error(msg);
        if (/Wrong network/i.test(msg)) throw new Error(msg);
        if (/reverted|token address|decimals|Unable to prepare/i.test(msg)) {
          throw new Error("Transfer failed — verify network, token address, and amount.");
        }
        if (/user rejected|denied/i.test(msg)) {
          throw new Error("Transaction cancelled by user.");
        }
        throw new Error("Transaction failed. Please try again.");
      }

      // 2) Register with backend
      try {
        await registerUser({
          publicAddress: address.toLowerCase(),
          refBy: trimmedRef || null,
          packageAmount: Number(pkg),
          tx: hash,
          receiver: RECEIVER,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        const msg = String(err?.message || err);

        // Handle slow gateway: check if the user now exists and proceed
        if (/timeout|timed out|server.*not responding|504|gateway/i.test(msg)) {
          try {
            const exists = await checkUserExists(address);
            if (exists?.exists) {
              setSuccess("Transaction sent & registration saved! (Slow server response)");
              setTimeout(() => nav("/dashboard", { replace: true }), 1500);
              return;
            }
          } catch {
            // fall through
          }
        }
        throw new Error(msg);
      }

      // Success (no timeout)
      setSuccess("Transaction sent & registration completed! 🎉");
      setTimeout(() => nav("/dashboard", { replace: true }), 1500);
    } catch (e) {
      const msg = String(e?.message || e);
      if (/user rejected|denied|rejected the request/i.test(msg)) {
        setErr("Transaction cancelled by user.");
      } else {
        setErr(msg);
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* outer card with subtle golden tint & glow */}
      <div
        className="
        max-w-3xl mx-auto rounded-[28px]
        bg-gradient-to-br from-gold-700/10 via-[#14181F]/90 to-gold-900/10
        ring-1 ring-gold-700/20 text-white
        p-5 sm:p-7
        shadow-[0_0_40px_rgba(212,175,55,0.12)]
      "
      >
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Registration</h1>
          <div
            className="flex items-center gap-2 text-xs text-white/70"
            title={connected ? "Wallet connected" : "Wallet not connected"}
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full",
                connected ? "bg-gold-400" : "bg-white/30",
              ].join(" ")}
            />
            {connected ? "Connected" : "Not connected"}
          </div>
        </header>

        {!connected && (
          <p className="mt-4 text-white/70 text-sm">
            Please connect your BSC wallet on the Landing page.
          </p>
        )}

        {connected && (
          <div className="mt-6 space-y-6">
            <section>
              <div className="text-sm text-white/80 mb-2">Select a package</div>
              <PackagePicker value={pkg} onChange={setPkg} theme="gold" />
            </section>

            <section>
              <label className="text-sm text-white/80">Referral ID (optional)</label>
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                placeholder="Enter ref ID"
                className="input mt-2" /* uses your gold focus ring */
              />
              {refId && !isValidRefId(refId) && (
                <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
              )}
            </section>

            <section>
              <div className="text-sm text-white/80 mb-2">Receiver</div>
              <div className="rounded-2xl bg-white/[0.06] border border-gold-700/20 p-3 sm:p-4">
                <div className="text-xs text-white/70">Address</div>
                <div className="mt-1 font-mono text-sm break-all">
                  {RECEIVER || "— not configured —"}
                </div>
                <div className="text-xs text-white/60 mt-2">
                  Amount: <span className="font-semibold">{pkg ?? "—"}</span> USDT (BEP-20)
                </div>
                <div className="text-xs text-white/50 mt-1">
                  You’ll pay network gas in BNB • Make sure you’re on BSC.
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSendAndRegister}
                    disabled={!isPkgAllowed || processing}
                    aria-busy={processing ? "true" : "false"}
                    className={[
                      "button-primary w-full sm:w-auto",
                      (!isPkgAllowed || processing)
                        ? "opacity-60 cursor-not-allowed"
                        : "",
                    ].join(" ")}
                  >
                    {processing ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeOpacity="0.25"
                            strokeWidth="4"
                          />
                          <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                        Processing…
                      </span>
                    ) : (
                      "Send & Register"
                    )}
                  </button>
                </div>
              </div>
            </section>

            {err && (
              <p className="text-sm text-red-400" aria-live="polite">
                {err}
              </p>
            )}
            {checking && (
              <div className="text-sm text-white/70" aria-live="polite">
                Checking your account…
              </div>
            )}
            {success && (
              <p className="text-sm text-gold-300" aria-live="polite">
                {success}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
// import useWalletModal from "../hooks/useWalletModal";
// import PackagePicker from "../components/Registration/PackagePicker";
// import { checkUserExists, registerUser } from "../lib/api";
// import { getWalletClient } from "../lib/viemClients";
// import { sendUsdt } from "../lib/usdtTransfer";

// import { ALLOWED_PACKAGES } from "../lib/validators";

// const isValidRefId = (s) => !s || /^[a-zA-Z0-9_-]{3,32}$/.test(String(s));
// const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS;

// export default function Onboard() {
//   const nav = useNavigate();
//   const { connected, address, provider, ensureBscChain } = useEVMWallet();
//   const { open: openConnectModal } = useWalletModal();

//   const [checking, setChecking] = useState(false);
//   const [pkg, setPkg] = useState(null);
//   const [refId, setRefId] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [err, setErr] = useState("");
//   const [success, setSuccess] = useState("");
// const isPkgAllowed = ALLOWED_PACKAGES.includes(Number(pkg));

//   // If connected, check if user exists -> go dashboard
//   useEffect(() => {
//     let ignore = false;
//     if (!connected || !address) return;
//     (async () => {
//       try {
//         setChecking(true);
//         const res = await checkUserExists(address);
//         console.log("checkUserExists:", res);
//         if (ignore) return;
//         if (res?.exists) nav("/dashboard", { replace: true });
//       } catch (e) {
//         setErr(e.message || "Failed to check user");
//       } finally {
//         setChecking(false);
//       }
//     })();
//     return () => { ignore = true; };
//   }, [connected, address, nav]);

//   // async function handleSendAndRegister() {
    
//   //   try {
//   //     setErr("");
//   //     if (!connected) return openConnectModal();
//   //     if (!ALLOWED_PACKAGES.includes(Number(pkg))) throw new Error("Select a valid package amount.");
//   //     if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");
//   //     if (!RECEIVER) throw new Error("Receiver address not configured.");

//   //     setSuccess("");
//   //     // Ensure BSC
//   //     await ensureBscChain?.();

//   //     setProcessing(true);

//   //     // 1) Send USDT from user -> receiver
//   //     const walletClient = getWalletClient(provider);
//   //     const { hash } = await sendUsdt({
//   //       walletClient,
//   //       account: address,
//   //       to: RECEIVER,
//   //       amount: Number(pkg),
//   //     });

      
//   //     // 2) Immediately register with backend (backend verifies chain & confirms)
//   //     await registerUser({
//   //       publicAddress: address.toLowerCase(),
//   //       refBy: refId || null,
//   //       packageAmount: Number(pkg),
//   //       tx: hash,
//   //       receiver: RECEIVER,
//   //       timestamp: new Date().toISOString(),
//   //     });


//   //    setSuccess("Transaction confirmed & registration completed! 🎉");
//   //    setTimeout(() => nav("/dashboard", { replace: true }), 1500);

//   //   } catch (e) {
//   //     const msg = String(e?.message || e);
//   //     if (/user rejected|denied|rejected the request/i.test(msg)) {
//   //       setErr("Transaction cancelled by user.");
//   //     } else {
//   //       setErr(msg);
//   //     }
//   //   } finally {
//   //     setProcessing(false);
//   //   }
//   // }
//   async function handleSendAndRegister() {
//   try {
//     setErr("");
//     setSuccess("");

//     if (!connected) return openConnectModal();
//     if (!ALLOWED_PACKAGES.includes(Number(pkg))) throw new Error("Select a valid package amount.");
//     if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");
//     if (!RECEIVER) throw new Error("Receiver address not configured.");

//     // Ensure BSC
//     await ensureBscChain?.();

//     setProcessing(true);

//     // 1) Send USDT
//     const walletClient = getWalletClient(provider);
//     let hash; // <-- declare in outer scope so we can use it later
//     try {
//       const res = await sendUsdt({
//         walletClient,
//         account: address,
//         to: RECEIVER,
//         amount: Number(pkg),
//         // waitForConfirm: false, // set true if you want mined confirmation
//       });
//       hash = res.hash;
//     } catch (err) {
//       const msg = String(err?.message || err);

//       if (/Insufficient USDT balance/i.test(msg)) {
//         throw new Error(msg); // already user-friendly from sendUsdt
//       }
//       if (/Wrong network/i.test(msg)) {
//         throw new Error(msg);
//       }
//       if (/reverted|token address|decimals|Unable to prepare/i.test(msg)) {
//         throw new Error("Transfer failed — verify network, token address, and amount.");
//       }
//       if (/user rejected|denied/i.test(msg)) {
//         throw new Error("Transaction cancelled by user.");
//       }
//       throw new Error("Transaction failed. Please try again.");
//     }

//     // 2) Register with backend
//     try {
//       await registerUser({
//         publicAddress: address.toLowerCase(),
//         refBy: refId || null,
//         packageAmount: Number(pkg),
//         tx: hash,
//         receiver: RECEIVER,
//         timestamp: new Date().toISOString(),
//       });
//     } catch (err) {
//       const msg = String(err?.message || err);

//       // Handle slow/timeout-y backends: confirm existence and proceed
//       if (/timeout|timed out|server.*not responding|504|gateway/i.test(msg)) {
//         try {
//           const exists = await checkUserExists(address);
//           if (exists?.exists) {
//             setSuccess("Transaction sent & registration saved! (Slow server response)");
//             setTimeout(() => nav("/dashboard", { replace: true }), 1500);
//             return;
//           }
//         } catch (_) { /* ignore and fall through */ }
//       }
//       // rethrow non-timeout or unconfirmed cases
//       throw new Error(msg);
//     }

//     // Success (no timeout)
//     // Note: wording says "Transaction sent" unless you actually wait for confirmations
//     setSuccess("Transaction sent & registration completed! 🎉");
//     setTimeout(() => nav("/dashboard", { replace: true }), 1500);

//   } catch (e) {
//     const msg = String(e?.message || e);
//     if (/user rejected|denied|rejected the request/i.test(msg)) {
//       setErr("Transaction cancelled by user.");
//     } else {
//       setErr(msg);
//     }
//   } finally {
//     setProcessing(false);
//   }
// }


//   return (
//      <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-6">
//       {/* outer card with subtle golden tint & glow */}
//       <div className="
//         max-w-3xl mx-auto rounded-[28px]
//         bg-gradient-to-br from-gold-700/10 via-[#14181F]/90 to-gold-900/10
//         ring-1 ring-gold-700/20 text-white
//         p-5 sm:p-7
//         shadow-[0_0_40px_rgba(212,175,55,0.12)]
//       ">
//         <header className="flex items-center justify-between gap-4">
//           <h1 className="text-lg sm:text-xl font-semibold">Registration</h1>
//           <div
//             className="flex items-center gap-2 text-xs text-white/70"
//             title={connected ? "Wallet connected" : "Wallet not connected"}
//           >
//             <span
//               className={[
//                 "inline-block h-2 w-2 rounded-full",
//                 connected ? "bg-gold-400" : "bg-white/30",
//               ].join(" ")}
//             />
//             {connected ? "Connected" : "Not connected"}
//           </div>
//         </header>

//         {!connected && (
//           <p className="mt-4 text-white/70 text-sm">
//             Please connect your BSC wallet on the Landing page.
//           </p>
//         )}

//         {connected && (
//          <div className="mt-6 space-y-6">
//             <section>
//               <div className="text-sm text-white/80 mb-2">Select a package</div>
//             <PackagePicker value={pkg} onChange={setPkg} theme="gold" />
//             </section>
//             <section>
//               <label className="text-sm text-white/80">Referral ID (optional)</label>
//                   <input
//                 type="text"
//                 value={refId}
//                 onChange={(e) => setRefId(e.target.value.trim())}
//                 placeholder="Enter ref ID"
//                 className="input mt-2" /* uses your gold focus ring */
//               />
//               {refId && !isValidRefId(refId) && (
//                 <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
//               )}
//             </section>

//             <section>
//               <div className="text-sm text-white/80 mb-2">Receiver</div>
//                  <div className="rounded-2xl bg-white/[0.06] border border-gold-700/20 p-3 sm:p-4">
//                 <div className="text-xs text-white/70">Address</div>
//                 <div className="mt-1 font-mono text-sm break-all">
//                   {RECEIVER || "— not configured —"}
//                 </div>
//                 <div className="text-xs text-white/60 mt-2">
//                   Amount: <span className="font-semibold">{pkg ?? "—"}</span> USDT (BEP-20)
//                 </div>
//                 <div className="text-xs text-white/50 mt-1">
//                   You’ll pay network gas in BNB • Make sure you’re on BSC.
//                 </div>


//                     <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={handleSendAndRegister}
//                     disabled={!isPkgAllowed || processing}
//                     aria-busy={processing ? "true" : "false"}
//                     className={[
//                       "button-primary w-full sm:w-auto",
//                       (!isPkgAllowed || processing) ? "opacity-60 cursor-not-allowed" : ""
//                     ].join(" ")}
//                   >
//                     {processing ? (
//                       <span className="inline-flex items-center gap-2">
//                         <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                           <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
//                           <path d="M22 12a10 10 0 0 1-10 10"
//                                 stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
//                         </svg>
//                         Processing…
//                       </span>
//                     ) : (
//                       "Send & Register"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </section>
//             {err && <p className="text-sm text-red-400" aria-live="polite">{err}</p>}
//             {checking && <div className="text-sm text-white/70" aria-live="polite">Checking your account…</div>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



