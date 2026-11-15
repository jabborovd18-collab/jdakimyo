'use client'
// ============================================================
// JDA KIMYO — 8-SINF, I BOB, 1-§
// "Dastlabki kimyoviy tushuncha va qonunlar" (Darslik 5–10-betlar)
// 6 ta interaktiv Canvas Ko'rgazma + 4 ta Smart-doska O'yini
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { kadrSora, kadrniBekorQil, canvasOlchami } from '@/lib/maktab-animatsiya'
import { tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi'
import {
  SmartDarsQobiq,
  KorgazmaRamka,
  chizFonSetka,
  chizZarracha,
  TezkorTanlovOyini,
  GuruhlashOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'
import { InteraktivSahnaKorgazma } from '@/components/maktab/SmartKimyoSahna'

const TAKRORLASH_7_TAYANCH = [
  {
    id: '7-tayanch-1',
    savol: "Reaksiyada bo'linmaydigan eng kichik zarracha:",
    variantlar: [
      { matn: 'Suspenziya', togri: false },
      { matn: 'Aralashma', togri: false },
      { matn: 'Atom', togri: true },
      { matn: 'Indikator', togri: false },],
    izoh: 'Atom ("atomos") — kimyoviy hodisada saqlanadi.',
  },
  {
    id: '7-tayanch-2',
    savol: 'Murakkab moddani toping:',
    variantlar: [
      { matn: 'Sulfat kislota (H₂SO₄)', togri: true },
      { matn: 'Ozon (O₃)', togri: false },
      { matn: 'Azot (N₂)', togri: false },
      { matn: 'Temir (Fe)', togri: false },],
    izoh: 'H₂SO₄ uch elementdan (H, S, O) tuzilgan.',
  },
  {
    id: '7-tayanch-3',
    savol: 'Neytral suvli muhit pH qiymati:',
    variantlar: [
      { matn: 'pH = 1', togri: false },
      { matn: 'pH = 12', togri: false },
      { matn: 'pH = 0', togri: false },
      { matn: 'pH = 7', togri: true },],
    izoh: 'pH < 7 kislotali, pH = 7 neytral, pH > 7 ishqoriy.',
  },
  {
    id: '7-tayanch-4',
    savol: 'Bir xil yadro zaryadli atomlar turi:',
    variantlar: [
      { matn: 'Kristall panjara', togri: false },
      { matn: 'Kimyoviy element', togri: true },
      { matn: 'Erituvchi', togri: false },
      { matn: 'Emulsiya', togri: false },],
    izoh: 'Element — yadro zaryadi bir xil atomlar turi.',
  },
  {
    id: '7-tayanch-5',
    savol: 'Kislorodning odatiy valentligi:',
    variantlar: [
      { matn: 'IV valentli', togri: false },
      { matn: 'II valentli', togri: true },
      { matn: 'I valentli', togri: false },
      { matn: 'V valentli', togri: false },],
    izoh: 'H doim I, O aksariyat II valentli.',
  },
]

// ============================================================
// 1-KO'RGAZMA: ATOMNING ABSOLUT VA NISBIY MASSASI (1 m.a.b.)
// ============================================================
const ELEMENT_MASSALAR = [
  { belgi: 'H', nom: 'Vodorod', absolut: '1,67 × 10⁻²⁴ g', ar: 1, rang: '#38bdf8' },
  { belgi: 'C', nom: 'Uglerod (¹²C)', absolut: '19,93 × 10⁻²⁴ g', ar: 12, rang: '#facc15' },
  { belgi: 'O', nom: 'Kislorod', absolut: '2,657 × 10⁻²³ g', ar: 16, rang: '#f43f5e' },
  { belgi: 'S', nom: 'Oltingugurt', absolut: '5,31 × 10⁻²³ g', ar: 32, rang: '#fde047' },
]

function NisbiyAtomMassaCanvas() {
  const canvasRef = useRef(null)
  const [tanlov, setTanlov] = useState(2)
  const el = ELEMENT_MASSALAR[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr
    let t = 0

    const chiz = () => {
      t += 0.025
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        `Etalon: 1 m.a.b. = 1/12 m(¹²C) = 1,66 × 10⁻²⁴ g  |  Ar(${el.belgi}) = ${el.ar}`,
        w / 2,
        28
      )

      // Tarozi ustuni va muvozanat chizig'i
      const cx = w / 2
      const baseY = h - 42
      const pivotY = h * 0.42

      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(cx, baseY)
      ctx.lineTo(cx, pivotY)
      ctx.stroke()

      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.roundRect(cx - 80, baseY - 12, 160, 18, 6)
      ctx.fill()

      const ogish = Math.sin(t * 2) * 0.025
      const span = Math.min(w * 0.34, 210)
      const lx = cx - span * Math.cos(ogish)
      const ly = pivotY - span * Math.sin(ogish)
      const rx = cx + span * Math.cos(ogish)
      const ry = pivotY + span * Math.sin(ogish)

      ctx.strokeStyle = '#eab308'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(lx, ly)
      ctx.lineTo(rx, ry)
      ctx.stroke()

      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.arc(cx, pivotY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Chap palla: 1 ta tanlangan atom
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(lx, ly)
      ctx.lineTo(lx - 44, ly + 72)
      ctx.lineTo(lx + 44, ly + 72)
      ctx.closePath()
      ctx.stroke()

      chizZarracha(ctx, lx, ly + 52, Math.min(28, 13 + Math.sqrt(el.ar) * 2.2), el.rang, el.belgi)
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(`1 ta ${el.nom} atomi`, lx, ly + 96)
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(`m = ${el.absolut}`, lx, ly + 115)

      // O'ng palla: el.ar ta 1 m.a.b. toshcha
      ctx.strokeStyle = '#94a3b8'
      ctx.beginPath()
      ctx.moveTo(rx, ry)
      ctx.lineTo(rx - 58, ry + 72)
      ctx.lineTo(rx + 58, ry + 72)
      ctx.closePath()
      ctx.stroke()

      const cols = Math.min(8, Math.ceil(Math.sqrt(el.ar * 2)))
      for (let i = 0; i < el.ar; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        const px = rx - (cols - 1) * 6 + col * 12
        const py = ry + 64 - row * 12
        ctx.fillStyle = '#fde047'
        ctx.beginPath()
        ctx.arc(px, py, 4.5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(`${el.ar} dona (1 m.a.b.) etalon`, rx, ry + 96)
      ctx.fillStyle = '#34d399'
      ctx.fillText(`Ar(${el.belgi}) = m / 1,66·10⁻²⁴ = ${el.ar}`, rx, ry + 115)

      // Quyi ta'rif paneli
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(24, h - 94, w - 48, 38, 10)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#bae6fd'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(`Ar(${el.belgi}) = m(${el.belgi}) / (1/12 m(¹²C)) = ${el.ar}`, w / 2, h - 70)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [el])

  return (
    <KorgazmaRamka
      sarlavha="1. Atomning absolut va nisbiy massasi (Ar, m.a.b.)"
      qisqaFormula={`1 m.a.b. = 1,66·10⁻²⁴ g`}
      ikon="nizom"
      boshqaruv={
        <>
          {ELEMENT_MASSALAR.map((item, idx) => (
            <button
              key={item.belgi}
              type="button"
              onClick={() => {
                setTanlov(idx)
                tovushChiqar('tasdiq')
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm border transition ${
                tanlov === idx
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-yellow-400/50'
              }`}
            >
              {item.belgi} ({item.nom}, Ar={item.ar})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Absolut massa: {el.absolut}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Ar({el.belgi}) = {el.ar} (birliksiz)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            M({el.belgi}) = {el.ar} g/mol
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: KIMYOVIY FORMULA VA Mr / MOLYAR MASSA
// ============================================================
const FORMULALAR_MR = [
  {
    formula: 'H₂SO₄',
    nom: 'Sulfat kislota',
    atomlar: [
      { belgi: 'H', soni: 2, ar: 1, rang: '#38bdf8' },
      { belgi: 'S', soni: 1, ar: 32, rang: '#facc15' },
      { belgi: 'O', soni: 4, ar: 16, rang: '#f43f5e' },
    ],
    hisob: '1·2 + 32 + 16·4 = 98',
    mr: 98,
  },
  {
    formula: 'CaCO₃',
    nom: 'Ohaktosh (Marmar, Bo\'r)',
    atomlar: [
      { belgi: 'Ca', soni: 1, ar: 40, rang: '#a855f7' },
      { belgi: 'C', soni: 1, ar: 12, rang: '#94a3b8' },
      { belgi: 'O', soni: 3, ar: 16, rang: '#f43f5e' },
    ],
    hisob: '40 + 12 + 16·3 = 100',
    mr: 100,
  },
  {
    formula: '(CuOH)₂CO₃',
    nom: 'Malaxit (Asosli tuz)',
    atomlar: [
      { belgi: 'Cu', soni: 2, ar: 64, rang: '#ea580c' },
      { belgi: 'O', soni: 5, ar: 16, rang: '#f43f5e' },
      { belgi: 'H', soni: 2, ar: 1, rang: '#38bdf8' },
      { belgi: 'C', soni: 1, ar: 12, rang: '#94a3b8' },
    ],
    hisob: '64·2 + 16·5 + 1·2 + 12 = 222',
    mr: 222,
  },
  {
    formula: 'FeSO₄·7H₂O',
    nom: 'Temir kuporosi (Kristallogidrat)',
    atomlar: [
      { belgi: 'Fe', soni: 1, ar: 56, rang: '#34d399' },
      { belgi: 'S', soni: 1, ar: 32, rang: '#facc15' },
      { belgi: 'O', soni: 11, ar: 16, rang: '#f43f5e' },
      { belgi: 'H', soni: 14, ar: 1, rang: '#38bdf8' },
    ],
    hisob: '152 + 7·18 = 278',
    mr: 278,
  },
]

function KimyoviyFormulaMrCanvas() {
  const canvasRef = useRef(null)
  const [indeks, setIndeks] = useState(0)
  const f = FORMULALAR_MR[indeks]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr
    let t = 0

    const chiz = () => {
      t += 0.03
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 24px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${f.formula} — ${f.nom}`, w / 2, 40)

      // Har bir element ulushini blok va atom sharcha sifatida chizish
      const n = f.atomlar.length
      const boxW = Math.min(170, (w - 80) / n - 12)
      const totalW = n * boxW + (n - 1) * 14
      const startX = (w - totalW) / 2
      const boxY = 74

      f.atomlar.forEach((a, i) => {
        const bx = startX + i * (boxW + 14)
        const mass = a.soni * a.ar
        const foiz = ((mass / f.mr) * 100).toFixed(1)

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.strokeStyle = a.rang
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(bx, boxY, boxW, 175, 16)
        ctx.fill()
        ctx.stroke()

        const bobY = boxY + 46 + Math.sin(t + i) * 4
        chizZarracha(ctx, bx + boxW / 2, bobY, 22, a.rang, a.belgi)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.fillText(`${a.soni} ta atom`, bx + boxW / 2, boxY + 96)

        ctx.fillStyle = '#cbd5e1'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(`Ar = ${a.ar}`, bx + boxW / 2, boxY + 120)

        ctx.fillStyle = '#fde047'
        ctx.fillText(`${a.soni}×${a.ar} = ${mass}`, bx + boxW / 2, boxY + 142)

        ctx.fillStyle = '#34d399'
        ctx.fillText(`w = ${foiz}%`, bx + boxW / 2, boxY + 163)
      })

      // Hisoblash paneli
      ctx.fillStyle = 'rgba(6, 18, 48, 0.92)'
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(28, h - 98, w - 56, 70, 14)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 16px "Times New Roman", serif'
      ctx.fillText(`Mr(${f.formula}) = ${f.hisob}`, w / 2, h - 68)
      ctx.fillStyle = '#4ade80'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`1 mol ${f.formula} = 6,02·10²³ ta = ${f.mr} g  (M = ${f.mr} g/mol)`, w / 2, h - 42)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [f])

  return (
    <KorgazmaRamka
      sarlavha="2. Kimyoviy formula: sifat, miqdor tarkib va Mr hisoblash"
      qisqaFormula={`Mr = ${f.mr}, M = ${f.mr} g/mol`}
      ikon="formula"
      boshqaruv={
        <>
          {FORMULALAR_MR.map((item, i) => (
            <button
              key={item.formula}
              type="button"
              onClick={() => {
                setIndeks(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm border transition ${
                indeks === i
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-cyan-400/50'
              }`}
            >
              {item.formula}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Sifat tarkibi: {f.atomlar.map((a) => a.belgi).join(', ')} elementlari
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Jami atomlar: {f.atomlar.reduce((s, a) => s + a.soni, 0)} ta
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Molyar massa: M = {f.mr} g/mol
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: MODDA MIQDORI (N = m/M) VA AVOGADRO SONI
// ============================================================
const MOL_NAMUNALAR = [
  { nom: 'H₂SO₄ (Sulfat kislota)', M: 98, defaultN: 0.5, izoh: 'Darslik 9-bet: 49 g H₂SO₄ = 0,5 mol' },
  { nom: 'CuO (Mis (II)-oksid)', M: 80, defaultN: 5.0, izoh: 'Darslik 9-bet: 5 mol CuO = 400 g' },
  { nom: 'O (Kislorod atomlari)', M: 16, defaultN: 0.05, izoh: 'Darslik 6-bet: 0,301·10²³ ta O atomi = 0,05 mol = 0,8 g' },
  { nom: 'HNO₃ (Nitrat kislota)', M: 63, defaultN: 0.2, izoh: 'Darslik 10-bet: 12,6 g HNO₃ = 0,2 mol' },
  { nom: 'SiO₂ (Oq qum)', M: 60, defaultN: 2.5, izoh: 'Darslik 10-bet: 2,5 mol SiO₂ = 150 g' },
]

function MolAvogadroTarozisiCanvas() {
  const canvasRef = useRef(null)
  const [mIdx, setMIdx] = useState(0)
  const [mol, setMol] = useState(0.5)
  const modda = MOL_NAMUNALAR[mIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr
    let t = 0

    const chiz = () => {
      t += 0.03
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      const massa = +(mol * modda.M).toFixed(2)
      const zarracha = +(mol * 6.02).toFixed(3)

      // 3 ta bog'lovchi karta: m (g) <--> n (mol) <--> N (zarra)
      const cardW = Math.min(200, (w - 110) / 3)
      const midY = h * 0.42
      const leftX = w * 0.18 - cardW / 2
      const cenX = w * 0.5 - cardW / 2
      const rightX = w * 0.82 - cardW / 2

      // Yo'nalish o'qlari
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(leftX + cardW + 4, midY)
      ctx.lineTo(cenX - 4, midY)
      ctx.moveTo(cenX + cardW + 4, midY)
      ctx.lineTo(rightX - 4, midY)
      ctx.stroke()

      // Kartalar
      const kartalar = [
        { x: leftX, sar: 'MASSA (m)', qiymat: `${massa} g`, past: 'm = n · M', rang: '#facc15' },
        { x: cenX, sar: 'MODDA MIQDORI (n)', qiymat: `${mol} mol`, past: `M = ${modda.M} g/mol`, rang: '#4ade80' },
        { x: rightX, sar: 'ZARRALAR (N)', qiymat: `${zarracha}·10²³`, past: 'N = n · 6,02·10²³', rang: '#38bdf8' },
      ]

      kartalar.forEach((k) => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
        ctx.strokeStyle = k.rang
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.roundRect(k.x, midY - 62, cardW, 124, 16)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#94a3b8'
        ctx.font = 'bold 12px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(k.sar, k.x + cardW / 2, midY - 34)

        ctx.fillStyle = k.rang
        ctx.font = 'bold 22px "Times New Roman", serif'
        ctx.fillText(k.qiymat, k.x + cardW / 2, midY + 4)

        ctx.fillStyle = '#e2e8f0'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(k.past, k.x + cardW / 2, midY + 38)
      })

      // Yuqori formula sarlavhasi
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 19px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${modda.nom}  •  M = ${modda.M} g/mol`, w / 2, 36)

      // Harakatlanuvchi molekulalar vizualizatori (miqdorga mos)
      const dotCount = Math.max(2, Math.min(28, Math.round(mol * 5)))
      for (let i = 0; i < dotCount; i++) {
        const px = 60 + ((i * 57) % (w - 120)) + Math.sin(t + i) * 6
        const py = h - 78 + Math.cos(t * 1.2 + i) * 10
        chizZarracha(ctx, px, py, 8, '#38bdf8')
      }

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(modda.izoh, w / 2, h - 22)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [modda, mol])

  return (
    <KorgazmaRamka
      sarlavha="3. Modda miqdori (n), massa (m) va Avogadro doimiysi"
      qisqaFormula={`n = m / M = ${mol} mol`}
      ikon="tanga"
      boshqaruv={
        <>
          {MOL_NAMUNALAR.map((m, i) => (
            <button
              key={m.nom}
              type="button"
              onClick={() => {
                setMIdx(i)
                setMol(m.defaultN)
                tovushChiqar('tasdiq')
              }}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm border transition ${
                mIdx === i
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-emerald-400/50'
              }`}
            >
              {m.nom.split(' ')[0]}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs sm:text-sm font-bold text-yellow-300">n = {mol} mol</span>
            <input
              type="range"
              min={0.05}
              max={5}
              step={0.05}
              value={mol}
              onChange={(e) => setMol(Number(e.target.value))}
              className="accent-yellow-400 cursor-pointer w-36"
            />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Massa: m = n·M = {(mol * modda.M).toFixed(2)} g
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Avogadro doimiysi: Nₐ = 6,02 × 10²³ mol⁻¹
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Soni: N = {(mol * 6.02).toFixed(3)} × 10²³ ta
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: VALENTLIK VA EKUB ALGORITMI (8-BET)
// ============================================================
const VALENTLIK_VARIANTLAR = [
  {
    id: 'p2o5',
    tugma: 'P(V) → P₂O₅',
    formula: 'P(V) + O(II) → EKUB(5,2)=10 → P₂O₅',
    tur: 'hisob',
    cfg: {
      sarlavha: 'EKUB usulida formula tuzish: Fosfor (V)-oksid (8-bet)',
      tenglama: 'P(V) va O(II)  →  EKUB(5, 2) = 10  →  P₂O₅',
      qadamlar: [
        { belgi: '1. Valentlik', natija: 'P(V), O(II)', izoh: 'O doim II', rang: '#38bdf8' },
        { belgi: '2. EKUB', natija: 'EKUB(5, 2) = 10', izoh: 'Umumiy valentlik', rang: '#fde047' },
        { belgi: '3. Indeks P', natija: '10 : 5 = 2', izoh: 'P₂', rang: '#c084fc' },
        { belgi: '4. Indeks O', natija: '10 : 2 = 5', izoh: 'O₅ → P₂O₅', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'P jami (2×5)', foiz: 50, qiymat: '10', rang: '#c084fc' },
        { nom: 'O jami (5×2)', foiz: 50, qiymat: '10', rang: '#34d399' },
      ],
      javobBadge: 'Tayyor formula: P₂O₅',
    },
    pastki: ['EKUB(5, 2) = 10', '2×5 = 5×2 = 10', 'Fosfor (V)-oksid'],
  },
  {
    id: 'cro3',
    tugma: 'Cr(VI) → CrO₃',
    formula: 'Cr(VI) + O(II) → EKUB(6,2)=6 → CrO₃',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Xrom (VI)-oksid formulasini tuzish (9-bet mashq)',
      tenglama: 'Cr(VI) va O(II)  →  EKUB(6, 2) = 6  →  CrO₃',
      qadamlar: [
        { belgi: '1. Valentlik', natija: 'Cr(VI), O(II)', izoh: 'Yuqori VI', rang: '#fb7185' },
        { belgi: '2. EKUB', natija: 'EKUB(6, 2) = 6', izoh: 'Eng kichik karrali', rang: '#fde047' },
        { belgi: '3. Indeks', natija: 'Cr: 6:6=1 • O: 6:2=3', izoh: 'CrO₃', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Cr (1×6)', foiz: 50, qiymat: '6', rang: '#fb7185' },
        { nom: 'O (3×2)', foiz: 50, qiymat: '6', rang: '#38bdf8' },
      ],
      javobBadge: 'Formula: CrO₃ (kislotali)',
    },
    pastki: ['EKUB(6, 2) = 6', 'Cr(III)→Cr₂O₃, Cr(VI)→CrO₃', 'Valentliklar teng: 6=6'],
  },
  {
    id: 'cl2o7',
    tugma: 'Cl(VII) → Cl₂O₇',
    formula: 'Cl(VII) + O(II) → EKUB(7,2)=14 → Cl₂O₇',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Xlor (VII)-oksid formulasini tuzish (8–9-bet)',
      tenglama: 'Cl(VII) va O(II)  →  EKUB(7, 2) = 14  →  Cl₂O₇',
      qadamlar: [
        { belgi: '1. Valentlik', natija: 'Cl(VII), O(II)', izoh: 'Maksimal VII', rang: '#38bdf8' },
        { belgi: '2. EKUB', natija: 'EKUB(7, 2) = 14', izoh: 'O\'zaro tub', rang: '#fde047' },
        { belgi: '3. Indeks', natija: 'Cl: 14:7=2 • O: 14:2=7', izoh: 'Cl₂O₇', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Cl (2×7)', foiz: 50, qiymat: '14', rang: '#38bdf8' },
        { nom: 'O (7×2)', foiz: 50, qiymat: '14', rang: '#34d399' },
      ],
      javobBadge: 'Formula: Cl₂O₇',
    },
    pastki: ['EKUB(7, 2) = 14', 'Cr₂O₃, PbO₂, B₂O₃, SeO₃ xuddi shunday', 'Oksid → kislota HClO₄'],
  },
  {
    id: 'seo3',
    tugma: 'Se(VI), Pb(IV), B(III)',
    formula: 'Se(VI)→SeO₃ • Pb(IV)→PbO₂ • B(III)→B₂O₃',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Darslik 9-bet mashq: bir necha oksidlar formulasi',
      tenglama: 'Se(VI) → SeO₃   •   Pb(IV) → PbO₂   •   B(III) → B₂O₃',
      qadamlar: [
        { belgi: 'Se(VI) + O(II)', natija: 'EKUB = 6 → SeO₃', izoh: '6:6=1, 6:2=3', rang: '#fb7185' },
        { belgi: 'Pb(IV) + O(II)', natija: 'EKUB = 4 → PbO₂', izoh: '4:4=1, 4:2=2', rang: '#fde047' },
        { belgi: 'B(III) + O(II)', natija: 'EKUB = 6 → B₂O₃', izoh: '6:3=2, 6:2=3', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'B₂O₃ indeksi (B:O)', foiz: 40, qiymat: '2 : 3', rang: '#38bdf8' },
        { nom: 'SeO₃ indeksi (Se:O)', foiz: 75, qiymat: '1 : 3', rang: '#fb7185' },
      ],
      javobBadge: 'SeO₃, PbO₂, B₂O₃',
    },
    pastki: ['Se(VI) → SeO₃', 'Pb(IV) → PbO₂', 'B(III) → B₂O₃'],
  },
]

function ValentlikFormulaCanvas() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Valentlik asosida formula tuzish (EKUB, 8–9-b)"
      ikon="chaqmoq"
      variantlar={VALENTLIK_VARIANTLAR}
    />
  )
}

// ============================================================
// 5-KO'RGAZMA: MASSA SAQLANISH QONUNI (YOPIQ KOLBADA)
// ============================================================
const REAKSIYALAR_SAQLANISH = [
  { tenglama: '2Cu + O₂ → 2CuO', m1: 128, m2: 32, mahsulot: '160 g CuO', rang: '#ea580c' },
  { tenglama: '4P + 5O₂ → 2P₂O₅', m1: 124, m2: 160, mahsulot: '284 g P₂O₅', rang: '#facc15' },
  { tenglama: 'Fe + S → FeS', m1: 56, m2: 32, mahsulot: '88 g FeS', rang: '#34d399' },
]

function MassaSaqlanishCanvas() {
  const canvasRef = useRef(null)
  const [rIdx, setRIdx] = useState(0)
  const [bajarildi, setBajarildi] = useState(false)
  const r = REAKSIYALAR_SAQLANISH[rIdx]
  const jami = r.m1 + r.m2

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr
    let t = 0

    const chiz = () => {
      t += 0.04
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 20px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(r.tenglama, w / 2, 36)

      // Ikkita yopiq kolba yonma-yon
      const cx1 = w * 0.3
      const cx2 = w * 0.7
      const kolbaY = h * 0.25

      ;[
        { cx: cx1, nom: `Reaksiyadan oldin: ${r.m1} g + ${r.m2} g`, m: `${jami} g`, birikkan: false },
        { cx: cx2, nom: `Reaksiyadan keyin: ${r.mahsulot}`, m: `${jami} g`, birikkan: bajarildi },
      ].forEach((k, idx) => {
        ctx.strokeStyle = idx === 1 && !bajarildi ? '#475569' : '#38bdf8'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(k.cx, kolbaY + 115, 76, 0, Math.PI * 2)
        ctx.stroke()

        // Po'kak tiqin (yopiq tizim)
        ctx.fillStyle = '#92400e'
        ctx.fillRect(k.cx - 16, kolbaY + 26, 32, 18)

        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI * 2 * i) / 6 + t * 0.5
          const rad = k.birikkan ? 18 : 38
          const x = k.cx + Math.cos(ang) * rad
          const y = kolbaY + 115 + Math.sin(ang) * rad
          chizZarracha(ctx, x, y, 10, r.rang)
          if (k.birikkan) {
            chizZarracha(ctx, x + 13, y, 8, '#f43f5e')
          } else {
            chizZarracha(
              ctx,
              k.cx + Math.cos(ang + 1.8) * 44,
              kolbaY + 115 + Math.sin(ang + 1.8) * 44,
              8,
              '#f43f5e'
            )
          }
        }

        // Elektron tarozi ekrani
        ctx.fillStyle = '#0f172a'
        ctx.strokeStyle = '#34d399'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(k.cx - 72, kolbaY + 200, 144, 34, 8)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#4ade80'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.fillText(idx === 1 && !bajarildi ? 'Qizdirish kutilmoqda' : `Tarozi: ${k.m}`, k.cx, kolbaY + 222)

        ctx.fillStyle = '#cbd5e1'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(k.nom, k.cx, kolbaY + 16)
      })

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [r, jami, bajarildi])

  return (
    <KorgazmaRamka
      sarlavha="5. Moddalar massasining saqlanish qonuni (M.V. Lomonosov)"
      qisqaFormula={`${r.m1} g + ${r.m2} g = ${jami} g`}
      ikon="olmos"
      boshqaruv={
        <>
          {REAKSIYALAR_SAQLANISH.map((item, i) => (
            <button
              key={item.tenglama}
              type="button"
              onClick={() => {
                setRIdx(i)
                setBajarildi(false)
                tovushChiqar('tasdiq')
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition ${
                rIdx === i
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-cyan-400/50'
              }`}
            >
              {item.tenglama}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setBajarildi((b) => !b)
              tovushChiqar('togri')
            }}
            className="ml-auto px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm"
          >
            {bajarildi ? 'Qayta tiklash' : 'Yopiq idishda qizdirish'}
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Reagentlar massasi = Mahsulotlar massasi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Atomlar yo&apos;qolmaydi, faqat qayta birikadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Jami massa: {jami} g = {jami} g
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: VODORODLI BIRIKMALAR VALENTLIGI (9-BET MASHQ)
// ============================================================
const VODORODLI_BIRIKMALAR = [
  { formula: 'RbH', el: 'Rb', nom: 'Rubidiy gidrid', val: 1, rim: 'I' },
  { formula: 'CaH₂', el: 'Ca', nom: 'Kalsiy gidrid', val: 2, rim: 'II' },
  { formula: 'NH₃', el: 'N', nom: 'Ammiak', val: 3, rim: 'III' },
  { formula: 'BH₃', el: 'B', nom: 'Bor gidrid (boran)', val: 3, rim: 'III' },
  { formula: 'SiH₄', el: 'Si', nom: 'Silan', val: 4, rim: 'IV' },
  { formula: 'H₂S', el: 'S', nom: 'Vodorod sulfid', val: 2, rim: 'II' },
]

function VodorodliValentlikCanvas() {
  const canvasRef = useRef(null)
  const [vIdx, setVIdx] = useState(2)
  const v = VODORODLI_BIRIKMALAR[vIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr
    let t = 0

    const chiz = () => {
      t += 0.03
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      const cx = w / 2
      const cy = h * 0.48
      const r = 95

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 20px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${v.formula} — ${v.nom} (${v.el} ning valentligi: ${v.rim})`, cx, 36)

      for (let i = 0; i < v.val; i++) {
        const ang = (Math.PI * 2 * i) / v.val - Math.PI / 2
        const hx = cx + Math.cos(ang) * r
        const hy = cy + Math.sin(ang) * r + Math.sin(t + i) * 3

        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(hx, hy)
        ctx.stroke()

        chizZarracha(ctx, hx, hy, 20, '#38bdf8', 'H')
      }

      chizZarracha(ctx, cx, cy, 34, '#a855f7', v.el)

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`H = I valentli → ${v.el} ga ${v.val} bog' → Valentlik: ${v.rim}`, cx, h - 28)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [v])

  return (
    <KorgazmaRamka
      sarlavha="6. Formuladan element valentligi (9-bet)"
      qisqaFormula={`${v.formula} → ${v.el}(${v.rim})`}
      ikon="atom"
      boshqaruv={
        <>
          {VODORODLI_BIRIKMALAR.map((item, i) => (
            <button
              key={item.formula}
              type="button"
              onClick={() => {
                setVIdx(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm border transition ${
                vIdx === i
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-emerald-400/50'
              }`}
            >
              {item.formula}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            1 bog&apos; = I valentlik
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            {v.el} valentligi: {v.rim}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            9-bet mustaqil mashq
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// O'YINLAR (MUVOZANATLASHTIRILGAN VA QISQARTIRILGAN)
// ============================================================
const OYIN1_GURUHLAR = [
  { id: 'mol', nom: 'Miqdor va Massa', tavsif: 'n, M, Ar, Mr, Nₐ' },
  { id: 'tuzilish', nom: 'Atom va Formula', tavsif: 'Atom, element, valentlik' },
]

const OYIN1_NAMUNALAR = [
  { nom: '1 mol (6,02·10²³ ta)', qisqa: 'Avogadro miqdori', guruh: 'mol', izoh: 'Modda miqdori birligi: mol.' },
  { nom: 'Valentlik', qisqa: 'Rim raqami (I–VII)', guruh: 'tuzilish', izoh: 'Atomning bog\'lanish qobiliyati.' },
  { nom: '1 m.a.b. = 1,66·10⁻²⁴ g', qisqa: '¹²C ning 1/12 qismi', guruh: 'mol', izoh: 'Atom massa o\'lchov etaloni.' },
  { nom: 'Kimyoviy formula', qisqa: 'Sifat va miqdor tarkib', guruh: 'tuzilish', izoh: 'Belgi va indekslar yozuvi.' },
  { nom: 'Molyar massa M', qisqa: 'g/mol (son = Mr)', guruh: 'mol', izoh: '1 mol modda massasi.' },
  { nom: 'Kimyoviy element', qisqa: 'Bir xil atomlar turi', guruh: 'tuzilish', izoh: 'Yadro zaryadi bir xil atomlar.' },
]

const OYIN2_SAVOLLAR = [
  {
    belgi: '6-bet • 1-misol',
    savol: 'O atomi m = 2,657·10⁻²³ g bo\'lsa, Ar(O) nechaga teng?',
    variantlar: ['12', '32', '16', '8'],
    togri: 2,
    izoh: '26,57·10⁻²⁴ / 1,66·10⁻²⁴ = 16.',
  },
  {
    belgi: '9-bet • 1-misol',
    savol: '49 g H₂SO₄ (M = 98 g/mol) necha mol bo\'ladi?',
    variantlar: ['0,5 mol', '1,0 mol', '2,0 mol', '0,25 mol'],
    togri: 0,
    izoh: 'n = 49 / 98 = 0,5 mol.',
  },
  {
    belgi: '9-bet • 2-misol',
    savol: '5 mol CuO (M = 80 g/mol) massasi nechaga teng?',
    variantlar: ['160 g', '240 g', '800 g', '400 g'],
    togri: 3,
    izoh: 'm = M · n = 80 · 5 = 400 g.',
  },
  {
    belgi: '10-bet • 2-mashq',
    savol: '12,6 g HNO₃ (M = 63 g/mol) necha mol bo\'ladi?',
    variantlar: ['0,5 mol', '0,2 mol', '2,0 mol', '1,2 mol'],
    togri: 1,
    izoh: 'n = 12,6 / 63 = 0,2 mol.',
  },
  {
    belgi: '10-bet • 3-mashq',
    savol: '2,5 mol SiO₂ (M = 60 g/mol) massasi:',
    variantlar: ['120 g', '150 g', '60 g', '300 g'],
    togri: 1,
    izoh: 'm = 2,5 · 60 = 150 g.',
  },
  {
    belgi: '6-bet • 2-misol',
    savol: '0,301·10²³ ta O atomlari massasi nechaga teng?',
    variantlar: ['1,6 g', '16 g', '3,2 g', '0,8 g'],
    togri: 3,
    izoh: 'n = 0,05 mol → m = 0,05 · 16 = 0,8 g.',
  },
  {
    belgi: '10-bet • Mashq',
    savol: 'FeSO₄·7H₂O (temir kuporosi) Mr qiymati:',
    variantlar: ['278', '250', '152', '180'],
    togri: 0,
    izoh: '152 + 7·18 = 278.',
  },
  {
    belgi: '7-bet • Saqlanish',
    savol: 'Yopiq idishda 128 g Cu + 32 g O₂ → CuO massasi:',
    variantlar: ['96 g', '128 g', '160 g', '320 g'],
    togri: 2,
    izoh: 'Massa saqlanadi: 128 + 32 = 160 g.',
  },
]

const OYIN3_MISSIYALAR = [
  {
    tur: 'EKUB algoritmi (8-bet)',
    vazifa: 'P₂O₅ formulasini tuzish tartibi:',
    tartib: [
      'Belgi: P va O',
      'Valentlik: P(V), O(II)',
      'EKUB(5, 2) = 10',
      'Indeks: P₂O₅',
    ],
    variantlar: [
      'Indeks: P₂O₅',
      'EKUB(5, 2) = 10',
      'Belgi: P va O',
      'Valentlik: P(V), O(II)',
    ],
  },
  {
    tur: 'Massadan zarralar soni',
    vazifa: 'Massadan N topish zanjiri:',
    tartib: [
      '1. M (g/mol) topish',
      '2. n = m / M topish',
      '3. N = n · 6,02·10²³',
    ],
    variantlar: [
      '3. N = n · 6,02·10²³',
      '1. M (g/mol) topish',
      '2. n = m / M topish',
    ],
  },
  {
    tur: 'FeSO₄·7H₂O Mr hisobi (10-bet)',
    vazifa: 'Temir kuporosi Mr hisoblash tartibi:',
    tartib: [
      'FeSO₄ = 56 + 32 + 64 = 152',
      '7H₂O = 7 · 18 = 126',
      'Jami Mr = 152 + 126 = 278',
    ],
    variantlar: [
      'Jami Mr = 152 + 126 = 278',
      'FeSO₄ = 56 + 32 + 64 = 152',
      '7H₂O = 7 · 18 = 126',
    ],
  },
]

const DUEL_1_PAR = [
  {
    savol: '1 atom massa birligi (1 m.a.b.) qiymati:',
    variantlar: ['6,02·10²³ g', '1,66·10⁻²⁴ g', '12·10⁻²⁴ g', '1,99·10⁻²³ g'],
    togri: 1,
    izoh: '¹²C massasining 1/12 qismi = 1,66·10⁻²⁴ g.',
  },
  {
    savol: 'SiH₄ da Si elementining valentligi:',
    variantlar: ['II', 'III', 'I', 'IV'],
    togri: 3,
    izoh: '4 ta H (I valentli) → Si = IV.',
  },
  {
    savol: 'Xrom (VI)-oksid formulasi (9-bet):',
    variantlar: ['CrO₃', 'Cr₂O₃', 'CrO', 'Cr₃O₂'],
    togri: 0,
    izoh: 'EKUB(6, 2) = 6 → CrO₃.',
  },
  {
    savol: 'CaCO₃ ning nisbiy molekular massasi (Mr):',
    variantlar: ['98', '80', '100', '120'],
    togri: 2,
    izoh: '40 + 12 + 48 = 100.',
  },
  {
    savol: '1 mol H₂SO₄ da nechta molekula bor?',
    variantlar: ['3,01·10²³ ta', '98 ta', '6,02·10²³ ta', '7 ta'],
    togri: 2,
    izoh: 'Har 1 mol moddada Nₐ = 6,02·10²³ ta.',
  },
  {
    savol: 'Cl(VII) oksidi formulasi:',
    variantlar: ['Cl₂O₇', 'Cl₂O', 'ClO₂', 'Cl₂O₅'],
    togri: 0,
    izoh: 'EKUB(7, 2) = 14 → Cl₂O₇.',
  },
  {
    savol: 'Molyar massa (M) o\'lchov birligi:',
    variantlar: ['mol', 'g/mol', 'ta/mol', 'm.a.b.'],
    togri: 1,
    izoh: '1 mol massasi — g/mol.',
  },
  {
    savol: 'Se(VI) oksidi formulasi (9-bet mashq):',
    variantlar: ['SeO₂', 'Se₂O₃', 'SeO', 'SeO₃'],
    togri: 3,
    izoh: 'EKUB(6, 2) = 6 → SeO₃.',
  },
]

export default function S8Mavzu1() {
  const korgazmalar = [
    { nom: '1. Absolut & Ar', ikon: 'nizom', komponent: <NisbiyAtomMassaCanvas /> },
    { nom: '2. Formula & Mr', ikon: 'formula', komponent: <KimyoviyFormulaMrCanvas /> },
    { nom: '3. Mol & Avogadro', ikon: 'tanga', komponent: <MolAvogadroTarozisiCanvas /> },
    { nom: '4. Valentlik (EKUB)', ikon: 'chaqmoq', komponent: <ValentlikFormulaCanvas /> },
    { nom: '5. Massa saqlanishi', ikon: 'olmos', komponent: <MassaSaqlanishCanvas /> },
    { nom: '6. H-birikmalar', ikon: 'atom', komponent: <VodorodliValentlikCanvas /> },
  ]

  const oyinlar = [
    {
      nom: '1. Tushunchalar saralash',
      ikon: 'palitra',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-1"
          nom="Miqdor va Tuzilish"
          ikon="palitra"
          guruhlar={OYIN1_GURUHLAR}
          topshiriqlar={OYIN1_NAMUNALAR}
        />
      ),
    },
    {
      nom: '2. Masala laboratoriyasi',
      ikon: 'qidiruv',
      komponent: (
        <TezkorTanlovOyini
          key="tezkor-1"
          nom="1-§ Masalalari (6–10-bet)"
          ikon="qidiruv"
          savollar={OYIN2_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Algoritm zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-1"
          nom="Formula va Mol Algoritmi"
          ikon="filtr"
          missiyalar={OYIN3_MISSIYALAR}
        />
      ),
    },
    {
      nom: '4. Jamoalar Dueli',
      ikon: 'kubok',
      komponent: <JamoalarDueliPanel key="duel-1" sarlavha="1-§ Jamoalar Dueli" savollar={DUEL_1_PAR} />,
    },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="1-§"
      mavzuNom="Dastlabki kimyoviy tushuncha va qonunlar"
      oldingiRaqam="7-sinf"
      oldingiNom="Kimyo asoslarini takrorlash"
      takrorlashSavollar={TAKRORLASH_7_TAYANCH}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
