"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🥪 SENDVICH (METALLOTSEN) GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/sendvich/3d (SEO indeksatsiyasi saqlangan)
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
  id: "sendvich",
  name: "Sendvich (Metallotsen)",
  icon: "🥪",
  angle: "108° (Cp halqa), 180° (Centroid–M–Centroid)",
  ks: "η⁵ + η⁵ (10 C atom)",
  hybridization: "d²sp³ (σ) + η⁵–π MO",
  symmetry: "D5d (staggered) / D5h (eclipsed)",
  description: "Sendvich tuzilishli metallotsen birikmalari. Markaziy metall atomi (Fe, Ni, Co, Ru) ikkita parallel siklopentadienil (Cp⁻, C₅H₅⁻) aromatik halqasi o'rtasida sendvich shaklida joylashadi. 18-elektron qoidasiga to'liq mos keladi.",
  backUrl: "/oquv/fazoviy/sendvich",
  dOrbitalSplitting: {
    theory: "D5d metallotsen molekulyar orbital (MO) maydonida d-orbitallar quyidagicha ajraladi:",
    levels: [
      { name: "e₁g* (dxz, dyz)", energy: "+1.15 Δ", desc: "Eng yuqori antibog'lovchi sath (Cp π-orbitallari bilan antibog'lanish)", color: "text-yellow-300" },
      { name: "a₁g' (dz²)", energy: "+0.10 Δ", desc: "Kuchsiz bog'lovchi / bog'lanmagan sath (metal z-o'qi bo'ylab)", color: "text-emerald-300" },
      { name: "e₂g (dxy, dx²-y²)", energy: "-0.45 Δ", desc: "Eng past bog'lovchi sath (Cp halqa π-sistemasi bilan kuchli ta'sirlashuv)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Δ₁ (e₂g → a₁g')", key: "delta1", getValue: (c) => `${(c.dOrbital?.delta1 || 21000).toLocaleString()} cm⁻¹` },
      { label: "Δ₂ (a₁g' → e₁g*)", key: "delta2", getValue: (c) => `${(c.dOrbital?.delta2 || 26000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 17 000 cm⁻¹",
    note: "Ferrotsenda Fe(II) ning barcha 6 ta d-elektroni (e₂g)⁴ va (a₁g')² orbitallarini to'liq to'ldiradi (18e⁻ qoidasi, diamagnit). Nikelotsenda esa qo'shimcha 2 ta elektron antibog'lovchi e₁g* ga tushadi (20e⁻, paramagnit)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D5d / D5h — Metallotsenlar)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  Ferrocene: {
    id: "Ferrocene",
    formula: "[Fe(η⁵-C₅H₅)₂]",
    fullSalt: "Fe(C₅H₅)₂  (‘ferrotsen’)",
    name: "Bis(η⁵-tsiklopentadienil)temir(II)",
    center: { element: "Fe", color: CPK.Fe || 0xE06633, radius: 0.42, charge: "+2" },
    ligand: { type: "Cp", donor: "C", donorColor: CPK.C, donorRadius: 0.22, label: "Cp⁻" },
    ringCentroidDist: 1.66,
    ringRadius: 1.21,
    ccBond: 1.44,
    chBond: 1.09,
    bondLength: 2.04,
    bondLengthReal: "2.04 Å",
    ringCentroidReal: "1.66 Å",
    ccBondReal: "1.44 Å",
    chBondReal: "1.09 Å",
    outerIon: null,
    hybridization: "d²sp³ (σ skelet) + η⁵–π kovalent",
    magnetism: "Diamagnit",
    color: "To'q-sariq kristall (t.p. 172°C)",
    dOrbital: { e2g: 4, a1g: 2, e1gStar: 0, type: "LS", delta1: 21000, delta2: 26000 },
    geometry: "Sendvich (metallotsen)",
    symmetry: "D5d",
    dElectrons: 6,
    conformation: "staggered",
    valenceElectrons: 18,
    coordNumber: 10
  },
  Nickelocene: {
    id: "Nickelocene",
    formula: "[Ni(η⁵-C₅H₅)₂]",
    fullSalt: "Ni(C₅H₅)₂  (‘nikelotsen’)",
    name: "Bis(η⁵-tsiklopentadienil)nikel(II)",
    center: { element: "Ni", color: CPK.Ni || 0x50D050, radius: 0.44, charge: "+2" },
    ligand: { type: "Cp", donor: "C", donorColor: CPK.C, donorRadius: 0.22, label: "Cp⁻" },
    ringCentroidDist: 1.82,
    ringRadius: 1.21,
    ccBond: 1.43,
    chBond: 1.09,
    bondLength: 2.20,
    bondLengthReal: "2.20 Å",
    ringCentroidReal: "1.82 Å",
    ccBondReal: "1.43 Å",
    chBondReal: "1.09 Å",
    outerIon: null,
    hybridization: "d²sp³ (σ skelet) + η⁵–π",
    magnetism: "Paramagnit (2 juftlashmagan e⁻, μₑff ≈ 2.86 μB)",
    color: "To'q-yashil kristall",
    dOrbital: { e2g: 4, a1g: 2, e1gStar: 2, type: "HS", delta1: 17000, delta2: 22000 },
    geometry: "Sendvich (metallotsen)",
    symmetry: "D5d",
    dElectrons: 8,
    conformation: "staggered",
    valenceElectrons: 20,
    coordNumber: 10
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SENDVICH (METALLOTSEN) 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildSandwichGeometry(molGroup, complexData, refs, state) {
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

  // 2 ta Cp halqasi (yuqori: +y, pastki: -y)
  const h = complexData.ringCentroidDist || 1.66
  const rRing = complexData.ringRadius || 1.21
  const rH = rRing + 0.6

  const rings = [
    { y: h, offsetAngle: 0, label: "Cp(yuqori)" },
    { y: -h, offsetAngle: (36 * Math.PI) / 180, label: "Cp(pastki)" } // staggered
  ]

  rings.forEach((ring) => {
    const cPositions = []
    for (let i = 0; i < 5; i++) {
      const ang = (i * 72 * Math.PI) / 180 + ring.offsetAngle
      const cPos = new THREE.Vector3(rRing * Math.cos(ang), ring.y, rRing * Math.sin(ang))
      const hPos = new THREE.Vector3(rH * Math.cos(ang), ring.y, rH * Math.sin(ang))
      cPositions.push(cPos)

      // C atomi
      const cGeo = new THREE.SphereGeometry(0.22, 24, 24)
      const cMat = new THREE.MeshStandardMaterial({
        color: CPK.C,
        roughness: 0.4,
        metalness: 0.2
      })
      const cAtom = new THREE.Mesh(cGeo, cMat)
      cAtom.position.copy(cPos)
      cAtom.userData = { type: "atom", element: "C", info: ATOM_INFO.C, isDonor: true }
      cAtom.castShadow = true
      molGroup.add(cAtom)
      if (atomsRef?.current) atomsRef.current.push(cAtom)

      // H atomi
      const hGeo = new THREE.SphereGeometry(0.14, 16, 16)
      const hMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1
      })
      const hAtom = new THREE.Mesh(hGeo, hMat)
      hAtom.position.copy(hPos)
      hAtom.userData = { type: "atom", element: "H", info: ATOM_INFO.H }
      molGroup.add(hAtom)
      if (atomsRef?.current) atomsRef.current.push(hAtom)

      // C-H bog'i
      createBond(molGroup, cPos, hPos, 0xcccccc, 0.04, 0.8)

      // Fe-C (η⁵ koordinatsion bog'i)
      const bond = createBond(molGroup, centerPos, cPos, 0xffcc88, 0.05, 0.6, {
        bondLabelsRef,
        lengthReal: complexData.bondLengthReal,
        showBondLengths: state?.showBondLengths
      })
      if (bondsRef?.current) bondsRef.current.push(bond)
    }

    // Halqa C-C bog'lari (5 ta qovurg'a)
    for (let i = 0; i < 5; i++) {
      const p1 = cPositions[i]
      const p2 = cPositions[(i + 1) % 5]
      createBond(molGroup, p1, p2, 0xffb066, 0.06, 0.9)
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA ASOSIY EKSPORTI
// ═══════════════════════════════════════════════════════════════════════════
export default function Sendvich3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildSandwichGeometry}
      defaultComplex="Ferrocene"
    />
  )
}
