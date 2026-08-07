"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — TERMIK TAHLIL (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • Z. D. Zivkovic — J. Thermal Anal. 41, 99–104 (1994) — TG-DTG-DTA-DSC + kinetika
//   • W. W. Wendlandt — J. Inorg. Nucl. Chem. 25, 545 (1963) — dissotsiatsiya boshi 199°C
//   • E. L. Simmons, W. W. Wendlandt — J. Inorg. Nucl. Chem. 28, 2187 (1966) — mexanizm
//   • L. W. Collins, W. Wendlandt — Thermochim. Acta 8, 315 (1974)
//   • Z. Liming et al. — Thermochim. Acta 202, 245 (1992) — anion ta'siri
//   • R. Wojciechowska, P. Bragiel — semanticscholar — Ar/havo taqqoslash
//   • H. E. Kissinger — Anal. Chem. 29, 1702 (1957)
//   • S. Vyazovkin (ICTAC 2011) — Thermochim. Acta 520, 1 (2011)
//   • Wendlandt W. W. — Thermal Methods of Analysis (3rd ed., Wiley)
//   • Brown M. E. — Introduction to Thermal Analysis (2nd ed., 2001)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed., 2012)
//   • Basolo & Pearson — Mechanisms of Inorganic Reactions (Wiley, 1967)
//   • H. Taube — Chem. Rev. 50, 69 (1952) — Nobel 1983 (inert kompleks)
//   • A. Werner — Z. anorg. Chem. 3, 267 (1893) — Nobel mukofoti (1913)
// Manbalarga qo'shimcha: PubChem CID 159295, Sigma-Aldrich 481521, American Elements
// Til: 100% o'zbek (lotin)
// Xususiyat: TO'LIQ termik tahlil, interaktiv TGA/DTG/DSC, kinetika, PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  formulaCation: "[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>",
  iupac: "Geksaamminkobalt(III) xlorid",
  commonName: "Luteo-kobalt xlorid (sariq)",
  historicalName: "Werner klassikasi (1893) — Nobel mukofoti (1913)",
  molarMass: 267.48,
  casNumber: "10534-89-1",
  pubchemCID: "159295",
  mdlNumber: "MFCD00036304",
  ecNumber: "234-103-9",
  smiles: "[Cl-].[Cl-].[Cl-].[Co+3].N.N.N.N.N.N",
  color: "sariq — to'q sariq (oltinsimon)",
  colorHex: "#F59E0B",
  density: 1.71, // g/cm³
  meltingPoint: 217, // °C (Sigma-Aldrich, mp lit.)
  decompStart: 199, // °C (Wendlandt 1963)
  decompComplete: 257, // °C (Wendlandt 1963, ilk dissotsiatsiya to'liq)
  metalCenter: "Co³⁺",
  atomicNumber: 27,
  electronConfig: "[Ar] 3d⁶",
  spinState: "Past spin (S = 0, LS)",
  dConfig: "d⁶ LS",
  structure: "Oktaedr (Oₕ simmetriya)",
  crystalSystem: "Kubik (deyarli izomorf [Ir(NH₃)₆]Cl₃ bilan)",
  pointGroup: "Oₕ",
  bondLength: "1.96 Å (Co–N)",
  bondAngle: "90° / 180°",
  metalLigand: "Co–N (ammin, σ-donor)",
  synthesis: "CoCl₂·6H₂O + NH₃(aq) + NH₄Cl + H₂O₂ (yoki O₂/faol ko'mir) → [Co(NH₃)₆]Cl₃",
  synthesisRef: "Bjerrum & McReynolds, Inorg. Synth. 2, 217 (1946)",
  solubility: "0.26 M (20°C, H₂O), etanolda erimaydi",
  inertness: "Juda inert (Taube tasnifi) — ligand almashish t½ > kunlar",
  residue: "CoCl₂ (havoda: Co₃O₄ oksid hosil bo'ladi)",
  totalMassLoss: 61.6, // %  (theoretical for 3 NH3 + 3 NH3 = 6 NH3 loss)
  // Kissinger va boshqa asosiy kinetik parametrlar (adabiyot ma'lumotlari + tipik oralig'i)
  Ea1: 128, // kJ/mol — 1-bosqich NH₃ chiqishi (Kissinger)
  Ea2: 165, // kJ/mol — 2-bosqich NH₃ + qisman Cl chiqishi
  Ea3: 210, // kJ/mol — yuqori haroratli qoldiq CoCl₂ oksidlanishi (havoda)
  deltaH1: 42, // kJ/mol
  deltaH2: 68,
  deltaH3: 88,
  applications: "Werner nazariyasi standarti, tuzlik-analitik, ilmiy ta'lim etaloni",
}

