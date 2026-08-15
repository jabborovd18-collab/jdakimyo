"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS SPEKTROSKOPIYA — ASOSIY NAZARIY VA EKSPERIMENTAL SAHIFA (V3 ENSIKLOPEDIYA)
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
//            spektroximik va nefelauksetik qatorlar, rang nazariyasi, Beer-Lambert,
//            Gauss dekonvolyutsiya simulyatori va 19 ta chuqur ilmiy bo'lim.
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
      color: "text-emerald-400",
      cfseFormulas: [
        { config: "d² (Ti²⁺)", cfse: "−1.2Δt", spin: "1", example: "Zaif ligandlarda" },
        { config: "d⁵ HS (Mn²⁺)", cfse: "0", spin: "5/2", example: "[MnCl₄]²⁻ (och sariq)" },
        { config: "d⁷ HS (Co²⁺)", cfse: "−1.2Δt", spin: "3/2", example: "[CoCl₄]²⁻ (to'q ko'k, ε=600)" },
      ]
    },
    {
      geom: "Kvadrat tekislik (D₄ₕ)",
      splitting: "b₁g (dx²−y², eng yuqori) > b₂g (dxy) > a₁g (dz²) > eg (dxz,dyz)",
      delta: "Δsq ≈ 1.3Δo (dz² pastroq)",
      color: "text-amber-400",
      cfseFormulas: [
        { config: "d⁸ LS (Ni²⁺)", cfse: "Kuchli ligandlarda kvadrat", spin: "0", example: "[Ni(CN)₄]²⁻ (sariq)" },
        { config: "d⁸ (Pt²⁺, Pd²⁺)", cfse: "Har doim kvadrat", spin: "0", example: "sisplatin, [PtCl₄]²⁻" },
      ]
    },
  ],

  // ─── Tanlash qoidalari
  selectionRules: [
    {
      name: "1. Laport (Parity) qoidasi",
      formula: "g ↮ g  va  u ↮ u  (markazsimmetrik guruhlarda)",
      description: "Markazsimmetriyaga ega komplekslarda (masalan, oktaedr Oh yoki tekis kvadrat D4h) faqat juftlik (parity) o'zgaradigan o'tishlar ruxsat etiladi: g ↔ u. d-orbitallar juft (g) bo'lgani uchun barcha d→d o'tishlar (g→g) qat'iy taqiqlangan!",
      allowed: "p → d (u ↔ g), d → p, LMCT, MLCT",
      forbidden: "d → d (g → g) markazsimmetrik Oh da",
      example_allowed: "MnO₄⁻ da O(2p) → Mn(3d) zaryad ko'chishi: ε ≈ 2500 M⁻¹·sm⁻¹",
      example_forbidden: "[Ti(H₂O)₆]³⁺ da ²T₂g → ²Eg: ε ≈ 5 M⁻¹·sm⁻¹",
      note: "Vibronik bog'lanish (asimetrik tebranishlar orqali markazsimmetriyaning vaqtinchalik yo'qolishi) d-d o'tishlariga qisman ruxsat beradi (ε ~ 1–100)."
    },
    {
      name: "2. Spin tanlash qoidasi",
      formula: "ΔS = 0  va  Δ(2S+1) = 0",
      description: "Elektron o'tish vaqtida umumiy spin kvant soni S o'zgarmasligi shart. Singlet yer holatidan faqat singlet holatga, triplet holatdan esa faqat triplet holatga o'tish ruxsat etilgan. Spin almashinuvi (singlet ↔ triplet) juda qattiq taqiqlangan.",
      allowed: "¹A₁g → ¹T₁g (ΔS=0), ⁴A₂g → ⁴T₁g (ΔS=0)",
      forbidden: "¹A₁g → ³T₁g (ΔS=1), ⁶A₁g → ⁴T₁g (ΔS=−1)",
      example_allowed: "[Co(NH₃)₆]³⁺: ¹A₁g → ¹T₁g (475 nm, ε=60)",
      example_forbidden: "[Mn(H₂O)₆]²⁺ (d⁵ HS, ⁶A₁g): barcha o'tishlar spin-taqiqlangan (ε ≈ 0.01–0.05, deyarli rangsiz)",
      note: "Og'ir elementlarda (4d, 5d metallar) kuchli spin-orbit bog'lanishi tufayli spin taqiqi qisman yengillashadi."
    },
    {
      name: "3. Orbital tanlash qoidasi",
      formula: "Δl = ±1",
      description: "Yorug'lik kvanti (foton) o'zining 1 ga teng burchak momentiga ega. Shuning uchun foton yutilganda orbital kvant soni aniq 1 birlikka o'zgarishi kerak: s → p (0→1), p → d (1→2), d → f (2→3). d → d da esa Δl = 0 bo'lgani uchun elektr dipol nurlanish taqiqlanadi.",
      allowed: "s ↔ p, p ↔ d, d ↔ f",
      forbidden: "s ↔ s, p ↔ p, d ↔ d, f ↔ f",
      example_allowed: "Atom spektrlarida 3s → 3p",
      example_forbidden: "Metall komplekslarda 3d → 3d",
      note: "Tetraedrik (Td) komplekslarda markazsimmetriya yo'q (inversiya markazi i yo'q), 3d va 4p orbitallari qisman aralashadi → d-d o'tishlar Oh ga nisbatan 10–100 marta kuchliroq bo'ladi (ε ≈ 100–1000)."
    }
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
    { ligand: "H₂O", relative: 1.00, class: "Etalon standart (1.00)", color: "text-blue-400", note: "Etalon ligand" },
    { ligand: "NCS⁻ (N-bog'langan)", relative: 1.02, class: "σ-donor" },
    { ligand: "CH₃CN (MeCN)", relative: 1.22, class: "σ-donor" },
    { ligand: "Py (piridin)", relative: 1.23, class: "σ-donor, zaif π-akseptor" },
    { ligand: "NH₃", relative: 1.25, class: "Kuchli σ-donor", color: "text-green-400", note: "Standart amin" },
    { ligand: "en (etilendiamin)", relative: 1.28, class: "Xelat amin", color: "text-green-400" },
    { ligand: "bpy (2,2'-bipiridin)", relative: 1.33, class: "Xelat π-akseptor", color: "text-teal-400" },
    { ligand: "phen (1,10-fenantrolin)", relative: 1.34, class: "Xelat π-akseptor", color: "text-teal-400" },
    { ligand: "NO₂⁻ (nitro, N-bog')", relative: 1.40, class: "Kuchli π-akseptor", color: "text-cyan-400" },
    { ligand: "PPh₃", relative: 1.45, class: "Fosfin π-akseptor" },
    { ligand: "CN⁻", relative: 1.70, class: "Juda kuchli π-akseptor", color: "text-blue-400", note: "Har doim LS beradi" },
    { ligand: "CO", relative: 1.95, class: "Eng kuchli π-akseptor", color: "text-purple-400", note: "Maksimal Δo qiymati" },
  ],

  // ─── Nefelauksetik qator
  nephelauxeticSeries: [
    { ligand: "F⁻", beta: 1.00, class: "Minimal kovalentlik (deyarli sof ionli)", color: "text-green-400", note: "Erkin ionga eng yaqin" },
    { ligand: "H₂O", beta: 0.98, class: "Kuchsiz kovalentlik", color: "text-green-400" },
    { ligand: "urea (mochevina)", beta: 0.95, class: "O-donor" },
    { ligand: "NH₃", beta: 0.93, class: "O'rtacha kovalentlik", color: "text-yellow-400" },
    { ligand: "en (etilendiamin)", beta: 0.90, class: "Xelat amin" },
    { ligand: "ox²⁻ (oksalat)", beta: 0.88, class: "Xelat kislorodli" },
    { ligand: "Cl⁻", beta: 0.84, class: "Sezilarli kovalentlik", color: "text-yellow-400" },
    { ligand: "CN⁻", beta: 0.83, class: "Kuchli kovalentlik (π-bog'lanish)", color: "text-orange-400" },
    { ligand: "Br⁻", beta: 0.77, class: "Kuchli kovalentlik", color: "text-orange-400" },
    { ligand: "N₃⁻ (azid)", beta: 0.75, class: "Yumshoq ligand" },
    { ligand: "I⁻", beta: 0.70, class: "Juda kuchli kovalentlik", color: "text-red-400", note: "Katta qutblanuvchanlik" },
    { ligand: "S²⁻ / dtc⁻ (ditiokarbamat)", beta: 0.60, class: "Maksimal kovalentlik", color: "text-red-500", note: "Eng kichik Racah B parametri" },
  ],

  // ─── Muhim komplekslar spektrlari
  keyTransitions: [
    {
      complex: "[Ti(H₂O)₆]³⁺",
      config: "d¹",
      groundTerm: "²T₂g",
      transitions: [
        { symbol: "²T₂g → ²Eg", energy: 20300, lambda: 493, epsilon: 5, note: "Asimmetrik cho'qqi (Yan-Teller effekti)" },
      ],
      deltaOh: 20300,
      color: "binafsha-qizil (purpur)",
      note: "Klassik d¹ namunasi. ²Eg qo'zg'algan holatida Yan-Teller buzilishi tufayli polosa ikkiga ajralgan yelkaga ega (~20300 va 17500 cm⁻¹)."
    },
    {
      complex: "[Cr(H₂O)₆]³⁺",
      config: "d³",
      groundTerm: "⁴A₂g",
      transitions: [
        { symbol: "⁴A₂g → ⁴T₂g (ν₁)", energy: 17400, lambda: 575, epsilon: 13, note: "ν₁ to'g'ridan-to'g'ri = Δo" },
        { symbol: "⁴A₂g → ⁴T₁g(F) (ν₂)", energy: 24600, lambda: 407, epsilon: 15, note: "Racah B ni hisoblash uchun" },
        { symbol: "⁴A₂g → ⁴T₁g(P) (ν₃)", energy: 37800, lambda: 265, epsilon: 5, note: "UB sohada, LMCT ostida" },
      ],
      deltaOh: 17400,
      B: 725,
      color: "binafsha-havorang",
      note: "d³ uchun birinchi polosa (ν₁) to'g'ridan-to'g'ri Δo ga teng! Ikki polosa (ν₁, ν₂) dan Racah B = 725 cm⁻¹ hisoblanadi (erkin Cr³⁺ da B₀ = 918 cm⁻¹, demak β = 0.79)."
    },
    {
      complex: "[Mn(H₂O)₆]²⁺",
      config: "d⁵ HS",
      groundTerm: "⁶A₁g",
      transitions: [
        { symbol: "⁶A₁g → ⁴T₁g", energy: 18900, lambda: 529, epsilon: 0.02 },
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
        { symbol: "¹A₁g → ¹T₁g (ν₁)", energy: 21053, lambda: 475, epsilon: 60 },
        { symbol: "¹A₁g → ¹T₂g (ν₂)", energy: 29412, lambda: 340, epsilon: 55 },
      ],
      deltaOh: 22900,
      B: 615,
      color: "sariq-to'q sariq (luteo)",
      note: "d⁶ LS — 2 ta d-d polosa. Δo qiymati katta (22 900 cm⁻¹ > P = 21 000 cm⁻¹) → past-spin, diamagnit. 475 nm da binafsha yutiladi → ko'rinuvchi rang sariq."
    },
    {
      complex: "[Cu(H₂O)₆]²⁺",
      config: "d⁹",
      groundTerm: "²Eg (Yan-Teller cho'zilishi)",
      transitions: [
        { symbol: "²B₁g → ²A₁g, ²B₂g, ²Eg", energy: 12600, lambda: 794, epsilon: 12, note: "Yan-Teller tufayli asimmetrik keng polosa" },
      ],
      deltaOh: 12600,
      color: "havorang (moviy)",
      note: "d⁹ Yan-Teller — dz² pastda, dx²−y² yuqorida. Polosa juda keng, asimmetrik yelkali (760 va 850 nm)."
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
        { type: "sis-[Co(en)₂Cl₂]⁺", color: "text-violet-400", symmetry: "C₂", bands: "527 (ε=87), 385 (ε=90) nm", diagnostic: "Ko'p (3-4) polosa, kengroq — binafsha rang" },
        { type: "trans-[Co(en)₂Cl₂]⁺", color: "text-emerald-400", symmetry: "D₄ₕ", bands: "624 (ε=25), 452 (ε=30) nm", diagnostic: "Kam (2) polosa, batoxrom siljigan — yashil rang" },
      ],
      groupTheory: "Trans (D₄ₕ) da inversiya markazi bor → Yan-Teller cho'zilish va dz² / dx²−y² yorilishi → ¹T₁g holati ²Eg va ²A₂g ga ajraladi.",
      biologicalNote: "Rang farqi: sis (binafsha), trans (yashil) — stereokimyoviy izomeriya Alfred Werner tomonidan 1893-yilda kashf qilingan."
    },
    {
      name: "sis vs trans-[Pt(NH₃)₂Cl₂]",
      isomers: [
        { type: "sis-[Pt(NH₃)₂Cl₂] (sisplatin)", color: "text-blue-400", symmetry: "C₂ᵥ", bands: "301, 365 nm (LMCT + d–d)", diagnostic: "Yumshoq d–d yelkasi, C2v da Laport qisman ruxsat" },
        { type: "trans-[Pt(NH₃)₂Cl₂]", color: "text-amber-400", symmetry: "D₂ₕ", bands: "279, 331 nm", diagnostic: "Batoxrom siljish, D2h inversiya markazi tufayli d–d juda kuchsiz" },
      ],
      groupTheory: "D₂ₕ da inversiya markazi (i) mavjud → Laport taqiqi qat'iy. Sisda esa C₂ᵥ (i yo'q) → orbital aralashuvi yuqoriroq.",
      biologicalNote: "Sisplatin — saratonga qarshi eng mashhur preparat (DNK ning qo'shni guanin asoslarini biriktiradi). Trans-izomer esa nofaol."
    },
    {
      name: "Yuqori spin vs Past spin [Fe(H₂O)₆]²⁺ va [Fe(CN)₆]⁴⁻",
      isomers: [
        { type: "[Fe(H₂O)₆]²⁺ HS (d⁶)", color: "text-amber-400", symmetry: "Oh", bands: "962 nm (ε=1.1)", diagnostic: "NIR sohada zaif polosa (⁵T₂g → ⁵Eg), eritmasi deyarli rangsiz" },
        { type: "[Fe(CN)₆]⁴⁻ LS (d⁶)", color: "text-yellow-400", symmetry: "Oh", bands: "270 nm (MLCT, ε≈4000)", diagnostic: "Sariq rang — kuchli MLCT o'tishi tufayli" },
      ],
      groupTheory: "HS: t₂g⁴eg² → bitta d–d polosa NIR da. LS: t₂g⁶eg⁰ → d–d o'tishlar yuqori energiyada, ko'rinadigan sohada MLCT ustunlik qiladi.",
      biologicalNote: "Δo qiymatlari: H₂O da 10 400 cm⁻¹ < P (17 600 cm⁻¹) bo'lgani uchun HS; CN⁻ da esa 33 800 cm⁻¹ > P bo'lgani uchun LS."
    },
  ],

  // ─── Racah parametrlari
  racahParameters: [
    { term: "B", name: "Racah B parametri", desc: "d–d elektron-elektron itarishning asosiy o'lchovi", value: "700–1100 cm⁻¹ (erkin ionda)", note: "Kompleksda B pasayadi (kovalentlik ko'rsatkichi)" },
    { term: "C", name: "Racah C parametri", desc: "Spin tekislikka ko'ndalang o'zaro ta'sir", value: "~4B (odatda C/B ≈ 4.0–4.5)", note: "Tanabe-Sugano diagrammalarida hisobga olinadi" },
    { term: "β (beta)", name: "Nefelauksetik nisbat", desc: "β = B(kompleks) / B(erkin ion)", value: "0.5–1.0", note: "β < 1 — kovalentlik belgisi (Jørgensen)" },
    { term: "Δo", name: "Oktaedrik yoriqlanish", desc: "eg va t₂g orasidagi energiya farqi", value: "8 000 – 40 000 cm⁻¹", note: "Metall, oksidlanish darajasi va ligand tabiatiga bog'liq" },
    { term: "10Dq", name: "Δo ning klassik nomi", desc: "Tarixiy nom (D — dipol, q — kvadrupol)", value: "= Δo", note: "Bir xil fizik kattalik" },
  ],
}

