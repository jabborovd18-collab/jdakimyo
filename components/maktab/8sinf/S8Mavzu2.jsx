'use client'
// ============================================================
// JDA KIMYO — 8-SINF, I BOB, 2-§ + 1-LABORATORIYA ISHI
// "Noorganik birikmalarning asosiy sinflari" (Darslik 10–16, 200-bet)
// 6 ta interaktiv Canvas Ko'rgazma + 4 ta Smart-doska O'yini
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
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'
import { InteraktivSahnaKorgazma } from '@/components/maktab/SmartKimyoSahna'

const TAKRORLASH_1_PAR = [
  {
    id: '1-par-1',
    savol: 'Nisbiy atom massa (Ar) etaloni:',
    variantlar: [
      { matn: '6,02·10²³ g suv', togri: false },
      { matn: 'O atomi massasining yarmi', togri: false },
      { matn: '¹²C massasining 1/12 (1,66·10⁻²⁴ g)', togri: true },
      { matn: 'N₂ ning 1/14 qismi', togri: false },],
    izoh: '1 m.a.b. = 1/12 m(¹²C) = 1,66·10⁻²⁴ g.',
  },
  {
    id: '1-par-2',
    savol: '49 g H₂SO₄ (M = 98 g/mol) necha mol?',
    variantlar: [
      { matn: '0,5 mol', togri: true },
      { matn: '2,0 mol', togri: false },
      { matn: '1,0 mol', togri: false },
      { matn: '0,25 mol', togri: false },],
    izoh: 'n = 49 / 98 = 0,5 mol.',
  },
  {
    id: '1-par-3',
    savol: 'Fosfor (V)-oksid formulasi:',
    variantlar: [
      { matn: 'PO₅', togri: false },
      { matn: 'P₅O₂', togri: false },
      { matn: 'P₂O₃', togri: false },
      { matn: 'P₂O₅', togri: true },],
    izoh: 'EKUB(5, 2) = 10 → P₂O₅.',
  },
  {
    id: '1-par-4',
    savol: '1 mol moddada nechta zarra bor?',
    variantlar: [
      { matn: '1,66·10²⁴', togri: false },
      { matn: '6,02·10²³', togri: true },
      { matn: '98', togri: false },
      { matn: '3,01·10²³', togri: false },],
    izoh: 'Avogadro soni: Nₐ = 6,02·10²³ mol⁻¹.',
  },
  {
    id: '1-par-5',
    savol: '2,5 mol SiO₂ (M = 60 g/mol) massasi:',
    variantlar: [
      { matn: '120 g', togri: false },
      { matn: '150 g', togri: true },
      { matn: '240 g', togri: false },
      { matn: '60 g', togri: false },],
    izoh: 'm = 2,5 · 60 = 150 g.',
  },
]

// ============================================================
// 1-KO'RGAZMA: OKSIDLARNING 5 TA GURUHI (10-BET)
// ============================================================
const OKSID_GURUHLAR = [
  {
    id: 'asosli',
    nom: 'Asosli oksidlar',
    misollar: 'Na₂O, BaO, CuO',
    xossa: 'Kislotalar bilan reaksiyaga kirishib tuz va suv beradi',
    reaksiya: 'CuO + H₂SO₄ → CuSO₄ + H₂O',
    rang: '#38bdf8',
  },
  {
    id: 'kislotali',
    nom: 'Kislotali oksidlar',
    misollar: 'CO₂, SO₃, P₂O₅',
    xossa: 'Ishqorlar bilan tuz + suv beradi, ko\'pi suv bilan kislota hosil qiladi',
    reaksiya: 'SO₃ + 2NaOH → Na₂SO₄ + H₂O',
    rang: '#f43f5e',
  },
  {
    id: 'amfoter',
    nom: 'Amfoter oksidlar',
    misollar: 'ZnO, Al₂O₃, Sb₂O₃',
    xossa: 'Ham kislota, ham ishqorlar bilan reaksiyaga kirishadi',
    reaksiya: 'ZnO + 2HCl → ZnCl₂ + H₂O | ZnO + 2NaOH → Na₂ZnO₂ + H₂O',
    rang: '#a855f7',
  },
  {
    id: 'betaraf',
    nom: 'Betaraf oksidlar',
    misollar: 'CO, NO, N₂O',
    xossa: 'Tuz hosil qilmaydigan oksidlar: na kislota, na asos bilan kirishadi',
    reaksiya: 'CO + kislota / asos ≠ tuz',
    rang: '#94a3b8',
  },
  {
    id: 'peroksid',
    nom: 'Peroksidlar',
    misollar: 'Na₂O₂, H₂O₂, BaO₂',
    xossa: 'Kislorodning oksidlanish darajasi −1, valentligi esa II (–O–O–)',
    reaksiya: '2H₂O₂ → 2H₂O + O₂↑',
    rang: '#facc15',
  },
]

