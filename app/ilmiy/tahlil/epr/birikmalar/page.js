"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// EPR SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// 26 ta EPR-faol kompleks birikma va radikal — g-tensor, hiperfin, ZFS, spin,
// diagnostik imzo va simulyatsiyalangan spektr bilan.
// Manbalar:
//   • J. A. Weil, J. R. Bolton — Electron Paramagnetic Resonance (2nd ed.)
//   • F. E. Mabbs, D. Collison — EPR of d Transition Metal Compounds
//   • J. R. Pilbrow — Transition Ion Electron Paramagnetic Resonance
//   • Bruker EPR 101, LibreTexts EPR modullari
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  // ───────────────────────────────────────────────────────────
  // ORGANIK RADIKALLAR (klassik EPR standartlar)
  // ───────────────────────────────────────────────────────────
  {
    id: "dpph",
    slug: "dpph",
    formulaHTML: "DPPH<sup>•</sup>",
    formulaPlain: "DPPH radical",
    iupac: "2,2-difenil-1-pikrilgidrazil radikali",
    commonName: "DPPH — EPR g-standarti",
    family: "Barqaror organik radikal",
    structure: "Delokalizatsiyalangan π-radikal, N–N· markazi",
    metal: "—",
    dConfig: "π-radikal (SOMO)",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Qattiq kukun yoki eritma (xona harorati)",
    gValues: "g = 2.0036 (izotrop)",
    gType: "Deyarli izotrop",
    hyperfine: "Zaif; N va H couplinglar chiziq ichida yashiringan",
    nuclear: "¹⁴N, ¹H",
    zfs: "Yo'q (S = 1/2)",
    signature: "Xona haroratida bitta tor, keskin chiziq; g-kalibrovka uchun etalon",
    diagnostic: "Magnit maydonni kalibrlash, sezgirlik testi, antioksidant assay",
    caution: "Kristall exchange linewidth ni o'zgartiradi",
    simCenterG: 2.0036, simA: 9, simI: 1, simN: 2, simLinewidth: 4, simS: 0.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "π-radikal SOMO", text: "Toq elektron N–N· da joylashgan va picril halqasi orqali delokalizatsiyalangan — bu barqarorlikni ta'minlaydi." },
      { title: "Nima uchun g-standart?", text: "g qiymati eritma va qattiq holatda deyarli o'zgarmas hamda reproducible; dunyoning barcha EPR laboratoriyalarida etalon material." },
    ],
    applications: ["EPR g-kalibrovka", "Antioksidant assay", "Sezgirlik testi", "O'quv laboratoriyasi"],
    alternatives: ["UV-Vis (517 nm)", "Mass-spektrometriya", "¹H NMR paramagnit"],
    tags: ["radikal", "S=1/2", "g-standart", "izotrop"],
  },
  {
    id: "tempo",
    slug: "tempo",
    formulaHTML: "TEMPO<sup>•</sup>",
    formulaPlain: "TEMPO radical",
    iupac: "2,2,6,6-tetrametilpiperidin-1-oksil radikali",
    commonName: "TEMPO — nitroksid spin-label",
    family: "Barqaror nitroksid radikal",
    structure: "Olti a'zoli piperidin halqasi, N–O· markazi",
    metal: "—",
    dConfig: "π*(N–O) SOMO",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Suyuq eritma yoki muzlatilgan matritsa",
    gValues: "g<sub>iso</sub> = 2.006; muzlatilganda tensor ajraladi",
    gType: "Eritmada izotrop, qattiqda rombik",
    hyperfine: "¹⁴N: I=1 → 1:1:1 triplet; a<sub>N</sub> ≈ 15.5 G",
    nuclear: "¹⁴N (I=1)",
    zfs: "Yo'q (S = 1/2)",
    signature: "Eritmada 3 chiziqli nitroksid tripleti; harakatchanlik indikatori",
    diagnostic: "Mikroviskozlik, spin-label, membrana dinamikasi",
    caution: "O₂ va yuqori kontsentratsiya chiziqlarni kengaytiradi",
    simCenterG: 2.006, simA: 15.5, simI: 1, simN: 1, simLinewidth: 3, simS: 0.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "3-chiziqli pattern", text: "¹⁴N (I=1) sabab 2I+1=3 ta o'tish; ekvivalent N bitta bo'lgani uchun intensivliklar 1:1:1." },
      { title: "Tumbling rejimi", text: "Tez aylanish (τc<10⁻¹⁰ s) g va A ni o'rtachalab izotrop 3-chiziq beradi; sekin rejimda chiziqlar assimmetrik bo'ladi va τc olinadi." },
    ],
    applications: ["Membrana suyuqligini o'lchash", "SDSL oqsil tadqiqotlari", "Radikal polimerlanish mediatori", "Antioksidantlik"],
    alternatives: ["Fluoresans anizotropiya", "Cryo-EM", "NMR paramagnit relaksatsiya"],
    tags: ["radikal", "S=1/2", "¹⁴N", "spin-label", "3-chiziq"],
  },

  // ───────────────────────────────────────────────────────────
  // Cu(II) KOMPLEKSLARI (d⁹, klassik aksial EPR)
  // ───────────────────────────────────────────────────────────
  {
    id: "cu-acac2",
    slug: "cu-acac2",
    formulaHTML: "[Cu(acac)<sub>2</sub>]",
    formulaPlain: "Cu(acac)2",
    iupac: "Bis(2,4-pentandionato)mis(II)",
    commonName: "Mis(II) atsetilatsetonat",
    family: "Cu(II) β-diketonat",
    structure: "Kvadrat tekis CuO<sub>4</sub>, D<sub>2h</sub>",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan toluol/xloroform (77 K) yoki qattiq",
    gValues: "g<sub>∥</sub> = 2.264; g<sub>⊥</sub> = 2.053",
    gType: "Aksial (g<sub>∥</sub> > g<sub>⊥</sub> > g<sub>e</sub>)",
    hyperfine: "⁶³/⁶⁵Cu (I=3/2): A<sub>∥</sub> ≈ 165 G — 4 chiziq",
    nuclear: "⁶³Cu (69.2%), ⁶⁵Cu (30.8%)",
    zfs: "Yo'q (S=1/2)",
    signature: "Parallel sohada 4 ta yaxshi ajralgan Cu hiperfin chiziq",
    diagnostic: "dx²−y² asosiy holat, kvadrat tekis O<sub>4</sub> muhit, Cu–L kovalentligi",
    caution: "Konsentrirlangan qattiq namunada dipolyar coupling hiperfin ni yomonlashtiradi",
    simCenterG: 2.13, simA: 45, simI: 1.5, simN: 1, simLinewidth: 15, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "dx²−y² ground state", text: "Kvadrat tekis Cu(II) da toq elektron ekvatorial ligandlar bilan σ-antibonding dx²−y² orbitalida joylashgan." },
      { title: "Peisach–Blumberg", text: "A<sub>∥</sub>/g<sub>∥</sub> juftligi donor atomlar tabiatini (O₄ vs N₄ vs aralash) diagrammada ochib beradi." },
    ],
    applications: ["EPR o'lchov standarti", "MOCVD prekursori", "Kataliz", "Cu-oqsil modeli"],
    alternatives: ["UV-Vis (660 nm)", "SQUID", "SCXRD"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "aksial", "4-chiziq"],
  },
  {
    id: "cu-gly2",
    slug: "cu-gly2",
    formulaHTML: "[Cu(gly)<sub>2</sub>]",
    formulaPlain: "Cu(gly)2",
    iupac: "Bis(glitsinato)mis(II)",
    commonName: "Mis(II) glitsinat",
    family: "Cu(II) aminokarboksilat",
    structure: "N<sub>2</sub>O<sub>2</sub> ekvatorial, cis/trans izomerlar",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Suvli eritma (pH 5-7) yoki muzlatilgan",
    gValues: "g<sub>∥</sub> ≈ 2.24; g<sub>⊥</sub> ≈ 2.06",
    gType: "Aksial (kichik rombiklik)",
    hyperfine: "⁶³Cu 4-lik; ¹⁴N supergiperfin a<sub>N</sub> ≈ 12-15 G",
    nuclear: "⁶³/⁶⁵Cu, 2 × ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "N-donor koordinatsiyaning aniq belgisi — ¹⁴N supergiperfin fine",
    diagnostic: "N vs O donor nisbati, pH bog'liqligi, bio-mimetik model",
    caution: "pH < 4 protonlanadi, pH > 9 gidroksid koordinatsiyaga aralashadi",
    simCenterG: 2.15, simA: 50, simI: 1.5, simN: 1, simLinewidth: 14, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "N₂O₂ imzosi", text: "Ekvatorial 2N+2O muhit g<sub>∥</sub> ≈ 2.24-2.28 beradi — N atomlar soni oshsa g<sub>∥</sub> kamayadi." },
      { title: "Peisach-Blumberg", text: "A<sub>∥</sub> va g<sub>∥</sub> juftligi 2N+2O zonasiga tushadi va boshqa kompozitsiyalardan ajraladi." },
    ],
    applications: ["Cu-oqsil bioanorganik model", "pH sensor", "Cu-xelatlash o'rganish"],
    alternatives: ["UV-Vis (620 nm)", "IR (νCOO⁻)", "Potensiometrik titrlash"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "aminokislota", "N-donor", "bioanorganik"],
  },
  {
    id: "cu-salen",
    slug: "cu-salen",
    formulaHTML: "[Cu(salen)]",
    formulaPlain: "Cu(salen)",
    iupac: "N,N′-bis(salitsiliden)etilendiaminmis(II)",
    commonName: "Mis(II) salen",
    family: "Cu(II) Shiff asosi",
    structure: "N<sub>2</sub>O<sub>2</sub> kvadrat tekis",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan organik eritma (77 K)",
    gValues: "g<sub>∥</sub> = 2.20; g<sub>⊥</sub> = 2.05",
    gType: "Aksial",
    hyperfine: "⁶³Cu A<sub>∥</sub> ≈ 200 G (4-lik); ¹⁴N supergiperfin",
    nuclear: "⁶³/⁶⁵Cu, 2 × ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "Klassik Cu(II) dx²−y² aksial imzo, Jacobsen prototipi",
    diagnostic: "Katalitik oksidlanish, Cu(II)/Cu(I) redoks, aksial adductlar",
    caution: "Aksial O₂ yoki solvent bog'lanishi spektrni o'zgartiradi",
    simCenterG: 2.10, simA: 50, simI: 1.5, simN: 1, simLinewidth: 14, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Shiff asosi planaritet", text: "Salen ligandi bikubik N₂O₂ maydon hosil qiladi va Cu(II) ni deyarli mukammal kvadrat tekis holatda ushlaydi." },
      { title: "Peisach-Blumberg zona", text: "Cu(salen) N₂O₂ zonaga tushadi va Cu(gly)₂ dan biroz farq qiladi — salen kuchliroq ligand maydonini beradi." },
    ],
    applications: ["Jacobsen katalizator prototipi", "Cu-oqsil modeli", "Elektrokimyo", "Foto-kataliz"],
    alternatives: ["UV-Vis (600 nm)", "IR (νC=N)", "SCXRD"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "Shiff-asosi", "aksial"],
  },
  {
    id: "cu-phen2",
    slug: "cu-phen2",
    formulaHTML: "[Cu(phen)<sub>2</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(phen)2]2+",
    iupac: "Bis(1,10-fenantrolin)mis(II) ioni",
    commonName: "Cu(II)-phen kompleksi",
    family: "Cu(II) diimin",
    structure: "Buzilgan kvadrat piramidal / flattened tetraedr",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Suvli/spirtli eritma yoki muzlatilgan",
    gValues: "g<sub>∥</sub> = 2.24; g<sub>⊥</sub> = 2.07",
    gType: "Aksial, kichik rombiklik",
    hyperfine: "⁶³Cu A<sub>∥</sub> ≈ 170 G; 4 × ¹⁴N supergiperfin",
    nuclear: "⁶³/⁶⁵Cu, 4 × ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "N<sub>4</sub> koordinatsiyada 9 chiziqli ¹⁴N fine tuzilma",
    diagnostic: "DNA-nuclease, Cu(II)/Cu(I) redoks, bioaktiv Cu komplekslar",
    caution: "Cu(I) hosil bo'lganda signal yo'qoladi — redoks indikatori",
    simCenterG: 2.13, simA: 45, simI: 1.5, simN: 1, simLinewidth: 16, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "π-akseptor phen", text: "Fenantrolin π-akseptor sifatida Cu(II) geometriyasini kvadrat piramidal va flattened tetraedr oralig'ida saqlaydi." },
      { title: "DNA-nuclease faollik", text: "Cu(phen)₂ O₂ ishtirokida DNA-ni sindiradi; EPR bu jarayonda Cu(II) hisobini kuzatishga imkon beradi." },
    ],
    applications: ["Anti-kanser Cu-metallodrugs", "DNA-nuclease reagenti", "Enzim modeli", "Foto-kataliz"],
    alternatives: ["UV-Vis (700 nm)", "DNA-binding CD", "Elektrokimyo"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "diimin", "bioaktiv"],
  },
  {
    id: "cu-edta",
    slug: "cu-edta",
    formulaHTML: "[Cu(EDTA)]<sup>2−</sup>",
    formulaPlain: "[Cu(EDTA)]2-",
    iupac: "Etilendiamintetraatsetato-mis(II)",
    commonName: "Cu(II)-EDTA xelati",
    family: "Cu(II) polidentat xelat",
    structure: "N<sub>2</sub>O<sub>4</sub> geksadentat, buzilgan oktaedr",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Suvli eritma (pH 6-10) yoki muzlatilgan (77 K)",
    gValues: "g<sub>∥</sub> = 2.29; g<sub>⊥</sub> = 2.06",
    gType: "Aksial",
    hyperfine: "⁶³Cu A<sub>∥</sub> ≈ 170 G; ¹⁴N supergiperfin (2 × I=1)",
    nuclear: "⁶³/⁶⁵Cu, 2 × ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "N₂O₄ 6-donor xelat uchun aksial spektr — analitik standart",
    diagnostic: "EDTA barqarorligi, Cu²⁺ maskirovka, ifloslarni bog'lash",
    caution: "pH < 4 protonlanadi, pH > 10 gidroksid koordinatsiyaga qo'shiladi",
    simCenterG: 2.14, simA: 42, simI: 1.5, simN: 1, simLinewidth: 14, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Xelat effekti", text: "EDTA polidentatligi entropik jihatdan favor qilinadi, log K ≈ 18.8." },
      { title: "N₂O₄ EPR imzosi", text: "6 donor atom Peisach-Blumberg diagrammasida aniq zonaga tushadi." },
    ],
    applications: ["Analitik titrimetriya", "Sanoat ifloslariga qarshi", "Suv tozalash", "Farmatsevtika"],
    alternatives: ["UV-Vis (735 nm)", "Potensiometrik", "Kondüktometriya"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "xelat", "EDTA"],
  },
  {
    id: "cu-zn-sod-model",
    slug: "cu-zn-sod-model",
    formulaHTML: "[Cu(imH)<sub>4</sub>]<sup>2+</sup>",
    formulaPlain: "Cu(imidazole)4",
    iupac: "Tetrakis(imidazol)mis(II) ioni",
    commonName: "Cu-Zn SOD faol markaz modeli",
    family: "Cu(II) bioanorganik model",
    structure: "N<sub>4</sub> kvadrat tekis / piramidal",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Fizyologik bufer (pH 7.4) yoki muzlatilgan bio-namuna",
    gValues: "g<sub>∥</sub> = 2.26; g<sub>⊥</sub> = 2.06",
    gType: "Aksial (klassik Peisach-Blumberg N<sub>4</sub>)",
    hyperfine: "⁶³Cu A<sub>∥</sub> ≈ 165 G; 4 × ¹⁴N (9-lik fine)",
    nuclear: "⁶³/⁶⁵Cu, 4 × ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "Bioanorganik Cu(II)-N<sub>4</sub> uchun klassik SOD imzosi",
    diagnostic: "Cu-Zn SOD, plastoyanin, azurin faol markazlari",
    caution: "Cu(I) redoks holatida signal yo'qoladi",
    simCenterG: 2.13, simA: 42, simI: 1.5, simN: 1, simLinewidth: 12, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "N<sub>4</sub> imidazol muhit", text: "Cu-oqsillar faol markazlari 3-4 imidazol bilan koordinatsiyalangan; Peisach-Blumberg N<sub>4</sub> zonasiga to'g'ri keladi." },
      { title: "SOD reaksiyasi", text: "Cu(II) + O₂•⁻ → Cu(I) + O₂; Cu(I) + O₂•⁻ + 2H⁺ → Cu(II) + H₂O₂; EPR Cu(II)-Cu(I) o'zgarishlarini kuzatadi." },
    ],
    applications: ["Antioksidant enzim tadqiqoti", "SOD-mimetik dorilar", "ALS neyrodegeneratsiya", "Bioanorganik modellar"],
    alternatives: ["UV-Vis (610 nm)", "MCD", "EXAFS Cu K-edge"],
    tags: ["Cu²⁺", "d⁹", "S=1/2", "bioanorganik", "SOD"],
  },
  {
    id: "cu2-acetate",
    slug: "cu2-acetate",
    formulaHTML: "[Cu<sub>2</sub>(OAc)<sub>4</sub>(H<sub>2</sub>O)<sub>2</sub>]",
    formulaPlain: "Cu2(OAc)4(H2O)2",
    iupac: "Tetra-μ-atsetato-diaquodimis(II)",
    commonName: "Mis(II) atsetat dimeri",
    family: "Dinuklear Cu(II) kompleksi",
    structure: "Paddlewheel Cu<sub>2</sub>(OAc)<sub>4</sub>, Cu-Cu ≈ 2.64 Å",
    metal: "2 × Cu²⁺",
    dConfig: "2 × d⁹",
    spin: "S = 0 (asosiy) / S = 1 (termik)",
    unpaired: 2,
    status: "Faol",
    sample: "Qattiq holat yoki temperaturali eritma seriyasi",
    gValues: "Triplet: g<sub>∥</sub> ≈ 2.35, g<sub>⊥</sub> ≈ 2.07",
    gType: "Aksial, exchange bilan modifikatsiyalangan",
    hyperfine: "2 × Cu (I=3/2) — 7 chiziqli pattern",
    nuclear: "2 × ⁶³/⁶⁵Cu",
    zfs: "Triplet: D ≈ 0.34 cm⁻¹",
    signature: "Klassik dimer paddlewheel — 'g=4' yarim-taqiqlangan chizig'i",
    diagnostic: "Cu-Cu exchange J, MOF va supramolekulyar strukturalar",
    caution: "Signal harorat ga juda bog'liq (Bleaney-Bowers)",
    simCenterG: 2.15, simA: 25, simI: 1.5, simN: 2, simLinewidth: 20, simS: 1,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "Bleaney-Bowers", text: "χ(T) = (Nβ²g²/kT) · [3 + exp(−2J/kT)]⁻¹; antiferromagnit dimer, J ≈ −286 cm⁻¹." },
      { title: "ΔmS=±2 o'tish", text: "Triplet holatda yarim-taqiqlangan 'g=4' chizig'i paddlewheel dimerning diagnostik imzosi." },
    ],
    applications: ["Molekulyar magnetlar", "MOF sintezi (Cu-BTC, HKUST-1)", "Katalitik dimerlar"],
    alternatives: ["SQUID χT(T)", "SCXRD Cu-Cu", "IR νCO"],
    tags: ["Cu²⁺", "d⁹", "dimer", "exchange", "antiferromagnit"],
  },

  // ───────────────────────────────────────────────────────────
  // V(IV) OKSOVANADIYL (d¹, 8-chiziqli hiperfin)
  // ───────────────────────────────────────────────────────────
  {
    id: "vo-acac2",
    slug: "vo-acac2",
    formulaHTML: "[VO(acac)<sub>2</sub>]",
    formulaPlain: "VO(acac)2",
    iupac: "Bis(2,4-pentandionato)oksovanadiy(IV)",
    commonName: "Vanadil atsetilatsetonat",
    family: "V(IV) oksovanadiyl β-diketonat",
    structure: "Kvadrat piramidal, V=O aksial 1.57 Å",
    metal: "V⁴⁺ (VO²⁺)",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan xloroform/toluol (77 K)",
    gValues: "g<sub>∥</sub> = 1.943; g<sub>⊥</sub> = 1.984",
    gType: "Aksial (g<sub>∥</sub> < g<sub>⊥</sub> < g<sub>e</sub>)",
    hyperfine: "⁵¹V (I=7/2): A<sub>∥</sub> ≈ 170 G, A<sub>⊥</sub> ≈ 60 G — 8 chiziq",
    nuclear: "⁵¹V (99.75%, I=7/2)",
    zfs: "Yo'q (S=1/2)",
    signature: "8 chiziqli ⁵¹V hiperfin — V(IV) uchun universal imzo",
    diagnostic: "VO²⁺ markaz, ekvatorial ligand tabiati (O/N donorlar)",
    caution: "Havoda VO²⁺ → V(V) oksidlanadi va EPR-jim bo'ladi",
    simCenterG: 1.97, simA: 100, simI: 3.5, simN: 1, simLinewidth: 12, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Nima uchun g < 2?", text: "d¹ toq elektron d<sub>xy</sub> orbitalida; spin-orbital aralashuv g qiymatini erkin elektron (2.0023) qiymatidan pastroqqa tushiradi." },
      { title: "8-chiziqli pattern", text: "⁵¹V I=7/2 va deyarli 100% tabiiy → 2I+1=8 chiziq; aksial simmetriya A<sub>∥</sub>/A<sub>⊥</sub> ajraladi." },
    ],
    applications: ["V(IV) redoks kimyosi", "Insulin-taqlid dorilar", "Katalitik oksidlanish", "Spin-qubit prototipi"],
    alternatives: ["⁵¹V NMR", "UV-Vis (770 nm)", "SQUID"],
    tags: ["V⁴⁺", "VO²⁺", "d¹", "S=1/2", "8-chiziq", "aksial"],
  },
  {
    id: "vo-so4",
    slug: "vo-so4",
    formulaHTML: "VOSO<sub>4</sub>·5H<sub>2</sub>O",
    formulaPlain: "VOSO4·5H2O",
    iupac: "Vanadil sulfat pentagidrat",
    commonName: "Vanadil sulfat",
    family: "V(IV) akvakompleks tuzi",
    structure: "Gidratlangan [VO(H<sub>2</sub>O)<sub>5</sub>]<sup>2+</sup>",
    metal: "V⁴⁺ (VO²⁺)",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Suvli eritma (kislotali) yoki qattiq kristall",
    gValues: "g<sub>iso</sub> = 1.964; qattiqda tensor ajraladi",
    gType: "Eritmada izotrop, muzlatilganda aksial",
    hyperfine: "⁵¹V: A<sub>iso</sub> ≈ 116 G — 8 chiziqli izotrop pattern",
    nuclear: "⁵¹V (99.75%, I=7/2)",
    zfs: "Yo'q (S=1/2)",
    signature: "Suvli eritmada ideal 8-lik izotrop VO²⁺ spektri",
    diagnostic: "VO²⁺ speciation, pH ta'siri, ligand almashinuvi",
    caution: "Suv dielektrik yo'qotish; pH > 6 gidroksid cho'kmasi",
    simCenterG: 1.964, simA: 116, simI: 3.5, simN: 1, simLinewidth: 10, simS: 0.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "Izotrop 8-lik", text: "Xona haroratida VO(H₂O)₅²⁺ tez aylanadi va tensor to'liq o'rtachalanadi." },
      { title: "Speciation diagnostikasi", text: "Ligand qo'shilganda A<sub>iso</sub> kamayadi (kovalentlik ortadi) — bu speciation asosidir." },
    ],
    applications: ["V(IV) speciation", "Vanadiy diabet dorilari", "Katalitik oksidlanish", "Redoks batareyalar (VRB)"],
    alternatives: ["UV-Vis (760 nm)", "⁵¹V NMR", "Elektrokimyo (CV)"],
    tags: ["V⁴⁺", "VO²⁺", "d¹", "S=1/2", "8-chiziq", "suvli"],
  },

  // ───────────────────────────────────────────────────────────
  // Mn KOMPLEKSLARI (klassik 6-chiziqli va integer-spin)
  // ───────────────────────────────────────────────────────────
  {
    id: "mn-h2o6",
    slug: "mn-h2o6",
    formulaHTML: "[Mn(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
    formulaPlain: "[Mn(H2O)6]2+",
    iupac: "Geksaakvamangan(II) ioni",
    commonName: "Gidratlangan Mn²⁺",
    family: "Mn(II) akvakompleks",
    structure: "Muntazam oktaedrik O<sub>h</sub>",
    metal: "Mn²⁺",
    dConfig: "d⁵ HS (t<sub>2g</sub>³e<sub>g</sub>²)",
    spin: "S = 5/2",
    unpaired: 5,
    status: "Faol",
    sample: "Suyultirilgan suvli eritma (1-10 mM)",
    gValues: "g<sub>iso</sub> = 2.000 (deyarli erkin elektron)",
    gType: "Izotrop (⁶A<sub>1g</sub> ground state)",
    hyperfine: "⁵⁵Mn (I=5/2): A<sub>iso</sub> ≈ 96 G — 6 chiziq 1:1:1:1:1:1",
    nuclear: "⁵⁵Mn (100%, I=5/2)",
    zfs: "Ideal Oh da D ≈ 0",
    signature: "g ≈ 2.00 markazida 6 ta teng oraliqli va intensivlikli chiziq",
    diagnostic: "Mn²⁺ tez identifikatsiyasi, komplekslanish (chiziq kengayishi)",
    caution: "Konsentratsiya > 50 mM da exchange narrowing chiziqlarni yo'qotadi",
    simCenterG: 2.000, simA: 96, simI: 2.5, simN: 1, simLinewidth: 25, simS: 2.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "Nima uchun g ≈ 2?", text: "⁶A₁g asosiy holat orbital angular momentga ega emas (L=0); spin-orbital coupling g ga ta'sir qilmaydi." },
      { title: "Forbidden o'tishlar", text: "Har bir asosiy chiziq atrofida ikkinchi tartib effektlar sabab zaif 'ΔmI = ±1' o'tishlar ko'rinadi." },
    ],
    applications: ["MRI kontrast dizayni", "Mn-oqsillar o'rganish", "Analitik miqdorli tahlil"],
    alternatives: ["AAS", "ICP-MS", "UV-Vis (zaif spin-taqiq)"],
    tags: ["Mn²⁺", "d⁵ HS", "S=5/2", "6-chiziq", "akvakompleks"],
  },
  {
    id: "mn-acac3",
    slug: "mn-acac3",
    formulaHTML: "[Mn(acac)<sub>3</sub>]",
    formulaPlain: "Mn(acac)3",
    iupac: "Tris(2,4-pentandionato)mangan(III)",
    commonName: "Mangan(III) atsetilatsetonat",
    family: "Mn(III) β-diketonat",
    structure: "Yahn-Teller cho'zilgan oktaedr",
    metal: "Mn³⁺",
    dConfig: "d⁴ HS",
    spin: "S = 2",
    unpaired: 4,
    status: "Faol",
    sample: "Muzlatilgan organik eritma (< 30 K), monokristall afzal",
    gValues: "g<sub>eff</sub> kuchli anizotrop (2-8 oralig'ida)",
    gType: "Katta anizotropiya, integer-spin",
    hyperfine: "⁵⁵Mn coupling keng signal ichida",
    nuclear: "⁵⁵Mn (100%, I=5/2)",
    zfs: "Katta: D ≈ −4.5 cm⁻¹, E/D ≈ 0.15",
    signature: "X-band da keng, 'silent'-ga yaqin; HFEPR ochib beradi",
    diagnostic: "Yahn-Teller buzilishi, ZFS parametrlari, integer-spin dinamikasi",
    caution: "X-band perpendikular-mode yetarli emas; parallel-mode/HFEPR kerak",
    simCenterG: 2.0, simA: 0, simI: 0, simN: 1, simLinewidth: 80, simS: 2,
    freqGHz: 9.5, tempK: 10,
    theory: [
      { title: "Integer-spin cheklovi", text: "S=2 da 2D ≈ 9 cm⁻¹ X-band energiyasidan (0.3 cm⁻¹) katta; ΔmS=±1 o'tishlar 'silent'." },
      { title: "Parallel-mode", text: "B₁ ∥ B₀ konfiguratsiya ΔmS=0 (yoki integer) o'tishlarni ochib beradi." },
    ],
    applications: ["SMM dizayni", "Jacobsen-turi katalizator", "PSII markazi modeli", "HFEPR standarti"],
    alternatives: ["SQUID magnetometriya", "HFEPR (200-400 GHz)", "Magnit susceptibility"],
    tags: ["Mn³⁺", "d⁴ HS", "S=2", "ZFS", "Yahn-Teller", "integer-spin"],
  },
  {
    id: "mn-porphyrin",
    slug: "mn-porphyrin",
    formulaHTML: "Mn(TPP)Cl",
    formulaPlain: "Mn(TPP)Cl",
    iupac: "(Tetrafenilporfirinato)xloromangan(III)",
    commonName: "Mangan(III) porfirin",
    family: "Mn(III) porfirin kompleksi",
    structure: "Kvadrat piramidal MnN<sub>4</sub>Cl",
    metal: "Mn³⁺",
    dConfig: "d⁴ HS",
    spin: "S = 2",
    unpaired: 4,
    status: "Faol",
    sample: "Past haroratdagi (< 10 K) muzlatilgan/monokristall",
    gValues: "g<sub>eff</sub> ≈ 8, 4, 2 (D ga bog'liq)",
    gType: "Katta anizotropiya bilan integer-spin",
    hyperfine: "⁵⁵Mn keng signalda ko'rinishi qiyin",
    nuclear: "⁵⁵Mn (100%, I=5/2)",
    zfs: "Juda katta: D ≈ −2.3 cm⁻¹, E/D ≈ 0.02",
    signature: "HFEPR (>200 GHz) da ko'p sathli spektr",
    diagnostic: "Mn(III) porfirin reaktivligi, Mn=O intermediatlar, PSII modeli",
    caution: "Standart X-band EPR yetarli emas",
    simCenterG: 4.0, simA: 0, simI: 0, simN: 1, simLinewidth: 100, simS: 2,
    freqGHz: 9.5, tempK: 5,
    theory: [
      { title: "Integer-spin cheklovi", text: "S=2 da ZFS mikroto'lqin energiyasidan katta — faqat ΔmS=0 o'tishlar HFEPR da ochiladi." },
      { title: "Katalitik ahamiyati", text: "Mn(TPP)Cl kabi porfirinlar suv oksidlash va O-atom transfer katalizatorlari — EPR Mn(IV)=O va Mn(V)=O intermediatlarini kuzatadi." },
    ],
    applications: ["Sun'iy fotosintez", "O₂ ishlab chiqarish", "SOD-mimetik dorilar", "Metalloferment modeli"],
    alternatives: ["Magnit susceptibility", "HFEPR", "SCXRD"],
    tags: ["Mn³⁺", "d⁴ HS", "S=2", "porfirin", "integer-spin", "ZFS"],
  },
  {
    id: "mn12-ac",
    slug: "mn12-ac",
    formulaHTML: "[Mn<sub>12</sub>O<sub>12</sub>(OAc)<sub>16</sub>(H<sub>2</sub>O)<sub>4</sub>]",
    formulaPlain: "Mn12-acetate",
    iupac: "Dodekanuklear mangan-oksoatsetat klasteri",
    commonName: "Mn₁₂-ac — birinchi SMM",
    family: "Single-molecule magnet",
    structure: "Mn<sub>12</sub>O<sub>12</sub>: 4 × Mn⁴⁺ + 8 × Mn³⁺",
    metal: "8 × Mn³⁺ + 4 × Mn⁴⁺",
    dConfig: "Aralash d³/d⁴ HS",
    spin: "S = 10 (ground state)",
    unpaired: 20,
    status: "Faol",
    sample: "Monokristall, past harorat (< 5 K)",
    gValues: "g ≈ 1.94; kuchli aksial",
    gType: "Aksial (D < 0)",
    hyperfine: "12 × ⁵⁵Mn — klasterda murakkab",
    nuclear: "⁵⁵Mn (100%)",
    zfs: "Juda katta: D = −0.46 cm⁻¹; U<sub>eff</sub> ≈ 60 K",
    signature: "SMM klassik ko'p sathli ZFS spektri, hysteresis",
    diagnostic: "Molekulyar magnitlar, kvant tunel (QTM), U<sub>eff</sub>",
    caution: "Kimyoviy nozik; kristall solvat parametrlarni o'zgartiradi",
    simCenterG: 1.94, simA: 0, simI: 0, simN: 1, simLinewidth: 200, simS: 3.5,
    freqGHz: 35, tempK: 2,
    theory: [
      { title: "S=10 kelib chiqishi", text: "8·2 − 4·(3/2) = 10 — antiferromagnit ichki-molekulyar coupling ferrimagnit ground state beradi." },
      { title: "Kvant tunel (QTM)", text: "m<sub>S</sub>=+10 va −10 orasidagi kvant tuneli SMM lar uchun xarakterli — 1993 y. kashf etilgan." },
    ],
    applications: ["Molekulyar magnit dizayni", "Kvant bit prototipi", "Yuqori zichlikli ma'lumot saqlash", "Spintronika"],
    alternatives: ["SQUID M-H gisterezis", "INS", "HFEPR (>200 GHz)"],
    tags: ["SMM", "Mn₁₂", "S=10", "ZFS", "klaster"],
  },

  // ───────────────────────────────────────────────────────────
  // Cr KOMPLEKSLARI (d³, klassik oktaedrik)
  // ───────────────────────────────────────────────────────────
  {
    id: "cr-h2o6",
    slug: "cr-h2o6",
    formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Cr(H2O)6]3+",
    iupac: "Geksaakvaxrom(III) ioni",
    commonName: "Gidratlangan Cr³⁺",
    family: "Cr(III) akvakompleks",
    structure: "Muntazam oktaedrik",
    metal: "Cr³⁺",
    dConfig: "d³ (t<sub>2g</sub>³)",
    spin: "S = 3/2",
    unpaired: 3,
    status: "Faol",
    sample: "Suyultirilgan suvli eritma (pH < 4) yoki alum kristall",
    gValues: "g<sub>iso</sub> = 1.977",
    gType: "Deyarli izotrop (⁴A<sub>2g</sub>)",
    hyperfine: "⁵³Cr (I=3/2, 9.5%): A ≈ 17 G — zaif satellitlar",
    nuclear: "⁵³Cr (9.5%)",
    zfs: "Ideal Oh da D ≈ 0; buzilishda 0.1-0.5 cm⁻¹",
    signature: "g ≈ 1.98 markazida asosiy signal, zaif ⁵³Cr satellitlar",
    diagnostic: "Cr(III) oksidlanish darajasi, Oh simmetriya buzilishi",
    caution: "Cr(VI) → Cr(III) qaytarilish jarayonlarida hosil bo'lishi mumkin",
    simCenterG: 1.977, simA: 17, simI: 1.5, simN: 1, simLinewidth: 20, simS: 1.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "d³ konfiguratsiya", text: "t<sub>2g</sub>³ da barcha spinlar parallel, orbital moment nol." },
      { title: "g ≈ 1.98", text: "Cr(III) uchun λ ≈ +90 cm⁻¹ (musbat); g = g<sub>e</sub> − nλ/Δ sabab 2 dan pastroq." },
    ],
    applications: ["Ruby lazerlar (Cr³⁺:Al₂O₃)", "Chrome-alum kristallari", "Kataliz", "Cr(VI) qaytarilish monitoring"],
    alternatives: ["UV-Vis (575, 408 nm)", "SQUID", "SCXRD"],
    tags: ["Cr³⁺", "d³", "S=3/2", "Oh", "akvakompleks"],
  },
  {
    id: "cr-acac3",
    slug: "cr-acac3",
    formulaHTML: "[Cr(acac)<sub>3</sub>]",
    formulaPlain: "Cr(acac)3",
    iupac: "Tris(2,4-pentandionato)xrom(III)",
    commonName: "Xrom(III) atsetilatsetonat",
    family: "Cr(III) β-diketonat",
    structure: "Oktaedrik CrO<sub>6</sub>, D<sub>3</sub>",
    metal: "Cr³⁺",
    dConfig: "d³",
    spin: "S = 3/2",
    unpaired: 3,
    status: "Faol",
    sample: "Muzlatilgan toluol/benzol eritmasi yoki qattiq",
    gValues: "g<sub>iso</sub> ≈ 1.98; g<sub>∥</sub> ≈ 1.99, g<sub>⊥</sub> ≈ 1.98",
    gType: "Zaif-o'rtacha anizotropiya",
    hyperfine: "⁵³Cr zaif satellitlar",
    nuclear: "⁵³Cr (9.5%)",
    zfs: "D ≈ 0.6 cm⁻¹ (D<sub>3</sub> simmetriya)",
    signature: "Fine structure — 4 ta asosiy o'tish muzlatilgan namunada",
    diagnostic: "Trigonal buzilish, D parametri, organik solvat Cr komplekslari",
    caution: "Sublimatsiyalanuvchi — issiqlikda ehtiyot",
    simCenterG: 1.98, simA: 17, simI: 1.5, simN: 1, simLinewidth: 30, simS: 1.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Trigonal ZFS", text: "D₃ simmetriya Cr(III) sathlarini ±3/2 va ±1/2 juftlariga ajratadi (D ≈ 0.6 cm⁻¹)." },
      { title: "Fine structure", text: "Muzlatilgan namunada 4 asosiy o'tish: ikki ±1/2 ↔ ±3/2 (parallel/perp) va oraliq o'tishlar." },
    ],
    applications: ["Kimyoviy sintez katalizatori", "MOCVD prekursori", "Polimer antioksidant"],
    alternatives: ["UV-Vis (380, 560 nm)", "SCXRD", "TGA"],
    tags: ["Cr³⁺", "d³", "S=3/2", "β-diketonat", "ZFS"],
  },

  // ───────────────────────────────────────────────────────────
  // Fe KOMPLEKSLARI (LS d⁵ va HS d⁵)
  // ───────────────────────────────────────────────────────────
  {
    id: "fe-cn6-3",
    slug: "fe-cn6-3",
    formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
    formulaPlain: "K3[Fe(CN)6]",
    iupac: "Kaliy geksasianoferrat(III)",
    commonName: "Ferrisianid — qizil qon tuzi",
    family: "Fe(III) past-spin sianokompleks",
    structure: "Oktaedrik, kuchli maydonli CN⁻",
    metal: "Fe³⁺",
    dConfig: "d⁵ LS (t<sub>2g</sub>⁵)",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan suvli eritma (77 K); Q-band foydali",
    gValues: "g<sub>1</sub> = 2.35, g<sub>2</sub> = 2.10, g<sub>3</sub> = 0.91",
    gType: "Kuchli rombik anizotropiya",
    hyperfine: "⁵⁷Fe zaif (2.1%); ENDOR bilan ¹³C, ¹⁴N",
    nuclear: "⁵⁷Fe (2.1%), ¹⁴N, ¹³C",
    zfs: "Yo'q (S=1/2)",
    signature: "Muzlatilgan uchta anizotrop komponent — 'inverted' spektr",
    diagnostic: "Past-spin Fe(III), ligand maydon parametrlari, redoks intermediatlar",
    caution: "Yorug'lik ta'sirida qisman fotoreduktsiya",
    simCenterG: 2.10, simA: 0, simI: 0, simN: 1, simLinewidth: 30, simS: 0.5,
    freqGHz: 9.5, tempK: 20,
    theory: [
      { title: "Past-spin d⁵ va SOC", text: "t<sub>2g</sub>⁵ bir teshikka ega; teshikning orbital taqsimoti kuchli anizotrop g-tensor beradi." },
      { title: "Griffith-Bleaney modeli", text: "g<sub>i</sub> = 2(k<sub>i</sub> + l<sub>i</sub>); k,l ligand maydon parametrlariga bog'liq." },
    ],
    applications: ["Sitokrom modeli", "Elektrokimyo va biosensorlar", "Prussian blue sintezi", "Fe²⁺ analitik reagent"],
    alternatives: ["Mössbauer", "SQUID", "UV-Vis (LMCT)"],
    tags: ["Fe³⁺", "d⁵ LS", "S=1/2", "CN⁻", "rombik"],
  },
  {
    id: "fe-acac3",
    slug: "fe-acac3",
    formulaHTML: "[Fe(acac)<sub>3</sub>]",
    formulaPlain: "Fe(acac)3",
    iupac: "Tris(2,4-pentandionato)temir(III)",
    commonName: "Temir(III) atsetilatsetonat",
    family: "Fe(III) HS β-diketonat",
    structure: "Buzilgan oktaedrik FeO<sub>6</sub>, D<sub>3</sub>",
    metal: "Fe³⁺",
    dConfig: "d⁵ HS",
    spin: "S = 5/2",
    unpaired: 5,
    status: "Faol",
    sample: "Past haroratdagi (< 20 K) muzlatilgan/qattiq",
    gValues: "g<sub>eff</sub> ≈ 4.3 va ≈ 2.0 (rhombic HS)",
    gType: "Katta ZFS bilan anizotrop",
    hyperfine: "⁵⁷Fe zaif (2.1%)",
    nuclear: "⁵⁷Fe (I=1/2, 2.1%)",
    zfs: "Katta: |D| ≈ 0.4-0.6 cm⁻¹, E/D ~ 0.1-0.3",
    signature: "'g=4.3' — rhombic HS Fe(III) uchun universal diagnostik",
    diagnostic: "HS Fe(III), ZFS, ferritin va bio-Fe modellar",
    caution: "Signal T ga sezgir (Curie qonuni)",
    simCenterG: 4.3, simA: 0, simI: 0, simN: 1, simLinewidth: 40, simS: 2.5,
    freqGHz: 9.5, tempK: 15,
    theory: [
      { title: "'g=4.3' sirri", text: "Kuchli rhombic ZFS (E/D → 1/3) limitida ±1/2 Kramers dubleti g<sub>eff</sub> = 30/7 ≈ 4.29 beradi." },
      { title: "Kramers dubletlar", text: "S=5/2 uch dubletga ajraladi (±5/2, ±3/2, ±1/2); X-band da odatda faqat ±1/2 ko'rinadi." },
    ],
    applications: ["Ferritin, transferrin modeli", "Katalitik oksidlanish", "Fe-oxide nanozarralar", "Fe elementi sintezi"],
    alternatives: ["Mössbauer", "SQUID (Curie-Weiss)", "XRD"],
    tags: ["Fe³⁺", "d⁵ HS", "S=5/2", "ZFS", "g=4.3"],
  },
  {
    id: "fe-porphyrin",
    slug: "fe-porphyrin",
    formulaHTML: "Fe(TPP)Cl",
    formulaPlain: "Fe(TPP)Cl",
    iupac: "(Tetrafenilporfirinato)xlorotemir(III)",
    commonName: "Temir(III) porfirin — gem modeli",
    family: "Fe(III) porfirin (gem)",
    structure: "Kvadrat piramidal FeN<sub>4</sub>Cl",
    metal: "Fe³⁺",
    dConfig: "d⁵ HS",
    spin: "S = 5/2",
    unpaired: 5,
    status: "Faol",
    sample: "Muzlatilgan organik eritma (4-77 K)",
    gValues: "g<sub>⊥</sub> = 6.0; g<sub>∥</sub> = 2.0",
    gType: "Aksial anizotropiya (gem imzosi)",
    hyperfine: "⁵⁷Fe boyitilganda 20-25 G",
    nuclear: "⁵⁷Fe (2.1%), 4 × ¹⁴N",
    zfs: "Katta: D ≈ +6.9 cm⁻¹",
    signature: "'g=6/g=2' — gem oqsillar uchun universal diagnostik",
    diagnostic: "Gem-oqsillar (Hb, Mb, sitokrom P450, katalaza)",
    caution: "Aksial ligand HS ↔ LS spin o'zgarishini keltirib chiqarishi mumkin",
    simCenterG: 6.0, simA: 0, simI: 0, simN: 1, simLinewidth: 45, simS: 2.5,
    freqGHz: 9.5, tempK: 4,
    theory: [
      { title: "'g=6/g=2' kelib chiqishi", text: "Aksial ZFS (E/D ≈ 0) limitida ±1/2 dubleti effektiv g<sub>⊥</sub> = 6, g<sub>∥</sub> = 2 beradi." },
      { title: "HS ↔ LS o'tish", text: "Aksial ligand kuchi Cl⁻ (HS, g=6) → CN⁻ (LS, uch rombik g) o'tishlarni belgilaydi." },
    ],
    applications: ["Gemoglobin/mioglobin model", "Sitokrom P450 tadqiqoti", "Sun'iy oksigenaza", "Bioanorganik model"],
    alternatives: ["Mössbauer ⁵⁷Fe", "MCD", "Rezonans Raman"],
    tags: ["Fe³⁺", "d⁵ HS", "S=5/2", "porfirin", "gem", "g=6"],
  },
  {
    id: "fe-dnic",
    slug: "fe-dnic",
    formulaHTML: "[Fe(SR)<sub>2</sub>(NO)<sub>2</sub>]<sup>−</sup>",
    formulaPlain: "DNIC thiolate",
    iupac: "Dinitrozil-temir tiolat kompleksi (DNIC)",
    commonName: "DNIC — dinitrosyl iron complex",
    family: "Fe-NO bioanorganik markaz",
    structure: "Buzilgan tetraedrik {Fe(NO)<sub>2</sub>}<sup>9</sup>",
    metal: "Fe (formal EF {Fe(NO)₂}⁹)",
    dConfig: "Delokalizatsiyalangan Fe-NO",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Anaerob eritma (Ar/N₂), muzlatilgan (77 K)",
    gValues: "g<sub>iso</sub> = 2.030",
    gType: "Deyarli izotrop",
    hyperfine: "¹⁴N(NO): 3-5 chiziqli fine",
    nuclear: "¹⁴N (2 × NO), ⁵⁷Fe",
    zfs: "Effektiv S=1/2 sabab yo'q",
    signature: "'g=2.03' biologik NO signalizatsiyasining diagnostik markeri",
    diagnostic: "NO ishlab chiqarish, iNOS/eNOS, kanser va sitokim",
    caution: "Juda dinamik — vaqtga bog'liq kuzatuv talab qilinadi",
    simCenterG: 2.030, simA: 4, simI: 1, simN: 2, simLinewidth: 4, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Enemark-Feltham formalism", text: "{Fe(NO)₂}⁹ da elektronlar Fe va NO orasida delokalizatsiyalangan — formal Fe oksidlanish darajasini qat'iy belgilash qiyin." },
      { title: "'g=2.03' universalligi", text: "Turli tiolat ligandlar bilan hosil bo'lgan DNIC lar o'xshash 'g=2.03' signal beradi — universal biomarker." },
    ],
    applications: ["NO biosensor", "Kanser terapiya (NO-donor)", "Radikallar biologiyasi", "Vazoregulatsiya"],
    alternatives: ["IR (νNO ≈ 1730, 1780 cm⁻¹)", "Mössbauer", "Griess assay"],
    tags: ["Fe-NO", "S=1/2", "g=2.03", "bioanorganik", "DNIC"],
  },

  // ───────────────────────────────────────────────────────────
  // Co(II) KOMPLEKSLARI (past-spin va tetraedrik)
  // ───────────────────────────────────────────────────────────
  {
    id: "co-cl4",
    slug: "co-cl4",
    formulaHTML: "[CoCl<sub>4</sub>]<sup>2−</sup>",
    formulaPlain: "[CoCl4]2-",
    iupac: "Tetraxlorokobaltat(II) ioni",
    commonName: "Tetraxlorokobaltat(II)",
    family: "Co(II) tetraedrik galogenokompleks",
    structure: "Tetraedrik T<sub>d</sub>",
    metal: "Co²⁺",
    dConfig: "d⁷ HS",
    spin: "S = 3/2",
    unpaired: 3,
    status: "Faol",
    sample: "Past haroratdagi (< 20 K) muzlatilgan/qattiq",
    gValues: "g<sub>∥</sub> ≈ 2.2, g<sub>⊥</sub> ≈ 4.5",
    gType: "Kuchli orbital hissa, katta anizotropiya",
    hyperfine: "⁵⁹Co (I=7/2) A katta, tez relaksatsiya sabab yashiringan",
    nuclear: "⁵⁹Co (100%, I=7/2)",
    zfs: "Katta: |D| ≈ 5-15 cm⁻¹",
    signature: "Effektiv S=1/2 kabi tahlil qilinadigan anizotrop signal",
    diagnostic: "Tetraedrik Co(II), koordinatsion muhit, Co-oqsil modellar",
    caution: "Faqat T < 20 K da yaxshi signal, xona haroratida deyarli silent",
    simCenterG: 4.5, simA: 30, simI: 0, simN: 1, simLinewidth: 60, simS: 1.5,
    freqGHz: 9.5, tempK: 10,
    theory: [
      { title: "Kramers dublet", text: "S=3/2 katta ZFS bilan ikki dubletga (±3/2, ±1/2) ajraladi; past T da faqat pastki dublet populyatsiyalanadi." },
      { title: "Tez relaksatsiya", text: "Orbital angular moment sabab T₁ < 10⁻⁸ s — chiziqlar keng, past T zarur." },
    ],
    applications: ["Co-oqsil modeli", "Termochromic indikatorlar", "Katalitik model", "O'quv"],
    alternatives: ["UV-Vis (692 nm)", "Magnit susceptibility", "SCXRD"],
    tags: ["Co²⁺", "d⁷ HS", "S=3/2", "tetraedr", "ZFS"],
  },
  {
    id: "co-salen",
    slug: "co-salen",
    formulaHTML: "[Co(salen)]",
    formulaPlain: "Co(salen)",
    iupac: "N,N′-bis(salitsiliden)etilendiaminkobalt(II)",
    commonName: "Kobalt(II) salen",
    family: "Co(II) Shiff asosi",
    structure: "N<sub>2</sub>O<sub>2</sub> kvadrat tekis",
    metal: "Co²⁺",
    dConfig: "d⁷ LS",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan eritma (77 K), inert atmosfera",
    gValues: "g<sub>1</sub> ≈ 3.5; g<sub>2</sub> ≈ 2.2; g<sub>3</sub> ≈ 1.9",
    gType: "Kuchli rombik anizotropiya",
    hyperfine: "⁵⁹Co: A<sub>∥</sub> ≈ 90 G — 8 chiziq mumkin",
    nuclear: "⁵⁹Co (100%, I=7/2)",
    zfs: "Past-spin S=1/2 uchun yo'q",
    signature: "Sun'iy O₂-tashuvchi (Tsumaki 1938) — rombik LS Co(II)",
    diagnostic: "O₂ bog'lanish (Co(II) → Co(III)-O₂⁻), gemoglobin modeli",
    caution: "O₂ ga juda sezgir — anaerob shart",
    simCenterG: 2.2, simA: 45, simI: 3.5, simN: 1, simLinewidth: 25, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Past-spin Co(II)", text: "Kvadrat tekis Shiff asosi Co(II) ni t<sub>2g</sub>⁶e<sub>g</sub>¹ past-spin holatga majburlaydi — S=1/2 va rombik g." },
      { title: "O₂ bog'lanish", text: "Co(II) + O₂ → Co(III)-O₂⁻ (superoksid); EPR jarayonni to'g'ridan-to'g'ri kuzatadi." },
    ],
    applications: ["Sun'iy gemoglobin", "O₂ sensor", "Katalitik oksidlanish", "Farmatsevtika sintezi"],
    alternatives: ["UV-Vis", "IR (νO-O superoksid)", "Elektrokimyo"],
    tags: ["Co²⁺", "d⁷ LS", "S=1/2", "Shiff-asosi", "O₂-carrier"],
  },
  {
    id: "co-salen-axial",
    slug: "co-salen-axial",
    formulaHTML: "[Co(salen)(py)]",
    formulaPlain: "Co(salen)(pyridine)",
    iupac: "Piridin-adduktli kobalt(II) salen",
    commonName: "Aksial bazali Co(II)-salen",
    family: "Co(II) Shiff asosi adducti",
    structure: "Kvadrat piramidal N<sub>5</sub>O<sub>2</sub>",
    metal: "Co²⁺",
    dConfig: "d⁷ LS",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan piridin eritmasi (77 K), inert",
    gValues: "g<sub>∥</sub> = 2.00; g<sub>⊥</sub> = 2.32",
    gType: "Aksial (piridin adduct)",
    hyperfine: "⁵⁹Co: A<sub>∥</sub> ≈ 90 G — 8 chiziq",
    nuclear: "⁵⁹Co (100%), aksial ¹⁴N",
    zfs: "Past-spin S=1/2 uchun yo'q",
    signature: "Aksial LS Co(II) — sitokrom modeli",
    diagnostic: "Aksial ligand donor kuchi, O₂ bog'lanish tayyorligi",
    caution: "Havoda O₂ bog'lab Co(III)-superoksidga aylanadi",
    simCenterG: 2.21, simA: 40, simI: 3.5, simN: 1, simLinewidth: 15, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Aksial ligand va spin", text: "Piridin kabi kuchli σ-donor Co(II) ni LS holatga majburlaydi." },
      { title: "Superoksid hosil bo'lishi", text: "O₂ bilan elektron uzatishda Co(III) (LS, S=0) va O₂⁻ (S=1/2) hosil bo'ladi." },
    ],
    applications: ["Sun'iy gemoglobin", "O₂ absorbent (Salcomine)", "Bio-mimetik oksidlanish"],
    alternatives: ["UV-Vis", "IR (νO-O)", "Elektrokimyo"],
    tags: ["Co²⁺", "d⁷ LS", "S=1/2", "adduct", "aksial", "8-chiziq"],
  },

  // ───────────────────────────────────────────────────────────
  // Ni, Ti, Mo, Ru, Gd (d¹, d⁸, 4d, 4f)
  // ───────────────────────────────────────────────────────────
  {
    id: "ni-cl4",
    slug: "ni-cl4",
    formulaHTML: "[NiCl<sub>4</sub>]<sup>2−</sup>",
    formulaPlain: "[NiCl4]2-",
    iupac: "Tetraxloronikkolat(II) ioni",
    commonName: "Tetraxloronikkelat(II)",
    family: "Ni(II) tetraedrik",
    structure: "Tetraedrik T<sub>d</sub>",
    metal: "Ni²⁺",
    dConfig: "d⁸ HS",
    spin: "S = 1",
    unpaired: 2,
    status: "Faol",
    sample: "Past haroratdagi (< 10 K) muzlatilgan/qattiq",
    gValues: "g<sub>eff</sub> 2.0-2.4 oralig'ida",
    gType: "ZFS bilan boshqariladigan integer-spin",
    hyperfine: "⁶¹Ni (I=3/2, 1.1%): zaif",
    nuclear: "⁶¹Ni (1.1%)",
    zfs: "Katta: |D| ≈ 3-10 cm⁻¹",
    signature: "HFEPR/parallel-mode ochib beradigan integer-spin signal",
    diagnostic: "Tetraedrik Ni(II), ZFS, kvadrat tekis vs tetraedr farqi",
    caution: "Standart X-band mos emas — HFEPR yoki parallel-mode kerak",
    simCenterG: 2.2, simA: 0, simI: 0, simN: 1, simLinewidth: 70, simS: 1,
    freqGHz: 9.5, tempK: 5,
    theory: [
      { title: "d⁸ integer-spin", text: "Tetraedrik geometriya buzilishi t<sub>2g</sub> degeneratsiyasini yo'q qiladi va S=1 HS holat hosil bo'ladi." },
      { title: "HFEPR zaruriyati", text: "|D| ~ 3-10 cm⁻¹ X-band energiyasidan katta — faqat HFEPR (>200 GHz) yoki parallel-mode ochib beradi." },
    ],
    applications: ["Ni-oqsil modeli", "Geometriya o'rganish", "Ni-katalizatorlar", "Termochromic"],
    alternatives: ["UV-Vis (700 nm)", "Magnit susceptibility", "SCXRD"],
    tags: ["Ni²⁺", "d⁸", "S=1", "tetraedr", "ZFS", "integer-spin"],
  },
  {
    id: "ti-h2o6-3",
    slug: "ti-h2o6-3",
    formulaHTML: "[Ti(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Ti(H2O)6]3+",
    iupac: "Geksaakvatitan(III) ioni",
    commonName: "Titan(III) akvakompleksi",
    family: "Ti(III) d¹ akvakompleks",
    structure: "Oktaedrik, Yahn-Teller buzilgan",
    metal: "Ti³⁺",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Inert (Ar/N₂) suvli eritma yoki muzlatilgan",
    gValues: "g<sub>∥</sub> = 1.892; g<sub>⊥</sub> = 1.988",
    gType: "Aksial (Yahn-Teller)",
    hyperfine: "⁴⁷/⁴⁹Ti past miqdorda; ko'rinmaydi",
    nuclear: "⁴⁷Ti (7.4%), ⁴⁹Ti (5.4%)",
    zfs: "Yo'q (S=1/2)",
    signature: "Yahn-Teller cho'zilgan d¹ imzosi (g<sub>∥</sub> < g<sub>⊥</sub> < 2)",
    diagnostic: "Ti(IV) → Ti(III) qaytarilish, TiO₂ elektron tuzoq holatlar",
    caution: "O₂ ga juda sezgir; inert atmosfera zarur",
    simCenterG: 1.955, simA: 0, simI: 0, simN: 1, simLinewidth: 15, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "Yahn-Teller d¹", text: "t<sub>2g</sub>¹ degenerativ orbital cho'zilishga sabab bo'ladi va aksial anizotropiya beradi." },
      { title: "g < 2", text: "Ti(III) uchun λ ≈ +155 cm⁻¹ (musbat) — g qiymatlari 2 dan pastroq." },
    ],
    applications: ["Foto-kataliz (TiO₂-Ti³⁺)", "Redoks batareyalar", "Ti-organik sintez"],
    alternatives: ["UV-Vis (500 nm)", "Elektrokimyo", "XPS Ti 2p"],
    tags: ["Ti³⁺", "d¹", "S=1/2", "Yahn-Teller", "redoks"],
  },
  {
    id: "mo-cn8-3",
    slug: "mo-cn8-3",
    formulaHTML: "[Mo(CN)<sub>8</sub>]<sup>3−</sup>",
    formulaPlain: "[Mo(CN)8]3-",
    iupac: "Oktasiyanomolibdat(V) ioni",
    commonName: "Mo(V) sianokompleksi",
    family: "Mo(V) 4d¹ kompleks",
    structure: "8-koordinatsiyali (dodecahedral)",
    metal: "Mo⁵⁺",
    dConfig: "4d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan eritma (77 K)",
    gValues: "g<sub>∥</sub> = 2.006; g<sub>⊥</sub> = 1.978",
    gType: "Aksial",
    hyperfine: "⁹⁵/⁹⁷Mo (I=5/2, 25%): 6-lik satellitlar",
    nuclear: "⁹⁵Mo (15.9%), ⁹⁷Mo (9.6%)",
    zfs: "Yo'q (S=1/2)",
    signature: "4d¹ aksial spektr Mo izotop satellitlari bilan",
    diagnostic: "Mo(V) redoks, Mo-fermentlar (nitrat reduktaza, sulfit oksidaza)",
    caution: "Kislotali muhitda disproporsiya: 2Mo(V) → Mo(IV) + Mo(VI)",
    simCenterG: 1.988, simA: 55, simI: 2.5, simN: 1, simLinewidth: 18, simS: 0.5,
    freqGHz: 9.5, tempK: 77,
    theory: [
      { title: "4d vs 3d", text: "4d orbital kengroq va zaifroq ligand maydonida — g qiymati erkin elektronga yaqinroq." },
      { title: "Mo izotop satellitlari", text: "Faqat ⁹⁵Mo (16%) va ⁹⁷Mo (10%) I=5/2 spinga ega; boshqalari I=0 markaziy chiziqni beradi." },
    ],
    applications: ["Bio-Mo fermentlar", "Foto-kataliz", "Molekulyar magnetlar", "Mo redoks juftlari"],
    alternatives: ["¹H NMR", "UV-Vis", "Elektrokimyo"],
    tags: ["Mo⁵⁺", "4d¹", "S=1/2", "aksial", "sianokompleks"],
  },
  {
    id: "ru-bpy3-3",
    slug: "ru-bpy3-3",
    formulaHTML: "[Ru(bpy)<sub>3</sub>]<sup>3+</sup>",
    formulaPlain: "[Ru(bpy)3]3+",
    iupac: "Tris(2,2′-bipiridin)ruteniy(III) ioni",
    commonName: "Ru(bpy)₃³⁺",
    family: "Ru(III) polipiridil",
    structure: "Oktaedrik RuN<sub>6</sub>, D<sub>3</sub>",
    metal: "Ru³⁺",
    dConfig: "4d⁵ LS (t<sub>2g</sub>⁵)",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    sample: "Muzlatilgan asetonitril (77 K), inert",
    gValues: "g<sub>1</sub> = 2.63; g<sub>2</sub> = 2.42; g<sub>3</sub> = 1.14",
    gType: "Kuchli rombik anizotropiya (LS 4d⁵)",
    hyperfine: "⁹⁹Ru (12.8%), ¹⁰¹Ru (17.1%): zaif",
    nuclear: "⁹⁹Ru, ¹⁰¹Ru (I=5/2)",
    zfs: "Yo'q (S=1/2)",
    signature: "Fotoredoks kataliz oraliq holati — LS 4d⁵ rombik pattern",
    diagnostic: "Ru(II)/Ru(III) foto-redoks, sun'iy fotosintez",
    caution: "Suvli muhitda barqaror emas — asetonitril kerak",
    simCenterG: 2.42, simA: 0, simI: 0, simN: 1, simLinewidth: 25, simS: 0.5,
    freqGHz: 9.5, tempK: 20,
    theory: [
      { title: "MLCT va photoredox", text: "Ru(bpy)₃²⁺ MLCT qo'zg'algan holatida elektron yo'qotib Ru(bpy)₃³⁺ (EPR-faol) hosil qiladi." },
      { title: "4d SOC", text: "Ru(III) SOC (λ ≈ +1180 cm⁻¹) Fe(III) LS dan katta — g anizotropiya kuchliroq." },
    ],
    applications: ["Foto-kataliz (organik sintez)", "Sun'iy fotosintez", "Elektrokimyo", "DNA-sensorlar"],
    alternatives: ["UV-Vis MLCT (450 nm)", "Emissiya", "CV"],
    tags: ["Ru³⁺", "4d⁵ LS", "S=1/2", "polipiridil", "fotoredoks"],
  },
  {
    id: "gd-dota",
    slug: "gd-dota",
    formulaHTML: "[Gd(DOTA)]<sup>−</sup>",
    formulaPlain: "[Gd(DOTA)]-",
    iupac: "Gadoliniy(III) tetraazatsiklododekantetraatsetat",
    commonName: "Gd-DOTA (MRI kontrast agent)",
    family: "Ln(III) makrotsikl xelati",
    structure: "9-koordinatsiyali (DOTA + 1 × H<sub>2</sub>O)",
    metal: "Gd³⁺",
    dConfig: "4f⁷ (yarim to'lgan)",
    spin: "S = 7/2",
    unpaired: 7,
    status: "Faol",
    sample: "Suvli eritma (fizyologik pH) yoki muzlatilgan",
    gValues: "g<sub>iso</sub> ≈ 1.992 (⁸S<sub>7/2</sub>)",
    gType: "Deyarli izotrop, kichik ZFS",
    hyperfine: "¹⁵⁵Gd (14.8%), ¹⁵⁷Gd (15.7%): zaif",
    nuclear: "¹⁵⁵Gd, ¹⁵⁷Gd (I=3/2)",
    zfs: "Kichik: D ≈ 0.05-0.1 cm⁻¹",
    signature: "MRI kontrast agent — S=7/2 keng ko'p sathli signal",
    diagnostic: "MRI relaksivligi, koordinatsion suv soni q, ligand almashinuv",
    caution: "NSF xavfi (buyrak yetishmovchiligi bemorlarida)",
    simCenterG: 1.992, simA: 0, simI: 0, simN: 1, simLinewidth: 60, simS: 3.5,
    freqGHz: 9.5, tempK: 298,
    theory: [
      { title: "⁸S<sub>7/2</sub> ground state", text: "4f⁷ yarim to'lgan konfiguratsiyada L=0 — SOC ta'siri kam va g ≈ 2." },
      { title: "MRI relaksivlik", text: "Yuqori magnit moment (7 unpaired e⁻) va uzun T₁ₑ atrofdagi suv protonlariga T₁ ta'sirini beradi." },
    ],
    applications: ["MRI klinik kontrast", "Kanser tashxisi", "Bioanorganik model", "Neyroshifobil"],
    alternatives: ["¹H NMRD", "Lyuminessensiya (Eu³⁺)", "Klinik MRI"],
    tags: ["Gd³⁺", "4f⁷", "S=7/2", "MRI", "lantanoid", "makrotsikl"],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EPR SPEKTR SIMULYATSIYASI
// ═══════════════════════════════════════════════════════════════════════════════
function SimulatedSpectrum({ centerG, hyperfineA, nuclearSpin, equivalentN, linewidth, freqGHz }) {
  const spectrum = useMemo(() => {
    const h = 6.62607015e-34, muB = 9.2740100783e-24
    const centerB = (h * freqGHz * 1e9) / (centerG * muB) * 1e4

    const lines = Math.max(1, Math.round(2 * equivalentN * nuclearSpin + 1))
    const positions = Array.from({ length: lines }, (_, idx) => centerB + (idx - (lines - 1) / 2) * hyperfineA)

    const intensities = []
    if (nuclearSpin === 0.5) {
      let row = [1]
      for (let k = 1; k < lines; k++) row.push(Math.round(row[k - 1] * (lines - k) / k))
      intensities.push(...row)
    } else {
      for (let i = 0; i < lines; i++) intensities.push(1)
    }

    const rangeG = 500, points = 400
    const xs = [], absorb = []
    for (let i = 0; i < points; i++) {
      const x = centerB - rangeG / 2 + (i / (points - 1)) * rangeG
      let y = 0
      positions.forEach((pos, idx) => {
        const amp = intensities[idx] || 1
        y += amp * Math.exp(-0.5 * ((x - pos) / linewidth) ** 2)
      })
      xs.push(x); absorb.push(y)
    }
    const deriv = absorb.map((v, i) => {
      const next = absorb[i + 1] ?? v
      return (next - v) * 15
    })
    const maxAbs = Math.max(...absorb, 0.01)
    const maxDer = Math.max(...deriv.map(Math.abs), 0.01)
    return { xs, absorb, deriv, positions, maxAbs, maxDer, centerB, lines }
  }, [centerG, hyperfineA, nuclearSpin, equivalentN, linewidth, freqGHz])

  const { xs, absorb, deriv, positions, maxAbs, maxDer, centerB, lines } = spectrum
  const xToPixel = (x) => 40 + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * 460

  return (
    <svg viewBox="0 0 520 260" className="w-full h-72 rounded-xl bg-purple-950/50 border border-purple-700/30">
      <line x1="40" y1="215" x2="510" y2="215" stroke="#4c1d95" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="230" stroke="#4c1d95" strokeWidth="1" />
      <text x="275" y="248" textAnchor="middle" fill="#c4b5fd" fontSize="11">Magnit maydon B (Gauss)</text>
      <text x="20" y="125" textAnchor="middle" transform="rotate(-90 20 125)" fill="#c4b5fd" fontSize="11">Signal</text>
      <text x="275" y="14" textAnchor="middle" fill="#a3e635" fontSize="11" fontWeight="600">
        ν = {freqGHz} GHz • g ≈ {centerG.toFixed(3)} • B ≈ {centerB.toFixed(0)} G • {lines} chiziq
      </text>
      {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
        const x = 40 + frac * 460
        const val = xs[0] + frac * (xs[xs.length - 1] - xs[0])
        return (
          <g key={idx}>
            <line x1={x} y1="215" x2={x} y2="219" stroke="#6d28d9" strokeWidth="1" />
            <text x={x} y="230" textAnchor="middle" fill="#c4b5fd" fontSize="9">{val.toFixed(0)}</text>
          </g>
        )
      })}
      <polyline fill="none" stroke="#84cc16" strokeWidth="1.6" opacity="0.35"
        points={absorb.map((v, i) => `${xToPixel(xs[i])},${180 - (v / maxAbs) * 80}`).join(" ")} />
      <polyline fill="none" stroke="#a3e635" strokeWidth="2.2"
        points={deriv.map((v, i) => `${xToPixel(xs[i])},${115 - (v / maxDer) * 65}`).join(" ")} />
      {positions.map((pos, idx) => (
        <line key={idx} x1={xToPixel(pos)} y1="35" x2={xToPixel(pos)} y2="215"
          stroke="#fbbf24" strokeDasharray="3 4" strokeWidth="0.8" opacity="0.55" />
      ))}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZEEMAN SATHLARI DIAGRAMMASI
// ═══════════════════════════════════════════════════════════════════════════════
function ZeemanDiagram({ S, gVal }) {
  const levels = []
  for (let m = S; m >= -S; m -= 1) levels.push(m)
  const spread = 55

  return (
    <svg viewBox="0 0 340 220" className="w-full h-56 rounded-xl bg-purple-950/50 border border-purple-700/30">
      <text x="170" y="16" textAnchor="middle" fill="#a3e635" fontSize="11" fontWeight="600">
        Zeeman sathlari: S = {S === 0.5 ? "1/2" : S === 1.5 ? "3/2" : S === 2.5 ? "5/2" : S === 3.5 ? "7/2" : S}
      </text>
      <line x1="30" y1="110" x2="30" y2="200" stroke="#4c1d95" strokeWidth="1" />
      <line x1="30" y1="200" x2="320" y2="200" stroke="#4c1d95" strokeWidth="1" />
      <text x="175" y="215" textAnchor="middle" fill="#c4b5fd" fontSize="10">Magnit maydon B →</text>
      <line x1="70" y1="110" x2="70" y2="200" stroke="#6d28d9" strokeDasharray="3 3" strokeWidth="0.8" />
      <text x="70" y="220" textAnchor="middle" fill="#c4b5fd" fontSize="9">B = 0</text>
      <line x1="55" y1="150" x2="85" y2="150" stroke="#e9d5ff" strokeWidth="2.5" />
      {levels.map((m, idx) => {
        const endY = 150 - m * spread * (2 / (2 * S + 1))
        const color = m > 0 ? "#a3e635" : m < 0 ? "#60a5fa" : "#fbbf24"
        return (
          <g key={idx}>
            <line x1="85" y1="150" x2="300" y2={endY} stroke={color} strokeWidth="2" />
            <text x="305" y={endY + 4} fill={color} fontSize="10" fontWeight="600">m<tspan baselineShift="sub" fontSize="7">S</tspan> = {m > 0 ? `+${m}` : m}</text>
          </g>
        )
      })}
      <text x="70" y="105" textAnchor="middle" fill="#c4b5fd" fontSize="9">g ≈ {gVal.toFixed(3)}</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIRIKMA PASSPORTI (MODAL)
// ═══════════════════════════════════════════════════════════════════════════════
function CompoundPassport({ compound, onClose }) {
  const [freqGHz, setFreqGHz] = useState(compound.freqGHz || 9.5)
  const [tempK, setTempK] = useState(compound.tempK || 77)

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-purple-950 via-blue-950/40 to-blue-950 border border-lime-500/25 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-purple-950/85 border-b border-purple-800/50 px-6 py-4 rounded-t-3xl flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-xs uppercase tracking-[0.22em] text-lime-300">EPR pasporti</span>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-lime-300" dangerouslySetInnerHTML={{ __html: compound.formulaHTML }} />
                <span className="text-xs px-2 py-1 rounded bg-blue-500/15 border border-blue-500/25 text-blue-200 font-mono">{compound.dConfig}</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/15 border border-purple-500/25 text-purple-100">{compound.spin}</span>
              </div>
              <p className="text-purple-200 text-sm mt-1">{compound.iupac}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-purple-800 hover:bg-purple-700 text-white flex items-center justify-center text-xl transition-colors flex-shrink-0" aria-label="Yopish">✕</button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Kirish */}
            <div className="rounded-2xl border border-lime-500/25 bg-lime-500/5 p-5">
              <p className="text-purple-100 leading-relaxed">
                <span className="text-lime-300 font-semibold">{compound.commonName}</span> — {compound.family}. {compound.structure} strukturasi bilan.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {compound.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded bg-purple-900/50 text-purple-200 text-xs border border-purple-700/40">{tag}</span>
                ))}
              </div>
            </div>

            {/* Spektr va Zeeman */}
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
              <div className="rounded-2xl border border-purple-700/45 bg-purple-900/35 p-5 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-lg font-bold text-white">📡 Simulyatsiyalangan EPR spektri</h3>
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/15 border border-blue-500/25 text-blue-200">Birinchi hosila</span>
                </div>
                <SimulatedSpectrum centerG={compound.simCenterG} hyperfineA={compound.simA}
                  nuclearSpin={compound.simI} equivalentN={compound.simN}
                  linewidth={compound.simLinewidth} freqGHz={freqGHz} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex justify-between text-xs mb-2 text-purple-200">
                      <span>Chastota</span><span className="text-lime-300 font-mono">{freqGHz} GHz</span>
                    </label>
                    <input type="range" min="3" max="95" step="0.5" value={freqGHz}
                      onChange={(e) => setFreqGHz(parseFloat(e.target.value))} className="w-full accent-lime-500" />
                    <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                      <span>S</span><span>X (9.5)</span><span>Q (35)</span><span>W (95)</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs mb-2 text-purple-200">
                      <span>Harorat</span><span className="text-lime-300 font-mono">{tempK} K</span>
                    </label>
                    <input type="range" min="4" max="298" step="1" value={tempK}
                      onChange={(e) => setTempK(parseInt(e.target.value))} className="w-full accent-lime-500" />
                    <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                      <span>He (4)</span><span>N₂ (77)</span><span>RT</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/25 p-3 text-xs text-purple-100 leading-relaxed">
                  <span className="text-yellow-300 font-semibold">💡 Izoh:</span> spektr birinchi tartib yaqinlashuvda simulyatsiya qilingan; anizotropiya va ZFS to'liq hisobga olinmagan (haqiqiy tahlil uchun EasySpin/SimFonia).
                </div>
              </div>

              <div className="rounded-2xl border border-purple-700/45 bg-purple-900/35 p-5 space-y-4">
                <h3 className="text-lg font-bold text-white">⚡ Zeeman sathlari</h3>
                <ZeemanDiagram S={compound.simS} gVal={compound.simCenterG} />
                <div className="text-xs text-purple-200 leading-relaxed space-y-2">
                  <p><span className="text-lime-300 font-semibold">Rezonans:</span> hν = gμ<sub>B</sub>B; Δm<sub>S</sub> = ±1</p>
                  <p>S = {compound.simS === 0.5 ? "1/2" : compound.simS === 1.5 ? "3/2" : compound.simS === 2.5 ? "5/2" : compound.simS === 3.5 ? "7/2" : compound.simS} → <span className="text-lime-300 font-semibold">{Math.round(2 * compound.simS + 1)}</span> sath, <span className="text-lime-300 font-semibold">{Math.round(2 * compound.simS)}</span> o'tish</p>
                </div>
              </div>
            </div>

            {/* Parametrlar */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-purple-700/45 bg-purple-900/35 p-5">
                <h3 className="text-lg font-bold text-white mb-4">📋 EPR parametrlari</h3>
                <div className="space-y-0 text-sm">
                  {[
                    ["g-tensor", compound.gValues, "text-lime-200", true],
                    ["g-turi", compound.gType, "text-lime-200", false],
                    ["Hiperfin", compound.hyperfine, "text-yellow-200", true],
                    ["EPR yadro", compound.nuclear, "text-yellow-200", false],
                    ["ZFS", compound.zfs, "text-purple-200", false],
                    ["Toq elektronlar", `${compound.unpaired} ta`, "text-lime-200", false],
                  ].map(([label, value, tone, html]) => (
                    <div key={label} className="flex justify-between items-start gap-4 py-2.5 border-b border-purple-800/40 last:border-b-0">
                      <span className="text-xs uppercase tracking-wider text-purple-400 pt-0.5">{label}</span>
                      {html ? (
                        <span className={`text-sm text-right font-semibold ${tone}`} dangerouslySetInnerHTML={{ __html: value }} />
                      ) : (
                        <span className={`text-sm text-right font-semibold ${tone}`}>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-purple-700/45 bg-purple-900/35 p-5">
                <h3 className="text-lg font-bold text-white mb-4">🧪 Struktura va o'lchash</h3>
                <div className="space-y-0 text-sm">
                  {[
                    ["Metall markaz", compound.metal, "text-yellow-200"],
                    ["Konfiguratsiya", compound.dConfig, "text-blue-200"],
                    ["Spin", compound.spin, "text-purple-200"],
                    ["Geometriya", compound.structure, "text-lime-200"],
                    ["Oila", compound.family, "text-purple-200"],
                    ["Optimal namuna", compound.sample, "text-blue-200"],
                  ].map(([label, value, tone]) => (
                    <div key={label} className="flex justify-between items-start gap-4 py-2.5 border-b border-purple-800/40 last:border-b-0">
                      <span className="text-xs uppercase tracking-wider text-purple-400 pt-0.5">{label}</span>
                      <span className={`text-sm text-right font-semibold ${tone}`} dangerouslySetInnerHTML={{ __html: value }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostika */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-lime-500/25 bg-lime-500/10 p-5">
                <h4 className="text-lime-300 font-bold mb-3">🎯 Spektral imzo</h4>
                <p className="text-sm text-purple-100 leading-relaxed">{compound.signature}</p>
              </div>
              <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-5">
                <h4 className="text-blue-300 font-bold mb-3">🔬 EPR nima beradi?</h4>
                <p className="text-sm text-purple-100 leading-relaxed">{compound.diagnostic}</p>
              </div>
              <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5">
                <h4 className="text-rose-300 font-bold mb-3">⚠️ Ehtiyot nuqtasi</h4>
                <p className="text-sm text-purple-100 leading-relaxed">{compound.caution}</p>
              </div>
            </div>

            {/* Ilmiy talqin */}
            {compound.theory && (
              <div className="rounded-2xl border border-purple-700/45 bg-purple-900/35 p-5">
                <h3 className="text-lg font-bold text-white mb-4">📚 Ilmiy talqin</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {compound.theory.map((block, idx) => (
                    <div key={idx} className="rounded-xl bg-purple-950/50 border border-purple-700/40 p-4">
                      <h4 className="text-lime-300 font-bold mb-2">{block.title}</h4>
                      <p className="text-sm text-purple-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amaliy va muqobil */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-lime-500/20 bg-gradient-to-br from-lime-600/10 to-purple-900/40 p-5">
                <h3 className="text-lg font-bold text-white mb-3">🏭 Amaliy qo'llanish</h3>
                <ul className="space-y-2 text-sm text-purple-100 list-disc pl-5">
                  {compound.applications.map((app, idx) => <li key={idx}>{app}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-purple-900/35 p-5">
                <h3 className="text-lg font-bold text-white mb-3">🔄 Muqobil usullar</h3>
                <div className="flex flex-wrap gap-2">
                  {compound.alternatives.map((alt) => (
                    <span key={alt} className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/30 text-xs font-semibold">{alt}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function EPRBirikmalarPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState("all")
  const [filterTag, setFilterTag] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedCompound, setSelectedCompound] = useState(null)

  const allTags = useMemo(() => {
    const tags = new Set()
    birikmalar.forEach((b) => b.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const filteredBirikmalar = useMemo(() => {
    let result = birikmalar
    if (filterMode === "half") result = result.filter((b) => b.spin.includes("1/2"))
    else if (filterMode === "highspin") result = result.filter((b) => b.dConfig.includes("HS") || b.spin.includes("S = 2") || b.spin.includes("S = 5/2") || b.spin.includes("S = 7/2") || b.spin.includes("S = 10"))
    else if (filterMode === "zfs") result = result.filter((b) => b.zfs.includes("cm⁻¹") || b.zfs.includes("Katta") || b.zfs.includes("D "))
    else if (filterMode === "metal") result = result.filter((b) => b.metal !== "—")
    else if (filterMode === "radical") result = result.filter((b) => b.family.includes("radikal"))
    else if (filterMode === "cu") result = result.filter((b) => b.metal.includes("Cu"))
    else if (filterMode === "bio") result = result.filter((b) => b.tags.some((t) => t.includes("bioanorganik") || t.includes("SOD") || t.includes("gem") || t.includes("DNIC") || t.includes("MRI") || t.includes("spin-label")))

    if (filterTag !== "all") result = result.filter((b) => b.tags.includes(filterTag))

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((b) =>
        [b.formulaPlain, b.iupac, b.commonName, b.family, b.metal, b.dConfig, b.signature]
          .join(" ").toLowerCase().includes(q)
      )
    }
    return result
  }, [filterMode, filterTag, searchQuery])

  const stats = useMemo(() => ({
    total: birikmalar.length,
    half: birikmalar.filter((b) => b.spin.includes("1/2")).length,
    highspin: birikmalar.filter((b) => b.dConfig.includes("HS") || b.spin.includes("S = 2") || b.spin.includes("S = 5/2") || b.spin.includes("S = 7/2") || b.spin.includes("S = 10")).length,
    bio: birikmalar.filter((b) => b.tags.some((t) => t.includes("bioanorganik") || t.includes("SOD") || t.includes("gem") || t.includes("DNIC") || t.includes("MRI") || t.includes("spin-label"))).length,
  }), [])

  const resetFilters = () => { setSearchQuery(""); setFilterMode("all"); setFilterTag("all") }

  const filterOptions = [
    { key: "all", label: `Barchasi (${birikmalar.length})` },
    { key: "half", label: "🎯 S = 1/2" },
    { key: "highspin", label: "🔥 Yuqori spin" },
    { key: "zfs", label: "⚡ ZFS / exchange" },
    { key: "metal", label: "🧪 Metall markaz" },
    { key: "cu", label: "🟠 Cu(II)" },
    { key: "bio", label: "🧬 Bioanorganik" },
    { key: "radical", label: "⚛️ Organik radikal" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/epr" className="hover:text-purple-300">EPR spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <span className="text-lime-400 font-semibold">Birikmalar katalogi</span>
            </nav>
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-lime-400 flex items-center gap-2">
                  <span className="text-3xl">📡</span>EPR spektroskopiya — Birikmalar katalogi
                </h1>
                <p className="text-purple-300 text-sm mt-1">
                  {birikmalar.length} ta EPR-faol markaz • g-tensor • hiperfin • ZFS • simulyatsiyalangan spektr
                </p>
              </div>
              <Link href="/ilmiy/tahlil/epr" className="text-xs bg-lime-600/80 hover:bg-lime-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">← EPR nazariyasi</Link>
            </div>
          </div>
        </header>
      )}

      <button onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold shadow-lg bg-lime-600 hover:bg-lime-500 text-white transition-all">
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Kirish banner */}
        <div className="rounded-2xl border border-lime-500/20 bg-gradient-to-r from-lime-600/10 via-purple-900/40 to-blue-900/30 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.22em] text-lime-300">EPR ilmiy katalogi</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Har bir karta — interaktiv EPR pasporti</h2>
              <p className="text-sm text-purple-100 mt-2 leading-relaxed">
                Katalogdagi qiymatlar <strong className="text-lime-300">representativ</strong>: g, A, chiziq kengligi va spektr shakli
                erituvchi, temperatura, chastota va agregat holatiga qarab o'zgaradi. Har karta ustidagi <span className="text-lime-300 font-semibold">Pasport ochish</span> tugmasi orqali simulyatsiyalangan spektr, Zeeman sathlari va to'liq ilmiy talqin ochiladi.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <div className="rounded-xl bg-purple-950/45 border border-lime-500/20 px-2 py-1">
                <svg viewBox="0 0 120 36" className="w-28 h-8">
                  <path d="M2 18 H118" stroke="#6d28d9" strokeWidth="1" opacity="0.8" />
                  <path d="M5 18 C12 18 13 5 20 5 C27 5 28 31 35 31 C42 31 43 5 50 5 C57 5 58 31 65 31 C72 31 73 5 80 5 C87 5 88 31 95 31 C102 31 103 18 115 18"
                    fill="none" stroke="#a3e635" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-200">g va A</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200">Spin / ZFS</span>
                <span className="px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-100">O'lchash sharoiti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-lime-900/40 to-purple-900/40 border border-lime-700/50 rounded-xl p-4">
            <div className="text-xs text-lime-300 mb-1">Jami markazlar</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-purple-900/40 border border-emerald-700/50 rounded-xl p-4">
            <div className="text-xs text-emerald-300 mb-1">S = 1/2</div>
            <div className="text-3xl font-bold text-white">{stats.half}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-700/50 rounded-xl p-4">
            <div className="text-xs text-yellow-200 mb-1">Yuqori spin</div>
            <div className="text-3xl font-bold text-white">{stats.highspin}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-xl p-4">
            <div className="text-xs text-blue-200 mb-1">Bioanorganik</div>
            <div className="text-3xl font-bold text-white">{stats.bio}</div>
          </div>
        </div>

        {/* Qidiruv va filtrlar */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Formula, IUPAC, metall, dⁿ, signal imzosi bo'yicha..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-lime-500 transition-colors" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white">✕</button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "grid", label: "▦ Grid" },
                { key: "table", label: "▤ Jadval" },
                { key: "compact", label: "☷ Ixcham" },
              ].map((mode) => (
                <button key={mode.key} onClick={() => setViewMode(mode.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === mode.key ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"}`}>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-purple-300 text-xs py-2">Fizik holat:</span>
            {filterOptions.map((filter) => (
              <button key={filter.key} onClick={() => setFilterMode(filter.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterMode === filter.key ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}>
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            <span className="text-purple-300 text-xs py-2">Tag:</span>
            <button onClick={() => setFilterTag("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTag === "all" ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}>
              Barchasi
            </button>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTag === tag ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Natijalar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-purple-200 text-sm"><strong className="text-lime-400">{filteredBirikmalar.length}</strong> ta markaz topildi</p>
          {(searchQuery || filterMode !== "all" || filterTag !== "all") && (
            <button onClick={resetFilters} className="text-xs text-purple-300 hover:text-lime-300">✕ Filtrlarni tozalash</button>
          )}
        </div>

        {filteredBirikmalar.length === 0 && (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-white mb-2">Mos EPR markaz topilmadi</h3>
            <p className="text-purple-300 text-sm">Boshqa nom, metall yoki tag bo'yicha qidirib ko'ring.</p>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && filteredBirikmalar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredBirikmalar.map((b) => (
              <button key={b.id} onClick={() => setSelectedCompound(b)}
                className="group text-left bg-gradient-to-br from-purple-900/35 to-blue-900/25 border border-purple-700/45 hover:border-lime-500/50 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-lime-500/10">
                <div className="flex justify-between gap-3 items-start mb-4">
                  <div className="min-w-0">
                    <span className="text-xl font-bold text-lime-300 group-hover:text-lime-200 transition-colors" dangerouslySetInnerHTML={{ __html: b.formulaHTML }} />
                    <p className="text-xs text-purple-300 mt-1 line-clamp-1">{b.iupac}</p>
                    <p className="text-[11px] text-purple-500 mt-0.5 italic line-clamp-1">{b.commonName}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full border text-[10px] font-bold bg-lime-500/15 text-lime-300 border-lime-500/35 flex-shrink-0">Faol</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-2">
                    <p className="text-[10px] text-blue-400 uppercase">Konfig.</p>
                    <p className="text-sm text-blue-200 font-mono font-bold">{b.dConfig}</p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-2">
                    <p className="text-[10px] text-purple-400 uppercase">Spin</p>
                    <p className="text-sm text-purple-100 font-mono font-bold">{b.spin}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between gap-3"><span className="text-purple-400">Markaz</span><span className="text-yellow-200 font-mono text-right">{b.metal}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-purple-400">Geometriya</span><span className="text-cyan-200 text-right line-clamp-1" dangerouslySetInnerHTML={{ __html: b.structure }} /></div>
                  <div className="flex justify-between gap-3"><span className="text-purple-400">g-turi</span><span className="text-lime-200 text-right line-clamp-1">{b.gType}</span></div>
                </div>

                <div className="bg-purple-950/45 border border-purple-700/30 rounded-lg p-3 mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-purple-400">g-tensor</p>
                  <p className="text-lime-200 text-xs mt-1" dangerouslySetInnerHTML={{ __html: b.gValues }} />
                  <p className="text-purple-100 text-xs mt-2 leading-relaxed line-clamp-2">{b.signature}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 mb-4">
                  <p className="text-[11px] text-yellow-100 line-clamp-2" dangerouslySetInnerHTML={{ __html: `🔬 ${b.hyperfine}` }} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {b.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-200 text-[10px] border border-purple-700/30">{tag}</span>
                  ))}
                </div>

                <div className="pt-3 border-t border-purple-700/30 flex justify-between items-center text-xs">
                  <span className="text-purple-400">{b.unpaired} ta toq e⁻</span>
                  <span className="text-lime-300 font-semibold group-hover:text-lime-200">Pasport ochish →</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && filteredBirikmalar.length > 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[1050px]">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-lime-300">Formula</th>
                  <th className="py-3 px-3 text-lime-300">Markaz / dⁿ</th>
                  <th className="py-3 px-3 text-lime-300">Spin</th>
                  <th className="py-3 px-3 text-lime-300">g</th>
                  <th className="py-3 px-3 text-lime-300">Hiperfin</th>
                  <th className="py-3 px-3 text-lime-300">ZFS</th>
                  <th className="py-3 px-3 text-lime-300">Amal</th>
                </tr>
              </thead>
              <tbody className="text-purple-100">
                {filteredBirikmalar.map((b) => (
                  <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-lime-300 font-mono" dangerouslySetInnerHTML={{ __html: b.formulaHTML }} />
                      <p className="text-[10px] text-purple-400 mt-1">{b.commonName}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-yellow-200 font-mono">{b.metal}</p>
                      <p className="text-blue-200 font-mono mt-1">{b.dConfig}</p>
                    </td>
                    <td className="py-3 px-3 text-purple-200">{b.spin}</td>
                    <td className="py-3 px-3 text-lime-200" dangerouslySetInnerHTML={{ __html: b.gValues }} />
                    <td className="py-3 px-3 text-yellow-100" dangerouslySetInnerHTML={{ __html: b.hyperfine }} />
                    <td className="py-3 px-3 text-purple-200">{b.zfs}</td>
                    <td className="py-3 px-3">
                      <button onClick={() => setSelectedCompound(b)} className="text-lime-300 hover:text-white font-semibold">Ochish →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPACT VIEW */}
        {viewMode === "compact" && filteredBirikmalar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBirikmalar.map((b) => (
              <button key={b.id} onClick={() => setSelectedCompound(b)}
                className="group text-left rounded-xl border p-4 transition-all flex items-center gap-4 bg-purple-900/30 border-purple-700/40 hover:bg-purple-800/40 hover:border-lime-500/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500/25 to-blue-500/20 border border-lime-500/20 flex items-center justify-center flex-shrink-0 text-xl">📡</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-lime-300 truncate" dangerouslySetInnerHTML={{ __html: b.formulaHTML }} />
                  </div>
                  <p className="text-xs text-purple-300 line-clamp-1">{b.iupac}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px]">
                    <span className="text-blue-200 font-mono">{b.dConfig}</span>
                    <span className="text-purple-100">{b.spin}</span>
                    <span className="text-yellow-200">{b.metal}</span>
                  </div>
                </div>
                <span className="text-lime-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ))}
          </div>
        )}

        {/* Ilmiy jadval */}
        {filteredBirikmalar.length > 5 && (
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/40 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-200 mb-4">📊 EPR diagnostik taqqoslash jadvali</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="border-b border-blue-700/50 bg-blue-950/40">
                    <th className="py-2 px-3 text-left text-blue-300">Markaz</th>
                    <th className="py-2 px-3 text-left text-blue-300">S</th>
                    <th className="py-2 px-3 text-left text-blue-300">Yadro</th>
                    <th className="py-2 px-3 text-left text-blue-300">Kutiladigan pattern</th>
                    <th className="py-2 px-3 text-left text-blue-300">ZFS</th>
                    <th className="py-2 px-3 text-left text-blue-300">Optimal rejim</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBirikmalar.slice(0, 20).map((b) => (
                    <tr key={b.id} className="border-b border-blue-800/30 hover:bg-blue-900/20">
                      <td className="py-2.5 px-3"><span className="text-lime-200 font-mono" dangerouslySetInnerHTML={{ __html: b.formulaHTML }} /></td>
                      <td className="py-2.5 px-3 text-purple-100">{b.spin}</td>
                      <td className="py-2.5 px-3 text-yellow-100">{b.nuclear}</td>
                      <td className="py-2.5 px-3 text-purple-100">{b.signature}</td>
                      <td className="py-2.5 px-3 text-purple-200">{b.zfs}</td>
                      <td className="py-2.5 px-3 text-blue-200">{b.sample}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ogohlantirish va xulosa */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-5">
            <h3 className="text-yellow-200 font-bold text-lg">⚠️ Katalogni ilmiy to'g'ri ishlatish</h3>
            <ul className="mt-3 space-y-2 text-sm text-purple-100 list-disc pl-5 leading-relaxed">
              <li><strong>g</strong> yagona qat'iy raqam emas: eritma/qattiq holat, orientatsiya va chastota diapazoni uni o'zgartiradi.</li>
              <li><strong>A</strong> qiymati birligi (G, mT, MHz, cm⁻¹) o'zaro bir xil emas.</li>
              <li><strong>S &gt; 1/2</strong> markazlarda D va E parametrlarisiz talqin to'liq bo'lmaydi.</li>
              <li><strong>Sim spektri</strong> — birinchi tartib model; haqiqiy tahlil uchun EasySpin/SimFonia.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-lime-500/25 bg-lime-500/10 p-5">
            <h3 className="text-lime-200 font-bold text-lg">🧭 Katalog xususiyatlari</h3>
            <ul className="mt-3 space-y-2 text-sm text-purple-100 list-disc pl-5 leading-relaxed">
              <li>26 ta EPR-faol kompleks va model markaz</li>
              <li>Har karta ustida interaktiv EPR pasporti (spektr + Zeeman)</li>
              <li>Chastota (S/X/Q/W-band) va harorat (4 K – RT) sozlanadi</li>
              <li>Hiperfin, ZFS, g-tensor va bio-diagnostik ma'nolar</li>
            </ul>
          </div>
        </div>

        {/* Navigatsiya */}
        <div className="flex justify-between pt-4 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 border border-purple-500 rounded-2xl hover:bg-purple-800/50 text-purple-200 transition-colors">← EPR nazariyasi</Link>
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 bg-lime-600/80 rounded-2xl hover:bg-lime-500 text-white font-semibold transition-colors">Mössbauer spektroskopiya →</Link>
        </div>
      </section>

      {/* MODAL — birikma pasporti */}
      {selectedCompound && (
        <CompoundPassport compound={selectedCompound} onClose={() => setSelectedCompound(null)} />
      )}
    </main>
  )
}
