"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TERMIK TAHLIL — ASOSIY NAZARIY SAHIFA (PREMIUM SCIENTIFIC)
// Manbalar:
//   • M. E. Brown — Introduction to Thermal Analysis: Techniques and Applications (2nd ed., 2001)
//   • P. J. Haines — Principles of Thermal Analysis and Calorimetry (RSC, 2002)
//   • P. K. Gallagher (ed.) — Handbook of Thermal Analysis and Calorimetry (Vol. 1–5, Elsevier)
//   • W. W. Wendlandt — Thermal Methods of Analysis (3rd ed., Wiley)
//   • R. F. Speyer — Thermal Analysis of Materials (Marcel Dekker, 1994)
//   • Vogel's Quantitative Chemical Analysis (6th ed.)
//   • ICTAC Kinetics Committee — Vyazovkin S. et al., Thermochim. Acta 2011, 520, 1–19
//   • S. Vyazovkin — Isoconversional Kinetics of Thermally Stimulated Processes (Springer, 2015)
//   • H. E. Kissinger — Anal. Chem. 1957, 29, 1702
//   • T. Ozawa — Bull. Chem. Soc. Jpn. 1965, 38, 1881
//   • Coats A. W., Redfern J. P. — Nature 1964, 201, 68
// Xususiyat: Arrhenius/Eyring kinetikasi, ICTAC model-free tahlil, 17+ f(α) model,
//            Kissinger/Ozawa/KAS/Coats-Redfern, TG-DSC-EGA-MS, gidrat izomeriya
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const TERMIK_DATA = {
  // ─── Termik tahlil turlari (7 asosiy usul)
  methods: [
    { abbr: "TGA", uz: "Termogravimetrik tahlil", measure: "Massa (m)", unit: "mg yoki %", detects: "Uchuvchi mahsulotlar chiqishi, oksidlanish, adsorbsiya", inventor: "Honda K. (1915)" },
    { abbr: "DTG", uz: "Differensial termogravimetriya", measure: "dm/dT yoki dm/dt", unit: "mg/°C, mg/min", detects: "Massa yo'qotish tezligi cho'qqilari", inventor: "TGA ning hosilasi" },
    { abbr: "DTA", uz: "Differensial termik tahlil", measure: "ΔT = T(namuna) − T(mos.)", unit: "°C yoki mkV", detects: "Faza o'tishlari, endo/ekzotermik jarayonlar", inventor: "Le Chatelier H. (1887), Roberts-Austen (1899)" },
    { abbr: "DSC", uz: "Differensial skanerlash kalorimetriyasi", measure: "Issiqlik oqimi dQ/dt", unit: "mW yoki mJ/s", detects: "ΔH, Cp, Tg, Tm, Tc, kinetika", inventor: "Watson & O'Neill (1962, Perkin-Elmer)" },
    { abbr: "TMA", uz: "Termomekanik tahlil", measure: "Uzunlik/hajm o'zgarishi ΔL", unit: "μm yoki %", detects: "Kengayish koeffitsienti (α), Tg, siljish", inventor: "1960-yillar" },
    { abbr: "DMA", uz: "Dinamik mekanik tahlil", measure: "E', E'', tan δ", unit: "MPa, GPa", detects: "Viskoelastiklik, Tg, faza o'tishlari", inventor: "1960-yillar" },
    { abbr: "EGA", uz: "Ajralib chiqqan gaz tahlili", measure: "Gaz tarkibi (MS/FTIR)", unit: "m/z, cm⁻¹", detects: "H₂O, CO, CO₂, NH₃, NOₓ, SOₓ", inventor: "TG-MS: 1960-yillar" },
  ],

  // ─── Elektromagnit / harorat spektrida termik tahlilning o'rni
  temperatureRegions: [
    { name: "Kriyogenik", range: "-190 – 25°C", note: "Faza o'tishlari, spesifik issiqlik", instrument: "DSC (Ar/N₂ purge)" },
    { name: "Past haroratli", range: "25 – 300°C", note: "Adsorbsion suv, tashqi sfera H₂O, Tg", instrument: "TGA, DSC" },
    { name: "O'rta haroratli", range: "300 – 800°C", note: "Koordinatsion suv, ligand parchalanishi", instrument: "TGA, DTA, STA" },
    { name: "Yuqori haroratli", range: "800 – 1600°C", note: "Karbonat/sulfat parchalanishi, oksid hosil bo'lishi", instrument: "HT-DSC, HT-TGA" },
    { name: "Ultra yuqori", range: "1600 – 2400°C", note: "Nozik keramika, refraktor materiallar", instrument: "Al₂O₃/W tigel" },
  ],

  // ─── Termik jarayon turlari (fizik va kimyoviy)
  processTypes: [
    { type: "Fizik — endotermik", examples: ["Suyuqlanish (Tm)", "Bug'lanish (Tv)", "Sublimatsiya", "Kristall faza o'tishi", "Shisha o'tishi (Tg)", "Desorbsiya"], sign: "ΔH > 0" },
    { type: "Fizik — ekzotermik", examples: ["Kristallanish (Tc)", "Kondensatsiya", "Adsorbsiya"], sign: "ΔH < 0" },
    { type: "Kimyoviy — endotermik", examples: ["Dehidratatsiya", "Dekarbonatlanish", "Reduktsiya (ba'zilari)", "Ligand ajralishi"], sign: "ΔH > 0" },
    { type: "Kimyoviy — ekzotermik", examples: ["Oksidlanish", "Yonish", "Polimerlanish", "Kompleks hosil bo'lishi"], sign: "ΔH < 0" },
  ],

  // ─── Arrhenius va Eyring — reaksiya tezligi
  arrhenius: {
    equation: "k(T) = A · exp(−Eₐ / RT)",
    lnForm: "ln k = ln A − Eₐ / (RT)",
    params: [
      { symbol: "A", name: "Pre-eksponensial faktor", unit: "s⁻¹ yoki min⁻¹", note: "To'qnashuv chastotasi (~10¹⁰–10¹⁵)" },
      { symbol: "Eₐ", name: "Aktivlanish energiyasi", unit: "kJ/mol", note: "Reaksiya to'sig'i (kompleks parch. 50–300 kJ/mol)" },
      { symbol: "R", name: "Universal gaz konstantasi", unit: "8.314 J/(mol·K)", note: "Konstant" },
      { symbol: "T", name: "Absolyut harorat", unit: "K", note: "T[K] = T[°C] + 273.15" },
    ],
    eyring: "k = (kB·T/h) · exp(−ΔG‡/RT) = (kB·T/h) · exp(ΔS‡/R) · exp(−ΔH‡/RT)"
  },

  // ─── Kinetik modellar — f(α) va g(α) — ICTAC tavsiyasi
  kineticModels: [
    { code: "P₂", name: "Power law n=2", falpha: "2α^(1/2)", galpha: "α^(1/2)", mech: "Nukleatsiya (o'sish)" },
    { code: "P₃", name: "Power law n=3", falpha: "3α^(2/3)", galpha: "α^(1/3)", mech: "Nukleatsiya (o'sish)" },
    { code: "P₄", name: "Power law n=4", falpha: "4α^(3/4)", galpha: "α^(1/4)", mech: "Nukleatsiya (o'sish)" },
    { code: "A₂", name: "Avrami-Erofeev n=2", falpha: "2(1−α)[−ln(1−α)]^(1/2)", galpha: "[−ln(1−α)]^(1/2)", mech: "Tasodifiy nukleatsiya + o'sish (2D)" },
    { code: "A₃", name: "Avrami-Erofeev n=3", falpha: "3(1−α)[−ln(1−α)]^(2/3)", galpha: "[−ln(1−α)]^(1/3)", mech: "Tasodifiy nukleatsiya + o'sish (3D)" },
    { code: "A₄", name: "Avrami-Erofeev n=4", falpha: "4(1−α)[−ln(1−α)]^(3/4)", galpha: "[−ln(1−α)]^(1/4)", mech: "Nukleatsiya (yuqori dim.)" },
    { code: "R₁", name: "Zero order", falpha: "1", galpha: "α", mech: "Chegara siljishi (0D)" },
    { code: "R₂", name: "Contracting area", falpha: "2(1−α)^(1/2)", galpha: "1−(1−α)^(1/2)", mech: "Silindrik chegara siljishi" },
    { code: "R₃", name: "Contracting volume", falpha: "3(1−α)^(2/3)", galpha: "1−(1−α)^(1/3)", mech: "Sferik chegara siljishi" },
    { code: "D₁", name: "1D diffusion", falpha: "1/(2α)", galpha: "α²", mech: "Bir o'lchamli diffuziya" },
    { code: "D₂", name: "2D diffusion (Valensi)", falpha: "−1/ln(1−α)", galpha: "(1−α)ln(1−α)+α", mech: "Silindrik diffuziya" },
    { code: "D₃", name: "3D diffusion (Jander)", falpha: "3(1−α)^(2/3)/[2(1−(1−α)^(1/3))]", galpha: "[1−(1−α)^(1/3)]²", mech: "Sferik diffuziya" },
    { code: "D₄", name: "3D diffusion (Ginstling-Brounshtein)", falpha: "3/[2((1−α)^(−1/3)−1)]", galpha: "1−(2α/3)−(1−α)^(2/3)", mech: "Sferik diffuziya (aniqroq)" },
    { code: "F₁", name: "First order (Mampel)", falpha: "1−α", galpha: "−ln(1−α)", mech: "Birinchi tartib" },
    { code: "F₂", name: "Second order", falpha: "(1−α)²", galpha: "1/(1−α) − 1", mech: "Ikkinchi tartib" },
    { code: "F₃", name: "Third order", falpha: "(1−α)³", galpha: "[1/(1−α)² − 1]/2", mech: "Uchinchi tartib" },
    { code: "B₁", name: "Prout-Tompkins", falpha: "α(1−α)", galpha: "ln[α/(1−α)]", mech: "Avtokataliz (S-chiziq)" },
  ],

  // ─── Model-free (izokonversion) usullar
  modelFreeMethods: [
    {
      name: "Kissinger",
      year: 1957,
      equation: "ln(β/Tp²) = ln(AR/Eₐ) − Eₐ/(R·Tp)",
      description: "Cho'qqi haroratini turli qizdirish tezligida (β) o'lchash. Chizma: ln(β/Tp²) ↔ 1/Tp — qiyalik = −Eₐ/R.",
      pros: "Oddiy, bir Eₐ qiymati beradi",
      cons: "Faqat cho'qqida ishlaydi, α o'zgarishini ko'rsatmaydi"
    },
    {
      name: "Ozawa-Flynn-Wall (OFW)",
      year: 1965,
      equation: "ln β = ln[AEₐ/Rg(α)] − 5.331 − 1.052·Eₐ/(R·T)",
      description: "Har bir α uchun ln β ↔ 1/T chizmasi. Qiyalik = −1.052·Eₐ/R. α ga qarab Eₐ o'zgarishini beradi.",
      pros: "α bo'yicha Eₐ profil beradi, mexanizm bilinmasa ham ishlaydi",
      cons: "Doi taxminini ishlatadi (o'rta aniqlik)"
    },
    {
      name: "KAS (Kissinger-Akahira-Sunose)",
      year: 1971,
      equation: "ln(β/T²) = ln[AR/(Eₐ·g(α))] − Eₐ/(R·T)",
      description: "OFW ning aniqroq versiyasi. Har bir α uchun ln(β/T²) ↔ 1/T. Qiyalik = −Eₐ/R.",
      pros: "OFW dan aniqroq, ICTAC tavsiya qilgan",
      cons: "Ko'p (>3) qizdirish tezligi kerak"
    },
    {
      name: "Friedman (differensial)",
      year: 1964,
      equation: "ln(dα/dt) = ln[A·f(α)] − Eₐ/(R·T)",
      description: "Differensial usul — hosila to'g'ridan-to'g'ri ishlatiladi. Har α uchun ln(dα/dt) ↔ 1/T.",
      pros: "Eng aniq, integratsiya taxmini yo'q",
      cons: "Shovqinga sezgir (differensiallash tufayli)"
    },
    {
      name: "Vyazovkin (advanced)",
      year: 1997,
      equation: "Φ(Eₐ) = Σᵢ Σⱼ [I(Eₐ,Tαᵢ)·βⱼ] / [I(Eₐ,Tαⱼ)·βᵢ] → min",
      description: "Zamonaviy iterativ optimizatsiya. ICTAC 2011 nomenklaturasi bo'yicha «gold standard».",
      pros: "Har bir α da mustaqil Eₐ, non-izotermal + izotermal birga",
      cons: "Murakkab (kompyuter kerak), lekin natija eng ishonchli"
    },
  ],

  // ─── Model-based usullar
  modelBasedMethods: [
    {
      name: "Coats-Redfern",
      year: 1964,
      equation: "ln[g(α)/T²] = ln[AR/(β·Eₐ)·(1−2RT/Eₐ)] − Eₐ/(R·T)",
      description: "Har bir kinetik model uchun ln[g(α)/T²] ↔ 1/T chizmasi. Eng chiziqli model — to'g'ri mexanizm.",
      note: "Bir qizdirish tezligi bilan ishlaydi (β = const)"
    },
    {
      name: "Freeman-Carroll",
      year: 1958,
      equation: "Δlg(dα/dt)/Δlg(1−α) = n − (Eₐ/2.303R)·[Δ(1/T)/Δlg(1−α)]",
      description: "n va Eₐ ni bir vaqtda topadi. Bir qator differensial ma'lumot kerak.",
      note: "Faqat F₁, F₂, F₃ (reaction order) modellar uchun"
    },
    {
      name: "Achar-Brindley-Sharp",
      year: 1966,
      equation: "ln[(dα/dt)/f(α)] = ln A − Eₐ/(R·T)",
      description: "Har bir f(α) uchun chizma quriladi. Eng chiziqli — haqiqiy model.",
      note: "Master plot usullariga asos"
    },
  ],

  // ─── Termodinamik kattaliklar
  thermodynamics: [
    { symbol: "ΔH", name: "Entalpiya", unit: "kJ/mol yoki J/g", how: "DSC cho'qqi ostidagi maydondan olinadi: ΔH = (1/m)·∫(dQ/dt)dt" },
    { symbol: "ΔS", name: "Entropiya", unit: "J/(mol·K)", how: "Eyring: ΔS‡ = R·[ln(A·h/(kB·Tp)) − 1]" },
    { symbol: "ΔG", name: "Erkin energiya", unit: "kJ/mol", how: "ΔG = ΔH − T·ΔS" },
    { symbol: "Cp", name: "Doimiy bosimda issiqlik sig'imi", unit: "J/(g·K)", how: "DSC bilan sapfir mos usuli (ASTM E1269)" },
    { symbol: "Tm", name: "Suyuqlanish harorati", unit: "°C yoki K", how: "DSC endo cho'qqi onset yoki peak" },
    { symbol: "Tg", name: "Shisha o'tishi", unit: "°C", how: "DSC bosqichli o'zgarish (midpoint)" },
    { symbol: "Tc", name: "Kristallanish", unit: "°C", how: "DSC ekzo cho'qqi (sovutish)" },
  ],
}

