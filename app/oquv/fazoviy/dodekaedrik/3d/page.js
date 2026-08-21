"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 💎 DODEKAEDRIK GEOMETRIYA (D2d, KS 8) — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/dodekaedrik/3d (SEO indeksatsiyasi saqlangan)
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
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D2d)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "dodekaedrik",
  name: "Dodekaedrik",
  icon: "💎",
  angle: "73.7°, 142.6°",
  ks: 8,
  hybridization: "d⁴sp³",
  symmetry: "D₂d",
  backUrl: "/oquv/fazoviy/dodekaedrik",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Dodekaedrik (D2d, KS 8) maydonida d-orbitallarning Hoard-Nordsieck bo'yicha ajralishi:",
    deltaSymbol: "Δ₁ / Δ₂ / Δ₃",
    deltaValue: "15 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "e (dxz, dyz)", energy: "+0.75 Δ (Eng yuqori sath)", type: "high" },
      { label: "b₂ (dxy)", energy: "+0.15 Δ (O'rta sath)", type: "mid" },
      { label: "b₁ (dx²-y²)", energy: "-0.20 Δ (Quyi-o'rta sath)", type: "mid" },
      { label: "a₁ (dz²)", energy: "-0.70 Δ (Eng pastki to'liq to'lgan sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  MoCN8: {
    id: "MoCN8",
    formula: "[Mo(CN)₈]⁴⁻",
    fullSalt: "K₄[Mo(CN)₈] · 2H₂O",
    name: "Kaliy oktatsianomolibdat(IV)",
    center: { element: "Mo", color: 0x54B5B5, radius: 0.50, charge: "+4" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 2.15,
    bondLengthReal: "2.15 Å (A) / 2.20 Å (B)",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d⁴sp³",
    magnetism: "Diamagnit (d², a₁² konfiguratsiya)",
    color: "Och sariq kristall",
    dOrbital: { a1: 2, b1: 0, b2: 0, e: 0, type: "LS d²", deltaO: 15000 },
    geometry: "Dodekaedrik",
    symmetry: "D₂d",
    dElectrons: 2,
    coordNumber: 8
  },
  WCN8: {
    id: "WCN8",
    formula: "[W(CN)₈]⁴⁻",
    fullSalt: "K₄[W(CN)₈] · 2H₂O",
    name: "Kaliy oktatsianovolframat(IV)",
    center: { element: "W", color: 0x2194D6, radius: 0.52, charge: "+4" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 2.16,
    bondLengthReal: "2.16 Å (A) / 2.22 Å (B)",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d⁴sp³",
    magnetism: "Diamagnit (d²)",
    color: "Sariq-yashil kristall",
    dOrbital: { a1: 2, b1: 0, b2: 0, e: 0, type: "LS d²", deltaO: 18000 },
    geometry: "Dodekaedrik",
    symmetry: "D₂d",
    dElectrons: 2,
    coordNumber: 8
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. DODEKAEDRIK 3D GEOMETRIYANI QURISH (D2d — 8 ta ligand)
// Hoard-Nordsieck standart sferik koordinatalari
// ═══════════════════════════════════════════════════════════════════════════
function buildDodecahedralGeometry(molGroup, complexData, refs, state) {
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
    if (ch === "+4") return `${elem}⁴⁺`
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

  // 8 ta D2d cho'qqilari (Hoard & Nordsieck, 1939):
  // 4 ta A pozitsiya: theta_A = 35.2°, phi = ±45°, ±135°
  // 4 ta B pozitsiya: theta_B = 73.5°, phi = 0°, 90°, 180°, 270°
  const d = complexData.bondLength
  const thetaA = (35.2 * Math.PI) / 180
  const thetaB = (73.5 * Math.PI) / 180

  const dodecaDirs = [
    // 4 ta A pozitsiyasi
    new THREE.Vector3(d * Math.sin(thetaA) * Math.cos(Math.PI / 4), d * Math.cos(thetaA), d * Math.sin(thetaA) * Math.sin(Math.PI / 4)),
    new THREE.Vector3(d * Math.sin(thetaA) * Math.cos((3 * Math.PI) / 4), d * Math.cos(thetaA), d * Math.sin(thetaA) * Math.sin((3 * Math.PI) / 4)),
    new THREE.Vector3(d * Math.sin(thetaA) * Math.cos((5 * Math.PI) / 4), -d * Math.cos(thetaA), d * Math.sin(thetaA) * Math.sin((5 * Math.PI) / 4)),
    new THREE.Vector3(d * Math.sin(thetaA) * Math.cos((7 * Math.PI) / 4), -d * Math.cos(thetaA), d * Math.sin(thetaA) * Math.sin((7 * Math.PI) / 4)),
    // 4 ta B pozitsiyasi
    new THREE.Vector3(d * Math.sin(thetaB) * Math.cos(0), d * Math.cos(thetaB), d * Math.sin(thetaB) * Math.sin(0)),
    new THREE.Vector3(d * Math.sin(thetaB) * Math.cos(Math.PI / 2), -d * Math.cos(thetaB), d * Math.sin(thetaB) * Math.sin(Math.PI / 2)),
    new THREE.Vector3(d * Math.sin(thetaB) * Math.cos(Math.PI), d * Math.cos(thetaB), d * Math.sin(thetaB) * Math.sin(Math.PI)),
    new THREE.Vector3(d * Math.sin(thetaB) * Math.cos((3 * Math.PI) / 2), -d * Math.cos(thetaB), d * Math.sin(thetaB) * Math.sin((3 * Math.PI) / 2))
  ]

  dodecaDirs.forEach((pos, idx) => {
    const isA = idx < 4
    const bondColor = isA ? 0xff9ec7 : 0x9ecfff
    const bond = createBond(centerPos, pos, 0.060, bondColor)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    const ligandGroup = createCNLigand(pos, centerPos, refs, state.scale)
    molGroup.add(ligandGroup)
  })

  // Tashqi sfera
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, d * 1.7, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function DodekaedrikPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="MoCN8"
      buildGeometry={buildDodecahedralGeometry}
    />
  )
}
