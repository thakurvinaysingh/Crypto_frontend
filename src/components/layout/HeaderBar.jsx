// src/components/layout/HeaderBar.jsx
import { useEffect, useState } from "react";
import Logo from "../../assets/Connect-USDT.png"; // Ensure this path is correct

// --- ICONS ---
const CopyIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShareIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CloseIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Social Icons
const WhatsAppIcon = () => <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;
const FbIcon = () => <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const XIcon = () => <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const InstaIcon = () => <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;

// --- HELPERS (Untouched logic) ---
function readUserId() {
  return (
    localStorage.getItem("fx_user_id") ??
    localStorage.getItem("fx_user_userId") ??
    ""
  );
}
function readJoinedRaw() {
  return (
    localStorage.getItem("createdOn") ??
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
  const short = new Intl.DateTimeFormat(undefined, { month: "short" }).format(d);
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${short} ${day} ${hh}:${mm}`;
}
function formatMobileJoined(d) {
  if (!isValidDate(d)) return "00.00";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

// --- COMPONENTS ---

const ShareModal = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  const handleShare = (platform) => {
    const text = encodeURIComponent("Join me on Connect USDT!");
    const link = encodeURIComponent(url);
    let targetUrl = "";

    switch (platform) {
      case "whatsapp":
        targetUrl = `https://wa.me/?text=${text}%20${link}`;
        break;
      case "facebook":
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
        break;
      case "twitter":
        targetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
        break;
      case "instagram":
        window.open("https://instagram.com", "_blank");
        return; // Insta doesn't support direct share link
      default:
        return;
    }
    window.open(targetUrl, "_blank", "width=600,height=400");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all scale-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Share Referral</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* WhatsApp */}
          <button 
            onClick={() => handleShare('whatsapp')}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <WhatsAppIcon />
            </div>
            <span className="text-xs text-white/80">WhatsApp</span>
          </button>

          {/* Facebook */}
          <button 
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FbIcon />
            </div>
            <span className="text-xs text-white/80">Facebook</span>
          </button>

          {/* Twitter/X */}
          <button 
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <XIcon />
            </div>
            <span className="text-xs text-white/80">X</span>
          </button>

          {/* Instagram */}
          <button 
            onClick={() => handleShare('instagram')}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <InstaIcon />
            </div>
            <span className="text-xs text-white/80">Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HeaderBar() {
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinedDesktop, setJoinedDesktop] = useState("00 00:00");
  const [joinedMobile, setJoinedMobile] = useState("00.00");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setUserId(readUserId());
    const raw = readJoinedRaw();
    const parsed = raw ? new Date(raw) : null;
    setJoinedDesktop(formatDesktopJoined(parsed));
    setJoinedMobile(formatMobileJoined(parsed));

    const onStorage = (e) => {
      if (!e.key) return;
      if (["fx_user_id", "fx_user_userId"].includes(e.key)) {
        setUserId(readUserId());
      }
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

  const baseUrl = "https://connectusdt.com/onboard";
  // const baseUrl = "http://localhost:5173/onboard"; // Uncomment for local dev
  const fullLink = userId ? `${baseUrl}?ref=${userId}` : "";

  const copyLink = async () => {
    if (!fullLink) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullLink);
      } else {
        const ta = document.createElement("textarea");
        ta.value = fullLink;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="relative w-full rounded-t-[56px] overflow-hidden">
        {/* Background Gradient */}
        <div
          className="h-24 sm:h-24 lg:h-28
          [background:
          radial-gradient(900px_360px_at_-15%_-50%,#D4AF37_0%,transparent_60%),
          radial-gradient(700px_260px_at_40%_-60%,#B8860B_0%,transparent_55%),
          linear-gradient(120deg,#1a1206_0%,#0b0a06_60%)
          ]"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0">
          <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
            
            {/* ===== Desktop Header (MD+) ===== */}
            <div className="hidden md:flex h-full items-center justify-between">
              {/* Left: Logo */}
              <div className="flex items-center">
                <img
                  src={Logo}
                  alt="Connect USDT"
                  className="h-auto w-[120px] select-none pointer-events-none"
                  draggable="false"
                />
              </div>

              {/* Right: URL + Actions + Profile */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end justify-center">
                  {/* URL Bar */}
                  <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full border border-white/10 p-1 pl-4 gap-2">
                    {/* <span className="text-sm text-white/80 font-mono max-w-[200px] truncate select-all">
                     Referrel code {fullLink || "No ID Found"}
                    </span> */}
                      <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Referral Link</span>
                    <div className="text-xs text-white/90 font-mono truncate select-all">
                      {fullLink || "—"}
                    </div>
                  </div>
                    
                    {/* Share Button */}
                    <button
                      onClick={() => setShareOpen(true)}
                      disabled={!fullLink}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                      title="Share"
                    >
                      <ShareIcon />
                    </button>

                    {/* Gold Copy Button */}
                    <button
                      onClick={copyLink}
                      disabled={!fullLink}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700] hover:bg-[#E5C100] text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copied ? "Copied!" : "Copy Link"}
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="text-[11px] text-white/50 mt-1 pr-2">
                    Joined: {joinedDesktop}
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <img
                    alt="Avatar"
                    src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gold-400"
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-[#0B111D]" />
                </div>
              </div>
            </div>

            {/* ===== Mobile Header (Below MD) ===== */}
            <div className=" h-full relative flex flex-col justify-between py-2">

              
               <div className="flex justify-between items-start">
    <div className="flex items-center gap-2">
      {/* Small logo for mobile */}
      <img
        src={Logo}
        alt="Connect USDT"
        className="h-8 w-auto sm:h-8 select-none pointer-events-none"
        draggable="false"
      />
      <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[10px] backdrop-blur-sm">
        Joined {joinedMobile}
      </div>
    </div>
    {/* (You can still add avatar on the right later if you want) */}
  </div>

              {/* Bottom Row: URL Component */}
              <div className="w-full pb-1">
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2 flex items-center gap-2">
                  
                  {/* URL Text Area */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Referral Link</span>
                    <div className="text-xs text-white/90 font-mono truncate select-all">
                      {fullLink || "—"}
                    </div>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Share */}
                    <button
                      onClick={() => setShareOpen(true)}
                      disabled={!fullLink}
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white active:bg-white/20 transition-colors"
                    >
                      <ShareIcon />
                    </button>

                    {/* Copy (Gold) */}
                    <button
                      onClick={copyLink}
                      disabled={!fullLink}
                      className={`
                        h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg 
                        bg-[#FFD700] text-black font-bold text-xs shadow-lg shadow-gold-900/20
                        active:scale-95 transition-transform
                        ${!fullLink ? 'opacity-50' : ''}
                      `}
                    >
                      {copied ? (
                        <>
                          <CheckIcon />
                        </>
                      ) : (
                        <>
                          <span>Copy</span>
                          <CopyIcon />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* ===== /Mobile Header ===== */}

          </div>
        </div>
      </div>

      {/* Share Popup */}
      <ShareModal 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        url={fullLink} 
      />
    </>
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

// // ✅ Now includes "createdOn" (checked first)
// function readJoinedRaw() {
//   return (
//     localStorage.getItem("createdOn") ??            // <-- new
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
//       // ✅ react to createdOn as well
//       if (["createdOn", "fx_joined_at", "fx_joined", "joinedAt", "joined_at"].includes(e.key)) {
//         const raw2 = readJoinedRaw();
//         const parsed2 = raw2 ? new Date(raw2) : null;
//         setJoinedDesktop(formatDesktopJoined(parsed2));
//         setJoinedMobile(formatMobileJoined(parsed2));
//       }
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

// const copyId = async () => {
//   if (!userId) return;

//   const baseUrl = "https://connectusdt.com/onboard";
//   // const baseUrl = "http://localhost:5173/onboard";
//   const fullLink = `${baseUrl}?ref=${userId}`;

//   try {
//     if (navigator.clipboard?.writeText) {
//       await navigator.clipboard.writeText(fullLink);
//     } else {
//       const ta = document.createElement("textarea");
//       ta.value = fullLink;
//       ta.style.position = "fixed";
//       ta.style.opacity = "0";
//       document.body.appendChild(ta);
//       ta.select();
//       document.execCommand("copy");
//       document.body.removeChild(ta);
//     }
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1200);
//   } catch {
//   }
// };


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
//                     Referrel-ID {userId || "—"} 
//                   </div>
//                   <button
//                     type="button"
//                     onClick={copyId}
//                     disabled={!userId}
//                     title={userId ? "Referrel-ID" : "Referrel-No ID"}
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





