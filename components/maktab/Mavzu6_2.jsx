'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 6-BOB, 6.2-MAVZU
// "Oddiy moddalar, murakkab moddalar va aralashmalarni o'zaro farqlash" (99-bet)
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
  chizTermometr,
  GuruhlashOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_6_1 = [
  {
    id: '6-1-1',
    savol: "Qaysi aralashma gomogen (bir jinsli) aralashmaga misol bo'ladi?",
    variantlar: [
      { matn: 'Tiniq osh tuzi eritmasi (NaCl + H₂O)', togri: true },
      { matn: 'Loyqa suv (qum + H₂O)', togri: false },
      { matn: 'O‘simlik yog‘i va suv', togri: false },
      { matn: 'Temir qipig‘i va oltingugurt', togri: false },
    ],
    izoh: 'Tuz suvda to‘liq erigani sababli bir jinsli (gomogen) eritma hosil qiladi.',
  },
  {
    id: '6-1-2',
    savol: 'Havoda muallaq turgan mayda suv tomchilari (tuman) qanday aralashma turiga kiradi?',
    variantlar: [
      { matn: 'Sof modda', togri: false },
      { matn: 'Aerozol', togri: true },
      { matn: 'Qotishma', togri: false },
      { matn: 'Suspenziya', togri: false },
    ],
    izoh: 'Gaz muhitida suyuq yoki qattiq zarrachalarning tarqalishi aerozol deyiladi.',
  },
  {
    id: '6-1-3',
    savol: 'Fe va S aralashmasida boshlang‘ich moddalarning xossalari qanday bo‘ladi?',
    variantlar: [
      { matn: 'Oltingugurt magnitga tortila boshlaydi', togri: false },
      { matn: 'Ikkalasi ham gazga aylanadi', togri: false },
      { matn: 'O‘z xossalarini saqlaydi (masalan, Fe magnitga tortiladi)', togri: true },
      { matn: 'Butunlay yo‘qolib yangi modda hosil bo‘ladi', togri: false },
    ],
    izoh: 'Aralashmada yangi kimyoviy bog‘lanish bo‘lmagani uchun xossalar saqlanadi.',
  },
]

