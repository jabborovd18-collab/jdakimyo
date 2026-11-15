'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 6-BOB, 6.3-MAVZU
// "Aralashmalarni ajratish" (Darslik 101-bet)
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
  chizTermometr,
  TezkorTanlovOyini,
  GuruhlashOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_6_2 = [
  {
    id: '6-2-1',
    savol: 'Qaysi qatorda faqat oddiy moddalar keltirilgan?',
    variantlar: [
      { matn: 'O₂, Fe, O₃ (ozon), N₂', togri: true },
      { matn: 'H₂O, O₂, CO₂', togri: false },
      { matn: 'Havo, neft, suv', togri: false },
      { matn: 'NaCl, CuO, Fe', togri: false },
    ],
    izoh: 'Oddiy moddalar faqat bir xil kimyoviy element atomlaridan tashkil topadi.',
  },
  {
    id: '6-2-2',
    savol: 'Murakkab moddaning (kimyoviy birikmaning) asosiy belgisi qaysi?',
    variantlar: [
      { matn: 'Faqat bitta element atomidan tuzilishi', togri: false },
      { matn: 'Doimiy tarkib va har xil atomlardan tuzilgan yagona formula', togri: true },
      { matn: 'Komponentlar istalgan nisbatda qo‘shilishi', togri: false },
      { matn: 'Fizik usulda oson ajralishi', togri: false },
    ],
    izoh: 'Murakkab modda ≥2 xil element atomlarining kimyoviy birikishidan hosil bo‘ladi.',
  },
  {
    id: '6-2-3',
    savol: 'H₂ va O₂ gazlarining oddiy aralashmasi qanday xavfga ega?',
    variantlar: [
      { matn: 'Olovni o‘chiradi', togri: false },
      { matn: 'Magnitga yopishadi', togri: false },
      { matn: 'Uchqun tushganda kuchli portlaydi (qaldiroq gaz)', togri: true },
      { matn: 'Darhol muzlab qoladi', togri: false },
    ],
    izoh: '2H₂ + O₂ aralashmasi portlaydi, ulardan hosil bo‘lgan H₂O birikmasi esa olovni o‘chiradi.',
  },
]

