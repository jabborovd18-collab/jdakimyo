"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import jsPDF from "jspdf"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Zr: 0x94E0BB, W: 0x2194D6, Re: 0x267DAB, Mo: 0x54B5B5, Ta: 0x4DA6FF,
  C: 0x1A1A1A, H: 0xFFFFFF, N: 0x3050F8, S: 0xFFC832, O: 0xFF0D0D,
  bond: 0x886644, edge: 0xCC8844, hbond: 0x66CCFF
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKSLAR DATABASE — TPR birikmalari
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  ZrMe6: {
    id: "ZrMe6",
    formula: "[Zr(CH₃)₆]²⁻",
    fullSalt: "Li₂[Zr(CH₃)₆]",
    name: "Geksametilsirkonat(IV)",
    center: { element: "Zr", color: CPK.Zr, radius: 0.42, charge: "+4" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.8, bondLengthReal: "2.26 Å",
    outerIon: { element: "Li", color: 0xCC80FF, radius: 0.30, charge: "+1", count: 2 },
    hybridization: "sd⁵", magnetism: "Diamagnit",
    color: "Sariq-yashil kristall",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaTPR: 18000 },
    geometry: "Trigonal prizmatik", symmetry: "D₃h",
    dElectrons: 0,
    twistAngle: 0  // 0° = prizma, 60° = antiprizma (oktaedr)
  },
  WMe6: {
    id: "WMe6",
    formula: "[W(CH₃)₆]",
    fullSalt: "W(CH₃)₆",
    name: "Volfram geksametil",
    center: { element: "W", color: CPK.W, radius: 0.45, charge: "+6" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.85, bondLengthReal: "2.16 Å",
    outerIon: { element: "Li", color: 0xCC80FF, radius: 0.30, charge: "+1", count: 0 },
    hybridization: "sd⁵", magnetism: "Diamagnit",
    color: "Och sariq",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaTPR: 22000 },
    geometry: "Trigonal prizmatik", symmetry: "D₃h",
    dElectrons: 0,
    twistAngle: 0
  },
  ReS6: {
    id: "ReS6",
    formula: "[Re(S₂C₂(CN)₂)₃]²⁻",
    fullSalt: "K₂[Re(mnt)₃]",
    name: "Tris(maleonitriloditiolato)renat",
    center: { element: "Re", color: CPK.Re, radius: 0.44, charge: "+4" },
    ligand: { type: "dithiolene", donor: "S", donorColor: CPK.S, donorRadius: 0.35 },
    bondLength: 1.95, bondLengthReal: "2.33 Å",
    outerIon: { element: "K", color: 0x8F40D4, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sd⁵", magnetism: "Diamagnit (LS d³)",
    color: "Qora-yashil",
    dOrbital: { a1: 2, e: 0, e2: 0, type: "d³", deltaTPR: 16000 },
    geometry: "Trigonal prizmatik", symmetry: "D₃h",
    dElectrons: 3,
    twistAngle: 0
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Zr: { name: "Sirkoniy (Zr)", atomic: 40, mass: "91.22 u", config: "[Kr] 4d² 5s²", oxidation: "+4", role: "Markaziy ion", color: "#94E0BB" },
  W:  { name: "Volfram (W)", atomic: 74, mass: "183.84 u", config: "[Xe] 4f¹⁴ 5d⁴ 6s²", oxidation: "+6", role: "Markaziy ion", color: "#2194D6" },
  Re: { name: "Reniy (Re)", atomic: 75, mass: "186.21 u", config: "[Xe] 4f¹⁴ 5d⁵ 6s²", oxidation: "+4", role: "Markaziy ion", color: "#267DAB" },
  Mo: { name: "Molibden (Mo)", atomic: 42, mass: "95.95 u", config: "[Kr] 4d⁵ 5s¹", oxidation: "+4", role: "Markaziy ion", color: "#54B5B5" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "Metil donor atomi", hybridization: "sp³", color: "#1A1A1A" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Metil tarkibi", color: "#FFFFFF" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.07 u", config: "[Ne] 3s² 3p⁴", role: "Ditiolen donor", hybridization: "sp³", color: "#FFC832" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "CN guruhi", color: "#3050F8" },
  Li: { name: "Litiy (Li⁺)", atomic: 3, mass: "6.94 u", config: "[He]", charge: "+1", role: "Tashqi sfera kation", color: "#CC80FF" },
  K:  { name: "Kaliy (K⁺)", atomic: 19, mass: "39.10 u", config: "[Ar]", charge: "+1", role: "Tashqi sfera kation", color: "#8F40D4" }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#fbbf24", padding = 16, scale = 0.5
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
// TPR LIGAND POZITSIYALARI HISOBLASH (twistAngle parametri bilan)
// ═══════════════════════════════════════════════════════════════════════════
function getTPRPositions(bondLength, height, twistAngle = 0) {
  // twistAngle: 0° = ideal prizma, 60° = antiprizma (oktaedr)
  const positions = []
  const r = bondLength * Math.sin(Math.acos(height / bondLength))
  const halfH = height

  // Yuqori 3 ta (0°, 120°, 240°)
  for (let i = 0; i < 3; i++) {
    const angle = i * 120 * Math.PI / 180
    positions.push(new THREE.Vector3(
      r * Math.cos(angle),
      halfH,
      r * Math.sin(angle)
    ))
  }
  // Pastki 3 ta (60° + twistAngle, 180° + twistAngle, 300° + twistAngle)
  // Twist=0° → 0°, 120°, 240° (eclipsed = prizma)
  // Twist=60° → 60°, 180°, 300° (staggered = oktaedr)
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120 + twistAngle) * Math.PI / 180
    positions.push(new THREE.Vector3(
      r * Math.cos(angle),
      -halfH,
      r * Math.sin(angle)
    ))
  }
  return positions
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
      const r = radius * (0.6 + ((i * 9301 + 49297) % 233280) / 233280 * 0.4)
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
export default function TrigonalPrizma3D() {
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
  const symmetryHelpersRef = useRef([])
  const distanceLineRef = useRef(null)
  const prismEdgesRef = useRef([])
  const animationStateRef = useRef({
    originalPositions: new Map()
  })

  // ═══════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentComplex, setCurrentComplex] = useState("ZrMe6")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick")
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedForDistance, setSelectedForDistance] = useState([])
  const [measuredDistance, setMeasuredDistance] = useState(null)
  const [activePanel, setActivePanel] = useState(null)

  // ⭐ TPR-GA XOS XUSUSIYATLAR
  const [twistAngle, setTwistAngle] = useState(0)  // 0 = TPR, 60 = Oh
  const [showBailarTwist, setShowBailarTwist] = useState(false)
  const [isBailarPlaying, setIsBailarPlaying] = useState(false)
  const [showPrismEdges, setShowPrismEdges] = useState(true)
  const [showCompareOh, setShowCompareOh] = useState(false)  // TPR vs Oh
  const [showAllAngles, setShowAllAngles] = useState(false)

  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal")

  const [showSolvation, setShowSolvation] = useState(false)
  const [solventType, setSolventType] = useState("benzene")
  const [solvationDensity, setSolvationDensity] = useState(15)

  const [showTemperature, setShowTemperature] = useState(false)
  const [temperature, setTemperature] = useState(298)

  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C3")  // C3 | C2 | sigma_h | sigma_v | S6

  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch")

  const [showCrystalField, setShowCrystalField] = useState(false)
  const [showDOrbital, setShowDOrbital] = useState(false)

  // PDF / iqtibos / konfiguratsiya
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [citationFormat, setCitationFormat] = useState("apa")
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    snapshot: true, info: true, conditions: true, geometry: true,
    dorbital: true, comparison: true, spectra: false, references: true
  })

  const [expandedSection, setExpandedSection] = useState("view")

  const complex = COMPLEXES[currentComplex]

  // ═══════════════════════════════════════════════════════════
  // REF'LAR (animatsiyalar uchun)
  // ═══════════════════════════════════════════════════════════
  const angleMeasureModeRef = useRef(angleMeasureMode)
  const distanceMeasureModeRef = useRef(distanceMeasureMode)
  const showTemperatureRef = useRef(showTemperature)
  const temperatureRef = useRef(temperature)
  const showSolvationRef = useRef(showSolvation)
  const showVibrationRef = useRef(showVibration)
  const vibrationModeRef = useRef(vibrationMode)
  const complexRef = useRef(complex)
  const isBailarPlayingRef = useRef(isBailarPlaying)
  const twistAngleRef = useRef(twistAngle)

  useEffect(() => { angleMeasureModeRef.current = angleMeasureMode }, [angleMeasureMode])
  useEffect(() => { distanceMeasureModeRef.current = distanceMeasureMode }, [distanceMeasureMode])
  useEffect(() => { showTemperatureRef.current = showTemperature }, [showTemperature])
  useEffect(() => { temperatureRef.current = temperature }, [temperature])
  useEffect(() => { showSolvationRef.current = showSolvation }, [showSolvation])
  useEffect(() => { showVibrationRef.current = showVibration }, [showVibration])
  useEffect(() => { vibrationModeRef.current = vibrationMode }, [vibrationMode])
  useEffect(() => { complexRef.current = complex }, [complex])
  useEffect(() => { isBailarPlayingRef.current = isBailarPlaying }, [isBailarPlaying])
  useEffect(() => { twistAngleRef.current = twistAngle }, [twistAngle])

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
  // METIL LIGAND (CH₃)
  // ═══════════════════════════════════════════════════════════
  const createMeLigand = useCallback((parent, cPos, centerPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'Me', donorPos: cPos.clone() }

    const cGeo = new THREE.SphereGeometry(0.25, 48, 48)
    const cMat = new THREE.MeshStandardMaterial({
      color: CPK.C, roughness: 0.5, metalness: 0.2,
      emissive: 0x222222, emissiveIntensity: 0.1
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, isDonor: true }
    cMesh.castShadow = true
    group.add(cMesh)
    atomsRef.current.push(cMesh)
    ligandAtomsRef.current.push(cMesh)

    const cLabel = makeTextSprite("C", { color: "#d1d5db", scale: 0.32 })
    cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(cLabel)
    labelsRef.current.push(cLabel)

    // 3 ta H — sp³ tetrahedrik
    const cToCenter = new THREE.Vector3().subVectors(centerPos, cPos).normalize()
    const outDir = cToCenter.clone().negate()

    let perp1 = new THREE.Vector3()
    if (Math.abs(cToCenter.y) < 0.9) {
      perp1.crossVectors(cToCenter, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(cToCenter, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const perp2 = new THREE.Vector3().crossVectors(cToCenter, perp1).normalize()

    const hchAngle = 109.5 * Math.PI / 180
    const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(hchAngle) + 0.5) / 1.5))

    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3) + Math.PI / 6
      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(alpha))
        .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
        .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
        .normalize()

      const hPos = new THREE.Vector3().copy(cPos).addScaledVector(hDir, 0.55)

      const hGeo = new THREE.SphereGeometry(0.13, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H, roughness: 0.6, metalness: 0.05
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
      hMesh.castShadow = true
      group.add(hMesh)
      atomsRef.current.push(hMesh)

      const bond = createBond(group, cPos, hPos, 0xaaaaaa, 0.04, 0.7)
      bond.userData = { type: 'bond', bondType: 'C-H', length: '1.09 Å' }
      bondsRef.current.push(bond)
    }

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // DITIOLEN LIGAND (S₂C₂(CN)₂) — soddalashtirilgan
  // ═══════════════════════════════════════════════════════════
  const createDithioleneLigand = useCallback((parent, sPos, centerPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'dithiolene', donorPos: sPos.clone() }

    const sGeo = new THREE.SphereGeometry(0.35, 48, 48)
    const sMat = new THREE.MeshStandardMaterial({
      color: CPK.S, roughness: 0.4, metalness: 0.3,
      emissive: CPK.S, emissiveIntensity: 0.1
    })
    const sMesh = new THREE.Mesh(sGeo, sMat)
    sMesh.position.copy(sPos)
    sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, isDonor: true }
    sMesh.castShadow = true
    group.add(sMesh)
    atomsRef.current.push(sMesh)
    ligandAtomsRef.current.push(sMesh)

    const sLabel = makeTextSprite("S", { color: "#fef3c7", scale: 0.35 })
    sLabel.position.copy(sPos).add(new THREE.Vector3(0, 0.5, 0))
    group.add(sLabel)
    labelsRef.current.push(sLabel)

    parent.add(group)
    return group
  }, [])

  // ═══════════════════════════════════════════════════════════
  // BITTA TRIGONAL PRIZMA MOLEKULA
  // ═══════════════════════════════════════════════════════════
  const buildSingleMolecule = useCallback((parent, complexData, centerPos = new THREE.Vector3(0, 0, 0), scale = 1, customTwist = null) => {
    const molGroup = new THREE.Group()
    molGroup.position.copy(centerPos)
    molGroup.scale.setScalar(scale)
    molGroup.userData = { type: 'molecule', baseScale: scale }

    const center = complexData.center
    const localLigandGroups = []

    // Markaziy atom
    const coGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const coMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.2, metalness: 0.85,
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
      borderColor: "#ffffff", scale: 0.5
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

    // TPR ligand pozitsiyalari
    const bondLen = complexData.bondLength
    const halfH = bondLen * 0.7  // prizma balandligi
    const useTwist = customTwist !== null ? customTwist : (complexData.twistAngle || 0)
    const ligandPositions = getTPRPositions(bondLen, halfH, useTwist)

    const coPos = new THREE.Vector3(0, 0, 0)
    const ligandVectors = []

    ligandPositions.forEach((donorPos, idx) => {
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
      if (complexData.ligand.type === "Me") {
        ligGroup = createMeLigand(molGroup, donorPos, coPos)
      } else if (complexData.ligand.type === "dithiolene") {
        ligGroup = createDithioleneLigand(molGroup, donorPos, coPos)
      }
      if (ligGroup) {
        ligGroup.userData.ligandIdx = idx
        ligGroup.userData.bond = bond
        ligGroup.userData.originalPos = donorPos.clone()
        ligGroup.userData.coPos = coPos.clone()
        ligGroup.userData.isTop = idx < 3
        localLigandGroups.push(ligGroup)
      }
    })

    // PRIZMA QIRRALARI (yuqori-pastki uchburchak + 3 vertikal)
    const topPoints = ligandVectors.slice(0, 3)
    const botPoints = ligandVectors.slice(3, 6)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: CPK.edge, linewidth: 2, transparent: true, opacity: 0.7
    })

    const topClosed = [...topPoints, topPoints[0]]
    const botClosed = [...botPoints, botPoints[0]]
    const topGeom = new THREE.BufferGeometry().setFromPoints(topClosed)
    const botGeom = new THREE.BufferGeometry().setFromPoints(botClosed)
    const topLine = new THREE.Line(topGeom, edgeMaterial.clone())
    const botLine = new THREE.Line(botGeom, edgeMaterial.clone())
    topLine.userData = { type: 'prism-edge', position: 'top' }
    botLine.userData = { type: 'prism-edge', position: 'bottom' }
    molGroup.add(topLine)
    molGroup.add(botLine)
    prismEdgesRef.current.push(topLine, botLine)

    // Vertikal qirralar (twist=0 da prizma, twist!=0 da diagonal)
    for (let i = 0; i < 3; i++) {
      const geom = new THREE.BufferGeometry().setFromPoints([topPoints[i], botPoints[i]])
      const line = new THREE.Line(geom, edgeMaterial.clone())
      line.userData = { type: 'prism-edge', position: 'vertical' }
      molGroup.add(line)
      prismEdgesRef.current.push(line)
    }

    // Tashqi sfera ionlari
    const outer = complexData.outerIon
    if (outer.count > 0) {
      const outerDistance = 4.5
      const outerPositions = []

      for (let i = 0; i < outer.count; i++) {
        const angle = (i * 2 * Math.PI / outer.count) + Math.PI / 4
        outerPositions.push(new THREE.Vector3(
          outerDistance * Math.cos(angle),
          0.8 * (i % 2 === 0 ? 1 : -1),
          outerDistance * Math.sin(angle)
        ))
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
    }

    molGroup.userData.coAtom = coAtom
    molGroup.userData.ligandGroups = localLigandGroups
    molGroup.userData.ligandVectors = ligandVectors

    parent.add(molGroup)
    return molGroup
  }, [createBond, createMeLigand, createDithioleneLigand])

  // ═══════════════════════════════════════════════════════════
  // LIGAND POZITSIYALARINI YANGILASH (Bailar twist uchun)
  // ═══════════════════════════════════════════════════════════
  const updateLigandPositions = useCallback((twist) => {
    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandGroups) return

    const bondLen = complexRef.current.bondLength
    const halfH = bondLen * 0.7
    const newPositions = getTPRPositions(bondLen, halfH, twist)

    mol.userData.ligandGroups.forEach((lg, idx) => {
      const newPos = newPositions[idx]
      lg.position.copy(newPos)
      lg.userData.originalPos = newPos.clone()

      // CH3 ichidagi atomlarni ham qaytadan joylaymiz — bu murakkab,
      // shuning uchun faqat C atomini ko'chiramiz. Hidrogenlar avtomatik ergashadi (group bilan)
    })

    // Bog'larni yangilash
    mol.children.forEach(child => {
      if (child.userData && child.userData.type === 'bond' && child.userData.ligandIdx !== undefined) {
        const idx = child.userData.ligandIdx
        const newPos = newPositions[idx]
        const len = newPos.length()
        const mid = newPos.clone().multiplyScalar(0.5)
        child.position.copy(mid)
        child.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          newPos.clone().normalize()
        )
        // Cylinder uzunligini o'zgartirib bo'lmaydi geometriyada,
        // shu sababli faqat pozitsiya/orientatsiya
      }
    })

    // Qirralarni yangilash
    const top = newPositions.slice(0, 3)
    const bot = newPositions.slice(3, 6)
    let edgeIdx = 0
    mol.children.forEach(child => {
      if (child.userData && child.userData.type === 'prism-edge') {
        if (child.userData.position === 'top') {
          const pts = [...top, top[0]]
          child.geometry.setFromPoints(pts)
          child.geometry.computeBoundingSphere()
        } else if (child.userData.position === 'bottom') {
          const pts = [...bot, bot[0]]
          child.geometry.setFromPoints(pts)
          child.geometry.computeBoundingSphere()
        } else if (child.userData.position === 'vertical') {
          // Bu qaysi vertikal? Buni biz ketma-ket tartibda ko'rib chiqamiz
          // Hodisa: edgeIdx 0,1,2
          // To'g'ri yondashuv — ularni kuzatish, lekin soddalik uchun barcha vertikalni qaytadan
        }
      }
    })

    // Vertikal qirralarni qaytadan o'rnatish
    let verticalCount = 0
    mol.children.forEach(child => {
      if (child.userData && child.userData.type === 'prism-edge' && child.userData.position === 'vertical') {
        const i = verticalCount
        child.geometry.setFromPoints([top[i], bot[i]])
        child.geometry.computeBoundingSphere()
        verticalCount++
      }
    })
  }, [])

  // ═══════════════════════════════════════════════════════════
  // ENSEMBLE QURISH
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
    prismEdgesRef.current = []

    const positions = getEnsemblePositions(count, mode)
    const moleculeScale = count === 1 ? 1 : (count === 8 ? 0.7 : 0.5)

    positions.forEach((pos) => {
      const molGroup = buildSingleMolecule(scene, complexData, pos, moleculeScale)
      moleculeGroupsRef.current.push(molGroup)
      if (molGroup.userData.ligandGroups) {
        ligandGroupsRef.current.push(...molGroup.userData.ligandGroups)
      }
    })
  }, [buildSingleMolecule])

  // ═══════════════════════════════════════════════════════════
  // ERITUVCHI (benzol, THF, eter)
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
      const theta = (i * 137.5) * Math.PI / 180
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

      if (solvent === "benzene") {
        // Benzol — 6 ta C halqasi
        const ringRadius = 0.4
        for (let j = 0; j < 6; j++) {
          const a = j * Math.PI / 3
          const cGeo = new THREE.SphereGeometry(0.1, 12, 12)
          const cMat = new THREE.MeshStandardMaterial({
            color: CPK.C, transparent: true, opacity: 0.6
          })
          const cMesh = new THREE.Mesh(cGeo, cMat)
          cMesh.position.set(ringRadius * Math.cos(a), 0, ringRadius * Math.sin(a))
          solventGroup.add(cMesh)
        }
        // Halqa torusi
        const torusGeo = new THREE.TorusGeometry(ringRadius, 0.04, 8, 24)
        const torusMat = new THREE.MeshBasicMaterial({
          color: 0xaaaaaa, transparent: true, opacity: 0.4
        })
        const torus = new THREE.Mesh(torusGeo, torusMat)
        torus.rotation.x = Math.PI / 2
        solventGroup.add(torus)
      } else if (solvent === "thf") {
        // THF — 5 a'zoli halqa, 1 ta O
        const ringRadius = 0.35
        for (let j = 0; j < 5; j++) {
          const a = j * 2 * Math.PI / 5
          const isO = j === 0
          const geo = new THREE.SphereGeometry(0.1, 12, 12)
          const mat = new THREE.MeshStandardMaterial({
            color: isO ? CPK.O : CPK.C, transparent: true, opacity: 0.6
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.position.set(ringRadius * Math.cos(a), 0, ringRadius * Math.sin(a))
          solventGroup.add(mesh)
        }
      } else if (solvent === "ether") {
        // Et-O-Et soddalashtirilgan
        const positions = [[-0.3, 0, 0], [0, 0, 0], [0.3, 0, 0]]
        const colors = [CPK.C, CPK.O, CPK.C]
        positions.forEach((p, j) => {
          const geo = new THREE.SphereGeometry(0.1, 12, 12)
          const mat = new THREE.MeshStandardMaterial({
            color: colors[j], transparent: true, opacity: 0.6
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.position.set(...p)
          solventGroup.add(mesh)
        })
      }

      scene.add(solventGroup)
      solventMoleculesRef.current.push(solventGroup)
    }
  }, [])

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
    const fillLight = new THREE.DirectionalLight(0xccaa88, 0.4)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3)
    rimLight.position.set(0, -5, -8)
    scene.add(rimLight)

    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    clipPlaneRef.current = clipPlane

    const grid = new THREE.GridHelper(20, 40, 0x554433, 0x332211)
    grid.position.y = -8
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

    // Yulduzlar
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(300 * 3)
    for (let i = 0; i < 300 * 3; i += 3) {
      sp[i] = (Math.random() - .5) * 30
      sp[i + 1] = (Math.random() - .5) * 20
      sp[i + 2] = (Math.random() - .5) * 30
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.03, transparent: true, opacity: 0.5
    })))

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

      // Solvent
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

      // Markaziy atom glow
      atomsRef.current.forEach(atom => {
        if (atom.userData.isCenter && atom.userData.glow) {
          atom.userData.glow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
          atom.rotation.y += 0.002
        }
      })

      // ⭐ BAILAR TWIST ANIMATSIYASI (prizma ↔ oktaedr)
      if (isBailarPlayingRef.current) {
        // 0 → 60 → 0 (sinusoidal)
        const newTwist = 30 + Math.sin(elapsed * 1.2) * 30
        twistAngleRef.current = newTwist
        setTwistAngle(newTwist)
      }

      // 🎵 TEBRANISH REJIMLARI
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
            } else if (vibMode === "trig_breathing") {
              // Yuqori va pastki uchburchaklar qarama-qarshi
              amplitude = (lg.userData.isTop ? 1 : -1) * Math.sin(t) * 0.15
            } else if (vibMode === "twist_vib") {
              // Tebranishli twist (kichik)
              const isTop = lg.userData.isTop
              const angle = isTop ? 0 : Math.sin(t) * 8 * Math.PI / 180
              const r = lg.userData.originalPos.clone()
              const x = r.x * Math.cos(angle) - r.z * Math.sin(angle)
              const z = r.x * Math.sin(angle) + r.z * Math.cos(angle)
              lg.position.set(x, r.y, z)
              return
            }

            const newPos = lg.userData.originalPos.clone().addScaledVector(dir, amplitude)
            lg.position.copy(newPos)
          })
        }
      } else if (!showVibrationRef.current && !isBailarPlayingRef.current) {
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
        obj.userData.type === 'prism-edge' ||
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
    buildEnsemble(scene, COMPLEXES[currentComplex], moleculeCount, ensembleMode)

    setSelectedAtom(null)
    setSelectedLigands([])
    setMeasuredAngle(null)
    setSelectedForDistance([])
    setMeasuredDistance(null)
  }, [currentComplex, moleculeCount, ensembleMode, buildEnsemble])

  // ═══════════════════════════════════════════════════════════
  // BAILAR TWIST — pozitsiyalarni yangilash
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (moleculeCount !== 1) return
    if (!moleculeGroupsRef.current[0]) return

    const mol = moleculeGroupsRef.current[0]
    if (!mol.userData.ligandGroups) return

    const bondLen = complex.bondLength
    const halfH = bondLen * 0.7
    const newPositions = getTPRPositions(bondLen, halfH, twistAngle)

    mol.userData.ligandGroups.forEach((lg, idx) => {
      const newPos = newPositions[idx]
      // Eski pozitsiya
      const oldPos = lg.userData.originalPos.clone()
      const offset = newPos.clone().sub(oldPos)
      
      // Ligand group ichidagi C atomi va Hlar bilan birgalikda ko'chiriladi
      lg.position.add(offset)
      lg.userData.originalPos = newPos.clone()
    })

    // Yangi bog'lar — eskilarni o'chirib qaytadan chizish
    // Soddaroq yondashuv: bog' pozitsiyasini qayta hisoblash
    const bondsInMol = []
    mol.children.forEach(child => {
      if (child.userData && child.userData.type === 'bond' && child.userData.ligandIdx !== undefined) {
        bondsInMol.push(child)
      }
    })

    bondsInMol.forEach(bond => {
      const idx = bond.userData.ligandIdx
      const newPos = newPositions[idx]
      const len = newPos.length()
      const mid = newPos.clone().multiplyScalar(0.5)
      bond.position.copy(mid)
      bond.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        newPos.clone().normalize()
      )
      // Cylinder uzunligini scale.y bilan moslashtirish
      bond.scale.y = len / complex.bondLength
    })

    // Qirralarni yangilash
    const top = newPositions.slice(0, 3)
    const bot = newPositions.slice(3, 6)
    let verticalIdx = 0

    mol.children.forEach(child => {
      if (child.userData && child.userData.type === 'prism-edge') {
        if (child.userData.position === 'top') {
          const pts = [...top, top[0]]
          child.geometry.dispose()
          child.geometry = new THREE.BufferGeometry().setFromPoints(pts)
        } else if (child.userData.position === 'bottom') {
          const pts = [...bot, bot[0]]
          child.geometry.dispose()
          child.geometry = new THREE.BufferGeometry().setFromPoints(pts)
        } else if (child.userData.position === 'vertical') {
          child.geometry.dispose()
          child.geometry = new THREE.BufferGeometry().setFromPoints([top[verticalIdx], bot[verticalIdx]])
          verticalIdx++
        }
      }
    })

    // Bog' uzunligi yorliqlari
    mol.children.forEach(child => {
      if (child instanceof THREE.Sprite && child.userData) {
        // bondLabel bo'lsa midpointga ko'chiramiz (oddiyroq usul)
      }
    })

    // Mol.userData.ligandVectors ham yangilanishi kerak
    mol.userData.ligandVectors = newPositions
  }, [twistAngle, complex.bondLength, currentComplex, moleculeCount])

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
    }
  }, [showSolvation, solvationDensity, solventType, createSolventMolecules])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA / YORLIQLAR / BOG' UZUNLIKLARI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    outerSphereRef.current.forEach(obj => { obj.visible = showOuterSphere })
  }, [showOuterSphere, currentComplex, moleculeCount])

  useEffect(() => {
    labelsRef.current.forEach(label => {
      if (!outerSphereRef.current.includes(label)) {
        label.visible = showLabels
      }
    })
  }, [showLabels, currentComplex, moleculeCount])

  useEffect(() => {
    bondLabelsRef.current.forEach(label => { label.visible = showBondLengths })
  }, [showBondLengths, currentComplex, moleculeCount])

  // PRIZMA QIRRALARI TOGGLE
  useEffect(() => {
    prismEdgesRef.current.forEach(e => { e.visible = showPrismEdges })
  }, [showPrismEdges, currentComplex, moleculeCount, twistAngle])

  // KO'RINISH REJIMI
  useEffect(() => {
    atomsRef.current.forEach(atom => {
      if (!atom.material) return
      const el = atom.userData.element

      if (viewMode === "space-filling") {
        const vdwScales = { Zr: 2.5, W: 2.6, Re: 2.5, Mo: 2.5, C: 2.1, H: 1.6, S: 2.2, N: 2.0, Li: 2.0, K: 2.6 }
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

  // KESIM
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

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  // BURCHAK O'LCHASH ATOM YORITISH
  useEffect(() => {
    ligandAtomsRef.current.forEach(atom => {
      if (atom.material) atom.material.emissiveIntensity = 0.1
    })
    selectedLigands.forEach(atom => {
      if (atom.material) atom.material.emissiveIntensity = 0.6
    })
  }, [selectedLigands])

  // MASOFA O'LCHASH chiziq
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
  }, [selectedForDistance])

  // ═══════════════════════════════════════════════════════════
  // SIMMETRIYA ELEMENTLARI (D₃h uchun)
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

    const len = 4

    if (symmetryElement === "C3") {
      // 1 ta C3 o'q (vertikal Y)
      const dir = new THREE.Vector3(0, 1, 0)
      const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0xff4444, linewidth: 2, transparent: true, opacity: 0.8
      })
      const line = new THREE.Line(geom, mat)
      line.userData = { type: 'symmetry' }
      scene.add(line)
      symmetryHelpersRef.current.push(line)

      const label = makeTextSprite("C₃ (asosiy)", {
        color: "#ffffff", bgColor: "rgba(255, 68, 68, 0.85)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(0, len + 0.5, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "C2") {
      // 3 ta C2 o'qi (gorizontal, ligandlardan ligandgacha o'tadi)
      for (let i = 0; i < 3; i++) {
        const angle = (i * 60) * Math.PI / 180
        const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
        const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
        const geom = new THREE.BufferGeometry().setFromPoints(points)
        const mat = new THREE.LineDashedMaterial({
          color: 0x44ff44, dashSize: 0.2, gapSize: 0.15,
          transparent: true, opacity: 0.8
        })
        const line = new THREE.Line(geom, mat)
        line.computeLineDistances()
        line.userData = { type: 'symmetry' }
        scene.add(line)
        symmetryHelpersRef.current.push(line)
      }
      const label = makeTextSprite("3 × C₂", {
        color: "#ffffff", bgColor: "rgba(68, 255, 68, 0.85)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(len + 0.5, 0, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_h") {
      // σh — gorizontal tekislik (xz)
      const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xff44ff, transparent: true, opacity: 0.3,
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
      // 3 ta σv (vertikal tekisliklar, C2 o'qlari orqali)
      for (let i = 0; i < 3; i++) {
        const angle = i * 60 * Math.PI / 180
        const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
        const planeMat = new THREE.MeshBasicMaterial({
          color: 0x00ffff, transparent: true, opacity: 0.2,
          side: THREE.DoubleSide
        })
        const plane = new THREE.Mesh(planeGeo, planeMat)
        plane.rotation.y = angle
        plane.userData = { type: 'symmetry' }
        scene.add(plane)
        symmetryHelpersRef.current.push(plane)
      }
      const label = makeTextSprite("3 × σv", {
        color: "#ffffff", bgColor: "rgba(0, 200, 200, 0.85)",
        borderColor: "#ffffff", scale: 0.45
      })
      label.position.set(len, len, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "S6") {
      // S6 — improper rotation o'qi (Y bo'ylab, faqat antiprizmada)
      const dir = new THREE.Vector3(0, 1, 0)
      const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineDashedMaterial({
        color: 0xffaa00, dashSize: 0.1, gapSize: 0.05,
        transparent: true, opacity: 0.8
      })
      const line = new THREE.Line(geom, mat)
      line.computeLineDistances()
      line.userData = { type: 'symmetry' }
      scene.add(line)
      symmetryHelpersRef.current.push(line)

      const label = makeTextSprite("S₆ (antiprizma!)", {
        color: "#ffffff", bgColor: "rgba(255, 170, 0, 0.85)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(0, len + 0.5, 0)
      label.userData = { type: 'symmetry' }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    }
  }, [showSymmetry, symmetryElement, moleculeCount, currentComplex, twistAngle])

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
  }, [twistAngle])

  // ═══════════════════════════════════════════════════════════
  // PDF EKSPORT
  // ═══════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageW = 210, pageH = 297, margin = 18
      let y = margin, pageNum = 1

      const addFooter = () => {
        pdf.setFontSize(8)
        pdf.setTextColor(120, 120, 120)
        pdf.setFont("helvetica", "normal")
        pdf.text(
          `Trigonal Prizma 3D PRO  •  ${complex.formula}  •  Generated ${new Date().toLocaleDateString('uz-UZ')}`,
          margin, pageH - 8
        )
        pdf.text(`${pageNum}`, pageW - margin, pageH - 8, { align: "right" })
      }

      const checkPageBreak = (need) => {
        if (y + need > pageH - 20) {
          addFooter()
          pdf.addPage()
          pageNum++
          y = margin
        }
      }

      const drawSectionHeader = (num, title) => {
        checkPageBreak(15)
        pdf.setFillColor(180, 100, 20)
        pdf.rect(margin, y, 4, 6, "F")
        pdf.setTextColor(180, 100, 20)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.text(`${num}.  ${title}`, margin + 6, y + 5)
        y += 9
        pdf.setDrawColor(220, 180, 140)
        pdf.setLineWidth(0.3)
        pdf.line(margin, y, pageW - margin, y)
        y += 4
      }

      // HEADER
      pdf.setFillColor(60, 30, 10)
      pdf.rect(0, 0, pageW, 22, "F")
      pdf.setTextColor(250, 220, 180)
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.text("JDA-KIMYO RESEARCH BULLETIN  •  Coordination Chemistry  •  Vol. 2, Issue 2", margin, 8)
      pdf.text(`Issued: ${new Date().toLocaleDateString('en-GB')}`, pageW - margin, 8, { align: "right" })
      pdf.setDrawColor(251, 191, 36)
      pdf.setLineWidth(0.5)
      pdf.line(margin, 12, pageW - margin, 12)
      pdf.setFontSize(7)
      pdf.setTextColor(230, 200, 160)
      pdf.text("Interactive 3D Trigonal Prismatic Modeling Platform", margin, 17)
      pdf.text("DOI: 10.0000/jda-kimyo.tpr.2026", pageW - margin, 17, { align: "right" })
      y = 32

      // TITLE
      pdf.setTextColor(20, 20, 50)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(17)
      const title = `Trigonal Prismatic Coordination of ${complex.formula}`
      pdf.text(title, pageW / 2, y, { align: "center" })
      y += 8
      pdf.setFontSize(11)
      pdf.setFont("helvetica", "italic")
      pdf.setTextColor(130, 80, 40)
      pdf.text(complex.name, pageW / 2, y, { align: "center" })
      y += 7

      pdf.setFontSize(8)
      pdf.setTextColor(120, 120, 140)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Geometry: ${complex.geometry} (${complex.symmetry})  •  Hybridization: ${complex.hybridization}  •  ${complex.magnetism}`, pageW / 2, y, { align: "center" })
      y += 10

      // ABSTRACT
      pdf.setFillColor(255, 248, 235)
      pdf.setDrawColor(251, 191, 36)
      pdf.setLineWidth(0.4)
      pdf.roundedRect(margin, y, pageW - 2 * margin, 32, 2, 2, "FD")
      pdf.setTextColor(140, 80, 20)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.text("ABSTRACT", margin + 3, y + 5)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(9)
      pdf.setTextColor(40, 40, 60)
      const abstract = `The complex ${complex.formula} adopts a trigonal prismatic geometry (point group ${complex.symmetry}), which is unusual among hexacoordinate transition metal complexes that typically prefer octahedral arrangements. The central ${ATOM_INFO[complex.center.element].name.split(' ')[0]} atom is coordinated by six ${complex.ligand.donor} donor atoms forming two parallel triangular faces (eclipsed conformation), with an M-${complex.ligand.donor} bond length of ${complex.bondLengthReal}. The current twist angle is θ = ${twistAngle.toFixed(1)}° (0° = ideal TPR, 60° = octahedral antiprism). This geometry is stabilized by sd⁵ hybridization and is characteristic of d⁰ early transition metals such as W(VI), Zr(IV), and selected dithiolene complexes.`
      const absLines = pdf.splitTextToSize(abstract, pageW - 2 * margin - 6)
      pdf.text(absLines, margin + 3, y + 10)
      y += 36

      let sectionNum = 1

      // 3D SNAPSHOT
      if (pdfSections.snapshot) {
        drawSectionHeader(sectionNum++, "Three-Dimensional Visualization")
        const renderer = rendererRef.current
        if (renderer) {
          renderer.render(sceneRef.current, cameraRef.current)
          const imgData = renderer.domElement.toDataURL("image/png")
          const imgW = pageW - 2 * margin
          const imgH = imgW * 0.65
          checkPageBreak(imgH + 15)
          pdf.setFillColor(15, 12, 35)
          pdf.rect(margin, y, imgW, imgH, "F")
          pdf.addImage(imgData, "PNG", margin, y, imgW, imgH, undefined, "FAST")
          pdf.setDrawColor(251, 191, 36)
          pdf.setLineWidth(0.5)
          pdf.rect(margin, y, imgW, imgH)
          y += imgH + 3
          pdf.setFontSize(8)
          pdf.setFont("helvetica", "italic")
          pdf.setTextColor(140, 80, 40)
          pdf.text(`Figure 1.  3D rendering of ${complex.formula} in ${viewMode} representation. Twist angle θ = ${twistAngle.toFixed(1)}°. ${moleculeCount > 1 ? `Ensemble of ${moleculeCount} units.` : "Single molecular unit showing the two triangular faces."}`,
            margin, y, { maxWidth: pageW - 2 * margin })
          y += 10
        }
      }

      // GENERAL INFO
      if (pdfSections.info) {
        drawSectionHeader(sectionNum++, "Compound Identification")
        const infoTable = [
          ["Coordination ion", complex.formula],
          ["Counterion salt", complex.fullSalt],
          ["IUPAC name", complex.name],
          ["Coordination number", "6"],
          ["Geometry", complex.geometry],
          ["Point group", complex.symmetry],
          ["Hybridization", complex.hybridization],
          ["Magnetic property", complex.magnetism],
          ["Color (solid)", complex.color],
          ["d-electron count", `d${complex.dElectrons}`],
          ["Twist angle θ", `${twistAngle.toFixed(1)}° (${twistAngle < 10 ? "TPR" : twistAngle > 50 ? "Oh" : "intermediate"})`]
        ]
        checkPageBreak(infoTable.length * 6 + 5)
        infoTable.forEach((row, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(255, 250, 240)
            pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
          }
          pdf.setTextColor(140, 80, 20)
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(9)
          pdf.text(row[0], margin + 2, y + 3)
          pdf.setTextColor(20, 20, 40)
          pdf.setFont("helvetica", "normal")
          pdf.text(row[1], margin + 60, y + 3)
          y += 5.5
        })
        y += 6
      }

      // GEOMETRY
      if (pdfSections.geometry) {
        drawSectionHeader(sectionNum++, "Molecular Geometry")
        const angles = computeAllAngles()
        const ligLen = complex.bondLength
        const halfH = ligLen * 0.7
        const r = Math.sqrt(ligLen * ligLen - halfH * halfH)
        const intraTriangle = (Math.sqrt(3) * r).toFixed(3)
        const interTriangle = (2 * halfH).toFixed(3)
        const geomData = [
          [`M-${complex.ligand.donor} bond length`, complex.bondLengthReal],
          ["Twist angle θ", `${twistAngle.toFixed(1)}°`],
          ["Inter-triangle distance (h)", `${interTriangle} (scene units)`],
          ["Intra-triangle L-L", `${intraTriangle} (scene units)`],
          ["Ideal TPR ∠L-M-L (intra)", "~76°"],
          ["Ideal TPR ∠L-M-L (inter, capped)", "~136°"],
          ["For comparison: Oh cis", "90°"],
          ["For comparison: Oh trans", "180°"]
        ]
        checkPageBreak(geomData.length * 6 + 5)
        geomData.forEach((row, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(245, 235, 220)
            pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
          }
          pdf.setTextColor(180, 100, 20)
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(9)
          pdf.text(row[0], margin + 2, y + 3)
          pdf.setTextColor(20, 20, 40)
          pdf.setFont("helvetica", "normal")
          pdf.text(row[1], margin + 75, y + 3)
          y += 5.5
        })
        y += 6
      }

      // CONDITIONS
      if (pdfSections.conditions) {
        drawSectionHeader(sectionNum++, "Simulation Conditions")
        const cond = []
        cond.push(["Number of molecules", `${moleculeCount}`])
        cond.push(["Ensemble mode", ensembleMode === "crystal" ? "Crystal lattice" : "Solution"])
        cond.push(["Visualization mode", viewMode])
        cond.push(["Twist angle θ", `${twistAngle.toFixed(1)}°`])
        if (showTemperature) cond.push(["Temperature", `${temperature} K`])
        if (showSolvation) cond.push(["Solvent", `${solventType} (${solvationDensity} mol.)`])

        cond.forEach((row, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(240, 250, 255)
            pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
          }
          pdf.setTextColor(20, 80, 140)
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(9)
          pdf.text(row[0], margin + 2, y + 3)
          pdf.setTextColor(20, 20, 40)
          pdf.setFont("helvetica", "normal")
          pdf.text(row[1], margin + 70, y + 3)
          y += 5.5
        })
        y += 6
      }

      // d-ORBITAL (TPR SPLITTING)
      if (pdfSections.dorbital) {
        drawSectionHeader(sectionNum++, "TPR d-Orbital Splitting Diagram")
        checkPageBreak(70)
        pdf.setFontSize(9)
        pdf.setTextColor(40, 40, 60)
        pdf.text(`In trigonal prismatic geometry (D₃h), the d-orbitals split into three sets:`, margin, y)
        y += 5
        pdf.setFont("helvetica", "bold")
        pdf.text(`Top:    e'' (dxz, dyz)    — antibonding`, margin + 5, y); y += 4
        pdf.text(`Middle: e'  (dxy, dx²-y²) — non-bonding`, margin + 5, y); y += 4
        pdf.text(`Bottom: a₁' (dz²)          — bonding`, margin + 5, y); y += 6

        // Diagramma
        const dx = margin + 20
        const yE2 = y + 5
        const yE = y + 18
        const yA1 = y + 32

        pdf.setDrawColor(180, 100, 20)
        pdf.setLineWidth(0.8)
        // e'' — 2 chiziq
        pdf.line(dx, yE2, dx + 12, yE2)
        pdf.line(dx + 18, yE2, dx + 30, yE2)
        // e' — 2 chiziq
        pdf.line(dx, yE, dx + 12, yE)
        pdf.line(dx + 18, yE, dx + 30, yE)
        // a1' — 1 chiziq
        pdf.line(dx + 9, yA1, dx + 21, yA1)

        pdf.setTextColor(180, 100, 20)
        pdf.setFont("helvetica", "bold")
        pdf.text("e''", dx - 7, yE2 + 1)
        pdf.text("e'", dx - 6, yE + 1)
        pdf.text("a₁'", dx - 7, yA1 + 1)

        // Elektronlar
        pdf.setTextColor(220, 150, 0)
        pdf.setFontSize(11)
        if (complex.dOrbital.a1 >= 1) pdf.text("↑", dx + 12, yA1 - 1)
        if (complex.dOrbital.a1 >= 2) pdf.text("↓", dx + 15, yA1 - 1)

        // Tushuntirish
        pdf.setTextColor(60, 60, 80)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")
        pdf.text(`Configuration: a₁'^${complex.dOrbital.a1} e'^${complex.dOrbital.e} e''^${complex.dOrbital.e2}`, dx + 50, yE - 3)
        pdf.text(`d-electron count: ${complex.dElectrons}`, dx + 50, yE + 2)
        pdf.text(`Δ(TPR) ≈ ${complex.dOrbital.deltaTPR.toLocaleString()} cm⁻¹`, dx + 50, yE + 7)
        pdf.text(`Geometry preference: d⁰, d¹, d² stable in TPR`, dx + 50, yE + 12)

        y += 55
        pdf.setFontSize(8)
        pdf.setFont("helvetica", "italic")
        pdf.setTextColor(140, 80, 40)
        pdf.text(`Figure 2. d-orbital splitting under D₃h symmetry. Note the a₁' orbital is lowest, in stark contrast to Oh where t₂g lies below eg.`, margin, y, { maxWidth: pageW - 2 * margin })
        y += 10
      }

      // TPR vs Oh COMPARISON
      if (pdfSections.comparison) {
        drawSectionHeader(sectionNum++, "Trigonal Prismatic vs Octahedral")
        const compData = [
          ["Property", "Trigonal Prismatic", "Octahedral"],
          ["Point group", "D₃h", "Oh"],
          ["Twist angle θ", "0°", "60°"],
          ["Top/bottom faces", "Eclipsed", "Staggered"],
          ["d-orbital lowest", "a₁' (dz²)", "t₂g (dxy, dxz, dyz)"],
          ["d-orbital splitting", "3 levels (a₁', e', e'')", "2 levels (t₂g, eg)"],
          ["Favored for", "d⁰, d¹, d²", "d³, d⁵, d⁶"],
          ["Inversion center", "No", "Yes (i)"],
          ["Hybridization", "sd⁵", "d²sp³"],
          ["Examples", "[W(CH₃)₆], MoS₂", "[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻"]
        ]
        checkPageBreak(compData.length * 6 + 5)
        compData.forEach((row, i) => {
          if (i === 0) {
            pdf.setFillColor(140, 80, 20)
            pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
            pdf.setTextColor(255, 255, 255)
            pdf.setFont("helvetica", "bold")
          } else {
            if (i % 2 === 0) {
              pdf.setFillColor(255, 245, 235)
              pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
            }
            pdf.setTextColor(20, 20, 40)
            pdf.setFont("helvetica", "normal")
          }
          pdf.setFontSize(8)
          pdf.text(row[0], margin + 2, y + 3)
          pdf.text(row[1], margin + 60, y + 3)
          pdf.text(row[2], margin + 120, y + 3)
          y += 5.5
        })
        y += 6
      }

      // SPECTRA
      if (pdfSections.spectra) {
        drawSectionHeader(sectionNum++, "Predicted Spectroscopic Data")
        const specData = [
          ["UV-Vis (charge transfer)", "300-450 nm range"],
          [`IR (M-${complex.ligand.donor} stretch)`, "400-550 cm⁻¹"],
          ["Symmetric stretch ν₁ (a₁')", "≈ 500 cm⁻¹  (Raman-active only)"],
          ["Asym. stretch ν₃ (e')", "≈ 450 cm⁻¹  (IR + Raman)"],
          ["Trigonal breathing (a₁')", "≈ 280 cm⁻¹"],
          ["NMR", currentComplex === "ZrMe6" ? "¹H: 0.3 ppm (CH₃)" : "Variable per compound"]
        ]
        specData.forEach((row, i) => {
          if (i % 2 === 0) {
            pdf.setFillColor(240, 255, 250)
            pdf.rect(margin, y - 1, pageW - 2 * margin, 5.5, "F")
          }
          pdf.setTextColor(20, 120, 80)
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(9)
          pdf.text(row[0], margin + 2, y + 3)
          pdf.setTextColor(20, 20, 40)
          pdf.setFont("helvetica", "normal")
          pdf.text(row[1], margin + 70, y + 3)
          y += 5.5
        })
        y += 6
      }

      // REFERENCES
      if (pdfSections.references) {
        drawSectionHeader(sectionNum++, "References")
        const refs = [
          "1. Bailar, J. C. (1958). Inorganic chemical reactions in non-aqueous solvents. J. Inorg. Nucl. Chem., 8, 165–175. [Bailar twist]",
          "2. Eisenberg, R.; Ibers, J. A. (1965). Tris(cis-1,2-diphenylethene-1,2-dithiolato)rhenium. J. Am. Chem. Soc., 87 (16), 3776–3778. [First TPR structure]",
          "3. Haaland, A.; Hammel, A.; Rypdal, K.; Volden, H. V. (1990). The coordination geometry of gaseous hexamethyltungsten is not octahedral. J. Am. Chem. Soc., 112 (11), 4547–4549.",
          "4. Kang, S. K.; Tang, H.; Albright, T. A. (1993). Structures of d⁰ ML₆ and ML₅ complexes. J. Am. Chem. Soc., 115 (5), 1971–1981.",
          "5. Hoffmann, R.; Howell, J. M.; Rossi, A. R. (1976). Bicapped tetrahedral, trigonal prismatic, and octahedral alternatives. J. Am. Chem. Soc., 98 (10), 2484–2492.",
          "6. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
          "7. Morse, P. M.; Girolami, G. S. (1989). Are d⁰ ML₆ complexes always octahedral? J. Am. Chem. Soc., 111 (11), 4114–4116."
        ]
        pdf.setFontSize(8)
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(40, 40, 60)
        refs.forEach(r => {
          checkPageBreak(8)
          const lines = pdf.splitTextToSize(r, pageW - 2 * margin)
          pdf.text(lines, margin, y)
          y += lines.length * 3.8 + 1
        })
      }

      addFooter()

      const fileName = `${complex.formula.replace(/[^a-zA-Z0-9]/g, '_')}_TPR_report_${new Date().toISOString().slice(0, 10)}.pdf`
      pdf.save(fileName)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF error:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // IQTIBOS
  // ═══════════════════════════════════════════════════════════
  const getCitation = () => {
    const year = new Date().getFullYear()
    const accessDate = new Date().toLocaleDateString('en-GB')
    if (citationFormat === "apa") {
      return `JDA-Kimyo Research Bulletin. (${year}). Trigonal prismatic coordination of ${complex.formula}: ${complex.name}. Interactive 3D Molecular Modeling Platform. Retrieved ${accessDate}.`
    } else if (citationFormat === "mla") {
      return `"Trigonal Prismatic Coordination of ${complex.formula}: ${complex.name}." JDA-Kimyo Research Bulletin, ${year}. Accessed ${accessDate}.`
    } else if (citationFormat === "bibtex") {
      const key = complex.id.toLowerCase()
      return `@misc{${key}${year},\n  title  = {Trigonal Prismatic Coordination of ${complex.formula}: ${complex.name}},\n  author = {{JDA-Kimyo Research Bulletin}},\n  year   = {${year}},\n  note   = {Interactive 3D Trigonal Prismatic Modeling Platform},\n  url    = {https://jda-kimyo.uz/oquv/fazoviy/trigonal-prizma},\n  urldate = {${accessDate}}\n}`
    } else if (citationFormat === "chicago") {
      return `JDA-Kimyo Research Bulletin. "Trigonal Prismatic Coordination of ${complex.formula}: ${complex.name}." ${year}. Accessed ${accessDate}.`
    }
    return ""
  }

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation())
      .then(() => alert("📋 Iqtibos nusxalandi!"))
      .catch(() => alert("Nusxalashda xato"))
  }

  // ═══════════════════════════════════════════════════════════
  // KONFIGURATSIYA EKSPORT/IMPORT
  // ═══════════════════════════════════════════════════════════
  const exportConfig = () => {
    const config = {
      version: "1.0-TPR",
      timestamp: new Date().toISOString(),
      complex: currentComplex,
      twistAngle,
      view: { viewMode, showLabels, showBondLengths, showOuterSphere, sliceView, autoRotate, showPrismEdges },
      ensemble: { moleculeCount, ensembleMode },
      conditions: { showTemperature, temperature, showSolvation, solventType, solvationDensity },
      scientific: { showSymmetry, symmetryElement, showVibration, vibrationMode, showCrystalField }
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${complex.id}_TPR_config_${Date.now()}.json`
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
        if (typeof c.twistAngle === "number") setTwistAngle(c.twistAngle)
        if (c.view) {
          if (c.view.viewMode) setViewMode(c.view.viewMode)
          if (typeof c.view.showLabels === "boolean") setShowLabels(c.view.showLabels)
          if (typeof c.view.showBondLengths === "boolean") setShowBondLengths(c.view.showBondLengths)
          if (typeof c.view.showOuterSphere === "boolean") setShowOuterSphere(c.view.showOuterSphere)
          if (typeof c.view.showPrismEdges === "boolean") setShowPrismEdges(c.view.showPrismEdges)
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
          if (typeof c.conditions.showSolvation === "boolean") setShowSolvation(c.conditions.showSolvation)
          if (c.conditions.solventType) setSolventType(c.conditions.solventType)
          if (c.conditions.solvationDensity) setSolvationDensity(c.conditions.solvationDensity)
        }
        if (c.scientific) {
          if (typeof c.scientific.showSymmetry === "boolean") setShowSymmetry(c.scientific.showSymmetry)
          if (c.scientific.symmetryElement) setSymmetryElement(c.scientific.symmetryElement)
          if (typeof c.scientific.showVibration === "boolean") setShowVibration(c.scientific.showVibration)
          if (c.scientific.vibrationMode) setVibrationMode(c.scientific.vibrationMode)
          if (typeof c.scientific.showCrystalField === "boolean") setShowCrystalField(c.scientific.showCrystalField)
        }
        alert("✅ Konfiguratsiya yuklandi!")
      } catch (err) {
        alert("❌ Xato: " + err.message)
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const togglePanel = (panelName) => {
    setActivePanel(prev => prev === panelName ? null : panelName)
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-950 via-amber-950 to-yellow-950 text-white flex flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-amber-800/50 z-30 bg-orange-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/oquv/fazoviy/trigonal-prizma"
            className="text-amber-400 hover:text-amber-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-amber-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-amber-300 flex items-center gap-2 truncate">
              <span>🔶</span>
              <span className="hidden sm:inline">Trigonal Prizma — 3D Laboratoriya PRO</span>
              <span className="sm:hidden">TPR 3D PRO</span>
            </h1>
            <p className="text-amber-500 text-xs truncate">
              {complex.formula} • θ = {twistAngle.toFixed(1)}° • {twistAngle < 10 ? "Prizma (D₃h)" : twistAngle > 50 ? "Antiprizma (Oh)" : "Oraliq"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentComplex}
            onChange={(e) => setCurrentComplex(e.target.value)}
            className="bg-amber-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-amber-700/50 focus:outline-none focus:border-amber-500 cursor-pointer max-w-[200px]"
          >
            <option value="ZrMe6">[Zr(CH₃)₆]²⁻</option>
            <option value="WMe6">[W(CH₃)₆]</option>
            <option value="ReS6">[Re(mnt)₃]²⁻</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${
              autoRotate ? 'bg-amber-600/60 text-white' : 'bg-amber-900/50 text-amber-400 hover:bg-amber-800/50'
            }`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${
              activePanel === "info" ? 'bg-amber-600/60 text-white' : 'bg-amber-900/50 text-amber-400 hover:bg-amber-800/50'
            }`}
            title="Ma'lumot"
          >ℹ️</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-gradient-to-r from-red-600/70 to-orange-600/70 hover:from-red-500 hover:to-orange-500 text-white shadow-lg"
            title="PDF eksport"
          >📄</button>
        </div>
      </header>

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* BOSHQARUV PANELI */}
        <div className="absolute top-3 left-3 z-20 bg-orange-950/90 backdrop-blur-md rounded-xl border border-amber-700/50 p-3 w-[260px] shadow-2xl max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-amber-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span>🎛️</span> Boshqaruv paneli
          </h3>

          {/* ⭐ BAILAR TWIST (TPR ↔ Oh) */}
          <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg p-2 border border-orange-700/40 mb-2">
            <h4 className="text-[10px] text-orange-300 uppercase mb-2 font-bold flex items-center justify-between">
              <span>🔄 Bailar Twist</span>
              <span className="text-yellow-300 font-mono">{twistAngle.toFixed(1)}°</span>
            </h4>
            <input
              type="range"
              min="0" max="60" step="1"
              value={twistAngle}
              onChange={(e) => setTwistAngle(Number(e.target.value))}
              className="w-full h-1.5 mb-1"
              disabled={isBailarPlaying || moleculeCount !== 1}
            />
            <div className="flex justify-between text-[9px] text-orange-300 mb-2">
              <span className="font-bold">0° = TPR (D₃h)</span>
              <span className="font-bold">60° = Oh</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => { setTwistAngle(0); setIsBailarPlaying(false) }}
                className="flex-1 text-[10px] py-1 bg-orange-700 hover:bg-orange-600 rounded text-white"
                disabled={moleculeCount !== 1}
              >Prizma</button>
              <button
                onClick={() => { setTwistAngle(60); setIsBailarPlaying(false) }}
                className="flex-1 text-[10px] py-1 bg-blue-700 hover:bg-blue-600 rounded text-white"
                disabled={moleculeCount !== 1}
              >Oktaedr</button>
              <button
                onClick={() => setIsBailarPlaying(!isBailarPlaying)}
                className={`flex-1 text-[10px] py-1 rounded text-white ${
                  isBailarPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'
                }`}
                disabled={moleculeCount !== 1}
              >{isBailarPlaying ? "⏸️" : "▶️"}</button>
            </div>
            {moleculeCount !== 1 && (
              <div className="text-[9px] text-orange-400 mt-1 italic">
                Twist faqat 1 molekulada faol
              </div>
            )}
          </div>

          {/* MOLEKULALAR SONI */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
            <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">🧬 Molekulalar</h4>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[1, 8, 27].map(n => (
                <button
                  key={n}
                  onClick={() => setMoleculeCount(n)}
                  className={`p-1.5 rounded text-xs font-bold transition-all ${
                    moleculeCount === n ? 'bg-yellow-600 text-white shadow-lg' : 'bg-amber-900/50 text-amber-300 hover:bg-amber-800'
                  }`}
                >{n}</button>
              ))}
            </div>
            {moleculeCount > 1 && (
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setEnsembleMode("crystal")}
                  className={`p-1 rounded text-[10px] ${ensembleMode === "crystal" ? 'bg-cyan-600 text-white' : 'bg-amber-900/50 text-amber-300'}`}
                >🔷 Kristall</button>
                <button
                  onClick={() => setEnsembleMode("solution")}
                  className={`p-1 rounded text-[10px] ${ensembleMode === "solution" ? 'bg-cyan-600 text-white' : 'bg-amber-900/50 text-amber-300'}`}
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
                <label className="text-[10px] text-amber-400 uppercase block mb-1">Rejim</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "ball-stick", label: "🔗", title: "Ball-stick" },
                    { id: "space-filling", label: "⚪", title: "To'la" },
                    { id: "wireframe", label: "🕸️", title: "Karkas" }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`p-1.5 rounded text-sm ${
                        viewMode === mode.id ? 'bg-amber-600 text-white' : 'bg-amber-900/50 text-amber-400 hover:bg-amber-800'
                      }`}
                      title={mode.title}
                    >{mode.label}</button>
                  ))}
                </div>
              </div>

              <ToggleRow label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
              <ToggleRow label="📏 Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
              <ToggleRow label="🔶 Prizma qirralari" value={showPrismEdges} onChange={setShowPrismEdges} />
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
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] ${
                  activePanel === "dorbital" ? 'bg-amber-600 text-white' : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800/60'
                }`}
              >
                <span>⚛️ d-orbital (TPR)</span>
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
              <ToggleRow label="💧 Erituvchi qobig'i" value={showSolvation} onChange={setShowSolvation} />
              {showSolvation && (
                <div className="ml-2 mt-1 space-y-1 bg-amber-900/30 p-2 rounded">
                  <select
                    value={solventType}
                    onChange={(e) => setSolventType(e.target.value)}
                    className="w-full text-[10px] bg-amber-800 rounded px-1 py-1"
                  >
                    <option value="benzene">Benzol (C₆H₆)</option>
                    <option value="thf">THF (C₄H₈O)</option>
                    <option value="ether">Dietileter</option>
                  </select>
                  <div>
                    <label className="text-[9px] text-amber-400">Zichlik: {solvationDensity}</label>
                    <input
                      type="range" min="5" max="40" step="5"
                      value={solvationDensity}
                      onChange={(e) => setSolvationDensity(Number(e.target.value))}
                      className="w-full h-1"
                    />
                  </div>
                </div>
              )}

              <ToggleRow label="🌡️ Temperatura" value={showTemperature} onChange={setShowTemperature} />
              {showTemperature && (
                <div className="ml-2 mt-1 bg-amber-900/30 p-2 rounded">
                  <input
                    type="range" min="100" max="800" step="10"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full h-1"
                  />
                  <div className="text-[9px] text-amber-400 mt-1 flex justify-between">
                    <span>{temperature} K</span>
                    <span>{(temperature - 273).toFixed(0)}°C</span>
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
              <ToggleRow label="⚡ Simmetriya (D₃h)" value={showSymmetry} onChange={setShowSymmetry} />
              {showSymmetry && (
                <div className="ml-2 mt-1 bg-amber-900/30 p-2 rounded">
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { id: "C3", label: "C₃ (asosiy)" },
                      { id: "C2", label: "3 × C₂" },
                      { id: "sigma_h", label: "σh" },
                      { id: "sigma_v", label: "3 × σv" },
                      { id: "S6", label: "S₆ (Oh)" }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSymmetryElement(s.id)}
                        className={`p-1 rounded text-[9px] ${
                          symmetryElement === s.id ? 'bg-pink-600 text-white' : 'bg-amber-900/50 text-amber-300'
                        }`}
                      >{s.label}</button>
                    ))}
                  </div>
                </div>
              )}

              <ToggleRow label="🎵 Tebranish rejimlari" value={showVibration} onChange={setShowVibration} />
              {showVibration && (
                <div className="ml-2 mt-1 bg-amber-900/30 p-2 rounded">
                  <select
                    value={vibrationMode}
                    onChange={(e) => setVibrationMode(e.target.value)}
                    className="w-full text-[10px] bg-amber-800 rounded px-1 py-1"
                  >
                    <option value="sym_stretch">ν₁ Simmetrik cho'zilish (a₁')</option>
                    <option value="trig_breathing">ν₂ Trigonal "nafas" (a₁')</option>
                    <option value="twist_vib">ν₅ Twist tebranishi (e'')</option>
                  </select>
                </div>
              )}

              <button
                onClick={() => togglePanel("comparison")}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] ${
                  activePanel === "comparison" ? 'bg-purple-600 text-white' : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800/60'
                }`}
              >
                <span>⚖️ TPR vs Oh</span>
                <span>{activePanel === "comparison" ? "✕" : "▸"}</span>
              </button>
            </div>
          )}

          {/* BO'LIM 4: EKSPORT */}
          <SectionHeader
            label="📤 Eksport / saqlash"
            isOpen={expandedSection === "export"}
            onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
          />
          {expandedSection === "export" && (
            <div className="space-y-2 pl-1">
              <button
                onClick={() => setPdfModalOpen(true)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <span>📄</span> PDF hisobot
              </button>
              <button
                onClick={() => setCitationModalOpen(true)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <span>📚</span> Iqtibos
              </button>
              <button
                onClick={exportConfig}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <span>💾</span> Saqlash
              </button>
              <label className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <span>📂</span> Yuklash
                <input type="file" accept=".json" onChange={importConfig} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* 3D CONTAINER */}
        <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-orange-950/80 backdrop-blur-sm z-40">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
                <p className="text-amber-300 text-lg">🔶 Prizma yuklanmoqda...</p>
              </div>
            </div>
          )}

          {showTooltip && !loading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-amber-200 z-20 border border-amber-700/50 animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span>🖱️ aylantirish</span>
                <span className="text-amber-700">•</span>
                <span>🔍 zoom</span>
                <span className="text-amber-700">•</span>
                <span>👆 atom</span>
              </div>
            </div>
          )}

          {angleMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-amber-100 z-25 border border-amber-600/50">
              {selectedLigands.length === 0 && "📐 1-ligandni tanlang"}
              {selectedLigands.length === 1 && "📐 2-ligandni tanlang..."}
              {selectedLigands.length === 2 && measuredAngle && (
                <span>📐 Burchak: <strong className="text-yellow-300 text-lg">{measuredAngle}°</strong></span>
              )}
            </div>
          )}

          {distanceMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-orange-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-orange-100 z-25 border border-orange-600/50">
              {selectedForDistance.length === 0 && "📏 1-atomni tanlang"}
              {selectedForDistance.length === 1 && "📏 2-atomni tanlang..."}
              {selectedForDistance.length === 2 && measuredDistance && (
                <span>📏 Masofa: <strong className="text-yellow-300 text-lg">{measuredDistance} Å</strong></span>
              )}
            </div>
          )}

          {/* INDIKATORLAR */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 space-y-1 flex flex-col items-center">
            {isBailarPlaying && (
              <div className="bg-purple-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-purple-200 border border-purple-700/50 animate-pulse">
                🔄 Bailar Twist: TPR ↔ Antiprizma (Oh) o'tishi
              </div>
            )}
            {showSymmetry && (
              <div className="bg-pink-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-pink-200 border border-pink-700/50">
                ⚡ {symmetryElement === "C3" ? "Asosiy C₃ o'qi (vertikal)" :
                   symmetryElement === "C2" ? "3 × C₂ o'qlar (gorizontal)" :
                   symmetryElement === "sigma_h" ? "σh gorizontal tekislik" :
                   symmetryElement === "sigma_v" ? "3 × σv tekisliklar" :
                   "S₆ improper o'q (faqat antiprizmada)"}
              </div>
            )}
            {showVibration && (
              <div className="bg-cyan-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-cyan-200 border border-cyan-700/50">
                🎵 {vibrationMode === "sym_stretch" ? "ν₁ Simmetrik cho'zilish (Raman)" :
                   vibrationMode === "trig_breathing" ? "ν₂ Trigonal nafas (Raman)" :
                   "ν₅ Twist tebranishi (IR-faol)"}
              </div>
            )}
          </div>

          {/* TANLANGAN ATOM */}
          {selectedAtom && (
            <div className="absolute top-3 right-3 bg-orange-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-xs w-[280px] shadow-2xl animate-slide-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30" style={{ backgroundColor: selectedAtom.info.color }}></div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                    <p className="text-xs text-amber-400">Z = {selectedAtom.info.atomic}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAtom(null)} className="text-amber-400 hover:text-white text-xl leading-none">×</button>
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
          {!selectedAtom && activePanel === "info" && (
            <div className="absolute top-3 right-3 bg-orange-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-amber-700/50 max-w-sm w-[300px] shadow-2xl animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-amber-300">📋 Kompleks ma'lumotlari</h3>
                <button onClick={() => setActivePanel(null)} className="text-amber-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-2 text-xs">
                <InfoRow label="Formula" value={complex.formula} mono />
                <InfoRow label="To'liq tuz" value={complex.fullSalt} mono />
                <InfoRow label="Nomi" value={complex.name} small />
                <InfoRow label="Geometriya" value={complex.geometry} />
                <InfoRow label="Simmetriya" value={complex.symmetry} mono />
                <InfoRow label="Gibridlanish" value={complex.hybridization} mono />
                <InfoRow label="Bog' uzunligi" value={complex.bondLengthReal} mono />
                <InfoRow label="Magnit" value={complex.magnetism} />
                <InfoRow label="Rangi" value={complex.color} small />
                <InfoRow label="d-elektron" value={`d${complex.dElectrons}`} mono />
                <InfoRow label="Twist θ" value={`${twistAngle.toFixed(1)}°`} mono />
              </div>
            </div>
          )}

          {/* d-ORBITAL PANEL (TPR) */}
          {!selectedAtom && activePanel === "dorbital" && (
            <div className="absolute top-3 right-3 bg-orange-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-amber-700/50 shadow-2xl w-[320px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>⚛️</span> d-orbital splitting (D₃h)
                </h3>
                <button onClick={() => setActivePanel(null)} className="text-amber-400 hover:text-white text-xl leading-none">×</button>
              </div>

              <div className="relative h-40 flex flex-col justify-between text-xs">
                {/* e'' (eng yuqori) */}
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 w-10 text-right">e''</span>
                  <div className="flex-1 flex gap-1">
                    <div className="flex-1 h-1 bg-amber-400 rounded"></div>
                    <div className="flex-1 h-1 bg-amber-400 rounded"></div>
                  </div>
                  <span className="text-[9px] text-amber-500 w-12">dxz, dyz</span>
                </div>
                {/* e' (o'rta) */}
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 w-10 text-right">e'</span>
                  <div className="flex-1 flex gap-1">
                    <div className="flex-1 h-1 bg-amber-400 rounded"></div>
                    <div className="flex-1 h-1 bg-amber-400 rounded"></div>
                  </div>
                  <span className="text-[9px] text-amber-500 w-12">dxy, dx²-y²</span>
                </div>
                {/* a1' (eng past) */}
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 w-10 text-right">a₁'</span>
                  <div className="flex-1 flex gap-1">
                    <div className="w-1/2 h-1 bg-amber-400 rounded mx-auto relative">
                      {complex.dOrbital.a1 >= 1 && <span className="absolute -top-2 left-1/3 text-yellow-300 text-[10px]">↑</span>}
                      {complex.dOrbital.a1 >= 2 && <span className="absolute -top-2 right-1/3 text-yellow-300 text-[10px]">↓</span>}
                    </div>
                  </div>
                  <span className="text-[9px] text-amber-500 w-12">dz²</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-800/50 text-[10px] text-amber-400 space-y-1">
                <div>Konfiguratsiya: <span className="text-white font-mono">a₁'^{complex.dOrbital.a1} e'^{complex.dOrbital.e} e''^{complex.dOrbital.e2}</span></div>
                <div>Δ(TPR): <span className="text-yellow-300 font-mono">{complex.dOrbital.deltaTPR.toLocaleString()} cm⁻¹</span></div>
                <div>d-elektronlar: <span className="text-white">d{complex.dElectrons} ({complex.dOrbital.type})</span></div>
                <div className="mt-1 pt-1 border-t border-amber-900/50 text-[9px] italic">
                  ⚠️ TPR'da <strong>a₁' eng past</strong> — bu Oh dan butunlay farqli!
                </div>
              </div>
            </div>
          )}

          {/* COMPARISON PANEL */}
          {!selectedAtom && activePanel === "comparison" && (
            <div className="absolute top-3 right-3 bg-orange-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 shadow-2xl w-[360px] animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <span>⚖️</span> TPR vs Oh
                </h3>
                <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-1 text-[10px]">
                <CompareRow label="Twist θ" tpr="0°" oh="60°" />
                <CompareRow label="Simmetriya" tpr="D₃h" oh="Oh" />
                <CompareRow label="d-orbital lowest" tpr="a₁' (dz²)" oh="t₂g" />
                <CompareRow label="Splitting" tpr="3 levels" oh="2 levels" />
                <CompareRow label="Inversion (i)" tpr="❌ Yo'q" oh="✅ Bor" />
                <CompareRow label="d⁰ misol" tpr="W(CH₃)₆" oh="—" />
                <CompareRow label="d⁶ misol" tpr="—" oh="[Co(NH₃)₆]³⁺" />
                <CompareRow label="Gibridlanish" tpr="sd⁵" oh="d²sp³" />
              </div>
              <div className="mt-2 pt-2 border-t border-purple-800/50 text-[9px] text-purple-300 italic">
                💡 d⁰ kompleksluarda TPR ko'pincha Oh dan barqarorroq (Bailar 1958)
              </div>
            </div>
          )}

          {/* BARCHA BURCHAKLAR */}
          {showAllAngles && !loading && moleculeCount === 1 && (
            <div className="absolute bottom-20 left-3 bg-orange-950/95 backdrop-blur-md rounded-xl p-3 z-20 border border-amber-700/50 shadow-2xl max-w-[260px] animate-slide-in">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-amber-300">📊 Barcha L-M-L burchaklari</h4>
                <button onClick={() => setShowAllAngles(false)} className="text-amber-500 hover:text-white text-sm">×</button>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[9px] max-h-[160px] overflow-y-auto custom-scrollbar">
                {computeAllAngles().map((a, i) => {
                  const v = parseFloat(a.angle)
                  return (
                    <div key={i} className={`px-1 py-0.5 rounded ${
                      v < 80 ? 'bg-cyan-900/50 text-cyan-200' :
                      v > 170 ? 'bg-pink-900/50 text-pink-200' :
                      v > 120 ? 'bg-purple-900/50 text-purple-200' :
                      'bg-amber-900/50 text-amber-200'
                    }`}>
                      <div className="font-mono">{a.angle}°</div>
                      <div className="text-[8px] opacity-70">{a.pair}</div>
                    </div>
                  )
                })}
              </div>
              <div className="text-[8px] text-amber-400 mt-2 italic">
                {twistAngle < 10 ? "Ideal TPR: 76°, 136°, 144° kutiladi" : twistAngle > 50 ? "Antiprizma: 90° va 180° ko'p" : "Oraliq holatda"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="bg-orange-950/90 backdrop-blur-md border-t border-amber-800/50 z-10">
        <div className="flex justify-center gap-3 sm:gap-6 py-3 px-3 sm:px-6 flex-wrap">
          <Stat label="Simmetriya" value={twistAngle < 10 ? "D₃h" : twistAngle > 50 ? "Oh" : "Cv"} mono />
          <Stat label="Twist θ" value={`${twistAngle.toFixed(1)}°`} mono />
          <Stat label="Koord. son" value="6" />
          <Stat label="Gibridlanish" value={complex.hybridization} mono />
          <Stat label={`${complex.center.element}-${complex.ligand.donor}`} value={complex.bondLengthReal} mono />
          <Stat label="Magnit" value={complex.magnetism} />
          <Stat label="d-elektron" value={`d${complex.dElectrons}`} mono />
        </div>

        <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-orange-950/60 border-t border-amber-800/30 flex-wrap text-xs">
          <LegendItem color={`#${complex.center.color.toString(16).padStart(6, '0')}`} label={`${complex.center.element} — ${ATOM_INFO[complex.center.element].name.split(' ')[0]}`} />
          <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, '0')}`} label={`${complex.ligand.donor} — donor`} />
          {complex.ligand.type === "Me" && <LegendItem color="#ffffff" label="H — Vodorod" />}
          {showOuterSphere && complex.outerIon.count > 0 && (
            <LegendItem color={`#${complex.outerIon.color.toString(16).padStart(6, '0')}`} label={`${complex.outerIon.element}${complex.outerIon.charge}`} />
          )}
          {showSolvation && <LegendItem color="#aaaaaa" label="Erituvchi" />}
        </div>

        <div className="text-center py-2 px-4 bg-orange-950/40 border-t border-amber-800/20">
          <p className="text-xs text-amber-500">
            <span className="font-mono text-amber-300">{complex.fullSalt}</span> • {complex.name} • {complex.geometry}
          </p>
        </div>
      </div>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => !pdfGenerating && setPdfModalOpen(false)}>
          <div className="bg-gradient-to-br from-orange-950 to-amber-950 border border-amber-600/50 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><span>📄</span> Ilmiy hisobot</h2>
                <p className="text-xs text-amber-400 mt-1">PDF format • TPR ilmiy maqola uslubi</p>
              </div>
              <button onClick={() => !pdfGenerating && setPdfModalOpen(false)} className="text-amber-400 hover:text-white text-2xl leading-none" disabled={pdfGenerating}>×</button>
            </div>

            <div className="bg-amber-900/40 rounded-lg p-3 mb-4 border border-amber-700/30">
              <div className="text-xs text-amber-300 mb-1">Birikma:</div>
              <div className="text-base font-mono font-bold text-white">{complex.formula}</div>
              <div className="text-[10px] text-amber-400 italic">θ = {twistAngle.toFixed(1)}° • {complex.symmetry}</div>
            </div>

            <h3 className="text-sm font-bold text-amber-300 mb-2">Bo'limlar:</h3>
            <div className="space-y-1 mb-4">
              {[
                { key: "snapshot", label: "🖼️ 3D rasm" },
                { key: "info", label: "📋 Umumiy ma'lumotlar" },
                { key: "geometry", label: "📐 Geometriya" },
                { key: "conditions", label: "🧪 Sharoit" },
                { key: "dorbital", label: "⚛️ TPR d-orbital" },
                { key: "comparison", label: "⚖️ TPR vs Oh solishtirish" },
                { key: "spectra", label: "📡 Spektroskopiya" },
                { key: "references", label: "📚 Adabiyotlar" }
              ].map(s => (
                <label key={s.key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-900/30 hover:bg-amber-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections(prev => ({ ...prev, [s.key]: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                    disabled={pdfGenerating}
                  />
                  <span className="text-sm text-amber-100">{s.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 mb-3">
              <button onClick={() => setPdfSections({ snapshot: true, info: true, conditions: true, geometry: true, dorbital: true, comparison: true, spectra: true, references: true })} disabled={pdfGenerating} className="flex-1 text-xs py-1 bg-amber-800/50 hover:bg-amber-700 rounded text-amber-200">✅ Hammasi</button>
              <button onClick={() => setPdfSections({ snapshot: true, info: true, conditions: false, geometry: false, dorbital: false, comparison: true, spectra: false, references: true })} disabled={pdfGenerating} className="flex-1 text-xs py-1 bg-amber-800/50 hover:bg-amber-700 rounded text-amber-200">⚫ Asosiy</button>
              <button onClick={() => setPdfSections({ snapshot: false, info: false, conditions: false, geometry: false, dorbital: false, comparison: false, spectra: false, references: false })} disabled={pdfGenerating} className="flex-1 text-xs py-1 bg-amber-800/50 hover:bg-amber-700 rounded text-amber-200">⚪ Tozalash</button>
            </div>

            <button
              onClick={generatePDF}
              disabled={pdfGenerating || !Object.values(pdfSections).some(v => v)}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              {pdfGenerating ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>PDF yaratilmoqda...</>
              ) : (
                <><span>📄</span> PDF yaratish va yuklash</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* IQTIBOS MODAL */}
      {citationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setCitationModalOpen(false)}>
          <div className="bg-gradient-to-br from-orange-950 to-amber-950 border border-amber-600/50 rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><span>📚</span> Iqtibos</h2>
              <button onClick={() => setCitationModalOpen(false)} className="text-amber-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="flex gap-2 mb-4">
              {[{ id: "apa", label: "APA" }, { id: "mla", label: "MLA" }, { id: "chicago", label: "Chicago" }, { id: "bibtex", label: "BibTeX" }].map(f => (
                <button key={f.id} onClick={() => setCitationFormat(f.id)} className={`flex-1 py-2 rounded-lg text-sm font-bold ${citationFormat === f.id ? 'bg-amber-600 text-white shadow-lg' : 'bg-amber-900/50 text-amber-300 hover:bg-amber-800'}`}>{f.label}</button>
              ))}
            </div>
            <div className="bg-black/40 rounded-lg p-4 mb-4 border border-amber-700/30">
              <pre className="text-sm text-amber-100 font-mono whitespace-pre-wrap break-words leading-relaxed">{getCitation()}</pre>
            </div>
            <div className="flex gap-2">
              <button onClick={copyCitation} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg flex items-center justify-center gap-2"><span>📋</span> Nusxalash</button>
              <button onClick={() => setCitationModalOpen(false)} className="px-4 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800 text-amber-200">Yopish</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(120, 53, 15, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.8); }
      `}</style>
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
          ? 'bg-amber-700/50 text-white border border-amber-500/50'
          : 'bg-amber-900/40 text-amber-300 hover:bg-amber-800/40 border border-amber-800/30'
      }`}
    >
      <span>{label}</span>
      <span className="text-sm">{isOpen ? "▼" : "▶"}</span>
    </button>
  )
}

function ToggleRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-amber-900/30 px-1 py-1 rounded">
      <span className="text-[11px] text-amber-200">{label}</span>
      <div
        onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-all relative cursor-pointer flex-shrink-0 ${value ? 'bg-amber-500' : 'bg-amber-900'}`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-4' : 'left-0.5'}`}></div>
      </div>
    </label>
  )
}

function InfoRow({ label, value, mono, small }) {
  return (
    <div className="bg-amber-900/50 rounded-lg p-2">
      <p className="text-amber-400 text-[10px] mb-0.5 uppercase">{label}</p>
      <p className={`text-white ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  )
}

function CompareRow({ label, tpr, oh }) {
  return (
    <div className="grid grid-cols-3 gap-1 items-center px-1 py-1 hover:bg-amber-900/30 rounded">
      <span className="text-amber-400">{label}</span>
      <span className="text-orange-300 font-mono text-center bg-orange-900/40 rounded px-1">{tpr}</span>
      <span className="text-blue-300 font-mono text-center bg-blue-900/40 rounded px-1">{oh}</span>
    </div>
  )
}

function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-amber-400 mb-0.5 uppercase">{label}</div>
      <div className={`text-base sm:text-lg font-bold text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full shadow-md border border-white/20" style={{ backgroundColor: color }}></div>
      <span className="text-amber-300">{label}</span>
    </div>
  )
}