// 7 ta etalon kompleks uchun Gauss dekonvolyutsiya profillari
const SPEKTR_ETALONLARI = [
  {
    id: "ti-h2o6",
    nom: "[Ti(H₂O)₆]³⁺ (d¹)",
    rang: "purpur",
    rangHex: "#b53da4",
    tavsif: "d¹ konfiguratsiya, yagona ²T₂g → ²Eg d–d o'tishi. Yan-Teller effekti tufayli 493 nm da asosiy cho'qqi va 580 nm da yelka mavjud.",
    nuqtalar: [
      { id: 1, nom: "²T₂g → ²Eg (Asosiy)", center: 493, fwhm: 75, amp: 5.2, rang: "#ec4899" },
      { id: 2, nom: "Yan-Teller yelkasi", center: 580, fwhm: 90, amp: 2.1, rang: "#a855f7" }
    ]
  },
  {
    id: "co-nh3-6",
    nom: "[Co(NH₃)₆]³⁺ (d⁶ LS)",
    rang: "sariq-oltin",
    rangHex: "#eab308",
    tavsif: "Klassik d⁶ past spinli oktaedr. Ikkita asosiy singlet-singlet d–d polosalari va 210 nm da kuchli LMCT tasmasi.",
    nuqtalar: [
      { id: 1, nom: "¹A₁g → ¹T₁g (ν₁)", center: 475, fwhm: 55, amp: 60, rang: "#eab308" },
      { id: 2, nom: "¹A₁g → ¹T₂g (ν₂)", center: 340, fwhm: 50, amp: 55, rang: "#38bdf8" },
      { id: 3, nom: "LMCT (N→Co)", center: 220, fwhm: 40, amp: 180, rang: "#ef4444" }
    ]
  },
  {
    id: "cr-h2o6",
    nom: "[Cr(H₂O)₆]³⁺ (d³)",
    rang: "binafsha",
    rangHex: "#8b5cf6",
    tavsif: "d³ konfiguratsiya — Tanabe-Sugano bo'yicha 3 ta spin-ruxsat etilgan kvartet-kvartet d–d o'tishlariga ega.",
    nuqtalar: [
      { id: 1, nom: "⁴A₂g → ⁴T₂g (ν₁ = Δo)", center: 575, fwhm: 65, amp: 13.5, rang: "#8b5cf6" },
      { id: 2, nom: "⁴A₂g → ⁴T₁g(F) (ν₂)", center: 407, fwhm: 60, amp: 15.2, rang: "#06b6d4" },
      { id: 3, nom: "⁴A₂g → ⁴T₁g(P) (ν₃)", center: 265, fwhm: 45, amp: 8.5, rang: "#ec4899" }
    ]
  },
  {
    id: "cu-h2o6",
    nom: "[Cu(H₂O)₆]²⁺ (d⁹)",
    rang: "havorang",
    rangHex: "#06b6d4",
    tavsif: "d⁹ Yan-Teller tetragonal cho'zilishi tufayli 794 nm atrofida keng assimetrik tasmaga ega (dz² va dx²−y² yorilishi).",
    nuqtalar: [
      { id: 1, nom: "²B₁g → ²A₁g", center: 790, fwhm: 130, amp: 12.0, rang: "#06b6d4" },
      { id: 2, nom: "²B₁g → ²B₂g", center: 690, fwhm: 110, amp: 7.5, rang: "#3b82f6" },
      { id: 3, nom: "²B₁g → ²Eg", center: 910, fwhm: 140, amp: 4.8, rang: "#6366f1" }
    ]
  },
  {
    id: "cis-co-en2-cl2",
    nom: "cis-[Co(en)₂Cl₂]⁺ (C₂)",
    rang: "binafsha",
    rangHex: "#9333ea",
    tavsif: "C₂ pastroq simmetriya tufayli d–d holatlari kuchli yoriladi va 527 nm da binafsha rang beradi.",
    nuqtalar: [
      { id: 1, nom: "¹A₁ → ¹E (d–d)", center: 527, fwhm: 65, amp: 87, rang: "#9333ea" },
      { id: 2, nom: "¹A₁ → ¹A₂ (d–d)", center: 385, fwhm: 55, amp: 90, rang: "#38bdf8" },
      { id: 3, nom: "LMCT (Cl→Co)", center: 245, fwhm: 45, amp: 160, rang: "#ef4444" }
    ]
  },
  {
    id: "trans-co-en2-cl2",
    nom: "trans-[Co(en)₂Cl₂]⁺ (D₄ₕ)",
    rang: "yashil",
    rangHex: "#10b981",
    tavsif: "D₄ₕ simmetriyada ¹T₁g holati ²Eg va ²A₂g ga ajraladi. 624 nm dagi tizma unga xos yashil rangni ta'minlaydi.",
    nuqtalar: [
      { id: 1, nom: "¹A₁g → ¹Eg (d–d)", center: 624, fwhm: 70, amp: 25, rang: "#10b981" },
      { id: 2, nom: "¹A₁g → ¹A₂g (d–d)", center: 452, fwhm: 55, amp: 30, rang: "#06b6d4" },
      { id: 3, nom: "LMCT (Cl→Co)", center: 255, fwhm: 40, amp: 140, rang: "#ef4444" }
    ]
  },
  {
    id: "ni-h2o6",
    nom: "[Ni(H₂O)₆]²⁺ (d⁸)",
    rang: "och yashil",
    rangHex: "#22c55e",
    tavsif: "d⁸ oktaedr — uchta asosiy spin-ruxsat etilgan triplet-triplet polosalari (³A₂g → ³T₂g, ³T₁g(F), ³T₁g(P)).",
    nuqtalar: [
      { id: 1, nom: "³A₂g → ³T₂g (ν₁ = Δo)", center: 1150, fwhm: 120, amp: 2.2, rang: "#22c55e" },
      { id: 2, nom: "³A₂g → ³T₁g(F) (ν₂)", center: 720, fwhm: 90, amp: 2.5, rang: "#38bdf8" },
      { id: 3, nom: "³A₂g → ³T₁g(P) (ν₃)", center: 395, fwhm: 60, amp: 5.5, rang: "#a855f7" }
    ]
  }
]

