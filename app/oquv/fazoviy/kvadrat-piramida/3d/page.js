"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🔺 KVADRAT PIRAMIDA GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/kvadrat-piramida/3d (SEO indeksatsiyasi saqlangan)
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
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (C4v)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "kvadrat-piramida",
  name: "Kvadrat piramida",
  icon: "🔺",
  angle: "90°, 104°",
  ks: 5,
  hybridization: "dsp³ / d²sp²",
  symmetry: "C₄ᵥ",
  backUrl: "/oquv/fazoviy/kvadrat-piramida",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Kvadrat piramida (C4v) maydonida d-orbitallarning 4 energetik sathga ajralishi:",
    deltaSymbol: "Δ₁ / Δ₂",
    deltaValue: "18 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "dx²-y² (b₁)", energy: "+0.91 Δ (Eng yuqori, ekvatorial ligandlar)", type: "high" },
      { label: "dz² (a₁)", energy: "+0.09 Δ (Apikal ligand bo'ylab)", type: "mid" },
      { label: "dxy (b₂)", energy: "-0.09 Δ (Ekvatorial ligandlar orasida)", type: "mid" },
      { label: "dxz, dyz (e)", energy: "-0.46 Δ (Eng quyi sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  VOacac: {
    id: "VOacac",
    formula: "[VO(acac)₂]",
    fullSalt: "[VO(C₅H₇O₂)₂]",
    name: "Vanadil bis(atsetilatsetonat)",
    center: { element: "V", color: 0xA6A6AB, radius: 0.45, charge: "+4" },
    ligand: { type: "acac_O", donor: "O", donorColor: CPK.O, donorRadius: 0.30 },
    apicalLigand: { type: "oxo", donor: "O", donorColor: CPK.O, donorRadius: 0.32, label: "O²⁻" },
    bondLength: 2.0,
    bondLengthApical: 1.5,
    bondLengthReal: "1.97 Å",
    bondLengthApicalReal: "1.58 Å (V=O)",
    outerIon: null,
    hybridization: "dsp³",
    magnetism: "Paramagnit (d¹, μ ≈ 1.73 μB)",
    color: "Ko'k-yashil kristall",
    dOrbital: { e: 1, b2: 0, a1: 0, b1: 0, type: "Paramagnit", deltaO: 18000 },
    geometry: "Kvadrat piramida",
    symmetry: "C₄ᵥ",
    dElectrons: 1,
    coordNumber: 5
  },
  NiCN5: {
    id: "NiCN5",
    formula: "[Ni(CN)₅]³⁻",
    fullSalt: "K₃[Ni(CN)₅]",
    name: "Kaliy pentatsianonikelat(II)",
    center: { element: "Ni", color: CPK.Ni, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    apicalLigand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25, label: "CN⁻" },
    bondLength: 1.95,
    bondLengthApical: 2.15,
    bondLengthReal: "1.86 Å",
    bondLengthApicalReal: "2.17 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 3 },
    hybridization: "dsp³",
    magnetism: "Diamagnit (d⁸ past spin)",
    color: "To'q qizil kristall",
    dOrbital: { e: 4, b2: 2, a1: 2, b1: 0, type: "LS", deltaO: 22000 },
    geometry: "Kvadrat piramida",
    symmetry: "C₄ᵥ",
    dElectrons: 8,
    coordNumber: 5
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. KVADRAT PIRAMIDA 3D GEOMETRIYANI QURISH (C4v)
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePyramidGeometry(molGroup, complexData, refs, state) {
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
    if (ch === "+3") return `${elem}³⁺`
    if (ch === "+2") return `${elem}²⁺`
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

  // 1. Apikal ligand (+Y o'qi bo'ylab yuqorida)
  const dApical = complexData.bondLengthApical || complexData.bondLength
  const apicalPos = new THREE.Vector3(0, dApical, 0)
  const apicalBond = createBond(centerPos, apicalPos, 0.075, CPK.bond)
  molGroup.add(apicalBond)
  if (bondsRef?.current) bondsRef.current.push(apicalBond)

  // Apikal atom
  const apicalGeo = new THREE.SphereGeometry(complexData.apicalLigand?.donorRadius || 0.30, 32, 32)
  const apicalMat = new THREE.MeshStandardMaterial({
    color: complexData.apicalLigand?.donorColor || CPK.O,
    roughness: 0.3,
    metalness: 0.4
  })
  const apicalMesh = new THREE.Mesh(apicalGeo, apicalMat)
  apicalMesh.position.copy(apicalPos)
  apicalMesh.userData = {
    type: "atom",
    element: complexData.apicalLigand?.donor || "O",
    info: ATOM_INFO[complexData.apicalLigand?.donor] || { name: "Apikal ligand" },
    baseScale: state.scale
  }
  molGroup.add(apicalMesh)
  if (atomsRef?.current) atomsRef.current.push(apicalMesh)

  const apicalLabel = makeTextSprite(complexData.apicalLigand?.label || "O", {
    color: "#fecdd3",
    scale: 0.26
  })
  apicalLabel.position.copy(apicalPos).add(new THREE.Vector3(0, 0.35, 0))
  molGroup.add(apicalLabel)
  if (labelsRef?.current) labelsRef.current.push(apicalLabel)

  // 2. 4 ta ekvatorial ligand (X-Z tekisligida, biroz pastga -0.2y egilgan C4v piramida)
  const dEq = complexData.bondLength
  const eqDirs = [
    new THREE.Vector3(dEq, -0.2, 0),
    new THREE.Vector3(-dEq, -0.2, 0),
    new THREE.Vector3(0, -0.2, dEq),
    new THREE.Vector3(0, -0.2, -dEq)
  ]

  eqDirs.forEach((pos, idx) => {
    const bond = createBond(centerPos, pos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    let ligandGroup
    if (complexData.ligand.type === "CN") {
      ligandGroup = createCNLigand(pos, centerPos, refs, state.scale)
    } else {
      // acac yoki O donori
      const oGeo = new THREE.SphereGeometry(complexData.ligand.donorRadius || 0.30, 32, 32)
      const oMat = new THREE.MeshStandardMaterial({ color: complexData.ligand.donorColor || CPK.O, roughness: 0.3 })
      const oMesh = new THREE.Mesh(oGeo, oMat)
      oMesh.position.copy(pos)
      oMesh.userData = {
        type: "atom",
        element: complexData.ligand.donor,
        info: ATOM_INFO[complexData.ligand.donor] || { name: complexData.ligand.donor },
        baseScale: state.scale
      }
      ligandGroup = new THREE.Group()
      ligandGroup.add(oMesh)
      if (atomsRef?.current) atomsRef.current.push(oMesh)

      const label = makeTextSprite(complexData.ligand.donor, { color: "#ffffff", scale: 0.25 })
      label.position.copy(pos).add(new THREE.Vector3(0, 0.3, 0))
      ligandGroup.add(label)
      if (labelsRef?.current) labelsRef.current.push(label)
    }
    molGroup.add(ligandGroup)
  })

  // Tashqi sfera
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, dEq * 1.6, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function KvadratPiramidaPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="VOacac"
      buildGeometry={buildSquarePyramidGeometry}
    />
  )
}
