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
  S: 0xFFFF30, Cl: 0x1FF01F, K: 0x8F40D4, Br: 0xA62929,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  cation: 0xFFD700,   // Kation halosi — oltin
  anion:  0x66CCFF    // Anion halosi — moviy
}

// ═══════════════════════════════════════════════════════════════════════════
// KOORDINATSION IZOMERLAR DATABASE
// ────────────────────────────────────────────────────────────────────────────
// Koordinatsion izomeriya — HAM kation, HAM anion kompleks bo'lgan tuzda,
// ligandlar ikki koordinatsion sfera orasida boshqacha taqsimlangan holat.
// Umumiy formula bir xil bo'ladi, faqat ligandlarning taqsimoti farq qiladi.
// ═══════════════════════════════════════════════════════════════════════════
const COORDINATION_ISOMERS = {

  // ─────────────────────────────────────────────────────────────────
  // 1. KLASSIK NAMUNA — [Co(NH3)6][Cr(CN)6] ⇌ [Cr(NH3)6][Co(CN)6]
  // Werner tomonidan aniqlangan birinchi koordinatsion izomer juftligi
  // ─────────────────────────────────────────────────────────────────
  CoCr_NH3_CN: {
    id: "CoCr_NH3_CN",
    title: "Klassik namuna — Co/Cr ⇌ Cr/Co",
    shortTitle: "Co↔Cr almashinuvi",
    grossFormula: "Co Cr (NH₃)₆ (CN)₆",
    formulaA: "[Co(NH₃)₆][Cr(CN)₆]",
    formulaB: "[Cr(NH₃)₆][Co(CN)₆]",
    nameA: "Geksaamminkobalt(III) geksatsianoxromat(III)",
    nameB: "Geksaamminxrom(III) geksatsianokobaltat(III)",
    // Kation A / Anion A
    cationA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", ligand: "NH3", ligandCount: 6, chargeText: "3+" },
    anionA:  { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", ligand: "CN", ligandCount: 6, chargeText: "3−" },
    // Kation B / Anion B (ligandlar almashadi)
    cationB: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", ligand: "NH3", ligandCount: 6, chargeText: "3+" },
    anionB:  { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", ligand: "CN", ligandCount: 6, chargeText: "3−" },
    colorA: "Kation to'q sariq, anion och sariq — birgalikda qizg'ish-sariq tuz",
    colorB: "Kation binafsha (Cr–NH₃ MO), anion och sariq — binafsha-sariq tuz",
    stabilityA: "[Co(NH₃)₆]³⁺ juda inert (d⁶ LS, LFSE = −2.4 Δₒ), [Cr(CN)₆]³⁻ ham inert. Kinetik jihatdan ikkalasi ham juda barqaror.",
    stabilityB: "[Cr(NH₃)₆]³⁺ lisdan sekin gidrolizlanadi; [Co(CN)₆]³⁻ juda kuchli (log β₆ ≈ 64). Termodinamik jihatdan A shakli afzalroq.",
    dnDistribution: "A: Co³⁺(d⁶ LS) – NH₃ va Cr³⁺(d³) – CN⁻ ; B: Cr³⁺(d³) – NH₃ va Co³⁺(d⁶ LS) – CN⁻",
    cfseNote: "CN⁻ juda kuchli maydon ligandi — spektroximik qatorda eng oxirida. Co³⁺(d⁶) uchun kuchli maydon ligandi maksimal LFSE beradi (−2.4 Δₒ). Shuning uchun B ({Co(CN)₆}³⁻) shakli termodinamik afzal.",
    discovery: "Alfred Werner (1907, Berichte der deutschen chemischen Gesellschaft) — [Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] ni birinchi bo'lib alohida ajratib, kristallografik va kimyoviy xususiyatlari orqali ular haqiqatan ikki xil modda ekanligini isbotladi. Bu — koordinatsion izomeriya kashfiyoti.",
    application: "Analitik kimyoda [Co(NH₃)₆][Cr(CN)₆] tipidagi tuzlar sifat reaksiyalarida foydalaniladi. Bu tuzlar CN⁻ va NH₃ ligandlar afinitesini o'lchash uchun etalon sifatida ishlatiladi.",
    experimentalProof: [
      "Ikki tuz turli erishuvchanlikka ega (Ksp farqi ≈ 10³).",
      "IR-spektroskopiya: ν(C≡N) chastotasi Co(CN)₆³⁻ da 2129 sm⁻¹, Cr(CN)₆³⁻ da 2126 sm⁻¹ — kichik, lekin farqli.",
      "UV-VIS: [Co(NH₃)₆]³⁺ 475 nm da (⁵T₁g ← ¹A₁g); [Cr(NH₃)₆]³⁺ 465 va 350 nm da (⁴T₂g, ⁴T₁g ← ⁴A₂g).",
      "Magnetokimyo: A tuzida barcha markazlar low-spin, μ_eff ≈ 3.87 μ_B (Cr³⁺ dan); B tuzida ham 3.87 μ_B — magnit farqlash bo'lmaydi.",
      "X-ray difraktsiyada elementar yacheyka o'lchamlari bir-biridan farq qiladi (a≈10.9 Å vs a≈10.7 Å)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Cu-Pt — kvadrat-planar, klassik ikkinchi namuna
  // ─────────────────────────────────────────────────────────────────
  CuPt_NH3_Cl: {
    id: "CuPt_NH3_Cl",
    title: "Cu / Pt — kvadrat-planar sistemasi",
    shortTitle: "Cu↔Pt almashinuvi",
    grossFormula: "Cu Pt (NH₃)₄ Cl₄",
    formulaA: "[Cu(NH₃)₄][PtCl₄]",
    formulaB: "[Pt(NH₃)₄][CuCl₄]",
    nameA: "Tetraamminmis(II) tetraxloroplatina(II)",
    nameB: "Tetraamminplatina(II) tetraxlorokupral(II)",
    cationA: { metal: "Cu", charge: "+2", color: CPK.Cu, radius: 0.40, geometry: "square_planar", ligand: "NH3", ligandCount: 4, chargeText: "2+" },
    anionA:  { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar", ligand: "Cl", ligandCount: 4, chargeText: "2−" },
    cationB: { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar", ligand: "NH3", ligandCount: 4, chargeText: "2+" },
    anionB:  { metal: "Cu", charge: "+2", color: CPK.Cu, radius: 0.40, geometry: "square_planar", ligand: "Cl", ligandCount: 4, chargeText: "2−" },
    colorA: "Ko'k [Cu(NH₃)₄]²⁺ + pushti [PtCl₄]²⁻ = binafsha-pushti kristallar",
    colorB: "Rangsiz [Pt(NH₃)₄]²⁺ + sariq [CuCl₄]²⁻ = zangori-sariq kristallar",
    stabilityA: "Cu²⁺ (d⁹, Jahn–Teller cho'zilgan) + NH₃ komplekasi log β₄ = 12.03. Pt²⁺ (d⁸) juda inert — kinetik barqarorlikda oldindir.",
    stabilityB: "Pt²⁺ (d⁸ kvadrat-planar) NH₃ bilan juda kuchli bog'lanadi (log β₄ ≈ 35). Cu²⁺ Cl⁻ bilan zaifroq. Termodinamik afzal — B shakli.",
    dnDistribution: "A: Cu²⁺(d⁹, kvadrat-planar+JT) – NH₃; Pt²⁺(d⁸) – Cl⁻ | B: Pt²⁺(d⁸) – NH₃; Cu²⁺(d⁹, JT tetraedrik-buzilgan) – Cl⁻",
    cfseNote: "d⁸ (Pt²⁺) — kvadrat-planar geometriyada eng yuqori LFSE (−1.45 Δₒ). Yumshoq kislota Pt²⁺ NH₃ (yumshoqroq donor) va Cl⁻ (yumshoq) bilan bir xil kuchli bog'lanadi. Bu — HSAB va kristall maydon nazariyasining birlashgan ta'siri.",
    discovery: "Magnus tuzi ([Pt(NH₃)₄][PtCl₄], 1828) — Heinrich Gustav Magnus (Berlin) tomonidan kashf etilgan birinchi kvadrat-planar kompleks. Uning izomerlari 1930-yillarda Amerikada Chatt tomonidan tadqiq qilingan.",
    application: "Kimyoterapiya: Pt–NH₃ komplekslari sisplatinning (cis-[PtCl₂(NH₃)₂]) prekursorlari sifatida ishlatiladi. Pt²⁺ ning kuchli DNA bilan bog'lanishi asosida.",
    experimentalProof: [
      "Kation-anion navbatlanishi X-ray difraktsiyada ko'rinadi (turli elementar yacheyka).",
      "d–d o'tishlar: Cu(NH₃)₄²⁺ maks. 610 nm, Pt(NH₃)₄²⁺ 210 va 275 nm (UV).",
      "IR: ν(N–H) NH₃ ligandda metallga qarab siljiydi — Pt²⁺ bilan pastga (kuchli π-akseptorlik).",
      "Erishuvchanlik: [Cu(NH₃)₄][PtCl₄] suvda kam eriydi (Ksp ≈ 10⁻⁶), boshqa izomer yaxshiroq eriydi.",
      "Magnit tabiat: A da faqat Cu²⁺ paramagnit (μ ≈ 1.9 μ_B); B da ham faqat Cu²⁺ paramagnit — magnitlash farqli emas."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Xelat ligandlari — en va oksalat
  // ─────────────────────────────────────────────────────────────────
  CoCr_en_ox: {
    id: "CoCr_en_ox",
    title: "Xelat ligandlari — en va oksalat",
    shortTitle: "Bidentat almashinuv",
    grossFormula: "Co Cr (en)₃ (ox)₃ (bidentat)",
    formulaA: "[Co(en)₃][Cr(ox)₃]",
    formulaB: "[Cr(en)₃][Co(ox)₃]",
    nameA: "Tris(etilendiamin)kobalt(III) tris(oksalato)xromat(III)",
    nameB: "Tris(etilendiamin)xrom(III) tris(oksalato)kobaltat(III)",
    cationA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "tris_chelate", ligand: "en", ligandCount: 3, chargeText: "3+" },
    anionA:  { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "tris_chelate", ligand: "ox", ligandCount: 3, chargeText: "3−" },
    cationB: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "tris_chelate", ligand: "en", ligandCount: 3, chargeText: "3+" },
    anionB:  { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "tris_chelate", ligand: "ox", ligandCount: 3, chargeText: "3−" },
    colorA: "To'q sariq [Co(en)₃]³⁺ + och sariq [Cr(ox)₃]³⁻ → chuqur sariq",
    colorB: "Pushti-binafsha [Cr(en)₃]³⁺ + qora-sariq [Co(ox)₃]³⁻ → to'q binafsha",
    stabilityA: "en — kuchli σ-donor, xelat effekti (ΔS>0) bilan qo'shimcha 100–1000× barqarorlik beradi. [Co(en)₃]³⁺ juda inert.",
    stabilityB: "[Cr(en)₃]³⁺ ancha labil (d³ ammo aqua-substitutsiyada tez); [Co(ox)₃]³⁻ (d⁶ LS) juda inert. Kinetik shakl.",
    dnDistribution: "Bidentat ligandlar bilan optik izomeriya paydo bo'ladi — Δ va Λ enantiomerlar. Ikkala izomerda ham 4 ta stereoizomer: ΔΔ, ΔΛ, ΛΔ, ΛΛ.",
    cfseNote: "Xelat ligand — molekulyar entropiya kamayishi kompensatsiyasi sifatida bog'lanishning kuchayishi (ΔG < 0 ko'proq). en va ox ikkalasi ham qattiq N/O donorlar, shuning uchun HSAB bo'yicha bir xil moslikda ishlaydi.",
    discovery: "Werner (1911-1913) — bu tur izomerlar bilan bidentat ligand koordinatsiyasi va optik faollik o'rtasidagi bog'lanishni ko'rsatib bergan. cis-[Co(en)₂Cl₂]⁺ ning ajratilishi Werner nazariyasining hal qiluvchi isboti bo'ldi.",
    application: "Enantiyoselektiv kataliz — [Δ-Co(en)₃]³⁺ analoglari xiral induksiya beruvchi bo'ladi. Bio-analoglar: (en) ↔ oqsil ichidagi diamin bo'linmalarga o'xshaydi.",
    experimentalProof: [
      "Optik aylanish: Δ-[Co(en)₃]³⁺ +50° (D-line), Λ shakli teskari.",
      "CD (circular dichroism) spektroskopiya orqali enantiomerlar farqlanadi.",
      "13C NMR: en da CH₂-CH₂ signali 44–47 ppm oralig'ida, metalldan qarab siljiydi.",
      "Termogravimetriya (TG): en 210°C atrofida yo'qoladi, ox esa 300°C dan yuqori.",
      "Kristall shakli — [Δ-Co(en)₃][Δ-Cr(ox)₃] va [Δ-Co(en)₃][Λ-Cr(ox)₃] turli ranglarga ega (spontan konglomerat)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Aynan bir metall, turli oksidlanish darajalari (Pt(II)/Pt(IV))
  // ─────────────────────────────────────────────────────────────────
  PtPt_valence: {
    id: "PtPt_valence",
    title: "Bir metall, turli oksidlanish holatlari",
    shortTitle: "Pt(II) ↔ Pt(IV)",
    grossFormula: "Pt₂ (NH₃)₄ Cl₆ (Pt(II) + Pt(IV))",
    formulaA: "[Pt(NH₃)₄][PtCl₆]",
    formulaB: "[Pt(NH₃)₄Cl₂][PtCl₄]",
    nameA: "Tetraamminplatina(II) geksaxloroplatinat(IV)",
    nameB: "Trans-diamminditxlorplatina(IV) tetraxloroplatinat(II)",
    cationA: { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar", ligand: "NH3", ligandCount: 4, chargeText: "2+" },
    anionA:  { metal: "Pt", charge: "+4", color: 0xC0C0D8, radius: 0.42, geometry: "octahedral", ligand: "Cl", ligandCount: 6, chargeText: "2−" },
    cationB: { metal: "Pt", charge: "+4", color: 0xC0C0D8, radius: 0.42, geometry: "octahedral_mixed", ligand: "NH3+Cl", ligandCount: 6, chargeText: "2+" },
    anionB:  { metal: "Pt", charge: "+2", color: CPK.Pt, radius: 0.44, geometry: "square_planar", ligand: "Cl", ligandCount: 4, chargeText: "2−" },
    colorA: "Rangsiz-och sariq kristallar",
    colorB: "Sariq-to'q sariq kristallar",
    stabilityA: "Pt(II) d⁸ va Pt(IV) d⁶ LS ikkalasi ham juda inert. NH₃ yumshoq metall bilan yaxshi mos, Cl⁻ ham yumshoq — HSAB qonuniga mos.",
    stabilityB: "Pt(IV) da NH₃ va Cl⁻ aralash koordinatsiya beradi. Termodinamik farq kichik (~5 kJ/mol), lekin kinetik jihatdan farqli.",
    dnDistribution: "A: Pt²⁺(d⁸) – NH₃; Pt⁴⁺(d⁶ LS) – Cl⁻ | B: Pt⁴⁺(d⁶ LS) – NH₃+Cl aralash; Pt²⁺(d⁸) – Cl⁻",
    cfseNote: "Pt(IV) d⁶ LS — LFSE = −2.4 Δₒ, juda barqaror. Pt(II) d⁸ — kvadrat-planarda LFSE = −1.45 Δₒ. Bu — 'noyob koordinatsion izomeriya' bo'lib, bir metall ikkita turli oksidlanish darajasida joylashgan.",
    discovery: "Werner va Miolati (1893, Sürix) — birinchi bo'lib bir metallning turli oksidlanish holatlari orasidagi izomerlarni tadqiq qilib, molar o'tkazuvchanlik o'lchashlar orqali ular ikki xil tuz ekanligini isbotladi.",
    application: "Sisplatin sintezida (Rosenberg, 1965) shu turdagi Pt(II)/Pt(IV) navbatlanishi — antitumoral aktivligini bashorat qilishga imkon berdi. Pt(IV) prodrug lari klinik amaliyotda qo'llaniladi (satraplatin).",
    experimentalProof: [
      "Molar o'tkazuvchanlik: A da 4 mol/l ion, B da 2 mol/l ion (Werner sinovlari).",
      "¹⁹⁵Pt NMR (I=1/2): A da 2 ta signal (Pt(II) va Pt(IV) alohida chastotalarda); B da ham 2 ta signal, lekin joylari boshqacha.",
      "AgNO₃ bilan reaksiya: A da 2 Cl⁻ ion darhol cho'kmaga tushadi (tashqi sferada), B da esa 2 ta boshqa Cl⁻ dan iborat.",
      "XPS: Pt 4f7/2 bog'lash energiyasi Pt(II) uchun 72.8 eV, Pt(IV) uchun 74.5 eV — aniq farqlanadi.",
      "IR: ν(Pt–Cl) A da 340 sm⁻¹ (Pt–Cl in [PtCl₆]²⁻), B da 320 va 350 sm⁻¹ (aralash koordinatsiya)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. Uch metall koordinatsiya — Fe / Rh / Cu misolida
  // ─────────────────────────────────────────────────────────────────
  CoCr_SCN_NH3: {
    id: "CoCr_SCN_NH3",
    title: "Koordinatsion va bog'lanish izomerlar birgalikda",
    shortTitle: "Co/Cr + SCN⁻",
    grossFormula: "Co Cr (NH₃)₆ (SCN)₆",
    formulaA: "[Co(NH₃)₆][Cr(SCN)₆]",
    formulaB: "[Cr(NH₃)₆][Co(SCN)₆]",
    nameA: "Geksaamminkobalt(III) geksatiotsianatoxromat(III)",
    nameB: "Geksaamminxrom(III) geksaizotiotsianatokobaltat(III)",
    cationA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", ligand: "NH3", ligandCount: 6, chargeText: "3+" },
    anionA:  { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", ligand: "SCN_N", ligandCount: 6, chargeText: "3−" },
    cationB: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", ligand: "NH3", ligandCount: 6, chargeText: "3+" },
    anionB:  { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", ligand: "SCN_N", ligandCount: 6, chargeText: "3−" },
    colorA: "Cr(NCS)₆³⁻ — pushti-qizil, [Co(NH₃)₆]³⁺ sariq → umumiy pushti-sariq",
    colorB: "Co(NCS)₆³⁻ — to'q ko'k-yashil, [Cr(NH₃)₆]³⁺ binafsha → ko'k-binafsha",
    stabilityA: "Cr³⁺ qattiq kislota SCN⁻ ni N atomidan afzal ko'radi (HSAB). [Co(NH₃)₆]³⁺ standart etalon barqaror kation.",
    stabilityB: "Co³⁺ ham qattiq — SCN⁻ ning N donori afzal. Bu izomerlar KOORDINATSION va BOG'LANISH izomeriyaning aralashishi.",
    dnDistribution: "Co(NH₃)₆³⁺ va Cr(NH₃)₆³⁺ farqi paydo bo'ladi. NCS⁻ ligandning Co ga yoki Cr ga bog'lanishi ranglarda katta o'zgarish beradi.",
    cfseNote: "Bu misol koordinatsion izomeriyaning yanada boyroq shakli — hatto SCN⁻ ni C, N yoki S bilan bog'lash bog'lanish izomeriyasi darajasini qo'shadi. Amalda 2×2 = 4 ta izomer.",
    discovery: "Werner (1912) va keyingi Rossett (1930) tomonidan tadqiq qilingan. NCS⁻ ligandi bilan koordinatsion + bog'lanish izomerlar aralashuvi murakkab spektral xatti-harakat beradi.",
    application: "Analitik ajratish: [Cr(NH₃)₆][Co(NCS)₆] tipidagi tuzlar Cr³⁺ va Co³⁺ ni ajratish uchun etalon reaktivlar sifatida ishlatiladi.",
    experimentalProof: [
      "UV-VIS spektri Cr(NH₃)₆³⁺ (462 nm) va Co(NH₃)₆³⁺ (475 nm) o'rtasidagi farq bo'yicha aniqlanadi.",
      "IR: ν(C≡N) qiymati Cr–NCS uchun ~2100 sm⁻¹, Co–NCS uchun ~2110 sm⁻¹.",
      "Magnit o'lchov: A da (Cr d³, μ ≈ 3.87 μ_B) va (Co d⁶ LS, μ = 0). B da almashadi.",
      "Termogravimetriya: NH₃ komplekslardan 300°C atrofida yo'qoladi, SCN⁻ 400°C dan keyingina parchalanadi.",
      "Titran raqami (Werner uslubi): Ag⁺ bilan titratsiyada birinchi tuz 6 SCN⁻ beradi (tashqi sferaviy emas), ikkinchisi ham xuddi shu — konduktometrik farq."
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "d⁶ LS — juda inert markaziy ion", color: "#F090A0", cfse: "−2.4 Δₒ (kuchli maydon)" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d⁵ 4s¹", oxidation: "+3", role: "d³ — labil, lekin ancha barqaror", color: "#8A99C7", cfse: "−1.2 Δₒ" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.55 u", config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+2", role: "d⁹ — Jahn–Teller effekti", color: "#C88033", cfse: "−0.6 Δₒ + JT" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2/+4", role: "d⁸ (kvadrat-planar) / d⁶ LS (oktaedrik)", color: "#D0D0E0", cfse: "−1.45 Δₒ / −2.4 Δₒ" },
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "d⁵ HS yoki LS", color: "#E06633", cfse: "0 (HS) / −2.0 Δₒ (LS)" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃, en, NCS⁻ donor atomi", hybridization: "sp³ (NH₃), sp² (en)", color: "#3050F8" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "Oksalat (ox), H₂O donor atomi", hybridization: "sp²", color: "#FF0D0D" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "CN⁻ π-akseptor donor", hybridization: "sp", color: "#909090" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u", config: "[Ne] 3s² 3p⁴", role: "SCN⁻ da yumshoq donor", hybridization: "sp³", color: "#FFFF30" },
  Cl: { name: "Xlor (Cl)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁵", role: "Yakka atomlik ligand", color: "#1FF01F" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃, en tarkibi", color: "#FFFFFF" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
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
// ASOSIY KOMPONENT — KOORDINATSION IZOMERIYA 3D
// ═══════════════════════════════════════════════════════════════════════════
export default function KoordinatsionIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const cationGroupRef = useRef(null)
  const anionGroupRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const highlightRef = useRef([])
  const swapAnimRef = useRef({ active: false, progress: 0, direction: 1 })

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentPair, setCurrentPair] = useState("CoCr_NH3_CN")
  const [isomerForm, setIsomerForm] = useState("A")   // A yoki B
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both")     // both | cation | anion
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(false)
  const [showChargeHalo, setShowChargeHalo] = useState(true)
  const [showBridgeIons, setShowBridgeIons] = useState(true)
  const [swapAnimate, setSwapAnimate] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, definition: true, examples: true, distinction: true,
    thermodynamics: true, spectroscopy: true, history: true, table: true,
    application: true, references: true
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

  const pair = COORDINATION_ISOMERS[currentPair]
  const activeCation = isomerForm === "A" ? pair.cationA : pair.cationB
  const activeAnion  = isomerForm === "A" ? pair.anionA  : pair.anionB
  const activeFormula = isomerForm === "A" ? pair.formulaA : pair.formulaB
  const activeName = isomerForm === "A" ? pair.nameA : pair.nameB

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

  const createDoubleBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.045) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(direction, Math.abs(direction.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize().multiplyScalar(0.12)

    ;[perp, perp.clone().negate()].forEach(offset => {
      const geo = new THREE.CylinderGeometry(radius, radius, length, 12)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.75 })
      const bond = new THREE.Mesh(geo, mat)
      bond.position.copy(midpoint).add(offset)
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
      parent.add(bond)
      bondsRef.current.push(bond)
    })
  }, [])

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND — to'g'ri sp³
  // ═══════════════════════════════════════════════════════════
  const createNH3 = useCallback((parent, nPos, centerPos, showH, ligandTag) => {
    const group = new THREE.Group()
    const nGeo = new THREE.SphereGeometry(0.22, 32, 32)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NH₃', ligandTag }
    group.add(nMesh)
    atomsRef.current.push(nMesh)
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
        const hGeo = new THREE.SphereGeometry(0.10, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandTag }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // CN⁻ LIGAND (M–C≡N)
  // ═══════════════════════════════════════════════════════════
  const createCN = useCallback((parent, centerPos, direction, ligandTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const cPos = centerPos.clone().add(dir.clone().multiplyScalar(1.92))
    const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.92 + 1.16))

    const cMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.3, metalness: 0.2, emissive: CPK.C, emissiveIntensity: 0.1 })
    )
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'CN⁻ (siano)', ligandTag }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 28, 28),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'CN⁻', ligandTag }
    group.add(nMesh)
    atomsRef.current.push(nMesh)

    createBond(group, centerPos, cPos, CPK.bond, 0.07, 0.85)
    createDoubleBond(group, cPos, nPos, 0x556699, 0.04)
    createBond(group, cPos, nPos, 0x556699, 0.045, 0.7)

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // Cl⁻ LIGAND (yakka atom)
  // ═══════════════════════════════════════════════════════════
  const createCl = useCallback((parent, centerPos, direction, ligandTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const clPos = centerPos.clone().add(dir.clone().multiplyScalar(2.30))
    const clMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.Cl, roughness: 0.3, metalness: 0.3, emissive: CPK.Cl, emissiveIntensity: 0.12 })
    )
    clMesh.position.copy(clPos)
    clMesh.userData = { type: 'atom', element: 'Cl', info: ATOM_INFO.Cl, ligandName: 'Cl⁻', ligandTag }
    group.add(clMesh)
    atomsRef.current.push(clMesh)
    createBond(group, centerPos, clPos, CPK.bond, 0.07, 0.85)
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // NCS⁻ LIGAND — N-koordinatsiya (izotiotsianato)
  // ═══════════════════════════════════════════════════════════
  const createNCS = useCallback((parent, centerPos, direction, ligandTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99))
    const cPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99 + 1.16))
    const sPos = centerPos.clone().add(dir.clone().multiplyScalar(1.99 + 1.16 + 1.63))

    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.20, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NCS⁻', ligandTag }
    group.add(nMesh)
    atomsRef.current.push(nMesh)

    const cMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 24),
      new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
    )
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'NCS⁻', ligandTag }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    const sMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 28, 28),
      new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.4, metalness: 0.3, emissive: CPK.S, emissiveIntensity: 0.15 })
    )
    sMesh.position.copy(sPos)
    sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'NCS⁻', ligandTag }
    group.add(sMesh)
    atomsRef.current.push(sMesh)

    createBond(group, centerPos, nPos, CPK.bond, 0.07, 0.85)
    createDoubleBond(group, nPos, cPos, 0x556699, 0.04)
    createDoubleBond(group, cPos, sPos, 0xaaaa33, 0.04)

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // en (etilendiamin) BIDENTAT XELAT LIGAND
  // ═══════════════════════════════════════════════════════════
  const createEn = useCallback((parent, centerPos, dir1, dir2, ligandTag, showH) => {
    const group = new THREE.Group()
    // 2 ta N atomi (M–NH₂–CH₂–CH₂–NH₂–M)
    const d1 = dir1.clone().normalize()
    const d2 = dir2.clone().normalize()
    const n1Pos = centerPos.clone().add(d1.clone().multiplyScalar(2.05))
    const n2Pos = centerPos.clone().add(d2.clone().multiplyScalar(2.05))
    // 2 ta CH₂ orasida ko'prik
    const mid = new THREE.Vector3().addVectors(n1Pos, n2Pos).multiplyScalar(0.5)
    const bridge = mid.clone().sub(centerPos).normalize().multiplyScalar(0.3)
    const c1Pos = n1Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(n2Pos, n1Pos).multiplyScalar(0.25))
    const c2Pos = n2Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(n1Pos, n2Pos).multiplyScalar(0.25))

    ;[n1Pos, n2Pos].forEach((pos) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 32, 32),
        new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'en (etilendiamin)', ligandTag }
      group.add(m); atomsRef.current.push(m)
    })
    ;[c1Pos, c2Pos].forEach((pos) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'en (etilendiamin)', ligandTag }
      group.add(m); atomsRef.current.push(m)
    })
    // Bog'lar
    createBond(group, centerPos, n1Pos, CPK.bond, 0.07, 0.85)
    createBond(group, centerPos, n2Pos, CPK.bond, 0.07, 0.85)
    createBond(group, n1Pos, c1Pos, 0x666677, 0.05, 0.7)
    createBond(group, c1Pos, c2Pos, 0x666677, 0.05, 0.7)
    createBond(group, c2Pos, n2Pos, 0x666677, 0.05, 0.7)

    // H atomlari
    if (showH) {
      [n1Pos, n2Pos].forEach((pos) => {
        const outward = pos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
        ;[+1, -1].forEach(s => {
          const hPos = pos.clone().add(outward.clone().multiplyScalar(0.15)).add(perp.clone().multiplyScalar(0.30 * s))
          const h = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 16, 16),
            new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          )
          h.position.copy(hPos); h.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandTag }
          group.add(h); atomsRef.current.push(h)
          createBond(group, pos, hPos, 0x666677, 0.025, 0.5)
        })
      })
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // OKSALAT (ox²⁻) BIDENTAT XELAT LIGAND
  // ═══════════════════════════════════════════════════════════
  const createOx = useCallback((parent, centerPos, dir1, dir2, ligandTag) => {
    const group = new THREE.Group()
    const d1 = dir1.clone().normalize()
    const d2 = dir2.clone().normalize()
    const o1Pos = centerPos.clone().add(d1.clone().multiplyScalar(2.00))
    const o2Pos = centerPos.clone().add(d2.clone().multiplyScalar(2.00))
    const mid = new THREE.Vector3().addVectors(o1Pos, o2Pos).multiplyScalar(0.5)
    const bridge = mid.clone().sub(centerPos).normalize().multiplyScalar(0.25)
    const c1Pos = o1Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(o2Pos, o1Pos).multiplyScalar(0.22))
    const c2Pos = o2Pos.clone().add(bridge).add(new THREE.Vector3().subVectors(o1Pos, o2Pos).multiplyScalar(0.22))
    // Terminal =O
    const perpMid = mid.clone().sub(centerPos).normalize().multiplyScalar(0.9)
    const o1TermPos = c1Pos.clone().add(perpMid)
    const o2TermPos = c2Pos.clone().add(perpMid)

    ;[o1Pos, o2Pos, o1TermPos, o2TermPos].forEach((pos, i) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: i < 2 ? 'ox²⁻ (donor)' : 'ox²⁻ (=O)', ligandTag }
      group.add(m); atomsRef.current.push(m)
    })
    ;[c1Pos, c2Pos].forEach((pos) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      m.position.copy(pos)
      m.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'ox²⁻', ligandTag }
      group.add(m); atomsRef.current.push(m)
    })

    createBond(group, centerPos, o1Pos, CPK.bond, 0.07, 0.85)
    createBond(group, centerPos, o2Pos, CPK.bond, 0.07, 0.85)
    createBond(group, o1Pos, c1Pos, 0xaa4444, 0.05, 0.75)
    createBond(group, o2Pos, c2Pos, 0xaa4444, 0.05, 0.75)
    createBond(group, c1Pos, c2Pos, 0x777777, 0.05, 0.75)
    createDoubleBond(group, c1Pos, o1TermPos, 0xaa4444, 0.04)
    createDoubleBond(group, c2Pos, o2TermPos, 0xaa4444, 0.04)

    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // KOMPLEKS SFERASINI QURISH
  // ═══════════════════════════════════════════════════════════
  const buildComplex = useCallback((group, offsetX, sphereData, tag, isCation) => {
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    // Markaziy metall
    const cGeo = new THREE.SphereGeometry(sphereData.radius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: sphereData.color, roughness: 0.15, metalness: 0.9,
      emissive: sphereData.color, emissiveIntensity: 0.18
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(centerPos)
    cMesh.userData = {
      type: 'atom', element: sphereData.metal,
      info: ATOM_INFO[sphereData.metal],
      isCenter: true, sphereRole: isCation ? "kation markaz" : "anion markaz",
      charge: sphereData.chargeText, ligandTag: tag
    }
    group.add(cMesh)
    atomsRef.current.push(cMesh)

    // Halo (zaryad ko'rsatgichi)
    if (showChargeHalo) {
      const haloColor = isCation ? CPK.cation : CPK.anion
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(sphereData.radius * 3.6, 32, 32),
        new THREE.MeshBasicMaterial({ color: haloColor, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.BackSide })
      )
      halo.position.copy(centerPos)
      halo.userData = { isHalo: true, sphere: isCation ? "cation" : "anion" }
      group.add(halo)
      highlightRef.current.push(halo)
    }

    // Geometriyaga qarab yo'nalishlar
    let dirs = []
    if (sphereData.geometry === "octahedral" || sphereData.geometry === "octahedral_mixed") {
      dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
      ]
    } else if (sphereData.geometry === "square_planar") {
      dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
      ]
    } else if (sphereData.geometry === "tris_chelate") {
      // 3 ta bidentat ligand — 6 ta koordinatsion joy, ligand juftliklari
      dirs = [
        // Ligand 1 juftligi (yuqori-old va yuqori-orqa)
        [new THREE.Vector3(1, 0.5, 0.5).normalize(), new THREE.Vector3(0.5, 0.5, 1).normalize()],
        // Ligand 2
        [new THREE.Vector3(-1, 0.5, -0.5).normalize(), new THREE.Vector3(-0.5, 0.5, -1).normalize()],
        // Ligand 3
        [new THREE.Vector3(0, -1, 0.7).normalize(), new THREE.Vector3(0, -1, -0.7).normalize()]
      ]
    }

    // Ligandlarni joylashtirish
    if (sphereData.geometry === "tris_chelate") {
      dirs.forEach(([d1, d2]) => {
        if (sphereData.ligand === "en") createEn(group, centerPos, d1, d2, tag, showHydrogens)
        else if (sphereData.ligand === "ox") createOx(group, centerPos, d1, d2, tag)
      })
    } else if (sphereData.geometry === "octahedral_mixed") {
      // Pt(IV) da 4 NH3 + 2 Cl (trans)
      dirs.forEach((d, i) => {
        if (i < 4) createNH3(group, centerPos.clone().add(d.clone().multiplyScalar(2.05)), centerPos, showHydrogens, tag)
        else createCl(group, centerPos, d, tag)
      })
    } else {
      dirs.forEach((d, i) => {
        if (i >= sphereData.ligandCount) return
        const dist = sphereData.ligand === "Cl" ? 2.30 :
                     sphereData.ligand === "CN" ? 1.92 :
                     sphereData.ligand === "SCN_N" ? 1.99 : 2.05
        const nPos = centerPos.clone().add(d.clone().multiplyScalar(dist))
        if (sphereData.ligand === "NH3") {
          createNH3(group, nPos, centerPos, showHydrogens, tag)
        } else if (sphereData.ligand === "CN") {
          createCN(group, centerPos, d, tag)
        } else if (sphereData.ligand === "Cl") {
          createCl(group, centerPos, d, tag)
        } else if (sphereData.ligand === "SCN_N") {
          createNCS(group, centerPos, d, tag)
        }
      })
    }

    // Zaryad va formula sprite
    if (showLabels) {
      const chargeLabel = isCation ? sphereData.chargeText : sphereData.chargeText
      const spriteBg = isCation ? "rgba(120, 90, 5, 0.9)" : "rgba(5, 60, 120, 0.9)"
      const spriteBorder = isCation ? "#FFD700" : "#66CCFF"
      const spriteText = `[${sphereData.metal}] ${chargeLabel}`
      const sprite = makeTextSprite(spriteText, {
        fontSize: 40, color: "#ffffff", bgColor: spriteBg, borderColor: spriteBorder, scale: 0.42
      })
      sprite.position.set(offsetX, 3.4, 0)
      group.add(sprite)
      labelsRef.current.push(sprite)

      const roleText = isCation ? "◆ KATION SFERASI" : "◇ ANION SFERASI"
      const sub = makeTextSprite(roleText, {
        fontSize: 30, color: isCation ? "#FFD700" : "#66CCFF",
        bgColor: "rgba(10, 5, 25, 0.85)", borderColor: spriteBorder, scale: 0.34
      })
      sub.position.set(offsetX, 2.8, 0)
      group.add(sub)
      labelsRef.current.push(sub)
    }
  }, [createNH3, createCN, createCl, createNCS, createEn, createOx, showHydrogens, showLabels, showChargeHalo])

  // ═══════════════════════════════════════════════════════════
  // SAHNA QAYTA QURISH
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    ;[cationGroupRef, anionGroupRef].forEach(ref => {
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

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    highlightRef.current = []

    const cationGroup = new THREE.Group()
    const anionGroup = new THREE.Group()
    cationGroupRef.current = cationGroup
    anionGroupRef.current = anionGroup

    if (viewMode === "both") {
      buildComplex(cationGroup, -4.2, activeCation, "cation", true)
      buildComplex(anionGroup, +4.2, activeAnion, "anion", false)
    } else if (viewMode === "cation") {
      buildComplex(cationGroup, 0, activeCation, "cation", true)
    } else if (viewMode === "anion") {
      buildComplex(anionGroup, 0, activeAnion, "anion", false)
    }

    scene.add(cationGroup)
    scene.add(anionGroup)

    // Markazda + / − belgi va o'rtadagi ionlar
    if (viewMode === "both") {
      // Ion juftligi belgisi
      const pairSign = makeTextSprite("[ Kation ]  [ Anion ]", {
        fontSize: 34, color: "#ffddff",
        bgColor: "rgba(30, 15, 60, 0.9)", borderColor: "#a78bfa", scale: 0.34
      })
      pairSign.position.set(0, 3.8, 0)
      scene.add(pairSign)
      labelsRef.current.push(pairSign)

      // Kristall ion navbatlanishi (ochiq nuqtalar)
      if (showBridgeIons) {
        for (let i = -1; i <= 1; i++) {
          const dotGeo = new THREE.SphereGeometry(0.06, 12, 12)
          const dotMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.5 })
          const dot = new THREE.Mesh(dotGeo, dotMat)
          dot.position.set(i * 0.5, 0.1, 0)
          scene.add(dot)
          labelsRef.current.push(dot)
        }
      }
    }
  }, [activeCation, activeAnion, viewMode, buildComplex, showBridgeIons])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
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
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `uniform vec3 color1; uniform vec3 color2;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(color1, color2, h), 1.0);
        }`
    })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 4, 13)
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
    controls.maxDistance = 28
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.7
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
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

    // Raycaster
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

    // Animatsiya
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()

      // Halo pulsatsiya
      const t = performance.now() * 0.002
      highlightRef.current.forEach(m => {
        if (m.userData && m.userData.isHalo) {
          const scale = 1 + Math.sin(t * 1.4) * 0.06
          m.scale.set(scale, scale, scale)
          if (m.material) m.material.opacity = 0.06 + Math.sin(t * 1.4) * 0.04
        }
      })

      // Ligand almashinuvi animatsiyasi
      if (swapAnimRef.current.active) {
        swapAnimRef.current.progress += 0.006 * swapAnimRef.current.direction
        if (swapAnimRef.current.progress > 1) {
          swapAnimRef.current.progress = 1
          swapAnimRef.current.direction = -1
        } else if (swapAnimRef.current.progress < 0) {
          swapAnimRef.current.progress = 0
          swapAnimRef.current.direction = 1
        }
        const p = swapAnimRef.current.progress
        // Kation va anion sferalarini o'zaro yaqinlashtirib bir-birini almashtirmoqchi bo'lgan illyuziya
        if (cationGroupRef.current) {
          cationGroupRef.current.position.x = p * 2.2
          cationGroupRef.current.rotation.y = p * Math.PI * 0.5
          cationGroupRef.current.scale.setScalar(1 - p * 0.15)
        }
        if (anionGroupRef.current) {
          anionGroupRef.current.position.x = -p * 2.2
          anionGroupRef.current.rotation.y = -p * Math.PI * 0.5
          anionGroupRef.current.scale.setScalar(1 - p * 0.15)
        }
      } else {
        if (cationGroupRef.current) {
          cationGroupRef.current.position.x = 0
          cationGroupRef.current.rotation.y = 0
          cationGroupRef.current.scale.setScalar(1)
        }
        if (anionGroupRef.current) {
          anionGroupRef.current.position.x = 0
          anionGroupRef.current.rotation.y = 0
          anionGroupRef.current.scale.setScalar(1)
        }
      }

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
  useEffect(() => { swapAnimRef.current.active = swapAnimate }, [swapAnimate])

  // ═══════════════════════════════════════════════════════════
  // PDF GENERATSIYA
  // ═══════════════════════════════════════════════════════════
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
        purpleMid: rgb(0.65, 0.55, 0.98), purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        gold: rgb(0.80, 0.62, 0.05), blue: rgb(0.08, 0.31, 0.75),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), yellow: rgb(0.75, 0.60, 0.10),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgGold: rgb(1.0, 0.98, 0.86),
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
          if (measure(str.slice(0, mid) + "…", f, s) <= w) lo = mid
          else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (t, f, s, w) => {
        if (!t) return [""]
        const words = String(t).split(/\s+/)
        const lines = []
        let cur = ""
        for (const wd of words) {
          const test = cur ? cur + " " + wd : wd
          if (measure(test, f, s) > w && cur) { lines.push(cur); cur = wd }
          else cur = test
          if (measure(cur, f, s) > w) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, f, s) > w) { lines.push(piece); piece = ch }
              else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }

      const addFooter = () => {
        const left = truncate(
          `Koordinatsion izomeriya 3D Lab  •  ${cleanText(pair.grossFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(left, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pStr = `${pageNum}`
        const w = measure(pStr, regularFont, 8)
        page.drawText(pStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
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

      // ═══════════════════════════════════════════════════════
      // MUQOVA
      // ═══════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      const title = "KOORDINATSION IZOMERIYA"
      const tW = measure(title, boldFont, 22)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 80, size: 22, font: boldFont, color: C.white })

      const subtitle = "Kation va anion koordinatsion sferalari orasidagi ligand almashinuvi"
      const sW = measure(subtitle, italicFont, 11)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 105, size: 11, font: italicFont, color: C.purpleLight })

      const formulaText = `${cleanText(pair.formulaA)}  ⇌  ${cleanText(pair.formulaB)}`
      const fW = measure(formulaText, boldFont, 13)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 150, size: 13, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan koordinatsion izomer juftligi", `${pair.title} — umumiy formula: ${cleanText(pair.grossFormula)}`, C.bgPurple, C.purple)

      const meta = [
        ["A shakli formulasi:", cleanText(pair.formulaA)],
        ["A shakli nomi:", cleanText(pair.nameA)],
        ["B shakli formulasi:", cleanText(pair.formulaB)],
        ["B shakli nomi:", cleanText(pair.nameB)],
        ["Umumiy tarkib:", cleanText(pair.grossFormula)]
      ]
      meta.forEach(([k, v]) => {
        checkBreak(18)
        page.drawText(cleanText(k), { x: MARGIN + 10, y, size: 10.5, font: boldFont, color: C.purple })
        page.drawText(truncate(cleanText(v), regularFont, 10.5, CONTENT_W - 180), { x: MARGIN + 170, y, size: 10.5, font: regularFont, color: C.textDark })
        y -= 17
      })
      y -= 12

      // ── 1. Kirish ──
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Koordinatsion izomeriya nima?")
        drawParagraph(
          "Koordinatsion izomeriya (coordination isomerism) — koordinatsion birikma tarkibida HAM kation, HAM anion kompleks bo'lganida, ligandlarning ikki koordinatsion sfera o'rtasida turli taqsimlanishi natijasida hosil bo'ladigan izomeriya turi."
        )
        drawParagraph(
          "Bu izomeriya turining shartlari:"
        )
        drawBulletPoint("Kation va anionning ikkalasi ham kompleks ionlar bo'lishi shart.")
        drawBulletPoint("Ikkala metall (yoki bir metallning ikki xil holati) mavjud bo'lishi kerak.")
        drawBulletPoint("Ligandlar ikki metall o'rtasida almashinishi mumkin — natijada bir xil umumiy formulaga ega, lekin tuzilishi jihatidan farqli tuzlar hosil bo'ladi.")
        drawBulletPoint("Klassik namuna: [Co(NH₃)₆][Cr(CN)₆]  ⇌  [Cr(NH₃)₆][Co(CN)₆]")
      }

      // ── 2. Ta'rif va shartlar ──
      if (pdfSections.definition) {
        drawSectionHeader(2, "Ta'rif va nazariy asos")
        drawInfoBox(
          "Rasmiy ta'rif (IUPAC 2005)",
          "Bir xil molekulyar formulaga, bir xil ligand va metall to'plamiga ega bo'lgan koordinatsion tuzlar, ligandlarning turli kation va anion sferalarida taqsimlanishi bo'yicha farqlanadi.",
          C.bgPurple, C.purple
        )
        drawParagraph(
          "Werner koordinatsion nazariyasi bo'yicha (1893), har bir markaziy metall o'zining ichki koordinatsion sferasiga ega bo'ladi. Kation va anion ikkalasi ham kompleks bo'lgan tuzda, bu sferalar o'zaro AJRALGAN va o'zaro TA'SIRLASHMAYDIGAN bo'lib qoladi (agar bir necha o'nlab pikometrga yaqin masofada bo'lmasa)."
        )
        drawInfoBox(
          "Koordinatsion izomeriyaning uch turi",
          "1) Turli metallar, bir xil ligandlar: [Co][Cr] ↔ [Cr][Co]  |  2) Bir metall, turli oksidlanish darajalari: Pt(II)/Pt(IV) juftligi  |  3) Ligand tarkibi almashinuvi: NH₃, CN⁻, en, ox²⁻ va boshqalar orasida.",
          C.bgYellow, C.yellow
        )
      }

      // ── 3. Namunalar ──
      if (pdfSections.examples) {
        drawSectionHeader(3, "Klassik namunalar (5 juft izomer)")
        Object.values(COORDINATION_ISOMERS).forEach((iso, idx) => {
          checkBreak(50)
          drawInfoBox(
            `${idx + 1}. ${cleanText(iso.title)}`,
            `A shakli: ${cleanText(iso.formulaA)}  ⇌  B shakli: ${cleanText(iso.formulaB)}. Umumiy tarkib: ${cleanText(iso.grossFormula)}.`,
            idx === 0 ? C.bgPurple : idx === 1 ? C.bgBlue : idx === 2 ? C.bgGreen : idx === 3 ? C.bgOrange : C.bgRed,
            idx === 0 ? C.purple : idx === 1 ? C.blue : idx === 2 ? C.green : idx === 3 ? C.orange : C.red
          )
        })
      }

      // ── 4. Bog'lanish izomeriyasidan farqi ──
      if (pdfSections.distinction) {
        drawSectionHeader(4, "Boshqa izomeriya turlaridan farqi")
        drawParagraph(
          "Koordinatsion izomeriya bog'lanish (linkage), ion-koordinatsion (ionization), gidrat (hydrate) va boshqa izomeriya turlaridan sezilarli darajada farq qiladi. Asosiy farqlar:"
        )
        drawInfoBox(
          "Bog'lanish izomeriyasi (linkage)",
          "Ambidentat ligand (masalan, NO₂⁻ N yoki O orqali) bir kompleks ichida turli atom orqali bog'lanadi. Ikkinchi sfera talab qilinmaydi.",
          C.bgBlue, C.blue
        )
        drawInfoBox(
          "Koordinatsion izomeriya (coordination)",
          "Ikkita alohida kompleks sferalari (kation + anion) o'rtasida ligand almashinuvi. Ambidentat ligand shart emas — oddiy ligandlar ham bo'lishi mumkin.",
          C.bgGold, C.gold
        )
        drawInfoBox(
          "Ionizatsiya izomeriyasi",
          "Ichki va tashqi sfera ionlari o'zaro almashadi: [Co(NH₃)₅Br]SO₄ ⇌ [Co(NH₃)₅SO₄]Br",
          C.bgGreen, C.green
        )
        drawInfoBox(
          "Gidrat izomeriyasi",
          "H₂O molekulasi ichki sferada yoki tashqarida bo'lishi mumkin: CrCl₃·6H₂O uchun 3 xil izomer (fioletovaya, yashil, ochiq yashil).",
          C.bgOrange, C.orange
        )
      }

      // ── 5. Termodinamika ──
      if (pdfSections.thermodynamics) {
        drawSectionHeader(5, "Termodinamik va kinetik jihatlar")
        drawParagraph(
          "Koordinatsion izomerlar o'rtasidagi barqarorlik farqi juda kichik (bir necha kJ/mol), lekin bu farq HSAB nazariyasi va kristall maydon barqarorlashish energiyasi (LFSE / CFSE) yordamida tushuntiriladi:"
        )
        drawInfoBox(
          `A shakli barqarorligi (${cleanText(pair.formulaA)})`,
          cleanText(pair.stabilityA),
          C.bgGreen, C.green
        )
        drawInfoBox(
          `B shakli barqarorligi (${cleanText(pair.formulaB)})`,
          cleanText(pair.stabilityB),
          C.bgRed, C.red
        )
        drawInfoBox(
          "Kristall maydon effektlari (CFSE / LFSE)",
          cleanText(pair.cfseNote),
          C.bgYellow, C.yellow
        )
        drawParagraph(
          "d-elektron taqsimoti:"
        )
        drawBulletPoint(cleanText(pair.dnDistribution))
      }

      // ── 6. Tajribaviy tasdiqlash ──
      if (pdfSections.spectroscopy) {
        drawSectionHeader(6, "Tajribaviy usullar va tasdiqlash")
        drawParagraph(
          "Koordinatsion izomerlar bir xil umumiy formulaga ega bo'lgani sababli, ularni ajratish uchun quyidagi tajribaviy usullar qo'llaniladi:"
        )
        pair.experimentalProof.forEach(p => drawBulletPoint(cleanText(p)))
      }

      // ── 7. Tarix ──
      if (pdfSections.history) {
        drawSectionHeader(7, "Kashfiyot tarixi")
        drawParagraph(cleanText(pair.discovery))
        drawInfoBox(
          "Alfred Werner va koordinatsion izomeriya",
          "Alfred Werner (1866–1919, Sürix universiteti) 1893-yilda o'z 'koordinatsion nazariyasi'ni e'lon qildi. Uning eng katta yutuqlaridan biri — bir xil formulaga ega, lekin tuzilishi jihatidan farqli tuzlarni izolyatsiya qilib, ularning haqiqatan ikki xil modda ekanligini tajribalar orqali isbotlash edi. 1913-yilda Werner Kimyo bo'yicha Nobel mukofotini oldi.",
          C.bgPurple, C.purple
        )
      }

      // ── 8. Solishtirish jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(8, "Ikki izomer shakli — solishtirish jadvali")
        const rows = [
          ["Xususiyat", "A shakli", "B shakli"],
          ["Formula", cleanText(pair.formulaA), cleanText(pair.formulaB)],
          ["Kation", `[${pair.cationA.metal}(${pair.cationA.ligand})${pair.cationA.ligandCount}]${pair.cationA.chargeText}`,
                     `[${pair.cationB.metal}(${pair.cationB.ligand})${pair.cationB.ligandCount}]${pair.cationB.chargeText}`],
          ["Anion",  `[${pair.anionA.metal}(${pair.anionA.ligand})${pair.anionA.ligandCount}]${pair.anionA.chargeText}`,
                     `[${pair.anionB.metal}(${pair.anionB.ligand})${pair.anionB.ligandCount}]${pair.anionB.chargeText}`],
          ["Rangi", cleanText(pair.colorA).slice(0, 45), cleanText(pair.colorB).slice(0, 45)],
          ["Barqarorlik", cleanText(pair.stabilityA).slice(0, 45) + "...", cleanText(pair.stabilityB).slice(0, 45) + "..."]
        ]

        const colW = [CONTENT_W * 0.20, CONTENT_W * 0.40, CONTENT_W * 0.40]
        const rowH = 26
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 8
          row.forEach((cell, ci) => {
            const txt = truncate(cleanText(cell), isHeader ? boldFont : regularFont, 9, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 9, size: 9,
              font: isHeader ? boldFont : regularFont,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // ── 9. Amaliy qo'llanilishi ──
      if (pdfSections.application) {
        drawSectionHeader(9, "Amaliy qo'llanilishi va zamonaviy tadqiqotlar")
        drawInfoBox("Ushbu tizim uchun", cleanText(pair.application), C.bgOrange, C.orange)
        drawParagraph(
          "Umumiy amaliy sohalar:"
        )
        drawBulletPoint("Metall-organik karkaslar (MOF) sintezida turli koordinatsion sferalar birlashuvi asosida ishlab chiqilgan mikroporali materiallar.")
        drawBulletPoint("Bio-noorganik kimyoda: gemoglobin va sitokromlar strukturasini modellashda kation-anion kompleks juftliklar o'rganiladi.")
        drawBulletPoint("Molekulyar magnetika: turli d-elektron sonli metallar orasidagi magnitli o'zaro ta'sirlar (spin-cross-over).")
        drawBulletPoint("Kimyoterapiyada: sisplatin va uning analoglarida Pt(II)/Pt(IV) izomerlari muhim rol o'ynaydi.")
        drawBulletPoint("Katalizda: bimetal komplekslar CO₂ va N₂ aktivatsiyasi uchun kataitator sifatida ishlatiladi.")
      }

      // ── 10. Adabiyotlar ──
      if (pdfSections.references) {
        drawSectionHeader(10, "Adabiyotlar")
        const refs = [
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
          "Werner, A. (1907). Über Koordinationsverbindungen. Berichte der deutschen chemischen Gesellschaft, 40, 15–69.",
          "Miolati, A., Werner, A. (1893). Beiträge zur Konstitution anorganischer Verbindungen. Zeitschrift für physikalische Chemie, 12, 35–55.",
          "Bailar, J.C. (1956). The Chemistry of the Coordination Compounds. Reinhold Publishing, New York.",
          "Basolo, F., Pearson, R.G. (1967). Mechanisms of Inorganic Reactions (2nd ed.). Wiley, New York.",
          "Cotton, F.A., Wilkinson, G. (1988). Advanced Inorganic Chemistry (5th ed.). Wiley-Interscience.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 19 — Coordination Chemistry: general considerations.",
          "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson. Chapter 9 — Coordination Compounds.",
          "Kauffman, G.B. (1966). Alfred Werner: Founder of Coordination Chemistry. Springer, Berlin.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations. RSC Publishing.",
          "Constable, E.C. (1990). Metals and Ligand Reactivity: An Introduction to the Organic Chemistry of Metal Complexes. VCH Publishers."
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

      pdfDoc.setTitle(`Koordinatsion izomeriya — ${cleanText(pair.title)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning koordinatsion izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["koordinatsion izomeriya", "Werner", "kation-anion kompleks", "coordination isomerism"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `koordinatsion-izomeriya-${pair.id}.pdf`
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

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">

      {/* HEADER */}
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/oquv/izomeriyasi/tuzilish"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-pink-300 flex items-center gap-2 truncate">
              <span>🔀</span>
              <span className="hidden sm:inline">Koordinatsion izomeriya — 3D Laboratoriya</span>
              <span className="sm:hidden">Koordinatsion 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {pair.grossFormula} • {pair.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentPair}
            onChange={(e) => setCurrentPair(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[260px]"
          >
            <option value="CoCr_NH3_CN">Co/Cr — NH₃ + CN⁻ (klassik)</option>
            <option value="CuPt_NH3_Cl">Cu/Pt — NH₃ + Cl⁻ (planar)</option>
            <option value="CoCr_en_ox">Co/Cr — en + ox (xelat)</option>
            <option value="PtPt_valence">Pt(II)/Pt(IV) — bir metall</option>
            <option value="CoCr_SCN_NH3">Co/Cr — NH₃ + NCS⁻ (aralash)</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => togglePanel("theory")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "theory" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Nazariy asos"
          >📚</button>

          <button
            onClick={() => togglePanel("compare")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Solishtirish jadvali"
          >📊</button>

          <button
            onClick={() => togglePanel("distinction")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "distinction" ? 'bg-green-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Boshqa izomeriyalardan farqi"
          >🔍</button>

          <button
            onClick={() => togglePanel("spectroscopy")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "spectroscopy" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Tajribaviy usullar"
          >🔬</button>

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Werner tarixi"
          >📜</button>

          <button
            onClick={() => togglePanel("test")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Test / mashqlar"
          >🧠</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="PDF eksport"
          >📄</button>

          <button
            onClick={() => setFullscreenMode(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="To'liq ekran"
          >🖥️</button>
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

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[290px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
            title="Ushlab siljiting"
          >
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* — SHAKL TANLASH — */}
            <div className="mb-3 bg-gradient-to-r from-yellow-950/40 to-blue-950/40 rounded-lg border border-purple-700/40 p-2">
              <div className="text-[10px] text-purple-300 mb-1.5 uppercase tracking-wide font-bold">Izomer shakli</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setIsomerForm("A")}
                  className={`text-[10px] px-2 py-2 rounded font-medium transition-all ${isomerForm === "A" ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <div>◆ A shakli</div>
                  <div className="text-[8.5px] opacity-80 mt-0.5 truncate">{pair.formulaA}</div>
                </button>
                <button
                  onClick={() => setIsomerForm("B")}
                  className={`text-[10px] px-2 py-2 rounded font-medium transition-all ${isomerForm === "B" ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <div>◇ B shakli</div>
                  <div className="text-[8.5px] opacity-80 mt-0.5 truncate">{pair.formulaB}</div>
                </button>
              </div>
            </div>

            {/* — KO'RINISH — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <div className="text-[11px] text-purple-400 mb-1">Rejim:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setViewMode("both")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "both" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>Ikkalasi</button>
                  <button onClick={() => setViewMode("cation")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "cation" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    ◆ Kation
                  </button>
                  <button onClick={() => setViewMode("anion")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "anion" ? 'bg-cyan-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    ◇ Anion
                  </button>
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
                  <span>Zaryad halosi 🟡🔵</span>
                  <input type="checkbox" checked={showChargeHalo} onChange={(e) => setShowChargeHalo(e.target.checked)} className="accent-yellow-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Kristall panjara belgilari</span>
                  <input type="checkbox" checked={showBridgeIons} onChange={(e) => setShowBridgeIons(e.target.checked)} className="accent-purple-500" />
                </label>
              </div>
            )}

            {/* — ILMIY ASBOBLAR — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🔬</span> Ilmiy asboblar</span>
              <span>{expandedSection === "scientific" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "scientific" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setSwapAnimate(!swapAnimate)}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${swapAnimate ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>🔄</span> Ligand almashinuvi</span>
                  <span>{swapAnimate ? "⏸" : "▶"}</span>
                </button>
                <p className="text-[10px] text-purple-400 italic px-1">
                  Kation va anion sferalarining ligandlar bilan almashinuvini animatsiya orqali ko'rsatadi. A ⇌ B izomeriya jarayonini vizuallashtiradi.
                </p>
                <button
                  onClick={() => setIsomerForm(isomerForm === "A" ? "B" : "A")}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all"
                >
                  ⇌ Shaklni almashtirish (A ↔ B)
                </button>
                <div className="border-t border-purple-800/40 pt-2 mt-2">
                  <div className="text-[10px] text-purple-400 mb-1.5">💎 Faol koordinatsion sferalar</div>
                  <div className="bg-purple-900/30 rounded-lg p-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${activeCation.color.toString(16).padStart(6, '0')}` }}></span>
                      <span className="text-yellow-200">◆ Kation: {activeCation.metal}{activeCation.charge}</span>
                    </div>
                    <div className="text-purple-200 text-[9.5px] pl-5">Ligand: <strong>{activeCation.ligand}</strong> × {activeCation.ligandCount}</div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${activeAnion.color.toString(16).padStart(6, '0')}` }}></span>
                      <span className="text-cyan-200">◇ Anion: {activeAnion.metal}{activeAnion.charge}</span>
                    </div>
                    <div className="text-purple-200 text-[9.5px] pl-5">Ligand: <strong>{activeAnion.ligand}</strong> × {activeAnion.ligandCount}</div>
                  </div>
                </div>
              </div>
            )}

            {/* — EKSPORT — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all"
                >📄 PDF hisobot yaratish</button>
              </div>
            )}

            {/* Tez kirish */}
            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                Atomga bosing — batafsil ma'lumot chiqadi. 🟡 Oltin halo — kation sferasi, 🔵 moviy halo — anion sferasi. 🔄 tugmasi ligand almashinuvini animatsiyalaydi.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* 3D Container */}
        <div ref={containerRef} className="flex-1 w-full relative" />

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-purple-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Tanlangan atom */}
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
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Atom massasi:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfiguratsiya:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.info?.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.info.role}</div>}
              {selectedAtom.info?.cfse && <div><span className="text-purple-500">LFSE:</span> <span className="text-yellow-300">{selectedAtom.info.cfse}</span></div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.ligandName && <div><span className="text-purple-500">Ligand:</span> <span className="text-cyan-300">{selectedAtom.ligandName}</span></div>}
              {selectedAtom.charge && <div><span className="text-purple-500">Zaryad:</span> <span className="font-mono text-pink-300">{selectedAtom.charge}</span></div>}
              {selectedAtom.sphereRole && <div><span className="text-purple-500">Sferasi:</span> <span className={selectedAtom.ligandTag === "cation" ? "text-yellow-300" : "text-cyan-300"}>{selectedAtom.sphereRole}</span></div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">💎 Bu markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[350px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>ℹ️</span> {pair.title}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Umumiy tarkib</div>
                <div className="font-mono text-sm text-white text-center">{pair.grossFormula}</div>
                <div className="text-purple-300 text-[10px] mt-1 text-center italic">{pair.shortTitle}</div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">◆ A SHAKLI</div>
                <div className="text-yellow-100 text-[11px] font-mono">{pair.formulaA}</div>
                <div className="text-yellow-100 text-[10px] mt-1 italic">{pair.nameA}</div>
                <div className="text-yellow-100 text-[10px] mt-1">Rang: {pair.colorA}</div>
              </div>

              <div className="text-center text-purple-400 text-lg">⇅</div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 text-[10px] uppercase tracking-wide mb-1 font-bold">◇ B SHAKLI</div>
                <div className="text-cyan-100 text-[11px] font-mono">{pair.formulaB}</div>
                <div className="text-cyan-100 text-[10px] mt-1 italic">{pair.nameB}</div>
                <div className="text-cyan-100 text-[10px] mt-1">Rang: {pair.colorB}</div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 text-[10px] uppercase tracking-wide mb-1 font-bold">d-elektron taqsimoti</div>
                <div className="text-purple-100 text-[10px] leading-relaxed">{pair.dnDistribution}</div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Barqarorlik solishtirmasi</div>
                <div className="text-blue-100 text-[10px] leading-relaxed space-y-1">
                  <div><span className="text-yellow-300">▸ A:</span> {pair.stabilityA}</div>
                  <div><span className="text-cyan-300">▸ B:</span> {pair.stabilityB}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* — NAZARIY ASOS — */}
        {activePanel === "theory" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-orange-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-orange-200 flex items-center gap-2 text-sm">
                <span>📚</span> Nazariy asos
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[11px] mb-1">📖 Ta'rif</div>
                <p className="text-orange-100 text-[10.5px] leading-relaxed">
                  <strong>Koordinatsion izomeriya</strong> — kation VA anion ikkalasi ham kompleks bo'lgan tuzda, ligandlar ikki koordinatsion sfera orasida turli taqsimlangan holat.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1.5">⚛️ Uch asosiy shart</div>
                <ol className="text-purple-100 text-[10px] leading-relaxed space-y-1 list-decimal list-inside">
                  <li>Kation kompleks bo'lishi shart</li>
                  <li>Anion kompleks bo'lishi shart</li>
                  <li>Ligandlar ikkala sferada almashishi mumkin bo'lishi kerak</li>
                </ol>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">🧠 Ushbu tizim uchun CFSE/LFSE tahlili</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{pair.cfseNote}</p>
              </div>

              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">🎯 Werner qonuni</div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  Werner (1893) kashfiyoti bo'yicha, koordinatsion birikma <strong>ichki sfera</strong> (koordinatsion) va <strong>tashqi sfera</strong> (kristall) tarkiblariga bo'linadi. Koordinatsion izomeriyada har ikkala sfera murakkab tuzilishga ega bo'ladi.
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">📐 Koordinatsion sonlar</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Klassik namunalar oktaedrik (KS=6) yoki kvadrat-planar (KS=4) sferalar bilan ishlaydi. Xelat ligandlar (en, ox) ikki donor atom bilan bidentat ravishda bog'lanadi va koordinatsion sonni ikki barobar ta'sirlantiradi.
                </p>
              </div>

              <div className="bg-pink-950/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 font-bold text-[11px] mb-1">🔀 Ligand almashinuvi mexanizmi</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">
                  Erigan holatda, ikki kompleks ion o'rtasida ligand tashuvchisi (labil metallar orqali) mumkin. Ammo kristall holatda ikkala izomer termodinamik jihatdan barqaror va bir-biriga aylanmaydi (agar issiqlik yoki yorug'lik ta'sirida bo'lmasa).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-md w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>📊</span> Solishtirish jadvali
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-purple-800/50">
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-purple-100">Xususiyat</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-yellow-300">◆ A shakli</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-cyan-300">◇ B shakli</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Formula</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{pair.formulaA}</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{pair.formulaB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Kation</td><td className="border border-purple-800/50 px-2 py-1.5">[{pair.cationA.metal}({pair.cationA.ligand}){pair.cationA.ligandCount}]<sup>{pair.cationA.chargeText}</sup></td><td className="border border-purple-800/50 px-2 py-1.5">[{pair.cationB.metal}({pair.cationB.ligand}){pair.cationB.ligandCount}]<sup>{pair.cationB.chargeText}</sup></td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Anion</td><td className="border border-purple-800/50 px-2 py-1.5">[{pair.anionA.metal}({pair.anionA.ligand}){pair.anionA.ligandCount}]<sup>{pair.anionA.chargeText}</sup></td><td className="border border-purple-800/50 px-2 py-1.5">[{pair.anionB.metal}({pair.anionB.ligand}){pair.anionB.ligandCount}]<sup>{pair.anionB.chargeText}</sup></td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Geometriya</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.cationA.geometry} / {pair.anionA.geometry}</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.cationB.geometry} / {pair.anionB.geometry}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorB}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Barqarorlik</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.stabilityA.slice(0, 80)}...</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.stabilityB.slice(0, 80)}...</td></tr>
              </tbody>
            </table>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>IUPAC nomenklatura:</strong> Kation avval, keyin anion nomlanadi. Anion nomi -at qo'shimchasi bilan tugaydi.
              <ul className="mt-1 space-y-0.5 pl-3">
                <li>• <strong>[Co(NH₃)₆]³⁺</strong> — geksaamminkobalt(III)</li>
                <li>• <strong>[Cr(CN)₆]³⁻</strong> — geksatsianoxromat(III)</li>
                <li>• <strong>en</strong> = etilendiamin (bidentat)</li>
                <li>• <strong>ox²⁻</strong> = oksalat (C₂O₄²⁻, bidentat)</li>
              </ul>
            </div>
          </div>
        )}

        {/* — BOSHQA IZOMERIYALARDAN FARQI — */}
        {activePanel === "distinction" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-green-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-green-200 flex items-center gap-2 text-sm">
                <span>🔍</span> Izomeriyalar oilasi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-green-950/40 rounded-lg p-3 border-2 border-green-500/70">
                <div className="text-green-300 font-bold text-[11px] mb-1">🎯 KOORDINATSION IZOMERIYA (bu sahifa)</div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  Ikkita alohida <strong>koordinatsion sfera</strong> (kation + anion) o'rtasida ligand almashinuvi. Ikkala metall va ligand aynan bir xil, faqat qay tomon qay ligandga ega ekanligi farq qiladi.
                </p>
                <p className="text-green-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₆][Cr(CN)₆] ⇌ [Cr(NH₃)₆][Co(CN)₆]
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">🔗 Bog'lanish izomeriyasi (linkage)</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Bir kompleks ichida <strong>ambidentat ligand</strong> turli atom orqali bog'lanadi. Faqat bitta sferada sodir bo'ladi.
                </p>
                <p className="text-blue-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₅NO₂]²⁺ ⇌ [Co(NH₃)₅ONO]²⁺
                </p>
              </div>

              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[11px] mb-1">⚡ Ionizatsiya izomeriyasi</div>
                <p className="text-orange-100 text-[10px] leading-relaxed">
                  Ichki va tashqi sfera ionlari o'zaro almashadi. Erishuvchan tuzlarda AgNO₃ bilan turlicha titrlanish beradi.
                </p>
                <p className="text-orange-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₅Br]SO₄ ⇌ [Co(NH₃)₅SO₄]Br
                </p>
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">💧 Gidrat izomeriyasi</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  H₂O molekulasi ichki sferada koordinatsion yoki tashqi sferada kristall suvi sifatida bo'lishi mumkin.
                </p>
                <p className="text-cyan-200 text-[9.5px] mt-1.5 font-mono">
                  [Cr(H₂O)₆]Cl₃ / [Cr(H₂O)₅Cl]Cl₂·H₂O
                </p>
                <p className="text-cyan-200 text-[9.5px] mt-1 italic">3 xil izomer — fioletovaya, yashil, ochiq yashil</p>
              </div>

              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">🔄 Koordinatsion pozitsiya izomeriyasi</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Ko'p yadroli komplekslarda ligandlarning ko'prik va terminal joylashuvi farq qiladi.
                </p>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[10.5px] mb-1">📌 Muhim eslatma</div>
                <p className="text-yellow-100 text-[9.5px] leading-relaxed">
                  Koordinatsion izomerlar bir <strong>umumiy molekulyar formulaga</strong> ega, lekin ular <strong>ikki xil kimyoviy modda</strong>. Ular turli erishuvchanlik, spektral, magnit va kristallografik xususiyatlarga ega bo'ladi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TAJRIBAVIY USULLAR — */}
        {activePanel === "spectroscopy" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🔬</span> Tajribaviy tasdiqlash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <p className="text-cyan-100 text-[10.5px] leading-relaxed">
                  Koordinatsion izomerlarni ajratish uchun quyidagi asosiy usullar qo'llaniladi. Har bir usul o'ziga xos ma'lumot beradi va ular bir-birini to'ldiradi.
                </p>
              </div>

              {pair.experimentalProof.map((p, i) => (
                <div key={i} className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/40">
                  <div className="text-purple-300 font-bold text-[10.5px] mb-1">{i + 1}-usul</div>
                  <p className="text-purple-100 text-[10px] leading-relaxed">{p}</p>
                </div>
              ))}

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[10.5px] mb-1">📊 Umumiy tavsiyalar</div>
                <ul className="text-blue-100 text-[9.5px] space-y-0.5 leading-relaxed">
                  <li>• <strong>UV-VIS spektroskopiya</strong> — d–d o'tishlar orqali metall va ligand identifikatsiyasi</li>
                  <li>• <strong>IR spektroskopiya</strong> — ν(C≡N), ν(M–N) va boshqa ligand-metall tebranishlari</li>
                  <li>• <strong>NMR (¹H, ¹³C, ¹⁹⁵Pt)</strong> — atom-selektiv aniqlash</li>
                  <li>• <strong>Konduktometriya</strong> — Werner uslubi, ion soni</li>
                  <li>• <strong>X-ray difraktsiya</strong> — kristall tuzilishi va aniq bog' uzunliklari</li>
                  <li>• <strong>Magnit tabiat</strong> — μ_eff (Gouy uslubi)</li>
                  <li>• <strong>Termik analiz (TG/DSC)</strong> — parchalanish tartibi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Alfred Werner va tarixiy tadqiqotlar
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{pair.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1866 — Alfred Werner tug'ilgan</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Mulhouse (Fransiya)da tug'ilgan. Sürix Federal Institut of Technology (ETH)da o'qigan.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1893 — Koordinatsion nazariya</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">"Beitrag zur Konstitution anorganischer Verbindungen" maqolasi — ichki va tashqi sfera tushunchasi kiritildi. Bu maqola koordinatsion kimyoning tug'ilishi hisoblanadi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1893–1900 — Miolati va Werner tajribalari</div>
                <p className="text-green-200 text-[10px] leading-relaxed">A. Miolati bilan birgalikda molar o'tkazuvchanlik o'lchashlar orqali koordinatsion tuzlar tarkibini aniqlashdi. Bu — koordinatsion izomerlar mavjudligining birinchi tajribaviy dalili.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1907 — [Co(NH₃)₆][Cr(CN)₆] izomerlari</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">Werner birinchi bo'lib klassik koordinatsion izomer juftligini ajratdi: [Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆].</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1911 — Optik izomerlar kashfiyoti</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Werner cis-[Co(en)₂Cl₂]⁺ va shu turdagi xelat komplekslarda optik faollikni tasdiqladi. Bu — koordinatsion nazariyaning hal qiluvchi isboti bo'ldi.</p>
              </div>

              <div className="border-l-2 border-orange-500 pl-3">
                <div className="text-orange-300 font-bold text-[11px]">1913 — Nobel mukofoti</div>
                <p className="text-orange-200 text-[10px] leading-relaxed">Werner Kimyo bo'yicha Nobel mukofotini oldi: "kimyo tuzilish nazariyasiga ajoyib hissasi uchun". Bu — noorganik kimyoda birinchi Nobel edi.</p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1919 — Vafoti</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Werner Sürixda 52 yoshida vafot etdi. Uning izidan John Bailar, Fred Basolo, Ralph Pearson kabi olimlar koordinatsion kimyoning zamonaviy sohalarini rivojlantirdilar.</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-pink-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pink-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Koordinatsion izomeriya nima?"
                a="Kation VA anion ikkalasi ham kompleks bo'lgan tuzda, ligandlarning ikki koordinatsion sfera o'rtasida turli taqsimlanishi natijasida hosil bo'ladigan izomeriya. Umumiy formula bir xil, lekin ligandlar taqsimoti farqli."
              />
              <TestQuestion
                q="[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday izomerlar?"
                a="Koordinatsion izomerlar — umumiy tarkib Co+Cr+6NH₃+6CN⁻ bir xil, lekin NH₃ ligandlari Co ga yoki Cr ga bog'langan holatlarni farqi. Werner tomonidan 1907-yilda birinchi bo'lib ajratilgan klassik namuna."
              />
              <TestQuestion
                q="Koordinatsion izomeriya bog'lanish izomeriyasidan qanday farq qiladi?"
                a="Bog'lanish izomeriyasi bitta kompleks ichida ambidentat ligand orqali sodir bo'ladi. Koordinatsion izomeriya esa IKKI alohida kompleks (kation + anion) sferalari orasida ligand almashinuvi orqali sodir bo'ladi."
              />
              <TestQuestion
                q="Koordinatsion izomeriya paydo bo'lishi uchun qanday shartlar kerak?"
                a="1) Kation kompleks bo'lishi shart, 2) Anion kompleks bo'lishi shart, 3) Ligandlar ikkala sferada almashishi mumkin bo'lishi kerak. Agar anion oddiy (masalan, Cl⁻) bo'lsa, koordinatsion izomeriya bo'lmaydi."
              />
              <TestQuestion
                q="Pt(II)/Pt(IV) koordinatsion izomeriya nimaga xos?"
                a="Bir metallning ikki xil oksidlanish darajasi bo'lganda ham koordinatsion izomeriya sodir bo'lishi mumkin. Masalan, [Pt(NH₃)₄][PtCl₆] ⇌ [Pt(NH₃)₄Cl₂][PtCl₄] — Pt(II) va Pt(IV) atomlari o'zaro almashadi."
              />
              <TestQuestion
                q="Werner koordinatsion izomerlarni qanday isbotladi?"
                a="Werner molar o'tkazuvchanlik o'lchashlari, AgNO₃ bilan titratsiya, kristallografik farqlar va rangli tuzlarni ajratish orqali ularning haqiqatan ikki xil modda ekanligini isbotladi. 1913-yilda buning uchun Nobel mukofotini oldi."
              />
              <TestQuestion
                q="[Co(en)₃][Cr(ox)₃] misolida qancha stereoizomer bo'lishi mumkin?"
                a="Har bir tris-xelat kompleks Δ yoki Λ enantiomer bo'lishi mumkin. Shuning uchun A shakli uchun 4 ta stereoizomer: ΔΔ, ΔΛ, ΛΔ, ΛΛ. B shakli uchun ham xuddi shunday — jami 8 ta izomer."
              />
              <TestQuestion
                q="CFSE koordinatsion izomerlar barqarorligiga qanday ta'sir qiladi?"
                a="Kristall maydon barqarorlashish energiyasi (CFSE/LFSE) qaysi metall qaysi ligand bilan yaxshiroq bog'lanishini aniqlaydi. Masalan, Co³⁺(d⁶ LS) + CN⁻ (kuchli maydon) = maksimal LFSE. Shuning uchun [Cr(NH₃)₆][Co(CN)₆] termodinamik afzalroq bo'ladi."
              />
              <TestQuestion
                q="Koordinatsion izomerlar qanday amaliyot sohalariga qo'llaniladi?"
                a="MOF (metall-organik karkaslar) sintezi, bimetal katalizatorlar, sisplatin va Pt(IV) prodruglari kimyoterapiyada, molekulyar magnetika, bio-noorganik modellashtirish (gemoglobin, sitokrom), analitik ajratish usullari."
              />
              <TestQuestion
                q="[Cr(H₂O)₆]Cl₃ va [Cr(H₂O)₅Cl]Cl₂·H₂O — bular qanday izomerlar?"
                a="Bular gidrat izomerlari (yoki koordinatsion-solvat izomerlari) — koordinatsion izomeriyaning yaqin qarindoshi. H₂O molekulasi ichki sferada koordinatsion ligand yoki tashqi sferada kristall suvi sifatida bo'lishi mumkin."
              />
            </div>
          </div>
        )}

        {/* — PDF MODAL — */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPdfModalOpen(false)}>
            <div className="bg-purple-950 rounded-2xl border border-purple-600/50 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50">
                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                  <span>📄</span> PDF hisobot yaratish
                </h3>
                <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs text-purple-400 mb-2">Qaysi bo'limlarni PDFga qo'shishni tanlang:</p>
                {[
                  { k: "intro", label: "1. Kirish — koordinatsion izomeriya", icon: "📖" },
                  { k: "definition", label: "2. Ta'rif va nazariy asos", icon: "📐" },
                  { k: "examples", label: "3. 5 ta klassik namunalar", icon: "🧪" },
                  { k: "distinction", label: "4. Boshqa izomeriyalardan farqi", icon: "🔍" },
                  { k: "thermodynamics", label: "5. Termodinamika va CFSE", icon: "🔥" },
                  { k: "spectroscopy", label: "6. Tajribaviy usullar", icon: "🔬" },
                  { k: "history", label: "7. Werner tarixi", icon: "📜" },
                  { k: "table", label: "8. Solishtirish jadvali", icon: "📊" },
                  { k: "application", label: "9. Amaliy qo'llanilishi", icon: "⚙️" },
                  { k: "references", label: "10. Adabiyotlar", icon: "📚" }
                ].map(({ k, label, icon }) => (
                  <label key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfSections[k]}
                      onChange={(e) => setPdfSections({ ...pdfSections, [k]: e.target.checked })}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm text-purple-200">{label}</span>
                  </label>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-purple-800/50 flex gap-2 justify-end">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200"
                  disabled={pdfGenerating}
                >Bekor qilish</button>
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                >
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

      {/* PASTKI RANG LEGENDA */}
      {!fullscreenMode && (
        <div className="flex justify-center gap-3 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#C88033]"></div><span className="text-purple-300">Cu</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#D0D0E0]"></div><span className="text-purple-300">Pt</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#909090]"></div><span className="text-purple-300">C</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FFFF30]"></div><span className="text-purple-300">S</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-400/30"></div><span className="text-purple-300">◆ Kation sferasi</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-400/30"></div><span className="text-purple-300">◇ Anion sferasi</span></div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(88, 28, 135, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli
// ─────────────────────────────────────────────────────────────
function TestQuestion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-pink-950/30 rounded-lg border border-pink-800/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 hover:bg-pink-900/30 transition-colors flex items-start gap-2"
      >
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
