// src/pages/Landing.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

import Logo from "../assets/Gain-USDT-2.png";
import {
  openPreview,
  closePreview,
  setQuery,
} from "../store/slices/uiSlice";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import ConnectButton from "../components/ConnectWallet/ConnectButton";
import WalletModal from "../components/ConnectWallet/WalletModal";
import useWalletModal from "../hooks/useWalletModal";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
import { checkUserExists } from "../lib/api";

// -----------------------------
// Local session helpers
// -----------------------------
const LS = {
  id: "fx_user_id",
  userId: "fx_user_userId",
  wallet: "fx_wallet_addr",
};

const extractIds = (data) => {
  const buckets = [data, data?.data, data?.user, data?.payload];
  let id = null;
  let userId = null;

  for (const obj of buckets) {
    if (!obj || typeof obj !== "object") continue;
    if (id === null && (typeof obj.id === "string" || typeof obj.id === "number")) {
      id = obj.id;
    }
    if (userId === null && (typeof obj.userId === "string" || typeof obj.userId === "number")) {
      userId = obj.userId;
    }
  }

  return { id, userId };
};

const persistUser = ({ id, userId }, wallet) => {
  try {
    if (id != null) localStorage.setItem(LS.id, String(id));
    if (userId != null) localStorage.setItem(LS.userId, String(userId));
    if (wallet) localStorage.setItem(LS.wallet, wallet.toLowerCase());
  } catch {
    // Ignore localStorage errors
  }
};

export default function Landing() {
  const { previewOpen, query } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { connected, address, error, disconnect, isConnecting, isDisconnecting } = useEVMWallet();
  const { isOpen, open, close } = useWalletModal();

  const [previewError, setPreviewError] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // 🔧 FIX: Auto-login only runs ONCE when wallet connects
  useEffect(() => {
    if (!connected || !address || isCheckingUser) return;

    let ignore = false;
    setIsCheckingUser(true);

    const handleLogin = async () => {
      try {
        const res = await checkUserExists({ address });

        if (ignore) return;

        if (res?.exists) {
          // User exists -> save session & go to dashboard
          const createdOn = res?.data?.createdOn;
          if (createdOn) {
            localStorage.setItem("createdOn", createdOn);
          }
          persistUser(extractIds(res), address);
          nav("/dashboard", { replace: true });
        } else {
          // New user -> go to onboarding
          nav("/onboard", { replace: true });
        }
      } catch (err) {
        console.error("User check failed", err);
        if (!ignore) {
          setIsCheckingUser(false);
        }
      }
    };

    handleLogin();

    return () => {
      ignore = true;
    };
  }, [connected, address, nav]);

  const openDashboard = async () => {
    const trimmedId = (query || "").trim();
    if (!trimmedId) {
      setPreviewError("Please enter a valid user ID.");
      return;
    }

    setPreviewError("");
    try {
      const res = await checkUserExists({ UserId: trimmedId });

      if (res?.exists) {
        const createdOn = res?.data?.createdOn;
        
        if (createdOn) {
          localStorage.setItem("createdOn", createdOn);
        } 
        persistUser(extractIds(res), address || null);
        nav("/dashboard", { replace: true });
      } else {
        setPreviewError("User not found. Please check the ID and try again.");
      }
    } catch {
      setPreviewError("Preview failed. Please try again.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") openDashboard();
  };

  // 🆕 Handle disconnect with confirmation
  const handleDisconnect = async () => {
    if (window.confirm("Are you sure you want to disconnect your wallet?")) {
      try {
        await disconnect();
      } catch (err) {
        console.error("Disconnect failed:", err);
      }
    }
  };

  return (
    <section className="relative">
      {/* Hero image */}
      <div className="mx-auto max-w-4xl">
        <img
          src={Logo}
          alt="Connect USDT"
          className="mx-auto w-[85%] max-w-[920px] md:w-[78%] lg:w-[42%] select-none pointer-events-none"
          draggable="false"
        />
      </div>

      {/* Headline */}
      <div className="mt-8 text-center">
        <h1 className="leading-tight font-semibold text-[28px] sm:text-[34px] md:text-[34px]">
          <span className="block">Earn with friends</span>
          <span className="block mt-1.5 bg-gradient-to-r from-gold-400 to-gold-700 bg-clip-text text-transparent">
            here and now.
          </span>
        </h1>

        <div className="mt-10 flex justify-center items-center gap-4">
          <ConnectButton onOpen={open} />
          <button
            aria-label="Open preview"
            onClick={() => dispatch(openPreview())}
            className="btn-circle bg-gold-700/15 hover:bg-gold-700/25 active:bg-gold-700/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
          >
            <FaSearch className="h-6 w-6" />
          </button>
        </div>

        {/* Connection status */}
        <div className="mt-4 text-xs text-white/60">
          {connected ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                <span>Connected: <span className="font-mono text-white/80">{address?.slice(0, 6)}...{address?.slice(-4)}</span></span>
              </div>
              
              {/* 🆕 Clear disconnect button */}
              <button
                onClick={handleDisconnect}
                className="text-xs text-red-300/80 hover:text-red-200 underline underline-offset-2 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
              <span>Not connected</span>
            </div>
          )}
          {error && <div className="mt-2 text-red-400">• {error}</div>}
        </div>

        {/* 🆕 Loading indicator during user check */}
        {isCheckingUser && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <svg 
              className="animate-spin h-5 w-5 text-gold-400" 
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
            <span className="text-xs text-white/70">Checking your account...</span>
          </div>
        )}
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
          className="input mb-3"
        />
        {previewError && <p className="text-red-400 text-sm mb-2">{previewError}</p>}
        <Button className="w-full" onClick={openDashboard}>
          Open dashboard
        </Button>
      </Modal>

      {/* Wallet connection modal */}
      <WalletModal isOpen={isOpen} onClose={close} autoScanOnOpen />
      <div className="h-safe" />
    </section>
  );
}















