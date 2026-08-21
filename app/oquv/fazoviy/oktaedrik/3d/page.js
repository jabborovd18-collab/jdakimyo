"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 💎 OKTAEDRIK GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/oktaedrik/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createNH3Ligand,
  createCNLigand,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "oktaedrik",
  name: "Oktaedrik",
  icon: "💎",
  angle: "90°, 180°",
  ks: 6,
  hybridization: "d²sp³ / sp³d²",
  symmetry: "Oh",
  backUrl: "/oquv/fazoviy/oktaedrik"
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CoNH3: {
    id: "CoNH3",
    formula: "[Co(NH₃)₆]³⁺",
    fullSalt: "[Co(NH₃)₆]Cl₃",
    name: "Geksaamminkobalt(III) xlorid",
    center: { element: "Co", color: CPK.Co, radius: 0.45, charge: "+3" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.0,
    bondLengthReal: "1.96 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.32, charge: "-1", count: 3 },
    hybridization: "d²sp³",
    magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 23000 },
    geometry: "Oktaedrik",
    symmetry: "Oh",
    dElectrons: 6,
    coordNumber: 6
  },
  FeCN: {
    id: "FeCN",
    formula: "[Fe(CN)₆]⁴⁻",
    fullSalt: "K₄[Fe(CN)₆]",
    name: "Kaliy geksatsianoferrat(II) (sariq qon tuzi)",
    center: { element: "Fe", color: CPK.Fe, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.95,
    bondLengthReal: "1.92 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d²sp³",
    magnetism: "Diamagnit",
    color: "Sariq kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 33000 },
    geometry: "Oktaedrik",
    symmetry: "Oh",
    dElectrons: 6,
    coordNumber: 6
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. OKTAEDRIK 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildOctahedralGeometry(molGroup, complexData, refs, state) {
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
    isCenter: true
  }
  centerAtom.castShadow = true
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

  // Markaziy atom atrofidagi yorug'lik g'ubori (glow)
  const glowGeo = new THREE.SphereGeometry(center.radius * 1.3, 32, 32)
  const glowMat = new THREE.MeshBasicMaterial({
    color: center.color,
    transparent: true,
    opacity: 0.15
  })
  const glow = new THREE.Mesh(glowGeo, glowMat)
  molGroup.add(glow)

  // 6 ta oktaedrik koordinata: ±x, ±y, ±z
  const d = complexData.bondLength || 2.0
  const ligandPositions = [
    [d, 0, 0],
    [-d, 0, 0],
    [0, d, 0],
    [0, -d, 0],
    [0, 0, d],
    [0, 0, -d]
  ]

  ligandPositions.forEach(([x, y, z], idx) => {
    const donorPos = new THREE.Vector3(x, y, z)

    // Bog' yaratish
    const bond = createBond(molGroup, centerPos, donorPos, CPK.bond, 0.08, 0.7, {
      bondType: `${center.element}-${complexData.ligand.donor}`,
      length: complexData.bondLengthReal,
      ligandIdx: idx
    })
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Masofa yorlig'i
    const midpoint = new THREE.Vector3().addVectors(centerPos, donorPos).multiplyScalar(0.5)
    const lengthLabel = makeTextSprite(complexData.bondLengthReal, {
      color: "#fef3c7",
      bgColor: "rgba(120, 53, 15, 0.9)",
      borderColor: "#fbbf24",
      fontSize: 48,
      scale: 0.35
    })
    lengthLabel.position.copy(midpoint).add(new THREE.Vector3(0.15, 0.15, 0))
    lengthLabel.visible = state?.showBondLengths || false
    molGroup.add(lengthLabel)
    if (bondLabelsRef?.current) bondLabelsRef.current.push(lengthLabel)

    // Ligand strukturasini qo'shish
    if (complexData.ligand.type === "NH3") {
      createNH3Ligand(molGroup, donorPos, centerPos, refs)
    } else if (complexData.ligand.type === "CN") {
      createCNLigand(molGroup, donorPos, centerPos, refs)
    }
  })

  // Tashqi sfera ionlarini qo'shish
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, centerPos, complexData.outerIon, refs)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function Oktaedrik3D() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexId="CoNH3"
      buildGeometry={buildOctahedralGeometry}
    />
  )
}
