// app/admin/chat/page.js
"use client"
//
// Chat nazorati: shikoyatlar, ogohlantirishlar va yozish taqiqi.
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon, sanaVaqt } from '@/lib/sana'

const HOLATLAR = [
  { id: 'yangi', nom: 'Yangi' },
  { id: 'korildi', nom: "Ko'rilgan" },
  { id: 'chora', nom: 'Chora ko\'rilgan' },
  { id: 'rad', nom: 'Rad etilgan' },
  { id: 'all', nom: 'Hammasi' },
]

export default function AdminChatPage() {
  const [malumot, setMalumot] = useState(null)
  const [holat, setHolat] = useState('yangi')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')
  const [ochilgan, setOchilgan] = useState(null) // {shikoyat, xabarlar}

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat?holat=${holat}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMalumot(data)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [holat])

  useEffect(() => { yukla() }, [yukla])

  const amal = async (tana) => {
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tana),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setOchilgan(null)
      yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const yozishmaniOch = async (shikoyat) => {
    try {
      const res = await fetch(`/api/admin/chat?suhbat=${shikoyat.conversationId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOchilgan({ shikoyat, xabarlar: data.xabarlar })
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (yuklanmoqda) return <div className="text-[var(--v3-xira)] py-10 text-center">⏳ Yuklanmoqda...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">💬 Chat nazorati</h1>
        <p className="text-sm text-[var(--v3-xira)] mt-1 max-w-2xl">
          Shaxsiy yozishma faqat SHIKOYAT bo'lganda va shikoyat ochilganda
          ko'rinadi — sababsiz o'qish moderatsiya emas, kuzatuv bo'lardi.
        </p>
      </div>

      {xato && (
        <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-4 text-sm text-red-300">{xato}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Karta icon="📨" son={malumot?.sanoq?.yangi || 0} nom="Yangi shikoyat" />
        <Karta icon="⚠️" son={malumot?.ogohlantirilganlar?.length || 0} nom="Ogohlantirilgan" />
        <Karta icon="🚫" son={malumot?.taqiqlanganlar?.length || 0} nom="Yozishi taqiqlangan" />
        <Karta icon="📋" son={malumot?.sanoq?.chora || 0} nom="Chora ko'rilgan" />
      </div>

      {/* Shikoyatlar */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="text-sm font-bold text-[var(--v3-matn)]">Shikoyatlar</h2>
          <div className="flex gap-1.5 flex-wrap">
            {HOLATLAR.map((h) => (
              <button
                key={h.id}
                onClick={() => setHolat(h.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  holat === h.id
                    ? 'bg-yellow-500 text-black border-yellow-400'
                    : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                }`}
              >
                {h.nom}
              </button>
            ))}
          </div>
        </div>

        {(malumot?.shikoyatlar || []).length === 0 ? (
          <div className="v3-panel-karta p-6 text-center text-sm text-[var(--v3-xira)]">
            Bu bo'limda shikoyat yo'q
          </div>
        ) : (
          <div className="space-y-3">
            {malumot.shikoyatlar.map((s) => (
              <div key={s.id} className="v3-panel-karta p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm">
                      <Link href={`/profil/${s.reporter.userId}`} className="text-[var(--v3-matn)] hover:text-[var(--v3-urgu)]">
                        {s.reporter.fullName || s.reporter.username}
                      </Link>
                      <span className="text-[var(--v3-xira)]"> → </span>
                      <Link href={`/profil/${s.reported.userId}`} className="text-white font-semibold hover:text-yellow-400">
                        {s.reported.fullName || s.reported.username}
                      </Link>
                    </div>
                    <p className="text-[13px] text-[var(--v3-xira)] mt-1">{s.sabab}</p>
                    <div className="text-[11px] text-[var(--v3-xira)] mt-1">
                      {qachon(s.createdAt)} · holat: {s.holat}
                      {s.reported.chatWarnings > 0 && ` · ${s.reported.chatWarnings} ogohlantirish`}
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => yozishmaniOch(s)}
                      className="v3-tugma text-xs py-1.5 px-3"
                    >
                      Yozishmani ko'rish
                    </button>
                    {s.holat === 'yangi' && (
                      <>
                        <button
                          onClick={() => amal({ amal: 'shikoyatHolati', shikoyatId: s.id, sabab: 'rad' })}
                          className="v3-tugma text-xs py-1.5 px-3"
                        >
                          Asossiz
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ko'p shikoyat tushganlar */}
      {(malumot?.kopShikoyat || []).length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--v3-matn)] mb-2">Eng ko'p shikoyat tushgan hisoblar</h2>
          <div className="v3-panel-karta divide-y divide-[var(--v3-chiziq)]">
            {malumot.kopShikoyat.filter((k) => k.odam).map((k) => (
              <div key={k.odam.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/profil/${k.odam.userId}`} className="text-sm text-white hover:text-yellow-400">
                    {k.odam.fullName || k.odam.username}
                  </Link>
                  <div className="text-[11px] text-[var(--v3-xira)]">
                    {k.soni} ta shikoyat · {k.odam.chatWarnings} ogohlantirish
                  </div>
                </div>
                <ChoraTugmalari odam={k.odam} onAmal={amal} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Taqiqdagilar */}
      {(malumot?.taqiqlanganlar || []).length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--v3-matn)] mb-2">Yozishi taqiqlanganlar</h2>
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 divide-y divide-red-900/30">
            {malumot.taqiqlanganlar.map((u) => (
              <div key={u.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-white">{u.fullName || u.username}</div>
                  <div className="text-[11px] text-red-300">
                    {sanaVaqt(u.chatBlockedUntil)} gacha · {u.chatBlockedReason}
                  </div>
                </div>
                <button
                  onClick={() => amal({ amal: 'taqiqniOch', userId: u.id })}
                  className="px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-600/40 text-green-300 text-xs font-semibold flex-shrink-0"
                >
                  Taqiqni ochish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yozishma oynasi */}
      {ochilgan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] bg-[var(--v3-fon)] border border-[var(--v3-chiziq-2)] rounded-2xl flex flex-col shadow-2xl">
            <div className="px-5 py-3 border-b border-[var(--v3-chiziq)] flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {ochilgan.shikoyat.reported.username} yozishmasi
              </h3>
              <button onClick={() => setOchilgan(null)} className="text-[var(--v3-xira)] hover:text-[var(--v3-matn)]">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {ochilgan.xabarlar.map((x) => (
                <div
                  key={x.id}
                  className={`rounded-xl px-4 py-2.5 ${
                    x.senderId === ochilgan.shikoyat.reportedId
                      ? 'bg-red-950/40 border border-red-800/40'
                      : 'bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]'
                  }`}
                >
                  <div className="text-[11px] text-[var(--v3-xira)] mb-1">
                    {x.sender.fullName || x.sender.username} · {qachon(x.createdAt)}
                    {x.ochirilgan && ' · foydalanuvchi o\'chirgan'}
                  </div>
                  <p className="text-sm text-[var(--v3-matn)] whitespace-pre-line break-words">{x.matn}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--v3-chiziq)] space-y-2">
              <ChoraTugmalari odam={ochilgan.shikoyat.reported} onAmal={amal} keng />
              <button
                onClick={() =>
                  amal({ amal: 'shikoyatHolati', shikoyatId: ochilgan.shikoyat.id, sabab: 'korildi' })
                }
                className="v3-tugma w-full justify-center text-sm"
              >
                Ko'rildi deb belgilash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChoraTugmalari({ odam, onAmal, keng }) {
  const [oynaTur, setOynaTur] = useState(null) // 'ogohlantir' | 'taqiq' | null
  const [sabab, setSabab] = useState('')
  const [kunlar, setKunlar] = useState('7')

  const och = (tur) => {
    setOynaTur(tur)
    setSabab('')
    setKunlar('7')
  }

  const tasdiqla = (e) => {
    e.preventDefault()
    if (!sabab.trim()) return
    if (oynaTur === 'ogohlantir') {
      onAmal({ amal: 'ogohlantir', userId: odam.id, sabab: sabab.trim() })
    } else if (oynaTur === 'taqiq') {
      const n = Math.max(1, Number(kunlar) || 0)
      if (!n) return
      onAmal({ amal: 'taqiq', userId: odam.id, kunlar: n, sabab: sabab.trim() })
    }
    setOynaTur(null)
  }

  return (
    <>
      <div className={`flex gap-1.5 ${keng ? 'w-full' : ''}`}>
        <button
          type="button"
          onClick={() => och('ogohlantir')}
          className={`px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-semibold transition-colors ${keng ? 'flex-1 py-2' : ''}`}
        >
          Ogohlantirish
        </button>
        <button
          type="button"
          onClick={() => och('taqiq')}
          className={`px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 text-xs font-semibold transition-colors ${keng ? 'flex-1 py-2' : ''}`}
        >
          Yozishni taqiqlash
        </button>
      </div>

      {oynaTur && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setOynaTur(null)}
        >
          <form
            onSubmit={tasdiqla}
            onClick={(e) => e.stopPropagation()}
            className="v3-panel-karta w-full max-w-md p-5 space-y-4 border-[var(--v3-chiziq-2)]"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--v3-chiziq)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--v3-matn)]">
                  {oynaTur === 'ogohlantir' ? 'Foydalanuvchini ogohlantirish' : 'Chatda yozishni taqiqlash'}
                </h3>
                <p className="text-xs text-[var(--v3-xira)]">
                  {odam.fullName || odam.username} (@{odam.username})
                </p>
              </div>
              <button type="button" onClick={() => setOynaTur(null)} className="v3-tugma px-2.5 py-1 text-xs">
                Yopish
              </button>
            </div>

            {oynaTur === 'taqiq' && (
              <div>
                <label className="block text-xs font-semibold text-[var(--v3-xira)] mb-1">
                  Taqiq muddati (kun)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={kunlar}
                  onChange={(e) => setKunlar(e.target.value)}
                  className="v3-kiritish w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--v3-xira)] mb-1">
                Sabab (foydalanuvchiga ko&apos;rinadi) *
              </label>
              <textarea
                rows={3}
                required
                value={sabab}
                onChange={(e) => setSabab(e.target.value)}
                placeholder="Sababni kiriting..."
                className="v3-kiritish w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--v3-chiziq)]">
              <button type="button" onClick={() => setOynaTur(null)} className="v3-tugma text-xs">
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={!sabab.trim() || (oynaTur === 'taqiq' && !(Number(kunlar) >= 1))}
                className="v3-tugma v3-tugma-asosiy text-xs disabled:opacity-40"
              >
                {oynaTur === 'ogohlantir' ? 'Ogohlantirish yuborish' : 'Taqiqlash'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

function Karta({ icon, son, nom }) {
  return (
    <div className="v3-panel-karta p-4">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-[var(--v3-urgu)]">{son}</div>
      <div className="text-[11px] text-[var(--v3-xira)]">{nom}</div>
    </div>
  )
}
