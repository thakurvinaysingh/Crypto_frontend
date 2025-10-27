import TonIcon from '../icons/TonIcon'
import DottedCard from './DottedCard'

const rows = [
  { ok: true,  label: 'Owner Top 10 Squad',   value: '~15'  },
  { ok: false, label: 'Top 100 Member',       value: '0'    },
  { ok: true,  label: '2–5 level Active',     value: ''     },
  { ok: true,  label: '6–12 level Unconditional', value: '~0.721' },
]

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
                {r.ok ? <span className="text-emerald-400 text-xl">✓</span> : <span className="text-red-400 text-xl">✕</span>}
              </div>
              <div className="flex-1 text-white/90">{r.label}</div>
              <div className="min-w-[100px] text-right flex items-center justify-end gap-2">
                  {r.value && <span className={r.value.includes('-') ? 'text-red-300' : 'text-gold-200'}>{r.value}</span>}
                <TonIcon className="h-4 w-4 opacity-90 text-gold-400" />
              </div>
            </div>
          ))}
        </div>
      </DottedCard>
    </div>
  )
}
