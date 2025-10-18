export default function ProgressStrip() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-white/70 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 rounded-full bg-black/30 border border-white/10 items-center justify-center">🤖</span>
          <span>Potential profit</span>
          <span className="opacity-60">ⓘ</span>
        </div>
        <div className="font-medium">963,848 TON</div>
      </div>
      <div className="h-[3px] rounded bg-white/10 overflow-hidden">
        <div className="h-full w-[42%] bg-gradient-to-r from-blue-500 to-emerald-400" />
      </div>
    </div>
  )
}
