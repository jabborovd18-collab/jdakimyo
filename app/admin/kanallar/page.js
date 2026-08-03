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

  if (yuklanmoqda) return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">📢 Kanallar</h1>
          <p className="text-sm text-purple-300 mt-1 max-w-2xl">
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
        <div className="text-center py-14 bg-slate-900/40 border border-purple-800/50 rounded-2xl">
          <div className="text-5xl mb-3">📢</div>
          <h2 className="text-lg font-bold mb-1">Hali kanal yo'q</h2>
          <p className="text-sm text-purple-300">
            Birinchi kanalni oching va egasini tayinlang.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {malumot.kanallar.map((k) => (
            <div key={k.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-5">
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
                  <div className="text-[11px] text-purple-400 mt-1">
                    Egasi: {k.ega.fullName || k.ega.username} (@{k.ega.username}, {k.ega.role}) ·{' '}
                    /kanallar/{k.slug} · {sana(k.createdAt)}
                  </div>
                  <div className="text-[11px] text-purple-300 mt-1.5">
                    👥 {k.obunachilar} obunachi · 📝 {k.postSoni} post · 🎬 {k.videoSoni} video
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <Link
                    href={`/kanallar/${k.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-purple-800/60 border border-purple-600/50 text-xs font-semibold"
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
    <div className="rounded-2xl border border-purple-700/50 bg-slate-900/60 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Yangi kanal</h3>
        <button onClick={onYopish} className="text-purple-400 hover:text-white">✕</button>
      </div>

      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Kanal nomi"
        className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
      />

      <textarea
        value={tavsif}
        onChange={(e) => setTavsif(e.target.value)}
        rows={2}
        placeholder="Tavsif (ixtiyoriy — keyin hamkor o'zi to'ldiradi)"
        className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 resize-y"
      />

      <div className="flex gap-2 flex-wrap">
        {turlar.map((t) => (
          <button
            key={t.id}
            onClick={() => setTuri(t.id)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
              turi === t.id
                ? 'bg-yellow-500 text-black border-yellow-400'
                : 'bg-purple-950/40 border-purple-800/50 text-purple-200'
            }`}
          >
            {t.icon} {t.nom}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm text-purple-300 font-semibold block mb-1">Kanal egasi</label>
        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="🔍 Ism, username yoki ID bo'yicha qidiring"
          className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 mb-2"
        />
        <div className="max-h-52 overflow-y-auto rounded-xl border border-purple-800/50 divide-y divide-purple-900/50">
          {royxat.slice(0, 40).map((n) => (
            <button
              key={n.id}
              onClick={() => setEgaId(n.id)}
              className={`w-full text-left px-4 py-2.5 text-sm ${
                egaId === n.id ? 'bg-yellow-500/20 text-yellow-200' : 'hover:bg-purple-900/40 text-purple-100'
              }`}
            >
              {n.fullName || n.username}
              <span className="text-[11px] text-purple-400"> · @{n.username} · {n.role}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-purple-500 mt-1.5">
          Kanal ochilganda egasiga avtomatik "hamkor" unvoni beriladi va
          bildirishnoma yuboriladi.
        </p>
      </div>

      <button
        onClick={() => onYuborish({ nom, tavsif, turi, egaId })}
        disabled={ishlamoqda || !nom.trim() || !egaId}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
      >
        {ishlamoqda ? '⏳ Ochilmoqda...' : 'Kanalni ochish'}
      </button>
    </div>
  )
}
