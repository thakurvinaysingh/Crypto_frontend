// src/components/layout/HeaderBar.jsx
import Logo from "../../assets/logo1.png";

export default function HeaderBar() {
  return (
    <div className="relative w-full rounded-t-[56px] overflow-hidden">
      {/* gradient band (clipped by rounded top) */}
      <div
        className="h-20 sm:h-24 lg:h-28
        [background:
          radial-gradient(900px_360px_at_-15%_-50%,#2E5CBD_0%,transparent_60%),
          radial-gradient(700px_260px_at_40%_-60%,#234A94_0%,transparent_55%),
          linear-gradient(120deg,#0F1F38_0%,#0B111D_60%)
        ]"
      />

      {/* content overlay */}
      <div className="absolute inset-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 text-white">
          {/* ===== Desktop Header (unchanged visually) ===== */}
          <div className="hidden md:flex h-full items-center justify-between">
            {/* left: logo + brand */}
            <div className="flex items-center gap-0">
              <img
                src={Logo}
                alt="Forton"
                className="h-16 w-20 select-none pointer-events-none"
                draggable="false"
              />
              <span className="text-2xl font-mono tracking-wide">Forton</span>
            </div>

            {/* right: search + user */}
            <div className="flex items-center gap-4">
              {/* desktop search pill */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#5BB8FF]
                                  flex items-center justify-center ring-4 ring-white/10 shadow-md shadow-black/30">
                    <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
                      <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="pl-12 pr-4 py-2 w-[89px] h-[24px] rounded-2xl
                                  bg-white/8 border border-white/10 backdrop-blur-sm
                                  flex items-center gap-2">
                    <input
                      className="bg-transparent outline-none placeholder-white/60 text-sm text-white w-full"
                      placeholder=" "
                    />
                  </div>
                </div>
              </div>

              {/* user chip */}
              <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                  <div className="font-semibold text-lg">ID 1</div>
                  <div className="text-xs text-white/70">Joined Apr 24 17:24</div>
                </div>
                <div className="relative">
                  <img
                    alt="Avatar"
                    src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#5BB8FF]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#5BB8FF] ring-2 ring-[#0B111D]" />
                </div>
              </div>
            </div>
          </div>

          {/* ===== Mobile Header (new, matches screenshot) ===== */}
          <div className="md:hidden h-full relative">
            {/* ‘Joined 24.04’ chip floating on the band */}
            <div className="absolute left-2 top-1">
              <div className="px-3 py-1 rounded-2xl bg-white/10 border border-white/10 text-[11px]">
                Joined 24.04
              </div>
            </div>

            {/* main row near bottom of the band */}
            <div className="absolute bottom-1 left-0 right-0 px-2">
              <div className="flex items-center justify-between">
                {/* left: Users Activity */}
                <div className="flex items-center gap-2">
                  <span className="inline-grid place-items-center h-5 w-5 rounded-full bg-[#5BB8FF]">
                    {/* small flame-like icon */}
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                      <path d="M12 3c2 4-1 5-1 7 0 2 2 3 2 5 0 2-1 4-3 4-3 0-5-2-5-5 0-5 6-7 7-11z" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <span className="text-[17px] font-semibold">Users Activity</span>
                </div>

                {/* right: ID & TON + round search */}
                <div className="flex items-center gap-3">
                  <div className="text-right leading-none">
                    <div className="text-[12px]">ID 43388</div>
                    <div className="text-[12px] text-[#74ff74]">get 6 TON</div>
                  </div>
                  <button
                    aria-label="Search"
                    className="h-9 w-9 rounded-full bg-[#5BB8FF] text-white
                               grid place-items-center ring-4 ring-white/10 shadow-lg shadow-black/30"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
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



// import Logo from "../../assets/logo1.png";

// export default function HeaderBar() {
//   return (
//     <div className="relative w-full rounded-t-[56px] overflow-hidden ">
//       {/* gradient band (clipped by rounded top) */}
//       <div className="h-20 sm:h-24 lg:h-28
//         [background:
//           radial-gradient(900px_360px_at_-15%_-50%,#2E5CBD_0%,transparent_60%),
//           radial-gradient(700px_260px_at_40%_-60%,#234A94_0%,transparent_55%),
//           linear-gradient(120deg,#0F1F38_0%,#0B111D_60%)
//         ]" />

//       {/* content */}
//       <div className="absolute inset-0">
//         <div className="h-full px-4 sm:px-6 lg:px-8">
//           <div className="flex h-full items-center justify-between text-white">
//             {/* left: logo + brand */}
//             <div className="flex items-center gap-0">
//               <img
//                 src={Logo}
//                 alt="Forton"
//                 className="h-16 w-20 select-none pointer-events-none"
//                 draggable="false"
//               />
//               <span className="text-2xl font-mono tracking-wide">Forton</span>
//             </div>

//             {/* right: search + user */}
//             <div className="flex items-center gap-4">
//               {/* mobile round search */}
//               <button
//                 aria-label="Search"
//                 className="md:hidden h-9 w-9 rounded-full bg-[#5BB8FF] text-white
//                            flex items-center justify-center ring-4 ring-white/10 shadow-lg shadow-black/30"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                 </svg>
//               </button>

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
//         </div>
//       </div>
//     </div>
//   );
// }


// import Logo from "../../assets/logo1.png";

// export default function HeaderBar() {
//   return (
//     <>
//       {/* Fixed, centered, same width as capsule; clipped by rounding */}
//       <header
//         className="
//           fixed z-50 top-4 left-1/2 -translate-x-1/2
//           w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-[1280px]
//           pointer-events-none
//         "
//       >
//         <div
//           className="
//             relative overflow-hidden rounded-[56px]
//             border border-white/10
//             shadow-[0_10px_30px_rgba(0,0,0,0.25)]
//             pointer-events-auto
//           "
//         >
//           {/* gradient band (inside clipped header) */}
//           <div
//             className="
//               h-20 sm:h-24 lg:h-28
//               [background:
//                 radial-gradient(900px_360px_at_-15%_-50%,#2E5CBD_0%,transparent_60%),
//                 radial-gradient(700px_260px_at_40%_-60%,#234A94_0%,transparent_55%),
//                 linear-gradient(120deg,#0F1F38_0%,#0B111D_60%)
//               ]
//             "
//           />
//           {/* content row */}
//           <div className="absolute inset-0">
//             <div className="h-full px-4 sm:px-6 lg:px-8">
//               <div className="flex h-full items-center justify-between">
//                 {/* left logo + brand */}
//                 <div className="flex items-center gap-0">
//                   <img
//                     src={Logo}
//                     alt="Forton"
//                     className="h-16 w-20 select-none pointer-events-none"
//                     draggable="false"
//                   />
//                   <span className="text-2xl font-mono tracking-wide">Forton</span>
//                 </div>

//                 {/* right: search + user */}
//                 <div className="flex items-center gap-4">
//                   {/* mobile round search */}
//                   <button
//                     aria-label="Search"
//                     className="md:hidden h-9 w-9 rounded-full bg-[#5BB8FF] text-white
//                                flex items-center justify-center ring-4 ring-white/10 shadow-lg shadow-black/30"
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </button>

//                   {/* desktop search pill */}
//                   <div className="hidden md:block">
//                     <div className="relative">
//                       <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#5BB8FF]
//                                       flex items-center justify-center ring-4 ring-white/10 shadow-md shadow-black/30">
//                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                           <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                         </svg>
//                       </div>
//                       <div className="pl-12 pr-4 py-2 w-[320px] rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm flex items-center gap-2">
//                         <input className="bg-transparent outline-none placeholder-white/60 text-sm text-white w-full" placeholder="Search user ID" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* user chip */}
//                   <div className="flex items-center gap-3">
//                     <div className="text-right leading-tight">
//                       <div className="font-semibold text-lg">ID 1</div>
//                       <div className="text-xs text-white/70">Joined Apr 24 17:24</div>
//                     </div>
//                     <div className="relative">
//                       <img
//                         alt="Avatar"
//                         src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
//                         className="h-11 w-11 rounded-full object-cover ring-2 ring-[#5BB8FF]"
//                       />
//                       <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#5BB8FF] ring-2 ring-[#0B111D]" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* spacer so capsule starts below the fixed header */}
//       <div className="h-[96px] sm:h-[112px] lg:h-[128px]" />
//     </>
//   );
// }



// import Logo from '../../assets/logo1.png'
// export default function HeaderBar() {
//   return (
//     <>
//       {/* Fixed header */}
//       <header className="fixed inset-x-0 top-0 z-50 text-white">
//         <div className="">
//           {/* gradient band (same color mood as screenshot) */}
//           <div className="h-20 sm:h-24 lg:h-28
//             [background:radial-gradient(900px_360px_at_-15%_-50%,#2E5CBD_0%,transparent_60%),radial-gradient(700px_260px_at_40%_-60%,#234A94_0%,transparent_55%),linear-gradient(120deg,#0F1F38_0%,#0B111D_60%)]" />

//           {/* content */}
//           <div className="absolute inset-0">
//             <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
//               <div className="flex h-full items-center justify-between">
//                 {/* left: logo + name */}
//                 <div className="flex items-center gap-0">
//                    <img
//                            src={Logo}
//                            alt="Forton"
//                            className="h-16 w-20 select-none pointer-events-none"
//                            draggable="false"
//                          />
//                   <span className="text-2xl font-mono tracking-wide">Forton</span>
//                 </div>

//                 {/* right: search + user */}
//                 <div className="flex items-center gap-4">
//                   {/* round search (mobile) */}
//                   <button
//                     aria-label="Search"
//                     className="md:hidden h-9 w-9 rounded-full bg-[#5BB8FF] text-white flex items-center justify-center
//                                ring-4 ring-white/10 shadow-lg shadow-black/30"
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </button>

//                   {/* search pill (desktop) with floating circle */}
//                   <div className="hidden md:block">
//                     <div className="relative">
//                       <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#5BB8FF]
//                                       flex items-center justify-center ring-4 ring-white/10 shadow-md shadow-black/30">
//                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                           <path d="M11 19a8 8 0 1 1 5.3-2.7L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                         </svg>
//                       </div>
//                       <div className="pl-12 pr-4 py-2 w-[320px] rounded-2xl
//                                       bg-white/8 border border-white/10 backdrop-blur-sm
//                                       flex items-center gap-2">
//                         <input
//                           className="bg-transparent outline-none placeholder-white/60 text-sm text-white w-full"
//                           placeholder="Search user ID"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* user chip */}
//                   <div className="flex items-center gap-3">
//                     <div className="text-right leading-tight">
//                       <div className="font-semibold text-lg">ID 1</div>
//                       <div className="text-xs text-white/70">Joined Apr 24 17:24</div>
//                     </div>
//                     <div className="relative">
//                       <img
//                         alt="Avatar"
//                         src="https://c.forsage.io/forton-prod/user_photo/f8cf5062-e118-40b3-8100-c57de8326390.jpeg"
//                         className="h-11 w-11 rounded-full object-cover ring-2 ring-[#5BB8FF]"
//                       />
//                       {/* small blue badge */}
//                       <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#5BB8FF] ring-2 ring-[#0B111D]" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* spacer so page content doesn't hide behind the fixed header */}
//       <div className="h-20 sm:h-24 lg:h-28" />
//     </>
//   );
// }
