// src/components/dashboard/ProgressStrip.jsx
export default function ProgressStrip({
  label = "Potential profit",
  value = 0,        // current profit
  target = 100,     // goal/potential to reach 100%
  unit = "USDT",
  showPercent = true,
  emoji = "🤖",     // keep your original circle emoji
}) {
  // Inline USDT icon
  const UsdtIcon = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      <circle cx="128" cy="128" r="128" fill="#26A17B" />
      <path
        fill="#FFF"
        d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
      />
    </svg>
  );

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const safeTarget = Number(target) > 0 ? Number(target) : 1;
  const pctRaw = (Number(value) / safeTarget) * 100;
  const pct = clamp(isFinite(pctRaw) ? pctRaw : 0, 0, 100);

  const fmt = (v) =>
    Number.isFinite(Number(v))
      ? Number(v).toLocaleString(undefined, { maximumFractionDigits: 6 })
      : "—";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-white/70 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 rounded-full bg-black/30 border border-white/10 items-center justify-center">
            {emoji}
          </span>
          <span>{label}</span>
          <span className="opacity-60">ⓘ</span>
        </div>

        <div className="font-medium inline-flex items-center gap-2">
          <UsdtIcon className="h-4 w-4" />
          <span>{fmt(value)} {unit}</span>
          {showPercent && (
            <span className="ml-2 text-xs text-white/60">({Math.round(pct)}%)</span>
          )}
        </div>
      </div>

      <div className="h-[3px] rounded bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-700 transition-all duration-700"
          style={{ width: `${pct}%` }}
          aria-label={`${Math.round(pct)}%`}
          title={`${Math.round(pct)}%`}
        />
      </div>
    </div>
  );
}

