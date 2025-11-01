// src/components/dashboard/PassiveIncomeTable.jsx
import DottedCard from './DottedCard'

// Inline USDT icon (keeps the same size/slot as TonIcon)
const UsdtIcon = ({ className = "h-4 w-4 opacity-90 text-gold-400" }) => (
  <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
    <circle cx="128" cy="128" r="128" fill="#26A17B" />
    <path
      fill="#FFF"
      d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
    />
  </svg>
);

const rows = [
  { ok: true,  label: 'Owner Top 10 Squad',        value: '~15'     },
  { ok: false, label: 'Top 100 Member',            value: '0'       },
  { ok: true,  label: '2–5 level Active',          value: ''        },
  { ok: true,  label: '6–12 level Unconditional',  value: '~0.721'  },
];

export default function PassiveIncomeTable() {
  return (
    <div className="glass p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/70 text-sm">Period</div>
        <div className="inline-flex items-center gap-3 rounded-xl bg-black/30 px-3 py-2 border border-gold-600/20 text-sm">
          <span className="text-white/80">10.10 – 20.10</span>
          <span className="inline-flex h-6 w-6 rounded-md bg-gold-700/25 items-center justify-center">📅</span>
        </div>
      </div>

      <DottedCard className="bg-gradient-to-br from-gold-700/15 to-gold-900/20">
        <div className="divide-y divide-white/10">
          {rows.map((r, idx) => (
            <div key={idx} className="flex items-center py-3 sm:py-3.5">
              <div className="w-6">
                {r.ok ? (
                  <span className="text-emerald-400 text-xl">✓</span>
                ) : (
                  <span className="text-red-400 text-xl">✕</span>
                )}
              </div>
              <div className="flex-1 text-white/90">{r.label}</div>
              <div className="min-w-[100px] text-right flex items-center justify-end gap-2">
                {r.value && (
                  <span className={r.value.includes('-') ? 'text-red-300' : 'text-gold-200'}>
                    {r.value}
                  </span>
                )}
                <UsdtIcon />
              </div>
            </div>
          ))}
        </div>
      </DottedCard>
    </div>
  );
}