// // src/pages/Landing.jsx

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { FaSearch } from "react-icons/fa";

// import Logo from "../assets/Gain-USDT-2.png";
// import {
//   openPreview,
//   closePreview,
//   setQuery,
// } from "../store/slices/uiSlice";
// import Modal from "../components/common/Modal";
// import Button from "../components/common/Button";
// import ConnectButton from "../components/ConnectWallet/ConnectButton";
// import WalletModal from "../components/ConnectWallet/WalletModal";
// import useWalletModal from "../hooks/useWalletModal";
// import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";
// import { checkUserExists } from "../lib/api";

// // -----------------------------
// // Local session helpers
// // -----------------------------
// const LS = {
//   id: "fx_user_id",
//   userId: "fx_user_userId",
//   wallet: "fx_wallet_addr",
// };

// const extractIds = (data) => {
//   const buckets = [data, data?.data, data?.user, data?.payload];
//   let id = null;
//   let userId = null;

//   for (const obj of buckets) {
//     if (!obj || typeof obj !== "object") continue;
//     if (id === null && (typeof obj.id === "string" || typeof obj.id === "number")) {
//       id = obj.id;
//     }
//     if (userId === null && (typeof obj.userId === "string" || typeof obj.userId === "number")) {
//       userId = obj.userId;
//     }
//   }

//   return { id, userId };
// };

// const persistUser = ({ id, userId }, wallet) => {
//   try {
//     if (id != null) localStorage.setItem(LS.id, String(id));
//     if (userId != null) localStorage.setItem(LS.userId, String(userId));
//     if (wallet) localStorage.setItem(LS.wallet, wallet.toLowerCase());
//   } catch {
//     // Ignore localStorage errors
//   }
// };

// export default function Landing() {
//   const { previewOpen, query } = useSelector((s) => s.ui);
//   const dispatch = useDispatch();
//   const nav = useNavigate();

//   const { connected, address, error } = useEVMWallet();
//   const { isOpen, open, close } = useWalletModal();

//   const [previewError, setPreviewError] = useState("");

//   // Auto-navigate to onboarding if connected
//  // -------------------------------------------
//   // UPDATED: Handle Auto-Login vs Onboarding
//   // -------------------------------------------
//   useEffect(() => {
//     // Only run if wallet is connected and we have an address
//     if (connected && address) {
//       const handleLogin = async () => {
//         try {
//           // Check DB for this specific Wallet Address
//           // Note: Ensure your API expects 'WalletId' or the equivalent key for address checks
//           const res = await checkUserExists({  address });

