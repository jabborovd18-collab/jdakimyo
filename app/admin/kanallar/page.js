// app/admin/kanallar/page.js
"use client"
//
// Kanallarni boshqarish — faqat superadminda ko'rinadi (lib/roles.js).
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'

export default function AdminKanallarPage() {
  const [malumot, setMalumot] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')
  const [ochish, setOchish] = useState(false)
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/kanallar')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMalumot(data)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const ozgart = async (id, ozgarish) => {
    try {
      const res = await fetch('/api/admin/kanallar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...ozgarish }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (yuklanmoqda) return <div className="text-[var(--v3-xira)] py-10 text-center">Yuklanmoqda...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">📢 Kanallar</h1>
          <p className="text-sm text-[var(--v3-xira)] mt-1 max-w-2xl">
            Kanalni faqat siz ochasiz va egasini tayinlaysiz — shu bilan
            unvon ham beriladi. Hamkor kanalni to'ldiradi, manzil va
            ochiqlik sizda qoladi.
          </p>
        </div>
        <button
          onClick={() => setOchish(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
        >
          ➕ Yangi kanal
        </button>
      </div>

      {xato && (
        <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-4 text-sm text-red-300">{xato}</div>
      )}

      {ochish && (
        <YangiKanal
          nomzodlar={malumot?.nomzodlar || []}
          turlar={malumot?.turlar || []}
          ishlamoqda={ishlamoqda}
          onYopish={() => setOchish(false)}
          onYuborish={async (tana) => {
            setIshlamoqda(true)
            try {
              const res = await fetch('/api/admin/kanallar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tana),
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data.error)
              toast.success(data.message)
              setOchish(false)
              yukla()
            } catch (e) {
              toast.error(e.message)
            } finally {
              setIshlamoqda(false)
            }
          }}
        />
      )}

      {(malumot?.kanallar || []).length === 0 ? (
        <div className="v3-panel-karta text-center py-14">
          <div className="text-5xl mb-3">📢</div>
          <h2 className="text-lg font-bold mb-1">Hali kanal yo'q</h2>
          <p className="text-sm text-[var(--v3-xira)]">
            Birinchi kanalni oching va egasini tayinlang.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {malumot.kanallar.map((k) => (
            <div key={k.id} className="v3-panel-karta p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{k.nom}</h3>
                    {k.tavsiyada && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-600/20 text-yellow-300 border border-yellow-600/40">
                        ⭐ tavsiyada
                      </span>
                    )}
                    {!k.ochiq && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/40 text-slate-300 border border-slate-600/40">
                        🔒 yopiq
                      </span>
                    )}
                    {!k.faol && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-600/40">
                        ⛔ to'xtatilgan
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)] mt-1">
                    Egasi: {k.ega.fullName || k.ega.username} (@{k.ega.username}, {k.ega.role}) ·{' '}
                    /kanallar/{k.slug} · {sana(k.createdAt)}
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)] mt-1.5">
                    👥 {k.obunachilar} obunachi · 📝 {k.postSoni} post · 🎬 {k.videoSoni} video
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <Link
                    href={`/kanallar/${k.slug}`}
                    className="v3-tugma text-xs px-3 py-1.5"
                  >
                    Ko'rish
                  </Link>
                  <button
                    onClick={() => ozgart(k.id, { tavsiyada: !k.tavsiyada })}
                    className="px-3 py-1.5 rounded-lg bg-yellow-600/20 border border-yellow-600/40 text-yellow-300 text-xs font-semibold"
                  >
                    {k.tavsiyada ? 'Tavsiyadan olish' : 'Tavsiyaga qo\'yish'}
                  </button>
                  <button
                    onClick={() => ozgart(k.id, { ochiq: !k.ochiq })}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600/50 text-xs font-semibold"
                  >
                    {k.ochiq ? 'Yopish' : 'Ochish'}
                  </button>
                  <button
                    onClick={() => ozgart(k.id, { faol: !k.faol })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      k.faol
                        ? 'bg-red-600/20 border-red-600/40 text-red-300'
                        : 'bg-green-600/20 border-green-600/40 text-green-300'
                    }`}
                  >
                    {k.faol ? "To'xtatish" : 'Qayta yoqish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function YangiKanal({ nomzodlar, turlar, ishlamoqda, onYopish, onYuborish }) {
  const [nom, setNom] = useState('')
  const [tavsif, setTavsif] = useState('')
  const [turi, setTuri] = useState('talim')
  const [egaId, setEgaId] = useState('')
  const [qidiruv, setQidiruv] = useState('')

  const royxat = nomzodlar.filter((n) => {
    const q = qidiruv.trim().toLowerCase()
    if (!q) return true
    return (
      n.username.toLowerCase().includes(q) ||
      (n.fullName || '').toLowerCase().includes(q) ||
      n.userId.includes(q)
    )
  })

  return (
    <div className="v3-panel-karta p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[var(--v3-matn)]">Yangi kanal</h3>
        <button type="button" onClick={onYopish} className="v3-tugma px-2 py-1 text-xs">
          Yopish
        </button>
      </div>

      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Kanal nomi"
        className="v3-kiritish w-full"
      />

      <textarea
        value={tavsif}
        onChange={(e) => setTavsif(e.target.value)}
        rows={2}
        placeholder="Tavsif (ixtiyoriy — keyin hamkor o'zi to'ldiradi)"
        className="v3-kiritish w-full resize-y"
      />

      <div className="flex gap-2 flex-wrap">
        {turlar.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTuri(t.id)}
            className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
              turi === t.id
                ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]'
                : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
            }`}
          >
            {t.nom}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm text-[var(--v3-xira)] font-semibold block mb-1">Kanal egasi</label>
        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Ism, username yoki ID bo'yicha qidiring"
          className="v3-kiritish w-full mb-2"
        />
        <div className="max-h-52 overflow-y-auto rounded-xl border border-[var(--v3-chiziq)] divide-y divide-[var(--v3-chiziq)]">
          {royxat.slice(0, 40).map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setEgaId(n.id)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                egaId === n.id
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'hover:bg-[var(--v3-yuza)] text-[var(--v3-matn)]'
              }`}
            >
              {n.fullName || n.username}
              <span className="text-[11px] text-[var(--v3-xira)]"> · @{n.username} · {n.role}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[var(--v3-xira)] mt-1.5">
          Kanal ochilganda egasiga avtomatik &quot;hamkor&quot; unvoni beriladi va
          bildirishnoma yuboriladi.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onYuborish({ nom, tavsif, turi, egaId })}
        disabled={ishlamoqda || !nom.trim() || !egaId}
        className="v3-tugma v3-tugma-asosiy w-full justify-center py-3 text-sm disabled:opacity-40"
      >
        {ishlamoqda ? 'Ochilmoqda...' : 'Kanalni ochish'}
      </button>
    </div>
  )
}
