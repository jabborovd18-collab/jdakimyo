// app/profil/chat/page.js
"use client"
//
// Shaxsiy chat.
//
// Yangi xabar SO'ROV bilan olinadi (WebSocket emas): Vercel'da uzoq
// turadigan ulanish ochib bo'lmaydi. Suhbat ochiq turganda 4 soniyada
// bir marta so'raladi va faqat oyna ko'rinib turganda — fondagi yorliq
// serverni bekorga bezovta qilmasligi kerak.
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const SOROV_ORALIGI = 4000

export default function ChatSahifasi() {
  return (
    <Suspense fallback={<div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>}>
      <Chat />
    </Suspense>
  )
}

function Chat() {
  const qidiruv = useSearchParams()
  const [royxat, setRoyxat] = useState(null)
  const [tanlangan, setTanlangan] = useState(qidiruv.get('suhbat') || null)
  const [suhbat, setSuhbat] = useState(null)
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [bolim, setBolim] = useState('faol')
  const oxirgiRef = useRef(null)

  const royxatniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/chat')
      const data = await res.json()
      if (res.ok) setRoyxat(data)
    } catch {
      // jim — keyingi so'rovda qayta urinadi
    }
  }, [])

  const suhbatniYukla = useCallback(async (id) => {
    if (!id) return
    try {
      const res = await fetch(`/api/chat/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuhbat(data)
    } catch (e) {
      toast.error(e.message)
      setTanlangan(null)
    }
  }, [])

  useEffect(() => { royxatniYukla() }, [royxatniYukla])
  useEffect(() => { if (tanlangan) suhbatniYukla(tanlangan) }, [tanlangan, suhbatniYukla])

  // Yangi xabarlarni davriy so'rash
  useEffect(() => {
    const oraliq = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      royxatniYukla()
      if (tanlangan) suhbatniYukla(tanlangan)
    }, SOROV_ORALIGI)
    return () => clearInterval(oraliq)
  }, [tanlangan, royxatniYukla, suhbatniYukla])

  // Yangi xabar kelganda pastga tushamiz
  useEffect(() => {
    oxirgiRef.current?.scrollIntoView({ block: 'end' })
  }, [suhbat?.xabarlar?.length])

  const yubor = async () => {
    if (!matn.trim() || !tanlangan) return
    setYuborilmoqda(true)
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMatn('')
      setSuhbat((s) => (s ? { ...s, xabarlar: [...s.xabarlar, data.xabar] } : s))
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const sorovga = async (amal) => {
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      if (amal === 'rad') setTanlangan(null)
      else suhbatniYukla(tanlangan)
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const xabarniOchir = async (xabarId) => {
    if (!confirm('Xabar o\'chirilsinmi?')) return
    try {
      const res = await fetch(`/api/chat/${tanlangan}?xabarId=${xabarId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const blokla = async () => {
    const odam = suhbat?.suhbat?.odam
    if (!odam) return
    if (!confirm(`${odam.fullName || odam.username} bloklansinmi? U sizga yoza olmaydi va profilingizni ko'rmaydi.`)) return
    try {
      const res = await fetch('/api/chat/bloklash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: odam.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const blokniOch = async () => {
    const odam = suhbat?.suhbat?.odam
    try {
      const res = await fetch(`/api/chat/bloklash?userId=${odam.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const shikoyat = async () => {
    const sabab = prompt('Shikoyat sababi — administrator yozishmani ko\'rib chiqadi:')
    if (!sabab?.trim()) return
    try {
      const res = await fetch('/api/chat/shikoyat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suhbatId: tanlangan, sabab }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (!royxat) return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>

  const bolimlar = [
    { id: 'faol', nom: `💬 Suhbatlar (${royxat.faol.length})`, royxat: royxat.faol },
    { id: 'sorov', nom: `📨 So'rovlar (${royxat.sorovlar.length})`, royxat: royxat.sorovlar },
    { id: 'yuborilgan', nom: `📤 Yuborilgan (${royxat.yuborilgan.length})`, royxat: royxat.yuborilgan },
  ]
  const joriy = bolimlar.find((b) => b.id === bolim)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">💬 Xabarlar</h1>
        <p className="text-sm text-purple-300 mt-0.5">
          Do'stlaringiz to'g'ridan-to'g'ri yozadi. Do'st bo'lmaganlar xabari
          so'rov bo'lib tushadi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ro'yxat */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            {bolimlar.map((b) => (
              <button
                key={b.id}
                onClick={() => setBolim(b.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  bolim === b.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'bg-slate-900/60 border border-purple-800/50 text-purple-200'
                }`}
              >
                {b.nom}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50 max-h-[60vh] overflow-y-auto">
            {joriy.royxat.length === 0 ? (
              <div className="p-6 text-center text-sm text-purple-400">
                {bolim === 'faol' ? "Hali suhbat yo'q" : "Bo'sh"}
              </div>
            ) : (
              joriy.royxat.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTanlangan(s.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-purple-900/30 ${
                    tanlangan === s.id ? 'bg-purple-900/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white text-sm truncate flex items-center gap-1">
                      <span className="truncate">{s.odam.fullName || s.odam.username}</span>
                      <TasdiqBelgisi tasdiqlangan={s.odam.isVerified} olcham="kichik" />
                    </span>
                    {s.oqilmagan > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold">
                        {s.oqilmagan}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-purple-400 truncate mt-0.5">
                    {s.oxirgiXabar
                      ? (s.oxirgiXabar.meniki ? 'Siz: ' : '') +
                        (s.oxirgiXabar.ochirilgan ? 'xabar o\'chirildi' : s.oxirgiXabar.matn)
                      : 'Hali xabar yo\'q'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Suhbat */}
        <div className="lg:col-span-2">
          {!tanlangan || !suhbat ? (
            <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 p-10 text-center text-sm text-purple-400">
              Chapdan suhbat tanlang
            </div>
          ) : (
            <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 flex flex-col h-[60vh]">
              {/* Sarlavha */}
              <div className="px-4 py-3 border-b border-purple-800/50 flex items-center justify-between gap-3">
                <Link
                  href={`/profil/${suhbat.suhbat.odam.userId}`}
                  className="font-semibold text-white hover:text-yellow-400 truncate flex items-center gap-1.5"
                >
                  <span className="truncate">
                    {suhbat.suhbat.odam.fullName || suhbat.suhbat.odam.username}
                  </span>
                  <TasdiqBelgisi tasdiqlangan={suhbat.suhbat.odam.isVerified} olcham="orta" />
                </Link>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={shikoyat} className="px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-600/40 text-orange-300 text-[11px] font-semibold">
                    Shikoyat
                  </button>
                  {suhbat.blok.menBlokladim ? (
                    <button onClick={blokniOch} className="px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-600/40 text-green-300 text-[11px] font-semibold">
                      Blokni ochish
                    </button>
                  ) : (
                    <button onClick={blokla} className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-[11px] font-semibold">
                      Bloklash
                    </button>
                  )}
                </div>
              </div>

              {/* Xabarlar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {suhbat.xabarlar.length === 0 && (
                  <div className="text-center text-sm text-purple-500 py-8">
                    Birinchi xabarni yozing
                  </div>
                )}
                {suhbat.xabarlar.map((x) => (
                  <div key={x.id} className={`flex ${x.meniki ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        x.meniki
                          ? 'bg-gradient-to-br from-yellow-600/80 to-orange-600/80 text-black'
                          : 'bg-purple-900/60 text-purple-50'
                      }`}
                    >
                      {x.ochirilgan ? (
                        <span className="text-sm italic opacity-70">🚫 Xabar o'chirildi</span>
                      ) : (
                        <p className="text-sm whitespace-pre-line break-words">{x.matn}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] ${x.meniki ? 'text-black/60' : 'text-purple-400'}`}>
                          {qachon(x.createdAt)}
                        </span>
                        {x.meniki && !x.ochirilgan && (
                          <button
                            onClick={() => xabarniOchir(x.id)}
                            className="text-[10px] text-black/60 hover:text-black"
                          >
                            o'chirish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={oxirgiRef} />
              </div>

              {/* Yozish qatori */}
              <div className="p-3 border-t border-purple-800/50">
                {suhbat.blok.meniBlokladi ? (
                  <div className="text-center text-sm text-purple-400 py-2">
                    Bu suhbatda xabar yuborib bo'lmaydi
                  </div>
                ) : suhbat.blok.menBlokladim ? (
                  <div className="text-center text-sm text-red-300 py-2">
                    Siz bu foydalanuvchini bloklagansiz
                  </div>
                ) : suhbat.suhbat.holat === 'sorov' && !suhbat.suhbat.menBoshladim ? (
                  <div className="space-y-2">
                    <p className="text-[12px] text-purple-300 text-center">
                      Bu do'st bo'lmagan foydalanuvchining so'rovi. Javob yozsangiz
                      suhbat ochiladi.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => sorovga('qabul')} className="flex-1 py-2 rounded-xl bg-green-600 text-white font-bold text-sm">
                        Qabul qilish
                      </button>
                      <button onClick={() => sorovga('rad')} className="flex-1 py-2 rounded-xl bg-red-600/80 text-white font-bold text-sm">
                        Rad etish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={matn}
                      onChange={(e) => setMatn(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); yubor() } }}
                      placeholder={
                        suhbat.suhbat.holat === 'sorov'
                          ? 'So\'rov yuborilgan — javobni kuting'
                          : 'Xabar yozing...'
                      }
                      className="flex-1 px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={yubor}
                      disabled={yuborilmoqda || !matn.trim()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
                    >
                      {yuborilmoqda ? '...' : 'Yuborish'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
