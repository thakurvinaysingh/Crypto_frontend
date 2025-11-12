// src/components/layout/HeaderBar.jsx
import { useEffect, useState } from "react";
import Logo from "../../assets/Connect-USDT.png";

// Icons (no extra deps)
const CopyIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M9 9.5A2.5 2.5 0 0 1 11.5 7h6A2.5 2.5 0 0 1 20 9.5v6A2.5 2.5 0 0 1 17.5 18h-6A2.5 2.5 0 0 1 9 15.5v-6Z" fill="currentColor" />
    <path d="M6.5 16A2.5 2.5 0 0 1 4 13.5v-6A2.5 2.5 0 0 1 6.5 5h6A2.5 2.5 0 0 1 15 7.5V9" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

const CheckIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Helpers
function readUserId() {
  return (
    localStorage.getItem("fx_user_id") ??
    localStorage.getItem("fx_user_userId") ??
    ""
  );
}

// ✅ Now includes "createdOn" (checked first)
function readJoinedRaw() {
  return (
    localStorage.getItem("createdOn") ??            // <-- new
    localStorage.getItem("fx_joined_at") ??
    localStorage.getItem("fx_joined") ??
    localStorage.getItem("joinedAt") ??
    localStorage.getItem("joined_at") ??
    ""
  );
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.valueOf());
}

