"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import { canvasOlchami, umumiyAudio, variantlarniAralashtir } from "@/lib/maktab-animatsiya"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"

function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const ctx = umumiyAudio()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (turi === "togri") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(523.25, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
    } else if (turi === "xato") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
      osc.start(now)
      osc.stop(now + 0.28)
    } else {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.1)
    }
  } catch {
    // Audio xatosi e'tiborsiz
  }
}

const ZICHLIK_JISMLAR = [
  { id: "pokak", nom: "Po'kak (0.24 g/cm³)", rho: 0.24, yTarget: 0.22, rang: "#d97706" },
  { id: "muz", nom: "Muz (0.92 g/cm³)", rho: 0.92, yTarget: 0.42, rang: "#bae6fd" },
  { id: "plastik", nom: "Plastik (1.18 g/cm³)", rho: 1.18, yTarget: 0.58, rang: "#a855f7" },
  { id: "temir", nom: "Temir (7.87 g/cm³)", rho: 7.87, yTarget: 0.78, rang: "#94a3b8" },
  { id: "oltin", nom: "Oltin (19.3 g/cm³)", rho: 19.3, yTarget: 0.81, rang: "#facc15" },
]

const MOOS_MINERALLAR = [
  { b: 1, nom: "1. Talk (Tirnoq tirnaydi)", rang: "#cbd5e1" },
  { b: 2, nom: "2. Gips (CaSO₄·2H₂O)", rang: "#e2e8f0" },
  { b: 3, nom: "3. Kalsit / Ohaktosh (Mis tanga tirnaydi)", rang: "#93c5fd" },
  { b: 5, nom: "5. Apatit (Pichoq tirnaydi)", rang: "#4ade80" },
  { b: 7, nom: "7. Kvars (SiO₂ — Oynani kesadi)", rang: "#38bdf8" },
  { b: 9, nom: "9. Korund / Yoqut (Al₂O₃)", rang: "#f43f5e" },
  { b: 10, nom: "10. Olmos (C — Eng qattiq modda)", rang: "#facc15" },
]

