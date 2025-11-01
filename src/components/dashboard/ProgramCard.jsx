// src/components/dashboard/ProgramCard.jsx
export default function ProgramCard() {
  return (
    <div className="rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br from-[#8c56ff] to-[#6f4bff]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">Base</div>
        <div className="text-lg font-semibold">
          10,642.5 USDT <span className="text-white/70 text-base">~$24,265</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-7 w-7 rounded-md bg-white/25 border border-white/30 grid place-items-center text-[10px]"
          >
            ⚡
          </span>
        ))}
      </div>
    </div>
  );
}
