"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import { canvasOlchami, kadrSora, kadrniBekorQil, umumiyAudio, variantlarniAralashtir } from "@/lib/maktab-animatsiya"
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

export default function Mavzu3_6() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("nacl")
  const [oyinRejim, setOyinRejim] = useState("taqqos")

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

  const takrorlash3_5 = [
    {
      savol: "Temir (Fe) va Oltingugurt (S) qizdirilganda hosil bo'lgan FeS (Temir(II) sulfid) magnitga tortiladimi?",
      variantlar: [
        "Yo'q, chunki yangi murakkab modda dastlabki elementlar xossasini yo'qotadi",
        "Ha, temir borligi uchun tortiladi",
        "Faqat sovuq holda tortiladi",
        "Suvda suzib yuradi",
      ],
      togriJavob: "Yo'q, chunki yangi murakkab modda dastlabki elementlar xossasini yo'qotadi",
      izoh: "Kimyoviy reaksiya natijasida hosil bo'lgan murakkab modda mutlaqo yangi fizik va kimyoviy xossalarga ega bo'ladi.",
    },
    {
      savol: "III valentli Alyuminiy (Al) va II valentli Kislorod (O) birikmasining to'g'ri formulasini toping:",
      variantlar: ["Al₂O", "Al₂O₃", "AlO", "Al₃O₂"],
      togriJavob: "Al₂O₃",
      izoh: "Valentliklar chalishtirilganda Al ga 2, O ga 3 indeksi tushadi: Al₂O₃.",
    },
    {
      savol: "Har qanday toza suvda (H₂O) vodorod va kislorod massalari nisbati necha bo'ladi (Prust qonuni)?",
      variantlar: ["1 : 16", "3 : 8", "1 : 8", "2 : 1"],
      togriJavob: "1 : 8",
      izoh: "2 g vodorod va 16 g kislorod birikib 18 g suv hosil qiladi (2:16 = 1:8).",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: 2Na + Cl₂ → 2NaCl (XAVFLI ELEMENTLAR → FOYDALI OSH TUZI)
  // ═══════════════════════════════════════════════════════════════════════════
  const naclCanvasRef = useRef(null)
  const [naclBosqich, setNaclBosqich] = useState("oldin")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "nacl") return
    const canvas = naclCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.04
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      if (naclBosqich === "oldin") {
        // Chapda: Natriy (Na), O'ngda: Xlor (Cl2)
        const x1 = w * 0.28
        const x2 = w * 0.72
        const cy = h * 0.45

        ctx.fillStyle = "#cbd5e1"
        ctx.beginPath()
        ctx.roundRect(x1 - 55, cy - 35, 110, 70, 14)
        ctx.fill()
        ctx.fillStyle = "#020617"
        ctx.font = "bold 20px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("2Na (Metall)", x1, cy + 7)

        ctx.fillStyle = "#f43f5e"
        ctx.font = "bold 14px 'Times New Roman', serif"
        ctx.fillText("Suvda portlaydi, terini kuydiradi!", x1, cy + 68)

        // Cl2 gazi buluti
        ctx.fillStyle = "rgba(132,204,22,0.4)"
        ctx.beginPath()
        ctx.arc(x2, cy, 55 + Math.sin(t) * 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#bef264"
        ctx.font = "bold 20px 'Times New Roman', serif"
        ctx.fillText("Cl₂ (Xlor gazi)", x2, cy + 7)
        ctx.fillStyle = "#f43f5e"
        ctx.font = "bold 14px 'Times New Roman', serif"
        ctx.fillText("Bo'g'uvchi o'tkir zaharli gaz!", x2, cy + 68)
      } else {
        // Markazda: 2NaCl oq kristallari
        const cx = w / 2
        const cy = h * 0.46

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const x = cx - 72 + c * 48
            const y = cy - 44 + r * 44
            const isNa = (r + c) % 2 === 0
            ctx.fillStyle = isNa ? "#a855f7" : "#4ade80"
            ctx.beginPath()
            ctx.arc(x, y, isNa ? 14 : 18, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 11px 'Times New Roman', serif"
            ctx.textAlign = "center"
            ctx.fillText(isNa ? "Na⁺" : "Cl⁻", x, y + 4)
          }
        }

        ctx.fillStyle = "#4ade80"
        ctx.font = "bold 22px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(
          "2Na + Cl₂ → 2NaCl (Oq kristall osh tuzi, T_suyuq = 801°C, zararsiz ozuqa moddasi)",
          cx,
          h * 0.88
        )
      }

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, naclBosqich])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: ELEKTROLIT VA NOELEKTROLIT (QURUQ NaCl vs ERITMA vs SHAKAR)
  // ═══════════════════════════════════════════════════════════════════════════
  const elektrCanvasRef = useRef(null)
  const [eritmaTur, setEritmaTur] = useState("nacl_suv")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "elektrolit") return
    const canvas = elektrCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.05
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const yonadi = eritmaTur === "nacl_suv"
      const cx = w * 0.42
      const topY = h * 0.32
      const botY = h * 0.82

      // Stakan
      ctx.fillStyle = eritmaTur === "quruq_nacl" ? "rgba(255,255,255,0.06)" : "rgba(56,189,248,0.22)"
      ctx.fillRect(cx - 85, topY + 30, 170, botY - topY - 30)
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 3.5
      ctx.strokeRect(cx - 85, topY, 170, botY - topY)

      // 2 ta elektrod
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(cx - 50, topY - 35, 16, 145)
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(cx + 34, topY - 35, 16, 145)

      // Zarrachalar
      for (let i = 0; i < 8; i++) {
        const x =
          eritmaTur === "quruq_nacl"
            ? cx - 52 + (i % 4) * 34
            : cx - 55 + (i % 4) * 36 + Math.sin(t + i) * 14
        const y =
          eritmaTur === "quruq_nacl"
            ? botY - 38 + Math.floor(i / 4) * 22
            : topY + 65 + Math.floor(i / 4) * 55

        ctx.fillStyle =
          eritmaTur === "shakar"
            ? "#facc15"
            : i % 2 === 0
            ? "#a855f7"
            : "#4ade80"
        ctx.beginPath()
        ctx.arc(x, y, 11, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 10px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(
          eritmaTur === "shakar" ? "C₁₂" : i % 2 === 0 ? "Na⁺" : "Cl⁻",
          x,
          y + 3
        )
      }

      // O'ngda lampochka
      const lx = w * 0.76
      const ly = h * 0.45
      if (yonadi) {
        const g = ctx.createRadialGradient(lx, ly, 5, lx, ly, 65)
        g.addColorStop(0, "#fef08a")
        g.addColorStop(0.5, "rgba(250,204,21,0.4)")
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(lx, ly, 65, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = yonadi ? "#facc15" : "#334155"
      ctx.beginPath()
      ctx.arc(lx, ly, 26, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = yonadi ? "#4ade80" : "#f43f5e"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        yonadi ? "LAMPA YONDI (Erkin Na⁺ va Cl⁻ ionlari)" : "LAMPA YONMADI (Erkin ionlar yo'q)",
        lx,
        ly + 55
      )

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, eritmaTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: CO (IS GAZI) vs CO₂ (KARBONAT ANGIDRID) FARQI
  // ═══════════════════════════════════════════════════════════════════════════
  const gazCanvasRef = useRef(null)
  const [uglerodGaz, setUglerodGaz] = useState("CO2")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "co_co2") return
    const canvas = gazCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const isCO2 = uglerodGaz === "CO2"
    ctx.textAlign = "center"
    ctx.fillStyle = isCO2 ? "#38bdf8" : "#f43f5e"
    ctx.font = "bold 34px 'Times New Roman', serif"
    ctx.fillText(
      isCO2 ? "CO₂ — Karbonat angidrid (Mr = 44)" : "CO — Is gazi / Uglerod(II) oksid (Mr = 28)",
      w / 2,
      58
    )

    const punktlar = isCO2
      ? [
          "1. Havodan 1.5 marta og'ir (Mr = 44 > 29), pastga cho'kadi",
          "2. Yonmaydi va yonishni to'xtatadi (o't o'chirgichlarda ishlatiladi)",
          "3. Ohakli suvni loyqalatadi: CO₂ + Ca(OH)₂ → CaCO₃↓ (oq cho'kma) + H₂O",
          "4. O'simliklar fotosintezi va gazli ichimliklar uchun zarur",
        ]
      : [
          "1. Havodan biroz yengil (Mr = 28 < 29), rangsiz va hidsiz!",
          "2. Havoda moviy alanga bilan yonadi: 2CO + O₂ → 2CO₂ + Q",
          "3. Ohakli suv bilan reaksiyaga KIRISHMAYDI (loyqalanmaydi)",
          "4. O'ta zaharli! Qondagi gemoglobinni bloklab bo'g'ib qo'yadi",
        ]

    punktlar.forEach((p, idx) => {
      const y = 115 + idx * 58
      ctx.fillStyle = "#0f172a"
      ctx.strokeStyle = isCO2 ? "#38bdf8" : "#f43f5e"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(w * 0.1, y, w * 0.8, 44, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.fillText(p, w / 2, y + 27)
    })
  }, [asosiyBolim, animRejim, uglerodGaz])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: SUVSIZ CuSO₄ (OQ) ↔ CuSO₄·5H₂O (KO'K KUPOROS)
  // ═══════════════════════════════════════════════════════════════════════════
  const kuporosCanvasRef = useRef(null)
  const [suvliHolat, setSuvliHolat] = useState(true)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "kuporos") return
    const canvas = kuporosCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h * 0.56

    // Chinni kosacha
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, 95, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()

    // Kristallar
    ctx.fillStyle = suvliHolat ? "#0284c7" : "#e2e8f0"
    ctx.beginPath()
    ctx.roundRect(cx - 60, cy + 28, 120, 34, 12)
    ctx.fill()

    ctx.fillStyle = suvliHolat ? "#38bdf8" : "#facc15"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(
      suvliHolat
        ? "CuSO₄·5H₂O — Moviy mis kuporosi (Kristallogidrat)"
        : "CuSO₄ — Suvsiz mis(II) sulfat (Oq kukun)",
      cx,
      68
    )

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.fillText(
      suvliHolat
        ? "Suv tomizilganda oq CuSO₄ darhol ko'karadi (Suvni aniqlash reaktivi!)"
        : "Qizdirilganda 5 molekula suv bug'lanib ketadi: CuSO₄·5H₂O → CuSO₄ + 5H₂O↑",
      cx,
      h * 0.88
    )
  }, [asosiyBolim, animRejim, suvliHolat])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: 2H₂ + O₂ → 2H₂O (GAZLARDAN SUYUQLIK HOSIL BO'LISHI)
  // ═══════════════════════════════════════════════════════════════════════════
  const suvSintezCanvasRef = useRef(null)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "h2o_xossa") return
    const canvas = suvSintezCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const ustunlar = [
      {
        nom: "Vodorod (H₂)",
        tur: "Oddiy modda (Gaz)",
        x1: "Qaynash: -253°C",
        x2: "Olovda portlab YONADI",
        rang: "#38bdf8",
      },
      {
        nom: "Kislorod (O₂)",
        tur: "Oddiy modda (Gaz)",
        x1: "Qaynash: -183°C",
        x2: "Yonishni QO'LLAB-QUVVATLAYDI",
        rang: "#ef4444",
      },
      {
        nom: "Suv (H₂O)",
        tur: "Murakkab modda (Suyuqlik)",
        x1: "Qaynash: +100°C",
        x2: "Olovni O'CHIRADI!",
        rang: "#4ade80",
      },
    ]

    ustunlar.forEach((u, idx) => {
      const x = (w / 4) * (idx + 1)
      ctx.fillStyle = "#0f172a"
      ctx.strokeStyle = u.rang
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(x - 105, 55, 210, 240, 18)
      ctx.fill()
      ctx.stroke()

      ctx.textAlign = "center"
      ctx.fillStyle = u.rang
      ctx.font = "bold 24px 'Times New Roman', serif"
      ctx.fillText(u.nom, x, 100)

      ctx.fillStyle = "#cbd5e1"
      ctx.font = "bold 15px 'Times New Roman', serif"
      ctx.fillText(u.tur, x, 145)
      ctx.fillText(u.x1, x, 190)

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 15px 'Times New Roman', serif"
      ctx.fillText(u.x2, x, 240)
    })
  }, [asosiyBolim, animRejim])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: TERMIK BARQARORLIK (SHAKAR C₁₂H₂₂O₁₁ vs OSH TUZI NaCl)
  // ═══════════════════════════════════════════════════════════════════════════
  const termikCanvasRef = useRef(null)
  const [termikQizigan, setTermikQizigan] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "termik") return
    const canvas = termikCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const x1 = w * 0.28
    const x2 = w * 0.72
    const cy = h * 0.56

    // Chapda: Shakar (C12H22O11)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 3.5
    ctx.strokeRect(x1 - 65, cy - 55, 130, 85)
    ctx.fillStyle = termikQizigan ? "#1e293b" : "#f8fafc"
    ctx.fillRect(x1 - 55, cy - 10, 110, 36)

    ctx.textAlign = "center"
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.fillText("Shakar (C₁₂H₂₂O₁₁)", x1, cy - 72)
    ctx.fillStyle = termikQizigan ? "#f43f5e" : "#38bdf8"
    ctx.font = "bold 14px 'Times New Roman', serif"
    ctx.fillText(
      termikQizigan ? "200°C da qorayib ko'mirga (12C + 11H₂O↑) aylandi!" : "Oq shirin kristall (Molekulyar)",
      x1,
      cy + 58
    )

    // O'ngda: Osh tuzi (NaCl)
    ctx.strokeStyle = "#94a3b8"
    ctx.strokeRect(x2 - 65, cy - 55, 130, 85)
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(x2 - 55, cy - 10, 110, 36)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.fillText("Osh tuzi (NaCl)", x2, cy - 72)
    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 14px 'Times New Roman', serif"
    ctx.fillText(
      termikQizigan ? "200°C da o'zgarmadi (Faqat 801°C da suyuqlanadi)" : "Oq sho'r kristall (Ion panjarali)",
      x2,
      cy + 58
    )
  }, [asosiyBolim, animRejim, termikQizigan])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const taqqosSavollar = [
    { savol: "Sariq-yashil zaharli gaz (Cl₂) va suvda portlovchi yumshoq metall (Na) birikishidan qanday modda hosil bo'ladi?", variantlar: ["Zaharliligi 2 barobar kuchli gaz", "Suyuq simob", "Qora ko'mir", "NaCl — Zararsiz oq kristall osh tuzi"], togri: "NaCl — Zararsiz oq kristall osh tuzi" },
    { savol: "Yonuvchi vodorod (H₂) va yonishni qo'llab-quvvatlovchi kislorod (O₂) birikmasidan hosil bo'lgan suv (H₂O) olovga qanday ta'sir qiladi?", variantlar: ["Olovni o'chiradi (elementlar xossasi saqlanmaydi)", "Olovni kuchaytiradi", "O'zi yonib ketadi", "Portlaydi"], togri: "Olovni o'chiradi (elementlar xossasi saqlanmaydi)" },
    { savol: "Suvsiz oq mis(II) sulfat (CuSO₄) kukuniga suv tomizilsa rangi qanday o'zgaradi?", variantlar: ["O'zgarmaydi", "Moviy-ko'k rangga kiradi (CuSO₄·5H₂O)", "Qora rangga kiradi", "Sariq bo'ladi"], togri: "Moviy-ko'k rangga kiradi (CuSO₄·5H₂O)" },
    { savol: "Shakar (C₁₂H₂₂O₁₁) kuchli qizdirilganda qorayib qolishi uning tarkibida qaysi element borligini isbotlaydi?", variantlar: ["Cl (Xlor)", "Fe (Temir)", "C (Uglerod)", "Na (Natriy)"], togri: "C (Uglerod)" },
  ]
  const [tIdx, setTIdx] = useState(0)
  const [tTanlov, setTTanlov] = useState(null)
  const [tBall, setTBall] = useState(0)
  const [tTugadi, setTTugadi] = useState(false)

  const elektrolitSavollar = [
    { modda: "NaCl (Osh tuzi) ning suvdagi eritmasi — erkin Na⁺ va Cl⁻ ionlari bor", javob: "otkazadi" },
    { modda: "Quruq qattiq NaCl kristali — ionlar panjarada mahkam bog'langan", javob: "otkazmaydi" },
    { modda: "Shakar (C₁₂H₂₂O₁₁) ning suvdagi eritmasi — molekulalar ionga ajralmaydi", javob: "otkazmaydi" },
    { modda: "Toza distillangan suv (H₂O) — erigan tuz ionlari yo'q", javob: "otkazmaydi" },
    { modda: "Suyuqlantirilgan (801°C da eritilgan) NaCl — ionlar erkin harakatlanadi", javob: "otkazadi" },
  ]
  const [eIdx, setEIdx] = useState(0)
  const [eBall, setEBall] = useState(0)
  const [eTugadi, setETugadi] = useState(false)

  const gazDetektivSavollar = [
    { savol: "Ohakli suvni (Ca(OH)₂) oq cho'kma (CaCO₃↓) hosil qilib loyqalatadigan va olovni o'chiradigan gaz qaysi?", variantlar: ["CO (Is gazi)", "O₂ (Kislorod)", "H₂ (Vodorod)", "CO₂ (Karbonat angidrid)"], togri: "CO₂ (Karbonat angidrid)" },
    { savol: "Rangsiz, hidsiz, o'ta zaharli bo'lib, havoda moviy alanga bilan yonadigan (2CO + O₂ → 2CO₂) gaz qaysi?", variantlar: ["CO (Is gazi)", "CO₂ (Karbonat angidrid)", "N₂ (Azot)", "He (Geliy)"], togri: "CO (Is gazi)" },
    { savol: "Chala cho'g'langan cho'p tushirilganda uni alangalatib yuboradigan gaz qaysi?", variantlar: ["H₂O bug'i", "O₂ (Kislorod)", "CO₂ (Karbonat angidrid)", "N₂ (Azot)"], togri: "O₂ (Kislorod)" },
    { savol: "Yonib turgan gugurt tutilganda 'paq' etib ovoz chiqarib yonadigan eng yengil gaz qaysi?", variantlar: ["O₂", "Cl₂", "H₂ (Vodorod)", "CO₂"], togri: "H₂ (Vodorod)" },
  ]
  const [gdIdx, setGdIdx] = useState(0)
  const [gdTanlov, setGdTanlov] = useState(null)
  const [gdBall, setGdBall] = useState(0)
  const [gdTugadi, setGdTugadi] = useState(false)

  const duelSavollari = [
    { s: "Osh tuzi (NaCl) necha gradusda suyuqlanadi?", v: ["801°C", "100°C", "0°C"], j: "801°C" },
    { s: "Qaysi eritma elektr tokini o'tkazadi (lampani yoqadi)?", v: ["Distillangan suv", "Tuzli suv (NaCl)", "Shakarli suv"], j: "Tuzli suv (NaCl)" },
    { s: "Qaysi gaz havodan 1.5 marta og'ir (Mr=44) va olovni o'chiradi?", v: ["CO (Mr=28)", "H₂ (Mr=2)", "CO₂"], j: "CO₂" },
    { s: "Mis kuporosi (CuSO₄·5H₂O) qanday rangda?", v: ["Moviy-ko'k", "Qora", "Qizil"], j: "Moviy-ko'k" },
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
        mavzuRaqam="3.6"
        mavzuNom="Murakkab moddalarning xossalari"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={44}
        oldingiRaqam="3.5"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.5"
          oldingiNom="Murakkab moddalar"
          savollar={takrorlash3_5}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "nacl", nom: "1. 2Na + Cl₂ → 2NaCl", ikon: "kristall" },
              { id: "elektrolit", nom: "2. Elektrolit sinovi", ikon: "chaqmoq" },
              { id: "co_co2", nom: "3. CO vs CO₂ farqi", ikon: "tolqin" },
              { id: "kuporos", nom: "4. CuSO₄ ↔ 5H₂O", ikon: "tomchi" },
              { id: "h2o_xossa", nom: "5. H₂ + O₂ vs H₂O", ikon: "olov" },
              { id: "termik", nom: "6. Shakar vs NaCl", ikon: "kolba" },
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

          {animRejim === "nacl" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={naclCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setNaclBosqich("oldin")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    naclBosqich === "oldin" ? "border-rose-400 bg-rose-500/25 text-rose-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  1. Dastlabki elementlar: Na (metall) va Cl₂ (zaharli gaz)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNaclBosqich("keyin")
                    tovushChiqar("togri")
                  }}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    naclBosqich === "keyin" ? "border-emerald-400 bg-emerald-500/25 text-emerald-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  2. Murakkab modda: NaCl (Osh tuzi kristali)
                </button>
              </div>
            </div>
          )}

          {animRejim === "elektrolit" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={elektrCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "quruq_nacl", nom: "1. Quruq NaCl tuz kristali (Yonmaydi)" },
                  { id: "nacl_suv", nom: "2. NaCl suvdagi eritmasi (Lampa YONADI)" },
                  { id: "shakar", nom: "3. Shakar (C₁₂H₂₂O₁₁) eritmasi (Yonmaydi)" },
                ].map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEritmaTur(e.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      eritmaTur === e.id ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {e.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "co_co2" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={gazCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setUglerodGaz("CO2")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    uglerodGaz === "CO2" ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  CO₂ — Karbonat angidrid (Mr = 44)
                </button>
                <button
                  type="button"
                  onClick={() => setUglerodGaz("CO")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    uglerodGaz === "CO" ? "border-rose-400 bg-rose-500/25 text-rose-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  CO — Is gazi (Mr = 28)
                </button>
              </div>
            </div>
          )}

          {animRejim === "kuporos" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={kuporosCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSuvliHolat(false)}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    !suvliHolat ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Qizdirib suvsizlantirish (Oq CuSO₄)
                </button>
                <button
                  type="button"
                  onClick={() => setSuvliHolat(true)}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    suvliHolat ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Suv tomizish (Ko&apos;k CuSO₄·5H₂O)
                </button>
              </div>
            </div>
          )}

          {animRejim === "h2o_xossa" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={suvSintezCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          )}

          {animRejim === "termik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={termikCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setTermikQizigan((v) => !v)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs sm:text-sm"
                >
                  {termikQizigan ? "Dastlabki holatga qaytarish" : "200°C gacha qizdirib sinash (Shakar vs NaCl)"}
                </button>
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
              { id: "taqqos", nom: "1. Element vs Birikma", ikon: "atom" },
              { id: "elektr", nom: "2. Tok O'tkazish Testi", ikon: "chaqmoq" },
              { id: "gaz", nom: "3. Gazlar Detektivi", ikon: "tolqin" },
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

          {oyinRejim === "taqqos" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!tTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {tIdx + 1} / {taqqosSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {tBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{taqqosSavollar[tIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {taqqosSavollar[tIdx].variantlar.map((v) => {
                      const togri = v === taqqosSavollar[tIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (tTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (tTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (tTanlov !== null) return
                            setTTanlov(v)
                            if (togri) {
                              setTBall((b) => b + 1)
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
                  {tTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (tIdx < taqqosSavollar.length - 1) {
                            setTIdx((i) => i + 1)
                            setTTanlov(null)
                          } else {
                            setTTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {tBall} / {taqqosSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setTIdx(0)
                      setTTanlov(null)
                      setTBall(0)
                      setTTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "elektr" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!eTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Namuna {eIdx + 1} / {elektrolitSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {eBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{elektrolitSavollar[eIdx].modda}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "otkazadi", nom: "TOK O'TKAZADI (Lampa yonadi)" },
                      { id: "otkazmaydi", nom: "TOK O'TKAZMAYDI (Lampa yonmaydi)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === elektrolitSavollar[eIdx].javob) {
                            setEBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (eIdx < elektrolitSavollar.length - 1) setEIdx((i) => i + 1)
                          else setETugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {eBall} / {elektrolitSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setEIdx(0)
                      setEBall(0)
                      setETugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "gaz" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!gdTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {gdIdx + 1} / {gazDetektivSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {gdBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{gazDetektivSavollar[gdIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gazDetektivSavollar[gdIdx].variantlar.map((v) => {
                      const togri = v === gazDetektivSavollar[gdIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (gdTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (gdTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (gdTanlov !== null) return
                            setGdTanlov(v)
                            if (togri) {
                              setGdBall((b) => b + 1)
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
                  {gdTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (gdIdx < gazDetektivSavollar.length - 1) {
                            setGdIdx((i) => i + 1)
                            setGdTanlov(null)
                          } else {
                            setGdTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {gdBall} / {gazDetektivSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setGdIdx(0)
                      setGdTanlov(null)
                      setGdBall(0)
                      setGdTugadi(false)
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
