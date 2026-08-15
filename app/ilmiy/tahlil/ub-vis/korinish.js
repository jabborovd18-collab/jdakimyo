"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS SPEKTROSKOPIYA — ASOSIY NAZARIY SAHIFA (PREMIUM SCIENTIFIC)
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed., Elsevier)
//   • F. A. Cotton — Chemical Applications of Group Theory (3rd ed.)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed.)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan (1954)
//   • H. Bethe — Ann. Physik (1929, Crystal Field Theory)
//   • J. H. Van Vleck — Ligand Field Theory (1935)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding
//   • P. Atkins — Physical Chemistry (Electronic Spectroscopy bo'limi)
// Xususiyat: Kvant nazariyasi, kristall va ligand maydon nazariyasi, Tanabe-Sugano,
//            Laport va spin tanlash qoidalari, LMCT/MLCT, Racah parametrlari,
//            spektroximik va nefelauksetik qatorlar, rang nazariyasi, Beer-Lambert
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const UBVIS_DATA = {
  // ─── Elektromagnit spektrda UB-Vis ning o'rni
  emRegions: [
    { name: "Vakuum UB (VUV)", range: "10–200", wavelength: "10–200 nm", energy: "6.2–124 eV", note: "Havoda yutiladi — maxsus vakuum spektrometr talab qiladi. Yadro elektronlari, sigma-o'tishlar." },
    { name: "Uzoq UB (Far UV)", range: "200–280", wavelength: "200–280 nm", energy: "4.4–6.2 eV", note: "π→π* o'tishlar (aromatik ligandlar), yuqori intensivlikdagi LMCT/MLCT" },
    { name: "Yaqin UB (Near UV)", range: "280–400", wavelength: "280–400 nm", energy: "3.1–4.4 eV", note: "n→π*, ligand ichi o'tishlari, ba'zi zaryad ko'chish tasmalari" },
    { name: "Ko'rinadigan (Vis)", range: "400–780", wavelength: "400–780 nm", energy: "1.6–3.1 eV", note: "d–d o'tishlar, rangning asosiy manbai — kompleks kimyoning eng informativ sohasi" },
    { name: "Yaqin IQ (NIR)", range: "780–2500", wavelength: "780–2500 nm", energy: "0.5–1.6 eV", note: "f–f o'tishlar (lantanoidlar), past energiyali d–d, spin-taqiqlangan tasmalar" },
  ],

  // ─── Yutilgan va ko'rinuvchi rang (to'ldiruvchi ranglar jadvali)
  colorWheel: [
    { absorbed: "Binafsha", lambdaRange: "400–430", perceived: "Sariq-yashil", hex: "#8B00FF", perceivedHex: "#ADFF2F", example: "[Cu(NH₃)₄]²⁺ (to'q ko'k)" },
    { absorbed: "Ko'k", lambdaRange: "430–490", perceived: "To'q sariq", hex: "#0000FF", perceivedHex: "#FF8C00", example: "[Ti(H₂O)₆]³⁺ ε≈5" },
    { absorbed: "Ko'k-yashil", lambdaRange: "490–510", perceived: "Qizil", hex: "#00FFFF", perceivedHex: "#FF0000", example: "[Co(NH₃)₅H₂O]³⁺ (pushti)" },
    { absorbed: "Yashil", lambdaRange: "510–560", perceived: "Purpur", hex: "#00FF00", perceivedHex: "#FF00FF", example: "trans-[Co(en)₂Cl₂]⁺ (yashil)" },
    { absorbed: "Sariq-yashil", lambdaRange: "560–580", perceived: "Binafsha", hex: "#ADFF2F", perceivedHex: "#8B00FF", example: "[Cr(H₂O)₆]³⁺ (binafsha)" },
    { absorbed: "Sariq", lambdaRange: "580–600", perceived: "Ko'k", hex: "#FFFF00", perceivedHex: "#0000FF", example: "[Cu(H₂O)₆]²⁺ (havorang)" },
    { absorbed: "To'q sariq", lambdaRange: "600–650", perceived: "Ko'k-yashil", hex: "#FF8C00", perceivedHex: "#00CED1", example: "[Ni(H₂O)₆]²⁺ (yashil)" },
    { absorbed: "Qizil", lambdaRange: "650–780", perceived: "Yashil", hex: "#FF0000", perceivedHex: "#00FF00", example: "[Co(NH₃)₆]³⁺ (sariq)" },
  ],

  // ─── Elektron o'tish turlari
  transitionTypes: [
    {
      symbol: "d–d",
      name: "d–d o'tishlar (dd)",
      energy: "10 000 – 30 000 cm⁻¹",
      lambda: "333–1000 nm",
      epsilon: "1–100 M⁻¹·sm⁻¹",
      selectionRule: "Laport-taqiqlangan (g→g), spin-ruxsat etilgan bo'lishi mumkin",
      color: "text-purple-400",
      example: "[Ti(H₂O)₆]³⁺: ²T₂g → ²Eg (500 nm, ε=5)",
      note: "Metallning d-orbitallari ichida sodir bo'ladi. Oh da eg va t₂g orbitallari orasidagi ΔO ga bog'liq. Zaif intensivlik — chunki markazsimmetrik kompleksda dipol taqiqlangan (vibronik bog'lanish orqali qisman ruxsat)"
    },
    {
      symbol: "LMCT",
      name: "Ligand → Metall zaryad ko'chishi",
      energy: "20 000 – 50 000 cm⁻¹",
      lambda: "200–500 nm",
      epsilon: "1 000 – 50 000 M⁻¹·sm⁻¹",
      selectionRule: "Laport va spin ruxsat etilgan — juda kuchli",
      color: "text-red-400",
      example: "MnO₄⁻: O 2p → Mn 3d (525 nm, ε≈2500) — permanganatning binafsha rangi",
      note: "Elektron ligandning to'ldirilgan orbitalidan metallning bo'sh orbitaliga ko'chadi. Yuqori oksidlanish darajasidagi metallarda kuchli (Mn⁷⁺, Cr⁶⁺, V⁵⁺). π-donor ligandlar (O²⁻, S²⁻, Cl⁻) LMCT ni kuchaytiradi."
    },
    {
      symbol: "MLCT",
      name: "Metall → Ligand zaryad ko'chishi",
      energy: "15 000 – 40 000 cm⁻¹",
      lambda: "250–650 nm",
      epsilon: "1 000 – 20 000 M⁻¹·sm⁻¹",
      selectionRule: "Laport va spin ruxsat etilgan — kuchli",
      color: "text-orange-400",
      example: "[Ru(bpy)₃]²⁺: Ru dπ → bpy π* (452 nm, ε≈14 600) — quyosh batareyalarida",
      note: "Metallning d-orbitalidan ligandning bo'sh π*-orbitaliga ko'chish. π-akseptor ligandlar (CO, CN⁻, bpy, phen) MLCT ni beradi. Past oksidlanish darajasidagi metallarda kuchli (Fe⁰, Ru²⁺, Re¹⁺)."
    },
    {
      symbol: "LLCT",
      name: "Ligand → Ligand zaryad ko'chishi",
      energy: "20 000 – 45 000 cm⁻¹",
      lambda: "220–500 nm",
      epsilon: "500 – 10 000 M⁻¹·sm⁻¹",
      selectionRule: "Ruxsat etilgan",
      color: "text-green-400",
      example: "[Pt(NH₃)₂(bpy)₂]²⁺: NH₃ → bpy π*",
      note: "Aralash ligandli komplekslarda bir ligand orbitalidan boshqa ligand orbitaliga o'tish. Metall vositachi rolini o'ynaydi."
    },
    {
      symbol: "IL (π→π*)",
      name: "Ligand ichi o'tishlari",
      energy: "30 000 – 50 000 cm⁻¹",
      lambda: "200–330 nm",
      epsilon: "1 000 – 100 000 M⁻¹·sm⁻¹",
      selectionRule: "π→π* — Laport va spin ruxsat",
      color: "text-cyan-400",
      example: "Erkin bpy: π→π* (280 nm, ε≈14 000)",
      note: "Aromatik ligandlarning (bpy, phen, porfirin) o'ziga xos yutilishi. Koordinatsiya bu tasmalarni biroz siljitadi (batoxrom yoki gipsokrom)."
    },
    {
      symbol: "f–f",
      name: "f–f o'tishlar",
      energy: "5 000 – 25 000 cm⁻¹",
      lambda: "400–2000 nm",
      epsilon: "0.1 – 10 M⁻¹·sm⁻¹",
      selectionRule: "Laport-taqiqlangan, spin-taqiqlangan bo'lishi mumkin",
      color: "text-yellow-400",
      example: "Nd³⁺: ⁴I₉/₂ → ⁴G₅/₂ (580 nm)",
      note: "Lantanoid (4f) va aktinoid (5f) elementlarda kuzatiladi. f-orbitallar ekranlangan → o'tkir, ingichka polosalar. Rang deyarli o'zgarmas."
    },
  ],

  // ─── Kristall maydon parametrlari (turli geometriyalar)
  crystalField: [
    {
      geom: "Oktaedrik (Oh)",
      splitting: "eg (yuqori, +0.6Δo) + t₂g (past, −0.4Δo)",
      delta: "Δo (10Dq)",
      color: "text-blue-400",
      cfseFormulas: [
        { config: "d¹ (Ti³⁺)", cfse: "−0.4Δo", spin: "1/2", example: "[Ti(H₂O)₆]³⁺" },
        { config: "d² (V³⁺)", cfse: "−0.8Δo", spin: "1", example: "[V(H₂O)₆]³⁺" },
        { config: "d³ (Cr³⁺)", cfse: "−1.2Δo", spin: "3/2", example: "[Cr(H₂O)₆]³⁺" },
        { config: "d⁴ HS (Mn³⁺)", cfse: "−0.6Δo", spin: "2", example: "[Mn(H₂O)₆]³⁺ (Jan-Teller)" },
        { config: "d⁴ LS", cfse: "−1.6Δo + P", spin: "1", example: "Kuchli ligandlarda" },
        { config: "d⁵ HS (Mn²⁺)", cfse: "0", spin: "5/2", example: "[Mn(H₂O)₆]²⁺ (rangsiz)" },
        { config: "d⁵ LS (Fe³⁺)", cfse: "−2.0Δo + 2P", spin: "1/2", example: "[Fe(CN)₆]³⁻" },
        { config: "d⁶ HS (Fe²⁺)", cfse: "−0.4Δo", spin: "2", example: "[Fe(H₂O)₆]²⁺" },
        { config: "d⁶ LS (Co³⁺)", cfse: "−2.4Δo + 2P", spin: "0", example: "[Co(NH₃)₆]³⁺" },
        { config: "d⁷ HS (Co²⁺)", cfse: "−0.8Δo", spin: "3/2", example: "[Co(H₂O)₆]²⁺" },
        { config: "d⁷ LS", cfse: "−1.8Δo + P", spin: "1/2", example: "Kuchli ligandlarda" },
        { config: "d⁸ (Ni²⁺)", cfse: "−1.2Δo", spin: "1", example: "[Ni(H₂O)₆]²⁺" },
        { config: "d⁹ (Cu²⁺)", cfse: "−0.6Δo", spin: "1/2", example: "[Cu(H₂O)₆]²⁺ (Jan-Teller)" },
        { config: "d¹⁰ (Zn²⁺)", cfse: "0", spin: "0", example: "[Zn(H₂O)₆]²⁺ (rangsiz)" },
      ]
    },
    {
      geom: "Tetraedrik (Td)",
      splitting: "t₂ (yuqori, +0.4Δt) + e (past, −0.6Δt)",
      delta: "Δt ≈ (4/9)Δo",
      color: "text-green-400",
      cfseFormulas: [
        { config: "d² (Ti²⁺)", cfse: "−1.2Δt", spin: "1", example: "" },
        { config: "d⁵ HS (Mn²⁺)", cfse: "0", spin: "5/2", example: "" },
        { config: "d⁷ HS (Co²⁺)", cfse: "−1.2Δt", spin: "3/2", example: "[CoCl₄]²⁻ (to'q ko'k)" },
      ]
    },
    {
      geom: "Kvadrat tekislik (D₄ₕ)",
      splitting: "b₁g (dx²−y², eng yuqori) > b₂g (dxy) > a₁g (dz²) > eg (dxz,dyz)",
      delta: "Δsq ≈ 1.3Δo (dz² pastroq)",
      color: "text-orange-400",
      cfseFormulas: [
        { config: "d⁸ LS (Ni²⁺)", cfse: "Kuchli ligandlarda kvadrat", spin: "0", example: "[Ni(CN)₄]²⁻ (sariq)" },
        { config: "d⁸ (Pt²⁺, Pd²⁺)", cfse: "Har doim kvadrat", spin: "0", example: "sisplatin, [PtCl₄]²⁻" },
      ]
    },
  ],

  // ─── Spektroximik qator (Δo ni oshirish tartibi)
  spectrochemicalSeries: [
    { ligand: "I⁻", relative: 0.72, class: "Zaif maydon (π-donor)", color: "text-red-500", note: "Eng zaif — HS beradi" },
    { ligand: "Br⁻", relative: 0.76, class: "Zaif maydon (π-donor)", color: "text-red-400" },
    { ligand: "S²⁻", relative: 0.80, class: "π-donor" },
    { ligand: "SCN⁻ (S-bog'langan)", relative: 0.85, class: "π-donor" },
    { ligand: "Cl⁻", relative: 0.80, class: "Zaif maydon (π-donor)", color: "text-orange-400" },
    { ligand: "NO₃⁻", relative: 0.83, class: "π-donor" },
    { ligand: "N₃⁻", relative: 0.84, class: "π-donor" },
    { ligand: "F⁻", relative: 0.90, class: "π-donor, kuchsiz" },
    { ligand: "OH⁻", relative: 0.94, class: "Chegara" },
    { ligand: "C₂O₄²⁻ (ox²⁻)", relative: 0.99, class: "Xelat, chegara" },
    { ligand: "H₂O", relative: 1.00, class: "Standart (Δo₀)", color: "text-yellow-400", note: "Standart ligand" },
    { ligand: "NCS⁻ (N-bog'langan)", relative: 1.02, class: "Chegara" },
    { ligand: "py (piridin)", relative: 1.23, class: "Chegara, aromatik" },
    { ligand: "NH₃", relative: 1.25, class: "σ-donor", color: "text-green-400" },
    { ligand: "en (etilendiamin)", relative: 1.28, class: "Xelat, σ-donor" },
    { ligand: "bpy (2,2'-bipiridin)", relative: 1.33, class: "π-akseptor, xelat" },
    { ligand: "phen (fenantrolin)", relative: 1.34, class: "π-akseptor, xelat" },
    { ligand: "NO₂⁻ (N-bog'langan)", relative: 1.40, class: "π-akseptor" },
    { ligand: "PPh₃", relative: 1.42, class: "Kuchli π-akseptor" },
    { ligand: "CN⁻", relative: 1.70, class: "π-akseptor", color: "text-blue-400", note: "Eng kuchli neytral ligand" },
    { ligand: "CO", relative: 1.72, class: "Kuchli maydon (π-akseptor)", color: "text-blue-500", note: "Eng kuchli maydon ligand" },
  ],

  // ─── Nefelauksetik qator (β parametri — Racah B ning kamayishi)
  nephelauxeticSeries: [
    { ligand: "F⁻", beta: 0.90, class: "Kam yumshoq", note: "Kovalentlik past" },
    { ligand: "H₂O", beta: 1.00, class: "Standart", color: "text-yellow-400" },
    { ligand: "NH₃", beta: 0.86, class: "O'rta" },
    { ligand: "en", beta: 0.83, class: "O'rta" },
    { ligand: "ox²⁻", beta: 0.83, class: "O'rta" },
    { ligand: "NCS⁻", beta: 0.75, class: "Yumshoq" },
    { ligand: "Cl⁻", beta: 0.80, class: "O'rta" },
    { ligand: "CN⁻", beta: 0.72, class: "Yumshoq", color: "text-blue-400" },
    { ligand: "Br⁻", beta: 0.76, class: "Yumshoq" },
    { ligand: "I⁻", beta: 0.65, class: "Juda yumshoq", color: "text-red-400", note: "Eng kuchli kovalentlik" },
    { ligand: "S²⁻", beta: 0.55, class: "Juda yumshoq" },
  ],

  // ─── Beer-Lambert qonuni — asosiy tenglama va cheklovlar
  beerLambert: {
    equation: "A = ε · c · l",
    variables: [
      { symbol: "A", name: "Optik zichlik (Absorbance)", unit: "birliksiz", note: "A = log₁₀(I₀/I) — logaritmik" },
      { symbol: "ε", name: "Molyar yutilish koeffitsienti", unit: "L·mol⁻¹·sm⁻¹ (M⁻¹·sm⁻¹)", note: "Modda va λ ga bog'liq. Ba'zan «molar extinction coefficient» deyiladi" },
      { symbol: "c", name: "Kontsentratsiya", unit: "mol/L (M)", note: "Odatda 10⁻³ – 10⁻⁵ M oralig'ida" },
      { symbol: "l", name: "Kyuveta uzunligi", unit: "sm", note: "Standart kyuveta 1 sm; NIR uchun 5 sm" },
    ],
    limitations: [
      { name: "Yuqori kontsentratsiya (>0.01 M)", issue: "Molekulalar orasidagi ta'sirlashuv → chiziqli emas", fix: "Suyultirish yoki kalibrash egri chizig'ini standartga solish" },
      { name: "Monoxromatik nur", issue: "Polyxromatik nurda ε o'zgaruvchi bo'ladi", fix: "Yuqori sifatli spektrometr, tor slit" },
      { name: "Kimyoviy reaktsiya", issue: "Analit yorug'lik ta'sirida parchalanadi (fotokimyo)", fix: "Sekin skanerlash, past intensivlik" },
      { name: "Sochilish (scattering)", issue: "Loyqa yoki kolloid namunalarda A oshadi", fix: "Filtratsiya yoki DRS (diffuz reflektans) usuli" },
      { name: "Flüoressensiya", issue: "Yutilgan yorug'lik qayta chiqariladi", fix: "Filtr yoki cross-beam geometry" },
    ]
  },

  // ─── Tanlash qoidalari (elektron o'tishlar uchun)
  selectionRules: [
    {
      name: "Spin tanlash qoidasi",
      formula: "ΔS = 0",
      description: "Elektron o'tishda umumiy spin o'zgarmasligi kerak",
      allowed: "Bir xil ko'plikdan (multiplicity) bir xilga: singlet → singlet, triplet → triplet",
      forbidden: "Har xil ko'pliklar: singlet → triplet — taqiqlangan",
      example_allowed: "[Co(NH₃)₆]³⁺: ¹A₁g → ¹T₁g (475 nm, ε≈60) — ruxsat",
      example_forbidden: "[Mn(H₂O)₆]²⁺: ⁶A₁g → ⁴T₁g (525 nm, ε≈0.01) — taqiqlangan, shuning uchun deyarli rangsiz",
      note: "Ogʻir metallarda spin-orbital muhitlashish tufayli qoida qisman buziladi (Ru, Os)"
    },
    {
      name: "Laport (yoki parity) tanlash qoidasi",
      formula: "g ↮ g,  u ↮ u,  g ↔ u",
      description: "Markazsimmetrik molekulada g→g va u→u o'tishlar taqiqlangan",
      allowed: "gerade → ungerade yoki teskarisi",
      forbidden: "d → d (ikkalasi ham g) — taqiqlangan; p → f — taqiqlangan",
      example_allowed: "Tetraedrda (i markaz yo'q) — d–d ruxsat: [CoCl₄]²⁻ ε≈600",
      example_forbidden: "Oktaedrda d–d taqiqlangan: [Co(H₂O)₆]²⁺ ε≈5",
      note: "Vibronik bog'lanish (vibronic coupling) tufayli qisman ruxsat — shuning uchun oktaedr kompleks ε ~ 1–100"
    },
    {
      name: "Orbital tanlash qoidasi",
      formula: "Δl = ±1",
      description: "Elektronning orbital momenti bir birlikga o'zgarishi kerak",
      allowed: "s ↔ p,  p ↔ d,  d ↔ f",
      forbidden: "s ↔ d (Δl = 2) — taqiqlangan",
      example_allowed: "π → π* (Δl = 0 bu erda formal ruxsat, chunki simmetriya g↔u orqali)",
      example_forbidden: "d ↔ d formal Δl = 0 — taqiqlangan",
      note: "Bu Laport qoidasining boshqa ko'rinishi"
    },
  ],

  // ─── Muhim komplekslarda kuzatiladigan o'tishlar (Tanabe-Sugano izohi bilan)
  keyTransitions: [
    {
      complex: "[Ti(H₂O)₆]³⁺",
      config: "d¹",
      groundTerm: "²T₂g",
      transitions: [
        { symbol: "²T₂g → ²Eg", energy: 20300, lambda: 493, epsilon: 5, note: "Δo qiymati to'g'ridan-to'g'ri" },
      ],
      deltaOh: 20300,
      color: "binafsha",
      note: "d¹ — eng oddiy holat. Δo ni bevosita o'lchash mumkin. Yan-Teller tufayli asimmetrik polosa (~570 nm da yelka)"
    },
    {
      complex: "[V(H₂O)₆]³⁺",
      config: "d²",
      groundTerm: "³T₁g(F)",
      transitions: [
        { symbol: "³T₁g(F) → ³T₂g", energy: 17800, lambda: 562, epsilon: 6 },
        { symbol: "³T₁g(F) → ³T₁g(P)", energy: 25700, lambda: 389, epsilon: 8 },
        { symbol: "³T₁g(F) → ³A₂g", energy: 34500, lambda: 290, epsilon: "kichik", note: "Odatda LMCT bilan qoplangan" },
      ],
      deltaOh: 18500,
      B: 620,
      color: "yashil-havorang"
    },
    {
      complex: "[Cr(H₂O)₆]³⁺",
      config: "d³",
      groundTerm: "⁴A₂g",
      transitions: [
        { symbol: "⁴A₂g → ⁴T₂g", energy: 17400, lambda: 575, epsilon: 13, note: "Bu = Δo bevosita" },
        { symbol: "⁴A₂g → ⁴T₁g(F)", energy: 24500, lambda: 407, epsilon: 15 },
        { symbol: "⁴A₂g → ⁴T₁g(P)", energy: 37800, lambda: 265, epsilon: "kichik" },
      ],
      deltaOh: 17400,
      B: 725,
      color: "binafsha",
      note: "d³ — Δo aniqlashning eng ishonchli holati (birinchi polosa = Δo)"
    },
    {
      complex: "[Mn(H₂O)₆]²⁺",
      config: "d⁵ HS",
      groundTerm: "⁶A₁g",
      transitions: [
        { symbol: "⁶A₁g → ⁴T₁g", energy: 18900, lambda: 528, epsilon: 0.03, note: "Spin-taqiqlangan!" },
        { symbol: "⁶A₁g → ⁴T₂g", energy: 23100, lambda: 433, epsilon: 0.04 },
        { symbol: "⁶A₁g → ⁴A₁g/⁴Eg", energy: 25000, lambda: 400, epsilon: 0.05, note: "Ingichka polosa" },
      ],
      deltaOh: 7800,
      color: "juda och pushti (deyarli rangsiz)",
      note: "d⁵ HS — barcha o'tishlar HAM Laport HAM spin taqiqlangan → ε ~ 0.01–0.1. Shuning uchun MnSO₄ eritmasi deyarli rangsiz"
    },
    {
      complex: "[Co(NH₃)₆]³⁺",
      config: "d⁶ LS",
      groundTerm: "¹A₁g",
      transitions: [
        { symbol: "¹A₁g → ¹T₁g", energy: 21100, lambda: 475, epsilon: 60 },
        { symbol: "¹A₁g → ¹T₂g", energy: 29500, lambda: 340, epsilon: 55 },
      ],
      deltaOh: 22900,
      B: 615,
      color: "sariq-to'q sariq",
      note: "d⁶ LS — 2 ta polosa. Δo qiymati katta (>21000) → past-spin. Sariq rangda binafsha yutiladi"
    },
    {
      complex: "[Cu(H₂O)₆]²⁺",
      config: "d⁹",
      groundTerm: "²Eg (Yan-Teller cho'zilishi)",
      transitions: [
        { symbol: "²Eg → ²T₂g (keng)", energy: 12600, lambda: 794, epsilon: 12, note: "Yan-Teller tufayli asimmetrik" },
      ],
      deltaOh: 13000,
      color: "havorang",
      note: "d⁹ Yan-Teller — dz² pastda, dx²−y² yuqorida. Polosa keng, yelkali (760 va 850 nm)"
    },
  ],

  // ─── Kompleksning rangini tahlil qilish algoritmi
  colorAnalysis: [
    { step: 1, task: "λmax topish", method: "Yutilish spektrida eng katta cho'qqini aniqlash", result: "λ (nm) va ν̃ (cm⁻¹) qiymatlari" },
    { step: 2, task: "Yutilgan rangni aniqlash", method: "λmax ni rang aylanasidan topish", result: "Yutilgan rang" },
    { step: 3, task: "Ko'rinuvchi rangni bashorat qilish", method: "Yutilgan rangning to'ldiruvchisi", result: "Kompleksning ko'rinuvchi rangi" },
    { step: 4, task: "ε ni hisoblash", method: "Beer-Lambert qonuni: ε = A/(c·l)", result: "Molyar yutilish koeffitsienti" },
    { step: 5, task: "O'tish turini aniqlash", method: "ε qiymati bo'yicha: ε<100 → d–d; ε>1000 → CT", result: "d–d, LMCT yoki MLCT" },
    { step: 6, task: "Δo hisoblash", method: "d³: birinchi polosa = Δo; d⁶ LS: ¹A₁g → ¹T₁g", result: "Kristall maydon parametri" },
    { step: 7, task: "Racah B ni topish", method: "Tanabe-Sugano diagrammasidan ikki polosa nisbati bo'yicha", result: "Elektron-elektron itarish parametri" },
    { step: 8, task: "Nefelauksetik β = B/B₀", method: "B ni erkin ion B₀ bilan solishtirish", result: "Kovalentlik darajasi" },
  ],

  // ─── Spektrometr turlari va texnikalar
  instrumentTypes: [
    { name: "Bir nurli spektrofotometr (Single-beam)", pros: "Oddiy, arzon", cons: "Fon signali har safar alohida o'lchanadi", freq: "190–1100 nm", best: "O'quv laboratoriya, oddiy o'lchovlar" },
    { name: "Ikki nurli spektrofotometr (Double-beam)", pros: "Fon avtomatik chegirish, aniq natijalar", cons: "Qimmatroq, murakkab optika", freq: "190–1100 nm (yoki 3000 gacha)", best: "Ilmiy tadqiqotlar, kinetika" },
    { name: "Diode-array (DAD/PDA)", pros: "Tez skanerlash (0.1 s), butun spektr birdaniga", cons: "Rezolyutsiya biroz past", freq: "190–1100 nm", best: "HPLC bilan bog'liq, tezkor reaksiya" },
    { name: "DRS (Diffuz reflektans)", pros: "Qattiq namuna to'g'ridan-to'g'ri", cons: "Kubelka-Munk konversiyasi kerak", freq: "200–2500 nm", best: "Kukun, katalizator, mineral" },
    { name: "NIR spektrometr", pros: "Yaqin IQ (780–2500 nm)", cons: "Ekzotermik ta'sir, kombinatsion tebranishlar aralashadi", freq: "780–2500 nm", best: "f–f o'tishlar, ekzotermik ta'sir" },
    { name: "Fiber-optik zond", pros: "In situ o'lchov, reaktor ichida", cons: "Signalning uzatilishi cheklangan", freq: "200–2500 nm", best: "Sanoat monitoringi, biologik namunalar" },
  ],

  // ─── Namuna tayyorlash usullari
  samplePreparation: [
    { name: "Suvli eritma (H₂O)", solvent: "H₂O", cutoff: "190 nm", pros: "Universal, arzon", cons: "Suvsiz ligandlar erimasligi mumkin", best: "Ionli komplekslar" },
    { name: "Metanol / Etanol", solvent: "MeOH, EtOH", cutoff: "205, 210 nm", pros: "Polyar, ko'p komplekslar uchun", cons: "Ba'zan koordinatsion o'zaro ta'sir", best: "Neytral komplekslar" },
    { name: "Atsetonitril (MeCN)", solvent: "MeCN", cutoff: "190 nm", pros: "Aprotik, UB da shaffof", cons: "Zaif ligand sifatida bog'lanishi mumkin", best: "Kation komplekslar" },
    { name: "Diklorometan (DCM)", solvent: "CH₂Cl₂", cutoff: "233 nm", pros: "Aprotik, apolar", cons: "UB soha cheklangan", best: "Neytral, gidrofob komplekslar" },
    { name: "DMSO / DMF", solvent: "DMSO, DMF", cutoff: "268, 268 nm", pros: "Kuchli erituvchi", cons: "Ba'zan koordinatsion", best: "Erimaydigan komplekslar" },
    { name: "Nujol mull (qattiq)", solvent: "Nujol yog'i", cutoff: "—", pros: "Kristall shakli saqlanadi", cons: "Sochilish katta", best: "Erimaydigan qattiq komplekslar" },
    { name: "KBr diski (qattiq DRS)", solvent: "KBr", cutoff: "—", pros: "Kubelka-Munk", cons: "KBr gigroskopik", best: "Kukun katalizatorlar" },
  ],

  // ─── Muhim izomerlarni UB-Vis bilan aniqlash
  isomerDetection: [
    {
      name: "sis vs trans-[Co(en)₂Cl₂]⁺",
      isomers: [
        { type: "sis-[Co(en)₂Cl₂]⁺", color: "text-blue-400", symmetry: "C₂", bands: "527 (ε=87), 385 (ε=90) nm", diagnostic: "Ko'p (3-4) polosa, kengroq" },
        { type: "trans-[Co(en)₂Cl₂]⁺", color: "text-green-400", symmetry: "D₄ₕ", bands: "624 (ε=25), 452 (ε=30) nm", diagnostic: "Kam (2) polosa, batoxrom siljigan" },
      ],
      groupTheory: "Trans (D₄ₕ) → Yan-Teller cho'zilish → dz² va dx²−y² yorilishi → ¹T₁g holatining yorilishi kuzatiladi",
      biologicalNote: "Rang farqi: sis (binafsha), trans (yashil) — CIS-nomenklatura Verner tomonidan bashorat qilingan (1911, Nobel)"
    },
    {
      name: "sis vs trans-[Pt(NH₃)₂Cl₂]",
      isomers: [
        { type: "sis-[Pt(NH₃)₂Cl₂] (sisplatin)", color: "text-blue-400", symmetry: "C₂ᵥ", bands: "301, 365 nm (LMCT + d–d)", diagnostic: "Yumshoq zaif d–d yelkasi" },
        { type: "trans-[Pt(NH₃)₂Cl₂]", color: "text-orange-400", symmetry: "D₂ₕ", bands: "279, 331 nm", diagnostic: "Batoxrom siljish sis ga nisbatan" },
      ],
      groupTheory: "D₂ₕ da inversiya markazi bor → Laport taqiqlash → d–d intensivlik yanada past. Sisda C₂ᵥ (i yo'q) → d–d ruxsat",
      biologicalNote: "Sisplatin (sis) — DNK ga bog'lanadi, saraton davolash uchun ishlatiladi. Trans klinik faol emas."
    },
    {
      name: "Yuqori spin vs Past spin [Fe(H₂O)₆]²⁺ va [Fe(CN)₆]⁴⁻",
      isomers: [
        { type: "[Fe(H₂O)₆]²⁺ HS (d⁶)", color: "text-orange-400", symmetry: "Oh", bands: "962 nm (ε=1)", diagnostic: "NIR sohada zaif polosa, oq (rangsiz)" },
        { type: "[Fe(CN)₆]⁴⁻ LS (d⁶)", color: "text-yellow-400", symmetry: "Oh", bands: "270 nm (MLCT)", diagnostic: "Sariq — MLCT tufayli" },
      ],
      groupTheory: "HS: t₂g⁴eg² → ε past chunki t₂g→eg spin taqiqlanmagan lekin Laport taqiqlangan. LS: t₂g⁶eg⁰ → d–d yo'q, faqat MLCT ko'rinadi",
      biologicalNote: "Δo aylanishi: H₂O (Δo=10 400) < CN⁻ (Δo=33 800) → spin holatining almashinishi. Racah B: HS→LS o'tishida β pasayadi"
    },
  ],

  // ─── Racah parametrlari (elektron-elektron itarish)
  racahParameters: [
    { term: "B", name: "Racah B parametri", desc: "d–d elektron-elektron itarishning asosiy o'lchovi", value: "700–1100 cm⁻¹ (erkin ionda)", note: "Kompleksda B pasayadi (kovalentlik)" },
    { term: "C", name: "Racah C parametri", desc: "Spin tekislikka ko'ndalang o'zaro ta'sir", value: "~4B (odatda)", note: "Kam qo'llaniladi, Tanabe-Sugano da hisobga olinadi" },
    { term: "β (beta)", name: "Nefelauksetik nisbat", desc: "β = B(kompleks)/B(erkin ion)", value: "0.5–1.0", note: "β<1 — kovalentlik belgisi. Jorgensen tomonidan kiritilgan" },
    { term: "Δo", name: "Oktaedrik yoriqlanish", desc: "eg va t₂g orasidagi energiya farqi", value: "8 000 – 40 000 cm⁻¹", note: "Metall, oksidlanish darajasi va ligandga bog'liq" },
    { term: "10Dq", name: "Δo ning boshqa nomi", desc: "Tarixiy nom (D — dipol, q — kvadrupol)", value: "= Δo", note: "Bir xil, faqat notatsiya farqi" },
  ],
}

