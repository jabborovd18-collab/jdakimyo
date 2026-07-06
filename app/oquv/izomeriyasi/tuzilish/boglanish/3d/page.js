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
  Co: 0xF090A0, Cr: 0x8A99C7, Fe: 0xE06633, Pd: 0x006985,
  Cu: 0xC88033, Pt: 0xD0D0E0,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  S: 0xFFFF30, Cl: 0x1FF01F, K: 0x8F40D4,
  bond: 0x8B9DC3, hbond: 0x66CCFF, highlight: 0xFFD700
}

// ═══════════════════════════════════════════════════════════════════════════
// BOG'LANISH IZOMERLAR DATABASE
// Ambidentat ligand — ikki xil donor atomga ega bo'lgan ligand
// ═══════════════════════════════════════════════════════════════════════════
const LINKAGE_ISOMERS = {
  // ── 1. Nitro / Nitrito — Klassik namuna ────────────────
  CoNO2: {
    id: "CoNO2",
    title: "Nitro / Nitrito izomeriya",
    ligandFormula: "NO₂⁻",
    ligandName: "nitrit ioni",
    formulaA: "[Co(NH₃)₅(NO₂)]²⁺",
    formulaB: "[Co(NH₃)₅(ONO)]²⁺",
    nameA: "Nitropentaamminkobalt(III)",
    nameB: "Nitritopentaamminkobalt(III)",
    center: { element: "Co", color: CPK.Co, radius: 0.4, charge: "+3" },
    donorA: { atom: "N", color: CPK.N, name: "N-bog'langan", prefix: "nitro-" },
    donorB: { atom: "O", color: CPK.O, name: "O-bog'langan", prefix: "nitrito-" },
    colorA: "Sariq (η¹-N)",
    colorB: "Qizil-jigarrang (η¹-O)",
    stabilityA: "Termodinamik jihatdan turg'un (ΔH < ΔH_ONO)",
    stabilityB: "Kinetik mahsulot (kinetically labile)",
    bondLengthA: "Co–N ≈ 1.94 Å",
    bondLengthB: "Co–O ≈ 1.99 Å",
    ligandBondsA: "N=O × 2 (rezonans, ≈ 1.23 Å)",
    ligandBondsB: "N=O (1.20 Å) va N–O (1.31 Å) — asimmetrik",
    photochromism: "UV yorug'lik ta'sirida ONO → NO₂ o'tishi (Adamson, 1963-yil). Bu birinchi tasdiqlangan koordinatsion fotoxromik hodisa.",
    hsab: "Co(III) — o'rta qattiq kislota. N (nitro) — qattiqroq donor, O (nitrito) — yumshoqroq. Termodinamik jihatdan N-bog'lanish afzal.",
    discovery: "1893-yilda Sofus Mads Jørgensen (Kopengagen) va Alfred Werner nitro-nitrito izomerlarning mavjudligini birinchi bor kimyoviy usullar bilan ajratib ko'rsatishdi. Bu — bog'lanish izomeriyasining birinchi tajribaviy isboti.",
    ambidentate: {
      structure: "O=N–O⁻ rezonansda: ⁻O–N=O ↔ O=N–O⁻",
      atomN: "sp² gibridli, lone pair — donor",
      atomO: "sp² gibridli, lone pair — donor"
    }
  },

  // ── 2. Tiotsianato / Izotiotsianato ─────────────────
  CrSCN: {
    id: "CrSCN",
    title: "Tiotsianato / Izotiotsianato",
    ligandFormula: "SCN⁻",
    ligandName: "tiotsianat ioni",
    formulaA: "[Cr(H₂O)₅(NCS)]²⁺",
    formulaB: "[Cr(H₂O)₅(SCN)]²⁺",
    nameA: "Izotiotsianatopentaakvaxrom(III)",
    nameB: "Tiotsianatopentaakvaxrom(III)",
    center: { element: "Cr", color: CPK.Cr, radius: 0.4, charge: "+3" },
    donorA: { atom: "N", color: CPK.N, name: "N-bog'langan (izotiotsianato)", prefix: "izotiotsianato-" },
    donorB: { atom: "S", color: CPK.S, name: "S-bog'langan (tiotsianato)", prefix: "tiotsianato-" },
    colorA: "Binafsha",
    colorB: "Yashil-sariq",
    stabilityA: "Cr(III) uchun turg'un — N-bog'lanish afzal",
    stabilityB: "Kam turg'un — Cr(III) yumshoqroq S ga mos emas",
    bondLengthA: "Cr–N ≈ 1.99 Å (chiziqli Cr–N–C)",
    bondLengthB: "Cr–S ≈ 2.33 Å (bukilgan Cr–S–C ≈ 108°)",
    ligandBondsA: "N≡C (1.16 Å), C–S (1.63 Å)",
    ligandBondsB: "N=C=S rezonansi (1.16 + 1.63 Å)",
    photochromism: "Chapman va Wentworth (1969) — SCN → NCS ravishda izomerlanish issiqlik ta'sirida.",
    hsab: "HSAB nazariyasi: qattiq kislota (Cr³⁺, Fe³⁺, Co³⁺) → qattiq donor (N) ga bog'lanadi; yumshoq kislota (Pd²⁺, Pt²⁺, Cu⁺) → yumshoq donor (S) ga bog'lanadi. Bu — Pearson qonuni (1963).",
    discovery: "SCN⁻ ligandidagi bog'lanish izomeriyasi 20-asrning 40-50-yillarida Larsen tomonidan o'rganilgan. Pearson 1963-yilda HSAB nazariyasi orqali umumiy qonuniyat topdi.",
    ambidentate: {
      structure: "S=C=N⁻ ↔ ⁻S–C≡N (rezonans)",
      atomN: "sp gibridli, N lone pair — donor (izotiotsianato)",
      atomS: "sp³ gibridli, S lone pair — donor (tiotsianato)"
    }
  },

  // ── 3. Siano / Izosiano ─────────────────────────────
  FeCN: {
    id: "FeCN",
    title: "Siano / Izosiano",
    ligandFormula: "CN⁻",
    ligandName: "sianid ioni",
    formulaA: "[Fe(CN)₆]³⁻",
    formulaB: "Prussian blue Fe₄[Fe(CN)₆]₃",
    nameA: "Geksatsianoferrat(III) (qizil qon tuzi)",
    nameB: "Berlin ko'ki (mixed valence)",
    center: { element: "Fe", color: CPK.Fe, radius: 0.4, charge: "+3" },
    donorA: { atom: "C", color: CPK.C, name: "C-bog'langan (siano)", prefix: "siano-" },
    donorB: { atom: "N", color: CPK.N, name: "N-bog'langan (izosiano)", prefix: "izosiano-" },
    colorA: "Qizil-sariq",
    colorB: "To'q ko'k (Berlin ko'ki)",
    stabilityA: "Fe(III) uchun juda turg'un — π-akseptor CN⁻",
    stabilityB: "Ko'prik holatida — Fe(II)–C≡N–Fe(III)",
    bondLengthA: "Fe–C ≈ 1.92 Å (kuchli σ+π bog'lanish)",
    bondLengthB: "Fe–N ≈ 2.03 Å",
    ligandBondsA: "C≡N (1.16 Å) — uch bog'lanish",
    ligandBondsB: "C≡N (1.14 Å) ko'prik holida",
    photochromism: "Berlin ko'kida CN⁻ ko'prik sifatida ikkala uchida ham bog'langan — bir vaqtda C va N orqali. Mixed valence.",
    hsab: "CN⁻ — π-akseptor ligand. C atomi past elektronegativlikka ega, σ-donor va π-akseptor sifatida yaxshi ishlaydi. N atomi — kuchsizroq donor.",
    discovery: "Berlin ko'ki 1704-yilda Berlinda tasodifan yaratildi — bu insoniyat tarixidagi eng qadimgi sintetik pigmentlardan biri. Uning tuzilishi Fe(II)–C≡N–Fe(III) ko'priklardan iborat ekanligi 1970-yillarda aniqlangan.",
    ambidentate: {
      structure: "⁻:C≡N: ↔ :C≡N:⁻ (C va N ikkalasi ham lone pair)",
      atomC: "sp gibridli, σ-donor + π-akseptor",
      atomN: "sp gibridli, faqat σ-donor (kuchsizroq)"
    }
  },

  // ── 4. DMSO (S vs O) ─────────────────────────────
  PdDMSO: {
    id: "PdDMSO",
    title: "DMSO — S/O bog'lanish",
    ligandFormula: "(CH₃)₂SO",
    ligandName: "dimetilsulfoksid (DMSO)",
    formulaA: "[Pd(DMSO)₄]²⁺ (S orqali)",
    formulaB: "[Cu(DMSO)₆]²⁺ (O orqali)",
    nameA: "Tetrakis(S-DMSO)palladiy(II)",
    nameB: "Geksakis(O-DMSO)mis(II)",
    center: { element: "Pd", color: CPK.Pd, radius: 0.4, charge: "+2" },
    donorA: { atom: "S", color: CPK.S, name: "S-bog'langan", prefix: "S-DMSO" },
    donorB: { atom: "O", color: CPK.O, name: "O-bog'langan", prefix: "O-DMSO" },
    colorA: "Kremrang (Pd-S)",
    colorB: "Ko'k (Cu-O)",
    stabilityA: "Pd(II) — yumshoq kislota → S ga bog'lanadi (HSAB)",
    stabilityB: "Cu(II) — o'rta kislota, ba'zan O ga bog'lanadi",
    bondLengthA: "Pd–S ≈ 2.24 Å",
    bondLengthB: "Cu–O ≈ 2.05 Å",
    ligandBondsA: "S=O (1.48 Å), S–CH₃ × 2",
    ligandBondsB: "S=O (1.52 Å) — cho'ziladi",
    photochromism: "Ba'zi metallar (Ru, Rh) uchun UV yorug'lik ta'sirida DMSO S↔O bog'lanish o'zgarishi kuzatilgan (linkage photoisomerism).",
    hsab: "DMSO — klassik HSAB ambidentat: S (yumshoq) va O (qattiq) donorlarga ega. Metall qattiqligiga qarab tanlanadi.",
    discovery: "DMSO ning ambidentat xususiyati 1960-yillarda Cotton va Francis tomonidan o'rganilgan. IR spektroskopiyada S=O tebranishining o'zgarishi bog'lanish turini aniqlashga imkon beradi.",
    ambidentate: {
      structure: "(CH₃)₂S=O ↔ (CH₃)₂S⁺–O⁻ (rezonans)",
      atomS: "sp³ gibridli, S lone pair (yumshoq donor)",
      atomO: "sp² gibridli, O lone pair (qattiq donor)"
    }
  },

  // ── 5. Nitrit tarixiy — Werner-Jørgensen tortishuvi ──
  CoNO2Historic: {
    id: "CoNO2Historic",
    title: "Werner–Jørgensen tortishuvi",
    ligandFormula: "NO₂⁻",
    ligandName: "nitrit ioni — tarixiy tahlil",
    formulaA: "[Co(NH₃)₅(NO₂)]Cl₂ (sariq)",
    formulaB: "[Co(NH₃)₅(ONO)]Cl₂ (qizil)",
    nameA: "Krokso tuzi (Croceo — sariq)",
    nameB: "Ksanto tuzi (Xantho — qizg'ish)",
    center: { element: "Co", color: CPK.Co, radius: 0.4, charge: "+3" },
    donorA: { atom: "N", color: CPK.N, name: "N-bog'langan (nitro)", prefix: "nitro-" },
    donorB: { atom: "O", color: CPK.O, name: "O-bog'langan (nitrito)", prefix: "nitrito-" },
    colorA: "Sariq (Croceo)",
    colorB: "Qizil-jigarrang (Xantho)",
    stabilityA: "Turg'un shakl — vaqt o'tishi bilan ONO → NO₂",
    stabilityB: "Kinetik mahsulot — sekin izomerlanadi",
    bondLengthA: "Co–N (nitro)",
    bondLengthB: "Co–O (nitrito)",
    ligandBondsA: "Simmetrik N=O bog'lanishlar",
    ligandBondsB: "Asimmetrik: N=O va N–O",
    photochromism: "Adamson (1963) — birinchi bo'lib UV nurlanish orqali ONO → NO₂ konvertsiyasini yorug'lik kimyosida namoyish etdi.",
    hsab: "Tarixiy jihatdan Jørgensen 'zanjir nazariyasi'ni (chain theory) himoya qildi. Werner koordinatsion sferani taklif qildi va g'alaba qozondi.",
    discovery: "1893 — S.M. Jørgensen (Kopengagen universiteti) sariq va qizil rangdagi ikki xil krisstallni ajratdi. Werner ularni koordinatsion sfera nazariyasi orqali tushuntirdi. Bu Werner–Jørgensen tortishuvining muhim epizodi bo'ldi.",
    ambidentate: {
      structure: "Nitrit ioni: [O=N–O]⁻ ↔ [O–N=O]⁻",
      atomN: "sp² gibridli",
      atomO: "sp² gibridli"
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶ LS)", color: "#F090A0" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d³ 4s¹", oxidation: "+3", role: "Markaziy ion (d³)", color: "#8A99C7" },
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "Markaziy ion (d⁵)", color: "#E06633" },
  Pd: { name: "Palladiy (Pd)", atomic: 46, mass: "106.42 u", config: "[Kr] 4d¹⁰", oxidation: "+2", role: "Markaziy ion (d⁸)", color: "#006985" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.55 u", config: "[Ar] 3d⁹", oxidation: "+2", role: "Markaziy ion (d⁹)", color: "#C88033" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Ambidentat donor", hybridization: "sp/sp²/sp³", color: "#3050F8" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "Ambidentat donor (qattiq)", hybridization: "sp²/sp³", color: "#FF0D0D" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "π-akseptor donor (CN⁻)", hybridization: "sp", color: "#909090" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u", config: "[Ne] 3s² 3p⁴", role: "Yumshoq donor (SCN⁻, DMSO)", hybridization: "sp³", color: "#FFFF30" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Ligand tarkibi (NH₃, H₂O)", color: "#FFFFFF" }
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
export default function BoglanishIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const leftGroupRef = useRef(null)
  const rightGroupRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const highlightRef = useRef([])
  const photoAnimRef = useRef({ active: false, progress: 0, direction: 1 })

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentIsomer, setCurrentIsomer] = useState("CoNO2")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both") // both | A | B
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(true)
  const [showDonorHighlight, setShowDonorHighlight] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [photoIsomerize, setPhotoIsomerize] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, ambidentate: true, hsab: true, structure: true,
    thermodynamics: true, photochromism: true, history: true, table: true, references: true
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

  const isomer = LINKAGE_ISOMERS[currentIsomer]

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

  // Ikkilangan bog'lanish (double bond) — ikki paralel tsilindr
  const createDoubleBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.045) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    // Perpendikulyar vektor
    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(direction, Math.abs(direction.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize().multiplyScalar(0.12)

    ;[perp, perp.clone().negate()].forEach(offset => {
      const geo = new THREE.CylinderGeometry(radius, radius, length, 12)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.75 })
      const bond = new THREE.Mesh(geo, mat)
      bond.position.copy(midpoint).add(offset)
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
      parent.add(bond)
      bondsRef.current.push(bond)
    })
  }, [])

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND — to'g'ri sp³ tetraedrik
  // ═══════════════════════════════════════════════════════════
  const createNH3 = useCallback((parent, nPos, centerPos, showH) => {
    const group = new THREE.Group()
    const nGeo = new THREE.SphereGeometry(0.24, 32, 32)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: false, ligandName: 'NH₃' }
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
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // H₂O LIGAND
  // ═══════════════════════════════════════════════════════════
  const createH2O = useCallback((parent, oPos, centerPos, showH) => {
    const group = new THREE.Group()
    const oGeo = new THREE.SphereGeometry(0.22, 32, 32)
    const oMat = new THREE.MeshStandardMaterial({
      color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.1
    })
    const oMesh = new THREE.Mesh(oGeo, oMat)
    oMesh.position.copy(oPos)
    oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'H₂O' }
    group.add(oMesh)
    atomsRef.current.push(oMesh)
    createBond(group, centerPos, oPos, CPK.bond, 0.06)

    if (showH) {
      const outward = oPos.clone().sub(centerPos).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      // H2O ~ 104.5°
      ;[+1, -1].forEach(sign => {
        const hDir = outward.clone().multiplyScalar(0.3).add(perp.clone().multiplyScalar(0.32 * sign))
        const hPos = oPos.clone().add(hDir)
        const hGeo = new THREE.SphereGeometry(0.1, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, oPos, hPos, 0x666677, 0.03, 0.5)
      })
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // NO₂ / ONO LIGAND — nitro yoki nitrito shakli
  // ═══════════════════════════════════════════════════════════
  const createNitroLigand = useCallback((parent, centerPos, direction, form, isHighlight) => {
    // form: "N" (nitro) yoki "O" (nitrito)
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    // Perpendikulyar vektorlar (O atomlarni yoyish uchun)
    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()

    if (form === "N") {
      // ── NITRO: M–N(=O)(=O) ──
      const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.94))
      const nGeo = new THREE.SphereGeometry(0.24, 32, 32)
      const emissiveColor = isHighlight ? CPK.highlight : CPK.N
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.3, metalness: 0.2,
        emissive: emissiveColor, emissiveIntensity: isHighlight ? 0.6 : 0.2
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true, ligandName: 'NO₂ (nitro)' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)
      if (isHighlight) highlightRef.current.push(nMesh)

      // Highlight halo — donor atom atrofida
      if (isHighlight) {
        const haloGeo = new THREE.SphereGeometry(0.4, 24, 24)
        const haloMat = new THREE.MeshBasicMaterial({
          color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false
        })
        const halo = new THREE.Mesh(haloGeo, haloMat)
        halo.position.copy(nPos)
        halo.userData = { isHalo: true }
        group.add(halo)
        highlightRef.current.push(halo)
      }

      createBond(group, centerPos, nPos, CPK.bond, 0.07, 0.85)

      // 2 ta O atomi — nitro tekislikda (M dan qarab)
      const oDist = 1.22 // N=O
      const oAngle = (120 * Math.PI) / 180 // 120° NO2 burchak
      ;[+1, -1].forEach(sign => {
        // O pozitsiyasi — N dan chiqib, dir bilan 120° hosil qilib
        const oDir = dir.clone().multiplyScalar(Math.cos(oAngle))
          .add(perp.clone().multiplyScalar(Math.sin(oAngle) * sign))
        const oPos = nPos.clone().add(oDir.multiplyScalar(oDist))
        const oGeo = new THREE.SphereGeometry(0.2, 28, 28)
        const oMat = new THREE.MeshStandardMaterial({
          color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15
        })
        const oMesh = new THREE.Mesh(oGeo, oMat)
        oMesh.position.copy(oPos)
        oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₂ (nitro)' }
        group.add(oMesh)
        atomsRef.current.push(oMesh)
        // Ikkilangan bog' N=O (rezonans)
        createDoubleBond(group, nPos, oPos, 0xaa4444, 0.04)
      })
    } else {
      // ── NITRITO: M–O–N=O ──
      const oPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99))
      const emissiveColor = isHighlight ? CPK.highlight : CPK.O
      const oGeo = new THREE.SphereGeometry(0.24, 32, 32)
      const oMat = new THREE.MeshStandardMaterial({
        color: CPK.O, roughness: 0.3, metalness: 0.2,
        emissive: emissiveColor, emissiveIntensity: isHighlight ? 0.6 : 0.2
      })
      const oMesh = new THREE.Mesh(oGeo, oMat)
      oMesh.position.copy(oPos)
      oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, isDonor: true, ligandName: 'ONO (nitrito)' }
      group.add(oMesh)
      atomsRef.current.push(oMesh)
      if (isHighlight) highlightRef.current.push(oMesh)

      if (isHighlight) {
        const haloGeo = new THREE.SphereGeometry(0.4, 24, 24)
        const haloMat = new THREE.MeshBasicMaterial({
          color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false
        })
        const halo = new THREE.Mesh(haloGeo, haloMat)
        halo.position.copy(oPos)
        halo.userData = { isHalo: true }
        group.add(halo)
        highlightRef.current.push(halo)
      }

      createBond(group, centerPos, oPos, CPK.bond, 0.07, 0.85)

      // N atomi — O dan chiqib (~115° burchak)
      const nAngle = (115 * Math.PI) / 180
      const nDir = dir.clone().multiplyScalar(Math.cos(nAngle)).add(perp.clone().multiplyScalar(Math.sin(nAngle)))
      const nPos = oPos.clone().add(nDir.clone().multiplyScalar(1.31))
      const nGeo = new THREE.SphereGeometry(0.22, 28, 28)
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'ONO (nitrito)' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)
      // O-N (yakka bog')
      createBond(group, oPos, nPos, 0x556699, 0.05, 0.75)

      // Terminal O (=O)
      const oTerminalDir = nDir.clone().multiplyScalar(Math.cos(nAngle)).add(perp.clone().multiplyScalar(-Math.sin(nAngle)))
      const oTerminalPos = nPos.clone().add(oTerminalDir.multiplyScalar(1.20))
      const oT = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oT.position.copy(oTerminalPos)
      oT.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'ONO (nitrito)' }
      group.add(oT)
      atomsRef.current.push(oT)
      createDoubleBond(group, nPos, oTerminalPos, 0xaa4444, 0.04)
    }

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // SCN LIGAND — chiziqli S=C=N ligand
  // form: "N" (izotiotsianato, M–NCS) yoki "S" (tiotsianato, M–SCN)
  // ═══════════════════════════════════════════════════════════
  const createSCN = useCallback((parent, centerPos, direction, form, isHighlight) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()

    if (form === "N") {
      // M–N=C=S (chiziqli)
      const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99))
      const cPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99 + 1.16))
      const sPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99 + 1.16 + 1.63))

      const nGeo = new THREE.SphereGeometry(0.22, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.3, metalness: 0.2,
        emissive: isHighlight ? CPK.highlight : CPK.N,
        emissiveIntensity: isHighlight ? 0.6 : 0.15
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true, ligandName: 'NCS (izotiotsianato)' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)
      if (isHighlight) highlightRef.current.push(nMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(nPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'NCS' }
      group.add(cMesh)
      atomsRef.current.push(cMesh)

      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 32, 32),
        new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.4, metalness: 0.3, emissive: CPK.S, emissiveIntensity: 0.15 })
      )
      sMesh.position.copy(sPos)
      sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'NCS' }
      group.add(sMesh)
      atomsRef.current.push(sMesh)

      createBond(group, centerPos, nPos, CPK.bond, 0.07, 0.85)
      createDoubleBond(group, nPos, cPos, 0x556699, 0.04)
      createDoubleBond(group, cPos, sPos, 0xaaaa33, 0.04)
    } else {
      // M–S–C≡N (bukilgan Cr–S–C ≈ 108°)
      const sPos = centerPos.clone().add(dir.clone().multiplyScalar(2.33))

      const up = new THREE.Vector3(0, 1, 0)
      const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
      const bendAngle = (108 * Math.PI) / 180
      // C — S dan chiqib bukiladi
      const cDir = dir.clone().multiplyScalar(Math.cos(bendAngle)).add(perp.clone().multiplyScalar(Math.sin(bendAngle)))
      const cPos = sPos.clone().add(cDir.clone().multiplyScalar(1.63))
      // N — C dan chiziqli (C≡N)
      const nPos = cPos.clone().add(cDir.clone().multiplyScalar(1.16))

      const sGeo = new THREE.SphereGeometry(0.28, 32, 32)
      const sMat = new THREE.MeshStandardMaterial({
        color: CPK.S, roughness: 0.3, metalness: 0.3,
        emissive: isHighlight ? CPK.highlight : CPK.S,
        emissiveIntensity: isHighlight ? 0.6 : 0.15
      })
      const sMesh = new THREE.Mesh(sGeo, sMat)
      sMesh.position.copy(sPos)
      sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, isDonor: true, ligandName: 'SCN (tiotsianato)' }
      group.add(sMesh)
      atomsRef.current.push(sMesh)
      if (isHighlight) highlightRef.current.push(sMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(sPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'SCN' }
      group.add(cMesh)
      atomsRef.current.push(cMesh)

      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
      )
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'SCN' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)

      createBond(group, centerPos, sPos, CPK.bond, 0.07, 0.85)
      createBond(group, sPos, cPos, 0xaaaa33, 0.05, 0.8)
      // C≡N (3-bog')
      createDoubleBond(group, cPos, nPos, 0x556699, 0.04)
      createBond(group, cPos, nPos, 0x556699, 0.045, 0.7)
    }

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // CN LIGAND — siano (M–C≡N) yoki izosiano (M–N≡C)
  // ═══════════════════════════════════════════════════════════
  const createCN = useCallback((parent, centerPos, direction, form, isHighlight) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()

    if (form === "C") {
      // M–C≡N (siano)
      const cPos = centerPos.clone().add(dir.clone().multiplyScalar(1.92))
      const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.92 + 1.16))

      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 32, 32),
        new THREE.MeshStandardMaterial({
          color: CPK.C, roughness: 0.3, metalness: 0.2,
          emissive: isHighlight ? CPK.highlight : CPK.C,
          emissiveIntensity: isHighlight ? 0.6 : 0.1
        })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, isDonor: true, ligandName: 'CN (siano)' }
      group.add(cMesh)
      atomsRef.current.push(cMesh)
      if (isHighlight) highlightRef.current.push(cMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(cPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
      )
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'CN' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)

      createBond(group, centerPos, cPos, CPK.bond, 0.07, 0.85)
      // C≡N — 3 ta bog'
      createDoubleBond(group, cPos, nPos, 0x556699, 0.04)
      createBond(group, cPos, nPos, 0x556699, 0.045, 0.7)
    } else {
      // M–N≡C (izosiano)
      const nPos = centerPos.clone().add(dir.clone().multiplyScalar(2.03))
      const cPos = centerPos.clone().add(dir.clone().multiplyScalar(2.03 + 1.14))

      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 32, 32),
        new THREE.MeshStandardMaterial({
          color: CPK.N, roughness: 0.3, metalness: 0.2,
          emissive: isHighlight ? CPK.highlight : CPK.N,
          emissiveIntensity: isHighlight ? 0.6 : 0.15
        })
      )
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true, ligandName: 'NC (izosiano)' }
      group.add(nMesh)
      atomsRef.current.push(nMesh)
      if (isHighlight) highlightRef.current.push(nMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(nPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'NC' }
      group.add(cMesh)
      atomsRef.current.push(cMesh)

      createBond(group, centerPos, nPos, CPK.bond, 0.07, 0.85)
      createDoubleBond(group, nPos, cPos, 0x556699, 0.04)
      createBond(group, nPos, cPos, 0x556699, 0.045, 0.7)
    }

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // DMSO LIGAND
  // form: "S" — M–S(=O)Me₂ ; "O" — M–O=S(Me₂)
  // ═══════════════════════════════════════════════════════════
  const createDMSO = useCallback((parent, centerPos, direction, form, isHighlight) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const up = new THREE.Vector3(0, 1, 0)
    const perp1 = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()

    if (form === "S") {
      // M–S(=O)(CH₃)₂
      const sPos = centerPos.clone().add(dir.clone().multiplyScalar(2.24))
      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 32, 32),
        new THREE.MeshStandardMaterial({
          color: CPK.S, roughness: 0.3, metalness: 0.3,
          emissive: isHighlight ? CPK.highlight : CPK.S,
          emissiveIntensity: isHighlight ? 0.6 : 0.15
        })
      )
      sMesh.position.copy(sPos)
      sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, isDonor: true, ligandName: 'DMSO (S-bog\'langan)' }
      group.add(sMesh)
      atomsRef.current.push(sMesh)
      if (isHighlight) highlightRef.current.push(sMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(sPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      createBond(group, centerPos, sPos, CPK.bond, 0.07, 0.85)

      // O piramidaning tepasida
      const oPos = sPos.clone().add(perp2.clone().multiplyScalar(1.48))
      const oMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oMesh.position.copy(oPos)
      oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'DMSO' }
      group.add(oMesh)
      atomsRef.current.push(oMesh)
      createDoubleBond(group, sPos, oPos, 0xaa4444, 0.04)

      // 2 ta CH₃ (uglerod) — piramida qanotlari
      ;[+1, -1].forEach(sign => {
        const cPos = sPos.clone().add(perp1.clone().multiplyScalar(0.9 * sign)).add(dir.clone().multiplyScalar(0.6))
        const cMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 24, 24),
          new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
        )
        cMesh.position.copy(cPos)
        cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'DMSO CH₃' }
        group.add(cMesh)
        atomsRef.current.push(cMesh)
        createBond(group, sPos, cPos, 0x777788, 0.045, 0.7)
      })
    } else {
      // M–O=S(CH₃)₂
      const oPos = centerPos.clone().add(dir.clone().multiplyScalar(2.05))
      const oMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 32, 32),
        new THREE.MeshStandardMaterial({
          color: CPK.O, roughness: 0.3, metalness: 0.2,
          emissive: isHighlight ? CPK.highlight : CPK.O,
          emissiveIntensity: isHighlight ? 0.6 : 0.2
        })
      )
      oMesh.position.copy(oPos)
      oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, isDonor: true, ligandName: 'DMSO (O-bog\'langan)' }
      group.add(oMesh)
      atomsRef.current.push(oMesh)
      if (isHighlight) highlightRef.current.push(oMesh)

      if (isHighlight) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.highlight, transparent: true, opacity: 0.2, depthWrite: false })
        )
        halo.position.copy(oPos)
        group.add(halo)
        highlightRef.current.push(halo)
      }

      createBond(group, centerPos, oPos, CPK.bond, 0.07, 0.85)

      // S — O dan chiqib
      const sPos = oPos.clone().add(dir.clone().multiplyScalar(1.52))
      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.3, metalness: 0.3, emissive: CPK.S, emissiveIntensity: 0.15 })
      )
      sMesh.position.copy(sPos)
      sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'DMSO' }
      group.add(sMesh)
      atomsRef.current.push(sMesh)
      createDoubleBond(group, oPos, sPos, 0xaa4444, 0.04)

      // 2 ta CH₃
      ;[+1, -1].forEach(sign => {
        const cPos = sPos.clone().add(perp1.clone().multiplyScalar(0.9 * sign)).add(dir.clone().multiplyScalar(0.6))
        const cMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 24, 24),
          new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
        )
        cMesh.position.copy(cPos)
        cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'DMSO CH₃' }
        group.add(cMesh)
        atomsRef.current.push(cMesh)
        createBond(group, sPos, cPos, 0x777788, 0.045, 0.7)
      })
    }

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // OKTAEDRIK PENTAAMMINE — 5 ta NH₃ + 1 ta ambidentat
  // ═══════════════════════════════════════════════════════════
  const buildOctahedralPentaammine = useCallback((group, offsetX, isomerData, form, isHighlight) => {
    const { center } = isomerData
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    const dist = 1.94 // Co–N (ligand donor position)

    // Markaziy metall
    const cGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.9,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(centerPos)
    cMesh.userData = { type: 'atom', element: center.element, info: ATOM_INFO[center.element], isCenter: true }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    // 6 ta oktaedrik yo'nalish — 1-si ambidentat, 5 tasi NH₃
    // Ambidentat +x tomonda
    const ambidentateDir = new THREE.Vector3(1, 0, 0)
    const nh3Dirs = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
    ]

    // Ambidentat ligand
    if (isomerData.id === "CoNO2" || isomerData.id === "CoNO2Historic") {
      createNitroLigand(group, centerPos, ambidentateDir, form, isHighlight)
    } else if (isomerData.id === "CrSCN") {
      createSCN(group, centerPos, ambidentateDir, form, isHighlight)
    }

    // 5 ta NH₃ (yoki H₂O uchun Cr)
    nh3Dirs.forEach(d => {
      const nPos = centerPos.clone().add(d.clone().multiplyScalar(dist))
      if (isomerData.id === "CrSCN") {
        createH2O(group, nPos, centerPos, showHydrogens)
      } else {
        createNH3(group, nPos, centerPos, showHydrogens)
      }
    })
  }, [createNitroLigand, createSCN, createNH3, createH2O, showHydrogens])

  // ═══════════════════════════════════════════════════════════
  // OKTAEDRIK — 6 ta CN yoki DMSO
  // ═══════════════════════════════════════════════════════════
  const buildAllLigandOctahedral = useCallback((group, offsetX, isomerData, form, isHighlight) => {
    const { center } = isomerData
    const centerPos = new THREE.Vector3(offsetX, 0, 0)

    const cGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.9,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(centerPos)
    cMesh.userData = { type: 'atom', element: center.element, info: ATOM_INFO[center.element], isCenter: true }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    const dirs = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
    ]

    dirs.forEach((d, i) => {
      // Faqat birinchisini highlight qilamiz (misol tariqasida)
      const hl = isHighlight && i === 0
      if (isomerData.id === "FeCN") {
        createCN(group, centerPos, d, form, hl)
      } else if (isomerData.id === "PdDMSO") {
        // Pd — kvadrat-planar, faqat 4 ta
        if (i < 4) createDMSO(group, centerPos, d, form, hl)
      }
    })
  }, [createCN, createDMSO])

  // ═══════════════════════════════════════════════════════════
  // MOLEKULA QURISH — asosiy funksiya
  // ═══════════════════════════════════════════════════════════
  const buildIsomer = useCallback((group, offsetX, isomerData, form, isHighlight) => {
    if (isomerData.id === "CoNO2" || isomerData.id === "CoNO2Historic" || isomerData.id === "CrSCN") {
      buildOctahedralPentaammine(group, offsetX, isomerData, form, isHighlight)
    } else if (isomerData.id === "FeCN" || isomerData.id === "PdDMSO") {
      buildAllLigandOctahedral(group, offsetX, isomerData, form, isHighlight)
    }

    // Formula sprite
    if (showLabels) {
      const isFormA = (form === "N" || form === "C" || form === "S")
        ? (isomerData.donorA.atom === form)
        : (isomerData.donorB.atom === form)
      // Aniqroq: qaysi shakl mos keladi
      const isA = isomerData.donorA.atom === form
      const formulaText = isA ? isomerData.formulaA : isomerData.formulaB
      const donorLabel = isA ? isomerData.donorA.prefix : isomerData.donorB.prefix
      const bg = isA ? "rgba(30, 90, 50, 0.85)" : "rgba(120, 30, 30, 0.85)"
      const border = isA ? "#5fdc7c" : "#ff6b6b"

      const sprite = makeTextSprite(formulaText, {
        fontSize: 44, color: "#ffffff", bgColor: bg, borderColor: border, scale: 0.42
      })
      sprite.position.set(offsetX, 3.3, 0)
      group.add(sprite)
      labelsRef.current.push(sprite)

      const sub = makeTextSprite(donorLabel, {
        fontSize: 36, color: isA ? "#5fdc7c" : "#ffaaaa",
        bgColor: "rgba(10, 5, 25, 0.8)", borderColor: border, scale: 0.38
      })
      sub.position.set(offsetX, 2.7, 0)
      group.add(sub)
      labelsRef.current.push(sub)
    }
  }, [buildOctahedralPentaammine, buildAllLigandOctahedral, showLabels])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (leftGroupRef.current) {
      scene.remove(leftGroupRef.current)
      leftGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }
    if (rightGroupRef.current) {
      scene.remove(rightGroupRef.current)
      rightGroupRef.current.traverse(o => {
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
    highlightRef.current = []

    const leftGroup = new THREE.Group()
    const rightGroup = new THREE.Group()
    leftGroupRef.current = leftGroup
    rightGroupRef.current = rightGroup

    const formA = isomer.donorA.atom
    const formB = isomer.donorB.atom

    if (viewMode === "both") {
      buildIsomer(leftGroup, -3.5, isomer, formA, showDonorHighlight)
      buildIsomer(rightGroup, 3.5, isomer, formB, showDonorHighlight)
    } else if (viewMode === "A") {
      buildIsomer(leftGroup, 0, isomer, formA, showDonorHighlight)
    } else if (viewMode === "B") {
      buildIsomer(rightGroup, 0, isomer, formB, showDonorHighlight)
    }

    scene.add(leftGroup)
    scene.add(rightGroup)

    // VS belgisi
    if (viewMode === "both") {
      const vs = makeTextSprite("⇌", {
        fontSize: 96, color: "#FFD700", bgColor: "rgba(60, 40, 5, 0.9)",
        borderColor: "#FFD700", scale: 0.7
      })
      vs.position.set(0, 0.5, 0)
      scene.add(vs)
      labelsRef.current.push(vs)

      // Yorug'lik belgisi (fotoizomerizatsiya)
      const hv = makeTextSprite("hν", {
        fontSize: 44, color: "#ff88ff", bgColor: "rgba(50, 15, 55, 0.85)",
        borderColor: "#ff88ff", scale: 0.38
      })
      hv.position.set(0, 1.4, 0)
      scene.add(hv)
      labelsRef.current.push(hv)
    }
  }, [isomer, viewMode, buildIsomer, showDonorHighlight])

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
    camera.position.set(0, 4, 11)
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
    controls.autoRotateSpeed = 0.8
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(600 * 3)
    for (let i = 0; i < 600 * 3; i += 3) {
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

      // Halo pulsatsiya
      const t = performance.now() * 0.002
      highlightRef.current.forEach(m => {
        if (m.userData.isHalo) {
          const scale = 1 + Math.sin(t * 2) * 0.15
          m.scale.set(scale, scale, scale)
          if (m.material) m.material.opacity = 0.15 + Math.sin(t * 2) * 0.08
        }
      })

      // Foto-izomerizatsiya animatsiyasi (guruplarni tebrantirish)
      if (photoAnimRef.current.active) {
        photoAnimRef.current.progress += 0.008 * photoAnimRef.current.direction
        if (photoAnimRef.current.progress > 1) {
          photoAnimRef.current.progress = 1
          photoAnimRef.current.direction = -1
        } else if (photoAnimRef.current.progress < 0) {
          photoAnimRef.current.progress = 0
          photoAnimRef.current.direction = 1
        }
        const p = photoAnimRef.current.progress
        // Chap va o'ng guruplarni bir-biriga siljitish (foto animatsiya)
        if (leftGroupRef.current) {
          leftGroupRef.current.position.x = -p * 0.3
          leftGroupRef.current.rotation.y = p * 0.15
        }
        if (rightGroupRef.current) {
          rightGroupRef.current.position.x = p * 0.3
          rightGroupRef.current.rotation.y = -p * 0.15
        }
      } else {
        if (leftGroupRef.current) { leftGroupRef.current.position.x = 0; leftGroupRef.current.rotation.y = 0 }
        if (rightGroupRef.current) { rightGroupRef.current.position.x = 0; rightGroupRef.current.rotation.y = 0 }
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
  useEffect(() => { photoAnimRef.current.active = photoIsomerize }, [photoIsomerize])

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
        yellow: rgb(0.75, 0.60, 0.10),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
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
          `Bog'lanish izomeriyasi 3D Lab  •  ${cleanText(isomer.ligandFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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

      const title = "BOG'LANISH IZOMERIYASI"
      const tW = measure(title, boldFont, 24)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 85, size: 24, font: boldFont, color: C.white })

      const subtitle = "Ambidentat ligandlar va bog'lanish izomerlar tahlili"
      const sW = measure(subtitle, italicFont, 12)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 110, size: 12, font: italicFont, color: C.purpleLight })

      const formulaText = `${cleanText(isomer.formulaA)}  ⇌  ${cleanText(isomer.formulaB)}`
      const fW = measure(formulaText, boldFont, 15)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 155, size: 15, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan sistema", `${isomer.title} — ${cleanText(isomer.ligandFormula)} ambidentat ligandi`, C.bgPurple, C.purple)

      const meta = [
        ["Ambidentat ligand:", isomer.ligandName],
        ["A-donor:", `${isomer.donorA.atom} atomi (${isomer.donorA.name})`],
        ["B-donor:", `${isomer.donorB.atom} atomi (${isomer.donorB.name})`],
        ["Markaziy metall:", `${isomer.center.element}${isomer.center.charge}`]
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
        drawSectionHeader(1, "Kirish — Bog'lanish izomeriyasi nima?")
        drawParagraph(
          "Bog'lanish izomeriyasi (linkage isomerism yoki ligand isomerism) — bir xil molekulyar formulaga, bir xil ligand va markaziy atom to'plamiga ega, lekin ligand markaziy atomga qaysi donor atomi orqali bog'langanligi bilan farq qiladigan koordinatsion birikmalar hodisasidir."
        )
        drawParagraph(
          "Bu hodisa faqat AMBIDENTAT LIGAND lar bilan sodir bo'ladi. Ambidentat ligand — ikki yoki undan ortiq turli donor atomga ega bo'lgan ligand bo'lib, ular metall bilan har xil atomdan bog'lana oladi."
        )
        drawBulletPoint(`NO₂⁻ (nitrit ioni): N orqali → nitro (M–NO₂), O orqali → nitrito (M–ONO)`)
        drawBulletPoint(`SCN⁻ (tiotsianat ioni): N orqali → izotiotsianato (M–NCS), S orqali → tiotsianato (M–SCN)`)
        drawBulletPoint(`CN⁻ (sianid ioni): C orqali → siano (M–CN), N orqali → izosiano (M–NC)`)
        drawBulletPoint(`(CH₃)₂SO (DMSO): S orqali (M–S) yoki O orqali (M–O)`)
      }

      // ── 2. Ambidentat ligand ──
      if (pdfSections.ambidentate) {
        drawSectionHeader(2, "Ambidentat ligand — batafsil tuzilishi")
        drawInfoBox(
          `${cleanText(isomer.ligandName)} tuzilishi`,
          cleanText(isomer.ambidentate.structure),
          C.bgYellow, C.yellow
        )
        drawParagraph("Donor atomlar xarakteristikasi:")
        Object.entries(isomer.ambidentate).forEach(([key, val]) => {
          if (key === "structure") return
          checkBreak(20)
          const atomLabel = key.replace("atom", "") + " atomi"
          page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2.5, color: C.purple })
          page.drawText(`${atomLabel}:`, { x: MARGIN + 20, y, size: 10.5, font: boldFont, color: C.purple })
          const wrapped = wrapText(cleanText(val), regularFont, 10.5, CONTENT_W - 120)
          wrapped.forEach((ln, i) => {
            if (i > 0) checkBreak(15); if (i > 0) page.drawText("", { x: MARGIN + 20, y })
            page.drawText(ln, { x: MARGIN + 90, y: y - i * 14, size: 10.5, font: regularFont, color: C.textDark })
          })
          y -= 15 + (wrapped.length - 1) * 14
        })
        y -= 5
      }

      // ── 3. HSAB nazariyasi ──
      if (pdfSections.hsab) {
        drawSectionHeader(3, "HSAB nazariyasi va donor tanlash")
        drawParagraph(
          "Pearson HSAB (Hard-Soft Acid-Base) nazariyasi (1963) — bog'lanish izomeriyasida donor atomni bashorat qilishning eng muhim vositasi. Nazariya bo'yicha: QATTIQ kislotalar qattiq asoslarni afzal ko'radi, YUMSHOQ kislotalar yumshoq asoslarni afzal ko'radi."
        )
        drawInfoBox("Qattiq kislotalar", "Yuqori zaryad, kichik radius, past polyarlanish: H⁺, Li⁺, Na⁺, Mg²⁺, Al³⁺, Ti⁴⁺, Cr³⁺, Fe³⁺, Co³⁺", C.bgBlue, C.blue)
        drawInfoBox("Yumshoq kislotalar", "Past zaryad, katta radius, yuqori polyarlanish: Cu⁺, Ag⁺, Au⁺, Cd²⁺, Hg²⁺, Pd²⁺, Pt²⁺", C.bgOrange, C.orange)
        drawInfoBox("Qattiq asoslar (donorlar)", "F⁻, OH⁻, O²⁻, NO₃⁻, NH₃, H₂O — kichik va elektronegativ atomlar (N, O, F)", C.bgBlue, C.blue)
        drawInfoBox("Yumshoq asoslar (donorlar)", "I⁻, H⁻, CN⁻, SCN⁻ (S), R₂S, CO — katta va polyarlanuvchi atomlar (S, P, I, C)", C.bgOrange, C.orange)
        drawInfoBox(`Ushbu tizim uchun HSAB tahlili`, cleanText(isomer.hsab), C.bgYellow, C.yellow)
      }

      // ── 4. Struktura va bog' uzunliklari ──
      if (pdfSections.structure) {
        drawSectionHeader(4, "Fazoviy tuzilish va bog'lanish parametrlari")
        drawInfoBox(
          `${isomer.donorA.prefix}shakl (${isomer.donorA.atom}-bog'langan)`,
          `Bog' uzunligi: ${isomer.bondLengthA}. Ichki ligand bog'lanishlar: ${isomer.ligandBondsA}. Rangi: ${isomer.colorA}.`,
          C.bgGreen, C.green
        )
        drawInfoBox(
          `${isomer.donorB.prefix}shakl (${isomer.donorB.atom}-bog'langan)`,
          `Bog' uzunligi: ${isomer.bondLengthB}. Ichki ligand bog'lanishlar: ${isomer.ligandBondsB}. Rangi: ${isomer.colorB}.`,
          C.bgRed, C.red
        )
      }

      // ── 5. Termodinamika ──
      if (pdfSections.thermodynamics) {
        drawSectionHeader(5, "Termodinamik va kinetik jihatlar")
        drawParagraph(
          "Bog'lanish izomerlar orasidagi barqarorlik farqi ko'pincha KINETIK va TERMODINAMIK boshqaruv o'rtasidagi klassik farqni namoyish qiladi:"
        )
        drawInfoBox(`${isomer.donorA.atom}-bog'langan (${isomer.donorA.prefix}shakl) barqarorlik`, cleanText(isomer.stabilityA), C.bgGreen, C.green)
        drawInfoBox(`${isomer.donorB.atom}-bog'langan (${isomer.donorB.prefix}shakl) barqarorlik`, cleanText(isomer.stabilityB), C.bgRed, C.red)
        drawParagraph(
          "Kinetik mahsulot dastlab tez hosil bo'ladi (past aktivlanish energiyasi), lekin termodinamik mahsulot vaqt o'tishi bilan ko'proq hosil bo'ladi (past umumiy energiya). Bog'lanish izomerlar orasidagi o'tish tanlangan sharoitda yopilib qolgan kinetik holatda saqlanishi mumkin."
        )
      }

      // ── 6. Fotoxromizm ──
      if (pdfSections.photochromism) {
        drawSectionHeader(6, "Fotoxromizm va fotoizomerlanish")
        drawInfoBox("Yorug'lik ta'siridagi izomerlanish", cleanText(isomer.photochromism), C.bgPurple, C.purple)
        drawParagraph(
          "Fotoxromizm — molekula UV yoki ko'rinadigan yorug'lik ta'sirida rangini yoki tuzilishini teskari o'zgartira olish qobiliyati. Koordinatsion kimyoda bog'lanish izomerlar orasidagi fotoxromik o'tishlar birinchi bor 1963-yilda A.W. Adamson tomonidan [Co(NH₃)₅(ONO)]²⁺ komplekasida namoyish etilgan."
        )
        drawParagraph(
          "Bu hodisa quyidagi amaliy sohalarda foydali: molekulyar switchlar, ma'lumot saqlash, sensorlar, molekulyar mashinalar."
        )
      }

      // ── 7. Tarix ──
      if (pdfSections.history) {
        drawSectionHeader(7, "Kashfiyot tarixi")
        drawParagraph(cleanText(isomer.discovery))
        drawInfoBox(
          "Werner–Jørgensen tortishuvi",
          "Sofus Mads Jørgensen (Kopengagen) va Alfred Werner (Sürix) o'rtasidagi ilmiy tortishuv 1890-yillarda koordinatsion kimyoning asosini shakllantirdi. Jørgensen 'zanjir nazariyasi'ni (chain theory) himoya qildi, Werner esa markaziy metall atrofidagi koordinatsion sferani taklif qildi. Bog'lanish izomerlarning kashf etilishi — Werner nazariyasining tajribaviy tasdiqidan biri edi. 1913-yilda Werner shu ish uchun Nobel mukofotini oldi.",
          C.bgPurple, C.purple
        )
      }

      // ── 8. Solishtirish jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(8, "Solishtirish jadvali")
        const rows = [
          ["Xususiyat", `${isomer.donorA.prefix}shakl`, `${isomer.donorB.prefix}shakl`],
          ["Formula", cleanText(isomer.formulaA), cleanText(isomer.formulaB)],
          ["Donor atomi", isomer.donorA.atom, isomer.donorB.atom],
          ["Bog' uzunligi", isomer.bondLengthA, isomer.bondLengthB],
          ["Rang", isomer.colorA, isomer.colorB],
          ["Barqarorlik", isomer.stabilityA.slice(0, 30) + "...", isomer.stabilityB.slice(0, 30) + "..."]
        ]

        const colW = [CONTENT_W * 0.25, CONTENT_W * 0.375, CONTENT_W * 0.375]
        const rowH = 24
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 8
          row.forEach((cell, ci) => {
            const txt = truncate(cleanText(cell), isHeader ? boldFont : regularFont, 9, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 8, size: 9,
              font: isHeader ? boldFont : regularFont,
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
          "Jørgensen, S.M. (1893). Zur Konstitution der Kobalt-, Chrom-, und Rhodium-Basen. Zeitschrift für Anorganische Chemie, 5(1), 147–196.",
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
          "Pearson, R.G. (1963). Hard and Soft Acids and Bases. Journal of the American Chemical Society, 85(22), 3533–3539.",
          "Adamson, A.W. (1963). Photochemistry of Complex Ions. VI. Comparative Photochemistry of Some Amine-Halide and Amine-Water Chromium(III) Complexes. Journal of the American Chemical Society, 85, 3183.",
          "Basolo, F., Hammaker, G.S. (1962). Linkage Isomerism in Metal Complexes. Journal of the American Chemical Society, 84, 1441.",
          "Burmeister, J.L. (1968). Ambidentate Ligands, the Schizophrenics of Coordination Chemistry. Coordination Chemistry Reviews, 3(2), 225–245.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 20 — d-block Metal Chemistry.",
          "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson. Chapter 9 — Coordination Compounds.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — Recommendations 2005. RSC Publishing."
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

      pdfDoc.setTitle(`Bog'lanish izomeriyasi — ${cleanText(isomer.ligandFormula)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning bog'lanish izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["bog'lanish izomeriyasi", "ambidentat ligand", "HSAB", "linkage isomerism"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `boglanish-izomeriya-${isomer.id}.pdf`
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
            href="/oquv/izomeriyasi/tuzilish/boglanish"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-pink-300 flex items-center gap-2 truncate">
              <span>🔗</span>
              <span className="hidden sm:inline">Bog'lanish izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Bog'lanish 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {isomer.ligandFormula} • {isomer.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentIsomer}
            onChange={(e) => setCurrentIsomer(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[240px]"
          >
            <option value="CoNO2">[Co(NH₃)₅NO₂] — nitro/nitrito</option>
            <option value="CrSCN">[Cr(H₂O)₅SCN] — SCN/NCS</option>
            <option value="FeCN">[Fe(CN)₆] — siano/izosiano</option>
            <option value="PdDMSO">Pd-DMSO — S vs O</option>
            <option value="CoNO2Historic">Werner–Jørgensen (tarix)</option>
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
            onClick={() => togglePanel("hsab")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "hsab" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="HSAB nazariyasi"
          >⚖️</button>

          <button
            onClick={() => togglePanel("compare")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Solishtirish jadvali"
          >📊</button>

          <button
            onClick={() => togglePanel("photo")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "photo" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Fotoxromizm"
          >💡</button>

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Werner–Jørgensen tarixi"
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
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[275px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
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
                <div className="text-[11px] text-purple-400 mb-1">Rejim:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setViewMode("both")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "both" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>Ikkalasi</button>
                  <button onClick={() => setViewMode("A")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "A" ? 'bg-green-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    {isomer.donorA.atom}-shakl
                  </button>
                  <button onClick={() => setViewMode("B")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "B" ? 'bg-red-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    {isomer.donorB.atom}-shakl
                  </button>
                </div>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar (H)</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Donor atom yorqinligi 🌟</span>
                  <input type="checkbox" checked={showDonorHighlight} onChange={(e) => setShowDonorHighlight(e.target.checked)} className="accent-yellow-500" />
                </label>
              </div>
            )}

            {/* — ILMIY ASBOBLAR — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🔬</span> Ilmiy asboblar</span>
              <span>{expandedSection === "scientific" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "scientific" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setPhotoIsomerize(!photoIsomerize)}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${photoIsomerize ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>💡</span> hν foto-izomerlanish</span>
                  <span>{photoIsomerize ? "⏸" : "▶"}</span>
                </button>
                <p className="text-[10px] text-purple-400 italic px-1">
                  UV yorug'lik ta'sirida bog'lanish izomerlar orasidagi o'tishni simulyatsiya qiladi (Adamson, 1963).
                </p>
                <div className="border-t border-purple-800/40 pt-2 mt-2">
                  <div className="text-[10px] text-purple-400 mb-1">🎯 Donor atom yo'nalishi</div>
                  <div className="bg-purple-900/30 rounded-lg p-2 space-y-1">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: `#${isomer.donorA.color.toString(16).padStart(6,'0')}`}}></span>
                      <span className="text-purple-200">A: {isomer.donorA.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: `#${isomer.donorB.color.toString(16).padStart(6,'0')}`}}></span>
                      <span className="text-purple-200">B: {isomer.donorB.name}</span>
                    </div>
                  </div>
                </div>
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

            {/* Tez kirish */}
            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                Atomga bosing — batafsil ma'lumot chiqadi. Sariq halo — bog'lovchi donor atomni ko'rsatadi. 💡 hν tugmasi UV nurlanish orqali izomerlanishni ko'rsatadi.
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
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-purple-300 text-sm">3D sahna yuklanmoqda...</p>
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
              {selectedAtom.isDonor && <div className="mt-2 text-yellow-400 font-bold">⚡ Bu — bog'lovchi donor atomi!</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">💎 Bu markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[330px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>ℹ️</span> {isomer.title}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Ambidentat ligand</div>
                <div className="font-mono text-lg text-white text-center">{isomer.ligandFormula}</div>
                <div className="text-purple-300 text-[10px] mt-1 text-center italic">{isomer.ligandName}</div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Rezonans tuzilishi</div>
                <div className="text-yellow-100 text-[11px] font-mono">{isomer.ambidentate.structure}</div>
              </div>

              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 text-[10px] uppercase tracking-wide mb-1 font-bold">
                  {isomer.donorA.prefix}shakl ({isomer.donorA.atom}-donor)
                </div>
                <div className="text-green-100 text-[11px] font-mono">{isomer.formulaA}</div>
                <div className="text-green-100 text-[10px] mt-1">{isomer.nameA}</div>
                <div className="text-green-100 text-[10px] mt-1">Bog': {isomer.bondLengthA}</div>
                <div className="text-green-100 text-[10px]">Rang: {isomer.colorA}</div>
              </div>

              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 text-[10px] uppercase tracking-wide mb-1 font-bold">
                  {isomer.donorB.prefix}shakl ({isomer.donorB.atom}-donor)
                </div>
                <div className="text-red-100 text-[11px] font-mono">{isomer.formulaB}</div>
                <div className="text-red-100 text-[10px] mt-1">{isomer.nameB}</div>
                <div className="text-red-100 text-[10px] mt-1">Bog': {isomer.bondLengthB}</div>
                <div className="text-red-100 text-[10px]">Rang: {isomer.colorB}</div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Barqarorlik</div>
                <div className="text-blue-100 text-[10px] leading-relaxed">
                  <div className="mb-1"><span className="text-green-300">▸ {isomer.donorA.atom}:</span> {isomer.stabilityA}</div>
                  <div><span className="text-red-300">▸ {isomer.donorB.atom}:</span> {isomer.stabilityB}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* — HSAB PANELI — */}
        {activePanel === "hsab" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-orange-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-orange-200 flex items-center gap-2 text-sm">
                <span>⚖️</span> HSAB — Qattiq/Yumshoq nazariyasi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-100 text-[11px] leading-relaxed">
                  <strong className="text-orange-300">Pearson qonuni (1963):</strong> Qattiq kislotalar qattiq asoslar bilan, yumshoq kislotalar yumshoq asoslar bilan afzal bog'lanadi.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-950/50 rounded-lg p-2.5 border border-blue-700/50">
                  <div className="text-blue-300 font-bold text-[11px] mb-1">🧱 QATTIQ</div>
                  <div className="text-blue-100 text-[10px] leading-tight">
                    <strong>Kislotalar:</strong> H⁺, Li⁺, Al³⁺, Ti⁴⁺, Cr³⁺, Fe³⁺, <strong>Co³⁺</strong>
                    <br/><br/>
                    <strong>Asoslar:</strong> F⁻, OH⁻, NH₃, H₂O, NO₃⁻, <strong>N-donor</strong>
                  </div>
                </div>
                <div className="bg-orange-950/50 rounded-lg p-2.5 border border-orange-700/50">
                  <div className="text-orange-300 font-bold text-[11px] mb-1">☁️ YUMSHOQ</div>
                  <div className="text-orange-100 text-[10px] leading-tight">
                    <strong>Kislotalar:</strong> Cu⁺, Ag⁺, Au⁺, Cd²⁺, Hg²⁺, <strong>Pd²⁺, Pt²⁺</strong>
                    <br/><br/>
                    <strong>Asoslar:</strong> I⁻, H⁻, R₂S, CO, <strong>S-donor, C-donor</strong>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">🎯 Ushbu tizimga tatbiqi</div>
                <p className="text-purple-100 text-[10px] leading-relaxed">{isomer.hsab}</p>
              </div>

              <div className="bg-yellow-950/30 rounded-lg p-2.5 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[10px] mb-1">📌 Xotira uchun</div>
                <p className="text-yellow-100 text-[10px]">
                  <strong>SCN⁻:</strong> Cr³⁺ (qattiq) → N (qattiq); Pd²⁺ (yumshoq) → S (yumshoq)<br/>
                  <strong>NO₂⁻:</strong> Ko'p metallar N tomonga bog'lanadi (termodinamik afzal)<br/>
                  <strong>CN⁻:</strong> Deyarli har doim C tomonga (π-akseptor xarakter)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>📊</span> Solishtirish jadvali
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-purple-800/50">
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-purple-100">Xususiyat</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-green-300">{isomer.donorA.atom}-shakl</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-red-300">{isomer.donorB.atom}-shakl</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Formula</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{isomer.formulaA}</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{isomer.formulaB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Donor</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.donorA.name}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.donorB.name}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Bog' uzunligi</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.bondLengthA}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.bondLengthB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Ichki bog'lanish</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.ligandBondsA}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.ligandBondsB}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.colorA}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.colorB}</td></tr>
              </tbody>
            </table>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>IUPAC nomenklatura:</strong> Ambidentat ligand qaysi atomdan bog'langan bo'lsa, shu atom prefiksda ko'rsatiladi.
              <ul className="mt-1 space-y-0.5 pl-3">
                <li>• <strong>N-bog'langan NO₂⁻</strong> → nitro-</li>
                <li>• <strong>O-bog'langan NO₂⁻</strong> → nitrito-O</li>
                <li>• <strong>S-bog'langan SCN⁻</strong> → tiotsianato-S</li>
                <li>• <strong>N-bog'langan SCN⁻</strong> → izotiotsianato yoki tiotsianato-N</li>
              </ul>
            </div>
          </div>
        )}

        {/* — FOTOXROMIZM — */}
        {activePanel === "photo" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-pink-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pink-200 flex items-center gap-2 text-sm">
                <span>💡</span> Fotoxromizm va fotoizomerlanish
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-pink-950/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 font-bold text-[11px] mb-2">🌟 Ta'rifi</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">
                  <strong>Fotoxromizm</strong> — molekula UV yoki ko'rinadigan yorug'lik ta'sirida tuzilishini va rangini teskari o'zgartira olishi. Bog'lanish izomerlarda bu — donor atomni o'zgartirishga olib keladi.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">📅 1963 — Adamson kashfiyoti</div>
                <p className="text-purple-100 text-[10px] leading-relaxed">
                  Arthur W. Adamson (USC universiteti) [Co(NH₃)₅ONO]²⁺ komplekasida UV nurlanish ta'sirida O–N → N–O o'tishni birinchi bor tasdiqladi. Bu — koordinatsion fotoxromizmning boshlanishi bo'ldi.
                </p>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">🔬 Ushbu tizimda</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{isomer.photochromism}</p>
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">💼 Amaliy qo'llanilishi</div>
                <ul className="text-cyan-100 text-[10px] space-y-1 leading-relaxed">
                  <li>🔀 Molekulyar switchlar (kompyuter mantiqiy elementlari)</li>
                  <li>💾 Optik ma'lumot saqlash</li>
                  <li>🕶️ Fotoxromik ko'zoynak linzalari (analoglar)</li>
                  <li>🌡️ Yorug'lik sensorlari</li>
                  <li>⚙️ Molekulyar mashinalar (Nobel 2016 — Feringa, Stoddart, Sauvage)</li>
                </ul>
              </div>

              <button
                onClick={() => setPhotoIsomerize(!photoIsomerize)}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${photoIsomerize ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-pink-900/40 text-pink-300 hover:bg-pink-800/50'}`}
              >
                {photoIsomerize ? "⏸ Animatsiyani to'xtatish" : "▶ hν animatsiyasini boshlash"}
              </button>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Werner–Jørgensen tarixi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{isomer.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1893 — S.M. Jørgensen</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Daniyalik kimyogar Sofus Mads Jørgensen (Kopengagen universiteti) sariq (Croceo) va qizil (Xantho) rangli [Co(NH₃)₅(NO₂)]Cl₂ kristallarini ajratdi. U "zanjir nazariyasi" bilan tushuntirishga urindi.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1893 — Alfred Werner</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">Sürix universitetida Werner koordinatsion nazariyani (koordinatsion sfera) taklif qildi. Bog'lanish izomeriyasini NO₂⁻ ning N yoki O orqali bog'lanishi bilan tushuntirdi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1913 — Nobel mukofoti</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Werner "kimyo tuzilish nazariyasiga qo'shgan hissasi uchun" Kimyo bo'yicha Nobel mukofotini oldi. Bu — noorganik kimyoda birinchi Nobel edi.</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1963 — Pearson HSAB</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Ralph Pearson (Northwestern universiteti) HSAB nazariyasini ilgari surdi va ambidentat ligand-donor tanlash qoidasini tushuntirdi.</p>
              </div>

              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-cyan-300 font-bold text-[11px]">1963 — A.W. Adamson</div>
                <p className="text-cyan-200 text-[10px] leading-relaxed">USC universitetida fotoxromik izomerlanish (ONO → NO₂) birinchi bor tasdiqlangan.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1968 — J.L. Burmeister</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">"Schizophrenic ligands" — ambidentat ligandlar haqidagi klassik obzor maqola nashr etildi.</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Ambidentat ligand nima?"
                a="Ikki yoki undan ortiq turli donor atomga ega bo'lgan ligand — metall bilan har xil atomdan bog'lana oladi (masalan, NO₂⁻ — N yoki O orqali)."
              />
              <TestQuestion
                q="[Co(NH₃)₅NO₂]²⁺ va [Co(NH₃)₅ONO]²⁺ qanday izomerlar?"
                a="Bog'lanish (linkage) izomerlar — bir xil formula, lekin NO₂⁻ ligandi Co ga N (nitro) yoki O (nitrito) orqali bog'lanadi."
              />
              <TestQuestion
                q="HSAB nazariyasi bo'yicha Pd²⁺ SCN⁻ bilan qaysi atomdan bog'lanadi?"
                a="Pd²⁺ — yumshoq kislota, S — yumshoq donor. Shuning uchun Pd²⁺ SCN⁻ bilan S orqali bog'lanadi (tiotsianato)."
              />
              <TestQuestion
                q="Cr³⁺ SCN⁻ bilan qaysi atomdan bog'lanadi va nima uchun?"
                a="Cr³⁺ — qattiq kislota, N — qattiq donor. Shuning uchun Cr³⁺ SCN⁻ bilan N orqali bog'lanadi (izotiotsianato)."
              />
              <TestQuestion
                q="Fotoxromizm nima va bu bilan qanday olim tanish?"
                a="UV yorug'lik ta'sirida molekulaning tuzilishi teskari o'zgarishi. A.W. Adamson 1963-yilda [Co(NH₃)₅ONO]²⁺ da birinchi bor namoyish etgan."
              />
              <TestQuestion
                q="Nima uchun CN⁻ deyarli har doim C orqali bog'lanadi?"
                a="CN⁻ da C atomi past elektronegativlikka ega va π-akseptor sifatida yaxshi ishlaydi. C — kuchli σ-donor + π-akseptor bo'lgani uchun energetik jihatdan afzal."
              />
              <TestQuestion
                q="Werner–Jørgensen tortishuvi nima haqida edi?"
                a="Koordinatsion birikmalarning tuzilishi haqida. Jørgensen 'zanjir nazariyasi'ni himoya qildi, Werner koordinatsion sfera modelini taklif qildi. Werner g'olib chiqdi va 1913-yilda Nobel oldi."
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
                  { k: "intro", label: "1. Kirish — bog'lanish izomeriyasi", icon: "📖" },
                  { k: "ambidentate", label: "2. Ambidentat ligand tuzilishi", icon: "⚛️" },
                  { k: "hsab", label: "3. HSAB nazariyasi", icon: "⚖️" },
                  { k: "structure", label: "4. Fazoviy tuzilish va bog' uzunliklari", icon: "📐" },
                  { k: "thermodynamics", label: "5. Termodinamika va kinetika", icon: "🔥" },
                  { k: "photochromism", label: "6. Fotoxromizm (Adamson)", icon: "💡" },
                  { k: "history", label: "7. Werner–Jørgensen tarixi", icon: "📜" },
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
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#E06633]"></div><span className="text-purple-300">Fe</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#006985]"></div><span className="text-purple-300">Pd</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FFFF30]"></div><span className="text-purple-300">S</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#909090]"></div><span className="text-purple-300">C</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-400/30"></div><span className="text-purple-300">Donor atom</span></div>
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
