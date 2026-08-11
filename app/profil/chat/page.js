// app/profil/chat/page.js
"use client"
//
// Shaxsiy chat.
//
// Yangi xabar SO'ROV bilan olinadi (WebSocket emas): Vercel'da uzoq
// turadigan ulanish ochib bo'lmaydi. Suhbat ochiq turganda 4 soniyada
// bir marta so'raladi va faqat oyna ko'rinib turganda — fondagi yorliq
// serverni bekorga bezovta qilmasligi kerak.
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { kunKaliti, kunSarlavhasi, sanaQisqa, soatDaqiqa } from '@/lib/sana'
import { MAX_UZUNLIK } from '@/lib/chat-chegara'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const SOROV_ORALIGI = 4000

/** Belgilar sanagichi shu chegaradan keyin ko'rinadi */
const SANAGICH_QOLGAN = 200

export default function ChatSahifasi() {
  return (
    <Suspense fallback={<div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>}>
      <Chat />
    </Suspense>
  )
}

/** Ro'yxatdagi vaqt: bugungi xabar — soat, eskisi — sana */
function royxatVaqti(qiymat) {
  if (!qiymat) return ''
  return kunKaliti(qiymat) === kunKaliti(new Date()) ? soatDaqiqa(qiymat) : sanaQisqa(qiymat)
}

// `span` (div emas): avatar tugma va havola ichida turadi, ular esa faqat
// matn darajasidagi elementlarni qabul qiladi.
function Avatar({ odam, olcham = 40 }) {
  const harf = (odam?.fullName || odam?.username || 'U')[0].toUpperCase()
  return (
    <span
      style={{ width: olcham, height: olcham }}
      className="flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 text-black font-bold inline-grid place-items-center"
    >
      {odam?.avatar ? (
        <img src={odam.avatar} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: olcham * 0.42 }}>{harf}</span>
      )}
    </span>
  )
}

