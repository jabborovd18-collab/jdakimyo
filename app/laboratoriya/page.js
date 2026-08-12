// app/laboratoriya/page.js
"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'

const ULUSH_MATNI = (birlik) =>
  birlik === 'ml' ? '25 ml' : birlik === 'gr' ? '5 g' : null

const NODIRLIK = {
  oddiy: { nom: 'Oddiy', rang: 'bg-[var(--v3-yuza-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]', badgeClass: 'v3-tag' },
  kam: { nom: 'Kam', rang: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300', badgeClass: 'v3-tag-ochiq' },
  nodir: { nom: 'Nodir', rang: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300', badgeClass: 'v3-tag-muhlat' },
  noyob: { nom: 'Noyob', rang: 'bg-amber-500/15 border-amber-500/40 text-amber-300', badgeClass: 'v3-tag-yopiq' },
}

const GURUH_NOMI = {
  shisha: 'Shisha idishlar',
  isitish: 'Isitish asboblari',
  olchov: 'O\'lchov asboblari',
  tayanch: 'Tayanch va shtativlar',
  ajratish: 'Ajratish va filtrlar',
  gaz: 'Gaz asboblari',
  himoya: 'Xavfsizlik va himoya',
  chinni: 'Chinni idishlar',
  elektr: 'Elektr asboblari',
  sarf: 'Sarf materiallari',
  sanoat: 'Sanoat apparatlari',
}

// Ovoz sintezi (Web Audio API)
function sandiqOvozi(turi = 'ochilish') {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    if (turi === 'titrash') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } else if (turi === 'yutuq') {
      const notes = [261.63, 329.63, 392.00, 523.25] // C, E, G, C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1)
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.1)
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4)
      })
    }
  } catch {
    // Audio xatosi e'tiborsiz qoldiriladi
  }
}

