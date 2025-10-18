// src/components/layout/SidebarItem.jsx
import { NavLink } from "react-router-dom";
import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside
      className="
        hidden md:flex flex-col justify-between
        w-[13.5rem] h-full p-6 rounded-[34px]
        bg-[#5BB8FF]
        [background:linear-gradient(180deg,#5bb8ff_0%,#4ea7ee_50%,#3b91da_100%)]
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
      "
    >
      {/* search */}
      <div>
        <div className="flex items-center justify-between bg-[#3D89D0]/40 rounded-2xl px-3 py-2 shadow-inner">
          <input
            defaultValue="1"
            className="bg-transparent w-full outline-none placeholder-white/70 text-sm text-white"
          />
          <button className="h-8 w-8 rounded-full bg-[#3D89D0]/60 flex items-center justify-center shadow-md">
            <FiSearch className="text-white" size={16} />
          </button>
        </div>

        {/* navigation */}
        <nav className="mt-10 flex flex-col gap-4 text-white/90 font-semibold">
          <NavLink
            to="/main"
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
            to="/team"
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
        onClick={() => window.location.assign("/")}
        className="mt-auto flex items-center gap-2 opacity-80 hover:opacity-100 text-white/80 hover:text-white transition-all duration-300"
      >
        <FiX size={22} />
        <span className="font-semibold text-lg">Close</span>
      </button>
    </aside>
  );
}



// import { NavLink } from "react-router-dom";
// import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";

// export default function Sidebar() {
//   return (
//     <aside
//       className="
//         hidden md:flex flex-col justify-between
//         w-54 h-full p-6 rounded-[34px]
//         bg-[#5BB8FF]
//         [background:linear-gradient(180deg,#5bb8ff_0%,#4ea7ee_50%,#3b91da_100%)]
//         shadow-[0_8px_30px_rgba(0,0,0,0.25)]
//         transition-all duration-300
//       "
//     >
//       {/* search */}
//       <div>
//         <div className="flex items-center justify-between bg-[#3D89D0]/40 rounded-2xl px-3 py-2 shadow-inner">
//           <input
//             defaultValue="1"
//             className="bg-transparent w-full outline-none placeholder-white/70 text-sm text-white"
//           />
//           <button className="h-8 w-8 rounded-full bg-[#3D89D0]/60 flex items-center justify-center shadow-md">
//             <FiSearch className="text-white" size={16} />
//           </button>
//         </div>

//         {/* navigation */}
//         <nav className="mt-10 flex flex-col gap-4 text-white/90 font-semibold">
//           <NavLink
//             to="/main"
//             className={({ isActive }) =>
//               [
//                 "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
//                 isActive
//                   ? "bg-white/35 text-white shadow-inner"
//                   : "hover:bg-white/25",
//               ].join(" ")
//             }
//           >
//             <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md shadow-sm">
//               <FiGrid size={16} />
//             </span>
//             Main
//           </NavLink>

//           <NavLink
//             to="/team"
//             className={({ isActive }) =>
//               [
//                 "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 opacity-90",
//                 isActive
//                   ? "bg-white/35 text-white shadow-inner"
//                   : "hover:bg-white/25 opacity-70",
//               ].join(" ")
//             }
//           >
//             <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md shadow-sm">
//               <FiUsers size={16} />
//             </span>
//             Team
//           </NavLink>
//         </nav>
//       </div>

//       {/* close */}
//       <button
//         onClick={() => window.location.assign("/")}
//         className="mt-auto flex items-center gap-2 opacity-80 hover:opacity-100 text-white/80 hover:text-white transition-all duration-300"
//       >
//         <FiX size={22} />
//         <span className="font-semibold text-lg">Close</span>
//       </button>
//     </aside>
//   );
// }


// import { NavLink } from "react-router-dom";
// import { FiSearch, FiGrid, FiUsers, FiX } from "react-icons/fi";

// export default function Sidebar() {
//   return (
//     <aside
//       className="
//         hidden md:flex flex-col justify-between
//         w-64 h-full p-5 rounded-r-[28px]
//         bg-[#5BB8FF] text-white
//         [background:radial-gradient(600px_600px_at_-40%_-20%,#66b9ff_0%,#4daeff_60%,#58b4ff_100%)]
//       "
//     >
//       {/* Search bar */}
//       <div>
//         <div className="flex items-center justify-between bg-[#3D89D0]/40 rounded-2xl px-3 py-2">
//           <input
//             defaultValue="1"
//             className="bg-transparent w-full outline-none placeholder-white/70 text-sm text-white"
//           />
//           <button className="h-8 w-8 rounded-full bg-[#3D89D0]/60 flex items-center justify-center">
//             <FiSearch className="text-white" size={16} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-8 flex flex-col gap-4 text-white/90 font-semibold">
//           <NavLink
//             to="/main"
//             className={({ isActive }) =>
//               [
//                 "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors",
//                 isActive ? "bg-white/35 text-white" : "hover:bg-white/25",
//               ].join(" ")
//             }
//           >
//             <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md">
//               <FiGrid size={16} />
//             </span>
//             Main
//           </NavLink>

//           <NavLink
//             to="/team"
//             className={({ isActive }) =>
//               [
//                 "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors opacity-90",
//                 isActive ? "bg-white/35 text-white" : "hover:bg-white/25 opacity-70",
//               ].join(" ")
//             }
//           >
//             <span className="h-6 w-6 grid place-items-center bg-white/30 rounded-md">
//               <FiUsers size={16} />
//             </span>
//             Team
//           </NavLink>
//         </nav>
//       </div>

//       {/* Close button */}
//       <button
//         onClick={() => window.location.assign("/")}
//         className="mt-auto flex items-center gap-2 opacity-80 hover:opacity-100 text-white/80 hover:text-white transition-colors"
//       >
//         <FiX size={22} />
//         <span className="font-semibold text-lg">Close</span>
//       </button>
//     </aside>
//   );
// }



// import { NavLink } from 'react-router-dom'

// export default function SidebarItem({ to, icon, label }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         [
//           'flex items-center gap-3 rounded-xl px-3 py-3',
//           'transition-colors',
//           isActive ? 'bg-white/35' : 'hover:bg-white/25'
//         ].join(' ')
//       }
//     >
//       <span className="h-6 w-6 rounded-md bg-white/30 grid place-items-center text-base">
//         {icon}
//       </span>
//       <span className="font-semibold">{label}</span>
//     </NavLink>
//   )
// }
