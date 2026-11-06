"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"
import { QoshimchaKorgazma, QoshimchaOyin } from "@/components/maktab/SmartDoskaQoshimcha"

// 1.2-mavzuni takrorlash uchun darslik asosidagi blits-savollar
const takrorlashSavollari1_2 = [
  {
    id: 1,
    savol: "Qadimgi alximiklarning 'suv uzoq qaynatilsa tuproqqa aylanadi' degan fikriga nima sabab bo'lgan edi?",
    izoh: "Suv uzoq qaynatilganda idish tubida oq qattiq cho'kma hosil bo'ladi. Ular buni suvning tuproqqa aylanishi deb yanglish o'ylashgan.",
    variantlar: [
      { matn: "Idish tubida oq qattiq cho'kma hosil bo'lishi", togri: true },
      { matn: "Suvning to'satdan qora tusga kirishi", togri: false },
      { matn: "Suvdan o'simlik unib chiqishi", togri: false },
      { matn: "Kolba shishasining erib ketishi", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Antuan Lavuazye 101 kunlik tajribasida qanday asbob va usul bilan haqiqatni isbotladi?",
    izoh: "Lavuazye germetik yopiq 'Pelikan' kolbasida qaynatib, suv va bo'shagan kolba massasini o'ta aniq analitik tarozida o'lchab isbotladi (149.85g + 0.15g = 150.00g).",
    variantlar: [
      { matn: "Germetik yopiq Pelikan kolbasi va analitik tarozi bilan", togri: true },
      { matn: "Faqat ko'z bilan qarab chamalash orqali", togri: false },
      { matn: "Suvni muzlatkichda muzlatib ko'rish orqali", togri: false },
      { matn: "Boshqa alximiklarning gapiga ishonish orqali", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Lavuazye va Karl Sheele tajribalari suvning qaysi muhim xususiyatini isbotlab berdi?",
    izoh: "Suv tabiatdagi universal erituvchidir. U uzoq vaqt davomida hatto qattiq shisha idishni ham mikroskopik darajada yuvib erita oladi!",
    variantlar: [
      { matn: "Suv universal erituvchi bo'lib, hatto shishani ham erita oladi", togri: true },
      { matn: "Suv hech qachon qaynay olmaydi", togri: false },
      { matn: "Suv shishani qattiqroq qilib qo'yadi", togri: false },
      { matn: "Suv faqat gazga aylana oladi", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Tajribangiz ketma-ket bir necha bor o'xshamasa, tadqiqotchiga xos qaysi fazilat talab etiladi?",
    izoh: "Sheele 12 kun, Lavuazye esa 101 kun sabr bilan kuzatgan. Sabr-toqat va qat'iyatlilik tadqiqotchining eng zarur xususiyatidir!",
    variantlar: [
      { matn: "Sabr-toqat va Qat'iyatlilik bilan xatoni tahlil qilish", togri: true },
      { matn: "Natijani daftarga yolg'ondan yozib qo'yish", togri: false },
      { matn: "Tajribani darhol tashlab laboratoriyadan ketish", togri: false },
      { matn: "Asboblarni sindirib tashlash", togri: false },
    ],
  },
]

// Web Audio API yordamida interaktiv tovush effektlari
function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (turi === "togri" || turi === "tasdiq") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc.start(now)
      osc.stop(now + 0.22)
    } else if (turi === "xato") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(240, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26)
      osc.start(now)
      osc.stop(now + 0.26)
    } else if (turi === "silkitish") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      osc.start(now)
      osc.stop(now + 0.18)
    } else if (turi === "bosqich") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.15)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      osc.start(now)
      osc.stop(now + 0.18)
    } else if (turi === "zafar") {
      const akkord = [523.25, 659.25, 783.99, 1046.5]
      akkord.forEach((freq, idx) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = "sine"
        o.frequency.value = freq
        o.connect(g)
        g.connect(ctx.destination)
        g.gain.setValueAtTime(0.08, now + idx * 0.08)
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5)
        o.start(now + idx * 0.08)
        o.stop(now + idx * 0.08 + 0.5)
      })
    }
  } catch {
    // Audio kontekst
  }
}

