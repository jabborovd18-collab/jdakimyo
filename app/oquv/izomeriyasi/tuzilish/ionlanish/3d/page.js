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
  Cu: 0xC88033, Pt: 0xD0D0E0, Ni: 0x50D050,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  S: 0xFFFF30, Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094,
  K: 0x8F40D4, Na: 0xAB5CF2, Ba: 0x00C900, Ag: 0xC0C0C0,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  innerSphere: 0xFFD700,   // Ichki sfera halosi — oltin
  outerSphere: 0x66CCFF    // Tashqi sfera halosi — moviy
}

// ═══════════════════════════════════════════════════════════════════════════
// IONLANISH IZOMERLAR DATABASE
// ────────────────────────────────────────────────────────────────────────────
// Ionlanish izomeriyasi — ichki koordinatsion sfera va tashqi (kristall) sfera
// ionlari o'zaro almashishi natijasida hosil bo'ladigan izomeriya turi.
// Erigan holatda turli ionlarni beradi — bu farq AgNO3, BaCl2 va o'tkazuvchanlik
// testlari orqali aniqlanadi (Werner uslubi, 1893).
// ═══════════════════════════════════════════════════════════════════════════
const IONIZATION_ISOMERS = {

  // ─────────────────────────────────────────────────────────────────
  // 1. KLASSIK NAMUNA — [Co(NH3)5Br]SO4 ⇌ [Co(NH3)5SO4]Br
  // Werner 1907 — birinchi tasdiqlangan ionlanish izomer juftligi
  // ─────────────────────────────────────────────────────────────────
  CoBrSO4: {
    id: "CoBrSO4",
    title: "Klassik namuna — Br⁻/SO₄²⁻ almashinuvi",
    shortTitle: "Br ↔ SO₄²⁻",
    grossFormula: "Co (NH₃)₅ Br SO₄",
    formulaA: "[Co(NH₃)₅Br]SO₄",
    formulaB: "[Co(NH₃)₅(SO₄)]Br",
    nameA: "Bromopentaamminkobalt(III) sulfat",
    nameB: "Sulfatopentaamminkobalt(III) bromid",
    // A shakli — Br ichki sferada, SO4 tashqi sferada
    innerA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "Br", specialColor: CPK.Br, chargeText: "2+", complexCharge: 2 },
    outerA: { ion: "SO4", charge: "2−", color: 0xFFE066, count: 1, ionText: "SO₄²⁻", freeIonType: "sulfat" },
    // B shakli — SO4 ichki sferada, Br tashqi sferada
    innerB: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "SO4", specialColor: 0xFFE066, chargeText: "1+", complexCharge: 1 },
    outerB: { ion: "Br", charge: "1−", color: CPK.Br, count: 1, ionText: "Br⁻", freeIonType: "bromid" },
    // Testlar
    colorA: "To'q binafsha kristallar (Co–Br xromofor)",
    colorB: "Qizil-binafsha kristallar (Co–OSO₃ xromofor)",
    agno3A: "Cho'kma DARHOL hosil bo'lmaydi — Br⁻ ichki sferada, mustahkam bog'langan. Faqat qaynatilgandan keyin (Br⁻ ligand almashinuvidan so'ng) AgBr sarg'ish cho'kma paydo bo'ladi.",
    agno3B: "AgBr sarg'ish cho'kma DARHOL hosil bo'ladi — Br⁻ tashqi sferada erkin ion.",
    bacl2A: "BaSO₄ oq cho'kma DARHOL hosil bo'ladi — SO₄²⁻ tashqi sferada erkin.",
    bacl2B: "Cho'kma DARHOL hosil bo'lmaydi — SO₄²⁻ ichki sferada Co bilan bog'langan.",
    conductivityA: "Λₘ ≈ 250 S·sm²/mol — 3 ion (1 kation ²⁺ + 1 anion ²⁻)",
    conductivityB: "Λₘ ≈ 105 S·sm²/mol — 2 ion (1 kation ¹⁺ + 1 anion ¹⁻)",
    ionCountA: 3,
    ionCountB: 2,
    stabilityA: "Br⁻ — yumshoqroq donor, Co³⁺ o'rta qattiq kislota. Co–Br bog' uzunligi ≈ 2.42 Å. SO₄²⁻ tashqi sferada elektrostatik ushlab turadi.",
    stabilityB: "SO₄²⁻ — qattiq donor (O donor), Co³⁺ ga yaxshi mos. Co–O(SO₃) bog' uzunligi ≈ 1.98 Å. Br⁻ tashqi sferada erkin.",
    thermoNote: "Termodinamik jihatdan A shakli ancha barqaror (ΔG ≈ −15 kJ/mol farq). B shakli asosan sintez sharoitida saqlanadi va qaynatilganda A shakliga o'tadi.",
    discovery: "Alfred Werner va A. Miolati (1893–1907, Sürix universiteti) — ionlanish izomeriyasining birinchi tasdiqlangan misoli. Werner molar o'tkazuvchanlik va AgNO₃/BaCl₂ testlari orqali ular haqiqatan ikki xil modda ekanligini isbotladi. Bu — koordinatsion nazariyaning hal qiluvchi tajribaviy dalili.",
    application: "Analitik kimyoda Co³⁺ komplekslarini ajratish uchun standart usul. Farmatsevtikada Co-B12 vitamin analoglari (kobalamin) tarkibida shu tipdagi navbatlanish uchraydi.",
    experimentalProof: [
      "AgNO₃ testi: A da Ag⁺ + Br⁻(ichki) → reaksiya YOQ; B da darhol AgBr↓ (sarg'ish cho'kma).",
      "BaCl₂ testi: A da darhol BaSO₄↓ (oq cho'kma); B da reaksiya YOQ.",
      "Konduktometriya: A ning Λₘ ≈ 250 (3 ion), B ning Λₘ ≈ 105 (2 ion) — 2.4x farq.",
      "UV-VIS: A da maksimum 550 nm (⁵T₁g ← ¹A₁g, Co–Br); B da 505 nm (Co–OSO₃).",
      "IR spektri: A da ν(SO₄) 1100 sm⁻¹ (erkin tetraedrik); B da 1120, 1050, 970 sm⁻¹ (koordinatsion, buzilgan simmetriya).",
      "X-ray difraktsiya: A ning kristall panjarasi — Co–Br oktaedri va SO₄²⁻ tashqi ionli; B da esa Co bevosita SO₄²⁻ ga bog'langan.",
      "Bog' uzunliklari: A da Co–Br = 2.42 Å; B da Co–O = 1.98 Å (X-ray tasdiq)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Cr — Jorgensenning klassik NH3-SO4-Cl misoli
  // ─────────────────────────────────────────────────────────────────
  CrClSO4: {
    id: "CrClSO4",
    title: "Cr³⁺ — SO₄²⁻/Cl⁻ almashinuvi (Jørgensen)",
    shortTitle: "SO₄²⁻ ↔ Cl⁻",
    grossFormula: "Cr (NH₃)₅ SO₄ Cl",
    formulaA: "[Cr(NH₃)₅(SO₄)]Cl",
    formulaB: "[Cr(NH₃)₅Cl]SO₄",
    nameA: "Sulfatopentaamminxrom(III) xlorid",
    nameB: "Xloropentaamminxrom(III) sulfat",
    innerA: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "SO4", specialColor: 0xFFE066, chargeText: "1+", complexCharge: 1 },
    outerA: { ion: "Cl", charge: "1−", color: CPK.Cl, count: 1, ionText: "Cl⁻", freeIonType: "xlorid" },
    innerB: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "Cl", specialColor: CPK.Cl, chargeText: "2+", complexCharge: 2 },
    outerB: { ion: "SO4", charge: "2−", color: 0xFFE066, count: 1, ionText: "SO₄²⁻", freeIonType: "sulfat" },
    colorA: "Qizil-pushti kristallar (Cr–OSO₃ xromofor)",
    colorB: "Yashil-binafsha kristallar (Cr–Cl xromofor, 'yashil sulfat')",
    agno3A: "AgCl oq cho'kma DARHOL hosil bo'ladi — Cl⁻ tashqi sferada erkin ion.",
    agno3B: "Cho'kma darhol hosil bo'lmaydi — Cl⁻ ichki sferada mustahkam bog'langan (Cr–Cl inert).",
    bacl2A: "Cho'kma hosil bo'lmaydi — SO₄²⁻ ichki sferada Cr bilan bog'langan.",
    bacl2B: "BaSO₄ oq cho'kma DARHOL hosil bo'ladi — SO₄²⁻ tashqi sferada erkin.",
    conductivityA: "Λₘ ≈ 105 S·sm²/mol — 2 ion (1 kation ¹⁺ + 1 anion ¹⁻)",
    conductivityB: "Λₘ ≈ 250 S·sm²/mol — 3 ion (1 kation ²⁺ + 1 anion ²⁻)",
    ionCountA: 2,
    ionCountB: 3,
    stabilityA: "SO₄²⁻ (qattiq donor, O orqali) Cr³⁺ (qattiq kislota) bilan yaxshi mos. HSAB bo'yicha juda mos.",
    stabilityB: "Cr–Cl bog'i termodinamik jihatdan ancha zaifroq. Cr(III) d³ konfiguratsiyasi Jahn-Teller ta'sirini bermaydi, lekin Cl⁻ katta polyarlanadi.",
    thermoNote: "Jørgensen (1892) bu ikki tuzni birinchi bo'lib ajratdi va ularning turli rangi asosida ular ikki xil modda ekanligini taxmin qildi. Werner keyinchalik ularni koordinatsion nazariya bo'yicha tushuntirdi.",
    discovery: "Sofus Mads Jørgensen (Kopengagen, 1892) — Cr³⁺ komplekslarida NH₃-SO₄-Cl navbatlanishini birinchi bo'lib kuzatdi. 'Yashil sulfat' va 'qizil xlorid' rangli farqlari sabab ular birinchi diagnostik izomerlar bo'ldi. Werner (1893) bu farqlarni koordinatsion nazariya orqali izohladi.",
    application: "Xrom oshlash sanoati (tanning) — Cr³⁺ komplekslarining teri bilan bog'lanishi. Analitik kimyoda Cr identifikatsiyasi uchun.",
    experimentalProof: [
      "Rang farqi: A qizil-pushti, B yashil-binafsha — ko'z bilan ko'rinadigan farq.",
      "AgNO₃ testi: A da darhol AgCl↓; B da issiqlik kerak (qaynatib turg'unlik yo'qotilishi).",
      "BaCl₂ testi: A da reaksiya YO'Q; B da darhol BaSO₄↓.",
      "Konduktometriya: A ning Λₘ = 100–110, B ning Λₘ = 240–260 — Werner asosiy diagnostik uslubi.",
      "UV-VIS: A da ⁴T₂g ← ⁴A₂g maksimumi 500 nm, B da 480 nm (Cr d–d o'tishlari).",
      "IR: A da ν(SO₄) monodentat ligand shakli (uch banda: 1170, 1050, 990 sm⁻¹)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Co — NO2/Cl navbatlanishi (bog'lanish + ionlanish aralashishi)
  // ─────────────────────────────────────────────────────────────────
  CoNO2Cl: {
    id: "CoNO2Cl",
    title: "Co³⁺ — NO₂⁻/Cl⁻ ionlanish",
    shortTitle: "NO₂⁻ ↔ Cl⁻",
    grossFormula: "Co (NH₃)₄ (NO₂) Cl₂",
    formulaA: "[Co(NH₃)₄(NO₂)Cl]Cl",
    formulaB: "[Co(NH₃)₄Cl₂]NO₂",
    nameA: "Nitroxloroetraaminkobalt(III) xlorid",
    nameB: "Dixlortetraaminkobalt(III) nitrit",
    innerA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral_mixed4_1_1", mainLigand: "NH3", mainCount: 4, specialLigand: "NO2_Cl", specialColor: CPK.N, chargeText: "1+", complexCharge: 1 },
    outerA: { ion: "Cl", charge: "1−", color: CPK.Cl, count: 1, ionText: "Cl⁻", freeIonType: "xlorid" },
    innerB: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral_mixed4_2", mainLigand: "NH3", mainCount: 4, specialLigand: "Cl2", specialColor: CPK.Cl, chargeText: "1+", complexCharge: 1 },
    outerB: { ion: "NO2", charge: "1−", color: 0xffaa66, count: 1, ionText: "NO₂⁻", freeIonType: "nitrit" },
    colorA: "To'q sariq-jigarrang kristallar (mixed NO₂/Cl xromofor)",
    colorB: "To'q yashil-sariq kristallar (trans-[Co(NH₃)₄Cl₂]⁺ pratseodimium tipida)",
    agno3A: "1 mol AgCl↓ darhol (faqat tashqi Cl⁻).",
    agno3B: "AgCl DARHOL hosil bo'lmaydi (ikkala Cl ichki sferada). Faqat qaynatilgandan keyin.",
    bacl2A: "Reaksiya yo'q — SO₄²⁻ yo'q.",
    bacl2B: "Reaksiya yo'q — SO₄²⁻ yo'q, lekin NO₂⁻ ozgina rangli reaksiya berishi mumkin.",
    conductivityA: "Λₘ ≈ 105 S·sm²/mol — 2 ion (1:1 tuz)",
    conductivityB: "Λₘ ≈ 108 S·sm²/mol — 2 ion (1:1 tuz)",
    ionCountA: 2,
    ionCountB: 2,
    stabilityA: "NO₂⁻ Co³⁺ bilan N-donor sifatida kuchli bog'lanadi (nitro shakli). Cl⁻ o'rta kuchli ligand.",
    stabilityB: "Ikki Cl⁻ ichki sferada — trans yoki cis izomerlar bo'lishi mumkin. NO₂⁻ tashqi sferada erkin (nitrit tuzi).",
    thermoNote: "Konduktometrik farq minimal (ikkala izomer 1:1 tuz). Ajratish uchun AgNO₃ testi va IR spektri qo'llaniladi. Rangdagi farq ham ajratishga yordam beradi.",
    discovery: "Werner (1900) bu tipdagi mixed-ligand izomerlarni bir necha holatda o'rgangan. NO₂⁻ ligandi bog'lanish izomeriyasini ham beruvchi — shuning uchun bu tizim koordinatsion kimyoda ayniqsa boy.",
    application: "Bu tipdagi tuzlar farmakologiya va agrokimyoda muhim. Sisplatin (Rosenberg 1965) analog sintezida navbatlanish tushunchasi asos rol o'ynaydi.",
    experimentalProof: [
      "AgNO₃ titratsiyasi: A da 1 mol Cl⁻ erkin (1 mol AgCl); B da 0 mol Cl⁻ erkin.",
      "IR: A da ν(NO₂) 1430 (nitro, koordinatsion), B da 1250 (nitrit, erkin ion).",
      "UV-VIS: rang farqi (sariq vs yashil-sariq) — d–d o'tishlar geometriyasi turlicha.",
      "Konduktometriya farq bermaydi — 1:1 tuz.",
      "Bog'lanish izomeriya ham qo'shimcha imkoniyat beradi (nitro/nitrito)."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Pt — Cl2Br2 kvadrat-planar tipida
  // ─────────────────────────────────────────────────────────────────
  PtClBr: {
    id: "PtClBr",
    title: "Pt(IV) — Cl⁻/Br⁻ almashinuvi",
    shortTitle: "Cl ↔ Br",
    grossFormula: "Pt (NH₃)₄ Cl₂ Br₂",
    formulaA: "[Pt(NH₃)₄Cl₂]Br₂",
    formulaB: "[Pt(NH₃)₄Br₂]Cl₂",
    nameA: "trans-Dixlortetraaminplatina(IV) bromid",
    nameB: "trans-Dibromtetraaminplatina(IV) xlorid",
    innerA: { metal: "Pt", charge: "+4", color: CPK.Pt, radius: 0.44, geometry: "octahedral_mixed4_2", mainLigand: "NH3", mainCount: 4, specialLigand: "Cl2", specialColor: CPK.Cl, chargeText: "2+", complexCharge: 2 },
    outerA: { ion: "Br", charge: "1−", color: CPK.Br, count: 2, ionText: "2 Br⁻", freeIonType: "bromid" },
    innerB: { metal: "Pt", charge: "+4", color: CPK.Pt, radius: 0.44, geometry: "octahedral_mixed4_2", mainLigand: "NH3", mainCount: 4, specialLigand: "Br2", specialColor: CPK.Br, chargeText: "2+", complexCharge: 2 },
    outerB: { ion: "Cl", charge: "1−", color: CPK.Cl, count: 2, ionText: "2 Cl⁻", freeIonType: "xlorid" },
    colorA: "Och sariq kristallar (Pt–Cl UV yaqinida yutadi)",
    colorB: "To'q sariq-jigarrang kristallar (Pt–Br yutish uzunroq to'lqinlarda)",
    agno3A: "AgBr sarg'ish cho'kma darhol (2 mol) — Br⁻ tashqi sferada.",
    agno3B: "AgCl oq cho'kma darhol (2 mol) — Cl⁻ tashqi sferada.",
    bacl2A: "Reaksiya yo'q — SO₄²⁻ yo'q.",
    bacl2B: "Reaksiya yo'q — SO₄²⁻ yo'q.",
    conductivityA: "Λₘ ≈ 250 S·sm²/mol — 3 ion (1 kation ²⁺ + 2 anion ¹⁻)",
    conductivityB: "Λₘ ≈ 250 S·sm²/mol — 3 ion (bir xil)",
    ionCountA: 3,
    ionCountB: 3,
    stabilityA: "Pt(IV) — d⁶ LS, juda inert. Cl⁻ ichki sferada trans-holatda joylashadi (kinetik afzallik).",
    stabilityB: "Pt–Br bog' uzunligi ancha (2.44 Å vs 2.32 Å). Br⁻ yumshoqroq — Pt(IV) o'rta qattiq kislota bilan yaxshi mos.",
    thermoNote: "Konduktometrik farq bo'lmasa ham, AgNO₃ testi va rangdagi farq aniq. Yumshoq/qattiq HSAB tahlili bo'yicha B shakli (Br ichki) ozgina termodinamik afzalroq.",
    discovery: "Kurnakov (1904, Sankt-Peterburg) va Werner (1912) — Pt(IV) komplekslarida ionlanish izomerlarini birinchi bo'lib tadqiq qilishdi. Pt(IV) inert xarakteri sabab ikkala izomer ham xona haroratida barqaror.",
    application: "Sisplatin analoglari sintezida asos. Pt(IV) prodrug lari (satraplatin, iproplatin) — kimyoterapiyada bu tipdagi navbatlanishlar terapevtik effektga ta'sir qiladi.",
    experimentalProof: [
      "AgNO₃ testi: A da 2 mol AgBr↓ sarg'ish; B da 2 mol AgCl↓ oq — rang farqi asosida ajratish.",
      "IR: ν(Pt–Cl) 340 sm⁻¹ va ν(Pt–Br) 220 sm⁻¹ — A va B da mos ravishda intensiv.",
      "¹⁹⁵Pt NMR: A da −2100 ppm, B da −2400 ppm — atom-selektiv aniqlash.",
      "X-ray: trans-[PtCl₂(NH₃)₄]²⁺ oktaedri va Br⁻ tashqi ionlari aniq ko'rinadi.",
      "Kurnakov testi: tiokarbamid CS(NH₂)₂ bilan reaksiya, cis/trans va ichki/tashqi ligand aniqlanishi."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. GIDRAT IZOMERIYASI — [Cr(H2O)6]Cl3 sistemasi
  // Ionlanish izomeriyasining maxsus turi
  // ─────────────────────────────────────────────────────────────────
  CrH2OCl: {
    id: "CrH2OCl",
    title: "Gidrat izomeriya — [Cr(H₂O)₆]Cl₃ tizimi",
    shortTitle: "H₂O ↔ Cl⁻",
    grossFormula: "Cr Cl₃ · 6 H₂O",
    formulaA: "[Cr(H₂O)₆]Cl₃",
    formulaB: "[Cr(H₂O)₅Cl]Cl₂ · H₂O",
    nameA: "Geksaakvaxrom(III) xlorid (fioletovaya)",
    nameB: "Xloropentaakvaxrom(III) dixlorid monogidrat (yashil)",
    innerA: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", mainLigand: "H2O", mainCount: 6, specialLigand: null, specialColor: CPK.O, chargeText: "3+", complexCharge: 3 },
    outerA: { ion: "Cl", charge: "1−", color: CPK.Cl, count: 3, ionText: "3 Cl⁻", freeIonType: "xlorid" },
    innerB: { metal: "Cr", charge: "+3", color: CPK.Cr, radius: 0.42, geometry: "octahedral", mainLigand: "H2O", mainCount: 5, specialLigand: "Cl", specialColor: CPK.Cl, chargeText: "2+", complexCharge: 2 },
    outerB: { ion: "Cl_H2O", charge: "1−", color: CPK.Cl, count: 2, ionText: "2 Cl⁻ + H₂O", freeIonType: "xlorid + kristall suvi" },
    colorA: "Ochiq binafsha (fioletovaya) — [Cr(H₂O)₆]³⁺ xromofor, 570 nm",
    colorB: "Yashil (och yashil) — [Cr(H₂O)₅Cl]²⁺ xromofor, 620 nm",
    agno3A: "3 mol AgCl↓ oq cho'kma DARHOL (barcha Cl⁻ tashqi sferada).",
    agno3B: "2 mol AgCl↓ darhol; 1 mol Cl⁻ ichki sferada — faqat qaynatilgandan so'ng chiqadi.",
    bacl2A: "Reaksiya yo'q.",
    bacl2B: "Reaksiya yo'q.",
    conductivityA: "Λₘ ≈ 430 S·sm²/mol — 4 ion (1 kation ³⁺ + 3 anion ¹⁻)",
    conductivityB: "Λₘ ≈ 250 S·sm²/mol — 3 ion (1 kation ²⁺ + 2 anion ¹⁻)",
    ionCountA: 4,
    ionCountB: 3,
    stabilityA: "[Cr(H₂O)₆]³⁺ — juda barqaror akvakompleks. H₂O qattiq donor Cr³⁺ (qattiq kislota) bilan yaxshi mos.",
    stabilityB: "Cr–Cl bog'i H₂O bog'idan biroz kuchsizroq (Δ ≈ 15 kJ/mol). B shakli sintez yaqin harorat/muhitda saqlanadi.",
    thermoNote: "Gidrat izomeriya — ionlanish izomeriyasining maxsus ko'rinishi. Bu yerda H₂O va Cl⁻ ichki va tashqi sfera o'rtasida almashadi. Uchinchi shakl ham mavjud: [Cr(H₂O)₄Cl₂]Cl·2H₂O (to'q yashil).",
    discovery: "S. M. Jørgensen (1898) va Werner (1901) — bu klassik uchlik izomerlar. Jørgensen 'zanjir nazariyasi' bilan tushuntirdi, Werner esa koordinatsion nazariya bilan g'olib chiqdi. Bu misol koordinatsion kimyo tarixidagi eng muhim tajribalardan biri.",
    application: "Xrom kimyosi va oshlash sanoati (tanning). Suv qattiqligini o'lchashda va Cr(III) analitik reaksiyalarida ishlatiladi. Ozon-suv tozalash sistemalarida ham koordinatsion navbatlanishlar muhim rol o'ynaydi.",
    experimentalProof: [
      "AgNO₃ titratsiyasi (Werner klassik testi): A → 3 Cl⁻ chiqadi; B → 2 Cl⁻ (bir Cl⁻ ichki sferada).",
      "Rang farqi: A binafsha, B yashil — ko'z bilan ko'rinadi.",
      "Kristall suvi TG (termogravimetriya): A da 100°C atrofida barcha 6 ta H₂O; B da 60°C da 1 ta erkin H₂O, 100°C da qolgan 5 ta.",
      "UV-VIS: A maksimum 408 va 574 nm (⁴T₁g, ⁴T₂g); B maksimum 435 va 620 nm — d–d o'tishlar sezilarli farq.",
      "Konduktometriya: A 4-ion tuzi (Λₘ = 430), B 3-ion tuzi (Λₘ = 250).",
      "Uchinchi izomer: [Cr(H₂O)₄Cl₂]Cl·2H₂O — Λₘ = 105, 2-ion tuzi."
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. Co — Br va NO3 kombinatsiyasi
  // ─────────────────────────────────────────────────────────────────
  CoNO3Br: {
    id: "CoNO3Br",
    title: "Co³⁺ — NO₃⁻/Br⁻ ionlanish",
    shortTitle: "NO₃⁻ ↔ Br⁻",
    grossFormula: "Co (NH₃)₅ NO₃ Br",
    formulaA: "[Co(NH₃)₅(NO₃)]Br",
    formulaB: "[Co(NH₃)₅Br](NO₃)",
    nameA: "Nitratopentaamminkobalt(III) bromid",
    nameB: "Bromopentaamminkobalt(III) nitrat",
    innerA: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "NO3", specialColor: 0xff88aa, chargeText: "2+", complexCharge: 2 },
    outerA: { ion: "Br", charge: "1−", color: CPK.Br, count: 1, ionText: "Br⁻", freeIonType: "bromid" },
    innerB: { metal: "Co", charge: "+3", color: CPK.Co, radius: 0.42, geometry: "octahedral", mainLigand: "NH3", mainCount: 5, specialLigand: "Br", specialColor: CPK.Br, chargeText: "2+", complexCharge: 2 },
    outerB: { ion: "NO3", charge: "1−", color: 0xff88aa, count: 1, ionText: "NO₃⁻", freeIonType: "nitrat" },
    colorA: "Pushti-qizil kristallar",
    colorB: "To'q binafsha kristallar (Co–Br xromofor)",
    agno3A: "AgBr sarg'ish cho'kma darhol — Br⁻ tashqi sferada.",
    agno3B: "Cho'kma hosil bo'lmaydi — Br⁻ ichki sferada. Faqat konsentrirlangan HCl qo'shilsa yoki qaynatilsa reaksiya boradi.",
    bacl2A: "Reaksiya yo'q (SO₄²⁻ yo'q). NO₃⁻ tashqi sferada uchun difenilaminli test bo'yicha aniqlanadi.",
    bacl2B: "Reaksiya yo'q. NO₃⁻ hali ham tashqi sferada.",
    conductivityA: "Λₘ ≈ 250 S·sm²/mol — 3 ion (kation ²⁺ + anion ¹⁻)",
    conductivityB: "Λₘ ≈ 250 S·sm²/mol — 3 ion (bir xil)",
    ionCountA: 3,
    ionCountB: 3,
    stabilityA: "NO₃⁻ — kuchsiz koordinatsion ligand (O donor, lekin bog'lanish zaif). Co(III) bilan monodentat.",
    stabilityB: "Br⁻ o'rtacha kuchli, Co(III) o'rta qattiq kislota — HSAB bo'yicha mos. B shakli termodinamik jihatdan afzalroq.",
    thermoNote: "Ikki tuz o'rtasidagi entalpiya farqi ≈ 25 kJ/mol (B afzal). Kinetik jihatdan A shakli ham xona haroratida barqaror.",
    discovery: "Werner-Miolati (1893) bu tipdagi tuzlarni molar o'tkazuvchanlik uslubi bilan tekshirishgan. NO₃⁻ va Br⁻ — ikkala ham bir zaryadli anion, shuning uchun ion soni bir xil (3 ion), lekin AgNO₃ testi va rang farqi ajratishga imkon beradi.",
    application: "Farmatsevtikada gormonlar kompleks tashuvchisi sifatida, bo'yoq ishlab chiqarishda (Co-based pigments).",
    experimentalProof: [
      "AgNO₃ testi: A da darhol AgBr↓; B da qaynatilgandan keyingina.",
      "Difenilamin testi (NO₃⁻ uchun): A va B da har ikkalasi ham pozitiv (chunki NO₃⁻ ikkalasida ham mavjud — A tashqi, B ham tashqi).",
      "IR: A da ν(NO₃) koordinatsion (1490, 1310, 1010 sm⁻¹, monodentat); B da erkin ion (1380, 830 sm⁻¹).",
      "UV-VIS: A pushti 505 nm; B binafsha 550 nm (Co–Br xromofor).",
      "Konduktometriya farqi kichik — asosiy diagnostik usul AgNO₃."
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶ LS) — juda inert", color: "#F090A0", cfse: "−2.4 Δₒ" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d⁵ 4s¹", oxidation: "+3", role: "Markaziy ion (d³) — ancha inert", color: "#8A99C7", cfse: "−1.2 Δₒ" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+4", role: "Markaziy ion (d⁶ LS) — juda inert", color: "#D0D0E0", cfse: "−2.4 Δₒ" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃ ligand donor atomi", hybridization: "sp³", color: "#3050F8" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "H₂O, SO₄²⁻, NO₃⁻ donor atomi", hybridization: "sp²/sp³", color: "#FF0D0D" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u", config: "[Ne] 3s² 3p⁴", role: "SO₄²⁻ markaziy atomi", hybridization: "sp³", color: "#FFFF30" },
  Cl: { name: "Xlor (Cl)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁵", role: "Ionli yoki koordinatsion ligand", color: "#1FF01F" },
  Br: { name: "Brom (Br)", atomic: 35, mass: "79.90 u", config: "[Ar] 3d¹⁰ 4s² 4p⁵", role: "Ionli yoki koordinatsion ligand", color: "#A62929" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃, H₂O tarkibi", color: "#FFFFFF" },
  Ag: { name: "Kumush (Ag)", atomic: 47, mass: "107.87 u", config: "[Kr] 4d¹⁰ 5s¹", role: "Test reagenti (AgNO₃)", color: "#C0C0C0" },
  Ba: { name: "Bariy (Ba)", atomic: 56, mass: "137.33 u", config: "[Xe] 6s²", role: "Test reagenti (BaCl₂)", color: "#00C900" }
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
// ASOSIY KOMPONENT — IONLANISH IZOMERIYA 3D
// ═══════════════════════════════════════════════════════════════════════════
export default function IonlanishIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const innerSphereRef = useRef(null)
  const outerSphereRef = useRef(null)
  const boundaryRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const highlightRef = useRef([])
  const swapAnimRef = useRef({ active: false, progress: 0, direction: 1 })
  const testAnimRef = useRef({ type: null, progress: 0, particles: [] })

  // ── UI STATE'lari ─────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentPair, setCurrentPair] = useState("CoBrSO4")
  const [isomerForm, setIsomerForm] = useState("A")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both")     // both | inner | outer
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(false)
  const [showSphereBoundary, setShowSphereBoundary] = useState(true)
  const [showChargeHalo, setShowChargeHalo] = useState(true)
  const [swapAnimate, setSwapAnimate] = useState(false)
  const [activeTest, setActiveTest] = useState(null) // null | 'AgNO3' | 'BaCl2' | 'heat'
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, definition: true, examples: true, distinction: true,
    tests: true, thermodynamics: true, hydrate: true, history: true,
    table: true, application: true, references: true
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

  const pair = IONIZATION_ISOMERS[currentPair]
  const activeInner = isomerForm === "A" ? pair.innerA : pair.innerB
  const activeOuter = isomerForm === "A" ? pair.outerA : pair.outerB
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

  // ── NH₃ LIGAND ─────────────────────────────────────────
  const createNH3 = useCallback((parent, nPos, centerPos, showH, sphereTag) => {
    const group = new THREE.Group()
    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NH₃', sphereTag }
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
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, sphereTag }
        group.add(hMesh); atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ── H₂O LIGAND ─────────────────────────────────────────
  const createH2O = useCallback((parent, oPos, centerPos, showH, sphereTag) => {
    const group = new THREE.Group()
    const oMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.12 })
    )
    oMesh.position.copy(oPos)
    oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'H₂O', sphereTag }
    group.add(oMesh); atomsRef.current.push(oMesh)
    createBond(group, centerPos, oPos, CPK.bond, 0.06)
    if (showH) {
      const outward = oPos.clone().sub(centerPos).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      ;[+1, -1].forEach(sign => {
        const hDir = outward.clone().multiplyScalar(0.28).add(perp.clone().multiplyScalar(0.30 * sign))
        const hPos = oPos.clone().add(hDir)
        const hMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.10, 20, 20),
          new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        )
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, sphereTag }
        group.add(hMesh); atomsRef.current.push(hMesh)
        createBond(group, oPos, hPos, 0x666677, 0.03, 0.5)
      })
    }
    parent.add(group)
    return group
  }, [createBond])

  // ── Cl/Br yakka atom koordinatsion LIGAND ─────────────
  const createHalide = useCallback((parent, centerPos, direction, halideType, sphereTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const color = halideType === 'Cl' ? CPK.Cl : CPK.Br
    const radius = halideType === 'Cl' ? 0.32 : 0.36
    const dist = halideType === 'Cl' ? 2.30 : 2.42
    const pos = centerPos.clone().add(dir.clone().multiplyScalar(dist))
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.35, emissive: color, emissiveIntensity: 0.18 })
    )
    mesh.position.copy(pos)
    mesh.userData = { type: 'atom', element: halideType, info: ATOM_INFO[halideType], ligandName: `${halideType}⁻ (koordinatsion)`, sphereTag, charge: '1−' }
    group.add(mesh); atomsRef.current.push(mesh)
    createBond(group, centerPos, pos, CPK.bond, 0.07, 0.85)
    parent.add(group)
    return group
  }, [createBond])

  // ── SO₄ KOORDINATSION LIGAND (monodentat, M-O-SO₃) ──────────
  const createSO4Ligand = useCallback((parent, centerPos, direction, sphereTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const o1Pos = centerPos.clone().add(dir.clone().multiplyScalar(1.98))
    const o1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
    )
    o1.position.copy(o1Pos)
    o1.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ (donor O)', sphereTag }
    group.add(o1); atomsRef.current.push(o1)
    createBond(group, centerPos, o1Pos, CPK.bond, 0.07, 0.85)

    const sPos = o1Pos.clone().add(dir.clone().multiplyScalar(1.48))
    const sMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.3, metalness: 0.35, emissive: CPK.S, emissiveIntensity: 0.18 })
    )
    sMesh.position.copy(sPos)
    sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'SO₄²⁻ markazi', sphereTag }
    group.add(sMesh); atomsRef.current.push(sMesh)
    createBond(group, o1Pos, sPos, 0xaaaa33, 0.055, 0.8)

    const up = new THREE.Vector3(0, 1, 0)
    const perp1 = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let i = 0; i < 3; i++) {
      const ang = (i * 2 * Math.PI) / 3
      const oDir = dir.clone().multiplyScalar(0.5)
        .add(perp1.clone().multiplyScalar(0.87 * Math.cos(ang)))
        .add(perp2.clone().multiplyScalar(0.87 * Math.sin(ang)))
      const oPos = sPos.clone().add(oDir.multiplyScalar(1.48))
      const oT = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oT.position.copy(oPos)
      oT.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ (=O)', sphereTag }
      group.add(oT); atomsRef.current.push(oT)
      createDoubleBond(group, sPos, oPos, 0xaa4444, 0.04)
    }
    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ── NO₃ KOORDINATSION LIGAND (monodentat) ──────────────
  const createNO3Ligand = useCallback((parent, centerPos, direction, sphereTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const o1Pos = centerPos.clone().add(dir.clone().multiplyScalar(2.00))
    const nPos = o1Pos.clone().add(dir.clone().multiplyScalar(1.31))

    const o1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
    )
    o1.position.copy(o1Pos)
    o1.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₃⁻ (donor O)', sphereTag }
    group.add(o1); atomsRef.current.push(o1)
    createBond(group, centerPos, o1Pos, CPK.bond, 0.07, 0.85)

    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.25, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NO₃⁻ markazi', sphereTag }
    group.add(nMesh); atomsRef.current.push(nMesh)
    createBond(group, o1Pos, nPos, 0x556699, 0.05, 0.75)

    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    ;[+1, -1].forEach(sign => {
      const oDir = dir.clone().multiplyScalar(Math.cos(2 * Math.PI / 3))
        .add(perp.clone().multiplyScalar(Math.sin(2 * Math.PI / 3) * sign))
      const oPos = nPos.clone().add(oDir.multiplyScalar(1.22))
      const oT = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oT.position.copy(oPos)
      oT.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₃⁻ (=O)', sphereTag }
      group.add(oT); atomsRef.current.push(oT)
      createDoubleBond(group, nPos, oPos, 0xaa4444, 0.04)
    })
    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ── NO₂ KOORDINATSION LIGAND (nitro, N donor) ──────────────
  const createNO2Ligand = useCallback((parent, centerPos, direction, sphereTag) => {
    const group = new THREE.Group()
    const dir = direction.clone().normalize()
    const nPos = centerPos.clone().add(dir.clone().multiplyScalar(1.94))
    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.25, emissive: CPK.N, emissiveIntensity: 0.2 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NO₂⁻ (nitro-N)', sphereTag }
    group.add(nMesh); atomsRef.current.push(nMesh)
    createBond(group, centerPos, nPos, CPK.bond, 0.07, 0.85)

    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    ;[+1, -1].forEach(sign => {
      const oDir = dir.clone().multiplyScalar(Math.cos(2 * Math.PI / 3))
        .add(perp.clone().multiplyScalar(Math.sin(2 * Math.PI / 3) * sign))
      const oPos = nPos.clone().add(oDir.multiplyScalar(1.22))
      const oT = new THREE.Mesh(
        new THREE.SphereGeometry(0.20, 28, 28),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oT.position.copy(oPos)
      oT.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₂⁻ (=O)', sphereTag }
      group.add(oT); atomsRef.current.push(oT)
      createDoubleBond(group, nPos, oPos, 0xaa4444, 0.04)
    })
    parent.add(group)
    return group
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // ICHKI SFERA (koordinatsion) QURISH
  // ═══════════════════════════════════════════════════════════
  const buildInnerSphere = useCallback((group, offsetX, sphereData) => {
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    const cMesh = new THREE.Mesh(
      new THREE.SphereGeometry(sphereData.radius, 64, 64),
      new THREE.MeshStandardMaterial({ color: sphereData.color, roughness: 0.15, metalness: 0.9, emissive: sphereData.color, emissiveIntensity: 0.2 })
    )
    cMesh.position.copy(centerPos)
    cMesh.userData = {
      type: 'atom', element: sphereData.metal, info: ATOM_INFO[sphereData.metal],
      isCenter: true, sphereRole: "Ichki koordinatsion sfera markazi",
      charge: sphereData.chargeText, sphereTag: 'inner'
    }
    group.add(cMesh); atomsRef.current.push(cMesh)

    if (showChargeHalo) {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(sphereData.radius * 3.8, 32, 32),
        new THREE.MeshBasicMaterial({ color: CPK.innerSphere, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.BackSide })
      )
      halo.position.copy(centerPos)
      halo.userData = { isHalo: true, sphere: 'inner' }
      group.add(halo); highlightRef.current.push(halo)
    }

    const octaDirs = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
    ]

    if (sphereData.geometry === "octahedral") {
      const mainCount = sphereData.mainCount
      const specialLigand = sphereData.specialLigand
      octaDirs.forEach((d, i) => {
        if (i < mainCount) {
          const nPos = centerPos.clone().add(d.clone().multiplyScalar(2.05))
          if (sphereData.mainLigand === "NH3") createNH3(group, nPos, centerPos, showHydrogens, 'inner')
          else if (sphereData.mainLigand === "H2O") createH2O(group, nPos, centerPos, showHydrogens, 'inner')
        } else if (specialLigand) {
          if (specialLigand === "Br") createHalide(group, centerPos, d, 'Br', 'inner')
          else if (specialLigand === "Cl") createHalide(group, centerPos, d, 'Cl', 'inner')
          else if (specialLigand === "SO4") createSO4Ligand(group, centerPos, d, 'inner')
          else if (specialLigand === "NO3") createNO3Ligand(group, centerPos, d, 'inner')
        }
      })
    } else if (sphereData.geometry === "octahedral_mixed4_1_1") {
      octaDirs.forEach((d, i) => {
        if (i < 4) {
          const nPos = centerPos.clone().add(d.clone().multiplyScalar(2.05))
          createNH3(group, nPos, centerPos, showHydrogens, 'inner')
        } else if (i === 4) {
          createNO2Ligand(group, centerPos, d, 'inner')
        } else {
          createHalide(group, centerPos, d, 'Cl', 'inner')
        }
      })
    } else if (sphereData.geometry === "octahedral_mixed4_2") {
      octaDirs.forEach((d, i) => {
        if (i >= 2 && i <= 5) {
          const nPos = centerPos.clone().add(d.clone().multiplyScalar(2.05))
          createNH3(group, nPos, centerPos, showHydrogens, 'inner')
        } else {
          const halideType = (sphereData.specialLigand && sphereData.specialLigand.startsWith("Br")) ? 'Br' : 'Cl'
          createHalide(group, centerPos, d, halideType, 'inner')
        }
      })
    }

    if (showLabels) {
      const chargeSprite = makeTextSprite(`Ichki: ${sphereData.chargeText}`, {
        fontSize: 36, color: "#FFD700", bgColor: "rgba(80, 60, 5, 0.9)", borderColor: "#FFD700", scale: 0.36
      })
      chargeSprite.position.set(offsetX, 3.4, 0)
      group.add(chargeSprite); labelsRef.current.push(chargeSprite)

      const sub = makeTextSprite("◆ KOORDINATSION SFERA", {
        fontSize: 24, color: "#FFD700", bgColor: "rgba(15, 10, 30, 0.85)", borderColor: "#FFD700", scale: 0.3
      })
      sub.position.set(offsetX, 2.85, 0)
      group.add(sub); labelsRef.current.push(sub)
    }
  }, [createNH3, createH2O, createHalide, createSO4Ligand, createNO3Ligand, createNO2Ligand, showHydrogens, showLabels, showChargeHalo])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA (erkin ionlar) QURISH
  // ═══════════════════════════════════════════════════════════
  const buildOuterSphere = useCallback((group, offsetX, outerData) => {
    const positions = []
    if (outerData.count === 1) {
      positions.push(new THREE.Vector3(0, 0, 0))
    } else if (outerData.count === 2) {
      positions.push(new THREE.Vector3(-0.9, 0.5, 0))
      positions.push(new THREE.Vector3(0.9, -0.5, 0))
    } else if (outerData.count === 3) {
      positions.push(new THREE.Vector3(0, 1.0, 0))
      positions.push(new THREE.Vector3(-1.1, -0.6, 0))
      positions.push(new THREE.Vector3(1.1, -0.6, 0))
    }

    positions.forEach((pos, idx) => {
      const worldPos = new THREE.Vector3(offsetX + pos.x, pos.y, pos.z)
      if (showChargeHalo) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 24, 24),
          new THREE.MeshBasicMaterial({ color: CPK.outerSphere, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.BackSide })
        )
        halo.position.copy(worldPos)
        halo.userData = { isHalo: true, sphere: 'outer' }
        group.add(halo); highlightRef.current.push(halo)
      }

      if (outerData.ion === "Cl" || outerData.ion === "Cl_H2O") {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.35, 32, 32),
          new THREE.MeshStandardMaterial({ color: CPK.Cl, roughness: 0.3, metalness: 0.4, emissive: CPK.Cl, emissiveIntensity: 0.28 })
        )
        mesh.position.copy(worldPos)
        mesh.userData = { type: 'atom', element: 'Cl', info: ATOM_INFO.Cl, ligandName: 'Cl⁻ (erkin ion)', sphereTag: 'outer', charge: '1−' }
        group.add(mesh); atomsRef.current.push(mesh)
        if (outerData.ion === "Cl_H2O" && idx === positions.length - 1) {
          const wPos = worldPos.clone().add(new THREE.Vector3(0.6, 0.3, 0))
          const oMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.20, 28, 28),
            new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
          )
          oMesh.position.copy(wPos)
          oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'H₂O (kristall suvi)', sphereTag: 'outer' }
          group.add(oMesh); atomsRef.current.push(oMesh)
        }
      } else if (outerData.ion === "Br") {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.40, 32, 32),
          new THREE.MeshStandardMaterial({ color: CPK.Br, roughness: 0.3, metalness: 0.4, emissive: CPK.Br, emissiveIntensity: 0.28 })
        )
        mesh.position.copy(worldPos)
        mesh.userData = { type: 'atom', element: 'Br', info: ATOM_INFO.Br, ligandName: 'Br⁻ (erkin ion)', sphereTag: 'outer', charge: '1−' }
        group.add(mesh); atomsRef.current.push(mesh)
      } else if (outerData.ion === "SO4") {
        const sMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.30, 32, 32),
          new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.3, metalness: 0.4, emissive: CPK.S, emissiveIntensity: 0.28 })
        )
        sMesh.position.copy(worldPos)
        sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'SO₄²⁻ markazi (erkin)', sphereTag: 'outer', charge: '2−' }
        group.add(sMesh); atomsRef.current.push(sMesh)
        const tetraDirs = [
          new THREE.Vector3(1, 1, 1), new THREE.Vector3(-1, -1, 1),
          new THREE.Vector3(-1, 1, -1), new THREE.Vector3(1, -1, -1)
        ]
        tetraDirs.forEach(d => {
          const oPos = worldPos.clone().add(d.clone().normalize().multiplyScalar(0.75))
          const oMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.20, 28, 28),
            new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
          )
          oMesh.position.copy(oPos)
          oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ (=O erkin)', sphereTag: 'outer' }
          group.add(oMesh); atomsRef.current.push(oMesh)
          createDoubleBond(group, worldPos, oPos, 0xaaaa33, 0.04)
        })
      } else if (outerData.ion === "NO3") {
        const nMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 32, 32),
          new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.3, emissive: CPK.N, emissiveIntensity: 0.22 })
        )
        nMesh.position.copy(worldPos)
        nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NO₃⁻ markazi (erkin)', sphereTag: 'outer', charge: '1−' }
        group.add(nMesh); atomsRef.current.push(nMesh)
        for (let i = 0; i < 3; i++) {
          const ang = (i * 2 * Math.PI) / 3
          const oPos = worldPos.clone().add(new THREE.Vector3(Math.cos(ang) * 1.22, Math.sin(ang) * 1.22, 0))
          const oMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.20, 28, 28),
            new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
          )
          oMesh.position.copy(oPos)
          oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₃⁻ (=O erkin)', sphereTag: 'outer' }
          group.add(oMesh); atomsRef.current.push(oMesh)
          createDoubleBond(group, worldPos, oPos, 0xaa4444, 0.04)
        }
      } else if (outerData.ion === "NO2") {
        const nMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 32, 32),
          new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.3, emissive: CPK.N, emissiveIntensity: 0.22 })
        )
        nMesh.position.copy(worldPos)
        nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'NO₂⁻ markazi (erkin)', sphereTag: 'outer', charge: '1−' }
        group.add(nMesh); atomsRef.current.push(nMesh)
        ;[+1, -1].forEach(sign => {
          const ang = (2 * Math.PI / 3) * sign
          const oPos = worldPos.clone().add(new THREE.Vector3(Math.cos(ang) * 1.22, Math.sin(ang) * 1.22, 0))
          const oMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.20, 28, 28),
            new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
          )
          oMesh.position.copy(oPos)
          oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'NO₂⁻ (=O erkin)', sphereTag: 'outer' }
          group.add(oMesh); atomsRef.current.push(oMesh)
          createDoubleBond(group, worldPos, oPos, 0xaa4444, 0.04)
        })
      }
    })

    if (showLabels) {
      const chargeSprite = makeTextSprite(`Erkin: ${outerData.ionText}`, {
        fontSize: 32, color: "#66CCFF", bgColor: "rgba(5, 40, 80, 0.9)", borderColor: "#66CCFF", scale: 0.36
      })
      chargeSprite.position.set(offsetX, 3.4, 0)
      group.add(chargeSprite); labelsRef.current.push(chargeSprite)

      const sub = makeTextSprite("◇ KRISTALL SFERA", {
        fontSize: 22, color: "#66CCFF", bgColor: "rgba(10, 20, 35, 0.85)", borderColor: "#66CCFF", scale: 0.3
      })
      sub.position.set(offsetX, 2.85, 0)
      group.add(sub); labelsRef.current.push(sub)
    }
  }, [createDoubleBond, showLabels, showChargeHalo])

  // ═══════════════════════════════════════════════════════════
  // SFERA CHEGARASI — ichki va tashqi sferalarni ajratuvchi ko'rinmas gumbaz
  // ═══════════════════════════════════════════════════════════
  const buildBoundary = useCallback((scene, offsetX) => {
    // Ichki sfera atrofida chegara gumbaz
    const boundaryGeo = new THREE.SphereGeometry(3.2, 48, 48)
    const boundaryMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa, transparent: true, opacity: 0.06,
      wireframe: true, depthWrite: false
    })
    const boundary = new THREE.Mesh(boundaryGeo, boundaryMat)
    boundary.position.set(offsetX, 0, 0)
    scene.add(boundary)
    boundaryRef.current = boundary

    // Sfera chegarasi belgi — punktir doira ekvatorda
    const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 8, 96)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa, transparent: true, opacity: 0.3
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(offsetX, 0, 0)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)
    labelsRef.current.push(ring)

    // Chegara yorlig'i
    const label = makeTextSprite("• • • KOORDINATSION SFERA CHEGARASI • • •", {
      fontSize: 20, color: "#c4b5fd", bgColor: "rgba(20, 15, 40, 0.7)",
      borderColor: "#a78bfa", scale: 0.28
    })
    label.position.set(offsetX, -3.7, 0)
    scene.add(label)
    labelsRef.current.push(label)
  }, [])

  // ═══════════════════════════════════════════════════════════
  // SAHNA QAYTA QURISH
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    ;[innerSphereRef, outerSphereRef].forEach(ref => {
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
    if (boundaryRef.current) {
      scene.remove(boundaryRef.current)
      if (boundaryRef.current.geometry) boundaryRef.current.geometry.dispose()
      if (boundaryRef.current.material) boundaryRef.current.material.dispose()
      boundaryRef.current = null
    }
    // Eski labellarni tozalash
    labelsRef.current.forEach(l => {
      scene.remove(l)
      if (l.geometry) l.geometry.dispose()
      if (l.material) l.material.dispose()
    })

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    highlightRef.current = []

    const innerGroup = new THREE.Group()
    const outerGroup = new THREE.Group()
    innerSphereRef.current = innerGroup
    outerSphereRef.current = outerGroup

    if (viewMode === "both") {
      buildInnerSphere(innerGroup, -4.5, activeInner)
      buildOuterSphere(outerGroup, +4.5, activeOuter)
      if (showSphereBoundary) {
        buildBoundary(scene, -4.5)
      }
    } else if (viewMode === "inner") {
      buildInnerSphere(innerGroup, 0, activeInner)
      if (showSphereBoundary) {
        buildBoundary(scene, 0)
      }
    } else if (viewMode === "outer") {
      buildOuterSphere(outerGroup, 0, activeOuter)
    }

    scene.add(innerGroup)
    scene.add(outerGroup)

    // Markazda navbatlanish belgisi + o'rtadagi izomer formula
    if (viewMode === "both") {
      const arrow = makeTextSprite("⇄", {
        fontSize: 100, color: "#FFB6E1",
        bgColor: "rgba(80, 20, 60, 0.9)", borderColor: "#FFB6E1", scale: 0.55
      })
      arrow.position.set(0, 0.6, 0)
      scene.add(arrow)
      labelsRef.current.push(arrow)

      const formula = makeTextSprite(activeFormula, {
        fontSize: 32, color: "#ffffff",
        bgColor: "rgba(20, 10, 45, 0.9)", borderColor: "#a78bfa", scale: 0.34
      })
      formula.position.set(0, -0.6, 0)
      scene.add(formula)
      labelsRef.current.push(formula)
    }
  }, [activeInner, activeOuter, activeFormula, viewMode, buildInnerSphere, buildOuterSphere, buildBoundary, showSphereBoundary])

  // ═══════════════════════════════════════════════════════════
  // TEST ANIMATSIYASI — AgNO3, BaCl2, heat (cho'kma zarrachalari)
  // ═══════════════════════════════════════════════════════════
  const clearTestParticles = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return
    testAnimRef.current.particles.forEach(p => {
      scene.remove(p)
      if (p.geometry) p.geometry.dispose()
      if (p.material) p.material.dispose()
    })
    testAnimRef.current.particles = []
    testAnimRef.current.type = null
    testAnimRef.current.progress = 0
  }, [])

  const startTestAnimation = useCallback((testType) => {
    const scene = sceneRef.current
    if (!scene) return
    clearTestParticles()
    testAnimRef.current.type = testType
    testAnimRef.current.progress = 0

    // Reagent zarrachalari yaratamiz
    const reagentColor = testType === 'AgNO3' ? 0xC0C0C0 : testType === 'BaCl2' ? 0x00C900 : 0xFF6633
    for (let i = 0; i < 30; i++) {
      const geo = new THREE.SphereGeometry(0.09, 12, 12)
      const mat = new THREE.MeshStandardMaterial({
        color: reagentColor, emissive: reagentColor, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.9
      })
      const p = new THREE.Mesh(geo, mat)
      // Yuqoridan tashlaymiz
      p.position.set(
        (Math.random() - 0.5) * 12,
        6 + Math.random() * 3,
        (Math.random() - 0.5) * 3
      )
      p.userData = {
        isTestParticle: true,
        vy: -0.02 - Math.random() * 0.03,
        vx: (Math.random() - 0.5) * 0.01,
        settled: false,
        settleY: -3.5 + Math.random() * 0.3
      }
      scene.add(p)
      testAnimRef.current.particles.push(p)
    }
  }, [clearTestParticles])

  // Test tugmalari uchun effekt
  useEffect(() => {
    if (activeTest) {
      startTestAnimation(activeTest)
    } else {
      clearTestParticles()
    }
  }, [activeTest, startTestAnimation, clearTestParticles])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Fon
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
          if (m.material) m.material.opacity = 0.06 + Math.sin(t * 1.4) * 0.05
        }
      })

      // Sfera chegarasi aylanish
      if (boundaryRef.current) {
        boundaryRef.current.rotation.y += 0.002
        boundaryRef.current.rotation.z += 0.001
      }

      // Ligand almashinuv animatsiyasi — ichki va tashqi sferalar o'rin almashadi
      if (swapAnimRef.current.active) {
        swapAnimRef.current.progress += 0.005 * swapAnimRef.current.direction
        if (swapAnimRef.current.progress > 1) {
          swapAnimRef.current.progress = 1
          swapAnimRef.current.direction = -1
        } else if (swapAnimRef.current.progress < 0) {
          swapAnimRef.current.progress = 0
          swapAnimRef.current.direction = 1
        }
        const p = swapAnimRef.current.progress
        // Ichki va tashqi sferalarni bir-biriga yaqinlashtirib "almashadigan" effekt
        if (innerSphereRef.current) {
          innerSphereRef.current.position.x = p * 4.5
          innerSphereRef.current.rotation.y = p * Math.PI * 0.4
        }
        if (outerSphereRef.current) {
          outerSphereRef.current.position.x = -p * 4.5
          outerSphereRef.current.rotation.y = -p * Math.PI * 0.4
        }
      } else {
        if (innerSphereRef.current) {
          innerSphereRef.current.position.x = 0
          innerSphereRef.current.rotation.y = 0
        }
        if (outerSphereRef.current) {
          outerSphereRef.current.position.x = 0
          outerSphereRef.current.rotation.y = 0
        }
      }

      // Test zarracha animatsiyasi
      testAnimRef.current.particles.forEach(p => {
        if (!p.userData.settled) {
          p.position.y += p.userData.vy
          p.position.x += p.userData.vx
          if (p.position.y <= p.userData.settleY) {
            p.position.y = p.userData.settleY
            p.userData.settled = true
            // Cho'kma bo'lsa yorqinroq
            if (p.material) p.material.emissiveIntensity = 0.8
          }
        }
      })

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
        cyan: rgb(0.05, 0.55, 0.65),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgGold: rgb(1.0, 0.98, 0.86), bgCyan: rgb(0.90, 0.98, 1.0),
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
          `Ionlanish izomeriyasi 3D Lab  •  ${cleanText(pair.grossFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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

      // ══ MUQOVA ══
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      const title = "IONLANISH IZOMERIYASI"
      const tW = measure(title, boldFont, 22)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 80, size: 22, font: boldFont, color: C.white })

      const subtitle = "Ichki va tashqi koordinatsion sferalar orasidagi ion navbatlanishi"
      const sW = measure(subtitle, italicFont, 11)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 105, size: 11, font: italicFont, color: C.purpleLight })

      const formulaText = `${cleanText(pair.formulaA)}  ⇌  ${cleanText(pair.formulaB)}`
      const fW = measure(formulaText, boldFont, 13)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 150, size: 13, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan ionlanish izomer juftligi", `${pair.title} — umumiy formula: ${cleanText(pair.grossFormula)}`, C.bgPurple, C.purple)

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
        drawSectionHeader(1, "Kirish — Ionlanish izomeriyasi nima?")
        drawParagraph(
          "Ionlanish izomeriyasi (ionization isomerism) — koordinatsion birikma tarkibida ichki koordinatsion sfera va tashqi (kristall) sfera orasida anionlar (yoki neytral ligandlar) o'zaro almashishi natijasida hosil bo'ladigan izomeriya turi. Bu izomerlar erigan holatda TURLI IONLARNI beradi — shu farq eksperimental sinovlar orqali aniqlanadi."
        )
        drawParagraph("Ionlanish izomeriyaning asosiy shartlari:")
        drawBulletPoint("Kompleks tuz kation VA aniondan iborat bo'lishi kerak.")
        drawBulletPoint("Ikkala anion ham koordinatsion ligand bo'la olishi kerak (masalan, Cl⁻, Br⁻, SO₄²⁻, NO₃⁻, NO₂⁻).")
        drawBulletPoint("Ichki sfera anioni bilan tashqi sfera anioni o'z o'rnini almashishi natijasida yangi izomer hosil bo'ladi.")
        drawBulletPoint("Klassik namuna: [Co(NH₃)₅Br]SO₄ (to'q binafsha)  ⇌  [Co(NH₃)₅SO₄]Br (qizil-binafsha)")
      }

      // ── 2. Ta'rif ──
      if (pdfSections.definition) {
        drawSectionHeader(2, "Ta'rif va nazariy asos")
        drawInfoBox(
          "Rasmiy ta'rif (IUPAC 2005)",
          "Bir xil molekulyar formulaga ega koordinatsion tuzlar, ichki sferadagi ligand va tashqi sferadagi qarama-qarshi ion (counter-ion) o'zaro almashishi natijasida farqli izomerlar hosil qiladi. Bu izomerlar erigan holatda turli tarkibli kation va anionlarga dissotsiatsiyalanadi.",
          C.bgPurple, C.purple
        )
        drawParagraph(
          "Werner koordinatsion nazariyasi (1893) asosida ionlanish izomeriyasi — birikma tarkibida ICHKI SFERA (metall bilan bevosita bog'langan ligandlar) va TASHQI SFERA (kristall panjarada joylashgan erkin ionlar) o'rtasidagi tafovutning bevosita natijasidir. Ichki sferadagi ion mustahkam kovalent-koordinatsion bog' bilan ushlangan, tashqi sferadagi ion esa faqat elektrostatik kuchlar bilan ushlab turiladi."
        )
        drawInfoBox(
          "Ionlanish izomeriyaning ko'rinishlari",
          "1) Anion almashinuvi: Br⁻ ↔ SO₄²⁻ (klassik Werner tipi) | 2) Halogen almashinuvi: Cl⁻ ↔ Br⁻ (Pt IV tipida) | 3) Gidrat izomeriya: H₂O ↔ anion (maxsus tur, alohida bo'limda o'rganiladi) | 4) Aralash: bog'lanish izomeriyasi bilan qo'shilishi mumkin (NO₂⁻ bilan)",
          C.bgYellow, C.yellow
        )
      }

      // ── 3. Werner testlari ──
      if (pdfSections.tests) {
        drawSectionHeader(3, "Werner diagnostik testlari — asosiy tajribalar")
        drawParagraph(
          "Alfred Werner (1893) va uning shogirdlari ionlanish izomerlarini ajratish uchun 3 ta klassik test uslubini ishlab chiqishgan. Bu testlar bugungi kunda ham koordinatsion kimyoda diagnostik uslub sifatida qo'llaniladi:"
        )
        drawInfoBox(
          "1) AgNO₃ titratsiyasi (kumush nitrat testi)",
          `Ag⁺ + X⁻ (erkin halogenid tashqi sferada) → AgX↓ cho'kmasi. Ichki sferadagi ligand darhol reaksiya bermaydi — faqat qaynatilgandan keyin.  A shakli: ${cleanText(pair.agno3A)}  |  B shakli: ${cleanText(pair.agno3B)}`,
          C.bgBlue, C.blue
        )
        drawInfoBox(
          "2) BaCl₂ titratsiyasi (bariy xlorid testi)",
          `Ba²⁺ + SO₄²⁻ (erkin) → BaSO₄↓ oq cho'kma. Ichki sferada bog'langan SO₄²⁻ reaksiya bermaydi.  A shakli: ${cleanText(pair.bacl2A)}  |  B shakli: ${cleanText(pair.bacl2B)}`,
          C.bgGreen, C.green
        )
        drawInfoBox(
          "3) Molar o'tkazuvchanlik (konduktometriya)",
          `Erigan tuz eritmasining molar o'tkazuvchanligi Λₘ = k/c. Ion soni ko'p bo'lgan tuz o'tkazuvchanlik ko'proq beradi. Werner asosiy diagnostik uslubi.  A shakli: ${cleanText(pair.conductivityA)}  |  B shakli: ${cleanText(pair.conductivityB)}`,
          C.bgOrange, C.orange
        )
        drawInfoBox(
          "Ion sonlari va Λₘ taxminiy qiymatlari (Werner jadvali)",
          "2 ion (1:1 tuz): Λₘ = 100–130 S·sm²/mol  |  3 ion (1:2 yoki 2:1): Λₘ = 230–280  |  4 ion (1:3): Λₘ = 400–450  |  5 ion: Λₘ = 500+",
          C.bgGold, C.gold
        )
      }

      // ── 4. Namunalar ──
      if (pdfSections.examples) {
        drawSectionHeader(4, "Klassik namunalar (6 juft izomer)")
        Object.values(IONIZATION_ISOMERS).forEach((iso, idx) => {
          checkBreak(50)
          const bgColors = [C.bgPurple, C.bgBlue, C.bgGreen, C.bgOrange, C.bgCyan, C.bgYellow]
          const bColors = [C.purple, C.blue, C.green, C.orange, C.cyan, C.yellow]
          drawInfoBox(
            `${idx + 1}. ${cleanText(iso.title)}`,
            `A: ${cleanText(iso.formulaA)}  ⇌  B: ${cleanText(iso.formulaB)}  |  Umumiy: ${cleanText(iso.grossFormula)}  |  Ion soni: A=${iso.ionCountA}, B=${iso.ionCountB}`,
            bgColors[idx % 6], bColors[idx % 6]
          )
        })
      }

      // ── 5. Boshqa izomeriyalardan farqi ──
      if (pdfSections.distinction) {
        drawSectionHeader(5, "Boshqa izomeriya turlaridan farqi")
        drawParagraph(
          "Ionlanish izomeriyasi koordinatsion, bog'lanish va gidrat izomeriya turlaridan sezilarli farq qiladi. Asosiy farqlash mezoni — ichki va tashqi sferalar tarkibidagi ion navbatlanishi."
        )
        drawInfoBox(
          "Ionlanish izomeriyasi (bu bo'lim)",
          "Ichki va tashqi sfera anionlari o'zaro almashadi. Bir birikmada aniqlanadi. Diagnostik: AgNO₃, BaCl₂, konduktometriya. Erigan holatda turli ionlarni beradi.",
          C.bgPurple, C.purple
        )
        drawInfoBox(
          "Koordinatsion izomeriya",
          "Ikkita alohida kompleks (kation + anion) o'rtasida ligand almashinuvi. [Co(NH₃)₆][Cr(CN)₆] ⇌ [Cr(NH₃)₆][Co(CN)₆]. Ikkala izomer bir xil son ion beradi.",
          C.bgBlue, C.blue
        )
        drawInfoBox(
          "Bog'lanish (linkage) izomeriyasi",
          "Ambidentat ligand (NO₂⁻, SCN⁻) bir kompleks ichida turli atom orqali bog'lanadi. Ichki-tashqi sfera almashinuvi shart emas.",
          C.bgOrange, C.orange
        )
        drawInfoBox(
          "Gidrat izomeriya (ionlanish izomeriyaning maxsus turi)",
          "H₂O molekulasi ichki sferada koordinatsion ligand yoki tashqi sferada kristall suvi sifatida joylashadi. [Cr(H₂O)₆]Cl₃ ⇌ [Cr(H₂O)₅Cl]Cl₂·H₂O",
          C.bgCyan, C.cyan
        )
      }

      // ── 6. Termodinamika ──
      if (pdfSections.thermodynamics) {
        drawSectionHeader(6, "Termodinamik va HSAB tahlili")
        drawParagraph(
          "Ionlanish izomerlar orasidagi barqarorlik farqi qaysi anion ichki sferada mustahkamroq bog'lanishiga bog'liq. Bu HSAB (Pearson) nazariyasi va bog' entalpiyasi orqali bashorat qilinadi:"
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
          "Termodinamik xulosalar",
          cleanText(pair.thermoNote),
          C.bgYellow, C.yellow
        )
        drawParagraph(
          "Umumiy qonuniyat: Qattiq kation (Co³⁺, Cr³⁺) qattiq donor (O donor: SO₄²⁻, NO₃⁻, H₂O) bilan yaxshi mos keladi. Yumshoq anion (Br⁻, I⁻) yumshoq metallar bilan mos. Ammo kinetik omillar (Pt(IV), Co(III) inert xarakteri) ba'zan termodinamik afzalligini ustidan qaytaradi."
        )
      }

      // ── 7. Gidrat izomeriya (bo'lim) ──
      if (pdfSections.hydrate) {
        drawSectionHeader(7, "Gidrat izomeriya — ionlanish izomeriyaning maxsus turi")
        drawParagraph(
          "Gidrat izomeriya — ionlanish izomeriyasining eng klassik va o'ziga xos ko'rinishi. Bu turda H₂O molekulasi ichki sferada koordinatsion ligand (M–OH₂) yoki tashqi sferada kristall suvi (kristallohidrat) sifatida joylashishi mumkin."
        )
        drawInfoBox(
          "Klassik uchlik: [Cr(H₂O)₆]Cl₃ tizimi (Jørgensen – Werner)",
          "1) [Cr(H₂O)₆]Cl₃ — fioletovaya (binafsha), 6 H₂O ichkarida, 3 Cl tashqarida, 4 ion  |  2) [Cr(H₂O)₅Cl]Cl₂·H₂O — ochiq yashil, 5 H₂O + 1 Cl ichkarida, 2 Cl + 1 kristall H₂O tashqarida, 3 ion  |  3) [Cr(H₂O)₄Cl₂]Cl·2H₂O — to'q yashil, 4 H₂O + 2 Cl ichkarida, 1 Cl + 2 kristall H₂O tashqarida, 2 ion",
          C.bgCyan, C.cyan
        )
        drawParagraph(
          "Ajratish uchun diagnostik testlar:"
        )
        drawBulletPoint("AgNO₃ testi: fioletovaya → 3 mol AgCl; ochiq yashil → 2 mol AgCl; to'q yashil → 1 mol AgCl darhol.")
        drawBulletPoint("Molar o'tkazuvchanlik: fioletovaya Λₘ ≈ 430; ochiq yashil ≈ 250; to'q yashil ≈ 105 S·sm²/mol.")
        drawBulletPoint("Termogravimetriya (TG): kristall suvi 60–100°C oralig'ida chiqadi; koordinatsion H₂O esa 100°C dan yuqori.")
        drawBulletPoint("Rang farqi: koordinatsion sferaga Cl⁻ kirishi bilan d–d o'tishlar to'lqin uzunligi kattalashadi (binafsha → yashil).")
      }

      // ── 8. Eksperimental usullar ──
      drawSectionHeader(8, "Ushbu tizim uchun tajribaviy dalillar")
      pair.experimentalProof.forEach(p => drawBulletPoint(cleanText(p)))

      // ── 9. Tarix ──
      if (pdfSections.history) {
        drawSectionHeader(9, "Kashfiyot tarixi")
        drawParagraph(cleanText(pair.discovery))
        drawInfoBox(
          "Alfred Werner (1866–1919) va ionlanish izomeriyasi",
          "Werner (Sürix universiteti) 1893-yildan boshlab koordinatsion birikmalarni tadqiq qildi. Uning eng katta yutuqlaridan biri — ichki va tashqi sfera tushunchasini kiritish edi. Werner molar o'tkazuvchanlik va AgNO₃/BaCl₂ testlari orqali ionlanish izomerlarini birinchi bo'lib eksperimental jihatdan tasdiqladi. 1913-yilda uning bu ishlari uchun Kimyo bo'yicha Nobel mukofoti berildi — noorganik kimyodagi birinchi Nobel.",
          C.bgPurple, C.purple
        )
        drawInfoBox(
          "Werner – Jørgensen tortishuvi",
          "1890-yillarda Sofus Mads Jørgensen (Kopengagen) 'zanjir nazariyasi'ni himoya qildi — barcha atomlar zanjir kabi bir-biriga bog'langan. Werner esa markaziy metall atrofidagi ichki sfera va tashqi kristall panjara g'oyasini taklif qildi. Ionlanish izomerlar mavjudligi — Werner nazariyasining hal qiluvchi eksperimental isboti bo'ldi.",
          C.bgBlue, C.blue
        )
      }

      // ── 10. Jadval ──
      if (pdfSections.table) {
        drawSectionHeader(10, "A vs B shakllari — solishtirish jadvali")
        const rows = [
          ["Xususiyat", "A shakli", "B shakli"],
          ["Formula", cleanText(pair.formulaA), cleanText(pair.formulaB)],
          ["Nomi", cleanText(pair.nameA).slice(0, 40), cleanText(pair.nameB).slice(0, 40)],
          ["Ichki sfera Q", pair.innerA.chargeText, pair.innerB.chargeText],
          ["Tashqi ion", pair.outerA.ionText, pair.outerB.ionText],
          ["Ion soni", `${pair.ionCountA}`, `${pair.ionCountB}`],
          ["Rangi", cleanText(pair.colorA).slice(0, 40), cleanText(pair.colorB).slice(0, 40)],
          ["AgNO₃ testi", cleanText(pair.agno3A).slice(0, 45) + "...", cleanText(pair.agno3B).slice(0, 45) + "..."],
          ["BaCl₂ testi", cleanText(pair.bacl2A).slice(0, 45) + "...", cleanText(pair.bacl2B).slice(0, 45) + "..."]
        ]
        const colW = [CONTENT_W * 0.22, CONTENT_W * 0.39, CONTENT_W * 0.39]
        const rowH = 22
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
            const txt = truncate(cleanText(cell), isHeader ? boldFont : regularFont, 8.5, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 8, size: 8.5,
              font: isHeader ? boldFont : regularFont,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // ── 11. Amaliy qo'llanilishi ──
      if (pdfSections.application) {
        drawSectionHeader(11, "Amaliy qo'llanilishi")
        drawInfoBox("Ushbu tizim uchun", cleanText(pair.application), C.bgOrange, C.orange)
        drawParagraph("Umumiy amaliy sohalar:")
        drawBulletPoint("Analitik kimyoda — kompleks tuzlarni identifikatsiyalash va ajratish uchun standart AgNO₃/BaCl₂ testlari.")
        drawBulletPoint("Kimyoterapiyada — sisplatin va uning analoglari (Rosenberg 1965), Pt(IV) prodrug lari (satraplatin, iproplatin).")
        drawBulletPoint("Bo'yoq sanoati — Cr(III), Co(III) komplekslar rangli pigmentlar sifatida ('yashil sulfat', 'binafsha xlorid').")
        drawBulletPoint("Farmatsevtikada — vitamin B12 (kobalamin) va u tarkibidagi Co³⁺ koordinatsion navbatlanishlari.")
        drawBulletPoint("Kristallografiyada — yaxshi tayyorlangan izomer kristallar strukturaviy tadqiqot uchun standart namuna.")
        drawBulletPoint("Ta'lim sohasida — ionlanish izomerlar Werner testlari orqali koordinatsion kimyoning eng vizual namunalari hisoblanadi.")
      }

      // ── 12. Adabiyotlar ──
      const refs = [
        "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
        "Werner, A., Miolati, A. (1893–1894). Beiträge zur Konstitution anorganischer Verbindungen. Zeitschrift für physikalische Chemie, 12, 35–55; 14, 506–521.",
        "Jørgensen, S.M. (1892). Zur Konstitution der Kobalt-, Chrom- und Rhodium-Basen. Zeitschrift für Anorganische Chemie, 2(1), 279–296.",
        "Werner, A. (1907). Über Koordinationsverbindungen. Berichte der deutschen chemischen Gesellschaft, 40, 15–69.",
        "Kurnakov, N.S. (1904). Concerning the Chemistry of Platinum Compounds. Journal of the Russian Chemical Society, 36, 550.",
        "Basolo, F., Pearson, R.G. (1967). Mechanisms of Inorganic Reactions (2nd ed.). Wiley, New York.",
        "Cotton, F.A., Wilkinson, G. (1988). Advanced Inorganic Chemistry (5th ed.). Wiley-Interscience.",
        "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 19 — Coordination Chemistry.",
        "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson. Chapter 9 — Coordination Compounds.",
        "Kauffman, G.B. (1966). Alfred Werner: Founder of Coordination Chemistry. Springer, Berlin.",
        "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations. RSC Publishing.",
        "Rosenberg, B. et al. (1965). Inhibition of cell division in Escherichia coli by electrolysis products from a platinum electrode. Nature, 205, 698–699.",
        "Adamson, A.W. (1973). A Textbook of Physical Chemistry. Academic Press."
      ]
      drawSectionHeader(12, "Adabiyotlar")
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

      addFooter()

      pdfDoc.setTitle(`Ionlanish izomeriyasi — ${cleanText(pair.title)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning ionlanish izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["ionlanish izomeriya", "Werner", "ichki tashqi sfera", "ionization isomerism"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ionlanish-izomeriya-${pair.id}.pdf`
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
  // RENDER (JSX)
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
              <span>⚖️</span>
              <span className="hidden sm:inline">Ionlanish izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Ionlanish 3D</span>
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
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[280px]"
          >
            <option value="CoBrSO4">[Co(NH₃)₅Br]SO₄ — klassik Werner</option>
            <option value="CrClSO4">[Cr(NH₃)₅(SO₄)]Cl — Jørgensen</option>
            <option value="CoNO2Cl">[Co(NH₃)₄(NO₂)Cl]Cl — aralash</option>
            <option value="PtClBr">[Pt(NH₃)₄Cl₂]Br₂ — Pt(IV)</option>
            <option value="CrH2OCl">[Cr(H₂O)₆]Cl₃ — gidrat izomeriya</option>
            <option value="CoNO3Br">[Co(NH₃)₅(NO₃)]Br — NO₃/Br</option>
          </select>

          <button onClick={() => setAutoRotate(!autoRotate)} className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Avtomatik aylantirish">🔄</button>
          <button onClick={() => togglePanel("info")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Ma'lumot paneli">ℹ️</button>
          <button onClick={() => togglePanel("tests")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "tests" ? 'bg-blue-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Werner testlari">🧪</button>
          <button onClick={() => togglePanel("theory")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "theory" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Nazariy asos">📚</button>
          <button onClick={() => togglePanel("compare")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Solishtirish">📊</button>
          <button onClick={() => togglePanel("hydrate")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "hydrate" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Gidrat izomeriya">💧</button>
          <button onClick={() => togglePanel("distinction")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "distinction" ? 'bg-green-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Izomeriyalar farqi">🔍</button>
          <button onClick={() => togglePanel("history")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Werner tarixi">📜</button>
          <button onClick={() => togglePanel("test")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Test / mashqlar">🧠</button>
          <button onClick={() => setPdfModalOpen(true)} className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="PDF eksport">📄</button>
          <button onClick={() => setFullscreenMode(true)} className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="To'liq ekran">🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button onClick={() => setFullscreenMode(false)} className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40" title="Fullscreen rejimidan chiqish">
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[295px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
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

            {/* Shakl tanlash */}
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
              <div className="mt-2 text-[9.5px] text-purple-400 leading-relaxed">
                <div><strong className="text-yellow-300">A:</strong> {isomerForm === "A" ? pair.innerA.chargeText : pair.innerB.chargeText} kation + <strong className="text-cyan-300">tashqi:</strong> {isomerForm === "A" ? pair.outerA.ionText : pair.outerB.ionText}</div>
                <div className="mt-0.5">Ion soni: <strong className="text-pink-300">{isomerForm === "A" ? pair.ionCountA : pair.ionCountB}</strong></div>
              </div>
            </div>

            {/* KO'RINISH */}
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
                  <button onClick={() => setViewMode("inner")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "inner" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>◆ Ichki</button>
                  <button onClick={() => setViewMode("outer")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "outer" ? 'bg-cyan-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>◇ Tashqi</button>
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
                  <span>Sfera chegarasi 🔵</span>
                  <input type="checkbox" checked={showSphereBoundary} onChange={(e) => setShowSphereBoundary(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Zaryad halosi 🟡🔵</span>
                  <input type="checkbox" checked={showChargeHalo} onChange={(e) => setShowChargeHalo(e.target.checked)} className="accent-yellow-500" />
                </label>
              </div>
            )}

            {/* TEST SIMULYATORI — Werner uslublari */}
            <button
              onClick={() => setExpandedSection(expandedSection === "tests" ? null : "tests")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🧪</span> Werner testlari</span>
              <span>{expandedSection === "tests" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "tests" && (
              <div className="space-y-2 mb-3 px-1">
                <p className="text-[10px] text-purple-400 italic">
                  Reagent qo'shish simulyatsiyasi. Cho'kma zarrachalari yuqoridan tushadi.
                </p>
                <button
                  onClick={() => setActiveTest(activeTest === 'AgNO3' ? null : 'AgNO3')}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${activeTest === 'AgNO3' ? 'bg-gray-400 text-black shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>⚕️</span> + AgNO₃ (kumush)</span>
                  <span>{activeTest === 'AgNO3' ? "■" : "▶"}</span>
                </button>
                {activeTest === 'AgNO3' && (
                  <div className="bg-gray-900/50 rounded-lg p-2 border border-gray-500/40">
                    <p className="text-[10px] text-gray-200 leading-tight">
                      {isomerForm === "A" ? pair.agno3A : pair.agno3B}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setActiveTest(activeTest === 'BaCl2' ? null : 'BaCl2')}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${activeTest === 'BaCl2' ? 'bg-green-500 text-black shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>🟢</span> + BaCl₂ (bariy)</span>
                  <span>{activeTest === 'BaCl2' ? "■" : "▶"}</span>
                </button>
                {activeTest === 'BaCl2' && (
                  <div className="bg-green-950/50 rounded-lg p-2 border border-green-500/40">
                    <p className="text-[10px] text-green-100 leading-tight">
                      {isomerForm === "A" ? pair.bacl2A : pair.bacl2B}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setActiveTest(activeTest === 'heat' ? null : 'heat')}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${activeTest === 'heat' ? 'bg-orange-500 text-white shadow-lg' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>🔥</span> Qaynatish (Δ)</span>
                  <span>{activeTest === 'heat' ? "■" : "▶"}</span>
                </button>
                {activeTest === 'heat' && (
                  <div className="bg-orange-950/50 rounded-lg p-2 border border-orange-500/40">
                    <p className="text-[10px] text-orange-100 leading-tight">
                      Qaynatish orqali ichki sferadagi ligand almashinuvi (aquation) tezlashadi. Kinetik izomer termodinamik izomerga aylanadi. Adamson (1963) va Basolo tadqiqotlari.
                    </p>
                  </div>
                )}

                <div className="mt-2 bg-purple-900/30 rounded-lg p-2 border border-purple-700/40">
                  <div className="text-[9.5px] text-purple-300 font-bold mb-1">📉 Konduktometriya (Λₘ)</div>
                  <div className="text-[10px] font-mono text-yellow-300">
                    {isomerForm === "A" ? pair.conductivityA : pair.conductivityB}
                  </div>
                  <div className="text-[9px] text-purple-400 mt-1">Ion soni: <strong className="text-pink-300">{isomerForm === "A" ? pair.ionCountA : pair.ionCountB}</strong></div>
                </div>
              </div>
            )}

            {/* ILMIY ASBOBLAR */}
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
                  <span className="flex items-center gap-2"><span>🔄</span> Ion almashinuvi</span>
                  <span>{swapAnimate ? "⏸" : "▶"}</span>
                </button>
                <p className="text-[10px] text-purple-400 italic px-1">
                  Ichki va tashqi sferalar orasidagi ion almashinuvi jarayonini animatsiya orqali ko'rsatadi.
                </p>
                <button
                  onClick={() => setIsomerForm(isomerForm === "A" ? "B" : "A")}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all"
                >
                  ⇌ Shaklni almashtirish (A ↔ B)
                </button>
              </div>
            )}

            {/* EKSPORT */}
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

            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                Atomga bosing — batafsil ma'lumot. 🟡 Oltin halo — ichki koordinatsion sfera, 🔵 moviy halo — tashqi kristall sferasi. 🧪 Test tugmalari orqali Werner AgNO₃/BaCl₂ sinovlarini simulyatsiya qiling.
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
              {selectedAtom.ligandName && <div><span className="text-purple-500">Ligand/Ion:</span> <span className="text-cyan-300">{selectedAtom.ligandName}</span></div>}
              {selectedAtom.charge && <div><span className="text-purple-500">Zaryad:</span> <span className="font-mono text-pink-300">{selectedAtom.charge}</span></div>}
              {selectedAtom.sphereRole && <div><span className="text-purple-500">Sferasi:</span> <span className={selectedAtom.sphereTag === "inner" ? "text-yellow-300" : "text-cyan-300"}>{selectedAtom.sphereRole}</span></div>}
              {selectedAtom.sphereTag === 'inner' && !selectedAtom.isCenter && <div className="mt-2 text-yellow-400 font-bold">🟡 Ichki sferada — koordinatsion bog'langan</div>}
              {selectedAtom.sphereTag === 'outer' && <div className="mt-2 text-cyan-400 font-bold">🔵 Tashqi sferada — erkin ion</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">💎 Markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
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
                <div className="text-yellow-100 text-[10px] mt-1">Ion soni: <strong>{pair.ionCountA}</strong> · Λₘ: {pair.conductivityA.match(/Λₘ ≈ [0-9]+/)?.[0]}</div>
              </div>

              <div className="text-center text-purple-400 text-lg">⇅</div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 text-[10px] uppercase tracking-wide mb-1 font-bold">◇ B SHAKLI</div>
                <div className="text-cyan-100 text-[11px] font-mono">{pair.formulaB}</div>
                <div className="text-cyan-100 text-[10px] mt-1 italic">{pair.nameB}</div>
                <div className="text-cyan-100 text-[10px] mt-1">Rang: {pair.colorB}</div>
                <div className="text-cyan-100 text-[10px] mt-1">Ion soni: <strong>{pair.ionCountB}</strong> · Λₘ: {pair.conductivityB.match(/Λₘ ≈ [0-9]+/)?.[0]}</div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Termodinamika</div>
                <div className="text-purple-100 text-[10px] leading-relaxed">{pair.thermoNote}</div>
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

        {/* — WERNER TESTLARI PANELI — */}
        {activePanel === "tests" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-blue-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-blue-200 flex items-center gap-2 text-sm">
                <span>🧪</span> Werner diagnostik testlari
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <p className="text-blue-100 text-[10.5px] leading-relaxed">
                  <strong>Alfred Werner (1893)</strong> ionlanish izomerlarini ajratish uchun 3 ta klassik test uslubini ishlab chiqdi. Bu testlar bugungi kimyoda ham diagnostik standart hisoblanadi.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 border-2 border-gray-400/50">
                <div className="text-gray-200 font-bold text-[11px] mb-1 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span> 1) AgNO₃ (kumush nitrat)
                </div>
                <p className="text-gray-100 text-[10px] leading-relaxed">
                  <strong className="text-yellow-300">Prinsip:</strong> Ag⁺ + X⁻ (erkin halogenid tashqi sferada) → AgX↓ cho'kmasi.
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-yellow-200 text-[10px]"><strong>◆ A shakli:</strong> {pair.agno3A}</div>
                  <div className="text-cyan-200 text-[10px]"><strong>◇ B shakli:</strong> {pair.agno3B}</div>
                </div>
              </div>

              <div className="bg-green-950/50 rounded-lg p-3 border-2 border-green-500/50">
                <div className="text-green-200 font-bold text-[11px] mb-1 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-400"></span> 2) BaCl₂ (bariy xlorid)
                </div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  <strong className="text-yellow-300">Prinsip:</strong> Ba²⁺ + SO₄²⁻ (erkin) → BaSO₄↓ oq cho'kma.
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-yellow-200 text-[10px]"><strong>◆ A shakli:</strong> {pair.bacl2A}</div>
                  <div className="text-cyan-200 text-[10px]"><strong>◇ B shakli:</strong> {pair.bacl2B}</div>
                </div>
              </div>

              <div className="bg-orange-950/50 rounded-lg p-3 border-2 border-orange-500/50">
                <div className="text-orange-200 font-bold text-[11px] mb-1 flex items-center gap-1.5">
                  <span>📉</span> 3) Molar o'tkazuvchanlik (Λₘ)
                </div>
                <p className="text-orange-100 text-[10px] leading-relaxed">
                  <strong className="text-yellow-300">Prinsip:</strong> Λₘ = k/c (S·sm²/mol). Ion soni ko'p = Λₘ katta.
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-yellow-200 text-[10px]"><strong>◆ A:</strong> {pair.conductivityA}</div>
                  <div className="text-cyan-200 text-[10px]"><strong>◇ B:</strong> {pair.conductivityB}</div>
                </div>
              </div>

              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <div className="text-amber-300 font-bold text-[10.5px] mb-1.5">📊 Werner ion sonlari jadvali</div>
                <table className="w-full text-[9.5px] text-amber-100">
                  <thead className="text-amber-300">
                    <tr><th className="text-left py-1">Ion soni</th><th className="text-left">Λₘ (S·sm²/mol)</th><th className="text-left">Tuz tipi</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>2</td><td>100–130</td><td>1:1 (masalan NaCl)</td></tr>
                    <tr><td>3</td><td>230–280</td><td>1:2 yoki 2:1 (CaCl₂)</td></tr>
                    <tr><td>4</td><td>400–450</td><td>1:3 (AlCl₃)</td></tr>
                    <tr><td>5</td><td>500+</td><td>1:4 yoki 4:1</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[10.5px] mb-1">💡 Amaliy maslahatlar</div>
                <ul className="text-purple-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• Testlarni <strong>xona haroratida</strong> darhol o'tkazing — issiqlik ligand almashinuvini keltirib chiqaradi.</li>
                  <li>• Ichki sferadagi ligand faqat <strong>qaynatilgandan keyin</strong> chiqadi (aquation).</li>
                  <li>• Konduktometrik o'lchov <strong>0.001 M</strong> eritmada aniqroq bo'ladi.</li>
                  <li>• Rang farqi ham qo'shimcha diagnostik belgi.</li>
                </ul>
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
                  <strong>Ionlanish izomeriyasi</strong> — koordinatsion tuzda ichki koordinatsion sfera va tashqi (kristall) sfera orasida anionlar (yoki neytral ligandlar) o'zaro almashishi natijasida hosil bo'ladigan izomeriya turi.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1.5">⚛️ Uch asosiy shart</div>
                <ol className="text-purple-100 text-[10px] leading-relaxed space-y-1 list-decimal list-inside">
                  <li>Kompleks tuz kation VA aniondan iborat bo'lishi kerak</li>
                  <li>Ikkala anion ham koordinatsion ligand bo'la olishi kerak (Cl⁻, Br⁻, SO₄²⁻, NO₃⁻, NO₂⁻)</li>
                  <li>Ichki-tashqi almashinishi natijasida yangi barqaror izomer hosil bo'lishi kerak</li>
                </ol>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">🎯 Ushbu tizim uchun</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{pair.thermoNote}</p>
              </div>

              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">🎯 Werner qonuni (1893)</div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  Koordinatsion birikma <strong>ichki sfera</strong> (metall bilan bevosita bog'langan ligandlar, kvadrat qavslar ichida) va <strong>tashqi sfera</strong> (kristall panjarada joylashgan erkin ionlar) tarkibiga bo'linadi. Ichki sferadagi ion mustahkam kovalent-koordinatsion bog' bilan ushlangan, tashqi sferadagi ion esa faqat elektrostatik kuchlar bilan.
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">📐 Ichki sfera koordinatsion sonlari</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Klassik namunalar oktaedrik (KS=6). Ichki sferada NH₃, H₂O va anion kombinatsiyalari joylashadi. Ammoniak (NH₃) va suv (H₂O) neytral ligandlar bo'lgani uchun ichki sfera zaryadi metall va anion soniga bog'liq.
                </p>
              </div>

              <div className="bg-pink-950/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 font-bold text-[11px] mb-1">🔄 Ion almashinuvi mexanizmi</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">
                  Erigan holatda, ikkita anion o'z o'rnini almashishi mumkin. Ammo Co(III), Cr(III), Pt(IV) inert markazlar bo'lgani uchun bu jarayon juda sekin. Kristall holatda ikkala izomer bir-biriga aylanmaydi. Qaynatish (Δ) yoki UV nurlanish bilan aquation tezlashadi.
                </p>
              </div>

              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">💨 HSAB nazariyasi qo'llanishi</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Qattiq kation (Co³⁺, Cr³⁺, Fe³⁺) qattiq donorlarni afzal ko'radi (O donor: SO₄²⁻, NO₃⁻, H₂O). Yumshoq metallar (Pd²⁺, Pt²⁺) yumshoq donorlarni (I⁻, Br⁻, S donor) afzal ko'radi. Bu qonuniyat qaysi anion ichki sferada bo'lishini bashorat qiladi.
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
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Ichki sfera</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.innerA.mainLigand}ₓ {pair.innerA.specialLigand || ""} ({pair.innerA.chargeText})</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.innerB.mainLigand}ₓ {pair.innerB.specialLigand || ""} ({pair.innerB.chargeText})</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Tashqi ion</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.outerA.ionText}</td><td className="border border-purple-800/50 px-2 py-1.5">{pair.outerB.ionText}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Ion soni</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-pink-300">{pair.ionCountA}</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono text-pink-300">{pair.ionCountB}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Λₘ</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.conductivityA.match(/Λₘ ≈ [0-9]+/)?.[0]}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.conductivityB.match(/Λₘ ≈ [0-9]+/)?.[0]}</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorA}</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.colorB}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">AgNO₃</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.agno3A.slice(0, 55)}...</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.agno3B.slice(0, 55)}...</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">BaCl₂</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.bacl2A.slice(0, 55)}...</td><td className="border border-purple-800/50 px-2 py-1.5 text-[9.5px]">{pair.bacl2B.slice(0, 55)}...</td></tr>
              </tbody>
            </table>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>IUPAC nomenklatura:</strong> Kation avval, keyin anion. Ichki sferada ligandlar alfavitik tartibda joylashadi.
            </div>
          </div>
        )}

        {/* — GIDRAT IZOMERIYA — */}
        {activePanel === "hydrate" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>💧</span> Gidrat izomeriya — maxsus tur
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <p className="text-cyan-100 text-[10.5px] leading-relaxed">
                  <strong>Gidrat izomeriya</strong> — ionlanish izomeriyasining maxsus va eng klassik turi. H₂O molekulasi ichki sferada koordinatsion ligand yoki tashqi sferada kristall suvi (kristallohidrat) sifatida joylashadi.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border-2 border-purple-500/60">
                <div className="text-purple-300 font-bold text-[11px] mb-2">🎯 Klassik uchlik — [Cr(H₂O)₆]Cl₃ sistemasi</div>
                <div className="space-y-2">
                  <div className="bg-purple-800/40 rounded p-2 border-l-2 border-purple-400">
                    <div className="text-purple-200 font-mono text-[11px]">[Cr(H₂O)₆]Cl₃</div>
                    <div className="text-purple-100 text-[9.5px] mt-1">Rang: <strong>fioletovaya (binafsha)</strong> • 6 H₂O ichkarida, 3 Cl tashqarida • <strong>4 ion</strong> • Λₘ ≈ 430</div>
                  </div>
                  <div className="bg-green-800/30 rounded p-2 border-l-2 border-green-400">
                    <div className="text-green-200 font-mono text-[11px]">[Cr(H₂O)₅Cl]Cl₂·H₂O</div>
                    <div className="text-green-100 text-[9.5px] mt-1">Rang: <strong>ochiq yashil</strong> • 5 H₂O + 1 Cl ichkarida, 2 Cl + 1 H₂O tashqarida • <strong>3 ion</strong> • Λₘ ≈ 250</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded p-2 border-l-2 border-emerald-400">
                    <div className="text-emerald-200 font-mono text-[11px]">[Cr(H₂O)₄Cl₂]Cl·2H₂O</div>
                    <div className="text-emerald-100 text-[9.5px] mt-1">Rang: <strong>to'q yashil</strong> • 4 H₂O + 2 Cl ichkarida, 1 Cl + 2 H₂O tashqarida • <strong>2 ion</strong> • Λₘ ≈ 105</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[10.5px] mb-1">🔬 Ajratish uchun diagnostik testlar</div>
                <ul className="text-yellow-100 text-[10px] space-y-1 leading-relaxed">
                  <li>• <strong>AgNO₃ testi:</strong> Fioletovaya → 3 mol AgCl; ochiq yashil → 2 mol; to'q yashil → 1 mol</li>
                  <li>• <strong>Λₘ konduktometriya:</strong> 430 / 250 / 105 S·sm²/mol</li>
                  <li>• <strong>Rang farqi:</strong> ko'z bilan aniqlanadi (Cl ichkarida = qizil siljish)</li>
                  <li>• <strong>Termogravimetriya (TG):</strong> kristall H₂O 60–100°C oralig'ida; koordinatsion H₂O 100°C dan yuqori</li>
                  <li>• <strong>UV-VIS:</strong> ⁴T₁g va ⁴T₂g o'tishlar to'lqin uzunligi Cl⁻ ligand miqdoriga bog'liq</li>
                </ul>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[10.5px] mb-1">📜 Tarix</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Bu izomerlar 1898-yilda Jørgensen (Kopengagen) tomonidan birinchi bo'lib ajratilgan. Werner 1901-yilda ularni koordinatsion nazariya orqali izohladi. Bu misol koordinatsion kimyo tarixidagi eng muhim tajribalardan biri hisoblanadi.
                </p>
              </div>

              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[10.5px] mb-1">🏗️ Boshqa gidrat sistemalar</div>
                <ul className="text-orange-100 text-[10px] space-y-0.5 leading-relaxed">
                  <li>• [Fe(H₂O)₆]Cl₃ ⇌ [Fe(H₂O)₅Cl]Cl₂·H₂O</li>
                  <li>• [Co(H₂O)₆]Cl₂ — pushti/ko'k rangdegi navbatlanish (silika-gel indikatori)</li>
                  <li>• CoCl₂·6H₂O — pushti; CoCl₂·2H₂O — ko'k (havo namligini o'lchash)</li>
                  <li>• CuSO₄·5H₂O — 4 H₂O ichkarida, 1 H₂O SO₄ bilan bog'langan</li>
                </ul>
              </div>
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
                <div className="text-green-300 font-bold text-[11px] mb-1">🎯 IONLANISH IZOMERIYA (bu sahifa)</div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  Ichki koordinatsion sfera va tashqi (kristall) sfera orasida <strong>ion (anion) almashinuvi</strong>. Erigan holatda turli ionlarni beradi. AgNO₃, BaCl₂, Λₘ testlari bilan aniqlanadi.
                </p>
                <p className="text-green-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₅Br]SO₄ ⇌ [Co(NH₃)₅SO₄]Br
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">🔗 Bog'lanish (linkage) izomeriyasi</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  <strong>Ambidentat ligand</strong> (NO₂⁻, SCN⁻) bir kompleks ichida turli atom orqali bog'lanadi. Ichki-tashqi sfera almashinuvi shart emas.
                </p>
                <p className="text-blue-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₅NO₂]²⁺ ⇌ [Co(NH₃)₅ONO]²⁺
                </p>
              </div>

              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[11px] mb-1">🔀 Koordinatsion izomeriyasi</div>
                <p className="text-orange-100 text-[10px] leading-relaxed">
                  Ikkita alohida kompleks (kation + anion) o'rtasida <strong>ligand almashinuvi</strong>. Ichki-tashqi sfera farqi emas.
                </p>
                <p className="text-orange-200 text-[9.5px] mt-1.5 font-mono">
                  [Co(NH₃)₆][Cr(CN)₆] ⇌ [Cr(NH₃)₆][Co(CN)₆]
                </p>
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">💧 Gidrat izomeriya</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  Ionlanish izomeriyaning maxsus turi — H₂O molekulasi ichki yoki tashqi sferada joylashadi.
                </p>
                <p className="text-cyan-200 text-[9.5px] mt-1.5 font-mono">
                  [Cr(H₂O)₆]Cl₃ ⇌ [Cr(H₂O)₅Cl]Cl₂·H₂O
                </p>
              </div>

              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">🔄 Solvat izomeriya</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Boshqa erituvchi molekulalari (ROH, DMSO, NH₃ va h.k.) ichki yoki tashqi sferada joylashishi.
                </p>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[10.5px] mb-1">📌 Muhim eslatma</div>
                <p className="text-yellow-100 text-[9.5px] leading-relaxed">
                  Ionlanish izomerlar bir xil <strong>umumiy molekulyar formulaga</strong> ega, lekin ular <strong>ikki xil kimyoviy modda</strong>. Ular turli erishuvchanlik, spektral, rangli, elektr o'tkazuvchanlik va kristall xususiyatlarga ega bo'ladi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Werner va tarixiy tadqiqotlar
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{pair.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1866 — Alfred Werner tug'ilgan</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">Mulhouse (Fransiya)da tug'ilgan. Sürix Federal Technology Institutida o'qigan va u yerda umr bo'yi ishlagan.</p>
              </div>

              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-cyan-300 font-bold text-[11px]">1892 — Jørgensen kashfiyoti</div>
                <p className="text-cyan-200 text-[10px] leading-relaxed">Sofus Mads Jørgensen (Kopengagen) [Cr(NH₃)₅Cl]SO₄ va [Cr(NH₃)₅(SO₄)]Cl — "yashil sulfat" va "qizil xlorid" tuzlarini birinchi bo'lib ajratdi. Bu — ionlanish izomerlarni topgan birinchi kashfiyot.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1893 — Werner koordinatsion nazariyasi</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">"Beitrag zur Konstitution anorganischer Verbindungen" maqolasida ichki va tashqi sfera tushunchasini kiritdi. Jørgensen kashfiyotlarini shu nazariya bilan izohladi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1894 — Werner-Miolati testlari</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Werner va A. Miolati molar o'tkazuvchanlik va AgNO₃ titratsiyasi orqali ionlanish izomerlarni birinchi bo'lib eksperimental tasdiqladilar. Bu — koordinatsion kimyoning haqiqiy tug'ilishi.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1904 — Kurnakov (Sankt-Peterburg)</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">Nikolay Kurnakov Pt(II) va Pt(IV) komplekslarida ionlanish izomerlarini o'rgandi. Tiokarbamid testi (Kurnakov reaksiyasi) cis/trans va ionli/koordinatsion ligandlar ajratishga imkon berdi.</p>
              </div>

              <div className="border-l-2 border-orange-500 pl-3">
                <div className="text-orange-300 font-bold text-[11px]">1913 — Werner Nobel mukofoti</div>
                <p className="text-orange-200 text-[10px] leading-relaxed">"Kimyo tuzilish nazariyasiga ajoyib hissasi uchun" — noorganik kimyoda birinchi Nobel mukofoti. Ionlanish izomerlar — Werner nazariyasining hal qiluvchi isboti bo'ldi.</p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1919 — Werner vafoti</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Werner Sürixda 52 yoshida vafot etdi. Uning izidan John Bailar, Fred Basolo, Ralph Pearson kabi olimlar koordinatsion kimyoning zamonaviy sohalarini rivojlantirdilar.</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1965 — Rosenberg va sisplatin</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Barnett Rosenberg cis-[Pt(NH₃)₂Cl₂] (sisplatin) antitumoral aktivligini kashf etdi. Bu — ionlanish izomerlar mavzusining zamonaviy tibbiyot ahamiyatining boshlanishi bo'ldi.</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST / MASHQLAR — */}
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
                q="Ionlanish izomeriyasi nima?"
                a="Ichki koordinatsion sfera va tashqi (kristall) sfera orasida ion (anion) almashinuvi natijasida hosil bo'ladigan izomeriya turi. Umumiy formula bir xil, lekin erigan holatda turli ionlarni beradi."
              />
              <TestQuestion
                q="[Co(NH₃)₅Br]SO₄ va [Co(NH₃)₅SO₄]Br qanday izomerlar?"
                a="Ionlanish izomerlar. A: Br⁻ ichki sferada, SO₄²⁻ tashqi (erkin) sferada. B: aksincha — SO₄²⁻ ichkarida, Br⁻ tashqarida. Werner tomonidan 1893–1907 yillarda ajratilgan klassik namuna."
              />
              <TestQuestion
                q="AgNO₃ testi qanday ishlaydi?"
                a="Ag⁺ + X⁻ (erkin halogenid) → AgX↓ cho'kmasi. Faqat tashqi sferadagi Cl⁻/Br⁻/I⁻ darhol reaksiyaga kirishadi. Ichki sferada bog'langan halogenid faqat qaynatilgandan keyin chiqadi. Bu — Werner asosiy diagnostik testi."
              />
              <TestQuestion
                q="BaCl₂ testi qanday ishlaydi?"
                a="Ba²⁺ + SO₄²⁻ (erkin) → BaSO₄↓ oq cho'kma. Faqat tashqi sferadagi sulfat darhol reaksiya beradi. Agar SO₄²⁻ ichki sferada koordinatsion bog'langan bo'lsa (M–OSO₃), reaksiya bo'lmaydi."
              />
              <TestQuestion
                q="Molar o'tkazuvchanlik Λₘ nima ma'lumot beradi?"
                a="Λₘ = k/c (S·sm²/mol). Ion soni ko'p bo'lgan tuz o'tkazuvchanlik ko'proq beradi. Werner qonuni: 2 ion → Λₘ ≈ 100–130; 3 ion → 230–280; 4 ion → 400–450. Shu farq izomerlarni ajratishga imkon beradi."
              />
              <TestQuestion
                q="Gidrat izomeriya nima va nima uchun ionlanish izomeriyaning turi hisoblanadi?"
                a="H₂O molekulasi ichki sferada koordinatsion ligand yoki tashqi sferada kristall suvi sifatida bo'lishi. Bu ionlanish izomeriyaning maxsus ko'rinishi — chunki H₂O ham anion o'rnini bosishi mumkin. Misol: [Cr(H₂O)₆]Cl₃ (binafsha) ⇌ [Cr(H₂O)₅Cl]Cl₂·H₂O (yashil)."
              />
              <TestQuestion
                q="[Cr(H₂O)₆]Cl₃ va [Cr(H₂O)₅Cl]Cl₂·H₂O da AgNO₃ sinovi qanday farq beradi?"
                a="Birinchi tuz (fioletovaya): 3 mol AgCl cho'kmasi darhol (barcha 3 ta Cl tashqarida). Ikkinchi tuz (yashil): faqat 2 mol AgCl darhol (1 ta Cl ichki sferada Cr bilan bog'langan). Bu — aniq diagnostik farq."
              />
              <TestQuestion
                q="Ionlanish izomeriya bog'lanish izomeriyasidan qanday farq qiladi?"
                a="Bog'lanish izomeriyasi bitta kompleks ichida ambidentat ligand (NO₂⁻, SCN⁻) turli atom orqali bog'lanadi. Ionlanish izomeriyasi esa ichki va tashqi sferalar orasidagi ANION ALMASHINUVI. Bog'lanish uchun ambidentat ligand shart, ionlanish uchun esa emas."
              />
              <TestQuestion
                q="Ionlanish izomerlar sanoat va tibbiyotda qanday muhim?"
                a="Sisplatin (Rosenberg 1965) va Pt(IV) prodrug lar (satraplatin) kimyoterapiyada. Xrom oshlash sanoati (tanning). Analitik kimyoda kompleks tuzlarni identifikatsiyalash. B12 vitamini (kobalamin) strukturasida."
              />
              <TestQuestion
                q="Nima uchun ba'zi ionlanish izomerlar bir-biriga aylanadi, boshqalari yo'q?"
                a="Bu METALL KINETIKASIGA bog'liq. Inert metallar (Co³⁺, Cr³⁺, Pt(IV)) atrofidagi ligand almashinuvi juda sekin — shuning uchun izomerlar mustaqil kristallar sifatida saqlanadi. Labil metallar (Cu²⁺, Fe³⁺) esa tez almashadi va bir izomer boshqasiga aylanishi mumkin."
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
                  { k: "intro", label: "1. Kirish — ionlanish izomeriyasi", icon: "📖" },
                  { k: "definition", label: "2. Ta'rif va nazariy asos", icon: "📐" },
                  { k: "tests", label: "3. Werner diagnostik testlari", icon: "🧪" },
                  { k: "examples", label: "4. 6 ta klassik namunalar", icon: "🧪" },
                  { k: "distinction", label: "5. Boshqa izomeriyalardan farqi", icon: "🔍" },
                  { k: "thermodynamics", label: "6. Termodinamika va HSAB", icon: "🔥" },
                  { k: "hydrate", label: "7. Gidrat izomeriya (maxsus tur)", icon: "💧" },
                  { k: "history", label: "8. Werner tarixi", icon: "📜" },
                  { k: "table", label: "9. Solishtirish jadvali", icon: "📊" },
                  { k: "application", label: "10. Amaliy qo'llanilishi", icon: "⚙️" }
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
                <button onClick={() => setPdfModalOpen(false)} className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200" disabled={pdfGenerating}>Bekor qilish</button>
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

      {/* Pastki legenda */}
      {!fullscreenMode && (
        <div className="flex justify-center gap-3 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#D0D0E0]"></div><span className="text-purple-300">Pt</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FFFF30]"></div><span className="text-purple-300">S</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#A62929]"></div><span className="text-purple-300">Br</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-400/30"></div><span className="text-purple-300">◆ Ichki sfera</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-400/30"></div><span className="text-purple-300">◇ Tashqi sfera</span></div>
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

// ────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli
// ────────────────────────────────────────────────────────────
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
