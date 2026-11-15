"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import { kadrSora, kadrniBekorQil, umumiyAudio } from "@/lib/maktab-animatsiya"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import { SmartDoskaNavigatsiya } from "@/components/maktab/SmartDoskaYordamchi"
import { QoshimchaKorgazma, QoshimchaOyin } from "@/components/maktab/SmartDoskaQoshimcha"

// Web Audio API yordamida interaktiv tovush effektlari
function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const ctx = umumiyAudio()
    if (!ctx) return
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
    } else if (turi === "suv") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.2)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc.start(now)
      osc.stop(now + 0.22)
    } else if (turi === "olov") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.25)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.27)
      osc.start(now)
      osc.stop(now + 0.27)
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

// 1.4-mavzuni takrorlash uchun darslik asosidagi blits-savollar (Texnika xavfsizligi)
const takrorlashSavollari1_4 = [
  {
    id: 1,
    savol: "Kislotani suv bilan suyultirishning oltin qoidasi qaysi javobda to'g'ri ko'rsatilgan?",
    izoh: "'Avval suv, keyin kislota!' Kislota suvga ingichka oqim bilan quyiladi.",
    variantlar: [
      { matn: "Kislota suvga ingichka oqim bilan quyiladi", togri: true },
      { matn: "Suv to'g'ridan-to'g'ri kislota ustiga quyiladi", togri: false },
      { matn: "Ikkisi birdaniga teng miqdorda quyiladi", togri: false },
      { matn: "Idish qizdirilib keyin suv quyiladi", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Laboratoriyada noma'lum moddaning hidini qanday sezish kerak?",
    izoh: "Idishni 15-20 sm masofada ushlab, kaftni idish og'zidan burun tomon yengil to'lqin qilib silkib yo'naltiriladi (Wafting texnikasi).",
    variantlar: [
      { matn: "Probirkaga puflab hidini chiqarish", togri: false },
      { matn: "Idish og'zidan kaftni silkib, bug'ni burun tomon yo'naltirish", togri: true },
      { matn: "Idishga bosh egib to'g'ridan-to'g'ri chuqur nafas olish", togri: false },
      { matn: "Moddani barmoqqa olib tilga tekkazib ko'rish", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Teriga kislota yoki ishqor to'kilsa, zudlik bilan qilinadigan birinchi yordam nima?",
    izoh: "Zararlangan joyni hech ikkilanmasdan zudlik bilan kamida 10-15 daqiqa davomida sovuq oqova suvda to'xtovsiz yuvish kerak!",
    variantlar: [
      { matn: "Spirt yoki yod surtib bog'lab qo'yish", togri: false },
      { matn: "Hech narsa qilmasdan o'z holiga qoldirish", togri: false },
      { matn: "Kamida 10-15 daqiqa davomida sovuq oqova suvda to'xtovsiz yuvish", togri: true },
      { matn: "Quruq latta bilan qattiq ishqalab artish", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Yonib turgan spirtovkani qanday qilib to'g'ri o'chirish kerak?",
    izoh: "Spirtovkani aslo puflab o'chirmaslik kerak! Uni faqat qalpoqchasi (qopqog'i) bilan yopib, havoni (kislorodni) to'sish orqali o'chiriladi.",
    variantlar: [
      { matn: "Og'iz bilan qattiq puflab", togri: false },
      { matn: "Ustiga sovuq suv sepib", togri: false },
      { matn: "Spirtovkani silkitib ag'darish orqali", togri: false },
      { matn: "Faqat qalpoqchasi bilan yopib, kislorodni to'sish orqali", togri: true },
    ],
  },
]

// 1.5-MAVZU: JIHOZLAR RO'YXATI VA ULARNING TAVSIFI (Darslik 11-13 betlar)
const JIHOZLAR_KATALOGI = [
  {
    id: "probirka",
    nom: "Probirka",
    tur: "Reaksiya idishi",
    sigim: "25 ml",
    material: "Borosilikat shisha (500°C)",
    ikon: "kolba",
    vazifa: "Kichik hajmdagi (1-5 ml) eritmalar bilan tezkor reaksiyalarni o'tkazish va qizdirish uchun.",
    qoida: "Qizdirilganda hajmining 1/3 qismidan ortiq to'ldirilmaydi. Og'zi odam yo'q tomonga qaratiladi.",
  },
  {
    id: "stakan",
    nom: "Laboratoriya stakani",
    tur: "Idish",
    sigim: "100-250 ml",
    material: "Kimyoviy shisha",
    ikon: "tomchi",
    vazifa: "Suyuqliklarni quyish, eritish, aralashtirish va vaqtincha saqlash uchun qulay keng og'izli idish.",
    qoida: "Ochiq olovda qizdirilganda tagiga asbest to'r qo'yilishi shart (aks holda shisha yoriladi).",
  },
  {
    id: "konus-kolba",
    nom: "Konussimon kolba (Erlenmeyer)",
    tur: "Idish",
    sigim: "120-250 ml",
    material: "Issiqbardosh shisha",
    ikon: "kolba",
    vazifa: "Titrlash, suyuqliklarni chayqatib aralashtirish uchun. Tor bo'yni suyuqlik sachrashining oldini oladi.",
    qoida: "Qopqoq bilan zich yopib uzoqroq saqlash mumkin.",
  },
  {
    id: "olchov-silindr",
    nom: "O'lchov silindri",
    tur: "Hajm o'lchash",
    sigim: "50-100 ml",
    material: "Shaffof shisha / Polipropilen",
    ikon: "vaqt",
    vazifa: "Suyuqliklar hajmini millimetr aniqlikda o'lchash uchun shkalali maxsus silindr.",
    qoida: "Meniskning PASTKI qismi bo'yicha ko'z sathi to'g'ri tutilib o'qiladi! Qizdirish taqiqlanadi.",
  },
  {
    id: "byuretka",
    nom: "Byuretka",
    tur: "Hajm o'lchash",
    sigim: "50 ml (0.1 ml bo'linmali)",
    material: "Nozik o'lchovli shisha",
    ikon: "tomchi",
    vazifa: "Titrlash jarayonida kislota yoki ishqor eritmasini tomchilab o'ta aniq o'lchab quyish uchun.",
    qoida: "Pastki jo'mragi (krani) orqali tomchilar tezligi aniq nazorat qilinadi.",
  },
  {
    id: "pipetka",
    nom: "Pipetka va Tomizgich",
    tur: "Hajm o'lchash",
    sigim: "1-25 ml",
    material: "Shisha / Rezina nokchali",
    ikon: "tomchi",
    vazifa: "Kichik, aniq belgilangan hajmda suyuqlikni so'rib olib boshqa idishga ko'chirish.",
    qoida: "Og'iz bilan so'rib olish qat'iyan man etiladi — faqat rezina nokcha ishlatiladi!",
  },
  {
    id: "voronka",
    nom: "Voronka va Filtr qog'oz",
    tur: "Ajratish jihozi",
    sigim: "Filtratsiya",
    material: "Shisha + G'ovakli qog'oz",
    ikon: "filtr",
    vazifa: "Eritmadagi erimagan qattiq cho'kma va loyqalarni suzib ajratish (filtratsiya) uchun.",
    qoida: "Eritma shisha tayoqcha bo'ylab ehtiyotkorlik bilan filtr qog'oziga quyiladi.",
  },
  {
    id: "spirtovka",
    nom: "Spirtovka (Alanga)",
    tur: "Qizdirish jihozi",
    sigim: "Spirt zaxirasi",
    material: "Shisha, paxta pilik, keramik qopqoq",
    ikon: "olov",
    vazifa: "Laboratoriyada xavfsiz qizdirish manbai (alanga harorati 800-1000°C gacha yetadi).",
    qoida: "Faqat qalpoqcha bilan yopib o'chiriladi. Puflash yoki yongan holda ko'tarib yurish taqiqlanadi.",
  },
  {
    id: "chinni-kosacha",
    nom: "Chinni kosacha",
    tur: "Issiqbardosh idish",
    sigim: "40-60 ml",
    material: "Laboratoriya chinnisi (1200°C)",
    ikon: "kristall",
    vazifa: "Eritmalarni ochiq olovda qizdirib bug'latish va quruq tuz kristallarini olish uchun.",
    qoida: "Ochiq olovga to'g'ridan-to'g'ri qo'yish mumkin, juda yuqori issiqlikka chidamli.",
  },
  {
    id: "shtativ",
    nom: "Laboratoriya shtativi",
    tur: "Mahkamlash asbobi",
    sigim: "Tayanch",
    material: "Og'ir quyma metall",
    ikon: "nizom",
    vazifa: "Kolbalar, probirkalar, byuretka va voronkalarni kerakli balandlikda mahkam tutib turish.",
    qoida: "Qisqichlarni idish shishasini sindirib qo'ymaydigan darajada me'yorda burash kerak.",
  },
]

export default function Mavzu1_5() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "takrorlash" | "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar (4 ta):
  // 1: "menisk" — Menisk bo'yicha hajm o'lchash (O'lchov silindri va parallaks xatosi)
  // 2: "alanga" — Spirtovka alangasining 3 ta zonasi va probirkani to'g'ri qizdirish
  // 3: "filtratsiya" — Suzish (filtratsiya) jarayoni va cho'kmalarni ajratish
  // 4: "katalog" — Jihozlar anatomiyasi va materiallar laboratoriyasi
  const [animRejim, setAnimRejim] = useState("menisk")

  // O'yinlar (2 ta):
  // 1: "yigish" — Jihozlar ustasi (Tajribaga mos komplektni yig'ish)
  // 2: "menisk_oyini" — Menisk detektivi (Aniq hajmni o'qish viktorinasi)
  const [oyinRejim, setOyinRejim] = useState("yigish")

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
  // 1-ANIMATSIYA: MENISK BO'YICHA HAJM O'LCHASH (INTERAKTIV SILINDR)
  // Botiq menisk qoidasi: ko'z sathi aynan pastki qatlam bilan teng bo'lishi kerak!
  // Yuqoridan qaralsa: ortiqcha o'qiladi. Pastdan qaralsa: kam o'qiladi.
  // ═══════════════════════════════════════════════════════════════════════════
  const meniskCanvasRef = useRef(null)
  const [kozPozitsiyasi, setKozPozitsiyasi] = useState("ortada") // "yuqori" | "ortada" | "past"
  const [suvHajmi, setSuvHajmi] = useState(60) // Haqiqiy hajm: 60 ml

  const kozniOzgartirish = (poz) => {
    setKozPozitsiyasi(poz)
    if (poz === "ortada") {
      tovushChiqar("tasdiq")
    } else {
      tovushChiqar("xato")
    }
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "menisk") return
    const canvas = meniskCanvasRef.current
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
      f += 0.04
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

      // O'LCHOV SILINDRI
      const cW = 100
      const cH = 280
      const cX = CX - cW / 2
      const cY = H - 40 - cH

      // Silindr asosi (og'ir shisha taglik)
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)"
      ctx.beginPath()
      ctx.ellipse(CX, H - 40, 70, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(226, 232, 240, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Suv sathi hisobi (0..100 ml)
      const liquidH = (suvHajmi / 100) * (cH - 40)
      const meniscusCenterY = cY + cH - 20 - liquidH

      // Suyuqlikni chizish (Botiq menisk bilan)
      ctx.save()
      ctx.beginPath()
      ctx.rect(cX + 4, meniscusCenterY - 10, cW - 8, liquidH + 20)
      ctx.clip()

      // Moviy suv gradienti
      const waterGrad = ctx.createLinearGradient(0, meniscusCenterY, 0, cY + cH)
      waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.8)")
      waterGrad.addColorStop(1, "rgba(2, 132, 199, 0.95)")
      ctx.fillStyle = waterGrad
      ctx.fillRect(cX + 4, meniscusCenterY - 10, cW - 8, liquidH + 20)

      // Botiq menisk egriligi (yuqorisi o'rtaga qarab cho'kkan)
      ctx.fillStyle = "#030612"
      ctx.beginPath()
      ctx.moveTo(cX + 4, meniscusCenterY - 10)
      ctx.lineTo(cX + 4, meniscusCenterY - 6)
      ctx.quadraticCurveTo(CX, meniscusCenterY + 8, cX + cW - 4, meniscusCenterY - 6)
      ctx.lineTo(cX + cW - 4, meniscusCenterY - 10)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Menisk sirti nuri (chiroyli egrilik)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(cX + 5, meniscusCenterY - 6)
      ctx.quadraticCurveTo(CX, meniscusCenterY + 8, cX + cW - 5, meniscusCenterY - 6)
      ctx.stroke()

      // SILINDR SHISHA KORPUSI
      ctx.strokeStyle = "rgba(241, 245, 249, 0.85)"
      ctx.lineWidth = 3.5
      ctx.strokeRect(cX, cY, cW, cH)

      // SHKALA BO'LINMALARI (0 dan 100 ml gacha)
      ctx.fillStyle = "rgba(241, 245, 249, 0.8)"
      ctx.font = '11px "Times New Roman", serif'
      ctx.textAlign = "left"
      for (let ml = 10; ml <= 100; ml += 10) {
        const sy = cY + cH - 20 - (ml / 100) * (cH - 40)
        ctx.fillRect(cX + 4, sy, 16, 2)
        ctx.fillText(`${ml}`, cX + 24, sy + 4)

        // Kichik 5 ml bo'linmalari
        if (ml < 100) {
          const subY = cY + cH - 20 - ((ml + 5) / 100) * (cH - 40)
          ctx.fillRect(cX + 4, subY, 9, 1.5)
        }
      }

      // ─── KO'Z VA PARALLAKS NURI (O'QUVCHI KO'RISH CHIZIG'I) ───
      const eyeX = CX + 140
      let eyeY = meniscusCenterY + 4 // Ortada (to'g'ri)
      let oqilganHajm = suvHajmi
      let nurRang = "#4ade80"

      if (kozPozitsiyasi === "yuqori") {
        eyeY = meniscusCenterY - 55
        oqilganHajm = suvHajmi + 6
        nurRang = "#ef4444"
      } else if (kozPozitsiyasi === "past") {
        eyeY = meniscusCenterY + 55
        oqilganHajm = suvHajmi - 6
        nurRang = "#ef4444"
      }

      // Ko'z chizmasi (Ikonik ko'z)
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.ellipse(eyeX, eyeY, 18, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0284c7"
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, 3.5, 0, Math.PI * 2)
      ctx.fill()

      // Ko'rish nuri chizig'i (Ko'zdan silindrga yo'naltirilgan lazer)
      ctx.strokeStyle = nurRang
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(eyeX - 20, eyeY)
      ctx.lineTo(cX + 10, meniscusCenterY + (kozPozitsiyasi === "yuqori" ? -14 : kozPozitsiyasi === "past" ? 14 : 4))
      ctx.stroke()
      ctx.setLineDash([])

      // Haqiqiy pastki menisk nishon chizig'i (Gorizontal yashil)
      ctx.strokeStyle = "rgba(74, 222, 128, 0.8)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(cX - 30, meniscusCenterY + 4)
      ctx.lineTo(cX + cW + 30, meniscusCenterY + 4)
      ctx.stroke()

      // NATIJA VA PARALLAKS XATOSI
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.textAlign = "center"
      if (kozPozitsiyasi === "ortada") {
        ctx.fillStyle = "#4ade80"
        ctx.fillText(`TO'G'RI: Ko'z sathi pastki menisk bilan teng! O'qilgan hajm: ${oqilganHajm} ml`, CX, cY - 25)
      } else if (kozPozitsiyasi === "yuqori") {
        ctx.fillStyle = "#ef4444"
        ctx.fillText(`XATO: Yuqoridan qaraldi! Parallaks tufayli ${oqilganHajm} ml deb ko'rinmoqda (+6 ml xato)`, CX, cY - 25)
      } else {
        ctx.fillStyle = "#ef4444"
        ctx.fillText(`XATO: Pastdan qaraldi! Parallaks tufayli ${oqilganHajm} ml deb ko'rinmoqda (-6 ml xato)`, CX, cY - 25)
      }

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, kozPozitsiyasi, suvHajmi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: ALANGA ZONALARI VA PROBIRKANI QIZDIRISH (SPIRTOVKA)
  // 1-zona: Ichki sovuq qoramtir (300°C)
  // 2-zona: O'rta yorug' (600°C)
  // 3-zona: Tashqi eng issiq rangsiz/ko'kish (1000°C) — To'g'ri qizdirish zonasi!
  // ═══════════════════════════════════════════════════════════════════════════
  const alangaCanvasRef = useRef(null)
  const [alangaZona, setAlangaZona] = useState("tashqi") // "ichki" | "orta" | "tashqi"
  const [probirkaHarorat, setProbirkaHarorat] = useState(20)
  const [burchakTogri, setBurchakTogri] = useState(true) // 45 gradus burchak

  useEffect(() => {
    let t
    t = setInterval(() => {
      setProbirkaHarorat((h) => {
        const maqsad = alangaZona === "tashqi" ? 100 : alangaZona === "orta" ? 60 : 35
        if (h < maqsad) return h + 2
        if (h > maqsad) return h - 2
        return h
      })
    }, 80)
    return () => clearInterval(t)
  }, [alangaZona])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "alanga") return
    const canvas = alangaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const CX = W * 0.4
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

      // SPIRTOVKA TANASI
      const sX = CX
      const sY = H - 95
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)"
      ctx.beginPath()
      ctx.arc(sX, sY + 30, 45, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Bo'g'zi va pilik (Wick)
      ctx.fillStyle = "#475569"
      ctx.fillRect(sX - 12, sY - 10, 24, 15)

      // ALANGA (3 TA HARORAT ZONASI)
      const flameH = 80 + Math.sin(f * 8) * 6

      // 3-ZONA: TASHQI ENG ISSIQ ZONA (800-1000°C) — Rangli shaffof ko'kish
      ctx.fillStyle = "rgba(56, 189, 248, 0.35)"
      ctx.beginPath()
      ctx.moveTo(sX - 22, sY - 10)
      ctx.quadraticCurveTo(sX + Math.sin(f * 4) * 8, sY - 10 - flameH * 1.2, sX + 22, sY - 10)
      ctx.fill()

      // 2-ZONA: O'RTA YORUG' ZONA (500-600°C) — Yorqin sariq/olovrang
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.moveTo(sX - 16, sY - 10)
      ctx.quadraticCurveTo(sX + Math.sin(f * 5) * 5, sY - 10 - flameH * 0.85, sX + 16, sY - 10)
      ctx.fill()

      // 1-ZONA: ICHKI SOVUQ ZONA (300°C) — Qoramtir yonmagan gazlar
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.moveTo(sX - 8, sY - 10)
      ctx.quadraticCurveTo(sX, sY - 10 - flameH * 0.35, sX + 8, sY - 10)
      ctx.fill()

      // PROBIRKA (QIZDIRILAYOTGAN IDISH)
      // Probirka tutqichi (wooden clamp) va probirka
      const targetY = alangaZona === "tashqi" ? sY - 10 - flameH * 0.95 : alangaZona === "orta" ? sY - 10 - flameH * 0.6 : sY - 10 - flameH * 0.2
      const pAngle = burchakTogri ? 0.45 : 0 // 45 gradus vs vertikal

      ctx.save()
      ctx.translate(sX + 30, targetY)
      ctx.rotate(-pAngle)

      // Probirka shisha korpusi
      ctx.strokeStyle = "rgba(241, 245, 249, 0.9)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(-12, -70)
      ctx.lineTo(-12, 10)
      ctx.arcTo(-12, 22, 0, 22, 12)
      ctx.arcTo(12, 22, 12, 10, 12)
      ctx.lineTo(12, -70)
      ctx.stroke()

      // Probirka ichidagi suyuqlik (1/3 hajm)
      ctx.fillStyle = probirkaHarorat >= 95 ? "rgba(239, 68, 68, 0.7)" : "rgba(56, 189, 248, 0.7)"
      ctx.beginPath()
      ctx.moveTo(-10, -10)
      ctx.lineTo(-10, 10)
      ctx.arcTo(-10, 20, 0, 20, 10)
      ctx.arcTo(10, 20, 10, 10, 10)
      ctx.lineTo(10, -10)
      ctx.closePath()
      ctx.fill()

      // Qaynash pufaklari
      if (probirkaHarorat >= 90) {
        for (let p = 0; p < 5; p++) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.beginPath()
          ctx.arc(-5 + p * 3, 5 - ((f * 30 + p * 12) % 20), 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Yog'och probirka ushlagichi (qisqich)
      ctx.fillStyle = "#d97706"
      ctx.fillRect(-16, -45, 32, 10)
      ctx.fillRect(16, -42, 60, 6)
      ctx.restore()

      // Alanga zonalari matnli ko'rsatkichlari (O'ng tomonda)
      ctx.font = 'bold 12px "Times New Roman", serif'
      ctx.textAlign = "left"

      // 3-zona yorlig'i
      ctx.fillStyle = alangaZona === "tashqi" ? "#4ade80" : "#38bdf8"
      ctx.fillText("3-zona (Tashqi): 1000°C — ENG ISSIQ (To'g'ri qizdirish joyi!)", sX + 110, sY - 90)

      // 2-zona yorlig'i
      ctx.fillStyle = alangaZona === "orta" ? "#fbbf24" : "#94a3b8"
      ctx.fillText("2-zona (O'rta): 600°C — Qisman yonish (O'rtacha issiqlik)", sX + 110, sY - 50)

      // 1-zona yorlig'i
      ctx.fillStyle = alangaZona === "ichki" ? "#ef4444" : "#64748b"
      ctx.fillText("1-zona (Ichki): 300°C — SOVUQ ZONA (Yonmagan gazlar)", sX + 110, sY - 10)

      // Termometr va holat
      ctx.font = 'bold 15px "Times New Roman", serif'
      ctx.fillStyle = probirkaHarorat >= 95 ? "#ef4444" : "#38bdf8"
      ctx.textAlign = "center"
      ctx.fillText(`Suyuqlik harorati: ${probirkaHarorat}°C ${probirkaHarorat >= 95 ? "(Qaynash!)" : ""}`, W / 2, 35)

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, alangaZona, probirkaHarorat, burchakTogri])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: FILTRATSIYA (SUZISH) JARAYONI VA ASBOBLAR KOMPLEKTI
  // Shtativ + Shisha voronka + Filtr qog'oz + Stakan + Shisha tayoqcha
  // Qumli loyqa suv tiniq toza filtratga ajraladi!
  // ═══════════════════════════════════════════════════════════════════════════
  const filtrCanvasRef = useRef(null)
  const [filtrOqmoqda, setFiltrOqmoqda] = useState(false)
  const [filtratHajm, setFiltratHajm] = useState(10) // ml

  const filtrniBoshlash = () => {
    setFiltrOqmoqda(true)
    tovushChiqar("suv")
  }

  useEffect(() => {
    let t
    if (filtrOqmoqda) {
      t = setInterval(() => {
        setFiltratHajm((h) => {
          if (h >= 75) {
            setFiltrOqmoqda(false)
            tovushChiqar("tasdiq")
            return 75
          }
          return h + 1
        })
      }, 100)
    }
    return () => clearInterval(t)
  }, [filtrOqmoqda])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "filtratsiya") return
    const canvas = filtrCanvasRef.current
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

      // SHTATIV (Og'ir metall tayanch va vertikal ustun)
      const stX = CX - 130
      ctx.fillStyle = "#475569"
      ctx.fillRect(stX - 45, H - 40, 90, 15) // Taglik
      ctx.fillRect(stX - 5, 40, 10, H - 80) // Tik ustun

      // Shtativ halqasi (Ring clamp) voronkani ushlab turadi
      const ringY = H - 190
      ctx.fillStyle = "#334155"
      ctx.fillRect(stX, ringY, 130, 10)
      ctx.beginPath()
      ctx.arc(CX, ringY + 5, 25, 0, Math.PI * 2)
      ctx.fill()

      // SHISHA VORONKA (Funnel)
      const fTopY = ringY - 45
      ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(CX - 45, fTopY)
      ctx.lineTo(CX - 8, ringY + 30)
      ctx.lineTo(CX - 8, ringY + 90) // Ingichka naycha
      ctx.lineTo(CX + 8, ringY + 90)
      ctx.lineTo(CX + 8, ringY + 30)
      ctx.lineTo(CX + 45, fTopY)
      ctx.stroke()

      // FILTR QOG'OZ (Konus shaklda voronka ichida)
      ctx.fillStyle = "#f8fafc"
      ctx.beginPath()
      ctx.moveTo(CX - 40, fTopY + 5)
      ctx.lineTo(CX, ringY + 28)
      ctx.lineTo(CX + 40, fTopY + 5)
      ctx.closePath()
      ctx.fill()

      // Qum/loyqa cho'kma (filtr qog'ozida ushlanib qolgan)
      ctx.fillStyle = "#92400e"
      ctx.beginPath()
      ctx.moveTo(CX - 25, ringY + 12)
      ctx.lineTo(CX, ringY + 28)
      ctx.lineTo(CX + 25, ringY + 12)
      ctx.closePath()
      ctx.fill()

      // SHISHA TAYOQCHA (Eritmani to'kilmasdan oqizish uchun)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(CX - 70, fTopY - 60)
      ctx.lineTo(CX - 5, ringY + 20)
      ctx.stroke()

      // PASTKI QABUL QILUVCHI STAKAN (Tiniq filtrat to'planadi)
      const bW = 100
      const bH = 110
      const bX = CX - bW / 2
      const bY = H - 40 - bH

      // Tiniq filtrat suyuqligi
      const fLiquidH = (filtratHajm / 100) * (bH - 20)
      ctx.fillStyle = "rgba(56, 189, 248, 0.75)"
      ctx.fillRect(bX + 5, bY + bH - fLiquidH, bW - 10, fLiquidH)

      // Pastki stakan shisha korpusi
      ctx.strokeStyle = "rgba(241, 245, 249, 0.9)"
      ctx.lineWidth = 3.5
      ctx.strokeRect(bX, bY, bW, bH)

      // TOMCHILAR (Voronka naychasidan pastga tomayotgan tiniq suv)
      if (filtrOqmoqda) {
        for (let i = 0; i < 4; i++) {
          const dy = ringY + 95 + ((f * 60 + i * 25) % (bY + bH - fLiquidH - (ringY + 95)))
          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(CX, dy, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // IZOHLAR VA KO'RSATKICHLAR
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.textAlign = "left"
      ctx.fillStyle = "#d97706"
      ctx.fillText("Filtr qog'ozi: Qattiq zarrachalarni (cho'kmani) tutib qoladi", CX + 60, fTopY + 10)
      ctx.fillStyle = "#38bdf8"
      ctx.fillText(`Filtrat (Tiniq suyuqlik): ${filtratHajm} ml yig'ildi`, CX + 60, bY + 50)

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, filtrOqmoqda, filtratHajm])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: JIHOZLAR KATALOGI VA MATERIAL LAB (ANATOMIYA)
  // ═══════════════════════════════════════════════════════════════════════════
  const [tanlanganJihoz, setTanlanganJihoz] = useState(JIHOZLAR_KATALOGI[0])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "JIHOZLAR USTASI: TAJRIBAGA MOS KOMPLEKTNI YIG'!"
  // 4 xil amaliy tajriba stsenariysi
  // ═══════════════════════════════════════════════════════════════════════════
  const topshiriqlar = [
    {
      id: 1,
      nom: "1-Tajriba: Qum va suv aralashmasini suzib ajratish (Filtratsiya)",
      kerakli: ["voronka", "stakan"],
      barcha: ["voronka", "stakan", "spirtovka", "byuretka", "chinni-kosacha"],
    },
    {
      id: 2,
      nom: "2-Tajriba: Osh tuzi eritmasini bug'latib kristall olish",
      kerakli: ["chinni-kosacha", "spirtovka"],
      barcha: ["chinni-kosacha", "spirtovka", "probirka", "olchov-silindr", "voronka"],
    },
    {
      id: 3,
      nom: "3-Tajriba: Aynan 45 ml kislota hajmini o'lchash",
      kerakli: ["olchov-silindr"],
      barcha: ["olchov-silindr", "stakan", "chinni-kosacha", "spirtovka"],
    },
    {
      id: 4,
      nom: "4-Tajriba: Kislota va ishqorni tomchilatib titrlash",
      kerakli: ["byuretka", "konus-kolba"],
      barcha: ["byuretka", "konus-kolba", "voronka", "chinni-kosacha", "probirka"],
    },
  ]

  const [topshiriqIndeks, setTopshiriqIndeks] = useState(0)
  const [yigilganJihozlar, setYigilganJihozlar] = useState([])
  const [topshiriqYechildi, setTopshiriqYechildi] = useState(false)

  const jihozniTanlash = (jid) => {
    if (topshiriqYechildi) return
    let yangi
    if (yigilganJihozlar.includes(jid)) {
      yangi = yigilganJihozlar.filter((x) => x !== jid)
    } else {
      yangi = [...yigilganJihozlar, jid]
    }
    setYigilganJihozlar(yangi)

    const joriy = topshiriqlar[topshiriqIndeks]
    const togri = joriy.kerakli.every((k) => yangi.includes(k)) && yangi.length === joriy.kerakli.length

    if (togri) {
      setTopshiriqYechildi(true)
      tovushChiqar("zafar")
    } else {
      tovushChiqar("bosqich")
    }
  }

  const keyingiTopshiriq = () => {
    if (topshiriqIndeks < topshiriqlar.length - 1) {
      setTopshiriqIndeks((i) => i + 1)
      setYigilganJihozlar([])
      setTopshiriqYechildi(false)
      tovushChiqar("bosqich")
    }
  }

  const topshiriqniQayta = () => {
    setTopshiriqIndeks(0)
    setYigilganJihozlar([])
    setTopshiriqYechildi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "MENISK DETEKTIVI: ANIQ HAJMNI O'QISH"
  // ═══════════════════════════════════════════════════════════════════════════
  const meniskSavollari = [
    {
      id: 1,
      rasmHajm: 42,
      savol: "Silindr botiq meniskining pastki qismi 42 ml da turibdi. Qaysi hajm to'g'ri?",
      variantlar: ["42 ml (Pastki menisk)", "45 ml (Yuqori cheti)", "38 ml (Pastdan ko'rinish)", "50 ml"],
      togri: "42 ml (Pastki menisk)",
    },
    {
      id: 2,
      rasmHajm: 75,
      savol: "O'lchov silindrida suv sathi 75 ml ga yetdi. Ko'z qanday tutiladi?",
      variantlar: ["Farqi yo'q", "Ko'z sathi 75 ml pastki meniski bilan bir chiziqda", "Silindrga yuqoridan tik qaraladi", "Silindr stol ostidan pastdan qaraladi"],
      togri: "Ko'z sathi 75 ml pastki meniski bilan bir chiziqda",
    },
    {
      id: 3,
      rasmHajm: 18,
      savol: "Pipetka yoki byuretkadan 18 ml quyishda eng asosiy qoida nima?",
      variantlar: ["Idishni qizdirib olish", "Ko'zni yumib quyish", "Tomchilar sonini nazorat qilib, meniskni to'g'ri sathda to'xtatish", "Idishni tez silkitish"],
      togri: "Tomchilar sonini nazorat qilib, meniskni to'g'ri sathda to'xtatish",
    },
  ]

  const [meniskIndeks, setMeniskIndeks] = useState(0)
  const [tanlanganMeniskJavob, setTanlanganMeniskJavob] = useState(null)
  const [meniskBall, setMeniskBall] = useState(0)
  const [meniskTugadi, setMeniskTugadi] = useState(false)

  const meniskJavobTanlash = (javob) => {
    if (tanlanganMeniskJavob !== null) return
    setTanlanganMeniskJavob(javob)
    if (javob === meniskSavollari[meniskIndeks].togri) {
      setMeniskBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiMenisk = () => {
    if (meniskIndeks < meniskSavollari.length - 1) {
      setMeniskIndeks((i) => i + 1)
      setTanlanganMeniskJavob(null)
      tovushChiqar("bosqich")
    } else {
      setMeniskTugadi(true)
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
        mavzuRaqam="1.5"
        mavzuNom="Laboratoriya jihozlari va ulardan foydalanish"
        bobNom="1-bob. Kirish"
        sahifa={11}
        oldingiRaqam="1.4"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          0-BO'LIM: O'TGAN DARSNI TAKRORLASH (1.4-MAVZU)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="1.4"
          oldingiNom="Kimyo laboratoriyasida texnika xavfsizligi qoidalari"
          savollar={takrorlashSavollari1_4}
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
                setAnimRejim("menisk")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "menisk"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="vaqt" olcham={16} />
              <span>1. Menisk sathi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("alanga")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "alanga"
                  ? "border-orange-400 bg-orange-500/20 text-orange-300 ring-2 ring-orange-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-orange-400/50"
              }`}
            >
              <Ikon nom="olov" olcham={16} />
              <span>2. Alanga zonalari</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("filtratsiya")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "filtratsiya"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="filtr" olcham={16} />
              <span>3. Filtratsiya</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("katalog")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "katalog"
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 ring-2 ring-purple-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>4. Jihozlar stendi</span>
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
              <Ikon nom="olov" olcham={16} />
              <span>5. Bug&apos;latish kosachasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("k6")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "k6"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="tomchi" olcham={16} />
              <span>6. Tarozi va Pipetka</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              1-ANIMATSIYA: MENISK BO'YICHA HAJM O'LCHASH (O'LCHOV SILINDRI)
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "menisk" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={meniskCanvasRef} className="w-full h-full block" />
              </div>

              {/* KO'Z BALANDLIGINI BOSHQARISH TUGMALARI */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => kozniOzgartirish("yuqori")}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      kozPozitsiyasi === "yuqori"
                        ? "border-red-400 bg-red-500/25 text-red-200 ring-2 ring-red-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-red-400/50"
                    }`}
                  >
                    Yuqoridan qarash (Xato)
                  </button>

                  <button
                    type="button"
                    onClick={() => kozniOzgartirish("ortada")}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition ${
                      kozPozitsiyasi === "ortada"
                        ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 ring-2 ring-emerald-400/40"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-emerald-400/50"
                    }`}
                  >
                    To&apos;g&apos;ri sathi (Pastki menisk)
                  </button>

                  <button
                    type="button"
                    onClick={() => kozniOzgartirish("past")}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      kozPozitsiyasi === "past"
                        ? "border-red-400 bg-red-500/25 text-red-200 ring-2 ring-red-400/30"
                        : "border-blue-900 bg-[#081236] text-blue-200 hover:border-red-400/50"
                    }`}
                  >
                    Pastdan qarash (Xato)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              2-ANIMATSIYA: ALANGA ZONALARI VA PROBIRKANI QIZDIRISH
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "alanga" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={alangaCanvasRef} className="w-full h-full block" />
              </div>

              {/* ALANGA ZONALARINI BOSHQARISH */}
              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setAlangaZona("tashqi")
                      tovushChiqar("olov")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      alangaZona === "tashqi"
                        ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 ring-2 ring-emerald-400/40"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    3-zona: Tashqi eng issiq (1000°C)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAlangaZona("orta")
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      alangaZona === "orta"
                        ? "border-amber-400 bg-amber-500/30 text-amber-200"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    2-zona: O&apos;rta yorug&apos; (600°C)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAlangaZona("ichki")
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                      alangaZona === "ichki"
                        ? "border-red-400 bg-red-500/30 text-red-200"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    1-zona: Ichki sovuq (300°C)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              3-ANIMATSIYA: FILTRATSIYA (SUZISH) JARAYONI
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "filtratsiya" && (
            <div className="space-y-3">
              <div className="relative w-full h-[370px] sm:h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={filtrCanvasRef} className="w-full h-full block" />
              </div>

              <div className="p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={filtrniBoshlash}
                  disabled={filtrOqmoqda}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
                >
                  <Ikon nom="filtr" olcham={16} />
                  <span>{filtrOqmoqda ? "Suzish jarayoni ketmoqda..." : "Suzishni boshlash (Filtratsiya)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              4-ANIMATSIYA: JIHOZLAR ANATOMIYASI VA MATERIAL LAB
             ═══════════════════════════════════════════════════════════════════ */}
          {animRejim === "katalog" && (
            <div className="space-y-4">
              {/* 10 TA JIHOZ TUGMALARI */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {JIHOZLAR_KATALOGI.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      setTanlanganJihoz(j)
                      tovushChiqar("bosqich")
                    }}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      tanlanganJihoz.id === j.id
                        ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/40 shadow-lg scale-102"
                        : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
                    }`}
                  >
                    <Ikon nom={j.ikon} olcham={20} />
                    <span className="text-xs font-bold leading-tight">{j.nom}</span>
                  </button>
                ))}
              </div>

              {/* TANLANGAN JIHOZNING TO'LIQ ANATOMIYASI */}
              <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/60 bg-[#081236] space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap border-b border-blue-900/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-400">
                      <Ikon nom={tanlanganJihoz.ikon} olcham={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{tanlanganJihoz.nom}</h4>
                      <span className="text-xs text-yellow-300">Turi: {tanlanganJihoz.tur} &bull; Sig&apos;imi: {tanlanganJihoz.sigim}</span>
                    </div>
                  </div>

                  <span className="text-xs text-blue-200 bg-blue-950/80 border border-blue-800/60 px-3.5 py-1.5 rounded-xl">
                    Material: <strong>{tanlanganJihoz.material}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#04081c] border border-blue-800/40 text-blue-100">
                    <strong className="text-cyan-400 block mb-1">Asosiy vazifasi:</strong>
                    {tanlanganJihoz.vazifa}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#04081c] border border-emerald-500/30 text-emerald-200">
                    <strong className="text-emerald-400 block mb-1">Xavfsiz ishlatish qoidasi:</strong>
                    {tanlanganJihoz.qoida}
                  </div>
                </div>
              </div>
            </div>
          )}
          {(animRejim === "k5" || animRejim === "k6") && (
            <QoshimchaKorgazma mavzu="1.5" rejim={animRejim} />
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
                setOyinRejim("yigish")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "yigish"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="kolba" olcham={18} />
              <span>1. Jihozlar ustasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("menisk_oyini")
                tovushChiqar("bosqich")
              }}
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "menisk_oyini"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="vaqt" olcham={18} />
              <span>2. Menisk Detektivi</span>
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
              <span>3. Jihoz Viktorinasi</span>
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

          {/* ─── 1-O'YIN: JIHOZLAR USTASI ─── */}
          {oyinRejim === "yigish" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                    Topshiriq {topshiriqIndeks + 1} / {topshiriqlar.length}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-300">
                    {topshiriqlar[topshiriqIndeks].nom}
                  </h3>
                  <p className="text-xs text-blue-200 pt-0.5">
                    Ushbu tajriba uchun kerak bo&apos;ladigan jihozlarni doskada tanlang:
                  </p>
                </div>

                {topshiriqYechildi && (
                  <span className="px-3.5 py-1.5 rounded-xl border border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                    Muvaffaqiyatli terildi!
                  </span>
                )}
              </div>

              {/* JIHOZLARNI TANLASH KARTALARI */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {topshiriqlar[topshiriqIndeks].barcha.map((jid) => {
                  const jihoz = JIHOZLAR_KATALOGI.find((j) => j.id === jid) || { nom: jid, ikon: "kolba" }
                  const tanlangan = yigilganJihozlar.includes(jid)

                  return (
                    <button
                      key={jid}
                      type="button"
                      onClick={() => jihozniTanlash(jid)}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 active:scale-98 ${
                        tanlangan
                          ? "border-emerald-500 bg-emerald-950/50 text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg"
                          : "border-blue-900 bg-[#081236] text-blue-100 hover:border-yellow-400/60"
                      }`}
                    >
                      <Ikon nom={jihoz.ikon} olcham={24} />
                      <span className="text-xs font-bold">{jihoz.nom}</span>
                    </button>
                  )
                })}
              </div>

              {topshiriqYechildi && (
                <div className="p-4 rounded-2xl border border-emerald-500/50 bg-emerald-950/30 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold">
                    Ajoyib! Tajriba uchun barcha kerakli jihozlar to&apos;g&apos;ri yig&apos;ildi.
                  </p>
                  {topshiriqIndeks < topshiriqlar.length - 1 ? (
                    <button
                      type="button"
                      onClick={keyingiTopshiriq}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg"
                    >
                      Keyingi tajribaga o&apos;tish
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={topshiriqniQayta}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg"
                    >
                      Boshidan qayta o&apos;ynash
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── 2-O'YIN: MENISK DETEKTIVI ─── */}
          {oyinRejim === "menisk_oyini" && (
            <div className="space-y-4">
              {!meniskTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                        Menisk viktorinasi {meniskIndeks + 1} / {meniskSavollari.length}
                      </span>
                      <h4 className="text-xs text-blue-200">{meniskSavollari[meniskIndeks].savol}</h4>
                    </div>

                    <div className="px-3 py-1 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold text-xs">
                      Ball: {meniskBall}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {meniskSavollari[meniskIndeks].variantlar.map((v) => {
                      const togri = v === meniskSavollari[meniskIndeks].togri
                      const tanlandi = tanlanganMeniskJavob === v
                      let stil = "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"

                      if (tanlanganMeniskJavob !== null) {
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
                          onClick={() => meniskJavobTanlash(v)}
                          className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-md ${stil}`}
                        >
                          <span>{v}</span>
                          {tanlanganMeniskJavob !== null && togri && (
                            <Ikon nom="tasdiq" olcham={18} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganMeniskJavob !== null && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={keyingiMenisk}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg"
                      >
                        {meniskIndeks < meniskSavollari.length - 1 ? "Keyingi savolga o'tish" : "Natijani ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                    <Ikon nom="kubok" olcham={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Menisk Detektivi yakunlandi!</h3>
                  <p className="text-base text-emerald-300 font-bold">
                    To&apos;g&apos;ri javoblar: {meniskBall} / {meniskSavollari.length}
                  </p>
                  <p className="text-xs text-blue-200/90 max-w-md mx-auto">
                    Siz o&apos;lchov asboblaridan to&apos;g&apos;ri foydalanish va pastki menisk qoidasini mukammal o&apos;zlashtirdingiz!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMeniskIndeks(0)
                      setTanlanganMeniskJavob(null)
                      setMeniskBall(0)
                      setMeniskTugadi(false)
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
            <QoshimchaOyin mavzu="1.5" rejim={oyinRejim} />
          )}
        </div>
      )}
    </div>
  )
}
