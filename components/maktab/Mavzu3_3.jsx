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
    // Audio xatosini e'tiborsiz qoldirish
  }
}

export default function Mavzu3_3() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("elektron_gaz")
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

  const takrorlash3_2 = [
    {
      savol: "4H₂O yozuvida jami nechta vodorod (H) va kislorod (O) atomi bor?",
      variantlar: ["8 ta H va 4 ta O (jami 12 ta)", "4 ta H va 4 ta O", "2 ta H va 1 ta O", "6 ta H va 2 ta O"],
      togriJavob: "8 ta H va 4 ta O (jami 12 ta)",
      izoh: "Oldindagi 4 koeffitsiyenti molekula ichidagi har bir indeksga ko'paytiriladi: 4×2=8 ta H va 4×1=4 ta O.",
    },
    {
      savol: "Quyidagilardan qaysi biri ikki atomli oddiy modda molekulasi hisoblanadi?",
      variantlar: ["O₂ (Kislorod)", "H₂O (Suv)", "He (Geliy)", "CO₂"],
      togriJavob: "O₂ (Kislorod)",
      izoh: "H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂ — ikki atomli oddiy modda molekulalaridir.",
    },
    {
      savol: "Suv elektroliz qilinganda (2H₂O → 2H₂↑ + O₂↑) vodorod va kislorod qanday hajmiy nisbatda ajraladi?",
      variantlar: ["2 : 1 nisbatda (2 hajm H₂ va 1 hajm O₂)", "1 : 1 nisbatda", "1 : 2 nisbatda", "3 : 1 nisbatda"],
      togriJavob: "2 : 1 nisbatda (2 hajm H₂ va 1 hajm O₂)",
      izoh: "Har 2 molekula suv parchalanganda 2 hajm vodorod va 1 hajm kislorod hosil bo'ladi.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: METALL PANJARASI VA "ELEKTRON GAZI" MEXANIZMI
  // ═══════════════════════════════════════════════════════════════════════════
  const elGazCanvasRef = useRef(null)
  const [kuchlanishBor, setKuchlanishBor] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "elektron_gaz") return
    const canvas = elGazCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.045
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      // Metall plastinka chegarasi
      const px = w * 0.14
      const py = h * 0.2
      const pw = w * 0.72
      const ph = h * 0.58

      ctx.fillStyle = "rgba(30,41,59,0.65)"
      ctx.strokeStyle = kuchlanishBor ? "#facc15" : "#475569"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(px, py, pw, ph, 16)
      ctx.fill()
      ctx.stroke()

      if (kuchlanishBor) {
        ctx.fillStyle = "#ef4444"
        ctx.font = "bold 24px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("(-)", px - 26, py + ph / 2 + 8)
        ctx.fillStyle = "#4ade80"
        ctx.fillText("(+)", px + pw + 26, py + ph / 2 + 8)
      }

      // Metall kationlari (Cu2+)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const ix = px + 65 + c * ((pw - 130) / 4)
          const iy = py + 45 + r * ((ph - 90) / 2)
          ctx.fillStyle = "#f97316"
          ctx.beginPath()
          ctx.arc(ix, iy, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 11px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.fillText("Cu²⁺", ix, iy + 4)
        }
      }

      // Erkin elektronlar ("Elektron gazi")
      for (let i = 0; i < 24; i++) {
        let ex
        let ey
        if (kuchlanishBor) {
          // (-) dan (+) tomonga tartibli oqim
          ex = px + 18 + (((i * 37 + t * 110) % (pw - 36)))
          ey = py + 24 + ((i * 29) % (ph - 48)) + Math.sin(t * 2 + i) * 6
        } else {
          // Tartibsiz erkin harakat
          ex = px + 30 + ((i * 43 + Math.sin(t + i) * 35) % (pw - 60))
          ey = py + 30 + ((i * 31 + Math.cos(t * 1.3 + i) * 25) % (ph - 60))
        }
        ctx.fillStyle = "#38bdf8"
        ctx.beginPath()
        ctx.arc(Math.abs(ex), Math.abs(ey), 5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        kuchlanishBor
          ? "Kuchlanish ulanganda: Erkin elektronlar (-) dan (+) ga tartibli oqadi (Elektr toki)"
          : "Metall bog'lanish: Tugunlarda musbat ionlar (Cu²⁺), oraliqda erkin 'elektron gazi' (e⁻)",
        w / 2,
        h * 0.9
      )

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, kuchlanishBor])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: ISSIQLIK O'TKAZUVCHANLIK POYGASI (Ag, Cu, Fe, Si, S)
  // ═══════════════════════════════════════════════════════════════════════════
  const issiqlikCanvasRef = useRef(null)
  const [qizdirishFaol, setQizdirishFaol] = useState(false)
  const [issiqlikVaqt, setIssiqlikVaqt] = useState(0)

  useEffect(() => {
    if (!qizdirishFaol) return
    const timer = setInterval(() => {
      setIssiqlikVaqt((v) => (v < 100 ? v + 1.2 : 100))
    }, 50)
    return () => clearInterval(timer)
  }, [qizdirishFaol])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "issiqlik") return
    const canvas = issiqlikCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const sterjenlar = [
      { nom: "Ag (Kumush — 429 W/m·K)", tezlik: 1.0, rang: "#e2e8f0" },
      { nom: "Cu (Mis — 401 W/m·K)", tezlik: 0.92, rang: "#f97316" },
      { nom: "Fe (Temir — 80 W/m·K)", tezlik: 0.48, rang: "#94a3b8" },
      { nom: "Si (Kremniy — Metalloid)", tezlik: 0.22, rang: "#f59e0b" },
      { nom: "S (Oltingugurt — Metallmas)", tezlik: 0.04, rang: "#facc15" },
    ]

    const startX = 210
    const maxLen = w - 280

    sterjenlar.forEach((st, idx) => {
      const y = 48 + idx * 62
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.textAlign = "left"
      ctx.fillText(st.nom, 18, y + 18)

      // Sterjen asosi
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.roundRect(startX, y, maxLen, 26, 8)
      ctx.fill()

      // Qizigan qism
      const qiziganLen = Math.min(maxLen, (issiqlikVaqt / 100) * maxLen * st.tezlik)
      const grd = ctx.createLinearGradient(startX, y, startX + Math.max(10, qiziganLen), y)
      grd.addColorStop(0, "#ef4444")
      grd.addColorStop(1, "#facc15")
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.roundRect(startX, y, qiziganLen, 26, 8)
      ctx.fill()
    })
  }, [asosiyBolim, animRejim, issiqlikVaqt])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: PLASTIKLIK (METALL) vs MO'RTLIK (METALLMAS) ATOM MEXANIZMI
  // ═══════════════════════════════════════════════════════════════════════════
  const plastikCanvasRef = useRef(null)
  const [zarbaHolat, setZarbaHolat] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "plastik") return
    const canvas = plastikCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    // Chapda: Metall qatlamlari siljishi
    const cx1 = w * 0.26
    for (let r = 0; r < 3; r++) {
      const siljish = zarbaHolat && r === 0 ? 32 : 0
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(cx1 - 54 + c * 36 + siljish, h * 0.36 + r * 38, 15, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 16px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText("METALL (Au, Cu): Qatlamlar siljiydi, bog' uzilmaydi", cx1, h * 0.84)

    // O'ngda: Metallmas / mo'rt kristall sinishi
    const cx2 = w * 0.74
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const ajralishX = zarbaHolat && c >= 2 ? 36 : 0
        const ajralishY = zarbaHolat && c >= 2 ? (r - 1) * 18 : 0
        ctx.fillStyle = "#38bdf8"
        ctx.beginPath()
        ctx.arc(cx2 - 54 + c * 36 + ajralishX, h * 0.36 + r * 38 + ajralishY, 15, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.fillStyle = "#f43f5e"
    ctx.fillText("METALLMAS (S, P): Zarbadan bog'lar uzilib sinadi", cx2, h * 0.84)
  }, [asosiyBolim, animRejim, zarbaHolat])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: HARORAT VA AGREGAT HOLAT (Hg, Ga, Br₂, W)
  // ═══════════════════════════════════════════════════════════════════════════
  const haroratCanvasRef = useRef(null)
  const [termHarorat, setTermHarorat] = useState(25)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "suyuqlanish") return
    const canvas = haroratCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const namunalar = [
      { belgi: "Hg (Simob)", erish: -39, qaynash: 357, rang: "#cbd5e1" },
      { belgi: "Br₂ (Brom)", erish: -7, qaynash: 59, rang: "#ea580c" },
      { belgi: "Ga (Galliy)", erish: 30, qaynash: 2204, rang: "#38bdf8" },
      { belgi: "W (Volfram)", erish: 3422, qaynash: 5555, rang: "#facc15" },
    ]

    namunalar.forEach((n, idx) => {
      const x = (w / 5) * (idx + 1)
      const y = h * 0.52
      const holat =
        termHarorat < n.erish
          ? "QATTIQ"
          : termHarorat < n.qaynash
          ? "SUYUQ"
          : "GAZ"

      ctx.strokeStyle = "#475569"
      ctx.lineWidth = 3
      ctx.strokeRect(x - 46, y - 65, 92, 110)

      ctx.fillStyle = n.rang
      if (holat === "QATTIQ") {
        ctx.fillRect(x - 28, y - 5, 56, 44)
      } else if (holat === "SUYUQ") {
        ctx.beginPath()
        ctx.roundRect(x - 42, y + 12, 84, 30, 6)
        ctx.fill()
      } else {
        for (let i = 0; i < 6; i++) {
          ctx.beginPath()
          ctx.arc(x - 24 + (i % 3) * 24, y - 35 + Math.floor(i / 3) * 35, 7, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 15px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(n.belgi, x, y - 80)
      ctx.fillStyle = holat === "SUYUQ" ? "#38bdf8" : holat === "QATTIQ" ? "#4ade80" : "#f43f5e"
      ctx.fillText(`${holat} (Tₛ=${n.erish}°C)`, x, y + 72)
    })
  }, [asosiyBolim, animRejim, termHarorat])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: MAGNIT XOSSALARI (Fe, Co, Ni vs Cu, Al, S)
  // ═══════════════════════════════════════════════════════════════════════════
  const magnitCanvasRef = useRef(null)
  const [magnitYoqiq, setMagnitYoqiq] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "magnit") return
    const canvas = magnitCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    // Yuqorida taqa magnit
    const mx = w / 2
    const my = h * 0.22
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(mx - 90, my - 20, 90, 32)
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(mx, my - 20, 90, 32)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px 'Times New Roman', serif"
    ctx.textAlign = "center"
    ctx.fillText("N (Shimol)          S (Janub)", mx, my + 2)

    const moddalar = [
      { belgi: "Fe (Temir)", tortiladi: true, rang: "#94a3b8" },
      { belgi: "Ni (Nikel)", tortiladi: true, rang: "#cbd5e1" },
      { belgi: "Co (Kobalt)", tortiladi: true, rang: "#60a5fa" },
      { belgi: "Cu (Mis)", tortiladi: false, rang: "#f97316" },
      { belgi: "Al (Alyuminiy)", tortiladi: false, rang: "#e2e8f0" },
      { belgi: "S (Oltingugurt)", tortiladi: false, rang: "#facc15" },
    ]

    moddalar.forEach((m, idx) => {
      const x = (w / 7) * (idx + 1)
      const y = magnitYoqiq && m.tortiladi ? my + 42 : h * 0.72
      ctx.fillStyle = m.rang
      ctx.beginPath()
      ctx.roundRect(x - 36, y - 18, 72, 36, 10)
      ctx.fill()
      ctx.fillStyle = "#020617"
      ctx.font = "bold 13px 'Times New Roman', serif"
      ctx.fillText(m.belgi.split(" ")[0], x, y + 5)

      ctx.fillStyle = m.tortiladi ? "#4ade80" : "#94a3b8"
      ctx.font = "bold 12px 'Times New Roman', serif"
      ctx.fillText(m.belgi, x, h * 0.88)
    })
  }, [asosiyBolim, animRejim, magnitYoqiq])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: KISLOTA BILAN REAKSIYA (Zn + 2HCl → ZnCl₂ + H₂↑)
  // ═══════════════════════════════════════════════════════════════════════════
  const kislotaCanvasRef = useRef(null)
  const [tanlanganKislotaNamuna, setTanlanganKislotaNamuna] = useState("Zn")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "hcl") return
    const canvas = kislotaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.06
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const topY = h * 0.16
      const botY = h * 0.82

      // Probirka va HCl eritmasi
      ctx.fillStyle = "rgba(56,189,248,0.22)"
      ctx.fillRect(cx - 55, topY + 70, 110, botY - topY - 70)
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 4
      ctx.strokeRect(cx - 55, topY, 110, botY - topY)

      // Tubidagi namuna
      ctx.fillStyle =
        tanlanganKislotaNamuna === "Zn"
          ? "#94a3b8"
          : tanlanganKislotaNamuna === "Mg"
          ? "#e2e8f0"
          : tanlanganKislotaNamuna === "Cu"
          ? "#f97316"
          : "#facc15"
      ctx.beginPath()
      ctx.roundRect(cx - 32, botY - 34, 64, 24, 8)
      ctx.fill()

      const aktiv = tanlanganKislotaNamuna === "Zn" || tanlanganKislotaNamuna === "Mg"
      if (aktiv) {
        const pSoni = tanlanganKislotaNamuna === "Mg" ? 16 : 9
        for (let i = 0; i < pSoni; i++) {
          const py = botY - 38 - ((t * 50 + i * 20) % (botY - topY - 110))
          const px = cx + Math.sin(t * 2 + i) * 32
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 18px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        aktiv
          ? `${tanlanganKislotaNamuna} + 2HCl → ${tanlanganKislotaNamuna}Cl₂ + H₂↑ (Vodorod gazi pufakchalari ajralmoqda)`
          : `${tanlanganKislotaNamuna} + HCl → Reaksiya bormaydi (H₂ ajralmaydi)`,
        w / 2,
        h * 0.92
      )

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, tanlanganKislotaNamuna])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 TA SMART DOSKA O'YINI
  // ═══════════════════════════════════════════════════════════════════════════
  const xossaSavollar = [
    { matn: "Bolg'alanganda sinmasdan yassilanadi va sim qilib cho'ziladi (plastik)", tur: "metall" },
    { matn: "Qattiq holatda mo'rt, zarba berilsa kukun bo'lib maydalanadi", tur: "metallmas" },
    { matn: "Tarkibida erkin harakatlanuvchi 'elektron gazi' mavjud", tur: "metall" },
    { matn: "Odatdagi sharoitda ko'pchiligi gaz (H₂, O₂, N₂, Cl₂) holatida bo'ladi", tur: "metallmas" },
    { matn: "Issiqlik va elektr tokini juda yuqori darajada o'tkazadi", tur: "metall" },
    { matn: "Kremniy (Si), Bor (B), Germaniy (Ge) kabi yarimo'tkazgichlar guruhi", tur: "metalloid" },
  ]
  const [xIdx, setXIdx] = useState(0)
  const [xBall, setXBall] = useState(0)
  const [xTugadi, setXTugadi] = useState(false)

  const rekordSavollar = [
    { savol: "Xona haroratida (20°C) suyuq holatda bo'ladigan yagona metall qaysi?", variantlar: ["Hg (Simob)", "Fe (Temir)", "Ag (Kumush)", "Al (Alyuminiy)"], togri: "Hg (Simob)" },
    { savol: "Xona haroratida suyuq holatda bo'ladigan yagona metallmas qaysi?", variantlar: ["Br₂ (Brom)", "I₂ (Yod)", "Cl₂ (Xlor)", "S (Oltingugurt)"], togri: "Br₂ (Brom)" },
    { savol: "Eng qiyin suyuqlanadigan metall (3422°C, cho'g'lanma lampa tolasi)?", variantlar: ["W (Volfram)", "Ga (Galliy)", "Na (Natriy)", "Pb (Qo'rg'oshin)"], togri: "W (Volfram)" },
    { savol: "Elektr va issiqlikni barcha metallardan eng yaxshi o'tkazuvchi metall?", variantlar: ["Ag (Kumush)", "Fe (Temir)", "Hg (Simob)", "Pb (Qo'rg'oshin)"], togri: "Ag (Kumush)" },
  ]
  const [rIdx, setRIdx] = useState(0)
  const [rTanlov, setRTanlov] = useState(null)
  const [rBall, setRBall] = useState(0)
  const [rTugadi, setRTugadi] = useState(false)

  const labSinovSavollar = [
    { savol: "Uchta qora kukun: Temir (Fe), Ko'mir (C) va Mis(II) oksiddan qaysi biri magnitga tortiladi?", variantlar: ["Faqat Fe (Temir)", "Faqat C (Ko'mir)", "Hammasi tortiladi", "Hech biri tortilmaydi"], togri: "Faqat Fe (Temir)" },
    { savol: "Kaft haroratidayoq (29.8°C) erib suyuqlikka aylanadigan metall qaysi?", variantlar: ["Ga (Galliy)", "Fe (Temir)", "Cu (Mis)", "W (Volfram)"], togri: "Ga (Galliy)" },
    { savol: "Rux (Zn) bo'lagi xlorid kislotaga (HCl) tushirilganda qanday gaz pufakchalari chiqadi?", variantlar: ["H₂ (Vodorod)", "O₂ (Kislorod)", "CO₂", "N₂ (Azot)"], togri: "H₂ (Vodorod)" },
    { savol: "Oltin (Au) dan 0.0001 mm qalinlikdagi zar varaq yasalishi metallarning qaysi xossasiga asoslangan?", variantlar: ["Plastiklik (bolg'alanuvchanlik)", "Mo'rtlik", "Magnitlanish", "Sublimatsiya"], togri: "Plastiklik (bolg'alanuvchanlik)" },
  ]
  const [lsIdx, setLsIdx] = useState(0)
  const [lsTanlov, setLsTanlov] = useState(null)
  const [lsBall, setLsBall] = useState(0)
  const [lsTugadi, setLsTugadi] = useState(false)

  const duelSavollari = [
    { s: "Qaysi metall magnitga kuchli tortiladi?", v: ["Fe (Temir)", "Cu (Mis)", "Au (Oltin)"], j: "Fe (Temir)" },
    { s: "Eng yengil metall (suvda suzadi, ρ = 0.53 g/cm³)?", v: ["Li (Litiy)", "Os (Osmiy)", "Fe (Temir)"], j: "Li (Litiy)" },
    { s: "Metallarda elektr tokini nima tashiydi?", v: ["Erkin elektronlar", "Protonlar", "Neytronlar"], j: "Erkin elektronlar" },
    { s: "Qaysi metallmas odatdagi sharoitda to'q qizil-qo'ng'ir suyuqlik?", v: ["Br₂ (Brom)", "S (Oltingugurt)", "C (Uglerod)"], j: "Br₂ (Brom)" },
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
        mavzuRaqam="3.3"
        mavzuNom="Metall va metallmaslar"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={34}
        oldingiRaqam="3.2"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.2"
          oldingiNom="Atom va molekula"
          savollar={takrorlash3_2}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "elektron_gaz", nom: "1. Elektron gazi", ikon: "chaqmoq" },
              { id: "issiqlik", nom: "2. Issiqlik poygasi", ikon: "olov" },
              { id: "plastik", nom: "3. Plastik vs Mo'rt", ikon: "kristall" },
              { id: "suyuqlanish", nom: "4. Hg, Ga, Br₂, W", ikon: "tomchi" },
              { id: "magnit", nom: "5. Magnit sinovi", ikon: "qalqon" },
              { id: "hcl", nom: "6. Zn + 2HCl → H₂↑", ikon: "kolba" },
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

          {animRejim === "elektron_gaz" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={elGazCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setKuchlanishBor((v) => !v)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm"
                >
                  {kuchlanishBor ? "Kuchlanishni o'chirish" : "Elektr kuchlanishini ulash (+ / -)"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "issiqlik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={issiqlikCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIssiqlikVaqt(0)
                    setQizdirishFaol(true)
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs sm:text-sm"
                >
                  Qizdirishni boshlash (Ag vs Cu vs Fe vs Si vs S)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQizdirishFaol(false)
                    setIssiqlikVaqt(0)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-blue-800 bg-[#091538] text-blue-200 font-bold text-xs"
                >
                  Nollash
                </button>
              </div>
            </div>
          )}

          {animRejim === "plastik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={plastikCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setZarbaHolat((v) => !v)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm"
                >
                  {zarbaHolat ? "Dastlabki holatga qaytarish" : "Mexanik zarba berish (Bolg'alash)"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "suyuqlanish" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={haroratCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-center gap-2 flex-wrap">
                {[
                  { t: -45, nom: "-45°C (Qahraton)" },
                  { t: 20, nom: "20°C (Xona harorati)" },
                  { t: 36, nom: "36.6°C (Inson kafti — Ga eriydi)" },
                  { t: 100, nom: "100°C (Br₂ qaynaydi)" },
                  { t: 3500, nom: "3500°C (W eriydi)" },
                ].map((h) => (
                  <button
                    key={h.t}
                    type="button"
                    onClick={() => setTermHarorat(h.t)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                      termHarorat === h.t
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#091538] text-blue-200"
                    }`}
                  >
                    {h.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "magnit" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={magnitCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setMagnitYoqiq((v) => !v)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold text-xs sm:text-sm"
                >
                  {magnitYoqiq ? "Magnitni uzoqlashtirish" : "Magnitni yaqinlashtirish (Fe, Ni, Co vs Cu, Al, S)"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "hcl" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={kislotaCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {["Mg", "Zn", "Cu", "S"].map((el) => (
                  <button
                    key={el}
                    type="button"
                    onClick={() => setTanlanganKislotaNamuna(el)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      tanlanganKislotaNamuna === el
                        ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                        : "border-blue-900 bg-[#091538] text-blue-200"
                    }`}
                  >
                    {el} + HCl sinovi
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
              { id: "saralash", nom: "1. Xossalar Saralash", ikon: "atom" },
              { id: "rekord", nom: "2. Rekordchi Element", ikon: "yulduz" },
              { id: "sinov", nom: "3. Laboratoriya Sinovi", ikon: "kolba" },
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
              {!xTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Xossa {xIdx + 1} / {xossaSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {xBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{xossaSavollar[xIdx].matn}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "metall", nom: "METALLAR" },
                      { id: "metallmas", nom: "METALLMASLAR" },
                      { id: "metalloid", nom: "METALLOIDLAR" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === xossaSavollar[xIdx].tur) {
                            setXBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (xIdx < xossaSavollar.length - 1) setXIdx((i) => i + 1)
                          else setXTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {xBall} / {xossaSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setXIdx(0)
                      setXBall(0)
                      setXTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "rekord" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!rTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {rIdx + 1} / {rekordSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {rBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{rekordSavollar[rIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rekordSavollar[rIdx].variantlar.map((v) => {
                      const togri = v === rekordSavollar[rIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (rTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (rTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (rTanlov !== null) return
                            setRTanlov(v)
                            if (togri) {
                              setRBall((b) => b + 1)
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
                  {rTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (rIdx < rekordSavollar.length - 1) {
                            setRIdx((i) => i + 1)
                            setRTanlov(null)
                          } else {
                            setRTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {rBall} / {rekordSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setRIdx(0)
                      setRTanlov(null)
                      setRBall(0)
                      setRTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "sinov" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!lsTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Sinov {lsIdx + 1} / {labSinovSavollar.length}</span>
                    <span className="text-emerald-300">Ball: {lsBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{labSinovSavollar[lsIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {labSinovSavollar[lsIdx].variantlar.map((v) => {
                      const togri = v === labSinovSavollar[lsIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (lsTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (lsTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (lsTanlov !== null) return
                            setLsTanlov(v)
                            if (togri) {
                              setLsBall((b) => b + 1)
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
                  {lsTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (lsIdx < labSinovSavollar.length - 1) {
                            setLsIdx((i) => i + 1)
                            setLsTanlov(null)
                          } else {
                            setLsTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {lsBall} / {labSinovSavollar.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setLsIdx(0)
                      setLsTanlov(null)
                      setLsBall(0)
                      setLsTugadi(false)
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
