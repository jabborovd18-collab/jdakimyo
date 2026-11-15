"use client"

import { useState, useRef, useEffect } from "react"
import Ikon from "@/components/Ikon"
import { kadrSora, kadrniBekorQil, umumiyAudio } from "@/lib/maktab-animatsiya"
import OtganDarsniTakrorlash from "@/components/maktab/OtganDarsniTakrorlash"
import {
  SmartDoskaNavigatsiya,
  DoskadaTushuntirishKartasi,
} from "@/components/maktab/SmartDoskaYordamchi"

// 1.1-mavzuni takrorlash uchun darslik asosidagi blits-savollar
const takrorlashSavollari1_1 = [
  {
    id: 1,
    savol: "Muzning erib suvga aylanishi qanday o'zgarish turiga kiradi?",
    izoh: "Muz eriganda yangi modda hosil bo'lmaydi, faqat suvning agregat holati (qattiqdan suyuqqa) o'zgaradi. Bu — fizik o'zgarish!",
    variantlar: [
      { matn: "Fizik o'zgarish", togri: true },
      { matn: "Kimyoviy reaksiya", togri: false },
      { matn: "Biologik chirish", togri: false },
      { matn: "Yadroviy o'zgarish", togri: false },
    ],
  },
  {
    id: 2,
    savol: "Temir mix nam havoda qolganda ustida qizg'ish zang paydo bo'ldi. Bu qanday hodisa?",
    izoh: "Temir havodagi kislorod va suv bilan birikib, yangi modda (Fe2O3) hosil qiladi. Yangi modda hosil bo'lishi — kimyoviy o'zgarish belgisidir!",
    variantlar: [
      { matn: "Holat o'zgarmadi", togri: false },
      { matn: "Kimyoviy o'zgarish (reaksiya)", togri: true },
      { matn: "Fizik o'zgarish", togri: false },
      { matn: "Oddiy ifloslanish", togri: false },
    ],
  },
  {
    id: 3,
    savol: "Kislotaga metall bo'lagi tashlanganda kuchli ko'pirish yuz berdi. Bu reaksiyaning qaysi belgisidir?",
    izoh: "Gaz pufakchalarining shiddat bilan ajralishi kimyoviy reaksiya yuz berganini ko'rsatuvchi 4 ta asosiy belgidan biridir.",
    variantlar: [
      { matn: "Moddaning bug'lanishi", togri: false },
      { matn: "Faqat harorat tushishi", togri: false },
      { matn: "Gaz ajralishi", togri: true },
      { matn: "Muzlash hodisasi", togri: false },
    ],
  },
  {
    id: 4,
    savol: "Kimyo fani nimani o'rganadi?",
    izoh: "Kimyo — tabiatdagi moddalar, ularning tarkibi, tuzilishi, xossalari hamda boshqa moddalarga aylanishini o'rganuvchi asosiy fandir.",
    variantlar: [
      { matn: "Faqat tirik organizmlarning ko'payishini", togri: false },
      { matn: "Faqat osmon jismlari harakatini", togri: false },
      { matn: "Faqat elektr to'kining kuchini", togri: false },
      { matn: "Moddalar, ularning xossalari va bir-biriga aylanishini", togri: true },
    ],
  },
]

// Web Audio API yordamida interaktiv tovush effektlari
function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const ctx = umumiyAudio()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (turi === "togri" || turi === "tasdiq") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.22)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (turi === "xato") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
      osc.start(now)
      osc.stop(now + 0.28)
    } else if (turi === "olov") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(120, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.25)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
      osc.start(now)
      osc.stop(now + 0.28)
    } else if (turi === "bosqich") {
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
    // Audio kontekst qo'llab-quvvatlanmasa xatolik bermaydi
  }
}

