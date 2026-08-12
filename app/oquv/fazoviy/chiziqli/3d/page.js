"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari — Corey-Pauling-Koltun)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Ag: 0xC0C0C0, Au: 0xFFD700, Hg: 0xB87333, Cu: 0xC88033,
  N:  0x3050F8, C: 0x909090, Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094,
  H:  0xFFFFFF, K: 0x8F40D4, Na: 0xAB5CF2, O: 0xFF0D0D,
  S:  0xFFFF30, P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  sigma: 0xEF4444, pi: 0xF97316, delta: 0x06B6D4
}

// ═══════════════════════════════════════════════════════════════════════════
// KIMYOVIY PARAMETRLAR (haqiqiy X-ray/EXAFS ma'lumotlari, scaled)
// ═══════════════════════════════════════════════════════════════════════════
const CHEM = {
  agN_length: 2.20, agN_real: 2.13,   // Ag-N (Å) — X-ray
  auCl_length: 2.30, auCl_real: 2.25, // Au-Cl (Å) — EXAFS
  hgC_length: 2.10, hgC_real: 2.03,   // Hg-C (Å) — X-ray
  cuCl_length: 2.15, cuCl_real: 2.11, // Cu-Cl (Å)
  cn_length: 1.16, ch_length: 1.09,
  nH_length: 0.60, nH_real: 1.01,
  hnh_angle: 107 * Math.PI / 180,
  ag_radius: 0.50, au_radius: 0.52, hg_radius: 0.55, cu_radius: 0.48,
  n_radius: 0.35, c_radius: 0.30, cl_radius: 0.38, br_radius: 0.42, i_radius: 0.48,
  h_radius: 0.18, k_radius: 0.40, na_radius: 0.38
}

// ═══════════════════════════════════════════════════════════════════════════
// CHIZIQLI KOMPLEKSLAR DATABASE (D∞h — 2-koordinatsiya)
// ═══════════════════════════════════════════════════════════════════════════
//
// Chiziqli 2-koordinatsion komplekslar odatda d¹⁰ konfiguratsiyasida uchraydi:
//   Cu(I), Ag(I), Au(I), Hg(II), Cd(II), Zn(II) — nd¹⁰ (n+1)s⁰
//
// Chiziqli geometriya sabablari:
//   1. sp-gibridlanish (LCAO — Linnett, 1961)
//   2. Relativistik inert 6s² jufti (Pyykkö, 1988) — Au, Hg uchun asosiy
//   3. d–s aralashuv (Orgel, 1958)
//   4. VSEPR — AX₂E₀ (sp) yoki AX₂E₂ (chiziqli)
//
// Kristall maydon nazariyasi (D∞h):
//   z o'q — L-M-L o'qi bo'ylab
//   Ligandlar dz² bilan σ-antibog' hosil qiladi → dz² (a₁g/σg*) yuqoriga chiqadi
//   dxz, dyz (πg) — bog'lanmagan
//   dxy, dx²-y² (δg) — eng past (barotsentrga yaqin)
//
//   d-orbital energiya tartibi:
//     δg (dx²-y², dxy) < πg (dxz, dyz) << σg* (dz²)
//
//   d¹⁰: (δg)⁴ (πg)⁴ (σg*)² — barcha 5 orbital to'liq to'ldirilgan
//   CFSE = 0, diamagnit (S = 0), Werner-Bethe qaydlariga muvofiq
//
// Ballhausen (1962), Cotton (1990), Housecroft-Sharpe (2018) manbalariga asoslangan.
// ═══════════════════════════════════════════════════════════════════════════

