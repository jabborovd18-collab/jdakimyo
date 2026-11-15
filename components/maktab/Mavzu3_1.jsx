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

    if (turi === "togri" || turi === "tasdiq") {
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
    // AudioContext bloklangan bo'lsa xato chiqarmaslik
  }
}

const ELEMENTLAR_BAZASI = [
  { z: 1, belgi: "H", nom: "Vodorod", lotin: "Hydrogenium", m: 1, n: 0, qavatlar: [1], tur: "metallmas", rang: "#38bdf8" },
  { z: 2, belgi: "He", nom: "Geliy", lotin: "Helium", m: 4, n: 2, qavatlar: [2], tur: "metallmas", rang: "#a855f7" },
  { z: 3, belgi: "Li", nom: "Litiy", lotin: "Lithium", m: 7, n: 4, qavatlar: [2, 1], tur: "metall", rang: "#f43f5e" },
  { z: 6, belgi: "C", nom: "Uglerod", lotin: "Carboneum", m: 12, n: 6, qavatlar: [2, 4], tur: "metallmas", rang: "#94a3b8" },
  { z: 7, belgi: "N", nom: "Azot", lotin: "Nitrogenium", m: 14, n: 7, qavatlar: [2, 5], tur: "metallmas", rang: "#60a5fa" },
  { z: 8, belgi: "O", nom: "Kislorod", lotin: "Oxygenium", m: 16, n: 8, qavatlar: [2, 6], tur: "metallmas", rang: "#ef4444" },
  { z: 11, belgi: "Na", nom: "Natriy", lotin: "Natrium", m: 23, n: 12, qavatlar: [2, 8, 1], tur: "metall", rang: "#facc15" },
  { z: 12, belgi: "Mg", nom: "Magniy", lotin: "Magnesium", m: 24, n: 12, qavatlar: [2, 8, 2], tur: "metall", rang: "#22c55e" },
  { z: 13, belgi: "Al", nom: "Alyuminiy", lotin: "Aluminium", m: 27, n: 14, qavatlar: [2, 8, 3], tur: "metall", rang: "#cbd5e1" },
  { z: 14, belgi: "Si", nom: "Kremniy", lotin: "Silicium", m: 28, n: 14, qavatlar: [2, 8, 4], tur: "metalloid", rang: "#f59e0b" },
  { z: 15, belgi: "P", nom: "Fosfor", lotin: "Phosphorus", m: 31, n: 16, qavatlar: [2, 8, 5], tur: "metallmas", rang: "#fb923c" },
  { z: 16, belgi: "S", nom: "Oltingugurt", lotin: "Sulfur", m: 32, n: 16, qavatlar: [2, 8, 6], tur: "metallmas", rang: "#fde047" },
  { z: 17, belgi: "Cl", nom: "Xlor", lotin: "Chlorum", m: 35.5, n: 18, qavatlar: [2, 8, 7], tur: "metallmas", rang: "#4ade80" },
  { z: 19, belgi: "K", nom: "Kaliy", lotin: "Kalium", m: 39, n: 20, qavatlar: [2, 8, 8, 1], tur: "metall", rang: "#c084fc" },
  { z: 20, belgi: "Ca", nom: "Kalsiy", lotin: "Calcium", m: 40, n: 20, qavatlar: [2, 8, 8, 2], tur: "metall", rang: "#fb7185" },
  { z: 26, belgi: "Fe", nom: "Temir", lotin: "Ferrum", m: 56, n: 30, qavatlar: [2, 8, 14, 2], tur: "metall", rang: "#94a3b8" },
  { z: 29, belgi: "Cu", nom: "Mis", lotin: "Cuprum", m: 64, n: 35, qavatlar: [2, 8, 18, 1], tur: "metall", rang: "#f97316" },
  { z: 47, belgi: "Ag", nom: "Kumush", lotin: "Argentum", m: 108, n: 61, qavatlar: [2, 8, 18, 18, 1], tur: "metall", rang: "#e2e8f0" },
  { z: 79, belgi: "Au", nom: "Oltin", lotin: "Aurum", m: 197, n: 118, qavatlar: [2, 8, 18, 32, 18, 1], tur: "metall", rang: "#fbbf24" },
]

const SINOV_NAMUNALARI = [
  { id: "Cu", belgi: "Cu", nom: "Mis plastinka", tur: "Metall", tok: 98, lampa: true, bolga: "yassilanadi", rang: "#ea580c" },
  { id: "Fe", belgi: "Fe", nom: "Temir sterjen", tur: "Metall", tok: 75, lampa: true, bolga: "yassilanadi", rang: "#94a3b8" },
  { id: "Al", belgi: "Al", nom: "Alyuminiy folga", tur: "Metall", tok: 88, lampa: true, bolga: "yassilanadi", rang: "#cbd5e1" },
  { id: "Si", belgi: "Si", nom: "Kremniy kristali", tur: "Metalloid", tok: 25, lampa: false, bolga: "sinadi", rang: "#f59e0b" },
  { id: "S", belgi: "S", nom: "Oltingugurt bo'lagi", tur: "Metallmas", tok: 0, lampa: false, bolga: "sinadi", rang: "#facc15" },
  { id: "C", belgi: "C", nom: "Grafit (Istisno)", tur: "Metallmas", tok: 60, lampa: true, bolga: "sinadi", rang: "#475569" },
]

