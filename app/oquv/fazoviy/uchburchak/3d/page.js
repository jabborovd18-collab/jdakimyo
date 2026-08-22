"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🔻 UCHBURCHAK PLANAR GEOMETRIYA (D₃ₕ — KS 3) — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/uchburchak/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createCNLigand,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D3h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "uchburchak",
  name: "Uchburchak planar",
  icon: "🔻",
  angle: "120.0°",
  ks: 3,
  hybridization: "sp²",
  symmetry: "D₃ₕ",
  backUrl: "/oquv/fazoviy/uchburchak",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Trigonal-planar (D3h) maydonda d-orbitallarning 3 sathga ajralishi:",
    deltaSymbol: "Δ",
    deltaValue: "18 000–21 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "e' (dxy, dx²-y²)", energy: "+0.55 Δ (Ligand tekisligida, yuqori sath)", type: "high" },
      { label: "e'' (dxz, dyz)", energy: "-0.10 Δ (Tekislikdan tashqarida, o'rta sath)", type: "mid" },
      { label: "a₁' (dz²)", energy: "-0.70 Δ (Eng pastki sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (CSD kristallografiya va spektroskopik o'lchovlar)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CuCN: {
    id: "CuCN",
    formula: "[Cu(CN)₃]²⁻",
    fullSalt: "K₂[Cu(CN)₃]·H₂O",
    name: "Kaliy tritsianokuprat(I) monohidrat",
    center: { element: "Cu", color: 0xC88033, radius: 0.45, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.05,
    bondLengthReal: "1.935 Å",
    bondLengthCSD: "1.93–1.96 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp²",
    magnetism: "Diamagnit (μ_eff = 0)",
    color: "Rangsiz kristall",
    density: "1.85 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D₃ₕ",
    bondAngle: 120,
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 20000 },
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
    thermo: { logK1: 5.63, logK2: 10.53, logK3: 13.61, beta3: 4.07e13, dH: -85.2, dS: 45.6 },
    magProps: { chi: -3.4e-6, xM: -75e-6, diamagnetic: true },
    references: ["Bowmaker et al., J. Chem. Soc. Dalton 1997, 4227", "Chadwick, Frankiss, J. Mol. Struct. 1976, 31, 1"],
    coordNumber: 3
  },
  HgI: {
    id: "HgI",
    formula: "[HgI₃]⁻",
    fullSalt: "K[HgI₃] (Nessler asosi)",
    name: "Kaliy triyodomerkurat(II)",
    center: { element: "Hg", color: 0xB8B8D0, radius: 0.55, charge: "+2", oxState: 2 },
    ligand: { type: "I", donor: "I", donorColor: 0x940094, donorRadius: 0.42, denticity: 1 },
    bondLength: 2.70,
    bondLengthReal: "2.724 Å",
    bondLengthCSD: "2.68–2.75 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp² (+ 5d aralashuvi)",
    magnetism: "Diamagnit",
    color: "To'q sariq–qizil kristall",
    density: "5.24 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D₃ₕ (buzilgan C₂ᵥ)",
    bondAngle: 120,
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 18000 },
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
    references: ["Persson et al., Inorg. Chem. 2002, 41, 3820", "Sandström, Persson, J. Chem. Soc. Dalton 1978, 1794"],
    coordNumber: 3
  },
  PtPPh3: {
    id: "PtPPh3",
    formula: "[Pt(PPh₃)₃]",
    fullSalt: "Tris(trifenilfosfin)platina(0)",
    name: "[Pt(PPh₃)₃] — Malatesta kompleksi",
    center: { element: "Pt", color: 0xD0D0E0, radius: 0.50, charge: "0", oxState: 0 },
    ligand: { type: "PPh3", donor: "P", donorColor: 0xFF8000, donorRadius: 0.38, denticity: 1 },
    bondLength: 2.45,
    bondLengthReal: "2.263 Å",
    bondLengthCSD: "2.25–2.28 Å",
    outerIon: null,
    hybridization: "sp² (dₓᵧ + dₓ²₋ᵧ² aralashuvli)",
    magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall",
    density: "1.68 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D₃ (approx. D₃ₕ)",
    bondAngle: 120,
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 22000 },
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
    references: ["Ugo, Cariati, La Monica, Inorg. Synth. 1968, 11, 105", "Albinati et al., Inorg. Chim. Acta 1990, 168, 213"],
    coordNumber: 3
  },
  AgCN: {
    id: "AgCN",
    formula: "[Ag(CN)₃]²⁻",
    fullSalt: "K₂[Ag(CN)₃]",
    name: "Kaliy tritsianoargentat(I)",
    center: { element: "Ag", color: 0xC0C0C0, radius: 0.48, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.25,
    bondLengthReal: "2.135 Å",
    bondLengthCSD: "2.11–2.16 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp² (5d aralashuvli)",
    magnetism: "Diamagnit",
    color: "Rangsiz kristall",
    density: "2.36 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D₃ₕ",
    bondAngle: 120,
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 21000 },
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
    references: ["Bowmaker, Kennedy, Reid, Inorg. Chem. 1998, 37, 3968"],
    coordNumber: 3
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. UCHBURCHAK PLANAR 3D GEOMETRIYANI QURISH (D3h — 120°)
// ═══════════════════════════════════════════════════════════════════════════
function buildTrigonalPlanarGeometry(molGroup, complexData, refs, state) {
  const { atomsRef, labelsRef, bondLabelsRef, bondsRef } = refs
  const center = complexData.center
  const centerPos = new THREE.Vector3(0, 0, 0)

  // Markaziy atom
  const centerGeo = new THREE.SphereGeometry(center.radius, 48, 48)
  const centerMat = new THREE.MeshStandardMaterial({
    color: center.color,
    roughness: 0.2,
    metalness: 0.8,
    emissive: center.color,
    emissiveIntensity: 0.1
  })
  const centerAtom = new THREE.Mesh(centerGeo, centerMat)
  centerAtom.position.copy(centerPos)
  centerAtom.userData = {
    type: "atom",
    element: center.element,
    info: ATOM_INFO[center.element] || { name: center.element },
    baseScale: state.scale
  }
  centerAtom.castShadow = true
  centerAtom.receiveShadow = true
  molGroup.add(centerAtom)
  if (atomsRef?.current) atomsRef.current.push(centerAtom)

  // Markaziy atom yorlig'i
  const formatCenterCharge = (elem, ch) => {
    if (ch === "+3") return `${elem}³⁺`
    if (ch === "+2") return `${elem}²⁺`
    if (ch === "+1") return `${elem}⁺`
    if (ch === "0") return `${elem}⁰`
    return `${elem}${ch}`
  }

  const centerLabel = makeTextSprite(formatCenterCharge(center.element, center.charge), {
    color: "#ffffff",
    bgColor: "rgba(30, 10, 60, 0.9)",
    borderColor: "#c084fc",
    scale: 0.32
  })
  centerLabel.position.copy(centerPos).add(new THREE.Vector3(0, center.radius + 0.35, 0))
  molGroup.add(centerLabel)
  if (labelsRef?.current) labelsRef.current.push(centerLabel)

  // Uchburchak planar 3 ta ligand yo'nalishlari (X-Z tekisligida 120° burchaklar)
  const d = complexData.bondLength
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]

  angles.forEach((ang) => {
    const lPos = new THREE.Vector3(d * Math.cos(ang), 0, d * Math.sin(ang))

    const bond = createBond(centerPos, lPos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    let ligandGroup
    if (complexData.ligand.type === "CN") {
      ligandGroup = createCNLigand(lPos, centerPos, refs, state.scale)
    } else {
      const geo = new THREE.SphereGeometry(complexData.ligand.donorRadius || 0.35, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color: complexData.ligand.donorColor || 0x940094, roughness: 0.3 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(lPos)
      mesh.userData = {
        type: "atom",
        element: complexData.ligand.donor,
        info: ATOM_INFO[complexData.ligand.donor] || { name: complexData.ligand.donor },
        baseScale: state.scale
      }
      ligandGroup = new THREE.Group()
      ligandGroup.add(mesh)
      if (atomsRef?.current) atomsRef.current.push(mesh)

      const label = makeTextSprite(complexData.ligand.donor, { color: "#ffffff", scale: 0.26 })
      label.position.copy(lPos).add(new THREE.Vector3(0, 0.35, 0))
      ligandGroup.add(label)
      if (labelsRef?.current) labelsRef.current.push(label)
    }
    molGroup.add(ligandGroup)

    // Masofa yorlig'i
    const midPoint = new THREE.Vector3().addVectors(centerPos, lPos).multiplyScalar(0.5)
    const bondLabel = makeTextSprite(complexData.bondLengthReal || `${d.toFixed(2)} Å`, {
      color: "#fef08a",
      bgColor: "rgba(20, 10, 35, 0.85)",
      borderColor: "#eab308",
      scale: 0.22
    })
    bondLabel.position.copy(midPoint).add(new THREE.Vector3(0, 0.15, 0))
    bondLabel.visible = state.showDistance
    molGroup.add(bondLabel)
    if (bondLabelsRef?.current) bondLabelsRef.current.push(bondLabel)
  })

  // Tashqi sfera
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, d * 1.6, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function UchburchakPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="CuCN"
      buildGeometry={buildTrigonalPlanarGeometry}
    />
  )
}
