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
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.18)
      gain.gain.setValueAtTime(0.16, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
    } else if (turi === "bosqich") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.15)
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

// 2.1-mavzuni takrorlash uchun darslik asosidagi blits-savollar (Moddaning tuzilishi)
const takrorlashSavollari2_1 = [
  {
    id: 1,
    savol: "Gazlarning suyuqlik va qattiq jismdan tub farqi nimada va nega ular oson siqiladi?",
    izoh: "Gaz zarrachalari orasidagi masofa zarracha diametridan 10-30 barobar katta va bo'shliqlar mavjud.",
    variantlar: [
      { matn: "Zarrachalar orasida ulkan bo'shliqlar bor va masofa zarracha diametridan 10-30 marta katta", togri: true },
      { matn: "Gaz zarrachalari bosim ostida erib suyuqlikka aylanadi", togri: false },
      { matn: "Gazlarning massasi nolga teng", togri: false },
      { matn: "Gaz zarrachalari qattiq jismdagidek bir-biriga zich yopishgan", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Grem naychasi tajribasida yengil NH3 (17 g/mol) va og'ir HCl (36.5 g/mol) to'qnashganda oq NH4Cl tutun halqasi qayerda hosil bo'ladi?",
    izoh: "Yengil ammiak tezroq uchadi, og'ir HCl sekinroq siljiydi. To'qnashuv HCl paxtasi yaqinida yuz beradi.",
    variantlar: [
      { matn: "Og'ir HCl paxtasiga yaqinroq (chunki NH3 1.46 barobar tezroq diffuziyalanadi)", togri: true },
      { matn: "Aynan naychaning qoq o'rtasida", togri: false },
      { matn: "Yengil NH3 paxtasiga yaqinroq", togri: false },
      { matn: "Naychaning tashqarisida", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Robert Broun (1827) mikroskopda ko'rgan gulchang zarrachalarining tartibsiz sakrashiga nima sabab bo'lgan?",
    izoh: "Eynshteyn-Perrin fizikasi: Ko'rinmas mayda suv molekulalarining to'xtovsiz tartibsiz issiqlik harakati va chang zarrachasiga har tomondan bergan zarbalari sabab bo'lgan.",
    variantlar: [
      { matn: "Ko'rinmas suv molekulalarining to'xtovsiz, tartibsiz termik zarbalari", togri: true },
      { matn: "Gulchangining tirik organizm sifatida suzishi", togri: false },
      { matn: "Mikroskop linzasining qizib ketishi", togri: false },
      { matn: "Gravitatsiya kuchining yo'qolishi", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Issiq suvda diffuziya tezligi sovuq suvga nisbatan nega keskin yuqori bo'ladi?",
    izoh: "Harorat ortishi bilan zarrachalarning o'rtacha kinetik energiyasi (Ek = 3/2 kT) va o'rtacha tezligi oshadi, natijada to'qnashuvlar va tarqalish tezlashadi.",
    variantlar: [
      { matn: "Harorat ko'tarilishi zarrachalarning kinetik energiyasi va tezligini oshiradi", togri: true },
      { matn: "Issiq suv moddani eritishdan to'xtaydi", togri: false },
      { matn: "Sovuq suvda zarrachalar butunlay harakatsiz qoladi", togri: false },
      { matn: "Issiq suvda tortishish kuchi ortadi", togri: false },
    ],
  },
]

export default function Mavzu2_2() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "takrorlash" | "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar: 1..4
  // 1: "egri_chiziq" — Qizdirish va Sovish egri chiziqlari (Ek va Ep tahlili, erish va qotish platolari)
  // 2: "buglanish_laboratoriyasi" — Qaynash vs Bug'lanish + Bug'lanish omillari (Sirt, Shamol, Harorat)
  // 3: "sublimatsiya" — Sublimatsiya va Desublimatsiya (Yod I2, Quruq muz CO2 tajribalari)
  // 4: "soflik_tekshiruvi" — Sof modda va Aralashma: Erish va qaynash nuqtalari orqali soflikni aniqlash
  const [animRejim, setAnimRejim] = useState("egri_chiziq")

  // O'yinlar: 1..2
  // "termodinamika" — Fazaviy o'tishlar va Energiya (Endotermik vs Ekzotermik)
  // "darslik_eksperti" — Qizdirish-sovish egri chizig'i va soflik ilmiy eksperti
  const [oyinRejim, setOyinRejim] = useState("termodinamika")

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
  // 1-ANIMATSIYA: QIZDIRISH VA SOVISH EGRI CHIZIQLARI (HEATING & COOLING)
  // Darslik 20-21-bet:
  // - Qizdirish: -20°C (Muz) -> Erish (0°C plato) -> Suv -> Qaynash (100°C plato) -> Bug' (125°C)
  // - Sovish: 125°C (Bug') -> Kondensatsiya (100°C plato) -> Suv -> Qotish (0°C plato) -> Muz (-20°C)
  // - Jonli Ek (Kinetik energiya ~ Harorat) va Ep (Potensial energiya ~ Bog'lar holati) hisobi!
  // ═══════════════════════════════════════════════════════════════════════════
  const egriCanvasRef = useRef(null)
  const [jarayonYonalishi, setJarayonYonalishi] = useState("qizdirish") // "qizdirish" | "sovish"
  const [egriVaqt, setEgriVaqt] = useState(0) // 0..100%
  const [egriFaol, setEgriFaol] = useState(false)
  const [egriTezlik, setEgriTezlik] = useState(1) // 1x | 2x

  // Harorat hisoblash funksiyasi
  const hisoblaHaroratVaEnergiya = (v, yonalish) => {
    let t = 0
    let ek = 50 // Kinetik energiya % (T ga mutanosib)
    let ep = 20 // Potensial energiya % (bog'larga mutanosib)
    let holatNomi = ""
    let ilmiyIzoh = ""

    if (yonalish === "qizdirish") {
      if (v <= 18) {
        // Muz qizishi (-20°C -> 0°C)
        t = -20 + (v / 18) * 20
        ek = Math.round(15 + (v / 18) * 20)
        ep = 15
        holatNomi = "Qattiq holat (Muz qizimoqda)"
        ilmiyIzoh = "Harorat ko'tarilmoqda: Zarrachalarning kinetik energiyasi (Ek) ortadi, potensial energiya (Ep) o'zgarmaydi."
      } else if (v <= 38) {
        // Erish platosi (0°C)
        t = 0
        ek = 35 // Ek o'zgarmaydi (chunki T o'zgarmaydi!)
        const ulush = (v - 18) / 20
        ep = Math.round(15 + ulush * 30) // Ep ortadi (bog'lar uzilmoqda)
        holatNomi = "Suyuqlanish (Erish platosi: Muz + Suv)"
        ilmiyIzoh = "DIQQAT: Harorat 0°C da mutlaqo o'zgarmas! Issiqlik energiyasi kristal panjarani parchalashga (Ep ortishiga) sarflanadi."
      } else if (v <= 68) {
        // Suv qizishi (0°C -> 100°C)
        t = ((v - 38) / 30) * 100
        ek = Math.round(35 + ((v - 38) / 30) * 45)
        ep = 45
        holatNomi = "Suyuq holat (Suv qizimoqda)"
        ilmiyIzoh = "Harorat ko'tarilmoqda: Molekulalar tezligi va kinetik energiyasi (Ek) shiddat bilan ortib bormoqda."
      } else if (v <= 90) {
        // Qaynash platosi (100°C)
        t = 100
        ek = 80 // Ek o'zgarmaydi!
        const ulush = (v - 68) / 22
        ep = Math.round(45 + ulush * 45) // Ep keskin ortadi
        holatNomi = "Qaynash platosi (Suv + Bug')"
        ilmiyIzoh = "DIQQAT: Harorat 100°C da doimiy! Issiqlik molekulalararo vodorod bog'larini butunlay uzishga (Ep ortishiga) sarflanadi."
      } else {
        // Bug' qizishi (100°C -> 125°C)
        t = 100 + ((v - 90) / 10) * 25
        ek = Math.round(80 + ((v - 90) / 10) * 20)
        ep = 90
        holatNomi = "Gaz holat (Suv bug'i qizimoqda)"
        ilmiyIzoh = "Zarrachalararo bog'lar to'liq uzilgan, gaz molekulalari ulkan kinetik energiya (Ek) bilan harakatlanadi."
      }
    } else {
      // SOVISH EGRI CHIZIG'I (Cooling Curve: 125°C -> -20°C)
      if (v <= 12) {
        // Bug' sovishi (125°C -> 100°C)
        t = 125 - (v / 12) * 25
        ek = Math.round(100 - (v / 12) * 20)
        ep = 90
        holatNomi = "Gaz holat (Bug' sovimoqda)"
        ilmiyIzoh = "Bug' sovimoqda: Molekulalarning o'rtacha kinetik energiyasi (Ek) kamaymoqda."
      } else if (v <= 34) {
        // Kondensatsiya platosi (100°C)
        t = 100
        ek = 80
        const ulush = (v - 12) / 22
        ep = Math.round(90 - ulush * 45) // Ep kamayadi (bog'lar qayta tiklanmoqda)
        holatNomi = "Kondensatsiya (Suyulish platosi: Bug' -> Suv)"
        ilmiyIzoh = "Harorat 100°C da doimiy! Zarrachalar o'zaro bog'lanib suyuqlik hosil qiladi va atrofga kondensatsiya issiqligi ajraladi."
      } else if (v <= 64) {
        // Suyuqlik sovishi (100°C -> 0°C)
        t = 100 - ((v - 34) / 30) * 100
        ek = Math.round(80 - ((v - 34) / 30) * 45)
        ep = 45
        holatNomi = "Suyuq holat (Suv sovimoqda)"
        ilmiyIzoh = "Suv sovimoqda: Harorat pasayishi natijasida molekulalarning harakat tezligi (Ek) pasayadi."
      } else if (v <= 84) {
        // Qotish platosi (0°C)
        t = 0
        ek = 35
        const ulush = (v - 64) / 20
        ep = Math.round(45 - ulush * 30) // Ep kamayadi (kristal panjara hosil bo'lmoqda)
        holatNomi = "Qotish (Muzlash platosi: Suv -> Muz)"
        ilmiyIzoh = "Harorat 0°C da doimiy! Suv molekulalari mustahkam kristal panjaraga birikadi va qotish issiqligi ajraladi."
      } else {
        // Muz sovishi (0°C -> -20°C)
        t = -((v - 84) / 16) * 20
        ek = Math.round(35 - ((v - 84) / 16) * 20)
        ep = 15
        holatNomi = "Qattiq holat (Muz sovimoqda)"
        ilmiyIzoh = "Muz sovimoqda: Zarrachalarning o'z o'rni atrofidagi tebranishlari yanada sekinlashadi."
      }
    }

    return { t: Math.round(t), ek, ep, holatNomi, ilmiyIzoh }
  }

  const joriyHolatMaLumot = hisoblaHaroratVaEnergiya(egriVaqt, jarayonYonalishi)

  useEffect(() => {
    let timer
    if (egriFaol) {
      timer = setInterval(() => {
        setEgriVaqt((v) => {
          const keyingi = v + 0.35 * egriTezlik
          if (keyingi >= 100) {
            setEgriFaol(false)
            tovushChiqar("zafar")
            return 100
          }
          if (
            (jarayonYonalishi === "qizdirish" && (Math.abs(keyingi - 18) < 0.4 || Math.abs(keyingi - 68) < 0.4)) ||
            (jarayonYonalishi === "sovish" && (Math.abs(keyingi - 12) < 0.4 || Math.abs(keyingi - 64) < 0.4))
          ) {
            tovushChiqar("bosqich")
          }
          return keyingi
        })
      }, 50)
    }
    return () => clearInterval(timer)
  }, [egriFaol, egriTezlik, jarayonYonalishi])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "egri_chiziq") return
    const canvas = egriCanvasRef.current
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
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // ─── CHAP TOMON: ILMIY GRAFIK ───
      const gX = 65
      const gY = 40
      const gW = W * 0.52
      const gH = H - 85

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)"
      ctx.fillRect(gX, gY, gW, gH)
      ctx.strokeStyle = "rgba(71, 85, 105, 0.5)"
      ctx.lineWidth = 1
      ctx.strokeRect(gX, gY, gW, gH)

      // Gorizontal to'r chiziqlari (Harorat belgilari: -20, 0, 50, 100, 125)
      const haroratlar = [
        { t: 125, label: "125°C" },
        { t: 100, label: "100°C (Qaynash/Kondensatsiya)", chiziq: true },
        { t: 50, label: "50°C" },
        { t: 0, label: "0°C (Erish/Qotish)", chiziq: true },
        { t: -20, label: "-20°C" },
      ]

      ctx.font = '11px "Times New Roman", serif'
      ctx.textAlign = "right"

      haroratlar.forEach((item) => {
        const yPos = gY + gH - ((item.t + 20) / 145) * gH
        ctx.fillStyle = item.chiziq ? "#facc15" : "#94a3b8"
        ctx.fillText(item.label, gX - 8, yPos + 4)

        ctx.strokeStyle = item.chiziq ? "rgba(250, 204, 21, 0.35)" : "rgba(51, 65, 85, 0.4)"
        ctx.setLineDash(item.chiziq ? [4, 4] : [2, 2])
        ctx.beginPath()
        ctx.moveTo(gX, yPos)
        ctx.lineTo(gX + gW, yPos)
        ctx.stroke()
        ctx.setLineDash([])
      })

      // O'qlar
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(gX, gY - 10)
      ctx.lineTo(gX, gY + gH)
      ctx.lineTo(gX + gW + 15, gY + gH)
      ctx.stroke()

      ctx.fillStyle = "#cbd5e1"
      ctx.textAlign = "center"
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.fillText("Harorat T (°C) ↑", gX + 15, gY - 18)
      ctx.fillText("Vaqt (t, daqiqa) →", gX + gW - 20, gY + gH + 22)

      // Chiziq nuqtalarini aniqlash
      let pts = []
      if (jarayonYonalishi === "qizdirish") {
        pts = [
          { x: gX, y: gY + gH - ((-20 + 20) / 145) * gH },
          { x: gX + gW * 0.18, y: gY + gH - ((0 + 20) / 145) * gH },
          { x: gX + gW * 0.38, y: gY + gH - ((0 + 20) / 145) * gH },
          { x: gX + gW * 0.68, y: gY + gH - ((100 + 20) / 145) * gH },
          { x: gX + gW * 0.9, y: gY + gH - ((100 + 20) / 145) * gH },
          { x: gX + gW, y: gY + gH - ((125 + 20) / 145) * gH },
        ]
      } else {
        // Sovish egri chizig'i
        pts = [
          { x: gX, y: gY + gH - ((125 + 20) / 145) * gH },
          { x: gX + gW * 0.12, y: gY + gH - ((100 + 20) / 145) * gH },
          { x: gX + gW * 0.34, y: gY + gH - ((100 + 20) / 145) * gH },
          { x: gX + gW * 0.64, y: gY + gH - ((0 + 20) / 145) * gH },
          { x: gX + gW * 0.84, y: gY + gH - ((0 + 20) / 145) * gH },
          { x: gX + gW, y: gY + gH - ((-20 + 20) / 145) * gH },
        ]
      }

      // Fon egri chiziq
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      pts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()

      // Faol chiziq
      const curX = gX + (egriVaqt / 100) * gW
      const curY = gY + gH - ((joriyHolatMaLumot.t + 20) / 145) * gH

      ctx.strokeStyle = jarayonYonalishi === "qizdirish" ? "#38bdf8" : "#a855f7"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)

      for (let i = 1; i < pts.length; i++) {
        if (curX >= pts[i].x) {
          ctx.lineTo(pts[i].x, pts[i].y)
        } else {
          ctx.lineTo(curX, curY)
          break
        }
      }
      ctx.stroke()

      // Joriy nuqta
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(curX, curY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = jarayonYonalishi === "qizdirish" ? "#0284c7" : "#7e22ce"
      ctx.lineWidth = 2.5
      ctx.stroke()

      // ─── O'NG TOMON: ILMIY HUD VA KINETIK / POTENSIAL ENERGIYA O'LCHAGICHLARI ───
      const bX = gX + gW + 20
      const bY = gY
      const bW = W - bX - 15
      const bH = gH

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)"
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
      ctx.lineWidth = 2
      ctx.fillRect(bX, bY, bW, bH)
      ctx.strokeRect(bX, bY, bW, bH)

      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = "left"
      ctx.fillStyle = "#facc15"
      ctx.fillText("ILMIY TERMODINAMIKA HUD:", bX + 12, bY + 22)

      ctx.font = '12px "Times New Roman", serif'
      ctx.fillStyle = "#38bdf8"
      ctx.fillText(`Holat: ${joriyHolatMaLumot.holatNomi}`, bX + 12, bY + 44)
      ctx.fillText(`Harorat (T): ${joriyHolatMaLumot.t}°C (${joriyHolatMaLumot.t + 273} K)`, bX + 12, bY + 64)

      // KINETIK ENERGIYA (Ek) BAR
      ctx.fillStyle = "#4ade80"
      ctx.fillText(`Kinetik energiya (Ek ~ T): ${joriyHolatMaLumot.ek}%`, bX + 12, bY + 90)
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(bX + 12, bY + 98, bW - 24, 10)
      ctx.fillStyle = "#22c55e"
      ctx.fillRect(bX + 12, bY + 98, ((bW - 24) * joriyHolatMaLumot.ek) / 100, 10)

      // POTENSIAL ENERGIYA (Ep) BAR
      ctx.fillStyle = "#f59e0b"
      ctx.fillText(`Potensial energiya (Ep ~ Bog'lar): ${joriyHolatMaLumot.ep}%`, bX + 12, bY + 128)
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(bX + 12, bY + 136, bW - 24, 10)
      ctx.fillStyle = "#eab308"
      ctx.fillRect(bX + 12, bY + 136, ((bW - 24) * joriyHolatMaLumot.ep) / 100, 10)

      // ZARRACHALAR VIZUAL MIKROSKOPI
      const zBoxX = bX + 12
      const zBoxY = bY + 155
      const zBoxW = bW - 24
      const zBoxH = bH - 200

      ctx.fillStyle = "#020617"
      ctx.fillRect(zBoxX, zBoxY, zBoxW, zBoxH)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)"
      ctx.strokeRect(zBoxX, zBoxY, zBoxW, zBoxH)

      ctx.save()
      ctx.beginPath()
      ctx.rect(zBoxX, zBoxY, zBoxW, zBoxH)
      ctx.clip()

      const curT = joriyHolatMaLumot.t
      if (curT < 0) {
        ctx.fillStyle = "#38bdf8"
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 5; c++) {
            const px = zBoxX + 20 + c * 20 + Math.sin(f * 8 + r * c) * 0.8
            const py = zBoxY + zBoxH - 15 - r * 20 + Math.cos(f * 8 + r * c) * 0.8
            ctx.beginPath()
            ctx.arc(px, py, 5.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      } else if (curT === 0) {
        ctx.fillStyle = "#38bdf8"
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 4; c++) {
            const px = zBoxX + 20 + c * 20 + Math.sin(f * 6 + r) * 1.5
            const py = zBoxY + zBoxH - 15 - r * 20
            ctx.beginPath()
            ctx.arc(px, py, 5.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.fillStyle = "#06b6d4"
        for (let i = 0; i < 10; i++) {
          const sx = zBoxX + 15 + ((i * 24 + f * 12) % (zBoxW - 30))
          const sy = zBoxY + zBoxH - 12 - (i % 3) * 14
          ctx.beginPath()
          ctx.arc(sx, sy, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (curT > 0 && curT < 100) {
        ctx.fillStyle = "#06b6d4"
        for (let i = 0; i < 18; i++) {
          const sx = zBoxX + 15 + ((i * 24 + f * 22) % (zBoxW - 30))
          const sy = zBoxY + zBoxH - 10 - ((i * 16 + Math.sin(f * 3 + i) * 12) % (zBoxH * 0.6))
          ctx.beginPath()
          ctx.arc(sx, sy, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (curT === 100) {
        ctx.fillStyle = "#06b6d4"
        for (let i = 0; i < 14; i++) {
          const sx = zBoxX + 15 + ((i * 25 + f * 35) % (zBoxW - 30))
          const sy = zBoxY + zBoxH - 10 - (i % 3) * 14
          ctx.beginPath()
          ctx.arc(sx, sy, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        for (let b = 0; b < 4; b++) {
          const bx = zBoxX + 20 + b * 22 + Math.sin(f * 6 + b) * 5
          const by = zBoxY + zBoxH - 10 - ((f * 55 + b * 25) % (zBoxH - 15))
          ctx.beginPath()
          ctx.arc(bx, by, 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        ctx.fillStyle = "#f59e0b"
        for (let i = 0; i < 12; i++) {
          const gx = zBoxX + 15 + ((i * 35 + f * 70) % (zBoxW - 30))
          const gy = zBoxY + 15 + ((i * 28 + f * 55) % (zBoxH - 30))
          ctx.beginPath()
          ctx.arc(gx, gy, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()

      // Pastki darslik xulosasi
      ctx.font = '11px "Times New Roman", serif'
      ctx.fillStyle = "#cbd5e1"
      ctx.fillText(joriyHolatMaLumot.ilmiyIzoh, bX + 12, bY + bH - 12)

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, egriVaqt, jarayonYonalishi, joriyHolatMaLumot])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: BUG'LANISH VA QAYNASHNING TUB FARQI + BUG'LANISH OMILLARI
  // Darslik 22-bet:
  // 1. Sirt yuzasi (Likopcha 60 cm² vs Tor probirka 3 cm²)
  // 2. Harorat (20°C vs 75°C)
  // 3. Shamol / Havo oqimi (Fan On/Off)
  // ═══════════════════════════════════════════════════════════════════════════
  const buglanishCanvasRef = useRef(null)
  const [idishTuri, setIdishTuri] = useState("likopcha") // "likopcha" | "probirka"
  const [labHarorat, setLabHarorat] = useState(25) // 10..80°C
  const [shamolBor, setShamolBor] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "buglanish_laboratoriyasi") return
    const canvas = buglanishCanvasRef.current
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
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stoli
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, H - 45, W, 45)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, H - 45)
      ctx.lineTo(W, H - 45)
      ctx.stroke()

      // Bug'lanish tezligi indeksi: v = (Sirt) * (T) * (Shamol)
      const sirtKoeff = idishTuri === "likopcha" ? 3.0 : 0.8
      const tempKoeff = Math.max(0.6, labHarorat / 25)
      const shamolKoeff = shamolBor ? 2.2 : 1.0
      const tezlikIndeks = Math.round(sirtKoeff * tempKoeff * shamolKoeff * 10) / 10

      // Idish parametrlari
      const CX = W * 0.45
      const botY = H - 55

      if (idishTuri === "likopcha") {
        // Keng yassi likopcha (Sirt katta)
        const lW = 240
        const lH = 45
        const lX = CX - lW / 2
        const lY = botY - lH

        // Suyuqlik
        ctx.fillStyle = "rgba(56, 189, 248, 0.45)"
        ctx.fillRect(lX + 8, lY + 15, lW - 16, lH - 18)

        // Shisha likopcha devori
        ctx.strokeStyle = "rgba(241, 245, 249, 0.9)"
        ctx.lineWidth = 3.5
        ctx.beginPath()
        ctx.moveTo(lX, lY)
        ctx.lineTo(lX + 15, lY + lH)
        ctx.lineTo(lX + lW - 15, lY + lH)
        ctx.lineTo(lX + lW, lY)
        ctx.stroke()

        // Sirtidan uchib chiqayotgan molekulalar
        const molekulaSoni = Math.min(25, Math.round(tezlikIndeks * 3))
        for (let i = 0; i < molekulaSoni; i++) {
          const shiftX = shamolBor ? (f * 60 + i * 20) % 180 : Math.sin(f * 2 + i) * 10
          const mx = lX + 25 + (i * 18) % (lW - 50) + shiftX
          const my = lY + 10 - ((f * 25 * tempKoeff + i * 15) % 85)
          ctx.fillStyle = "rgba(56, 189, 248, 0.85)"
          ctx.beginPath()
          ctx.arc(mx, my, 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Tor probirka (Sirt o'ta kichik)
        const pW = 50
        const pH = 160
        const pX = CX - pW / 2
        const pY = botY - pH

        // Suyuqlik
        ctx.fillStyle = "rgba(56, 189, 248, 0.45)"
        ctx.fillRect(pX + 4, pY + 45, pW - 8, pH - 49)

        // Probirka shishasi
        ctx.strokeStyle = "rgba(241, 245, 249, 0.9)"
        ctx.lineWidth = 3.5
        ctx.beginPath()
        ctx.moveTo(pX, pY)
        ctx.lineTo(pX, pY + pH - 15)
        ctx.arc(pX + pW / 2, pY + pH - 15, pW / 2, Math.PI, 0, true)
        ctx.lineTo(pX + pW, pY)
        ctx.stroke()

        // Faqat tor yuzadan 2-3 ta molekula uchadi
        const molekulaSoni = Math.min(6, Math.max(1, Math.round(tezlikIndeks * 0.8)))
        for (let i = 0; i < molekulaSoni; i++) {
          const shiftX = shamolBor ? (f * 45 + i * 15) % 80 : Math.sin(f * 2 + i) * 4
          const mx = pX + 15 + i * 10 + shiftX
          const my = pY + 40 - ((f * 20 * tempKoeff + i * 18) % 65)
          ctx.fillStyle = "rgba(56, 189, 248, 0.85)"
          ctx.beginPath()
          ctx.arc(mx, my, 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Shamol effekti (agar yoqiq bo'lsa)
      if (shamolBor) {
        ctx.strokeStyle = "rgba(226, 232, 240, 0.4)"
        ctx.lineWidth = 2
        for (let s = 0; s < 4; s++) {
          const sx = 30 + ((f * 90 + s * 70) % (W * 0.6))
          const sy = botY - 90 + s * 22
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(sx + 35, sy)
          ctx.stroke()
        }
        ctx.font = 'bold 12px "Times New Roman", serif'
        ctx.fillStyle = "#93c5fd"
        ctx.fillText("Shamol oqimi (Havoni haydaydi) →", 40, botY - 110)
      }

      // O'NG TOMONDA ILMIY TEZLIK HUD
      const hX = W * 0.68
      const hY = 40
      const hW = W - hX - 20
      const hH = H - 95

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)"
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
      ctx.lineWidth = 2
      ctx.fillRect(hX, hY, hW, hH)
      ctx.strokeRect(hX, hY, hW, hH)

      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = "left"
      ctx.fillStyle = "#facc15"
      ctx.fillText("BUG'LANISH METRIKASI:", hX + 12, hY + 25)

      ctx.font = '12px "Times New Roman", serif'
      ctx.fillStyle = "#38bdf8"
      ctx.fillText(`Idish yuzasi: ${idishTuri === "likopcha" ? "Keng (60 cm²)" : "Tor (3 cm²)"}`, hX + 12, hY + 55)
      ctx.fillText(`Harorat: ${labHarorat}°C`, hX + 12, hY + 80)
      ctx.fillText(`Havo oqimi: ${shamolBor ? "Mavjud (Shamolli)" : "Sokin havoda"}`, hX + 12, hY + 105)

      // Nisbiy tezlik indikatori
      ctx.fillStyle = "#4ade80"
      ctx.fillText(`Nisbiy bug'lanish tezligi: ${tezlikIndeks}x`, hX + 12, hY + 140)

      ctx.fillStyle = "#1e293b"
      ctx.fillRect(hX + 12, hY + 150, hW - 24, 14)
      const tezlikFoiz = Math.min(100, (tezlikIndeks / 8) * 100)
      ctx.fillStyle = tezlikFoiz > 60 ? "#ef4444" : tezlikFoiz > 30 ? "#f59e0b" : "#3b82f6"
      ctx.fillRect(hX + 12, hY + 150, ((hW - 24) * tezlikFoiz) / 100, 14)

      ctx.font = '11px "Times New Roman", serif'
      ctx.fillStyle = "#cbd5e1"
      ctx.fillText("Xulosa:", hX + 12, hY + 190)
      ctx.fillText("Sirt qancha keng, harorat", hX + 12, hY + 208)
      ctx.fillText("qancha baland va shamol", hX + 12, hY + 224)
      ctx.fillText("bo'lsa, bug'lanish shuncha", hX + 12, hY + 240)
      ctx.fillText("tez sodir bo'ladi!", hX + 12, hY + 256)

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, idishTuri, labHarorat, shamolBor])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: SUBLIMATSIYA VA DESUBLIMATSIYA (YOD I2 VA QURUQ MUZ CO2)
  // Darslik 23-bet: Qattiq -> Gaz (Suyuqliksiz!).
  // Moddani tanlash: Yod (I2) va Quruq muz (CO2).
  // ═══════════════════════════════════════════════════════════════════════════
  const sublimatsiyaCanvasRef = useRef(null)
  const [subModda, setSubModda] = useState("yod") // "yod" | "quruq_muz"
  const [qizdirgichYondi, setQizdirgichYondi] = useState(false)
  const [subProgress, setSubProgress] = useState(0)

  useEffect(() => {
    let t
    if (qizdirgichYondi) {
      t = setInterval(() => {
        setSubProgress((p) => {
          const keyingi = Math.min(100, p + 2.0)
          if (keyingi >= 100) tovushChiqar("tasdiq")
          return keyingi
        })
      }, 50)
    } else {
      t = setInterval(() => {
        setSubProgress((p) => Math.max(0, p - 1.2))
      }, 50)
    }
    return () => clearInterval(t)
  }, [qizdirgichYondi])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sublimatsiya") return
    const canvas = sublimatsiyaCanvasRef.current
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
    const sW = 160
    const sH = 190
    const sX = CX - sW / 2
    const sY = H / 2 - sH / 2 - 10

    let f = 0
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

      // Qizdirgich alangasi (agar yoqilgan bo'lsa)
      if (qizdirgichYondi) {
        const oY = sY + sH + 10
        ctx.fillStyle = "#f97316"
        ctx.beginPath()
        ctx.moveTo(CX - 18, oY + 24)
        ctx.quadraticCurveTo(CX, oY - Math.sin(f * 8) * 8, CX + 18, oY + 24)
        ctx.fill()
        ctx.fillStyle = "#facc15"
        ctx.beginPath()
        ctx.moveTo(CX - 10, oY + 24)
        ctx.quadraticCurveTo(CX, oY + 6 - Math.sin(f * 8) * 5, CX + 10, oY + 24)
        ctx.fill()
      }

      // STAKAN (LABORATORIYA STAKANI)
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)"
      ctx.fillRect(sX + 4, sY + 4, sW - 8, sH - 8)

      // ICHIDAGI BUG'LAR
      if (subProgress > 0) {
        const alpha = (subProgress / 100) * 0.75
        if (subModda === "yod") {
          // Binafsha yod bug'i
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`
          ctx.fillRect(sX + 4, sY + 4, sW - 8, sH - 8)
          for (let b = 0; b < 6; b++) {
            const bx = sX + 25 + b * 20 + Math.sin(f * 3 + b) * 8
            const by = sY + sH - 25 - ((f * 30 + b * 20) % (sH - 50))
            ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.8})`
            ctx.beginPath()
            ctx.arc(bx, by, 7, 0, Math.PI * 2)
            ctx.fill()
          }
        } else {
          // Oq quruq muz (CO2) tutuni
          ctx.fillStyle = `rgba(241, 245, 249, ${alpha * 0.8})`
          ctx.fillRect(sX + 4, sY + 4, sW - 8, sH - 8)
          for (let b = 0; b < 8; b++) {
            const bx = sX + 20 + b * 16 + Math.sin(f * 3 + b) * 10
            const by = sY + sH - 20 - ((f * 35 + b * 15) % (sH - 45))
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
            ctx.beginPath()
            ctx.arc(bx, by, 8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // TUBDAGI QATTIQ JISM
      if (subModda === "yod") {
        ctx.fillStyle = "#3b0764"
        for (let i = 0; i < 16; i++) {
          const kx = sX + 16 + i * 8
          const ky = sY + sH - 12 - (i % 3) * 4
          ctx.fillRect(kx, ky, 8, 8)
        }
      } else {
        ctx.fillStyle = "#e2e8f0"
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(sX + 20 + i * 20, sY + sH - 16, 16, 12)
        }
      }

      // TEPADAGI SOVUQ KOLBA (DESUBLIMATSIYA SIRTI)
      const kolbaR = 48
      ctx.fillStyle = "rgba(56, 189, 248, 0.45)"
      ctx.beginPath()
      ctx.arc(CX, sY + 15, kolbaR, 0, Math.PI)
      ctx.fill()
      ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Muz bo'laklari
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
      ctx.fillRect(CX - 20, sY + 5, 12, 12)
      ctx.fillRect(CX + 6, sY + 8, 14, 14)

      // Qayta hosil bo'layotgan kristallar (Desublimatsiya)
      if (subProgress > 30) {
        ctx.fillStyle = subModda === "yod" ? "#e9d5ff" : "#ffffff"
        ctx.strokeStyle = subModda === "yod" ? "#9333ea" : "#94a3b8"
        ctx.lineWidth = 1.5

        const kristalSoni = Math.round((subProgress / 100) * 12)
        for (let k = 0; k < kristalSoni; k++) {
          const angle = Math.PI * 0.15 + (k / 12) * Math.PI * 0.7
          const kx = CX + Math.cos(angle) * kolbaR
          const ky = sY + 15 + Math.sin(angle) * kolbaR
          ctx.beginPath()
          ctx.moveTo(kx, ky)
          ctx.lineTo(kx + 3, ky + 7)
          ctx.lineTo(kx - 3, ky + 7)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
      }

      // Stakan devorlari
      ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(sX, sY)
      ctx.lineTo(sX, sY + sH)
      ctx.lineTo(sX + sW, sY + sH)
      ctx.lineTo(sX + sW, sY)
      ctx.stroke()

      // Ilmiy sarlavha
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = "center"
      ctx.fillStyle = subModda === "yod" ? "#c084fc" : "#e2e8f0"
      ctx.fillText(
        subModda === "yod"
          ? "SUBLIMATSIYA: Qattiq Yod (I₂) → Suyuqliksiz to'g'ridan-to'g'ri Binafsha Bug'!"
          : "SUBLIMATSIYA: Quruq Muz (Qattiq CO₂) -78.5°C da to'g'ridan-to'g'ri Gazga aylanadi!",
        CX,
        30
      )

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, subModda, qizdirgichYondi, subProgress])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: SOF MODDA VS ARALASHMA (SOFLIK TESTI)
  // Darslik 25-bet:
  // - Toza suv: Aniq 0°C da eriydi, 100°C da qaynaydi (qat'iy gorizontal platolar)
  // - Tuzli suv (Aralashma): Konsentratsiya oshgani sari qaynash harorati ko'tariladi
  //   (102°C -> 108°C), erish harorati pasayadi (-2°C -> -8°C).
  // ═══════════════════════════════════════════════════════════════════════════
  const soflikCanvasRef = useRef(null)
  const [tuzKonsentratsiyasi, setTuzKonsentratsiyasi] = useState(0) // 0..25% (0 = Toza suv)

  // Tuz konsentratsiyasi bo'yicha fizik hisob (Raul va Ebullioskopiya qonuni)
  const hisoblanganErishT = -(tuzKonsentratsiyasi * 0.36)
  const hisoblanganQaynashT = 100 + tuzKonsentratsiyasi * 0.32

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "soflik_tekshiruvi") return
    const canvas = soflikCanvasRef.current
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
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const gX = 70
      const gY = 45
      const gW = W - 140
      const gH = H - 95

      ctx.fillStyle = "rgba(15, 23, 42, 0.75)"
      ctx.fillRect(gX, gY, gW, gH)
      ctx.strokeStyle = "rgba(71, 85, 105, 0.5)"
      ctx.lineWidth = 1
      ctx.strokeRect(gX, gY, gW, gH)

      const y0 = gY + gH - ((0 + 15) / 135) * gH
      const y100 = gY + gH - ((100 + 15) / 135) * gH

      ctx.strokeStyle = "rgba(250, 204, 21, 0.3)"
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(gX, y0)
      ctx.lineTo(gX + gW, y0)
      ctx.moveTo(gX, y100)
      ctx.lineTo(gX + gW, y100)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.font = '11px "Times New Roman", serif'
      ctx.fillStyle = "#facc15"
      ctx.textAlign = "right"
      ctx.fillText("100°C (Sof suv qaynashi)", gX - 8, y100 + 4)
      ctx.fillText("0°C (Sof suv erishi)", gX - 8, y0 + 4)

      // O'qlar
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(gX, gY)
      ctx.lineTo(gX, gY + gH)
      ctx.lineTo(gX + gW + 15, gY + gH)
      ctx.stroke()

      ctx.fillStyle = "#cbd5e1"
      ctx.textAlign = "center"
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.fillText("Harorat T (°C) ↑", gX + 25, gY - 12)
      ctx.fillText("Vaqt (t) →", gX + gW - 20, gY + gH + 22)

      if (tuzKonsentratsiyasi === 0) {
        // SOF SUV: Aniq gorizontal platolar
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(gX, gY + gH - (5 / 135) * gH)
        ctx.lineTo(gX + gW * 0.15, y0)
        ctx.lineTo(gX + gW * 0.35, y0) // Gorizontal erish platosi (0°C)
        ctx.lineTo(gX + gW * 0.65, y100)
        ctx.lineTo(gX + gW * 0.88, y100) // Gorizontal qaynash platosi (100°C)
        ctx.lineTo(gX + gW, y100 - 25)
        ctx.stroke()

        ctx.fillStyle = "#38bdf8"
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText("Aniq gorizontal plato: 0.0°C", gX + gW * 0.25, y0 - 10)
        ctx.fillText("Aniq gorizontal plato: 100.0°C", gX + gW * 0.76, y100 - 10)
      } else {
        // ARALASHMA (TUZLI SUV): Platolar qiyiq, erish pasaygan, qaynash ko'tarilgan
        const yErish = gY + gH - ((hisoblanganErishT + 15) / 135) * gH
        const yQaynash = gY + gH - ((hisoblanganQaynashT + 15) / 135) * gH

        ctx.strokeStyle = "#f97316"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(gX, gY + gH - (5 / 135) * gH)
        ctx.lineTo(gX + gW * 0.15, yErish)
        ctx.lineTo(gX + gW * 0.35, yErish - 6) // Qiyiq plato
        ctx.lineTo(gX + gW * 0.65, yQaynash)
        ctx.lineTo(gX + gW * 0.88, yQaynash - 10) // Qiyiq plato
        ctx.lineTo(gX + gW, yQaynash - 30)
        ctx.stroke()

        ctx.fillStyle = "#f97316"
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(`Plato yo'q! Erish oralig'i: ${hisoblanganErishT.toFixed(1)}°C ... 0°C`, gX + gW * 0.28, yErish + 24)
        ctx.fillText(`Qaynash oralig'i: ${hisoblanganQaynashT.toFixed(1)}°C ... ${(hisoblanganQaynashT + 4).toFixed(1)}°C`, gX + gW * 0.76, yQaynash - 20)
      }

      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.textAlign = "center"
      ctx.fillStyle = tuzKonsentratsiyasi === 0 ? "#38bdf8" : "#f97316"
      ctx.fillText(
        tuzKonsentratsiyasi === 0
          ? "SOF MODDA: Erish va qaynash nuqtalari mutlaqo doimiy va o'zgarmas (Platoli)!"
          : `ARALASHMA (${tuzKonsentratsiyasi}% Tuz): Erish harorati pasayadi (${hisoblanganErishT.toFixed(1)}°C), qaynash ko'tariladi (${hisoblanganQaynashT.toFixed(1)}°C)!`,
        W / 2,
        25
      )

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, tuzKonsentratsiyasi, hisoblanganErishT, hisoblanganQaynashT])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "FAZAVIY O'TISHLAR VA TERMODINAMIKA" (SMART DOSKA O'YINI)
  // Darslik 19-bet: Endotermik (issiqlik yutuvchi) vs Ekzotermik (issiqlik ajratuvchi)
  // ═══════════════════════════════════════════════════════════════════════════
  const termodinamikaSavollari = [
    {
      id: 1,
      vaziyat: "Muz bo'lagi iliq xonada erib suvga aylanmoqda",
      jarayon: "Suyuqlanish (Erish)",
      turi: "endotermik",
      tavsif: "Muz kristal panjarasini buzish uchun atrofdan issiqlik yutiladi",
    },
    {
      id: 2,
      vaziyat: "Qishda ko'l yuzidagi suv muzlab qotmoqda",
      jarayon: "Qotish (Muzlash)",
      turi: "ekzotermik",
      tavsif: "Molekulalar kristal panjaraga birikkanda atrofga issiqlik ajraladi",
    },
    {
      id: 3,
      vaziyat: "Choynakdagi suv olovda qizib bug'ga aylanmoqda",
      jarayon: "Qaynash va Bug'lanish",
      turi: "endotermik",
      tavsif: "Vodorod bog'larini uzish uchun uzluksiz issiqlik energiyasi yutiladi",
    },
    {
      id: 4,
      vaziyat: "Issiq dushdan so'ng ko'zgu yuzida shudring/tomchilar hosil bo'ldi",
      jarayon: "Kondensatsiya (Suyulish)",
      turi: "ekzotermik",
      tavsif: "Bug' molekulalari sovuq yuzaga urilib suyuqlikka aylanganda issiqlik chiqaradi",
    },
    {
      id: 5,
      vaziyat: "Qattiq yod kristallari qizdirilganda binafsha bug'ga aylandi",
      jarayon: "Sublimatsiya",
      turi: "endotermik",
      tavsif: "Qattiq modda to'g'ridan-to'g'ri gazga aylanishi uchun issiqlik yutiladi",
    },
    {
      id: 6,
      vaziyat: "Qattiq sovuq kechada deraza oynasida naqshli qirov paydo bo'ldi",
      jarayon: "Desublimatsiya",
      turi: "ekzotermik",
      tavsif: "Havadagi suv bug'i to'g'ridan-to'g'ri muz kristallariga aylanib issiqlik chiqaradi",
    },
  ]

  const [termoIndeks, setTermoIndeks] = useState(0)
  const [termoBall, setTermoBall] = useState(0)
  const [termoSongiTogri, setTermoSongiTogri] = useState(null)
  const [termoTugadi, setTermoTugadi] = useState(false)

  const termoTanlash = (tur) => {
    if (termoSongiTogri !== null) return
    const joriy = termodinamikaSavollari[termoIndeks]
    const togri = tur === joriy.turi
    setTermoSongiTogri(togri)

    if (togri) {
      setTermoBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }

    setTimeout(() => {
      if (termoIndeks < termodinamikaSavollari.length - 1) {
        setTermoIndeks((i) => i + 1)
        setTermoSongiTogri(null)
      } else {
        setTermoTugadi(true)
        tovushChiqar("zafar")
      }
    }, 1000)
  }

  const termoQayta = () => {
    setTermoIndeks(0)
    setTermoBall(0)
    setTermoSongiTogri(null)
    setTermoTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "DARSLIK ILMIY EKSPERTI" (VIKTORINA)
  // ═══════════════════════════════════════════════════════════════════════════
  const darslikSavollari = [
    {
      id: 1,
      savol: "Qizdirish egri chizig'ida erish (0°C) va qaynash (100°C) platolarida harorat nega mutlaqo ko'tarilmaydi?",
      variantlar: [
        "Berilayotgan issiqlik kinetik energiyani oshirmay, zarrachalararo bog'larni uzishga sarflanadi",
        "Termometr buzilib qolgani sababli",
        "Idishdagi modda yo'qolib ketgani uchun",
        "Atmosfera bosimi nolga tushib qolgani sababli",
      ],
      togri: "Berilayotgan issiqlik kinetik energiyani oshirmay, zarrachalararo bog'larni uzishga sarflanadi",
    },
    {
      id: 2,
      savol: "Qishda avtomobil yo'llaridagi muz ustiga nega osh tuzi sepiladi?",
      variantlar: [
        "Tuz qo'shilishi natijasida hosil bo'lgan eritmaning erish harorati 0°C dan pastga tushadi va muz eriydi",
        "Tuz muzni qizdirib olov chiqarishi sababli",
        "Tuz mashina g'ildiraklariga yopishishi uchun",
        "Muzni quritib bug'ga aylantirish uchun",
      ],
      togri: "Tuz qo'shilishi natijasida hosil bo'lgan eritmaning erish harorati 0°C dan pastga tushadi va muz eriydi",
    },
    {
      id: 3,
      savol: "Nima uchun yuvilgan ho'l kirlar issiq, shamolli kunda yoyib qo'yilganda juda tez quriydi?",
      variantlar: [
        "Bug'lanish tezligi yuqori harorat, katta sirt yuzasi va shamol tezligiga to'g'ridan-to'g'ri bog'liq",
        "Shamol kirlarning rangini ochadi",
        "Quyosh suvdagi vodorodni yoqib yuboradi",
        "Kirlar shamolda og'irlashadi",
      ],
      togri: "Bug'lanish tezligi yuqori harorat, katta sirt yuzasi va shamol tezligiga to'g'ridan-to'g'ri bog'liq",
    },
    {
      id: 4,
      savol: "Noma'lum qattiq oq modda qizdirilganda 115°C dan 122°C gacha oraliqda suyuqlandi. Bu modda toza sof moddami?",
      variantlar: [
        "Yo'q, u sof modda emas, chunki sof moddalar qat'iy bitta doimiy haroratda eriydi",
        "Ha, u 100% mutlaqo sof toza modda",
        "U suvning o'zi",
        "U metallmas modda",
      ],
      togri: "Yo'q, u sof modda emas, chunki sof moddalar qat'iy bitta doimiy haroratda eriydi",
    },
  ]

  const [darslikIndeks, setDarslikIndeks] = useState(0)
  const [tanlanganDarslik, setTanlanganDarslik] = useState(null)
  const [darslikBall, setDarslikBall] = useState(0)
  const [darslikTugadi, setDarslikTugadi] = useState(false)

  const darslikJavobTanlash = (v) => {
    if (tanlanganDarslik !== null) return
    setTanlanganDarslik(v)
    if (v === darslikSavollari[darslikIndeks].togri) {
      setDarslikBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiDarslik = () => {
    if (darslikIndeks < darslikSavollari.length - 1) {
      setDarslikIndeks((i) => i + 1)
      setTanlanganDarslik(null)
      tovushChiqar("bosqich")
    } else {
      setDarslikTugadi(true)
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
        mavzuRaqam="2.2"
        mavzuNom="Moddaning agregat holat o'zgarishlari"
        bobNom="2-bob. Modda xossalari"
        sahifa={19}
        oldingiRaqam="2.1"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 0-BO'LIM: 2.1-MAVZU BO'YICHA BLITS-TAKRORLASH                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="2.1"
          oldingiNom="Moddaning tuzilishi"
          savollar={takrorlashSavollari2_1}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 1-BO'LIM: 2.2-MAVZU ANIMATSIYALARI (6 TA ILMIY REJIM)               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#050c26] p-2 rounded-2xl border border-blue-900/60 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setAnimRejim("egri_chiziq")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "egri_chiziq"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="olov" olcham={18} />
              <span>1. Qizdirish va Sovish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("buglanish_laboratoriyasi")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "buglanish_laboratoriyasi"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="tomchi" olcham={18} />
              <span>2. Bug&apos;lanish omillari</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("sublimatsiya")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "sublimatsiya"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="kristall" olcham={18} />
              <span>3. Sublimatsiya (I₂/CO₂)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("soflik_tekshiruvi")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "soflik_tekshiruvi"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="tolqin" olcham={18} />
              <span>4. Soflik testi (NaCl)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k5")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "k5"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="tomchi" olcham={18} />
              <span>5. Kondensatsiya</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k6")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-center ${
                animRejim === "k6"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102"
                  : "text-blue-200 hover:bg-blue-900/40"
              }`}
            >
              <Ikon nom="olov" olcham={18} />
              <span>6. Tog&apos;da qaynash (Bosim)</span>
            </button>
          </div>

          {/* ─── 1-ANIMATSIYA: QIZDIRISH VA SOVISH EGRI CHIZIQLARI ─── */}
          {animRejim === "egri_chiziq" && (
            <div className="bg-[#050b24] p-4 sm:p-6 rounded-3xl border border-blue-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-yellow-300 flex items-center gap-2">
                  <Ikon nom="olov" olcham={20} />
                  <span>Qizdirish va Sovish egri chiziqlari</span>
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Qizdirish / Sovish tanlash */}
                  <div className="bg-[#091538] p-1 rounded-xl border border-blue-800/60 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setJarayonYonalishi("qizdirish")
                        setEgriVaqt(0)
                        setEgriFaol(false)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        jarayonYonalishi === "qizdirish"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-blue-300 hover:text-white"
                      }`}
                    >
                      Qizdirish egri chizig'i
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setJarayonYonalishi("sovish")
                        setEgriVaqt(0)
                        setEgriFaol(false)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        jarayonYonalishi === "sovish"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-purple-300 hover:text-white"
                      }`}
                    >
                      Sovish egri chizig'i
                    </button>
                  </div>

                  {!egriFaol ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (egriVaqt >= 100) setEgriVaqt(0)
                        setEgriFaol(true)
                        tovushChiqar("harorat")
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition"
                    >
                      <Ikon nom="play" olcham={16} />
                      <span>{egriVaqt >= 100 ? "Qayta boshlash" : "Boshlash"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEgriFaol(false)}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition"
                    >
                      <Ikon nom="soat" olcham={16} />
                      <span>To'xtatish</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setEgriFaol(false)
                      setEgriVaqt(0)
                      tovushChiqar("bosqich")
                    }}
                    className="p-2 rounded-xl border border-blue-700/60 bg-[#0a153a] text-blue-300 hover:text-white transition"
                    title="Nollash"
                  >
                    <Ikon nom="qayta" olcham={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEgriTezlik((t) => (t === 1 ? 2 : 1))}
                    className="px-2.5 py-1.5 rounded-xl border border-blue-700/60 bg-[#0a153a] text-xs font-bold text-cyan-300"
                  >
                    {egriTezlik}x
                  </button>
                </div>
              </div>

              {/* Interaktiv Canvas */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#020617]">
                <canvas ref={egriCanvasRef} className="w-full h-full block" />
              </div>

              {/* Vaqt slayderi */}
              <div className="bg-[#03091e] p-3.5 rounded-2xl border border-blue-900/60 flex items-center gap-4">
                <span className="text-xs font-bold text-yellow-300 shrink-0">Vaqt shkalasi:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={egriVaqt}
                  onChange={(e) => {
                    setEgriVaqt(parseFloat(e.target.value))
                    tovushChiqar("harorat")
                  }}
                  className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-xs font-bold text-cyan-300 shrink-0 min-w-[70px] text-right">
                  {Math.round(egriVaqt)}% vaqt
                </span>
              </div>
            </div>
          )}

          {/* ─── 2-ANIMATSIYA: BUG'LANISH OMILLARI TAJRIBASI ─── */}
          {animRejim === "buglanish_laboratoriyasi" && (
            <div className="bg-[#050b24] p-4 sm:p-6 rounded-3xl border border-blue-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-cyan-300 flex items-center gap-2">
                  <Ikon nom="tomchi" olcham={20} />
                  <span>Bug'lanish omillari</span>
                </h3>

                {/* Boshqaruv vositalari */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-[#091538] p-1 rounded-xl border border-blue-800/60 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIdishTuri("likopcha")
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        idishTuri === "likopcha"
                          ? "bg-cyan-600 text-white shadow-md"
                          : "text-blue-300 hover:text-white"
                      }`}
                    >
                      Keng likopcha (60 cm²)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdishTuri("probirka")
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        idishTuri === "probirka"
                          ? "bg-cyan-600 text-white shadow-md"
                          : "text-blue-300 hover:text-white"
                      }`}
                    >
                      Tor probirka (3 cm²)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShamolBor(!shamolBor)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      shamolBor
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-[#091538] border border-blue-800 text-blue-300 hover:text-white"
                    }`}
                  >
                    <Ikon nom="tolqin" olcham={16} />
                    <span>Shamol: {shamolBor ? "Yoqiq" : "O'chiq"}</span>
                  </button>
                </div>
              </div>

              {/* Interaktiv Canvas */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#020617]">
                <canvas ref={buglanishCanvasRef} className="w-full h-full block" />
              </div>

              {/* Harorat slayderi */}
              <div className="bg-[#03091e] p-3.5 rounded-2xl border border-blue-900/60 flex items-center gap-4">
                <span className="text-xs font-bold text-amber-300 shrink-0">Haroratni oshirish:</span>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={labHarorat}
                  onChange={(e) => {
                    setLabHarorat(parseInt(e.target.value))
                    tovushChiqar("harorat")
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-xs font-bold text-amber-300 shrink-0 min-w-[70px] text-right">
                  {labHarorat}°C
                </span>
              </div>
            </div>
          )}

          {/* ─── 3-ANIMATSIYA: SUBLIMATSIYA VA DESUBLIMATSIYA ─── */}
          {animRejim === "sublimatsiya" && (
            <div className="bg-[#050b24] p-4 sm:p-6 rounded-3xl border border-blue-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-purple-300 flex items-center gap-2">
                  <Ikon nom="kristall" olcham={20} />
                  <span>Sublimatsiya va Desublimatsiya (I₂ va CO₂)</span>
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-[#091538] p-1 rounded-xl border border-blue-800/60 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSubModda("yod")
                        setSubProgress(0)
                        setQizdirgichYondi(false)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        subModda === "yod"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-purple-300 hover:text-white"
                      }`}
                    >
                      Yod (I₂) kristallari
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubModda("quruq_muz")
                        setSubProgress(0)
                        setQizdirgichYondi(false)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        subModda === "quruq_muz"
                          ? "bg-slate-300 text-slate-950 shadow-md"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Quruq muz (Qattiq CO₂)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQizdirgichYondi(!qizdirgichYondi)
                      tovushChiqar("harorat")
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                      qizdirgichYondi
                        ? "bg-red-600 text-white shadow-red-500/30"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30"
                    }`}
                  >
                    <Ikon nom="olov" olcham={16} />
                    <span>{qizdirgichYondi ? "Alangani o'chirish" : "Alangani yoqish"}</span>
                  </button>
                </div>
              </div>

              {/* Interaktiv Canvas */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-purple-900/60 bg-[#020617]">
                <canvas ref={sublimatsiyaCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          )}

          {/* ─── 4-ANIMATSIYA: SOFLIK TEKSHIRUVI ─── */}
          {animRejim === "soflik_tekshiruvi" && (
            <div className="bg-[#050b24] p-4 sm:p-6 rounded-3xl border border-blue-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-2">
                  <Ikon nom="tolqin" olcham={20} />
                  <span>Erish va qaynash nuqtalari (Soflik testi)</span>
                </h3>
              </div>

              {/* Interaktiv Canvas */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#020617]">
                <canvas ref={soflikCanvasRef} className="w-full h-full block" />
              </div>

              {/* Tuz konsentratsiyasi slayderi */}
              <div className="bg-[#03091e] p-3.5 rounded-2xl border border-blue-900/60 flex items-center gap-4">
                <span className="text-xs font-bold text-emerald-300 shrink-0">Osh tuzi (NaCl) miqdori:</span>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={tuzKonsentratsiyasi}
                  onChange={(e) => {
                    setTuzKonsentratsiyasi(parseInt(e.target.value))
                    tovushChiqar("harorat")
                  }}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-xs font-bold text-emerald-300 shrink-0 min-w-[120px] text-right">
                  {tuzKonsentratsiyasi === 0 ? "0% (Sof toza suv)" : `${tuzKonsentratsiyasi}% Tuz eritmasi`}
                </span>
              </div>
            </div>
          )}
          {(animRejim === "k5" || animRejim === "k6") && (
            <QoshimchaKorgazma mavzu="2.2" rejim={animRejim} />
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 2-BO'LIM: SMART DOSKA O'YINLARI (4 TA O'YIN)                       */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "oyinlar" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-[#050c26] p-2 rounded-2xl border border-emerald-800/60 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setOyinRejim("termodinamika")
                tovushChiqar("bosqich")
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "termodinamika"
                  ? "bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30 scale-102"
                  : "text-emerald-200 hover:bg-emerald-950/40"
              }`}
            >
              <Ikon nom="yulduz" olcham={18} />
              <span>1. Termodinamika</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("darslik_eksperti")
                tovushChiqar("bosqich")
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "darslik_eksperti"
                  ? "bg-teal-600 text-slate-950 shadow-lg shadow-teal-500/30 scale-102"
                  : "text-teal-200 hover:bg-teal-950/40"
              }`}
            >
              <Ikon nom="kubok" olcham={18} />
              <span>2. Fazalar Viktorinasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o3")
                tovushChiqar("bosqich")
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o3"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-102"
                  : "text-cyan-200 hover:bg-cyan-950/40"
              }`}
            >
              <Ikon nom="tajriba" olcham={18} />
              <span>3. Fazalar Tahlili</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("o4")
                tovushChiqar("bosqich")
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "o4"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-102"
                  : "text-amber-200 hover:bg-amber-950/40"
              }`}
            >
              <Ikon nom="kubok" olcham={18} />
              <span>4. Jamoalar Dueli (1 vs 2)</span>
            </button>
          </div>

          {/* 1-O'YIN: TERMODINAMIKA (ENDOTERMIK VS EKZOTERMIK) */}
          {oyinRejim === "termodinamika" && (
            <div className="bg-[#050b24] p-5 sm:p-7 rounded-3xl border border-emerald-700/60 shadow-2xl space-y-6">
              {!termoTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-emerald-800/50 pb-4">
                    <div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {termoIndeks + 1} / {termodinamikaSavollari.length}-vaziyat
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        Hodisa: <span className="text-emerald-300">{termodinamikaSavollari[termoIndeks].vaziyat}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5">
                        Jarayon: {termodinamikaSavollari[termoIndeks].jarayon}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-emerald-300/80">Ball:</div>
                      <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                        {termoBall} ball
                      </div>
                    </div>
                  </div>

                  {/* Katta sensorli 2 ta tanlov tugmasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => termoTanlash("endotermik")}
                      className="min-h-[85px] p-5 rounded-2xl border-2 border-red-700/60 bg-[#1e1028] hover:border-red-400 hover:bg-[#2d123d] text-white font-bold text-base sm:text-lg flex flex-col items-center justify-center text-center shadow-lg active:scale-95 transition"
                    >
                      <span className="text-red-300 font-bold">ENDOTERMIK JARAYON</span>
                      <span className="text-xs text-red-200/70 mt-1">Issiqlik energiyasi yutiladi (bog'lar uziladi)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => termoTanlash("ekzotermik")}
                      className="min-h-[85px] p-5 rounded-2xl border-2 border-cyan-700/60 bg-[#071d3a] hover:border-cyan-400 hover:bg-[#0c2e5c] text-white font-bold text-base sm:text-lg flex flex-col items-center justify-center text-center shadow-lg active:scale-95 transition"
                    >
                      <span className="text-cyan-300 font-bold">EKZOTERMIK JARAYON</span>
                      <span className="text-xs text-cyan-200/70 mt-1">Issiqlik energiyasi ajraladi (bog'lar hosil bo'ladi)</span>
                    </button>
                  </div>

                  {termoSongiTogri !== null && (
                    <div
                      className={`p-4 rounded-2xl text-center font-bold text-sm sm:text-base ${
                        termoSongiTogri
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {termoSongiTogri
                        ? `Ofarin! ${termodinamikaSavollari[termoIndeks].tavsif}!`
                        : `Noto'g'ri! ${termodinamikaSavollari[termoIndeks].tavsif}.`}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-block p-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300">
                    <Ikon nom="yulduz" olcham={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Tabriklaymiz! O'yin muvaffaqiyatli yakunlandi!</h3>
                  <p className="text-base text-emerald-300 font-bold">
                    Siz {termodinamikaSavollari.length} tadan {termoBall} tasini to'g'ri aniqladingiz!
                  </p>
                  <button
                    type="button"
                    onClick={termoQayta}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-xl active:scale-95 transition"
                  >
                    Qaytadan o'ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2-O'YIN: DARSLIK ILMIY EKSPERTI */}
          {oyinRejim === "darslik_eksperti" && (
            <div className="bg-[#050b24] p-5 sm:p-7 rounded-3xl border border-teal-700/60 shadow-2xl space-y-6">
              {!darslikTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-teal-800/50 pb-4">
                    <div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                        {darslikIndeks + 1} / {darslikSavollari.length}-savol
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-2">
                        {darslikSavollari[darslikIndeks].savol}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-teal-300/80">Ball:</div>
                      <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                        {darslikBall} ball
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {darslikSavollari[darslikIndeks].variantlar.map((v, idx) => {
                      const tanlangan = tanlanganDarslik === v
                      const togri = v === darslikSavollari[darslikIndeks].togri
                      let btnRang = "bg-[#091538] border-teal-800/60 text-white hover:border-teal-400 hover:bg-[#0c1f54]"

                      if (tanlanganDarslik !== null) {
                        if (togri) {
                          btnRang = "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                        } else if (tanlangan) {
                          btnRang = "bg-red-600/30 border-red-500 text-red-200"
                        } else {
                          btnRang = "bg-[#091538]/40 border-teal-900/40 text-slate-400 opacity-60"
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => darslikJavobTanlash(v)}
                          className={`w-full min-h-[56px] p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 transition shadow-md ${btnRang}`}
                        >
                          <span>{v}</span>
                          {tanlanganDarslik !== null && togri && (
                            <Ikon nom="tasdiq" olcham={18} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganDarslik !== null && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={keyingiDarslik}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition"
                      >
                        {darslikIndeks < darslikSavollari.length - 1 ? "Keyingi savol →" : "Natijani ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-block p-4 rounded-full bg-teal-500/20 border-2 border-teal-400 text-teal-300">
                    <Ikon nom="kubok" olcham={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Viktorina yakunlandi!</h3>
                  <p className="text-base text-teal-300 font-bold">
                    To'plangan ball: {darslikBall} / {darslikSavollari.length} ball
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDarslikIndeks(0)
                      setTanlanganDarslik(null)
                      setDarslikBall(0)
                      setDarslikTugadi(false)
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-base shadow-xl active:scale-95 transition"
                  >
                    Qaytadan urinish
                  </button>
                </div>
              )}
            </div>
          )}

          {(oyinRejim === "o3" || oyinRejim === "o4") && (
            <QoshimchaOyin mavzu="2.2" rejim={oyinRejim} />
          )}
        </div>
      )}
    </div>
  )
}
