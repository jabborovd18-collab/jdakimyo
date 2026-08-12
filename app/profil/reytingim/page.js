import StarsDisplay from '@/components/StarsDisplay'
import Ikon from '@/components/Ikon'

export default function ReytingimPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Haftalik peshqadamlar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="yulduz" olcham={22} className="text-yellow-400" />
            <span>Mening Reytingim</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Yulduzlar va to{"'"}plangan tajriba bo{"'"}yicha barcha o{"'"}quvchilar orasidagi o{"'"}rningiz.
          </p>
        </div>
      </div>

      <StarsDisplay />
    </div>
  )
}
