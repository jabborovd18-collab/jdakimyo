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
    // AudioContext xatosini e'tiborsiz qoldirish
  }
}

const MOLEKULALAR_3D = [
  {
    id: "H2O",
    formula: "H₂O",
    nom: "Suv molekulasi",
    burchak: "104.5° (Burchakli)",
    bog: "Qutbli kovalent (O-H)",
    atomlar: [
      { belgi: "O", dx: 0, dy: -15, r: 28, rang: "#ef4444" },
      { belgi: "H", dx: -58, dy: 38, r: 17, rang: "#38bdf8" },
      { belgi: "H", dx: 58, dy: 38, r: 17, rang: "#38bdf8" },
    ],
    boglar: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: "CO2",
    formula: "CO₂",
    nom: "Karbonat angidrid",
    burchak: "180° (Chiziqli: O=C=O)",
    bog: "Qo'shbog' (2x C=O)",
    atomlar: [
      { belgi: "C", dx: 0, dy: 0, r: 25, rang: "#94a3b8" },
      { belgi: "O", dx: -78, dy: 0, r: 26, rang: "#ef4444" },
      { belgi: "O", dx: 78, dy: 0, r: 26, rang: "#ef4444" },
    ],
    boglar: [[0, 1, 2], [0, 2, 2]],
  },
  {
    id: "NH3",
    formula: "NH₃",
    nom: "Ammiak molekulasi",
    burchak: "107.3° (Trigonal piramida)",
    bog: "3 ta N-H bog'",
    atomlar: [
      { belgi: "N", dx: 0, dy: -22, r: 27, rang: "#60a5fa" },
      { belgi: "H", dx: -64, dy: 36, r: 16, rang: "#38bdf8" },
      { belgi: "H", dx: 0, dy: 52, r: 16, rang: "#38bdf8" },
      { belgi: "H", dx: 64, dy: 36, r: 16, rang: "#38bdf8" },
    ],
    boglar: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
  },
  {
    id: "CH4",
    formula: "CH₄",
    nom: "Metan molekulasi",
    burchak: "109.5° (Tetraedr)",
    bog: "4 ta C-H bog'",
    atomlar: [
      { belgi: "C", dx: 0, dy: 0, r: 25, rang: "#94a3b8" },
      { belgi: "H", dx: 0, dy: -66, r: 16, rang: "#38bdf8" },
      { belgi: "H", dx: -62, dy: 38, r: 16, rang: "#38bdf8" },
      { belgi: "H", dx: 62, dy: 38, r: 16, rang: "#38bdf8" },
      { belgi: "H", dx: 0, dy: 56, r: 16, rang: "#38bdf8" },
    ],
    boglar: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
  },
  {
    id: "N2",
    formula: "N₂",
    nom: "Azot molekulasi",
    burchak: "180° (Ikki atomli: N≡N)",
    bog: "Uchlamchi bog' (N≡N)",
    atomlar: [
      { belgi: "N", dx: -48, dy: 0, r: 27, rang: "#60a5fa" },
      { belgi: "N", dx: 48, dy: 0, r: 27, rang: "#60a5fa" },
    ],
    boglar: [[0, 1, 3]],
  },
  {
    id: "O3",
    formula: "O₃",
    nom: "Ozon molekulasi",
    burchak: "116.8° (Burchakli)",
    bog: "3 ta kislorod atomi",
    atomlar: [
      { belgi: "O", dx: 0, dy: -26, r: 26, rang: "#38bdf8" },
      { belgi: "O", dx: -60, dy: 34, r: 26, rang: "#ef4444" },
      { belgi: "O", dx: 60, dy: 34, r: 26, rang: "#ef4444" },
    ],
    boglar: [[0, 1, 2], [0, 2, 1]],
  },
]

