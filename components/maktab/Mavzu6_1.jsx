'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 6-BOB, 6.1-MAVZU
// "Aralashmalar" (Darslik 95-bet)
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
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi'

const TAKRORLASH_5_5 = [
  {
    id: '5-5-1',
    savol: "Kislota va asos o'zaro reaksiyaga kirishganda qanday mahsulotlar hosil bo'ladi?",
    variantlar: [
      { matn: 'Tuz va suv', togri: true },
      { matn: 'Faqat vodorod gazi', togri: false },
      { matn: 'Oksid va kislorod', togri: false },
      { matn: 'Metall va kislota', togri: false },
    ],
    izoh: 'Neytrallanish reaksiyasida kislota + asos → tuz + suv hosil bo‘ladi.',
  },
  {
    id: '5-5-2',
    savol: 'Neytrallanish reaksiyasining qisqacha ionli mohiyati qaysi qatorda berilgan?',
    variantlar: [
      { matn: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓', togri: false },
      { matn: 'H⁺ + OH⁻ → H₂O', togri: true },
      { matn: 'Na⁺ + Cl⁻ → NaCl', togri: false },
      { matn: '2H₂ + O₂ → 2H₂O', togri: false },
    ],
    izoh: 'Kislotadan kelgan H⁺ va ishqordan kelgan OH⁻ ionlari birikib neytral suv hosil qiladi.',
  },
  {
    id: '5-5-3',
    savol: 'Oshqozonda kislota ko‘payib ketganda (jig‘ildon qaynashida) antatsid sifatida nima qo‘llaniladi?',
    variantlar: [
      { matn: 'O‘yuvchi natriy — NaOH', togri: false },
      { matn: 'Sirka kislotasi — CH₃COOH', togri: false },
      { matn: 'Kuchsiz asos — Mg(OH)₂ yoki Al(OH)₃', togri: true },
      { matn: 'Kuchli sulfat kislota — H₂SO₄', togri: false },
    ],
    izoh: 'Antatsidlar tarkibidagi Mg(OH)₂ ortiqcha HCl kislotasini xavfsiz neytrallaydi.',
  },
]

// ============================================================
// 1-KO'RGAZMA: SOF MODDA VS ARALASHMA (HARORAT VA TARKIB)
// ============================================================
function SofVaAralashmaCanvas() {
  const [tur, setTur] = useState('sof') // 'sof' | 'aralashma'
  const [issiqlik, setIssiqlik] = useState(100) // 20..120
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
      const sof = tur === 'sof'
      const haqiqiyQay = sof ? 100 : 106
      const stakanX = w * 0.08
      const stakanY = h * 0.22
      const stakanW = w * 0.34
      const stakanH = h * 0.56

      chizStakan(ctx, stakanX, stakanY, stakanW, stakanH, {
        suyuqlikRang: sof ? 'rgba(56, 189, 248, 0.35)' : 'rgba(20, 184, 166, 0.38)',
        tolish: 0.7,
        sarlavha: sof ? 'SOF SUV (H₂O)' : 'SHO‘R SUV (H₂O + NaCl)',
        yorliq: sof ? 'Qaynash: doim 100°C' : 'Qaynash: 103°C – 109°C (o‘zgaruvchan)',
      })

      // Zarrachalar harakati
      const tezlik = 0.5 + (issiqlik / 120) * 2.2
      for (let i = 0; i < 16; i++) {
        const px = stakanX + 24 + ((i * 37 + Math.sin(t * tezlik + i) * 18) % Math.max(40, stakanW - 48))
        const py = stakanY + stakanH * 0.36 + ((i * 23 + Math.cos(t * tezlik + i * 1.4) * 16) % Math.max(40, stakanH * 0.55))
        chizZarracha(ctx, px, py, 7, '#38bdf8', '')
        if (!sof && i % 3 === 0) {
          chizZarracha(ctx, px + 11, py - 6, 5.5, '#facc15', 'Na⁺')
        }
      }

      // Qaynash pufakchalari
      if (issiqlik >= haqiqiyQay - 2) {
        for (let b = 0; b < 9; b++) {
          const bx = stakanX + 20 + ((b * 43) % Math.max(30, stakanW - 40))
          const by = stakanY + stakanH - 15 - (((t * 55 + b * 29) % (stakanH * 0.65)))
          ctx.strokeStyle = 'rgba(255,255,255,0.75)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(bx, by, 4 + (b % 3), 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Termometr
      chizTermometr(ctx, stakanX + stakanW + 28, stakanY + 10, stakanH - 20, issiqlik, 125, sof ? '#38bdf8' : '#f59e0b')

      // O'ng taraf: Qaynash termogrammasi
      const gx = w * 0.56
      const gy = h * 0.18
      const gw = w * 0.37
      const gh = h * 0.62

      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)'
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(gx, gy, gw, gh, 14)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('Isitish egri chizig‘i T(vaqt)', gx + gw / 2, gy + 22)

      const ox = gx + 36
      const oy = gy + gh - 34
      const axW = gw - 56
      const axH = gh - 70

      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(ox, gy + 36)
      ctx.lineTo(ox, oy)
      ctx.lineTo(ox + axW, oy)
      ctx.stroke()

      // 100°C gorizontal chiziq
      const y100 = oy - axH * 0.65
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)'
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      ctx.moveTo(ox, y100)
      ctx.lineTo(ox + axW, y100)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 11px "Times New Roman", serif'
      ctx.textAlign = 'right'
      ctx.fillText('100°C', ox - 4, y100 + 4)

      // Egri chiziq
      ctx.strokeStyle = sof ? '#38bdf8' : '#f59e0b'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(ox, oy - axH * 0.1)
      if (sof) {
        ctx.lineTo(ox + axW * 0.42, y100)
        ctx.lineTo(ox + axW * 0.95, y100) // Qat'iy tekis plato!
      } else {
        ctx.lineTo(ox + axW * 0.42, y100 - 4)
        ctx.lineTo(ox + axW * 0.95, y100 - axH * 0.25) // Doimiy ko'tariluvchi!
      }
      ctx.stroke()

      ctx.fillStyle = sof ? '#7dd3fc' : '#fcd34d'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        sof ? 'Tekis plato → O‘zgarmas harorat!' : 'Egri ko‘tariladi → Tarkib o‘zgaradi!',
        gx + gw / 2,
        gy + gh - 10
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [tur, issiqlik])

  return (
    <KorgazmaRamka
      sarlavha="1. Sof modda va Aralashma farqi (Termogramma)"
      qisqaFormula={tur === 'sof' ? 'H₂O — bir xil zarrachalar' : 'H₂O + Na⁺ + Cl⁻ — har xil zarrachalar'}
      ikon="harorat"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setTur('sof')
              tovushChiqar('tasdiq')
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition ${
              tur === 'sof'
                ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            Sof modda (H₂O)
          </button>
          <button
            type="button"
            onClick={() => {
              setTur('aralashma')
              tovushChiqar('tasdiq')
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition ${
              tur === 'aralashma'
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            Aralashma (H₂O + Tuz)
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Harorat: {issiqlik}°C</span>
            <input
              type="range"
              min={25}
              max={120}
              value={issiqlik}
              onChange={(e) => setIssiqlik(Number(e.target.value))}
              className="accent-yellow-400 cursor-pointer"
            />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Sof modda: T_qay va T_erish doimiy
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Aralashma: T_qay o‘zgaruvchan oraliqda
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Fizik usulda ajratish mumkin
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 2-KO'RGAZMA: GOMOGEN VS GETEROGEN ARALASHMALAR
// ============================================================
const NAMUNALAR_6_1 = [
  { id: 'havo', nom: 'Havo (N₂ + O₂)', gomogen: true, zarracha: '1 nm dan kichik', rang: 'rgba(56,189,248,0.18)' },
  { id: 'shor', nom: 'Tuzli suv (NaCl + H₂O)', gomogen: true, zarracha: 'Ionlar (ko‘rinmas)', rang: 'rgba(56,189,248,0.34)' },
  { id: 'loyqa', nom: 'Loyqa suv (Qum + H₂O)', gomogen: false, zarracha: '> 1000 nm (cho‘kma)', rang: 'rgba(180,120,60,0.4)' },
  { id: 'granit', nom: 'Granit toshi', gomogen: false, zarracha: 'Yirik kristallar', rang: 'rgba(148,163,184,0.45)' },
]

function GomogenGeterogenCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const [lupa, setLupa] = useState(true)
  const canvasRef = useRef(null)

  const namuna = NAMUNALAR_6_1[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      // Chap stakan / namuna
      const bx = w * 0.1
      const by = h * 0.18
      const bw = w * 0.34
      const bh = h * 0.62

      if (namuna.id === 'granit') {
        ctx.fillStyle = '#475569'
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.roundRect(bx + 15, by + 20, bw - 30, bh - 35, 18)
        ctx.fill()
        ctx.stroke()
        const ranglar = ['#cbd5e1', '#f472b6', '#1e293b', '#facc15']
        for (let i = 0; i < 38; i++) {
          ctx.fillStyle = ranglar[i % 4]
          const rx = bx + 28 + ((i * 53) % Math.max(30, bw - 65))
          const ry = by + 35 + ((i * 39) % Math.max(30, bh - 75))
          ctx.fillRect(rx, ry, 10 + (i % 7), 8 + (i % 5))
        }
        ctx.fillStyle = '#fde047'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText('Qattiq har xil jinsli (Granit)', bx + bw / 2, by + bh + 18)
      } else {
        chizStakan(ctx, bx, by, bw, bh, {
          suyuqlikRang: namuna.rang,
          tolish: 0.76,
          sarlavha: namuna.nom,
          yorliq: namuna.gomogen ? 'GOMOGEN (1 faza)' : 'GETEROGEN (ko‘p faza)',
        })

        if (!namuna.gomogen) {
          // Cho'kma qatlami
          ctx.fillStyle = '#92400e'
          ctx.beginPath()
          ctx.roundRect(bx + 6, by + bh - 34, bw - 12, 28, [4, 4, 8, 8])
          ctx.fill()
          for (let q = 0; q < 24; q++) {
            const qx = bx + 14 + ((q * 37) % Math.max(20, bw - 28))
            const qy = by + bh - 45 - ((q * 19 + Math.sin(t + q) * 12) % 85)
            chizZarracha(ctx, qx, qy, 4.5, '#d97706', '')
          }
        }
      }

      // O'ng taraf: Lupa (1000x Mikroskop)
      const cx = w * 0.72
      const cy = h * 0.5
      const r = Math.min(w * 0.2, h * 0.36)

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = '#040b1d'
      ctx.fill()
      ctx.lineWidth = 4
      ctx.strokeStyle = namuna.gomogen ? '#22d3ee' : '#f59e0b'
      ctx.stroke()
      ctx.clip()

      if (lupa) {
        if (namuna.gomogen) {
          for (let i = 0; i < 22; i++) {
            const px = cx - r + 20 + ((i * 47 + Math.sin(t * 1.4 + i) * 20) % (r * 2 - 40))
            const py = cy - r + 20 + ((i * 31 + Math.cos(t * 1.3 + i) * 20) % (r * 2 - 40))
            chizZarracha(ctx, px, py, i % 3 === 0 ? 7 : 5, i % 3 === 0 ? '#facc15' : '#38bdf8', '')
          }
        } else {
          for (let i = 0; i < 12; i++) {
            const px = cx - r + 25 + ((i * 59 + Math.sin(t * 0.6 + i) * 10) % (r * 2 - 50))
            const py = cy - r + 30 + ((i * 43) % (r * 2 - 55))
            ctx.fillStyle = i % 2 === 0 ? '#b45309' : '#64748b'
            ctx.beginPath()
            ctx.roundRect(px, py, 16 + (i % 6), 13 + (i % 5), 4)
            ctx.fill()
          }
        }
      } else {
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText('Lupa o‘chirilgan', cx, cy)
      }
      ctx.restore()

      ctx.fillStyle = namuna.gomogen ? '#22d3ee' : '#fbbf24'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        namuna.gomogen ? 'Tekis taqsimlangan — chegara yo‘q' : 'Aniq chegara va zarrachalar ko‘rinadi',
        cx,
        cy + r + 24
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [namuna, lupa])

  return (
    <KorgazmaRamka
      sarlavha="2. Gomogen (Bir jinsli) vs Geterogen (Har xil jinsli)"
      qisqaFormula={`Zarracha o'lchami: ${namuna.zarracha}`}
      ikon="mikroskop"
      boshqaruv={
        <>
          {NAMUNALAR_6_1.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setTanlov(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition ${
                tanlov === i
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800'
              }`}
            >
              {n.nom}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setLupa((v) => !v)
              tovushChiqar('tasdiq')
            }}
            className="ml-auto px-3 py-2 rounded-xl text-xs font-extrabold border border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
          >
            {lupa ? 'Lupa: YOQILGAN (1000x)' : 'Lupa: O‘CHIRILGAN'}
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Gomogen: Tarkibi har nuqtada bir xil
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Geterogen: Ko‘z yoki mikroskopda farqlanadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Holati: {namuna.gomogen ? 'Bir jinsli' : 'Ko‘p jinsli'}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 3-KO'RGAZMA: SUSPENZIYA VS EMULSIYA (CHAYQATISH VA TINDIRISH)
// ============================================================
function SuspenziyaEmulsiyaCanvas() {
  const [chayqatVaqt, setChayqatVaqt] = useState(0)
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
      const tinish = Math.min(1, chayqatVaqt / 100) // 0 = yangi chayqatildi, 1 = to'liq tindi

      // Chap: SUSPENZIYA (Qattiq bo'r + Suv -> cho'kadi)
      const lx = w * 0.12
      const ly = h * 0.16
      const sw = w * 0.3
      const sh = h * 0.64
      chizStakan(ctx, lx, ly, sw, sh, {
        suyuqlikRang: tinish > 0.7 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(203, 213, 225, 0.4)',
        tolish: 0.78,
        sarlavha: 'SUSPENZIYA (Bo‘r + Suv)',
        yorliq: 'Qattiq zarracha → Pastga cho‘kadi',
      })

      for (let i = 0; i < 26; i++) {
        const x = lx + 16 + ((i * 29) % Math.max(24, sw - 32))
        const boshY = ly + sh * 0.3 + ((i * 21) % (sh * 0.55))
        const maqsadY = ly + sh - 10 - (i % 3) * 5
        const py = boshY + (maqsadY - boshY) * tinish + (1 - tinish) * Math.sin(t * 3 + i) * 6
        chizZarracha(ctx, x, py, 5, '#e2e8f0', '')
      }

      // O'ng: EMULSIYA (Suyuq moy + Suv -> yuqoriga suzib chiqadi)
      const rx = w * 0.58
      chizStakan(ctx, rx, ly, sw, sh, {
        suyuqlikRang: 'rgba(56, 189, 248, 0.3)',
        tolish: 0.78,
        sarlavha: 'EMULSIYA (Moy + Suv)',
        yorliq: 'Yengil moy → Yuqoriga qalqiydi',
      })

      for (let i = 0; i < 24; i++) {
        const x = rx + 16 + ((i * 31) % Math.max(24, sw - 32))
        const boshY = ly + sh * 0.3 + ((i * 23) % (sh * 0.58))
        const maqsadY = ly + sh * 0.26 + (i % 2) * 7
        const py = boshY + (maqsadY - boshY) * tinish + (1 - tinish) * Math.cos(t * 3 + i) * 6
        chizZarracha(ctx, x, py, 6, '#facc15', '')
      }

      if (tinish > 0.75) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.55)'
        ctx.fillRect(rx + 6, ly + sh * 0.22, sw - 12, 18 * tinish)
      }

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [chayqatVaqt])

  useEffect(() => {
    if (chayqatVaqt >= 100) return
    const id = setInterval(() => {
      setChayqatVaqt((v) => Math.min(100, v + 4))
    }, 120)
    return () => clearInterval(id)
  }, [chayqatVaqt])

  return (
    <KorgazmaRamka
      sarlavha="3. Suspenziya vs Emulsiya (Tindirish mexanizmi)"
      qisqaFormula={chayqatVaqt < 35 ? 'Chayqatildi — loyqalanish holati' : chayqatVaqt < 90 ? 'Ajralish davom etmoqda...' : 'To‘liq ikki qatlamga ajraldi'}
      ikon="tomchi"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setChayqatVaqt(0)
              tovushChiqar('bosqich')
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:brightness-110"
          >
            Qayta Chayqatish!
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Tinish jarayoni: {chayqatVaqt}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={chayqatVaqt}
              onChange={(e) => setChayqatVaqt(Number(e.target.value))}
              className="accent-emerald-400 cursor-pointer"
            />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-slate-200">
            Suspenziya = Qattiq + Suyuq (loy, bo‘r+suv)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Emulsiya = Suyuq + Suyuq (yog‘+suv, sut)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Zichlik farqi sabab tezda qatlamlanadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 4-KO'RGAZMA: AEROZOLLAR (TUMAN, TUTUN, CHANG)
// ============================================================
const AEROZOL_REJIMLAR = [
  { id: 'tuman', nom: 'Tuman / Bulut', tarkib: 'Gaz + Suyuq tomchilar', rang: '#7dd3fc', shakl: 'doira' },
  { id: 'tutun', nom: 'Tutun (Saja)', tarkib: 'Gaz + Qattiq qurum', rang: '#94a3b8', shakl: 'burchak' },
  { id: 'chang', nom: 'Chang bo‘roni', tarkib: 'Gaz + Qattiq qum', rang: '#f59e0b', shakl: 'burchak' },
]

function AerozolCanvas() {
  const [rejim, setRejim] = useState(0)
  const [shamol, setShamol] = useState(3)
  const canvasRef = useRef(null)

  const faol = AEROZOL_REJIMLAR[rejim]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.0018 * shamol

      // Havo molekulalari (ko'rinmas fon oqimi)
      for (let i = 0; i < 28; i++) {
        const hx = ((i * 61 + t * 55) % (w + 40)) - 20
        const hy = 40 + ((i * 47 + Math.sin(t + i) * 24) % Math.max(60, h - 80))
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)'
        ctx.beginPath()
        ctx.arc(hx, hy, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Aerozol zarrachalari
      for (let j = 0; j < 24; j++) {
        const ax = ((j * 79 + t * 85) % (w + 40)) - 20
        const ay = 50 + ((j * 53 + Math.cos(t * 0.8 + j) * 28) % Math.max(70, h - 100))
        if (faol.shakl === 'doira') {
          chizZarracha(ctx, ax, ay, 8 + (j % 4), faol.rang, '')
        } else {
          ctx.fillStyle = faol.rang
          ctx.beginPath()
          ctx.roundRect(ax, ay, 11 + (j % 5), 9 + (j % 4), 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.beginPath()
      ctx.roundRect(18, 16, w - 36, 46, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${faol.nom} — ${faol.tarkib} (Geterogen aerozol)`, w / 2, 44)

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [faol, shamol])

  return (
    <KorgazmaRamka
      sarlavha="4. Aerozollar: Gaz ichidagi suyuqlik va qattiq zarrachalar"
      qisqaFormula={faol.tarkib}
      ikon="tolqin"
      boshqaruv={
        <>
          {AEROZOL_REJIMLAR.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRejim(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition ${
                rejim === i
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800'
              }`}
            >
              {r.nom}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Oqim tezligi: {shamol}x</span>
            <input
              type="range"
              min={1}
              max={6}
              value={shamol}
              onChange={(e) => setShamol(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Tuman: Havodagi mayda suv tomchilari
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-slate-300">
            Tutun: Gazdagi qattiq qurum zarrachalari
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Barcha aerozollar geterogen aralashmadir
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 5-KO'RGAZMA: TABIIY ARALASHMALAR TARKIBI
// ============================================================
const TABIIY_ARALASHMALAR = [
  {
    id: 'havo',
    nom: 'Atmosfera havosi',
    turi: 'Gomogen (Gaz + Gaz)',
    qismlar: [
      { nom: 'Azot (N₂)', foiz: 78, rang: '#38bdf8' },
      { nom: 'Kislorod (O₂)', foiz: 21, rang: '#ef4444' },
      { nom: 'Ar, CO₂ va boshqalar', foiz: 1, rang: '#a855f7' },
    ],
  },
  {
    id: 'dengiz',
    nom: 'Dengiz suvi',
    turi: 'Gomogen (Eritma)',
    qismlar: [
      { nom: 'Toza suv (H₂O)', foiz: 96.5, rang: '#0ea5e9' },
      { nom: 'Osh tuzi (NaCl)', foiz: 2.7, rang: '#facc15' },
      { nom: 'MgCl₂ va CaSO₄', foiz: 0.8, rang: '#34d399' },
    ],
  },
  {
    id: 'bronza',
    nom: 'Bronza qotishmasi',
    turi: 'Gomogen (Qattiq eritma)',
    qismlar: [
      { nom: 'Mis (Cu)', foiz: 88, rang: '#ea580c' },
      { nom: 'Qalay (Sn)', foiz: 12, rang: '#94a3b8' },
    ],
  },
]

function TabiiyAralashmaCanvas() {
  const [tanlov, setTanlov] = useState(0)
  const canvasRef = useRef(null)
  const faol = TABIIY_ARALASHMALAR[tanlov]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let kadr

    const chiz = (vaqt) => {
      const { w, h } = canvasOlchami(canvas, ctx)
      chizFonSetka(ctx, w, h)
      const t = vaqt * 0.002

      // Chap: Doiraviy tarkib diagrammasi
      const cx = w * 0.28
      const cy = h * 0.52
      const r = Math.min(w * 0.19, h * 0.34)
      let burchak = -Math.PI / 2

      faol.qismlar.forEach((q) => {
        const qadam = (q.foiz / 100) * Math.PI * 2
        ctx.fillStyle = q.rang
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, r, burchak, burchak + qadam)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#030712'
        ctx.lineWidth = 2
        ctx.stroke()
        burchak += qadam
      })

      ctx.fillStyle = '#030712'
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('100%', cx, cy + 5)

      // O'ng: Tarkib ro'yxati + Zarracha oqimi
      const rx = w * 0.54
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Times New Roman", serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${faol.nom} (${faol.turi})`, rx, h * 0.2)

      faol.qismlar.forEach((q, idx) => {
        const y = h * 0.32 + idx * 54
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.strokeStyle = q.rang
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(rx, y, w * 0.4, 42, 10)
        ctx.fill()
        ctx.stroke()

        chizZarracha(ctx, rx + 24, y + 21, 9 + Math.sin(t + idx) * 1.2, q.rang, '')
        ctx.fillStyle = '#e2e8f0'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(q.nom, rx + 44, y + 25)

        ctx.fillStyle = '#fde047'
        ctx.textAlign = 'right'
        ctx.fillText(`${q.foiz}%`, rx + w * 0.38, y + 25)
        ctx.textAlign = 'left'
      })

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [faol])

  return (
    <KorgazmaRamka
      sarlavha="5. Tabiiy va texnik aralashmalar tarkibi"
      qisqaFormula={faol.turi}
      ikon="grafik"
      boshqaruv={
        <>
          {TABIIY_ARALASHMALAR.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setTanlov(i)
                tovushChiqar('tasdiq')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition ${
                tanlov === i
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                  : 'bg-slate-900 text-blue-200 border-blue-800'
              }`}
            >
              {m.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Havo: 78% N₂ + 21% O₂ + 1% inert gazlar
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Qotishmalar ham qattiq aralashmadir
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Tabiatda sof moddalar juda kam uchraydi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// 6-KO'RGAZMA: ARALASHMADA XOSSALAR SAQLANISHI (Fe + S vs FeS)
// ============================================================
function XossaSaqlanishCanvas() {
  const [rejim, setRejim] = useState('aralashma') // 'aralashma' | 'birikma'
  const [magnitMasofa, setMagnitMasofa] = useState(0) // 0 = uzoq, 100 = yaqin
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

      const aralashma = rejim === 'aralashma'
      const tortish = aralashma ? magnitMasofa / 100 : 0

      // Magnit
      const mx = w * 0.5
      const my = h * 0.25 - 30 + (magnitMasofa / 100) * 55
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.roundRect(mx - 42, my, 42, 26, [8, 0, 0, 8])
      ctx.fill()
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.roundRect(mx, my, 42, 26, [0, 8, 8, 0])
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', mx - 21, my + 17)
      ctx.fillText('S', mx + 21, my + 17)
      ctx.fillText('MAGNIT', mx, my - 8)

      // Petri kosachasi
      const px = w * 0.25
      const py = h * 0.68
      const pw = w * 0.5
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(px, py, pw, 48, 12)
      ctx.fill()
      ctx.stroke()

      if (aralashma) {
        // Sariq oltingugurt (S) va kulrang temir (Fe)
        for (let i = 0; i < 16; i++) {
          const sx = px + 24 + ((i * 29) % Math.max(40, pw - 48))
          chizZarracha(ctx, sx, py + 32, 6, '#facc15', 'S')

          const fxBase = px + 34 + ((i * 33) % Math.max(40, pw - 68))
          const fyBase = py + 24
          const fx = fxBase + (mx - fxBase) * tortish * 0.75
          const fy = fyBase + (my + 34 - fyBase) * tortish + Math.sin(t + i) * 1.5
          chizZarracha(ctx, fx, fy, 6.5, '#64748b', 'Fe')
        }
      } else {
        // Kimyoviy birikma FeS (magnitga tortilmaydi!)
        for (let i = 0; i < 20; i++) {
          const bx = px + 24 + ((i * 25) % Math.max(40, pw - 48))
          const by = py + 26 + (i % 2) * 8
          chizZarracha(ctx, bx, by, 7, '#334155', '')
        }
      }

      ctx.fillStyle = aralashma ? '#34d399' : '#f87171'
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        aralashma
          ? 'Fe + S aralashmasida temir o‘z magnit xossasini saqlaydi!'
          : 'FeS birikmasida yangi modda hosil bo‘lgan — magnit tortmaydi!',
        w / 2,
        h * 0.91
      )

      kadr = kadrSora(canvas, chiz)
    }

    kadr = kadrSora(canvas, chiz)
    return () => kadrniBekorQil(kadr)
  }, [rejim, magnitMasofa])

  return (
    <KorgazmaRamka
      sarlavha="6. Aralashmada boshlang‘ich modda xossalari saqlanishi"
      qisqaFormula={rejim === 'aralashma' ? 'Fe + S (Aralashma)' : 'FeS (Kimyoviy birikma)'}
      ikon="magnit"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setRejim('aralashma')
              tovushChiqar('tasdiq')
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${
              rejim === 'aralashma'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            Fe + S Aralashmasi
          </button>
          <button
            type="button"
            onClick={() => {
              setRejim('birikma')
              tovushChiqar('tasdiq')
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border ${
              rejim === 'birikma'
                ? 'bg-rose-400 text-slate-950 border-rose-300'
                : 'bg-slate-900 text-blue-200 border-blue-800'
            }`}
          >
            FeS Birikmasi (Qizdirilgan)
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-300">Magnitni yaqinlashtirish: {magnitMasofa}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={magnitMasofa}
              onChange={(e) => setMagnitMasofa(Number(e.target.value))}
              className="accent-rose-400 cursor-pointer"
            />
          </div>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Aralashmada yangi modda hosil bo‘lmaydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Har bir modda o‘z xossasini saqlab qoladi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Birikmada eski xossalar yo‘qoladi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  )
}

// ============================================================
// O'YIN MA'LUMOTLARI (6.1 ARALASHMALAR)
// ============================================================
const OYIN1_GURUHLAR = [
  { id: 'gomogen', nom: 'GOMOGEN (Bir jinsli)', tavsif: 'Zarrachalari ko‘zga ko‘rinmaydi' },
  { id: 'geterogen', nom: 'GETEROGEN (Har xil jinsli)', tavsif: 'Ikki yoki ko‘p qatlamli' },
]

const OYIN1_NAMUNALAR = [
  { nom: 'Toza atmosfera havosi', qisqa: 'N₂ + O₂ + Ar', guruh: 'gomogen', izoh: 'Gazlar o‘zaro to‘liq aralashib bir jinsli faza hosil qiladi.' },
  { nom: 'Loyqa daryo suvi', qisqa: 'Suv + loy va qum', guruh: 'geterogen', izoh: 'Qum zarrachalari ko‘rinib turadi va cho‘kadi.' },
  { nom: 'Shakarli choy', qisqa: 'Shakar + issiq suv', guruh: 'gomogen', izoh: 'Shakar to‘liq erib tiniq eritma hosil qiladi.' },
  { nom: 'O‘simlik yog‘i va suv', qisqa: 'Ikki suyuqlik qatlami', guruh: 'geterogen', izoh: 'Yog‘ suvda erimaydi va tepada alohida qatlam hosil qiladi.' },
  { nom: 'Bronza qotishmasi', qisqa: 'Cu + Sn qattiq aralashmasi', guruh: 'gomogen', izoh: 'Suyuq holda aralashtirib qotirilgan bir jinsli qotishma.' },
  { nom: 'Qum va temir qipig‘i', qisqa: 'Qattiq donachalar', guruh: 'geterogen', izoh: 'Qum va temir donachalari ko‘z bilan aniq ajraladi.' },
  { nom: 'Etil spirti va suv', qisqa: 'To‘liq aralashuvchi suyuqliklar', guruh: 'gomogen', izoh: 'Cheksiz aralashib bir jinsli eritma beradi.' },
  { nom: 'Granit toshi', qisqa: 'Kvars + slyuda + dala shpati', guruh: 'geterogen', izoh: 'Turli rangdagi mineral kristallari ko‘rinadi.' },
]

const OYIN2_GURUHLAR = [
  { id: 'suspenziya', nom: 'Suspenziya', tavsif: 'Qattiq + Suyuq' },
  { id: 'emulsiya', nom: 'Emulsiya', tavsif: 'Suyuq + Suyuq' },
  { id: 'aerozol', nom: 'Aerozol', tavsif: 'Gaz + Suyuq/Qattiq' },
  { id: 'qotishma', nom: 'Qotishma', tavsif: 'Qattiq + Qattiq (eritma)' },
]

const OYIN2_NAMUNALAR = [
  { nom: 'Bo‘r kukuni va suv', qisqa: 'Oq loyqa suyuqlik', guruh: 'suspenziya', izoh: 'Erimaydigan qattiq bo‘r suvda muallaq turadi.' },
  { nom: 'Sut (yog‘ tomchilari suvda)', qisqa: 'Ikki aralashmaydigan suyuqlik', guruh: 'emulsiya', izoh: 'Moy tomchilari suv ichida mayda holda tarqalgan.' },
  { nom: 'Tonggi tuman', qisqa: 'Havo + suv tomchilari', guruh: 'aerozol', izoh: 'Gaz muhitda muallaq turgan mayda suyuqlik tomchilari.' },
  { nom: 'Po‘lat (Temir + Uglerod)', qisqa: 'Metall qotishmasi', guruh: 'qotishma', izoh: 'Suyuq holatda qo‘shilib qotirilgan bir jinsli qotishma.' },
  { nom: 'Zavod mo‘risidan chiqqan tutun', qisqa: 'Gaz + qurum zarrachalari', guruh: 'aerozol', izoh: 'Qattiq qurum va gaz aralashmasi aerozol deyiladi.' },
  { nom: 'Benzin va suv aralashmasi', qisqa: 'Chayqatilgan ikki suyuqlik', guruh: 'emulsiya', izoh: 'Bir-birida erimaydigan suyuqliklar emulsiyasi.' },
]

const OYIN3_SAVOLLAR = [
  {
    belgi: 'Termogramma tahlili',
    savol: 'Qizdirilganda harorati bir nuqtada to‘xtamasdan, 102°C dan 108°C gacha ko‘tarilib qaynagan suyuqlik nima?',
    variantlar: ['Sof kimyoviy element', 'Distillangan toza suv', 'Individual birikma', 'Aralashma (masalan, sho‘r suv)'],
    togri: 3,
    izoh: 'Aralashmalarning qaynash harorati doimiy bo‘lmaydi, konsentratsiya oshgani sari ko‘tariladi.',
  },
  {
    belgi: 'Magnit siri',
    savol: 'Idishdagi kulrang-sariq kukun magnitga tortildi. Qizdirilgandan keyin esa magnitga umuman tortilmadi. Nima sodir bo‘ldi?',
    variantlar: [
      'Fe + S aralashmasi kimyoviy reaksiyaga kirishib FeS birikmasiga aylandi',
      'Temir bug‘lanib ketdi',
      'Magnit kuchi tugab qoldi',
      'Oltingugurt erib temirga yopishdi',
    ],
    togri: 0,
    izoh: 'Aralashmada Fe o‘z xossasini saqlaydi, birikmada (FeS) esa yangi xossali modda hosil bo‘ladi.',
  },
  {
    belgi: 'Tabiatdagi eng muhim gaz aralashmasi',
    savol: 'Quruq atmosfera havosining asosiy qismini qaysi ikki gaz tashkil qiladi?',
    variantlar: ['90% Azot va 10% Geliy', '78% Azot (N₂) va 21% Kislorod (O₂)', '50% Kislorod va 50% Vodorod', '78% Kislorod va 21% Karbonat angidrid'],
    togri: 1,
    izoh: 'Havo — tabiiy gomogen gaz aralashmasi: 78% N₂, 21% O₂, ~1% boshqa gazlar.',
  },
  {
    belgi: 'Tarkib qonuni',
    savol: 'Shakar va suvdan 5% li, 20% li yoki 40% li eritma tayyorlash mumkin. Bu aralashmaning qaysi xossasini ko‘rsatadi?',
    variantlar: [
      'Shakar suvda kimyoviy yonadi',
      'Suvning formulasi o‘zgaradi',
      'Aralashma tarkibi ixtiyoriy nisbatda o‘zgaruvchan bo‘ladi',
      'Aralashmalar doimiy tarkibga ega',
    ],
    togri: 2,
    izoh: 'Kimyoviy birikmalardan farqli o‘laroq, aralashmalar istalgan massa nisbatida olinishi mumkin.',
  },
]

const DUEL_6_1 = [
  { savol: 'Aralashmani tashkil etuvchi moddalarning fizik xossalari...', variantlar: ['Butunlay yo‘qoladi', 'Faqat qattiqlashadi', 'Atomga bo‘linadi', 'Saqlanib qoladi'], togri: 3, izoh: 'Aralashmada yangi modda hosil bo‘lmagani uchun xossalar saqlanadi.' },
  { savol: 'Qaysi biri gomogen (bir jinsli) aralashma?', variantlar: ['Toza tuz eritmasi', 'Qum va suv', 'Yog‘ va suv', 'Temir va oltingugurt'], togri: 0, izoh: 'Tuz suvda to‘liq erib bir jinsli tizim hosil qiladi.' },
  { savol: 'Qattiq mayda modda suyuqlikda erimasdan muallaq tursa nima deyiladi?', variantlar: ['Sof modda', 'Suspenziya', 'Emulsiya', 'Qotishma'], togri: 1, izoh: 'Bo‘r+suv yoki loyqa suv suspenziyaga misol.' },
  { savol: 'Ikki aralashmaydigan suyuqlik aralashmasi (yog‘ + suv) nima deyiladi?', variantlar: ['Aerozol', 'Gaz eritmasi', 'Emulsiya', 'Suspenziya'], togri: 2, izoh: 'Suyuq + suyuq geterogen tizim — emulsiya.' },
  { savol: 'Havoda suzib yurgan mayda suv tomchilari (tuman) qaysi turga kiradi?', variantlar: ['Qotishma', 'Suspenziya', 'Sof suv', 'Aerozol'], togri: 3, izoh: 'Gaz ichidagi suyuq yoki qattiq zarrachalar — aerozol.' },
  { savol: 'Distillangan suvning qaynash harorati qanday?', variantlar: ['Qat’iy 100°C (doimiy)', '90°C dan 120°C gacha', '0°C', 'O‘zgarib turadi'], togri: 0, izoh: 'Sof modda aniq va o‘zgarmas fizik konstantalarga ega.' },
  { savol: 'Bronza qotishmasi qanday aralashma turiga kiradi?', variantlar: ['Emulsiya', 'Gomogen (qattiq aralashma)', 'Geterogen aerozol', 'Sof element'], togri: 1, izoh: 'Qotishmalar bir jinsli (gomogen) qattiq aralashmalar qatoriga kiradi.' },
  { savol: 'Dengiz suvi tarkibining taxminan necha foizini erigan tuzlar tashkil qiladi?', variantlar: ['0%', '25%', '~3.5%', '50%'], togri: 2, izoh: 'Dengiz suvining ~96.5% i toza suv va ~3.5% i erigan tuzlardir.' },
]

export default function Mavzu6_1() {
  const korgazmalar = [
    { nom: '1. Sof vs Aralashma', ikon: 'harorat', komponent: <SofVaAralashmaCanvas /> },
    { nom: '2. Gomogen / Geterogen', ikon: 'mikroskop', komponent: <GomogenGeterogenCanvas /> },
    { nom: '3. Suspenziya / Emulsiya', ikon: 'tomchi', komponent: <SuspenziyaEmulsiyaCanvas /> },
    { nom: '4. Aerozollar', ikon: 'tolqin', komponent: <AerozolCanvas /> },
    { nom: '5. Tabiiy aralashma', ikon: 'grafik', komponent: <TabiiyAralashmaCanvas /> },
    { nom: '6. Fe + S Xossalari', ikon: 'magnit', komponent: <XossaSaqlanishCanvas /> },
  ]

  const oyinlar = [
    { nom: '1. Gomogen / Geterogen', ikon: 'palitra', komponent: <GuruhlashOyini nom="Gomogen yoki Geterogen?" ikon="palitra" guruhlar={OYIN1_GURUHLAR} topshiriqlar={OYIN1_NAMUNALAR} /> },
    { nom: '2. Aralashma Turlari', ikon: 'kolba', komponent: <GuruhlashOyini nom="Aralashma Turini Top" ikon="kolba" guruhlar={OYIN2_GURUHLAR} topshiriqlar={OYIN2_NAMUNALAR} /> },
    { nom: '3. Xossa Detektivi', ikon: 'qidiruv', komponent: <TezkorTanlovOyini nom="Tarkib va Xossa Detektivi" ikon="qidiruv" savollar={OYIN3_SAVOLLAR} /> },
    { nom: '4. Jamoalar Dueli', ikon: 'kubok', komponent: <JamoalarDueliPanel sarlavha="6.1 Aralashmalar Dueli" savollar={DUEL_6_1} /> },
  ]

  return (
    <SmartDarsQobiq
      mavzuRaqam="6.1"
      mavzuNom="Aralashmalar"
      oldingiRaqam="5.5"
      oldingiNom="Neytrallanish reaksiyasi"
      takrorlashSavollar={TAKRORLASH_5_5}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  )
}