export default function Mavzu1_2() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)

  // Asosiy bo'limlar: "animatsiyalar" | "oyinlar"
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")

  // Animatsiyalar: 1..4
  // "pelikan": Lavuazyening 101 kunlik sirkulyatsiya kolbasi
  // "sheele": Karl Sheelening qor suvi va shisha xiralashishi tajribasi
  // "erituvchi": Suv — universal erituvchi (Molekulyar darajadagi erish)
  // "tarozi": Lavuazye massalar balansi va isboti
  const [animRejim, setAnimRejim] = useState("pelikan")

  // Smart doska o'yinlari: 1..2
  // "detektiv": Kimyogar Detektiv: Parij akademiyasida 101 kunlik sirni fosh etish
  // "fazilat": Tadqiqotchi laboratoriyasi: Ilmiy vaziyatlar va shaxsiy fazilatlar
  const [oyinRejim, setOyinRejim] = useState("detektiv")

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
  // 1-ANIMATSIYA: LAVUAZYE VA 101 KUNLIK "PELIKAN" REFLYUKS KOLBASI
  // Darslikdagi muammo: Qaynayotgan suv bug'lanib ketmasligi uchun germetik
  // ikkita egilgan naycha orqali qayta kondensatlanadi.
  // ═══════════════════════════════════════════════════════════════════════════
  const pelikanCanvasRef = useRef(null)
  const [pelikanOlov, setPelikanOlov] = useState(true)
  const [pelikanKun, setPelikanKun] = useState(0)
  const [pelikanAvto, setPelikanAvto] = useState(false)
  const [lupaAktiv, setLupaAktiv] = useState(false)

  // 101 kungacha avtomatik o'tkazish
  useEffect(() => {
    let timer
    if (pelikanAvto) {
      timer = setInterval(() => {
        setPelikanKun((eski) => {
          if (eski >= 101) {
            setPelikanAvto(false)
            tovushChiqar("zafar")
            return 101
          }
          return eski + 1
        })
      }, 70)
    }
    return () => clearInterval(timer)
  }, [pelikanAvto])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "pelikan") return
    const canvas = pelikanCanvasRef.current
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
    const baseY = H - 90

    const pufaklar = []
    const kondensatZarralari = []
    let faza = 0

    const render = () => {
      faza += 0.05
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

      // Spirtovka tagligi
      ctx.fillStyle = "#334155"
      ctx.fillRect(CX - 40, baseY + 42, 80, 16)
      ctx.fillStyle = "#475569"
      ctx.fillRect(CX - 12, baseY + 34, 24, 8)

      // Spirtovka alangasi
      if (pelikanOlov) {
        const flameH = 26 + Math.sin(faza * 4) * 4
        ctx.beginPath()
        ctx.moveTo(CX, baseY + 34 - flameH)
        ctx.quadraticCurveTo(CX + 13, baseY + 34, CX, baseY + 34)
        ctx.quadraticCurveTo(CX - 13, baseY + 34, CX, baseY + 34 - flameH)
        ctx.fillStyle = "#ea580c"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(CX, baseY + 34 - flameH * 0.7)
        ctx.quadraticCurveTo(CX + 7, baseY + 34, CX, baseY + 34)
        ctx.quadraticCurveTo(CX - 7, baseY + 34, CX, baseY + 34 - flameH * 0.7)
        ctx.fillStyle = "#fef08a"
        ctx.fill()

        // Yangi pufaklar hosil qilish
        if (Math.random() > 0.3) {
          pufaklar.push({
            x: CX + (Math.random() - 0.5) * 55,
            y: baseY + 20,
            vy: -Math.random() * 2.2 - 1.2,
            r: Math.random() * 2.8 + 1.2,
            alpha: 0.85,
          })
        }

        // Qanot naychalaridagi kondensat tomchilari
        if (Math.random() > 0.6) {
          kondensatZarralari.push({
            tomon: Math.random() > 0.5 ? 1 : -1,
            progress: 0,
            r: Math.random() * 2 + 1.5,
          })
        }
      }

      // Shisha devorlari xiralashishi darajasi (101 kunda shisha yemirilishi)
      const xiralik = (pelikanKun / 101) * 0.35

      // ─── PELIKAN KOLBASI TUZILISHI ───
      // Shisha naychalari (Egizak qanotlar - sirkulyatsiya naychalari)
      ctx.save()
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.7 - xiralik})`
      ctx.lineWidth = 10
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Chap naycha
      ctx.beginPath()
      ctx.moveTo(CX - 12, baseY - 120)
      ctx.bezierCurveTo(CX - 95, baseY - 120, CX - 95, baseY - 10, CX - 45, baseY + 10)
      ctx.stroke()

      // O'ng naycha
      ctx.beginPath()
      ctx.moveTo(CX + 12, baseY - 120)
      ctx.bezierCurveTo(CX + 95, baseY - 120, CX + 95, baseY - 10, CX + 45, baseY + 10)
      ctx.stroke()

      // Ichki bo'shliq naychalari (kondensat yo'li)
      ctx.strokeStyle = "rgba(14, 165, 233, 0.35)"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(CX - 12, baseY - 120)
      ctx.bezierCurveTo(CX - 95, baseY - 120, CX - 95, baseY - 10, CX - 45, baseY + 10)
      ctx.moveTo(CX + 12, baseY - 120)
      ctx.bezierCurveTo(CX + 95, baseY - 120, CX + 95, baseY - 10, CX + 45, baseY + 10)
      ctx.stroke()

      // Kondensat tomchilarining oqishi
      for (let i = kondensatZarralari.length - 1; i >= 0; i--) {
        const d = kondensatZarralari[i]
        d.progress += 0.02
        const p = d.progress
        const sign = d.tomon
        // Bezier bo'ylab koordinata
        const pX =
          (1 - p) * (1 - p) * (CX + sign * 12) +
          2 * (1 - p) * p * (CX + sign * 95) +
          p * p * (CX + sign * 45)
        const pY =
          (1 - p) * (1 - p) * (baseY - 120) +
          2 * (1 - p) * p * (baseY - 10) +
          p * p * (baseY + 10)

        ctx.fillStyle = "#38bdf8"
        ctx.beginPath()
        ctx.arc(pX, pY, d.r, 0, Math.PI * 2)
        ctx.fill()

        if (d.progress >= 1) kondensatZarralari.splice(i, 1)
      }
      ctx.restore()

      // Asosiy sharsimon kolba va ichidagi suv
      ctx.save()
      ctx.beginPath()
      ctx.arc(CX, baseY - 5, 55, 0, Math.PI * 2)
      ctx.clip()

      // Suv sathi
      ctx.fillStyle = "rgba(56, 189, 248, 0.28)"
      ctx.fillRect(CX - 60, baseY - 25, 120, 85)

      // Qaynayotgan pufaklar
      for (let i = pufaklar.length - 1; i >= 0; i--) {
        const p = pufaklar[i]
        p.y += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
        if (p.y <= baseY - 25) pufaklar.splice(i, 1)
      }

      // Tubidagi shisha cho'kmasi (kun o'tgani sari ko'payadi)
      if (pelikanKun > 10) {
        const chokmaQalinligi = (pelikanKun / 101) * 36
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
        ctx.beginPath()
        ctx.ellipse(CX, baseY + 42, chokmaQalinligi, 6, 0, 0, Math.PI * 2)
        ctx.fill()

        // Cho'kma kristallari porlashi
        for (let s = 0; s < 6; s++) {
          const sx = CX + Math.sin(faza * 2 + s) * (chokmaQalinligi * 0.7)
          const sy = baseY + 40 + Math.cos(faza + s) * 2
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(sx, sy, 2, 2)
        }
      }
      ctx.restore()

      // Shisha kolba tashqi konturi
      ctx.beginPath()
      ctx.arc(CX, baseY - 5, 55, 0, Math.PI * 2)
      ctx.lineWidth = 3.5
      ctx.strokeStyle = `rgba(226, 232, 240, ${0.9 - xiralik * 0.5})`
      ctx.stroke()

      // Germetik tiqin
      ctx.fillStyle = "#b45309"
      ctx.fillRect(CX - 15, baseY - 135, 30, 15)
      ctx.strokeStyle = "#d97706"
      ctx.lineWidth = 1.5
      ctx.strokeRect(CX - 15, baseY - 135, 30, 15)

      // Bo'yin qismi
      ctx.beginPath()
      ctx.moveTo(CX - 12, baseY - 58)
      ctx.lineTo(CX - 12, baseY - 120)
      ctx.moveTo(CX + 12, baseY - 58)
      ctx.lineTo(CX + 12, baseY - 120)
      ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Lupa / Mikroskop ko'rinishi
      if (lupaAktiv) {
        const lx = CX + 120
        const ly = baseY - 50
        const lr = 52

        ctx.save()
        ctx.beginPath()
        ctx.arc(lx, ly, lr, 0, Math.PI * 2)
        ctx.clip()
        ctx.fillStyle = "#020617"
        ctx.fill()

        // Kattalashtirilgan shisha va suv molekulalari
        ctx.fillStyle = "rgba(56, 189, 248, 0.2)"
        ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2)

        // Shisha panjarasi (SiO2)
        ctx.strokeStyle = "rgba(148, 163, 184, 0.6)"
        ctx.lineWidth = 2
        for (let gx = -40; gx <= 40; gx += 20) {
          ctx.beginPath()
          ctx.moveTo(lx + gx, ly - 40)
          ctx.lineTo(lx + gx, ly + 40)
          ctx.stroke()
        }

        // Suv molekulalari va ajralayotgan kremniy (Silikat) atomlari
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.arc(lx - 15 + Math.sin(faza) * 4, ly + Math.cos(faza) * 4, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#38bdf8"
        ctx.beginPath()
        ctx.arc(lx + 15, ly - 10 + Math.sin(faza * 1.5) * 5, 6, 0, Math.PI * 2)
        ctx.arc(lx + 22, ly + 15, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // Lupa ramkasi
        ctx.beginPath()
        ctx.arc(lx, ly, lr, 0, Math.PI * 2)
        ctx.lineWidth = 4
        ctx.strokeStyle = "#eab308"
        ctx.stroke()

        // Lupa dastasining yo'nalishi
        ctx.beginPath()
        ctx.moveTo(lx + lr * 0.7, ly + lr * 0.7)
        ctx.lineTo(lx + lr * 0.7 + 25, ly + lr * 0.7 + 25)
        ctx.lineWidth = 6
        ctx.strokeStyle = "#ca8a04"
        ctx.stroke()

        // Matn
        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.fillStyle = "#fef08a"
        ctx.textAlign = "center"
        ctx.fillText("Mikroskop: Shisha (SiO2) erimoqda", lx, ly + lr + 18)
      }

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, pelikanOlov, pelikanKun, lupaAktiv])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-ANIMATSIYA: KARL SHEELENING 12 KUNLIK TAJRIBASI (3 XIL SUV)
  // Eritilgan qor suvi vs Vodoprovod suvi vs Mineralli quduq suvi
  // Nega qor suvi shishani tezroq o'yib yubordi?
  // ═══════════════════════════════════════════════════════════════════════════
  const sheeleCanvasRef = useRef(null)
  const [sheeleKun, setSheeleKun] = useState(0)
  const [sheeleQaynamoqda, setSheeleQaynamoqda] = useState(false)

  const sheeleTajribaniBoshlash = () => {
    setSheeleQaynamoqda(true)
    setSheeleKun(0)
    tovushChiqar("olov")

    let k = 0
    const interval = setInterval(() => {
      k += 1
      if (k >= 12) {
        k = 12
        clearInterval(interval)
        setSheeleQaynamoqda(false)
        tovushChiqar("tasdiq")
      }
      setSheeleKun(k)
    }, 280)
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sheele") return
    const canvas = sheeleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const W = rect.width
    const H = rect.height

    const suvTurlari = [
      { nom: "Distillangan Qor suvi", rang: "rgba(56, 189, 248, 0.35)", xira: (sheeleKun / 12) * 0.7, cho: (sheeleKun / 12) * 22, taqdir: "Shisha kuchli yemirilgan" },
      { nom: "Vodoprovod suvi", rang: "rgba(14, 165, 233, 0.4)", xira: (sheeleKun / 12) * 0.3, cho: (sheeleKun / 12) * 8, taqdir: "O'rtacha cho'kma" },
      { nom: "Sho'r / Quduq suvi", rang: "rgba(45, 212, 191, 0.4)", xira: (sheeleKun / 12) * 0.15, cho: (sheeleKun / 12) * 4, taqdir: "Kam yemirilgan" },
    ]

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Stol
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.fillRect(0, H - 35, W, 35)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, H - 35)
      ctx.lineTo(W, H - 35)
      ctx.stroke()

      const colW = W / 3
      suvTurlari.forEach((item, idx) => {
        const cx = colW * idx + colW / 2
        const cy = H - 125

        // Spirtovka va olov
        ctx.fillStyle = "#334155"
        ctx.fillRect(cx - 25, cy + 68, 50, 14)
        if (sheeleQaynamoqda) {
          const flH = 18 + Math.sin(f * 4 + idx) * 3
          ctx.beginPath()
          ctx.moveTo(cx, cy + 68 - flH)
          ctx.quadraticCurveTo(cx + 9, cy + 68, cx, cy + 68)
          ctx.quadraticCurveTo(cx - 9, cy + 68, cx, cy + 68 - flH)
          ctx.fillStyle = "#ea580c"
          ctx.fill()
        }

        // Kolba konturi (konus Erlenmeyer kolbasi)
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(cx - 15, cy - 35)
        ctx.lineTo(cx + 15, cy - 35)
        ctx.lineTo(cx + 15, cy - 10)
        ctx.lineTo(cx + 42, cy + 55)
        ctx.lineTo(cx - 42, cy + 55)
        ctx.lineTo(cx - 15, cy - 10)
        ctx.closePath()
        ctx.clip()

        // Suyuqlik
        ctx.fillStyle = item.rang
        ctx.fillRect(cx - 45, cy, 90, 60)

        // Qaynash pufakchalari
        if (sheeleQaynamoqda) {
          for (let p = 0; p < 4; p++) {
            const px = cx - 25 + Math.sin(f * 2 + p * 1.5) * 20
            const py = cy + 45 - ((f * 30 + p * 20) % 45)
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
            ctx.beginPath()
            ctx.arc(px, py, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Shisha cho'kmasi
        if (item.cho > 1) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
          ctx.beginPath()
          ctx.ellipse(cx, cy + 52, item.cho, 4, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        // Xiralashgan shisha devori qoplamasi
        if (item.xira > 0) {
          ctx.fillStyle = `rgba(241, 245, 249, ${item.xira * 0.45})`
          ctx.fillRect(cx - 45, cy - 35, 90, 95)
        }
        ctx.restore()

        // Shisha kolba devori
        ctx.beginPath()
        ctx.moveTo(cx - 15, cy - 35)
        ctx.lineTo(cx + 15, cy - 35)
        ctx.lineTo(cx + 15, cy - 10)
        ctx.lineTo(cx + 42, cy + 55)
        ctx.lineTo(cx - 42, cy + 55)
        ctx.lineTo(cx - 15, cy - 10)
        ctx.closePath()
        ctx.lineWidth = 3
        ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
        ctx.stroke()

        // Sarlavha va natija
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillStyle = "#f8fafc"
        ctx.textAlign = "center"
        ctx.fillText(item.nom, cx, cy - 48)

        ctx.font = '11px "Times New Roman", serif'
        ctx.fillStyle = item.xira > 0.4 ? "#facc15" : "#94a3b8"
        ctx.fillText(sheeleKun > 0 ? item.taqdir : "Boshlang'ich holat", cx, cy + 78)
      })

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, sheeleKun, sheeleQaynamoqda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-ANIMATSIYA: SUV — UNIVERSAL ERITUVCHI (MOLEKULYAR ERISH)
  // Nima uchun suv shishani, tuzni va shakarni erita oladi?
  // Harorat va aralashtirishning ta'siri
  // ═══════════════════════════════════════════════════════════════════════════
  const eritmaCanvasRef = useRef(null)
  const [namunaTuri, setNamunaTuri] = useState("tuz") // "tuz" | "shakar" | "shisha"
  const [suvHarorati, setSuvHarorati] = useState(25) // 10..95 °C
  const [aralashtirilmoqda, setAralashtirilmoqda] = useState(false)
  const [eriganFoiz, setEriganFoiz] = useState(0)

  // Erish jarayonini hisoblash
  useEffect(() => {
    let timer
    const tezlik = (suvHarorati / 30) * (aralashtirilmoqda ? 3 : 1)
    timer = setInterval(() => {
      setEriganFoiz((eski) => {
        const qoshimcha = namunaTuri === "tuz" ? 1.5 : namunaTuri === "shakar" ? 1.0 : 0.25
        const yangi = eski + qoshimcha * tezlik
        if (yangi >= 100) return 100
        return yangi
      })
    }, 100)
    return () => clearInterval(timer)
  }, [suvHarorati, aralashtirilmoqda, namunaTuri])

  const namunaniOzgartirish = (tur) => {
    setNamunaTuri(tur)
    setEriganFoiz(0)
    tovushChiqar("bosqich")
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "erituvchi") return
    const canvas = eritmaCanvasRef.current
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

    // Molekulyar zarrachalar
    const zarrachalar = []
    const jamiZarracha = 36
    for (let i = 0; i < jamiZarracha; i++) {
      zarrachalar.push({
        x: CX - 60 + (i % 6) * 20,
        y: CY + 45 + Math.floor(i / 6) * 12,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        eridi: false,
      })
    }

    let f = 0
    const render = () => {
      f += 0.04
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // Laboratoriya stakanining o'lchami
      const bW = 200
      const bH = 210
      const bX = CX - bW / 2
      const bY = CY - 75

      // Suv sathi (haroratga qarab rangi o'zgaradi: sovuq ko'k -> issiq feruza)
      const r = Math.floor(30 + (suvHarorati / 95) * 60)
      const g = Math.floor(140 + (suvHarorati / 95) * 60)
      const b = 240
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.22)`
      ctx.fillRect(bX + 5, bY + 35, bW - 10, bH - 40)

      // Suv to'lqini (aralashtirilganda girdob bo'ladi)
      ctx.beginPath()
      ctx.moveTo(bX + 5, bY + 35)
      for (let x = bX + 5; x <= bX + bW - 5; x += 10) {
        const toqinAmp = aralashtirilmoqda ? 6 : 2
        const y = bY + 35 + Math.sin(f * (aralashtirilmoqda ? 8 : 3) + (x - bX) * 0.05) * toqinAmp
        ctx.lineTo(x, y)
      }
      ctx.lineTo(bX + bW - 5, bY + bH)
      ctx.lineTo(bX + 5, bY + bH)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.28)`
      ctx.fill()

      // Aralashtirgich shisha tayoqcha
      if (aralashtirilmoqda) {
        ctx.save()
        ctx.translate(CX, bY + 30)
        ctx.rotate(Math.sin(f * 6) * 0.15)
        ctx.fillStyle = "rgba(226, 232, 240, 0.7)"
        ctx.fillRect(-4, -50, 8, bH - 20)
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 1
        ctx.strokeRect(-4, -50, 8, bH - 20)
        ctx.restore()
      }

      // Erigan foizga qarab zarrachalar ajraladi
      const eriganSoni = Math.floor((eriganFoiz / 100) * jamiZarracha)

      zarrachalar.forEach((p, idx) => {
        if (idx < eriganSoni) {
          // Erigan: butun stakan bo'ylab erkin suzadi
          const tezlikKoeff = (suvHarorati / 40) * (aralashtirilmoqda ? 2.5 : 1)
          p.x += p.vx * tezlikKoeff
          p.y += p.vy * tezlikKoeff

          // Devorlardan qaytish
          if (p.x < bX + 15 || p.x > bX + bW - 15) p.vx *= -1
          if (p.y < bY + 45 || p.y > bY + bH - 15) p.vy *= -1

          ctx.fillStyle =
            namunaTuri === "tuz"
              ? idx % 2 === 0
                ? "#22c55e" // Na+
                : "#eab308" // Cl-
              : namunaTuri === "shakar"
              ? "#f8fafc"
              : "#94a3b8"
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Erimagan: idish tubida kristall panjara bo'lib turadi
          ctx.fillStyle =
            namunaTuri === "tuz"
              ? idx % 2 === 0
                ? "#15803d"
                : "#ca8a04"
              : namunaTuri === "shakar"
              ? "#cbd5e1"
              : "#64748b"
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Laboratoriya stakani shisha devori
      ctx.beginPath()
      ctx.moveTo(bX, bY)
      ctx.lineTo(bX, bY + bH - 10)
      ctx.arcTo(bX, bY + bH, bX + 10, bY + bH, 10)
      ctx.lineTo(bX + bW - 10, bY + bH)
      ctx.arcTo(bX + bW, bY + bH, bX + bW, bY + bH - 10, 10)
      ctx.lineTo(bX + bW, bY)
      ctx.lineWidth = 4
      ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
      ctx.stroke()

      // O'lchov chiziqlari (ml)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 1.5
      for (let mark = 1; mark <= 4; mark++) {
        const mY = bY + bH - mark * 35
        ctx.beginPath()
        ctx.moveTo(bX + 5, mY)
        ctx.lineTo(bX + 22, mY)
        ctx.stroke()
      }

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, namunaTuri, suvHarorati, aralashtirilmoqda, eriganFoiz])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-ANIMATSIYA: LAVUAZYE MASSALAR SAQLANISH BALANSI
  // Darslikdagi matematik isbot:
  // (Yopiq kolba 150.00g) -> (101 kun) -> (Bo'sh kolba 149.85g + Cho'kma 0.15g = 150.00g)
  // ═══════════════════════════════════════════════════════════════════════════
  const taroziCanvasRef = useRef(null)
  const [taroziQadam, setTaroziQadam] = useState(1) // 1: Kolba 150.00g | 2: Suv bug'latish | 3: Qoldiq 0.15g | 4: Tenglik

  const taroziQadamTanlash = (q) => {
    setTaroziQadam(q)
    tovushChiqar("bosqich")
    if (q === 4) {
      setTimeout(() => tovushChiqar("zafar"), 300)
    }
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "tarozi") return
    const canvas = taroziCanvasRef.current
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

    let f = 0
    const render = () => {
      f += 0.05
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      // ─── BRONZA ANALITIK TAROZI ───
      // Markaziy ustun
      ctx.fillStyle = "#475569"
      ctx.fillRect(CX - 8, CY - 90, 16, 150)
      ctx.fillStyle = "#334155"
      ctx.fillRect(CX - 50, CY + 60, 100, 14)

      // Muvozanat to'sini
      ctx.strokeStyle = "#eab308"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(CX - 120, CY - 85)
      ctx.lineTo(CX + 120, CY - 85)
      ctx.stroke()

      // Markaziy sharnir
      ctx.fillStyle = "#ca8a04"
      ctx.beginPath()
      ctx.arc(CX, CY - 85, 10, 0, Math.PI * 2)
      ctx.fill()

      // Chap va o'ng osma iplar
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(CX - 120, CY - 85)
      ctx.lineTo(CX - 150, CY - 10)
      ctx.moveTo(CX - 120, CY - 85)
      ctx.lineTo(CX - 90, CY - 10)

      ctx.moveTo(CX + 120, CY - 85)
      ctx.lineTo(CX + 90, CY - 10)
      ctx.moveTo(CX + 120, CY - 85)
      ctx.lineTo(CX + 150, CY - 10)
      ctx.stroke()

      // Pallalar
      ctx.fillStyle = "#eab308"
      ctx.beginPath()
      ctx.ellipse(CX - 120, CY - 10, 36, 6, 0, 0, Math.PI * 2)
      ctx.ellipse(CX + 120, CY - 10, 36, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // ─── QADAM BO'YICHA MODDALARNING TAROZIDAGI KO'RINIShI ───
      if (taroziQadam === 1) {
        // Chapda: Suvli toza kolba
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)"
        ctx.beginPath()
        ctx.arc(CX - 120, CY - 36, 24, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)"
        ctx.lineWidth = 2.5
        ctx.stroke()

        // O'ngda: 150.00 g toshlar
        ctx.fillStyle = "#e2e8f0"
        ctx.fillRect(CX + 105, CY - 32, 30, 22)
        ctx.fillStyle = "#0f172a"
        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("150 g", CX + 120, CY - 18)
      } else if (taroziQadam === 2) {
        // Chinni kosachada suv bug'lanmoqda
        ctx.fillStyle = "#f8fafc"
        ctx.beginPath()
        ctx.arc(CX - 120, CY - 20, 26, 0, Math.PI)
        ctx.fill()

        // Bug' to'lqinlari
        for (let b = 0; b < 3; b++) {
          const by = CY - 25 - ((f * 25 + b * 15) % 35)
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
          ctx.beginPath()
          ctx.arc(CX - 120 + Math.sin(f + b) * 8, by, 4, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = "#facc15"
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("Suv bug'lanmoqda...", CX + 120, CY - 20)
      } else if (taroziQadam === 3) {
        // Chapda: Kosachada oq qattiq qoldiq
        ctx.fillStyle = "#f8fafc"
        ctx.beginPath()
        ctx.arc(CX - 120, CY - 20, 26, 0, Math.PI)
        ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.ellipse(CX - 120, CY - 20, 14, 4, 0, 0, Math.PI * 2)
        ctx.fill()

        // O'ngda: 0.15 g toshcha
        ctx.fillStyle = "#38bdf8"
        ctx.fillRect(CX + 112, CY - 22, 16, 12)
        ctx.fillStyle = "#0f172a"
        ctx.font = 'bold 10px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("0.15g", CX + 120, CY - 13)
      } else if (taroziQadam === 4) {
        // 4-QADAM: MATEMATIK ISBOTNING TO'LIQ BALANSI
        // Chapda: Bo'shagan kolba (149.85g) + Cho'kma (0.15g)
        ctx.strokeStyle = "rgba(226, 232, 240, 0.85)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(CX - 135, CY - 30, 18, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.ellipse(CX - 105, CY - 20, 10, 4, 0, 0, Math.PI * 2)
        ctx.fill()

        // O'ngda: Dastlabki 150.00g tosh
        ctx.fillStyle = "#e2e8f0"
        ctx.fillRect(CX + 105, CY - 32, 30, 22)
        ctx.fillStyle = "#0f172a"
        ctx.font = 'bold 11px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText("150 g", CX + 120, CY - 18)

        // Markazda g'alaba nuri
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.fillStyle = "#4ade80"
        ctx.textAlign = "center"
        ctx.fillText("149.85 g + 0.15 g = 150.00 g", CX, CY - 110)
      }

      ctx.restore()
      animId = kadrSora(canvas, render)
    }

    render()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, taroziQadam])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: "KIMYOGAR DETEKTIV: 101 KUNLIK SIRNI FOSH ET!"
  // 1770-yil Parij akademiyasi afsonasini fosh qilish
  // Doskaga chiqqan o'quvchi 4 ta dalilni tekshirib, yakuniy ilmiy hukmni chiqaradi.
  // ═══════════════════════════════════════════════════════════════════════════
  const [detektivDalillar, setDetektivDalillar] = useState({
    tarozi: false, // 150.00 - 149.85 = 0.15g massalar tengligi tekshirildi
    mikroskop: false, // Cho'kma tuproq emas, shishaning o'tkir qirrali kristallari
    germetiklik: false, // Idish germetik yopiq edi, tashqaridan tuproq tushmagan
    erituvchi: false, // Qaynoq suv shishani asta-sekin erita oladi
  })
  const [faolDalil, setFaolDalil] = useState(null)
  const [detektivTugadi, setDetektivTugadi] = useState(false)

  const dalilTekshir = (kalit) => {
    setFaolDalil(kalit)
    setDetektivDalillar((eski) => {
      const yangi = { ...eski, [kalit]: true }
      tovushChiqar("togri")
      if (Object.values(yangi).every(Boolean)) {
        setTimeout(() => {
          setDetektivTugadi(true)
          tovushChiqar("zafar")
        }, 500)
      }
      return yangi
    })
  }

  const detektivQayta = () => {
    setDetektivDalillar({
      tarozi: false,
      mikroskop: false,
      germetiklik: false,
      erituvchi: false,
    })
    setFaolDalil(null)
    setDetektivTugadi(false)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: "TADQIQOTCHI LABORATORIYASI: ILMIY VAZIYATLAR"
  // Darslikdagi fazilatlar: Qiziquvchanlik, Qat'iyatlilik, Halollik, Tanqidiy fikrlash
  // O'quvchi sinfdoshlari bilan birga to'g'ri ilmiy tanlovni belgilaydi.
  // ═══════════════════════════════════════════════════════════════════════════
  const ilmiyVaziyatlar = [
    {
      id: 1,
      vaziyat: "Tajribangiz 5 marta ketma-ket kutilgan natijani bermadi, cho'kma hosil bo'lmadi. Haqiqiy tadqiqotchi sifatida nima qilasiz?",
      fazilat: "Qat'iyatlilik va Sabr-toqat",
      variantlar: [
        { matn: "Uskunalarni yig'ishtirib, fanni o'rganishni tashlab ketaman", togri: false, izoh: "Tadqiqotchi qiyinchilik oldida chekinmaydi!" },
        { matn: "Taslim bo'lmasdan xatolarni tahlil qilaman va yangi gipoteza bilan qayta o'tkazaman", togri: true, izoh: "Karl Sheele va Lavuazye oylab sabr bilan qayta-qayta tekshirgan!" },
        { matn: "Kutilgan natijani daftarga soxtalashtirib yozib qo'yaman", togri: false, izoh: "Ilm-fanda yolg'on va natijani o'zgartirish qat'iyan man etiladi!" },
      ],
    },
    {
      id: 2,
      vaziyat: "Eritmaga indikator tomizganingizda kutilmagan to'q yashil rang chiqdi. Olim nima qilishi kerak?",
      fazilat: "Qiziquvchanlik va Halollik",
      variantlar: [
        { matn: "Hech kim ko'rmasligi uchun idishni tezda yuvib tashlayman", togri: false, izoh: "Bu yangi kashfiyot imkoniyatini yo'qotish demakdir." },
        { matn: "Do'stlarimdan javobni ko'chirib, to'g'ri deb yozaman", togri: false, izoh: "Tadqiqotchi o'z tajribasiga ishonishi va halol bo'lishi shart." },
        { matn: "Kutilmagan hodisaning sababini qunt bilan o'rganaman va boricha qayd etaman", togri: true, izoh: "Ko'plab buyuk kashfiyotlar kutilmagan hodisalarni o'rganishdan boshlangan!" },
      ],
    },
    {
      id: 3,
      vaziyat: "Qadimiy kitoblarda 'Suv uzoq qaynatilsa tuproqqa aylanadi' deb yozilgan. Siz ushbu da'voga qanday munosabatda bo'lasiz?",
      fazilat: "Tanqidiy fikrlash va Shubha",
      variantlar: [
        { matn: "Ko'r-ko'rona ishonmayman: aniq o'lchov va germetik idishda tajriba bilan tekshiraman", togri: true, izoh: "Lavuazye aynan shu yo'l bilan 2000 yillik adashishga chek qo'ydi!" },
        { matn: "Qadimiy bo'lgani uchun so'zsiz haqiqat deb qabul qilaman", togri: false, izoh: "Fanda har qanday gipoteza tajriba bilan tasdiqlanishi kerak." },
        { matn: "Tekshirishga erinib, boshqalarning gapiga qo'shilaveraman", togri: false, izoh: "Tadqiqotchi o'z mustaqil tekshiruviga ega bo'lishi shart." },
      ],
    },
    {
      id: 4,
      vaziyat: "101 kunlik uzoq tajribada natijalarni qanday qayd etib borish lozim?",
      fazilat: "Mas'uliyat va Aniqlik",
      variantlar: [
        { matn: "Faqat o'zimga yoqqan kunlarni yozib, qolganini o'tkazib yuboraman", togri: false, izoh: "Uzluksiz kuzatuv bo'lmasa tajriba xulosasi ishonchsiz bo'ladi." },
        { matn: "Har kuni harorat, tarozi ko'rsatkichi va o'zgarishlarni kunda-kunga aniq yozib boraman", togri: true, izoh: "Laboratoriya jurnali — tadqiqotchining eng ishonchli guvohidir!" },
        { matn: "Faqat 101-kuni eslaganlarimni taxminan yozib qo'yaman", togri: false, izoh: "Inson xotirasi mayda detallarni unutadi, yozma jurnal shart." },
      ],
    },
  ]

  const [vaziyatIndeks, setVaziyatIndeks] = useState(0)
  const [tanlanganVariant, setTanlanganVariant] = useState(null)
  const [fazilatBall, setFazilatBall] = useState(0)
  const [vaziyatTugadi, setVaziyatTugadi] = useState(false)

  const variantniTanlash = (idx) => {
    if (tanlanganVariant !== null) return
    setTanlanganVariant(idx)
    const varObj = ilmiyVaziyatlar[vaziyatIndeks].variantlar[idx]
    if (varObj.togri) {
      setFazilatBall((eski) => eski + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
  }

  const keyingiVaziyat = () => {
    if (vaziyatIndeks < ilmiyVaziyatlar.length - 1) {
      setVaziyatIndeks((eski) => eski + 1)
      setTanlanganVariant(null)
      tovushChiqar("bosqich")
    } else {
      setVaziyatTugadi(true)
      tovushChiqar("zafar")
    }
  }

  const vaziyatQayta = () => {
    setVaziyatIndeks(0)
    setTanlanganVariant(null)
    setFazilatBall(0)
    setVaziyatTugadi(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5-ANIMATSIYA: SHAM VA STAKAN (HAVODAGI KISLOROD ULUSHI ~21%)
  // ─────────────────────────────────────────────────────────────────────────
  const shamStakanRef = useRef(null)
  const [stakanHajm, setStakanHajm] = useState(500) // 250 | 500 | 1000 ml
  const [stakanYopildi, setStakanYopildi] = useState(false)
  const [yonishSekund, setYonishSekund] = useState(0)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sham_stakan") return
    const canvas = shamStakanRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let frame = 0
    const maxVaqt = stakanHajm === 250 ? 4 : stakanHajm === 500 ? 8 : 16

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
      const baseB = H - 55

      ctx.fillStyle = "#030614"
      ctx.fillRect(0, 0, W, H)

      const utgan = stakanYopildi ? Math.min(maxVaqt, frame / 35) : 0
      if (stakanYopildi && frame % 10 === 0) {
        setYonishSekund(Number(utgan.toFixed(1)))
      }
      const olovKuchi = stakanYopildi ? Math.max(0, 1 - utgan / maxVaqt) : 1
      const suvKutarilish = stakanYopildi ? (1 - olovKuchi) * 34 : 0

      // Tarelka (suvli idish)
      ctx.fillStyle = "rgba(56, 189, 248, 0.28)"
      ctx.fillRect(CX - 135, baseB - 20, 270, 20)
      ctx.strokeStyle = "#38bdf8"
      ctx.lineWidth = 2
      ctx.strokeRect(CX - 135, baseB - 20, 270, 20)

      // Sham
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(CX - 12, baseB - 95, 24, 75)
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(CX - 1.5, baseB - 104, 3, 9)

      // Sham alangasi
      if (olovKuchi > 0.05) {
        const fH = 24 * olovKuchi + Math.sin(frame * 0.25) * 2
        ctx.beginPath()
        ctx.ellipse(CX, baseB - 106 - fH * 0.4, 8 * olovKuchi, fH * 0.6, 0, 0, Math.PI * 2)
        ctx.fillStyle = "#f97316"
        ctx.shadowColor = "#fb923c"
        ctx.shadowBlur = 14
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Ustiga yopiladigan shisha silindr (stakan)
      const sW = stakanHajm === 250 ? 95 : stakanHajm === 500 ? 125 : 160
      const sH = stakanHajm === 250 ? 155 : stakanHajm === 500 ? 185 : 215
      const sY = stakanYopildi ? baseB - sH - 4 : 18

      if (stakanYopildi && suvKutarilish > 1) {
        ctx.fillStyle = "rgba(56, 189, 248, 0.42)"
        ctx.fillRect(CX - sW / 2 + 3, baseB - 20 - suvKutarilish, sW - 6, suvKutarilish)
      }

      ctx.strokeStyle = "rgba(186, 230, 253, 0.8)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(CX - sW / 2, sY + sH)
      ctx.lineTo(CX - sW / 2, sY)
      ctx.lineTo(CX + sW / 2, sY)
      ctx.lineTo(CX + sW / 2, sY + sH)
      ctx.stroke()

      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillStyle = "#fde047"
      ctx.textAlign = "center"
      ctx.fillText(
        `Idish hajmi: ${stakanHajm} ml | Kislorod (~21% O₂) tugagach suv 1/5 qismga ko'tariladi`,
        CX,
        H - 16
      )

      ctx.restore()
      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, stakanHajm, stakanYopildi])

  // ─────────────────────────────────────────────────────────────────────────
  // 6-ANIMATSIYA: MISNI QIZDIRISH (2Cu + O2 -> 2CuO, OCHIQ VS YOPIQ IDISH)
  // ─────────────────────────────────────────────────────────────────────────
  const misCanvasRef = useRef(null)
  const [misIdishTur, setMisIdishTur] = useState("ochiq") // "ochiq" | "yopiq"
  const [misQizdirilmoqda, setMisQizdirilmoqda] = useState(false)
  const [misProgress, setMisProgress] = useState(0)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "mis_oksid") return
    const canvas = misCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let frame = 0
    let p = misQizdirilmoqda ? misProgress : 0

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
      const CY = H / 2

      ctx.fillStyle = "#030614"
      ctx.fillRect(0, 0, W, H)

      if (misQizdirilmoqda && p < 100) {
        p = Math.min(100, p + 0.35)
        if (frame % 8 === 0) setMisProgress(Math.round(p))
      }

      // Tarozi platformasi
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(CX - 95, CY + 55, 190, 42)
      ctx.strokeStyle = "#38bdf8"
      ctx.strokeRect(CX - 95, CY + 55, 190, 42)

      // Elektron massa ekrani
      const massa =
        misIdishTur === "ochiq"
          ? (10.0 + (p / 100) * 2.5).toFixed(2)
          : (150.0).toFixed(2)
      ctx.font = 'bold 20px "Times New Roman", monospace'
      ctx.fillStyle = "#4ade80"
      ctx.textAlign = "center"
      ctx.fillText(`${massa} g`, CX, CY + 82)

      // Idish va Mis bo'lagi (qizg'ish Cu -> qora CuO)
      const r = Math.round(217 - (p / 100) * 180)
      const g = Math.round(119 - (p / 100) * 85)
      const b = Math.round(6 - (p / 100) * 0)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.arc(CX, CY + 18, 26, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillText(p > 60 ? "CuO (Qora)" : "Cu (Mis)", CX, CY + 22)

      if (misIdishTur === "yopiq") {
        // Yopiq shisha gumbaz
        ctx.strokeStyle = "rgba(125, 211, 252, 0.8)"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(CX, CY + 15, 65, Math.PI, 0)
        ctx.lineTo(CX + 65, CY + 54)
        ctx.lineTo(CX - 65, CY + 54)
        ctx.closePath()
        ctx.stroke()
      }

      ctx.font = 'bold 14px "Times New Roman", serif'
      ctx.fillStyle = "#fde047"
      ctx.fillText(
        misIdishTur === "ochiq"
          ? "2Cu (10g) + O₂ (havodan 2.5g) → 2CuO (12.5g) — Ochiq idishda massa ortadi"
          : "2Cu + O₂ → 2CuO — Germetik yopiq kolbada umumiy massa o'zgarmaydi (150.00g)",
        CX,
        H - 16
      )

      ctx.restore()
      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, misIdishTur, misQizdirilmoqda])

  // ─────────────────────────────────────────────────────────────────────────
  // 3-O'YIN: TAROZI HISOBLAGICHI (MASSALAR SAQLANISH QONUNI)
  // ─────────────────────────────────────────────────────────────────────────
  const taroziMasalalar = [
    {
      savol: "Yopiq Pelikan kolbasining dastlabki massasi 150.00 g. 101 kundan so'ng shisha idish 149.85 g chiqdi. Hosil bo'lgan oq cho'kma necha gramm?",
      togri: "0.15 g",
      variantlar: ["0.15 g", "1.50 g", "0.00 g", "15.0 g"],
    },
    {
      savol: "10.0 g mis (Cu) ochiq havoda qizdirilganda 2.5 g kislorod (O₂) bilan birikdi. Hosil bo'lgan qora mis(II) oksid (CuO) massasi qancha?",
      togri: "12.5 g",
      variantlar: ["25.0 g", "12.5 g", "7.5 g", "10.0 g"],
    },
    {
      savol: "Germetik yopiq kolba ichida 5 g ko'mir yondi (umumiy massa 200 g edi). Yongandan so'ng yopiq kolba tarozida necha gramm ko'rsatadi?",
      togri: "200 g",
      variantlar: ["205 g", "0 g", "200 g", "195 g"],
    },
    {
      savol: "500 ml havoda taxminan 21% kislorod (O₂) bor. Sham yopiq stakanda o'chgach, suv necha ml hajmga ko'tariladi?",
      togri: "~100 ml (1/5 qism)",
      variantlar: ["500 ml (to'liq)", "250 ml (yarmi)", "0 ml", "~100 ml (1/5 qism)"],
    },
  ]
  const [hisobIndeks, setHisobIndeks] = useState(0)
  const [hisobTanlov, setHisobTanlov] = useState(null)
  const [hisobBall, setHisobBall] = useState(0)

  // ─────────────────────────────────────────────────────────────────────────
  // 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
  // ─────────────────────────────────────────────────────────────────────────
  const duel12Savollar = [
    { savol: "Lavuazye suvni Pelikan kolbasida necha kun qaynatgan?", javob: "101 kun", variantlar: ["101 kun", "12 kun"] },
    { savol: "Karl Sheele qor suvini necha kun qaynatib shisha erishini isbotlagan?", javob: "12 kun", variantlar: ["101 kun", "12 kun"] },
    { savol: "Pelikan kolbasidagi oq cho'kma aslida nima edi?", javob: "Erigan shisha", variantlar: ["Erigan shisha", "Tuproq"] },
    { savol: "Tabiatdagi eng universal erituvchi suyuqlik qaysi?", javob: "Suv (H₂O)", variantlar: ["Simob (Hg)", "Suv (H₂O)"] },
    { savol: "Yopiq idishda kimyoviy reaksiya borsa umumiy massa nima bo'ladi?", javob: "O'zgarmaydi", variantlar: ["O'zgarmaydi", "Yo'qoladi"] },
    { savol: "Sham yopiq stakan ostida o'chishiga nima tugashi sabab bo'ladi?", javob: "Kislorod (O₂)", variantlar: ["Azot (N₂)", "Kislorod (O₂)"] },
  ]
  const [duel12Indeks, setDuel12Indeks] = useState(0)
  const [g1Ball12, setG1Ball12] = useState(0)
  const [g2Ball12, setG2Ball12] = useState(0)
  const [navbat12, setNavbat12] = useState(1)
  const [tugadi12, setTugadi12] = useState(false)

  const duel12Javob = (guruh, v) => {
    if (tugadi12 || guruh !== navbat12) return
    if (v === duel12Savollar[duel12Indeks].javob) {
      if (guruh === 1) setG1Ball12((b) => b + 10)
      else setG2Ball12((b) => b + 10)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
    if (duel12Indeks + 1 < duel12Savollar.length) {
      setDuel12Indeks((i) => i + 1)
      setNavbat12(guruh === 1 ? 2 : 1)
    } else {
      setTugadi12(true)
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
        mavzuRaqam="1.2"
        mavzuNom="Tadqiqotchilikka xos xususiyatlar"
        bobNom="1-bob. Kirish"
        sahifa={3}
        oldingiRaqam="1.1"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          0-BO'LIM: O'TGAN DARSNI TAKRORLASH VA MUSTAHKAMLASH (1.1-MAVZU)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="1.1"
          oldingiNom="Kimyo fani nimani o'rganadi?"
          savollar={takrorlashSavollari1_1}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1-BO'LIM: 4 TA CHUQUR VA KO'RGAZMALI KIMYOVIY ANIMATSIYA
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* 6 TA ANIMATSIYA MENYUSI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => {
                setAnimRejim("pelikan")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "pelikan"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="kolba" olcham={16} />
              <span>1. Pelikan (101 kun)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("sheele")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "sheele"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="tomchi" olcham={16} />
              <span>2. Sheele (Qor suvi)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("erituvchi")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "erituvchi"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="kristall" olcham={16} />
              <span>3. Suv — erituvchi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("tarozi")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "tarozi"
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 ring-2 ring-purple-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-purple-400/50"
              }`}
            >
              <Ikon nom="formula" olcham={16} />
              <span>4. Massalar balansi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("sham_stakan")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "sham_stakan"
                  ? "border-orange-400 bg-orange-500/20 text-orange-300 ring-2 ring-orange-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-orange-400/50"
              }`}
            >
              <Ikon nom="olov" olcham={16} />
              <span>5. Sham va Stakan (O₂)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnimRejim("mis_oksid")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                animRejim === "mis_oksid"
                  ? "border-rose-400 bg-rose-500/20 text-rose-300 ring-2 ring-rose-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-rose-400/50"
              }`}
            >
              <Ikon nom="chaqmoq" olcham={16} />
              <span>6. 2Cu + O₂ → 2CuO</span>
            </button>
          </div>

          {/* ─── 1-ANIMATSIYA EKRANI: PELIKAN KOLBASI ─── */}
          {animRejim === "pelikan" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={pelikanCanvasRef} className="w-full h-full block" />

                {/* Jonli darslik tushuntirishi */}
                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-yellow-300 bg-black/85 px-4 py-2 rounded-xl border border-yellow-500/30 font-semibold shadow-lg">
                    {pelikanKun === 0
                      ? "Boshlang'ich holat: Suv toza, shisha silliq va shaffof."
                      : pelikanKun < 50
                      ? `${pelikanKun}-kun: Suv doimiy aylanmoqda (reflyuks). Shisha asta-sekin eriyapti.`
                      : `${pelikanKun}-kun: Tubida oq shisha kristallari cho'kmoqda!`}
                  </span>
                </div>

                {/* Kun ko'rsatkichi */}
                <div className="absolute top-3 right-3 bg-blue-950/90 border border-blue-700/80 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-cyan-300 shadow-md">
                  Vaqt: {pelikanKun} / 101 kun
                </div>
              </div>

              {/* INTERAKTIV BOSHQARUV PANELI */}
              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPelikanOlov(!pelikanOlov)
                      tovushChiqar("olov")
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border ${
                      pelikanOlov
                        ? "border-orange-500/50 bg-orange-500/20 text-orange-300"
                        : "border-slate-700 bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Ikon nom="olov" olcham={16} />
                    <span>{pelikanOlov ? "Olovni o'chirish" : "Spirtovkani yoqish"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLupaAktiv(!lupaAktiv)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border ${
                      lupaAktiv
                        ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-300"
                        : "border-blue-900 bg-blue-950/60 text-blue-200"
                    }`}
                  >
                    <Ikon nom="mikroskop" olcham={16} />
                    <span>{lupaAktiv ? "Mikroskopni yopish" : "Mikroskop (Atomlar)"}</span>
                  </button>
                </div>

                {/* 101 kunlik vaqt mashinasi */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-blue-200 font-semibold">101 kunga tezlatish:</span>
                  <input
                    type="range"
                    min="0"
                    max="101"
                    value={pelikanKun}
                    onChange={(e) => setPelikanKun(Number(e.target.value))}
                    className="w-32 sm:w-44 accent-yellow-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setPelikanAvto(!pelikanAvto)}
                    className="px-3 py-1.5 rounded-xl border border-yellow-400/50 bg-yellow-400/20 text-yellow-300 font-bold text-xs"
                  >
                    {pelikanAvto ? "To'xtatish" : "101 kunga avto-o'tkazish"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── 2-ANIMATSIYA EKRANI: SHEELE VA QOR SUVI ─── */}
          {animRejim === "sheele" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={sheeleCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-cyan-300 bg-black/85 px-4 py-2 rounded-xl border border-cyan-500/30 font-semibold shadow-lg">
                    {sheeleKun === 0
                      ? "Karl Sheele tajribasi: Qor suvi eritilgan kolba 12 kun qaynatiladi."
                      : `${sheeleKun}-kun: Distillangan qor suvi toza bo'lgani uchun shisha silikatini o'ziga tezroq yutib oladi!`}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-blue-950/90 border border-blue-700/80 px-3 py-1.5 rounded-xl text-xs font-bold text-yellow-300">
                  {sheeleKun} / 12 kun
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={sheeleTajribaniBoshlash}
                  disabled={sheeleQaynamoqda}
                  className="px-5 py-2.5 rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <Ikon nom="olov" olcham={16} />
                  <span>{sheeleQaynamoqda ? "12 kunlik qaynash ketmoqda..." : "12 kunlik qaynashni boshlash"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── 3-ANIMATSIYA EKRANI: SUV — UNIVERSAL ERITUVCHI ─── */}
          {animRejim === "erituvchi" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={eritmaCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-emerald-300 bg-black/85 px-4 py-2 rounded-xl border border-emerald-500/30 font-semibold shadow-lg">
                    {namunaTuri === "tuz" && "Osh tuzi (NaCl): Suv molekulalari ionlarni tezda ajratib oladi."}
                    {namunaTuri === "shakar" && "Shakar: Molekulalar suvda oraliq bo'shliqlarga tarqaladi."}
                    {namunaTuri === "shisha" && "Shisha kukuni (SiO2): Suv juda sekin, lekin mikroskopik darajada eritadi!"}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-blue-950/90 border border-blue-700/80 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
                  Erish darajasi: {Math.floor(eriganFoiz)}%
                </div>
              </div>

              {/* INTERAKTIV ERITUVCHI PARAMETRLARI */}
              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Moddani tanlash */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-bold">Moddani tanlang:</span>
                    <button
                      type="button"
                      onClick={() => namunaniOzgartirish("tuz")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        namunaTuri === "tuz"
                          ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                          : "border-blue-900 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      Osh tuzi (Tez)
                    </button>
                    <button
                      type="button"
                      onClick={() => namunaniOzgartirish("shakar")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        namunaTuri === "shakar"
                          ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                          : "border-blue-900 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      Shakar bo&apos;lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => namunaniOzgartirish("shisha")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        namunaTuri === "shisha"
                          ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                          : "border-blue-900 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      Shisha kukuni (Sekin)
                    </button>
                  </div>

                  {/* Aralashtirish tugmasi */}
                  <button
                    type="button"
                    onClick={() => {
                      setAralashtirilmoqda(!aralashtirilmoqda)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      aralashtirilmoqda
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-slate-700 bg-slate-800 text-slate-300"
                    }`}
                  >
                    <span>{aralashtirilmoqda ? "Tayoqchani to'xtatish" : "Tayoqcha bilan aralashtirish"}</span>
                  </button>
                </div>

                {/* Harorat slayderi */}
                <div className="flex items-center gap-3 pt-1 border-t border-blue-900/40">
                  <Ikon nom="harorat" olcham={18} className="text-orange-400" />
                  <span className="text-xs text-blue-200">Harorat: <strong>{suvHarorati}°C</strong></span>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={suvHarorati}
                    onChange={(e) => setSuvHarorati(Number(e.target.value))}
                    className="flex-1 accent-orange-400 cursor-pointer"
                  />
                  <span className="text-xs text-orange-300 font-bold">
                    {suvHarorati > 70 ? "Issiq suv (Tez erish)" : "Sovuq suv (Sekin)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── 4-ANIMATSIYA EKRANI: LAVUAZYE BALANSI ─── */}
          {animRejim === "tarozi" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={taroziCanvasRef} className="w-full h-full block" />

                <div className="absolute top-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-xs sm:text-sm text-yellow-300 bg-black/85 px-4 py-2 rounded-xl border border-yellow-500/30 font-semibold shadow-lg">
                    {taroziQadam === 1 && "1-qadam: Dastlabki yopiq kolba va suv massasi: 150.00 gramm."}
                    {taroziQadam === 2 && "2-qadam: 101 kundan so'ng suv chinni kosachada to'liq bug'latildi."}
                    {taroziQadam === 3 && "3-qadam: Idish tubidagi oq cho'kma o'lchandi: sof 0.15 gramm."}
                    {taroziQadam === 4 && "4-qadam: Bo'shagan kolba (149.85g) + Cho'kma (0.15g) = 150.00g! Isbotlandi!"}
                  </span>
                </div>
              </div>

              {/* BOSQICHLARNI BOSISH */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => taroziQadamTanlash(1)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition ${
                    taroziQadam === 1
                      ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  1. Dastlabki 150g
                </button>
                <button
                  type="button"
                  onClick={() => taroziQadamTanlash(2)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition ${
                    taroziQadam === 2
                      ? "border-orange-400 bg-orange-500/20 text-orange-300"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  2. Suvni bug&apos;latish
                </button>
                <button
                  type="button"
                  onClick={() => taroziQadamTanlash(3)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition ${
                    taroziQadam === 3
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  3. Cho&apos;kma: 0.15g
                </button>
                <button
                  type="button"
                  onClick={() => taroziQadamTanlash(4)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition ${
                    taroziQadam === 4
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  4. Yakuniy tenglik
                </button>
              </div>
            </div>
          )}

          {/* ─── 5-ANIMATSIYA EKRANI: SHAM VA STAKAN (KISLOROD ULUSHI) ─── */}
          {animRejim === "sham_stakan" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={shamStakanRef} className="w-full h-full block" />
                <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-xl border border-orange-500/40 bg-orange-950/80 text-orange-300 font-bold text-xs">
                  Yonish vaqti: {yonishSekund} s
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {[250, 500, 1000].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setStakanHajm(h)
                        setStakanYopildi(false)
                        setYonishSekund(0)
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        stakanHajm === h
                          ? "border-orange-400 bg-orange-500/20 text-orange-300"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      {h} ml stakan
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStakanYopildi(!stakanYopildi)
                      if (stakanYopildi) setYonishSekund(0)
                      tovushChiqar("olov")
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm"
                  >
                    {stakanYopildi ? "Stakanni ko'tarish" : "Stakanni yopish"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── 6-ANIMATSIYA EKRANI: MISNI QIZDIRISH (2Cu + O2 -> 2CuO) ─── */}
          {animRejim === "mis_oksid" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
                <canvas ref={misCanvasRef} className="w-full h-full block" />
                <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/80 text-rose-300 font-bold text-xs">
                  Oksidlanish: {misProgress}%
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMisIdishTur("ochiq")
                      setMisQizdirilmoqda(false)
                      setMisProgress(0)
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${
                      misIdishTur === "ochiq"
                        ? "border-rose-400 bg-rose-500/20 text-rose-300"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    1. Ochiq idish (+O₂ kiradi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMisIdishTur("yopiq")
                      setMisQizdirilmoqda(false)
                      setMisProgress(0)
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${
                      misIdishTur === "yopiq"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    2. Germetik yopiq kolba
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMisQizdirilmoqda(true)
                      tovushChiqar("olov")
                    }}
                    disabled={misQizdirilmoqda}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm disabled:opacity-50"
                  >
                    Qizdirish (2Cu + O₂ → 2CuO)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMisQizdirilmoqda(false)
                      setMisProgress(0)
                    }}
                    className="px-4 py-2.5 rounded-xl border border-blue-800 bg-[#081236] text-blue-200 font-bold text-xs"
                  >
                    Tozalash
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          2-BO'LIM: SMART DOSKA O'YINLARI (4 TA O'YIN)
         ═══════════════════════════════════════════════════════════════════════ */}
      {asosiyBolim === "oyinlar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] backdrop-blur-xl shadow-2xl space-y-4">
          {/* 4 TA O'YIN TANLASH */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setOyinRejim("detektiv")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "detektiv"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
              }`}
            >
              <Ikon nom="kuzatuv" olcham={16} />
              <span>1. Lavuazye Dalillari</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("fazilat")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "fazilat"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom="quiz" olcham={16} />
              <span>2. Laboratoriya Qarori</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("tarozi_hisob")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "tarozi_hisob"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-cyan-400/50"
              }`}
            >
              <Ikon nom="formula" olcham={16} />
              <span>3. Tarozi Hisoblagichi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOyinRejim("duel")
                tovushChiqar("bosqich")
              }}
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                oyinRejim === "duel"
                  ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30"
                  : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-amber-400/50"
              }`}
            >
              <Ikon nom="kubok" olcham={16} />
              <span>4. Jamoalar Dueli (1 vs 2)</span>
            </button>
          </div>

          {/* ─── 1-O'YIN: KIMYOGAR DETEKTIV ─── */}
          {oyinRejim === "detektiv" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                  <Ikon nom="kuzatuv" olcham={18} />
                  <span>Pelikan kolbasi: 4 ta ilmiy dalilni tekshiring</span>
                </h3>

                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                  Dalillar: {Object.values(detektivDalillar).filter(Boolean).length} / 4
                </div>
              </div>

              {/* 4 TA ILMIY DALIL KARTASI (SMART DOSKADA BOSISH UCHUN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-dalil: Tarozi */}
                <button
                  type="button"
                  onClick={() => dalilTekshir("tarozi")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-lg active:scale-98 ${
                    detektivDalillar.tarozi
                      ? "border-emerald-500/70 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${detektivDalillar.tarozi ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-blue-300"}`}>
                    <Ikon nom="formula" olcham={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>1-Dalil: Analitik tarozi hisobi</span>
                      {detektivDalillar.tarozi && <Ikon nom="tasdiq" olcham={16} className="text-emerald-400" />}
                    </div>
                    <p className="text-xs text-blue-200/90 leading-relaxed">
                      Bo&apos;shagan kolba massasi 149.85g ga tushdi (-0.15g).
                      Hosil bo&apos;lgan cho&apos;kma esa aynan +0.15g! Massalar teng keldi!
                    </p>
                  </div>
                </button>

                {/* 2-dalil: Mikroskop */}
                <button
                  type="button"
                  onClick={() => dalilTekshir("mikroskop")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-lg active:scale-98 ${
                    detektivDalillar.mikroskop
                      ? "border-emerald-500/70 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${detektivDalillar.mikroskop ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-blue-300"}`}>
                    <Ikon nom="mikroskop" olcham={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>2-Dalil: Mikroskopik tahlil</span>
                      {detektivDalillar.mikroskop && <Ikon nom="tasdiq" olcham={16} className="text-emerald-400" />}
                    </div>
                    <p className="text-xs text-blue-200/90 leading-relaxed">
                      Kukun tuproq emas, balki shishaning o&apos;tkir qirrali shaffof silikat (SiO2) kristallari ekanligi ko&apos;rindi!
                    </p>
                  </div>
                </button>

                {/* 3-dalil: Germetiklik */}
                <button
                  type="button"
                  onClick={() => dalilTekshir("germetiklik")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-lg active:scale-98 ${
                    detektivDalillar.germetiklik
                      ? "border-emerald-500/70 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${detektivDalillar.germetiklik ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-blue-300"}`}>
                    <Ikon nom="qalqon" olcham={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>3-Dalil: Germetik muhr</span>
                      {detektivDalillar.germetiklik && <Ikon nom="tasdiq" olcham={16} className="text-emerald-400" />}
                    </div>
                    <p className="text-xs text-blue-200/90 leading-relaxed">
                      Pelikan kolbasi germetik berkitilgan edi. Tashqaridan chang yoki havodagi zarracha tushishi imkonsiz!
                    </p>
                  </div>
                </button>

                {/* 4-dalil: Erituvchi */}
                <button
                  type="button"
                  onClick={() => dalilTekshir("erituvchi")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 shadow-lg active:scale-98 ${
                    detektivDalillar.erituvchi
                      ? "border-emerald-500/70 bg-emerald-950/40 text-emerald-200"
                      : "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${detektivDalillar.erituvchi ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-900/40 text-blue-300"}`}>
                    <Ikon nom="tomchi" olcham={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>4-Dalil: Suvning erituvchanligi</span>
                      {detektivDalillar.erituvchi && <Ikon nom="tasdiq" olcham={16} className="text-emerald-400" />}
                    </div>
                    <p className="text-xs text-blue-200/90 leading-relaxed">
                      Qaynoq suv universal erituvchidir. 101 kun davomida u hatto mustahkam shisha devorini ham eritib yubordi!
                    </p>
                  </div>
                </button>
              </div>

              {/* YAKUNIY HUKM EKRANI */}
              {detektivTugadi && (
                <div className="p-6 rounded-3xl border-2 border-yellow-500/70 bg-gradient-to-br from-yellow-950/40 via-[#0a102a] to-[#04081c] text-center space-y-3 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/50 mx-auto flex items-center justify-center text-yellow-400">
                    <Ikon nom="kubok" olcham={32} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-300">
                    Tabriklaymiz! Siz Parij Akademiyasi sirini fosh etdingiz!
                  </h3>

                  <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
                    <strong>Ilmiy hukm:</strong> Suv hech qachon tuproqqa aylanmagan! Idishdagi oq cho&apos;kma — bu suvda
                    erigan shishaning o&apos;zidir. Lavuazye singari aniq o&apos;lchov va sabr orqali haqiqat isbotlandi!
                  </p>

                  <button
                    type="button"
                    onClick={detektivQayta}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-yellow-500/20"
                  >
                    Tergovni qaytadan boshlash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 2-O'YIN: TADQIQOTCHI LABORATORIYASI (ILMIY VAZIYATLAR) ─── */}
          {oyinRejim === "fazilat" && (
            <div className="space-y-4">
              {!vaziyatTugadi ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                        {ilmiyVaziyatlar[vaziyatIndeks].fazilat}
                      </span>
                      <h4 className="text-xs text-blue-300">
                        Laboratoriyadagi kutilmagan vaziyatda qanday yo&apos;l tutasiz?
                      </h4>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold text-xs">
                      {vaziyatIndeks + 1} / {ilmiyVaziyatlar.length}
                    </div>
                  </div>

                  {/* Vaziyat matni */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/60 bg-[#081236]/90 text-center space-y-2 shadow-xl">
                    <h3 className="text-base sm:text-xl font-bold text-white max-w-2xl mx-auto leading-relaxed">
                      &quot;{ilmiyVaziyatlar[vaziyatIndeks].vaziyat}&quot;
                    </h3>
                  </div>

                  {/* 3 ta variant (Smart doskada katta sensorli tugmalar) */}
                  <div className="space-y-2.5">
                    {ilmiyVaziyatlar[vaziyatIndeks].variantlar.map((varObj, idx) => {
                      const tanlandi = tanlanganVariant === idx
                      let tugmaStil = "border-blue-900 bg-[#060b22] text-blue-100 hover:border-yellow-400/50"

                      if (tanlanganVariant !== null) {
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
                          onClick={() => variantniTanlash(idx)}
                          className={`w-full p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-md active:scale-98 ${tugmaStil}`}
                        >
                          <div className="space-y-0.5">
                            <div>{varObj.matn}</div>
                            {tanlanganVariant !== null && (
                              <div className="text-[11px] font-normal opacity-90">{varObj.izoh}</div>
                            )}
                          </div>
                          {tanlanganVariant !== null && varObj.togri && (
                            <Ikon nom="tasdiq" olcham={20} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {tanlanganVariant !== null && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={keyingiVaziyat}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20"
                      >
                        {vaziyatIndeks < ilmiyVaziyatlar.length - 1 ? "Keyingi vaziyatga o'tish" : "Natijani ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Natija ekrani */
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                    <Ikon nom="sertifikat" olcham={36} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Tadqiqotchi sinovi yakunlandi!
                  </h3>
                  <p className="text-base sm:text-lg text-emerald-300 font-bold">
                    To&apos;g&apos;ri ilmiy xulosalar: {fazilatBall} / {ilmiyVaziyatlar.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-200/90 max-w-md mx-auto leading-relaxed">
                    Sizda haqiqiy olimlarga xos <strong>Qiziquvchanlik</strong>, <strong>Qat&apos;iyatlilik</strong>,{" "}
                    <strong>Ilmiy halollik</strong> va <strong>Tanqidiy fikrlash</strong> fazilatlari mustahkamlandi!
                  </p>
                  <button
                    type="button"
                    onClick={vaziyatQayta}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-xl"
                  >
                    O&apos;yinni qaytadan o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 3-O'YIN: TAROZI HISOBLAGICHI ─── */}
          {oyinRejim === "tarozi_hisob" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
                <span className="text-xs sm:text-sm font-bold text-cyan-300">
                  Masala: {hisobIndeks + 1} / {taroziMasalalar.length}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                  Ball: {hisobBall}
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/60 bg-[#081236] text-center">
                <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed">
                  {taroziMasalalar[hisobIndeks].savol}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {taroziMasalalar[hisobIndeks].variantlar.map((v) => {
                  const togri = v === taroziMasalalar[hisobIndeks].togri
                  let stil = "border-blue-800 bg-[#060b22] text-blue-100 hover:border-cyan-400"
                  if (hisobTanlov !== null) {
                    if (togri) stil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-400/40"
                    else if (hisobTanlov === v) stil = "border-rose-500 bg-rose-950/60 text-rose-200"
                  }
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        if (hisobTanlov !== null) return
                        setHisobTanlov(v)
                        if (togri) {
                          setHisobBall((b) => b + 25)
                          tovushChiqar("togri")
                        } else {
                          tovushChiqar("xato")
                        }
                      }}
                      className={`p-4 rounded-2xl border font-bold text-base sm:text-lg transition text-center ${stil}`}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>

              {hisobTanlov !== null && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (hisobIndeks + 1 < taroziMasalalar.length) {
                        setHisobIndeks((i) => i + 1)
                        setHisobTanlov(null)
                      } else {
                        setHisobIndeks(0)
                        setHisobTanlov(null)
                        setHisobBall(0)
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm"
                  >
                    {hisobIndeks + 1 < taroziMasalalar.length ? "Keyingi masala →" : "Qayta boshlash"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH) ─── */}
          {oyinRejim === "duel" && (
            <div className="space-y-4">
              {!tugadi12 ? (
                <>
                  <div className="p-4 rounded-2xl border border-yellow-500/40 bg-[#081236] text-center space-y-1">
                    <div className="text-xs font-bold text-yellow-400">
                      {duel12Indeks + 1} / {duel12Savollar.length} — Navbat: {navbat12}-GURUH
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      {duel12Savollar[duel12Indeks].savol}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                      navbat12 === 1 ? "border-cyan-400 bg-cyan-950/30 shadow-lg" : "border-blue-900/40 bg-[#060b22]/50 opacity-60"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 text-base">1-GURUH</span>
                        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 font-bold text-sm">{g1Ball12} ball</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {duel12Savollar[duel12Indeks].variantlar.map((v) => (
                          <button
                            key={v}
                            type="button"
                            disabled={navbat12 !== 1}
                            onClick={() => duel12Javob(1, v)}
                            className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/35 text-white font-bold text-sm sm:text-base transition active:scale-95"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                      navbat12 === 2 ? "border-amber-400 bg-amber-950/30 shadow-lg" : "border-blue-900/40 bg-[#060b22]/50 opacity-60"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-base">2-GURUH</span>
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-bold text-sm">{g2Ball12} ball</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {duel12Savollar[duel12Indeks].variantlar.map((v) => (
                          <button
                            key={v}
                            type="button"
                            disabled={navbat12 !== 2}
                            onClick={() => duel12Javob(2, v)}
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
                    {g1Ball12 > g2Ball12 ? "1-GURUH G'OLIB!" : g2Ball12 > g1Ball12 ? "2-GURUH G'OLIB!" : "DURANG!"}
                  </h3>
                  <div className="text-lg font-bold text-white">
                    1-Guruh: {g1Ball12} ball | 2-Guruh: {g2Ball12} ball
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDuel12Indeks(0)
                      setG1Ball12(0)
                      setG2Ball12(0)
                      setNavbat12(1)
                      setTugadi12(false)
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
