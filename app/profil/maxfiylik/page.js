import PrivacySettings from '@/components/PrivacySettings'
import Ikon from '@/components/Ikon'

export default function MaxfiylikPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Xavfsizlik va Himoya</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="qalqon" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Maxfiylik Sozlamalari</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Profilingizdagi ma{"'"}lumotlar, natijalar va faollik kimlarga ko{"'"}rinishini boshqaring.
          </p>
        </div>
      </div>

      <PrivacySettings />
    </div>
  )
}
