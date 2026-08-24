"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 📏 CHIZIQLI (LINEAR) GEOMETRIYA — 3D LABORATORIYA PRO
// Manzil: /oquv/fazoviy/chiziqli/3d (SEO indeksatsiyasi saqlangan)
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
  id: "chiziqli",
  name: "Chiziqli (Linear)",
  icon: "📏",
  angle: "180.0°",
  ks: 2,
  hybridization: "sp / d–s (relativistik)",
  symmetry: "D∞h",
  description: "2-koordinatsion chiziqli komplekslar (L–M–L = 180°). Odatda Cu(I), Ag(I), Au(I), Hg(II) kabi d¹⁰ ionlarida sp-gibridlanish va relativistik 6s² inert juft effekti tufayli hosil bo'ladi.",
  backUrl: "/oquv/fazoviy/chiziqli",
  dOrbitalSplitting: {
    theory: "D∞h chiziqli ligand maydonida (z o'qi bo'ylab) d-orbitallar ajralishi:",
    levels: [
      { name: "σg* (dz²)", energy: "+1.03 Δₗᵢₙ", desc: "Eng yuqori (ligandlar bilan to'g'ridan-to'g'ri σ-itarilish)", color: "text-yellow-300" },
      { name: "πg (dxz, dyz)", energy: "-0.11 Δₗᵢₙ", desc: "O'rta sath (π-o'zaro ta'sir)", color: "text-emerald-300" },
      { name: "δg (dx²-y², dxy)", energy: "-0.40 Δₗᵢₙ", desc: "Eng past sath (ligandlardan xoli xy tekisligi)", color: "text-cyan-300" }
    ],
    parameters: [
      { label: "Δ₁ (δg → πg)", key: "delta1_cm", getValue: (c) => `${(c.dOrbital?.delta1_cm || 8000).toLocaleString()} cm⁻¹` },
      { label: "Δ₂ (πg → σg*)", key: "delta2_cm", getValue: (c) => `${(c.dOrbital?.delta2_cm || 22000).toLocaleString()} cm⁻¹` }
    ],
    pairingEnergy: "≈ 20 000 cm⁻¹",
    note: "d¹⁰ konfiguratsiyasida barcha (δg)⁴(πg)⁴(σg*)² orbitallar to'liq to'lgan (CFSE = 0, diamagnit)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KOMPLEKSLAR BAZASI (D∞h — 2-koordinatsiya)
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
      logBeta2: "9.2 (suvli eritmada)",
      deltaH: "−65 kJ/mol",
      deltaS: "−45 J/(mol·K)",
      deltaG: "−52 kJ/mol"
    },
    reactivity: [
      "Disproporsiyalanish: 3[AuCl₂]⁻ ⇌ [AuCl₄]⁻ + 2Au⁰ + 2Cl⁻ (E° = +0.15 V)",
      "Ligand almashinuvi: [AuCl₂]⁻ + 2CN⁻ → [Au(CN)₂]⁻ + 2Cl⁻ (juda tez)",
      "Oksidlovchi birikish: [AuCl₂]⁻ + Cl₂ → [AuCl₄]⁻ (Au(I) → Au(III))"
    ],
    coordNumber: 2
  },
  HgCN2: {
    id: "HgCN2",
    formula: "Hg(CN)₂",
    fullSalt: "Hg(CN)₂ (molekulyar simob sianid)",
    name: "Simob(II) disianid",
    center: { element: "Hg", color: CPK.Hg, radius: 0.55, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.30, label: "CN⁻", classification: "kuchli maydon, σ-donor, π-akseptor" },
    bondLength: 2.10,
    bondLengthReal: "2.03 Å",
    outerIon: null,
    hybridization: "sp (chiziqli molekulyar)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Oq kristall (suvda oz eriydi, noionik)",
    meltingPoint: "190 °C (sublimatsiyalanadi)",
    dElectrons: 10,
    dConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — kovalent molekulyar kristall, ionlanmaydi",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 9500, delta2_cm: 25000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "Hg–C kuchli kovalent bog'i + d¹⁰ qobiq + sp gibridlanish",
    description: "Simob(II) sianid — g'ayrioddiy molekulyar kompleks. Boshqa sianidlardan farqli ravishda suvda deyarli ionlarga ajralmaydi (kuchsiz elektrolit, Kd ≈ 10⁻⁴⁰). Toksikligi juda yuqori — Hg²⁺ va CN⁻ birgalikda ta'sir qiladi.",
    history: "1782: C. W. Scheele kashf etgan. 1828: F. Wöhler mochevina sintezida Hg(CN)₂ ni xomashyo qilgan. 1955: Frasson rentgenostruktura tahlilida C–Hg–C = 179(1)° ekanini isbotlagan.",
    applications: [
      "Sianlash reaksiyalari — organik sintezda",
      "Eski farmatsevtika — antiseptik sifatida (tarixiy)",
      "Toksikologik tadqiqotlar — og'ir metall toksikligi standarti",
      "Koordinatsion polimerlar sintezi (ko'prik CN orqali)"
    ],
    spectroscopy: {
      uvVis: "λmax ≈ 210 nm (π→π* CN⁻)",
      ir: "ν(C≡N): 2192 cm⁻¹ (koordinatsiya tufayli erkin CN⁻ dan yuqori: 2080 cm⁻¹), ν(Hg–C): 412 cm⁻¹",
      raman: "νs(Hg–C₂): 276 cm⁻¹, ν(C≡N): 2192 cm⁻¹",
      nmr: "¹⁹⁹Hg: δ ≈ −1350 ppm (Me₂Hg ga nisbatan, I=1/2), ¹³C: 138 ppm",
      xray: "Tetragonal, I4₁/a, Hg–C = 2.03(1) Å, C≡N = 1.15(1) Å, ∠C–Hg–C = 180°"
    },
    thermodynamics: {
      logBeta2: "34.7 (Hg²⁺ + 2CN⁻ ⇌ Hg(CN)₂, juda yuqori!)",
      deltaH: "−185 kJ/mol",
      deltaS: "−80 J/(mol·K)",
      deltaG: "−161 kJ/mol (o'ta barqaror)"
    },
    reactivity: [
      "H₂S bilan: Hg(CN)₂ + H₂S → HgS↓ (qora) + 2HCN↑ (o'ta xavfli!)",
      "Kislotalar ta'siri: noionik bo'lgani uchun suyultirilgan kislotalar bilan sekin reaksiyaga kirishadi",
      "Sianid ioni bilan: Hg(CN)₂ + 2CN⁻ → [Hg(CN)₄]²⁻ (tetraedrik kompleksga o'tadi)"
    ],
    coordNumber: 2
  },
  CuCl2: {
    id: "CuCl2",
    formula: "[CuCl₂]⁻",
    fullSalt: "K[CuCl₂] (mis(I) dixlorid)",
    name: "Kaliy dixlorokuprat(I)",
    center: { element: "Cu", color: CPK.Cu, radius: 0.48, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.38, label: "Cl⁻", classification: "σ-donor, π-donor" },
    bondLength: 2.15,
    bondLengthReal: "2.11 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 1 },
    hybridization: "sp (linear)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz (eritma) / oq kristall (havoda yashil Cu(II) ga oksidlanadi)",
    meltingPoint: "120 °C (oksidlanadi)",
    dElectrons: 10,
    dConfig: "[Ar] 3d¹⁰ 4s⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — Cu(I) d¹⁰, sp gibridlanish",
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 6500, delta2_cm: 18000 },
    valenceElectrons: 14,
    is18eRule: false,
    cfse: 0,
    stabilitySource: "d¹⁰ to'liq to'ldirilgan qobiq + sp gibridlanish",
    description: "Mis(I) dixlorid — CuCl ning konsentrlangan HCl dagi eruvchan formasi. Havoda tezda Cu²⁺ ga oksidlanadi (yashil rang hosil bo'ladi). Sandmeyer va Gattermann reaksiyalarida muhim oraliq mahsulot.",
    history: "1884: T. Sandmeyer Cu(I) tuzlari ishtirokida diazobirikmalardan galogenoarenlar sintezini kashf etgan. 1978: Andersson kristalldan chiziqli Cu–Cl = 2.11 Å ni aniqlagan.",
    applications: [
      "Sandmeyer reaksiyasi: ArN₂⁺ + [CuCl₂]⁻ → ArCl + N₂↑ + CuCl",
      "Kataliz — olefinlar polimerizatsiyasida",
      "Organik sintez — CO ni bog'lash (absorbsiya)",
      "Galvanika — mis yotqizish vannalari"
    ],
    spectroscopy: {
      uvVis: "d–d o'tish yo'q. LMCT: λmax ≈ 275 nm (Cu←Cl)",
      ir: "ν(Cu–Cl): 405 cm⁻¹, δ(Cl–Cu–Cl): 108 cm⁻¹",
      raman: "νs(Cu–Cl₂): 300 cm⁻¹",
      nmr: "⁶³Cu: kvadrupolyar (I=3/2), keng rezonans",
      xray: "Orthorhombic, Pnma, Cu–Cl = 2.11(1) Å, ∠Cl–Cu–Cl = 180.0°"
    },
    thermodynamics: {
      logBeta2: "5.5 (Cu⁺ + 2Cl⁻ ⇌ [CuCl₂]⁻)",
      deltaH: "−38 kJ/mol",
      deltaS: "−25 J/(mol·K)",
      deltaG: "−31 kJ/mol"
    },
    reactivity: [
      "Oksidlanish: 4[CuCl₂]⁻ + O₂ + 4H⁺ → 4Cu²⁺ + 8Cl⁻ + 2H₂O (tez)",
      "Suv bilan suyultirish: [CuCl₂]⁻ ⇌ CuCl↓ (oq) + Cl⁻ (eruvchanlik kamayadi)",
      "Sianid bilan: [CuCl₂]⁻ + 2CN⁻ → [Cu(CN)₂]⁻ + 2Cl⁻ (juda barqaror)"
    ],
    coordNumber: 2
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CHIZIQLI 3D GEOMETRIYANI QURISH
// ═══════════════════════════════════════════════════════════════════════════
function buildLinearGeometry(molGroup, complexData, refs, state) {
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

  // 2 ta chiziqli koordinata: +x va -x (L-M-L = 180°)
  const d = complexData.bondLength || 2.2
  const ligandPositions = [
    [d, 0, 0],
    [-d, 0, 0]
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
      // Oddiy monoatomik ligand (Cl⁻ va h.k.)
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

      const ligLabel = makeTextSprite(complexData.ligand?.label || complexData.ligand?.donor || "L", {
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
export default function Chiziqli3DSahifa() {
  return (
    <FazoviyKoruvchi
      geometryInfo={GEOMETRY_INFO}
      complexes={COMPLEXES}
      buildGeometry={buildLinearGeometry}
      defaultComplex="AgNH3"
    />
  )
}
