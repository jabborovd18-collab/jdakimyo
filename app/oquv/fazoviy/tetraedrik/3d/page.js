"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🔺 TETRAEDRIK GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/tetraedrik/3d (SEO indeksatsiyasi saqlangan)
// Tenglashtirilgan: CPK ranglar, atom yorliqlari, PDF eksport, ensamble
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
// 1. GEOMETRIYA MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "tetraedrik",
  name: "Tetraedrik",
  icon: "🔺",
  angle: "109.5°",
  ks: 4,
  hybridization: "sp³",
  symmetry: "Td",
  backUrl: "/oquv/fazoviy/tetraedrik"
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (Boyitilgan va tenglashtirilgan)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CoCl4: {
    id: "CoCl4",
    formula: "[CoCl₄]²⁻",
    fullSalt: "K₂[CoCl₄]",
    name: "Kaliy tetraklorokobaltat(II)",
    center: { element: "Co", color: 0x3D4B8C, radius: 0.45, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.25,
    bondLengthReal: "2.28 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp³",
    magnetism: "Paramagnit (3 ta toq elektron)",
    color: "To'q ko'k kristall / eritma",
    dOrbital: { e: 4, t2: 3, type: "HS", deltaT: 4200 },
    geometry: "Tetraedrik",
    symmetry: "Td",
    dElectrons: 7,
    coordNumber: 4
  },
  NiCl4: {
    id: "NiCl4",
    formula: "[NiCl₄]²⁻",
    fullSalt: "(Et₄N)₂[NiCl₄]",
    name: "Tetraetilammoniy tetrakloronikelat(II)",
    center: { element: "Ni", color: CPK.Ni, radius: 0.45, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.27,
    bondLengthReal: "2.27 Å",
    outerIon: { element: "Na", color: CPK.Na, radius: 0.35, charge: "+1", count: 2 },
    hybridization: "sp³",
    magnetism: "Paramagnit (2 ta toq elektron)",
    color: "Moviy-ko'k kristall",
    dOrbital: { e: 4, t2: 4, type: "HS", deltaT: 3800 },
    geometry: "Tetraedrik",
    symmetry: "Td",
    dElectrons: 8,
    coordNumber: 4
  },
  ZnNH3: {
    id: "ZnNH3",
    formula: "[Zn(NH₃)₄]²⁺",
    fullSalt: "[Zn(NH₃)₄]SO₄",
    name: "Tetraamminsink(II) sulfat",
    center: { element: "Zn", color: CPK.Zn, radius: 0.45, charge: "+2" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.05,
    bondLengthReal: "2.02 Å",
    outerIon: { element: "S", color: CPK.S, radius: 0.35, charge: "-2", count: 1 },
    hybridization: "sp³",
    magnetism: "Diamagnit (d¹⁰ to'liq)",
    color: "Rangsiz kristall",
    dOrbital: { e: 4, t2: 6, type: "Diamagnit", deltaT: 5000 },
    geometry: "Tetraedrik",
    symmetry: "Td",
    dElectrons: 10,
    coordNumber: 4
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TETRAEDRIK 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildTetrahedralGeometry(molGroup, complexData, refs, state) {
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

  // 4 ta tetraedrik cho'qqi: Td simmetriyasi
  const d = complexData.bondLength || 2.25
  const tetVerts = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1]
  ]

  tetVerts.forEach(([dx, dy, dz], idx) => {
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const donorPos = new THREE.Vector3(
      (dx / len) * d,
      (dy / len) * d,
      (dz / len) * d
    )

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
    if (complexData.ligand.type === "Cl") {
      createClLigand(molGroup, donorPos, refs)
    } else if (complexData.ligand.type === "NH3") {
      createNH3Ligand(molGroup, donorPos, centerPos, refs)
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
export default function Tetraedrik3D() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexId="CoCl4"
      buildGeometry={buildTetrahedralGeometry}
    />
  )
}