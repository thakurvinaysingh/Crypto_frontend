import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
import useWalletModal from "../hooks/useWalletModal";
import PackagePicker from "../components/Registration/PackagePicker";
import { checkUserExists, registerUser } from "../lib/api";
import { getWalletClient } from "../lib/viemClients";
import { sendUsdt } from "../lib/usdtTransfer";

import { ALLOWED_PACKAGES } from "../lib/validators";

const isValidRefId = (s) => !s || /^[a-zA-Z0-9_-]{3,32}$/.test(String(s));
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
const isPkgAllowed = ALLOWED_PACKAGES.includes(Number(pkg));

  // If connected, check if user exists -> go dashboard
  useEffect(() => {
    let ignore = false;
    if (!connected || !address) return;
    (async () => {
      try {
        setChecking(true);
        const res = await checkUserExists(address);
        console.log("checkUserExists:", res);
        if (ignore) return;
        if (res?.exists) nav("/dashboard", { replace: true });
      } catch (e) {
        setErr(e.message || "Failed to check user");
      } finally {
        setChecking(false);
      }
    })();
    return () => { ignore = true; };
  }, [connected, address, nav]);

  async function handleSendAndRegister() {
    try {
      setErr("");
      if (!connected) return openConnectModal();
      if (!ALLOWED_PACKAGES.includes(Number(pkg))) throw new Error("Select a valid package amount.");
      if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");
      if (!RECEIVER) throw new Error("Receiver address not configured.");

      // Ensure BSC
      await ensureBscChain?.();

      setProcessing(true);

      // 1) Send USDT from user -> receiver
      const walletClient = getWalletClient(provider);
      const { hash } = await sendUsdt({
        walletClient,
        account: address,
        to: RECEIVER,
        amount: Number(pkg),
      });

      // 2) Immediately register with backend (backend verifies chain & confirms)
      await registerUser({
        publicAddress: address.toLowerCase(),
        refBy: refId || null,
        packageAmount: Number(pkg),
        tx: hash,
        receiver: RECEIVER,
        timestamp: new Date().toISOString(),
      });

//       {
//   "publicAddress": "0x7Fc6587B7aF82dc54a4DaB15b34bB32f2C14df02",
//   "packageAmount": 166.75,
//   "refBy": 0,
//   "tx": "0x545eba824e64cc5ab448ffefbcce06fe4f4b876112b87552017d8f2769f86691",
//   "receiver": "0xb300000b72DEAEb607a12d5f54773D1C19c7028d"
// }

      nav("/dashboard", { replace: true });
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
    <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-8 py-6">
      <div className="max-w-3xl mx-auto rounded-[28px] bg-[#14181F]/90 ring-1 ring-white/10 text-white p-5 sm:p-8">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Registration</h1>
          <div className="text-xs text-white/60">{connected ? "Connected" : "Not connected"}</div>
        </header>

        {!connected && (
          <p className="mt-4 text-white/70 text-sm">Please connect your BSC wallet on the Landing page.</p>
        )}

        {connected && (
          <div className="mt-6 space-y-6">
            <section>
              <div className="text-sm text-white/80 mb-2">Select a package</div>
              <PackagePicker value={pkg} onChange={setPkg} />
            </section>

            <section>
              <label className="text-sm text-white/80">Referral ID (optional)</label>
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value.trim())}
                placeholder="Enter ref ID"
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              {refId && !isValidRefId(refId) && (
                <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
              )}
            </section>

            <section>
              <div className="text-sm text-white/80 mb-2">Receiver</div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
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

                <div className="mt-3 flex flex-wrap gap-3">
               <button
  type="button"
  onClick={handleSendAndRegister}
  disabled={!isPkgAllowed || processing}
  className={[
    "rounded-xl px-3.5 py-2 text-sm font-medium",
    !isPkgAllowed || processing
      ? "bg-white/20 text-white/60 cursor-not-allowed"
      : "bg-white text-black hover:bg-white/90"
  ].join(" ")}
>
  {processing ? "Processing…" : "Send & Register"}
</button>

                </div>
              </div>
            </section>

            {err && <p className="text-sm text-red-400">{err}</p>}
            {checking && <div className="text-sm text-white/70">Checking your account…</div>}
          </div>
        )}
      </div>
    </div>
  );
}




