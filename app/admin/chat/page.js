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

  if (yuklanmoqda) return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">💬 Chat nazorati</h1>
        <p className="text-sm text-purple-300 mt-1 max-w-2xl">
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
          <h2 className="text-sm font-bold text-purple-300">Shikoyatlar</h2>
          <div className="flex gap-1.5 flex-wrap">
            {HOLATLAR.map((h) => (
              <button
                key={h.id}
                onClick={() => setHolat(h.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  holat === h.id
                    ? 'bg-yellow-500 text-black border-yellow-400'
                    : 'bg-slate-900/60 border-purple-800/50 text-purple-200'
                }`}
              >
                {h.nom}
              </button>
            ))}
          </div>
        </div>

        {(malumot?.shikoyatlar || []).length === 0 ? (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 p-6 text-center text-sm text-purple-400">
            Bu bo'limda shikoyat yo'q
          </div>
        ) : (
          <div className="space-y-3">
            {malumot.shikoyatlar.map((s) => (
              <div key={s.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm">
                      <Link href={`/profil/${s.reporter.userId}`} className="text-purple-200 hover:text-yellow-400">
                        {s.reporter.fullName || s.reporter.username}
                      </Link>
                      <span className="text-purple-500"> → </span>
                      <Link href={`/profil/${s.reported.userId}`} className="text-white font-semibold hover:text-yellow-400">
                        {s.reported.fullName || s.reported.username}
                      </Link>
                    </div>
                    <p className="text-[13px] text-purple-300 mt-1">{s.sabab}</p>
                    <div className="text-[11px] text-purple-500 mt-1">
                      {qachon(s.createdAt)} · holat: {s.holat}
                      {s.reported.chatWarnings > 0 && ` · ${s.reported.chatWarnings} ogohlantirish`}
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => yozishmaniOch(s)}
                      className="px-3 py-1.5 rounded-lg bg-purple-800/60 border border-purple-600/50 text-xs font-semibold"
                    >
                      Yozishmani ko'rish
                    </button>
                    {s.holat === 'yangi' && (
                      <>
                        <button
                          onClick={() => amal({ amal: 'shikoyatHolati', shikoyatId: s.id, sabab: 'rad' })}
                          className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-semibold"
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
          <h2 className="text-sm font-bold text-purple-300 mb-2">Eng ko'p shikoyat tushgan hisoblar</h2>
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50">
            {malumot.kopShikoyat.filter((k) => k.odam).map((k) => (
              <div key={k.odam.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/profil/${k.odam.userId}`} className="text-sm text-white hover:text-yellow-400">
                    {k.odam.fullName || k.odam.username}
                  </Link>
                  <div className="text-[11px] text-purple-400">
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
          <h2 className="text-sm font-bold text-purple-300 mb-2">Yozishi taqiqlanganlar</h2>
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
          <div className="w-full max-w-2xl max-h-[85vh] bg-gradient-to-br from-purple-950 to-slate-950 border border-purple-700/50 rounded-2xl flex flex-col">
            <div className="px-5 py-3 border-b border-purple-800/50 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {ochilgan.shikoyat.reported.username} yozishmasi
              </h3>
              <button onClick={() => setOchilgan(null)} className="text-purple-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {ochilgan.xabarlar.map((x) => (
                <div
                  key={x.id}
                  className={`rounded-xl px-4 py-2.5 ${
                    x.senderId === ochilgan.shikoyat.reportedId
                      ? 'bg-red-950/40 border border-red-800/40'
                      : 'bg-purple-900/40 border border-purple-800/40'
                  }`}
                >
                  <div className="text-[11px] text-purple-400 mb-1">
                    {x.sender.fullName || x.sender.username} · {qachon(x.createdAt)}
                    {x.ochirilgan && ' · foydalanuvchi o\'chirgan'}
                  </div>
                  <p className="text-sm text-purple-50 whitespace-pre-line break-words">{x.matn}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-purple-800/50 space-y-2">
              <ChoraTugmalari odam={ochilgan.shikoyat.reported} onAmal={amal} keng />
              <button
                onClick={() =>
                  amal({ amal: 'shikoyatHolati', shikoyatId: ochilgan.shikoyat.id, sabab: 'korildi' })
                }
                className="w-full py-2 rounded-xl bg-slate-800 border border-purple-700/50 text-sm font-semibold"
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
  const ogohlantir = () => {
    const sabab = prompt('Ogohlantirish sababi (foydalanuvchiga ko\'rinadi):')
    if (!sabab?.trim()) return
    onAmal({ amal: 'ogohlantir', userId: odam.id, sabab })
  }

  const taqiqla = () => {
    const kunlar = Number(prompt('Necha kunga taqiqlansin?', '7'))
    if (!kunlar) return
    const sabab = prompt('Sabab (foydalanuvchiga ko\'rinadi):')
    if (!sabab?.trim()) return
    onAmal({ amal: 'taqiq', userId: odam.id, kunlar, sabab })
  }

  return (
    <div className={`flex gap-1.5 ${keng ? 'w-full' : ''}`}>
      <button
        onClick={ogohlantir}
        className={`px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-600/40 text-orange-300 text-xs font-semibold ${keng ? 'flex-1 py-2' : ''}`}
      >
        ⚠️ Ogohlantirish
      </button>
      <button
        onClick={taqiqla}
        className={`px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-xs font-semibold ${keng ? 'flex-1 py-2' : ''}`}
      >
        🚫 Yozishni taqiqlash
      </button>
    </div>
  )
}

function Karta({ icon, son, nom }) {
  return (
    <div className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-4">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-yellow-400">{son}</div>
      <div className="text-[11px] text-purple-300">{nom}</div>
    </div>
  )
}