function formatDesktopJoined(d) {
  if (!isValidDate(d)) return "00 00:00";
  // e.g., "Apr 24 17:24"
  const short = new Intl.DateTimeFormat(undefined, { month: "short" }).format(d);
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${short} ${day} ${hh}:${mm}`;
}

function formatMobileJoined(d) {
  if (!isValidDate(d)) return "00.00";
  // e.g., "24.04"
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

export default function HeaderBar() {
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinedDesktop, setJoinedDesktop] = useState("00 00:00");
  const [joinedMobile, setJoinedMobile] = useState("00.00");

  useEffect(() => {
    // Initial load
    setUserId(readUserId());
    const raw = readJoinedRaw();
    const parsed = raw ? new Date(raw) : null;
    setJoinedDesktop(formatDesktopJoined(parsed));
    setJoinedMobile(formatMobileJoined(parsed));

    // Listen for changes from other tabs/windows
    const onStorage = (e) => {
      if (!e.key) return;
      if (["fx_user_id", "fx_user_userId"].includes(e.key)) {
        setUserId(readUserId());
      }
      // ✅ react to createdOn as well
      if (["createdOn", "fx_joined_at", "fx_joined", "joinedAt", "joined_at"].includes(e.key)) {
        const raw2 = readJoinedRaw();
        const parsed2 = raw2 ? new Date(raw2) : null;
        setJoinedDesktop(formatDesktopJoined(parsed2));
        setJoinedMobile(formatMobileJoined(parsed2));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const copyId = async () => {
    if (!userId) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(userId);
      } else {
        const ta = document.createElement("textarea");
        ta.value = userId;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore copy errors
    }
  };

  return (
    <div className="relative w-full rounded-t-[56px] overflow-hidden">
      {/* gradient band (clipped by rounded top) */}
      <div
        className="h-20 sm:h-24 lg:h-28
          [background:
            radial-gradient(900px_360px_at_-15%_-50%,#D4AF37_0%,transparent_60%),
            radial-gradient(700px_260px_at_40%_-60%,#B8860B_0%,transparent_55%),
            linear-gradient(120deg,#1a1206_0%,#0b0a06_60%)
          ]"
      />

      {/* content overlay */}
      <div className="absolute inset-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
          {/* ===== Desktop Header ===== */}
          <div className="hidden md:flex h-full items-center justify-between">
            {/* left: logo */}
            <div className="flex items-center gap-0">
              <img
                src={Logo}
                alt="Forton"
                className="h-auto w-[110px] gap-1 select-none pointer-events-none"
                draggable="false"
              />
            </div>

            {/* right: user chip with dynamic ID + copy + joined date */}
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="flex items-center justify-end gap-2">
                  <div className="font-semibold text-lg font-mono">
                    ID {userId || "—"}
                  </div>
                  <button
                    type="button"
                    onClick={copyId}
                    disabled={!userId}
                    title={userId ? "Copy ID" : "No ID"}
                    aria-label="Copy ID"
                    className={`
                      inline-flex items-center justify-center
                      h-6 w-6 rounded-full border
                      ${userId ? "bg-white/10 hover:bg-white/15 cursor-pointer" : "bg-white/5 opacity-50 cursor-not-allowed"}
                      border-white/10 text-white/90 transition-colors
                    `}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <div className="text-xs text-white/70">Joined {joinedDesktop}</div>
              </div>

              <div className="relative">
                <img
                  alt="Avatar"
                  src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-400"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold-500 ring-2 ring-[#0B111D]" />
              </div>
            </div>
          </div>
          {/* ===== /Desktop Header ===== */}

          {/* ===== Mobile Header ===== */}
          <div className="md:hidden h-full relative">
            {/* ‘Joined’ chip floating on the band */}
            <div className="absolute left-2 top-1">
              <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[11px]">
                Joined {joinedMobile}
              </div>
            </div>

            {/* main row near bottom of the band */}
            <div className="absolute bottom-1 left-0 right-0 px-2">
              <div className="flex items-center justify-between">
                {/* left: Users Activity */}
                <div className="flex items-center gap-2">
                  <span className="inline-grid place-items-center h-5 w-5 rounded-full bg-gold-600 text-white">
                    {/* small flame-like icon */}
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
                      <path d="M12 3c2 4-1 5-1 7 0 2 2 3 2 5 0 2-1 4-3 4-3 0-5-2-5-5 0-5 6-7 7-11z" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <span className="text-[17px] font-semibold">Users Activity</span>
                </div>

                {/* right: ID + copy (no search button) */}
                <div className="flex items-center gap-3">
                  <div className="text-right leading-none">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-[12px] font-mono">
                        ID {userId || "—"}
                      </div>
                      <button
                        type="button"
                        onClick={copyId}
                        disabled={!userId}
                        title={userId ? "Copy ID" : "No ID"}
                        aria-label="Copy ID"
                        className={`
                          inline-flex items-center justify-center
                          h-6 w-6 rounded-full border
                          ${userId ? "bg-white/10 hover:bg-white/15 cursor-pointer" : "bg-white/5 opacity-50 cursor-not-allowed"}
                          border-white/10 text-white/90 transition-colors
                        `}
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                    <div className="text-[12px] text-gold-200"> </div>
                  </div>
                  {/* removed search button on mobile */}
                </div>
              </div>
            </div>
          </div>
          {/* ===== /Mobile Header ===== */}
        </div>
      </div>
    </div>
  );
}



// // src/components/layout/HeaderBar.jsx
// import { useEffect, useState } from "react";
// import Logo from "../../assets/Connect-USDT.png";

// // Icons (no extra deps)
// const CopyIcon = ({ className = "h-3.5 w-3.5" }) => (
//   <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
//     <path d="M9 9.5A2.5 2.5 0 0 1 11.5 7h6A2.5 2.5 0 0 1 20 9.5v6A2.5 2.5 0 0 1 17.5 18h-6A2.5 2.5 0 0 1 9 15.5v-6Z" fill="currentColor" />
//     <path d="M6.5 16A2.5 2.5 0 0 1 4 13.5v-6A2.5 2.5 0 0 1 6.5 5h6A2.5 2.5 0 0 1 15 7.5V9" stroke="currentColor" strokeWidth="1.6" fill="none" />
//   </svg>
// );

// const CheckIcon = ({ className = "h-3.5 w-3.5" }) => (
//   <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
//     <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//   </svg>
// );

// // Helpers
// function readUserId() {
//   return (
//     localStorage.getItem("fx_user_id") ??
//     localStorage.getItem("fx_user_userId") ??
//     ""
//   );
// }

// function readJoinedRaw() {
//   return (
//     localStorage.getItem("fx_joined_at") ??
//     localStorage.getItem("fx_joined") ??
//     localStorage.getItem("joinedAt") ??
//     localStorage.getItem("joined_at") ??
//     ""
//   );
// }

// function isValidDate(d) {
//   return d instanceof Date && !isNaN(d.valueOf());
// }

// function formatDesktopJoined(d) {
//   if (!isValidDate(d)) return "00 00:00";
//   // e.g., "Apr 24 17:24"
//   const short = new Intl.DateTimeFormat(undefined, { month: "short" }).format(d);
//   const day = String(d.getDate()).padStart(2, "0");
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   return `${short} ${day} ${hh}:${mm}`;
// }

// function formatMobileJoined(d) {
//   if (!isValidDate(d)) return "00.00";
//   // e.g., "24.04"
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   return `${day}.${month}`;
// }

// export default function HeaderBar() {
//   const [userId, setUserId] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [joinedDesktop, setJoinedDesktop] = useState("00 00:00");
//   const [joinedMobile, setJoinedMobile] = useState("00.00");

//   useEffect(() => {
//     // Initial load
//     setUserId(readUserId());
//     const raw = readJoinedRaw();
//     const parsed = raw ? new Date(raw) : null;
//     setJoinedDesktop(formatDesktopJoined(parsed));
//     setJoinedMobile(formatMobileJoined(parsed));

//     // Listen for changes from other tabs/windows
//     const onStorage = (e) => {
//       if (!e.key) return;
//       if (["fx_user_id", "fx_user_userId"].includes(e.key)) {
//         setUserId(readUserId());
//       }
//       if (["fx_joined_at", "fx_joined", "joinedAt", "joined_at"].includes(e.key)) {
//         const raw2 = readJoinedRaw();
//         const parsed2 = raw2 ? new Date(raw2) : null;
//         setJoinedDesktop(formatDesktopJoined(parsed2));
//         setJoinedMobile(formatMobileJoined(parsed2));
//       }
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   const copyId = async () => {
//     if (!userId) return;
//     try {
//       if (navigator.clipboard?.writeText) {
//         await navigator.clipboard.writeText(userId);
//       } else {
//         const ta = document.createElement("textarea");
//         ta.value = userId;
//         ta.style.position = "fixed";
//         ta.style.opacity = "0";
//         document.body.appendChild(ta);
//         ta.select();
//         document.execCommand("copy");
//         document.body.removeChild(ta);
//       }
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1200);
//     } catch {
//       // ignore copy errors
//     }
//   };

//   return (
//     <div className="relative w-full rounded-t-[56px] overflow-hidden">
//       {/* gradient band (clipped by rounded top) */}
//       <div
//         className="h-20 sm:h-24 lg:h-28
//           [background:
//             radial-gradient(900px_360px_at_-15%_-50%,#D4AF37_0%,transparent_60%),
//             radial-gradient(700px_260px_at_40%_-60%,#B8860B_0%,transparent_55%),
//             linear-gradient(120deg,#1a1206_0%,#0b0a06_60%)
//           ]"
//       />

//       {/* content overlay */}
//       <div className="absolute inset-0">
//         <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
//           {/* ===== Desktop Header ===== */}
//           <div className="hidden md:flex h-full items-center justify-between">
//             {/* left: logo */}
//             <div className="flex items-center gap-0">
//               <img
//                 src={Logo}
//                 alt="Forton"
//                 className="h-auto w-[110px] gap-1 select-none pointer-events-none"
//                 draggable="false"
//               />
//             </div>

//             {/* right: user chip with dynamic ID + copy + joined date */}
//             <div className="flex items-center gap-3">
//               <div className="text-right leading-tight">
//                 <div className="flex items-center justify-end gap-2">
//                   <div className="font-semibold text-lg font-mono">
//                     ID {userId || "—"}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={copyId}
//                     disabled={!userId}
//                     title={userId ? "Copy ID" : "No ID"}
//                     aria-label="Copy ID"
//                     className={`
//                       inline-flex items-center justify-center
//                       h-6 w-6 rounded-full border
//                       ${userId ? "bg-white/10 hover:bg-white/15 cursor-pointer" : "bg-white/5 opacity-50 cursor-not-allowed"}
//                       border-white/10 text-white/90 transition-colors
//                     `}
//                   >
//                     {copied ? <CheckIcon /> : <CopyIcon />}
//                   </button>
//                 </div>
//                 <div className="text-xs text-white/70">Joined {joinedDesktop}</div>
//               </div>

//               <div className="relative">
//                 <img
//                   alt="Avatar"
//                   src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
//                   className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-400"
//                 />
//                 <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold-500 ring-2 ring-[#0B111D]" />
//               </div>
//             </div>
//           </div>
//           {/* ===== /Desktop Header ===== */}

//           {/* ===== Mobile Header ===== */}
//           <div className="md:hidden h-full relative">
//             {/* ‘Joined’ chip floating on the band */}
//             <div className="absolute left-2 top-1">
//               <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[11px]">
//                 Joined {joinedMobile}
//               </div>
//             </div>

//             {/* main row near bottom of the band */}
//             <div className="absolute bottom-1 left-0 right-0 px-2">
//               <div className="flex items-center justify-between">
//                 {/* left: Users Activity */}
//                 <div className="flex items-center gap-2">
//                   <span className="inline-grid place-items-center h-5 w-5 rounded-full bg-gold-600 text-white">
//                     {/* small flame-like icon */}
//                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
//                       <path d="M12 3c2 4-1 5-1 7 0 2 2 3 2 5 0 2-1 4-3 4-3 0-5-2-5-5 0-5 6-7 7-11z" stroke="white" strokeWidth="1.5" />
//                     </svg>
//                   </span>
//                   <span className="text-[17px] font-semibold">Users Activity</span>
//                 </div>

//                 {/* right: ID + copy (no search button) */}
//                 <div className="flex items-center gap-3">
//                   <div className="text-right leading-none">
//                     <div className="flex items-center justify-end gap-2">
//                       <div className="text-[12px] font-mono">
//                         ID {userId || "—"}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={copyId}
//                         disabled={!userId}
//                         title={userId ? "Copy ID" : "No ID"}
//                         aria-label="Copy ID"
//                         className={`
//                           inline-flex items-center justify-center
//                           h-6 w-6 rounded-full border
//                           ${userId ? "bg-white/10 hover:bg-white/15 cursor-pointer" : "bg-white/5 opacity-50 cursor-not-allowed"}
//                           border-white/10 text-white/90 transition-colors
//                         `}
//                       >
//                         {copied ? <CheckIcon /> : <CopyIcon />}
//                       </button>
//                     </div>
//                     <div className="text-[12px] text-gold-200"> </div>
//                   </div>
//                   {/* removed search button on mobile */}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ===== /Mobile Header ===== */}
//         </div>
//       </div>
//     </div>
//   );
// }




// // src/components/layout/HeaderBar.jsx
// import Logo from "../../assets/Connect-USDT.png";


// export default function HeaderBar() {
//   return (
//     <div className="relative w-full rounded-t-[56px] overflow-hidden">
//       {/* gradient band (clipped by rounded top) — already gold */}
//       <div
//         className="h-20 sm:h-24 lg:h-28
//           [background:
//             radial-gradient(900px_360px_at_-15%_-50%,#D4AF37_0%,transparent_60%),
//             radial-gradient(700px_260px_at_40%_-60%,#B8860B_0%,transparent_55%),
//             linear-gradient(120deg,#1a1206_0%,#0b0a06_60%)
//           ]"
//       />

//       {/* content overlay */}
//       <div className="absolute inset-0">
//         <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
//           {/* ===== Desktop Header ===== */}
//           <div className="hidden md:flex h-full items-center justify-between">
//             {/* left: logo + brand */}
//             <div className="flex items-center gap-0">
//               <img
//                 src={Logo}
//                 alt="Forton"
//                 className="h-auto w-[110px] gap-1 select-none pointer-events-none"
//                 draggable="false"
//               />
//               <span className="text-xl font-mono tracking-wide"></span>
//             </div>

//             {/* right: search + user */}
//             <div className="flex items-center gap-4">
//               {/* desktop search pill */}
//               <div className="hidden md:block">
//                 <div className="relative group">
//                   <div
//                     className="
//                       absolute -left-12 top-1/2 -translate-y-1/2
//                       h-7 w-7 rounded-full grid place-items-center
//                       bg-gold-600 text-white
//                       ring-4 ring-white/10 shadow-md shadow-black/30
//                       transition-colors
//                       group-hover:bg-gold-500
//                       focus-within:bg-gold-500
//                     "
//                     aria-hidden="true"
//                   >
//                     <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </div>
//                   <div
//                     className="
//                       pl-12 pr-4 py-2 w-[89px] h-[24px] rounded-2xl
//                       bg-white/8 border border-white/10 backdrop-blur-sm
//                       flex items-center gap-2
//                       focus-within:border-gold-600/30
//                     "
//                   >
//                     <input
//                       className="bg-transparent outline-none placeholder-white/60 text-sm text-white w-full focus-visible:ring-0"
//                       placeholder=" "
//                       aria-label="Search"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* user chip */}
//               <div className="flex items-center gap-3">
//                 <div className="text-right leading-tight">
//                   <div className="font-semibold text-lg">ID 1</div>
//                   <div className="text-xs text-white/70">Joined Apr 24 17:24</div>
//                 </div>
//                 <div className="relative">
//                   <img
//                     alt="Avatar"
//                     src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
//                     className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-400"
//                   />
//                   <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold-500 ring-2 ring-[#0B111D]" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ===== /Desktop Header ===== */}

//           {/* ===== Mobile Header ===== */}
//           <div className="md:hidden h-full relative">
//             {/* ‘Joined’ chip floating on the band */}
//             <div className="absolute left-2 top-1">
//               <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[11px]">
//                 Joined 24.04
//               </div>
//             </div>

//             {/* main row near bottom of the band */}
//             <div className="absolute bottom-1 left-0 right-0 px-2">
//               <div className="flex items-center justify-between">
//                 {/* left: Users Activity */}
//                 <div className="flex items-center gap-2">
//                   <span className="inline-grid place-items-center h-5 w-5 rounded-full bg-gold-600 text-white">
//                     {/* small flame-like icon */}
//                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
//                       <path d="M12 3c2 4-1 5-1 7 0 2 2 3 2 5 0 2-1 4-3 4-3 0-5-2-5-5 0-5 6-7 7-11z" stroke="white" strokeWidth="1.5" />
//                     </svg>
//                   </span>
//                   <span className="text-[17px] font-semibold">Users Activity</span>
//                 </div>

//                 {/* right: ID & TON + round search */}
//                 <div className="flex items-center gap-3">
//                   <div className="text-right leading-none">
//                     <div className="text-[12px]">ID 43388</div>
//                     <div className="text-[12px] text-gold-200"> </div>
//                   </div>
//                   <button
//                     aria-label="Search"
//                     className="
//                       h-9 w-9 rounded-full grid place-items-center
//                       bg-gold-600 text-white
//                       ring-4 ring-white/10 shadow-lg shadow-black/30
//                       transition-colors active:scale-[0.98]
//                       hover:bg-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60
//                     "
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ===== /Mobile Header ===== */}
//         </div>
//       </div>
//     </div>
//   );
// }