// // src/pages/Onboard.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
// import useWalletModal from "../hooks/useWalletModal";
// import PackagePicker from "../components/Registration/PackagePicker";
// import { checkUserExists, registerUser } from "../lib/api";
// import { getWalletClient } from "../lib/viemClients";
// import { sendUsdt } from "../lib/usdtTransfer";

// const ALLOWED = [25,50,100,200,400,800,1600,3200,6400,12800,256000];
// const isValidRefId = (s) => !s || /^[a-zA-Z0-9_-]{3,32}$/.test(String(s));
// const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS;

// export default function Onboard() {
//   const nav = useNavigate();
//   const { connected, address, provider, ensureBscChain } = useEVMWallet();
//   const { open: openConnectModal } = useWalletModal();

//   const [checking, setChecking] = useState(false);
//   const [pkg, setPkg] = useState(null);
//   const [refId, setRefId] = useState("");
//   const [sending, setSending] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [err, setErr] = useState("");
//   const [showManual, setShowManual] = useState(false);
//   const [manualTx, setManualTx] = useState("");

//   // redirect existing users straight to dashboard
//   useEffect(() => {
//     let ignore = false;
//     if (!connected || !address) return;
//     (async () => {
//       try {
//         setChecking(true);
//         const res = await checkUserExists(address);
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

//   async function sendAndRegister() {
//     try {
//       setErr("");
//       if (!connected) return openConnectModal();
//       if (!ALLOWED.includes(Number(pkg))) throw new Error("Select a valid package amount.");
//       if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");
//       if (!RECEIVER) throw new Error("Receiver address not configured.");

//       // ensure BSC
//       await ensureBscChain?.();

//       setSending(true);

//       // 1) send the token
//       const walletClient = getWalletClient(provider);
//       const { hash } = await sendUsdt({
//         walletClient,
//         account: address,
//         to: RECEIVER,
//         amount: Number(pkg),
//       });

//       // 2) immediately register with backend
//       setSubmitting(true);
//       await registerUser({
//         walletAddress: address.toLowerCase(),
//         refId: refId || null,
//         packageAmount: Number(pkg),
//         txHash: hash,
//         receiverAddress: RECEIVER,
//         timestamp: new Date().toISOString(),
//       });

//       nav("/dashboard", { replace: true });
//     } catch (e) {
//       // common wallet errors worth surfacing nicely
//       const msg = String(e?.message || e);
//       if (/user rejected|denied|rejected the request/i.test(msg)) {
//         setErr("Transaction cancelled by user.");
//       } else {
//         setErr(msg);
//       }
//     } finally {
//       setSending(false);
//       setSubmitting(false);
//     }
//   }

//   async function submitManual() {
//     try {
//       setErr("");
//       if (!connected) return openConnectModal();
//       if (!ALLOWED.includes(Number(pkg))) throw new Error("Select a valid package amount.");
//       if (!/^0x([A-Fa-f0-9]{64})$/.test(manualTx)) throw new Error("Invalid transaction hash.");
//       if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");

//       setSubmitting(true);
//       await registerUser({
//         walletAddress: address.toLowerCase(),
//         refId: refId || null,
//         packageAmount: Number(pkg),
//         txHash: manualTx.trim(),
//         receiverAddress: RECEIVER,
//         timestamp: new Date().toISOString(),
//       });
//       nav("/dashboard", { replace: true });
//     } catch (e) {
//       setErr(e.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-8 py-6">
//       <div className="max-w-3xl mx-auto rounded-[28px] bg-[#14181F]/90 ring-1 ring-white/10 text-white p-5 sm:p-8">
//         <header className="flex items-center justify-between gap-4">
//           <h1 className="text-lg sm:text-xl font-semibold">Registration</h1>
//           <div className="text-xs text-white/60">{connected ? "Connected" : "Not connected"}</div>
//         </header>

//         {!connected && (
//           <p className="mt-4 text-white/70 text-sm">
//             Please connect your BSC wallet on the Landing page.
//           </p>
//         )}

