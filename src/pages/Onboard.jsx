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

// Constants
const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS;
const REF_ID_REGEX = /^\d+$/;
const LOCAL_STORAGE_KEYS = {
  id: "fx_user_id",
  userId: "fx_user_userId",
  wallet: "fx_wallet_addr",
};

// Utility: Validate referral ID
const isValidRefId = (refId) =>
  !refId || REF_ID_REGEX.test(String(refId).trim());

// Utility: Extract IDs from backend response
const extractIds = (obj) => {
  const sources = [obj, obj?.data, obj?.user, obj?.payload];
  let id = null;
  let userId = null;
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    if (id == null && (typeof src.id === "string" || typeof src.id === "number"))
      id = src.id;
    if (
      userId == null &&
      (typeof src.userId === "string" || typeof src.userId === "number")
    )
      userId = src.userId;
  }
  return { id, userId };
};

// Utility: Save user info locally
const persistUser = ({ id, userId }, wallet) => {
  try {
    if (id != null) localStorage.setItem(LOCAL_STORAGE_KEYS.id, String(id));
    if (userId != null)
      localStorage.setItem(LOCAL_STORAGE_KEYS.userId, String(userId));
    if (wallet) localStorage.setItem(LOCAL_STORAGE_KEYS.wallet, wallet.toLowerCase());
  } catch {
    // Ignore localStorage errors silently
  }
};



export default function Onboard() {
  const nav = useNavigate();
  const { connected, address, provider, ensureBscChain } = useEVMWallet();
  const { open: openConnectModal } = useWalletModal();

  const [pkg, setPkg] = useState(null);
  const [refId, setRefId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPkgAllowed = ALLOWED_PACKAGES.includes(Number(pkg));

    useEffect(() => {
    try {
      const storedRef = localStorage.getItem("referral_code");
      if (storedRef && isValidRefId(storedRef)) {
        setRefId(String(storedRef));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);


  useEffect(() => {
    if (!connected) {
      setTimeout(() => nav("/", { replace: true }), 2000);
      return;
    }

    let ignore = false;
    (async () => {
      try {
        setChecking(true);
        const res = await checkUserExists({ address });
        const createdOn = res?.data?.createdOn;
        
        if (createdOn) {
          localStorage.setItem("createdOn", createdOn);
          console.log("Created On saved:", createdOn);
        } 
        if (ignore) return;
        if (res?.exists) {
          persistUser(extractIds(res), address);
          nav("/dashboard", { replace: true });
        }
      } catch (e) {
        if (!ignore) setError("Failed to check user");
      } finally {
        setChecking(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [connected, address, nav]);

  const handleSendAndRegister = async () => {
    setError("");
    setSuccess("");

    try {
      if (!connected) return openConnectModal();
      if (!isPkgAllowed) throw new Error("Select a valid package amount.");
      if (!isValidRefId(refId)) throw new Error("Invalid ref ID format.");
      if (!RECEIVER) throw new Error("Receiver address not configured.");

      await ensureBscChain?.();
      setProcessing(true);

      const walletClient = getWalletClient(provider);
      const { hash } = await sendUsdt({
        walletClient,
        account: address,
        to: RECEIVER,
        amount: Number(pkg),
      });
     
      await registerUser({
        publicAddress: address.toLowerCase(),
        refBy: refId.trim() || null,
        packageAmount: Number(pkg),
        tx: hash,
        receiver: RECEIVER,
        timestamp: new Date().toISOString(),
      });

      const res = await checkUserExists({ address });
      if (res?.exists) {
         const createdOn = res?.data?.createdOn;
        if (createdOn) {
          localStorage.setItem("createdOn", createdOn);
          console.log("Created On saved:", createdOn);
        } 
        persistUser(extractIds(res), address);
        setSuccess("Registration complete. Redirecting...");
        setTimeout(() => nav("/dashboard", { replace: true }), 1500);
      } else {
        throw new Error("Registered but unable to verify. Please refresh.");
      }
    } catch (e) {
      const msg = String(e?.message || e);
      if (/rejected|denied/i.test(msg)) {
        setError("Transaction cancelled by user.");
      } else if (/Insufficient/i.test(msg)) {
        setError(msg);
      } else if (/Wrong network/i.test(msg)) {
        setError("Switch to BSC Testnet and try again.");
      } else {
        setError(msg);
      }
    } finally {
      setProcessing(false);
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto rounded-[28px] bg-gradient-to-br from-gold-700/10 via-[#14181F]/90 to-gold-900/10 ring-1 ring-gold-700/20 text-white p-5 sm:p-7 shadow-[0_0_40px_rgba(212,175,55,0.12)]">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Registration</h1>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                connected ? "bg-gold-400" : "bg-white/30"
              }`}
            />
            {connected ? "Connected" : "Not connected"}
          </div>
        </header>

        {!connected ? (
          <p className="mt-4 text-white/70 text-sm">
            Please connect your BSC wallet on the Landing page.
          </p>
        ) : (
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
                className="input mt-2"
              />
              {!isValidRefId(refId) && (
                <p className="text-xs text-red-400 mt-1">Invalid ref ID format</p>
              )}
            </section>

            <section>
              <div className="text-sm text-white/80 mb-2">Receiver</div>
              <div className="rounded-2xl bg-white/[0.06] border border-gold-700/20 p-4">
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
                    className={`button-primary w-full sm:w-auto ${
                      !isPkgAllowed || processing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {processing ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
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

            {error && <p className="text-sm text-red-400">{error}</p>}
            {checking && (
              <p className="text-sm text-white/70">Checking your account…</p>
            )}
            {success && <p className="text-sm text-gold-300">{success}</p>}
          </div>
        )}
      </div>
    </div>
  );
}