export default function LaboratoriyaPage() {
  const [fon, fonTanla] = useFon()
  const [holat, setHolat] = useState(null)
  const [buyumlar, setBuyumlar] = useState([])
  const [guruhlar, setGuruhlar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [kirmagan, setKirmagan] = useState(false)
  const [xato, setXato] = useState('')

  const [tab, setTab] = useState('inventar') // 'inventar' | 'tajriba' | 'sandiq' | 'dokon'
  const [sandiqlar, setSandiqlar] = useState([])
  const [ochilmoqda, setOchilmoqda] = useState(null)
  const [ochishFazasida, setOchishFazasida] = useState(false)
  const [natija, setNatija] = useState(null)

  const [turFiltr, setTurFiltr] = useState('all')
  const [guruhFiltr, setGuruhFiltr] = useState('all')
  const [qidiruv, setQidiruv] = useState('')
  const [ishlamoqda, setIshlamoqda] = useState(null)

  // ─── Tajriba ───
  const [tanlangan, setTanlangan] = useState([])
  const [tajriba, setTajriba] = useState(null)
  const [tajribaNatija, setTajribaNatija] = useState(null)
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
        setBuyumlar(data.buyumlar || [])
        setGuruhlar(data.guruhlar || [])
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
      if (res.ok) setSandiqlar(data.sandiqlar || [])
    } catch {
      // Ignored
    }
  }, [])

  useEffect(() => {
    if (tab === 'sandiq' && !kirmagan) sandiqlarniYukla()
  }, [tab, kirmagan, sandiqlarniYukla])

  // Sandiq ochish — animatsiya va ovoz effekti bilan
  const sandiqOch = async (kalit) => {
    setOchilmoqda(kalit)
    setOchishFazasida(true)
    setNatija(null)
    sandiqOvozi('titrash')

    try {
      const res = await fetch('/api/laboratoriya/sandiq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kalit }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Kichik intizorlik animatsiyasi (800ms)
      setTimeout(() => {
        setOchishFazasida(false)
        setNatija(data)
        sandiqOvozi('yutuq')
        setHolat((h) => (h ? { ...h, balans: { ...h.balans, ...data.balans } } : h))
        holatniYukla()
        sandiqlarniYukla()
      }, 850)
    } catch (error) {
      setOchishFazasida(false)
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
      // Ignored
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
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="kolba" olcham={24} />
          </div>
          <h1 className="text-xl font-bold text-[var(--v3-matn)]">Virtual Laboratoriya</h1>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            O{"'"}z laboratoriyangizni ochish uchun tizimga kiring. Reagentlar yig{"'"}ing, jihozlar oling va tajribalar o{"'"}tkazing.
          </p>
          <Link
            href="/login?callbackUrl=/laboratoriya"
            className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold inline-flex"
          >
            Kirish →
          </Link>
        </div>
      </main>
    )
  }

  if (yuklanmoqda) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Laboratoriya yuklanmoqda...</span>
        </div>
      </main>
    )
  }

  if (xato || !holat?.lab) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h1 className="text-base font-bold text-[var(--v3-matn)]">Laboratoriya yuklanmadi</h1>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{xato || 'Ma\'lumot kelmadi'}</p>
          <button
            onClick={() => { setYuklanmoqda(true); holatniYukla() }}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-2"
          >
            <Ikon nom="qayta" olcham={14} />
            Qayta urinish
          </button>
        </div>
      </main>
    )
  }

  const inventar = holat?.inventar || []
  const reagentlar = inventar.filter((i) => i.turi === 'reagent')
  const jihozlar = inventar.filter((i) => i.turi === 'jihoz')

  return (
    <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--v3-fon-2)]/95 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="v3-ikon-tugma" aria-label="Bosh sahifa">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </div>
            <span className="hidden sm:inline-block w-px h-5 bg-[var(--v3-chiziq)]" />
            <span className="hidden sm:inline text-xs font-bold text-[var(--v3-matn)]">
              {holat?.lab?.nom || 'Virtual Laboratoriya'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Balans */}
            <div className="flex items-center gap-2 bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] rounded-xl px-3 py-1 font-mono text-xs">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <span>🪙</span>
                <span>{holat?.balans?.coins || 0}</span>
              </span>
              <span className="text-[var(--v3-chiziq)]">|</span>
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <span>💎</span>
                <span>{holat?.balans?.gems || 0}</span>
              </span>
            </div>

            {/* 3D Lab ga o'tish tugmasi */}
            <Link
              href="/laboratoriya/3d"
              className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold inline-flex items-center gap-1.5"
            >
              <Ikon nom="kolba" olcham={14} />
              <span>3D Rejim</span>
            </Link>

            <FonTanlagich fon={fon} tanla={fonTanla} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Lab Level Progress Banner */}
        <div className="v3-panel-karta p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="v3-tag v3-tag-ochiq font-bold font-mono">
                {holat?.lab?.daraja || 1}-DARAJA LABORATORIYA
              </span>
              <span className="text-xs text-[var(--v3-xira)] font-mono">
                XP: {holat?.lab?.tajriba || 0}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[var(--v3-matn)]">
              {holat?.lab?.nom}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/laboratoriya/3d"
              className="v3-tugma text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <span>3D Stolga o{"'"}tish</span>
              <Ikon nom="ong" olcham={14} />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[var(--v3-chiziq)] pb-2 overflow-x-auto">
          {[
            { id: 'inventar', nom: 'Inventarim', son: inventar.length, ikon: 'kitob' },
            { id: 'tajriba', nom: 'Tajriba o\'tkazish', ikon: 'atom' },
            { id: 'sandiq', nom: 'Sandiqlar', son: sandiqlar.length, ikon: 'orin' },
            { id: 'dokon', nom: 'Do\'kon', ikon: 'fayl' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                  : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
              }`}
            >
              <Ikon nom={t.ikon} olcham={14} />
              <span>{t.nom}</span>
              {t.son !== undefined && <span className="opacity-75 font-mono">({t.son})</span>}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: INVENTAR ─── */}
        {tab === 'inventar' && (
          <div className="space-y-6">
            {inventar.length === 0 ? (
              <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
                  <Ikon nom="kolba" olcham={20} />
                </div>
                <p className="font-bold text-sm text-[var(--v3-matn)]">Inventaringiz hozircha bo{"'"}sh</p>
                <p>Do{"'"}kondan reagentlar sotib oling yoki bepul kunlik sandiqni oching.</p>
                <button
                  type="button"
                  onClick={() => setTab('sandiq')}
                  className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex mt-2"
                >
                  Sandiq ochish →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reagentlar */}
                {reagentlar.length > 0 && (
                  <div className="space-y-3">
                    <div className="v3-nishon">Reagentlar ({reagentlar.length} ta)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {reagentlar.map(i => {
                        const n = NODIRLIK[i.nodirlik] || NODIRLIK.oddiy
                        return (
                          <div key={i.kalit} className={`v3-panel-karta p-4 flex items-center justify-between gap-3 ${n.rang}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl shrink-0">{i.icon || '⚗️'}</span>
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{i.nom}</div>
                                <div className="text-[10.5px] font-mono text-[var(--v3-xira)]">
                                  Miqdor: <strong className="text-[var(--v3-urgu)]">{i.matn || i.miqdor}</strong>
                                </div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${n.badgeClass}`}>
                              {n.nom}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Jihozlar */}
                {jihozlar.length > 0 && (
                  <div className="space-y-3">
                    <div className="v3-nishon">Laboratoriya Jihozlari ({jihozlar.length} ta)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {jihozlar.map(i => {
                        const n = NODIRLIK[i.nodirlik] || NODIRLIK.oddiy
                        return (
                          <div key={i.kalit} className={`v3-panel-karta p-4 flex items-center justify-between gap-3 ${n.rang}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl shrink-0">{i.icon || '🧪'}</span>
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{i.nom}</div>
                                <div className="text-[10.5px] text-[var(--v3-xira)]">
                                  {GURUH_NOMI[i.guruh] || 'Jihoz'}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-[var(--v3-matn)]">
                              ×{i.soni} dona
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: TAJRIBA O'TKAZISH ─── */}
        {tab === 'tajriba' && (
          <div className="space-y-6">
            <div className="v3-panel-karta p-6 space-y-4">
              <div>
                <div className="v3-nishon">2D Reaksiya Simulyatori</div>
                <h3 className="font-bold text-base text-[var(--v3-matn)]">
                  Reagentlarni tanlang va tajriba o{"'"}tkazing
                </h3>
                <p className="text-xs text-[var(--v3-xira)] mt-1">
                  Inventaringizdagi reagentlarni belgilang. Server ularning kimyoviy mosligini, stexiometriyasini va kerakli jihozlarni tekshiradi.
                </p>
              </div>

              {/* Reagentlar tanlash paneli */}
              <div className="space-y-2 pt-2 border-t border-[var(--v3-chiziq)]">
                <div className="text-xs font-bold text-[var(--v3-matn)]">Mavjud reagentlaringiz:</div>
                {reagentlar.length === 0 ? (
                  <p className="text-xs text-[var(--v3-xira)]">Tajriba o'tkazish uchun reagentlar yo'q. Do'kondan xarid qiling.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {reagentlar.map((r) => {
                      const isSelected = tanlangan.includes(r.kalit)
                      return (
                        <button
                          key={r.kalit}
                          type="button"
                          onClick={() => reagentniBelgila(r.kalit)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-sm'
                              : 'bg-[var(--v3-fon-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
                          }`}
                        >
                          <span>{r.icon || '⚗️'}</span>
                          <span>{r.nom}</span>
                          <span className="opacity-70 font-mono text-[10px]">({r.matn || r.miqdor})</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Tanlangan reagentlar va Tajriba tugmasi */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--v3-chiziq)]">
                <div className="text-xs font-mono text-[var(--v3-xira)]">
                  Tanlandi: <strong className="text-[var(--v3-urgu)]">{tanlangan.length}</strong> ta modda
                </div>

                <button
                  type="button"
                  onClick={() => tajribaOtkaz()}
                  disabled={tanlangan.length < 1 || otkazilmoqda}
                  className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold disabled:opacity-40"
                >
                  {otkazilmoqda ? 'Reaksiya bormoqda...' : '🧪 Reaksiyani boshlash'}
                </button>
              </div>
            </div>

            {/* Sharoit bo'yicha tanlov (agar bir nechta reaksiya bo'lsa) */}
            {tanlov && (
              <div className="v3-panel-karta p-6 space-y-4 border-[var(--v3-urgu)]">
                <div className="font-bold text-sm text-[var(--v3-matn)]">
                  Bir nechta reaksiya varianti mavjud. Kerakli sharoitni tanlang:
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {tanlov.map(t => (
                    <button
                      key={t.reactionId}
                      type="button"
                      onClick={() => tajribaOtkaz(t.reactionId)}
                      className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-left hover:border-[var(--v3-urgu)] transition-all space-y-1"
                    >
                      <div className="font-bold text-xs text-[var(--v3-matn)]">{t.name}</div>
                      <div className="text-xs font-mono text-[var(--v3-urgu-2)]">{t.equation}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reaksiya Natijasi */}
            {tajribaNatija && (
              <div className="v3-panel-karta p-6 space-y-4 border-green-500/30 bg-green-500/5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <span>✓</span>
                  <span>Reaksiya muvaffaqiyatli amalga oshdi!</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[var(--v3-urgu)]">
                    {tajribaNatija.reaksiya?.equation}
                  </div>
                  {tajribaNatija.reaksiya?.observations && (
                    <p className="text-xs text-[var(--v3-matn)]">
                      Kuzatuv: {tajribaNatija.reaksiya.observations}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[var(--v3-xira)]">
                  <span>Olingan XP: <strong className="text-yellow-400">+{tajribaNatija.xp} XP</strong></span>
                  {tajribaNatija.birinchiMarta && <span className="v3-tag v3-tag-ochiq">Yangi kashfiyot!</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: SANDIQLAR ─── */}
        {tab === 'sandiq' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    className="v3-panel-karta p-6 flex flex-col justify-between space-y-4 hover:border-[var(--v3-chiziq-2)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-4xl shadow-inner">
                        {s.icon || '📦'}
                      </div>

                      <div className="text-center">
                        <h3 className="font-bold text-base text-[var(--v3-matn)]">{s.nom}</h3>
                        <p className="text-xs text-[var(--v3-xira)] mt-1 leading-relaxed">
                          {s.tavsif}
                        </p>
                      </div>

                      {/* Ehtimollar */}
                      <div className="pt-3 border-t border-[var(--v3-chiziq)] space-y-1 text-xs">
                        <div className="text-[10px] font-mono uppercase text-[var(--v3-xira)] mb-1">
                          Tushish ehtimollari ({s.buyumSoni} ta):
                        </div>
                        {Object.entries(s.ehtimollar || {})
                          .filter(([, v]) => v > 0)
                          .map(([nodirlik, foiz]) => {
                            const n = NODIRLIK[nodirlik] || NODIRLIK.oddiy
                            return (
                              <div key={nodirlik} className="flex justify-between text-[11px] font-mono">
                                <span className={n.rang.includes('text-') ? n.rang : ''}>{n.nom}</span>
                                <span className="text-[var(--v3-matn)]">{foiz}%</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => sandiqOch(s.kalit)}
                      disabled={ochilmoqda === s.kalit || s.ochilgan}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        s.ochilgan
                          ? 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border border-[var(--v3-chiziq)] cursor-not-allowed'
                          : 'v3-tugma v3-tugma-asosiy'
                      }`}
                    >
                      {ochilmoqda === s.kalit
                        ? 'Ochilmoqda...'
                        : s.ochilgan
                        ? '✓ Bugun ochilgan'
                        : `Ochish · ${narxMatn}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 4: DO'KON ─── */}
        {tab === 'dokon' && (
          <div className="space-y-4">
            <div className="v3-panel-karta p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="relative flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={qidiruv}
                  onChange={(e) => setQidiruv(e.target.value)}
                  placeholder="Do'kondan qidirish..."
                  className="v3-kiritish text-xs py-2 pl-8"
                />
                <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
                  <Ikon nom="qidiruv" olcham={13} />
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={turFiltr}
                  onChange={(e) => { setTurFiltr(e.target.value); setGuruhFiltr('all') }}
                  className="v3-kiritish text-xs py-2 w-auto"
                >
                  <option value="all">Barchasi</option>
                  <option value="reagent">Reagentlar</option>
                  <option value="jihoz">Jihozlar</option>
                </select>

                {turFiltr === 'jihoz' && (
                  <select
                    value={guruhFiltr}
                    onChange={(e) => setGuruhFiltr(e.target.value)}
                    className="v3-kiritish text-xs py-2 w-auto"
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
              <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
                Buyumlar topilmadi
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {buyumlar.map((b) => {
                  const n = NODIRLIK[b.nodirlik] || NODIRLIK.oddiy
                  const inv = inventar.find((i) => i.kalit === b.kalit)
                  const bor = inv?.miqdor ?? inv?.soni ?? 0
                  const ulushMatni = ULUSH_MATNI(b.birlik)

                  return (
                    <div key={b.kalit} className="v3-panel-karta p-4 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl shrink-0">{b.icon || '📦'}</span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-[var(--v3-matn)] truncate">{b.nom}</h4>
                              <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--v3-xira)]">
                                <span className={n.badgeClass}>{n.nom}</span>
                                {ulushMatni && <span>· 1 dona = {ulushMatni}</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        {b.tavsif && (
                          <p className="text-xs text-[var(--v3-xira)] line-clamp-2 leading-relaxed">
                            {b.tavsif}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--v3-chiziq)]">
                        <span className="text-[11px] font-mono text-[var(--v3-xira)]">
                          {bor > 0 ? `Sizda: ${inv?.matn || bor}` : 'Yo\'q'}
                        </span>

                        <div className="flex gap-1.5">
                          {b.narx > 0 && (
                            <button
                              type="button"
                              onClick={() => savdo('xarid', b.kalit, 1, 'coins')}
                              disabled={ishlamoqda === b.kalit + 'xarid'}
                              className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold font-mono"
                            >
                              {b.narx} 🪙
                            </button>
                          )}
                          {b.gemsNarxi > 0 && (
                            <button
                              type="button"
                              onClick={() => savdo('xarid', b.kalit, 1, 'gems')}
                              disabled={ishlamoqda === b.kalit + 'xarid'}
                              className="v3-tugma text-xs py-1.5 px-3 font-bold font-mono text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/10"
                            >
                              {b.gemsNarxi} 💎
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ SANDIQ OCHILISHI EFFEKT MODALI ═══ */}
      {(ochishFazasida || natija) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          {/* 1-FAZA: Titrash va Ochilish Animatsiyasi */}
          {ochishFazasida && (
            <div className="text-center space-y-6 relative flex flex-col items-center">
              {/* Orqa nurlar aylanmasi */}
              <div className="absolute -inset-10 opacity-30 sandiq-nur-aylanish pointer-events-none">
                <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-transparent blur-2xl" />
              </div>

              <div className="relative z-10 sandiq-animatsiya-titrash text-7xl select-none">
                📦
              </div>

              <div className="relative z-10 space-y-1">
                <div className="text-base font-bold text-yellow-300 tracking-wider uppercase animate-pulse">
                  Sandiq ochilmoqda...
                </div>
                <div className="text-xs text-[var(--v3-xira)]">
                  Nodir moddalar va jihozlar ajratilmoqda
                </div>
              </div>
            </div>
          )}

          {/* 2-FAZA: Buyumlar Ko'rinishi va Yutuq Modali */}
          {!ochishFazasida && natija && (
            <div className="w-full max-w-lg rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-1">
                <div className="v3-nishon text-[var(--v3-urgu)]">Mukofotlar qabul qilindi</div>
                <h3 className="text-xl font-bold text-[var(--v3-matn)]">
                  {natija.sandiq?.nom || 'Sandiq'} Ochildi!
                </h3>
              </div>

              {/* Tushgan Buyumlar Kartalari */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {natija.tushgan?.map((t, idx) => {
                  const n = NODIRLIK[t.nodirlik] || NODIRLIK.oddiy
                  return (
                    <div
                      key={t.kalit + idx}
                      style={{ animationDelay: `${idx * 120}ms` }}
                      className={`buyum-ochilish-karta p-4 rounded-xl border text-center space-y-2 ${n.rang} shadow-md`}
                    >
                      <div className="text-3xl">{t.icon || '⚗️'}</div>
                      <div className="font-bold text-xs text-[var(--v3-matn)] truncate">{t.nom}</div>
                      <div className="text-[10.5px] font-mono font-bold text-[var(--v3-urgu)]">
                        +{t.soni || 1} {t.birlik === 'ml' ? 'ml' : t.birlik === 'gr' ? 'g' : 'dona'}
                      </div>
                      <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-semibold ${n.badgeClass}`}>
                        {n.nom}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setNatija(null)}
                  className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-8 font-bold"
                >
                  Yopish
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
