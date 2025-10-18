export default function EarnCard(){
  return (
    <div className="glass p-6 flex items-center justify-between">
      <div>
        <div className="text-white/70 mb-2">Earn</div>
        <div className="text-6xl font-semibold leading-none">50%</div>
        <div className="mt-2 text-sky-300">
          from your <span className="underline decoration-sky-500/60 underline-offset-4">direct partners</span> activated levels
        </div>
      </div>
      <button className="hidden sm:inline-grid place-items-center rounded-full h-20 w-20 bg-gradient-to-b from-sky-400 to-sky-500 shadow-[0_18px_35px_rgba(0,0,0,.6)] ring-1 ring-white/20">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white"><path fill="currentColor" d="M5 12l7-7 7 7-7 7-7-7z"/></svg>
      </button>
    </div>
  )
}
