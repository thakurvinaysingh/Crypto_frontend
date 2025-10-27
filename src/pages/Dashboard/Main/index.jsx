import StatCard from '../../../components/dashboard/StatCard'
import SectionTitle from '../../../components/dashboard/SectionTitle'
import Pill from '../../../components/dashboard/Pill'
import ProgressStrip from '../../../components/dashboard/ProgressStrip'
import ProgramCard from '../../../components/dashboard/ProgramCard'
import PassiveIncomeTable from '../../../components/dashboard/PassiveIncomeTable'
import EarnCard from '../../../components/dashboard/EarnCard'
import TonIcon from '../../../components/icons/TonIcon'

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
             <span className="text-gold-400"><TonIcon/></span><span>11,087</span>
            </div>
          )}
          sub="$25,278"
          rightNote="+4.64 TON"
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
           <span className="text-gold-400"><TonIcon/></span><span>432.357</span>
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
           432.357 TON <span className="text-gold-200 text-base">~$986</span>
         </div>
      </div>

      {/* Passive income table (dotted glass) */}
      <PassiveIncomeTable />

      {/* Earn panel */}
      <EarnCard />
    </div>
  )
}