const ALANGA_IONLARI = [
  { id: "Na", formula: "NaCl (Natriy)", ion: "Na⁺", rangNom: "Yorqin sariq", hex: "#facc15", toqin: "589 nm" },
  { id: "K", formula: "KCl (Kaliy)", ion: "K⁺", rangNom: "Binafsha", hex: "#c084fc", toqin: "766 nm" },
  { id: "Cu", formula: "CuSO₄ (Mis)", ion: "Cu²⁺", rangNom: "Zumrad yashil", hex: "#10b981", toqin: "515 nm" },
  { id: "Li", formula: "LiCl (Litiy)", ion: "Li⁺", rangNom: "To'q qirmizi", hex: "#f43f5e", toqin: "670 nm" },
  { id: "Ca", formula: "CaCl₂ (Kalsiy)", ion: "Ca²⁺", rangNom: "G'isht-qizil", hex: "#fb923c", toqin: "622 nm" },
  { id: "Ba", formula: "BaCl₂ (Bariy)", ion: "Ba²⁺", rangNom: "Sariq-yashil", hex: "#a3e635", toqin: "524 nm" },
]

export default function Mavzu3_1() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("atom")
  const [oyinRejim, setOyinRejim] = useState("belgi")

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

  // 0-BO'LIM: 2.2-MAVZUNI TAKRORLASH SAVOLLARI
  const takrorlashSavollari2_2 = [
    {
      savol: "Qattiq yod (I₂) yoki quruq muzning (CO₂) suyuqlanmasdan to'g'ridan-to'g'ri gazga aylanishi nima deyiladi?",
      variantlar: ["Sublimatsiya", "Kondensatsiya", "Kristallanish", "Erish"],
      togriJavob: "Sublimatsiya",
      izoh: "Qattiq holatdan suyuq holatga o'tmay turib gazga aylanish sublimatsiya deyiladi.",
    },
    {
      savol: "Suvning qizdirish egri chizig'ida 0°C va 100°C da harorat nega vaqtincha o'zgarmay turadi?",
      variantlar: [
        "Modda massasi kamayadi",
        "Issiqlik zarrachalararo bog'larni uzishga sarflanadi",
        "Gorelka o'chib qoladi",
        "Zarrachalar to'xtab qoladi",
      ],
      togriJavob: "Issiqlik zarrachalararo bog'larni uzishga sarflanadi",
      izoh: "Faza o'tish nuqtasida berilgan energiya zarrachalararo tortishish kuchlarini yengishga ketadi.",
    },
    {
      savol: "Toza suvga osh tuzi (NaCl) qo'shilsa, uning muzlash va qaynash harorati qanday o'zgaradi?",
      variantlar: [
        "Hech qanday o'zgarish bo'lmaydi",
        "Suv darhol muzlab qoladi",
        "Muzlash 0°C dan pasayadi, qaynash 100°C dan ko'tariladi",
        "Ikkalasi ham 50°C ga tushadi",
      ],
      togriJavob: "Muzlash 0°C dan pasayadi, qaynash 100°C dan ko'tariladi",
      izoh: "Aralashmalar sof moddaning erish nuqtasini pasaytiradi va qaynash nuqtasini oshiradi.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: ATOM TUZILISHI VA ELEMENT KARTASI (CANVAS)
  // ═══════════════════════════════════════════════════════════════════════════
  const atomCanvasRef = useRef(null)
  const [tanlanganEl, setTanlanganEl] = useState(ELEMENTLAR_BAZASI[6]) // Na

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "atom") return
    const canvas = atomCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.025
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)

      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const cx = w * 0.38
      const cy = h * 0.52

      // Elektron qavatlar (K, L, M, N...)
      tanlanganEl.qavatlar.forEach((elSoni, qIdx) => {
        const r = 42 + qIdx * 28
        ctx.strokeStyle = "rgba(56,189,248,0.25)"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()

        for (let i = 0; i < elSoni; i++) {
          const burchak = (i / elSoni) * Math.PI * 2 + t * (1.2 - qIdx * 0.18)
          const ex = cx + Math.cos(burchak) * r
          const ey = cy + Math.sin(burchak) * r

          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(ex, ey, 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "rgba(56,189,248,0.3)"
          ctx.beginPath()
          ctx.arc(ex, ey, 9, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Yadro
      const grd = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 24)
      grd.addColorStop(0, "#ffffff")
      grd.addColorStop(0.4, tanlanganEl.rang)
      grd.addColorStop(1, "#1e293b")
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(cx, cy, 24, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#020617"
      ctx.font = "bold 15px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(tanlanganEl.belgi, cx, cy + 5)

      // O'ng tarafda davriy jadval katakchasi
      const kx = w * 0.68
      const ky = h * 0.16
      const kw = Math.min(230, w * 0.28)
      const kh = h * 0.68

      ctx.fillStyle = "rgba(15,23,42,0.9)"
      ctx.strokeStyle = tanlanganEl.rang
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(kx, ky, kw, kh, 18)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#94a3b8"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.textAlign = "left"
      ctx.fillText(`Z = ${tanlanganEl.z}`, kx + 18, ky + 30)

      ctx.textAlign = "right"
      ctx.fillStyle = "#facc15"
      ctx.fillText(`Ar = ${tanlanganEl.m}`, kx + kw - 18, ky + 30)

      ctx.textAlign = "center"
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 54px 'Times New Roman', serif"
      ctx.fillText(tanlanganEl.belgi, kx + kw / 2, ky + 95)

      ctx.fillStyle = tanlanganEl.rang
      ctx.font = "bold 20px 'Times New Roman', serif"
      ctx.fillText(tanlanganEl.nom, kx + kw / 2, ky + 128)

      ctx.fillStyle = "#cbd5e1"
      ctx.font = "italic 15px 'Times New Roman', serif"
      ctx.fillText(`(${tanlanganEl.lotin})`, kx + kw / 2, ky + 150)

      // p+, n0, e- ko'rsatkichlari
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.fillStyle = "#38bdf8"
      ctx.fillText(
        `p⁺ = ${tanlanganEl.z}   |   n⁰ = ${tanlanganEl.n}   |   e⁻ = ${tanlanganEl.z}`,
        kx + kw / 2,
        ky + 185
      )

      const turMatn =
        tanlanganEl.tur === "metall"
          ? "METALL"
          : tanlanganEl.tur === "metalloid"
          ? "METALLOID (Yarimo'tkazgich)"
          : "METALLMAS"
      ctx.fillStyle =
        tanlanganEl.tur === "metall"
          ? "#4ade80"
          : tanlanganEl.tur === "metalloid"
          ? "#facc15"
          : "#f43f5e"
      ctx.fillText(turMatn, kx + kw / 2, ky + 215)

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, tanlanganEl])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: ELEKTR O'TKAZUVCHANLIK VA BOLG'ALASH SINOVI (CANVAS)
  // ═══════════════════════════════════════════════════════════════════════════
  const sinovCanvasRef = useRef(null)
  const [namuna, setNamuna] = useState(SINOV_NAMUNALARI[0])
  const [bolgaUrildi, setBolgaUrildi] = useState(false)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "sinov") return
    const canvas = sinovCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.05
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      // Elektr zanjiri
      const chapX = w * 0.16
      const ongX = w * 0.56
      const yTop = h * 0.25
      const yPast = h * 0.72

      ctx.strokeStyle = namuna.tok > 0 ? "#facc15" : "#475569"
      ctx.lineWidth = 4
      ctx.strokeRect(chapX, yTop, ongX - chapX, yPast - yTop)

      // Elektron oqimi
      if (namuna.tok > 0) {
        for (let i = 0; i < 8; i++) {
          const p = ((i / 8 + t * (namuna.tok / 2500)) % 1) * (ongX - chapX)
          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(chapX + p, yTop, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Batareya (chapda)
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(chapX - 24, h * 0.42, 48, 65)
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(chapX - 24, h * 0.42, 48, 18)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 13px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText("9V DC", chapX, h * 0.58)

      // Lampochka (o'ngda)
      const lx = ongX
      const ly = h * 0.48
      if (namuna.tok > 0) {
        const g = ctx.createRadialGradient(lx, ly, 4, lx, ly, namuna.tok > 40 ? 48 : 25)
        g.addColorStop(0, "#fef08a")
        g.addColorStop(0.5, "rgba(250,204,21,0.45)")
        g.addColorStop(1, "rgba(250,204,21,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(lx, ly, 48, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = namuna.tok > 40 ? "#facc15" : namuna.tok > 0 ? "#ca8a04" : "#334155"
      ctx.beginPath()
      ctx.arc(lx, ly, 20, 0, Math.PI * 2)
      ctx.fill()

      // Namuna (pastki qismda qisqichlar orasida)
      const nx = (chapX + ongX) / 2
      const ny = yPast
      ctx.fillStyle = namuna.rang
      ctx.beginPath()
      ctx.roundRect(nx - 55, ny - 16, 110, 32, 8)
      ctx.fill()
      ctx.fillStyle = "#020617"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.fillText(`${namuna.belgi} (${namuna.tur})`, nx, ny + 5)

      // O'ng bo'lim: Bolg'alash mexanizmi (Plastiklik vs Mo'rtlik)
      const bx = w * 0.78
      const by = h * 0.62
      ctx.fillStyle = "#334155"
      ctx.fillRect(bx - 70, by + 20, 140, 22) // Sandon

      if (!bolgaUrildi) {
        ctx.fillStyle = namuna.rang
        ctx.beginPath()
        ctx.roundRect(bx - 35, by - 15, 70, 35, 6)
        ctx.fill()
      } else if (namuna.bolga === "yassilanadi") {
        // Metall yassilanib plastinka bo'ladi
        ctx.fillStyle = namuna.rang
        ctx.beginPath()
        ctx.roundRect(bx - 62, by + 6, 124, 14, 4)
        ctx.fill()
      } else {
        // Metallmas va metalloid mayda bo'laklarga sinadi
        ;[-42, -18, 5, 28, 45].forEach((dx, idx) => {
          ctx.fillStyle = namuna.rang
          ctx.beginPath()
          ctx.arc(bx + dx, by + 10 - (idx % 2) * 6, 9, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 15px 'Times New Roman', serif"
      ctx.fillText(
        `Tok o'tkazishi: ${namuna.tok}%`,
        (chapX + ongX) / 2,
        h * 0.14
      )
      ctx.fillStyle = namuna.bolga === "yassilanadi" ? "#4ade80" : "#f43f5e"
      ctx.fillText(
        bolgaUrildi
          ? namuna.bolga === "yassilanadi"
            ? "Plastik: Yassilandi (sinmadi)"
            : "Mo'rt: Maydalanib sindi!"
          : "Mexanik zarba sinovi",
        bx,
        h * 0.25
      )

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, namuna, bolgaUrildi])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: ELEMENTLARNING ALANGA RANGI (SPEKTR)
  // ═══════════════════════════════════════════════════════════════════════════
  const alangaCanvasRef = useRef(null)
  const [tanlanganIon, setTanlanganIon] = useState(ALANGA_IONLARI[0])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "alanga") return
    const canvas = alangaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.08
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const gx = w * 0.45
      const gy = h * 0.78

      // Bunzen gorelkasi
      ctx.fillStyle = "#475569"
      ctx.fillRect(gx - 45, gy, 90, 18)
      ctx.fillStyle = "#64748b"
      ctx.fillRect(gx - 16, gy - 75, 32, 75)

      // Alanga tashqi nuri
      const flH = 145 + Math.sin(t * 2) * 10
      const flW = 48 + Math.cos(t * 3) * 5
      const grd = ctx.createRadialGradient(gx, gy - 135, 10, gx, gy - 135, 120)
      grd.addColorStop(0, "#ffffff")
      grd.addColorStop(0.35, tanlanganIon.hex)
      grd.addColorStop(1, "rgba(0,0,0,0)")

      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.ellipse(gx, gy - 140, flW * 1.4, flH * 0.75, 0, 0, Math.PI * 2)
      ctx.fill()

      // Platina sim ilmoq
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(w * 0.18, gy - 125)
      ctx.lineTo(gx, gy - 125)
      ctx.stroke()

      ctx.fillStyle = tanlanganIon.hex
      ctx.beginPath()
      ctx.arc(gx, gy - 125, 8, 0, Math.PI * 2)
      ctx.fill()

      // Spektr ma'lumoti
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 20px 'Times New Roman', serif"
      ctx.textAlign = "left"
      ctx.fillText(`${tanlanganIon.formula}`, w * 0.62, h * 0.35)

      ctx.fillStyle = tanlanganIon.hex
      ctx.font = "bold 24px 'Times New Roman', serif"
      ctx.fillText(`Alanga: ${tanlanganIon.rangNom}`, w * 0.62, h * 0.48)

      ctx.fillStyle = "#38bdf8"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillText(`Ion: ${tanlanganIon.ion}  |  λ = ${tanlanganIon.toqin}`, w * 0.62, h * 0.6)

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, tanlanganIon])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: ISHQORIY METALL + SUV (2Na + 2H₂O → 2NaOH + H₂↑)
  // ═══════════════════════════════════════════════════════════════════════════
  const suvCanvasRef = useRef(null)
  const [ishqorMetall, setIshqorMetall] = useState("Na")
  const [reaksiyaFaol, setReaksiyaFaol] = useState(true)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "suv_reaksiya") return
    const canvas = suvCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      if (reaksiyaFaol) t += 0.05
      const { w, h } = canvasOlchami(canvas, ctx)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const bx = w * 0.25
      const by = h * 0.22
      const bw = w * 0.5
      const bh = h * 0.64

      // Suv + Fenolftalein (pushti-malina rangga o'tishi)
      ctx.fillStyle = reaksiyaFaol ? "rgba(236,72,153,0.42)" : "rgba(56,189,248,0.25)"
      ctx.fillRect(bx, by + bh * 0.35, bw, bh * 0.65)

      // Kristallizator idish
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 4
      ctx.strokeRect(bx, by, bw, bh)

      // Metall sharchasining suv yuzasida yugurishi
      const tezlik = ishqorMetall === "K" ? 2.4 : ishqorMetall === "Na" ? 1.5 : 0.7
      const mx = bx + bw * 0.5 + Math.sin(t * tezlik) * (bw * 0.32)
      const my = by + bh * 0.35

      // H2 pufakchalari va alanga
      for (let i = 0; i < 10; i++) {
        const px = mx + Math.sin(t * 3 + i) * 22
        const py = my - ((t * 35 + i * 12) % 75)
        ctx.fillStyle = "rgba(255,255,255,0.75)"
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (ishqorMetall === "K" || ishqorMetall === "Na") {
        const alangaRang = ishqorMetall === "K" ? "#c084fc" : "#facc15"
        ctx.fillStyle = alangaRang
        ctx.beginPath()
        ctx.arc(mx, my - 14, ishqorMetall === "K" ? 18 : 11, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = "#e2e8f0"
      ctx.beginPath()
      ctx.arc(mx, my, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 18px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        `2${ishqorMetall} + 2H₂O → 2${ishqorMetall}OH + H₂↑`,
        w / 2,
        h * 0.12
      )
      ctx.fillStyle = "#f472b6"
      ctx.font = "bold 14px 'Times New Roman', serif"
      ctx.fillText(
        "Fenolftalein: Ishqoriy muhitda (OH⁻) malina rangga kiradi",
        w / 2,
        h * 0.93
      )

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, ishqorMetall, reaksiyaFaol])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: ALLOTROPIYA (OLMOS vs GRAFIT, O₂ vs O₃)
  // ═══════════════════════════════════════════════════════════════════════════
  const allotropCanvasRef = useRef(null)
  const [allotropTur, setAllotropTur] = useState("uglerod")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "allotropiya") return
    const canvas = allotropCanvasRef.current
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

      if (allotropTur === "uglerod") {
        // Chapda: Olmos (Tetraedrik 3D panjara)
        const cx1 = w * 0.27
        const cy1 = h * 0.48
        const tugunlar = [
          [cx1, cy1 - 55],
          [cx1, cy1],
          [cx1 - 55, cy1 + 42],
          [cx1 + 55, cy1 + 42],
          [cx1, cy1 + 65],
        ]
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 3
        ;[[0, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4]].forEach(([a, b]) => {
          ctx.beginPath()
          ctx.moveTo(tugunlar[a][0], tugunlar[a][1])
          ctx.lineTo(tugunlar[b][0], tugunlar[b][1])
          ctx.stroke()
        })
        tugunlar.forEach(([x, y]) => {
          ctx.fillStyle = "#e0f2fe"
          ctx.beginPath()
          ctx.arc(x, y, 11, 0, Math.PI * 2)
          ctx.fill()
        })

        ctx.fillStyle = "#38bdf8"
        ctx.font = "bold 17px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("OLMOS (C) — Qattiqlik: 10 (Izolyator)", cx1, h * 0.86)

        // O'ngda: Grafit (Qatlamli panjara + erkin elektronlar)
        const cx2 = w * 0.73
        ;[-45, 5, 55].forEach((dy) => {
          ctx.strokeStyle = "#94a3b8"
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(cx2 - 75, cy1 + dy)
          ctx.lineTo(cx2 + 75, cy1 + dy)
          ctx.stroke()
          ;[-65, -22, 22, 65].forEach((dx) => {
            ctx.fillStyle = "#cbd5e1"
            ctx.beginPath()
            ctx.arc(cx2 + dx, cy1 + dy, 8, 0, Math.PI * 2)
            ctx.fill()
          })
        })

        // Qatlamlar orasida harakatlanuvchi erkin elektronlar
        for (let i = 0; i < 4; i++) {
          const ex = cx2 - 65 + (((t * 50 + i * 35) % 130))
          ctx.fillStyle = "#facc15"
          ctx.beginPath()
          ctx.arc(ex, cy1 - 20, 4, 0, Math.PI * 2)
          ctx.arc(ex, cy1 + 30, 4, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = "#facc15"
        ctx.fillText("GRAFIT (C) — Qatlamli (Tok o'tkazadi)", cx2, h * 0.86)
      } else {
        // Kislorod (O2) va Ozon (O3)
        const cx1 = w * 0.28
        const cx2 = w * 0.72
        const cy = h * 0.48

        // O2 molekulalari
        for (let i = 0; i < 3; i++) {
          const x = cx1 + Math.sin(t + i * 2) * 35
          const y = cy - 40 + i * 42
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(x - 11, y, 12, 0, Math.PI * 2)
          ctx.arc(x + 11, y, 12, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = "#ef4444"
        ctx.font = "bold 18px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText("Kislorod (O₂) — Rangsiz, Hidsiz", cx1, h * 0.86)

        // O3 molekulalari
        for (let i = 0; i < 3; i++) {
          const x = cx2 + Math.cos(t + i * 2) * 35
          const y = cy - 40 + i * 42
          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(x, y - 10, 11, 0, Math.PI * 2)
          ctx.arc(x - 13, y + 8, 11, 0, Math.PI * 2)
          ctx.arc(x + 13, y + 8, 11, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = "#38bdf8"
        ctx.fillText("Ozon (O₃) — 3O₂ → 2O₃ (Chaqmoq)", cx2, h * 0.86)
      }

      animId = kadrSora(canvas, chiz)
    }

    chiz()
    return () => kadrniBekorQil(animId)
  }, [asosiyBolim, animRejim, allotropTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: TABIATDA TARQALISHI (YER QOBIG'I, INSON, KOINOT)
  // ═══════════════════════════════════════════════════════════════════════════
  const tarqalishCanvasRef = useRef(null)
  const [muhitTur, setMuhitTur] = useState("yer")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "tarqalish") return
    const canvas = tarqalishCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const { w, h } = canvasOlchami(canvas, ctx)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const malumot =
      muhitTur === "yer"
        ? [
            { belgi: "O (Kislorod)", foiz: 49, rang: "#ef4444" },
            { belgi: "Si (Kremniy)", foiz: 26, rang: "#f59e0b" },
            { belgi: "Al (Alyuminiy)", foiz: 7.5, rang: "#cbd5e1" },
            { belgi: "Fe (Temir)", foiz: 4.7, rang: "#38bdf8" },
            { belgi: "Ca, Na, K, Mg", foiz: 12.8, rang: "#4ade80" },
          ]
        : muhitTur === "inson"
        ? [
            { belgi: "O (Kislorod)", foiz: 65, rang: "#ef4444" },
            { belgi: "C (Uglerod)", foiz: 18, rang: "#94a3b8" },
            { belgi: "H (Vodorod)", foiz: 10, rang: "#38bdf8" },
            { belgi: "N (Azot)", foiz: 3, rang: "#a855f7" },
            { belgi: "Ca, P, K, Na, Fe", foiz: 4, rang: "#facc15" },
          ]
        : [
            { belgi: "H (Vodorod)", foiz: 75, rang: "#38bdf8" },
            { belgi: "He (Geliy)", foiz: 23, rang: "#a855f7" },
            { belgi: "Boshqa elementlar", foiz: 2, rang: "#facc15" },
          ]

    malumot.forEach((m, idx) => {
      const y = 45 + idx * 58
      const barW = ((w - 260) * m.foiz) / 80

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px 'Times New Roman', serif"
      ctx.textAlign = "left"
      ctx.fillText(m.belgi, 28, y + 22)

      ctx.fillStyle = "#0f172a"
      ctx.beginPath()
      ctx.roundRect(190, y, w - 240, 34, 10)
      ctx.fill()

      ctx.fillStyle = m.rang
      ctx.beginPath()
      ctx.roundRect(190, y, Math.max(24, barW), 34, 10)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.fillText(`${m.foiz}%`, 200 + Math.max(24, barW), y + 23)
    })
  }, [asosiyBolim, animRejim, muhitTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-O'YIN: BELGINI TOP (LOTINCHA NOM VA KIMYOVIY BELGI)
  // ═══════════════════════════════════════════════════════════════════════════
  const belgiSavollari = [
    { savol: "Temir (Ferrum) elementining kimyoviy belgisi qaysi?", variantlar: ["Cu", "F", "Ag", "Fe"], togri: "Fe" },
    { savol: "Mis (Cuprum) elementining kimyoviy belgisi qaysi?", variantlar: ["Cu", "Ca", "C", "Co"], togri: "Cu" },
    { savol: "Kumush (Argentum) elementining kimyoviy belgisi qaysi?", variantlar: ["Ar", "Ag", "Au", "Al"], togri: "Ag" },
    { savol: "Oltin (Aurum) elementining kimyoviy belgisi qaysi?", variantlar: ["Fe", "Hg", "Au", "Ag"], togri: "Au" },
    { savol: "Simob (Hydrargyrum) elementining kimyoviy belgisi qaysi?", variantlar: ["H", "He", "Pb", "Hg"], togri: "Hg" },
    { savol: "Qo'rg'oshin (Plumbum) elementining kimyoviy belgisi qaysi?", variantlar: ["Pb", "P", "Pt", "Sn"], togri: "Pb" },
  ]
  const [bIdx, setBIdx] = useState(0)
  const [bTanlov, setBTanlov] = useState(null)
  const [bBall, setBBall] = useState(0)
  const [bTugadi, setBTugadi] = useState(false)

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-O'YIN: METALL, METALLMAS YOKI METALLOID?
  // ═══════════════════════════════════════════════════════════════════════════
  const sinfSavollari = [
    { matn: "Cu (Mis) — Elektr tokini a'lo o'tkazadi, bolg'alanganda yassilanadi", tur: "metall" },
    { matn: "S (Oltingugurt) — Sariq mo'rt kristall, tok o'tkazmaydi (izolyator)", tur: "metallmas" },
    { matn: "Si (Kremniy) — Yarimo'tkazgich, quyosh panellari va mikrochiplar asosi", tur: "metalloid" },
    { matn: "Fe (Temir) — Magnitga tortiladi, metall yaltiroqlikka ega", tur: "metall" },
    { matn: "O₂ (Kislorod) — Nafas olish va yonishni ta'minlovchi gaz", tur: "metallmas" },
    { matn: "Ge (Germaniy) — Metall va metallmas oralig'idagi yarimo'tkazgich", tur: "metalloid" },
  ]
  const [sIdx, setSIdx] = useState(0)
  const [sBall, setSBall] = useState(0)
  const [sNatija, setSNatija] = useState(null)
  const [sTugadi, setSTugadi] = useState(false)

  const sinfTanlash = (tur) => {
    if (sNatija !== null) return
    const togri = tur === sinfSavollari[sIdx].tur
    setSNatija(togri)
    if (togri) {
      setSBall((b) => b + 1)
      tovushChiqar("togri")
    } else {
      tovushChiqar("xato")
    }
    setTimeout(() => {
      if (sIdx < sinfSavollari.length - 1) {
        setSIdx((i) => i + 1)
        setSNatija(null)
      } else {
        setSTugadi(true)
      }
    }, 850)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-O'YIN: LABORATORIYA DETEKTIVI (ALANGA VA REAKSIYA)
  // ═══════════════════════════════════════════════════════════════════════════
  const labSavollari = [
    {
      savol: "Noma'lum metall suvga tashlanganda suv yuzasida yugurib H₂ ajratdi va alangani yorqin SARIQ rangga bo'yadi. Bu qaysi element?",
      variantlar: ["Si (Kremniy)", "Na (Natriy)", "Cu (Mis)", "Fe (Temir)"],
      togri: "Na (Natriy)",
    },
    {
      savol: "Tuz namunasi Bunzen alangasiga tutilganda alanga ZUMRAD YASHIL rangga kirdi. Namunada qaysi element ioni bor?",
      variantlar: ["K⁺ (Kaliy)", "Ca²⁺ (Kalsiy)", "Cu²⁺ (Mis)", "Na⁺ (Natriy)"],
      togri: "Cu²⁺ (Mis)",
    },
    {
      savol: "Qaysi metallmas element istisno tariqasida elektr tokini yaxshi o'tkazadi?",
      variantlar: ["S (Oltingugurt)", "P (Fosfor)", "O₂ (Kislorod)", "C (Grafit)"],
      togri: "C (Grafit)",
    },
    {
      savol: "Odatdagi xona haroratida (20°C) suyuq holatda bo'ladigan yagona metall va yagona metallmas juftligini toping:",
      variantlar: ["Hg (Simob) va Br₂ (Brom)", "Fe (Temir) va S (Oltingugurt)", "Na (Natriy) va Cl₂ (Xlor)", "Au (Oltin) va I₂ (Yod)"],
      togri: "Hg (Simob) va Br₂ (Brom)",
    },
  ]
  const [lIdx, setLIdx] = useState(0)
  const [lTanlov, setLTanlov] = useState(null)
  const [lBall, setLBall] = useState(0)
  const [lTugadi, setLTugadi] = useState(false)

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-O'YIN: JAMOALAR DUELI (1-GURUH vs 2-GURUH)
  // ═══════════════════════════════════════════════════════════════════════════
  const duelSavollari = [
    { s: "Yer qobig'ida eng ko'p tarqalgan (49%) element?", v: ["O (Kislorod)", "Fe (Temir)", "Au (Oltin)"], j: "O (Kislorod)" },
    { s: "Kaliy (K⁺) tuzlari alangani qanday rangga bo'yaydi?", v: ["Yashil", "Binafsha", "Sariq"], j: "Binafsha" },
    { s: "Qaysi element yarimo'tkazgich (metalloid) hisoblanadi?", v: ["Cu (Mis)", "S (Oltingugurt)", "Si (Kremniy)"], j: "Si (Kremniy)" },
    { s: "2Na + 2H₂O reaksiyasida qanday gaz ajralib chiqadi?", v: ["H₂ (Vodorod)", "O₂ (Kislorod)", "CO₂"], j: "H₂ (Vodorod)" },
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
      {/* ─── SMART DOSKA YUQORI NAVIGATSIYASI ─── */}
      <SmartDoskaNavigatsiya
        mavzuRaqam="3.1"
        mavzuNom="Kimyoviy elementlar"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={28}
        oldingiRaqam="2.2"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {/* 0-BO'LIM: O'TGAN DARSNI TAKRORLASH */}
      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="2.2"
          oldingiNom="Moddaning agregat holat o'zgarishlari"
          savollar={takrorlashSavollari2_2}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {/* 1-BO'LIM: 6 TA INTERAKTIV KO'RGAZMA (CANVAS) */}
      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "atom", nom: "1. Atom (p⁺, n⁰, e⁻)", ikon: "atom" },
              { id: "sinov", nom: "2. Tok va Bolg'alash", ikon: "chaqmoq" },
              { id: "alanga", nom: "3. Alanga rangi", ikon: "olov" },
              { id: "suv_reaksiya", nom: "4. 2Na + 2H₂O", ikon: "kolba" },
              { id: "allotropiya", nom: "5. Allotropiya (C, O₃)", ikon: "kristall" },
              { id: "tarqalish", nom: "6. Tabiatda ulushi", ikon: "qalqon" },
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

          {/* 1. ATOM KONSTRUKTORI */}
          {animRejim === "atom" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={atomCanvasRef} className="w-full h-full block" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {ELEMENTLAR_BAZASI.map((el) => (
                  <button
                    key={el.belgi}
                    type="button"
                    onClick={() => {
                      setTanlanganEl(el)
                      tovushChiqar("bosqich")
                    }}
                    className={`p-2 rounded-xl border text-center transition ${
                      tanlanganEl.belgi === el.belgi
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200 scale-105 shadow-md"
                        : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-blue-500"
                    }`}
                  >
                    <div className="text-[10px] opacity-75">Z={el.z}</div>
                    <div className="text-sm font-bold">{el.belgi}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. TOK O'TKAZISH VA BOLG'ALASH SINOVI */}
          {animRejim === "sinov" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={sinovCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {SINOV_NAMUNALARI.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setNamuna(n)
                        setBolgaUrildi(false)
                        tovushChiqar("bosqich")
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        namuna.id === n.id
                          ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      {n.belgi} ({n.nom})
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBolgaUrildi((b) => !b)
                    tovushChiqar("togri")
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm"
                >
                  {bolgaUrildi ? "Namunani tiklash" : "Bolg'a bilan urib sinash"}
                </button>
              </div>
            </div>
          )}

          {/* 3. ALANGA RANGI */}
          {animRejim === "alanga" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={alangaCanvasRef} className="w-full h-full block" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {ALANGA_IONLARI.map((ion) => (
                  <button
                    key={ion.id}
                    type="button"
                    onClick={() => {
                      setTanlanganIon(ion)
                      tovushChiqar("bosqich")
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                      tanlanganIon.id === ion.id
                        ? "border-yellow-400 bg-yellow-500/20 text-white"
                        : "border-blue-900/60 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    <div>{ion.formula}</div>
                    <div style={{ color: ion.hex }} className="text-[11px]">
                      {ion.rangNom}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. 2Na + 2H2O REAKSIYASI */}
          {animRejim === "suv_reaksiya" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={suvCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {[
                    { id: "Li", nom: "Litiy (Li) — Tinch suzadi" },
                    { id: "Na", nom: "Natriy (Na) — Sharcha bo'lib yuguradi" },
                    { id: "K", nom: "Kaliy (K) — Binafsha alanga bilan yonadi" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setIshqorMetall(m.id)
                        setReaksiyaFaol(true)
                        tovushChiqar("togri")
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                        ishqorMetall === m.id
                          ? "border-pink-400 bg-pink-500/25 text-pink-200"
                          : "border-blue-900 bg-[#081236] text-blue-200"
                      }`}
                    >
                      {m.nom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ALLOTROPIYA */}
          {animRejim === "allotropiya" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={allotropCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setAllotropTur("uglerod")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    allotropTur === "uglerod"
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Uglerod allotropiyasi: Olmos va Grafit (C)
                </button>
                <button
                  type="button"
                  onClick={() => setAllotropTur("kislorod")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    allotropTur === "kislorod"
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Kislorod allotropiyasi: Kislorod (O₂) va Ozon (O₃)
                </button>
              </div>
            </div>
          )}

          {/* 6. TABIATDA TARQALISHI */}
          {animRejim === "tarqalish" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={tarqalishCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "yer", nom: "1. Yer qobig'i (O 49%, Si 26%)" },
                  { id: "inson", nom: "2. Inson organizmi (O 65%, C 18%)" },
                  { id: "koinot", nom: "3. Koinot va Quyosh (H 75%, He 23%)" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMuhitTur(m.id)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                      muhitTur === m.id
                        ? "border-emerald-400 bg-emerald-500/25 text-emerald-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {m.nom}
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
              { id: "belgi", nom: "1. Element Belgisi", ikon: "atom" },
              { id: "sinf", nom: "2. Metall / Metallmas", ikon: "chaqmoq" },
              { id: "lab", nom: "3. Alanga va Xossa", ikon: "olov" },
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
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                    : "border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50"
                }`}
              >
                <Ikon nom={o.ikon} olcham={18} />
                <span>{o.nom}</span>
              </button>
            ))}
          </div>

          {/* 1-O'YIN: ELEMENT BELGISI */}
          {oyinRejim === "belgi" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!bTugadi ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-400">
                      Savol {bIdx + 1} / {belgiSavollari.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">Ball: {bBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {belgiSavollari[bIdx].savol}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {belgiSavollari[bIdx].variantlar.map((v) => {
                      const togri = v === belgiSavollari[bIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white hover:border-yellow-400"
                      if (bTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (bTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (bTanlov !== null) return
                            setBTanlov(v)
                            if (togri) {
                              setBBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-5 rounded-2xl border-2 text-2xl font-bold transition ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {bTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (bIdx < belgiSavollari.length - 1) {
                            setBIdx((i) => i + 1)
                            setBTanlov(null)
                          } else {
                            setBTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">
                    Natija: {bBall} / {belgiSavollari.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBIdx(0)
                      setBTanlov(null)
                      setBBall(0)
                      setBTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2-O'YIN: METALL, METALLMAS YOKI METALLOID */}
          {oyinRejim === "sinf" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!sTugadi ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-400">
                      Namuna {sIdx + 1} / {sinfSavollari.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">Ball: {sBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {sinfSavollari[sIdx].matn}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => sinfTanlash("metall")}
                      className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200 font-bold text-base"
                    >
                      METALL
                    </button>
                    <button
                      type="button"
                      onClick={() => sinfTanlash("metallmas")}
                      className="p-5 rounded-2xl border border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/40 text-rose-200 font-bold text-base"
                    >
                      METALLMAS
                    </button>
                    <button
                      type="button"
                      onClick={() => sinfTanlash("metalloid")}
                      className="p-5 rounded-2xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 font-bold text-base"
                    >
                      METALLOID
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">
                    Natija: {sBall} / {sinfSavollari.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSIdx(0)
                      setSBall(0)
                      setSNatija(null)
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

          {/* 3-O'YIN: ALANGA VA XOSSA VIKTORINASI */}
          {oyinRejim === "lab" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!lTugadi ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-400">
                      Tajriba {lIdx + 1} / {labSavollari.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">Ball: {lBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {labSavollari[lIdx].savol}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {labSavollari[lIdx].variantlar.map((v) => {
                      const togri = v === labSavollari[lIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white hover:border-cyan-400"
                      if (lTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (lTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (lTanlov !== null) return
                            setLTanlov(v)
                            if (togri) {
                              setLBall((b) => b + 1)
                              tovushChiqar("togri")
                            } else {
                              tovushChiqar("xato")
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left font-bold text-sm transition ${kl}`}
                        >
                          {v}
                        </button>
                      )
                    })}
                  </div>
                  {lTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (lIdx < labSavollari.length - 1) {
                            setLIdx((i) => i + 1)
                            setLTanlov(null)
                          } else {
                            setLTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">
                    Natija: {lBall} / {labSavollari.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLIdx(0)
                      setLTanlov(null)
                      setLBall(0)
                      setLTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4-O'YIN: JAMOALAR DUELI (1-GURUH vs 2-GURUH) */}
          {oyinRejim === "duel" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1-GURUH */}
              <div className="p-5 rounded-2xl border-2 border-cyan-500/50 bg-[#051026] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-300">1-GURUH (Chap doska)</span>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 font-bold text-sm">
                    {g1Ball} ball
                  </span>
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

              {/* 2-GURUH */}
              <div className="p-5 rounded-2xl border-2 border-amber-500/50 bg-[#1a1205] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-300">2-GURUH (O&apos;ng doska)</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-bold text-sm">
                    {g2Ball} ball
                  </span>
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