export default function UBVisSpektroskopiya() {
  const [fonKaliti, fonniOzgartir] = useFon()
  const [activeTransition, setActiveTransition] = useState(0)
  const [activeGeom, setActiveGeom] = useState(0)
  const [activeSelectionRule, setActiveSelectionRule] = useState(0)
  const [activeIsomer, setActiveIsomer] = useState(0)
  const [activeInstrument, setActiveInstrument] = useState(0)
  const [activeSolvent, setActiveSolvent] = useState(0)
  const [activeKeyTransition, setActiveKeyTransition] = useState(0)
  const [lambdaSlider, setLambdaSlider] = useState(500)
  
  // Gauss spektri holatlari
  const [tanlanganEtalonId, setTanlanganEtalonId] = useState("ti-h2o6")
  const [ochiqPiklar, setOchiqPiklar] = useState({ 1: true, 2: true, 3: true })

  // Beer-Lambert kalkulyator
  const [bl_c, setBlC] = useState(0.001)
  const [bl_eps, setBlEps] = useState(15000)
  const [bl_l, setBlL] = useState(1)

  const currentZone = useMemo(() => {
    const l = lambdaSlider
    if (l < 200) return { name: "Vakuum UB (VUV)", desc: "Havo ham yutadi — maxsus vakuumli spektrometr talab qiladi. σ→σ*, yadro elektronlari.", color: "text-purple-500", bgColor: "bg-purple-500" }
    if (l < 280) return { name: "Uzoq UB (Far UV)", desc: "π→π* o'tishlar (aromatik bpy, phen), yuqori intensivlikdagi LMCT tasmalari.", color: "text-purple-400", bgColor: "bg-purple-400" }
    if (l < 400) return { name: "Yaqin UB (Near UV)", desc: "n→π* o'tishlar, MLCT tasmalari, ligand ichi o'tishlar. Ko'zga ko'rinmaydi lekin juda informativ.", color: "text-indigo-400", bgColor: "bg-indigo-400" }
    if (l < 450) return { name: "Ko'rinuvchi — binafsha", desc: "Yutilsa — sariq rang ko'rinadi. Ko'p Co(III), Cr(III) komplekslarida.", color: "text-violet-500", bgColor: "bg-violet-500" }
    if (l < 490) return { name: "Ko'rinuvchi — ko'k", desc: "Yutilsa — to'q sariq. [Ti(H₂O)₆]³⁺ ning tipik cho'qqisi.", color: "text-blue-500", bgColor: "bg-blue-500" }
    if (l < 560) return { name: "Ko'rinuvchi — yashil", desc: "Yutilsa — purpur/qizil. Ba'zi Cr(III), Ni(II) komplekslarida.", color: "text-emerald-500", bgColor: "bg-emerald-500" }
    if (l < 590) return { name: "Ko'rinuvchi — sariq", desc: "Yutilsa — ko'k. [Cu(H₂O)₆]²⁺ havorangi shu tufayli.", color: "text-amber-400", bgColor: "bg-amber-400" }
    if (l < 650) return { name: "Ko'rinuvchi — to'q sariq", desc: "Yutilsa — ko'k-yashil. [Ni(H₂O)₆]²⁺ yashil rangi.", color: "text-orange-500", bgColor: "bg-orange-500" }
    if (l < 780) return { name: "Ko'rinuvchi — qizil", desc: "Yutilsa — yashil. [Co(NH₃)₆]³⁺ sariq rangi asosan bunda.", color: "text-red-500", bgColor: "bg-red-500" }
    if (l < 1400) return { name: "Yaqin IQ (NIR)", desc: "Cu²⁺ va boshqa d⁹ komplekslar, f–f o'tishlar (lantanoidlar).", color: "text-rose-700", bgColor: "bg-rose-700" }
    return { name: "Uzoq NIR", desc: "Molekula tebranish oberton va kombinatsiyalari. Kompleks kimyoda kam qo'llaniladi.", color: "text-slate-500", bgColor: "bg-slate-500" }
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

  // Tanlangan Gauss etaloni
  const aktivEtalon = useMemo(() => {
    return SPEKTR_ETALONLARI.find(e => e.id === tanlanganEtalonId) || SPEKTR_ETALONLARI[0]
  }, [tanlanganEtalonId])

  // 200–1000 nm diapazonda Gauss egri chizig'ini hisoblash
  const spektrEgrisi = useMemo(() => {
    const qadam = 4
    const nuqtalar = []
    const aktivNuqtalar = aktivEtalon.nuqtalar.filter(p => ochiqPiklar[p.id] !== false)
    
    for (let x = 200; x <= 1000; x += qadam) {
      let jamiY = 0
      const subVals = {}
      
      aktivNuqtalar.forEach(p => {
        const c = p.center
        const s = p.fwhm / 2.355
        const g = p.amp * Math.exp(-0.5 * Math.pow((x - c) / s, 2))
        subVals[p.id] = g
        jamiY += g
      })
      
      nuqtalar.push({ x, y: jamiY, sub: subVals })
    }
    
    return nuqtalar
  }, [aktivEtalon, ochiqPiklar])

  const maxY = useMemo(() => {
    const maxVal = Math.max(...spektrEgrisi.map(p => p.y), 1)
    return maxVal * 1.15
  }, [spektrEgrisi])

  const svgPathJami = useMemo(() => {
    if (!spektrEgrisi.length) return ""
    return spektrEgrisi.reduce((acc, p, idx) => {
      const sx = ((p.x - 200) / 800) * 560 + 50
      const sy = 240 - (p.y / maxY) * 200
      return `${acc} ${idx === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`
    }, "")
  }, [spektrEgrisi, maxY])

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

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
              <Ikon nom="grafik" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>UB-Vis (Ultrabinafsha–Ko{"'"}rinadigan) Spektroskopiyasi</span>
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

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6 flex-1 w-full">

        {/* ═══════════════ 0. BIRIKMALAR KARTASI ═══════════════ */}
        <Link
          href="/ilmiy/tahlil/ub-vis/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="qidiruv" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>16 ta etalon kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Kompleks Birikmalarning UB-Vis Spektral Bazasini Ochish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Har bir kompleks uchun eksperimental λ<sub>max</sub>, ε koeffitsienti, d–d va CT o{"'"}tishlar tayinlanishi,
                Tanabe-Sugano parametrlari va optik zichlik spektrlari.
              </p>
            </div>
          </div>

          <div className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shrink-0 group-hover:shadow-lg">
            <span>Bazasini Ko{"'"}rish</span>
            <Ikon nom="ong" olcham={14} />
          </div>
        </Link>

        {/* ═══════════════ 1. INTERAKTIV GAUSS SPEKTR SIMULYATORI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--v3-chiziq)] pb-4">
            <div className="space-y-1">
              <div className="v3-nishon text-[var(--v3-urgu)]">Eksperimental Simulyator</div>
              <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="grafik" olcham={20} className="text-[var(--v3-urgu)]" />
                <span>Interaktiv UB-Vis Spektri va Gauss Dekonvolyutsiyasi</span>
              </h2>
            </div>
            <span className="text-xs text-[var(--v3-xira)] font-mono">200 — 1000 nm diapazon</span>
          </div>

          {/* Kompleks tanlash tugmalari */}
          <div className="flex flex-wrap gap-2">
            {SPEKTR_ETALONLARI.map((et) => (
              <button
                key={et.id}
                onClick={() => {
                  setTanlanganEtalonId(et.id)
                  setOchiqPiklar({ 1: true, 2: true, 3: true })
                }}
                className={`text-xs py-1.5 px-3 rounded-lg font-mono transition-all border ${
                  tanlanganEtalonId === et.id
                    ? "bg-[var(--v3-urgu)] text-black font-bold border-[var(--v3-urgu)] shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {et.nom}
              </button>
            ))}
          </div>

          {/* Tavsif paneli */}
          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">{aktivEtalon.nom}</strong>: {aktivEtalon.tavsif}
          </div>

          {/* SVG Spektr Grafigi */}
          <div className="p-4 rounded-2xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
            <svg viewBox="0 0 640 280" className="w-full h-auto">
              {/* Orqa fon panjarasi */}
              {[200, 300, 400, 500, 600, 700, 800, 900, 1000].map((wv) => {
                const sx = ((wv - 200) / 800) * 560 + 50
                return (
                  <g key={wv}>
                    <line x1={sx} y1={30} x2={sx} y2={240} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="3 3" />
                    <text x={sx} y={258} fill="currentColor" fillOpacity={0.6} fontSize={10} textAnchor="middle" fontFamily="monospace">
                      {wv}
                    </text>
                  </g>
                )
              })}

              {/* Y o'qi belgilari */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
                const sy = 240 - frac * 200
                const val = (frac * maxY).toFixed(frac === 0 ? 0 : 1)
                return (
                  <g key={frac}>
                    <line x1={45} y1={sy} x2={610} y2={sy} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="3 3" />
                    <text x={40} y={sy + 3} fill="currentColor" fillOpacity={0.6} fontSize={9} textAnchor="end" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                )
              })}

              {/* X & Y Asosiy o'qlar */}
              <line x1={50} y1={240} x2={615} y2={240} stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.4} />
              <line x1={50} y1={20} x2={50} y2={240} stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.4} />

              <text x={330} y={274} fill="currentColor" fontSize={11} textAnchor="middle" fontWeight="bold">
                To{"'"}lqin uzunligi λ (nm)
              </text>
              <text x={18} y={130} fill="currentColor" fontSize={10} textAnchor="middle" fontWeight="bold" transform="rotate(-90 18 130)">
                Yutilish ε (M⁻¹·cm⁻¹)
              </text>

              {/* Alohida sub-komponent Gauss chiziqlari */}
              {aktivEtalon.nuqtalar.map((p) => {
                if (ochiqPiklar[p.id] === false) return null
                const subPath = spektrEgrisi.reduce((acc, pt, idx) => {
                  const sx = ((pt.x - 200) / 800) * 560 + 50
                  const gVal = pt.sub[p.id] || 0
                  const sy = 240 - (gVal / maxY) * 200
                  return `${acc} ${idx === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`
                }, "")

                return (
                  <path
                    key={p.id}
                    d={subPath}
                    fill="none"
                    stroke={p.rang}
                    strokeWidth={1.8}
                    strokeDasharray="4 3"
                    strokeOpacity={0.85}
                  />
                )
              })}

              {/* Jami Spektr Egri Chizig'i */}
              <path
                d={svgPathJami}
                fill="none"
                stroke="var(--v3-urgu)"
                strokeWidth={2.8}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Polosalarni boshqarish & dekonvolyutsiya komponentlari */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[var(--v3-xira)] uppercase tracking-wider">
              Gauss Polosalarini Ajratish (Dekonvolyutsiya):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {aktivEtalon.nuqtalar.map((p) => {
                const isOn = ochiqPiklar[p.id] !== false
                return (
                  <button
                    key={p.id}
                    onClick={() => setOchiqPiklar(prev => ({ ...prev, [p.id]: !isOn }))}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isOn
                        ? "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]"
                        : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] opacity-40"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold font-mono" style={{ color: p.rang }}>
                        {p.nom}
                      </div>
                      <div className="text-[11px] text-[var(--v3-xira)] font-mono">
                        λ = {p.center} nm • ε ≈ {p.amp}
                      </div>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isOn ? "bg-emerald-500 border-emerald-400" : "bg-transparent border-[var(--v3-chiziq)]"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════ 2. NAZARIY ASOS — KVANT MEXANIKASI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Fundamental Kvant Mexanikasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>1. Nazariy Asos — Elektron O{"'"}tishlarning Kvant Mexanikasi</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-[var(--v3-urgu)]">UB-Vis (Ultrabinafsha–ko{"'"}rinadigan) spektroskopiya</strong> —
            molekulaning elektron holatlari orasidagi <strong className="text-[var(--v3-urgu)]">kvantlangan energiya
            o{"'"}tishlarini</strong> o{"'"}lchashga asoslangan fundamental spektroskopik usul. Molekulaga UB-Vis diapazondagi (200–780 nm)
            elektromagnit nurlanish yuborilganda, foton energiyasi elektron darajalari orasidagi <em>ΔE</em> farqiga
            to{"'"}g{"'"}ri kelsa, molekula fotonni yutadi va elektron yuqori (qo{"'"}zg{"'"}algan) holatga o{"'"}tadi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="text-xs font-bold text-[var(--v3-urgu)]">Plank-Eynshteyn Qonuni</h3>
              <div className="text-base sm:text-lg font-mono font-bold text-[var(--v3-matn)] py-2 text-center bg-[var(--v3-fon-2)] rounded-lg border border-[var(--v3-chiziq)]">
                E = hν = hc/λ
              </div>
              <ul className="text-xs text-[var(--v3-xira)] space-y-1">
                <li><strong>h</strong> — Plank doimiysi (6.626×10⁻³⁴ J·s)</li>
                <li><strong>c</strong> — yorug{"'"}lik tezligi (3×10⁸ m/s)</li>
                <li><strong>λ</strong> — to{"'"}lqin uzunligi (nm)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="text-xs font-bold text-[var(--v3-urgu)]">Beer-Lambert Qonuni</h3>
              <div className="text-base sm:text-lg font-mono font-bold text-[var(--v3-matn)] py-2 text-center bg-[var(--v3-fon-2)] rounded-lg border border-[var(--v3-chiziq)]">
                A = ε · c · l
              </div>
              <ul className="text-xs text-[var(--v3-xira)] space-y-1">
                <li><strong>A</strong> — optik zichlik (absorbans)</li>
                <li><strong>ε</strong> — molyar koeffitsient (M⁻¹·cm⁻¹)</li>
                <li><strong>c</strong> — konsentratsiya (mol/L)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="text-xs font-bold text-[var(--v3-urgu)]">Tanlash Qoidalari</h3>
              <div className="text-base sm:text-lg font-mono font-bold text-[var(--v3-matn)] py-2 text-center bg-[var(--v3-fon-2)] rounded-lg border border-[var(--v3-chiziq)]">
                ΔS = 0 • g ↔ u
              </div>
              <ul className="text-xs text-[var(--v3-xira)] space-y-1">
                <li><strong>Spin</strong>: ko{"'"}plik o{"'"}zgarmaydi</li>
                <li><strong>Laport</strong>: juftlik (parity) o{"'"}zgaradi</li>
                <li><strong>Orbital</strong>: Δl = ±1</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═══════════════ 3. INTERAKTIV λ SLIDER — TO'LQIN UZUNLIGI ZONALARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Spektral Diapazon</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="sozlama" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>2. Interaktiv To{"'"}lqin Uzunligi va Rang Zonalari</span>
            </h2>
          </div>

          <div className="bg-gradient-to-r from-purple-500 via-blue-500 via-emerald-500 via-yellow-500 via-orange-500 to-red-500 h-3 rounded-full shadow-inner" />
          
          <input
            type="range"
            min="180"
            max="1400"
            value={lambdaSlider}
            onChange={(e) => setLambdaSlider(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[var(--v3-urgu)] bg-[var(--v3-yuza-2)]"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <div className="text-[11px] text-[var(--v3-xira)]">To{"'"}lqin Uzunligi (λ)</div>
              <div className="text-lg font-bold font-mono text-[var(--v3-urgu)]">{lambdaSlider} nm</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <div className="text-[11px] text-[var(--v3-xira)]">To{"'"}lqin Soni (ν̃)</div>
              <div className="text-lg font-bold font-mono text-cyan-400">{wavenumber} cm⁻¹</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <div className="text-[11px] text-[var(--v3-xira)]">Foton Energiyasi</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{energyEV} eV</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <div className="text-[11px] text-[var(--v3-xira)]">Molyar Energiya</div>
              <div className="text-lg font-bold font-mono text-amber-400">{energyKJ} kJ/mol</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${currentZone.bgColor} shadow-md shrink-0`} />
            <div>
              <h3 className={`text-base font-bold ${currentZone.color}`}>{currentZone.name}</h3>
              <p className="text-xs text-[var(--v3-matn)] leading-relaxed mt-0.5">{currentZone.desc}</p>
            </div>
          </div>

          {/* To'ldiruvchi ranglar jadvali */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--v3-matn)]">
              Yutilgan va Ko{"'"}rinuvchi Ranglar (To{"'"}ldiruvchi Ranglar Qonuniyati)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                    <th className="py-2 px-3">λ (nm)</th>
                    <th className="py-2 px-3">Yutilgan Rang</th>
                    <th className="py-2 px-3">Ko{"'"}rinuvchi Rang</th>
                    <th className="py-2 px-3">Namuna Kompleks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v3-chiziq)]">
                  {UBVIS_DATA.colorWheel.map((row, i) => (
                    <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                      <td className="py-2 px-3 font-bold text-[var(--v3-urgu)]">{row.lambdaRange}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded" style={{ background: row.hex }} />
                          <span>{row.absorbed}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded" style={{ background: row.perceivedHex }} />
                          <span>{row.perceived}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[var(--v3-xira)]">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══════════════ 4. ELEKTRON O'TISH TURLARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Spektral Tasnif</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>3. Elektron O{"'"}tishlarning Asosiy Turlari</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {UBVIS_DATA.transitionTypes.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTransition(i)}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all border ${
                  activeTransition === i
                    ? "bg-[var(--v3-urgu)] text-black border-[var(--v3-urgu)] font-bold shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {t.symbol}
              </button>
            ))}
          </div>

          {UBVIS_DATA.transitionTypes[activeTransition] && (
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
              <h3 className={`text-lg font-bold ${UBVIS_DATA.transitionTypes[activeTransition].color}`}>
                {UBVIS_DATA.transitionTypes[activeTransition].name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">Energiya Diapazoni:</div>
                  <div className="font-bold text-[var(--v3-urgu)]">{UBVIS_DATA.transitionTypes[activeTransition].energy}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">To{"'"}lqin Uzunligi:</div>
                  <div className="font-bold text-cyan-400">{UBVIS_DATA.transitionTypes[activeTransition].lambda}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">Molyar Yutilish (ε):</div>
                  <div className="font-bold text-emerald-400">{UBVIS_DATA.transitionTypes[activeTransition].epsilon}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs">
                <span className="font-bold text-[var(--v3-urgu)]">Tanlash Qoidasi: </span>
                <span>{UBVIS_DATA.transitionTypes[activeTransition].selectionRule}</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs">
                <span className="font-bold text-cyan-400">Etalon Misol: </span>
                <span className="font-mono">{UBVIS_DATA.transitionTypes[activeTransition].example}</span>
              </div>

              <div className="text-xs text-[var(--v3-matn)] leading-relaxed pt-2 border-t border-[var(--v3-chiziq)]">
                {UBVIS_DATA.transitionTypes[activeTransition].note}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 5. KRISTALL MAYDON NAZARIYASI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kvant Kimyosi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="qulflash" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>4. Kristall Maydon Nazariyasi (CFT) va CFSE Formulalari</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {UBVIS_DATA.crystalField.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveGeom(i)}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all border ${
                  activeGeom === i
                    ? "bg-[var(--v3-urgu)] text-black border-[var(--v3-urgu)] font-bold shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {g.geom}
              </button>
            ))}
          </div>

          {UBVIS_DATA.crystalField[activeGeom] && (
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">d-Orbital Yorilish Sxemasi:</div>
                  <div className="text-sm font-bold text-[var(--v3-urgu)] mt-1">{UBVIS_DATA.crystalField[activeGeom].splitting}</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">Yoriqlanish Parametri:</div>
                  <div className="text-sm font-bold text-cyan-400 mt-1">{UBVIS_DATA.crystalField[activeGeom].delta}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                      <th className="py-2.5 px-3">d-Konfiguratsiya</th>
                      <th className="py-2.5 px-3">CFSE Barqarorlashuv</th>
                      <th className="py-2.5 px-3">Spin (S)</th>
                      <th className="py-2.5 px-3">Etalon Kompleks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v3-chiziq)]">
                    {UBVIS_DATA.crystalField[activeGeom].cfseFormulas.map((r, i) => (
                      <tr key={i} className="hover:bg-[var(--v3-yuza-2)] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{r.config}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{r.cfse}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{r.spin}</td>
                        <td className="py-2.5 px-3 text-[var(--v3-matn)]">{r.example || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 6. TANLASH QOIDALARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kvant Qonuniyatlari</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="belgi" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>5. Elektron O{"'"}tishlar Uchun Tanlash Qoidalari</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {UBVIS_DATA.selectionRules.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveSelectionRule(i)}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all border ${
                  activeSelectionRule === i
                    ? "bg-[var(--v3-urgu)] text-black border-[var(--v3-urgu)] font-bold shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {UBVIS_DATA.selectionRules[activeSelectionRule] && (
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
              <div className="p-4 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center text-lg font-mono font-bold text-[var(--v3-urgu)]">
                {UBVIS_DATA.selectionRules[activeSelectionRule].formula}
              </div>

              <p className="text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
                {UBVIS_DATA.selectionRules[activeSelectionRule].description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <div className="font-bold text-emerald-400">RUXSAT ETILGAN:</div>
                  <div className="text-[var(--v3-matn)]">{UBVIS_DATA.selectionRules[activeSelectionRule].allowed}</div>
                  <div className="text-[11px] text-emerald-300 font-mono">Misol: {UBVIS_DATA.selectionRules[activeSelectionRule].example_allowed}</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                  <div className="font-bold text-rose-400">TAQIQLANGAN:</div>
                  <div className="text-[var(--v3-matn)]">{UBVIS_DATA.selectionRules[activeSelectionRule].forbidden}</div>
                  <div className="text-[11px] text-rose-300 font-mono">Misol: {UBVIS_DATA.selectionRules[activeSelectionRule].example_forbidden}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
                <strong>Vibronik mexanizm:</strong> {UBVIS_DATA.selectionRules[activeSelectionRule].note}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 7. BEER-LAMBERT KALKULYATORI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Miqdoriy Tahlil</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>6. Interaktiv Beer-Lambert Optik Zichlik Kalkulyatori</span>
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center">
            <div className="text-2xl font-mono font-black text-[var(--v3-urgu)]">A = ε · c · l</div>
            <div className="text-xs text-[var(--v3-xira)] mt-1">Absorbans (A) va Nurning O{"'"}tkazuvchanligi (T%) hisobi</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-xs text-[var(--v3-xira)]">
                <span>ε (M⁻¹·cm⁻¹):</span>
                <strong className="text-[var(--v3-urgu)] font-mono">{bl_eps.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="50000"
                step="10"
                value={bl_eps}
                onChange={(e) => setBlEps(Number(e.target.value))}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-xs text-[var(--v3-xira)]">
                <span>c (mol/L):</span>
                <strong className="text-cyan-400 font-mono">{bl_c.toExponential(2)}</strong>
              </div>
              <input
                type="range"
                min="0.00001"
                max="0.05"
                step="0.00005"
                value={bl_c}
                onChange={(e) => setBlC(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-xs text-[var(--v3-xira)]">
                <span>l kyuveta (cm):</span>
                <strong className="text-emerald-400 font-mono">{bl_l} cm</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={bl_l}
                onChange={(e) => setBlL(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-xs text-[var(--v3-xira)]">Hisoblangan Optik Zichlik (A):</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">A = {blResult.A}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--v3-xira)]">Transmittans (T%):</div>
              <div className="text-lg font-bold text-cyan-400">T = {blResult.T}%</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 8. SPEKTROXIMIK QATOR ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Ligand Maydon Kuchi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="grafik" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>7. Spektroximik Qator (Fajans-Tsuchida Qatori)</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-center font-mono font-bold text-[var(--v3-urgu)]">
            I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ &lt; Cl⁻ &lt; NO₃⁻ &lt; N₃⁻ &lt; F⁻ &lt; OH⁻ &lt; C₂O₄²⁻ &lt; H₂O &lt; NCS⁻ &lt; CH₃CN &lt; py &lt; NH₃ &lt; en &lt; bpy &lt; phen &lt; NO₂⁻ &lt; PPh₃ &lt; CN⁻ &lt; CO
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UBVIS_DATA.spectrochemicalSeries.map((l, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-between text-xs">
                <div>
                  <div className={`font-bold ${l.color || "text-[var(--v3-matn)]"}`}>{l.ligand}</div>
                  <div className="text-[10px] text-[var(--v3-xira)]">{l.class}</div>
                </div>
                <div className="font-mono text-sm font-bold text-[var(--v3-urgu)]">{l.relative}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 9. NEFELAUKSETIK QATOR ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Kovalentlik O{"'"}lchovi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>8. Nefelauksetik Qator (C.K. Jørgensen β Parametri)</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center text-sm font-mono font-bold text-[var(--v3-urgu)]">
            β = B(kompleks) / B₀(erkin ion)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UBVIS_DATA.nephelauxeticSeries.map((l, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-between text-xs">
                <div>
                  <div className={`font-bold ${l.color || "text-[var(--v3-matn)]"}`}>{l.ligand}</div>
                  <div className="text-[10px] text-[var(--v3-xira)]">{l.class}</div>
                </div>
                <div className="font-mono text-sm font-bold text-cyan-400">{l.beta.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 10. MUHIM KOMPLEKSLARDA O'TISHLAR ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Eksperimental Benchmark</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>9. Muhim Komplekslar Spektrlari va Russell-Saunders Terminlari</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {UBVIS_DATA.keyTransitions.map((k, i) => (
              <button
                key={i}
                onClick={() => setActiveKeyTransition(i)}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all border ${
                  activeKeyTransition === i
                    ? "bg-[var(--v3-urgu)] text-black border-[var(--v3-urgu)] font-bold shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {k.complex}
              </button>
            ))}
          </div>

          {UBVIS_DATA.keyTransitions[activeKeyTransition] && (
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--v3-chiziq)] pb-3">
                <span className="text-base font-bold text-[var(--v3-urgu)] font-mono">
                  {UBVIS_DATA.keyTransitions[activeKeyTransition].complex}
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {UBVIS_DATA.keyTransitions[activeKeyTransition].config} • Yer holati: {UBVIS_DATA.keyTransitions[activeKeyTransition].groundTerm}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                      <th className="py-2.5 px-3">O{"'"}tish Belgisi</th>
                      <th className="py-2.5 px-3">Energiya (cm⁻¹)</th>
                      <th className="py-2.5 px-3">λ (nm)</th>
                      <th className="py-2.5 px-3">ε (M⁻¹·cm⁻¹)</th>
                      <th className="py-2.5 px-3">Diagnostik Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v3-chiziq)]">
                    {UBVIS_DATA.keyTransitions[activeKeyTransition].transitions.map((t, i) => (
                      <tr key={i} className="hover:bg-[var(--v3-yuza-2)] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{t.symbol}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{t.energy.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{t.lambda}</td>
                        <td className="py-2.5 px-3 text-amber-400">{t.epsilon}</td>
                        <td className="py-2.5 px-3 text-[var(--v3-matn)]">{t.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] leading-relaxed">
                {UBVIS_DATA.keyTransitions[activeKeyTransition].note}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 11. IZOMERLARNI UB-VIS BILAN ANIQLASH ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Stereokimyoviy Tahlil</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>10. Izomerlarni UB-Vis Spektroskopiya Bilan Aniqlash</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {UBVIS_DATA.isomerDetection.map((iso, i) => (
              <button
                key={i}
                onClick={() => setActiveIsomer(i)}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all border ${
                  activeIsomer === i
                    ? "bg-[var(--v3-urgu)] text-black border-[var(--v3-urgu)] font-bold shadow-md"
                    : "bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50"
                }`}
              >
                {iso.name}
              </button>
            ))}
          </div>

          {UBVIS_DATA.isomerDetection[activeIsomer] && (
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UBVIS_DATA.isomerDetection[activeIsomer].isomers.map((iso, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] space-y-2 text-xs">
                    <div className={`text-sm font-bold ${iso.color}`}>{iso.type}</div>
                    <div><strong>Simmetriya guruhi:</strong> {iso.symmetry}</div>
                    <div><strong>Yutilish tasmalari:</strong> {iso.bands}</div>
                    <div className="text-[11px] text-[var(--v3-xira)] pt-1 border-t border-[var(--v3-chiziq)]">{iso.diagnostic}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)]">
                <strong className="text-[var(--v3-urgu)]">Guruh nazariyasi:</strong> {UBVIS_DATA.isomerDetection[activeIsomer].groupTheory}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 12. RACAH PARAMETRLARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Elektron-Elektron Itarilish</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>11. Racah Parametrlari (A, B, C) va Termlar</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Belgi</th>
                  <th className="py-2.5 px-3">Parametr Nomi</th>
                  <th className="py-2.5 px-3">Fizik Ta{"'"}rifi</th>
                  <th className="py-2.5 px-3">Qiymati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {UBVIS_DATA.racahParameters.map((r, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{r.term}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{r.name}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{r.desc}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 13. TANABE-SUGANO DIAGRAMMALARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Ligand Maydon Diagrammalari</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="grafik" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>12. Tanabe-Sugano Diagrammalari va E/B vs Δ/B Nisbatlari</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-[var(--v3-urgu)]">Tanabe-Sugano Diagrammasi Qoidalari:</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>X o{"'"}qi:</strong> Δo/B — Ligand maydoni kuchi</li>
                <li><strong>Y o{"'"}qi:</strong> E/B — Termlar energiyasi</li>
                <li><strong>Gorizontal chiziq:</strong> Har doim yer holati termi (E = 0)</li>
                <li><strong>Vertikal chiziq:</strong> HS ↔ LS o{"'"}tish chegarasi (d⁴–d⁷)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">Hisoblash Bosqichlari:</h3>
              <ol className="space-y-1 text-[var(--v3-matn)] list-decimal list-inside">
                <li>Spektrdan ν₁ va ν₂ polosalari aniqlanadi</li>
                <li>ν₂ / ν₁ nisbati orqali Δo/B topiladi</li>
                <li>B parametri: B = ν₁ / (E₁/B) formuladan olinadi</li>
                <li>Nefelauksetik koeffitsient: β = B / B₀</li>
              </ol>
            </div>
          </div>
        </div>

        {/* ═══════════════ 14. SPEKTROMETR TURLARI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Asbob-Uskunalar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="sozlama" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>13. Spektrometr Turlari va Optik Sxemalar</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UBVIS_DATA.instrumentTypes.map((ins, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2 text-xs">
                <div className="font-bold text-[var(--v3-urgu)]">{ins.name}</div>
                <div className="text-[11px] text-cyan-400 font-mono">{ins.freq}</div>
                <div className="text-[var(--v3-matn)]"><strong>Afzalligi:</strong> {ins.pros}</div>
                <div className="text-[var(--v3-xira)]"><strong>Kamchiligi:</strong> {ins.cons}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 15. ERITUVCHILAR VA NAMUNA TAYYORLASH ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Laboratoriya Amaliyoti</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="alanga" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>14. Namuna Tayyorlash va Erituvchilarning UB Kesilish Chegaralari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Erituvchi</th>
                  <th className="py-2.5 px-3">UB Kesilish Chegarasi (Cut-off)</th>
                  <th className="py-2.5 px-3">Afzalligi</th>
                  <th className="py-2.5 px-3">Qo{"'"}llanish Sohasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {UBVIS_DATA.samplePreparation.map((s, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{s.name}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{s.cutoff}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{s.pros}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{s.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 16. RANG TAHLILI ALGORITMI ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Amaliy Metodika</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="belgi" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>15. Rangni va Spektrni Tahlil Qilishning 8 Bosqichli Algoritmi</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {UBVIS_DATA.colorAnalysis.map((c) => (
              <div key={c.step} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2 text-xs">
                <div className="w-6 h-6 rounded-lg bg-[var(--v3-urgu)]/20 text-[var(--v3-urgu)] font-bold flex items-center justify-center font-mono">
                  {c.step}
                </div>
                <div className="font-bold text-[var(--v3-matn)]">{c.task}</div>
                <div className="text-[11px] text-[var(--v3-xira)]">{c.method}</div>
                <div className="text-[11px] font-mono text-cyan-400 pt-1 border-t border-[var(--v3-chiziq)]">
                  Natija: {c.result}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 17. TAQQOSLASH: UB-VIS vs BOSHQA USULLAR ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Taqqoslash Jadvali</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="grafik" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>16. UB-Vis Spektroskopiyasi vs Boshqa Tahlil Usullari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Tahlil Usuli</th>
                  <th className="py-2.5 px-3">O{"'"}lchanadigan O{"'"}tish</th>
                  <th className="py-2.5 px-3">Spektral Diapazon</th>
                  <th className="py-2.5 px-3">Aniqlanadigan Ma{"'"}lumot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">UB-Vis</td>
                  <td className="py-2.5 px-3 text-[var(--v3-matn)]">Elektron darajalar</td>
                  <td className="py-2.5 px-3 text-cyan-400">200–800 nm</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">Δo, d–d va CT o{"'"}tishlar, rang, spin holati</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-purple-400">IQ (FT-IR)</td>
                  <td className="py-2.5 px-3 text-[var(--v3-matn)]">Molekula tebranishlari</td>
                  <td className="py-2.5 px-3 text-cyan-400">4000–200 cm⁻¹</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">Funksional guruhlar, M–L bog{"'"}lari, koordinatsiya usuli</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-blue-400">XRD (Rentgen)</td>
                  <td className="py-2.5 px-3 text-[var(--v3-matn)]">Elektron zichlik difraksiyasi</td>
                  <td className="py-2.5 px-3 text-cyan-400">0.5–2.0 Å</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">Kristall panjara, fazoviy guruh, 3D koordinatalar</td>
                </tr>
                <tr className="hover:bg-[var(--v3-yuza)]">
                  <td className="py-2.5 px-3 font-bold text-emerald-400">NMR (YaMR)</td>
                  <td className="py-2.5 px-3 text-[var(--v3-matn)]">Yadro spin rezonansi</td>
                  <td className="py-2.5 px-3 text-cyan-400">Radiochastota</td>
                  <td className="py-2.5 px-3 text-[var(--v3-xira)]">Diamagnit komplekslar ligandlari, dinamik jarayonlar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 18. ILMIY MANBALAR ═══════════════ */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Bibliografiya</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>17. Fundamental Ilmiy Manbalar va Darsliklar</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { author: "A. B. P. Lever", title: "Inorganic Electronic Spectroscopy (2nd ed.)", year: "1984", pub: "Elsevier" },
              { author: "F. A. Cotton", title: "Chemical Applications of Group Theory (3rd ed.)", year: "1990", pub: "Wiley" },
              { author: "Y. Tanabe, S. Sugano", title: "On the Absorption Spectra of Complex Ions", year: "1954", pub: "J. Phys. Soc. Jpn." },
              { author: "H. Bethe", title: "Termaufspaltung in Kristallen", year: "1929", pub: "Ann. Physik" },
              { author: "C. K. Jørgensen", title: "Absorption Spectra and Chemical Bonding in Complexes", year: "1962", pub: "Pergamon" },
              { author: "Housecroft & Sharpe", title: "Inorganic Chemistry (4th ed.)", year: "2012", pub: "Pearson" },
            ].map((ref, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1 text-xs">
                <div className="font-bold text-[var(--v3-urgu)]">{ref.author}</div>
                <div className="text-[var(--v3-matn)] italic">{ref.title}</div>
                <div className="text-[11px] text-[var(--v3-xira)] font-mono">{ref.pub} ({ref.year})</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ NAVIGATSIYA FOOTER ═══════════════ */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Tahlil Usullari Markazi</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/iq"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>IQ (FT-IR) Spektroskopiya</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>

      </main>
    </div>
  )
}