export default function UBVisSpektroskopiya() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [activeTransition, setActiveTransition] = useState(0)
  const [activeGeom, setActiveGeom] = useState(0)
  const [activeSelectionRule, setActiveSelectionRule] = useState(0)
  const [activeIsomer, setActiveIsomer] = useState(0)
  const [activeInstrument, setActiveInstrument] = useState(0)
  const [activeSolvent, setActiveSolvent] = useState(0)
  const [activeKeyTransition, setActiveKeyTransition] = useState(0)
  const [lambdaSlider, setLambdaSlider] = useState(500)
  
  // Beer-Lambert kalkulyator
  const [bl_c, setBlC] = useState(0.001)
  const [bl_eps, setBlEps] = useState(15000)
  const [bl_l, setBlL] = useState(1)

  const currentZone = useMemo(() => {
    const l = lambdaSlider
    if (l < 200) return { name: "Vakuum UB (VUV)", desc: "Havo ham yutadi — maxsus vakuumli spektrometr talab qiladi. σ→σ*, yadro elektronlari.", color: "text-purple-500", bgColor: "bg-purple-500" }
    if (l < 280) return { name: "Uzoq UB (Far UV)", desc: "π→π* o'tishlar (aromatik bpy, phen, phen), yuqori intensivlikdagi LMCT tasmalari.", color: "text-purple-400", bgColor: "bg-purple-400" }
    if (l < 400) return { name: "Yaqin UB (Near UV)", desc: "n→π* o'tishlar, MLCT tasmalari, ligand ichi o'tishlar. Ko'zga ko'rinmaydi lekin muhim.", color: "text-indigo-400", bgColor: "bg-indigo-400" }
    if (l < 450) return { name: "Ko'rinuvchi — binafsha", desc: "Yutilsa — sariq rang ko'rinadi. Ko'p Co(III), Cr(III) komplekslarida.", color: "text-violet-500", bgColor: "bg-violet-500" }
    if (l < 490) return { name: "Ko'rinuvchi — ko'k", desc: "Yutilsa — to'q sariq. [Ti(H₂O)₆]³⁺ ning tipik cho'qqisi.", color: "text-blue-500", bgColor: "bg-blue-500" }
    if (l < 560) return { name: "Ko'rinuvchi — yashil", desc: "Yutilsa — purpur/qizil. Ba'zi Cr(III), Ni(II) komplekslarida.", color: "text-green-500", bgColor: "bg-green-500" }
    if (l < 590) return { name: "Ko'rinuvchi — sariq", desc: "Yutilsa — ko'k. [Cu(H₂O)₆]²⁺ havorangi shu tufayli.", color: "text-yellow-400", bgColor: "bg-yellow-400" }
    if (l < 650) return { name: "Ko'rinuvchi — to'q sariq", desc: "Yutilsa — ko'k-yashil. [Ni(H₂O)₆]²⁺ yashil rangi.", color: "text-orange-500", bgColor: "bg-orange-500" }
    if (l < 780) return { name: "Ko'rinuvchi — qizil", desc: "Yutilsa — yashil. [Co(NH₃)₆]³⁺ sariq rangi asosan bunda.", color: "text-red-500", bgColor: "bg-red-500" }
    if (l < 1400) return { name: "Yaqin IQ (NIR)", desc: "Cu²⁺ va boshqa d⁹ komplekslar, f–f o'tishlar (lantanoidlar).", color: "text-red-700", bgColor: "bg-red-700" }
    return { name: "Uzoq NIR", desc: "Molekula tebranish oberton va kombinatsiyalari. Kompleks kimyoda kam qo'llaniladi.", color: "text-gray-500", bgColor: "bg-gray-500" }
  }, [lambdaSlider])

  const blResult = useMemo(() => {
    const A = bl_eps * bl_c * bl_l
    const T = Math.pow(10, -A) * 100  // Transmittans %
    return { A: A.toFixed(3), T: T.toFixed(2) }
  }, [bl_c, bl_eps, bl_l])

  // ν̃ (wavenumber) hisoblash: ν̃ = 10⁷/λ(nm)
  const wavenumber = useMemo(() => (10_000_000 / lambdaSlider).toFixed(0), [lambdaSlider])
  // Energiya (eV): E = 1240/λ(nm)
  const energyEV = useMemo(() => (1240 / lambdaSlider).toFixed(2), [lambdaSlider])
  // Energiya (kJ/mol): E = 119627/λ(nm)
  const energyKJ = useMemo(() => (119627 / lambdaSlider).toFixed(0), [lambdaSlider])

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* ═══════════════ OGOHLANTIRISH MODALI ═══════════════ */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-pink-950 border-2 border-pink-500 rounded-2xl p-6 max-w-3xl w-full">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl"></span> UB-VIS SPEKTROSKOPIYA — ELEKTRON O'TISHLARNING KVANT MEXANIKASI
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">Ultrabinafsha va ko'rinadigan spektroskopiya</strong> — kompleks birikmalar
              rangi va elektron strukturasini o'rganishning <strong className="text-yellow-300">eng asosiy usuli</strong>.
              Bu usul yordamida <strong className="text-yellow-300">Δo (kristall maydon yoriqlanishi),
              d–d va zaryad ko'chish (CT) o'tishlari, spin holati va oksidlanish darajasi</strong> aniqlanadi.
            </p>

            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2"> Fizik asos</div>
                  <div className="text-purple-200">Kvantlangan elektron energiyalari:</div>
                  <div className="text-purple-200 mt-1">E = hν = hc/λ = h·c·ν̃</div>
                  <div className="text-purple-200 mt-1">Foton yutilishi elektronni ↑ holatiga o'tkazadi</div>
                </div>
                <div>
                  <div className="text-pink-400 font-bold mb-2"> Tanlash qoidalari</div>
                  <div className="text-purple-200">Spin: ΔS = 0</div>
                  <div className="text-purple-200">Laport: g ↮ g (markazsimmetrikda)</div>
                  <div className="text-purple-200">Orbital: Δl = ±1</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong>⚠ Diqqat:</strong> d–d o'tishlar Laport-taqiqlangan bo'lgani uchun ε ~ 1–100 (past intensivlik).
                CT (LMCT/MLCT) o'tishlar ruxsat etilgan → ε ~ 1000–50 000 (juda kuchli).
                Rangning haqiqiy manbasini aniqlash uchun ε qiymatiga qarash zarur!
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani ochish
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="border-b border-[var(--v3-chiziq)] sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs mb-1.5 text-[var(--v3-xira)] flex-wrap">
              <Link href="/ilmiy" className="hover:text-[var(--v3-matn)]">Ilmiy Bo{"'"}lim</Link>
              <span>›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-[var(--v3-matn)]">Tahlil usullari</Link>
              <span>›</span>
              <span className="text-[var(--v3-urgu)] font-semibold">UB-Vis Spektroskopiya</span>
            </nav>

            <h1 className="text-xl md:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="nurlar" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>UB-Vis (Ultrabinafsha-Ko{"'"}rinuvchi) Spektroskopiyasi</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ilmiy/tahlil/ub-vis/birikmalar"
              className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold flex items-center gap-1.5"
            >
              <span>Birikmalar Bazasini Ko{"'"}rish</span>
              <Ikon nom="ong" olcham={13} />
            </Link>
            <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════ 0. BIRIKMALAR KARTASI ═══════════════ */}
        <Link
          href="/ilmiy/tahlil/ub-vis/birikmalar"
          className="group block bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6 hover:bg-pink-900/60 hover:border-pink-500/60 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                Birikmalarning UB-Vis tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning UB-Vis spektrlari, λ<sub>max</sub>, ε koeffitsienti, Δ<sub>o</sub> hisoblash,
                d–d va CT o'tishlar tayinlash, Tanabe-Sugano diagrammalari va rang sababi bo'yicha to'liq tahlil.
              </p>
            </div>
            <div className="text-3xl text-pink-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Birikmalar katalogi</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">d–d o'tishlar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Δo hisoblash</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Racah B, β</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Tanabe-Sugano</span>
          </div>
        </Link>

        {/* ═══════════════ 1. NAZARIY ASOS — KVANT MEXANIKASI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📚</span> 1. Nazariy asos — elektron o'tishlarning kvant mexanikasi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: P. Atkins — Physical Chemistry, A. B. P. Lever — Inorganic Electronic Spectroscopy</p>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">UB-Vis (Ultrabinafsha–ko'rinadigan) spektroskopiya</strong> —
              molekulaning elektron holatlari orasidagi <strong className="text-yellow-400">kvantlangan energiya
              o'tishlarini</strong> o'lchashga asoslangan spektroskopik usul. Molekulaga UB-Vis diapazondagi (200–780 nm)
              elektromagnit nurlanish yuborilganda, foton energiyasi elektron darajalari orasidagi <em>ΔE</em> farqiga
              to'g'ri kelsa, molekula fotonni yutadi va elektron yuqori (qo'zg'algan) elektron holatga o'tadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-2 text-sm"> Asosiy tenglama</h3>
              <div className="text-yellow-300 text-lg font-mono text-center py-3">E = hν = hc/λ</div>
              <div className="text-xs text-purple-300 space-y-1">
                <div><strong>h</strong> — Plank doimiysi (6.626×10⁻³⁴ J·s)</div>
                <div><strong>c</strong> — yorug'lik tezligi (3×10⁸ m/s)</div>
                <div><strong>λ</strong> — to'lqin uzunligi (nm)</div>
                <div><strong>ν</strong> — chastota (Hz)</div>
              </div>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-2 text-sm"> Beer-Lambert qonuni</h3>
              <div className="text-yellow-300 text-lg font-mono text-center py-3">A = ε · c · l</div>
              <div className="text-xs text-purple-300 space-y-1">
                <div><strong>A</strong> — optik zichlik</div>
                <div><strong>ε</strong> — molyar koeffitsient (M⁻¹·sm⁻¹)</div>
                <div><strong>c</strong> — konsentratsiya (mol/L)</div>
                <div><strong>l</strong> — kyuveta uzunligi (sm)</div>
              </div>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-2 text-sm"> Tanlash qoidalari</h3>
              <div className="text-yellow-300 text-sm font-mono text-center py-3">ΔS = 0<br/>g ↔ u<br/>Δl = ±1</div>
              <div className="text-xs text-purple-300 space-y-1">
                <div><strong>Spin</strong>: ko'plik o'zgarmasin</div>
                <div><strong>Laport</strong>: parity o'zgarsin</div>
                <div><strong>Orbital</strong>: l bir birlik</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-950/40 border border-blue-700/30 rounded-xl p-5">
            <h4 className="text-blue-300 font-bold mb-3 text-sm">🌟 UB-Vis spektroskopiya nima uchun juda muhim?</h4>
            <ul className="text-xs text-purple-200 space-y-2 list-disc list-inside">
              <li><strong className="text-yellow-300">Rang manbai:</strong> Kompleks birikmalarning ranglari aynan UB-Vis sohadagi yutilishlar natijasi</li>
              <li><strong className="text-yellow-300">Δo (kristall maydon parametri):</strong> Ligand kuchining eng aniq o'lchovi</li>
              <li><strong className="text-yellow-300">Oksidlanish darajasi:</strong> [Fe(CN)₆]³⁻ (qizil) vs [Fe(CN)₆]⁴⁻ (sariq) — MLCT vs LMCT farqi</li>
              <li><strong className="text-yellow-300">Spin holati:</strong> HS vs LS ni polosalar soni va energiyasi bo'yicha aniqlash</li>
              <li><strong className="text-yellow-300">Geometriya:</strong> Oh, Td, D₄ₕ farqlari polosalar tuzilishida namoyon</li>
              <li><strong className="text-yellow-300">Kimyoviy analitika:</strong> Kalibrash egri chiziqlari yordamida ionlar konsentratsiyasini aniqlash</li>
              <li><strong className="text-yellow-300">Kinetika:</strong> A(t) egri chiziqlaridan reaksiya tezligi</li>
            </ul>
          </div>
        </div>

        {/* ═══════════════ 2. INTERAKTIV λ SLIDER — TO'LQIN UZUNLIGI ZONALARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🎨</span> 2. Interaktiv: to'lqin uzunligi va rang zonalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">λ sliderni harakatlantiring — energiya, chastota va rangni ko'ring</p>

          <div className="bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 h-4 rounded-full mb-4"></div>
          
          <input
            type="range"
            min="180"
            max="1400"
            value={lambdaSlider}
            onChange={(e) => setLambdaSlider(Number(e.target.value))}
            className="w-full h-3 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-center">
            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">To'lqin uzunligi (λ)</div>
              <div className="text-yellow-300 text-2xl font-bold font-mono">{lambdaSlider} <span className="text-sm">nm</span></div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">To'lqin soni (ν̃)</div>
              <div className="text-cyan-300 text-2xl font-bold font-mono">{wavenumber} <span className="text-sm">cm⁻¹</span></div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Energiya</div>
              <div className="text-green-300 text-2xl font-bold font-mono">{energyEV} <span className="text-sm">eV</span></div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Energiya</div>
              <div className="text-orange-300 text-2xl font-bold font-mono">{energyKJ} <span className="text-sm">kJ/mol</span></div>
            </div>
          </div>

          <div className={`mt-6 rounded-xl p-5 border ${currentZone.color.replace('text-', 'border-').replace('-400', '-500/50').replace('-500', '-500/50').replace('-700', '-500/50')} bg-purple-950/40`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${currentZone.bgColor} shadow-lg`}></div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${currentZone.color}`}>{currentZone.name}</h3>
                <p className="text-purple-300 text-sm mt-1">{currentZone.desc}</p>
              </div>
            </div>
          </div>

          {/* Rang aylanasi jadvali */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🎨</span> Yutilgan va ko'rinuvchi rang (to'ldiruvchi ranglar)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                    <th className="px-3 py-2 text-left text-purple-400">λ (nm)</th>
                    <th className="px-3 py-2 text-left text-purple-400">Yutilgan rang</th>
                    <th className="px-3 py-2 text-left text-purple-400">Ko'rinuvchi rang</th>
                    <th className="px-3 py-2 text-left text-purple-400">Namuna kompleks</th>
                  </tr>
                </thead>
                <tbody>
                  {UBVIS_DATA.colorWheel.map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                      <td className="px-3 py-2 font-mono text-yellow-300">{row.lambdaRange}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded" style={{background: row.hex}}></div>
                          <span className="text-purple-200">{row.absorbed}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded" style={{background: row.perceivedHex}}></div>
                          <span className="text-purple-200">{row.perceived}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-purple-300 italic">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══════════════ 3. ELEKTRON O'TISH TURLARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 3. Elektron o'tishlarning asosiy turlari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">d–d, LMCT, MLCT, LLCT, IL va f–f o'tishlar — kompleks birikmalar spektrining asosi</p>

          {/* Tab kontrollari */}
          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.transitionTypes.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTransition(i)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTransition === i
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {t.symbol}
              </button>
            ))}
          </div>

          {/* Active transition detali */}
          {UBVIS_DATA.transitionTypes[activeTransition] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className={`text-2xl font-bold ${UBVIS_DATA.transitionTypes[activeTransition].color}`}>
                  {UBVIS_DATA.transitionTypes[activeTransition].name}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-purple-900/40 rounded-lg p-3 border border-[var(--v3-chiziq)]">
                  <div className="text-xs text-purple-400 mb-1">Energiya</div>
                  <div className="text-sm text-yellow-300 font-mono">{UBVIS_DATA.transitionTypes[activeTransition].energy}</div>
                </div>
                <div className="bg-purple-900/40 rounded-lg p-3 border border-[var(--v3-chiziq)]">
                  <div className="text-xs text-purple-400 mb-1">To'lqin uzunligi</div>
                  <div className="text-sm text-cyan-300 font-mono">{UBVIS_DATA.transitionTypes[activeTransition].lambda}</div>
                </div>
                <div className="bg-purple-900/40 rounded-lg p-3 border border-[var(--v3-chiziq)]">
                  <div className="text-xs text-purple-400 mb-1">Molyar ε</div>
                  <div className="text-sm text-green-300 font-mono">{UBVIS_DATA.transitionTypes[activeTransition].epsilon}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1">Tanlash qoidasi:</div>
                <div className="text-sm text-purple-200">{UBVIS_DATA.transitionTypes[activeTransition].selectionRule}</div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-3">
                <div className="text-xs text-yellow-400 font-bold mb-1">Namuna:</div>
                <div className="text-sm text-purple-200 italic">{UBVIS_DATA.transitionTypes[activeTransition].example}</div>
              </div>

              <div className="bg-purple-900/20 border border-[var(--v3-chiziq)] rounded-lg p-4">
                <div className="text-xs text-pink-400 font-bold mb-2">🎓 Nazariy izoh:</div>
                <div className="text-sm text-purple-200 leading-relaxed">{UBVIS_DATA.transitionTypes[activeTransition].note}</div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 4. KRISTALL MAYDON NAZARIYASI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">💎</span> 4. Kristall maydon nazariyasi (CFT)
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: H. Bethe (1929), J. H. Van Vleck (1935) — Ligand Field Theory</p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-yellow-400">Kristall maydon nazariyasi (CFT)</strong> — ligandlarni negativ nuqta zaryadlar
              deb hisoblab, ular hosil qilgan elektrostatik maydonning metall d-orbitallariga ta'sirini o'rganadi.
              Bu maydon <strong className="text-yellow-400">d-orbitallar yorilishiga</strong> (splitting) olib keladi va
              <strong className="text-yellow-400"> rangning asosiy manbai</strong> bo'ladi.
            </p>
          </div>

          {/* Geometry tab */}
          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.crystalField.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveGeom(i)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeGeom === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {g.geom}
              </button>
            ))}
          </div>

          {UBVIS_DATA.crystalField[activeGeom] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <h3 className={`text-xl font-bold ${UBVIS_DATA.crystalField[activeGeom].color} mb-3`}>
                {UBVIS_DATA.crystalField[activeGeom].geom}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-900/40 rounded-lg p-4 border border-[var(--v3-chiziq)]">
                  <div className="text-xs text-purple-400 mb-1">Yorilish sxemasi:</div>
                  <div className="text-sm text-yellow-300 font-mono">{UBVIS_DATA.crystalField[activeGeom].splitting}</div>
                </div>
                <div className="bg-purple-900/40 rounded-lg p-4 border border-[var(--v3-chiziq)]">
                  <div className="text-xs text-purple-400 mb-1">Yoriqlanish parametri:</div>
                  <div className="text-sm text-cyan-300 font-mono">{UBVIS_DATA.crystalField[activeGeom].delta}</div>
                </div>
              </div>

              <h4 className="text-white font-bold text-sm mb-2">CFSE (Kristall maydon barqarorlashuv energiyasi):</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                      <th className="px-3 py-2 text-left text-purple-400">d-konfiguratsiya</th>
                      <th className="px-3 py-2 text-left text-purple-400">CFSE</th>
                      <th className="px-3 py-2 text-left text-purple-400">Spin (S)</th>
                      <th className="px-3 py-2 text-left text-purple-400">Namuna</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UBVIS_DATA.crystalField[activeGeom].cfseFormulas.map((r, i) => (
                      <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                        <td className="px-3 py-2 text-yellow-300 font-mono">{r.config}</td>
                        <td className="px-3 py-2 text-cyan-300 font-mono">{r.cfse}</td>
                        <td className="px-3 py-2 text-green-300 font-mono">{r.spin}</td>
                        <td className="px-3 py-2 text-purple-200 italic">{r.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 5. TANLASH QOIDALARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 5. Elektron o'tishlar uchun tanlash qoidalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: F. A. Cotton — Chemical Applications of Group Theory</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.selectionRules.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveSelectionRule(i)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSelectionRule === i
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {UBVIS_DATA.selectionRules[activeSelectionRule] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">{UBVIS_DATA.selectionRules[activeSelectionRule].name}</h3>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="text-yellow-300 text-2xl font-mono text-center">
                  {UBVIS_DATA.selectionRules[activeSelectionRule].formula}
                </div>
              </div>
              <p className="text-purple-200 text-sm mb-4">{UBVIS_DATA.selectionRules[activeSelectionRule].description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                  <div className="text-green-400 font-bold text-xs mb-2">✅ RUXSAT ETILGAN</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.selectionRules[activeSelectionRule].allowed}</div>
                  <div className="text-xs text-green-300 mt-2 italic">Namuna: {UBVIS_DATA.selectionRules[activeSelectionRule].example_allowed}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                  <div className="text-red-400 font-bold text-xs mb-2">❌ TAQIQLANGAN</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.selectionRules[activeSelectionRule].forbidden}</div>
                  <div className="text-xs text-red-300 mt-2 italic">Namuna: {UBVIS_DATA.selectionRules[activeSelectionRule].example_forbidden}</div>
                </div>
              </div>
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <div className="text-blue-400 font-bold text-xs mb-1"> Muhim izoh:</div>
                <div className="text-sm text-purple-200">{UBVIS_DATA.selectionRules[activeSelectionRule].note}</div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 6. BEER-LAMBERT KALKULYATORI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🧮</span> 6. Interaktiv: Beer-Lambert kalkulyatori
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Optik zichlik (A) va transmittans (T%) ni real vaqtda hisoblang</p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <div className="text-yellow-300 text-2xl font-mono text-center">A = ε · c · l</div>
            <div className="text-purple-300 text-xs text-center mt-2">Beer-Lambert-Bouguer qonuni</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">ε (molyar koeffitsient, M⁻¹·sm⁻¹)</label>
              <input
                type="range"
                min="1"
                max="50000"
                step="10"
                value={bl_eps}
                onChange={(e) => setBlEps(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="text-yellow-300 text-2xl font-mono text-center mt-2">{bl_eps.toLocaleString()}</div>
              <div className="text-xs text-purple-400 mt-2 text-center">
                {bl_eps < 100 ? "d–d (past)" : bl_eps < 1000 ? "spin-ruxsat d–d" : bl_eps < 10000 ? "CT (o'rta)" : "CT (kuchli)"}
              </div>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">c (konsentratsiya, mol/L)</label>
              <input
                type="range"
                min="0.00001"
                max="0.1"
                step="0.00001"
                value={bl_c}
                onChange={(e) => setBlC(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="text-cyan-300 text-2xl font-mono text-center mt-2">{bl_c.toExponential(2)}</div>
              <div className="text-xs text-purple-400 mt-2 text-center">
                {bl_c < 0.0001 ? "Juda suyultirilgan" : bl_c < 0.001 ? "Standart oralig'i" : bl_c < 0.01 ? "O'rta konsentratsiya" : "Yuqori — chiziqli emas"}
              </div>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">l (kyuveta, sm)</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={bl_l}
                onChange={(e) => setBlL(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{bl_l.toFixed(1)}</div>
              <div className="text-xs text-purple-400 mt-2 text-center">
                {bl_l < 0.5 ? "Yupqa kyuveta" : bl_l < 1.5 ? "Standart 1 sm" : "Uzun kyuveta (NIR)"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-2 border-pink-500/50 rounded-xl p-6 text-center">
              <div className="text-xs text-pink-400 mb-2">Optik zichlik (Absorbance)</div>
              <div className="text-yellow-300 text-4xl font-mono font-bold">A = {blResult.A}</div>
              <div className="text-xs text-purple-300 mt-2">
                {parseFloat(blResult.A) < 0.1 ? "Juda past — kontsentratsiyani oshiring" :
                 parseFloat(blResult.A) < 0.8 ? "Optimal oralig'ida ✓" :
                 parseFloat(blResult.A) < 1.5 ? "Yuqori — chiziqlilik yo'qolishi mumkin" :
                 "Juda yuqori — namunani suyultiring"}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500/50 rounded-xl p-6 text-center">
              <div className="text-xs text-blue-400 mb-2">Transmittans</div>
              <div className="text-cyan-300 text-4xl font-mono font-bold">T = {blResult.T}%</div>
              <div className="text-xs text-purple-300 mt-2">
                T = 10⁻ᴬ × 100% (yorug'lik namunadan o'tgan qismi)
              </div>
            </div>
          </div>

          <div className="mt-6 bg-red-900/20 border border-red-700/30 rounded-xl p-5">
            <h4 className="text-red-400 font-bold text-sm mb-3">⚠ Beer-Lambert qonuni cheklovlari:</h4>
            <div className="space-y-2">
              {UBVIS_DATA.beerLambert.limitations.map((lim, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs bg-red-950/20 rounded p-3">
                  <div className="text-red-300 font-semibold">{lim.name}</div>
                  <div className="text-purple-200">{lim.issue}</div>
                  <div className="text-green-300">→ {lim.fix}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ 7. SPEKTROXIMIK QATOR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 7. Spektroximik qator (ligandlarning Δo qiymati bo'yicha)
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Ligandning maydon kuchini o'lchash tartibi — Tsuchida (1938) ilk taklif qilgan</p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="text-yellow-300 text-sm font-mono text-center">
              I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ &lt; Cl⁻ &lt; NO₃⁻ &lt; F⁻ &lt; OH⁻ &lt; ox²⁻ &lt; H₂O &lt; NCS⁻ &lt; py &lt; NH₃ &lt; en &lt; bpy &lt; phen &lt; NO₂⁻ &lt; PPh₃ &lt; CN⁻ &lt; CO
            </div>
            <div className="text-purple-300 text-xs text-center mt-2">Chapdan o'ngga — Δo qiymati o'sadi</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UBVIS_DATA.spectrochemicalSeries.map((l, i) => (
              <div key={i} className={`bg-purple-950/40 rounded-lg p-3 border ${l.color ? l.color.replace('text-', 'border-').replace('-400', '-500/50').replace('-500', '-500/50') : 'border-[var(--v3-chiziq)]'} flex items-center justify-between`}>
                <div>
                  <div className={`text-sm font-bold ${l.color || 'text-purple-200'}`}>{l.ligand}</div>
                  <div className="text-xs text-purple-400">{l.class}</div>
                  {l.note && <div className="text-xs text-yellow-300 italic mt-1">{l.note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-xs text-purple-400">Δo/Δo(H₂O)</div>
                  <div className="text-cyan-300 font-mono text-lg">{l.relative}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold text-sm mb-2"> Spektroximik qatordan xulosalar:</h4>
            <ul className="text-xs text-purple-200 space-y-1 list-disc list-inside">
              <li><strong className="text-red-300">Zaif maydon</strong> (I⁻, Br⁻, Cl⁻): π-donor ligandlar → HS (yuqori spin) beradi</li>
              <li><strong className="text-yellow-300">O'rta maydon</strong> (H₂O, NH₃): standart σ-donor</li>
              <li><strong className="text-blue-300">Kuchli maydon</strong> (CN⁻, CO): π-akseptor → LS (past spin) beradi</li>
              <li>Ligandning π-akseptorlik xususiyati Δo ni ko'p oshiradi (back-donation)</li>
              <li>Δo shuningdek metallga bog'liq: 3d &lt; 4d &lt; 5d va oksidlanish darajasi ↑ → Δo ↑</li>
            </ul>
          </div>
        </div>

        {/* ═══════════════ 8. NEFELAUKSETIK QATOR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔄</span> 8. Nefelauksetik qator (kovalentlik o'lchovi)
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: C. K. Jørgensen — β = B(kompleks)/B₀(erkin ion)</p>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-yellow-300">Nefelauksetik samara</strong> (nephelauxetic — «bulut kengaytiruvchi») —
              koordinatsiya natijasida d-elektronlar bulutining kengayishi va Racah <strong>B</strong> parametrining
              pasayishi. Bu <strong className="text-yellow-300">metall-ligand bog'ining kovalentlik</strong> darajasini
              ko'rsatadi: β qanchalik kichik bo'lsa, bog' shunchalik kovalent.
            </p>
            <div className="text-yellow-300 text-xl font-mono text-center mt-3">β = B(kompleks) / B(erkin ion)</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UBVIS_DATA.nephelauxeticSeries.map((l, i) => (
              <div key={i} className="bg-purple-950/40 rounded-lg p-3 border border-[var(--v3-chiziq)] flex items-center justify-between">
                <div>
                  <div className={`text-sm font-bold ${l.color || 'text-purple-200'}`}>{l.ligand}</div>
                  <div className="text-xs text-purple-400">{l.class}</div>
                  {l.note && <div className="text-xs text-yellow-300 italic mt-1">{l.note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-xs text-purple-400">β</div>
                  <div className={`font-mono text-lg ${l.beta < 0.7 ? 'text-red-400' : l.beta < 0.85 ? 'text-yellow-300' : 'text-green-300'}`}>
                    {l.beta.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-xs">
              <strong>Xulosa:</strong> β &lt; 1 — kovalentlik belgisi. Yumshoq ligandlar (I⁻, S²⁻) bog'da elektronlar
              baham ko'radi → B pasayadi. Qattiq ligandlar (F⁻, H₂O) esa asosan ionli bog' beradi → β ~ 1.
            </p>
          </div>
        </div>

        {/* ═══════════════ 9. MUHIM KOMPLEKSLARDA O'TISHLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 9. Muhim komplekslar spektrlari va terminlar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Yerdagi holat va qo'zg'algan holatlar — Russell-Saunders terminlar</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.keyTransitions.map((k, i) => (
              <button
                key={i}
                onClick={() => setActiveKeyTransition(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeKeyTransition === i
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {k.complex}
              </button>
            ))}
          </div>

          {UBVIS_DATA.keyTransitions[activeKeyTransition] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-yellow-300 font-mono">
                  {UBVIS_DATA.keyTransitions[activeKeyTransition].complex}
                </h3>
                <span className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-mono">
                  {UBVIS_DATA.keyTransitions[activeKeyTransition].config}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-[var(--v3-chiziq)] text-purple-300 text-xs font-mono">
                  Yer holati: {UBVIS_DATA.keyTransitions[activeKeyTransition].groundTerm}
                </span>
                <span className="px-3 py-1 rounded-full bg-pink-900/40 border border-pink-700/50 text-pink-300 text-xs">
                  Rangi: {UBVIS_DATA.keyTransitions[activeKeyTransition].color}
                </span>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                      <th className="px-3 py-2 text-left text-purple-400">O'tish</th>
                      <th className="px-3 py-2 text-left text-purple-400">Energiya (cm⁻¹)</th>
                      <th className="px-3 py-2 text-left text-purple-400">λ (nm)</th>
                      <th className="px-3 py-2 text-left text-purple-400">ε (M⁻¹·sm⁻¹)</th>
                      <th className="px-3 py-2 text-left text-purple-400">Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UBVIS_DATA.keyTransitions[activeKeyTransition].transitions.map((t, i) => (
                      <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                        <td className="px-3 py-2 text-yellow-300 font-mono">{t.symbol}</td>
                        <td className="px-3 py-2 text-cyan-300 font-mono">{t.energy.toLocaleString()}</td>
                        <td className="px-3 py-2 text-green-300 font-mono">{t.lambda}</td>
                        <td className="px-3 py-2 text-orange-300 font-mono">{t.epsilon}</td>
                        <td className="px-3 py-2 text-purple-300 italic">{t.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                  <div className="text-xs text-blue-400 mb-1">Δo (kristall maydon)</div>
                  <div className="text-cyan-300 font-mono">{UBVIS_DATA.keyTransitions[activeKeyTransition].deltaOh?.toLocaleString() || "—"} cm⁻¹</div>
                </div>
                {UBVIS_DATA.keyTransitions[activeKeyTransition].B && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                    <div className="text-xs text-green-400 mb-1">Racah B</div>
                    <div className="text-green-300 font-mono">{UBVIS_DATA.keyTransitions[activeKeyTransition].B} cm⁻¹</div>
                  </div>
                )}
                <div className="bg-pink-900/20 border border-pink-700/30 rounded-lg p-3">
                  <div className="text-xs text-pink-400 mb-1">Rang</div>
                  <div className="text-pink-300">{UBVIS_DATA.keyTransitions[activeKeyTransition].color}</div>
                </div>
              </div>

              {UBVIS_DATA.keyTransitions[activeKeyTransition].note && (
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                  <div className="text-xs text-yellow-400 font-bold mb-1">📝 Ilmiy izoh:</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.keyTransitions[activeKeyTransition].note}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════ 10. IZOMERLARNI UB-VIS BILAN ANIQLASH ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔀</span> 10. Izomerlarni UB-Vis spektroskopiya bilan aniqlash
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">sis/trans, HS/LS, geometrik izomerlar — spektral farqlar</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.isomerDetection.map((iso, i) => (
              <button
                key={i}
                onClick={() => setActiveIsomer(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeIsomer === i
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {iso.name}
              </button>
            ))}
          </div>

          {UBVIS_DATA.isomerDetection[activeIsomer] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{UBVIS_DATA.isomerDetection[activeIsomer].name}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {UBVIS_DATA.isomerDetection[activeIsomer].isomers.map((iso, i) => (
                  <div key={i} className={`bg-purple-900/30 border ${iso.color.replace('text-', 'border-').replace('-400', '-500/50')} rounded-lg p-4`}>
                    <div className={`font-bold ${iso.color} text-sm mb-2`}>{iso.type}</div>
                    <div className="text-xs text-purple-300 space-y-1">
                      <div><strong>Simmetriya:</strong> {iso.symmetry}</div>
                      <div><strong>Yutilish polosalari:</strong> {iso.bands}</div>
                      <div className="mt-2 pt-2 border-t border-[var(--v3-chiziq)]">
                        <strong className="text-yellow-300">Diagnostika:</strong> {iso.diagnostic}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1">🎓 Guruh nazariyasi:</div>
                <div className="text-sm text-purple-200">{UBVIS_DATA.isomerDetection[activeIsomer].groupTheory}</div>
              </div>

              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <div className="text-xs text-green-400 font-bold mb-1">🧬 Amaliy ahamiyat:</div>
                <div className="text-sm text-purple-200">{UBVIS_DATA.isomerDetection[activeIsomer].biologicalNote}</div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 11. RACAH PARAMETRLARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🧬</span> 11. Racah parametrlari va termlar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: G. Racah — Phys. Rev. (1943)</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                  <th className="px-3 py-2 text-left text-purple-400">Belgi</th>
                  <th className="px-3 py-2 text-left text-purple-400">Nomi</th>
                  <th className="px-3 py-2 text-left text-purple-400">Ta'rifi</th>
                  <th className="px-3 py-2 text-left text-purple-400">Qiymati</th>
                  <th className="px-3 py-2 text-left text-purple-400">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {UBVIS_DATA.racahParameters.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                    <td className="px-3 py-2 text-yellow-300 font-mono font-bold">{r.term}</td>
                    <td className="px-3 py-2 text-white">{r.name}</td>
                    <td className="px-3 py-2 text-purple-200">{r.desc}</td>
                    <td className="px-3 py-2 text-cyan-300 font-mono">{r.value}</td>
                    <td className="px-3 py-2 text-purple-300 italic">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
            <h4 className="text-white font-bold text-sm mb-3"> Russell-Saunders termlar (LS bog'lanish):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-yellow-300 font-mono mb-2">²ˢ⁺¹L<sub>J</sub></div>
                <ul className="text-purple-200 space-y-1 list-disc list-inside">
                  <li><strong>2S+1</strong> — ko'plik (multiplicity)</li>
                  <li><strong>L</strong> — umumiy orbital momenti (S, P, D, F, G, H...)</li>
                  <li><strong>J</strong> — umumiy moment (L+S, L+S-1, ..., |L-S|)</li>
                </ul>
              </div>
              <div>
                <div className="text-cyan-300 font-mono mb-2">Namunalar:</div>
                <ul className="text-purple-200 space-y-1 list-disc list-inside">
                  <li><strong>d¹</strong> (Ti³⁺): ²D → ²T₂g + ²Eg (Oh da)</li>
                  <li><strong>d²</strong> (V³⁺): ³F + ³P + ¹G + ¹D + ¹S</li>
                  <li><strong>d³</strong> (Cr³⁺): ⁴F + ⁴P + termlar</li>
                  <li><strong>d⁵</strong> (Mn²⁺): ⁶S — noodatiy!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 12. TANABE-SUGANO DIAGRAMMALARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📈</span> 12. Tanabe-Sugano diagrammalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: Y. Tanabe, S. Sugano — J. Phys. Soc. Japan (1954)</p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-yellow-300">Tanabe-Sugano diagrammalari</strong> — kompleks birikmalarning
              elektron holatlari energiyasini (E/B) ligand maydon kuchi (Δo/B) ga nisbatan chizmasi. Bu diagrammalar
              yordamida <strong className="text-yellow-300">Δo, B va spin holatini</strong> aynan aniqlash mumkin.
              Har bir d-konfiguratsiya uchun alohida diagramma mavjud (d¹ dan d⁹ gacha).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h4 className="text-pink-400 font-bold mb-3 text-sm"> Diagramma tuzilishi</h4>
              <ul className="text-xs text-purple-200 space-y-2 list-disc list-inside">
                <li><strong>X o'qi:</strong> Δo/B — ligand maydonining kuchi</li>
                <li><strong>Y o'qi:</strong> E/B — termlar energiyasi</li>
                <li><strong>Chiziqlar:</strong> Har bir electron term (⁴A₂g, ⁴T₁g...)</li>
                <li><strong>Vertikal chiziq:</strong> HS ↔ LS o'tish nuqtasi (d⁴–d⁷ uchun)</li>
                <li><strong>Chapdan o'ngga:</strong> Δo o'sishi (I⁻ → CN⁻)</li>
              </ul>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h4 className="text-pink-400 font-bold mb-3 text-sm"> Ishlatish tartibi</h4>
              <ol className="text-xs text-purple-200 space-y-2 list-decimal list-inside">
                <li>Kompleks d-konfiguratsiyasini aniqlang</li>
                <li>Spektrdan 2 ta polosa energiyasini o'lchang (ν₁, ν₂)</li>
                <li>ν₂/ν₁ nisbatini hisoblang</li>
                <li>Diagrammadan bu nisbatga mos keladigan Δo/B qiymatini toping</li>
                <li>Δo va B ni alohida hisoblang</li>
                <li>β = B/B₀ orqali kovalentlikni baholang</li>
              </ol>
            </div>
          </div>

          {/* SVG Tanabe-Sugano d³ misoli */}
          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
            <h4 className="text-white font-bold mb-3 text-sm">📉 Namuna: d³ (Cr³⁺) Tanabe-Sugano diagrammasi</h4>
            <svg viewBox="0 0 500 300" className="w-full h-auto bg-purple-950/40 rounded-lg">
              {/* Grid */}
              <line x1="50" y1="270" x2="480" y2="270" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="270" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              
              {/* Y axis labels */}
              <text x="30" y="30" fill="#c4b5fd" fontSize="10" textAnchor="end">70</text>
              <text x="30" y="90" fill="#c4b5fd" fontSize="10" textAnchor="end">50</text>
              <text x="30" y="150" fill="#c4b5fd" fontSize="10" textAnchor="end">30</text>
              <text x="30" y="210" fill="#c4b5fd" fontSize="10" textAnchor="end">10</text>
              <text x="30" y="275" fill="#c4b5fd" fontSize="10" textAnchor="end">0</text>
              <text x="15" y="150" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 150)">E/B</text>
              
              {/* X axis labels */}
              <text x="50" y="290" fill="#c4b5fd" fontSize="10" textAnchor="middle">0</text>
              <text x="150" y="290" fill="#c4b5fd" fontSize="10" textAnchor="middle">10</text>
              <text x="250" y="290" fill="#c4b5fd" fontSize="10" textAnchor="middle">20</text>
              <text x="350" y="290" fill="#c4b5fd" fontSize="10" textAnchor="middle">30</text>
              <text x="450" y="290" fill="#c4b5fd" fontSize="10" textAnchor="middle">40</text>
              <text x="265" y="295" fill="#e9d5ff" fontSize="11" textAnchor="middle">Δo/B</text>

              {/* ⁴A₂g (ground state, horizontal at 0) */}
              <line x1="50" y1="270" x2="480" y2="270" stroke="#22d3ee" strokeWidth="2"/>
              <text x="470" y="265" fill="#22d3ee" fontSize="10" textAnchor="end">⁴A₂g</text>

              {/* ⁴T₂g (linear increase) */}
              <line x1="50" y1="270" x2="480" y2="90" stroke="#f472b6" strokeWidth="2"/>
              <text x="470" y="85" fill="#f472b6" fontSize="10" textAnchor="end">⁴T₂g</text>

              {/* ⁴T₁g(F) (parabolic) */}
              <path d="M 50 250 Q 265 130 480 60" stroke="#fbbf24" strokeWidth="2" fill="none"/>
              <text x="470" y="55" fill="#fbbf24" fontSize="10" textAnchor="end">⁴T₁g(F)</text>

              {/* ⁴T₁g(P) (flat then curve) */}
              <path d="M 50 100 Q 265 90 480 50" stroke="#a78bfa" strokeWidth="2" fill="none"/>
              <text x="470" y="45" fill="#a78bfa" fontSize="10" textAnchor="end">⁴T₁g(P)</text>

              {/* [Cr(H2O)6]3+ marker point */}
              <circle cx="240" cy="180" r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
              <text x="250" y="175" fill="#fbbf24" fontSize="9">[Cr(H₂O)₆]³⁺</text>
              
              {/* Title */}
              <text x="265" y="15" fill="#e9d5ff" fontSize="12" textAnchor="middle" fontWeight="bold">d³ Tanabe-Sugano diagrammasi (soddalashtirilgan)</text>
            </svg>
            <p className="text-xs text-purple-400 mt-3 italic text-center">
              Bu soddalashtirilgan sxema. To'liq diagrammalar Lever kitobida (Inorganic Electronic Spectroscopy) mavjud.
            </p>
          </div>
        </div>

        {/* ═══════════════ 13. SPEKTROMETR TURLARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 13. Spektrometr turlari va texnikalar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Amaliy o'lchov usullari va asboblar</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {UBVIS_DATA.instrumentTypes.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveInstrument(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeInstrument === i
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {UBVIS_DATA.instrumentTypes[activeInstrument] && (
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
              <h3 className="text-lg font-bold text-cyan-300 mb-3">{UBVIS_DATA.instrumentTypes[activeInstrument].name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                  <div className="text-xs text-green-400 font-bold mb-1">✅ Afzalliklari:</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.instrumentTypes[activeInstrument].pros}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-bold mb-1">❌ Kamchiliklari:</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.instrumentTypes[activeInstrument].cons}</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                  <div className="text-xs text-blue-400 font-bold mb-1">📡 Ish diapazoni:</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.instrumentTypes[activeInstrument].freq}</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
                  <div className="text-xs text-yellow-400 font-bold mb-1"> Optimal qo'llanilishi:</div>
                  <div className="text-sm text-purple-200">{UBVIS_DATA.instrumentTypes[activeInstrument].best}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 14. NAMUNA TAYYORLASH — ERITUVCHILAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 14. Namuna tayyorlash — erituvchilar va texnikalar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Har bir erituvchining UB cutoff qiymati va qo'llanilish sohasi</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                  <th className="px-3 py-2 text-left text-purple-400">Usul</th>
                  <th className="px-3 py-2 text-left text-purple-400">Erituvchi</th>
                  <th className="px-3 py-2 text-left text-purple-400">UB cutoff</th>
                  <th className="px-3 py-2 text-left text-purple-400">Afzalliklari</th>
                  <th className="px-3 py-2 text-left text-purple-400">Kamchiliklari</th>
                  <th className="px-3 py-2 text-left text-purple-400">Optimal</th>
                </tr>
              </thead>
              <tbody>
                {UBVIS_DATA.samplePreparation.map((s, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                    <td className="px-3 py-2 text-yellow-300 font-semibold">{s.name}</td>
                    <td className="px-3 py-2 text-cyan-300 font-mono">{s.solvent}</td>
                    <td className="px-3 py-2 text-green-300 font-mono">{s.cutoff}</td>
                    <td className="px-3 py-2 text-purple-200">{s.pros}</td>
                    <td className="px-3 py-2 text-red-300">{s.cons}</td>
                    <td className="px-3 py-2 text-purple-300 italic">{s.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-xs">
              <strong>⚠ Muhim:</strong> Erituvchining o'zi UB da yutilishi mumkin (cutoff qiymati). Kompleksni o'rganish
              uchun cutoff qiymatidan katta λ da o'lchash zarur. Masalan, DMSO (cutoff 268 nm) da 260 nm dagi polosani
              o'lchay olmaysiz.
            </p>
          </div>
        </div>

        {/* ═══════════════ 15. RANGNI TAHLIL QILISH ALGORITMI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 15. Kompleksning rangini tahlil qilish algoritmi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Spektrdan rang manbaigacha — bosqichma-bosqich yondashuv</p>

          <div className="space-y-3">
            {UBVIS_DATA.colorAnalysis.map((step, i) => (
              <div key={i} className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="text-yellow-300 font-bold text-sm mb-1">{step.task}</div>
                  <div className="text-xs text-purple-300 mb-2"><strong>Usul:</strong> {step.method}</div>
                  <div className="text-xs text-green-300"><strong>Natija:</strong> {step.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 16. TARIXIY XRONOLOGIYA ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📜</span> 16. UB-Vis spektroskopiyaning tarixiy xronologiyasi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Nazariyaning shakllanish bosqichlari</p>

          <div className="space-y-3">
            {[
              { year: "1666", who: "I. Newton", event: "Prizma bilan oq yorug'likni spektrga ajratish — spektroskopiyaning ilk urug'i" },
              { year: "1802", who: "W. H. Wollaston", event: "Quyosh spektrida qora chiziqlar (Fraunhofer chiziqlari)" },
              { year: "1852", who: "A. Beer", event: "Beer qonuni: A ∝ konsentratsiya" },
              { year: "1893", who: "A. Werner", event: "Koordinatsion kimyoning asosi, izomerlar rangi bilan farqi" },
              { year: "1929", who: "H. Bethe", event: "Kristall maydon nazariyasi (Ann. Physik)" },
              { year: "1935", who: "J. H. Van Vleck", event: "Ligand maydon nazariyasi — MO va CFT ni birlashtirish" },
              { year: "1938", who: "R. Tsuchida", event: "Spektroximik qatorning kashfi" },
              { year: "1943", who: "G. Racah", event: "Racah parametrlari (A, B, C) — d-elektron itarish nazariyasi" },
              { year: "1954", who: "Y. Tanabe, S. Sugano", event: "Tanabe-Sugano diagrammalari (J. Phys. Soc. Japan)" },
              { year: "1962", who: "C. K. Jørgensen", event: "Nefelauksetik seriya, β parametr, absorption spectra kitobi" },
              { year: "1966", who: "R. G. Pearson", event: "HSAB nazariyasi — LMCT/MLCT qattiq/yumshoq ligandlar" },
              { year: "1980-", who: "Zamonaviy", event: "TDDFT hisoblashlar, ultra-tez UB-Vis (fs)" },
            ].map((h, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-3 flex gap-4 items-center">
                <div className="text-yellow-300 font-mono font-bold text-sm w-16">{h.year}</div>
                <div className="text-pink-400 font-semibold text-sm w-32 md:w-40">{h.who}</div>
                <div className="text-purple-200 text-xs flex-1">{h.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 17. TAQQOSLASH: UB-VIS vs BOSHQA USULLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">⚖️</span> 17. UB-Vis vs boshqa spektroskopik usullar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Qaysi usul qanday holatda eng informativ?</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-950/60 border-b border-[var(--v3-chiziq)]">
                  <th className="px-3 py-2 text-left text-purple-400">Usul</th>
                  <th className="px-3 py-2 text-left text-purple-400">O'lchagani</th>
                  <th className="px-3 py-2 text-left text-purple-400">Diapazon</th>
                  <th className="px-3 py-2 text-left text-purple-400">Ma'lumot</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-800/30 bg-pink-900/10">
                  <td className="px-3 py-2 text-pink-300 font-bold">UB-Vis</td>
                  <td className="px-3 py-2 text-purple-200">Elektron o'tishlar</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">200–780 nm</td>
                  <td className="px-3 py-2 text-purple-300">Δo, spin, oksidlanish darajasi, CT</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-blue-300 font-bold">IQ (IR)</td>
                  <td className="px-3 py-2 text-purple-200">Tebranish o'tishlari</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">4000–200 cm⁻¹</td>
                  <td className="px-3 py-2 text-purple-300">Bog' turlari, ligand denticity, geometriya</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-green-300 font-bold">Raman</td>
                  <td className="px-3 py-2 text-purple-200">Qutblanuvchanlik o'zgarishi</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">4000–50 cm⁻¹</td>
                  <td className="px-3 py-2 text-purple-300">IQ ga to'ldiruvchi, simmetrik modalar</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-yellow-300 font-bold">NMR</td>
                  <td className="px-3 py-2 text-purple-200">Yadro spin holatlari</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">Radio to'lqin</td>
                  <td className="px-3 py-2 text-purple-300">Ligandlar strukturasi, dinamika</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-red-300 font-bold">EPR/ESR</td>
                  <td className="px-3 py-2 text-purple-200">Toq elektron</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">Mikroto'lqin</td>
                  <td className="px-3 py-2 text-purple-300">Paramagnit ionlar, radikal, g-tenzor</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-orange-300 font-bold">CD</td>
                  <td className="px-3 py-2 text-purple-200">Chiral yutilish</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">200–700 nm</td>
                  <td className="px-3 py-2 text-purple-300">Enantiomerlar (Δ/Λ), sekundar struktura</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="px-3 py-2 text-cyan-300 font-bold">XRD</td>
                  <td className="px-3 py-2 text-purple-200">Kristall panjara</td>
                  <td className="px-3 py-2 text-cyan-300 font-mono">Rentgen</td>
                  <td className="px-3 py-2 text-purple-300">Aniq bog' uzunligi, burchak, geometriya</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <p className="text-xs text-purple-200">
              <strong className="text-blue-300">Xulosa:</strong> UB-Vis — kompleks birikma <strong>rangi, Δo, oksidlanish
              darajasi, spin holati, CT tasmalar</strong> uchun eng aniq va tez usul. Ammo aniq geometriya (XRD) yoki
              ligand strukturasi (NMR, IQ) uchun to'ldiruvchi usullar zarur.
            </p>
          </div>
        </div>

        {/* ═══════════════ 18. ILMIY MANBALAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📚</span> 18. Ilmiy manbalar (bibliografiya)
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Bu sahifa quyidagi klassik va zamonaviy manbalarga asoslangan</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { author: "A. B. P. Lever", title: "Inorganic Electronic Spectroscopy (2nd ed.)", year: "1984", publisher: "Elsevier", tag: "Asosiy manba" },
              { author: "F. A. Cotton", title: "Chemical Applications of Group Theory (3rd ed.)", year: "1990", publisher: "Wiley", tag: "Guruh nazariyasi" },
              { author: "C. J. Ballhausen", title: "Introduction to Ligand Field Theory", year: "1962", publisher: "McGraw-Hill", tag: "LFT klassik" },
              { author: "H. Bethe", title: "Termaufspaltung in Kristallen (Ann. Physik)", year: "1929", publisher: "—", tag: "Kristall maydon" },
              { author: "J. H. Van Vleck", title: "The Theory of Electric and Magnetic Susceptibilities", year: "1932", publisher: "Oxford", tag: "LFT asos" },
              { author: "Y. Tanabe, S. Sugano", title: "J. Phys. Soc. Japan, 9, 753", year: "1954", publisher: "—", tag: "T-S diagrammalari" },
              { author: "G. Racah", title: "Phys. Rev., 62, 438", year: "1942", publisher: "—", tag: "Racah B, C parametrlari" },
              { author: "C. K. Jørgensen", title: "Absorption Spectra and Chemical Bonding in Complexes", year: "1962", publisher: "Pergamon", tag: "Nefelauksetik samara" },
              { author: "Housecroft & Sharpe", title: "Inorganic Chemistry (4th ed.)", year: "2012", publisher: "Pearson", tag: "Umumiy darslik" },
              { author: "P. Atkins", title: "Physical Chemistry (Electronic Spectroscopy)", year: "2018", publisher: "Oxford", tag: "Fizik asos" },
              { author: "D. Sutton", title: "Electronic Spectra of Transition Metal Complexes", year: "1968", publisher: "McGraw-Hill", tag: "Klassik amaliy" },
              { author: "R. G. Pearson", title: "J. Am. Chem. Soc., 85, 3533 (HSAB)", year: "1963", publisher: "—", tag: "Qattiq/yumshoq" },
            ].map((ref, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-yellow-300 font-bold text-sm">{ref.author}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-900/40 border border-pink-700/50 text-pink-300">{ref.tag}</span>
                </div>
                <div className="text-purple-200 text-xs italic mb-1">{ref.title}</div>
                <div className="text-purple-400 text-xs">
                  <span className="text-cyan-300">{ref.year}</span> • {ref.publisher}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 19. KEYINGI QADAM — BIRIKMALAR KATALOGI ═══════════════ */}
        <Link
          href="/ilmiy/tahlil/ub-vis/birikmalar"
          className="group block bg-gradient-to-r from-pink-900/60 via-purple-900/60 to-blue-900/60 border-2 border-pink-500/50 rounded-2xl p-8 hover:border-pink-400 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20"
        >
          <div className="flex items-center gap-6">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🚀</div>
            <div className="flex-1">
              <div className="text-xs text-pink-300 uppercase tracking-wider mb-2">Keyingi qadam</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                Birikmalar UB-Vis tahliliga o'ting
              </h3>
              <p className="text-purple-200 text-sm">
                Nazariyani amalda qo'llash — 12+ ta klassik kompleks uchun to'liq spektral tahlil, λ<sub>max</sub>,
                ε, Δo va rang izohlari bilan
              </p>
            </div>
            <div className="text-4xl text-pink-400 group-hover:translate-x-2 transition-transform">→</div>
          </div>
        </Link>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <div className="text-center py-8 text-purple-500 text-xs">
          <p>© jdakimyo.uz — Koordinatsion birikmalar kimyosi</p>
          <p className="mt-1">UB-Vis spektroskopiya nazariy sahifasi • Diyor tomonidan tayyorlangan</p>
        </div>

      </section>
    </div>
  )
}