export default function Mavzu4_1() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("zichlik_minora")
  const [oyinRejim, setOyinRejim] = useState("suzadimi")

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
    document.addEventListener("fullscreenchange", fn)
    return () => document.removeEventListener("fullscreenchange", fn)
  }, [])

  const takrorlash3_7 = [
    {
      savol: "So'ndirilmagan ohak (CaO) suvga qo'shilganda (CaO + H₂O) qanday modda hosil bo'ladi?",
      variantlar: ["Ca(OH)₂ — So'ndirilgan ohak", "CaCO₃ — Ohaktosh", "CaCl₂ — Kalsiy xlorid", "CO₂ — Gaz"],
      togriJavob: "Ca(OH)₂ — So'ndirilgan ohak",
      izoh: "Asosli oksid (CaO) suv bilan birikib asos — kalsiy gidroksid Ca(OH)₂ hosil qiladi.",
    },
    {
      savol: "Kislota va ishqor orasida boradigan NaOH + HCl → NaCl + H₂O reaksiyasi qanday nomlanadi?",
      variantlar: ["Fotosintez", "Neytrallanish (almashinish) reaksiyasi", "Parchalanish reaksiyasi", "Sublimatsiya"],
      togriJavob: "Neytrallanish (almashinish) reaksiyasi",
      izoh: "Ishqor va kislota o'zaro ta'sirlashib tuz hamda suv hosil qilishi neytrallanish reaksiyasidir.",
    },
    {
      savol: "O'simliklar bargida quyosh nuri ta'sirida 6CO₂ + 6H₂O dan nima sintezlanadi?",
      variantlar: ["CaCO₃ va H₂O", "H₂SO₄", "C₆H₁₂O₆ (Glyukoza) va 6O₂↑", "NaCl va H₂"],
      togriJavob: "C₆H₁₂O₆ (Glyukoza) va 6O₂↑",
      izoh: "Fotosintez jarayonida anorganik CO₂ va H₂O dan organik glyukoza hamda erkin kislorod hosil bo'ladi.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: ZICHLIK MINORASI (ρ = m / V)
  // ═══════════════════════════════════════════════════════════════════════════
  const minoraCanvasRef = useRef(null)
  const [tanlanganJism, setTanlanganJism] = useState(ZICHLIK_JISMLAR[1])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "zichlik_minora") return
    const canvas = minoraCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w * 0.42
    const topY = h * 0.14
    const botY = h * 0.86
    const cw = 180
    const ch = botY - topY

    // 4 ta suyuqlik qatlami
    const qatlamlar = [
      { nom: "Spirt (ρ = 0.79 g/cm³)", rang: "rgba(168,85,247,0.32)" },
      { nom: "Yog' (ρ = 0.92 g/cm³)", rang: "rgba(250,204,21,0.38)" },
      { nom: "Suv (ρ = 1.00 g/cm³)", rang: "rgba(56,189,248,0.38)" },
      { nom: "Asal / Glitserin (ρ = 1.42 g/cm³)", rang: "rgba(217,119,6,0.5)" },
    ]

    qatlamlar.forEach((q, idx) => {
      const qy = topY + idx * (ch / 4)
      ctx.fillStyle = q.rang
      ctx.fillRect(cx - cw / 2, qy, cw, ch / 4)
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "bold 13px 'Times New Roman', serif"
      ctx.textAlign = "left"
      ctx.fillText(q.nom, cx + cw / 2 + 16, qy + ch / 8 + 4)
    })

    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 4
    ctx.strokeRect(cx - cw / 2, topY, cw, ch)

    // Tashlangan jism
    const jy = h * tanlanganJism.yTarget
    ctx.fillStyle = tanlanganJism.rang
    ctx.beginPath()
    ctx.arc(cx, jy, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#020617"
    ctx.font = "bold 12px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(`${tanlanganJism.rho}`, cx, jy + 4)

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.fillText(`${tanlanganJism.nom} — o'z zichligiga mos qatlamda to'xtaydi`, w / 2, h * 0.94)
  }, [asosiyBolim, animRejim, tanlanganJism])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: ARXIMED USULIDA HAJM VA ZICHLIK TOPISH (V = V₂ - V₁)
  // ═══════════════════════════════════════════════════════════════════════════
  const arximedCanvasRef = useRef(null)
  const [arxNamuna, setArxNamuna] = useState({ nom: "Temir (Fe)", m: 157.4, v: 20, rho: 7.87, rang: "#94a3b8" })
  const [suvgaTushdi, setSuvgaTushdi] = useState(true)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "arximed") return
    const canvas = arximedCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w * 0.34
    const topY = h * 0.16
    const botY = h * 0.84
    const vJoriy = suvgaTushdi ? 50 + arxNamuna.v : 50
    const suvH = ((botY - topY) * vJoriy) / 100

    // Suv
    ctx.fillStyle = "rgba(56,189,248,0.32)"
    ctx.fillRect(cx - 50, botY - suvH, 100, suvH)

    // Silindr
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 3.5
    ctx.strokeRect(cx - 50, topY, 100, botY - topY)

    // Namuna
    const ny = suvgaTushdi ? botY - 28 : topY - 28
    ctx.fillStyle = arxNamuna.rang
    ctx.beginPath()
    ctx.roundRect(cx - 24, ny - 16, 48, 32, 8)
    ctx.fill()

    // O'ngda formula va hisob
    const rx = w * 0.56
    ctx.textAlign = "left"
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText(`Namuna: ${arxNamuna.nom}`, rx, h * 0.25)

    ctx.fillStyle = "#38bdf8"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.fillText(`Tarozi massasi (m): ${arxNamuna.m} g`, rx, h * 0.4)
    ctx.fillText(
      `Suv sathi: V₁ = 50 ml  →  V₂ = ${vJoriy} ml (ΔV = ${suvgaTushdi ? arxNamuna.v : 0} cm³)`,
      rx,
      h * 0.54
    )

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 22px 'Times New Roman', serif"
    ctx.fillText(
      `ρ = m / V = ${arxNamuna.m} / ${arxNamuna.v} = ${arxNamuna.rho} g/cm³`,
      rx,
      h * 0.72
    )
  }, [asosiyBolim, animRejim, arxNamuna, suvgaTushdi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: MOOS QATTIQLIK SHKALASI (1 DAN 10 GACHA)
  // ═══════════════════════════════════════════════════════════════════════════
  const moosCanvasRef = useRef(null)
  const [m1, setM1] = useState(MOOS_MINERALLAR[6]) // Olmos (10)
  const [m2, setM2] = useState(MOOS_MINERALLAR[4]) // Kvars (7)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "moos") return
    const canvas = moosCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    // 1..10 shkala ustunlari
    MOOS_MINERALLAR.forEach((m, idx) => {
      const x = 45 + idx * ((w - 90) / MOOS_MINERALLAR.length)
      const bw = (w - 130) / MOOS_MINERALLAR.length
      const bh = m.b * 22
      const y = h * 0.72 - bh

      ctx.fillStyle = m.rang
      ctx.beginPath()
      ctx.roundRect(x, y, bw, bh, 8)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(`${m.b}`, x + bw / 2, y - 8)
      ctx.font = "bold 12px 'Times New Roman', serif"
      ctx.fillText(m.nom.split(" ")[1], x + bw / 2, h * 0.78)
    })

    const ghalaba =
      m1.b > m2.b
        ? `${m1.nom} (${m1.b}) → ${m2.nom} (${m2.b}) yuzasini TIRNAYDI!`
        : m1.b < m2.b
        ? `${m2.nom} (${m2.b}) → ${m1.nom} (${m1.b}) yuzasini TIRNAYDI!`
        : "Ikkalasining qattiqligi TENG!"

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 20px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(ghalaba, w / 2, h * 0.9)
  }, [asosiyBolim, animRejim, m1, m2])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: SUVNING ANOMAL ZICHLIGI (+4°C VA MUZNING SUZISHI)
  // ═══════════════════════════════════════════════════════════════════════════
  const muzCanvasRef = useRef(null)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "muz_anomaliya") return
    const canvas = muzCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    // Qishki ko'l kesimi
    const kx = w * 0.12
    const kw = w * 0.76

    // Muz qatlami (0°C, rho = 0.917 g/cm3)
    ctx.fillStyle = "#bae6fd"
    ctx.fillRect(kx, h * 0.22, kw, 48)
    ctx.fillStyle = "#020617"
    ctx.font = "bold 16px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText("MUZ QATLAMI (0°C, ρ = 0.917 g/cm³ — Suvdan yengil bo'lgani uchun cho'kmaydi!)", w / 2, h * 0.22 + 30)

    // Suv qatlami (+4°C, rho = 1.000 g/cm3)
    const grd = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.82)
    grd.addColorStop(0, "rgba(56,189,248,0.35)")
    grd.addColorStop(1, "rgba(2,132,199,0.65)")
    ctx.fillStyle = grd
    ctx.fillRect(kx, h * 0.22 + 48, kw, h * 0.56)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.fillText("1°C .. 2°C suv qatlami", w / 2, h * 0.48)
    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 20px 'Times New Roman', serif"
    ctx.fillText(
      "ENG ZICH SUV TUBDA: +4°C (ρ = 1.000 g/cm³ — Suv jonivorlari muzlamay tirik qoladi)",
      w / 2,
      h * 0.74
    )
  }, [asosiyBolim, animRejim])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: ERUVCHANLIK VA QOVUSHQOQLIK (SUVDA ERISH SINOVI)
  // ═══════════════════════════════════════════════════════════════════════════
  const eruvCanvasRef = useRef(null)
  const [eruvModda, setEruvModda] = useState("NaCl")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "eruvchanlik") return
    const canvas = eruvCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const DATA = {
      NaCl: {
        nom: "Osh tuzi (NaCl) — Yaxshi eriydi (36 g / 100 ml suvda)",
        suvRang: "rgba(56,189,248,0.28)",
        holat: "eritma",
      },
      CuSO4: {
        nom: "Mis kuporosi (CuSO₄) — Yaxshi eriydi (Moviy shaffof eritma)",
        suvRang: "rgba(2,132,199,0.55)",
        holat: "eritma",
      },
      CaCO3: {
        nom: "Bo'r / Ohaktosh (CaCO₃) — Erimaydi (Idish tubiga oq cho'kma tushadi)",
        suvRang: "rgba(56,189,248,0.22)",
        holat: "chokma",
      },
      Yog: {
        nom: "O'simlik yog'i — Suvda erimaydi (Zichligi kichikligi uchun suv yuzasida qalqib turadi)",
        suvRang: "rgba(56,189,248,0.28)",
        holat: "sirtda",
      },
    }

    const d = DATA[eruvModda]
    const cx = w / 2
    const topY = h * 0.2
    const botY = h * 0.78

    ctx.fillStyle = d.suvRang
    ctx.fillRect(cx - 80, topY + 40, 160, botY - topY - 40)

    if (d.holat === "chokma") {
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(cx - 76, botY - 32, 152, 28)
    } else if (d.holat === "sirtda") {
      ctx.fillStyle = "#facc15"
      ctx.fillRect(cx - 76, topY + 40, 152, 34)
    }

    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 3.5
    ctx.strokeRect(cx - 80, topY, 160, botY - topY)

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 19px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(d.nom, cx, h * 0.9)
  }, [asosiyBolim, animRejim, eruvModda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: OPTIK XOSSALAR (SHAFFOF, YARIM SHAFFOF, YALTIROQ KO'ZGU)
  // ═══════════════════════════════════════════════════════════════════════════
  const optikCanvasRef = useRef(null)
  const [optikTur, setOptikTur] = useState("shaffof")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "optik") return
    const canvas = optikCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h * 0.48

    // Lazer manbai (chapda)
    ctx.fillStyle = "#475569"
    ctx.fillRect(60, cy - 16, 70, 32)

    // Tushuvchi lazer nuri
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(130, cy)
    ctx.lineTo(cx - 25, cy)
    ctx.stroke()

    // O'rtadagi modda plastinkasi
    ctx.fillStyle =
      optikTur === "shaffof"
        ? "rgba(56,189,248,0.3)"
        : optikTur === "yarim"
        ? "rgba(226,232,240,0.65)"
        : "#cbd5e1"
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 3
    ctx.fillRect(cx - 25, cy - 85, 50, 170)
    ctx.strokeRect(cx - 25, cy - 85, 50, 170)

    if (optikTur === "shaffof") {
      // To'liq o'tadi
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(cx + 25, cy)
      ctx.lineTo(w - 80, cy)
      ctx.stroke()
    } else if (optikTur === "yarim") {
      // Sochilib tarqaladi
      ;[-45, 0, 45].forEach((dy) => {
        ctx.strokeStyle = "rgba(239,68,68,0.55)"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx + 25, cy)
        ctx.lineTo(w - 100, cy + dy)
        ctx.stroke()
      })
    } else {
      // Metall ko'zgudan qaytadi
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(cx - 25, cy)
      ctx.lineTo(140, cy - 95)
      ctx.stroke()
    }

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(
      optikTur === "shaffof"
        ? "Shaffof moddalar (Kvars shisha, Toza suv, Havo) — Yorug'lik nurlarini to'liq o'tkazadi"
        : optikTur === "yarim"
        ? "Yarim shaffof moddalar (Xira shisha, Tuman) — Yorug'likni sochib o'tkazadi"
        : "Shaffofmas yaltiroq moddalar (Kumush Ag, Alyuminiy Al) — Yorug'likni ko'zgu kabi qaytaradi",
      cx,
      h * 0.88
    )
  }, [asosiyBolim, animRejim, optikTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const suzishSavollar = [
    { jism: "Po'kak bo'lagi (ρ = 0.24 g/cm³) suvga (ρ = 1.00 g/cm³) tashlansa:", holat: "suzadi" },
    { jism: "Temir gayka (ρ = 7.87 g/cm³) suvga (ρ = 1.00 g/cm³) tashlansa:", holat: "chokadi" },
    { jism: "Muz bo'lagi (ρ = 0.92 g/cm³) suvga (ρ = 1.00 g/cm³) tashlansa:", holat: "suzadi" },
    { jism: "Temir gayka (ρ = 7.87 g/cm³) suyuq SIMOBGA (ρ = 13.6 g/cm³) tashlansa:", holat: "suzadi" },
    { jism: "Oltin uzuk (ρ = 19.3 g/cm³) suyuq SIMOBGA (ρ = 13.6 g/cm³) tashlansa:", holat: "chokadi" },
    { jism: "O'simlik yog'i (ρ = 0.92 g/cm³) suvga quyilsa:", holat: "suzadi" },
  ]
  const [szIdx, setSzIdx] = useState(0)
  const [szBall, setSzBall] = useState(0)
  const [szTugadi, setSzTugadi] = useState(false)

  const hisobSavollar = [
    { savol: "Massasi m = 54 g, hajmi V = 20 cm³ bo'lgan alyuminiy bo'lagining zichligini (ρ = m / V) toping:", variantlar: ["5.4 g/cm³", "1.0 g/cm³", "7.8 g/cm³", "2.7 g/cm³"], togri: "2.7 g/cm³" },
    { savol: "Zichligi ρ = 19.3 g/cm³ bo'lgan toza oltinning V = 10 cm³ quymasi necha gramm keladi (m = ρ · V)?", variantlar: ["193 g", "19.3 g", "1.93 g", "100 g"], togri: "193 g" },
    { savol: "50 ml suvli menzurkaga tosh tushirilganda suv sathi 75 ml ga ko'tarildi. Toshning massasi 100 g bo'lsa, zichligi necha?", variantlar: ["25 g/cm³", "4.0 g/cm³ (ΔV = 25 cm³)", "2.0 g/cm³", "1.33 g/cm³"], togri: "4.0 g/cm³ (ΔV = 25 cm³)" },
    { savol: "Suv qaysi haroratda eng maksimal zichlikka (ρ = 1.000 g/cm³) ega bo'ladi?", variantlar: ["+100°C da", "-10°C da", "+4°C da", "0°C da"], togri: "+4°C da" },
  ]
  const [hIdx, setHIdx] = useState(0)
  const [hTanlov, setHTanlov] = useState(null)
  const [hBall, setHBall] = useState(0)
  const [hTugadi, setHTugadi] = useState(false)

  const moosSavollar = [
    { savol: "Moos qattiqlik shkalasi bo'yicha eng qattiq (10 ball) va eng yumshoq (1 ball) minerallar juftligini toping:", variantlar: ["10 — Kvars, 1 — Gips", "10 — Temir, 1 — Bo'r", "10 — Korund, 1 — Oltin", "10 — Olmos, 1 — Talk"], togri: "10 — Olmos, 1 — Talk" },
    { savol: "Kvars (qattiqligi 7) va Kalsit (qattiqligi 3) bir-biriga ishqalansa nima yuz beradi?", variantlar: ["Kvars kalsitni tirnaydi (chizadi)", "Kalsit kvarsni tirnaydi", "Ikkalasi ham sinib ketadi", "Hech biri tirnalmaydi"], togri: "Kvars kalsitni tirnaydi (chizadi)" },
    { savol: "Quyidagi fizik xossalardan qaysi biri moddaning agregat holati va haroratiga bog'liq?", variantlar: ["Guruh raqami", "Zichlik va eruvchanlik", "Atom yadrosidagi protonlar soni", "Kimyoviy belgi"], togri: "Zichlik va eruvchanlik" },
    { savol: "Nima uchun qishda muzlagan daryo va ko'llarda muz suv yuzasida qolib, tubiga cho'kib ketmaydi?", variantlar: ["Shamol muzni ko'tarib turgani uchun", "Muzda tuz ko'p bo'lgani uchun", "Muzning zichligi (0.92 g/cm³) suyuq suvnikidan (1.00 g/cm³) kichik bo'lgani uchun", "Muz issiq bo'lgani uchun"], togri: "Muzning zichligi (0.92 g/cm³) suyuq suvnikidan (1.00 g/cm³) kichik bo'lgani uchun" },
  ]
  const [mIdx, setMIdx] = useState(0)
  const [mTanlov, setMTanlov] = useState(null)
  const [mBall, setMBall] = useState(0)
  const [mTugadi, setMTugadi] = useState(false)

  const duelSavollari = [
    { s: "Zichlikni hisoblash formulasi qaysi?", v: ["ρ = m / V", "ρ = m + V", "ρ = V / m"], j: "ρ = m / V" },
    { s: "Toza suvning (+4°C) zichligi nechaga teng?", v: ["13.6 g/cm³", "1.00 g/cm³", "7.87 g/cm³"], j: "1.00 g/cm³" },
    { s: "Moos shkalasida 10 ballik eng qattiq modda?", v: ["Talk", "Gips", "Olmos (C)"], j: "Olmos (C)" },
    { s: "Muz suvda cho'kadimi yoki suzadimi?", v: ["Suzadi (ρ=0.92)", "Cho'kadi", "Erib yo'qoladi"], j: "Suzadi (ρ=0.92)" },
  ]
  const [g1Idx, setG1Idx] = useState(0)
  const [g2Idx, setG2Idx] = useState(0)
  const [g1Ball, setG1Ball] = useState(0)
  const [g2Ball, setG2Ball] = useState(0)

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className={`w-full select-none transition-all duration-300 font-serif ${
        toliqEkran
          ? "fixed inset-0 z-50 bg-[#020617] p-4 sm:p-8 flex flex-col justify-between overflow-y-auto"
          : "space-y-4"
      }`}
    >
      <SmartDoskaNavigatsiya
        mavzuRaqam="4.1"
        mavzuNom="Moddalarning fizik xossalari"
        bobNom="4-bob. Moddalar va ularning xossalari"
        sahifa={53}
        oldingiRaqam="3.7"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.7"
          oldingiNom="Murakkab moddalarning olinishi"
          savollar={takrorlash3_7}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "zichlik_minora", nom: "1. Zichlik minorasi", ikon: "kolba" },
              { id: "arximed", nom: "2. ρ = m / (V₂ - V₁)", ikon: "tarozi" },
              { id: "moos", nom: "3. Moos qattiqligi", ikon: "kristall" },
              { id: "muz_anomaliya", nom: "4. +4°C va Muz", ikon: "tomchi" },
              { id: "eruvchanlik", nom: "5. Suvda eruvchanlik", ikon: "tolqin" },
              { id: "optik", nom: "6. Shaffoflik va Lazer", ikon: "yulduz" },
            ].map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  setAnimRejim(k.id)
                  tovushChiqar("bosqich")
                }}
                className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  animRejim === k.id
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                    : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
                }`}
              >
                <Ikon nom={k.ikon} olcham={16} />
                <span>{k.nom}</span>
              </button>
            ))}
          </div>

          {animRejim === "zichlik_minora" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={minoraCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {ZICHLIK_JISMLAR.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      setTanlanganJism(j)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                      tanlanganJism.id === j.id
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {j.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "arximed" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={arximedCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { nom: "Alyuminiy (Al)", m: 54.0, v: 20, rho: 2.7, rang: "#cbd5e1" },
                    { nom: "Temir (Fe)", m: 157.4, v: 20, rho: 7.87, rang: "#94a3b8" },
                    { nom: "Mis (Cu)", m: 179.2, v: 20, rho: 8.96, rang: "#f97316" },
                    { nom: "Oltin (Au)", m: 386.0, v: 20, rho: 19.3, rang: "#facc15" },
                  ].map((n) => (
                    <button
                      key={n.nom}
                      type="button"
                      onClick={() => {
                        setArxNamuna(n)
                        setSuvgaTushdi(true)
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                        arxNamuna.nom === n.nom
                          ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                          : "border-blue-900 bg-[#091538] text-blue-200"
                      }`}
                    >
                      {n.nom}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSuvgaTushdi((s) => !s)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs"
                >
                  {suvgaTushdi ? "Suvdan chiqarish (V₁ = 50 ml)" : "Menzurkaga tushirish (V₂)"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "moos" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={moosCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {MOOS_MINERALLAR.map((m) => (
                  <button
                    key={m.b}
                    type="button"
                    onClick={() => {
                      setM2(m1)
                      setM1(m)
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                      m1.b === m.b
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {m.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "muz_anomaliya" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={muzCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          )}

          {animRejim === "eruvchanlik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={eruvCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "NaCl", nom: "1. Osh tuzi (NaCl — Eriydi)" },
                  { id: "CuSO4", nom: "2. Mis kuporosi (CuSO₄ — Ko'k eritma)" },
                  { id: "CaCO3", nom: "3. Bo'r (CaCO₃ — Erimaydi, cho'kadi)" },
                  { id: "Yog", nom: "4. O'simlik yog'i (Erimaydi, suzadi)" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setEruvModda(m.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      eruvModda === m.id ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {m.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "optik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={optikCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "shaffof", nom: "1. Shaffof (Kvars shisha, Suv)" },
                  { id: "yarim", nom: "2. Yarim shaffof (Xira oyna, Tuman)" },
                  { id: "yaltiroq", nom: "3. Metall ko'zgu (Ag, Al — Qaytaradi)" },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOptikTur(o.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      optikTur === o.id ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {o.nom}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2-BO'LIM: 4 TA SMART DOSKA O'YINI */}
      {asosiyBolim === "oyinlar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { id: "suzadimi", nom: "1. Suzadi / Cho'kadi", ikon: "tomchi" },
              { id: "hisob", nom: "2. ρ = m / V Hisoblash", ikon: "hisob" },
              { id: "moos_oyin", nom: "3. Qattiqlik Sinovi", ikon: "kristall" },
              { id: "duel", nom: "4. Jamoalar Dueli (1 vs 2)", ikon: "kubok" },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOyinRejim(o.id)
                  tovushChiqar("bosqich")
                }}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  oyinRejim === o.id
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                    : "border-blue-900/60 bg-[#060b22] text-blue-200"
                }`}
              >
                <Ikon nom={o.ikon} olcham={18} />
                <span>{o.nom}</span>
              </button>
            ))}
          </div>

          {oyinRejim === "suzadimi" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!szTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Tajriba {szIdx + 1} / {suzishSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {szBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{suzishSavollar[szIdx].jism}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "suzadi", nom: "SUZIB CHIQADI (ρ_jism < ρ_suyuqlik)" },
                      { id: "chokadi", nom: "TUBIGA CHO'KADI (ρ_jism > ρ_suyuqlik)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === suzishSavollar[szIdx].holat) {
                            setSzBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (szIdx < suzishSavollar.length - 1) setSzIdx((i) => i + 1)
                          else setSzTugadi(true)
                        }}
                        className="p-5 rounded-2xl border border-cyan-500/40 bg-[#091538] hover:border-cyan-400 text-cyan-200 font-bold"
                      >
                        {t.nom}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">Natija: {szBall} / {suzishSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSzIdx(0)
                      setSzBall(0)
                      setSzTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "hisob" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!hTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Masala {hIdx + 1} / {hisobSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {hBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{hisobSavollar[hIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hisobSavollar[hIdx].variantlar.map((v) => {
                      const togri = v === hisobSavollar[hIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (hTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (hTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (hTanlov !== null) return
                            setHTanlov(v)
                            if (togri) {
                              setHBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left font-bold text-sm ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {hTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (hIdx < hisobSavollar.length - 1) {
                            setHIdx((i) => i + 1)
                            setHTanlov(null)
                          } else {
                            setHTugadi(true)
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm"
                      >
                        Keyingi →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">Natija: {hBall} / {hisobSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setHIdx(0)
                      setHTanlov(null)
                      setHBall(0)
                      setHTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "moos_oyin" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!mTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {mIdx + 1} / {moosSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {mBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{moosSavollar[mIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {moosSavollar[mIdx].variantlar.map((v) => {
                      const togri = v === moosSavollar[mIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (mTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (mTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (mTanlov !== null) return
                            setMTanlov(v)
                            if (togri) {
                              setMBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left font-bold text-sm ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {mTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (mIdx < moosSavollar.length - 1) {
                            setMIdx((i) => i + 1)
                            setMTanlov(null)
                          } else {
                            setMTugadi(true)
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm"
                      >
                        Keyingi →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">Natija: {mBall} / {moosSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setMIdx(0)
                      setMTanlov(null)
                      setMBall(0)
                      setMTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "duel" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-cyan-500/50 bg-[#051026] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-300">1-GURUH (Chap doska)</span>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 font-bold text-sm">{g1Ball} ball</span>
                </div>
                <p className="text-sm font-bold text-white">{duelSavollari[g1Idx].s}</p>
                <div className="space-y-2">
                  {variantlarniAralashtir(duelSavollari[g1Idx].v, duelSavollari[g1Idx].s, g1Idx).map(({ item: jav }) => (
                    <button
                      key={jav}
                      type="button"
                      onClick={() => {
                        if (jav === duelSavollari[g1Idx].j) {
                          setG1Ball((b) => b + 10)
                          tovushChiqar("togri")
                        } else {
                          tovushChiqar("xato")
                        }
                        setG1Idx((i) => (i + 1) % duelSavollari.length)
                      }}
                      className="w-full p-3 rounded-xl border border-cyan-800 bg-[#091a3a] hover:border-cyan-400 text-left text-xs sm:text-sm font-bold text-white"
                    >
                      {jav}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-amber-500/50 bg-[#1a1205] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-300">2-GURUH (O&apos;ng doska)</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-bold text-sm">{g2Ball} ball</span>
                </div>
                <p className="text-sm font-bold text-white">{duelSavollari[g2Idx].s}</p>
                <div className="space-y-2">
                  {variantlarniAralashtir(duelSavollari[g2Idx].v, duelSavollari[g2Idx].s, g2Idx).map(({ item: jav }) => (
                    <button
                      key={jav}
                      type="button"
                      onClick={() => {
                        if (jav === duelSavollari[g2Idx].j) {
                          setG2Ball((b) => b + 10)
                          tovushChiqar("togri")
                        } else {
                          tovushChiqar("xato")
                        }
                        setG2Idx((i) => (i + 1) % duelSavollari.length)
                      }}
                      className="w-full p-3 rounded-xl border border-amber-800 bg-[#291d09] hover:border-amber-400 text-left text-xs sm:text-sm font-bold text-white"
                    >
                      {jav}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
