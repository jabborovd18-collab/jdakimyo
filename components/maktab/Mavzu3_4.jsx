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

const DAVRIY_20 = [
  { z: 1, b: "H", nom: "Vodorod", davr: 1, guruh: 1, qavat: [1], r: 53 },
  { z: 2, b: "He", nom: "Geliy", davr: 1, guruh: 8, qavat: [2], r: 31 },
  { z: 3, b: "Li", nom: "Litiy", davr: 2, guruh: 1, qavat: [2, 1], r: 152 },
  { z: 4, b: "Be", nom: "Berilliy", davr: 2, guruh: 2, qavat: [2, 2], r: 112 },
  { z: 5, b: "B", nom: "Bor", davr: 2, guruh: 3, qavat: [2, 3], r: 85 },
  { z: 6, b: "C", nom: "Uglerod", davr: 2, guruh: 4, qavat: [2, 4], r: 77 },
  { z: 7, b: "N", nom: "Azot", davr: 2, guruh: 5, qavat: [2, 5], r: 70 },
  { z: 8, b: "O", nom: "Kislorod", davr: 2, guruh: 6, qavat: [2, 6], r: 66 },
  { z: 9, b: "F", nom: "Ftor", davr: 2, guruh: 7, qavat: [2, 7], r: 64 },
  { z: 10, b: "Ne", nom: "Neon", davr: 2, guruh: 8, qavat: [2, 8], r: 38 },
  { z: 11, b: "Na", nom: "Natriy", davr: 3, guruh: 1, qavat: [2, 8, 1], r: 186 },
  { z: 12, b: "Mg", nom: "Magniy", davr: 3, guruh: 2, qavat: [2, 8, 2], r: 160 },
  { z: 13, b: "Al", nom: "Alyuminiy", davr: 3, guruh: 3, qavat: [2, 8, 3], r: 143 },
  { z: 14, b: "Si", nom: "Kremniy", davr: 3, guruh: 4, qavat: [2, 8, 4], r: 117 },
  { z: 15, b: "P", nom: "Fosfor", davr: 3, guruh: 5, qavat: [2, 8, 5], r: 110 },
  { z: 16, b: "S", nom: "Oltingugurt", davr: 3, guruh: 6, qavat: [2, 8, 6], r: 104 },
  { z: 17, b: "Cl", nom: "Xlor", davr: 3, guruh: 7, qavat: [2, 8, 7], r: 99 },
  { z: 18, b: "Ar", nom: "Argon", davr: 3, guruh: 8, qavat: [2, 8, 8], r: 71 },
  { z: 19, b: "K", nom: "Kaliy", davr: 4, guruh: 1, qavat: [2, 8, 8, 1], r: 227 },
  { z: 20, b: "Ca", nom: "Kalsiy", davr: 4, guruh: 2, qavat: [2, 8, 8, 2], r: 197 },
]

