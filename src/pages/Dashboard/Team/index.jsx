// src/pages/dashboard/Team.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSquadData } from "../../../lib/api"; // adjust if you use an alias like @/lib/api

// Inline USDT icon (no external deps)
const UsdtIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
    <circle cx="128" cy="128" r="128" fill="#26A17B" />
    <path
      fill="#FFF"
      d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
    />
  </svg>
);

export default function Team() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const SQUAD_ID = 77;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getSquadData(SQUAD_ID);
        if (!mounted) return;
        setRows(data);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const formatAmount = (val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "0";
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(n);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tabs + title */}
      <section className="px-1 sm:px-0">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
            <button
              className="px-3 py-1.5 text-sm sm:text-base rounded-full bg-gradient-to-r from-gold-500 to-gold-700 text-white shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
            >
              Squads
            </button>
            <button
              className="px-3 py-1.5 text-sm sm:text-base rounded-full text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
              onClick={() => navigate("/dashboard/partners")}
            >
              Partners
            </button>
          </div>
        </div>

        <h1 className="mt-3 text-[30px] sm:text-[40px] font-semibold leading-tight">
          Squad
        </h1>
        <p className="mt-1 text-white/70 max-w-[56ch] text-sm sm:text-base">
          Create your own Squad or join an existing one. This will help you boost your team earnings
        </p>
      </section>

      {/* Data Table Card (theme preserved) */}
      <section
        className="
          rounded-3xl p-4 sm:p-6
          bg-gradient-to-b from-[#161b1f] to-[#0f1418]
          border border-white/10 text-white
          shadow-[0_8px_28px_rgba(0,0,0,0.35)]
        "
      >
        <header className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center shadow">
              <span className="text-sm font-bold">S</span>
            </div>
            <div>
              <div className="font-semibold">Squad Members</div>
              <div className="text-xs text-white/60">Live data </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/10 text-xs sm:text-sm">
            ID: {SQUAD_ID}
          </span>
        </header>

        {/* Responsive table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm sm:text-base">
              <thead className="bg-white/[0.04]">
                <tr className="text-white/80">
                  <th className="px-4 sm:px-6 py-3 font-medium">UserId</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      TotalAmount
                      <UsdtIcon className="h-3.5 w-3.5 opacity-90" />
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading && (
                  <tr>
                    <td colSpan={2} className="px-4 sm:px-6 py-6 text-center text-white/70">
                      Loading squad data…
                    </td>
                  </tr>
                )}

                {!loading && err && (
                  <tr>
                    <td colSpan={2} className="px-4 sm:px-6 py-6 text-center text-red-300">
                      {err}
                    </td>
                  </tr>
                )}

                {!loading && !err && rows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 sm:px-6 py-6 text-center text-white/70">
                      No squad data found.
                    </td>
                  </tr>
                )}

                {!loading && !err && rows.map((m, idx) => (
                  <tr key={`${m?.UserId ?? "uid"}-${idx}`} className={idx % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="inline-flex items-center px-3 h-8 rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-gold-500 to-gold-700 shadow-inner">
                        {m?.UserId ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-white/90">
                      <span className="inline-flex items-center gap-2">
                        {formatAmount(m?.TotalAmount)}
                        <UsdtIcon className="h-4 w-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip bar (keeps theme) */}
        <div
          className="
            mt-4 rounded-2xl px-4 py-3
            bg-gradient-to-r from-gold-300 to-gold-500
            text-zinc-900 font-semibold
            border border-black/10 shadow-inner
            flex items-center justify-between
          "
        >
          <span className="inline-flex items-center gap-2">
            70%
            <UsdtIcon className="h-5 w-5" />
          </span>
          <span className="px-3 py-1 rounded-xl bg-black/10 font-bold text-xs sm:text-sm inline-flex items-center gap-2">
            <UsdtIcon className="h-4 w-4" />
            from your direct partners activated levels.
          </span>
        </div>
      </section>

      {/* keep content above the floating dock on mobile */}
      <div className="md:hidden h-24" />
    </div>
  );
}



// // src/pages/dashboard/Team.jsx
// import { FiUsers, FiEye, FiTrash2, FiSettings } from "react-icons/fi";
// import { useEffect, useState } from "react";
// import { getSquadData } from "../../../lib/api"; // Adjust path if needed

// // Inline USDT icon to keep the same icon slot & spacing
// const UsdtIcon = ({ className = "h-4 w-4" }) => (
//   <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
//     <circle cx="128" cy="128" r="128" fill="#26A17B" />
//     <path
//       fill="#FFF"
//       d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
//     />
//   </svg>
// );

// export default function Team() {
// const [squadMembers, setSquadMembers] = useState([]);
// const [loading, setLoading] = useState(true);

//   const leader = {
//     id: "ID 1",
//     // Removed external forsage CDN. Empty string = existing neutral fallback block (no UI change)
//     avatar: "",
//   };

// useEffect(() => {
//   async function fetchSquad() {
//     try {
//       const data = await getSquadData(77); // Hardcoded ID for now
//       setSquadMembers(data);
//     } catch (error) {
//       console.error("Failed to fetch squad data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchSquad();
// }, []);

//   // const squadMembers = [
//   //   { rank: 1, id: "ID 1", avatar: leader.avatar, profit: "6.7k" },
//   //   { rank: 2, id: "ID 8141", avatar: "", profit: "5.5k" },
//   //   { rank: 3, id: "ID 10", avatar: "", profit: "5.3k" },
//   //   { rank: 4, id: "ID 10237", avatar: "", profit: "4.6k" },
//   //   { rank: 5, id: "ID 36", avatar: "", profit: "4.5k" },
//   //   { rank: 6, id: "ID 11", avatar: "", profit: "4.5k" },
//   //   { rank: 7, id: "ID 13099", avatar: "", profit: "4k" },
//   // ];

