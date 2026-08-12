// components/EmailTasdiqlash.jsx
"use client"

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from './Ikon'

export default function EmailTasdiqlash() {
  const [holat, setHolat] = useState(null)
  const [kod, setKod] = useState('')
  const [band, setBand] = useState(false)
  const [kutish, setKutish] = useState(0)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/tasdiqlash')
      const d = await res.json()
      if (res.ok) setHolat(d)
    } catch {
      // Ignored
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

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
      toast.success(d.message || 'Email tasdiqlandi!', { duration: 4000 })
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
      toast.success(d.message || 'Yangi kod yuborildi')
      setKutish(60)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(false)
    }
  }

  return (
    <section className="v3-panel-karta p-5 space-y-4 border-l-4 border-l-[var(--v3-urgu)] bg-[var(--v3-yuza-2)]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
          <Ikon nom="pochta" olcham={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="v3-nishon text-[var(--v3-urgu)]">Xavfsizlik va Tasdiq</div>
          <h2 className="font-bold text-sm text-[var(--v3-matn)]">Elektron pochtangizni tasdiqlang</h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            {holat.email ? <><strong className="text-[var(--v3-matn)]">{holat.email}</strong> ga 6 xonali tasdiqlash kodi yuborildi.</> : 'Pochtaga 6 xonali kod yuborildi.'}
            Tasdiqlamaguningizcha tanga topish, sovg{"'"}alar va laboratoriya xaridlari yopiq turadi.
          </p>
        </div>
      </div>

      <form onSubmit={tekshir} className="flex flex-wrap items-center gap-2 pt-1">
        <input
          value={kod}
          onChange={(e) => setKod(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="w-32 v3-kiritish py-2 text-base tracking-[0.3em] text-center font-mono font-bold"
        />
        <button
          type="submit"
          disabled={band || kod.length !== 6}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold disabled:opacity-50"
        >
          {band ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
        </button>
        <button
          type="button"
          onClick={qaytaYubor}
          disabled={band || kutish > 0}
          className="v3-tugma text-xs py-2 px-3 disabled:opacity-50"
        >
          {kutish > 0 ? `Qayta yuborish (${kutish}s)` : 'Qayta yuborish'}
        </button>
      </form>
    </section>
  )
}
