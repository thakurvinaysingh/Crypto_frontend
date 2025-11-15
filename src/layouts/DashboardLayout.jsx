import { Outlet, useNavigate } from "react-router-dom";
import imglogo from "../assets/bg-color-blue.webp";
import HeaderBar from "../components/layout/HeaderBar";
import Sidebar from "../components/layout/SidebarItem";
import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";
import useDisconnectAndHome from "../hooks/useDisconnectAndHome"; // ✅ optional (see ❌ button)
import { useState } from "react";
import { checkUserExists } from "../lib/api";
import { extractIds } from "../lib/helpers";

export default function DashboardLayout() {
  const nav = useNavigate();
  const disconnectAndHome = useDisconnectAndHome(); // ✅ optional
const [mobileSearchValue, setMobileSearchValue] = useState("");

const handleMobileSearch = async () => {
  const trimmed = String(mobileSearchValue || "").trim();
  if (!trimmed) return;

  try {
    const res = await checkUserExists({ UserId: trimmed });

    if (res?.exists) {
      const { id, userId } = extractIds(res);
      const createdOn = res?.data?.createdOn;

      if (id != null) localStorage.setItem("fx_user_id", String(id));
      if (userId != null) localStorage.setItem("fx_user_userId", String(userId));
      if (createdOn) localStorage.setItem("createdOn", createdOn);
      localStorage.setItem("fx_wallet_addr", "");

      window.location.href = "/dashboard"; // force refresh
    } else {
      alert("User not found.");
    }
  } catch (err) {
    console.error("Failed to fetch user:", err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="h-screen w-full bg-[#0b1016] text-white overflow-hidden flex flex-col">
      {/* Background image (unchanged asset; we warm the capsule itself below) */}
      <img
        src={imglogo}
        alt="Forton"
        className="absolute"
        draggable="false"
      />

      <div className="flex-1 overflow-hidden px-4 sm:px-8 py-6">
        {/* FULL DASHBOARD CAPSULE */}
        <div
          className="
            relative 
            mx-auto w-full max-w-[1080px]
            h-[calc(100svh-4rem)] sm:h-[calc(100svh-4rem)]
            rounded-[36px] md:rounded-[40px]

            /* 🔶 capsule gradient: gold tint */
            bg-gradient-to-br from-gold-400/25 via-[#0c141f] to-[#0a0f18]

            border border-white/10
            /* 🔶 gold glow instead of blue */
            shadow-[0_0_50px_rgba(212,175,55,0.18)]
            backdrop-blur-2xl
            overflow-hidden
            grid grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-[auto_1fr]
          "
        >
          {/* subtle golden overlay inside capsule for warmth (no layout change) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold-600/5 to-gold-700/10" />

          {/* Header sits INSIDE the capsule */}
          <div className="row-start-1 col-span-full relative">
            <HeaderBar />
          </div>

          {/* Sidebar (desktop only) */}
          <aside className="hidden md:block row-start-2 m-6 relative">
            <Sidebar />
          </aside>

          {/* Scrollable content */}
          <main className="row-start-2 min-w-0 h-full overflow-y-auto p-5 md:p-8 pb-28 md:pb-8 relative">
            <Outlet />
          </main>

          {/* 🔶 Mobile bottom glow changed to gold */}
          <div className="md:hidden pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-16 h-28 w-[85%] rounded-full blur-[60px] bg-gold-600/35" />
        </div>
      </div>

      {/* 🔶 Floating bottom dock (mobile only) goes gold */}
      <div
        className="
          md:hidden fixed z-50 left-1/2 -translate-x-1/2 bottom-[calc(12px+env(safe-area-inset-bottom,0))]
          w-[calc(100%-2rem)] max-w-[520px]
          bg-gold-700/90 backdrop-blur-md
          border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          rounded-[28px] px-3 py-3
        "
      >
        <div className="flex items-center gap-3">
          {/* tiny input (value “1”) */}
        <div className="flex items-center gap-2 w-full">
  {/* Responsive user ID input */}
  <input
    type="text"
    value={mobileSearchValue}
    onChange={(e) => setMobileSearchValue(e.target.value)}
    placeholder="Enter User ID"
    className="
      flex-grow
      bg-white/15 text-white placeholder-white/70
      rounded-xl p-2 py-0 h-10 w-4
      text-sm outline-none
      transition focus:bg-white/25
    "
  />

  {/* Search button */}
  <button
    onClick={handleMobileSearch}
    className="
      flex-shrink-0
      h-10 w-10
      grid place-items-center
      rounded-xl bg-white/20 hover:bg-white/30
      transition
    "
  >
    <FiSearch className="text-white" size={18} />
  </button>
</div>



          {/* grid (active) */}
          <button onClick={() => nav("/dashboard")} className="h-10 w-10 grid place-items-center rounded-2xl bg-white/25 shrink-0">
            <FiGrid className="text-white" size={18} />
          </button>

          {/* users */}
          <button onClick={() => nav("/dashboard/team")} className="h-10 w-10 grid place-items-center rounded-2xl bg-white/15 shrink-0">
            <FiUsers className="text-white" size={18} />
          </button>

          {/* 🔶 close → (optional) disconnect + route home using your hook */}
          <button onClick={disconnectAndHome} className="ml-auto h-10 w-10 grid place-items-center rounded-2xl bg-white/15 shrink-0">
            <FiX className="text-white" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}