// ============================================================
// 1-KO'RGAZMA: MAGNIT BILAN AJRATISH
// ============================================================
function MagnitAjratishCanvas() {
  const [magnitYoqilgan, setMagnitYoqilgan] = useState(false)
  const [aralashma, setAralashma] = useState('qum') // 'qum' | 'oltingugurt'
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

      // Magnit tepada
      const mx = w * 0.5
      const my = magnitYoqilgan ? h * 0.24 : h * 0.1
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.roundRect(mx - 54, my, 54, 28, [8, 0, 0, 8])
      ctx.fill()
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.roundRect(mx, my, 54, 28, [0, 8, 8, 0])
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', mx - 27, my + 18)
      ctx.fillText('S', mx + 27, my + 18)

      if (magnitYoqilgan) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)'
        ctx.lineWidth = 2
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath()
          ctx.arc(mx, my + 28, r * 26 + ((t * 15) % 15), 0.15 * Math.PI, 0.85 * Math.PI)
          ctx.stroke()
        }
      }

      // Pastki idish
      const lx = w * 0.22
      const ly = h * 0.66
      const lw = w * 0.56
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(lx, ly, lw, 52, 12)
      ctx.fill()
      ctx.stroke()

      const ikkinchiRang = aralashma === 'qum' ? '#d97706' : '#facc15'
      const ikkinchiBelgi = aralashma === 'qum' ? 'SiO₂' : 'S'

      for (let i = 0; i < 14; i++) {
        const x = lx + 25 + (i * (lw - 50)) / 13
        chizZarracha(ctx, x, ly + 32 + (i % 2) * 5, 6.5, ikkinchiRang, '')
        if (magnitYoqilgan) {
          const fx = mx - 42 + (i % 7) * 14
          const fy = my + 38 + Math.floor(i / 7) * 12
          chizZarracha(ctx, fx, fy, 6, '#94a3b8', 'Fe')
        } else {
          chizZarracha(ctx, x + 6, ly + 22, 6, '#94a3b8', 'Fe')
        }
      }

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        magnitYoqilgan
          ? `Temir qipig‘i (Fe) magnitga tortildi — ${aralashma === 'qum' ? 'Qum' : 'Oltingugurt'} pastda qoldi!`
          : 'Magnitni tushiring — Fe magnitga tortiladi',
        w / 2,
        h * 0.9
      )
      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.fillText(ikkinchiBelgi, w * 0.16, ly + 32)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [magnitYoqilgan, aralashma])

  return (
    <KorgazmaRamka
      sarlavha="1. Magnitlash: Magnit xossali moddalarni ajratish"
      qisqaFormula={aralashma === 'qum' ? 'Fe + Qum (SiO₂)' : 'Fe + Oltingugurt (S)'}
      ikon="magnit"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setMagnitYoqilgan((v) => !v); tovushChiqar('bosqich') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${magnitYoqilgan ? 'bg-rose-500 text-white border-rose-300' : 'bg-emerald-500 text-slate-950 border-emerald-300'}`}
          >
            {magnitYoqilgan ? 'Magnitni ko‘tarish (Qayta)' : 'Magnitni yaqinlashtirish!'}
          </button>
          <button
            type="button"
            onClick={() => { setAralashma('qum'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${aralashma === 'qum' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Temir + Qum
          </button>
          <button
            type="button"
            onClick={() => { setAralashma('oltingugurt'); tovushChiqar('tasdiq') }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${aralashma === 'oltingugurt' ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
          >
            Temir + Oltingugurt
          </button>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: FILTRLASH (VORONKA + FILTR QOG'OZI + FILTRAT)
// ============================================================
function FiltrlashCanvas() {
  const [jarayon, setJarayon] = useState(55) // 0..100
  const [ishlamoqda, setIshlamoqda] = useState(true)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!ishlamoqda) return
    const id = setInterval(() => {
      setJarayon((v) => (v >= 100 ? 100 : v + 2))
    }, 90)
    return () => clearInterval(id)
  }, [ishlamoqda])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.003
      const nisbat = jarayon / 100

      // Yuqori quyiladigan loyqa suv stakan
      chizStakan(ctx, w * 0.14, h * 0.12, 96, 95, {
        suyuqlikRang: 'rgba(180, 120, 60, 0.5)',
        tolish: Math.max(0.05, 0.85 - nisbat * 0.8),
        sarlavha: 'Loyqa suv',
      })

      // Voronka o'rtada
      const vx = w * 0.5
      const vy = h * 0.22
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(vx - 68, vy)
      ctx.lineTo(vx - 8, vy + 76)
      ctx.lineTo(vx - 8, vy + 115)
      ctx.moveTo(vx + 68, vy)
      ctx.lineTo(vx + 8, vy + 76)
      ctx.lineTo(vx + 8, vy + 115)
      ctx.stroke()

      // Filtr qog'ozi (oq qatlam)
      ctx.strokeStyle = '#fde047'
      ctx.lineWidth = 3
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(vx - 58, vy + 6)
      ctx.lineTo(vx, vy + 72)
      ctx.lineTo(vx + 58, vy + 6)
      ctx.stroke()
      ctx.setLineDash([])

      // Qoldiq (qum) filtr ustida to'planadi
      const qoldiqSoni = Math.round(nisbat * 18)
      for (let i = 0; i < qoldiqSoni; i++) {
        const qx = vx - 30 + ((i * 19) % 60)
        const qy = vy + 52 - (i % 4) * 7
        chizZarracha(ctx, qx, qy, 5, '#d97706', '')
      }

      // Tomchilar tushishi
      if (jarayon < 100) {
        const tomchiY = vy + 118 + ((t * 50) % 45)
        chizZarracha(ctx, vx, tomchiY, 5, '#38bdf8', '')
      }

      // Pastki kolba / stakan (Toza Filtrat)
      chizStakan(ctx, vx - 55, h * 0.58, 110, 110, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.42)',
        tolish: 0.1 + nisbat * 0.72,
        sarlavha: '',
        yorliq: 'Toza FILTRAT (H₂O)',
      })

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText('Filtr qog‘ozi (g‘ovaklar)', vx + 78, vy + 36)
      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`Qoldiq (Qum): ${Math.round(nisbat * 100)}%`, vx + 78, vy + 62)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [jarayon])

  return (
    <KorgazmaRamka
      sarlavha="2. Filtrlash: Erimaydigan qattiq zarrachalarni ajratish"
      qisqaFormula="Suspenziya (Qum + Suv) → Filtr qoldig‘i + Toza Filtrat"
      ikon="filtr"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => { setJarayon(0); setIshlamoqda(true); tovushChiqar('bosqich') }}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm"
          >
            Qayta quyish!
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Filtrlash: {jarayon}%</span>
            <input type="range" min={0} max={100} value={jarayon} onChange={(e) => { setIshlamoqda(false); setJarayon(Number(e.target.value)) }} className="accent-cyan-400" />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Zarracha o‘lchami g‘ovakdan katta → qoladi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Erigan tuz (NaCl) filtrdan o‘tib ketadi!
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Toza suyuqlik «Filtrat» deb ataladi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: AJRATISH VORONKASI (ZICHLIK FARQI: YOG' + SUV)
// ============================================================
function AjratishVoronkasiCanvas() {
  const [suvBaland, setSuvBaland] = useState(50) // 0..50 ml suv voronkada
  const [kranOchiq, setKranOchiq] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!kranOchiq) return
    const id = setInterval(() => {
      setSuvBaland((v) => {
        if (v <= 0) {
          setKranOchiq(false)
          tovushChiqar('togri')
          return 0
        }
        return v - 2
      })
    }, 100)
    return () => clearInterval(id)
  }, [kranOchiq])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.004

      const vx = w * 0.45
      const vy = h * 0.1
      const suvNisbat = suvBaland / 50

      // Ajratish voronkasi konturi
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(vx - 58, vy + 24)
      ctx.quadraticCurveTo(vx - 72, vy + 90, vx - 12, vy + 138)
      ctx.lineTo(vx - 12, vy + 178)
      ctx.lineTo(vx + 12, vy + 178)
      ctx.lineTo(vx + 12, vy + 138)
      ctx.quadraticCurveTo(vx + 72, vy + 90, vx + 58, vy + 24)
      ctx.closePath()
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.clip()

      // Yog' qatlami (yuqorida, zichligi 0.92)
      const suvTop = vy + 140 - suvNisbat * 55
      ctx.fillStyle = 'rgba(250, 204, 21, 0.72)'
      ctx.fillRect(vx - 80, suvTop - 48, 160, 48)

      // Suv qatlami (pastda, zichligi 1.00)
      if (suvNisbat > 0) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)'
        ctx.fillRect(vx - 80, suvTop, 160, vy + 185 - suvTop)
      }
      ctx.restore()

      // Kran
      ctx.fillStyle = kranOchiq ? '#34d399' : '#ef4444'
      ctx.beginPath()
      ctx.roundRect(vx - 24, vy + 162, 48, 10, 4)
      ctx.fill()

      if (kranOchiq && suvBaland > 0) {
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(vx, vy + 176)
        ctx.lineTo(vx, h * 0.7 + ((t * 10) % 10))
        ctx.stroke()
      }

      // Pastki stakan
      chizStakan(ctx, vx - 46, h * 0.62, 92, 95, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.5)',
        tolish: (1 - suvNisbat) * 0.72,
        yorliq: `Ajralgan Suv: ${50 - suvBaland} ml`,
      })

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText('Yog‘ (ρ = 0.92 g/cm³) — yuqorida', vx + 84, vy + 68)
      ctx.fillStyle = '#38bdf8'
      ctx.fillText('Suv (ρ = 1.00 g/cm³) — pastda', vx + 84, vy + 112)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [suvBaland, kranOchiq])

  return (
    <KorgazmaRamka
      sarlavha="3. Ajratish voronkasi: Aralashmaydigan suyuqliklarni ajratish"
      qisqaFormula="Yog‘ + Suv → Zichligi katta modda pastga tushadi"
      ikon="tomchi"
      boshqaruv={
        <>
          <button
            type="button"
            disabled={suvBaland <= 0}
            onClick={() => { setKranOchiq((v) => !v); tovushChiqar('bosqich') }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${kranOchiq ? 'bg-rose-500 text-white border-rose-300' : 'bg-emerald-400 text-slate-950 border-emerald-300'} disabled:opacity-40`}
          >
            {kranOchiq ? 'Kranni YOPISH!' : 'Kranni OCHISH (Suvni tushir)'}
          </button>
          <button
            type="button"
            onClick={() => { setSuvBaland(50); setKranOchiq(false); tovushChiqar('tasdiq') }}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold border border-blue-700 bg-slate-900 text-blue-200"
          >
            Qayta to‘ldirish
          </button>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: BUG'LATISH VA KRISTALLASH (NaCl + H₂O)