export default function Mavzu3_4() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("koordinata")
  const [oyinRejim, setOyinRejim] = useState("manzil")

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

  const takrorlash3_3 = [
    {
      savol: "Metallarning elektr va issiqlikni yaxshi o'tkazishiga ularning kristall panjarasidagi qaysi zarrachalar sababchi?",
      variantlar: ["Erkin elektronlar ('elektron gazi')", "Neytronlar", "Protonlar", "Molekulalar"],
      togriJavob: "Erkin elektronlar ('elektron gazi')",
      izoh: "Metall panjarasida musbat ionlar orasida erkin ko'chib yuruvchi elektronlar elektr va issiqlikni tashiydi.",
    },
    {
      savol: "Xona haroratida suyuq holatda bo'ladigan yagona metall va yagona metallmasni belgilang:",
      variantlar: ["Cu (Mis) va I₂ (Yod)", "Hg (Simob) va Br₂ (Brom)", "Fe (Temir) va S (Oltingugurt)", "Ga (Galliy) va Cl₂ (Xlor)"],
      togriJavob: "Hg (Simob) va Br₂ (Brom)",
      izoh: "Simob (-39°C da eriydi) va Brom (-7°C da eriydi) xona haroratida suyuqlikdir.",
    },
    {
      savol: "Rux (Zn) yoki Magniy (Mg) xlorid kislotaga (HCl) tushirilganda qanday gaz pufakchalari ajraladi?",
      variantlar: ["Karbonat angidrid (CO₂↑)", "Xlor (Cl₂↑)", "Vodorod (H₂↑)", "Kislorod (O₂↑)"],
      togriJavob: "Vodorod (H₂↑)",
      izoh: "Zn + 2HCl → ZnCl₂ + H₂↑ reaksiyasida vodorod gazi ajralib chiqadi.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: DAVRLAR (QOBIQ SONI) VA GURUHLAR (VALENT ELEKTRON) XARITASI
  // ═══════════════════════════════════════════════════════════════════════════
  const koordCanvasRef = useRef(null)
  const [tanlanganKatak, setTanlanganKatak] = useState(DAVRIY_20[10]) // Na

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "koordinata") return
    const canvas = koordCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.03
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      // Chapda: Atomning qobiqlari (= Davr) va tashqi elektronlari (= Guruh)
      const cx = w * 0.34
      const cy = h * 0.52

      tanlanganKatak.qavatlar?.forEach?.(() => {})
      tanlanganKatak.qavat.forEach((son, qIdx) => {
        const isTashqi = qIdx === tanlanganKatak.qavat.length - 1
        const r = 38 + qIdx * 28
        ctx.strokeStyle = isTashqi ? "#facc15" : "rgba(56,189,248,0.3)"
        ctx.lineWidth = isTashqi ? 2.5 : 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()

        for (let i = 0; i < son; i++) {
          const a = (i / son) * Math.PI * 2 + t * (1.2 - qIdx * 0.2)
          const ex = cx + Math.cos(a) * r
          const ey = cy + Math.sin(a) * r
          ctx.fillStyle = isTashqi ? "#facc15" : "#38bdf8"
          ctx.beginPath()
          ctx.arc(ex, ey, isTashqi ? 6.5 : 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(cx, cy, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(tanlanganKatak.b, cx, cy + 5)

      // O'ngda: Qonuniyat formulasi
      const rx = w * 0.62
      ctx.textAlign = "left"
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 26px 'Times New Roman', serif"
      ctx.fillText(
        `${tanlanganKatak.b} — ${tanlanganKatak.nom} (Z = ${tanlanganKatak.z})`,
        rx,
        h * 0.26
      )

      ctx.fillStyle = "#38bdf8"
      ctx.font = "bold 18px 'Times New Roman', serif"
      ctx.fillText(
        `Davr: ${tanlanganKatak.davr}-davr  →  ${tanlanganKatak.davr} ta elektron qobiq`,
        rx,
        h * 0.44
      )

      ctx.fillStyle = "#facc15"
      ctx.fillText(
        `Guruh: ${tanlanganKatak.guruh} A guruh  →  Tashqi qobiqda ${
          tanlanganKatak.qavat[tanlanganKatak.qavat.length - 1]
        } ta e⁻`,
        rx,
        h * 0.58
      )

      ctx.fillStyle = "#4ade80"
      ctx.fillText(
        `Qobiqlar taqsimoti: [ ${tanlanganKatak.qavat.join(" , ")} ]`,
        rx,
        h * 0.72
      )

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, tanlanganKatak])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: ATOM RADIUSI O'ZGARISHI (DAVR VA GURUH BO'YLAB)
  // ═══════════════════════════════════════════════════════════════════════════
  const radiusCanvasRef = useRef(null)
  const [radiusYonalish, setRadiusYonalish] = useState("davr")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "radius") return
    const canvas = radiusCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    if (radiusYonalish === "davr") {
      // 2-davr: Li -> Ne (radius kichrayadi)
      const qator = DAVRIY_20.filter((e) => e.davr === 2)
      qator.forEach((el, idx) => {
        const x = (w / 9) * (idx + 1)
        const y = h * 0.5
        const r = Math.max(14, el.r * 0.34)
        const grd = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, r)
        grd.addColorStop(0, "#ffffff")
        grd.addColorStop(0.5, "#38bdf8")
        grd.addColorStop(1, "#0284c7")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 15px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(el.b, x, y + 5)
        ctx.fillStyle = "#facc15"
        ctx.font = "bold 12px 'Times New Roman', serif"
        ctx.fillText(`${el.r} pm`, x, y + r + 22)
      })
      ctx.fillStyle = "#4ade80"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        "2-DAVR BO'YLAB (Chapdan o'ngga): Yadro zaryadi ortib, atom radiusi KICHRAYADI (152 pm → 38 pm)",
        w / 2,
        h * 0.88
      )
    } else {
      // I A guruh: H, Li, Na, K (radius kattalashadi)
      const ustun = DAVRIY_20.filter((e) => e.guruh === 1)
      ustun.forEach((el, idx) => {
        const x = (w / 5) * (idx + 1)
        const y = h * 0.48
        const r = Math.max(16, el.r * 0.3)
        const grd = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, r)
        grd.addColorStop(0, "#ffffff")
        grd.addColorStop(0.5, "#f43f5e")
        grd.addColorStop(1, "#9f1239")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 16px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(`${el.b} (${el.davr}-qobiq)`, x, y + 5)
        ctx.fillStyle = "#facc15"
        ctx.font = "bold 13px 'Times New Roman', serif"
        ctx.fillText(`${el.r} pm`, x, y + r + 24)
      })
      ctx.fillStyle = "#4ade80"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        "GURUH BO'YLAB (Yuqoridan pastga): Qobiqlar soni ortib, atom radiusi KATTALASHADI (53 pm → 227 pm)",
        w / 2,
        h * 0.88
      )
    }
  }, [asosiyBolim, animRejim, radiusYonalish])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: GALOGENLAR OILASI (VII A: F₂, Cl₂, Br₂, I₂)
  // ═══════════════════════════════════════════════════════════════════════════
  const galogenCanvasRef = useRef(null)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "galogenlar") return
    const canvas = galogenCanvasRef.current
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

      const galogenlar = [
        { formula: "F₂ (Ftor)", holat: "Och sariq gaz", rang: "rgba(254,240,138,0.45)", tur: "gaz" },
        { formula: "Cl₂ (Xlor)", holat: "Sariq-yashil gaz", rang: "rgba(132,204,22,0.5)", tur: "gaz" },
        { formula: "Br₂ (Brom)", holat: "Qizil-qo'ng'ir suyuqlik", rang: "#9a3412", tur: "suyuq" },
        { formula: "I₂ (Yod)", holat: "Binafsha-qora kristall", rang: "#9333ea", tur: "qattiq" },
      ]

      galogenlar.forEach((g, idx) => {
        const x = (w / 5) * (idx + 1)
        const topY = h * 0.2
        const botY = h * 0.76

        // Yopiq ampula
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(x - 46, topY, 92, botY - topY, 20)
        ctx.stroke()

        if (g.tur === "gaz") {
          ctx.fillStyle = g.rang
          ctx.beginPath()
          ctx.roundRect(x - 43, topY + 3, 86, botY - topY - 6, 18)
          ctx.fill()
        } else if (g.tur === "suyuq") {
          // Yuqorida bug', pastda suyuqlik
          ctx.fillStyle = "rgba(234,88,12,0.28)"
          ctx.beginPath()
          ctx.roundRect(x - 43, topY + 3, 86, botY - topY - 6, 18)
          ctx.fill()
          ctx.fillStyle = g.rang
          ctx.beginPath()
          ctx.roundRect(x - 43, botY - 65, 86, 62, 14)
          ctx.fill()
        } else {
          // Yod kristallari + binafsha sublimatsiya bug'i
          ctx.fillStyle = "rgba(168,85,247,0.28)"
          ctx.beginPath()
          ctx.roundRect(x - 43, topY + 3, 86, botY - topY - 6, 18)
          ctx.fill()
          for (let k = 0; k < 7; k++) {
            ctx.fillStyle = "#581c87"
            ctx.beginPath()
            ctx.arc(x - 24 + k * 8, botY - 16 - (k % 2) * 8, 9, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Harakatlanuvchi ikki atomli molekulalar
        for (let m = 0; m < 4; m++) {
          const mx = x + Math.sin(t + m + idx) * 20
          const my = topY + 45 + m * 32 + Math.cos(t + m) * 8
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(mx - 5, my, 4, 0, Math.PI * 2)
          ctx.arc(mx + 5, my, 4, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 16px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(g.formula, x, topY - 14)
        ctx.fillStyle = "#facc15"
        ctx.font = "bold 12px 'Times New Roman', serif"
        ctx.fillText(g.holat, x, botY + 26)
      })

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: INERT GAZLAR VA GAZ RAZRYADLI LAMPALAR (VIII A)
  // ═══════════════════════════════════════════════════════════════════════════
  const inertCanvasRef = useRef(null)
  const [tanlanganInert, setTanlanganInert] = useState(1) // Ne

  const INERT_GAZLAR = [
    { b: "He", nom: "Geliy (Z=2)", qobiq: "Tashqi qobiqda 2 e⁻ (To'lgan)", rang: "#fde047", izoh: "Sariq-pushti nur, sharlar va dirijabllar" },
    { b: "Ne", nom: "Neon (Z=10)", qobiq: "Tashqi qobiqda 8 e⁻ (Oktet)", rang: "#ef4444", izoh: "Yorqin qizil-to'q sariq reklama chiroqlari" },
    { b: "Ar", nom: "Argon (Z=18)", qobiq: "Tashqi qobiqda 8 e⁻ (Oktet)", rang: "#a855f7", izoh: "Binafsha-ko'k nur, payvandlashda himoya gazi" },
    { b: "Kr", nom: "Kripton (Z=36)", qobiq: "Tashqi qobiqda 8 e⁻ (Oktet)", rang: "#4ade80", izoh: "Oq-yashil lazer va aeroport chiroqlari" },
    { b: "Xe", nom: "Ksenon (Z=54)", qobiq: "Tashqi qobiqda 8 e⁻ (Oktet)", rang: "#38bdf8", izoh: "Moviy avtomobil ksenon faralari" },
  ]

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "inert") return
    const canvas = inertCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const g = INERT_GAZLAR[tanlanganInert]
    const cx = w / 2
    const cy = h * 0.44

    // Yorug'lik oreoli
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 190)
    grd.addColorStop(0, "#ffffff")
    grd.addColorStop(0.35, g.rang)
    grd.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = grd
    ctx.fillRect(cx - 220, cy - 110, 440, 220)

    // Shisha razryad trubkasi
    ctx.fillStyle = g.rang
    ctx.beginPath()
    ctx.roundRect(cx - 170, cy - 28, 340, 56, 28)
    ctx.fill()

    ctx.fillStyle = "#020617"
    ctx.font = "bold 28px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(g.nom, cx, cy + 10)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.fillText(g.qobiq, cx, h * 0.78)
    ctx.fillStyle = g.rang
    ctx.fillText(g.izoh, cx, h * 0.88)
  }, [asosiyBolim, animRejim, tanlanganInert])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: MENDELEYEV BASHORATI (EKA-KREMNIY → GERMANIY Ge)
  // ═══════════════════════════════════════════════════════════════════════════
  const bashoratCanvasRef = useRef(null)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "mendeleyev") return
    const canvas = bashoratCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const qatorlar = [
      { parametr: "Atom massasi (Ar)", bashorat: "72.0", haqiqiy: "72.6" },
      { parametr: "Zichligi (g/cm³)", bashorat: "5.5 g/cm³", haqiqiy: "5.35 g/cm³" },
      { parametr: "Yuqori oksidi formulasi", bashorat: "EO₂", haqiqiy: "GeO₂" },
      { parametr: "Uchuvchan xloridi", bashorat: "ECl₄ (T_qayn = 90°C)", haqiqiy: "GeCl₄ (T_qayn = 84°C)" },
    ]

    ctx.textAlign = "center"
    ctx.font = "bold 20px 'Times New Roman', serif"
    ctx.fillStyle = "#facc15"
    ctx.fillText("Mendeleyev (1871): 'Eka-kremniy'", w * 0.45, 46)
    ctx.fillStyle = "#4ade80"
    ctx.fillText("K. Vinkler kashfiyoti (1886): Germaniy (Ge)", w * 0.78, 46)

    qatorlar.forEach((q, idx) => {
      const y = 85 + idx * 65
      ctx.fillStyle = "rgba(15,23,42,0.9)"
      ctx.beginPath()
      ctx.roundRect(24, y, w - 48, 50, 12)
      ctx.fill()

      ctx.textAlign = "left"
      ctx.fillStyle = "#cbd5e1"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.fillText(q.parametr, 44, y + 30)

      ctx.textAlign = "center"
      ctx.fillStyle = "#facc15"
      ctx.fillText(q.bashorat, w * 0.45, y + 30)

      ctx.fillStyle = "#4ade80"
      ctx.fillText(q.haqiqiy, w * 0.78, y + 30)
    })
  }, [asosiyBolim, animRejim])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: YUQORI OKSID FORMULASI (GURUH RAQAMI → VALENTLIK)
  // ═══════════════════════════════════════════════════════════════════════════
  const oksidCanvasRef = useRef(null)
  const [guruhTanlov, setGuruhTanlov] = useState(1)

  const GURUH_OKSIDLARI = [
    { g: 1, rim: "I A", misol: "Na (Natriy)", oksid: "Na₂O (R₂O)", valent: "I valentli" },
    { g: 2, rim: "II A", misol: "Mg (Magniy)", oksid: "MgO (RO)", valent: "II valentli" },
    { g: 3, rim: "III A", misol: "Al (Alyuminiy)", oksid: "Al₂O₃ (R₂O₃)", valent: "III valentli" },
    { g: 4, rim: "IV A", misol: "C, Si (Kremniy)", oksid: "CO₂, SiO₂ (RO₂)", valent: "IV valentli" },
    { g: 5, rim: "V A", misol: "P (Fosfor)", oksid: "P₂O₅ (R₂O₅)", valent: "V valentli" },
    { g: 6, rim: "VI A", misol: "S (Oltingugurt)", oksid: "SO₃ (RO₃)", valent: "VI valentli" },
    { g: 7, rim: "VII A", misol: "Cl (Xlor)", oksid: "Cl₂O₇ (R₂O₇)", valent: "VII valentli" },
  ]

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "oksid") return
    const canvas = oksidCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const tan = GURUH_OKSIDLARI[guruhTanlov - 1]
    ctx.textAlign = "center"
    ctx.fillStyle = "#38bdf8"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillText(`${tan.rim} GURUH — ${tan.misol}`, w / 2, h * 0.26)

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 46px 'Times New Roman', serif"
    ctx.fillText(tan.oksid, w / 2, h * 0.52)

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 20px 'Times New Roman', serif"
    ctx.fillText(`Kislorodga nisbatan yuqori valentligi: ${tan.valent} (Guruh raqamiga teng)`, w / 2, h * 0.76)
  }, [asosiyBolim, animRejim, guruhTanlov])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const manzilSavollar = [
    { savol: "3-davr, I A guruhda joylashgan (3 ta qobiq, tashqi qobiqda 1 ta elektron) element qaysi?", variantlar: ["Li (Litiy, Z=3)", "K (Kaliy, Z=19)", "Mg (Magniy, Z=12)", "Na (Natriy, Z=11)"], togri: "Na (Natriy, Z=11)" },
    { savol: "2-davr, IV A guruhda joylashgan organik hayot asosi bo'lgan element qaysi?", variantlar: ["C (Uglerod, Z=6)", "Si (Kremniy, Z=14)", "N (Azot, Z=7)", "O (Kislorod, Z=8)"], togri: "C (Uglerod, Z=6)" },
    { savol: "3-davr, VII A guruhda joylashgan sariq-yashil zaharli gaz qaysi?", variantlar: ["Ar (Argon, Z=18)", "Cl (Xlor, Z=17)", "F (Ftor, Z=9)", "S (Oltingugurt, Z=16)"], togri: "Cl (Xlor, Z=17)" },
    { savol: "4-davr, II A guruhda joylashgan suyak va ohaktosh tarkibiga kiruvchi element?", variantlar: ["Mg (Magniy, Z=12)", "Fe (Temir, Z=26)", "Ca (Kalsiy, Z=20)", "K (Kaliy, Z=19)"], togri: "Ca (Kalsiy, Z=20)" },
  ]
  const [mIdx, setMIdx] = useState(0)
  const [mTanlov, setMTanlov] = useState(null)
  const [mBall, setMBall] = useState(0)
  const [mTugadi, setMTugadi] = useState(false)

  const oilaSavollar = [
    { el: "Na (Natriy) — Suv bilan shiddatli reaksiyaga kirishib ishqor (NaOH) hosil qiladi", oila: "ishqoriy" },
    { el: "Cl₂ (Xlor) — VII A guruhda joylashgan, metallar bilan tuz hosil qiladi", oila: "galogen" },
    { el: "Ne (Neon) — VIII A guruhda, tashqi elektron qobig'i to'liq (8 e⁻)", oila: "inert" },
    { el: "K (Kaliy) — I A guruhda, pichoq bilan oson kesiladigan yumshoq metall", oila: "ishqoriy" },
    { el: "I₂ (Yod) — VII A guruhda, qizdirilganda binafsha bug'ga aylanadi", oila: "galogen" },
    { el: "He (Geliy) — VIII A guruhda, havodan yengil, yonmaydigan aslzoda gaz", oila: "inert" },
  ]
  const [oIdx, setOIdx] = useState(0)
  const [oBall, setOBall] = useState(0)
  const [oTugadi, setOTugadi] = useState(false)

  const qonuniyatSavollar = [
    { savol: "Davriy jadvalda davr raqami atom tuzilishidagi nimani bildiradi?", variantlar: ["Protonlar sonini", "Neytronlar sonini", "Molekuladagi atomlar sonini", "Elektron qobiqlar (pog'onalar) sonini"], togri: "Elektron qobiqlar (pog'onalar) sonini" },
    { savol: "Asosiy guruhcha (A guruh) elementlarida guruh raqami nimaga teng?", variantlar: ["Tashqi qobiqdagi valent elektronlar soniga", "Yadrodagi neytronlar soniga", "Qobiqlar soniga", "Zichlikka"], togri: "Tashqi qobiqdagi valent elektronlar soniga" },
    { savol: "I A guruhda yuqoridan pastga (Li → Na → K → Rb) tushgan sari atom radiusi qanday o'zgaradi?", variantlar: ["Nolga teng bo'ladi", "Kattalashadi (qobiqlar soni ortadi)", "Kichrayadi", "O'zgarmaydi"], togri: "Kattalashadi (qobiqlar soni ortadi)" },
    { savol: "D.I. Mendeleyev 'Eka-kremniy' deb bashorat qilgan element keyinchalik qanday nom oldi?", variantlar: ["Skandiy (Sc)", "Geliy (He)", "Germaniy (Ge)", "Galliy (Ga)"], togri: "Germaniy (Ge)" },
  ]
  const [qIdx, setQIdx] = useState(0)
  const [qTanlov, setQTanlov] = useState(null)
  const [qBall, setQBall] = useState(0)
  const [qTugadi, setQTugadi] = useState(false)

  const duelSavollari = [
    { s: "Davriy jadvalda nechta davr (gorizontal qator) bor?", v: ["7 ta davr", "18 ta davr", "10 ta davr"], j: "7 ta davr" },
    { s: "Qaysi element 1-davr VIII A guruhda joylashgan?", v: ["H (Vodorod)", "He (Geliy)", "Ne (Neon)"], j: "He (Geliy)" },
    { s: "Al (Alyuminiy, Z=13) nechta elektron qobiqqa ega?", v: ["2 ta", "4 ta", "3 ta (2, 8, 3)"], j: "3 ta (2, 8, 3)" },
    { s: "VII A guruh elementlari qanday nomlanadi?", v: ["Galogenlar", "Ishqoriy metallar", "Inert gazlar"], j: "Galogenlar" },
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
        mavzuRaqam="3.4"
        mavzuNom="Davriy jadval"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={37}
        oldingiRaqam="3.3"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.3"
          oldingiNom="Metall va metallmaslar"
          savollar={takrorlash3_3}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "koordinata", nom: "1. Davr va Guruh", ikon: "jadval" },
              { id: "radius", nom: "2. Atom radiusi", ikon: "atom" },
              { id: "galogenlar", nom: "3. Galogenlar (VII A)", ikon: "kolba" },
              { id: "inert", nom: "4. Inert gazlar (VIII A)", ikon: "chaqmoq" },
              { id: "mendeleyev", nom: "5. Eka-kremniy (Ge)", ikon: "yulduz" },
              { id: "oksid", nom: "6. Guruh va Valentlik", ikon: "kristall" },
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

          {animRejim === "koordinata" && (
            <div className="space-y-3">
              <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={koordCanvasRef} className="w-full h-full block" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {DAVRIY_20.map((el) => (
                  <button
                    key={el.z}
                    type="button"
                    onClick={() => {
                      setTanlanganKatak(el)
                      tovushChiqar("bosqich")
                    }}
                    className={`p-2 rounded-xl border text-center transition ${
                      tanlanganKatak.z === el.z
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200 scale-105"
                        : "border-blue-900/60 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    <div className="text-[10px] opacity-75">
                      D{el.davr} • G{el.guruh}
                    </div>
                    <div className="text-sm font-bold">{el.b}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "radius" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={radiusCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRadiusYonalish("davr")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    radiusYonalish === "davr"
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  2-Davr bo&apos;ylab (Li → Ne: Radius kichrayadi)
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusYonalish("guruh")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    radiusYonalish === "guruh"
                      ? "border-rose-400 bg-rose-500/25 text-rose-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  I A Guruh bo&apos;ylab (H → Li → Na → K: Radius kattalashadi)
                </button>
              </div>
            </div>
          )}

          {animRejim === "galogenlar" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={galogenCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          )}

          {animRejim === "inert" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={inertCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {INERT_GAZLAR.map((g, idx) => (
                  <button
                    key={g.b}
                    type="button"
                    onClick={() => setTanlanganInert(idx)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      tanlanganInert === idx
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {g.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "mendeleyev" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={bashoratCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          )}

          {animRejim === "oksid" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={oksidCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {GURUH_OKSIDLARI.map((g) => (
                  <button
                    key={g.g}
                    type="button"
                    onClick={() => setGuruhTanlov(g.g)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                      guruhTanlov === g.g
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {g.rim} ({g.oksid.split(" ")[0]})
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
              { id: "manzil", nom: "1. Davr va Guruh", ikon: "jadval" },
              { id: "oila", nom: "2. Oilalar Saralash", ikon: "atom" },
              { id: "qonun", nom: "3. Qonuniyat Testi", ikon: "yulduz" },
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

          {oyinRejim === "manzil" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!mTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {mIdx + 1} / {manzilSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {mBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{manzilSavollar[mIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {manzilSavollar[mIdx].variantlar.map((v) => {
                      const togri = v === manzilSavollar[mIdx].togri
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
                          if (mIdx < manzilSavollar.length - 1) {
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {mBall} / {manzilSavollar.length}</div>
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

          {oyinRejim === "oila" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!oTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Element {oIdx + 1} / {oilaSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {oBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{oilaSavollar[oIdx].el}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "ishqoriy", nom: "ISHQORIY METALLAR (I A)" },
                      { id: "galogen", nom: "GALOGENLAR (VII A)" },
                      { id: "inert", nom: "INERT GAZLAR (VIII A)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === oilaSavollar[oIdx].oila) {
                            setOBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (oIdx < oilaSavollar.length - 1) setOIdx((i) => i + 1)
                          else setOTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {oBall} / {oilaSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setOIdx(0)
                      setOBall(0)
                      setOTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "qonun" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!qTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {qIdx + 1} / {qonuniyatSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {qBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{qonuniyatSavollar[qIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {qonuniyatSavollar[qIdx].variantlar.map((v) => {
                      const togri = v === qonuniyatSavollar[qIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (qTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (qTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (qTanlov !== null) return
                            setQTanlov(v)
                            if (togri) {
                              setQBall((b) => b + 1)
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
                  {qTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (qIdx < qonuniyatSavollar.length - 1) {
                            setQIdx((i) => i + 1)
                            setQTanlov(null)
                          } else {
                            setQTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {qBall} / {qonuniyatSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setQIdx(0)
                      setQTanlov(null)
                      setQBall(0)
                      setQTugadi(false)
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
