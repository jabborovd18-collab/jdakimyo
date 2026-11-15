'use client'
// ============================================================
// JDA KIMYO V4 — SMART-DOSKA UMUMIY KO'RGAZMA VA O'YIN DVIGATELLARI
// 6-bob va 7-bob darslari uchun qayta ishlatiluvchi UI va Canvas yordamchilari
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { indekslanganVariantlarniAralashtir, variantlarniAralashtir } from '@/lib/maktab-animatsiya'
import Ikon from '@/components/Ikon'
import OtganDarsniTakrorlash from '@/components/maktab/OtganDarsniTakrorlash'
import { SmartDoskaNavigatsiya, tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi'

// ------------------------------------------------------------
// 1. ASOSIY SMART-DOSKA DARS QOBIG'I
// ------------------------------------------------------------
export function SmartDarsQobiq({
  mavzuRaqam,
  mavzuNom,
  oldingiRaqam,
  oldingiNom,
  takrorlashSavollar = [],
  korgazmalar = [],
  oyinlar = [],
  boshlangichBolim = 'animatsiyalar',
}) {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState(boshlangichBolim)
  const [faolKorgazma, setFaolKorgazma] = useState(0)
  const [faolOyin, setFaolOyin] = useState(0)

  const toliqEkranniUlash = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {})
      setToliqEkran(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setToliqEkran(false)
    }
  }

  useEffect(() => {
    const fn = () => setToliqEkran(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', fn)
    return () => document.removeEventListener('fullscreenchange', fn)
  }, [])

  const faolKorgazmaObj = korgazmalar[faolKorgazma] || korgazmalar[0]
  const faolOyinObj = oyinlar[faolOyin] || oyinlar[0]

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className={`w-full select-none transition-all duration-300 font-serif touch-manipulation ${
        toliqEkran
          ? 'fixed inset-0 z-50 bg-[#020617] p-3 sm:p-5 space-y-3 overflow-y-auto'
          : 'space-y-4'
      }`}
    >
      <SmartDoskaNavigatsiya
        mavzuRaqam={mavzuRaqam}
        mavzuNom={mavzuNom}
        oldingiRaqam={oldingiRaqam}
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === 'takrorlash' && (
        <OtganDarsniTakrorlash
          oldingiRaqam={oldingiRaqam}
          oldingiNom={oldingiNom}
          savollar={takrorlashSavollar}
          onYangiDarsgaOtish={() => setAsosiyBolim('animatsiyalar')}
        />
      )}

      {asosiyBolim === 'animatsiyalar' && (
        <div className="p-3 sm:p-5 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {korgazmalar.map((k, i) => (
              <button
                key={k.nom}
                type="button"
                onClick={() => {
                  setFaolKorgazma(i)
                  tovushChiqar('tasdiq')
                }}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-sm sm:text-base font-bold transition touch-manipulation flex items-center justify-center gap-2 ${
                  faolKorgazma === i
                    ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30'
                    : 'border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50'
                }`}
              >
                <Ikon nom={k.ikon} olcham={16} />
                <span className="truncate">{k.nom}</span>
              </button>
            ))}
          </div>
          {faolKorgazmaObj?.komponent}
        </div>
      )}

      {asosiyBolim === 'oyinlar' && (
        <div className="p-3 sm:p-5 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {oyinlar.map((o, i) => (
              <button
                key={o.nom}
                type="button"
                onClick={() => {
                  setFaolOyin(i)
                  tovushChiqar('tasdiq')
                }}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-sm sm:text-base font-bold transition touch-manipulation flex items-center justify-center gap-2 ${
                  faolOyin === i
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30'
                    : 'border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50'
                }`}
              >
                <Ikon nom={o.ikon} olcham={16} />
                <span className="truncate">{o.nom}</span>
              </button>
            ))}
          </div>
          {faolOyinObj?.komponent}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// 2. CANVAS KO'RGAZMA RAMKASI
