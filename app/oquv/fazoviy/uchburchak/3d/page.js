"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🔻 UCHBURCHAK PLANAR GEOMETRIYA — 3D LABORATORIYA PRO
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
    deltaValue: "20 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "e' (dxy, dx²-y²)", energy: "+0.55 Δ (Ligand tekisligida, yuqori sath)", type: "high" },
      { label: "e'' (dxz, dyz)", energy: "-0.10 Δ (Tekislikdan tashqarida, o'rta sath)", type: "mid" },
      { label: "a₁' (dz²)", energy: "-0.70 Δ (Eng pastki sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CuCN: {
    id: "CuCN",
    formula: "[Cu(CN)₃]²⁻",
    fullSalt: "K₂[Cu(CN)₃]·H₂O",
    name: "Kaliy tritsianokuprat(I)",
    center: { element: "Cu", color: 0xC88033, radius: 0.45, charge: "+1" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27 },
    bondLength: 2.05,
    bondLengthReal: "1.935 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp²",
    magnetism: "Diamagnit (d¹⁰ to'liq)",
    color: "Rangsiz kristall",
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 20000 },
    geometry: "Uchburchak planar",
    symmetry: "D₃ₕ",
    dElectrons: 10,
    coordNumber: 3
  },
  HgI: {
    id: "HgI",
    formula: "[HgI₃]⁻",
    fullSalt: "K[HgI₃] (Nessler asosi)",
    name: "Kaliy triyodomerkurat(II)",
    center: { element: "Hg", color: 0xB8B8D0, radius: 0.55, charge: "+2" },
    ligand: { type: "I", donor: "I", donorColor: 0x940094, donorRadius: 0.42 },
    bondLength: 2.7,
    bondLengthReal: "2.724 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp²",
    magnetism: "Diamagnit (d¹⁰)",
    color: "To'q sariq-qizil kristall",
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 18000 },
    geometry: "Uchburchak planar",
    symmetry: "D₃ₕ",
    dElectrons: 10,
    coordNumber: 3
  },
  AgCN: {
    id: "AgCN",
    formula: "[Ag(CN)₃]²⁻",
    fullSalt: "K₂[Ag(CN)₃]",
    name: "Kaliy tritsianoargentat(I)",
    center: { element: "Ag", color: 0xC0C0C0, radius: 0.48, charge: "+1" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27 },
    bondLength: 2.25,
    bondLengthReal: "2.135 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp²",
    magnetism: "Diamagnit (d¹⁰)",
    color: "Rangsiz kristall",
    dOrbital: { e_prime: 4, e_second: 4, a1_prime: 2, type: "Diamagnit", deltaO: 21000 },
    geometry: "Uchburchak planar",
    symmetry: "D₃ₕ",
    dElectrons: 10,
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
      // I yoki boshqa monodentat donor
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