//   return (
//     <div className="space-y-6 sm:space-y-8">
//       {/* Tabs + title */}
//       <section className="px-1 sm:px-0">
//         <div className="flex items-center gap-2">
//           <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
//             <button className="px-3 py-1.5 text-sm sm:text-base rounded-full bg-gradient-to-r from-gold-500 to-gold-700 text-white shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60">
//               Squads
//             </button>
//             <button className="px-3 py-1.5 text-sm sm:text-base rounded-full text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40">
//               Partners
//             </button>
//           </div>
//         </div>

//         <h1 className="mt-3 text-[30px] sm:text-[40px] font-semibold leading-tight">
//           Squad
//         </h1>
//         <p className="mt-1 text-white/70 max-w-[56ch] text-sm sm:text-base">
//           Create your own Squad or join an existing one. This will help you boost your team earnings
//         </p>
//       </section>

//       {/* Channel card */}
//       <section
//         className="
//           rounded-3xl p-4 sm:p-6
//           bg-gradient-to-r from-[#14181e] via-[#10151a] to-[#0b1016]
//           border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.35)]
//           text-white
//         "
//       >
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center shadow">
//               <span className="text-sm font-bold">G</span>
//             </div>
//             <div className="leading-tight min-w-0">
//               <div className="font-semibold truncate">Connect USDT official channel</div>
//               <div className="text-xs text-white/70">47,766 subscribers</div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 shrink-0">
//             <div className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
//               <span>6.4k</span>
//               <FiUsers className="opacity-90" />
//             </div>
//             <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
//               <FiEye />
//             </button>
//             <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
//               <FiTrash2 />
//             </button>
//             <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
//               <FiSettings />
//             </button>
//           </div>
//         </div>

//         {/* yellow rating bar */}
//         <div
//           className="
//             mt-4 rounded-2xl px-4 py-3
//             bg-gradient-to-r from-gold-300 to-gold-500
//             text-zinc-900 font-semibold
//             border border-black/10 shadow-inner
//             flex items-center justify-between
//           "
//         >
//           <div className="flex items-center gap-3">
//             <div className="relative h-9 w-9">
//               <span className="absolute inset-0 rounded-full bg-white/50" />
//               <span className="absolute left-[6px] top-[6px] h-6 w-6 rounded-full bg-white/80" />
//             </div>
//             <span>Squad Rating</span>
//           </div>
//           <span className="px-3 py-1 rounded-xl bg-black/10 font-bold">#2</span>
//         </div>

//         <div className="mt-4 flex items-center justify-between">
//           <p className="text-sm text-white/70">
//             How to make more passive if the team is in the top 10?
//           </p>
//           <button className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
//             Learn more
//           </button>
//         </div>
//       </section>

//       {/* Members */}
//       <section
//         className="
//           rounded-3xl overflow-hidden
//           bg-gradient-to-b from-[#161b1f] to-[#0f1418]
//           border border-white/10 text-white
//         "
//       >
//         {/* header inside the card, like screenshot */}
//         <div className="px-3 sm:px-6 pt-4 pb-3 flex items-center justify-between text-sm">
//           <span className="opacity-80">Squad members</span>
//           <span className="opacity-60">Total profit</span>
//         </div>

//         {/* crowned leader strip */}
//         <div className="px-2 sm:px-4">
//           <div
//             className="
//               rounded-2xl bg-gradient-to-r from-gold-700/20 to-gold-900/25
//               border border-white/10 shadow-inner
//               px-3 sm:px-4 py-3 sm:py-4 mb-2
//             "
//           >
//             <div className="flex items-center gap-3 sm:gap-4">
//               <span className="text-[18px]">👑</span>
//               <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
//                 {leader.avatar ? (
//                   <img src={leader.avatar} alt="" className="h-full w-full object-cover" />
//                 ) : (
//                   <div className="h-full w-full bg-white/10" />
//                 )}
//               </div>
//               <span className="inline-flex items-center px-3 h-8 rounded-2xl text-sm bg-gradient-to-r from-gold-500 to-gold-700 shadow-inner">
//                 {leader.id}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ranked list */}
//         <div className="divide-y divide-white/10">
//           {squadMembers.map((m) => (
//             <div
//               key={m.rank}
//               className={[
//                 "px-3 sm:px-6 py-4 flex items-center justify-between",
//                 m.rank === 1 ? "bg-white/[0.02]" : "",
//               ].join(" ")}
//             >
//               <div className="flex items-center gap-3 sm:gap-4 min-w-0">
//                 <div className="w-8 text-right pr-1 text-white/80">{`#${m.rank}`}</div>

//                 <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
//                   {m.avatar ? (
//                     <img src={m.avatar} alt="" className="h-full w-full object-cover" />
//                   ) : (
//                     <div className="h-full w-full bg-white/10" />
//                   )}
//                 </div>

//                 <span className="inline-flex items-center px-3 h-8 rounded-2xl text-sm bg-gradient-to-r from-gold-500 to-gold-700 shadow-inner">
//                   {m.id}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2 text-white/90">
//                 <span className="text-sm sm:text-base">{m.profit}</span>
//                 <span className="text-gold-400">
//                   <UsdtIcon className="h-4 w-4" />
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* dotted line under the first row */}
//         <div className="px-3 sm:px-6">
//           <div className="border-t border-dashed border-white/25" />
//         </div>
//       </section>

//       {/* keep content above the floating dock on mobile */}
//       <div className="md:hidden h-24" />
//     </div>
//   );
// }

