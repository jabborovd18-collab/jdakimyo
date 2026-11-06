"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"
import { QoshimchaKorgazma, QoshimchaOyin } from "@/components/maktab/SmartDoskaQoshimcha"

// Web Audio API yordamida interaktiv tovush effektlari (Smart doska)
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
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3)
      gain.gain.setValueAtTime(0.26, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32)
      osc.start(now)
      osc.stop(now + 0.32)
    } else if (turi === "suv") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(280, now)
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.25)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.27)
      osc.start(now)
      osc.stop(now + 0.27)
    } else if (turi === "olov") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (turi === "portlash") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "square"
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45)
      osc.start(now)
      osc.stop(now + 0.45)
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
    // Audio kontekst xatosi
  }
}

// 1.3-mavzuni takrorlash uchun darslik asosidagi blits-savollar
const takrorlashSavollari1_3 = [
  {
    id: 1,
    savol: "Ilmiy tadqiqotda 'Mustaqil o'zgaruvchi' deb nimaga aytiladi?",
    izoh: "Mustaqil o'zgaruvchi — tadqiqotchi o'z gipotezasini tekshirish uchun o'zi ataylab o'zgartiradigan asosiy omildir (masalan, suv harorati).",
    variantlar: [
      { matn: "Tadqiqotchi o'zi ataylab o'zgartiradigan omil", togri: true },
      { matn: "Sekundomer bilan o'lchanadigan natija", togri: false },
      { matn: "Bir xil saqlanadigan suv hajmi", togri: false },
      { matn: "Hech qachon o'zgarmaydigan asbob", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Shakarning suvda erish tezligi tekshirilayotganda 'Bog'liq o'zgaruvchi' qaysi biri?",
    izoh: "Bog'liq o'zgaruvchi — mustaqil omil ta'sirida o'zgaradigan va o'lchanadigan natijadir (bu yerda: to'liq erish vaqti).",
    variantlar: [
      { matn: "Shakarning to'liq erish vaqti (sekund)", togri: true },
      { matn: "Suvning harorati", togri: false },
      { matn: "Shakar donalarining o'lchami", togri: false },
      { matn: "Laboratoriya stakanining shakli", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Adolatli tajriba (Fair Test) o'tkazishning asosiy qoidasi nima?",
    izoh: "Adolatli tajribada faqat bitta mustaqil o'zgaruvchi o'zgaradi, qolgan barcha shartlar (hajm, massa, idish) qat'iy teng saqlanadi!",
    variantlar: [
      { matn: "Faqat bitta omil o'zgartirilib, qolgan sharoitlar bir xil saqlanishi", togri: true },
      { matn: "Hamma o'zgaruvchilarni birdaniga har xil qilish", togri: false },
      { matn: "Tajribani asboblarsiz ko'z bilan o'tkazish", togri: false },
      { matn: "Sekundomerni ishlatmaslik", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Qattiq quduq suvida sovun nima uchun yaxshi ko'piklanmadi?",
    izoh: "Qattiq suvdagi erigan Ca²⁺ va Mg²⁺ tuzlari sovun bilan birikib cho'kma hosil qiladi va ko'pik chiqishiga to'sqinlik qiladi.",
    variantlar: [
      { matn: "Suvdagi kalsiy va magniy tuzlari cho'kma bergani uchun", togri: true },
      { matn: "Suv juda sovuq bo'lgani uchun", togri: false },
      { matn: "Probirka kichik bo'lgani uchun", togri: false },
      { matn: "Sovun erib ketmagani uchun", togri: false },
    ],
  },
]

export default function Mavzu1_4() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "takrorlash" | "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar: 1..4
  // 1: "kislota" — Kislotani suyultirishning oltin qoidasi (To'g'ri vs Xato)
  // 2: "hidlash" — Hidlash san'ati (Wafting) va Tatib ko'rish taqiqi
  // 3: "piktogramma" — GHS Piktogrammalar interaktiv laboratoriyasi (5 ta tajriba)
  // 4: "favqulodda" — Favqulodda vaziyat va Birinchi yordam stansiyalari (Dush, Eyewash, Fire Blanket)
  const [animRejim, setAnimRejim] = useState("kislota")

  // Smart doska o'yinlari:
  // "inspektor" | "piktogramma"
  const [oyinRejim, setOyinRejim] = useState("inspektor")

  // To'liq ekran
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
  // 1-ANIMATSIYA: KISLOTANI SUYULTIRISHNING OLTIN QOIDASI (INTERAKTIV CANVAS)
  // Xato: Suvni kislotaga quyish -> Zichlik farqi, qaynash, sachrash va portlash!
  // To'g'ri: Kislotani suvga shisha tayoqcha bo'ylab ingichka oqim bilan quyish!
  // ═══════════════════════════════════════════════════════════════════════════
  const kislotaCanvasRef = useRef(null)
  const [kislotaUsuli, setKislotaUsuli] = useState("xato") // "xato" | "togri"
  const [kislotaQuyilmoqda, setKislotaQuyilmoqda] = useState(false)
  const [kislotaHarorat, setKislotaHarorat] = useState(20)
  const [kislotaHajm, setKislotaHajm] = useState(150) // ml

  const kislotaJarayoniniBoshlash = (usul) => {
    setKislotaUsuli(usul)
    setKislotaHarorat(20)
    setKislotaHajm(150)
    setKislotaQuyilmoqda(true)
    if (usul === "xato") {
      tovushChiqar("xavf")
    } else {
      tovushChiqar("suv")
    }
  }

  const kislotaniToxtatish = () => {
    setKislotaQuyilmoqda(false)
  }

  useEffect(() => {
    let timer
    if (kislotaQuyilmoqda) {
      timer = setInterval(() => {
        setKislotaHarorat((eski) => {
          const maqsad = kislotaUsuli === "xato" ? 128 : 42
          const qadam = kislotaUsuli === "xato" ? 5 : 1.5
          const yangi = eski + qadam
          if (yangi >= maqsad) {
            setKislotaQuyilmoqda(false)
            if (kislotaUsuli === "xato") {
              tovushChiqar("xavf")
            } else {
              tovushChiqar("tasdiq")
            }
            return maqsad
          }
          return yangi
        })
        setKislotaHajm((h) => Math.min(260, h + 3))
      }, 70)
    }
    return () => clearInterval(timer)
  }, [kislotaQuyilmoqda, kislotaUsuli])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "kislota") return
    const canvas = kislotaCanvasRef.current
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
    const CY = H / 2 + 10

    const sachrashZarralari = []
    const pufaklar = []
    let f = 0

    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stoli (qalin shisha / keramika)
      ctx.fillStyle = "#09122c"
      ctx.fillRect(0, H - 40, W, 40)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, H - 40)
      ctx.lineTo(W, H - 40)
      ctx.stroke()

      // Stakan o'lchamlari
      const bW = 180
      const bH = 200
      const bX = CX - bW / 2
      const bY = H - 40 - bH

      // Suyuqlik sath balandligi
      const liquidH = (kislotaHajm / 300) * (bH - 30)
      const liquidY = bY + bH - liquidH

      // Suyuqlikni chizish
      ctx.save()
      ctx.beginPath()
      ctx.rect(bX + 5, liquidY, bW - 10, liquidH)
      ctx.clip()

      if (kislotaUsuli === "xato") {
        // Xato usul: Stakanda quyuq sariq/qizil kislota, ustida yupqa qaynab turgan suv qatlami
        const grad = ctx.createLinearGradient(0, liquidY, 0, bY + bH)
        grad.addColorStop(0, "rgba(56, 189, 248, 0.75)") // Ustki suv
        grad.addColorStop(0.2, "rgba(239, 68, 68, 0.85)") // Zaharli qizil qaynash zonasi
        grad.addColorStop(1, "rgba(185, 28, 28, 0.95)") // Zich og'ir kislota tubi
        ctx.fillStyle = grad
        ctx.fillRect(bX + 5, liquidY, bW - 10, liquidH)

        // Shiddatli qaynash pufaklari
        if (kislotaHarorat > 60) {
          if (pufaklar.length < 25) {
            pufaklar.push({
              x: bX + 20 + Math.random() * (bW - 40),
              y: bY + bH - 10,
              r: Math.random() * 5 + 3,
              speed: Math.random() * 3 + 2,
            })
          }
        }
      } else {
        // To'g'ri usul: Stakanda ko'k toza suv, pastga cho'kayotgan kislota oqimi
        const grad = ctx.createLinearGradient(0, liquidY, 0, bY + bH)
        grad.addColorStop(0, "rgba(56, 189, 248, 0.6)") // Suv
        grad.addColorStop(0.7, "rgba(245, 158, 11, 0.65)") // Sekin aralashayotgan kislota
        grad.addColorStop(1, "rgba(217, 119, 6, 0.8)")
        ctx.fillStyle = grad
        ctx.fillRect(bX + 5, liquidY, bW - 10, liquidH)

        // Tinch aralashish pufakchalari
        if (pufaklar.length < 8) {
          pufaklar.push({
            x: bX + 30 + Math.random() * (bW - 60),
            y: bY + bH - 10,
            r: Math.random() * 2.5 + 1.5,
            speed: Math.random() * 1.5 + 0.5,
          })
        }
      }

      // Pufaklarni harakatlantirish
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
      for (let i = pufaklar.length - 1; i >= 0; i--) {
        const p = pufaklar[i]
        p.y -= p.speed
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.y <= liquidY) pufaklar.splice(i, 1)
      }
      ctx.restore()

      // SHISHA TAYOQCHA (Faqat To'g'ri usulda)
      if (kislotaUsuli === "togri") {
        ctx.strokeStyle = "rgba(241, 245, 249, 0.85)"
        ctx.lineWidth = 5
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(bX + 30, bY - 60)
        ctx.lineTo(bX + bW - 40, bY + bH - 10)
        ctx.stroke()

        // Shisha tayoqcha yorug'lik aksi
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(bX + 32, bY - 58)
        ctx.lineTo(bX + bW - 38, bY + bH - 12)
        ctx.stroke()
      }

      // SACHRASH FIZIKASI (Xato usulda sachrayotgan kislota tomchilari)
      if (kislotaUsuli === "xato" && kislotaHarorat > 75) {
        if (Math.random() > 0.3) {
          sachrashZarralari.push({
            x: CX + (Math.random() - 0.5) * 50,
            y: liquidY,
            vx: (Math.random() - 0.5) * 8,
            vy: -Math.random() * 10 - 5,
            r: Math.random() * 3.5 + 2,
          })
        }

        // Qizil xavfli bug' tutuni
        for (let s = 0; s < 6; s++) {
          const sy = liquidY - 20 - ((f * 35 + s * 22) % 110)
          const sx = CX + Math.sin(f * 2 + s) * 35
          ctx.fillStyle = "rgba(239, 68, 68, 0.3)"
          ctx.beginPath()
          ctx.arc(sx, sy, 16 + s * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Sachrayotgan tomchilarni chizish
      for (let i = sachrashZarralari.length - 1; i >= 0; i--) {
        const p = sachrashZarralari[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35 // Gravitatsiya
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.y > H - 40) sachrashZarralari.splice(i, 1)
      }

      // QUYILAYOTGAN IDISH VA OQIM
      if (kislotaQuyilmoqda) {
        ctx.save()
        const pourX = kislotaUsuli === "togri" ? bX + 30 : CX - 30
        const pourY = bY - 50

        // Egilgan kolba/probirka
        ctx.translate(pourX, pourY)
        ctx.rotate(-0.55)
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 3
        ctx.strokeRect(-14, -45, 28, 55)

        // Ichidagi suyuqlik
        ctx.fillStyle = kislotaUsuli === "xato" ? "rgba(56, 189, 248, 0.85)" : "rgba(245, 158, 11, 0.85)"
        ctx.fillRect(-12, -25, 24, 33)
        ctx.restore()

        // Tushayotgan ingichka oqim
        ctx.strokeStyle = kislotaUsuli === "xato" ? "#38bdf8" : "#f59e0b"
        ctx.lineWidth = 3.5
        ctx.beginPath()
        if (kislotaUsuli === "togri") {
          // Shisha tayoqcha bo'ylab silliq tushadi
          ctx.moveTo(bX + 30, bY - 45)
          ctx.lineTo(bX + 55, bY + 10)
          ctx.lineTo(bX + bW / 2, liquidY + 20)
        } else {
          // To'g'ridan-to'g'ri kislota ustiga tushadi
          ctx.moveTo(CX - 25, bY - 45)
          ctx.lineTo(CX, liquidY)
        }
        ctx.stroke()
      }

      // ASOSIY STAKAN SHISHA KORPUSI
      ctx.beginPath()
      ctx.moveTo(bX, bY)
      ctx.lineTo(bX, bY + bH - 12)
      ctx.arcTo(bX, bY + bH, bX + 12, bY + bH, 12)
      ctx.lineTo(bX + bW - 12, bY + bH)
      ctx.arcTo(bX + bW, bY + bH, bX + bW, bY + bH - 12, 12)
      ctx.lineTo(bX + bW, bY)
      ctx.lineWidth = 4
      ctx.strokeStyle = kislotaUsuli === "xato" && kislotaHarorat > 90 ? "#ef4444" : "rgba(241, 245, 249, 0.85)"
      ctx.stroke()

      // Stakandagi hajm graduslari (100, 200, 300 ml)
      ctx.fillStyle = "rgba(241, 245, 249, 0.6)"
      ctx.font = '10px "Times New Roman", serif'
      ;[100, 200, 300].forEach((ml) => {
        const my = bY + bH - (ml / 300) * (bH - 30)
        ctx.fillRect(bX + 5, my, 16, 2)
        ctx.fillText(`${ml} ml`, bX + 26, my + 4)
      })

      // STAKAN ICHIDAGI TERMOMETR
      const tX = bX + bW - 25
      ctx.fillStyle = "rgba(226, 232, 240, 0.85)"
      ctx.fillRect(tX - 3, bY - 50, 6, bH + 40)
      const simobH = (Math.min(kislotaHarorat, 130) / 130) * (bH - 15)
      ctx.fillStyle = kislotaHarorat > 80 ? "#ef4444" : "#38bdf8"
      ctx.fillRect(tX - 2, bY + bH - 10 - simobH, 4, simobH)
      ctx.beginPath()
      ctx.arc(tX, bY + bH - 6, 7, 0, Math.PI * 2)
      ctx.fill()

      // Termometr raqami
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillStyle = kislotaHarorat > 80 ? "#ef4444" : "#38bdf8"
      ctx.textAlign = "right"
      ctx.fillText(`${Math.round(kislotaHarorat)}°C`, tX - 10, bY - 30)

      // Xavf yoki xavfsizlik yorlig'i
      if (kislotaUsuli === "xato" && kislotaHarorat > 90) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.95)"
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("XAVF: QAYNASH VA SACHRASH!", CX, bY - 70)
      } else if (kislotaUsuli === "togri") {
        ctx.fillStyle = "#4ade80"
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("Xavfsiz aralashish (Shisha tayoqcha)", CX, bY - 70)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, kislotaUsuli, kislotaQuyilmoqda, kislotaHarorat, kislotaHajm])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: HIDLASH SAN'ATI (WAFTING) VA TATIB KO'RISH TAQIQLARI
  // Rejimlar: "wafting" (To'g'ri) | "yaqin" (Xato) | "tatib" (Taqiqlangan)
  // ═══════════════════════════════════════════════════════════════════════════
  const hidCanvasRef = useRef(null)
  const [hidlashRejim, setHidlashRejim] = useState("wafting") // "wafting" | "yaqin" | "tatib"
  const [hidSinoviBoshlandi, setHidSinoviBoshlandi] = useState(false)

  const hidSinoviniBoshlash = (rejim) => {
    setHidlashRejim(rejim)
    setHidSinoviBoshlandi(true)
    if (rejim === "wafting") {
      tovushChiqar("bosqich")
    } else {
      tovushChiqar("xavf")
    }
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "hidlash") return
    const canvas = hidCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    let f = 0
    const render = () => {
      f += 0.04
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

      if (hidlashRejim === "tatib") {
        // ─── TATIB KO'RISH TAQIQI REJIMI ───
        const c1X = W * 0.32
        const c2X = W * 0.68
        const dishY = H - 70

        // 1-tovoq: Oq shakar kukuni
        ctx.fillStyle = "rgba(226, 232, 240, 0.2)"
        ctx.beginPath()
        ctx.ellipse(c1X, dishY + 20, 60, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(226, 232, 240, 0.8)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Shakar donalari
        ctx.fillStyle = "#f8fafc"
        for (let i = 0; i < 40; i++) {
          const rx = c1X + (Math.sin(i * 99) * 45) * 0.7
          const ry = dishY + 12 + Math.cos(i * 33) * 6
          ctx.beginPath()
          ctx.arc(rx, ry, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillStyle = "#38bdf8"
        ctx.textAlign = "center"
        ctx.fillText("Oq kukun A: Shakar", c1X, dishY + 45)
        ctx.font = '11px "Times New Roman", serif'
        ctx.fillStyle = "#94a3b8"
        ctx.fillText("C₁₂H₂₂O₁₁ (Zararsiz)", c1X, dishY + 60)

        // 2-tovoq: O'ta zaharli mishyak / qo'rg'oshin tuzi
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)"
        ctx.beginPath()
        ctx.ellipse(c2X, dishY + 20, 60, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2
        ctx.stroke()

        // Zahar donalari (tashqi ko'rinishi 100% bir xil!)
        ctx.fillStyle = "#f8fafc"
        for (let i = 0; i < 40; i++) {
          const rx = c2X + (Math.sin(i * 77) * 45) * 0.7
          const ry = dishY + 12 + Math.cos(i * 44) * 6
          ctx.beginPath()
          ctx.arc(rx, ry, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillStyle = "#ef4444"
        ctx.textAlign = "center"
        ctx.fillText("Oq kukun B: Mishyak (Zahar)", c2X, dishY + 45)
        ctx.font = '11px "Times New Roman", serif'
        ctx.fillStyle = "#fca5a5"
        ctx.fillText("As₂O₃ (O'lim xavfi!)", c2X, dishY + 60)

        // O'rtadagi qat'iy taqiq belgisi
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(W / 2, dishY - 20, 32, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(W / 2 - 22, dishY - 42)
        ctx.lineTo(W / 2 + 22, dishY + 2)
        ctx.stroke()

        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillStyle = "#ef4444"
        ctx.fillText("TATIB KO'RISH MUTLAQO TAQIQLANADI!", W / 2, dishY - 65)
        ctx.font = '12px "Times New Roman", serif'
        ctx.fillStyle = "#f1f5f9"
        ctx.fillText("Ikkisi tashqi ko'rinishdan bir xil, lekin biri o'limga olib keladi!", W / 2, dishY + 25)
      } else {
        // ─── WAFTING YOKI TO'G'RIDAN-TO'G'RI HIDLASH ───
        const pX = W * 0.35
        const pY = H - 180
        const pW = 32
        const pH = 130

        // Probirka suyuqligi
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(pX - pW / 2, pY)
        ctx.lineTo(pX - pW / 2, pY + pH - 15)
        ctx.arcTo(pX - pW / 2, pY + pH, pX, pY + pH, 15)
        ctx.arcTo(pX + pW / 2, pY + pH, pX + pW / 2, pY + pH - 15, 15)
        ctx.lineTo(pX + pW / 2, pY)
        ctx.closePath()
        ctx.clip()

        ctx.fillStyle = "rgba(234, 179, 8, 0.45)"
        ctx.fillRect(pX - pW / 2, pY + 40, pW, pH - 40)
        ctx.restore()

        // Probirka devori
        ctx.beginPath()
        ctx.moveTo(pX - pW / 2, pY)
        ctx.lineTo(pX - pW / 2, pY + pH - 15)
        ctx.arcTo(pX - pW / 2, pY + pH, pX, pY + pH, 15)
        ctx.arcTo(pX + pW / 2, pY + pH, pX + pW / 2, pY + pH - 15, 15)
        ctx.lineTo(pX + pW / 2, pY)
        ctx.lineWidth = 3
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.stroke()

        // Probirka ushlagich (shtativ / qisqich)
        ctx.strokeStyle = "#64748b"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(pX + pW / 2, pY + 30)
        ctx.lineTo(pX + 60, pY + 30)
        ctx.lineTo(pX + 60, H - 40)
        ctx.stroke()

        // O'quvchi boshi (profil)
        const headX = hidlashRejim === "wafting" ? W * 0.75 : pX + 50
        const headY = hidlashRejim === "wafting" ? pY + 10 : pY - 20

        // Bosh va ko'zoynak
        ctx.fillStyle = "rgba(226, 232, 240, 0.9)"
        ctx.beginPath()
        ctx.arc(headX, headY, 26, 0, Math.PI * 2)
        ctx.fill()

        // Himoya ko'zoynagi
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 3.5
        ctx.strokeRect(headX - 18, headY - 10, 20, 16)

        // Burun
        ctx.beginPath()
        ctx.moveTo(headX - 26, headY)
        ctx.lineTo(headX - 35, headY + 8)
        ctx.lineTo(headX - 26, headY + 14)
        ctx.lineWidth = 2.5
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.stroke()

        // Laboratoriya xalati (yelka)
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.moveTo(headX - 15, headY + 26)
        ctx.lineTo(headX + 35, headY + 85)
        ctx.lineTo(headX - 45, headY + 85)
        ctx.closePath()
        ctx.fill()

        // ─── WAFTING HARAKATI: KAFT SILKIB YO'NALTIRISH ───
        if (hidlashRejim === "wafting") {
          const handX = pX + 50 + Math.sin(f * 5) * 20
          const handY = pY - 20

          // Kaft chizmasi
          ctx.strokeStyle = "#fbbf24"
          ctx.lineWidth = 4
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(handX + 15, handY - 25)
          ctx.lineTo(handX, handY)
          ctx.lineTo(handX + 8, handY + 20)
          ctx.stroke()

          // Shamol to'lqinlari (probirkadan burun tomon)
          for (let w = 0; w < 3; w++) {
            const wx = pX + 35 + w * 40 + ((f * 50) % 90)
            const wy = pY - 10 + Math.sin(f * 3 + w) * 10
            ctx.strokeStyle = "rgba(56, 189, 248, 0.5)"
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.arc(wx, wy, 18, -Math.PI / 4, Math.PI / 4)
            ctx.stroke()
          }

          ctx.font = 'bold 14px "Times New Roman", serif'
          ctx.fillStyle = "#4ade80"
          ctx.textAlign = "center"
          ctx.fillText("TO'G'RI: Kaft bilan havo yengil silkindi", W / 2, pY - 60)
          ctx.font = '12px "Times New Roman", serif'
          ctx.fillStyle = "#93c5fd"
          ctx.fillText("Idish 20 sm masofada. Gazning atigi 5% xavfsiz qismi burunga boradi.", W / 2, pY - 42)
        } else {
          // Xato: Bosh egib to'g'ridan-to'g'ri nafas olish
          // Zaharli to'q qizil tutun to'g'ridan-to'g'ri burunga kiradi
          for (let s = 0; s < 12; s++) {
            const bx = pX + ((f * 40 + s * 15) % 60)
            const by = pY - 5 - ((f * 30 + s * 10) % 40)
            ctx.fillStyle = "rgba(239, 68, 68, 0.65)"
            ctx.beginPath()
            ctx.arc(bx, by, 7 + (s % 4), 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "center"
          ctx.fillText("XAVFLI QOIDABUZARLIK!", W / 2, pY - 70)
          ctx.font = '12px "Times New Roman", serif'
          ctx.fillStyle = "#fca5a5"
          ctx.fillText("To'g'ridan-to'g'ri nafas olinsa, o'tkir zaharli bug' nafas yo'lini kuydiradi!", W / 2, pY - 52)
        }
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, hidlashRejim, hidSinoviBoshlandi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: GHS PIKTOGRAMMALAR JONLI LABORATORIYASI (5 TA REAL TAJRIBA)
  // 1: Alangalanuvchi (Spirt bug'i va olov)
  // 2: Yemiruvchi (Kislota tomchisi matoni teshib erishi)
  // 3: Toksik (Tortma shkaf ventilyatsiyasi ishlashi)
  // 4: Portlovchi (Zarba va parchalanish)
  // 5: Olov xavfsizligi (Spirtovkani qalpoqcha bilan to'g'ri o'chirish)
  // ═══════════════════════════════════════════════════════════════════════════
  const ghsCanvasRef = useRef(null)
  const [ghsTajriba, setGhsTajriba] = useState("alanga") // "alanga" | "korroziv" | "toksik" | "portlash" | "spirtovka"
  const [ghsHolat, setGhsHolat] = useState("tayyor") // "tayyor" | "ishlamoqda" | "yakunlandi"
  const [fumeHoodYondi, setFumeHoodYondi] = useState(false)
  const [spirtovkaQalpoq, setSpirtovkaQalpoq] = useState(false)

  const ghsTajribaniBoshlash = (tur) => {
    setGhsTajriba(tur)
    setGhsHolat("tayyor")
    setFumeHoodYondi(false)
    setSpirtovkaQalpoq(false)
    tovushChiqar("bosqich")
  }

  const ghsAmalniBajaring = () => {
    setGhsHolat("ishlamoqda")
    if (ghsTajriba === "alanga") {
      tovushChiqar("olov")
    } else if (ghsTajriba === "korroziv") {
      tovushChiqar("xavf")
    } else if (ghsTajriba === "toksik") {
      setFumeHoodYondi(!fumeHoodYondi)
      tovushChiqar("suv")
    } else if (ghsTajriba === "portlash") {
      tovushChiqar("portlash")
    } else if (ghsTajriba === "spirtovka") {
      setSpirtovkaQalpoq(true)
      tovushChiqar("tasdiq")
    }
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "piktogramma") return
    const canvas = ghsCanvasRef.current
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

    let f = 0
    const uchqunlar = []

    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stoli
      ctx.fillStyle = "#09122c"
      ctx.fillRect(0, H - 40, W, 40)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, H - 40)
      ctx.lineTo(W, H - 40)
      ctx.stroke()

      // ─── 1. TEZ ALANGALANUVCHI TAJRIBASI ───
      if (ghsTajriba === "alanga") {
        // Chapda spirtovka
        const sX = CX - 100
        const sY = H - 85
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)"
        ctx.fillRect(sX - 25, sY, 50, 45)

        // Spirtovka olovi
        const flameH = 30 + Math.sin(f * 10) * 6
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.moveTo(sX - 12, sY)
        ctx.quadraticCurveTo(sX, sY - flameH, sX + 12, sY)
        ctx.fill()
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.moveTo(sX - 6, sY)
        ctx.quadraticCurveTo(sX, sY - flameH * 0.7, sX + 6, sY)
        ctx.fill()

        // O'ngda Spirt / Efir shishasi
        const bX = CX + 90
        const bY = H - 120
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 3
        ctx.strokeRect(bX - 25, bY, 50, 80)
        ctx.fillStyle = "rgba(56, 189, 248, 0.3)"
        ctx.fillRect(bX - 22, bY + 25, 44, 52)

        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.fillStyle = "#f1f5f9"
        ctx.textAlign = "center"
        ctx.fillText("Etanol", bX, bY + 50)

        // Harakat: Bug' olovga yaqinlashganda chaqnash
        if (ghsHolat === "ishlamoqda") {
          for (let i = 0; i < 15; i++) {
            const bx = bX - 20 - ((f * 70 + i * 18) % 170)
            const by = bY + 30 + Math.sin(f * 4 + i) * 15
            ctx.fillStyle = "rgba(249, 115, 22, 0.8)"
            ctx.beginPath()
            ctx.arc(bx, by, Math.random() * 5 + 3, 0, Math.PI * 2)
            ctx.fill()
          }

          // Katta alanga chaqnashi
          ctx.fillStyle = "rgba(239, 68, 68, 0.85)"
          ctx.beginPath()
          ctx.arc(CX - 15, H - 80, 45 + Math.sin(f * 8) * 10, 0, Math.PI * 2)
          ctx.fill()

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.fillText("DIQQAT: BUG'LAR BIR ZUMDA ALANGA OLADI!", CX, H - 150)
        } else {
          ctx.font = '13px "Times New Roman", serif'
          ctx.fillStyle = "#fbbf24"
          ctx.textAlign = "center"
          ctx.fillText("'Sinovni boshlash' tugmasini bosing: bug'ning alangalanishini ko'ring", CX, H - 140)
        }
      }

      // ─── 2. YEMIRUVCHI / KORROZIV TAJRIBASI ───
      if (ghsTajriba === "korroziv") {
        const mX = CX
        const mY = H - 55

        // Paxta mato / metall sirt
        ctx.fillStyle = "#cbd5e1"
        ctx.fillRect(mX - 90, mY, 180, 15)

        // Yuqoridagi pipetka
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 3
        ctx.strokeRect(mX - 8, H - 160, 16, 60)

        if (ghsHolat === "ishlamoqda") {
          // Tomchining tushishi
          const dropY = H - 100 + ((f * 60) % 45)
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(mX, dropY, 5, 0, Math.PI * 2)
          ctx.fill()

          // Matoning o'yilib qorayishi
          ctx.fillStyle = "#1e293b"
          ctx.beginPath()
          ctx.arc(mX, mY + 7, 24, 0, Math.PI * 2)
          ctx.fill()

          // Kimyoviy kuydirish tutuni
          for (let i = 0; i < 6; i++) {
            const sy = mY - ((f * 40 + i * 20) % 70)
            const sx = mX + Math.sin(f * 3 + i) * 15
            ctx.fillStyle = "rgba(148, 163, 184, 0.4)"
            ctx.beginPath()
            ctx.arc(sx, sy, 8, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "center"
          ctx.fillText("KORROZIV TA'SIR: Modda mato va terini bir zumda kuydiradi!", CX, H - 170)
        } else {
          ctx.font = '13px "Times New Roman", serif'
          ctx.fillStyle = "#38bdf8"
          ctx.textAlign = "center"
          ctx.fillText("'Kislota tomizish' tugmasini bosing: sirtning yemirilishini ko'ring", CX, H - 170)
        }
      }

      // ─── 3. TOKSIK / TORTMA SHKAF TAJRIBASI ───
      if (ghsTajriba === "toksik") {
        // Tortma shkaf oynasi va korpusi
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 4
        ctx.strokeRect(CX - 120, H - 220, 240, 180)

        // Ventilyatsiya trubasi (yuqoriga)
        ctx.strokeRect(CX - 35, H - 270, 70, 50)

        // Shkaf ichidagi zaharli probirka
        ctx.fillStyle = "rgba(168, 85, 247, 0.6)"
        ctx.fillRect(CX - 15, H - 110, 30, 70)

        if (fumeHoodYondi) {
          // Ventilyatsiya so'rib olmoqda (Gaz quvurga tortilmoqda)
          for (let i = 0; i < 15; i++) {
            const vy = H - 110 - ((f * 60 + i * 15) % 150)
            const vx = CX + Math.sin(f * 2 + i) * 18
            ctx.fillStyle = "rgba(168, 85, 247, 0.5)"
            ctx.beginPath()
            ctx.arc(vx, vy, 6, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.font = 'bold 14px "Times New Roman", serif'
          ctx.fillStyle = "#4ade80"
          ctx.textAlign = "center"
          ctx.fillText("TORTMA SHKAF ISHLAMOQDA: Barcha zaharli gaz quvurga so'rildi!", CX, H - 235)
        } else {
          // Ventilyatsiya o'chiq bo'lsa: zaharli tutun xonaga tarqaladi
          for (let i = 0; i < 18; i++) {
            const vy = H - 110 - ((f * 30 + i * 10) % 90)
            const vx = CX + Math.sin(f + i) * 90
            ctx.fillStyle = "rgba(239, 68, 68, 0.4)"
            ctx.beginPath()
            ctx.arc(vx, vy, 12, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.font = 'bold 14px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "center"
          ctx.fillText("XAVF: Ventilyatsiya o'chiq! Zaharli gaz xonaga tarqalmoqda!", CX, H - 235)
        }
      }

      // ─── 4. PORTLOVCHI MODDALAR TAJRIBASI ───
      if (ghsTajriba === "portlash") {
        if (ghsHolat === "ishlamoqda") {
          // Portlash to'lqini
          const blastR = ((f * 80) % 90) + 15
          ctx.strokeStyle = "rgba(245, 158, 11, 0.8)"
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.arc(CX, H - 100, blastR, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = "rgba(239, 68, 68, 0.6)"
          ctx.beginPath()
          ctx.arc(CX, H - 100, blastR * 0.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.font = 'bold 16px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "center"
          ctx.fillText("PORTLASH XAVFI: Zarba yoki silkitishdan saqlang!", CX, H - 180)
        } else {
          // Beqaror idish
          ctx.strokeStyle = "#e2e8f0"
          ctx.lineWidth = 3
          ctx.strokeRect(CX - 25, H - 110, 50, 70)
          ctx.fillStyle = "rgba(234, 179, 8, 0.4)"
          ctx.fillRect(CX - 22, H - 85, 44, 45)

          ctx.font = '13px "Times New Roman", serif'
          ctx.fillStyle = "#facc15"
          ctx.textAlign = "center"
          ctx.fillText("'Zarba berish' tugmasini bosing: portlash xavfini ko'ring", CX, H - 140)
        }
      }

      // ─── 5. SPIRTOVKANI TO'G'RI O'CHIRISH (OLOV XAVFSIZLIGI) ───
      if (ghsTajriba === "spirtovka") {
        const sX = CX
        const sY = H - 90

        // Spirtovka tanasi
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)"
        ctx.fillRect(sX - 30, sY, 60, 50)

        if (!spirtovkaQalpoq) {
          // Olov yonib turibdi
          const flameH = 35 + Math.sin(f * 12) * 6
          ctx.fillStyle = "#f59e0b"
          ctx.beginPath()
          ctx.moveTo(sX - 14, sY)
          ctx.quadraticCurveTo(sX, sY - flameH, sX + 14, sY)
          ctx.fill()

          ctx.font = 'bold 14px "Times New Roman", serif'
          ctx.fillStyle = "#facc15"
          ctx.textAlign = "center"
          ctx.fillText("Spirtovkani aslo puflab o'chirmang! Faqat qalpoqcha bilan yoping.", CX, H - 150)
        } else {
          // Qalpoqcha yopildi
          ctx.fillStyle = "#334155"
          ctx.fillRect(sX - 18, sY - 20, 36, 25)

          // Oq ingichka tutun (olov o'chdi)
          ctx.strokeStyle = "rgba(241, 245, 249, 0.5)"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(sX, sY - 25)
          ctx.lineTo(sX + Math.sin(f * 2) * 8, sY - 55)
          ctx.stroke()

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#4ade80"
          ctx.textAlign = "center"
          ctx.fillText("TO'G'RI: Kislorod to'xtatildi, olov xavfsiz o'chdi!", CX, H - 150)
        }
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, ghsTajriba, ghsHolat, fumeHoodYondi, spirtovkaQalpoq])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: BIRINCHI YORDAM VA FAVQULODDA VAZIYAT STANSIYALARI
  // 1: Favqulodda xavfsizlik dushi (Emergency Shower - 15 daqiqa yuvish)
  // 2: Ko'z yuvish fontanchasi (Eyewash Station)
  // 3: Olovni o'chirish (O't o'chirish yopinchig'i vs Suv fojiasi)
  // ═══════════════════════════════════════════════════════════════════════════
  const yordamCanvasRef = useRef(null)
  const [yordamStansiya, setYordamStansiya] = useState("dush") // "dush" | "eyewash" | "yopinchiq"
  const [dushOqmoqda, setDushOqmoqda] = useState(false)
  const [yuvishVaqti, setYuvishVaqti] = useState(0) // 0..15 daqiqa
  const [olovUsuli, setOlovUsuli] = useState("yopinchiq") // "yopinchiq" | "suv_xato"

  const dushniYoqish = () => {
    setDushOqmoqda(true)
    setYuvishVaqti(0)
    tovushChiqar("suv")
  }

  useEffect(() => {
    let t
    if (dushOqmoqda) {
      t = setInterval(() => {
        setYuvishVaqti((v) => {
          if (v >= 15) {
            setDushOqmoqda(false)
            tovushChiqar("tasdiq")
            return 15
          }
          return v + 1
        })
      }, 500)
    }
    return () => clearInterval(t)
  }, [dushOqmoqda])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "favqulodda") return
    const canvas = yordamCanvasRef.current
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

      // Pol
      ctx.fillStyle = "#09122c"
      ctx.fillRect(0, H - 40, W, 40)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, H - 40)
      ctx.lineTo(W, H - 40)
      ctx.stroke()

      // ─── 1-STANSIYA: FAVQULODDA DUSH ───
      if (yordamStansiya === "dush") {
        // Tepadagi dush korpusi
        ctx.fillStyle = "#64748b"
        ctx.fillRect(CX - 40, 20, 80, 20)
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(CX, 0)
        ctx.lineTo(CX, 20)
        ctx.stroke()

        // Zanjir (tortish ushlagichi)
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(CX + 35, 35)
        ctx.lineTo(CX + 35, 120)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(CX + 35, 126, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#f59e0b"
        ctx.fill()

        // Odam silueti
        const oY = H - 40
        ctx.fillStyle = "#f8fafc"
        // Bosh
        ctx.beginPath()
        ctx.arc(CX, oY - 140, 22, 0, Math.PI * 2)
        ctx.fill()
        // Xalat (tana)
        ctx.beginPath()
        ctx.moveTo(CX - 30, oY)
        ctx.lineTo(CX - 22, oY - 118)
        ctx.lineTo(CX + 22, oY - 118)
        ctx.lineTo(CX + 30, oY)
        ctx.closePath()
        ctx.fill()

        // Teridagi kislota dog'lari (yuvilmagan bo'lsa qizil)
        if (yuvishVaqti < 12) {
          const dogRang = `rgba(239, 68, 68, ${Math.max(0.1, 1 - yuvishVaqti / 12)})`
          ctx.fillStyle = dogRang
          ctx.beginPath()
          ctx.arc(CX - 12, oY - 80, 10, 0, Math.PI * 2)
          ctx.arc(CX + 14, oY - 60, 12, 0, Math.PI * 2)
          ctx.fill()
        }

        // Suv oqimi (dushdan shiddatli yog'ilish)
        if (dushOqmoqda) {
          for (let i = 0; i < 30; i++) {
            const sx = CX - 35 + (i * 2.5) + Math.sin(f * 5 + i) * 6
            const sy = 40 + ((f * 80 + i * 25) % (H - 80))
            ctx.fillStyle = "rgba(56, 189, 248, 0.75)"
            ctx.fillRect(sx, sy, 2.5, 14)
          }

          // Polga sachrayotgan suv
          for (let p = 0; p < 8; p++) {
            ctx.fillStyle = "rgba(56, 189, 248, 0.6)"
            ctx.beginPath()
            ctx.arc(CX + Math.sin(f * 4 + p) * 60, H - 42, 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Taymer va ko'rsatkich
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillStyle = yuvishVaqti >= 15 ? "#4ade80" : "#38bdf8"
        ctx.textAlign = "center"
        ctx.fillText(
          `Yuvish vaqti: ${yuvishVaqti} / 15 daqiqa`,
          CX,
          H - 180
        )
      }

      // ─── 2-STANSIYA: KO'Z YUVISH FONTANCHASI (EYEWASH) ───
      if (yordamStansiya === "eyewash") {
        const eX = CX
        const eY = H - 90

        // Eyewash tog'orasi (chanoq)
        ctx.fillStyle = "rgba(226, 232, 240, 0.85)"
        ctx.beginPath()
        ctx.ellipse(eX, eY, 70, 20, 0, 0, Math.PI * 2)
        ctx.fill()

        // Ikkita purkagich fontanchasi
        ctx.fillStyle = "#eab308"
        ctx.fillRect(eX - 30, eY - 15, 10, 15)
        ctx.fillRect(eX + 20, eY - 15, 10, 15)

        // Yuqoriga purkayotgan ikkita yumshoq suv oqimi
        if (dushOqmoqda) {
          for (let i = 0; i < 20; i++) {
            const vy = eY - 15 - ((f * 50 + i * 15) % 80)
            const vx1 = eX - 25 + Math.sin(f * 3 + i) * 8
            const vx2 = eX + 25 + Math.sin(f * 3 + i) * 8
            ctx.fillStyle = "rgba(56, 189, 248, 0.75)"
            ctx.beginPath()
            ctx.arc(vx1, vy, 3.5, 0, Math.PI * 2)
            ctx.arc(vx2, vy, 3.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillStyle = "#38bdf8"
        ctx.textAlign = "center"
        ctx.fillText("Ko'zga kimyoviy modda sachrasa: Ko'zni pirpiratmay, 15 daqiqa uzluksiz yuving!", CX, H - 180)
      }

      // ─── 3-STANSIYA: OLOVNI O'CHIRISH (YOPINCHIQ VS SUV) ───
      if (yordamStansiya === "yopinchiq") {
        const fX = CX
        const fY = H - 65

        // Stol ustidagi yonayotgan spirt eritmasi
        if (olovUsuli === "suv_xato") {
          // Suv sepilsa: spirt suv yuziga qalqib butun stolga tarqaladi!
          for (let i = 0; i < 9; i++) {
            const fx = fX - 90 + i * 22 + Math.sin(f * 4 + i) * 6
            const fy = fY - 20 - Math.random() * 35
            ctx.fillStyle = "#ef4444"
            ctx.beginPath()
            ctx.arc(fx, fy, 15, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "center"
          ctx.fillText("FOJIAVIY XATO: Spirt oloviga suv sepmang! Olov yanada yoyiladi!", CX, H - 160)
        } else {
          // Yopinchiq bilan yopildi: Kislorod kesildi va olov butunlay o'chdi
          ctx.fillStyle = "#94a3b8"
          ctx.fillRect(fX - 70, fY - 10, 140, 20)

          ctx.font = 'bold 15px "Times New Roman", serif'
          ctx.fillStyle = "#4ade80"
          ctx.textAlign = "center"
          ctx.fillText("TO'G'RI: O't o'chirish yopinchig'i yoki qum kislorodni to'sdi!", CX, H - 160)
        }
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, yordamStansiya, dushOqmoqda, yuvishVaqti, olovUsuli])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "XAVFSIZLIK INSPEKTORI: 5 TA QOIDABUZARLIKNI FOSH ET!"
  // ═══════════════════════════════════════════════════════════════════════════
  const [xatolar, setXatolar] = useState({
    ovqat: false,
    suv_kislota: false,
    hidlash: false,
    xalat: false,
    olov: false,
  })
  const [inspektorTugadi, setInspektorTugadi] = useState(false)

  const xatoniTopish = (kalit) => {
    if (xatolar[kalit]) return
    const yangi = { ...xatolar, [kalit]: true }
    setXatolar(yangi)
    tovushChiqar("togri")
    if (Object.values(yangi).every(Boolean)) {
      setTimeout(() => {
        setInspektorTugadi(true)
        tovushChiqar("zafar")
      }, 500)
    }
  }

  const inspektorniQayta = () => {
    setXatolar({
      ovqat: false,
      suv_kislota: false,
      hidlash: false,
      xalat: false,
      olov: false,
    })
    setInspektorTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "PIKTOGRAMMA VIKTORINASI (GHS SAVOLLAR)"
  // ═══════════════════════════════════════════════════════════════════════════
  const piktogrammaSavollari = [
    {
      id: 1,
      modda: "Tibbiyot spirti (Etanol)",
      savol: "Spirt idishiga qaysi xavflilik belgisi qo'yilishi shart?",
      togriIkon: "olov",
      togriNom: "Tez alangalanuvchi",
      variantlar: ["Tez alangalanuvchi", "Yemiruvchi kislota", "Portlovchi", "Zaharli"],
    },
    {
      id: 2,
      modda: "Konsentrlangan Sulfat kislota (H2SO4)",
      savol: "Kuchli kislota idishiga qaysi belgi yopishtiriladi?",
      togriIkon: "tomchi",
      togriNom: "Yemiruvchi (Korroziv)",
      variantlar: ["Yemiruvchi (Korroziv)", "Tez alangalanuvchi", "Radioaktiv", "Xavfsiz"],
    },
    {
      id: 3,
      modda: "Simob dixlorid birikmasi (HgCl2)",
      savol: "Inson salomatligiga o'tkir zaharli ta'sir ko'rsatuvchi modda belgisi?",
      togriIkon: "ogohlantirish",
      togriNom: "Toksik (Zaharli)",
      variantlar: ["Toksik (Zaharli)", "Oddiy suv", "Tez eruvchi", "Yengil gaz"],
    },
    {
      id: 4,
      modda: "Ammoniy nitrat va beqaror peroksidlar",
      savol: "Zarba, ishqalanish yoki qizdirilganda portlash xavfi bor modda belgisi?",
      togriIkon: "chaqmoq",
      togriNom: "Portlovchi moddalar",
      variantlar: ["Portlovchi moddalar", "Kislota", "Ichimlik suvi", "Muzlatuvchi"],
    },
    {
      id: 5,
      modda: "Xlor gazi va o'tkir bug'lar",
      savol: "Uzoq vaqt nafas olinganda nafas yo'liga shikast yetkazuvchi modda belgisi?",
      togriIkon: "qalqon",
      togriNom: "Nafas yo'li uchun xavfli",
      variantlar: ["Nafas yo'li uchun xavfli", "Suv bug'i", "Xushbo'y hid", "Zararsiz"],
    },
  ]

  const [pikIndeks, setPikIndeks] = useState(0)
  const [tanlanganPik, setTanlanganPik] = useState(null)
  const [pikBall, setPikBall] = useState(0)
  const [pikTugadi, setPikTugadi] = useState(false)

  const pikJavobTanlash = (nom) => {
    if (tanlanganPik !== null) return
    setTanlanganPik(nom)
    const togri = nom === piktogrammaSavollari[pikIndeks].togriNom
    if (togri) {
      setPikBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiPik = () => {
    if (pikIndeks < piktogrammaSavollari.length - 1) {
      setPikIndeks((i) => i + 1)
      setTanlanganPik(null)
      tovushChiqar("bosqich")
    } else {
      setPikTugadi(true)
      tovushChiqar("zafar")
    }
  }

  const pikQayta = () => {
    setPikIndeks(0)
    setTanlanganPik(null)
    setPikBall(0)
    setPikTugadi(false)
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
        mavzuRaqam="1.4"
        mavzuNom="Kimyo laboratoriyasida texnika xavfsizligi qoidalari"
        bobNom="1-bob. Kirish"
        sahifa={9}
        oldingiRaqam="1.3"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          0-BO'LIM: O'TGAN DARSNI TAKRORLASH (1.3-MAVZU)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="1.3"
          oldingiNom="Kimyo fanini o'rganishda ilmiy tadqiqot metodlari"
          savollar={takrorlashSavollari1_3}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1-BO'LIM: TO'LIQ INTERAKTIV 4 TA ANIMATSIYA
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* 6 TA ANIMATSIYA MENYUSI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setAnimRejim("kislota")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "kislota"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="tomchi" olcham={16} />
              <span>1. Kislota + Suv</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("hidlash")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "hidlash"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="kuzatuv" olcham={16} />
              <span>2. Hidlash usuli</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("piktogramma")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "piktogramma"
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 ring-2 ring-purple-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
              }`}
            >
              <Ikon nom="ogohlantirish" olcham={16} />
              <span>3. GHS Belgilar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("favqulodda")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "favqulodda"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="qalqon" olcham={16} />
              <span>4. Birinchi yordam</span>
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
              <Ikon nom="shamol" olcham={16} />
              <span>5. Mo&apos;rili shkaf</span>
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
              <Ikon nom="olov" olcham={16} />
              <span>6. Probirkani qizdirish</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              1-ANIMATSIYA: KISLOTANI SUYULTIRISHNING OLTIN QOIDASI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "kislota" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={kislotaCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-semibold shadow-lg ${
                    kislotaUsuli === "xato"
                      ? "text-red-300 bg-red-950/90 border-red-500/50"
                      : "text-emerald-300 bg-emerald-950/90 border-emerald-500/50"
                  }`}>
                    {kislotaUsuli === "xato"
                      ? "QAT'IYAN TAQIQLANADI! Suv kislotadan yengil, u sirtda qolib lahzada qaynaydi va kislotani sachratadi!"
                      : "TO'G'RI USUL: Kislota shisha tayoqcha bo'ylab suvga ingichka oqimda quyiladi!"}
                  </span>
                </div>
              </div>

              {/* INTERAKTIV BOSHQARUV TUGMALARI */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => kislotaJarayoniniBoshlash("xato")}
                    disabled={kislotaQuyilmoqda && kislotaUsuli === "xato"}
                    className="px-4 py-2.5 rounded-xl border border-red-500/60 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                  >
                    <Ikon nom="ogohlantirish" olcham={16} />
                    <span>Xato: Suvni kislotaga quyish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => kislotaJarayoniniBoshlash("togri")}
                    disabled={kislotaQuyilmoqda && kislotaUsuli === "togri"}
                    className="px-4 py-2.5 rounded-xl border border-emerald-500/60 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                  >
                    <Ikon nom="tasdiq" olcham={16} />
                    <span>To&apos;g&apos;ri: Kislotani suvga quyish</span>
                  </button>

                  {kislotaQuyilmoqda && (
                    <button
                      type="button"
                      onClick={kislotaniToxtatish}
                      className="px-3.5 py-2.5 rounded-xl border border-blue-700 bg-blue-900/40 text-blue-200 text-xs font-bold hover:bg-blue-800/50"
                    >
                      To&apos;xtatish
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              2-ANIMATSIYA: HIDLASH SAN'ATI (WAFTING) VA TATIB KO'RISH TAQIQLARI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "hidlash" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={hidCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-semibold shadow-lg ${
                    hidlashRejim === "wafting"
                      ? "text-cyan-300 bg-cyan-950/90 border-cyan-500/40"
                      : "text-red-300 bg-red-950/90 border-red-500/40"
                  }`}>
                    {hidlashRejim === "wafting"
                      ? "To'g'ri texnika (Wafting): Kaft bilan bug' o'zingizga qarab yengil to'lqin qilib silkindi."
                      : hidlashRejim === "yaqin"
                      ? "Fojiali xato: Probirkaga burunni tiqib nafas olish nafas yo'lini kuydiradi!"
                      : "Qat'iy taqiq: Laboratoriyadagi oq kukun shakar ham, o'ta xavfli zahar ham bo'lishi mumkin!"}
                  </span>
                </div>
              </div>

              {/* 3 TA INTERAKTIV REJIM TUGMALARI */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => hidSinoviniBoshlash("wafting")}
                    className={`px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                      hidlashRejim === "wafting"
                        ? "border-cyan-400 bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-cyan-400/50"
                    }`}
                  >
                    <Ikon nom="tasdiq" olcham={16} />
                    <span>1. To&apos;g&apos;ri: Kaft bilan silkish (Wafting)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => hidSinoviniBoshlash("yaqin")}
                    className={`px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                      hidlashRejim === "yaqin"
                        ? "border-red-400 bg-red-500/30 text-red-200 ring-2 ring-red-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-red-400/50"
                    }`}
                  >
                    <Ikon nom="ogohlantirish" olcham={16} />
                    <span>2. Xato: Bosh egib nafas olish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => hidSinoviniBoshlash("tatib")}
                    className={`px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                      hidlashRejim === "tatib"
                        ? "border-amber-400 bg-amber-500/30 text-amber-200 ring-2 ring-amber-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-amber-400/50"
                    }`}
                  >
                    <Ikon nom="taqiq" olcham={16} />
                    <span>3. Tatib ko&apos;rish taqiqi (Mishyak vs Shakar)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              3-ANIMATSIYA: GHS PIKTOGRAMMALAR JONLI LABORATORIYASI (5 TA TAJRIBA)
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "piktogramma" && (
            <div className="space-y-3">
              {/* 5 TA TAJRIBA TANLOV TUGMASI */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => ghsTajribaniBoshlash("alanga")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ghsTajriba === "alanga"
                      ? "border-orange-500 bg-orange-500/25 text-orange-300 ring-2 ring-orange-500/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-orange-400/50"
                  }`}
                >
                  <Ikon nom="olov" olcham={16} />
                  <span>1. Alangalanuvchi</span>
                </button>

                <button
                  type="button"
                  onClick={() => ghsTajribaniBoshlash("korroziv")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ghsTajriba === "korroziv"
                      ? "border-red-500 bg-red-500/25 text-red-300 ring-2 ring-red-500/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-red-400/50"
                  }`}
                >
                  <Ikon nom="tomchi" olcham={16} />
                  <span>2. Yemiruvchi (Kislota)</span>
                </button>

                <button
                  type="button"
                  onClick={() => ghsTajribaniBoshlash("toksik")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ghsTajriba === "toksik"
                      ? "border-purple-500 bg-purple-500/25 text-purple-300 ring-2 ring-purple-500/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
                  }`}
                >
                  <Ikon nom="ogohlantirish" olcham={16} />
                  <span>3. Toksik (Tortma shkaf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => ghsTajribaniBoshlash("portlash")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ghsTajriba === "portlash"
                      ? "border-yellow-500 bg-yellow-500/25 text-yellow-300 ring-2 ring-yellow-500/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
                  }`}
                >
                  <Ikon nom="chaqmoq" olcham={16} />
                  <span>4. Portlovchi</span>
                </button>

                <button
                  type="button"
                  onClick={() => ghsTajribaniBoshlash("spirtovka")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ghsTajriba === "spirtovka"
                      ? "border-emerald-500 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-500/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
                  }`}
                >
                  <Ikon nom="qalqon" olcham={16} />
                  <span>5. Spirtovka o&apos;chirish</span>
                </button>
              </div>

              {/* JONLI CANVAS TAJRIBA POLIGONI */}
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={ghsCanvasRef} className="w-full h-full block" />
              </div>

              {/* AMAL TUGMASI VA MA'LUMOT */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-blue-200 max-w-lg">
                  {ghsTajriba === "alanga" && "Tez alangalanuvchi moddalar (spirt, efir, aseton) ochiq olov yonida ochilmaydi!"}
                  {ghsTajriba === "korroziv" && "Yemiruvchi kislotalar mato, metall va terini bir zumda teshib kuydiradi. Qo'lqop majburiy!"}
                  {ghsTajriba === "toksik" && "Zaharli bug'lar faqat tortma shkaf (Fume Hood) ventilyatsiyasi ostida ochilishi shart!"}
                  {ghsTajriba === "portlash" && "Beqaror birikmalar zarba, silkitish va qizdirilganda kuchli portlash to'lqini beradi!"}
                  {ghsTajriba === "spirtovka" && "Spirtovkani puflab o'chirish taqiqlanadi — olovni faqat qalpoqchasi bilan yopib o'chiring!"}
                </div>

                <button
                  type="button"
                  onClick={ghsAmalniBajaring}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg hover:scale-102"
                >
                  <Ikon nom="play" olcham={16} />
                  <span>
                    {ghsTajriba === "alanga" && "Bug'ni olovga yaqinlashtirish"}
                    {ghsTajriba === "korroziv" && "Kislota tomchisini tomizish"}
                    {ghsTajriba === "toksik" && (fumeHoodYondi ? "Ventilyatsiyani o'chirish" : "Tortma shkafni yoqish")}
                    {ghsTajriba === "portlash" && "Mexanik zarba berish"}
                    {ghsTajriba === "spirtovka" && "Qalpoqcha bilan yopish"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              4-ANIMATSIYA: BIRINCHI YORDAM VA FAVQULODDA VAZIYAT STANSIYALARI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "favqulodda" && (
            <div className="space-y-3">
              {/* 3 TA STANSIYA TANLOVI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setYordamStansiya("dush")
                    setDushOqmoqda(false)
                    tovushChiqar("bosqich")
                  }}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                    yordamStansiya === "dush"
                      ? "border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-400/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
                  }`}
                >
                  <Ikon nom="tomchi" olcham={16} />
                  <span>1. Favqulodda xavfsizlik dushi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYordamStansiya("eyewash")
                    setDushOqmoqda(false)
                    tovushChiqar("bosqich")
                  }}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                    yordamStansiya === "eyewash"
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
                  }`}
                >
                  <Ikon nom="kuzatuv" olcham={16} />
                  <span>2. Ko&apos;z yuvish fontanchasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYordamStansiya("yopinchiq")
                    setOlovUsuli("yopinchiq")
                    tovushChiqar("bosqich")
                  }}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                    yordamStansiya === "yopinchiq"
                      ? "border-amber-400 bg-amber-500/25 text-amber-300 ring-2 ring-amber-400/30"
                      : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-amber-400/50"
                  }`}
                >
                  <Ikon nom="olov" olcham={16} />
                  <span>3. Olovni o&apos;chirish (Yopinchiq)</span>
                </button>
              </div>

              {/* JONLI CANVAS SIMULYATOR */}
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={yordamCanvasRef} className="w-full h-full block" />
              </div>

              {/* STANSIYA BOSHQARUV PANELI */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                {yordamStansiya === "dush" && (
                  <button
                    type="button"
                    onClick={dushniYoqish}
                    disabled={dushOqmoqda}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
                  >
                    <Ikon nom="tomchi" olcham={16} />
                    <span>{dushOqmoqda ? `Dush oqmoqda (${yuvishVaqti}/15 daq)...` : "Zanjirni tortish (Dushni yoqish)"}</span>
                  </button>
                )}

                {yordamStansiya === "eyewash" && (
                  <button
                    type="button"
                    onClick={() => setDushOqmoqda(!dushOqmoqda)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
                  >
                    <Ikon nom="kuzatuv" olcham={16} />
                    <span>{dushOqmoqda ? "Suvni to'xtatish" : "Fontanchani ochish (Eyewash)"}</span>
                  </button>
                )}

                {yordamStansiya === "yopinchiq" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOlovUsuli("suv_xato")
                        tovushChiqar("xavf")
                      }}
                      className="px-3.5 py-2 rounded-xl border border-red-500/60 bg-red-500/20 text-red-300 font-bold text-xs"
                    >
                        Xato: Suv sepish
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOlovUsuli("yopinchiq")
                          tovushChiqar("tasdiq")
                        }}
                        className="px-3.5 py-2 rounded-xl border border-emerald-500/60 bg-emerald-500/20 text-emerald-300 font-bold text-xs"
                      >
                        To&apos;g&apos;ri: Yopinchiq yopish
                      </button>
                    </div>
                )}
              </div>
            </div>
          )}
          {(animRejim === "k5" || animRejim === "k6") && (
            <QoshimchaKorgazma mavzu="1.4" rejim={animRejim} />
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
                setOyinRejim("inspektor")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "inspektor"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="qalqon" olcham={18} />
              <span>1. Xavfsizlik Inspektori</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("piktogramma")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "piktogramma"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="ogohlantirish" olcham={18} />
              <span>2. GHS Piktogramma</span>
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
              <span>3. Xavfsizlik Qarori</span>
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

          {/* ─── 1-O'YIN: XAVFSIZLIK INSPEKTORI ─── */}
          {oyinRejim === "inspektor" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-2">
                    <Ikon nom="qalqon" olcham={20} />
                    <span>Topshiriq: Laboratoriyadagi 5 ta qo&apos;pol qoidabuzarlikni fosh eting!</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 pt-1">
                    Smart doskada o&apos;quvchilar yo&apos;l qo&apos;ygan xatolarni bosing va ularni to&apos;g&apos;rilang!
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                  Fosh etildi: {Object.values(xatolar).filter(Boolean).length} / 5
                </div>
              </div>

              {/* 5 TA QOIDABUZARLIK KARTALARI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Ovqatlanish */}
                <button
                  type="button"
                  onClick={() => xatoniTopish("ovqat")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-md active:scale-98 ${
                    xatolar.ovqat
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${xatolar.ovqat ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-yellow-300"}`}>
                    <Ikon nom={xatolar.ovqat ? "tasdiq" : "ogohlantirish"} olcham={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Laboratoriyada ovqatlanish va suv ichish</div>
                    <div className="text-xs text-blue-200/80 pt-1">
                      {xatolar.ovqat ? "Tuzatildi: Laboratoriyada ovqatlanish qat'iyan taqiqlandi!" : "Xato: Stol ustida pitsa va gazli ichimlik turibdi."}
                    </div>
                  </div>
                </button>

                {/* 2. Suvni kislotaga quyish */}
                <button
                  type="button"
                  onClick={() => xatoniTopish("suv_kislota")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-md active:scale-98 ${
                    xatolar.suv_kislota
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${xatolar.suv_kislota ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-yellow-300"}`}>
                    <Ikon nom={xatolar.suv_kislota ? "tasdiq" : "ogohlantirish"} olcham={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Suvni kislota ustiga quyish</div>
                    <div className="text-xs text-blue-200/80 pt-1">
                      {xatolar.suv_kislota ? "Tuzatildi: Qoida: 'Avval suv, keyin kislota!'" : "Xato: Kislotaga suv quyib sachratilmoqda."}
                    </div>
                  </div>
                </button>

                {/* 3. Hidlash */}
                <button
                  type="button"
                  onClick={() => xatoniTopish("hidlash")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-md active:scale-98 ${
                    xatolar.hidlash
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${xatolar.hidlash ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-yellow-300"}`}>
                    <Ikon nom={xatolar.hidlash ? "tasdiq" : "ogohlantirish"} olcham={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Burunni idishga tiqib hidlash</div>
                    <div className="text-xs text-blue-200/80 pt-1">
                      {xatolar.hidlash ? "Tuzatildi: Kaft bilan yengil shamol qilib hidlandi." : "Xato: O'tkir reaktiv to'g'ridan-to'g'ri nafas olinmoqda."}
                    </div>
                  </div>
                </button>

                {/* 4. Xalatsiz ishlash */}
                <button
                  type="button"
                  onClick={() => xatoniTopish("xalat")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-md active:scale-98 ${
                    xatolar.xalat
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${xatolar.xalat ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-yellow-300"}`}>
                    <Ikon nom={xatolar.xalat ? "tasdiq" : "ogohlantirish"} olcham={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Himoya ko&apos;zoynagi va xalatsiz ishlash</div>
                    <div className="text-xs text-blue-200/80 pt-1">
                      {xatolar.xalat ? "Tuzatildi: O'quvchi xalat va ko'zoynak kiyib oldi." : "Xato: Oddiy kiyimda, ko'zni himoya qilmay ishlamoqda."}
                    </div>
                  </div>
                </button>

                {/* 5. Yongan olov */}
                <button
                  type="button"
                  onClick={() => xatoniTopish("olov")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-md active:scale-98 ${
                    xatolar.olov
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${xatolar.olov ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-yellow-300"}`}>
                    <Ikon nom={xatolar.olov ? "tasdiq" : "ogohlantirish"} olcham={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Yongan spirtovkani qarovsiz qoldirish</div>
                    <div className="text-xs text-blue-200/80 pt-1">
                      {xatolar.olov ? "Tuzatildi: Spirtovka qalpog'i bilan darhol o'chirildi." : "Xato: Yonib turgan olov tashlab ketilgan."}
                    </div>
                  </div>
                </button>
              </div>

              {/* YAKUNIY G'ALABA */}
              {inspektorTugadi && (
                <div className="p-6 rounded-3xl border-2 border-yellow-500/70 bg-gradient-to-br from-yellow-950/40 via-[#0a102a] to-[#04081c] text-center space-y-3 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/50 mx-auto flex items-center justify-center text-yellow-400">
                    <Ikon nom="sertifikat" olcham={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-300">
                    Tabriklaymiz! Barcha xatolar fosh etildi va bartaraf qilindi!
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
                    Siz laboratoriya xavfsizligining oltin qoidalarini mukammal o&apos;zlashtirdingiz.
                    Endi siz haqiqiy <strong>«Xavfsiz Yosh Kimyogar»</strong> maqomiga egasiz!
                  </p>
                  <button
                    type="button"
                    onClick={inspektorniQayta}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg"
                  >
                    Tekshiruvni qaytadan boshlash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 2-O'YIN: PIKTOGRAMMA VIKTORINASI ─── */}
          {oyinRejim === "piktogramma" && (
            <div className="space-y-4">
              {!pikTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                        Reaktiv: {piktogrammaSavollari[pikIndeks].modda}
                      </span>
                      <h4 className="text-xs text-blue-300">
                        {piktogrammaSavollari[pikIndeks].savol}
                      </h4>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold text-xs">
                      {pikIndeks + 1} / {piktogrammaSavollari.length}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {piktogrammaSavollari[pikIndeks].variantlar.map((varNom) => {
                      const togri = varNom === piktogrammaSavollari[pikIndeks].togriNom
                      const tanlandi = tanlanganPik === varNom
                      let tugmaStil = "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"

                      if (tanlanganPik !== null) {
                        if (togri) {
                          tugmaStil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40"
                        } else if (tanlandi && !togri) {
                          tugmaStil = "border-red-500 bg-red-950/60 text-red-200"
                        }
                      }

                      return (
                        <button
                          key={varNom}
                          type="button"
                          onClick={() => pikJavobTanlash(varNom)}
                          className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-md active:scale-98 ${tugmaStil}`}
                        >
                          <span>{varNom}</span>
                          {tanlanganPik !== null && togri && (
                            <Ikon nom="tasdiq" olcham={20} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganPik !== null && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={keyingiPik}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20"
                      >
                        {pikIndeks < piktogrammaSavollari.length - 1 ? "Keyingi savolga o'tish" : "Natijani ko'rish"}
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
                    Piktogramma viktorinasi yakunlandi!
                  </h3>
                  <p className="text-base sm:text-lg text-emerald-300 font-bold">
                    To&apos;g&apos;ri javoblar: {pikBall} / {piktogrammaSavollari.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-200/90 max-w-md mx-auto leading-relaxed">
                    Siz kimyoviy moddalar idishlaridagi xavflilik belgilarini to&apos;g&apos;ri taniy olasiz va laboratoriyada xavfsiz ishlay olasiz!
                  </p>
                  <button
                    type="button"
                    onClick={pikQayta}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-xl"
                  >
                    Qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {(oyinRejim === "o3" || oyinRejim === "o4") && (
            <QoshimchaOyin mavzu="1.4" rejim={oyinRejim} />
          )}
        </div>
      )}
    </div>
  )
}
