"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (Jmol/IUPAC standarti)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Cu: 0xC88033, Ag: 0xC0C0C0, Au: 0xFFD123, Hg: 0xB8B8D0,
  Pt: 0xD0D0E0, Pd: 0x006985, Ni: 0x50D050, Fe: 0xE06633,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094, P: 0xFF8000, S: 0xFFFF30,
  K: 0x8F40D4, Na: 0xAB5CF2,
  bond: 0x8B9DC3, hbond: 0x66CCFF, dative: 0xFACC15
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKS DATABASE — TRIGONAL-PLANAR (D₃ₕ)
// Kristallografik ma'lumotlar: Cambridge Structural Database (CSD)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CuCN: {
    id: "CuCN", formula: "[Cu(CN)₃]²⁻", fullSalt: "K₂[Cu(CN)₃]·H₂O",
    name: "Kaliy tritsianokuprat(I) monohidrat",
    center: { element: "Cu", color: CPK.Cu, radius: 0.45, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.05, bondLengthReal: "1.935 Å", bondLengthCSD: "1.93–1.96",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp²", magnetism: "Diamagnit (μ_eff = 0)",
    color: "Rangsiz kristall", density: "1.85 g/cm³",
    dConfig: "d¹⁰", dElectrons: 10,
    geometry: "Trigonal-planar", symmetry: "D₃ₕ", bondAngle: 120,
    // Spektroskopik ma'lumotlar
    IR: [
      { freq: 2094, mode: "ν(C≡N) sym A₁'", intensity: "kuchsiz (Raman-faol)" },
      { freq: 2076, mode: "ν(C≡N) asym E'", intensity: "juda kuchli" },
      { freq: 390, mode: "ν(Cu–C) sym A₁'", intensity: "Raman-faol" },
      { freq: 365, mode: "ν(Cu–C) asym E'", intensity: "IR-faol" },
      { freq: 120, mode: "δ(C–Cu–C) E'", intensity: "uzoq IR" }
    ],
    UV: [
      { wl: 240, epsilon: 12500, assignment: "MLCT (Cu 3d → CN π*)" },
      { wl: 210, epsilon: 8300, assignment: "π → π* (CN⁻)" }
    ],
    // Termodinamika
    thermo: { logK1: 5.63, logK2: 10.53, logK3: 13.61, beta3: 4.07e13, dH: -85.2, dS: 45.6 },
    magProps: { chi: -3.4e-6, xM: -75e-6, diamagnetic: true },
    references: ["Bowmaker et al., J. Chem. Soc. Dalton 1997, 4227", "Chadwick, Frankiss, J. Mol. Struct. 1976, 31, 1"]
  },
  HgI: {
    id: "HgI", formula: "[HgI₃]⁻", fullSalt: "K[HgI₃] (Nessler asosi)",
    name: "Kaliy triyodomerkurat(II)",
    center: { element: "Hg", color: CPK.Hg, radius: 0.55, charge: "+2", oxState: 2 },
    ligand: { type: "I", donor: "I", donorColor: CPK.I, donorRadius: 0.42, denticity: 1 },
    bondLength: 2.9, bondLengthReal: "2.724 Å", bondLengthCSD: "2.68–2.75",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp² (+ 5d aralashuvi)", magnetism: "Diamagnit",
    color: "To'q sariq–qizil kristall", density: "5.24 g/cm³",
    dConfig: "d¹⁰", dElectrons: 10,
    geometry: "Trigonal-planar", symmetry: "D₃ₕ (buzilgan C₂ᵥ)", bondAngle: 120,
    IR: [
      { freq: 138, mode: "ν(Hg–I) sym A₁'", intensity: "Raman-faol (kuchli)" },
      { freq: 122, mode: "ν(Hg–I) asym E'", intensity: "IR + Raman" },
      { freq: 44, mode: "δ(I–Hg–I) E'", intensity: "uzoq IR" }
    ],
    UV: [
      { wl: 323, epsilon: 6800, assignment: "LMCT (I 5p → Hg 6s)" },
      { wl: 285, epsilon: 4500, assignment: "LMCT" },
      { wl: 210, epsilon: 15000, assignment: "π → π*" }
    ],
    thermo: { logK1: 12.87, logK2: 23.82, logK3: 27.60, beta3: 4.0e27, dH: -142, dS: 78 },
    magProps: { chi: -4.7e-6, xM: -180e-6, diamagnetic: true },
    references: ["Persson et al., Inorg. Chem. 2002, 41, 3820", "Sandström, Persson, J. Chem. Soc. Dalton 1978, 1794"]
  },
  PtPPh3: {
    id: "PtPPh3", formula: "[Pt(PPh₃)₃]", fullSalt: "Tris(trifenilfosfin)platina(0)",
    name: "[Pt(PPh₃)₃] — Malatesta kompleksi",
    center: { element: "Pt", color: CPK.Pt, radius: 0.50, charge: "0", oxState: 0 },
    ligand: { type: "PPh3", donor: "P", donorColor: CPK.P, donorRadius: 0.38, denticity: 1 },
    bondLength: 2.45, bondLengthReal: "2.263 Å", bondLengthCSD: "2.25–2.28",
    outerIon: null,
    hybridization: "sp² (dₓᵧ + dₓ²₋ᵧ² aralashuvli)", magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall", density: "1.68 g/cm³",
    dConfig: "d¹⁰", dElectrons: 10,
    geometry: "Trigonal-planar", symmetry: "D₃ (approx. D₃ₕ)", bondAngle: 120,
    IR: [
      { freq: 1094, mode: "ν(P–C) fenil", intensity: "kuchli" },
      { freq: 745, mode: "δ(C–H) tekislikdan tashqari", intensity: "juda kuchli" },
      { freq: 517, mode: "δ(P–Pt–P) sym", intensity: "o'rta" },
      { freq: 197, mode: "ν(Pt–P) sym A₁'", intensity: "Raman-faol" },
      { freq: 175, mode: "ν(Pt–P) asym E'", intensity: "IR-faol" }
    ],
    UV: [
      { wl: 385, epsilon: 3200, assignment: "d(Pt) → π*(PPh₃) MLCT" },
      { wl: 305, epsilon: 8700, assignment: "d–d + MLCT" },
      { wl: 254, epsilon: 22000, assignment: "π → π* (fenil)" }
    ],
    thermo: { logK: 24.5, beta3: 3.2e24, dH: -186, dS: -32, note: "Havoda barqaror emas" },
    magProps: { chi: -6.2e-6, xM: -340e-6, diamagnetic: true },
    references: ["Ugo, Cariati, La Monica, Inorg. Synth. 1968, 11, 105", "Albinati et al., Inorg. Chim. Acta 1990, 168, 213"]
  },
  AgCN: {
    id: "AgCN", formula: "[Ag(CN)₃]²⁻", fullSalt: "K₂[Ag(CN)₃]",
    name: "Kaliy tritsianoargentat(I)",
    center: { element: "Ag", color: CPK.Ag, radius: 0.48, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.25, bondLengthReal: "2.135 Å", bondLengthCSD: "2.11–2.16",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp² (5d aralashuvli)", magnetism: "Diamagnit",
    color: "Rangsiz kristall", density: "2.36 g/cm³",
    dConfig: "d¹⁰", dElectrons: 10,
    geometry: "Trigonal-planar", symmetry: "D₃ₕ", bondAngle: 120,
    IR: [
      { freq: 2140, mode: "ν(C≡N) sym A₁'", intensity: "Raman-faol" },
      { freq: 2105, mode: "ν(C≡N) asym E'", intensity: "juda kuchli IR" },
      { freq: 360, mode: "ν(Ag–C) sym A₁'", intensity: "Raman-faol" },
      { freq: 310, mode: "ν(Ag–C) asym E'", intensity: "IR-faol" }
    ],
    UV: [
      { wl: 234, epsilon: 14200, assignment: "MLCT (Ag 4d → CN π*)" },
      { wl: 209, epsilon: 9500, assignment: "π → π* (CN⁻)" }
    ],
    thermo: { logK1: 5.30, logK2: 10.98, logK3: 21.7, beta3: 5.0e21, dH: -95.8, dS: 52.3 },
    magProps: { chi: -3.9e-6, xM: -103e-6, diamagnetic: true },
    references: ["Bowmaker, Kennedy, Reid, Inorg. Chem. 1998, 37, 3968"]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI (kengaytirilgan)
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.546 u", config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+1", role: "Markaziy ion", color: "#C88033",
    en: 1.90, ionRadius: "0.77 Å (CN=3)", firstIE: "745.5 kJ/mol", discovered: "Qadimgi (Kipr, ~9000 y.b.)" },
  Ag: { name: "Kumush (Ag)", atomic: 47, mass: "107.868 u", config: "[Kr] 4d¹⁰ 5s¹", oxidation: "+1", role: "Markaziy ion", color: "#C0C0C0",
    en: 1.93, ionRadius: "1.00 Å (CN=3)", firstIE: "731.0 kJ/mol", discovered: "Qadimgi (~5000 y.b.)" },
  Hg: { name: "Simob (Hg)", atomic: 80, mass: "200.592 u", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", oxidation: "+2", role: "Markaziy ion", color: "#B8B8D0",
    en: 2.00, ionRadius: "0.97 Å (CN=3)", firstIE: "1007 kJ/mol", discovered: "Qadimgi (Xitoy, ~1500 e.a.)" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.084 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "0", role: "Markaziy atom (nol)", color: "#D0D0E0",
    en: 2.28, ionRadius: "1.30 Å (kov.)", firstIE: "870 kJ/mol", discovered: "Antonio de Ulloa, 1735" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.007 u", config: "[He] 2s² 2p³", role: "CN⁻ ning ikkinchi atomi", hybridization: "sp", color: "#3050F8",
    en: 3.04, covRadius: "0.71 Å", firstIE: "1402 kJ/mol" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.011 u", config: "[He] 2s² 2p²", role: "CN⁻ donor atomi (σ + π*)", hybridization: "sp", color: "#909090",
    en: 2.55, covRadius: "0.76 Å", firstIE: "1086 kJ/mol" },
  P:  { name: "Fosfor (P)", atomic: 15, mass: "30.974 u", config: "[Ne] 3s² 3p³", role: "PPh₃ donor atomi (σ + π*)", hybridization: "sp³", color: "#FF8000",
    en: 2.19, covRadius: "1.07 Å", firstIE: "1011 kJ/mol" },
  I:  { name: "Yod (I⁻)", atomic: 53, mass: "126.904 u", config: "[Kr] 4d¹⁰ 5s² 5p⁶", charge: "-1", role: "Halogenid ligand (π-donor)", color: "#940094",
    en: 2.66, ionRadius: "2.20 Å", firstIE: "1008 kJ/mol" },
  K:  { name: "Kaliy (K⁺)", atomic: 19, mass: "39.098 u", config: "[Ar]", charge: "+1", role: "Tashqi sfera kation", color: "#8F40D4",
    en: 0.82, ionRadius: "1.38 Å", firstIE: "418.8 kJ/mol" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Fenil halqasi tarkibi", color: "#FFFFFF",
    en: 2.20, covRadius: "0.31 Å" }
}

// ═══════════════════════════════════════════════════════════════════════════
// SPEKTROKIMYOVIY QATOR (ligand maydonining kuchi)
// ═══════════════════════════════════════════════════════════════════════════
const SPECTROCHEMICAL_SERIES = [
  { l: "I⁻", strength: 0.42, type: "π-donor" },
  { l: "Br⁻", strength: 0.48, type: "π-donor" },
  { l: "Cl⁻", strength: 0.53, type: "π-donor" },
  { l: "F⁻", strength: 0.63, type: "π-donor" },
  { l: "H₂O", strength: 0.70, type: "kuchsiz π-donor" },
  { l: "NH₃", strength: 0.90, type: "faqat σ-donor" },
  { l: "en", strength: 0.93, type: "σ-donor" },
  { l: "PPh₃", strength: 1.15, type: "σ-donor + π-akseptor" },
  { l: "CN⁻", strength: 1.50, type: "π-akseptor (kuchli)" },
  { l: "CO", strength: 1.55, type: "π-akseptor (kuchli)" }
]

// ═══════════════════════════════════════════════════════════════════════════
// D₃ₕ NUQTA GURUHI XARAKTER JADVALI
// ═══════════════════════════════════════════════════════════════════════════
const D3H_CHARACTER_TABLE = {
  order: 12,
  operations: ["E", "2C₃", "3C₂", "σₕ", "2S₃", "3σᵥ"],
  reps: [
    { name: "A₁'", chars: [1, 1, 1, 1, 1, 1], linear: "—", quadratic: "x²+y², z²" },
    { name: "A₂'", chars: [1, 1, -1, 1, 1, -1], linear: "Rz", quadratic: "—" },
    { name: "E'", chars: [2, -1, 0, 2, -1, 0], linear: "(x,y)", quadratic: "(x²−y², xy)" },
    { name: "A₁\"", chars: [1, 1, 1, -1, -1, -1], linear: "—", quadratic: "—" },
    { name: "A₂\"", chars: [1, 1, -1, -1, -1, 1], linear: "z", quadratic: "—" },
    { name: "E\"", chars: [2, -1, 0, -2, 1, 0], linear: "(Rx,Ry)", quadratic: "(xz, yz)" }
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI: matn tozalash
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => String(str || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()

// ═══════════════════════════════════════════════════════════════════════════
// 3D SPRITE MATNI
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const { fontSize = 64, fontFamily = "Arial, sans-serif", color = "#ffffff",
    bgColor = "rgba(20, 10, 40, 0.85)", borderColor = "#a78bfa", padding = 16, scale = 0.5 } = options
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const w = ctx.measureText(text).width
  canvas.width = w + padding * 2
  canvas.height = fontSize + padding * 2
  ctx.fillStyle = bgColor; ctx.strokeStyle = borderColor; ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath()
  ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGONAL POZITSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
function getTrigonalPositions(bondLength) {
  const positions = []
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI / 3) - Math.PI / 2
    positions.push(new THREE.Vector3(bondLength * Math.cos(angle), 0, bondLength * Math.sin(angle)))
  }
  return positions
}

function getEnsemblePositions(count, mode) {
  const positions = []
  if (count === 1) { positions.push(new THREE.Vector3(0, 0, 0)); return positions }
  if (mode === "crystal") {
    const n = count === 8 ? 2 : 3
    const spacing = 6.5
    const offset = (n - 1) * spacing / 2
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
      positions.push(new THREE.Vector3(i * spacing - offset, j * spacing - offset, k * spacing - offset))
    }
  } else {
    const radius = count === 8 ? 5.5 : 8.5
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = radius * (0.6 + ((i * 9301 + 49297) % 233280) / 233280 * 0.4)
      positions.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)))
    }
  }
  return positions
}

// ═══════════════════════════════════════════════════════════════════════════
// ORBITAL SHAKLLARI — sp², dz², dx²-y² vizualizatsiyasi uchun
// ═══════════════════════════════════════════════════════════════════════════
function makeSp2Lobe(direction, size = 1.2) {
  const geo = new THREE.SphereGeometry(0.35, 32, 32)
  geo.scale(1, 2.5, 1)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, transparent: true, opacity: 0.35,
    emissive: 0xf59e0b, emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(geo, mat)
  const dir = direction.clone().normalize()
  mesh.position.copy(dir.clone().multiplyScalar(size * 0.5))
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  return mesh
}

