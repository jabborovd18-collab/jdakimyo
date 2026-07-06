"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Cr: 0x8A99C7, Co: 0xF090A0, Ni: 0x50D050, Fe: 0xE06633,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094,
  S: 0xFFFF30, K: 0x8F40D4, Na: 0xAB5CF2,
  bond: 0x8B9DC3, hbond: 0x66CCFF, highlight: 0xFFD700,
  crystalWater: 0xAAAAFF   // Kristallizatsiya suvi uchun ko'k rang
}

// ═══════════════════════════════════════════════════════════════════════════
// GIDRAT IZOMERLAR DATABASE
// ═══════════════════════════════════════════════════════════════════════════
// Ichki (inner) sfera — koordinatsion bog'langan ligandlar
// Tashqi (outer) sfera — kristall panjaraga kirmagan ionlar/molekulalar
// Kristall suv — panjarada bo'sh joylarni to'ldiruvchi H₂O
// ═══════════════════════════════════════════════════════════════════════════
const HYDRATE_ISOMERS = {
  // ── 1. Klassik Werner uchligi: CrCl₃·6H₂O ────────────────
  CrCl3_6H2O: {
    id: "CrCl3_6H2O",
    title: "Werner uchligi — CrCl₃·6H₂O",
    empiricalFormula: "CrCl₃·6H₂O",
    center: { element: "Cr", color: CPK.Cr, radius: 0.42, charge: "+3", oxidation: 3, dElectrons: 3 },
    // 3 xil izomer
    variants: [
      {
        id: "A", key: "hexaaqua",
        formula: "[Cr(H₂O)₆]Cl₃",
        name: "Geksaakvaxrom(III) xlorid",
        color: "Binafsha (deep violet)",
        colorHex: "#6b3fa0",
        innerLigands: 6,     // 6 ta H₂O ichkida
        outerCl: 3,           // 3 ta Cl⁻ tashqarida
        crystalH2O: 0,        // 0 ta kristall suv
        agNO3Test: "3 mol AgCl cho'kadi (3 Cl⁻ tashqarida)",
        conductivity: "≈ 405 S·cm²·mol⁻¹ (1:3 elektrolit — 4 ion)",
        wavelength: "573 nm (yashil yorug'likni yutadi)"
      },
      {
        id: "B", key: "pentaaqua",
        formula: "[Cr(H₂O)₅Cl]Cl₂·H₂O",
        name: "Pentaakvaxlorоxrom(III) xlorid gidrat",
        color: "Och-yashil (light green)",
        colorHex: "#a4d09c",
        innerLigands: 6,     // 5 H₂O + 1 Cl ichkida
        innerCl: 1,
        outerCl: 2,           // 2 ta Cl⁻ tashqarida
        crystalH2O: 1,        // 1 ta kristall suv
        agNO3Test: "2 mol AgCl cho'kadi (2 Cl⁻ tashqarida)",
        conductivity: "≈ 260 S·cm²·mol⁻¹ (1:2 elektrolit — 3 ion)",
        wavelength: "600 nm (qizil-sariq yutadi)"
      },
      {
        id: "C", key: "tetraaqua",
        formula: "[Cr(H₂O)₄Cl₂]Cl·2H₂O",
        name: "Tetraakvadixlorоxrom(III) xlorid digidrat",
        color: "To'q yashil (dark green)",
        colorHex: "#2d6b3f",
        innerLigands: 6,     // 4 H₂O + 2 Cl ichkida
        innerCl: 2,
        outerCl: 1,           // 1 ta Cl⁻ tashqarida
        crystalH2O: 2,        // 2 ta kristall suv
        agNO3Test: "1 mol AgCl cho'kadi (faqat 1 Cl⁻ tashqarida)",
        conductivity: "≈ 105 S·cm²·mol⁻¹ (1:1 elektrolit — 2 ion)",
        wavelength: "630 nm (qizil yutadi)"
      }
    ],
    discovery: "1893-yilda Alfred Werner (Sürix universiteti) CrCl₃·6H₂O tarkibli birikmadan uch xil rangdagi kristallarni ajratdi: binafsha, och-yashil va to'q-yashil. Werner ularni koordinatsion nazariya asosida tushuntirdi va ichki hamda tashqi koordinatsion sferalarni farqladi. Bu — koordinatsion kimyoning shakllanish nuqtasi bo'ldi.",
    experiment: "AgNO₃ TITRLASH TAJRIBASI: har uch izomerni suvda eritib, ustiga AgNO₃ eritmasini quyilsa, faqat tashqi sferadagi Cl⁻ ionlari darhol AgCl (oq cho'kma) hosil qiladi. Ichki sferada koordinatsion bog'langan Cl⁻ — sekin yoki umuman ajralmaydi.",
    conductometry: "Elektr o'tkazuvchanlik molyar konsentratsiyaga qarab 405 → 260 → 105 S·cm²·mol⁻¹ pasayadi. Bu — eritmadagi erkin ionlar sonining 4 → 3 → 2 ga kamayishi bilan izohlanadi (Werner qonuni).",
    thermodynamics: "Ichki sferada Cr–Cl bog'lanish energetik jihatdan (Cl⁻ ligand maydonining kuchi Δo≈ 13600 cm⁻¹) H₂O (17400 cm⁻¹) dan pastroq. Shuning uchun binafsha [Cr(H₂O)₆]³⁺ eng barqaror shakl. Isitilsa yashil formalarga o'tadi (H₂O → Cl⁻ almashinish)."
  },

  // ── 2. Co(III) gidrat izomer ───────────────────────────
  CoNH3Cl: {
    id: "CoNH3Cl",
    title: "Kobalt(III) gidrat izomeri",
    empiricalFormula: "[Co(NH₃)₄(H₂O)Cl]Cl₂",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3", oxidation: 3, dElectrons: 6 },
    variants: [
      {
        id: "A", key: "aqua-chloro-out",
        formula: "[Co(NH₃)₄(H₂O)Cl]Cl₂",
        name: "Akvaxlorotetraamminkobalt(III) xlorid",
        color: "Qizil-binafsha",
        colorHex: "#a4326b",
        innerLigands: 6, innerCl: 1,
        outerCl: 2, crystalH2O: 0,
        agNO3Test: "2 mol AgCl cho'kadi",
        conductivity: "≈ 260 S·cm²·mol⁻¹ (1:2 elektrolit)",
        wavelength: "550 nm"
      },
      {
        id: "B", key: "dichloro-water-crystal",
        formula: "[Co(NH₃)₄Cl₂]Cl·H₂O",
        name: "Dixlorotetraamminkobalt(III) xlorid monogidrat",
        color: "Yashil",
        colorHex: "#4a9d5e",
        innerLigands: 6, innerCl: 2,
        outerCl: 1, crystalH2O: 1,
        agNO3Test: "1 mol AgCl cho'kadi",
        conductivity: "≈ 105 S·cm²·mol⁻¹ (1:1 elektrolit)",
        wavelength: "620 nm"
      }
    ],
    discovery: "1900-yillarda Werner shogirdlari Co(III) uchun ham gidrat izomeriya mavjudligini tasdiqlashdi. Bu Cr(III) kabi klassik gidrat izomeriya oilasidan biri.",
    experiment: "AgNO₃ testi bilan tashqi sferadagi Cl⁻ soni aniqlanadi. Ichki sferadagi Cl⁻ va H₂O bog'lanish barqarorligi ligand maydoni nazariyasi orqali tushuntiriladi.",
    conductometry: "1:2 vs 1:1 elektrolit farqi konduktometrik titrlashda aniq ko'rinadi.",
    thermodynamics: "Co(III) — d⁶ past-spin (LS), juda inert. Ligand almashinish soatlab yoki kunlab davom etadi. Bu izomerlarni sof ajratib olishga imkon beradi."
  },

  // ── 3. Ni-Cl-Br gidrat izomer ──────────────────────────
  NiClBr: {
    id: "NiClBr",
    title: "Nikel gidrat izomeri (Cl/Br)",
    empiricalFormula: "[Ni(H₂O)₅Cl]Br va [Ni(H₂O)₅Br]Cl",
    center: { element: "Ni", color: CPK.Ni, radius: 0.42, charge: "+2", oxidation: 2, dElectrons: 8 },
    variants: [
      {
        id: "A", key: "cl-inner",
        formula: "[Ni(H₂O)₅Cl]Br",
        name: "Pentaakvaxloronikkel(II) bromid",
        color: "Yashil",
        colorHex: "#5fbd6b",
        innerLigands: 6, innerCl: 1, innerBr: 0,
        outerCl: 0, outerBr: 1, crystalH2O: 0,
        agNO3Test: "1 mol AgBr cho'kadi (Br⁻ tashqarida)",
        conductivity: "≈ 110 S·cm²·mol⁻¹",
        wavelength: "395 va 720 nm"
      },
      {
        id: "B", key: "br-inner",
        formula: "[Ni(H₂O)₅Br]Cl",
        name: "Pentaakvabromonikkel(II) xlorid",
        color: "To'q-yashil",
        colorHex: "#3a8a4a",
        innerLigands: 6, innerCl: 0, innerBr: 1,
        outerCl: 1, outerBr: 0, crystalH2O: 0,
        agNO3Test: "1 mol AgCl cho'kadi (Cl⁻ tashqarida)",
        conductivity: "≈ 108 S·cm²·mol⁻¹",
        wavelength: "410 va 735 nm"
      }
    ],
    discovery: "Aralash galogen komplekslari gidrat izomeriya nafaqat H₂O ↔ koordinatsion sfera almashinuvida, balki turli galogenlar orasida ham namoyon bo'lishini ko'rsatadi.",
    experiment: "AgNO₃ tanlab reaksiyaga kirishadi: agar tashqarida Br⁻ bo'lsa AgBr (sarg'ish oq cho'kma), agar Cl⁻ bo'lsa AgCl (sof oq cho'kma). Cho'kmaning rangi va eruvchanligi ionni aniqlash imkoniyatini beradi.",
    conductometry: "Ikkala izomer ham 1:1 elektrolit, konduktivligi juda yaqin (≈ 108–110). Ammo ionoselektiv elektrodlar bilan ajratish mumkin.",
    thermodynamics: "Br⁻ ligand maydoni Cl⁻ dan pastroq (spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O). Shuning uchun [Ni(H₂O)₅Cl]Br izomeri termodinamik jihatdan barqarorroq."
  },

  // ── 4. Interaktiv AgNO₃ tajriba (Werner ning original tajribasi) ──
  WernerExperiment: {
    id: "WernerExperiment",
    title: "Werner-ning AgNO₃ tajribasi",
    empiricalFormula: "CrCl₃·6H₂O uch izomeri",
    center: { element: "Cr", color: CPK.Cr, radius: 0.42, charge: "+3", oxidation: 3, dElectrons: 3 },
    isExperiment: true,
    variants: [
      {
        id: "A", key: "violet-Werner",
        formula: "[Cr(H₂O)₆]Cl₃",
        name: "Binafsha izomer — 3 AgCl",
        color: "Binafsha",
        colorHex: "#6b3fa0",
        innerLigands: 6, innerCl: 0,
        outerCl: 3, crystalH2O: 0,
        agNO3Test: "3 mol AgCl (tez cho'kma — oq)",
        conductivity: "405 S·cm²·mol⁻¹",
        wavelength: "573 nm"
      },
      {
        id: "B", key: "lightgreen-Werner",
        formula: "[Cr(H₂O)₅Cl]Cl₂·H₂O",
        name: "Och-yashil — 2 AgCl",
        color: "Och yashil",
        colorHex: "#a4d09c",
        innerLigands: 6, innerCl: 1,
        outerCl: 2, crystalH2O: 1,
        agNO3Test: "2 mol AgCl (o'rtacha)",
        conductivity: "260 S·cm²·mol⁻¹",
        wavelength: "600 nm"
      },
      {
        id: "C", key: "darkgreen-Werner",
        formula: "[Cr(H₂O)₄Cl₂]Cl·2H₂O",
        name: "To'q-yashil — 1 AgCl",
        color: "To'q yashil",
        colorHex: "#2d6b3f",
        innerLigands: 6, innerCl: 2,
        outerCl: 1, crystalH2O: 2,
        agNO3Test: "1 mol AgCl (kam cho'kma)",
        conductivity: "105 S·cm²·mol⁻¹",
        wavelength: "630 nm"
      }
    ],
    discovery: "Werner 1893-1911 yillarda gravimetrik tahlil orqali har izomerdan turli miqdorda AgCl cho'kishini o'lchagan. Bu tajriba koordinatsion nazariyaning eng aniq tajribaviy isboti bo'lgan.",
    experiment: "Har bir izomer eritmasiga AgNO₃ qo'shilganda, faqat tashqi sferadagi Cl⁻ ionlari darhol AgCl hosil qiladi. Ichki sferadagi Cl⁻ ionlari koordinatsion bog'langani uchun reaksiyaga tez kirishmaydi.",
    conductometry: "Werner konduktivlikni ham o'lchagan: 405 → 260 → 105 pasayish eritmadagi ionlar sonining kamayishini ko'rsatdi (van't Hoff faktori: i ≈ 4, 3, 2).",
    thermodynamics: "Bu tajriba Blomstrand-Jorgensen 'zanjir nazariyasi'ni rad etib, Werner nazariyasini qat'iy tasdiqladi. 1913-yilda Werner Nobel mukofoti oldi."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d³ 4s¹", oxidation: "+3", role: "Markaziy ion (d³)", color: "#8A99C7" },
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶ LS)", color: "#F090A0" },
  Ni: { name: "Nikel (Ni)", atomic: 28, mass: "58.69 u", config: "[Ar] 3d⁸ 4s²", oxidation: "+2", role: "Markaziy ion (d⁸)", color: "#50D050" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃ donor", hybridization: "sp³", color: "#3050F8" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "H₂O donor (ichki/tashqi)", hybridization: "sp³", color: "#FF0D0D" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "H₂O va NH₃ tarkibi", color: "#FFFFFF" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Ichki yoki tashqi sfera ioni", color: "#1FF01F" },
  Br: { name: "Brom (Br⁻)", atomic: 35, mass: "79.90 u", config: "[Ar] 3d¹⁰ 4s² 4p⁶", charge: "-1", role: "Ichki yoki tashqi sfera ioni", color: "#A62929" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
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
export default function GidratIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const moleculeGroupRef = useRef(null)      // Barcha molekulalar guruhi
  const innerSphereRef = useRef(null)         // Ichki sfera vizualizatsiya
  const outerSphereRef = useRef(null)         // Tashqi sfera vizualizatsiya
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const hBondsRef = useRef([])
  const outerIonsRef = useRef([])
  const crystalWaterRef = useRef([])
  const agno3AnimRef = useRef({ active: false, progress: 0, phase: 0 })
  const highlightsRef = useRef([])

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("CrCl3_6H2O")
  const [currentVariant, setCurrentVariant] = useState("A")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showInnerSphere, setShowInnerSphere] = useState(true)
  const [showOuterSphere, setShowOuterSphere] = useState(true)
  const [showHBonds, setShowHBonds] = useState(false)
  const [showCrystalWater, setShowCrystalWater] = useState(true)
  const [runAgNO3, setRunAgNO3] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, wernerExp: true, structure: true, agno3: true,
    conductometry: true, thermodynamics: true, applications: true, table: true, references: true
  })

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
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
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

  const system = HYDRATE_ISOMERS[currentSystem]
  const variant = system.variants.find(v => v.id === currentVariant) || system.variants[0]

  // ═══════════════════════════════════════════════════════════
  // BOG'LANISH YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.06, opacity = 0.75) => {
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

  // Uzuq-uzuq chiziq (dashed line) — H-bog'lanish yoki tashqi sfera uchun
  const createDashedLine = useCallback((parent, start, end, color = CPK.hbond, dashSize = 0.15, gapSize = 0.1) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const segCount = Math.floor(length / (dashSize + gapSize))
    const dir = direction.clone().normalize()
    for (let i = 0; i < segCount; i++) {
      const s = start.clone().add(dir.clone().multiplyScalar(i * (dashSize + gapSize)))
      const e = s.clone().add(dir.clone().multiplyScalar(dashSize))
      const geo = new THREE.CylinderGeometry(0.025, 0.025, dashSize, 8)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(s).add(e).multiplyScalar(0.5)
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone())
      parent.add(mesh)
      hBondsRef.current.push(mesh)
    }
  }, [])

  // ═══════════════════════════════════════════════════════════
  // H₂O MOLEKULASI (koordinatsion yoki kristall)
  // ═══════════════════════════════════════════════════════════
  const createH2O = useCallback((parent, oPos, centerPos, showH, isCrystal = false, isHighlight = false) => {
    const group = new THREE.Group()
    const oGeo = new THREE.SphereGeometry(isCrystal ? 0.22 : 0.24, 32, 32)
    const emissiveColor = isHighlight ? CPK.highlight : (isCrystal ? CPK.crystalWater : CPK.O)
    const oMat = new THREE.MeshStandardMaterial({
      color: isCrystal ? CPK.crystalWater : CPK.O,
      roughness: 0.3, metalness: 0.2,
      emissive: emissiveColor,
      emissiveIntensity: isHighlight ? 0.5 : (isCrystal ? 0.25 : 0.15),
      transparent: isCrystal,
      opacity: isCrystal ? 0.75 : 1.0
    })
    const oMesh = new THREE.Mesh(oGeo, oMat)
    oMesh.position.copy(oPos)
    oMesh.userData = {
      type: 'atom', element: 'O',
      info: ATOM_INFO.O,
      ligandName: isCrystal ? 'Kristall suv (H₂O)' : 'Koordinatsion H₂O',
      sphere: isCrystal ? 'crystal' : 'inner',
      isDonor: !isCrystal
    }
    group.add(oMesh)
    atomsRef.current.push(oMesh)

    // Ichki sfera H₂O bog'lanadi
    if (!isCrystal && centerPos) {
      createBond(group, centerPos, oPos, CPK.bond, 0.06)
    }

    if (showH) {
      // H2O: 104.5° burchak
      let outward, perp
      if (isCrystal) {
        // Kristall suv — tasodifiy yo'nalishda
        outward = new THREE.Vector3(1, 0.3, 0.2).normalize()
        perp = new THREE.Vector3(0, 1, 0)
      } else {
        outward = oPos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      }
      // H2O burchagi ≈ 104.5°, ya'ni O-H bog' O'dan outward orqasiga chiqadi
      const angleHalf = (104.5 / 2) * (Math.PI / 180)
      ;[+1, -1].forEach(sign => {
        // H — O'dan outward'ga qarshi va perpga siljigan
        const hDir = outward.clone().multiplyScalar(-Math.cos(angleHalf))
          .add(perp.clone().multiplyScalar(Math.sin(angleHalf) * sign))
        const hPos = oPos.clone().add(hDir.multiplyScalar(0.96))
        const hGeo = new THREE.SphereGeometry(0.11, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({
          color: CPK.H,
          roughness: 0.5, metalness: 0.1,
          transparent: isCrystal, opacity: isCrystal ? 0.85 : 1.0
        })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = {
          type: 'atom', element: 'H',
          info: ATOM_INFO.H,
          ligandName: isCrystal ? 'Kristall H₂O tarkibi' : 'Koordinatsion H₂O tarkibi',
          sphere: isCrystal ? 'crystal' : 'inner'
        }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, oPos, hPos, 0x666677, 0.03, isCrystal ? 0.4 : 0.55)
      })
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // NH₃ ligand (Co uchun)
  // ═══════════════════════════════════════════════════════════
  const createNH3 = useCallback((parent, nPos, centerPos, showH) => {
    const group = new THREE.Group()
    const nGeo = new THREE.SphereGeometry(0.24, 32, 32)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NH₃', sphere: 'inner' }
    group.add(nMesh)
    atomsRef.current.push(nMesh)
    createBond(group, centerPos, nPos, CPK.bond, 0.06)
    if (showH) {
      const outward = nPos.clone().sub(centerPos).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const perp1 = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      const perp2 = new THREE.Vector3().crossVectors(outward, perp1).normalize()
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3
        const hDir = outward.clone().multiplyScalar(0.32)
          .add(perp1.clone().multiplyScalar(0.38 * Math.cos(angle)))
          .add(perp2.clone().multiplyScalar(0.38 * Math.sin(angle)))
        const hPos = nPos.clone().add(hDir)
        const hGeo = new THREE.SphereGeometry(0.11, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: 'NH₃ tarkibi', sphere: 'inner' }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Cl⁻ / Br⁻ ligand (ichki koordinatsion sferada)
  // ═══════════════════════════════════════════════════════════
  const createHalideInner = useCallback((parent, pos, centerPos, halide = "Cl") => {
    const color = halide === "Cl" ? CPK.Cl : CPK.Br
    const radius = halide === "Cl" ? 0.32 : 0.38
    const geo = new THREE.SphereGeometry(radius, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.3, metalness: 0.2, emissive: color, emissiveIntensity: 0.15
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = {
      type: 'atom', element: halide,
      info: ATOM_INFO[halide],
      ligandName: `${halide}⁻ (ichki sfera — koordinatsion bog'langan)`,
      sphere: 'inner',
      isDonor: true
    }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    createBond(parent, centerPos, pos, halide === "Cl" ? 0x448844 : 0x884444, 0.06)
    return mesh
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Tashqi sfera ionlari (Cl⁻ / Br⁻ — kristall panjaraga tarqalgan)
  // ═══════════════════════════════════════════════════════════
  const createHalideOuter = useCallback((parent, pos, halide = "Cl", isHighlight = false) => {
    const color = halide === "Cl" ? CPK.Cl : CPK.Br
    const radius = halide === "Cl" ? 0.34 : 0.40
    const geo = new THREE.SphereGeometry(radius, 32, 32)
    const emissive = isHighlight ? CPK.highlight : color
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4, metalness: 0.2,
      emissive,
      emissiveIntensity: isHighlight ? 0.7 : 0.2,
      transparent: true,
      opacity: 0.9
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = {
      type: 'atom', element: halide,
      info: ATOM_INFO[halide],
      ligandName: `${halide}⁻ (tashqi sfera — erkin ion)`,
      sphere: 'outer'
    }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    outerIonsRef.current.push(mesh)

    // Zaryad belgisi
    if (isHighlight) {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.6, 24, 24),
        new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.18, depthWrite: false })
      )
      halo.position.copy(pos)
      halo.userData = { isHalo: true }
      parent.add(halo)
      highlightsRef.current.push(halo)
    }

    return mesh
  }, [])

  // ═══════════════════════════════════════════════════════════
  // Sferalarni ko'rsatuvchi shaffof shar
  // ═══════════════════════════════════════════════════════════
  const createSphereVisual = useCallback((scene, radius, color, opacity, isInner = true) => {
    const geo = new THREE.SphereGeometry(radius, 32, 32)
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, wireframe: false,
      depthWrite: false
    })
    const sphere = new THREE.Mesh(geo, mat)
    sphere.userData = { isSphere: true, sphere: isInner ? 'inner' : 'outer' }
    scene.add(sphere)
    return sphere
  }, [])

  // ═══════════════════════════════════════════════════════════
  // ASOSIY MOLEKULA QURISH
  // ═══════════════════════════════════════════════════════════
  const buildMolecule = useCallback((group, systemData, variantData) => {
    const { center } = systemData
    const centerPos = new THREE.Vector3(0, 0, 0)
    const dist = 1.98

    // Markaziy metall
    const cGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.9,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(centerPos)
    cMesh.userData = {
      type: 'atom', element: center.element,
      info: ATOM_INFO[center.element], isCenter: true, sphere: 'inner'
    }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    // 6 ta oktaedrik pozitsiya
    const dirs = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
    ]

    // NH₃ soni (Co uchun 4 yoki 5), qolganlari H₂O
    const isCoSystem = systemData.id === "CoNH3Cl"
    const isNiSystem = systemData.id === "NiClBr"
    const nh3Count = isCoSystem ? 4 : 0
    const innerCl = variantData.innerCl || 0
    const innerBr = variantData.innerBr || 0
    const innerH2O = 6 - nh3Count - innerCl - innerBr

    // Ligandlarni joylashtirish
    let dirIdx = 0
    // NH₃ birinchi (Co uchun)
    for (let i = 0; i < nh3Count; i++) {
      const nPos = centerPos.clone().add(dirs[dirIdx].clone().multiplyScalar(dist))
      createNH3(group, nPos, centerPos, showHydrogens)
      dirIdx++
    }
    // Ichki Cl (mos ravishda)
    for (let i = 0; i < innerCl; i++) {
      const cPos = centerPos.clone().add(dirs[dirIdx].clone().multiplyScalar(dist + 0.3))
      createHalideInner(group, cPos, centerPos, "Cl")
      dirIdx++
    }
    // Ichki Br
    for (let i = 0; i < innerBr; i++) {
      const bPos = centerPos.clone().add(dirs[dirIdx].clone().multiplyScalar(dist + 0.4))
      createHalideInner(group, bPos, centerPos, "Br")
      dirIdx++
    }
    // Ichki H₂O
    for (let i = 0; i < innerH2O; i++) {
      const oPos = centerPos.clone().add(dirs[dirIdx].clone().multiplyScalar(dist))
      createH2O(group, oPos, centerPos, showHydrogens, false)
      dirIdx++
    }

    // ═══ TASHQI SFERA IONLARI ═══
    if (showOuterSphere) {
      const outerRadius = 4.8
      const outerCl = variantData.outerCl || 0
      const outerBr = variantData.outerBr || 0
      const totalOuter = outerCl + outerBr
      for (let i = 0; i < outerCl; i++) {
        // Sferada tarqalgan pozitsiyalar
        const phi = Math.acos(1 - 2 * ((i * 3) + 0.5) / (totalOuter * 3 + 1))
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i * 3)
        const pos = new THREE.Vector3(
          outerRadius * Math.sin(phi) * Math.cos(theta),
          outerRadius * Math.sin(phi) * Math.sin(theta),
          outerRadius * Math.cos(phi)
        )
        createHalideOuter(group, pos, "Cl", false)
      }
      for (let i = 0; i < outerBr; i++) {
        const idx = outerCl + i
        const phi = Math.acos(1 - 2 * ((idx * 3) + 0.5) / (totalOuter * 3 + 1))
        const theta = Math.PI * (1 + Math.sqrt(5)) * (idx * 3)
        const pos = new THREE.Vector3(
          outerRadius * Math.sin(phi) * Math.cos(theta),
          outerRadius * Math.sin(phi) * Math.sin(theta),
          outerRadius * Math.cos(phi)
        )
        createHalideOuter(group, pos, "Br", false)
      }
    }

    // ═══ KRISTALL SUV ═══
    if (showCrystalWater && variantData.crystalH2O > 0) {
      const crystalRadius = 5.5
      for (let i = 0; i < variantData.crystalH2O; i++) {
        const phi = Math.acos(1 - 2 * ((i * 5) + 0.5) / (variantData.crystalH2O * 5 + 3))
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i * 5) + Math.PI / 4
        const pos = new THREE.Vector3(
          crystalRadius * Math.sin(phi) * Math.cos(theta),
          crystalRadius * Math.sin(phi) * Math.sin(theta) + 0.5,
          crystalRadius * Math.cos(phi)
        )
        const waterMesh = createH2O(group, pos, null, showHydrogens, true)
        crystalWaterRef.current.push(waterMesh)
      }
    }

    // Formula sprite
    if (showLabels) {
      const sprite = makeTextSprite(variantData.formula, {
        fontSize: 46, color: "#ffffff",
        bgColor: "rgba(30, 15, 55, 0.9)",
        borderColor: variantData.colorHex, scale: 0.42
      })
      sprite.position.set(0, 4.2, 0)
      group.add(sprite)
      labelsRef.current.push(sprite)

      const sub = makeTextSprite(variantData.color, {
        fontSize: 36, color: variantData.colorHex,
        bgColor: "rgba(10, 5, 25, 0.85)",
        borderColor: variantData.colorHex, scale: 0.38
      })
      sub.position.set(0, 3.55, 0)
      group.add(sub)
      labelsRef.current.push(sub)
    }
  }, [showHydrogens, showLabels, showOuterSphere, showCrystalWater, createH2O, createNH3, createHalideInner, createHalideOuter])

  // ═══════════════════════════════════════════════════════════
  // H-bog'lanishlar (ichki suv → tashqi Cl⁻ va kristall suv)
  // ═══════════════════════════════════════════════════════════
  const drawHBonds = useCallback((group) => {
    if (!showHBonds) return
    // Ichki H₂O atomlaridan tashqi Cl⁻ larga uzuq-uzuq chiziq
    const innerWaterOs = atomsRef.current.filter(a =>
      a.userData?.element === 'O' && a.userData?.sphere === 'inner'
    )
    const outerHalides = atomsRef.current.filter(a =>
      (a.userData?.element === 'Cl' || a.userData?.element === 'Br') &&
      a.userData?.sphere === 'outer'
    )
    innerWaterOs.forEach(o => {
      const oPos = o.position
      // Eng yaqin 1-2 ta tashqi ionni topamiz
      const sorted = outerHalides.map(x => ({
        atom: x, dist: oPos.distanceTo(x.position)
      })).sort((a, b) => a.dist - b.dist).slice(0, 1)
      sorted.forEach(({ atom }) => {
        if (atom.position.distanceTo(oPos) < 5) {
          createDashedLine(group, oPos, atom.position, CPK.hbond, 0.15, 0.1)
        }
      })
    })
  }, [showHBonds, createDashedLine])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Eski gruh va sferalarni tozalash
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
    if (innerSphereRef.current) {
      scene.remove(innerSphereRef.current)
      innerSphereRef.current.geometry?.dispose()
      innerSphereRef.current.material?.dispose()
    }
    if (outerSphereRef.current) {
      scene.remove(outerSphereRef.current)
      outerSphereRef.current.geometry?.dispose()
      outerSphereRef.current.material?.dispose()
    }

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    hBondsRef.current = []
    outerIonsRef.current = []
    crystalWaterRef.current = []
    highlightsRef.current = []

    const group = new THREE.Group()
    moleculeGroupRef.current = group

    buildMolecule(group, system, variant)
    drawHBonds(group)

    scene.add(group)

    // Ichki sfera vizualizatsiyasi (yashil shaffof shar)
    if (showInnerSphere) {
      innerSphereRef.current = createSphereVisual(scene, 3.2, 0x66ff88, 0.06, true)
    }
    // Tashqi sfera vizualizatsiyasi (qizil shaffof shar)
    if (showOuterSphere) {
      outerSphereRef.current = createSphereVisual(scene, 5.0, 0xff6666, 0.04, false)
    }
  }, [system, variant, buildMolecule, drawHBonds, showInnerSphere, showOuterSphere, createSphereVisual])

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
    camera.position.set(0, 3, 12)
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
    controls.minDistance = 4
    controls.maxDistance = 24
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(700 * 3)
    for (let i = 0; i < 700 * 3; i += 3) {
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

      const t = performance.now() * 0.001

      // Halo pulsatsiya
      highlightsRef.current.forEach(m => {
        if (m.userData?.isHalo) {
          const scale = 1 + Math.sin(t * 2) * 0.15
          m.scale.set(scale, scale, scale)
          if (m.material) m.material.opacity = 0.15 + Math.sin(t * 2) * 0.08
        }
      })

      // Kristall suv — Braun harakati
      crystalWaterRef.current.forEach((m, i) => {
        if (m && m.position) {
          m.position.x += Math.sin(t * 0.5 + i) * 0.001
          m.position.y += Math.cos(t * 0.6 + i * 1.3) * 0.001
        }
      })

      // AgNO₃ animatsiyasi — tashqi Cl⁻ larni pastga tushirish
      if (agno3AnimRef.current.active) {
        agno3AnimRef.current.progress += 0.008
        const p = Math.min(agno3AnimRef.current.progress, 1)
        outerIonsRef.current.forEach((ion, idx) => {
          if (ion.userData?.element === 'Cl') {
            const targetY = -6 - idx * 0.3
            const startY = ion.userData._startY ?? ion.position.y
            if (ion.userData._startY === undefined) ion.userData._startY = startY
            ion.position.y = startY + (targetY - startY) * p
            // Rangini AgCl kabi oq qilamiz
            if (ion.material && p > 0.5) {
              const t2 = (p - 0.5) * 2
              ion.material.color.setRGB(
                0.12 + (0.95 - 0.12) * t2,
                0.94 + (0.95 - 0.94) * t2,
                0.12 + (0.95 - 0.12) * t2
              )
              ion.material.emissive.setRGB(0.3 * (1 - t2), 0.3 * (1 - t2), 0.3 * (1 - t2))
            }
          }
        })
        if (p >= 1) {
          agno3AnimRef.current.progress = 0
          // Cheklamaymiz — animatsiya davomiy tsikl bo'ladi
          // ammo AgCl cho'kish tugagach, davom etmasin
          agno3AnimRef.current.active = false
          setRunAgNO3(false)
        }
      } else {
        // Qayta boshlash uchun asl holatga qaytaramiz
        outerIonsRef.current.forEach((ion) => {
          if (ion.userData?._startY !== undefined) {
            ion.position.y = ion.userData._startY
            if (ion.material && ion.userData?.element === 'Cl') {
              ion.material.color.setRGB(0.12, 0.94, 0.12)
              ion.material.emissive.setRGB(0.12, 0.94, 0.12)
              ion.material.emissiveIntensity = 0.2
            }
            delete ion.userData._startY
          }
        })
      }

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
  useEffect(() => { agno3AnimRef.current.active = runAgNO3; if (runAgNO3) agno3AnimRef.current.progress = 0 }, [runAgNO3])

  // Sistemani o'zgartirganda birinchi variantga qaytamiz
  useEffect(() => {
    setCurrentVariant("A")
  }, [currentSystem])

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
        green: rgb(0.08, 0.55, 0.31),
        blue: rgb(0.08, 0.31, 0.75),
        cyan: rgb(0.15, 0.55, 0.75),
        yellow: rgb(0.75, 0.60, 0.10),
        violet: rgb(0.42, 0.25, 0.63),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgViolet: rgb(0.97, 0.94, 1.0), bgCyan: rgb(0.92, 0.98, 1.0),
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
          `Gidrat izomeriyasi 3D Lab  •  ${cleanText(system.empiricalFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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

      const title = "GIDRAT IZOMERIYASI"
      const tW = measure(title, boldFont, 26)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 88, size: 26, font: boldFont, color: C.white })

      const subtitle = "Ichki va tashqi koordinatsion sfera tahlili"
      const sW = measure(subtitle, italicFont, 12)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 113, size: 12, font: italicFont, color: C.purpleLight })

      const formulaText = cleanText(system.empiricalFormula)
      const fW = measure(formulaText, boldFont, 20)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 160, size: 20, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan sistema", `${system.title} — ${system.variants.length} ta gidrat izomer`, C.bgPurple, C.purple)

      const meta = [
        ["Empirik formula:", system.empiricalFormula],
        ["Markaziy metall:", `${system.center.element}(${system.center.charge})`],
        ["d-elektronlar soni:", `d${system.center.dElectrons}`],
        ["Izomerlar soni:", `${system.variants.length}`]
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
        drawSectionHeader(1, "Kirish — Gidrat izomeriyasi nima?")
        drawParagraph(
          "Gidrat izomeriyasi (yoki 'ionizatsiya izomeriyasi'ning bir turi) — bir xil empirik formulaga ega bo'lgan koordinatsion birikmalar suv (H₂O) molekulalari ichki koordinatsion sferada ligand sifatida yoki tashqi sferada kristall suv sifatida joylashishida farq qilishi bilan namoyon bo'ladigan izomeriya turidir."
        )
        drawParagraph("Bu turdagi izomeriyaning uchta asosiy xususiyati:")
        drawBulletPoint("Suv (H₂O) — ichki (koordinatsion) yoki tashqi (kristall) sferada bo'lishi mumkin")
        drawBulletPoint("Anion ionlari (Cl⁻, Br⁻) — ichki (koordinatsion ligand) yoki tashqi (erkin ion) sferada")
        drawBulletPoint("H₂O va anion o'rtasidagi ROLINI ALMASHINISHI ichki koordinatsiya sferasini o'zgartiradi")

        drawInfoBox(
          "Ichki (koordinatsion) sfera",
          "Markaziy metallga to'g'ridan-to'g'ri koordinatsion bog' bilan bog'langan ligandlar. Kvadrat qavs [ ] ichida yoziladi. Bu ligandlarni ajratib olish qiyin, ular AgNO₃ bilan tez reaksiyaga kirishmaydi.",
          C.bgGreen, C.green
        )
        drawInfoBox(
          "Tashqi (ionli) sfera",
          "Kristall panjaraga elektrostatik jihatdan biriktirilgan qarama-qarshi zaryadli ionlar. Formulada qavsdan tashqarida yoziladi. Suvda eritilganda darhol erkin ionlarga ajraladi va AgNO₃ bilan cho'kma hosil qiladi.",
          C.bgOrange, C.orange
        )
        drawInfoBox(
          "Kristall suvi (crystalline water)",
          "Panjaradagi bo'sh joylarni to'ldiruvchi H₂O molekulalari. Markaziy metallga bog'lanmagan. Formulaning oxirida '·nH₂O' ko'rinishida yoziladi. Isitilsa oson bug'lanadi.",
          C.bgCyan, C.cyan
        )
      }

      // ── 2. Werner tajribasi ──
      if (pdfSections.wernerExp) {
        drawSectionHeader(2, "Werner-ning klassik tajribasi (1893)")
        drawParagraph(cleanText(system.discovery))

        drawParagraph(
          "Alfred Werner CrCl₃·6H₂O tarkibli birikmaning uch xil rangdagi kristallarini ajratdi va ularning to'la miqdoriy tahlilini o'tkazdi:"
        )
        system.variants.forEach((v, i) => {
          const bgColors = [C.bgViolet, C.bgGreen, C.bgYellow]
          const bColors = [C.violet, C.green, C.yellow]
          drawInfoBox(
            `${String.fromCharCode(65 + i)}) ${v.color} — ${v.formula}`,
            `${v.name}. Ichki sfera: 6 ligand (${6 - (v.innerCl || 0) - (v.innerBr || 0)} H₂O + ${(v.innerCl || 0)} Cl⁻ + ${(v.innerBr || 0)} Br⁻). Tashqi sfera: ${(v.outerCl || 0)} Cl⁻ + ${(v.outerBr || 0)} Br⁻. Kristall suv: ${v.crystalH2O || 0} H₂O.`,
            bgColors[i % 3], bColors[i % 3]
          )
        })
      }

      // ── 3. Struktura ──
      if (pdfSections.structure) {
        drawSectionHeader(3, "Har bir izomerning fazoviy tuzilishi")
        system.variants.forEach((v) => {
          checkBreak(80)
          drawInfoBox(
            v.formula,
            `Rang: ${v.color}. Ichki sfera koordinatsion soni: 6 (oktaedrik geometriya, dsp³/d²sp³ gibridlanish). ` +
            `Yutilish maksimumi: ${v.wavelength}. Bu spectrochemical seriyadagi ligand kuchi bilan bog'liq (H₂O > Cl⁻).`,
            C.bgPurple, C.purple
          )
        })

        drawParagraph(
          "Ligand kuchining Cl⁻ dan H₂O ga almashtirilishi Δo qiymatini oshiradi (spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < CN⁻). Shuning uchun [Cr(H₂O)₆]³⁺ eng ko'p Δo ga ega — binafsha yorug'likni yutadi va binafsha rangda ko'rinadi."
        )
      }

      // ── 4. AgNO₃ tajribasi ──
      if (pdfSections.agno3) {
        drawSectionHeader(4, "AgNO₃ titrlash tajribasi (gravimetrik tahlil)")
        drawParagraph(cleanText(system.experiment))
        drawParagraph("Har bir izomer uchun AgNO₃ testi natijalari:")
        system.variants.forEach((v) => {
          drawBulletPoint(`${v.formula}: ${v.agNO3Test}`)
        })
        drawInfoBox(
          "Kimyoviy tenglama",
          "Ag⁺ + Cl⁻ (tashqi sfera) → AgCl↓ (oq cho'kma, Ksp = 1.8×10⁻¹⁰). Ichki sferadagi Cl⁻ ionlari koordinatsion bog'langani uchun bu reaksiyada qatnashmaydi.",
          C.bgYellow, C.yellow
        )
      }

      // ── 5. Konduktometriya ──
      if (pdfSections.conductometry) {
        drawSectionHeader(5, "Konduktometrik tahlil")
        drawParagraph(cleanText(system.conductometry))
        drawParagraph("Molyar elektr o'tkazuvchanlik qiymatlari (Λm, 25°C, cheksiz suyultirilgan holat):")
        system.variants.forEach((v) => {
          drawBulletPoint(`${v.formula}: ${v.conductivity}`)
        })
        drawInfoBox(
          "Λm va elektrolit turi",
          "1:1 elektrolit (2 ion) ≈ 100-140; 1:2 elektrolit (3 ion) ≈ 220-280; 1:3 elektrolit (4 ion) ≈ 380-450 S·cm²·mol⁻¹. Bu qiymatlar Kohlrausch qonuniga muvofiq har ionning individual o'tkazuvchanligidan iborat.",
          C.bgBlue, C.blue
        )
      }

      // ── 6. Termodinamika va spektrоskopiya ──
      if (pdfSections.thermodynamics) {
        drawSectionHeader(6, "Termodinamika va UV-Vis spektrоskopiya")
        drawParagraph(cleanText(system.thermodynamics))
        drawParagraph(
          "UV-Vis spektrida har bir izomer o'ziga xos yutilish polosalariga ega — bu ligand maydoni yorilishi (Δo) qiymatining farqidan kelib chiqadi:"
        )
        system.variants.forEach((v) => {
          drawBulletPoint(`${v.formula}: λmax = ${v.wavelength}`)
        })
        drawInfoBox(
          "Ligand maydoni nazariyasi (CFT)",
          "Δo qiymati liganddan liganda o'zgaradi. H₂O ligandi Cl⁻ dan kuchli, shuning uchun 6 H₂O li binafsha izomer eng katta Δo ga ega va eng qisqa to'lqin uzunligini yutadi (573 nm). Cl⁻ ligand ko'p bo'lgan izomerlarda Δo pasayadi, yutilish uzunroq to'lqin uzunliklariga siljiydi (batoxrom).",
          C.bgPurple, C.purple
        )
      }

      // ── 7. Amaliy qo'llanilishi ──
      if (pdfSections.applications) {
        drawSectionHeader(7, "Amaliy ahamiyati va zamonaviy qo'llanilishi")
        drawBulletPoint("Analitik kimyo: gravimetrik va konduktometrik usullar bilan ionlar sonini aniqlash")
        drawBulletPoint("Kristallografiya: kristall gidratlar tuzilishini rentgen difraksiyasi bilan aniqlash")
        drawBulletPoint("Farmatsevtika: giroskopik kristall gidratlar dorilarni saqlash sharoitlarida barqarorligini belgilaydi (masalan, insulin va antibiotiklar)")
        drawBulletPoint("Metallurgiya: xrom va nikel qoplamasi olishda gidrat izomerlar kaltiy farqi bilan bir-birini almashinadi")
        drawBulletPoint("Rangli sanoat: turli gidrat izomerlar tekstil bo'yash, glazuralar tayyorlashda ishlatiladi")
        drawBulletPoint("Biokimyo: ferritin va boshqa temir saqlash biomolekulalari gidrat holatida bo'ladi")
      }

      // ── 8. Solishtirish jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(8, "Barcha izomerlarning solishtirish jadvali")
        const headers = ["Formula", "Rang", "Ichki H₂O", "Ichki Cl⁻", "Tashqi Cl⁻", "Krist. H₂O", "Λm"]
        const rows = [headers, ...system.variants.map(v => [
          v.formula,
          v.color,
          String(6 - (v.innerCl || 0) - (v.innerBr || 0) - (system.id === "CoNH3Cl" ? 4 : 0)),
          String((v.innerCl || 0) + (v.innerBr || 0)),
          String((v.outerCl || 0) + (v.outerBr || 0)),
          String(v.crystalH2O || 0),
          v.conductivity.split(" ")[0]
        ])]
        const colW = [
          CONTENT_W * 0.24, CONTENT_W * 0.15,
          CONTENT_W * 0.11, CONTENT_W * 0.11, CONTENT_W * 0.11, CONTENT_W * 0.11, CONTENT_W * 0.17
        ]
        const rowH = 26
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 4
          row.forEach((cell, ci) => {
            const font = isHeader ? boldFont : regularFont
            const fs = isHeader ? 8.5 : 8
            const txt = truncate(cleanText(cell), font, fs, colW[ci] - 8)
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
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
          "Werner, A. (1911). Zur Kenntnis des asymmetrischen Kobaltatoms. Berichte der deutschen chemischen Gesellschaft, 44(2), 1887–1898.",
          "Bjerrum, N. (1907). Studien über Chromichlorid — Über die drei Isomeren Hexahydrate. Berichte, 40, 2917.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 20 — d-block Metal Chemistry.",
          "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson. Chapter 9 — Coordination Compounds.",
          "Cotton, F.A., Wilkinson, G. (1988). Advanced Inorganic Chemistry (5th ed.). Wiley-Interscience.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — Recommendations 2005. RSC Publishing.",
          "Kauffman, G.B. (1966). Alfred Werner: Founder of Coordination Chemistry. Springer-Verlag.",
          "Bowman-James, K. (2005). Alfred Werner Revisited: The Coordination Chemistry of Anions. Accounts of Chemical Research, 38(8), 671–678."
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

      pdfDoc.setTitle(`Gidrat izomeriyasi — ${cleanText(system.empiricalFormula)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning gidrat izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["gidrat izomeriyasi", "hydrate isomerism", "Werner", "koordinatsion sfera"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `gidrat-izomeriya-${system.id}.pdf`
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
            href="/oquv/izomeriyasi/tuzilish/gidrat"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-cyan-300 flex items-center gap-2 truncate">
              <span>💧</span>
              <span className="hidden sm:inline">Gidrat izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Gidrat 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {system.empiricalFormula} • {variant.color}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentSystem}
            onChange={(e) => setCurrentSystem(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[250px]"
          >
            <option value="CrCl3_6H2O">CrCl₃·6H₂O — Werner uchligi</option>
            <option value="CoNH3Cl">[Co(NH₃)₄...] — Kobalt</option>
            <option value="NiClBr">[Ni(H₂O)₅X]Y — Ni Cl/Br</option>
            <option value="WernerExperiment">🧪 AgNO₃ tajribasi</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => togglePanel("agno3")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "agno3" ? 'bg-yellow-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="AgNO₃ tajribasi"
          >🧪</button>

          <button
            onClick={() => togglePanel("conduct")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "conduct" ? 'bg-blue-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Konduktometriya"
          >⚡</button>

          <button
            onClick={() => togglePanel("compare")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Solishtirish jadvali"
          >📊</button>

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Werner tarixi"
          >📜</button>

          <button
            onClick={() => togglePanel("test")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Test / mashqlar"
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
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[280px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
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

            {/* — IZOMER TANLASH — */}
            <div className="mb-3 px-1">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💠 Izomer tanlash</div>
              <div className="space-y-1.5">
                {system.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setCurrentVariant(v.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] transition-all border ${
                      currentVariant === v.id
                        ? 'border-white/60 shadow-lg'
                        : 'border-purple-800/40 hover:border-purple-600/60'
                    }`}
                    style={{
                      backgroundColor: currentVariant === v.id ? `${v.colorHex}44` : 'rgba(60, 20, 90, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: v.colorHex }}></span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-white text-[10px] truncate">{v.formula}</div>
                        <div className="text-purple-300 text-[9px] truncate">{v.color}</div>
                      </div>
                    </div>
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
                  <span>Vodorodlar (H)</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Ichki sfera (yashil)</span>
                  <input type="checkbox" checked={showInnerSphere} onChange={(e) => setShowInnerSphere(e.target.checked)} className="accent-green-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Tashqi sfera (qizil)</span>
                  <input type="checkbox" checked={showOuterSphere} onChange={(e) => setShowOuterSphere(e.target.checked)} className="accent-red-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Kristall suv (ko'k)</span>
                  <input type="checkbox" checked={showCrystalWater} onChange={(e) => setShowCrystalWater(e.target.checked)} className="accent-cyan-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>H-bog'lanishlar</span>
                  <input type="checkbox" checked={showHBonds} onChange={(e) => setShowHBonds(e.target.checked)} className="accent-blue-500" />
                </label>
              </div>
            )}

            {/* — TAJRIBALAR — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "experiments" ? null : "experiments")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🧪</span> Tajribalar</span>
              <span>{expandedSection === "experiments" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "experiments" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setRunAgNO3(!runAgNO3)}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${runAgNO3 ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>🧪</span> AgNO₃ + Cl⁻ → AgCl↓</span>
                  <span>{runAgNO3 ? "⏸" : "▶"}</span>
                </button>
                <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-700/40">
                  <div className="text-[10px] text-yellow-300 font-bold mb-1">📌 {variant.formula} uchun kutilgan natija:</div>
                  <div className="text-[10px] text-yellow-100 leading-tight">{variant.agNO3Test}</div>
                </div>
              </div>
            )}

            {/* — SFERA HISOBI — */}
            <div className="bg-gradient-to-r from-green-900/30 to-red-900/30 rounded-lg p-2.5 border border-purple-700/40 mb-2">
              <div className="text-[10px] text-purple-300 mb-1.5 uppercase tracking-wide">💎 Ionlar hisobi</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-green-900/30 rounded p-1.5 border border-green-700/30">
                  <div className="text-green-300 font-bold">Ichki sfera</div>
                  <div className="text-green-100 mt-1">
                    {6 - (variant.innerCl || 0) - (variant.innerBr || 0) - (system.id === "CoNH3Cl" ? 4 : 0)} × H₂O<br/>
                    {system.id === "CoNH3Cl" && <>4 × NH₃<br/></>}
                    {(variant.innerCl || 0) > 0 && <>{variant.innerCl} × Cl⁻<br/></>}
                    {(variant.innerBr || 0) > 0 && <>{variant.innerBr} × Br⁻</>}
                  </div>
                </div>
                <div className="bg-red-900/30 rounded p-1.5 border border-red-700/30">
                  <div className="text-red-300 font-bold">Tashqi sfera</div>
                  <div className="text-red-100 mt-1">
                    {(variant.outerCl || 0) > 0 && <>{variant.outerCl} × Cl⁻<br/></>}
                    {(variant.outerBr || 0) > 0 && <>{variant.outerBr} × Br⁻<br/></>}
                    {(variant.crystalH2O || 0) > 0 && (
                      <span className="text-cyan-300">{variant.crystalH2O} × H₂O (krist.)</span>
                    )}
                    {(variant.outerCl || 0) === 0 && (variant.outerBr || 0) === 0 && (variant.crystalH2O || 0) === 0 && "—"}
                  </div>
                </div>
              </div>
            </div>

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
                <span className="text-green-400">Yashil shar</span> — ichki koordinatsion sfera.
                <span className="text-red-400"> Qizil shar</span> — tashqi ionli sfera.
                <span className="text-cyan-400"> Ko'k sharlar</span> — kristall suvi.
                🧪 AgNO₃ tugmasini bosgach tashqi Cl⁻ pastga cho'kadi (oq AgCl).
              </p>
            </div>
          </div>
        </div>
        )}

        {/* 3D Container */}
        <div ref={containerRef} className="flex-1 w-full relative" />

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 mx-auto"></div>
              <p className="mt-4 text-cyan-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Tanlangan atom */}
        {selectedAtom && !fullscreenMode && (
          <div className="absolute bottom-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
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
              {selectedAtom.info?.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.info.role}</div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.ligandName && <div><span className="text-purple-500">Ligand:</span> <span className="text-cyan-300">{selectedAtom.ligandName}</span></div>}
              {selectedAtom.sphere === 'inner' && <div className="mt-2 text-green-400 font-bold">💎 Ichki koordinatsion sferada</div>}
              {selectedAtom.sphere === 'outer' && <div className="mt-2 text-red-400 font-bold">🔴 Tashqi ionli sferada</div>}
              {selectedAtom.sphere === 'crystal' && <div className="mt-2 text-cyan-400 font-bold">💧 Kristall suv molekulasi</div>}
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
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Empirik formula</div>
                <div className="font-mono text-lg text-white text-center">{system.empiricalFormula}</div>
              </div>

              <div
                className="rounded-lg p-3 border-2"
                style={{
                  backgroundColor: `${variant.colorHex}22`,
                  borderColor: variant.colorHex
                }}
              >
                <div className="text-[10px] uppercase tracking-wide mb-1 font-bold" style={{ color: variant.colorHex }}>
                  Tanlangan izomer
                </div>
                <div className="font-mono text-sm text-white">{variant.formula}</div>
                <div className="text-[10px] text-purple-200 mt-1 italic">{variant.name}</div>
                <div className="text-[10px] mt-2" style={{ color: variant.colorHex }}>
                  🎨 Rang: {variant.color}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-900/30 rounded p-2 border border-green-700/30">
                  <div className="text-green-300 text-[9px] uppercase">Ichki sfera</div>
                  <div className="text-green-100 text-[11px] font-bold">{variant.innerLigands} ligand</div>
                </div>
                <div className="bg-red-900/30 rounded p-2 border border-red-700/30">
                  <div className="text-red-300 text-[9px] uppercase">Tashqi sfera</div>
                  <div className="text-red-100 text-[11px] font-bold">
                    {(variant.outerCl || 0) + (variant.outerBr || 0)} ion
                  </div>
                </div>
                <div className="bg-cyan-900/30 rounded p-2 border border-cyan-700/30">
                  <div className="text-cyan-300 text-[9px] uppercase">Kristall suv</div>
                  <div className="text-cyan-100 text-[11px] font-bold">{variant.crystalH2O || 0} × H₂O</div>
                </div>
                <div className="bg-yellow-900/30 rounded p-2 border border-yellow-700/30">
                  <div className="text-yellow-300 text-[9px] uppercase">λmax (UV-Vis)</div>
                  <div className="text-yellow-100 text-[11px] font-bold">{variant.wavelength}</div>
                </div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">⚡ Konduktivlik</div>
                <div className="text-blue-100 text-[10px]">{variant.conductivity}</div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🧪 AgNO₃ testi</div>
                <div className="text-yellow-100 text-[10px]">{variant.agNO3Test}</div>
              </div>
            </div>
          </div>
        )}

        {/* — AgNO₃ TAJRIBASI PANELI — */}
        {activePanel === "agno3" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-yellow-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-200 flex items-center gap-2 text-sm">
                <span>🧪</span> AgNO₃ titrlash tajribasi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-2">📖 Tajriba mohiyati</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{system.experiment}</p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">⚗️ Kimyoviy tenglama</div>
                <div className="text-center py-2 bg-purple-950/60 rounded font-mono text-[11px] text-yellow-100">
                  Ag⁺ + Cl⁻ (tashqi) → AgCl↓
                </div>
                <p className="text-purple-100 text-[9px] leading-relaxed mt-2 italic">
                  Faqat tashqi sferadagi Cl⁻ AgCl oq cho'kmasi hosil qiladi. Ichki sfera (koordinatsion) Cl⁻ inert bo'ladi.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-purple-300 font-bold text-[11px]">🔬 Har bir izomer uchun natija:</div>
                {system.variants.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg p-2 border cursor-pointer transition-all"
                    style={{
                      backgroundColor: currentVariant === v.id ? `${v.colorHex}33` : 'rgba(60, 20, 90, 0.3)',
                      borderColor: currentVariant === v.id ? v.colorHex : 'rgba(107, 63, 160, 0.3)'
                    }}
                    onClick={() => setCurrentVariant(v.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: v.colorHex }}></div>
                      <div className="font-mono text-[10px] text-white truncate">{v.formula}</div>
                    </div>
                    <div className="text-[10px] pl-5" style={{ color: v.colorHex }}>{v.agNO3Test}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setRunAgNO3(!runAgNO3)}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${runAgNO3 ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 'bg-yellow-900/40 text-yellow-300 hover:bg-yellow-800/50'}`}
              >
                {runAgNO3 ? "⏸ Animatsiyani to'xtatish" : "▶ AgNO₃ ni qo'shish (animatsiya)"}
              </button>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">💡 Tarixiy ma'lumot</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  Werner 1893-yilda aynan shu tajriba orqali koordinatsion nazariyasini isbotladi. U turli izomerlardan turli miqdorda AgCl olib, ichki va tashqi sferani birinchi bo'lib eksperimental ravishda farqladi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — KONDUKTOMETRIYA — */}
        {activePanel === "conduct" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-blue-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-blue-200 flex items-center gap-2 text-sm">
                <span>⚡</span> Konduktometrik tahlil
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-2">⚡ Konduktometriya nima?</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Konduktometriya — eritmaning elektr o'tkazuvchanligini o'lchash usuli. Molyar konduktivlik <span className="font-mono">Λm</span> eritmadagi erkin ionlar soniga qarab o'zgaradi (S·cm²·mol⁻¹ birlikda).
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">📊 Ion soni va Λm</div>
                <table className="w-full text-[10px] mt-1">
                  <thead>
                    <tr className="border-b border-purple-700/40">
                      <th className="text-left text-purple-400 py-1">Elektrolit</th>
                      <th className="text-left text-purple-400 py-1">Ionlar</th>
                      <th className="text-left text-purple-400 py-1">Λm oralig'i</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-100">
                    <tr><td className="py-1">1:1</td><td>2</td><td>100-140</td></tr>
                    <tr className="bg-purple-950/30"><td className="py-1">1:2</td><td>3</td><td>220-280</td></tr>
                    <tr><td className="py-1">1:3</td><td>4</td><td>380-450</td></tr>
                    <tr className="bg-purple-950/30"><td className="py-1">1:4</td><td>5</td><td>520-620</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <div className="text-purple-300 font-bold text-[11px]">🔬 {system.title} — barcha izomerlar:</div>
                {system.variants.map((v) => {
                  const conductNum = parseFloat(v.conductivity.split(" ")[0])
                  return (
                    <div
                      key={v.id}
                      className="rounded-lg p-2 border cursor-pointer"
                      style={{
                        backgroundColor: currentVariant === v.id ? `${v.colorHex}33` : 'rgba(60, 20, 90, 0.3)',
                        borderColor: currentVariant === v.id ? v.colorHex : 'rgba(107, 63, 160, 0.3)'
                      }}
                      onClick={() => setCurrentVariant(v.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: v.colorHex }}></div>
                        <div className="font-mono text-[10px] text-white truncate flex-1">{v.formula}</div>
                        <div className="text-[10px] font-bold text-blue-300">{conductNum}</div>
                      </div>
                      {/* Bar */}
                      <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${(conductNum / 450) * 100}%`,
                            backgroundColor: v.colorHex
                          }}
                        />
                      </div>
                      <div className="text-[9px] text-purple-300 mt-1">{v.conductivity}</div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">🧠 Kohlrausch qonuni</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  Cheksiz suyultirilgan holatda: Λm = ν+·λ+ + ν−·λ−, bunda λ har bir ionning individual o'tkazuvchanligi. Ionlar soni ortsa — konduktivlik oshadi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-md w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>📊</span> Solishtirish jadvali
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-purple-800/50">
                    <th className="border border-purple-700/50 px-1.5 py-1 text-left text-purple-100">Formula</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">Rang</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">Ich.</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">Tash.</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">·nH₂O</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">AgCl</th>
                    <th className="border border-purple-700/50 px-1.5 py-1 text-center text-purple-100">Λm</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {system.variants.map(v => (
                    <tr key={v.id} className={currentVariant === v.id ? "bg-purple-800/30" : ""}>
                      <td className="border border-purple-800/50 px-1.5 py-1 font-mono text-[9px]">{v.formula}</td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">
                        <div className="w-3 h-3 rounded-full mx-auto" style={{ backgroundColor: v.colorHex }}></div>
                      </td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">{(v.innerCl || 0) + (v.innerBr || 0)}</td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">{(v.outerCl || 0) + (v.outerBr || 0)}</td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">{v.crystalH2O || 0}</td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">{(v.outerCl || 0)}</td>
                      <td className="border border-purple-800/50 px-1.5 py-1 text-center">{v.conductivity.split(" ")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed space-y-1">
              <div><strong className="text-purple-200">Ich.</strong> — ichki sferadagi anion (Cl⁻/Br⁻) soni</div>
              <div><strong className="text-purple-200">Tash.</strong> — tashqi sferadagi anion soni</div>
              <div><strong className="text-purple-200">·nH₂O</strong> — kristall suv molekulalari</div>
              <div><strong className="text-purple-200">AgCl</strong> — AgNO₃ testida cho'kadigan AgCl mollari</div>
              <div><strong className="text-purple-200">Λm</strong> — molyar konduktivlik (S·cm²·mol⁻¹)</div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Werner va gidrat izomerlar
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{system.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1866 — Blomstrand</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Christian Blomstrand (Uppsala) "zanjir nazariyasi"ni ilgari surdi — ammiak molekulalari zanjir hosil qiladi degan noto'g'ri gipoteza.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1885 — Jørgensen davomi</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">Sofus Mads Jørgensen (Kopengagen) Blomstrand nazariyasini rivojlantirdi. Ammo ba'zi tajribalar bu nazariyaga mos kelmasdi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1893 — Werner kashfiyoti (26 yosh)</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Alfred Werner Sürix universitetida Blomstrand-Jørgensen nazariyasini rad etib, koordinatsion nazariyani taklif qildi. CrCl₃·6H₂O ning uch xil izomerini bu nazariya bilan tushuntirdi.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1907 — Bjerrum tasdig'i</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">Niels Bjerrum uch xil CrCl₃·6H₂O izomerining spektroskopik va analitik tavsifini nashr etdi — Werner nazariyasi to'liq tasdiqlandi.</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1911 — Optik izomeriya</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Werner [Co(en)₂(NH₃)Cl]²⁺ ning enantiomerlarini ajratdi va koordinatsion birikmalarda ham optik faollik borligini isbotladi.</p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1913 — Nobel mukofoti</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Alfred Werner "kimyo tuzilish nazariyasiga qo'shgan hissasi uchun" Kimyo bo'yicha Nobel mukofotini oldi — noorganik kimyoda birinchi Nobel.</p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40 mt-2">
                <div className="text-purple-300 font-bold text-[11px] mb-1">📚 Werner asosiy asari</div>
                <p className="text-purple-100 text-[10px] italic leading-relaxed">
                  "Neuere Anschauungen auf dem Gebiete der anorganischen Chemie" (Noorganik kimyoning yangi qarashlari), 1905. Bu kitob 50 yildan ortiq davomida noorganik kimyoning asosiy darsligi bo'lib qoldi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Gidrat izomeriyasi nima?"
                a="Bir xil empirik formulaga ega bo'lgan komplekslar suv (H₂O) molekulalari va anionlar ichki (koordinatsion) yoki tashqi (ionli/kristall) sferada joylashishida farq qilishi bilan namoyon bo'ladigan izomeriya turi."
              />
              <TestQuestion
                q="[Cr(H₂O)₆]Cl₃ eritmasiga AgNO₃ qo'shsak nima cho'kadi?"
                a="3 mol AgCl (oq cho'kma) — barcha 3 ta Cl⁻ tashqi sferada bo'lgani uchun darhol Ag⁺ bilan reaksiyaga kirishadi. Bu izomer 1:3 elektrolit."
              />
              <TestQuestion
                q="[Cr(H₂O)₄Cl₂]Cl·2H₂O eritmasiga AgNO₃ qo'shsak?"
                a="Faqat 1 mol AgCl cho'kadi — chunki 2 ta Cl⁻ ichki koordinatsion sferada bog'langan va reaksiyaga kirishmaydi. Bu izomer 1:1 elektrolit."
              />
              <TestQuestion
                q="Kristall suv (·nH₂O) va koordinatsion H₂O ning farqi nima?"
                a="Kristall suv panjaradagi bo'sh joylarni to'ldiradi, metallga bog'lanmagan, isitilsa oson bug'lanadi. Koordinatsion H₂O — markaziy metallga to'g'ridan-to'g'ri koordinatsion bog' bilan bog'langan (Cr–O ≈ 1.98 Å)."
              />
              <TestQuestion
                q="Nima uchun [Cr(H₂O)₆]Cl₃ binafsha, [Cr(H₂O)₄Cl₂]Cl·2H₂O esa to'q yashil?"
                a="Ligand maydoni nazariyasi bo'yicha H₂O — Cl⁻ dan kuchli ligand (spektrоximik seriyada). 6 H₂O li kompleksda Δo katta (573 nm yutiladi — binafsha ko'rinadi). Cl⁻ ko'p bo'lgan izomerda Δo pasayadi, yutilish uzunroq to'lqin uzunliklariga (630 nm) siljiydi — yashil rang."
              />
              <TestQuestion
                q="Werner konduktometrik tajribadan qanday xulosaga keldi?"
                a="Uch izomer eritmasining konduktivligi 405 → 260 → 105 S·cm²·mol⁻¹ bo'lib pasaydi. Bu ionlar sonining 4 → 3 → 2 ga kamayishini isbotladi. Ya'ni ichki sferaga ko'proq Cl⁻ kirsa, tashqi sferada erkin ionlar kamayadi."
              />
              <TestQuestion
                q="Λm = 260 S·cm²·mol⁻¹ bo'lgan koordinatsion birikma qanday elektrolit?"
                a="1:2 elektrolit — 3 ta ion beradi (masalan, [M(L)₅X]X₂ turdagi kompleks: bitta kompleks kation va 2 ta anion)."
              />
              <TestQuestion
                q="Nima uchun ba'zi gidrat izomerlar isitilganda rangini o'zgartiradi?"
                a="Isitish ta'sirida ichki sferadagi H₂O tashqi sferadagi Cl⁻ bilan o'rin almashadi (yoki teskarisi). Bu Δo qiymatini o'zgartiradi va yorug'lik yutilishini siljitadi — rang o'zgaradi. Bu — termoxromizm hodisasi."
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
                  { k: "intro", label: "1. Kirish — gidrat izomeriyasi", icon: "📖" },
                  { k: "wernerExp", label: "2. Werner klassik tajribasi", icon: "🔬" },
                  { k: "structure", label: "3. Fazoviy tuzilish (spektroskopiya)", icon: "📐" },
                  { k: "agno3", label: "4. AgNO₃ titrlash tajribasi", icon: "🧪" },
                  { k: "conductometry", label: "5. Konduktometrik tahlil", icon: "⚡" },
                  { k: "thermodynamics", label: "6. Termodinamika va UV-Vis", icon: "🔥" },
                  { k: "applications", label: "7. Amaliy qo'llanilishi", icon: "💼" },
                  { k: "table", label: "8. Solishtirish jadvali", icon: "📊" },
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
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#50D050]"></div><span className="text-purple-300">Ni</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O (koord.)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#AAAAFF]"></div><span className="text-purple-300">O (kristall)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#A62929]"></div><span className="text-purple-300">Br</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-green-400 bg-green-400/20"></div><span className="text-purple-300">Ichki sfera</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-red-400 bg-red-400/20"></div><span className="text-purple-300">Tashqi sfera</span></div>
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

// ─────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli
// ─────────────────────────────────────────────────────────────
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
