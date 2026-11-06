"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"
import { QoshimchaKorgazma, QoshimchaOyin } from "@/components/maktab/SmartDoskaQoshimcha"

// Web Audio API yordamida ilmiy interaktiv tovush effektlari
function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    if (turi === "togri" || turi === "tasdiq") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc.start(now)
      osc.stop(now + 0.22)
    } else if (turi === "xato" || turi === "xavf") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.28)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
    } else if (turi === "harorat") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.2)
      gain.gain.setValueAtTime(0.16, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc.start(now)
      osc.stop(now + 0.22)
    } else if (turi === "porshen") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.27)
      osc.start(now)
      osc.stop(now + 0.27)
    } else if (turi === "reaksiya") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(350, now)
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.3)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32)
      osc.start(now)
      osc.stop(now + 0.32)
    } else if (turi === "bosqich") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
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

// 1.5-mavzuni takrorlash uchun darslik asosidagi blits-savollar (Jihozlar)
const takrorlashSavollari1_5 = [
  {
    id: 1,
    savol: "O'lchov silindrida suyuqlik hajmini to'g'ri o'qish uchun ko'z sathi qayerda bo'lishi kerak?",
    izoh: "Ko'z sathi botiq meniskning eng pastki qismi bilan bir chiziqda bo'lishi shart.",
    variantlar: [
      { matn: "Botiq meniskning eng pastki qismi bilan bir tekisda", togri: true },
      { matn: "Silindrga yuqoridan tik pastga qarab", togri: false },
      { matn: "Suyuqlikning eng yuqori chetlari bo'ylab", togri: false },
      { matn: "Silindr tagidan pastdan yuqoriga qarab", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Spirtovka alangasining qaysi zonasi eng issiq hisoblanadi va qizdirishda ishlatiladi?",
    izoh: "Alanganing tashqi (3-zonasi) to'liq yonish zonasi bo'lib, harorati 800-1000°C ga yetadi.",
    variantlar: [
      { matn: "Tashqi rangsiz/ko'kish zona (3-zona, 1000°C)", togri: true },
      { matn: "Ichki qoramtir sovuq zona (1-zona, 300°C)", togri: false },
      { matn: "O'rta yorug' zona (2-zona, 600°C)", togri: false },
      { matn: "Spirtovkaning pilik qismi", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Loyqa aralashmadagi erimagan qum zarrachalarini suzib ajratish uchun qaysi jihozlar kerak?",
    izoh: "Filtratsiya jarayoni uchun laboratoriya shtativi, shisha voronka, konusli filtr qog'oz, laboratoriya stakani va shisha tayoqcha kerak bo'ladi.",
    variantlar: [
      { matn: "Shisha voronka, filtr qog'oz, stakan va shisha tayoqcha", togri: true },
      { matn: "Spirtovka, uchoyoq va chinni kosacha", togri: false },
      { matn: "Byuretka va o'lchov kolbasi", togri: false },
      { matn: "Faqat bitta probirka", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Eritmani ochiq olovda qizdirib to'liq bug'latish va quruq tuz olish uchun qaysi idish mos keladi?",
    izoh: "Chinni kosacha (Evaporating dish) 1200°C gacha bo'lgan kuchli ochiq olov issiqligiga chidaydi va eritmalarni bug'latish uchun maxsus tayyorlangan.",
    variantlar: [
      { matn: "Chinni kosacha (1200°C issiqbardosh)", togri: true },
      { matn: "Plastmassa stakan", togri: false },
      { matn: "Yupqa o'lchov silindri", togri: false },
      { matn: "Shisha pipetka", togri: false },
    ],
  },
]

export default function Mavzu2_1() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "takrorlash" | "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar: 1..4
  // 1: "holatlar" — Moddaning 3 ta agregat holati va uzluksiz harorat (Qattiq, Suyuq, Gaz + Porshen + Bosim manometri)
  // 2: "diffuziya" — Diffuziya qonuniyatlari (Suyuqlikda harorat + Gazlarda Grem naychasi tajribasi: NH3 va HCl)
  // 3: "siqilish" — Shprits simulyatori: Gaz, Suyuqlik va Qattiq jism (Haqiqiy zarrachalar bo'shlig'i)
  // 4: "broun" — Broun harakati va Zarrachalar to'qnashuvi (Eynshteyn-Perrin tajribasi)
  const [animRejim, setAnimRejim] = useState("holatlar")

  // O'yinlar: 1..2
  // "saralash" — Zarrachalar saralovchisi (Ilmiy taqqoslash)
  // "diffuziya_oyini" — Kinetika va Diffuziya viktorinasi
  const [oyinRejim, setOyinRejim] = useState("saralash")

  // To'liq ekran rejimi
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
  // 1-ANIMATSIYA: MODDANING 3 TA AGREGAT HOLATI VA KINETIK ZARRACHALAR
  // Slayder: -50°C (Muz) -> 25°C (Suv) -> 150°C (Bug')
  // Porshen, bosim manometri (atm) va kinetik energiya (Ek) hisobi
  // ═══════════════════════════════════════════════════════════════════════════
  const holatCanvasRef = useRef(null)
  const [harorat, setHarorat] = useState(25) // Selsiy gradus: -50..150
  const [porshenBosildi, setPorshenBosildi] = useState(false)

  // Holat aniqlash
  const joriyHolat = harorat < 0 ? "qattiq" : harorat <= 100 ? "suyuq" : "gaz"

  const tezkorHolat = (h) => {
    if (h === "qattiq") setHarorat(-20)
    if (h === "suyuq") setHarorat(30)
    if (h === "gaz") setHarorat(130)
    setPorshenBosildi(false)
    tovushChiqar("harorat")
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "holatlar") return
    const canvas = holatCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const CX = W * 0.44
    const CY = H / 2

    const boxW = Math.min(320, W * 0.55)
    const boxH = 240
    const boxX = CX - boxW / 2
    const boxY = CY - boxH / 2 + 10

    // Zarrachalar (Particles) tizimi
    const zarrachalar = []
    const particleRadius = joriyHolat === "gaz" ? 6.5 : 8.5

    if (joriyHolat === "qattiq") {
      // Qattiq jism: Tartibli kristal panjara (Muntazam joylashgan)
      const qator = 6
      const ustun = 8
      const startX = CX - (ustun * 24) / 2 + 12
      const startY = boxY + boxH - (qator * 24) - 15

      for (let r = 0; r < qator; r++) {
        for (let c = 0; c < ustun; c++) {
          zarrachalar.push({
            origX: startX + c * 24 + (r % 2 === 0 ? 0 : 5),
            origY: startY + r * 24,
            x: startX + c * 24,
            y: startY + r * 24,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    } else if (joriyHolat === "suyuq") {
      // Suyuqlik: Idish tubida oquvchan, tartibsiz
      const soni = 46
      for (let i = 0; i < soni; i++) {
        zarrachalar.push({
          x: boxX + 25 + Math.random() * (boxW - 50),
          y: boxY + boxH - 15 - Math.random() * 95,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          r: particleRadius,
        })
      }
    } else {
      // Gaz: Katta tezlikda barcha tomonga uchuvchi zarrachalar
      const soni = 22
      const tezlikKopaytiruvchi = Math.max(3.5, (harorat - 70) / 9)
      for (let i = 0; i < soni; i++) {
        zarrachalar.push({
          x: boxX + 25 + Math.random() * (boxW - 50),
          y: boxY + 25 + Math.random() * (boxH - 50),
          vx: (Math.random() - 0.5) * tezlikKopaytiruvchi,
          vy: (Math.random() - 0.5) * tezlikKopaytiruvchi,
          r: particleRadius,
        })
      }
    }

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Porshen balandligi va bosim hisobi
      let pistonY = boxY - 12
      let bosimAtm = 1.0

      if (porshenBosildi) {
        if (joriyHolat === "gaz") {
          pistonY = boxY + boxH * 0.55 // Gaz 55% ga siqildi
          bosimAtm = 2.4 // Bosim oshdi (Boyl-Mariott)
        } else if (joriyHolat === "suyuq") {
          pistonY = boxY + boxH * 0.48 // Suyuqlik yuzasiga taqaldi
          bosimAtm = 1.05
        } else {
          pistonY = boxY + boxH * 0.35 // Qattiq jismga urildi
          bosimAtm = 1.0
        }
      }

      // KAMERA FON VA ICHKI HUDUD
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)"
      ctx.fillRect(boxX, boxY, boxW, boxH)

      // KAMERA SHISHA DEVORLARI
      ctx.strokeStyle = "rgba(148, 163, 184, 0.85)"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(boxX, boxY - 15)
      ctx.lineTo(boxX, boxY + boxH)
      ctx.lineTo(boxX + boxW, boxY + boxH)
      ctx.lineTo(boxX + boxW, boxY - 15)
      ctx.stroke()

      // TEPADAGI PORSHEN (PISTON)
      ctx.fillStyle = "#475569"
      ctx.fillRect(boxX + 2, pistonY, boxW - 4, 18)
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 2
      ctx.strokeRect(boxX + 2, pistonY, boxW - 4, 18)

      // Porshen sterjeni
      ctx.fillStyle = "#cbd5e1"
      ctx.fillRect(CX - 10, pistonY - 50, 20, 50)
      ctx.fillRect(CX - 35, pistonY - 56, 70, 8)

      // ZARRACHALAR HARAKATI
      ctx.save()
      ctx.beginPath()
      ctx.rect(boxX + 2, pistonY + 18, boxW - 4, boxY + boxH - (pistonY + 18))
      ctx.clip()

      if (joriyHolat === "qattiq") {
        // Qattiq holat: Zarrachalar o'z muvozanat o'rni atrofida titraydi
        const titrashAmplituda = Math.max(0.6, (harorat + 55) / 45)

        // Zarrachalararo bog'lar (kristal panjara chiziqlari)
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)"
        ctx.lineWidth = 1.5
        for (let i = 0; i < zarrachalar.length; i++) {
          for (let j = i + 1; j < zarrachalar.length; j++) {
            const p1 = zarrachalar[i]
            const p2 = zarrachalar[j]
            const d = Math.hypot(p1.x - p2.x, p1.y - p2.y)
            if (d < 30) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }

        ctx.fillStyle = "#38bdf8"
        ctx.strokeStyle = "#0284c7"
        ctx.lineWidth = 2
        zarrachalar.forEach((p) => {
          p.x = p.origX + Math.sin(f * 10 + p.phase) * titrashAmplituda
          p.y = p.origY + Math.cos(f * 10 + p.phase) * titrashAmplituda

          ctx.beginPath()
          ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        })
      } else if (joriyHolat === "suyuq") {
        // Suyuq holat: Zarrachalar bir-birining ustidan siljiydi
        ctx.fillStyle = "#06b6d4"
        ctx.strokeStyle = "#0891b2"
        ctx.lineWidth = 2

        zarrachalar.forEach((p) => {
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.08

          if (p.x - p.r < boxX + 6) {
            p.x = boxX + 6 + p.r
            p.vx *= -1
          }
          if (p.x + p.r > boxX + boxW - 6) {
            p.x = boxX + boxW - 6 - p.r
            p.vx *= -1
          }
          if (p.y + p.r > boxY + boxH - 6) {
            p.y = boxY + boxH - 6 - p.r
            p.vy *= -0.8
          }
          if (p.y - p.r < pistonY + 20) {
            p.y = pistonY + 20 + p.r
            p.vy *= -0.8
          }
          if (p.y - p.r < boxY + boxH - 130) {
            p.vy += 0.2
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        })
      } else {
        // Gaz holat: Zarrachalar butun kamera bo'ylab to'g'ri chiziqli uchadi
        const activeTopY = pistonY + 18
        ctx.fillStyle = "#f59e0b"
        ctx.strokeStyle = "#d97706"
        ctx.lineWidth = 2

        zarrachalar.forEach((p) => {
          p.x += p.vx
          p.y += p.vy

          if (p.x - p.r < boxX + 6) {
            p.x = boxX + 6 + p.r
            p.vx *= -1
          }
          if (p.x + p.r > boxX + boxW - 6) {
            p.x = boxX + boxW - 6 - p.r
            p.vx *= -1
          }
          if (p.y - p.r < activeTopY + 4) {
            p.y = activeTopY + 4 + p.r
            p.vy *= -1
          }
          if (p.y + p.r > boxY + boxH - 6) {
            p.y = boxY + boxH - 6 - p.r
            p.vy *= -1
          }

          ctx.strokeStyle = "rgba(245, 158, 11, 0.4)"
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5)
          ctx.stroke()

          ctx.fillStyle = "#f59e0b"
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        })
      }
      ctx.restore()

      // O'NG TOMONDA ILMIY KO'RSATKICHLAR HUD (PANEL)
      const hudX = boxX + boxW + 20
      const hudY = boxY
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)"
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 1.5
      ctx.strokeRect(hudX, hudY, W - hudX - 15, boxH)
      ctx.fillRect(hudX, hudY, W - hudX - 15, boxH)

      // HUD matnlari
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = "left"
      ctx.fillStyle = "#facc15"
      ctx.fillText("ILMIY PARAMETRLAR:", hudX + 12, hudY + 25)

      // Harorat ko'rsatkichi
      ctx.font = '11px "Times New Roman", serif'
      ctx.fillStyle = "#93c5fd"
      ctx.fillText(`Harorat: ${harorat}°C (${harorat + 273} K)`, hudX + 12, hudY + 50)

      // Manometr bosimi
      ctx.fillStyle = porshenBosildi && joriyHolat === "gaz" ? "#f87171" : "#67e8f9"
      ctx.fillText(`Ichki bosim (P): ${bosimAtm.toFixed(1)} atm`, hudX + 12, hudY + 75)

      // Kinetik energiya
      const ekFoiz = Math.min(100, Math.max(10, Math.round(((harorat + 50) / 200) * 100)))
      ctx.fillStyle = "#a7f3d0"
      ctx.fillText(`Kinetik energiya (Ek): ${ekFoiz}%`, hudX + 12, hudY + 100)

      // Zarrachalararo tortishish kuchi
      ctx.fillStyle = "#fca5a5"
      const kuchMatn = joriyHolat === "qattiq" ? "Juda kuchli" : joriyHolat === "suyuq" ? "O'rtacha" : "Deyarli yo'q"
      ctx.fillText(`Tortishish kuchi: ${kuchMatn}`, hudX + 12, hudY + 125)

      // Shakli va hajmi
      ctx.fillStyle = "#e2e8f0"
      ctx.fillText(`Shakli: ${joriyHolat === "qattiq" ? "Doimiy" : "Idishga bog'liq"}`, hudX + 12, hudY + 155)
      ctx.fillText(`Hajmi: ${joriyHolat === "gaz" ? "Idish hajmi" : "Doimiy hajm"}`, hudX + 12, hudY + 175)
      ctx.fillText(`Siqilish: ${joriyHolat === "gaz" ? "Oson siqiladi" : "Siqilmaydi"}`, hudX + 12, hudY + 195)

      // SARLAVHA MATNI
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = "center"
      if (joriyHolat === "qattiq") {
        ctx.fillStyle = "#38bdf8"
        ctx.fillText(`QATTIQ HOLAT (${harorat}°C): Kristal panjara, zarrachalar o'z o'rnida tebranadi!`, CX, boxY - 35)
      } else if (joriyHolat === "suyuq") {
        ctx.fillStyle = "#22d3ee"
        ctx.fillText(`SUYUQ HOLAT (${harorat}°C): Zarrachalar erkin siljiydi, oquvchan, doimiy hajmga ega.`, CX, boxY - 35)
      } else {
        ctx.fillStyle = "#fbbf24"
        ctx.fillText(`GAZ HOLAT (${harorat}°C): Zarrachalar orasida ulkan bo'shliq bor, erkin uchadi!`, CX, boxY - 35)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, harorat, joriyHolat, porshenBosildi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: DIFFUZIYA QONUNIYATLARI (2 TA ILMIY REJIM):
  // A) Suyuqlikda harorat ta'siri (Sovuq 10°C vs Issiq 80°C)
  // B) Gazlarda diffuziya tezligi va molekulyar massa (Grem naychasi: NH3 va HCl)
  // ═══════════════════════════════════════════════════════════════════════════
  const diffuziyaCanvasRef = useRef(null)
  const [diffRejimTur, setDiffRejimTur] = useState("harorat") // "harorat" | "grem"
  const [diffFaol, setDiffFaol] = useState(false)
  const [diffSovuq, setDiffSovuq] = useState(0) // 0..100%
  const [diffIssiq, setDiffIssiq] = useState(0) // 0..100%
  const [gremProgress, setGremProgress] = useState(0) // 0..100%

  const diffuziyaniBoshlash = () => {
    setDiffSovuq(0)
    setDiffIssiq(0)
    setGremProgress(0)
    setDiffFaol(true)
    tovushChiqar("bosqich")
  }

  useEffect(() => {
    let t
    if (diffFaol) {
      t = setInterval(() => {
        if (diffRejimTur === "harorat") {
          setDiffIssiq((i) => {
            const y = Math.min(100, i + 3.2)
            if (y >= 100) tovushChiqar("tasdiq")
            return y
          })
          setDiffSovuq((s) => Math.min(100, s + 0.95))
        } else {
          // Grem tajribasi (Gazlar diffuziyasi)
          setGremProgress((p) => {
            const y = Math.min(100, p + 2.2)
            if (y >= 100) tovushChiqar("reaksiya")
            return y
          })
        }
      }, 70)
    }
    return () => clearInterval(t)
  }, [diffFaol, diffRejimTur])

  useEffect(() => {
    if (diffRejimTur === "harorat" && diffIssiq >= 100 && diffSovuq >= 100) setDiffFaol(false)
    if (diffRejimTur === "grem" && gremProgress >= 100) setDiffFaol(false)
  }, [diffIssiq, diffSovuq, gremProgress, diffRejimTur])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "diffuziya") return
    const canvas = diffuziyaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height
    const CX = W / 2

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Stol
      ctx.fillStyle = "#09122c"
      ctx.fillRect(0, H - 40, W, 40)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, H - 40)
      ctx.lineTo(W, H - 40)
      ctx.stroke()

      if (diffRejimTur === "harorat") {
        // ─── A-REJIM: SUYUQLIKDA HARORAT TA'SIRI (SOVUQ VS ISSIQ) ───
        const bW = 130
        const bH = 190
        const b1X = W * 0.28 - bW / 2
        const b2X = W * 0.72 - bW / 2
        const bY = H - 55 - bH

        // 1-STAKAN: SOVUQ SUV (10°C)
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)"
        ctx.fillRect(b1X + 4, bY + 30, bW - 8, bH - 34)

        const r1 = (diffSovuq / 100) * (bW * 0.6)
        if (diffSovuq > 0) {
          const grad1 = ctx.createRadialGradient(b1X + bW / 2, bY + bH - 20, 4, b1X + bW / 2, bY + bH - 20, r1 + 10)
          grad1.addColorStop(0, "rgba(168, 85, 247, 0.95)")
          grad1.addColorStop(1, "rgba(168, 85, 247, 0.0)")
          ctx.fillStyle = grad1
          ctx.fillRect(b1X + 4, bY + 30, bW - 8, bH - 34)
        }

        ctx.fillStyle = "#581c87"
        ctx.beginPath()
        ctx.arc(b1X + bW / 2, bY + bH - 12, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 3.5
        ctx.strokeRect(b1X, bY, bW, bH)

        // 2-STAKAN: ISSIQ SUV (80°C)
        ctx.fillStyle = "rgba(249, 115, 22, 0.25)"
        ctx.fillRect(b2X + 4, bY + 30, bW - 8, bH - 34)

        const r2 = (diffIssiq / 100) * (bW * 0.95)
        if (diffIssiq > 0) {
          const grad2 = ctx.createRadialGradient(b2X + bW / 2, bY + bH - 20, 5, b2X + bW / 2, bY + bH - 60, r2 + 25)
          grad2.addColorStop(0, "rgba(168, 85, 247, 0.95)")
          grad2.addColorStop(0.7, "rgba(168, 85, 247, 0.7)")
          grad2.addColorStop(1, "rgba(168, 85, 247, 0.1)")
          ctx.fillStyle = grad2
          ctx.fillRect(b2X + 4, bY + 30, bW - 8, bH - 34)

          for (let k = 0; k < 6; k++) {
            const kx = b2X + 25 + k * 16 + Math.sin(f * 4 + k) * 6
            const ky = bY + bH - 25 - ((f * 45 + k * 20) % (bH - 55))
            ctx.fillStyle = "rgba(147, 51, 234, 0.6)"
            ctx.beginPath()
            ctx.arc(kx, ky, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.fillStyle = "#581c87"
        ctx.beginPath()
        ctx.arc(b2X + bW / 2, bY + bH - 12, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 3.5
        ctx.strokeRect(b2X, bY, bW, bH)

        // Issiq suv bug'lari
        for (let s = 0; s < 5; s++) {
          const sx = b2X + 25 + s * 20 + Math.sin(f * 3 + s) * 8
          const sy = bY + 20 - ((f * 30 + s * 15) % 45)
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)"
          ctx.beginPath()
          ctx.arc(sx, sy, 5.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // KO'RSATKICHLAR
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.textAlign = "center"

        ctx.fillStyle = "#38bdf8"
        ctx.fillText("SOVUQ SUV: 10°C (Sekin kinetika)", b1X + bW / 2, bY - 15)
        ctx.font = '12px "Times New Roman", serif'
        ctx.fillText(`Tarqalish: ${Math.round(diffSovuq)}%`, b1X + bW / 2, bY + bH + 22)

        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillStyle = "#f97316"
        ctx.fillText("ISSIQ SUV: 80°C (Shiddatli kinetika)", b2X + bW / 2, bY - 15)
        ctx.font = '12px "Times New Roman", serif'
        ctx.fillText(`Tarqalish: ${Math.round(diffIssiq)}%`, b2X + bW / 2, bY + bH + 22)

        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillStyle = "#4ade80"
        ctx.fillText("Harorat ortishi bilan zarrachalarning tezligi va diffuziyasi keskin oshadi!", CX, 30)
      } else {
        // ─── B-REJIM: GREM NAYCHASI TAJRIBASI (GAZLAR DIFFUZIYASI VA MASSA) ───
        // Naycha o'lchamlari
        const tW = Math.min(500, W - 60)
        const tH = 50
        const tX = CX - tW / 2
        const tY = H / 2 - 20

        // Shisha naycha korpusi
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)"
        ctx.fillRect(tX, tY, tW, tH)
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 3.5
        ctx.strokeRect(tX, tY, tW, tH)

        // Chapdagi paxta: NH3 (Ammiak, M = 17 g/mol — YENGIL)
        ctx.fillStyle = "#38bdf8"
        ctx.fillRect(tX + 4, tY + 4, 30, tH - 8)
        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.fillText("NH₃", tX + 19, tY + tH / 2 + 4)

        // O'ngdagi paxta: HCl (Xlorid kislota, M = 36.5 g/mol — OG'IR)
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(tX + tW - 34, tY + 4, 30, tH - 8)
        ctx.fillStyle = "#ffffff"
        ctx.fillText("HCl", tX + tW - 19, tY + tH / 2 + 4)

        // Gazlarning bir-biriga qarab diffuziyasi (Grem qonuni: v1/v2 = sqrt(M2/M1) = 1.46)
        // Ya'ni NH3 60% masofani bosib o'tadi, HCl esa 40% masofani!
        const nh3Front = tX + 34 + (gremProgress / 100) * (tW * 0.58)
        const hclFront = tX + tW - 34 - (gremProgress / 100) * (tW * 0.38)

        // NH3 gaz buluti (ko'k)
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)"
        ctx.fillRect(tX + 34, tY + 4, Math.max(0, nh3Front - (tX + 34)), tH - 8)

        // HCl gaz buluti (qizil)
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)"
        ctx.fillRect(hclFront, tY + 4, Math.max(0, (tX + tW - 34) - hclFront), tH - 8)

        // Agar ular to'qnashsa: Oq ammoniy xlorid (NH4Cl) tutun halqasi!
        if (gremProgress >= 95) {
          const ringX = tX + tW * 0.62 // HCl tomoniga yaqinroq
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(ringX - 8, tY + 4, 16, tH - 8)

          ctx.font = 'bold 14px "Times New Roman", serif'
          ctx.fillStyle = "#ffffff"
          ctx.fillText("Oq tutun halqasi: NH₄Cl", ringX, tY - 15)
        }

        // MA'LUMOT MATNLARI
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = "left"
        ctx.fillStyle = "#38bdf8"
        ctx.fillText("Yengil gaz: NH₃ (17 g/mol)", tX, tY + tH + 25)
        ctx.font = '11px "Times New Roman", serif'
        ctx.fillText("Tezroq harakatlanadi (1.5x tez)", tX, tY + tH + 42)

        ctx.textAlign = "right"
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillStyle = "#ef4444"
        ctx.fillText("Og'ir gaz: HCl (36.5 g/mol)", tX + tW, tY + tH + 25)
        ctx.font = '11px "Times New Roman", serif'
        ctx.fillText("Sekinroq harakatlanadi", tX + tW, tY + tH + 42)

        ctx.textAlign = "center"
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillStyle = "#4ade80"
        ctx.fillText("Grem Qonuni: Yengil gazlar og'ir gazlarga qaraganda tezroq diffuziyalanadi!", CX, 30)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, diffRejimTur, diffFaol, diffSovuq, diffIssiq, gremProgress])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: SHPRITSDAGI SIQILISH VA BO'SHLIQLAR (HAQIQIY FIZIKA)
  // Darslik 16-bet: Gaz, Suyuqlik va Qattiq jism zarrachalari masofasi taqqosi
  // ═══════════════════════════════════════════════════════════════════════════
  const shpritsCanvasRef = useRef(null)
  const [shpritsModda, setShpritsModda] = useState("gaz") // "gaz" | "suv" | "qattiq"
  const [bosimDarajasi, setBosimDarajasi] = useState(0) // 0..100% bosim

  const bosimniOzgartirish = (qiymat) => {
    setBosimDarajasi(qiymat)
    tovushChiqar("porshen")
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "siqilish") return
    const canvas = shpritsCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const CX = W / 2
    const CY = H / 2

    const sW = 280
    const sH = 75
    const sX = CX - sW / 2 - 25
    const sY = CY - sH / 2

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // SIQILISH CHEGARASI HISOBI
      let siqilishFoizi = 0
      if (shpritsModda === "gaz") {
        siqilishFoizi = (bosimDarajasi / 100) * 0.65 // Gaz 65% gacha siqiladi
      } else if (shpritsModda === "suv") {
        siqilishFoizi = (bosimDarajasi / 100) * 0.04 // Suyuqlik deyarli siqilmaydi (4%)
      } else {
        siqilishFoizi = 0 // Qattiq jism umuman siqilmaydi
      }

      const porshenX = sX + sW - 15 - siqilishFoizi * (sW - 50)

      // SHPRITSNING NAYCHASI VA REZINA TIQINI
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(sX - 16, sY + sH / 2 - 10, 16, 20)
      ctx.fillStyle = "#475569"
      ctx.fillRect(sX - 35, sY + sH / 2 - 15, 20, 30) // Mahkam yopilgan qopqoq

      // SHPRITS ICHIDAGI MODDA VA ZARRACHALAR
      ctx.save()
      ctx.beginPath()
      ctx.rect(sX, sY + 4, porshenX - sX, sH - 8)
      ctx.clip()

      if (shpritsModda === "qattiq") {
        // Qattiq jism (Qum/Metall kukun)
        ctx.fillStyle = "rgba(100, 116, 139, 0.45)"
        ctx.fillRect(sX, sY + 4, porshenX - sX, sH - 8)

        for (let x = sX + 12; x < porshenX; x += 15) {
          for (let y = sY + 12; y < sY + sH - 8; y += 15) {
            ctx.fillStyle = "#94a3b8"
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      } else if (shpritsModda === "suv") {
        // Suyuqlik (Suv)
        ctx.fillStyle = "rgba(56, 189, 248, 0.7)"
        ctx.fillRect(sX, sY + 4, porshenX - sX, sH - 8)

        for (let x = sX + 12; x < porshenX; x += 15) {
          for (let y = sY + 12; y < sY + sH - 8; y += 15) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
            ctx.beginPath()
            ctx.arc(x + Math.sin(f + x) * 1.5, y + Math.cos(f + y) * 1.5, 4.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      } else {
        // Gaz (Havo zarrachalari)
        ctx.fillStyle = "rgba(251, 191, 36, 0.15)"
        ctx.fillRect(sX, sY + 4, porshenX - sX, sH - 8)

        const zSoni = 20
        for (let i = 0; i < zSoni; i++) {
          const gx = sX + 15 + ((i * 35 + f * 45) % Math.max(10, porshenX - sX - 25))
          const gy = sY + 14 + Math.sin(f * 2 + i) * 16 + (i % 3) * 14
          ctx.fillStyle = "#f59e0b"
          ctx.beginPath()
          ctx.arc(gx, gy, 5.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()

      // SHPRITS SHISHA/PLASTIK KORPUSI
      ctx.strokeStyle = "rgba(241, 245, 249, 0.9)"
      ctx.lineWidth = 3.5
      ctx.strokeRect(sX, sY, sW, sH)

      // Hajm shkalasi (10, 20, 30, 40, 50 ml)
      ctx.fillStyle = "rgba(241, 245, 249, 0.75)"
      ctx.font = '10px "Times New Roman", serif'
      for (let ml = 10; ml <= 50; ml += 10) {
        const mx = sX + (ml / 50) * (sW - 40)
        ctx.fillRect(mx, sY + 4, 2, 14)
        ctx.fillText(`${ml}`, mx - 6, sY + 30)
      }

      // PORSHEN
      ctx.fillStyle = "#0284c7"
      ctx.fillRect(porshenX - 10, sY + 4, 10, sH - 8)
      ctx.fillStyle = "#cbd5e1"
      ctx.fillRect(porshenX, sY + sH / 2 - 8, 90, 16)
      ctx.fillRect(porshenX + 90, sY + sH / 2 - 25, 12, 50)

      // KUCH VA NATIJA XULOSASI
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = "center"

      if (shpritsModda === "gaz") {
        if (bosimDarajasi > 20) {
          ctx.fillStyle = "#4ade80"
          ctx.fillText(`GAZ OSON SIQILDI! Hajm 50 ml dan ${Math.round(50 - siqilishFoizi * 50)} ml ga tushdi.`, CX, sY - 30)
        } else {
          ctx.fillStyle = "#facc15"
          ctx.fillText("Gazli shprits: Slayderni surib kuch bilan bosing va siqilishni ko'ring", CX, sY - 30)
        }
      } else if (shpritsModda === "suv") {
        ctx.fillStyle = "#ef4444"
        ctx.fillText("SUYUQLIK SIQILMAYDI! Zarrachalar allaqachon bir-biriga juda zich tegib turibdi.", CX, sY - 30)
      } else {
        ctx.fillStyle = "#ef4444"
        ctx.fillText("QATTIQ JISM SIQILMAYDI! Zarrachalar mustahkam kristal panjarada bog'langan.", CX, sY - 30)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, shpritsModda, bosimDarajasi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: BROUN HARAKATI VA ZARRACHALAR TO'QNASHUVI (MIKROSKOP)
  // Eynshteyn va Perrin nazariyasi: Zarrachalar o'lchami va harorat ta'siri
  // ═══════════════════════════════════════════════════════════════════════════
  const brounCanvasRef = useRef(null)
  const [molekulalarKorinsin, setMolekulalarKorinsin] = useState(true)
  const [brounHarorat, setBrounHarorat] = useState(30) // 10..90°C

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "broun") return
    const canvas = brounCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const CX = W / 2
    const CY = H / 2

    let pX = CX
    let pY = CY
    const izNuqtalari = []

    // Mayda ko'rinmas suv molekulalari
    const molekulalar = []
    const mTezlik = Math.max(2, brounHarorat / 15)
    for (let i = 0; i < 40; i++) {
      molekulalar.push({
        x: Math.random() * (W - 60) + 30,
        y: Math.random() * (H - 60) + 30,
        vx: (Math.random() - 0.5) * mTezlik * 2,
        vy: (Math.random() - 0.5) * mTezlik * 2,
      })
    }

    const render = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Mikroskop okulyari doirasi
      ctx.strokeStyle = "rgba(59, 130, 246, 0.45)"
      ctx.lineWidth = 3
      ctx.strokeRect(30, 20, W - 60, H - 40)

      // Suv molekulalarining harakati va to'qnashuvlari
      molekulalar.forEach((m) => {
        m.x += m.vx
        m.y += m.vy

        if (m.x < 35 || m.x > W - 35) m.vx *= -1
        if (m.y < 25 || m.y > H - 25) m.vy *= -1

        // Katta chang zarrachasiga to'qnashuv
        const dx = m.x - pX
        const dy = m.y - pY
        const masofa = Math.sqrt(dx * dx + dy * dy)
        if (masofa < 26) {
          pX += m.vx * 0.45
          pY += m.vy * 0.45
          m.vx *= -1
          m.vy *= -1
        }

        if (molekulalarKorinsin) {
          ctx.fillStyle = "rgba(56, 189, 248, 0.7)"
          ctx.beginPath()
          ctx.arc(m.x, m.y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      pX = Math.max(60, Math.min(W - 60, pX))
      pY = Math.max(50, Math.min(H - 50, pY))

      // Zigzag iz chizig'i
      izNuqtalari.push({ x: pX, y: pY })
      if (izNuqtalari.length > 60) izNuqtalari.shift()

      ctx.strokeStyle = "rgba(234, 179, 8, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()
      izNuqtalari.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      })
      ctx.stroke()

      // Katta Broun zarrachasi (Gulchangi)
      ctx.fillStyle = "#eab308"
      ctx.beginPath()
      ctx.arc(pX, pY, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#ca8a04"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillStyle = "#eab308"
      ctx.textAlign = "center"
      ctx.fillText(
        molekulalarKorinsin
          ? "Ko'rinmas suv molekulalari chang zarrachasiga to'xtovsiz tartibsiz zarba berib uni itaradi!"
          : "Robert Broun (1827) ko'rgan manzara: Chang zarrachasi go'yo tirikdek o'z-o'zidan sakramoqda!",
        W / 2,
        H - 25
      )

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, molekulalarKorinsin, brounHarorat])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "ZARRACHALAR SARALOVCHISI: ILMIY TAQQOSLASH"
  // ═══════════════════════════════════════════════════════════════════════════
  const xususiyatlar = [
    { id: 1, matn: "Doimiy shakl va doimiy hajmga ega, siqilmaydi", javob: "qattiq" },
    { id: 2, matn: "Zarrachalari o'z muvozanat vaziyati atrofida faqat tebranadi", javob: "qattiq" },
    { id: 3, matn: "Oson siqiladi, zarrachalar orasida ulkan bo'shliq bor", javob: "gaz" },
    { id: 4, matn: "Idish shaklini oladi, lekin hajmi o'zgarmaydi, deyarli siqilmaydi", javob: "suyuq" },
    { id: 5, matn: "Zarrachalar katta tezlikda barcha tomonga erkin uchadi", javob: "gaz" },
    { id: 6, matn: "Zarrachalari bir-birining ustidan sirg'alib oqadi", javob: "suyuq" },
    { id: 7, matn: "Molekulalararo tortishish kuchi o'ta kuchli", javob: "qattiq" },
    { id: 8, matn: "Diffuziya tezligi eng yuqori bo'lgan agregat holat", javob: "gaz" },
  ]

  const [xususiyatIndeks, setXususiyatIndeks] = useState(0)
  const [saralashBall, setSaralashBall] = useState(0)
  const [saralashTugadi, setSaralashTugadi] = useState(false)
  const [songiJavobTogri, setSongiJavobTogri] = useState(null)

  const saralashTanlash = (holat) => {
    if (songiJavobTogri !== null) return
    const togri = holat === xususiyatlar[xususiyatIndeks].javob
    setSongiJavobTogri(togri)

    if (togri) {
      setSaralashBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }

    setTimeout(() => {
      if (xususiyatIndeks < xususiyatlar.length - 1) {
        setXususiyatIndeks((i) => i + 1)
        setSongiJavobTogri(null)
      } else {
        setSaralashTugadi(true)
        tovushChiqar("zafar")
      }
    }, 900)
  }

  const saralashQayta = () => {
    setXususiyatIndeks(0)
    setSaralashBall(0)
    setSongiJavobTogri(null)
    setSaralashTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "KINETIKA VA DIFFUZIYA ILMIY VIKTORINASI"
  // ═══════════════════════════════════════════════════════════════════════════
  const diffuziyaSavollari = [
    {
      id: 1,
      savol: "Issiq choyda shakar nima uchun sovuq suvga qaraganda tezroq eriydi?",
      variantlar: [
        "Harorat yuqori bo'lganda suv molekulalarining o'rtacha tezligi va to'qnashuvlari ortadi",
        "Issiq suvda shakar og'irlashadi",
        "Sovuq suv shakarni muzlatib qo'yadi",
        "Choy stakani qalin bo'lgani uchun",
      ],
      togri: "Harorat yuqori bo'lganda suv molekulalarining o'rtacha tezligi va to'qnashuvlari ortadi",
    },
    {
      id: 2,
      savol: "Grem naychasida yengil NH3 (17 g/mol) va og'ir HCl (36.5 g/mol) to'qnashganda oq halqa qayerda hosil bo'ladi?",
      variantlar: [
        "Og'ir HCl paxtasiga yaqinroq (chunki NH3 yengil bo'lib tezroq uchadi)",
        "Aynan qoq o'rtada",
        "Yengil NH3 paxtasiga yaqinroq",
        "Naychaning tashqarisida",
      ],
      togri: "Og'ir HCl paxtasiga yaqinroq (chunki NH3 yengil bo'lib tezroq uchadi)",
    },
    {
      id: 3,
      savol: "Gazlarni shpritsda oson siqish mumkinligining tub sababi nima?",
      variantlar: [
        "Gaz zarrachalari orasidagi masofa zarracha o'lchamidan 10-30 barobar katta",
        "Gaz zarrachalari bosim ostida yo'q bo'lib ketadi",
        "Gazning massasi nolga teng",
        "Porshen gazni eritib suyuqlikka aylantiradi",
      ],
      togri: "Gaz zarrachalari orasidagi masofa zarracha o'lchamidan 10-30 barobar katta",
    },
    {
      id: 4,
      savol: "Broun harakatining kashf etilishi fanda nimani uzil-kesil isbotlab berdi?",
      variantlar: [
        "Barcha moddalar to'xtovsiz tartibsiz harakatdagi atom va molekulalardan tuzilganini",
        "Gulchangi tirik jonzot ekanligini",
        "Mikroskop linzalari noto'g'ri ko'rsatishini",
        "Suvda hech qanday zarracha yo'qligini",
      ],
      togri: "Barcha moddalar to'xtovsiz tartibsiz harakatdagi atom va molekulalardan tuzilganini",
    },
  ]

  const [diffIndeks, setDiffIndeks] = useState(0)
  const [tanlanganDiff, setTanlanganDiff] = useState(null)
  const [diffBall, setDiffBall] = useState(0)
  const [diffTugadi, setDiffTugadi] = useState(false)

  const diffJavobTanlash = (v) => {
    if (tanlanganDiff !== null) return
    setTanlanganDiff(v)
    if (v === diffuziyaSavollari[diffIndeks].togri) {
      setDiffBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiDiff = () => {
    if (diffIndeks < diffuziyaSavollari.length - 1) {
      setDiffIndeks((i) => i + 1)
      setTanlanganDiff(null)
      tovushChiqar("bosqich")
    } else {
      setDiffTugadi(true)
      tovushChiqar("zafar")
    }
  }

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
      {/* ─── SMART DOSKA UNIFIKATSIYALANGAN YUQORI NAVIGATSIYASI ─── */}
      <SmartDoskaNavigatsiya
        mavzuRaqam="2.1"
        mavzuNom="Moddaning tuzilishi"
        bobNom="2-bob. Modda xossalari"
        sahifa={15}
        oldingiRaqam="1.5"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          0-BO'LIM: O'TGAN DARSNI TAKRORLASH (1.5-MAVZU)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="1.5"
          oldingiNom="Kimyo laboratoriyasida foydalaniladigan jihozlar"
          savollar={takrorlashSavollari1_5}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1-BO'LIM: 4 TA KO'RGAZMALI VA INTERAKTIV ANIMATSIYA
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* 6 TA ANIMATSIYA MENYUSI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setAnimRejim("holatlar")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "holatlar"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="atom" olcham={16} />
              <span>1. 3 ta Agregat holat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("diffuziya")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "diffuziya"
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 ring-2 ring-purple-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
              }`}
            >
              <Ikon nom="tolqin" olcham={16} />
              <span>2. Diffuziya</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("siqilish")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "siqilish"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="vaqt" olcham={16} />
              <span>3. Shpritsda siqilish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("broun")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "broun"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="kuzatuv" olcham={16} />
              <span>4. Broun harakati</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k5")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "k5"
                  ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-amber-400/50"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>5. 50ml + 50ml = 97ml</span>
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
              <Ikon nom="kristall" olcham={16} />
              <span>6. Kristall panjara</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              1-ANIMATSIYA: MODDANING 3 TA AGREGAT HOLATI VA KINETIK ZARRACHALAR
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "holatlar" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={holatCanvasRef} className="w-full h-full block" />
              </div>

              {/* HARORAT VA PORSHEN BOSHQARUVI */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-3">
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  {/* 3 TA TEZKOR HOLAT TUGMASI */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => tezkorHolat("qattiq")}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        joriyHolat === "qattiq"
                          ? "border-sky-400 bg-sky-500/30 text-sky-200 ring-2 ring-sky-400/40"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      Qattiq (-20°C)
                    </button>

                    <button
                      type="button"
                      onClick={() => tezkorHolat("suyuq")}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        joriyHolat === "suyuq"
                          ? "border-cyan-400 bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-400/40"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      Suyuq (30°C)
                    </button>

                    <button
                      type="button"
                      onClick={() => tezkorHolat("gaz")}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        joriyHolat === "gaz"
                          ? "border-amber-400 bg-amber-500/30 text-amber-200 ring-2 ring-amber-400/40"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      Gaz (130°C)
                    </button>
                  </div>
                </div>

                {/* HARORAT SLAYDERI VA PORSHENNI BOSISH */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-blue-900/50">
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <span className="text-xs font-bold text-blue-300 shrink-0">Harorat: {harorat}°C</span>
                    <input
                      type="range"
                      min="-50"
                      max="150"
                      value={harorat}
                      onChange={(e) => {
                        setHarorat(Number(e.target.value))
                        setPorshenBosildi(false)
                      }}
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPorshenBosildi(!porshenBosildi)
                      tovushChiqar("porshen")
                    }}
                    className={`px-5 py-2 rounded-xl border text-xs font-bold transition shadow-md ${
                      porshenBosildi
                        ? "border-emerald-400 bg-emerald-500/30 text-emerald-200"
                        : "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {porshenBosildi ? "Porshenni bo'shatish" : "Porshen bilan siqish (Tekshirish)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              2-ANIMATSIYA: DIFFUZIYA VA GREM QONUNI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "diffuziya" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={diffuziyaCanvasRef} className="w-full h-full block" />
              </div>

              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                {/* 2 TA ILMIY TAJRIBA REJIMI */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiffRejimTur("harorat")
                      setDiffFaol(false)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      diffRejimTur === "harorat"
                        ? "border-purple-400 bg-purple-500/25 text-purple-300 ring-2 ring-purple-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    1. Suyuqlikda Harorat ta&apos;siri (10°C vs 80°C)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDiffRejimTur("grem")
                      setDiffFaol(false)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      diffRejimTur === "grem"
                        ? "border-cyan-400 bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    2. Gazlarda Grem Qonuni (NH₃ va HCl)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={diffuziyaniBoshlash}
                  disabled={diffFaol}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg hover:scale-102"
                >
                  <Ikon nom="play" olcham={16} />
                  <span>{diffFaol ? "Diffuziya jarayoni ketmoqda..." : "Tajribani boshlash"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              3-ANIMATSIYA: SHPRITSDAGI SIQILISH TAJRIBASI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "siqilish" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={shpritsCanvasRef} className="w-full h-full block" />
              </div>

              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* MODDANI TANLASH */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShpritsModda("gaz")
                        setBosimDarajasi(0)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        shpritsModda === "gaz"
                          ? "border-amber-400 bg-amber-500/25 text-amber-200 ring-2 ring-amber-400/30"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      1. Gaz (Havo)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShpritsModda("suv")
                        setBosimDarajasi(0)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        shpritsModda === "suv"
                          ? "border-cyan-400 bg-cyan-500/25 text-cyan-200 ring-2 ring-cyan-400/30"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      2. Suyuqlik (Suv)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShpritsModda("qattiq")
                        setBosimDarajasi(0)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        shpritsModda === "qattiq"
                          ? "border-slate-400 bg-slate-500/25 text-slate-200 ring-2 ring-slate-400/30"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      3. Qattiq jism (Qum)
                    </button>
                  </div>

                  {/* TEZKOR KUCH BOSISH TUGMASI */}
                  <button
                    type="button"
                    onClick={() => bosimniOzgartirish(bosimDarajasi > 0 ? 0 : 85)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg"
                  >
                    {bosimDarajasi > 0 ? "Porshenni bo'shatish" : "Porshenni to'liq bosish"}
                  </button>
                </div>

                {/* KUCH SLAYDERI */}
                <div className="flex items-center gap-3 pt-2 border-t border-blue-900/50">
                  <span className="text-xs font-bold text-blue-300 shrink-0">
                    Qo&apos;l bosim kuchi: {bosimDarajasi}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bosimDarajasi}
                    onChange={(e) => bosimniOzgartirish(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              4-ANIMATSIYA: BROUN HARAKATI (MIKROSKOP)
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "broun" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={brounCanvasRef} className="w-full h-full block" />
              </div>

              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMolekulalarKorinsin(!molekulalarKorinsin)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${
                      molekulalarKorinsin
                        ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                        : "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                    }`}
                  >
                    {molekulalarKorinsin ? "Suv molekulalarini yashirish (Broun ko'rganidek)" : "Suv molekulalarini ko'rsatish (Siri)"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {(animRejim === "k5" || animRejim === "k6") && (
            <QoshimchaKorgazma mavzu="2.1" rejim={animRejim} />
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          2-BO'LIM: SMART DOSKA O'YINLARI (4 TA O'YIN)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "oyinlar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setOyinRejim("saralash")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "saralash"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="atom" olcham={18} />
              <span>1. Zarrachalar Saralash</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("diffuziya_oyini")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "diffuziya_oyini"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="tolqin" olcham={18} />
              <span>2. Diffuziya Viktorinasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o3")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o3"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="tajriba" olcham={18} />
              <span>3. Zarrachalar Sinovi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o4")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o4"
                  ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-amber-400/50"
              }`}
            >
              <Ikon nom="kubok" olcham={18} />
              <span>4. Jamoalar Dueli (1 vs 2)</span>
            </button>
          </div>

          {/* ─── 1-O'YIN: ZARRACHALAR SARALOVCHISI ─── */}
          {oyinRejim === "saralash" && (
            <div className="space-y-4">
              {!saralashTugadi ? (
                <>
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                        Xususiyat {xususiyatIndeks + 1} / {xususiyatlar.length}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                        &quot;{xususiyatlar[xususiyatIndeks].matn}&quot;
                      </h3>
                      <p className="text-xs text-blue-200">
                        Bu xususiyat moddaning qaysi agregat holatiga tegishli?
                      </p>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                      Ball: {saralashBall}
                    </div>
                  </div>

                  {/* 3 TA HOLAT SAVATI (Qattiq, Suyuq, Gaz) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => saralashTanlash("qattiq")}
                      className="p-5 rounded-2xl border border-sky-500/40 bg-sky-950/30 hover:bg-sky-900/40 text-center transition flex flex-col items-center gap-2 active:scale-98 shadow-lg"
                    >
                      <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300">
                        <Ikon nom="kristall" olcham={28} />
                      </div>
                      <span className="text-base font-bold text-sky-200">Qattiq holat</span>
                      <span className="text-[11px] text-sky-300/80">Zarrachalar zich, tartibli</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => saralashTanlash("suyuq")}
                      className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-center transition flex flex-col items-center gap-2 active:scale-98 shadow-lg"
                    >
                      <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300">
                        <Ikon nom="tomchi" olcham={28} />
                      </div>
                      <span className="text-base font-bold text-cyan-200">Suyuq holat</span>
                      <span className="text-[11px] text-cyan-300/80">Zarrachalar siljiydi, oquvchan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => saralashTanlash("gaz")}
                      className="p-5 rounded-2xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-center transition flex flex-col items-center gap-2 active:scale-98 shadow-lg"
                    >
                      <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300">
                        <Ikon nom="tolqin" olcham={28} />
                      </div>
                      <span className="text-base font-bold text-amber-200">Gaz holat</span>
                      <span className="text-[11px] text-amber-300/80">Zarrachalar erkin, oson siqiladi</span>
                    </button>
                  </div>

                  {songiJavobTogri !== null && (
                    <div className="text-center pt-2">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                        songiJavobTogri ? "text-emerald-300 bg-emerald-950/80 border border-emerald-500/50" : "text-red-300 bg-red-950/80 border border-red-500/50"
                      }`}>
                        {songiJavobTogri ? "To'g'ri topildi!" : "Noto'g'ri tanlov!"}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                    <Ikon nom="kubok" olcham={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Saralash yakunlandi!</h3>
                  <p className="text-base text-emerald-300 font-bold">
                    To&apos;g&apos;ri javoblar: {saralashBall} / {xususiyatlar.length}
                  </p>
                  <p className="text-xs text-blue-200/90 max-w-md mx-auto">
                    Siz moddaning qattiq, suyuq va gaz holatidagi zarrachalar harakati hamda xususiyatlarini ajoyib o&apos;zlashtirdingiz!
                  </p>
                  <button
                    type="button"
                    onClick={saralashQayta}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl"
                  >
                    Qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 2-O'YIN: DIFFUZIYA VA KINETIKA VIKTORINASI ─── */}
          {oyinRejim === "diffuziya_oyini" && (
            <div className="space-y-4">
              {!diffTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                        Savol {diffIndeks + 1} / {diffuziyaSavollari.length}
                      </span>
                      <h4 className="text-xs sm:text-sm text-blue-100 font-bold pt-1">
                        {diffuziyaSavollari[diffIndeks].savol}
                      </h4>
                    </div>

                    <div className="px-3 py-1 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold text-xs">
                      Ball: {diffBall}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {diffuziyaSavollari[diffIndeks].variantlar.map((v) => {
                      const togri = v === diffuziyaSavollari[diffIndeks].togri
                      const tanlandi = tanlanganDiff === v
                      let stil = "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"

                      if (tanlanganDiff !== null) {
                        if (togri) {
                          stil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40"
                        } else if (tanlandi && !togri) {
                          stil = "border-red-500 bg-red-950/60 text-red-200"
                        }
                      }

                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => diffJavobTanlash(v)}
                          className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-md ${stil}`}
                        >
                          <span>{v}</span>
                          {tanlanganDiff !== null && togri && (
                            <Ikon nom="tasdiq" olcham={18} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganDiff !== null && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={keyingiDiff}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg"
                      >
                        {diffIndeks < diffuziyaSavollari.length - 1 ? "Keyingi savolga o'tish" : "Natijani ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                    <Ikon nom="kubok" olcham={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Viktorina yakunlandi!</h3>
                  <p className="text-base text-emerald-300 font-bold">
                    To&apos;g&apos;ri javoblar: {diffBall} / {diffuziyaSavollari.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiffIndeks(0)
                      setTanlanganDiff(null)
                      setDiffBall(0)
                      setDiffTugadi(false)
                    }}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl"
                  >
                    Qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {(oyinRejim === "o3" || oyinRejim === "o4") && (
            <QoshimchaOyin mavzu="2.1" rejim={oyinRejim} />
          )}
        </div>
      )}
    </div>
  )
}
