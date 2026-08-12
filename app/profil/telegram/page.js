// app/profil/telegram/page.js
import Link from 'next/link'
import TelegramUlash from '@/components/TelegramUlash'
import Ikon from '@/components/Ikon'

export const metadata = {
  title: 'Telegramni ulash — JDA KIMYO',
  description:
    'JDA KIMYO hisobingizni Telegram botga ulang va bildirishnomalarni telefoningizda oling.',
  robots: { index: false, follow: false },
}

export default async function TelegramSahifa({ searchParams }) {
  const sp = await searchParams
  const xom = String(sp?.kod || '').toUpperCase()
  const kod = /^[A-Z0-9]{4,8}$/.test(xom) ? xom : ''

  return (
    <div className="space-y-6 max-w-lg">
      <div className="pb-4 border-b border-[var(--v3-chiziq)]">
        <div className="v3-nishon">Bot va Integratsiya</div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
          <Ikon nom="telegram" olcham={22} className="text-[#24A1DE]" />
          <span>Telegramni Ulash</span>
        </h1>
        <p className="text-xs text-[var(--v3-xira)] mt-1">
          Bildirishnomalar telefoningizga kelib turadi — do{"'"}stlik so{"'"}rovi, ustoz taklifi, vazifa va sovg{"'"}alar.
        </p>
      </div>

      {kod ? (
        <div className="v3-panel-karta p-3.5 border-green-500/30 bg-green-500/10 text-xs text-green-400 font-semibold">
          Botdan kelgan kod kiritildi. <strong>Ulash</strong> tugmasini bosing.
        </div>
      ) : null}

      <div className="v3-panel-karta p-6">
        <TelegramUlash boshlangichKod={kod} mustaqil />
      </div>
    </div>
  )
}
