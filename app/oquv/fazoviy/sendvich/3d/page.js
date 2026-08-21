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
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D5d / D5h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "sendvich",
  name: "Sendvich (metallotsen)",
  icon: "🥪",
  angle: "180° (Cp–M–Cp)",
  ks: 10,
  hybridization: "d²sp³ (σ) + η⁵-π",
  symmetry: "D₅d / D₅h",
  backUrl: "/oquv/fazoviy/sendvich",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Sendvich / Metallotsen (D5d) maydonida d-orbitallarning MO ajralishi:",
    deltaSymbol: "Δ₁ / Δ₂",
    deltaValue: "21 000–26 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "e₁g* (dxz, dyz)", energy: "+1.15 Δ (Eng yuqori, antibog'lovchi)", type: "high" },
      { label: "a₁g (dz²)", energy: "+0.10 Δ (Markaziy metall bo'ylab, bog'lanmagan)", type: "mid" },
      { label: "e₂g (dxy, dx²-y²)", energy: "-0.65 Δ (Eng quyi, bog'lovchi sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  Ferrocene: {
    id: "Ferrocene",
    formula: "[Fe(η⁵-C₅H₅)₂]",
    fullSalt: "Fe(C₅H₅)₂ (Ferrotsen)",
    name: "Bis(η⁵-siklopentadienil)temir(II)",
    center: { element: "Fe", color: 0xE06633, radius: 0.45, charge: "+2" },
    ligand: { type: "Cp", donor: "C", donorColor: CPK.C, donorRadius: 0.22 },
    ringCentroidDist: 1.66,
    ringRadius: 1.21,
    bondLength: 2.04,
    bondLengthReal: "2.04 Å (Fe-C) / 1.66 Å (Fe-centroid)",
    outerIon: null,
    hybridization: "d²sp³ + η⁵-π",
    magnetism: "Diamagnit (18 elektronli barqaror qobiq)",
    color: "To'q sariq kristall",
    dOrbital: { e2g: 4, a1g: 2, e1gStar: 0, type: "LS d⁶", deltaO: 21000 },
    geometry: "Sendvich",
    symmetry: "D₅d (staggered)",
    dElectrons: 6,
    coordNumber: 10
  },
  Nickelocene: {
    id: "Nickelocene",
    formula: "[Ni(η⁵-C₅H₅)₂]",
    fullSalt: "Ni(C₅H₅)₂ (Nikelotsen)",
    name: "Bis(η⁵-siklopentadienil)nikel(II)",
    center: { element: "Ni", color: CPK.Ni, radius: 0.46, charge: "+2" },
    ligand: { type: "Cp", donor: "C", donorColor: CPK.C, donorRadius: 0.22 },
    ringCentroidDist: 1.82,
    ringRadius: 1.21,
    bondLength: 2.20,
    bondLengthReal: "2.20 Å (Ni-C) / 1.82 Å (Ni-centroid)",
    outerIon: null,
    hybridization: "d²sp³ + η⁵-π",
    magnetism: "Paramagnit (20 elektron, e₁g* da 2 ta toq e⁻)",
    color: "To'q yashil kristall",
    dOrbital: { e2g: 4, a1g: 2, e1gStar: 2, type: "HS d⁸", deltaO: 17000 },
    geometry: "Sendvich",
    symmetry: "D₅d",
    dElectrons: 8,
    coordNumber: 10
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SENDVICH 3D GEOMETRIYANI QURISH (Fe + 2 ta Cp halqasi)
// ═══════════════════════════════════════════════════════════════════════════
function buildSandwichGeometry(molGroup, complexData, refs, state) {
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

  // Ikkita Cp halqasi: yuqori (+Y) va pastki (-Y)
  const centroidDist = complexData.ringCentroidDist || 1.66
  const ringR = complexData.ringRadius || 1.21

  const buildCp = (yPos, twistAngle) => {
    const ringGroup = new THREE.Group()
    ringGroup.position.set(0, yPos, 0)

    const cMeshes = []

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 + twistAngle
      const cx = ringR * Math.cos(angle)
      const cz = ringR * Math.sin(angle)
      const cPos = new THREE.Vector3(cx, 0, cz)

      // C atomi
      const cGeo = new THREE.SphereGeometry(0.20, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4 })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.copy(cPos)
      cMesh.userData = {
        type: "atom",
        element: "C",
        info: ATOM_INFO.C || { name: "Uglerod (Cp halqa)" },
        baseScale: state.scale
      }
      ringGroup.add(cMesh)
      if (atomsRef?.current) atomsRef.current.push(cMesh)
      cMeshes.push(cMesh)

      // H atomi (tashqi radial)
      const hPos = cPos.clone().multiplyScalar(1.85)
      const hGeo = new THREE.SphereGeometry(0.13, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5 })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = {
        type: "atom",
        element: "H",
        info: ATOM_INFO.H || { name: "Vodorod" },
        baseScale: state.scale
      }
      ringGroup.add(hMesh)
      if (atomsRef?.current) atomsRef.current.push(hMesh)

      // C-H bog'i
      const chBond = createBond(cPos, hPos, 0.04, 0xbbbbbb)
      ringGroup.add(chBond)
      if (bondsRef?.current) bondsRef.current.push(chBond)

      // Fe-C koordinatsion bog'i
      const worldCPos = new THREE.Vector3(cx, yPos, cz)
      const mcBond = createBond(centerPos, worldCPos, 0.05, 0xffcc88)
      molGroup.add(mcBond)
      if (bondsRef?.current) bondsRef.current.push(mcBond)
    }

    // C-C aromatik halqa bog'lari (5 ta)
    for (let i = 0; i < 5; i++) {
      const p1 = cMeshes[i].position
      const p2 = cMeshes[(i + 1) % 5].position
      const ccBond = createBond(p1, p2, 0.065, 0xffb066)
      ringGroup.add(ccBond)
      if (bondsRef?.current) bondsRef.current.push(ccBond)
    }

    molGroup.add(ringGroup)
  }

  // Staggered (D5d) rotamer: 0° va 36° (pi / 5)
  buildCp(centroidDist, 0)
  buildCp(-centroidDist, Math.PI / 5)
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function SendvichPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="Ferrocene"
      buildGeometry={buildSandwichGeometry}
    />
  )
}
