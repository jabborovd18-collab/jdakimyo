"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import {
  SmartDoskaNavigatsiya,
  DoskadaTushuntirishKartasi,
} from "@/components/maktab/SmartDoskaYordamchi"

// Ovoz effekti (Brauzer Web Audio API orqali sof generatsiya)
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
    if (turi === "togri") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (turi === "xato") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.linearRampToValueAtTime(140, now + 0.22)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (turi === "paq") {
      osc.type = "square"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.18)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      osc.start(now)
      osc.stop(now + 0.18)
    }
  } catch {
    // Brauzer audio huquqini kutishi mumkin
  }
}

export default function Mavzu1_1() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar (1..4)
  const [animRejim, setAnimRejim] = useState("mikro") // "mikro" | "rang" | "gaz" | "fizik_kimyoviy"

  // O'yinlar (1..2)
  const [oyinRejim, setOyinRejim] = useState("saralash") // "saralash" | "belgilar"

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
  // 1-ANIMATSIYA: MIKROSKOPIK ATOMLAR VA ZANGLASH (Fe + O2 + H2O)
  // ═══════════════════════════════════════════════════════════════════════════
  const mikroCanvasRef = useRef(null)
  const [harorat, setHarorat] = useState(25)
  const [namlik, setNamlik] = useState(55)
  const [mikroReaksiya, setMikroReaksiya] = useState(false)
  const [zangFoiz, setZangFoiz] = useState(0)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "mikro") return
    const canvas = mikroCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const feRows = 3
    const feCols = Math.max(8, Math.floor(W / 52))
    const startY = H - 120
    const feAtoms = []

    for (let r = 0; r < feRows; r++) {
      for (let c = 0; c < feCols; c++) {
        feAtoms.push({
          baseX: 35 + c * 48 + (r % 2 === 0 ? 0 : 24),
          baseY: startY + r * 38,
          x: 0,
          y: 0,
          radius: 15,
          zangDarajasi: 0,
          tebranishFazasi: Math.random() * Math.PI * 2,
        })
      }
    }

    const gazlar = []
    const gazSoni = Math.floor(18 + (namlik / 100) * 22)
    for (let i = 0; i < gazSoni; i++) {
      gazlar.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (startY - 60) + 30,
        vx: (Math.random() - 0.5) * (1.2 + harorat / 30),
        vy: (Math.random() - 0.5) * (1.2 + harorat / 30),
        burchak: Math.random() * Math.PI * 2,
        vBurchak: (Math.random() - 0.5) * 0.08,
        turi: i % 2 === 0 ? "O2" : "H2O",
        radius: i % 2 === 0 ? 10 : 8,
        birikkan: false,
      })
    }

    const uchqunlar = []

    const handleCanvasClick = (e) => {
      const clickRect = canvas.getBoundingClientRect()
      const clickX = e.clientX - clickRect.left
      const clickY = e.clientY - clickRect.top

      for (let k = 0; k < 5; k++) {
        gazlar.push({
          x: clickX + (Math.random() - 0.5) * 20,
          y: clickY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5,
          burchak: Math.random() * Math.PI * 2,
          vBurchak: 0.1,
          turi: Math.random() > 0.4 ? "O2" : "H2O",
          radius: 9,
          birikkan: false,
        })
      }
    }
    canvas.addEventListener("pointerdown", handleCanvasClick)

    const render = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)"
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }

      const speedMult = 0.6 + harorat / 35

      for (let i = 0; i < feAtoms.length; i++) {
        const a = feAtoms[i]
        const amp = 0.5 + (harorat / 100) * 4.5
        a.tebranishFazasi += 0.1 + (harorat / 100) * 0.15
        a.x = a.baseX + Math.sin(a.tebranishFazasi) * amp
        a.y = a.baseY + Math.cos(a.tebranishFazasi * 1.3) * amp
      }

      ctx.strokeStyle = "rgba(148, 163, 184, 0.28)"
      ctx.lineWidth = 2
      for (let i = 0; i < feAtoms.length; i++) {
        for (let j = i + 1; j < feAtoms.length; j++) {
          const dx = feAtoms[i].x - feAtoms[j].x
          const dy = feAtoms[i].y - feAtoms[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 56) {
            ctx.beginPath()
            ctx.moveTo(feAtoms[i].x, feAtoms[i].y)
            ctx.lineTo(feAtoms[j].x, feAtoms[j].y)
            ctx.stroke()
          }
        }
      }

      let zangSoni = 0
      for (let i = 0; i < feAtoms.length; i++) {
        const a = feAtoms[i]
        if (a.zangDarajasi > 0.5) zangSoni++

        const grad = ctx.createRadialGradient(
          a.x - a.radius * 0.3,
          a.y - a.radius * 0.3,
          2,
          a.x,
          a.y,
          a.radius
        )

        if (a.zangDarajasi > 0) {
          grad.addColorStop(0, "#fb923c")
          grad.addColorStop(0.7, "#c2410c")
          grad.addColorStop(1, "#7c2d12")
        } else {
          grad.addColorStop(0, "#f8fafc")
          grad.addColorStop(0.5, "#94a3b8")
          grad.addColorStop(1, "#475569")
        }

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.shadowColor = a.zangDarajasi > 0 ? "rgba(234, 88, 12, 0.4)" : "rgba(148, 163, 184, 0.2)"
        ctx.shadowBlur = a.zangDarajasi > 0 ? 8 : 4
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.strokeStyle = a.zangDarajasi > 0 ? "#ea580c" : "#cbd5e1"
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = a.zangDarajasi > 0 ? "#fef08a" : "#0f172a"
        ctx.font = "bold 11px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(a.zangDarajasi > 0 ? "Fe³⁺" : "Fe", a.x, a.y)
      }

      setZangFoiz(Math.round((zangSoni / feAtoms.length) * 100))

      for (let i = 0; i < gazlar.length; i++) {
        const g = gazlar[i]
        if (!g.birikkan) {
          g.x += g.vx * speedMult
          g.y += g.vy * speedMult
          g.burchak += g.vBurchak

          if (g.x < 15 || g.x > W - 15) g.vx *= -1
          if (g.y < 20) g.vy *= -1
          if (g.y > startY - 10) g.vy *= -1

          if (mikroReaksiya) {
            for (let j = 0; j < feAtoms.length; j++) {
              const a = feAtoms[j]
              if (a.zangDarajasi < 1) {
                const dx = g.x - a.x
                const dy = g.y - a.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < a.radius + g.radius + 4) {
                  a.zangDarajasi = 1
                  g.birikkan = true
                  g.x = a.x + (Math.random() - 0.5) * 8
                  g.y = a.y - a.radius - 4

                  for (let u = 0; u < 6; u++) {
                    uchqunlar.push({
                      x: g.x,
                      y: g.y,
                      vx: (Math.random() - 0.5) * 4,
                      vy: (Math.random() - 0.5) * 4,
                      alpha: 1,
                    })
                  }
                  break
                }
              }
            }
          }
        }

        ctx.save()
        ctx.translate(g.x, g.y)
        ctx.rotate(g.burchak)

        if (g.turi === "O2") {
          ctx.fillStyle = g.birikkan ? "#991b1b" : "#ef4444"
          ctx.beginPath()
          ctx.arc(-5, 0, 6, 0, Math.PI * 2)
          ctx.arc(5, 0, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("O₂", 0, 0)
        } else {
          ctx.fillStyle = g.birikkan ? "#0369a1" : "#38bdf8"
          ctx.beginPath()
          ctx.arc(0, 0, 6, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(-5, -4, 3.5, 0, Math.PI * 2)
          ctx.arc(5, -4, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      for (let i = uchqunlar.length - 1; i >= 0; i--) {
        const u = uchqunlar[i]
        u.x += u.vx
        u.y += u.vy
        u.alpha -= 0.04
        if (u.alpha <= 0) {
          uchqunlar.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(u.x, u.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 158, 11, ${u.alpha})`
        ctx.fill()
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("pointerdown", handleCanvasClick)
    }
  }, [asosiyBolim, animRejim, harorat, namlik, mikroReaksiya])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: KOLBADA RANG O'ZGARISHI VA DIFFUZIYA
  // ═══════════════════════════════════════════════════════════════════════════
  const rangCanvasRef = useRef(null)
  const [faolReaktiv, setFaolReaktiv] = useState(null)
  const [girdobFaol, setGirdobFaol] = useState(false)
  const [suvRangi, setSuvRangi] = useState({ r: 56, g: 189, b: 248, a: 0.12 })
  const tomchilarRef = useRef([])
  const zarralarRef = useRef([])

  const kolbaReaktivlari = {
    fenolftalein: {
      nom: "Fenolftalein + Ishqor (NaOH)",
      formula: "Shaffof suv + Ishqor → To'q malina pushti rang!",
      rang: { r: 236, g: 72, b: 153 },
      tushuntirish: "Ko'z oldingizda shaffof eritma yorqin malina pushtiga aylandi. Bu — RANG O'ZGARISHI!",
    },
    mis: {
      nom: "Mis kuporosi (CuSO₄)",
      formula: "Oqish suv + Mis sulfat → Moviy feruza rang!",
      rang: { r: 14, g: 165, b: 233 },
      tushuntirish: "Kristallar erib, butun suvga feruza moviy rang tarqaldi. Bu — DIFFUZIYA HODISASI!",
    },
    xromat: {
      nom: "Kaliy xromat (K₂CrO₄)",
      formula: "Shaffof suv + Xromat tuzi → Oltinrang sariq!",
      rang: { r: 245, g: 158, b: 11 },
      tushuntirish: "Sariq modda molekulalari butun kolbani quyoshdek tillarangga bo'yadi!",
    },
  }

  const reaktivQuyish = (tur) => {
    setFaolReaktiv(tur)
    const cfg = kolbaReaktivlari[tur]
    tovushChiqar("togri")

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        tomchilarRef.current.push({
          y: 70,
          vy: 3.5 + i * 0.4,
          r: cfg.rang.r,
          g: cfg.rang.g,
          b: cfg.rang.b,
        })
      }, i * 160)
    }
  }

  const kolbaniYuvish = () => {
    tomchilarRef.current = []
    zarralarRef.current = []
    setFaolReaktiv(null)
    setGirdobFaol(false)
    setSuvRangi({ r: 56, g: 189, b: 248, a: 0.12 })
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "rang") return
    const canvas = rangCanvasRef.current
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
    const kolbaAsosiY = H - 50
    const kolbaAsosiW = Math.min(230, W * 0.44)
    const kolbaBoyniY = 85
    const kolbaBoyniW = 54
    const suyuqlikY = kolbaBoyniY + 85

    let burchak = 0

    const render = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const tomchilar = tomchilarRef.current
      for (let i = tomchilar.length - 1; i >= 0; i--) {
        const t = tomchilar[i]
        t.y += t.vy
        t.vy += 0.35

        ctx.beginPath()
        ctx.arc(CX, t.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${t.r}, ${t.g}, ${t.b})`
        ctx.shadowColor = `rgba(${t.r}, ${t.g}, ${t.b}, 0.9)`
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        if (t.y >= suyuqlikY) {
          tomchilar.splice(i, 1)
          setSuvRangi({ r: t.r, g: t.g, b: t.b, a: 0.55 })

          for (let k = 0; k < 60; k++) {
            zarralarRef.current.push({
              x: CX + (Math.random() - 0.5) * 14,
              y: suyuqlikY + Math.random() * 8,
              vx: (Math.random() - 0.5) * 2.5,
              vy: Math.random() * 2.2 + 0.6,
              r: t.r,
              g: t.g,
              b: t.b,
              size: Math.random() * 4.5 + 2,
              alpha: 0.9,
            })
          }
        }
      }

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(CX - kolbaBoyniW / 2, kolbaBoyniY)
      ctx.lineTo(CX - kolbaBoyniW / 2, kolbaBoyniY + 70)
      ctx.lineTo(CX - kolbaAsosiW / 2, kolbaAsosiY)
      ctx.quadraticCurveTo(CX, kolbaAsosiY + 14, CX + kolbaAsosiW / 2, kolbaAsosiY)
      ctx.lineTo(CX + kolbaBoyniW / 2, kolbaBoyniY + 70)
      ctx.lineTo(CX + kolbaBoyniW / 2, kolbaBoyniY)
      ctx.closePath()
      ctx.clip()

      ctx.fillStyle = `rgba(${suvRangi.r}, ${suvRangi.g}, ${suvRangi.b}, ${suvRangi.a})`
      ctx.fillRect(CX - kolbaAsosiW, suyuqlikY, kolbaAsosiW * 2, kolbaAsosiY - suyuqlikY + 20)

      if (girdobFaol) burchak += 0.12

      const zarralar = zarralarRef.current
      for (let i = 0; i < zarralar.length; i++) {
        const p = zarralar[i]

        if (girdobFaol) {
          const vortexY = suyuqlikY + (kolbaAsosiY - suyuqlikY) * 0.6
          const dx = p.x - CX
          const dy = p.y - vortexY
          const dist = Math.max(15, Math.sqrt(dx * dx + dy * dy))
          const tezlik = 3.6 / (dist * 0.08)

          p.x += -dy * 0.035 * tezlik
          p.y += dx * 0.035 * tezlik
          p.x += (Math.random() - 0.5) * 1.5
          p.y += (Math.random() - 0.5) * 1.5
        } else {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.98
          p.vy *= 0.98
          p.x += (Math.random() - 0.5) * 0.9
          p.y += 0.3
        }

        if (p.y > kolbaAsosiY - 8) p.y = kolbaAsosiY - 8
        if (p.y < suyuqlikY + 2) p.y = suyuqlikY + 2
        if (p.x < CX - kolbaAsosiW / 2 + 10) p.x = CX - kolbaAsosiW / 2 + 10
        if (p.x > CX + kolbaAsosiW / 2 - 10) p.x = CX + kolbaAsosiW / 2 - 10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`
        ctx.fill()
      }

      ctx.beginPath()
      ctx.moveTo(CX - kolbaBoyniW / 2 - 2, suyuqlikY)
      if (girdobFaol) {
        ctx.quadraticCurveTo(CX, suyuqlikY + 22, CX + kolbaBoyniW / 2 + 2, suyuqlikY)
      } else {
        ctx.lineTo(CX + kolbaBoyniW / 2 + 2, suyuqlikY)
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()

      ctx.beginPath()
      ctx.moveTo(CX - kolbaBoyniW / 2, kolbaBoyniY)
      ctx.lineTo(CX - kolbaBoyniW / 2, kolbaBoyniY + 70)
      ctx.lineTo(CX - kolbaAsosiW / 2, kolbaAsosiY)
      ctx.quadraticCurveTo(CX, kolbaAsosiY + 14, CX + kolbaAsosiW / 2, kolbaAsosiY)
      ctx.lineTo(CX + kolbaBoyniW / 2, kolbaBoyniY + 70)
      ctx.lineTo(CX + kolbaBoyniW / 2, kolbaBoyniY)
      ctx.lineWidth = 4
      ctx.strokeStyle = "rgba(226, 232, 240, 0.8)"
      ctx.shadowColor = "rgba(56, 189, 248, 0.35)"
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)"
      ctx.lineWidth = 1.5
      for (let g = 0; g < 4; g++) {
        const markY = kolbaAsosiY - 30 - g * 26
        ctx.beginPath()
        ctx.moveTo(CX - 32, markY)
        ctx.lineTo(CX - 14, markY)
        ctx.stroke()

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
        ctx.font = "9px 'Times New Roman', serif"
        ctx.textAlign = "right"
        ctx.fillText(`${(g + 1) * 50} ml`, CX - 38, markY + 3)
      }

      if (girdobFaol) {
        ctx.save()
        ctx.translate(CX, kolbaAsosiY - 10)
        ctx.rotate(burchak)
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 8
        ctx.fillRect(-14, -3, 28, 6)
        ctx.restore()
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, girdobFaol, suvRangi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: GAZ KO'PIRISHI VA ALANGA (7-SINF UCHUN SODDA VA HAYOTIY)
  // ═══════════════════════════════════════════════════════════════════════════
  const gazCanvasRef = useRef(null)
  const [metallTushdi, setMetallTushdi] = useState(false)
  const [chopYondi, setChopYondi] = useState(false)
  const [olovFlash, setOlovFlash] = useState(false)
  const [haroratDarajasi, setHaroratDarajasi] = useState(20)

  const metallTashlash = () => {
    setMetallTushdi(true)
    tovushChiqar("togri")
  }

  const olovTutish = () => {
    if (!metallTushdi) return
    setChopYondi(true)
    setTimeout(() => {
      setOlovFlash(true)
      tovushChiqar("paq")
      setTimeout(() => {
        setOlovFlash(false)
        setChopYondi(false)
      }, 500)
    }, 450)
  }

  const probirkaniTozalash = () => {
    setMetallTushdi(false)
    setChopYondi(false)
    setOlovFlash(false)
    setHaroratDarajasi(20)
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "gaz") return
    const canvas = gazCanvasRef.current
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
    const probirkaW = 95
    const probirkaH = H - 85
    const probirkaY = 40
    const probirkaAsosiY = probirkaY + probirkaH
    const suyuqlikY = probirkaY + 95

    const metallDonalar = [
      { x: CX - 18, y: probirkaAsosiY - 18, r: 13 },
      { x: CX + 12, y: probirkaAsosiY - 16, r: 14 },
      { x: CX - 2, y: probirkaAsosiY - 28, r: 11 },
    ]

    const pufaklar = []
    let tVal = 20

    const render = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      if (metallTushdi) {
        // Gaz ko'pirishi (limonaddagi pufakchalardek shoshilib chiqadi)
        for (let b = 0; b < 7; b++) {
          const m = metallDonalar[Math.floor(Math.random() * metallDonalar.length)]
          pufaklar.push({
            x: m.x + (Math.random() - 0.5) * m.r * 1.5,
            y: m.y - Math.random() * 6,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 2.8 + 2.5),
            radius: Math.random() * 3.5 + 1.5,
            alpha: 0.9,
          })
        }

        if (tVal < 68) {
          tVal += 0.08
          setHaroratDarajasi(Math.round(tVal))
        }
      }

      // Probirka ichi (Clip)
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(CX - probirkaW / 2, probirkaY)
      ctx.lineTo(CX - probirkaW / 2, probirkaAsosiY - probirkaW / 2)
      ctx.arc(CX, probirkaAsosiY - probirkaW / 2, probirkaW / 2, Math.PI, 0, true)
      ctx.lineTo(CX + probirkaW / 2, probirkaY)
      ctx.closePath()
      ctx.clip()

      // Kislota eritmasi
      ctx.fillStyle = "rgba(125, 211, 252, 0.16)"
      ctx.fillRect(CX - probirkaW, suyuqlikY, probirkaW * 2, probirkaAsosiY)

      if (metallTushdi) {
        for (const m of metallDonalar) {
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
          const g = ctx.createRadialGradient(m.x - 3, m.y - 3, 2, m.x, m.y, m.r)
          g.addColorStop(0, "#f8fafc")
          g.addColorStop(0.6, "#94a3b8")
          g.addColorStop(1, "#334155")
          ctx.fillStyle = g
          ctx.fill()
          ctx.strokeStyle = "#475569"
          ctx.lineWidth = 1.5
          ctx.stroke()

          ctx.fillStyle = "#0f172a"
          ctx.font = "bold 10px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("Metall", m.x, m.y)
        }

        // Ko'pik qatlami
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)"
        ctx.fillRect(CX - probirkaW / 2, suyuqlikY - 6, probirkaW, 11)
      }

      // Pufakchalar
      for (let i = pufaklar.length - 1; i >= 0; i--) {
        const p = pufaklar[i]
        p.x += p.vx
        p.y += p.vy
        p.x += Math.sin(p.y * 0.1) * 0.6

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
        ctx.strokeStyle = "rgba(186, 230, 253, 0.9)"
        ctx.lineWidth = 1
        ctx.stroke()

        if (p.y <= suyuqlikY) pufaklar.splice(i, 1)
      }

      ctx.restore()

      // Probirka devori
      ctx.beginPath()
      ctx.moveTo(CX - probirkaW / 2, probirkaY)
      ctx.lineTo(CX - probirkaW / 2, probirkaAsosiY - probirkaW / 2)
      ctx.arc(CX, probirkaAsosiY - probirkaW / 2, probirkaW / 2, Math.PI, 0, true)
      ctx.lineTo(CX + probirkaW / 2, probirkaY)
      ctx.lineWidth = 4
      ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
      ctx.shadowColor = "rgba(56, 189, 248, 0.4)"
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      // Laboratoriya termometri
      const termX = CX + probirkaW / 2 + 55
      const termY = probirkaY + 20
      const termH = probirkaH - 40

      ctx.fillStyle = "rgba(15, 23, 42, 0.75)"
      ctx.strokeStyle = "rgba(226, 232, 240, 0.7)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(termX - 10, termY, 20, termH, 10)
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(termX, termY + termH - 6, 12, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1.5
      ctx.stroke()

      const hNisbat = Math.max(0, Math.min(1, (tVal - 0) / 100))
      const simobBalandligi = (termH - 25) * hNisbat

      ctx.fillStyle = "#ef4444"
      ctx.fillRect(termX - 3.5, termY + termH - 15 - simobBalandligi, 7, simobBalandligi)

      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 1
      for (let t = 0; t <= 100; t += 20) {
        const markY = termY + termH - 15 - (termH - 25) * (t / 100)
        ctx.beginPath()
        ctx.moveTo(termX + 10, markY)
        ctx.lineTo(termX + 17, markY)
        ctx.stroke()

        ctx.fillStyle = "#e2e8f0"
        ctx.font = "10px 'Times New Roman', serif"
        ctx.textAlign = "left"
        ctx.fillText(`${t}°C`, termX + 20, markY + 3)
      }

      // Cho'p
      if (chopYondi) {
        ctx.save()
        ctx.translate(CX - 15, probirkaY - 15)
        ctx.fillStyle = "#d97706"
        ctx.fillRect(-50, -3, 50, 6)
        ctx.beginPath()
        ctx.arc(0, 0, 9, 0, Math.PI * 2)
        ctx.fillStyle = "#f59e0b"
        ctx.shadowColor = "#f59e0b"
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.restore()
      }

      // Alanga chaqnashi
      if (olovFlash) {
        ctx.save()
        ctx.translate(CX, probirkaY)
        const flashGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 60)
        flashGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)")
        flashGrad.addColorStop(0.4, "rgba(251, 191, 36, 0.8)")
        flashGrad.addColorStop(1, "rgba(239, 68, 68, 0)")
        ctx.fillStyle = flashGrad
        ctx.beginPath()
        ctx.arc(0, 0, 60, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 22px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("PAQ!", 0, -32)
        ctx.restore()
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, metallTushdi, chopYondi, olovFlash])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: FIZIK VA KIMYOVIY O'ZGARISHLAR FARQI (CANVAS SIMULYATSIYASI)
  // ═══════════════════════════════════════════════════════════════════════════
  const solishtirCanvasRef = useRef(null)
  const [muzEriyapti, setMuzEriyapti] = useState(false)
  const [shamYonyapti, setShamYonyapti] = useState(false)
  const [shamKulBoldi, setShamKulBoldi] = useState(false)

  const muzniEritish = () => {
    setMuzEriyapti(true)
    tovushChiqar("togri")
  }
  const muzlatish = () => {
    setMuzEriyapti(false)
    tovushChiqar("togri")
  }

  const shamYoqish = () => {
    setShamYonyapti(true)
    tovushChiqar("paq")
    setTimeout(() => {
      setShamKulBoldi(true)
      setShamYonyapti(false)
    }, 3000)
  }
  const yangiShamQoyish = () => {
    setShamYonyapti(false)
    setShamKulBoldi(false)
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "fizik_kimyoviy") return
    const canvas = solishtirCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    let smokeParticles = []
    let waterRipples = 0

    const render = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const halfW = W / 2

      // O'rta bo'luvchi chiziq
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(halfW, 20)
      ctx.lineTo(halfW, H - 20)
      ctx.stroke()

      // ─── CHAP: FIZIK HODISA (MUZ ERISHI) ───
      const c1X = halfW / 2
      const baseY = H - 90

      // Idish / Likopcha
      ctx.beginPath()
      ctx.ellipse(c1X, baseY + 10, 85, 18, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(30, 58, 138, 0.4)"
      ctx.fill()
      ctx.strokeStyle = "rgba(96, 165, 250, 0.6)"
      ctx.lineWidth = 2
      ctx.stroke()

      if (!muzEriyapti) {
        // Qattiq muz kubigi
        ctx.save()
        ctx.translate(c1X - 35, baseY - 50)
        ctx.fillStyle = "rgba(147, 197, 253, 0.85)"
        ctx.fillRect(0, 0, 70, 55)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2.5
        ctx.strokeRect(0, 0, 70, 55)

        // Muz qirralari
        ctx.beginPath()
        ctx.moveTo(15, 0)
        ctx.lineTo(35, 55)
        ctx.moveTo(50, 0)
        ctx.lineTo(60, 55)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 13px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("Muz (Qattiq H₂O)", 35, 30)
        ctx.restore()
      } else {
        // Erib suv bo'lgan ko'lmak
        waterRipples += 0.05
        ctx.beginPath()
        ctx.ellipse(c1X, baseY + 6, 75, 14, 0, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)"
        ctx.fill()
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 2
        ctx.stroke()

        // Suv to'lqinlari
        ctx.beginPath()
        ctx.ellipse(c1X, baseY + 6, 45 + Math.sin(waterRipples) * 4, 8, 0, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 13px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("Suyuq suv (H₂O)", c1X, baseY - 12)
      }

      // ─── O'NG: KIMYOVIY HODISA (YONISH) ───
      const c2X = halfW + halfW / 2

      // Sham asosi
      ctx.beginPath()
      ctx.ellipse(c2X, baseY + 10, 75, 16, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(120, 53, 15, 0.4)"
      ctx.fill()
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)"
      ctx.lineWidth = 2
      ctx.stroke()

      if (!shamKulBoldi) {
        // Sham korpusi
        ctx.fillStyle = "#fef3c7"
        ctx.fillRect(c2X - 16, baseY - 55, 32, 65)
        ctx.strokeStyle = "#d97706"
        ctx.lineWidth = 1.5
        ctx.strokeRect(c2X - 16, baseY - 55, 32, 65)

        // Piltasi
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(c2X, baseY - 55)
        ctx.lineTo(c2X, baseY - 67)
        ctx.stroke()

        if (shamYonyapti) {
          // Jonli olov alangasi
          const flameH = 26 + Math.random() * 8
          ctx.beginPath()
          ctx.moveTo(c2X, baseY - 67 - flameH)
          ctx.quadraticCurveTo(c2X + 14, baseY - 70, c2X, baseY - 67)
          ctx.quadraticCurveTo(c2X - 14, baseY - 70, c2X, baseY - 67 - flameH)
          ctx.fillStyle = "#ea580c"
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(c2X, baseY - 67 - flameH * 0.7)
          ctx.quadraticCurveTo(c2X + 8, baseY - 69, c2X, baseY - 67)
          ctx.quadraticCurveTo(c2X - 8, baseY - 69, c2X, baseY - 67 - flameH * 0.7)
          ctx.fillStyle = "#fef08a"
          ctx.fill()

          // Tutun zarralari
          if (Math.random() > 0.4) {
            smokeParticles.push({
              x: c2X + (Math.random() - 0.5) * 6,
              y: baseY - 75 - flameH,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -Math.random() * 2 - 1,
              size: Math.random() * 5 + 3,
              alpha: 0.8,
            })
          }
        }
      } else {
        // Kul va qora uglerod
        ctx.beginPath()
        ctx.ellipse(c2X, baseY + 6, 35, 10, 0, 0, Math.PI * 2)
        ctx.fillStyle = "#1c1917"
        ctx.fill()
        ctx.strokeStyle = "#44403c"
        ctx.stroke()

        ctx.fillStyle = "#f87171"
        ctx.font = "bold 13px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("Qora kul va uglerod", c2X, baseY - 12)
      }

      // Tutun animatsiyasi
      for (let s = smokeParticles.length - 1; s >= 0; s--) {
        const sm = smokeParticles[s]
        sm.x += sm.vx
        sm.y += sm.vy
        sm.size += 0.3
        sm.alpha -= 0.02
        if (sm.alpha <= 0) {
          smokeParticles.splice(s, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(156, 163, 175, ${sm.alpha})`
        ctx.fill()
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, muzEriyapti, shamYonyapti, shamKulBoldi])

  // ═══════════════════════════════════════════════════════════════════════════
  // SMART DOSKA O'YINI 1: "FIZIKMI YOKI KIMYOVIY?" (7-SINF UCHUN SODDA)
  // ═══════════════════════════════════════════════════════════════════════════
  const barchaKartalar = [
    {
      savol: "Muzning erib suvga aylanishi",
      javob: "fizik",
      tushuntirish: "Muz erisa ham o'sha suv, yangi narsa paydo bo'lmadi!",
    },
    {
      savol: "Qog'oz varag'ini qaychida maydalab qirqish",
      javob: "fizik",
      tushuntirish: "Maydalansa ham baribir o'sha qog'ozligicha qoladi.",
    },
    {
      savol: "Temir mixning yomg'irda qolib zanglashi",
      javob: "kimyoviy",
      tushuntirish: "Temir va havodagi kisloroddan butunlay yangi modda — qizil zang hosil bo'ldi!",
    },
    {
      savol: "Sutning achib qatiqqa aylanishi",
      javob: "kimyoviy",
      tushuntirish: "Sut butunlay boshqa narsaga aylandi: nordon maza va yangi xossaga ega bo'ldi.",
    },
    {
      savol: "Shakar donalarini choyga solib eritish",
      javob: "fizik",
      tushuntirish: "Shakar yo'qolib ketmadi, suv bilan aralashdi xolos (choy shirin bo'ldi).",
    },
    {
      savol: "Gugurt cho'pining alanga olib yonishi",
      javob: "kimyoviy",
      tushuntirish: "Yog'och yonib, kul, tutun va olovga aylandi. Kulni qaytarib bo'lmaydi!",
    },
    {
      savol: "Choynakdagi suvning qaynab bug'lanishi",
      javob: "fizik",
      tushuntirish: "Bug' — bu o'sha suvning gaz holati, sovusa yana suvga aylanadi.",
    },
    {
      savol: "Xom tuxumni tovada qovurib pishirish",
      javob: "kimyoviy",
      tushuntirish: "Tuxum oqarib qotdi, yangi kimyoviy xossalar hosil bo'ldi.",
    },
    {
      savol: "Shisha piyolaning yerga tushib sinishi",
      javob: "fizik",
      tushuntirish: "Singan bo'laklar ham o'sha shisha, yangi modda chiqmadi.",
    },
    {
      savol: "Kesilgan olmaning havoda qorayishi",
      javob: "kimyoviy",
      tushuntirish: "Olma havo kislorodi bilan reaksiyaga kirishib, yuzasida yangi qoramtir modda hosil qildi.",
    },
  ]

  const [oyinIndeks, setOyinIndeks] = useState(0)
  const [ball, setBall] = useState(0)
  const [tanlovNatijasi, setTanlovNatijasi] = useState(null)
  const [oyinTugadi, setOyinTugadi] = useState(false)

  const javobBerish = (tur) => {
    if (tanlovNatijasi !== null) return
    const joriy = barchaKartalar[oyinIndeks]

    if (tur === joriy.javob) {
      setTanlovNatijasi("togri")
      setBall((b) => b + 15)
      tovushChiqar("togri")
    } else {
      setTanlovNatijasi("notogri")
      tovushChiqar("xato")
    }

    setTimeout(() => {
      setTanlovNatijasi(null)
      if (oyinIndeks + 1 < barchaKartalar.length) {
        setOyinIndeks((i) => i + 1)
      } else {
        setOyinTugadi(true)
      }
    }, 2200)
  }

  const oyinniQaytaBoshlash = () => {
    setOyinIndeks(0)
    setBall(0)
    setTanlovNatijasi(null)
    setOyinTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SMART DOSKA O'YINI 2: "KIMYOVIY MO'JIZA: BELGINI TOP!"
  // ═══════════════════════════════════════════════════════════════════════════
  const belgiSavollari = [
    {
      voqea: "Shaffof suvga bir tomchi indikator quydik — butun stakan ko'z oldimizda yorqin malina-pushti rangga kirdi!",
      togri: "rang",
      tushuntirish: "To'g'ri! Bu yerda eng asosiy ko'zga ko'ringan mo'jiza — Rangning o'zgarishi!",
    },
    {
      voqea: "Kislota ustiga rux metalini tashlagan edik, gazli limonaddek minglab vodorod pufakchalari shoshilib chiqdi!",
      togri: "gaz",
      tushuntirish: "Barakalla! Pufakchalar vijillab chiqishi — bu Gaz ajralishidir!",
    },
    {
      voqea: "Ikki tiniq suyuqlikni aralashtirdik, idish tubida qor parchalaridek oq loyqa qattiq modda cho'kib qoldi!",
      togri: "chokma",
      tushuntirish: "Ajoyib! Suyuqlik ichidan erimaydigan yangi qattiq zarracha tushishi — bu Cho'kma tushishi!",
    },
    {
      voqea: "Moddalarni aralashtirib probirkani ushlasak, u pechkadek qizib, issiqlik chiqarayotganini sezdik!",
      togri: "issiqlik",
      tushuntirish: "To'ppa-to'g'ri! Haroratning ko'tarilishi va alanga — bu Issiqlik va yorug'lik ajralishidir!",
    },
    {
      voqea: "Ohakli suvga naycha orqali puflaganimizda, tiniq suv bir zumda sutdek oq loyqa cho'kmaga to'ldi!",
      togri: "chokma",
      tushuntirish: "Ofarin! Karbonat angidrid ohakli suvda erimaydigan oq bo'r (CaCO₃) cho'kmasini hosil qildi!",
    },
    {
      voqea: "Osh sodasi ustiga sirka tomizganimizda idish ichida kuchli ko'pirish va gaz pufakchalari paydo bo'ldi!",
      togri: "gaz",
      tushuntirish: "Barakalla! Soda va sirka reaksiyasida karbonat angidrid gazi pufakchalari ajralib chiqdi!",
    },
  ]

  const [belgiIndeks, setBelgiIndeks] = useState(0)
  const [belgiBall, setBelgiBall] = useState(0)
  const [belgiNatija, setBelgiNatija] = useState(null)
  const [belgiTugadi, setBelgiTugadi] = useState(false)

  const belgiJavob = (tanlov) => {
    if (belgiNatija !== null) return
    const joriy = belgiSavollari[belgiIndeks]

    if (tanlov === joriy.togri) {
      setBelgiNatija("togri")
      setBelgiBall((b) => b + 20)
      tovushChiqar("togri")
    } else {
      setBelgiNatija("notogri")
      tovushChiqar("xato")
    }

    setTimeout(() => {
      setBelgiNatija(null)
      if (belgiIndeks + 1 < belgiSavollari.length) {
        setBelgiIndeks((i) => i + 1)
      } else {
        setBelgiTugadi(true)
      }
    }, 2200)
  }

  const belgiQayta = () => {
    setBelgiIndeks(0)
    setBelgiBall(0)
    setBelgiNatija(null)
    setBelgiTugadi(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5-ANIMATSIYA: CHO'KMA TUSHISHI (OLTIN YOMG'IR PbI2 VA OQ CHO'KMA AgCl)
  // ─────────────────────────────────────────────────────────────────────────
  const chokmaCanvasRef = useRef(null)
  const [chokmaTuri, setChokmaTuri] = useState("oltin") // "oltin" (PbI2) | "kumush" (AgCl) | "mis" (Cu(OH)2)
  const [chokmaTomizildi, setChokmaTomizildi] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "chokma") return
    const canvas = chokmaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let frame = 0

    const zarrachalar = Array.from({ length: 75 }, (_, i) => ({
      x: (Math.random() - 0.5) * 110,
      y: -20 - Math.random() * 110,
      vy: 0.7 + Math.random() * 1.1,
      vx: (Math.random() - 0.5) * 0.4,
      r: 2.5 + Math.random() * 2.5,
      settled: false,
      delay: i * 1.5,
    }))

    const chiz = () => {
      frame++
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }
      ctx.save()
      ctx.scale(dpr, dpr)
      const W = rect.width
      const H = rect.height
      const CX = W / 2
      const CY = H / 2 + 25

      ctx.fillStyle = "#030614"
      ctx.fillRect(0, 0, W, H)

      // Stakan o'lchamlari
      const bW = 160
      const bH = 190
      const bX = CX - bW / 2
      const bY = CY - bH / 2

      // Suyuqlik foni
      const suyRang =
        chokmaTuri === "oltin"
          ? "rgba(250, 204, 21, 0.14)"
          : chokmaTuri === "kumush"
          ? "rgba(226, 232, 240, 0.14)"
          : "rgba(56, 189, 248, 0.18)"
      ctx.fillStyle = suyRang
      ctx.fillRect(bX + 6, bY + 45, bW - 12, bH - 51)

      // Pipetka yuqorida
      ctx.fillStyle = "#334155"
      ctx.fillRect(CX - 7, 16, 14, 34)
      ctx.fillStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(CX - 5, 50)
      ctx.lineTo(CX + 5, 50)
      ctx.lineTo(CX + 2, 74)
      ctx.lineTo(CX - 2, 74)
      ctx.closePath()
      ctx.fill()

      // Cho'kma kristallari harakati
      const zRang =
        chokmaTuri === "oltin"
          ? "#facc15"
          : chokmaTuri === "kumush"
          ? "#f8fafc"
          : "#38bdf8"

      if (chokmaTomizildi) {
        // Tomchi tushishi
        if (frame < 45) {
          ctx.beginPath()
          ctx.arc(CX, 76 + frame * 1.6, 4.5, 0, Math.PI * 2)
          ctx.fillStyle = zRang
          ctx.fill()
        }

        zarrachalar.forEach((z) => {
          if (frame > z.delay) {
            const maxTub = bY + bH - 12 - (z.r + (z.delay % 14))
            const curY = bY + 55 + Math.max(0, z.y)
            if (curY < maxTub) {
              z.y += z.vy
              z.x += Math.sin(frame * 0.05 + z.delay) * 0.3 + z.vx
            }
            const drawX = Math.max(bX + 16, Math.min(bX + bW - 16, CX + z.x))
            const drawY = Math.min(maxTub, bY + 55 + Math.max(0, z.y))

            ctx.beginPath()
            ctx.arc(drawX, drawY, z.r, 0, Math.PI * 2)
            ctx.fillStyle = zRang
            ctx.shadowColor = zRang
            ctx.shadowBlur = chokmaTuri === "oltin" ? 8 : 4
            ctx.fill()
            ctx.shadowBlur = 0
          }
        })
      }

      // Stakan devori
      ctx.strokeStyle = "rgba(148, 163, 184, 0.75)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(bX, bY)
      ctx.lineTo(bX, bY + bH)
      ctx.lineTo(bX + bW, bY + bH)
      ctx.lineTo(bX + bW, bY)
      ctx.stroke()

      // Formula yozuvi
      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillStyle = "#fde047"
      ctx.textAlign = "center"
      const formulaMatn =
        chokmaTuri === "oltin"
          ? "Pb(NO₃)₂ + 2KI → PbI₂↓ (Oltin cho'kma) + 2KNO₃"
          : chokmaTuri === "kumush"
          ? "AgNO₃ + NaCl → AgCl↓ (Oq cho'kma) + NaNO₃"
          : "CuSO₄ + 2NaOH → Cu(OH)₂↓ (Moviy cho'kma) + Na₂SO₄"
      ctx.fillText(formulaMatn, CX, H - 16)

      ctx.restore()
      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, chokmaTuri, chokmaTomizildi])

  // ─────────────────────────────────────────────────────────────────────────
  // 6-ANIMATSIYA: OSHXONA KIMYOSI (SODA + SIRKA -> CO2 SHAR SHISHISHI)
  // ─────────────────────────────────────────────────────────────────────────
  const sharCanvasRef = useRef(null)
  const [sodaTokildi, setSodaTokildi] = useState(false)
  const [sharHajmi, setSharHajmi] = useState(0)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "shar") return
    const canvas = sharCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let frame = 0
    let radius = sodaTokildi ? 18 : 14

    const pufaklar = Array.from({ length: 35 }, () => ({
      x: (Math.random() - 0.5) * 90,
      y: Math.random() * 70,
      r: 2 + Math.random() * 3.5,
      v: 1 + Math.random() * 1.5,
    }))

    const chiz = () => {
      frame++
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }
      ctx.save()
      ctx.scale(dpr, dpr)
      const W = rect.width
      const H = rect.height
      const CX = W / 2
      const baseB = H - 48

      ctx.fillStyle = "#030614"
      ctx.fillRect(0, 0, W, H)

      if (sodaTokildi && radius < 68) {
        radius += 0.22
        if (frame % 10 === 0) setSharHajmi(Math.min(100, Math.round(((radius - 14) / 54) * 100)))
      }

      // Konussimon kolba (Erlenmeyer)
      const neckY = baseB - 135
      ctx.fillStyle = "rgba(56, 189, 248, 0.16)"
      ctx.beginPath()
      ctx.moveTo(CX - 46, baseB - 65)
      ctx.lineTo(CX + 46, baseB - 65)
      ctx.lineTo(CX + 68, baseB)
      ctx.lineTo(CX - 68, baseB)
      ctx.closePath()
      ctx.fill()

      // CO2 gaz pufakchalari
      if (sodaTokildi) {
        pufaklar.forEach((p) => {
          p.y -= p.v
          if (p.y < -85) p.y = 0
          ctx.beginPath()
          ctx.arc(CX + p.x * (0.4 + (p.y + 85) / 160), baseB - 10 + p.y * 0.7, p.r, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
          ctx.fill()
        })
      }

      // Kolba konturi
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(CX - 18, neckY)
      ctx.lineTo(CX - 18, neckY + 35)
      ctx.lineTo(CX - 70, baseB)
      ctx.lineTo(CX + 70, baseB)
      ctx.lineTo(CX + 18, neckY + 35)
      ctx.lineTo(CX + 18, neckY)
      ctx.stroke()

      // Shar (Balloon) kolba og'zida
      const sharCY = neckY - radius * 0.85
      ctx.beginPath()
      ctx.arc(CX, sharCY, radius, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(CX - radius * 0.3, sharCY - radius * 0.3, 4, CX, sharCY, radius)
      grad.addColorStop(0, "#fb7185")
      grad.addColorStop(1, "#e11d48")
      ctx.fillStyle = grad
      ctx.fill()

      if (sodaTokildi && radius > 28) {
        ctx.fillStyle = "#ffffff"
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("CO₂↑", CX, sharCY + 5)
      }

      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillStyle = "#fde047"
      ctx.textAlign = "center"
      ctx.fillText("NaHCO₃ (Soda) + CH₃COOH (Sirka) → CH₃COONa + H₂O + CO₂↑", CX, H - 15)

      ctx.restore()
      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, sodaTokildi])

  // ─────────────────────────────────────────────────────────────────────────
  // 3-O'YIN: VIRTUAL REAKSIYA KONSTRUKTORI (MODDALARNI BIRLASHTIR)
  // ─────────────────────────────────────────────────────────────────────────
  const konstruktorReaksiyalar = [
    {
      id: 1,
      moddaA: "Pb(NO₃)₂ eritmasi",
      moddaB: "KI (Kaliy yodid)",
      formula: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
      togriNatija: "Oltin rangli cho'kma tushadi",
      variantlar: [
        "Oltin rangli cho'kma tushadi",
        "Hech narsa o'zgarmaydi",
        "Muzga aylanadi",
        "Qora tutun chiqadi",
      ],
    },
    {
      id: 2,
      moddaA: "Osh sodasi (NaHCO₃)",
      moddaB: "Sirka kislota (CH₃COOH)",
      formula: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
      togriNatija: "CO₂ gazi ko'pirib chiqadi",
      variantlar: [
        "CO₂ gazi ko'pirib chiqadi",
        "Moviy kristall tushadi",
        "Temir zanglaydi",
        "Fizik erish yuz beradi",
      ],
    },
    {
      id: 3,
      moddaA: "Ishqor eritmasi (NaOH)",
      moddaB: "Fenolftalein",
      formula: "NaOH + Fenolftalein → To'q pushti (malina) rang",
      togriNatija: "Eritma to'q pushti rangga kiradi",
      variantlar: [
        "Eritma to'q pushti rangga kiradi",
        "Oq cho'kma tushadi",
        "Portlash yuz beradi",
        "Suv muzlaydi",
      ],
    },
    {
      id: 4,
      moddaA: "Rux metali (Zn)",
      moddaB: "Xlorid kislota (HCl)",
      formula: "Zn + 2HCl → ZnCl₂ + H₂↑ + Q (Issiqlik)",
      togriNatija: "Vodorod gazi va issiqlik ajraladi",
      variantlar: [
        "Vodorod gazi va issiqlik ajraladi",
        "Faqat rang o'zgaradi",
        "Fizik bug'lanish bo'ladi",
        "Sariq cho'kma tushadi",
      ],
    },
  ]

  const [konstIndeks, setKonstIndeks] = useState(0)
  const [konstTanlov, setKonstTanlov] = useState(null)
  const [konstBall, setKonstBall] = useState(0)

  const konstJavob = (v) => {
    if (konstTanlov !== null) return
    setKonstTanlov(v)
    if (v === konstruktorReaksiyalar[konstIndeks].togriNatija) {
      setKonstBall((b) => b + 25)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH SMART DOSKA BELLASHUVI)
  // ─────────────────────────────────────────────────────────────────────────
  const duelSavollari = [
    { savol: "Temir mixning nam havoda zanglashi", javob: "Kimyoviy", variantlar: ["Fizik", "Kimyoviy"] },
    { savol: "Suvning 100°C da qaynab bug'ga aylanishi", javob: "Fizik", variantlar: ["Fizik", "Kimyoviy"] },
    { savol: "AgNO₃ + NaCl → AgCl↓ reaksiyasidagi asosiy belgi", javob: "Cho'kma", variantlar: ["Cho'kma", "Alanga"] },
    { savol: "Sutning issiq kunda achib qatiqqa aylanishi", javob: "Kimyoviy", variantlar: ["Fizik", "Kimyoviy"] },
    { savol: "Shisha stakanning tushib sinishi", javob: "Fizik", variantlar: ["Fizik", "Kimyoviy"] },
    { savol: "Tabiiy gaz (CH₄) yonganda ajraladigan belgi", javob: "Issiqlik va nur", variantlar: ["Issiqlik va nur", "Cho'kma"] },
  ]
  const [duelIndeks, setDuelIndeks] = useState(0)
  const [guruh1Ball, setGuruh1Ball] = useState(0)
  const [guruh2Ball, setGuruh2Ball] = useState(0)
  const [duelNavbat, setDuelNavbat] = useState(1) // 1 yoki 2
  const [duelTugadi, setDuelTugadi] = useState(false)

  const duelJavobBer = (guruh, tanlov) => {
    if (duelTugadi || guruh !== duelNavbat) return
    const togri = tanlov === duelSavollari[duelIndeks].javob
    if (togri) {
      if (guruh === 1) setGuruh1Ball((b) => b + 10)
      else setGuruh2Ball((b) => b + 10)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
    if (duelIndeks + 1 < duelSavollari.length) {
      setDuelIndeks((i) => i + 1)
      setDuelNavbat(guruh === 1 ? 2 : 1)
    } else {
      setDuelTugadi(true)
      tovushChiqar("zafar")
    }
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
        mavzuRaqam="1.1"
        mavzuNom="Kimyo fani nimani o'rganadi?"
        bobNom="1-bob. Kirish"
        sahifa={2}
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          A BO'LIM: CHUQUR ANIMATSIYALAR PANELI
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="space-y-4">
          {/* Animatsiyalar rejimi tanlash */}
          <div className="flex items-center gap-2 bg-[#080e28] p-1.5 rounded-2xl border border-blue-900/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => setAnimRejim("mikro")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "mikro"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="atom" olcham={16} />
              <span>1. Atomlar & Zanglash</span>
            </button>

            <button
              type="button"
              onClick={() => setAnimRejim("rang")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "rang"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>2. Rang o&apos;zgarishi & Diffuziya</span>
            </button>

            <button
              type="button"
              onClick={() => setAnimRejim("gaz")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "gaz"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="tolqin" olcham={16} />
              <span>3. Gaz ko&apos;pirishi & Issiqlik</span>
            </button>

            <button
              type="button"
              onClick={() => setAnimRejim("fizik_kimyoviy")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "fizik_kimyoviy"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="chaqmoq" olcham={16} />
              <span>4. Muz vs Sham</span>
            </button>

            <button
              type="button"
              onClick={() => setAnimRejim("chokma")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "chokma"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kristall" olcham={16} />
              <span>5. Cho&apos;kma tushishi</span>
            </button>

            <button
              type="button"
              onClick={() => setAnimRejim("shar")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                animRejim === "shar"
                  ? "bg-yellow-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>6. Soda + Sirka (Shar)</span>
            </button>
          </div>

          {/* 1. MIKROSKOPIK ATOMLAR VA ZANGLASH */}
          {animRejim === "mikro" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-yellow-300 font-bold text-xs sm:text-sm bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/30">
                  Temir (Fe) + Kislorod (O₂) + Suv (H₂O) → Zang (Fe₂O₃)
                </span>
                <span className="px-3 py-1.5 rounded-xl border border-orange-500/40 bg-orange-500/15 text-orange-300 font-bold text-xs">
                  Zanglash darajasi: {zangFoiz}%
                </span>
              </div>

              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={mikroCanvasRef} className="w-full h-full block cursor-crosshair" />

                <div className="absolute top-3 left-3 flex items-center gap-3 text-[11px] sm:text-xs bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Fe (Temir)
                  </span>
                  <span className="flex items-center gap-1 text-rose-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> O₂ (Kislorod)
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> H₂O (Suv)
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Zang (Yangi modda)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setMikroReaksiya((v) => !v)}
                  className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                    mikroReaksiya
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white ring-2 ring-orange-400"
                      : "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950"
                  }`}
                >
                  <Ikon nom={mikroReaksiya ? "olov" : "chaqmoq"} olcham={18} />
                  <span>{mikroReaksiya ? "Reaksiya ketyapti (To'xtatish)" : "Reaksiyani boshlash"}</span>
                </button>

                <div className="p-3 rounded-2xl border border-blue-900/60 bg-[#060b22]/70 flex flex-col justify-center">
                  <div className="flex justify-between text-xs text-blue-200 font-semibold mb-1">
                    <span>Harorat (Atomlar tebranishi):</span>
                    <span className="text-yellow-400 font-bold">{harorat}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={harorat}
                    onChange={(e) => setHarorat(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer h-2 bg-blue-950 rounded-lg"
                  />
                </div>

                <div className="p-3 rounded-2xl border border-blue-900/60 bg-[#060b22]/70 flex flex-col justify-center">
                  <div className="flex justify-between text-xs text-blue-200 font-semibold mb-1">
                    <span>Namlik miqdori:</span>
                    <span className="text-cyan-400 font-bold">{namlik}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={namlik}
                    onChange={(e) => setNamlik(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-blue-950 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. RANG O'ZGARISHI VA DIFFUZIYA */}
          {animRejim === "rang" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="p-3.5 rounded-2xl border border-blue-800/40 bg-[#060c28] flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-blue-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
                  <span>
                    Pastdagi reaktiv tugmasini bosing — shaffof suv rangining o&apos;zgarishini kuzating:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={kolbaniYuvish}
                  className="px-3.5 py-1.5 rounded-xl border border-blue-700 bg-[#09153a] hover:bg-[#0c1e54] text-xs font-semibold text-blue-200 transition"
                >
                  Kolbani yuvish (Tozalash)
                </button>
              </div>

              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner flex items-center justify-center">
                <canvas ref={rangCanvasRef} className="w-full h-full block" />

                {faolReaktiv && (
                  <div className="absolute bottom-4 inset-x-4 max-w-lg mx-auto p-3 rounded-2xl bg-[#030718]/90 backdrop-blur-md border border-white/10 text-center shadow-xl">
                    <div className="text-xs font-bold text-yellow-300">
                      {kolbaReaktivlari[faolReaktiv].formula}
                    </div>
                    <div className="text-[11px] text-blue-200/90 mt-0.5">
                      {kolbaReaktivlari[faolReaktiv].tushuntirish}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => reaktivQuyish("fenolftalein")}
                  className="p-3.5 rounded-2xl border border-fuchsia-500/40 bg-fuchsia-950/40 hover:bg-fuchsia-900/50 text-fuchsia-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 active:scale-95 shadow-lg shadow-fuchsia-500/10"
                >
                  <Ikon nom="tomchi" olcham={16} />
                  <span>1. Fenolftalein (Pushti rang)</span>
                </button>

                <button
                  type="button"
                  onClick={() => reaktivQuyish("mis")}
                  className="p-3.5 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 active:scale-95 shadow-lg shadow-cyan-500/10"
                >
                  <Ikon nom="kristall" olcham={16} />
                  <span>2. Mis kuporosi (Moviy rang)</span>
                </button>

                <button
                  type="button"
                  onClick={() => reaktivQuyish("xromat")}
                  className="p-3.5 rounded-2xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 active:scale-95 shadow-lg shadow-amber-500/10"
                >
                  <Ikon nom="palitra" olcham={16} />
                  <span>3. Kaliy xromat (Sariq rang)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGirdobFaol((v) => !v)}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
                    girdobFaol
                      ? "border-emerald-400 bg-emerald-600/30 text-emerald-200 shadow-lg shadow-emerald-500/20"
                      : "border-blue-800 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
                  }`}
                >
                  <Ikon nom="qayta" olcham={16} className={girdobFaol ? "animate-spin" : ""} />
                  <span>{girdobFaol ? "Girdob ketyapti (To'xtatish)" : "Magnit girdobni yoqish"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. GAZ KO'PIRISHI VA ALANGA (SODDA VA TUSHUNARLI) */}
          {animRejim === "gaz" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="p-3.5 rounded-2xl border border-blue-800/40 bg-[#060c28] flex items-center justify-between gap-3 flex-wrap">
                <span className="text-yellow-300 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                  <Ikon nom="tolqin" olcham={16} />
                  <span>Kimyoviy reaksiya belgilari: Gaz ko&apos;pirishi va Issiqlik ajralishi</span>
                </span>
                <span className="px-3 py-1 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 font-bold text-xs flex items-center gap-1">
                  <Ikon nom="harorat" olcham={14} />
                  <span>Harorat: {haroratDarajasi}°C</span>
                </span>
              </div>

              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner flex items-center justify-center">
                <canvas ref={gazCanvasRef} className="w-full h-full block" />

                {!metallTushdi && (
                  <div className="absolute top-4 text-xs font-semibold text-blue-200 bg-black/75 px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
                    Probirka ichida kislota bor. 1-bosqich tugmasi orqali metallni tashlang!
                  </div>
                )}
              </div>

              {/* 3 TA ANIQ VA BOSQICHMA-BOSQICH TUGMALAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  type="button"
                  onClick={metallTashlash}
                  disabled={metallTushdi}
                  className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                    metallTushdi
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/20 active:scale-95"
                  }`}
                >
                  <Ikon nom="kristall" olcham={16} />
                  <span>{metallTushdi ? "Metall solingan (Ko'pirmoqda)" : "1. Metallni kislotaga tashlash"}</span>
                </button>

                <button
                  type="button"
                  onClick={olovTutish}
                  disabled={!metallTushdi}
                  className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                    !metallTushdi
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-lg shadow-rose-500/25 active:scale-95 animate-pulse"
                  }`}
                >
                  <Ikon nom="olov" olcham={16} />
                  <span>2. Yonayotgan cho&apos;pni tutish (Vodorodni sinash)</span>
                </button>

                <button
                  type="button"
                  onClick={probirkaniTozalash}
                  className="p-3.5 rounded-2xl border border-blue-800 bg-[#060b22] hover:bg-[#0a1438] text-blue-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <Ikon nom="qayta" olcham={16} />
                  <span>Probirkani tozalash</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. FIZIK VA KIMYOVIY O'ZGARISHLAR FARQI (JONLI CANVAS SIMULYATORI) */}
          {animRejim === "fizik_kimyoviy" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                  <Ikon nom="tomchi" olcham={16} />
                  <span>Fizik hodisa: Muzning erishi (Qaytuvchan)</span>
                </div>
                <div className="p-2.5 rounded-2xl border border-orange-500/40 bg-orange-950/30 text-orange-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                  <Ikon nom="olov" olcham={16} />
                  <span>Kimyoviy hodisa: Sham yonishi (Yangi modda)</span>
                </div>
              </div>

              {/* JONLI CANVAS MAYDONI */}
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner flex items-center justify-center">
                <canvas ref={solishtirCanvasRef} className="w-full h-full block" />
              </div>

              {/* BOSHQARUV TUGMALARI */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Chap tomon: Muz boshqaruvi */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={muzniEritish}
                    className="flex-1 p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Ikon nom="harorat" olcham={16} />
                    <span>Muzni eritish</span>
                  </button>
                  <button
                    type="button"
                    onClick={muzlatish}
                    className="flex-1 p-3 rounded-2xl border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Ikon nom="qayta" olcham={16} />
                    <span>Muzlatish</span>
                  </button>
                </div>

                {/* O'ng tomon: Sham boshqaruvi */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={shamYoqish}
                    disabled={shamYonyapti}
                    className="flex-1 p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Ikon nom="olov" olcham={16} />
                    <span>Shamni yoqish</span>
                  </button>
                  <button
                    type="button"
                    onClick={yangiShamQoyish}
                    className="flex-1 p-3 rounded-2xl border border-orange-500/50 bg-orange-950/40 hover:bg-orange-900/50 text-orange-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Ikon nom="qayta" olcham={16} />
                    <span>Yangi sham qo&apos;yish</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. CHO'KMA TUSHISHI MEXANIZMI */}
          {animRejim === "chokma" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={chokmaCanvasRef} className="w-full h-full block" />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setChokmaTuri("oltin")
                      setChokmaTomizildi(false)
                      tovushChiqar("tomchi")
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition ${
                      chokmaTuri === "oltin"
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-300"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    1. PbI₂↓ (Oltin yomg&apos;ir)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChokmaTuri("kumush")
                      setChokmaTomizildi(false)
                      tovushChiqar("tomchi")
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition ${
                      chokmaTuri === "kumush"
                        ? "border-slate-300 bg-slate-500/25 text-white"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    2. AgCl↓ (Oq cho&apos;kma)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChokmaTuri("mis")
                      setChokmaTomizildi(false)
                      tovushChiqar("tomchi")
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition ${
                      chokmaTuri === "mis"
                        ? "border-sky-400 bg-sky-500/25 text-sky-300"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    3. Cu(OH)₂↓ (Moviy cho&apos;kma)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChokmaTomizildi(true)
                      tovushChiqar("tomchi")
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg"
                  >
                    Reaktiv tomizish
                  </button>
                  <button
                    type="button"
                    onClick={() => setChokmaTomizildi(false)}
                    className="px-4 py-2.5 rounded-xl border border-blue-800 bg-[#060b22] text-blue-200 font-bold text-xs sm:text-sm"
                  >
                    Tozalash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. OSHXONA KIMYOSI: SODA + SIRKA (SHAR SHISHISHI) */}
          {animRejim === "shar" && (
            <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={sharCanvasRef} className="w-full h-full block" />
                <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/80 text-rose-300 font-bold text-xs">
                  CO₂ shar hajmi: {sharHajmi}%
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSodaTokildi(true)
                    tovushChiqar("pufak")
                  }}
                  disabled={sodaTokildi}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg disabled:opacity-50"
                >
                  Sodani sirkaga to&apos;kish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSodaTokildi(false)
                    setSharHajmi(0)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-blue-800 bg-[#060b22] text-blue-200 font-bold text-xs sm:text-sm"
                >
                  Qayta tiklash
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          B BO'LIM: SMART DOSKA O'YINLARI (4 TA O'YIN)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "oyinlar" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-[#080e28] p-1.5 rounded-2xl border border-blue-900/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => setOyinRejim("saralash")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                oyinRejim === "saralash"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="quiz" olcham={16} />
              <span>1. Fizik yoki Kimyoviy?</span>
            </button>

            <button
              type="button"
              onClick={() => setOyinRejim("belgilar")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                oyinRejim === "belgilar"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kristall" olcham={16} />
              <span>2. Reaksiya belgisi</span>
            </button>

            <button
              type="button"
              onClick={() => setOyinRejim("konstruktor")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                oyinRejim === "konstruktor"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>3. Reaksiya Konstruktori</span>
            </button>

            <button
              type="button"
              onClick={() => setOyinRejim("duel")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                oyinRejim === "duel"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Ikon nom="kubok" olcham={16} />
              <span>4. Jamoalar Dueli (1 vs 2)</span>
            </button>
          </div>

          {/* 1-O'YIN: FIZIKMI YOKI KIMYOVIY? (7-SINFGA MOS TILDA) */}
          {oyinRejim === "saralash" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-6">
              {!oyinTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                      <span>Savol:</span>
                      <span className="text-yellow-400 font-bold text-sm">
                        {oyinIndeks + 1} / {barchaKartalar.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold text-sm">
                      <Ikon nom="yulduz" olcham={16} />
                      <span>To&apos;plangan ball: {ball}</span>
                    </div>
                  </div>

                  <div
                    className={`p-6 sm:p-8 rounded-3xl border text-center transition-all duration-300 ${
                      tanlovNatijasi === "togri"
                        ? "border-emerald-500 bg-emerald-950/40 ring-4 ring-emerald-500/30 scale-102"
                        : tanlovNatijasi === "notogri"
                        ? "border-rose-500 bg-rose-950/40 ring-4 ring-rose-500/30 scale-102"
                        : "border-blue-800/60 bg-[#081236]/80 shadow-2xl"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider text-blue-300/80 font-semibold mb-2">
                      Doskadagi topshiriq:
                    </div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white leading-snug">
                      &quot;{barchaKartalar[oyinIndeks].savol}&quot;
                    </h3>

                    {tanlovNatijasi && (
                      <div className="mt-4 p-3 rounded-2xl bg-black/70 border border-white/10 text-xs sm:text-sm">
                        <span
                          className={`font-bold ${
                            tanlovNatijasi === "togri" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {tanlovNatijasi === "togri" ? "BARAKALLA! TO'G'RI!" : "DIQQAT QILING!"}
                        </span>{" "}
                        <span className="text-blue-100">
                          {barchaKartalar[oyinIndeks].tushuntirish}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2 TA ULKAN SENSORLI TUGMA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => javobBerish("fizik")}
                      disabled={tanlovNatijasi !== null}
                      className="p-6 rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/70 hover:to-blue-900/70 text-cyan-200 hover:text-white font-bold text-lg sm:text-xl transition-all shadow-xl shadow-cyan-500/10 active:scale-95 flex flex-col items-center gap-2 group"
                    >
                      <span className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="qayta" olcham={28} />
                      </span>
                      <span>O&apos;sha-o&apos;sha modda (Fizik hodisa)</span>
                      <span className="text-xs text-cyan-300/70 font-normal">
                        (Yangi narsa chiqmadi, qaytuvchan)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => javobBerish("kimyoviy")}
                      disabled={tanlovNatijasi !== null}
                      className="p-6 rounded-3xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-950/60 to-amber-950/60 hover:from-orange-900/70 hover:to-amber-900/70 text-orange-200 hover:text-white font-bold text-lg sm:text-xl transition-all shadow-xl shadow-orange-500/10 active:scale-95 flex flex-col items-center gap-2 group"
                    >
                      <span className="p-3 rounded-2xl bg-orange-500/20 text-orange-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="uchqun" olcham={28} />
                      </span>
                      <span>Butunlay yangi modda (Kimyoviy hodisa)</span>
                      <span className="text-xs text-orange-300/70 font-normal">
                        (Yangi modda paydo bo&apos;ldi, orqaga qaytmaydi)
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/40 mx-auto flex items-center justify-center text-yellow-400">
                    <Ikon nom="kubok" olcham={36} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Barakalla! O&apos;yin yakunlandi!
                  </h3>
                  <p className="text-lg text-emerald-300 font-bold">
                    Sizning natijangiz: {ball} / {barchaKartalar.length * 15} ball
                  </p>
                  <p className="text-xs text-blue-200/80 max-w-md mx-auto">
                    Siz kimyodagi eng muhim qoidani tushunib yetdingiz: kimyoviy o&apos;zgarishda har doim yangi modda hosil bo&apos;ladi!
                  </p>
                  <button
                    type="button"
                    onClick={oyinniQaytaBoshlash}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-xl"
                  >
                    O&apos;yinni qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2-O'YIN: REAKSIYA BELGISINI TOP! */}
          {oyinRejim === "belgilar" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-6">
              {!belgiTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                      <span>Holat:</span>
                      <span className="text-yellow-400 font-bold text-sm">
                        {belgiIndeks + 1} / {belgiSavollari.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/15 text-yellow-300 font-bold text-sm">
                      <Ikon nom="medal" olcham={16} />
                      <span>Ball: {belgiBall}</span>
                    </div>
                  </div>

                  <div
                    className={`p-6 sm:p-8 rounded-3xl border text-center transition-all duration-300 ${
                      belgiNatija === "togri"
                        ? "border-emerald-500 bg-emerald-950/40 ring-4 ring-emerald-500/30 scale-102"
                        : belgiNatija === "notogri"
                        ? "border-rose-500 bg-rose-950/40 ring-4 ring-rose-500/30 scale-102"
                        : "border-blue-800/60 bg-[#081236]/80 shadow-2xl"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider text-yellow-400 font-semibold mb-2">
                      Qaysi mo&apos;jiza sodir bo&apos;ldi?
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                      &quot;{belgiSavollari[belgiIndeks].voqea}&quot;
                    </h3>

                    {belgiNatija && (
                      <div className="mt-4 p-3 rounded-2xl bg-black/70 border border-white/10 text-xs sm:text-sm">
                        <span
                          className={`font-bold ${
                            belgiNatija === "togri" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {belgiNatija === "togri" ? "BARAKALLA!" : "DIQQAT QILING!"}
                        </span>{" "}
                        <span className="text-blue-100">
                          {belgiSavollari[belgiIndeks].tushuntirish}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 4 TA BELGI TUGMALARI (FAQAT SAYT SVG IKONKALARI BILAN) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => belgiJavob("rang")}
                      disabled={belgiNatija !== null}
                      className="p-5 rounded-2xl border border-fuchsia-500/40 bg-fuchsia-950/30 hover:bg-fuchsia-900/50 text-fuchsia-200 font-bold text-xs sm:text-sm transition flex flex-col items-center gap-2 active:scale-95 group"
                    >
                      <span className="p-2.5 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="palitra" olcham={22} />
                      </span>
                      <span>Rang o&apos;zgarishi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => belgiJavob("gaz")}
                      disabled={belgiNatija !== null}
                      className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-200 font-bold text-xs sm:text-sm transition flex flex-col items-center gap-2 active:scale-95 group"
                    >
                      <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="tolqin" olcham={22} />
                      </span>
                      <span>Gaz ko&apos;pirishi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => belgiJavob("chokma")}
                      disabled={belgiNatija !== null}
                      className="p-5 rounded-2xl border border-yellow-500/40 bg-yellow-950/30 hover:bg-yellow-900/50 text-yellow-200 font-bold text-xs sm:text-sm transition flex flex-col items-center gap-2 active:scale-95 group"
                    >
                      <span className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="kristall" olcham={22} />
                      </span>
                      <span>Cho&apos;kma tushishi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => belgiJavob("issiqlik")}
                      disabled={belgiNatija !== null}
                      className="p-5 rounded-2xl border border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/50 text-rose-200 font-bold text-xs sm:text-sm transition flex flex-col items-center gap-2 active:scale-95 group"
                    >
                      <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition-transform">
                        <Ikon nom="harorat" olcham={22} />
                      </span>
                      <span>Issiqlik chiqishi</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/40 mx-auto flex items-center justify-center text-yellow-400">
                    <Ikon nom="yulduz" olcham={36} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Barcha belgilar to&apos;g&apos;ri aniqlandi!
                  </h3>
                  <p className="text-lg text-yellow-300 font-bold">
                    To&apos;plangan ball: {belgiBall} / {belgiSavollari.length * 20} ball
                  </p>
                  <button
                    type="button"
                    onClick={belgiQayta}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-sm transition shadow-xl"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3-O'YIN: REAKSIYA KONSTRUKTORI */}
          {oyinRejim === "konstruktor" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                <span className="text-xs sm:text-sm font-bold text-cyan-300">
                  Tajriba: {konstIndeks + 1} / {konstruktorReaksiyalar.length}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold text-xs sm:text-sm">
                  Ball: {konstBall}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
                <div className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 font-bold text-base sm:text-lg text-cyan-200">
                  {konstruktorReaksiyalar[konstIndeks].moddaA}
                </div>
                <div className="text-2xl font-bold text-yellow-400">+</div>
                <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 font-bold text-base sm:text-lg text-amber-200">
                  {konstruktorReaksiyalar[konstIndeks].moddaB}
                </div>
              </div>

              {konstTanlov && (
                <div className="p-3.5 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 text-center font-mono font-bold text-yellow-300 text-sm sm:text-base">
                  {konstruktorReaksiyalar[konstIndeks].formula}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {konstruktorReaksiyalar[konstIndeks].variantlar.map((v) => {
                  const togri = v === konstruktorReaksiyalar[konstIndeks].togriNatija
                  let stil = "border-blue-800 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  if (konstTanlov !== null) {
                    if (togri) stil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-400/40"
                    else if (konstTanlov === v) stil = "border-rose-500 bg-rose-950/60 text-rose-200"
                  }
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => konstJavob(v)}
                      className={`p-4 rounded-2xl border font-bold text-sm sm:text-base transition text-left flex items-center justify-between ${stil}`}
                    >
                      <span>{v}</span>
                      {konstTanlov !== null && togri && <Ikon nom="tasdiq" olcham={18} className="text-emerald-400" />}
                    </button>
                  )
                })}
              </div>

              {konstTanlov !== null && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (konstIndeks + 1 < konstruktorReaksiyalar.length) {
                        setKonstIndeks((i) => i + 1)
                        setKonstTanlov(null)
                      } else {
                        setKonstIndeks(0)
                        setKonstTanlov(null)
                        setKonstBall(0)
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm"
                  >
                    {konstIndeks + 1 < konstruktorReaksiyalar.length ? "Keyingi reaksiya →" : "Qayta boshlash"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH) */}
          {oyinRejim === "duel" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-5">
              {!duelTugadi ? (
                <>
                  <div className="p-4 rounded-2xl border border-yellow-500/40 bg-[#081236] text-center space-y-1">
                    <div className="text-xs font-bold text-yellow-400">
                      {duelIndeks + 1} / {duelSavollari.length} — Navbat: {duelNavbat}-GURUH
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      {duelSavollari[duelIndeks].savol}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1-GURUH PANELI */}
                    <div className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                      duelNavbat === 1 ? "border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/15" : "border-blue-900/40 bg-[#060b22]/50 opacity-60"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 text-base">1-GURUH</span>
                        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 font-bold text-sm">{guruh1Ball} ball</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {duelSavollari[duelIndeks].variantlar.map((v) => (
                          <button
                            key={v}
                            type="button"
                            disabled={duelNavbat !== 1}
                            onClick={() => duelJavobBer(1, v)}
                            className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/35 text-white font-bold text-sm sm:text-base transition active:scale-95"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2-GURUH PANELI */}
                    <div className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                      duelNavbat === 2 ? "border-amber-400 bg-amber-950/30 shadow-lg shadow-amber-500/15" : "border-blue-900/40 bg-[#060b22]/50 opacity-60"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-base">2-GURUH</span>
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-bold text-sm">{guruh2Ball} ball</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {duelSavollari[duelIndeks].variantlar.map((v) => (
                          <button
                            key={v}
                            type="button"
                            disabled={duelNavbat !== 2}
                            onClick={() => duelJavobBer(2, v)}
                            className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/20 hover:bg-amber-500/35 text-white font-bold text-sm sm:text-base transition active:scale-95"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <h3 className="text-2xl font-bold text-yellow-300">
                    {guruh1Ball > guruh2Ball ? "1-GURUH G'OLIB!" : guruh2Ball > guruh1Ball ? "2-GURUH G'OLIB!" : "DO'STLIK G'ALABA QOZONDI (DURANG)!"}
                  </h3>
                  <div className="text-lg font-bold text-white">
                    1-Guruh: {guruh1Ball} ball | 2-Guruh: {guruh2Ball} ball
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDuelIndeks(0)
                      setGuruh1Ball(0)
                      setGuruh2Ball(0)
                      setDuelNavbat(1)
                      setDuelTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta bellashish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
