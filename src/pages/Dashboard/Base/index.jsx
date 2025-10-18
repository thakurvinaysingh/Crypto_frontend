export default function Base(){
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Base</h2>
          <span className="rounded-xl bg-purple-600 px-4 py-2">Level 12</span>
        </div>
        <div className="grid grid-cols-5 gap-4 py-10">
          <div className="h-20 w-20 rounded-full border border-white/10 grid place-items-center">9</div>
          <div className="h-20 w-20 rounded-full border border-white/10 grid place-items-center">10</div>
          <div className="h-20 w-20 rounded-full border border-white/10 grid place-items-center">10</div>
          <div className="h-20 w-20 rounded-full border border-white/10 grid place-items-center opacity-30" />
          <div className="h-20 w-20 rounded-full border border-white/10 grid place-items-center opacity-30" />
        </div>
      </div>
    </div>
  )
}
