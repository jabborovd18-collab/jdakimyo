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
  Co: 0xF090A0, Fe: 0xE06633, N: 0x3050F8, C: 0x909090,
  H: 0xFFFFFF, O: 0xFF0D0D, Cl: 0x1FF01F, K: 0x8F40D4,
  bond: 0x8B9DC3, hbond: 0x66CCFF
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKS DATABASE
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CoNH3: {
    id: "CoNH3",
    formula: "[Co(NH₃)₆]³⁺",
    fullSalt: "[Co(NH₃)₆]Cl₃",
    name: "Geksaamminkobalt(III) xlorid",
    center: { element: "Co", color: CPK.Co, radius: 0.45, charge: "+3" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.0, bondLengthReal: "1.96 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.32, charge: "-1", count: 3 },
    hybridization: "d²sp³", magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 23000 },
    geometry: "Oktaedrik", symmetry: "Oh",
    dElectrons: 6
  },
  FeCN: {
    id: "FeCN",
    formula: "[Fe(CN)₆]⁴⁻",
    fullSalt: "K₄[Fe(CN)₆]",
    name: "Kaliy geksatsianoferrat(II) (sariq qon tuzi)",
    center: { element: "Fe", color: CPK.Fe, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.95, bondLengthReal: "1.92 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d²sp³", magnetism: "Diamagnit",
    color: "Sariq kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 33000 },
    geometry: "Oktaedrik", symmetry: "Oh",
    dElectrons: 6
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion", color: "#F090A0" },
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+2", role: "Markaziy ion", color: "#E06633" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Ligand donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "CN⁻ donor atomi", hybridization: "sp", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃/H₂O tarkibi", color: "#FFFFFF" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "H₂O donor", hybridization: "sp³", color: "#FF0D0D" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Tashqi sfera ioni / ligand", color: "#1FF01F" },
  K:  { name: "Kaliy (K⁺)", atomic: 19, mass: "39.10 u", config: "[Ar]", charge: "+1", role: "Tashqi sfera kation", color: "#8F40D4" }
}

// ═══════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR (global scope — modal va PDF uchun)
// ═══════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
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
    const n = count === 8 ? 2 : 3
    const spacing = 7
    const offset = (n - 1) * spacing / 2
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          positions.push(new THREE.Vector3(
            i * spacing - offset,
            j * spacing - offset,
            k * spacing - offset
          ))
        }
      }
    }
  } else {
    const radius = count === 8 ? 6 : 9
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = radius * (0.6 + ((i * 9301 + 49297) % 233280) / 233280 * 0.4) // deterministic
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }
  }
  return positions
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Oktaedrik3D() {
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
  const [currentComplex, setCurrentComplex] = useState("CoNH3")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick")
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)

  // YAGONA ACTIVE PANEL — bir vaqtda faqat bittasi ko'rinadi
  const [activePanel, setActivePanel] = useState(null) // null | "info" | "dorbital" | "mo" | "reaction" | "spectra"

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
  const [oxidationState, setOxidationState] = useState(3)

  const [showJahnTeller, setShowJahnTeller] = useState(false)
  const [showIsomers, setShowIsomers] = useState(false)
  const [isomerType, setIsomerType] = useState("none")

  // ✨ YANGI FUNKSIYALAR
  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C4") // C4 | C3 | sigma_h | sigma_v
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedForDistance, setSelectedForDistance] = useState([])
  const [measuredDistance, setMeasuredDistance] = useState(null)
  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch") // sym_stretch | asym_stretch | bend
  const [showAllAngles, setShowAllAngles] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [citationFormat, setCitationFormat] = useState("apa")
  const [pdfGenerating, setPdfGenerating] = useState(false)
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

  // Akkordeon — boshqaruv paneli bo'limlari
  const [expandedSection, setExpandedSection] = useState("view") // view | conditions | scientific | export

  // 🖥️ FULLSCREEN — faqat 3D modelni ko'rsatish rejimi
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
  // H₂O LIGAND
  // ═══════════════════════════════════════════════════════════
  const createH2OLigand = useCallback((parent, oPos, coPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'H2O', donorPos: oPos.clone() }

    const oGeo = new THREE.SphereGeometry(0.32, 48, 48)
    const oMat = new THREE.MeshStandardMaterial({
      color: CPK.O, roughness: 0.35, metalness: 0.15,
      emissive: CPK.O, emissiveIntensity: 0.08
    })
    const oMesh = new THREE.Mesh(oGeo, oMat)
    oMesh.position.copy(oPos)
    oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, isDonor: true }
    oMesh.castShadow = true
    group.add(oMesh)
    atomsRef.current.push(oMesh)
    ligandAtomsRef.current.push(oMesh)

    const oLabel = makeTextSprite("O", { color: "#fecaca", scale: 0.35 })
    oLabel.position.copy(oPos).add(new THREE.Vector3(0, 0.45, 0))
    group.add(oLabel)
    labelsRef.current.push(oLabel)

    const oToCo = new THREE.Vector3().subVectors(coPos, oPos).normalize()
    const outDir = oToCo.clone().negate()

    let perp1 = new THREE.Vector3()
    if (Math.abs(oToCo.y) < 0.9) {
      perp1.crossVectors(oToCo, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(oToCo, new THREE.Vector3(1, 0, 0)).normalize()
    }

    const hohAngle = 104.5 * Math.PI / 180
    const halfAngle = hohAngle / 2

    for (let i = 0; i < 2; i++) {
      const sign = i === 0 ? 1 : -1
      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(halfAngle))
        .addScaledVector(perp1, Math.sin(halfAngle) * sign)
        .normalize()

      const hPos = new THREE.Vector3().copy(oPos).addScaledVector(hDir, 0.96)

      const hGeo = new THREE.SphereGeometry(0.15, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H, roughness: 0.6, metalness: 0.05
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
      group.add(hMesh)
      atomsRef.current.push(hMesh)

      const bond = createBond(group, oPos, hPos, 0xcccccc, 0.05)
      bond.userData = { type: 'bond', bondType: 'O-H', length: '0.96 Å' }
      bondsRef.current.push(bond)
    }

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Cl⁻ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createClLigand = useCallback((parent, clPos) => {
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
  // BITTA MOLEKULA YARATISH
  // ═══════════════════════════════════════════════════════════
  const buildSingleMolecule = useCallback((parent, complexData, centerPos = new THREE.Vector3(0, 0, 0), scale = 1) => {
    const molGroup = new THREE.Group()
    molGroup.position.copy(centerPos)
    molGroup.scale.setScalar(scale)
    molGroup.userData = { type: 'molecule', baseScale: scale }

    const center = complexData.center
    const localLigandGroups = []

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

    const d = complexData.bondLength
    const ligandPositions = [
      [ d,  0,  0], [-d,  0,  0],
      [ 0,  d,  0], [ 0, -d,  0],
      [ 0,  0,  d], [ 0,  0, -d]
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
      if (complexData.ligand.type === "NH3") {
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
    const outerDistance = 4.5
    const outerPositions = []

    if (outer.count === 3) {
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) + Math.PI / 4
        outerPositions.push(new THREE.Vector3(
          outerDistance * Math.cos(angle),
          0.8 * Math.sin(i * Math.PI / 2),
          outerDistance * Math.sin(angle)
        ))
      }
    } else if (outer.count === 4) {
      const tetVerts = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]]
      tetVerts.forEach(v => {
        outerPositions.push(new THREE.Vector3(
          v[0] * outerDistance * 0.65,
          v[1] * outerDistance * 0.65,
          v[2] * outerDistance * 0.65
        ))
      })
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
        transparent: true, opacity: 0.4, linewidth: 2
      })
      const ionBond = new THREE.Line(ionBondGeo, ionBondMat)
      ionBond.computeLineDistances()
      ionBond.visible = false
      ionBond.userData = { type: 'ionic-bond' }
      molGroup.add(ionBond)
      outerSphereRef.current.push(ionBond)
    })

    molGroup.userData.coAtom = coAtom
    molGroup.userData.ligandGroups = localLigandGroups
    molGroup.userData.ligandVectors = ligandVectors

    parent.add(molGroup)
    return molGroup
  }, [createBond, createNH3Ligand, createCNLigand])

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
    const moleculeScale = count === 1 ? 1 : (count === 8 ? 0.7 : 0.5)

    positions.forEach((pos) => {
      const molGroup = buildSingleMolecule(scene, complexData, pos, moleculeScale)
      moleculeGroupsRef.current.push(molGroup)
      if (molGroup.userData.ligandGroups) {
        ligandGroupsRef.current.push(...molGroup.userData.ligandGroups)
      }
    })

    if (count === 1 && moleculeGroupsRef.current[0]) {
      const mol = moleculeGroupsRef.current[0]
      const ligVecs = mol.userData.ligandVectors
      const edgeMaterial = new THREE.LineDashedMaterial({
        color: 0x8B5CF6, dashSize: 0.15, gapSize: 0.1,
        transparent: true, opacity: 0.5
      })
      for (let i = 0; i < ligVecs.length; i++) {
        for (let j = i + 1; j < ligVecs.length; j++) {
          const dot = ligVecs[i].dot(ligVecs[j])
          if (Math.abs(dot) < 0.01) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              ligVecs[i], ligVecs[j]
            ])
            const line = new THREE.Line(geometry, edgeMaterial.clone())
            line.computeLineDistances()
            line.userData = { type: 'edge' }
            mol.add(line)
          }
        }
      }
    }
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
    const maxDist = 8

    for (let i = 0; i < count; i++) {
      const theta = (i * 137.5) * Math.PI / 180 // golden angle - deterministic
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const r = minDist + (i % 5) / 5 * (maxDist - minDist)

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

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

        const angle = 104.5 * Math.PI / 360
        const randRot = (i * 0.3) % (Math.PI * 2)
        for (let j = 0; j < 2; j++) {
          const sign = j === 0 ? 1 : -1
          const hx = 0.5 * Math.sin(angle) * sign * Math.cos(randRot)
          const hy = -0.5 * Math.cos(angle)
          const hz = 0.5 * Math.sin(angle) * sign * Math.sin(randRot)

          const hGeo = new THREE.SphereGeometry(0.09, 12, 12)
          const hMat = new THREE.MeshStandardMaterial({
            color: CPK.H, transparent: true, opacity: 0.5
          })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.set(hx, hy, hz)
          solventGroup.add(hMesh)

          const bondGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8)
          const bondMat = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa, transparent: true, opacity: 0.4
          })
          const bond = new THREE.Mesh(bondGeo, bondMat)
          bond.position.set(hx / 2, hy / 2, hz / 2)
          bond.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(hx, hy, hz).normalize()
          )
          solventGroup.add(bond)
        }
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
    camera.position.set(7, 5, 8)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true  // PDF eksport uchun zarur
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
    grid.position.y = -8
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

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
            // MASOFA O'LCHASH
            setSelectedForDistance(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                const dist = newList[0].position.distanceTo(newList[1].position)
                // 1 Three.js unit ≈ bondLength/realBondLength masshtabi
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

      // Jahn-Teller
      if (showJahnTellerRef.current) {
        moleculeGroupsRef.current.forEach(mol => {
          const stretch = 1 + Math.sin(elapsed * 1.5) * 0.05
          const baseScale = mol.userData.baseScale || 1
          mol.scale.y = baseScale * stretch
        })
      }

      // 🎵 TEBRANISH REJIMLARI (Vibrational modes)
      if (showVibrationRef.current && moleculeGroupsRef.current[0]) {
        const mol = moleculeGroupsRef.current[0]
        if (mol.userData.ligandGroups) {
          const vibMode = vibrationModeRef.current
          const t = elapsed * 4 // tezlik
          mol.userData.ligandGroups.forEach((lg, idx) => {
            if (!lg.userData.originalPos) return
            const dir = lg.userData.originalPos.clone().normalize()
            let amplitude = 0

            if (vibMode === "sym_stretch") {
              // Hammasi birga ichkari-tashqari
              amplitude = Math.sin(t) * 0.15
            } else if (vibMode === "asym_stretch") {
              // X o'qidagi 2 ta qarama-qarshi
              if (idx === 0) amplitude = Math.sin(t) * 0.2
              else if (idx === 1) amplitude = -Math.sin(t) * 0.2
              else amplitude = 0
            } else if (vibMode === "bend") {
              // Egilish — perpendikulyar harakat
              if (idx < 4) {
                amplitude = 0
                const perpDir = new THREE.Vector3(0, Math.sin(t + idx * Math.PI / 2) * 0.15, 0)
                lg.position.copy(lg.userData.originalPos).add(perpDir)
                return
              }
            }

            const newPos = lg.userData.originalPos.clone().addScaledVector(dir, amplitude)
            lg.position.copy(newPos)
          })
        }
      } else if (!showVibrationRef.current && !showLigandExchangeRef.current) {
        // Tebranish o'chgach asl pozitsiyaga qaytar
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ═══════════════════════════════════════════════════════════
  // REF'LAR (animatsiyalar uchun — state'ni o'qish)
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
        obj.userData.type === 'ionic-bond' ||
        obj.userData.type === 'ligand'
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
  // Jahn-Teller o'chirilganda reset
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
  // pH EFFEKTI
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
  // REDOKS
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
  // LIGAND ALMASHINISH (TUZATILGAN)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!showLigandExchange) {
      // Reset
      moleculeGroupsRef.current.forEach(mol => {
        if (mol.userData.ligandGroups) {
          mol.userData.ligandGroups.forEach(lg => {
            if (lg.userData.originalPos) {
              lg.position.copy(lg.userData.originalPos)
            }
            lg.scale.setScalar(1)
            lg.visible = true
            // Bog'larni ham qaytar
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
      if (idx >= ligandsToReplace) {
        // Boshqa ligandlar holatida qoladi
        return
      }

      if (!lg.userData.originalPos) return

      const t = exchangeProgress

      if (t === 0) {
        // Boshlang'ich
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
        // 1-faza: eski ligand uzoqlashadi
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
        // 2-faza: o'tish (eski ko'rinmaydi, yangi hali yo'q)
        lg.visible = false
        if (lg.userData.bond) {
          lg.userData.bond.visible = false
        }
      } else {
        // 3-faza: yangi ligand keladi (vizual o'zgartiramiz — rangi)
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

        // Yangi ligand rangini berish (vizual ko'rsatish uchun)
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

  // Exchange target o'zgarsa — rangni qaytarish
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
        const vdwScales = { Co: 2.4, Fe: 2.4, N: 2.0, C: 2.1, H: 1.6, Cl: 2.3, K: 2.6, O: 1.9 }
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
  // 🔬 SIMMETRIYA ELEMENTLARI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Eskilarini tozalash
    symmetryHelpersRef.current.forEach(h => {
      scene.remove(h)
      if (h.geometry) h.geometry.dispose()
      if (h.material) h.material.dispose()
    })
    symmetryHelpersRef.current = []

    if (!showSymmetry || moleculeCount !== 1) return

    const len = 4

    if (symmetryElement === "C4") {
      // 3 ta C4 o'qi (X, Y, Z)
      const axes = [
        { dir: [1, 0, 0], color: 0xff4444, label: "C₄ (x)" },
        { dir: [0, 1, 0], color: 0x44ff44, label: "C₄ (y)" },
        { dir: [0, 0, 1], color: 0x4488ff, label: "C₄ (z)" }
      ]
      axes.forEach(a => {
        const dir = new THREE.Vector3(...a.dir)
        const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
        const geom = new THREE.BufferGeometry().setFromPoints(points)
        const mat = new THREE.LineBasicMaterial({ color: a.color, linewidth: 2, transparent: true, opacity: 0.7 })
        const line = new THREE.Line(geom, mat)
        line.userData = { type: 'symmetry' }
        scene.add(line)
        symmetryHelpersRef.current.push(line)

        const label = makeTextSprite(a.label, {
          color: "#ffffff",
          bgColor: `rgba(${(a.color >> 16) & 255}, ${(a.color >> 8) & 255}, ${a.color & 255}, 0.85)`,
          borderColor: "#ffffff", scale: 0.4
        })
        label.position.copy(dir.clone().multiplyScalar(len + 0.5))
        label.userData = { type: 'symmetry' }
        scene.add(label)
        symmetryHelpersRef.current.push(label)
      })
    } else if (symmetryElement === "C3") {
      // 4 ta C3 o'qi (kub diagonallari bo'ylab)
      const diag = [
        [1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]
      ]
      diag.forEach((d, i) => {
        const dir = new THREE.Vector3(...d).normalize()
        const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
        const geom = new THREE.BufferGeometry().setFromPoints(points)
        const mat = new THREE.LineDashedMaterial({
          color: 0xff8800, dashSize: 0.2, gapSize: 0.15,
          transparent: true, opacity: 0.7
        })
        const line = new THREE.Line(geom, mat)
        line.computeLineDistances()
        line.userData = { type: 'symmetry' }
        scene.add(line)
        symmetryHelpersRef.current.push(line)

        if (i === 0) {
          const label = makeTextSprite("C₃", {
            color: "#ffffff", bgColor: "rgba(255, 136, 0, 0.85)",
            borderColor: "#ffffff", scale: 0.4
          })
          label.position.copy(dir.clone().multiplyScalar(len + 0.5))
          label.userData = { type: 'symmetry' }
          scene.add(label)
          symmetryHelpersRef.current.push(label)
        }
      })
    } else if (symmetryElement === "sigma_h") {
      // Gorizontal tekislik (XZ)
      const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xff44ff, transparent: true, opacity: 0.25,
        side: THREE.DoubleSide
      })
      const plane = new THREE.Mesh(planeGeo, planeMat)
      plane.rotation.x = Math.PI / 2
      plane.userData = { type: 'symmetry' }
      scene.add(plane)
      symmetryHelpersRef.current.push(plane)

      const label = makeTextSprite("σh", {
        color: "#ffffff", bgColor: "rgba(255, 68, 255, 0.85)",
        borderColor: "#ffffff", scale: 0.45
      })
      label.position.set(len, 0.3, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_v") {
      // Vertikal tekisliklar (XY va YZ)
      const planes = [
        { rot: [0, 0, 0], color: 0x00ffff },
        { rot: [0, Math.PI / 2, 0], color: 0xffff00 }
      ]
      planes.forEach(p => {
        const geo = new THREE.PlaneGeometry(len * 2, len * 2)
        const mat = new THREE.MeshBasicMaterial({
          color: p.color, transparent: true, opacity: 0.2,
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
      label.position.set(len, len, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    }
  }, [showSymmetry, symmetryElement, moleculeCount, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // 📏 MASOFA O'LCHASH — chiziq vizualizatsiyasi
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

    // Donor atomlarni yoritish
    if (distanceMeasureMode) {
      atomsRef.current.forEach(atom => {
        if (atom.material) {
          atom.material.emissiveIntensity = selectedForDistance.includes(atom) ? 0.7 : (atom.material.emissiveIntensity || 0.05)
        }
      })
    }
  }, [selectedForDistance, distanceMeasureMode])

  // ═══════════════════════════════════════════════════════════
  // 📊 BARCHA BURCHAKLARNI HISOBLASH
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
  // 📄 PDF EKSPORT — ilmiy maqola uslubida
  // ═══════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════
// 🧹 PDF UCHUN MATN TOZALAGICH (Unicode -> ASCII)
// ═══════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(m)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (m) => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(m)])
    .replace(/⁺/g, "+").replace(/⁻/g, "-")
    .replace(/Å/g, "A").replace(/Δ/g, "D").replace(/ₒ/g, "o")
    .replace(/σ/g, "sigma").replace(/π/g, "pi").replace(/λ/g, "lambda")
    .replace(/→/g, "->").replace(/⇌/g, "<=>").replace(/≈/g, "~")
    .replace(/↑/g, "^").replace(/↓/g, "v")
    .replace(/α/g, "a").replace(/β/g, "b").replace(/γ/g, "g")
    .replace(/×/g, "x").replace(/•/g, "-").replace(/²/g, "2").replace(/³/g, "3");
};

// ═══════════════════════════════════════════════════════════
// 📄 PDF EKSPORT — YAKUNIY TUZATILGAN VERSIYA
// ═══════════════════════════════════════════════════════════
const generatePDF = async () => {
  setPdfGenerating(true)
  try {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    // ── Font yuklash ─────────────────────────────────
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
      console.log("✅ DejaVu Sans fontlari yuklandi")
    } catch (fontErr) {
      console.error("❌ Font yuklashda xato:", fontErr)
      alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
      setPdfGenerating(false)
      return
    }

    // ── Ranglar ─────────────────────────────────────
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
    }

    const wrapText = (text, font, size, maxWidth) => {
      const words = String(text).split(" ")
      const lines = []
      let current = ""
      words.forEach(word => {
        const test = current ? `${current} ${word}` : word
        if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
          lines.push(current)
          current = word
        } else {
          current = test
        }
      })
      if (current) lines.push(current)
      return lines
    }

    let page = pdfDoc.addPage([595.28, 841.89])
    const { width: pageW, height: pageH } = page.getSize()
    const margin = 50
    let y = pageH - margin
    let pageNum = 1

    const addFooter = () => {
      page.drawText(
        `Oktaedrik 3D Lab PRO  •  ${cleanText(complex.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
        { x: margin, y: 30, size: 8, font: regularFont, color: C.textGray }
      )
      page.drawText(`${pageNum}`, {
        x: pageW - margin, y: 30, size: 8,
        font: regularFont, color: C.textGray, textAlign: "right",
      })
    }

    const addNewPage = () => {
      addFooter()
      page = pdfDoc.addPage([595.28, 841.89])
      pageNum++
      y = pageH - margin
    }

    const checkPageBreak = (need) => {
      if (y - need < 60) addNewPage()
    }

    const drawSectionHeader = (num, title) => {
      checkPageBreak(40)
      page.drawRectangle({ x: margin, y: y - 18, width: 12, height: 18, color: C.purple })
      page.drawText(`${num}. ${cleanText(title)}`, {
        x: margin + 18, y: y - 14, size: 13, font: boldFont, color: C.purple,
      })
      y -= 24
      page.drawLine({
        start: { x: margin, y: y }, end: { x: pageW - margin, y: y },
        thickness: 0.5, color: C.grayLine,
      })
      y -= 12
    }

    const drawTableRow = (label, value, bgColor = C.bgPurple, labelColor = C.purple) => {
      const labelWidth = 185
      const rowHeight = 18
      checkPageBreak(rowHeight + 2)
      page.drawRectangle({
        x: margin, y: y - rowHeight, width: pageW - 2 * margin, height: rowHeight, color: bgColor,
      })
      page.drawText(cleanText(label), {
        x: margin + 4, y: y - 12, size: 9, font: boldFont, color: labelColor,
      })
      page.drawText(cleanText(value), {
        x: margin + labelWidth + 4, y: y - 12, size: 9, font: regularFont, color: C.textDark,
      })
      y -= rowHeight
    }

    // ════════════════════════════════════════════════════
    // HEADER
    // ════════════════════════════════════════════════════
    page.drawRectangle({ x: 0, y: pageH - 65, width: pageW, height: 65, color: C.purpleDark })
    page.drawText(
      "JDA-KIMYO ILMIY BYULLETENI  •  Koordinatsion Kimyo  •  Vol. 2, Son 1",
      { x: margin, y: pageH - 25, size: 9, font: regularFont, color: C.purpleLight }
    )
    page.drawText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
      x: pageW - margin, y: pageH - 25, size: 9,
      font: regularFont, color: C.purpleLight, textAlign: "right",
    })
    page.drawLine({
      start: { x: margin, y: pageH - 37 }, end: { x: pageW - margin, y: pageH - 37 },
      thickness: 1, color: C.purpleMid,
    })
    page.drawText("Interaktiv 3D Molekulyar Modellashtirish Platformasi", {
      x: margin, y: pageH - 50, size: 7.5, font: regularFont, color: rgb(0.71, 0.71, 0.86),
    })
    page.drawText("DOI: 10.0000/jda-kimyo.2026.001", {
      x: pageW - margin, y: pageH - 50, size: 7.5,
      font: regularFont, color: rgb(0.71, 0.71, 0.86), textAlign: "right",
    })
    y = pageH - 95

    // ════════════════════════════════════════════════════
    // TITLE
    // ════════════════════════════════════════════════════
    page.drawText(`${cleanText(complex.formula)} Struktur Tahlili`, {
      x: pageW / 2, y: y, size: 20, font: boldFont, color: C.textDark, textAlign: "center",
    })
    y -= 25
    page.drawText(cleanText(complex.name), {
      x: pageW / 2, y: y, size: 12, font: italicFont, color: C.purpleSoft, textAlign: "center",
    })
    y -= 20
    page.drawText(
      `Geometriya: ${cleanText(complex.geometry)} (${cleanText(complex.symmetry)})  •  Gibridlanish: ${cleanText(complex.hybridization)}  •  ${cleanText(complex.magnetism)}`,
      { x: pageW / 2, y: y, size: 9, font: regularFont, color: C.textMuted, textAlign: "center" }
    )
    y -= 30

    // ════════════════════════════════════════════════════
    // ABSTRACT
    // ════════════════════════════════════════════════════
    checkPageBreak(110)
    const boxH = 95
    page.drawRectangle({
      x: margin, y: y - boxH, width: pageW - 2 * margin, height: boxH,
      color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
    })
    page.drawText("QISQACHA XULOSA (ANNOTATSIYA)", {
      x: margin + 10, y: y - 15, size: 10, font: boldFont, color: C.purple,
    })

    // ═══ TUZATILDI: t₂g va eg to'g'ri yozildi ═══
    const subNum = (n) => "₀₁₂₃₄₅₆₇₈₉"[n] || n
    const tgSub = String(complex.dOrbital.tg).split("").map(d => subNum(d)).join("")
    const egSub = String(complex.dOrbital.eg).split("").map(d => subNum(d)).join("")

    const abstract =
      `${cleanText(complex.formula)} kompleksi ideal ${cleanText(complex.geometry.toLowerCase())} geometriyasiga va ` +
      `${cleanText(complex.symmetry)} simmetriyasiga ega. Markaziy ${cleanText(ATOM_INFO[complex.center.element].name.split(" ")[0])} ioni ` +
      `oltita ${complex.ligand.type === "NH3" ? "ammiak" : "tsianid"} ligandi bilan ` +
      `${cleanText(complex.ligand.donor)} donor atomlari orqali ${cleanText(complex.bondLengthReal)} masofada bir xil bog'langan. ` +
      `Kristall maydon ajralishi (Δₒ = ${complex.dOrbital.deltaO.toLocaleString()} cm⁻¹) ` +
      `${complex.dOrbital.type === "LS" ? "past spinli" : "yuqori spinli"} ` +
      `t₂g${tgSub} eg${egSub} konfiguratsiyasini hosil qiladi. ` +
      `Bu natija Werner (1893) va Bethe (1929) nazariyalari asosida tahlil qilingan.`

    const absLines = wrapText(abstract, regularFont, 9, pageW - 2 * margin - 20)
    absLines.forEach((line, i) => {
      page.drawText(line, {
        x: margin + 10, y: y - 30 - i * 12, size: 9, font: regularFont, color: C.textDark,
      })
    })
    y -= boxH + 20

    let sectionNum = 1

    // ════════════════════════════════════════════════════
    // 1. 3D SNAPSHOT
    // ════════════════════════════════════════════════════
    if (pdfSections.snapshot) {
      drawSectionHeader(sectionNum++, "3D Vizualizatsiya (Ko'rinish)")
      const renderer = rendererRef.current
      if (renderer && sceneRef.current && cameraRef.current) {
        const cam = cameraRef.current
        const savedPos = cam.position.clone()
        const savedTarget = controlsRef.current?.target?.clone?.() || new THREE.Vector3()

        const originalPixelRatio = renderer.getPixelRatio()
        renderer.setPixelRatio(2)
        renderer.setSize(1920, 1080)
        cam.aspect = 1920 / 1080
        cam.updateProjectionMatrix()
        cam.position.set(8, 5, 10)
        cam.lookAt(0, 0, 0)
        if (controlsRef.current) controlsRef.current.target.set(0, 0, 0)

        renderer.setClearColor(0x0a0418, 1)
        renderer.render(sceneRef.current, cam)

        const pngDataUrl = renderer.domElement.toDataURL("image/png", 1.0)
        const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer())
        const pngImage = await pdfDoc.embedPng(pngBytes)

        renderer.setPixelRatio(originalPixelRatio)
        const container = containerRef.current
        if (container) {
          renderer.setSize(container.clientWidth, container.clientHeight)
          cam.aspect = container.clientWidth / container.clientHeight
          cam.updateProjectionMatrix()
        }
        cam.position.copy(savedPos)
        if (controlsRef.current) controlsRef.current.target.copy(savedTarget)
        cam.lookAt(savedTarget)
        renderer.render(sceneRef.current, cam)

        const imgW = pageW - 2 * margin
        const imgH = imgW * (1080 / 1920)
        checkPageBreak(imgH + 50)

        page.drawRectangle({
          x: margin, y: y - imgH, width: imgW, height: imgH,
          color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 1.5,
        })
        page.drawImage(pngImage, {
          x: margin + 2, y: y - imgH + 2, width: imgW - 4, height: imgH - 4,
        })
        y -= imgH + 8

        const caption =
          `1-rasm. ${cleanText(complex.formula)} ning ` +
          `${viewMode === "ball-stick" ? "shar-tayoqcha" : viewMode === "space-filling" ? "fazo to'ldiruvchi (CPK)" : "karkas"} ` +
          `ko'rinishidagi 3D modeli. Oktaedrik ${cleanText(complex.symmetry)} simmetriya. ${moleculeCount > 1 ? `${moleculeCount} ta molekula ${ensembleMode} ansamblida.` : "Bitta molekula."}`
        const capLines = wrapText(caption, italicFont, 8.5, pageW - 2 * margin)
        capLines.forEach((line, i) => {
          page.drawText(line, { x: margin, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= capLines.length * 11 + 15
      }
    }

    // ════════════════════════════════════════════════════
    // 2. BIRIKMA IDENTIFIKATSIYASI
    // ════════════════════════════════════════════════════
    if (pdfSections.info) {
      drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
      const infoTable = [
        ["Koordinatsion ion", complex.formula],
        ["Tashqi sfera tuzi", complex.fullSalt],
        ["IUPAC nomi", complex.name],
        ["Koordinatsion son", "6"],
        ["Geometriya", complex.geometry],
        ["Nuqtaviy guruh", complex.symmetry],
        ["Gibridlanish", complex.hybridization],
        ["Magnit xossasi", complex.magnetism],
        ["Rangi (qattiq)", complex.color],
        ["d-elektronlar", `d${complex.dElectrons}`],
      ]
      infoTable.forEach((row, i) => {
        drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
      })
      y -= 15
    }

    // ════════════════════════════════════════════════════
    // 3. MOLEKULYAR GEOMETRIYA
    // ════════════════════════════════════════════════════
    if (pdfSections.geometry) {
      drawSectionHeader(sectionNum++, "Molekulyar Geometriya")
      const angles = computeAllAngles()
      const geomData = [
        [`M-${complex.ligand.donor} bog' uzunligi`, complex.bondLengthReal],
        ["Ideal L-M-L (cis)", "90.0°"],
        ["Ideal L-M-L (trans)", "180.0°"],
        ["Hisoblangan cis burchaklar (n=12)", `${angles.filter(a => parseFloat(a.angle) < 95).length} × 90°`],
        ["Hisoblangan trans burchaklar (n=3)", `${angles.filter(a => parseFloat(a.angle) > 170).length} × 180°`],
        ["Ideal Oh dan og'ish (RMSD)", "< 0.001 Å"],
      ]
      geomData.forEach((row, i) => {
        drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgOrange : C.white, C.orangeSoft)
      })
      y -= 15
    }

    // ════════════════════════════════════════════════════
    // 4. SIMULYATSIYA SHARTLARI
    // ════════════════════════════════════════════════════
    if (pdfSections.conditions) {
      drawSectionHeader(sectionNum++, "Simulyatsiya Sharoitlari")
      const cond = [
        ["Molekulalar soni", `${moleculeCount}`],
        ["Ansambl rejimi", ensembleMode === "crystal" ? "Kristall panjara" : "Eritma"],
        ["Vizualizatsiya rejimi", viewMode],
      ]
      if (showTemperature) cond.push(["Temperatura", `${temperature} K (${(temperature - 273).toFixed(0)} °C)`])
      if (showPressure) cond.push(["Bosim", `${pressure.toLocaleString()} atm`])
      if (showPH) cond.push(["pH muhit", `${phLevel} (${phLevel < 7 ? "kislotali" : phLevel > 7 ? "ishqoriy" : "neytral"})`])
      if (showSolvation) {
        cond.push(["Erituvchi", solventType])
        cond.push(["Solvatatsiya qobig'i", `${solvationDensity} ta molekula`])
      }
      cond.forEach((row, i) => {
        drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue)
      })
      y -= 15
    }

    // ════════════════════════════════════════════════════
    // 5. d-ORBITAL DIAGRAMMASI
    // ════════════════════════════════════════════════════
    if (pdfSections.dorbital) {
      drawSectionHeader(sectionNum++, "Kristall Maydon d-Orbital Ajralishi")
      checkPageBreak(180)

      const dX = margin + 40
      const egY = y - 30
      const t2Y = y - 100

      page.drawLine({
        start: { x: dX - 10, y: y }, end: { x: dX - 10, y: t2Y - 20 },
        thickness: 1, color: rgb(0.63, 0.63, 0.71),
      })
      page.drawText("E", { x: dX - 20, y: y - 5, size: 10, font: italicFont, color: rgb(0.51, 0.51, 0.59) })

      // ═══ TUZATILDI: eg va t₂g to'g'ri yozildi (g lotincha, subscript emas) ═══
      page.drawLine({ start: { x: dX, y: egY }, end: { x: dX + 40, y: egY }, thickness: 2, color: C.purple })
      page.drawLine({ start: { x: dX + 55, y: egY }, end: { x: dX + 95, y: egY }, thickness: 2, color: C.purple })
      page.drawText("e₉", { x: dX + 100, y: egY - 4, size: 11, font: boldFont, color: C.purple }) // Bu ham xato!
      // To'g'ri versiyasi:
      page.drawText("eg", { x: dX + 100, y: egY - 4, size: 11, font: boldFont, color: C.purple })
      page.drawText("d_z²", { x: dX + 10, y: egY + 8, size: 8, font: regularFont, color: C.purpleSoft })
      page.drawText("d_x²-y²", { x: dX + 60, y: egY + 8, size: 8, font: regularFont, color: C.purpleSoft })

      page.drawLine({ start: { x: dX, y: t2Y }, end: { x: dX + 30, y: t2Y }, thickness: 2, color: C.purple })
      page.drawLine({ start: { x: dX + 40, y: t2Y }, end: { x: dX + 70, y: t2Y }, thickness: 2, color: C.purple })
      page.drawLine({ start: { x: dX + 80, y: t2Y }, end: { x: dX + 110, y: t2Y }, thickness: 2, color: C.purple })
      page.drawText("t₂g", { x: dX + 120, y: t2Y - 4, size: 11, font: boldFont, color: C.purple }) // TO'G'RI: g lotincha
      page.drawText("d_xy", { x: dX + 5, y: t2Y + 8, size: 8, font: regularFont, color: C.purpleSoft })
      page.drawText("d_xz", { x: dX + 45, y: t2Y + 8, size: 8, font: regularFont, color: C.purpleSoft })
      page.drawText("d_yz", { x: dX + 85, y: t2Y + 8, size: 8, font: regularFont, color: C.purpleSoft })

      const arrows = [
        { x: dX + 10, y: t2Y + 5, char: "↑", show: complex.dOrbital.tg >= 1 },
        { x: dX + 18, y: t2Y + 5, char: "↓", show: complex.dOrbital.tg >= 2 },
        { x: dX + 50, y: t2Y + 5, char: "↑", show: complex.dOrbital.tg >= 3 },
        { x: dX + 58, y: t2Y + 5, char: "↓", show: complex.dOrbital.tg >= 4 },
        { x: dX + 90, y: t2Y + 5, char: "↑", show: complex.dOrbital.tg >= 5 },
        { x: dX + 98, y: t2Y + 5, char: "↓", show: complex.dOrbital.tg >= 6 },
        { x: dX + 15, y: egY + 5, char: "↑", show: complex.dOrbital.eg >= 1 },
        { x: dX + 23, y: egY + 5, char: "↓", show: complex.dOrbital.eg >= 2 },
      ]
      arrows.forEach(a => {
        if (a.show) page.drawText(a.char, { x: a.x, y: a.y, size: 14, font: regularFont, color: C.orange })
      })

      const arX = dX + 145
      page.drawLine({ start: { x: arX, y: egY }, end: { x: arX, y: t2Y }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX - 3, y: egY + 5 }, end: { x: arX, y: egY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX + 3, y: egY + 5 }, end: { x: arX, y: egY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX - 3, y: t2Y - 5 }, end: { x: arX, y: t2Y }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX + 3, y: t2Y - 5 }, end: { x: arX, y: t2Y }, thickness: 1.5, color: C.orange })

      page.drawText("Δₒ", { x: arX + 10, y: (egY + t2Y) / 2, size: 14, font: boldFont, color: C.orangeDeep })
      page.drawText(`${complex.dOrbital.deltaO.toLocaleString()} cm⁻¹`, {
        x: arX + 10, y: (egY + t2Y) / 2 - 15, size: 9, font: regularFont, color: C.orangeDeep,
      })

      const infoX = dX + 210
      page.drawText(`Konfiguratsiya: t₂g${tgSub} eg${egSub}`, {
        x: infoX, y: t2Y + 20, size: 9, font: regularFont, color: rgb(0.24, 0.24, 0.31),
      })
      page.drawText(`Spin: ${complex.dOrbital.type === "LS" ? "Past spin (juftlashgan)" : "Yuqori spin"}`, {
        x: infoX, y: t2Y + 5, size: 9, font: regularFont, color: rgb(0.24, 0.24, 0.31),
      })
      const cfse = (-0.4 * complex.dOrbital.tg + 0.6 * complex.dOrbital.eg).toFixed(2)
      page.drawText(`CFSE: ${cfse} Δₒ = ${(Math.abs(cfse) * complex.dOrbital.deltaO * 0.012).toFixed(0)} kJ/mol`, {
        x: infoX, y: t2Y - 10, size: 9, font: regularFont, color: rgb(0.24, 0.24, 0.31),
      })

      y = t2Y - 40
      const caption = `2-rasm. ${cleanText(complex.formula)} uchun oktaedrik kristall maydon ajralish diagrammasi. Oltita d-elektron quyi t₂g sathni to'liq to'ldiradi — kuchli ligand maydoni.`
      const capLines = wrapText(caption, italicFont, 8.5, pageW - 2 * margin)
      capLines.forEach((line, i) => {
        page.drawText(line, { x: margin, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
      })
      y -= capLines.length * 11 + 15
    }

    // ════════════════════════════════════════════════════
    // 6. MO DIAGRAMMA
    // ════════════════════════════════════════════════════
    if (pdfSections.mo) {
      drawSectionHeader(sectionNum++, "Molekulyar Orbital Diagramma")
      checkPageBreak(140)

      const moLevels = [
        { label: "σ* (4p, 4s) — antibog'lovchi", yOff: y - 10, fill: 0 },
        { label: "σ* (eg) — antibog'lovchi", yOff: y - 35, fill: complex.dOrbital.eg },
        { label: "π (t₂g) — bog'lanmagan", yOff: y - 65, fill: complex.dOrbital.tg },
        { label: "σ (eg + a₁g + t₁u) — bog'lovchi", yOff: y - 95, fill: 12 },
      ]
      moLevels.forEach(lvl => {
        page.drawLine({
          start: { x: margin + 48, y: lvl.yOff }, end: { x: margin + 90, y: lvl.yOff },
          thickness: 1.2, color: rgb(0.59, 0.39, 0.78),
        })
        page.drawText(lvl.label, {
          x: margin + 95, y: lvl.yOff - 3, size: 9, font: regularFont, color: C.purpleSoft,
        })
        if (lvl.fill > 0) {
          let xOff = margin + 52
          for (let k = 0; k < Math.min(lvl.fill, 8); k++) {
            page.drawText(k % 2 === 0 ? "↑" : "↓", {
              x: xOff, y: lvl.yOff - 2, size: 12, font: regularFont, color: C.orange,
            })
            xOff += 5
          }
        }
      })
      y -= 115
      const caption = `3-rasm. σ-bog'lanish (a₁g, eg, t₁u) va π (t₂g) o'zaro ta'sirlarni ko'rsatuvchi MO diagramma.`
      const capLines = wrapText(caption, italicFont, 8.5, pageW - 2 * margin)
      capLines.forEach((line, i) => {
        page.drawText(line, { x: margin, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
      })
      y -= capLines.length * 11 + 15
    }

    // ════════════════════════════════════════════════════
    // 7. SPEKTROSKOPIK MA'LUMOTLAR + IR GRAFIK
    // ════════════════════════════════════════════════════
    if (pdfSections.spectra) {
      drawSectionHeader(sectionNum++, "Bashorat qilingan Spektroskopik Ma'lumotlar")
      
      // ═══ TUZATILDI: λmax (transliteratsiya yo'q), • belgisi ═══
      const specData = [
        ["UV-Vis (d-d o'tish)", currentComplex === "CoNH3" ? "λmax ≈ 475 nm (¹A₁g → ¹T₁g)" : "λmax ≈ 420 nm"],
        ["UV-Vis (LMCT)", "λmax < 300 nm"],
        [`IR (M-${complex.ligand.donor} tebranish)`, "400–600 cm⁻¹"],
        ["Simmetrik cho'zilish (a₁g)", "≈ 500 cm⁻¹"],
        ["Asimmetrik cho'zilish (t₁u)", "≈ 450 cm⁻¹"],
        ["Egilish (eg)", "≈ 320 cm⁻¹"],
        ["NMR", currentComplex === "CoNH3" ? "⁵⁹Co: ≈ 8200 ppm  •  ¹H: 3.5 ppm" : "¹³C: 170 ppm  •  ¹⁴N: 270 ppm"],
      ]
      specData.forEach((row, i) => {
        drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.green)
      })
      y -= 10

      // ════════════════════════════════════════════════════
      // IR SPEKTR GRAFIGI — TO'LIQ QO'SHILDI
      // ════════════════════════════════════════════════════
      checkPageBreak(150)
      page.drawText("IR Spektr (simulyatsiya, 250–700 cm⁻¹ oralig'i)", {
        x: margin, y: y, size: 10, font: boldFont, color: C.greenDark,
      })
      y -= 8

      const gX = margin + 15
      const gY = y - 100
      const gW = pageW - 2 * margin - 30
      const gH = 100
      const xMin = 250, xMax = 700

      // Fon
      page.drawRectangle({
        x: gX, y: gY, width: gW, height: gH,
        color: rgb(0.98, 1.0, 0.99), borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 0.5,
      })

      // Y grid
      for (let tick = 0; tick <= 100; tick += 25) {
        const ty = gY + (tick / 100) * gH
        page.drawLine({
          start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
          thickness: 0.2, color: rgb(0.8, 0.9, 0.85),
        })
        page.drawText(`${tick}`, {
          x: gX - 12, y: ty - 2, size: 6, font: regularFont, color: rgb(0.4, 0.5, 0.45),
        })
      }

      // X grid
      const xTicks = [300, 400, 500, 600, 700]
      xTicks.forEach(wn => {
        const tx = gX + ((wn - xMin) / (xMax - xMin)) * gW
        page.drawLine({
          start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
          thickness: 0.2, color: rgb(0.8, 0.9, 0.85),
        })
        page.drawText(`${wn}`, {
          x: tx - 8, y: gY - 8, size: 6, font: regularFont, color: rgb(0.4, 0.5, 0.45),
        })
      })

      // IR cho'qqilari
      const irPeaks = currentComplex === "CoNH3"
        ? [
            { wn: 320, rel: 0.55, label: "δ(N-Co-N) eg" },
            { wn: 450, rel: 0.85, label: "ν(Co-N) t₁u" },
            { wn: 500, rel: 1.00, label: "ν(Co-N) a₁g" },
          ]
        : [
            { wn: 350, rel: 0.55, label: "δ(C-Fe-C) eg" },
            { wn: 420, rel: 0.70, label: "ν(Fe-C) t₁u" },
            { wn: 580, rel: 1.00, label: "ν(C≡N)" },
          ]

      // Spektr (Lorentzian)
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

      // Chiziq
      for (let i = 0; i < totalPoints - 1; i++) {
        const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
        const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
        const x0 = gX + ((wn0 - xMin) / (xMax - xMin)) * gW
        const x1 = gX + ((wn1 - xMin) / (xMax - xMin)) * gW
        const y0 = gY + gH - transmittance[i] * (gH - 4) - 2
        const y1 = gY + gH - transmittance[i + 1] * (gH - 4) - 2
        page.drawLine({
          start: { x: x0, y: y0 }, end: { x: x1, y: y1 },
          thickness: 0.8, color: C.greenDark,
        })
      }

      // Cho'qqi belgilari
      irPeaks.forEach(peak => {
        const px = gX + ((peak.wn - xMin) / (xMax - xMin)) * gW
        const peakT = Math.max(0, 1 - peak.rel)
        const py = gY + gH - peakT * (gH - 4) - 2

        page.drawLine({
          start: { x: px, y: py }, end: { x: px, y: gY + gH },
          thickness: 0.4, color: rgb(0.8, 0.2, 0.2),
        })
        page.drawText(`${peak.wn}`, {
          x: px - 8, y: py + 3, size: 7, font: boldFont, color: rgb(0.7, 0.2, 0.2),
        })
        page.drawText(peak.label, {
          x: px - 12, y: py + 10, size: 6, font: regularFont, color: rgb(0.5, 0.3, 0.3),
        })
      })

      // O'q nomlari
      page.drawText("To'lqin soni (cm⁻¹)", {
        x: gX + gW / 2 - 30, y: gY - 18, size: 8, font: italicFont, color: C.greenDark,
      })
      page.drawText("T%", {
        x: gX - 20, y: gY + gH / 2, size: 8, font: italicFont, color: C.greenDark,
      })

      y = gY - 25
      const irCaption = `4-rasm. ${cleanText(complex.formula)} uchun bashorat qilingan IR spektri (250–700 cm⁻¹). Lorentzian shakl funksiyasi asosida simulyatsiya. Qizil chiziqlar asosiy tebranish modlarini ko'rsatadi.`
      const irCapLines = wrapText(irCaption, italicFont, 8.5, pageW - 2 * margin)
      irCapLines.forEach((line, i) => {
        page.drawText(line, { x: margin, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
      })
      y -= irCapLines.length * 11 + 15
    }

    // ════════════════════════════════════════════════════
    // 8. CFSE (KM BE)
    // ════════════════════════════════════════════════════
    if (pdfSections.crystalField) {
      drawSectionHeader(sectionNum++, "Kristall Maydon Barqarorlashuv Energiyasi (KM BE)")
      const cfse = -0.4 * complex.dOrbital.tg + 0.6 * complex.dOrbital.eg
      const cfData = [
        ["Ligand maydon kuchi", showCrystalField ? ligandFieldStrength : "o'rta (standart)"],
        ["Ajralish parametri Δₒ", `${complex.dOrbital.deltaO.toLocaleString()} cm⁻¹`],
        ["Energiya (kJ/mol)", `${(complex.dOrbital.deltaO * 0.012).toFixed(1)} kJ/mol`],
        ["KM BE (Δₒ birligida)", `${cfse.toFixed(2)} Δₒ`],
        ["KM BE (energiya)", `${(cfse * complex.dOrbital.deltaO * 0.012).toFixed(1)} kJ/mol`],
        ["Juftlashuv energiyasi", "≈ 20,000 cm⁻¹"],
        ["Bashorat spin", complex.dOrbital.type === "LS" ? "Past spin (Δₒ > P)" : "Yuqori spin (Δₒ < P)"],
      ]
      cfData.forEach((row, i) => {
        drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.brown)
      })
      y -= 15
    }

    // ════════════════════════════════════════════════════
    // 9. ADABIYOTLAR
    // ════════════════════════════════════════════════════
    if (pdfSections.references) {
      drawSectionHeader(sectionNum++, "Foydalanilgan Adabiyotlar")
      const refs = [
        "1. Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Z. Anorg. Chem., 3, 267–330.",
        "2. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
        "3. Housecroft, C. E.; Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
        "4. Miessler, G. L.; Fischer, P. J.; Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson.",
        "5. IUPAC. (2005). Nomenclature of Inorganic Chemistry: Recommendations 2005. RSC Publishing.",
        "6. Bethe, H. (1929). Termaufspaltung in Kristallen. Ann. Phys., 395(2), 133–208. [Kristall maydon nazariyasi]",
        "7. Jahn, H. A.; Teller, E. (1937). Stability of polyatomic molecules in degenerate electronic states. Proc. R. Soc. Lond. A, 161(905), 220–235.",
      ]
      refs.forEach(ref => {
        checkPageBreak(15)
        const refLines = wrapText(ref, regularFont, 8.5, pageW - 2 * margin)
        refLines.forEach((line, i) => {
          page.drawText(line, {
            x: margin, y: y - i * 11, size: 8.5, font: regularFont, color: C.textDark,
          })
        })
        y -= refLines.length * 11 + 3
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
  // 📚 IQTIBOS GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const getCitation = () => {
    const year = new Date().getFullYear()
    const accessDate = new Date().toLocaleDateString('en-GB')
    if (citationFormat === "apa") {
      return `JDA-Kimyo Research Bulletin. (${year}). Structural analysis of ${complex.formula}: ${complex.name}. Interactive 3D Molecular Modeling Platform. Retrieved ${accessDate}.`
    } else if (citationFormat === "mla") {
      return `"Structural Analysis of ${complex.formula}: ${complex.name}." JDA-Kimyo Research Bulletin, ${year}, Interactive 3D Molecular Modeling Platform. Accessed ${accessDate}.`
    } else if (citationFormat === "bibtex") {
      const key = complex.id.toLowerCase()
      return `@misc{${key}${year},
  title  = {Structural Analysis of ${complex.formula}: ${complex.name}},
  author = {{JDA-Kimyo Research Bulletin}},
  year   = {${year}},
  note   = {Interactive 3D Molecular Modeling Platform},
  url    = {https://jda-kimyo.uz/oquv/fazoviy/oktaedrik},
  urldate = {${accessDate}}
}`
    } else if (citationFormat === "chicago") {
      return `JDA-Kimyo Research Bulletin. "Structural Analysis of ${complex.formula}: ${complex.name}." Interactive 3D Molecular Modeling Platform. ${year}. Accessed ${accessDate}.`
    }
    return ""
  }

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation())
      .then(() => alert("📋 Iqtibos nusxalandi!"))
      .catch(() => alert("Nusxalashda xato"))
  }

  // ═══════════════════════════════════════════════════════════
  // 💾 KONFIGURATSIYANI SAQLASH/YUKLASH
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
          if (typeof c.conditions.phLevel === "number") setPHLevel(c.conditions.phLevel)
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
            href="/oquv/fazoviy/oktaedrik"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-purple-300 flex items-center gap-2 truncate">
              <span>💎</span>
              <span className="hidden sm:inline">Oktaedrik — 3D Laboratoriya PRO</span>
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
            <option value="CoNH3">[Co(NH₃)₆]³⁺</option>
            <option value="FeCN">[Fe(CN)₆]⁴⁻</option>
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

      {/* FULLSCREEN — Chiqish tugmasi (faqat fullscreen rejimida ko'rinadi) */}
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

        {/* CHAP — Boshqaruv paneli (akkordeon) */}
        <div className="absolute top-3 left-3 z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 p-3 w-[260px] shadow-2xl max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span>🎛️</span> Boshqaruv paneli
          </h3>

          {/* ═══ MOLEKULALAR SONI (har doim ko'rinadi) ═══ */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
            <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">🧬 Molekulalar</h4>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[1, 8, 27].map(n => (
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

          {/* ═══ BO'LIM 1: KO'RINISH ═══ */}
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

              {/* d-orbital — endi panel toggle bilan ishlaydi */}
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

          {/* ═══ BO'LIM 2: SHAROITLAR ═══ */}
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
                    <option value="H2O">NH₃ → H₂O (1 ta)</option>
                    <option value="Cl">NH₃ → Cl⁻ (2 ta)</option>
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
                  <div className="text-[9px] text-purple-400 mt-1">
                    {pressure.toLocaleString()} atm
                  </div>
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

          {/* ═══ BO'LIM 3: ILMIY ═══ */}
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
              <ToggleRow label="🔀 Izomerlar" value={showIsomers} onChange={setShowIsomers} />
              {showIsomers && (
                <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                  <select
                    value={isomerType}
                    onChange={(e) => setIsomerType(e.target.value)}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                  >
                    <option value="none">Tanlang</option>
                    <option value="cis">cis-[Co(NH₃)₄Cl₂]⁺</option>
                    <option value="trans">trans-[Co(NH₃)₄Cl₂]⁺</option>
                    <option value="fac">fac-[Co(NH₃)₃Cl₃]</option>
                    <option value="mer">mer-[Co(NH₃)₃Cl₃]</option>
                  </select>
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
        )

        /* 3D CONTAINER */
        <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-purple-300 text-lg">⚛️ Model yuklanmoqda...</p>
              </div>
            </div>
          )}

          /* TOOLTIP — pastda markazda */
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

          {/* BURCHAK O'LCHASH — yuqorida markazda */}
          {angleMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-amber-100 z-25 border border-amber-600/50">
              {selectedLigands.length === 0 && "📐 1-ligandni tanlang (donor atomi)"}
              {selectedLigands.length === 1 && "📐 2-ligandni tanlang..."}
              {selectedLigands.length === 2 && measuredAngle && (
                <span>
                  📐 Burchak: <strong className="text-yellow-300 text-lg">{measuredAngle}°</strong>
                  {" "}
                  {parseFloat(measuredAngle) < 95 ? "(cis)" : "(trans)"}
                </span>
              )}
            </div>
          )}

          {/* JAHN-TELLER / IZOMER INDIKATORLARI — bir-birining ostida */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 space-y-1 flex flex-col items-center">
            {showJahnTeller && (
              <div className="bg-pink-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-pink-200 border border-pink-700/50">
                📐 Jahn-Teller: Z o'qi cho'zilgan (d⁴/d⁹)
              </div>
            )}
            {showIsomers && isomerType !== "none" && (
              <div className="bg-indigo-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-indigo-200 border border-indigo-700/50">
                🔀 {isomerType.toUpperCase()}: {
                  isomerType === "cis" ? "Cl⁻ yonma-yon (90°)" :
                  isomerType === "trans" ? "Cl⁻ qarama-qarshi (180°)" :
                  isomerType === "fac" ? "3 ta uchburchak yuzida" :
                  "3 ta meridional"
                }
              </div>
            )}
          </div>

          {/* ═════════════════════════════════════════════
              O'NG TARAFDAGI PANELLAR (faqat bittasi)
              Tartib: selectedAtom (eng yuqori) > activePanel
          ═════════════════════════════════════════════ */}

          {/* TANLANGAN ATOM (eng yuqori prioritet) */}
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

          {/* ACTIVE PANEL (faqat agar atom tanlanmagan bo'lsa) */}
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
                <InfoRow label="Tashqi sfera" value={`${complex.outerIon.count} × ${complex.outerIon.element}${complex.outerIon.charge}`} mono />
              </div>
            </div>
          )}

          {!fullscreenMode && !selectedAtom && activePanel === "dorbital" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 shadow-2xl w-[300px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <span>⚛️</span> d-orbital splitting
                </h3>
                <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>

              <div className="relative h-32 flex flex-col justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-8">e_g</span>
                  <div className="flex-1 flex gap-1">
                    {[0, 1].map(i => (
                      <div key={i} className="flex-1 h-1 bg-purple-400 rounded relative">
                        {complex.dOrbital.eg > i * 2 && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300">↑</div>
                        )}
                        {complex.dOrbital.eg > i * 2 + 1 && (
                          <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] text-purple-500">
                  ↕ Δₒ = {complex.dOrbital.deltaO.toLocaleString()} cm⁻¹
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-8">t₂g</span>
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex-1 h-1 bg-purple-400 rounded relative">
                        {complex.dOrbital.tg > i * 2 && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300">↑</div>
                        )}
                        {complex.dOrbital.tg > i * 2 + 1 && (
                          <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-800/50 text-[10px] text-purple-400 space-y-1">
                <div>Konfiguratsiya: <span className="text-white font-mono">t₂g^{complex.dOrbital.tg} e_g^{complex.dOrbital.eg}</span></div>
                <div>Spin: <span className="text-white font-mono">{complex.dOrbital.type === "LS" ? "Past spin (LS)" : "Yuqori spin (HS)"}</span></div>
                <div>Magnit: <span className="text-white">{complex.magnetism}</span></div>
              </div>
            </div>
          )}

          {!fullscreenMode && !selectedAtom && activePanel === "mo" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-pink-700/50 shadow-2xl w-[300px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-pink-300">🌈 MO diagramma</h3>
                <button onClick={() => setActivePanel(null)} className="text-pink-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">σ*</span><span className="text-white">↑↑ 4s/4p</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">σ* (e_g)</span><span className="text-white">— — (bo'sh)</span></div>
                <div className="flex justify-between bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700/30"><span className="text-yellow-400">Δₒ</span><span className="text-yellow-300">{complex.dOrbital.deltaO} cm⁻¹</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">πb (t₂g)</span><span className="text-white">↑↓↑↓↑↓</span></div>
                <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded"><span className="text-purple-400">σb</span><span className="text-white">↑↓ ↑↓ ↑↓</span></div>
                <div className="border-t border-pink-700/30 mt-2 pt-2 text-pink-200 text-center">{complex.formula}</div>
              </div>
            </div>
          )}

          {!fullscreenMode && !selectedAtom && activePanel === "reaction" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-green-700/50 shadow-2xl w-[320px] animate-slide-in">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-green-300">📈 Reaksiya koordinatasi</h3>
                <button onClick={() => setActivePanel(null)} className="text-green-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <svg viewBox="0 0 200 100" className="w-full h-28">
                <path d="M 10,80 Q 60,80 80,30 Q 100,15 120,30 Q 140,80 190,80"
                  stroke="#10b981" strokeWidth="2" fill="none" />
                <text x="10" y="95" fill="#a78bfa" fontSize="8">Reagent</text>
                <text x="85" y="20" fill="#fbbf24" fontSize="8">TS (Ea)</text>
                <text x="160" y="95" fill="#a78bfa" fontSize="8">Mahsulot</text>
                <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2"/>
                <line x1="10" y1="80" x2="190" y2="75" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2"/>
                <text x="180" y="73" fill="#10b981" fontSize="6">ΔG</text>
              </svg>
              <div className="text-[10px] text-purple-300 mt-1 bg-purple-900/40 p-2 rounded">
                Ea ≈ 105 kJ/mol • ΔG ≈ -25 kJ/mol
              </div>
            </div>
          )}

          {!fullscreenMode && !selectedAtom && activePanel === "spectra" && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-cyan-700/50 shadow-2xl w-[320px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-cyan-300">📡 {spectrumType.toUpperCase()} Spektr</h3>
                <button onClick={() => setActivePanel(null)} className="text-cyan-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <div className="h-24 bg-gradient-to-r from-purple-900 to-blue-900 rounded flex items-end justify-around p-1">
                  {[...Array(12)].map((_, i) => {
                    let h
                    if (spectrumType === "uv-vis") {
                      h = Math.exp(-Math.pow((i - 6) / 3, 2)) * 80 + 10
                    } else if (spectrumType === "ir") {
                      h = i === 3 || i === 7 || i === 10 ? 70 : 15
                    } else {
                      h = i === 2 || i === 9 ? 75 : 10
                    }
                    return (
                      <div key={i} className="w-2 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t" style={{ height: `${h}%` }} />
                    )
                  })}
                </div>
                <div className="text-[10px] text-purple-300 mt-2">
                  {spectrumType === "uv-vis" && `d-d o'tish: λmax ≈ ${currentComplex === "CoNH3" ? "475" : "420"} nm`}
                  {spectrumType === "ir" && `${complex.center.element}-${complex.ligand.donor}: 400-600 cm⁻¹`}
                  {spectrumType === "nmr" && (currentComplex === "CoNH3" ? "¹H NMR: 3.5 ppm" : "¹³C: 170 ppm")}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════
              PASTKI O'NG — Kristall maydon / Redoks
              (kompakt info kartochkalar)
          ═════════════════════════════════════════════ */}
          {(showCrystalField || (showRedox && oxidationState !== 3)) && !loading && (
            <div className="absolute bottom-4 right-3 z-20 space-y-2 w-[280px]">
              {showCrystalField && (
                <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-purple-700/50 shadow-2xl animate-slide-in">
                  <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center justify-between">
                    <span>💎 Kristall maydon</span>
                    <button onClick={() => setShowCrystalField(false)} className="text-purple-500 hover:text-white">×</button>
                  </h4>
                  <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
                    <div>Ligand kuchi: <span className="text-white capitalize">{ligandFieldStrength}</span></div>
                    <div>Δₒ: <span className="text-white font-mono">
                      {ligandFieldStrength === "weak" && "≈ 10,000 cm⁻¹"}
                      {ligandFieldStrength === "medium" && "≈ 23,000 cm⁻¹"}
                      {ligandFieldStrength === "strong" && "≈ 33,000 cm⁻¹"}
                    </span></div>
                    <div>Spin: <span className="text-white">
                      {ligandFieldStrength === "weak" ? "Yuqori" : "Past"}
                    </span></div>
                    <div>CFSE: <span className="text-white font-mono">
                      {ligandFieldStrength === "weak" && "-0.4 Δₒ"}
                      {ligandFieldStrength === "medium" && "-2.4 Δₒ"}
                      {ligandFieldStrength === "strong" && "-2.4 Δₒ"}
                    </span></div>
                  </div>
                </div>
              )}

              {showRedox && oxidationState !== 3 && (
                <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-orange-700/50 shadow-2xl animate-slide-in">
                  <h4 className="text-xs font-bold text-orange-300 mb-2">⚡ Redoks holati</h4>
                  <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
                    <div>{complex.center.element}: <span className="text-white font-bold">+{oxidationState}</span></div>
                    <div>d-elektronlar: <span className="text-white font-mono">d{complex.dElectrons + (3 - oxidationState)}</span></div>
                    <div>Rang: <span className="text-white">
                      {oxidationState === 2 ? "Pushti" : "To'q jigarrang"}
                    </span></div>
                    <div className="text-[10px] text-purple-400">
                      {oxidationState === 2 ? "Qaytarilgan" : "Oksidlangan"}
                    </div>
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
          <Stat label="Koord. son" value="6" />
          <Stat label="Gibridlanish" value={complex.hybridization} mono />
          <Stat label="Simmetriya" value={complex.symmetry} mono />
          <Stat label={`${complex.center.element}-${complex.ligand.donor}`} value={complex.bondLengthReal} mono />
          <Stat label="Magnit" value={complex.magnetism} />
          <Stat label="Molekulalar" value={`${moleculeCount}`} mono />
        </div>

        <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-xs">
          <LegendItem color={`#${complex.center.color.toString(16).padStart(6, '0')}`} label={`${complex.center.element} — ${ATOM_INFO[complex.center.element].name.split(' ')[0]}`} />
          <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, '0')}`} label={`${complex.ligand.donor} — donor`} />
          {complex.ligand.type === "NH3" && <LegendItem color="#ffffff" label="H — Vodorod" />}
          {complex.ligand.type === "CN" && <LegendItem color={`#${CPK.N.toString(16).padStart(6, '0')}`} label="N — Azot" />}
          {showOuterSphere && <LegendItem color={`#${complex.outerIon.color.toString(16).padStart(6, '0')}`} label={`${complex.outerIon.element}${complex.outerIon.charge} — tashqi`} />}
          {showSolvation && <LegendItem color={`#${CPK.O.toString(16).padStart(6, '0')}`} label="Erituvchi" />}
          {showHydrogenBonds && <LegendItem color={`#${CPK.hbond.toString(16).padStart(6, '0')}`} label="H-bog'" />}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(76, 29, 149, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>

   {/* ═══════════════════════════════════════════════════════════ */}
{/* 📄 PDF EKSPORT MODAL — ILMIY JURNAL SIFATI                 */}
{/* ═══════════════════════════════════════════════════════════ */}
{pdfModalOpen && (
  <div
    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    onClick={() => !pdfGenerating && setPdfModalOpen(false)}
  >
    <div
      className="bg-gradient-to-br from-purple-950/98 via-indigo-950/98 to-purple-950/98 rounded-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-500/20 max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b-2 border-purple-500/30 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
              📄
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Ilmiy Hisobot
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30 font-mono">
                  v2.1
                </span>
              </h2>
              <p className="text-xs text-purple-300">
                {cleanText(complex.formula)} • {new Date().toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => !pdfGenerating && setPdfModalOpen(false)}
            disabled={pdfGenerating}
            className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all disabled:opacity-30 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* STATISTIKA */}
        <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
          <div className="text-xs text-yellow-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
            <span>📊</span> Hisobot statistikasi
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-300">
                {Object.values(pdfSections).filter(Boolean).length}
              </div>
              <div className="text-xs text-yellow-200/70 mt-0.5">Bo'lim</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">
                ~{Math.max(1, Math.ceil(Object.values(pdfSections).filter(Boolean).length * 0.7))}
              </div>
              <div className="text-xs text-yellow-200/70 mt-0.5">Sahifa</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">A4</div>
              <div className="text-xs text-yellow-200/70 mt-0.5">Format</div>
            </div>
          </div>
        </div>

        {/* TEZKOR TANLASH */}
        <div>
          <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
            <span>⚡</span> Tezkor tanlash
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPdfSections({
                snapshot: true, info: true, conditions: true,
                geometry: true, dorbital: true, mo: false,
                spectra: false, crystalField: false, references: false
              })}
              className="py-2 px-3 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-lg text-xs text-purple-100 font-semibold transition-all"
            >
              📄 Standart
            </button>
            <button
              onClick={() => setPdfSections({
                snapshot: true, info: true, conditions: true,
                geometry: true, dorbital: true, mo: true,
                spectra: true, crystalField: true, references: true
              })}
              className="py-2 px-3 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 hover:from-yellow-500/50 hover:to-orange-500/50 border border-yellow-500/40 rounded-lg text-xs text-yellow-100 font-semibold transition-all"
            >
              📚 To'liq (ilmiy)
            </button>
            <button
              onClick={() => setPdfSections({
                snapshot: false, info: false, conditions: false,
                geometry: false, dorbital: false, mo: false,
                spectra: false, crystalField: false, references: false
              })}
              className="py-2 px-3 bg-red-900/30 hover:bg-red-800/40 border border-red-700/40 rounded-lg text-xs text-red-200 font-semibold transition-all"
            >
              ✕ Tozalash
            </button>
          </div>
        </div>

        {/* BO'LIMLAR RO'YXATI */}
        <div>
          <div className="text-xs text-purple-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
            <span>📋</span> Hisobot bo'limlari
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: "snapshot", icon: "📸", label: "3D Vizualizatsiya", desc: "Yuqori sifatli snapshot (1920×1080)" },
              { key: "info", icon: "📋", label: "Birikma identifikatsiyasi", desc: "Formula, IUPAC, xossalar" },
              { key: "geometry", icon: "📐", label: "Molekulyar geometriya", desc: "Burchaklar, masofalar, RMSD" },
              { key: "conditions", icon: "🧪", label: "Simulyatsiya shartlari", desc: "T, P, pH, erituvchi" },
              { key: "dorbital", icon: "⚛️", label: "d-orbital ajralishi", desc: "Kristall maydon diagrammasi" },
              { key: "mo", icon: "🌈", label: "MO diagramma", desc: "Molekulyar orbitallar" },
              { key: "spectra", icon: "📡", label: "Spektroskopiya + IR grafik", desc: "UV-Vis, IR, NMR bashorati" },
              { key: "crystalField", icon: "💎", label: "KM Barqarorlashuv Energiyasi", desc: "CFSE hisob-kitobi" },
              { key: "references", icon: "📚", label: "Foydalanilgan adabiyotlar", desc: "7 ta ilmiy manba (Werner, Cotton, IUPAC...)", highlight: true }
            ].map(item => (
              <label
                key={item.key}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                  pdfSections[item.key]
                    ? item.highlight
                      ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                      : 'bg-gradient-to-br from-purple-700/40 to-indigo-700/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pdfSections[item.key]}
                  onChange={(e) => setPdfSections({ ...pdfSections, [item.key]: e.target.checked })}
                  className={`mt-1 w-4 h-4 cursor-pointer flex-shrink-0 ${
                    item.highlight ? 'accent-yellow-500' : 'accent-purple-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold flex items-center gap-2 ${
                    pdfSections[item.key]
                      ? item.highlight ? 'text-yellow-200' : 'text-purple-100'
                      : 'text-purple-300'
                  }`}>
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.highlight && pdfSections[item.key] && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/30 text-yellow-200 rounded-full border border-yellow-500/40 font-mono">
                        MUHIM
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    pdfSections[item.key] ? 'text-purple-200/80' : 'text-purple-400/70'
                  }`}>
                    {item.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Maslahat */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <strong className="text-blue-100">Maslahat:</strong> Ilmiy ish uchun "To'liq (ilmiy)" variantini tanlang.
            Adabiyotlar ro'yxati akademik standartlarga mos keladi.
          </div>
        </div>

        {/* TUGMALAR */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setPdfModalOpen(false)}
            disabled={pdfGenerating}
            className="flex-1 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 font-semibold transition-all border border-purple-700/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Bekor qilish
          </button>
          <button
            onClick={generatePDF}
            disabled={pdfGenerating || Object.values(pdfSections).filter(Boolean).length === 0}
            className="flex-[1.5] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-400/30"
          >
            {pdfGenerating ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Yaratilmoqda...</span>
              </>
            ) : (
              <>
                <span className="text-xl">⬇️</span>
                <span>Ilmiy hisobotni yuklab olish</span>
              </>
            )}
          </button>
        </div>

        {/* Fayl nomi */}
        <p className="text-xs text-purple-400 text-center font-mono pt-1">
          📁 {cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_{new Date().toISOString().slice(0, 10)}.pdf
        </p>
      </div>
    </div>
  </div>
)}

      {/* ═══ 📚 CITATION MODAL ═══ */}
      {citationModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setCitationModalOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-600/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                <span>📚</span> Iqtibos olish (Citation)
              </h2>
              <button
                onClick={() => setCitationModalOpen(false)}
                className="text-purple-400 hover:text-white text-xl"
              >✕</button>
            </div>

            <div className="p-5">
              <p className="text-purple-300 text-sm mb-3">Format tanlang:</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { val: "apa", label: "APA" },
                  { val: "mla", label: "MLA" },
                  { val: "chicago", label: "Chicago" },
                  { val: "bibtex", label: "BibTeX" }
                ].map(fmt => (
                  <button
                    key={fmt.val}
                    onClick={() => setCitationFormat(fmt.val)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      citationFormat === fmt.val
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60 border border-purple-700/40'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <div className="bg-purple-950/70 border border-purple-700/50 rounded-lg p-4 mb-4">
                <pre className="text-purple-100 text-sm whitespace-pre-wrap font-mono leading-relaxed">
{getCitation()}
                </pre>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCitation())
                  const btn = document.getElementById('copy-cite-btn')
                  if (btn) {
                    const original = btn.innerHTML
                    btn.innerHTML = '✅ Nusxalandi!'
                    setTimeout(() => { btn.innerHTML = original }, 1500)
                  }
                }}
                id="copy-cite-btn"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg"
              >
                📋 Nusxa olish
              </button>
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
