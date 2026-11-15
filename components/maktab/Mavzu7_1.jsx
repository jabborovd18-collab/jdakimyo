'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 7-BOB, 7.1-MAVZU
// "Tayanch tushunchalar va asosiy atamalar lug'ati" (Darslik 116-bet)
// 1–6 boblarni qamrovchi 6 ta Canvas Ko'rgazma + 4 ta Katta Takrorlash O'yini
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { kadrSora, kadrniBekorQil, canvasOlchami } from '@/lib/maktab-animatsiya'
import { tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi'
import {
  SmartDarsQobiq,
  KorgazmaRamka,
  chizFonSetka,
  chizStakan,
  chizZarracha,
  TezkorTanlovOyini,
  GuruhlashOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_6_5 = [
  {
    id: '6-5-1',
    savol: 'Harorat oshganda gazlarning (CO₂, O₂) suvda eruvchanligi qanday o‘zgaradi?',
    variantlar: [
      { matn: 'Kamayadi (gaz pufakchalari chiqib ketadi)', togri: true },
      { matn: 'Keskin ortadi', togri: false },
      { matn: 'Hech qachon o‘zgarmaydi', togri: false },
      { matn: 'Gaz qattiq tuzga aylanadi', togri: false },
    ],
    izoh: 'Qattiq tuzlardan farqli o‘laroq, suv isiganida gazlarning eruvchanligi pasayadi.',
  },
  {
    id: '6-5-2',
    savol: '100 g suvda 20°C da 36 g NaCl erisa, bu qaysi eruvchanlik sinfiga kiradi?',
    variantlar: [
      { matn: 'Aerozol', togri: false },
      { matn: 'Yaxshi eriydigan modda (> 1 g)', togri: true },
      { matn: 'Kam eriydigan (0.01–1 g)', togri: false },
      { matn: 'Amalda erimaydigan (< 0.01 g)', togri: false },
    ],
    izoh: '100 g suvda 1 g dan ortiq eriydigan moddalar yaxshi eriydigan hisoblanadi.',
  },
  {
    id: '6-5-3',
    savol: 'Issiq to‘yingan KNO₃ eritmasini sovitish orqali sof kristallar olish usuli nima?',
    variantlar: [
      { matn: 'Ajratish voronkasi', togri: false },
      { matn: 'Aerozollash', togri: false },
      { matn: 'Qayta kristallash', togri: true },
      { matn: 'Magnitlash', togri: false },
    ],
    izoh: 'Harorat tushishi bilan KNO₃ eruvchanligi keskin pasayib, ortiqcha modda toza kristall bo‘lib cho‘kadi.',
  },
]

// ============================================================
// 1-KO'RGAZMA (1-BOB): MODDA VA HODISALAR (FIZIK VS KIMYOVIY)
// ============================================================
function Bob1HodisalarCanvas() {
  const [hodisa, setHodisa] = useState('fizik') // 'fizik' | 'kimyoviy'
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

      const cx = w * 0.5
      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 16px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        hodisa === 'fizik'
          ? '1-BOB • FIZIK HODISA: H₂O(qattiq) → H₂O(suyuq) — Molekula tarkibi O‘ZGARMAYDI!'
          : '1-BOB • KIMYOVIY HODISA: 2H₂ + O₂ → 2H₂O — Yangi modda va yangi bog‘lar hosil bo‘ladi!',
        cx,
        h * 0.16
      )

      // Chap va O'ng taqqoslash qutilari
      const yBox = h * 0.25
      const bw = w * 0.36
      const bh = h * 0.58

      ctx.fillStyle = 'rgba(15,23,42,0.85)'
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(w * 0.08, yBox, bw, bh, 16)
      ctx.roundRect(w * 0.56, yBox, bw, bh, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText('BOSHLANG‘ICH HOLAT', w * 0.08 + bw / 2, yBox + 26)
      ctx.fillText('KEYINGI HOLAT', w * 0.56 + bw / 2, yBox + 26)

      if (hodisa === 'fizik') {
        for (let i = 0; i < 6; i++) {
          const lx = w * 0.14 + (i % 3) * 48
          const ly = yBox + 82 + Math.floor(i / 3) * 52
          chizZarracha(ctx, lx, ly, 10, '#ef4444', 'O')
          chizZarracha(ctx, lx - 10, ly + 8, 5, '#fff', 'H')
          chizZarracha(ctx, lx + 10, ly + 8, 5, '#fff', 'H')

          const rx = w * 0.62 + (i % 3) * 52 + Math.sin(t + i) * 8
          const ry = yBox + 82 + Math.floor(i / 3) * 52 + Math.cos(t + i) * 6
          chizZarracha(ctx, rx, ry, 10, '#ef4444', 'O')
          chizZarracha(ctx, rx - 10, ry + 8, 5, '#fff', 'H')
          chizZarracha(ctx, rx + 10, ry + 8, 5, '#fff', 'H')
        }
      } else {
        // Chapda alohida H2 va O2
        for (let i = 0; i < 3; i++) {
          const lx = w * 0.14 + i * 56
          chizZarracha(ctx, lx, yBox + 80, 9, '#e2e8f0', 'H')
          chizZarracha(ctx, lx + 14, yBox + 80, 9, '#e2e8f0', 'H')
          chizZarracha(ctx, lx, yBox + 135, 11, '#ef4444', 'O')
          chizZarracha(ctx, lx + 18, yBox + 135, 11, '#ef4444', 'O')
        }
        // O'ngda yangi H2O
        for (let i = 0; i < 4; i++) {
          const rx = w * 0.62 + (i % 2) * 82
          const ry = yBox + 85 + Math.floor(i / 2) * 56 + Math.sin(t + i) * 4
          chizZarracha(ctx, rx, ry, 11, '#ef4444', 'O')
          chizZarracha(ctx, rx - 12, ry + 9, 6, '#e2e8f0', 'H')
          chizZarracha(ctx, rx + 12, ry + 9, 6, '#e2e8f0', 'H')
        }
      }

      // Strelka
      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 28px "Times New Roman", serif'
      ctx.fillText('→', w * 0.5, yBox + bh * 0.55)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [hodisa])

  return (
    <KorgazmaRamka
      sarlavha="1-Bob Tayanch: Fizik vs Kimyoviy hodisa (Zarracha darajasida)"
      qisqaFormula={hodisa === 'fizik' ? 'Tarkib o‘zgarmaydi' : 'Yangi modda hosil bo‘ladi'}
      ikon="olov"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setHodisa('fizik'); tovushChiqar('tasdiq') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${hodisa === 'fizik' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Fizik hodisa (Erish / Qaynash)
          </button>
          <button
            type="button"
            onClick={() => { setHodisa('kimyoviy'); tovushChiqar('bosqich') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${hodisa === 'kimyoviy' ? 'bg-orange-400 text-slate-950 border-orange-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Kimyoviy reaksiya (Yonish / Zanglash)
          </button>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA (2-BOB): AGREGAT HOLATLAR VA DIFFUZIYA
// ============================================================
function Bob2AgregatCanvas() {
  const [holat, setHolat] = useState('qattiq') // 'qattiq' | 'suyuq' | 'gaz'
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

      chizStakan(ctx, w * 0.28, h * 0.16, w * 0.44, h * 0.68, {
        suyuqlikRang: holat === 'suyuq' ? 'rgba(56,189,248,0.28)' : 'rgba(15,23,42,0.2)',
        tolish: holat === 'suyuq' ? 0.65 : 0,
        sarlavha: `2-BOB • AGREGAT HOLAT: ${holat.toUpperCase()}`,
        yorliq:
          holat === 'qattiq'
            ? 'Kristall panjara — o‘z joyida tebranadi (aniq shakl & hajm)'
            : holat === 'suyuq'
            ? 'Yaqin joylashgan, sirpanib oqadi (aniq hajm, idish shakli)'
            : 'Katta tezlikda har tomonga tarqaladi — DIFFUZIYA!',
      })

      for (let i = 0; i < 20; i++) {
        let px, py
        if (holat === 'qattiq') {
          px = w * 0.38 + (i % 5) * 32 + Math.sin(t * 4 + i) * 2
          py = h * 0.56 + Math.floor(i / 5) * 24 + Math.cos(t * 4 + i) * 2
        } else if (holat === 'suyuq') {
          px = w * 0.34 + ((i * 39 + Math.sin(t * 1.4 + i) * 26) % Math.max(40, w * 0.32))
          py = h * 0.52 + ((i * 23 + Math.cos(t * 1.4 + i) * 18) % Math.max(30, h * 0.28))
        } else {
          px = w * 0.32 + ((i * 53 + Math.sin(t * 3 + i * 2) * 55) % Math.max(50, w * 0.36))
          py = h * 0.24 + ((i * 41 + Math.cos(t * 3 + i * 2) * 45) % Math.max(50, h * 0.52))
        }
        chizZarracha(ctx, px, py, 8, holat === 'qattiq' ? '#38bdf8' : holat === 'suyuq' ? '#22d3ee' : '#facc15', '')
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [holat])

  return (
    <KorgazmaRamka
      sarlavha="2-Bob Tayanch: Qattiq, Suyuq, Gaz holatlar va Diffuziya"
      qisqaFormula="Muz → Suv → Bug‘ | Diffuziya tezligi: Gaz > Suyuq > Qattiq"
      ikon="harorat"
      boshqaruv={
        <>
          {[
            { id: 'qattiq', nom: 'Qattiq (Kristall)' },
            { id: 'suyuq', nom: 'Suyuq (Oqim)' },
            { id: 'gaz', nom: 'Gaz (Tez diffuziya)' },
          ].map((hItem) => (
            <button
              key={hItem.id}
              type="button"
              onClick={() => { setHolat(hItem.id); tovushChiqar('tasdiq') }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === hItem.id ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {hItem.nom}
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
// 3-KO'RGAZMA (3-BOB): ATOM TUZILISHI VA VALENTLIK FORMULA
// ============================================================
const ELEMENTLAR_3BOB = [
  { belgi: 'H', nom: 'Vodorod', z: 1, val: 'I', rang: '#e2e8f0' },
  { belgi: 'C', nom: 'Uglerod', z: 6, val: 'IV', rang: '#94a3b8' },
  { belgi: 'O', nom: 'Kislorod', z: 8, val: 'II', rang: '#ef4444' },
  { belgi: 'Al', nom: 'Alyuminiy', z: 13, val: 'III', rang: '#38bdf8' },
]

function Bob3AtomCanvas() {
  const [elIdx, setElIdx] = useState(2)
  const canvasRef = useRef(null)
  const el = ELEMENTLAR_3BOB[elIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.0025

      const cx = w * 0.34
      const cy = h * 0.5
      // Orbitalar
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, 55, 0, Math.PI * 2)
      ctx.stroke()
      if (el.z > 2) {
        ctx.beginPath()
        ctx.arc(cx, cy, 92, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Yadro (p+ va n0)
      chizZarracha(ctx, cx, cy, 20, '#f59e0b', `+${el.z}`)

      // Elektronlar (e-)
      const ichki = Math.min(2, el.z)
      for (let i = 0; i < ichki; i++) {
        const ang = t * 1.8 + i * Math.PI
        chizZarracha(ctx, cx + Math.cos(ang) * 55, cy + Math.sin(ang) * 55, 5.5, '#38bdf8', '')
      }
      const tashqi = Math.min(6, Math.max(0, el.z - 2))
      for (let j = 0; j < tashqi; j++) {
        const ang = -t * 1.2 + j * ((Math.PI * 2) / Math.max(1, tashqi))
        chizZarracha(ctx, cx + Math.cos(ang) * 92, cy + Math.sin(ang) * 92, 5.5, '#22d3ee', '')
      }

      const rx = w * 0.58
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.2, w * 0.36, h * 0.6, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 18px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${el.nom} (${el.belgi})`, rx + 20, h * 0.32)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillText(`Tartib raqami (Z = p⁺ = e⁻): ${el.z}`, rx + 20, h * 0.45)
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(`Xarakterli valentligi: ${el.val}`, rx + 20, h * 0.56)
      ctx.fillStyle = '#34d399'
      ctx.fillText('Neytral atomda p⁺ soni = e⁻ soni', rx + 20, h * 0.68)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [el])

  return (
    <KorgazmaRamka
      sarlavha="3-Bob Tayanch: Atom (Yadro p⁺/n⁰ + Elektronlar e⁻) va Valentlik"
      qisqaFormula={`${el.belgi}: Z = ${el.z} | Valentlik = ${el.val}`}
      ikon="yadro"
      boshqaruv={
        <>
          {ELEMENTLAR_3BOB.map((e, i) => (
            <button
              key={e.belgi}
              type="button"
              onClick={() => { setElIdx(i); tovushChiqar('tasdiq') }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${elIdx === i ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {e.belgi} ({e.nom})
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
// 4-KO'RGAZMA (4-BOB): ZICHLIK VA QOTISHMALAR (ρ = m / V)
// ============================================================
function Bob4ZichlikCanvas() {
  const [namuna, setNamuna] = useState(0)
  const canvasRef = useRef(null)

  const jism = [
    { nom: 'Yog‘och (ρ = 0.6 g/cm³)', rho: 0.6, rang: '#d97706', holat: 'SUVDA SUZADI (ρ < 1.0)' },
    { nom: 'Alyuminiy (ρ = 2.7 g/cm³)', rho: 2.7, rang: '#cbd5e1', holat: 'SUVDA CHO‘KADI (ρ > 1.0)' },
    { nom: 'Temir / Po‘lat (ρ = 7.8 g/cm³)', rho: 7.8, rang: '#64748b', holat: 'TEZ CHO‘KADI (ρ > 1.0)' },
    { nom: 'Oltin (ρ = 19.3 g/cm³)', rho: 19.3, rang: '#facc15', holat: 'ENG OG‘IR CHO‘KADI' },
  ][namuna]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      chizStakan(ctx, w * 0.25, h * 0.16, w * 0.5, h * 0.66, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.34)',
        tolish: 0.78,
        sarlavha: `4-BOB • ρ = m / V | Suv zichligi: 1.0 g/cm³`,
        yorliq: `${jism.nom} → ${jism.holat}`,
      })

      const suzadi = jism.rho < 1
      const kubY = suzadi ? h * 0.29 + Math.sin(t * 2) * 4 : h * 0.72
      ctx.fillStyle = jism.rang
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(w * 0.5 - 24, kubY, 48, 36, 6)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${jism.rho}`, w * 0.5, kubY + 22)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [jism])

  return (
    <KorgazmaRamka
      sarlavha="4-Bob Tayanch: Zichlik (ρ = m / V) va Metallar suzuvchanligi"
      qisqaFormula="ρ_jism < 1 → suzadi | ρ_jism > 1 → cho‘kadi"
      ikon="nizom"
      boshqaruv={
        <>
          {['Yog‘och (0.6)', 'Alyuminiy (2.7)', 'Temir (7.8)', 'Oltin (19.3)'].map((n, i) => (
            <button
              key={n}
              type="button"
              onClick={() => { setNamuna(i); tovushChiqar('tasdiq') }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${namuna === i ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {n}
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
// 5-KO'RGAZMA (5-BOB): KISLOTA, ASOS, pH VA NEYTRALLANISH
// ============================================================
function Bob5PhCanvas() {
  const [ph, setPh] = useState(7) // 1..14
  const canvasRef = useRef(null)

  const rang = ph < 4 ? '#ef4444' : ph < 7 ? '#f59e0b' : ph === 7 ? '#22c55e' : ph < 11 ? '#3b82f6' : '#a855f7'
  const muhit = ph < 7 ? 'KISLOTALI MUHIT (H⁺ ko‘p)' : ph === 7 ? 'NEYTRAL MUHIT (H⁺ = OH⁻)' : 'ISHQORIY MUHIT (OH⁻ ko‘p)'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      // pH shkalasi chizig'i
      const sx = w * 0.1
      const sw = w * 0.8
      const sy = h * 0.26
      const grad = ctx.createLinearGradient(sx, 0, sx + sw, 0)
      grad.addColorStop(0, '#ef4444')
      grad.addColorStop(0.35, '#f59e0b')
      grad.addColorStop(0.5, '#22c55e')
      grad.addColorStop(0.75, '#3b82f6')
      grad.addColorStop(1, '#a855f7')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(sx, sy, sw, 26, 12)
      ctx.fill()

      const pinX = sx + ((ph - 1) / 13) * sw
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(pinX, sy + 13, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${ph}`, pinX, sy + 17)

      ctx.fillStyle = rang
      ctx.font = 'bold 20px "Times New Roman", serif'
      ctx.fillText(`5-BOB • pH = ${ph} → ${muhit}`, w * 0.5, h * 0.55)

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText('Neytrallanish: Kislota (HCl) + Asos (NaOH) → Tuz (NaCl) + Suv (H₂O)', w * 0.5, h * 0.72)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [ph, rang, muhit])

  return (
    <KorgazmaRamka
      sarlavha="5-Bob Tayanch: pH Shkalasi (0–14) va Neytrallanish reaksiyasi"
      qisqaFormula={`pH = ${ph} (${ph < 7 ? 'Kislota' : ph === 7 ? 'Neytral' : 'Asos'})`}
      ikon="kolba"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-emerald-300">pH qiymatini o‘zgartiring: {ph}</span>
          <input type="range" min={1} max={14} value={ph} onChange={(e) => setPh(Number(e.target.value))} className="flex-1 accent-emerald-400" />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: 1–6 BOB ATAMALAR LUG'ATI INTERAKTIV KARTALARI
// ============================================================
const ATAMALAR_LUGATI = [
  { bob: '1-bob', atama: 'Kimyoviy hodisa', qisqa: 'Boshlang‘ich moddadan yangi xossali boshqa modda hosil bo‘lishi.' },
  { bob: '2-bob', atama: 'Diffuziya', qisqa: 'Modda molekulalarining issiqlik harakati natijasida o‘z-o‘zidan aralashishi.' },
  { bob: '3-bob', atama: 'Valentlik', qisqa: 'Kimyoviy element atomining boshqa atomlarning ma’lum sonini biriktirib olish xususiyati.' },
  { bob: '4-bob', atama: 'Qotishma', qisqa: 'Ikki yoki undan ortiq metallni (yoki nometall bilan) suyuqlantirib olingan bir jinsli aralashma.' },
  { bob: '5-bob', atama: 'Neytrallanish', qisqa: 'Kislota va asos o‘zaro ta’sirlashib tuz hamda suv hosil qilish reaksiyasi.' },
  { bob: '6-bob', atama: 'Eruvchanlik (S)', qisqa: 'Berilgan haroratda 100 g erituvchida maksimal eriy oladigan modda massasi (g).' },
]

function BoblarLugatKorgazma() {
  const [faolIdx, setFaolIdx] = useState(0)
  const canvasRef = useRef(null)
  const tanlangan = ATAMALAR_LUGATI[faolIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(w * 0.1, h * 0.18, w * 0.8, h * 0.64, 20)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(tanlangan.bob.toUpperCase(), w * 0.5, h * 0.3)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 28px "Times New Roman", serif'
      ctx.fillText(tanlangan.atama, w * 0.5, h * 0.45)

      // Matnni 2 qatorga bo'lish
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px "Times New Roman", serif'
      const sozlar = tanlangan.qisqa.split(' ')
      const yarim = Math.ceil(sozlar.length / 2)
      ctx.fillText(sozlar.slice(0, yarim).join(' '), w * 0.5, h * 0.6)
      ctx.fillText(sozlar.slice(yarim).join(' '), w * 0.5, h * 0.7)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [tanlangan])

  return (
    <KorgazmaRamka
      sarlavha="6. 7-sinf Kimyo Atamalari Interaktiv Lug‘ati (1–6 Bob)"
      qisqaFormula={`${tanlangan.bob}: ${tanlangan.atama}`}
      ikon="kitob"
      boshqaruv={
        <>
          {ATAMALAR_LUGATI.map((a, i) => (
            <button
              key={a.atama}
              type="button"
              onClick={() => { setFaolIdx(i); tovushChiqar('tasdiq') }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold border ${faolIdx === i ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {a.bob}: {a.atama}
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
// YAKUNIY O'YINLAR MA'LUMOTLARI (7.1)
// ============================================================
const OYIN1_ATAMALAR = [
  {
    belgi: '3-Bob • Elementar zarracha',
    savol: 'Atom yadrosidagi musbat (+1) zaryadga ega bo‘lgan va elementning tartib raqamini belgilovchi zarracha nima?',
    variantlar: ['Neytron (n⁰)', 'Elektron (e⁻)', 'Ion', 'Proton (p⁺)'],
    togri: 3,
    izoh: 'Protonlar soni elementning davriy jadvaldagi tartib raqamiga (Z) teng.',
  },
  {
    belgi: '5-Bob • Indikator',
    savol: 'Kislotali muhitda qizil, neytralda binafsha, ishqoriyda ko‘k rangga kiruvchi indikator qaysi?',
    variantlar: ['Lakmus', 'Fenolftalein', 'Kraxmal', 'Osh tuzi'],
    togri: 0,
    izoh: 'Lakmus muhitga qarab qizil (kislota) / ko‘k (ishqor) tusga kiradi.',
  },
  {
    belgi: '6-Bob • Ajratish',
    savol: 'Qaynash harorati turlicha bo‘lgan ikki suyuqlikni (masalan, spirt va suvni) ajratish usuli nima?',
    variantlar: ['Tindirish', 'Haydash (Distillash)', 'Filtrlash', 'Magnitlash'],
    togri: 1,
    izoh: 'Qaynash nuqtasi past modda avval bug‘lanib, sovitkichda kondensatlanadi.',
  },
  {
    belgi: '2-Bob • Agregat o‘zgarish',
    savol: 'Qattiq moddaning suyuqlanmasdan to‘g‘ridan-to‘g‘ri gaz holatiga o‘tishi (masalan, yod yoki quruq muz) nima deyiladi?',
    variantlar: ['Kristallanish', 'Diffuziya', 'Sublimatsiya', 'Kondensatsiya'],
    togri: 2,
    izoh: 'Qattiq → Gaz o‘tishi sublimatsiya deyiladi.',
  },
  {
    belgi: '4-Bob • Qotishmalar',
    savol: 'Qaysi element temir bilan qo‘shilib Po‘lat va Cho‘yan qotishmalarini hosil qiladi?',
    variantlar: ['Natriy (Na)', 'Kislorod (O)', 'Geliy (He)', 'Uglerod (C)'],
    togri: 3,
    izoh: 'Po‘lat (<2% C) va Cho‘yan (>2% C) temir-uglerod qotishmalaridir.',
  },
]

const OYIN2_FORMULALAR = [
  {
    belgi: 'Massa ulushi formulasi',
    savol: 'Eritmada erigan moddaning massa ulushini (%) topish formulasi qaysi?',
    variantlar: ['ω = (m_modda / m_eritma) · 100%', 'ρ = m / V', 'Mr = ΣAr', 'Q = m · c'],
    togri: 0,
    izoh: 'Eritma massasi = m(erituvchi) + m(eruvchi modda).',
  },
  {
    belgi: 'Zichlik formulasi',
    savol: 'Jismning zichligi (g/cm³) qaysi formula bilan hisoblanadi?',
    variantlar: ['V = ρ · m', 'ρ = m / V', 'm = ρ / V', 'ω = V / m'],
    togri: 1,
    izoh: 'Zichlik modda massasining uning hajmiga nisbatidir.',
  },
  {
    belgi: 'Valentlik bo‘yicha formula',
    savol: 'III valentli Alyuminiy va II valentli Kisloroddan tashkil topgan oksidning to‘g‘ri formulasi:',
    variantlar: ['Al₃O₂', 'AlO₂', 'Al₂O₃', 'AlO'],
    togri: 2,
    izoh: 'EKUK(3, 2) = 6 → Al dan 6/3=2 ta, O dan 6/2=3 ta.',
  },
  {
    belgi: 'Nisbiy molekulyar massa',
    savol: 'Sulfat kislotaning (H₂SO₄) nisbiy molekulyar massasi Mr ni hisoblang (H=1, S=32, O=16):',
    variantlar: ['49', '64', '100', '98'],
    togri: 3,
    izoh: 'Mr(H₂SO₄) = 2·1 + 32 + 4·16 = 98.',
  },
]

const OYIN3_GURUHLAR = [
  { id: 'haqiqat', nom: 'TO‘G‘RI KIMYOVIY FIKR', tavsif: 'Ilmiy jihatdan rost' },
  { id: 'xato', nom: 'XATO AFSONA (Fosh et!)', tavsif: 'Bu fikr noto‘g‘ri!' },
]

const OYIN3_AFSONALAR = [
  { nom: 'Suvning qaynashi va bug‘lanishi kimyoviy reaksiyadir', qisqa: '1-bob tekshiruvi', guruh: 'xato', izoh: 'Xato! H₂O molekulalari o‘zgarmaydi — bu fizik hodisa.' },
  { nom: 'Havo tarkibi asosan 78% Azot (N₂) va 21% Kislorod (O₂) dan iborat', qisqa: '6-bob tekshiruvi', guruh: 'haqiqat', izoh: 'To‘g‘ri! Havo gomogen gaz aralashmasidir.' },
  { nom: 'Sho‘r suvni oddiy filtr qog‘ozidan o‘tkazib tuzini ajratish mumkin', qisqa: '6-bob tekshiruvi', guruh: 'xato', izoh: 'Xato! Erigan Na⁺ va Cl⁻ ionlari filtr g‘ovaklaridan o‘tib ketadi.' },
  { nom: 'Kislotali muhitda pH ko‘rsatkichi 7 dan kichik bo‘ladi', qisqa: '5-bob tekshiruvi', guruh: 'haqiqat', izoh: 'To‘g‘ri! pH < 7 — kislotali, pH = 7 — neytral, pH > 7 — ishqoriy.' },
  { nom: 'Harorat oshganda gazlarning suvda eruvchanligi ortadi', qisqa: '6-bob tekshiruvi', guruh: 'xato', izoh: 'Xato! Issiq suvda gazlar eruvchanligi aksincha KAMAYADI.' },
  { nom: 'Neytral atomda protonlar soni elektronlar soniga teng bo‘ladi', qisqa: '3-bob tekshiruvi', guruh: 'haqiqat', izoh: 'To‘g‘ri! Shu sababli atomning umumiy zaryadi 0 ga teng.' },
]

const DUEL_7_1 = [
  { savol: 'Moddalarning tarkibi o‘zgarmasdan faqat shakli yoki agregat holati o‘zgaradigan hodisalar?', variantlar: ['Fizik hodisalar', 'Kimyoviy reaksiyalar', 'Yadro reaksiyalari', 'Neytrallanish'], togri: 0, izoh: 'Fizik hodisalarda yangi modda hosil bo‘lmaydi.' },
  { savol: 'Davriy jadvaldagi barcha elementlarning birinchi guruhiga kiruvchi eng yengil gaz qaysi?', variantlar: ['Xlor (Cl₂)', 'Vodorod (H₂)', 'Kislorod (O₂)', 'Azot (N₂)'], togri: 1, izoh: 'Vodorod (Z=1, Mr=2) — eng yengil gaz.' },
  { savol: 'Ozon (O₃) va Kislorod (O₂) qaysi moddalar guruhiga kiradi?', variantlar: ['Eritmalar', 'Qotishmalar', 'Oddiy moddalar', 'Murakkab moddalar'], togri: 2, izoh: 'Har ikkalasi faqat kislorod atomidan iborat.' },
  { savol: 'pH = 2 bo‘lgan eritmaga NaOH qo‘shib pH ni 7 ga keltirish jarayoni nima?', variantlar: ['Bug‘latish', 'Filtrlash', 'Sublimatsiya', 'Neytrallanish'], togri: 3, izoh: 'Kislota va asosning o‘zaro neytrallash reaksiyasi.' },
  { savol: 'Qum va suv aralashmasini qanday usulda tez ajratish mumkin?', variantlar: ['Filtrlash', 'Bug‘latish', 'Magnitlash', 'Distillash'], togri: 0, izoh: 'Erimaydigan qum filtr qog‘ozida qoladi.' },
  { savol: '10 g shakar 40 g suvda eritildi. Massa ulushi ω necha %?', variantlar: ['40%', '20%', '25%', '10%'], togri: 1, izoh: '10 / (10 + 40) = 10 / 50 = 20%.' },
  { savol: 'Temir (Fe) va Oltingugurt (S) oddiy aralashmasidan Fe ni qaysi asbob ajratib oladi?', variantlar: ['Termometr', 'pH-metr', 'Magnit', 'Filtr qog‘ozi'], togri: 2, izoh: 'Aralashmada Fe o‘z magnit xossasini saqlab qoladi.' },
  { savol: 'Massasi 54 g va hajmi 20 cm³ bo‘lgan alyuminiy bo‘lagining zichligi (g/cm³) nechaga teng?', variantlar: ['27 g/cm³', '1.8 g/cm³', '74 g/cm³', '2.7 g/cm³'], togri: 3, izoh: 'ρ = 54 / 20 = 2.7 g/cm³.' },
]

export default function Mavzu7_1() {
  const korgazmalar = [
    { nom: '1. 1-Bob: Hodisalar', ikon: 'olov', komponent: <Bob1HodisalarCanvas /> },
    { nom: '2. 2-Bob: Agregatlar', ikon: 'harorat', komponent: <Bob2AgregatCanvas /> },
    { nom: '3. 3-Bob: Atom / Val.', ikon: 'yadro', komponent: <Bob3AtomCanvas /> },
    { nom: '4. 4-Bob: Zichlik ρ', ikon: 'nizom', komponent: <Bob4ZichlikCanvas /> },
    { nom: '5. 5-Bob: pH va Tuz', ikon: 'kolba', komponent: <Bob5PhCanvas /> },
    { nom: '6. Atamalar Lug‘ati', ikon: 'kitob', komponent: <BoblarLugatKorgazma /> },
  ]

  const oyinlar = [
    { nom: '1. Atamani Top', ikon: 'quiz', komponent: <TezkorTanlovOyini nom="1–6 Bob Tayanch Atamalari" ikon="quiz" savollar={OYIN1_ATAMALAR} /> },
    { nom: '2. Formulalar Marafoni', ikon: 'grafik', komponent: <TezkorTanlovOyini nom="Kimyoviy Formulalar Marafoni" ikon="grafik" savollar={OYIN2_FORMULALAR} /> },
    { nom: '3. Xatoni Fosh Et', ikon: 'ogohlantirish', komponent: <GuruhlashOyini nom="Haqiqatmi yoki Xato Afsona?" ikon="ogohlantirish" guruhlar={OYIN3_GURUHLAR} topshiriqlar={OYIN3_AFSONALAR} /> },
    { nom: '4. Katta Duel (1 vs 2)', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="7-Sinf Yakuniy Chempionlar Dueli" savollar={DUEL_7_1} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="7.1"
      mavzuNom="Tayanch tushunchalar va asosiy atamalar lug'ati"
      oldingiRaqam="6.5"
      oldingiNom="Eruvchanlik"
      takrorlashSavollar={TAKRORLASH_6_5}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
