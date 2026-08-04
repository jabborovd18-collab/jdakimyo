// components/EmailTasdiqlash.jsx
//
// Email tasdiqlash bloki — kabinetda, tasdiqlanmagan hisobda ko'rinadi.
//
// Chetlab o'tib bo'ladigan qilib qo'yilgan: hisob ishlaydi, faqat tanga
// topish yopiq. Xat spam papkasiga tushsa yoki manzil xato bo'lsa,
// odam butunlay yo'qolmasligi kerak.
"use client"
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function EmailTasdiqlash() {
  const [holat, setHolat] = useState(null)
  const [kod, setKod] = useState('')
  const [band, setBand] = useState(false)
  // Qayta yuborish tugmasi necha soniyadan keyin ochilishi
  const [kutish, setKutish] = useState(0)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/tasdiqlash')
      const d = await res.json()
      if (res.ok) setHolat(d)
    } catch {
      // jim: blok ko'rsatilmasa ham qolgan sahifa ishlayveradi
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  // Qayta yuborish taymeri
  useEffect(() => {
    if (kutish <= 0) return
    const t = setTimeout(() => setKutish((k) => k - 1), 1000)
    return () => clearTimeout(t)
  }, [kutish])

  if (!holat || holat.tasdiqlangan) return null

  const tekshir = async (e) => {
    e.preventDefault()
    if (kod.length !== 6) {
      toast.error('Kod 6 xonali bo\'lishi kerak')
      return
    }
    setBand(true)
    try {
      const res = await fetch('/api/auth/tasdiqlash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message, { duration: 5000, icon: '✅' })
      setHolat({ ...holat, tasdiqlangan: true })
    } catch (e2) {
      toast.error(e2.message)
    } finally {
      setBand(false)
    }
  }

  const qaytaYubor = async () => {
    setBand(true)
    try {
      const res = await fetch('/api/auth/tasdiqlash', { method: 'PUT' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message)
      setKutish(60)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(false)
    }
  }

  return (
    <section className="bg-gradient-to-br from-orange-900/25 to-amber-900/15 border border-orange-600/40 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">📧</span>
        <div className="min-w-0">
          <h2 className="font-bold text-white">Emailingizni tasdiqlang</h2>
          <p className="text-sm text-orange-200/80 mt-0.5">
            {holat.email ? <><span className="font-mono">{holat.email}</span> ga 6 xonali kod yuborildi.</> : 'Emailingizga 6 xonali kod yuborildi.'}
          </p>
          {/* Nima cheklanayotganini ochiq aytamiz — odam nega
              tasdiqlashi kerakligini bilsin */}
          <p className="text-xs text-orange-300/70 mt-1.5">
            Tasdiqlamaguningizcha tanga topa olmaysiz: missiya mukofoti,
            sovg'a va laboratoriya xaridi yopiq.
          </p>
          {!holat.pochtaIshlaydi && (
            <p className="text-xs text-red-300 mt-1.5">
              ⚠️ Pochta xizmati hali sozlanmagan — administrator bilan bog'laning.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={tekshir} className="flex flex-wrap gap-2">
        <input
          value={kod}
          onChange={(e) => setKod(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="w-32 px-4 py-2.5 bg-slate-950/60 border border-orange-700/50 rounded-xl text-white text-lg tracking-[0.3em] text-center font-mono placeholder-orange-800 focus:border-orange-400 outline-none"
        />
        <button
          type="submit"
          disabled={band || kod.length !== 6}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl disabled:opacity-50"
        >
          Tasdiqlash
        </button>
        <button
          type="button"
          onClick={qaytaYubor}
          disabled={band || kutish > 0}
          className="px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/70 border border-slate-600/50 rounded-xl text-sm text-slate-200 disabled:opacity-50"
        >
          {kutish > 0 ? `Qayta yuborish (${kutish}s)` : 'Qayta yuborish'}
        </button>
      </form>
    </section>
  )
}
