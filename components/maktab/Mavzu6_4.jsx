'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 6-BOB, 6.4-MAVZU
// "Eritmalar" (Darslik 108-bet)
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
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_6_3 = [
  {
    id: '6-3-1',
    savol: 'Qum va suv aralashmasini ajratishning eng qulay usuli qaysi?',
    variantlar: [
      { matn: 'Filtrlash', togri: true },
      { matn: 'Magnitlash', togri: false },
      { matn: 'Haydash (distillash)', togri: false },
      { matn: 'Xromatografiya', togri: false },
    ],
    izoh: 'Qum suvda erimaydi va zarrachalari filtr qog‘ozida ushlanib qoladi.',
  },
  {
    id: '6-3-2',
    savol: 'Bir-birida erimaydigan moy va suvni ajratishda qaysi asbob ishlatiladi?',
    variantlar: [
      { matn: 'Chinni kosa', togri: false },
      { matn: 'Ajratish voronkasi', togri: true },
      { matn: 'Libix sovitkichi', togri: false },
      { matn: 'Magnit', togri: false },
    ],
    izoh: 'Zichlik farqi tufayli ikki qatlamga ajralgan suyuqliklar voronkadan ketma-ket tushiriladi.',
  },
  {
    id: '6-3-3',
    savol: 'Sho‘r suvdan osh tuzi (NaCl) kristallarini ajratib olish usuli qaysi?',
    variantlar: [
      { matn: 'Magnit bilan tortish', togri: false },
      { matn: 'Dekantatsiya', togri: false },
      { matn: 'Bug‘latish va kristallash', togri: true },
      { matn: 'Filtrlash', togri: false },
    ],
    izoh: 'Erigan tuz filtrdan o‘tib ketadi; suv bug‘latilganda tuz kristallari qoladi.',
  },
]

// ============================================================
// 1-KO'RGAZMA: ERITUVCHI VA ERUVCHI MODDA (3 AGREGAT HOLAT)
// ============================================================
const ERITMA_TURLARI = [
  { id: 'qattiq', nom: 'Qattiq + Suyuq (Tuz + Suv)', erituvchi: 'Suv (H₂O)', eruvchi: 'Osh tuzi (NaCl)', rang: '#facc15', rangSuv: 'rgba(56,189,248,0.34)' },
  { id: 'suyuq', nom: 'Suyuq + Suyuq (Spirt + Suv)', erituvchi: 'Suv (ko‘p qism)', eruvchi: 'Spirt (oz qism)', rang: '#a855f7', rangSuv: 'rgba(139,92,246,0.28)' },
  { id: 'gaz', nom: 'Gaz + Suyuq (CO₂ + Suv)', erituvchi: 'Suv (H₂O)', eruvchi: 'Karbonat angidrid (CO₂)', rang: '#cbd5e1', rangSuv: 'rgba(56,189,248,0.32)' },
]

function ErituvchiEruvchiCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const canvasRef = useRef(null)
  const faol = ERITMA_TURLARI[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      chizStakan(ctx, w * 0.14, h * 0.16, w * 0.34, h * 0.66, {
        suyuqlikRang: faol.rangSuv,
        tolish: 0.78,
        sarlavha: faol.nom,
        yorliq: 'Eritma = Erituvchi + Eruvchi modda',
      })

      for (let i = 0; i < 18; i++) {
        const px = w * 0.17 + ((i * 39 + Math.sin(t + i) * 16) % Math.max(40, w * 0.28))
        const py = h * 0.34 + ((i * 27 + Math.cos(t * 1.1 + i) * 16) % Math.max(40, h * 0.42))
        if (i % 3 === 0) chizZarracha(ctx, px, py, 6.5, faol.rang, '')
        else chizZarracha(ctx, px, py, 5, '#38bdf8', '')
      }

      // O'ng formula bloki
      const rx = w * 0.54
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.2, w * 0.39, h * 0.58, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#7dd3fc'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText('ERITUVCHI (ko‘p, muhit):', rx + 20, h * 0.32)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Times New Roman", serif'
      ctx.fillText(faol.erituvchi, rx + 20, h * 0.39)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillText('ERUVCHI MODDA (tarqalgan):', rx + 20, h * 0.53)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Times New Roman", serif'
      ctx.fillText(faol.eruvchi, rx + 20, h * 0.6)

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText('m(eritma) = m(erituvchi) + m(eruvchi)', rx + 20, h * 0.72)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [faol])

  return (
    <KorgazmaRamka
      sarlavha="1. Eritma tarkibi: Erituvchi va Eruvchi modda"
      qisqaFormula="m(eritma) = m(erituvchi) + m(modda)"
      ikon="kolba"
      boshqaruv={
        <>
          {ERITMA_TURLARI.map((m, i) => (
            <button
              key={m.id}
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
// 2-KO'RGAZMA: ERISH MEXANIZMI (GIDRATLANISH)
// ============================================================
function ErishMexanizmiCanvas() {
  const [jarayon, setJarayon] = useState(55) // 0..100
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
      const p = jarayon / 100

      chizStakan(ctx, w * 0.2, h * 0.12, w * 0.6, h * 0.74, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.25)',
        tolish: 0.85,
        yorliq: 'Suv molekulalari (H₂O) ionlarni o‘rab olib ajratadi (Gidratlanish)',
      })

      // Na+ va Cl- ionlari
      const cx = w * 0.5
      const baseY = h * 0.76

      for (let i = 0; i < 12; i++) {
        const col = i % 4
        const row = Math.floor(i / 4)
        const startX = cx - 42 + col * 28
        const startY = baseY - row * 26

        // Yuqoriga ko'tarilish chegarasi p ga bog'liq
        const ajralgan = i >= Math.round((1 - p) * 12)
        const targetX = w * 0.28 + ((i * 57) % Math.max(60, w * 0.44))
        const targetY = h * 0.28 + ((i * 43) % Math.max(50, h * 0.36))

        const ix = ajralgan ? startX + (targetX - startX) * p + Math.sin(t + i) * 8 : startX
        const iy = ajralgan ? startY + (targetY - startY) * p + Math.cos(t + i) * 6 : startY

        const isNa = i % 2 === 0
        chizZarracha(ctx, ix, iy, 10, isNa ? '#facc15' : '#34d399', isNa ? 'Na⁺' : 'Cl⁻')

        // Agar ajralgan bo'lsa atrofida 4 ta suv molekulasi (gidrat qobig'i)
        if (ajralgan && p > 0.25) {
          for (let k = 0; k < 4; k++) {
            const ang = t * 1.4 + k * (Math.PI / 2)
            chizZarracha(ctx, ix + Math.cos(ang) * 17, iy + Math.sin(ang) * 17, 4.5, '#38bdf8', '')
          }
        }
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [jarayon])

  return (
    <KorgazmaRamka
      sarlavha="2. Molekulyar erish mexanizmi (Suv dipollarining gidrat qobig‘i)"
      qisqaFormula="NaCl(kristall) + nH₂O → Na⁺(gidrat) + Cl⁻(gidrat)"
      ikon="atom"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-cyan-300">
            Erish darajasi (aralashtirish): {jarayon}%
          </span>
          <input type="range" min={0} max={100} value={jarayon} onChange={(e) => setJarayon(Number(e.target.value))} className="flex-1 accent-cyan-400" />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: KONSENTRLANGAN VS SUYULTIRILGAN (CuSO₄ RANGI)
// ============================================================
function KonsentrlanganSuyultirilganCanvas() {
  const [tuzFoiz, setTuzFoiz] = useState(12) // 1..30%
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

      const alpha = 0.14 + (tuzFoiz / 30) * 0.72
      chizStakan(ctx, w * 0.3, h * 0.16, w * 0.4, h * 0.66, {
        suyuqlikRang: `rgba(14, 165, 233, ${alpha.toFixed(2)})`,
        tolish: 0.78,
        sarlavha: `Mis(II) sulfat eritmasi (CuSO₄): ω = ${tuzFoiz}%`,
        yorliq: tuzFoiz < 10 ? 'SUYULTIRILGAN ERITMA (och havorang)' : tuzFoiz < 20 ? 'O‘RTACHA ERITMA' : 'KONSENTRLANGAN ERITMA (to‘q ko‘k)',
      })

      const zarrachaSoni = Math.max(4, Math.round(tuzFoiz * 1.1))
      for (let i = 0; i < zarrachaSoni; i++) {
        const px = w * 0.34 + ((i * 41 + Math.sin(t + i) * 14) % Math.max(40, w * 0.32))
        const py = h * 0.36 + ((i * 29 + Math.cos(t + i) * 14) % Math.max(40, h * 0.4))
        chizZarracha(ctx, px, py, 5.5, '#0284c7', '')
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [tuzFoiz])

  return (
    <KorgazmaRamka
      sarlavha="3. Suyultirilgan vs Konsentrlangan eritmalar (Rang intensivligi)"
      qisqaFormula={`CuSO₄ konsentratsiyasi: ${tuzFoiz}%`}
      ikon="tomchi"
      boshqaruv={
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs sm:text-sm font-extrabold text-sky-300">
            CuSO₄ ulushi (ω): {tuzFoiz}%
          </span>
          <input type="range" min={1} max={30} value={tuzFoiz} onChange={(e) => setTuzFoiz(Number(e.target.value))} className="flex-1 accent-sky-400" />
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: TO'YINMAGAN, TO'YINGAN VA CHO'KMALI HOLAT
// ============================================================
function ToyinganlikCanvas() {
  const [solinganTuz, setSolinganTuz] = useState(20) // Max eruvchanlik 20°C da NaCl = 36g / 100g suv
  const canvasRef = useRef(null)
  const chegara = 36

  const holatNom =
    solinganTuz < chegara
      ? 'TO‘YINMAGAN (yana tuz eriydi)'
      : solinganTuz === chegara
      ? 'TO‘YINGAN (aniq muvozanat 36 g)'
      : `ORTIQCHA CHO‘KMA (${solinganTuz - chegara} g tubga cho‘kdi)`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      chizStakan(ctx, w * 0.3, h * 0.16, w * 0.4, h * 0.66, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.32)',
        tolish: 0.78,
        sarlavha: `100 g suvga (20°C) ${solinganTuz} g NaCl solindi`,
        yorliq: holatNom,
      })

      const erigan = Math.min(chegara, solinganTuz)
      for (let i = 0; i < Math.round(erigan * 0.7); i++) {
        const px = w * 0.34 + ((i * 37 + Math.sin(t + i) * 14) % Math.max(40, w * 0.32))
        const py = h * 0.36 + ((i * 23 + Math.cos(t + i) * 14) % Math.max(40, h * 0.38))
        chizZarracha(ctx, px, py, 5, '#facc15', '')
      }

      if (solinganTuz > chegara) {
        const chokma = solinganTuz - chegara
        for (let c = 0; c < chokma; c++) {
          const cx = w * 0.35 + ((c * 17) % Math.max(40, w * 0.3))
          const cy = h * 0.78 - (c % 3) * 6
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(cx, cy, 7, 7)
        }
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [solinganTuz, holatNom])

  return (
    <KorgazmaRamka
      sarlavha="4. To‘yinmagan, To‘yingan va Ortiqcha tuzli eritmalar"
      qisqaFormula="20°C da 100 g H₂O maksimal 36 g NaCl eritadi"
      ikon="kristall"
      boshqaruv={
        <>
          {[15, 36, 52].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { setSolinganTuz(g); tovushChiqar('tasdiq') }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${solinganTuz === g ? 'bg-yellow-400 text-slate-950 border-yellow-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {g} g ({g < 36 ? 'To‘yinmagan' : g === 36 ? 'To‘yingan' : 'Cho‘kmali'})
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Tuz: {solinganTuz} g</span>
            <input type="range" min={5} max={60} value={solinganTuz} onChange={(e) => setSolinganTuz(Number(e.target.value))} className="accent-yellow-400" />
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: MASSA ULUSHI KALIBRATORI (ω = m_modda / m_eritma)
// ============================================================
function MassaUlushiCanvas() {
  const [mModda, setMModda] = useState(20)
  const [mSuv, setMSuv] = useState(80)
  const canvasRef = useRef(null)

  const mEritma = mModda + mSuv
  const omega = ((mModda / mEritma) * 100).toFixed(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      chizStakan(ctx, w * 0.1, h * 0.2, w * 0.3, h * 0.6, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.38)',
        tolish: Math.min(0.92, mEritma / 260 + 0.2),
        sarlavha: `Eritma: ${mEritma} g`,
        yorliq: `ω = ${omega}%`,
      })

      // Formula doskasi o'ngda
      const rx = w * 0.48
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
      ctx.strokeStyle = '#34d399'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(rx, h * 0.16, w * 0.45, h * 0.68, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 16px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText('Massa ulushi formulasi:', rx + 22, h * 0.28)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 19px "Times New Roman", serif'
      ctx.fillText('ω = (m_modda / m_eritma) · 100%', rx + 22, h * 0.39)

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillText(`m(eritma) = ${mModda} g + ${mSuv} g = ${mEritma} g`, rx + 22, h * 0.52)
      ctx.fillText(`ω = (${mModda} / ${mEritma}) · 100% = ${omega}%`, rx + 22, h * 0.62)

      // Ulush paneli
      const barW = w * 0.36
      const tuzBar = (barW * Number(omega)) / 100
      ctx.fillStyle = '#facc15'
      ctx.fillRect(rx + 22, h * 0.7, tuzBar, 22)
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(rx + 22 + tuzBar, h * 0.7, barW - tuzBar, 22)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [mModda, mSuv, mEritma, omega])

  return (
    <KorgazmaRamka
      sarlavha="5. Erigan moddaning massa ulushi ω (%) kalkulyatori"
      qisqaFormula={`ω = ${mModda} / ${mEritma} · 100% = ${omega}%`}
      ikon="grafik"
      boshqaruv={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-yellow-300 shrink-0">m(modda): {mModda} g</span>
            <input type="range" min={5} max={80} value={mModda} onChange={(e) => setMModda(Number(e.target.value))} className="flex-1 accent-yellow-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 shrink-0">m(suv): {mSuv} g</span>
            <input type="range" min={40} max={200} value={mSuv} onChange={(e) => setMSuv(Number(e.target.value))} className="flex-1 accent-cyan-400" />
          </div>
        </div>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: HAYOTIY VA TIBBIY ERITMALAR
// ============================================================
const HAYOTIY_ERITMALAR = [
  { nom: 'Fiziologik eritma (0.9% NaCl)', foiz: 0.9, vazifa: 'Tibbiyotda qon o‘rnini bosuvchi tomchilatish', rang: '#38bdf8' },
  { nom: 'Dengiz suvi (3.5% tuzlar)', foiz: 3.5, vazifa: 'Okean suvi — ichishga yaroqsiz sho‘r eritma', rang: '#0ea5e9' },
  { nom: 'Oshxona sirkasi (9% CH₃COOH)', foiz: 9, vazifa: 'Oziq-ovqat konservalash va pishirish', rang: '#f59e0b' },
  { nom: 'Antiseptik spirt (70% C₂H₅OH)', foiz: 70, vazifa: 'Teri va asboblarni mikroblardan tozalash', rang: '#a855f7' },
]

function HayotiyEritmaCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const canvasRef = useRef(null)
  const faol = HAYOTIY_ERITMALAR[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = () => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)

      HAYOTIY_ERITMALAR.forEach((item, i) => {
        const y = h * 0.16 + i * (h * 0.19)
        const faolmi = i === tanlov
        ctx.fillStyle = faolmi ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.55)'
        ctx.strokeStyle = faolmi ? item.rang : 'rgba(59, 130, 246, 0.35)'
        ctx.lineWidth = faolmi ? 2.5 : 1
        ctx.beginPath()
        ctx.roundRect(w * 0.08, y, w * 0.84, h * 0.15, 12)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'left'
        ctx.fillText(item.nom, w * 0.11, y + 22)

        ctx.fillStyle = '#cbd5e1'
        ctx.font = '12px "Times New Roman", serif'
        ctx.fillText(item.vazifa, w * 0.11, y + 40)

        const barMax = w * 0.25
        ctx.fillStyle = 'rgba(255,255,255,0.1)'
        ctx.fillRect(w * 0.64, y + 18, barMax, 16)
        ctx.fillStyle = item.rang
        ctx.fillRect(w * 0.64, y + 18, (barMax * item.foiz) / 100, 16)
      })

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [tanlov, faol])

  return (
    <KorgazmaRamka
      sarlavha="6. Tibbiyot va kundalik hayotdagi muhim eritmalar"
      qisqaFormula={faol.nom}
      ikon="qalqon"
      boshqaruv={
        <>
          {HAYOTIY_ERITMALAR.map((e, i) => (
            <button
              key={e.nom}
              type="button"
              onClick={() => { setTanlov(i); tovushChiqar('tasdiq') }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold border ${tanlov === i ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'bg-slate-900 text-blue-200 border-blue-800'}`}
            >
              {e.foiz}%
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
// O'YINLAR MA'LUMOTLARI (6.4)
// ============================================================
const OYIN1_GURUHLAR = [
  { id: 'suv', nom: 'Erituvchi = SUV (H₂O)', tavsif: 'Suvli eritmalar' },
  { id: 'boshqa', nom: 'Erituvchi = BOSHQA MODDA', tavsif: 'Spirt, Benzin, Metall' },
]

const OYIN1_MISOLLAR = [
  { nom: 'Shakarli choy', qisqa: 'Shakar + Suv', guruh: 'suv', izoh: 'Suv ko‘proq — u erituvchi, shakar — eruvchi.' },
  { nom: 'Yod nastoykasi', qisqa: 'Qattiq yod + Etil spirti', guruh: 'boshqa', izoh: 'Tibbiy yod eritmasida erituvchi spirt hisoblanadi.' },
  { nom: '0.9% Fiziologik eritma', qisqa: 'NaCl + Suv', guruh: 'suv', izoh: '99.1% suv erituvchidir.' },
  { nom: 'Yog‘li dog‘ni tozalash', qisqa: 'Yog‘ + Benzin', guruh: 'boshqa', izoh: 'Yog‘ benzinda eriydi, erituvchi — benzin.' },
  { nom: 'Gazlangan ichimlik', qisqa: 'CO₂ gazi + Suv', guruh: 'suv', izoh: 'Eritmaning suyuq holatini suv belgilaydi.' },
]

const OYIN2_KALKULYATOR = [
  {
    belgi: 'ω = m(modda) / m(eritma) · 100%',
    savol: '20 g osh tuzi 80 g suvda eritildi. Hosil bo‘lgan eritmaning massa ulushi (%) nechaga teng?',
    variantlar: ['25%', '16%', '10%', '20%'],
    togri: 3,
    izoh: 'm(eritma) = 20 + 80 = 100 g. ω = (20 / 100) · 100% = 20%.',
  },
  {
    belgi: 'Teskari masala',
    savol: '200 g 10% li shakar eritmasini tayyorlash uchun necha gramm shakar kerak?',
    variantlar: ['20 g', '10 g', '40 g', '180 g'],
    togri: 0,
    izoh: 'm(shakar) = 200 · 0.10 = 20 g (va 180 g suv).',
  },
  {
    belgi: 'Suv massasi',
    savol: '50 g tuzni 200 g suvda eritishdi. Eritmaning umumiy massasi va ω(%) ni toping:',
    variantlar: ['150 g va 20%', '250 g va 20%', '200 g va 25%', '250 g va 25%'],
    togri: 1,
    izoh: 'm(eritma) = 50 + 200 = 250 g. ω = (50 / 250) · 100% = 20%.',
  },
  {
    belgi: 'Suyultirish',
    savol: '100 g 20% li tuz eritmasiga yana 100 g toza suv qo‘shilsa, yangi massa ulushi necha % bo‘ladi?',
    variantlar: ['40%', '5%', '10%', '20%'],
    togri: 2,
    izoh: 'Tuz 20 g o‘zgarmaydi, eritma 200 g bo‘ladi: 20 / 200 = 10%.',
  },
]

const OYIN3_GURUHLAR = [
  { id: 'toyinmagan', nom: 'To‘yinmagan / Suyultirilgan', tavsif: 'Yana eritish mumkin' },
  { id: 'toyingan', nom: 'To‘yingan / Konsentrlangan', tavsif: 'Maksimal miqdor erigan' },
]

const OYIN3_MISOLLAR = [
  { nom: '100 g suvga bor-yo‘g‘i 2 g tuz solindi', qisqa: 'Chegara 36 g', guruh: 'toyinmagan', izoh: 'Yana 34 g tuz eritish mumkin — to‘yinmagan.' },
  { nom: 'Stakan tubida erimay qolgan tuz kristallari ustidagi tiniq eritma', qisqa: 'Ortiqcha qattiq faza bor', guruh: 'toyingan', izoh: 'Boshqa tuz erimayotgani uning to‘yinganligini bildiradi.' },
  { nom: '0.9% li fiziologik eritma', qisqa: '99.1% suv', guruh: 'toyinmagan', izoh: 'Juda kam tuz bor — suyultirilgan va to‘yinmagan.' },
  { nom: '20°C da 100 g suvda 36 g NaCl erigan', qisqa: 'Maksimal eruvchanlikka teng', guruh: 'toyingan', izoh: 'Aynan maksimal chegara — to‘yingan eritma.' },
]

const DUEL_6_4 = [
  { savol: 'Eritma qanday asosiy ikki qismdan iborat?', variantlar: ['Cho‘kma va gaz', 'Filtr va qoldiq', 'Kislota va metall', 'Erituvchi va eruvchi modda'], togri: 3, izoh: 'Eritma = Erituvchi + Eruvchi modda.' },
  { savol: '15 g tuz 85 g suvda eritilsa, eritma massasi necha gramm bo‘ladi?', variantlar: ['100 g', '85 g', '70 g', '115 g'], togri: 0, izoh: '15 + 85 = 100 g (massa saqlanadi).' },
  { savol: 'Berilgan haroratda modda boshqa erimaydigan eritma qanday ataladi?', variantlar: ['Emulsiya', 'To‘yingan eritma', 'Suyultirilgan eritma', 'To‘yinmagan eritma'], togri: 1, izoh: 'Maksimal erish chegarasiga yetgan eritma to‘yingan deyiladi.' },
  { savol: 'Tibbiyotda qo‘llaniladigan fiziologik eritma tarkibi qanday?', variantlar: ['50% shakar', '9% sirka', '0.9% NaCl suvdagi eritmasi', '10% H₂SO₄'], togri: 2, izoh: 'Qon plazmasiga mos 0.9% li osh tuzi eritmasi.' },
  { savol: '40 g 25% li tuz eritmasida necha gramm erigan tuz bor?', variantlar: ['25 g', '15 g', '5 g', '10 g'], togri: 3, izoh: '40 · 0.25 = 10 g.' },
  { savol: 'Qattiq jism suvda eriganda suv molekulalarining ionlarni o‘rab olish hodisasi nima deyiladi?', variantlar: ['Gidratlanish', 'Distillash', 'Magnitlash', 'Bug‘latish'], togri: 0, izoh: 'Suv molekulalari erigan zarrachalar atrofida gidrat qobig‘i hosil qiladi.' },
]

export default function Mavzu6_4() {
  const korgazmalar = [
    { nom: '1. Erituvchi / Eruvchi', ikon: 'kolba', komponent: <ErituvchiEruvchiCanvas /> },
    { nom: '2. Gidratlanish', ikon: 'atom', komponent: <ErishMexanizmiCanvas /> },
    { nom: '3. Konsentratsiya', ikon: 'tomchi', komponent: <KonsentrlanganSuyultirilganCanvas /> },
    { nom: '4. To‘yingan eritma', ikon: 'kristall', komponent: <ToyinganlikCanvas /> },
    { nom: '5. ω (%) Kalkulyator', ikon: 'grafik', komponent: <MassaUlushiCanvas /> },
    { nom: '6. Hayotiy eritmalar', ikon: 'qalqon', komponent: <HayotiyEritmaCanvas /> },
  ]

  const oyinlar = [
    { nom: '1. Erituvchini Top', ikon: 'kolba', komponent: <GuruhlashOyini nom="Erituvchi Nima?" ikon="kolba" guruhlar={OYIN1_GURUHLAR} topshiriqlar={OYIN1_MISOLLAR} /> },
    { nom: '2. ω(%) Kalkulyator', ikon: 'grafik', komponent: <TezkorTanlovOyini nom="Massa Ulushi ω(%) Sinovi" ikon="grafik" savollar={OYIN2_KALKULYATOR} /> },
    { nom: '3. To‘yinganmi?', ikon: 'kristall', komponent: <GuruhlashOyini nom="Eritma Holatini Aniqlang" ikon="kristall" guruhlar={OYIN3_GURUHLAR} topshiriqlar={OYIN3_MISOLLAR} /> },
    { nom: '4. Jamoalar Dueli', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="6.4 Eritmalar Dueli" savollar={DUEL_6_4} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="6.4"
      mavzuNom="Eritmalar"
      oldingiRaqam="6.3"
      oldingiNom="Aralashmalarni ajratish"
      takrorlashSavollar={TAKRORLASH_6_3}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