// ============================================================
function BuglatishCanvas() {
  const [buglanish, setBuglanish] = useState(40) // 0..100%
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
      const nisbat = buglanish / 100

      const cx = w * 0.5
      const kosaY = h * 0.52

      // Spirt lampasi alangasi
      ctx.fillStyle = '#334155'
      ctx.beginPath()
      ctx.roundRect(cx - 28, kosaY + 62, 56, 36, 8)
      ctx.fill()
      if (nisbat < 1) {
        const alangaH = 26 + Math.sin(t * 5) * 4
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.moveTo(cx - 14, kosaY + 60)
        ctx.quadraticCurveTo(cx, kosaY + 60 - alangaH, cx + 14, kosaY + 60)
        ctx.fill()
      }

      // Chinni kosa
      ctx.fillStyle = 'rgba(226, 232, 240, 0.15)'
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, kosaY, 85, 0.05 * Math.PI, 0.95 * Math.PI)
      ctx.stroke()

      // Suyuqlik darajasi
      if (nisbat < 0.96) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'
        ctx.beginPath()
        ctx.arc(cx, kosaY + 8, 72 * (1 - nisbat * 0.55), 0.1 * Math.PI, 0.9 * Math.PI)
        ctx.fill()
      }

      // Tuz kristallari paydo bo'lishi
      const tuzSoni = Math.round(nisbat * 22)
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < tuzSoni; i++) {
        const kx = cx - 44 + ((i * 19) % 88)
        const ky = kosaY + 55 - (i % 3) * 8
        ctx.fillRect(kx, ky, 7, 7)
      }

      // Bug' ko'tarilishi
      if (nisbat > 0.05 && nisbat < 0.98) {
        for (let b = 0; b < 8; b++) {
          const bx = cx - 36 + b * 10 + Math.sin(t * 2 + b) * 7
          const by = kosaY - 20 - (((t * 48 + b * 24) % 110))
          ctx.fillStyle = 'rgba(203, 213, 225, 0.45)'
          ctx.beginPath()
          ctx.arc(bx, by, 7, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        nisbat >= 0.95
          ? 'Suv to‘liq bug‘landi — sof osh tuzi (NaCl) kristallari qoldi!'
          : `Suv bug‘lanmoqda (${buglanish}%) — NaCl esa idishda to‘planadi`,
        cx,
        h * 0.16
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [buglanish])

  return (
    <KorgazmaRamka
      sarlavha="4. Bug‘latish va Kristallash: Erigan qattiq tuzni ajratish"
      qisqaFormula="NaCl + H₂O(suyuq) —(t°)→ NaCl(kristall) + H₂O(bug‘)↑"
      ikon="kristall"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-orange-300">
            Qizdirish va bug‘lanish: {buglanish}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={buglanish}
            onChange={(e) => setBuglanish(Number(e.target.value))}
            className="flex-1 accent-orange-400 cursor-pointer"
          />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: HAYDASH (DISTILLASH — LIBIX SOVITKICHI)
// ============================================================
function DistillashCanvas() {
  const [harorat, setHarorat] = useState(80) // 25..105 °C
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

      // 1. Dumaloq tubli kolba (Spirt 78°C + Suv 100°C)
      const kx = w * 0.22
      const ky = h * 0.58
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)'
      ctx.beginPath()
      ctx.arc(kx, ky, 46, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Kolba bo'yni + termometr
      ctx.strokeRect(kx - 10, ky - 110, 20, 66)
      chizTermometr(ctx, kx - 55, ky - 105, 110, harorat, 110, harorat >= 78 ? '#f59e0b' : '#38bdf8')

      // 2. Libix sovitkichi (qiyshiq naycha)
      const x1 = kx + 10
      const y1 = ky - 85
      const x2 = w * 0.72
      const y2 = ky - 15

      // Tashqi sovuq suv ko'ylagi
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)'
      ctx.lineWidth = 22
      ctx.beginPath()
      ctx.moveTo(x1 + 35, y1 + 14)
      ctx.lineTo(x2 - 25, y2 - 10)
      ctx.stroke()

      // Ichki bug' naychasi
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      // Bug' va kondensatsiya tomchilari
      if (harorat >= 78) {
        const spirtMiqdor = harorat < 98
        for (let i = 0; i < 6; i++) {
          const p = ((t * 0.45 + i * 0.16) % 1)
          const px = x1 + (x2 - x1) * p
          const py = y1 + (y2 - y1) * p
          chizZarracha(ctx, px, py, 4.5, spirtMiqdor ? '#fde047' : '#38bdf8', '')
        }
      }

      // 3. Qabul qiluvchi kolba (Distillat)
      chizStakan(ctx, w * 0.72, h * 0.56, 84, 90, {
        suyuqlikRang: harorat >= 78 ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.1)',
        tolish: harorat >= 78 ? 0.55 : 0.08,
        yorliq: harorat < 78 ? 'Hali bug‘ chiqmadi' : harorat < 98 ? '78°C: Spirt haydalmoqda' : '100°C: Suv ham qaynadi',
      })

      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('Libix sovitkichi (Bug‘ → Suyuqlik)', w * 0.49, ky - 86)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [harorat])

  return (
    <KorgazmaRamka
      sarlavha="5. Haydash (Distillash): Qaynash harorati farqiga ko‘ra ajratish"
      qisqaFormula="Spirt (T_qay = 78°C) + Suv (T_qay = 100°C)"
      ikon="kolba"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-yellow-300">
            Isitish harorati: {harorat}°C
          </span>
          <input type="range" min={25} max={105} value={harorat} onChange={(e) => setHarorat(Number(e.target.value))} className="flex-1 accent-yellow-400" />
        </div>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            78°C da avval spirt bug‘lanadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Libix sovitkichida bug‘ sovib tomchilaydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Dengiz suvini chuchuklashtirishda ham qo‘llanadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: XROMATOGRAFIYA (RANG AJRATISH) VA SENTRIFUGA
// ============================================================
function XromatografiyaCanvas() {
  const [vaqtFoiz, setVaqtFoiz] = useState(65)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const p = vaqtFoiz / 100

      // Stakan va erituvchi
      chizStakan(ctx, w * 0.28, h * 0.18, w * 0.44, h * 0.68, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.28)',
        tolish: 0.2,
        sarlavha: 'Qog‘oz xromatografiyasi (Qora siyoh tahlili)',
        yorliq: 'Erituvchi kapillyar bo‘ylab ko‘tarilib bo‘yoqlarni ajratadi',
      })

      // Filtr qog'oz tasmasi
      const px = w * 0.5 - 32
      const py = h * 0.14
      const ph = h * 0.65
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(px, py, 64, ph)

      // Erituvchi fronti
      const erituvchiY = py + ph - 45 - p * (ph - 75)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)'
      ctx.fillRect(px, erituvchiY, 64, py + ph - erituvchiY)

      // Boshlang'ich siyoh chizig'i
      const startY = py + ph - 55
      ctx.strokeStyle = '#94a3b8'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(px + 6, startY)
      ctx.lineTo(px + 58, startY)
      ctx.stroke()
      ctx.setLineDash([])

      // 3 xil pigment tezlikka ko'ra ko'tariladi
      const sariqY = startY - p * (ph - 90) * 0.95
      const qizilY = startY - p * (ph - 90) * 0.68
      const kokY = startY - p * (ph - 90) * 0.42

      chizZarracha(ctx, w * 0.5, sariqY, 11, '#facc15', '')
      chizZarracha(ctx, w * 0.5, qizilY, 11, '#ec4899', '')
      chizZarracha(ctx, w * 0.5, kokY, 11, '#3b82f6', '')

      ctx.fillStyle = '#facc15'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText('Eng harakatchan: Sariq', px + 76, sariqY + 4)
      ctx.fillStyle = '#f472b6'
      ctx.fillText('O‘rtacha: Qizil', px + 76, qizilY + 4)
      ctx.fillStyle = '#60a5fa'
      ctx.fillText('Sekinroq: Ko‘k', px + 76, kokY + 4)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [vaqtFoiz])

  return (
    <KorgazmaRamka
      sarlavha="6. Xromatografiya: Bo‘yoq va murakkab moddalarni tahliliy ajratish"
      qisqaFormula="Qora marker = Sariq + Qizil + Ko‘k pigmentlar aralashmasi"
      ikon="palitra"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-cyan-300">
            Erituvchi ko‘tarilishi: {vaqtFoiz}%
          </span>
          <input type="range" min={0} max={100} value={vaqtFoiz} onChange={(e) => setVaqtFoiz(Number(e.target.value))} className="flex-1 accent-pink-400" />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// O'YINLAR MA'LUMOTLARI (6.3)
// ============================================================
const OYIN1_USULLAR = [
  { id: 'filtr', nom: 'Filtrlash', tavsif: 'Qattiq (erimaydigan) + Suyuq' },
  { id: 'voronka', nom: 'Ajratish voronkasi', tavsif: 'Ikki aralashmaydigan suyuqlik' },
  { id: 'buglatish', nom: 'Bug‘latish / Haydash', tavsif: 'Erigan moddani ajratish' },
  { id: 'magnit', nom: 'Magnitlash', tavsif: 'Fe, Ni, Co aralashmalari' },
]

const OYIN1_MISOLLAR = [
  { nom: 'Qum va suv aralashmasi', qisqa: 'Geterogen suspenziya', guruh: 'filtr', izoh: 'Qum filtr qog‘ozida qoladi, toza suv o‘tib ketadi.' },
  { nom: 'Yog‘och qipig‘i va temir mixlar', qisqa: 'Qattiq aralashma', guruh: 'magnit', izoh: 'Magnit temir mixlarni oson tortib oladi.' },
  { nom: 'Benzin va suv aralashmasi', qisqa: 'Zichligi har xil 2 suyuqlik', guruh: 'voronka', izoh: 'Benzin tepada, suv pastda qatlamlanadi — voronkada ajratiladi.' },
  { nom: 'Sho‘r suvdan osh tuzi (NaCl) olish', qisqa: 'Tiniq gomogen eritma', guruh: 'buglatish', izoh: 'Filtr tuzni ushlab qololmaydi, suv bug‘latiladi.' },
  { nom: 'Bo‘r kukuni va suv', qisqa: 'Oq suspenziya', guruh: 'filtr', izoh: 'Erimaydigan bo‘r filtr qog‘ozida ushlanib qoladi.' },
  { nom: 'Etil spirti (78°C) va suv (100°C)', qisqa: 'Aralashuvchi suyuqliklar', guruh: 'buglatish', izoh: 'Qaynash harorati farqiga ko‘ra haydash (distillash) qo‘llanadi.' },
]

const OYIN2_SAVOLLAR = [
  {
    belgi: 'Fizik asos',
    savol: 'Ajratish voronkasi yordamida moy va suvni ajratish qaysi xossaga asoslanadi?',
    variantlar: ['Qaynash haroratiga', 'Magnit maydoniga', 'Erish tezligiga', 'Suyuqliklarning aralashmasligi va zichlik (ρ) farqiga'],
    togri: 3,
    izoh: 'Zichligi katta suv pastga tushadi, yengil moy esa tepada qoladi.',
  },
  {
    belgi: 'Distillash',
    savol: 'Spirt va suv aralashmasini haydash (distillash) qaysi xossa farqiga asoslanadi?',
    variantlar: ['Qaynash harorati (T_qay) farqiga', 'Zarrachalar o‘lchamiga', 'Rang farqiga', 'Magnitlanishiga'],
    togri: 0,
    izoh: '78°C da avval spirt bug‘lanib, sovitkichda kondensatlanadi.',
  },
  {
    belgi: 'Filtrlash chegarasi',
    savol: 'Nima uchun sho‘r suvni filtr qog‘ozidan o‘tkazib tuzni ajratib bo‘lmaydi?',
    variantlar: ['Tuz magnitga tortiladi', 'Erigan tuz ionlari filtr g‘ovaklaridan ancha kichik', 'Tuz filtrni eritib yuboradi', 'Suv filtrdan o‘tmaydi'],
    togri: 1,
    izoh: 'Eritmadagi ionlar suv bilan birga g‘ovaklardan bemalol o‘tib ketadi.',
  },
  {
    belgi: 'Xromatografiya',
    savol: 'Qog‘oz xromatografiyasida bo‘yoqlarning ajralishi nimaga bog‘liq?',
    variantlar: ['Qaynash nuqtasiga', 'Kristallanishiga', 'Moddalarning qog‘ozda harakatlanish va yutilish tezligiga', 'Magnit maydoniga'],
    togri: 2,
    izoh: 'Turli pigmentlar kapillyar oqimda turlicha tezlik bilan ko‘tariladi.',
  },
]

const OYIN3_MISSIYALAR = [
  {
    tur: '1-Laboratoriya missiyasi',
    vazifa: 'Temir qipig‘i + Qum + Osh tuzi aralashmasini to‘liq 3 ta toza moddaga ajrating:',
    tartib: ['Magnit bilan Fe ni ajratish', 'Suv qo‘shib NaCl ni eritish', 'Filtrlash (qum ajraladi)', 'Bug‘latish (NaCl kristali)'],
    variantlar: ['Suv qo‘shib NaCl ni eritish', 'Filtrlash (qum ajraladi)', 'Bug‘latish (NaCl kristali)', 'Magnit bilan Fe ni ajratish'],
  },
  {
    tur: '2-Sanoat missiyasi',
    vazifa: 'Dengiz suvi + Loyqa qum + Neft tomchilarini tozalab ichimlik suvi oling:',
    tartib: ['Ajratish voronkasi (neft)', 'Filtrlash (loyqa qum)', 'Distillash (tuzsiz toza H₂O)'],
    variantlar: ['Ajratish voronkasi (neft)', 'Filtrlash (loyqa qum)', 'Distillash (tuzsiz toza H₂O)', 'Magnitlash'],
  },
]

const DUEL_6_3 = [
  { savol: 'Qum va suv aralashmasini ajratishning eng qulay usuli qaysi?', variantlar: ['Distillash', 'Filtrlash', 'Magnitlash', 'Xromatografiya'], togri: 1, izoh: 'Qum suvda erimaydi, shuning uchun filtrda ushlab qolinadi.' },
  { savol: 'Filtr qog‘ozidan o‘tgan toza suyuqlik kimyoda nima deb ataladi?', variantlar: ['Suspenziya', 'Sublimat', 'Filtrat', 'Qoldiq'], togri: 2, izoh: 'Filtrdan o‘tgan tiniq suyuqlik — filtrat.' },
  { savol: 'Bir-birida erimaydigan moy va suvni ajratish uchun qaysi asbob ishlatiladi?', variantlar: ['Libix sovitkichi', 'Chinni kosa', 'Magnit', 'Ajratish voronkasi'], togri: 3, izoh: 'Ajratish voronkasi zichlik farqi asosida suyuqliklarni ajratadi.' },
  { savol: 'Spirt (78°C) va suv (100°C) aralashmasini toza ajratish usuli?', variantlar: ['Haydash (Distillash)', 'Filtrlash', 'Tindirish', 'Magnitlash'], togri: 0, izoh: 'Ikki eruvchi suyuqlik qaynash harorati farqi bo‘yicha haydaladi.' },
  { savol: 'Distillash asbobidagi sovitkich nima vazifani bajaradi?', variantlar: ['Bosimni oshiradi', 'Bug‘ni sovitib suyuqlikka (kondensatga) aylantiradi', 'Suvni isitadi', 'Qumni ushlab qoladi'], togri: 1, izoh: 'Libix sovitkichida bug‘ sovib tomchiga aylanadi.' },
  { savol: 'Qon tarkibidagi hujayralarni plazmadan tez ajratish uchun nima qo‘llanadi?', variantlar: ['Magnitlash', 'Qizdirish', 'Sentrifugalash', 'Bug‘latish'], togri: 2, izoh: 'Katta tezlikda aylantirish (sentrifuga) og‘ir zarrachalarni tez cho‘ktiradi.' },
]

export default function Mavzu6_3() {
  const korgazmalar = [
    { nom: '1. Magnitlash', ikon: 'magnit', komponent: <MagnitAjratishCanvas /> },
    { nom: '2. Filtrlash', ikon: 'filtr', komponent: <FiltrlashCanvas /> },
    { nom: '3. Ajratish voronkasi', ikon: 'tomchi', komponent: <AjratishVoronkasiCanvas /> },
    { nom: '4. Bug‘latish', ikon: 'kristall', komponent: <BuglatishCanvas /> },
    { nom: '5. Distillash', ikon: 'kolba', komponent: <DistillashCanvas /> },
    { nom: '6. Xromatografiya', ikon: 'palitra', komponent: <XromatografiyaCanvas /> },
  ]

  const oyinlar = [
    { nom: '1. Usulni Tanla', ikon: 'filtr', komponent: <GuruhlashOyini nom="To‘g‘ri Ajratish Usulini Tanla" ikon="filtr" guruhlar={OYIN1_USULLAR} topshiriqlar={OYIN1_MISOLLAR} /> },
    { nom: '2. Fizik Asos', ikon: 'qidiruv', komponent: <TezkorTanlovOyini nom="Qaysi Xossaga Asoslangan?" ikon="qidiruv" savollar={OYIN2_SAVOLLAR} /> },
    { nom: '3. Ajratish Zanjiri', ikon: 'nizom', komponent: <BosqichliZanjirOyini nom="Laboratoriya Ajratish Zanjiri" ikon="nizom" missiyalar={OYIN3_MISSIYALAR} /> },
    { nom: '4. Jamoalar Dueli', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="6.3 Ajratish Usullari Dueli" savollar={DUEL_6_3} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="6.3"
      mavzuNom="Aralashmalarni ajratish"
      oldingiRaqam="6.2"
      oldingiNom="Oddiy, murakkab moddalar va aralashmalarni farqlash"
      takrorlashSavollar={TAKRORLASH_6_2}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