function OksidlarTasnifiCanvas() {
  const canvasRef = useRef(null)
  const [gIdx, setGIdx] = useState(0)
  const g = OKSID_GURUHLAR[gIdx]

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

      ctx.fillStyle = g.rang
      ctx.font = 'bold 24px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(g.nom, w / 2, 42)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px "Times New Roman", serif'
      ctx.fillText(`Misollar: ${g.misollar}`, w / 2, 74)

      // 3 ta sinov probirkasi: Suv, Kislota (HCl), Ishqor (NaOH)
      const reagents = [
        { nom: 'Suv (H₂O)', faol: g.id === 'peroksid' || g.id === 'kislotali' || g.id === 'asosli', belgi: g.id === 'peroksid' ? 'O₂ ajraladi' : g.id === 'betaraf' ? 'Kirishmaydi' : 'Gidrat/Eritma' },
        { nom: 'Kislota (HCl)', faol: g.id === 'asosli' || g.id === 'amfoter', belgi: g.id === 'asosli' || g.id === 'amfoter' ? 'Tuz + H₂O!' : 'Reaksiya yo\'q' },
        { nom: 'Ishqor (NaOH)', faol: g.id === 'kislotali' || g.id === 'amfoter', belgi: g.id === 'kislotali' || g.id === 'amfoter' ? 'Tuz + H₂O!' : 'Reaksiya yo\'q' },
      ]

      reagents.forEach((rg, i) => {
        const sx = w * (0.22 + i * 0.28) - 48
        const sy = 110
        chizStakan(ctx, sx, sy, 96, 130, {
          sarlavha: rg.nom,
          yorliq: rg.belgi,
          suyuqlikRang: rg.faol ? 'rgba(52, 211, 153, 0.35)' : 'rgba(100, 116, 139, 0.22)',
          tolish: 0.65,
        })
        if (rg.faol) {
          for (let b = 0; b < 4; b++) {
            const py = sy + 115 - ((t * 35 + b * 24) % 75)
            chizZarracha(ctx, sx + 26 + b * 14, py, 6, g.rang)
          }
        }
      })

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.strokeStyle = g.rang
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(24, h - 84, w - 48, 56, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillText(g.xossa, w / 2, h - 59)
      ctx.fillStyle = '#fde047'
      ctx.fillText(g.reaksiya, w / 2, h - 38)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [g])

  return (
    <KorgazmaRamka
      sarlavha="1. Oksidlar tasnifi (5 ta guruh, darslik 10-bet)"
      qisqaFormula={g.misollar}
      ikon="kristall"
      boshqaruv={
        <>
          {OKSID_GURUHLAR.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setGIdx(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border transition ${
                gIdx === i
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-yellow-400/50'
              }`}
            >
              {item.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Umumiy formula: E₂Oₙ
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Peroksidlarda O valentligi II, o.d. = −1
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Amfoter oksid ikki tomonlama xossali
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: OLMALIQ RUDASIDAN Mn₂O₇ FORMULASINI CHIQARISH
// ============================================================
const RUDA_VARIANTLAR = [
  {
    id: 'mn2o7',
    tugma: 'Mn₂O₇ (Olmaliq)',
    formula: '49,6% Mn + 50,4% O → n(Mn):n(O) = 1:3,5 = 2:7 → Mn₂O₇',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Olmaliq rudasidan oksid formulasini topish (10-bet misol)',
      tenglama: 'x : y = (49,6 / 55) : (50,4 / 16) = 0,90 : 3,15 = 2 : 7 → Mn₂O₇',
      qadamlar: [
        { belgi: '1. Mol nisbati', natija: '0,90 : 3,15', izoh: 'w / Ar bo\'linadi', rang: '#38bdf8' },
        { belgi: '2. Kichigiga', natija: '1 : 3,5', izoh: '÷ 0,90', rang: '#fde047' },
        { belgi: '3. Butun son', natija: '2 : 7 → Mn₂O₇', izoh: '× 2', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Mn (Ar=55)', foiz: 50, qiymat: '49,6%', rang: '#38bdf8' },
        { nom: 'O (Ar=16)', foiz: 50, qiymat: '50,4%', rang: '#fb7185' },
      ],
      javobBadge: 'Formula: Mn₂O₇',
    },
    pastki: ['Nisbat = w(%) / Ar', '1 : 3,5 → ×2 → 2 : 7', 'Olmaliq Mn rudasi'],
  },
  {
    id: 'fe2o3',
    tugma: 'Fe₂O₃ (Temir)',
    formula: '70% Fe + 30% O → 1,25 : 1,875 = 1 : 1,5 → Fe₂O₃',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Temir oksidi tarkibidan formula chiqarish',
      tenglama: 'x : y = (70 / 56) : (30 / 16) = 1,25 : 1,875 = 2 : 3 → Fe₂O₃',
      qadamlar: [
        { belgi: '1. Mol nisbati', natija: '1,25 : 1,875', izoh: '70/56 va 30/16', rang: '#38bdf8' },
        { belgi: '2. Kichigiga', natija: '1 : 1,5', izoh: '÷ 1,25', rang: '#fde047' },
        { belgi: '3. Butun son', natija: '2 : 3 → Fe₂O₃', izoh: '× 2', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Fe (Ar=56)', foiz: 70, qiymat: '70,0%', rang: '#f97316' },
        { nom: 'O (Ar=16)', foiz: 30, qiymat: '30,0%', rang: '#fb7185' },
      ],
      javobBadge: 'Formula: Fe₂O₃',
    },
    pastki: ['Fe = 70%, O = 30%', '1 : 1,5 → 2 : 3', 'Qizil temirtosh'],
  },
  {
    id: 'so2',
    tugma: 'SO₂ (Gaz)',
    formula: '50% S + 50% O → 1,56 : 3,12 = 1 : 2 → SO₂',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Oltingugurt (IV)-oksid formulasini topish',
      tenglama: 'x : y = (50 / 32) : (50 / 16) = 1,56 : 3,12 = 1 : 2 → SO₂',
      qadamlar: [
        { belgi: '1. Mol nisbati', natija: '1,56 : 3,12', izoh: '50/32 va 50/16', rang: '#fde047' },
        { belgi: '2. Kichigiga', natija: '1 : 2', izoh: '÷ 1,56', rang: '#34d399' },
        { belgi: '3. Formula', natija: 'SO₂', izoh: 'S(IV)', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: 'S (Ar=32)', foiz: 50, qiymat: '50,0%', rang: '#fde047' },
        { nom: 'O (Ar=16)', foiz: 50, qiymat: '50,0%', rang: '#fb7185' },
      ],
      javobBadge: 'Formula: SO₂',
    },
    pastki: ['w(S) = 50%, w(O) = 50%', 'S : O = 1 : 2', 'Kislotali oksid SO₂'],
  },
]

function RudaFormulaCanvas() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Foiz tarkibdan oksid formulasi (10–11-b)"
      ikon="grafik"
      variantlar={RUDA_VARIANTLAR}
    />
  )
}

// ============================================================
// 3-KO'RGAZMA: 1-LABORATORIYA ISHI (Zn(OH)₂ VA Cu(OH)₂, 200-BET)
// ============================================================
function Lab1AmfoterlikCanvas() {
  const canvasRef = useRef(null)
  const [namuna, setNamuna] = useState('zn') // 'zn' | 'cu'
  const [holat, setHolat] = useState('bosh') // 'bosh' | 'chokma' | 'tekshir'

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

      const gidroksid = namuna === 'zn' ? 'Zn(OH)₂' : 'Cu(OH)₂'
      const tuz = namuna === 'zn' ? 'ZnCl₂' : 'CuCl₂'
      const chokmaRang = namuna === 'zn' ? 'rgba(241, 245, 249, 0.85)' : 'rgba(56, 189, 248, 0.85)'

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 18px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`1-Laboratoriya ishi (200-bet): ${gidroksid} olinishi va xossasi`, w / 2, 34)

      // 1-stakan: HCl ta'siri, 2-stakan: Mo'l NaOH ta'siri
      const erishIshqorda = namuna === 'zn'

      chizStakan(ctx, w * 0.28 - 55, 86, 110, 165, {
        sarlavha: '+ Xlorid kislota (HCl)',
        yorliq: holat === 'tekshir' ? `${gidroksid} ERIYDI → ${tuz}` : holat === 'chokma' ? `${gidroksid}↓ cho'kmasi` : `${tuz} + NaOH`,
        suyuqlikRang:
          holat === 'tekshir'
            ? namuna === 'zn'
              ? 'rgba(186, 230, 253, 0.32)'
              : 'rgba(16, 185, 129, 0.45)'
            : 'rgba(148, 163, 184, 0.25)',
        tolish: 0.72,
      })

      chizStakan(ctx, w * 0.72 - 55, 86, 110, 165, {
        sarlavha: '+ Mo\'l ishqor (NaOH)',
        yorliq:
          holat === 'tekshir'
            ? erishIshqorda
              ? 'ERIYDI → Na₂[Zn(OH)₄]!'
              : 'ERIMAYDI (asosli xossa)'
            : holat === 'chokma'
            ? `${gidroksid}↓ cho'kmasi`
            : `${tuz} + NaOH`,
        suyuqlikRang:
          holat === 'tekshir' && erishIshqorda
            ? 'rgba(186, 230, 253, 0.35)'
            : 'rgba(148, 163, 184, 0.25)',
        tolish: 0.72,
      })

      // Cho'kma chizish
      if (holat === 'chokma' || (holat === 'tekshir' && !erishIshqorda)) {
        const stakans = holat === 'chokma' ? [w * 0.28, w * 0.72] : [w * 0.72]
        stakans.forEach((cx) => {
          for (let i = 0; i < 12; i++) {
            const px = cx - 34 + (i % 6) * 13
            const py = 234 - Math.floor(i / 6) * 11 + Math.sin(t + i) * 1.2
            ctx.fillStyle = chokmaRang
            ctx.beginPath()
            ctx.arc(px, py, 6, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      }

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillText(
        namuna === 'zn'
          ? 'Xulosa: Zn(OH)₂ ham HCl da, ham NaOH da eriydi → AMFOTER GIDROKSID!'
          : 'Xulosa: Cu(OH)₂ faqat HCl da eriydi, NaOH da erimaydi → ASOS!',
        w / 2,
        h - 26
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [namuna, holat])

  return (
    <KorgazmaRamka
      sarlavha="3. Asoslar va 1-Laboratoriya: Zn(OH)₂ amfoterligi (11, 200-bet)"
      qisqaFormula={namuna === 'zn' ? 'Zn(OH)₂ — Amfoter' : 'Cu(OH)₂ — Erimas asos'}
      ikon="kolba"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setNamuna('zn')
              setHolat('chokma')
              tovushChiqar('tasdiq')
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition ${
              namuna === 'zn' ? 'bg-purple-400 text-slate-950 border-purple-300' : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            ZnCl₂ → Zn(OH)₂ (Oq cho&apos;kma)
          </button>
          <button
            type="button"
            onClick={() => {
              setNamuna('cu')
              setHolat('chokma')
              tovushChiqar('tasdiq')
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition ${
              namuna === 'cu' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            CuCl₂ → Cu(OH)₂ (Havorang cho&apos;kma)
          </button>
          <button
            type="button"
            onClick={() => {
              setHolat((p) => (p === 'tekshir' ? 'chokma' : 'tekshir'))
              tovushChiqar('togri')
            }}
            className="ml-auto px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
          >
            {holat === 'tekshir' ? 'Cho\'kma holatiga qaytish' : 'HCl va NaOH qo\'shib sinash'}
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Ishqorlar (eriydigan): NaOH, KOH, Ca(OH)₂, Ba(OH)₂
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Erimaydigan: Cu(OH)₂, Fe(OH)₂, Cr(OH)₂
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Amfoterlar: Zn(OH)₂, Al(OH)₃, Cr(OH)₃
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: KISLOTALAR VA METALLAR BILAN REAKSIYA (13–14-BET)
// ============================================================
const KISLOTA_REAGENTLAR = [
  { id: 'zn_hcl', sav: 'Zn + 2HCl', mahsulot: 'ZnCl₂ + H₂↑', bor: true, izoh: 'Rux metall H₂ ni siqib chiqaradi (13-bet 1-misol: 26g Zn → 0,8g H₂)' },
  { id: 'cu_hcl', sav: 'Cu + HCl', mahsulot: 'Reaksiya ketmaydi!', bor: false, izoh: 'Mis vodoroddan passiv — suyultirilgan HCl dan H₂ siqib chiqara olmaydi' },
  { id: 'cu_h2so4', sav: 'Cu + 2H₂SO₄(kons)', mahsulot: 'CuSO₄ + SO₂↑ + 2H₂O', bor: true, izoh: 'Konsentrlangan sulfat kislota qizdirilganda mis bilan SO₂ chiqaradi' },
  { id: 'caco3_hcl', sav: 'CaCO₃ + 2HCl', mahsulot: 'CaCl₂ + CO₂↑ + H₂O', bor: true, izoh: 'Karbonat tuzlari kislotalar bilan CO₂ gazini ajratib eriydi' },
]

function KislotaMatritsaCanvas() {
  const canvasRef = useRef(null)
  const [rIdx, setRIdx] = useState(0)
  const kr = KISLOTA_REAGENTLAR[rIdx]

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
      ctx.font = 'bold 21px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${kr.sav}  →  ${kr.mahsulot}`, w / 2, 38)

      chizStakan(ctx, w / 2 - 70, 74, 140, 175, {
        sarlavha: 'Reaksiya idishi',
        yorliq: kr.bor ? 'Gaz ajralmoqda!' : 'O\'zgarish yo\'q',
        suyuqlikRang: kr.bor ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.25)',
        tolish: 0.72,
      })

      if (kr.bor) {
        for (let i = 0; i < 8; i++) {
          const px = w / 2 - 36 + i * 10
          const py = 230 - ((t * 48 + i * 28) % 130)
          ctx.strokeStyle = '#e0f2fe'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillText(kr.izoh, w / 2, h - 24)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [kr])

  return (
    <KorgazmaRamka
      sarlavha="4. Kislotalar tasnifi va kimyoviy xossalari (13–14-bet)"
      qisqaFormula={`${kr.sav} → ${kr.mahsulot}`}
      ikon="tomchi"
      boshqaruv={
        <>
          {KISLOTA_REAGENTLAR.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setRIdx(i)
                tovushChiqar(item.bor ? 'togri' : 'tasdiq')
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition ${
                rIdx === i
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-cyan-400/50'
              }`}
            >
              {item.sav}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            1-negizli: HCl, HBr, HNO₃
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            2-negizli: H₂SO₄, H₂SO₃, H₂S
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            3-negizli: H₃PO₄ | Kislorodsiz: H₂S, HBr, HI
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: TUZLARNING 5 TA SINFI (14–15-BET)
// ============================================================
const TUZ_SINFLARI = [
  { id: 'normal', nom: '1. O\'rta (Normal) tuzlar', formulalar: 'NaCl, CaCl₂, Ba(NO₃)₂, Al₂(SO₄)₃', tarkib: 'Metall kationi + kislota qoldig\'i', rang: '#38bdf8' },
  { id: 'nordon', nom: '2. Nordon tuzlar', formulalar: 'NaHCO₃, Ca(HCO₃)₂, KHSO₄, Ca(H₂PO₄)₂', tarkib: 'Kislotadagi barcha H almashmagan (ko\'p negizli)', rang: '#facc15' },
  { id: 'asosli', nom: '3. Asosli (Gidroksid) tuzlar', formulalar: '(CuOH)₂CO₃, Ca(OH)Cl, Mg(OH)NO₃, Al(OH)₂Cl', tarkib: 'Asosdagi barcha OH⁻ almashmagan', rang: '#34d399' },
  { id: 'qosh', nom: '4. Qo\'shaloq tuzlar (Achchiqtoshlar)', formulalar: 'KAl(SO₄)₂, NH₄Al(SO₄)₂', tarkib: 'Ikki xil metall + bitta kislota qoldig\'i', rang: '#a855f7' },
  { id: 'aralash', nom: '5. Aralash tuzlar', formulalar: 'Ca(OCl)Cl (yoki CaOCl₂)', tarkib: 'Bitta metall + ikki xil kislota qoldig\'i', rang: '#fb7185' },
]

function Tuzlar5SinfCanvas() {
  const canvasRef = useRef(null)
  const [tIdx, setTIdx] = useState(0)
  const ts = TUZ_SINFLARI[tIdx]

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

      ctx.fillStyle = ts.rang
      ctx.font = 'bold 23px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(ts.nom, w / 2, 42)

      // Markaziy tarkib kartasi
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = ts.rang
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(42, 72, w - 84, 155, 18)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px "Times New Roman", serif'
      ctx.fillText(ts.formulalar, w / 2, 128)

      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`Tarkibiy tuzilishi: ${ts.tarkib}`, w / 2, 174)

      // Bezak ionlar
      for (let i = 0; i < 6; i++) {
        const px = 90 + i * ((w - 180) / 5)
        const py = h - 62 + Math.sin(t + i) * 7
        chizZarracha(ctx, px, py, 14, i % 2 === 0 ? ts.rang : '#e2e8f0', i % 2 === 0 ? '+' : '−')
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [ts])

  return (
    <KorgazmaRamka
      sarlavha="5. Tuzlarning 5 ta sinfi (Darslik 14–15-bet)"
      qisqaFormula={ts.nom}
      ikon="olmos"
      boshqaruv={
        <>
          {TUZ_SINFLARI.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTIdx(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm border transition ${
                tIdx === i
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800 hover:border-yellow-400/50'
              }`}
            >
              {item.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Metall o&apos;rnida NH₄⁺ bo&apos;lsa → Ammoniy tuzi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Achchiqtoshlar: KAl(SO₄)₂, NH₄Al(SO₄)₂
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Aralash tuz: CaOCl₂ (xlorli ohak)
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: TENG MOL NISBATDA NORDON TUZ HOSIL BO'LISHI (15–16-BET)
// ============================================================
const NORDON_NORMAL_VARIANTLAR = [
  {
    id: 'nordon',
    tugma: '1:1 (20 g NaOH) → NaHSO₄',
    formula: '0,5 mol NaOH + 0,5 mol H₂SO₄ → 0,5 mol NaHSO₄ (60 g)',
    tur: 'reaksiya',
    cfg: {
      sarlavha: 'Teng mol nisbat (1:1): Nordon tuz hosil bo\'lishi (15–16-bet)',
      tenglama: 'NaOH (20 g) + H₂SO₄ (49 g) = NaHSO₄ (60 g) + H₂O',
      ikkiIdish: true,
      suyuqlikRang: '#fbbf24',
      tolish: 0.68,
      stakanBelgi: 'NaOH 0,5 mol',
      stakanSarlavha: '20 g (M=40)',
      ikkinchiSuyuqlikRang: '#fb7185',
      ikkinchiBelgi: 'H₂SO₄ 0,5 mol',
      ikkinchiSarlavha: '49 g (M=98)',
      reagentlar: [
        { belgi: 'Na⁺', rang: '#38bdf8' },
        { belgi: 'HSO₄⁻', rang: '#fde047' },
      ],
      elektronJuft: { chap: '0,5 NaOH', ong: 'NaHSO₄', e: '1:1' },
      belgilar: [
        { k: 'M(NaHSO₄)', v: '120 g/mol', rang: '#fde047' },
        { k: 'Massa', v: '0,5 · 120 = 60 g', rang: '#34d399' },
        { k: 'Tuz turi', v: 'Nordon (H qolgan)', rang: '#fbbf24' },
      ],
    },
    pastki: ['n(NaOH) = n(H₂SO₄) = 0,5 mol', '1 ta H⁺ almashdi → NaHSO₄', 'm = 0,5 · 120 = 60 g'],
  },
  {
    id: 'normal',
    tugma: '2:1 (40 g NaOH) → Na₂SO₄',
    formula: '1,0 mol NaOH + 0,5 mol H₂SO₄ → 0,5 mol Na₂SO₄ (71 g)',
    tur: 'reaksiya',
    cfg: {
      sarlavha: 'Mo\'l ishqor (2:1): Normal tuz hosil bo\'lishi (15–16-bet)',
      tenglama: '2NaOH (40 g) + H₂SO₄ (49 g) = Na₂SO₄ (71 g) + 2H₂O',
      ikkiIdish: true,
      suyuqlikRang: '#38bdf8',
      tolish: 0.75,
      stakanBelgi: 'NaOH 1,0 mol',
      stakanSarlavha: '40 g (2×)',
      ikkinchiSuyuqlikRang: '#34d399',
      ikkinchiBelgi: 'Na₂SO₄ 0,5 mol',
      ikkinchiSarlavha: '71 g',
      reagentlar: [
        { belgi: '2Na⁺', rang: '#38bdf8' },
        { belgi: 'SO₄²⁻', rang: '#34d399' },
      ],
      elektronJuft: { chap: '1,0 NaOH', ong: 'Na₂SO₄', e: '2:1' },
      belgilar: [
        { k: 'M(Na₂SO₄)', v: '142 g/mol', rang: '#fde047' },
        { k: 'Massa', v: '0,5 · 142 = 71 g', rang: '#34d399' },
        { k: 'Tuz turi', v: 'Normal (to\'liq almashgan)', rang: '#38bdf8' },
      ],
    },
    pastki: ['n(NaOH) = 1,0 mol (2×)', 'Ikkala H⁺ almashdi → Na₂SO₄', 'm = 0,5 · 142 = 71 g'],
  },
]

function NordonVsNormalCanvas() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Teng mol nisbatda nordon vs normal tuz (15–16-b)"
      ikon="nizom"
      variantlar={NORDON_NORMAL_VARIANTLAR}
    />
  )
}

// ============================================================
// O'YINLAR (MUVOZANATLASHTIRILGAN VA QISQARTIRILGAN)
// ============================================================
const OYIN1_GURUHLAR = [
  { id: 'asosli', nom: 'Asosli oksid', tavsif: 'Na₂O, BaO, CuO' },
  { id: 'kislotali', nom: 'Kislotali oksid', tavsif: 'CO₂, SO₃, P₂O₅' },
  { id: 'amfoter', nom: 'Amfoter oksid', tavsif: 'ZnO, Al₂O₃, Sb₂O₃' },
  { id: 'betaraf', nom: 'Betaraf / Peroksid', tavsif: 'CO, NO, Na₂O₂' },
]

const OYIN1_NAMUNALAR = [
  { nom: 'SO₃', qisqa: 'H₂SO₄ oksidi', guruh: 'kislotali', izoh: 'Suv bilan H₂SO₄ beradi.' },
  { nom: 'ZnO', qisqa: 'Kislota & ishqor bilan', guruh: 'amfoter', izoh: 'Ikki tomonlama amfoter oksid.' },
  { nom: 'CO (Is gazi)', qisqa: 'Tuz hosil qilmaydi', guruh: 'betaraf', izoh: 'CO, NO, N₂O — betaraf.' },
  { nom: 'BaO', qisqa: 'Ba(OH)₂ asos oksidi', guruh: 'asosli', izoh: 'Suv bilan Ba(OH)₂ beradi.' },
  { nom: 'Al₂O₃', qisqa: 'Amfoter oksid', guruh: 'amfoter', izoh: 'Ham HCl, ham NaOH da eriydi.' },
  { nom: 'Na₂O₂', qisqa: 'Peroksid (O⁻¹)', guruh: 'betaraf', izoh: 'Peroksidda kislorod = −1.' },
]

const OYIN2_GURUHLAR = [
  { id: 'normal', nom: 'Normal tuz', tavsif: 'NaCl, CaCl₂' },
  { id: 'nordon', nom: 'Nordon tuz', tavsif: 'NaHCO₃, KHSO₄' },
  { id: 'asosli', nom: 'Asosli tuz', tavsif: '(CuOH)₂CO₃' },
  { id: 'qosh', nom: 'Qo\'sh / Aralash', tavsif: 'KAl(SO₄)₂, CaOCl₂' },
]

const OYIN2_NAMUNALAR = [
  { nom: 'Ca(H₂PO₄)₂', qisqa: 'Tarkibida H bor', guruh: 'nordon', izoh: 'Vodorodi saqlangan nordon tuz.' },
  { nom: 'Mg(OH)NO₃', qisqa: 'Tarkibida OH bor', guruh: 'asosli', izoh: 'OH guruhli asosli tuz.' },
  { nom: 'KAl(SO₄)₂', qisqa: 'Achchiqtosh', guruh: 'qosh', izoh: '2 xil metall + 1 kislota qoldig\'i.' },
  { nom: 'Ba(NO₃)₂', qisqa: 'To\'liq almashgan', guruh: 'normal', izoh: 'O\'rta (normal) tuz.' },
  { nom: 'CaOCl₂', qisqa: 'Xlorli ohak', guruh: 'qosh', izoh: '1 metall + 2 xil kislota qoldig\'i.' },
  { nom: 'NaHCO₃', qisqa: 'Ichimlik sodasi', guruh: 'nordon', izoh: 'H₂CO₃ ning nordon tuzi.' },
]

const OYIN3_MISSIYALAR = [
  {
    tur: '16-bet genetik zanjir (a)',
    vazifa: 'CuSO₄ → Cu(OH)₂ → CuO → Cu tartibi:',
    tartib: [
      '+ NaOH → Cu(OH)₂↓',
      'Qizdirish → CuO + H₂O',
      '+ H₂ → Cu + H₂O',
    ],
    variantlar: [
      '+ H₂ → Cu + H₂O',
      '+ NaOH → Cu(OH)₂↓',
      'Qizdirish → CuO + H₂O',
    ],
  },
  {
    tur: '16-bet genetik zanjir (e)',
    vazifa: 'P → P₂O₅ → H₃PO₄ → Ca₃(PO₄)₂ tartibi:',
    tartib: [
      '+ O₂ → P₂O₅',
      '+ H₂O → H₃PO₄',
      '+ Ca(OH)₂ → Ca₃(PO₄)₂',
    ],
    variantlar: [
      '+ H₂O → H₃PO₄',
      '+ Ca(OH)₂ → Ca₃(PO₄)₂',
      '+ O₂ → P₂O₅',
    ],
  },
  {
    tur: '1-Laboratoriya (200-bet)',
    vazifa: 'Zn(OH)₂ amfoterligini sinash tartibi:',
    tartib: [
      'NaOH + ZnCl₂ → Zn(OH)₂↓',
      '2 ta probirkaga bo\'lish',
      'HCl va NaOH quyib eritish',
    ],
    variantlar: [
      '2 ta probirkaga bo\'lish',
      'HCl va NaOH quyib eritish',
      'NaOH + ZnCl₂ → Zn(OH)₂↓',
    ],
  },
]

const DUEL_2_PAR = [
  {
    savol: 'Peroksidda (Na₂O₂, H₂O₂) O ning oksidlanish darajasi:',
    variantlar: ['−2 (valentlik II)', '−1 (valentlik II)', '0 (valentlik I)', '+1 (valentlik II)'],
    togri: 1,
    izoh: '10-bet: O darajasi −1, valentligi II.',
  },
  {
    savol: 'Olmaliq rudasi: 49,6% Mn, 50,4% O formulasi:',
    variantlar: ['MnO₂', 'Mn₂O₃', 'MnO', 'Mn₂O₇'],
    togri: 3,
    izoh: '0,90 : 3,15 = 1 : 3,5 = 2 : 7 → Mn₂O₇.',
  },
  {
    savol: '26 g Zn (Ar=65) + mo\'l HCl → H₂ massasi:',
    variantlar: ['0,8 g', '1,6 g', '2,0 g', '4,0 g'],
    togri: 0,
    izoh: '65 g → 2 g; 26 g → 0,8 g H₂ (14-bet).',
  },
  {
    savol: '49 g H₂SO₄ + 20 g NaOH (1:1 mol) → qaysi tuz?',
    variantlar: ['71 g Na₂SO₄', '120 g NaHSO₄', '60 g NaHSO₄', '49 g Na₂SO₄'],
    togri: 2,
    izoh: '0,5 mol NaHSO₄ = 0,5·120 = 60 g (15–16-bet).',
  },
  {
    savol: '1-Lab ishida Cu(OH)₂ qayerda ERIMAYDI?',
    variantlar: ['H₂SO₄ da', 'HCl da', 'Mo\'l NaOH da', 'HNO₃ da'],
    togri: 2,
    izoh: 'Cu(OH)₂ oddiy asos — ishqorda erimaydi.',
  },
  {
    savol: 'Faqat BETARAF oksidlar qatori:',
    variantlar: ['CO, NO, N₂O', 'CO₂, SO₂, NO₂', 'ZnO, Al₂O₃, BeO', 'Na₂O, BaO, CaO'],
    togri: 0,
    izoh: 'CO, NO, N₂O tuz hosil qilmaydi.',
  },
  {
    savol: 'KAl(SO₄)₂ qanday tuz sinfi?',
    variantlar: ['Aralash tuz', 'Qo\'shaloq tuz', 'Nordon tuz', 'Asosli tuz'],
    togri: 1,
    izoh: '2 xil metall (K, Al) + 1 qoldiq (SO₄).',
  },
  {
    savol: 'Malaxit (CuOH)₂CO₃ qanday tuz sinfi?',
    variantlar: ['Normal', 'Qo\'shaloq', 'Nordon', 'Asosli (gidroksid)'],
    togri: 3,
    izoh: 'Tarkibida OH⁻ guruhi bor.',
  },
]

export default function S8Mavzu2() {
  const korgazmalar = [
    { nom: '1. Oksidlar 5 sinfi', ikon: 'kristall', komponent: <OksidlarTasnifiCanvas /> },
    { nom: '2. Mn₂O₇ formulasi', ikon: 'grafik', komponent: <RudaFormulaCanvas /> },
    { nom: '3. Lab-1: Zn(OH)₂', ikon: 'kolba', komponent: <Lab1AmfoterlikCanvas /> },
    { nom: '4. Kislota matritsa', ikon: 'tomchi', komponent: <KislotaMatritsaCanvas /> },
    { nom: '5. Tuzlar 5 sinfi', ikon: 'olmos', komponent: <Tuzlar5SinfCanvas /> },
    { nom: '6. Nordon vs Normal', ikon: 'nizom', komponent: <NordonVsNormalCanvas /> },
  ]

  const oyinlar = [
    {
      nom: '1. Oksidlar saralash',
      ikon: 'palitra',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-oksidlar"
          nom="Oksidlarni 4 guruhga ajrating"
          ikon="palitra"
          guruhlar={OYIN1_GURUHLAR}
          topshiriqlar={OYIN1_NAMUNALAR}
        />
      ),
    },
    {
      nom: '2. Tuzlar tasnifi',
      ikon: 'olmos',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-tuzlar"
          nom="Tuzlar sinfini aniqlang"
          ikon="olmos"
          guruhlar={OYIN2_GURUHLAR}
          topshiriqlar={OYIN2_NAMUNALAR}
        />
      ),
    },
    {
      nom: '3. Genetik zanjir',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-2"
          nom="Genetik bog'lanish va 1-Lab"
          ikon="filtr"
          missiyalar={OYIN3_MISSIYALAR}
        />
      ),
    },
    {
      nom: '4. Jamoalar Dueli',
      ikon: 'kubok',
      komponent: <JamoalarDueliPanel key="duel-2" sarlavha="2-§ Jamoalar Dueli" savollar={DUEL_2_PAR} />,
    },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="2-§"
      mavzuNom="Noorganik birikmalarning asosiy sinflari"
      oldingiRaqam="1-§"
      oldingiNom="Dastlabki kimyoviy tushuncha va qonunlar"
      takrorlashSavollar={TAKRORLASH_1_PAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