//           if (res?.exists) {
//             // CASE A: User exists in DB -> Save session & Go to Dashboard
//             const createdOn = res?.data?.createdOn;
//             if (createdOn) {
//               localStorage.setItem("createdOn", createdOn);
//             }
//             // Reuse your existing helper to save IDs and Wallet
//             persistUser(extractIds(res), address);
            
//             nav("/dashboard", { replace: true });
//           } else {
//             // CASE B: No data found -> User is new -> Go to Onboarding
//             nav("/onboard", { replace: true });
//           }
//         } catch (err) {
//           console.error("User check failed", err);
//           // Fallback: If API fails, send to onboard so flow doesn't get stuck
//           nav("/", { replace: true });
//         }
//       };

//       handleLogin();
//     }
//   }, [connected, address, nav]);

//   const openDashboard = async () => {
//     const trimmedId = (query || "").trim();
//     if (!trimmedId) {
//       setPreviewError("Please enter a valid user ID.");
//       return;
//     }

//     setPreviewError("");
//     try {
//       const res = await checkUserExists({ UserId: trimmedId });

//       if (res?.exists) {
//         const createdOn = res?.data?.createdOn;
        
//         if (createdOn) {
//           localStorage.setItem("createdOn", createdOn);
//           console.log("Created On saved:", createdOn);
//         } 
//         persistUser(extractIds(res), address || null);
//         nav("/dashboard", { replace: true });
//       } else {
//         setPreviewError("User not found. Please check the ID and try again.");
//       }
//     } catch {
//       setPreviewError("Preview failed. Please try again.");
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter") openDashboard();
//   };

//   return (
//     <section className="relative">
//       {/* Hero image */}
//       <div className="mx-auto max-w-4xl">
//         <img
//           src={Logo}
//           alt="Connect USDT"
//           className="mx-auto w-[85%] max-w-[920px] md:w-[78%] lg:w-[42%] select-none pointer-events-none"
//           draggable="false"
//         />
//       </div>

//       {/* Headline */}
//       <div className="mt-8 text-center">
//         <h1 className="leading-tight font-semibold text-[28px] sm:text-[34px] md:text-[34px]">
//           <span className="block">Earn with friends</span>
//           <span className="block mt-1.5 bg-gradient-to-r from-gold-400 to-gold-700 bg-clip-text text-transparent">
//             here and now.
//           </span>
//         </h1>

//         <div className="mt-10 flex justify-center items-center gap-4">
//           <ConnectButton onOpen={open} />
//           <button
//             aria-label="Open preview"
//             onClick={() => dispatch(openPreview())}
//             className="btn-circle bg-gold-700/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
//           >
//             <FaSearch className="h-6 w-6 hover:bg-gold-500/25" />
//           </button>
//         </div>

//         <div className="mt-3 text-xs text-white/60">
//           {connected ? (
//             <>Connected: <span className="font-mono">{address}</span></>
//           ) : (
//             "Not connected"
//           )}
//           {error && <span className="text-red-400 ml-2">• {error}</span>}
//         </div>
//       </div>

//       {/* Preview modal */}
//       <Modal open={previewOpen} onClose={() => dispatch(closePreview())}>
//         <h3 className="text-2xl font-semibold mb-1">Preview mode</h3>
//         <p className="text-white/70 mb-4">Enter user ID to preview their data</p>
//         <input
//           autoFocus
//           value={query}
//           onChange={(e) => dispatch(setQuery(e.target.value))}
//           onKeyDown={onKeyDown}
//           placeholder="Enter user ID"
//           className="input mb-3"
//         />
//         {previewError && <p className="text-red-400 text-sm mb-2">{previewError}</p>}
//         <Button className="w-full" onClick={openDashboard}>
//           Open dashboard
//         </Button>
//       </Modal>

//       {/* Wallet connection modal */}
//       <WalletModal isOpen={isOpen} onClose={close} autoScanOnOpen />
//       <div className="h-safe" />
//     </section>
//   );
// }




