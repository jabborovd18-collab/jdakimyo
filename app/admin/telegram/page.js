// app/admin/telegram/page.js
//
// Telegram botni sozlash va holatini ko'rish.
//
// NEGA SAHIFA KERAK. Webhook'ni ishlab chiqish kompyuteridan
// o'rnatish sir kalitni ikki joyda qo'lda bir xil ushlab turishni
// talab qilardi va aynan shu joyda xato bo'ldi. Bu yerdan bosilgan
// tugma esa kalitni SERVERNING o'zidan oladi — mos kelmasligi
// mumkin emas.
//
// Sahifa "bot nega jim" degan savolga ham javob beradi: Telegram
// oxirgi xatosini ko'rsatadi. Usiz xato hech qayerda ko'rinmasdi.
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminTelegramPage() {
  const [holat, setHolat] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [band, setBand] = useState(false)

  useEffect(() => { olish() }, [])

  async function olish() {
    setYuklanmoqda(true)
    try {
      const res = await fetch('/api/admin/telegram')
      const data = await res.json()
      if (res.ok) setHolat(data)
      else toast.error(data.error || 'Olinmadi')
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  async function sozlash() {
    setBand(true)
    try {
      const res = await fetch('/api/admin/telegram', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Sozlanmadi')

      const yiqilgan = (data.qadamlar || []).filter((q) => !q.ok)
      if (yiqilgan.length === 0) toast.success('Bot sozlandi')
      else toast.error(`Yiqildi: ${yiqilgan.map((q) => q.nom).join(', ')}`)

      await olish()
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setBand(false)
    }
  }

  if (yuklanmoqda) {
    return <div className="p-8 text-purple-300">Yuklanmoqda...</div>
  }

  const w = holat?.webhook
  const h = holat?.holat

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Telegram bot</h1>
      <p className="text-sm text-purple-300 mb-6">
        Webhook, menyu tugmasi va buyruqlar ro'yxatini o'rnatadi.
      </p>

      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Muhit</h2>
        <Qator nom="Bot tokeni" holat={h?.tokenBor} />
        <Qator nom="Sir kalit" holat={h?.sirBor} />
        <Qator nom="Bot nomi" matn={h?.botNomi ? `@${h.botNomi}` : 'qo\'yilmagan'} holat={Boolean(h?.botNomi)} />
      </div>

      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Webhook</h2>
        {!w ? (
          <div className="text-sm text-purple-400">Token yo'q — holat olinmadi.</div>
        ) : w.xato ? (
          <div className="text-sm text-red-300">Telegram javob bermadi: {w.xato}</div>
        ) : (
          <>
            <Qator nom="Manzil" matn={w.manzil || 'o\'rnatilmagan'} holat={w.togriManzilmi} />
            <Qator nom="Navbatdagi xabar" matn={String(w.kutayotgan)} holat={w.kutayotgan === 0} />
            {w.oxirgiXato ? (
              <div className="mt-3 bg-red-950/40 border border-red-800/50 rounded-xl p-3">
                <div className="text-xs text-red-300 font-semibold mb-1">
                  Telegramning oxirgi xatosi
                </div>
                <div className="text-xs text-red-200 font-mono">{w.oxirgiXato}</div>
                {w.oxirgiXatoVaqti ? (
                  <div className="text-[11px] text-red-400 mt-1">{w.oxirgiXatoVaqti}</div>
                ) : null}
                <div className="text-[11px] text-red-300 mt-2">
                  «401 Unauthorized» — sir kalit mos kelmayapti. Pastdagi tugma
                  webhook'ni serverdagi kalit bilan qayta yozadi va shuni tuzatadi.
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-green-400">Xato yo'q</div>
            )}
          </>
        )}
      </div>

      <button
        onClick={sozlash}
        disabled={band || !h?.tokenBor || !h?.sirBor}
        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold disabled:opacity-40 transition-all"
      >
        {band ? 'Sozlanmoqda...' : 'Botni sozlash'}
      </button>

      {(!h?.tokenBor || !h?.sirBor) && (
        <p className="text-xs text-red-300 mt-3">
          Avval Vercel sozlamalariga TELEGRAM_BOT_TOKEN va TELEGRAM_WEBHOOK_SIR
          qo'shib, qayta deploy qiling.
        </p>
      )}
    </div>
  )
}

function Qator({ nom, matn, holat }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-purple-800/30 last:border-0">
      <span className="text-sm text-purple-300">{nom}</span>
      <span className={`text-sm font-mono ${holat ? 'text-green-400' : 'text-red-300'}`}>
        {matn ?? (holat ? 'bor' : 'yo\'q')}
      </span>
    </div>
  )
}
