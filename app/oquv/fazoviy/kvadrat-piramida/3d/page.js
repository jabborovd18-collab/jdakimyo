"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🔺 KVADRAT PIRAMIDA (SQUARE PYRAMIDAL) GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/kvadrat-piramida/3d (SEO indeksatsiyasi saqlangan)
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
  id: "kvadrat-piramida",
  name: "Kvadrat piramida (Square Pyramidal)",
  icon: "🔺",
  angle: "90°, 180°, ~105° (apikal-ekvatorial)",
  ks: 5,
  hybridization: "dsp³ / d²sp²",
  symmetry: "C4v",
  description: "5-koordinatsion kvadrat piramidal geometriya (C4v). Odatda VO²⁺ (vanadil), Mo(V), Ni(II), Fe(III) komplekslarida apikal kuchli donor (masalan O²⁻) yoki sterik sabablar tufayli hosil bo'ladi.",
  backUrl: "/oquv/fazoviy/kvadrat-piramida",
  dOrbitalSplitting: {
    theory: "C4v kvadrat piramidal ligand maydonida d-orbitallar 4 ta sathga ajraladi:",
    levels: [
      { name: "dx²-y² (b₁)", energy: "+0.914 Δ", desc: "Eng yuqori (4 ta ekvatorial ligand bilan to'g'ridan-to'g'ri σ-itarilish)", color: "text-yellow-300" },
      { name: "dz² (a₁)", energy: "+0.086 Δ", desc: "O'rta yuqori (apikal ligand bilan ta'sirlashuv)", color: "text-amber-300" },
      { name: "dxy (b₂)", energy: "-0.086 Δ", desc: "O'rta past (ekvatorial ligandlar orasida)", color: "text-emerald-300" },
      { name: "dxz, dyz (e)", energy: "-0.457 Δ", desc: "Eng past (degeneratsiyalangan)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Δ1 (b₁–a₁)", key: "delta1", getValue: (c) => `${(c.dOrbital?.delta1 || 12000).toLocaleString()} cm⁻¹` },
      { label: "Δ2 (a₁–b₂)", key: "delta2", getValue: (c) => `${(c.dOrbital?.delta2 || 8000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 18 000 cm⁻¹",
    note: "[VO(acac)₂] da d¹ elektron eng past e/b₂ orbitalda joylashadi va paramagnit bo'ladi (μ ≈ 1.73 μB)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (C4v — 5-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  VOacac: {
    id: "VOacac",
    formula: "[VO(acac)₂]",
    fullSalt: "[VO(C₅H₇O₂)₂]",
    name: "Vanadil bis(atsetilatsetonat)",
    center: { element: "V", color: CPK.V || 0xA6A6AB, radius: 0.45, charge: "+4" },
    ligand: { type: "acac_O", donor: "O", donorColor: CPK.O, donorRadius: 0.30 },
    apicalLigand: { type: "oxo", donor: "O", donorColor: CPK.O, donorRadius: 0.32, label: "O²⁻" },
    bondLength: 2.0,
    bondLengthApical: 1.5,
    bondLengthReal: "1.97 Å",
    bondLengthApicalReal: "1.58 Å",
    outerIon: null,
    hybridization: "dsp³",
    magnetism: "Paramagnit (μ ≈ 1.73 μB)",
    color: "Ko'k-yashil kristall",
    dOrbital: { e: 1, b2: 0, a1: 0, b1: 0, type: "—", delta1: 12000, delta2: 8000 },
    geometry: "Kvadrat piramida",
    symmetry: "C4v",
    dElectrons: 1,
    coordNumber: 5
  },
  NiCN5: {
    id: "NiCN5",
    formula: "[Ni(CN)₅]³⁻",
    fullSalt: "[Cr(en)₃][Ni(CN)₅] · 1.5H₂O",
    name: "Pentatsianonikkelat(II)",
    center: { element: "Ni", color: CPK.Ni || 0x50D050, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    apicalLigand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25, label: "CN⁻" },
    bondLength: 2.0,
    bondLengthApical: 2.15,
    bondLengthReal: "1.86 Å",
    bondLengthApicalReal: "2.17 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 3 },
    hybridization: "dsp³",
    magnetism: "Diamagnit",
    color: "To'q-qizil kristall",
    dOrbital: { e: 4, b2: 2, a1: 2, b1: 0, type: "LS", delta1: 18000, delta2: 14000 },
    geometry: "Kvadrat piramida",
    symmetry: "C4v",
    dElectrons: 8,
    coordNumber: 5
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. KVADRAT PIRAMIDA 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePyramidalGeometry(molGroup, complexData, refs, state) {
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

  const dEq = complexData.bondLength || 2.0
  const dAp = complexData.bondLengthApical || 1.8
  const baseOffset = -0.2

  // 4 ta ekvatorial ligand (kvadrat asosida) + 1 ta apikal ligand (+y da)
  const ligandCoords = [
    { pos: [dEq, baseOffset, 0], isApical: false },
    { pos: [0, baseOffset, dEq], isApical: false },
    { pos: [-dEq, baseOffset, 0], isApical: false },
    { pos: [0, baseOffset, -dEq], isApical: false },
    { pos: [0, dAp, 0], isApical: true }
  ]

  ligandCoords.forEach(({ pos: [x, y, z], isApical }) => {
    const donorPos = new THREE.Vector3(x, y, z)
    const ligInfo = isApical ? (complexData.apicalLigand || complexData.ligand) : complexData.ligand
    const lengthReal = isApical ? complexData.bondLengthApicalReal : complexData.bondLengthReal

    // Bog' yaratish
    const bond = createBond(molGroup, centerPos, donorPos, CPK.bond, isApical ? 0.09 : 0.08, 0.7, {
      bondLabelsRef,
      lengthReal,
      showBondLengths: state?.showBondLengths
    })
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand turiga qarab yasash
    if (ligInfo?.type === "CN") {
      createCNLigand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
    } else if (ligInfo?.type === "NH3") {
      createNH3Ligand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
    } else {
      // O², Cl⁻ va monoatomik ligandlar
      const ligGeo = new THREE.SphereGeometry(ligInfo?.donorRadius || 0.30, 32, 32)
      const ligMat = new THREE.MeshStandardMaterial({
        color: ligInfo?.donorColor || CPK.O,
        roughness: 0.3,
        metalness: 0.2
      })
      const ligAtom = new THREE.Mesh(ligGeo, ligMat)
      ligAtom.position.copy(donorPos)
      ligAtom.userData = {
        type: "atom",
        element: ligInfo?.donor || "O",
        info: ATOM_INFO[ligInfo?.donor] || { name: ligInfo?.donor },
        isDonor: true
      }
      ligAtom.castShadow = true
      molGroup.add(ligAtom)
      if (atomsRef?.current) atomsRef.current.push(ligAtom)

      const ligLabel = makeTextSprite(ligInfo?.label || ligInfo?.donor || "L", {
        color: "#ffffff",
        bgColor: "rgba(10, 30, 60, 0.8)",
        borderColor: "#38bdf8",
        scale: 0.28
      })
      ligLabel.position.copy(donorPos).add(new THREE.Vector3(0, 0.4, 0))
      molGroup.add(ligLabel)
      if (labelsRef?.current) labelsRef.current.push(ligLabel)
    }
  })

  // Tashqi sferadagi ionlar
  if (complexData.outerIon && state?.showOuterSphere) {
    createOuterSphereIons(molGroup, complexData.outerIon, dEq + 1.2, { atomsRef, labelsRef })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA ASOSIY EKSPORTI
// ═══════════════════════════════════════════════════════════════════════════
export default function KvadratPiramida3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildSquarePyramidalGeometry}
      defaultComplex="VOacac"
    />
  )
}