function Chat() {
  const qidiruvParam = useSearchParams()
  const [royxat, setRoyxat] = useState(null)
  const [tanlangan, setTanlangan] = useState(qidiruvParam.get('suhbat') || null)
  const [suhbat, setSuhbat] = useState(null)
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [bolim, setBolim] = useState('faol')
  const [qidiruv, setQidiruv] = useState('')

  // Do'stlar paneli — "kimga yozaman?" degan savolning javobi shu yerda.
  // Avval suhbat boshlashning yagona yo'li odamning profiliga borib
  // "Yozish" tugmasini topish edi; do'stlar ro'yxati esa boshqa sahifada
  // turardi va chatdan unga ko'prik yo'q edi.
  const [dostPanel, setDostPanel] = useState(false)
  const [dostlar, setDostlar] = useState(null)
  const [dostQidiruv, setDostQidiruv] = useState('')

  const oxirgiRef = useRef(null)
  const oynaRef = useRef(null)
  const maydonRef = useRef(null)
  // Foydalanuvchi eski xabarlarni o'qiyotganda pastga sakrab tushmaslik
  // uchun: avtomatik siljish faqat u allaqachon pastda turganda bo'ladi.
  const pastdaRef = useRef(true)

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

  // Yangi xabar kelganda pastga tushamiz — lekin faqat pastda turgan bo'lsak
  useEffect(() => {
    if (pastdaRef.current) oxirgiRef.current?.scrollIntoView({ block: 'end' })
  }, [suhbat?.xabarlar?.length])

  // Suhbat almashganda har doim oxiriga tushamiz
  useEffect(() => {
    pastdaRef.current = true
    setMatn('')
  }, [tanlangan])

  const siljish = () => {
    const el = oynaRef.current
    if (!el) return
    // 80px — "deyarli pastda". Nol qilib qo'yilsa, bir piksel siljish ham
    // avtomatik tushishni o'chirib qo'yardi.
    pastdaRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const yubor = async () => {
    const toza = matn.trim()
    if (!toza || !tanlangan || yuborilmoqda) return
    setYuborilmoqda(true)
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn: toza }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMatn('')
      if (maydonRef.current) maydonRef.current.style.height = 'auto'
      pastdaRef.current = true
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

  // ─── Do'stlar paneli ───

  const dostlarniYukla = useCallback(async () => {
    try {
      // Do'stlar ro'yxatining YAGONA manbai — profil kolleksiyasi API'si.
      // Chat uchun alohida endpoint yozilsa, do'stlik shartlari ikki joyda
      // ta'riflanardi.
      const res = await fetch('/api/profil/collection?type=friends&limit=50')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDostlar(data.items || [])
    } catch (e) {
      toast.error(e.message || "Do'stlar yuklanmadi")
      setDostlar([])
    }
  }, [])

  const dostPanelniOch = () => {
    setDostPanel(true)
    setDostQidiruv('')
    if (dostlar === null) dostlarniYukla()
  }

  const dostBilanYoz = async (odam) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Manzilda ommaviy `userId` yuboriladi — ichki id emas
        body: JSON.stringify({ userId: odam.userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDostPanel(false)
      setBolim(data.holat === 'sorov' ? 'yuborilgan' : 'faol')
      setTanlangan(data.suhbatId)
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const dostRoyxati = useMemo(() => {
    if (!dostlar) return null
    const s = dostQidiruv.trim().toLowerCase()
    if (!s) return dostlar
    return dostlar.filter((d) =>
      [d.fullName, d.username, d.userId].some((x) => String(x || '').toLowerCase().includes(s)),
    )
  }, [dostlar, dostQidiruv])

  // ─── Ko'rinish ───

  const bolimlar = useMemo(() => {
    if (!royxat) return []
    return [
      { id: 'faol', nom: 'Suhbatlar', soni: royxat.faol.length, royxat: royxat.faol },
      { id: 'sorov', nom: "So'rovlar", soni: royxat.sorovlar.length, royxat: royxat.sorovlar },
      { id: 'yuborilgan', nom: 'Yuborilgan', soni: royxat.yuborilgan.length, royxat: royxat.yuborilgan },
    ]
  }, [royxat])

  const joriyRoyxat = useMemo(() => {
    const b = bolimlar.find((x) => x.id === bolim)
    if (!b) return []
    const s = qidiruv.trim().toLowerCase()
    if (!s) return b.royxat
    return b.royxat.filter((x) =>
      [x.odam.fullName, x.odam.username, x.odam.userId].some((v) =>
        String(v || '').toLowerCase().includes(s),
      ),
    )
  }, [bolimlar, bolim, qidiruv])

  if (!royxat) return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>

  const odam = suhbat?.suhbat?.odam
  const qolgan = MAX_UZUNLIK - matn.length

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
        {/* ─── Chap ustun: ro'yxat yoki do'stlar ───
            Mobilda suhbat ochilganda ro'yxat yashiriladi: ikkalasi ustma-ust
            turganda telefonda yozishma ekranning yarmiga ham sig'masdi. */}
        <div className={`lg:col-span-1 space-y-3 ${tanlangan ? 'hidden lg:block' : ''}`}>
          {dostPanel ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-white">Kimga yozasiz?</h2>
                <button
                  onClick={() => setDostPanel(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-purple-800/50 text-purple-200 text-[11px] font-semibold"
                >
                  Orqaga
                </button>
              </div>

              <input
                value={dostQidiruv}
                onChange={(e) => setDostQidiruv(e.target.value)}
                placeholder="Do'stlar ichidan qidirish..."
                className="w-full px-3.5 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 outline-none focus:border-yellow-500"
              />

              <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50 max-h-[55vh] overflow-y-auto">
                {dostRoyxati === null ? (
                  <div className="p-6 text-center text-sm text-purple-400">⏳ Yuklanmoqda...</div>
                ) : dostRoyxati.length === 0 ? (
                  <div className="p-6 text-center text-sm text-purple-400 space-y-2">
                    <p>{dostQidiruv ? 'Hech kim topilmadi' : "Hali do'stingiz yo'q"}</p>
                    {!dostQidiruv && (
                      <Link href="/profil/dostlar" className="inline-block text-yellow-400 font-semibold">
                        Do'st qidirish →
                      </Link>
                    )}
                  </div>
                ) : (
                  dostRoyxati.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => dostBilanYoz(d)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-900/30 flex items-center gap-3"
                    >
                      <Avatar odam={d} olcham={36} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-sm font-semibold text-white">
                          <span className="truncate">{d.fullName || d.username}</span>
                          <TasdiqBelgisi tasdiqlangan={d.isVerified} olcham="kichik" />
                        </span>
                        <span className="block text-[12px] text-purple-400 truncate">@{d.username}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={dostPanelniOch}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
              >
                ✍️ Yangi suhbat
              </button>

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
                    {b.nom} ({b.soni})
                  </button>
                ))}
              </div>

              {/* Qidiruv faqat suhbat ko'p bo'lganda ma'noga ega */}
              {royxat.faol.length + royxat.sorovlar.length + royxat.yuborilgan.length > 5 && (
                <input
                  value={qidiruv}
                  onChange={(e) => setQidiruv(e.target.value)}
                  placeholder="Suhbatlardan qidirish..."
                  className="w-full px-3.5 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 outline-none focus:border-yellow-500"
                />
              )}

              <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50 max-h-[60vh] overflow-y-auto">
                {joriyRoyxat.length === 0 ? (
                  <div className="p-6 text-center text-sm text-purple-400">
                    {qidiruv ? 'Topilmadi' : bolim === 'faol' ? "Hali suhbat yo'q" : "Bo'sh"}
                  </div>
                ) : (
                  joriyRoyxat.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTanlangan(s.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-purple-900/30 flex items-center gap-3 ${
                        tanlangan === s.id ? 'bg-purple-900/40' : ''
                      }`}
                    >
                      <Avatar odam={s.odam} olcham={40} />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white text-sm truncate flex items-center gap-1">
                            <span className="truncate">{s.odam.fullName || s.odam.username}</span>
                            <TasdiqBelgisi tasdiqlangan={s.odam.isVerified} olcham="kichik" />
                          </span>
                          <span className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] text-purple-500">{royxatVaqti(s.updatedAt)}</span>
                            {s.oqilmagan > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold">
                                {s.oqilmagan}
                              </span>
                            )}
                          </span>
                        </span>
                        <span className="block text-[12px] text-purple-400 truncate mt-0.5">
                          {s.oxirgiXabar
                            ? (s.oxirgiXabar.meniki ? 'Siz: ' : '') +
                              (s.oxirgiXabar.ochirilgan ? 'xabar o\'chirildi' : s.oxirgiXabar.matn)
                            : 'Hali xabar yo\'q'}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* ─── O'ng ustun: yozishma ─── */}
        <div className={`lg:col-span-2 ${tanlangan ? '' : 'hidden lg:block'}`}>
          {!tanlangan || !suhbat ? (
            <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 p-10 text-center text-sm text-purple-400 space-y-3">
              <p>Chapdan suhbat tanlang</p>
              <button
                onClick={dostPanelniOch}
                className="px-4 py-2 rounded-xl bg-purple-900/60 border border-purple-700/50 text-purple-100 text-xs font-semibold"
              >
                Yoki do'stingizga yozing
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 flex flex-col h-[70vh] lg:h-[60vh]">
              {/* Sarlavha */}
              <div className="px-3 sm:px-4 py-3 border-b border-purple-800/50 flex items-center gap-2">
                <button
                  onClick={() => setTanlangan(null)}
                  className="lg:hidden px-2 py-1.5 rounded-lg bg-purple-900/60 text-purple-200 text-sm flex-shrink-0"
                  aria-label="Ro'yxatga qaytish"
                >
                  ←
                </button>

                <Link
                  href={`/profil/${odam.userId}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 hover:text-yellow-400"
                >
                  <Avatar odam={odam} olcham={36} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <span className="truncate">{odam.fullName || odam.username}</span>
                      <TasdiqBelgisi tasdiqlangan={odam.isVerified} olcham="orta" />
                    </span>
                    <span className="block text-[11px] text-purple-400 truncate">@{odam.username}</span>
                  </span>
                </Link>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={shikoyat} className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-600/40 text-orange-300 text-[11px] font-semibold">
                    Shikoyat
                  </button>
                  {suhbat.blok.menBlokladim ? (
                    <button onClick={blokniOch} className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-600/40 text-green-300 text-[11px] font-semibold">
                      Blokni ochish
                    </button>
                  ) : (
                    <button onClick={blokla} className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-[11px] font-semibold">
                      Bloklash
                    </button>
                  )}
                </div>
              </div>

              {/* Xabarlar */}
              <div ref={oynaRef} onScroll={siljish} className="flex-1 overflow-y-auto p-4 space-y-2">
                {suhbat.xabarlar.length === 0 && (
                  <div className="text-center text-sm text-purple-500 py-8">
                    Birinchi xabarni yozing
                  </div>
                )}
                {suhbat.xabarlar.map((x, i) => {
                  // Sana ajratgichi: kun o'zgargan joyda. Busiz "14:30" degan
                  // yozuv qaysi kunga tegishli ekani bilinmasdi.
                  const oldingi = suhbat.xabarlar[i - 1]
                  const yangiKun = !oldingi || kunKaliti(oldingi.createdAt) !== kunKaliti(x.createdAt)

                  return (
                    <div key={x.id}>
                      {yangiKun && (
                        <div className="flex justify-center my-3">
                          <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-[10px] font-semibold text-purple-300">
                            {kunSarlavhasi(x.createdAt)}
                          </span>
                        </div>
                      )}

                      <div className={`flex ${x.meniki ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 ${
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
                              {soatDaqiqa(x.createdAt)}
                            </span>
                            {/* Yetkazildi/o'qildi belgisi faqat O'Z xabaringizda:
                                sherikning xabari sizga ko'ringan bo'lsa,
                                u allaqachon o'qilgan. */}
                            {x.meniki && !x.ochirilgan && (
                              <span
                                className={`text-[10px] ${x.oqilgan ? 'text-black' : 'text-black/45'}`}
                                title={x.oqilgan ? 'O\'qildi' : 'Yuborildi'}
                              >
                                {x.oqilgan ? '✓✓' : '✓'}
                              </span>
                            )}
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
                    </div>
                  )
                })}
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
                  <div className="space-y-1">
                    <div className="flex gap-2 items-end">
                      {/* `textarea`: chegara 2000 belgi, ya'ni bir necha
                          qatorli xabar kutilyapti. Bir qatorli `input` da
                          yozilgan matnning boshi ko'rinmay qolardi.
                          Enter — yuborish, Shift+Enter — yangi qator. */}
                      <textarea
                        ref={maydonRef}
                        rows={1}
                        value={matn}
                        maxLength={MAX_UZUNLIK}
                        onChange={(e) => {
                          setMatn(e.target.value)
                          const el = e.target
                          el.style.height = 'auto'
                          el.style.height = `${Math.min(el.scrollHeight, 140)}px`
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); yubor() }
                        }}
                        placeholder={
                          suhbat.suhbat.holat === 'sorov'
                            ? 'So\'rov yuborilgan — javobni kuting'
                            : 'Xabar yozing...'
                        }
                        className="flex-1 px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 outline-none focus:border-yellow-500 resize-none text-sm leading-relaxed"
                      />
                      <button
                        onClick={yubor}
                        disabled={yuborilmoqda || !matn.trim()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40 flex-shrink-0"
                      >
                        {yuborilmoqda ? '...' : 'Yuborish'}
                      </button>
                    </div>
                    {qolgan <= SANAGICH_QOLGAN && (
                      <div className={`text-[11px] text-right ${qolgan <= 0 ? 'text-red-400' : 'text-purple-400'}`}>
                        {qolgan} belgi qoldi
                      </div>
                    )}
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
