"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  C: 0x909090, H: 0xFFFFFF, N: 0x3050F8, O: 0xFF0D0D,
  Co: 0xF090A0, Cr: 0x8A99C7,
  bond: 0x8B9DC3, highlight: 0xFFD700,
  torsion: 0xFFAA33, dihedral: 0x66FFAA
}

// ═══════════════════════════════════════════════════════════════════════════
// FIZIK KONSTANTALAR
// ═══════════════════════════════════════════════════════════════════════════
const R_GAS = 8.314 // J/(mol·K)
const T_ROOM = 298.15 // K

// ═══════════════════════════════════════════════════════════════════════════
// KONFORMATSION TIZIMLAR
// ═══════════════════════════════════════════════════════════════════════════
const CONFORMERS = {

  // ── 1. ETAN — Klassik konformatsion namuna ──
  ethane: {
    id: "ethane",
    title: "Etan (CH₃–CH₃) — klassik konformatsion misol",
    formula: "C₂H₆",
    description: "Etan molekulasidagi C–C yakka bog'lanish atrofida aylanish natijasida ikki xarakterli konformatsiya hosil bo'ladi: to'silgan (eclipsed) va zinapoya (staggered). Energiya farqi ≈ 12.6 kJ/mol.",
    dihedralRange: [0, 360],
    keyDihedrals: [
      { angle: 0, name: "To'silgan (eclipsed)", nameEn: "Eclipsed", energy: 12.6, color: "#ff4444", stability: "Eng past barqaror" },
      { angle: 60, name: "Zinapoya (staggered)", nameEn: "Staggered", energy: 0, color: "#44ff44", stability: "Eng barqaror" },
      { angle: 120, name: "To'silgan", nameEn: "Eclipsed", energy: 12.6, color: "#ff4444", stability: "Eng past barqaror" },
      { angle: 180, name: "Zinapoya", nameEn: "Staggered", energy: 0, color: "#44ff44", stability: "Eng barqaror" },
      { angle: 240, name: "To'silgan", nameEn: "Eclipsed", energy: 12.6, color: "#ff4444", stability: "Eng past barqaror" },
      { angle: 300, name: "Zinapoya", nameEn: "Staggered", energy: 0, color: "#44ff44", stability: "Eng barqaror" }
    ],
    barrierEnergy: 12.6, // kJ/mol
    energyFunction: (dihedral) => {
      // V(φ) = (V₀/2)(1 + cos(3φ))  — 3-tartibli funksiya
      const V0 = 12.6
      return (V0 / 2) * (1 + Math.cos(3 * dihedral * Math.PI / 180))
    },
    discovery: "1936-yilda Kemp va Pitzer eksperimental (termodinamik) usullarda etandagi aylanish to'sig'ining 12.6 kJ/mol ekanligini aniqladilar. Bu kashfiyot 1930-yillardagi 'to'siqsiz aylanish' gipotezasini rad etdi.",
    theory: "To'siq asosan orbital giperkonjugatsiya (C–H bog'lanuvchi orbital → C–H σ* antibog'lanuvchi orbital) va van der Waals itarilishi tufayli hosil bo'ladi (Pophristic va Goodman, 2001).",
    applications: "Molekulyar dinamika simulyatsiyalarida asos, kompyuter kimyosi (force field) uchun mos, DNK tuzilishida aylanish burchaklari (φ, ψ) tushunish uchun asos."
  },

  // ── 2. BUTAN — 3 xil konformatsiya ──
  butane: {
    id: "butane",
    title: "Butan (CH₃–CH₂–CH₂–CH₃) — 3 xarakterli konformer",
    formula: "C₄H₁₀",
    description: "Butanda C2–C3 markaziy bog' atrofida aylanish tahlil qilinadi. Bunda 3 xil barqaror konformatsiya (anti va 2 ta gauche) va 3 xil to'siq holatlari hosil bo'ladi.",
    dihedralRange: [0, 360],
    keyDihedrals: [
      { angle: 0, name: "To'silgan syn (0°)", nameEn: "Syn-periplanar (cis)", energy: 19.0, color: "#ff2222", stability: "Eng past barqaror" },
      { angle: 60, name: "Gauche (+)", nameEn: "Gauche (+)", energy: 3.8, color: "#ffaa44", stability: "Yarim barqaror" },
      { angle: 120, name: "To'silgan (methyl-H)", nameEn: "Eclipsed", energy: 16.0, color: "#ff6644", stability: "Barqarorsiz" },
      { angle: 180, name: "Anti (trans)", nameEn: "Anti (trans-periplanar)", energy: 0, color: "#44ff44", stability: "Eng barqaror" },
      { angle: 240, name: "To'silgan (methyl-H)", nameEn: "Eclipsed", energy: 16.0, color: "#ff6644", stability: "Barqarorsiz" },
      { angle: 300, name: "Gauche (−)", nameEn: "Gauche (−)", energy: 3.8, color: "#ffaa44", stability: "Yarim barqaror" }
    ],
    barrierEnergy: 19.0,
    energyFunction: (dihedral) => {
      // Butan uchun murakkab funksiya: anti eng past, gauche o'rta, syn eng yuqori
      const phi = dihedral * Math.PI / 180
      // V(φ) = V₁(1-cos φ)/2 + V₂(1-cos 2φ)/2 + V₃(1-cos 3φ)/2
      const V1 = 5.5, V2 = 0.5, V3 = 8.0
      return V1 * (1 - Math.cos(phi)) / 2 + V2 * (1 - Math.cos(2 * phi)) / 2 + V3 * (1 - Math.cos(3 * phi)) / 2
    },
    discovery: "1960-1970-yillarda IR va Raman spektroskopiya, keyin mikrotal'qin spektroskopiya orqali butanning konformatsion muvozanati o'rganilgan. Room temperature (25°C) da: 72% anti + 28% gauche (ikkalasi jamlab).",
    theory: "Anti-konformatsiya eng barqaror — chunki ikki metil guruh maksimal masofada (180°). Gauche da 60° masofada sterik xalallik bor (~3.8 kJ/mol). To'silgan holatlarda esa H–H (12 kJ/mol) va CH₃–CH₃ (19 kJ/mol) buruq to'siqlari hosil bo'ladi.",
    applications: "Butanning konformatsion tahlili — barcha uzun uglerod zanjirli molekulalar (lipidlar, polimerlar) uchun asos. Yog'-fatty acidlar Bnda ham anti-konformatsiya afzal."
  },

  // ── 3. SIKLOHEKSAN — Kreslo/vanna/burilgan ──
  cyclohexane: {
    id: "cyclohexane",
    title: "Sikloheksan (C₆H₁₂) — halqa konformatsiyalari",
    formula: "C₆H₁₂",
    description: "Sikloheksanning kreslo (chair), vanna (boat) va burilgan-vanna (twist-boat) konformatsiyalari. Kreslo eng barqaror — Baeyer va Pitzer tarangligi nolga teng.",
    dihedralRange: [0, 1], // 0 = kreslo, 1 = vanna (nazariy)
    keyDihedrals: [
      { angle: 0, name: "Kreslo (chair)", nameEn: "Chair", energy: 0, color: "#44ff44", stability: "Eng barqaror" },
      { angle: 0.3, name: "Yarim-kreslo", nameEn: "Half-chair", energy: 45.0, color: "#ff4444", stability: "O'tish holati" },
      { angle: 0.5, name: "Burilgan-vanna", nameEn: "Twist-boat", energy: 21.0, color: "#ffaa44", stability: "Yarim barqaror" },
      { angle: 0.7, name: "Vanna (boat)", nameEn: "Boat", energy: 29.0, color: "#ff6644", stability: "Past barqaror" },
      { angle: 1.0, name: "Kreslo (flip)", nameEn: "Chair (flipped)", energy: 0, color: "#44ff44", stability: "Eng barqaror" }
    ],
    barrierEnergy: 45.0,
    energyFunction: (t) => {
      // Sikloheksan flip yo'lakati: chair → halfchair → twist → boat → twist → halfchair → chair
      // Empirik model: sinusoidal to'siq bilan
      if (t <= 0.3) {
        return (45.0 / 0.3) * t * (1 - t/0.6)
      } else if (t <= 0.5) {
        return 45.0 - (45.0 - 21.0) * (t - 0.3) / 0.2
      } else if (t <= 0.7) {
        return 21.0 + (29.0 - 21.0) * (t - 0.5) / 0.2
      } else if (t <= 0.85) {
        return 29.0 - (29.0 - 21.0) * (t - 0.7) / 0.15
      } else {
        return 21.0 * (1 - (t - 0.85) / 0.15)
      }
    },
    discovery: "1890-yilda Hermann Sachse Bonn universitetida sikloheksanning kreslo va vanna konformatsiyalarini birinchi taklif qildi. Uning nazariyasi 1918-yilgacha Ernst Mohr tomonidan qayta tiklangunga qadar unutilib ketildi. 1943-yilda Odd Hassel Norvegiyada elektron difraksiya orqali kreslo formasini tasdiqladi (1969 Nobel).",
    theory: "Kreslo formada har bir C–C–C burchagi 109.5° (tetraedrik, ideal), buruq burchak 60° (barcha C–H zinapoyada). Vanna formada 4 ta H–H to'silgan (eclipsed), 2 ta 'flagpole' H–H yaqin masofada. Twist-boat kreslo va vanna orasidagi yumshoq o'tish.",
    applications: "Steroidlar tuzilishi (xolesterin, testosteron), qandlar (glyukoza uchun kreslo forma), farmasevtik molekulalar. Ekvatorial vs eksial pozitsiyalar tushuncha.",
    axialEquatorial: {
      chair: {
        axial: 6, equatorial: 6,
        note: "Har bir C atomida 1 ekvatorial + 1 eksial H. Ekvatorial pozitsiya sterik jihatdan afzal."
      }
    }
  },

  // ── 4. EN XELAT HALQA — λ va δ konformatsiyalar ──
  enChelate: {
    id: "enChelate",
    title: "Etilendiamin (en) xelat halqa — λ/δ konformatsiya",
    formula: "M(en) — 5 a'zoli halqa",
    description: "Metall-etilendiamin xelat halqasi 5 a'zoli konvert (envelope) formada, ikki xil konformatsiyaga ega: λ (lambda) va δ (delta). Bu — koordinatsion kimyodagi konformatsion izomeriya.",
    dihedralRange: [-60, 60],
    keyDihedrals: [
      { angle: -50, name: "δ (delta) konformatsiya", nameEn: "delta (δ)", energy: 0, color: "#4488ff", stability: "Barqaror" },
      { angle: 0, name: "Yassi (envelope)", nameEn: "Envelope (flat)", energy: 5.0, color: "#ff8844", stability: "O'tish" },
      { angle: 50, name: "λ (lambda) konformatsiya", nameEn: "lambda (λ)", energy: 0, color: "#ff4488", stability: "Barqaror" }
    ],
    barrierEnergy: 5.0,
    energyFunction: (dihedral) => {
      // Ikki minimum: -50° va +50°, o'rtada past to'siq
      const phi = dihedral * Math.PI / 180
      return 5.0 * Math.cos(dihedral * Math.PI / 50) + 5.0
    },
    discovery: "1959-yilda E.J. Corey va J.C. Bailar Jr. koordinatsion komplekslarda xelat halqa konformatsiyasining muhimligini birinchi bor sistematik ravishda ta'kidladilar. λ/δ deskriptorlari IUPAC (1968) tomonidan rasmiy qabul qilindi.",
    theory: "λ va δ — CH₂–CH₂ zanjirining C atomlarining koordinatsion plane'ga nisbatan qanday og'ganini bildiradi. Ikkala konformatsiyaning energiyasi bir xil, ammo turli konformerlar sterik jihatdan farq qiladi (masalan, [Co(en)₃]³⁺ da 'lel' va 'ob' kombinatsiyalari).",
    applications: "Optik faol komplekslar sintezi, kiral katalizatorlar, CD-spektroskopiya, koordinatsion polimerlar."
  },

  // ── 5. [Co(en)₃]³⁺ TO'LIQ — lel/ob kombinatsiyalar ──
  CoenComplex: {
    id: "CoenComplex",
    title: "[Co(en)₃]³⁺ — barcha konformatsiyalar",
    formula: "[Co(en)₃]³⁺",
    description: "Tris(etilendiamin)kobalt(III) — 3 ta en xelat halqasi. Har bir halqa λ yoki δ bo'lishi mumkin. Bu Δ/Λ konfiguratsiya bilan qo'shilib 8 xil izomer beradi, lekin sterik cheklovlar tufayli faqat 4 tasi barqaror: Δ-lel₃, Δ-ob₃, Λ-lel₃, Λ-ob₃.",
    dihedralRange: [0, 3], // 0 = ob₃, 3 = lel₃ (halqalar soni)
    keyDihedrals: [
      { angle: 0, name: "ob₃ (obliq)", nameEn: "ob₃", energy: 4.5, color: "#ff8844", stability: "Yuqori energiya" },
      { angle: 1, name: "ob₂lel₁", nameEn: "ob₂lel₁", energy: 3.0, color: "#ffbb44", stability: "O'rta" },
      { angle: 2, name: "ob₁lel₂", nameEn: "ob₁lel₂", energy: 1.5, color: "#bbff44", stability: "Yaxshi" },
      { angle: 3, name: "lel₃ (parallel)", nameEn: "lel₃", energy: 0, color: "#44ff88", stability: "Eng barqaror" }
    ],
    barrierEnergy: 4.5,
    energyFunction: (n) => {
      // lel halqalar soniga qarab energiya kamayadi
      return 4.5 - 1.5 * n
    },
    discovery: "1959 — Corey va Bailar birinchi bo'lib [Co(en)₃]³⁺ da lel/ob konformatsiyalarni bashorat qildilar. 1972-yilda Kuroda va Ito rentgen difraksiya orqali kristallda lel₃ formasining afzalligini tasdiqladilar (Δ-[Co(en)₃]Cl₃·H₂O·3.5H₂O).",
    theory: "'lel' — xelat halqa C–C aksi Co ning C₃ o'qiga PARALLEL (parallel). 'ob' — OBLIQ (qiya). lel konformatsiyasida sterik xalallik minimal. Har bir 'lel' → 'ob' o'tishi ≈ +1.5 kJ/mol energiya sarflaydi.",
    applications: "Kiral katalizatorlar dizayni, asimmetrik sintez, CD-spektroskopiya, DNA-bog'lovchi metall komplekslar (masalan, [Ru(bpy)₃]²⁺ ning DNK bilan o'zaro ta'siri).",
    lelObTable: {
      "Δ-lel₃": { conformers: ["λλλ"], population: 42, dh: 0 },
      "Δ-lel₂ob": { conformers: ["λλδ"], population: 34, dh: 1.5 },
      "Δ-lelob₂": { conformers: ["λδδ"], population: 18, dh: 3.0 },
      "Δ-ob₃": { conformers: ["δδδ"], population: 6, dh: 4.5 }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "Zanjir asosi", hybridization: "sp³", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Terminal atom", color: "#FFFFFF" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "en donor", hybridization: "sp³", color: "#3050F8" },
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶ LS)", color: "#F090A0" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

// Boltzmann taqsimoti hisoblash
const boltzmannPopulation = (energies, temperature = T_ROOM) => {
  const RT = R_GAS * temperature / 1000 // kJ/mol
  const weights = energies.map(e => Math.exp(-e / RT))
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map(w => (w / sum) * 100) // %
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 14, scale = 0.5
  } = options
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function KonformatsionIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const moleculeGroupRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const rotatingGroupRef = useRef(null)  // Aylanadigan qism (masalan, o'ng CH₃)
  const highlightsRef = useRef([])
  const dihedralArcRef = useRef(null)

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("ethane")
  const [dihedralAngle, setDihedralAngle] = useState(60)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(false) // Konformatsion uchun statik yaxshi
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(true)
  const [showDihedralArc, setShowDihedralArc] = useState(true)
  const [showAxis, setShowAxis] = useState(false)  // C-C aylanish o'qi
  const [showNewman, setShowNewman] = useState(true)  // Newman proyeksiyasi
  const [showEnergyGraph, setShowEnergyGraph] = useState(true)  // Energiya grafigi
  const [animateRotation, setAnimateRotation] = useState(false)
  const [temperature, setTemperature] = useState(298)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, theory: true, structures: true, energy: true,
    boltzmann: true, newman: true, applications: true, table: true, references: true
  })

  const animRef = useRef({ angle: 0, direction: 1, speed: 0.5 })

  // Ko'chiriladigan panel
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setIsPanelDragging(true)
  }, [])
  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = clientX - cRect.left - dragOffsetRef.current.x
    let ny = clientY - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
    setPanelPos({ x: nx, y: ny })
  }, [])
  const handlePanelDragEnd = useCallback(() => setIsPanelDragging(false), [])

  useEffect(() => {
    if (!isPanelDragging) return
    const onMouseMove = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanelDragEnd()
    const onTouchMove = (e) => { if (e.touches.length > 0) { e.preventDefault(); handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY) } }
    const onTouchEnd = () => handlePanelDragEnd()
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)
    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  const togglePanel = (name) => setActivePanel(activePanel === name ? null : name)

  const system = CONFORMERS[currentSystem]

  // Sistemani o'zgartirganda burchakni default'ga qaytarish
  useEffect(() => {
    if (currentSystem === "ethane") setDihedralAngle(60)
    else if (currentSystem === "butane") setDihedralAngle(180)
    else if (currentSystem === "cyclohexane") setDihedralAngle(0)
    else if (currentSystem === "enChelate") setDihedralAngle(50)
    else if (currentSystem === "CoenComplex") setDihedralAngle(3)
  }, [currentSystem])

  // Hozirgi energiya
  const currentEnergy = useMemo(() => {
    return system.energyFunction(dihedralAngle)
  }, [system, dihedralAngle])

  // Eng yaqin nomlangan konformer
  const nearestConformer = useMemo(() => {
    let closest = system.keyDihedrals[0]
    let minDist = Math.abs(dihedralAngle - closest.angle)
    system.keyDihedrals.forEach(c => {
      const d = Math.abs(dihedralAngle - c.angle)
      if (d < minDist) { minDist = d; closest = c }
    })
    return closest
  }, [system, dihedralAngle])

  // ═══════════════════════════════════════════════════════════
  // BOG'LANISH YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.06, opacity = 0.85) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.3, transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    bond.userData = { type: 'bond' }
    parent.add(bond)
    bondsRef.current.push(bond)
    return bond
  }, [])

  const createAtom = useCallback((parent, pos, element, radius = 0.25, extraInfo = {}) => {
    const color = CPK[element] || 0x888888
    const geo = new THREE.SphereGeometry(radius, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.3, metalness: 0.2,
      emissive: color, emissiveIntensity: 0.15
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = {
      type: 'atom', element,
      info: ATOM_INFO[element] || { name: element, color: `#${color.toString(16)}` },
      ...extraInfo
    }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    return mesh
  }, [])

  // ═══════════════════════════════════════════════════════════
  // ETAN — CH₃-CH₃ (aylanadigan)
  // ═══════════════════════════════════════════════════════════
  const buildEthane = useCallback((group, dihedralDeg) => {
    // Chap C — statik
    const cLeft = new THREE.Vector3(-0.77, 0, 0)
    const cRight = new THREE.Vector3(0.77, 0, 0)

    // Chap CH₃
    const cLMesh = createAtom(group, cLeft, 'C', 0.28, { role: 'Statik uglerod (C1)' })

    // Chap 3 H — 109.5° tetraedrik
    const hLLen = 1.09
    const hLAngle = (109.5 - 90) * Math.PI / 180  // C–C dan tashqariga qanchalik og'gan
    const hLBackward = -Math.sin(hLAngle) * hLLen  // x yo'nalishida orqa
    const hLRadial = Math.cos(hLAngle) * hLLen     // radial
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180
      const hPos = new THREE.Vector3(
        cLeft.x + hLBackward,
        cLeft.y + hLRadial * Math.cos(angle),
        cLeft.z + hLRadial * Math.sin(angle)
      )
      createAtom(group, hPos, 'H', 0.14, { role: 'C1 vodorodi', atomIdx: `H${i+1}(C1)` })
      createBond(group, cLeft, hPos, 0x666677, 0.04, 0.6)
    }

    // O'ng C — aylanadigan (rotatingGroup ichida)
    const rotGroup = new THREE.Group()
    rotatingGroupRef.current = rotGroup
    const cRMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.3, metalness: 0.2, emissive: CPK.C, emissiveIntensity: 0.15 })
    )
    cRMesh.position.copy(cRight)
    cRMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, role: 'Aylanadigan uglerod (C2)' }
    rotGroup.add(cRMesh)
    atomsRef.current.push(cRMesh)

    // C-C bog'lanish
    createBond(group, cLeft, cRight, CPK.bond, 0.07, 0.9)

    // O'ng 3 H
    const hRLen = 1.09
    const hRBackward = Math.sin(hLAngle) * hRLen   // C1 dan uzoqroq
    const hRRadial = Math.cos(hLAngle) * hRLen
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180
      const hPos = new THREE.Vector3(
        cRight.x + hRBackward,
        cRight.y + hRRadial * Math.cos(angle),
        cRight.z + hRRadial * Math.sin(angle)
      )
      const hMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
      )
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, role: 'C2 vodorodi', atomIdx: `H${i+1}(C2)` }
      rotGroup.add(hMesh)
      atomsRef.current.push(hMesh)
      // C-H bog'
      const bondDir = new THREE.Vector3().subVectors(hPos, cRight)
      const bondLen = bondDir.length()
      const bondMid = new THREE.Vector3().addVectors(cRight, hPos).multiplyScalar(0.5)
      const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, bondLen, 12)
      const bondMat = new THREE.MeshStandardMaterial({ color: 0x666677, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0.6 })
      const bondMesh = new THREE.Mesh(bondGeo, bondMat)
      bondMesh.position.copy(bondMid)
      bondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bondDir.clone().normalize())
      rotGroup.add(bondMesh)
      bondsRef.current.push(bondMesh)
    }
    // rotGroup ni x-o'q atrofida burish
    rotGroup.rotation.x = dihedralDeg * Math.PI / 180
    group.add(rotGroup)

    // Labels
    if (showLabels) {
      const l1 = makeTextSprite("C1 (statik)", {
        fontSize: 32, color: "#66ccff", bgColor: "rgba(10, 40, 60, 0.85)",
        borderColor: "#66ccff", scale: 0.32
      })
      l1.position.set(cLeft.x, cLeft.y + 1.8, cLeft.z)
      group.add(l1); labelsRef.current.push(l1)

      const l2 = makeTextSprite("C2 (aylanadigan)", {
        fontSize: 32, color: "#ff88dd", bgColor: "rgba(60, 20, 40, 0.85)",
        borderColor: "#ff88dd", scale: 0.32
      })
      l2.position.set(cRight.x, cRight.y + 1.8, cRight.z)
      group.add(l2); labelsRef.current.push(l2)
    }
  }, [createAtom, createBond, showLabels])

  // ═══════════════════════════════════════════════════════════
  // BUTAN — CH₃-CH₂-CH₂-CH₃
  // ═══════════════════════════════════════════════════════════
  const buildButane = useCallback((group, dihedralDeg) => {
    // C1-C2-C3-C4 zanjir
    // C2 va C3 markazda, C1 chap CH₃, C4 o'ng CH₃
    const cc = 1.54  // C-C bog'lanish
    const c2 = new THREE.Vector3(-cc/2, 0, 0)
    const c3 = new THREE.Vector3(cc/2, 0, 0)
    // C1 — C2 dan 109.5° burchakda, tetraedrik joylashadi
    // Standart C-C-C burchagi 113° (butanda kichik cheklov)
    const ccAngle = 113 * Math.PI / 180
    const c1 = new THREE.Vector3(c2.x - cc * Math.cos((180 - 113) * Math.PI / 180), 0, cc * Math.sin((180 - 113) * Math.PI / 180))
    // C4 — C3 dan (dihedralga bog'liq)
    // Dihedral angle butan uchun C1-C2-C3-C4
    // Bu asosiy aylanish o'qi.
    const c4Angle = (180 - 113) * Math.PI / 180
    const c4LocalRadius = cc * Math.sin(c4Angle)
    const c4LocalAxial = -cc * Math.cos(c4Angle)  // C3 dan c2 tomonga qarshi
    // C4 pozitsiyasi — dihedralga qarab
    const phi = dihedralDeg * Math.PI / 180
    const c4 = new THREE.Vector3(
      c3.x + Math.abs(c4LocalAxial),  // C3 dan uzoqroq
      c4LocalRadius * Math.sin(phi),
      c4LocalRadius * Math.cos(phi)
    )

    // C1-C4 atomlar
    createAtom(group, c1, 'C', 0.24, { role: 'C1 (metil)' })
    createAtom(group, c2, 'C', 0.24, { role: 'C2 (metilen)' })
    createAtom(group, c3, 'C', 0.24, { role: 'C3 (metilen)' })
    // C4 — aylanadigan
    const rotGroup = new THREE.Group()
    rotatingGroupRef.current = rotGroup
    // rotGroup ni C3 atrofida burish uchun offsetni C3'ga o'rnatamiz
    const c4Mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.3, metalness: 0.2, emissive: CPK.C, emissiveIntensity: 0.15 })
    )
    c4Mesh.position.copy(c4)
    c4Mesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, role: 'C4 (aylanadigan metil)' }
    rotGroup.add(c4Mesh)
    atomsRef.current.push(c4Mesh)

    // Bog'lanishlar
    createBond(group, c1, c2, CPK.bond, 0.06, 0.85)
    createBond(group, c2, c3, CPK.bond, 0.08, 0.9)  // Aylanish o'qi — qalinroq
    createBond(group, c3, c4, CPK.bond, 0.06, 0.85)

    // H atomlari (soddalashtirilgan — har C ga 2-3 H)
    if (showHydrogens) {
      // C1 uchun 3 H (metil)
      const hRadius = 1.09
      for (let i = 0; i < 3; i++) {
        const angle = (i * 120 + 30) * Math.PI / 180
        const hDir = new THREE.Vector3(
          -Math.cos(ccAngle) * 0.5,
          Math.sin(ccAngle) * Math.cos(angle),
          Math.sin(ccAngle) * Math.sin(angle)
        ).normalize().multiplyScalar(hRadius * 0.7)
        const hPos = c1.clone().add(hDir)
        createAtom(group, hPos, 'H', 0.11, { role: 'C1 H' })
        createBond(group, c1, hPos, 0x666677, 0.03, 0.5)
      }
      // C2 uchun 2 H (metilen — perpendikulyar z-oyoq bo'lganda)
      const c2Perp = new THREE.Vector3(0, 1, 0)  // Perpendikulyar
      const c2Perp2 = new THREE.Vector3(0, -0.5, Math.sqrt(3)/2)
      const c2Perp3 = new THREE.Vector3(0, -0.5, -Math.sqrt(3)/2)
      ;[c2Perp2, c2Perp3].forEach(dir => {
        const hPos = c2.clone().add(dir.normalize().multiplyScalar(hRadius * 0.6))
        createAtom(group, hPos, 'H', 0.11, { role: 'C2 H (metilen)' })
        createBond(group, c2, hPos, 0x666677, 0.03, 0.5)
      })
      // C3 uchun 2 H
      ;[c2Perp2, c2Perp3].forEach(dir => {
        const hPos = c3.clone().add(dir.normalize().multiplyScalar(hRadius * 0.6))
        createAtom(group, hPos, 'H', 0.11, { role: 'C3 H (metilen)' })
        createBond(group, c3, hPos, 0x666677, 0.03, 0.5)
      })
      // C4 uchun 3 H (metil) — aylanadigan
      for (let i = 0; i < 3; i++) {
        const angle = (i * 120 + 30) * Math.PI / 180
        // C4 uchun lokal koordinatalar
        const hDir = new THREE.Vector3(
          Math.abs(Math.cos(ccAngle)) * 0.5,
          Math.sin(ccAngle) * Math.cos(angle),
          Math.sin(ccAngle) * Math.sin(angle)
        ).normalize().multiplyScalar(hRadius * 0.7)
        const hPos = c4.clone().add(hDir)
        const hMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 20, 20),
          new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        )
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, role: 'C4 H' }
        rotGroup.add(hMesh)
        atomsRef.current.push(hMesh)
        // Bog'
        const bondDir = new THREE.Vector3().subVectors(hPos, c4)
        const bondLen = bondDir.length()
        const bondMid = new THREE.Vector3().addVectors(c4, hPos).multiplyScalar(0.5)
        const bondGeo = new THREE.CylinderGeometry(0.03, 0.03, bondLen, 12)
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x666677, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0.5 })
        const bondMesh = new THREE.Mesh(bondGeo, bondMat)
        bondMesh.position.copy(bondMid)
        bondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bondDir.clone().normalize())
        rotGroup.add(bondMesh)
        bondsRef.current.push(bondMesh)
      }
    }

    group.add(rotGroup)

    if (showLabels) {
      const l1 = makeTextSprite("CH₃(C1)", { fontSize: 28, color: "#66ccff", bgColor: "rgba(10, 40, 60, 0.85)", borderColor: "#66ccff", scale: 0.3 })
      l1.position.set(c1.x, c1.y - 1.5, c1.z)
      group.add(l1); labelsRef.current.push(l1)

      const l2 = makeTextSprite("C2 (aylanish o'qi)", { fontSize: 26, color: "#ffff88", bgColor: "rgba(50, 40, 10, 0.85)", borderColor: "#ffdd66", scale: 0.28 })
      l2.position.set(c2.x, c2.y - 1.5, c2.z)
      group.add(l2); labelsRef.current.push(l2)

      const l3 = makeTextSprite("C3 (aylanish o'qi)", { fontSize: 26, color: "#ffff88", bgColor: "rgba(50, 40, 10, 0.85)", borderColor: "#ffdd66", scale: 0.28 })
      l3.position.set(c3.x, c3.y - 1.5, c3.z)
      group.add(l3); labelsRef.current.push(l3)

      const l4 = makeTextSprite("CH₃(C4)", { fontSize: 28, color: "#ff88dd", bgColor: "rgba(60, 20, 40, 0.85)", borderColor: "#ff88dd", scale: 0.3 })
      l4.position.set(c4.x, c4.y - 1.5, c4.z)
      group.add(l4); labelsRef.current.push(l4)
    }
  }, [createAtom, createBond, showLabels, showHydrogens])

  // ═══════════════════════════════════════════════════════════
  // SIKLOHEKSAN — kreslo/vanna
  // ═══════════════════════════════════════════════════════════
  const buildCyclohexane = useCallback((group, tValue) => {
    // t = 0 (kreslo), t = 1 (boat), oralig'ida twist
    // Simple morph: chair → twist-boat → boat
    const cc = 1.54
    // Ideal chair conformation coordinates
    const ringR = 1.25  // ring radius
    const zOffset = 0.5 // chair puckering
    // 6 ta C atomi
    const C_positions = []
    for (let i = 0; i < 6; i++) {
      const theta = (i * 60) * Math.PI / 180
      const z = (i % 2 === 0 ? +1 : -1) * zOffset
      C_positions.push(new THREE.Vector3(
        ringR * Math.cos(theta),
        z,
        ringR * Math.sin(theta)
      ))
    }
    // Boat conformation: 2 ta pastda, 4 ta yassi
    const C_boat = []
    for (let i = 0; i < 6; i++) {
      const theta = (i * 60) * Math.PI / 180
      // 0 va 3 pastda, boshqalari yuqorida (yassi)
      let z = 0
      if (i === 0) z = -zOffset * 0.9
      else if (i === 3) z = -zOffset * 0.9
      else z = zOffset * 0.5
      C_boat.push(new THREE.Vector3(
        ringR * Math.cos(theta),
        z,
        ringR * Math.sin(theta)
      ))
    }
    // Interpolatsiya
    const C = C_positions.map((cPos, i) => {
      return new THREE.Vector3().lerpVectors(cPos, C_boat[i], tValue)
    })

    // C atomlari
    C.forEach((cPos, i) => {
      createAtom(group, cPos, 'C', 0.22, { role: `C${i+1}` })
    })
    // Halqa bog'lanishlari
    for (let i = 0; i < 6; i++) {
      createBond(group, C[i], C[(i+1) % 6], CPK.bond, 0.07, 0.9)
    }

    // H atomlari (12 ta) — kreslo formada 6 ta ekvatorial + 6 ta eksial
    if (showHydrogens) {
      for (let i = 0; i < 6; i++) {
        const cPos = C[i]
        const theta = (i * 60) * Math.PI / 180
        // Radial normal (halqadan tashqariga)
        const radial = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)).normalize()
        // Axial (yuqoriga/pastga)
        const axialDir = (i % 2 === 0) ? +1 : -1
        // Kreslo formada har C da 1 eksial + 1 ekvatorial
        const hLen = 1.09
        // Eksial H
        const hAxial = cPos.clone().add(new THREE.Vector3(0, axialDir * hLen, 0))
        createAtom(group, hAxial, 'H', 0.10, { role: `H eksial (C${i+1})`, position: 'eksial' })
        createBond(group, cPos, hAxial, 0x666677, 0.03, 0.5)
        // Ekvatorial H — radial va biroz yuqori/past
        const hEqui = cPos.clone().add(radial.clone().multiplyScalar(hLen * 0.9)).add(new THREE.Vector3(0, -axialDir * hLen * 0.35, 0))
        createAtom(group, hEqui, 'H', 0.10, { role: `H ekvatorial (C${i+1})`, position: 'ekvatorial' })
        createBond(group, cPos, hEqui, 0x666677, 0.03, 0.5)
      }
    }

    if (showLabels) {
      const shapeName = tValue < 0.15 ? "Kreslo (chair)" :
                       tValue < 0.4 ? "Yarim-kreslo" :
                       tValue < 0.6 ? "Burilgan-vanna (twist)" :
                       tValue < 0.85 ? "Vanna (boat)" :
                       "Kreslo (flip)"
      const lbl = makeTextSprite(shapeName, {
        fontSize: 42, color: "#ffff88",
        bgColor: "rgba(50, 40, 10, 0.85)",
        borderColor: "#ffdd66", scale: 0.42
      })
      lbl.position.set(0, 2.5, 0)
      group.add(lbl); labelsRef.current.push(lbl)
    }
  }, [createAtom, createBond, showLabels, showHydrogens])

  // ═══════════════════════════════════════════════════════════
  // EN XELAT HALQA — M-N-C-C-N-M
  // ═══════════════════════════════════════════════════════════
  const buildEnChelate = useCallback((group, dihedralDeg) => {
    // 5 a'zoli halqa: M-N-C-C-N (aylana)
    const M = new THREE.Vector3(0, 0, 0)
    const nDist = 1.98
    // 2 ta N — Co dan 90°
    const n1 = new THREE.Vector3(nDist, 0, 0)
    const n2 = new THREE.Vector3(0, 0, nDist)
    // 2 ta C — C atomlari halqada
    // Dihedral C1-N1-N2-C2 buni belgilaydi
    // Halqaning bulg'in tekislikga nisbatan og'ishi
    const cc = 1.54  // C-C
    const nc = 1.47  // N-C
    // C1 — N1 dan chiqib
    // Halqa qanchalik yassi ekanligini phi ~ 0 (yassi) — 50 (burilgan)
    const phi = dihedralDeg * Math.PI / 180
    // C1 va C2 pozitsiyalari
    // Ideal: 5-a'zoli halqada N-C-C-N burchak taxminan 108°
    // Yassi (envelope=0), bir tomon burilgan (=50°)
    const midNN = new THREE.Vector3().addVectors(n1, n2).multiplyScalar(0.5)  // ikki N o'rtasi
    const halfNN = new THREE.Vector3().subVectors(n2, n1).multiplyScalar(0.5)
    const NNvec = halfNN.length() * 2
    // Halqa perpendikulyar tomonga (Co'dan tashqari)
    const outward = midNN.clone().sub(M).normalize()
    // Halqa perpendikulyar (n1'dan n2'ga)
    const nnDir = new THREE.Vector3().subVectors(n2, n1).normalize()
    // Halqa yuqori/past
    const up = new THREE.Vector3().crossVectors(outward, nnDir).normalize()

    // C-C markazi halqada
    // C atomlari N atomlaridan halqa ichida
    // Bulg'in — up yo'nalishida yoki past
    const bulgeDir = up.clone().multiplyScalar(Math.sin(phi) * 0.4)
    const c1 = n1.clone().add(outward.clone().multiplyScalar(0.7)).add(nnDir.clone().multiplyScalar(0.4)).add(bulgeDir)
    const c2 = n2.clone().add(outward.clone().multiplyScalar(0.7)).sub(nnDir.clone().multiplyScalar(0.4)).add(bulgeDir)

    // Co
    createAtom(group, M, 'Co', 0.4, { role: 'Markaziy metall', isCenter: true })
    // 2 N donor
    createAtom(group, n1, 'N', 0.24, { role: 'en N1 donor (halqa)', isDonor: true })
    createAtom(group, n2, 'N', 0.24, { role: 'en N2 donor (halqa)', isDonor: true })
    // 2 C
    createAtom(group, c1, 'C', 0.20, { role: 'en C1 (halqa)' })
    createAtom(group, c2, 'C', 0.20, { role: 'en C2 (halqa)' })

    // Halqa bog'lanishlari
    createBond(group, M, n1, CPK.bond, 0.06)
    createBond(group, M, n2, CPK.bond, 0.06)
    createBond(group, n1, c1, 0x777788, 0.05, 0.8)
    createBond(group, c1, c2, 0x777788, 0.05, 0.8)
    createBond(group, c2, n2, 0x777788, 0.05, 0.8)

    // NH₂ va CH₂ vodorodlari
    if (showHydrogens) {
      // Har N da 2 ta H
      ;[n1, n2].forEach((nPos, ni) => {
        const outN = nPos.clone().sub(M).normalize()
        const perpN = new THREE.Vector3().crossVectors(outN, up).normalize()
        ;[+1, -1].forEach(sign => {
          const hPos = nPos.clone().add(outN.clone().multiplyScalar(0.3)).add(perpN.clone().multiplyScalar(0.3 * sign))
          createAtom(group, hPos, 'H', 0.10, { role: 'NH₂ H' })
          createBond(group, nPos, hPos, 0x555566, 0.025, 0.45)
        })
      })
      // Har C da 2 ta H
      ;[c1, c2].forEach((cPos, ci) => {
        const outC = cPos.clone().sub(M).normalize()
        const perpC = new THREE.Vector3().crossVectors(outC, nnDir).normalize()
        ;[+1, -1].forEach(sign => {
          const hPos = cPos.clone().add(outC.clone().multiplyScalar(0.3)).add(perpC.clone().multiplyScalar(0.3 * sign))
          createAtom(group, hPos, 'H', 0.10, { role: 'CH₂ H' })
          createBond(group, cPos, hPos, 0x555566, 0.025, 0.45)
        })
      })
    }

    if (showLabels) {
      // λ yoki δ nomi
      const conformerName = dihedralDeg > 15 ? "λ (lambda)" :
                            dihedralDeg < -15 ? "δ (delta)" :
                            "Yassi (envelope)"
      const conformerColor = dihedralDeg > 15 ? "#ff4488" :
                            dihedralDeg < -15 ? "#4488ff" :
                            "#ffaa44"
      const lbl = makeTextSprite(conformerName + " konformer", {
        fontSize: 42, color: "#ffffff",
        bgColor: `${conformerColor}44`,
        borderColor: conformerColor, scale: 0.42
      })
      lbl.position.set(0, 2.5, 0)
      group.add(lbl); labelsRef.current.push(lbl)
    }
  }, [createAtom, createBond, showLabels, showHydrogens])

  // ═══════════════════════════════════════════════════════════
  // [Co(en)₃]³⁺ — 3 ta xelat halqa
  // ═══════════════════════════════════════════════════════════
  const buildCoenComplex = useCallback((group, lelCount) => {
    // Co markazda
    const M = new THREE.Vector3(0, 0, 0)
    const nDist = 1.98
    // 6 ta N (3 juft xelat) — oktaedrik
    // Xelat halqalar C₃ o'q atrofida joylashadi (Δ konfiguratsiya)
    const chelateAngles = [0, 120, 240] // 3 ta xelat, C₃ simmetriya
    // Har xelat 2 ta N joylaydi (yaqin joyda)

    createAtom(group, M, 'Co', 0.42, { role: 'Markaziy Co(III)', isCenter: true })

    chelateAngles.forEach((baseAngle, chelIdx) => {
      // Har xelatning ikki N pozitsiyasi
      const angleOffset = 25 // xelat halqa ichidagi 2 N orasidagi burchak
      const angle1 = (baseAngle - angleOffset) * Math.PI / 180
      const angle2 = (baseAngle + angleOffset) * Math.PI / 180
      const zOffset = chelIdx % 2 === 0 ? 0.5 : -0.5  // yuqori/pastki
      // N atomlarni oktaedrik pozitsiyalarda joylaymiz
      // Har xelat 1 ta yuqori + 1 ta pastki N
      const n1 = new THREE.Vector3(
        nDist * Math.cos(angle1),
        zOffset,
        nDist * Math.sin(angle1)
      )
      const n2 = new THREE.Vector3(
        nDist * Math.cos(angle2),
        -zOffset,
        nDist * Math.sin(angle2)
      )

      createAtom(group, n1, 'N', 0.22, { role: `en${chelIdx+1} N1`, isDonor: true })
      createAtom(group, n2, 'N', 0.22, { role: `en${chelIdx+1} N2`, isDonor: true })
      createBond(group, M, n1, CPK.bond, 0.06)
      createBond(group, M, n2, CPK.bond, 0.06)

      // Bu xelat lel yoki ob ekanligini aniqlaymiz
      // lelCount = 0,1,2,3 — nechta lel bor
      const isLel = chelIdx < lelCount
      const bulgeMagnitude = 0.4
      const bulgeDir = isLel ? +1 : -1  // lel: parallel; ob: qiya
      // Halqa markaz (2 N o'rtasi)
      const midNN = new THREE.Vector3().addVectors(n1, n2).multiplyScalar(0.5)
      const outward = midNN.clone().sub(M).normalize()
      const nnDir = new THREE.Vector3().subVectors(n2, n1).normalize()
      const up = new THREE.Vector3().crossVectors(outward, nnDir).normalize()

      const c1Pos = n1.clone()
        .add(outward.clone().multiplyScalar(0.65))
        .add(nnDir.clone().multiplyScalar(0.35))
        .add(up.clone().multiplyScalar(bulgeMagnitude * bulgeDir))
      const c2Pos = n2.clone()
        .add(outward.clone().multiplyScalar(0.65))
        .sub(nnDir.clone().multiplyScalar(0.35))
        .add(up.clone().multiplyScalar(bulgeMagnitude * bulgeDir))

      // C atomlari — rangli belgilash
      const cColor = isLel ? 0x44ff88 : 0xff8844
      const c1Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshStandardMaterial({
          color: cColor, roughness: 0.3, metalness: 0.2,
          emissive: cColor, emissiveIntensity: 0.2
        })
      )
      c1Mesh.position.copy(c1Pos)
      c1Mesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C,
        role: `en${chelIdx+1} C1 (${isLel ? 'lel' : 'ob'})`, conformer: isLel ? 'lel' : 'ob' }
      group.add(c1Mesh); atomsRef.current.push(c1Mesh)

      const c2Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshStandardMaterial({
          color: cColor, roughness: 0.3, metalness: 0.2,
          emissive: cColor, emissiveIntensity: 0.2
        })
      )
      c2Mesh.position.copy(c2Pos)
      c2Mesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C,
        role: `en${chelIdx+1} C2 (${isLel ? 'lel' : 'ob'})`, conformer: isLel ? 'lel' : 'ob' }
      group.add(c2Mesh); atomsRef.current.push(c2Mesh)

      createBond(group, n1, c1Pos, 0x777788, 0.05, 0.8)
      createBond(group, c1Pos, c2Pos, 0x777788, 0.05, 0.8)
      createBond(group, c2Pos, n2, 0x777788, 0.05, 0.8)

      // H atomlari (soddalashtirilgan, faqat asosiy)
      if (showHydrogens) {
        ;[c1Pos, c2Pos].forEach(cPos => {
          const outC = cPos.clone().sub(M).normalize()
          const perpC = new THREE.Vector3().crossVectors(outC, up).normalize()
          ;[+1, -1].forEach(sign => {
            const hPos = cPos.clone().add(outC.clone().multiplyScalar(0.25)).add(perpC.clone().multiplyScalar(0.28 * sign))
            createAtom(group, hPos, 'H', 0.08, { role: `en${chelIdx+1} CH₂ H` })
            createBond(group, cPos, hPos, 0x555566, 0.02, 0.4)
          })
        })
        ;[n1, n2].forEach(nPos => {
          const outN = nPos.clone().sub(M).normalize()
          const perpN = new THREE.Vector3().crossVectors(outN, new THREE.Vector3(0, 1, 0)).normalize()
          ;[+1, -1].forEach(sign => {
            const hPos = nPos.clone().add(outN.clone().multiplyScalar(0.28)).add(perpN.clone().multiplyScalar(0.28 * sign))
            createAtom(group, hPos, 'H', 0.09, { role: `en${chelIdx+1} NH₂ H` })
            createBond(group, nPos, hPos, 0x555566, 0.02, 0.4)
          })
        })
      }
    })

    // Formula sprite
    if (showLabels) {
      const nameMap = { 0: "ob₃", 1: "lel·ob₂", 2: "lel₂·ob", 3: "lel₃" }
      const lelText = `Δ-[Co(en)₃]³⁺ — ${nameMap[lelCount] || `lel${lelCount}`}`
      const lelColor = lelCount === 3 ? "#44ff88" :
                       lelCount === 0 ? "#ff8844" : "#ffdd44"
      const sp = makeTextSprite(lelText, {
        fontSize: 42, color: "#ffffff",
        bgColor: `${lelColor}44`,
        borderColor: lelColor, scale: 0.4
      })
      sp.position.set(0, 3.2, 0)
      group.add(sp); labelsRef.current.push(sp)
    }
  }, [createAtom, createBond, showLabels, showHydrogens])

  // ═══════════════════════════════════════════════════════════
  // Dihedral arc — buruq burchakning yoyi
  // ═══════════════════════════════════════════════════════════
  const drawDihedralArc = useCallback((group, dihedralDeg) => {
    if (!showDihedralArc) return
    if (currentSystem !== "ethane" && currentSystem !== "butane") return

    const arcRadius = 0.6
    const arcSegments = 32
    const curve = new THREE.EllipseCurve(
      0, 0,
      arcRadius, arcRadius,
      0, dihedralDeg * Math.PI / 180,
      false, 0
    )
    const points = curve.getPoints(arcSegments)
    const points3D = points.map(p => new THREE.Vector3(0, p.x, p.y))
    const geo = new THREE.BufferGeometry().setFromPoints(points3D)
    const mat = new THREE.LineBasicMaterial({ color: CPK.dihedral, linewidth: 2 })
    const line = new THREE.Line(geo, mat)
    line.position.set(0, 0, 0)
    group.add(line)
    dihedralArcRef.current = line

    // Yoy uchida burchak yorlig'i
    const angleMid = (dihedralDeg / 2) * Math.PI / 180
    const lblPos = new THREE.Vector3(0, arcRadius * 1.4 * Math.cos(angleMid), arcRadius * 1.4 * Math.sin(angleMid))
    const lbl = makeTextSprite(`φ = ${dihedralDeg.toFixed(0)}°`, {
      fontSize: 32, color: "#66ffaa",
      bgColor: "rgba(10, 40, 20, 0.85)",
      borderColor: "#66ffaa", scale: 0.32
    })
    lbl.position.copy(lblPos)
    group.add(lbl); labelsRef.current.push(lbl)
  }, [showDihedralArc, currentSystem])

  // Aylanish o'qi — vizual
  const drawRotationAxis = useCallback((group) => {
    if (!showAxis) return
    if (currentSystem !== "ethane" && currentSystem !== "butane") return

    const axisGeo = new THREE.CylinderGeometry(0.02, 0.02, 4, 12)
    const axisMat = new THREE.MeshBasicMaterial({ color: CPK.torsion, transparent: true, opacity: 0.8 })
    const axis = new THREE.Mesh(axisGeo, axisMat)
    axis.rotation.z = Math.PI / 2
    group.add(axis)

    const lbl = makeTextSprite("aylanish o'qi", {
      fontSize: 28, color: "#ffaa44",
      bgColor: "rgba(40, 25, 5, 0.85)",
      borderColor: "#ffaa44", scale: 0.3
    })
    lbl.position.set(-2.2, 0.4, 0)
    group.add(lbl); labelsRef.current.push(lbl)
  }, [showAxis, currentSystem])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (moleculeGroupRef.current) {
      scene.remove(moleculeGroupRef.current)
      moleculeGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    highlightsRef.current = []
    rotatingGroupRef.current = null
    dihedralArcRef.current = null

    const group = new THREE.Group()
    moleculeGroupRef.current = group

    if (currentSystem === "ethane") {
      buildEthane(group, dihedralAngle)
    } else if (currentSystem === "butane") {
      buildButane(group, dihedralAngle)
    } else if (currentSystem === "cyclohexane") {
      buildCyclohexane(group, dihedralAngle)
    } else if (currentSystem === "enChelate") {
      buildEnChelate(group, dihedralAngle)
    } else if (currentSystem === "CoenComplex") {
      buildCoenComplex(group, Math.round(dihedralAngle))
    }

    drawDihedralArc(group, dihedralAngle)
    drawRotationAxis(group)

    scene.add(group)
  }, [currentSystem, dihedralAngle, buildEthane, buildButane, buildCyclohexane, buildEnChelate, buildCoenComplex, drawDihedralArc, drawRotationAxis])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Fon
    const bgGeo = new THREE.SphereGeometry(50, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        color1: { value: new THREE.Color(0x0a0520) },
        color2: { value: new THREE.Color(0x1a0f38) }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `uniform vec3 color1; uniform vec3 color2;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(color1, color2, h), 1.0);
        }`
    })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0520, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 20
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(500 * 3)
    for (let i = 0; i < 500 * 3; i += 3) {
      const r = 20 + Math.random() * 15
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      sp[i] = r * Math.sin(ph) * Math.cos(th)
      sp[i + 1] = r * Math.sin(ph) * Math.sin(th)
      sp[i + 2] = r * Math.cos(ph)
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true
    })))

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        if (obj.userData && obj.userData.type === 'atom') {
          setSelectedAtom(obj.userData)
        }
      } else {
        setSelectedAtom(null)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    // Animatsiya
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    setTimeout(() => setLoading(false), 400)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener('click', onClick)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { rebuildScene() }, [rebuildScene])
  useEffect(() => { if (controlsRef.current) controlsRef.current.autoRotate = autoRotate }, [autoRotate])

  // Aylanish animatsiyasi
  useEffect(() => {
    if (!animateRotation) return
    let raf = 0
    const step = () => {
      raf = requestAnimationFrame(step)
      setDihedralAngle(prev => {
        const [minA, maxA] = system.dihedralRange
        let next = prev + animRef.current.direction * animRef.current.speed
        if (next >= maxA) { next = maxA; animRef.current.direction = -1 }
        if (next <= minA) { next = minA; animRef.current.direction = +1 }
        return next
      })
    }
    step()
    return () => cancelAnimationFrame(raf)
  }, [animateRotation, system.dihedralRange])

  // Boltzmann taqsimoti
  const boltzmannData = useMemo(() => {
    const uniqueEnergies = []
    const seenEnergies = new Set()
    system.keyDihedrals.forEach(c => {
      if (!seenEnergies.has(c.energy)) {
        seenEnergies.add(c.energy)
        uniqueEnergies.push({ name: c.name, energy: c.energy, color: c.color })
      }
    })
    const populations = boltzmannPopulation(uniqueEnergies.map(u => u.energy), temperature)
    return uniqueEnergies.map((u, i) => ({ ...u, population: populations[i] }))
  }, [system, temperature])

  // Energiya grafigi uchun sample'lar
  const energyProfile = useMemo(() => {
    const [minA, maxA] = system.dihedralRange
    const samples = []
    const steps = 100
    for (let i = 0; i <= steps; i++) {
      const angle = minA + (maxA - minA) * (i / steps)
      samples.push({ angle, energy: system.energyFunction(angle) })
    }
    return samples
  }, [system])

  // ═══════════════════════════════════════════════════════════
  // PDF GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const [rBytes, bBytes, iBytes] = await Promise.all([
          fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic"); return r.arrayBuffer() })
        ])
        regularFont = await pdfDoc.embedFont(rBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(bBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(iBytes, { subset: true })
      } catch (e) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false); return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), blue: rgb(0.08, 0.31, 0.75),
        yellow: rgb(0.75, 0.60, 0.10), cyan: rgb(0.15, 0.55, 0.75),
        pink: rgb(0.85, 0.35, 0.60),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgPink: rgb(1.0, 0.95, 0.98), bgCyan: rgb(0.92, 0.98, 1.0),
        white: rgb(1, 1, 1)
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (t, f, s, w) => {
        const str = String(t)
        if (measure(str, f, s) <= w) return str
        let lo = 0, hi = str.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(str.slice(0, mid) + "…", f, s) <= w) lo = mid
          else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (t, f, s, w) => {
        if (!t) return [""]
        const words = String(t).split(/\s+/)
        const lines = []
        let cur = ""
        for (const wd of words) {
          const test = cur ? cur + " " + wd : wd
          if (measure(test, f, s) > w && cur) { lines.push(cur); cur = wd }
          else cur = test
          if (measure(cur, f, s) > w) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, f, s) > w) { lines.push(piece); piece = ch }
              else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }

      const addFooter = () => {
        const left = truncate(
          `Konformatsion izomeriyasi 3D Lab  •  ${cleanText(system.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(left, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pStr = `${pageNum}`
        const w = measure(pStr, regularFont, 8)
        page.drawText(pStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple })
        page.drawText(`${num}.`, { x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple })
        page.drawText(title, { x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark })
        y -= 30
      }

      const drawParagraph = (text, opts = {}) => {
        const { size = 10, font = regularFont, color = C.textDark, indent = 0 } = opts
        const lines = wrapText(cleanText(text), font, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, { x: MARGIN + indent, y, size, font, color })
          y -= size + 4
        }
        y -= 4
      }

      const drawBulletPoint = (text, color = C.purple) => {
        const size = 10, indent = 20
        checkBreak(size + 6)
        page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2, color })
        const lines = wrapText(cleanText(text), regularFont, size, CONTENT_W - indent)
        lines.forEach((line, i) => {
          if (i > 0) checkBreak(size + 3)
          page.drawText(line, { x: MARGIN + indent, y, size, font: regularFont, color: C.textDark })
          y -= size + 3
        })
        y -= 2
      }

      const drawInfoBox = (title, body, bgColor, borderColor) => {
        const size = 10, titleSize = 11, pad = 10
        const bodyLines = wrapText(cleanText(body), regularFont, size, CONTENT_W - 2 * pad)
        const boxH = titleSize + 8 + bodyLines.length * (size + 3) + 2 * pad
        checkBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor })
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: 3, height: boxH, color: borderColor })
        page.drawText(cleanText(title), { x: MARGIN + pad, y: y - pad - titleSize + 4, size: titleSize, font: boldFont, color: borderColor })
        let by = y - pad - titleSize - 8
        bodyLines.forEach(line => {
          page.drawText(line, { x: MARGIN + pad, y: by, size, font: regularFont, color: C.textDark })
          by -= size + 3
        })
        y -= boxH + 10
      }

      // ═══════════════════════════════════════════════════════
      // MUQOVA
      // ═══════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      const titleText = "KONFORMATSION IZOMERIYASI"
      const tW = measure(titleText, boldFont, 24)
      page.drawText(titleText, { x: (PAGE_W - tW) / 2, y: PAGE_H - 88, size: 24, font: boldFont, color: C.white })

      const subtitle = "Aylanish konformerlari va energetika"
      const sW = measure(subtitle, italicFont, 13)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 113, size: 13, font: italicFont, color: C.purpleLight })

      const formulaText = cleanText(system.formula)
      const fW = measure(formulaText, boldFont, 22)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 160, size: 22, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan sistema", system.title, C.bgPurple, C.purple)

      const meta = [
        ["Formula:", system.formula],
        ["To'siq energiyasi:", `${system.barrierEnergy} kJ/mol`],
        ["Barqaror konformerlar:", `${system.keyDihedrals.filter(c => c.energy < 5).length} ta`],
        ["Hozirgi burchak (φ):", `${dihedralAngle.toFixed(1)}°`],
        ["Hozirgi energiya:", `${currentEnergy.toFixed(2)} kJ/mol`]
      ]
      meta.forEach(([k, v]) => {
        checkBreak(18)
        page.drawText(cleanText(k), { x: MARGIN + 10, y, size: 10.5, font: boldFont, color: C.purple })
        page.drawText(truncate(cleanText(v), regularFont, 10.5, CONTENT_W - 170), { x: MARGIN + 160, y, size: 10.5, font: regularFont, color: C.textDark })
        y -= 17
      })
      y -= 12

      // ── 1. Kirish ──
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Konformatsion izomeriya nima?")
        drawParagraph(
          "Konformatsion izomeriya (konformerlik) — molekuladagi yakka bog'lanish (asosan C–C, C–N, C–O σ-bog'lanish) atrofidagi aylanish natijasida hosil bo'ladigan turli fazoviy tuzilishlar. Bu konformerlar bir xil bog'lanishlar to'plamiga ega, ammo atomlarning uch o'lchamdagi joylashuvi turli xil. Konformerlar odatda past energetik to'siq bilan bir-biriga o'tadi (< 20 kJ/mol), shuning uchun ular xona haroratida tez muvozanatda bo'ladi."
        )
        drawParagraph("Konformatsion izomerlarning asosiy xususiyatlari:")
        drawBulletPoint("Bir xil molekulyar formula va bir xil bog'lanishlar tarkibi")
        drawBulletPoint("Ochiq zanjirli molekulalarda C–C bog' atrofida aylanish orqali hosil bo'ladi")
        drawBulletPoint("Halqali molekulalarda (masalan sikloheksan) halqa deformatsiyasi orqali hosil bo'ladi")
        drawBulletPoint("Xelat komplekslarda ligand halqasining konformatsiyasi bilan namoyon bo'ladi (λ va δ)")
        drawBulletPoint("Konformerlar xona haroratida tez muvozanatda bo'ladi — Boltzmann taqsimoti bo'yicha")
        drawBulletPoint("Buruq burchak (dihedral) — konformatsiyani aniqlaydigan asosiy parametr (0°—360°)")
      }

      // ── 2. Nazariya ──
      if (pdfSections.theory) {
        drawSectionHeader(2, "Nazariy asoslar")
        drawParagraph(system.theory || "Konformatsion energetika kvant kimyoviy hisoblashlar orqali aniqlanadi.")
        drawInfoBox(
          "Buruq burchak (φ) ta'rifi",
          "Buruq burchak — 4 ta ketma-ket atomdan tashkil topgan A–B–C–D zanjirining B–C bog'i atrofida qayralish burchagi. A–B va C–D bog'lari orasidagi 3D burchakni ko'rsatadi (0°—360°). Bu burchak konformatsiyani aniqlashda eng muhim parametrdir.",
          C.bgYellow, C.yellow
        )
        drawInfoBox(
          "Aylanish to'sig'ining kelib chiqishi",
          "1. Pauli itarilishi — to'siq holatida bog'lanuvchi orbitallar bir-birini itaradi. 2. Giperkonjugatsiya — zinapoya (staggered) holatda bog' orbitallar antibog'lanuvchi σ* orbitalga o'tishi (stabilizatsiya). 3. Van der Waals itarilishi — atomlar yaqinlashganda elektron bulutlari itaradi. 4. Sterik effektlar — hajmli guruhlar bir-birining oldida bo'lishga qarshilik ko'rsatadi.",
          C.bgCyan, C.cyan
        )
      }

      // ── 3. Konformerlar strukturasi ──
      if (pdfSections.structures) {
        drawSectionHeader(3, "Barqaror konformerlar tavsifi")
        system.keyDihedrals.forEach((k, idx) => {
          const bgs = [C.bgGreen, C.bgYellow, C.bgOrange, C.bgRed, C.bgPink, C.bgBlue]
          const borders = [C.green, C.yellow, C.orange, C.red, C.pink, C.blue]
          drawInfoBox(
            `${k.name} (${currentSystem === 'cyclohexane' || currentSystem === 'CoenComplex' ? '' : `φ = ${k.angle}°`})`,
            `Energiya: ${k.energy} kJ/mol. Barqarorlik: ${k.stability}. Ingliz nomi: ${k.nameEn}.`,
            bgs[idx % 6], borders[idx % 6]
          )
        })
      }

      // ── 4. Energiya profili ──
      if (pdfSections.energy) {
        drawSectionHeader(4, "Energiya profili va aylanish to'sig'i")
        drawParagraph(
          `To'siq energiyasi (barrier height): ${system.barrierEnergy} kJ/mol. Bu — konformatsion aylanish uchun kerakli minimal energiya. Xona haroratida (298 K) RT ≈ 2.5 kJ/mol, shuning uchun konformerlar orasidagi o'tish tezligi Arrenius tenglamasi bo'yicha hisoblanadi.`
        )
        drawInfoBox(
          "Arrenius tenglamasi",
          "k = A·exp(−Eₐ/RT). Bu yerda k — reaksiya (o'tish) tezligi konstantasi, A — pred-eksponensial faktor (odatda 10¹²—10¹³ s⁻¹), Eₐ — aktivlanish energiyasi (kJ/mol), R = 8.314 J/(mol·K), T — harorat (K).",
          C.bgBlue, C.blue
        )
        drawParagraph("Energiya funksiyasining Fourier kengaymasi:")
        drawBulletPoint("V(φ) = ½·V₁(1−cos φ) + ½·V₂(1−cos 2φ) + ½·V₃(1−cos 3φ) + ...")
        drawBulletPoint("V₃ — 3-tartib (etan) uchun asosiy — 12.6 kJ/mol")
        drawBulletPoint("V₁ — butanda muhim — anti-syn assimetrik farqni ta'minlaydi")
        drawBulletPoint("V₂ — π-elektron sistemalarida katta (masalan, etilen ~ 250 kJ/mol!)")
      }

      // ── 5. Boltzmann taqsimoti ──
      if (pdfSections.boltzmann) {
        drawSectionHeader(5, "Boltzmann taqsimoti va konformer nisbatlari")
        drawParagraph(
          `Xona haroratida (T = ${temperature} K) turli konformerlar orasidagi taqsimot Boltzmann statistikasi bo'yicha aniqlanadi. Termodinamik jihatdan eng barqaror konformer ko'p miqdorda uchraydi.`
        )
        drawInfoBox(
          "Boltzmann tenglamasi",
          "N₁/N₂ = exp(−ΔG/RT). Bu yerda N — konformer sonining ulushi, ΔG — Gibbs erkin energiyasi farqi (kJ/mol), R = 8.314 J/(mol·K), T — harorat (K). Xona haroratida RT ≈ 2.48 kJ/mol.",
          C.bgYellow, C.yellow
        )
        drawParagraph(`Hozirgi holat (T = ${temperature} K, ${(temperature-273.15).toFixed(0)}°C) uchun konformerlar taqsimoti:`)
        boltzmannData.forEach(b => {
          drawBulletPoint(`${b.name} (ΔE = ${b.energy} kJ/mol): ${b.population.toFixed(1)}%`)
        })
      }

      // ── 6. Newman proyeksiyasi ──
      if (pdfSections.newman) {
        drawSectionHeader(6, "Newman proyeksiyasi — konformerlarni tasvirlash")
        drawInfoBox(
          "Newman proyeksiyasi nima?",
          "Newman proyeksiyasi (Melvin Newman, 1955) — buruq burchakni to'g'ridan-to'g'ri C–C bog' bo'ylab qarab ko'rsatuvchi 2D diagramma. Old atom (nuqta) va orqa atom (aylana) bir-biriga qanchalik burilganini vizual tarzda ko'rsatadi. Har bir atomdan 3 ta chiziq chiqadi (bog'lanishlar).",
          C.bgPurple, C.purple
        )
        drawParagraph("Newman proyeksiyasidagi asosiy holatlar:")
        drawBulletPoint("To'silgan (eclipsed) — old va orqa atomdagi bog'lanishlar ustma-ust yopishgan (φ = 0° yoki 120°)")
        drawBulletPoint("Zinapoya (staggered) — bog'lanishlar 60° siljigan holatda (φ = 60°, 180°, 300°)")
        drawBulletPoint("Anti — ikki eng katta guruh 180° farqda")
        drawBulletPoint("Gauche — ikki eng katta guruh 60° masofada")
        drawBulletPoint("Syn-periplanar — 0° (to'silgan holatning eng past barqaror shakli)")
      }

      // ── 7. Amaliy qo'llanilishi ──
      if (pdfSections.applications) {
        drawSectionHeader(7, "Amaliy qo'llanilishi")
        drawParagraph(system.applications || "Konformatsion tahlil zamonaviy kimyoning barcha sohalarida qo'llaniladi.")
        drawBulletPoint("Biokimyo: DNK/RNK burilish burchaklari (α, β, γ, δ, ε, ζ), oqsil sekundar tuzilishi (φ, ψ Ramachandran maydonlari)")
        drawBulletPoint("Farmatsevtika: dorining bioaktiv konformatsiyasini aniqlash (docking studies)")
        drawBulletPoint("Koordinatsion kimyo: xelat halqa konformatsiyalari (λ/δ), lel/ob nisbati [Co(en)₃]³⁺ da")
        drawBulletPoint("Polimer kimyosi: polietilen, polipropilenning zanjir konformatsiyalari")
        drawBulletPoint("NMR spektroskopiyasi: J-bog'lanish konstantalari orqali konformatsiyani aniqlash (Karplus tenglamasi)")
        drawBulletPoint("Molekulyar modelling: Force field parametrlari (AMBER, CHARMM, OPLS)")
      }

      // ── 8. Konformerlar jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(8, "Konformerlar solishtirish jadvali")
        const rows = [["Konformer", "φ (°)", "Energiya (kJ/mol)", "Barqarorlik"]]
        system.keyDihedrals.forEach(k => {
          rows.push([
            k.name,
            currentSystem === 'cyclohexane' || currentSystem === 'CoenComplex' ? '—' : `${k.angle}°`,
            `${k.energy}`,
            k.stability
          ])
        })
        const colW = [CONTENT_W * 0.34, CONTENT_W * 0.13, CONTENT_W * 0.20, CONTENT_W * 0.33]
        const rowH = 24
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 6
          row.forEach((cell, ci) => {
            const font = isHeader ? boldFont : regularFont
            const fs = isHeader ? 9 : 8.5
            const txt = truncate(cleanText(cell), font, fs, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 9, size: fs, font,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // ── 9. Adabiyotlar ──
      if (pdfSections.references) {
        drawSectionHeader(9, "Adabiyotlar")
        const refs = [
          "Kemp, J.D., Pitzer, K.S. (1936). Hindered Rotation of the Methyl Groups in Ethane. Journal of Chemical Physics, 4, 749.",
          "Sachse, H. (1890). Über die geometrischen Isomerien der Hexamethylenderivate. Berichte der deutschen chemischen Gesellschaft, 23, 1363–1370.",
          "Hassel, O. (1943). Stereochemistry of cyclohexane. Tidsskrift for Kjemi, Bergvesen og Metallurgi, 3, 32.",
          "Newman, M.S. (1955). A Notation for the Study of Certain Stereochemical Problems. Journal of Chemical Education, 32(7), 344–347.",
          "Corey, E.J., Bailar, J.C. Jr. (1959). The Stereochemistry of Complex Inorganic Compounds. XXII. Journal of the American Chemical Society, 81, 2620–2629.",
          "Pophristic, V., Goodman, L. (2001). Hyperconjugation not steric repulsion leads to the staggered structure of ethane. Nature, 411, 565–568.",
          "Kuroda, R., Ito, N. (1972). Structure of (+)ᴅ-Δ-tris(ethylenediamine)cobalt(III) chloride. Acta Crystallographica, B28, 1932.",
          "IUPAC (2013). Nomenclature of Organic Chemistry: Recommendations and Preferred Names 2013.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 3 — Conformational analysis.",
          "Anslyn, E.V., Dougherty, D.A. (2006). Modern Physical Organic Chemistry. University Science Books. Chapter 2 — Conformational Analysis."
        ]
        refs.forEach((r, i) => {
          const size = 8.5
          const lines = wrapText(r, regularFont, size, CONTENT_W - 20)
          lines.forEach((ln, li) => {
            checkBreak(size + 3)
            const prefix = li === 0 ? `[${i + 1}]` : ""
            if (prefix) page.drawText(prefix, { x: MARGIN, y, size, font: boldFont, color: C.purple })
            page.drawText(ln, { x: MARGIN + 20, y, size, font: regularFont, color: C.textDark })
            y -= size + 3
          })
          y -= 3
        })
      }

      addFooter()

      pdfDoc.setTitle(`Konformatsion izomeriyasi — ${cleanText(system.formula)}`)
      pdfDoc.setSubject("Konformatsion izomeriya va aylanish to'siqlari")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["konformatsion izomeriya", "buruq burchak", "Newman proyeksiyasi", "Boltzmann"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `konformatsion-izomeriya-${system.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">

      {/* HEADER */}
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/oquv/izomeriyasi/stereo/konformatsion"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-emerald-300 flex items-center gap-2 truncate">
              <span>🌀</span>
              <span className="hidden sm:inline">Konformatsion izomeriya — 3D Laboratoriya</span>
              <span className="sm:hidden">Konformatsion 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {system.formula} • {nearestConformer.name} ({currentEnergy.toFixed(1)} kJ/mol)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentSystem}
            onChange={(e) => setCurrentSystem(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[240px]"
          >
            <option value="ethane">Etan (C₂H₆) — klassik</option>
            <option value="butane">Butan (C₄H₁₀) — anti/gauche</option>
            <option value="cyclohexane">Sikloheksan — kreslo/vanna</option>
            <option value="enChelate">en xelat — λ/δ</option>
            <option value="CoenComplex">[Co(en)₃]³⁺ — lel/ob</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Sahna aylantirish"
          >🔄</button>

          <button
            onClick={() => setAnimateRotation(!animateRotation)}
            className={`p-2 rounded-lg transition-all text-sm ${animateRotation ? 'bg-emerald-600/60 text-white shadow-lg shadow-emerald-500/30' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Konformatsion aylanish animatsiyasi"
          >⚙️</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => togglePanel("energy")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "energy" ? 'bg-yellow-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Energiya diagrammasi"
          >📈</button>

          <button
            onClick={() => togglePanel("newman")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "newman" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Newman proyeksiyasi"
          >👁️</button>

          <button
            onClick={() => togglePanel("boltzmann")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "boltzmann" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Boltzmann taqsimoti"
          >📊</button>

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Tarixiy ma'lumot"
          >📜</button>

          <button
            onClick={() => togglePanel("test")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Test"
          >🧠</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="PDF eksport"
          >📄</button>

          <button
            onClick={() => setFullscreenMode(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="To'liq ekran"
          >🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40"
          title="Fullscreen rejimidan chiqish"
        >
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[290px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
            title="Ushlab siljiting"
          >
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* — DIHEDRAL BURCHAK SLIDER — asosiy o'yin! — */}
            <div className="mb-3 p-3 rounded-lg border-2 border-emerald-600/40 bg-emerald-950/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-emerald-300 uppercase tracking-wide font-bold">
                  {currentSystem === "cyclohexane" ? "Konformatsiya" :
                   currentSystem === "CoenComplex" ? "lel halqalar soni" :
                   "Buruq burchak (φ)"}
                </span>
                <span className="text-lg font-bold text-white">
                  {currentSystem === "cyclohexane" ? `${(dihedralAngle * 100).toFixed(0)}%` :
                   currentSystem === "CoenComplex" ? `${Math.round(dihedralAngle)}/3` :
                   `${dihedralAngle.toFixed(0)}°`}
                </span>
              </div>
              <input
                type="range"
                min={system.dihedralRange[0]}
                max={system.dihedralRange[1]}
                step={currentSystem === "CoenComplex" ? 1 : currentSystem === "cyclohexane" ? 0.01 : 1}
                value={dihedralAngle}
                onChange={(e) => setDihedralAngle(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 mb-2"
              />
              <div className="flex justify-between text-[9px] text-emerald-400/70 mb-2">
                <span>{system.dihedralRange[0]}{currentSystem === "cyclohexane" || currentSystem === "CoenComplex" ? "" : "°"}</span>
                <span>{system.dihedralRange[1]}{currentSystem === "cyclohexane" || currentSystem === "CoenComplex" ? "" : "°"}</span>
              </div>
              <div
                className="text-[10px] p-2 rounded font-mono"
                style={{
                  backgroundColor: `${nearestConformer.color}22`,
                  border: `1px solid ${nearestConformer.color}66`,
                  color: nearestConformer.color
                }}
              >
                <div className="font-bold">{nearestConformer.name}</div>
                <div className="text-white/80 text-[9px] mt-0.5">
                  E = <span className="font-bold">{currentEnergy.toFixed(2)} kJ/mol</span>
                </div>
              </div>
            </div>

            {/* — TEZ TANLASH — */}
            <div className="mb-3 px-1">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">⚡ Tez tanlash</div>
              <div className="grid grid-cols-2 gap-1">
                {system.keyDihedrals.slice(0, 6).map((k, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDihedralAngle(k.angle)}
                    className={`text-[9px] px-2 py-1.5 rounded text-white transition-all ${
                      Math.abs(dihedralAngle - k.angle) < (currentSystem === "cyclohexane" ? 0.1 : 5)
                        ? 'ring-2 ring-white/70 shadow-lg'
                        : 'hover:brightness-125'
                    }`}
                    style={{ backgroundColor: `${k.color}77` }}
                    title={`${k.energy} kJ/mol`}
                  >
                    <div className="font-bold truncate">{k.nameEn}</div>
                    <div className="text-[8px] opacity-80">{k.energy} kJ/mol</div>
                  </button>
                ))}
              </div>
            </div>

            {/* — KO'RINISH — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Buruq burchak yoyi</span>
                  <input type="checkbox" checked={showDihedralArc} onChange={(e) => setShowDihedralArc(e.target.checked)} className="accent-green-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Aylanish o'qi</span>
                  <input type="checkbox" checked={showAxis} onChange={(e) => setShowAxis(e.target.checked)} className="accent-orange-500" />
                </label>
              </div>
            )}

            {/* — ANIMATSIYA — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "anim" ? null : "anim")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🎬</span> Animatsiya</span>
              <span>{expandedSection === "anim" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "anim" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setAnimateRotation(!animateRotation)}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${animateRotation ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>⚙️</span> Aylanish animatsiyasi</span>
                  <span>{animateRotation ? "⏸" : "▶"}</span>
                </button>
                <p className="text-[10px] text-purple-400 italic px-1">
                  Buruq burchakni avtomatik ravishda 0° dan 360° gacha aylantiradi va energiya profilini kuzatishga yordam beradi.
                </p>
              </div>
            )}

            {/* — HARORAT — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "temp" ? null : "temp")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🌡️</span> Harorat</span>
              <span>{expandedSection === "temp" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "temp" && (
              <div className="space-y-2 mb-3 px-1">
                <div className="text-[10px] text-purple-400">Harorat: <span className="text-white font-bold">{temperature} K ({(temperature - 273.15).toFixed(0)}°C)</span></div>
                <input
                  type="range"
                  min={100} max={500} step={5}
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[9px] text-purple-400">
                  <span>100 K</span><span>298 K</span><span>500 K</span>
                </div>
                <p className="text-[10px] text-purple-400 italic">
                  Harorat konformerlar Boltzmann taqsimotini o'zgartiradi (yuqori T → ko'proq muvozanat).
                </p>
              </div>
            )}

            {/* — EKSPORT — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all"
                >📄 PDF hisobot yaratish</button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                <span className="text-emerald-400">Slayder</span> buruq burchakni o'zgartiradi.
                <span className="text-yellow-400"> 📈 tugmasi</span> energiya profilini ochadi.
                <span className="text-cyan-400"> 👁️ Newman proyeksiyasi</span> 2D ko'rinishini beradi.
                <span className="text-orange-400"> ⚙️ Animatsiya</span> aylanishni ko'rsatadi.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* 3D Container */}
        <div ref={containerRef} className="flex-1 w-full relative" />

        {/* — Kichkina energiya grafigi (o'ng pastda) — */}
        {showEnergyGraph && !fullscreenMode && activePanel !== "energy" && (
          <div className="absolute bottom-4 left-4 bg-purple-950/90 backdrop-blur-md rounded-xl p-3 z-20 border border-yellow-700/40 shadow-2xl w-[300px]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-yellow-300 uppercase tracking-wide font-bold">📈 Energiya profili</div>
              <button
                onClick={() => setShowEnergyGraph(false)}
                className="text-purple-400 hover:text-purple-200 text-sm"
              >×</button>
            </div>
            <EnergyMiniChart
              samples={energyProfile}
              currentAngle={dihedralAngle}
              range={system.dihedralRange}
              barrier={system.barrierEnergy}
              keyConfs={system.keyDihedrals}
              systemId={currentSystem}
            />
          </div>
        )}

        {/* Newman proyeksiyasi kichik (o'ng pastda, faqat ethane/butane) */}
        {showNewman && !fullscreenMode && activePanel !== "newman" && (currentSystem === "ethane" || currentSystem === "butane") && (
          <div className="absolute bottom-4 right-4 bg-purple-950/90 backdrop-blur-md rounded-xl p-3 z-20 border border-cyan-700/40 shadow-2xl w-[220px]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-cyan-300 uppercase tracking-wide font-bold">👁️ Newman proyeksiyasi</div>
              <button
                onClick={() => setShowNewman(false)}
                className="text-purple-400 hover:text-purple-200 text-sm"
              >×</button>
            </div>
            <NewmanProjection
              dihedralDeg={dihedralAngle}
              systemId={currentSystem}
              size={180}
            />
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400 mx-auto"></div>
              <p className="mt-4 text-emerald-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Tanlangan atom */}
        {selectedAtom && !fullscreenMode && (
          <div className="absolute top-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-purple-200 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: selectedAtom.info?.color || '#888' }}></span>
                {selectedAtom.info?.name || selectedAtom.element}
              </h4>
              <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>
            <div className="space-y-1 text-xs text-purple-300">
              {selectedAtom.info?.atomic && <div><span className="text-purple-500">Atom raqami:</span> {selectedAtom.info.atomic}</div>}
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Atom massasi:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfiguratsiya:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.role}</div>}
              {selectedAtom.position && <div className="text-yellow-400 font-bold">📍 Pozitsiya: {selectedAtom.position}</div>}
              {selectedAtom.conformer && <div className="text-emerald-400 font-bold">🌀 Konformer: {selectedAtom.conformer}</div>}
              {selectedAtom.isDonor && <div className="mt-2 text-yellow-400 font-bold">⚡ Donor atomi</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">🌟 Markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[340px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>ℹ️</span> {system.title}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Formula</div>
                <div className="font-mono text-xl text-white text-center">{system.formula}</div>
              </div>

              <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/40">
                <div className="text-emerald-300 text-[10px] uppercase tracking-wide mb-1 font-bold">📊 Hozirgi holat</div>
                <div className="text-white text-sm font-bold">{nearestConformer.name}</div>
                <div className="text-emerald-100 text-[11px] mt-1">
                  φ = <span className="font-mono font-bold">{dihedralAngle.toFixed(1)}{currentSystem === "cyclohexane" || currentSystem === "CoenComplex" ? "" : "°"}</span>
                </div>
                <div className="text-emerald-100 text-[11px]">
                  E = <span className="font-mono font-bold">{currentEnergy.toFixed(2)} kJ/mol</span>
                </div>
                <div className="text-emerald-200 text-[10px] italic">{nearestConformer.stability}</div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">⚡ To'siq energiyasi</div>
                <div className="text-yellow-100 text-[11px]">
                  E<sub>a</sub> = <span className="font-mono font-bold">{system.barrierEnergy} kJ/mol</span>
                </div>
                <div className="text-yellow-200 text-[10px] mt-1">
                  Arrenius bo'yicha xona T da o'tish tezligi ≈ 10<sup>{(10 - system.barrierEnergy/5.7).toFixed(1)}</sup> s⁻¹
                </div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">📖 Tavsif</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">{system.description}</p>
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🧠 Nazariya</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">{system.theory}</p>
              </div>

              <div className="bg-pink-950/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 text-[10px] uppercase tracking-wide mb-1 font-bold">💼 Qo'llanilishi</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">{system.applications}</p>
              </div>
            </div>
          </div>
        )}

        {/* — ENERGIYA GRAFIGI PANELI — */}
        {activePanel === "energy" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-yellow-700/50 max-w-md w-[420px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-200 flex items-center gap-2 text-sm">
                <span>📈</span> Energiya profili
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <p className="text-yellow-100 text-[11px] leading-relaxed">
                  Buruq burchakni {system.dihedralRange[0]} dan {system.dihedralRange[1]} gacha o'zgartirganda energiya qanday o'zgarishi. Ko'k chiziq — hozirgi holat.
                </p>
              </div>

              <div className="bg-purple-950/60 rounded-lg p-3 border border-purple-700/40">
                <EnergyMiniChart
                  samples={energyProfile}
                  currentAngle={dihedralAngle}
                  range={system.dihedralRange}
                  barrier={system.barrierEnergy}
                  keyConfs={system.keyDihedrals}
                  systemId={currentSystem}
                  large={true}
                />
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-2">📊 Barcha konformerlar</div>
                <div className="space-y-1.5">
                  {system.keyDihedrals.map((k, i) => (
                    <button
                      key={i}
                      onClick={() => setDihedralAngle(k.angle)}
                      className="w-full flex items-center justify-between p-1.5 rounded hover:bg-purple-900/40 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: k.color }}></div>
                        <span className="text-[10px] text-white">{k.name}</span>
                      </div>
                      <span className="text-[10px] text-yellow-300 font-mono">{k.energy} kJ/mol</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">🔬 Arrenius tenglamasi</div>
                <div className="p-2 bg-blue-950/60 rounded font-mono text-[10px] text-white text-center">
                  k = A · exp(−E<sub>a</sub>/RT)
                </div>
                <p className="text-blue-100 text-[10px] leading-relaxed mt-2">
                  T = {temperature} K uchun bu tizimning konformer o'tish tezligi ≈ <span className="font-mono font-bold text-yellow-300">
                  {(1e12 * Math.exp(-system.barrierEnergy * 1000 / (R_GAS * temperature))).toExponential(2)}
                  </span> s⁻¹
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — NEWMAN PROYEKSIYASI PANELI — */}
        {activePanel === "newman" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>👁️</span> Newman proyeksiyasi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <p className="text-cyan-100 text-[11px] leading-relaxed">
                  <strong>Newman proyeksiyasi</strong> (Melvin Newman, 1955) — konformatsiyani C–C bog' bo'ylab qarab ko'rsatuvchi 2D diagramma. Old atom nuqta, orqa atom aylana ko'rinishida.
                </p>
              </div>

              {(currentSystem === "ethane" || currentSystem === "butane") ? (
                <div className="bg-purple-950/60 rounded-lg p-4 border border-purple-700/40 flex justify-center">
                  <NewmanProjection
                    dihedralDeg={dihedralAngle}
                    systemId={currentSystem}
                    size={280}
                  />
                </div>
              ) : (
                <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                  <p className="text-yellow-100 text-[10px]">
                    Newman proyeksiyasi faqat ochiq zanjirli molekulalar uchun ma'noli (etan, butan). Halqali va koordinatsion tizimlar uchun boshqa vizualizatsiya usullari qo'llaniladi (Haworth, chair-boat diagrammalari).
                  </p>
                </div>
              )}

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-2">📖 Legenda</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-purple-100">Old atom (C1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-pink-400"></div>
                    <span className="text-purple-100">Orqa atom (C2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-white"></div>
                    <span className="text-purple-100">Old bog'lar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-purple-400"></div>
                    <span className="text-purple-100">Orqa bog'lar</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/40 rounded-lg p-3 border border-emerald-700/40">
                <div className="text-emerald-300 font-bold text-[11px] mb-1">📝 Karplus tenglamasi</div>
                <div className="p-2 bg-emerald-950/60 rounded font-mono text-[10px] text-white text-center">
                  ³J(HH) = A·cos²(φ) + B·cos(φ) + C
                </div>
                <p className="text-emerald-100 text-[10px] leading-relaxed mt-2">
                  NMR spektroskopiyasida vicinal H–H bog'lanish konstantasi (³J) buruq burchakka bog'liq. Bu Newman proyeksiyasidagi φ burchagini eksperimental o'lchash imkonini beradi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — BOLTZMANN PANELI — */}
        {activePanel === "boltzmann" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-orange-700/50 max-w-md w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-orange-200 flex items-center gap-2 text-sm">
                <span>📊</span> Boltzmann taqsimoti
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <p className="text-orange-100 text-[11px] leading-relaxed">
                  <strong>Boltzmann statistikasi</strong> haroratda konformerlar orasidagi taqsimotni ko'rsatadi.
                </p>
                <div className="p-2 bg-orange-950/60 rounded font-mono text-[10px] text-white text-center mt-2">
                  N<sub>i</sub>/N<sub>j</sub> = exp(−ΔE<sub>ij</sub>/RT)
                </div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">🌡️ Harorat</div>
                <div className="text-white text-lg font-bold text-center">
                  {temperature} K
                  <span className="text-purple-400 text-sm font-normal ml-2">
                    ({(temperature - 273.15).toFixed(0)}°C)
                  </span>
                </div>
                <input
                  type="range"
                  min={100} max={500} step={5}
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full accent-orange-500 mt-2"
                />
                <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                  <span>100 K</span><span>298 K (xona)</span><span>500 K</span>
                </div>
                <div className="text-[10px] text-orange-300 text-center mt-1">
                  RT = <span className="font-mono">{(R_GAS * temperature / 1000).toFixed(2)} kJ/mol</span>
                </div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-2">📊 Konformerlar taqsimoti</div>
                <div className="space-y-2">
                  {boltzmannData.map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-white truncate">{b.name}</span>
                        <span className="font-mono font-bold" style={{ color: b.color }}>
                          {b.population.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-purple-950/60 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${b.population}%`,
                            backgroundColor: b.color
                          }}
                        />
                      </div>
                      <div className="text-[9px] text-purple-400 mt-0.5">
                        ΔE = {b.energy} kJ/mol
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[10px] mb-1">💡 Xulosa</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">
                  {temperature <= 150 ? "Past haroratda deyarli faqat eng barqaror konformer mavjud." :
                   temperature <= 350 ? "Xona haroratida bir necha konformer muvozanatda uchraydi." :
                   "Yuqori haroratda barcha konformerlar deyarli teng nisbatda taqsimlanadi."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Kashfiyot tarixi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{system.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1890 — Hermann Sachse</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Bonn universitetida sikloheksanning kreslo va vanna konformatsiyalarini birinchi bo'lib nazariy tarzda taklif qildi.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1918 — Ernst Mohr</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">Sachse nazariyasini qayta tikladi va halqali molekulalarning stereokimyoviy asosini yaratdi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1936 — Kemp va Pitzer</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Etandagi aylanish to'sig'ining 12.6 kJ/mol ekanligini termodinamik usullarda aniqladilar. 'To'siqsiz aylanish' gipotezasini rad etdi.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1943 — Odd Hassel</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">Norvegiyada elektron difraksiya orqali sikloheksanning kreslo formasi ustunligini tasdiqladi. Bu ish uchun 1969-yilda Kimyo bo'yicha Nobel mukofoti oldi.</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1955 — Melvin Newman</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Ohio State universitetida Newman proyeksiyasini taklif qildi — konformatsiyani ko'rsatishning eng oson va tez tarqalgan usuli.</p>
              </div>

              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-cyan-300 font-bold text-[11px]">1959 — Corey va Bailar</div>
                <p className="text-cyan-200 text-[10px] leading-relaxed">Koordinatsion komplekslardagi xelat halqa konformatsiyalarini sistematik ravishda tavsifladilar. lel/ob nomlanishi yaratildi.</p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1969 — Barton, Hassel Nobel</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Derek Barton (Angliya) va Odd Hassel (Norvegiya) "molekulalarning konformatsion tushunchasi va uni kimyoda qo'llash uchun" Kimyo Nobel mukofotini oldilar.</p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-emerald-300 font-bold text-[11px]">2001 — Pophristic, Goodman</div>
                <p className="text-emerald-200 text-[10px] leading-relaxed">Rutgers universitetida Nature jurnalida etandagi aylanish to'sig'ining asosiy sababini aniqladilar: bu sterik itarilish emas, giperkonjugatsiya (σ→σ* orbital o'zaro ta'siri)!</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Konformatsion izomeriya nima?"
                a="Molekuladagi yakka σ-bog'lanish atrofidagi aylanish natijasida hosil bo'ladigan turli fazoviy tuzilishlar. Bu konformerlar past energetik to'siq bilan bir-biriga o'tadi (<20 kJ/mol) va xona haroratida tez muvozanatda bo'ladi."
              />
              <TestQuestion
                q="Etandagi aylanish to'sig'ining qiymati qancha va uning kelib chiqishi nima?"
                a="12.6 kJ/mol. Pophristic va Goodman (2001) ga ko'ra asosiy sabab — sterik itarilish emas, giperkonjugatsiya (σ(C–H) → σ*(C–H) orbital o'zaro ta'siri). Zinapoya (staggered) holatda bu ta'sir maksimal."
              />
              <TestQuestion
                q="Butanda qaysi konformatsiya eng barqaror?"
                a="Anti-konformatsiya (φ = 180°) — ikki metil guruh maksimal masofada. Gauche (60°) 3.8 kJ/mol yuqori, chunki metil-metil sterik xalallik bor."
              />
              <TestQuestion
                q="Sikloheksan uchun eng barqaror forma qanday?"
                a="Kreslo (chair). Baeyer tarangligi va Pitzer buruq to'siqlari nolga teng. Har C–C–C burchagi 109.5° (ideal tetraedrik), barcha C–H bog'lari zinapoya (staggered) holatda."
              />
              <TestQuestion
                q="Sikloheksan kreslodagi ekvatorial va eksial pozitsiyalar farqi nima?"
                a="Har C atomida 1 ekvatorial (halqa tekisligiga parallel) va 1 eksial (halqaga perpendikulyar) H bor. Hajmli guruhlar ekvatorial pozitsiyada bo'lganda sterik jihatdan afzal (1,3-diaksial itarilish yo'q)."
              />
              <TestQuestion
                q="[Co(en)₃]³⁺ da 'lel' va 'ob' nima?"
                a="lel — xelat halqaning C–C aksi Co ning C₃ o'qiga PARALLEL. ob — OBLIQ (qiya). lel₃ eng barqaror shakl (Δ-lel₃ da 42% Boltzmann taqsimoti xona haroratida)."
              />
              <TestQuestion
                q="Newman proyeksiyasi nima?"
                a="C–C bog' bo'ylab qarab molekulani 2D ko'rsatuvchi diagramma (Melvin Newman, 1955). Old atom nuqta, orqa atom aylana ko'rinishida. To'silgan/zinapoya holatlarini oson ko'rish imkonini beradi."
              />
              <TestQuestion
                q="Boltzmann taqsimoti nima uchun muhim?"
                a="Konformerlar o'rtasidagi taqsimotni ma'lum haroratda hisoblash imkonini beradi. N₁/N₂ = exp(−ΔE/RT). Xona T (298 K) da RT ≈ 2.48 kJ/mol, shuning uchun 2-3 kJ/mol energiya farqi ~ 70/30% taqsimotga olib keladi."
              />
              <TestQuestion
                q="Karplus tenglamasi nima uchun ishlatiladi?"
                a="NMR spektroskopiyada vicinal ³J(HH) bog'lanish konstantasi buruq burchakka bog'liq: J = A·cos²φ + B·cosφ + C. Bu tenglamadan foydalanib eksperimental φ ni aniqlash mumkin (masalan, oqsillarda Ramachandran maydonlarini o'lchash)."
              />
            </div>
          </div>
        )}

        {/* — PDF MODAL — */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPdfModalOpen(false)}>
            <div className="bg-purple-950 rounded-2xl border border-purple-600/50 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50">
                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                  <span>📄</span> PDF hisobot yaratish
                </h3>
                <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs text-purple-400 mb-2">Qaysi bo'limlarni PDFga qo'shishni tanlang:</p>
                {[
                  { k: "intro", label: "1. Kirish — konformatsion izomeriya", icon: "📖" },
                  { k: "theory", label: "2. Nazariy asoslar", icon: "🧠" },
                  { k: "structures", label: "3. Konformerlar tavsifi", icon: "🔬" },
                  { k: "energy", label: "4. Energiya profili va to'siq", icon: "📈" },
                  { k: "boltzmann", label: "5. Boltzmann taqsimoti", icon: "📊" },
                  { k: "newman", label: "6. Newman proyeksiyasi", icon: "👁️" },
                  { k: "applications", label: "7. Amaliy qo'llanilishi", icon: "💼" },
                  { k: "table", label: "8. Konformerlar jadvali", icon: "📊" },
                  { k: "references", label: "9. Adabiyotlar", icon: "📚" }
                ].map(({ k, label, icon }) => (
                  <label key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfSections[k]}
                      onChange={(e) => setPdfSections({ ...pdfSections, [k]: e.target.checked })}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm text-purple-200">{label}</span>
                  </label>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-purple-800/50 flex gap-2 justify-end">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200"
                  disabled={pdfGenerating}
                >Bekor qilish</button>
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                >
                  {pdfGenerating ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Yaratilmoqda...</>
                  ) : (
                    <>📄 PDFni yuklab olish</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASTKI RANG LEGENDA */}
      {!fullscreenMode && (
        <div className="flex justify-center gap-3 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#909090]"></div><span className="text-purple-300">C</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#44ff88]"></div><span className="text-purple-300">lel konformer</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#ff8844]"></div><span className="text-purple-300">ob konformer</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#66ffaa]"></div><span className="text-purple-300">Dihedral yoy</span></div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(88, 28, 135, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ENERGIYA MINI-CHART (SVG)
// ═══════════════════════════════════════════════════════════════════════════
function EnergyMiniChart({ samples, currentAngle, range, barrier, keyConfs, systemId, large = false }) {
  const width = large ? 380 : 270
  const height = large ? 200 : 120
  const padding = { top: 15, right: 10, bottom: 25, left: 30 }
  const w = width - padding.left - padding.right
  const h = height - padding.top - padding.bottom

  const [minA, maxA] = range
  const maxE = Math.max(barrier * 1.1, 5)

  const xScale = (a) => padding.left + ((a - minA) / (maxA - minA)) * w
  const yScale = (e) => padding.top + h - (e / maxE) * h

  // Path
  const pathData = samples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.angle).toFixed(1)} ${yScale(s.energy).toFixed(1)}`).join(' ')

  const currentE = samples.reduce((best, s) => Math.abs(s.angle - currentAngle) < Math.abs(best.angle - currentAngle) ? s : best, samples[0])

  return (
    <svg width={width} height={height} className="w-full">
      {/* Grid */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + h} stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.5" />
      <line x1={padding.left} y1={padding.top + h} x2={padding.left + w} y2={padding.top + h} stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.5" />

      {/* Y-axis label */}
      <text x={5} y={padding.top + 8} fill="#a78bfa" fontSize="9">kJ/mol</text>
      <text x={5} y={padding.top + h - 2} fill="#a78bfa" fontSize="9">0</text>
      <text x={5} y={padding.top + 4} fill="#a78bfa" fontSize="9">{maxE.toFixed(0)}</text>

      {/* X-axis label */}
      {systemId === "cyclohexane" || systemId === "CoenComplex" ? (
        <text x={width/2} y={height - 5} fill="#a78bfa" fontSize="9" textAnchor="middle">Konformatsion koordinat</text>
      ) : (
        <text x={width/2} y={height - 5} fill="#a78bfa" fontSize="9" textAnchor="middle">Buruq burchak φ (°)</text>
      )}

      {/* Path */}
      <path d={pathData} fill="none" stroke="#ffcc66" strokeWidth="2" />

      {/* Key conformers */}
      {keyConfs.map((k, i) => {
        const cx = xScale(k.angle)
        const cy = yScale(k.energy)
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3" fill={k.color} stroke="white" strokeWidth="0.5" />
            {large && (
              <text x={cx} y={cy - 8} fill={k.color} fontSize="8" textAnchor="middle" fontWeight="bold">
                {k.nameEn.split(' ')[0]}
              </text>
            )}
          </g>
        )
      })}

      {/* Current angle marker */}
      <line
        x1={xScale(currentAngle)} y1={padding.top}
        x2={xScale(currentAngle)} y2={padding.top + h}
        stroke="#66ffaa" strokeWidth="1.5" strokeDasharray="3,2"
      />
      <circle cx={xScale(currentAngle)} cy={yScale(currentE.energy)} r="4" fill="#66ffaa" stroke="white" strokeWidth="1" />
      <text x={xScale(currentAngle) + 6} y={yScale(currentE.energy) + 3} fill="#66ffaa" fontSize="9" fontWeight="bold">
        {currentE.energy.toFixed(1)}
      </text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWMAN PROYEKSIYASI (SVG)
// ═══════════════════════════════════════════════════════════════════════════
function NewmanProjection({ dihedralDeg, systemId, size = 180 }) {
  const cx = size / 2
  const cy = size / 2
  const rBack = size * 0.35  // orqa aylana radius
  const rFront = 3            // old nuqta radius
  const lFront = size * 0.35  // old bog' uzunligi (nuqtadan)
  const lBack = size * 0.4    // orqa bog' uzunligi (aylanadan tashqariga)

  const phi = dihedralDeg * Math.PI / 180

  // Old atomdan 3 ta bog' (etan/butanda)
  // Old: 0°, 120°, 240° (standart)
  // Orqa: dihedral offset bilan
  const frontAngles = [90, 210, 330]  // yuqoriga, chap-past, o'ng-past
  const backAngles = frontAngles.map(a => a + dihedralDeg)

  const frontColors = systemId === "butane" ? ["#909090", "#FFFFFF", "#FFFFFF"] : ["#FFFFFF", "#FFFFFF", "#FFFFFF"]
  const backColors = systemId === "butane" ? ["#909090", "#FFFFFF", "#FFFFFF"] : ["#FFFFFF", "#FFFFFF", "#FFFFFF"]
  const frontLabels = systemId === "butane" ? ["CH₃", "H", "H"] : ["H", "H", "H"]
  const backLabels = systemId === "butane" ? ["CH₃", "H", "H"] : ["H", "H", "H"]

  return (
    <svg width={size} height={size} className="rounded bg-purple-950/60">
      {/* Orqa aylana */}
      <circle
        cx={cx} cy={cy} r={rBack}
        fill="none"
        stroke="#ff88dd"
        strokeWidth="2"
      />
      {/* Orqa bog'lar */}
      {backAngles.map((a, i) => {
        const rad = a * Math.PI / 180
        const x1 = cx + rBack * Math.cos(rad)
        const y1 = cy + rBack * Math.sin(rad)
        const x2 = cx + (rBack + lBack) * Math.cos(rad)
        const y2 = cy + (rBack + lBack) * Math.sin(rad)
        return (
          <g key={`b${i}`}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#a78bfa" strokeWidth="2"
            />
            <circle cx={x2} cy={y2} r={size * 0.05}
              fill={backColors[i]} stroke="#a78bfa" strokeWidth="1" />
            <text
              x={x2 + Math.cos(rad) * size * 0.09}
              y={y2 + Math.sin(rad) * size * 0.09 + 3}
              fill="#ff88dd" fontSize={size * 0.055} textAnchor="middle" fontWeight="bold"
            >{backLabels[i]}</text>
          </g>
        )
      })}
      {/* Old bog'lar */}
      {frontAngles.map((a, i) => {
        const rad = a * Math.PI / 180
        const x2 = cx + lFront * Math.cos(rad)
        const y2 = cy + lFront * Math.sin(rad)
        return (
          <g key={`f${i}`}>
            <line
              x1={cx} y1={cy} x2={x2} y2={y2}
              stroke="#ffffff" strokeWidth="2.5"
            />
            <circle cx={x2} cy={y2} r={size * 0.05}
              fill={frontColors[i]} stroke="#88ccff" strokeWidth="1" />
            <text
              x={x2 + Math.cos(rad) * size * 0.09}
              y={y2 + Math.sin(rad) * size * 0.09 + 3}
              fill="#88ccff" fontSize={size * 0.055} textAnchor="middle" fontWeight="bold"
            >{frontLabels[i]}</text>
          </g>
        )
      })}
      {/* Markaziy nuqta (old atom) */}
      <circle cx={cx} cy={cy} r={size * 0.04} fill="#88ccff" stroke="white" strokeWidth="1" />

      {/* Burchak yorlig'i */}
      <text x={cx} y={size - 5} fill="#66ffaa" fontSize="11" textAnchor="middle" fontWeight="bold">
        φ = {dihedralDeg.toFixed(0)}°
      </text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// KICHIK KOMPONENT: Test savoli
// ═══════════════════════════════════════════════════════════════════════════
function TestQuestion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-cyan-950/30 rounded-lg border border-cyan-800/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 hover:bg-cyan-900/30 transition-colors flex items-start gap-2"
      >
        <span className="text-cyan-400 flex-shrink-0">❓</span>
        <span className="text-cyan-100 text-[11px] leading-relaxed">{q}</span>
        <span className="ml-auto text-cyan-500 text-xs flex-shrink-0">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-cyan-950/50 border-t border-cyan-800/40">
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <span className="text-green-100 text-[11px] leading-relaxed">{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}