// ------------------------------------------------------------
export function KorgazmaRamka({
  sarlavha,
  qisqaFormula,
  ikon = 'mikroskop',
  boshqaruv,
  pastkiKorinish,
  children,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-yellow-300">
            <Ikon nom={ikon} olcham={18} />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {sarlavha}
          </h3>
        </div>
        {qisqaFormula && (
          <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-blue-700/50 text-xs sm:text-sm font-extrabold text-cyan-300">
            {qisqaFormula}
          </span>
        )}
      </div>

      {boshqaruv && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#050a1f]/90 border border-blue-900/60 flex flex-wrap items-center gap-2.5 [&_button]:min-h-[44px] [&_button]:touch-manipulation">
          {boshqaruv}
        </div>
      )}

      <div className="w-full h-[360px] sm:h-[430px] xl:h-[480px] rounded-2xl border border-blue-800/70 bg-[#030712] overflow-hidden relative shadow-inner">
        {children}
      </div>

      {pastkiKorinish && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {pastkiKorinish}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// 3. UMUMIY CANVAS CHIZISH PRIMITIVLARI
// ------------------------------------------------------------
export function chizFonSetka(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#030712')
  grad.addColorStop(1, '#071128')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)'
  ctx.lineWidth = 1
  const qadam = 32
  for (let x = 0; x <= w; x += qadam) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = 0; y <= h; y += qadam) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
}

export function chizStakan(ctx, x, y, w, h, opts = {}) {
  const {
    suyuqlikRang = 'rgba(56, 189, 248, 0.35)',
    tolish = 0.72,
    yorliq = '',
    sarlavha = '',
  } = opts

  ctx.save()
  // Suyuqlik
  if (tolish > 0) {
    const suH = Math.max(4, (h - 10) * Math.min(1, tolish))
    const suY = y + h - suH - 4
    ctx.fillStyle = suyuqlikRang
    ctx.beginPath()
    ctx.roundRect(x + 4, suY, w - 8, suH, [2, 2, 10, 10])
    ctx.fill()

    // Menisk chizig'i
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x + 5, suY)
    ctx.quadraticCurveTo(x + w / 2, suY + 5, x + w - 5, suY)
    ctx.stroke()
  }

  // Shisha kontur
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x - 6, y)
  ctx.lineTo(x, y + 8)
  ctx.lineTo(x, y + h - 12)
  ctx.quadraticCurveTo(x, y + h, x + 12, y + h)
  ctx.lineTo(x + w - 12, y + h)
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 12)
  ctx.lineTo(x + w, y + 8)
  ctx.lineTo(x + w + 6, y)
  ctx.stroke()

  // Shkala chiziqlari
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)'
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const ty = y + h - (h * 0.18 * i)
    ctx.beginPath()
    ctx.moveTo(x + 6, ty)
    ctx.lineTo(x + (i % 2 === 0 ? 18 : 12), ty)
    ctx.stroke()
  }

  if (sarlavha) {
    ctx.fillStyle = '#e2e8f0'
    ctx.font = 'bold 13px "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText(sarlavha, x + w / 2, y - 10)
  }
  if (yorliq) {
    ctx.fillStyle = '#fde047'
    ctx.font = 'bold 12px "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText(yorliq, x + w / 2, y + h + 20)
  }
  ctx.restore()
}

export function chizZarracha(ctx, x, y, r, rang, belgi = '') {
  ctx.save()
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.35, rang)
  g.addColorStop(1, '#0f172a')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()

  if (belgi) {
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${Math.max(9, Math.round(r * 0.9))}px "Times New Roman", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(belgi, x, y + 1)
  }
  ctx.restore()
}