//         {connected && (
//           <div className="mt-6 space-y-6">
//             <section>
//               <div className="text-sm text-white/80 mb-2">Select a package</div>
//               <PackagePicker value={pkg} onChange={setPkg} />
//             </section>

//             <section>
//               <label className="text-sm text-white/80">Referral ID (optional)</label>
//               <input
//                 type="text"
//                 value={refId}
//                 onChange={(e) => setRefId(e.target.value.trim())}
//                 placeholder="Enter ref ID"
//                 className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
//               />
//               {refId && !isValidRefId(refId) && (
//                 <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
//               )}
//             </section>

//             <section>
//               <div className="text-sm text-white/80 mb-2">Receiver</div>
//               <div className="rounded-xl bg-white/5 border border-white/10 p-3">
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

//                 <div className="mt-3 flex flex-wrap gap-3">
//                   <button
//                     type="button"
//                     onClick={sendAndRegister}
//                     disabled={!ALLOWED.includes(Number(pkg)) || sending || submitting}
//                     className={[
//                       "rounded-xl px-3.5 py-2 text-sm font-medium",
//                       !ALLOWED.includes(Number(pkg)) || sending || submitting
//                         ? "bg-white/20 text-white/60 cursor-not-allowed"
//                         : "bg-white text-black hover:bg-white/90"
//                     ].join(" ")}
//                   >
//                     {sending || submitting ? "Processing…" : "Send & Register"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setShowManual((s) => !s)}
//                     className="rounded-xl px-3.5 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15"
//                   >
//                     I already sent — paste tx
//                   </button>
//                 </div>
//               </div>
//             </section>

//             {showManual && (
//               <section>
//                 <label className="text-sm text-white/80">Transaction hash</label>
//                 <input
//                   type="text"
//                   value={manualTx}
//                   onChange={(e)=>setManualTx(e.target.value.trim())}
//                   placeholder="0x…"
//                   className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
//                 />
//                 <div className="mt-3 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={submitManual}
//                     disabled={!/^0x([A-Fa-f0-9]{64})$/.test(manualTx) || submitting}
//                     className={[
//                       "rounded-xl px-4 py-2 text-sm font-medium",
//                       !/^0x([A-Fa-f0-9]{64})$/.test(manualTx) || submitting
//                         ? "bg-white/20 text-white/60 cursor-not-allowed"
//                         : "bg-white text-black hover:bg-white/90"
//                     ].join(" ")}
//                   >
//                     {submitting ? "Submitting…" : "Submit"}
//                   </button>
//                 </div>
//               </section>
//             )}

//             {err && <p className="text-sm text-red-400">{err}</p>}
//             {checking && <div className="text-sm text-white/70">Checking your account…</div>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { checkUserExists, registerUser } from "../lib/api";
// import { isValidRefId, isValidTxHash } from "../lib/validators";
// import useWalletModal from "../hooks/useWalletModal"
// // If you already have your own provider hook, reuse it:
// import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
// import PackagePicker from "../components/Registration/PackagePicker";

// const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS;

// export default function Onboard() {
//   const nav = useNavigate();
//   const { connected, address,  chain, ensureBscChain } = useEVMWallet();
//  const { open: openConnectModal } = useWalletModal();
//   const [checking, setChecking] = useState(false);
//   const [exists, setExists] = useState(false);
//   const [refId, setRefId] = useState("");
//   const [pkg, setPkg] = useState(null);
//   const [tx, setTx] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [err, setErr] = useState("");

//   const canSubmit = connected && pkg && isValidTxHash(tx) && isValidRefId(refId);

//   // When connected, check if user exists, then route
//   useEffect(() => {
//     let ignore = false;
//     async function run() {
//       setErr("");
//       if (!connected || !address) return;
//       try {
//         setChecking(true);
//         const res = await checkUserExists(address);
//         if (ignore) return;
//         // Expect shape: { exists: boolean, user?: {...} }
//         if (res?.exists) {
//           setExists(true);
//           nav("/main", { replace: true });
//         } else {
//           setExists(false);
//         }
//       } catch (e) {
//         setErr(e.message || "Failed to check user");
//       } finally {
//         setChecking(false);
//       }
//     }
//     run();
//     return () => (ignore = true);
//   }, [connected, address, nav]);