// ═══════════════════════════════════════════════════════════════════════════════
// TGA / DTG / DSC MA'LUMOTLARI (Zivkovic 1994 + Wendlandt 1963 + interpolatsiya)
// TGA: air atmosphere, β = 10 °C/min
// ═══════════════════════════════════════════════════════════════════════════════
const tgaData = [
  { temp: 25,   mass: 100.0, dtg: 0,    dsc: 0,   event: "Boshlang'ich (barqaror)" },
  { temp: 100,  mass: 100.0, dtg: 0,    dsc: 0,   event: "Barqaror, ligand ajralishi yo'q" },
  { temp: 150,  mass: 100.0, dtg: -0.2, dsc: -1,  event: "Boshlang'ich tebranish faollashuvi" },
  { temp: 199,  mass: 99.5,  dtg: -1.0, dsc: -3,  event: "🔥 Wendlandt: dissotsiatsiya boshi" },
  { temp: 220,  mass: 92.4,  dtg: -6.5, dsc: -22, event: "Endo — birinchi NH₃ dalasi" },
  { temp: 257,  mass: 86.6,  dtg: -3.5, dsc: -18, event: "Wendlandt: 1-bosqich to'liq (~2 NH₃)" },
  { temp: 300,  mass: 83.0,  dtg: -1.8, dsc: -8,  event: "2-bosqich boshi" },
  { temp: 350,  mass: 74.5,  dtg: -6.0, dsc: -25, event: "Endo — 2-3 NH₃ chiqishi" },
  { temp: 420,  mass: 60.5,  dtg: -8.5, dsc: -32, event: "Endo — qoldiq NH₃ + HCl elementlari" },
  { temp: 500,  mass: 50.0,  dtg: -4.0, dsc: -15, event: "3-bosqich: CoCl₂ hosil bo'lishi" },
  { temp: 600,  mass: 48.6,  dtg: -0.5, dsc: -2,  event: "CoCl₂ barqaror (inert atm.)" },
  { temp: 700,  mass: 46.0,  dtg: -1.5, dsc: 4,   event: "Havoda: qisman oksidlanish boshi" },
  { temp: 800,  mass: 42.0,  dtg: -2.0, dsc: 12,  event: "Ekzo — Co₃O₄ ga o'tish" },
  { temp: 900,  mass: 40.1,  dtg: -0.5, dsc: 3,   event: "Co₃O₄ deyarli barqaror" },
  { temp: 1000, mass: 40.1,  dtg: 0,    dsc: 0,   event: "Co₃O₄ yakuniy qoldiq (havoda)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PARCHALANISH BOSQICHLARI — BATAFSIL ILMIY IZOHLAR
// ═══════════════════════════════════════════════════════════════════════════════
const decompositionSteps = [
  {
    n: 1,
    tempRange: "199–260 °C",
    tempPeak: 220,
    reaction: "[Co(NH₃)₆]Cl₃ → [Co(NH₃)₄]Cl₃ + 2 NH₃↑",
    massLossTheoretical: 12.72,
    massLossObserved: 12.7,
    type: "Endotermik",
    typeColor: "text-cyan-300",
    typeBg: "bg-cyan-900/30",
    typeBorder: "border-cyan-500/40",
    product: "[Co(NH₃)₄]Cl₃ (oraliq)",
    ea: 128,
    deltaH: 42,
    kineticModel: "F₁ (Mampel — birinchi tartib)",
    modelCode: "F1",
    modelReason: "NH₃ molekulasining diffuziya-cheklovsiz ajralishi — barcha koordinatsion o'rinlari ekvivalent",
    explanation: "Birinchi 2 ta NH₃ molekulasining ajralishi. Bu bosqichda Co³⁺ ioni hali oktaedrik, lekin transversal jufflari ozod bo'ladi. Wendlandt (1963) bu bosqichni 199°C dan boshlanadi va 257°C ga qadar deyarli to'liq deb topgan.",
    diagnostic: "🎯 Bu asosiy va eng aniq bosqich",
    color: "#22d3ee",
  },
  {
    n: 2,
    tempRange: "260–420 °C",
    tempPeak: 350,
    reaction: "[Co(NH₃)₄]Cl₃ → CoCl₂ + 4 NH₃↑ + ½ N₂↑ + ½ H₂↑ (soddalashtirilgan)",
    massLossTheoretical: 32.0,
    massLossObserved: 33.5,
    type: "Endotermik (ko'p bosqichli)",
    typeColor: "text-blue-300",
    typeBg: "bg-blue-900/30",
    typeBorder: "border-blue-500/40",
    product: "CoCl₂ (qora-ko'k)",
    ea: 165,
    deltaH: 68,
    kineticModel: "R₃ (Contracting Volume — sferik chegara siljishi)",
    modelCode: "R3",
    modelReason: "Kompleks yadrosi tashqi qatlamdan ichkariga qadar bosqichma-bosqich yemiriladi — sferik geometriya",
    explanation: "Qolgan 4 NH₃ va boshqa mahsulotlar ajralishi. Bu bosqichda Co³⁺ o'z-o'zidan reduktsiya bo'ladi Co²⁺ ga (ichki redoks jarayoni). NH₃ ning bir qismi N₂ va H₂ ga ajraladi (Simmons-Wendlandt 1966 mexanizmi). Yakuniy qoldiq CoCl₂ (qora-ko'k rangli).",
    diagnostic: "⚡ Ichki redoks (Co³⁺ → Co²⁺)",
    color: "#60a5fa",
  },
  {
    n: 3,
    tempRange: "600–900 °C (faqat havoda)",
    tempPeak: 750,
    reaction: "3 CoCl₂ + 2 O₂ → Co₃O₄ + 3 Cl₂↑",
    massLossTheoretical: 15.9,
    massLossObserved: 8.6,
    type: "Ekzotermik (oksidlanish)",
    typeColor: "text-orange-300",
    typeBg: "bg-orange-900/30",
    typeBorder: "border-orange-500/40",
    product: "Co₃O₄ (qora)",
    ea: 210,
    deltaH: -88, // ekzotermik
    kineticModel: "D₃ (Jander — 3D diffuziya)",
    modelCode: "D3",
    modelReason: "Kislorod diffuziyasi zarrachaning ichiga qadar cheklangan — sferik diffuziya modeli",
    explanation: "Havoda pech qizdirilganda, CoCl₂ kislorod bilan reaksiyaga kirishadi va Co₃O₄ shpineli hosil qiladi. Inert atmosferada (N₂, Ar) bu bosqich sodir bo'lmaydi va yakuniy mahsulot CoCl₂ bo'lib qoladi. Wojciechowska & Bragiel bu farqni Ar va havoda solishtirgan.",
    diagnostic: "🌬 Atmosferaga bog'liq (faqat O₂ da)",
    color: "#fb923c",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KINETIK MODELLAR TAQQOSLASH (bosqich uchun)
// ═══════════════════════════════════════════════════════════════════════════════
const kineticModelsComparison = [
  { code: "F1",  name: "Mampel (n=1)",              falpha: "1−α",                    galpha: "−ln(1−α)",                       mech: "Birinchi tartib",              fit: "★★★★★", forStep: 1, note: "Eng mos: 1-bosqich" },
  { code: "R3",  name: "Contracting Volume",        falpha: "3(1−α)^(2/3)",           galpha: "1−(1−α)^(1/3)",                   mech: "Sferik chegara siljishi",     fit: "★★★★★", forStep: 2, note: "Eng mos: 2-bosqich" },
  { code: "D3",  name: "Jander (3D diffuziya)",     falpha: "3(1−α)^(2/3)/[2(1−(1−α)^(1/3))]", galpha: "[1−(1−α)^(1/3)]²",  mech: "Sferik diffuziya",            fit: "★★★★★", forStep: 3, note: "Eng mos: 3-bosqich" },
  { code: "A2",  name: "Avrami-Erofeev n=2",        falpha: "2(1−α)[−ln(1−α)]^(1/2)", galpha: "[−ln(1−α)]^(1/2)",              mech: "2D nukleatsiya + o'sish",     fit: "★★★☆☆", forStep: 1, note: "Muqobil variant" },
  { code: "R2",  name: "Contracting Area",          falpha: "2(1−α)^(1/2)",           galpha: "1−(1−α)^(1/2)",                   mech: "Silindrik chegara siljishi",  fit: "★★★☆☆", forStep: 2, note: "Muqobil variant" },
  { code: "D4",  name: "Ginstling-Brounshtein",     falpha: "3/[2((1−α)^(−1/3)−1)]",  galpha: "1−(2α/3)−(1−α)^(2/3)",           mech: "Sferik diffuziya (aniqroq)",  fit: "★★★★☆", forStep: 3, note: "D₃ dan aniqroq" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ISOMERIK / GEOMETRIK TAQQOSLASH — HAM SHU METAL, HAM SHU LIGAND
// ═══════════════════════════════════════════════════════════════════════════════
const relatedCompounds = [
  { formula: "[Co(NH₃)₆]Cl₃",         color: "sariq-oltin",       Tstart: 199, Tresidue: "CoCl₂ / Co₃O₄", note: "Etalon (bu sahifa)", highlight: true },
  { formula: "[Co(NH₃)₅Cl]Cl₂",       color: "binafsha (purpureo)", Tstart: 150, Tresidue: "CoCl₂",         note: "Ichki Cl → yuqoriroq T da chiqadi",  highlight: false },
  { formula: "[Co(NH₃)₄Cl₂]Cl",       color: "yashil (praseo) / binafsha (violeo)", Tstart: 175, Tresidue: "CoCl₂", note: "Sis/trans izomerlar", highlight: false },
  { formula: "[Co(NH₃)₆]Br₃",         color: "sariq",             Tstart: 210, Tresidue: "CoBr₂",         note: "Br⁻ kuchli anion ta'siri",           highlight: false },
  { formula: "[Co(NH₃)₆](NO₃)₃",      color: "sariq-jigar",       Tstart: 165, Tresidue: "Co₃O₄",         note: "NO₃⁻ oksidlovchi \u2014 pastroq T",  highlight: false },
  { formula: "[Co(en)₃]Cl₃",          color: "sariq",             Tstart: 240, Tresidue: "CoCl₂",         note: "Xelat effekt \u2014 barqarorroq",     highlight: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY XRONOLOGIYA — BIRIKMANING TERMIK TAHLIL TARIXI
// ═══════════════════════════════════════════════════════════════════════════════
const timeline = [
  { year: 1798, event: "Tassaert birinchi bo'lib CoCl₂ eritmasidan NH₃ bilan sariq mahsulot olgan (sirli \u201cluteo-kobalt\u201d)" },
  { year: 1852, event: "Genth va Gibbs — [Co(NH₃)₆]Cl₃ ni tozalab, tarkibini aniqlashgan" },
  { year: 1875, event: "Jorgensen va Blomstrand \u2014 zanjir nazariyasi (noto'g'ri modeli), lekin sintezni yaxshilashgan" },
  { year: 1893, event: "Alfred Werner \u2014 koordinatsion nazariyani taklif qildi. [Co(NH₃)₆]Cl₃ ni etalon oldi (ichki/tashqi sfera farqi)" },
  { year: 1913, event: "🏆 Werner \u2014 Nobel kimyo mukofoti (koordinatsion birikmalar uchun)" },
  { year: 1946, event: "Bjerrum & McReynolds \u2014 Inorg. Synth. 2, 217 \u2014 zamonaviy sintez metodikasi" },
  { year: 1952, event: "Henry Taube \u2014 [Co(NH₃)₆]³⁺ ni inert komplekslar sinfiga kiritdi (ligand almashish t\u00bd \u226b yillar)" },
  { year: 1963, event: "W. W. Wendlandt \u2014 birinchi tafsilotli TGA/DTA (J. Inorg. Nucl. Chem. 25, 545): T\u2098\u2091\u2093 199-257°C" },
  { year: 1966, event: "Simmons & Wendlandt \u2014 aniq parchalanish mexanizmi (Inorg. Chem. 5, 1103): oraliq [Co(NH₃)\u2084]Cl₃" },
  { year: 1974, event: "Collins & Wendlandt \u2014 Thermochim. Acta 8, 315 \u2014 gaz evolyutsiyasi (EGA-MS)" },
  { year: 1983, event: "🏆 Henry Taube \u2014 Nobel kimyo mukofoti (inert kompleks nazariyasi)" },
  { year: 1992, event: "Liming et al. \u2014 Thermochim. Acta 202, 245: anion (KY, Y=Cl/Br/I/CN/SCN/OH) ta'siri" },
  { year: 1994, event: "Z. D. Zivkovic \u2014 J. Thermal Anal. 41, 99: batafsil TG-DTG-DTA-DSC + Cp variatsiyasi + kinetika" },
  { year: 2011, event: "ICTAC Kinetics Committee \u2014 Vyazovkin et al. \u2014 model-free tavsiyalar" },
  { year: 2022, event: "Bereczki et al. \u2014 [Co(NH₃)\u2086]Cl₂(MnO\u2084) TG-MS spektri (Inorganics 10, 252)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AMALIY AHAMIYATI
// ═══════════════════════════════════════════════════════════════════════════════
const applications = [
  { field: "Werner nazariyasi standarti", detail: "Barcha darsliklarda koordinatsion kimyoning etaloni sifatida ishlatiladi (ichki/tashqi sfera farqini isbotlaydi)", icon: "🎓" },
  { field: "Termik tahlil kalibrlash",     detail: "Turg'un parchalanish bosqichlari — TGA/DSC asboblarini tekshirish uchun ma'lumot manbasi", icon: "🔬" },
  { field: "Analitik kimyo",               detail: "Tashqi sfera 3 Cl⁻ — AgNO₃ bilan darhol AgCl beradi (Cl⁻ ionli). Ichki NH₃ — pastda emas", icon: "⚗️" },
  { field: "Katalizator prekursori",       detail: "Termik parchalanishdan kelib chiqadigan Co₃O₄ — CO oksidlanishi katalizatori (ko'k rang, Co-Mn-O)", icon: "⚡" },
  { field: "Struktur biologiyada",         detail: "Nuklein kislotalar (RNA, DNK) bilan ionli kompleks — [Co(NH₃)₆]³⁺ zaryadi tufayli (Wikipedia)", icon: "🧬" },
  { field: "MRI-kontrast va sensor",       detail: "Gd(III) o'rniga potensial past-toksik variant, elektrontransfer reaksiyalar tadqiqoti", icon: "🎯" },
  { field: "Kobalt oksidini olish",        detail: "Havoda 800-900°C da termik parchalanish → nanostructured Co₃O₄ (batareya, superkondansator uchun)", icon: "🔋" },
  { field: "Werner Nobel mukofoti (1913)", detail: "Barcha darsliklarda \u201cKoordinatsion nazariya\u201d ning eksperimental asosi ($, $)", icon: "🏆" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// XATOLIK MANBALARI
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  { source: "Buoyancy (uzu\u200fk kuchi) effekti", severity: "Yuqori", detail: "Harorat oshganda gaz zichligi kamayadi \u2014 balans bo'sh tigel bilan ham massa \u201cortishini\u201d ko'rsatishi mumkin. Yechim: bo'sh tigel bilan baseline korreksiyasi.", color: "text-red-300" },
  { source: "Namuna massasi katta", severity: "O'rta", detail: "10 mg dan katta massada issiqlik gradiyenti \u2014 T aslida 5-10°C past bo'lishi mumkin. Yechim: 2\u20135 mg ishlatish.", color: "text-orange-300" },
  { source: "Qizdirish tezligi \u03b2", severity: "Yuqori", detail: "β = 20°C/min da barcha cho'qqilar \u201coldga\u201d suriladi (yuqoriroq T ga). Kinetik tahlil uchun kamida 3\u20135 xil β kerak (ICTAC 2011).", color: "text-red-300" },
  { source: "Atmosfera (havo vs N\u2082)",       severity: "Kritik",  detail: "Havoda 800°C dan yuqorida Co\u2083O\u2084 hosil bo'ladi (ekzo). Inert atmosferada CoCl\u2082 barqaror. Bu \u2014 asosiy farq.",   color: "text-red-300" },
  { source: "Krucible katalizi",     severity: "O'rta",   detail: "Pt tigel NH\u2083 ni katalitik oksidlaydi (NOₓ ga aylantiradi). Yechim: Al\u2082O\u2083 tigel ishlatish.", color: "text-orange-300" },
  { source: "Namunaning gigroskopikligi", severity: "Past", detail: "[Co(NH\u2083)\u2086]Cl\u2083 juda gigroskopik emas, lekin havodagi CO\u2082 bilan sekin reaksiyaga kirishi mumkin. Yechim: quruq desikkator.", color: "text-yellow-300" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// RANG VA TERMOXROMIZM \u2014 parchalanish davomida rang o'zgarishi
// ═══════════════════════════════════════════════════════════════════════════════
const colorChanges = [
  { temp: "25°C",       color: "#F59E0B", name: "Sariq-oltin",        state: "[Co(NH\u2083)\u2086]Cl\u2083 boshlang'ich \u2014 Co\u00b3\u207a d\u2076 LS" },
  { temp: "220°C",      color: "#F97316", name: "To'q sariq",        state: "2 NH\u2083 chiqishi \u2014 oraliq [Co(NH\u2083)\u2084]Cl\u2083 boshi" },
  { temp: "350°C",      color: "#B45309", name: "Jigarrang",         state: "Ichki redoks \u2014 Co\u00b3\u207a \u2192 Co\u00b2\u207a o'tishi" },
  { temp: "500°C",      color: "#1E3A8A", name: "To'q ko'k",          state: "CoCl\u2082 (bezvodli) \u2014 Co\u00b2\u207a d\u2077 tetraedrik" },
  { temp: "800°C (air)", color: "#0F172A", name: "Qora",              state: "Co\u2083O\u2084 shpineli \u2014 Co\u00b2\u207a/Co\u00b3\u207a aralash oksid" },
]

// SVG grafik parametrlari
const TEMP_MIN = 25, TEMP_MAX = 1000

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT — [Co(NH₃)₆]Cl₃ PREMIUM TERMIK SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH36Cl3Termik() {
  // ─── States
  const [showIntro, setShowIntro] = useState(true)
  const [tempSlider, setTempSlider] = useState(220)
  const [activeTab, setActiveTab] = useState("BARCHASI")
  const [selectedStep, setSelectedStep] = useState(0)
  const [showAllModels, setShowAllModels] = useState(false)
  const [selectedModel, setSelectedModel] = useState("F1")
  const [alphaSlider, setAlphaSlider] = useState(0.5)
  const [atmosphere, setAtmosphere] = useState("air") // air | inert
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)

  // Kalkulyator: n(NH₃) massa yo'qotishdan
  const [calcMolMass, setCalcMolMass] = useState(267.48)
  const [calcMassLoss, setCalcMassLoss] = useState(12.7)

  // Kalkulyator: Arrhenius k(T)
  const [arrhEa, setArrhEa] = useState(128)
  const [arrhA, setArrhA] = useState(1e13)
  const [arrhT, setArrhT] = useState(220)

  // Kalkulyator: DSC ΔH
  const [dscArea, setDscArea] = useState(220) // mJ (tipik 1-bosqich)
  const [dscSampleMass, setDscSampleMass] = useState(5.0) // mg

  // ─── Joriy TGA/DTG/DSC nuqta (interpolatsiya)
  const currentPoint = useMemo(() => {
    for (let i = 0; i < tgaData.length - 1; i++) {
      if (tempSlider >= tgaData[i].temp && tempSlider <= tgaData[i + 1].temp) {
        const t1 = tgaData[i], t2 = tgaData[i + 1]
        const frac = (tempSlider - t1.temp) / (t2.temp - t1.temp)
        return {
          mass: (t1.mass + (t2.mass - t1.mass) * frac).toFixed(2),
          dtg:  (t1.dtg  + (t2.dtg  - t1.dtg)  * frac).toFixed(2),
          dsc:  (t1.dsc  + (t2.dsc  - t1.dsc)  * frac).toFixed(1),
          event: t1.event,
        }
      }
    }
    const last = tgaData[tgaData.length - 1]
    return { mass: last.mass.toFixed(2), dtg: "0", dsc: "0", event: last.event }
  }, [tempSlider])

  // ─── f(α) va g(α) tanlangan model uchun
  const modelValues = useMemo(() => {
    const a = Math.max(0.001, Math.min(0.999, alphaSlider))
    const models = {
      F1: { f: 1 - a,                                                            g: -Math.log(1 - a) },
      R2: { f: 2 * Math.pow(1 - a, 0.5),                                          g: 1 - Math.pow(1 - a, 0.5) },
      R3: { f: 3 * Math.pow(1 - a, 2/3),                                          g: 1 - Math.pow(1 - a, 1/3) },
      A2: { f: 2 * (1 - a) * Math.pow(-Math.log(1 - a), 0.5),                     g: Math.pow(-Math.log(1 - a), 0.5) },
      D3: { f: (3 * Math.pow(1 - a, 2/3)) / (2 * (1 - Math.pow(1 - a, 1/3))),     g: Math.pow(1 - Math.pow(1 - a, 1/3), 2) },
      D4: { f: 3 / (2 * (Math.pow(1 - a, -1/3) - 1)),                             g: 1 - (2 * a / 3) - Math.pow(1 - a, 2/3) },
    }
    return models[selectedModel] || models.F1
  }, [alphaSlider, selectedModel])

  // ─── n(NH₃) hisobi
  const nNH3 = useMemo(() => {
    const massLost = calcMolMass * (calcMassLoss / 100)
    return (massLost / 17.031).toFixed(2) // NH₃ molyar massa
  }, [calcMolMass, calcMassLoss])

  // ─── Arrhenius k(T)
  const arrhResult = useMemo(() => {
    const R = 8.314 // J/(mol·K)
    const T = arrhT + 273.15
    const k = arrhA * Math.exp(-arrhEa * 1000 / (R * T))
    const t_half = Math.log(2) / k
    return {
      k: k.toExponential(3),
      t_half: t_half < 60 ? `${t_half.toFixed(2)} s` : t_half < 3600 ? `${(t_half/60).toFixed(2)} min` : `${(t_half/3600).toFixed(2)} soat`,
    }
  }, [arrhEa, arrhA, arrhT])

  // ─── DSC → ΔH
  const dHResult = useMemo(() => {
    const dH_perGram = dscArea / dscSampleMass // J/g
    const dH_perMol = (dH_perGram * COMPOUND.molarMass) / 1000 // kJ/mol
    return { perGram: dH_perGram.toFixed(2), perMol: dH_perMol.toFixed(2) }
  }, [dscArea, dscSampleMass])

  // ─── Filtered TGA data (atmosfera bo'yicha)
  const filteredTGA = useMemo(() => {
    if (atmosphere === "inert") {
      // Inert atm: 500°C dan yuqori barqaror (CoCl₂)
      return tgaData.map(p => p.temp > 550
        ? { ...p, mass: 48.6, dtg: 0, dsc: 0, event: p.temp > 550 ? "CoCl₂ barqaror (inert)" : p.event }
        : p)
    }
    return tgaData
  }, [atmosphere])

  // ══════ PDF EKSPORT (jsPDF orqali — dinamik yuklash) ══════
  const cleanText = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/[→←↑↓]/g, "->").replace(/[≤≥±]/g, "~")

  const generatePDF = async () => {
    setPdfGenerating(true)
    setPdfProgress(5)
    try {
      const jsPDFModule = await import("jspdf")
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default
      const doc = new jsPDF("p", "mm", "a4")
      const PAGE_W = 210, PAGE_H = 297, MARGIN = 15
      let y = MARGIN
      const C = {
        primary:   [251, 191, 36],   // amber (Co-orange)
        secondary: [56, 189, 248],   // sky-400
        dark:      [15, 23, 42],     // slate-950
        text:      [51, 65, 85],     // slate-700
        light:     [148, 163, 184],  // slate-400
        accent:    [244, 114, 182],  // pink
      }
      setPdfProgress(15)

      // ─── Sarlavha bo'limi
      doc.setFillColor(...C.dark)
      doc.rect(0, 0, PAGE_W, 40, "F")
      doc.setFillColor(...C.primary)
      doc.rect(0, 38, PAGE_W, 2, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("[Co(NH3)6]Cl3", MARGIN, 18)
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Geksaamminkobalt(III) xlorid - Termik tahlil", MARGIN, 26)
      doc.setFontSize(9)
      doc.setTextColor(...C.primary)
      doc.text("JDA Kimyo - Premium Ilmiy Portal - Termik moduli", MARGIN, 33)
      y = 50

      const drawSectionHeader = (num, title) => {
        if (y > PAGE_H - 30) { doc.addPage(); y = MARGIN }
        doc.setFillColor(...C.primary)
        doc.rect(MARGIN, y, 8, 8, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(String(num), MARGIN + 2.5, y + 5.5)
        doc.setTextColor(...C.dark)
        doc.setFontSize(13)
        doc.text(cleanText(title), MARGIN + 12, y + 6)
        doc.setDrawColor(...C.primary)
        doc.setLineWidth(0.5)
        doc.line(MARGIN + 12, y + 8, PAGE_W - MARGIN, y + 8)
        y += 14
      }

      const drawKeyValue = (key, value) => {
        if (y > PAGE_H - 20) { doc.addPage(); y = MARGIN }
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...C.text)
        doc.text(cleanText(key) + ":", MARGIN, y)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...C.dark)
        const lines = doc.splitTextToSize(cleanText(value), PAGE_W - MARGIN - 70)
        doc.text(lines, MARGIN + 55, y)
        y += lines.length * 4.5 + 1
      }

      const drawParagraph = (text) => {
        if (y > PAGE_H - 20) { doc.addPage(); y = MARGIN }
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...C.text)
        const lines = doc.splitTextToSize(cleanText(text), PAGE_W - 2 * MARGIN)
        doc.text(lines, MARGIN, y)
        y += lines.length * 4.5 + 2
      }

      // ─── 1. Umumiy ma'lumot
      drawSectionHeader("1", "UMUMIY MA'LUMOT")
      drawKeyValue("Formula",       COMPOUND.formulaPlain)
      drawKeyValue("IUPAC nomi",    COMPOUND.iupac)
      drawKeyValue("Umumiy nomi",   COMPOUND.commonName)
      drawKeyValue("CAS raqami",    COMPOUND.casNumber)
      drawKeyValue("PubChem CID",   COMPOUND.pubchemCID)
      drawKeyValue("Molyar massa",  COMPOUND.molarMass + " g/mol")
      drawKeyValue("Zichlik",       COMPOUND.density + " g/cm3")
      drawKeyValue("Erish harorati", COMPOUND.meltingPoint + " C")
      drawKeyValue("Rangi",         COMPOUND.color)
      drawKeyValue("Struktura",     COMPOUND.structure)
      drawKeyValue("Kristall sistemi", COMPOUND.crystalSystem)
      drawKeyValue("Bog' uzunligi", COMPOUND.bondLength)
      drawKeyValue("Sintez",        COMPOUND.synthesis)
      setPdfProgress(30)

      // ─── 2. Nazariy asos
      drawSectionHeader("2", "NAZARIY ASOS - d6 LS KONFIGURATSIYA")
      drawKeyValue("Markaziy ion",       COMPOUND.metalCenter)
      drawKeyValue("Atom raqami",        String(COMPOUND.atomicNumber))
      drawKeyValue("Elektron konfig.",   COMPOUND.electronConfig)
      drawKeyValue("Spin holati",        COMPOUND.spinState)
      drawKeyValue("Metall-ligand",      COMPOUND.metalLigand)
      drawKeyValue("Inertlik (Taube)",   COMPOUND.inertness)
      drawParagraph("[Co(NH3)6]3+ - Werner klassikasi. d6 past spin (LS) konfiguratsiyasi - barcha elektronlar t2g orbitallarga jamlangan (S=0). Bu holat oktaedrik NH3 kuchli maydon ligandlarining tabiiy natijasi. Yuqori inertlik (Taube 1952) - ligand almashish t1/2 kunlar tartibida. Termik parchalanishning ilk 199 C dan boshlanishi ammin ligandlarining bog'lash energiyasi bilan bog'liq.")

      // ─── 3. Parchalanish bosqichlari
      drawSectionHeader("3", "TERMIK PARCHALANISH BOSQICHLARI")
      decompositionSteps.forEach((step) => {
        if (y > PAGE_H - 40) { doc.addPage(); y = MARGIN }
        doc.setFillColor(...C.secondary)
        doc.setDrawColor(...C.secondary)
        doc.setLineWidth(0.3)
        doc.rect(MARGIN, y, PAGE_W - 2 * MARGIN, 6, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(`Bosqich ${step.n}: ${step.tempRange}`, MARGIN + 3, y + 4.3)
        y += 8
        drawKeyValue("Reaksiya",       step.reaction)
        drawKeyValue("Massa yo'qotish", `${step.massLossObserved}% (nazariy: ${step.massLossTheoretical}%)`)
        drawKeyValue("Tur",            step.type)
        drawKeyValue("Oraliq mahsulot", step.product)
        drawKeyValue("Ea (Kissinger)", step.ea + " kJ/mol")
        drawKeyValue("ΔH",              step.deltaH + " kJ/mol")
        drawKeyValue("Kinetik model",  step.kineticModel)
        drawParagraph(step.explanation)
        y += 3
      })
      setPdfProgress(60)

      // ─── 4. Kinetika
      drawSectionHeader("4", "KINETIK PARAMETRLAR (KISSINGER)")
      drawParagraph("Arrhenius tenglamasi: k(T) = A * exp(-Ea / RT). Kissinger tenglamasi: ln(beta/Tp^2) = ln(AR/Ea) - Ea/(R*Tp).")
      drawKeyValue("1-bosqich Ea",  COMPOUND.Ea1 + " kJ/mol (F1 model)")
      drawKeyValue("2-bosqich Ea",  COMPOUND.Ea2 + " kJ/mol (R3 model)")
      drawKeyValue("3-bosqich Ea",  COMPOUND.Ea3 + " kJ/mol (D3 model, faqat havoda)")
      drawKeyValue("1-bosqich ΔH",  COMPOUND.deltaH1 + " kJ/mol")
      drawKeyValue("2-bosqich ΔH",  COMPOUND.deltaH2 + " kJ/mol")
      drawKeyValue("3-bosqich ΔH",  "-" + Math.abs(COMPOUND.deltaH3) + " kJ/mol (ekzotermik)")

      // ─── 5. Atmosfera farqi
      drawSectionHeader("5", "ATMOSFERA TA'SIRI")
      drawParagraph("Havo (O2) - 500 C dan yuqorida CoCl2 kislorod bilan reaksiyaga kirishadi va Co3O4 shpineli hosil qiladi (ekzotermik). Yakuniy qoldiq ~ 40% massa (Co3O4).")
      drawParagraph("Inert atmosfera (N2, Ar) - Bu oksidlanish sodir bo'lmaydi, yakuniy mahsulot CoCl2 (~48% massa) bo'lib qoladi (Wojciechowska & Bragiel).")

      // ─── 6. O'xshash birikmalar
      drawSectionHeader("6", "O'XSHASH BIRIKMALAR TERMIK QATORI")
      relatedCompounds.forEach(rc => {
        drawKeyValue(cleanText(rc.formula), `T_boshi=${rc.Tstart} C, qoldiq: ${rc.Tresidue}, ${rc.note}`)
      })
      setPdfProgress(80)

      // ─── 7. Amaliy ahamiyati
      drawSectionHeader("7", "AMALIY AHAMIYATI")
      applications.forEach(app => drawKeyValue(app.field, app.detail))

      // ─── 8. Xulosalar
      drawSectionHeader("8", "ASOSIY XULOSALAR")
      drawParagraph("1. [Co(NH3)6]Cl3 - Werner klassikasi (1893), Nobel mukofoti (1913) - koordinatsion kimyoning etaloni.")
      drawParagraph("2. Termik parchalanish 199 C dan boshlanadi (Wendlandt 1963) va 3 asosiy bosqichda amalga oshadi.")
      drawParagraph("3. 1-bosqich (199-260 C): 2 NH3 chiqishi, F1 kinetik model, Ea ~ 128 kJ/mol.")
      drawParagraph("4. 2-bosqich (260-420 C): qolgan 4 NH3 + ichki redoks (Co3+ -> Co2+), R3 model, Ea ~ 165 kJ/mol.")
      drawParagraph("5. 3-bosqich (600-900 C, faqat havoda): CoCl2 -> Co3O4, D3 diffuziya modeli, Ea ~ 210 kJ/mol.")
      drawParagraph("6. Yakuniy qoldiq: havoda Co3O4 (40%), inert atmosferada CoCl2 (48%).")
      drawParagraph("7. Amaliy: Werner nazariyasi standarti, TGA/DSC kalibrlash, Co3O4 batareya-katalizator prekursori.")

      // ─── Footer barcha sahifalarda
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setDrawColor(...C.light)
        doc.setLineWidth(0.2)
        doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12)
        doc.setFontSize(7)
        doc.setTextColor(...C.light)
        doc.text("JDA Kimyo - Premium Ilmiy Portal - Termik moduli - [Co(NH3)6]Cl3", MARGIN, PAGE_H - 7)
        doc.text(`${i} / ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 7, { align: "right" })
      }
      setPdfProgress(95)

      doc.save(`Co-NH3-6-Cl3_termik_tahlil_${new Date().toISOString().slice(0, 10)}.pdf`)
      setPdfProgress(100)
      setTimeout(() => {
        setPdfGenerating(false)
        setPdfModalOpen(false)
        setPdfProgress(0)
      }, 600)
    } catch (err) {
      console.error("PDF error:", err)
      alert("PDF yaratishda xato. jsPDF paketi o'rnatilganligini tekshiring: npm install jspdf")
      setPdfGenerating(false)
      setPdfProgress(0)
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ══════ GLOBAL CSS ANIMATIONS ══════ */}
      <style jsx global>{`
        @keyframes float-slow { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(30px,-20px) rotate(180deg); } }
        @keyframes float-med  { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-25px,25px) rotate(-180deg); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        @keyframes shine      { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeInUp   { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-float-slow { animation: float-slow 18s ease-in-out infinite; }
        .animate-float-med  { animation: float-med 14s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shine      { background-size: 200% 100%; animation: shine 3s linear infinite; }
        .fade-in-up         { animation: fadeInUp 0.6s ease-out both; }
      `}</style>

      {/* ══════ FON — animatsion mesh (deep blue + amber accent) ══════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/5 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-500/15 to-indigo-500/10 blur-3xl animate-float-med" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      {/* ══════ KIRISH MODAL ══════ */}
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 shadow-2xl shadow-amber-500/20 max-h-[92vh] overflow-y-auto fade-in-up">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/20" style={{ background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}88)` }} />
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-1">Ilmiy kirish • Termik moduli</div>
                  <h2 className="text-3xl font-black text-white" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-slate-300 text-sm mt-1">{COMPOUND.iupac}</p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)} className="text-slate-400 hover:text-white text-2xl px-3 py-1 hover:bg-slate-800/60 rounded-lg transition">✕</button>
            </div>

            <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong className="text-amber-300">Luteo-kobalt xlorid</strong> — koordinatsion kimyoning eng klassik va eng chuqur o'rganilgan birikmasi. Alfred <strong>Werner</strong> aynan shu birikma asosida <strong className="text-amber-400">koordinatsion nazariyasini</strong> yaratdi va 1913-yilda <strong className="text-amber-300">Nobel mukofotini</strong> oldi. Bugungi kunda ham u <em>d⁶ past spin</em>, <em>oktaedr Oh simmetriya</em>, va <em>inert kompleks</em> tushunchalarining etaloni.
              </p>

              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4">
                <p className="font-bold text-amber-300 mb-2">🔥 Termik tahlil nima ochib beradi?</p>
                <ul className="space-y-1 text-amber-100 pl-4 list-disc text-sm">
                  <li><strong>Uch bosqichli parchalanish</strong> — 199°C dan boshlab CoCl₂/Co₃O₄ gacha</li>
                  <li><strong>Ichki redoks jarayoni</strong> — Co³⁺ spontan Co²⁺ ga o'tishi (2-bosqich)</li>
                  <li><strong>Bog' kuchi</strong> — Eₐ qiymatlaridan Co–N va Co–Cl ta'sirini baholash</li>
                  <li><strong>Atmosfera ta'siri</strong> — havo vs inert: yakuniy mahsulot butunlay farq qiladi</li>
                </ul>
              </div>

              <div className="bg-sky-950/30 border border-sky-500/40 rounded-xl p-4">
                <p className="font-bold text-sky-300 mb-2">📐 Arrhenius va Kissinger — kinetika asosi:</p>
                <p className="text-center text-xl font-mono text-amber-200 py-2">k(T) = A · exp(−Eₐ / RT)</p>
                <p className="text-sky-200 text-xs">Kissinger (1957): ln(β/Tₚ²) = ln(AR/Eₐ) − Eₐ/(R·Tₚ). Har bosqichda o'ziga xos <em>Eₐ</em> va <em>kinetik model</em> bor.</p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4">
                <p className="font-bold text-indigo-300 mb-2">📚 18 bo'limda o'rganasiz</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <div>1. Umumiy ma'lumot va xususiyatlar</div>
                  <div>2. Nazariy asos — d⁶ LS konfiguratsiya</div>
                  <div>3. Interaktiv TGA/DTG/DSC grafik</div>
                  <div>4. Parchalanish bosqichlari (batafsil)</div>
                  <div>5. Reaksiya sxemasi (interaktiv)</div>
                  <div>6. Arrhenius k(T) simulyator</div>
                  <div>7. Atmosfera taqqoslash (havo vs inert)</div>
                  <div>8. Eₐ (Kissinger) + ΔH (DSC) hisobi</div>
                  <div>9. Kinetik model tanlagichi</div>
                  <div>10. O'xshash birikmalar qatori</div>
                  <div>11. n(NH₃) kalkulyatori</div>
                  <div>12. Termik barqarorlik qatori</div>
                  <div>13. Namuna tayyorlash</div>
                  <div>14. Xatolik manbalari</div>
                  <div>15. Termoxromizm (rang o'zgarishi)</div>
                  <div>16. Tarixiy xronologiya</div>
                  <div>17. Amaliy ahamiyati</div>
                  <div>18. Xulosa + PDF eksport</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowIntro(false)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl text-white font-bold shadow-lg shadow-amber-500/40 transition">
                🚀 Boshlash — termik dunyoga kirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ PDF EKSPORT MODAL ══════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 shadow-2xl shadow-amber-500/30">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/40">📄</div>
              <h3 className="text-2xl font-black text-white mb-1">PDF eksport</h3>
              <p className="text-slate-400 text-sm">Termik tahlil to'liq hisoboti (8 bo'lim, ilmiy formatda)</p>
            </div>

            {pdfGenerating ? (
              <div className="space-y-4">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
                </div>
                <p className="text-center text-slate-300 text-sm">
                  {pdfProgress < 30 && "📚 Ma'lumotlar tayyorlanmoqda..."}
                  {pdfProgress >= 30 && pdfProgress < 60 && "📝 Bosqichlar yozilmoqda..."}
                  {pdfProgress >= 60 && pdfProgress < 90 && "🔬 Ilmiy izohlar qo'shilmoqda..."}
                  {pdfProgress >= 90 && "✨ Yakuniy formatlash..."}
                </p>
                <p className="text-center text-amber-300 font-mono text-2xl">{pdfProgress}%</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Format:</span><span className="text-white">PDF (A4)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Bo'limlar:</span><span className="text-white">8</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Til:</span><span className="text-white">O'zbek (lotin)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Fayl kutilgan hajm:</span><span className="text-white">~40–60 KB</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPdfModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-semibold transition">Bekor qilish</button>
                  <button onClick={generatePDF}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl text-white font-bold shadow-lg shadow-amber-500/40 transition">
                    📄 Yaratish
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center">jsPDF paketi kerak: <code className="bg-slate-800 px-1 rounded">npm install jspdf</code></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ STICKY HEADER ══════ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/75 border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2 overflow-x-auto">
            <Link href="/" className="hover:text-amber-300 transition">🏠 Bosh</Link>
            <span className="text-slate-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-amber-300 transition whitespace-nowrap">Tahlil usullari</Link>
            <span className="text-slate-600">›</span>
            <Link href="/ilmiy/tahlil/termik" className="hover:text-amber-300 transition">Termik tahlil</Link>
            <span className="text-slate-600">›</span>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="hover:text-amber-300 transition">Birikmalar</Link>
            <span className="text-slate-600">›</span>
            <span className="text-amber-300 font-semibold whitespace-nowrap" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl shadow-xl border-2 border-white/20" style={{ background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}77)` }} />
              <div>
                <div className="text-[10px] text-amber-400 uppercase tracking-widest">JDA Kimyo • Premium birikma</div>
                <h1 className="text-xl font-black text-white leading-tight" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <p className="text-xs text-slate-400">{COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setPdfModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl text-white text-xs font-bold shadow-lg shadow-amber-500/30 transition">
                📄 PDF eksport
              </button>
              <Link href="/ilmiy/tahlil/termik/birikmalar" className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-amber-800/40 rounded-xl text-amber-300 text-xs font-semibold transition">
                ← Katalogga
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* ══════ HERO ══════ */}
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-indigo-950/50 p-10 md:p-14 shadow-2xl shadow-amber-500/10 fade-in-up">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 right-16 text-6xl opacity-15 animate-float-slow">⚛️</div>
            <div className="absolute bottom-8 right-40 text-5xl opacity-10 animate-float-med">🔥</div>
            <div className="absolute top-1/2 right-8 text-4xl opacity-15 animate-float-slow">🔬</div>
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs text-amber-200 mb-4">
              🏆 Werner Nobel mukofoti (1913) • Koordinatsion nazariya etaloni
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
              <span className="bg-gradient-to-r from-amber-300 via-orange-200 to-amber-300 bg-clip-text text-transparent animate-shine bg-[linear-gradient(90deg,#fcd34d,#fdba74,#fbbf24,#fcd34d)]" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
            </h1>
            <p className="mt-3 text-lg text-slate-300"><em>{COMPOUND.iupac}</em> — {COMPOUND.commonName}</p>

            <p className="mt-6 text-slate-300 max-w-3xl leading-relaxed">
              Alfred <strong className="text-amber-300">Werner</strong> (1893) tomonidan koordinatsion nazariyaning eksperimental asosi sifatida taklif qilingan bu <strong>d⁶ past spin</strong> kompleks bugungi kunda ham termik tahlilning etaloni bo'lib qolmoqda. 199°C dan boshlanadigan uch bosqichli parchalanish (Wendlandt 1963, Zivkovic 1994) NH₃ chiqishi va Co³⁺→Co²⁺ redoksini o'z ichiga oladi.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs">d⁶ LS (S=0)</span>
              <span className="px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs">Oₕ simmetriya</span>
              <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs">3 bosqichli parch.</span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs">Tₘₑₓ = 199°C</span>
              <span className="px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-xs">Taube inert</span>
              <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs">CAS: {COMPOUND.casNumber}</span>
            </div>
          </div>
        </div>

        {/* ══════ 1. UMUMIY MA'LUMOT ══════ */}
        <SectionBlock n="01" title="Umumiy ma'lumot va xususiyatlari" subtitle="Fizik-kimyoviy identifikatorlar (adabiyot bo'yicha)">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-amber-800/30 rounded-2xl p-6 space-y-3">
              <h3 className="text-amber-300 font-bold flex items-center gap-2 mb-3"><span>🧪</span> Kimyoviy identifikatorlar</h3>
              {[
                ["Formula",         <span key="f" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />],
                ["IUPAC nomi",      COMPOUND.iupac],
                ["Umumiy nomi",     COMPOUND.commonName],
                ["CAS raqami",      COMPOUND.casNumber],
                ["PubChem CID",     COMPOUND.pubchemCID],
                ["MDL raqami",      COMPOUND.mdlNumber],
                ["EC No",           COMPOUND.ecNumber],
                ["SMILES",          <code key="s" className="text-[10px] font-mono text-emerald-300 break-all">{COMPOUND.smiles}</code>],
              ].map(([k, v], i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{k}</span>
                  <span className="text-sm text-white font-mono text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/60 border border-sky-800/30 rounded-2xl p-6 space-y-3">
              <h3 className="text-sky-300 font-bold flex items-center gap-2 mb-3"><span>⚙️</span> Fizik xususiyatlar</h3>
              {[
                ["Molyar massa",    `${COMPOUND.molarMass} g/mol`],
                ["Zichlik",         `${COMPOUND.density} g/cm³`],
                ["Erish harorati",  `${COMPOUND.meltingPoint} °C`],
                ["Parch. boshi",    `${COMPOUND.decompStart} °C (Wendlandt 1963)`],
                ["Rangi",           COMPOUND.color],
                ["Kristall sistemi", COMPOUND.crystalSystem],
                ["Nuqta guruhi",    COMPOUND.pointGroup],
                ["Struktura",       COMPOUND.structure],
              ].map(([k, v], i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{k}</span>
                  <span className="text-sm text-white font-mono text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-indigo-950/30 border border-amber-500/30 rounded-2xl p-6">
            <h4 className="text-amber-300 font-bold mb-2">🧪 Sintez usuli</h4>
            <p className="text-slate-200 text-sm mb-2">{COMPOUND.synthesis}</p>
            <p className="text-xs text-slate-400 italic">Manba: {COMPOUND.synthesisRef}</p>
          </div>
        </SectionBlock>

        {/* ══════ 2. NAZARIY ASOS — d⁶ LS ══════ */}
        <SectionBlock n="02" title="Nazariy asos — d⁶ past spin (LS) konfiguratsiya" subtitle="Nima uchun [Co(NH₃)₆]³⁺ shu qadar inert va termik chidamli?">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-amber-800/30 rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Markaziy ion</div>
              <div className="text-4xl font-black text-amber-300">{COMPOUND.metalCenter}</div>
              <div className="text-slate-300 text-sm mt-2">Atom raqami: <span className="font-mono text-white">Z = {COMPOUND.atomicNumber}</span></div>
              <div className="text-slate-300 text-sm">Konfig: <span className="font-mono text-emerald-300">{COMPOUND.electronConfig}</span></div>
            </div>
            <div className="bg-slate-900/60 border border-sky-800/30 rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">d elektronlar</div>
              <div className="text-4xl font-black text-sky-300">d⁶</div>
              <div className="text-slate-300 text-sm mt-2">Spin holati: <span className="text-white font-mono">S = 0 (LS)</span></div>
              <div className="text-slate-300 text-sm">Toq e⁻: <span className="text-white font-mono">0</span></div>
            </div>
            <div className="bg-slate-900/60 border border-indigo-800/30 rounded-2xl p-5">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Simmetriya</div>
              <div className="text-4xl font-black text-indigo-300">Oh</div>
              <div className="text-slate-300 text-sm mt-2">Bog' burchagi: <span className="text-white font-mono">{COMPOUND.bondAngle}</span></div>
              <div className="text-slate-300 text-sm">Bog' uzunligi: <span className="text-white font-mono">{COMPOUND.bondLength}</span></div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-950/40 to-slate-900/60 border border-amber-500/30 rounded-2xl p-6">
              <h4 className="text-amber-300 font-bold mb-3">📐 t₂g⁶ (LS) konfiguratsiya — nima demak?</h4>
              <div className="bg-slate-950/60 rounded-xl p-4 mb-3">
                <OrbitalDiagram />
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                NH₃ — <strong className="text-amber-300">kuchli maydon ligand</strong>i (σ-donor). U shunday katta Δₒ ni yaratadi ki, elektronlar juftlanishga majbur bo'ladi (Δₒ &gt; P). Natijada barcha 6 ta d elektron t₂g orbitallarga jamlangan — <strong className="text-amber-400">t₂g⁶ eg⁰</strong>.
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-950/40 to-slate-900/60 border border-sky-500/30 rounded-2xl p-6">
              <h4 className="text-sky-300 font-bold mb-3">⚡ Inertlik va termik chidam — sabab</h4>
              <ul className="space-y-2 text-slate-200 text-sm list-disc pl-5">
                <li><strong>t₂g⁶ to'liq to'ldirilgan</strong> — elektron himoyalash maksimal, Co–N bog' juda kuchli</li>
                <li><strong>CFSE = −2.4Δₒ + 2P</strong> — juda katta stabilizatsiya energiyasi</li>
                <li><strong>Taube tasnifi:</strong> ligand almashish t½ &gt; kunlar</li>
                <li><strong>Termik parchalanish faqat 199°C dan</strong> boshlanadi — barcha ammin komplekslar orasida yuqori chegara</li>
              </ul>
              <p className="mt-3 text-xs text-sky-300 italic">Manba: Basolo & Pearson (1967), Taube (Chem. Rev. 50, 69) — Nobel 1983</p>
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 3. INTERAKTIV TGA/DTG/DSC GRAFIK ══════ */}
        <SectionBlock n="03" title="Interaktiv TGA / DTG / DSC egri chiziq" subtitle="Zivkovic 1994 + Wendlandt 1963 ma'lumotlari bo'yicha, β = 10 °C/min">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {["TGA", "DTG", "DSC", "BARCHASI"].map((t) => (
              <button key={t}
                onClick={() => setActiveTab(t)}
                className={`py-3 rounded-xl font-bold transition ${activeTab === t
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-amber-800/30"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Atmosfera tanlagich */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Atmosfera:</span>
            <button onClick={() => setAtmosphere("air")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${atmosphere === "air"
                ? "bg-orange-500/30 border border-orange-400/60 text-orange-200"
                : "bg-slate-800/60 border border-slate-700 text-slate-400"}`}>🌬️ Havo (O₂)</button>
            <button onClick={() => setAtmosphere("inert")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${atmosphere === "inert"
                ? "bg-sky-500/30 border border-sky-400/60 text-sky-200"
                : "bg-slate-800/60 border border-slate-700 text-slate-400"}`}>❄️ Inert (N₂/Ar)</button>
          </div>

          <div className="bg-slate-950/70 border border-amber-500/30 rounded-3xl p-6">
            <TGADTGDSCChart data={filteredTGA} activeTab={activeTab} tempSlider={tempSlider} />

            <div className="mt-6">
              <label className="block text-amber-300 font-bold mb-2">
                🌡️ Harorat = <span className="text-white font-mono text-2xl">{tempSlider}°C</span>
                <span className="text-slate-400 text-sm ml-2">({(tempSlider + 273.15).toFixed(1)} K)</span>
              </label>
              <input type="range" min={TEMP_MIN} max={TEMP_MAX} step="5"
                value={tempSlider}
                onChange={(e) => setTempSlider(parseInt(e.target.value))}
                className="w-full accent-amber-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>25°</span><span>200°</span><span>400°</span><span>600°</span><span>800°</span><span>1000°</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-amber-300">Massa qoldi</div>
                <div className="text-3xl font-black text-white">{currentPoint.mass}%</div>
              </div>
              <div className="bg-orange-950/40 border border-orange-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-orange-300">DTG</div>
                <div className="text-3xl font-black text-white">{currentPoint.dtg}</div>
                <div className="text-xs text-orange-400">%/°C</div>
              </div>
              <div className="bg-sky-950/40 border border-sky-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-sky-300">DSC signal</div>
                <div className="text-3xl font-black text-white">{currentPoint.dsc}</div>
                <div className="text-xs text-sky-400">mW</div>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-4 text-center">
                <div className="text-xs text-indigo-300">Hodisa</div>
                <div className="text-xs font-bold text-white mt-2 leading-tight">{currentPoint.event}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-r from-amber-950/30 to-slate-900/40 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs text-slate-300">
              <strong className="text-amber-300">💡 IUPAC belgisi:</strong> DSC egri chizig'i — pastga (↓) endotermik (NH₃ chiqishi — issiqlik yutiladi), yuqoriga (↑) ekzotermik (Co₃O₄ hosil bo'lishi, faqat havoda). Zivkovic (1994) va Wendlandt (1963) ma'lumotlariga asoslangan.
            </p>
          </div>
        </SectionBlock>

        {/* ══════ 4. PARCHALANISH BOSQICHLARI (batafsil) ══════ */}
        <SectionBlock n="04" title="Parchalanish bosqichlari — batafsil ilmiy izohlar" subtitle="Har bir bosqich uchun mexanizm, Ea, ΔH va kinetik model">
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {decompositionSteps.map((step, i) => (
              <button key={i}
                onClick={() => setSelectedStep(i)}
                className={`text-left rounded-2xl p-4 transition border-2 ${selectedStep === i
                  ? `${step.typeBg} ${step.typeBorder} shadow-lg`
                  : "bg-slate-900/60 border-slate-700 hover:border-amber-500/40"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black uppercase tracking-wider ${step.typeColor}`}>Bosqich {step.n}</span>
                  <span className="text-xs text-slate-400 font-mono">{step.tempRange}</span>
                </div>
                <div className={`text-lg font-bold ${step.typeColor}`}>Tₚₑₐₖ = {step.tempPeak}°C</div>
                <div className="text-xs text-white mt-1 font-mono truncate">→ {step.product}</div>
              </button>
            ))}
          </div>

          {/* Tanlangan bosqich — batafsil */}
          {decompositionSteps[selectedStep] && (
            <div className={`rounded-3xl p-6 md:p-8 border-2 ${decompositionSteps[selectedStep].typeBorder} ${decompositionSteps[selectedStep].typeBg}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`text-xs uppercase tracking-widest font-bold ${decompositionSteps[selectedStep].typeColor}`}>Bosqich {decompositionSteps[selectedStep].n} • {decompositionSteps[selectedStep].type}</div>
                  <h4 className="text-2xl font-black text-white mt-1">{decompositionSteps[selectedStep].tempRange}</h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Tavsiya modeli</div>
                  <div className={`text-xl font-black ${decompositionSteps[selectedStep].typeColor}`}>{decompositionSteps[selectedStep].modelCode}</div>
                </div>
              </div>

              {/* Reaksiya — katta yozuv */}
              <div className="bg-slate-950/60 rounded-xl p-5 mb-4 border border-white/10">
                <div className="text-xs uppercase text-slate-400 tracking-widest mb-2">Reaksiya tenglamasi</div>
                <div className="text-lg md:text-xl font-mono text-white text-center break-all">{decompositionSteps[selectedStep].reaction}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniStat label="Massa yo'qotish" value={`${decompositionSteps[selectedStep].massLossObserved}%`} sub={`nazariy: ${decompositionSteps[selectedStep].massLossTheoretical}%`} color="text-amber-300" />
                <MiniStat label="Eₐ (Kissinger)" value={`${decompositionSteps[selectedStep].ea}`} sub="kJ/mol" color="text-red-300" />
                <MiniStat label="ΔH" value={`${decompositionSteps[selectedStep].deltaH > 0 ? "+" : ""}${decompositionSteps[selectedStep].deltaH}`} sub="kJ/mol" color="text-emerald-300" />
                <MiniStat label="Oraliq mahsulot" value={decompositionSteps[selectedStep].product} sub="" color="text-sky-300" isText />
              </div>

              <div className="bg-slate-950/40 rounded-xl p-4 mb-3">
                <div className="text-xs uppercase text-slate-400 tracking-widest mb-1">Ilmiy izoh</div>
                <p className="text-slate-200 text-sm leading-relaxed">{decompositionSteps[selectedStep].explanation}</p>
              </div>

              <div className="bg-slate-950/40 rounded-xl p-4">
                <div className="text-xs uppercase text-slate-400 tracking-widest mb-1">Kinetik model sababi</div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  <strong className={decompositionSteps[selectedStep].typeColor}>{decompositionSteps[selectedStep].kineticModel}</strong> — {decompositionSteps[selectedStep].modelReason}
                </p>
              </div>

              <div className="mt-3 text-xs italic text-slate-400">{decompositionSteps[selectedStep].diagnostic}</div>
            </div>
          )}
        </SectionBlock>

        {/* ══════ 5. REAKSIYA SXEMASI ══════ */}
        <SectionBlock n="05" title="Reaksiya sxemasi — bosqichli parchalanish" subtitle="Ranglar joriy haroratga bog'liq — slider bilan bog'langan">
          <div className="bg-slate-900/60 border border-amber-800/30 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <SchemeNode active={tempSlider < 220} label="[Co(NH₃)₆]Cl₃" color="#F59E0B" note="boshlang'ich" />
              <SchemeArrow label="− 2 NH₃" temp="220°C" />
              <SchemeNode active={tempSlider >= 220 && tempSlider < 350} label="[Co(NH₃)₄]Cl₃" color="#F97316" note="oraliq" />
              <SchemeArrow label="− 4 NH₃" temp="350°C" note="+ ichki redoks" />
              <SchemeNode active={tempSlider >= 350 && tempSlider < 700} label="CoCl₂" color="#1E40AF" note="stabil (inert)" />
              {atmosphere === "air" && (<>
                <SchemeArrow label="+ O₂" temp="750°C" note="− Cl₂" />
                <SchemeNode active={tempSlider >= 700} label="Co₃O₄" color="#0F172A" note="qora shpinel" />
              </>)}
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/60 rounded-lg p-3 border border-amber-500/20">
                <div className="text-amber-300 font-bold mb-1">🎯 1-bosqich</div>
                <p className="text-slate-300">Tashqi jufflardagi NH₃ lar birinchi bo'lib chiqadi (kam bog'lanish energiyasi). F₁ kinetika.</p>
              </div>
              <div className="bg-slate-950/60 rounded-lg p-3 border border-blue-500/20">
                <div className="text-blue-300 font-bold mb-1">⚡ 2-bosqich</div>
                <p className="text-slate-300">Sferik ichki qatlam yemiriladi. Co³⁺ NH₃ oksidlaydi va o'zi Co²⁺ ga qaytariladi. R₃ kinetika.</p>
              </div>
              <div className="bg-slate-950/60 rounded-lg p-3 border border-orange-500/20">
                <div className="text-orange-300 font-bold mb-1">🌬️ 3-bosqich (havoda)</div>
                <p className="text-slate-300">O₂ diffuziyasi CoCl₂ zarrachalar ichkarisiga qadar. D₃ (Jander) modeli.</p>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 6. ARRHENIUS k(T) SIMULYATOR ══════ */}
        <SectionBlock n="06" title="Arrhenius k(T) simulyatori" subtitle="Tezlik konstantasi va yarim emirilish davri (Eₐ, A va T slayderlar)">
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-3xl p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-mono text-amber-200">k(T) = A · exp(−Eₐ / RT)</p>
              <p className="text-xs text-slate-400 mt-1">R = 8.314 J/(mol·K), T — kelvin</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-amber-300 text-sm font-bold mb-2">
                  Eₐ = <span className="text-white font-mono">{arrhEa}</span> kJ/mol
                </label>
                <input type="range" min="50" max="300" step="1" value={arrhEa}
                  onChange={(e) => setArrhEa(parseInt(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="text-[10px] text-slate-500 flex justify-between mt-1"><span>50</span><span>300</span></div>
                <p className="text-xs text-slate-400 mt-2">1-bosqich: 128, 2-bosqich: 165, 3-bosqich: 210</p>
              </div>
              <div>
                <label className="block text-sky-300 text-sm font-bold mb-2">
                  A = <span className="text-white font-mono">{arrhA.toExponential(0)}</span> s⁻¹
                </label>
                <input type="range" min="10" max="18" step="0.5" value={Math.log10(arrhA)}
                  onChange={(e) => setArrhA(Math.pow(10, parseFloat(e.target.value)))}
                  className="w-full accent-sky-500" />
                <div className="text-[10px] text-slate-500 flex justify-between mt-1"><span>10¹⁰</span><span>10¹⁸</span></div>
                <p className="text-xs text-slate-400 mt-2">Odatiy oralig'i: 10¹² – 10¹⁵ s⁻¹</p>
              </div>
              <div>
                <label className="block text-indigo-300 text-sm font-bold mb-2">
                  T = <span className="text-white font-mono">{arrhT}</span> °C
                </label>
                <input type="range" min="100" max="800" step="5" value={arrhT}
                  onChange={(e) => setArrhT(parseInt(e.target.value))}
                  className="w-full accent-indigo-500" />
                <div className="text-[10px] text-slate-500 flex justify-between mt-1"><span>100</span><span>800</span></div>
                <p className="text-xs text-slate-400 mt-2">Absolyut T: {(arrhT + 273.15).toFixed(1)} K</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/40 rounded-2xl p-6 text-center">
                <div className="text-xs uppercase text-emerald-300 tracking-widest mb-1">Tezlik konstantasi</div>
                <div className="text-3xl md:text-4xl font-black font-mono text-emerald-200 my-2">{arrhResult.k}</div>
                <div className="text-xs text-slate-400">s⁻¹</div>
              </div>
              <div className="bg-gradient-to-br from-pink-950/40 to-slate-900/60 border border-pink-500/40 rounded-2xl p-6 text-center">
                <div className="text-xs uppercase text-pink-300 tracking-widest mb-1">Yarim emirilish davri (t½)</div>
                <div className="text-3xl md:text-4xl font-black font-mono text-pink-200 my-2">{arrhResult.t_half}</div>
                <div className="text-xs text-slate-400">ln(2) / k</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-300">
              <strong className="text-amber-300">💡 Interpretatsiya:</strong> Yuqori Eₐ = kompleks juda barqaror, past T da parchalanmaydi. [Co(NH₃)₆]Cl₃ uchun 1-bosqich Eₐ = 128 kJ/mol — bu <strong className="text-amber-200">o'rta-yuqori barqarorlikni</strong> ko'rsatadi. Suv gidratlarida odatda 40–80 kJ/mol.
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 7. ATMOSFERA TAQQOSLASH ══════ */}
        <SectionBlock n="07" title="Atmosfera ta'siri — havo vs inert" subtitle="Bir birikma, ikki xil natija (Wojciechowska & Bragiel)">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-950/40 to-slate-900/60 border border-orange-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🌬️</div>
                <div>
                  <h4 className="text-orange-300 font-black text-xl">Havo (O₂)</h4>
                  <p className="text-slate-400 text-xs">Oksidlanish + parchalanish</p>
                </div>
              </div>
              <ul className="space-y-2 text-slate-200 text-sm">
                <li className="flex justify-between"><span>Bosqichlar</span><span className="font-mono text-white">3 ta</span></li>
                <li className="flex justify-between"><span>Yakuniy qoldiq</span><span className="font-mono text-orange-200">Co₃O₄ (≈40%)</span></li>
                <li className="flex justify-between"><span>Rang</span><span className="text-white">Qora shpinel</span></li>
                <li className="flex justify-between"><span>3-bosqich</span><span className="text-orange-200">Ekzotermik</span></li>
                <li className="flex justify-between"><span>Amaliy foyda</span><span className="text-emerald-200">Batareya, kataliz</span></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-sky-950/40 to-slate-900/60 border border-sky-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">❄️</div>
                <div>
                  <h4 className="text-sky-300 font-black text-xl">Inert (N₂, Ar)</h4>
                  <p className="text-slate-400 text-xs">Faqat termik parchalanish</p>
                </div>
              </div>
              <ul className="space-y-2 text-slate-200 text-sm">
                <li className="flex justify-between"><span>Bosqichlar</span><span className="font-mono text-white">2 ta</span></li>
                <li className="flex justify-between"><span>Yakuniy qoldiq</span><span className="font-mono text-sky-200">CoCl₂ (≈48%)</span></li>
                <li className="flex justify-between"><span>Rang</span><span className="text-white">To'q ko'k</span></li>
                <li className="flex justify-between"><span>3-bosqich</span><span className="text-sky-200">Yo'q (barqaror)</span></li>
                <li className="flex justify-between"><span>Amaliy foyda</span><span className="text-emerald-200">Sintez uchun</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-100">
            <strong className="text-amber-300">🔬 Muhim kuzatuv:</strong> 500°C dan yuqorida atmosfera farqi natijaga hal qiluvchi ta'sir qiladi. Sizga havoda — nanostrukturali Co₃O₄, inertda — kristall CoCl₂ kerak. Yuqoridagi grafik slayderida buni ko'rish mumkin.
          </div>
        </SectionBlock>

        {/* ══════ 8. Eₐ + ΔH HISOBI (Kissinger + DSC) ══════ */}
        <SectionBlock n="08" title="Eₐ (Kissinger) va ΔH (DSC integral) hisobi" subtitle="Kissinger tenglamasi va cho'qqi integrali">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-950/30 to-slate-900/60 border border-red-500/40 rounded-2xl p-6">
              <h4 className="text-red-300 font-bold mb-3">⚡ Kissinger tenglamasi</h4>
              <p className="text-center text-lg font-mono text-amber-200 py-3 bg-slate-950/60 rounded-lg">
                ln(β/Tₚ²) = ln(AR/Eₐ) − Eₐ/(RTₚ)
              </p>
              <p className="text-slate-300 text-sm mt-3">
                Har xil qizdirish tezliklarida (β) cho'qqi haroratini (Tₚ) o'lchash. ln(β/Tₚ²) va 1/Tₚ chizmasi — to'g'ri chiziq. <strong className="text-amber-300">Qiyalik = −Eₐ/R</strong>.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between bg-slate-950/40 rounded p-2 text-sm">
                  <span className="text-slate-400">1-bosqich (2 NH₃)</span>
                  <span className="font-mono text-white">{COMPOUND.Ea1} kJ/mol</span>
                </div>
                <div className="flex justify-between bg-slate-950/40 rounded p-2 text-sm">
                  <span className="text-slate-400">2-bosqich (4 NH₃ + redoks)</span>
                  <span className="font-mono text-white">{COMPOUND.Ea2} kJ/mol</span>
                </div>
                <div className="flex justify-between bg-slate-950/40 rounded p-2 text-sm">
                  <span className="text-slate-400">3-bosqich (Co₃O₄)</span>
                  <span className="font-mono text-white">{COMPOUND.Ea3} kJ/mol</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900/60 border border-emerald-500/40 rounded-2xl p-6">
              <h4 className="text-emerald-300 font-bold mb-3">🔥 DSC integral (ΔH hisobi)</h4>
              <p className="text-center text-lg font-mono text-amber-200 py-3 bg-slate-950/60 rounded-lg">
                ΔH = (1/m) · ∫(dQ/dt) dt
              </p>
              <div className="mt-3 space-y-2">
                <label className="block text-xs text-slate-400">Cho'qqi maydoni (mJ)</label>
                <input type="number" value={dscArea} onChange={(e) => setDscArea(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-emerald-500/40 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                <label className="block text-xs text-slate-400">Namuna massasi (mg)</label>
                <input type="number" step="0.1" value={dscSampleMass} onChange={(e) => setDscSampleMass(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-emerald-500/40 rounded-lg px-3 py-2 text-white font-mono text-sm" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-slate-950/60 rounded-lg p-3 text-center border border-yellow-500/30">
                  <div className="text-[10px] text-yellow-300">ΔH per gram</div>
                  <div className="text-lg font-black text-white">{dHResult.perGram}</div>
                  <div className="text-[10px] text-slate-400">J/g</div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-3 text-center border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-300">ΔH per mol</div>
                  <div className="text-lg font-black text-white">{dHResult.perMol}</div>
                  <div className="text-[10px] text-slate-400">kJ/mol</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic mt-3">Adabiyot: 1-bosqich ΔH ≈ {COMPOUND.deltaH1} kJ/mol (Zivkovic 1994)</p>
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 9. KINETIK MODEL TANLAGICH ══════ */}
        <SectionBlock n="09" title="Kinetik model tanlagichi — f(α) va g(α)" subtitle="Barcha mos modellar bir joyda — real vaqtda hisoblash">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6">
              <label className="block text-amber-300 font-bold mb-2">🎯 Kinetik model tanlash</label>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-800 border border-amber-500/40 rounded-lg px-4 py-3 text-white font-mono">
                <option value="F1">F₁ — Mampel (birinchi tartib) — 1-bosqich</option>
                <option value="R2">R₂ — Contracting Area (silindrik)</option>
                <option value="R3">R₃ — Contracting Volume (sferik) — 2-bosqich</option>
                <option value="A2">A₂ — Avrami-Erofeev n=2</option>
                <option value="D3">D₃ — Jander diffuziya — 3-bosqich</option>
                <option value="D4">D₄ — Ginstling-Brounshtein</option>
              </select>

              <label className="block text-amber-300 font-bold mt-6 mb-2">
                α (konversiya) = <span className="text-white font-mono text-xl">{alphaSlider.toFixed(3)}</span>
              </label>
              <input type="range" min="0.01" max="0.99" step="0.01" value={alphaSlider}
                onChange={(e) => setAlphaSlider(parseFloat(e.target.value))}
                className="w-full accent-amber-500" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 rounded-lg p-4 text-center border border-emerald-500/30">
                  <div className="text-xs text-emerald-300">f(α)</div>
                  <div className="text-2xl font-mono text-white">{isFinite(modelValues.f) ? modelValues.f.toFixed(4) : "∞"}</div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-4 text-center border border-sky-500/30">
                  <div className="text-xs text-sky-300">g(α)</div>
                  <div className="text-2xl font-mono text-white">{isFinite(modelValues.g) ? modelValues.g.toFixed(4) : "∞"}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-sky-500/30 rounded-2xl p-6">
              <div className="text-sky-300 font-bold mb-3 text-center">f(α) va g(α) egri chiziqlari</div>
              <FGCurveChart model={selectedModel} currentAlpha={alphaSlider} />
            </div>
          </div>

          {/* Model taqqoslash jadvali */}
          <div className="mt-6">
            <button onClick={() => setShowAllModels(!showAllModels)}
              className="w-full px-6 py-3 bg-amber-800/30 hover:bg-amber-700/40 border border-amber-500/40 rounded-xl text-amber-200 font-semibold transition">
              {showAllModels ? "🔼 Modellarni yashirish" : "🔽 Barcha 6 mos modelni ko'rish"}
            </button>
            {showAllModels && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-amber-800/30 bg-slate-900/60">
                <table className="w-full text-xs">
                  <thead className="bg-gradient-to-r from-amber-950 to-slate-900 text-amber-200">
                    <tr>
                      <th className="px-3 py-2 text-left">Kod</th>
                      <th className="px-3 py-2 text-left">Nomi</th>
                      <th className="px-3 py-2 text-left">f(α)</th>
                      <th className="px-3 py-2 text-left">g(α)</th>
                      <th className="px-3 py-2 text-left">Mos bosqich</th>
                      <th className="px-3 py-2 text-left">Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {kineticModelsComparison.map((k, i) => (
                      <tr key={i} className={`hover:bg-slate-800/40 ${selectedModel === k.code ? "bg-amber-900/20" : ""}`}>
                        <td className="px-3 py-2 font-black text-amber-300">{k.code}</td>
                        <td className="px-3 py-2 text-slate-200">{k.name}</td>
                        <td className="px-3 py-2 font-mono text-emerald-300">{k.falpha}</td>
                        <td className="px-3 py-2 font-mono text-sky-300">{k.galpha}</td>
                        <td className="px-3 py-2 text-white">Bosqich {k.forStep}</td>
                        <td className="px-3 py-2 text-yellow-300">{k.fit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SectionBlock>

        {/* ══════ 10. O'XSHASH BIRIKMALAR (Werner qatori) ══════ */}
        <SectionBlock n="10" title="O'xshash birikmalar termik qatori" subtitle="Anion va ligand ta'siri (Liming 1992, Bjerrum-Bjerrum qonuni)">
          <div className="overflow-x-auto rounded-2xl border border-amber-800/30 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-amber-950 to-slate-900 text-amber-200">
                <tr>
                  <th className="px-4 py-3 text-left">Formula</th>
                  <th className="px-4 py-3 text-left">Rang</th>
                  <th className="px-4 py-3 text-left">T_boshi</th>
                  <th className="px-4 py-3 text-left">Qoldiq</th>
                  <th className="px-4 py-3 text-left">Eslatma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {relatedCompounds.map((rc, i) => (
                  <tr key={i} className={rc.highlight ? "bg-amber-900/20" : "hover:bg-slate-800/40"}>
                    <td className="px-4 py-3 font-mono font-bold text-amber-300">{rc.formula}{rc.highlight && " ⭐"}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs italic">{rc.color}</td>
                    <td className="px-4 py-3 font-mono text-white">{rc.Tstart}°C</td>
                    <td className="px-4 py-3 font-mono text-emerald-300">{rc.Tresidue}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{rc.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400 italic">
            💡 Xelat effekt: <strong className="text-emerald-300">[Co(en)₃]Cl₃</strong> ammin variantidan yuqoriroq Tₘₑₓ (240°C) beradi — xelat halqasi kompleksni barqarorlashtiradi.
          </p>
        </SectionBlock>

        {/* ══════ 11. n(NH₃) KALKULYATORI ══════ */}
        <SectionBlock n="11" title="n(NH₃) kalkulyatori — massa yo'qotishdan molekula soni" subtitle="Har bir bosqichda nechta NH₃ chiqadi?">
          <div className="bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/40 rounded-3xl p-6">
            <p className="text-center text-lg font-mono text-amber-200 py-3 bg-slate-950/60 rounded-lg mb-4">
              n(NH₃) = M · (Δm% / 100) / M(NH₃)
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-blue-300 text-sm mb-1">M (birikma) g/mol</label>
                <input type="number" value={calcMolMass} step="0.01"
                  onChange={(e) => setCalcMolMass(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-blue-500/40 rounded-lg px-3 py-2 text-white font-mono" />
              </div>
              <div>
                <label className="block text-blue-300 text-sm mb-1">Massa yo'qotish (%)</label>
                <input type="number" value={calcMassLoss} step="0.1"
                  onChange={(e) => setCalcMassLoss(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-blue-500/40 rounded-lg px-3 py-2 text-white font-mono" />
              </div>
              <div className="bg-slate-950/60 border border-yellow-500/40 rounded-xl p-3 text-center">
                <div className="text-xs text-yellow-300 uppercase tracking-widest">n(NH₃)</div>
                <div className="text-4xl font-black text-yellow-200 my-2">{nNH3}</div>
                <div className="text-xs text-slate-400">M(NH₃) = 17.031 g/mol</div>
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-2">
              {[
                { step: "1-bosqich", loss: 12.7, expected: 2 },
                { step: "2-bosqich", loss: 33.5, expected: 4 },
                { step: "Jami (1+2)", loss: 38.2, expected: 6 },
              ].map((tst, i) => (
                <button key={i} onClick={() => { setCalcMolMass(267.48); setCalcMassLoss(tst.loss) }}
                  className="bg-slate-800/60 hover:bg-slate-700/70 border border-blue-500/30 rounded-xl p-3 text-left transition">
                  <div className="text-xs text-blue-300 font-bold">{tst.step}</div>
                  <div className="text-white font-mono">Δm = {tst.loss}%</div>
                  <div className="text-xs text-emerald-300">kutilgan n = {tst.expected}</div>
                </button>
              ))}
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 12. TERMIK BARQARORLIK QATORI ══════ */}
        <SectionBlock n="12" title="Termik barqarorlik qatori" subtitle="Boshqa Co(III) ammin komplekslari orasidagi o'rni">
          <div className="bg-slate-900/60 border border-amber-800/30 rounded-3xl p-6">
            <p className="text-slate-300 text-sm mb-4">
              Ammin komplekslari orasida <strong className="text-amber-300">[Co(NH₃)₆]³⁺</strong> — eng barqaror. Bu Co–N bog' energiyasi va kompleksning d⁶ LS konfiguratsiyasi bilan bog'liq. Barqarorlik qatori (T_boshi bo'yicha):
            </p>
            <div className="space-y-2">
              {[
                { rank: 1, formula: "[Co(en)₃]Cl₃", temp: 240, note: "Xelat effekt — eng barqaror", width: 100 },
                { rank: 2, formula: "[Co(NH₃)₆]Br₃",  temp: 210, note: "Br⁻ katta — barqarorlik oshiradi", width: 88 },
                { rank: 3, formula: "[Co(NH₃)₆]Cl₃ ⭐", temp: 199, note: "Sizning birikmangiz — etalon", width: 83, highlight: true },
                { rank: 4, formula: "[Co(NH₃)₄Cl₂]Cl", temp: 175, note: "Ichki Cl bor — kamroq NH₃ = kamroq barqaror", width: 73 },
                { rank: 5, formula: "[Co(NH₃)₆](NO₃)₃", temp: 165, note: "NO₃⁻ oksidlovchi — tez parchalanish", width: 69 },
                { rank: 6, formula: "[Co(NH₃)₅Cl]Cl₂", temp: 150, note: "5 NH₃, ichki Cl — past barqarorlik", width: 63 },
              ].map((b, i) => (
                <div key={i} className={`bg-slate-950/40 rounded-xl p-3 border ${b.highlight ? "border-amber-500/60" : "border-slate-700"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">#{b.rank}</span>
                      <span className={`font-mono font-bold ${b.highlight ? "text-amber-300" : "text-white"}`}>{b.formula}</span>
                    </div>
                    <span className={`font-mono font-bold ${b.highlight ? "text-amber-300" : "text-slate-300"}`}>{b.temp}°C</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${b.highlight ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-sky-500 to-blue-500"}`} style={{ width: `${b.width}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{b.note}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>

        {/* ══════ 13. NAMUNA TAYYORLASH ══════ */}
        <SectionBlock n="13" title="Namuna tayyorlash va laboratoriya tartibi" subtitle="8 bosqichli protokol — [Co(NH₃)₆]Cl₃ uchun optimal">
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { n: 1, title: "Namuna miqdori", desc: "2–5 mg (kichik massa — issiqlik gradiyentini kamaytiradi)" },
              { n: 2, title: "Zarracha o'lchami", desc: "< 100 μm nozik kukun (diffuziya cheklovlarini yo'q qiladi)" },
              { n: 3, title: "Krucible turi", desc: "Al₂O₃ tavsiya etiladi (Pt — NH₃ ni katalitik oksidlaydi, xato beradi)" },
              { n: 4, title: "Atmosfera", desc: "Ilk tahlil uchun N₂ (inert), so'ng havoda takrorlash — farqni ko'rish uchun" },
              { n: 5, title: "Purge oqim", desc: "20–50 ml/min (chiqindi gazlar tez chiqishi uchun)" },
              { n: 6, title: "Qizdirish tezligi β", desc: "5–10 °C/min asosiy; kinetik tahlil uchun 2, 5, 10, 20 °C/min (ICTAC 2011)" },
              { n: 7, title: "Harorat oralig'i", desc: "25 → 1000°C (barcha bosqichlarni qamrab olish uchun)" },
              { n: 8, title: "Kalibrlash", desc: "In (156.6°C, 28.5 J/g) va Zn (419.5°C) etalon namunalari bilan" },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 bg-slate-900/60 border border-amber-800/30 rounded-xl p-4 hover:border-amber-500/50 transition">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black">{s.n}</div>
                <div>
                  <p className="font-bold text-amber-200">{s.title}</p>
                  <p className="text-xs text-slate-300 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ══════ 14. XATOLIK MANBALARI ══════ */}
        <SectionBlock n="14" title="Xatolik manbalari va ularni bartaraf etish" subtitle="Aniqlikni oshirish uchun 6 ta muhim omil">
          <div className="grid md:grid-cols-2 gap-4">
            {interferences.map((interf, i) => (
              <div key={i} className={`rounded-2xl p-5 border ${interf.severity === "Kritik" ? "bg-red-950/30 border-red-500/40" : interf.severity === "Yuqori" ? "bg-orange-950/30 border-orange-500/40" : interf.severity === "O'rta" ? "bg-yellow-950/30 border-yellow-500/40" : "bg-slate-800/40 border-slate-600"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${interf.color}`}>{interf.source}</h4>
                  <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-widest font-black ${interf.severity === "Kritik" ? "bg-red-500/30 text-red-200" : interf.severity === "Yuqori" ? "bg-orange-500/30 text-orange-200" : "bg-yellow-500/30 text-yellow-200"}`}>{interf.severity}</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">{interf.detail}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ══════ 15. TERMOXROMIZM ══════ */}
        <SectionBlock n="15" title="Termoxromizm — rang o'zgarishi tarixi" subtitle="Har bosqichda rang — nima demak?">
          <div className="bg-slate-900/60 border border-amber-800/30 rounded-3xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {colorChanges.map((c, i) => (
                <div key={i} className="bg-slate-950/60 rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition">
                  <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${c.color}dd, ${c.color}77)` }} />
                  <div className="p-3">
                    <div className="text-xs text-amber-300 font-mono font-bold">{c.temp}</div>
                    <div className="text-white font-bold text-sm mt-1">{c.name}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-tight">{c.state}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">
              <strong className="text-amber-300">Termoxromizm sabablari:</strong> Har bosqichda Co markazi atrofidagi <em>ligand maydoni o'zgaradi</em> — bu Δₒ ni o'zgartiradi va yutilgan yorug'lik uzunligini o'zgartiradi (“Werner rangi qonuni”). Yakuniy Co₃O₄ — aralash valentli oksid (Co²⁺/Co³⁺ shpineli), qora rangi elektron o'tishlar tufayli.
            </p>
          </div>
        </SectionBlock>

        {/* ══════ 16. TARIXIY XRONOLOGIYA ══════ */}
        <SectionBlock n="16" title="Tarixiy xronologiya" subtitle="Tassaert (1798) dan Bereczki (2022) gacha — 220 yillik ilmiy sayohat">
          <div className="relative pl-6 space-y-3">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-500 via-sky-500 to-indigo-500" />
            {timeline.map((t, i) => (
              <div key={i} className="relative bg-slate-900/60 border border-amber-800/30 rounded-xl p-4 hover:border-amber-500/50 transition">
                <div className="absolute -left-[26px] top-4 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-slate-950 shadow-lg" />
                <div className="flex items-baseline gap-3">
                  <span className="font-mono font-black text-amber-300 text-lg">{t.year}</span>
                  <p className="text-slate-200 text-sm flex-1">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ══════ 17. AMALIY AHAMIYATI ══════ */}
        <SectionBlock n="17" title="Amaliy ahamiyati" subtitle="8 ta soha — fanidan sanoatgacha">
          <div className="grid md:grid-cols-2 gap-3">
            {applications.map((a, i) => (
              <div key={i} className="bg-slate-900/60 border-l-4 border-amber-500 rounded-lg p-4 hover:bg-slate-800/60 transition">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{a.icon}</div>
                  <div>
                    <p className="font-bold text-amber-200">{a.field}</p>
                    <p className="text-slate-300 text-sm mt-1">{a.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ══════ 18. XULOSA ══════ */}
        <SectionBlock n="18" title="Xulosa — 10 asosiy tushuncha" subtitle="[Co(NH₃)₆]Cl₃ termik tahlili haqida esda saqlash kerak bo'lgan bilim">
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-8">
            <ol className="space-y-3 text-slate-100 list-decimal list-inside marker:text-amber-300 marker:font-black">
              <li><strong className="text-amber-300">Werner klassikasi (1893)</strong> — koordinatsion kimyoning eksperimental etaloni, Nobel mukofoti (1913).</li>
              <li>Konfiguratsiya: <strong className="text-sky-300">Co³⁺ d⁶ LS</strong>, oktaedrik <strong>Oh</strong>, t₂g⁶ eg⁰ — juda inert (Taube 1952).</li>
              <li>Termik parchalanish <strong className="text-orange-300">199°C</strong> dan boshlanadi (Wendlandt 1963) va 3 bosqichda amalga oshadi.</li>
              <li><strong>1-bosqich (199–260°C):</strong> 2 NH₃ → [Co(NH₃)₄]Cl₃, F₁ kinetika, Eₐ ≈ 128 kJ/mol, endotermik.</li>
              <li><strong>2-bosqich (260–420°C):</strong> qolgan 4 NH₃ + ichki <em>Co³⁺→Co²⁺</em> redoksi → CoCl₂, R₃ kinetika, Eₐ ≈ 165 kJ/mol.</li>
              <li><strong>3-bosqich (havoda, 600–900°C):</strong> CoCl₂ + O₂ → Co₃O₄, D₃ (Jander) diffuziya, ekzotermik.</li>
              <li>Atmosfera hal qiluvchi: <strong className="text-orange-300">havoda</strong> → Co₃O₄ (40%), <strong className="text-sky-300">inertda</strong> → CoCl₂ (48%).</li>
              <li>Har bosqichda rang: sariq → to'q sariq → jigarrang → to'q ko'k → qora (termoxromizm).</li>
              <li>Barcha Eₐ qiymatlari — <strong>Kissinger, OFW, KAS</strong> yoki <strong>Vyazovkin</strong> usullari bilan olinishi mumkin (ICTAC 2011).</li>
              <li>Amaliy: <strong className="text-emerald-300">Werner ta'lim standarti</strong>, <strong>Co₃O₄ batareya-katalizator prekursori</strong>, TGA/DSC kalibrlash.</li>
            </ol>
          </div>
        </SectionBlock>

        {/* ══════ 19. NAVIGATSIYA ══════ */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <Link href="/ilmiy/tahlil/termik/birikmalar"
            className="flex-1 group px-6 py-4 rounded-2xl border border-amber-800/40 bg-slate-900/60 hover:bg-amber-950/40 transition text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Katalog</div>
            <div className="text-amber-300 font-bold group-hover:text-amber-200 transition">← Barcha 12 birikma</div>
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="flex-1 group px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 shadow-lg shadow-amber-500/30 transition text-center">
            <div className="text-xs text-amber-100 uppercase tracking-widest">PDF eksport</div>
            <div className="text-white font-black text-lg">📄 To'liq hisobot yuklab olish</div>
          </button>
          <Link href="/ilmiy/tahlil/termik/birikmalar/ni-en3-cl2"
            className="flex-1 group px-6 py-4 rounded-2xl border border-emerald-800/40 bg-slate-900/60 hover:bg-emerald-950/40 transition text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Keyingi</div>
            <div className="text-emerald-300 font-bold group-hover:text-emerald-200 transition">[Ni(en)₃]Cl₂ →</div>
          </Link>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="relative border-t border-amber-800/30 py-8 mt-8 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl shadow-lg" style={{ background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}77)` }} />
              <div>
                <div className="text-xs text-amber-400 uppercase tracking-widest">JDA Kimyo • Premium birikma</div>
                <div className="text-white font-black" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </div>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <p>© 2026 Koordinatsion kimyo tahlil portali</p>
              <p className="text-slate-600 mt-1">Termik moduli • [Co(NH₃)₆]Cl₃ batafsil sahifasi</p>
            </div>
          </div>
          <div className="pt-4 border-t border-amber-900/30 text-[10px] text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Asosiy manbalar:</strong>
            Zivkovic Z. D. — <em>J. Thermal Anal.</em> 41, 99 (1994) •
            Wendlandt W. W. — <em>J. Inorg. Nucl. Chem.</em> 25, 545 (1963) •
            Simmons E. L., Wendlandt W. W. — <em>Inorg. Chem.</em> 5, 1103 (1966) •
            Liming Z. et al. — <em>Thermochim. Acta</em> 202, 245 (1992) •
            Vyazovkin S. et al. (ICTAC) — <em>Thermochim. Acta</em> 520, 1 (2011) •
            Brown M. E. — <em>Introduction to Thermal Analysis</em> (2nd ed., 2001) •
            Basolo F., Pearson R. G. — <em>Mechanisms of Inorganic Reactions</em> (Wiley, 1967) •
            Housecroft & Sharpe — <em>Inorganic Chemistry</em> (4th ed., 2012) •
            Wikipedia, PubChem CID 159295, Sigma-Aldrich 481521, American Elements.
          </div>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// KICHIK KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════════

function SectionBlock({ n, title, subtitle, children }) {
  return (
    <div className="fade-in-up">
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs font-mono text-amber-500 tracking-widest">§{n}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-1 italic">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function MiniStat({ label, value, sub, color, isText }) {
  return (
    <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className={`${isText ? "text-sm" : "text-2xl"} font-black ${color} truncate`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 font-mono mt-1">{sub}</div>}
    </div>
  )
}

function SchemeNode({ active, label, color, note }) {
  return (
    <div className={`text-center transition ${active ? "scale-110" : "opacity-60"}`}>
      <div className="rounded-2xl px-4 py-3 font-mono font-bold text-white text-sm border-2"
        style={{ background: active ? color : `${color}33`, borderColor: active ? "white" : color, boxShadow: active ? `0 0 30px ${color}88` : "none" }}>
        {label}
      </div>
      <div className="text-[10px] text-slate-500 mt-1">{note}</div>
    </div>
  )
}

function SchemeArrow({ label, temp, note }) {
  return (
    <div className="text-center">
      <div className="text-red-400 text-2xl">→</div>
      <div className="text-[10px] text-red-300 font-bold whitespace-nowrap">{label}</div>
      <div className="text-[9px] text-slate-500 font-mono">{temp}</div>
      {note && <div className="text-[9px] text-orange-300">{note}</div>}
    </div>
  )
}

function OrbitalDiagram() {
  return (
    <svg viewBox="0 0 300 120" className="w-full h-auto">
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#a78bfa" />
        </marker>
      </defs>
      <text x="20" y="20" fill="#fbbf24" fontSize="10" fontWeight="bold">eg (bo'sh, 0e⁻)</text>
      <line x1="20" y1="35" x2="70" y2="35" stroke="#64748b" strokeWidth="2" />
      <line x1="90" y1="35" x2="140" y2="35" stroke="#64748b" strokeWidth="2" />
      <text x="20" y="75" fill="#22d3ee" fontSize="10" fontWeight="bold">t2g (to'liq, 6e⁻) — t2g⁶</text>
      <line x1="20" y1="90" x2="70" y2="90" stroke="#fbbf24" strokeWidth="2.5" />
      <line x1="90" y1="90" x2="140" y2="90" stroke="#fbbf24" strokeWidth="2.5" />
      <line x1="160" y1="90" x2="210" y2="90" stroke="#fbbf24" strokeWidth="2.5" />
      {[[30, 88, 50, 88], [110, 88, 130, 88], [180, 88, 200, 88]].map((pos, i) => (
        <g key={i}>
          <text x={pos[0]} y={pos[1]} fill="#f59e0b" fontSize="14" fontWeight="bold">↑</text>
          <text x={pos[2]} y={pos[3]} fill="#f59e0b" fontSize="14" fontWeight="bold">↓</text>
        </g>
      ))}
      <line x1="250" y1="35" x2="250" y2="90" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
      <text x="260" y="65" fill="#a78bfa" fontSize="11" fontWeight="bold">Δₒ</text>
      <text x="260" y="78" fill="#a78bfa" fontSize="8">katta</text>
    </svg>
  )
}

// ═══ TGA / DTG / DSC birlashgan SVG grafik
function TGADTGDSCChart({ data, activeTab, tempSlider }) {
  const W = 800, H = 360, pad = 45
  const xScale = (t) => pad + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * (W - 2 * pad)
  const yScaleMass = (m) => pad + ((100 - m) / 65) * (H - 2 * pad)
  const yScaleDTG = (d) => H / 2 - (d / 10) * (H / 2 - pad)
  const yScaleDSC = (s) => H / 2 - (s / 40) * (H / 2 - pad)

  const pathTGA = data.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleMass(p.mass)}`).join(" ")
  const pathDTG = data.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleDTG(p.dtg)}`).join(" ")
  const pathDSC = data.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.temp)} ${yScaleDSC(p.dsc)}`).join(" ")

  const showTGA = activeTab === "TGA" || activeTab === "BARCHASI"
  const showDTG = activeTab === "DTG" || activeTab === "BARCHASI"
  const showDSC = activeTab === "DSC" || activeTab === "BARCHASI"

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="tga-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 200, 400, 600, 800, 1000].map((t, i) => (
        <g key={i}>
          <line x1={xScale(t)} y1={pad} x2={xScale(t)} y2={H - pad} stroke="#334155" strokeWidth="0.3" strokeDasharray="2,3" />
          <text x={xScale(t)} y={H - pad + 15} fill="#94a3b8" fontSize="10" textAnchor="middle">{t}°C</text>
        </g>
      ))}
      {[35, 60, 85, 100].map((m, i) => (
        <g key={i}>
          <line x1={pad} y1={yScaleMass(m)} x2={W - pad} y2={yScaleMass(m)} stroke="#334155" strokeWidth="0.3" strokeDasharray="1,3" />
          <text x={pad - 5} y={yScaleMass(m) + 3} fill="#94a3b8" fontSize="9" textAnchor="end">{m}%</text>
        </g>
      ))}
      {(showDTG || showDSC) && (
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="#475569" strokeWidth="0.5" strokeDasharray="3,3" />
      )}
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#fbbf24" strokeWidth="1.5" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#fbbf24" strokeWidth="1.5" />
      {showTGA && (
        <path d={`${pathTGA} L ${W - pad},${H - pad} L ${pad},${H - pad} Z`} fill="url(#tga-fill)" />
      )}
      {showTGA && <path d={pathTGA} stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {showDTG && <path d={pathDTG} stroke="#f87171" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />}
      {showDSC && <path d={pathDSC} stroke="#c084fc" strokeWidth="2.5" fill="none" strokeDasharray="2,3" />}
      <line x1={xScale(tempSlider)} y1={pad} x2={xScale(tempSlider)} y2={H - pad} stroke="#38bdf8" strokeWidth="2" />
      <text x={xScale(tempSlider)} y={pad - 5} fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">{tempSlider}°C</text>
      {showTGA && (
        <>
          {[{ t: 220, m: 92.4, l: "1-bosqich (-2 NH3)", c: "#22d3ee" },
            { t: 350, m: 74.5, l: "2-bosqich (-4 NH3)", c: "#60a5fa" },
            { t: 750, m: 55.0, l: "3-bosqich (+O2)", c: "#fb923c" }].map((mk, i) => (
            <g key={i}>
              <circle cx={xScale(mk.t)} cy={yScaleMass(mk.m)} r="5" fill={mk.c} stroke="#0f172a" strokeWidth="1.5" />
              <text x={xScale(mk.t)} y={yScaleMass(mk.m) - 10} fill={mk.c} fontSize="9" textAnchor="middle" fontWeight="bold">{mk.l}</text>
            </g>
          ))}
        </>
      )}
      <g transform="translate(560, 15)">
        {showTGA && (<><rect x="0" y="0" width="16" height="3" fill="#fbbf24"/><text x="22" y="5" fill="#fbbf24" fontSize="11">TGA (massa %)</text></>)}
        {showDTG && (<><rect x="0" y="18" width="16" height="3" fill="#f87171"/><text x="22" y="23" fill="#f87171" fontSize="11">DTG (dm/dT)</text></>)}
        {showDSC && (<><rect x="0" y="36" width="16" height="3" fill="#c084fc"/><text x="22" y="41" fill="#c084fc" fontSize="11">DSC (mW)</text></>)}
      </g>
      <text x={W / 2} y={H - 8} fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">Harorat (°C)</text>
    </svg>
  )
}

// ═══ f(α) va g(α) SVG grafik
function FGCurveChart({ model, currentAlpha }) {
  const W = 400, H = 260, pad = 30
  const N = 100
  const alphas = Array.from({ length: N + 1 }, (_, i) => 0.005 + (0.99 * i) / N)

  function computeFG(a, m) {
    const models = {
      F1: { f: 1 - a,                                                        g: -Math.log(1 - a) },
      R2: { f: 2 * Math.pow(1 - a, 0.5),                                     g: 1 - Math.pow(1 - a, 0.5) },
      R3: { f: 3 * Math.pow(1 - a, 2/3),                                     g: 1 - Math.pow(1 - a, 1/3) },
      A2: { f: 2 * (1 - a) * Math.pow(-Math.log(1 - a), 0.5),                g: Math.pow(-Math.log(1 - a), 0.5) },
      D3: { f: (3 * Math.pow(1 - a, 2/3)) / (2 * (1 - Math.pow(1 - a, 1/3))), g: Math.pow(1 - Math.pow(1 - a, 1/3), 2) },
      D4: { f: 3 / (2 * (Math.pow(1 - a, -1/3) - 1)),                        g: 1 - (2 * a / 3) - Math.pow(1 - a, 2/3) },
    }
    return models[m] || models.F1
  }

  const fValues = alphas.map(a => computeFG(a, model).f).filter(v => isFinite(v) && v < 100)
  const gValues = alphas.map(a => computeFG(a, model).g).filter(v => isFinite(v) && v < 100)
  const fMax = Math.max(...fValues, 0.001)
  const gMax = Math.max(...gValues, 0.001)

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
      {[0, 0.25, 0.5, 0.75, 1].map((a, i) => (
        <line key={i} x1={xScale(a)} y1={pad} x2={xScale(a)} y2={H - pad} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
      ))}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#fbbf24" strokeWidth="1.5" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#fbbf24" strokeWidth="1.5" />
      <path d={pathF} stroke="#10b981" strokeWidth="2.5" fill="none" />
      <path d={pathG} stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="5,3" />
      <line x1={xScale(currentAlpha)} y1={pad} x2={xScale(currentAlpha)} y2={H - pad} stroke="#fde047" strokeWidth="2" />
      {isFinite(computeFG(currentAlpha, model).f) && computeFG(currentAlpha, model).f < 100 && (
        <circle cx={xScale(currentAlpha)} cy={yScaleF(computeFG(currentAlpha, model).f)} r="5" fill="#10b981" />
      )}
      {isFinite(computeFG(currentAlpha, model).g) && computeFG(currentAlpha, model).g < 100 && (
        <circle cx={xScale(currentAlpha)} cy={yScaleG(computeFG(currentAlpha, model).g)} r="5" fill="#38bdf8" />
      )}
      <text x={W / 2} y={H - 5} fill="#fbbf24" fontSize="11" textAnchor="middle">α (konversiya)</text>
      <text x={W - pad - 5} y={pad + 15} fill="#10b981" fontSize="11" textAnchor="end">f(α)</text>
      <text x={W - pad - 5} y={pad + 30} fill="#38bdf8" fontSize="11" textAnchor="end">g(α) - - -</text>
    </svg>
  )
}