export function chizTermometr(ctx, x, y, h, temp, maxTemp = 120, rang = '#ef4444') {
  ctx.save()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(x - 6, y, 12, h, 6)
  ctx.fill()
  ctx.stroke()

  const nisbat = Math.max(0.05, Math.min(1, temp / maxTemp))
  const ustunH = (h - 16) * nisbat
  ctx.fillStyle = rang
  ctx.beginPath()
  ctx.roundRect(x - 3, y + h - 8 - ustunH, 6, ustunH + 6, 3)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(x, y + h + 4, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 13px "Times New Roman", serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${Math.round(temp)}°C`, x, y - 8)
  ctx.restore()
}

// ------------------------------------------------------------
// 4. O'YIN 1 ENGINE: TEZKOR TANLOV / DETEKTIV / KALKULYATOR
// ------------------------------------------------------------
export function TezkorTanlovOyini({ nom, ikon = 'quiz', savollar = [] }) {
  const [indeks, setIndeks] = useState(0)
  const [ball, setBall] = useState(0)
  const [seriya, setSeriya] = useState(0)
  const [tanlangan, setTanlangan] = useState(null)
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const joriy = savollar[indeks]
  const aralash = joriy ? indekslanganVariantlarniAralashtir(joriy, raund) : { variantlar: [], togri: 0 }

  const javobBosish = (vIdx) => {
    if (tanlangan !== null || !joriy) return
    setTanlangan(vIdx)
    const togri = vIdx === aralash.togri
    if (togri) {
      tovushChiqar('togri')
      setBall((b) => b + 10 + seriya * 2)
      setSeriya((s) => s + 1)
    } else {
      tovushChiqar('xato')
      setSeriya(0)
    }
  }

  const keyingi = () => {
    if (indeks + 1 < savollar.length) {
      setIndeks((i) => i + 1)
      setTanlangan(null)
      tovushChiqar('tasdiq')
    } else {
      tovushChiqar('zafar')
      setTugadi(true)
    }
  }

  const qayta = () => {
    setIndeks(0)
    setBall(0)
    setSeriya(0)
    setTanlangan(null)
    setTugadi(false)
    setRaund((r) => r + 1)
    tovushChiqar('tasdiq')
  }

  if (tugadi) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[#050b24] border border-emerald-500/40 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-yellow-300">
          <Ikon nom="kubok" olcham={34} />
        </div>
        <h3 className="text-2xl font-extrabold text-white">{nom} — Yakunlandi!</h3>
        <div className="text-4xl font-black text-emerald-400">{ball} ball</div>
        <button
          type="button"
          onClick={qayta}
          className="min-h-[52px] px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base inline-flex items-center gap-2 hover:brightness-110 transition touch-manipulation"
        >
          <Ikon nom="qayta" olcham={20} />
          <span>Qayta o&apos;ynash</span>
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-base sm:text-lg">
          <Ikon nom={ikon} olcham={20} />
          <span>{nom}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-blue-800 text-blue-200">
            {indeks + 1} / {savollar.length}
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300">
            Seriya: {seriya}
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            Ball: {ball}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#081236] border border-blue-700/40 space-y-2">
        {joriy?.belgi && (
          <div className="inline-block px-3.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-sm font-extrabold">
            {joriy.belgi}
          </div>
        )}
        <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
          {joriy?.savol}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {aralash.variantlar.map((matn, vIdx) => {
          const tanlandi = tanlangan === vIdx
          const togriVariant = vIdx === aralash.togri
          let rangKlass = 'border-blue-800/70 bg-[#07102e] text-blue-100 hover:border-cyan-400'
          if (tanlangan !== null) {
            if (togriVariant) {
              rangKlass = 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/40'
            } else if (tanlandi) {
              rangKlass = 'border-rose-500 bg-rose-500/25 text-rose-200'
            } else {
              rangKlass = 'border-slate-800 bg-slate-950/60 text-slate-500'
            }
          }
          return (
            <button
              key={matn}
              type="button"
              onClick={() => javobBosish(vIdx)}
              disabled={tanlangan !== null}
              className={`min-h-[68px] sm:min-h-[76px] p-4 rounded-xl border text-left font-bold text-base sm:text-lg transition touch-manipulation flex items-center gap-3.5 ${rangKlass}`}
            >
              <span className="w-9 h-9 rounded-lg bg-slate-900/90 border border-current/30 flex items-center justify-center shrink-0 text-sm font-black">
                {String.fromCharCode(65 + vIdx)}
              </span>
              <span>{matn}</span>
            </button>
          )
        })}
      </div>

      {tanlangan !== null && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm sm:text-base text-cyan-200 font-semibold flex-1 min-w-[200px]">
            {joriy?.izoh}
          </p>
          <button
            type="button"
            onClick={keyingi}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold text-base hover:brightness-110 transition touch-manipulation"
          >
            {indeks + 1 < savollar.length ? 'Keyingi →' : 'Natijani ko\'rish'}
          </button>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// 5. O'YIN 2 ENGINE: GURUHLASH (KATEGORIYALARGA AJRATISH)
// ------------------------------------------------------------
export function GuruhlashOyini({ nom, ikon = 'palitra', guruhlar = [], topshiriqlar = [] }) {
  const [indeks, setIndeks] = useState(0)
  const [ball, setBall] = useState(0)
  const [holat, setHolat] = useState(null) // { guruhId, togri }
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const saralangan = variantlarniAralashtir(topshiriqlar, nom || '', raund).map((x) => x.item)
  const joriy = saralangan[indeks]

  const tanla = (guruhId) => {
    if (holat !== null || !joriy) return
    const togri = guruhId === joriy.guruh
    setHolat({ guruhId, togri })
    if (togri) {
      tovushChiqar('togri')
      setBall((b) => b + 15)
    } else {
      tovushChiqar('xato')
    }
    setTimeout(() => {
      if (indeks + 1 < saralangan.length) {
        setIndeks((i) => i + 1)
        setHolat(null)
      } else {
        tovushChiqar('zafar')
        setTugadi(true)
      }
    }, 950)
  }

  const qayta = () => {
    setIndeks(0)
    setBall(0)
    setHolat(null)
    setTugadi(false)
    setRaund((r) => r + 1)
    tovushChiqar('tasdiq')
  }

  if (tugadi) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[#050b24] border border-emerald-500/40 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center text-yellow-300">
          <Ikon nom="medal" olcham={34} />
        </div>
        <h3 className="text-2xl font-extrabold text-white">{nom} — Bajarildi!</h3>
        <div className="text-4xl font-black text-emerald-400">
          {ball} / {saralangan.length * 15} ball
        </div>
        <button
          type="button"
          onClick={qayta}
          className="min-h-[52px] px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base inline-flex items-center gap-2 touch-manipulation"
        >
          <Ikon nom="qayta" olcham={20} />
          <span>Qayta saralash</span>
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-base sm:text-lg">
          <Ikon nom={ikon} olcham={20} />
          <span>{nom}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-blue-800 text-blue-200">
            {indeks + 1} / {topshiriqlar.length}
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            Ball: {ball}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b1742] to-[#060d26] border border-cyan-500/40 text-center space-y-2 shadow-lg">
        <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-400">
          Modda / Namuna
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white">{joriy?.nom}</div>
        {joriy?.qisqa && (
          <div className="text-sm sm:text-base font-semibold text-blue-200">{joriy.qisqa}</div>
        )}
      </div>

      <div
        className={`grid gap-3.5 ${
          guruhlar.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : guruhlar.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {guruhlar.map((g) => {
          const tanlangan = holat?.guruhId === g.id
          const buTogri = holat && joriy?.guruh === g.id
          let klass = 'border-blue-700/60 bg-[#081236] hover:border-yellow-400 text-white'
          if (holat) {
            if (buTogri) klass = 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50'
            else if (tanlangan && !holat.togri) klass = 'border-rose-500 bg-rose-500/25 text-rose-200'
            else klass = 'border-slate-800 bg-slate-950/60 text-slate-500'
          }
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => tanla(g.id)}
              disabled={holat !== null}
              className={`min-h-[76px] sm:min-h-[84px] p-4 sm:p-5 rounded-2xl border font-extrabold text-base sm:text-lg transition touch-manipulation flex flex-col items-center justify-center gap-1.5 ${klass}`}
            >
              <span>{g.nom}</span>
              {g.tavsif && <span className="text-xs sm:text-sm opacity-80 font-semibold">{g.tavsif}</span>}
            </button>
          )
        })}
      </div>

      {holat && (
        <div
          className={`p-3.5 rounded-xl text-center text-sm sm:text-base font-bold ${
            holat.togri
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          {holat.togri ? `To'g'ri! ${joriy?.izoh || ''}` : `Xato! To'g'ri javob: ${guruhlar.find((x) => x.id === joriy?.guruh)?.nom}`}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// 6. O'YIN 3 ENGINE: BOSQICHLI ZANJIR (KETMA-KETLIK)
// ------------------------------------------------------------
export function BosqichliZanjirOyini({ nom, ikon = 'filtr', missiyalar = [] }) {
  const [mIdx, setMIdx] = useState(0)
  const [bajarilgan, setBajarilgan] = useState([])
  const [xatoBosqich, setXatoBosqich] = useState(null)
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const missiya = missiyalar[mIdx]
  const kerakliQadam = missiya?.tartib?.[bajarilgan.length]
  const aralashQadamlar = variantlarniAralashtir(
    missiya?.variantlar || [],
    missiya?.vazifa || '',
    raund
  ).map((x) => x.item)

  const variantBos = (qadam) => {
    if (!missiya || xatoBosqich) return
    if (qadam === kerakliQadam) {
      tovushChiqar('togri')
      const yangi = [...bajarilgan, qadam]
      setBajarilgan(yangi)
      if (yangi.length === missiya.tartib.length) {
        setTimeout(() => {
          if (mIdx + 1 < missiyalar.length) {
            setMIdx((m) => m + 1)
            setBajarilgan([])
            tovushChiqar('bosqich')
          } else {
            tovushChiqar('zafar')
            setTugadi(true)
          }
        }, 900)
      }
    } else {
      tovushChiqar('xato')
      setXatoBosqich(qadam)
      setTimeout(() => setXatoBosqich(null), 650)
    }
  }

  const qayta = () => {
    setMIdx(0)
    setBajarilgan([])
    setXatoBosqich(null)
    setTugadi(false)
    setRaund((r) => r + 1)
    tovushChiqar('tasdiq')
  }

  if (tugadi) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[#050b24] border border-emerald-500/40 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-yellow-300">
          <Ikon nom="kubok" olcham={34} />
        </div>
        <h3 className="text-2xl font-extrabold text-white">{nom} — Barcha zanjirlar tuzildi!</h3>
        <button
          type="button"
          onClick={qayta}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold inline-flex items-center gap-2"
        >
          <Ikon nom="qayta" olcham={18} />
          <span>Qayta boshlash</span>
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-yellow-300 font-extrabold text-sm sm:text-base">
          <Ikon nom={ikon} olcham={18} />
          <span>{nom}</span>
        </div>
        <span className="px-3 py-1 rounded-lg bg-slate-900 border border-blue-800 text-blue-200 text-xs font-bold">
          Missiya {mIdx + 1} / {missiyalar.length}
        </span>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#081236] border border-blue-700/40">
        <div className="text-xs sm:text-sm font-bold text-cyan-400 uppercase">{missiya?.tur}</div>
        <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{missiya?.vazifa}</h4>
      </div>

      {/* Zanjir slotlari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {(missiya?.tartib || []).map((bosqich, i) => {
          const tayyor = i < bajarilgan.length
          const navbatdagi = i === bajarilgan.length
          return (
            <div
              key={`${bosqich}-${i}`}
              className={`p-3 rounded-xl border text-center font-bold text-sm sm:text-base min-h-[60px] flex items-center justify-center ${
                tayyor
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                  : navbatdagi
                  ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300 animate-pulse'
                  : 'border-slate-800 bg-slate-950/70 text-slate-500'
              }`}
            >
              {tayyor ? `${i + 1}. ${bosqich}` : navbatdagi ? `${i + 1}-bosqichni tanlang` : `${i + 1}-bosqich`}
            </div>
          )
        })}
      </div>

      {/* Variant tugmalari */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {aralashQadamlar.map((v) => {
          const ishlatilgan = bajarilgan.includes(v)
          const xato = xatoBosqich === v
          return (
            <button
              key={v}
              type="button"
              disabled={ishlatilgan}
              onClick={() => variantBos(v)}
              className={`min-h-[60px] p-3.5 rounded-xl border font-bold text-sm sm:text-base transition touch-manipulation ${
                ishlatilgan
                  ? 'border-emerald-800 bg-emerald-950/30 text-emerald-500 opacity-50'
                  : xato
                  ? 'border-rose-500 bg-rose-500/25 text-rose-200'
                  : 'border-blue-700/70 bg-[#07102e] text-white hover:border-yellow-400'
              }`}
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// 7. O'YIN 4 ENGINE: JAMOALAR DUELI (1 VS 2)
// ------------------------------------------------------------
export function JamoalarDueliPanel({ sarlavha, savollar = [] }) {
  const [indeks, setIndeks] = useState(0)
  const [navbat, setNavbat] = useState(1) // 1 yoki 2
  const [ball1, setBall1] = useState(0)
  const [ball2, setBall2] = useState(0)
  const [seriya1, setSeriya1] = useState(0)
  const [seriya2, setSeriya2] = useState(0)
  const [tanlangan, setTanlangan] = useState(null)
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const joriy = savollar[indeks]
  const aralash = joriy ? indekslanganVariantlarniAralashtir(joriy, raund) : { variantlar: [], togri: 0 }

  const javobBos = (vIdx) => {
    if (tanlangan !== null || !joriy) return
    setTanlangan(vIdx)
    const togri = vIdx === aralash.togri
    if (togri) {
      tovushChiqar('togri')
      if (navbat === 1) {
        setBall1((b) => b + 10 + seriya1 * 2)
        setSeriya1((s) => s + 1)
      } else {
        setBall2((b) => b + 10 + seriya2 * 2)
        setSeriya2((s) => s + 1)
      }
    } else {
      tovushChiqar('xato')
      if (navbat === 1) setSeriya1(0)
      else setSeriya2(0)
    }
  }

  const keyingiNavbat = () => {
    if (indeks + 1 < savollar.length) {
      setIndeks((i) => i + 1)
      setNavbat((n) => (n === 1 ? 2 : 1))
      setTanlangan(null)
      tovushChiqar('tasdiq')
    } else {
      tovushChiqar('zafar')
      setTugadi(true)
    }
  }

  const qayta = () => {
    setIndeks(0)
    setNavbat(1)
    setBall1(0)
    setBall2(0)
    setSeriya1(0)
    setSeriya2(0)
    setTanlangan(null)
    setTugadi(false)
    setRaund((r) => r + 1)
    tovushChiqar('tasdiq')
  }

  if (tugadi) {
    const golib = ball1 > ball2 ? '1-JAMOA G\'OLIB!' : ball2 > ball1 ? '2-JAMOA G\'OLIB!' : 'DURANG!'
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[#050b24] border border-yellow-400/50 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-300">
          <Ikon nom="kubok" olcham={36} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-yellow-300">{golib}</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-400/50">
            <div className="text-xs font-bold text-cyan-300">1-JAMOA</div>
            <div className="text-3xl font-black text-white mt-1">{ball1}</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/50">
            <div className="text-xs font-bold text-amber-300">2-JAMOA</div>
            <div className="text-3xl font-black text-white mt-1">{ball2}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={qayta}
          className="min-h-[52px] px-7 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-extrabold text-base inline-flex items-center gap-2 touch-manipulation"
        >
          <Ikon nom="qayta" olcham={20} />
          <span>Yangi Duel</span>
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between ${
            navbat === 1
              ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400/40'
              : 'border-blue-900/50 bg-[#07102c] opacity-75'
          }`}
        >
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-cyan-300">1-JAMOA {navbat === 1 ? '• NAVBAT' : ''}</div>
            <div className="text-xs sm:text-sm text-cyan-100/75">Seriya: {seriya1}</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{ball1}</div>
        </div>

        <div
          className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between ${
            navbat === 2
              ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40'
              : 'border-blue-900/50 bg-[#07102c] opacity-75'
          }`}
        >
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-amber-300">2-JAMOA {navbat === 2 ? '• NAVBAT' : ''}</div>
            <div className="text-xs sm:text-sm text-amber-100/75">Seriya: {seriya2}</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{ball2}</div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#081236] border border-blue-700/50 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs sm:text-sm font-bold text-slate-400">
            {sarlavha} • {indeks + 1} / {savollar.length}
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{joriy?.savol}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {aralash.variantlar.map((v, vIdx) => {
          const tanlandi = tanlangan === vIdx
          const togriVariant = vIdx === aralash.togri
          let klass = 'border-blue-800/70 bg-[#07102e] text-white hover:border-yellow-400'
          if (tanlangan !== null) {
            if (togriVariant) klass = 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/40'
            else if (tanlandi) klass = 'border-rose-500 bg-rose-500/25 text-rose-200'
            else klass = 'border-slate-800 bg-slate-950/60 text-slate-500'
          }
          return (
            <button
              key={v}
              type="button"
              disabled={tanlangan !== null}
              onClick={() => javobBos(vIdx)}
              className={`min-h-[68px] sm:min-h-[76px] p-4 rounded-xl border text-left font-bold text-base sm:text-lg transition touch-manipulation flex items-center gap-3.5 ${klass}`}
            >
              <span className="w-9 h-9 rounded-lg bg-slate-900 border border-current/30 flex items-center justify-center shrink-0 text-sm font-black">
                {String.fromCharCode(65 + vIdx)}
              </span>
              <span>{v}</span>
            </button>
          )
        })}
      </div>

      {tanlangan !== null && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-yellow-400/30 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm sm:text-base font-semibold text-blue-100 flex-1 min-w-[200px]">
            {joriy?.izoh}
          </span>
          <button
            type="button"
            onClick={keyingiNavbat}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-extrabold text-base hover:brightness-110 transition touch-manipulation"
          >
            {indeks + 1 < savollar.length ? 'Keyingi guruhga navbat →' : 'G\'olibni e\'lon qilish'}
          </button>
        </div>
      )}
    </div>
  )
}
