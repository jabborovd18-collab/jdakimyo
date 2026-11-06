"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"

function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
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

export default function Mavzu3_7() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("sintez")
  const [oyinRejim, setOyinRejim] = useState("konstruktor")

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

  const takrorlash3_6 = [
    {
      savol: "Quruq osh tuzi (NaCl) va uning suvdagi eritmasi elektr tokini qanday o'tkazadi?",
      variantlar: [
        "Quruq NaCl tok o'tkazmaydi, suvdagi eritmasi esa erkin ionlar hisobiga tok o'tkazadi",
        "Ikkalasi ham tok o'tkazmaydi",
        "Faqat quruq NaCl tok o'tkazadi",
        "Shakar eritmasi kuchliroq tok o'tkazadi",
      ],
      togriJavob: "Quruq NaCl tok o'tkazmaydi, suvdagi eritmasi esa erkin ionlar hisobiga tok o'tkazadi",
      izoh: "NaCl suvda eriganda Na⁺ va Cl⁻ ionlariga ajralib elektr tokini o'tkazadi (elektrolit).",
    },
    {
      savol: "Ohakli suvni (Ca(OH)₂) loyqalatib, oq cho'kma (CaCO₃↓) hosil qiluvchi gaz qaysi?",
      variantlar: ["CO₂ (Karbonat angidrid)", "CO (Is gazi)", "O₂ (Kislorod)", "H₂ (Vodorod)"],
      togriJavob: "CO₂ (Karbonat angidrid)",
      izoh: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O reaksiyasi karbonat angidrid gazini aniqlashning sifat reaksiyasidir.",
    },
    {
      savol: "Suvsiz oq mis(II) sulfat (CuSO₄) kukuniga suv tekkanda qanday o'zgarish yuz beradi?",
      variantlar: ["Moviy-ko'k rangli mis kuporosiga (CuSO₄·5H₂O) aylanadi", "Qorayib ketadi", "Gazga aylanadi", "O'zgarmaydi"],
      togriJavob: "Moviy-ko'k rangli mis kuporosiga (CuSO₄·5H₂O) aylanadi",
      izoh: "Suvsiz oq CuSO₄ suvni yutib ko'k rangli kristallogidrat hosil qiladi.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: ODDIY MODDALARDAN SINTEZ (2Mg + O₂, S + O₂, C + O₂)
  // ═══════════════════════════════════════════════════════════════════════════
  const sintezCanvasRef = useRef(null)
  const [sintezModda, setSintezModda] = useState("Mg")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sintez") return
    const canvas = sintezCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.07
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h * 0.52

      // Kislorodli kolba
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.roundRect(cx - 110, h * 0.18, 220, h * 0.62, 28)
      ctx.stroke()

      const nurRang =
        sintezModda === "Mg"
          ? "#ffffff"
          : sintezModda === "S"
          ? "#38bdf8"
          : "#f97316"
      const r = 55 + Math.sin(t * 2) * 10
      const grd = ctx.createRadialGradient(cx, cy - 10, 4, cx, cy - 10, r * 1.6)
      grd.addColorStop(0, "#ffffff")
      grd.addColorStop(0.45, nurRang)
      grd.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(cx, cy - 10, r * 1.6, 0, Math.PI * 2)
      ctx.fill()

      const tenglama =
        sintezModda === "Mg"
          ? "2Mg + O₂ → 2MgO (Ko'zni qamashtiruvchi oq alanga → Oq kukun)"
          : sintezModda === "S"
          ? "S + O₂ → SO₂↑ (Moviy alanga bilan yonish → O'tkir hidli gaz)"
          : "C + O₂ → CO₂↑ (Cho'g'lanib yonish → Karbonat angidrid)"

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 19px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(tenglama, cx, h * 0.9)

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, sintezModda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: OKSID + SUV → ASOS YOKI KISLOTA (CaO + H₂O vs SO₃ + H₂O)
  // ═══════════════════════════════════════════════════════════════════════════
  const oksidSuvCanvasRef = useRef(null)
  const [oksidTur, setOksidTur] = useState("CaO")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "oksid_suv") return
    const canvas = oksidSuvCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const topY = h * 0.22
    const botY = h * 0.76
    const isAsos = oksidTur === "CaO"

    // Stakan va indikatorli eritma
    ctx.fillStyle = isAsos ? "rgba(236,72,153,0.45)" : "rgba(239,68,68,0.45)"
    ctx.fillRect(cx - 90, topY + 45, 180, botY - topY - 45)
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 3.5
    ctx.strokeRect(cx - 90, topY, 180, botY - topY)

    ctx.textAlign = "center"
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText(
      isAsos
        ? "CaO + H₂O → Ca(OH)₂ + Q (Ohakni so'ndirish)"
        : "SO₃ + H₂O → H₂SO₄ (Kislota hosil bo'lishi)",
      cx,
      52
    )

    ctx.fillStyle = isAsos ? "#f472b6" : "#f87171"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.fillText(
      isAsos
        ? "Metall oksidi + Suv → ASOS (Fenolftalein malina rangga kiradi)"
        : "Metallmas oksidi + Suv → KISLOTA (Lakmus qizil rangga kiradi)",
      cx,
      h * 0.88
    )
  }, [asosiyBolim, animRejim, oksidTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: NEYTRALLANISH ORQALI TUZ OLISH (NaOH + HCl → NaCl + H₂O)
  // ═══════════════════════════════════════════════════════════════════════════
  const neytralCanvasRef = useRef(null)
  const [neytralBosqich, setNeytralBosqich] = useState(1)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "neytral") return
    const canvas = neytralCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 26px 'Times New Roman', serif"
    ctx.fillText("NaOH (Ishqor) + HCl (Kislota) → NaCl (Tuz) + H₂O (Suv)", cx, 54)

    const cy = h * 0.54
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, 90, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()

    if (neytralBosqich === 1) {
      ctx.fillStyle = "rgba(236,72,153,0.45)"
      ctx.fillRect(cx - 72, cy + 20, 144, 38)
      ctx.fillStyle = "#f472b6"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillText("1-bosqich: NaOH + fenolftalein (Malina rangli ishqor)", cx, h * 0.88)
    } else if (neytralBosqich === 2) {
      ctx.fillStyle = "rgba(56,189,248,0.25)"
      ctx.fillRect(cx - 72, cy + 20, 144, 38)
      ctx.fillStyle = "#38bdf8"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillText("2-bosqich: HCl quyilganda rangsizlandi — NaCl + H₂O hosil bo'ldi", cx, h * 0.88)
    } else {
      ctx.fillStyle = "#ffffff"
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(cx - 56 + i * 15, cy + 40, 10, 10)
      }
      ctx.fillStyle = "#4ade80"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillText("3-bosqich: Suv bug'latilganda kosacha tubida oq NaCl kristallari qoldi!", cx, h * 0.88)
    }
  }, [asosiyBolim, animRejim, neytralBosqich])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: ALMASHINISH ORQALI CHO'KMA OLISH (Cu(OH)₂↓, CaCO₃↓, AgCl↓)
  // ═══════════════════════════════════════════════════════════════════════════
  const chokmaCanvasRef = useRef(null)
  const [chokmaTur, setChokmaTur] = useState("CuOH2")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "almashinish") return
    const canvas = chokmaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const DATA = {
      CuOH2: {
        tenglama: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
        izoh: "Havorang-ko'k jele ko'rinishidagi mis(II) gidroksid cho'kmasi tushadi",
        rang: "#0ea5e9",
      },
      CaCO3: {
        tenglama: "CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl",
        izoh: "Suvda erimaydigan oq bo'r (kalsiy karbonat) cho'kmasi tushadi",
        rang: "#f8fafc",
      },
      PbI2: {
        tenglama: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
        izoh: "'Oltin yomg'ir' — yaltiroq sariq qo'rg'oshin(II) yodid cho'kmasi tushadi",
        rang: "#facc15",
      },
    }

    const d = DATA[chokmaTur]
    const cx = w / 2
    const topY = h * 0.2
    const botY = h * 0.78

    ctx.fillStyle = "rgba(56,189,248,0.16)"
    ctx.fillRect(cx - 65, topY + 35, 130, botY - topY - 35)
    ctx.fillStyle = d.rang
    ctx.beginPath()
    ctx.roundRect(cx - 61, botY - 48, 122, 44, 10)
    ctx.fill()

    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 3.5
    ctx.strokeRect(cx - 65, topY, 130, botY - topY)

    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText(d.tenglama, cx, 46)

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.fillText(d.izoh, cx, h * 0.9)
  }, [asosiyBolim, animRejim, chokmaTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: PARCHALANISH ORQALI OKSID OLISH (CaCO₃ → CaO + CO₂↑)
  // ═══════════════════════════════════════════════════════════════════════════
  const parchCanvasRef = useRef(null)
  const [parchModda, setParchModda] = useState("malaxit")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "parchalanish") return
    const canvas = parchCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const isMalaxit = parchModda === "malaxit"
    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText(
      isMalaxit
        ? "(CuOH)₂CO₃ (Yashil malaxit) → 2CuO (Qora) + H₂O↑ + CO₂↑"
        : "CaCO₃ (Ohaktosh, 1000°C) → CaO (So'ndirilmagan ohak) + CO₂↑",
      w / 2,
      54
    )

    const mahsulotlar = isMalaxit
      ? [
          { f: "2CuO", nom: "Mis(II) oksid (Qora kukun)", rang: "#475569" },
          { f: "H₂O↑", nom: "Suv tomchilari (Idish devorida)", rang: "#38bdf8" },
          { f: "CO₂↑", nom: "Karbonat angidrid (Ohakli suvni loyqalatadi)", rang: "#4ade80" },
        ]
      : [
          { f: "CaO", nom: "Kalsiy oksid (Qurilish ohagi)", rang: "#f8fafc" },
          { f: "CO₂↑", nom: "Karbonat angidrid gazi", rang: "#38bdf8" },
        ]

    mahsulotlar.forEach((m, idx) => {
      const x = (w / (mahsulotlar.length + 1)) * (idx + 1)
      const y = h * 0.52
      ctx.fillStyle = "#0f172a"
      ctx.strokeStyle = m.rang
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(x - 115, y - 55, 230, 110, 18)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 28px 'Times New Roman', serif"
      ctx.fillText(m.f, x, y - 8)
      ctx.fillStyle = "#cbd5e1"
      ctx.font = "bold 13px 'Times New Roman', serif"
      ctx.fillText(m.nom, x, y + 28)
    })
  }, [asosiyBolim, animRejim, parchModda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: FOTOSINTEZ — TABIATDA ORGANIK MODDA SINTEZI
  // ═══════════════════════════════════════════════════════════════════════════
  const fotoCanvasRef = useRef(null)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "fotosintez") return
    const canvas = fotoCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h * 0.52

    // Yashil barg (xloroplast)
    ctx.fillStyle = "rgba(34,197,94,0.25)"
    ctx.strokeStyle = "#4ade80"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(cx, cy, 165, 75, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText("6CO₂ + 6H₂O  —(Quyosh nuri, Xlorofill)→  C₆H₁₂O₆ (Glyukoza) + 6O₂↑", cx, 52)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px 'Times New Roman', serif"
    ctx.fillText("XLOROPLAST (Tabiiy laboratoriya)", cx, cy - 6)
    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 15px 'Times New Roman', serif"
    ctx.fillText("Anorganik moddalardan (CO₂ va H₂O) organik shakar (C₆H₁₂O₆) sintezlanadi", cx, cy + 24)
  }, [asosiyBolim, animRejim])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const konstruktorSavollar = [
    { savol: "So'ndirilmagan ohak (CaO) suvga (H₂O) solinganda qanday murakkab modda hosil bo'ladi?", variantlar: ["Ca(OH)₂ — So'ndirilgan ohak (Asos)", "CaCO₃ — Ohaktosh", "CaCl₂ — Kalsiy xlorid", "CO₂ — Gaz"], togri: "Ca(OH)₂ — So'ndirilgan ohak (Asos)" },
    { savol: "Magniy tasmasi (Mg) kislorodda (O₂) yondirilganda qanday oq kukun hosil bo'ladi?", variantlar: ["MgO (Magniy oksid)", "Mg(OH)₂", "MgCO₃", "MgCl₂"], togri: "MgO (Magniy oksid)" },
    { savol: "Yashil malaxit ((CuOH)₂CO₃) qizdirib parchalanganda birdaniga nechta yangi murakkab modda hosil bo'ladi?", variantlar: ["3 ta: CuO (qora), H₂O va CO₂", "Faqat 1 ta Cu", "2 ta oddiy modda", "Hech narsa hosil bo'lmaydi"], togri: "3 ta: CuO (qora), H₂O va CO₂" },
    { savol: "O'simliklar bargida CO₂ va H₂O dan quyosh nuri yordamida qaysi murakkab organik modda sintezlanadi?", variantlar: ["C₆H₁₂O₆ (Glyukoza)", "NaCl (Osh tuzi)", "H₂SO₄ (Sulfat kislota)", "CaO (Ohak)"], togri: "C₆H₁₂O₆ (Glyukoza)" },
  ]
  const [kIdx, setKIdx] = useState(0)
  const [kTanlov, setKTanlov] = useState(null)
  const [kBall, setKBall] = useState(0)
  const [kTugadi, setKTugadi] = useState(false)

  const turSavollar = [
    { tenglama: "2Mg + O₂ → 2MgO (Ikki moddadan bitta murakkab modda)", tur: "birikish" },
    { tenglama: "CaCO₃ → CaO + CO₂↑ (Bitta moddadan ikki yangi modda)", tur: "parchalanish" },
    { tenglama: "NaOH + HCl → NaCl + H₂O (Ikki murakkab modda tarkibiy qismlari almashinishi)", tur: "almashinish" },
    { tenglama: "CaO + H₂O → Ca(OH)₂ (Oksid va suv birikib asos hosil qilishi)", tur: "birikish" },
    { tenglama: "(CuOH)₂CO₃ → 2CuO + H₂O + CO₂↑ (Malaxitning qizdirilganda ajralishi)", tur: "parchalanish" },
    { tenglama: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄ (Ko'k cho'kma tushishi)", tur: "almashinish" },
  ]
  const [trIdx, setTrIdx] = useState(0)
  const [trBall, setTrBall] = useState(0)
  const [trTugadi, setTrTugadi] = useState(false)

  const balansSavollar = [
    { savol: "?Mg + O₂ → 2MgO tenglamada magniy oldiga qaysi koeffitsiyent qo'yiladi?", variantlar: ["2", "1", "3", "4"], togri: "2" },
    { savol: "4P + ?O₂ → 2P₂O₅ tenglamada kislorod (O₂) oldiga qaysi koeffitsiyent qo'yiladi?", variantlar: ["5", "2", "4", "10"], togri: "5" },
    { savol: "4Al + 3O₂ → ?Al₂O₃ tenglamada alyuminiy oksid oldiga qaysi koeffitsiyent qo'yiladi?", variantlar: ["2", "1", "3", "4"], togri: "2" },
    { savol: "CuSO₄ + ?NaOH → Cu(OH)₂↓ + Na₂SO₄ tenglamada NaOH oldidagi koeffitsiyentni toping:", variantlar: ["2", "1", "3", "4"], togri: "2" },
  ]
  const [bIdx, setBIdx] = useState(0)
  const [bTanlov, setBTanlov] = useState(null)
  const [bBall, setBBall] = useState(0)
  const [bTugadi, setBTugadi] = useState(false)

  const duelSavollari = [
    { s: "CaO + H₂O reaksiyasida nima hosil bo'ladi?", v: ["Ca(OH)₂", "CaCO₃", "CaCl₂"], j: "Ca(OH)₂" },
    { s: "SO₃ + H₂O reaksiyasida qaysi kislota olinadi?", v: ["H₂SO₄", "HCl", "HNO₃"], j: "H₂SO₄" },
    { s: "CuSO₄ + 2NaOH reaksiyasida qanday rangli cho'kma tushadi?", v: ["Havorang Cu(OH)₂↓", "Qora CuO", "Sariq PbI₂"], j: "Havorang Cu(OH)₂↓" },
    { s: "Ohaktosh (CaCO₃) 1000°C da qizdirilsa qaysi gaz chiqadi?", v: ["CO₂↑", "H₂↑", "Cl₂↑"], j: "CO₂↑" },
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
        mavzuRaqam="3.7"
        mavzuNom="Murakkab moddalarning olinishi"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={46}
        oldingiRaqam="3.6"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.6"
          oldingiNom="Murakkab moddalarning xossalari"
          savollar={takrorlash3_6}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "sintez", nom: "1. Oddiydan Sintez", ikon: "olov" },
              { id: "oksid_suv", nom: "2. Oksid + H₂O", ikon: "tomchi" },
              { id: "neytral", nom: "3. NaOH + HCl → NaCl", ikon: "kolba" },
              { id: "almashinish", nom: "4. Cho'kma Sintezi", ikon: "kristall" },
              { id: "parchalanish", nom: "5. Malaxit va CaCO₃", ikon: "chaqmoq" },
              { id: "fotosintez", nom: "6. Tabiiy Fotosintez", ikon: "yulduz" },
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

          {animRejim === "sintez" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={sintezCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "Mg", nom: "1. 2Mg + O₂ → 2MgO (Oq nur)" },
                  { id: "S", nom: "2. S + O₂ → SO₂ (Moviy alanga)" },
                  { id: "C", nom: "3. C + O₂ → CO₂ (Cho'g'lanish)" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSintezModda(m.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      sintezModda === m.id ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {m.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "oksid_suv" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={oksidSuvCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOksidTur("CaO")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    oksidTur === "CaO" ? "border-pink-400 bg-pink-500/25 text-pink-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Asosli oksid: CaO + H₂O → Ca(OH)₂ (Ishqor)
                </button>
                <button
                  type="button"
                  onClick={() => setOksidTur("SO3")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    oksidTur === "SO3" ? "border-red-400 bg-red-500/25 text-red-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Kislotali oksid: SO₃ + H₂O → H₂SO₄ (Kislota)
                </button>
              </div>
            </div>
          )}

          {animRejim === "neytral" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={neytralCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { b: 1, nom: "1-bosqich: NaOH + Fenolftalein" },
                  { b: 2, nom: "2-bosqich: + HCl (Neytrallanish)" },
                  { b: 3, nom: "3-bosqich: Bug'latib NaCl tuzini olish" },
                ].map((s) => (
                  <button
                    key={s.b}
                    type="button"
                    onClick={() => setNeytralBosqich(s.b)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      neytralBosqich === s.b ? "border-emerald-400 bg-emerald-500/25 text-emerald-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {s.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "almashinish" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={chokmaCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "CuOH2", nom: "1. Cu(OH)₂↓ (Havorang cho'kma)" },
                  { id: "CaCO3", nom: "2. CaCO₃↓ (Oq bo'r cho'kmasi)" },
                  { id: "PbI2", nom: "3. PbI₂↓ (Oltin-sariq cho'kma)" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChokmaTur(c.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      chokmaTur === c.id ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {c.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "parchalanish" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={parchCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setParchModda("malaxit")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    parchModda === "malaxit" ? "border-emerald-400 bg-emerald-500/25 text-emerald-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Malaxit parchalanishi: (CuOH)₂CO₃ → 2CuO + H₂O + CO₂
                </button>
                <button
                  type="button"
                  onClick={() => setParchModda("ohaktosh")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    parchModda === "ohaktosh" ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Ohaktosh kuydirish: CaCO₃ → CaO + CO₂↑
                </button>
              </div>
            </div>
          )}

          {animRejim === "fotosintez" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={fotoCanvasRef} className="w-full h-full block" />
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
              { id: "konstruktor", nom: "1. Sintez Konstruktori", ikon: "kolba" },
              { id: "turi", nom: "2. Reaksiya Turi", ikon: "atom" },
              { id: "balans", nom: "3. Koeffitsiyent Qo'yish", ikon: "hisob" },
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

          {oyinRejim === "konstruktor" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!kTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Tajriba {kIdx + 1} / {konstruktorSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {kBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{konstruktorSavollar[kIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {konstruktorSavollar[kIdx].variantlar.map((v) => {
                      const togri = v === konstruktorSavollar[kIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (kTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (kTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (kTanlov !== null) return
                            setKTanlov(v)
                            if (togri) {
                              setKBall((b) => b + 1)
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
                  {kTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (kIdx < konstruktorSavollar.length - 1) {
                            setKIdx((i) => i + 1)
                            setKTanlov(null)
                          } else {
                            setKTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {kBall} / {konstruktorSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setKIdx(0)
                      setKTanlov(null)
                      setKBall(0)
                      setKTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "turi" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!trTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Reaksiya {trIdx + 1} / {turSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {trBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{turSavollar[trIdx].tenglama}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "birikish", nom: "BIRIKISH (A + B → AB)" },
                      { id: "parchalanish", nom: "PARCHALANISH (AB → A + B)" },
                      { id: "almashinish", nom: "ALMASHINISH (AB + CD → AD + CB)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === turSavollar[trIdx].tur) {
                            setTrBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (trIdx < turSavollar.length - 1) setTrIdx((i) => i + 1)
                          else setTrTugadi(true)
                        }}
                        className="p-5 rounded-2xl border border-cyan-500/40 bg-[#091538] hover:border-cyan-400 text-cyan-200 font-bold text-sm"
                      >
                        {t.nom}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">Natija: {trBall} / {turSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setTrIdx(0)
                      setTrBall(0)
                      setTrTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "balans" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!bTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Tenglama {bIdx + 1} / {balansSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {bBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{balansSavollar[bIdx].savol}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {balansSavollar[bIdx].variantlar.map((v) => {
                      const togri = v === balansSavollar[bIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (bTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (bTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (bTanlov !== null) return
                            setBTanlov(v)
                            if (togri) {
                              setBBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-4 rounded-2xl border text-center font-bold text-xl ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {bTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (bIdx < balansSavollar.length - 1) {
                            setBIdx((i) => i + 1)
                            setBTanlov(null)
                          } else {
                            setBTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {bBall} / {balansSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setBIdx(0)
                      setBTanlov(null)
                      setBBall(0)
                      setBTugadi(false)
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
                  {duelSavollari[g1Idx].v.map((jav) => (
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
                  {duelSavollari[g2Idx].v.map((jav) => (
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
