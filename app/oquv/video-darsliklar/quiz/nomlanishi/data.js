// app/oquv/video-darsliklar/quiz/nomlanishi/data.js

// ═══════════════════════════════════════════════════════════════════════════════
// NOMLANISH QUIZ — SAVOL BAZASI (150 TA SAVOL)
// Manbalar: IUPAC 2005 Recommendations, Cotton-Wilkinson, Miessler-Tarr
// Xususiyat: 6 ta guruh — ligandlar, kation, anion, oksidlanish, polidentat, aralash
// ═══════════════════════════════════════════════════════════════════════════════

export const QUIZ_BANK = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1-GURUH: LIGAND NOMLARI (30 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    question: "H₂O ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["gidro", "akva", "okso", "gidroksoniy"],
    correct: 1,
    difficulty: "oson",
    tags: ["ligand", "akva", "neytral"],
    explanation: "H₂O ligandi IUPAC bo'yicha 'akva' (aqua) deb nomlanadi. Bu neytral ligand, metalga O atomi orqali bog'lanadi."
  },
  {
    id: 2,
    question: "NH₃ ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["amid", "amin", "ammin", "ammoniy"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "ammin", "neytral"],
    explanation: "NH₃ ligandi IUPAC bo'yicha 'ammin' (ammine) deb nomlanadi — ikki 'm' bilan. Neytral ligand, N atomi orqali bog'lanadi."
  },
  {
    id: 3,
    question: "CN⁻ ligandi qanday nomlanadi?",
    options: ["sian", "sianid", "siyano", "sianato"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "siyano", "anion"],
    explanation: "CN⁻ ligandi IUPAC bo'yicha 'siyano' (cyano) deb nomlanadi. Anion ligand, C atomi orqali bog'lanadi."
  },
  {
    id: 4,
    question: "CO ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["karbonat", "karbonil", "karboksil", "karbon"],
    correct: 1,
    difficulty: "oson",
    tags: ["ligand", "karbonil", "neytral"],
    explanation: "CO ligandi IUPAC bo'yicha 'karbonil' (carbonyl) deb nomlanadi. Neytral ligand, C atomi orqali bog'lanadi."
  },
  {
    id: 5,
    question: "Cl⁻ ligandi kompleks birikmada qanday nomlanadi?",
    options: ["xlor", "xlorid", "xloro", "xlorit"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "xloro", "anion"],
    explanation: "Cl⁻ ligandi kompleks birikmada 'xloro' (chloro) deb nomlanadi. Anion ligand, Cl atomi orqali bog'lanadi."
  },
  {
    id: 6,
    question: "OH⁻ ligandi qanday nomlanadi?",
    options: ["gidroksil", "gidroksid", "gidrokso", "gidro"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "gidrokso", "anion"],
    explanation: "OH⁻ ligandi IUPAC bo'yicha 'gidrokso' (hydroxo) deb nomlanadi. Anion ligand, O atomi orqali bog'lanadi."
  },
  {
    id: 7,
    question: "NO₂⁻ ligandi N orqali bog'langanda qanday nomlanadi?",
    options: ["nitro", "nitrito", "nitrito-N", "nitro-N"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "nitro", "linkage"],
    explanation: "NO₂⁻ ligandi N orqali bog'langanda 'nitro' deb nomlanadi. O orqali bog'langanda 'nitrito-O' deb nomlanadi (linkage izomerizm)."
  },
  {
    id: 8,
    question: "NO₂⁻ ligandi O orqali bog'langanda qanday nomlanadi?",
    options: ["nitro", "nitrito", "nitrito-O", "nitro-O"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand", "nitrito", "linkage"],
    explanation: "NO₂⁻ ligandi O orqali bog'langanda 'nitrito-O' deb nomlanadi. Bu linkage izomerizm — ambidentat ligand."
  },
  {
    id: 9,
    question: "SCN⁻ ligandi S orqali bog'langanda qanday nomlanadi?",
    options: ["tiotsianato", "tiotsianato-S", "tiotsianato-S", "tiotsianato-S"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "tiotsianato", "linkage"],
    explanation: "SCN⁻ ligandi S orqali bog'langanda 'tiotsianato-S' (thiocyanato-S) deb nomlanadi. Ambidentat ligand."
  },
  {
    id: 10,
    question: "SCN⁻ ligandi N orqali bog'langanda qanday nomlanadi?",
    options: ["izotiotsianato", "tiotsianato-N", "izosiyanato", "tiotsianato"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "tiotsianato", "linkage"],
    explanation: "SCN⁻ ligandi N orqali bog'langanda 'tiotsianato-N' deb nomlanadi. Ambidentat ligand — S yoki N orqali bog'lanishi mumkin."
  },
  {
    id: 11,
    question: "F⁻ ligandi qanday nomlanadi?",
    options: ["ftor", "ftorid", "ftoro", "ftorit"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "ftoro", "anion"],
    explanation: "F⁻ ligandi IUPAC bo'yicha 'ftoro' (fluoro) deb nomlanadi. Anion ligand."
  },
  {
    id: 12,
    question: "Br⁻ ligandi qanday nomlanadi?",
    options: ["brom", "bromid", "bromo", "bromit"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "bromo", "anion"],
    explanation: "Br⁻ ligandi IUPAC bo'yicha 'bromo' deb nomlanadi. Anion ligand."
  },
  {
    id: 13,
    question: "I⁻ ligandi qanday nomlanadi?",
    options: ["yod", "yodid", "yodo", "yodit"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "yodo", "anion"],
    explanation: "I⁻ ligandi IUPAC bo'yicha 'yodo' (iodo) deb nomlanadi. Anion ligand."
  },
  {
    id: 14,
    question: "O²⁻ ligandi qanday nomlanadi?",
    options: ["okso", "oksid", "okso", "oksid"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "okso", "anion"],
    explanation: "O²⁻ ligandi IUPAC bo'yicha 'okso' (oxo) deb nomlanadi. Anion ligand."
  },
  {
    id: 15,
    question: "S²⁻ ligandi qanday nomlanadi?",
    options: ["sulfid", "tio", "tio", "sulfido"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "tio", "anion"],
    explanation: "S²⁻ ligandi IUPAC bo'yicha 'tio' (thio) deb nomlanadi. Anion ligand."
  },
  {
    id: 16,
    question: "NO⁺ ligandi qanday nomlanadi?",
    options: ["nitrozil", "nitro", "nitrito", "nitrozil"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "nitrozil", "kation"],
    explanation: "NO⁺ ligandi IUPAC bo'yicha 'nitrozil' (nitrosyl) deb nomlanadi. Kation ligand."
  },
  {
    id: 17,
    question: "C₅H₅⁻ (siklopentadienil) ligandi qanday nomlanadi?",
    options: ["siklopentadienil", "siklopentadienil", "siklopentadienil", "siklopentadienil"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "siklopentadienil", "anion"],
    explanation: "C₅H₅⁻ ligandi 'siklopentadienil' (cyclopentadienyl) deb nomlanadi. η⁵-bog'lanish (pentahapto)."
  },
  {
    id: 18,
    question: "en (etilendiamin) ligandi qanday nomlanadi?",
    options: ["etilendiamin", "etilendiamin", "diaminoetan", "etilendiamin"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand", "etilendiamin", "bidentat"],
    explanation: "en (etilendiamin, ethylenediamine) — bidentat ligand, ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 19,
    question: "ox²⁻ (oksalat) ligandi qanday nomlanadi?",
    options: ["oksalato", "oksalat", "oksalato", "oksalat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "oksalato", "bidentat"],
    explanation: "ox²⁻ (oksalat, oxalate) ligandi IUPAC bo'yicha 'oksalato' (oxalato) deb nomlanadi. Bidentat ligand, ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 20,
    question: "acac⁻ (atsetilasetonat) ligandi qanday nomlanadi?",
    options: ["atsetilasetonato", "atsetilasetonat", "atsetilasetonato", "atsetilasetonat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "atsetilasetonato", "bidentat"],
    explanation: "acac⁻ (atsetilasetonat, acetylacetonate) ligandi IUPAC bo'yicha 'atsetilasetonato' deb nomlanadi. Bidentat ligand, ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 21,
    question: "py (piridin) ligandi qanday nomlanadi?",
    options: ["piridin", "piridin", "piridin", "piridin"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand", "piridin", "neytral"],
    explanation: "py (piridin, pyridine) — neytral ligand, N atomi orqali bog'lanadi."
  },
  {
    id: 22,
    question: "phen (1,10-fenantrolin) ligandi qanday nomlanadi?",
    options: ["1,10-fenantrolin", "fenantroline", "1,10-fenantrolin", "fenantroline"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "fenantroline", "bidentat"],
    explanation: "phen (1,10-fenantrolin, 1,10-phenanthroline) — bidentat ligand, ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 23,
    question: "EDTA⁴⁻ ligandi qanday nomlanadi?",
    options: ["etilendiamintetraatsetato", "etilendiamintetraatsetat", "etilendiamintetraatsetato", "etilendiamintetraatsetat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["ligand", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ (etilendiamintetraatsetat, ethylenediaminetetraacetate) — geksadentat ligand, 6 ta donor atom (2 N, 4 O)."
  },
  {
    id: 24,
    question: "PPh₃ (trifenilfosfin) ligandi qanday nomlanadi?",
    options: ["trifenilfosfin", "trifenilfosfin", "trifenilfosfin", "trifenilfosfin"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "trifenilfosfin", "neytral"],
    explanation: "PPh₃ (trifenilfosfin, triphenylphosphine) — neytral ligand, P atomi orqali bog'lanadi."
  },
  {
    id: 25,
    question: "NO₃⁻ ligandi qanday nomlanadi?",
    options: ["nitrato", "nitrat", "nitrato", "nitrat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "nitrato", "anion"],
    explanation: "NO₃⁻ ligandi IUPAC bo'yicha 'nitrato' (nitrato) deb nomlanadi. Anion ligand."
  },
  {
    id: 26,
    question: "SO₄²⁻ ligandi qanday nomlanadi?",
    options: ["sulfato", "sulfat", "sulfato", "sulfat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "sulfato", "anion"],
    explanation: "SO₄²⁻ ligandi IUPAC bo'yicha 'sulfato' (sulfato) deb nomlanadi. Anion ligand."
  },
  {
    id: 27,
    question: "CO₃²⁻ ligandi qanday nomlanadi?",
    options: ["karbonato", "karbonat", "karbonato", "karbonat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "karbonato", "anion"],
    explanation: "CO₃²⁻ ligandi IUPAC bo'yicha 'karbonato' (carbonato) deb nomlanadi. Anion ligand."
  },
  {
    id: 28,
    question: "CH₃COO⁻ (atsetat) ligandi qanday nomlanadi?",
    options: ["atsetato", "atsetat", "atsetato", "atsetat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "atsetato", "anion"],
    explanation: "CH₃COO⁻ (atsetat, acetate) ligandi IUPAC bo'yicha 'atsetato' (acetato) deb nomlanadi. Anion ligand."
  },
  {
    id: 29,
    question: "C₂O₄²⁻ (oksalat) ligandi qanday nomlanadi?",
    options: ["oksalato", "oksalat", "oksalato", "oksalat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "oksalato", "bidentat"],
    explanation: "C₂O₄²⁻ (oksalat, oxalate) ligandi IUPAC bo'yicha 'oksalato' (oxalato) deb nomlanadi. Bidentat ligand."
  },
  {
    id: 30,
    question: "H⁻ (gidrid) ligandi qanday nomlanadi?",
    options: ["gidrido", "gidrid", "gidrido", "gidrid"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "gidrido", "anion"],
    explanation: "H⁻ (gidrid, hydride) ligandi IUPAC bo'yicha 'gidrido' (hydrido) deb nomlanadi. Anion ligand."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-GURUH: KATION KOMPLEKSLAR (25 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 31,
    question: "[Ag(NH₃)₂]Cl ning IUPAC bo'yicha nomi qanday?",
    options: ["diamminkumush(I) xlorid", "diamminkumush(II) xlorid", "kumush diamminklorid", "diaminargentum xlorid"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "kumush", "ammin", "xlorid"],
    explanation: "Kation kompleks: ligandlar alifbo tartibida (ammin), metall nomi (kumush), oksidlanish darajasi (I), anion (xlorid). [Ag(NH₃)₂]⁺ — kation, Cl⁻ — anion."
  },
  {
    id: 32,
    question: "[Co(NH₃)₆]Cl₃ ning to'g'ri nomini toping.",
    options: ["geksaamminkobalt(III) xlorid", "geksaamminkobalt(II) xlorid", "kobalt geksaammin xlorid", "geksaamminxlorokobalt"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "kobalt", "ammin", "xlorid"],
    explanation: "[Co(NH₃)₆]³⁺ — kation (geksaamminkobalt(III)), 3 Cl⁻ — anion (xlorid). Co³⁺ oksidlanish darajasi."
  },
  {
    id: 33,
    question: "[Cu(NH₃)₄]SO₄ ning IUPAC nomi qanday?",
    options: ["tetraamminkumush(II) sulfat", "tetraamminkumush(II) sulfat", "tetraamminkumush(II) sulfat", "tetraamminkumush(II) sulfat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "mis", "ammin", "sulfat"],
    explanation: "[Cu(NH₃)₄]²⁺ — kation (tetraamminkumush(II)), SO₄²⁻ — anion (sulfat). Cu²⁺ oksidlanish darajasi."
  },
  {
    id: 34,
    question: "[Co(NH₃)₅Cl]Cl₂ ning to'g'ri nomini toping.",
    options: ["pentaamminklorokobalt(III) xlorid", "pentaamminklorokobalt(II) xlorid", "pentaamminkobalt(III) xlorid", "pentaxloroamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₅Cl]²⁺ — kation (pentaamminklorokobalt(III)), 2 Cl⁻ — anion. Ligandlar alifbo tartibida: ammin, xloro."
  },
  {
    id: 35,
    question: "[Pt(NH₃)₄Cl₂] ning to'g'ri nomini toping.",
    options: ["tetraammindikloroplatina(II)", "tetraammindikloroplatina(IV)", "tetraammindikloroplatina(II)", "dixlorotetraamminplatina(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "platina", "ammin", "xloro"],
    explanation: "[Pt(NH₃)₄Cl₂] — neytral kompleks. Ligandlar alifbo tartibida: ammin, xloro. Pt²⁺ oksidlanish darajasi."
  },
  {
    id: 36,
    question: "[Ni(CN)₄]²⁻ ning to'g'ri nomini toping.",
    options: ["tetratsianonikelat(II)", "tetratsianonikel(II)", "tetratsianonikelat(II)", "tetratsianonikelat(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "nikel", "siyano"],
    explanation: "[Ni(CN)₄]²⁻ — anion kompleks. Anion komplekslarda metall nomiga '-at' qo'shimchasi qo'shiladi: nikel → nikelat."
  },
  {
    id: 37,
    question: "[Fe(CN)₆]⁴⁻ ning to'g'ri nomini toping.",
    options: ["geksatsianoferrat(II)", "geksatsianoferrat(III)", "geksatsianotemir(II)", "geksatsianoferrat(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "temir", "siyano"],
    explanation: "[Fe(CN)₆]⁴⁻ — anion kompleks. Fe²⁺ oksidlanish darajasi. Anion komplekslarda temir → ferrat."
  },
  {
    id: 38,
    question: "[Fe(CN)₆]³⁻ ning to'g'ri nomini toping.",
    options: ["geksatsianoferrat(III)", "geksatsianoferrat(II)", "geksatsianoferrat(III)", "geksatsianotemir(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "temir", "siyano"],
    explanation: "[Fe(CN)₆]³⁻ — anion kompleks. Fe³⁺ oksidlanish darajasi. Anion komplekslarda temir → ferrat."
  },
  {
    id: 39,
    question: "[PtCl₆]²⁻ ning to'g'ri nomini toping.",
    options: ["geksaxloroplatinat(IV)", "geksaxloroplatina(IV)", "geksaxloroplatinat(II)", "geksaxloroplatinat(IV)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "platina", "xloro"],
    explanation: "[PtCl₆]²⁻ — anion kompleks. Pt⁴⁺ oksidlanish darajasi. Anion komplekslarda platina → platinat."
  },
  {
    id: 40,
    question: "[Co(NH₃)₆]³⁺ ning to'g'ri nomini toping.",
    options: ["geksaamminkobalt(III)", "geksaamminkobalt(II)", "geksaamminkobalt(III)", "geksaamminkobalt"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "kobalt", "ammin"],
    explanation: "[Co(NH₃)₆]³⁺ — kation kompleks. Co³⁺ oksidlanish darajasi. Kation komplekslarda metall nomi o'zgarmaydi."
  },
  {
    id: 41,
    question: "[Cu(en)₃]²⁺ ning to'g'ri nomini toping.",
    options: ["tris(etilendiamin)kumush(II)", "tris(etilendiamin)kumush(II)", "tris(etilendiamin)kumush(II)", "tris(etilendiamin)kumush(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "mis", "etilendiamin", "polidentat"],
    explanation: "[Cu(en)₃]²⁺ — kation kompleks. Polidentat ligand (en) uchun 'tris' prefiksi ishlatiladi. Cu²⁺ oksidlanish darajasi."
  },
  {
    id: 42,
    question: "[Co(en)₃]³⁺ ning to'g'ri nomini toping.",
    options: ["tris(etilendiamin)kobalt(III)", "tris(etilendiamin)kobalt(II)", "tris(etilendiamin)kobalt(III)", "tris(etilendiamin)kobalt"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "etilendiamin", "polidentat"],
    explanation: "[Co(en)₃]³⁺ — kation kompleks. Polidentat ligand uchun 'tris' prefiksi. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 43,
    question: "[Fe(C₂O₄)₃]³⁻ ning to'g'ri nomini toping.",
    options: ["tris(oksalato)ferrat(III)", "tris(oksalato)ferrat(II)", "tris(oksalato)temir(III)", "tris(oksalato)ferrat(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "temir", "oksalato", "polidentat"],
    explanation: "[Fe(C₂O₄)₃]³⁻ — anion kompleks. Polidentat ligand (oksalato) uchun 'tris' prefiksi. Fe³⁺ oksidlanish darajasi. Anion → ferrat."
  },
  {
    id: 44,
    question: "[Cr(NH₃)₆]³⁺ ning to'g'ri nomini toping.",
    options: ["geksaamminkrom(III)", "geksaamminkrom(II)", "geksaamminkrom(III)", "geksaamminkrom"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "xrom", "ammin"],
    explanation: "[Cr(NH₃)₆]³⁺ — kation kompleks. Cr³⁺ oksidlanish darajasi."
  },
  {
    id: 45,
    question: "[Ni(CO)₄] ning to'g'ri nomini toping.",
    options: ["tetrakarbonilnikel(0)", "tetrakarbonilnikel(II)", "tetrakarbonilnikel(0)", "tetrakarbonilnikel"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["neytral", "nikel", "karbonil"],
    explanation: "[Ni(CO)₄] — neytral kompleks. Ni⁰ oksidlanish darajasi (CO neytral ligand)."
  },
  {
    id: 46,
    question: "[Fe(CO)₅] ning to'g'ri nomini toping.",
    options: ["pentakarboniltemir(0)", "pentakarboniltemir(II)", "pentakarboniltemir(0)", "pentakarboniltemir"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["neytral", "temir", "karbonil"],
    explanation: "[Fe(CO)₅] — neytral kompleks. Fe⁰ oksidlanish darajasi."
  },
  {
    id: 47,
    question: "[Co(NH₃)₄Cl₂]⁺ ning to'g'ri nomini toping.",
    options: ["tetraammindiklorokobalt(III)", "tetraammindiklorokobalt(II)", "tetraammindiklorokobalt(III)", "dixlorotetraamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, xloro. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 48,
    question: "[Pt(NH₃)₂Cl₂] ning to'g'ri nomini toping.",
    options: ["diammindixloroplatina(II)", "diammindixloroplatina(IV)", "diammindixloroplatina(II)", "dixlorodiamminplatina(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["neytral", "platina", "ammin", "xloro"],
    explanation: "[Pt(NH₃)₂Cl₂] — neytral kompleks. Ligandlar alifbo tartibida: ammin, xloro. Pt²⁺ oksidlanish darajasi."
  },
  {
    id: 49,
    question: "[Co(NH₃)₅(H₂O)]³⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkvakobalt(III)", "pentaamminkvakobalt(II)", "pentaamminkvakobalt(III)", "akvapentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "akva"],
    explanation: "[Co(NH₃)₅(H₂O)]³⁺ — kation kompleks. Ligandlar alifbo tartibida: akva, ammin. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 50,
    question: "[Co(NH₃)₅(NO₂)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) nitro", "pentaamminkobalt(II) nitro", "pentaamminkobalt(III) nitro", "nitropentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "nitro"],
    explanation: "[Co(NH₃)₅(NO₂)]²⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, nitro. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 51,
    question: "[Co(NH₃)₅(ONO)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) nitrito-O", "pentaamminkobalt(II) nitrito-O", "pentaamminkobalt(III) nitrito-O", "nitrito-O-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "nitrito"],
    explanation: "[Co(NH₃)₅(ONO)]²⁺ — kation kompleks. NO₂⁻ O orqali bog'langan (nitrito-O). Linkage izomerizm."
  },
  {
    id: 52,
    question: "[Co(NH₃)₅(SCN)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) tiotsianato-S", "pentaamminkobalt(II) tiotsianato-S", "pentaamminkobalt(III) tiotsianato-S", "tiotsianato-S-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "tiotsianato"],
    explanation: "[Co(NH₃)₅(SCN)]²⁺ — kation kompleks. SCN⁻ S orqali bog'langan (tiotsianato-S). Ambidentat ligand."
  },
  {
    id: 53,
    question: "[Co(NH₃)₅(NCS)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) tiotsianato-N", "pentaamminkobalt(II) tiotsianato-N", "pentaamminkobalt(III) tiotsianato-N", "tiotsianato-N-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "tiotsianato"],
    explanation: "[Co(NH₃)₅(NCS)]²⁺ — kation kompleks. SCN⁻ N orqali bog'langan (tiotsianato-N). Linkage izomerizm."
  },
  {
    id: 54,
    question: "[Co(NH₃)₄Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["tetraammindiklorokobalt(III) xlorid", "tetraammindiklorokobalt(II) xlorid", "tetraammindiklorokobalt(III) xlorid", "dixlorotetraamminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation (tetraammindiklorokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺ oksidlanish darajasi."
  },
  {
    id: 55,
    question: "[Co(NH₃)₆][Cr(CN)₆] ning to'g'ri nomini toping.",
    options: ["geksaamminkobalt(III) geksatsianokromat(III)", "geksaamminkobalt(II) geksatsianokromat(III)", "geksaamminkobalt(III) geksatsianokromat(III)", "geksaamminkobalt(III) geksatsianokrom(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "anion", "kobalt", "xrom"],
    explanation: "[Co(NH₃)₆]³⁺ — kation (geksaamminkobalt(III)), [Cr(CN)₆]³⁻ — anion (geksatsianokromat(III)). Koordinatsion birikma."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-GURUH: OKSIDLANISH DARAJASI HISOBLASH (25 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 56,
    question: "[Fe(CN)₆]⁴⁻ da Fe ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "temir", "anion"],
    explanation: "CN⁻ zaryadi -1, 6 ta CN⁻ = -6. Umumiy zaryad -4. Fe + (-6) = -4 → Fe = +2."
  },
  {
    id: 57,
    question: "[Fe(CN)₆]³⁻ da Fe ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "temir", "anion"],
    explanation: "CN⁻ zaryadi -1, 6 ta CN⁻ = -6. Umumiy zaryad -3. Fe + (-6) = -3 → Fe = +3."
  },
  {
    id: 58,
    question: "[Co(NH₃)₆]³⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral ligand (zaryad 0). Umumiy zaryad +3. Co + 0 = +3 → Co = +3."
  },
  {
    id: 59,
    question: "[Co(NH₃)₅Cl]²⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), Cl⁻ zaryadi -1. Umumiy zaryad +2. Co + 0 + (-1) = +2 → Co = +3."
  },
  {
    id: 60,
    question: "[Ag(NH₃)₂]⁺ da Ag ning oksidlanish darajasi necha?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 0,
    difficulty: "oson",
    tags: ["oksidlanish", "kumush", "kation"],
    explanation: "NH₃ neytral (0). Umumiy zaryad +1. Ag + 0 = +1 → Ag = +1."
  },
  {
    id: 61,
    question: "[Cu(NH₃)₄]²⁺ da Cu ning oksidlanish darajasi necha?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "mis", "kation"],
    explanation: "NH₃ neytral (0). Umumiy zaryad +2. Cu + 0 = +2 → Cu = +2."
  },
  {
    id: 62,
    question: "[PtCl₆]²⁻ da Pt ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "anion"],
    explanation: "Cl⁻ zaryadi -1, 6 ta Cl⁻ = -6. Umumiy zaryad -2. Pt + (-6) = -2 → Pt = +4."
  },
  {
    id: 63,
    question: "[PtCl₄]²⁻ da Pt ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "anion"],
    explanation: "Cl⁻ zaryadi -1, 4 ta Cl⁻ = -4. Umumiy zaryad -2. Pt + (-4) = -2 → Pt = +2."
  },
  {
    id: 64,
    question: "[Ni(CO)₄] da Ni ning oksidlanish darajasi necha?",
    options: ["0", "+2", "+3", "+4"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["oksidlanish", "nikel", "neytral"],
    explanation: "CO neytral ligand (zaryad 0). Umumiy zaryad 0. Ni + 0 = 0 → Ni = 0."
  },
  {
    id: 65,
    question: "[Fe(CO)₅] da Fe ning oksidlanish darajasi necha?",
    options: ["0", "+2", "+3", "+5"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["oksidlanish", "temir", "neytral"],
    explanation: "CO neytral ligand (zaryad 0). Umumiy zaryad 0. Fe + 0 = 0 → Fe = 0."
  },
  {
    id: 66,
    question: "[Cr(C₂O₄)₃]³⁻ da Cr ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "xrom", "anion"],
    explanation: "C₂O₄²⁻ zaryadi -2, 3 ta C₂O₄²⁻ = -6. Umumiy zaryad -3. Cr + (-6) = -3 → Cr = +3."
  },
  {
    id: 67,
    question: "[Co(C₂O₄)₃]³⁻ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "anion"],
    explanation: "C₂O₄²⁻ zaryadi -2, 3 ta C₂O₄²⁻ = -6. Umumiy zaryad -3. Co + (-6) = -3 → Co = +3."
  },
  {
    id: 68,
    question: "[Co(en)₃]³⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "en neytral ligand (zaryad 0). Umumiy zaryad +3. Co + 0 = +3 → Co = +3."
  },
  {
    id: 69,
    question: "[Cu(en)₂]²⁺ da Cu ning oksidlanish darajasi necha?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "mis", "kation"],
    explanation: "en neytral ligand (zaryad 0). Umumiy zaryad +2. Cu + 0 = +2 → Cu = +2."
  },
  {
    id: 70,
    question: "[Co(NH₃)₄Cl₂]⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), Cl⁻ zaryadi -1, 2 ta Cl⁻ = -2. Umumiy zaryad +1. Co + 0 + (-2) = +1 → Co = +3."
  },
  {
    id: 71,
    question: "[Pt(NH₃)₂Cl₂] da Pt ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "neytral"],
    explanation: "NH₃ neytral (0), Cl⁻ zaryadi -1, 2 ta Cl⁻ = -2. Umumiy zaryad 0. Pt + 0 + (-2) = 0 → Pt = +2."
  },
  {
    id: 72,
    question: "[Co(NH₃)₅(H₂O)]³⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), H₂O neytral (0). Umumiy zaryad +3. Co + 0 + 0 = +3 → Co = +3."
  },
  {
    id: 73,
    question: "[Co(NH₃)₅(NO₂)]²⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), NO₂⁻ zaryadi -1. Umumiy zaryad +2. Co + 0 + (-1) = +2 → Co = +3."
  },
  {
    id: 74,
    question: "[Co(NH₃)₅(ONO)]²⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), ONO⁻ zaryadi -1. Umumiy zaryad +2. Co + 0 + (-1) = +2 → Co = +3."
  },
  {
    id: 75,
    question: "[Co(NH₃)₅(SCN)]²⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), SCN⁻ zaryadi -1. Umumiy zaryad +2. Co + 0 + (-1) = +2 → Co = +3."
  },
  {
    id: 76,
    question: "[Co(NH₃)₅(NCS)]²⁺ da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), NCS⁻ zaryadi -1. Umumiy zaryad +2. Co + 0 + (-1) = +2 → Co = +3."
  },
  {
    id: 77,
    question: "[Co(NH₃)₄Cl₂]Cl da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation. NH₃ neytral (0), Cl⁻ zaryadi -1, 2 ta Cl⁻ = -2. Umumiy zaryad +1. Co + 0 + (-2) = +1 → Co = +3."
  },
  {
    id: 78,
    question: "[Co(NH₃)₆][Cr(CN)₆] da Co ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "[Co(NH₃)₆]³⁺ — kation. NH₃ neytral (0). Umumiy zaryad +3. Co + 0 = +3 → Co = +3."
  },
  {
    id: 79,
    question: "[Co(NH₃)₆][Cr(CN)₆] da Cr ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["oksidlanish", "xrom", "anion"],
    explanation: "[Cr(CN)₆]³⁻ — anion. CN⁻ zaryadi -1, 6 ta CN⁻ = -6. Umumiy zaryad -3. Cr + (-6) = -3 → Cr = +3."
  },
  {
    id: 80,
    question: "[Ni(CN)₄]²⁻ da Ni ning oksidlanish darajasi necha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "nikel", "anion"],
    explanation: "CN⁻ zaryadi -1, 4 ta CN⁻ = -4. Umumiy zaryad -2. Ni + (-4) = -2 → Ni = +2."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-GURUH: POLIDENTAT LIGANDLAR (20 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 81,
    question: "Polidentat ligandlar sonini ko'rsatishda qanday prefiks ishlatiladi?",
    options: ["di-, tri-, tetra-", "do-, tro-, tetro-", "bis-, tris-, tetrakis-", "ikki, uch, to'rt"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["polidentat", "prefiks", "bis", "tris"],
    explanation: "Polidentat ligandlar uchun bis-, tris-, tetrakis- prefikslari ishlatiladi (masalan, tris(etilendiamin))."
  },
  {
    id: 82,
    question: "en (etilendiamin) ligandi nechta donor atomga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "oson",
    tags: ["polidentat", "etilendiamin", "bidentat"],
    explanation: "en (etilendiamin) — bidentat ligand, ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 83,
    question: "ox²⁻ (oksalat) ligandi nechta donor atomga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "oksalat", "bidentat"],
    explanation: "ox²⁻ (oksalat) — bidentat ligand, ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 84,
    question: "acac⁻ (atsetilasetonat) ligandi nechta donor atomga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "atsetilasetonat", "bidentat"],
    explanation: "acac⁻ (atsetilasetonat) — bidentat ligand, ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 85,
    question: "phen (1,10-fenantrolin) ligandi nechta donor atomga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "fenantroline", "bidentat"],
    explanation: "phen (1,10-fenantrolin) — bidentat ligand, ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 86,
    question: "EDTA⁴⁻ ligandi nechta donor atomga ega?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["polidentat", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand, 6 ta donor atom (2 N, 4 O)."
  },
  {
    id: 87,
    question: "[Co(en)₃]³⁺ da nechta donor atom bor?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "etilendiamin", "bidentat"],
    explanation: "3 ta en ligand × 2 donor atom = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 88,
    question: "[Co(C₂O₄)₃]³⁻ da nechta donor atom bor?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "oksalat", "bidentat"],
    explanation: "3 ta C₂O₄²⁻ ligand × 2 donor atom = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 89,
    question: "[Co(acac)₃] da nechta donor atom bor?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "atsetilasetonat", "bidentat"],
    explanation: "3 ta acac⁻ ligand × 2 donor atom = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 90,
    question: "[Fe(EDTA)]⁻ da nechta donor atom bor?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["polidentat", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand, 6 ta donor atom (2 N, 4 O). Koordinatsion son = 6."
  },
  {
    id: 91,
    question: "[Co(en)₃]³⁺ ning to'g'ri nomini toping.",
    options: ["tris(etilendiamin)kobalt(III)", "tri(etilendiamin)kobalt(III)", "tris(etilendiamin)kobalt(II)", "tri(etilendiamin)kobalt(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "etilendiamin", "kation"],
    explanation: "[Co(en)₃]³⁺ — kation kompleks. Polidentat ligand uchun 'tris' prefiksi. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 92,
    question: "[Co(C₂O₄)₃]³⁻ ning to'g'ri nomini toping.",
    options: ["tris(oksalato)kobaltat(III)", "tri(oksalato)kobaltat(III)", "tris(oksalato)kobalt(III)", "tri(oksalato)kobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "oksalat", "anion"],
    explanation: "[Co(C₂O₄)₃]³⁻ — anion kompleks. Polidentat ligand uchun 'tris' prefiksi. Anion → kobaltat. Co³⁺."
  },
  {
    id: 93,
    question: "[Co(acac)₃] ning to'g'ri nomini toping.",
    options: ["tris(atsetilasetonato)kobalt(III)", "tri(atsetilasetonato)kobalt(III)", "tris(atsetilasetonato)kobalt(III)", "tri(atsetilasetonato)kobalt(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "atsetilasetonat", "neytral"],
    explanation: "[Co(acac)₃] — neytral kompleks. Polidentat ligand uchun 'tris' prefiksi. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 94,
    question: "[Fe(EDTA)]⁻ ning to'g'ri nomini toping.",
    options: ["etilendiamintetraatsetatoferrat(III)", "etilendiamintetraatsetatoferrat(II)", "etilendiamintetraatsetatoferrat(III)", "etilendiamintetraatsetatotemir(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "EDTA", "anion"],
    explanation: "[Fe(EDTA)]⁻ — anion kompleks. EDTA⁴⁻ — geksadentat ligand. Fe³⁺ oksidlanish darajasi. Anion → ferrat."
  },
  {
    id: 95,
    question: "Xelat effekti nima?",
    options: ["Polidentat ligandlarning kuchliroq bog'lanishi", "Monodentat ligandlarning kuchliroq bog'lanishi", "Kation komplekslarning barqarorligi", "Anion komplekslarning barqarorligi"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["polidentat", "xelat", "barqarorlik"],
    explanation: "Xelat effekti — polidentat ligandlar monodentat ligandlarga qaraganda kuchliroq bog'lanadi (entropiya effekti)."
  },
  {
    id: 96,
    question: "[Co(en)₃]³⁺ qaysi turdagi kompleks?",
    options: ["Xelat kompleks", "Monodentat kompleks", "Anion kompleks", "Neytral kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["polidentat", "xelat", "kation"],
    explanation: "[Co(en)₃]³⁺ — xelat kompleks (polidentat ligandlar). Kation kompleks."
  },
  {
    id: 97,
    question: "[Fe(C₂O₄)₃]³⁻ qaysi turdagi kompleks?",
    options: ["Xelat kompleks", "Monodentat kompleks", "Kation kompleks", "Neytral kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["polidentat", "xelat", "anion"],
    explanation: "[Fe(C₂O₄)₃]³⁻ — xelat kompleks (polidentat ligandlar). Anion kompleks."
  },
  {
    id: 98,
    question: "EDTA⁴⁻ ligandi qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Geksadentat"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["polidentat", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand (6 ta donor atom: 2 N, 4 O)."
  },
  {
    id: 99,
    question: "[Co(en)₂Cl₂]⁺ ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)dixlorokobalt(III)", "di(etilendiamin)dixlorokobalt(III)", "bis(etilendiamin)dixlorokobalt(II)", "di(etilendiamin)dixlorokobalt(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "etilendiamin", "kation"],
    explanation: "[Co(en)₂Cl₂]⁺ — kation kompleks. Polidentat ligand uchun 'bis' prefiksi. Co³⁺ oksidlanish darajasi."
  },
  {
    id: 100,
    question: "[Co(en)₂Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)dixlorokobalt(III) xlorid", "di(etilendiamin)dixlorokobalt(III) xlorid", "bis(etilendiamin)dixlorokobalt(II) xlorid", "di(etilendiamin)dixlorokobalt(II) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["polidentat", "etilendiamin", "kation"],
    explanation: "[Co(en)₂Cl₂]⁺ — kation (bis(etilendiamin)dixlorokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-GURUH: ARALASH LIGANDLI KOMPLEKSLAR (20 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 101,
    question: "[Co(NH₃)₄Cl₂]⁺ ning to'g'ri nomini toping.",
    options: ["tetraammindiklorokobalt(III)", "tetraammindiklorokobalt(II)", "tetraammindiklorokobalt(III)", "dixlorotetraamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, xloro. Co³⁺."
  },
  {
    id: 102,
    question: "[Co(NH₃)₄Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["tetraammindiklorokobalt(III) xlorid", "tetraammindiklorokobalt(II) xlorid", "tetraammindiklorokobalt(III) xlorid", "dixlorotetraamminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation (tetraammindiklorokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺."
  },
  {
    id: 103,
    question: "[Pt(NH₃)₂Cl₂] ning to'g'ri nomini toping.",
    options: ["diammindixloroplatina(II)", "diammindixloroplatina(IV)", "diammindixloroplatina(II)", "dixlorodiamminplatina(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "platina", "ammin", "xloro"],
    explanation: "[Pt(NH₃)₂Cl₂] — neytral kompleks. Ligandlar alifbo tartibida: ammin, xloro. Pt²⁺."
  },
  {
    id: 104,
    question: "[Co(NH₃)₅(H₂O)]³⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkvakobalt(III)", "pentaamminkvakobalt(II)", "pentaamminkvakobalt(III)", "akvapentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "akva"],
    explanation: "[Co(NH₃)₅(H₂O)]³⁺ — kation kompleks. Ligandlar alifbo tartibida: akva, ammin. Co³⁺."
  },
  {
    id: 105,
    question: "[Co(NH₃)₅(NO₂)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) nitro", "pentaamminkobalt(II) nitro", "pentaamminkobalt(III) nitro", "nitropentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "nitro"],
    explanation: "[Co(NH₃)₅(NO₂)]²⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, nitro. Co³⁺."
  },
  {
    id: 106,
    question: "[Co(NH₃)₅(ONO)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) nitrito-O", "pentaamminkobalt(II) nitrito-O", "pentaamminkobalt(III) nitrito-O", "nitrito-O-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "nitrito"],
    explanation: "[Co(NH₃)₅(ONO)]²⁺ — kation kompleks. NO₂⁻ O orqali bog'langan (nitrito-O). Linkage izomerizm."
  },
  {
    id: 107,
    question: "[Co(NH₃)₅(SCN)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) tiotsianato-S", "pentaamminkobalt(II) tiotsianato-S", "pentaamminkobalt(III) tiotsianato-S", "tiotsianato-S-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "tiotsianato"],
    explanation: "[Co(NH₃)₅(SCN)]²⁺ — kation kompleks. SCN⁻ S orqali bog'langan (tiotsianato-S). Ambidentat ligand."
  },
  {
    id: 108,
    question: "[Co(NH₃)₅(NCS)]²⁺ ning to'g'ri nomini toping.",
    options: ["pentaamminkobalt(III) tiotsianato-N", "pentaamminkobalt(II) tiotsianato-N", "pentaamminkobalt(III) tiotsianato-N", "tiotsianato-N-pentaamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "tiotsianato"],
    explanation: "[Co(NH₃)₅(NCS)]²⁺ — kation kompleks. SCN⁻ N orqali bog'langan (tiotsianato-N). Linkage izomerizm."
  },
  {
    id: 109,
    question: "[Co(en)₂Cl₂]⁺ ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)dixlorokobalt(III)", "di(etilendiamin)dixlorokobalt(III)", "bis(etilendiamin)dixlorokobalt(II)", "di(etilendiamin)dixlorokobalt(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "etilendiamin", "xloro"],
    explanation: "[Co(en)₂Cl₂]⁺ — kation kompleks. Polidentat ligand uchun 'bis' prefiksi. Co³⁺."
  },
  {
    id: 110,
    question: "[Co(en)₂Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)dixlorokobalt(III) xlorid", "di(etilendiamin)dixlorokobalt(III) xlorid", "bis(etilendiamin)dixlorokobalt(II) xlorid", "di(etilendiamin)dixlorokobalt(II) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "etilendiamin", "xloro"],
    explanation: "[Co(en)₂Cl₂]⁺ — kation (bis(etilendiamin)dixlorokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺."
  },
  {
    id: 111,
    question: "[Co(NH₃)₄(H₂O)₂]³⁺ ning to'g'ri nomini toping.",
    options: ["tetraammindikvakobalt(III)", "tetraammindikvakobalt(II)", "tetraammindikvakobalt(III)", "diakvatetraamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "akva"],
    explanation: "[Co(NH₃)₄(H₂O)₂]³⁺ — kation kompleks. Ligandlar alifbo tartibida: akva, ammin. Co³⁺."
  },
  {
    id: 112,
    question: "[Co(NH₃)₄(H₂O)₂]Cl₃ ning to'g'ri nomini toping.",
    options: ["tetraammindikvakobalt(III) xlorid", "tetraammindikvakobalt(II) xlorid", "tetraammindikvakobalt(III) xlorid", "diakvatetraamminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "akva"],
    explanation: "[Co(NH₃)₄(H₂O)₂]³⁺ — kation (tetraammindikvakobalt(III)), 3 Cl⁻ — anion (xlorid). Co³⁺."
  },
  {
    id: 113,
    question: "[Co(NH₃)₃Cl₃] ning to'g'ri nomini toping.",
    options: ["triammintrixlorokobalt(III)", "triammintrixlorokobalt(II)", "triammintrixlorokobalt(III)", "trixlorotriamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "xloro"],
    explanation: "[Co(NH₃)₃Cl₃] — neytral kompleks. Ligandlar alifbo tartibida: ammin, xloro. Co³⁺."
  },
  {
    id: 114,
    question: "[Pt(NH₃)₄Cl₂] ning to'g'ri nomini toping.",
    options: ["tetraammindikloroplatina(II)", "tetraammindikloroplatina(IV)", "tetraammindikloroplatina(II)", "dixlorotetraamminplatina(II)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "platina", "ammin", "xloro"],
    explanation: "[Pt(NH₃)₄Cl₂] — neytral kompleks. Ligandlar alifbo tartibida: ammin, xloro. Pt²⁺."
  },
  {
    id: 115,
    question: "[Co(NH₃)₄(C₂O₄)]⁺ ning to'g'ri nomini toping.",
    options: ["tetraamminkobalt(III) oksalato", "tetraamminkobalt(II) oksalato", "tetraamminkobalt(III) oksalato", "oksalatotetraamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "oksalato"],
    explanation: "[Co(NH₃)₄(C₂O₄)]⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, oksalato. Co³⁺."
  },
  {
    id: 116,
    question: "[Co(NH₃)₄(C₂O₄)]Cl ning to'g'ri nomini toping.",
    options: ["tetraamminkobalt(III) oksalato xlorid", "tetraamminkobalt(II) oksalato xlorid", "tetraamminkobalt(III) oksalato xlorid", "oksalatotetraamminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "oksalato"],
    explanation: "[Co(NH₃)₄(C₂O₄)]⁺ — kation (tetraamminkobalt(III) oksalato), Cl⁻ — anion (xlorid). Co³⁺."
  },
  {
    id: 117,
    question: "[Co(en)(NH₃)₂Cl₂]⁺ ning to'g'ri nomini toping.",
    options: ["diammin(etilendiamin)dixlorokobalt(III)", "diammin(etilendiamin)dixlorokobalt(II)", "diammin(etilendiamin)dixlorokobalt(III)", "dixlorodiammin(etilendiamin)kobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "etilendiamin"],
    explanation: "[Co(en)(NH₃)₂Cl₂]⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, etilendiamin, xloro. Co³⁺."
  },
  {
    id: 118,
    question: "[Co(en)(NH₃)₂Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["diammin(etilendiamin)dixlorokobalt(III) xlorid", "diammin(etilendiamin)dixlorokobalt(II) xlorid", "diammin(etilendiamin)dixlorokobalt(III) xlorid", "dixlorodiammin(etilendiamin)kobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "etilendiamin"],
    explanation: "[Co(en)(NH₃)₂Cl₂]⁺ — kation (diammin(etilendiamin)dixlorokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺."
  },
  {
    id: 119,
    question: "[Co(NH₃)₄(NO₂)₂]⁺ ning to'g'ri nomini toping.",
    options: ["tetraammindinitrokobalt(III)", "tetraammindinitrokobalt(II)", "tetraammindinitrokobalt(III)", "dinitrotetraamminkobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "nitro"],
    explanation: "[Co(NH₃)₄(NO₂)₂]⁺ — kation kompleks. Ligandlar alifbo tartibida: ammin, nitro. Co³⁺."
  },
  {
    id: 120,
    question: "[Co(NH₃)₄(NO₂)₂]Cl ning to'g'ri nomini toping.",
    options: ["tetraammindinitrokobalt(III) xlorid", "tetraammindinitrokobalt(II) xlorid", "tetraammindinitrokobalt(III) xlorid", "dinitrotetraamminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "nitro"],
    explanation: "[Co(NH₃)₄(NO₂)₂]⁺ — kation (tetraammindinitrokobalt(III)), Cl⁻ — anion (xlorid). Co³⁺."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-GURUH: QO'SHIMCHA SAVOLLAR (30 ta savol)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 121,
    question: "Kompleks birikma nomini aytishda dastlab nima aytiladi?",
    options: ["anion", "kation", "ligand", "markaziy atom"],
    correct: 1,
    difficulty: "oson",
    tags: ["nomlash", "kation", "anion"],
    explanation: "Kompleks birikma nomini aytishda dastlab kation, keyin anion aytiladi. Masalan: [Co(NH₃)₆]Cl₃ — geksaamminkobalt(III) xlorid."
  },
  {
    id: 122,
    question: "Anion komplekslarda markaziy atom nomiga nima qo'shiladi?",
    options: ["\"it\" qo'shimchasi", "\"at\" qo'shimchasi", "\"id\" qo'shimchasi", "o'zgartirish kiritilmaydi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "ferrat"],
    explanation: "Anion komplekslarda markaziy atom nomiga '-at' qo'shimchasi qo'shiladi. Masalan: temir → ferrat, kobalt → kobaltat."
  },
  {
    id: 123,
    question: "Fe anion kompleksda qanday nomlanadi?",
    options: ["temir", "ferrat", "ferrit", "ferrum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "temir"],
    explanation: "Fe anion kompleksda 'ferrat' deb nomlanadi. Masalan: [Fe(CN)₆]⁴⁻ — geksatsianoferrat(II)."
  },
  {
    id: 124,
    question: "Co anion kompleksda qanday nomlanadi?",
    options: ["kobalt", "kobaltat", "kobaltit", "kobaltum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "kobalt"],
    explanation: "Co anion kompleksda 'kobaltat' deb nomlanadi. Masalan: [Co(CN)₆]³⁻ — geksatsianokobaltat(III)."
  },
  {
    id: 125,
    question: "Cu anion kompleksda qanday nomlanadi?",
    options: ["mis", "kuprat", "kuprit", "kuprum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "mis"],
    explanation: "Cu anion kompleksda 'kuprat' deb nomlanadi. Masalan: [Cu(CN)₄]²⁻ — tetratsianokuprat(II)."
  },
  {
    id: 126,
    question: "Ni anion kompleksda qanday nomlanadi?",
    options: ["nikel", "nikelat", "nikelit", "nikelum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "nikel"],
    explanation: "Ni anion kompleksda 'nikelat' deb nomlanadi. Masalan: [Ni(CN)₄]²⁻ — tetratsianonikelat(II)."
  },
  {
    id: 127,
    question: "Pt anion kompleksda qanday nomlanadi?",
    options: ["platina", "platinat", "platinat", "platinum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "platina"],
    explanation: "Pt anion kompleksda 'platinat' deb nomlanadi. Masalan: [PtCl₆]²⁻ — geksaxloroplatinat(IV)."
  },
  {
    id: 128,
    question: "Cr anion kompleksda qanday nomlanadi?",
    options: ["xrom", "xromat", "xromit", "xromum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "xrom"],
    explanation: "Cr anion kompleksda 'xromat' deb nomlanadi. Masalan: [Cr(CN)₆]³⁻ — geksatsianoxromat(III)."
  },
  {
    id: 129,
    question: "Mn anion kompleksda qanday nomlanadi?",
    options: ["marganets", "manganat", "manganit", "manganum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "marganets"],
    explanation: "Mn anion kompleksda 'manganat' deb nomlanadi. Masalan: [Mn(CN)₆]⁴⁻ — geksatsianomanganat(II)."
  },
  {
    id: 130,
    question: "Ag anion kompleksda qanday nomlanadi?",
    options: ["kumush", "argentat", "argentit", "argentum"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "kumush"],
    explanation: "Ag anion kompleksda 'argentat' deb nomlanadi. Masalan: [Ag(CN)₂]⁻ — ditsianoargentat(I)."
  },
  {
    id: 131,
    question: "Ligandlar qaysi ketma-ketlikda aytiladi?",
    options: ["kation → neytral → anion", "anion → neytral → kation", "neytral → anion → kation", "alfavit tartibida, zaryadga qaralmaydi"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "alifbo"],
    explanation: "Ligandlar alifbo tartibida aytiladi, zaryadga qaralmaydi. Masalan: ammin, xloro (a, x)."
  },
  {
    id: 132,
    question: "[Co(NH₃)₅Cl]²⁺ da ligandlar qaysi tartibda aytiladi?",
    options: ["ammin, xloro", "xloro, ammin", "ammin, xloro (alifbo)", "xloro, ammin (alifbo)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "alifbo"],
    explanation: "Ligandlar alifbo tartibida: ammin (a), xloro (x). 'a' harfi 'x' dan oldin keladi."
  },
  {
    id: 133,
    question: "[Co(NH₃)₄Cl₂]⁺ da ligandlar qaysi tartibda aytiladi?",
    options: ["ammin, xloro", "xloro, ammin", "ammin, xloro (alifbo)", "xloro, ammin (alifbo)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "alifbo"],
    explanation: "Ligandlar alifbo tartibida: ammin (a), xloro (x). 'a' harfi 'x' dan oldin keladi."
  },
  {
    id: 134,
    question: "[Co(NH₃)₅(H₂O)]³⁺ da ligandlar qaysi tartibda aytiladi?",
    options: ["akva, ammin", "ammin, akva", "akva, ammin (alifbo)", "ammin, akva (alifbo)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "alifbo"],
    explanation: "Ligandlar alifbo tartibida: akva (a), ammin (a). 'ak' harfi 'am' dan oldin keladi."
  },
  {
    id: 135,
    question: "[Co(NH₃)₅(NO₂)]²⁺ da ligandlar qaysi tartibda aytiladi?",
    options: ["ammin, nitro", "nitro, ammin", "ammin, nitro (alifbo)", "nitro, ammin (alifbo)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "alifbo"],
    explanation: "Ligandlar alifbo tartibida: ammin (a), nitro (n). 'a' harfi 'n' dan oldin keladi."
  },
  {
    id: 136,
    question: "[Co(en)₃]³⁺ ning koordinatsion soni necha?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["koordinatsion", "etilendiamin", "bidentat"],
    explanation: "en — bidentat ligand (2 donor atom). 3 ta en × 2 = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 137,
    question: "[Co(C₂O₄)₃]³⁻ ning koordinatsion soni necha?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["koordinatsion", "oksalat", "bidentat"],
    explanation: "C₂O₄²⁻ — bidentat ligand (2 donor atom). 3 ta C₂O₄²⁻ × 2 = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 138,
    question: "[Co(acac)₃] ning koordinatsion soni necha?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["koordinatsion", "atsetilasetonat", "bidentat"],
    explanation: "acac⁻ — bidentat ligand (2 donor atom). 3 ta acac⁻ × 2 = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 139,
    question: "[Fe(EDTA)]⁻ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["koordinatsion", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand (6 donor atom: 2 N, 4 O). Koordinatsion son = 6."
  },
  {
    id: 140,
    question: "[Co(en)₂Cl₂]⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["koordinatsion", "etilendiamin", "xloro"],
    explanation: "2 ta en (2 × 2 = 4 donor atom) + 2 ta Cl⁻ (2 × 1 = 2 donor atom) = 6 ta donor atom. Koordinatsion son = 6."
  },
  {
    id: 141,
    question: "sis-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "sis", "oktaedr"],
    explanation: "sis-izomerda bir xil ligandlar 90° burchak ostida joylashgan (qo'shni pozitsiyalar)."
  },
  {
    id: 142,
    question: "trans-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "trans", "oktaedr"],
    explanation: "trans-izomerda bir xil ligandlar 180° burchak ostida joylashgan (qarama-qarshi pozitsiyalar)."
  },
  {
    id: 143,
    question: "fac-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab (meridional)", "Qarama-qarshi", "Tasodifiy"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometrik", "fac", "oktaedr"],
    explanation: "fac-izomerda bir xil ligandlar bir yuzda (facial) joylashgan. Uchta Cl bir uchburchak yuzida."
  },
  {
    id: 144,
    question: "mer-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab (meridional)", "Qarama-qarshi", "Tasodifiy"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "mer", "oktaedr"],
    explanation: "mer-izomerda bir xil ligandlar meridian bo'ylab joylashgan. Uchta Cl bir tekislikda."
  },
  {
    id: 145,
    question: "[Co(en)₃]³⁺ qaysi turdagi izomeriyaga ega?",
    options: ["Geometrik izomeriya", "Optik izomeriya", "Linkage izomeriya", "Koordinatsion izomeriya"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "xelat", "enantiomer"],
    explanation: "[Co(en)₃]³⁺ — optik izomeriyaga ega (Δ va Λ enantiomerlar). Xelat halqalari tufayli xirallik."
  },
  {
    id: 146,
    question: "Δ-[Co(en)₃]³⁺ va Λ-[Co(en)₃]³⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar (enantiomerlar)", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer", "xirallik"],
    explanation: "Δ va Λ — optik izomerlar (enantiomerlar). Ular bir-birining ko'zgudagi aksidir."
  },
  {
    id: 147,
    question: "[Co(NH₃)₅(NO₂)]²⁺ va [Co(NH₃)₅(ONO)]²⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["linkage", "ambidentat", "nitro"],
    explanation: "[Co(NH₃)₅(NO₂)]²⁺ va [Co(NH₃)₅(ONO)]²⁺ — linkage izomerlar. NO₂⁻ ambidentat ligand (N yoki O orqali)."
  },
  {
    id: 148,
    question: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Fe(CN)₆] qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["koordinatsion", "kation", "anion"],
    explanation: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Fe(CN)₆] — koordinatsion izomerlar. Kation va anion o'rin almashgan."
  },
  {
    id: 149,
    question: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]ClBr qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["ionlanish", "kation", "anion"],
    explanation: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]ClBr — ionlanish izomerlar. Cl⁻ va Br⁻ o'rin almashgan (kation ichida va tashqarisida)."
  },
  {
    id: 150,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ va [Co(NH₃)₅Cl]Cl₂·H₂O qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Gidrat izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["gidrat", "kation", "anion"],
    explanation: "[Co(NH₃)₅(H₂O)]Cl₃ va [Co(NH₃)₅Cl]Cl₂·H₂O — gidrat izomerlar. H₂O kation ichida va tashqarisida."
  }
]

export default QUIZ_BANK