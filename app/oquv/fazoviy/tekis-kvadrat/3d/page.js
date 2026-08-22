"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🟩 TEKIS KVADRAT GEOMETRIYA (D₄ₕ — KS 4) — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/tekis-kvadrat/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createClLigand,
  createCNLigand,
  createNH3Ligand,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D4h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "tekis-kvadrat",
  name: "Tekis kvadrat",
  icon: "🟩",
  angle: "90°, 180°",
  ks: 4,
  hybridization: "dsp²",
  symmetry: "D4h",
  backUrl: "/oquv/fazoviy/tekis-kvadrat",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Tekis kvadrat (D4h) maydonida d-orbitallarning 4 energetik sathga ajralishi:",
    deltaSymbol: "Δₛₚ",
    deltaValue: "23 000–34 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "dx²-y² (b₁g)", energy: "+1.23 Δₛₚ (Juda yuqori, liganda tekisligida)", type: "high" },
      { label: "dxy (b₂g)", energy: "+0.23 Δₛₚ (O'rta sath)", type: "mid" },
      { label: "dz² (a₁g)", energy: "-0.43 Δₛₚ (Quyi-o'rta sath)", type: "mid" },
      { label: "dxz, dyz (eg)", energy: "-0.51 Δₛₚ (Eng quyi, erkin sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (Asl o'lchangan DeltaO/Delta1 va spektroskopiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  PtCl4: {
    id: "PtCl4",
    formula: "[PtCl₄]²⁻",
    fullSalt: "K₂[PtCl₄]",
    name: "Kaliy tetrakloroplatinat(II)",
    center: { element: "Pt", color: 0xE0C0A0, radius: 0.50, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.30,
    bondLengthReal: "2.31 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit (d⁸, quyi 4 sath to'liq to'lgan)",
    color: "To'q qizil-jigarrang kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 29000, delta1: 29000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    spectroscopy: {
      uvVis: "d–d o'tishlar: λmax ≈ 390 nm (¹A₁g → ¹A₂g), 335 nm (¹A₁g → ¹Eg), LMCT: 230 nm",
      ir: "ν(Pt–Cl) a₁g: 335 cm⁻¹ (Raman-faol), ν(Pt–Cl) eᵤ: 310 cm⁻¹ (IR-faol), δ(Cl–Pt–Cl): 165 cm⁻¹"
    },
    coordNumber: 4
  },
  NiCN4: {
    id: "NiCN4",
    formula: "[Ni(CN)₄]²⁻",
    fullSalt: "K₂[Ni(CN)₄]",
    name: "Kaliy tetratsianonikelat(II)",
    center: { element: "Ni", color: CPK.Ni, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.90,
    bondLengthReal: "1.87 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit (kuchli maydon)",
    color: "Sariq kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 34000, delta1: 34000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    spectroscopy: {
      uvVis: "λmax ≈ 267 nm (MLCT), 310 nm (d–d past-spin)",
      ir: "ν(C≡N) a₁g: 2160 cm⁻¹ (Raman), ν(C≡N) eᵤ: 2124 cm⁻¹ (IR), ν(Ni–C): 415 cm⁻¹"
    },
    coordNumber: 4
  },
  CuNH3: {
    id: "CuNH3",
    formula: "[Cu(NH₃)₄]²⁺",
    fullSalt: "[Cu(NH₃)₄]SO₄",
    name: "Tetraamminmis(II) sulfat",
    center: { element: "Cu", color: CPK.Cu, radius: 0.48, charge: "+2" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.05,
    bondLengthReal: "2.03 Å",
    outerIon: { element: "S", color: CPK.S, radius: 0.35, charge: "-2", count: 1 },
    hybridization: "dsp²",
    magnetism: "Paramagnit (1 ta toq elektron)",
    color: "To'q ko'k-binafsha",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 1, type: "HS (d⁹)", deltaO: 18000, delta1: 18000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h (Jahn-Teller)",
    dElectrons: 9,
    spectroscopy: {
      uvVis: "λmax ≈ 610 nm (to'q ko'k rang beruvchi d–d o'tish), 250 nm (LMCT)",
      ir: "ν(N–H) sim: 3320 cm⁻¹, ν(N–H) asim: 3400 cm⁻¹, ν(Cu–N): 420 cm⁻¹, δ(HNH): 1610 cm⁻¹"
    },
    coordNumber: 4
  },
  PdCl4: {
    id: "PdCl4",
    formula: "[PdCl₄]²⁻",
    fullSalt: "K₂[PdCl₄]",
    name: "Kaliy tetrakloropalladat(II)",
    center: { element: "Pd", color: 0x7090C0, radius: 0.48, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.32,
    bondLengthReal: "2.30 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "To'q sariq-jigarrang",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 27000, delta1: 27000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    spectroscopy: {
      uvVis: "λmax ≈ 470 nm, 280 nm (LMCT)",
      ir: "ν(Pd–Cl) a₁g: 305 cm⁻¹, ν(Pd–Cl) eᵤ: 336 cm⁻¹"
    },
    coordNumber: 4
  },
  AuCl4: {
    id: "AuCl4",
    formula: "[AuCl₄]⁻",
    fullSalt: "HAuCl₄",
    name: "Tetrakloroaurat(III) kislota",
    center: { element: "Au", color: 0xD0A040, radius: 0.52, charge: "+3" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.28,
    bondLengthReal: "2.27 Å",
    outerIon: { element: "H", color: CPK.H, radius: 0.20, charge: "+1", count: 1 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "Sariq kristall (gigroskopik)",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 23000, delta1: 23000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    spectroscopy: {
      uvVis: "λmax ≈ 318 nm (LMCT Cl → Au(III))",
      ir: "ν(Au–Cl) a₁g: 347 cm⁻¹ (Raman), ν(Au–Cl) eᵤ: 356 cm⁻¹ (IR)"
    },
    coordNumber: 4
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TEKIS KVADRAT 3D GEOMETRIYANI QURISH (D4h)
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePlanarGeometry(molGroup, complexData, refs, state) {
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

  // Tekis kvadrat 4 ta ligand yo'nalishlari (X va Z tekisligida 90° burchaklar)
  const d = complexData.bondLength
  const ligandDirs = [
    new THREE.Vector3(d, 0, 0),
    new THREE.Vector3(-d, 0, 0),
    new THREE.Vector3(0, 0, d),
    new THREE.Vector3(0, 0, -d)
  ]

  ligandDirs.forEach((dir) => {
    const lPos = dir.clone()

    // Bog'
    const bond = createBond(centerPos, lPos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand turiga qarab yaratish
    let ligandGroup
    if (complexData.ligand.type === "Cl") {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
    } else if (complexData.ligand.type === "CN") {
      ligandGroup = createCNLigand(lPos, centerPos, refs, state.scale)
    } else if (complexData.ligand.type === "NH3") {
      ligandGroup = createNH3Ligand(lPos, centerPos, refs, state.scale)
    } else {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
    }
    molGroup.add(ligandGroup)

    // Masofa o'lchash yorlig'i
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

  // Tashqi sfera ionlari
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, d * 1.7, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function TekisKvadratPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="PtCl4"
      buildGeometry={buildSquarePlanarGeometry}
    />
  )
}
