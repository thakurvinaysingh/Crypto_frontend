// src/pages/dashboard/DashMain.jsx
import StatCard from '../../../components/dashboard/StatCard'
import SectionTitle from '../../../components/dashboard/SectionTitle'
import Pill from '../../../components/dashboard/Pill'
import ProgressStrip from '../../../components/dashboard/ProgressStrip'
import ProgramCard from '../../../components/dashboard/ProgramCard'
import PassiveIncomeTable from '../../../components/dashboard/PassiveIncomeTable'
import EarnCard from '../../../components/dashboard/EarnCard'

// Inline USDT icon (keeps UI spacing identical to TonIcon usage)
function UsdtIcon(props) {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-[1.1em] w-[1.1em] align-middle"
      aria-hidden="true"
      {...props}
    >
      {/* Circle */}
      <circle cx="128" cy="128" r="128" fill="#26A17B" />
      {/* Tether "T" mark */}
      <path
        fill="#FFF"
        d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
      />
    </svg>
  );
}

export default function DashMain() {
  return (
    <div className="space-y-7 md:space-y-8">
      {/* Progress strip */}
      <ProgressStrip />

      {/* KPI rows */}
      <div className="grid gap-4 md:grid-cols-[1.6fr_.9fr]">
        <StatCard
          title="Profit"
          value={(
            <div className="flex items-center gap-3">
              <span className="text-gold-400"><UsdtIcon /></span>
              <span>11,087</span>
            </div>
          )}
          sub="$25,278"
          rightNote="+4.64 USDT"
          gradient="from-gold-500/25 to-gold-800/30"
        />
        <StatCard
          title="Partners"
          value="1712"
          gradient="from-gold-400 to-gold-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total team"
          value="60858"
          rightNote="+153"
          gradient="from-gold-500/25 to-gold-800/30"
        />
        <div className="rounded-2xl p-5 text-white border border-dashed border-white/20 bg-black/20">
          <div className="text-sm/5 text-white/70">Passive income</div>
          <div className="mt-3 flex items-end gap-3">
            <div className="flex items-center gap-2 text-3xl font-semibold tabular-nums">
              <span className="text-gold-400"><UsdtIcon /></span>
              <span>432.357</span>
            </div>
            <div className="text-gold-200">~$986</div>
          </div>
        </div>
      </div>

      {/* Programs */}
      <SectionTitle>Programs</SectionTitle>
      <ProgramCard />

      {/* Passive income header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <SectionTitle>Passive income</SectionTitle>
        <div className="text-lg font-semibold">
          432.357 USDT <span className="text-gold-200 text-base">~$986</span>
        </div>
      </div>

      {/* Passive income table (dotted glass) */}
      <PassiveIncomeTable />

      {/* Earn panel */}
      <EarnCard />
    </div>
  )
}