// // src/components/layout/HeaderBar.jsx
// import Logo from "../../assets/logo1.png";

// export default function HeaderBar() {
//   return (
//     <div className="relative w-full rounded-t-[56px] overflow-hidden">
//       {/* gradient band (clipped by rounded top) */}
//       <div
//         className="h-20 sm:h-24 lg:h-28
//           [background:
//          radial-gradient(900px_360px_at_-15%_-50%,#D4AF37_0%,transparent_60%),
//          radial-gradient(700px_260px_at_40%_-60%,#B8860B_0%,transparent_55%),
//          linear-gradient(120deg,#1a1206_0%,#0b0a06_60%)
//       ]"
//       />

//       {/* content overlay */}
//       <div className="absolute inset-0">
//         <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
//           {/* ===== Desktop Header (unchanged visually) ===== */}
//           <div className="hidden md:flex h-full items-center justify-between">
//             {/* left: logo + brand */}
//             <div className="flex items-center gap-0">
//               <img
//                 src={Logo}
//                 alt="Forton"
//                 className="h-16 w-20 select-none pointer-events-none"
//                 draggable="false"
//               />
//               <span className="text-2xl font-mono tracking-wide">Connect USDT</span>
//             </div>

//             {/* right: search + user */}
//             <div className="flex items-center gap-4">
//               {/* desktop search pill */}
//               <div className="hidden md:block">
//                 <div className="relative">
//                   <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#5BB8FF]
//                                   flex items-center justify-center ring-4 ring-white/10 shadow-md shadow-black/30">
//                     <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </div>
//                   <div className="pl-12 pr-4 py-2 w-[89px] h-[24px] rounded-2xl
//                                   bg-white/8 border border-white/10 backdrop-blur-sm
//                                   flex items-center gap-2">
//                     <input
//                       className="bg-transparent outline-none placeholder-white/60 text-sm text-white w-full"
//                       placeholder=" "
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* user chip */}
//               <div className="flex items-center gap-3">
//                 <div className="text-right leading-tight">
//                   <div className="font-semibold text-lg">ID 1</div>
//                   <div className="text-xs text-white/70">Joined Apr 24 17:24</div>
//                 </div>
//                 <div className="relative">
//                   <img
//                     alt="Avatar"
//                     src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
//                     className="h-11 w-11 rounded-full object-cover ring-2 ring-[#5BB8FF]"
//                   />
//                   <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#5BB8FF] ring-2 ring-[#0B111D]" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ===== Mobile Header (new, matches screenshot) ===== */}
//           <div className="md:hidden h-full relative">
//             {/* ‘Joined 24.04’ chip floating on the band */}
//             <div className="absolute left-2 top-1">
//               <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[11px]">
//                 Joined 24.04
//               </div>
//             </div>

