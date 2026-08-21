"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🏛️ TRIGONAL PRIZMA GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/trigonal-prizma/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D3h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "trigonal-prizma",
  name: "Trigonal prizma",
  icon: "🏛️",
  angle: "80°, 135°",
  ks: 6,
  hybridization: "sd⁵ / d⁴sp",
  symmetry: "D₃ₕ",
  backUrl: "/oquv/fazoviy/trigonal-prizma",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Trigonal prizma (D3h, KS 6) maydonida d-orbitallarning o'ziga xos 3 sathli ajralishi (oktaedrikdan tubdan farq qiladi):",
    deltaSymbol: "Δ(TPR)",
    deltaValue: "18 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "e'' (dxz, dyz)", energy: "+0.55 Δ(TPR) (Eng yuqori sath)", type: "high" },
      { label: "e' (dxy, dx²-y²)", energy: "-0.10 Δ(TPR) (O'rta sath)", type: "mid" },
      { label: "a₁' (dz²)", energy: "-0.70 Δ(TPR) (Eng pastki barqaror sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  ZrMe6: {
    id: "ZrMe6",
    formula: "[Zr(CH₃)₆]²⁻",
    fullSalt: "Li₂[Zr(CH₃)₆]",
    name: "Geksametilsirkonat(IV)",
    center: { element: "Zr", color: 0x94E0BB, radius: 0.42, charge: "+4" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.28 },
    bondLength: 1.85,
    bondLengthReal: "2.26 Å",
    outerIon: { element: "Li", color: 0xCC80FF, radius: 0.30, charge: "+1", count: 2 },
    hybridization: "sd⁵",
    magnetism: "Diamagnit (d⁰)",
    color: "Sariq-yashil kristall",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaO: 18000 },
    geometry: "Trigonal prizma",
    symmetry: "D₃ₕ",
    dElectrons: 0,
    coordNumber: 6
  },
  WMe6: {
    id: "WMe6",
    formula: "[W(CH₃)₆]",
    fullSalt: "W(CH₃)₆",
    name: "Volfram geksametil",
    center: { element: "W", color: 0x2194D6, radius: 0.45, charge: "+6" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.28 },
    bondLength: 1.85,
    bondLengthReal: "2.16 Å",
    outerIon: null,
    hybridization: "sd⁵",
    magnetism: "Diamagnit (d⁰)",
    color: "Och sariq kristall",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaO: 22000 },
    geometry: "Trigonal prizma",
    symmetry: "D₃ₕ",
    dElectrons: 0,
    coordNumber: 6
  },
  ReS6: {
    id: "ReS6",
    formula: "[Re(S₂C₂(CN)₂)₃]²⁻",
    fullSalt: "K₂[Re(mnt)₃]",
    name: "Tris(maleonitriloditiolato)renat",
    center: { element: "Re", color: 0x267DAB, radius: 0.44, charge: "+4" },
    ligand: { type: "dithiolene", donor: "S", donorColor: CPK.S, donorRadius: 0.32 },
    bondLength: 1.95,
    bondLengthReal: "2.33 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sd⁵",
    magnetism: "Diamagnit (LS d³)",
    color: "Qora-yashil kristall",
    dOrbital: { a1: 2, e: 0, e2: 0, type: "LS d³", deltaO: 16000 },
    geometry: "Trigonal prizma",
    symmetry: "D₃ₕ",
    dElectrons: 3,
    coordNumber: 6
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TRIGONAL PRIZMA 3D GEOMETRIYANI QURISH (D3h — 6 ta cho'qqi)
// ═══════════════════════════════════════════════════════════════════════════
function buildTrigonalPrismGeometry(molGroup, complexData, refs, state) {
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
    if (ch === "+6") return `${elem}⁶⁺`
    if (ch === "+4") return `${elem}⁴⁺`
    if (ch === "+3") return `${elem}³⁺`
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

  // Trigonal prizma: 3 ta yuqori uchburchakda (+Y) va 3 ta pastki uchburchakda (-Y)
  const r = complexData.bondLength * 0.9
  const h = complexData.bondLength * 0.65

  const prismDirs = [
    // Yuqori uchburchak
    new THREE.Vector3(r * Math.cos(0), h, r * Math.sin(0)),
    new THREE.Vector3(r * Math.cos((2 * Math.PI) / 3), h, r * Math.sin((2 * Math.PI) / 3)),
    new THREE.Vector3(r * Math.cos((4 * Math.PI) / 3), h, r * Math.sin((4 * Math.PI) / 3)),
    // Pastki uchburchak (prizmatik: burchaklari ustma-ust tushadi)
    new THREE.Vector3(r * Math.cos(0), -h, r * Math.sin(0)),
    new THREE.Vector3(r * Math.cos((2 * Math.PI) / 3), -h, r * Math.sin((2 * Math.PI) / 3)),
    new THREE.Vector3(r * Math.cos((4 * Math.PI) / 3), -h, r * Math.sin((4 * Math.PI) / 3))
  ]

  prismDirs.forEach((pos, idx) => {
    const bond = createBond(centerPos, pos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    const geo = new THREE.SphereGeometry(complexData.ligand.donorRadius || 0.28, 32, 32)
    const mat = new THREE.MeshStandardMaterial({ color: complexData.ligand.donorColor || CPK.C, roughness: 0.3 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = {
      type: "atom",
      element: complexData.ligand.donor,
      info: ATOM_INFO[complexData.ligand.donor] || { name: complexData.ligand.donor },
      baseScale: state.scale
    }
    const ligandGroup = new THREE.Group()
    ligandGroup.add(mesh)
    if (atomsRef?.current) atomsRef.current.push(mesh)

    const label = makeTextSprite(complexData.ligand.donor, { color: "#ffffff", scale: 0.25 })
    label.position.copy(pos).add(new THREE.Vector3(0, 0.3, 0))
    ligandGroup.add(label)
    if (labelsRef?.current) labelsRef.current.push(label)

    molGroup.add(ligandGroup)
  })

  // Tashqi sfera
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, r * 1.8, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function TrigonalPrizmaPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="ZrMe6"
      buildGeometry={buildTrigonalPrismGeometry}
    />
  )
}