// ============================================================
// 1-KO'RGAZMA: MOLEKULYAR LABORATORIYA (ODDIY / MURAKKAB / ARALASHMA)
// ============================================================
function MolekulyarLabCanvas() {
  const [rejim, setRejim] = useState('oddiy') // 'oddiy' | 'murakkab' | 'aralashma'
  const [tezlik, setTezlik] = useState(2)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.0014 * tezlik

      const cx = w * 0.5
      const cy = h * 0.52
      const boxW = w * 0.72
      const boxH = h * 0.66
      const bx = cx - boxW / 2
      const by = cy - boxH / 2

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
      ctx.strokeStyle = rejim === 'oddiy' ? '#38bdf8' : rejim === 'murakkab' ? '#34d399' : '#facc15'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(bx, by, boxW, boxH, 20)
      ctx.fill()
      ctx.stroke()

      const chizIkkiAtom = (x, y, rang1, rang2, label1, label2, ang) => {
        const dx = Math.cos(ang) * 11
        const dy = Math.sin(ang) * 11
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(x - dx, y - dy)
        ctx.lineTo(x + dx, y + dy)
        ctx.stroke()
        chizZarracha(ctx, x - dx, y - dy, 10, rang1, label1)
        chizZarracha(ctx, x + dx, y + dy, 10, rang2, label2)
      }

      const chizH2O = (x, y, ang) => {
        const h1x = x + Math.cos(ang + 0.9) * 16
        const h1y = y + Math.sin(ang + 0.9) * 16
        const h2x = x + Math.cos(ang - 0.9) * 16
        const h2y = y + Math.sin(ang - 0.9) * 16
        chizZarracha(ctx, x, y, 12, '#ef4444', 'O')
        chizZarracha(ctx, h1x, h1y, 7, '#e2e8f0', 'H')
        chizZarracha(ctx, h2x, h2y, 7, '#e2e8f0', 'H')
      }

      for (let i = 0; i < 8; i++) {
        const px = bx + 48 + ((i * 93 + Math.sin(t + i * 1.1) * 32) % Math.max(80, boxW - 96))
        const py = by + 44 + ((i * 61 + Math.cos(t * 0.9 + i * 1.4) * 26) % Math.max(70, boxH - 88))
        const ang = t * 0.7 + i

        if (rejim === 'oddiy') {
          chizIkkiAtom(px, py, '#ef4444', '#ef4444', 'O', 'O', ang)
        } else if (rejim === 'murakkab') {
          chizH2O(px, py, ang)
        } else {
          if (i % 2 === 0) chizIkkiAtom(px, py, '#ef4444', '#ef4444', 'O', 'O', ang)
          else chizIkkiAtom(px, py, '#38bdf8', '#38bdf8', 'N', 'N', ang)
        }
      }

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        rejim === 'oddiy'
          ? 'ODDIY MODDA (O₂): Faqat bir xil element atomlaridan tuzilgan'
          : rejim === 'murakkab'
          ? 'MURAKKAB MODDA (H₂O): Har xil atomlar kimyoviy bog‘langan'
          : 'ARALASHMA (O₂ + N₂): Ikki xil mustaqil molekula aralashgan',
        cx,
        by - 12
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [rejim, tezlik])

  return (
    <KorgazmaRamka
      sarlavha="1. Molekulyar taqqoslash: Oddiy, Murakkab va Aralashma"
      qisqaFormula={rejim === 'oddiy' ? 'O₂ (1 xil atom)' : rejim === 'murakkab' ? 'H₂O (2 xil atom, 1 xil molekula)' : 'O₂ + N₂ (har xil molekulalar)'}
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setRejim('oddiy'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${rejim === 'oddiy' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Oddiy modda (O₂)
          </button>
          <button
            type="button"
            onClick={() => { setRejim('murakkab'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${rejim === 'murakkab' ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Murakkab modda (H₂O)
          </button>
          <button
            type="button"
            onClick={() => { setRejim('aralashma'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${rejim === 'aralashma' ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Aralashma (O₂ + N₂)
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Harakat: {tezlik}x</span>
            <input type="range" min={1} max={5} value={tezlik} onChange={(e) => setTezlik(Number(e.target.value))} className="accent-cyan-400" />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Oddiy modda: 1 xil element atomi (O₂, Fe)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Murakkab modda: 1 xil molekula, ≥2 xil atom
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Aralashma: Har xil molekulalar bir idishda
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: Fe + S ARALASHMA VS FeS BIRIKMA (SUV VA MAGNIT SINOVI)
// ============================================================
function TemirOltingugurtSinovCanvas() {
  const [holat, setHolat] = useState('aralashma') // 'aralashma' | 'qizdirish'
  const [sinov, setSinov] = useState('suv') // 'suv' | 'magnit'
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

      const stX = w * 0.28
      const stY = h * 0.16
      const stW = w * 0.44
      const stH = h * 0.68

      if (sinov === 'suv') {
        chizStakan(ctx, stX, stY, stW, stH, {
          suyuqlikRang: 'rgba(56, 189, 248, 0.3)',
          tolish: 0.78,
          sarlavha: holat === 'aralashma' ? 'SUV SINOVI: Fe + S aralashmasi' : 'SUV SINOVI: FeS birikmasi',
          yorliq: holat === 'aralashma' ? 'S (yengil) yuqoriga suzadi, Fe cho‘kadi!' : 'Yagona FeS to‘liq tubga cho‘kadi!',
        })

        if (holat === 'aralashma') {
          for (let i = 0; i < 14; i++) {
            const x = stX + 20 + ((i * 29) % Math.max(30, stW - 40))
            // S suzadi
            chizZarracha(ctx, x, stY + stH * 0.22 + Math.sin(t + i) * 3, 5.5, '#facc15', 'S')
            // Fe cho'kadi
            chizZarracha(ctx, x, stY + stH - 14 - (i % 2) * 8, 6, '#64748b', 'Fe')
          }
        } else {
          for (let i = 0; i < 18; i++) {
            const x = stX + 18 + ((i * 27) % Math.max(30, stW - 36))
            chizZarracha(ctx, x, stY + stH - 14 - (i % 3) * 8, 6.5, '#1e293b', '')
          }
        }
      } else {
        // Magnit sinovi
        const mx = w * 0.5
        const my = h * 0.2
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.roundRect(mx - 44, my, 44, 28, [8, 0, 0, 8])
        ctx.fill()
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(mx, my, 44, 28, [0, 8, 8, 0])
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText('MAGNIT SINOVI', mx, my - 10)

        for (let i = 0; i < 14; i++) {
          const px = w * 0.3 + i * (w * 0.4 / 14)
          if (holat === 'aralashma') {
            chizZarracha(ctx, px, h * 0.72, 6, '#facc15', 'S')
            chizZarracha(ctx, mx - 25 + (i % 5) * 12, my + 38 + Math.floor(i / 5) * 10, 6, '#94a3b8', 'Fe')
          } else {
            chizZarracha(ctx, px, h * 0.72, 7, '#334155', '')
          }
        }
        ctx.fillStyle = holat === 'aralashma' ? '#34d399' : '#f87171'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(
          holat === 'aralashma'
            ? 'Magnit Fe ni tortib oldi — fizik ajratish mumkin!'
            : 'FeS birikmasi — magnit ta’sir qilmaydi!',
          w / 2,
          h * 0.88
        )
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [holat, sinov])

  return (
    <KorgazmaRamka
      sarlavha="2. Fe + S aralashma vs qizdirilgan FeS birikma"
      qisqaFormula={holat === 'aralashma' ? 'Fe + S (Fizik aralashma)' : 'Fe + S —(t°)→ FeS (Kimyoviy birikma)'}
      ikon="olov"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setHolat('aralashma'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === 'aralashma' ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            1. Oddiy aralashma (Fe + S)
          </button>
          <button
            type="button"
            onClick={() => { setHolat('qizdirish'); tovushChiqar('bosqich') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === 'qizdirish' ? 'bg-orange-400 text-slate-950 border-orange-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            2. Qizdirish → FeS birikmasi
          </button>
          <button
            type="button"
            onClick={() => { setSinov((s) => (s === 'suv' ? 'magnit' : 'suv')); tovushChiqar('tasdiq') }}
            className="ml-auto px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
          >
            Sinov: {sinov === 'suv' ? 'Suvga solish' : 'Magnit tutish'}
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Fe + S: Suvda S yuzadi, Fe cho‘kadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            FeS: Magnitga tortilmaydi, bir xil cho‘kadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Reaksiya belgisi: issiqlik va qora tus
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: QALDIROQ GAZ (H₂ + O₂) VS SUV (H₂O)
// ============================================================
function VodorodKislorodCanvas() {
  const [holat, setHolat] = useState('aralashma') // 'aralashma' | 'uchqun' | 'suv'
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.0025

      const cx = w * 0.5
      const cy = h * 0.5
      const r = Math.min(w, h) * 0.34

      // Idish doira / kolba
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = holat === 'uchqun' ? 'rgba(249, 115, 22, 0.3)' : holat === 'suv' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(15, 23, 42, 0.7)'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = holat === 'uchqun' ? '#fb923c' : holat === 'suv' ? '#38bdf8' : '#facc15'
      ctx.stroke()
      ctx.clip()

      if (holat === 'aralashma') {
        for (let i = 0; i < 12; i++) {
          const ang = t + i * 0.9
          const px = cx + Math.cos(ang * 1.1) * (r * 0.65)
          const py = cy + Math.sin(ang * 0.8 + i) * (r * 0.6)
          if (i % 3 === 0) chizZarracha(ctx, px, py, 10, '#ef4444', 'O')
          else chizZarracha(ctx, px, py, 7, '#e2e8f0', 'H')
        }
      } else if (holat === 'uchqun') {
        const zarba = (Math.sin(t * 6) + 1) * 0.5
        ctx.fillStyle = `rgba(251, 146, 60, ${0.35 + zarba * 0.4})`
        ctx.beginPath()
        ctx.arc(cx, cy, r * (0.4 + zarba * 0.5), 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fef08a'
        ctx.font = 'bold 20px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText('PORTLASH! 2H₂ + O₂ → 2H₂O', cx, cy + 6)
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'
        ctx.fillRect(cx - r, cy + r * 0.1, r * 2, r)
        for (let i = 0; i < 9; i++) {
          const px = cx - r * 0.55 + (i % 5) * (r * 0.27)
          const py = cy + r * 0.35 + Math.floor(i / 5) * 28 + Math.sin(t + i) * 3
          chizZarracha(ctx, px, py, 9, '#ef4444', 'O')
          chizZarracha(ctx, px - 10, py + 7, 5, '#ffffff', 'H')
          chizZarracha(ctx, px + 10, py + 7, 5, '#ffffff', 'H')
        }
      }
      ctx.restore()

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        holat === 'aralashma'
          ? 'H₂ + O₂ aralashmasi — o‘ta portlovchi gaz!'
          : holat === 'uchqun'
          ? 'Uchqunda kuchli portlash bilan reaksiyaga kirishadi!'
          : 'Hosil bo‘lgan H₂O — aksincha, olovni o‘chiradi!',
        cx,
        h * 0.94
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [holat])

  return (
    <KorgazmaRamka
      sarlavha="3. Qaldiroq gaz (H₂ + O₂) va Suv (H₂O) — xossalar keskin farqi"
      qisqaFormula="2H₂ (yonuvchi) + O₂ (yondiruvchi) → 2H₂O (o‘chiruvchi)"
      ikon="uchqun"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setHolat('aralashma'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === 'aralashma' ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            H₂ + O₂ Aralashma
          </button>
          <button
            type="button"
            onClick={() => { setHolat('uchqun'); tovushChiqar('xavf') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === 'uchqun' ? 'bg-orange-500 text-slate-950 border-orange-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Uchqun berish!
          </button>
          <button
            type="button"
            onClick={() => { setHolat('suv'); tovushChiqar('togri') }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${holat === 'suv' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Natija: H₂O (Suv)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            H₂: Yonadi | O₂: Yonishga yordam beradi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            H₂O: Yonmaydi, o‘tni o‘chiradi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Birikmada mutlaqo yangi xossa paydo bo‘ladi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: DOIMIY TARKIB QONUNI VS IXTIYORIY NISBAT
// ============================================================
function DoimiyTarkibCanvas() {
  const [tuzFoiz, setTuzFoiz] = useState(25)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      // Chap: Aralashma (istalgan foizda mumkin)
      const lx = w * 0.08
      const ly = h * 0.22
      const bw = w * 0.36
      const bh = h * 0.5

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(lx, ly, bw, bh, 14)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('ARALASHMA (Tuz + Suv)', lx + bw / 2, ly - 10)

      const barW = bw - 40
      const tuzW = (barW * tuzFoiz) / 100
      ctx.fillStyle = '#facc15'
      ctx.fillRect(lx + 20, ly + 44, tuzW, 40)
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(lx + 20 + tuzW, ly + 44, barW - tuzW, 40)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(`Tuz: ${tuzFoiz}%   |   Suv: ${100 - tuzFoiz}%`, lx + bw / 2, ly + 110)
      ctx.fillStyle = '#34d399'
      ctx.fillText('Istalgan nisbatda aralashtirish mumkin!', lx + bw / 2, ly + 145)

      // O'ng: Murakkab modda H₂O (qat'iy 11.1% H + 88.9% O)
      const rx = w * 0.56
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = '#34d399'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, ly, bw, bh, 14)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText('MURAKKAB MODDA (H₂O)', rx + bw / 2, ly - 10)

      const hW = barW * 0.111
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(rx + 20, ly + 44, hW, 40)
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(rx + 20 + hW, ly + 44, barW - hW, 40)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText('H: 11.1%   |   O: 88.9% (m = 1 : 8)', rx + bw / 2, ly + 110)
      ctx.fillStyle = '#7dd3fc'
      ctx.fillText('Tarkib qat’iy o‘zgarmas (Doimiy tarkib qonuni)!', rx + bw / 2, ly + 145)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [tuzFoiz])

  return (
    <KorgazmaRamka
      sarlavha="4. Doimiy tarkib qonuni (Murakkab modda) vs Ixtiyoriy tarkib (Aralashma)"
      qisqaFormula="H₂O da doim m(H):m(O) = 1:8 | Tuzli suvda: 1%..35%"
      ikon="nizom"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-amber-300">
            Aralashmadagi tuz ulushini o‘zgartiring: {tuzFoiz}%
          </span>
          <input
            type="range"
            min={5}
            max={65}
            value={tuzFoiz}
            onChange={(e) => setTuzFoiz(Number(e.target.value))}
            className="flex-1 accent-yellow-400 cursor-pointer"
          />
        </div>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Aralashma tarkibi o‘zgaruvchan
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Kimyoviy birikma tarkibi qat’iy doimiy
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Suv qayerda olinmasin — formulasi H₂O
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: FIZIK KONSTANTALAR (QAYNASH VA ERISH HARORATI)
// ============================================================
function FizikKonstantaCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const canvasRef = useRef(null)

  const moddalar = [
    { nom: 'Temir (Oddiy modda)', formula: 'Fe', tErish: 1538, tQay: 2862, tur: 'Doimiy nuqta', rang: '#38bdf8' },
    { nom: 'Distillangan suv (Murakkab)', formula: 'H₂O', tErish: 0, tQay: 100, tur: 'Doimiy nuqta', rang: '#34d399' },
    { nom: 'Neft (Murakkab aralashma)', formula: 'CₙHₘ + ...', tErish: -40, tQay: '40°C – 350°C', tur: 'Keng harorat oralig‘i', rang: '#f59e0b' },
  ]
  const faol = moddalar[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      const tVal = typeof faol.tQay === 'number' ? Math.min(120, Math.max(10, faol.tQay / 25)) : 85
      chizTermometr(ctx, w * 0.22, h * 0.2, h * 0.56, tVal, 120, faol.rang)

      const rx = w * 0.38
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = faol.rang
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.18, w * 0.54, h * 0.62, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText(faol.nom, rx + 24, h * 0.29)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`Kimyoviy yozilishi: ${faol.formula}`, rx + 24, h * 0.42)

      ctx.fillStyle = '#cbd5e1'
      ctx.fillText(`Erish harorati: ${faol.tErish}°C`, rx + 24, h * 0.54)
      ctx.fillText(`Qaynash harorati: ${faol.tQay}${typeof faol.tQay === 'number' ? '°C' : ''}`, rx + 24, h * 0.64)

      ctx.fillStyle = faol.rang
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`Xulosa: ${faol.tur}`, rx + 24, h * 0.74)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [faol])

  return (
    <KorgazmaRamka
      sarlavha="5. Fizik doimiylar bo‘yicha ajratish: Aniq nuqta vs Oraliq"
      qisqaFormula={`${faol.formula} → ${faol.tur}`}
      ikon="harorat"
      boshqaruv={
        <>
          {moddalar.map((m, i) => (
            <button
              key={m.nom}
              type="button"
              onClick={() => { setTanlov(i); tovushChiqar('tasdiq') }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${tanlov === i ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
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
// 6-KO'RGAZMA: QOTISHMA (BRONZA) VS BIRIKMA (CuO)
// ============================================================
function QotishmaVaBirikmaCanvas() {
  const [rejim, setRejim] = useState('qotishma')
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
      const cy = h * 0.48
      const cols = 6
      const rows = 4
      const spacing = 42
      const startX = cx - ((cols - 1) * spacing) / 2
      const startY = cy - ((rows - 1) * spacing) / 2

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing + Math.sin(t + r + c) * 1.5
          const y = startY + r * spacing
          if (rejim === 'qotishma') {
            const isSn = (r + c) % 4 === 1
            chizZarracha(ctx, x, y, 13, isSn ? '#94a3b8' : '#ea580c', isSn ? 'Sn' : 'Cu')
          } else {
            const isO = (r + c) % 2 === 1
            chizZarracha(ctx, x, y, isO ? 10 : 13, isO ? '#ef4444' : '#f97316', isO ? 'O' : 'Cu')
          }
        }
      }

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        rejim === 'qotishma'
          ? 'BRONZA (Cu + Sn qotishmasi): Aralashma — metall yaltiroqligi va egiluvchanligi saqlangan'
          : 'MIS(II) OKSID (CuO): Murakkab modda — qora mo‘rt kukun, Cu va O bog‘langan',
        cx,
        h * 0.88
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [rejim])

  return (
    <KorgazmaRamka
      sarlavha="6. Qotishma (Aralashma) vs Kimyoviy birikma panjarasi"
      qisqaFormula={rejim === 'qotishma' ? 'Cu + Sn (Qattiq eritma / aralashma)' : 'CuO (Doimiy 1:1 birikma)'}
      ikon="kristall"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setRejim('qotishma'); tovushChiqar('tasdiq') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${rejim === 'qotishma' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Bronza qotishmasi (Aralashma)
          </button>
          <button
            type="button"
            onClick={() => { setRejim('birikma'); tovushChiqar('tasdiq') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${rejim === 'birikma' ? 'bg-rose-400 text-slate-950 border-rose-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Mis(II) oksid CuO (Birikma)
          </button>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// MAXSUS 3-O'YIN: MOLEKULYAR RASMNI TANI (SVG)
// ============================================================
const MOLEKULA_RASMLAR = [
  {
    savol: 'Idishda faqat bir xil qo‘shaloq qizil atomlar (O₂) uchib yuribdi. Bu nima?',
    turi: 'oddiy',
    variantlar: ['Murakkab modda', 'Oddiy moddalar aralashmasi', 'Murakkab moddalar aralashmasi', 'Oddiy modda'],
    togri: 3,
    izoh: 'Faqat bitta kimyoviy element atomlaridan (O) tashkil topgan.',
    zarrachalar: [
      { x: 60, y: 55, r1: '#ef4444', r2: '#ef4444' },
      { x: 160, y: 40, r1: '#ef4444', r2: '#ef4444' },
      { x: 120, y: 95, r1: '#ef4444', r2: '#ef4444' },
    ],
  },
  {
    savol: 'Idishda bir xil uch atomli (1 qizil + 2 oq = H₂O) molekulalar bor. Bu nima?',
    turi: 'murakkab',
    variantlar: ['Oddiy modda', 'Murakkab modda', 'Gazlar aralashmasi', 'Suspenziya'],
    togri: 1,
    izoh: 'Hamma molekulalar bir xil, lekin tarkibida 2 xil element atomi bor — murakkab modda.',
    zarrachalar: [
      { x: 65, y: 55, r1: '#ef4444', r2: '#e2e8f0', uch: true },
      { x: 165, y: 65, r1: '#ef4444', r2: '#e2e8f0', uch: true },
    ],
  },
  {
    savol: 'Idishda ham qo‘shaloq ko‘k (N₂), ham qo‘shaloq qizil (O₂) molekulalar aralashib yuribdi. Bu nima?',
    turi: 'aralashma',
    variantlar: ['Kimyoviy birikma', 'Oddiy modda', 'Murakkab modda', 'Aralashma'],
    togri: 3,
    izoh: 'Har xil molekulalar o‘zaro birikmasdan bir idishda joylashgan — aralashma.',
    zarrachalar: [
      { x: 60, y: 45, r1: '#38bdf8', r2: '#38bdf8' },
      { x: 155, y: 45, r1: '#ef4444', r2: '#ef4444' },
      { x: 105, y: 95, r1: '#38bdf8', r2: '#38bdf8' },
    ],
  },
  {
    savol: 'Idishda suv molekulalari (H₂O) orasida Na⁺ va Cl⁻ ionlari suzib yuribdi. Bu nima?',
    turi: 'aralashma',
    variantlar: ['Aralashma (Eritma)', 'Sof element', 'Oddiy modda', 'Murakkab modda'],
    togri: 0,
    izoh: 'Suv va erigan tuz ionlari birgalikda gomogen aralashma (eritma) hosil qiladi.',
    zarrachalar: [
      { x: 60, y: 55, r1: '#ef4444', r2: '#e2e8f0', uch: true },
      { x: 150, y: 55, r1: '#facc15', r2: '#34d399' },
    ],
  },
]

function MolekulyarRasmOyini() {
  const [indeks, setIndeks] = useState(0)
  const [ball, setBall] = useState(0)
  const [tanlangan, setTanlangan] = useState(null)
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  const joriy = MOLEKULA_RASMLAR[indeks]
  const aralash = joriy ? indekslanganVariantlarniAralashtir(joriy, raund) : { variantlar: [], togri: 0 }

  const tanla = (idx) => {
    if (tanlangan !== null) return
    setTanlangan(idx)
    if (idx === aralash.togri) {
      tovushChiqar('togri')
      setBall((b) => b + 20)
    } else {
      tovushChiqar('xato')
    }
  }

  const keyingi = () => {
    if (indeks + 1 < MOLEKULA_RASMLAR.length) {
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
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center text-yellow-300">
          <Ikon nom="kubok" olcham={30} />
        </div>
        <h4 className="text-2xl font-extrabold text-white">Molekulyar Rasm Sinovi Yakunlandi!</h4>
        <div className="text-3xl font-black text-emerald-400">{ball} / {MOLEKULA_RASMLAR.length * 20} ball</div>
        <button
          type="button"
          onClick={() => { setIndeks(0); setBall(0); setTanlangan(null); setTugadi(false); setRaund((r) => r + 1) }}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold"
        >
          Qayta o‘ynash
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#050b24] border border-blue-800/60 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-cyan-300">Molekulyar Rastrni Tani ({indeks + 1}/{MOLEKULA_RASMLAR.length})</span>
        <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-bold">Ball: {ball}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="p-3 rounded-2xl bg-[#030712] border border-cyan-500/40 flex justify-center">
          <svg viewBox="0 0 220 130" className="w-full max-w-[240px] h-32">
            <rect x="8" y="8" width="204" height="114" rx="16" fill="#071128" stroke="#334155" strokeWidth="2" />
            {joriy.zarrachalar.map((z, k) => (
              <g key={k}>
                <circle cx={z.x - 10} cy={z.y} r="11" fill={z.r1} />
                <circle cx={z.x + 12} cy={z.y} r={z.uch ? 8 : 11} fill={z.r2} />
                {z.uch && <circle cx={z.x - 24} cy={z.y + 10} r="8" fill={z.r2} />}
              </g>
            ))}
          </svg>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-lg font-extrabold text-white">{joriy.savol}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {aralash.variantlar.map((v, vIdx) => (
              <button
                key={v}
                type="button"
                disabled={tanlangan !== null}
                onClick={() => tanla(vIdx)}
                className={`p-3.5 rounded-xl border text-left font-bold text-sm transition ${
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
// O'YINLAR DATA (6.2)
// ============================================================
const OYIN1_GURUHLAR = [
  { id: 'oddiy', nom: 'ODDIY MODDA', tavsif: '1 xil element atomi' },
  { id: 'murakkab', nom: 'MURAKKAB MODDA', tavsif: '≥2 xil atom, 1 xil formula' },
  { id: 'aralashma', nom: 'ARALASHMA', tavsif: 'Har xil moddalar yig‘indisi' },
]

const OYIN1_NAMUNALAR = [
  { nom: 'Kislorod (O₂)', qisqa: 'Faqat O atomlari', guruh: 'oddiy', izoh: 'Bir xil element atomlaridan iborat sof modda.' },
  { nom: 'Distillangan suv (H₂O)', qisqa: 'H va O kimyoviy bog‘langan', guruh: 'murakkab', izoh: 'Ikki xil elementdan tuzilgan individual modda.' },
  { nom: 'Atmosfera havosi', qisqa: 'N₂ + O₂ + Ar + CO₂', guruh: 'aralashma', izoh: 'Gazlarning bir jinsli mexanik aralashmasi.' },
  { nom: 'Ozon (O₃)', qisqa: 'Uchta kislorod atomi', guruh: 'oddiy', izoh: 'Nechta atom bo‘lishidan qat’i nazar, 1 xil element bo‘lsa oddiy moddadir.' },
  { nom: 'Osh tuzi (NaCl)', qisqa: 'Natriy va xlor birikmasi', guruh: 'murakkab', izoh: 'Qat’iy tarkibli kimyoviy birikma.' },
  { nom: 'Dengiz suvi', qisqa: 'H₂O + NaCl + MgCl₂', guruh: 'aralashma', izoh: 'Suv va bir necha tuzlar aralashmasi.' },
  { nom: 'Temir (Fe)', qisqa: 'Sof metall', guruh: 'oddiy', izoh: 'Faqat temir atomlaridan tuzilgan.' },
  { nom: 'Po‘lat qotishmasi', qisqa: 'Fe + C + Cr', guruh: 'aralashma', izoh: 'Metall qotishmalari aralashmalar qatoriga kiradi.' },
  { nom: 'Karbonat angidrid (CO₂)', qisqa: 'Uglerod va kislorod', guruh: 'murakkab', izoh: '1 ta C va 2 ta O atomi birikkan murakkab modda.' },
]

const OYIN2_GURUHLAR = [
  { id: 'sof', nom: 'Sof modda (Oddiy / Murakkab)', tavsif: 'Doimiy tarkib va T_qay' },
  { id: 'aralashma', nom: 'Aralashma', tavsif: 'O‘zgaruvchan tarkib' },
]

const OYIN2_XOSALAR = [
  { nom: 'Qat’iy kimyoviy formula bilan yoziladi (masalan H₂SO₄)', qisqa: 'Tarkibi o‘zgarmas', guruh: 'sof', izoh: 'Faqat sof moddalar aniq kimyoviy formulaga ega.' },
  { nom: 'Tashkil etuvchilarini magnit yoki filtr bilan ajratish mumkin', qisqa: 'Fizik usul', guruh: 'aralashma', izoh: 'Aralashma tarkibi fizik usullarda ajraladi.' },
  { nom: 'Qaynash va erish harorati aniq bir nuqtada doimiy turadi', qisqa: '0°C va 100°C kabi', guruh: 'sof', izoh: 'Sof moddalar o‘zgarmas fizik konstantalarga ega.' },
  { nom: 'Komponentlarini xohlagan nisbatda qo‘shish mumkin', qisqa: '5% yoki 40%', guruh: 'aralashma', izoh: 'Aralashmalar doimiy tarkib qonuniga bo‘ysunmaydi.' },
  { nom: 'Hosil bo‘lishida ko‘pincha issiqlik chiqadi va xossalar keskin o‘zgaradi', qisqa: '2H₂ + O₂ → 2H₂O', guruh: 'sof', izoh: 'Kimyoviy birikma (murakkab modda) hosil bo‘lish belgisi.' },
]

const DUEL_6_2 = [
  { savol: 'O₂, O₃ va Fe qaysi moddalar guruhiga kiradi?', variantlar: ['Murakkab moddalar', 'Aralashmalar', 'Eritmalar', 'Oddiy moddalar'], togri: 3, izoh: 'Ularning har biri faqat bitta kimyoviy element atomlaridan iborat.' },
  { savol: 'Nima uchun havo murakkab modda emas, balki aralashma hisoblanadi?', variantlar: ['Tarkibidagi N₂ va O₂ kimyoviy birikmagan va nisbati o‘zgaruvchan', 'Chunki havo ko‘rinmaydi', 'Chunki u suyuq emas', 'Faqat N₂ borligi uchun'], togri: 0, izoh: 'Havodagi gazlar mustaqil molekulalar sifatida aralashib yuradi.' },
  { savol: 'Qaysi qatorda faqat murakkab moddalar berilgan?', variantlar: ['Cu, Zn, H₂', 'H₂O, CO₂, NaCl', 'O₂, Fe, H₂O', 'Havo, neft, suv'], togri: 1, izoh: 'Suv, karbonat angidrid va osh tuzi ≥2 xil elementdan iborat.' },
  { savol: 'Fe + S aralashmasini qizdirganda hosil bo‘lgan FeS qaysi turga kiradi?', variantlar: ['Geterogen aralashma', 'Aerozol', 'Murakkab modda (kimyoviy birikma)', 'Oddiy modda'], togri: 2, izoh: 'Fe va S atomlari kimyoviy bog‘lanib yangi murakkab modda hosil qiladi.' },
  { savol: 'Qaysi birining yagona kimyoviy formulasi mavjud EMAS?', variantlar: ['Osh tuzi', 'Distillangan suv', 'Kislorod gazi', 'Dengiz suvi va Neft'], togri: 3, izoh: 'Aralashmalar yagona formula bilan yozilmaydi.' },
  { savol: 'Suvning (H₂O) tarkibida vodorod va kislorod massalari nisbati qanday?', variantlar: ['Doimiy 1 : 8', 'Ixtiyoriy 5%..90%', 'Doimiy 1 : 1', 'O‘zgarib turadi'], togri: 0, izoh: 'Murakkab moddalar doimiy tarkib qonuniga bo‘ysunadi.' },
]

export default function Mavzu6_2() {
  const korgazmalar = [
    { nom: '1. Molekulyar lab', ikon: 'atom', komponent: <MolekulyarLabCanvas /> },
    { nom: '2. Fe + S vs FeS', ikon: 'olov', komponent: <TemirOltingugurtSinovCanvas /> },
    { nom: '3. H₂ + O₂ vs H₂O', ikon: 'uchqun', komponent: <VodorodKislorodCanvas /> },
    { nom: '4. Doimiy tarkib', ikon: 'nizom', komponent: <DoimiyTarkibCanvas /> },
    { nom: '5. T_qay & T_erish', ikon: 'harorat', komponent: <FizikKonstantaCanvas /> },
    { nom: '6. Bronza vs CuO', ikon: 'kristall', komponent: <QotishmaVaBirikmaCanvas /> },
  ]

  const oyinlar = [
    { nom: '1. 3 Guruhga Ajrat', ikon: 'palitra', komponent: <GuruhlashOyini nom="Oddiy / Murakkab / Aralashma" ikon="palitra" guruhlar={OYIN1_GURUHLAR} topshiriqlar={OYIN1_NAMUNALAR} /> },
    { nom: '2. Xossani Top', ikon: 'nizom', komponent: <GuruhlashOyini nom="Sof Moddami yoki Aralashma?" ikon="nizom" guruhlar={OYIN2_GURUHLAR} topshiriqlar={OYIN2_XOSALAR} /> },
    { nom: '3. Molekula Rasmi', ikon: 'atom', komponent: <MolekulyarRasmOyini /> },
    { nom: '4. Jamoalar Dueli', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="6.2 Farqlash Dueli" savollar={DUEL_6_2} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="6.2"
      mavzuNom="Oddiy moddalar, murakkab moddalar va aralashmalarni o'zaro farqlash"
      oldingiRaqam="6.1"
      oldingiNom="Aralashmalar"
      takrorlashSavollar={TAKRORLASH_6_1}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