//             {/* main row near bottom of the band */}
//             <div className="absolute bottom-1 left-0 right-0 px-2">
//               <div className="flex items-center justify-between">
//                 {/* left: Users Activity */}
//                 <div className="flex items-center gap-2">
//                   <span className="inline-grid place-items-center h-5 w-5 rounded-full bg-[#5BB8FF]">
//                     {/* small flame-like icon */}
//                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
//                       <path d="M12 3c2 4-1 5-1 7 0 2 2 3 2 5 0 2-1 4-3 4-3 0-5-2-5-5 0-5 6-7 7-11z" stroke="white" strokeWidth="1.5" />
//                     </svg>
//                   </span>
//                   <span className="text-[17px] font-semibold">Users Activity</span>
//                 </div>

//                 {/* right: ID & TON + round search */}
//                 <div className="flex items-center gap-3">
//                   <div className="text-right leading-none">
//                     <div className="text-[12px]">ID 43388</div>
//                     <div className="text-[12px] text-[#74ff74]">get 6 TON</div>
//                   </div>
//                   <button
//                     aria-label="Search"
//                     className="h-9 w-9 rounded-full bg-[#5BB8FF] text-white
//                                grid place-items-center ring-4 ring-white/10 shadow-lg shadow-black/30"
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ===== /Mobile Header ===== */}
//         </div>
//       </div>
//     </div>
//   );
// }



