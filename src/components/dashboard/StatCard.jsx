export default function StatCard({
  title,
  value,
  sub,
  rightNote,
  gradient = 'from-[#2b4c8f] to-[#1f3a6a]',
}) {
  return (
    <div
      className={`relative rounded-2xl p-5 text-white shadow-xl border border-white/10 bg-gradient-to-br ${gradient}`}
    >
      <div className="text-sm/5 text-white/80">{title}</div>
      <div className="mt-3 flex items-end gap-3">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        {sub && <div className="text-white/60">~{sub}</div>}
        {rightNote && (
          <div className="ml-auto text-emerald-400 font-medium">{rightNote}</div>
        )}
      </div>
    </div>
  )
}
