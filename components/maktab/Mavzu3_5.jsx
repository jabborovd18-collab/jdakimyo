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

function ekub(a, b) {
  return b === 0 ? a : ekub(b, a % b)
}

export default function Mavzu3_5() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("fes")
  const [oyinRejim, setOyinRejim] = useState("saralash")

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

  const takrorlash3_4 = [
    {
      savol: "Davriy jadvalda element joylashgan DAVR raqami nimani anglatadi?",
      variantlar: ["Atomdagi elektron qobiqlar (pog'onalar) sonini", "Protonlar sonini", "Neytronlar sonini", "Molekuladagi atomlar sonini"],
      togriJavob: "Atomdagi elektron qobiqlar (pog'onalar) sonini",
      izoh: "Davr raqami atom yadrosi atrofida nechta elektron qobiq borligini ko'rsatadi.",
    },
    {
      savol: "VII A guruh (F, Cl, Br, I) va VIII A guruh (He, Ne, Ar) elementlari qanday ataladi?",
      variantlar: ["Metalloidlar", "Galogenlar va Inert gazlar", "Ishqoriy va Ishqoriy-yer metallar", "Lantanoidlar va Aktinoidlar"],
      togriJavob: "Galogenlar va Inert gazlar",
      izoh: "VII A guruh — tuz hosil qiluvchilar (galogenlar), VIII A guruh — inert (aslzoda) gazlardir.",
    },
    {
      savol: "3-davr, III A guruhda joylashgan elementni toping:",
      variantlar: ["Si (Kremniy, Z=14)", "B (Bor, Z=5)", "Al (Alyuminiy, Z=13)", "Na (Natriy, Z=11)"],
      togriJavob: "Al (Alyuminiy, Z=13)",
      izoh: "Alyuminiyda 3 ta elektron qobiq (2, 8, 3) va tashqi qobig'ida 3 ta elektron bor.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: Fe + S ARALASHMASI vs FeS MURAKKAB MODDASI
  // ═══════════════════════════════════════════════════════════════════════════
  const fesCanvasRef = useRef(null)
  const [fesQizdirildi, setFesQizdirildi] = useState(false)
  const [fesMagnit, setFesMagnit] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "fes") return
    const canvas = fesCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h * 0.62

    // Magnit
    if (fesMagnit) {
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(cx - 75, h * 0.16, 75, 28)
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(cx, h * 0.16, 75, 28)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText("N          S (Magnit)", cx, h * 0.16 + 19)
    }

    // Chinni kosacha
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, 85, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()

    if (!fesQizdirildi) {
      // Fe + S mexanik aralashmasi
      for (let i = 0; i < 16; i++) {
        const isFe = i % 2 === 0
        const x = cx - 52 + (i % 8) * 15
        const y = fesMagnit && isFe ? h * 0.25 : cy + 32 + Math.floor(i / 8) * 14
        ctx.fillStyle = isFe ? "#94a3b8" : "#facc15"
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      // FeS — yaxlit qora-kulrang murakkab modda (magnitga tortilmaydi!)
      ctx.fillStyle = "#334155"
      ctx.strokeStyle = "#f97316"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(cx - 52, cy + 20, 104, 34, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText("FeS (Temir(II) sulfid)", cx, cy + 42)
    }

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 17px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(
      !fesQizdirildi
        ? fesMagnit
          ? "Aralashma (Fe + S): Temir zarrachalari o'z xossasini saqlab magnitga tortildi!"
          : "Mexanik aralashma: Fe (temir qirindisi) va S (sariq oltingugurt kukuni)"
        : fesMagnit
        ? "Murakkab modda (FeS): Kimyoviy bog' hosil bo'lgani uchun magnitga TORTILMAYDI!"
        : "Kimyoviy reaksiya: Fe + S → FeS (Yangi xossali murakkab modda hosil bo'ldi)",
      w / 2,
      h * 0.9
    )
  }, [asosiyBolim, animRejim, fesQizdirildi, fesMagnit])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: VALENTLIK VA "KREST" QOIDASI BO'YICHA FORMULA TUZISH
  // ═══════════════════════════════════════════════════════════════════════════
  const valentCanvasRef = useRef(null)
  const [el1, setEl1] = useState({ b: "Al", v: 3, nom: "Alyuminiy" })
  const [el2, setEl2] = useState({ b: "O", v: 2, nom: "Kislorod (oksid)" })

  const RIM_RAQAM = ["", "I", "II", "III", "IV", "V", "VI", "VII"]

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "valentlik") return
    const canvas = valentCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const g = ekub(el1.v, el2.v)
    const ind1 = el2.v / g
    const ind2 = el1.v / g
    const kichik = ["", "", "₂", "₃", "₄", "₅", "₆", "₇"]
    const formula = `${el1.b}${kichik[ind1]}${el2.b}${kichik[ind2]}`

    const x1 = w * 0.34
    const x2 = w * 0.56
    const y = h * 0.45

    // Valentlik Rim raqamlari
    ctx.textAlign = "center"
    ctx.font = "bold 24px 'Times New Roman', serif"
    ctx.fillStyle = "#facc15"
    ctx.fillText(RIM_RAQAM[el1.v], x1, y - 55)
    ctx.fillStyle = "#38bdf8"
    ctx.fillText(RIM_RAQAM[el2.v], x2, y - 55)

    // Krest chiziqlari
    ctx.strokeStyle = "rgba(250,204,21,0.55)"
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(x1, y - 42)
    ctx.lineTo(x2 + 28, y + 18)
    ctx.moveTo(x2, y - 42)
    ctx.lineTo(x1 + 28, y + 18)
    ctx.stroke()

    // Element harflari
    ctx.font = "bold 52px 'Times New Roman', serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(el1.b, x1, y + 8)
    ctx.fillText(el2.b, x2, y + 8)

    // Tayyor formula
    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 36px 'Times New Roman', serif"
    ctx.fillText(`Natija: ${formula}`, w / 2, h * 0.8)
  }, [asosiyBolim, animRejim, el1, el2])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: TARKIBNING DOIMIYLIK QONUNI (PRUST QONUNI)
  // ═══════════════════════════════════════════════════════════════════════════
  const prustCanvasRef = useRef(null)
  const [prustModda, setPrustModda] = useState("H2O")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "prust") return
    const canvas = prustCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const DATA = {
      H2O: {
        formula: "H₂O (Mr = 18)",
        nisbat: "m(H) : m(O) = 2 : 16 = 1 : 8",
        qismlar: [
          { nom: "Vodorod (H) — 11.1%", foiz: 11.1, rang: "#38bdf8" },
          { nom: "Kislorod (O) — 88.9%", foiz: 88.9, rang: "#ef4444" },
        ],
      },
      CO2: {
        formula: "CO₂ (Mr = 44)",
        nisbat: "m(C) : m(O) = 12 : 32 = 3 : 8",
        qismlar: [
          { nom: "Uglerod (C) — 27.3%", foiz: 27.3, rang: "#94a3b8" },
          { nom: "Kislorod (O) — 72.7%", foiz: 72.7, rang: "#ef4444" },
        ],
      },
      CuO: {
        formula: "CuO (Mr = 80)",
        nisbat: "m(Cu) : m(O) = 64 : 16 = 4 : 1",
        qismlar: [
          { nom: "Mis (Cu) — 80.0%", foiz: 80.0, rang: "#f97316" },
          { nom: "Kislorod (O) — 20.0%", foiz: 20.0, rang: "#ef4444" },
        ],
      },
    }

    const d = DATA[prustModda]
    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 28px 'Times New Roman', serif"
    ctx.fillText(d.formula, w / 2, 55)

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 22px 'Times New Roman', serif"
    ctx.fillText(`Doimiy massa nisbati: ${d.nisbat}`, w / 2, 95)

    // Ulush shkalasi
    const bx = w * 0.12
    const by = h * 0.45
    const bw = w * 0.76
    const w1 = (bw * d.qismlar[0].foiz) / 100

    ctx.fillStyle = d.qismlar[0].rang
    ctx.fillRect(bx, by, w1, 56)
    ctx.fillStyle = d.qismlar[1].rang
    ctx.fillRect(bx + w1, by, bw - w1, 56)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px 'Times New Roman', serif"
    ctx.fillText(d.qismlar[0].nom, bx + w1 / 2, by + 84)
    ctx.fillText(d.qismlar[1].nom, bx + w1 + (bw - w1) / 2, by + 84)
  }, [asosiyBolim, animRejim, prustModda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: NISBIY MOLEKULYAR MASSA (Mr) TAROZISI
  // ═══════════════════════════════════════════════════════════════════════════
  const mrCanvasRef = useRef(null)
  const [mrTanlov, setMrTanlov] = useState("H2SO4")

  const MR_MODDALAR = {
    H2O: { f: "H₂O", hisob: "2 × Ar(H) + 1 × Ar(O) = 2×1 + 16", mr: 18 },
    CO2: { f: "CO₂", hisob: "1 × Ar(C) + 2 × Ar(O) = 12 + 2×16", mr: 44 },
    NaCl: { f: "NaCl", hisob: "1 × Ar(Na) + 1 × Ar(Cl) = 23 + 35.5", mr: 58.5 },
    H2SO4: { f: "H₂SO₄", hisob: "2×1 (H) + 32 (S) + 4×16 (O)", mr: 98 },
    CaCO3: { f: "CaCO₃", hisob: "40 (Ca) + 12 (C) + 3×16 (O)", mr: 100 },
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "mr_tarozi") return
    const canvas = mrCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const m = MR_MODDALAR[mrTanlov]
    const cx = w / 2

    // Elektron tarozi ekrani
    ctx.fillStyle = "#0f172a"
    ctx.strokeStyle = "#38bdf8"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(cx - 170, h * 0.48, 340, 110, 20)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 40px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText(`Mr(${m.f}) = ${m.mr}`, cx, h * 0.48 + 68)

    ctx.fillStyle = "#facc15"
    ctx.font = "bold 22px 'Times New Roman', serif"
    ctx.fillText(m.hisob, cx, h * 0.28)
  }, [asosiyBolim, animRejim, mrTanlov])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: BINAR BIRIKMALAR NOMENKLATURASI (-ID QO'SHIMCHASI)
  // ═══════════════════════════════════════════════════════════════════════════
  const nomCanvasRef = useRef(null)
  const [nomIdx, setNomIdx] = useState(0)

  const BINAR_ROYXAT = [
    { formula: "NaCl", m1: "Natriy", m2: "Xlor → Xlorid", toliq: "Natriy xlorid (Osh tuzi)" },
    { formula: "CaO", m1: "Kalsiy", m2: "Kislorod → Oksid", toliq: "Kalsiy oksid (So'ndirilmagan ohak)" },
    { formula: "FeS", m1: "Temir(II)", m2: "Oltingugurt → Sulfid", toliq: "Temir(II) sulfid" },
    { formula: "Al₂O₃", m1: "Alyuminiy", m2: "Kislorod → Oksid", toliq: "Alyuminiy oksid" },
    { formula: "CuO", m1: "Mis(II)", m2: "Kislorod → Oksid", toliq: "Mis(II) oksid (Qora kukun)" },
    { formula: "Cu₂O", m1: "Mis(I)", m2: "Kislorod → Oksid", toliq: "Mis(I) oksid (Qizil kukun)" },
  ]

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "nomlash") return
    const canvas = nomCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const b = BINAR_ROYXAT[nomIdx]
    ctx.textAlign = "center"
    ctx.fillStyle = "#facc15"
    ctx.font = "bold 54px 'Times New Roman', serif"
    ctx.fillText(b.formula, w / 2, h * 0.34)

    ctx.fillStyle = "#38bdf8"
    ctx.font = "bold 22px 'Times New Roman', serif"
    ctx.fillText(`[ ${b.m1} ]   +   [ ${b.m2} ]`, w / 2, h * 0.56)

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 28px 'Times New Roman', serif"
    ctx.fillText(b.toliq, w / 2, h * 0.78)
  }, [asosiyBolim, animRejim, nomIdx])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: MURAKKAB MODDALARNING 4 ASOSIY SINFI
  // ═══════════════════════════════════════════════════════════════════════════
  const sinfCanvasRef = useRef(null)
  const [sinfTur, setSinfTur] = useState("oksid")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sinflar") return
    const canvas = sinfCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const SINFLAR = {
      oksid: {
        nom: "1. OKSIDLAR — Ikki elementdan iborat bo'lib, biri kislorod (O⁻²)",
        misollar: ["CaO (Kalsiy oksid)", "CO₂ (Karbonat angidrid)", "H₂O (Vodord oksid / Suv)", "Fe₂O₃ (Temir(III) oksid)"],
        rang: "#ef4444",
      },
      asos: {
        nom: "2. ASOSLAR (GIDROKSIDLAR) — Metall atomi va gidroksoguruhdan (OH⁻) iborat",
        misollar: ["NaOH (O'yuvchi natriy)", "KOH (Kaliy gidroksid)", "Ca(OH)₂ (So'ndirilgan ohak)", "Cu(OH)₂ (Ko'k cho'kma)"],
        rang: "#38bdf8",
      },
      kislota: {
        nom: "3. KISLOTALAR — Vodorod (H⁺) va kislota qoldig'idan iborat",
        misollar: ["HCl (Xlorid kislota)", "H₂SO₄ (Sulfat kislota)", "HNO₃ (Nitrat kislota)", "H₂CO₃ (Karbonat kislota)"],
        rang: "#f43f5e",
      },
      tuz: {
        nom: "4. TUZLAR — Metall atomi va kislota qoldig'idan iborat",
        misollar: ["NaCl (Osh tuzi)", "CaCO₃ (Ohaktosh / Bo'r)", "CuSO₄ (Mis kuporosi)", "NaHCO₃ (Ichimlik sodasi)"],
        rang: "#4ade80",
      },
    }

    const s = SINFLAR[sinfTur]
    ctx.textAlign = "center"
    ctx.fillStyle = s.rang
    ctx.font = "bold 21px 'Times New Roman', serif"
    ctx.fillText(s.nom, w / 2, 56)

    s.misollar.forEach((m, idx) => {
      const x = w * 0.27 + (idx % 2) * (w * 0.46)
      const y = 135 + Math.floor(idx / 2) * 110
      ctx.fillStyle = "#0f172a"
      ctx.strokeStyle = s.rang
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(x - 150, y - 35, 300, 70, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 20px 'Times New Roman', serif"
      ctx.fillText(m, x, y + 7)
    })
  }, [asosiyBolim, animRejim, sinfTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const saralashSavollar = [
    { modda: "O₃ (Ozon) — Faqat kislorod atomlaridan tashkil topgan", tur: "oddiy" },
    { modda: "H₂O (Suv) — Vodorod va kislorod elementlaridan tuzilgan", tur: "murakkab" },
    { modda: "NaCl (Osh tuzi) — Natriy va xlorning kimyoviy birikmasi", tur: "murakkab" },
    { modda: "S₈ (Oltingugurt) — 8 ta bir xil oltingugurt atomidan iborat", tur: "oddiy" },
    { modda: "Havo — N₂ (78%), O₂ (21%), Ar va CO₂ gazlari aralashmasi", tur: "aralashma" },
    { modda: "Fe + S kukuni — Qizdirilmagan temir va oltingugurt qorishmasi", tur: "aralashma" },
  ]
  const [sIdx, setSIdx] = useState(0)
  const [sBall, setSBall] = useState(0)
  const [sTugadi, setSTugadi] = useState(false)

  const valentSavollar = [
    { savol: "III valentli Alyuminiy (Al) va II valentli Kislorod (O) hosil qilgan oksid formulasi qaysi?", variantlar: ["AlO", "Al₃O₂", "AlO₃", "Al₂O₃"], togri: "Al₂O₃" },
    { savol: "IV valentli Uglerod (C) va II valentli Kislorod (O) birikmasi formulasi qaysi?", variantlar: ["CO₂", "C₂O₄", "CO", "C₂O"], togri: "CO₂" },
    { savol: "VI valentli Oltingugurt (S) ning kislorod bilan hosil qilgan oksidi formulasi:", variantlar: ["SO₆", "SO₃", "SO₂", "S₂O₆"], togri: "SO₃" },
    { savol: "V valentli Fosfor (P) va II valentli Kislorod (O) birikmasi formulasi:", variantlar: ["P₅O₂", "PO₂", "P₂O₅", "PO₅"], togri: "P₂O₅" },
  ]
  const [vIdx, setVIdx] = useState(0)
  const [vTanlov, setVTanlov] = useState(null)
  const [vBall, setVBall] = useState(0)
  const [vTugadi, setVTugadi] = useState(false)

  const mrSavollar = [
    { savol: "Karbonat angidrid (CO₂) ning nisbiy molekulyar massasini (Mr) hisoblang (C=12, O=16):", variantlar: ["28", "32", "60", "44"], togri: "44" },
    { savol: "Suvda (H₂O, Mr=18) vodorod va kislorod qanday o'zgarmas massa nisbatda birikkan?", variantlar: ["1 : 8 (2 g H va 16 g O)", "2 : 1", "1 : 16", "1 : 2"], togri: "1 : 8 (2 g H va 16 g O)" },
    { savol: "Ohaktoshning (CaCO₃) nisbiy molekulyar massasini hisoblang (Ca=40, C=12, O=16):", variantlar: ["52", "100", "68", "84"], togri: "100" },
    { savol: "Sulfat kislotaning (H₂SO₄) nisbiy molekulyar massasi nechaga teng (H=1, S=32, O=16)?", variantlar: ["64", "100", "98", "82"], togri: "98" },
  ]
  const [mrIdx, setMrIdx] = useState(0)
  const [mrTanlov2, setMrTanlov2] = useState(null)
  const [mrBall, setMrBall] = useState(0)
  const [mrTugadi, setMrTugadi] = useState(false)

  const duelSavollari = [
    { s: "FeS (Temir(II) sulfid) magnitga tortiladimi?", v: ["Yo'q, tortilmaydi", "Ha, kuchli tortiladi", "Faqat suvda tortiladi"], j: "Yo'q, tortilmaydi" },
    { s: "Ca(II) va Cl(I) dan tuzilgan kalsiy xlorid formulasi?", v: ["Ca₂Cl", "CaCl₂", "CaCl"], j: "CaCl₂" },
    { s: "Mr(H₂O) nechaga teng (H=1, O=16)?", v: ["17", "10", "18"], j: "18" },
    { s: "NaOH qaysi murakkab moddalar sinfiga kiradi?", v: ["Asoslar (Ishqor)", "Oksidlar", "Kislotalar"], j: "Asoslar (Ishqor)" },
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
        mavzuRaqam="3.5"
        mavzuNom="Murakkab moddalar"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={39}
        oldingiRaqam="3.4"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.4"
          oldingiNom="Davriy jadval"
          savollar={takrorlash3_4}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "fes", nom: "1. Fe + S vs FeS", ikon: "olov" },
              { id: "valentlik", nom: "2. Valentlik (Krest)", ikon: "atom" },
              { id: "prust", nom: "3. Prust qonuni (1:8)", ikon: "tarozi" },
              { id: "mr_tarozi", nom: "4. Mr Hisoblagich", ikon: "hisob" },
              { id: "nomlash", nom: "5. Binar nomlash (-id)", ikon: "kitob" },
              { id: "sinflar", nom: "6. 4 ta asosiy sinf", ikon: "kolba" },
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

          {animRejim === "fes" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={fesCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setFesQizdirildi(false)
                    setFesMagnit(false)
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    !fesQizdirildi ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#091538] text-blue-200"
                  }`}
                >
                  1. Fe + S Aralashmasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFesQizdirildi(true)
                    setFesMagnit(false)
                    tovushChiqar("togri")
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    fesQizdirildi ? "border-orange-400 bg-orange-500/25 text-orange-200" : "border-blue-900 bg-[#091538] text-blue-200"
                  }`}
                >
                  2. Qizdirib FeS sintez qilish (Fe + S → FeS)
                </button>
                <button
                  type="button"
                  onClick={() => setFesMagnit((m) => !m)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold text-xs"
                >
                  {fesMagnit ? "Magnitni olish" : "Magnit bilan tekshirish"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "valentlik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[350px] sm:h-[380px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={valentCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-yellow-300">1-element:</span>
                  {[
                    { b: "Na", v: 1, nom: "Natriy" },
                    { b: "Ca", v: 2, nom: "Kalsiy" },
                    { b: "Al", v: 3, nom: "Alyuminiy" },
                    { b: "C", v: 4, nom: "Uglerod" },
                    { b: "P", v: 5, nom: "Fosfor" },
                    { b: "S", v: 6, nom: "Oltingugurt" },
                  ].map((e) => (
                    <button
                      key={e.b}
                      type="button"
                      onClick={() => setEl1(e)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        el1.b === e.b ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#091538] text-blue-200"
                      }`}
                    >
                      {e.b}({RIM_RAQAM[e.v]})
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-cyan-300">2-element:</span>
                  {[
                    { b: "O", v: 2, nom: "Kislorod" },
                    { b: "Cl", v: 1, nom: "Xlor" },
                    { b: "S", v: 2, nom: "Oltingugurt(II)" },
                  ].map((e) => (
                    <button
                      key={e.b}
                      type="button"
                      onClick={() => setEl2(e)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        el2.b === e.b ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#091538] text-blue-200"
                      }`}
                    >
                      {e.b}({RIM_RAQAM[e.v]})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {animRejim === "prust" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={prustCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2">
                {["H2O", "CO2", "CuO"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPrustModda(k)}
                    className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                      prustModda === k ? "border-emerald-400 bg-emerald-500/25 text-emerald-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {k === "H2O" ? "H₂O (1 : 8)" : k === "CO2" ? "CO₂ (3 : 8)" : "CuO (4 : 1)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "mr_tarozi" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={mrCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {Object.keys(MR_MODDALAR).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMrTanlov(k)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      mrTanlov === k ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {MR_MODDALAR[k].f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "nomlash" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={nomCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {BINAR_ROYXAT.map((b, idx) => (
                  <button
                    key={b.formula}
                    type="button"
                    onClick={() => setNomIdx(idx)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      nomIdx === idx ? "border-cyan-400 bg-cyan-500/25 text-cyan-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {b.formula}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "sinflar" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={sinfCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "oksid", nom: "1. Oksidlar" },
                  { id: "asos", nom: "2. Asoslar (OH⁻)" },
                  { id: "kislota", nom: "3. Kislotalar (H⁺)" },
                  { id: "tuz", nom: "4. Tuzlar" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSinfTur(s.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      sinfTur === s.id ? "border-yellow-400 bg-yellow-500/25 text-yellow-200" : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {s.nom}
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
              { id: "saralash", nom: "1. Oddiy / Murakkab", ikon: "atom" },
              { id: "valent", nom: "2. Valentlik Formulasi", ikon: "kristall" },
              { id: "mr", nom: "3. Mr Hisoblash", ikon: "hisob" },
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

          {oyinRejim === "saralash" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!sTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Modda {sIdx + 1} / {saralashSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {sBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{saralashSavollar[sIdx].modda}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "oddiy", nom: "ODDIY MODDA" },
                      { id: "murakkab", nom: "MURAKKAB MODDA" },
                      { id: "aralashma", nom: "ARALASHMA" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === saralashSavollar[sIdx].tur) {
                            setSBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (sIdx < saralashSavollar.length - 1) setSIdx((i) => i + 1)
                          else setSTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {sBall} / {saralashSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSIdx(0)
                      setSBall(0)
                      setSTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "valent" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!vTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {vIdx + 1} / {valentSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {vBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{valentSavollar[vIdx].savol}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {valentSavollar[vIdx].variantlar.map((v) => {
                      const togri = v === valentSavollar[vIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (vTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (vTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (vTanlov !== null) return
                            setVTanlov(v)
                            if (togri) {
                              setVBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-4 rounded-2xl border text-center font-bold text-lg ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {vTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (vIdx < valentSavollar.length - 1) {
                            setVIdx((i) => i + 1)
                            setVTanlov(null)
                          } else {
                            setVTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {vBall} / {valentSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setVIdx(0)
                      setVTanlov(null)
                      setVBall(0)
                      setVTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "mr" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!mrTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {mrIdx + 1} / {mrSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {mrBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{mrSavollar[mrIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mrSavollar[mrIdx].variantlar.map((v) => {
                      const togri = v === mrSavollar[mrIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (mrTanlov2 !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (mrTanlov2 === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (mrTanlov2 !== null) return
                            setMrTanlov2(v)
                            if (togri) {
                              setMrBall((b) => b + 1)
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
                  {mrTanlov2 !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (mrIdx < mrSavollar.length - 1) {
                            setMrIdx((i) => i + 1)
                            setMrTanlov2(null)
                          } else {
                            setMrTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {mrBall} / {mrSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setMrIdx(0)
                      setMrTanlov2(null)
                      setMrBall(0)
                      setMrTugadi(false)
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