// ─── TGA/DTG/DSC simulyatsiya ma'lumotlari — CaC₂O₄·H₂O uchun (kengaytirilgan)
const TGA_FULL = [
  { temp: 25,   mass: 100.0, dtg: 0,     dsc: 0,    event: "Boshlang'ich" },
  { temp: 60,   mass: 100.0, dtg: 0,     dsc: 0,    event: "Barqaror" },
  { temp: 100,  mass: 100.0, dtg: -0.5,  dsc: -2,   event: "H₂O yaqinlashadi" },
  { temp: 120,  mass: 94.3,  dtg: -3.5,  dsc: -18,  event: "Endo — H₂O ajralishi (max)" },
  { temp: 145,  mass: 87.7,  dtg: -1.2,  dsc: -8,   event: "Dehidratatsiya tugadi" },
  { temp: 180,  mass: 87.7,  dtg: 0,     dsc: 0,    event: "CaC₂O₄ barqaror" },
  { temp: 300,  mass: 87.7,  dtg: 0,     dsc: 0,    event: "CaC₂O₄ barqaror" },
  { temp: 400,  mass: 87.7,  dtg: -0.3,  dsc: -3,   event: "CO ajralish boshlanishi" },
  { temp: 450,  mass: 78.0,  dtg: -4.5,  dsc: -25,  event: "Endo — CO chiqishi (max)" },
  { temp: 500,  mass: 68.5,  dtg: -1.0,  dsc: -6,   event: "CaCO₃ hosil bo'ldi" },
  { temp: 600,  mass: 68.5,  dtg: 0,     dsc: 0,    event: "CaCO₃ barqaror" },
  { temp: 700,  mass: 68.5,  dtg: -0.5,  dsc: -4,   event: "CO₂ ajralish boshi" },
  { temp: 750,  mass: 55.0,  dtg: -5.5,  dsc: -30,  event: "Endo — CO₂ chiqishi (max)" },
  { temp: 800,  mass: 38.4,  dtg: -1.0,  dsc: -8,   event: "CaO hosil bo'ldi" },
  { temp: 900,  mass: 38.4,  dtg: 0,     dsc: 0,    event: "CaO barqaror" },
  { temp: 1000, mass: 38.4,  dtg: 0,     dsc: 0,    event: "CaO barqaror" },
]

// ─── 12 klassik parchalanish
const CLASSIC_DECOMPOSITIONS = [
  { compound: "CaC₂O₄·H₂O", steps: "H₂O(120°C) → CO(450°C) → CO₂(750°C)", residue: "CaO", ea: "88, 165, 195 kJ/mol", model: "R₃, F₁, R₃" },
  { compound: "CuSO₄·5H₂O", steps: "4H₂O(110°C) → H₂O(200°C) → SO₃(650°C)", residue: "CuO", ea: "80, 120, 240 kJ/mol", model: "A₂, F₁, R₂" },
  { compound: "[Cu(NH₃)₄]SO₄·H₂O", steps: "H₂O(90°C) → 4NH₃(220°C) → SO₃(600°C)", residue: "CuO", ea: "60, 95, 220 kJ/mol", model: "F₁, A₂, R₃" },
  { compound: "[Co(NH₃)₆]Cl₃", steps: "NH₃ 2 bosqich (150-350°C) → Cl (500°C)", residue: "CoCl₂→Co₃O₄", ea: "110, 150 kJ/mol", model: "F₁, R₃" },
  { compound: "NiC₂O₄·2H₂O", steps: "2H₂O(230°C) → C₂O₄²⁻(370°C)", residue: "NiO yoki Ni", ea: "95, 180 kJ/mol", model: "A₂, R₃" },
  { compound: "K₂[PtCl₄]", steps: "Cl₂(400°C) → K deqozitsiya", residue: "Pt", ea: "205 kJ/mol", model: "R₃" },
  { compound: "MgC₂O₄·2H₂O", steps: "2H₂O(200°C) → CO+CO₂(500°C)", residue: "MgO", ea: "82, 175 kJ/mol", model: "A₂, F₁" },
  { compound: "[Cr(H₂O)₆]Cl₃", steps: "6H₂O bosqichli (100-250°C)", residue: "CrCl₃→Cr₂O₃", ea: "70, 140 kJ/mol", model: "F₁, R₂" },
  { compound: "FeSO₄·7H₂O", steps: "6H₂O(100°C) → H₂O(300°C) → SO₃(600°C)", residue: "Fe₂O₃", ea: "65, 105, 220 kJ/mol", model: "A₂, F₁, R₃" },
  { compound: "[Ni(en)₃]Cl₂", steps: "en 3 bosqich (200-400°C)", residue: "NiCl₂", ea: "125, 155, 190 kJ/mol", model: "F₁×3" },
  { compound: "Al₂(SO₄)₃·18H₂O", steps: "16H₂O(120°C) → 2H₂O(340°C) → SO₃(800°C)", residue: "Al₂O₃", ea: "58, 130, 260 kJ/mol", model: "A₂, F₁, R₃" },
  { compound: "CaCO₃ (kalsit)", steps: "CO₂(825°C)", residue: "CaO", ea: "195 kJ/mol", model: "R₃" },
]

// ─── 10 qiziqarli fakt
const FACTS = [
  { title: "Duval katalogi", text: "Fransuz Clément Duval (1963) 1000+ birikma uchun termogrammalar to'plagan — «Inorganic Thermogravimetric Analysis». Bugungi kunda ham ma'lumotnoma sifatida ishlatiladi." },
  { title: "ICTA (hozirgi ICTAC)", text: "International Confederation for Thermal Analysis and Calorimetry (1965 yildan). Termik tahlil nomenklaturasi, standartlari va kinetika tavsiyalari (2011) shu tashkilotdan chiqadi." },
  { title: "STA — bir vaqtda TGA+DSC", text: "Simultaneous Thermal Analysis — bitta namunada TGA va DSC bir vaqtda o'lchanadi. Netzsch STA 449 F1 Jupiter — soha standarti." },
  { title: "Roberts-Austen — birinchi DTA", text: "William Chandler Roberts-Austen (1899) — ingliz metallurgi — birinchi bo'lib metallar sovutish egri chiziqlarini differensial usulda o'lchagan. Uning nomida «austenit» faza turadi." },
  { title: "Sisplatin va termik tahlil", text: "cis-[Pt(NH₃)₂Cl₂] va trans-izomeri deyarli bir xil TGA beradi, lekin DSC da farqli suyuqlanish (270°C dekomp vs 315°C) — izomeriya isboti." },
  { title: "Perkin-Elmer DSC (1963)", text: "Watson va O'Neill birinchi power-compensation DSC ni ixtiro qildi. Bu ikki kichik pech (namuna va mos) mustaqil boshqariladi — ΔT = 0 saqlanadi, energiya ΔH ga aylanadi." },
  { title: "TG-MS bog'lanishi", text: "TGA chiqindi gazi bevosita mass-spektrometrga uzatiladi (Skimmer/kapillyar). H₂O (m/z=18), CO (28), CO₂ (44), NH₃ (17) — real vaqtda ko'rish mumkin." },
  { title: "Kissinger 1957", text: "Homer Kissinger (NIST) — bir tenglama bilan aktivlanish energiyasini olishning eng oddiy usulini yaratdi. 4700+ iqtiboslar — termik tahlil tarixidagi eng ko'p iqtibos qilingan maqola." },
  { title: "ICTAC 2011 tavsiyalari", text: "Vyazovkin va boshq. (Thermochim. Acta 520, 1) — model-free tahlil oltin standart. Kamida 3-5 qizdirish tezligi, α = 0.05–0.95 oralig'ida Eₐ hisoblash tavsiya etiladi." },
  { title: "Kompensatsion effekt", text: "ln A ↔ Eₐ o'rtasida ko'p birikmalar uchun chiziqli bog'lanish topilgan (Zsakó, Constable). Bu ko'p mexanizmli parchalanishlarda «soxta» korrelyatsiya bo'lishi mumkin." },
]

// ─── Kengaytiruvchi usullar
const EXTENSIONS = [
  { name: "TG-MS", desc: "TGA + mass-spektrometr — chiqindi gazlarni identifikatsiyalash (H₂O, CO, CO₂, NOₓ, SOₓ)", benefit: "Real vaqtda gaz tarkibi" },
  { name: "TG-FTIR", desc: "TGA + Fourier IQ — gaz molekulalarining IQ spektri", benefit: "Molekulyar identifikatsiya (CO vs CO₂)" },
  { name: "DSC-XRD", desc: "DSC + Rentgen difraksiyasi (in-situ)", benefit: "Faza o'tishlarini strukturaviy tasdiqlash" },
  { name: "HP-DTA", desc: "Yuqori bosimli DTA (10–100 bar)", benefit: "Sanoat sharoitlarini modellashtirish" },
  { name: "Micro-DSC", desc: "Yuqori sezgirlikdagi DSC (nW darajasida)", benefit: "Biologik namunalar, ozgina termal effektlar" },
  { name: "Fast-scan DSC", desc: "Chip-DSC, 10 000 °C/s tezlik", benefit: "Meta-barqaror fazalar (masalan, amorf metallar)" },
]