const COMPLEXES = {
  AgNH3: {
    id: "AgNH3",
    formula: "[Ag(NH₃)₂]⁺",
    fullSalt: "[Ag(NH₃)₂]Cl (Tollens reagenti)",
    name: "Diamminkumush(I) xlorid",
    center: { element: "Ag", color: CPK.Ag, radius: CHEM.ag_radius, charge: "+1" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: CHEM.n_radius, label: "NH₃", classification: "σ-donor, kuchsiz π-donor" },
    bondLength: CHEM.agN_length, bondLengthReal: "2.13 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: CHEM.cl_radius, charge: "-1", count: 1 },
    hybridization: "sp (linear)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz (aq. eritma) / oq kristall",
    meltingPoint: "150 °C (parchalanadi)",
    dElectrons: 10, dConfig: "[Kr] 4d¹⁰",
    geometry: "Chiziqli (Linear)",
    symmetry: "D∞h",
    pointGroup: "D∞h — infinite rotation axis + horizontal plane + inversion",
    // D∞h da d-orbital ajralishi (ligand z o'qi bo'ylab):
    //   δg (dx²-y², dxy) — eng past (2 orbital, 4 e-)
    //   πg (dxz, dyz)     — o'rta (2 orbital, 4 e-)
    //   σg* (dz²)         — eng yuqori (1 orbital, 2 e-)
    dOrbital: { delta_g: 4, pi_g: 4, sigma_g_star: 2, type: "d10", delta1_cm: 8000, delta2_cm: 22000 },
    valenceElectrons: 14, // Ag⁺(d¹⁰) + 2×NH₃(2e⁻) = 14 e⁻
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
    ]
  },
  AuCl2: {
    id: "AuCl2",
    formula: "[AuCl₂]⁻",
    fullSalt: "K[AuCl₂]",
    name: "Kaliy dixloroaurat(I)",
    center: { element: "Au", color: CPK.Au, radius: CHEM.au_radius, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: CHEM.cl_radius, label: "Cl⁻", classification: "σ-donor, π-donor (kuchsiz)" },
    bondLength: CHEM.auCl_length, bondLengthReal: "2.25 Å",
    outerIon: { element: "K", color: CPK.K, radius: CHEM.k_radius, charge: "+1", count: 1 },
    hybridization: "sp (relativistik d–s aralashuv)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Oq-sariq kristall (Cl⁻ ta'sirida qora Au ga aylanadi)",
    meltingPoint: "170 °C (parchalanadi)",
    dElectrons: 10, dConfig: "[Xe] 4f¹⁴ 5d¹⁰",
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
    ]
  },
  HgCN2: {
    id: "HgCN2",
    formula: "Hg(CN)₂",
    fullSalt: "Hg(CN)₂ (neytral molekula)",
    name: "Ditsianortut(II)",
    center: { element: "Hg", color: CPK.Hg, radius: CHEM.hg_radius, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: CHEM.c_radius, label: "CN⁻", classification: "kuchli σ-donor, π-akseptor (izoelektron CO ga)" },
    bondLength: CHEM.hgC_length, bondLengthReal: "2.03 Å",
    outerIon: null,
    hybridization: "sp (relativistik effektlar bilan)",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz (oq kristall) — o'ta zaharli, LD50 = 33 mg/kg",
    meltingPoint: "320 °C (parchalanadi)",
    dElectrons: 10, dConfig: "[Xe] 4f¹⁴ 5d¹⁰",
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
    ]
  },
  CuCl2: {
    id: "CuCl2",
    formula: "[CuCl₂]⁻",
    fullSalt: "Na[CuCl₂]",
    name: "Natriy dixlorokuprat(I)",
    center: { element: "Cu", color: CPK.Cu, radius: CHEM.cu_radius, charge: "+1" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: CHEM.cl_radius, label: "Cl⁻", classification: "σ-donor, π-donor" },
    bondLength: CHEM.cuCl_length, bondLengthReal: "2.11 Å",
    outerIon: { element: "Na", color: CPK.Na, radius: CHEM.na_radius, charge: "+1", count: 1 },
    hybridization: "sp",
    magnetism: "Diamagnit",
    magneticMoment: "μ = 0 μB (S = 0)",
    color: "Rangsiz — havoda tez Cu(II) ga oksidlanadi (moviy)",
    meltingPoint: "430 °C",
    dElectrons: 10, dConfig: "[Ar] 3d¹⁰",
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
      "Havoda oksidlanish: 4[CuCl₂]⁻ + O₂ + 8H⁺ → 4Cu²⁺ + 8Cl⁻ + 2H₂O",
      "Disproporsatsiya: 2[CuCl₂]⁻ → Cu⁰ + [CuCl₄]²⁻ (suvda)",
      "NH₃ bilan: [CuCl₂]⁻ + 2NH₃ → [Cu(NH₃)₂]⁺ + 2Cl⁻"
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI (kengaytirilgan — 12 ta parametr)
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Ag: { name: "Kumush (Ag)", atomic: 47, mass: "107.868 u", config: "[Kr] 4d¹⁰ 5s¹", oxidation: "+1 (asosiy), +2, +3 (kam)", role: "Markaziy ion — d¹⁰ konfiguratsiya", hybridization: "sp", color: "#C0C0C0", electronegativity: "1.93 (Pauling)", radius_atomic: "144 pm", radius_ionic: "115 pm (Ag⁺)", firstIE: "731 kJ/mol", meltingPoint: "961.8 °C" },
  Au: { name: "Oltin (Au)", atomic: 79, mass: "196.967 u", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", oxidation: "+1, +3 (barqaror), +5", role: "Markaziy ion — relativistik d¹⁰ 6s¹", hybridization: "sp (5d/6s)", color: "#FFD700", electronegativity: "2.54 (eng elektronmanfiy metall)", radius_atomic: "144 pm", radius_ionic: "137 pm (Au⁺)", firstIE: "890 kJ/mol", meltingPoint: "1064 °C" },
  Hg: { name: "Simob (Hg)", atomic: 80, mass: "200.592 u", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", oxidation: "+1 (Hg₂²⁺), +2", role: "Markaziy ion — relativistik inert 6s²", hybridization: "sp", color: "#B87333", electronegativity: "2.00", radius_atomic: "151 pm", radius_ionic: "119 pm (Hg²⁺)", firstIE: "1007 kJ/mol", meltingPoint: "−38.83 °C (yagona suyuq metall)" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.546 u", config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+1, +2 (asosiy)", role: "Markaziy ion — 3d¹⁰", hybridization: "sp", color: "#C88033", electronegativity: "1.90", radius_atomic: "128 pm", radius_ionic: "77 pm (Cu⁺)", firstIE: "745 kJ/mol", meltingPoint: "1085 °C" },
  N: { name: "Azot (N)", atomic: 7, mass: "14.007 u", config: "[He] 2s² 2p³", oxidation: "−3 to +5", role: "NH₃ donor atomi (yagona juft)", hybridization: "sp³ (NH₃)", color: "#3050F8", electronegativity: "3.04 (Pauling)", radius_atomic: "56 pm", radius_covalent: "71 pm", firstIE: "1402 kJ/mol", meltingPoint: "−210 °C" },
  C: { name: "Uglerod (C)", atomic: 6, mass: "12.011 u", config: "[He] 2s² 2p²", oxidation: "−4 to +4", role: "CN⁻ donor atomi (izoelektron CO)", hybridization: "sp (CN⁻)", color: "#909090", electronegativity: "2.55", radius_atomic: "67 pm", radius_covalent: "76 pm", firstIE: "1086 kJ/mol", meltingPoint: "3550 °C (grafit)" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.453 u", config: "[Ne] 3s² 3p⁶", oxidation: "−1 (asosiy), +1 to +7", role: "Ligand / tashqi sfera anion", hybridization: "sp³", color: "#1FF01F", electronegativity: "3.16", radius_atomic: "99 pm", radius_ionic: "181 pm (Cl⁻)", firstIE: "1251 kJ/mol", meltingPoint: "−101.5 °C" },
  H: { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", oxidation: "−1, +1", role: "NH₃ tarkibi", hybridization: "s", color: "#FFFFFF", electronegativity: "2.20", radius_atomic: "53 pm", radius_covalent: "31 pm", firstIE: "1312 kJ/mol", meltingPoint: "−259.14 °C" },
  K: { name: "Kaliy (K⁺)", atomic: 19, mass: "39.098 u", config: "[Ar]", oxidation: "+1", role: "Tashqi sfera kation", hybridization: "—", color: "#8F40D4", electronegativity: "0.82", radius_atomic: "227 pm", radius_ionic: "138 pm (K⁺)", firstIE: "419 kJ/mol", meltingPoint: "63.5 °C" },
  Na: { name: "Natriy (Na⁺)", atomic: 11, mass: "22.990 u", config: "[Ne]", oxidation: "+1", role: "Tashqi sfera kation", hybridization: "—", color: "#AB5CF2", electronegativity: "0.93", radius_atomic: "186 pm", radius_ionic: "102 pm (Na⁺)", firstIE: "496 kJ/mol", meltingPoint: "97.7 °C" },
  O: { name: "Kislorod (O)", atomic: 8, mass: "15.999 u", config: "[He] 2s² 2p⁴", oxidation: "−2 (asosiy), −1, +1, +2", role: "H₂O donor", hybridization: "sp³ (H₂O)", color: "#FF0D0D", electronegativity: "3.44", radius_atomic: "48 pm", radius_covalent: "66 pm", firstIE: "1314 kJ/mol", meltingPoint: "−218.8 °C" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI: matn tozalash (PDF va JSX uchun)
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (str === null || str === undefined) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ").trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE (canvas asosida — yorliqlar uchun)
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const { fontSize = 64, fontFamily = "Arial, sans-serif", color = "#ffffff",
          bgColor = "rgba(20,10,40,0.85)", borderColor = "#a78bfa",
          padding = 16, scale = 0.5 } = options
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture, transparent: true,
    depthTest: false, depthWrite: false
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ENSEMBLE POZITSIYALARI (1, 8, 27 molekula uchun — kristall/eritma)
// ═══════════════════════════════════════════════════════════════════════════
function getEnsemblePositions(count, mode) {
  const positions = []
  if (count === 1) {
    positions.push(new THREE.Vector3(0, 0, 0))
    return positions
  }
  if (mode === "crystal") {
    const n = count === 8 ? 2 : 3
    const spacing = 7
    const offset = (n - 1) * spacing / 2
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          positions.push(new THREE.Vector3(
            i * spacing - offset,
            j * spacing - offset,
            k * spacing - offset
          ))
        }
      }
    }
  } else {
    // Eritma — Fibonacci sferik taqsimot
    const radius = count === 8 ? 6 : 9
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = radius * (0.6 + ((i * 9301 + 49297) % 233280) / 233280 * 0.4)
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }
  }
  return positions
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════
function SectionHeader({ label, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${isOpen ? "bg-purple-700/60 text-white" : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"}`}
    >
      <span>{label}</span>
      <span className="text-purple-400">{isOpen ? "▾" : "▸"}</span>
    </button>
  )
}

function ToggleRow({ label, value, onChange, hint }) {
  return (
    <label className="flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-purple-800/30 transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-purple-200 block truncate">{label}</span>
        {hint && <span className="text-[9px] text-purple-500 block truncate">{hint}</span>}
      </div>
      <button
        onClick={(e) => { e.preventDefault(); onChange(!value) }}
        className={`relative w-8 h-4 rounded-full transition-all flex-shrink-0 ml-2 ${value ? "bg-purple-500" : "bg-purple-900"}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? "left-4" : "left-0.5"}`} />
      </button>
    </label>
  )
}

function InfoRow({ label, value, mono, small }) {
  return (
    <div className="bg-purple-900/40 rounded-lg p-2">
      <p className="text-purple-400 text-[10px] mb-0.5">{label}</p>
      <p className={`text-white ${mono ? "font-mono" : ""} ${small ? "text-[11px]" : "text-xs"} break-words`}>{value}</p>
    </div>
  )
}

function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-purple-400 mb-0.5">{label}</div>
      <div className={`text-sm sm:text-base font-bold text-white ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full shadow-md flex-shrink-0" style={{ backgroundColor: color }}></div>
      <span className="text-[11px] text-purple-300">{label}</span>
    </div>
  )
}
// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT — CHIZIQLI 3D LABORATORIYA PRO
// ═══════════════════════════════════════════════════════════════════════════
export default function Chiziqli3DPro() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const atomsRef = useRef([])
  const labelsRef = useRef([])
  const bondLabelsRef = useRef([])
  const bondsRef = useRef([])
  const outerSphereRef = useRef([])
  const clipPlaneRef = useRef(null)
  const ligandAtomsRef = useRef([])
  const solventMoleculesRef = useRef([])
  const hBondsRef = useRef([])
  const moleculeGroupsRef = useRef([])
  const ligandGroupsRef = useRef([])
  const symmetryHelpersRef = useRef([])
  const distanceLineRef = useRef(null)
  const angleArcsRef = useRef([])
  const animationStateRef = useRef({
    exchangeProgress: 0,
    originalPositions: new Map()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════════════════════
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentComplex, setCurrentComplex] = useState("AgNH3")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick")
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)
  const [activePanel, setActivePanel] = useState(null)
  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal")
  const [showLigandExchange, setShowLigandExchange] = useState(false)
  const [exchangeTarget, setExchangeTarget] = useState("H2O")
  const [isExchangePlaying, setIsExchangePlaying] = useState(false)
  const [exchangeProgress, setExchangeProgress] = useState(0)
  const [showSolvation, setShowSolvation] = useState(false)
  const [solventType, setSolventType] = useState("water")
  const [solvationDensity, setSolvationDensity] = useState(15)
  const [showHydrogenBonds, setShowHydrogenBonds] = useState(false)
  const [showTemperature, setShowTemperature] = useState(false)
  const [temperature, setTemperature] = useState(298)
  const [showPressure, setShowPressure] = useState(false)
  const [pressure, setPressure] = useState(1)
  const [showPH, setShowPH] = useState(false)
  const [phLevel, setPHLevel] = useState(7)
  const [showSpectroscopy, setShowSpectroscopy] = useState(false)
  const [spectrumType, setSpectrumType] = useState("uv-vis")
  const [showCrystalField, setShowCrystalField] = useState(false)
  const [ligandFieldStrength, setLigandFieldStrength] = useState("medium")
  const [showRedox, setShowRedox] = useState(false)
  const [oxidationState, setOxidationState] = useState(1)
  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("Cinf")
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedForDistance, setSelectedForDistance] = useState([])
  const [measuredDistance, setMeasuredDistance] = useState(null)
  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch")
  const [showAllAngles, setShowAllAngles] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [citationFormat, setCitationFormat] = useState("apa")
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)

  // ═══ MOBIL BOSHQARUV PANELI ═══
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  // Panel drag (faqat desktop)
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const [pdfSections, setPdfSections] = useState({
    snapshot: true, info: true, conditions: true, geometry: true,
    dorbital: true, mo: true, spectra: true, thermodynamics: true,
    crystalField: true, reactivity: true, applications: true, references: true
  })

  const complex = COMPLEXES[currentComplex]

  // Kompleks o'zgarganda oksidlanish darajasini yangilash
  useEffect(() => {
    const c = COMPLEXES[currentComplex]
    if (c && c.center && c.center.charge) {
      const ox = parseInt(String(c.center.charge).replace("+", ""), 10)
      if (!Number.isNaN(ox)) setOxidationState(ox)
    }
    if (!["Cinf", "sigma_h", "sigma_v", "inversion", "C2"].includes(symmetryElement)) {
      setSymmetryElement("Cinf")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentComplex])

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBIL DETEKTSIYA
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // PANEL DRAG (faqat desktop)
  // ═══════════════════════════════════════════════════════════════════════════
  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (isMobile || !panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setIsPanelDragging(true)
  }, [isMobile])

  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = Math.max(0, Math.min(cRect.width - pW, clientX - cRect.left - dragOffsetRef.current.x))
    let ny = Math.max(0, Math.min(cRect.height - pH, clientY - cRect.top - dragOffsetRef.current.y))
    setPanelPos({ x: nx, y: ny })
  }, [])

  const handlePanelDragEnd = useCallback(() => setIsPanelDragging(false), [])

  useEffect(() => {
    if (!isPanelDragging) return
    const onMouseMove = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanelDragEnd()
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => handlePanelDragEnd()

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)

    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  // ═══════════════════════════════════════════════════════════════════════════
  // BOND YARATISH (silindr geometriya bilan)
  // ═══════════════════════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.08, opacity = 0.7) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.2,
      transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    )
    bond.userData = { type: "bond" }
    parent.add(bond)
    return bond
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // NH₃ LIGAND (sp³ azot + 3 H trigonal piramidal)
  // ═══════════════════════════════════════════════════════════════════════════
  const createNH3Ligand = useCallback((parent, nPos, centerPos) => {
    const group = new THREE.Group()
    group.userData = { type: "ligand", ligandType: "NH3", donorPos: nPos.clone() }

    // N atomi (donor)
    const nGeo = new THREE.SphereGeometry(CHEM.n_radius, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.05
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: "atom", element: "N", info: ATOM_INFO.N, isDonor: true }
    nMesh.castShadow = true
    group.add(nMesh)
    atomsRef.current.push(nMesh)
    ligandAtomsRef.current.push(nMesh)

    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.35 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(nLabel)
    labelsRef.current.push(nLabel)

    // sp³ tetrahedrik joylashuv: 3 H + 1 metal → N markazida
    const nToCenter = new THREE.Vector3().subVectors(centerPos, nPos).normalize()
    const outDir = nToCenter.clone().negate()
    let perp1 = new THREE.Vector3()
    if (Math.abs(nToCenter.y) < 0.9) {
      perp1.crossVectors(nToCenter, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(nToCenter, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const perp2 = new THREE.Vector3().crossVectors(nToCenter, perp1).normalize()

    // H-N-H = 107° (haqiqiy), sp³ tetraedr — 109.5° dan biroz kichik
    const hnhAngle = CHEM.hnh_angle
    const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(hnhAngle) + 0.5) / 1.5))

    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3) + Math.PI / 6
      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(alpha))
        .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
        .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
        .normalize()
      const hPos = new THREE.Vector3().copy(nPos).addScaledVector(hDir, CHEM.nH_length)

      const hGeo = new THREE.SphereGeometry(CHEM.h_radius, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H, roughness: 0.6, metalness: 0.05,
        emissive: 0xFFFFFF, emissiveIntensity: 0.02
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: "atom", element: "H", info: ATOM_INFO.H }
      group.add(hMesh)
      atomsRef.current.push(hMesh)

      const bond = createBond(group, nPos, hPos, 0xcccccc, 0.05)
      bond.userData = { type: "bond", bondType: "N–H", length: "1.01 Å" }
      bondsRef.current.push(bond)
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════════════════════
  // Cl⁻ LIGAND (yagona sfera)
  // ═══════════════════════════════════════════════════════════════════════════
  const createClLigand = useCallback((parent, clPos) => {
    const group = new THREE.Group()
    group.userData = { type: "ligand", ligandType: "Cl", donorPos: clPos.clone() }

    const clGeo = new THREE.SphereGeometry(CHEM.cl_radius, 48, 48)
    const clMat = new THREE.MeshStandardMaterial({
      color: CPK.Cl, roughness: 0.35, metalness: 0.15,
      emissive: CPK.Cl, emissiveIntensity: 0.08
    })
    const clMesh = new THREE.Mesh(clGeo, clMat)
    clMesh.position.copy(clPos)
    clMesh.userData = { type: "atom", element: "Cl", info: ATOM_INFO.Cl, isDonor: true }
    clMesh.castShadow = true
    group.add(clMesh)
    atomsRef.current.push(clMesh)
    ligandAtomsRef.current.push(clMesh)

    const clLabel = makeTextSprite("Cl⁻", { color: "#86efac", scale: 0.35 })
    clLabel.position.copy(clPos).add(new THREE.Vector3(0, 0.5, 0))
    group.add(clLabel)
    labelsRef.current.push(clLabel)

    parent.add(group)
    return group
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // CN⁻ LIGAND (uch bog'li — izoelektron CO ga)
  // ═══════════════════════════════════════════════════════════════════════════
  const createCNLigand = useCallback((parent, cPos, centerPos) => {
    const group = new THREE.Group()
    group.userData = { type: "ligand", ligandType: "CN", donorPos: cPos.clone() }

    // C atomi (donor, metalga qaragan)
    const cGeo = new THREE.SphereGeometry(CHEM.c_radius, 48, 48)
    const cMat = new THREE.MeshStandardMaterial({
      color: CPK.C, roughness: 0.35, metalness: 0.15,
      emissive: CPK.C, emissiveIntensity: 0.05
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(cPos)
    cMesh.userData = { type: "atom", element: "C", info: ATOM_INFO.C, isDonor: true }
    cMesh.castShadow = true
    group.add(cMesh)
    atomsRef.current.push(cMesh)
    ligandAtomsRef.current.push(cMesh)

    const cLabel = makeTextSprite("C", { color: "#d1d5db", scale: 0.32 })
    cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.35, 0))
    group.add(cLabel)
    labelsRef.current.push(cLabel)

    // N atomi (uzoq uchida)
    const dirOut = new THREE.Vector3().subVectors(cPos, centerPos).normalize()
    const nPos = new THREE.Vector3().copy(cPos).addScaledVector(dirOut, CHEM.cn_length)

    const nGeo = new THREE.SphereGeometry(CHEM.n_radius, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.08
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: "atom", element: "N", info: ATOM_INFO.N }
    group.add(nMesh)
    atomsRef.current.push(nMesh)

    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.32 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    group.add(nLabel)
    labelsRef.current.push(nLabel)

    // Uch bog' (C≡N — 3 ta paralell chiziq)
    const perpVec = new THREE.Vector3()
    if (Math.abs(dirOut.y) < 0.9) {
      perpVec.crossVectors(dirOut, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perpVec.crossVectors(dirOut, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const offset = 0.06

    const b1 = createBond(group, cPos, nPos, 0xaaaaaa, 0.045, 0.85)
    b1.userData = { type: "bond", bondType: "C≡N", length: "1.16 Å" }
    bondsRef.current.push(b1)

    const cOff1 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, offset)
    const nOff1 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, offset)
    const b2 = createBond(group, cOff1, nOff1, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b2)

    const cOff2 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, -offset)
    const nOff2 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, -offset)
    const b3 = createBond(group, cOff2, nOff2, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b3)

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════════════════════
  // BITTA MOLEKULA YARATISH (CHIZIQLI — L-M-L, 180°, D∞h)
  // ═══════════════════════════════════════════════════════════════════════════
  const buildSingleMolecule = useCallback((parent, complexData, centerPos = new THREE.Vector3(0, 0, 0), scale = 1) => {
    const molGroup = new THREE.Group()
    molGroup.position.copy(centerPos)
    molGroup.scale.setScalar(scale)
    molGroup.userData = { type: "molecule", baseScale: scale }
    const center = complexData.center
    const localLigandGroups = []

    // Markaziy metal atomi
    const cGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.85,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const cAtom = new THREE.Mesh(cGeo, cMat)
    cAtom.castShadow = true
    cAtom.userData = {
      type: "atom", element: center.element,
      info: ATOM_INFO[center.element], isCenter: true
    }
    molGroup.add(cAtom)
    atomsRef.current.push(cAtom)

    const centerLabel = makeTextSprite(`${center.element}${center.charge}`, {
      color: "#ffffff",
      bgColor: `rgba(${(center.color >> 16) & 255}, ${(center.color >> 8) & 255}, ${center.color & 255}, 0.9)`,
      borderColor: "#ffffff", scale: 0.5
    })
    centerLabel.position.set(0, center.radius + 0.5, 0)
    molGroup.add(centerLabel)
    labelsRef.current.push(centerLabel)

    // Glow effekti (markaziy atom uchun)
    const cGlow = new THREE.Mesh(
      new THREE.SphereGeometry(center.radius * 1.3, 32, 32),
      new THREE.MeshBasicMaterial({ color: center.color, transparent: true, opacity: 0.15 })
    )
    molGroup.add(cGlow)
    cAtom.userData.glow = cGlow

    // CHIZIQLI — 2 ligand, x o'qi bo'ylab (D∞h)
    const d = complexData.bondLength
    const ligandPositions = [[d, 0, 0], [-d, 0, 0]]
    const centerLocalPos = new THREE.Vector3(0, 0, 0)
    const ligandVectors = []

    ligandPositions.forEach(([x, y, z], idx) => {
      const donorPos = new THREE.Vector3(x, y, z)
      ligandVectors.push(donorPos)

      // Metal-ligand bog'i
      const bond = createBond(molGroup, centerLocalPos, donorPos, CPK.bond, 0.09)
      bond.userData = {
        type: "bond",
        bondType: `${center.element}–${complexData.ligand.donor}`,
        length: complexData.bondLengthReal,
        ligandIdx: idx
      }
      bondsRef.current.push(bond)

      // Bog' uzunligi yorlig'i
      const midpoint = new THREE.Vector3().addVectors(centerLocalPos, donorPos).multiplyScalar(0.5)
      const lengthLabel = makeTextSprite(complexData.bondLengthReal, {
        color: "#fef3c7", bgColor: "rgba(120,53,15,0.9)",
        borderColor: "#fbbf24", fontSize: 48, scale: 0.35
      })
      lengthLabel.position.copy(midpoint).add(new THREE.Vector3(0, 0.3, 0))
      lengthLabel.visible = false
      molGroup.add(lengthLabel)
      bondLabelsRef.current.push(lengthLabel)

      // Ligand yaratish (tip bo'yicha)
      let ligGroup
      if (complexData.ligand.type === "NH3") {
        ligGroup = createNH3Ligand(molGroup, donorPos, centerLocalPos)
      } else if (complexData.ligand.type === "Cl") {
        ligGroup = createClLigand(molGroup, donorPos)
      } else if (complexData.ligand.type === "CN") {
        ligGroup = createCNLigand(molGroup, donorPos, centerLocalPos)
      }
      if (ligGroup) {
        ligGroup.userData.ligandIdx = idx
        ligGroup.userData.bond = bond
        ligGroup.userData.originalPos = donorPos.clone()
        ligGroup.userData.centerPos = centerLocalPos.clone()
        localLigandGroups.push(ligGroup)
      }
    })

    // Tashqi sfera (agar mavjud bo'lsa)
    if (complexData.outerIon) {
      const outer = complexData.outerIon
      const outerPos = new THREE.Vector3(0, -3.5, 0)
      const ionGeo = new THREE.SphereGeometry(outer.radius, 32, 32)
      const ionMat = new THREE.MeshStandardMaterial({
        color: outer.color, roughness: 0.3, metalness: 0.4,
        emissive: outer.color, emissiveIntensity: 0.15,
        transparent: true, opacity: 0.9
      })
      const ionMesh = new THREE.Mesh(ionGeo, ionMat)
      ionMesh.position.copy(outerPos)
      ionMesh.userData = {
        type: "atom", element: outer.element,
        info: ATOM_INFO[outer.element], isOuter: true
      }
      ionMesh.visible = false
      molGroup.add(ionMesh)
      atomsRef.current.push(ionMesh)
      outerSphereRef.current.push(ionMesh)

      const ionLabel = makeTextSprite(`${outer.element}${outer.charge}`, {
        color: "#ffffff",
        bgColor: `rgba(${(outer.color >> 16) & 255}, ${(outer.color >> 8) & 255}, ${outer.color & 255}, 0.85)`,
        borderColor: "#ffffff", scale: 0.4
      })
      ionLabel.position.copy(outerPos).add(new THREE.Vector3(0, outer.radius + 0.4, 0))
      ionLabel.visible = false
      molGroup.add(ionLabel)
      labelsRef.current.push(ionLabel)
      outerSphereRef.current.push(ionLabel)

      // Ionik bog' chizig'i
      const ionBondGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), outerPos
      ])
      const ionBondMat = new THREE.LineDashedMaterial({
        color: outer.color, dashSize: 0.2, gapSize: 0.15,
        transparent: true, opacity: 0.4
      })
      const ionBond = new THREE.Line(ionBondGeo, ionBondMat)
      ionBond.computeLineDistances()
      ionBond.visible = false
      ionBond.userData = { type: "ionic-bond" }
      molGroup.add(ionBond)
      outerSphereRef.current.push(ionBond)
    }

    molGroup.userData.coAtom = cAtom
    molGroup.userData.ligandGroups = localLigandGroups
    molGroup.userData.ligandVectors = ligandVectors
    parent.add(molGroup)
    return molGroup
  }, [createBond, createNH3Ligand, createClLigand, createCNLigand])

  // ═══════════════════════════════════════════════════════════════════════════
  // ENSEMBLE (ansambl) — bir yoki ko'p molekulalar
  // ═══════════════════════════════════════════════════════════════════════════
  const buildEnsemble = useCallback((scene, complexData, count, mode) => {
    atomsRef.current = []
    labelsRef.current = []
    bondLabelsRef.current = []
    bondsRef.current = []
    outerSphereRef.current = []
    ligandAtomsRef.current = []
    moleculeGroupsRef.current = []
    ligandGroupsRef.current = []

    const positions = getEnsemblePositions(count, mode)
    const moleculeScale = count === 1 ? 1 : (count === 8 ? 0.7 : 0.5)

    positions.forEach((pos) => {
      const molGroup = buildSingleMolecule(scene, complexData, pos, moleculeScale)
      moleculeGroupsRef.current.push(molGroup)
      if (molGroup.userData.ligandGroups) {
        ligandGroupsRef.current.push(...molGroup.userData.ligandGroups)
      }
    })

    // L-M-L o'q chizig'i (chiziqli geometriyani vizual ko'rsatish uchun)
    if (count === 1 && moleculeGroupsRef.current[0]) {
      const mol = moleculeGroupsRef.current[0]
      const ligVecs = mol.userData.ligandVectors
      if (ligVecs && ligVecs.length === 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([ligVecs[0], ligVecs[1]])
        const edgeMat = new THREE.LineDashedMaterial({
          color: 0x8B5CF6, dashSize: 0.15, gapSize: 0.1,
          transparent: true, opacity: 0.55
        })
        const line = new THREE.Line(geometry, edgeMat)
        line.computeLineDistances()
        line.userData = { type: "edge" }
        mol.add(line)
      }
    }
  }, [buildSingleMolecule])

  // ═══════════════════════════════════════════════════════════════════════════
  // ERITUVCHI MOLEKULALARI (suv, etanol)
  // ═══════════════════════════════════════════════════════════════════════════
  const createSolventMolecules = useCallback((scene, count, solvent) => {
    solventMoleculesRef.current.forEach(mol => {
      scene.remove(mol)
      mol.traverse(child => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
    })
    solventMoleculesRef.current = []

    const minDist = 3.5, maxDist = 7
    for (let i = 0; i < count; i++) {
      const theta = (i * 137.5) * Math.PI / 180
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const r = minDist + (i % 5) / 5 * (maxDist - minDist)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      const sg = new THREE.Group()
      sg.position.set(x, y, z)
      sg.userData = {
        type: "solvent",
        basePos: new THREE.Vector3(x, y, z),
        phase: (i * 0.7) % (Math.PI * 2)
      }

      if (solvent === "water") {
        // O atomi
        const oGeo = new THREE.SphereGeometry(0.18, 16, 16)
        const oMat = new THREE.MeshStandardMaterial({
          color: CPK.O, roughness: 0.5, transparent: true, opacity: 0.55
        })
        sg.add(new THREE.Mesh(oGeo, oMat))

        // 2 ta H — H-O-H = 104.5°
        const angle = 104.5 * Math.PI / 360
        const randRot = (i * 0.3) % (Math.PI * 2)
        for (let j = 0; j < 2; j++) {
          const sign = j === 0 ? 1 : -1
          const hx = 0.5 * Math.sin(angle) * sign * Math.cos(randRot)
          const hy = -0.5 * Math.cos(angle)
          const hz = 0.5 * Math.sin(angle) * sign * Math.sin(randRot)

          const hGeo = new THREE.SphereGeometry(0.09, 12, 12)
          const hMat = new THREE.MeshStandardMaterial({
            color: CPK.H, transparent: true, opacity: 0.5
          })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.set(hx, hy, hz)
          sg.add(hMesh)

          const bondGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8)
          const bondMat = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa, transparent: true, opacity: 0.4
          })
          const bond = new THREE.Mesh(bondGeo, bondMat)
          bond.position.set(hx / 2, hy / 2, hz / 2)
          bond.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(hx, hy, hz).normalize()
          )
          sg.add(bond)
        }
      } else if (solvent === "ethanol") {
        const oGeo = new THREE.SphereGeometry(0.16, 16, 16)
        const oMat = new THREE.MeshStandardMaterial({
          color: CPK.O, transparent: true, opacity: 0.55
        })
        sg.add(new THREE.Mesh(oGeo, oMat))
        const cGeo = new THREE.SphereGeometry(0.14, 16, 16)
        const cMat = new THREE.MeshStandardMaterial({
          color: CPK.C, transparent: true, opacity: 0.55
        })
        const cMesh = new THREE.Mesh(cGeo, cMat)
        cMesh.position.set(0.5, 0, 0)
        sg.add(cMesh)
      }

      scene.add(sg)
      solventMoleculesRef.current.push(sg)
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // VODOROD BOG'LARI (dashed line)
  // ═══════════════════════════════════════════════════════════════════════════
  const createHBonds = useCallback((scene) => {
    hBondsRef.current.forEach(b => {
      scene.remove(b)
      if (b.geometry) b.geometry.dispose()
      if (b.material) b.material.dispose()
    })
    hBondsRef.current = []
    if (!showHydrogenBonds || !showSolvation) return

    moleculeGroupsRef.current.forEach(mol => {
      const molWorldPos = new THREE.Vector3()
      mol.getWorldPosition(molWorldPos)
      solventMoleculesRef.current.forEach(sol => {
        const dist = sol.position.distanceTo(molWorldPos)
        if (dist > 2.5 && dist < 4.5) {
          const geometry = new THREE.BufferGeometry().setFromPoints([molWorldPos, sol.position])
          const material = new THREE.LineDashedMaterial({
            color: CPK.hbond, dashSize: 0.15, gapSize: 0.1,
            transparent: true, opacity: 0.5
          })
          const line = new THREE.Line(geometry, material)
          line.computeLineDistances()
          scene.add(line)
          hBondsRef.current.push(line)
        }
      })
    })
  }, [showHydrogenBonds, showSolvation])
  // ═══════════════════════════════════════════════════════════════════════════
  // REF'LAR (animatsiyalar uchun — state ni o'qish)
  // ═══════════════════════════════════════════════════════════════════════════
  const angleMeasureModeRef = useRef(angleMeasureMode)
  const distanceMeasureModeRef = useRef(distanceMeasureMode)
  const showTemperatureRef = useRef(showTemperature)
  const temperatureRef = useRef(temperature)
  const showSolvationRef = useRef(showSolvation)
  const isExchangePlayingRef = useRef(isExchangePlaying)
  const showLigandExchangeRef = useRef(showLigandExchange)
  const showVibrationRef = useRef(showVibration)
  const vibrationModeRef = useRef(vibrationMode)
  const complexRef = useRef(complex)

  useEffect(() => { angleMeasureModeRef.current = angleMeasureMode }, [angleMeasureMode])
  useEffect(() => { distanceMeasureModeRef.current = distanceMeasureMode }, [distanceMeasureMode])
  useEffect(() => { showTemperatureRef.current = showTemperature }, [showTemperature])
  useEffect(() => { temperatureRef.current = temperature }, [temperature])
  useEffect(() => { showSolvationRef.current = showSolvation }, [showSolvation])
  useEffect(() => { isExchangePlayingRef.current = isExchangePlaying }, [isExchangePlaying])
  useEffect(() => { showLigandExchangeRef.current = showLigandExchange }, [showLigandExchange])
  useEffect(() => { showVibrationRef.current = showVibration }, [showVibration])
  useEffect(() => { vibrationModeRef.current = vibrationMode }, [vibrationMode])
  useEffect(() => { complexRef.current = complex }, [complex])

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENE SETUP (Three.js — WebGL renderer, orbit controls, lighting)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = null
    scene.fog = new THREE.Fog(0x0a0a1a, 20, 50)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45, container.clientWidth / container.clientHeight, 0.1, 200
    )
    camera.position.set(6, 4, 8)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.localClippingEnabled = true
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 3
    controls.maxDistance = 45
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // Lighting (3-nuqtali yoritish — kino uslubida)
    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(8, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3)
    rimLight.position.set(0, -5, -8)
    scene.add(rimLight)

    // Kesim tekisligi
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    clipPlaneRef.current = clipPlane

    // Grid
    const grid = new THREE.GridHelper(16, 32, 0x333355, 0x1a1a33)
    grid.position.y = -5
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

    // Raycaster (atom tanlash uchun)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)
      if (intersects.length > 0) {
        const atom = intersects[0].object
        if (atom.userData.type === "atom") {
          if (angleMeasureModeRef.current && atom.userData.isDonor) {
            setSelectedLigands(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                const v1 = newList[0].position.clone().normalize()
                const v2 = newList[1].position.clone().normalize()
                const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / Math.PI
                setMeasuredAngle(angle.toFixed(1))
                return newList
              }
              if (newList.length > 2) {
                setMeasuredAngle(null)
                return [atom]
              }
              return newList
            })
          } else if (distanceMeasureModeRef.current) {
            setSelectedForDistance(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                const dist = newList[0].position.distanceTo(newList[1].position)
                const realBond = parseFloat(complexRef.current.bondLengthReal)
                const sceneBond = complexRef.current.bondLength
                const realDist = (dist / sceneBond) * realBond
                setMeasuredDistance(realDist.toFixed(2))
                return newList
              }
              if (newList.length > 2) {
                setMeasuredDistance(null)
                return [atom]
              }
              return newList
            })
          } else {
            setSelectedAtom(atom.userData)
          }
        }
      } else {
        if (!angleMeasureModeRef.current && !distanceMeasureModeRef.current) {
          setSelectedAtom(null)
        }
      }
    }
    renderer.domElement.addEventListener("click", onMouseClick)

    // Animatsiya sikli
    let frameId
    const clock = new THREE.Clock()
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const delta = Math.min(clock.getDelta(), 0.1)

      // Temperatura tebranishi
      if (showTemperatureRef.current) {
        const amplitude = (temperatureRef.current / 298) * 0.08
        atomsRef.current.forEach((atom, i) => {
          if (!atom.userData.isCenter && atom.userData.type === "atom") {
            if (!animationStateRef.current.originalPositions.has(atom.uuid)) {
              animationStateRef.current.originalPositions.set(atom.uuid, atom.position.clone())
            }
            const orig = animationStateRef.current.originalPositions.get(atom.uuid)
            atom.position.x = orig.x + Math.sin(elapsed * 4 + i * 0.7) * amplitude
            atom.position.y = orig.y + Math.cos(elapsed * 3.5 + i * 1.1) * amplitude
            atom.position.z = orig.z + Math.sin(elapsed * 4.5 + i * 0.5) * amplitude
          }
        })
      } else {
        animationStateRef.current.originalPositions.forEach((orig, uuid) => {
          const atom = atomsRef.current.find(a => a.uuid === uuid)
          if (atom && !atom.userData.isCenter) {
            atom.position.lerp(orig, 0.15)
          }
        })
      }

      // Erituvchi harakati
      if (showSolvationRef.current) {
        solventMoleculesRef.current.forEach((mol) => {
          if (mol.userData.basePos) {
            const phase = mol.userData.phase
            mol.position.x = mol.userData.basePos.x + Math.sin(elapsed * 1.2 + phase) * 0.2
            mol.position.y = mol.userData.basePos.y + Math.cos(elapsed * 1.5 + phase) * 0.2
            mol.position.z = mol.userData.basePos.z + Math.sin(elapsed * 1.8 + phase) * 0.2
            mol.rotation.y += delta * 0.5
          }
        })
      }

      // Ligand almashinuv animatsiyasi
      if (isExchangePlayingRef.current && showLigandExchangeRef.current) {
        animationStateRef.current.exchangeProgress += delta * 0.15
        if (animationStateRef.current.exchangeProgress >= 1) {
          animationStateRef.current.exchangeProgress = 1
          isExchangePlayingRef.current = false
          setIsExchangePlaying(false)
        }
        setExchangeProgress(animationStateRef.current.exchangeProgress)
      }

      // Markaziy atom "nafas oladi"
      atomsRef.current.forEach(atom => {
        if (atom.userData.isCenter && atom.userData.glow) {
          atom.userData.glow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
          atom.rotation.y += 0.002
        }
      })

      // Tebranish (IR modlari)
      if (showVibrationRef.current && moleculeGroupsRef.current[0]) {
        const mol = moleculeGroupsRef.current[0]
        if (mol.userData.ligandGroups) {
          const vibMode = vibrationModeRef.current
          const t = elapsed * 3
          mol.userData.ligandGroups.forEach((lg, idx) => {
            if (!lg.userData.originalPos) return
            const dir = lg.userData.originalPos.clone().normalize()
            let amplitude = 0
            if (vibMode === "sym_stretch") {
              // ν₁ simmetrik cho'zilish: ikkala ligand birga chiqadi/kiradi
              amplitude = Math.sin(t) * 0.2
            } else if (vibMode === "asym_stretch") {
              // ν₃ asimmetrik cho'zilish: biri chiqadi, ikkinchisi kiradi
              amplitude = idx === 0 ? Math.sin(t) * 0.25 : -Math.sin(t) * 0.25
            } else if (vibMode === "bend") {
              // ν₂ egilish (yakuniy — bend, degenerativ)
              const perpDir = new THREE.Vector3(0, Math.sin(t + idx * Math.PI) * 0.2, 0)
              lg.position.copy(lg.userData.originalPos).add(perpDir)
              return
            }
            const newPos = lg.userData.originalPos.clone().addScaledVector(dir, amplitude)
            lg.position.copy(newPos)
          })
        }
      } else if (!showVibrationRef.current && !showLigandExchangeRef.current) {
        moleculeGroupsRef.current.forEach(mol => {
          if (mol.userData.ligandGroups) {
            mol.userData.ligandGroups.forEach(lg => {
              if (lg.userData.originalPos) {
                lg.position.lerp(lg.userData.originalPos, 0.15)
              }
            })
          }
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)
    setTimeout(() => setLoading(false), 500)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("click", onMouseClick)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
        if (obj.material && obj.material.map) obj.material.map.dispose()
      })
      renderer.dispose()
      controls.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      atomsRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // ENSEMBLE QAYTA QURISH (kompleks/molekula soni o'zgarganda)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const toRemove = []
    scene.traverse((obj) => {
      if (obj.userData && (
        obj.userData.type === "molecule" ||
        obj.userData.type === "atom" ||
        obj.userData.type === "bond" ||
        obj.userData.type === "edge" ||
        obj.userData.type === "ionic-bond" ||
        obj.userData.type === "ligand"
      )) {
        toRemove.push(obj)
      }
      if (obj instanceof THREE.Sprite) toRemove.push(obj)
    })
    toRemove.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material.dispose()
      }
      if (obj.parent) obj.parent.remove(obj)
    })
    animationStateRef.current.originalPositions.clear()
    animationStateRef.current.exchangeProgress = 0
    setExchangeProgress(0)
    setIsExchangePlaying(false)
    buildEnsemble(scene, COMPLEXES[currentComplex], moleculeCount, ensembleMode)
    setSelectedAtom(null)
    setSelectedLigands([])
    setMeasuredAngle(null)
  }, [currentComplex, moleculeCount, ensembleMode, buildEnsemble])

  // ═══════════════════════════════════════════════════════════════════════════
  // ERITUVCHI
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    if (showSolvation) {
      createSolventMolecules(scene, solvationDensity, solventType)
    } else {
      solventMoleculesRef.current.forEach(mol => {
        scene.remove(mol)
        mol.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      solventMoleculesRef.current = []
      hBondsRef.current.forEach(b => {
        scene.remove(b)
        if (b.geometry) b.geometry.dispose()
        if (b.material) b.material.dispose()
      })
      hBondsRef.current = []
    }
  }, [showSolvation, solvationDensity, solventType, createSolventMolecules])

  // ═══════════════════════════════════════════════════════════════════════════
  // H-BOG'LAR
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    createHBonds(scene)
  }, [showHydrogenBonds, showSolvation, solvationDensity, createHBonds])

  // ═══════════════════════════════════════════════════════════════════════════
  // BOSIM (siqilish effekti)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const compression = showPressure ? (1 - Math.log10(Math.max(pressure, 1)) * 0.02) : 1
    moleculeGroupsRef.current.forEach(mol => {
      const baseScale = mol.userData.baseScale || 1
      mol.scale.setScalar(baseScale * compression)
    })
  }, [showPressure, pressure, moleculeCount])

  // ═══════════════════════════════════════════════════════════════════════════
  // pH EFFEKTI (rang o'zgarishi)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    moleculeGroupsRef.current.forEach(mol => {
      const coAtom = mol.userData.coAtom
      if (!coAtom) return
      if (showPH) {
        if (phLevel < 4) {
          coAtom.material.emissiveIntensity = 0.4
          coAtom.material.color.setHex(0xFF6677)
        } else if (phLevel > 10) {
          coAtom.material.emissiveIntensity = 0.3
          coAtom.material.color.setHex(0x66AAFF)
        } else {
          coAtom.material.emissiveIntensity = 0.15
          coAtom.material.color.setHex(complex.center.color)
        }
      } else {
        coAtom.material.emissiveIntensity = 0.15
        coAtom.material.color.setHex(complex.center.color)
      }
    })
  }, [showPH, phLevel, complex.center.color])

  // ═══════════════════════════════════════════════════════════════════════════
  // REDOKS (oksidlanish darajasi o'zgarishi)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    moleculeGroupsRef.current.forEach(mol => {
      const coAtom = mol.userData.coAtom
      if (!coAtom) return
      if (showRedox) {
        const baseOx = parseInt(complex.center.charge.replace("+", ""), 10)
        if (oxidationState < baseOx) {
          coAtom.material.color.setHex(0xFFB3C1)
          coAtom.scale.setScalar(1.1)
        } else if (oxidationState === baseOx) {
          coAtom.material.color.setHex(complex.center.color)
          coAtom.scale.setScalar(1.0)
        } else {
          coAtom.material.color.setHex(0x8B4D5C)
          coAtom.scale.setScalar(0.9)
        }
      } else {
        coAtom.material.color.setHex(complex.center.color)
        coAtom.scale.setScalar(1.0)
      }
    })
  }, [showRedox, oxidationState, complex.center.color, complex.center.charge])

  // ═══════════════════════════════════════════════════════════════════════════
  // LIGAND ALMASHINUV (H₂O yoki Cl⁻ ga)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!showLigandExchange) {
      moleculeGroupsRef.current.forEach(mol => {
        if (mol.userData.ligandGroups) {
          mol.userData.ligandGroups.forEach(lg => {
            if (lg.userData.originalPos) lg.position.copy(lg.userData.originalPos)
            lg.scale.setScalar(1)
            lg.visible = true
            if (lg.userData.bond) {
              lg.userData.bond.visible = true
              lg.userData.bond.material.opacity = 0.7
            }
          })
        }
      })
      animationStateRef.current.exchangeProgress = 0
      setExchangeProgress(0)
      return
    }

    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandGroups) return

    const ligandsToReplace = 1
    mol.userData.ligandGroups.forEach((lg, idx) => {
      if (idx >= ligandsToReplace) return
      if (!lg.userData.originalPos) return
      const t = exchangeProgress

      if (t === 0) {
        lg.position.copy(lg.userData.originalPos)
        lg.scale.setScalar(1)
        lg.visible = true
        if (lg.userData.bond) {
          lg.userData.bond.visible = true
          lg.userData.bond.material.opacity = 0.7
        }
        return
      }
      if (t < 0.4) {
        const phase = t / 0.4
        const dir = lg.userData.originalPos.clone().normalize()
        lg.position.copy(lg.userData.originalPos).addScaledVector(dir, phase * 2.5)
        lg.scale.setScalar(Math.max(0.1, 1 - phase * 0.9))
        if (lg.userData.bond) {
          lg.userData.bond.material.opacity = Math.max(0, 0.7 - phase * 0.7)
        }
      } else if (t < 0.6) {
        lg.visible = false
        if (lg.userData.bond) lg.userData.bond.visible = false
      } else {
        const phase = (t - 0.6) / 0.4
        const dir = lg.userData.originalPos.clone().normalize()
        lg.position.copy(lg.userData.originalPos).addScaledVector(dir, (1 - phase) * 2.5)
        lg.scale.setScalar(0.1 + phase * 0.9)
        lg.visible = true
        if (lg.userData.bond) {
          lg.userData.bond.visible = true
          lg.userData.bond.material.opacity = phase * 0.7
        }
        const newColor = exchangeTarget === "Cl" ? CPK.Cl : CPK.O
        lg.traverse(child => {
          if (child.userData && child.userData.isDonor && child.material) {
            child.material.color.setHex(newColor)
            child.material.emissive.setHex(newColor)
          }
        })
      }
    })
  }, [showLigandExchange, exchangeProgress, exchangeTarget])

  useEffect(() => {
    if (!showLigandExchange || exchangeProgress > 0) return
    moleculeGroupsRef.current.forEach(mol => {
      if (mol.userData.ligandGroups) {
        mol.userData.ligandGroups.forEach(lg => {
          lg.traverse(child => {
            if (child.userData && child.userData.isDonor && child.material) {
              child.material.color.setHex(complex.ligand.donorColor)
              child.material.emissive.setHex(complex.ligand.donorColor)
            }
          })
        })
      }
    })
  }, [exchangeTarget, showLigandExchange, exchangeProgress, complex.ligand.donorColor])

  // ═══════════════════════════════════════════════════════════════════════════
  // TASHQI SFERA / YORLIQLAR / BOND UZUNLIKLARI / KO'RINISH / KESIM
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    outerSphereRef.current.forEach(obj => { obj.visible = showOuterSphere })
  }, [showOuterSphere, currentComplex, moleculeCount])

  useEffect(() => {
    labelsRef.current.forEach(label => {
      if (!outerSphereRef.current.includes(label)) label.visible = showLabels
    })
  }, [showLabels, currentComplex, moleculeCount])

  useEffect(() => {
    bondLabelsRef.current.forEach(label => { label.visible = showBondLengths })
  }, [showBondLengths, currentComplex, moleculeCount])

  useEffect(() => {
    atomsRef.current.forEach(atom => {
      if (!atom.material) return
      const el = atom.userData.element
      if (viewMode === "space-filling") {
        const vdwScales = { Ag: 2.4, Au: 2.5, Hg: 2.5, Cu: 2.3, N: 2.0, C: 2.1, H: 1.6, Cl: 2.3, K: 2.6, Na: 2.5, O: 1.9 }
        atom.scale.setScalar(vdwScales[el] || 1.5)
        atom.material.opacity = 0.85
        atom.material.transparent = true
      } else if (viewMode === "wireframe") {
        atom.scale.setScalar(1)
        atom.material.wireframe = true
        atom.material.opacity = 1
      } else {
        atom.scale.setScalar(1)
        atom.material.wireframe = false
        atom.material.opacity = 1
        atom.material.transparent = false
      }
    })
    bondsRef.current.forEach(bond => { bond.visible = viewMode !== "space-filling" })
  }, [viewMode, currentComplex, moleculeCount])

  useEffect(() => {
    const renderer = rendererRef.current
    const clipPlane = clipPlaneRef.current
    if (!renderer || !clipPlane) return
    atomsRef.current.forEach(atom => {
      if (atom.material) {
        atom.material.clippingPlanes = sliceView ? [clipPlane] : []
        atom.material.needsUpdate = true
      }
    })
    bondsRef.current.forEach(bond => {
      if (bond.material) {
        bond.material.clippingPlanes = sliceView ? [clipPlane] : []
        bond.material.needsUpdate = true
      }
    })
  }, [sliceView, currentComplex, moleculeCount])

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  useEffect(() => {
    ligandAtomsRef.current.forEach(atom => {
      if (atom.material) atom.material.emissiveIntensity = 0.05
    })
    selectedLigands.forEach(atom => {
      if (atom.material) atom.material.emissiveIntensity = 0.6
    })
  }, [selectedLigands])

  // ═══════════════════════════════════════════════════════════════════════════
  // SIMMETRIYA ELEMENTLARI (D∞h uchun — C∞, C₂, σh, σv, i)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    symmetryHelpersRef.current.forEach(h => {
      scene.remove(h)
      if (h.geometry) h.geometry.dispose()
      if (h.material) h.material.dispose()
    })
    symmetryHelpersRef.current = []
    if (!showSymmetry || moleculeCount !== 1) return

    const len = 4.5

    if (symmetryElement === "Cinf") {
      // C∞ — asosiy aylanish o'qi (molekula bo'ylab, x)
      const dir = new THREE.Vector3(1, 0, 0)
      const points = [dir.clone().multiplyScalar(-len), dir.clone().multiplyScalar(len)]
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0x22ff44, linewidth: 3, transparent: true, opacity: 0.9
      })
      const line = new THREE.Line(geom, mat)
      line.userData = { type: "symmetry" }
      scene.add(line)
      symmetryHelpersRef.current.push(line)

      const label = makeTextSprite("C∞ (asosiy o'q)", {
        color: "#ffffff", bgColor: "rgba(34,255,68,0.9)",
        borderColor: "#ffffff", scale: 0.42
      })
      label.position.copy(dir.clone().multiplyScalar(len + 0.5))
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)

      const noteLbl = makeTextSprite("D∞h — cheksiz aylanish", {
        color: "#e0ffe0", bgColor: "rgba(30,120,30,0.9)",
        borderColor: "#22ff44", scale: 0.32
      })
      noteLbl.position.set(0, len - 1, 0)
      noteLbl.userData = { type: "symmetry" }
      scene.add(noteLbl)
      symmetryHelpersRef.current.push(noteLbl)
    } else if (symmetryElement === "C2") {
      // C₂ o'qlari — molekulaga perpendikulyar (y va z)
      const axes = [
        { dir: [0, 1, 0], color: 0x00ccff, label: "C₂ (y)" },
        { dir: [0, 0, 1], color: 0xff00cc, label: "C₂ (z)" }
      ]
      axes.forEach(a => {
        const d = new THREE.Vector3(...a.dir)
        const pts = [d.clone().multiplyScalar(-len * 0.8), d.clone().multiplyScalar(len * 0.8)]
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        const m = new THREE.LineBasicMaterial({
          color: a.color, transparent: true, opacity: 0.75
        })
        const line = new THREE.Line(g, m)
        line.userData = { type: "symmetry" }
        scene.add(line)
        symmetryHelpersRef.current.push(line)

        const lbl = makeTextSprite(a.label, {
          color: "#ffffff",
          bgColor: `rgba(${(a.color >> 16) & 255}, ${(a.color >> 8) & 255}, ${a.color & 255}, 0.9)`,
          borderColor: "#ffffff", scale: 0.35
        })
        lbl.position.copy(d.clone().multiplyScalar(len * 0.8 + 0.4))
        lbl.userData = { type: "symmetry" }
        scene.add(lbl)
        symmetryHelpersRef.current.push(lbl)
      })
    } else if (symmetryElement === "sigma_h") {
      // σh — asosiy o'qqa perpendikulyar tekislik (YZ tekisligi)
      const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, transparent: true, opacity: 0.25,
        side: THREE.DoubleSide
      })
      const plane = new THREE.Mesh(planeGeo, planeMat)
      plane.rotation.y = Math.PI / 2
      plane.userData = { type: "symmetry" }
      scene.add(plane)
      symmetryHelpersRef.current.push(plane)

      const label = makeTextSprite("σh (gorizontal tekislik)", {
        color: "#ffffff", bgColor: "rgba(0,200,200,0.9)",
        borderColor: "#ffffff", scale: 0.42
      })
      label.position.set(0, len, 0)
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_v") {
      // ∞σv — asosiy o'q orqali cheksiz vertikal tekisliklar
      const planes = [
        { rot: [0, 0, 0], color: 0xffff00 },
        { rot: [Math.PI / 2, 0, 0], color: 0xff00ff }
      ]
      planes.forEach(p => {
        const geo = new THREE.PlaneGeometry(len * 2, len * 2)
        const mat = new THREE.MeshBasicMaterial({
          color: p.color, transparent: true, opacity: 0.18,
          side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.set(...p.rot)
        mesh.userData = { type: "symmetry" }
        scene.add(mesh)
        symmetryHelpersRef.current.push(mesh)
      })
      const label = makeTextSprite("∞σv (cheksiz tekisliklar)", {
        color: "#ffffff", bgColor: "rgba(200,200,0,0.9)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(0, len, len)
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "inversion") {
      // i — inversiya markazi (metalda)
      const sphereGeo = new THREE.SphereGeometry(0.18, 24, 24)
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xff8844, transparent: true, opacity: 0.9
      })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      sphere.userData = { type: "symmetry" }
      scene.add(sphere)
      symmetryHelpersRef.current.push(sphere)

      const label = makeTextSprite("i (inversiya markazi)", {
        color: "#ffffff", bgColor: "rgba(255,136,68,0.9)",
        borderColor: "#ffffff", scale: 0.4
      })
      label.position.set(0.5, 1.5, 0)
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)

      const noteLbl = makeTextSprite("(x,y,z) → (−x,−y,−z)", {
        color: "#ffe0cc", bgColor: "rgba(150,80,40,0.9)",
        borderColor: "#ff8844", scale: 0.32
      })
      noteLbl.position.set(0.5, -0.3, 0)
      noteLbl.userData = { type: "symmetry" }
      scene.add(noteLbl)
      symmetryHelpersRef.current.push(noteLbl)
    }
  }, [showSymmetry, symmetryElement, moleculeCount, currentComplex])

  // ═══════════════════════════════════════════════════════════════════════════
  // MASOFA CHIZIG'I (o'lchash rejimida)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    if (distanceLineRef.current) {
      scene.remove(distanceLineRef.current)
      if (distanceLineRef.current.geometry) distanceLineRef.current.geometry.dispose()
      if (distanceLineRef.current.material) distanceLineRef.current.material.dispose()
      distanceLineRef.current = null
    }
    if (selectedForDistance.length === 2) {
      const p1 = new THREE.Vector3()
      const p2 = new THREE.Vector3()
      selectedForDistance[0].getWorldPosition(p1)
      selectedForDistance[1].getWorldPosition(p2)
      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2])
      const mat = new THREE.LineDashedMaterial({
        color: 0xffaa00, dashSize: 0.15, gapSize: 0.08,
        transparent: true, opacity: 0.9
      })
      const line = new THREE.Line(geom, mat)
      line.computeLineDistances()
      scene.add(line)
      distanceLineRef.current = line
    }
    if (distanceMeasureMode) {
      atomsRef.current.forEach(atom => {
        if (atom.material) {
          atom.material.emissiveIntensity = selectedForDistance.includes(atom) ? 0.7 : 0.05
        }
      })
    }
  }, [selectedForDistance, distanceMeasureMode])

  // ═══════════════════════════════════════════════════════════════════════════
  // BARCHA BURCHAKLARNI HISOBLASH
  // ═══════════════════════════════════════════════════════════════════════════
  const computeAllAngles = useCallback(() => {
    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandVectors) return []
    const vecs = mol.userData.ligandVectors
    const angles = []
    for (let i = 0; i < vecs.length; i++) {
      for (let j = i + 1; j < vecs.length; j++) {
        const v1 = vecs[i].clone().normalize()
        const v2 = vecs[j].clone().normalize()
        const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / Math.PI
        angles.push({ pair: `L${i + 1}-M-L${j + 1}`, angle: angle.toFixed(1) })
      }
    }
    return angles
  }, [])

  const togglePanel = (panelName) => {
    setActivePanel(prev => prev === panelName ? null : panelName)
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — ILMIY JURNAL SIFATIDA (18+ manba, IR grafik, MO diagramma)
  // ═══════════════════════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      // ── Font yuklash (DejaVu Sans — Unicode qo'llab-quvvatlash) ──
      let regularFont, boldFont, italicFont
      try {
        const [rb, bb, ib] = await Promise.all([
          fetch("/fonts/DejaVuSans.ttf").then(r => {
            if (!r.ok) throw new Error("Regular font yuklanmadi")
            return r.arrayBuffer()
          }),
          fetch("/fonts/DejaVuSans-Bold.ttf").then(r => {
            if (!r.ok) throw new Error("Bold font yuklanmadi")
            return r.arrayBuffer()
          }),
          fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => {
            if (!r.ok) throw new Error("Italic font yuklanmadi")
            return r.arrayBuffer()
          })
        ])
        regularFont = await pdfDoc.embedFont(rb, { subset: true })
        boldFont = await pdfDoc.embedFont(bb, { subset: true })
        italicFont = await pdfDoc.embedFont(ib, { subset: true })
      } catch (fontErr) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }

      // ── Rang palitrasi ──
      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55), textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), orangeDeep: rgb(0.71, 0.39, 0), orangeSoft: rgb(0.71, 0.31, 0.08),
        green: rgb(0.08, 0.47, 0.31), greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55), cyan: rgb(0.02, 0.55, 0.72),
        brown: rgb(0.71, 0.39, 0.12), grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgCyan: rgb(0.90, 0.97, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98), bgYellow: rgb(1.0, 0.98, 0.94),
        bgAbstract: rgb(0.96, 0.94, 1.0), bgSnapshot: rgb(0.04, 0.02, 0.09),
        white: rgb(1, 1, 1), red: rgb(0.80, 0.20, 0.20)
      }

      // A4 o'lchamlari
      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30, HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      // ═══ YORDAMCHI FUNKSIYALAR ═══
      const measure = (text, font, size) => font.widthOfTextAtSize(String(text), size)
      const truncate = (text, font, size, maxW) => {
        const s = String(text)
        if (measure(s, font, size) <= maxW) return s
        let lo = 0, hi = s.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(s.slice(0, mid) + "…", font, size) <= maxW) lo = mid
          else hi = mid - 1
        }
        return s.slice(0, lo) + "…"
      }
      const wrapText = (text, font, size, maxW) => {
        if (!text) return [""]
        const words = String(text).split(/\s+/)
        const lines = []
        let cur = ""
        for (const w of words) {
          const test = cur ? cur + " " + w : w
          if (measure(test, font, size) > maxW && cur) {
            lines.push(cur)
            cur = w
          } else cur = test
          if (measure(cur, font, size) > maxW) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, font, size) > maxW) {
                lines.push(piece)
                piece = ch
              } else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark,
                align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth != null ? maxWidth : (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x
        const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
        const lines = wrapText(cleanText(text), font, size, maxW)
        lines.forEach((line, i) => {
          const w = measure(line, font, size)
          page.drawText(line, {
            x: (PAGE_W - w) / 2, y: cy - i * (size + 3),
            size, font, color
          })
        })
        return lines.length * (size + 3)
      }
      const addFooter = () => {
        const leftText = truncate(
          `Chiziqli 3D Lab PRO  •  ${cleanText(complex.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, {
          x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
        })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, {
          x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8,
          font: regularFont, color: C.textGray
        })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
      }
      const addNewPage = () => {
        addFooter()
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNum++
        y = PAGE_H - MARGIN
      }
      const checkPageBreak = (need) => {
        if (y - need < FOOTER_Y + 25) addNewPage()
      }
      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({
          x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple
        })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.purple,
          maxWidth: CONTENT_W - 15
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgPurple, labelColor = C.purple) => {
        const rowH = 20
        const labelW = 190
        const valueX = MARGIN + labelW + 6
        const valueMaxW = CONTENT_W - labelW - 12
        checkPageBreak(rowH + 2)
        page.drawRectangle({
          x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor
        })
        safeText(label, {
          x: MARGIN + 6, y: y - 13, size: 9,
          font: boldFont, color: labelColor, maxWidth: labelW - 8
        })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, {
          x: valueX, y: y - 13, size: 9,
          font: regularFont, color: C.textDark
        })
        y -= rowH
      }
      const drawBulletList = (items, bulletColor = C.purple) => {
        items.forEach(item => {
          const lines = wrapText(cleanText(item), regularFont, 9, CONTENT_W - 20)
          checkPageBreak(lines.length * 12 + 4)
          page.drawText("•", {
            x: MARGIN + 3, y: y - 10, size: 10,
            font: boldFont, color: bulletColor
          })
          lines.forEach((line, i) => {
            page.drawText(line, {
              x: MARGIN + 14, y: y - 10 - i * 12,
              size: 9, font: regularFont, color: C.textDark
            })
          })
          y -= lines.length * 12 + 4
        })
      }

      // ═══════════════════════════════════════════════════════════════════════
      // SARLAVHA POLOSASI
      // ═══════════════════════════════════════════════════════════════════════
      page.drawRectangle({
        x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark
      })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Koordinatsion Kimyo  •  Vol. 2, Son 2", {
        x: MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.65
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight,
        align: "right", maxWidth: CONTENT_W * 0.3
      })
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 },
        end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid
      })
      safeText("Chiziqli Koordinatsion Komplekslar — Interaktiv 3D Modellashtirish", {
        x: MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86),
        maxWidth: CONTENT_W * 0.65
      })
      safeText("DOI: 10.0000/jda-kimyo.2026.linear", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86),
        align: "right", maxWidth: CONTENT_W * 0.3
      })
      y = PAGE_H - HEADER_H - 30

      // TITLE + META
      drawCenteredText(`${cleanText(complex.formula)} — Struktur Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText(cleanText(complex.name), y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Geometriya: ${cleanText(complex.geometry)} (${cleanText(complex.symmetry)})  •  Gibridlanish: ${cleanText(complex.hybridization)}  •  ${cleanText(complex.magnetism)}  •  ${cleanText(complex.dConfig)}`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══ ANNOTATSIYA ═══
      const subNum = (n) => "₀₁₂₃₄₅₆₇₈₉"[n] || String(n)
      const dgSub = String(complex.dOrbital.delta_g).split("").map(d => subNum(+d)).join("")
      const pgSub = String(complex.dOrbital.pi_g).split("").map(d => subNum(+d)).join("")
      const sgSub = String(complex.dOrbital.sigma_g_star).split("").map(d => subNum(+d)).join("")
      const isHeavyMetal = complex.center.element === "Au" || complex.center.element === "Hg"

      const abstract =
        `${cleanText(complex.formula)} — chiziqli (D∞h) geometriyali koordinatsion kompleks. ` +
        `Markaziy ${cleanText(ATOM_INFO[complex.center.element].name.split(" ")[0])} atomi ${cleanText(complex.dConfig)} konfiguratsiyada ` +
        `ikkita ${cleanText(complex.ligand.label)} ligandi bilan ${cleanText(complex.ligand.donor)} donor atomi orqali ${cleanText(complex.bondLengthReal)} masofada 180° L-M-L burchak ostida bog'langan. ` +
        `Werner (1893) koordinatsion nazariyasi asosida, chiziqli geometriya ` +
        `${isHeavyMetal ? "relativistik 6s² inert juft effekti (Pyykkö 1988) va d–s aralashuv" : "sp-gibridlanish va d–s aralashuv (Orgel 1958)"} bilan tushuntiriladi. ` +
        `D∞h simmetriyasida d-orbitallar 3 sathga ajraladi: δg (dx²-y², dxy) ` +
        `${'<'} πg (dxz, dyz) ${'<<'} σg* (dz²); ` +
        `Δ₁ (δg → πg) ≈ ${complex.dOrbital.delta1_cm.toLocaleString()} cm⁻¹, ` +
        `Δ₂ (πg → σg*) ≈ ${complex.dOrbital.delta2_cm.toLocaleString()} cm⁻¹. ` +
        `Elektron konfiguratsiya: (δg)${dgSub} (πg)${pgSub} (σg*)${sgSub} — d¹⁰ to'liq to'ldirilgan, CFSE = 0, diamagnit (S = 0, μ = 0 μB). ` +
        `${cleanText(complex.description)} ` +
        `Termodinamik ma'lumotlar: log β₂ = ${complex.thermodynamics.logBeta2}, ΔG = ${complex.thermodynamics.deltaG} (298 K).`

      const absPadding = 12
      const absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10,
        font: boldFont, color: C.purple, maxWidth: absInnerW
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // ═══ 1. 3D SNAPSHOT ═══
      if (pdfSections.snapshot) {
        drawSectionHeader(sectionNum++, "3D Vizualizatsiya")
        const renderer = rendererRef.current
        if (renderer && sceneRef.current && cameraRef.current) {
          const cam = cameraRef.current
          const savedPos = cam.position.clone()
          const savedTarget = controlsRef.current && controlsRef.current.target
            ? controlsRef.current.target.clone()
            : new THREE.Vector3()
          const originalPixelRatio = renderer.getPixelRatio()
          renderer.setPixelRatio(2)
          renderer.setSize(1920, 1080)
          cam.aspect = 1920 / 1080
          cam.updateProjectionMatrix()
          cam.position.set(7, 4, 9)
          cam.lookAt(0, 0, 0)
          if (controlsRef.current) controlsRef.current.target.set(0, 0, 0)
          renderer.setClearColor(0x0a0418, 1)
          renderer.render(sceneRef.current, cam)

          const pngDataUrl = renderer.domElement.toDataURL("image/png", 1.0)
          const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer())
          const pngImage = await pdfDoc.embedPng(pngBytes)

          renderer.setPixelRatio(originalPixelRatio)
          const container = containerRef.current
          if (container) {
            renderer.setSize(container.clientWidth, container.clientHeight)
            cam.aspect = container.clientWidth / container.clientHeight
            cam.updateProjectionMatrix()
          }
          cam.position.copy(savedPos)
          if (controlsRef.current) controlsRef.current.target.copy(savedTarget)
          cam.lookAt(savedTarget)
          renderer.render(sceneRef.current, cam)

          const imgW = CONTENT_W
          const imgH = imgW * (1080 / 1920)
          checkPageBreak(imgH + 40)
          page.drawRectangle({
            x: MARGIN, y: y - imgH, width: imgW, height: imgH,
            color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 1.5
          })
          page.drawImage(pngImage, {
            x: MARGIN + 2, y: y - imgH + 2, width: imgW - 4, height: imgH - 4
          })
          y -= imgH + 10

          const caption =
            `1-rasm. ${cleanText(complex.formula)} ning ` +
            `${viewMode === "ball-stick" ? "shar-tayoqcha" : viewMode === "space-filling" ? "fazo to'ldiruvchi (CPK)" : "karkas"} ` +
            `ko'rinishidagi 3D modeli. Chiziqli ${cleanText(complex.symmetry)} simmetriyada 180° L–M–L burchak. ` +
            `${moleculeCount > 1 ? `${moleculeCount} ta molekula ${ensembleMode === "crystal" ? "kristall panjara" : "eritma"} ansamblida.` : "Bitta molekula ko'rsatilgan."}`
          const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
          capLines.forEach((line, i) => {
            page.drawText(line, {
              x: MARGIN, y: y - i * 11, size: 8.5,
              font: italicFont, color: C.purpleSoft
            })
          })
          y -= capLines.length * 11 + 18
        }
      }

      // ═══ 2. BIRIKMA IDENTIFIKATSIYASI ═══
      if (pdfSections.info) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const info = [
          ["Koordinatsion formula", complex.formula],
          ["Tashqi sfera tuzi", complex.fullSalt],
          ["IUPAC nomi (uzb.)", complex.name],
          ["Sinf", "2-koordinatsion chiziqli d¹⁰ kompleks"],
          ["Koordinatsion son", "2 (chiziqli — Werner tipida)"],
          ["Molekulyar simmetriya", `${complex.symmetry} — cheksiz aylanish o'qi`],
          ["Nuqtaviy guruh", complex.pointGroup],
          ["Ligand tipi", complex.ligand.classification],
          [`Metall–${complex.ligand.donor} bog' uzunligi`, complex.bondLengthReal],
          ["L–M–L burchak", "180.0° (ideal)"],
          ["Gibridlanish", complex.hybridization],
          ["Metall oksidlanish darajasi", complex.center.charge],
          ["d-elektronlar", `d${complex.dElectrons} (${complex.dConfig})`],
          ["Valent elektronlar (jami)", `${complex.valenceElectrons} e⁻ (2-koord. uchun standart)`],
          ["Magnit xossasi", `${complex.magnetism} — ${complex.magneticMoment}`],
          ["Rangi", complex.color],
          ["Erish/parchalanish t.", complex.meltingPoint]
        ]
        info.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
        })
        y -= 15
      }

      // ═══ 3. MOLEKULYAR GEOMETRIYA ═══
      if (pdfSections.geometry) {
        drawSectionHeader(sectionNum++, "Molekulyar Geometriya (D∞h)")
        const angles = computeAllAngles()
        const geomData = [
          [`M–${complex.ligand.donor} bog' uzunligi (X-ray)`, complex.bondLengthReal],
          ["Ideal L–M–L burchak", "180.0°"],
          ["Hisoblangan L–M–L burchak", angles.length > 0 ? `${angles[0].angle}°` : "180.0°"],
          ["Molekula o'qi", "z o'qi bo'ylab (an'anaviy)"],
          ["Simmetriya elementlari", "C∞, ∞C₂, σh, ∞σv, i, S∞"],
          ["Ideal D∞h dan og'ish (RMSD)", "< 0.001 Å"],
          ["VSEPR bashorati", complex.center.element === "Ag" || complex.center.element === "Cu" ? "AX₂E₀ — chiziqli (sp)" : "AX₂E₀ (formal), 6s² inert juft (relativistik)"],
          ["Elektron jufti (inert)", complex.center.element === "Ag" || complex.center.element === "Cu" ? "Yo'q (d¹⁰, sp gibrid)" : "6s² inert juft (relativistik stabilizatsiya)"]
        ]
        geomData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgOrange : C.white, C.orangeSoft)
        })
        y -= 15
      }

      // ═══ 4. SIMULYATSIYA SHAROITLARI ═══
      if (pdfSections.conditions) {
        drawSectionHeader(sectionNum++, "Simulyatsiya Sharoitlari")
        const cond = [
          ["Molekulalar soni", `${moleculeCount}`],
          ["Ansambl rejimi", ensembleMode === "crystal" ? "Kristall panjara (3D)" : "Eritma (Fibonacci sfera)"],
          ["Vizualizatsiya rejimi", viewMode === "ball-stick" ? "Shar-tayoqcha (ball-stick)" : viewMode === "space-filling" ? "Fazo to'ldiruvchi (CPK)" : "Karkas (wireframe)"]
        ]
        if (showTemperature) cond.push(["Temperatura", `${temperature} K (${(temperature - 273).toFixed(0)} °C) — atom tebranishi`])
        if (showPressure) cond.push(["Bosim", `${pressure.toLocaleString()} atm`])
        if (showPH) cond.push(["pH muhit", `${phLevel} (${phLevel < 7 ? "kislotali" : phLevel > 7 ? "ishqoriy" : "neytral"})`])
        if (showSolvation) {
          cond.push(["Erituvchi", solventType === "water" ? "Suv (H₂O, ε = 78.5)" : "Etanol (C₂H₅OH, ε = 24.6)"])
          cond.push(["Solvatatsiya qobig'i", `${solvationDensity} ta molekula`])
        }
        if (showHydrogenBonds) cond.push(["Vodorod bog'lari", "Faol (2.5–4.5 Å oralig'ida)"])
        cond.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue)
        })
        y -= 15
      }

      // ═══ 5. d-ORBITAL DIAGRAMMASI (D∞h — 3 sath) ═══
      if (pdfSections.dorbital) {
        drawSectionHeader(sectionNum++, "Kristall Maydon d-Orbital Ajralishi (D∞h)")
        checkPageBreak(220)
        const diagX = MARGIN + 30
        const sigmaY = y - 25
        const piY = y - 90
        const deltaY = y - 155

        // E o'qi
        page.drawLine({
          start: { x: diagX, y }, end: { x: diagX, y: deltaY - 25 },
          thickness: 1, color: rgb(0.63, 0.63, 0.71)
        })
        page.drawLine({
          start: { x: diagX - 3, y: y - 3 }, end: { x: diagX, y: y + 2 },
          thickness: 1, color: rgb(0.63, 0.63, 0.71)
        })
        page.drawLine({
          start: { x: diagX + 3, y: y - 3 }, end: { x: diagX, y: y + 2 },
          thickness: 1, color: rgb(0.63, 0.63, 0.71)
        })
        page.drawText("E", {
          x: diagX - 12, y: y - 5, size: 10,
          font: italicFont, color: rgb(0.51, 0.51, 0.59)
        })

        const orbLineW = 42

        // σg* (dz²) — eng yuqori
        const sigX = diagX + 30
        page.drawLine({
          start: { x: sigX, y: sigmaY }, end: { x: sigX + orbLineW, y: sigmaY },
          thickness: 2.5, color: C.red
        })
        page.drawText("σg*", {
          x: sigX + orbLineW + 8, y: sigmaY - 3, size: 11,
          font: boldFont, color: C.red
        })
        page.drawText("dz²", {
          x: sigX + 10, y: sigmaY + 6, size: 7,
          font: regularFont, color: C.textMuted
        })
        page.drawText("(antibog'lovchi)", {
          x: diagX + 165, y: sigmaY - 3, size: 7.5,
          font: italicFont, color: C.textMuted
        })

        // πg (dxz, dyz) — o'rta
        const piX1 = diagX + 20, piX2 = diagX + 70
        page.drawLine({
          start: { x: piX1, y: piY }, end: { x: piX1 + orbLineW, y: piY },
          thickness: 2.5, color: C.orange
        })
        page.drawLine({
          start: { x: piX2, y: piY }, end: { x: piX2 + orbLineW, y: piY },
          thickness: 2.5, color: C.orange
        })
        page.drawText("πg", {
          x: diagX + 128, y: piY - 3, size: 11,
          font: boldFont, color: C.orange
        })
        page.drawText("dxz", { x: piX1 + 10, y: piY + 6, size: 7, font: regularFont, color: C.textMuted })
        page.drawText("dyz", { x: piX2 + 10, y: piY + 6, size: 7, font: regularFont, color: C.textMuted })
        page.drawText("(bog'lanmagan)", {
          x: diagX + 165, y: piY - 3, size: 7.5,
          font: italicFont, color: C.textMuted
        })

        // δg (dx²-y², dxy) — eng past
        const dX1 = diagX + 20, dX2 = diagX + 70
        page.drawLine({
          start: { x: dX1, y: deltaY }, end: { x: dX1 + orbLineW, y: deltaY },
          thickness: 2.5, color: C.cyan
        })
        page.drawLine({
          start: { x: dX2, y: deltaY }, end: { x: dX2 + orbLineW, y: deltaY },
          thickness: 2.5, color: C.cyan
        })
        page.drawText("δg", {
          x: diagX + 128, y: deltaY - 3, size: 11,
          font: boldFont, color: C.cyan
        })
        page.drawText("dx²-y²", { x: dX1 + 4, y: deltaY + 6, size: 7, font: regularFont, color: C.textMuted })
        page.drawText("dxy", { x: dX2 + 10, y: deltaY + 6, size: 7, font: regularFont, color: C.textMuted })
        page.drawText("(bog'lovchi)", {
          x: diagX + 165, y: deltaY - 3, size: 7.5,
          font: italicFont, color: C.textMuted
        })

        // Elektronlar
        const drawEP = (x, w, cy, count) => {
          if (count > 0) page.drawText("↑", { x: x + w / 2 - 6, y: cy + 4, size: 11, font: boldFont, color: C.orange })
          if (count > 1) page.drawText("↓", { x: x + w / 2 + 1, y: cy + 4, size: 11, font: boldFont, color: C.orange })
        }
        drawEP(sigX, orbLineW, sigmaY, complex.dOrbital.sigma_g_star)
        drawEP(piX1, orbLineW, piY, Math.min(2, complex.dOrbital.pi_g))
        drawEP(piX2, orbLineW, piY, Math.max(0, complex.dOrbital.pi_g - 2))
        drawEP(dX1, orbLineW, deltaY, Math.min(2, complex.dOrbital.delta_g))
        drawEP(dX2, orbLineW, deltaY, Math.max(0, complex.dOrbital.delta_g - 2))

        // Δ strelkalari
        const arX = diagX + 260
        page.drawLine({ start: { x: arX, y: sigmaY }, end: { x: arX, y: piY }, thickness: 1.5, color: C.red })
        page.drawText(`Δ₂ = ${complex.dOrbital.delta2_cm.toLocaleString()} cm⁻¹`, {
          x: arX + 6, y: (sigmaY + piY) / 2 - 3, size: 8, font: boldFont, color: C.red
        })
        page.drawLine({ start: { x: arX, y: piY }, end: { x: arX, y: deltaY }, thickness: 1.5, color: C.orangeDeep })
        page.drawText(`Δ₁ = ${complex.dOrbital.delta1_cm.toLocaleString()} cm⁻¹`, {
          x: arX + 6, y: (piY + deltaY) / 2 - 3, size: 8, font: boldFont, color: C.orangeDeep
        })

        y = deltaY - 40

        // Info paneli
        page.drawRectangle({
          x: MARGIN, y: y - 55, width: CONTENT_W, height: 50,
          color: C.bgYellow, borderColor: C.brown, borderWidth: 0.5
        })
        safeText(`Elektron konfiguratsiya:  (δg)${dgSub} (πg)${pgSub} (σg*)${sgSub}  —  d¹⁰ to'liq to'ldirilgan`, {
          x: MARGIN + 8, y: y - 18, size: 9.5,
          font: boldFont, color: C.brown, maxWidth: CONTENT_W - 16
        })
        safeText(`CFSE = 0 (barcha 5 orbital juftlangan)  •  Spin: S = 0  •  ${complex.magneticMoment}  •  Ligand maydoni: ${complex.ligand.classification}`, {
          x: MARGIN + 8, y: y - 33, size: 8.5,
          font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 16
        })
        safeText(`Barqarorlik: ${cleanText(complex.stabilitySource)}`, {
          x: MARGIN + 8, y: y - 47, size: 8.5,
          font: italicFont, color: C.textMuted, maxWidth: CONTENT_W - 16
        })
        y -= 65

        const caption =
          `2-rasm. ${cleanText(complex.formula)} uchun chiziqli (D∞h) d-orbital ajralish diagrammasi. ` +
          `Ligandlar z o'qi bo'ylab joylashib faqat dz² (σg*) bilan σ-antibog' ta'siriga kirishadi va bu orbital eng yuqoriga chiqadi. ` +
          `Perpendikulyar dxz/dyz (πg) va tekislikdagi dxy/dx²-y² (δg) bog'lanmagan holatda qoladi. ` +
          `d¹⁰ konfiguratsiyada 10 ta elektron 5 ta orbitalning barchasini to'liq to'ldiradi — CFSE = 0.`
        const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
        capLines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN, y: y - i * 11, size: 8.5,
            font: italicFont, color: C.purpleSoft
          })
        })
        y -= capLines.length * 11 + 18
      }

      // ═══ 6. MO DIAGRAMMA ═══
      if (pdfSections.mo) {
        drawSectionHeader(sectionNum++, "Molekulyar Orbital (MO) Diagramma")
        checkPageBreak(200)
        const moX = MARGIN + 30
        const moLevels = [
          { label: "σu* (antibog'lovchi — bo'sh)", fill: 0, color: C.red },
          { label: "σg* (dz² — yuqori antibog')", fill: complex.dOrbital.sigma_g_star, color: C.red },
          { label: "πg (dxz, dyz) — bog'lanmagan", fill: complex.dOrbital.pi_g, color: C.orange },
          { label: "δg (dxy, dx²-y²) — bog'lanmagan", fill: complex.dOrbital.delta_g, color: C.cyan },
          { label: "σg (bog'lovchi — ligand SALC)", fill: 4, color: C.green },
          { label: "σu (bog'lovchi — ligand SALC)", fill: 2, color: C.green }
        ]
        const lineW = 60
        moLevels.forEach((lvl, i) => {
          const ly = y - 15 - i * 25
          page.drawLine({
            start: { x: moX, y: ly }, end: { x: moX + lineW, y: ly },
            thickness: 2, color: lvl.color
          })
          safeText(lvl.label, {
            x: moX + lineW + 12, y: ly - 3, size: 8.5,
            font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - (moX + lineW + 12 - MARGIN) - 5
          })
          if (lvl.fill > 0) {
            const shown = Math.min(lvl.fill, 6)
            const totalW = shown * 6
            let ex = moX + (lineW - totalW) / 2
            for (let k = 0; k < shown; k++) {
              page.drawText(k % 2 === 0 ? "↑" : "↓", {
                x: ex, y: ly - 2, size: 11,
                font: boldFont, color: C.orange
              })
              ex += 6
            }
          }
        })
        y -= 15 + moLevels.length * 25 + 10

        const caption =
          `3-rasm. ${cleanText(complex.formula)} ning MO diagrammasi (D∞h). ` +
          `Ikki ligand σ-donor SALC (Symmetry Adapted Linear Combination) hosil qiladi: σg va σu simmetriyali. ` +
          `Metall dz² (σg simmetriya) ligand σg SALC bilan σg (bog'lovchi) va σg* (antibog') ni hosil qiladi. ` +
          `d¹⁰ konfiguratsiya barcha bog'lovchi va bog'lanmagan orbitallarni to'liq to'ldiradi (Orgel, 1958).`
        const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
        capLines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN, y: y - i * 11, size: 8.5,
            font: italicFont, color: C.purpleSoft
          })
        })
        y -= capLines.length * 11 + 18
      }

      // ═══ 7. SPEKTROSKOPIK + IR GRAFIK ═══
      if (pdfSections.spectra) {
        drawSectionHeader(sectionNum++, "Spektroskopik Ma'lumotlar")
        const spec = complex.spectroscopy
        const specData = [
          ["UV-Vis (d–d o'tish)", "Yo'q (d¹⁰ — ichki o'tish mavjud emas)"],
          ["UV-Vis (LMCT)", spec.uvVis],
          ["IR spektri", spec.ir],
          ["Raman spektri", spec.raman],
          ["NMR ma'lumotlari", spec.nmr],
          ["X-ray kristallografiya", spec.xray]
        ]
        specData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.green)
        })
        y -= 12

        // ═══ IR GRAFIK (Lorentzian) ═══
        checkPageBreak(200)
        safeText("IR Spektr (simulyatsiya, 250–700 cm⁻¹ oralig'i)", {
          x: MARGIN, y, size: 10, font: boldFont,
          color: C.greenDark, maxWidth: CONTENT_W
        })
        y -= 15

        const gLeftPad = 32, gTopPad = 30
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 105
        const gY = y - gH - gTopPad
        const xMin = 250, xMax = 700

        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(0.98, 1.0, 0.99),
          borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 0.5
        })
        for (let tick = 0; tick <= 100; tick += 25) {
          const ty = gY + (tick / 100) * gH
          if (tick > 0 && tick < 100) {
            page.drawLine({
              start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
              thickness: 0.2, color: rgb(0.85, 0.92, 0.88)
            })
          }
          const label = `${tick}`
          const lw = measure(label, regularFont, 6.5)
          page.drawText(label, {
            x: gX - lw - 4, y: ty - 2.5, size: 6.5,
            font: regularFont, color: rgb(0.4, 0.5, 0.45)
          })
        }
        const xTicks = [300, 400, 500, 600, 700]
        xTicks.forEach(wn => {
          const tx = gX + ((wn - xMin) / (xMax - xMin)) * gW
          page.drawLine({
            start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
            thickness: 0.2, color: rgb(0.85, 0.92, 0.88)
          })
          const label = `${wn}`
          const lw = measure(label, regularFont, 6.5)
          page.drawText(label, {
            x: tx - lw / 2, y: gY - 10, size: 6.5,
            font: regularFont, color: rgb(0.4, 0.5, 0.45)
          })
        })

        // Cho'qqilar (har kompleks uchun)
        let irPeaks
        if (currentComplex === "AgNH3") {
          irPeaks = [
            { wn: 320, rel: 0.35, label: "δ(HNH)" },
            { wn: 380, rel: 0.55, label: "νs(Ag–N₂)" },
            { wn: 494, rel: 0.90, label: "ν(Ag–N)" }
          ]
        } else if (currentComplex === "AuCl2") {
          irPeaks = [
            { wn: 329, rel: 0.75, label: "νs(Au–Cl)" },
            { wn: 350, rel: 0.90, label: "νas(Au–Cl)" },
            { wn: 480, rel: 0.30, label: "δ(Cl–Au–Cl)" }
          ]
        } else if (currentComplex === "HgCN2") {
          irPeaks = [
            { wn: 276, rel: 0.50, label: "νs(Hg–C₂)" },
            { wn: 412, rel: 0.85, label: "ν(Hg–C)" },
            { wn: 580, rel: 0.35, label: "δ(C–Hg–C)" }
          ]
        } else {
          irPeaks = [
            { wn: 300, rel: 0.60, label: "νs(Cu–Cl₂)" },
            { wn: 405, rel: 0.90, label: "ν(Cu–Cl)" },
            { wn: 520, rel: 0.30, label: "δ(Cl–Cu–Cl)" }
          ]
        }

        const totalPoints = 200
        const transmittance = new Array(totalPoints).fill(1.0)
        irPeaks.forEach(peak => {
          const sigma = 8
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.rel * Math.exp(-Math.pow(wn_i - peak.wn, 2) / (2 * sigma * sigma))
            transmittance[i] = Math.max(transmittance[i] - absorption, 0.0)
          }
        })
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((wn0 - xMin) / (xMax - xMin)) * gW
          const x1 = gX + ((wn1 - xMin) / (xMax - xMin)) * gW
          const y0 = gY + gH - transmittance[i] * (gH - 4) - 2
          const y1 = gY + gH - transmittance[i + 1] * (gH - 4) - 2
          page.drawLine({
            start: { x: x0, y: y0 }, end: { x: x1, y: y1 },
            thickness: 0.9, color: C.greenDark
          })
        }
        irPeaks.forEach((peak, idx) => {
          const px = gX + ((peak.wn - xMin) / (xMax - xMin)) * gW
          const peakT = Math.max(0, 1 - peak.rel)
          const py = gY + gH - peakT * (gH - 4) - 2
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: 0.4, color: C.red
          })
          const wnStr = `${peak.wn}`
          const wnW = measure(wnStr, boldFont, 7)
          page.drawText(wnStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2)),
            y: gY + gH + 4, size: 7, font: boldFont, color: C.red
          })
          const lblStr = peak.label
          const lblW = measure(lblStr, regularFont, 6.5)
          const lblY = gY + gH + 14 + (idx % 2) * 8
          page.drawText(lblStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - lblW - 2, px - lblW / 2)),
            y: lblY, size: 6.5, font: regularFont, color: rgb(0.5, 0.3, 0.3)
          })
        })
        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 8)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY - 22, size: 8,
          font: italicFont, color: C.greenDark
        })
        page.drawText("T%", {
          x: gX - 22, y: gY + gH / 2 - 3, size: 8,
          font: italicFont, color: C.greenDark
        })

        y = gY - 34
        const irCaption =
          `4-rasm. ${cleanText(complex.formula)} uchun bashorat qilingan IR transmittance spektri (250–700 cm⁻¹). ` +
          `Lorentzian shakl funksiyasi asosida simulyatsiya (σ = 8 cm⁻¹). Qizil vertikal chiziqlar tebranish modlari o'rnini ko'rsatadi.`
        const irCapLines = wrapText(cleanText(irCaption), italicFont, 8.5, CONTENT_W)
        irCapLines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN, y: y - i * 11, size: 8.5,
            font: italicFont, color: C.purpleSoft
          })
        })
        y -= irCapLines.length * 11 + 18
      }

      // ═══ 8. TERMODINAMIKA ═══
      if (pdfSections.thermodynamics) {
        drawSectionHeader(sectionNum++, "Termodinamik Ma'lumotlar (298 K)")
        const t = complex.thermodynamics
        const thermData = [
          ["log K₁ (birinchi bosqich)", t.logK1],
          ["log K₂ (ikkinchi bosqich)", t.logK2],
          ["log β₂ (jami barqarorlik)", t.logBeta2],
          ["ΔH (entalpiya)", t.deltaH],
          ["ΔS (entropiya)", t.deltaS],
          ["ΔG (Gibbs erkin energiyasi)", t.deltaG],
          ["Barqarorlik xarakteri", parseFloat(t.logBeta2) > 10 ? "Juda barqaror (log β₂ > 10)" : "Barqaror"],
          ["Termodinamik xulosa", "Spontan reaksiya (ΔG < 0)"]
        ]
        thermData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgCyan : C.white, C.cyan)
        })
        y -= 15
      }

      // ═══ 9. KMBE ═══
      if (pdfSections.crystalField) {
        drawSectionHeader(sectionNum++, "Kristall Maydon Barqarorlashuv Energiyasi (KMBE)")
        const dgVal = complex.dOrbital.delta_g
        const pgVal = complex.dOrbital.pi_g
        const sgVal = complex.dOrbital.sigma_g_star
        const cfse = (-0.4 * dgVal + -0.1 * pgVal + 0.5 * sgVal)
        const d1 = complex.dOrbital.delta1_cm
        const cfData = [
          ["Ligand tipi", complex.ligand.classification],
          ["Ligand maydon kuchi", complex.ligand.type === "CN" ? "Juda kuchli (spektroximik qatorda yuqori)" : complex.ligand.type === "NH3" ? "O'rta (aromatik amin)" : "O'rtacha (halid)"],
          ["Δ₁ (δg → πg)", `${complex.dOrbital.delta1_cm.toLocaleString()} cm⁻¹`],
          ["Δ₂ (πg → σg*)", `${complex.dOrbital.delta2_cm.toLocaleString()} cm⁻¹`],
          ["Elektron konfiguratsiya", `(δg)${dgSub} (πg)${pgSub} (σg*)${sgSub}`],
          ["KMBE (barotsentr atrofida)", `${cfse.toFixed(2)} Δ₁`],
          ["KMBE (energiya birligida)", `${(cfse * d1 * 0.012).toFixed(1)} kJ/mol`],
          ["Juftlashuv energiyasi (P)", "Ahamiyatsiz (d¹⁰ — barcha juftlangan)"],
          ["Bashorat qilingan spin", "S = 0 (past-spin — yagona holat)"],
          ["Magnit moment (teor.)", "0.00 μB (diamagnit)"],
          ["Barqarorlik manbai", cleanText(complex.stabilitySource)]
        ]
        cfData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.brown)
        })
        y -= 15
      }

      // ═══ 10. REAKSIYALAR ═══
      if (pdfSections.reactivity) {
        drawSectionHeader(sectionNum++, "Kimyoviy Reaktsiyalar")
        checkPageBreak(30)
        safeText("Asosiy reaksiyalar:", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.blue, maxWidth: CONTENT_W
        })
        y -= 15
        drawBulletList(complex.reactivity, C.blue)
        y -= 10
      }

      // ═══ 11. QO'LLANILISH ═══
      if (pdfSections.applications) {
        drawSectionHeader(sectionNum++, "Qo'llanilish Sohalari")
        checkPageBreak(30)
        safeText("Amaliy foydalanish:", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.green, maxWidth: CONTENT_W
        })
        y -= 15
        drawBulletList(complex.applications, C.green)
        y -= 5

        checkPageBreak(30)
        safeText("Tarixiy sharh:", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.orangeDeep, maxWidth: CONTENT_W
        })
        y -= 15
        const historyLines = wrapText(cleanText(complex.history), regularFont, 9, CONTENT_W)
        historyLines.forEach((line, i) => {
          checkPageBreak(12)
          page.drawText(line, {
            x: MARGIN, y: y - i * 12, size: 9,
            font: regularFont, color: C.textDark
          })
        })
        y -= historyLines.length * 12 + 15
      }

      // ═══ 12. ADABIYOTLAR (18 ta) ═══
      if (pdfSections.references) {
        drawSectionHeader(sectionNum++, "Foydalanilgan Adabiyotlar")
        const refs = [
          "1. Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für anorganische Chemie, 3, 267–330. [Koordinatsion nazariya]",
          "2. Tollens, B. (1882). Ueber ammoniakalische Silberlösung als Reagens auf Aldehyde. Berichte der deutschen chemischen Gesellschaft, 15(2), 1635–1639.",
          "3. Frankland, E. (1861). On the isolation of the organic radicals. Proceedings of the Royal Society of London, 11, 62–66.",
          "4. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience, ISBN 0-471-19957-5.",
          "5. Housecroft, C. E.; Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson, ISBN 978-1292134147.",
          "6. Miessler, G. L.; Fischer, P. J.; Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson, ISBN 978-0321811059.",
          "7. Pyykkö, P. (1988). Relativistic effects in structural chemistry. Chemical Reviews, 88(3), 563–594.",
          "8. Pyykkö, P.; Desclaux, J. P. (1979). Relativity and the periodic system of elements. Accounts of Chemical Research, 12(8), 276–281.",
          "9. Pyykkö, P. (2004). Theoretical chemistry of gold. Angewandte Chemie International Edition, 43(34), 4412–4456.",
          "10. Orgel, L. E. (1958). Stereochemistry of metals of the B sub-groups. Journal of the Chemical Society, 4186–4190.",
          "11. Ballhausen, C. J. (1962). Introduction to Ligand Field Theory. McGraw-Hill.",
          "12. Gillespie, R. J.; Nyholm, R. S. (1957). Inorganic stereochemistry. Quarterly Reviews of the Chemical Society, 11(4), 339–380.",
          "13. Kaltsoyannis, N. (1997). Relativistic effects in inorganic and organometallic chemistry. J. Chem. Soc., Dalton Trans., 1–11.",
          "14. Mingos, D. M. P. (2001). Essential Trends in Inorganic Chemistry, Oxford University Press.",
          "15. Nyholm, R. S. (1961). Electron configuration and structure of transition-metal complexes. Proc. Chem. Soc., 273–298.",
          "16. IUPAC. (2005). Nomenclature of Inorganic Chemistry: Recommendations 2005 (Red Book). RSC Publishing.",
          "17. Crabtree, R. H. (2019). The Organometallic Chemistry of the Transition Metals, 7th ed. Wiley.",
          "18. Pearson, R. G. (1963). Hard and soft acids and bases. Journal of the American Chemical Society, 85(22), 3533–3539."
        ]
        refs.forEach(ref => {
          const refLines = wrapText(cleanText(ref), regularFont, 8.5, CONTENT_W - 10)
          checkPageBreak(refLines.length * 11 + 6)
          refLines.forEach((line, i) => {
            page.drawText(line, {
              x: i === 0 ? MARGIN : MARGIN + 12,
              y: y - i * 11, size: 8.5,
              font: regularFont, color: C.textDark
            })
          })
          y -= refLines.length * 11 + 5
        })
        y -= 10
      }

      addFooter()

      pdfDoc.setTitle(`${cleanText(complex.formula)} — Struktur Tahlili`)
      pdfDoc.setSubject(complex.name)
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab — Chiziqli PRO v3.0")
      pdfDoc.setKeywords([
        complex.geometry, complex.symmetry, "koordinatsion kimyo",
        "d10", "inert juft", "relativistik", "IUPAC", "chiziqli",
        "Werner", "Tollens", "Pyykko"
      ])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // IQTIBOS GENERATSIYASI
  // ═══════════════════════════════════════════════════════════════════════════
  const getCitation = () => {
    const year = new Date().getFullYear()
    const accessDate = new Date().toLocaleDateString("en-GB")
    if (citationFormat === "apa") {
      return `JDA-Kimyo Research Bulletin. (${year}). Structural analysis of ${complex.formula}: ${complex.name}. Interactive 3D Molecular Modeling Platform. Retrieved ${accessDate}, from https://jda-kimyo.uz/oquv/fazoviy/chiziqli/3d`
    }
    if (citationFormat === "mla") {
      return `"Structural Analysis of ${complex.formula}: ${complex.name}." JDA-Kimyo Research Bulletin, ${year}, Interactive 3D Molecular Modeling Platform, https://jda-kimyo.uz/oquv/fazoviy/chiziqli/3d. Accessed ${accessDate}.`
    }
    if (citationFormat === "bibtex") {
      return `@misc{${complex.id.toLowerCase()}${year},\n  title  = {Structural Analysis of ${complex.formula}: ${complex.name}},\n  author = {{JDA-Kimyo Research Bulletin}},\n  year   = {${year}},\n  note   = {Interactive 3D Molecular Modeling Platform},\n  url    = {https://jda-kimyo.uz/oquv/fazoviy/chiziqli/3d},\n  urldate = {${accessDate}}\n}`
    }
    if (citationFormat === "chicago") {
      return `JDA-Kimyo Research Bulletin. "Structural Analysis of ${complex.formula}: ${complex.name}." Interactive 3D Molecular Modeling Platform. ${year}. Accessed ${accessDate}. https://jda-kimyo.uz/oquv/fazoviy/chiziqli/3d.`
    }
    return ""
  }

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation())
      .then(() => alert("📋 Iqtibos nusxalandi!"))
      .catch(() => alert("Nusxalashda xato"))
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KONFIGURATSIYANI EKSPORT/IMPORT
  // ═══════════════════════════════════════════════════════════════════════════
  const exportConfig = () => {
    const config = {
      version: "3.0",
      timestamp: new Date().toISOString(),
      complex: currentComplex,
      view: { viewMode, showLabels, showBondLengths, showOuterSphere, sliceView, autoRotate },
      ensemble: { moleculeCount, ensembleMode },
      conditions: {
        showTemperature, temperature, showPressure, pressure,
        showPH, phLevel, showSolvation, solventType, solvationDensity,
        showHydrogenBonds, showRedox, oxidationState
      },
      scientific: {
        showCrystalField, ligandFieldStrength,
        showSymmetry, symmetryElement,
        showVibration, vibrationMode
      }
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${complex.id}_config_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER — BOSHQARUV PANELI MAZMUNI (desktop + mobile umumiy)
  // ═══════════════════════════════════════════════════════════════════════════
  const panelContent = (
    <>
      {/* KOMPLEKS TANLASH */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
        <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">⚗️ Kompleks tanlash</h4>
        <div className="space-y-1">
          {Object.values(COMPLEXES).map(c => (
            <button
              key={c.id}
              onClick={() => setCurrentComplex(c.id)}
              className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-all ${currentComplex === c.id ? "bg-yellow-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
            >
              <div className="font-bold">{c.formula}</div>
              <div className="text-[9px] opacity-80 truncate">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MOLEKULALAR SONI */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
        <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">🧬 Molekulalar</h4>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {[1, 8, 27].map(n => (
            <button
              key={n}
              onClick={() => setMoleculeCount(n)}
              className={`p-1.5 rounded text-xs font-bold transition-all ${moleculeCount === n ? "bg-yellow-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
            >
              {n}
            </button>
          ))}
        </div>
        {moleculeCount > 1 && (
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setEnsembleMode("crystal")}
              className={`p-1 rounded text-[10px] transition-all ${ensembleMode === "crystal" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"}`}
            >
              🔷 Kristall
            </button>
            <button
              onClick={() => setEnsembleMode("solution")}
              className={`p-1 rounded text-[10px] transition-all ${ensembleMode === "solution" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"}`}
            >
              💧 Eritma
            </button>
          </div>
        )}
      </div>

      {/* d¹⁰ MA'LUMOT KARTOCHKASI */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/30 rounded-lg p-2 border border-purple-600/30 mb-2">
        <h4 className="text-[10px] text-purple-400 uppercase mb-1 font-bold">⚛️ d¹⁰ Konfiguratsiya</h4>
        <div className="text-[10px] text-purple-200 space-y-0.5">
          <div>• {complex.dConfig} — to&apos;liq to&apos;ldirilgan</div>
          <div>• CFSE = 0 (ajralish ahamiyatsiz)</div>
          <div>• {complex.magnetism} (S = 0)</div>
          <div>• {complex.center.element === "Ag" || complex.center.element === "Cu" ? "sp gibridlanish" : "6s² inert juft"}</div>
        </div>
      </div>

      {/* KO'RINISH */}
      <SectionHeader
        label="🎨 Ko'rinish"
        isOpen={expandedSection === "view"}
        onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
      />
      {expandedSection === "view" && (
        <div className="space-y-2 mb-2 pl-1">
          <div>
            <label className="text-[10px] text-purple-400 uppercase block mb-1">Rejim</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "ball-stick", label: "🔗", title: "Ball-stick" },
                { id: "space-filling", label: "⚪", title: "To'la" },
                { id: "wireframe", label: "🕸️", title: "Karkas" }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`p-1.5 rounded text-sm transition-all ${viewMode === mode.id ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-400 hover:bg-purple-800"}`}
                  title={mode.title}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <ToggleRow label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
          <ToggleRow label="📏 Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
          {complex.outerIon && <ToggleRow label="🌐 Tashqi sfera" value={showOuterSphere} onChange={setShowOuterSphere} />}
          <ToggleRow label="✂️ Kesim ko'rinishi" value={sliceView} onChange={setSliceView} />
          <ToggleRow
            label="📐 Burchak o'lchash"
            value={angleMeasureMode}
            onChange={(v) => {
              setAngleMeasureMode(v)
              if (v) { setDistanceMeasureMode(false); setSelectedForDistance([]); setMeasuredDistance(null) }
              if (!v) { setSelectedLigands([]); setMeasuredAngle(null) }
            }}
          />
          <ToggleRow
            label="📏 Masofa o'lchash"
            value={distanceMeasureMode}
            onChange={(v) => {
              setDistanceMeasureMode(v)
              if (v) { setAngleMeasureMode(false); setSelectedLigands([]); setMeasuredAngle(null) }
              if (!v) { setSelectedForDistance([]); setMeasuredDistance(null) }
            }}
          />
          <button
            onClick={() => togglePanel("dorbital")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${activePanel === "dorbital" ? "bg-purple-600 text-white" : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"}`}
          >
            <span>⚛️ d-orbital diagramma</span>
            <span>{activePanel === "dorbital" ? "✕" : "▸"}</span>
          </button>
        </div>
      )}

      {/* SHAROITLAR */}
      <SectionHeader
        label="🧪 Sharoit / muhit"
        isOpen={expandedSection === "conditions"}
        onClick={() => setExpandedSection(expandedSection === "conditions" ? null : "conditions")}
      />
      {expandedSection === "conditions" && (
        <div className="space-y-2 mb-2 pl-1">
          <ToggleRow
            label="🔄 Ligand almashinuv"
            value={showLigandExchange}
            onChange={(v) => {
              setShowLigandExchange(v)
              if (!v) {
                setIsExchangePlaying(false)
                setExchangeProgress(0)
                animationStateRef.current.exchangeProgress = 0
              }
            }}
          />
          {showLigandExchange && (
            <div className="ml-2 mt-1 space-y-1 bg-purple-900/30 p-2 rounded">
              <select
                value={exchangeTarget}
                onChange={(e) => {
                  setExchangeTarget(e.target.value)
                  setExchangeProgress(0)
                  animationStateRef.current.exchangeProgress = 0
                  setIsExchangePlaying(false)
                }}
                className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
              >
                {complex.ligand.type !== "H2O" && <option value="H2O">→ H₂O</option>}
                {complex.ligand.type !== "Cl" && <option value="Cl">→ Cl⁻</option>}
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (exchangeProgress >= 1) {
                      animationStateRef.current.exchangeProgress = 0
                      setExchangeProgress(0)
                    }
                    setIsExchangePlaying(!isExchangePlaying)
                  }}
                  className="text-xs bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded"
                >
                  {isExchangePlaying ? "⏸️" : (exchangeProgress >= 1 ? "🔁" : "▶️")}
                </button>
                <button
                  onClick={() => {
                    animationStateRef.current.exchangeProgress = 0
                    setExchangeProgress(0)
                    setIsExchangePlaying(false)
                  }}
                  className="text-xs bg-purple-900 hover:bg-purple-800 px-2 py-1 rounded"
                  title="Reset"
                >
                  ↺
                </button>
                <div className="flex-1 h-1.5 bg-purple-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                    style={{ width: `${exchangeProgress * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-[9px] text-purple-400">
                {Math.round(exchangeProgress * 100)}% • {exchangeProgress === 0 ? "Boshlash" : exchangeProgress < 0.4 ? "Uzilish" : exchangeProgress < 0.6 ? "O'tish" : exchangeProgress < 1 ? "Bog'lanish" : "Yakunlandi"}
              </div>
            </div>
          )}
          <ToggleRow label="💧 Erituvchi qobig'i" value={showSolvation} onChange={setShowSolvation} />
          {showSolvation && (
            <div className="ml-2 mt-1 space-y-1 bg-purple-900/30 p-2 rounded">
              <select
                value={solventType}
                onChange={(e) => setSolventType(e.target.value)}
                className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
              >
                <option value="water">Suv (H₂O)</option>
                <option value="ethanol">Etanol</option>
              </select>
              <div>
                <label className="text-[9px] text-purple-400">Zichlik: {solvationDensity}</label>
                <input
                  type="range" min="5" max="40" step="5"
                  value={solvationDensity}
                  onChange={(e) => setSolvationDensity(Number(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              <ToggleRow label="H-bog'lar" value={showHydrogenBonds} onChange={setShowHydrogenBonds} />
            </div>
          )}
          <ToggleRow label="🌡️ Temperatura" value={showTemperature} onChange={setShowTemperature} />
          {showTemperature && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <input
                type="range" min="100" max="800" step="10"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1"
              />
              <div className="text-[9px] text-purple-400 mt-1 flex justify-between">
                <span>{temperature} K</span>
                <span>{(temperature - 273).toFixed(0)}°C</span>
              </div>
            </div>
          )}
          <ToggleRow label="📊 Bosim" value={showPressure} onChange={setShowPressure} />
          {showPressure && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <input
                type="range" min="1" max="50000" step="500"
                value={pressure}
                onChange={(e) => setPressure(Number(e.target.value))}
                className="w-full h-1"
              />
              <div className="text-[9px] text-purple-400 mt-1">{pressure.toLocaleString()} atm</div>
            </div>
          )}
          <ToggleRow label="⚗️ pH muhit" value={showPH} onChange={setShowPH} />
          {showPH && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <input
                type="range" min="0" max="14" step="0.5"
                value={phLevel}
                onChange={(e) => setPHLevel(Number(e.target.value))}
                className="w-full h-1"
              />
              <div className="text-[9px] text-purple-400 mt-1 flex justify-between">
                <span>pH = {phLevel}</span>
                <span>{phLevel < 7 ? "🔴 Kislotali" : phLevel > 7 ? "🔵 Ishqoriy" : "⚪ Neytral"}</span>
              </div>
            </div>
          )}
          <ToggleRow label="⚡ Redoks" value={showRedox} onChange={setShowRedox} />
          {showRedox && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <div className="text-[10px] text-purple-300 mb-1">Oksidlanish darajasi:</div>
              <div className="grid grid-cols-3 gap-1">
                {[0, 1, 2, 3].map(ox => (
                  <button
                    key={ox}
                    onClick={() => setOxidationState(ox)}
                    className={`p-1 rounded text-xs ${oxidationState === ox ? "bg-purple-600 text-white" : "bg-purple-900/50"}`}
                  >
                    +{ox}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ILMIY TAHLIL */}
      <SectionHeader
        label="🔬 Ilmiy tahlil"
        isOpen={expandedSection === "scientific"}
        onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
      />
      {expandedSection === "scientific" && (
        <div className="space-y-2 pl-1">
          <ToggleRow label="📐 Simmetriya elementlari" value={showSymmetry} onChange={setShowSymmetry} />
          {showSymmetry && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <select
                value={symmetryElement}
                onChange={(e) => setSymmetryElement(e.target.value)}
                className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
              >
                <option value="Cinf">C∞ — asosiy o&apos;q</option>
                <option value="C2">C₂ — perpendikulyar o&apos;qlar</option>
                <option value="sigma_h">σh — gorizontal tekislik</option>
                <option value="sigma_v">σv — vertikal tekisliklar</option>
                <option value="inversion">i — inversiya markazi</option>
              </select>
              <div className="text-[9px] text-purple-400 mt-1">D∞h: C∞, ∞C₂, σh, ∞σv, i, S∞</div>
            </div>
          )}
          <ToggleRow label="🎵 Tebranish modlari" value={showVibration} onChange={setShowVibration} />
          {showVibration && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: "sym_stretch", label: "ν₁ Sim." },
                  { id: "asym_stretch", label: "ν₃ Asim." },
                  { id: "bend", label: "ν₂ Egil." }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setVibrationMode(m.id)}
                    className={`p-1 rounded text-[9px] ${vibrationMode === m.id ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => togglePanel("spectra")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${activePanel === "spectra" ? "bg-cyan-600 text-white" : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"}`}
          >
            <span>📡 Spektroskopiya</span>
            <span>{activePanel === "spectra" ? "✕" : "▸"}</span>
          </button>
          <ToggleRow label="💎 Kristall maydon" value={showCrystalField} onChange={setShowCrystalField} />
          {showCrystalField && (
            <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
              <select
                value={ligandFieldStrength}
                onChange={(e) => setLigandFieldStrength(e.target.value)}
                className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
              >
                <option value="weak">Kuchsiz (I⁻, Br⁻)</option>
                <option value="medium">O&apos;rta (H₂O, NH₃)</option>
                <option value="strong">Kuchli (CN⁻, CO)</option>
              </select>
            </div>
          )}
          <button
            onClick={() => togglePanel("mo")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${activePanel === "mo" ? "bg-pink-600 text-white" : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"}`}
          >
            <span>🌈 MO diagramma</span>
            <span>{activePanel === "mo" ? "✕" : "▸"}</span>
          </button>
          <button
            onClick={() => togglePanel("thermo")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${activePanel === "thermo" ? "bg-blue-600 text-white" : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"}`}
          >
            <span>♨️ Termodinamika</span>
            <span>{activePanel === "thermo" ? "✕" : "▸"}</span>
          </button>
          <button
            onClick={() => togglePanel("info")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${activePanel === "info" ? "bg-green-600 text-white" : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"}`}
          >
            <span>📋 Kompleks ma&apos;lumot</span>
            <span>{activePanel === "info" ? "✕" : "▸"}</span>
          </button>
        </div>
      )}
    </>
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // ASOSIY RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">
      {/* HEADER */}
      {!fullscreenMode && (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              href="/oquv/fazoviy/chiziqli"
              className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span>←</span>
              <span className="hidden sm:inline">Orqaga</span>
            </Link>
            <div className="h-8 w-px bg-purple-800 hidden sm:block"></div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-blue-400 flex items-center gap-2 truncate">
                <span>📏</span>
                <span className="hidden sm:inline">Chiziqli — 3D Laboratoriya PRO</span>
                <span className="sm:hidden">Chiziqli 3D PRO</span>
              </h1>
              <p className="text-purple-500 text-[10px] sm:text-xs truncate">
                {complex.formula} • {complex.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <select
              value={currentComplex}
              onChange={(e) => setCurrentComplex(e.target.value)}
              className="bg-purple-900/60 text-white text-xs px-2 py-2 rounded-lg border border-purple-700/50 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[240px] hidden md:block"
            >
              {Object.values(COMPLEXES).map(c => (
                <option key={c.id} value={c.id}>{c.formula}</option>
              ))}
            </select>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-all ${autoRotate ? "bg-purple-600/60 text-white" : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"}`}
              title="Avtomatik aylantirish"
            >
              🔄
            </button>
            <button
              onClick={() => setPdfModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              title="Ilmiy hisobot (PDF)"
            >
              📄
            </button>
            <button
              onClick={() => setCitationModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50 hidden sm:block"
              title="Iqtibos olish"
            >
              📚
            </button>
            <button
              onClick={() => setFullscreenMode(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              title="To'liq ekran"
            >
              🖥️
            </button>
          </div>
        </header>
      )}

      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40"
          title="Fullscreen rejimidan chiqish"
        >
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ═══ ASOSIY SAHA — RESPONSIVE LAYOUT ═══ */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* ═══ Desktop: DRAGGABLE FLOATING PANEL ═══ */}
        {!isMobile && !fullscreenMode && (
          <div
            ref={panelRef}
            className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[280px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? "shadow-purple-500/50 border-purple-500/80 select-none" : ""}`}
            style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
          >
            <div
              onMouseDown={(e) => {
                if (e.button !== 0) return
                e.preventDefault()
                handlePanelDragStart(e.clientX, e.clientY)
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY)
                }
              }}
              className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? "cursor-grabbing bg-purple-800/60" : "cursor-grab bg-purple-900/40 hover:bg-purple-800/50"} transition-colors select-none touch-none`}
              title="Ushlab siljiting"
            >
              <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
                <span className="text-purple-400">⋮⋮</span>
                <span>🎛️</span> Boshqaruv
              </h3>
              <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
            </div>
            <div className="p-3 overflow-y-auto custom-scrollbar flex-1">{panelContent}</div>
          </div>
        )}

        {/* ═══ Mobile: FAB + BOTTOM SHEET ═══ */}
        {isMobile && !fullscreenMode && (
          <>
            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className={`absolute bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center text-2xl transition-all border-2 border-purple-400/30 ${mobilePanelOpen ? "rotate-45 scale-90" : "hover:scale-110"}`}
              title={mobilePanelOpen ? "Yopish" : "Boshqaruv paneli"}
            >
              {mobilePanelOpen ? "✕" : "🎛️"}
            </button>
            {mobilePanelOpen && (
              <div
                className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobilePanelOpen(false)}
              />
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 z-40 bg-purple-950/95 backdrop-blur-xl rounded-t-2xl border-t-2 border-purple-600/50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobilePanelOpen ? "translate-y-0" : "translate-y-full"}`}
              style={{ maxHeight: "75vh" }}
            >
              <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
                <div className="w-12 h-1.5 bg-purple-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-purple-800/50 flex-shrink-0">
                <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                  🎛️ Boshqaruv paneli
                </h3>
                <button
                  onClick={() => setMobilePanelOpen(false)}
                  className="text-purple-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-3 overflow-y-auto custom-scrollbar flex-1">{panelContent}</div>
            </div>
          </>
        )}

        {/* 3D CONTAINER */}
        <div ref={containerRef} className="flex-1 w-full relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-purple-300 text-lg">⚛️ Model yuklanmoqda...</p>
              </div>
            </div>
          )}

          {showTooltip && !loading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-purple-200 z-20 border border-purple-700/50 animate-fade-in max-w-[90%]">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span>🖱️ aylantirish</span>
                <span className="text-purple-700">•</span>
                <span>🔍 zoom</span>
                <span className="text-purple-700">•</span>
                <span>👆 atom — ma&apos;lumot</span>
              </div>
            </div>
          )}

          {angleMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-amber-100 z-25 border border-amber-600/50 max-w-[90%]">
              {selectedLigands.length === 0 && "📐 1-ligandni tanlang (donor atomi)"}
              {selectedLigands.length === 1 && "📐 2-ligandni tanlang..."}
              {selectedLigands.length === 2 && measuredAngle && (
                <span>
                  📐 Burchak: <strong className="text-yellow-300 text-lg">{measuredAngle}°</strong>
                  {" "}
                  {parseFloat(measuredAngle) > 170 ? "(trans — 180°)" : "(cis)"}
                </span>
              )}
            </div>
          )}

          {distanceMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-orange-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-orange-100 z-25 border border-orange-600/50 max-w-[90%]">
              {selectedForDistance.length === 0 && "📏 1-atomni tanlang"}
              {selectedForDistance.length === 1 && "📏 2-atomni tanlang..."}
              {selectedForDistance.length === 2 && measuredDistance && (
                <span>📏 Masofa: <strong className="text-orange-300 text-lg">{measuredDistance} Å</strong></span>
              )}
            </div>
          )}

          {/* TANLANGAN ATOM (eng yuqori prioritet) */}
          {!fullscreenMode && selectedAtom && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs w-[260px] sm:w-[300px] shadow-2xl animate-slide-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30"
                    style={{ backgroundColor: selectedAtom.info.color }}
                  ></div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                    <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAtom(null)}
                  className="text-purple-400 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm max-h-[60vh] overflow-y-auto custom-scrollbar">
                <InfoRow label="Atom massasi" value={selectedAtom.info.mass} mono />
                <InfoRow label="Elektron konfig." value={selectedAtom.info.config} mono small />
                {selectedAtom.info.oxidation && <InfoRow label="Oksidlanish darajasi" value={selectedAtom.info.oxidation} mono small />}
                {selectedAtom.info.charge && <InfoRow label="Zaryad" value={selectedAtom.info.charge} mono />}
                {selectedAtom.info.hybridization && <InfoRow label="Gibridlanish" value={selectedAtom.info.hybridization} mono />}
                {selectedAtom.info.electronegativity && <InfoRow label="Elektronmanfiylik" value={selectedAtom.info.electronegativity} mono small />}
                {selectedAtom.info.radius_atomic && <InfoRow label="Atom radiusi" value={selectedAtom.info.radius_atomic} mono />}
                {selectedAtom.info.radius_ionic && <InfoRow label="Ion radiusi" value={selectedAtom.info.radius_ionic} mono small />}
                {selectedAtom.info.firstIE && <InfoRow label="I ionlanish energiyasi" value={selectedAtom.info.firstIE} mono small />}
                {selectedAtom.info.meltingPoint && <InfoRow label="Erish t." value={selectedAtom.info.meltingPoint} mono small />}
                {selectedAtom.info.role && <InfoRow label="Vazifasi" value={selectedAtom.info.role} small />}
              </div>
            </div>
          )}

          {/* ILMIY PANELLAR */}
          {!fullscreenMode && !selectedAtom && activePanel && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 max-w-sm w-[280px] sm:w-[340px] shadow-2xl animate-slide-in max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-purple-300">
                  {activePanel === "info" && "📋 Kompleks ma'lumotlari"}
                  {activePanel === "dorbital" && "⚛️ d-orbital (D∞h)"}
                  {activePanel === "mo" && "🌈 MO diagramma"}
                  {activePanel === "spectra" && "📡 Spektroskopiya"}
                  {activePanel === "thermo" && "♨️ Termodinamika"}
                </h3>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-purple-400 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>

              {activePanel === "info" && (
                <div className="space-y-2 text-xs">
                  <InfoRow label="Formula (ion)" value={complex.formula} mono />
                  <InfoRow label="To'liq tuz" value={complex.fullSalt} mono small />
                  <InfoRow label="Nomi" value={complex.name} small />
                  <InfoRow label="Geometriya" value={`${complex.geometry} (${complex.symmetry})`} />
                  <InfoRow label="Gibridlanish" value={complex.hybridization} mono small />
                  <InfoRow label="Bog' uzunligi" value={complex.bondLengthReal} mono />
                  <InfoRow label="L–M–L burchak" value="180.0°" mono />
                  <InfoRow label="d-konfiguratsiya" value={complex.dConfig} mono />
                  <InfoRow label="CFSE" value="0 (d¹⁰ to'liq)" mono />
                  <InfoRow label="Magnit xossa" value={complex.magneticMoment} small />
                  <InfoRow label="Ligand" value={complex.ligand.classification} small />
                  <InfoRow label="Rangi" value={complex.color} small />
                  <InfoRow label="Barqarorlik" value={complex.stabilitySource} small />
                  {complex.outerIon && (
                    <InfoRow label="Tashqi sfera" value={`${complex.outerIon.count} × ${complex.outerIon.element}${complex.outerIon.charge}`} mono />
                  )}
                </div>
              )}

              {activePanel === "dorbital" && (
                <div>
                  <div className="space-y-3">
                    {/* σg* (dz²) — eng yuqori */}
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-red-300 font-mono text-[10px]">σg* (dz²)</span>
                      <div className="flex-1 h-1 bg-red-400 rounded relative">
                        {complex.dOrbital.sigma_g_star > 0 && (
                          <div className="absolute -top-2 left-1/2 -translate-x-2 text-yellow-300">↑</div>
                        )}
                        {complex.dOrbital.sigma_g_star > 1 && (
                          <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                        )}
                      </div>
                      <span className="text-[9px] text-purple-500 w-16">antibog&apos;</span>
                    </div>
                    {/* πg (dxz, dyz) */}
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-orange-300 font-mono text-[10px]">πg (dxz,dyz)</span>
                      <div className="flex-1 flex gap-1">
                        {[0, 1].map(i => (
                          <div key={i} className="flex-1 h-1 bg-orange-400 rounded relative">
                            {complex.dOrbital.pi_g > i * 2 && (
                              <div className="absolute -top-2 left-1/2 -translate-x-2 text-yellow-300">↑</div>
                            )}
                            {complex.dOrbital.pi_g > i * 2 + 1 && (
                              <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] text-purple-500 w-16">bog&apos;lanmagan</span>
                    </div>
                    {/* δg (dx²-y², dxy) */}
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-cyan-300 font-mono text-[10px]">δg (dx²-y²,dxy)</span>
                      <div className="flex-1 flex gap-1">
                        {[0, 1].map(i => (
                          <div key={i} className="flex-1 h-1 bg-cyan-400 rounded relative">
                            {complex.dOrbital.delta_g > i * 2 && (
                              <div className="absolute -top-2 left-1/2 -translate-x-2 text-yellow-300">↑</div>
                            )}
                            {complex.dOrbital.delta_g > i * 2 + 1 && (
                              <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] text-purple-500 w-16">bog&apos;lovchi</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-800/50 text-[10px] text-purple-400 space-y-1">
                    <div>Konfiguratsiya: <span className="text-white font-mono">(δg)⁴ (πg)⁴ (σg*)²</span></div>
                    <div>CFSE: <span className="text-white font-mono">0 (d¹⁰ to&apos;liq)</span></div>
                    <div>Spin: <span className="text-white font-mono">S = 0 (Diamagnit)</span></div>
                    <div>Δ₁: <span className="text-white font-mono">{complex.dOrbital.delta1_cm.toLocaleString()} cm⁻¹</span></div>
                    <div>Δ₂: <span className="text-white font-mono">{complex.dOrbital.delta2_cm.toLocaleString()} cm⁻¹</span></div>
                    <div className="text-[9px] text-purple-500 italic mt-2">
                      D∞h: ligandlar z o&apos;qi bo&apos;ylab → faqat dz² (σg*) ular bilan σ-antibog&apos; hosil qiladi.
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "mo" && (
                <div className="space-y-1 text-[10px]">
                  <div className="text-[9px] text-pink-400 italic pb-1">D∞h — L-M-L σ-bog&apos;lanish</div>
                  <div className="flex justify-between bg-red-900/30 px-2 py-1 rounded border border-red-700/30">
                    <span className="text-red-300">σu* (antibog&apos;)</span>
                    <span className="text-white">— (bo&apos;sh)</span>
                  </div>
                  <div className="flex justify-between bg-red-900/30 px-2 py-1 rounded border border-red-700/30">
                    <span className="text-red-300">σg* (dz²)</span>
                    <span className="text-white font-mono">↑↓</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded">
                    <span className="text-orange-300">πg (dxz, dyz)</span>
                    <span className="text-white font-mono">↑↓ ↑↓</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/40 px-2 py-1 rounded">
                    <span className="text-cyan-300">δg (dxy, dx²-y²)</span>
                    <span className="text-white font-mono">↑↓ ↑↓</span>
                  </div>
                  <div className="flex justify-between bg-green-900/30 px-2 py-1 rounded">
                    <span className="text-green-300">σg (bog&apos;lovchi)</span>
                    <span className="text-white font-mono">↑↓ ↑↓</span>
                  </div>
                  <div className="flex justify-between bg-green-900/30 px-2 py-1 rounded">
                    <span className="text-green-300">σu (bog&apos;lovchi)</span>
                    <span className="text-white font-mono">↑↓</span>
                  </div>
                  <div className="border-t border-pink-700/30 mt-2 pt-2 text-pink-200 text-center text-[10px]">
                    {complex.formula} — d¹⁰ konfiguratsiya
                  </div>
                </div>
              )}

              {activePanel === "spectra" && (
                <div>
                  <select
                    value={spectrumType}
                    onChange={(e) => setSpectrumType(e.target.value)}
                    className="w-full text-[10px] bg-purple-800 rounded px-1 py-1 mb-2"
                  >
                    <option value="uv-vis">UV-Vis</option>
                    <option value="ir">IR</option>
                    <option value="nmr">NMR</option>
                    <option value="raman">Raman</option>
                    <option value="xray">X-ray</option>
                  </select>
                  <div className="bg-purple-900/50 rounded p-3">
                    <div className="h-24 bg-gradient-to-r from-purple-900 to-blue-900 rounded flex items-end justify-around p-1">
                      {[...Array(12)].map((_, i) => {
                        let h
                        if (spectrumType === "uv-vis") h = i === 2 ? 60 : Math.exp(-Math.pow((i - 2) / 2, 2)) * 50 + 5
                        else if (spectrumType === "ir") h = i === 4 || i === 8 ? 70 : 12
                        else if (spectrumType === "raman") h = i === 3 || i === 7 ? 65 : 10
                        else h = i === 3 || i === 9 ? 65 : 8
                        return (
                          <div
                            key={i}
                            className="w-2 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        )
                      })}
                    </div>
                    <div className="text-[10px] text-purple-300 mt-2 leading-relaxed">
                      {spectrumType === "uv-vis" && complex.spectroscopy.uvVis}
                      {spectrumType === "ir" && complex.spectroscopy.ir}
                      {spectrumType === "nmr" && complex.spectroscopy.nmr}
                      {spectrumType === "raman" && complex.spectroscopy.raman}
                      {spectrumType === "xray" && complex.spectroscopy.xray}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "thermo" && (
                <div className="space-y-2 text-xs">
                  <InfoRow label="log K₁" value={complex.thermodynamics.logK1} mono />
                  <InfoRow label="log K₂" value={complex.thermodynamics.logK2} mono />
                  <InfoRow label="log β₂ (jami)" value={complex.thermodynamics.logBeta2} mono />
                  <InfoRow label="ΔH (entalpiya)" value={complex.thermodynamics.deltaH} mono small />
                  <InfoRow label="ΔS (entropiya)" value={complex.thermodynamics.deltaS} mono small />
                  <InfoRow label="ΔG (298 K)" value={complex.thermodynamics.deltaG} mono small />
                  <div className="bg-cyan-900/30 border border-cyan-700/30 rounded p-2 text-[10px] text-cyan-200">
                    <div className="font-bold mb-1">Termodinamik xulosa:</div>
                    <div>{parseFloat(complex.thermodynamics.logBeta2) > 10 ? "Juda barqaror kompleks (log β₂ > 10)" : "Barqaror kompleks"}</div>
                    <div className="mt-1 italic text-cyan-300">Spontan reaksiya (ΔG {'<'} 0)</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kristall maydon / Redoks kartochkalari */}
          {(showCrystalField || showRedox) && !loading && !fullscreenMode && (
            <div className="absolute bottom-4 right-3 z-20 space-y-2 w-[240px] sm:w-[280px]">
              {showCrystalField && (
                <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-purple-700/50 shadow-2xl animate-slide-in">
                  <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center justify-between">
                    <span>💎 Kristall maydon (D∞h)</span>
                    <button
                      onClick={() => setShowCrystalField(false)}
                      className="text-purple-500 hover:text-white"
                    >
                      ×
                    </button>
                  </h4>
                  <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
                    <div>Ajralish: <span className="text-white font-mono">δg {'<'} πg {'<'} σg*</span></div>
                    <div>KMBE: <span className="text-white font-mono">0 (d¹⁰)</span></div>
                    <div>Spin: <span className="text-white">S = 0 (Diamagnit)</span></div>
                    <div>Δ₁: <span className="text-white font-mono">{complex.dOrbital.delta1_cm.toLocaleString()} cm⁻¹</span></div>
                    <div className="text-[9px] text-orange-300 italic mt-1 leading-snug">
                      {complex.stabilitySource}
                    </div>
                  </div>
                </div>
              )}
              {showRedox && (
                <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-orange-700/50 shadow-2xl animate-slide-in">
                  <h4 className="text-xs font-bold text-orange-300 mb-2">⚡ Redoks holati</h4>
                  <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
                    <div>{complex.center.element}: <span className="text-white font-bold">+{oxidationState}</span></div>
                    <div>d-elektronlar: <span className="text-white font-mono">d{Math.max(0, complex.dElectrons + (parseInt(complex.center.charge.replace("+", ""), 10) - oxidationState))}</span></div>
                    <div className="text-[10px] text-purple-400 italic leading-snug mt-1">
                      {complex.center.element === "Ag" && (oxidationState === 1 ? "Ag(I) d¹⁰ — barqaror (Tollens)" : oxidationState === 0 ? "Ag(0) — metall (kumush oyna)" : "Kam uchraydigan holat")}
                      {complex.center.element === "Au" && (oxidationState === 1 ? "Au(I) d¹⁰ — relativistik barqaror" : oxidationState === 3 ? "Au(III) d⁸ — kvadrat tekis" : "Boshqa holat")}
                      {complex.center.element === "Hg" && (oxidationState === 2 ? "Hg(II) d¹⁰ — inert juft" : oxidationState === 0 ? "Hg(0) — suyuq metall" : "Boshqa holat")}
                      {complex.center.element === "Cu" && (oxidationState === 1 ? "Cu(I) d¹⁰ — havoda oksidlanadi" : oxidationState === 2 ? "Cu(II) d⁹ — moviy" : "Boshqa holat")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      {!fullscreenMode && (
        <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10 flex-shrink-0">
          <div className="flex justify-center gap-2 sm:gap-5 py-3 px-2 sm:px-6 flex-wrap">
            <Stat label="L–M–L" value="180°" />
            <Stat label="Koord. son" value="2" />
            <Stat label="Gibridlanish" value={complex.hybridization.split(" ")[0]} mono />
            <Stat label="Simmetriya" value={complex.symmetry} mono />
            <Stat label={`${complex.center.element}–${complex.ligand.donor}`} value={complex.bondLengthReal} mono />
            <Stat label="d-konf." value={complex.dConfig.split(" ").pop()} mono />
            <Stat label="Magnit" value={complex.magnetism} />
            <Stat label="Molekula" value={`${moleculeCount}`} mono />
          </div>
          <div className="flex justify-center gap-2 sm:gap-4 py-2 px-3 bg-purple-950/60 border-t border-purple-800/30 flex-wrap">
            <LegendItem color={`#${complex.center.color.toString(16).padStart(6, "0")}`} label={`${complex.center.element} — ${ATOM_INFO[complex.center.element].name.split(" ")[0]}`} />
            <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, "0")}`} label={`${complex.ligand.donor} — donor`} />
            {complex.ligand.type === "NH3" && <LegendItem color="#ffffff" label="H — Vodorod" />}
            {complex.ligand.type === "CN" && <LegendItem color={`#${CPK.N.toString(16).padStart(6, "0")}`} label="N — Azot" />}
            {showOuterSphere && complex.outerIon && (
              <LegendItem color={`#${complex.outerIon.color.toString(16).padStart(6, "0")}`} label={`${complex.outerIon.element}${complex.outerIon.charge}`} />
            )}
            {showSolvation && <LegendItem color={`#${CPK.O.toString(16).padStart(6, "0")}`} label="Erituvchi" />}
          </div>
          <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20">
            <p className="text-[10px] sm:text-xs text-purple-500">
              <span className="font-mono text-purple-300">{complex.fullSalt}</span> • {complex.name} • {complex.geometry} • {complex.magnetism}
            </p>
          </div>
        </div>
      )}

      {/* ═══ PDF MODAL ═══ */}
      {pdfModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !pdfGenerating && setPdfModalOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-purple-950/98 via-indigo-950/98 to-purple-950/98 rounded-2xl border-2 border-purple-500/40 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b-2 border-purple-500/30 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Ilmiy Hisobot
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30 font-mono">
                        v3.0
                      </span>
                    </h2>
                    <p className="text-xs text-purple-300">
                      {cleanText(complex.formula)} • {new Date().toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !pdfGenerating && setPdfModalOpen(false)}
                  disabled={pdfGenerating}
                  className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all disabled:opacity-30 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
                <div className="text-xs text-yellow-400 uppercase tracking-wider mb-3 font-bold">📊 Hisobot statistikasi</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">{Object.values(pdfSections).filter(Boolean).length}</div>
                    <div className="text-xs text-yellow-200/70 mt-0.5">Bo&apos;lim</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">
                      ~{Math.max(3, Math.ceil(Object.values(pdfSections).filter(Boolean).length * 1.2))}
                    </div>
                    <div className="text-xs text-yellow-200/70 mt-0.5">Sahifa</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">A4</div>
                    <div className="text-xs text-yellow-200/70 mt-0.5">Format</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-bold">⚡ Tezkor tanlash</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPdfSections({ snapshot: true, info: true, conditions: true, geometry: true, dorbital: true, mo: false, spectra: false, thermodynamics: false, crystalField: false, reactivity: false, applications: false, references: true })}
                    className="py-2 px-3 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-lg text-xs text-purple-100 font-semibold transition-all"
                  >
                    📄 Standart
                  </button>
                  <button
                    onClick={() => setPdfSections({ snapshot: true, info: true, conditions: true, geometry: true, dorbital: true, mo: true, spectra: true, thermodynamics: true, crystalField: true, reactivity: true, applications: true, references: true })}
                    className="py-2 px-3 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 hover:from-yellow-500/50 hover:to-orange-500/50 border border-yellow-500/40 rounded-lg text-xs text-yellow-100 font-semibold transition-all"
                  >
                    📚 To&apos;liq
                  </button>
                  <button
                    onClick={() => setPdfSections({ snapshot: false, info: false, conditions: false, geometry: false, dorbital: false, mo: false, spectra: false, thermodynamics: false, crystalField: false, reactivity: false, applications: false, references: false })}
                    className="py-2 px-3 bg-red-900/30 hover:bg-red-800/40 border border-red-700/40 rounded-lg text-xs text-red-200 font-semibold transition-all"
                  >
                    ✕ Tozalash
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-3 font-bold">📋 Bo&apos;limlar</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { key: "snapshot", icon: "📸", label: "3D Vizualizatsiya", desc: "Snapshot (1920×1080)" },
                    { key: "info", icon: "📋", label: "Birikma identifikatsiyasi", desc: "17 parametr" },
                    { key: "geometry", icon: "📐", label: "Molekulyar geometriya", desc: "Burchak, VSEPR, D∞h" },
                    { key: "conditions", icon: "🧪", label: "Simulyatsiya shartlari", desc: "T, P, pH, erituvchi" },
                    { key: "dorbital", icon: "⚛️", label: "d-orbital (D∞h)", desc: "δg → πg → σg*" },
                    { key: "mo", icon: "🌈", label: "MO diagramma", desc: "SALC + σ-bog'lanish" },
                    { key: "spectra", icon: "📡", label: "Spektroskopiya + IR", desc: "UV, IR, NMR, Raman, XRD" },
                    { key: "thermodynamics", icon: "♨️", label: "Termodinamika", desc: "log β, ΔH, ΔS, ΔG" },
                    { key: "crystalField", icon: "💎", label: "KMBE", desc: "CFSE = 0 (d¹⁰)" },
                    { key: "reactivity", icon: "⚗️", label: "Reaksiyalar", desc: "Kimyoviy xossalar" },
                    { key: "applications", icon: "🏭", label: "Qo'llanilish + Tarix", desc: "Amaliy sohalar" },
                    { key: "references", icon: "📚", label: "Adabiyotlar", desc: "18 ilmiy manba", highlight: true }
                  ].map(item => (
                    <label
                      key={item.key}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${pdfSections[item.key] ? (item.highlight ? "bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/50" : "bg-gradient-to-br from-purple-700/40 to-indigo-700/30 border-purple-500/50") : "bg-purple-950/30 border-purple-800/30 hover:border-purple-600/40"}`}
                    >
                      <input
                        type="checkbox"
                        checked={pdfSections[item.key]}
                        onChange={(e) => setPdfSections({ ...pdfSections, [item.key]: e.target.checked })}
                        className={`mt-1 w-4 h-4 cursor-pointer flex-shrink-0 ${item.highlight ? "accent-yellow-500" : "accent-purple-500"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold flex items-center gap-2 ${pdfSections[item.key] ? (item.highlight ? "text-yellow-200" : "text-purple-100") : "text-purple-300"}`}>
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <div className={`text-xs mt-0.5 ${pdfSections[item.key] ? "text-purple-200/80" : "text-purple-400/70"}`}>
                          {item.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  disabled={pdfGenerating}
                  className="flex-1 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 font-semibold transition-all border border-purple-700/50 disabled:opacity-40"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating || Object.values(pdfSections).filter(Boolean).length === 0}
                  className="flex-[1.5] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 border border-purple-400/30"
                >
                  {pdfGenerating ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Yaratilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">⬇️</span>
                      <span>Yuklab olish</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-purple-400 text-center font-mono pt-1">
                📁 {cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_{new Date().toISOString().slice(0, 10)}.pdf
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CITATION MODAL ═══ */}
      {citationModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setCitationModalOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-600/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-purple-900/90 backdrop-blur-xl border-b border-purple-600/40 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">📚 Iqtibos olish</h2>
              <button
                onClick={() => setCitationModalOpen(false)}
                className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {["apa", "mla", "bibtex", "chicago"].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase transition-all ${citationFormat === fmt ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-700/30">
                <pre className="text-xs text-purple-200 whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {getCitation()}
                </pre>
              </div>
              <button
                onClick={copyCitation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>Nusxalash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(76, 29, 149, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </main>
  )
}
