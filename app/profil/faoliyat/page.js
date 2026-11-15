import Link from 'next/link'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import Ikon from '@/components/Ikon'

export default function FaoliyatPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Kunlik monitoring</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="vaqt" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Faollik Grafigi</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            O{"'"}qish, testlar, video darslar va kunlik missiyalardagi faoliyatingiz hisoboti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href="/profil" className="v3-tugma text-xs py-1.5 px-3">
            <Ikon nom="chap" olcham={13} />
            <span>Kabinet</span>
          </Link>
          <Link href="/testlar" className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold">
            <Ikon nom="quiz" olcham={13} />
            <span>Test yechish</span>
          </Link>
        </div>
      </div>

      <ActivityHeatmap />
    </div>
  )
}
