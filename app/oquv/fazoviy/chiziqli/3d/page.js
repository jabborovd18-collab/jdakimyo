"use client"

// ═══════════════════════════════════════════════════════════════════════════
// ➖ CHIZIQLI GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/chiziqli/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createClLigand,
  createNH3Ligand,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D∞h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "chiziqli",
  name: "Chiziqli (Linear)",
  icon: "➖",
  angle: "180.0°",
  ks: 2,
  hybridization: "sp",
  symmetry: "D∞h",
  backUrl: "/oquv/fazoviy/chiziqli",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Chiziqli (D∞h) maydonda (z o'qi bo'ylab ligandlar) d-orbitallarning ajralishi:",
    deltaSymbol: "Δ",
    deltaValue: "22 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "σg* (dz²)", energy: "+1.03 Δ (Eng yuqori, aksial to'qnashuv)", type: "high" },
      { label: "πg (dxz, dyz)", energy: "-0.11 Δ (O'rta sath, bog'lanmagan)", type: "mid" },
      { label: "δg (dx²-y², dxy)", energy: "-0.40 Δ (Eng quyi sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  AgNH3: {
    id: "AgNH3",
    formula: "[Ag(NH₃)₂]⁺",
    fullSalt: "[Ag(NH₃)₂]Cl (Tollens reagenti)",
    name: "Diamminkumush(I) xlorid",
    center: { element: "Ag", color: 0xC0C0C0, radius: 0.50, charge: "+1" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.15,
    bondLengthReal: "2.13 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.38, charge: "-1", count: 1 },
    hybridization: "sp",
    magnetism: "Diamagnit (d¹⁰ to'liq to'lgan)",
    color: "Rangsiz eritma / oq kristall",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "Diamagnit", deltaO: 22000 },
    geometry: "Chiziqli",
    symmetry: "D∞h",
    dElectrons: 10,
    coordNumber: 2
  },
  AuCl2: {
    id: "AuCl2",
    formula: "[AuCl₂]⁻",
    fullSalt: "K[AuCl₂]",
    name: "Kaliy dixloroaurat(I)",
    center: { element: "Au", color: 0xFFD700, radius: 0.52, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.28,
    bondLengthReal: "2.25 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp",
    magnetism: "Diamagnit (d¹⁰, relativistik effekt)",
    color: "Sariq kristall",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "Diamagnit", deltaO: 24000 },
    geometry: "Chiziqli",
    symmetry: "D∞h",
    dElectrons: 10,
    coordNumber: 2
  },
  CuCl2: {
    id: "CuCl2",
    formula: "[CuCl₂]⁻",
    fullSalt: "K[CuCl₂]",
    name: "Kaliy dixlorokuprat(I)",
    center: { element: "Cu", color: 0xC88033, radius: 0.48, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.15,
    bondLengthReal: "2.11 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp",
    magnetism: "Diamagnit (d¹⁰)",
    color: "Rangsiz / oq kristall",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "Diamagnit", deltaO: 20000 },
    geometry: "Chiziqli",
    symmetry: "D∞h",
    dElectrons: 10,
    coordNumber: 2
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CHIZIQLI 3D GEOMETRIYANI QURISH (D∞h — 180°)
// ═══════════════════════════════════════════════════════════════════════════
function buildLinearGeometry(molGroup, complexData, refs, state) {
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

  // Chiziqli 2 ta ligand (Z o'qi bo'ylab +d va -d)
  const d = complexData.bondLength
  const ligandDirs = [
    new THREE.Vector3(0, 0, d),
    new THREE.Vector3(0, 0, -d)
  ]

  ligandDirs.forEach((dir, idx) => {
    const lPos = dir.clone()

    // Bog'
    const bond = createBond(centerPos, lPos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand
    let ligandGroup
    if (complexData.ligand.type === "Cl") {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
    } else if (complexData.ligand.type === "NH3") {
      ligandGroup = createNH3Ligand(lPos, centerPos, refs, state.scale)
    } else {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
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
export default function ChiziqliPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="AgNH3"
      buildGeometry={buildLinearGeometry}
    />
  )
}
