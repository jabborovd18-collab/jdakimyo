// app/profil/sovgalar/page.js
"use client"

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'

function qolganVaqt(ms) {
  if (ms <= 0) return 'tugadi'
  const soat = Math.floor(ms / 3600000)
  const daqiqa = Math.floor((ms % 3600000) / 60000)
  if (soat > 0) return `${soat} soat ${daqiqa} daqiqa`
  return `${daqiqa} daqiqa`
}

export default function SovgalarPage() {
  const [malumot, setMalumot] = useState(null)
  const [band, setBand] = useState(null)
  const [qidiruv, setQidiruv] = useState('')

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/sovga')
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setMalumot(d)
    } catch (e) {
      toast.error(e.message || 'Yuklashda xatolik')
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const yubor = async (dostId) => {
    setBand(dostId)
    try {
      const res = await fetch('/api/sovga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qabulQiluvchiId: dostId }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message || 'Sovg\'a yuborildi!')
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  const qabulQil = async (id) => {
    setBand(id)
    try {
      const res = await fetch('/api/sovga', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message || 'Sovg\'a qabul qilindi!')
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  if (!malumot) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Sovg{"'"}alar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  const dostlar = (malumot.dostlar || []).filter((d) => {
    if (!qidiruv) return true
    const q = qidiruv.toLowerCase()
    return (
      (d.fullName && d.fullName.toLowerCase().includes(q)) ||
      (d.username && d.username.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Tanga va hadyalar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="orin" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Kunlik Sovg{"'"}alar</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Do{"'"}stlaringizga har kuni bepul 5 ta tanga yuboring va ulardan tangalar qabul qiling.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[var(--v3-xira)]">
          <span>Kuyishiga:</span>
          <strong className="text-[var(--v3-urgu)]">{qolganVaqt(malumot.qolganMs)}</strong>
        </div>
      </div>

      {/* ─── KELGAN SOVG'ALAR ─── */}
      {malumot.kelganlar && malumot.kelganlar.length > 0 && (
        <section className="space-y-3">
          <div className="v3-nishon">Sizga kelgan sovg{"'"}alar ({malumot.kelganlar.length})</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {malumot.kelganlar.map((s) => (
              <div
                key={s.id}
                className="v3-panel-karta p-4 flex items-center justify-between gap-3 border-[var(--v3-urgu)]/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                    {s.yuboruvchi.avatar ? (
                      <img src={s.yuboruvchi.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (s.yuboruvchi.fullName?.[0] || s.yuboruvchi.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                      <span>{s.yuboruvchi.fullName || s.yuboruvchi.username}</span>
                      <TasdiqBelgisi tasdiqlangan={s.yuboruvchi.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-[10.5px] text-[var(--v3-urgu)] font-mono">+5 🪙 sovg{"'"}a yubordi</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => qabulQil(s.id)}
                  disabled={band === s.id}
                  className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold shrink-0"
                >
                  {band === s.id ? '...' : 'Qabul qilish'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── DO'STLARGA YUBORISH ─── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="v3-nishon">Do{"'"}stlarga sovg{"'"}a yuborish</div>

          <input
            type="text"
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Do'stni qidirish..."
            className="v3-kiritish text-xs py-1.5 max-w-xs"
          />
        </div>

        {dostlar.length === 0 ? (
          <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)] space-y-2">
            <p>Do{"'"}stlar topilmadi.</p>
            <Link href="/profil/dostlar" className="text-[var(--v3-urgu)] hover:underline font-bold">
              Do{"'"}stlar qidirish bo{"'"}limiga o{"'"}tish →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dostlar.map((d) => (
              <div
                key={d.id}
                className="v3-panel-karta p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                    {d.avatar ? (
                      <img src={d.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (d.fullName?.[0] || d.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                      <span>{d.fullName || d.username}</span>
                      <TasdiqBelgisi tasdiqlangan={d.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-[10.5px] text-[var(--v3-xira)] font-mono truncate">@{d.username}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => yubor(d.id)}
                  disabled={band === d.id || malumot.bugunYuborilgan}
                  className={`v3-tugma text-xs py-1.5 px-3 shrink-0 ${
                    malumot.bugunYuborilgan ? 'opacity-40 cursor-not-allowed' : 'v3-tugma-asosiy font-bold'
                  }`}
                >
                  {band === d.id ? '...' : malumot.bugunYuborilgan ? 'Yuborilgan' : 'Sovg\'a'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
