"use client"

// ═══════════════════════════════════════════════════════════════════════════
// ⏹️ TEKIS KVADRAT (SQUARE PLANAR) GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/tekis-kvadrat/3d (SEO indeksatsiyasi saqlangan)
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
  id: "tekis-kvadrat",
  name: "Tekis kvadrat (Square Planar)",
  icon: "⏹️",
  angle: "90°, 180°",
  ks: 4,
  hybridization: "dsp²",
  symmetry: "D4h",
  description: "4-koordinatsion tekis kvadrat geometriya (D4h). Odatda Pt(II), Pd(II), Ni(II), Au(III) kabi d⁸ metall ionlarida dsp² gibridlanish tufayli hosil bo'ladi va diamagnit hisoblanadi.",
  backUrl: "/oquv/fazoviy/tekis-kvadrat",
  dOrbitalSplitting: {
    theory: "D4h tekis kvadrat ligand maydonida (xy tekisligida) d-orbitallar 4 ta energetik sathga ajraladi:",
    levels: [
      { name: "dx²-y² (b₁g)", energy: "+1.228 Δₛₚ", desc: "Eng yuqori (ligandlar bilan to'g'ridan-to'g'ri σ-to'qnashuv)", color: "text-yellow-300" },
      { name: "dxy (b₂g)", energy: "+0.228 Δₛₚ", desc: "O'rta yuqori sath (ligandlar orasida, xy tekisligida)", color: "text-amber-300" },
      { name: "dz² (a₁g)", energy: "-0.428 Δₛₚ", desc: "Pastki sath (aksial sohada ligandlar yo'q)", color: "text-emerald-300" },
      { name: "dxz, dyz (eg)", energy: "-0.514 Δₛₚ", desc: "Eng past sath (degeneratsiyalangan)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Ajralish parametri (Δₒ)", key: "deltaO", getValue: (c) => `${(c.dOrbital?.deltaO || 29000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 20 000 cm⁻¹",
    note: "d⁸ elektronlar (eg)⁴(a₁g)²(b₂g)² holatda to'liq juftlashib joylashadi, eng yuqori b₁g (dx²-y²) esa bo'sh qoladi (diamagnit)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D4h — 4-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  PtCl4: {
    id: "PtCl4",
    formula: "[PtCl₄]²⁻",
    fullSalt: "K₂[PtCl₄]",
    name: "Kaliy tetrakloroplatinat(II)",
    center: { element: "Pt", color: CPK.Pt || 0xE0C0A0, radius: 0.50, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.3,
    bondLengthReal: "2.31 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "To'q qizil-jigarrang kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 29000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  NiCN4: {
    id: "NiCN4",
    formula: "[Ni(CN)₄]²⁻",
    fullSalt: "K₂[Ni(CN)₄]",
    name: "Kaliy tetratsianonikelat(II)",
    center: { element: "Ni", color: CPK.Ni || 0x50C050, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.90,
    bondLengthReal: "1.87 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "Sariq kristall",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 34000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  CuNH3: {
    id: "CuNH3",
    formula: "[Cu(NH₃)₄]²⁺",
    fullSalt: "[Cu(NH₃)₄]SO₄",
    name: "Tetraamminmis(II) sulfat",
    center: { element: "Cu", color: CPK.Cu, radius: 0.48, charge: "+2" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.05,
    bondLengthReal: "2.03 Å",
    outerIon: { element: "S", color: CPK.S || 0xFFFF30, radius: 0.35, charge: "-2", count: 1 },
    hybridization: "dsp²",
    magnetism: "Paramagnit (1 ta juftlanmagan)",
    color: "To'q ko'k-binafsha",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 1, type: "HS", deltaO: 18000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h (Jahn-Teller)",
    dElectrons: 9,
    coordNumber: 4
  },
  PdCl4: {
    id: "PdCl4",
    formula: "[PdCl₄]²⁻",
    fullSalt: "K₂[PdCl₄]",
    name: "Kaliy tetrakloropalladat(II)",
    center: { element: "Pd", color: CPK.Pd || 0x7090C0, radius: 0.48, charge: "+2" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.32,
    bondLengthReal: "2.30 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "To'q sariq-jigarrang",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 27000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  },
  AuCl4: {
    id: "AuCl4",
    formula: "[AuCl₄]⁻",
    fullSalt: "HAuCl₄",
    name: "Xloroklorat(III) kislota (Tetrakloroaurat(III))",
    center: { element: "Au", color: CPK.Au, radius: 0.52, charge: "+3" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38 },
    bondLength: 2.28,
    bondLengthReal: "2.27 Å",
    outerIon: { element: "H", color: CPK.H, radius: 0.20, charge: "+1", count: 1 },
    hybridization: "dsp²",
    magnetism: "Diamagnit",
    color: "Sariq kristall (gigroskopik)",
    dOrbital: { dxy: 2, dxz: 2, dyz: 2, dz2: 2, dx2y2: 0, type: "LS", deltaO: 23000 },
    geometry: "Tekis kvadrat",
    symmetry: "D4h",
    dElectrons: 8,
    coordNumber: 4
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TEKIS KVADRAT 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePlanarGeometry(molGroup, complexData, refs, state) {
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

  // 4 ta tekis kvadrat koordinata: [d, 0, 0], [0, 0, d], [-d, 0, 0], [0, 0, -d] (90°, xy tekisligi)
  const d = complexData.bondLength || 2.0
  const ligandPositions = [
    [d, 0, 0],
    [0, 0, d],
    [-d, 0, 0],
    [0, 0, -d]
  ]

  ligandPositions.forEach(([x, y, z], idx) => {
    const donorPos = new THREE.Vector3(x, y, z)

    // Bog' yaratish
    const bond = createBond(molGroup, centerPos, donorPos, CPK.bond, 0.08, 0.7, {
      bondLabelsRef,
      lengthReal: complexData.bondLengthReal,
      showBondLengths: state?.showBondLengths
    })
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand turiga qarab yasash
    if (complexData.ligand?.type === "NH3") {
      createNH3Ligand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
    } else if (complexData.ligand?.type === "CN") {
      createCNLigand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
    } else {
      // Cl⁻ va boshqa monoatomik ligandlar
      const ligGeo = new THREE.SphereGeometry(complexData.ligand?.donorRadius || 0.35, 32, 32)
      const ligMat = new THREE.MeshStandardMaterial({
        color: complexData.ligand?.donorColor || 0x1ff01f,
        roughness: 0.3,
        metalness: 0.2
      })
      const ligAtom = new THREE.Mesh(ligGeo, ligMat)
      ligAtom.position.copy(donorPos)
      ligAtom.userData = {
        type: "atom",
        element: complexData.ligand?.donor || "Cl",
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
      ligLabel.position.copy(donorPos).add(new THREE.Vector3(0, 0.4, 0))
      molGroup.add(ligLabel)
      if (labelsRef?.current) labelsRef.current.push(ligLabel)
    }
  })

  // Tashqi sferadagi ionlar
  if (complexData.outerIon && state?.showOuterSphere) {
    createOuterSphereIons(molGroup, complexData.outerIon, d + 1.2, { atomsRef, labelsRef })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SAHIFA ASOSIY EKSPORTI
// ═══════════════════════════════════════════════════════════════════════════
export default function TekisKvadrat3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildSquarePlanarGeometry}
      defaultComplex="PtCl4"
    />
  )
}
