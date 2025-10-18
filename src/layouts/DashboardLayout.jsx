// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import imglogo from "../assets/bg-color-blue.webp";
import HeaderBar from "../components/layout/HeaderBar";
import Sidebar from "../components/layout/SidebarItem";
import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const nav = useNavigate();

  return (
    <div className="h-screen w-full bg-[#0b1016] text-white overflow-hidden flex flex-col">
      {/* Background image (already in code) */}
      <img
        src={imglogo}
        alt="Forton"
        className="absolute"
        draggable="false"
      />

      <div className="  flex-1 overflow-hidden px-4 sm:px-8 py-6">
        {/* FULL DASHBOARD CAPSULE */}
        <div
          className="
            relative 
            mx-auto w-full max-w-[1080px]
            h-[calc(100svh-4rem)] sm:h-[calc(100svh-4rem)]
            rounded-[36px] md:rounded-[40px]
            bg-gradient-to-br from-[#3b82f6]/30 via-[#0c141f] to-[#0a0f18]

            border border-white/10
            shadow-[0_0_50px_rgba(91,184,255,0.18)]
            backdrop-blur-2xl
            overflow-hidden
            grid grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-[auto_1fr]
          "
        >
          {/* Header sits INSIDE the capsule */}
          <div className="row-start-1 col-span-full">
            <HeaderBar />
          </div>

          {/* Sidebar (desktop only, unchanged visually) */}
          <aside className="hidden md:block row-start-2 m-6">
            <Sidebar />
          </aside>

          {/* Scrollable content area.
              Extra bottom padding on mobile so content never sits under the floating dock. */}
          <main className="row-start-2 min-w-0 h-full overflow-y-auto p-5 md:p-8 pb-28 md:pb-8">
            <Outlet />
          </main>

          {/* Mobile purple glow near the bottom (to match screenshot) */}
          <div className="md:hidden pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-16 h-28 w-[85%] rounded-full blur-[60px] bg-[#7b4dff]/40" />
        </div>
      </div>

      {/* Floating bottom dock (mobile only) */}
      <div
        className="
          md:hidden fixed z-50 left-1/2 -translate-x-1/2 bottom-[calc(12px+env(safe-area-inset-bottom,0))]
          w-[calc(100%-2rem)] max-w-[520px]
          bg-[#5BB8FF]/90 backdrop-blur-md
          border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          rounded-[28px] px-3 py-3
        "
      >
        <div className="flex items-center gap-3">
          {/* tiny input (value “1”) like your screenshot */}
          <div className="flex items-center bg-white/15 rounded-2xl px-3 h-10 min-w-[56px]">
            <span className="text-white/95 text-sm font-semibold select-none">1</span>
          </div>

          {/* search circle */}
          <button   className="h-10 w-10 grid place-items-center rounded-2xl bg-white/15 shrink-0">
            <FiSearch className="text-white" size={18} />
          </button>

          {/* grid (active) */}
          <button onClick={() => nav("/main")} className="h-10 w-10 grid place-items-center rounded-2xl bg-white/25 shrink-0">
            <FiGrid className="text-white" size={18} />
          </button>

          {/* users */}
          <button onClick={() => nav("/team")} className="h-10 w-10 grid place-items-center rounded-2xl bg-white/15 shrink-0">
            <FiUsers className="text-white" size={18} />
          </button>

          {/* close (right aligned) */}
          <button   onClick={() => window.location.assign("/")} className="ml-auto h-10 w-10 grid place-items-center rounded-2xl bg-white/15 shrink-0">
            <FiX className="text-white" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}



// import { Outlet } from "react-router-dom";
// import imglogo from "../assets/bg-color-blue.webp";
// import HeaderBar from "../components/layout/HeaderBar"; // now non-fixed “inside” header
// import Sidebar from "../components/layout/SidebarItem";     // keep your existing sidebar

// export default function DashboardLayout() {
//   return (
//     <div className="h-screen w-full bg-[#0b1016] text-white overflow-hidden flex flex-col">
//       {/* Equal L/R space around the capsule */}
//                    <img 
//                     src={imglogo}
//                     alt="Forton"
//                     className="_BackgroundIcon_1naiv_1 background"
//                     draggable="false"
//                   />
//       <div className="flex-1 overflow-hidden px-4 sm:px-8 py-6">
//         {/* FULL DASHBOARD CAPSULE */}
//         <div
//           className="
//             mx-auto w-full max-w-[1080px]
//             h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)]
//             rounded-[36px] md:rounded-[40px]
//             bg-gradient-to-br from-[#111a28] via-[#0c141f] to-[#0a0f18]
//             border border-white/10
//             shadow-[0_0_50px_rgba(91,184,255,0.18)]
//             backdrop-blur-2xl
//             overflow-hidden
//             grid grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-[auto_1fr]
//           "
//         >
//           {/* Header sits INSIDE the capsule and does not scroll */}
//           <div className="row-start-1 col-span-full">
//             <HeaderBar />
//           </div>

//           {/* Sidebar (unchanged) */}
//           <aside className="hidden md:block row-start-2 m-6">
//             <Sidebar />
//           </aside>

//           {/* Only this area scrolls */}
//           <main className="row-start-2 min-w-0 h-full overflow-y-auto p-5 md:p-8">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { Outlet } from "react-router-dom";
// import HeaderBar from "../components/layout/HeaderBar";
// import Sidebar from "../components/layout/SidebarItem";

// export default function DashboardLayout() {
//   return (
//     <div className="relative max-w-[1000px] 
             
//               bg-gradient-to-br from-[#101725] via-[#0C121D] to-[#0B1016]
//               rounded-[30px]
              
              
//               p-8 sm:p-10 
//                ">
//     <div className=" h-screen w-full bg-[#0b1016] text-white flex flex-col overflow">
//       {/* Fixed Header */}
//       <HeaderBar />

//       {/* Body layout */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Scrollable Section */}
//         <main className="flex-1 overflow-y-auto p-5 md:p-8">
//           <div
//             className="
//               relative max-w-[1280px] mx-auto
//               min-h-full
//               bg-gradient-to-br from-[#101725] via-[#0C121D] to-[#0B1016]
//               rounded-[40px]
//               border border-white/10
//               shadow-[0_0_40px_rgba(91,184,255,0.15)]
//               backdrop-blur-2xl
//               p-8 sm:p-10
//               transition-all duration-300
//             "
//           >
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//     </div>
//   );
// }


// import { Outlet } from "react-router-dom";
// import HeaderBar from "../components/layout/HeaderBar";
// import Sidebar from "../components/layout/SidebarItem";

// export default function DashboardLayout() {
//   return (
//     <div className=" h-screen w-full bg-[#0b1016] text-white flex flex-col overflow-hidden">
//       {/* Fixed Header */}
//       <HeaderBar />

//       {/* Main layout grid: Sidebar + scrollable content */}
//       <div className="flex flex-1 overflow-hidden pt-[88px] md:pt-[104px]">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Scrollable content area */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           <div
//             className="max-w-[1280px] mx-auto rounded-[28px] border border-white/10 
//                        shadow-2xl bg-zinc-950/40 backdrop-blur p-6 min-h-full"
//           >
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



// import { Outlet } from 'react-router-dom'
// import HeaderBar from '../components/layout/HeaderBar'
// import SidebarItem from '../components/layout/SidebarItem'

// export default function DashboardLayout() {
//   return (
//     <div className="min-h-dvh bg-[#0b1016] text-white">
//       <div className="mx-auto max-w-[1280px] px-4 py-6">
//         <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/40 backdrop-blur">
//           {/* ===== Header ===== */}
//           <HeaderBar />

//           {/* ===== Body ===== */}
//           <div className="p-4 sm:p-6">
//             {/* grid keeps widths correct and lets the sidebar be sticky */}
//             <div className="grid md:grid-cols-[260px_1fr] gap-6 items-start">
//               {/* === SIDEBAR === */}
//               <aside className="hidden md:block self-start sticky top-6">
//                 <div
//                   className="
//                     rounded-[24px]
//                     bg-[#42b9ff]
//                     inset-glow-sky
//                     border border-white/10
//                     text-slate-900
//                     flex flex-col
//                     justify-start
//                     overflow-y-auto
//                     gap-3
//                     p-5
//                     h-[72vh] md:h-[calc(100dvh-220px)]
//                     min-h-[520px]
//                     max-h-[calc(100dvh-120px)]
//                   "
//                 >
//                   {/* search pill */}
//                   <div className="relative mb-2">
//                     <input
//                       defaultValue="1"
//                       className="
//                         w-full rounded-[18px]
//                         pl-4 pr-10 py-2.5
//                         bg-white/25 text-white placeholder-white/80
//                         outline-none border border-white/20
//                       "
//                     />
//                     <div
//                       className="
//                         absolute right-2 top-1/2 -translate-y-1/2
//                         h-8 w-8 rounded-xl
//                         bg-black/25 text-white
//                         grid place-items-center
//                       "
//                     >
//                       <svg width="18" height="18" viewBox="0 0 24 24">
//                         <path d="M11 19a8 8 0 1 1 5.293-2.707L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                   </div>

//                   {/* nav items */}
//                   <nav className="space-y-2">
//                     <SidebarItem to="/main" icon="▦" label="Main" />
//                     <SidebarItem to="/team" icon="👥" label="Team" />
//                   </nav>

//                   {/* spacer grows, push Close to bottom */}
//                   <div className="flex-1" />

//                   <button
//                     onClick={() => window.location.assign('/')}
//                     className="mt-auto flex items-center gap-2 opacity-80 hover:opacity-100"
//                   >
//                     <span className="text-2xl">×</span> Close
//                   </button>
//                 </div>
//               </aside>

//               {/* === CONTENT === */}
//               <section className="min-w-0">
//                 <Outlet />
//               </section>
//             </div>
//           </div>

//           {/* little bottom space for the curved shell */}
//           <div className="h-6" />
//         </div>
//       </div>
//     </div>
//   )
// }