//   // Force BSC if your provider supports it
//   useEffect(() => {
//     if (connected && chain?.id && chain.id !== Number(import.meta.env.VITE_BSC_CHAIN_ID)) {
//       ensureBscChain?.().catch(() => {});
//     }
//   }, [connected, chain, ensureBscChain]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!canSubmit) return;
//     try {
//       setErr("");
//       setSubmitting(true);
//       const payload = {
//         walletAddress: address.toLowerCase(),
//         refId: refId || null,
//         packageAmount: Number(pkg),
//         txHash: tx,
//         receiverAddress: RECEIVER,
//         timestamp: new Date().toISOString(),
//       };
//       const res = await registerUser(payload);
//       // Expect success → go dashboard
//       nav("/main", { replace: true });
//     } catch (e) {
//       setErr(e.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-8 py-6">
//       <div className="max-w-3xl mx-auto rounded-[28px] bg-[#14181F]/90 ring-1 ring-white/10 text-white p-5 sm:p-8">
//         <div className="flex items-center justify-between gap-4">
//           <h1 className="text-lg sm:text-xl font-semibold">Get Started</h1>
//           {!connected ? (
//             <button
//               onClick={openConnectModal}
//               className="rounded-xl px-3.5 py-2 bg-white text-black hover:bg-white/90 text-sm font-medium"
//             >
//               Connect Wallet
//             </button>
//           ) : (
//             <div className="text-sm text-white/80 font-mono truncate max-w-[60%]">
//               {address}
//             </div>
//           )}
//         </div>

//         {!connected && (
//           <p className="mt-4 text-white/70 text-sm">
//             Please connect your BSC wallet to continue.
//           </p>
//         )}

//         {connected && !exists && (
//           <form onSubmit={handleSubmit} className="mt-6 space-y-6">
//             <section>
//               <div className="text-sm text-white/80 mb-2">Select a package</div>
//               <PackagePicker value={pkg} onChange={setPkg} />
//             </section>

//             <section>
//               <label className="text-sm text-white/80">Referral ID (optional)</label>
//               <input
//                 type="text"
//                 value={refId}
//                 onChange={(e) => setRefId(e.target.value.trim())}
//                 placeholder="Enter ref ID"
//                 className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
//               />
//               {!isValidRefId(refId) && (
//                 <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
//               )}
//             </section>

//             <section>
//               <div className="text-sm text-white/80 mb-2">Send USDT (BEP-20)</div>
//               <div className="rounded-xl bg-white/5 border border-white/10 p-3">
//                 <div className="text-xs text-white/70">Receiver address</div>
//                 <div className="mt-1 font-mono text-sm break-all">{RECEIVER}</div>
//                 <div className="text-xs text-white/60 mt-2">
//                   Amount: <span className="font-semibold">{pkg ?? "—"}</span> USDT
//                 </div>
//                 <div className="text-xs text-white/50 mt-1">
//                   Network fee in BNB applies • Make sure you are on BSC.
//                 </div>
//               </div>
//             </section>

//             <section>
//               <label className="text-sm text-white/80">Transaction hash</label>
//               <input
//                 type="text"
//                 value={tx}
//                 onChange={(e) => setTx(e.target.value.trim())}
//                 placeholder="Paste your tx hash (0x...)"
//                 className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
//               />
//               {tx && !isValidTxHash(tx) && (
//                 <p className="text-xs text-red-400 mt-1">Invalid tx hash</p>
//               )}
//             </section>

//             {err && <p className="text-sm text-red-400">{err}</p>}

//             <div className="flex items-center justify-end gap-3">
//               <button
//                 type="submit"
//                 disabled={!canSubmit || submitting}
//                 className={[
//                   "rounded-xl px-4 py-2 text-sm font-medium",
//                   canSubmit
//                     ? "bg-white text-black hover:bg-white/90"
//                     : "bg-white/20 text-white/60 cursor-not-allowed"
//                 ].join(" ")}
//               >
//                 {submitting ? "Submitting..." : "Submit & Continue"}
//               </button>
//             </div>
//           </form>
//         )}

//         {checking && (
//           <div className="mt-4 text-sm text-white/70">Checking your account…</div>
//         )}
//       </div>
//     </div>
//   );
// }
