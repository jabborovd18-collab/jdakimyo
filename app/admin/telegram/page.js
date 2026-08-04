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

      <Elon ishlaydi={Boolean(h?.tokenBor)} />
    </div>
  )
}

/**
 * E'lon yuborish.
 *
 * TASDIQLASH IKKI BOSQICHLI. Yuborilgan xabarni Telegramdan qaytarib
 * olib bo'lmaydi va u bir vaqtda butun auditoriyaga boradi —
 * tasodifan bosilgan tugmaning narxi juda yuqori.
 */
function Elon({ ishlaydi }) {
  const [sanoq, setSanoq] = useState(null)
  const [matn, setMatn] = useState('')
  const [rasm, setRasm] = useState(null)
  const [havolaUrl, setHavolaUrl] = useState('')
  const [havolaMatn, setHavolaMatn] = useState('')
  const [tasdiq, setTasdiq] = useState(false)
  const [band, setBand] = useState(false)
  const [natija, setNatija] = useState(null)

  useEffect(() => { if (ishlaydi) sanoqniOl() }, [ishlaydi])

  async function sanoqniOl() {
    try {
      const res = await fetch('/api/admin/telegram/elon')
      const d = await res.json()
      if (res.ok) setSanoq(d)
    } catch { /* bo'lim ishlashda davom etadi */ }
  }

  async function rasmYukla(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBand(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/telegram/rasm', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) return toast.error(d.error || 'Yuklanmadi')
      setRasm(d)
      toast.success('Rasm yuklandi')
    } catch (err) {
      toast.error('Xatolik: ' + err.message)
    } finally {
      setBand(false)
      e.target.value = ''
    }
  }

  async function yubor() {
    setBand(true)
    setNatija(null)
    try {
      const res = await fetch('/api/admin/telegram/elon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn, rasm: rasm?.url || '', havolaUrl, havolaMatn }),
      })
      const d = await res.json()
      if (!res.ok) return toast.error(d.error || 'Yuborilmadi')

      setNatija(d)
      setTasdiq(false)
      if (d.yetmadi === 0) toast.success(`${d.yetdi} ta odamga yetdi`)
      else toast.error(`${d.yetdi} yetdi, ${d.yetmadi} yetmadi`)

      setMatn('')
      setRasm(null)
      setHavolaUrl('')
      setHavolaMatn('')
      await sanoqniOl()
    } catch (err) {
      toast.error('Xatolik: ' + err.message)
    } finally {
      setBand(false)
    }
  }

  if (!ishlaydi) return null

  // Rasm bilan yuborilganda Telegram izohi to'rt baravar qisqa
  const chegara = rasm ? (sanoq?.chegara?.izoh ?? 1024) : (sanoq?.chegara?.matn ?? 4096)
  const oshdi = matn.length > chegara
  const bosholmaydi = band || oshdi || (!matn.trim() && !rasm) || !sanoq?.faol

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mt-6">
      <h2 className="text-sm font-bold text-yellow-300 mb-1">E'lon yuborish</h2>
      <p className="text-xs text-purple-400 mb-4">
        {sanoq
          ? `Botga ulangan: ${sanoq.jami} ta, xabar oladigan: ${sanoq.faol} ta`
          : 'Yuklanmoqda...'}
      </p>

      <textarea
        value={matn}
        onChange={(e) => setMatn(e.target.value)}
        rows={5}
        placeholder="E'lon matni..."
        className="w-full bg-purple-950/50 border border-purple-700/50 rounded-xl p-3 text-sm text-white placeholder-purple-500 focus:border-yellow-500/50 outline-none resize-y"
      />
      <div className={`text-[11px] mt-1 ${oshdi ? 'text-red-400' : 'text-purple-400'}`}>
        {matn.length} / {chegara}
        {rasm ? ' (rasm bilan chegara qisqaroq)' : ''}
      </div>

      <div className="mt-4">
        {rasm ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rasm.url} alt="" className="w-24 h-24 object-cover rounded-xl border border-purple-700/50" />
            <div className="text-xs text-purple-300">
              <div>{rasm.olcham} KB</div>
              <button
                onClick={() => setRasm(null)}
                className="text-red-300 underline mt-1 hover:text-red-200"
              >
                Olib tashlash
              </button>
            </div>
          </div>
        ) : (
          <label className="inline-block px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-600/50 text-sm text-purple-200 cursor-pointer hover:bg-purple-700/50 transition-all">
            🖼️ Rasm qo'shish
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={rasmYukla} className="hidden" />
          </label>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <input
          value={havolaUrl}
          onChange={(e) => setHavolaUrl(e.target.value)}
          placeholder="Tugma havolasi (ixtiyoriy)"
          className="bg-purple-950/50 border border-purple-700/50 rounded-xl p-2.5 text-sm text-white placeholder-purple-500 outline-none focus:border-yellow-500/50"
        />
        <input
          value={havolaMatn}
          onChange={(e) => setHavolaMatn(e.target.value)}
          placeholder="Tugma yozuvi (sukut: Saytda ochish)"
          className="bg-purple-950/50 border border-purple-700/50 rounded-xl p-2.5 text-sm text-white placeholder-purple-500 outline-none focus:border-yellow-500/50"
        />
      </div>

      {!tasdiq ? (
        <button
          onClick={() => setTasdiq(true)}
          disabled={bosholmaydi}
          className="mt-5 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 transition-all"
        >
          Yuborishga tayyorlash
        </button>
      ) : (
        <div className="mt-5 bg-yellow-950/30 border border-yellow-700/50 rounded-xl p-4">
          <div className="text-sm text-yellow-200 font-semibold mb-1">
            {sanoq?.faol} ta odamga yuboriladi
          </div>
          <div className="text-xs text-yellow-300/80 mb-3">
            Yuborilgan xabarni Telegramdan qaytarib olib bo'lmaydi.
          </div>
          <div className="flex gap-3">
            <button
              onClick={yubor}
              disabled={band}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-50 transition-all"
            >
              {band ? 'Yuborilmoqda...' : 'Ha, yuborilsin'}
            </button>
            <button
              onClick={() => setTasdiq(false)}
              disabled={band}
              className="px-5 py-2.5 rounded-lg bg-purple-800/50 border border-purple-600/50 text-purple-200 text-sm transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {natija && (
        <div className="mt-4 bg-purple-950/40 border border-purple-700/50 rounded-xl p-4 text-sm">
          <div className="text-green-400">Yetdi: {natija.yetdi} / {natija.jami}</div>
          {natija.yetmadi > 0 && (
            <div className="text-red-300 mt-1">Yetmadi: {natija.yetmadi}</div>
          )}
          {natija.tozalandi > 0 && (
            <div className="text-purple-300 mt-1">
              {natija.tozalandi} ta o'lik ulanish tozalandi (bot bloklangan)
            </div>
          )}
          {natija.xatolar?.length > 0 && (
            <div className="text-[11px] text-purple-400 mt-2 font-mono">
              {natija.xatolar.join(' · ')}
            </div>
          )}
        </div>
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