// TGA/DTG/DSC grafik parametrlari
const TEMP_MIN = 25
const TEMP_MAX = 1000

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT — TERMIK TAHLIL PREMIUM SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function TermikTahlilPage() {
  // ─── State: modal, sliderlar, tab-lar, kalkulyatorlar
  const [showIntro, setShowIntro] = useState(true)
  const [tempSlider, setTempSlider] = useState(120)
  const [beta, setBeta] = useState(10) // qizdirish tezligi °C/min
  const [selectedModel, setSelectedModel] = useState("F1")
  const [alphaSlider, setAlphaSlider] = useState(0.5)
  const [activeTab, setActiveTab] = useState("TGA")
  const [showAllModels, setShowAllModels] = useState(false)

  // ─── Kissinger kalkulyatori (3 nuqta uchun)
  const [tp1, setTp1] = useState(420) // °C, β=5
  const [tp2, setTp2] = useState(438) // °C, β=10
  const [tp3, setTp3] = useState(465) // °C, β=20

  // ─── Massa yo'qotish → n(H₂O) kalkulyatori
  const [molMass, setMolMass] = useState(266.45) // [Cr(H₂O)₆]Cl₃
  const [percentLoss, setPercentLoss] = useState(40.6)

  // ─── DSC → ΔH kalkulyatori
  const [dscArea, setDscArea] = useState(250) // mJ
  const [sampleMass, setSampleMass] = useState(5.0) // mg
  const [molarMassDsc, setMolarMassDsc] = useState(249.68) // CuSO4·5H2O

  // ─── TGA egri chizig'i uchun massa (interpolatsiya)
  const currentTGA = useMemo(() => {
    for (let i = 0; i < TGA_FULL.length - 1; i++) {
      if (tempSlider >= TGA_FULL[i].temp && tempSlider <= TGA_FULL[i + 1].temp) {
        const t1 = TGA_FULL[i], t2 = TGA_FULL[i + 1]
        const frac = (tempSlider - t1.temp) / (t2.temp - t1.temp)
        return {
          mass: (t1.mass + (t2.mass - t1.mass) * frac).toFixed(2),
          dtg: (t1.dtg + (t2.dtg - t1.dtg) * frac).toFixed(2),
          dsc: (t1.dsc + (t2.dsc - t1.dsc) * frac).toFixed(1),
          event: t1.event,
        }
      }
    }
    return { mass: "38.4", dtg: "0", dsc: "0", event: "CaO barqaror" }
  }, [tempSlider])

  // ─── f(α) va g(α) hisoblash (tanlangan model uchun)
  const modelValues = useMemo(() => {
    const a = Math.max(0.001, Math.min(0.999, alphaSlider))
    const models = {
      F1:  { f: 1 - a,                                     g: -Math.log(1 - a) },
      F2:  { f: Math.pow(1 - a, 2),                        g: 1 / (1 - a) - 1 },
      F3:  { f: Math.pow(1 - a, 3),                        g: (1 / Math.pow(1 - a, 2) - 1) / 2 },
      A2:  { f: 2 * (1 - a) * Math.pow(-Math.log(1 - a), 0.5),  g: Math.pow(-Math.log(1 - a), 0.5) },
      A3:  { f: 3 * (1 - a) * Math.pow(-Math.log(1 - a), 2/3),  g: Math.pow(-Math.log(1 - a), 1/3) },
      R2:  { f: 2 * Math.pow(1 - a, 0.5),                  g: 1 - Math.pow(1 - a, 0.5) },
      R3:  { f: 3 * Math.pow(1 - a, 2/3),                  g: 1 - Math.pow(1 - a, 1/3) },
      D1:  { f: 1 / (2 * a),                               g: a * a },
      D2:  { f: -1 / Math.log(1 - a),                      g: (1 - a) * Math.log(1 - a) + a },
      D3:  { f: (3 * Math.pow(1 - a, 2/3)) / (2 * (1 - Math.pow(1 - a, 1/3))),
             g: Math.pow(1 - Math.pow(1 - a, 1/3), 2) },
      D4:  { f: 3 / (2 * (Math.pow(1 - a, -1/3) - 1)),
             g: 1 - (2 * a / 3) - Math.pow(1 - a, 2/3) },
      B1:  { f: a * (1 - a),                               g: Math.log(a / (1 - a)) },
      P2:  { f: 2 * Math.pow(a, 0.5),                      g: Math.pow(a, 0.5) },
      P3:  { f: 3 * Math.pow(a, 2/3),                      g: Math.pow(a, 1/3) },
      P4:  { f: 4 * Math.pow(a, 3/4),                      g: Math.pow(a, 1/4) },
    }
    return models[selectedModel] || models.F1
  }, [alphaSlider, selectedModel])

  // ─── Kissinger Eₐ hisobi (3 nuqta)
  const kissingerResult = useMemo(() => {
    const R = 8.314 // J/(mol·K)
    const T1 = tp1 + 273.15, T2 = tp2 + 273.15, T3 = tp3 + 273.15
    const b1 = 5, b2 = 10, b3 = 20  // °C/min (qizdirish tezliklari)
    // Kissinger: y = ln(β/T²), x = 1/T, qiyalik m = -Eₐ/R
    const xArr = [1/T1, 1/T2, 1/T3]
    const yArr = [Math.log(b1/(T1*T1)), Math.log(b2/(T2*T2)), Math.log(b3/(T3*T3))]
    const xMean = (xArr[0]+xArr[1]+xArr[2])/3
    const yMean = (yArr[0]+yArr[1]+yArr[2])/3
    let num = 0, den = 0
    for (let i = 0; i < 3; i++) {
      num += (xArr[i] - xMean) * (yArr[i] - yMean)
      den += (xArr[i] - xMean) * (xArr[i] - xMean)
    }
    const slope = num / den
    const Ea = -slope * R / 1000 // kJ/mol
    const lnA = yMean - slope * xMean + Math.log(Ea*1000/R)
    const A = Math.exp(lnA)
    return { Ea: Ea.toFixed(1), A: A.toExponential(2), slope: slope.toFixed(1) }
  }, [tp1, tp2, tp3])

  // ─── n(H₂O) hisobi
  const nH2O = useMemo(() => {
    const massLost = molMass * (percentLoss / 100)
    return (massLost / 18.015).toFixed(2)
  }, [molMass, percentLoss])

  // ─── DSC → ΔH hisobi
  const dHResult = useMemo(() => {
    const dH_perGram = dscArea / sampleMass // mJ/mg = J/g
    const dH_perMol = (dH_perGram * molarMassDsc) / 1000 // kJ/mol
    return { perGram: dH_perGram.toFixed(2), perMol: dH_perMol.toFixed(2) }
  }, [dscArea, sampleMass, molarMassDsc])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-purple-100">

      {/* ═══════════════════ MODAL — KIRISH OGOHLANTIRISHI ═══════════════════ */}
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-gradient-to-br from-red-950 via-orange-950 to-slate-900 border-2 border-orange-500/60 rounded-3xl p-8 shadow-2xl shadow-orange-500/30 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-2">Ilmiy ogohlantirish • Kirish</div>
                <h2 className="text-3xl font-black text-orange-100">🔥 Termik tahlilga sayohatingizdan oldin</h2>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="text-orange-300 hover:text-white text-2xl px-3 py-1 hover:bg-orange-800/40 rounded-lg transition">✕</button>
            </div>

            <div className="space-y-4 text-orange-100 text-sm leading-relaxed">
              <p className="text-orange-200">
                <strong className="text-yellow-300">Termik tahlil (Thermal Analysis, TA)</strong> — bu moddaning
                <em> nazorat qilinadigan harorat dasturi</em> ta'sirida <strong>fizik yoki kimyoviy xossalarini</strong>
                haroratning yoki vaqtning funksiyasi sifatida o'lchaydigan usullar oilasidir
                (<span className="text-orange-300">ICTAC ta'rifi, 2014</span>).
              </p>

              <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-4">
                <p className="font-bold text-yellow-300 mb-2">⚗️ Nazariy asos ikki ustunga tayanadi:</p>
                <ul className="space-y-1 text-orange-200 pl-4 list-disc">
                  <li><strong>Termodinamika</strong> — jarayon <em>mumkinmi</em>? (ΔG, ΔH, ΔS)</li>
                  <li><strong>Kimyoviy kinetika</strong> — jarayon <em>qanchalik tez</em>? (k, Eₐ, A, f(α))</li>
                </ul>
              </div>

              <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4">
                <p className="font-bold text-red-300 mb-2">📐 Arrhenius tenglamasi — sahifaning bel bog'laydigan tenglamasi:</p>
                <p className="text-center text-2xl font-mono text-yellow-200 py-2">k(T) = A · exp(−Eₐ / RT)</p>
                <p className="text-red-200 text-xs">bu erda <em>k</em> — tezlik konstantasi, <em>A</em> — pre-eksponensial faktor (to'qnashuv chastotasi), <em>Eₐ</em> — aktivlanish energiyasi, <em>R</em> = 8.314 J/(mol·K).</p>
              </div>

              <p className="text-orange-200">
                <strong className="text-yellow-300">Nima uchun koordinatsion kimyoda muhim?</strong>
                Chunki termik tahlil <strong>ichki va tashqi sfera</strong> ligandlarini birinchi navbatda ajratib beradi,
                <strong> gidrat izomeriya</strong>ni bevosita isbotlaydi, va parchalanish bosqichlarining
                <strong> Eₐ</strong> qiymatlaridan <em>bog' kuchini</em> baholashga imkon beradi.
              </p>

              <div className="bg-slate-800/60 border border-orange-800/40 rounded-xl p-4">
                <p className="font-bold text-orange-300 mb-2">📚 Bu sahifada nima o'rganasiz (18 bo'lim)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-orange-200">
                  <div>1. Termik tahlilning fizik asosi</div>
                  <div>2. 7 xil usul (TGA/DTG/DTA/DSC/TMA/DMA/EGA)</div>
                  <div>3. Harorat sohalari va energetika</div>
                  <div>4. Fizik va kimyoviy jarayonlar</div>
                  <div>5. Arrhenius va Eyring nazariyasi</div>
                  <div>6. Termodinamika (ΔH, ΔS, ΔG, Cp)</div>
                  <div>7. Kinetika — 17+ f(α) model</div>
                  <div>8. Model-free usullar (Kissinger, OFW, KAS, Friedman)</div>
                  <div>9. Model-based (Coats-Redfern)</div>
                  <div>10. Interaktiv TGA/DTG/DSC simulyatsiya</div>
                  <div>11. 12 klassik parchalanish</div>
                  <div>12. Gidrat izomeriya</div>
                  <div>13. Asbob printsipi (heat-flux, power-comp DSC)</div>
                  <div>14. TG-MS, TG-FTIR — hyphenated usullar</div>
                  <div>15. Namuna tayyorlash va atmosfera</div>
                  <div>16. 8 bosqichli laboratoriya tartibi</div>
                  <div>17. 4 ta interaktiv kalkulyator</div>
                  <div>18. Kengaytiruvchi usullar va xulosalar</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowIntro(false)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-xl text-white font-bold shadow-lg shadow-orange-500/40 transition">
                🚀 Boshlash — termik dunyoga kirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ HEADER (STICKY) ═══════════════════ */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-950/85 border-b border-orange-800/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-500/40">TA</div>
            <div>
              <div className="text-xs text-orange-400 uppercase tracking-widest">JDA Kimyo • Premium Scientific</div>
              <h1 className="text-lg font-black text-orange-100">Termik tahlil — TGA / DTG / DTA / DSC</h1>
            </div>
          </div>
          <nav className="hidden md:flex gap-3 text-sm">
            <Link href="/ilmiy/tahlil" className="text-orange-300 hover:text-white">← Tahlil usullari</Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="px-3 py-1 rounded-lg bg-red-600/80 text-white hover:bg-red-500">Katalog →</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-800/40 bg-gradient-to-br from-orange-950/60 via-red-950/40 to-slate-900/60 p-10 shadow-2xl shadow-red-900/20">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-red-500/10 blur-3xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.35em] text-orange-400 mb-3">Termik tahlil moduli • Premium</div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-300 via-red-300 to-purple-300 bg-clip-text text-transparent leading-tight">
              Termik tahlil — Modda haroratning bosimi ostida
            </h1>
            <p className="mt-4 text-orange-200 text-lg max-w-4xl leading-relaxed">
              <strong className="text-yellow-300">TGA</strong> massa yo'qotishni,
              <strong className="text-yellow-300"> DTG</strong> uning tezligini,
              <strong className="text-yellow-300"> DTA</strong> harorat farqini,
              <strong className="text-yellow-300"> DSC</strong> issiqlik oqimini o'lchaydi.
              Bularning barchasi bitta savolga javob beradi: <em>modda harorat oshganida qanday o'zgaradi?</em>
              Koordinatsion birikmalar uchun bu <strong className="text-orange-300">gidrat izomeriya, ichki/tashqi sfera farqi va bog' kuchini</strong> bevosita ochib beradi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-200 text-xs">Arrhenius kinetikasi</span>
              <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-200 text-xs">17+ f(α) model</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs">Kissinger • OFW • KAS • Friedman</span>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-200 text-xs">ICTAC 2011 standarti</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs">TG-MS • TG-FTIR</span>
            </div>
          </div>
        </div>

        {/* ══════ 1. NIMA UCHUN VA QANDAY? ══════ */}
        <div>
          <SectionHeader n="01" title="Nima uchun termik tahlil?" subtitle="Kirish — fizik-kimyoviy asos" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
              <h3 className="text-orange-300 font-bold mb-3 text-lg">🔥 Fizik mohiyat</h3>
              <p className="text-orange-100 leading-relaxed">
                Harorat oshgan sari <strong className="text-yellow-300">atomlarning tebranish amplitudasi</strong> Boltzmann taqsimoti bo'yicha ortadi.
                Yetarli energiya (E ≥ Eₐ) hosil bo'lganda bog'lar uziladi, faza o'zgaradi yoki gaz ajraladi.
                Bu jarayonlar <em>massa</em> (TGA) yoki <em>issiqlik</em> (DSC) o'lchamlariga bevosita aks etadi.
              </p>
              <p className="mt-3 text-xs text-orange-400 italic">Manba: Brown M. E. — Introduction to Thermal Analysis, 2nd ed., Ch. 1</p>
            </div>
            <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
              <h3 className="text-red-300 font-bold mb-3 text-lg">⚛️ Koordinatsion kimyoda qo'llanishi</h3>
              <ul className="text-orange-100 space-y-2 text-sm list-disc pl-5">
                <li><strong>Ichki vs tashqi sfera</strong> suvni ajratish (Werner klassik dalili)</li>
                <li><strong>Gidrat izomeriya</strong>ni bevosita isbotlash (CrCl₃·6H₂O 3 izomeri)</li>
                <li><strong>M–L bog' kuchini</strong> Eₐ orqali baholash</li>
                <li><strong>Sisplatin turg'unligi</strong> — dori-darmon industriyasi</li>
                <li><strong>Katalizator prekursori</strong> parchalanishi (metallocenlar)</li>
                <li><strong>MOF/COF</strong> — poristik materiallarning termik chegarasi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ══════ 2. TERMIK USULLAR OILASI (7 tekhnik) ══════ */}
        <div>
          <SectionHeader n="02" title="Termik tahlil usullari oilasi" subtitle="7 asosiy texnika — nima o'lchaydi va nima ochib beradi" />
          <div className="overflow-x-auto rounded-2xl border border-orange-800/40 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-orange-950 to-red-950 text-orange-200">
                <tr>
                  <th className="px-4 py-3 text-left">Qisq.</th>
                  <th className="px-4 py-3 text-left">To'liq nomi</th>
                  <th className="px-4 py-3 text-left">O'lchanadi</th>
                  <th className="px-4 py-3 text-left">Birlik</th>
                  <th className="px-4 py-3 text-left">Nimani beradi</th>
                  <th className="px-4 py-3 text-left">Ixtirochi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-900/40 text-orange-100">
                {TERMIK_DATA.methods.map((m, i) => (
                  <tr key={i} className="hover:bg-orange-900/20 transition">
                    <td className="px-4 py-3 font-black text-yellow-300">{m.abbr}</td>
                    <td className="px-4 py-3">{m.uz}</td>
                    <td className="px-4 py-3 font-mono text-emerald-300">{m.measure}</td>
                    <td className="px-4 py-3 text-orange-300">{m.unit}</td>
                    <td className="px-4 py-3 text-xs">{m.detects}</td>
                    <td className="px-4 py-3 text-xs italic text-orange-400">{m.inventor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════ 3. HARORAT SOHALARI ══════ */}
        <div>
          <SectionHeader n="03" title="Harorat sohalari va energetika" subtitle="Kriyogenikadan ultra-yuqorigacha" />
          <div className="grid md:grid-cols-5 gap-3">
            {TERMIK_DATA.temperatureRegions.map((r, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/80 to-orange-950/40 border border-orange-800/40 rounded-2xl p-4 hover:border-orange-500/70 transition">
                <div className="text-yellow-300 font-bold text-sm mb-1">{r.name}</div>
                <div className="text-2xl font-mono text-orange-300">{r.range}</div>
                <p className="text-xs text-orange-200 mt-2">{r.note}</p>
                <div className="mt-3 text-xs text-red-300">🔬 {r.instrument}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 4. FIZIK VA KIMYOVIY JARAYONLAR ══════ */}
        <div>
          <SectionHeader n="04" title="Fizik va kimyoviy termik jarayonlar" subtitle="Endo/ekzotermik — belgi va misollar" />
          <div className="grid md:grid-cols-2 gap-4">
            {TERMIK_DATA.processTypes.map((p, i) => {
              const isEndo = p.sign.includes(">")
              return (
                <div key={i} className={`bg-slate-900/60 border rounded-2xl p-5 ${isEndo ? "border-blue-500/40" : "border-red-500/40"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-bold ${isEndo ? "text-blue-300" : "text-red-300"}`}>{p.type}</h4>
                    <span className={`text-xs font-mono px-2 py-1 rounded ${isEndo ? "bg-blue-900/40 text-blue-200" : "bg-red-900/40 text-red-200"}`}>{p.sign}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.examples.map((e, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded bg-slate-800/70 text-orange-200 border border-slate-700">{e}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-sm text-orange-300 italic">
            💡 <strong>DSC belgisi konventsiyasi:</strong> IUPAC bo'yicha endotermik jarayonlar pastga (↓), ekzotermik yuqoriga (↑). Perkin-Elmer va TA Instruments teskari konventsiyani ishlatishi mumkin — doim <em>egzo/endo strelkasini</em> tekshiring.
          </p>
        </div>

        {/* ══════ 5. ARRHENIUS VA EYRING NAZARIYASI ══════ */}
        <div>
          <SectionHeader n="05" title="Arrhenius va Eyring — kinetika asosi" subtitle="Bog' uzilishining energetikasi" />
          <div className="bg-gradient-to-br from-red-950/40 via-slate-900/60 to-orange-950/30 border border-red-500/40 rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-mono text-yellow-300 mb-2">{TERMIK_DATA.arrhenius.equation}</div>
              <div className="text-sm font-mono text-orange-300">Chiziqli shakli: {TERMIK_DATA.arrhenius.lnForm}</div>
            </div>
            <div className="grid md:grid-cols-4 gap-3 mb-6">
              {TERMIK_DATA.arrhenius.params.map((p, i) => (
                <div key={i} className="bg-slate-800/70 border border-orange-800/40 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-yellow-300">{p.symbol}</div>
                  <div className="text-orange-200 text-sm font-semibold mt-1">{p.name}</div>
                  <div className="text-xs text-emerald-300 mt-1 font-mono">{p.unit}</div>
                  <p className="text-xs text-orange-300 mt-2">{p.note}</p>
                </div>
              ))}
            </div>
            <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-5">
              <p className="text-purple-300 font-bold mb-2">🌟 Eyring tenglamasi (o'tish holati nazariyasi)</p>
              <p className="text-center text-lg font-mono text-yellow-200 py-2">{TERMIK_DATA.arrhenius.eyring}</p>
              <p className="text-purple-200 text-sm">
                Bu erda k<sub>B</sub> = 1.381×10⁻²³ J/K — Boltzmann konstantasi, h = 6.626×10⁻³⁴ J·s — Plank konstantasi.
                Arrhenius <em>empirik</em>, Eyring <em>nazariy asoslangan</em> (Henry Eyring, 1935). Munosabat: Eₐ = ΔH‡ + RT.
              </p>
            </div>
          </div>
        </div>

        {/* ══════ 6. TERMODINAMIKA ══════ */}
        <div>
          <SectionHeader n="06" title="Termodinamik kattaliklar" subtitle="DSC dan olinadigan asosiy parametrlar" />
          <div className="overflow-x-auto rounded-2xl border border-orange-800/40 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-orange-950 to-red-950 text-orange-200">
                <tr>
                  <th className="px-4 py-3 text-left">Belgi</th>
                  <th className="px-4 py-3 text-left">Nomi</th>
                  <th className="px-4 py-3 text-left">Birlik</th>
                  <th className="px-4 py-3 text-left">Qanday olinadi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-900/40 text-orange-100">
                {TERMIK_DATA.thermodynamics.map((t, i) => (
                  <tr key={i} className="hover:bg-orange-900/20">
                    <td className="px-4 py-3 font-black text-yellow-300 text-xl">{t.symbol}</td>
                    <td className="px-4 py-3">{t.name}</td>
                    <td className="px-4 py-3 text-emerald-300 font-mono">{t.unit}</td>
                    <td className="px-4 py-3 text-xs text-orange-200">{t.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-5">
              <p className="text-blue-300 font-bold mb-2">Gibbs qonuni</p>
              <p className="text-center text-xl font-mono text-yellow-200 py-2">ΔG = ΔH − TΔS</p>
              <p className="text-blue-200 text-xs">ΔG &lt; 0 — jarayon o'z-o'zidan boradi</p>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-5">
              <p className="text-emerald-300 font-bold mb-2">Van't Hoff</p>
              <p className="text-center text-xl font-mono text-yellow-200 py-2">d(ln K)/dT = ΔH/(RT²)</p>
              <p className="text-emerald-200 text-xs">Muvozanat konstantasi va harorat bog'liqligi</p>
            </div>
            <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-5">
              <p className="text-purple-300 font-bold mb-2">Kirchhoff</p>
              <p className="text-center text-xl font-mono text-yellow-200 py-2">d(ΔH)/dT = ΔCp</p>
              <p className="text-purple-200 text-xs">ΔH ning haroratga bog'liqligi</p>
            </div>
          </div>
        </div>

        {/* ══════ 7. KINETIK MODELLAR — INTERAKTIV TANLASH ══════ */}
        <div>
          <SectionHeader n="07" title="Kinetik modellar — f(α) va g(α)" subtitle="17+ ICTAC model — interaktiv tanlagich va real vaqtda hisoblash" />
          <div className="bg-slate-900/60 border border-orange-800/40 rounded-3xl p-6 mb-6">
            <p className="text-orange-200 leading-relaxed mb-3">
              Umumiy kinetik tenglama (izotermal yoki non-izotermal):
            </p>
            <p className="text-center text-2xl font-mono text-yellow-200 py-3 bg-slate-950/60 rounded-xl">
              dα/dt = k(T) · f(α) = A · exp(−Eₐ/RT) · f(α)
            </p>
            <p className="text-orange-300 text-sm mt-3 text-center">
              Bu erda α — <strong>konversiya darajasi</strong> (0 dan 1 gacha): α = (m₀ − m)/(m₀ − mₑ). Non-izotermal: dα/dT = (A/β)·exp(−Eₐ/RT)·f(α).
            </p>
          </div>

          {/* Interaktiv model tanlagich */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900/80 to-orange-950/40 border border-orange-500/40 rounded-2xl p-6">
              <label className="block text-orange-300 font-bold mb-2">🎯 Kinetik model tanlash</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-800 border border-orange-500/40 rounded-lg px-4 py-3 text-orange-100 font-mono">
                <option value="F1">F₁ — First order (Mampel)</option>
                <option value="F2">F₂ — Second order</option>
                <option value="F3">F₃ — Third order</option>
                <option value="A2">A₂ — Avrami-Erofeev (2D nukleatsiya)</option>
                <option value="A3">A₃ — Avrami-Erofeev (3D nukleatsiya)</option>
                <option value="R2">R₂ — Contracting area (silindrik)</option>
                <option value="R3">R₃ — Contracting volume (sferik)</option>
                <option value="D1">D₁ — 1D diffusion (Parabolic)</option>
                <option value="D2">D₂ — 2D diffusion (Valensi)</option>
                <option value="D3">D₃ — 3D diffusion (Jander)</option>
                <option value="D4">D₄ — 3D diffusion (Ginstling-Brounshtein)</option>
                <option value="B1">B₁ — Prout-Tompkins (avtokataliz)</option>
                <option value="P2">P₂ — Power law n=2</option>
                <option value="P3">P₃ — Power law n=3</option>
                <option value="P4">P₄ — Power law n=4</option>
              </select>

              <label className="block text-orange-300 font-bold mt-6 mb-2">
                α (konversiya darajasi) = <span className="text-yellow-300 font-mono text-xl">{alphaSlider.toFixed(3)}</span>
              </label>
              <input
                type="range" min="0.01" max="0.99" step="0.01"
                value={alphaSlider}
                onChange={(e) => setAlphaSlider(parseFloat(e.target.value))}
                className="w-full accent-orange-500" />
              <div className="flex justify-between text-xs text-orange-400 mt-1">
                <span>0 (boshi)</span>
                <span>0.5 (yarim)</span>
                <span>1 (oxiri)</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 rounded-lg p-4 text-center border border-emerald-500/30">
                  <div className="text-xs text-emerald-300 mb-1">f(α) — differensial</div>
                  <div className="text-2xl font-mono text-emerald-200">{isFinite(modelValues.f) ? modelValues.f.toFixed(4) : "→∞"}</div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-4 text-center border border-blue-500/30">
                  <div className="text-xs text-blue-300 mb-1">g(α) — integral</div>
                  <div className="text-2xl font-mono text-blue-200">{isFinite(modelValues.g) ? modelValues.g.toFixed(4) : "→∞"}</div>
                </div>
              </div>
            </div>

            {/* SVG grafik — f(α) va g(α) egri chizig'i */}
            <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
              <div className="text-orange-300 font-bold mb-3 text-center">f(α) va g(α) egri chiziqlari</div>
              <FGCurve model={selectedModel} currentAlpha={alphaSlider} />
              <p className="text-xs text-orange-400 italic text-center mt-3">
                Yashil — f(α), Ko'k — g(α). Vertikal chiziq — joriy α qiymati.
              </p>
            </div>
          </div>

          {/* Modellar to'liq jadvali */}
          <div className="mt-6">
            <button
              onClick={() => setShowAllModels(!showAllModels)}
              className="w-full px-6 py-3 bg-orange-800/40 hover:bg-orange-700/50 border border-orange-500/40 rounded-xl text-orange-200 font-semibold transition">
              {showAllModels ? "🔼 Barcha 17 modelni yashirish" : "🔽 Barcha 17 kinetik modelni ko'rish"}
            </button>
            {showAllModels && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-orange-800/40 bg-slate-900/60">
                <table className="w-full text-xs">
                  <thead className="bg-gradient-to-r from-orange-950 to-red-950 text-orange-200">
                    <tr>
                      <th className="px-3 py-2 text-left">Kod</th>
                      <th className="px-3 py-2 text-left">Nomi</th>
                      <th className="px-3 py-2 text-left">f(α) — differensial</th>
                      <th className="px-3 py-2 text-left">g(α) — integral</th>
                      <th className="px-3 py-2 text-left">Mexanizm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-900/40 text-orange-100">
                    {TERMIK_DATA.kineticModels.map((k, i) => (
                      <tr key={i} className={`hover:bg-orange-900/20 ${selectedModel === k.code ? "bg-orange-900/30" : ""}`}>
                        <td className="px-3 py-2 font-black text-yellow-300">{k.code}</td>
                        <td className="px-3 py-2">{k.name}</td>
                        <td className="px-3 py-2 font-mono text-emerald-300">{k.falpha}</td>
                        <td className="px-3 py-2 font-mono text-blue-300">{k.galpha}</td>
                        <td className="px-3 py-2 text-orange-300">{k.mech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ══════ 8. MODEL-FREE USULLAR ══════ */}
        <div>
          <SectionHeader n="08" title="Model-free (izokonversion) usullar" subtitle="ICTAC 2011 tavsiyasi — mexanizmni bilmasdan Eₐ hisoblash" />
          <div className="space-y-4">
            {TERMIK_DATA.modelFreeMethods.map((m, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/70 to-red-950/30 border border-red-500/40 rounded-2xl p-6">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="text-red-300 font-bold text-lg">{m.name} <span className="text-orange-400 text-sm">({m.year})</span></h4>
                </div>
                <p className="text-center text-lg font-mono text-yellow-200 py-3 bg-slate-950/60 rounded-lg mb-3">{m.equation}</p>
                <p className="text-orange-100 text-sm mb-3">{m.description}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-3">
                    <span className="text-emerald-300 font-bold text-xs">➕ Afzalliklari:</span>
                    <p className="text-emerald-100 text-xs mt-1">{m.pros}</p>
                  </div>
                  <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-3">
                    <span className="text-red-300 font-bold text-xs">➖ Kamchiliklari:</span>
                    <p className="text-red-100 text-xs mt-1">{m.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 9. MODEL-BASED USULLAR ══════ */}
        <div>
          <SectionHeader n="09" title="Model-based usullar" subtitle="Muayyan f(α) modelini taxmin qiladi" />
          <div className="grid md:grid-cols-3 gap-4">
            {TERMIK_DATA.modelBasedMethods.map((m, i) => (
              <div key={i} className="bg-slate-900/60 border border-purple-500/40 rounded-2xl p-5">
                <h4 className="text-purple-300 font-bold mb-1">{m.name}</h4>
                <div className="text-xs text-purple-400 mb-3">({m.year})</div>
                <p className="text-xs font-mono text-yellow-200 bg-slate-950/60 rounded p-2 mb-2 break-all">{m.equation}</p>
                <p className="text-purple-200 text-xs">{m.description}</p>
                <p className="text-orange-300 text-xs italic mt-2">💡 {m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 10. INTERAKTIV TGA/DTG/DSC SIMULYATSIYA ══════ */}
        <div>
          <SectionHeader n="10" title="Interaktiv TGA / DTG / DSC simulyatsiyasi" subtitle="CaC₂O₄·H₂O — klassik namuna (Duval, 1963)" />

          <div className="grid md:grid-cols-3 gap-2 mb-4">
            {["TGA", "DTG", "DSC", "BARCHASI"].map((t) => (
              <button key={t}
                onClick={() => setActiveTab(t)}
                className={`py-3 rounded-xl font-bold transition ${activeTab === t
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/40"
                  : "bg-slate-800/60 text-orange-300 hover:bg-slate-700/60 border border-orange-800/40"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="bg-slate-950/70 border border-orange-500/40 rounded-3xl p-6">
            <TGADTGDSC activeTab={activeTab} tempSlider={tempSlider} />

            <div className="mt-6">
              <label className="block text-orange-300 font-bold mb-2">
                🌡️ Harorat = <span className="text-yellow-300 font-mono text-2xl">{tempSlider}°C</span>
                <span className="text-orange-400 text-sm ml-2">({(tempSlider + 273.15).toFixed(1)} K)</span>
              </label>
              <input
                type="range" min={TEMP_MIN} max={TEMP_MAX} step="5"
                value={tempSlider}
                onChange={(e) => setTempSlider(parseInt(e.target.value))}
                className="w-full accent-orange-500" />
              <div className="flex justify-between text-xs text-orange-400 mt-1">
                <span>25°C</span>
                <span>250°C</span>
                <span>500°C</span>
                <span>750°C</span>
                <span>1000°C</span>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-4 gap-3">
              <div className="bg-orange-950/40 border border-orange-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-orange-300">Massa qoldi</div>
                <div className="text-3xl font-black text-yellow-300">{currentTGA.mass}%</div>
              </div>
              <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-red-300">DTG (dm/dT)</div>
                <div className="text-3xl font-black text-red-200">{currentTGA.dtg} <span className="text-sm">%/°C</span></div>
              </div>
              <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-purple-300">DSC signal</div>
                <div className="text-3xl font-black text-purple-200">{currentTGA.dsc} <span className="text-sm">mW</span></div>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-emerald-300">Hodisa</div>
                <div className="text-sm font-bold text-emerald-200 mt-2">{currentTGA.event}</div>
              </div>
            </div>

            {/* Parchalanish sxemasi */}
            <div className="mt-6 bg-slate-900/60 rounded-xl p-4 border border-orange-800/40">
              <p className="text-orange-300 font-bold text-sm mb-3">🔬 Parchalanish sxemasi:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className={`px-3 py-2 rounded-lg font-mono ${tempSlider < 120 ? "bg-orange-500 text-white" : "bg-slate-800 text-orange-300"}`}>CaC₂O₄·H₂O</span>
                <span className="text-red-400">—{'>'}</span>
                <span className="text-xs text-red-300">−H₂O<br/>(120°C)</span>
                <span className={`px-3 py-2 rounded-lg font-mono ${tempSlider >= 120 && tempSlider < 450 ? "bg-orange-500 text-white" : "bg-slate-800 text-orange-300"}`}>CaC₂O₄</span>
                <span className="text-red-400">—{'>'}</span>
                <span className="text-xs text-red-300">−CO<br/>(450°C)</span>
                <span className={`px-3 py-2 rounded-lg font-mono ${tempSlider >= 450 && tempSlider < 750 ? "bg-orange-500 text-white" : "bg-slate-800 text-orange-300"}`}>CaCO₃</span>
                <span className="text-red-400">—{'>'}</span>
                <span className="text-xs text-red-300">−CO₂<br/>(750°C)</span>
                <span className={`px-3 py-2 rounded-lg font-mono ${tempSlider >= 750 ? "bg-orange-500 text-white" : "bg-slate-800 text-orange-300"}`}>CaO</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ 11. 12 KLASSIK PARCHALANISH ══════ */}
        <div>
          <SectionHeader n="11" title="12 klassik parchalanish" subtitle="Aniqlangan Eₐ va kinetik modellar bilan (adabiyot bo'yicha)" />
          <div className="overflow-x-auto rounded-2xl border border-orange-800/40 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-orange-950 to-red-950 text-orange-200">
                <tr>
                  <th className="px-3 py-3 text-left">Birikma</th>
                  <th className="px-3 py-3 text-left">Parchalanish bosqichlari</th>
                  <th className="px-3 py-3 text-left">Qoldiq</th>
                  <th className="px-3 py-3 text-left">Eₐ (kJ/mol)</th>
                  <th className="px-3 py-3 text-left">Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-900/40 text-orange-100">
                {CLASSIC_DECOMPOSITIONS.map((d, i) => (
                  <tr key={i} className="hover:bg-orange-900/20">
                    <td className="px-3 py-3 font-mono font-bold text-yellow-300">{d.compound}</td>
                    <td className="px-3 py-3 text-xs">{d.steps}</td>
                    <td className="px-3 py-3 text-emerald-300 font-bold">{d.residue}</td>
                    <td className="px-3 py-3 text-red-300 font-mono">{d.ea}</td>
                    <td className="px-3 py-3 text-purple-300 font-mono">{d.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-orange-400 italic mt-3">
            Manba: Wendlandt W. W. — Thermal Methods of Analysis; Gallagher P. K. — Handbook of Thermal Analysis (Vol. 2, Ch. 4).
          </p>
        </div>

        {/* ══════ 12. GIDRAT IZOMERIYA ══════ */}
        <div>
          <SectionHeader n="12" title="Gidrat izomeriya — termik tahlilning eng chiroyli isboti" subtitle="CrCl₃·6H₂O — uch xil izomer, uch xil termogramma" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/60 border border-purple-500/40 rounded-2xl p-5">
              <div className="text-3xl mb-2">🟣</div>
              <p className="text-purple-200 font-bold">[Cr(H₂O)₆]Cl₃</p>
              <p className="text-purple-300 text-xs italic mb-2">Binafsha — barcha 6 ta H₂O ichki sferada</p>
              <div className="bg-slate-950/60 rounded-lg p-3 text-xs">
                <p className="text-orange-200">TGA: faqat T ≥ 200°C da suv ajraladi</p>
                <p className="text-yellow-300 font-mono mt-2">6 H₂O = 40.6% massa</p>
                <p className="text-red-300 mt-1">Eₐ ≈ 140 kJ/mol (barcha ichki)</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/60 border border-emerald-500/40 rounded-2xl p-5">
              <div className="text-3xl mb-2">🟢</div>
              <p className="text-emerald-200 font-bold">[CrCl(H₂O)₅]Cl₂·H₂O</p>
              <p className="text-emerald-300 text-xs italic mb-2">Och yashil — 5 ichki + 1 tashqi</p>
              <div className="bg-slate-950/60 rounded-lg p-3 text-xs">
                <p className="text-orange-200">TGA: 80°C da 1 H₂O (tashqi), 200°C da 5 H₂O</p>
                <p className="text-yellow-300 font-mono mt-2">6.8% + 33.8% ikki bosqich</p>
                <p className="text-red-300 mt-1">Eₐ: 55 va 130 kJ/mol</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-900/50 to-slate-900/60 border border-teal-500/40 rounded-2xl p-5">
              <div className="text-3xl mb-2">🟦</div>
              <p className="text-teal-200 font-bold">[CrCl₂(H₂O)₄]Cl·2H₂O</p>
              <p className="text-teal-300 text-xs italic mb-2">To'q yashil — 4 ichki + 2 tashqi</p>
              <div className="bg-slate-950/60 rounded-lg p-3 text-xs">
                <p className="text-orange-200">TGA: 80°C da 2 H₂O (tashqi), 220°C da 4 H₂O</p>
                <p className="text-yellow-300 font-mono mt-2">13.5% + 27.1% ikki bosqich</p>
                <p className="text-red-300 mt-1">Eₐ: 50 va 125 kJ/mol</p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-yellow-950/40 border border-yellow-500/40 rounded-xl p-5">
            <p className="text-yellow-300 font-bold mb-2">💡 Muhim xulosa (Werner nazariyasining termik isboti):</p>
            <p className="text-yellow-100 text-sm">
              Bir xil <strong>brutto formula</strong> (CrCl₃·6H₂O) uch xil <strong>termogramma</strong> beradi —
              chunki ichki (koordinatsion) va tashqi (kristall) suv turli haroratlarda ajraladi.
              Bu <strong>gidrat izomeriya</strong>ning eng aniq eksperimental dalili.
              Ichki sfera suvi Cr–O bog' bilan bog'langan (ΔEₐ ≈ 70–80 kJ/mol farq).
            </p>
          </div>
        </div>

        {/* ══════ 13. ASBOB PRINTSIPI ══════ */}
        <div>
          <SectionHeader n="13" title="Asbob printsipi — TGA va DSC" subtitle="Mikrotarozi, termopara, heat-flux vs power-comp" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900/70 to-red-950/30 border border-orange-500/40 rounded-2xl p-6">
              <h4 className="text-orange-300 font-bold text-lg mb-3">⚖️ TGA (termobalance) tuzilishi</h4>
              <ul className="text-orange-100 text-sm space-y-2 list-disc pl-5">
                <li><strong>Ultra-mikrotarozi</strong> — 0.1 μg aniqlik (Cahn tipida)</li>
                <li><strong>Furnace (pech)</strong> — Pt-Rh sim, Tₘₐₓ = 1600°C</li>
                <li><strong>Termopara</strong> — Pt/Pt-Rh (S tur), ±0.5°C aniqlik</li>
                <li><strong>Krucible (tigel)</strong> — Al (600°C), Al₂O₃ (1600°C), Pt (1400°C)</li>
                <li><strong>Gaz tizimi</strong> — protective (N₂) + purge (N₂, He, air, O₂)</li>
                <li><strong>Vakuum imkoniyati</strong> — 10⁻⁶ mbar gacha</li>
              </ul>
              <div className="mt-4 bg-slate-950/60 rounded-lg p-3 text-xs text-orange-300">
                <strong>Ishlab chiqaruvchilar:</strong> TA Instruments (Q5000/Q500),
                Netzsch (TG 209 F1 Libra), Mettler-Toledo (TGA/DSC 3+), Perkin-Elmer (TGA 8000), Setaram, Rigaku.
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/70 to-purple-950/30 border border-purple-500/40 rounded-2xl p-6">
              <h4 className="text-purple-300 font-bold text-lg mb-3">🔥 DSC — ikki xil printsip</h4>
              <div className="space-y-4">
                <div className="bg-slate-950/50 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-sm">1) Heat-flux DSC (issiqlik oqimi)</p>
                  <p className="text-purple-200 text-xs mt-1">
                    Ikki tigel bitta pechda, ular orasidagi ΔT → Φ = ΔT/Rₑff (Newton qonuni).
                    Manba: Boersma tipida. Assbob: Mettler, TA Q2000, Netzsch DSC 214.
                  </p>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-sm">2) Power-compensation DSC</p>
                  <p className="text-purple-200 text-xs mt-1">
                    Ikki mustaqil kichik pech, ΔT = 0 ushlab turiladi. Kerakli qo'shimcha quvvat = dQ/dt.
                    Perkin-Elmer patenti (1963). Yuqori aniqlik (aniq Cp).
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-purple-950/40 rounded-lg p-3 text-xs text-purple-200">
                💡 <strong>Kalibrlash:</strong> In (156.6°C, ΔHf = 28.5 J/g), Zn (419.5°C), Al (660.3°C) etalon namunalarda.
              </div>
            </div>
          </div>
        </div>

        {/* ══════ 14A. NAMUNA TAYYORLASH ══════ */}
        <div>
          <SectionHeader n="14" title="Namuna tayyorlash va atmosfera nazorati" subtitle="Krucible, gaz, massa, morfologiya — hammasi natijaga ta'sir qiladi" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
              <h4 className="text-orange-300 font-bold mb-3">🧪 Krucible (tigel) tanlash</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-orange-900/40 pb-2"><span className="text-orange-200">Al (aluminium)</span><span className="text-yellow-300 font-mono">≤ 600°C, ochiq/yopiq</span></div>
                <div className="flex justify-between border-b border-orange-900/40 pb-2"><span className="text-orange-200">Al₂O₃ (alumina)</span><span className="text-yellow-300 font-mono">≤ 1600°C, inert</span></div>
                <div className="flex justify-between border-b border-orange-900/40 pb-2"><span className="text-orange-200">Pt (platina)</span><span className="text-yellow-300 font-mono">≤ 1400°C, katalitik</span></div>
                <div className="flex justify-between border-b border-orange-900/40 pb-2"><span className="text-orange-200">Grafit</span><span className="text-yellow-300 font-mono">≤ 2400°C, faqat inert atm.</span></div>
                <div className="flex justify-between"><span className="text-orange-200">Kvarts / silika</span><span className="text-yellow-300 font-mono">≤ 1000°C, arzon</span></div>
              </div>
              <p className="mt-4 text-xs text-red-300 italic">⚠️ Pt — organik namunalarda katalitik yonishga sabab bo'ladi (Al₂O₃ xavfsizroq).</p>
            </div>

            <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
              <h4 className="text-orange-300 font-bold mb-3">🌬️ Atmosfera turi</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-500/30">
                  <span className="text-blue-300 font-bold">Inert (N₂, Ar, He)</span>
                  <p className="text-blue-100 text-xs mt-1">Faqat termik parchalanish. Metallar reduktsiyalanmaydi.</p>
                </div>
                <div className="bg-red-950/40 rounded-lg p-3 border border-red-500/30">
                  <span className="text-red-300 font-bold">Oksidlovchi (havo, O₂)</span>
                  <p className="text-red-100 text-xs mt-1">Yonish + parchalanish. Kul (ash) qoladi. TGA-DSC ekzo cho'qqilar.</p>
                </div>
                <div className="bg-emerald-950/40 rounded-lg p-3 border border-emerald-500/30">
                  <span className="text-emerald-300 font-bold">Qaytaruvchi (H₂/N₂, 5%)</span>
                  <p className="text-emerald-100 text-xs mt-1">Metall oksidlarni Me ga qaytarish. Xavfli — ehtiyot.</p>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 border border-purple-500/30">
                  <span className="text-purple-300 font-bold">Vakuum (10⁻⁶ mbar)</span>
                  <p className="text-purple-100 text-xs mt-1">Uchuvchi mahsulotlar tez ajraladi, past T da parchalanish.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-950/30 border border-yellow-500/40 rounded-2xl p-5">
            <p className="text-yellow-300 font-bold mb-2">⚡ Massa va zarracha o'lchami ta'siri (ICTAC 2011 tavsiyalari):</p>
            <ul className="text-yellow-100 text-sm space-y-1 list-disc pl-5">
              <li><strong>Kichik massa</strong> (2–10 mg) — issiqlik gradiyentini kamaytiradi, tez teng vaznlanish</li>
              <li><strong>Nozik kukun</strong> (&lt; 100 μm) — diffuziya cheklovlarini yo'q qiladi</li>
              <li><strong>Yupqa qatlam</strong> (≤ 1 mm) — gaz chiqishini osonlashtiradi</li>
              <li><strong>Qizdirish tezligi</strong> (β) — kinetik tahlil uchun 3–5 xil qiymat (2, 5, 10, 20, 40 °C/min)</li>
            </ul>
          </div>
        </div>

        {/* ══════ 15. HYPHENATED USULLAR (avvalgi bo'lim) ══════ */}
        <div>
          <SectionHeader n="15" title="Hyphenated usullar — TG-MS, TG-FTIR, EGA" subtitle="Ajralayotgan gaz nima? Real vaqtda javob" />
          <div className="bg-slate-900/60 border border-orange-800/40 rounded-2xl p-6">
            <p className="text-orange-200 mb-4 text-sm leading-relaxed">
              <strong className="text-yellow-300">Evolved Gas Analysis (EGA)</strong> — termik tahlilning eng kuchli kengaytmasi.
              TGA yoki STA asbobidan chiqqan gazlar to'g'ridan-to'g'ri <strong>mass-spektrometr</strong> yoki <strong>FTIR gaz hujayrasi</strong>ga
              yuboriladi. Natijada har bir massa yo'qotish bosqichida <em>qanday molekula</em> chiqayotganini bilamiz.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 rounded-xl p-4 border border-emerald-500/40">
                <p className="text-emerald-300 font-bold mb-2">TG-MS (mass-spektrometr)</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=18</span><br/>H₂O</div>
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=17</span><br/>NH₃, OH</div>
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=28</span><br/>CO, N₂</div>
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=32</span><br/>O₂, S</div>
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=44</span><br/>CO₂, N₂O</div>
                  <div className="bg-emerald-900/40 rounded p-2 text-center"><span className="text-yellow-300 font-mono">m/z=64</span><br/>SO₂</div>
                </div>
                <p className="text-emerald-200 text-xs mt-3">Interfeys: <em>Skimmer</em> (kvarts kapillyar, T ≤ 300°C).</p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-blue-500/40">
                <p className="text-blue-300 font-bold mb-2">TG-FTIR (infraqizil)</p>
                <div className="space-y-1 text-xs text-blue-200">
                  <p><span className="font-mono text-yellow-300">3700–3200</span> cm⁻¹ — ν(O–H) suv</p>
                  <p><span className="font-mono text-yellow-300">3400–3200</span> cm⁻¹ — ν(N–H) ammiak</p>
                  <p><span className="font-mono text-yellow-300">2360, 2340</span> cm⁻¹ — νₐₛ(O=C=O)</p>
                  <p><span className="font-mono text-yellow-300">2143</span> cm⁻¹ — ν(C≡O)</p>
                  <p><span className="font-mono text-yellow-300">1370, 1150</span> cm⁻¹ — ν(S=O) SO₂/SO₃</p>
                  <p><span className="font-mono text-yellow-300">970, 930</span> cm⁻¹ — ν(N–H₃) NH₃</p>
                </div>
                <p className="text-blue-200 text-xs mt-3">Interfeys: <em>gaz o'tkazma</em> (T ≈ 200°C, Teflon liner).</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ 16. LABORATORIYA TARTIBI ══════ */}
        <div>
          <SectionHeader n="16" title="8 bosqichli laboratoriya tartibi" subtitle="TGA-DSC eksperimentini boshdan oxirigacha" />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { n: 1, title: "Namuna tayyorlash", desc: "5–10 mg nozik kukun, quruq (P₂O₅ desikkator ustida). Kristall gidratlar uchun — chuvimasin." },
              { n: 2, title: "Krucible tanlash", desc: "Al₂O₃ (yuqori T) yoki Al (past T). Referens tigel bo'sh yoki inert (masalan, prokalitilingan Al₂O₃)." },
              { n: 3, title: "Asbob kalibrlash", desc: "Etalonlar: In, Zn, Al (DSC uchun Tm va ΔHf). TGA uchun CaC₂O₄·H₂O yoki CuSO₄·5H₂O." },
              { n: 4, title: "Atmosfera tanlash", desc: "N₂ (inert), havo (yonish), H₂/N₂ (reduktsiya). Purge oqim: 20–100 ml/min." },
              { n: 5, title: "Qizdirish dasturi", desc: "25–75 °C/min tanlash. Kinetik tahlil uchun 3–5 xil β (2, 5, 10, 20, 40 °C/min)." },
              { n: 6, title: "Baseline korreksiyasi", desc: "Bo'sh tigel bilan takroriy o'lchov. TGA — fon subtraksiyasi. DSC — Cp sapfir usuli." },
              { n: 7, title: "Ma'lumot yig'ish", desc: "TG, DTG, DSC egri chiziqlarni birga chiqarish. Cho'qqi haroratlarini onset/peak/end sifatida belgilash." },
              { n: 8, title: "Kinetik tahlil", desc: "Kissinger (bir Eₐ), OFW/KAS (α bo'yicha profil), Coats-Redfern (mexanizm). ICTAC 2011 talablari." },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 bg-slate-900/60 border border-orange-800/40 rounded-xl p-4 hover:border-orange-500/60 transition">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black">{s.n}</div>
                <div>
                  <p className="font-bold text-orange-200">{s.title}</p>
                  <p className="text-xs text-orange-100 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 17. 4 TA KALKULYATOR ══════ */}
        <div>
          <SectionHeader n="17" title="Interaktiv kalkulyatorlar" subtitle="n(H₂O), Kissinger Eₐ, DSC ΔH — real hisoblash" />

          <div className="grid md:grid-cols-2 gap-6">
            {/* KALK 1: n(H2O) massa yo'qotishdan */}
            <div className="bg-gradient-to-br from-slate-900/80 to-blue-950/30 border border-blue-500/40 rounded-2xl p-6">
              <h4 className="text-blue-300 font-bold text-lg mb-3">💧 Kalk. 1 — n(H₂O) massa yo'qotishdan</h4>
              <p className="text-blue-200 text-xs mb-4">Formula: n(H₂O) = M · (Δm%/100) / 18.015</p>
              <label className="block text-blue-200 text-sm mb-1">Molyar massa M (g/mol)</label>
              <input type="number" value={molMass} onChange={(e) => setMolMass(parseFloat(e.target.value))} step="0.01"
                className="w-full bg-slate-800 border border-blue-500/40 rounded-lg px-3 py-2 text-blue-100 font-mono mb-3" />
              <label className="block text-blue-200 text-sm mb-1">Massa yo'qotish (%)</label>
              <input type="number" value={percentLoss} onChange={(e) => setPercentLoss(parseFloat(e.target.value))} step="0.1"
                className="w-full bg-slate-800 border border-blue-500/40 rounded-lg px-3 py-2 text-blue-100 font-mono mb-4" />
              <div className="bg-slate-950/60 rounded-xl p-4 text-center border border-yellow-500/40">
                <div className="text-xs text-yellow-300 mb-1">Suv molekulalari soni</div>
                <div className="text-4xl font-black text-yellow-200">{nH2O}</div>
                <div className="text-xs text-yellow-400 mt-1">n(H₂O)</div>
              </div>
              <p className="text-xs text-blue-300 italic mt-3">Standart: [Cr(H₂O)₆]Cl₃ — M=266.45, Δm=40.6% → n=6</p>
            </div>

            {/* KALK 2: Kissinger Ea */}
            <div className="bg-gradient-to-br from-slate-900/80 to-red-950/30 border border-red-500/40 rounded-2xl p-6">
              <h4 className="text-red-300 font-bold text-lg mb-3">⚡ Kalk. 2 — Kissinger Eₐ (3 nuqta)</h4>
              <p className="text-red-200 text-xs mb-4">ln(β/Tp²) = ln(AR/Eₐ) − Eₐ/(R·Tp)</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <label className="text-xs text-red-300">Tp @ β=5</label>
                  <input type="number" value={tp1} onChange={(e) => setTp1(parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-red-500/40 rounded px-2 py-2 text-red-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-red-300">Tp @ β=10</label>
                  <input type="number" value={tp2} onChange={(e) => setTp2(parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-red-500/40 rounded px-2 py-2 text-red-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-red-300">Tp @ β=20</label>
                  <input type="number" value={tp3} onChange={(e) => setTp3(parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-red-500/40 rounded px-2 py-2 text-red-100 font-mono text-sm" />
                </div>
              </div>
              <p className="text-xs text-red-400 mb-3">(harorat °C da, qizdirish tezligi °C/min)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 rounded-xl p-3 text-center border border-yellow-500/40">
                  <div className="text-xs text-yellow-300 mb-1">Eₐ</div>
                  <div className="text-2xl font-black text-yellow-200">{kissingerResult.Ea}</div>
                  <div className="text-xs text-yellow-400">kJ/mol</div>
                </div>
                <div className="bg-slate-950/60 rounded-xl p-3 text-center border border-emerald-500/40">
                  <div className="text-xs text-emerald-300 mb-1">A (pre-eks.)</div>
                  <div className="text-2xl font-black text-emerald-200">{kissingerResult.A}</div>
                  <div className="text-xs text-emerald-400">s⁻¹</div>
                </div>
              </div>
              <p className="text-xs text-red-300 italic mt-3">Qiyalik = {kissingerResult.slope} K</p>
            </div>

            {/* KALK 3: DSC ΔH */}
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-950/30 border border-purple-500/40 rounded-2xl p-6">
              <h4 className="text-purple-300 font-bold text-lg mb-3">🔥 Kalk. 3 — DSC dan ΔH</h4>
              <p className="text-purple-200 text-xs mb-4">ΔH = (cho'qqi maydoni)/m · M</p>
              <label className="block text-purple-200 text-sm mb-1">Cho'qqi maydoni (mJ)</label>
              <input type="number" value={dscArea} onChange={(e) => setDscArea(parseFloat(e.target.value))} step="1"
                className="w-full bg-slate-800 border border-purple-500/40 rounded-lg px-3 py-2 text-purple-100 font-mono mb-2" />
              <label className="block text-purple-200 text-sm mb-1">Namuna massasi (mg)</label>
              <input type="number" value={sampleMass} onChange={(e) => setSampleMass(parseFloat(e.target.value))} step="0.1"
                className="w-full bg-slate-800 border border-purple-500/40 rounded-lg px-3 py-2 text-purple-100 font-mono mb-2" />
              <label className="block text-purple-200 text-sm mb-1">Molyar massa (g/mol)</label>
              <input type="number" value={molarMassDsc} onChange={(e) => setMolarMassDsc(parseFloat(e.target.value))} step="0.01"
                className="w-full bg-slate-800 border border-purple-500/40 rounded-lg px-3 py-2 text-purple-100 font-mono mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 rounded-xl p-3 text-center border border-yellow-500/40">
                  <div className="text-xs text-yellow-300 mb-1">ΔH (per gram)</div>
                  <div className="text-xl font-black text-yellow-200">{dHResult.perGram}</div>
                  <div className="text-xs text-yellow-400">J/g</div>
                </div>
                <div className="bg-slate-950/60 rounded-xl p-3 text-center border border-emerald-500/40">
                  <div className="text-xs text-emerald-300 mb-1">ΔH (per mol)</div>
                  <div className="text-xl font-black text-emerald-200">{dHResult.perMol}</div>
                  <div className="text-xs text-emerald-400">kJ/mol</div>
                </div>
              </div>
            </div>

            {/* KALK 4: Arrhenius k(T) */}
            <div className="bg-gradient-to-br from-slate-900/80 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-6">
              <h4 className="text-emerald-300 font-bold text-lg mb-3">📈 Kalk. 4 — Arrhenius k(T) simulyatsiya</h4>
              <p className="text-emerald-200 text-xs mb-4">Kissinger natijasidan k(T) hisoblash: k = A·exp(−Eₐ/RT)</p>
              <label className="block text-emerald-200 text-sm mb-1">Harorat T (°C) = <span className="text-yellow-300 font-mono">{tempSlider}</span></label>
              <p className="text-xs text-emerald-400 mb-4">(bu qiymat yuqoridagi asosiy slayder bilan bog'langan)</p>
              <div className="bg-slate-950/60 rounded-xl p-4 mb-3">
                <p className="text-emerald-200 text-xs mb-1">Kalk. 2 dan olingan qiymatlar bilan:</p>
                <p className="text-xs text-emerald-300">Eₐ = {kissingerResult.Ea} kJ/mol, A = {kissingerResult.A} s⁻¹</p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-4 text-center border border-yellow-500/40">
                <div className="text-xs text-yellow-300 mb-1">Tezlik konstantasi k(T)</div>
                <div className="text-2xl font-black text-yellow-200 font-mono">
                  {(parseFloat(kissingerResult.A.replace(/e[+-]?\d+/i, "")) *
                    Math.pow(10, parseInt(kissingerResult.A.split("e")[1] || 0)) *
                    Math.exp(-parseFloat(kissingerResult.Ea) * 1000 / (8.314 * (tempSlider + 273.15)))).toExponential(2)}
                </div>
                <div className="text-xs text-yellow-400">s⁻¹</div>
              </div>
              <p className="text-xs text-emerald-300 italic mt-3">Yarim-emirilish davri: t½ = ln(2)/k</p>
            </div>
          </div>
        </div>

        {/* ══════ 18. QIZIQARLI FAKTLAR ══════ */}
        <div>
          <SectionHeader n="18" title="10 qiziqarli fakt" subtitle="Termik tahlil tarixi va afsonalari" />
          <div className="grid md:grid-cols-2 gap-4">
            {FACTS.map((f, i) => (
              <div key={i} className="bg-slate-900/60 border-l-4 border-orange-500 rounded-lg p-4">
                <p className="font-bold text-yellow-300 mb-1">{f.title}</p>
                <p className="text-orange-100 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 19. KENGAYTIRUVCHI USULLAR ══════ */}
        <div>
          <SectionHeader n="19" title="Zamonaviy kengaytmalar" subtitle="Termik tahlilning yangi ufqlari" />
          <div className="grid md:grid-cols-3 gap-4">
            {EXTENSIONS.map((e, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/70 to-purple-950/30 border border-purple-500/40 rounded-2xl p-5 hover:border-purple-400/60 transition">
                <div className="text-purple-300 font-bold text-lg mb-2">{e.name}</div>
                <p className="text-purple-100 text-sm mb-2">{e.desc}</p>
                <p className="text-xs text-yellow-300 italic">✨ {e.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ 20. XULOSA ══════ */}
        <div>
          <SectionHeader n="20" title="Xulosa — 10 asosiy tushuncha" subtitle="Termik tahlil bo'yicha egallashingiz kerak bo'lgan bilim" />
          <div className="bg-gradient-to-br from-orange-950/50 via-red-950/40 to-slate-900/60 border border-orange-500/40 rounded-3xl p-8">
            <ol className="space-y-3 text-orange-100 list-decimal list-inside marker:text-yellow-300 marker:font-black">
              <li><strong className="text-yellow-300">Termik tahlil</strong> — harorat funksiyasi sifatida fizik/kimyoviy xossalarni o'lchash (ICTAC ta'rifi).</li>
              <li>Asosiy 4 usul: <strong className="text-orange-300">TGA</strong> (massa), <strong className="text-orange-300">DTG</strong> (dm/dt), <strong className="text-orange-300">DTA</strong> (ΔT), <strong className="text-orange-300">DSC</strong> (dQ/dt).</li>
              <li>Nazariy asos: <strong className="text-yellow-300">termodinamika</strong> (ΔG, ΔH, ΔS) + <strong className="text-yellow-300">kinetika</strong> (Arrhenius, Eyring).</li>
              <li><strong className="text-red-300">Ichki va tashqi sfera</strong> ligandlar har xil haroratda ajraladi — gidrat izomeriyaning bevosita isboti.</li>
              <li>17+ kinetik model f(α)/g(α) — <strong>F, A, R, D, B, P</strong> oilalari (ICTAC ro'yxati).</li>
              <li>Model-free usullar: <strong className="text-emerald-300">Kissinger, OFW, KAS, Friedman, Vyazovkin</strong> — mexanizmni bilmasdan Eₐ beradi.</li>
              <li>ICTAC 2011: kamida <strong>3–5 xil qizdirish tezligi</strong>, α = 0.05–0.95 oralig'ida hisoblash tavsiya etiladi.</li>
              <li>DSC dan ΔH, Cp, Tg, Tm, Tc; <strong>heat-flux</strong> (Mettler) va <strong>power-compensation</strong> (Perkin-Elmer) turlari.</li>
              <li>Hyphenated <strong className="text-blue-300">TG-MS / TG-FTIR</strong> — ajralayotgan gazlarni real vaqtda identifikatsiyalash.</li>
              <li>Namuna massasi, morfologiyasi, atmosferasi va qizdirish tezligi — <strong className="text-yellow-300">to'rt kilit parametr</strong>.</li>
            </ol>
          </div>
        </div>

        {/* ══════ NAVIGATSIYA ══════ */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/tahlil/elektrokimyo" className="px-6 py-3 border border-orange-500/50 rounded-xl hover:bg-orange-800/40 text-orange-300 text-center transition">← Elektrokimyoviy tahlil</Link>
          <Link href="/ilmiy/tahlil/termik/birikmalar" className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-bold text-center shadow-lg shadow-red-500/40 transition">🔥 Termik birikmalar katalogi →</Link>
          <Link href="/ilmiy/tahlil/konduktometriya" className="px-6 py-3 border border-purple-500/50 rounded-xl hover:bg-purple-800/40 text-purple-300 text-center transition">Konduktometriya →</Link>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-orange-800/40 py-8 mt-8 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-orange-300 text-sm mb-3">
            © 2026 <strong>JDA Kimyo</strong> • Koordinatsion kimyo tahlil portali • Termik tahlil moduli (premium)
          </p>
          <div className="text-xs text-orange-400/80 max-w-5xl mx-auto leading-relaxed">
            <strong className="text-orange-300">Asosiy manbalar:</strong><br/>
            • Brown M. E. — <em>Introduction to Thermal Analysis: Techniques and Applications</em> (2nd ed., Kluwer, 2001)<br/>
            • Haines P. J. — <em>Principles of Thermal Analysis and Calorimetry</em> (RSC, 2002)<br/>
            • Gallagher P. K. (ed.) — <em>Handbook of Thermal Analysis and Calorimetry</em> (Vol. 1–5, Elsevier)<br/>
            • Wendlandt W. W. — <em>Thermal Methods of Analysis</em> (3rd ed., Wiley)<br/>
            • Speyer R. F. — <em>Thermal Analysis of Materials</em> (Marcel Dekker, 1994)<br/>
            • Vogel's <em>Quantitative Chemical Analysis</em> (6th ed.)<br/>
            • Vyazovkin S. — <em>Isoconversional Kinetics of Thermally Stimulated Processes</em> (Springer, 2015)<br/>
            • ICTAC Kinetics Committee — Vyazovkin S. et al., <em>Thermochim. Acta</em> 2011, 520, 1–19<br/>
            • Kissinger H. E. — <em>Anal. Chem.</em> 1957, 29, 1702<br/>
            • Ozawa T. — <em>Bull. Chem. Soc. Jpn.</em> 1965, 38, 1881<br/>
            • Coats A. W., Redfern J. P. — <em>Nature</em> 1964, 201, 68<br/>
            • Duval C. — <em>Inorganic Thermogravimetric Analysis</em> (2nd ed., Elsevier, 1963)
          </div>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// KICHIK KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════════

function SectionHeader({ n, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-xs font-mono text-orange-500 tracking-widest">§{n}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">{title}</h2>
      {subtitle && <p className="text-orange-400 text-sm mt-1 italic">{subtitle}</p>}
    </div>
  )
}

// ─── f(α) va g(α) egri chizig'i uchun SVG
function FGCurve({ model, currentAlpha }) {
  const W = 400, H = 260, pad = 30
  const N = 100
  const alphas = Array.from({ length: N + 1 }, (_, i) => 0.005 + (0.99 * i) / N)

  function computeFG(a, m) {
    const models = {
      F1:  { f: 1 - a,                                   g: -Math.log(1 - a) },
      F2:  { f: Math.pow(1 - a, 2),                      g: 1 / (1 - a) - 1 },
      F3:  { f: Math.pow(1 - a, 3),                      g: (1 / Math.pow(1 - a, 2) - 1) / 2 },
      A2:  { f: 2 * (1 - a) * Math.pow(-Math.log(1 - a), 0.5), g: Math.pow(-Math.log(1 - a), 0.5) },
      A3:  { f: 3 * (1 - a) * Math.pow(-Math.log(1 - a), 2/3), g: Math.pow(-Math.log(1 - a), 1/3) },
      R2:  { f: 2 * Math.pow(1 - a, 0.5),                g: 1 - Math.pow(1 - a, 0.5) },
      R3:  { f: 3 * Math.pow(1 - a, 2/3),                g: 1 - Math.pow(1 - a, 1/3) },
      D1:  { f: 1 / (2 * a),                             g: a * a },
      D2:  { f: -1 / Math.log(1 - a),                    g: (1 - a) * Math.log(1 - a) + a },
      D3:  { f: (3 * Math.pow(1 - a, 2/3)) / (2 * (1 - Math.pow(1 - a, 1/3))), g: Math.pow(1 - Math.pow(1 - a, 1/3), 2) },
      D4:  { f: 3 / (2 * (Math.pow(1 - a, -1/3) - 1)),   g: 1 - (2 * a / 3) - Math.pow(1 - a, 2/3) },
      B1:  { f: a * (1 - a),                             g: Math.log(a / (1 - a)) },
      P2:  { f: 2 * Math.pow(a, 0.5),                    g: Math.pow(a, 0.5) },
      P3:  { f: 3 * Math.pow(a, 2/3),                    g: Math.pow(a, 1/3) },
      P4:  { f: 4 * Math.pow(a, 3/4),                    g: Math.pow(a, 1/4) },
    }
    return models[m] || models.F1
  }

  const fValues = alphas.map(a => computeFG(a, model).f).filter(v => isFinite(v))
  const gValues = alphas.map(a => computeFG(a, model).g).filter(v => isFinite(v))
  const fMax = Math.max(...fValues.filter(v => v < 100), 0.001)
  const gMax = Math.max(...gValues.filter(v => v < 100), 0.001)

  const xScale = (a) => pad + (a * (W - 2 * pad))
  const yScaleF = (v) => H - pad - (Math.min(v, fMax) / fMax) * (H - 2 * pad)
  const yScaleG = (v) => H - pad - (Math.min(v, gMax) / gMax) * (H - 2 * pad)

  const pathF = alphas.map((a, i) => {
    const v = computeFG(a, model).f
    if (!isFinite(v) || v > 100) return null
    return `${i === 0 ? "M" : "L"} ${xScale(a)} ${yScaleF(v)}`
  }).filter(Boolean).join(" ")

  const pathG = alphas.map((a, i) => {
    const v = computeFG(a, model).g
    if (!isFinite(v) || v > 100) return null
    return `${i === 0 ? "M" : "L"} ${xScale(a)} ${yScaleG(v)}`
  }).filter(Boolean).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* fon panjara */}
      {[0, 0.25, 0.5, 0.75, 1].map((a, i) => (
        <line key={i} x1={xScale(a)} y1={pad} x2={xScale(a)} y2={H - pad} stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
      ))}
      {/* o'qlar */}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#fb923c" strokeWidth="1.5" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#fb923c" strokeWidth="1.5" />
      {/* egri chiziqlar */}
      <path d={pathF} stroke="#10b981" strokeWidth="2.5" fill="none" />
      <path d={pathG} stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeDasharray="5,3" />
      {/* joriy α chizig'i */}
      <line x1={xScale(currentAlpha)} y1={pad} x2={xScale(currentAlpha)} y2={H - pad} stroke="#fde047" strokeWidth="2" />
      <circle cx={xScale(currentAlpha)} cy={yScaleF(computeFG(currentAlpha, model).f)} r="5" fill="#10b981" />
      <circle cx={xScale(currentAlpha)} cy={yScaleG(computeFG(currentAlpha, model).g)} r="5" fill="#60a5fa" />
      {/* teglar */}
      <text x={W / 2} y={H - 5} fill="#fb923c" fontSize="11" textAnchor="middle">α (konversiya)</text>
      <text x={10} y={H / 2} fill="#fb923c" fontSize="11" transform={`rotate(-90 10 ${H / 2})`}>qiymat</text>
      <text x={W - pad - 5} y={pad + 15} fill="#10b981" fontSize="11" textAnchor="end">f(α)</text>
      <text x={W - pad - 5} y={pad + 30} fill="#60a5fa" fontSize="11" textAnchor="end">g(α) - - -</text>
    </svg>
  )
}

// ─── TGA / DTG / DSC birlashgan grafik
function TGADTGDSC({ activeTab, tempSlider }) {
  const W = 800, H = 340, pad = 45
  const xScale = (t) => pad + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * (W - 2 * pad)
  const yScaleMass = (m) => pad + ((100 - m) / 65) * (H - 2 * pad)  // 100% → top, 35% → bottom
  const yScaleDTG = (d) => H / 2 - (d / 6) * (H / 2 - pad)          // 0 → middle
  const yScaleDSC = (s) => H / 2 - (s / 35) * (H / 2 - pad)         // 0 → middle

  const pathTGA = TGA_FULL.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleMass(p.mass)}`).join(" ")
  const pathDTG = TGA_FULL.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleDTG(p.dtg)}`).join(" ")
  const pathDSC = TGA_FULL.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleDSC(p.dsc)}`).join(" ")

  const showTGA = activeTab === "TGA" || activeTab === "BARCHASI"
  const showDTG = activeTab === "DTG" || activeTab === "BARCHASI"
  const showDSC = activeTab === "DSC" || activeTab === "BARCHASI"

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* panjara */}
      {[25, 200, 400, 600, 800, 1000].map((t, i) => (
        <g key={i}>
          <line x1={xScale(t)} y1={pad} x2={xScale(t)} y2={H - pad} stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
          <text x={xScale(t)} y={H - pad + 15} fill="#fb923c" fontSize="10" textAnchor="middle">{t}°C</text>
        </g>
      ))}
      {[35, 60, 85, 100].map((m, i) => (
        <g key={i}>
          <line x1={pad} y1={yScaleMass(m)} x2={W - pad} y2={yScaleMass(m)} stroke="#4b5563" strokeWidth="0.3" strokeDasharray="1,3" />
          <text x={pad - 5} y={yScaleMass(m) + 3} fill="#fb923c" fontSize="9" textAnchor="end">{m}%</text>
        </g>
      ))}

      {/* o'qlar */}
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#fb923c" strokeWidth="1.5" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#fb923c" strokeWidth="1.5" />

      {/* baseline uchun DTG/DSC */}
      {(showDTG || showDSC) && (
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="#6b7280" strokeWidth="0.5" strokeDasharray="3,3" />
      )}

      {/* TGA egri chiziq */}
      {showTGA && <path d={pathTGA} stroke="#fde047" strokeWidth="3" fill="none" />}
      {/* DTG */}
      {showDTG && <path d={pathDTG} stroke="#f87171" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />}
      {/* DSC */}
      {showDSC && <path d={pathDSC} stroke="#c084fc" strokeWidth="2.5" fill="none" strokeDasharray="2,3" />}

      {/* joriy T chizig'i */}
      <line x1={xScale(tempSlider)} y1={pad} x2={xScale(tempSlider)} y2={H - pad} stroke="#22d3ee" strokeWidth="2" />
      <text x={xScale(tempSlider)} y={pad - 5} fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="bold">{tempSlider}°C</text>

      {/* Legend */}
      <g transform="translate(560, 20)">
        {showTGA && (<><rect x="0" y="0" width="16" height="3" fill="#fde047"/><text x="22" y="5" fill="#fde047" fontSize="11">TGA (massa %)</text></>)}
        {showDTG && (<><rect x="0" y="18" width="16" height="3" fill="#f87171"/><text x="22" y="23" fill="#f87171" fontSize="11">DTG (dm/dT)</text></>)}
        {showDSC && (<><rect x="0" y="36" width="16" height="3" fill="#c084fc"/><text x="22" y="41" fill="#c084fc" fontSize="11">DSC (mW)</text></>)}
      </g>

      {/* teg */}
      <text x={W / 2} y={H - 10} fill="#fb923c" fontSize="12" textAnchor="middle" fontWeight="bold">Harorat (°C)</text>

      {/* Bosqich markerlari */}
      {showTGA && (
        <>
          <circle cx={xScale(120)} cy={yScaleMass(94)} r="4" fill="#22d3ee" />
          <text x={xScale(120)} y={yScaleMass(94) - 8} fill="#22d3ee" fontSize="9" textAnchor="middle">−H₂O</text>
          <circle cx={xScale(450)} cy={yScaleMass(78)} r="4" fill="#22d3ee" />
          <text x={xScale(450)} y={yScaleMass(78) - 8} fill="#22d3ee" fontSize="9" textAnchor="middle">−CO</text>
          <circle cx={xScale(750)} cy={yScaleMass(55)} r="4" fill="#22d3ee" />
          <text x={xScale(750)} y={yScaleMass(55) - 8} fill="#22d3ee" fontSize="9" textAnchor="middle">−CO₂</text>
        </>
      )}
    </svg>
  )
}
