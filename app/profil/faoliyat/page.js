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
            O{"'"}qish, testlar, laboratoriya tajribalari va darslardagi kunlik faollik hisoboti.
          </p>
        </div>
      </div>

      <ActivityHeatmap />
    </div>
  )
}
