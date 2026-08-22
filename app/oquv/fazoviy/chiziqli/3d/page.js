"use client"

// ═══════════════════════════════════════════════════════════════════════════
// ➖ CHIZIQLI GEOMETRIYA (D∞h — 2-koordinatsiya) — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/chiziqli/3d (SEO indeksatsiyasi saqlangan)
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import {
  CPK,
  ATOM_INFO,
  makeTextSprite,
  createBond,
  createClLigand,
  createCNLigand,
  createNH3Ligand,
  createOuterSphereIons,
  FazoviyKoruvchi
} from "@/lib/fazoviy"

// ═══════════════════════════════════════════════════════════════════════════
// 1. GEOMETRIYA MA'LUMOTLARI VA d-ORBITAL AJRALISHI (D∞h)
// ═══════════════════════════════════════════════════════════════════════════
const GEOMETRY_INFO = {
  id: "chiziqli",
  name: "Chiziqli (Linear)",
  icon: "➖",
  angle: "180.0°",
  ks: 2,
  hybridization: "sp",
  symmetry: "D∞h",
  backUrl: "/oquv/fazoviy/chiziqli",
  dOrbitalSplitting: {
    hasSplitting: true,
    theory: "Chiziqli (D∞h) maydonda (z o'qi bo'ylab ligandlar) d-orbitallarning ajralishi:",
    deltaSymbol: "Δ₁ / Δ₂",
    deltaValue: "8 000–28 000 cm⁻¹",
    pairingEnergy: "≈ 20 000 cm⁻¹",
    levels: [
      { label: "σg* (dz²)", energy: "+1.03 Δ (Eng yuqori, aksial to'qnashuv)", type: "high" },
      { label: "πg (dxz, dyz)", energy: "-0.11 Δ (O'rta sath, bog'lanmagan)", type: "mid" },
      { label: "δg (dx²-y², dxy)", energy: "-0.40 Δ (Eng quyi sath)", type: "low" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (Asl ilmiy o'lchovlar va spektroskopik ma'lumotlar)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  AgNH3: {
    id: "AgNH3",
    formula: "[Ag(NH₃)₂]⁺",
    fullSalt: "[Ag(NH₃)₂]Cl (Tollens reagenti)",
    name: "Diamminkumush(I) xlorid",
    center: { element: "Ag", color: CPK.Ag, radius: 0.50, charge: "+1" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.35, label: "NH₃", classification: "σ-donor, kuchsiz π-donor" },
    bondLength: 2.20,
    bondLengthReal: "2.13 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.38, charge: "-1", count: 1 },
    hybridization: "sp (linear)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz (aq. eritma) / oq kristall",
    meltingPoint: "150 °C (parchalanadi)",
    dElectrons: 10,
    dConfig: "[Kr] 4d¹⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — infinite rotation axis + horizontal plane + inversion",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 8000, delta2_cm: 22000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "d¹⁰ to'liq to'ldirilgan qobiq + sp gibridlanish + ligand maydoni og'ish qilmaydi",
    description: "Kumush(I) diammin kompleksi — Tollens reagenti asosiy komponenti. Kimyoviy: NH₃ ni ammoniy sulfat/nitrat eritmasi bilan aralashtirib olinadi. Ag⁺ nisbatan yumshoq kislota (HSAB), NH₃ o'rtacha yumshoq asos — barqaror bog'lanish. sp gibridlanish tufayli 180° chiziqli.",
    history: "1882: B. Tollens (Göttingen) aldegdlarni aniqlash uchun kashf etgan — 'kumush oyna reaksiyasi'. 1893: A. Werner koordinatsion nazariyada asosiy chiziqli namuna sifatida keltirgan. 1980: EXAFS ma'lumotlari Ag–N = 2.13 Å ni tasdiqladi.",
    applications: [
      "Aldegd sinovi (kumush oyna reaksiyasi): RCHO + 2[Ag(NH₃)₂]⁺ → 2Ag⁰↓ + RCOO⁻",
      "Fotokimyo sanoati — nozik kumush plyonkalar",
      "Bakteriotsid — tibbiy antiseptik (silver-based)",
      "Analitik kimyo — halid ionlarini aniqlash"
    ],
    spectroscopy: {
      uvVis: "d–d o'tish yo'q (d¹⁰). LMCT: λmax ≈ 220 nm (ε ≈ 8000 M⁻¹cm⁻¹, Ag←NH₃)",
      ir: "ν(Ag–N): 494 cm⁻¹ (kuchli), ν(N–H)sim: 3312 cm⁻¹, ν(N–H)asim: 3388 cm⁻¹, δ(HNH): 1620 cm⁻¹",
      raman: "νs(Ag–N₂): 370 cm⁻¹ (polyarizatsiyalangan)",
      nmr: "¹⁰⁷Ag: δ ≈ 340 ppm (AgNO₃ ga nisbatan), ¹H(NH₃): 2.1 ppm, ¹⁴N: −380 ppm",
      xray: "Space group: P2₁/c, Ag–N = 2.13(1) Å, ∠N–Ag–N = 179.7(3)°"
    },
    thermodynamics: {
      logK1: "3.24 (Ag⁺ + NH₃ ⇌ [Ag(NH₃)]⁺)",
      logK2: "3.81 ([Ag(NH₃)]⁺ + NH₃ ⇌ [Ag(NH₃)₂]⁺)",
      logBeta2: "7.05 (jami barqarorlik konstantasi)",
      deltaH: "−50.8 kJ/mol (ekzotermik)",
      deltaS: "−63 J/(mol·K)",
      deltaG: "−32 kJ/mol (298 K da barqaror)"
    },
    reactivity: [
      "Aldegidlar bilan: RCHO + 2Ag(NH₃)₂⁺ + 3OH⁻ → RCOO⁻ + 2Ag⁰ + 4NH₃ + 2H₂O",
      "Kislotalar bilan buziladi: [Ag(NH₃)₂]⁺ + 2H⁺ → Ag⁺ + 2NH₄⁺",
      "Ligand almashinuvi: [Ag(NH₃)₂]⁺ + 2CN⁻ → [Ag(CN)₂]⁻ + 2NH₃ (logK yuqori)"
    ],
    coordNumber: 2
  },
  AuCl2: {
    id: "AuCl2",
    formula: "[AuCl₂]⁻",
    fullSalt: "K[AuCl₂]",
    name: "Kaliy dixloroaurat(I)",
    center: { element: "Au", color: CPK.Au, radius: 0.52, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38, label: "Cl⁻", classification: "σ-donor, π-donor (kuchsiz)" },
    bondLength: 2.30,
    bondLengthReal: "2.25 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp (relativistik d–s aralashuv)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Oq-sariq kristall (Cl⁻ ta'sirida qora Au ga aylanadi)",
    meltingPoint: "170 °C (parchalanadi)",
    dElectrons: 10,
    dConfig: "[Xe] 4f¹⁴ 5d¹⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — inert juft effekti (relativistik 6s²) tufayli barqaror",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 12000, delta2_cm: 28000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "d¹⁰ + relativistik 6s² inert juft effekti (Pyykkö) — Au uchun chiziqli geometriya afzal",
    description: "Oltin(I) dixlorid kompleksi — Au⁺ ning eng barqaror halid kompleksi. Relativistik effektlar tufayli 6s orbital keskin stabillanadi (energiya ~2 eV pastga tushadi) va inert juft hosil qiladi. Bu Au(I) ning +3 dan ustunligini va chiziqli geometriyani belgilaydi.",
    history: "1861: E. Frankland Au(I) komplekslarini o'rgangan. 1988: P. Pyykkö va J.-P. Desclaux relativistik kvant kimyoda Au ni asosiy namuna sifatida ko'rsatgan. 2004: Pyykkö-ning 'Relativity, gold, and topology' maqolasi (Chem. Rev.) — Au ning noodatiy xossalarini nazariy tushuntirgan.",
    applications: [
      "Oltin qazib olish — sianid protsessida oraliq bosqich",
      "Elektrokimyo — Au(I) elektrodlar sintezi",
      "Onkologiya — Au(I) NHC komplekslari (rak davolash tadqiqotlari)",
      "Kataliz — Au(I) organik reaksiyalarda"
    ],
    spectroscopy: {
      uvVis: "d–d o'tish yo'q. LMCT: λmax ≈ 240 nm (Au←Cl)",
      ir: "ν(Au–Cl)sim: 329 cm⁻¹ (Raman-faol), ν(Au–Cl)asim: 350 cm⁻¹ (IR-faol), δ(Cl–Au–Cl): 122 cm⁻¹",
      raman: "νs(Au–Cl₂): 329 cm⁻¹, δ(bend): 120 cm⁻¹",
      nmr: "¹⁹⁷Au: kvadrupolyar (I=3/2), keng chiziq ≈ 1200 ppm",
      xray: "Rhombohedral, Au–Cl = 2.25(2) Å, ∠Cl–Au–Cl = 180.0°"
    },
    thermodynamics: {
      logK1: "5.6", logK2: "3.7", logBeta2: "9.3",
      deltaH: "−48 kJ/mol", deltaS: "−45 J/(mol·K)", deltaG: "−35 kJ/mol"
    },
    reactivity: [
      "Disproporsatsiya: 3[AuCl₂]⁻ → [AuCl₄]⁻ + 2Au⁰ + 2Cl⁻ (nam sharoitda)",
      "Sianid bilan: [AuCl₂]⁻ + 2CN⁻ → [Au(CN)₂]⁻ + 2Cl⁻ (juda kuchli)",
      "Reduktorlar bilan: [AuCl₂]⁻ + e⁻ → Au⁰ + 2Cl⁻ (E° = +1.15 V)"
    ],
    coordNumber: 2
  },
  HgCN2: {
    id: "HgCN2",
    formula: "Hg(CN)₂",
    fullSalt: "Hg(CN)₂ (neytral molekula)",
    name: "Ditsianortut(II)",
    center: { element: "Hg", color: CPK.Hg, radius: 0.55, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.30, label: "CN⁻", classification: "kuchli σ-donor, π-akseptor (izoelektron CO ga)" },
    bondLength: 2.10,
    bondLengthReal: "2.03 Å",
    outerIon: null,
    hybridization: "sp (relativistik effektlar bilan)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz (oq kristall) — o'ta zaharli, LD50 = 33 mg/kg",
    meltingPoint: "320 °C (parchalanadi)",
    dElectrons: 10,
    dConfig: "[Xe] 4f¹⁴ 5d¹⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — Hg da relativistik 6s² eng kuchli (Z = 80)",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 15000, delta2_cm: 32000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "d¹⁰ + relativistik 6s² inert juft + CN⁻ ning kuchli σ-donor va π-akseptor xossalari",
    description: "Simob(II) sianid — koordinatsion kimyoning klassik namunasi. Neytral molekula (tashqi sfera yo'q). CN⁻ ligandning izoelektron CO ga o'xshashligi — kuchli σ-donor va π-akseptor. Werner 1893 yilda koordinatsion nazariyada asosiy misol sifatida keltirgan. O'ta zaharli — LD50 = 33 mg/kg (og'iz orqali).",
    history: "1893: A. Werner koordinatsion nazariyada asosiy namuna. 1940: R. G. Pearson HSAB nazariyasida Hg²⁺ ni yumshoq kislota, CN⁻ ni yumshoq asos sifatida — juda barqaror kompleks. 2004: P. Pyykkö — Hg(II) da relativistik 6s² eng kuchli inert juft (Z = 80).",
    applications: [
      "Analitik kimyo — Kjeldahl azot aniqlash metodi",
      "Xromatografiya — mercury-based reagentlar (tarixiy)",
      "Diagnostika — radioaktiv ²⁰³Hg izotop bilan tadqiqotlar (endi eskirgan)",
      "OGOHLANTIRISH: yuqori zaharlilik tufayli hozirda cheklangan"
    ],
    spectroscopy: {
      uvVis: "d–d o'tish yo'q. LMCT: λmax ≈ 260 nm (Hg←CN)",
      ir: "ν(C≡N): 2192 cm⁻¹ (koordinatsiya tufayli erkin CN⁻ dan yuqori: 2080 cm⁻¹), ν(Hg–C): 412 cm⁻¹",
      raman: "νs(Hg–C₂): 276 cm⁻¹, ν(C≡N): 2192 cm⁻¹",
      nmr: "¹⁹⁹Hg: 1½ spin, δ ≈ −1360 ppm (HgMe₂ ga nisbatan), ¹³C(CN): 148.7 ppm",
      xray: "Tetragonal I4₁/amd, Hg–C = 2.03(1) Å, C≡N = 1.16 Å, ∠C–Hg–C = 180.0°"
    },
    thermodynamics: {
      logK1: "17.0", logK2: "15.7", logBeta2: "32.7", logBeta4: "41.4",
      deltaH: "−250 kJ/mol", deltaS: "−100 J/(mol·K)", deltaG: "−220 kJ/mol"
    },
    reactivity: [
      "Kuchli asos bilan: Hg(CN)₂ + 2OH⁻ → HgO + 2HCN (nam sharoit)",
      "Sulfid bilan: Hg(CN)₂ + S²⁻ → HgS↓ + 2CN⁻ (Kjeldahl metodi)",
      "Qo'shimcha CN⁻ bilan: Hg(CN)₂ + 2CN⁻ → [Hg(CN)₄]²⁻ (koord. son 4 ga o'sadi)",
      "OGOHLANTIRISH: kislota bilan HCN (o'ta zaharli gaz) chiqadi!"
    ],
    coordNumber: 2
  },
  CuCl2: {
    id: "CuCl2",
    formula: "[CuCl₂]⁻",
    fullSalt: "Na[CuCl₂]",
    name: "Natriy dixlorokuprat(I)",
    center: { element: "Cu", color: CPK.Cu, radius: 0.48, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38, label: "Cl⁻", classification: "σ-donor, π-donor" },
    bondLength: 2.15,
    bondLengthReal: "2.11 Å",
    outerIon: { element: "Na", color: CPK.Na, radius: 0.38, charge: "+1", count: 1 },
    hybridization: "sp",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz — havoda tez Cu(II) ga oksidlanadi (moviy)",
    meltingPoint: "430 °C",
    dElectrons: 10,
    dConfig: "[Ar] 3d¹⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — 3d birinchi qatordagi eng oddiy chiziqli namuna",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 6500, delta2_cm: 18000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "d¹⁰ + sp gibridlanish — birinchi qator, relativistik effekt kuchsiz",
    description: "Mis(I) dixlorid — Cu(I) ning eng oddiy chiziqli halid kompleksi. Havoda tez Cu(II) ga oksidlanadi. Sanoatda: Cu(II) + Cu⁰ → 2Cu(I) — komproporsatsiya. Cu⁺ HSAB da chegaraviy yumshoq kislota, Cl⁻ chegaraviy yumshoq asos.",
    history: "1852: R. Bunsen Cu(I) halidlarni tavsiflagan. 1913: A. Werner koordinatsion nazariyada namuna. 1950-lar: X-ray tadqiqotlari — Cu–Cl = 2.11 Å ni tasdiqladi.",
    applications: [
      "Sandmeyer reaksiyasi — organik sinteda (aril halogenidlar)",
      "Ceptone qo'shimchasi — polimer stabilizatori",
      "Reduktor sifatida analitik kimyoda"
    ],
    spectroscopy: {
      uvVis: "d–d o'tish yo'q. LMCT: λmax ≈ 230 nm",
      ir: "ν(Cu–Cl): 405 cm⁻¹, δ(Cl–Cu–Cl): 108 cm⁻¹",
      raman: "νs(Cu–Cl₂): 300 cm⁻¹",
      nmr: "⁶³Cu: kvadrupolyar, keng chiziq ≈ 0 ppm",
      xray: "Cu–Cl = 2.11(1) Å, ∠Cl–Cu–Cl = 180°"
    },
    thermodynamics: {
      logK1: "2.7", logK2: "1.6", logBeta2: "4.3",
      deltaH: "−32 kJ/mol", deltaS: "−28 J/(mol·K)", deltaG: "−18 kJ/mol"
    },
    reactivity: [
      "Havoda oksidlanish: 4[CuCl₂]⁻ + O₂ + 4H⁺ → 4Cu²⁺ + 8Cl⁻ + 2H₂O",
      "Disproporsatsiya: 2Cu⁺ ⇌ Cu²⁺ + Cu⁰ (suvda Cl⁻ yo'q bo'lsa)",
      "Ammiak bilan: [CuCl₂]⁻ + 2NH₃ → [Cu(NH₃)₂]⁺ + 2Cl⁻"
    ],
    coordNumber: 2
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CHIZIQLI 3D GEOMETRIYANI QURISH (D∞h — 180°)
// ═══════════════════════════════════════════════════════════════════════════
function buildLinearGeometry(molGroup, complexData, refs, state) {
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

  // Chiziqli 2 ta ligand (Z o'qi bo'ylab +d va -d)
  const d = complexData.bondLength
  const ligandDirs = [
    new THREE.Vector3(0, 0, d),
    new THREE.Vector3(0, 0, -d)
  ]

  ligandDirs.forEach((dir) => {
    const lPos = dir.clone()

    // Bog'
    const bond = createBond(centerPos, lPos, 0.065, CPK.bond)
    molGroup.add(bond)
    if (bondsRef?.current) bondsRef.current.push(bond)

    // Ligand
    let ligandGroup
    if (complexData.ligand.type === "Cl") {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
    } else if (complexData.ligand.type === "CN") {
      ligandGroup = createCNLigand(lPos, centerPos, refs, state.scale)
    } else if (complexData.ligand.type === "NH3") {
      ligandGroup = createNH3Ligand(lPos, centerPos, refs, state.scale)
    } else {
      ligandGroup = createClLigand(lPos, centerPos, refs, state.scale, complexData.ligand.donorColor)
    }
    molGroup.add(ligandGroup)

    // Masofa yorlig'i
    const midPoint = new THREE.Vector3().addVectors(centerPos, lPos).multiplyScalar(0.5)
    const bondLabel = makeTextSprite(complexData.bondLengthReal || `${d.toFixed(2)} Å`, {
      color: "#fef08a",
      bgColor: "rgba(20, 10, 35, 0.85)",
      borderColor: "#eab308",
      scale: 0.22
    })
    bondLabel.position.copy(midPoint).add(new THREE.Vector3(0, 0.15, 0))
    bondLabel.visible = state.showDistance
    molGroup.add(bondLabel)
    if (bondLabelsRef?.current) bondLabelsRef.current.push(bondLabel)
  })

  // Tashqi sfera
  if (complexData.outerIon) {
    createOuterSphereIons(molGroup, complexData.outerIon, d * 1.6, refs, state.scale)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function ChiziqliPage() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      defaultComplexKey="AgNH3"
      buildGeometry={buildLinearGeometry}
    />
  )
}