export default function Mavzu3_2() {
  const containerRef = useRef(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [asosiyBolim, setAsosiyBolim] = useState("animatsiyalar")
  const [animRejim, setAnimRejim] = useState("atom_yadro")
  const [oyinRejim, setOyinRejim] = useState("hisob")

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

  const takrorlash3_1 = [
    {
      savol: "Temir (Ferrum) va Mis (Cuprum) elementlarining kimyoviy belgilari to'g'ri ko'rsatilgan qatorni toping:",
      variantlar: ["Fe va Cu", "F va C", "Fe va Ca", "Au va Ag"],
      togriJavob: "Fe va Cu",
      izoh: "Temir — Fe (Ferrum), Mis — Cu (Cuprum).",
    },
    {
      savol: "Natriy (Na⁺) tuzlari Bunzen gorelkasi alangasini qanday rangga bo'yaydi?",
      variantlar: ["Yorqin sariq", "Binafsha", "Zumrad yashil", "Ko'k"],
      togriJavob: "Yorqin sariq",
      izoh: "Natriy ioni (Na⁺) alangani 589 nm to'lqin uzunligidagi yorqin sariq rangga bo'yaydi.",
    },
    {
      savol: "Bitta kimyoviy elementning bir necha xil oddiy modda hosil qilishi (masalan: Olmos va Grafit) nima deyiladi?",
      variantlar: ["Allotropiya", "Sublimatsiya", "Diffuziya", "Filtratsiya"],
      togriJavob: "Allotropiya",
      izoh: "Uglerodning olmos va grafit, kislorodning O₂ va O₃ hosil qilishi allotropiya hodisasidir.",
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // 1-KO'RGAZMA: ATOM YADROSI VA ELEKTRON BALANSI (p⁺, n⁰, e⁻)
  // ═══════════════════════════════════════════════════════════════════════════
  const yadroCanvasRef = useRef(null)
  const [protonSoni, setProtonSoni] = useState(6) // C

  const ATOM_NOMLARI = [
    "",
    "H (Vodorod)",
    "He (Geliy)",
    "Li (Litiy)",
    "Be (Berilliy)",
    "B (Bor)",
    "C (Uglerod)",
    "N (Azot)",
    "O (Kislorod)",
    "F (Ftor)",
    "Ne (Neon)",
  ]

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "atom_yadro") return
    const canvas = yadroCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.03
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const cx = w * 0.42
      const cy = h * 0.52
      const neytronSoni = protonSoni === 1 ? 0 : protonSoni

      // Qobiqlar: 1-qobiq (max 2), 2-qobiq (qolgani)
      const q1 = Math.min(2, protonSoni)
      const q2 = Math.max(0, protonSoni - 2)
      const qavatlar = q2 > 0 ? [q1, q2] : [q1]

      qavatlar.forEach((son, idx) => {
        const r = 68 + idx * 48
        ctx.strokeStyle = "rgba(56,189,248,0.28)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()

        for (let i = 0; i < son; i++) {
          const a = (i / son) * Math.PI * 2 + t * (idx === 0 ? 1.4 : 0.9)
          const ex = cx + Math.cos(a) * r
          const ey = cy + Math.sin(a) * r
          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(ex, ey, 6, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Yadro ichidagi protonlar (qizil) va neytronlar (kulrang)
      for (let i = 0; i < protonSoni + neytronSoni; i++) {
        const a = (i / (protonSoni + neytronSoni)) * Math.PI * 2
        const r = i % 2 === 0 ? 8 : 16
        const px = cx + Math.cos(a) * (protonSoni === 1 ? 0 : r)
        const py = cy + Math.sin(a) * (protonSoni === 1 ? 0 : r)
        ctx.fillStyle = i < protonSoni ? "#ef4444" : "#94a3b8"
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fill()
      }

      // O'ng panel: ko'rsatkichlar
      const rx = w * 0.72
      ctx.textAlign = "left"
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 24px 'Times New Roman', serif"
      ctx.fillText(ATOM_NOMLARI[protonSoni], rx - 60, h * 0.25)

      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillStyle = "#ef4444"
      ctx.fillText(`Protonlar (p⁺): +${protonSoni}`, rx - 60, h * 0.42)
      ctx.fillStyle = "#94a3b8"
      ctx.fillText(`Neytronlar (n⁰): ${neytronSoni}`, rx - 60, h * 0.54)
      ctx.fillStyle = "#38bdf8"
      ctx.fillText(`Elektronlar (e⁻): -${protonSoni}`, rx - 60, h * 0.66)
      ctx.fillStyle = "#4ade80"
      ctx.fillText(`Umumiy zaryad: 0 (Neytral)`, rx - 60, h * 0.78)

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, protonSoni])

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-KO'RGAZMA: 3D MOLEKULA KONSTRUKTORI VA BOG' BURCHAKLARI
  // ═══════════════════════════════════════════════════════════════════════════
  const molCanvasRef = useRef(null)
  const [tanlanganMol, setTanlanganMol] = useState(MOLEKULALAR_3D[0])

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "molekula_3d") return
    const canvas = molCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.03
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const cx = w * 0.44
      const cy = h * 0.52
      const suzishY = Math.sin(t) * 6

      // Kimyoviy bog'larni chizish
      tanlanganMol.boglar.forEach(([i1, i2, karrali]) => {
        const a1 = tanlanganMol.atomlar[i1]
        const a2 = tanlanganMol.atomlar[i2]
        for (let k = 0; k < karrali; k++) {
          const offset = (k - (karrali - 1) / 2) * 8
          ctx.strokeStyle = "#cbd5e1"
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(cx + a1.dx, cy + a1.dy + suzishY + offset)
          ctx.lineTo(cx + a2.dx, cy + a2.dy + suzishY + offset)
          ctx.stroke()
        }
      })

      // Atom sharchalari
      tanlanganMol.atomlar.forEach((a) => {
        const ax = cx + a.dx
        const ay = cy + a.dy + suzishY
        const grd = ctx.createRadialGradient(ax - 5, ay - 5, 2, ax, ay, a.r)
        grd.addColorStop(0, "#ffffff")
        grd.addColorStop(0.4, a.rang)
        grd.addColorStop(1, "#0f172a")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(ax, ay, a.r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 15px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(a.belgi, ax, ay + 5)
      })

      // Ma'lumot bloki
      ctx.textAlign = "left"
      ctx.fillStyle = "#facc15"
      ctx.font = "bold 28px 'Times New Roman', serif"
      ctx.fillText(`${tanlanganMol.formula} — ${tanlanganMol.nom}`, w * 0.62, h * 0.36)

      ctx.fillStyle = "#38bdf8"
      ctx.font = "bold 17px 'Times New Roman', serif"
      ctx.fillText(`Geometriya: ${tanlanganMol.burchak}`, w * 0.62, h * 0.5)

      ctx.fillStyle = "#4ade80"
      ctx.fillText(`Bog'lanish: ${tanlanganMol.bog}`, w * 0.62, h * 0.62)

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, tanlanganMol])

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-KO'RGAZMA: KOEFFITSIYENT VA INDEKS HISOBLAGICHI (n H₂O)
  // ═══════════════════════════════════════════════════════════════════════════
  const indeksCanvasRef = useRef(null)
  const [koeff, setKoeff] = useState(3)
  const [indModda, setIndModda] = useState("H2O")

  const IND_MODDALAR = {
    H2O: { formula: "H₂O", tarkib: [{ b: "H", s: 2, r: "#38bdf8" }, { b: "O", s: 1, r: "#ef4444" }] },
    CO2: { formula: "CO₂", tarkib: [{ b: "C", s: 1, r: "#94a3b8" }, { b: "O", s: 2, r: "#ef4444" }] },
    NH3: { formula: "NH₃", tarkib: [{ b: "N", s: 1, r: "#60a5fa" }, { b: "H", s: 3, r: "#38bdf8" }] },
    H2SO4: {
      formula: "H₂SO₄",
      tarkib: [
        { b: "H", s: 2, r: "#38bdf8" },
        { b: "S", s: 1, r: "#facc15" },
        { b: "O", s: 4, r: "#ef4444" },
      ],
    },
  }

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "indeks") return
    const canvas = indeksCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#030714"
    ctx.fillRect(0, 0, w, h)

    const modda = IND_MODDALAR[indModda]

    // Katta formula yozuvi
    ctx.textAlign = "center"
    ctx.font = "bold 38px 'Times New Roman', serif"
    ctx.fillStyle = "#facc15"
    ctx.fillText(
      `${koeff > 1 ? koeff : ""}${modda.formula}  (${koeff} ta molekula)`,
      w / 2,
      48
    )

    // Har bir molekulani alohida katakda chizish
    const stepX = w / (koeff + 1)
    for (let m = 0; m < koeff; m++) {
      const mx = stepX * (m + 1)
      const my = h * 0.46

      ctx.strokeStyle = "rgba(56,189,248,0.35)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(mx - 54, my - 46, 108, 92, 16)
      ctx.stroke()

      let aIdx = 0
      modda.tarkib.forEach((t) => {
        for (let k = 0; k < t.s; k++) {
          const ax = mx - 32 + (aIdx % 4) * 22
          const ay = my - 12 + Math.floor(aIdx / 4) * 26
          ctx.fillStyle = t.r
          ctx.beginPath()
          ctx.arc(ax, ay, 10, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = "#020617"
          ctx.font = "bold 11px 'Times New Roman', serif"
          ctx.fillText(t.b, ax, ay + 4)
          aIdx++
        }
      })
    }

    // Pastki qatorda jami atomlar hisobi
    const hisobMatn = modda.tarkib
      .map((t) => `${t.b} = ${koeff} × ${t.s} = ${koeff * t.s} ta`)
      .join("   |   ")
    const jami = modda.tarkib.reduce((acc, t) => acc + koeff * t.s, 0)

    ctx.fillStyle = "#4ade80"
    ctx.font = "bold 18px 'Times New Roman', serif"
    ctx.fillText(`${hisobMatn}   (Jami: ${jami} ta atom)`, w / 2, h * 0.86)
  }, [asosiyBolim, animRejim, koeff, indModda])

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-KO'RGAZMA: BIR ATOMLI (He), IKKI ATOMLI (O₂) VA KO'P ATOMLI (P₄, S₈)
  // ═══════════════════════════════════════════════════════════════════════════
  const atomlikCanvasRef = useRef(null)
  const [atomlikTur, setAtomlikTur] = useState("ikki")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "atomlik") return
    const canvas = atomlikCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.04
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < 6; i++) {
        const x = w * 0.2 + (i % 3) * (w * 0.3) + Math.sin(t + i) * 18
        const y = h * 0.34 + Math.floor(i / 3) * (h * 0.34) + Math.cos(t + i) * 14

        if (atomlikTur === "bir") {
          ctx.fillStyle = "#a855f7"
          ctx.beginPath()
          ctx.arc(x, y, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 12px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.fillText("He", x, y + 4)
        } else if (atomlikTur === "ikki") {
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(x - 13, y, 14, 0, Math.PI * 2)
          ctx.arc(x + 13, y, 14, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 12px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.fillText("O₂", x, y + 4)
        } else {
          // S8 halqasi
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2 + t * 0.5
            ctx.fillStyle = "#facc15"
            ctx.beginPath()
            ctx.arc(x + Math.cos(a) * 22, y + Math.sin(a) * 22, 8, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.fillStyle = "#facc15"
          ctx.font = "bold 13px 'Times New Roman', serif"
          ctx.textAlign = "center"
          ctx.fillText("S₈", x, y + 4)
        }
      }

      ctx.fillStyle = "#38bdf8"
      ctx.font = "bold 18px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        atomlikTur === "bir"
          ? "Bir atomli erkin gazlar: He, Ne, Ar"
          : atomlikTur === "ikki"
          ? "Ikki atomli molekulalar (7 ta): H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂"
          : "Ko'p atomli oddiy molekulalar: O₃ (Ozon), P₄ (Oq fosfor), S₈ (Oltingugurt)",
        w / 2,
        36
      )

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, atomlikTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-KO'RGAZMA: SUV ELEKTROLIZI (2H₂O → 2H₂↑ + O₂↑)
  // ═══════════════════════════════════════════════════════════════════════════
  const elektrolizCanvasRef = useRef(null)
  const [tokYoqiq, setTokYoqiq] = useState(true)

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "elektroliz") return
    const canvas = elektrolizCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      if (tokYoqiq) t += 0.04
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const kX = w * 0.35 // Katod (-) -> 2 hajm H2
      const aX = w * 0.65 // Anod (+) -> 1 hajm O2
      const topY = h * 0.18
      const botY = h * 0.8

      // 2 ta shisha nay (Gofman apparati)
      ;[
        { x: kX, gazH: 90, nom: "Katod (-): 2 hajm H₂↑", rang: "#38bdf8", pSoni: 10 },
        { x: aX, gazH: 45, nom: "Anod (+): 1 hajm O₂↑", rang: "#ef4444", pSoni: 5 },
      ].forEach((nay) => {
        // Suv qismi
        ctx.fillStyle = "rgba(56,189,248,0.22)"
        ctx.fillRect(nay.x - 32, topY + nay.gazH, 64, botY - (topY + nay.gazH))

        // To'plangan gaz qismi
        ctx.fillStyle = "rgba(255,255,255,0.08)"
        ctx.fillRect(nay.x - 32, topY, 64, nay.gazH)

        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 3
        ctx.strokeRect(nay.x - 32, topY, 64, botY - topY)

        // Pufakchalar
        if (tokYoqiq) {
          for (let i = 0; i < nay.pSoni; i++) {
            const py = botY - 20 - ((t * 45 + i * 22) % (botY - topY - nay.gazH - 10))
            ctx.fillStyle = nay.rang
            ctx.beginPath()
            ctx.arc(nay.x + Math.sin(t + i) * 12, py, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.fillStyle = nay.rang
        ctx.font = "bold 16px 'Times New Roman', serif"
        ctx.textAlign = "center"
        ctx.fillText(nay.nom, nay.x, topY - 14)
      })

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 20px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText("2H₂O → 2H₂↑ (2 hajm) + O₂↑ (1 hajm)", w / 2, h * 0.92)

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, tokYoqiq])

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-KO'RGAZMA: MOLEKULYAR (H₂O, CO₂) vs NOMOLEKULYAR (NaCl, Fe) TUZILISH
  // ═══════════════════════════════════════════════════════════════════════════
  const panjaraCanvasRef = useRef(null)
  const [panjaraTur, setPanjaraTur] = useState("molekulyar")

  useEffect(() => {
    if (asosiyBolim !== "animatsiyalar" || animRejim !== "panjara") return
    const canvas = panjaraCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const chiz = () => {
      t += 0.04
      const w = (canvas.width = canvas.clientWidth)
      const h = (canvas.height = canvas.clientHeight)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#030714"
      ctx.fillRect(0, 0, w, h)

      const startX = w * 0.25
      const startY = h * 0.24
      const dx = (w * 0.5) / 3
      const dy = (h * 0.52) / 2

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const x = startX + c * dx + Math.sin(t + r + c) * 3
          const y = startY + r * dy + Math.cos(t + r * c) * 3

          if (panjaraTur === "molekulyar") {
            // Alohida CO2 molekulalari
            ctx.fillStyle = "#94a3b8"
            ctx.beginPath()
            ctx.arc(x, y, 10, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#ef4444"
            ctx.beginPath()
            ctx.arc(x - 16, y, 9, 0, Math.PI * 2)
            ctx.arc(x + 16, y, 9, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Yaxlit NaCl ion kristall panjarasi
            if (c < 3) {
              ctx.strokeStyle = "rgba(148,163,184,0.4)"
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(startX + (c + 1) * dx, y)
              ctx.stroke()
            }
            if (r < 2) {
              ctx.strokeStyle = "rgba(148,163,184,0.4)"
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x, startY + (r + 1) * dy)
              ctx.stroke()
            }
            const isNa = (r + c) % 2 === 0
            ctx.fillStyle = isNa ? "#a855f7" : "#22c55e"
            ctx.beginPath()
            ctx.arc(x, y, isNa ? 12 : 16, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 11px 'Times New Roman', serif"
            ctx.textAlign = "center"
            ctx.fillText(isNa ? "Na⁺" : "Cl⁻", x, y + 4)
          }
        }
      }

      ctx.fillStyle = "#facc15"
      ctx.font = "bold 18px 'Times New Roman', serif"
      ctx.textAlign = "center"
      ctx.fillText(
        panjaraTur === "molekulyar"
          ? "Molekulyar tuzilishli moddalar (H₂O, CO₂, I₂) — Tahlil tugunlarida alohida molekulalar, oson suyuqlanadi"
          : "Nomolekulyar tuzilishli moddalar (NaCl, SiO₂, Fe) — Yaxlit gigant kristall panjara, qiyin suyuqlanadi (801°C)",
        w / 2,
        h * 0.9
      )

      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [asosiyBolim, animRejim, panjaraTur])

  // ═══════════════════════════════════════════════════════════════════════════
  // O'YINLAR MA'LUMOTLARI (4 TA O'YIN)
  // ═══════════════════════════════════════════════════════════════════════════
  const hisobSavollari = [
    { savol: "3H₂O yozuvida jami nechta atom bor (vodorod va kislorod birgalikda)?", variantlar: ["9 ta atom (6 ta H va 3 ta O)", "3 ta atom", "6 ta atom", "5 ta atom"], togri: "9 ta atom (6 ta H va 3 ta O)" },
    { savol: "2H₂SO₄ yozuvida nechta kislorod (O) atomi bor?", variantlar: ["8 ta O atomi", "4 ta O atomi", "2 ta O atomi", "14 ta O atomi"], togri: "8 ta O atomi" },
    { savol: "4NH₃ (4 molekula ammiak) tarkibida jami nechta vodorod (H) atomi bor?", variantlar: ["12 ta H atomi", "7 ta H atomi", "3 ta H atomi", "16 ta H atomi"], togri: "12 ta H atomi" },
    { savol: "5O₂ va 5O yozuvlarining farqi nimada?", variantlar: ["5O₂ — 5 ta kislorod molekulasi, 5O — 5 ta erkin kislorod atomi", "Ikkalasi mutlaqo bir xil", "5O₂ da 5 ta atom bor", "5O da 10 ta atom bor"], togri: "5O₂ — 5 ta kislorod molekulasi, 5O — 5 ta erkin kislorod atomi" },
  ]
  const [hIdx, setHIdx] = useState(0)
  const [hTanlov, setHTanlov] = useState(null)
  const [hBall, setHBall] = useState(0)
  const [hTugadi, setHTugadi] = useState(false)

  const saralashSavollari = [
    { yozuv: "3Fe — 3 ta erkin temir atomi", tur: "atom" },
    { yozuv: "O₂ — 2 ta kislorod atomidan tuzilgan oddiy modda molekulasi", tur: "oddiy_mol" },
    { yozuv: "H₂O — Vodorod va kisloroddan tuzilgan murakkab modda molekulasi", tur: "murakkab_mol" },
    { yozuv: "P₄ — 4 ta fosfor atomidan tuzilgan oq fosfor molekulasi", tur: "oddiy_mol" },
    { yozuv: "CO₂ — 1 ta uglerod va 2 ta kisloroddan iborat molekula", tur: "murakkab_mol" },
    { yozuv: "5He — 5 ta bir atomli geliy zarrachasi", tur: "atom" },
  ]
  const [srIdx, setSrIdx] = useState(0)
  const [srBall, setSrBall] = useState(0)
  const [srTugadi, setSrTugadi] = useState(false)

  const formulaSavollari = [
    { topshiriq: "1 ta Uglerod (C) va 4 ta Vodorod (H) atomidan iborat metan formulasi:", variantlar: ["CH₄", "C₄H", "4CH", "C₂H₄"], togri: "CH₄" },
    { topshiriq: "2 ta Vodorod (H), 1 ta Oltingugurt (S) va 4 ta Kislorod (O) atomidan iborat sulfat kislota formulasi:", variantlar: ["H₂SO₄", "HSO₄", "2HSO₄", "H₄SO₂"], togri: "H₂SO₄" },
    { topshiriq: "3 ta Kislorod atomidan iborat 2 molekula ozon yozuvi:", variantlar: ["2O₃", "3O₂", "6O", "O₆"], togri: "2O₃" },
    { topshiriq: "Suv elektrolizida katodda 20 ml H₂ ajralgan bo'lsa, anodda necha ml O₂ ajraladi?", variantlar: ["10 ml O₂", "20 ml O₂", "40 ml O₂", "5 ml O₂"], togri: "10 ml O₂" },
  ]
  const [fIdx, setFIdx] = useState(0)
  const [fTanlov, setFTanlov] = useState(null)
  const [fBall, setFBall] = useState(0)
  const [fTugadi, setFTugadi] = useState(false)

  const duelSavollari = [
    { s: "Suv molekulasida (H₂O) bog' burchagi necha gradus?", v: ["104.5°", "180°", "90°"], j: "104.5°" },
    { s: "3CO₂ yozuvida jami nechta atom bor?", v: ["9 ta", "6 ta", "3 ta"], j: "9 ta" },
    { s: "Qaysi modda nomolekulyar (ion kristall) tuzilishga ega?", v: ["NaCl (Osh tuzi)", "CO₂", "H₂O"], j: "NaCl (Osh tuzi)" },
    { s: "Qaysi gaz ikki atomli molekula holida uchraydi?", v: ["N₂ (Azot)", "He (Geliy)", "Ar (Argon)"], j: "N₂ (Azot)" },
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
        mavzuRaqam="3.2"
        mavzuNom="Atom va molekula"
        bobNom="3-bob. Kimyoviy elementlar va birikmalar"
        sahifa={31}
        oldingiRaqam="3.1"
        asosiyBolim={asosiyBolim}
        setAsosiyBolim={setAsosiyBolim}
        toliqEkran={toliqEkran}
        toliqEkranniUlash={toliqEkranniUlash}
      />

      {asosiyBolim === "takrorlash" && (
        <OtganDarsniTakrorlash
          oldingiRaqam="3.1"
          oldingiNom="Kimyoviy elementlar"
          savollar={takrorlash3_1}
          onYangiDarsgaOtish={() => setAsosiyBolim("animatsiyalar")}
        />
      )}

      {asosiyBolim === "animatsiyalar" && (
        <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: "atom_yadro", nom: "1. Atom yadrosi", ikon: "atom" },
              { id: "molekula_3d", nom: "2. 3D Molekulalar", ikon: "kristall" },
              { id: "indeks", nom: "3. Koeffitsiyent va Indeks", ikon: "hisob" },
              { id: "atomlik", nom: "4. He vs O₂ vs S₈", ikon: "tolqin" },
              { id: "elektroliz", nom: "5. 2H₂O → 2H₂ + O₂", ikon: "chaqmoq" },
              { id: "panjara", nom: "6. Molekulyar vs NaCl", ikon: "kolba" },
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

          {animRejim === "atom_yadro" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={yadroCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => {
                      setProtonSoni(z)
                      tovushChiqar("bosqich")
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                      protonSoni === z
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#081236] text-blue-200"
                    }`}
                  >
                    Z={z} ({ATOM_NOMLARI[z].split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "molekula_3d" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={molCanvasRef} className="w-full h-full block" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {MOLEKULALAR_3D.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setTanlanganMol(m)
                      tovushChiqar("bosqich")
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                      tanlanganMol.id === m.id
                        ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    <div className="text-sm">{m.formula}</div>
                    <div className="text-[11px] opacity-80">{m.nom}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "indeks" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={indeksCanvasRef} className="w-full h-full block" />
              </div>
              <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-300">Koeffitsiyent (old soni):</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setKoeff(n)}
                      className={`w-9 h-9 rounded-xl border font-bold text-sm ${
                        koeff === n
                          ? "border-yellow-400 bg-yellow-500 text-slate-950"
                          : "border-blue-800 bg-[#091538] text-white"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {Object.keys(IND_MODDALAR).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setIndModda(k)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                        indModda === k
                          ? "border-emerald-400 bg-emerald-500/25 text-emerald-200"
                          : "border-blue-900 bg-[#091538] text-blue-200"
                      }`}
                    >
                      {IND_MODDALAR[k].formula}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {animRejim === "atomlik" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={atomlikCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: "bir", nom: "1. Bir atomli (He, Ne, Ar)" },
                  { id: "ikki", nom: "2. Ikki atomli (H₂, O₂, N₂, Cl₂)" },
                  { id: "kop", nom: "3. Ko'p atomli (O₃, P₄, S₈)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAtomlikTur(t.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                      atomlikTur === t.id
                        ? "border-yellow-400 bg-yellow-500/25 text-yellow-200"
                        : "border-blue-900 bg-[#060b22] text-blue-200"
                    }`}
                  >
                    {t.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {animRejim === "elektroliz" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={elektrolizCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setTokYoqiq((v) => !v)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm"
                >
                  {tokYoqiq ? "Elektr tokini uzish" : "Elektr tokini ulash (2H₂O → 2H₂↑ + O₂↑)"}
                </button>
              </div>
            </div>
          )}

          {animRejim === "panjara" && (
            <div className="space-y-3">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030714]">
                <canvas ref={panjaraCanvasRef} className="w-full h-full block" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPanjaraTur("molekulyar")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    panjaraTur === "molekulyar"
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Molekulyar tuzilish (CO₂, H₂O, I₂)
                </button>
                <button
                  type="button"
                  onClick={() => setPanjaraTur("nomolekulyar")}
                  className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${
                    panjaraTur === "nomolekulyar"
                      ? "border-emerald-400 bg-emerald-500/25 text-emerald-200"
                      : "border-blue-900 bg-[#060b22] text-blue-200"
                  }`}
                >
                  Nomolekulyar tuzilish (NaCl kristall panjarasi)
                </button>
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
              { id: "hisob", nom: "1. Atomlar Hisobi", ikon: "hisob" },
              { id: "saralash", nom: "2. Atom vs Molekula", ikon: "atom" },
              { id: "formula", nom: "3. Formula Yig'ish", ikon: "kristall" },
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

          {oyinRejim === "hisob" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!hTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {hIdx + 1} / {hisobSavollari.length}</span>
                    <span className="text-emerald-300">Ball: {hBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{hisobSavollari[hIdx].savol}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hisobSavollari[hIdx].variantlar.map((v) => {
                      const togri = v === hisobSavollari[hIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (hTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (hTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (hTanlov !== null) return
                            setHTanlov(v)
                            if (togri) {
                              setHBall((b) => b + 1)
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
                  {hTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (hIdx < hisobSavollari.length - 1) {
                            setHIdx((i) => i + 1)
                            setHTanlov(null)
                          } else {
                            setHTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {hBall} / {hisobSavollari.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setHIdx(0)
                      setHTanlov(null)
                      setHBall(0)
                      setHTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "saralash" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!srTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Namuna {srIdx + 1} / {saralashSavollari.length}</span>
                    <span className="text-emerald-300">Ball: {srBall}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center py-2">
                    {saralashSavollari[srIdx].yozuv}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "atom", nom: "ERKIN ATOM" },
                      { id: "oddiy_mol", nom: "ODDIY MODDA MOLEKULASI" },
                      { id: "murakkab_mol", nom: "MURAKKAB MODDA MOLEKULASI" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (t.id === saralashSavollari[srIdx].tur) {
                            setSrBall((b) => b + 1)
                            tovushChiqar("togri")
                          } else {
                            tovushChiqar("xato")
                          }
                          if (srIdx < saralashSavollari.length - 1) setSrIdx((i) => i + 1)
                          else setSrTugadi(true)
                        }}
                        className="p-5 rounded-2xl border border-cyan-500/40 bg-[#091538] hover:border-cyan-400 text-cyan-200 font-bold text-sm"
                      >
                        {t.nom}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-2xl font-bold text-emerald-300">Natija: {srBall} / {saralashSavollari.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSrIdx(0)
                      setSrBall(0)
                      setSrTugadi(false)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                  >
                    Qayta o&apos;ynash
                  </button>
                </div>
              )}
            </div>
          )}

          {oyinRejim === "formula" && (
            <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#050b24] space-y-4">
              {!fTugadi ? (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-yellow-400">Savol {fIdx + 1} / {formulaSavollari.length}</span>
                    <span className="text-emerald-300">Ball: {fBall}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{formulaSavollari[fIdx].topshiriq}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formulaSavollari[fIdx].variantlar.map((v) => {
                      const togri = v === formulaSavollari[fIdx].togri
                      let kl = "border-blue-900 bg-[#091538] text-white"
                      if (fTanlov !== null) {
                        if (togri) kl = "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                        else if (fTanlov === v) kl = "border-red-500 bg-red-500/25 text-red-200"
                      }
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (fTanlov !== null) return
                            setFTanlov(v)
                            if (togri) {
                              setFBall((b) => b + 1)
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
                  {fTanlov !== null && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (fIdx < formulaSavollari.length - 1) {
                            setFIdx((i) => i + 1)
                            setFTanlov(null)
                          } else {
                            setFTugadi(true)
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
                  <div className="text-2xl font-bold text-emerald-300">Natija: {fBall} / {formulaSavollari.length}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setFIdx(0)
                      setFTanlov(null)
                      setFBall(0)
                      setFTugadi(false)
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
