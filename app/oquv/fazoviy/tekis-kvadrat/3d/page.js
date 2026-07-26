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
  Pt: 0xE0C0A0, Ni: 0x50C050, Cu: 0xC08040, Pd: 0x7090C0,
  Au: 0xD0A040, Ag: 0xC0C0C0,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, K: 0x8F40D4, S: 0xFFFF30, P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKS DATABASE — Tekis kvadrat (Square Planar, D4h)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  PtCl4: {
    id: "PtCl4",
    formula: "[PtCl₄]²⁻",
    fullSalt: "K₂[PtCl₄]",
    name: "Kaliy tetrakloroplatinat(II)",
    center: { element: "Pt", color: CPK.Pt, radius: 0.50, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.3, bondLengthReal: "2.31 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²", magnetism: "Diamagnit",
    color: "To'q qizil-jigarrang kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 29000 },
    geometry: "Tekis kvadrat", symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  NiCN4: {
    id: "NiCN4",
    formula: "[Ni(CN)₄]²⁻",
    fullSalt: "K₂[Ni(CN)₄]",
    name: "Kaliy tetratsianonikelat(II)",
    center: { element: "Ni", color: CPK.Ni, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.90, bondLengthReal: "1.87 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²", magnetism: "Diamagnit",
    color: "Sariq kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 34000 },
    geometry: "Tekis kvadrat", symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  CuNH3: {
    id: "CuNH3",
    formula: "[Cu(NH₃)₄]²⁺",
    fullSalt: "[Cu(NH₃)₄]SO₄",
    name: "Tetraamminmis(II) sulfat",
    center: { element: "Cu", color: CPK.Cu, radius: 0.48, charge: "+2" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.05, bondLengthReal: "2.03 Å",
    outerIon: { element: "S", color: CPK.S, radius: 0.35, charge: "-2", count: 1 },
    hybridization: "dsp²", magnetism: "Paramagnit (1 ta juftlanmagan)",
    color: "To'q ko'k-binafsha",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 1, type: "HS", deltaO: 18000 },
    geometry: "Tekis kvadrat", symmetry: "D4h (Jahn-Teller)",
    dElectrons: 9,
    coordNumber: 4
  },
  PdCl4: {
    id: "PdCl4",
    formula: "[PdCl₄]²⁻",
    fullSalt: "K₂[PdCl₄]",
    name: "Kaliy tetrakloropalladat(II)",
    center: { element: "Pd", color: CPK.Pd, radius: 0.48, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.32, bondLengthReal: "2.30 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²", magnetism: "Diamagnit",
    color: "To'q sariq-jigarrang",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 27000 },
    geometry: "Tekis kvadrat", symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  AuCl4: {
    id: "AuCl4",
    formula: "[AuCl₄]⁻",
    fullSalt: "HAuCl₄",
    name: "Xloroklorat(III) kislota (Tetrakloroaurat(III))",
    center: { element: "Au", color: CPK.Au, radius: 0.52, charge: "+3" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.28, bondLengthReal: "2.27 Å",
    outerIon: { element: "H", color: CPK.H, radius: 0.20, charge: "+1", count: 1 },
    hybridization: "dsp²", magnetism: "Diamagnit",
    color: "Sariq kristall (gigroskopik)",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 23000 },
    geometry: "Tekis kvadrat", symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2", role: "Markaziy ion", color: "#E0C0A0" },
  Ni: { name: "Nikel (Ni)", atomic: 28, mass: "58.69 u", config: "[Ar] 3d⁸ 4s²", oxidation: "+2", role: "Markaziy ion", color: "#50C050" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.55 u", config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+2", role: "Markaziy ion", color: "#C08040" },
  Pd: { name: "Palladiy (Pd)", atomic: 46, mass: "106.42 u", config: "[Kr] 4d¹⁰", oxidation: "+2", role: "Markaziy ion", color: "#7090C0" },
  Au: { name: "Oltin (Au)", atomic: 79, mass: "196.97 u", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", oxidation: "+3", role: "Markaziy ion", color: "#D0A040" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Ligand donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "CN⁻ donor atomi", hybridization: "sp", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃ / tashqi kation", color: "#FFFFFF" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "H₂O donor", hybridization: "sp³", color: "#FF0D0D" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Ligand / tashqi sfera ioni", color: "#1FF01F" },
  K:  { name: "Kaliy (K⁺)", atomic: 19, mass: "39.10 u", config: "[Ar]", charge: "+1", role: "Tashqi sfera kation", color: "#8F40D4" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u", config: "[Ne] 3s² 3p⁴", charge: "-2", role: "Tashqi sfera anion (SO₄²⁻)", color: "#FFFF30" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 16, scale = 0.5
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
  ctx.moveTo(r, 0)
  ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({
    map: texture, transparent: true,
    depthTest: false, depthWrite: false
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ENSEMBLE POZITSIYALARI
// ═══════════════════════════════════════════════════════════════════════════
function getEnsemblePositions(count, mode) {
  const positions = []
  if (count === 1) {
    positions.push(new THREE.Vector3(0, 0, 0))
    return positions
  }

  if (mode === "crystal") {
    const n = count === 4 ? 2 : 3
    const spacing = 6
    const offset = (n - 1) * spacing / 2
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        positions.push(new THREE.Vector3(
          i * spacing - offset,
          j * spacing - offset,
          0
        ))
      }
    }
  } else {
    const radius = count === 4 ? 5 : 8
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = radius * (0.6 + ((i * 9301 + 49297) % 233280) / 233280 * 0.4)
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) * 0.3
      ))
    }
  }
  return positions
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function TekisKvadrat3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const atomsRef = useRef([])
  const labelsRef = useRef([])
  const bondLabelsRef = useRef([])
  const bondsRef = useRef([])
  const outerSphereRef = useRef([])
  const clipPlaneRef = useRef(null)
  const ligandAtomsRef = useRef([])
  const solventMoleculesRef = useRef([])
  const hBondsRef = useRef([])
  const moleculeGroupsRef = useRef([])
  const ligandGroupsRef = useRef([])
  const animationStateRef = useRef({
    exchangeProgress: 0,
    originalPositions: new Map()
  })

  // ═══════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentComplex, setCurrentComplex] = useState("PtCl4")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick")
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)

  const [activePanel, setActivePanel] = useState(null)

  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal")

  const [showLigandExchange, setShowLigandExchange] = useState(false)
  const [exchangeTarget, setExchangeTarget] = useState("H2O")
  const [isExchangePlaying, setIsExchangePlaying] = useState(false)
  const [exchangeProgress, setExchangeProgress] = useState(0)

  const [showSolvation, setShowSolvation] = useState(false)
  const [solventType, setSolventType] = useState("water")
  const [solvationDensity, setSolvationDensity] = useState(20)
  const [showHydrogenBonds, setShowHydrogenBonds] = useState(false)

  const [showTemperature, setShowTemperature] = useState(false)
  const [temperature, setTemperature] = useState(298)

  const [showPressure, setShowPressure] = useState(false)
  const [pressure, setPressure] = useState(1)

  const [showPH, setShowPH] = useState(false)
  const [phLevel, setPHLevel] = useState(7)

  const [showSpectroscopy, setShowSpectroscopy] = useState(false)
  const [spectrumType, setSpectrumType] = useState("uv-vis")

  const [showCrystalField, setShowCrystalField] = useState(false)
  const [ligandFieldStrength, setLigandFieldStrength] = useState("medium")

  const [showRedox, setShowRedox] = useState(false)
  const [oxidationState, setOxidationState] = useState(2)

  const [showJahnTeller, setShowJahnTeller] = useState(false)
  const [showIsomers, setShowIsomers] = useState(false)
  const [isomerType, setIsomerType] = useState("none")

  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C4")
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedForDistance, setSelectedForDistance] = useState([])
  const [measuredDistance, setMeasuredDistance] = useState(null)
  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch")
  const [showAllAngles, setShowAllAngles] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [citationFormat, setCitationFormat] = useState("apa")
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfRenderQuality, setPdfRenderQuality] = useState("4k") // "hd" | "4k" | "8k"
  const [pdfShowTopView, setPdfShowTopView] = useState(true)

  // ═══════════════════════════════════════════════════════════
  // 🖱️ BOSHQARUV PANELI — KO'CHIRILADIGAN (draggable)
  // ═══════════════════════════════════════════════════════════
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
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

  const handlePanelDragEnd = useCallback(() => {
    setIsPanelDragging(false)
  }, [])

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

  // ═══════════════════════════════════════════════════════════
  // ✨ YANGI FUNKSIYALAR — Trans effekt, Orbital shakllar, Zarrachalar
  // ═══════════════════════════════════════════════════════════
  const [showParticles, setShowParticles] = useState(true)
  const [showOrbitalShapes, setShowOrbitalShapes] = useState(false)
  const [selectedOrbital, setSelectedOrbital] = useState("dx2y2")
  const [showTransEffect, setShowTransEffect] = useState(false)
  const [transEffectLigand, setTransEffectLigand] = useState(0) // 0-3
  const [showSpectrochemical, setShowSpectrochemical] = useState(false)
  const [showCompareGeometry, setShowCompareGeometry] = useState(false)
  const [compareGeometry, setCompareGeometry] = useState("tetrahedral")
  const particlesRef = useRef([])
  const orbitalShapesRef = useRef([])
  const transEffectLinesRef = useRef([])

  const [orbitalShapeOpacity, setOrbitalShapeOpacity] = useState(0.6)

  const [pdfSections, setPdfSections] = useState({
    snapshot: true,
    info: true,
    conditions: true,
    geometry: true,
    dorbital: true,
    mo: false,
    spectra: false,
    crystalField: false,
    references: true
  })

  const symmetryHelpersRef = useRef([])
  const distanceLineRef = useRef(null)
  const angleArcsRef = useRef([])

  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)

  const complex = COMPLEXES[currentComplex]

  // ═══════════════════════════════════════════════════════════
  // BOND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.08, opacity = 0.7) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.2,
      transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    )
    bond.userData = { type: 'bond' }
    parent.add(bond)
    return bond
  }, [])

  // ═══════════════════════════════════════════════════════════
  // Cl⁻ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createClLigand = useCallback((parent, clPos, centerPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'Cl', donorPos: clPos.clone() }

    const clGeo = new THREE.SphereGeometry(0.38, 48, 48)
    const clMat = new THREE.MeshStandardMaterial({
      color: CPK.Cl, roughness: 0.35, metalness: 0.15,
      emissive: CPK.Cl, emissiveIntensity: 0.08
    })
    const clMesh = new THREE.Mesh(clGeo, clMat)
    clMesh.position.copy(clPos)
    clMesh.userData = { type: 'atom', element: 'Cl', info: ATOM_INFO.Cl, isDonor: true }
    clMesh.castShadow = true
    group.add(clMesh)
    atomsRef.current.push(clMesh)
    ligandAtomsRef.current.push(clMesh)

    const clLabel = makeTextSprite("Cl⁻", { color: "#86efac", scale: 0.35 })
    clLabel.position.copy(clPos).add(new THREE.Vector3(0, 0.5, 0))
    group.add(clLabel)
    labelsRef.current.push(clLabel)

    parent.add(group)
    return group
  }, [])

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createNH3Ligand = useCallback((parent, nPos, coPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'NH3', donorPos: nPos.clone() }

    const nGeo = new THREE.SphereGeometry(0.30, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.05
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true }
    nMesh.castShadow = true
    group.add(nMesh)
    atomsRef.current.push(nMesh)
    ligandAtomsRef.current.push(nMesh)

    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.35 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(nLabel)
    labelsRef.current.push(nLabel)

    const nToCo = new THREE.Vector3().subVectors(coPos, nPos).normalize()
    const outDir = nToCo.clone().negate()

    let perp1 = new THREE.Vector3()
    if (Math.abs(nToCo.y) < 0.9) {
      perp1.crossVectors(nToCo, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(nToCo, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const perp2 = new THREE.Vector3().crossVectors(nToCo, perp1).normalize()

    const hnhAngle = 107 * Math.PI / 180
    const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(hnhAngle) + 0.5) / 1.5))

    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3) + Math.PI / 6
      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(alpha))
        .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
        .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
        .normalize()

      const hPos = new THREE.Vector3().copy(nPos).addScaledVector(hDir, 0.55)

      const hGeo = new THREE.SphereGeometry(0.15, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H, roughness: 0.6, metalness: 0.05,
        emissive: 0xFFFFFF, emissiveIntensity: 0.02
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
      hMesh.castShadow = true
      group.add(hMesh)
      atomsRef.current.push(hMesh)

      const bond = createBond(group, nPos, hPos, 0xcccccc, 0.05)
      bond.userData = { type: 'bond', bondType: 'N-H', length: '1.01 Å' }
      bondsRef.current.push(bond)
    }

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // CN⁻ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createCNLigand = useCallback((parent, cPos, fePos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'CN', donorPos: cPos.clone() }

    const cGeo = new THREE.SphereGeometry(0.25, 48, 48)
    const cMat = new THREE.MeshStandardMaterial({
      color: CPK.C, roughness: 0.35, metalness: 0.15,
      emissive: CPK.C, emissiveIntensity: 0.05
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, isDonor: true }
    cMesh.castShadow = true
    group.add(cMesh)
    atomsRef.current.push(cMesh)
    ligandAtomsRef.current.push(cMesh)

    const cLabel = makeTextSprite("C", { color: "#d1d5db", scale: 0.32 })
    cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.35, 0))
    group.add(cLabel)
    labelsRef.current.push(cLabel)

    const dirOut = new THREE.Vector3().subVectors(cPos, fePos).normalize()
    const nPos = new THREE.Vector3().copy(cPos).addScaledVector(dirOut, 1.16)

    const nGeo = new THREE.SphereGeometry(0.28, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.08
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N }
    nMesh.castShadow = true
    group.add(nMesh)
    atomsRef.current.push(nMesh)

    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.32 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(nLabel)
    labelsRef.current.push(nLabel)

    const offset = 0.06
    const perpVec = new THREE.Vector3()
    if (Math.abs(dirOut.y) < 0.9) {
      perpVec.crossVectors(dirOut, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perpVec.crossVectors(dirOut, new THREE.Vector3(1, 0, 0)).normalize()
    }

    const b1 = createBond(group, cPos, nPos, 0xaaaaaa, 0.045, 0.85)
    b1.userData = { type: 'bond', bondType: 'C≡N', length: '1.16 Å' }
    bondsRef.current.push(b1)

    const cOff1 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, offset)
    const nOff1 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, offset)
    const b2 = createBond(group, cOff1, nOff1, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b2)

    const cOff2 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, -offset)
    const nOff2 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, -offset)
    const b3 = createBond(group, cOff2, nOff2, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b3)

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // BITTA MOLEKULA YARATISH (Tekis kvadrat — 4 ligand XY tekisligida)
  // ═══════════════════════════════════════════════════════════
  const buildSingleMolecule = useCallback((parent, complexData, centerPos = new THREE.Vector3(0, 0, 0), scale = 1) => {
    const molGroup = new THREE.Group()
    molGroup.position.copy(centerPos)
    molGroup.scale.setScalar(scale)
    molGroup.userData = { type: 'molecule', baseScale: scale }

    const center = complexData.center
    const localLigandGroups = []

    // Markaziy atom
    const coGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const coMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.85,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const coAtom = new THREE.Mesh(coGeo, coMat)
    coAtom.castShadow = true
    coAtom.userData = {
      type: 'atom', element: center.element,
      info: ATOM_INFO[center.element], isCenter: true
    }
    molGroup.add(coAtom)
    atomsRef.current.push(coAtom)

    const centerLabel = makeTextSprite(`${center.element}${center.charge}`, {
      color: "#ffffff",
      bgColor: `rgba(${(center.color >> 16) & 255}, ${(center.color >> 8) & 255}, ${center.color & 255}, 0.9)`,
      borderColor: "#ffffff",
      scale: 0.5
    })
    centerLabel.position.set(0, center.radius + 0.5, 0)
    molGroup.add(centerLabel)
    labelsRef.current.push(centerLabel)

    const coGlow = new THREE.Mesh(
      new THREE.SphereGeometry(center.radius * 1.3, 32, 32),
      new THREE.MeshBasicMaterial({ color: center.color, transparent: true, opacity: 0.15 })
    )
    molGroup.add(coGlow)
    coAtom.userData.glow = coGlow

    // 4 ta ligand — XY tekisligida (kvadrat)
    const d = complexData.bondLength
    const ligandPositions = [
      [ d,  0,  0],   // +X
      [-d,  0,  0],   // -X
      [ 0,  d,  0],   // +Y
      [ 0, -d,  0]    // -Y
    ]

    const coPos = new THREE.Vector3(0, 0, 0)
    const ligandVectors = []

    ligandPositions.forEach(([x, y, z], idx) => {
      const donorPos = new THREE.Vector3(x, y, z)
      ligandVectors.push(donorPos)

      const bond = createBond(molGroup, coPos, donorPos, CPK.bond, 0.09)
      bond.userData = {
        type: 'bond', bondType: `${center.element}-${complexData.ligand.donor}`,
        length: complexData.bondLengthReal, ligandIdx: idx
      }
      bondsRef.current.push(bond)

      const midpoint = new THREE.Vector3().addVectors(coPos, donorPos).multiplyScalar(0.5)
      const lengthLabel = makeTextSprite(complexData.bondLengthReal, {
        color: "#fef3c7", bgColor: "rgba(120, 53, 15, 0.9)",
        borderColor: "#fbbf24", fontSize: 48, scale: 0.35
      })
      lengthLabel.position.copy(midpoint).add(new THREE.Vector3(0.15, 0.15, 0))
      lengthLabel.visible = false
      molGroup.add(lengthLabel)
      bondLabelsRef.current.push(lengthLabel)

      let ligGroup
      if (complexData.ligand.type === "Cl") {
        ligGroup = createClLigand(molGroup, donorPos, coPos)
      } else if (complexData.ligand.type === "NH3") {
        ligGroup = createNH3Ligand(molGroup, donorPos, coPos)
      } else if (complexData.ligand.type === "CN") {
        ligGroup = createCNLigand(molGroup, donorPos, coPos)
      }
      if (ligGroup) {
        ligGroup.userData.ligandIdx = idx
        ligGroup.userData.bond = bond
        ligGroup.userData.originalPos = donorPos.clone()
        ligGroup.userData.coPos = coPos.clone()
        localLigandGroups.push(ligGroup)
      }
    })

    // Tashqi sfera
    const outer = complexData.outerIon
    const outerDistance = 4.0

    if (outer.count > 0) {
      const outerPositions = []
      if (outer.count === 1) {
        outerPositions.push(new THREE.Vector3(0, outerDistance * 0.8, outerDistance * 0.6))
      } else if (outer.count === 2) {
        outerPositions.push(new THREE.Vector3(outerDistance * 0.7, outerDistance * 0.7, 0))
        outerPositions.push(new THREE.Vector3(-outerDistance * 0.7, -outerDistance * 0.7, 0))
      }

      outerPositions.forEach((pos) => {
        const ionGeo = new THREE.SphereGeometry(outer.radius, 32, 32)
        const ionMat = new THREE.MeshStandardMaterial({
          color: outer.color, roughness: 0.3, metalness: 0.4,
          emissive: outer.color, emissiveIntensity: 0.15,
          transparent: true, opacity: 0.9
        })
        const ionMesh = new THREE.Mesh(ionGeo, ionMat)
        ionMesh.position.copy(pos)
        ionMesh.userData = {
          type: 'atom', element: outer.element,
          info: ATOM_INFO[outer.element], isOuter: true
        }
        ionMesh.visible = false
        ionMesh.castShadow = true
        molGroup.add(ionMesh)
        atomsRef.current.push(ionMesh)
        outerSphereRef.current.push(ionMesh)

        const ionLabel = makeTextSprite(`${outer.element}${outer.charge}`, {
          color: "#ffffff",
          bgColor: `rgba(${(outer.color >> 16) & 255}, ${(outer.color >> 8) & 255}, ${outer.color & 255}, 0.85)`,
          borderColor: "#ffffff", scale: 0.4
        })
        ionLabel.position.copy(pos).add(new THREE.Vector3(0, outer.radius + 0.4, 0))
        ionLabel.visible = false
        molGroup.add(ionLabel)
        labelsRef.current.push(ionLabel)
        outerSphereRef.current.push(ionLabel)

        const ionBondGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0), pos
        ])
        const ionBondMat = new THREE.LineDashedMaterial({
          color: outer.color, dashSize: 0.2, gapSize: 0.15,
          transparent: true, opacity: 0.4
        })
        const ionBond = new THREE.Line(ionBondGeo, ionBondMat)
        ionBond.computeLineDistances()
        ionBond.visible = false
        ionBond.userData = { type: 'ionic-bond' }
        molGroup.add(ionBond)
        outerSphereRef.current.push(ionBond)
      })
    }

    // Kvadratning chekkalarini ko'rsatish (D4h simmetriya uchun)
    const edgeMaterial = new THREE.LineDashedMaterial({
      color: 0x8B5CF6, dashSize: 0.1, gapSize: 0.08,
      transparent: true, opacity: 0.25
    })
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const p1 = new THREE.Vector3(...ligandPositions[i])
      const p2 = new THREE.Vector3(...ligandPositions[j])
      const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2])
      const line = new THREE.Line(geometry, edgeMaterial.clone())
      line.computeLineDistances()
      line.userData = { type: 'square-edge' }
      molGroup.add(line)
    }

    molGroup.userData.coAtom = coAtom
    molGroup.userData.ligandGroups = localLigandGroups
    molGroup.userData.ligandVectors = ligandVectors

    parent.add(molGroup)
    return molGroup
  }, [createBond, createClLigand, createNH3Ligand, createCNLigand])

  // ═══════════════════════════════════════════════════════════
  // ENSEMBLE
  // ═══════════════════════════════════════════════════════════
  const buildEnsemble = useCallback((scene, complexData, count, mode) => {
    atomsRef.current = []
    labelsRef.current = []
    bondLabelsRef.current = []
    bondsRef.current = []
    outerSphereRef.current = []
    ligandAtomsRef.current = []
    moleculeGroupsRef.current = []
    ligandGroupsRef.current = []

    const positions = getEnsemblePositions(count, mode)
    const moleculeScale = count === 1 ? 1 : (count === 4 ? 0.75 : 0.55)

    positions.forEach((pos) => {
      const molGroup = buildSingleMolecule(scene, complexData, pos, moleculeScale)
      moleculeGroupsRef.current.push(molGroup)
      if (molGroup.userData.ligandGroups) {
        ligandGroupsRef.current.push(...molGroup.userData.ligandGroups)
      }
    })
  }, [buildSingleMolecule])

  // ═══════════════════════════════════════════════════════════
  // ERITUVCHI MOLEKULALARI
  // ═══════════════════════════════════════════════════════════
  const createSolventMolecules = useCallback((scene, count, solvent) => {
    solventMoleculesRef.current.forEach(mol => {
      scene.remove(mol)
      mol.traverse(child => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
    })
    solventMoleculesRef.current = []

    const minDist = 3.5
    const maxDist = 7

    for (let i = 0; i < count; i++) {
      const theta = (i * 137.5) * Math.PI / 180
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const r = minDist + (i % 5) / 5 * (maxDist - minDist)

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi) * 0.5

      const solventGroup = new THREE.Group()
      solventGroup.position.set(x, y, z)
      solventGroup.userData = {
        type: 'solvent',
        basePos: new THREE.Vector3(x, y, z),
        phase: (i * 0.7) % (Math.PI * 2)
      }

      if (solvent === "water") {
        const oGeo = new THREE.SphereGeometry(0.18, 16, 16)
        const oMat = new THREE.MeshStandardMaterial({
          color: CPK.O, roughness: 0.5,
          transparent: true, opacity: 0.55
        })
        const oMesh = new THREE.Mesh(oGeo, oMat)
        oMesh.userData = { type: 'solvent-atom', element: 'O' }
        solventGroup.add(oMesh)
      } else if (solvent === "acetonitrile") {
        const nGeo = new THREE.SphereGeometry(0.15, 16, 16)
        const nMat = new THREE.MeshStandardMaterial({
          color: CPK.N, transparent: true, opacity: 0.55
        })
        const nMesh = new THREE.Mesh(nGeo, nMat)
        nMesh.position.set(0, 0.5, 0)
        solventGroup.add(nMesh)

        const cGeo = new THREE.SphereGeometry(0.13, 16, 16)
        const cMat = new THREE.MeshStandardMaterial({
          color: CPK.C, transparent: true, opacity: 0.55
        })
        const cMesh = new THREE.Mesh(cGeo, cMat)
        cMesh.position.set(0, 0, 0)
        solventGroup.add(cMesh)
      } else if (solvent === "ethanol") {
        const oGeo = new THREE.SphereGeometry(0.16, 16, 16)
        const oMat = new THREE.MeshStandardMaterial({
          color: CPK.O, transparent: true, opacity: 0.55
        })
        const oMesh = new THREE.Mesh(oGeo, oMat)
        solventGroup.add(oMesh)

        const cGeo = new THREE.SphereGeometry(0.14, 16, 16)
        const cMat = new THREE.MeshStandardMaterial({
          color: CPK.C, transparent: true, opacity: 0.55
        })
        const cMesh = new THREE.Mesh(cGeo, cMat)
        cMesh.position.set(0.5, 0, 0)
        solventGroup.add(cMesh)
      }

      scene.add(solventGroup)
      solventMoleculesRef.current.push(solventGroup)
    }
  }, [])

  // ═══════════════════════════════════════════════════════════
  // H-BOG'LARI
  // ═══════════════════════════════════════════════════════════
  const createHBonds = useCallback((scene) => {
    hBondsRef.current.forEach(b => {
      scene.remove(b)
      if (b.geometry) b.geometry.dispose()
      if (b.material) b.material.dispose()
    })
    hBondsRef.current = []

    if (!showHydrogenBonds || !showSolvation) return

    moleculeGroupsRef.current.forEach(mol => {
      const molWorldPos = new THREE.Vector3()
      mol.getWorldPosition(molWorldPos)

      solventMoleculesRef.current.forEach(sol => {
        const dist = sol.position.distanceTo(molWorldPos)
        if (dist > 3 && dist < 5) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            molWorldPos, sol.position
          ])
          const material = new THREE.LineDashedMaterial({
            color: CPK.hbond, dashSize: 0.15, gapSize: 0.1,
            transparent: true, opacity: 0.5
          })
          const line = new THREE.Line(geometry, material)
          line.computeLineDistances()
          scene.add(line)
          hBondsRef.current.push(line)
        }
      })
    })
  }, [showHydrogenBonds, showSolvation])

  // ═══════════════════════════════════════════════════════════
  // SCENE SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = null
    scene.fog = new THREE.Fog(0x0a0a1a, 25, 60)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      40, container.clientWidth / container.clientHeight, 0.1, 200
    )
    camera.position.set(6, 4, 7)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.localClippingEnabled = true
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 3
    controls.maxDistance = 50
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(8, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3)
    rimLight.position.set(0, -5, -8)
    scene.add(rimLight)

    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    clipPlaneRef.current = clipPlane

    const grid = new THREE.GridHelper(20, 40, 0x333355, 0x1a1a33)
    grid.position.y = -6
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

    // ═══ ZARRACHALAR TIZIMI (Particle system — kimyoviy atomlar) ═══
    const particleCount = 400
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const colors = new Float32Array(particleCount * 3)
    const particleSpeeds = []

    const colorPalette = [
      new THREE.Color(0xa78bfa), new THREE.Color(0x7c3aed),
      new THREE.Color(0x60a5fa), new THREE.Color(0x34d399),
      new THREE.Color(0xf472b6), new THREE.Color(0xfbbf24),
    ]

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 20
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      sizes[i] = 0.02 + Math.random() * 0.06
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
      particleSpeeds.push({
        theta: theta,
        phi: phi,
        r: r,
        speed: 0.05 + Math.random() * 0.15,
        wobble: Math.random() * Math.PI * 2
      })
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, transparent: true,
      opacity: 0.5, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    particleSystem.userData = { type: 'particles' }
    scene.add(particleSystem)
    particlesRef.current = [particleSystem, particleSpeeds]

    // ═══ d-ORBITAL SHAKLLARI (3D) ═══
    const createOrbitalShape = (type, color, opacity = 0.4) => {
      const group = new THREE.Group()
      const orbColor = new THREE.Color(color)

      if (type === 'dx2y2') {
        // dx²-y² — 4 ta "barg" X va Y o'qlari bo'ylab
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.bezierCurveTo(0.5, 0.3, 1.0, 0.6, 1.2, 0)
        shape.bezierCurveTo(1.0, -0.6, 0.5, -0.3, 0, 0)
        const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2
          const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
          const mat = new THREE.MeshPhongMaterial({
            color: orbColor, transparent: true, opacity,
            side: THREE.DoubleSide, emissive: orbColor, emissiveIntensity: 0.2
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.rotation.z = angle
          mesh.position.set(0, 0, 0)
          group.add(mesh)
        }
      } else if (type === 'dxy') {
        // dxy — 4 ta "barg" 45° burchakda
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.bezierCurveTo(0.5, 0.3, 1.0, 0.6, 1.2, 0)
        shape.bezierCurveTo(1.0, -0.6, 0.5, -0.3, 0, 0)
        const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2 + Math.PI / 4
          const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
          const mat = new THREE.MeshPhongMaterial({
            color: orbColor, transparent: true, opacity,
            side: THREE.DoubleSide, emissive: orbColor, emissiveIntensity: 0.2
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.rotation.z = angle
          group.add(mesh)
        }
      } else if (type === 'dz2') {
        // dz² — 2 ta "barg" Z o'qi bo'ylab + halqa
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.bezierCurveTo(0.3, 0.5, 0.5, 1.0, 0, 1.5)
        shape.bezierCurveTo(-0.5, 1.0, -0.3, 0.5, 0, 0)
        const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 }
        const geoUp = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const matUp = new THREE.MeshPhongMaterial({
          color: orbColor, transparent: true, opacity,
          side: THREE.DoubleSide, emissive: orbColor, emissiveIntensity: 0.2
        })
        const meshUp = new THREE.Mesh(geoUp, matUp)
        meshUp.rotation.x = Math.PI / 2
        group.add(meshUp)
        const meshDown = meshUp.clone()
        meshDown.rotation.x = -Math.PI / 2
        group.add(meshDown)
        // Halqa (torus)
        const torusGeo = new THREE.TorusGeometry(0.8, 0.08, 16, 32)
        const torusMat = new THREE.MeshPhongMaterial({
          color: orbColor, transparent: true, opacity: opacity * 0.6,
          emissive: orbColor, emissiveIntensity: 0.1
        })
        const torus = new THREE.Mesh(torusGeo, torusMat)
        torus.rotation.x = Math.PI / 2
        group.add(torus)
      }
      group.scale.setScalar(0.6)
      return group
    }

    orbitalShapesRef.current = []
    ;['dx2y2', 'dxy', 'dz2'].forEach((type, idx) => {
      const colors = [0xff6b6b, 0x48dbfb, 0xffd93d]
      const group = createOrbitalShape(type, colors[idx], 0.4)
      group.visible = false
      scene.add(group)
      orbitalShapesRef.current.push({ group, type })
    })

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)

      if (intersects.length > 0) {
        const atom = intersects[0].object
        if (atom.userData.type === 'atom') {
          if (angleMeasureModeRef.current && atom.userData.isDonor) {
            setSelectedLigands(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                const v1 = newList[0].position.clone().normalize()
                const v2 = newList[1].position.clone().normalize()
                const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / Math.PI
                setMeasuredAngle(angle.toFixed(1))
                return newList
              }
              if (newList.length > 2) {
                setMeasuredAngle(null)
                return [atom]
              }
              return newList
            })
          } else if (distanceMeasureModeRef.current) {
            setSelectedForDistance(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                const dist = newList[0].position.distanceTo(newList[1].position)
                const realBond = parseFloat(complexRef.current.bondLengthReal)
                const sceneBond = complexRef.current.bondLength
                const realDist = (dist / sceneBond) * realBond
                setMeasuredDistance(realDist.toFixed(2))
                return newList
              }
              if (newList.length > 2) {
                setMeasuredDistance(null)
                return [atom]
              }
              return newList
            })
          } else {
            setSelectedAtom(atom.userData)
          }
        }
      } else {
        if (!angleMeasureModeRef.current && !distanceMeasureModeRef.current) setSelectedAtom(null)
      }
    }

    renderer.domElement.addEventListener('click', onMouseClick)

    let frameId
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const delta = Math.min(clock.getDelta(), 0.1)

      // Temperatura
      if (showTemperatureRef.current) {
        const amplitude = (temperatureRef.current / 298) * 0.08
        atomsRef.current.forEach((atom, i) => {
          if (!atom.userData.isCenter && atom.userData.type === 'atom') {
            if (!animationStateRef.current.originalPositions.has(atom.uuid)) {
              animationStateRef.current.originalPositions.set(atom.uuid, atom.position.clone())
            }
            const orig = animationStateRef.current.originalPositions.get(atom.uuid)
            const wobbleX = Math.sin(elapsed * 4 + i * 0.7) * amplitude
            const wobbleY = Math.cos(elapsed * 3.5 + i * 1.1) * amplitude
            const wobbleZ = Math.sin(elapsed * 4.5 + i * 0.5) * amplitude
            atom.position.x = orig.x + wobbleX
            atom.position.y = orig.y + wobbleY
            atom.position.z = orig.z + wobbleZ
          }
        })
      } else {
        animationStateRef.current.originalPositions.forEach((orig, uuid) => {
          const atom = atomsRef.current.find(a => a.uuid === uuid)
          if (atom && !atom.userData.isCenter) {
            atom.position.lerp(orig, 0.15)
          }
        })
      }

      // Solvent harakati
      if (showSolvationRef.current) {
        solventMoleculesRef.current.forEach((mol) => {
          if (mol.userData.basePos) {
            const phase = mol.userData.phase
            mol.position.x = mol.userData.basePos.x + Math.sin(elapsed * 1.2 + phase) * 0.2
            mol.position.y = mol.userData.basePos.y + Math.cos(elapsed * 1.5 + phase) * 0.2
            mol.position.z = mol.userData.basePos.z + Math.sin(elapsed * 1.8 + phase) * 0.2
            mol.rotation.y += delta * 0.5
          }
        })
      }

      // Ligand exchange animation
      if (isExchangePlayingRef.current && showLigandExchangeRef.current) {
        animationStateRef.current.exchangeProgress += delta * 0.15
        if (animationStateRef.current.exchangeProgress >= 1) {
          animationStateRef.current.exchangeProgress = 1
          isExchangePlayingRef.current = false
          setIsExchangePlaying(false)
        }
        setExchangeProgress(animationStateRef.current.exchangeProgress)
      }

      // Markaziy atom glow
      atomsRef.current.forEach(atom => {
        if (atom.userData.isCenter && atom.userData.glow) {
          atom.userData.glow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
          atom.rotation.y += 0.002
        }
      })

      // Jahn-Teller (kvadratda Z o'qi bo'yicha cho'zilish)
      if (showJahnTellerRef.current) {
        moleculeGroupsRef.current.forEach(mol => {
          const stretch = 1 + Math.sin(elapsed * 1.5) * 0.04
          const baseScale = mol.userData.baseScale || 1
          mol.scale.y = baseScale * (1 + (stretch - 1) * 0.5)
        })
      }

      // VIBRATION MODES
      if (showVibrationRef.current && moleculeGroupsRef.current[0]) {
        const mol = moleculeGroupsRef.current[0]
        if (mol.userData.ligandGroups) {
          const vibMode = vibrationModeRef.current
          const t = elapsed * 4
          mol.userData.ligandGroups.forEach((lg, idx) => {
            if (!lg.userData.originalPos) return
            const dir = lg.userData.originalPos.clone().normalize()
            let amplitude = 0

            if (vibMode === "sym_stretch") {
              amplitude = Math.sin(t) * 0.15
            } else if (vibMode === "asym_stretch") {
              if (idx === 0 || idx === 2) amplitude = Math.sin(t) * 0.2
              else amplitude = -Math.sin(t) * 0.2
            } else if (vibMode === "bend") {
              amplitude = 0
              const perpDir = new THREE.Vector3(
                Math.sin(t + idx * Math.PI / 2) * 0.12,
                0,
                Math.cos(t + idx * Math.PI / 2) * 0.12
              )
              lg.position.copy(lg.userData.originalPos).add(perpDir)
              return
            }

            const newPos = lg.userData.originalPos.clone().addScaledVector(dir, amplitude)
            lg.position.copy(newPos)
          })
        }
      } else if (!showVibrationRef.current && !showLigandExchangeRef.current) {
        moleculeGroupsRef.current.forEach(mol => {
          if (mol.userData.ligandGroups) {
            mol.userData.ligandGroups.forEach(lg => {
              if (lg.userData.originalPos) {
                lg.position.lerp(lg.userData.originalPos, 0.15)
              }
            })
          }
        })
      }

      // ✨ ZARRACHALAR HARAKATI
      if (showParticlesRef.current && particlesRef.current.length > 0) {
        const [pSys, speeds] = particlesRef.current
        const pos = pSys.geometry.attributes.position.array
        for (let i = 0; i < speeds.length; i++) {
          const s = speeds[i]
          s.theta += s.speed * 0.003
          s.phi += s.speed * 0.001
          const wobble = Math.sin(elapsed * 0.5 + s.wobble) * 0.3
          const r = s.r + wobble
          pos[i * 3] = r * Math.sin(s.phi) * Math.cos(s.theta)
          pos[i * 3 + 1] = r * Math.cos(s.phi) * 0.6
          pos[i * 3 + 2] = r * Math.sin(s.phi) * Math.sin(s.theta)
        }
        pSys.geometry.attributes.position.needsUpdate = true
        pSys.material.opacity = 0.2 + Math.sin(elapsed * 0.1) * 0.1
      }

      // 🔮 d-ORBITAL SHAKLLARI
      if (showOrbitalShapesRef.current && orbitalShapesRef.current.length > 0) {
        orbitalShapesRef.current.forEach(({ group, type }, idx) => {
          group.visible = idx === orbitalIdxRef.current
          if (group.visible) {
            group.position.set(0, 0, 0)
            group.rotation.y += delta * 0.5
            group.rotation.x = Math.sin(elapsed * 0.3) * 0.15
            group.scale.setScalar(0.55 + Math.sin(elapsed * 0.5) * 0.05)
          }
        })
      } else {
        orbitalShapesRef.current.forEach(({ group }) => { group.visible = false })
      }

      // 🔀 TRANS EFFEKT chiziqlari
      if (showTransEffectRef.current && moleculeGroupsRef.current[0]) {
        const mol = moleculeGroupsRef.current[0]
        if (mol.userData.ligandGroups) {
          const idx = transEffectLigandRef.current
          const transIdx = (idx + 2) % 4
          const cisIdxs = [(idx + 1) % 4, (idx + 3) % 4]

          mol.userData.ligandGroups.forEach((lg, i) => {
            if (lg.userData.originalPos) {
              if (i === idx) {
                // Tanlangan ligand — yashil
                lg.traverse(child => {
                  if (child.material && child.userData?.isDonor) {
                    child.material.emissive.setHex(0x00ff00)
                    child.material.emissiveIntensity = 0.8
                  }
                })
              } else if (i === transIdx) {
                // Trans ligand — qizil
                lg.traverse(child => {
                  if (child.material && child.userData?.isDonor) {
                    child.material.emissive.setHex(0xff0000)
                    child.material.emissiveIntensity = 0.8
                  }
                })
              } else {
                // Cis ligandlar — zaif
                lg.traverse(child => {
                  if (child.material && child.userData?.isDonor) {
                    child.material.emissive.setHex(complexRef.current.ligand.donorColor)
                    child.material.emissiveIntensity = 0.05
                  }
                })
              }
            }
          })
        }
      } else if (!showTransEffectRef.current) {
        // Ranglarni qaytarish
        moleculeGroupsRef.current.forEach(mol => {
          if (mol.userData.ligandGroups) {
            mol.userData.ligandGroups.forEach(lg => {
              lg.traverse(child => {
                if (child.material && child.userData?.isDonor) {
                  child.material.emissive.setHex(complexRef.current.ligand.donorColor)
                  child.material.emissiveIntensity = 0.08
                }
              })
            })
          }
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    setTimeout(() => setLoading(false), 500)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onMouseClick)

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
        if (obj.material && obj.material.map) obj.material.map.dispose()
      })

      renderer.dispose()
      controls.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      atomsRef.current = []

      // Zarrachalar va orbital shakllarini tozalash
      particlesRef.current.forEach(p => {
        if (Array.isArray(p)) return
        scene.remove(p)
        if (p.geometry) p.geometry.dispose()
        if (p.material) p.material.dispose()
      })
      particlesRef.current = []
      orbitalShapesRef.current.forEach(({ group }) => {
        scene.remove(group)
        group.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      orbitalShapesRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ═══════════════════════════════════════════════════════════
  // REF'LAR
  // ═══════════════════════════════════════════════════════════
  const angleMeasureModeRef = useRef(angleMeasureMode)
  const distanceMeasureModeRef = useRef(distanceMeasureMode)
  const showTemperatureRef = useRef(showTemperature)
  const temperatureRef = useRef(temperature)
  const showSolvationRef = useRef(showSolvation)
  const isExchangePlayingRef = useRef(isExchangePlaying)
  const showLigandExchangeRef = useRef(showLigandExchange)
  const showJahnTellerRef = useRef(showJahnTeller)
  const showVibrationRef = useRef(showVibration)
  const vibrationModeRef = useRef(vibrationMode)
  const showParticlesRef = useRef(showParticles)
  const showOrbitalShapesRef = useRef(showOrbitalShapes)
  const orbitalIdxRef = useRef(0)
  const showTransEffectRef = useRef(showTransEffect)
  const transEffectLigandRef = useRef(transEffectLigand)
  const complexRef = useRef(complex)

  useEffect(() => { angleMeasureModeRef.current = angleMeasureMode }, [angleMeasureMode])
  useEffect(() => { distanceMeasureModeRef.current = distanceMeasureMode }, [distanceMeasureMode])
  useEffect(() => { showTemperatureRef.current = showTemperature }, [showTemperature])
  useEffect(() => { temperatureRef.current = temperature }, [temperature])
  useEffect(() => { showSolvationRef.current = showSolvation }, [showSolvation])
  useEffect(() => { isExchangePlayingRef.current = isExchangePlaying }, [isExchangePlaying])
  useEffect(() => { showLigandExchangeRef.current = showLigandExchange }, [showLigandExchange])
  useEffect(() => { showJahnTellerRef.current = showJahnTeller }, [showJahnTeller])
  useEffect(() => { showVibrationRef.current = showVibration }, [showVibration])
  useEffect(() => { vibrationModeRef.current = vibrationMode }, [vibrationMode])
  useEffect(() => { showParticlesRef.current = showParticles }, [showParticles])
  useEffect(() => { showOrbitalShapesRef.current = showOrbitalShapes }, [showOrbitalShapes])
  useEffect(() => { orbitalIdxRef.current = ['dx2y2', 'dxy', 'dz2'].indexOf(selectedOrbital) }, [selectedOrbital])
  useEffect(() => { showTransEffectRef.current = showTransEffect }, [showTransEffect])
  useEffect(() => { transEffectLigandRef.current = transEffectLigand }, [transEffectLigand])
  useEffect(() => { complexRef.current = complex }, [complex])

  // ═══════════════════════════════════════════════════════════
  // ENSEMBLE QAYTA QURISH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const toRemove = []
    scene.traverse((obj) => {
      if (obj.userData && (
        obj.userData.type === 'molecule' ||
        obj.userData.type === 'atom' ||
        obj.userData.type === 'bond' ||
        obj.userData.type === 'edge' ||
        obj.userData.type === 'square-edge' ||
        obj.userData.type === 'ionic-bond' ||
        obj.userData.type === 'ligand' ||
        obj.userData.type === 'symmetry'
      )) {
        toRemove.push(obj)
      }
      if (obj instanceof THREE.Sprite) toRemove.push(obj)
    })

    toRemove.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material.dispose()
      }
      if (obj.parent) obj.parent.remove(obj)
    })

    animationStateRef.current.originalPositions.clear()
    animationStateRef.current.exchangeProgress = 0
    setExchangeProgress(0)
    setIsExchangePlaying(false)

    buildEnsemble(scene, COMPLEXES[currentComplex], moleculeCount, ensembleMode)

    setSelectedAtom(null)
    setSelectedLigands([])
    setMeasuredAngle(null)
  }, [currentComplex, moleculeCount, ensembleMode, buildEnsemble])

  // ═══════════════════════════════════════════════════════════
  // ERITUVCHI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (showSolvation) {
      createSolventMolecules(scene, solvationDensity, solventType)
    } else {
      solventMoleculesRef.current.forEach(mol => {
        scene.remove(mol)
        mol.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      solventMoleculesRef.current = []
      hBondsRef.current.forEach(b => {
        scene.remove(b)
        if (b.geometry) b.geometry.dispose()
        if (b.material) b.material.dispose()
      })
      hBondsRef.current = []
    }
  }, [showSolvation, solvationDensity, solventType, createSolventMolecules])

  // ═══════════════════════════════════════════════════════════
  // H-BOG'LAR
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    createHBonds(scene)
  }, [showHydrogenBonds, showSolvation, solvationDensity, createHBonds])

  // ═══════════════════════════════════════════════════════════
  // BOSIM
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const compression = showPressure ? (1 - Math.log10(Math.max(pressure, 1)) * 0.02) : 1
    moleculeGroupsRef.current.forEach(mol => {
      const baseScale = mol.userData.baseScale || 1
      if (!showJahnTeller) {
        mol.scale.setScalar(baseScale * compression)
      } else {
        mol.scale.x = baseScale * compression
        mol.scale.z = baseScale * compression
      }
    })
  }, [showPressure, pressure, moleculeCount, showJahnTeller])

  // ═══════════════════════════════════════════════════════════
  // Jahn-Teller reset
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!showJahnTeller) {
      moleculeGroupsRef.current.forEach(mol => {
        const baseScale = mol.userData.baseScale || 1
        mol.scale.setScalar(baseScale)
      })
    }
  }, [showJahnTeller])

  // ═══════════════════════════════════════════════════════════
  // pH EFFECT
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    moleculeGroupsRef.current.forEach(mol => {
      const coAtom = mol.userData.coAtom
      if (!coAtom) return

      if (showPH) {
        if (phLevel < 4) {
          coAtom.material.emissiveIntensity = 0.4
          coAtom.material.color.setHex(0xFF6677)
        } else if (phLevel > 10) {
          coAtom.material.emissiveIntensity = 0.3
          coAtom.material.color.setHex(0x66AAFF)
        } else {
          coAtom.material.emissiveIntensity = 0.15
          coAtom.material.color.setHex(complex.center.color)
        }
      } else {
        coAtom.material.emissiveIntensity = 0.15
        coAtom.material.color.setHex(complex.center.color)
      }
    })
  }, [showPH, phLevel, complex.center.color])

  // ═══════════════════════════════════════════════════════════
  // REDOX
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    moleculeGroupsRef.current.forEach(mol => {
      const coAtom = mol.userData.coAtom
      if (!coAtom) return

      if (showRedox) {
        if (oxidationState === 2) {
          coAtom.material.color.setHex(0xFFB3C1)
          coAtom.scale.setScalar(1.1)
        } else if (oxidationState === 3) {
          coAtom.material.color.setHex(complex.center.color)
          coAtom.scale.setScalar(1.0)
        } else if (oxidationState === 4) {
          coAtom.material.color.setHex(0x8B4D5C)
          coAtom.scale.setScalar(0.9)
        }
      } else {
        coAtom.material.color.setHex(complex.center.color)
        coAtom.scale.setScalar(1.0)
      }
    })
  }, [showRedox, oxidationState, complex.center.color])

  // ═══════════════════════════════════════════════════════════
  // LIGAND EXCHANGE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!showLigandExchange) {
      moleculeGroupsRef.current.forEach(mol => {
        if (mol.userData.ligandGroups) {
          mol.userData.ligandGroups.forEach(lg => {
            if (lg.userData.originalPos) {
              lg.position.copy(lg.userData.originalPos)
            }
            lg.scale.setScalar(1)
            lg.visible = true
            if (lg.userData.bond) {
              lg.userData.bond.visible = true
              lg.userData.bond.material.opacity = 0.7
            }
          })
        }
      })
      animationStateRef.current.exchangeProgress = 0
      setExchangeProgress(0)
      return
    }

    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandGroups) return

    const ligandsToReplace = exchangeTarget === "Cl" ? 2 : 1

    mol.userData.ligandGroups.forEach((lg, idx) => {
      if (idx >= ligandsToReplace) return

      if (!lg.userData.originalPos) return

      const t = exchangeProgress

      if (t === 0) {
        lg.position.copy(lg.userData.originalPos)
        lg.scale.setScalar(1)
        lg.visible = true
        if (lg.userData.bond) {
          lg.userData.bond.visible = true
          lg.userData.bond.material.opacity = 0.7
        }
        return
      }

      if (t < 0.4) {
        const phase = t / 0.4
        const dir = lg.userData.originalPos.clone().normalize()
        const newPos = lg.userData.originalPos.clone().addScaledVector(dir, phase * 3)
        lg.position.copy(newPos)
        lg.scale.setScalar(Math.max(0.1, 1 - phase * 0.9))
        lg.visible = true
        if (lg.userData.bond) {
          lg.userData.bond.material.opacity = Math.max(0, 0.7 - phase * 0.7)
        }
      } else if (t < 0.6) {
        lg.visible = false
        if (lg.userData.bond) {
          lg.userData.bond.visible = false
        }
      } else {
        const phase = (t - 0.6) / 0.4
        const dir = lg.userData.originalPos.clone().normalize()
        const newPos = lg.userData.originalPos.clone().addScaledVector(dir, (1 - phase) * 3)
        lg.position.copy(newPos)
        lg.scale.setScalar(0.1 + phase * 0.9)
        lg.visible = true
        if (lg.userData.bond) {
          lg.userData.bond.visible = true
          lg.userData.bond.material.opacity = phase * 0.7
        }

        const newColor = exchangeTarget === "Cl" ? CPK.Cl : CPK.O
        lg.traverse(child => {
          if (child.userData && child.userData.isDonor && child.material) {
            child.material.color.setHex(newColor)
            child.material.emissive.setHex(newColor)
          }
        })
      }
    })
  }, [showLigandExchange, exchangeProgress, exchangeTarget])

  // ═══════════════════════════════════════════════════════════
  // EXCHANGE target o'zgarishi
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!showLigandExchange || exchangeProgress > 0) return
    moleculeGroupsRef.current.forEach(mol => {
      if (mol.userData.ligandGroups) {
        mol.userData.ligandGroups.forEach(lg => {
          lg.traverse(child => {
            if (child.userData && child.userData.isDonor && child.material) {
              child.material.color.setHex(complex.ligand.donorColor)
              child.material.emissive.setHex(complex.ligand.donorColor)
            }
          })
        })
      }
    })
  }, [exchangeTarget, showLigandExchange, exchangeProgress, complex.ligand.donorColor])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    outerSphereRef.current.forEach(obj => {
      obj.visible = showOuterSphere
    })
  }, [showOuterSphere, currentComplex, moleculeCount])

  // ═══════════════════════════════════════════════════════════
  // YORLIQLAR
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    labelsRef.current.forEach(label => {
      if (!outerSphereRef.current.includes(label)) {
        label.visible = showLabels
      }
    })
  }, [showLabels, currentComplex, moleculeCount])

  // ═══════════════════════════════════════════════════════════
  // BOG' UZUNLIKLARI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    bondLabelsRef.current.forEach(label => {
      label.visible = showBondLengths
    })
  }, [showBondLengths, currentComplex, moleculeCount])

  // ═══════════════════════════════════════════════════════════
  // KO'RINISH REJIMI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    atomsRef.current.forEach(atom => {
      if (!atom.material) return
      const el = atom.userData.element

      if (viewMode === "space-filling") {
        const vdwScales = { Pt: 2.6, Ni: 2.4, Cu: 2.5, Pd: 2.5, Au: 2.7, N: 2.0, C: 2.1, H: 1.6, Cl: 2.3, K: 2.6, O: 1.9, S: 2.3 }
        atom.scale.setScalar(vdwScales[el] || 1.5)
        atom.material.opacity = 0.85
        atom.material.transparent = true
      } else if (viewMode === "wireframe") {
        atom.scale.setScalar(1)
        atom.material.wireframe = true
        atom.material.opacity = 1
      } else {
        atom.scale.setScalar(1)
        atom.material.wireframe = false
        atom.material.opacity = 1
        atom.material.transparent = false
      }
    })

    bondsRef.current.forEach(bond => {
      bond.visible = viewMode !== "space-filling"
    })
  }, [viewMode, currentComplex, moleculeCount])

  // ═══════════════════════════════════════════════════════════
  // KESIM
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const renderer = rendererRef.current
    const clipPlane = clipPlaneRef.current
    if (!renderer || !clipPlane) return

    atomsRef.current.forEach(atom => {
      if (atom.material) {
        atom.material.clippingPlanes = sliceView ? [clipPlane] : []
        atom.material.needsUpdate = true
      }
    })
    bondsRef.current.forEach(bond => {
      if (bond.material) {
        bond.material.clippingPlanes = sliceView ? [clipPlane] : []
        bond.material.needsUpdate = true
      }
    })
  }, [sliceView, currentComplex, moleculeCount])

  // ═══════════════════════════════════════════════════════════
  // AUTO ROTATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  // ═══════════════════════════════════════════════════════════
  // TOOLTIP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  // ═══════════════════════════════════════════════════════════
  // BURCHAK O'LCHASH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    ligandAtomsRef.current.forEach(atom => {
      if (atom.material) {
        atom.material.emissiveIntensity = 0.05
      }
    })
    selectedLigands.forEach(atom => {
      if (atom.material) {
        atom.material.emissiveIntensity = 0.6
      }
    })
  }, [selectedLigands])

  // ═══════════════════════════════════════════════════════════
  // PANEL ALMASHTIRISH
  // ═══════════════════════════════════════════════════════════
  const togglePanel = (panelName) => {
    setActivePanel(prev => prev === panelName ? null : panelName)
  }

  // ═══════════════════════════════════════════════════════════
  // SIMMETRIYA (D4h)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    symmetryHelpersRef.current.forEach(h => {
      scene.remove(h)
      if (h.geometry) h.geometry.dispose()
      if (h.material) h.material.dispose()
    })
    symmetryHelpersRef.current = []

    if (!showSymmetry || moleculeCount !== 1) return

    const len = 3.5

    if (symmetryElement === "C4") {
      // C4 z o'qi (kvadrat tekisligiga perpendikulyar)
      const dir = new THREE.Vector3(0, 0, 1)
      const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({ color: 0xff4444, linewidth: 2, transparent: true, opacity: 0.8 })
      const line = new THREE.Line(geom, mat)
      line.userData = { type: 'symmetry' }
      scene.add(line)
      symmetryHelpersRef.current.push(line)

      const label = makeTextSprite("C₄ (z)", {
        color: "#ffffff", bgColor: "rgba(255, 68, 68, 0.85)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(0, 0, len + 0.8)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)

      // C2 z o'qi
      const c2label = makeTextSprite("C₂ (z)", {
        color: "#ffffff", bgColor: "rgba(255, 136, 0, 0.75)",
        borderColor: "#ffffff", scale: 0.35
      })
      c2label.position.set(0, 0, -len - 0.8)
      c2label.userData = { type: 'symmetry' }
      scene.add(c2label)
      symmetryHelpersRef.current.push(c2label)

      // X va Y o'qlari bo'ylab C'₂
      const c2axes = [
        { dir: [1, 0, 0], color: 0x44ff44, label: "C₂' (x)" },
        { dir: [0, 1, 0], color: 0x4488ff, label: "C₂' (y)" }
      ]
      c2axes.forEach(a => {
        const d = new THREE.Vector3(...a.dir)
        const pts = [d.clone().multiplyScalar(-len), d.clone().multiplyScalar(len)]
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        const m = new THREE.LineDashedMaterial({
          color: a.color, dashSize: 0.15, gapSize: 0.1,
          transparent: true, opacity: 0.5
        })
        const l = new THREE.Line(g, m)
        l.computeLineDistances()
        l.userData = { type: 'symmetry' }
        scene.add(l)
        symmetryHelpersRef.current.push(l)

        const lb = makeTextSprite(a.label, {
          color: "#ffffff",
          bgColor: `rgba(${(a.color >> 16) & 255}, ${(a.color >> 8) & 255}, ${a.color & 255}, 0.75)`,
          borderColor: "#ffffff", scale: 0.35
        })
        lb.position.copy(d.clone().multiplyScalar(len + 0.7))
        lb.userData = { type: 'symmetry' }
        scene.add(lb)
        symmetryHelpersRef.current.push(lb)
      })
    } else if (symmetryElement === "C2") {
      // 45° burchakdagi C₂'' o'qlari (diagonallar)
      for (let i = 0; i < 2; i++) {
        const angle = (i * Math.PI / 2) + Math.PI / 4
        const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0)
        const pts = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        const m = new THREE.LineDashedMaterial({
          color: 0xff8800, dashSize: 0.15, gapSize: 0.1,
          transparent: true, opacity: 0.5
        })
        const l = new THREE.Line(g, m)
        l.computeLineDistances()
        l.userData = { type: 'symmetry' }
        scene.add(l)
        symmetryHelpersRef.current.push(l)
      }
      const label = makeTextSprite("C₂'' (45°)", {
        color: "#ffffff", bgColor: "rgba(255, 136, 0, 0.85)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(len * 0.7, len * 0.7, 0.5)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_h") {
      // σh — XY tekislik (kvadrat tekisligining o'zi)
      const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xff44ff, transparent: true, opacity: 0.2,
        side: THREE.DoubleSide
      })
      const plane = new THREE.Mesh(planeGeo, planeMat)
      plane.userData = { type: 'symmetry' }
      scene.add(plane)
      symmetryHelpersRef.current.push(plane)

      const label = makeTextSprite("σh (xy)", {
        color: "#ffffff", bgColor: "rgba(255, 68, 255, 0.85)",
        borderColor: "#ffffff", scale: 0.45
      })
      label.position.set(len, len, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_v") {
      // σv — XZ va YZ vertikal tekisliklar (ligandlar orqali o'tadi)
      const planes = [
        { rot: [0, 0, 0], color: 0x00ffff },      // XZ
        { rot: [0, Math.PI / 2, 0], color: 0xffff00 }  // YZ
      ]
      planes.forEach(p => {
        const geo = new THREE.PlaneGeometry(len * 2, len * 2)
        const mat = new THREE.MeshBasicMaterial({
          color: p.color, transparent: true, opacity: 0.15,
          side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.set(...p.rot)
        mesh.userData = { type: 'symmetry' }
        scene.add(mesh)
        symmetryHelpersRef.current.push(mesh)
      })
      const label = makeTextSprite("σv", {
        color: "#ffffff", bgColor: "rgba(0, 200, 200, 0.85)",
        borderColor: "#ffffff", scale: 0.45
      })
      label.position.set(len, 0, len)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    }
  }, [showSymmetry, symmetryElement, moleculeCount, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // MASOFA O'LCHASH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (distanceLineRef.current) {
      scene.remove(distanceLineRef.current)
      if (distanceLineRef.current.geometry) distanceLineRef.current.geometry.dispose()
      if (distanceLineRef.current.material) distanceLineRef.current.material.dispose()
      distanceLineRef.current = null
    }

    if (selectedForDistance.length === 2) {
      const p1 = new THREE.Vector3()
      const p2 = new THREE.Vector3()
      selectedForDistance[0].getWorldPosition(p1)
      selectedForDistance[1].getWorldPosition(p2)

      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2])
      const mat = new THREE.LineDashedMaterial({
        color: 0xffaa00, dashSize: 0.15, gapSize: 0.08,
        transparent: true, opacity: 0.9, linewidth: 3
      })
      const line = new THREE.Line(geom, mat)
      line.computeLineDistances()
      scene.add(line)
      distanceLineRef.current = line
    }

    if (distanceMeasureMode) {
      atomsRef.current.forEach(atom => {
        if (atom.material) {
          atom.material.emissiveIntensity = selectedForDistance.includes(atom) ? 0.7 : (atom.material.emissiveIntensity || 0.05)
        }
      })
    }
  }, [selectedForDistance, distanceMeasureMode])

  // ═══════════════════════════════════════════════════════════
  // BARCHA BURCHAKLAR
  // ═══════════════════════════════════════════════════════════
  const computeAllAngles = useCallback(() => {
    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandVectors) return []
    const vecs = mol.userData.ligandVectors
    const angles = []
    for (let i = 0; i < vecs.length; i++) {
      for (let j = i + 1; j < vecs.length; j++) {
        const v1 = vecs[i].clone().normalize()
        const v2 = vecs[j].clone().normalize()
        const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / Math.PI
        angles.push({ pair: `L${i + 1}-M-L${j + 1}`, angle: angle.toFixed(1) })
      }
    }
    return angles
  }, [])

  // ═══════════════════════════════════════════════════════════
  // PDF EKSPORT
  // ═══════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => {
          if (!r.ok) throw new Error("Regular font yuklanmadi")
          return r.arrayBuffer()
        })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => {
          if (!r.ok) throw new Error("Bold font yuklanmadi")
          return r.arrayBuffer()
        })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => {
          if (!r.ok) throw new Error("Italic font yuklanmadi")
          return r.arrayBuffer()
        })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch (fontErr) {
        console.error("❌ Font yuklashda xato:", fontErr)
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98),
        purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        orangeDeep: rgb(0.71, 0.39, 0),
        orangeSoft: rgb(0.71, 0.31, 0.08),
        green: rgb(0.08, 0.47, 0.31),
        greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55),
        brown: rgb(0.71, 0.39, 0.12),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.94),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        bgSnapshot: rgb(0.04, 0.02, 0.09),
        white: rgb(1, 1, 1),
        red: rgb(0.80, 0.20, 0.20),
      }

      const PAGE_W = 595.28
      const PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30
      const HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (text, font, size) => font.widthOfTextAtSize(String(text), size)

      const truncate = (text, font, size, maxWidth) => {
        const s = String(text)
        if (measure(s, font, size) <= maxWidth) return s
        let lo = 0, hi = s.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid
          else hi = mid - 1
        }
        return s.slice(0, lo) + "…"
      }

      const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [""]
        const words = String(text).split(/\s+/)
        const lines = []
        let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) {
            lines.push(current)
            current = word
          } else {
            current = test
          }
          if (measure(current, font, size) > maxWidth) {
            let piece = ""
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) {
                lines.push(piece)
                piece = ch
              } else piece += ch
            }
            current = piece
          }
        }
        if (current) lines.push(current)
        return lines
      }

      const safeText = (text, opts) => {
        const {
          x, y: ty, size = 10, font = regularFont, color = C.textDark,
          align = "left", maxWidth = null,
        } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x
        const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }

      const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
        const lines = wrapText(cleanText(text), font, size, maxW)
        lines.forEach((line, i) => {
          const w = measure(line, font, size)
          page.drawText(line, {
            x: (PAGE_W - w) / 2,
            y: cy - i * (size + 3),
            size, font, color,
          })
        })
        return lines.length * (size + 3)
      }

      const addFooter = () => {
        const leftText = truncate(
          `Tekis Kvadrat 3D Lab PRO  •  ${cleanText(complex.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, {
          x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray,
        })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, {
          x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8,
          font: regularFont, color: C.textGray,
        })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end:   { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }

      const addNewPage = () => {
        addFooter()
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNum++
        y = PAGE_H - MARGIN
      }

      const checkPageBreak = (need) => {
        if (y - need < FOOTER_Y + 25) addNewPage()
      }

      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({
          x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple,
        })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.purple,
          maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }

      const drawTableRow = (label, value, bgColor = C.bgPurple, labelColor = C.purple) => {
        const rowH = 20
        const labelW = 190
        const valueX = MARGIN + labelW + 6
        const valueMaxW = CONTENT_W - labelW - 12

        checkPageBreak(rowH + 2)
        page.drawRectangle({
          x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor,
        })
        safeText(label, {
          x: MARGIN + 6, y: y - 13, size: 9,
          font: boldFont, color: labelColor,
          maxWidth: labelW - 8,
        })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, {
          x: valueX, y: y - 13, size: 9,
          font: regularFont, color: C.textDark,
        })
        y -= rowH
      }

      // SARLAVHA POLOSASI
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })

      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Koordinatsion Kimyo  •  Vol. 2, Son 2", {
        x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight,
        maxWidth: CONTENT_W * 0.65,
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, align: "right",
        maxWidth: CONTENT_W * 0.3,
      })

      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid,
      })

      safeText("Interaktiv 3D Molekulyar Modellashtirish Platformasi", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86),
        maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.2026.002", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right",
        maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`${cleanText(complex.formula)} Struktur Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText(cleanText(complex.name), y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Geometriya: ${cleanText(complex.geometry)} (${cleanText(complex.symmetry)})  •  Gibridlanish: ${cleanText(complex.hybridization)}  •  ${cleanText(complex.magnetism)}`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ABSTRACT
      const abstract =
        `${cleanText(complex.formula)} kompleksi ideal tekis kvadrat geometriyasiga va ` +
        `${cleanText(complex.symmetry)} simmetriyasiga ega. Markaziy ${cleanText(ATOM_INFO[complex.center.element].name.split(" ")[0])} ioni ` +
        `to'rtta ${complex.ligand.type === "NH3" ? "ammiak" : complex.ligand.type === "CN" ? "tsianid" : "xlorid"} ligandi bilan ` +
        `${cleanText(complex.ligand.donor)} donor atomlari orqali ${cleanText(complex.bondLengthReal)} masofada bir xil bog'langan. ` +
        `D4h nuqtaviy guruhiga mansub bo'lgan bu geometriya ${complex.dElectrons}-elektronli ` +
        `${complex.dOrbital.type === "LS" ? "past spinli" : "yuqori spinli"} konfiguratsiyaga ega bo'lib, ` +
        `dsp² gibridlanishi bilan xarakterlanadi.`

      const absPadding = 12
      const absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8

      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple,
        maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // 1. SNAPSHOT — 4K YUQORI SIFAT
      if (pdfSections.snapshot) {
        drawSectionHeader(sectionNum++, "3D Vizualizatsiya (Yuqori sifatli render)")
        const renderer = rendererRef.current
        const scene = sceneRef.current
        const cam = cameraRef.current
        if (renderer && scene && cam) {
          // Eski holatni saqlash
          const savedPos = cam.position.clone()
          const savedTarget = controlsRef.current?.target?.clone?.() || new THREE.Vector3()
          const savedAutoRotate = controlsRef.current?.autoRotate
          const savedClearColor = renderer.getClearColor(new THREE.Color()).clone()
          const savedClearAlpha = renderer.getClearAlpha()
          const originalPixelRatio = renderer.getPixelRatio()
          const origSize = new THREE.Vector2()
          renderer.getSize(origSize)

          // Vaqtinchalik yoritishni kuchaytirish
          let tempLights = []
          const extraKey = new THREE.DirectionalLight(0xffffff, 2.0)
          extraKey.position.set(5, 12, 5)
          scene.add(extraKey)
          tempLights.push(extraKey)
          const extraFill = new THREE.DirectionalLight(0xcc99ff, 0.8)
          extraFill.position.set(-5, -3, -5)
          scene.add(extraFill)
          tempLights.push(extraFill)
          const extraRim = new THREE.DirectionalLight(0x88ddff, 0.6)
          extraRim.position.set(0, -8, -10)
          scene.add(extraRim)
          tempLights.push(extraRim)
          const extraBack = new THREE.DirectionalLight(0xffffff, 0.5)
          extraBack.position.set(-3, 4, -8)
          scene.add(extraBack)
          tempLights.push(extraBack)

          // 4K render sozlamalari (3840×2160)
          const SNAPSHOT_W = 3840
          const SNAPSHOT_H = 2160
          renderer.setPixelRatio(1)  // Native 4K — pixel ratio 1, size 4K
          renderer.setSize(SNAPSHOT_W, SNAPSHOT_H, false)
          cam.aspect = SNAPSHOT_W / SNAPSHOT_H
          cam.updateProjectionMatrix()

          // Optimal kamer pozitsiyasi — molekulani eng chiroyli ko'rsatadigan burchak
          cam.position.set(5.5, 3.5, 7.5)
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0)
            controlsRef.current.autoRotate = false
          }
          cam.lookAt(0, 0, 0)

          // Toza qora fon
          renderer.setClearColor(0x0a0418, 1)

          // Zarrachalarni vaqtinchalik yashirish (toza tasvir uchun)
          const particlesVisible = showParticles
          if (particlesVisible && particlesRef.current[0]) {
            particlesRef.current[0].visible = false
          }
          // Orbital shakllarni yashirish
          orbitalShapesRef.current.forEach(({ group }) => { if (group) group.visible = false })

          // 3 marta render — barqaror tasvir uchun
          renderer.render(scene, cam)
          renderer.render(scene, cam)
          renderer.render(scene, cam)

          // PNG ni olish — lossless, maksimal sifat
          const pngDataUrl = renderer.domElement.toDataURL("image/png", 1.0)
          
          // Original settings'ga qaytarish
          renderer.setPixelRatio(originalPixelRatio)
          renderer.setSize(origSize.x, origSize.y, false)
          cam.aspect = origSize.x / origSize.y
          cam.updateProjectionMatrix()
          cam.position.copy(savedPos)
          if (controlsRef.current) {
            controlsRef.current.target.copy(savedTarget)
            controlsRef.current.autoRotate = savedAutoRotate ?? true
          }
          cam.lookAt(savedTarget)
          renderer.setClearColor(savedClearColor, savedClearAlpha)

          // Vaqtinchalik yoritkichlarni olib tashlash
          tempLights.forEach(l => scene.remove(l))

          // Zarrachalarni qaytarish
          if (particlesVisible && particlesRef.current[0]) {
            particlesRef.current[0].visible = true
          }

          // PNG ni PDF ga joylash
          const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer())
          const pngImage = await pdfDoc.embedPng(pngBytes)

          const imgW = CONTENT_W
          const imgH = imgW * (SNAPSHOT_H / SNAPSHOT_W)  // 16:9 proporsiya
          checkPageBreak(imgH + 50)

          // Sof qora fonli ramka
          page.drawRectangle({
            x: MARGIN - 1, y: y - imgH - 1, width: imgW + 2, height: imgH + 2,
            color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 2,
          })
          page.drawImage(pngImage, {
            x: MARGIN, y: y - imgH, width: imgW, height: imgH,
          })
          y -= imgH + 14

          // Rasm ostidagi caption — ilmiy jurnal uslubida
          const savedViewMode = viewMode === "ball-stick" ? "shar-tayoqcha" : viewMode === "space-filling" ? "fazo to'ldiruvchi (CPK)" : "karkas"
          const captionLines = [
            `1-rasm. ${cleanText(complex.formula)} (${cleanText(complex.name)}) ning ${savedViewMode} ko'rinishidagi 3D modeli.`,
            `Geometriya: tekis kvadrat (${cleanText(complex.symmetry)}). Koordinatsion son: 4. Gibridlanish: ${cleanText(complex.hybridization)}.`,
            moleculeCount > 1
              ? `${moleculeCount} ta molekula ${ensembleMode === "crystal" ? "kristall panjarada" : "eritma ansamblida"} joylashgan.`
              : "Bitta molekula. Markaziy atom — ligand bog'lari aniq ko'rinadi: σ-donor va π-akseptor o'zaro ta'sirlar.",
            `3D Lab PRO • JDA-Kimyo platformasi • Render: 4K (${SNAPSHOT_W}×${SNAPSHOT_H})`
          ]
          captionLines.forEach(line => {
            const wrapped = wrapText(cleanText(line), italicFont, 8, CONTENT_W)
            wrapped.forEach((l, i) => {
              page.drawText(l, { x: MARGIN, y: y - i * 10, size: 8, font: italicFont, color: C.purpleSoft })
            })
            y -= wrapped.length * 10 + 2
          })
          y -= 14
        }
      }

      // 2. BIRIKMA IDENTIFIKATSIYASI
      if (pdfSections.info) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const infoTable = [
          ["Koordinatsion ion", complex.formula],
          ["To'liq tuz formulasi", complex.fullSalt],
          ["IUPAC nomi", complex.name],
          ["Koordinatsion son", String(complex.coordNumber || 4)],
          ["Geometriya", complex.geometry],
          ["Nuqtaviy guruh", complex.symmetry],
          ["Gibridlanish", complex.hybridization],
          ["Magnit xossasi", complex.magnetism],
          ["Rangi (qattiq holatda)", complex.color],
          ["d-elektronlar soni", `d${complex.dElectrons}`],
        ]
        infoTable.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
        })
        y -= 15
      }

      // 3. MOLEKULYAR GEOMETRIYA
      if (pdfSections.geometry) {
        drawSectionHeader(sectionNum++, "Molekulyar Geometriya")
        const angles = computeAllAngles()
        const geomData = [
          [`M–${complex.ligand.donor} bog' uzunligi`, complex.bondLengthReal],
          ["Ideal L–M–L (qo'shni)", "90.0°"],
          ["Ideal L–M–L (qarama-qarshi)", "180.0°"],
          ["Hisoblangan qo'shni burchaklar", `${angles.filter(a => parseFloat(a.angle) < 95).length} × 90°`],
          ["Hisoblangan trans burchaklar", `${angles.filter(a => parseFloat(a.angle) > 170).length} × 180°`],
          ["Idealdan og'ish (RMSD)", "< 0.001 Å"],
        ]
        geomData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgOrange : C.white, C.orangeSoft)
        })
        y -= 15
      }

      // 4. SIMULYATSIYA SHAROITLARI
      if (pdfSections.conditions) {
        drawSectionHeader(sectionNum++, "Simulyatsiya Sharoitlari")
        const cond = [
          ["Molekulalar soni", `${moleculeCount}`],
          ["Ansambl rejimi", ensembleMode === "crystal" ? "Kristall panjara" : "Eritma"],
          ["Vizualizatsiya rejimi", viewMode === "ball-stick" ? "Shar-tayoqcha" : viewMode === "space-filling" ? "Fazo to'ldiruvchi (CPK)" : "Karkas"],
        ]
        if (showTemperature) cond.push(["Temperatura", `${temperature} K  (${(temperature - 273).toFixed(0)} °C)`])
        if (showPressure) cond.push(["Bosim", `${pressure.toLocaleString()} atm`])
        if (showPH) cond.push(["pH muhit", `${phLevel}  (${phLevel < 7 ? "kislotali" : phLevel > 7 ? "ishqoriy" : "neytral"})`])
        if (showSolvation) {
          cond.push(["Erituvchi", solventType])
          cond.push(["Solvatatsiya qobig'i", `${solvationDensity} ta molekula`])
        }
        cond.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue)
        })
        y -= 15
      }

      // 5. d-ORBITAL DIAGRAMMASI (D4h — 4 ta sath)
      if (pdfSections.dorbital) {
        drawSectionHeader(sectionNum++, "Kristall Maydon d-Orbital Ajralishi (D4h)")
        checkPageBreak(240)

        const diagX = MARGIN + 30
        const levelW = 130
        const dx2y2Y = y - 20
        const dxyY = y - 65
        const dz2Y = y - 105
        const dxzY = y - 145

        // E o'qi
        page.drawLine({
          start: { x: diagX, y: y }, end: { x: diagX, y: dxzY - 25 },
          thickness: 1, color: rgb(0.63, 0.63, 0.71),
        })
        page.drawLine({ start: { x: diagX - 3, y: y - 3 }, end: { x: diagX, y: y + 2 }, thickness: 1, color: rgb(0.63, 0.63, 0.71) })
        page.drawLine({ start: { x: diagX + 3, y: y - 3 }, end: { x: diagX, y: y + 2 }, thickness: 1, color: rgb(0.63, 0.63, 0.71) })
        page.drawText("E", { x: diagX - 12, y: y - 5, size: 10, font: italicFont, color: rgb(0.51, 0.51, 0.59) })

        // dx²-y² (eng yuqori)
        const dx2y2X = diagX + 12
        const orbW = 36
        page.drawLine({ start: { x: dx2y2X, y: dx2y2Y }, end: { x: dx2y2X + orbW, y: dx2y2Y }, thickness: 2, color: C.purple })
        page.drawText("dx²-y² (b₁g)", { x: diagX + 118, y: dx2y2Y - 4, size: 9, font: boldFont, color: C.purple })

        // dxy
        const dxyX = diagX + 12
        page.drawLine({ start: { x: dxyX, y: dxyY }, end: { x: dxyX + orbW, y: dxyY }, thickness: 2, color: C.purple })
        page.drawText("dxy (b₂g)", { x: diagX + 118, y: dxyY - 4, size: 9, font: boldFont, color: C.purple })

        // dz²
        const dz2X = diagX + 12
        page.drawLine({ start: { x: dz2X, y: dz2Y }, end: { x: dz2X + orbW, y: dz2Y }, thickness: 2, color: C.purple })
        page.drawText("dz² (a₁g)", { x: diagX + 118, y: dz2Y - 4, size: 9, font: boldFont, color: C.purple })

        // dxz, dyz (degenerate, eng past)
        const dxzX = diagX + 12
        const dxz2X = diagX + 62
        const orbW2 = 36
        page.drawLine({ start: { x: dxzX, y: dxzY }, end: { x: dxzX + orbW2, y: dxzY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: dxz2X, y: dxzY }, end: { x: dxz2X + orbW2, y: dxzY }, thickness: 2, color: C.purple })
        page.drawText("dxz, dyz (eg)", { x: diagX + 118, y: dxzY - 4, size: 9, font: boldFont, color: C.purple })

        // Elektronlar
        const drawElectron = (cx, cy, isUp) => {
          page.drawText(isUp ? "↑" : "↓", {
            x: cx - 3, y: cy - 4, size: 11, font: boldFont, color: C.orange,
          })
        }

        // dx²-y² elektronlari
        const dx2y2ElX = dx2y2X + orbW / 2 - 4
        const dx2y2ElX2 = dx2y2X + orbW / 2 + 6
        let filled = 0
        const dOrbs = [
          { y: dx2y2Y, count: complex.dOrbital.dx2y2, x1: dx2y2X + orbW / 2 - 4, x2: dx2y2X + orbW / 2 + 6 },
          { y: dxyY, count: complex.dOrbital.dxy, x1: dxyX + orbW / 2 - 4, x2: dxyX + orbW / 2 + 6 },
          { y: dz2Y, count: complex.dOrbital.dz2, x1: dz2X + orbW / 2 - 4, x2: dz2X + orbW / 2 + 6 },
          { y: dxzY, count: complex.dOrbital.dxz, x1: dxzX + orbW / 2 - 4, x2: dxzX + orbW / 2 + 6 },
        ]
        // dxz va dyz birgalikda
        dOrbs.forEach(orb => {
          let filled = 0
          if (orb.count > 0) { drawElectron(orb.x1, orb.y + 7, true); filled++ }
          if (orb.count > 1) { drawElectron(orb.x2, orb.y + 7, false); filled++ }
        })

        // Δ₁ strelkasi (dx²-y² → dxy)
        const ar1X = diagX + 175
        const ar1Mid = (dx2y2Y + dxyY) / 2
        page.drawLine({ start: { x: ar1X, y: dx2y2Y }, end: { x: ar1X, y: dxyY }, thickness: 1.5, color: C.orange })
        page.drawText("Δ₁", { x: ar1X + 5, y: ar1Mid + 2, size: 11, font: boldFont, color: C.orangeDeep })

        // Δ₂ strelkasi (dxy → dz²)
        const ar2X = diagX + 195
        const ar2Mid = (dxyY + dz2Y) / 2
        page.drawLine({ start: { x: ar2X, y: dxyY }, end: { x: ar2X, y: dz2Y }, thickness: 1.5, color: C.orange })
        page.drawText("Δ₂", { x: ar2X + 5, y: ar2Mid + 2, size: 11, font: boldFont, color: C.orangeDeep })

        // info
        const infoX = ar2X + 35
        const infoMaxW = PAGE_W - MARGIN - infoX
        safeText(`Konfiguratsiya:`, { x: infoX, y: dx2y2Y, size: 8.5, font: boldFont, color: C.textDark, maxWidth: infoMaxW })
        safeText(`dx²-y²${complex.dOrbital.dx2y2} dxy${complex.dOrbital.dxy} dz²${complex.dOrbital.dz2} dxz,dyz${complex.dOrbital.dxz}`, {
          x: infoX, y: dx2y2Y - 13, size: 8, font: regularFont, color: C.textDark, maxWidth: infoMaxW
        })
        safeText(`Spin: ${complex.dOrbital.type === "LS" ? "Past spin" : "Yuqori spin"}`, {
          x: infoX, y: dxzY, size: 9, font: regularFont, color: C.textDark, maxWidth: infoMaxW
        })
        y = dxzY - 40

        const caption = `2-rasm. ${cleanText(complex.formula)} uchun D4h kristall maydon ajralish diagrammasi. ${complex.dElectrons} d-elektron konfiguratsiyasi.`
        const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
        capLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= capLines.length * 11 + 18
      }

      // 6. MO DIAGRAMMA
      if (pdfSections.mo) {
        drawSectionHeader(sectionNum++, "Molekulyar Orbital Diagramma")
        checkPageBreak(160)

        const moLevels = [
          { label: "σ* (dx²-y²) — antibog'lovchi", fill: complex.dOrbital.dx2y2 },
          { label: "π* (dxy) — zaif antibog'lovchi", fill: 0 },
          { label: "σ (dz²) — bog'lanmagan", fill: complex.dOrbital.dz2 },
          { label: "π (dxz, dyz) — bog'lanmagan", fill: complex.dOrbital.dxz },
          { label: "σ (ligand) — bog'lovchi", fill: 8 },
        ]
        const lineX = MARGIN + 30
        const lineW = 50
        const labelX = lineX + lineW + 15
        const labelMaxW = CONTENT_W - (labelX - MARGIN) - 5

        moLevels.forEach((lvl, i) => {
          const ly = y - 15 - i * 28
          page.drawLine({
            start: { x: lineX, y: ly }, end: { x: lineX + lineW, y: ly },
            thickness: 1.5, color: rgb(0.59, 0.39, 0.78),
          })
          safeText(lvl.label, {
            x: labelX, y: ly - 3, size: 9, font: regularFont, color: C.purpleSoft,
            maxWidth: labelMaxW,
          })
          if (lvl.fill > 0) {
            const maxSlots = 4
            const shown = Math.min(lvl.fill, maxSlots)
            const totalW = shown * 6
            let ex = lineX + (lineW - totalW) / 2
            for (let k = 0; k < shown; k++) {
              page.drawText(k % 2 === 0 ? "↑" : "↓", {
                x: ex, y: ly - 2, size: 11, font: boldFont, color: C.orange,
              })
              ex += 6
            }
          }
        })
        y -= 15 + moLevels.length * 28 + 10

        const caption = `3-rasm. Tekis kvadrat kompleks uchun MO diagramma. ${complex.dElectrons} d-elektronning sathlar bo'yicha taqsimlanishi.`
        const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
        capLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= capLines.length * 11 + 18
      }

      // 7. SPEKTROSKOPIYA
      if (pdfSections.spectra) {
        drawSectionHeader(sectionNum++, "Bashorat qilingan Spektroskopik Ma'lumotlar")

        const specData = [
          ["UV-Vis (d–d o'tish)", complex.id === "CuNH3" ? "λmax ≈ 600 nm (dx²-y² → dxy)" : "λmax < 450 nm"],
          ["UV-Vis (LMCT)", "λmax < 300 nm"],
          [`IR (M–${complex.ligand.donor} tebranish)`, "300–500 cm⁻¹"],
          ["Simmetrik cho'zilish (a₁g)", "≈ 480 cm⁻¹"],
          ["Asimmetrik cho'zilish (t₁u)", "≈ 420 cm⁻¹"],
          ["Egilish tebranishi (eᵤ)", "≈ 280 cm⁻¹"],
          ["NMR ma'lumotlari", complex.id === "PtCl4" ? "¹⁹⁵Pt: ≈ -1100 ppm" : complex.id === "NiCN4" ? "¹³C: 160 ppm" : "¹H: 4.0 ppm"],
        ]
        specData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.green)
        })
        y -= 12

        // IR spektr
        const graphNeed = 190
        checkPageBreak(graphNeed)
        safeText("IR Spektr (simulyatsiya, 200–600 cm⁻¹ oralig'i)", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.greenDark,
          maxWidth: CONTENT_W,
        })
        y -= 15

        const gLeftPad = 32
        const gBotPad = 22
        const gTopPad = 28
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 100
        const gY = y - gH - gTopPad
        const xMin = 200, xMax = 600

        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(0.98, 1.0, 0.99), borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 0.5,
        })

        for (let tick = 0; tick <= 100; tick += 25) {
          const ty = gY + (tick / 100) * gH
          if (tick > 0 && tick < 100) {
            page.drawLine({
              start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
              thickness: 0.2, color: rgb(0.85, 0.92, 0.88),
            })
          }
        }

        const xTicks = [250, 350, 450, 550]
        xTicks.forEach(wn => {
          const tx = gX + ((wn - xMin) / (xMax - xMin)) * gW
          page.drawLine({
            start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
            thickness: 0.2, color: rgb(0.85, 0.92, 0.88),
          })
          const label = `${wn}`
          const lw = measure(label, regularFont, 6.5)
          page.drawText(label, {
            x: tx - lw / 2, y: gY - 10, size: 6.5,
            font: regularFont, color: rgb(0.4, 0.5, 0.45),
          })
        })

        const irPeaks = [
          { wn: 280, rel: 0.45, label: "δ(M–L)" },
          { wn: 420, rel: 0.80, label: "ν(M–L) t₁u" },
          { wn: 480, rel: 1.00, label: "ν(M–L) a₁g" },
        ]

        const totalPoints = 200
        const transmittance = new Array(totalPoints).fill(1.0)
        irPeaks.forEach(peak => {
          const sigma = 8
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.rel * Math.exp(-Math.pow(wn_i - peak.wn, 2) / (2 * sigma * sigma))
            transmittance[i] = Math.max(transmittance[i] - absorption, 0.0)
          }
        })

        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((wn0 - xMin) / (xMax - xMin)) * gW
          const x1 = gX + ((wn1 - xMin) / (xMax - xMin)) * gW
          const y0 = gY + gH - transmittance[i] * (gH - 4) - 2
          const y1 = gY + gH - transmittance[i + 1] * (gH - 4) - 2
          page.drawLine({
            start: { x: x0, y: y0 }, end: { x: x1, y: y1 },
            thickness: 0.9, color: C.greenDark,
          })
        }

        irPeaks.forEach((peak, idx) => {
          const px = gX + ((peak.wn - xMin) / (xMax - xMin)) * gW
          const peakT = Math.max(0, 1 - peak.rel)
          const py = gY + gH - peakT * (gH - 4) - 2
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: 0.4, color: C.red,
          })
          const wnStr = `${peak.wn}`
          const wnW = measure(wnStr, boldFont, 7)
          page.drawText(wnStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2)),
            y: gY + gH + 4, size: 7, font: boldFont, color: C.red,
          })
          const lblStr = peak.label
          const lblW = measure(lblStr, regularFont, 6.5)
          page.drawText(lblStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - lblW - 2, px - lblW / 2)),
            y: gY + gH + 14 + (idx % 2) * 8, size: 6.5,
            font: regularFont, color: rgb(0.5, 0.3, 0.3),
          })
        })

        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 8)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY - 20, size: 8,
          font: italicFont, color: C.greenDark,
        })
        y = gY - 32
        const irCaption = `4-rasm. ${cleanText(complex.formula)} uchun bashorat qilingan IR spektri (200–600 cm⁻¹). Qizil chiziqlar tebranish modlari o'rnini ko'rsatadi.`
        const irCapLines = wrapText(cleanText(irCaption), italicFont, 8.5, CONTENT_W)
        irCapLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= irCapLines.length * 11 + 18
      }

      // 8. CFSE
      if (pdfSections.crystalField) {
        drawSectionHeader(sectionNum++, "Kristall Maydon Barqarorlashuv Energiyasi (KMBE)")
        const cfData = [
          ["Ligand maydon kuchi", showCrystalField ? ligandFieldStrength : "o'rta (standart)"],
          ["Ajralish parametri Δₒ", `${complex.dOrbital.deltaO.toLocaleString()} cm⁻¹`],
          ["Energiya ekvivalenti", `${(complex.dOrbital.deltaO * 0.012).toFixed(1)} kJ/mol`],
          ["Bashorat qilingan spin", complex.dOrbital.type === "LS" ? "Past spin" : "Yuqori spin"],
          [`d-elektronlar soni`, `d${complex.dElectrons}`],
        ]
        cfData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.brown)
        })
        y -= 15
      }

      // 9. ADABIYOTLAR
      if (pdfSections.references) {
        drawSectionHeader(sectionNum++, "Foydalanilgan Adabiyotlar")
        const refs = [
          "1. Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Z. Anorg. Chem., 3, 267–330.",
          "2. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
          "3. Housecroft, C. E.; Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
          "4. Miessler, G. L.; Fischer, P. J.; Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson.",
          "5. IUPAC. (2005). Nomenclature of Inorganic Chemistry: Recommendations 2005. RSC Publishing.",
          "6. Bethe, H. (1929). Termaufspaltung in Kristallen. Ann. Phys., 395(2), 133–208.",
          "7. Jahn, H. A.; Teller, E. (1937). Stability of polyatomic molecules in degenerate electronic states. Proc. R. Soc. Lond. A, 161(905), 220–235.",
          "8. Gray, H. B.; Ballhausen, C. J. (1963). Molecular orbital theory for square planar complexes. J. Am. Chem. Soc., 85(3), 260–265.",
        ]
        refs.forEach(ref => {
          const refLines = wrapText(cleanText(ref), regularFont, 8.5, CONTENT_W - 10)
          checkPageBreak(refLines.length * 11 + 6)
          refLines.forEach((line, i) => {
            const px = i === 0 ? MARGIN : MARGIN + 12
            page.drawText(line, {
              x: px, y: y - i * 11, size: 8.5,
              font: regularFont, color: C.textDark,
            })
          })
          y -= refLines.length * 11 + 5
        })
        y -= 10
      }

      addFooter()

      pdfDoc.setTitle(`${cleanText(complex.formula)} Struktur Tahlili`)
      pdfDoc.setSubject(complex.name)
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords([complex.geometry, complex.symmetry, "koordinatsion kimyo", "IUPAC"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)

    } catch (err) {
      console.error("PDF yaratishda xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CITATION
  // ═══════════════════════════════════════════════════════════
  const getCitation = () => {
    const year = new Date().getFullYear()
    const accessDate = new Date().toLocaleDateString('en-GB')
    if (citationFormat === "apa") {
      return `JDA-Kimyo Research Bulletin. (${year}). Structural analysis of ${complex.formula}: ${complex.name}. Interactive 3D Molecular Modeling Platform (Square Planar). Retrieved ${accessDate}.`
    } else if (citationFormat === "mla") {
      return `"Structural Analysis of ${complex.formula}: ${complex.name}." JDA-Kimyo Research Bulletin, ${year}, Interactive 3D Molecular Modeling Platform (Square Planar). Accessed ${accessDate}.`
    } else if (citationFormat === "bibtex") {
      const key = complex.id.toLowerCase()
      return `@misc{${key}${year},
  title  = {Structural Analysis of ${complex.formula}: ${complex.name}},
  author = {{JDA-Kimyo Research Bulletin}},
  year   = {${year}},
  note   = {Interactive 3D Molecular Modeling Platform (Square Planar)},
  url    = {https://jda-kimyo.uz/oquv/fazoviy/tekis-kvadrat},
  urldate = {${accessDate}}
}`
    } else if (citationFormat === "chicago") {
      return `JDA-Kimyo Research Bulletin. "Structural Analysis of ${complex.formula}: ${complex.name}." Interactive 3D Molecular Modeling Platform (Square Planar). ${year}. Accessed ${accessDate}.`
    }
    return ""
  }

  // ═══════════════════════════════════════════════════════════
  // KONFIGURATSIYA
  // ═══════════════════════════════════════════════════════════
  const exportConfig = () => {
    const config = {
      version: "2.1",
      timestamp: new Date().toISOString(),
      complex: currentComplex,
      view: { viewMode, showLabels, showBondLengths, showOuterSphere, sliceView, autoRotate },
      ensemble: { moleculeCount, ensembleMode },
      conditions: {
        showTemperature, temperature,
        showPressure, pressure,
        showPH, phLevel,
        showSolvation, solventType, solvationDensity, showHydrogenBonds,
        showRedox, oxidationState
      },
      scientific: {
        showCrystalField, ligandFieldStrength,
        showJahnTeller,
        showSymmetry, symmetryElement,
        showVibration, vibrationMode
      }
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${complex.id}_config_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const c = JSON.parse(e.target.result)
        if (c.complex && COMPLEXES[c.complex]) setCurrentComplex(c.complex)
        if (c.view) {
          if (c.view.viewMode) setViewMode(c.view.viewMode)
          if (typeof c.view.showLabels === "boolean") setShowLabels(c.view.showLabels)
          if (typeof c.view.showBondLengths === "boolean") setShowBondLengths(c.view.showBondLengths)
          if (typeof c.view.showOuterSphere === "boolean") setShowOuterSphere(c.view.showOuterSphere)
          if (typeof c.view.sliceView === "boolean") setSliceView(c.view.sliceView)
          if (typeof c.view.autoRotate === "boolean") setAutoRotate(c.view.autoRotate)
        }
        if (c.ensemble) {
          if (c.ensemble.moleculeCount) setMoleculeCount(c.ensemble.moleculeCount)
          if (c.ensemble.ensembleMode) setEnsembleMode(c.ensemble.ensembleMode)
        }
        if (c.conditions) {
          if (typeof c.conditions.showTemperature === "boolean") setShowTemperature(c.conditions.showTemperature)
          if (c.conditions.temperature) setTemperature(c.conditions.temperature)
          if (typeof c.conditions.showPressure === "boolean") setShowPressure(c.conditions.showPressure)
          if (c.conditions.pressure) setPressure(c.conditions.pressure)
          if (typeof c.conditions.showPH === "boolean") setShowPH(c.conditions.showPH)
          if (c.conditions.phLevel) setPHLevel(c.conditions.phLevel)
          if (typeof c.conditions.showSolvation === "boolean") setShowSolvation(c.conditions.showSolvation)
          if (c.conditions.solventType) setSolventType(c.conditions.solventType)
          if (c.conditions.solvationDensity) setSolvationDensity(c.conditions.solvationDensity)
          if (typeof c.conditions.showHydrogenBonds === "boolean") setShowHydrogenBonds(c.conditions.showHydrogenBonds)
          if (typeof c.conditions.showRedox === "boolean") setShowRedox(c.conditions.showRedox)
          if (c.conditions.oxidationState) setOxidationState(c.conditions.oxidationState)
        }
        if (c.scientific) {
          if (typeof c.scientific.showCrystalField === "boolean") setShowCrystalField(c.scientific.showCrystalField)
          if (c.scientific.ligandFieldStrength) setLigandFieldStrength(c.scientific.ligandFieldStrength)
          if (typeof c.scientific.showJahnTeller === "boolean") setShowJahnTeller(c.scientific.showJahnTeller)
          if (typeof c.scientific.showSymmetry === "boolean") setShowSymmetry(c.scientific.showSymmetry)
          if (c.scientific.symmetryElement) setSymmetryElement(c.scientific.symmetryElement)
          if (typeof c.scientific.showVibration === "boolean") setShowVibration(c.scientific.showVibration)
          if (c.scientific.vibrationMode) setVibrationMode(c.scientific.vibrationMode)
        }
        alert("✅ Konfiguratsiya muvaffaqiyatli yuklandi!")
      } catch (err) {
        alert("❌ Faylni o'qib bo'lmadi: " + err.message)
      }
    }
    reader.readAsText(file)
    event.target.value = ""
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
            href="/oquv/fazoviy/tekis-kvadrat"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-purple-300 flex items-center gap-2 truncate">
              <span>◇</span>
              <span className="hidden sm:inline">Tekis Kvadrat — 3D Laboratoriya PRO</span>
              <span className="sm:hidden">3D Lab PRO</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {complex.formula} • {moleculeCount} mol. • {ensembleMode === "crystal" ? "Kristall" : "Eritma"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentComplex}
            onChange={(e) => setCurrentComplex(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[180px]"
          >
            <option value="PtCl4">[PtCl₄]²⁻</option>
            <option value="NiCN4">[Ni(CN)₄]²⁻</option>
            <option value="CuNH3">[Cu(NH₃)₄]²⁺</option>
            <option value="PdCl4">[PdCl₄]²⁻</option>
            <option value="AuCl4">[AuCl₄]⁻</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${
              autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'
            }`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${
              activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'
            }`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="PDF eksport"
          >📄</button>

          <button
            onClick={() => setCitationModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="Iqtibos olish"
          >📚</button>

          <button
            onClick={() => setFullscreenMode(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="To'liq ekran (faqat 3D model)"
          >🖥️</button>
        </div>
      </header>
      )}

      {/* FULLSCREEN chiqish */}
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

        {/* CHAP — BOSHQARUV PANELI */}
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[260px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          <div
            onMouseDown={(e) => {
              if (e.button !== 0) return
              e.preventDefault()
              handlePanelDragStart(e.clientX, e.clientY)
            }}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY)
              }
            }}
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

          {/* MOLEKULALAR */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
            <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">🧬 Molekulalar</h4>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[1, 4, 9].map(n => (
                <button
                  key={n}
                  onClick={() => setMoleculeCount(n)}
                  className={`p-1.5 rounded text-xs font-bold transition-all ${
                    moleculeCount === n
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {moleculeCount > 1 && (
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setEnsembleMode("crystal")}
                  className={`p-1 rounded text-[10px] transition-all ${
                    ensembleMode === "crystal"
                      ? 'bg-cyan-600 text-white'
                      : 'bg-purple-900/50 text-purple-300'
                  }`}
                >🔷 Kristall</button>
                <button
                  onClick={() => setEnsembleMode("solution")}
                  className={`p-1 rounded text-[10px] transition-all ${
                    ensembleMode === "solution"
                      ? 'bg-cyan-600 text-white'
                      : 'bg-purple-900/50 text-purple-300'
                  }`}
                >💧 Eritma</button>
              </div>
            )}
          </div>

          {/* BO'LIM 1: KO'RINISH */}
          <SectionHeader
            label="🎨 Ko'rinish"
            isOpen={expandedSection === "view"}
            onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
          />
          {expandedSection === "view" && (
            <div className="space-y-2 mb-2 pl-1">
              <div>
                <label className="text-[10px] text-purple-400 uppercase block mb-1">Rejim</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "ball-stick", label: "🔗", title: "Ball-stick" },
                    { id: "space-filling", label: "⚪", title: "To'la" },
                    { id: "wireframe", label: "🕸️", title: "Karkas" }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`p-1.5 rounded text-sm transition-all ${
                        viewMode === mode.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800'
                      }`}
                      title={mode.title}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <ToggleRow label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
              <ToggleRow label="📏 Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
              <ToggleRow label="🌐 Tashqi sfera" value={showOuterSphere} onChange={setShowOuterSphere} />
              <ToggleRow label="✂️ Kesim ko'rinishi" value={sliceView} onChange={setSliceView} />
              <ToggleRow label="📐 Burchak o'lchash" value={angleMeasureMode} onChange={(v) => {
                setAngleMeasureMode(v)
                if (v) { setDistanceMeasureMode(false); setSelectedForDistance([]); setMeasuredDistance(null) }
                if (!v) { setSelectedLigands([]); setMeasuredAngle(null) }
              }} />
              <ToggleRow label="📏 Masofa o'lchash" value={distanceMeasureMode} onChange={(v) => {
                setDistanceMeasureMode(v)
                if (v) { setAngleMeasureMode(false); setSelectedLigands([]); setMeasuredAngle(null) }
                if (!v) { setSelectedForDistance([]); setMeasuredDistance(null) }
              }} />
              <ToggleRow label="📊 Barcha burchaklar" value={showAllAngles} onChange={setShowAllAngles} />

              <button
                onClick={() => togglePanel("dorbital")}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                  activePanel === "dorbital"
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <span>⚛️ d-orbital diagramma</span>
                <span>{activePanel === "dorbital" ? "✕" : "▸"}</span>
              </button>
            </div>
          )}

          {/* BO'LIM 2: SHAROITLAR */}
          <SectionHeader
            label="🧪 Sharoit / muhit"
            isOpen={expandedSection === "conditions"}
            onClick={() => setExpandedSection(expandedSection === "conditions" ? null : "conditions")}
          />
          {expandedSection === "conditions" && (
            <div className="space-y-2 mb-2 pl-1">

              <ToggleRow label="🔄 Ligand almashinish" value={showLigandExchange} onChange={(v) => {
                setShowLigandExchange(v)
                if (!v) {
                  setIsExchangePlaying(false)
                  setExchangeProgress(0)
                  animationStateRef.current.exchangeProgress = 0
                }
              }} />
              {showLigandExchange && (
                <div className="ml-2 mt-1 space-y-1 bg-purple-900/30 p-2 rounded">
                  <select
                    value={exchangeTarget}
                    onChange={(e) => {
                      setExchangeTarget(e.target.value)
                      setExchangeProgress(0)
                      animationStateRef.current.exchangeProgress = 0
                      setIsExchangePlaying(false)
                    }}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                  >
                    <option value="H2O">Cl⁻ → H₂O (1 ta)</option>
                    <option value="NH3">Cl⁻ → NH₃ (2 ta)</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (exchangeProgress >= 1) {
                          animationStateRef.current.exchangeProgress = 0
                          setExchangeProgress(0)
                        }
                        setIsExchangePlaying(!isExchangePlaying)
                      }}
                      className="text-xs bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded"
                    >
                      {isExchangePlaying ? "⏸️" : (exchangeProgress >= 1 ? "🔁" : "▶️")}
                    </button>
                    <button
                      onClick={() => {
                        animationStateRef.current.exchangeProgress = 0
                        setExchangeProgress(0)
                        setIsExchangePlaying(false)
                      }}
                      className="text-xs bg-purple-900 hover:bg-purple-800 px-2 py-1 rounded"
                      title="Reset"
                    >↺</button>
                    <div className="flex-1 h-1.5 bg-purple-900 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                        style={{ width: `${exchangeProgress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-[9px] text-purple-400">
                    {Math.round(exchangeProgress * 100)}% • {
                      exchangeProgress === 0 ? "Boshlash" :
                      exchangeProgress < 0.4 ? "Uzilish" :
                      exchangeProgress < 0.6 ? "O'tish" :
                      exchangeProgress < 1 ? "Bog'lanish" : "Yakunlandi"
                    }
                  </div>
                </div>
              )}

              <ToggleRow label="💧 Erituvchi qobig'i" value={showSolvation} onChange={setShowSolvation} />
              {showSolvation && (
                <div className="ml-2 mt-1 space-y-1 bg-purple-900/30 p-2 rounded">
                  <select
                    value={solventType}
                    onChange={(e) => setSolventType(e.target.value)}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                  >
                    <option value="water">Suv (H₂O)</option>
                    <option value="acetonitrile">CH₃CN</option>
                    <option value="ethanol">Etanol</option>
                  </select>
                  <div>
                    <label className="text-[9px] text-purple-400">Zichlik: {solvationDensity}</label>
                    <input
                      type="range" min="5" max="50" step="5"
                      value={solvationDensity}
                      onChange={(e) => setSolvationDensity(Number(e.target.value))}
                      className="w-full h-1"
                    />
                  </div>
                  <ToggleRow label="H-bog'lar" value={showHydrogenBonds} onChange={setShowHydrogenBonds} />
                </div>
              )}

              <ToggleRow label="🌡️ Temperatura" value={showTemperature} onChange={setShowTemperature} />
              {showTemperature && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <input
                    type="range" min="100" max="800" step="10"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full h-1"
                  />
                  <div className="text-[9px] text-purple-400 mt-1 flex justify-between">
                    <span>{temperature} K</span>
                    <span>{(temperature - 273).toFixed(0)}°C</span>
                  </div>
                </div>
              )}

              <ToggleRow label="📊 Bosim" value={showPressure} onChange={setShowPressure} />
              {showPressure && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <input
                    type="range" min="1" max="50000" step="500"
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full h-1"
                  />
                  <div className="text-[9px] text-purple-400 mt-1">{pressure.toLocaleString()} atm</div>
                </div>
              )}

              <ToggleRow label="⚗️ pH muhit" value={showPH} onChange={setShowPH} />
              {showPH && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <input
                    type="range" min="0" max="14" step="0.5"
                    value={phLevel}
                    onChange={(e) => setPHLevel(Number(e.target.value))}
                    className="w-full h-1"
                  />
                  <div className="text-[9px] text-purple-400 mt-1 flex justify-between">
                    <span>pH = {phLevel}</span>
                    <span>{phLevel < 7 ? "🔴 Kislotali" : phLevel > 7 ? "🔵 Ishqoriy" : "⚪ Neytral"}</span>
                  </div>
                </div>
              )}

              <ToggleRow label="⚡ Redoks reaksiyalar" value={showRedox} onChange={setShowRedox} />
              {showRedox && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <div className="text-[10px] text-purple-300 mb-1">Oksidlanish darajasi:</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[2, 3, 4].map(ox => (
                      <button
                        key={ox}
                        onClick={() => setOxidationState(ox)}
                        className={`p-1 rounded text-xs ${
                          oxidationState === ox ? 'bg-purple-600 text-white' : 'bg-purple-900/50'
                        }`}
                      >
                        +{ox}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BO'LIM 3: ILMIY */}
          <SectionHeader
            label="🔬 Ilmiy tahlil"
            isOpen={expandedSection === "scientific"}
            onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
          />
          {expandedSection === "scientific" && (
            <div className="space-y-2 pl-1">

              <button
                onClick={() => togglePanel("spectra")}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                  activePanel === "spectra"
                    ? 'bg-cyan-600 text-white'
                    : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <span>📡 Spektroskopiya</span>
                <span>{activePanel === "spectra" ? "✕" : "▸"}</span>
              </button>
              {activePanel === "spectra" && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <select
                    value={spectrumType}
                    onChange={(e) => setSpectrumType(e.target.value)}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                  >
                    <option value="uv-vis">UV-Vis</option>
                    <option value="ir">IR</option>
                    <option value="nmr">NMR</option>
                  </select>
                </div>
              )}

              <ToggleRow label="💎 Kristall maydon" value={showCrystalField} onChange={setShowCrystalField} />
              {showCrystalField && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <select
                    value={ligandFieldStrength}
                    onChange={(e) => setLigandFieldStrength(e.target.value)}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                  >
                    <option value="weak">Kuchsiz (I⁻, Br⁻)</option>
                    <option value="medium">O'rta (H₂O, NH₃)</option>
                    <option value="strong">Kuchli (CN⁻, CO)</option>
                  </select>
                </div>
              )}

              <ToggleRow label="📐 Jahn-Teller" value={showJahnTeller} onChange={setShowJahnTeller} />

              {/* 🔥 YANGI: Trans Effekt — Tekis kvadrat uchun muhim */}
              <ToggleRow label="🔄 Trans effekt" value={showTransEffect} onChange={(v) => {
                setShowTransEffect(v)
                if (!v) {
                  moleculeGroupsRef.current.forEach(mol => {
                    if (mol.userData.ligandGroups) {
                      mol.userData.ligandGroups.forEach(lg => {
                        lg.traverse(child => {
                          if (child.material && child.userData?.isDonor) {
                            child.material.emissive.setHex(complex.ligand.donorColor)
                            child.material.emissiveIntensity = 0.08
                          }
                        })
                      })
                    }
                  })
                }
              }} />
              {showTransEffect && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded space-y-1">
                  <div className="text-[10px] text-purple-300 mb-1">Ligand tanlang (Trans ta'sirini ko'ring):</div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <button
                        key={i}
                        onClick={() => setTransEffectLigand(i)}
                        className={`p-1.5 rounded text-[10px] font-bold ${
                          transEffectLigand === i
                            ? 'bg-green-600 text-white'
                            : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'
                        }`}
                      >
                        L{i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="text-[9px] text-purple-400 mt-1 leading-relaxed">
                    <span className="text-green-400">● Yashil</span> — tanlangan ligand<br/>
                    <span className="text-red-400">● Qizil</span> — <strong>trans</strong> pozitsiya (kuchsizlanadi)<br/>
                    <span className="text-purple-400">○ Boshqalar</span> — cis (ta'sir yo'q)
                  </div>
                  <div className="text-[9px] bg-purple-950/50 p-1.5 rounded text-purple-300 mt-1">
                    <strong>Trans effekt:</strong> L<sub>{transEffectLigand + 1}</sub> tanlanganda, qarama-qarshi L<sub>{(transEffectLigand + 2) % 4 + 1}</sub> 
                    kuchsizlanadi — bu Pt(II) kimyosida ligand almashinish mexanizmi
                  </div>
                </div>
              )}

              {/* 🔮 YANGI: 3D orbital shakllari */}
              <ToggleRow label="🔮 3D orbital shakllari" value={showOrbitalShapes} onChange={setShowOrbitalShapes} />
              {showOrbitalShapes && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded space-y-1">
                  <div className="text-[10px] text-purple-300 mb-1">Orbitalni tanlang:</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "dx2y2", label: "dx²-y²", color: "from-red-500 to-red-700" },
                      { id: "dxy", label: "dxy", color: "from-cyan-500 to-cyan-700" },
                      { id: "dz2", label: "dz²", color: "from-yellow-500 to-yellow-700" }
                    ].map(orb => (
                      <button
                        key={orb.id}
                        onClick={() => setSelectedOrbital(orb.id)}
                        className={`p-1.5 rounded text-[10px] font-bold bg-gradient-to-br ${
                          selectedOrbital === orb.id
                            ? `${orb.color} text-white`
                            : 'from-purple-900/60 to-purple-800/40 text-purple-300'
                        }`}
                      >
                        {orb.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[9px] text-purple-400 mt-1">
                    {selectedOrbital === "dx2y2" && "b₁g — ligandlar bilan σ* ta'sir (eng yuqori)"}
                    {selectedOrbital === "dxy" && "b₂g — ligandlar bilan π* ta'sir (o'rta)"}
                    {selectedOrbital === "dz2" && "a₁g — z o'qi bo'ylab (eng past)"}
                  </div>
                </div>
              )}

              {/* ✨ YANGI: Zarrachalar */}
              <ToggleRow label="✨ Zarrachalar animatsiyasi" value={showParticles} onChange={setShowParticles} />

              {/* 📊 YANGI: Spektrokimyoviy qator */}
              <ToggleRow label="📊 Spektrokimyoviy qator" value={showSpectrochemical} onChange={setShowSpectrochemical} />
              {showSpectrochemical && (
                <div className="ml-2 mt-1 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-2 rounded border border-purple-600/30">
                  <div className="text-[10px] text-purple-300 mb-1.5 font-bold">Ligand kuchi bo'yicha (△ₒ):</div>
                  <div className="flex items-end gap-1 h-16 mb-1">
                    {[
                      { name: "I⁻", val: 0.4, color: "bg-red-500" },
                      { name: "Br⁻", val: 0.5, color: "bg-orange-500" },
                      { name: "Cl⁻", val: 0.6, color: "bg-yellow-500" },
                      { name: "F⁻", val: 0.7, color: "bg-lime-500" },
                      { name: "H₂O", val: 0.8, color: "bg-cyan-500" },
                      { name: "NH₃", val: 0.9, color: "bg-blue-500" },
                      { name: "CN⁻", val: 1.0, color: "bg-violet-500" },
                    ].map(l => (
                      <div key={l.name} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full rounded-t ${l.color} transition-all duration-500 ${
                            complex.ligand.type === l.name || 
                            (complex.ligand.type === "NH3" && l.name === "NH₃") ||
                            (complex.ligand.type === "Cl" && l.name === "Cl⁻") ||
                            (complex.ligand.type === "CN" && l.name === "CN⁻")
                              ? 'ring-2 ring-white scale-y-110' : ''
                          }`}
                          style={{ height: `${l.val * 60}px` }}
                        ></div>
                        <span className={`text-[8px] mt-0.5 ${
                          (complex.ligand.type === "NH3" && l.name === "NH₃") ||
                          (complex.ligand.type === "Cl" && l.name === "Cl⁻") ||
                          (complex.ligand.type === "CN" && l.name === "CN⁻")
                            ? 'text-white font-bold' : 'text-purple-400'
                        }`}>{l.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-purple-400 flex justify-between">
                    <span>Kuchsiz</span>
                    <span className="text-cyan-300">● {complex.ligand.type === "Cl" ? "Cl⁻" : complex.ligand.type === "NH3" ? "NH₃" : "CN⁻"}</span>
                    <span>Kuchli</span>
                  </div>
                  <div className="text-[9px] bg-purple-950/40 p-1.5 rounded mt-1 text-purple-300">
                    <strong>△ₒ = {complex.dOrbital.deltaO.toLocaleString()} cm⁻¹</strong> — 
                    bu qiymat ligandning spektrokimyoviy qatordagi o'rniga mos keladi
                  </div>
                </div>
              )}

              <button
                onClick={() => togglePanel("mo")}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                  activePanel === "mo"
                    ? 'bg-pink-600 text-white'
                    : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <span>🌈 MO diagramma</span>
                <span>{activePanel === "mo" ? "✕" : "▸"}</span>
              </button>

              <button
                onClick={() => togglePanel("reaction")}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                  activePanel === "reaction"
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <span>📈 Reaksiya koord.</span>
                <span>{activePanel === "reaction" ? "✕" : "▸"}</span>
              </button>
            </div>
          )}
          </div>
        </div>

        {/* 3D CONTAINER */}
        <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-purple-300 text-lg">⚛️ Model yuklanmoqda...</p>
              </div>
            </div>
          )}

          {/* TOOLTIP */}
          {showTooltip && !loading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-purple-200 z-20 border border-purple-700/50 animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span>🖱️ aylantirish</span>
                <span className="text-purple-700">•</span>
                <span>🔍 zoom</span>
                <span className="text-purple-700">•</span>
                <span>👆 atom — ma'lumot</span>
              </div>
            </div>
          )}

          {/* Burchak o'lchash */}
          {angleMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-amber-100 z-25 border border-amber-600/50">
              {selectedLigands.length === 0 && "📐 1-ligandni tanlang (donor atomi)"}
              {selectedLigands.length === 1 && "📐 2-ligandni tanlang..."}
              {selectedLigands.length === 2 && measuredAngle && (
                <span>
                  📐 Burchak: <strong className="text-yellow-300 text-lg">{measuredAngle}°</strong>
                  {" "}
                  {parseFloat(measuredAngle) < 95 ? "(qo'shni)" : "(trans)"}
                </span>
              )}
            </div>
          )}

          {/* Indikatorlar zonasi */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 space-y-1 flex flex-col items-center">
            {showJahnTeller && (
              <div className="bg-pink-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-pink-200 border border-pink-700/50">
                📐 Jahn-Teller: Z o'qi bo'ylab deformatsiya (d⁹ — [Cu(NH₃)₄]²⁺)
              </div>
            )}
            {showOrbitalShapes && (
              <div className="bg-indigo-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-indigo-200 border border-indigo-500/50 flex items-center gap-2">
                <span>🔮</span>
                <span>3D orbital: <strong className="text-white">{selectedOrbital}</strong></span>
                <span className="text-indigo-400">| Aylanmoqda</span>
              </div>
            )}
            {showTransEffect && (
              <div className="bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-emerald-200 border border-emerald-500/50">
                🔄 Trans effekt: L<sub>{transEffectLigand + 1}</sub> → 
                <span className="text-red-400"> L<sub>{(transEffectLigand + 2) % 4 + 1}</sub></span> (trans)
              </div>
            )}
          </div>

          {/* O'NG PANELLAR */}
          {!fullscreenMode && selectedAtom && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs w-[280px] shadow-2xl animate-slide-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30"
                    style={{ backgroundColor: selectedAtom.info.color }}
                  ></div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                    <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAtom(null)}
                  className="text-purple-400 hover:text-white text-xl leading-none"
                >×</button>
              </div>
              <div className="space-y-2 text-sm">
                <InfoRow label="Atom massasi" value={selectedAtom.info.mass} mono />
                <InfoRow label="Elektron konfig." value={selectedAtom.info.config} mono small />
                {selectedAtom.info.oxidation && <InfoRow label="Oksidlanish darajasi" value={selectedAtom.info.oxidation} mono />}
                {selectedAtom.info.charge && <InfoRow label="Zaryad" value={selectedAtom.info.charge} mono />}
                {selectedAtom.info.hybridization && <InfoRow label="Gibridlanish" value={selectedAtom.info.hybridization} mono />}
                {selectedAtom.info.role && <InfoRow label="Vazifasi" value={selectedAtom.info.role} small />}
              </div>
            </div>
          )}

          {/* INFO PANEL */}
          {!fullscreenMode && !selectedAtom && activePanel === "info" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 max-w-sm w-[300px] shadow-2xl animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-purple-300">📋 Kompleks ma'lumotlari</h3>
                <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-2 text-xs">
                <InfoRow label="Formula (ion)" value={complex.formula} mono />
                <InfoRow label="To'liq tuz" value={complex.fullSalt} mono />
                <InfoRow label="Nomi" value={complex.name} small />
                <InfoRow label="Geometriya" value={complex.geometry} />
                <InfoRow label="Simmetriya" value={complex.symmetry} mono />
                <InfoRow label="Gibridlanish" value={complex.hybridization} mono />
                <InfoRow label="Bog' uzunligi" value={complex.bondLengthReal} mono />
                <InfoRow label="Magnit xossa" value={complex.magnetism} />
                <InfoRow label="Rangi" value={complex.color} small />
                <InfoRow label="Δₒ" value={`${complex.dOrbital.deltaO.toLocaleString()} cm⁻¹`} mono />
              </div>
            </div>
          )}

          {/* d-ORBITAL PANEL */}
          {!fullscreenMode && !selectedAtom && activePanel === "dorbital" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 shadow-2xl w-[300px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <span>⚛️</span> D4h orbital splitting
                </h3>
                <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="relative h-28 flex flex-col justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-10">dx²-y²</span>
                  <div className="flex-1 h-1 bg-purple-400 rounded relative">
                    {new Array(complex.dOrbital.dx2y2).fill(0).map((_, i) => (
                      <span key={i} className="absolute text-yellow-300 text-[10px]" style={{ left: `${6 + i * 10}px`, top: '-8px' }}>{i % 2 === 0 ? '↑' : '↓'}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-10">dxy</span>
                  <div className="flex-1 h-1 bg-purple-400 rounded relative">
                    {new Array(complex.dOrbital.dxy).fill(0).map((_, i) => (
                      <span key={i} className="absolute text-yellow-300 text-[10px]" style={{ left: `${6 + i * 10}px`, top: '-8px' }}>{i % 2 === 0 ? '↑' : '↓'}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-10">dz²</span>
                  <div className="flex-1 h-1 bg-purple-400 rounded relative">
                    {new Array(complex.dOrbital.dz2).fill(0).map((_, i) => (
                      <span key={i} className="absolute text-yellow-300 text-[10px]" style={{ left: `${6 + i * 10}px`, top: '-8px' }}>{i % 2 === 0 ? '↑' : '↓'}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-10">dxz,dyz</span>
                  <div className="flex-1 h-1 bg-purple-400 rounded relative">
                    {new Array(complex.dOrbital.dxz).fill(0).map((_, i) => (
                      <span key={i} className="absolute text-yellow-300 text-[10px]" style={{ left: `${6 + i * 10}px`, top: '-8px' }}>{i % 2 === 0 ? '↑' : '↓'}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-purple-800/50 text-[10px] text-purple-400 space-y-1">
                <div>Konfiguratsiya: <span className="text-white">d{complex.dElectrons}</span></div>
                <div>Spin: <span className="text-white font-mono">{complex.dOrbital.type === "LS" ? "Past spin (LS)" : "Yuqori spin (HS)"}</span></div>
                <div>Δₒ: <span className="text-white">{complex.dOrbital.deltaO.toLocaleString()} cm⁻¹</span></div>
              </div>
            </div>
          )}

          {/* MO PANEL */}
          {!fullscreenMode && !selectedAtom && activePanel === "mo" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-pink-700/50 shadow-2xl w-[300px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-pink-300">🌈 MO diagramma (D4h)</h3>
                <button onClick={() => setActivePanel(null)} className="text-pink-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">σ* (dx²-y²)</span><span className="text-white">{complex.dOrbital.dx2y2 > 0 ? '↑' : '—'}{(complex.dOrbital.dx2y2 > 1 ? '↓' : '')}</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">π* (dxy)</span><span className="text-white">{complex.dOrbital.dxy > 0 ? '↑↓' : '—'}</span></div>
                <div className="flex justify-between bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700/30"><span className="text-yellow-400">Δₒ</span><span className="text-yellow-300">{complex.dOrbital.deltaO} cm⁻¹</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">dz² (a₁g)</span><span className="text-white">{complex.dOrbital.dz2 > 0 ? '↑↓' : '—'}</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">dxz, dyz (eg)</span><span className="text-white">{complex.dOrbital.dxz > 0 ? '↑↓' : '—'}</span></div>
                <div className="border-t border-pink-700/30 mt-2 pt-2 text-pink-200 text-center">{complex.formula}</div>
              </div>
            </div>
          )}

          {/* REACTION PANEL */}
          {!fullscreenMode && !selectedAtom && activePanel === "reaction" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-green-700/50 shadow-2xl w-[320px] animate-slide-in">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-green-300">📈 Reaksiya koordinatasi</h3>
                <button onClick={() => setActivePanel(null)} className="text-green-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <svg viewBox="0 0 200 100" className="w-full h-28">
                <path d="M 10,80 Q 60,80 80,30 Q 100,15 120,30 Q 140,80 190,80"
                  stroke="#10b981" strokeWidth="2" fill="none" />
                <text x="10" y="95" fill="#a78bfa" fontSize="8">{complex.fullSalt}</text>
                <text x="85" y="20" fill="#fbbf24" fontSize="8">TS</text>
                <text x="150" y="95" fill="#a78bfa" fontSize="8">Mahsulot</text>
                <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2"/>
              </svg>
              <div className="text-[10px] text-purple-300 mt-1 bg-purple-900/40 p-2 rounded">
                Ligand almashinish: {complex.ligand.type} → H₂O
              </div>
            </div>
          )}

          {/* SPECTRA PANEL */}
          {!fullscreenMode && !selectedAtom && activePanel === "spectra" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-cyan-700/50 shadow-2xl w-[320px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-cyan-300">📡 {spectrumType.toUpperCase()} Spektr</h3>
                <button onClick={() => setActivePanel(null)} className="text-cyan-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <div className="h-24 bg-gradient-to-r from-purple-900 to-blue-900 rounded flex items-end justify-around p-1">
                  {[...Array(10)].map((_, i) => {
                    let h
                    if (spectrumType === "uv-vis") h = Math.exp(-Math.pow((i - 4) / 2.5, 2)) * 80 + 10
                    else if (spectrumType === "ir") h = [0, 0, 30, 60, 15, 75, 15, 30, 0, 0][i]
                    else h = [0, 0, 65, 10, 10, 10, 10, 65, 10, 0][i]
                    return <div key={i} className="w-2 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t" style={{ height: `${h}%` }} />
                  })}
                </div>
                <div className="text-[10px] text-purple-300 mt-2">
                  {spectrumType === "uv-vis" && `d-d o'tish: λmax ≈ ${complex.id === "CuNH3" ? "600" : "420"} nm`}
                  {spectrumType === "ir" && `${complex.center.element}-${complex.ligand.donor}: 300-500 cm⁻¹`}
                  {spectrumType === "nmr" && (complex.id === "PtCl4" ? "¹⁹⁵Pt: -1100 ppm" : "¹³C: 160 ppm")}
                </div>
              </div>
            </div>
          )}

          {/* PASTKI INFO */}
          {(showCrystalField || (showRedox && oxidationState !== 2)) && !loading && (
            <div className="absolute bottom-4 right-3 z-20 space-y-2 w-[280px]">
              {showCrystalField && (
                <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-purple-700/50 shadow-2xl animate-slide-in">
                  <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center justify-between">
                    <span>💎 Kristall maydon</span>
                    <button onClick={() => setShowCrystalField(false)} className="text-purple-500 hover:text-white">×</button>
                  </h4>
                  <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
                    <div>Ligand kuchi: <span className="text-white capitalize">{ligandFieldStrength}</span></div>
                    <div>Spin: <span className="text-white">{ligandFieldStrength === "weak" ? "Yuqori" : "Past"}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
        <div className="flex justify-center gap-3 sm:gap-6 py-3 px-3 sm:px-6 flex-wrap">
          <Stat label="Valent burchak" value="90°" />
          <Stat label="Koord. son" value="4" />
          <Stat label="Gibridlanish" value={complex.hybridization} mono />
          <Stat label="Simmetriya" value={complex.symmetry} mono />
          <Stat label={`${complex.center.element}-${complex.ligand.donor}`} value={complex.bondLengthReal} mono />
          <Stat label="Magnit" value={complex.magnetism.split(" ")[0]} />
          <Stat label="Molekulalar" value={`${moleculeCount}`} mono />
        </div>

        <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-xs">
          <LegendItem color={`#${complex.center.color.toString(16).padStart(6, '0')}`} label={`${complex.center.element} — ${ATOM_INFO[complex.center.element].name.split(' ')[0]}`} />
          <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, '0')}`} label={`${complex.ligand.donor} — donor`} />
          {complex.ligand.type === "NH3" && <LegendItem color="#ffffff" label="H — Vodorod" />}
          {complex.ligand.type === "CN" && <LegendItem color={`#${CPK.N.toString(16).padStart(6, '0')}`} label="N — Azot" />}
          {showOuterSphere && <LegendItem color={`#${complex.outerIon.color.toString(16).padStart(6, '0')}`} label={`${complex.outerIon.element} — tashqi`} />}
          {showSolvation && <LegendItem color={`#${CPK.O.toString(16).padStart(6, '0')}`} label="Erituvchi" />}
        </div>

        <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20">
          <p className="text-xs text-purple-500">
            <span className="font-mono text-purple-300">{complex.fullSalt}</span> • {complex.name} • {complex.geometry} • {complex.magnetism}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(76, 29, 149, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.8); }
      `}</style>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !pdfGenerating && setPdfModalOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-purple-950/98 via-indigo-950/98 to-purple-950/98 rounded-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-500/20 max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b-2 border-purple-500/30 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">📄</div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Ilmiy Hisobot
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30 font-mono">v2.1</span>
                    </h2>
                    <p className="text-xs text-purple-300">{cleanText(complex.formula)} • {new Date().toLocaleDateString("uz-UZ")}</p>
                  </div>
                </div>
                <button onClick={() => !pdfGenerating && setPdfModalOpen(false)} disabled={pdfGenerating} className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all disabled:opacity-30 flex items-center justify-center">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
                <div className="text-xs text-yellow-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2"><span>📊</span> Hisobot statistikasi</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><div className="text-2xl font-bold text-yellow-300">{Object.values(pdfSections).filter(Boolean).length}</div><div className="text-xs text-yellow-200/70 mt-0.5">Bo'lim</div></div>
                  <div><div className="text-2xl font-bold text-yellow-300">~{Math.max(1, Math.ceil(Object.values(pdfSections).filter(Boolean).length * 0.7))}</div><div className="text-xs text-yellow-200/70 mt-0.5">Sahifa</div></div>
                  <div><div className="text-2xl font-bold text-yellow-300">A4</div><div className="text-xs text-yellow-200/70 mt-0.5">Format</div></div>
                </div>
              </div>

              <div>
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2"><span>⚡</span> Tezkor tanlash</div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setPdfSections({ snapshot: true, info: true, conditions: true, geometry: true, dorbital: true, mo: false, spectra: false, crystalField: false, references: false })} className="py-2 px-3 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-lg text-xs text-purple-100 font-semibold transition-all">📄 Standart</button>
                  <button onClick={() => setPdfSections({ snapshot: true, info: true, conditions: true, geometry: true, dorbital: true, mo: true, spectra: true, crystalField: true, references: true })} className="py-2 px-3 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 hover:from-yellow-500/50 hover:to-orange-500/50 border border-yellow-500/40 rounded-lg text-xs text-yellow-100 font-semibold transition-all">📚 To'liq (ilmiy)</button>
                  <button onClick={() => setPdfSections({ snapshot: false, info: false, conditions: false, geometry: false, dorbital: false, mo: false, spectra: false, crystalField: false, references: false })} className="py-2 px-3 bg-red-900/30 hover:bg-red-800/40 border border-red-700/40 rounded-lg text-xs text-red-200 font-semibold transition-all">✕ Tozalash</button>
                </div>
              </div>

              <div>
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2"><span>📋</span> Hisobot bo'limlari</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { key: "snapshot", icon: "📸", label: "3D Vizualizatsiya", desc: "Yuqori sifatli snapshot (1920×1080)" },
                    { key: "info", icon: "📋", label: "Birikma identifikatsiyasi", desc: "Formula, IUPAC, xossalar" },
                    { key: "geometry", icon: "📐", label: "Molekulyar geometriya", desc: "Burchaklar, masofalar, RMSD" },
                    { key: "conditions", icon: "🧪", label: "Simulyatsiya shartlari", desc: "T, P, pH, erituvchi" },
                    { key: "dorbital", icon: "⚛️", label: "d-orbital ajralishi (D4h)", desc: "Kristall maydon diagrammasi" },
                    { key: "mo", icon: "🌈", label: "MO diagramma", desc: "Molekulyar orbitallar" },
                    { key: "spectra", icon: "📡", label: "Spektroskopiya + IR grafik", desc: "UV-Vis, IR, NMR bashorati" },
                    { key: "crystalField", icon: "💎", label: "KM Barqarorlashuv Energiyasi", desc: "CFSE hisob-kitobi" },
                    { key: "references", icon: "📚", label: "Foydalanilgan adabiyotlar", desc: "8 ta ilmiy manba", highlight: true }
                  ].map(item => (
                    <label key={item.key} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${pdfSections[item.key] ? item.highlight ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'bg-gradient-to-br from-purple-700/40 to-indigo-700/30 border-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/40'}`}>
                      <input type="checkbox" checked={pdfSections[item.key]} onChange={(e) => setPdfSections({ ...pdfSections, [item.key]: e.target.checked })} className={`mt-1 w-4 h-4 cursor-pointer flex-shrink-0 ${item.highlight ? 'accent-yellow-500' : 'accent-purple-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold flex items-center gap-2 ${pdfSections[item.key] ? item.highlight ? 'text-yellow-200' : 'text-purple-100' : 'text-purple-300'}`}>
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                          {item.highlight && pdfSections[item.key] && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/30 text-yellow-200 rounded-full border border-yellow-500/40 font-mono">MUHIM</span>}
                        </div>
                        <div className={`text-xs mt-0.5 ${pdfSections[item.key] ? 'text-purple-200/80' : 'text-purple-400/70'}`}>{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div><strong className="text-blue-100">Maslahat:</strong> Ilmiy ish uchun "To'liq (ilmiy)" variantini tanlang. Adabiyotlar ro'yxati akademik standartlarga mos keladi.</div>
              </div>

              {/* 🖼️ Render sifati */}
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-600/30 rounded-xl p-3">
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                  <span>🖼️</span> 3D Render sifati
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "hd", label: "HD", detail: "1920×1080", icon: "📺" },
                    { id: "4k", label: "4K", detail: "3840×2160", icon: "🖥️" },
                    { id: "8k", label: "8K", detail: "7680×4320", icon: "🏆" },
                  ].map(q => (
                    <button
                      key={q.id}
                      onClick={() => setPdfRenderQuality(q.id)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                        pdfRenderQuality === q.id
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg'
                          : 'bg-purple-900/40 text-purple-300 border-purple-800/40 hover:bg-purple-800/60'
                      }`}
                    >
                      <div className="text-base mb-0.5">{q.icon}</div>
                      <div>{q.label}</div>
                      <div className="text-[9px] opacity-70">{q.detail}</div>
                    </button>
                  ))}
                </div>
                <div className="text-[9px] text-purple-400 mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pdfShowTopView}
                    onChange={(e) => setPdfShowTopView(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span>Yuqoridan ko'rinishni qo'shish (D4h simmetriya)</span>
                </div>
                <div className="text-[9px] text-purple-500 mt-1">
                  {pdfRenderQuality === "hd" && "⚡ Tez, kichik hajm (tavsiya etiladi)"}
                  {pdfRenderQuality === "4k" && "⭐ Muvozanatli sifat/tezlik (standart)"}
                  {pdfRenderQuality === "8k" && "🏆 Maksimal sifat, katta fayl"}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setPdfModalOpen(false)} disabled={pdfGenerating} className="flex-1 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 font-semibold transition-all border border-purple-700/50 disabled:opacity-40 disabled:cursor-not-allowed">Bekor qilish</button>
                <button onClick={generatePDF} disabled={pdfGenerating || Object.values(pdfSections).filter(Boolean).length === 0} className="flex-[1.5] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-400/30">
                  {pdfGenerating ? (
                    <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Yaratilmoqda...</span></>
                  ) : (
                    <><span className="text-xl">⬇️</span><span>Ilmiy hisobotni yuklab olish</span></>
                  )}
                </button>
              </div>
              <p className="text-xs text-purple-400 text-center font-mono pt-1">📁 {cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_{new Date().toISOString().slice(0, 10)}.pdf</p>
            </div>
          </div>
        </div>
      )}

      {/* CITATION MODAL */}
      {citationModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setCitationModalOpen(false)}>
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-600/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-purple-200 flex items-center gap-2"><span>📚</span> Iqtibos olish (Citation)</h2>
              <button onClick={() => setCitationModalOpen(false)} className="text-purple-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-5">
              <p className="text-purple-300 text-sm mb-3">Format tanlang:</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[{ val: "apa", label: "APA" }, { val: "mla", label: "MLA" }, { val: "chicago", label: "Chicago" }, { val: "bibtex", label: "BibTeX" }].map(fmt => (
                  <button key={fmt.val} onClick={() => setCitationFormat(fmt.val)} className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${citationFormat === fmt.val ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60 border border-purple-700/40'}`}>{fmt.label}</button>
                ))}
              </div>
              <div className="bg-purple-950/70 border border-purple-700/50 rounded-lg p-4 mb-4">
                <pre className="text-purple-100 text-sm whitespace-pre-wrap font-mono leading-relaxed">{getCitation()}</pre>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(getCitation()); alert("📋 Iqtibos nusxalandi!") }} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg">📋 Nusxa olish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════
function SectionHeader({ label, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all mb-1 ${
        isOpen
          ? 'bg-purple-700/50 text-white border border-purple-500/50'
          : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40 border border-purple-800/30'
      }`}
    >
      <span>{label}</span>
      <span className="text-sm">{isOpen ? "▼" : "▶"}</span>
    </button>
  )
}

function ToggleRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-purple-900/30 px-1 py-1 rounded">
      <span className="text-[11px] text-purple-200">{label}</span>
      <div
        onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-all relative cursor-pointer flex-shrink-0 ${
          value ? 'bg-purple-500' : 'bg-purple-900'
        }`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
          value ? 'left-4' : 'left-0.5'
        }`}></div>
      </div>
    </label>
  )
}

function InfoRow({ label, value, mono, small }) {
  return (
    <div className="bg-purple-900/50 rounded-lg p-2">
      <p className="text-purple-400 text-[10px] mb-0.5 uppercase">{label}</p>
      <p className={`text-white ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  )
}

function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-purple-400 mb-0.5 uppercase">{label}</div>
      <div className={`text-base sm:text-lg font-bold text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full shadow-md border border-white/20" style={{ backgroundColor: color }}></div>
      <span className="text-purple-300">{label}</span>
    </div>
  )
}
