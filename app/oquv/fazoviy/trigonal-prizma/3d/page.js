"use client"

// ═══════════════════════════════════════════════════════════════════════════
// ⛺ TRIGONAL PRIZMA (TRIGONAL PRISMATIC) GEOMETRIYA — 3D LABORATORIYA PRO
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
// 1. GEOMETRIYA MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "trigonal-prizma",
  name: "Trigonal prizma (Trigonal Prismatic)",
  icon: "⛺",
  angle: "78°, 133°",
  ks: 6,
  hybridization: "sd⁵ / d⁵s",
  symmetry: "D3h",
  description: "6-koordinatsion trigonal prizmatik geometriya (D3h). Oktaedrdan farqli ravishda yuqori va pastki uchburchaklar to'g'ridan-to'g'ri bir-birining ustida (eclipsed) joylashgan (burilish burchagi θ = 0°). d⁰, d¹ yoki d² metall ionlarida (Zr, W, Mo, Re) sd⁵ gibridlanish orqali hosil bo'ladi.",
  backUrl: "/oquv/fazoviy/trigonal-prizma",
  dOrbitalSplitting: {
    theory: "D3h trigonal prizmatik ligand maydonida d-orbitallar 3 ta sathga ajraladi:",
    levels: [
      { name: "dx²-y², dxy (e')", energy: "+0.07 Δₜₚ", desc: "Yuqori sath (ekvatorial tekislikdagi orbitallar)", color: "text-yellow-300" },
      { name: "dxz, dyz (e'')", energy: "-0.13 Δₜₚ", desc: "O'rta past sath (degeneratsiyalangan)", color: "text-emerald-300" },
      { name: "dz² (a₁')", energy: "-0.27 Δₜₚ", desc: "Eng barqaror sath (ligandlar orasidagi bo'shliqqa yo'nalgan)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Ajralish parametri (Δₜₚᵣ)", key: "deltaTPR", getValue: (c) => `${(c.dOrbital?.deltaTPR || 18000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 19 000 cm⁻¹",
    note: "Trigonal prizmada dz² (a₁') orbitali eng past energiyaga ega bo'lib, d¹ va d² elektronlar birinchi navbatda shu yerga joylashadi."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D3h — 6-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  ZrMe6: {
    id: "ZrMe6",
    formula: "[Zr(CH₃)₆]²⁻",
    fullSalt: "Li₂[Zr(CH₃)₆]",
    name: "Geksametilsirkonat(IV)",
    center: { element: "Zr", color: CPK.Zr || 0x94E0BB, radius: 0.42, charge: "+4" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.8,
    bondLengthReal: "2.26 Å",
    outerIon: { element: "Li", color: 0xCC80FF, radius: 0.30, charge: "+1", count: 2 },
    hybridization: "sd⁵",
    magnetism: "Diamagnit",
    color: "Sariq-yashil kristall",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaTPR: 18000 },
    geometry: "Trigonal prizmatik",
    symmetry: "D3h",
    dElectrons: 0,
    twistAngle: 0,
    coordNumber: 6
  },
  WMe6: {
    id: "WMe6",
    formula: "[W(CH₃)₆]",
    fullSalt: "W(CH₃)₆",
    name: "Volfram geksametil",
    center: { element: "W", color: CPK.W || 0x2194D6, radius: 0.45, charge: "+6" },
    ligand: { type: "Me", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.85,
    bondLengthReal: "2.16 Å",
    outerIon: null,
    hybridization: "sd⁵",
    magnetism: "Diamagnit",
    color: "Och sariq",
    dOrbital: { a1: 0, e: 0, e2: 0, type: "d⁰", deltaTPR: 22000 },
    geometry: "Trigonal prizmatik",
    symmetry: "D3h",
    dElectrons: 0,
    twistAngle: 0,
    coordNumber: 6
  },
  ReS6: {
    id: "ReS6",
    formula: "[Re(S₂C₂(CN)₂)₃]²⁻",
    fullSalt: "K₂[Re(mnt)₃]",
    name: "Tris(maleonitriloditiolato)renat",
    center: { element: "Re", color: CPK.Re || 0x267DAB, radius: 0.44, charge: "+4" },
    ligand: { type: "dithiolene", donor: "S", donorColor: CPK.S || 0xFFC832, donorRadius: 0.35 },
    bondLength: 1.95,
    bondLengthReal: "2.33 Å",
    outerIon: { element: "K", color: 0x8F40D4, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sd⁵",
    magnetism: "Diamagnit (LS d³)",
    color: "Qora-yashil",
    dOrbital: { a1: 2, e: 0, e2: 0, type: "d³", deltaTPR: 16000 },
    geometry: "Trigonal prizmatik",
    symmetry: "D3h",
    dElectrons: 3,
    twistAngle: 0,
    coordNumber: 6
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TRIGONAL PRIZMA 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildTrigonalPrismaticGeometry(molGroup, complexData, refs, state) {
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

  // 6 ta trigonal-prizmatik koordinata (yuqori va pastki uchburchaklar eclipsed)
  const bondLength = complexData.bondLength || 1.85
  const height = 0.95
  const r = Math.sqrt(Math.max(0.1, bondLength * bondLength - height * height))

  const ligandPositions = []
  // Yuqori 3 ta (0°, 120°, 240°)
  for (let i = 0; i < 3; i++) {
    const ang = (i * 120 * Math.PI) / 180
    ligandPositions.push([r * Math.cos(ang), height, r * Math.sin(ang)])
  }
  // Pastki 3 ta (0°, 120°, 240° — eclipsed)
  for (let i = 0; i < 3; i++) {
    const ang = (i * 120 * Math.PI) / 180
    ligandPositions.push([r * Math.cos(ang), -height, r * Math.sin(ang)])
  }

  ligandPositions.forEach(([x, y, z], idx) => {
    const donorPos = new THREE.Vector3(x, y, z)

    // Bog' yaratish
    const bond = createBond(molGroup, centerPos, donorPos, CPK.bond, 0.08, 0.7, {
      bondLabelsRef,
      lengthReal: complexData.bondLengthReal,
      showBondLengths: state?.showBondLengths
    })
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand sferasi
    const ligGeo = new THREE.SphereGeometry(complexData.ligand?.donorRadius || 0.28, 32, 32)
    const ligMat = new THREE.MeshStandardMaterial({
      color: complexData.ligand?.donorColor || CPK.C,
      roughness: 0.3,
      metalness: 0.2
    })
    const ligAtom = new THREE.Mesh(ligGeo, ligMat)
    ligAtom.position.copy(donorPos)
    ligAtom.userData = {
      type: "atom",
      element: complexData.ligand?.donor || "L",
      info: ATOM_INFO[complexData.ligand?.donor] || { name: complexData.ligand?.donor },
      isDonor: true
    }
    ligAtom.castShadow = true
    molGroup.add(ligAtom)
    if (atomsRef?.current) atomsRef.current.push(ligAtom)

    const ligLabel = makeTextSprite(complexData.ligand?.donor || "L", {
      color: "#ffffff",
      bgColor: "rgba(10, 30, 60, 0.8)",
      borderColor: "#38bdf8",
      scale: 0.28
    })
    ligLabel.position.copy(donorPos).add(new THREE.Vector3(0, 0.35, 0))
    molGroup.add(ligLabel)
    if (labelsRef?.current) labelsRef.current.push(ligLabel)
  })

  // Tashqi sferadagi ionlar
  if (complexData.outerIon && state?.showOuterSphere) {
    createOuterSphereIons(molGroup, complexData.outerIon, bondLength + 1.2, { atomsRef, labelsRef })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA ASOSIY EKSPORTI
// ═══════════════════════════════════════════════════════════════════════════
export default function TrigonalPrizma3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildTrigonalPrismaticGeometry}
      defaultComplex="ZrMe6"
    />
  )
}