export default function Mavzu1_3() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar: 1..4
  // "gipoteza": Gipoteza va erish tezligi (Shakar va harorat)
  // "suvlar": 4 xil suvda ko'pik sinovi (Kuzatish va taqqoslash)
  // "asboblar": Sezgi organlari vs Ilmiy asboblar
  // "adolat": Adolatli tajriba (Fair Test) qoidasi
  const [animRejim, setAnimRejim] = useState("gipoteza")

  // O'yinlar: 1..2
  // "zanjir": Ilmiy metod zanjiri (Ketma-ketlikni tuzish)
  // "hakam": Adolatli tajriba hakami (Tajribadagi xatoni fosh etish)
  const [oyinRejim, setOyinRejim] = useState("zanjir")

  // To'liq ekran rejimi (Smart doska)
  const toliqEkranniUlash = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
        .then(() => setToliqEkran(true))
        .catch(() => setToliqEkran(true))
    } else {
      document.exitFullscreen?.()
        .then(() => setToliqEkran(false))
        .catch(() => setToliqEkran(false))
    }
  }

  useEffect(() => {
    const handleFsChange = () => setToliqEkran(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handleFsChange)
    return () => document.removeEventListener("fullscreenchange", handleFsChange)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-ANIMATSIYA: GIPOTEZA VA TAJRIBA (SHAKARNING ERISH TEZLIGI)
  // Harorat, modda maydaligi va aralashtirishning sekundomerga ta'siri
  // ═══════════════════════════════════════════════════════════════════════════
  const gipotezaCanvasRef = useRef(null)
  const [shakarTuri, setShakarTuri] = useState("mayda") // "yaxlit" (qand) | "mayda" (qum shakar)
  const [haroratDarajasi, setHaroratDarajasi] = useState(50) // 10..90 °C
  const [aralashAktiv, setAralashAktiv] = useState(false)
  const [tajribaKetmoqda, setTajribaKetmoqda] = useState(false)
  const [otganVaqt, setOtganVaqt] = useState(0) // Sekundomer
  const [eriganQism, setEriganQism] = useState(0) // 0..100%

  // Tajribani boshlash / qayta o'rnatish
  const tajribaniBoshlash = () => {
    setEriganQism(0)
    setOtganVaqt(0)
    setTajribaKetmoqda(true)
    tovushChiqar("bosqich")
  }

  const tajribaniToxtatish = () => {
    setTajribaKetmoqda(false)
  }

  useEffect(() => {
    let timer
    if (tajribaKetmoqda) {
      // Erish tezligi hisobi: harorat, maydalik va aralashtirishga bog'liq
      const maydalikKoeff = shakarTuri === "mayda" ? 2.2 : 1.0
      const aralashKoeff = aralashAktiv ? 2.5 : 1.0
      const tezlik = (haroratDarajasi / 30) * maydalikKoeff * aralashKoeff

      timer = setInterval(() => {
        setOtganVaqt((v) => Number((v + 0.1).toFixed(1)))
        setEriganQism((q) => {
          const yangi = q + tezlik * 1.8
          if (yangi >= 100) {
            setTajribaKetmoqda(false)
            tovushChiqar("zafar")
            return 100
          }
          return yangi
        })
      }, 100)
    }
    return () => clearInterval(timer)
  }, [tajribaKetmoqda, haroratDarajasi, shakarTuri, aralashAktiv])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "gipoteza") return
    const canvas = gipotezaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const CX = W / 2 - 40
    const CY = H / 2 + 10

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stoli
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.fillRect(0, H - 35, W, 35)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, H - 35)
      ctx.lineTo(W, H - 35)
      ctx.stroke()

      // Stakan o'lchami
      const bW = 160
      const bH = 180
      const bX = CX - bW / 2
      const bY = CY - 70

      // Suv rangi (haroratga qarab: 10°C och havorang -> 90°C to'q feruza)
      const r = Math.floor(40 + (haroratDarajasi / 90) * 50)
      const g = Math.floor(130 + (haroratDarajasi / 90) * 80)
      const b = 245
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`
      ctx.fillRect(bX + 5, bY + 30, bW - 10, bH - 35)

      // Suv to'lqini
      ctx.beginPath()
      ctx.moveTo(bX + 5, bY + 30)
      for (let x = bX + 5; x <= bX + bW - 5; x += 8) {
        const amp = aralashAktiv ? 5 : 1.5
        const y = bY + 30 + Math.sin(f * (aralashAktiv ? 7 : 3) + (x - bX) * 0.08) * amp
        ctx.lineTo(x, y)
      }
      ctx.lineTo(bX + bW - 5, bY + bH)
      ctx.lineTo(bX + 5, bY + bH)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
      ctx.fill()

      // Termometr (stakan ichiga tushirilgan)
      const tx = bX + 25
      ctx.fillStyle = "rgba(226, 232, 240, 0.8)"
      ctx.fillRect(tx - 3, bY - 30, 6, bH + 20)
      ctx.fillStyle = "#ef4444"
      const simobH = (haroratDarajasi / 100) * (bH - 30)
      ctx.fillRect(tx - 2, bY + bH - 10 - simobH, 4, simobH)
      ctx.beginPath()
      ctx.arc(tx, bY + bH - 5, 6, 0, Math.PI * 2)
      ctx.fill()

      // Shisha aralashtirgich
      if (aralashAktiv) {
        ctx.save()
        ctx.translate(CX, bY + 25)
        ctx.rotate(Math.sin(f * 5) * 0.18)
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
        ctx.fillRect(-3, -40, 6, bH - 10)
        ctx.restore()
      }

      // Shakar qoldig'i (Erimagan qismi)
      const qolganFoiz = (100 - eriganQism) / 100
      if (qolganFoiz > 0.02) {
        if (shakarTuri === "yaxlit") {
          // Yaxlit qand kubigi
          const cubeH = 28 * qolganFoiz
          const cubeW = 32 * qolganFoiz
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
          ctx.fillRect(CX - cubeW / 2, bY + bH - cubeH - 4, cubeW, cubeH)
          ctx.strokeStyle = "#cbd5e1"
          ctx.strokeRect(CX - cubeW / 2, bY + bH - cubeH - 4, cubeW, cubeH)
        } else {
          // Mayda qum shakar uyumi
          const tepaR = 35 * qolganFoiz
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.beginPath()
          ctx.ellipse(CX, bY + bH - 6, tepaR, 8 * qolganFoiz, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        // Suvga tarqalayotgan shakar molekulalari
        if (tajribaKetmoqda) {
          for (let p = 0; p < 8; p++) {
            const px = CX + Math.sin(f * 2 + p) * 35
            const py = bY + bH - 20 - ((f * 40 + p * 15) % 80)
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
            ctx.beginPath()
            ctx.arc(px, py, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Stakan shisha devori
      ctx.beginPath()
      ctx.moveTo(bX, bY)
      ctx.lineTo(bX, bY + bH - 10)
      ctx.arcTo(bX, bY + bH, bX + 10, bY + bH, 10)
      ctx.lineTo(bX + bW - 10, bY + bH)
      ctx.arcTo(bX + bW, bY + bH, bX + bW, bY + bH - 10, 10)
      ctx.lineTo(bX + bW, bY)
      ctx.lineWidth = 3.5
      ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
      ctx.stroke()

      // ─── O'NG TOMONDA: ILMIY SEKUNDOMER VA GRAFIK ───
      const gX = CX + 120
      const gY = CY - 65

      // Sekundomer doirasi
      ctx.fillStyle = "#0f172a"
      ctx.beginPath()
      ctx.arc(gX + 45, gY + 30, 36, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#38bdf8"
      ctx.lineWidth = 3
      ctx.stroke()

      // Sekundomer millari
      const secAngle = (otganVaqt % 60) * ((Math.PI * 2) / 60) - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(gX + 45, gY + 30)
      ctx.lineTo(gX + 45 + Math.cos(secAngle) * 26, gY + 30 + Math.sin(secAngle) * 26)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()

      // Vaqt yozuvi
      ctx.fillStyle = "#ffffff"
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = "center"
      ctx.fillText(`${otganVaqt.toFixed(1)} s`, gX + 45, gY + 85)

      // Kichik tahliliy grafik ramkasi
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)"
      ctx.lineWidth = 1
      ctx.strokeRect(gX - 10, gY + 105, 110, 65)

      ctx.font = '9px "Times New Roman", serif'
      ctx.fillStyle = "#94a3b8"
      ctx.fillText("Erish egri chizig'i", gX + 45, gY + 100)

      // Dinamik grafik chizig'i
      ctx.beginPath()
      ctx.moveTo(gX - 5, gY + 165)
      const graphW = 100
      const curProg = (eriganQism / 100) * graphW
      ctx.quadraticCurveTo(gX - 5 + curProg * 0.5, gY + 165, gX - 5 + curProg, gY + 165 - (eriganQism / 100) * 55)
      ctx.strokeStyle = "#4ade80"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, shakarTuri, haroratDarajasi, aralashAktiv, eriganQism, otganVaqt, tajribaKetmoqda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: 4 XIL SUVDA KO'PIK SINOBI (KUZATISH VA TAQQOSLASH)
  // Distillangan vs Yomg'ir vs Vodoprovod vs Quduq (Qattiq) suvi
  // ═══════════════════════════════════════════════════════════════════════════
  const suvlarCanvasRef = useRef(null)
  const [probirkaSilkitilmoqda, setProbirkaSilkitilmoqda] = useState(false)
  const [kopikKorsat, setKopikKorsat] = useState(false)

  const probirkaniSilkitish = () => {
    setProbirkaSilkitilmoqda(true)
    tovushChiqar("silkitish")
    setTimeout(() => {
      setProbirkaSilkitilmoqda(false)
      setKopikKorsat(true)
      tovushChiqar("tasdiq")
    }, 1500)
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "suvlar") return
    const canvas = suvlarCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const namunalar = [
      { nom: "Distillangan suv", tur: "Yumshoq", kopikH: 60, cho: 0, rang: "rgba(56, 189, 248, 0.3)" },
      { nom: "Yomg'ir suvi", tur: "O'rtacha yumshoq", kopikH: 48, cho: 0, rang: "rgba(14, 165, 233, 0.35)" },
      { nom: "Vodoprovod suvi", tur: "O'rtacha qattiq", kopikH: 28, cho: 4, rang: "rgba(34, 197, 94, 0.25)" },
      { nom: "Quduq suvi", tur: "O'ta qattiq (Ca/Mg)", kopikH: 10, cho: 16, rang: "rgba(234, 179, 8, 0.25)" },
    ]

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stoli va shtativ
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.fillRect(0, H - 35, W, 35)

      // Probirka shtativi (yog'och taglik)
      ctx.fillStyle = "#334155"
      ctx.fillRect(25, H - 55, W - 50, 16)
      ctx.fillRect(40, H - 150, W - 80, 8)

      const colW = (W - 60) / 4

      namunalar.forEach((item, idx) => {
        const cx = 45 + colW * idx + colW / 2
        const cy = H - 165

        // Silkitish paytida tebranish
        const tebranishX = probirkaSilkitilmoqda ? Math.sin(f * 20 + idx) * 5 : 0
        const pX = cx + tebranishX

        const pW = 26
        const pH = 120

        // Probirka shishasi
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(pX - pW / 2, cy)
        ctx.lineTo(pX - pW / 2, cy + pH - 12)
        ctx.arcTo(pX - pW / 2, cy + pH, pX, cy + pH, 12)
        ctx.arcTo(pX + pW / 2, cy + pH, pX + pW / 2, cy + pH - 12, 12)
        ctx.lineTo(pX + pW / 2, cy)
        ctx.closePath()
        ctx.clip()

        // Suv qatlami
        ctx.fillStyle = item.rang
        ctx.fillRect(pX - pW / 2, cy + 45, pW, pH - 45)

        // Qattiq suv cho'kmasi (tuzlar)
        if (kopikKorsat && item.cho > 0) {
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.ellipse(pX, cy + pH - 4, pW / 2 - 2, item.cho * 0.4, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        // Ko'pik qatlami (sovun pufaklari)
        if (kopikKorsat) {
          const kH = item.kopikH
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
          ctx.fillRect(pX - pW / 2, cy + 45 - kH, pW, kH)

          // Ko'pik pufakchalari teksturasi
          for (let bp = 0; bp < 12; bp++) {
            const bx = pX - pW / 2 + 4 + (bp % 3) * 7
            const by = cy + 45 - kH + 5 + Math.floor(bp / 3) * 6
            ctx.strokeStyle = "rgba(203, 213, 225, 0.7)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(bx, by, 2.5, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
        ctx.restore()

        // Probirka shisha devori
        ctx.beginPath()
        ctx.moveTo(pX - pW / 2, cy)
        ctx.lineTo(pX - pW / 2, cy + pH - 12)
        ctx.arcTo(pX - pW / 2, cy + pH, pX, cy + pH, 12)
        ctx.arcTo(pX + pW / 2, cy + pH, pX + pW / 2, cy + pH - 12, 12)
        ctx.lineTo(pX + pW / 2, cy)
        ctx.lineWidth = 2.5
        ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
        ctx.stroke()

        // Probirka labi
        ctx.beginPath()
        ctx.ellipse(pX, cy, pW / 2 + 2, 3, 0, 0, Math.PI * 2)
        ctx.stroke()

        // Probirka nomi va ko'pik balandligi
        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.fillStyle = "#f8fafc"
        ctx.textAlign = "center"
        ctx.fillText(item.nom, pX, cy - 18)

        ctx.font = '10px "Times New Roman", serif'
        ctx.fillStyle = kopikKorsat ? (item.kopikH > 35 ? "#4ade80" : "#facc15") : "#94a3b8"
        ctx.fillText(
          kopikKorsat ? `Ko'pik: ${item.kopikH / 10} sm` : item.tur,
          pX,
          cy + pH + 22
        )
      })

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, probirkaSilkitilmoqda, kopikKorsat])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: SEZGI ORGANLARI VS ILMIY ASBOBLAR
  // "Ko'z va qo'l aldashi mumkin, ilmiy asbob esa adashmaydi!"
  // ═══════════════════════════════════════════════════════════════════════════
  const [faolSinov, setFaolSinov] = useState("kislota") // "kislota" | "harorat" | "massa"
  const [asbobQollanildi, setAsbobQollanildi] = useState(false)

  const asbobniIshlatish = () => {
    setAsbobQollanildi(true)
    tovushChiqar("tasdiq")
  }

  const sinovniOzgartirish = (tur) => {
    setFaolSinov(tur)
    setAsbobQollanildi(false)
    tovushChiqar("bosqich")
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: ADOLATLI TAJRIBA (FAIR TEST) — O'ZGARUVCHILARNI NAZORAT QILISH
  // ═══════════════════════════════════════════════════════════════════════════
  const [stakanA_Suv, setStakanA_Suv] = useState(100)
  const [stakanB_Suv, setStakanB_Suv] = useState(100)
  const [stakanA_Shakar, setStakanA_Shakar] = useState(5)
  const [stakanB_Shakar, setStakanB_Shakar] = useState(5)
  const [stakanA_Harorat, setStakanA_Harorat] = useState(20)
  const [stakanB_Harorat, setStakanB_Harorat] = useState(80)

  // Adolatli tajriba tekshiruvi: faqat HARORAT har xil bo'lishi kerak, suv va shakar teng bo'lishi shart!
  const adolatliTajribami = stakanA_Suv === stakanB_Suv && stakanA_Shakar === stakanB_Shakar && stakanA_Harorat !== stakanB_Harorat

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "ILMIY METOD ZANJIRI"
  // Tadqiqotning 6 ta bosqichini to'g'ri ketma-ketlikda joylashtirish
  // ═══════════════════════════════════════════════════════════════════════════
  const metodBosqichlari = [
    { id: 1, matn: "1. Kuzatish va Savol qo'yish", izoh: "Atrofdagi hodisani sezish va 'Nima uchun bunday?' deb savol berish" },
    { id: 2, matn: "2. Gipoteza (Ilmiy faraz)", izoh: "Muammoga dastlabki ilmiy taxmin bildirish: 'Agar harorat oshsa...'" },
    { id: 3, matn: "3. O'zgaruvchilarni belgilash", izoh: "Mustaqil, qaram va o'zgarmas sharoitlarni qat'iy rejalashtirish" },
    { id: 4, matn: "4. Tajriba o'tkazish", izoh: "Laboratoriya asboblari va sekundomer bilan amaliy o'lchovlar qilish" },
    { id: 5, matn: "5. Ma'lumotlarni tahlil qilish", izoh: "Jadval to'ldirish, grafik va diagrammalar chizish" },
    { id: 6, matn: "6. Xulosa va Bashorat", izoh: "Gipoteza to'g'ri chiqqanini isbotlash yoki yangi qonuniyat kashf etish" },
  ]

  const [tanlanganZanjir, setTanlanganZanjir] = useState([])
  const [aralashBosqichlar, setAralashBosqichlar] = useState(() =>
    [...metodBosqichlari].sort(() => Math.random() - 0.5)
  )
  const [zanjirTugadi, setZanjirTugadi] = useState(false)

  const bosqichTanlash = (bosqich) => {
    if (tanlanganZanjir.some((b) => b.id === bosqich.id)) return

    const kutilganId = tanlanganZanjir.length + 1
    if (bosqich.id === kutilganId) {
      const yangi = [...tanlanganZanjir, bosqich]
      setTanlanganZanjir(yangi)
      tovushChiqar("togri")
      if (yangi.length === 6) {
        setTimeout(() => {
          setZanjirTugadi(true)
          tovushChiqar("zafar")
        }, 400)
      }
    } else {
      tovushChiqar("xato")
    }
  }

  const zanjirniQayta = () => {
    setTanlanganZanjir([])
    setAralashBosqichlar([...metodBosqichlari].sort(() => Math.random() - 0.5))
    setZanjirTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "ADOLATLI TAJRIBA HAKAMI: XATONI TOP!"
  // 4 ta o'quvchining laboratoriya xatosini fosh etish
  // ═══════════════════════════════════════════════════════════════════════════
  const hakamVaziyatlari = [
    {
      id: 1,
      muallif: "Ali tajribasi: Haroratning ta'sirini tekshirish",
      holat: "Ali issiq suvga 10 g shakar soldi, sovuq suvga esa atigi 2 g shakar solib vaqtni o'lchadi.",
      savol: "Ushbu tajribada qaysi qoida buzilgan?",
      variantlar: [
        { matn: "O'zgarmas sharoit buzilgan: Modda massalari teng bo'lishi shart edi!", togri: true, izoh: "Shakar miqdori har xil bo'lsa, haroratning ta'sirini xolis aniqlab bo'lmaydi." },
        { matn: "Hech qanday xato yo'q, mukammal tajriba", togri: false, izoh: "Massalar har xil bo'lgani uchun tajriba natijasi soxta chiqadi." },
        { matn: "Suv rangi o'zgarmagani uchun xato", togri: false, izoh: "Shakar eriganda suv rangi o'zgarmaydi." },
      ],
    },
    {
      id: 2,
      muallif: "Vali tajribasi: Maydalik darajasini tekshirish",
      holat: "Vali qum-shakar solingan stakanni qoshiq bilan tez aralashtirdi, yaxlit qandli stakanni esa tekkizmasdan qoldirdi.",
      savol: "Nega Valining xulosasi ilmiy jihatdan xato?",
      variantlar: [
        { matn: "Aralashtirish qo'shimcha o'zgaruvchi bo'lib kirdi va adolatli taqqoslashni buzdi!", togri: true, izoh: "Faqat maydalik solishtirilayotganda, aralashtirish ikkala idishda ham bir xil bo'lishi shart!" },
        { matn: "Qoshiq temirdan bo'lgani uchun", togri: false, izoh: "Qoshiq materiali asosiy sabab emas." },
        { matn: "Qand shirin bo'lgani uchun", togri: false, izoh: "Ta'mning bunga aloqasi yo'q." },
      ],
    },
    {
      id: 3,
      muallif: "Zuhra tajribasi: Suv harorati va erish tezligi",
      holat: "Zuhra ikkala stakanga aynan 100 ml suv va 5 g bir xil shakar soldi. Biri 20°C, ikkinchisi 80°C bo'ldi. Sekundomer bilan aniq vaqtni yozib bordi.",
      savol: "Zuhraning tajribasiga qanday ilmiy baho berasiz?",
      variantlar: [
        { matn: "Mukammal adolatli tajriba (Fair Test): Barcha sharoitlar teng saqlangan!", togri: true, izoh: "Faqat bitta mustaqil o'zgaruvchi (harorat) o'zgardi, qolgan hamma parametr qat'iy tenglashtirildi!" },
        { matn: "Xato, chunki stakanlar shishadan edi", togri: false, izoh: "Laboratoriya stakani kimyoviy shishadan bo'lishi to'g'ri." },
        { matn: "Xato, chunki 80°C juda issiq", togri: false, izoh: "80°C harorat ta'sirini ko'rish uchun mos keladi." },
      ],
    },
    {
      id: 4,
      muallif: "Hasan tajribasi: Sekundomersiz o'lchash",
      holat: "Hasan stakanlarga qarab: 'Menimcha issiq suvdagisi tezroq eridi, ko'zim bilan ko'rdim' dedi, lekin vaqtni o'lchamadi.",
      savol: "Hasanning eng katta ilmiy kamchiligi nima?",
      variantlar: [
        { matn: "Aniq o'lchov asbobi (sekundomer) ishlatilmadi, shunchaki subyektiv ko'zga tayanildi!", togri: true, izoh: "Kimyo fani son va aniq o'lchovlarga tayanadi, taxmin bilan ilmiy xulosa qilinmaydi!" },
        { matn: "Stakanni ushlab ko'rmagani", togri: false, izoh: "Ko'z bilan ko'rish yetarli emas, aniq son kerak." },
        { matn: "Shakarni yemagani", togri: false, izoh: "Laboratoriyada moddalarni tatib ko'rish qat'iyan taqiqlanadi!" },
      ],
    },
  ]

  const [hakamIndeks, setHakamIndeks] = useState(0)
  const [tanlanganHakamJavob, setTanlanganHakamJavob] = useState(null)
  const [hakamBall, setHakamBall] = useState(0)
  const [hakamTugadi, setHakamTugadi] = useState(false)

  const hakamJavobTanlash = (idx) => {
    if (tanlanganHakamJavob !== null) return
    setTanlanganHakamJavob(idx)
    const varObj = hakamVaziyatlari[hakamIndeks].variantlar[idx]
    if (varObj.togri) {
      setHakamBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiHakamVaziyat = () => {
    if (hakamIndeks < hakamVaziyatlari.length - 1) {
      setHakamIndeks((i) => i + 1)
      setTanlanganHakamJavob(null)
      tovushChiqar("bosqich")
    } else {
      setHakamTugadi(true)
      tovushChiqar("zafar")
    }
  }

  const hakamQayta = () => {
    setHakamIndeks(0)
    setTanlanganHakamJavob(null)
    setHakamBall(0)
    setHakamTugadi(false)
  }

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className={`w-full select-none transition-all duration-300 font-serif ${
        toliqEkran
          ? "fixed inset-0 z-50 bg-[#020617] p-4 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-4"
          : "space-y-4"
      }`}
    >
      {/* ─── SMART DOSKA YUQORI NAVIGATSIYA VA TO'LIQ EKRAN SARLAVHASI ─── */}
      <SmartDoskaNavigatsiya
        mavzuRaqam="1.3"
        mavzuNom="Kimyo fanini o'rganishda ilmiy tadqiqot metodlari"
        bobNom="1-bob. Kirish"
        sahifa={4}
        oldingiRaqam="1.2"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          0-BO'LIM: O'TGAN DARSNI TAKRORLASH VA MUSTAHKAMLASH (1.2-MAVZU)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="1.2"
          oldingiNom="Tadqiqotchilikka xos xususiyatlar"
          savollar={takrorlashSavollari1_2}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1-BO'LIM: 4 TA KO'RGAZMALI KIMYOVIY ANIMATSIYA
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* 6 TA ANIMATSIYA REJIMI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setAnimRejim("gipoteza")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "gipoteza"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="harorat" olcham={16} />
              <span>1. Gipoteza & Erish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("suvlar")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "suvlar"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="tomchi" olcham={16} />
              <span>2. 4 xil suv & Ko&apos;pik</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("asboblar")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "asboblar"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="mikroskop" olcham={16} />
              <span>3. Sezgi vs Asboblar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("adolat")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "adolat"
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 ring-2 ring-purple-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
              }`}
            >
              <Ikon nom="formula" olcham={16} />
              <span>4. Adolatli tajriba</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k5")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "k5"
                  ? "border-orange-400 bg-orange-500/20 text-orange-300 ring-2 ring-orange-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-orange-400/50"
              }`}
            >
              <Ikon nom="tomchi" olcham={16} />
              <span>5. Choy ekstraksiyasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k6")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "k6"
                  ? "border-rose-400 bg-rose-500/20 text-rose-300 ring-2 ring-rose-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-rose-400/50"
              }`}
            >
              <Ikon nom="formula" olcham={16} />
              <span>6. Vaqt-Harorat grafigi</span>
            </button>
          </div>

          {/* ─── 1-ANIMATSIYA: GIPOTEZA VA ERISH TEZLIGI ─── */}
          {animRejim === "gipoteza" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={gipotezaCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-yellow-300 bg-black/85 px-4 py-2 rounded-xl border border-yellow-500/30 font-semibold shadow-lg">
                    {eriganQism === 0
                      ? "Gipotezani tekshirish: Harorat, maydalik va aralashtirishni sozlang va Start bosing."
                      : eriganQism < 100
                      ? `Tajriba ketmoqda: Erigan qism: ${Math.floor(eriganQism)}% | Vaqt: ${otganVaqt.toFixed(1)} s`
                      : `Shakar to'liq eridi! Umumiy sarflangan vaqt: ${otganVaqt.toFixed(1)} sekund!`}
                  </span>
                </div>
              </div>

              {/* INTERAKTIV BOSHQARUV PANELİ */}
              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Maydalik turi */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-bold">Modda turi:</span>
                    <button
                      type="button"
                      onClick={() => setShakarTuri("yaxlit")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        shakarTuri === "yaxlit"
                          ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                          : "border-blue-900 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      Yaxlit qand kubigi
                    </button>
                    <button
                      type="button"
                      onClick={() => setShakarTuri("mayda")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        shakarTuri === "mayda"
                          ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                          : "border-blue-900 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      Maydalangan qum-shakar
                    </button>
                  </div>

                  {/* Aralashtirish */}
                  <button
                    type="button"
                    onClick={() => {
                      setAralashAktiv(!aralashAktiv)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${
                      aralashAktiv
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-slate-700 bg-slate-800 text-slate-300"
                    }`}
                  >
                    {aralashAktiv ? "Aralashtirish faol" : "Aralashtirish o'chiq"}
                  </button>

                  {/* Start / To'xtatish */}
                  <button
                    type="button"
                    onClick={tajribaKetmoqda ? tajribaniToxtatish : tajribaniBoshlash}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg"
                  >
                    {tajribaKetmoqda ? "To'xtatish" : "Tajribani boshlash (Sekundomer)"}
                  </button>
                </div>

                {/* Harorat slayderi */}
                <div className="flex items-center gap-3 pt-2 border-t border-blue-900/40">
                  <Ikon nom="harorat" olcham={18} className="text-orange-400" />
                  <span className="text-xs text-blue-200">
                    Suv harorati: <strong>{haroratDarajasi}°C</strong>
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={haroratDarajasi}
                    onChange={(e) => setHaroratDarajasi(Number(e.target.value))}
                    className="flex-1 accent-orange-400 cursor-pointer"
                  />
                  <span className="text-xs text-orange-300 font-bold">
                    {haroratDarajasi > 60 ? "Qaynoq suv (Juda tez)" : haroratDarajasi > 35 ? "Iliq suv" : "Sovuq suv (Sekin)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── 2-ANIMATSIYA: 4 XIL SUVDA KO'PIK SINOBI ─── */}
          {animRejim === "suvlar" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={suvlarCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-cyan-300 bg-black/85 px-4 py-2 rounded-xl border border-cyan-500/30 font-semibold shadow-lg">
                    {!kopikKorsat
                      ? "4 ta probirkaga sovun eritmasi tomizilgan."
                      : "Distillangan suvda ko'pik eng baland (6 sm)! Qattiq quduq suvida esa tuzlar cho'kma berdi."}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={probirkaniSilkitish}
                  disabled={probirkaSilkitilmoqda}
                  className="px-5 py-2.5 rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <Ikon nom="tomchi" olcham={16} />
                  <span>{probirkaSilkitilmoqda ? "Probirkalar silkitilmoqda..." : "Probirkalarni silkitish (10 marta)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── 3-ANIMATSIYA: SEZGI ORGANLARI VS ASBOBLAR ─── */}
          {animRejim === "asboblar" && (
            <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-4">
              <div className="flex items-center gap-2 border-b border-blue-900/50 pb-3 flex-wrap justify-between">
                <div>
                  <h3 className="text-base font-bold text-emerald-300">
                    Sezgi organlari cheklovi va Asboblarning aniqligi
                  </h3>
                  <p className="text-xs text-blue-200">
                    Nima uchun kimyogar faqat ko&apos;zi va qo&apos;liga ishonmaydi?
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => sinovniOzgartirish("kislota")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      faolSinov === "kislota"
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : "border-blue-900 bg-blue-950/40 text-blue-300"
                    }`}
                  >
                    1. Rangsiz suyuqliklar
                  </button>
                  <button
                    type="button"
                    onClick={() => sinovniOzgartirish("harorat")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      faolSinov === "harorat"
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : "border-blue-900 bg-blue-950/40 text-blue-300"
                    }`}
                  >
                    2. Iliq suv harorati
                  </button>
                  <button
                    type="button"
                    onClick={() => sinovniOzgartirish("massa")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      faolSinov === "massa"
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : "border-blue-900 bg-blue-950/40 text-blue-300"
                    }`}
                  >
                    3. Kukun massasi
                  </button>
                </div>
              </div>

              {/* SINOV EKRANI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Chapda: Inson sezgisi */}
                <div className="p-4 rounded-2xl border border-blue-900/60 bg-[#081236] space-y-3">
                  <div className="text-xs font-bold text-yellow-300 flex items-center gap-2">
                    <Ikon nom="kuzatuv" olcham={16} />
                    <span>Inson sezgi organlari (Ko&apos;z / Qo&apos;l)</span>
                  </div>

                  <div className="h-36 rounded-xl bg-[#04081a] border border-blue-900/40 flex items-center justify-center p-4 text-center">
                    {faolSinov === "kislota" && (
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">Ko&apos;z bilan qaraganda:</div>
                        <div className="text-xs text-blue-200">
                          Ikkala stakandagi suyuqlik ham bir xil tiniq va rangsiz.
                          <br />
                          <span className="text-red-400 font-bold">Xavfli xulosa:</span> Qaysi biri oddiy suv, qaysi biri kuchli kislota ekanini ko&apos;z bilan bilib bo&apos;lmaydi! Tatib ko&apos;rish esa qat&apos;iyan man etiladi!
                        </div>
                      </div>
                    )}
                    {faolSinov === "harorat" && (
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">Qo&apos;l bilan ushlaganda:</div>
                        <div className="text-xs text-blue-200">
                          Muzdek tashqaridan kirgan qo&apos;lga bu suv juda issiq tuyuladi.
                          Issiq xonadan kirgan qo&apos;lga esa salqin tuyuladi.
                          <br />
                          <span className="text-red-400 font-bold">Xulosa:</span> Inson terisi aniq haroratni o&apos;lchay olmaydi!
                        </div>
                      </div>
                    )}
                    {faolSinov === "massa" && (
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">Qo&apos;lda ko&apos;tarib ko&apos;rganda:</div>
                        <div className="text-xs text-blue-200">
                          5 gramm bilan 5.5 gramm kukun orasidagi farqni inson qo&apos;li seza olmaydi.
                          <br />
                          <span className="text-red-400 font-bold">Xulosa:</span> Kimyoda 0.1 gramm xatolik ham butun reaksiyani o&apos;zgartirishi mumkin!
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* O'ngda: Ilmiy asbob */}
                <div className="p-4 rounded-2xl border border-emerald-500/40 bg-[#06182e] space-y-3">
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Ikon nom="tasdiq" olcham={16} />
                      <span>Aniq Ilmiy Asbob natijasi</span>
                    </span>
                    {!asbobQollanildi && (
                      <button
                        type="button"
                        onClick={asbobniIshlatish}
                        className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        Asbobni qo&apos;llash
                      </button>
                    )}
                  </div>

                  <div className="h-36 rounded-xl bg-[#030c1c] border border-emerald-500/30 flex items-center justify-center p-4 text-center">
                    {asbobQollanildi ? (
                      <div className="space-y-1">
                        {faolSinov === "kislota" && (
                          <>
                            <div className="text-sm font-bold text-emerald-300">pH Indikator qog&apos;ozi:</div>
                            <div className="text-xs text-blue-100">
                              A stakanga botirilganda qog&apos;oz qip-qizil bo&apos;ldi (pH = 1.0, Kuchli xlorid kislota!).
                              B stakanda neytral yashil qoldi (pH = 7.0, Toza suv).
                              <br />
                              <strong className="text-emerald-400">Asbob xavfni darhol fosh etdi!</strong>
                            </div>
                          </>
                        )}
                        {faolSinov === "harorat" && (
                          <>
                            <div className="text-sm font-bold text-emerald-300">Laboratoriya termometri:</div>
                            <div className="text-xs text-blue-100">
                              Simob ustuni aynan <strong>38.5°C</strong> da to&apos;xtadi.
                              <br />
                              Inson his-tuyg&apos;ularidan qat&apos;i nazar, asbob xolis va aniq sonni ko&apos;rsatdi!
                            </div>
                          </>
                        )}
                        {faolSinov === "massa" && (
                          <>
                            <div className="text-sm font-bold text-emerald-300">Elektron analitik tarozi:</div>
                            <div className="text-xs text-blue-100">
                              Displeyda aniq ko&apos;rsatkich: <strong>5.148 gramm</strong>.
                              <br />
                              Grammning mingdan bir qismigacha aniq hisoblandi!
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-blue-300/70">
                        Natijani ko&apos;rish uchun yuqoridagi &quot;Asbobni qo&apos;llash&quot; tugmasini bosing
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 4-ANIMATSIYA: ADOLATLI TAJRIBA (FAIR TEST) ─── */}
          {animRejim === "adolat" && (
            <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3 flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-purple-300">
                    Adolatli tajriba (Fair Test) qoidasi
                  </h3>
                  <p className="text-xs text-blue-200">
                    O&apos;quvchi haroratning ta&apos;sirini tekshirmoqchi. Faqat HARORAT farq qilishi kerak!
                  </p>
                </div>

                <div className={`px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  adolatliTajribami
                    ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                    : "border-red-500/60 bg-red-500/20 text-red-300"
                }`}>
                  <Ikon nom={adolatliTajribami ? "tasdiq" : "ogohlantirish"} olcham={16} />
                  <span>{adolatliTajribami ? "Adolatli tajriba (Fair Test!)" : "Adolatsiz tajriba (Sharoitlar teng emas!)"}</span>
                </div>
              </div>

              {/* 2 TA STAKAN TAQQOSLASH STENDI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* A Stakan */}
                <div className="p-4 rounded-2xl border border-blue-900 bg-[#081236] space-y-3">
                  <div className="text-sm font-bold text-cyan-300">A Stakan (Nazorat idishi)</div>
                  <div className="space-y-2 text-xs text-blue-200">
                    <div className="flex items-center justify-between">
                      <span>Suv hajmi:</span>
                      <strong>{stakanA_Suv} ml</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shakar massasi:</span>
                      <strong>{stakanA_Shakar} g</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Harorat:</span>
                      <strong className="text-cyan-300">{stakanA_Harorat}°C (Sovuq)</strong>
                    </div>
                  </div>
                </div>

                {/* B Stakan (Foydalanuvchi o'zgartiradi) */}
                <div className="p-4 rounded-2xl border border-blue-900 bg-[#081236] space-y-3">
                  <div className="text-sm font-bold text-orange-300">B Stakan (Tajriba idishi)</div>
                  <div className="space-y-2 text-xs text-blue-200">
                    <div className="flex items-center justify-between gap-2">
                      <span>Suv hajmi:</span>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        step="25"
                        value={stakanB_Suv}
                        onChange={(e) => setStakanB_Suv(Number(e.target.value))}
                        className="w-24 accent-yellow-400"
                      />
                      <strong>{stakanB_Suv} ml</strong>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span>Shakar massasi:</span>
                      <input
                        type="range"
                        min="2"
                        max="10"
                        step="1"
                        value={stakanB_Shakar}
                        onChange={(e) => setStakanB_Shakar(Number(e.target.value))}
                        className="w-24 accent-yellow-400"
                      />
                      <strong>{stakanB_Shakar} g</strong>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span>Harorat:</span>
                      <input
                        type="range"
                        min="20"
                        max="90"
                        step="10"
                        value={stakanB_Harorat}
                        onChange={(e) => setStakanB_Harorat(Number(e.target.value))}
                        className="w-24 accent-orange-400"
                      />
                      <strong className="text-orange-300">{stakanB_Harorat}°C</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(animRejim === "k5" || animRejim === "k6") && (
            <QoshimchaKorgazma mavzu="1.3" rejim={animRejim} />
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          2-BO'LIM: SMART DOSKA O'YINLARI (4 TA O'YIN)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "oyinlar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* O'YINLARNI TANLASH */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setOyinRejim("zanjir")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "zanjir"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="formula" olcham={16} />
              <span>1. Ilmiy Metod Zanjiri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("hakam")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "hakam"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="tasdiq" olcham={16} />
              <span>2. Adolatli Tajriba Hakami</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o3")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o3"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>3. O&apos;zgaruvchilar Tahlili</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o4")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o4"
                  ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-amber-400/50"
              }`}
            >
              <Ikon nom="kubok" olcham={16} />
              <span>4. Jamoalar Dueli (1 vs 2)</span>
            </button>
          </div>

          {/* ─── 1-O'YIN: ILMIY METOD ZANJIRI ─── */}
          {oyinRejim === "zanjir" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-2">
                    <Ikon nom="formula" olcham={20} />
                    <span>Topshiriq: Ilmiy tadqiqotning 6 ta bosqichini ketma-ket joylang!</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 pt-1">
                    Haqiqiy olim qaysi qadamdan boshlab qaysi qadamgacha boradi? Doskada to&apos;g&apos;ri tartibda bosing!
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                  Joylandi: {tanlanganZanjir.length} / 6
                </div>
              </div>

              {/* TAYYOR BO'LAYOTGAN ZANJIR STRIP */}
              <div className="p-4 rounded-2xl border border-blue-900 bg-[#060b22] space-y-2">
                <div className="text-xs font-bold text-yellow-400">Sizning ilmiy zanjiringiz:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const joylangan = tanlanganZanjir[num - 1]
                    return (
                      <div
                        key={num}
                        className={`p-3 rounded-xl border text-center transition min-h-[70px] flex flex-col justify-center ${
                          joylangan
                            ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md"
                            : "border-blue-900/60 bg-[#030718] text-blue-400/40 border-dashed"
                        }`}
                      >
                        {joylangan ? (
                          <>
                            <div className="text-xs font-bold">{joylangan.matn}</div>
                            <div className="text-[10px] text-emerald-400/80 truncate mt-0.5">{joylangan.izoh}</div>
                          </>
                        ) : (
                          <div className="text-xs font-semibold">{num}-bosqichni tanlang</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* BOSISH UCHUN ARALASH KARTALAR */}
              {!zanjirTugadi ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {aralashBosqichlar.map((b) => {
                    const ishlatildi = tanlanganZanjir.some((item) => item.id === b.id)
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => bosqichTanlash(b)}
                        disabled={ishlatildi}
                        className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex flex-col justify-between shadow-md active:scale-98 ${
                          ishlatildi
                            ? "opacity-30 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed"
                            : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60 hover:scale-101"
                        }`}
                      >
                        <div className="text-sm font-bold text-white">{b.matn}</div>
                        <div className="text-xs text-blue-300/80 font-normal pt-1">{b.izoh}</div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-3xl border-2 border-yellow-500/70 bg-gradient-to-br from-yellow-950/40 via-[#0a102a] to-[#04081c] text-center space-y-3 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/50 mx-auto flex items-center justify-center text-yellow-400">
                    <Ikon nom="kubok" olcham={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-300">
                    Ofarin! Ilmiy Metod Zanjiri to&apos;liq va to&apos;g&apos;ri tiklandi!
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
                    Kuzatish &rarr; Gipoteza &rarr; O&apos;zgaruvchilar &rarr; Tajriba &rarr; Tahlil &rarr; Xulosa!
                    Siz haqiqiy zamonaviy kimyogar kabi ilmiy fikrlashni o&apos;zlashtirdingiz!
                  </p>
                  <button
                    type="button"
                    onClick={zanjirniQayta}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg"
                  >
                    Qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 2-O'YIN: ADOLATLI TAJRIBA HAKAMI ─── */}
          {oyinRejim === "hakam" && (
            <div className="space-y-4">
              {!hakamTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                        {hakamVaziyatlari[hakamIndeks].muallif}
                      </span>
                      <h4 className="text-xs text-blue-300">
                        Tajriba sharoitini tahlil qilib, qoidabuzarlikni toping!
                      </h4>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold text-xs">
                      {hakamIndeks + 1} / {hakamVaziyatlari.length}
                    </div>
                  </div>

                  {/* Vaziyat kartasi */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/60 bg-[#081236]/90 space-y-2 shadow-xl">
                    <div className="text-xs uppercase text-cyan-400 font-bold">O&apos;quvchining amali:</div>
                    <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      &quot;{hakamVaziyatlari[hakamIndeks].holat}&quot;
                    </p>
                    <div className="text-xs text-yellow-300 font-semibold pt-1">
                      {hakamVaziyatlari[hakamIndeks].savol}
                    </div>
                  </div>

                  {/* 3 ta variant */}
                  <div className="space-y-2.5">
                    {hakamVaziyatlari[hakamIndeks].variantlar.map((varObj, idx) => {
                      const tanlandi = tanlanganHakamJavob === idx
                      let tugmaStil = "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"

                      if (tanlanganHakamJavob !== null) {
                        if (varObj.togri) {
                          tugmaStil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40"
                        } else if (tanlandi && !varObj.togri) {
                          tugmaStil = "border-red-500 bg-red-950/60 text-red-200"
                        }
                      }

                      return (
                        <button
                          key={varObj.matn}
                          type="button"
                          onClick={() => hakamJavobTanlash(idx)}
                          className={`w-full p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-md active:scale-98 ${tugmaStil}`}
                        >
                          <div className="space-y-0.5">
                            <div>{varObj.matn}</div>
                            {tanlanganHakamJavob !== null && (
                              <div className="text-[11px] font-normal opacity-90">{varObj.izoh}</div>
                            )}
                          </div>
                          {tanlanganHakamJavob !== null && varObj.togri && (
                            <Ikon nom="tasdiq" olcham={20} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganHakamJavob !== null && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={keyingiHakamVaziyat}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20"
                      >
                        {hakamIndeks < hakamVaziyatlari.length - 1 ? "Keyingi tajribaga o'tish" : "Yakuniy bahoni ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                    <Ikon nom="kubok" olcham={36} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Hakamlik tekshiruvi yakunlandi!
                  </h3>
                  <p className="text-base sm:text-lg text-emerald-300 font-bold">
                    To&apos;g&apos;ri fosh etilgan xatolar: {hakamBall} / {hakamVaziyatlari.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-200/90 max-w-md mx-auto leading-relaxed">
                    Siz kimyoviy tajribalarda <strong>Adolatli tajriba (Fair Test)</strong> qoidasiga qat&apos;iy amal qilishni
                    va xatolarni aniqlashni a&apos;lo darajada o&apos;rgandingiz!
                  </p>
                  <button
                    type="button"
                    onClick={hakamQayta}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-xl"
                  >
                    O&apos;yinni qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {(oyinRejim === "o3" || oyinRejim === "o4") && (
            <QoshimchaOyin mavzu="1.3" rejim={oyinRejim} />
          )}
        </div>
      )}
    </div>
  )
}
