"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 💠 DODEKAEDRIK (DODECAHEDRAL) GEOMETRIYA — 3D LABORATORIYA PRO
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
// 1. GEOMETRIYA MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "dodekaedrik",
  name: "Dodekaedrik (Dodecahedral)",
  icon: "💠",
  angle: "73.5°, 147°, 35.2°",
  ks: 8,
  hybridization: "d⁴sp³ / sp³d⁴",
  symmetry: "D2d",
  description: "8-koordinatsion dodekaedrik geometriya (D2d, Hoard-Nordsieck modeli). [Mo(CN)₈]⁴⁻ va [W(CN)₈]⁴⁻ kabi d² metall ionlarida 4 ta A va 4 ta B inequivalent pozitsiyalar hosil bo'ladi.",
  backUrl: "/oquv/fazoviy/dodekaedrik",
  dOrbitalSplitting: {
    theory: "D2d dodekaedrik ligand maydonida d-orbitallar 4 ta sathga ajraladi:",
    levels: [
      { name: "dxy (b₂)", energy: "+0.71 Δ", desc: "Eng yuqori sath", color: "text-yellow-300" },
      { name: "dxz, dyz (e)", energy: "+0.14 Δ", desc: "O'rta yuqori (degeneratsiyalangan)", color: "text-amber-300" },
      { name: "dx²-y² (b₁)", energy: "-0.28 Δ", desc: "O'rta past sath", color: "text-emerald-300" },
      { name: "dz² (a₁)", energy: "-0.57 Δ", desc: "Eng past va barqaror sath", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Δ1 (b₂–e)", key: "delta1", getValue: (c) => `${(c.dOrbital?.delta1 || 15000).toLocaleString()} cm⁻¹` },
      { label: "Δ2 (e–b₁)", key: "delta2", getValue: (c) => `${(c.dOrbital?.delta2 || 8000).toLocaleString()} cm⁻¹` },
      { label: "Δ3 (b₁–a₁)", key: "delta3", getValue: (c) => `${(c.dOrbital?.delta3 || 6000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 16 000 cm⁻¹",
    note: "[Mo(CN)₈]⁴⁻ da 2 ta d-elektron eng pastki a₁ (dz²) orbitalga to'liq juftlashib joylashadi (diamagnit)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D2d — 8-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  MoCN8: {
    id: "MoCN8",
    formula: "[Mo(CN)₈]⁴⁻",
    fullSalt: "K₄[Mo(CN)₈] · 2H₂O",
    name: "Kaliy oktatsianomolibdat(IV)",
    center: { element: "Mo", color: CPK.Mo || 0x54B5B5, radius: 0.50, charge: "+4" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 2.15,
    bondLengthB: 2.20,
    bondLengthReal: "2.15 Å",
    bondLengthBReal: "2.20 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d⁴sp³ (yoki sp³d⁴)",
    magnetism: "Diamagnit",
    color: "Och sariq kristall",
    dOrbital: { a1: 2, b1: 0, b2: 0, e: 0, type: "LS", delta1: 15000, delta2: 8000, delta3: 6000 },
    geometry: "Dodekaedrik",
    symmetry: "D2d",
    dElectrons: 2,
    coordNumber: 8
  },
  WCN8: {
    id: "WCN8",
    formula: "[W(CN)₈]⁴⁻",
    fullSalt: "K₄[W(CN)₈] · 2H₂O",
    name: "Kaliy oktatsianovolframat(IV)",
    center: { element: "W", color: CPK.W || 0x2194D6, radius: 0.52, charge: "+4" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 2.16,
    bondLengthB: 2.22,
    bondLengthReal: "2.16 Å",
    bondLengthBReal: "2.22 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d⁴sp³",
    magnetism: "Diamagnit",
    color: "Sariq-yashil kristall",
    dOrbital: { a1: 2, b1: 0, b2: 0, e: 0, type: "LS", delta1: 18000, delta2: 9000, delta3: 7000 },
    geometry: "Dodekaedrik",
    symmetry: "D2d",
    dElectrons: 2,
    coordNumber: 8
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. DODEKAEDRIK 3D GEOMETRIYANI QURISH (Hoard-Nordsieck modeli)
// ═══════════════════════════════════════════════════════════════════════════
function buildDodecahedralGeometry(molGroup, complexData, refs, state) {
  const { atomsRef, labelsRef, bondLabelsRef, bondsRef } = refs
  const center = complexData.center
  const centerPos = new THREE.Vector3(0, 0, 0)

  // Markaziy metal atomi
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
  const centerLabel = makeTextSprite(`${center.element}${center.charge || ""}`, {
    color: "#ffffff",
    bgColor: "rgba(30, 10, 60, 0.9)",
    borderColor: "#c084fc",
    scale: 0.32
  })
  centerLabel.position.copy(centerPos).add(new THREE.Vector3(0, center.radius + 0.35, 0))
  molGroup.add(centerLabel)
  if (labelsRef?.current) labelsRef.current.push(centerLabel)

  // 8 ta D2d koordinata: 4 ta A pozitsiyasi va 4 ta B pozitsiyasi
  const rA = complexData.bondLength || 2.15
  const rB = complexData.bondLengthB || 2.20
  const thA = (35.2 * Math.PI) / 180
  const thB = (73.5 * Math.PI) / 180

  const ligandCoords = [
    // 4 ta A pozitsiyasi
    { pos: [rA * Math.sin(thA), rA * Math.cos(thA), 0], type: "A", realLen: complexData.bondLengthReal },
    { pos: [-rA * Math.sin(thA), rA * Math.cos(thA), 0], type: "A", realLen: complexData.bondLengthReal },
    { pos: [0, -rA * Math.cos(thA), rA * Math.sin(thA)], type: "A", realLen: complexData.bondLengthReal },
    { pos: [0, -rA * Math.cos(thA), -rA * Math.sin(thA)], type: "A", realLen: complexData.bondLengthReal },
    // 4 ta B pozitsiyasi
    { pos: [0, rB * Math.cos(thB), rB * Math.sin(thB)], type: "B", realLen: complexData.bondLengthBReal },
    { pos: [0, rB * Math.cos(thB), -rB * Math.sin(thB)], type: "B", realLen: complexData.bondLengthBReal },
    { pos: [rB * Math.sin(thB), -rB * Math.cos(thB), 0], type: "B", realLen: complexData.bondLengthBReal },
    { pos: [-rB * Math.sin(thB), -rB * Math.cos(thB), 0], type: "B", realLen: complexData.bondLengthBReal }
  ]

  ligandCoords.forEach(({ pos: [x, y, z], type, realLen }, idx) => {
    const donorPos = new THREE.Vector3(x, y, z)
    const bondColor = type === "A" ? 0xff9ec7 : 0x9ecfff

    // Bog' yaratish
    const bond = createBond(molGroup, centerPos, donorPos, bondColor, 0.08, 0.7, {
      bondLabelsRef,
      lengthReal: realLen,
      showBondLengths: state?.showBondLengths
    })
    if (bondsRef?.current) bondsRef.current.push(bond)

    // CN ligand
    createCNLigand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
  })

  // Tashqi sferadagi ionlar
  if (complexData.outerIon && state?.showOuterSphere) {
    createOuterSphereIons(molGroup, complexData.outerIon, rA + 1.2, { atomsRef, labelsRef })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA ASOSIY EKSPORTI
// ═══════════════════════════════════════════════════════════════════════════
export default function Dodekaedrik3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildDodecahedralGeometry}
      defaultComplex="MoCN8"
    />
  )
}
