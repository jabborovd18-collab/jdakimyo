'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 6-BOB, 6.5-MAVZU
// "Eruvchanlik" (Darslik 110-bet)
// 6 ta interaktiv Canvas Ko'rgazma + 4 ta Smart-doska O'yini
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { kadrSora, kadrniBekorQil, canvasOlchami, indekslanganVariantlarniAralashtir } from '@/lib/maktab-animatsiya'
import { tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi'
import Ikon from '@/components/Ikon'
import {
  SmartDarsQobiq,
  KorgazmaRamka,
  chizFonSetka,
  chizStakan,
  chizZarracha,
  GuruhlashOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_6_4 = [
  {
    id: '6-4-1',
    savol: 'Eritmada erigan moddaning massa ulushi (ω) qaysi formula bilan hisoblanadi?',
    variantlar: [
      { matn: 'ω = m(erigan modda) / m(eritma) · 100%', togri: true },
      { matn: 'ω = m(suv) / m(modda) · 100%', togri: false },
      { matn: 'ω = m(modda) · V(suv)', togri: false },
      { matn: 'ω = m(eritma) - m(suv)', togri: false },
    ],
    izoh: 'Massa ulushi erigan modda massasining umumiy eritma massasiga nisbatidir.',
  },
  {
    id: '6-4-2',
    savol: '25 g shakar 75 g suvda eritilsa, eritmaning massa ulushi necha foiz bo‘ladi?',
    variantlar: [
      { matn: '50%', togri: false },
      { matn: '25%', togri: true },
      { matn: '33.3%', togri: false },
      { matn: '75%', togri: false },
    ],
    izoh: 'm(eritma) = 25 + 75 = 100 g; ω = 25 / 100 = 25%.',
  },
  {
    id: '6-4-3',
    savol: 'Berilgan haroratda modda boshqa erimaydigan muvozanatdagi eritma qanday ataladi?',
    variantlar: [
      { matn: 'Suspenziya', togri: false },
      { matn: 'Aerozol', togri: false },
      { matn: 'To‘yingan eritma', togri: true },
      { matn: 'Suyultirilgan eritma', togri: false },
    ],
    izoh: 'Maksimal erish chegarasiga yetgan eritma to‘yingan eritma deyiladi.',
  },
]

// ============================================================
// 1-KO'RGAZMA: QATTIQ MODDALAR ERUVCHANLIK EGRI CHIZIG'I S(T)
// ============================================================
function EruvchanlikEgriChizigiCanvas() {
  const [harorat, setHarorat] = useState(40) // 0..100°C
  const canvasRef = useRef(null)

  const kno3S = Math.round(13 + 0.023 * harorat * harorat)
  const naclS = Math.round(35 + 0.04 * harorat)
  const caoh2S = (0.18 - 0.001 * harorat).toFixed(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      const ox = w * 0.12
      const oy = h * 0.84
      const gw = w * 0.56
      const gh = h * 0.68

      // O'qlar
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(ox, oy - gh)
      ctx.lineTo(ox, oy)
      ctx.lineTo(ox + gw, oy)
      ctx.stroke()

      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('Harorat T (°C)', ox + gw / 2, oy + 28)
      ctx.textAlign = 'right'
      ctx.fillText('250 g', ox - 8, oy - gh + 8)
      ctx.fillText('100 g', ox - 8, oy - gh * 0.4 + 4)
      ctx.fillText('0', ox - 8, oy + 4)

      // 1. KNO3 egri chizig'i (keskin o'sadi)
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      for (let t = 0; t <= 100; t += 5) {
        const s = 13 + 0.023 * t * t
        const px = ox + (t / 100) * gw
        const py = oy - (Math.min(250, s) / 250) * gh
        if (t === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // 2. NaCl egri chizig'i (deyarli tekis)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let t = 0; t <= 100; t += 10) {
        const s = 35 + 0.04 * t
        const px = ox + (t / 100) * gw
        const py = oy - (s / 250) * gh
        if (t === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // 3. Ca(OH)2 (pastda, kamayadi)
      ctx.strokeStyle = '#f472b6'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(ox, oy - 6)
      ctx.lineTo(ox + gw, oy - 2)
      ctx.stroke()

      // Tanlangan harorat vertikal chizig'i
      const tx = ox + (harorat / 100) * gw
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(tx, oy - gh)
      ctx.lineTo(tx, oy)
      ctx.stroke()
      ctx.setLineDash([])

      const kno3Y = oy - (Math.min(250, kno3S) / 250) * gh
      const naclY = oy - (naclS / 250) * gh
      chizZarracha(ctx, tx, kno3Y, 7, '#facc15', '')
      chizZarracha(ctx, tx, naclY, 7, '#38bdf8', '')

      // O'ng qiymat paneli
      const rx = w * 0.72
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.16, w * 0.24, h * 0.68, 14)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText(`T = ${harorat}°C (100 g H₂O):`, rx + 14, h * 0.26)

      ctx.fillStyle = '#facc15'
      ctx.fillText(`KNO₃: ${kno3S} g ↑↑`, rx + 14, h * 0.42)

      ctx.fillStyle = '#38bdf8'
      ctx.fillText(`NaCl: ${naclS} g (barqaror)`, rx + 14, h * 0.56)

      ctx.fillStyle = '#f472b6'
      ctx.fillText(`Ca(OH)₂: ${caoh2S} g ↓`, rx + 14, h * 0.7)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [harorat, kno3S, naclS, caoh2S])

  return (
    <KorgazmaRamka
      sarlavha="1. Qattiq moddalar eruvchanlik egri chizig‘i S(T)"
      qisqaFormula={`T = ${harorat}°C da KNO₃ = ${kno3S} g / 100 g suv`}
      ikon="grafik"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-yellow-300">
            Suv harorati: {harorat}°C
          </span>
          <input type="range" min={0} max={100} value={harorat} onChange={(e) => setHarorat(Number(e.target.value))} className="flex-1 accent-yellow-400" />
        </div>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            KNO₃: Harorat oshsa eruvchanlik keskin ortadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            NaCl: Harorat oshishi deyarli ta’sir qilmaydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Ca(OH)₂: Harorat oshsa aksincha kamayadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: GAZLAR ERUVCHANLIGI (HARORAT VA BOSIM)
// ============================================================
function GazEruvchanlikCanvas() {
  const [harorat, setHarorat] = useState(15) // 5..60°C
  const [bosim, setBosim] = useState(3) // 1..5 atm
  const canvasRef = useRef(null)

  const eriganGaz = Math.max(4, Math.round((bosim * 6) * (70 - harorat) / 45))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.0025

      chizStakan(ctx, w * 0.28, h * 0.16, w * 0.44, h * 0.66, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.34)',
        tolish: 0.72,
        sarlavha: `CO₂ gazi (T = ${harorat}°C, P = ${bosim} atm)`,
        yorliq: `Suvda erigan gaz: ~${eriganGaz} molekula`,
      })

      // Bosim porsheni
      const porshenY = h * 0.25 + (bosim - 1) * 7
      ctx.fillStyle = '#64748b'
      ctx.fillRect(w * 0.29, porshenY, w * 0.42, 10)
      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Bosim P = ${bosim} atm ↓`, w * 0.5, porshenY - 8)

      // Suvda erigan CO2
      for (let i = 0; i < eriganGaz; i++) {
        const gx = w * 0.32 + ((i * 31 + Math.sin(t + i) * 14) % Math.max(40, w * 0.36))
        const gy = h * 0.42 + ((i * 23 + Math.cos(t + i) * 14) % Math.max(40, h * 0.34))
        chizZarracha(ctx, gx, gy, 5, '#cbd5e1', '')
      }

      // Issiqda gaz pufakchalari uchib chiqadi
      const uchuvchi = Math.round((harorat / 60) * 12)
      for (let u = 0; u < uchuvchi; u++) {
        const ux = w * 0.34 + ((u * 29) % Math.max(30, w * 0.32))
        const uy = h * 0.76 - (((t * 45 + u * 25) % (h * 0.4)))
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ux, uy, 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [harorat, bosim, eriganGaz])

  return (
    <KorgazmaRamka
      sarlavha="2. Gazlar eruvchanligi: Harorat oshsa KAMAYADI, Bosim oshsa ORTADI"
      qisqaFormula={`T↑ → S_gaz↓   |   P↑ → S_gaz↑`}
      ikon="tolqin"
      boshqaruv={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-300 shrink-0">Harorat T: {harorat}°C</span>
            <input type="range" min={5} max={60} value={harorat} onChange={(e) => setHarorat(Number(e.target.value))} className="flex-1 accent-orange-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 shrink-0">Bosim P: {bosim} atm</span>
            <input type="range" min={1} max={5} value={bosim} onChange={(e) => setBosim(Number(e.target.value))} className="flex-1 accent-cyan-400" />
          </div>
        </div>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-orange-300">
            Issiq gazli suv qopqog‘i ochilsa tez ko‘piradi (T↑ → gaz chiqadi)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Qishki sovuq daryolarda baliqlar uchun O₂ ko‘proq eriydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Zavodda CO₂ bosim ostida (3–5 atm) suvga haydaladi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: QAYTA KRISTALLASH (SOVITISH ORQALI TOZALASH)
// ============================================================
function QaytaKristallashCanvas() {
  const [harorat, setHarorat] = useState(80) // 20..80°C
  const canvasRef = useRef(null)

  const maxEruvchan = Math.round(13 + 0.023 * harorat * harorat) // 80°C -> ~160g, 20°C -> ~22g
  const boshlangichTuz = 160
  const chokma = Math.max(0, boshlangichTuz - maxEruvchan)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      chizStakan(ctx, w * 0.28, h * 0.16, w * 0.44, h * 0.66, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.32)',
        tolish: 0.78,
        sarlavha: `100 g suv + 160 g KNO₃ (T = ${harorat}°C)`,
        yorliq: chokma === 0 ? 'Barchasi issiqda to‘liq erigan!' : `${chokma} g sof KNO₃ kristallari ajralib cho‘kdi!`,
      })

      const eriganSoni = Math.min(24, Math.round(maxEruvchan / 7))
      for (let i = 0; i < eriganSoni; i++) {
        const px = w * 0.32 + ((i * 37 + Math.sin(t + i) * 14) % Math.max(40, w * 0.36))
        const py = h * 0.36 + ((i * 25 + Math.cos(t + i) * 14) % Math.max(40, h * 0.34))
        chizZarracha(ctx, px, py, 4.5, '#38bdf8', '')
      }

      const kristallSoni = Math.min(40, Math.round(chokma / 3.5))
      for (let k = 0; k < kristallSoni; k++) {
        const kx = w * 0.31 + ((k * 17) % Math.max(40, w * 0.38))
        const ky = h * 0.78 - (k % 4) * 7
        ctx.fillStyle = '#fde047'
        ctx.fillRect(kx, ky, 8, 8)
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [harorat, maxEruvchan, chokma])

  return (
    <KorgazmaRamka
      sarlavha="3. Qayta kristallash: Issiq eritmani sovitib sof kristall olish"
      qisqaFormula={`80°C (160 g erigan) → ${harorat}°C (${chokma} g kristall tushdi)`}
      ikon="kristall"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-cyan-300">
            Eritmani soviting (80°C → 20°C): {harorat}°C
          </span>
          <input type="range" min={20} max={80} value={harorat} onChange={(e) => setHarorat(Number(e.target.value))} className="flex-1 accent-cyan-400" />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: ERUVCHANLIK SINFLARI (YAXSHI / KAM / ERIMAYDIGAN)
// ============================================================
const ERUVCHANLIK_MODDALAR = [
  { nom: 'Shakar (Saxaroza)', s: '200 g / 100 g suv', sinf: 'Yaxshi eriydigan (> 10 g)', rang: '#34d399', daraja: 1 },
  { nom: 'Osh tuzi (NaCl)', s: '36 g / 100 g suv', sinf: 'Yaxshi eriydigan (> 1 g)', rang: '#38bdf8', daraja: 0.9 },
  { nom: 'Gips (CaSO₄)', s: '0.21 g / 100 g suv', sinf: 'Kam eriydigan (0.01 – 1 g)', rang: '#fbbf24', daraja: 0.35 },
  { nom: 'Kumush xlorid (AgCl)', s: '0.00019 g / 100 g suv', sinf: 'Amalda erimaydigan (< 0.01 g)', rang: '#f87171', daraja: 0.04 },
]

function EruvchanlikSinflariCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const canvasRef = useRef(null)
  const faol = ERUVCHANLIK_MODDALAR[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      chizStakan(ctx, w * 0.14, h * 0.16, w * 0.32, h * 0.66, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.3)',
        tolish: 0.78,
        sarlavha: faol.nom,
        yorliq: faol.sinf,
      })

      const erigan = Math.round(faol.daraja * 20)
      for (let i = 0; i < erigan; i++) {
        const px = w * 0.17 + ((i * 31 + Math.sin(t + i) * 12) % Math.max(30, w * 0.26))
        const py = h * 0.35 + ((i * 23 + Math.cos(t + i) * 12) % Math.max(30, h * 0.38))
        chizZarracha(ctx, px, py, 5, faol.rang, '')
      }
      if (faol.daraja < 0.5) {
        for (let k = 0; k < 16; k++) {
          ctx.fillStyle = faol.rang
          ctx.fillRect(w * 0.17 + ((k * 16) % Math.max(30, w * 0.24)), h * 0.78 - (k % 2) * 6, 7, 7)
        }
      }

      const rx = w * 0.52
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = faol.rang
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.2, w * 0.42, h * 0.56, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText(faol.nom, rx + 20, h * 0.33)
      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`20°C da eruvchanligi: ${faol.s}`, rx + 20, h * 0.48)
      ctx.fillStyle = faol.rang
      ctx.fillText(`Sinfi: ${faol.sinf}`, rx + 20, h * 0.62)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [faol])

  return (
    <KorgazmaRamka
      sarlavha="4. Moddalarning suvda eruvchanlik bo‘yicha 3 sinfi (100 g H₂O da)"
      qisqaFormula={faol.sinf}
      ikon="kristall"
      boshqaruv={
        <>
          {ERUVCHANLIK_MODDALAR.map((m, i) => (
            <button
              key={m.nom}
              type="button"
              onClick={() => { setTanlov(i); tovushChiqar('tasdiq') }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${tanlov === i ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {m.nom}
            </button>
          ))}
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: "O'XSHASH O'XSHASHDA ERIYDI" (SUV VS BENZIN)
// ============================================================
function OxshashOxshashdaCanvas() {
  const [modda, setModda] = useState('tuz') // 'tuz' | 'yog'
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      const tuz = modda === 'tuz'

      // 1-stakan: SUV (qutbli)
      chizStakan(ctx, w * 0.14, h * 0.16, w * 0.3, h * 0.65, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.34)',
        tolish: 0.76,
        sarlavha: 'SUV (Qutbli erituvchi)',
        yorliq: tuz ? 'NaCl to‘liq ERIYDI!' : 'Yog‘ ERIMAYDI (tepaga suzadi)',
      })

      if (tuz) {
        for (let i = 0; i < 16; i++) {
          chizZarracha(ctx, w * 0.18 + ((i * 29) % Math.max(30, w * 0.22)), h * 0.35 + ((i * 21 + Math.sin(t + i) * 10) % Math.max(30, h * 0.38)), 5, '#facc15', '')
        }
      } else {
        ctx.fillStyle = '#facc15'
        ctx.fillRect(w * 0.15, h * 0.29, w * 0.28, 16)
      }

      // 2-stakan: BENZIN (qutbsiz)
      chizStakan(ctx, w * 0.56, h * 0.16, w * 0.3, h * 0.65, {
        suyuqlikRang: 'rgba(168, 85, 247, 0.28)',
        tolish: 0.76,
        sarlavha: 'BENZIN (Qutbsiz erituvchi)',
        yorliq: tuz ? 'NaCl ERIMAYDI (tubga cho‘kadi)' : 'Yog‘ / Yod to‘liq ERIYDI!',
      })

      if (tuz) {
        for (let i = 0; i < 12; i++) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(w * 0.6 + ((i * 19) % Math.max(30, w * 0.22)), h * 0.77 - (i % 2) * 6, 7, 7)
        }
      } else {
        for (let i = 0; i < 16; i++) {
          chizZarracha(ctx, w * 0.6 + ((i * 29) % Math.max(30, w * 0.22)), h * 0.35 + ((i * 21 + Math.cos(t + i) * 10) % Math.max(30, h * 0.38)), 5.5, '#facc15', '')
        }
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [modda])

  return (
    <KorgazmaRamka
      sarlavha="5. Kimyo qoidasi: «O‘xshash o‘xshashda eriydi»"
      qisqaFormula="Qutbli → Qutblida | Qutbsiz → Qutbsizda"
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setModda('tuz'); tovushChiqar('tasdiq') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${modda === 'tuz' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Osh tuzi / Shakar (Qutbli)
          </button>
          <button
            type="button"
            onClick={() => { setModda('yog'); tovushChiqar('tasdiq') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${modda === 'yog' ? 'bg-purple-400 text-slate-950 border-purple-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            O‘simlik yog‘i / Yod (Qutbsiz)
          </button>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: ERUVCHANLIK KOEFFITSIYENTI S O'LCHAGICHI
// ============================================================
function EruvchanlikKoeffitsiyentCanvas() {
  const [mModda, setMModda] = useState(45)
  const [mSuv, setMSuv] = useState(150)
  const canvasRef = useRef(null)

  const S = ((mModda / mSuv) * 100).toFixed(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(w * 0.12, h * 0.16, w * 0.76, h * 0.68, 18)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 18px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('Eruvchanlik koeffitsiyenti (100 g erituvchiga nisbatan):', w * 0.5, h * 0.28)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 22px "Times New Roman", serif'
      ctx.fillText('S = (m_modda / m_suv) · 100 g', w * 0.5, h * 0.42)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Times New Roman", serif'
      ctx.fillText(`S = (${mModda} g / ${mSuv} g) · 100 g = ${S} g / 100 g suv`, w * 0.5, h * 0.57)

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`Demak, 100 g suvda maksimal ${S} g modda eriydi`, w * 0.5, h * 0.72)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [mModda, mSuv, S])

  return (
    <KorgazmaRamka
      sarlavha="6. Eruvchanlik koeffitsiyenti S = (m_modda / m_suv) · 100"
      qisqaFormula={`S = ${S} g / 100 g H₂O`}
      ikon="nizom"
      boshqaruv={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-yellow-300 shrink-0">m(modda): {mModda} g</span>
            <input type="range" min={10} max={120} value={mModda} onChange={(e) => setMModda(Number(e.target.value))} className="flex-1 accent-yellow-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 shrink-0">m(suv): {mSuv} g</span>
            <input type="range" min={50} max={250} value={mSuv} onChange={(e) => setMSuv(Number(e.target.value))} className="flex-1 accent-cyan-400" />
          </div>
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// MAXSUS 1-O'YIN: GRAFIKDAN O'QI (INTERAKTIV SVG GRAFIK)
// ============================================================
const GRAFIK_SAVOLLAR = [
  {
    savol: 'Grafikda 60°C da 100 g suvda necha gramm KNO₃ (sariq chiziq) eriydi?',
    variantlar: ['37 g', '13 g', '246 g', '110 g'],
    togri: 3,
    izoh: '60°C nuqtasidan sariq egri chiziqqa qaraganda KNO₃ eruvchanligi ~110 g ga yetadi.',
  },
  {
    savol: 'Harorat 20°C dan 80°C gacha ko‘tarilganda NaCl (ko‘k chiziq) eruvchanligi qanday o‘zgaradi?',
    variantlar: ['36 g dan 38 g gacha (deyarli o‘zgarmaydi)', '200 g ga ortadi', 'Nolga tushadi', '3 baravar kamayadi'],
    togri: 0,
    izoh: 'NaCl egri chizig‘i deyarli gorizontal — harorat kuchli ta’sir qilmaydi.',
  },
  {
    savol: 'Qaysi haroratda KNO₃ va NaCl ning eruvchanligi taxminan tenglashadi (~36 g)?',
    variantlar: ['100°C da', '~23°C da', '80°C da', '0°C da'],
    togri: 1,
    izoh: 'Sariq va ko‘k chiziqlar taxminan 23°C da kesishadi.',
  },
  {
    savol: '60°C dagi 110 g KNO₃ eritmasini 20°C gacha (32 g) sovitilsa necha gramm tuz kristallanib tushadi?',
    variantlar: ['32 g', '110 g', '78 g (110 − 32)', '142 g'],
    togri: 2,
    izoh: '110 g - 32 g = 78 g ortiqcha tuz kristall holida cho‘kadi.',
  },
]

function GrafikOqishOyini() {
  const [indeks, setIndeks] = useState(0)
  const [ball, setBall] = useState(0)
  const [tanlangan, setTanlangan] = useState(null)
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const joriy = GRAFIK_SAVOLLAR[indeks]
  const aralash = joriy ? indekslanganVariantlarniAralashtir(joriy, raund) : { variantlar: [], togri: 0 }

  const tanla = (v) => {
    if (tanlangan !== null) return
    setTanlangan(v)
    if (v === aralash.togri) {
      tovushChiqar('togri')
      setBall((b) => b + 20)
    } else {
      tovushChiqar('xato')
    }
  }

  const keyingi = () => {
    if (indeks + 1 < GRAFIK_SAVOLLAR.length) {
      setIndeks((i) => i + 1)
      setTanlangan(null)
    } else {
      tovushChiqar('zafar')
      setTugadi(true)
    }
  }

  if (tugadi) {
    return (
      <div className="p-6 rounded-2xl bg-[#050b24] border border-emerald-500/40 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-300">
          <Ikon nom="kubok" olcham={30} />
        </div>
        <h4 className="text-2xl font-extrabold text-white">Grafik O‘qish Sinovi Yakunlandi!</h4>
        <div className="text-3xl font-black text-emerald-400">{ball} / {GRAFIK_SAVOLLAR.length * 20} ball</div>
        <button type="button" onClick={() => { setIndeks(0); setBall(0); setTanlangan(null); setTugadi(false); setRaund((r) => r + 1) }} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold">
          Qayta o‘ynash
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-yellow-300">Eruvchanlik Grafikidan O‘qi ({indeks + 1}/{GRAFIK_SAVOLLAR.length})</span>
        <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-bold">Ball: {ball}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#030712] border border-blue-800/60">
          <svg viewBox="0 0 240 160" className="w-full h-40">
            <line x1="32" y1="12" x2="32" y2="132" stroke="#64748b" strokeWidth="2" />
            <line x1="32" y1="132" x2="224" y2="132" stroke="#64748b" strokeWidth="2" />
            <text x="12" y="24" fill="#cbd5e1" fontSize="9">160g</text>
            <text x="12" y="70" fill="#cbd5e1" fontSize="9">80g</text>
            <text x="12" y="132" fill="#cbd5e1" fontSize="9">0</text>
            <text x="48" y="146" fill="#cbd5e1" fontSize="9">20°C</text>
            <text x="130" y="146" fill="#cbd5e1" fontSize="9">60°C</text>
            <text x="195" y="146" fill="#cbd5e1" fontSize="9">80°C</text>
            {/* NaCl */}
            <path d="M 32 108 L 210 104" stroke="#38bdf8" strokeWidth="3" fill="none" />
            <text x="180" y="96" fill="#38bdf8" fontSize="9" fontWeight="bold">NaCl</text>
            {/* KNO3 */}
            <path d="M 32 124 Q 100 102 180 22" stroke="#facc15" strokeWidth="3" fill="none" />
            <text x="125" y="34" fill="#facc15" fontSize="9" fontWeight="bold">KNO₃</text>
          </svg>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="text-base sm:text-lg font-extrabold text-white">{joriy.savol}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {aralash.variantlar.map((v, vIdx) => (
              <button
                key={v}
                type="button"
                disabled={tanlangan !== null}
                onClick={() => tanla(vIdx)}
                className={`p-3 rounded-xl border text-left font-bold text-sm transition ${
                  tanlangan === null
                    ? 'border-blue-800 bg-[#081236] text-white hover:border-yellow-400'
                    : vIdx === aralash.togri
                    ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200'
                    : tanlangan === vIdx
                    ? 'border-rose-500 bg-rose-500/25 text-rose-200'
                    : 'border-slate-800 bg-slate-950/60 text-slate-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {tanlangan !== null && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 border border-cyan-500/30">
              <span className="text-xs font-semibold text-cyan-200">{joriy.izoh}</span>
              <button type="button" onClick={keyingi} className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-extrabold text-xs">
                Keyingi →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// O'YIN 2 VA 3 DATA (6.5)
// ============================================================
const OYIN2_GURUHLAR = [
  { id: 'ortadi', nom: 'Eruvchanlik ORTADI ↑', tavsif: 'Ko‘proq modda eriydi' },
  { id: 'kamayadi', nom: 'Eruvchanlik KAMAYADI ↓', tavsif: 'Pufakcha/cho‘kma chiqadi' },
]

const OYIN2_SHARTLAR = [
  { nom: 'Suvni isitish (KNO₃ tuzi uchun)', qisqa: 'Qattiq tuz, T↑', guruh: 'ortadi', izoh: 'Aksariyat qattiq moddalarning eruvchanligi harorat oshganda ortadi.' },
  { nom: 'Gazli suv shishasini isitish (CO₂ gazi)', qisqa: 'Gaz, T↑', guruh: 'kamayadi', izoh: 'Harorat oshganda gazlarning suvda eruvchanligi kamayadi.' },
  { nom: 'Suv ustida gaz bosimini oshirish (P↑)', qisqa: 'Gaz, P↑', guruh: 'ortadi', izoh: 'Bosim qancha yuqori bo‘lsa, suvda shuncha ko‘p gaz eriydi.' },
  { nom: 'Yozda ko‘l suvi qizib ketganda O₂ miqdori', qisqa: 'O₂ gazi, T↑', guruh: 'kamayadi', izoh: 'Issiq suvda erigan kislorod kamayadi.' },
  { nom: 'So‘ndirilgan ohak Ca(OH)₂ ni qizdirish', qisqa: 'Istisno asos, T↑', guruh: 'kamayadi', izoh: 'Ca(OH)₂ erishi ekzotermik — qizdirganda eruvchanligi kamayadi.' },
]

const OYIN3_GURUHLAR = [
  { id: 'yaxshi', nom: 'Yaxshi eriydigan (> 1 g)', tavsif: 'Eritmada tiniq eriydi' },
  { id: 'kam', nom: 'Kam eriydigan (0.01–1 g)', tavsif: 'Juda oz eriydi' },
  { id: 'erimaydi', nom: 'Amalda erimaydigan (< 0.01 g)', tavsif: 'Cho‘kma beradi' },
]

const OYIN3_MODDALAR = [
  { nom: 'Osh tuzi (NaCl)', qisqa: '36 g / 100 g suv', guruh: 'yaxshi', izoh: 'Suvda juda yaxshi eriydigan tuz.' },
  { nom: 'Gips (CaSO₄)', qisqa: '0.2 g / 100 g suv', guruh: 'kam', izoh: '0.01 dan 1 g gacha — kam eriydigan tuz.' },
  { nom: 'Kumush xlorid (AgCl)', qisqa: '0.00019 g / 100 g suv', guruh: 'erimaydi', izoh: 'Oq tvorogsimon erimaydigan cho‘kma.' },
  { nom: 'Shakar (Saxaroza)', qisqa: '200 g / 100 g suv', guruh: 'yaxshi', izoh: 'Suvda o‘ta yaxshi eriydi.' },
  { nom: 'Bariy sulfat (BaSO₄)', qisqa: '0.00024 g / 100 g suv', guruh: 'erimaydi', izoh: 'Kislota va suvda ham erimaydigan oq cho‘kma.' },
  { nom: 'Kaliyli selitra (KNO₃)', qisqa: '32 g (20°C) → 246 g (100°C)', guruh: 'yaxshi', izoh: 'Yaxshi eriydigan tuz.' },
]

const DUEL_6_5 = [
  { savol: 'Eruvchanlik koeffitsiyenti odatda necha gramm erituvchiga nisbatan o‘lchanadi?', variantlar: ['10 g suvga', '1000 kg suvga', '1 g suvga', '100 g suvga'], togri: 3, izoh: 'Standart eruvchanlik 100 g suvda erishi mumkin bo‘lgan maksimal modda grammi.' },
  { savol: 'Gazlarning suvda eruvchanligini oshirish uchun nima qilish kerak?', variantlar: ['Suvni sovitish va bosimni oshirish', 'Suvni qaynatish va bosimni tushirish', 'Magnit qo‘yish', 'Shakar solish'], togri: 0, izoh: 'Past harorat va yuqori bosim gaz eruvchanligini oshiradi.' },
  { savol: 'Qaysi tuzning eruvchanligi harorat oshganda keskin ortadi?', variantlar: ['AgCl', 'KNO₃ (kaliy nitrat)', 'NaCl (osh tuzi)', 'CaSO₄ (gips)'], togri: 1, izoh: 'KNO₃ 0°C da 13 g bo‘lsa, 100°C da 246 g gacha eriydi.' },
  { savol: 'Nima uchun yod (I₂) suvda yomon, spirtda esa yaxshi eriydi?', variantlar: ['Spirt magnit xossali', 'Yod gaz holida', '«O‘xshash o‘xshashda eriydi» qoidasiga ko‘ra', 'Yod suvni bug‘latadi'], togri: 2, izoh: 'Qutbsiz moddalar qutbsiz/kam qutbli organik erituvchilarda yaxshi eriydi.' },
  { savol: '100 g suvda 0.01 g dan kam eriydigan modda qanday ataladi?', variantlar: ['Yaxshi eriydigan', 'O‘ta eruvchan', 'Konsentrlangan', 'Amalda erimaydigan'], togri: 3, izoh: 'Masalan AgCl, CaCO₃, BaSO₄.' },
  { savol: 'Issiq to‘yingan KNO₃ eritmasini sovitib toza kristallar olish usuli nima?', variantlar: ['Qayta kristallash', 'Magnitlash', 'Elektroliz', 'Xromatografiya'], togri: 0, izoh: 'Harorat pasayganda ortiqcha tuz sof kristallarga aylanib cho‘kadi.' },
]

export default function Mavzu6_5() {
  const korgazmalar = [
    { nom: '1. Egri chiziq S(T)', ikon: 'grafik', komponent: <EruvchanlikEgriChizigiCanvas /> },
    { nom: '2. Gazlar (T va P)', ikon: 'tolqin', komponent: <GazEruvchanlikCanvas /> },
    { nom: '3. Qayta kristallash', ikon: 'kristall', komponent: <QaytaKristallashCanvas /> },
    { nom: '4. 3 ta Eruvchanlik sinfi', ikon: 'kolba', komponent: <EruvchanlikSinflariCanvas /> },
    { nom: '5. Suv vs Benzin', ikon: 'atom', komponent: <OxshashOxshashdaCanvas /> },
    { nom: '6. S koeffitsiyent', ikon: 'nizom', komponent: <EruvchanlikKoeffitsiyentCanvas /> },
  ]

  const oyinlar = [
    { nom: '1. Grafikdan O‘qi', ikon: 'grafik', komponent: <GrafikOqishOyini /> },
    { nom: '2. Gazlar Qonuni', ikon: 'tolqin', komponent: <GuruhlashOyini nom="Harorat va Bosim Qonuni" ikon="tolqin" guruhlar={OYIN2_GURUHLAR} topshiriqlar={OYIN2_SHARTLAR} /> },
    { nom: '3. Eruvchanlik Jadvali', ikon: 'kristall', komponent: <GuruhlashOyini nom="Eriydimi yoki Cho‘kma?" ikon="kristall" guruhlar={OYIN3_GURUHLAR} topshiriqlar={OYIN3_MODDALAR} /> },
    { nom: '4. Jamoalar Dueli', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="6.5 Eruvchanlik Dueli" savollar={DUEL_6_5} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="6.5"
      mavzuNom="Eruvchanlik"
      oldingiRaqam="6.4"
      oldingiNom="Eritmalar"
      takrorlashSavollar={TAKRORLASH_6_4}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
