// src/components/layout/SidebarItem.jsx
import { useState,useEffect } from "react";
import { NavLink ,useNavigate} from "react-router-dom";
import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";
import useDisconnectAndHome from "../../hooks/useDisconnectAndHome";
import { checkUserExists } from "../../lib/api";
import { extractIds } from "../../lib/helpers";
export default function Sidebar() {
  const disconnectAndHome = useDisconnectAndHome();
const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
    // handle search submit (enter or icon click)

      useEffect(() => {
    try {
      const savedId = localStorage.getItem("fx_user_id");
      if (savedId) setSearchValue(savedId);
    } catch (err) {
      console.error("Failed to load saved ID:", err);
    }
  }, []);

const handleSearch = async (e) => {
  e.preventDefault();
  const trimmed = String(searchValue || "").trim();
  if (!trimmed) return;

  try {
    const res = await checkUserExists({ UserId: trimmed });

    if (res?.exists) {
      const { id, userId } = extractIds(res); // optional, reuse if needed
      const createdOn = res?.data?.createdOn;
    

      // Set all necessary localStorage fields
      if (id != null) localStorage.setItem("fx_user_id", String(id));
      if (userId != null) localStorage.setItem("fx_user_userId", String(userId));
      if (createdOn) localStorage.setItem("createdOn", createdOn);
      localStorage.setItem("fx_wallet_addr", "");

      // ✅ Refresh dashboard with new data
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  } catch (err) {
    console.error("Failed to fetch user:", err);
    alert("Something went wrong. Please try again.");
  }
};



  return (
    <aside
      className="
        hidden md:flex flex-col justify-between
        w-[13.5rem] h-full p-6 rounded-[34px]
        bg-[#FFD700]
       [background:linear-gradient(180deg,#FFD700_0%,#E6BE8A_45%,#B8860B_100%)]
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
      "
    >
      {/* search */}
      <div>
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-between bg-[#C9A227]/35 rounded-2xl px-3 py-2 shadow-inner"
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter ID / User ID"
            className="bg-transparent w-full outline-none placeholder-white/70 text-sm text-white"
          />
          <button
            type="submit"
            title="Search"
            className="h-8 w-8 rounded-full bg-[#B8860B]/60 flex items-center justify-center shadow-md hover:bg-[#B8860B]/80 transition"
          >
            <FiSearch className="text-white" size={16} />
          </button>
        </form>
        {/* navigation */}
        <nav className="mt-10 flex flex-col gap-4 text-white/90 font-semibold">
          <NavLink
            to="/dashboard"
            end 
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                isActive ? "bg-white/35 text-white shadow-inner" : "hover:bg-white/25",
              ].join(" ")
            }
          >
            <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md shadow-sm">
              <FiGrid size={16} />
            </span>
            Main
          </NavLink>

          <NavLink
            to="/dashboard/team"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 opacity-90",
                isActive ? "bg-white/35 text-white shadow-inner" : "hover:bg-white/25 opacity-70",
              ].join(" ")
            }
          >
            <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md shadow-sm">
              <FiUsers size={16} />
            </span>
            Team
          </NavLink>
        </nav>
      </div>

      {/* close */}
      <button
      onClick={disconnectAndHome}
        className="mt-auto flex items-center gap-2 opacity-80 hover:opacity-100 text-white/80 hover:text-white transition-all duration-300"
      >
        <FiX size={22} />
        <span className="font-semibold text-lg">Close</span>
      </button>
    </aside>
  );
}


