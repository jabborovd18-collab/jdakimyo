"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Co: 0xF090A0, Cr: 0x8A99C7, Fe: 0xE06633, Pd: 0x006985,
  Cu: 0xC88033, Pt: 0xD0D0E0, Ni: 0x50D050, Rh: 0x0A7D8C,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  S: 0xFFFF30, Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094,
  P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  cis: 0xFFB800,          // Cis holat — oltin sariq
  trans: 0x00E5FF,        // Trans holat — moviy
  fac: 0xFF66CC,          // Fac (facial) — pushti
  mer: 0x88FF88,          // Mer (meridional) — yashil
  dipole: 0xFF3366,       // Dipol vektori — qizil
  symmetryAxis: 0xAAFF00, // Simmetriya o'qi — sariq-yashil
  dna: 0x00FF88           // DNA — yashil-mint
}

// ═══════════════════════════════════════════════════════════════════════════
// HOLAT (POZITSION / GEOMETRIK) IZOMERLAR DATABASE
// ────────────────────────────────────────────────────────────────────────────
// Bir xil ligandlar va koordinatsion sfera, lekin metall atrofidagi fazoviy
// joylashuvi farq qiladi. cis/trans, fac/mer va boshqa turlar mavjud.
// ═══════════════════════════════════════════════════════════════════════════
const POSITION_ISOMERS = {

  // ───────────────────────────────────────────────────────────────
  // 1. SISPLATIN — KANSER TERAPIYASINING ASOSI
  // cis-[Pt(NH3)2Cl2] — sisplatin (Rosenberg 1965)
  // trans-[Pt(NH3)2Cl2] — transplatin (inaktiv)
  // ───────────────────────────────────────────────────────────────
  Sisplatin: {
    id: "Sisplatin",
    title: "Sisplatin — kanser terapiyasining klassik namunasi",
    shortTitle: "cis / trans [Pt(NH₃)₂Cl₂]",
    isomerType: "cis_trans",
    geometry: "square_planar",
    grossFormula: "[Pt(NH₃)₂Cl₂]",
    formulaA: "cis-[Pt(NH₃)₂Cl₂]",
    formulaB: "trans-[Pt(NH₃)₂Cl₂]",
    nameA: "cis-Diammindixloroplatina(II) — SISPLATIN",
    nameB: "trans-Diammindixloroplatina(II) — TRANSPLATIN",
    // Ligand joylashuvi — kvadrat-planar (4 pozitsiya)
    center: { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar" },
    ligandsA: [
      { pos: 0, type: "NH3", color: CPK.N },   // Kvadrat-planar 4 pozitsiya
      { pos: 1, type: "NH3", color: CPK.N },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 3, type: "Cl", color: CPK.Cl }
    ],
    ligandsB: [
      { pos: 0, type: "NH3", color: CPK.N },
      { pos: 2, type: "NH3", color: CPK.N },  // trans qarama-qarshi
      { pos: 1, type: "Cl", color: CPK.Cl },
      { pos: 3, type: "Cl", color: CPK.Cl }
    ],
    // Xususiyatlari
    colorA: "Sariq-to'q sariq kristallar",
    colorB: "Och sariq (deyarli rangsiz) kristallar",
    dipoleA: "3.42 D (kuchli qutbli) — Pt–Cl bog'lari bir xil tomonga",
    dipoleB: "0.00 D (qutbsiz) — Pt–Cl vektorlari o'zaro yo'q qilinadi",
    symmetryA: "C₂ᵥ (C2v) — aylanish o'qi + 2 tekislik",
    symmetryB: "D₂ₕ (D2h) — markaziy simmetriya markazi bilan",
    solubilityA: "Suvda: 2.53 g/L (25°C). DMSO da yaxshi eriydi.",
    solubilityB: "Suvda: 0.037 g/L (25°C) — sisplatindan 70 marta kam.",
    reactivityA: "Suvda gidroliz: cis-[Pt(NH₃)₂(H₂O)Cl]⁺ va cis-[Pt(NH₃)₂(H₂O)₂]²⁺. Bu — DNA bilan reaksiyaga tayyor faol shakl.",
    reactivityB: "Kinetik jihatdan barqaror, biologik faol emas. DNA bilan bog'lanmaydi — chunki ikki Cl trans holatda.",
    medicalUseA: "KLINIK QO'LLANILISH: testisular kanseri (>95% shifo), tuxumdon, siydik pufagi, o'pka, bo'yin va bosh kanserlari. Yiliga 500,000+ bemor davolanadi.",
    medicalUseB: "Kimyoterapevtik faol emas. Bir necha in vitro tadqiqotlarda maxsus toksik faollik kuzatilgan, ammo klinikaga kirmaydi.",
    dnaBinding: "Sisplatin DNA guanin bazasidagi N7 atomiga bog'lanadi. Ikkita GG (yoki AG) bazalar orasida crosslink hosil qiladi — replikasiya to'xtaydi — hujayra apoptozga uchraydi. Faqat cis shakli mumkin, chunki ikki Cl bir tomonda joylashgan (~3.4 Å masofa — GG bazalar orasidagi masofaga aynan mos).",
    discovery: "Barnett Rosenberg (Michigan State University, 1965) — elektroliz tajribasi paytida platina elektrodlari ta'sirida E. coli bakteriyalari bo'linishi to'xtaganini kuzatdi. Bu — sisplatin kashfiyoti. 1978-yil FDA sisplatinni onkologik dori sifatida tasdiqladi. Rosenberg 2003-yilda kimyo Nobel mukofoti nominantsiyasidan o'tdi.",
    experimentalProof: [
      "Dipol moment o'lchov: cis = 3.42 D (Debye), trans = 0.00 D — klassik ajratish uslubi.",
      "IR spektroskopiya: cis da 2 ta ν(Pt–Cl) chastotasi (325 va 300 sm⁻¹), trans da faqat 1 ta (365 sm⁻¹, simmetrik).",
      "Raman: trans da simmetrik cho'zilish faol, cis da yo'q (simmetriya farqi).",
      "¹⁹⁵Pt NMR: cis ≈ −2100 ppm, trans ≈ −2500 ppm.",
      "X-ray kristallografiya: cis Pt–Cl = 2.32 Å, N–Pt–Cl burchagi = 90°. Trans da 180°.",
      "Kurnakov tiokarbamid testi: cis da 2 ta thiourea molekulasi kirib borsi (Cl chiqib), trans da esa 4 ta — aniq diagnostik.",
      "Erishuvchanlik farqi 70 marta (cis > trans) — sifat analizida sezilarli farq."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: true
  },

  // ───────────────────────────────────────────────────────────────
  // 2. WERNER KLASSIK NAMUNASI — [Co(NH3)4Cl2]+
  // ───────────────────────────────────────────────────────────────
  CoNH3Cl_octa: {
    id: "CoNH3Cl_octa",
    title: "Werner klassik namunasi — [Co(NH₃)₄Cl₂]⁺",
    shortTitle: "cis / trans oktaedr",
    isomerType: "cis_trans",
    geometry: "octahedral_4_2",
    grossFormula: "[Co(NH₃)₄Cl₂]⁺",
    formulaA: "cis-[Co(NH₃)₄Cl₂]⁺ (violeo)",
    formulaB: "trans-[Co(NH₃)₄Cl₂]⁺ (praseo)",
    nameA: "cis-Tetraaminddixlorokobalt(III) — 'violeo' tuzi",
    nameB: "trans-Tetraaminddixlorokobalt(III) — 'praseo' tuzi",
    center: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral" },
    ligandsA: [ // cis — 2 Cl qo'shni pozitsiyada
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "NH3", color: CPK.N },
      { pos: 3, type: "NH3", color: CPK.N },
      { pos: 4, type: "NH3", color: CPK.N },
      { pos: 5, type: "NH3", color: CPK.N }
    ],
    ligandsB: [ // trans — 2 Cl qarama-qarshi
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "NH3", color: CPK.N },
      { pos: 3, type: "NH3", color: CPK.N },
      { pos: 4, type: "NH3", color: CPK.N },
      { pos: 5, type: "NH3", color: CPK.N }
    ],
    colorA: "Violeo — pushti-binafsha (rangi Werner nomenklaturasidan)",
    colorB: "Praseo — yashil (grekcha 'prasos' — piyoz yashil)",
    dipoleA: "≈ 5.5 D (kuchli qutbli) — Co–Cl bog'lari 90° burchakda",
    dipoleB: "≈ 0.0 D (qutbsiz) — Co–Cl bog'lari 180° aksari",
    symmetryA: "C₂ᵥ (C2v) — aylanish o'qi + tekisliklar",
    symmetryB: "D₄ₕ (D4h) — to'la simmetriya",
    solubilityA: "Suvda yaxshi eriydi. Erish issiqligi > trans.",
    solubilityB: "Suvda cis dan kam eriydi.",
    reactivityA: "Xelat sinovi (Werner): oksalat (C₂O₄²⁻) bidentat ligand cis holatida joylashib xelat hosil qiladi. Bu — Werner uchun cis strukturasining eksperimental tasdig'i bo'ldi.",
    reactivityB: "Oksalat bilan xelat hosil bo'lmaydi (2 Cl trans holatda, oksalat pozitsion mos kelmaydi). Faqat 1 Cl chiqib monodentat ligand hosil bo'ladi.",
    medicalUseA: "Tibbiyotda to'g'ridan-to'g'ri qo'llanilmaydi. Analitik va sanoat kimyosida.",
    medicalUseB: "Analitik reaktivlarda va laboratoriya sintezida.",
    dnaBinding: null,
    discovery: "Werner 1893-yilda cis va trans [Co(NH₃)₄Cl₂]⁺ izomerlarini ajratdi. Xelat ligand (oksalat) bilan sinovi orqali cis strukturasini isbotladi. Bu — uning koordinatsion nazariyasining birinchi katta g'alabalaridan biri. Jørgensen bunga alternativ zanjir nazariyasi taklif qildi, lekin xelat isboti Werner g'olibligini ta'minladi.",
    experimentalProof: [
      "Rang farqi: violeo pushti-binafsha, praseo yashil — ko'z bilan aniqlanadi.",
      "Xelat sinovi (Werner klassik uslubi): oksalat C₂O₄²⁻ faqat cis da xelat hosil qiladi.",
      "Dipol moment: cis ≈ 5.5 D, trans ≈ 0 D.",
      "IR: cis da 2 ta ν(Co–Cl) polosa, trans da 1 ta simmetrik.",
      "UV-VIS: cis maks. 530 nm, trans 620 nm (d–d o'tishlar geometriyaga bog'liq).",
      "Elektron paramagnit rezonans (EPR): trans ostidagi kristall maydon farq qiladi.",
      "X-ray: cis Co–Cl = 2.24 Å, Cl–Co–Cl = 90°. Trans: 180°."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: false
  },

  // ───────────────────────────────────────────────────────────────
  // 3. FAC / MER — [Co(NH3)3Cl3] uchun
  // ───────────────────────────────────────────────────────────────
  FacMer_CoCl3: {
    id: "FacMer_CoCl3",
    title: "fac / mer izomerlar — [Co(NH₃)₃Cl₃]",
    shortTitle: "fac / mer oktaedr",
    isomerType: "fac_mer",
    geometry: "octahedral_3_3",
    grossFormula: "[Co(NH₃)₃Cl₃]",
    formulaA: "fac-[Co(NH₃)₃Cl₃]",
    formulaB: "mer-[Co(NH₃)₃Cl₃]",
    nameA: "fac-Triammintrixlorokobalt(III) (facial)",
    nameB: "mer-Triammintrixlorokobalt(III) (meridional)",
    center: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral" },
    ligandsA: [ // fac — 3 Cl bir uchburchak yuzda
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 4, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "NH3", color: CPK.N },
      { pos: 3, type: "NH3", color: CPK.N },
      { pos: 5, type: "NH3", color: CPK.N }
    ],
    ligandsB: [ // mer — 3 Cl bir chiziqda (meridian)
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 3, type: "NH3", color: CPK.N },
      { pos: 4, type: "NH3", color: CPK.N },
      { pos: 5, type: "NH3", color: CPK.N }
    ],
    colorA: "Binafsha kristallar (fac)",
    colorB: "Qizil-binafsha kristallar (mer)",
    dipoleA: "≈ 4.8 D — 3 ta Cl bir tomonda",
    dipoleB: "≈ 2.0 D — kuchsizroq (asimmetrik)",
    symmetryA: "C₃ᵥ (C3v) — 3 barmoqli aylanish o'qi",
    symmetryB: "C₂ᵥ (C2v) — kuchsizroq simmetriya",
    solubilityA: "Kam eriydi, kristallanadi.",
    solubilityB: "Yaxshi eriydi.",
    reactivityA: "3 ta Cl bir yuzda — uchdonor xelat ligand (tridentat) faqat fac holatida bog'lanadi. Trientin (dietilentriamin) fac-selektiv.",
    reactivityB: "Meridional joylashuv — uchdonor ligand chiziq bo'ylab joylashishi kerak (kamdan-kam). Odatda 3 monodentat ligand.",
    medicalUseA: "Fac izomerlar ba'zi katalizatorlarda selektiv reaksiyalarga imkon beradi.",
    medicalUseB: "Mer holatlar tabiiy metalloproteinlar strukturasida uchraydi.",
    dnaBinding: null,
    discovery: "fac/mer nomenklatura Basolo va Pearson (1958) tomonidan taklif qilingan. Werner davrida oktaedrik izomerlar aniqlangan, lekin fac/mer atamalari zamonaviy IUPAC (1971) qabul qildi. Sifat analitik kimyo va katalitik amaliyotda muhim.",
    experimentalProof: [
      "NMR: fac da ekvivalent 3 ta ligand — bitta signal; mer da 2 xil kimyoviy muhit — 2 ta signal.",
      "IR: fac da simmetrik va asimmetrik ν(M–Cl) polosalar; mer da 3 xil polosa.",
      "Dipol moment: fac (~4.8 D) > mer (~2.0 D).",
      "UV-VIS: turli d–d o'tishlar (fac va mer maks. har xil to'lqin uzunliklarida).",
      "X-ray: fac — 3 Cl uchburchak (3 tekislik burchagi 90°); mer — chiziqli (2 x 90° + 1 x 180°).",
      "Xelat sinovi: fac da tridentat ligand xelat hosil qiladi (dienN₃)."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: false
  },

  // ───────────────────────────────────────────────────────────────
  // 4. Bidentat en ligand bilan — [CrCl2(en)2]+
  // ───────────────────────────────────────────────────────────────
  CrCl2en2: {
    id: "CrCl2en2",
    title: "Xelat ligand bilan — [CrCl₂(en)₂]⁺",
    shortTitle: "cis / trans + xiral",
    isomerType: "cis_trans",
    geometry: "octahedral_4_2",
    grossFormula: "[CrCl₂(en)₂]⁺ (en = etilendiamin)",
    formulaA: "cis-[CrCl₂(en)₂]⁺",
    formulaB: "trans-[CrCl₂(en)₂]⁺",
    nameA: "cis-Dixlorobis(etilendiamin)xrom(III)",
    nameB: "trans-Dixlorobis(etilendiamin)xrom(III)",
    center: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral" },
    ligandsA: [ // cis — 2 Cl qo'shni
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "en", color: CPK.N, chelate: true, chelatePartner: 3 },
      { pos: 3, type: "en", color: CPK.N, chelate: true, chelatePartner: 1 },
      { pos: 4, type: "en", color: CPK.N, chelate: true, chelatePartner: 5 },
      { pos: 5, type: "en", color: CPK.N, chelate: true, chelatePartner: 4 }
    ],
    ligandsB: [ // trans
      { pos: 0, type: "Cl", color: CPK.Cl },
      { pos: 1, type: "Cl", color: CPK.Cl },
      { pos: 2, type: "en", color: CPK.N, chelate: true, chelatePartner: 4 },
      { pos: 4, type: "en", color: CPK.N, chelate: true, chelatePartner: 2 },
      { pos: 3, type: "en", color: CPK.N, chelate: true, chelatePartner: 5 },
      { pos: 5, type: "en", color: CPK.N, chelate: true, chelatePartner: 3 }
    ],
    colorA: "To'q binafsha kristallar (cis)",
    colorB: "Yashil-binafsha kristallar (trans)",
    dipoleA: "≈ 5.2 D (kuchli qutbli, xiral)",
    dipoleB: "≈ 0.5 D (deyarli qutbsiz)",
    symmetryA: "C₂ (faqat aylanish o'qi) — XIRAL! Optik faol",
    symmetryB: "C₂ₕ (C2h) — markaziy simmetriya, oynadan qaytish",
    solubilityA: "Yaxshi eriydi, xiral kristallar (Δ va Λ enantiomerlar).",
    solubilityB: "Erishi kamroq.",
    reactivityA: "cis-[CrCl₂(en)₂]⁺ XIRAL (chiral) — Delta (Δ) va Lambda (Λ) enantiomerlar hosil bo'ladi. Bu — Werner tomonidan koordinatsion optik faollik isboti (1911). Sekin gidrolizlanadi.",
    reactivityB: "Trans shakli aksari simmetrikligi sababli optik faol emas. Turg'un, ammo cisga aylanishi mumkin qaynatilganda.",
    medicalUseA: "Bioinorganika modellarida (metallofermentlar strukturasi). Xelat effekt tadqiqotlarida.",
    medicalUseB: "Analitik reaksiyalarda va laboratoriya standartlarida.",
    dnaBinding: null,
    discovery: "Werner (1911) cis-[CoCl₂(en)₂]⁺ analogini xiral bo'lgan holda ajratdi — birinchi optik faol koordinatsion birikma. Bu Werner nazariyasining hal qiluvchi eksperimental g'alabasi bo'ldi. 1911-yilda dissertatsion tadqiqot sifatida Victor L. King (Werner shogirdi) tomonidan bajarilgan.",
    experimentalProof: [
      "Optik aylanish (polarimetry): cis-Δ shakli +[α]ᴅ = +170° (D-line), Λ -170°. Trans optik faol emas.",
      "CD (aylanma dikroizm): cis da CD signali bor, trans da yo'q.",
      "Dipol moment: cis ≈ 5.2 D, trans ≈ 0.5 D.",
      "IR: cis va trans da ν(Cr–N) va ν(Cr–Cl) chastotalari farq qiladi.",
      "UV-VIS: cis 517 nm, trans 526 nm (⁴T₂g ← ⁴A₂g).",
      "Kristallografiya: cis Cl–Cr–Cl ≈ 92°, trans 180°.",
      "Termodinamik: trans → cis konversiya ΔG = −5 kJ/mol (cis afzalroq)."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: false
  },

  // ───────────────────────────────────────────────────────────────
  // 5. Kvadrat-planar Pd bilan
  // ───────────────────────────────────────────────────────────────
  PdPPh3Cl: {
    id: "PdPPh3Cl",
    title: "Kvadrat-planar Pd(II) — [Pd(PPh₃)₂Cl₂]",
    shortTitle: "cis / trans katalitik",
    isomerType: "cis_trans",
    geometry: "square_planar",
    grossFormula: "[Pd(PPh₃)₂Cl₂]",
    formulaA: "cis-[Pd(PPh₃)₂Cl₂]",
    formulaB: "trans-[Pd(PPh₃)₂Cl₂]",
    nameA: "cis-Bis(trifenilfosfin)dixloropalladiy(II)",
    nameB: "trans-Bis(trifenilfosfin)dixloropalladiy(II)",
    center: { metal: "Pd", charge: "+2", color: CPK.Pd, radius: 0.42, geometry: "square_planar" },
    ligandsA: [
      { pos: 0, type: "PPh3", color: CPK.P },
      { pos: 1, type: "PPh3", color: CPK.P },
      { pos: 2, type: "Cl", color: CPK.Cl },
      { pos: 3, type: "Cl", color: CPK.Cl }
    ],
    ligandsB: [
      { pos: 0, type: "PPh3", color: CPK.P },
      { pos: 2, type: "PPh3", color: CPK.P },
      { pos: 1, type: "Cl", color: CPK.Cl },
      { pos: 3, type: "Cl", color: CPK.Cl }
    ],
    colorA: "Sariq kristallar (cis, yumshoq)",
    colorB: "Och sariq kristallar (trans, ancha barqaror)",
    dipoleA: "≈ 8.7 D (kuchli qutbli — kattaligi PPh₃ tufayli)",
    dipoleB: "≈ 0.0 D (qutbsiz — markaziy simmetriya)",
    symmetryA: "C₂ᵥ (C2v)",
    symmetryB: "D₂ₕ (D2h)",
    solubilityA: "Aromatik erituvchilarda yaxshi eriydi.",
    solubilityB: "Xloroformda ancha kam.",
    reactivityA: "cis shakli KATALITIK aktivligi ustunligiga ega (Heck, Suzuki, Sonogashira reaksiyalari). PPh₃ ligandlarining cis holatida trans-effect quyi.",
    reactivityB: "trans shakli termodinamik jihatdan afzal, lekin katalitik aktivligi kam. Sanoat sintezida ko'proq trans qo'llaniladi (barqarorlik).",
    medicalUseA: "Farmatsevtik sintez kataizatorlari.",
    medicalUseB: "Sanoat kimyosining eng qadimgi katalizatorlaridan biri.",
    dnaBinding: null,
    discovery: "Chatt va Wilkins (1955, London) [Pd(PR₃)₂Cl₂] tipidagi izomerlarni birinchi bo'lib tadqiq qilishdi. Ular trans-effect nazariyasini rivojlantirishga muhim hissa qo'shishdi. Bu tadqiqot palladiy katalizidagi hozirgi asrning inqilobiga (Nobel 2010 — Heck, Negishi, Suzuki) asos bo'ldi.",
    experimentalProof: [
      "³¹P NMR: cis da 2 ta signal (2 xil PPh₃ muhiti), trans da faqat 1 ta signal.",
      "IR: cis da 2 ta ν(Pd–Cl), trans da 1 ta.",
      "Dipol moment: cis ≈ 8.7 D, trans ≈ 0 D — katta farq.",
      "UV-VIS: cis 320 nm, trans 340 nm.",
      "X-ray: kvadrat-planar geometriya aniq ko'rinadi.",
      "Kataliz sinovi: Heck reaksiyasi cis da 10x tez."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: false
  },

  // ───────────────────────────────────────────────────────────────
  // 6. Br analog — HSAB tahlili
  // ───────────────────────────────────────────────────────────────
  PtBr2NH3: {
    id: "PtBr2NH3",
    title: "Pt(II) bromo analogi — HSAB tahlili",
    shortTitle: "cis / trans Br",
    isomerType: "cis_trans",
    geometry: "square_planar",
    grossFormula: "[Pt(NH₃)₂Br₂]",
    formulaA: "cis-[Pt(NH₃)₂Br₂]",
    formulaB: "trans-[Pt(NH₃)₂Br₂]",
    nameA: "cis-Diammindibromo platina(II)",
    nameB: "trans-Diammindibromo platina(II)",
    center: { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar" },
    ligandsA: [
      { pos: 0, type: "NH3", color: CPK.N },
      { pos: 1, type: "NH3", color: CPK.N },
      { pos: 2, type: "Br", color: CPK.Br },
      { pos: 3, type: "Br", color: CPK.Br }
    ],
    ligandsB: [
      { pos: 0, type: "NH3", color: CPK.N },
      { pos: 2, type: "NH3", color: CPK.N },
      { pos: 1, type: "Br", color: CPK.Br },
      { pos: 3, type: "Br", color: CPK.Br }
    ],
    colorA: "To'q qizil-jigarrang kristallar (cis)",
    colorB: "Jigarrang-sariq kristallar (trans)",
    dipoleA: "≈ 3.8 D (kuchli qutbli)",
    dipoleB: "≈ 0.0 D (qutbsiz)",
    symmetryA: "C₂ᵥ (C2v)",
    symmetryB: "D₂ₕ (D2h)",
    solubilityA: "Suvda 0.8 g/L. Sisplatinning bromo analogi — karboplatin va oksaliplatin bilan taqqoslash uchun.",
    solubilityB: "Suvda 0.02 g/L, klinik ahamiyati yo'q.",
    reactivityA: "Sisplatinning bromo analogi — tibbiy tadqiqotlarda modeling uchun ishlatilgan. DNA bog'lanish faolligi ancha kam (Br labilroq). HSAB: Pt(II) yumshoq, Br⁻ yumshoq — kuchli bog'.",
    reactivityB: "Trans shakli DNA bilan bog'lanmaydi.",
    medicalUseA: "Tadqiqot vositasi — karboplatin va oksaliplatin (klinik dorilar) rivojlantirishda etalon.",
    medicalUseB: "Tibbiy qo'llanilishi yo'q.",
    dnaBinding: "Bromo analogi DNA guanin N7 ga bog'lanishi kuchsizroq (Br⁻ labilroq, faqat kinetik jihatdan tez chiqadi). Klinik samaradorligi past.",
    discovery: "Rosenberg sisplatin kashfiyotidan so'ng bromo analogini ham tekshirdi. Farq: Br⁻ labilroq — tez chiqadi va DNA bilan barqaror bog' hosil qilmaydi. Bu HSAB nazariyasining klinik amaliyoti — yumshoq va qattiq donorlar tanlash muhim.",
    experimentalProof: [
      "Dipol moment: cis ≈ 3.8 D, trans ≈ 0 D.",
      "IR: ν(Pt–Br) chastotasi Cl analogidan pastroq (215 vs 320 sm⁻¹).",
      "¹⁹⁵Pt NMR: cis ≈ −2250 ppm, trans ≈ −2650 ppm.",
      "X-ray: Pt–Br = 2.44 Å (Pt–Cl dan uzunroq).",
      "Kurnakov testi: thiourea reaksiyasi bilan cis/trans ajratish.",
      "DNA bog'lanish kinetikasi: bromo analogi 5x sekin.",
      "UV-VIS: cis 350 nm, trans 385 nm."
    ],
    hasSymmetryAxis: true,
    hasDipole: true,
    hasDNAtest: true
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "d⁶ LS — juda inert", color: "#F090A0", cfse: "−2.4 Δₒ" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d⁵ 4s¹", oxidation: "+3", role: "d³ — ancha barqaror", color: "#8A99C7", cfse: "−1.2 Δₒ" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2", role: "d⁸ kvadrat-planar", color: "#D0D0E0", cfse: "−1.45 Δₒ" },
  Pd: { name: "Palladiy (Pd)", atomic: 46, mass: "106.42 u", config: "[Kr] 4d¹⁰", oxidation: "+2", role: "d⁸ kvadrat-planar", color: "#006985", cfse: "−1.45 Δₒ" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃, en donor atomi", hybridization: "sp³", color: "#3050F8" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "Ligand tarkibi", hybridization: "sp²/sp³", color: "#FF0D0D" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "en, PPh₃ tarkibi", hybridization: "sp³", color: "#909090" },
  Cl: { name: "Xlor (Cl)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁵", role: "Monodentat ligand", color: "#1FF01F" },
  Br: { name: "Brom (Br)", atomic: 35, mass: "79.90 u", config: "[Ar] 3d¹⁰ 4s² 4p⁵", role: "Monodentat ligand", color: "#A62929" },
  P:  { name: "Fosfor (P)", atomic: 15, mass: "30.97 u", config: "[Ne] 3s² 3p³", role: "PPh₃ donor atomi", hybridization: "sp³", color: "#FF8000" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Ligand tarkibi", color: "#FFFFFF" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

// 3D matn sprite
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 14, scale = 0.5
  } = options
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
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT — HOLAT IZOMERIYA 3D
// ═══════════════════════════════════════════════════════════════════════════
export default function HolatIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const leftGroupRef = useRef(null)   // A shakli (cis yoki fac)
  const rightGroupRef = useRef(null)  // B shakli (trans yoki mer)
  const dnaRef = useRef({ leftDNA: null, rightDNA: null })
  const dipoleRef = useRef({ leftArrow: null, rightArrow: null })
  const symAxisRef = useRef({ leftAxis: null, rightAxis: null })
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const highlightRef = useRef([])

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentPair, setCurrentPair] = useState("Sisplatin")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both")
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(false)
  const [showAngles, setShowAngles] = useState(true)
  const [showDipole, setShowDipole] = useState(false)
  const [showSymAxis, setShowSymAxis] = useState(false)
  const [showDNA, setShowDNA] = useState(false)
  const [showChelate, setShowChelate] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, definition: true, cisTransBasics: true, facMer: true,
    examples: true, symmetry: true, dipole: true, sisplatinMed: true,
    tests: true, history: true, table: true, references: true
  })

  // Ko'chiriladigan panel
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setIsPanelDragging(true)
  }, [])
  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = clientX - cRect.left - dragOffsetRef.current.x
    let ny = clientY - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
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

  const togglePanel = (name) => setActivePanel(activePanel === name ? null : name)

  const pair = POSITION_ISOMERS[currentPair]

  // ═══════════════════════════════════════════════════════════
  // BOG'LANISH YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.06, opacity = 0.75) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.3, transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    bond.userData = { type: 'bond' }
    parent.add(bond)
    bondsRef.current.push(bond)
    return bond
  }, [])

  // ── NH₃ LIGAND ─────────────────────────────────────────
  const createNH3 = useCallback((parent, nPos, centerPos, showH, tag) => {
    const group = new THREE.Group()
    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NH₃', tag }
    group.add(nMesh); atomsRef.current.push(nMesh)
    createBond(group, centerPos, nPos, CPK.bond, 0.06)
    if (showH) {
      const outward = nPos.clone().sub(centerPos).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const perp1 = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      const perp2 = new THREE.Vector3().crossVectors(outward, perp1).normalize()
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3
        const hDir = outward.clone().multiplyScalar(0.32)
          .add(perp1.clone().multiplyScalar(0.36 * Math.cos(angle)))
          .add(perp2.clone().multiplyScalar(0.36 * Math.sin(angle)))
        const hPos = nPos.clone().add(hDir)
        const hMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.10, 20, 20),
          new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        )
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, tag }
        group.add(hMesh); atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ── Cl/Br yakka atom ──────────────────────────────
  const createHalide = useCallback((parent, centerPos, direction, halideType, tag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const color = halideType === 'Cl' ? CPK.Cl : CPK.Br
    const radius = halideType === 'Cl' ? 0.32 : 0.36
    const dist = halideType === 'Cl' ? 2.30 : 2.42
    const pos = centerPos.clone().add(dir.clone().multiplyScalar(dist))
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.35, emissive: color, emissiveIntensity: 0.15 })
    )
    mesh.position.copy(pos)
    mesh.userData = { type: 'atom', element: halideType, info: ATOM_INFO[halideType], ligandName: `${halideType}⁻`, tag, charge: '1−' }
    group.add(mesh); atomsRef.current.push(mesh)
    createBond(group, centerPos, pos, CPK.bond, 0.07, 0.85)
    parent.add(group)
    return group
  }, [createBond])

  // ── en (etilendiamin) BIDENTAT LIGAND — xelat ────────────────
  const createEn = useCallback((parent, centerPos, dir1, dir2, tag, showH) => {
    const group = new THREE.Group()
    const d1 = dir1.clone().normalize()
    const d2 = dir2.clone().normalize()
    const n1Pos = centerPos.clone().add(d1.clone().multiplyScalar(2.05))
    const n2Pos = centerPos.clone().add(d2.clone().multiplyScalar(2.05))
    const mid = new THREE.Vector3().addVectors(n1Pos, n2Pos).multiplyScalar(0.5)
    const bridge = mid.clone().sub(centerPos).normalize().multiplyScalar(0.35)
    const c1Pos = n1Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(n2Pos, n1Pos).multiplyScalar(0.28))
    const c2Pos = n2Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(n1Pos, n2Pos).multiplyScalar(0.28))

    ;[n1Pos, n2Pos].forEach(pos => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 32, 32),
        new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'en (etilendiamin)', tag }
      group.add(m); atomsRef.current.push(m)
    })
    ;[c1Pos, c2Pos].forEach(pos => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'en (etilendiamin)', tag }
      group.add(m); atomsRef.current.push(m)
    })
    createBond(group, centerPos, n1Pos, CPK.bond, 0.07, 0.85)
    createBond(group, centerPos, n2Pos, CPK.bond, 0.07, 0.85)
    createBond(group, n1Pos, c1Pos, 0x666677, 0.05, 0.7)
    createBond(group, c1Pos, c2Pos, 0x666677, 0.05, 0.7)
    createBond(group, c2Pos, n2Pos, 0x666677, 0.05, 0.7)

    if (showH) {
      [n1Pos, n2Pos].forEach(pos => {
        const outward = pos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
        ;[+1, -1].forEach(s => {
          const hPos = pos.clone().add(outward.clone().multiplyScalar(0.15)).add(perp.clone().multiplyScalar(0.30 * s))
          const h = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 16, 16),
            new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          )
          h.position.copy(hPos); h.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, tag }
          group.add(h); atomsRef.current.push(h)
          createBond(group, pos, hPos, 0x666677, 0.025, 0.5)
        })
      })
    }
    parent.add(group)
    return group
  }, [createBond])

  // ── PPh₃ (trifenilfosfin) LIGAND ─ soddalashtirilgan ───────────
  const createPPh3 = useCallback((parent, centerPos, direction, tag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const pPos = centerPos.clone().add(dir.clone().multiplyScalar(2.30))
    const pMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.30, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.P, roughness: 0.3, metalness: 0.3, emissive: CPK.P, emissiveIntensity: 0.2 })
    )
    pMesh.position.copy(pPos)
    pMesh.userData = { type: 'atom', element: 'P', info: ATOM_INFO.P, ligandName: 'PPh₃ (trifenilfosfin)', tag }
    group.add(pMesh); atomsRef.current.push(pMesh)
    createBond(group, centerPos, pPos, CPK.bond, 0.08, 0.85)

    // 3 ta fenil halqa — sodda tetraedrik joylashuv (uzoq C halqasi)
    const up = new THREE.Vector3(0, 1, 0)
    const perp1 = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let i = 0; i < 3; i++) {
      const ang = (i * 2 * Math.PI) / 3
      const cDir = dir.clone().multiplyScalar(0.35)
        .add(perp1.clone().multiplyScalar(0.94 * Math.cos(ang)))
        .add(perp2.clone().multiplyScalar(0.94 * Math.sin(ang)))
      const cPos = pPos.clone().add(cDir.multiplyScalar(1.83))
      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'PPh₃ fenil', tag }
      group.add(cMesh); atomsRef.current.push(cMesh)
      createBond(group, pPos, cPos, 0x777788, 0.05, 0.7)

      // Halqa hexagon
      const ringPos = cPos.clone().add(cDir.normalize().multiplyScalar(0.8))
      const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 6, 16)
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x9999aa, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.5 })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(ringPos)
      ring.lookAt(pPos)
      group.add(ring); bondsRef.current.push(ring)
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // POZITSION KOMPLEKS QURISH
  // ═══════════════════════════════════════════════════════════
  // Position → 3D yo'nalish converter
  // Oktaedr uchun: 0=+x, 1=-x, 2=+y, 3=-y, 4=+z, 5=-z
  // Kvadrat-planar uchun: 0=+x, 1=-x, 2=+z, 3=-z (xz tekislik)
  const positionToDir = (pos, geometry) => {
    if (geometry === "square_planar") {
      const dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
      ]
      return dirs[pos]
    } else {
      const dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
      ]
      return dirs[pos]
    }
  }

  const buildComplex = useCallback((group, offsetX, ligands, isomerType, isA) => {
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    const centerData = pair.center
    const geometry = pair.geometry

    // Markaziy metall
    const cMesh = new THREE.Mesh(
      new THREE.SphereGeometry(centerData.radius, 64, 64),
      new THREE.MeshStandardMaterial({
        color: centerData.color, roughness: 0.15, metalness: 0.9,
        emissive: centerData.color, emissiveIntensity: 0.2
      })
    )
    cMesh.position.copy(centerPos)
    cMesh.userData = {
      type: 'atom', element: centerData.metal, info: ATOM_INFO[centerData.metal],
      isCenter: true, charge: centerData.charge,
      tag: isA ? "A" : "B"
    }
    group.add(cMesh); atomsRef.current.push(cMesh)

    // Xelat halosini ko'rsatish (agar bidentat ligand bo'lsa)
    // Ligandlarni joylashtirish
    const chelateBondPairs = new Set()  // en ligand juftliklarini kuzatish

    ligands.forEach(ligand => {
      const dir = positionToDir(ligand.pos, geometry)
      if (!dir) return

      if (ligand.type === "NH3") {
        const dist = geometry === "square_planar" ? 2.05 : 2.05
        const nPos = centerPos.clone().add(dir.clone().multiplyScalar(dist))
        createNH3(group, nPos, centerPos, showHydrogens, isA ? "A" : "B")
      } else if (ligand.type === "Cl" || ligand.type === "Br") {
        createHalide(group, centerPos, dir, ligand.type, isA ? "A" : "B")
      } else if (ligand.type === "PPh3") {
        createPPh3(group, centerPos, dir, isA ? "A" : "B")
      } else if (ligand.type === "en" && ligand.chelate) {
        // Xelat juftlikni bir marta chizamiz
        const key = [ligand.pos, ligand.chelatePartner].sort().join('-')
        if (!chelateBondPairs.has(key)) {
          chelateBondPairs.add(key)
          const partner = ligands.find(l => l.pos === ligand.chelatePartner)
          if (partner) {
            const dir2 = positionToDir(partner.pos, geometry)
            createEn(group, centerPos, dir, dir2, isA ? "A" : "B", showHydrogens)
          }
        }
      }
    })

    // Burchak ko'rsatgichi (cis: 90°, trans: 180°)
    if (showAngles) {
      const specialLigands = ligands.filter(l => l.type === "Cl" || l.type === "Br")
      if (specialLigands.length >= 2) {
        const dir1 = positionToDir(specialLigands[0].pos, geometry)
        const dir2 = positionToDir(specialLigands[1].pos, geometry)
        const angle = dir1.angleTo(dir2)
        const angleDeg = Math.round(angle * 180 / Math.PI)

        // Yoy chizamiz (kichik torus 90° uchun, chiziq 180° uchun)
        if (angleDeg === 90) {
          const arcGeo = new THREE.TorusGeometry(1.3, 0.03, 6, 32, Math.PI / 2)
          const arcMat = new THREE.MeshBasicMaterial({ color: CPK.cis, transparent: true, opacity: 0.8 })
          const arc = new THREE.Mesh(arcGeo, arcMat)
          arc.position.copy(centerPos)
          // Yoyni ikki yo'nalish orasida joylash
          const bisector = dir1.clone().add(dir2).normalize()
          const normal = new THREE.Vector3().crossVectors(dir1, dir2).normalize()
          const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
          arc.quaternion.copy(quat)
          // Boshlang'ich vektor bo'yicha aylanish
          const rotAngle = Math.atan2(bisector.dot(new THREE.Vector3(0, 1, 0)), bisector.dot(new THREE.Vector3(1, 0, 0)))
          group.add(arc); labelsRef.current.push(arc)

          const angleSprite = makeTextSprite(`${angleDeg}° cis`, {
            fontSize: 40, color: "#FFB800", bgColor: "rgba(60, 40, 5, 0.9)", borderColor: "#FFB800", scale: 0.36
          })
          const angPos = bisector.clone().multiplyScalar(1.8).add(centerPos)
          angleSprite.position.copy(angPos)
          group.add(angleSprite); labelsRef.current.push(angleSprite)
        } else if (angleDeg === 180) {
          const angleSprite = makeTextSprite(`180° trans`, {
            fontSize: 40, color: "#00E5FF", bgColor: "rgba(5, 40, 60, 0.9)", borderColor: "#00E5FF", scale: 0.36
          })
          angleSprite.position.copy(centerPos.clone().add(new THREE.Vector3(0, -1.5, 0)))
          group.add(angleSprite); labelsRef.current.push(angleSprite)
        }
      }
    }

    // Yorliqlar
    if (showLabels) {
      const isomerName = isA ? (isomerType === "fac_mer" ? "fac" : "cis") : (isomerType === "fac_mer" ? "mer" : "trans")
      const color = isA ? "#FFB800" : "#00E5FF"
      const bg = isA ? "rgba(80, 55, 5, 0.9)" : "rgba(5, 55, 80, 0.9)"
      const sprite = makeTextSprite(`${isomerName}-shakl`, {
        fontSize: 46, color, bgColor: bg, borderColor: color, scale: 0.42
      })
      sprite.position.set(offsetX, 3.4, 0)
      group.add(sprite); labelsRef.current.push(sprite)

      const formulaText = isA ? pair.formulaA : pair.formulaB
      const formulaSprite = makeTextSprite(formulaText, {
        fontSize: 30, color: "#ffffff", bgColor: "rgba(20, 10, 40, 0.85)", borderColor: color, scale: 0.32
      })
      formulaSprite.position.set(offsetX, 2.75, 0)
      group.add(formulaSprite); labelsRef.current.push(formulaSprite)
    }
  }, [pair, createNH3, createHalide, createEn, createPPh3, showHydrogens, showLabels, showAngles])

  // ════════════════════════════════════════════════════════════
  // DIPOL VEKTOR (cis holatlar uchun)
  // ════════════════════════════════════════════════════════════
  const createDipoleArrow = useCallback((parent, offsetX, ligands, isA) => {
    // Cis holatlarda dipol vektori bor, trans holatlarda yo'q
    const specialLigands = ligands.filter(l => l.type === "Cl" || l.type === "Br")
    if (specialLigands.length < 2) return null
    const dir1 = positionToDir(specialLigands[0].pos, pair.geometry)
    const dir2 = positionToDir(specialLigands[1].pos, pair.geometry)
    const angle = dir1.angleTo(dir2)
    const angleDeg = Math.round(angle * 180 / Math.PI)

    if (angleDeg === 180) {
      // Trans — dipol nol, faqat "0 D" belgisi
      const label = makeTextSprite("μ = 0 D (dipol yo'q)", {
        fontSize: 36, color: "#00E5FF",
        bgColor: "rgba(5, 55, 80, 0.9)", borderColor: "#00E5FF", scale: 0.38
      })
      label.position.set(offsetX, -3.6, 0)
      parent.add(label); labelsRef.current.push(label)
      return null
    }

    // Cis — dipol vektori (Cl atomlar tomonga)
    const bisector = dir1.clone().add(dir2).normalize()
    const startPos = new THREE.Vector3(offsetX, 0, 0)
    const endPos = startPos.clone().add(bisector.clone().multiplyScalar(2.5))

    // Dipol strelka
    const arrowDir = bisector.clone().normalize()
    const arrowHelper = new THREE.ArrowHelper(
      arrowDir, startPos, 2.5,
      CPK.dipole, 0.4, 0.2
    )
    arrowHelper.line.material.linewidth = 3
    parent.add(arrowHelper); labelsRef.current.push(arrowHelper)

    // μ yorlig'i
    const dipoleValue = isA ? pair.dipoleA : pair.dipoleB
    const dipoleMatch = dipoleValue.match(/[\d.]+/)
    const dipoleNum = dipoleMatch ? dipoleMatch[0] : "?"
    const label = makeTextSprite(`μ = ${dipoleNum} D`, {
      fontSize: 40, color: "#FF3366",
      bgColor: "rgba(60, 5, 25, 0.9)", borderColor: "#FF3366", scale: 0.4
    })
    label.position.copy(endPos.clone().add(bisector.clone().multiplyScalar(0.5)))
    parent.add(label); labelsRef.current.push(label)

    return arrowHelper
  }, [pair])

  // ════════════════════════════════════════════════════════════
  // SIMMETRIYA O'QI (C2, C3, C4)
  // ════════════════════════════════════════════════════════════
  const createSymmetryAxis = useCallback((parent, offsetX, ligands, isA, isomerType) => {
    const specialLigands = ligands.filter(l => l.type === "Cl" || l.type === "Br")
    if (specialLigands.length < 2) return
    const dir1 = positionToDir(specialLigands[0].pos, pair.geometry)
    const dir2 = specialLigands[1] ? positionToDir(specialLigands[1].pos, pair.geometry) : null
    const angle = dir2 ? dir1.angleTo(dir2) : 0
    const angleDeg = Math.round(angle * 180 / Math.PI)

    let axisDir, axisLabel
    if (isomerType === "fac_mer" && isA) {
      // fac — C3 o'qi 3 Cl orqali o'tadi (uchburchak markazi)
      const cl3 = ligands.filter(l => l.type === "Cl").slice(0, 3)
      const centroid = new THREE.Vector3()
      cl3.forEach(l => centroid.add(positionToDir(l.pos, pair.geometry)))
      centroid.multiplyScalar(1/3).normalize()
      axisDir = centroid
      axisLabel = "C₃"
    } else if (isomerType === "cis_trans" && !isA && angleDeg === 180) {
      // trans — C4 o'qi (kvadrat-planar da) yoki C2 (oktaedrik)
      axisDir = new THREE.Vector3(0, 1, 0)
      axisLabel = pair.geometry === "square_planar" ? "C₄" : "C₂ (asosiy)"
    } else {
      // cis — C2 o'qi (bisector orqali)
      axisDir = dir2 ? dir1.clone().add(dir2).normalize() : new THREE.Vector3(0, 1, 0)
      axisLabel = "C₂"
    }

    // O'q chiziq (2 tomonga)
    const startPos = new THREE.Vector3(offsetX, 0, 0).sub(axisDir.clone().multiplyScalar(3))
    const endPos = new THREE.Vector3(offsetX, 0, 0).add(axisDir.clone().multiplyScalar(3))
    const points = [startPos, endPos]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineDashedMaterial({
      color: CPK.symmetryAxis, dashSize: 0.2, gapSize: 0.1, linewidth: 2, transparent: true, opacity: 0.85
    })
    const line = new THREE.Line(geometry, material)
    line.computeLineDistances()
    parent.add(line); labelsRef.current.push(line)

    // O'q yorlig'i
    const label = makeTextSprite(axisLabel + " o'qi", {
      fontSize: 34, color: "#AAFF00",
      bgColor: "rgba(40, 60, 5, 0.9)", borderColor: "#AAFF00", scale: 0.36
    })
    label.position.copy(endPos.clone().add(axisDir.clone().multiplyScalar(0.4)))
    parent.add(label); labelsRef.current.push(label)

    // Simmetriya guruhi (point group) yorlig'i
    const symmetry = isA ? pair.symmetryA : pair.symmetryB
    const pgMatch = symmetry.match(/[CDE][\d₂₃₄₅]?[ᵥhvi]?/)
    if (pgMatch) {
      const pgLabel = makeTextSprite(`Nuqta guruh: ${pgMatch[0]}`, {
        fontSize: 30, color: "#c4b5fd",
        bgColor: "rgba(25, 15, 45, 0.9)", borderColor: "#a78bfa", scale: 0.32
      })
      pgLabel.position.set(offsetX, -3.2, 0)
      parent.add(pgLabel); labelsRef.current.push(pgLabel)
    }
  }, [pair])

  // ════════════════════════════════════════════════════════════
  // DNA MODELLI — sisplatin DNA bog'lanishi
  // ════════════════════════════════════════════════════════════
  const createDNAModel = useCallback((parent, offsetX, ligands, isA) => {
    // Faqat 2 halide bo'lgan komplekslar uchun (cis sisplatin va analoglar)
    const specialLigands = ligands.filter(l => l.type === "Cl" || l.type === "Br")
    if (specialLigands.length !== 2) return
    const dir1 = positionToDir(specialLigands[0].pos, pair.geometry)
    const dir2 = positionToDir(specialLigands[1].pos, pair.geometry)
    const angle = dir1.angleTo(dir2)
    const angleDeg = Math.round(angle * 180 / Math.PI)

    // DNA guanin N7 atomlarini simulatsiya qilamiz — 2 ta yashil shar
    // Faqat cis (90°) da DNA bog'lanishi mumkin
    const bisector = dir1.clone().add(dir2).normalize()
    const perpDNA = new THREE.Vector3(0, 1, 0)
    if (Math.abs(bisector.dot(perpDNA)) > 0.9) perpDNA.set(1, 0, 0)
    const dnaDir = new THREE.Vector3().crossVectors(bisector, perpDNA).normalize()

    const dnaGroup = new THREE.Group()

    // 2 ta guanin N7 (yashil sharlar)
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    const g1Pos = centerPos.clone().add(dir1.clone().multiplyScalar(3.4)).add(dnaDir.clone().multiplyScalar(0.4))
    const g2Pos = centerPos.clone().add(dir2.clone().multiplyScalar(3.4)).add(dnaDir.clone().multiplyScalar(0.4))

    ;[g1Pos, g2Pos].forEach((pos, i) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 24),
        new THREE.MeshStandardMaterial({
          color: CPK.dna, roughness: 0.4, metalness: 0.2,
          emissive: CPK.dna, emissiveIntensity: 0.3
        })
      )
      mesh.position.copy(pos)
      mesh.userData = { type: 'atom', element: 'N', info: { ...ATOM_INFO.N, name: `Guanin N7 (DNA-${i+1})`, role: "DNA nukleotid azot atomi" } }
      dnaGroup.add(mesh); atomsRef.current.push(mesh)

      // DNA duplex halqa (soddalashtirilgan)
      const ringGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 24)
      const ringMat = new THREE.MeshStandardMaterial({
        color: CPK.dna, roughness: 0.5, metalness: 0.2,
        transparent: true, opacity: 0.6
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos).add(dnaDir.clone().multiplyScalar(0.4))
      ring.lookAt(centerPos)
      dnaGroup.add(ring); labelsRef.current.push(ring)
    })

    // Bog'lanish chiziqlari (faqat cis) — Pt-N7 bog'lari
    if (angleDeg === 90) {
      const bond1Mat = new THREE.LineDashedMaterial({
        color: CPK.dna, dashSize: 0.15, gapSize: 0.08, linewidth: 2, transparent: true, opacity: 0.9
      })
      const pts1 = [centerPos.clone().add(dir1.clone().multiplyScalar(2.32)), g1Pos]
      const geo1 = new THREE.BufferGeometry().setFromPoints(pts1)
      const line1 = new THREE.Line(geo1, bond1Mat); line1.computeLineDistances()
      dnaGroup.add(line1); labelsRef.current.push(line1)

      const pts2 = [centerPos.clone().add(dir2.clone().multiplyScalar(2.32)), g2Pos]
      const geo2 = new THREE.BufferGeometry().setFromPoints(pts2)
      const line2 = new THREE.Line(geo2, bond1Mat.clone()); line2.computeLineDistances()
      dnaGroup.add(line2); labelsRef.current.push(line2)

      // DNA crosslink belgisi
      const label = makeTextSprite("DNA crosslink!", {
        fontSize: 40, color: "#00FF88",
        bgColor: "rgba(5, 60, 30, 0.9)", borderColor: "#00FF88", scale: 0.4
      })
      label.position.copy(centerPos.clone().add(dnaDir.clone().multiplyScalar(3)))
      dnaGroup.add(label); labelsRef.current.push(label)
    } else {
      // Trans — DNA bog'lanmaydi
      const label = makeTextSprite("DNA bog'lanmaydi ×", {
        fontSize: 34, color: "#FF6666",
        bgColor: "rgba(60, 15, 15, 0.9)", borderColor: "#FF6666", scale: 0.36
      })
      label.position.copy(centerPos.clone().add(dnaDir.clone().multiplyScalar(3)))
      dnaGroup.add(label); labelsRef.current.push(label)
    }

    parent.add(dnaGroup)
    return dnaGroup
  }, [pair])

  // ════════════════════════════════════════════════════════════
  // XELAT SINOVI (bidentat ligand yaqinlashadi)
  // ════════════════════════════════════════════════════════════
  const createChelateTest = useCallback((parent, offsetX, ligands, isA) => {
    const specialLigands = ligands.filter(l => l.type === "Cl" || l.type === "Br")
    if (specialLigands.length < 2) return
    const dir1 = positionToDir(specialLigands[0].pos, pair.geometry)
    const dir2 = positionToDir(specialLigands[1].pos, pair.geometry)
    const angle = dir1.angleTo(dir2)
    const angleDeg = Math.round(angle * 180 / Math.PI)
    const centerPos = new THREE.Vector3(offsetX, 0, 0)

    if (angleDeg === 90) {
      // Cis — oksalat yaqinlashadi va xelat hosil qiladi
      const bisector = dir1.clone().add(dir2).normalize()
      const oxPos = centerPos.clone().add(bisector.clone().multiplyScalar(3.5))

      // Oksalat asosiy uglerodlari
      const perp = new THREE.Vector3().crossVectors(bisector, new THREE.Vector3(0, 1, 0)).normalize()
      const c1Pos = oxPos.clone().add(perp.clone().multiplyScalar(0.6))
      const c2Pos = oxPos.clone().add(perp.clone().multiplyScalar(-0.6))

      ;[c1Pos, c2Pos].forEach(p => {
        const c = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 20, 20),
          new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
        )
        c.position.copy(p)
        c.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'ox²⁻' }
        parent.add(c); labelsRef.current.push(c)
      })

      // Donor O atomlari (M ga bog'lanuvchi)
      const o1Pos = c1Pos.clone().sub(bisector.clone().multiplyScalar(0.8))
      const o2Pos = c2Pos.clone().sub(bisector.clone().multiplyScalar(0.8))
      ;[o1Pos, o2Pos].forEach(p => {
        const o = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 24, 24),
          new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.2 })
        )
        o.position.copy(p)
        o.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'ox²⁻ donor' }
        parent.add(o); labelsRef.current.push(o)
      })

      // Bog'lanish chiziqlari
      const chelMat = new THREE.LineDashedMaterial({
        color: 0xFF66CC, dashSize: 0.12, gapSize: 0.08, linewidth: 2, transparent: true, opacity: 0.9
      })
      const cls = ligands.filter(l => l.type === "Cl" || l.type === "Br")
      const clPos1 = centerPos.clone().add(positionToDir(cls[0].pos, pair.geometry).multiplyScalar(2.30))
      const clPos2 = centerPos.clone().add(positionToDir(cls[1].pos, pair.geometry).multiplyScalar(2.30))
      ;[[clPos1, o1Pos], [clPos2, o2Pos]].forEach(([a, b]) => {
        const pts = [a, b]
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        const line = new THREE.Line(geo, chelMat.clone()); line.computeLineDistances()
        parent.add(line); labelsRef.current.push(line)
      })

      const label = makeTextSprite("✅ Xelat hosil bo'ladi", {
        fontSize: 36, color: "#FF66CC",
        bgColor: "rgba(50, 5, 40, 0.9)", borderColor: "#FF66CC", scale: 0.38
      })
      label.position.copy(oxPos.clone().add(bisector.clone().multiplyScalar(1)))
      parent.add(label); labelsRef.current.push(label)
    } else {
      const label = makeTextSprite("❌ Xelat mumkin emas", {
        fontSize: 34, color: "#FF6666",
        bgColor: "rgba(60, 15, 15, 0.9)", borderColor: "#FF6666", scale: 0.36
      })
      label.position.set(offsetX, -3.9, 0)
      parent.add(label); labelsRef.current.push(label)
    }
  }, [pair])

  // ════════════════════════════════════════════════════════════
  // SAHNA QAYTA QURISH
  // ════════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    ;[leftGroupRef, rightGroupRef].forEach(ref => {
      if (ref.current) {
        scene.remove(ref.current)
        ref.current.traverse(o => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) {
            if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
            else o.material.dispose()
          }
        })
      }
    })
    labelsRef.current.forEach(l => {
      scene.remove(l)
      if (l.geometry) l.geometry.dispose()
      if (l.material) l.material.dispose()
    })

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    highlightRef.current = []

    const leftGroup = new THREE.Group()
    const rightGroup = new THREE.Group()
    leftGroupRef.current = leftGroup
    rightGroupRef.current = rightGroup

    if (viewMode === "both") {
      buildComplex(leftGroup, -4.5, pair.ligandsA, pair.isomerType, true)
      buildComplex(rightGroup, 4.5, pair.ligandsB, pair.isomerType, false)
      if (showDipole) {
        createDipoleArrow(leftGroup, -4.5, pair.ligandsA, true)
        createDipoleArrow(rightGroup, 4.5, pair.ligandsB, false)
      }
      if (showSymAxis) {
        createSymmetryAxis(leftGroup, -4.5, pair.ligandsA, true, pair.isomerType)
        createSymmetryAxis(rightGroup, 4.5, pair.ligandsB, false, pair.isomerType)
      }
      if (showDNA && pair.hasDNAtest) {
        createDNAModel(leftGroup, -4.5, pair.ligandsA, true)
        createDNAModel(rightGroup, 4.5, pair.ligandsB, false)
      }
      if (showChelate && pair.isomerType === "cis_trans") {
        createChelateTest(leftGroup, -4.5, pair.ligandsA, true)
        createChelateTest(rightGroup, 4.5, pair.ligandsB, false)
      }
    } else if (viewMode === "A") {
      buildComplex(leftGroup, 0, pair.ligandsA, pair.isomerType, true)
      if (showDipole) createDipoleArrow(leftGroup, 0, pair.ligandsA, true)
      if (showSymAxis) createSymmetryAxis(leftGroup, 0, pair.ligandsA, true, pair.isomerType)
      if (showDNA && pair.hasDNAtest) createDNAModel(leftGroup, 0, pair.ligandsA, true)
      if (showChelate && pair.isomerType === "cis_trans") createChelateTest(leftGroup, 0, pair.ligandsA, true)
    } else if (viewMode === "B") {
      buildComplex(rightGroup, 0, pair.ligandsB, pair.isomerType, false)
      if (showDipole) createDipoleArrow(rightGroup, 0, pair.ligandsB, false)
      if (showSymAxis) createSymmetryAxis(rightGroup, 0, pair.ligandsB, false, pair.isomerType)
      if (showDNA && pair.hasDNAtest) createDNAModel(rightGroup, 0, pair.ligandsB, false)
      if (showChelate && pair.isomerType === "cis_trans") createChelateTest(rightGroup, 0, pair.ligandsB, false)
    }

    scene.add(leftGroup)
    scene.add(rightGroup)

    if (viewMode === "both") {
      const vs = makeTextSprite("vs", {
        fontSize: 70, color: "#a78bfa",
        bgColor: "rgba(30, 15, 60, 0.9)", borderColor: "#a78bfa", scale: 0.5
      })
      vs.position.set(0, 0.5, 0)
      scene.add(vs); labelsRef.current.push(vs)
    }
  }, [pair, viewMode, buildComplex, createDipoleArrow, createSymmetryAxis, createDNAModel, createChelateTest, showDipole, showSymAxis, showDNA, showChelate])

  // ════════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const bgGeo = new THREE.SphereGeometry(50, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        color1: { value: new THREE.Color(0x0a0520) },
        color2: { value: new THREE.Color(0x1a0f38) }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform vec3 color1; uniform vec3 color2; varying vec3 vWorldPosition;
        void main() { float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(color1, color2, h), 1.0); }`
    })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 4, 14)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0520, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 4
    controls.maxDistance = 30
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(600 * 3)
    for (let i = 0; i < 600 * 3; i += 3) {
      const r = 20 + Math.random() * 15
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      sp[i] = r * Math.sin(ph) * Math.cos(th)
      sp[i + 1] = r * Math.sin(ph) * Math.sin(th)
      sp[i + 2] = r * Math.cos(ph)
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true
    })))

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        if (obj.userData && obj.userData.type === 'atom') {
          setSelectedAtom(obj.userData)
        }
      } else {
        setSelectedAtom(null)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    setTimeout(() => setLoading(false), 400)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener('click', onClick)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { rebuildScene() }, [rebuildScene])
  useEffect(() => { if (controlsRef.current) controlsRef.current.autoRotate = autoRotate }, [autoRotate])

  // ════════════════════════════════════════════════════════════
  // PDF GENERATSIYA
  // ════════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)
      let regularFont, boldFont, italicFont
      try {
        const [rBytes, bBytes, iBytes] = await Promise.all([
          fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic"); return r.arrayBuffer() })
        ])
        regularFont = await pdfDoc.embedFont(rBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(bBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(iBytes, { subset: true })
      } catch (e) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false); return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textGray: rgb(0.47, 0.47, 0.47),
        gold: rgb(0.80, 0.62, 0.05), blue: rgb(0.08, 0.31, 0.75),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), yellow: rgb(0.75, 0.60, 0.10),
        cyan: rgb(0.05, 0.55, 0.65), pink: rgb(0.90, 0.30, 0.55),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgCyan: rgb(0.90, 0.98, 1.0), bgPink: rgb(1.0, 0.94, 0.96),
        white: rgb(1, 1, 1)
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30
      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (t, f, s, w) => {
        const str = String(t)
        if (measure(str, f, s) <= w) return str
        let lo = 0, hi = str.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(str.slice(0, mid) + "…", f, s) <= w) lo = mid; else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (t, f, s, w) => {
        if (!t) return [""]
        const words = String(t).split(/\s+/)
        const lines = []; let cur = ""
        for (const wd of words) {
          const test = cur ? cur + " " + wd : wd
          if (measure(test, f, s) > w && cur) { lines.push(cur); cur = wd } else cur = test
          if (measure(cur, f, s) > w) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, f, s) > w) { lines.push(piece); piece = ch } else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }

      const addFooter = () => {
        const left = truncate(`Holat izomeriyasi 3D Lab  •  ${cleanText(pair.grossFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`, regularFont, 8, CONTENT_W - 30)
        page.drawText(left, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pStr = `${pageNum}`
        const w = measure(pStr, regularFont, 8)
        page.drawText(pStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({ start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 }, thickness: 0.3, color: C.grayLine })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
      const drawSectionHeader = (num, title) => {
        checkBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple })
        page.drawText(`${num}.`, { x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple })
        page.drawText(title, { x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark })
        y -= 30
      }
      const drawParagraph = (text, opts = {}) => {
        const { size = 10, font = regularFont, color = C.textDark, indent = 0 } = opts
        const lines = wrapText(cleanText(text), font, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, { x: MARGIN + indent, y, size, font, color })
          y -= size + 4
        }
        y -= 4
      }
      const drawBulletPoint = (text, color = C.purple) => {
        const size = 10, indent = 20
        checkBreak(size + 6)
        page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2, color })
        const lines = wrapText(cleanText(text), regularFont, size, CONTENT_W - indent)
        lines.forEach((line, i) => {
          if (i > 0) checkBreak(size + 3)
          page.drawText(line, { x: MARGIN + indent, y, size, font: regularFont, color: C.textDark })
          y -= size + 3
        })
        y -= 2
      }
      const drawInfoBox = (title, body, bgColor, borderColor) => {
        const size = 10, titleSize = 11, pad = 10
        const bodyLines = wrapText(cleanText(body), regularFont, size, CONTENT_W - 2 * pad)
        const boxH = titleSize + 8 + bodyLines.length * (size + 3) + 2 * pad
        checkBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor })
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: 3, height: boxH, color: borderColor })
        page.drawText(cleanText(title), { x: MARGIN + pad, y: y - pad - titleSize + 4, size: titleSize, font: boldFont, color: borderColor })
        let by = y - pad - titleSize - 8
        bodyLines.forEach(line => {
          page.drawText(line, { x: MARGIN + pad, y: by, size, font: regularFont, color: C.textDark })
          by -= size + 3
        })
        y -= boxH + 10
      }

      // MUQOVA
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })
      const t = "HOLAT (POZITSION) IZOMERIYASI"
      const tW = measure(t, boldFont, 20)
      page.drawText(t, { x: (PAGE_W - tW) / 2, y: PAGE_H - 80, size: 20, font: boldFont, color: C.white })
      const subtitle = "cis / trans va fac / mer izomerlar — fazoviy tuzilish tahlili"
      const sW = measure(subtitle, italicFont, 11)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 105, size: 11, font: italicFont, color: C.purpleLight })
      const formulaText = `${cleanText(pair.formulaA)}  vs  ${cleanText(pair.formulaB)}`
      const fW = measure(formulaText, boldFont, 12)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 150, size: 12, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan izomer juftligi", `${pair.title} — ${cleanText(pair.grossFormula)}`, C.bgPurple, C.purple)

      // 1. Kirish
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Holat izomeriyasi nima?")
        drawParagraph("Holat izomeriyasi (pozitsion yoki geometrik izomeriya) — koordinatsion birikmada ligandlar bir xil, koordinatsion sfera ham bir xil, ammo ligandlarning metall atrofidagi FAZOVIY JOYLASHUVI farq qiladigan izomeriya turi.")
        drawBulletPoint("Kvadrat-planar MA₂B₂ (KS=4): cis / trans izomerlar (masalan, sisplatin)")
        drawBulletPoint("Oktaedrik MA₄B₂ (KS=6): cis / trans (masalan, [Co(NH₃)₄Cl₂]⁺)")
        drawBulletPoint("Oktaedrik MA₃B₃: fac (facial) / mer (meridional)")
      }

      // 2. cis/trans asoslar
      if (pdfSections.cisTransBasics) {
        drawSectionHeader(2, "cis / trans izomerlar — asosiy nazariya")
        drawInfoBox("cis-izomer (Lotincha 'shu tomonda')", "Bir xil ligandlar QO'SHNI pozitsiyada joylashadi — 90° burchak. Odatda qutbli molekula (μ > 0), C₂ᵥ simmetriya.", C.bgYellow, C.gold)
        drawInfoBox("trans-izomer (Lotincha 'boshqa tomonda')", "Bir xil ligandlar QARAMA-QARSHI pozitsiyada — 180° burchak. Qutbsiz molekula (μ ≈ 0), D₂ₕ yoki D₄ₕ simmetriya, inversiya markazi.", C.bgCyan, C.cyan)
      }
      // 3. fac/mer
      if (pdfSections.facMer) {
        drawSectionHeader(3, "fac / mer izomerlar")
        drawInfoBox("fac (facial — 'yuz')", "MA₃B₃ oktaedrida 3 ta bir xil ligand oktaedr yuzini (uchburchakni) tashkil qiladi. C₃ᵥ simmetriya. Tridentat ligand faqat fac holatida bog'lanadi.", C.bgPink, C.pink)
        drawInfoBox("mer (meridional — 'meridian')", "3 ta bir xil ligand oktaedr meridianiga joylashadi. C₂ᵥ simmetriya. Uch xil koordinatsion muhit.", C.bgGreen, C.green)
      }

      // 4. Namunalar
      if (pdfSections.examples) {
        drawSectionHeader(4, "6 ta klassik izomer juftligi")
        const bgColors = [C.bgPink, C.bgPurple, C.bgOrange, C.bgGreen, C.bgBlue, C.bgYellow]
        const bColors = [C.pink, C.purple, C.orange, C.green, C.blue, C.gold]
        Object.values(POSITION_ISOMERS).forEach((iso, idx) => {
          checkBreak(50)
          drawInfoBox(`${idx + 1}. ${cleanText(iso.title)}`, `A: ${cleanText(iso.formulaA)}  |  B: ${cleanText(iso.formulaB)}  |  Turi: ${iso.isomerType === "cis_trans" ? "cis/trans" : "fac/mer"}, geometriya: ${iso.geometry === "square_planar" ? "kvadrat-planar" : "oktaedrik"}`, bgColors[idx % 6], bColors[idx % 6])
        })
      }

      // 5. Simmetriya
      if (pdfSections.symmetry) {
        drawSectionHeader(5, "Simmetriya va nuqta guruh (Point Group)")
        drawParagraph("Har bir izomerning simmetriya xususiyatlari nuqta guruh orqali aniqlanadi:")
        drawInfoBox(`A shakli simmetriyasi: ${cleanText(pair.symmetryA)}`, `Bu simmetriya guruhi molekulaning fazoviy xususiyatlarini belgilaydi — dipol moment, optik aktivlik, spektral polosalar soni.`, C.bgYellow, C.gold)
        drawInfoBox(`B shakli simmetriyasi: ${cleanText(pair.symmetryB)}`, `Yuqoriroq simmetriya odatda qutbsiz molekula, kamroq spektral polosalar va inversiya markazi mavjudligini ko'rsatadi.`, C.bgCyan, C.cyan)
      }

      // 6. Dipol
      if (pdfSections.dipole) {
        drawSectionHeader(6, "Dipol moment (μ) — Werner diagnostik uslubi")
        drawParagraph("Dipol moment (μ, Debye birligi) cis/trans izomerlarni ajratishning eng klassik uslubi. Werner 1893-yildan buni bashorat qildi:")
        drawInfoBox(`A shakli μ (${cleanText(pair.formulaA)})`, cleanText(pair.dipoleA), C.bgYellow, C.gold)
        drawInfoBox(`B shakli μ (${cleanText(pair.formulaB)})`, cleanText(pair.dipoleB), C.bgCyan, C.cyan)
        drawParagraph("Umumiy qonuniyat: cis → qutbli (μ > 0); trans → qutbsiz (μ ≈ 0). Bu M–X bog' vektorlari qo'shilishi/yo'q qilinishi natijasi.")
      }

      // 7. Sisplatin
      if (pdfSections.sisplatinMed && pair.hasDNAtest) {
        drawSectionHeader(7, "Sisplatin — tibbiyotdagi ahamiyati")
        drawInfoBox("Sisplatin (cis-[Pt(NH₃)₂Cl₂])", "Rosenberg 1965-yilda kashf qildi. FDA 1978-yilda tasdiqladi. Dunyoda yiliga 500,000+ bemor sisplatin va analoglari (karboplatin, oksaliplatin) bilan davolanadi. Testisular kanserida 95% shifo darajasi.", C.bgPink, C.pink)
        drawInfoBox("DNA bog'lanish mexanizmi", cleanText(pair.dnaBinding || "DNA guanin N7 ga bog'lanadi"), C.bgGreen, C.green)
        drawBulletPoint("cis-Pt: 2 Cl bir tomonda (Cl–Pt–Cl ≈ 90°, ~3.4 Å)")
        drawBulletPoint("DNA GG guaninlar orasidagi masofa ≈ 3.4 Å — aynan mos")
        drawBulletPoint("trans-Pt: 2 Cl qarama-qarshi — DNA bog'lanish geometrik jihatdan mumkin emas")
        drawBulletPoint("DNA crosslink → replikasiya to'xtaydi → hujayra apoptoziga uchraydi")
      }

      // 8. Tajribalar
      if (pdfSections.tests) {
        drawSectionHeader(8, "Tajribaviy tasdiqlash uslublari")
        drawParagraph("Ushbu tizim uchun diagnostik testlar:")
        pair.experimentalProof.forEach(p => drawBulletPoint(cleanText(p)))

        drawSectionHeader(9, "Umumiy ajratish uslublari")
        drawInfoBox("1) Dipol moment", "cis > 0 D, trans ≈ 0 D. Debye o'lchov.", C.bgYellow, C.gold)
        drawInfoBox("2) IR spektroskopiya", "cis: 2 ν(M–X) polosa; trans: 1 polosa.", C.bgBlue, C.blue)
        drawInfoBox("3) Raman", "trans da simmetrik cho'zilish faol (mutual exclusion).", C.bgGreen, C.green)
        drawInfoBox("4) NMR", "cis: 2 xil kimyoviy muhit; trans: 1 xil.", C.bgOrange, C.orange)
        drawInfoBox("5) X-ray", "cis 90°, trans 180° bog' burchagi.", C.bgPurple, C.purple)
        drawInfoBox("6) Xelat sinovi (Werner)", "Bidentat ligand (oksalat, en) faqat cis da xelat hosil qiladi.", C.bgPink, C.pink)
        drawInfoBox("7) Kurnakov testi", "Tiokarbamid bilan reaksiya Pt(II) uchun.", C.bgCyan, C.cyan)
      }

      // 9. Tarix
      if (pdfSections.history) {
        drawSectionHeader(10, "Kashfiyot tarixi")
        drawParagraph(cleanText(pair.discovery))
        drawInfoBox("Alfred Werner (1893) — koordinatsion nazariya", "Werner cis/trans izomerlarni oktaedrik va kvadrat-planar geometriyalar asosida bashorat qildi. Xelat sinovi bilan cis strukturasini isbotladi. 1913 Nobel.", C.bgPurple, C.purple)
        drawInfoBox("Nikolay Kurnakov (1904)", "Pt(II)/Pt(IV) komplekslarida cis/trans ni tiokarbamid testi bilan ajratdi.", C.bgBlue, C.blue)
        drawInfoBox("Barnett Rosenberg (1965) — sisplatin", "Michigan State University elektroliz tajribasida cis-Pt(NH₃)₂Cl₂ antitumor faolligini kashf etdi. 20-asrning eng muhim tibbiy kashfiyotlaridan.", C.bgPink, C.pink)
      }

      // 10. Jadval
      if (pdfSections.table) {
        drawSectionHeader(11, "Solishtirish jadvali")
        const rows = [
          ["Xususiyat", "A shakli (cis/fac)", "B shakli (trans/mer)"],
          ["Formula", cleanText(pair.formulaA), cleanText(pair.formulaB)],
          ["Rang", cleanText(pair.colorA).slice(0, 40), cleanText(pair.colorB).slice(0, 40)],
          ["Dipol μ", cleanText(pair.dipoleA).slice(0, 40), cleanText(pair.dipoleB).slice(0, 40)],
          ["Simmetriya", cleanText(pair.symmetryA).slice(0, 35), cleanText(pair.symmetryB).slice(0, 35)],
          ["Erishuvchanlik", cleanText(pair.solubilityA).slice(0, 40), cleanText(pair.solubilityB).slice(0, 40)]
        ]
        const colW = [CONTENT_W * 0.22, CONTENT_W * 0.39, CONTENT_W * 0.39]
        const rowH = 24
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          else if (ri % 2 === 0) page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          let cx = MARGIN + 8
          row.forEach((cell, ci) => {
            const txt = truncate(cleanText(cell), isHeader ? boldFont : regularFont, 8.5, colW[ci] - 12)
            page.drawText(txt, { x: cx, y: y - rowH + 8, size: 8.5, font: isHeader ? boldFont : regularFont, color: isHeader ? C.white : C.textDark })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // 11. Adabiyotlar
      if (pdfSections.references) {
        drawSectionHeader(12, "Adabiyotlar")
        const refs = [
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Z. Anorg. Chem., 3, 267–330.",
          "Werner, A. (1911). Zur Kenntnis des asymmetrischen Kobaltatoms. Ber. dtsch. chem. Ges., 44, 1887–1898.",
          "Kurnakov, N.S. (1904). Concerning the Chemistry of Platinum Compounds. J. Russian Chem. Soc., 36, 550.",
          "Rosenberg, B. et al. (1965). Inhibition of cell division in E. coli by electrolysis products from a platinum electrode. Nature, 205, 698–699.",
          "Rosenberg, B. et al. (1969). Platinum compounds: a new class of potent antitumour agents. Nature, 222, 385–386.",
          "Chatt, J., Wilkins, R.G. (1955). Kinetics of cis-trans isomerization. J. Chem. Soc., 4300–4306.",
          "Basolo, F., Pearson, R.G. (1967). Mechanisms of Inorganic Reactions (2nd ed.). Wiley.",
          "Cotton, F.A., Wilkinson, G. (1988). Advanced Inorganic Chemistry (5th ed.). Wiley.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson.",
          "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson.",
          "Wang, D., Lippard, S.J. (2005). Cellular processing of platinum anticancer drugs. Nature Rev. Drug Disc., 4, 307–320.",
          "Jamieson, E.R., Lippard, S.J. (1999). Structure, recognition and processing of cisplatin-DNA adducts. Chem. Rev., 99, 2467–2498.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations. RSC.",
          "Kauffman, G.B. (1966). Alfred Werner: Founder of Coordination Chemistry. Springer."
        ]
        refs.forEach((r, i) => {
          const size = 8.5
          const lines = wrapText(r, regularFont, size, CONTENT_W - 20)
          lines.forEach((ln, li) => {
            checkBreak(size + 3)
            const prefix = li === 0 ? `[${i + 1}]` : ""
            if (prefix) page.drawText(prefix, { x: MARGIN, y, size, font: boldFont, color: C.purple })
            page.drawText(ln, { x: MARGIN + 20, y, size, font: regularFont, color: C.textDark })
            y -= size + 3
          })
          y -= 3
        })
      }

      addFooter()
      pdfDoc.setTitle(`Holat izomeriyasi — ${cleanText(pair.title)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning holat izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["holat izomeriya", "cis trans", "fac mer", "sisplatin", "Werner"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `holat-izomeriya-${pair.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ════════════════════════════════════════════════════════════
  // RENDER (JSX)
  // ════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0">
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-pink-300 flex items-center gap-2 truncate">
              <span>🧭</span>
              <span className="hidden sm:inline">Holat izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Holat 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">{pair.grossFormula} • {pair.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select value={currentPair} onChange={(e) => setCurrentPair(e.target.value)} className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[300px]">
            <option value="Sisplatin">Sisplatin — cis/trans [Pt(NH₃)₂Cl₂]</option>
            <option value="CoNH3Cl_octa">[Co(NH₃)₄Cl₂]⁺ — Werner klassik</option>
            <option value="FacMer_CoCl3">fac/mer [Co(NH₃)₃Cl₃]</option>
            <option value="CrCl2en2">[CrCl₂(en)₂]⁺ — xelat + xiral</option>
            <option value="PdPPh3Cl">[Pd(PPh₃)₂Cl₂] — katalizator</option>
            <option value="PtBr2NH3">[Pt(NH₃)₂Br₂] — HSAB tahlili</option>
          </select>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`p-2 rounded-lg text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Avtomatik aylantirish">🔄</button>
          <button onClick={() => togglePanel("info")} className={`p-2 rounded-lg text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Ma'lumot">ℹ️</button>
          <button onClick={() => togglePanel("symmetry")} className={`p-2 rounded-lg text-sm ${activePanel === "symmetry" ? 'bg-green-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Simmetriya">⚛️</button>
          <button onClick={() => togglePanel("sisplatin")} className={`p-2 rounded-lg text-sm ${activePanel === "sisplatin" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Sisplatin tibbiyot">💊</button>
          <button onClick={() => togglePanel("facmer")} className={`p-2 rounded-lg text-sm ${activePanel === "facmer" ? 'bg-yellow-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="fac / mer">🔺</button>
          <button onClick={() => togglePanel("compare")} className={`p-2 rounded-lg text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Solishtirish">📊</button>
          <button onClick={() => togglePanel("tests")} className={`p-2 rounded-lg text-sm ${activePanel === "tests" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Tajribalar">🔬</button>
          <button onClick={() => togglePanel("history")} className={`p-2 rounded-lg text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Tarix">📜</button>
          <button onClick={() => togglePanel("test")} className={`p-2 rounded-lg text-sm ${activePanel === "test" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Test">🧠</button>
          <button onClick={() => setPdfModalOpen(true)} className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="PDF">📄</button>
          <button onClick={() => setFullscreenMode(true)} className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="To'liq ekran">🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button onClick={() => setFullscreenMode(false)} className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 shadow-2xl border border-purple-500/40">
          <span className="text-lg">✕</span>
        </button>
      )}

      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div ref={panelRef} className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[295px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`} style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}>
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
          >
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* Izomer badge */}
            <div className="mb-3 bg-gradient-to-r from-yellow-950/40 to-blue-950/40 rounded-lg border border-purple-700/40 p-2">
              <div className="text-[10px] text-purple-300 mb-1.5 uppercase tracking-wide font-bold">Izomer turi</div>
              <div className="flex gap-1.5 text-[10px]">
                <div className="flex-1 bg-yellow-900/40 border border-yellow-600/40 rounded px-2 py-1.5 text-yellow-100">
                  <div className="font-bold">{pair.isomerType === "fac_mer" ? "🔺 fac" : "🔽 cis"}</div>
                  <div className="text-[8.5px] opacity-80 truncate">{pair.formulaA}</div>
                </div>
                <div className="flex-1 bg-cyan-900/40 border border-cyan-600/40 rounded px-2 py-1.5 text-cyan-100">
                  <div className="font-bold">{pair.isomerType === "fac_mer" ? "🔽 mer" : "🔼 trans"}</div>
                  <div className="text-[8.5px] opacity-80 truncate">{pair.formulaB}</div>
                </div>
              </div>
            </div>

            {/* Ko'rinish */}
            <button onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")} className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 mb-2">
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <div className="text-[11px] text-purple-400 mb-1">Rejim:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setViewMode("both")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "both" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>Ikkalasi</button>
                  <button onClick={() => setViewMode("A")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "A" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>{pair.isomerType === "fac_mer" ? "fac" : "cis"}</button>
                  <button onClick={() => setViewMode("B")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "B" ? 'bg-cyan-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>{pair.isomerType === "fac_mer" ? "mer" : "trans"}</button>
                </div>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar (H)</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Burchak ko'rsatgichi (90°/180°)</span>
                  <input type="checkbox" checked={showAngles} onChange={(e) => setShowAngles(e.target.checked)} className="accent-yellow-500" />
                </label>
              </div>
            )}

            {/* Fazoviy analiz — dipol, simmetriya */}
            <button onClick={() => setExpandedSection(expandedSection === "spatial" ? null : "spatial")} className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 mb-2">
              <span className="flex items-center gap-2"><span>📏</span> Fazoviy analiz</span>
              <span>{expandedSection === "spatial" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "spatial" && (
              <div className="space-y-2 mb-3 px-1">
                <button onClick={() => setShowDipole(!showDipole)} className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between ${showDipole ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                  <span className="flex items-center gap-2"><span>➡️</span> Dipol vektori (μ)</span>
                  <span>{showDipole ? "☑" : "☐"}</span>
                </button>
                <p className="text-[9.5px] text-purple-400 italic px-1">cis: qutbli (μ  0), trans: qutbsiz (μ ≈ 0).</p>
                <button onClick={() => setShowSymAxis(!showSymAxis)} className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between ${showSymAxis ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                  <span className="flex items-center gap-2"><span>⚛️</span> Simmetriya o'qi</span>
                  <span>{showSymAxis ? "☑" : "☐"}</span>
                </button>
                <p className="text-[9.5px] text-purple-400 italic px-1">C₂, C₃, C₄ aylanish o'qlari va nuqta guruh.</p>

                {pair.hasDNAtest && (
                  <>
                    <button onClick={() => setShowDNA(!showDNA)} className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between ${showDNA ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                      <span className="flex items-center gap-2"><span>🧬</span> DNA bog'lanish</span>
                      <span>{showDNA ? "☑" : "☐"}</span>
                    </button>
                    <p className="text-[9.5px] text-purple-400 italic px-1">Sisplatin GG guanin N7 ga bog'lanadi.</p>
                  </>
                )}

                {pair.isomerType === "cis_trans" && (
                  <>
                    <button onClick={() => setShowChelate(!showChelate)} className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between ${showChelate ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                      <span className="flex items-center gap-2"><span>🔗</span> Xelat sinovi (Werner)</span>
                      <span>{showChelate ? "☑" : "☐"}</span>
                    </button>
                    <p className="text-[9.5px] text-purple-400 italic px-1">Bidentat oksalat faqat cis da xelat qiladi.</p>
                  </>
                )}
              </div>
            )}

            {/* Eksport */}
            <button onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")} className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 mb-2">
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button onClick={() => setPdfModalOpen(true)} className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium">📄 PDF hisobot yaratish</button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                Atomga bosing — batafsil ma'lumot. ➡️ Dipol vektori: cis da bor, trans da yo'q. ⚛️ Simmetriya o'qini yoqib nuqta guruhini ko'ring. 🧬 Sisplatin uchun DNA bog'lanish animatsiyasi.
              </p>
            </div>
          </div>
        </div>
        )}

        <div ref={containerRef} className="flex-1 w-full relative" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-purple-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {selectedAtom && !fullscreenMode && (
          <div className="absolute bottom-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-purple-200 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: selectedAtom.info?.color || '#888' }}></span>
                {selectedAtom.info?.name || selectedAtom.element}
              </h4>
              <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>
            <div className="space-y-1 text-xs text-purple-300">
              {selectedAtom.info?.atomic && <div><span className="text-purple-500">Atom raqami:</span> {selectedAtom.info.atomic}</div>}
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Massa:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfiguratsiya:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.info?.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.info.role}</div>}
              {selectedAtom.info?.cfse && <div><span className="text-purple-500">LFSE:</span> <span className="text-yellow-300">{selectedAtom.info.cfse}</span></div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.ligandName && <div><span className="text-purple-500">Ligand:</span> <span className="text-cyan-300">{selectedAtom.ligandName}</span></div>}
              {selectedAtom.charge && <div><span className="text-purple-500">Zaryad:</span> <span className="font-mono text-pink-300">{selectedAtom.charge}</span></div>}
              {selectedAtom.tag === "A" && !selectedAtom.isCenter && <div className="mt-2 text-yellow-400 font-bold">🟡 {pair.isomerType === "fac_mer" ? "fac" : "cis"}-shakl</div>}
              {selectedAtom.tag === "B" && !selectedAtom.isCenter && <div className="mt-2 text-cyan-400 font-bold">🔵 {pair.isomerType === "fac_mer" ? "mer" : "trans"}-shakl</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">💎 Markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm"><span>ℹ️</span> {pair.title}</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Umumiy formula</div>
                <div className="font-mono text-sm text-white text-center">{pair.grossFormula}</div>
                <div className="text-purple-300 text-[10px] mt-1 text-center italic">Geometriya: {pair.geometry === "square_planar" ? "kvadrat-planar (KS=4)" : "oktaedrik (KS=6)"}</div>
              </div>
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🟡 {pair.isomerType === "fac_mer" ? "fac" : "cis"}-SHAKL</div>
                <div className="text-yellow-100 text-[11px] font-mono">{pair.formulaA}</div>
                <div className="text-yellow-100 text-[10px] mt-1 italic">{pair.nameA}</div>
                <div className="text-yellow-100 text-[10px] mt-1">Rang: {pair.colorA}</div>
                <div className="text-yellow-100 text-[10px] mt-0.5">Dipol: {pair.dipoleA}</div>
              </div>
              <div className="text-center text-purple-400 text-lg">vs</div>
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🔵 {pair.isomerType === "fac_mer" ? "mer" : "trans"}-SHAKL</div>
                <div className="text-cyan-100 text-[11px] font-mono">{pair.formulaB}</div>
                <div className="text-cyan-100 text-[10px] mt-1 italic">{pair.nameB}</div>
                <div className="text-cyan-100 text-[10px] mt-1">Rang: {pair.colorB}</div>
                <div className="text-cyan-100 text-[10px] mt-0.5">Dipol: {pair.dipoleB}</div>
              </div>
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Reaktivligi</div>
                <div className="text-blue-100 text-[10px] leading-relaxed space-y-1">
                  <div><span className="text-yellow-300">▸ A:</span> {pair.reactivityA}</div>
                  <div><span className="text-cyan-300">▸ B:</span> {pair.reactivityB}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* — SIMMETRIYA PANELI — */}
        {activePanel === "symmetry" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-green-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-green-200 flex items-center gap-2 text-sm"><span>⚛️</span> Simmetriya va nuqta guruh</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <p className="text-green-100 text-[10.5px] leading-relaxed">
                  Har bir izomerning <strong>nuqta guruhi (point group)</strong> uning fazoviy simmetriya xususiyatlarini belgilaydi. Nuqta guruh Schönflies nomenklaturasida yoziladi: <strong>Cₙ, Dₙ, T, O, I</strong>.
                </p>
              </div>
              <div className="bg-yellow-950/50 rounded-lg p-3 border-2 border-yellow-500/50">
                <div className="text-yellow-200 font-bold text-[11px] mb-1">🟡 A shakli: {pair.symmetryA}</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">Odatda cis/fac holatlarda kuchsizroq simmetriya (C₂ᵥ, C₃ᵥ). Bu qutbli molekula va spektral polosalar ko'p ekanligiga olib keladi.</p>
              </div>
              <div className="bg-cyan-950/50 rounded-lg p-3 border-2 border-cyan-500/50">
                <div className="text-cyan-200 font-bold text-[11px] mb-1">🔵 B shakli: {pair.symmetryB}</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">Trans/mer holatlarda odatda yuqoriroq simmetriya (D₂ₕ, D₄ₕ). Inversiya markazi mavjud — qutbsiz molekula.</p>
              </div>
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1.5">🔬 Simmetriya elementlari</div>
                <ul className="text-purple-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• <strong>Cₙ</strong> — n-tartibli aylanish o'qi (aylantirish 360°/n)</li>
                  <li>• <strong>σᵥ / σₕ</strong> — vertikal / gorizontal simmetriya tekisligi</li>
                  <li>• <strong>i</strong> — inversiya markazi (x,y,z → –x,–y,–z)</li>
                  <li>• <strong>Sₙ</strong> — aylantirish-inversiya o'qi</li>
                  <li>• <strong>E</strong> — birlik elementi</li>
                </ul>
              </div>
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">📐 Qutblilik qonuni</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Molekula QUTBLI bo'ladi agarda: (1) inversiya markazi (i) yo'q VA (2) Cn o'qi bilan mos kelmaydigan σₕ tekislik yo'q. cis izomerlar odatda qutbli (Cₙᵥ), trans izomerlar qutbsiz (Dₙₕ).
                </p>
              </div>
              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">🔄 Xirallik</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Molekula XIRAL (optik faol) bo'ladi agarda simmetriya guruhida <strong>faqat Cn o'qlari</strong> mavjud bo'lsa (σ, i, Sₙ elementlari yo'q). Masalan, cis-[CrCl₂(en)₂]⁺ xiral — Δ va Λ enantiomerlar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — SISPLATIN PANELI — */}
        {activePanel === "sisplatin" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-pink-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pink-200 flex items-center gap-2 text-sm"><span>💊</span> Sisplatin va kanser terapiyasi</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-pink-950/40 rounded-lg p-3 border-2 border-pink-500/60">
                <div className="text-pink-300 font-bold text-[11px] mb-1">🌟 Kashfiyot tarixi (1965)</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">
                  <strong>Barnett Rosenberg</strong> Michigan State University (AQSh)da E. coli bakteriyalarida elektr maydonining hujayra bo'linishiga ta'sirini o'rgangan. Platina elektrodlari va ammiakli eritmada sisplatin (cis-[Pt(NH₃)₂Cl₂]) tasodifan hosil bo'lgan va u bakteriyalar bo'linishini to'xtatgan.
                </p>
              </div>
              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">🏥 Klinik ma'lumotlar</div>
                <ul className="text-green-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• <strong>FDA tasdiqi:</strong> 1978-yil</li>
                  <li>• <strong>Yiliga bemorlar:</strong> 500,000+ (dunyoda)</li>
                  <li>• <strong>Testisular kanseri:</strong> 95% shifo darajasi (Lance Armstrong — taniqli misol)</li>
                  <li>• <strong>Boshqa kanserlar:</strong> tuxumdon, siydik pufagi, o'pka, bo'yin va bosh</li>
                  <li>• <strong>Analoglar:</strong> karboplatin (1989), oksaliplatin (2002), satraplatin, iproplatin</li>
                </ul>
              </div>
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">🧬 DNA bilan bog'lanish mexanizmi</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Sisplatin qonda gidroliz bo'ladi: cis-[Pt(NH₃)₂Cl₂] → cis-[Pt(NH₃)₂(H₂O)Cl]⁺ → cis-[Pt(NH₃)₂(H₂O)₂]²⁺ (labil suv). Bu shakl DNA guanin bazasidagi N7 atomiga bog'lanadi.
                </p>
                <p className="text-blue-100 text-[10px] leading-relaxed mt-1.5">
                  Ikkinchi guanin bilan bog'lanish natijasida <strong>DNA crosslink</strong> hosil bo'ladi. Bu — DNA replikasiyasini to'xtatadi — hujayra <strong>apoptozga</strong> uchraydi.
                </p>
              </div>
              <div className="bg-orange-950/50 rounded-lg p-3 border-2 border-orange-500/60">
                <div className="text-orange-300 font-bold text-[11px] mb-1">🤔 Nima uchun faqat CIS?</div>
                <ul className="text-orange-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• <strong>cis-Pt:</strong> 2 Cl bir tomonda (~3.4 Å masofa)</li>
                  <li>• <strong>DNA GG:</strong> 2 qo'shni guanin N7 orasidagi masofa — <strong>aynan 3.4 Å</strong></li>
                  <li>• <strong>trans-Pt:</strong> 2 Cl qarama-qarshi tomonda (180°) — geometrik jihatdan mos emas</li>
                  <li>• <strong>Xulosa:</strong> faqat cis shakli DNA crosslink hosil qila oladi — shuning uchun trans-platin biofaol emas</li>
                </ul>
              </div>
              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">⚠️ Yon ta'sirlar</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Nefrotoksiklik (buyrak zararlanishi), ototoksiklik (eshitish yo'qolishi), ko'ngil aynish, so'rovlanish. Yangi Pt(IV) prodrug lar (satraplatin) yon ta'sirlarni kamaytiradi.
                </p>
              </div>
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">🔬 Analoglar</div>
                <ul className="text-cyan-100 text-[10px] space-y-0.5">
                  <li>• <strong>Karboplatin (1989)</strong> — sikllobutanikarboksilat, kam toksik</li>
                  <li>• <strong>Oksaliplatin (2002)</strong> — (1R,2R)-tsiklogeksandiamin, kolorektal kanser</li>
                  <li>• <strong>Satraplatin</strong> — Pt(IV) prodrug, og'iz orqali qabul qilinadi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* — FAC/MER PANELI — */}
        {activePanel === "facmer" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-yellow-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-200 flex items-center gap-2 text-sm"><span>🔺</span> fac / mer izomerlar</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <p className="text-yellow-100 text-[10.5px] leading-relaxed">
                  <strong>fac / mer izomerlar</strong> — oktaedrik MA₃B₃ tipida uchraydi. 3 ta bir xil ligand oktaedrda ikki xil joylashish mumkin.
                </p>
              </div>
              <div className="bg-pink-950/50 rounded-lg p-3 border-2 border-pink-500/60">
                <div className="text-pink-300 font-bold text-[11px] mb-1">🔺 fac (facial) — 'yuz'</div>
                <ul className="text-pink-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• 3 ta bir xil ligand oktaedr YUZINI (uchburchak) tashkil qiladi</li>
                  <li>• Uchbursidagi burchaklar barchasi 90°</li>
                  <li>• Simmetriya: <strong>C₃ᵥ</strong> — C₃ aylanish o'qi + 3 vertikal tekislik</li>
                  <li>• <strong>Faqat 1 xil kimyoviy muhit</strong> — NMR da 1 signal</li>
                  <li>• Uchdonor xelat ligand (tridentat) faqat fac holatida bog'lanadi</li>
                  <li>• Trientin (dietilentriamin H₂N-CH₂-CH₂-NH-CH₂-CH₂-NH₂) → fac-selektiv</li>
                </ul>
              </div>
              <div className="bg-green-950/50 rounded-lg p-3 border-2 border-green-500/60">
                <div className="text-green-300 font-bold text-[11px] mb-1">🔽 mer (meridional) — 'meridian'</div>
                <ul className="text-green-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• 3 ta bir xil ligand oktaedr MERIDIANIGA (dumaloq yo'liga) joylashadi</li>
                  <li>• Burchaklar: 2 x 90° + 1 x 180°</li>
                  <li>• Simmetriya: <strong>C₂ᵥ</strong> — kuchsizroq</li>
                  <li>• <strong>2 xil kimyoviy muhit</strong> — NMR da 2 signal (1:2 nisbatda)</li>
                  <li>• Uchdonor xelat ligandlar odatda mos kelmaydi</li>
                </ul>
              </div>
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1.5">🎯 Ajratish uslublari</div>
                <ul className="text-purple-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• <strong>NMR:</strong> fac — 1 signal, mer — 2 signal (nisbat 2:1)</li>
                  <li>• <strong>IR:</strong> fac — kam polosa (simmetriya), mer — ko'p polosa</li>
                  <li>• <strong>Dipol:</strong> fac — katta (5–6 D), mer — kichik (1–3 D)</li>
                  <li>• <strong>Xelat sinovi:</strong> tridentat ligand faqat fac da mos keladi</li>
                </ul>
              </div>
              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[11px] mb-1">📚 Tarix va nomenklatura</div>
                <p className="text-orange-100 text-[10px] leading-relaxed">
                  fac/mer atamalari <strong>Basolo va Pearson (1958)</strong> tomonidan taklif qilingan. Werner davrida oktaedrik izomerlar aniqlangan, lekin zamonaviy IUPAC nomenklatura (1971) fac/mer atamalarini qabul qildi. Bugungi kunda katalizda va tabiiy metalloproteinlar strukturasida muhim.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm"><span>📊</span> Solishtirish jadvali</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-purple-800/50">
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-purple-100">Xususiyat</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-yellow-300">🟡 {pair.isomerType === "fac_mer" ? "fac" : "cis"}</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-cyan-300">🔵 {pair.isomerType === "fac_mer" ? "mer" : "trans"}</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Formula</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{pair.formulaA}</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{pair.formulaB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorB}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Dipol μ</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.dipoleA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.dipoleB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Simmetriya</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.symmetryA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.symmetryB}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Erishuvchanlik</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.solubilityA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.solubilityB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Tibbiyotda</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.medicalUseA.slice(0, 60)}...</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.medicalUseB.slice(0, 60)}...</td></tr>
              </tbody>
            </table>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>IUPAC nomenklatura:</strong> cis, trans, fac, mer prefiksni formulaning boshiga qo'yiladi va kursiv yoziladi.
            </div>
          </div>
        )}

        {/* — TAJRIBALAR — */}
        {activePanel === "tests" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm"><span>🔬</span> Tajribaviy tasdiqlash</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <p className="text-cyan-100 text-[10.5px] leading-relaxed">
                  Ushbu tizim uchun aniq diagnostik testlar va ularning natijalari:
                </p>
              </div>
              {pair.experimentalProof.map((p, i) => (
                <div key={i} className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/40">
                  <div className="text-purple-300 font-bold text-[10.5px] mb-1">{i + 1}-usul</div>
                  <p className="text-purple-100 text-[10px] leading-relaxed">{p}</p>
                </div>
              ))}
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[10.5px] mb-1">📌 Umumiy ajratish uslublari</div>
                <ul className="text-blue-100 text-[9.5px] space-y-0.5 leading-relaxed">
                  <li>• <strong>Dipol moment (μ):</strong> cis  0, trans ≈ 0 (Werner klassik)</li>
                  <li>• <strong>IR:</strong> cis — 2 ta ν(M–X) polosa, trans — 1 ta</li>
                  <li>• <strong>Raman:</strong> trans da simmetrik cho'zilish faol</li>
                  <li>• <strong>NMR (¹⁹⁵Pt, ³¹P, ¹³C):</strong> kimyoviy muhit farqi</li>
                  <li>• <strong>X-ray:</strong> bog' burchagi 90° vs 180°</li>
                  <li>• <strong>Xelat sinovi (Werner):</strong> oksalat/en faqat cis da</li>
                  <li>• <strong>Kurnakov test (Pt):</strong> tiokarbamid bilan</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm"><span>📜</span> Kashfiyot tarixi</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{pair.discovery}</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1893 — Werner koordinatsion nazariya</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Alfred Werner (Sürix) cis va trans izomerlar mavjudligini oktaedrik va kvadrat-planar geometriyalar asosida bashorat qildi. Xelat (oksalat) sinovi bilan cis strukturasini isbotladi.</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1904 — Kurnakov (Sankt-Peterburg)</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">Nikolay Kurnakov Pt(II) va Pt(IV) komplekslarida cis/trans izomerlarni tiokarbamid testi orqali ajratdi. Rus koordinatsion kimyosining asoschisi.</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1911 — Werner xiral kompleks kashfiyoti</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Werner cis-[Co(en)₂Cl₂]⁺ izomerini xiral bo'lgan holda ajratdi (V.L. King bilan). Bu — birinchi optik faol koordinatsion birikma. Koordinatsion nazariyaning hal qiluvchi eksperimental g'alabasi.</p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1913 — Werner Nobel mukofoti</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">'Kimyo tuzilish nazariyasiga ajoyib hissasi uchun' — noorganik kimyoda birinchi Nobel mukofoti.</p>
              </div>
              <div className="border-l-2 border-orange-500 pl-3">
                <div className="text-orange-300 font-bold text-[11px]">1955 — Chatt va Wilkins</div>
                <p className="text-orange-200 text-[10px] leading-relaxed">Kvadrat-planar Pt(II) komplekslarida cis-trans izomerlanish kinetikasi va trans-effect nazariyasini rivojlantirdilar.</p>
              </div>
              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1958 — Basolo va Pearson</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">'fac' va 'mer' atamalarini taklif qilishdi. Northwestern University da koordinatsion mexanizmlar kitobi (1967).</p>
              </div>
              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1965 — Rosenberg va SISPLATIN</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Barnett Rosenberg cis-[Pt(NH₃)₂Cl₂] antitumor faolligini kashf etdi. 1978 — FDA tasdig'i. Bu — 20-asrning eng muhim tibbiy kashfiyotlaridan biri.</p>
              </div>
              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-cyan-300 font-bold text-[11px]">2010 — Nobel (Pd katalizator)</div>
                <p className="text-cyan-200 text-[10px] leading-relaxed">Heck, Negishi, Suzuki Pd katalizator uchun Nobel mukofoti oldilar. Bu — cis/trans-[Pd(PPh₃)₂X₂] komplekslariga asoslangan.</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-pink-700/50 w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pink-200 flex items-center gap-2 text-sm"><span>🧠</span> O'z-o'zini sinash</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion q="Holat (pozitsion) izomeriya nima?" a="Koordinatsion birikmada ligandlar va koordinatsion sfera bir xil, ammo ligandlarning metall atrofidagi fazoviy joylashuvi farq qiladigan izomeriya turi. cis/trans va fac/mer asosiy turlari." />
              <TestQuestion q="cis va trans izomerlarni qanday ajratamiz?" a="1) Dipol moment: cis > 0 D, trans ≈ 0 D; 2) IR: cis — 2 ta ν(M–X) polosa, trans — 1 ta; 3) NMR: cis 2 xil muhit, trans 1 xil; 4) X-ray: 90° vs 180°; 5) Xelat sinovi (Werner) — faqat cis xelat qiladi." />
              <TestQuestion q="Sisplatin nima uchun kanser davolashda ishlaydi, transplatin esa yo'q?" a="cis-[Pt(NH₃)₂Cl₂] da 2 Cl bir tomonda ~3.4 Å masofada. Bu — DNA da qo'shni guanin bazalar orasidagi masofa. Sisplatin GG guaninlar N7 atomlariga bog'lanib crosslink hosil qiladi — DNA replikasiyasi to'xtaydi — kanser hujayralari o'ladi. Trans-Pt da 2 Cl qarama-qarshi (180°), DNA ga geometrik jihatdan mos emas." />
              <TestQuestion q="fac va mer izomerlar farqi nimada?" a="MA₃B₃ oktaedrida: fac — 3 bir xil ligand uchburchak yuzda (C₃ᵥ simmetriya, NMR 1 signal); mer — 3 bir xil ligand meridianda (C₂ᵥ simmetriya, NMR 2 signal 2:1 nisbatda). Tridentat xelat ligand faqat fac da bog'lanadi." />
              <TestQuestion q="Nima uchun cis-[CrCl₂(en)₂]⁺ xiral, ammo trans emas?" a="cis shakli faqat C₂ aylanish o'qiga ega, tekislik va inversiya markazi yo'q — bu XIRAL molekula belgisi. Δ (delta) va Λ (lambda) enantiomerlar hosil bo'ladi. Trans shakli esa C₂ₕ simmetriyada, inversiya markazi bor — optik faol emas." />
              <TestQuestion q="Werner cis strukturasini qanday isbotladi?" a="Xelat sinovi orqali — bidentat oksalat ligand (C₂O₄²⁻) faqat cis holatida (2 Cl qo'shni pozitsiyada) 2 ta O atomi bilan bog'lanib xelat halqa hosil qila oladi. Trans-[Co(NH₃)₄Cl₂]⁺ da 2 Cl 180° qarama-qarshi — oksalat mos kelmaydi. Bu Werner koordinatsion nazariyasining hal qiluvchi isboti bo'ldi." />
              <TestQuestion q="cis-[Pt(NH₃)₂Cl₂] va trans-[Pt(NH₃)₂Cl₂] dipol momentlari?" a="cis: μ = 3.42 D (kuchli qutbli — Pt–Cl vektorlari bir tomonga qo'shiladi). trans: μ = 0.00 D (Pt–Cl vektorlari qarama-qarshi yo'q qilinadi). Bu farq elektr maydonda molekulani orientatsiya qilish orqali o'lchanadi." />
              <TestQuestion q="trans-effect nima?" a="Kvadrat-planar Pt(II) komplekslarida bir ligand qarshi (trans) holatidagi bog'ni zaiflashtirishi. Chatt va Wilkins (1955) nazariyasi: I⁻ > CN⁻ > NO₂⁻ > H₂O > NH₃ > OH⁻. Bu sisplatin sintezi va Pd katalizatorlarida asos rol o'ynaydi." />
              <TestQuestion q="Kurnakov testi nima va qanday ishlaydi?" a="Nikolay Kurnakov (1904) taklif qilgan test: tiokarbamid CS(NH₂)₂ kvadrat-planar Pt(II) komplekslariga qo'shilganda cis va trans turli mahsulot beradi. cis-[Pt(NH₃)₂Cl₂] da 2 ta thiourea Cl o'rniga kiradi. Trans-[Pt(NH₃)₂Cl₂] da esa NH₃ lar ham chiqadi (4 ta thiourea kiradi). Sanoat va analitik uslub." />
              <TestQuestion q="Karboplatin va oksaliplatin sisplatindan qanday farq qiladi?" a="Ular ham cis-Pt(NH₃)₂X₂ tipida, lekin 2 Cl o'rniga xelat ligand qo'shilgan: karboplatinda — sikllobutan-1,1-dikarboksilat; oksaliplatinda — oksalat va (1R,2R)-tsiklogeksandiamin. Xelat effekt sabab kam toksik, bemorlar yaxshiroq chidashadi. cis-geometriya saqlanib qoladi — shuning uchun DNA bog'lanish faolligi mavjud." />
            </div>
          </div>
        )}

        {/* — PDF MODAL — */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPdfModalOpen(false)}>
            <div className="bg-purple-950 rounded-2xl border border-purple-600/50 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50">
                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2"><span>📄</span> PDF hisobot yaratish</h3>
                <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs text-purple-400 mb-2">Qaysi bo'limlarni PDFga qo'shishni tanlang:</p>
                {[
                  { k: "intro", label: "1. Kirish — holat izomeriyasi", icon: "📖" },
                  { k: "cisTransBasics", label: "2. cis / trans nazariya", icon: "🔄" },
                  { k: "facMer", label: "3. fac / mer izomerlar", icon: "🔺" },
                  { k: "examples", label: "4. 6 ta klassik namuna", icon: "🧪" },
                  { k: "symmetry", label: "5. Simmetriya va nuqta guruh", icon: "⚛️" },
                  { k: "dipole", label: "6. Dipol moment (Werner)", icon: "➡️" },
                  { k: "sisplatinMed", label: "7. Sisplatin (tibbiyot)", icon: "💊" },
                  { k: "tests", label: "8. Tajribaviy uslublar", icon: "🔬" },
                  { k: "history", label: "9. Kashfiyot tarixi", icon: "📜" },
                  { k: "table", label: "10. Solishtirish jadvali", icon: "📊" },
                  { k: "references", label: "11. Adabiyotlar", icon: "📚" }
                ].map(({ k, label, icon }) => (
                  <label key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/40 cursor-pointer">
                    <input type="checkbox" checked={pdfSections[k]} onChange={(e) => setPdfSections({ ...pdfSections, [k]: e.target.checked })} className="accent-purple-500 w-4 h-4" />
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm text-purple-200">{label}</span>
                  </label>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-purple-800/50 flex gap-2 justify-end">
                <button onClick={() => setPdfModalOpen(false)} className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200" disabled={pdfGenerating}>Bekor qilish</button>
                <button onClick={generatePDF} disabled={pdfGenerating} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center gap-2">
                  {pdfGenerating ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Yaratilmoqda...</>
                  ) : (
                    <>📄 PDFni yuklab olish</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {!fullscreenMode && (
        <div className="flex justify-center gap-3 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#D0D0E0]"></div><span className="text-purple-300">Pt</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#006985]"></div><span className="text-purple-300">Pd</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#A62929]"></div><span className="text-purple-300">Br</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF8000]"></div><span className="text-purple-300">P</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-400/30"></div><span className="text-purple-300">cis/fac</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-400/30"></div><span className="text-purple-300">trans/mer</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-pink-400 bg-pink-400/30"></div><span className="text-purple-300">Dipol μ</span></div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(88, 28, 135, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>
    </main>
  )
}

// ────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli
// ────────────────────────────────────────────────────────────
function TestQuestion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-pink-950/30 rounded-lg border border-pink-800/40 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-3 py-2 hover:bg-pink-900/30 transition-colors flex items-start gap-2">
        <span className="text-pink-400 flex-shrink-0">❓</span>
        <span className="text-pink-100 text-[11px] leading-relaxed">{q}</span>
        <span className="ml-auto text-pink-500 text-xs flex-shrink-0">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-pink-950/50 border-t border-pink-800/40">
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <span className="text-green-100 text-[11px] leading-relaxed">{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}
