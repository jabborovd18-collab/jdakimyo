// app/laboratoriya/page.js
"use client"
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const NODIRLIK = {
  oddiy: { nom: 'Oddiy', rang: 'border-slate-600/50 bg-slate-800/40', matn: 'text-slate-300' },
  kam: { nom: 'Kam', rang: 'border-green-700/50 bg-green-950/30', matn: 'text-green-400' },
  nodir: { nom: 'Nodir', rang: 'border-blue-700/50 bg-blue-950/30', matn: 'text-blue-400' },
  noyob: { nom: 'Noyob', rang: 'border-purple-600/50 bg-purple-950/40', matn: 'text-purple-300' },
}

const GURUH_NOMI = {
  shisha: '🧪 Shisha idishlar',
  isitish: '🔥 Isitish',
  olchov: '📏 O\'lchov',
  tayanch: '🔩 Tayanch',
  ajratish: '🔻 Ajratish',
  gaz: '🪈 Gaz',
  himoya: '🛡️ Xavfsizlik',
  chinni: '🥣 Chinni',
  elektr: '⚡ Elektr',
  sarf: '🔗 Sarf materiallari',
  sanoat: '🏭 Sanoat',
}

export default function LaboratoriyaPage() {
  const [holat, setHolat] = useState(null)
  const [buyumlar, setBuyumlar] = useState([])
  const [guruhlar, setGuruhlar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [kirmagan, setKirmagan] = useState(false)
  // Xato alohida holat: usiz yuklash yiqilganda sahifa "Laboratoriya bo'sh"
  // deb ko'rsatardi va foydalanuvchi hamma narsasini yo'qotgandek his qilardi.
  const [xato, setXato] = useState('')

  const [tab, setTab] = useState('inventar')
  const [sandiqlar, setSandiqlar] = useState([])
  const [ochilmoqda, setOchilmoqda] = useState(null)
  const [natija, setNatija] = useState(null)
  const [turFiltr, setTurFiltr] = useState('all')
  const [guruhFiltr, setGuruhFiltr] = useState('all')
  const [qidiruv, setQidiruv] = useState('')
  const [ishlamoqda, setIshlamoqda] = useState(null)

  // ─── Tajriba ───
  const [tanlangan, setTanlangan] = useState([])
  const [tajriba, setTajriba] = useState(null) // {mumkin, jurnal}
  const [tajribaNatija, setTajribaNatija] = useState(null)
  // Bitta reagent to'plamidan bir nechta reaksiya chiqqanda: sharoit
  // bo'yicha tanlash ro'yxati
  const [tanlov, setTanlov] = useState(null)
  const [otkazilmoqda, setOtkazilmoqda] = useState(false)

  const holatniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/laboratoriya')
      if (res.status === 401) { setKirmagan(true); return }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Laboratoriya yuklanmadi')
      setHolat(data)
      setXato('')
    } catch (error) {
      setXato(error.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { holatniYukla() }, [holatniYukla])

  useEffect(() => {
    if (tab !== 'dokon' || kirmagan) return
    const kutish = setTimeout(async () => {
      try {
        const p = new URLSearchParams({ turi: turFiltr, guruh: guruhFiltr, qidiruv })
        const res = await fetch(`/api/laboratoriya/dokon?${p}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setBuyumlar(data.buyumlar)
        setGuruhlar(data.guruhlar)
      } catch (error) {
        toast.error('Do\'kon yuklanmadi: ' + error.message)
      }
    }, 300)
    return () => clearTimeout(kutish)
  }, [tab, turFiltr, guruhFiltr, qidiruv, kirmagan])

  const sandiqlarniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/laboratoriya/sandiq')
      const data = await res.json()
      if (res.ok) setSandiqlar(data.sandiqlar)
    } catch {
      // jim — sahifaning qolgan qismi ishlayveradi
    }
  }, [])

  useEffect(() => {
    if (tab === 'sandiq' && !kirmagan) sandiqlarniYukla()
  }, [tab, kirmagan, sandiqlarniYukla])

  const sandiqOch = async (kalit) => {
    setOchilmoqda(kalit)
    setNatija(null)
    try {
      const res = await fetch('/api/laboratoriya/sandiq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kalit }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNatija(data)
      setHolat((h) => (h ? { ...h, balans: { ...h.balans, ...data.balans } } : h))
      holatniYukla()
      sandiqlarniYukla()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setOchilmoqda(null)
    }
  }

  const tajribaniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/laboratoriya/tajriba')
      const data = await res.json()
      if (res.ok) setTajriba(data)
    } catch {
      // jim — sahifaning qolgan qismi ishlayveradi
    }
  }, [])

  useEffect(() => {
    if (tab === 'tajriba' && !kirmagan) tajribaniYukla()
  }, [tab, kirmagan, tajribaniYukla])

  const reagentniBelgila = (kalit) => {
    setTanlov(null)
    setTanlangan((oldin) =>
      oldin.includes(kalit) ? oldin.filter((k) => k !== kalit) : [...oldin, kalit],
    )
  }

  const tajribaOtkaz = async (reactionId = null) => {
    setOtkazilmoqda(true)
    try {
      const res = await fetch('/api/laboratoriya/tajriba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kalitlar: tanlangan, reactionId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Bir xil reagentlardan sharoitga qarab har xil mahsulot chiqadi —
      // qaysi biri kerakligini foydalanuvchi tanlaydi
      if (data.tanlov) {
        setTanlov(data.tanlov)
        setTajribaNatija(null)
        return
      }

      setTanlov(null)
      setTajribaNatija(data)
      setTanlangan([])
      if (data.darajaOshdi) {
        toast.success(`🎉 Laboratoriya ${data.yangiDaraja}-darajaga chiqdi!`)
      }
      holatniYukla()
      tajribaniYukla()
    } catch (error) {
      setTajribaNatija(null)
      toast.error(error.message)
    } finally {
      setOtkazilmoqda(false)
    }
  }

  const savdo = async (amal, kalit, soni = 1, valyuta = 'coins') => {
    setIshlamoqda(kalit + amal)
    try {
      const res = await fetch('/api/laboratoriya/dokon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal, kalit, soni, valyuta }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setHolat((h) => (h ? { ...h, balans: { ...h.balans, ...data.balans } } : h))
      holatniYukla()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIshlamoqda(null)
    }
  }

  if (kirmagan) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-900/60 border border-purple-800/50 rounded-2xl p-8">
          <div className="text-6xl mb-4">🔬</div>
          <h1 className="text-2xl font-bold mb-2">Laboratoriya</h1>
          <p className="text-purple-300 text-sm mb-6">
            O'z laboratoriyangizni ochish uchun tizimga kiring. Missiyalarni bajarib
            tanga yig'asiz, jihoz sotib olasiz va tajriba o'tkazasiz.
          </p>
          <Link
            href="/login?callbackUrl=/laboratoriya"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold"
          >
            Kirish
          </Link>
        </div>
      </main>
    )
  }

  if (yuklanmoqda) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-purple-300">⏳ Laboratoriya yuklanmoqda...</div>
      </main>
    )
  }

  // Yuklash yiqilsa — bo'sh laboratoriya EMAS, xato ko'rsatiladi.
  // Aks holda foydalanuvchi jihozlarim yo'qoldi deb o'ylardi.
  if (xato || !holat?.lab) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-900/60 border border-red-800/50 rounded-2xl p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">Laboratoriya yuklanmadi</h1>
          <p className="text-purple-300 text-sm mb-1">{xato || 'Ma\'lumot kelmadi'}</p>
          <p className="text-purple-500 text-xs mb-6">
            Jihozlaringiz va tangalaringiz joyida — bu faqat yuklashdagi nosozlik.
          </p>
          <button
            onClick={() => { setYuklanmoqda(true); holatniYukla() }}
            className="px-6 py-3 rounded-xl bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 font-semibold"
          >
            🔄 Qayta urinish
          </button>
        </div>
      </main>
    )
  }

  const inventar = holat?.inventar || []
  const reagentlar = inventar.filter((i) => i.turi === 'reagent')
  const jihozlar = inventar.filter((i) => i.turi === 'jihoz')

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Sarlavha va balans */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link href="/" className="text-xs text-purple-400 hover:text-purple-300">← Bosh sahifa</Link>
            <h1 className="text-3xl font-bold mt-1">🔬 {holat?.lab?.nom}</h1>
            <p className="text-purple-300 text-sm mt-0.5">
              {holat?.lab?.daraja}-daraja laboratoriya
            </p>
            {/* Daraja tajribadan o'sadi — qancha qolganini ko'rsatamiz */}
            {holat?.lab?.darajaHolati && (
              <div className="mt-2 w-56">
                <div className="h-1.5 rounded-full bg-purple-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                    style={{ width: `${holat.lab.darajaHolati.foiz}%` }}
                  />
                </div>
                <div className="text-[10px] text-purple-400 mt-1">
                  {holat.lab.darajaHolati.joriy} / {holat.lab.darajaHolati.kerak} tajriba →{' '}
                  {holat.lab.darajaHolati.daraja + 1}-daraja
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/laboratoriya/3d"
              className="flex items-center gap-2 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition hover:scale-[1.03] hover:shadow-purple-800/60"
            >
              <span>🔬 3D Rejim</span>
              <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider">
                Yangi
              </span>
            </Link>
            <div className="px-4 py-2.5 rounded-xl bg-amber-950/40 border border-amber-700/40 text-center">
              <div className="text-xl font-bold text-amber-400">🪙 {holat?.balans?.coins ?? 0}</div>
              <div className="text-[10px] text-amber-300/70">Tanga</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-700/40 text-center">
              <div className="text-xl font-bold text-cyan-300">💎 {holat?.balans?.gems ?? 0}</div>
              <div className="text-[10px] text-cyan-300/70">Olmos</div>
            </div>
          </div>
        </div>

        {/* Tablar va 3D o'tish tugmasi */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'inventar', nom: `🎒 Inventar (${inventar.length})` },
              { id: 'tajriba', nom: '🧪 Tajriba' },
              { id: 'sandiq', nom: '🎁 Sandiqlar' },
              { id: 'dokon', nom: '🏪 Do\'kon' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'bg-slate-900/60 border border-purple-800/50 text-purple-200 hover:bg-slate-800/60'
                }`}
              >
                {t.nom}
              </button>
            ))}
          </div>

          <Link
            href="/laboratoriya/3d"
            className="flex items-center gap-2 rounded-xl border border-purple-700/60 bg-purple-950/40 px-4 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-900/50 hover:text-white transition"
          >
            <span>✨ 3D Laboratoriyaga o'tish →</span>
          </Link>
        </div>

        {/* ─── INVENTAR ─── */}
        {tab === 'inventar' && (
          inventar.length === 0 ? (
            <div className="text-center py-14 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Laboratoriya bo'sh</h3>
              <p className="text-purple-300 text-sm max-w-md mx-auto mb-5">
                Har bir kimyogar bo'sh xonadan boshlaydi. Missiyalarni bajarib tanga
                yig'ing va birinchi probirkangizni oling.
              </p>
              <button
                onClick={() => setTab('dokon')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold"
              >
                🏪 Do'konga o'tish
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { nom: '🔧 Jihozlar', royxat: jihozlar },
                { nom: '⚗️ Reagentlar', royxat: reagentlar },
              ].filter((b) => b.royxat.length > 0).map((bolim) => (
                <div key={bolim.nom}>
                  <h2 className="text-sm font-bold text-purple-300 mb-2">{bolim.nom}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {bolim.royxat.map((i) => {
                      const n = NODIRLIK[i.nodirlik] || NODIRLIK.oddiy
                      return (
                        <div key={i.kalit} className={`rounded-xl border p-3.5 ${n.rang}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-2xl">{i.icon || '📦'}</span>
                            <span className="text-sm font-bold text-white">×{i.soni}</span>
                          </div>
                          <div className="mt-2 font-semibold text-white text-sm leading-tight">{i.nom}</div>
                          <div className={`text-[10px] mt-0.5 ${n.matn}`}>{n.nom}</div>
                          {i.sotishNarxi > 0 && (
                            <button
                              onClick={() => savdo('sotish', i.kalit, 1)}
                              disabled={ishlamoqda === i.kalit + 'sotish'}
                              className="mt-2.5 w-full py-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700/60 border border-purple-600/40 text-xs font-semibold disabled:opacity-50"
                            >
                              Sotish · {i.sotishNarxi} 🪙
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ─── TAJRIBA ─── */}
        {tab === 'tajriba' && (
          <div className="space-y-4">
            {/* Ish stoli — tanlangan reagentlar tenglama ko'rinishida */}
            <div className="rounded-2xl border border-purple-800/50 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="font-bold text-white">🧫 Ish stoli</h2>
                {tajriba?.mumkin && (
                  <span className="text-[11px] text-purple-400">
                    {tajriba.mumkin.kashfEtilgan} / {tajriba.mumkin.jamiReaksiya} reaksiya kashf etilgan
                  </span>
                )}
              </div>

              <div className="min-h-[52px] flex items-center flex-wrap gap-2 rounded-xl bg-purple-950/40 border border-purple-800/40 px-4 py-3">
                {tanlangan.length === 0 ? (
                  <span className="text-sm text-purple-500">
                    Pastdan reagent tanlang — kamida bittasini
                  </span>
                ) : (
                  tanlangan.map((k, i) => (
                    <span key={k} className="flex items-center gap-2">
                      {i > 0 && <span className="text-purple-500">+</span>}
                      <button
                        onClick={() => reagentniBelgila(k)}
                        className="px-3 py-1.5 rounded-lg bg-purple-800/60 border border-purple-600/50 text-sm font-semibold hover:bg-purple-700/60"
                        title="Olib tashlash"
                      >
                        {k} ✕
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => tajribaOtkaz()}
                  disabled={otkazilmoqda || tanlangan.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
                >
                  {otkazilmoqda ? '⏳ Reaksiya ketmoqda...' : '🔥 Tajriba o\'tkazish'}
                </button>
                {tanlangan.length > 0 && (
                  <button
                    onClick={() => { setTanlangan([]); setTanlov(null) }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/70 border border-purple-800/50 text-sm font-semibold"
                  >
                    Tozalash
                  </button>
                )}
              </div>
            </div>

            {/* Bir xil reagentlardan bir nechta reaksiya chiqdi */}
            {tanlov && (
              <div className="rounded-2xl border border-cyan-700/50 bg-cyan-950/30 p-5">
                <h3 className="font-bold text-cyan-300 mb-1">Sharoitni tanlang</h3>
                <p className="text-[11px] text-cyan-200/70 mb-3">
                  Bu reagentlardan bir nechta reaksiya chiqadi — qaysi biri bo'lishi
                  harorat va katalizatorga bog'liq.
                </p>
                <div className="space-y-2">
                  {tanlov.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => tajribaOtkaz(t.id)}
                      disabled={otkazilmoqda}
                      className="w-full text-left px-4 py-3 rounded-xl bg-slate-900/70 border border-cyan-800/50 hover:border-cyan-500/70 disabled:opacity-50"
                    >
                      <div className="text-sm font-semibold text-white">
                        {t.name || 'Nomsiz reaksiya'}
                      </div>
                      <div className="text-[11px] text-cyan-300/80 mt-0.5">
                        {[t.temperature, t.catalyst && `katalizator: ${t.catalyst}`, t.environment]
                          .filter(Boolean)
                          .join(' · ') || 'Odatdagi sharoit'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Natija */}
            {tajribaNatija && (
              <div className="rounded-2xl border border-green-700/50 bg-gradient-to-br from-green-950/40 to-slate-900/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-white break-words">
                      {tajribaNatija.reaksiya.equation}
                    </div>
                    {tajribaNatija.reaksiya.name && (
                      <div className="text-sm text-green-300 mt-0.5">
                        {tajribaNatija.reaksiya.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setTajribaNatija(null)}
                    className="text-purple-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Kuzatuv — foydalanuvchi reaksiyani aynan shu orqali ko'radi */}
                <div className="mt-4 rounded-xl bg-slate-950/60 border border-green-800/40 p-4">
                  <div className="text-[10px] uppercase tracking-wider text-green-500 mb-1">
                    Nima ko'rindi
                  </div>
                  <p className="text-sm text-green-100/90 leading-relaxed">
                    {tajribaNatija.reaksiya.observations}
                  </p>
                </div>

                {tajribaNatija.reaksiya.hazards?.length > 0 && (
                  <div className="mt-3 rounded-xl bg-red-950/40 border border-red-800/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1">
                      ⚠️ Xavfsizlik
                    </div>
                    <ul className="text-[12px] text-red-200/90 space-y-0.5 list-disc list-inside">
                      {tajribaNatija.reaksiya.hazards.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="rounded-xl bg-slate-900/60 border border-purple-800/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-purple-400 mb-1.5">
                      Sarflandi
                    </div>
                    {tajribaNatija.sarflandi.map((s) => (
                      <div key={s.kalit} className="text-sm text-purple-200">
                        −{s.soni} × {s.nom}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-slate-900/60 border border-green-800/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-green-400 mb-1.5">
                      Inventarga tushdi
                    </div>
                    {tajribaNatija.olindi.length === 0 ? (
                      <div className="text-sm text-purple-400">—</div>
                    ) : (
                      tajribaNatija.olindi.map((m) => (
                        <div key={m.kalit} className="text-sm text-green-200">
                          +{m.soni} × {m.nom}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mt-3 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-yellow-950/50 border border-yellow-700/40 text-yellow-300 font-semibold">
                    +{tajribaNatija.olinganXP} tajriba
                  </span>
                  {tajribaNatija.birinchi && (
                    <span className="px-3 py-1.5 rounded-lg bg-purple-900/60 border border-purple-600/50 text-purple-200 font-semibold">
                      🎉 Birinchi kashfiyot
                    </span>
                  )}
                  {tajribaNatija.darajaOshdi && (
                    <span className="px-3 py-1.5 rounded-lg bg-green-900/60 border border-green-600/50 text-green-200 font-semibold">
                      {tajribaNatija.yangiDaraja}-daraja
                    </span>
                  )}
                  {!tajribaNatija.reaksiya.isVerified && (
                    <span className="text-purple-500">
                      Bu reaksiya kimyogar tomonidan hali tasdiqlanmagan
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Inventardagi reagentlar */}
            <div>
              <h2 className="text-sm font-bold text-purple-300 mb-2">
                ⚗️ Inventardagi reagentlar
              </h2>
              {reagentlar.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/50 border border-purple-800/50 rounded-xl">
                  <p className="text-purple-300 text-sm max-w-md mx-auto">
                    Reagent yo'q. Kunlik yetkazib berish bepul — sandiqlar bo'limidan
                    oling yoki do'kondan sotib oling.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {reagentlar.map((r) => {
                    const belgilangan = tanlangan.includes(r.kalit)
                    return (
                      <button
                        key={r.kalit}
                        onClick={() => reagentniBelgila(r.kalit)}
                        className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                          belgilangan
                            ? 'bg-yellow-500 text-black border-yellow-400'
                            : 'bg-slate-900/60 border-purple-800/50 text-purple-100 hover:border-purple-500/70'
                        }`}
                      >
                        {r.nom} <span className="opacity-70">×{r.soni}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Hozirgi inventar bilan nima qilish mumkin */}
            <div>
              <h2 className="text-sm font-bold text-purple-300 mb-2">
                📋 Hozir mumkin bo'lgan tajribalar
                {tajriba?.mumkin ? ` (${tajriba.mumkin.jami})` : ''}
              </h2>
              {!tajriba?.mumkin?.royxat?.length ? (
                <div className="text-center py-8 bg-slate-900/50 border border-purple-800/50 rounded-xl text-sm text-purple-300">
                  Hozircha bironta reaksiyani to'liq yig'a olmaysiz — reagent yoki
                  jihoz yetishmayapti.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tajriba.mumkin.royxat.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setTanlangan(m.reagentlar.map((r) => r.kalit)); setTanlov(null) }}
                      className="text-left rounded-xl border border-purple-800/50 bg-slate-900/60 hover:border-yellow-500/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {/* Kashf etilmagan reaksiyaning mahsuloti berilmaydi —
                            uni tajribaning o'zi ko'rsatishi kerak */}
                        <span className="text-sm font-semibold text-white break-words">
                          {m.kashfEtilgan && m.equation ? (
                            m.equation
                          ) : (
                            <>
                              {m.reagentlar.map((r) => `${r.koef > 1 ? r.koef : ''}${r.nom}`).join(' + ')}
                              <span className="text-purple-500"> → ?</span>
                            </>
                          )}
                        </span>
                        {m.kashfEtilgan && (
                          <span className="text-[10px] text-green-400 flex-shrink-0">✓ kashf etilgan</span>
                        )}
                      </div>
                      <div className="text-[10px] text-purple-400 mt-1.5">
                        {m.jihozlar.map((j) => `${j.icon || '🔧'} ${j.nom}`).join(' · ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Laboratoriya daftari */}
            {tajriba?.jurnal?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-purple-300 mb-2">📓 Laboratoriya daftari</h2>
                <div className="rounded-xl border border-purple-800/50 bg-slate-900/50 divide-y divide-purple-900/50">
                  {tajriba.jurnal.map((y) => (
                    <div key={y.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[13px] text-purple-100 break-words">{y.equation}</span>
                      <span className="text-[11px] text-purple-400 flex-shrink-0">
                        {y.birinchi ? '🎉 ' : ''}+{y.tajriba}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── SANDIQLAR ─── */}
        {tab === 'sandiq' && (
          <div className="space-y-4">
            {/* Ochilgan sandiq natijasi */}
            {natija && (
              <div className="rounded-2xl border border-yellow-600/50 bg-gradient-to-br from-yellow-950/50 to-orange-950/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{natija.sandiq.icon}</span>
                  <h3 className="font-bold text-yellow-300">{natija.sandiq.nom} ochildi</h3>
                  <button
                    onClick={() => setNatija(null)}
                    className="ml-auto text-purple-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {natija.tushgan.map((t) => {
                    const n = NODIRLIK[t.nodirlik] || NODIRLIK.oddiy
                    return (
                      <div key={t.kalit} className={`rounded-xl border p-3 text-center ${n.rang}`}>
                        <div className="text-2xl">{t.icon || '⚗️'}</div>
                        <div className="font-semibold text-white text-sm mt-1">{t.nom}</div>
                        <div className={`text-[10px] ${n.matn}`}>{n.nom}</div>
                        <div className="text-xs text-white/80 mt-1">×{t.soni}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sandiqlar.map((s) => {
                const bepul = !s.narx
                const narxMatn = bepul
                  ? 'Bepul'
                  : s.narx.gems
                    ? `${s.narx.gems} 💎`
                    : `${s.narx.coins} 🪙`
                return (
                  <div
                    key={s.kalit}
                    className="rounded-2xl border border-purple-800/50 bg-slate-900/60 p-5 flex flex-col"
                  >
                    <div className="text-4xl text-center">{s.icon}</div>
                    <h3 className="font-bold text-white text-center mt-2">{s.nom}</h3>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed mt-2 flex-1">
                      {s.tavsif}
                    </p>

                    {/* Ehtimollar oshkora ko'rsatiladi */}
                    <div className="mt-3 pt-3 border-t border-purple-800/40">
                      <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-1.5">
                        Tushish ehtimoli · {s.buyumSoni} ta buyum
                      </div>
                      <div className="space-y-1">
                        {Object.entries(s.ehtimollar)
                          .filter(([, v]) => v > 0)
                          .map(([nodirlik, foiz]) => {
                            const n = NODIRLIK[nodirlik] || NODIRLIK.oddiy
                            return (
                              <div key={nodirlik} className="flex items-center justify-between text-[11px]">
                                <span className={n.matn}>{n.nom}</span>
                                <span className="text-white/70">{foiz}%</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                    <button
                      onClick={() => sandiqOch(s.kalit)}
                      disabled={ochilmoqda === s.kalit || s.ochilgan}
                      className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                        s.ochilgan
                          ? 'bg-slate-800 text-purple-400 border border-purple-800/50'
                          : bepul
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black'
                            : s.narx.gems
                              ? 'bg-cyan-700/80 hover:bg-cyan-600 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                      }`}
                    >
                      {ochilmoqda === s.kalit
                        ? '⏳ Ochilmoqda...'
                        : s.ochilgan
                          ? '✓ Bugun olingan'
                          : `Ochish · ${narxMatn}`}
                    </button>
                  </div>
                )
              })}
            </div>

            <p className="text-center text-[11px] text-purple-500">
              Nima tushishi server tomonda hal qilinadi. Ehtimollar yuqorida ko'rsatilgan
              va o'zgartirilmaydi.
            </p>
          </div>
        )}

        {/* ─── DO'KON ─── */}
        {tab === 'dokon' && (
          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="🔍 Nomi bo'yicha qidirish..."
                className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={turFiltr}
                  onChange={(e) => { setTurFiltr(e.target.value); setGuruhFiltr('all') }}
                  className="px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm outline-none"
                >
                  <option value="all">Hammasi</option>
                  <option value="jihoz">🔧 Jihozlar</option>
                  <option value="reagent">⚗️ Reagentlar</option>
                </select>
                {turFiltr === 'jihoz' && (
                  <select
                    value={guruhFiltr}
                    onChange={(e) => setGuruhFiltr(e.target.value)}
                    className="px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm outline-none"
                  >
                    <option value="all">Barcha guruhlar</option>
                    {guruhlar.map((g) => (
                      <option key={g.guruh} value={g.guruh}>
                        {GURUH_NOMI[g.guruh] || g.guruh} ({g.soni})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {buyumlar.length === 0 ? (
              <div className="text-center py-12 text-purple-300 bg-slate-900/50 border border-purple-800/50 rounded-xl">
                Hech narsa topilmadi
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyumlar.map((b) => {
                  const n = NODIRLIK[b.nodirlik] || NODIRLIK.oddiy
                  const bor = inventar.find((i) => i.kalit === b.kalit)?.soni || 0
                  return (
                    <div key={b.kalit} className={`rounded-xl border p-4 ${n.rang}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{b.icon || '📦'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-sm leading-tight">{b.nom}</div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`text-[10px] ${n.matn}`}>{n.nom}</span>
                            {b.sanoat && <span className="text-[10px] text-orange-400">🏭 Sanoat</span>}
                            {bor > 0 && <span className="text-[10px] text-purple-400">bor: {bor}</span>}
                          </div>
                        </div>
                      </div>

                      {b.tavsif && (
                        <p className="text-[11px] text-purple-300/80 mt-2 leading-relaxed line-clamp-3">{b.tavsif}</p>
                      )}

                      <div className="flex gap-2 mt-3">
                        {b.narx > 0 && (
                          <button
                            onClick={() => savdo('xarid', b.kalit, 1, 'coins')}
                            disabled={ishlamoqda === b.kalit + 'xarid'}
                            className="flex-1 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-black text-xs font-bold disabled:opacity-50"
                          >
                            {b.narx} 🪙
                          </button>
                        )}
                        {b.gemsNarxi > 0 && (
                          <button
                            onClick={() => savdo('xarid', b.kalit, 1, 'gems')}
                            disabled={ishlamoqda === b.kalit + 'xarid'}
                            className="flex-1 py-2 rounded-lg bg-cyan-700/70 hover:bg-cyan-600 text-white text-xs font-bold disabled:opacity-50"
                          >
                            {b.gemsNarxi} 💎
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-purple-500 pt-2">
          Tanga kunlik missiyalardan yig'iladi.{' '}
          <Link href="/profil" className="text-purple-400 hover:text-purple-300">Missiyalarga o'tish</Link>
        </p>
      </div>
    </main>
  )
}
