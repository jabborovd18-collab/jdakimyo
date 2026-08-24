"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 📐 UCHBURCHAK (TRIGONAL-PLANAR) GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/uchburchak/3d (SEO indeksatsiyasi saqlangan)
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
  id: "uchburchak",
  name: "Uchburchak (Trigonal-Planar)",
  icon: "📐",
  angle: "120.0°",
  ks: 3,
  hybridization: "sp²",
  symmetry: "D3h",
  description: "3-koordinatsion tekis uchburchak geometriya (D3h). Odatda Cu(I), Ag(I), Au(I), Hg(II), Pt(0) d¹⁰ konfiguratsiyali ionlarda sp² gibridlanish orqali hosil bo'ladi.",
  backUrl: "/oquv/fazoviy/uchburchak",
  dOrbitalSplitting: {
    theory: "D3h tekis uchburchak ligand maydonida (xy tekisligida) d-orbitallar 3 ta sathga ajraladi:",
    levels: [
      { name: "dx²-y², dxy (e')", energy: "+0.54 Δₜᵣᵢ", desc: "Eng yuqori (xy tekisligidagi 3 ta ligand bilan ta'sirlashuv)", color: "text-yellow-300" },
      { name: "dz² (a₁')", energy: "-0.27 Δₜᵣᵢ", desc: "O'rta past (z o'qida ligandlar yo'q)", color: "text-emerald-300" },
      { name: "dxz, dyz (e'')", energy: "-0.40 Δₜᵣᵢ", desc: "Eng past sath (degeneratsiyalangan)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Konfiguratsiya", key: "dConfig", getValue: (c) => c.dConfig || "d¹⁰ (to'liq to'lgan)" }
    ],
    pairingEnergy: "≈ 20 000 cm⁻¹",
    note: "d¹⁰ komplekslarda barcha (e'')⁴(a₁')²(e')⁴ orbitallar to'liq band bo'lib, d–d o'tishlar kuzatilmaydi (diamagnit)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D3h — 3-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CuCN: {
    id: "CuCN",
    formula: "[Cu(CN)₃]²⁻",
    fullSalt: "K₂[Cu(CN)₃]·H₂O",
    name: "Kaliy tritsianokuprat(I) monohidrat",
    center: { element: "Cu", color: CPK.Cu, radius: 0.45, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.05,
    bondLengthReal: "1.935 Å",
    bondLengthCSD: "1.93–1.96",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp²",
    magnetism: "Diamagnit (μ_eff = 0)",
    color: "Rangsiz kristall",
    density: "1.85 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D3h",
    bondAngle: 120,
    IR: [
      { freq: 2094, mode: "ν(C≡N) sym A₁'", intensity: "kuchsiz (Raman-faol)" },
      { freq: 2076, mode: "ν(C≡N) asym E'", intensity: "juda kuchli" },
      { freq: 390, mode: "ν(Cu–C) sym A₁'", intensity: "Raman-faol" },
      { freq: 365, mode: "ν(Cu–C) asym E'", intensity: "IR-faol" },
      { freq: 120, mode: "δ(C–Cu–C) E'", intensity: "uzoq IR" }
    ],
    UV: [
      { wl: 240, epsilon: 12500, assignment: "MLCT (Cu 3d → CN π*)" },
      { wl: 210, epsilon: 8300, assignment: "π → π* (CN⁻)" }
    ],
    spectroscopy: {
      ir: "ν(C≡N) sym: 2094 cm⁻¹, ν(C≡N) asym: 2076 cm⁻¹, ν(Cu–C): 365–390 cm⁻¹",
      raman: "ν(C≡N): 2094 cm⁻¹, ν(Cu–C): 390 cm⁻¹",
      uvVis: "λmax = 240 nm (ε = 12 500 M⁻¹cm⁻¹, MLCT)"
    },
    thermo: { logK1: 5.63, logK2: 10.53, logK3: 13.61, beta3: 4.07e13, dH: -85.2, dS: 45.6 },
    magProps: { chi: -3.4e-6, xM: -75e-6, diamagnetic: true },
    references: ["Bowmaker et al., J. Chem. Soc. Dalton 1997, 4227", "Chadwick, Frankiss, J. Mol. Struct. 1976, 31, 1"],
    coordNumber: 3
  },
  HgI: {
    id: "HgI",
    formula: "[HgI₃]⁻",
    fullSalt: "K[HgI₃] (Nessler asosi)",
    name: "Kaliy triyodomerkurat(II)",
    center: { element: "Hg", color: CPK.Hg || 0xB8B8D0, radius: 0.55, charge: "+2", oxState: 2 },
    ligand: { type: "I", donor: "I", donorColor: CPK.I || 0x940094, donorRadius: 0.42, denticity: 1 },
    bondLength: 2.9,
    bondLengthReal: "2.724 Å",
    bondLengthCSD: "2.68–2.75",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp² (+ 5d aralashuvi)",
    magnetism: "Diamagnit",
    color: "To'q sariq–qizil kristall",
    density: "5.24 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D3h (buzilgan C2v)",
    bondAngle: 120,
    IR: [
      { freq: 138, mode: "ν(Hg–I) sym A₁'", intensity: "Raman-faol (kuchli)" },
      { freq: 122, mode: "ν(Hg–I) asym E'", intensity: "IR + Raman" },
      { freq: 44, mode: "δ(I–Hg–I) E'", intensity: "uzoq IR" }
    ],
    UV: [
      { wl: 323, epsilon: 6800, assignment: "LMCT (I 5p → Hg 6s)" },
      { wl: 285, epsilon: 4500, assignment: "LMCT" },
      { wl: 210, epsilon: 15000, assignment: "π → π*" }
    ],
    spectroscopy: {
      ir: "ν(Hg–I) sym: 138 cm⁻¹, ν(Hg–I) asym: 122 cm⁻¹, δ(I–Hg–I): 44 cm⁻¹",
      raman: "ν(Hg–I): 138 cm⁻¹ (kuchli)",
      uvVis: "λmax = 323 nm (LMCT I 5p → Hg 6s)"
    },
    thermo: { logK1: 12.87, logK2: 23.82, logK3: 27.60, beta3: 4.0e27, dH: -142, dS: 78 },
    magProps: { chi: -4.7e-6, xM: -180e-6, diamagnetic: true },
    references: ["Persson et al., Inorg. Chem. 2002, 41, 3820", "Sandström, Persson, J. Chem. Soc. Dalton 1978, 1794"],
    coordNumber: 3
  },
  PtPPh3: {
    id: "PtPPh3",
    formula: "[Pt(PPh₃)₃]",
    fullSalt: "Tris(trifenilfosfin)platina(0)",
    name: "[Pt(PPh₃)₃] — Malatesta kompleksi",
    center: { element: "Pt", color: CPK.Pt || 0xD0D0E0, radius: 0.50, charge: "0", oxState: 0 },
    ligand: { type: "PPh3", donor: "P", donorColor: CPK.P || 0xFF8000, donorRadius: 0.38, denticity: 1 },
    bondLength: 2.45,
    bondLengthReal: "2.263 Å",
    bondLengthCSD: "2.25–2.28",
    outerIon: null,
    hybridization: "sp² (dxy + dx²-y² aralashuvli)",
    magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall",
    density: "1.68 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D3 (approx. D3h)",
    bondAngle: 120,
    IR: [
      { freq: 1094, mode: "ν(P–C) fenil", intensity: "kuchli" },
      { freq: 745, mode: "δ(C–H) tekislikdan tashqari", intensity: "juda kuchli" },
      { freq: 517, mode: "δ(P–Pt–P) sym", intensity: "o'rta" },
      { freq: 197, mode: "ν(Pt–P) sym A₁'", intensity: "Raman-faol" },
      { freq: 175, mode: "ν(Pt–P) asym E'", intensity: "IR-faol" }
    ],
    UV: [
      { wl: 385, epsilon: 3200, assignment: "d(Pt) → π*(PPh₃) MLCT" },
      { wl: 305, epsilon: 8700, assignment: "d–d + MLCT" },
      { wl: 254, epsilon: 22000, assignment: "π → π* (fenil)" }
    ],
    spectroscopy: {
      ir: "ν(P–C): 1094 cm⁻¹, δ(C–H): 745 cm⁻¹, ν(Pt–P): 175–197 cm⁻¹",
      raman: "ν(Pt–P): 197 cm⁻¹",
      uvVis: "λmax = 385 nm (d(Pt) → π*(PPh₃) MLCT)"
    },
    thermo: { logK: 24.5, beta3: 3.2e24, dH: -186, dS: -32, note: "Havoda barqaror emas" },
    magProps: { chi: -6.2e-6, xM: -340e-6, diamagnetic: true },
    references: ["Ugo, Cariati, La Monica, Inorg. Synth. 1968, 11, 105", "Albinati et al., Inorg. Chim. Acta 1990, 168, 213"],
    coordNumber: 3
  },
  AgCN: {
    id: "AgCN",
    formula: "[Ag(CN)₃]²⁻",
    fullSalt: "K₂[Ag(CN)₃]",
    name: "Kaliy tritsianoargentat(I)",
    center: { element: "Ag", color: CPK.Ag, radius: 0.48, charge: "+1", oxState: 1 },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.27, denticity: 1 },
    bondLength: 2.25,
    bondLengthReal: "2.135 Å",
    bondLengthCSD: "2.11–2.16",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 2 },
    hybridization: "sp² (5d aralashuvli)",
    magnetism: "Diamagnit",
    color: "Rangsiz kristall",
    density: "2.36 g/cm³",
    dConfig: "d¹⁰",
    dElectrons: 10,
    geometry: "Trigonal-planar",
    symmetry: "D3h",
    bondAngle: 120,
    IR: [
      { freq: 2140, mode: "ν(C≡N) sym A₁'", intensity: "Raman-faol" },
      { freq: 2105, mode: "ν(C≡N) asym E'", intensity: "juda kuchli IR" },
      { freq: 360, mode: "ν(Ag–C) sym A₁'", intensity: "Raman-faol" },
      { freq: 310, mode: "ν(Ag–C) asym E'", intensity: "IR-faol" }
    ],
    UV: [
      { wl: 234, epsilon: 14200, assignment: "MLCT (Ag 4d → CN π*)" },
      { wl: 209, epsilon: 9500, assignment: "π → π* (CN⁻)" }
    ],
    spectroscopy: {
      ir: "ν(C≡N) sym: 2140 cm⁻¹, ν(C≡N) asym: 2105 cm⁻¹, ν(Ag–C): 310–360 cm⁻¹",
      raman: "ν(C≡N): 2140 cm⁻¹, ν(Ag–C): 360 cm⁻¹",
      uvVis: "λmax = 234 nm (MLCT Ag 4d → CN π*)"
    },
    thermo: { logK1: 5.30, logK2: 10.98, logK3: 21.7, beta3: 5.0e21, dH: -95.8, dS: 52.3 },
    magProps: { chi: -3.9e-6, xM: -103e-6, diamagnetic: true },
    references: ["Bowmaker, Kennedy, Reid, Inorg. Chem. 1998, 37, 3968"],
    coordNumber: 3
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. UCHBURCHAK (D3h) 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildTrigonalPlanarGeometry(molGroup, complexData, refs, state) {
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

  // 3 ta trigonal-planar koordinata (120° burchak ostida, xz tekisligi)
  const d = complexData.bondLength || 2.1
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]
  const ligandPositions = angles.map((ang) => [
    d * Math.cos(ang),
    0,
    d * Math.sin(ang)
  ])

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
    if (complexData.ligand?.type === "CN") {
      createCNLigand(molGroup, donorPos, centerPos, { atomsRef, labelsRef, bondsRef })
    } else {
      // I⁻, PPh3 (P atomi) va boshqa monoatomik ligandlar
      const ligGeo = new THREE.SphereGeometry(complexData.ligand?.donorRadius || 0.35, 32, 32)
      const ligMat = new THREE.MeshStandardMaterial({
        color: complexData.ligand?.donorColor || 0x940094,
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
export default function Uchburchak3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildTrigonalPlanarGeometry}
      defaultComplex="CuCN"
    />
  )
}