function makePzOrbital() {
  const group = new THREE.Group()
  for (let sign of [1, -1]) {
    const geo = new THREE.SphereGeometry(0.4, 32, 32)
    geo.scale(1, 2.2, 1)
    const mat = new THREE.MeshStandardMaterial({
      color: sign > 0 ? 0x60a5fa : 0xf472b6,
      transparent: true, opacity: 0.35,
      emissive: sign > 0 ? 0x3b82f6 : 0xec4899,
      emissiveIntensity: 0.25
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.y = sign * 0.55
    group.add(mesh)
  }
  return group
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Uchburchak3D() {
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
  const ligandAtomsRef = useRef([])
  const solventMoleculesRef = useRef([])
  const moleculeGroupsRef = useRef([])
  const ligandGroupsRef = useRef([])
  const symmetryHelpersRef = useRef([])
  const angleArcsRef = useRef([])
  const planeHelperRef = useRef(null)
  const orbitalsRef = useRef([])
  const electronsRef = useRef([])

  // UI State
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentComplex, setCurrentComplex] = useState("CuCN")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [showPlane, setShowPlane] = useState(false)
  const [showOrbitals, setShowOrbitals] = useState(false)
  const [orbitalType, setOrbitalType] = useState("sp2")
  const [viewMode, setViewMode] = useState("ball-stick")
  const [showAllAngles, setShowAllAngles] = useState(false)
  const [showElectronFlow, setShowElectronFlow] = useState(false)

  const [activePanel, setActivePanel] = useState(null)
  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal")

  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C3")
  const [animateSymmetry, setAnimateSymmetry] = useState(false)

  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch")
  const [vibrationAmp, setVibrationAmp] = useState(0.15)

  const [showTemperature, setShowTemperature] = useState(false)
  const [temperature, setTemperature] = useState(298)
  const [showPressure, setShowPressure] = useState(false)
  const [pressure, setPressure] = useState(1)

  const [showSolvation, setShowSolvation] = useState(false)
  const [solventType, setSolventType] = useState("water")
  const [solvationDensity, setSolvationDensity] = useState(15)

  const [jahnTellerActive, setJahnTellerActive] = useState(false)
  const [distortionType, setDistortionType] = useState("Y")

  // Panel drag
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfExporting, setPdfExporting] = useState(false)

  const complex = COMPLEXES[currentComplex]

  // Panel drag handlers
  const handlePanelDragStart = useCallback((cx, cy) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: cx - rect.left, y: cy - rect.top }
    setIsPanelDragging(true)
  }, [])

  const handlePanelDragMove = useCallback((cx, cy) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = cx - cRect.left - dragOffsetRef.current.x
    let ny = cy - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
    setPanelPos({ x: nx, y: ny })
  }, [])

  const handlePanelDragEnd = useCallback(() => setIsPanelDragging(false), [])

  useEffect(() => {
    if (!isPanelDragging) return
    const mm = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const mu = () => handlePanelDragEnd()
    const tm = (e) => { if (e.touches.length > 0) { e.preventDefault(); handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY) } }
    const te = () => handlePanelDragEnd()
    window.addEventListener("mousemove", mm); window.addEventListener("mouseup", mu)
    window.addEventListener("touchmove", tm, { passive: false }); window.addEventListener("touchend", te)
    const pc = document.body.style.cursor, ps = document.body.style.userSelect
    document.body.style.cursor = "grabbing"; document.body.style.userSelect = "none"
    return () => {
      window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu)
      window.removeEventListener("touchmove", tm); window.removeEventListener("touchend", te)
      document.body.style.cursor = pc; document.body.style.userSelect = ps
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  // ═══════════════════════════════════════════════════════════
  // BOND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.09, opacity = 0.8, dative = false) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 20)
    const material = new THREE.MeshStandardMaterial({
      color: dative ? CPK.dative : color, roughness: 0.35, metalness: 0.3,
      transparent: true, opacity,
      emissive: dative ? 0xf59e0b : 0x000000, emissiveIntensity: dative ? 0.15 : 0
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    bond.userData = { type: 'bond', dative }
    parent.add(bond)
    bondsRef.current.push(bond)
    return bond
  }, [])

  // ═══════════════════════════════════════════════════════════
  // LIGANDLAR
  // ═══════════════════════════════════════════════════════════
  const createCNLigand = useCallback((parent, cPos, mPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'CN', donorPos: cPos.clone() }
    const cGeo = new THREE.SphereGeometry(0.27, 48, 48)
    const cMat = new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.35, metalness: 0.15, emissive: CPK.C, emissiveIntensity: 0.05 })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, isDonor: true }
    cMesh.castShadow = true
    group.add(cMesh); atomsRef.current.push(cMesh); ligandAtomsRef.current.push(cMesh)
    const cLabel = makeTextSprite("C", { color: "#e5e7eb", scale: 0.32 })
    cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(cLabel); labelsRef.current.push(cLabel)
    const outDir = new THREE.Vector3().subVectors(cPos, mPos).normalize()
    const nPos = cPos.clone().add(outDir.clone().multiplyScalar(1.16))
    const nGeo = new THREE.SphereGeometry(0.24, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.35, metalness: 0.15 })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N }
    group.add(nMesh); atomsRef.current.push(nMesh)
    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.3 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.35, 0))
    group.add(nLabel); labelsRef.current.push(nLabel)
    // C≡N uch bog' (2 chiziq)
    for (let off of [-0.05, 0.05]) {
      const perp = new THREE.Vector3(off, 0, 0)
      const s2 = cPos.clone().add(perp), e2 = nPos.clone().add(perp)
      const bg = new THREE.CylinderGeometry(0.04, 0.04, s2.distanceTo(e2), 12)
      const bm = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.5 })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(new THREE.Vector3().addVectors(s2, e2).multiplyScalar(0.5))
      b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(e2, s2).normalize())
      group.add(b)
    }
    // markaziy chiziq
    createBond(group, cPos, nPos, 0xaaaaaa, 0.05, 0.85)
    parent.add(group); ligandGroupsRef.current.push(group)
    return group
  }, [createBond])

  const createHalogenLigand = useCallback((parent, pos, element, color, radius) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: element, donorPos: pos.clone() }
    const geo = new THREE.SphereGeometry(radius, 48, 48)
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.25, emissive: color, emissiveIntensity: 0.1 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = { type: 'atom', element, info: ATOM_INFO[element], isDonor: true }
    mesh.castShadow = true
    group.add(mesh); atomsRef.current.push(mesh); ligandAtomsRef.current.push(mesh)
    const label = makeTextSprite(element + "⁻", { color: "#f5d0fe", scale: 0.36 })
    label.position.copy(pos).add(new THREE.Vector3(0, radius + 0.35, 0))
    group.add(label); labelsRef.current.push(label)
    parent.add(group); ligandGroupsRef.current.push(group)
    return group
  }, [])

  const createPPh3Ligand = useCallback((parent, pPos, mPos) => {
    const group = new THREE.Group()
    group.userData = { type: 'ligand', ligandType: 'PPh3', donorPos: pPos.clone() }
    const pGeo = new THREE.SphereGeometry(0.38, 48, 48)
    const pMat = new THREE.MeshStandardMaterial({ color: CPK.P, roughness: 0.35, metalness: 0.15, emissive: CPK.P, emissiveIntensity: 0.08 })
    const pMesh = new THREE.Mesh(pGeo, pMat)
    pMesh.position.copy(pPos)
    pMesh.userData = { type: 'atom', element: 'P', info: ATOM_INFO.P, isDonor: true }
    pMesh.castShadow = true
    group.add(pMesh); atomsRef.current.push(pMesh); ligandAtomsRef.current.push(pMesh)
    const pLabel = makeTextSprite("P", { color: "#fed7aa", scale: 0.36 })
    pLabel.position.copy(pPos).add(new THREE.Vector3(0, 0.5, 0))
    group.add(pLabel); labelsRef.current.push(pLabel)
    const outDir = new THREE.Vector3().subVectors(pPos, mPos).normalize()
    let perp = new THREE.Vector3()
    if (Math.abs(outDir.y) < 0.9) perp.crossVectors(outDir, new THREE.Vector3(0, 1, 0)).normalize()
    else perp.crossVectors(outDir, new THREE.Vector3(1, 0, 0)).normalize()
    const perp2 = new THREE.Vector3().crossVectors(outDir, perp).normalize()
    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3)
      const dir = new THREE.Vector3()
        .addScaledVector(outDir, 0.55).addScaledVector(perp, Math.cos(phi) * 0.85).addScaledVector(perp2, Math.sin(phi) * 0.85).normalize()
      const phPos = pPos.clone().add(dir.multiplyScalar(1.5))
      // Fenil halqasi — torus (aromatik)
      const rGeo = new THREE.TorusGeometry(0.5, 0.15, 16, 32)
      const rMat = new THREE.MeshStandardMaterial({ color: 0x606060, roughness: 0.5, metalness: 0.15, transparent: true, opacity: 0.85 })
      const rMesh = new THREE.Mesh(rGeo, rMat)
      rMesh.position.copy(phPos)
      const rDir = new THREE.Vector3().subVectors(phPos, pPos).normalize()
      rMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), rDir)
      rMesh.userData = { type: 'atom', element: 'C', info: { ...ATOM_INFO.C, name: "Fenil halqasi (C₆H₅)", role: "Aromatik ligand qismi" } }
      group.add(rMesh); atomsRef.current.push(rMesh)
      createBond(group, pPos, phPos, 0x777777, 0.05, 0.6)
    }
    parent.add(group); ligandGroupsRef.current.push(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // BITTA MOLEKULA QURISH
  // ═══════════════════════════════════════════════════════════
  const buildMolecule = useCallback((parent, center) => {
    const group = new THREE.Group()
    group.position.copy(center)
    parent.add(group); moleculeGroupsRef.current.push(group)
    const mGeo = new THREE.SphereGeometry(complex.center.radius, 64, 64)
    const mMat = new THREE.MeshStandardMaterial({ color: complex.center.color, roughness: 0.28, metalness: 0.55, emissive: complex.center.color, emissiveIntensity: 0.18 })
    const mMesh = new THREE.Mesh(mGeo, mMat)
    mMesh.userData = { type: 'atom', element: complex.center.element, info: ATOM_INFO[complex.center.element], isCenter: true }
    mMesh.castShadow = true
    group.add(mMesh); atomsRef.current.push(mMesh)
    const mLabel = makeTextSprite(complex.center.element + complex.center.charge, { color: "#fef08a", scale: 0.5, borderColor: "#facc15" })
    mLabel.position.set(0, complex.center.radius + 0.5, 0)
    group.add(mLabel); labelsRef.current.push(mLabel)
    const donorPositions = getTrigonalPositions(complex.bondLength)
    donorPositions.forEach(pos => {
      createBond(group, new THREE.Vector3(0, 0, 0), pos, CPK.bond, 0.09, 0.82, true)
      if (complex.ligand.type === "CN") createCNLigand(group, pos, new THREE.Vector3(0, 0, 0))
      else if (complex.ligand.type === "I") createHalogenLigand(group, pos, "I", CPK.I, 0.42)
      else if (complex.ligand.type === "PPh3") createPPh3Ligand(group, pos, new THREE.Vector3(0, 0, 0))
    })
    return group
  }, [complex, createBond, createCNLigand, createHalogenLigand, createPPh3Ligand])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA
  // ═══════════════════════════════════════════════════════════
  const buildOuterSphere = useCallback((parent) => {
    if (!complex.outerIon) return
    const count = complex.outerIon.count, radius = 5.8
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI / count)
      const pos = new THREE.Vector3(radius * Math.cos(angle), Math.sin(i * 1.7) * 0.6, radius * Math.sin(angle))
      const geo = new THREE.SphereGeometry(complex.outerIon.radius, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color: complex.outerIon.color, roughness: 0.4, metalness: 0.3, emissive: complex.outerIon.color, emissiveIntensity: 0.12, transparent: true, opacity: 0.92 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos)
      mesh.userData = { type: 'atom', element: complex.outerIon.element, info: ATOM_INFO[complex.outerIon.element], isOuter: true }
      parent.add(mesh); outerSphereRef.current.push(mesh); atomsRef.current.push(mesh)
      const label = makeTextSprite(`${complex.outerIon.element}${complex.outerIon.charge}`, { color: "#e9d5ff", scale: 0.42 })
      label.position.copy(pos).add(new THREE.Vector3(0, complex.outerIon.radius + 0.4, 0))
      parent.add(label); labelsRef.current.push(label)
    }
  }, [complex])

  // ═══════════════════════════════════════════════════════════
  // BOND UZUNLIK / BURCHAK / TEKISLIK
  // ═══════════════════════════════════════════════════════════
  const buildBondLabels = useCallback((parent) => {
    bondLabelsRef.current.forEach(l => l.parent && l.parent.remove(l))
    bondLabelsRef.current = []
    if (!showBondLengths || !moleculeGroupsRef.current[0]) return
    const donorPositions = getTrigonalPositions(complex.bondLength)
    donorPositions.forEach(pos => {
      const mid = pos.clone().multiplyScalar(0.5)
      const label = makeTextSprite(complex.bondLengthReal, { color: "#fef3c7", scale: 0.3, bgColor: "rgba(30, 20, 60, 0.92)" })
      label.position.copy(mid).add(new THREE.Vector3(0, 0.35, 0))
      moleculeGroupsRef.current[0].add(label)
      bondLabelsRef.current.push(label)
    })
  }, [complex, showBondLengths])

  const buildAngleArcs = useCallback(() => {
    angleArcsRef.current.forEach(a => a.parent && a.parent.remove(a))
    angleArcsRef.current = []
    if (!showAllAngles || !moleculeGroupsRef.current[0]) return
    const g = moleculeGroupsRef.current[0], r = 0.9
    for (let i = 0; i < 3; i++) {
      const a1 = (i * 2 * Math.PI / 3) - Math.PI / 2
      const a2 = ((i + 1) * 2 * Math.PI / 3) - Math.PI / 2
      const curve = new THREE.EllipseCurve(0, 0, r, r, a1, a2, false, 0)
      const points = curve.getPoints(48).map(p => new THREE.Vector3(p.x, 0, p.y))
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2 })
      const line = new THREE.Line(geo, mat)
      g.add(line); angleArcsRef.current.push(line)
      const midA = (a1 + a2) / 2
      const label = makeTextSprite("120°", { color: "#fde047", scale: 0.3, bgColor: "rgba(120, 53, 15, 0.9)", borderColor: "#f59e0b" })
      label.position.set((r + 0.35) * Math.cos(midA), 0, (r + 0.35) * Math.sin(midA))
      g.add(label); angleArcsRef.current.push(label)
    }
  }, [showAllAngles])

  const buildPlane = useCallback(() => {
    if (planeHelperRef.current && planeHelperRef.current.parent) planeHelperRef.current.parent.remove(planeHelperRef.current)
    planeHelperRef.current = null
    if (!showPlane || !moleculeGroupsRef.current[0]) return
    const geo = new THREE.CircleGeometry(complex.bondLength + 1.2, 64)
    const mat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })
    const plane = new THREE.Mesh(geo, mat)
    plane.rotation.x = Math.PI / 2
    moleculeGroupsRef.current[0].add(plane)
    planeHelperRef.current = plane
  }, [complex, showPlane])

  // ═══════════════════════════════════════════════════════════
  // SIMMETRIYA ELEMENTLARI (D₃ₕ)
  // ═══════════════════════════════════════════════════════════
  const buildSymmetry = useCallback(() => {
    symmetryHelpersRef.current.forEach(h => h.parent && h.parent.remove(h))
    symmetryHelpersRef.current = []
    if (!showSymmetry || !moleculeGroupsRef.current[0]) return
    const g = moleculeGroupsRef.current[0]

    if (symmetryElement === "C3") {
      const geo = new THREE.CylinderGeometry(0.035, 0.035, complex.bondLength * 3.2, 20)
      const mat = new THREE.MeshBasicMaterial({ color: 0xf472b6 })
      const axis = new THREE.Mesh(geo, mat)
      g.add(axis); symmetryHelpersRef.current.push(axis)
      // Yuqoridagi konus (yo'nalish)
      const cGeo = new THREE.ConeGeometry(0.15, 0.35, 16)
      const cMesh = new THREE.Mesh(cGeo, mat)
      cMesh.position.y = complex.bondLength * 1.6
      g.add(cMesh); symmetryHelpersRef.current.push(cMesh)
      const label = makeTextSprite("C₃ (asosiy o'q)", { color: "#fbcfe8", scale: 0.4, borderColor: "#ec4899" })
      label.position.set(0.5, complex.bondLength * 1.8, 0)
      g.add(label); symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "C2") {
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * Math.PI / 3) - Math.PI / 2
        const geo = new THREE.CylinderGeometry(0.03, 0.03, complex.bondLength * 2.6, 20)
        const mat = new THREE.MeshBasicMaterial({ color: 0x34d399 })
        const axis = new THREE.Mesh(geo, mat)
        axis.rotation.z = Math.PI / 2; axis.rotation.y = -a
        g.add(axis); symmetryHelpersRef.current.push(axis)
      }
      const label = makeTextSprite("3C₂ (⊥ o'qlar)", { color: "#a7f3d0", scale: 0.38, borderColor: "#10b981" })
      label.position.set(complex.bondLength * 1.5, 0.4, 0)
      g.add(label); symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_h") {
      const geo = new THREE.CircleGeometry(complex.bondLength + 0.8, 64)
      const mat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false })
      const plane = new THREE.Mesh(geo, mat); plane.rotation.x = Math.PI / 2
      g.add(plane); symmetryHelpersRef.current.push(plane)
      const label = makeTextSprite("σₕ (gorizontal)", { color: "#bfdbfe", scale: 0.42, borderColor: "#3b82f6" })
      label.position.set(complex.bondLength + 0.5, 0, 0)
      g.add(label); symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_v") {
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * Math.PI / 3) - Math.PI / 2
        const geo = new THREE.PlaneGeometry(complex.bondLength * 2.6, complex.bondLength * 2.6)
        const mat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false })
        const plane = new THREE.Mesh(geo, mat); plane.rotation.y = -a
        g.add(plane); symmetryHelpersRef.current.push(plane)
      }
      const label = makeTextSprite("3σᵥ (vertikal)", { color: "#fde68a", scale: 0.42, borderColor: "#f59e0b" })
      label.position.set(0, complex.bondLength + 0.5, 0)
      g.add(label); symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "S3") {
      const geo = new THREE.CylinderGeometry(0.035, 0.035, complex.bondLength * 3.2, 20)
      const mat = new THREE.MeshBasicMaterial({ color: 0xa78bfa })
      const axis = new THREE.Mesh(geo, mat)
      g.add(axis); symmetryHelpersRef.current.push(axis)
      const label = makeTextSprite("S₃ (aylanish-akslanish)", { color: "#ddd6fe", scale: 0.42, borderColor: "#8b5cf6" })
      label.position.set(0.5, complex.bondLength * 1.7, 0)
      g.add(label); symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "all") {
      // Barcha elementlar birga
      const c3g = new THREE.CylinderGeometry(0.03, 0.03, complex.bondLength * 3, 16)
      const c3 = new THREE.Mesh(c3g, new THREE.MeshBasicMaterial({ color: 0xf472b6 }))
      g.add(c3); symmetryHelpersRef.current.push(c3)
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * Math.PI / 3) - Math.PI / 2
        const cg = new THREE.CylinderGeometry(0.022, 0.022, complex.bondLength * 2.4, 16)
        const cm = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: 0x34d399 }))
        cm.rotation.z = Math.PI / 2; cm.rotation.y = -a
        g.add(cm); symmetryHelpersRef.current.push(cm)
      }
      const shg = new THREE.CircleGeometry(complex.bondLength + 0.5, 64)
      const sh = new THREE.Mesh(shg, new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false }))
      sh.rotation.x = Math.PI / 2
      g.add(sh); symmetryHelpersRef.current.push(sh)
    }
  }, [showSymmetry, symmetryElement, complex])

  // ═══════════════════════════════════════════════════════════
  // ORBITAL VIZUALIZATSIYA (sp², pz, dz²)
  // ═══════════════════════════════════════════════════════════
  const buildOrbitals = useCallback(() => {
    orbitalsRef.current.forEach(o => o.parent && o.parent.remove(o))
    orbitalsRef.current = []
    if (!showOrbitals || !moleculeGroupsRef.current[0]) return
    const g = moleculeGroupsRef.current[0]

    if (orbitalType === "sp2") {
      const donorPositions = getTrigonalPositions(complex.bondLength * 0.55)
      donorPositions.forEach(dir => {
        const lobe = makeSp2Lobe(dir, complex.bondLength * 0.8)
        g.add(lobe); orbitalsRef.current.push(lobe)
      })
      const label = makeTextSprite("3 × sp² (120°)", { color: "#fde047", scale: 0.4, borderColor: "#f59e0b" })
      label.position.set(0, -complex.bondLength - 0.3, 0)
      g.add(label); orbitalsRef.current.push(label)
    } else if (orbitalType === "pz") {
      const pz = makePzOrbital()
      g.add(pz); orbitalsRef.current.push(pz)
      const label = makeTextSprite("pz (perpendikulyar, π-uchun)", { color: "#bfdbfe", scale: 0.38, borderColor: "#3b82f6" })
      label.position.set(0, 1.5, 0)
      g.add(label); orbitalsRef.current.push(label)
    } else if (orbitalType === "dz2") {
      // dz² torus + 2 lobe
      const torusGeo = new THREE.TorusGeometry(0.7, 0.15, 16, 48)
      const mat = new THREE.MeshStandardMaterial({ color: 0xf472b6, transparent: true, opacity: 0.4, emissive: 0xec4899, emissiveIntensity: 0.2 })
      const torus = new THREE.Mesh(torusGeo, mat)
      torus.rotation.x = Math.PI / 2
      g.add(torus); orbitalsRef.current.push(torus)
      for (let sign of [1, -1]) {
        const lobeGeo = new THREE.SphereGeometry(0.35, 32, 32)
        lobeGeo.scale(1, 1.8, 1)
        const lm = new THREE.MeshStandardMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.4, emissive: 0x8b5cf6, emissiveIntensity: 0.2 })
        const lobe = new THREE.Mesh(lobeGeo, lm)
        lobe.position.y = sign * 0.7
        g.add(lobe); orbitalsRef.current.push(lobe)
      }
      const label = makeTextSprite("dz² (a₁')", { color: "#f5d0fe", scale: 0.4, borderColor: "#c084fc" })
      label.position.set(1.4, 0, 0)
      g.add(label); orbitalsRef.current.push(label)
    } else if (orbitalType === "dxy_x2y2") {
      // dxy va dx²-y² (e' juftlik)
      for (let rot of [0, Math.PI / 4]) {
        for (let angleIdx = 0; angleIdx < 4; angleIdx++) {
          const a = angleIdx * Math.PI / 2 + rot
          const lobeGeo = new THREE.SphereGeometry(0.28, 24, 24)
          lobeGeo.scale(1.6, 1, 1)
          const lm = new THREE.MeshStandardMaterial({
            color: rot === 0 ? 0xfbbf24 : 0x34d399, transparent: true, opacity: 0.35,
            emissive: rot === 0 ? 0xf59e0b : 0x10b981, emissiveIntensity: 0.2
          })
          const lobe = new THREE.Mesh(lobeGeo, lm)
          lobe.position.set(0.7 * Math.cos(a), 0, 0.7 * Math.sin(a))
          lobe.rotation.y = -a
          g.add(lobe); orbitalsRef.current.push(lobe)
        }
      }
      const label = makeTextSprite("dxy + dx²-y² (e')", { color: "#fde68a", scale: 0.4, borderColor: "#facc15" })
      label.position.set(0, 1.5, 0)
      g.add(label); orbitalsRef.current.push(label)
    }
  }, [showOrbitals, orbitalType, complex])

  // ═══════════════════════════════════════════════════════════
  // SOLVATATSIYA
  // ═══════════════════════════════════════════════════════════
  const buildSolvation = useCallback((parent) => {
    solventMoleculesRef.current.forEach(m => parent.remove(m))
    solventMoleculesRef.current = []
    if (!showSolvation) return
    for (let i = 0; i < solvationDensity; i++) {
      const r = 4.5 + Math.random() * 3.5
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const pos = new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
      const g = new THREE.Group()
      g.position.copy(pos)
      const solventColors = { water: CPK.O, nh3: CPK.N, methanol: CPK.O, dmso: CPK.S }
      const oGeo = new THREE.SphereGeometry(0.2, 24, 24)
      const oMat = new THREE.MeshStandardMaterial({ color: solventColors[solventType] || CPK.O, transparent: true, opacity: 0.65, roughness: 0.4 })
      g.add(new THREE.Mesh(oGeo, oMat))
      const nHs = solventType === "nh3" ? 3 : 2
      for (let j = 0; j < nHs; j++) {
        const a = (j / nHs) * Math.PI * 2 + Math.random() * 0.3
        const hPos = new THREE.Vector3(Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0)
        const hM = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }))
        hM.position.copy(hPos)
        g.add(hM)
      }
      parent.add(g); solventMoleculesRef.current.push(g)
    }
  }, [showSolvation, solvationDensity, solventType])

  // ═══════════════════════════════════════════════════════════
  // 3D SAHNA
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050214)
    sceneRef.current = scene

    // Yulduzli fon
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1000
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i*3] = (Math.random()-0.5)*250; starPos[i*3+1] = (Math.random()-0.5)*250; starPos[i*3+2] = (Math.random()-0.5)*250
      const c = 0.5 + Math.random() * 0.5
      starColors[i*3] = c; starColors[i*3+1] = c * 0.9; starColors[i*3+2] = c
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.75 }))
    scene.add(stars)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 300)
    camera.position.set(4.5, 3.2, 5); camera.lookAt(0,0,0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement); rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08
    controls.minDistance = 2; controls.maxDistance = 50
    controls.autoRotate = autoRotate; controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    // Yorug'lik
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dl1 = new THREE.DirectionalLight(0xffffff, 1.0)
    dl1.position.set(6, 10, 6); dl1.castShadow = true
    dl1.shadow.mapSize.set(1024, 1024)
    scene.add(dl1)
    const dl2 = new THREE.DirectionalLight(0xa78bfa, 0.45)
    dl2.position.set(-5, -3, -5); scene.add(dl2)
    const pt = new THREE.PointLight(0xf472b6, 0.7, 18); pt.position.set(0, 3, 0); scene.add(pt)
    const pt2 = new THREE.PointLight(0x60a5fa, 0.5, 15); pt2.position.set(0, -3, 3); scene.add(pt2)

    atomsRef.current = []; labelsRef.current = []; bondsRef.current = []
    outerSphereRef.current = []; moleculeGroupsRef.current = []
    ligandGroupsRef.current = []; ligandAtomsRef.current = []

    const positions = getEnsemblePositions(moleculeCount, ensembleMode)
    positions.forEach(p => buildMolecule(scene, p))

    if (showOuterSphere) buildOuterSphere(scene)
    if (showBondLengths) buildBondLabels(scene)
    if (showPlane) buildPlane()
    if (showAllAngles) buildAngleArcs()
    if (showSymmetry) buildSymmetry()
    if (showSolvation) buildSolvation(scene)
    if (showOrbitals) buildOrbitals()

    labelsRef.current.forEach(l => l.visible = showLabels)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left)/rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top)/rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(atomsRef.current, false)
      if (hits.length > 0) {
        const obj = hits[0].object
        if (obj.userData.info) setSelectedAtom(obj.userData.info)
      } else setSelectedAtom(null)
    }
    renderer.domElement.addEventListener("click", onClick)

    let frameId
    const clock = new THREE.Clock()
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Vibratsiya
      if (showVibration && moleculeGroupsRef.current[0]) {
        const g = moleculeGroupsRef.current[0]
        const amp = vibrationAmp
        g.children.forEach((c, idx) => {
          if (c.userData && c.userData.type === 'ligand') {
            const donor = c.userData.donorPos
            if (!donor) return
            if (vibrationMode === "sym_stretch") {
              const s = Math.sin(t * 5) * amp
              c.position.set(donor.x * s * 0.3, donor.y * s * 0.3, donor.z * s * 0.3)
            } else if (vibrationMode === "asym_stretch") {
              const phase = idx * (Math.PI * 2 / 3)
              const s = Math.sin(t * 5 + phase) * amp * 0.5
              c.position.set(donor.x * s, donor.y * s, donor.z * s)
            } else if (vibrationMode === "bend_ip") {
              const b = Math.sin(t * 4 + idx * Math.PI / 3) * amp
              c.rotation.y = b * 0.3
              c.position.set(0, 0, 0)
            } else if (vibrationMode === "bend_oop") {
              const b = Math.sin(t * 3.5) * amp
              c.position.set(0, b * (idx % 2 === 0 ? 1 : -0.5), 0)
            }
          }
        })
      }

      // Harorat
      if (showTemperature) {
        const factor = (temperature - 273) / 300
        moleculeGroupsRef.current.forEach(g => {
          g.rotation.x = Math.sin(t * (1 + factor)) * 0.06 * Math.abs(factor)
          g.rotation.z = Math.cos(t * (1 + factor * 1.3)) * 0.06 * Math.abs(factor)
        })
      }

      // Simmetriya animatsiyasi
      if (animateSymmetry && showSymmetry && moleculeGroupsRef.current[0]) {
        const g = moleculeGroupsRef.current[0]
        if (symmetryElement === "C3") {
          g.rotation.y += 0.008
        } else if (symmetryElement === "S3") {
          g.rotation.y += 0.008
          g.scale.y = 1 + Math.sin(t * 3) * 0.1 * Math.sign(Math.sin(t * 0.5))
        } else if (symmetryElement === "sigma_h") {
          g.scale.y = 1 + Math.sin(t * 2) * 0.3
        }
      }

      // Elektron oqim (donor → metall)
      if (showElectronFlow && moleculeGroupsRef.current[0]) {
        electronsRef.current.forEach(e => {
          const phase = (t * 0.4 + e.userData.phase) % 1
          const p = e.userData.start.clone().lerp(e.userData.end, phase)
          e.position.copy(p)
          e.material.opacity = 0.9 * (1 - Math.abs(phase - 0.5) * 2)
        })
      }

      // Jahn-Teller
      if (jahnTellerActive && moleculeGroupsRef.current[0]) {
        const g = moleculeGroupsRef.current[0]
        const dist = 0.15 * Math.sin(t * 1.2)
        g.children.forEach((c, idx) => {
          if (c.userData && c.userData.type === 'ligand') {
            const donor = c.userData.donorPos
            if (!donor) return
            if (distortionType === "Y") {
              // Y (simmetrik) — bir ligand cho'ziladi
              if (idx % 3 === 0) c.position.set(donor.x * dist * 2, 0, donor.z * dist * 2)
            } else if (distortionType === "T") {
              // T (T-shaped) buzilish
              const a = idx * (2 * Math.PI / 3)
              c.rotation.y = dist * 0.4
            }
          }
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()
    setLoading(false)

    const onResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onResize)
      renderer.domElement.removeEventListener("click", onClick)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentComplex, moleculeCount, ensembleMode])

  // Update effects
  useEffect(() => { if (controlsRef.current) controlsRef.current.autoRotate = autoRotate }, [autoRotate])
  useEffect(() => { labelsRef.current.forEach(l => l.visible = showLabels) }, [showLabels])
  useEffect(() => {
    if (!sceneRef.current) return
    outerSphereRef.current.forEach(m => sceneRef.current.remove(m))
    outerSphereRef.current = []
    if (showOuterSphere) buildOuterSphere(sceneRef.current)
  }, [showOuterSphere, buildOuterSphere])
  useEffect(() => { buildBondLabels() }, [showBondLengths, buildBondLabels])
  useEffect(() => { buildAngleArcs() }, [showAllAngles, buildAngleArcs])
  useEffect(() => { buildPlane() }, [showPlane, buildPlane])
  useEffect(() => { buildSymmetry() }, [showSymmetry, symmetryElement, buildSymmetry])
  useEffect(() => { buildOrbitals() }, [showOrbitals, orbitalType, buildOrbitals])
  useEffect(() => {
    if (!sceneRef.current) return
    buildSolvation(sceneRef.current)
  }, [showSolvation, solvationDensity, solventType, buildSolvation])
  useEffect(() => {
    atomsRef.current.forEach(a => {
      if (viewMode === "spacefill") { a.scale.setScalar(2.4); if (a.material) a.material.wireframe = false }
      else if (viewMode === "wireframe") { a.scale.setScalar(0.6); if (a.material) a.material.wireframe = true }
      else { a.scale.setScalar(1); if (a.material) a.material.wireframe = false }
    })
    bondsRef.current.forEach(b => b.visible = viewMode !== "spacefill")
  }, [viewMode])

  // ═══════════════════════════════════════════════════════════
  // PDF EKSPORT
  // ═══════════════════════════════════════════════════════════
  const exportPDF = useCallback(async () => {
    try {
      setPdfExporting(true)
      const pdf = await PDFDocument.create()
      pdf.registerFontkit(fontkit)
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

      let page = pdf.addPage([595, 842])
      let y = 800
      const drawText = (text, opts = {}) => {
        const { size = 11, isBold = false, color = rgb(0.15, 0.05, 0.35), x = 40 } = opts
        page.drawText(cleanText(text), { x, y, size, font: isBold ? bold : font, color })
        y -= size + 4
      }
      const drawLine = () => {
        page.drawLine({ start: { x: 40, y: y + 4 }, end: { x: 555, y: y + 4 }, thickness: 0.5, color: rgb(0.6, 0.4, 0.9) })
        y -= 6
      }
      const newPageIfNeeded = (needed = 100) => {
        if (y < needed) { page = pdf.addPage([595, 842]); y = 800 }
      }

      // TITLE
      page.drawRectangle({ x: 0, y: 780, width: 595, height: 62, color: rgb(0.09, 0.02, 0.20) })
      page.drawText("jdakimyo.uz", { x: 40, y: 815, size: 20, font: bold, color: rgb(0.98, 0.75, 0.14) })
      page.drawText("Uchburchak (trigonal-planar) kompleks birikma tahlili", { x: 40, y: 793, size: 11, font, color: rgb(0.92, 0.88, 0.98) })
      y = 760

      drawText("1. UMUMIY MA'LUMOT", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      drawText(`Formula: ${cleanText(complex.formula)}`, { isBold: true })
      drawText(`Nomi: ${cleanText(complex.name)}`)
      drawText(`Ichki tuz: ${cleanText(complex.fullSalt)}`)
      drawText(`Geometriya: ${cleanText(complex.geometry)} (${cleanText(complex.symmetry)})`)
      drawText(`Gibridlanish: ${cleanText(complex.hybridization)}`)
      drawText(`Magnit xossalari: ${cleanText(complex.magnetism)}`)
      drawText(`d-konfiguratsiya: ${cleanText(complex.dConfig)}`)
      drawText(`Rangi: ${cleanText(complex.color)}`)
      drawText(`Zichligi: ${cleanText(complex.density)}`)
      y -= 10

      drawText("2. GEOMETRIK PARAMETRLAR", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      drawText(`Koordinatsion son: 3`)
      drawText(`Bog' burchagi: L-M-L = ${complex.bondAngle}°`)
      drawText(`M-L bog' uzunligi (CSD): ${cleanText(complex.bondLengthReal)}`)
      drawText(`Kristallografik oralig'i: ${cleanText(complex.bondLengthCSD)} A`)
      drawText(`Simmetriya guruhi: D3h (E, 2C3, 3C2, sigma-h, 2S3, 3 sigma-v)`)
      drawText(`Guruh tartibi: 12`)
      y -= 10

      newPageIfNeeded(200)
      drawText("3. TERMODINAMIK MA'LUMOTLAR", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      if (complex.thermo.logK1) drawText(`log K1 = ${complex.thermo.logK1}`)
      if (complex.thermo.logK2) drawText(`log K2 = ${complex.thermo.logK2}`)
      if (complex.thermo.logK3) drawText(`log K3 = ${complex.thermo.logK3}`)
      drawText(`beta3 (umumiy barqarorlik) = ${complex.thermo.beta3.toExponential(2)}`)
      drawText(`Delta-H = ${complex.thermo.dH} kJ/mol`)
      drawText(`Delta-S = ${complex.thermo.dS} J/(mol*K)`)
      y -= 10

      drawText("4. IR/RAMAN SPEKTRI (sm^-1)", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      complex.IR.forEach(band => {
        drawText(`${band.freq} cm^-1  —  ${cleanText(band.mode)}  (${cleanText(band.intensity)})`)
      })
      y -= 10

      newPageIfNeeded(200)
      drawText("5. UV-VIS SPEKTRI", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      complex.UV.forEach(b => {
        drawText(`lambda = ${b.wl} nm  |  epsilon = ${b.epsilon}  |  ${cleanText(b.assignment)}`)
      })
      y -= 10

      drawText("6. MAGNIT XOSSALARI", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      drawText(`Solishtirma magnit qabulchanlik chi = ${complex.magProps.chi.toExponential(2)} cm^3/g`)
      drawText(`Molyar magnit qabulchanlik xM = ${complex.magProps.xM.toExponential(2)} cm^3/mol`)
      drawText(`Xossasi: ${complex.magProps.diamagnetic ? "Diamagnit (barcha elektronlar juftlashgan)" : "Paramagnit"}`)
      y -= 10

      newPageIfNeeded(200)
      drawText("7. ADABIYOTLAR", { size: 14, isBold: true, color: rgb(0.55, 0.15, 0.65) })
      drawLine()
      complex.references.forEach((r, i) => drawText(`[${i + 1}] ${cleanText(r)}`, { size: 9 }))

      // Footer
      const pages = pdf.getPages()
      pages.forEach((p, i) => {
        p.drawText(`jdakimyo.uz  |  ${cleanText(complex.formula)}  |  ${i + 1}/${pages.length}`,
          { x: 40, y: 20, size: 8, font, color: rgb(0.5, 0.4, 0.7) })
      })

      const bytes = await pdf.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${complex.id}_trigonal_planar.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert("PDF eksportida xatolik yuz berdi: " + e.message)
    } finally {
      setPdfExporting(false)
    }
  }, [complex])

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0420] via-[#160735] to-[#0a0420] text-white">
      {/* HEADER */}
      {!fullscreenMode && (
        <header className="sticky top-0 z-40 bg-[#0a0420]/85 backdrop-blur-lg border-b border-purple-500/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition">
              <span className="text-xl">←</span><span className="font-medium">Bosh sahifa</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Trigonal-planar (D₃ₕ) kompleks birikmalar
              </h1>
              <p className="text-xs text-purple-200/70 mt-0.5">
                jdakimyo.uz · Koordinatsion soni 3 · sp² gibridlanish · d¹⁰ tizim
              </p>
            </div>
            <Link href="/kompleks/oktaedrik" className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-400/30 text-purple-200 hover:bg-purple-500/25 transition text-sm">
              Oktaedrik →
            </Link>
          </div>
        </header>
      )}

      {/* HERO */}
      {!fullscreenMode && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-purple-800/25 via-pink-700/15 to-amber-700/15 border border-purple-400/25 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">▲ K.Ch = 3</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-semibold">sp² gibrid</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-semibold">D₃ₕ · |G|=12</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-semibold">d¹⁰ · μ_eff = 0</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">18-elektron qoidasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
              Uch koordinatsiyali <span className="text-amber-300">tekis uchburchak</span> (∠L–M–L = 120°)
            </h2>
            <p className="text-purple-100/85 leading-relaxed text-sm sm:text-base">
              Koordinatsion soni <b>3</b> ga teng bo'lgan komplekslarda markaziy metallning uchta bog'lash o'rni
              bir tekislikda joylashib, <b>D₃ₕ</b> nuqta guruhiga xos <b>ideal 120°</b> burchak hosil qiladi.
              Bu geometriya markaziy atomning <b>sp²</b> gibridlanishi bilan izohlanadi va <b>p<sub>z</sub></b> orbital
              tekislikka perpendikulyar holda π-simmetriyali bog'lanishlar uchun ochiq qoladi.
              Trigonal-planar shakl asosan <b>d¹⁰</b> konfiguratsiyali <b>og'ir metallar</b> ionlarida (Cu⁺, Ag⁺, Au⁺, Hg²⁺)
              va past valentli platina guruhi (Pt⁰, Pd⁰) komplekslarida uchraydi. <b>18-elektron qoidasi</b>ga muvofiq
              d¹⁰ + 3×2 = 16 elektron — bu barqaror konfiguratsiyaning to'ldiruvchi hisoblanadi.
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20"><b className="text-amber-300">CFSE:</b> 0 (d¹⁰)</div>
              <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20"><b className="text-amber-300">Δₜₚ:</b> ≈ 0.44·Δₒ</div>
              <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20"><b className="text-amber-300">Jahn-Teller:</b> Yo'q</div>
              <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20"><b className="text-amber-300">Bogʻ:</b> σ + π-back-donation</div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN — 3D + Panel */}
      <section className={fullscreenMode ? "fixed inset-0 z-50 bg-black" : "max-w-7xl mx-auto px-4 sm:px-6 pb-8"}>
        <div className={`relative ${fullscreenMode ? "w-full h-full" : "rounded-2xl overflow-hidden border border-purple-500/25 bg-black/40"}`}
             style={{ height: fullscreenMode ? "100vh" : "min(75vh, 720px)" }}>
          <div ref={containerRef} className="w-full h-full" />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur">
              <div className="text-center">
                <div className="w-14 h-14 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-purple-200 text-sm">3D sahna yuklanmoqda…</p>
              </div>
            </div>
          )}

          <button onClick={() => setFullscreenMode(v => !v)}
            className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-purple-600/70 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg">
            {fullscreenMode ? "✕ Yopish" : "⛶ To'liq ekran"}
          </button>

          {selectedAtom && showTooltip && (
            <div className="absolute bottom-3 right-3 z-30 max-w-xs bg-[#0a0420]/95 border border-purple-400/40 rounded-xl p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-white/40" style={{ background: selectedAtom.color }} />
                  <b className="text-amber-300">{selectedAtom.name}</b>
                </div>
                <button onClick={() => setSelectedAtom(null)} className="text-purple-300 hover:text-white">✕</button>
              </div>
              <div className="text-xs text-purple-100/90 space-y-1">
                <div><b>Z:</b> {selectedAtom.atomic} · <b>M:</b> {selectedAtom.mass}</div>
                <div><b>Konfig:</b> {selectedAtom.config}</div>
                {selectedAtom.oxidation && <div><b>Oks. daraja:</b> {selectedAtom.oxidation}</div>}
                {selectedAtom.charge && <div><b>Zaryad:</b> {selectedAtom.charge}</div>}
                {selectedAtom.en && <div><b>Elektromanfiylik (Pauling):</b> {selectedAtom.en}</div>}
                {selectedAtom.ionRadius && <div><b>Ion radius:</b> {selectedAtom.ionRadius}</div>}
                {selectedAtom.covRadius && <div><b>Kov. radius:</b> {selectedAtom.covRadius}</div>}
                {selectedAtom.firstIE && <div><b>I₁:</b> {selectedAtom.firstIE}</div>}
                {selectedAtom.hybridization && <div><b>Gibrid:</b> {selectedAtom.hybridization}</div>}
                <div className="text-purple-300/80 italic mt-1">{selectedAtom.role}</div>
              </div>
            </div>
          )}

          {/* ═══ BOSHQARUV PANELI ═══ */}
          <div ref={panelRef}
            style={{ left: panelPos.x, top: panelPos.y }}
            className="absolute z-20 w-[300px] max-h-[calc(100%-24px)] overflow-y-auto rounded-xl bg-[#0a0420]/95 backdrop-blur border border-purple-400/30 shadow-2xl">
            <div onMouseDown={(e) => handlePanelDragStart(e.clientX, e.clientY)}
              onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
              className="cursor-grab active:cursor-grabbing select-none px-3 py-2 border-b border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-900/60 to-pink-900/50">
              <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5"><span>⚙️</span> Boshqaruv paneli</div>
              <div className="text-purple-300/70 text-[10px]">⋮⋮ sudrang</div>
            </div>

            <div className="p-3 border-b border-purple-500/20">
              <label className="text-[10px] uppercase tracking-wider text-purple-300 font-bold">Kompleks</label>
              <select value={currentComplex} onChange={(e) => setCurrentComplex(e.target.value)}
                className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400">
                {Object.entries(COMPLEXES).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#0a0420]">{v.formula} — {v.center.element}</option>
                ))}
              </select>
              <div className="mt-2 text-[11px] text-purple-200/85 space-y-0.5">
                <div><b className="text-amber-300">Tuz:</b> {complex.fullSalt}</div>
                <div><b className="text-amber-300">Rang:</b> {complex.color}</div>
                <div><b className="text-amber-300">d-config:</b> {complex.dConfig}</div>
                <div><b className="text-amber-300">M-L:</b> {complex.bondLengthReal}</div>
              </div>
            </div>

            {[
              { id: "view", title: "🎨 Ko'rinish" },
              { id: "geometry", title: "📐 Geometriya" },
              { id: "orbitals", title: "⚛️ Orbitallar" },
              { id: "symmetry", title: "🔷 Simmetriya" },
              { id: "vibration", title: "🌊 Tebranishlar" },
              { id: "conditions", title: "🌡️ Sharoit" },
              { id: "advanced", title: "🔬 Ilg'or" },
              { id: "export", title: "📄 Eksport" }
            ].map(sec => (
              <div key={sec.id} className="border-b border-purple-500/20">
                <button onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-purple-200 hover:bg-purple-500/10 flex justify-between">
                  <span>{sec.title}</span>
                  <span>{expandedSection === sec.id ? "▾" : "▸"}</span>
                </button>
                {expandedSection === sec.id && (
                  <div className="px-3 pb-3 space-y-2">
                    {sec.id === "view" && (
                      <>
                        <ToggleRow label="Avto aylanish" value={autoRotate} onChange={setAutoRotate} />
                        <ToggleRow label="Yorliqlar" value={showLabels} onChange={setShowLabels} />
                        <ToggleRow label="Tashqi sfera (K⁺)" value={showOuterSphere} onChange={setShowOuterSphere} />
                        <ToggleRow label="Tooltip" value={showTooltip} onChange={setShowTooltip} />
                        <div>
                          <label className="text-[10px] text-purple-300 uppercase font-bold">Ko'rinish rejimi</label>
                          <div className="mt-1 grid grid-cols-3 gap-1">
                            {[["ball-stick","B&S"],["spacefill","Toʻldiruvchi"],["wireframe","Karkas"]].map(([m,l]) => (
                              <button key={m} onClick={() => setViewMode(m)}
                                className={`text-[10px] py-1 rounded ${viewMode === m ? "bg-amber-500 text-black font-bold" : "bg-purple-800/50 text-purple-200"}`}>{l}</button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {sec.id === "geometry" && (
                      <>
                        <ToggleRow label="Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
                        <ToggleRow label="120° burchak yoylari" value={showAllAngles} onChange={setShowAllAngles} />
                        <ToggleRow label="Molekula tekisligi (σₕ)" value={showPlane} onChange={setShowPlane} />
                        <div>
                          <label className="text-[10px] text-purple-300 uppercase font-bold">Molekulalar</label>
                          <select value={moleculeCount} onChange={(e) => setMoleculeCount(Number(e.target.value))}
                            className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                            <option value={1}>1 (yakka)</option>
                            <option value={8}>8 (2×2×2)</option>
                            <option value={27}>27 (3×3×3)</option>
                          </select>
                        </div>
                        {moleculeCount > 1 && (
                          <div>
                            <label className="text-[10px] text-purple-300 uppercase font-bold">Joylashuv</label>
                            <div className="mt-1 grid grid-cols-2 gap-1">
                              {[["crystal","Kristall"],["amorphous","Amorf"]].map(([m,l]) => (
                                <button key={m} onClick={() => setEnsembleMode(m)}
                                  className={`text-[10px] py-1 rounded ${ensembleMode === m ? "bg-pink-500 text-white font-bold" : "bg-purple-800/50 text-purple-200"}`}>{l}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {sec.id === "orbitals" && (
                      <>
                        <ToggleRow label="Orbitallar ko'rinsin" value={showOrbitals} onChange={setShowOrbitals} />
                        {showOrbitals && (
                          <div>
                            <label className="text-[10px] text-purple-300 uppercase font-bold">Orbital turi</label>
                            <select value={orbitalType} onChange={(e) => setOrbitalType(e.target.value)}
                              className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                              <option value="sp2">3 × sp² (bog'lash)</option>
                              <option value="pz">p<sub>z</sub> (π-uchun)</option>
                              <option value="dz2">d<sub>z²</sub> (a₁')</option>
                              <option value="dxy_x2y2">d<sub>xy</sub> + d<sub>x²-y²</sub> (e')</option>
                            </select>
                          </div>
                        )}
                        <ToggleRow label="Elektron oqim (L→M)" value={showElectronFlow} onChange={setShowElectronFlow} />
                      </>
                    )}
                    {sec.id === "symmetry" && (
                      <>
                        <ToggleRow label="Simmetriya elementlari" value={showSymmetry} onChange={setShowSymmetry} />
                        {showSymmetry && (
                          <>
                            <div>
                              <label className="text-[10px] text-purple-300 uppercase font-bold">Element</label>
                              <select value={symmetryElement} onChange={(e) => setSymmetryElement(e.target.value)}
                                className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                                <option value="C3">C₃ — asosiy o'q</option>
                                <option value="C2">3C₂ — perpendikulyar</option>
                                <option value="sigma_h">σₕ — gorizontal tekislik</option>
                                <option value="sigma_v">3σᵥ — vertikal tekisliklar</option>
                                <option value="S3">S₃ — aylanish-akslanish</option>
                                <option value="all">Barchasi birga</option>
                              </select>
                            </div>
                            <ToggleRow label="Animatsiyalash" value={animateSymmetry} onChange={setAnimateSymmetry} />
                          </>
                        )}
                      </>
                    )}
                    {sec.id === "vibration" && (
                      <>
                        <ToggleRow label="Normal tebranishlar" value={showVibration} onChange={setShowVibration} />
                        {showVibration && (
                          <>
                            <div>
                              <label className="text-[10px] text-purple-300 uppercase font-bold">Rejim (4 tur)</label>
                              <select value={vibrationMode} onChange={(e) => setVibrationMode(e.target.value)}
                                className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                                <option value="sym_stretch">ν₁ (A₁') simmetrik cho'zilish</option>
                                <option value="asym_stretch">ν₃ (E') asimmetrik cho'zilish</option>
                                <option value="bend_ip">ν₄ (E') tekislikda egilish</option>
                                <option value="bend_oop">ν₂ (A₂″) tekislikdan egilish</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-purple-300">Amplituda: {vibrationAmp.toFixed(2)}</label>
                              <input type="range" min={0.05} max={0.4} step={0.01} value={vibrationAmp}
                                onChange={(e) => setVibrationAmp(Number(e.target.value))} className="w-full accent-amber-400" />
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {sec.id === "conditions" && (
                      <>
                        <ToggleRow label="Harorat effekti" value={showTemperature} onChange={setShowTemperature} />
                        {showTemperature && (
                          <div>
                            <label className="text-[10px] text-purple-300">T = {temperature} K ({(temperature - 273).toFixed(0)} °C)</label>
                            <input type="range" min={73} max={773} step={5} value={temperature}
                              onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-amber-400" />
                          </div>
                        )}
                        <ToggleRow label="Solvatatsiya" value={showSolvation} onChange={setShowSolvation} />
                        {showSolvation && (
                          <>
                            <div>
                              <label className="text-[10px] text-purple-300">Erituvchi</label>
                              <select value={solventType} onChange={(e) => setSolventType(e.target.value)}
                                className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                                <option value="water">H₂O (suv)</option>
                                <option value="nh3">NH₃ (suyuq)</option>
                                <option value="methanol">CH₃OH</option>
                                <option value="dmso">DMSO</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-purple-300">Zichlik: {solvationDensity}</label>
                              <input type="range" min={5} max={40} step={1} value={solvationDensity}
                                onChange={(e) => setSolvationDensity(Number(e.target.value))} className="w-full accent-blue-400" />
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {sec.id === "advanced" && (
                      <>
                        <ToggleRow label="Jahn-Teller buzilishi" value={jahnTellerActive} onChange={setJahnTellerActive} />
                        {jahnTellerActive && (
                          <div>
                            <label className="text-[10px] text-purple-300 uppercase font-bold">Buzilish turi</label>
                            <select value={distortionType} onChange={(e) => setDistortionType(e.target.value)}
                              className="mt-1 w-full bg-purple-950/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-white">
                              <option value="Y">Y-buzilish (C₂ᵥ)</option>
                              <option value="T">T-buzilish (T-shaped)</option>
                            </select>
                          </div>
                        )}
                        <div className="pt-2 border-t border-purple-500/20 space-y-1">
                          <PanelButton label="ℹ️ Kompleks pasporti" active={activePanel === "info"} onClick={() => setActivePanel(activePanel === "info" ? null : "info")} />
                          <PanelButton label="⚛️ sp² gibrid sxema" active={activePanel === "hybrid"} onClick={() => setActivePanel(activePanel === "hybrid" ? null : "hybrid")} />
                          <PanelButton label="📊 MO diagramma (D₃ₕ)" active={activePanel === "mo"} onClick={() => setActivePanel(activePanel === "mo" ? null : "mo")} />
                          <PanelButton label="🌈 IR/Raman spektri" active={activePanel === "ir"} onClick={() => setActivePanel(activePanel === "ir" ? null : "ir")} />
                          <PanelButton label="💜 UV-Vis spektri" active={activePanel === "uv"} onClick={() => setActivePanel(activePanel === "uv" ? null : "uv")} />
                          <PanelButton label="🔮 Walsh diagrammasi" active={activePanel === "walsh"} onClick={() => setActivePanel(activePanel === "walsh" ? null : "walsh")} />
                          <PanelButton label="📋 D₃ₕ xarakter jadvali" active={activePanel === "character"} onClick={() => setActivePanel(activePanel === "character" ? null : "character")} />
                        </div>
                      </>
                    )}
                    {sec.id === "export" && (
                      <>
                        <button onClick={exportPDF} disabled={pdfExporting}
                          className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold text-xs disabled:opacity-50">
                          {pdfExporting ? "⏳ Yaratilmoqda..." : "📄 To'liq PDF hisobot"}
                        </button>
                        <div className="text-[10px] text-purple-300/80 italic">
                          PDF ichida: geometriya, IR/UV spektrlari, termodinamika, magnit xossalari, adabiyotlar
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ═══ ACTIVE PANEL ═══ */}
          {activePanel && !fullscreenMode && (
            <div className="absolute top-3 right-3 z-20 w-[360px] max-h-[calc(100%-24px)] overflow-y-auto rounded-xl bg-[#0a0420]/95 backdrop-blur border border-amber-400/40 shadow-2xl">
              <div className="px-3 py-2 border-b border-amber-500/30 bg-gradient-to-r from-amber-900/40 to-pink-900/30 flex justify-between sticky top-0 z-10">
                <b className="text-amber-200 text-sm">
                  {activePanel === "info" && "ℹ️ Kompleks pasporti"}
                  {activePanel === "hybrid" && "⚛️ sp² gibridlanish"}
                  {activePanel === "mo" && "📊 MO diagramma (D₃ₕ)"}
                  {activePanel === "ir" && "🌈 IR / Raman spektri"}
                  {activePanel === "uv" && "💜 UV-Vis spektri"}
                  {activePanel === "walsh" && "🔮 Walsh diagrammasi"}
                  {activePanel === "character" && "📋 D₃ₕ xarakter jadvali"}
                </b>
                <button onClick={() => setActivePanel(null)} className="text-purple-300 hover:text-white">✕</button>
              </div>
              <div className="p-3 text-[12px] text-purple-100/90 leading-relaxed">
                {activePanel === "info" && <InfoPanel complex={complex} />}
                {activePanel === "hybrid" && <HybridPanel complex={complex} />}
                {activePanel === "mo" && <MOPanel complex={complex} />}
                {activePanel === "ir" && <IRPanel complex={complex} />}
                {activePanel === "uv" && <UVPanel complex={complex} />}
                {activePanel === "walsh" && <WalshPanel />}
                {activePanel === "character" && <CharacterTablePanel />}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ILMIY BO'LIMLAR */}
      {!fullscreenMode && (
        <>
          {/* 1. NAZARIY ASOSLAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📚" title="1. Nazariy asoslar — chuqur tahlil" />
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="VSEPR (Gillespie–Nyholm) — matematik model">
                <p>
                  AX₃E₀ turdagi molekulalar uchun uchta bog'lovchi elektron juftining o'zaro Coulomb itarilishi
                  minimallashishi shartida ular <b>D₃ₕ</b> simmetriyali tekislikda 120° burchak ostida joylashadi.
                </p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2">
                  V(θ) = k·Σᵢ&lt;ⱼ 1/rᵢⱼ  →  min pri  Σᵢcos(θᵢⱼ) = −3/2  →  θ = 120°
                </div>
                <p className="mt-2">
                  Ligandlar π-tarkibga ega bo'lsa (CN⁻, CO), simmetriya sof saqlanadi. Sof σ-donorlarda ham burchak
                  ideal 120° dan &lt; 0.5° chetlanadi.
                </p>
              </Card>

              <Card title="Gibridlanish — sp² to'lqin funksiyalari">
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-1 space-y-1">
                  <div>ψ₁ = (1/√3)s + (√2/√3)pₓ</div>
                  <div>ψ₂ = (1/√3)s − (1/√6)pₓ + (1/√2)p<sub>y</sub></div>
                  <div>ψ₃ = (1/√3)s − (1/√6)pₓ − (1/√2)p<sub>y</sub></div>
                </div>
                <p className="mt-2">
                  Ortonormal: ⟨ψᵢ|ψⱼ⟩ = δᵢⱼ. s-tarkib 33.3%, p-tarkib 66.7%.
                  Uchinchi <b>p<sub>z</sub></b> orbital tekislikka perpendikulyar — π-back-donation uchun ochiq.
                </p>
              </Card>

              <Card title="CFT: D₃ₕ da d-orbital bo'linishi">
                <p>Sferik simmetriyadagi 5 ta d-orbital D₃ₕ maydonda 3 ta darajaga bo'linadi:</p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2 space-y-0.5">
                  <div><b>e'</b> (d<sub>xy</sub>, d<sub>x²−y²</sub>)  E = +0.546 Δₜₚ  (yuqori)</div>
                  <div><b>a₁'</b> (d<sub>z²</sub>)                  E = −0.321 Δₜₚ  (o'rta)</div>
                  <div><b>e″</b> (d<sub>xz</sub>, d<sub>yz</sub>)   E = −0.386 Δₜₚ  (past)</div>
                </div>
                <p className="mt-2"><b>Δₜₚ ≈ 4/9·Δₒ ≈ 0.44 Δₒ</b> — oktaedrikga nisbatan zaifroq.</p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2">
                  CFSE(d¹⁰) = 4(−0.386) + 2(−0.321) + 4(+0.546) ≈ <b>0 Δₜₚ</b>
                </div>
              </Card>

              <Card title="MO nazariyasi — SALC tahlili">
                <p>D₃ₕ da 3 ta σ-ligand simmetriya-moslashtirilgan chiziqli kombinatsiyalari:</p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2 space-y-0.5">
                  <div>Γσ = <b>a₁' + e'</b></div>
                  <div>φ(a₁') = (1/√3)(σ₁+σ₂+σ₃)</div>
                  <div>φ(e'ₐ) = (1/√6)(2σ₁−σ₂−σ₃)</div>
                  <div>φ(e'ᵦ) = (1/√2)(σ₂−σ₃)</div>
                </div>
                <p className="mt-2">Metall AO simmetriyalari:</p>
                <ul className="list-disc list-inside text-[11px] mt-1 space-y-0.5">
                  <li><b>s → a₁'</b>, <b>(pₓ,p<sub>y</sub>) → e'</b>, <b>p<sub>z</sub> → a₂″</b></li>
                  <li><b>d<sub>z²</sub> → a₁'</b>, <b>(d<sub>xy</sub>,d<sub>x²−y²</sub>) → e'</b>, <b>(d<sub>xz</sub>,d<sub>yz</sub>) → e″</b></li>
                </ul>
              </Card>

              <Card title="18-elektron qoidasi — istisno">
                <p>Trigonal-planar d¹⁰ komplekslar <b>16-elektron</b> tizimi (koordinatsion to'yinmagan):</p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2">
                  d¹⁰ + 3×2σ = 16 e⁻  (18e⁻ dan 2 kam)
                </div>
                <p className="mt-2">
                  Bu <b>katalizga</b> asos: 16e⁻ ↔ 18e⁻ tebranishi oksidativ qo'shilish / qaytariluvchi ajralish
                  jarayonlarini ta'minlaydi (Suzuki, Heck, Negishi, Wacker).
                </p>
                <p className="mt-2 text-[11px] text-amber-200">
                  Misol: [Pt(PPh₃)₃] (16e⁻) + H₂ → [Pt(H)₂(PPh₃)₃] (18e⁻)
                </p>
              </Card>

              <Card title="Relyativistik effektlar — Pyykkö tahlili">
                <p>Cu, Ag, Au, Hg, Pt uchun relyativistik ta'sirlar:</p>
                <ul className="list-disc list-inside text-[11px] mt-1 space-y-1">
                  <li><b>6s-orbital qisqarishi</b> (Au: 15%) — ns AO past koordinatsion sonda faolroq</li>
                  <li><b>5d-orbital kengayishi</b> — π-back-donation kuchayadi</li>
                  <li><b>Spin-orbital juftlashuv</b>: ξ(Pt) ≈ 5000 sm⁻¹</li>
                </ul>
                <p className="mt-2 text-[11px]">
                  <b>Xulosa:</b> og'ir metallar past koordinatsion sonda (2, 3, 4) barqarorroq —
                  shu sabab Au(I), Cu(I) trigonal-planar shakli qulay.
                </p>
              </Card>
            </div>
          </section>

          {/* 2. GEOMETRIK PARAMETRLAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📐" title="2. Geometrik, energetik va spektroskopik parametrlar" />
            <div className="overflow-x-auto rounded-xl border border-purple-500/25">
              <table className="w-full text-sm">
                <thead className="bg-purple-900/40 text-purple-200">
                  <tr><th className="p-3 text-left">Parametr</th><th className="p-3 text-left">Qiymat</th><th className="p-3 text-left">Izoh</th></tr>
                </thead>
                <tbody className="divide-y divide-purple-500/15 text-purple-100/90">
                  <tr><td className="p-3 font-semibold">Koordinatsion son</td><td className="p-3">3</td><td className="p-3">Uchta monodentat ligand</td></tr>
                  <tr><td className="p-3 font-semibold">Bog' burchagi</td><td className="p-3">∠L–M–L = 120.0°</td><td className="p-3">Ideal, D₃ₕ</td></tr>
                  <tr><td className="p-3 font-semibold">Simmetriya guruhi</td><td className="p-3">D₃ₕ</td><td className="p-3">|G| = 12</td></tr>
                  <tr><td className="p-3 font-semibold">Gibrid</td><td className="p-3">sp²</td><td className="p-3">33% s + 67% p</td></tr>
                  <tr><td className="p-3 font-semibold">Ligand maydon energiyasi</td><td className="p-3">Δₜₚ ≈ 0.44 Δₒ</td><td className="p-3">Zaifroq</td></tr>
                  <tr><td className="p-3 font-semibold">CFSE (d¹⁰)</td><td className="p-3">≈ 0</td><td className="p-3">Stabilizatsiya yo'q</td></tr>
                  <tr><td className="p-3 font-semibold">18e⁻ qoidasi</td><td className="p-3">16 e⁻ (istisno)</td><td className="p-3">Koordinatsion to'yinmagan</td></tr>
                  <tr><td className="p-3 font-semibold">Jahn-Teller</td><td className="p-3">Yo'q (d¹⁰)</td><td className="p-3">Orbital degeneratsiya yo'q</td></tr>
                  <tr><td className="p-3 font-semibold">Xarakteristik metallar</td><td className="p-3">Cu⁺, Ag⁺, Au⁺, Hg²⁺, Pt⁰, Pd⁰</td><td className="p-3">d¹⁰ ionlar</td></tr>
                  <tr><td className="p-3 font-semibold">Normal tebranishlar</td><td className="p-3">3N−6 = 6</td><td className="p-3">N=4</td></tr>
                  <tr><td className="p-3 font-semibold">Vibratsion tasnif</td><td className="p-3">Γ = A₁' + A₂″ + 2E'</td><td className="p-3">Raman/IR faollik</td></tr>
                  <tr><td className="p-3 font-semibold">Magnit</td><td className="p-3">Diamagnit</td><td className="p-3">μ_eff = 0 μ_B</td></tr>
                  <tr><td className="p-3 font-semibold">Dipol moment (μ)</td><td className="p-3">0 D</td><td className="p-3">Uchta bir xil ligand</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. GIBRID DIAGRAMMA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="⚛️" title="3. sp² gibridlanish sxemasi va energetik diagramma" />
            <HybridDiagram />
          </section>

          {/* 4. MO DIAGRAMMA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📊" title="4. Molekulyar orbital diagramma (D₃ₕ)" />
            <MODiagram />
          </section>

          {/* 5. IR/RAMAN */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="🌈" title={`5. IR / Raman spektri — ${complex.formula}`} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5">
                <h4 className="font-bold text-amber-200 mb-3">IR chastotalar (sm⁻¹)</h4>
                <IRSpectrum bands={complex.IR} />
              </div>
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
                <h4 className="font-bold text-amber-200 mb-2">Normal tebranishlar tahlili</h4>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-1">
                  Γ_vib = A₁' + A₂″ + 2E'   (E' — 2-karrali)
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[12px]">
                  <li><b>ν₁ (A₁')</b> — simm. cho'zilish, <b>faqat Raman-faol</b></li>
                  <li><b>ν₂ (A₂″)</b> — tekislikdan chiqib egilish, <b>faqat IR</b></li>
                  <li><b>ν₃ (E')</b> — asimm. cho'zilish, <b>IR + Raman</b></li>
                  <li><b>ν₄ (E')</b> — tekislikda egilish, <b>IR + Raman</b></li>
                </ul>
                <p className="mt-2 text-[11px] italic text-purple-200/80">
                  D₃ₕ da inversiya markazi yo'q — o'zaro istisno qoidasi qat'iy emas.
                </p>
              </div>
            </div>
          </section>

          {/* 6. UV-VIS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="💜" title={`6. UV-Vis spektri va elektron o'tishlar — ${complex.formula}`} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5">
                <h4 className="font-bold text-amber-200 mb-3">Yutilish spektri (λ, ε)</h4>
                <UVSpectrum bands={complex.UV} />
              </div>
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
                <h4 className="font-bold text-amber-200 mb-2">Elektron o'tishlar</h4>
                <p>d¹⁰ tizimda <b>d–d o'tishlar mumkin emas</b>. Yutilish tarmoqlari:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[12px]">
                  <li><b>MLCT</b> (dₙ → π* ligand), ε ≈ 10³–10⁴</li>
                  <li><b>LMCT</b> (π ligand → sₙ metall), π-donor ligandlarda</li>
                  <li><b>π → π*</b> ligand ichida (CN⁻, PPh₃)</li>
                  <li><b>d → s/p</b> Rydberg-tipli o'tishlar</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. TERMODINAMIKA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="🔥" title="7. Termodinamik va kinetik xarakteristikalar" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5">
                <h4 className="font-bold text-amber-200 mb-3">Stabillik konstantalari — {complex.formula}</h4>
                <div className="space-y-2 text-sm">
                  {complex.thermo.logK1 && <div><b>log K₁</b> = {complex.thermo.logK1} <span className="text-purple-300/70 text-xs">(1-bosqich)</span></div>}
                  {complex.thermo.logK2 && <div><b>log K₂</b> = {complex.thermo.logK2}</div>}
                  {complex.thermo.logK3 && <div><b>log K₃</b> = {complex.thermo.logK3}</div>}
                  <div className="pt-2 border-t border-purple-500/20"><b>β₃</b> = {complex.thermo.beta3.toExponential(2)}</div>
                  <div><b>ΔH°</b> = {complex.thermo.dH} kJ/mol</div>
                  <div><b>ΔS°</b> = {complex.thermo.dS} J·mol⁻¹·K⁻¹</div>
                  <div className="pt-2 border-t border-purple-500/20">
                    <b>ΔG°</b> = ΔH°−TΔS° = <b>{(complex.thermo.dH - 298*complex.thermo.dS/1000).toFixed(1)} kJ/mol</b> (298 K)
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
                <h4 className="font-bold text-amber-200 mb-2">Ligand almashinuv kinetikasi</h4>
                <p>16e⁻ komplekslar <b>labil</b>:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[12px]">
                  <li>k ≈ 10⁶–10⁹ s⁻¹ (Cu⁺, Ag⁺)</li>
                  <li>Mexanizm: <b>assotsiativ (A/Iₐ)</b> — 4-koordinatsiyali oraliqli</li>
                  <li>Pt(0), Pd(0): <b>oksidativ qo'shilish</b> (16→18 e⁻)</li>
                </ul>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2">
                  Eyring:  k = (kᵦT/h)·exp(−ΔG‡/RT),  ΔG‡ ≈ 25–45 kJ/mol
                </div>
              </div>
            </div>
          </section>

          {/* 8. WALSH & JAHN-TELLER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="🔮" title="8. Walsh diagrammasi va Jahn-Teller tahlili" />
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="Walsh diagrammasi: D₃ₕ ↔ C₃ᵥ">
                <p>Molekula piramidalanganda MO energiyalari o'zgarishi:</p>
                <div className="font-mono text-[11px] bg-black/40 rounded p-2 mt-2 space-y-0.5">
                  <div>6 e⁻ (BF₃, BCl₃) → <b>tekis</b> D₃ₕ</div>
                  <div>8 e⁻ (NH₃, PF₃) → <b>piramidal</b> C₃ᵥ</div>
                  <div>16 e⁻ (d¹⁰ ML₃) → <b>tekis</b> D₃ₕ</div>
                  <div>18 e⁻ (d¹⁰ + p<sub>z</sub>²) → piramidal</div>
                </div>
                <WalshDiagram />
              </Card>
              <Card title="Jahn-Teller teoremasi (1937)">
                <p>Orbital degenerativ elektron holatda molekula simmetriyani pasaytiradi.</p>
                <p className="mt-2"><b>d¹⁰ da:</b></p>
                <ul className="list-disc list-inside text-[12px] mt-1 space-y-0.5">
                  <li>Barcha d-orbitallar to'la</li>
                  <li>Orbital degeneratsiya yo'q</li>
                  <li><b>J-T effekti kuzatilmaydi</b></li>
                </ul>
                <p className="mt-3"><b>Istisno holatlar:</b></p>
                <ul className="list-disc list-inside text-[12px] mt-1 space-y-0.5">
                  <li>d⁹ ML₃ (E' holat) → Y-buzilish yoki T-shaped</li>
                  <li>d⁷ past-spin ML₃ → analogik</li>
                </ul>
                <p className="mt-2 text-[11px] text-amber-200 italic">
                  Panelda "Jahn-Teller" ni yoqib, gipotetik buzilishni ko'ring.
                </p>
              </Card>
            </div>
          </section>

          {/* 9. SPEKTROKIMYOVIY QATOR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📊" title="9. Spektrokimyoviy qator va ligand maydonining kuchi" />
            <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5">
              <p className="text-sm text-purple-100/85 mb-4">
                Ligandlarning kristall maydonini yaratish qobiliyati bo'yicha qatorlangan (Δₒ normalize):
              </p>
              <SpectrochemicalChart data={SPECTROCHEMICAL_SERIES} />
            </div>
          </section>

          {/* 10. KOMPLEKSLAR TO'PLAMI */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="🧪" title="10. Trigonal-planar komplekslarning to'liq to'plami" />
            <div className="grid md:grid-cols-2 gap-4">
              {Object.values(COMPLEXES).map(c => (
                <div key={c.id} onClick={() => setCurrentComplex(c.id)}
                  className={`cursor-pointer rounded-xl p-5 border transition ${currentComplex === c.id ? "bg-amber-500/20 border-amber-400/60 shadow-lg shadow-amber-500/20" : "bg-purple-900/30 border-purple-500/25 hover:border-purple-400/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold text-amber-200">{c.formula}</div>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/30 border border-purple-400/50">{c.symmetry}</span>
                  </div>
                  <div className="text-sm text-purple-200/85 mb-3">{c.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-purple-100/85">
                    <div>Markaz: <b>{c.center.element}{c.center.charge}</b></div>
                    <div>Bog': <b>{c.bondLengthReal}</b></div>
                    <div>Gibrid: <b>{c.hybridization}</b></div>
                    <div>d-config: <b>{c.dConfig}</b></div>
                    <div>β₃: <b>{c.thermo.beta3.toExponential(1)}</b></div>
                    <div>Rang: <b>{c.color.split(' ')[0]}</b></div>
                  </div>
                  <div className="mt-3 text-[10px] text-purple-300/70 italic">
                    ν(M–L) ≈ {c.IR.find(i => i.mode.includes('M') || i.mode.includes('Pt') || i.mode.includes('Cu') || i.mode.includes('Ag') || i.mode.includes('Hg'))?.freq || c.IR[Math.floor(c.IR.length/2)]?.freq} sm⁻¹
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11. REAKSIYALAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="⚗️" title="11. Sintez usullari va olinish reaksiyalari" />
            <div className="space-y-3">
              <ReactionRow eq="CuCl + 2 KCN → K[Cu(CN)₂]  (chiziqli, K.Ch=2)" note="Birinchi bosqich" />
              <ReactionRow eq="K[Cu(CN)₂] + KCN(ort.) → K₂[Cu(CN)₃]" note="Ortiqcha CN⁻ da trigonal-planar hosil bo'ladi" />
              <ReactionRow eq="HgI₂ + KI → K[HgI₃]" note="Nessler reagentining komponenti" />
              <ReactionRow eq="Pt(cod)₂ + 3 PPh₃ → [Pt(PPh₃)₃] + 2 cod" note="cod = 1,5-siklooktadien; inert atmosferada" />
              <ReactionRow eq="AgNO₃ + 3 KCN → K₂[Ag(CN)₃] + KNO₃" note="Galvanotexnika elektroliti" />
              <ReactionRow eq="4 Au + 8 NaCN + O₂ + 2 H₂O → 4 Na[Au(CN)₂] + 4 NaOH" note="Sianidli oltinni ekstraksiya (MacArthur–Forrest)" />
              <ReactionRow eq="[Pt(PPh₃)₃] + O₂ → [Pt(O₂)(PPh₃)₂] + PPh₃" note="Oksidativ qo'shilish (O₂ faollashuvi)" />
              <ReactionRow eq="[Pt(PPh₃)₃] + PhBr → [Pt(Ph)(Br)(PPh₃)₂] + PPh₃" note="Suzuki katalizining 1-bosqichi" />
            </div>
          </section>

          {/* 12. TARIX + ZAMONAVIY */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📜" title="12. Tarixiy rivojlanish va zamonaviy qo'llanilish" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
                <h4 className="font-bold text-amber-200 mb-2">Tarixiy bosqichlar</h4>
                <ul className="space-y-1.5 text-[12px]">
                  <li><b>1798</b> — Tassaert: AgCN, K[Ag(CN)₂] birinchi ta'rifi</li>
                  <li><b>1893</b> — <b>A. Werner</b> koordinatsion nazariyasi (Nobel, 1913)</li>
                  <li><b>1916</b> — G. Lewis: donor-akseptor bog' tushunchasi</li>
                  <li><b>1931</b> — L. Pauling: gibridlanish nazariyasi</li>
                  <li><b>1937</b> — Jahn-Teller teoremasi</li>
                  <li><b>1957</b> — Chatt–Duncanson: π-back-donation modeli</li>
                  <li><b>1968</b> — Ugo, Cariati: [Pt(PPh₃)₃] sintezi</li>
                  <li><b>1988</b> — P. Pyykkö: relyativistik effektlar</li>
                  <li><b>2010</b> — Suzuki, Heck, Negishi: Nobel mukofoti (Pd katalizatorlari)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
                <h4 className="font-bold text-amber-200 mb-2">Zamonaviy qo'llanilish</h4>
                <ul className="space-y-1.5 text-[12px]">
                  <li><b>🧪 Kataliz:</b> [Pt(PPh₃)₃], [Pd(PPh₃)₃] — Suzuki, Heck, Sonogashira, Negishi C–C bog'lanishlarida asosiy katalizator</li>
                  <li><b>⚗️ Analitik kimyo:</b> Nessler reagenti (K₂[HgI₄] + KOH) — NH₃/NH₄⁺ ni sifat aniqlash (0.02 mg/l)</li>
                  <li><b>💍 Metallurgiya:</b> Na[Au(CN)₂] — oltinni sianid usulida ajratish (jahon ishlab chiqarishining ~90%)</li>
                  <li><b>💡 OLED:</b> Cu(I), Au(I) trigonal komplekslar — fosforessent emitter (Φ &gt; 90%)</li>
                  <li><b>🧬 Tibbiyot:</b> <b>Auranofin</b> — Au(I) revmatoid artrit dorisi; HIV va rak profilaktikasi ilmiy tadqiqotlari</li>
                  <li><b>🔬 Biokataliz:</b> Cu(I) — laksase, tirozinaza modellari</li>
                  <li><b>🌿 Yashil kimyo:</b> Ag(I), Au(I) NHC — antibakterial agent</li>
                  <li><b>💎 Materialshunoslik:</b> Cu(I) siyanid MOF — gaz saqlash, sensor</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 13. TAQQOSLASH */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="⚖️" title="13. Fazoviy shakllar taqqoslash jadvali" />
            <div className="overflow-x-auto rounded-xl border border-purple-500/25">
              <table className="w-full text-sm">
                <thead className="bg-purple-900/40 text-purple-200">
                  <tr>
                    <th className="p-3 text-left">Shakl</th><th className="p-3">K.Ch</th><th className="p-3">Burchak</th>
                    <th className="p-3">Gibrid</th><th className="p-3">Simmetriya</th><th className="p-3">CFSE</th><th className="p-3">Misol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/15 text-purple-100/90 text-center">
                  <tr><td className="p-3 text-left font-semibold">Chiziqli</td><td className="p-3">2</td><td className="p-3">180°</td><td className="p-3">sp</td><td className="p-3">D∞ₕ</td><td className="p-3">0</td><td className="p-3">[Ag(NH₃)₂]⁺</td></tr>
                  <tr className="bg-amber-500/10"><td className="p-3 text-left font-semibold text-amber-200">Trigonal-planar</td><td className="p-3">3</td><td className="p-3">120°</td><td className="p-3">sp²</td><td className="p-3">D₃ₕ</td><td className="p-3">0</td><td className="p-3">[Cu(CN)₃]²⁻</td></tr>
                  <tr><td className="p-3 text-left font-semibold">Trigonal-piramidal</td><td className="p-3">3</td><td className="p-3">&lt;120°</td><td className="p-3">sp³</td><td className="p-3">C₃ᵥ</td><td className="p-3">—</td><td className="p-3">NH₃ (lp bilan)</td></tr>
                  <tr><td className="p-3 text-left font-semibold">Tetraedrik</td><td className="p-3">4</td><td className="p-3">109.5°</td><td className="p-3">sp³</td><td className="p-3">Tₐ</td><td className="p-3">−0.53Δₒ</td><td className="p-3">[Zn(NH₃)₄]²⁺</td></tr>
                  <tr><td className="p-3 text-left font-semibold">Kvadrat-planar</td><td className="p-3">4</td><td className="p-3">90°</td><td className="p-3">dsp²</td><td className="p-3">D₄ₕ</td><td className="p-3">−1.22Δₒ</td><td className="p-3">[PtCl₄]²⁻</td></tr>
                  <tr><td className="p-3 text-left font-semibold">Trig.-bipiramidal</td><td className="p-3">5</td><td className="p-3">90/120°</td><td className="p-3">dsp³</td><td className="p-3">D₃ₕ</td><td className="p-3">−0.82Δₒ</td><td className="p-3">[Fe(CO)₅]</td></tr>
                  <tr><td className="p-3 text-left font-semibold">Oktaedrik</td><td className="p-3">6</td><td className="p-3">90°/180°</td><td className="p-3">d²sp³</td><td className="p-3">Oₕ</td><td className="p-3">−2.40Δₒ</td><td className="p-3">[Co(NH₃)₆]³⁺</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 14. TESTLAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="🎯" title="14. O'z-o'zini tekshirish savollari" />
            <SelfTest />
          </section>

          {/* 15. ADABIYOTLAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <SectionTitle icon="📚" title="15. Ilmiy adabiyotlar va manbalar" />
            <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5">
              <h4 className="font-bold text-amber-200 mb-3">Xalqaro darsliklar</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-purple-100/85">
                <li>Housecroft, C.E.; Sharpe, A.G. <i>Inorganic Chemistry</i>, 5th ed., Pearson, 2018.</li>
                <li>Miessler, G.L.; Fischer, P.J.; Tarr, D.A. <i>Inorganic Chemistry</i>, 5th ed., Pearson, 2014.</li>
                <li>Cotton, F.A.; Wilkinson, G.; Murillo, C.A.; Bochmann, M. <i>Advanced Inorganic Chemistry</i>, 6th ed., Wiley, 1999.</li>
                <li>Greenwood, N.N.; Earnshaw, A. <i>Chemistry of the Elements</i>, 2nd ed., Butterworth-Heinemann, 1997.</li>
                <li>Crabtree, R.H. <i>The Organometallic Chemistry of the Transition Metals</i>, 7th ed., Wiley, 2019.</li>
                <li>Hartwig, J.F. <i>Organotransition Metal Chemistry</i>, University Science Books, 2010.</li>
                <li>Atkins, P.; Overton, T. et al. <i>Shriver &amp; Atkins Inorganic Chemistry</i>, 6th ed., OUP, 2014.</li>
              </ol>
              <h4 className="font-bold text-amber-200 mt-4 mb-3">Muhim ilmiy maqolalar</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-purple-100/85" start={8}>
                <li>Bowmaker, G.A. et al. J. Chem. Soc. Dalton Trans. <b>1997</b>, 4227.</li>
                <li>Ugo, R. Coord. Chem. Rev. <b>1968</b>, 3, 319.</li>
                <li>Pyykkö, P. Chem. Rev. <b>1988</b>, 88, 563.</li>
                <li>Persson, I. et al. Inorg. Chem. <b>2002</b>, 41, 3820.</li>
                <li>Bertrand, G. et al. Science <b>2007</b>, 316, 439.</li>
                <li>Yam, V.W.-W. et al. Chem. Rev. <b>2015</b>, 115, 7589.</li>
              </ol>
              <h4 className="font-bold text-amber-200 mt-4 mb-3">O'zbek va rus tilidagi manbalar</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-purple-100/85" start={14}>
                <li>Parpiyev N.A., Rahimov H.R., Muftaxov A.G. <i>Anorganik kimyo</i>. — T.: O'zbekiston, 2003.</li>
                <li>Ismatov N., Yormatova S. <i>Kompleks birikmalar kimyosi</i>. — T.: TDPU, 2015.</li>
                <li>Karimov M.M., Nazarov R. <i>Koordinatsion birikmalar kimyosi</i>. — T.: Fan, 2018.</li>
                <li>Ключников Н.Г. <i>Химия комплексных соединений</i>. — М.: Химия, 1997.</li>
                <li>Скопенко В.В. и др. <i>Координационная химия</i>. — М.: Академкнига, 2007.</li>
              </ol>
              <h4 className="font-bold text-amber-200 mt-4 mb-3">Ma'lumotlar bazalari</h4>
              <ol className="list-decimal list-inside space-y-1 text-[12px] text-purple-100/85" start={19}>
                <li><b>CSD</b> — Cambridge Structural Database (1.2M+ struktura)</li>
                <li><b>ICSD</b> — Inorganic Crystal Structure Database</li>
                <li><b>IUPAC 2005</b> — Red Book (Nomenclature of Inorganic Chemistry)</li>
                <li><b>NIST WebBook</b> — spektroskopik ma'lumotlar</li>
              </ol>
            </div>
          </section>

          <footer className="border-t border-purple-500/25 mt-10 py-8 text-center text-xs text-purple-300/70">
            <div className="mb-2">© <b className="text-amber-300">jdakimyo.uz</b> — Kompleks birikmalarning fazoviy tuzilishi</div>
            <div>Trigonal-planar (D₃ₕ) bo'limi</div>
            <div className="mt-3 text-[10px] text-purple-300/50">
              Kristallografik ma'lumotlar: CSD/ICSD. Spektroskopik ma'lumotlar: NIST WebBook, Springer, Elsevier.
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════
function ToggleRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-[11px] text-purple-100 cursor-pointer">
      <span>{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition ${value ? "bg-amber-500" : "bg-purple-800/60"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${value ? "left-4" : "left-0.5"}`} />
      </button>
    </label>
  )
}

function PanelButton({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left text-[11px] px-2 py-1.5 rounded transition ${active ? "bg-amber-500/25 border border-amber-400/50 text-amber-100" : "bg-purple-800/40 border border-purple-500/25 text-purple-100 hover:bg-purple-700/40"}`}>
      {label}
    </button>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-amber-200 mb-4">
      <span className="text-2xl">{icon}</span><span>{title}</span>
    </h3>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-5 text-sm text-purple-100/90 leading-relaxed">
      <h4 className="font-bold text-amber-200 mb-2">{title}</h4>
      <div>{children}</div>
    </div>
  )
}

function ReactionRow({ eq, note }) {
  return (
    <div className="rounded-lg border border-purple-500/25 bg-purple-900/25 px-4 py-3">
      <div className="font-mono text-amber-200 text-sm">{eq}</div>
      {note && <div className="text-xs text-purple-200/75 mt-1">{note}</div>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// INFO / HYBRID / MO / IR / UV / WALSH / CHARACTER PANELS
// ═══════════════════════════════════════════════════════════════════════════
function InfoPanel({ complex }) {
  return (
    <div className="space-y-1.5">
      <Row k="Formula" v={complex.formula} />
      <Row k="Nomi" v={complex.name} />
      <Row k="Ichki tuz" v={complex.fullSalt} />
      <Row k="Geometriya" v={`${complex.geometry} (${complex.symmetry})`} />
      <Row k="Gibrid" v={complex.hybridization} />
      <Row k="Magnit" v={complex.magnetism} />
      <Row k="d-konfig" v={complex.dConfig} />
      <Row k="Rang" v={complex.color} />
      <Row k="Zichlik" v={complex.density} />
      <Row k="M–L bog'" v={`${complex.bondLengthReal} (CSD: ${complex.bondLengthCSD})`} />
      <Row k="Burchak" v={`${complex.bondAngle}°`} />
      <Row k="β₃" v={complex.thermo.beta3.toExponential(2)} />
    </div>
  )
}
function Row({ k, v }) {
  return <div><b className="text-amber-200">{k}:</b> <span className="text-purple-100/90">{v}</span></div>
}

function HybridPanel({ complex }) {
  return (
    <div className="space-y-2">
      <p><b className="text-amber-200">Jarayon:</b></p>
      <div className="font-mono text-[11px] bg-black/40 rounded p-2">
        {complex.center.element}: [Ar/Kr/Xe] (n-1)d¹⁰ ns¹⁻²<br/>
        1 s + 2 p → 3 sp² (120°, tekislikda)<br/>
        p<sub>z</sub> → aralashmasdan qoladi
      </div>
      <p>
        Har bir sp² orbital ligand donorining elektron juftini qabul qiladi (σ-dativ bog').
        Metallning to'ldirilgan e″ (dxz, dyz) orbitallari ligandning π* orbitaliga qaytaradi (π-back-donation).
      </p>
      <div className="font-mono text-[11px] bg-black/40 rounded p-2">
        Bog' tartibi ≈ 1 (σ) + 0.2–0.4 (π*) = <b>1.2–1.4</b>
      </div>
    </div>
  )
}

function MOPanel({ complex }) {
  return (
    <div className="space-y-2">
      <p>D₃ₕ nuqta guruhida bog' MO simmetriyasi:</p>
      <div className="font-mono text-[11px] bg-black/40 rounded p-2 space-y-0.5">
        <div>σ (a₁') — s + d<sub>z²</sub> + φ(a₁')</div>
        <div>σ (e') — (pₓ, p<sub>y</sub>) + (d<sub>xy</sub>, d<sub>x²−y²</sub>) + φ(e')</div>
        <div>nb (e″) — d<sub>xz</sub>, d<sub>yz</sub> (bog'lamas)</div>
        <div>nb (a₂″) — p<sub>z</sub> (π uchun)</div>
        <div>σ* (a₁', e') — bo'shashuvchi</div>
      </div>
      <p>
        {complex.formula} da: 3 ta σ bog'lovchi orbital 6 elektron bilan to'ldirilgan.
        d¹⁰ elektronlar bog'lamas e″ + a₁' + e' orbitallarga tushadi.
      </p>
    </div>
  )
}

function IRPanel({ complex }) {
  return (
    <div className="space-y-2">
      <p><b className="text-amber-200">IR/Raman tarmoqlari:</b></p>
      <div className="space-y-1">
        {complex.IR.map((b, i) => (
          <div key={i} className="bg-black/30 rounded px-2 py-1 text-[11px] flex justify-between">
            <span className="font-mono text-amber-200">{b.freq} sm⁻¹</span>
            <span className="text-purple-200/85">{b.mode}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-purple-300/70 italic mt-2">
        Selektsiya qoidalari: A₁' — faqat Raman; A₂″ — faqat IR; E' — ikkalasi ham
      </div>
    </div>
  )
}

function UVPanel({ complex }) {
  return (
    <div className="space-y-2">
      <p><b className="text-amber-200">UV-Vis yutilish tarmoqlari:</b></p>
      <div className="space-y-1">
        {complex.UV.map((b, i) => (
          <div key={i} className="bg-black/30 rounded px-2 py-1 text-[11px]">
            <div className="flex justify-between">
              <span className="font-mono text-amber-200">λ = {b.wl} nm</span>
              <span className="text-purple-200/85">ε = {b.epsilon}</span>
            </div>
            <div className="text-purple-300/80 mt-0.5">{b.assignment}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-purple-300/70 italic mt-2">
        d¹⁰ → d–d o'tish yo'q, faqat MLCT / LMCT / π→π*
      </div>
    </div>
  )
}

function WalshPanel() {
  return (
    <div className="space-y-2">
      <p>Walsh diagrammasi molekula geometriyasini o'zgartirganda MO energiyasi o'zgarishini ko'rsatadi.</p>
      <div className="font-mono text-[11px] bg-black/40 rounded p-2">
        α = tekislikdan chiqish burchagi<br/>
        α = 0° → D₃ₕ (tekis)<br/>
        α &gt; 0° → C₃ᵥ (piramidal)
      </div>
      <p>Valent elektronlar soniga qarab optimal geometriya:</p>
      <ul className="list-disc list-inside text-[11px] space-y-0.5">
        <li>6 e⁻ (BF₃) → tekis D₃ₕ</li>
        <li>8 e⁻ (NH₃) → piramidal C₃ᵥ (α ≈ 22°)</li>
        <li>16 e⁻ (d¹⁰ ML₃) → tekis D₃ₕ</li>
      </ul>
    </div>
  )
}

function CharacterTablePanel() {
  return (
    <div className="space-y-2">
      <p><b className="text-amber-200">D₃ₕ nuqta guruhi (|G|=12):</b></p>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono border-collapse">
          <thead>
            <tr className="bg-purple-900/50">
              <th className="p-1 border border-purple-500/30 text-left">Γ</th>
              {D3H_CHARACTER_TABLE.operations.map(op => (
                <th key={op} className="p-1 border border-purple-500/30 text-center">{op}</th>
              ))}
              <th className="p-1 border border-purple-500/30">Chiziqli</th>
              <th className="p-1 border border-purple-500/30">Kvadratik</th>
            </tr>
          </thead>
          <tbody>
            {D3H_CHARACTER_TABLE.reps.map(r => (
              <tr key={r.name}>
                <td className="p-1 border border-purple-500/30 font-bold text-amber-200">{r.name}</td>
                {r.chars.map((c, i) => (
                  <td key={i} className="p-1 border border-purple-500/30 text-center">{c}</td>
                ))}
                <td className="p-1 border border-purple-500/30 text-purple-200/85">{r.linear}</td>
                <td className="p-1 border border-purple-500/30 text-purple-200/85">{r.quadratic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-purple-300/70 italic">Operatorlar: 12 element (E, 2C₃, 3C₂, σₕ, 2S₃, 3σᵥ)</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HYBRID DIAGRAMMA (SVG)
// ═══════════════════════════════════════════════════════════════════════════
function HybridDiagram() {
  return (
    <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-900/30 to-pink-900/20 p-6">
      <svg viewBox="0 0 800 340" className="w-full max-w-3xl mx-auto">
        {/* Chap: boshlang'ich AO */}
        <text x="80" y="30" fill="#c4b5fd" fontSize="14" fontWeight="bold" textAnchor="middle">Boshlang'ich AO</text>
        <line x1="30" y1="80" x2="130" y2="80" stroke="#60a5fa" strokeWidth="2" />
        <text x="15" y="85" fill="#60a5fa" fontSize="12">s</text>
        <text x="140" y="85" fill="#93c5fd" fontSize="10">E ≈ −8 eV</text>
        {[0, 1, 2].map(i => (
          <g key={i}>
            <line x1="30" y1={180 + i * 15} x2="130" y2={180 + i * 15} stroke="#f87171" strokeWidth="2" />
            <text x="140" y={185 + i * 15} fill="#fca5a5" fontSize="10">p{["x","y","z"][i]}</text>
          </g>
        ))}
        <text x="15" y="205" fill="#f87171" fontSize="12">p</text>
        <text x="140" y="235" fill="#fca5a5" fontSize="10">E ≈ −4 eV</text>

        {/* O'q */}
        <line x1="220" y1="150" x2="340" y2="150" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="280" y="140" fill="#fde047" fontSize="11" textAnchor="middle">gibridlanish</text>
        <text x="280" y="170" fill="#fde047" fontSize="10" textAnchor="middle" fontStyle="italic">3 × sp²</text>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
          </marker>
        </defs>

        {/* O'ng: gibrid sp² */}
        <text x="550" y="30" fill="#fde047" fontSize="14" fontWeight="bold" textAnchor="middle">Gibrid orbitallar</text>
        {[0, 1, 2].map(i => (
          <g key={i}>
            <line x1="450" y1={120 + i * 25} x2="550" y2={120 + i * 25} stroke="#f59e0b" strokeWidth="2.5" />
            <text x="560" y={125 + i * 25} fill="#fbbf24" fontSize="11">sp²({i+1})</text>
          </g>
        ))}
        <text x="440" y="175" fill="#fbbf24" fontSize="11" textAnchor="end">3 × sp²</text>
        <text x="560" y="220" fill="#fde047" fontSize="10">E ≈ −5.3 eV</text>

        {/* p_z bog'lanmagan */}
        <line x1="450" y1="240" x2="550" y2="240" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4" />
        <text x="560" y="245" fill="#c4b5fd" fontSize="11">p<tspan fontSize="8" dy="3">z</tspan> (nb)</text>
        <text x="440" y="245" fill="#c4b5fd" fontSize="10" textAnchor="end">bog'lamas</text>

        {/* Pastdagi izoh */}
        <text x="400" y="310" fill="#e9d5ff" fontSize="11" textAnchor="middle">
          33.3% s + 66.7% p — 120° burchakli 3 ta ekvivalent sp² orbital
        </text>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MO DIAGRAMMA (SVG)
// ═══════════════════════════════════════════════════════════════════════════
function MODiagram() {
  return (
    <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-900/30 to-pink-900/20 p-6">
      <svg viewBox="0 0 900 500" className="w-full max-w-4xl mx-auto">
        {/* Metall AO — chap */}
        <text x="120" y="30" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">Metall AO</text>
        <line x1="50" y1="120" x2="190" y2="120" stroke="#f472b6" strokeWidth="2" />
        <text x="200" y="125" fill="#fbcfe8" fontSize="11">(n+1)p (a₂″ + e')</text>
        <line x1="50" y1="180" x2="190" y2="180" stroke="#f472b6" strokeWidth="2" />
        <text x="200" y="185" fill="#fbcfe8" fontSize="11">(n+1)s (a₁')</text>
        <line x1="50" y1="320" x2="190" y2="320" stroke="#f472b6" strokeWidth="2" />
        <text x="200" y="325" fill="#fbcfe8" fontSize="11">nd (a₁' + e' + e″)</text>
        <text x="40" y="325" fill="#fbcfe8" fontSize="10">↑↓×5</text>

        {/* Ligand SALC — o'ng */}
        <text x="780" y="30" fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="middle">3L SALC</text>
        <line x1="710" y1="270" x2="850" y2="270" stroke="#60a5fa" strokeWidth="2" />
        <text x="690" y="275" fill="#bfdbfe" fontSize="11" textAnchor="end">a₁' + e'</text>
        <text x="860" y="275" fill="#bfdbfe" fontSize="10">↑↓×3</text>

        {/* MO — markazda */}
        <text x="450" y="30" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">Molekulyar orbitallar</text>

        <line x1="380" y1="90" x2="520" y2="90" stroke="#f87171" strokeWidth="2.5" />
        <text x="530" y="95" fill="#fca5a5" fontSize="11">σ* (e')</text>
        <line x1="380" y1="115" x2="520" y2="115" stroke="#f87171" strokeWidth="2.5" />
        <text x="530" y="120" fill="#fca5a5" fontSize="11">σ* (a₁')</text>

        <line x1="380" y1="200" x2="520" y2="200" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4" />
        <text x="530" y="205" fill="#ddd6fe" fontSize="11">p<tspan fontSize="8" dy="3">z</tspan> (a₂″, nb)</text>

        <line x1="380" y1="260" x2="520" y2="260" stroke="#34d399" strokeWidth="2.5" />
        <text x="530" y="265" fill="#a7f3d0" fontSize="11">d nb (e″)</text>
        <text x="360" y="265" fill="#a7f3d0" fontSize="10" textAnchor="end">↑↓ ↑↓</text>

        <line x1="380" y1="290" x2="520" y2="290" stroke="#34d399" strokeWidth="2.5" />
        <text x="530" y="295" fill="#a7f3d0" fontSize="11">d nb (a₁')</text>
        <text x="360" y="295" fill="#a7f3d0" fontSize="10" textAnchor="end">↑↓</text>

        <line x1="380" y1="320" x2="520" y2="320" stroke="#34d399" strokeWidth="2.5" />
        <text x="530" y="325" fill="#a7f3d0" fontSize="11">d nb (e')</text>
        <text x="360" y="325" fill="#a7f3d0" fontSize="10" textAnchor="end">↑↓ ↑↓</text>

        <line x1="380" y1="400" x2="520" y2="400" stroke="#fbbf24" strokeWidth="3" />
        <text x="530" y="405" fill="#fde047" fontSize="11">σ (e')</text>
        <text x="360" y="405" fill="#fde047" fontSize="10" textAnchor="end">↑↓ ↑↓</text>

        <line x1="380" y1="430" x2="520" y2="430" stroke="#fbbf24" strokeWidth="3" />
        <text x="530" y="435" fill="#fde047" fontSize="11">σ (a₁')</text>
        <text x="360" y="435" fill="#fde047" fontSize="10" textAnchor="end">↑↓</text>

        {/* Bog'lash chiziqlari */}
        <line x1="190" y1="180" x2="380" y2="430" stroke="#a78bfa" strokeWidth="0.6" strokeDasharray="3" opacity="0.5" />
        <line x1="190" y1="180" x2="380" y2="115" stroke="#a78bfa" strokeWidth="0.6" strokeDasharray="3" opacity="0.5" />
        <line x1="710" y1="270" x2="520" y2="430" stroke="#a78bfa" strokeWidth="0.6" strokeDasharray="3" opacity="0.5" />
        <line x1="710" y1="270" x2="520" y2="115" stroke="#a78bfa" strokeWidth="0.6" strokeDasharray="3" opacity="0.5" />

        {/* Energiya o'qi */}
        <line x1="30" y1="80" x2="30" y2="470" stroke="#fff" strokeWidth="1" markerEnd="url(#arrEnergy)" />
        <text x="20" y="75" fill="#fff" fontSize="11">E</text>
        <defs>
          <marker id="arrEnergy" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#fff" />
          </marker>
        </defs>

        {/* Izoh */}
        <text x="450" y="490" fill="#e9d5ff" fontSize="10" textAnchor="middle">
          Elektronlar (d¹⁰ + 3σ = 16 e⁻): 6 e⁻ σ bog'lash + 10 e⁻ bog'lamas d-orbitallarda
        </text>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IR SPEKTR (SVG bar chart)
// ═══════════════════════════════════════════════════════════════════════════
function IRSpectrum({ bands }) {
  const maxFreq = 2500
  return (
    <div className="text-[11px]">
      <svg viewBox="0 0 500 220" className="w-full">
        <line x1="30" y1="180" x2="490" y2="180" stroke="#a78bfa" strokeWidth="1" />
        <line x1="30" y1="20" x2="30" y2="180" stroke="#a78bfa" strokeWidth="1" />
        {[0, 500, 1000, 1500, 2000, 2500].map(f => {
          const x = 30 + (f / maxFreq) * 460
          return (
            <g key={f}>
              <line x1={x} y1={180} x2={x} y2={184} stroke="#a78bfa" />
              <text x={x} y={198} fill="#c4b5fd" fontSize="8" textAnchor="middle">{f}</text>
            </g>
          )
        })}
        <text x="260" y="215" fill="#c4b5fd" fontSize="10" textAnchor="middle">chastota (sm⁻¹)</text>
        <text x="15" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 15, 100)">yutilish</text>

        {bands.map((b, i) => {
          const x = 30 + (b.freq / maxFreq) * 460
          const intense = b.intensity.includes("kuchli") || b.intensity.includes("juda") ? 140 : b.intensity.includes("Raman") ? 80 : 100
          const color = b.mode.includes("A₁") ? "#f472b6" : b.mode.includes("A₂") ? "#60a5fa" : "#fbbf24"
          return (
            <g key={i}>
              <line x1={x} y1={180} x2={x} y2={180 - intense} stroke={color} strokeWidth="2.5" />
              <circle cx={x} cy={180 - intense} r="3" fill={color} />
              <text x={x} y={180 - intense - 8} fill={color} fontSize="8" textAnchor="middle">{b.freq}</text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 space-y-1">
        {bands.map((b, i) => (
          <div key={i} className="flex justify-between text-[10px] bg-black/25 rounded px-2 py-1">
            <span className="font-mono text-amber-200">{b.freq}</span>
            <span className="text-purple-200/85">{b.mode}</span>
            <span className="text-purple-300/70 italic">{b.intensity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// UV-VIS SPEKTR
// ═══════════════════════════════════════════════════════════════════════════
function UVSpectrum({ bands }) {
  const minWl = 180, maxWl = 500
  const maxEps = Math.max(...bands.map(b => b.epsilon)) * 1.15
  return (
    <div className="text-[11px]">
      <svg viewBox="0 0 500 220" className="w-full">
        {/* UV-Vis rangli gradient */}
        <defs>
          <linearGradient id="uvBg" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.3"/>
            <stop offset="0.15" stopColor="#6366f1" stopOpacity="0.3"/>
            <stop offset="0.4" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="0.55" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="0.7" stopColor="#eab308" stopOpacity="0.3"/>
            <stop offset="0.85" stopColor="#f97316" stopOpacity="0.3"/>
            <stop offset="1" stopColor="#ef4444" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        <rect x="30" y="20" width="460" height="160" fill="url(#uvBg)" />

        <line x1="30" y1="180" x2="490" y2="180" stroke="#a78bfa" strokeWidth="1" />
        <line x1="30" y1="20" x2="30" y2="180" stroke="#a78bfa" strokeWidth="1" />
        {[200, 250, 300, 350, 400, 450, 500].map(w => {
          const x = 30 + ((w - minWl) / (maxWl - minWl)) * 460
          return (
            <g key={w}>
              <line x1={x} y1={180} x2={x} y2={184} stroke="#a78bfa" />
              <text x={x} y={198} fill="#c4b5fd" fontSize="8" textAnchor="middle">{w}</text>
            </g>
          )
        })}
        <text x="260" y="215" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
        <text x="15" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 15, 100)">ε (M⁻¹·sm⁻¹)</text>

        {/* Yutilish Gauss egri chizig'i */}
        <path d={bands.map((b, i) => {
          const x = 30 + ((b.wl - minWl) / (maxWl - minWl)) * 460
          const y = 180 - (b.epsilon / maxEps) * 155
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')} stroke="#fbbf24" strokeWidth="2" fill="none" />

        {bands.map((b, i) => {
          const x = 30 + ((b.wl - minWl) / (maxWl - minWl)) * 460
          const y = 180 - (b.epsilon / maxEps) * 155
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#f472b6" />
              <text x={x} y={y - 8} fill="#fbcfe8" fontSize="8" textAnchor="middle">{b.wl} nm</text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 space-y-1">
        {bands.map((b, i) => (
          <div key={i} className="text-[10px] bg-black/25 rounded px-2 py-1">
            <div className="flex justify-between">
              <span className="font-mono text-amber-200">λ = {b.wl} nm</span>
              <span className="text-purple-200/85">ε = {b.epsilon.toLocaleString()}</span>
            </div>
            <div className="text-purple-300/70 italic mt-0.5">{b.assignment}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SPEKTROKIMYOVIY QATOR (bar chart)
// ═══════════════════════════════════════════════════════════════════════════
function SpectrochemicalChart({ data }) {
  return (
    <div className="space-y-2">
      {data.map(l => {
        const width = l.strength * 100
        const color = l.strength < 0.6 ? "#60a5fa" : l.strength < 1.0 ? "#34d399" : "#f472b6"
        return (
          <div key={l.l} className="flex items-center gap-3 text-[12px]">
            <div className="w-16 text-right text-amber-200 font-mono">{l.l}</div>
            <div className="flex-1 h-5 bg-black/30 rounded overflow-hidden relative">
              <div className="h-full rounded transition-all" style={{ width: `${width}%`, background: color }} />
              <div className="absolute inset-0 flex items-center px-2 text-[10px] text-white/90 font-bold">
                {l.strength.toFixed(2)} Δₒ
              </div>
            </div>
            <div className="w-40 text-[10px] text-purple-200/75 italic">{l.type}</div>
          </div>
        )
      })}
      <div className="mt-4 text-[10px] text-purple-300/70 italic border-t border-purple-500/20 pt-2">
        <b>Kuchayish tartibi:</b> I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; PPh₃ &lt; CN⁻ &lt; CO
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// WALSH DIAGRAMMASI (SVG)
// ═══════════════════════════════════════════════════════════════════════════
function WalshDiagram() {
  return (
    <div className="mt-3">
      <svg viewBox="0 0 400 220" className="w-full">
        <line x1="30" y1="200" x2="380" y2="200" stroke="#a78bfa" strokeWidth="1" />
        <line x1="30" y1="20" x2="30" y2="200" stroke="#a78bfa" strokeWidth="1" />
        <text x="30" y="215" fill="#c4b5fd" fontSize="10" textAnchor="middle">0°</text>
        <text x="205" y="215" fill="#c4b5fd" fontSize="10" textAnchor="middle">D₃ₕ ↔ C₃ᵥ</text>
        <text x="380" y="215" fill="#c4b5fd" fontSize="10" textAnchor="middle">30°</text>
        <text x="15" y="15" fill="#c4b5fd" fontSize="10">E</text>

        {/* Piramidalanishda pastga tushuvchi (a₁') */}
        <path d="M 30 130 Q 200 100 380 60" stroke="#34d399" strokeWidth="2" fill="none" />
        <text x="385" y="60" fill="#a7f3d0" fontSize="10">a₁' (s+d<tspan fontSize="7" dy="3">z²</tspan>)</text>

        {/* Yuqoriga (e') */}
        <path d="M 30 80 Q 200 120 380 170" stroke="#f472b6" strokeWidth="2" fill="none" />
        <text x="385" y="170" fill="#fbcfe8" fontSize="10">e'</text>

        {/* p_z (nb) */}
        <path d="M 30 45 Q 200 60 380 90" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4" fill="none" />
        <text x="385" y="90" fill="#fde047" fontSize="10">p<tspan fontSize="7" dy="3">z</tspan></text>

        <line x1="30" y1="20" x2="30" y2="200" stroke="#fbbf24" strokeDasharray="3" opacity="0.5"/>
        <line x1="380" y1="20" x2="380" y2="200" stroke="#fbbf24" strokeDasharray="3" opacity="0.5"/>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// O'Z-O'ZINI TEKSHIRISH TESTI
// ═══════════════════════════════════════════════════════════════════════════
function SelfTest() {
  const questions = [
    { q: "Trigonal-planar geometriyada bog' burchagi qanday?", opts: ["90°", "109.5°", "120°", "180°"], correct: 2 },
    { q: "Trigonal-planar komplekslar uchun xarakterli gibridlanish:", opts: ["sp", "sp²", "sp³", "d²sp³"], correct: 1 },
    { q: "D₃ₕ nuqta guruhi tartibi (|G|) nechaga teng?", opts: ["6", "8", "12", "24"], correct: 2 },
    { q: "d¹⁰ trigonal-planar kompleksda CFSE qiymati:", opts: ["−1.22 Δₒ", "−0.53 Δₒ", "0", "+0.44 Δₒ"], correct: 2 },
    { q: "Qaysi ligand π-akseptor sifatida eng kuchli?", opts: ["I⁻", "H₂O", "NH₃", "CN⁻"], correct: 3 },
    { q: "Trigonal-planar d¹⁰ tizim necha valent elektronga ega?", opts: ["12", "14", "16", "18"], correct: 2 },
    { q: "Nessler reagentida qaysi kompleks ishlatiladi?", opts: ["[Cu(CN)₃]²⁻", "K₂[HgI₄]", "[Pt(PPh₃)₃]", "[Ag(CN)₂]⁻"], correct: 1 },
    { q: "Sianidli oltinni ekstraksiya jarayonida hosil bo'lgan asosiy kompleks:", opts: ["[Au(CN)₂]⁻", "[Au(CN)₄]³⁻", "K[Au(NH₃)₂]", "[AuCl₃]"], correct: 0 },
    { q: "d¹⁰ ML₃ tizimida Jahn-Teller effekti:", opts: ["Kuchli", "Zaif", "Yo'q (orbital degeneratsiya yo'q)", "Faqat past haroratda"], correct: 2 },
    { q: "IR spektroskopiyasida A₁' tebranish qanday?", opts: ["Faqat IR-faol", "Faqat Raman-faol", "IR + Raman", "Ikkalasida ham faol emas"], correct: 1 }
  ]
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const score = Object.entries(answers).filter(([i, a]) => questions[i].correct === a).length

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-purple-500/25 bg-purple-900/20 p-4">
          <div className="text-sm text-purple-100 mb-2 font-semibold">{i + 1}. {q.q}</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {q.opts.map((opt, j) => {
              const isSelected = answers[i] === j
              const isCorrect = showResult && q.correct === j
              const isWrong = showResult && isSelected && q.correct !== j
              return (
                <button key={j} onClick={() => !showResult && setAnswers({ ...answers, [i]: j })}
                  className={`text-left text-[12px] px-3 py-2 rounded-lg border transition ${isCorrect ? "bg-emerald-500/25 border-emerald-400 text-emerald-100" : isWrong ? "bg-red-500/25 border-red-400 text-red-100" : isSelected ? "bg-amber-500/20 border-amber-400 text-amber-100" : "bg-purple-800/40 border-purple-500/30 text-purple-200 hover:border-purple-400"}`}>
                  <span className="font-bold mr-1">{"ABCD"[j]})</span>{opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button onClick={() => setShowResult(true)}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold text-sm">
          Natijani ko'rish
        </button>
        <button onClick={() => { setAnswers({}); setShowResult(false); }}
          className="px-4 py-2 rounded-lg bg-purple-700/50 border border-purple-400/50 text-purple-100 text-sm">
          Qaytadan
        </button>
        {showResult && (
          <div className="text-lg font-bold text-amber-200">
            Natija: {score} / {questions.length} ({Math.round(score / questions.length * 100)}%)
          </div>
        )}
      </div>
    </div>
  )
}
