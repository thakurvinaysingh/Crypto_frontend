
import { FiUsers, FiEye, FiTrash2, FiSettings } from "react-icons/fi";

const Diamond = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M7 4h10l4 5-9 11L3 9l4-5z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function Team() {
  const leader = {
    id: "ID 1",
    avatar:
      "https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg",
  };

  const squadMembers = [
    { rank: 1, id: "ID 1", avatar: leader.avatar, profit: "6.7k" },
    { rank: 2, id: "ID 8141", avatar: "", profit: "5.5k" },
    { rank: 3, id: "ID 10", avatar: "", profit: "5.3k" },
    { rank: 4, id: "ID 10237", avatar: "", profit: "4.6k" },
    { rank: 5, id: "ID 36", avatar: "", profit: "4.5k" },
    { rank: 6, id: "ID 11", avatar: "", profit: "4.5k" },
    { rank: 7, id: "ID 13099", avatar: "", profit: "4k" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tabs + title */}
      <section className="px-1 sm:px-0">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
            <button className="px-3 py-1.5 text-sm sm:text-base rounded-full bg-[#2f5cc0] text-white shadow-inner">
              Squads
            </button>
            <button className="px-3 py-1.5 text-sm sm:text-base rounded-full text-white/70 hover:text-white">
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

      {/* Channel card */}
      <section
        className="
          rounded-3xl p-4 sm:p-6
          bg-gradient-to-r from-[#1a263a] via-[#172132] to-[#121a28]
          border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.35)]
          text-white
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center shadow">
              <span className="text-sm font-bold">F</span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-semibold truncate">FORSAGE.io official channel</div>
              <div className="text-xs text-white/70">47,766 subscribers</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
              <span>6.4k</span>
              <FiUsers className="opacity-90" />
            </div>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
              <FiEye />
            </button>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
              <FiTrash2 />
            </button>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
              <FiSettings />
            </button>
          </div>
        </div>

        {/* yellow rating bar */}
        <div
          className="
            mt-4 rounded-2xl px-4 py-3
            bg-gradient-to-r from-[#ffcc4d] to-[#ffae33]
            text-zinc-900 font-semibold
            border border-black/10 shadow-inner
            flex items-center justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <span className="absolute inset-0 rounded-full bg-white/50" />
              <span className="absolute left-[6px] top-[6px] h-6 w-6 rounded-full bg-white/80" />
            </div>
            <span>Squad Rating</span>
          </div>
          <span className="px-3 py-1 rounded-xl bg-black/10 font-bold">#2</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-white/70">
            How to make more passive if the team is in the top 10?
          </p>
          <button className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
            Learn more
          </button>
        </div>
      </section>

      {/* Members */}
      <section
        className="
          rounded-3xl overflow-hidden
          bg-gradient-to-b from-[#1b2434] to-[#131a27]
          border border-white/10 text-white
        "
      >
        {/* header inside the card, like screenshot */}
        <div className="px-3 sm:px-6 pt-4 pb-3 flex items-center justify-between text-sm">
          <span className="opacity-80">Squad members</span>
          <span className="opacity-60">Total profit</span>
        </div>

        {/* crowned leader strip (rounded top inner, blue) */}
        <div className="px-2 sm:px-4">
          <div
            className="
              rounded-2xl bg-gradient-to-r from-[#203558] to-[#1a2a44]
              border border-white/10 shadow-inner
              px-3 sm:px-4 py-3 sm:py-4 mb-2
            "
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-[18px]">👑</span>
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
                <img src={leader.avatar} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="inline-flex items-center px-3 h-8 rounded-2xl text-sm bg-[#2f5cc0] shadow-inner">
                {leader.id}
              </span>
            </div>
          </div>
        </div>

        {/* ranked list with dashed separators (and #1 row highlighted) */}
        <div className="divide-y divide-white/10">
          {squadMembers.map((m) => (
            <div
              key={m.rank}
              className={[
                "px-3 sm:px-6 py-4 flex items-center justify-between",
                m.rank === 1 ? "bg-white/[0.02]" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-8 text-right pr-1 text-white/80">{`#${m.rank}`}</div>

                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>

                <span className="inline-flex items-center px-3 h-8 rounded-2xl text-sm bg-[#2f5cc0] shadow-inner">
                  {m.id}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <span className="text-sm sm:text-base">{m.profit}</span>
                <span className="text-[#77bfff]">
                  <Diamond className="h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* dotted line overlay under the first row (exact like screenshot) */}
        <div className="px-3 sm:px-6">
          <div className="border-t border-dashed border-white/25" />
        </div>
      </section>

      {/* keep content above the floating dock on mobile */}
      <div className="md:hidden h-24" />
    </div>
  );
}


// export default function Team(){
//   return (
//     <div className="space-y-4">
//       <div className="card p-6">
//         <h2 className="text-3xl font-semibold mb-6">Squad</h2>
//         <div className="divide-y divide-white/5">
//           {[1,2,3,4,5,6].map((n)=> (
//             <div key={n} className="flex items-center justify-between py-3">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-white/10" />
//                 <div className="opacity-80">ID {n}</div>
//               </div>
//               <div className="opacity-80">{(Math.random()*7).toFixed(1)}k ◇</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
