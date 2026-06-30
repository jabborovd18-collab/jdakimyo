// app/oquv/video-darsliklar/quiz/nomlanishi/data.js

// ═══════════════════════════════════════════════════════════════════════════════
// NOMLANISH QUIZ — SAVOL BAZASI (150 TA SAVOL) — TAHRIRLANGAN VERSIYA
// ═══════════════════════════════════════════════════════════════════════════════
// Manba: Nasimov A.M., Tashpulatov X.Sh. "Noorganik kimyoning tanlangan boblari"
//        SamDU nashriyoti, 2022 (asosiy adabiyot)
//        IUPAC 1971 Recommendations (an'anaviy nomenklatura)
//        Cotton-Wilkinson "Advanced Inorganic Chemistry"
//
// QABUL QILINGAN KONVENTSIYA:
//  1) Ligandlar tartibi: ANION → NEYTRAL → KATION (har bir guruh ichida alifbo)
//  2) Anion ligandlarga "-o" qo'shimchasi: xloro, siano, okso, gidrokso, nitro
//  3) Anion komplekslarda metallning LOTINCHA o'zagi + "-at":
//     Fe → ferrat, Cu → kuprat, Ag → argentat, Au → aurat, Sn → stannat,
//     Pb → plumbat, Pt → platinat, Ni → nikelat, Co → kobaltat, Cr → xromat,
//     Mn → manganat, Zn → sinkat, Al → aluminat
//  4) Kation va neytral komplekslarda metall O'ZBEKCHA: mis, temir, kumush,
//     oltin, qoʻrgʻoshin, qalay, kobalt, nikel, platina, xrom, marganets, sink
//  5) Polidentat yoki murakkab nomli ligandlar uchun bis-, tris-, tetrakis-
//  6) Markaziy atom oksidlanish darajasi qavsda rim raqami bilan: (II), (III)
//  7) Nol oksidlanish darajasi (0) ko'rsatiladi: tetrakarbonilnikel(0)
//
// 6 GURUH: ligandlar / kation komplekslar / anion komplekslar /
//          oksidlanish darajasi / polidentat / aralash + izomeriya
// ═══════════════════════════════════════════════════════════════════════════════

export const QUIZ_BANK = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1-GURUH: LIGAND NOMLARI (30 ta savol) — IDs 1–30
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    question: "H₂O ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["gidro", "okso", "akva", "gidroksoniy"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "akva", "neytral"],
    explanation: "H₂O — neytral ligand, IUPAC bo'yicha 'akva' (lot. aqua) deb nomlanadi. Metall bilan O atomi orqali bog'lanadi."
  },
  {
    id: 2,
    question: "NH₃ ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["amid", "ammin", "amin", "ammoniy"],
    correct: 1,
    difficulty: "oson",
    tags: ["ligand", "ammin", "neytral"],
    explanation: "NH₃ ligandi 'ammin' (ikki 'm' bilan) deb nomlanadi — bu organik 'amin' (bitta 'm') dan farqlanadi. Neytral ligand, N orqali bog'lanadi."
  },
  {
    id: 3,
    question: "CN⁻ ligandi qanday nomlanadi?",
    options: ["sian", "sianid", "sianato", "siano"],
    correct: 3,
    difficulty: "oson",
    tags: ["ligand", "siano", "anion"],
    explanation: "CN⁻ — anion ligand, 'siano' deb nomlanadi. Odatda C atomi orqali bog'lanadi (ambidentat: izosiano — N orqali)."
  },
  {
    id: 4,
    question: "CO ligandi IUPAC bo'yicha qanday nomlanadi?",
    options: ["karbonat", "karboksil", "karbonil", "karbid"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "karbonil", "neytral"],
    explanation: "CO — neytral ligand, 'karbonil' deb nomlanadi. C atomi orqali bog'lanadi. Misol: [Ni(CO)₄] — tetrakarbonilnikel(0)."
  },
  {
    id: 5,
    question: "Cl⁻ ligandi kompleks birikmada qanday nomlanadi?",
    options: ["xloro", "xlor", "xlorid", "xlorit"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand", "xloro", "anion"],
    explanation: "Cl⁻ — anion ligand, kompleksda 'xloro' deb nomlanadi. Tuz tarkibidagi tashqi sferada esa 'xlorid' deyiladi."
  },
  {
    id: 6,
    question: "OH⁻ ligandi qanday nomlanadi?",
    options: ["gidroksil", "gidroksid", "gidrokso", "gidrid"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "gidrokso", "anion"],
    explanation: "OH⁻ — anion ligand, 'gidrokso' deb nomlanadi. O atomi orqali bog'lanadi. H⁻ esa 'gidrido' (anion, faqat H)."
  },
  {
    id: 7,
    question: "NO₂⁻ ligandi N atomi orqali bog'langanda qanday nomlanadi?",
    options: ["nitrito", "nitro", "nitrozil", "nitrato"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "nitro", "linkage"],
    explanation: "NO₂⁻ ambidentat ligand: N orqali — 'nitro' (M–NO₂), O orqali — 'nitrito' (M–ONO). Bu bog'lanish (linkage) izomeriyasini beradi."
  },
  {
    id: 8,
    question: "NO₂⁻ ligandi O atomi orqali bog'langanda qanday nomlanadi?",
    options: ["nitro", "nitrozil", "nitrito", "nitrat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand", "nitrito", "linkage"],
    explanation: "O atomi orqali bog'langan NO₂⁻ — 'nitrito' (–ONO). N orqali bog'langani — 'nitro'. Bu ikkisi linkage izomerlar."
  },
  {
    id: 9,
    question: "SCN⁻ ligandi S atomi orqali bog'langanda qanday nomlanadi?",
    options: ["izotiosianato", "tiosianid", "tio", "tiosianato"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["ligand", "tiosianato", "linkage"],
    explanation: "SCN⁻ S orqali bog'langanda 'tiosianato' (M–SCN), N orqali bog'langanda 'izotiosianato' (M–NCS) deb nomlanadi. Ambidentat ligand."
  },
  {
    id: 10,
    question: "SCN⁻ ligandi N atomi orqali bog'langanda qanday nomlanadi?",
    options: ["tiosianato", "izotiosianato", "sianato", "tio"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "izotiosianato", "linkage"],
    explanation: "N orqali bog'langan SCN⁻ — 'izotiosianato' (M–NCS). S orqali bog'langani — 'tiosianato' (M–SCN). Linkage izomerlar."
  },
  {
    id: 11,
    question: "F⁻ ligandi qanday nomlanadi?",
    options: ["ftoro", "ftor", "ftorid", "ftorat"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand", "ftoro", "anion"],
    explanation: "F⁻ — anion ligand, kompleks ichida 'ftoro' deb nomlanadi. Tashqi sferada esa 'ftorid'."
  },
  {
    id: 12,
    question: "Br⁻ ligandi qanday nomlanadi?",
    options: ["brom", "bromid", "bromat", "bromo"],
    correct: 3,
    difficulty: "oson",
    tags: ["ligand", "bromo", "anion"],
    explanation: "Br⁻ — anion ligand, 'bromo' deb nomlanadi. Tashqi sferada 'bromid'."
  },
  {
    id: 13,
    question: "I⁻ ligandi qanday nomlanadi?",
    options: ["yod", "yodid", "yodo", "yodat"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "yodo", "anion"],
    explanation: "I⁻ — anion ligand, 'yodo' deb nomlanadi. Tashqi sferada 'yodid'."
  },
  {
    id: 14,
    question: "O²⁻ ligandi qanday nomlanadi?",
    options: ["oksid", "okso", "peroksid", "gidroksid"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "okso", "anion"],
    explanation: "O²⁻ — anion ligand, 'okso' deb nomlanadi. Misol: [MnO₄]⁻ — tetraoksomanganat(VII)."
  },
  {
    id: 15,
    question: "S²⁻ ligandi qanday nomlanadi?",
    options: ["tio", "sulfid", "sulfato", "sulfit"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "tio", "anion"],
    explanation: "S²⁻ — anion ligand, 'tio' deb nomlanadi (yunoncha θεῖον — oltingugurt). Misol: [MoS₄]²⁻ — tetratiomolibdat(VI)."
  },
  {
    id: 16,
    question: "NO⁺ ligandi qanday nomlanadi?",
    options: ["nitro", "nitrito", "nitrozil", "nitrat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand", "nitrozil", "kation"],
    explanation: "NO⁺ — kation ligand, 'nitrozil' deb nomlanadi. NO₂⁻ esa 'nitro' (N orqali) yoki 'nitrito' (O orqali) bo'ladi."
  },
  {
    id: 17,
    question: "C₅H₅⁻ (siklopentadienil-anion) ligandi qanday nomlanadi?",
    options: ["siklopentadien", "pentametildien", "siklopentadienil", "siklopentil"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand", "siklopentadienil", "anion"],
    explanation: "C₅H₅⁻ — 'siklopentadienil' (Cp), η⁵-koordinatsiya (pentahapto). Misol: ferrotsen [Fe(η⁵-C₅H₅)₂]."
  },
  {
    id: 18,
    question: "en (etilendiamin, H₂N–CH₂–CH₂–NH₂) qanday turdagi ligand?",
    options: ["monodentat neytral", "bidentat anion", "bidentat neytral", "tridentat neytral"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand", "etilendiamin", "bidentat"],
    explanation: "en — bidentat NEYTRAL ligand: ikkita N atomi orqali metallga koordinatsiyalanadi va 5-a'zoli xelat halqasi hosil qiladi."
  },
  {
    id: 19,
    question: "C₂O₄²⁻ (oksalat) ligandi qanday nomlanadi?",
    options: ["oksalato", "oksal", "oksid", "perokso"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "oksalato", "bidentat"],
    explanation: "C₂O₄²⁻ — bidentat anion ligand, 'oksalato' deb nomlanadi. Ikkita O atomi orqali bog'lanadi va 5-a'zoli xelat halqa hosil qiladi."
  },
  {
    id: 20,
    question: "acac⁻ (atsetilasetonat) qanday turdagi ligand?",
    options: ["monodentat anion", "bidentat anion", "bidentat neytral", "tridentat anion"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "atsetilasetonato", "bidentat"],
    explanation: "acac⁻ ([CH₃COCHCOCH₃]⁻) — bidentat anion ligand, ikkita O atomi orqali bog'lanib, 6-a'zoli xelat halqa hosil qiladi."
  },
  {
    id: 21,
    question: "py (piridin, C₅H₅N) qanday turdagi ligand?",
    options: ["bidentat neytral", "monodentat anion", "kation", "monodentat neytral"],
    correct: 3,
    difficulty: "oson",
    tags: ["ligand", "piridin", "neytral"],
    explanation: "py — monodentat NEYTRAL ligand, N atomi orqali bog'lanadi. Nomda ham 'piridin' deyiladi."
  },
  {
    id: 22,
    question: "phen (1,10-fenantrolin) qanday turdagi ligand?",
    options: ["bidentat neytral", "monodentat neytral", "tridentat", "bidentat anion"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "fenantrolin", "bidentat"],
    explanation: "phen — bidentat NEYTRAL ligand, ikkita N atomi (1- va 10-holatda) orqali bog'lanadi. Tetraedrik va oktaedrik komplekslar uchun keng qo'llaniladi."
  },
  {
    id: 23,
    question: "EDTA⁴⁻ ligandi nechta donor atomga ega va qanday turda?",
    options: ["4 ta donor, tetradentat", "8 ta donor, oktadentat", "6 ta donor, geksadentat", "2 ta donor, bidentat"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["ligand", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat anion ligand: 2 ta N atomi va 4 ta karboksilat O atomi (jami 6 donor) orqali bog'lanadi."
  },
  {
    id: 24,
    question: "PPh₃ (trifenilfosfin) qanday turdagi ligand?",
    options: ["monodentat neytral, P-donor", "bidentat neytral", "monodentat anion", "tridentat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "trifenilfosfin", "neytral"],
    explanation: "PPh₃ — monodentat NEYTRAL ligand, P atomi orqali bog'lanadi. π-akseptor xususiyatga ega, past oksidlanish darajalardagi metallarni barqarorlashtiradi."
  },
  {
    id: 25,
    question: "NO₃⁻ ligandi qanday nomlanadi?",
    options: ["nitro", "nitrato", "nitrito", "nitrozil"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand", "nitrato", "anion"],
    explanation: "NO₃⁻ — anion ligand, 'nitrato' deb nomlanadi. Monodentat yoki bidentat bo'lib koordinatsiyalanishi mumkin."
  },
  {
    id: 26,
    question: "SO₄²⁻ ligandi qanday nomlanadi?",
    options: ["sulfato", "sulfit", "tio", "sulfid"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "sulfato", "anion"],
    explanation: "SO₄²⁻ — anion ligand, 'sulfato' deb nomlanadi. Tashqi sferada 'sulfat'. Monodentat yoki bidentat bo'lishi mumkin."
  },
  {
    id: 27,
    question: "CO₃²⁻ ligandi qanday nomlanadi?",
    options: ["karbonato", "karbonil", "karbid", "karboksilato"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "karbonato", "anion"],
    explanation: "CO₃²⁻ — anion ligand, 'karbonato' deb nomlanadi. CO (neytral) — 'karbonil' bilan adashtirmaslik kerak."
  },
  {
    id: 28,
    question: "CH₃COO⁻ (atsetat) ligandi qanday nomlanadi?",
    options: ["atsetil", "atsetat", "etanoil", "atsetato"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["ligand", "atsetato", "anion"],
    explanation: "CH₃COO⁻ — anion ligand, kompleks ichida 'atsetato' deb nomlanadi. Tashqi sferada 'atsetat'."
  },
  {
    id: 29,
    question: "Quyidagilardan qaysisi BIDENTAT ligand emas?",
    options: ["etilendiamin (en)", "oksalat (C₂O₄²⁻)", "ammin (NH₃)", "fenantrolin (phen)"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand", "bidentat", "monodentat"],
    explanation: "NH₃ (ammin) — MONODENTAT ligand, faqat bitta N atomi orqali bog'lanadi. Boshqa uchtasi — bidentat (ikkita donor)."
  },
  {
    id: 30,
    question: "H⁻ (gidrid) ligandi qanday nomlanadi?",
    options: ["gidrido", "gidro", "gidrokso", "gidrogen"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand", "gidrido", "anion"],
    explanation: "H⁻ — anion ligand, 'gidrido' deb nomlanadi. OH⁻ esa 'gidrokso' — bu ikkisini farqlash muhim."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2-GURUH: KATION KOMPLEKSLAR (25 ta savol) — IDs 31–55
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 31,
    question: "[Ag(NH₃)₂]Cl ning IUPAC bo'yicha nomi qanday?",
    options: ["diamminkumush xlorid", "diamminkumush(II) xlorid", "kumush diamminxlorid", "diammargentum xlorid"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "kumush", "ammin", "xlorid"],
    explanation: "Ag oksidlanish darajasi +1 (NH₃ — neytral, umumiy zaryad +1). Kumush uchun +1 yagona va odatiy oksidlanish darajasi bo'lgani uchun rim raqami ko'rsatilmasligi mumkin: diamminkumush xlorid."
  },
  {
    id: 32,
    question: "[Co(NH₃)₆]Cl₃ ning to'g'ri nomini toping.",
    options: ["geksaamminkobalt(II) xlorid", "kobalt(III) geksaamminxlorid", "geksaamminxlorokobalt(III)", "geksaamminkobalt(III) xlorid"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["kation", "kobalt", "ammin", "xlorid"],
    explanation: "[Co(NH₃)₆]³⁺ — kation. NH₃ neytral, 3 Cl⁻ tashqi sferada. Co + 0 = +3, ya'ni Co(III). To'g'ri nomi: geksaamminkobalt(III) xlorid."
  },
  {
    id: 33,
    question: "[Cu(NH₃)₄]SO₄ ning IUPAC nomi qanday?",
    options: ["tetraamminkumush(II) sulfat", "tetraamminmis(II) sulfat", "tetraamminmis(I) sulfat", "tetraamminkuprum sulfat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kation", "mis", "ammin", "sulfat"],
    explanation: "Cu = MIS (kumush emas, kumush = Ag). NH₃ neytral, SO₄²⁻ tashqi sferada. Cu²⁺. To'g'ri nomi: tetraamminmis(II) sulfat."
  },
  {
    id: 34,
    question: "[Co(NH₃)₅Cl]Cl₂ ning to'g'ri nomini toping.",
    options: ["pentaamminxlorokobalt(II) xlorid", "pentaamminkobalt(III) trixlorid", "pentaxloroamminkobalt(III)", "xloropentaamminkobalt(III) xlorid"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "xloro"],
    explanation: "Kitobning tartibi: ANION ligand oldin (xloro), keyin NEYTRAL (ammin). [Co(NH₃)₅Cl]²⁺ — kation, 2 Cl⁻ — tashqi sfera. Co + (-1) = +2 → Co = +3. Nomi: xloropentaamminkobalt(III) xlorid."
  },
  {
    id: 35,
    question: "[Pt(NH₃)₄Cl₂]Cl₂ ning to'g'ri nomini toping.",
    options: ["tetraammindikloroplatina(II) xlorid", "dixlorotetraamminplatina(IV) xlorid", "platina tetraammindixlorid", "dixlorotetraamminplatina(II)"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["kation", "platina", "ammin", "xloro"],
    explanation: "[Pt(NH₃)₄Cl₂]²⁺ — kation, 2 Cl⁻ tashqi sferada. Pt + 4(0) + 2(-1) = +2 → Pt = +4. Anion oldin: dixlorotetraamminplatina(IV) xlorid."
  },
  {
    id: 36,
    question: "[Cr(NH₃)₆]Cl₃ ning to'g'ri nomini toping.",
    options: ["geksaamminxrom(II) xlorid", "geksaamminxrom(III) xlorid", "xrom geksaamminxlorid", "geksaamminxromat(III)"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kation", "xrom", "ammin"],
    explanation: "[Cr(NH₃)₆]³⁺ — kation. 3 Cl⁻ tashqi sferada. Cr³⁺. Kation kompleksda metall o'zbekcha — xrom. Nomi: geksaamminxrom(III) xlorid."
  },
  {
    id: 37,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ ning to'g'ri nomini toping.",
    options: ["akvapentaamminkobalt(III) xlorid", "pentaamminakvakobalt(III) xlorid", "kobalt(III) pentaamminakvaxlorid", "pentaamminkobalt(III) akvaxlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "akva", "ammin"],
    explanation: "Ikkala ligand ham NEYTRAL — alifbo tartibi qo'llaniladi: akva (a-k-v) keyin ammin (a-m-m). [Co(NH₃)₅(H₂O)]³⁺. Co³⁺. Nomi: akvapentaamminkobalt(III) xlorid."
  },
  {
    id: 38,
    question: "[Cu(en)₂]SO₄ ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)mis(II) sulfat", "bis(etilendiamin)mis(I) sulfat", "di(etilendiamin)mis(II) sulfat", "bisetilendiaminmis(II) sulfat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "mis", "etilendiamin", "polidentat"],
    explanation: "en — polidentat ligand bo'lgani uchun 'bis-' prefiksi va qavs ishlatiladi. [Cu(en)₂]²⁺ — kation, SO₄²⁻ — tashqi. Cu²⁺. Nomi: bis(etilendiamin)mis(II) sulfat."
  },
  {
    id: 39,
    question: "[Co(en)₃]Cl₃ ning to'g'ri nomini toping.",
    options: ["trietilendiaminkobalt(III) xlorid", "tris(etilendiamin)kobalt(II) xlorid", "tris(etilendiamin)kobalt(III) xlorid", "geksaaminkobalt(III) xlorid"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "etilendiamin", "polidentat"],
    explanation: "3 ta en polidentat ligand → 'tris-' va qavs. [Co(en)₃]³⁺ — kation, 3 Cl⁻ — tashqi. Co³⁺. Nomi: tris(etilendiamin)kobalt(III) xlorid."
  },
  {
    id: 40,
    question: "[Al(H₂O)₆]Cl₃ ning to'g'ri nomini toping.",
    options: ["geksaakvaaluminiy(III) xlorid", "geksaakvaaluminat(III) xlorid", "geksaakvaaluminiy xlorid", "aluminiy geksaakvaxlorid"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["kation", "aluminiy", "akva"],
    explanation: "Al uchun +3 yagona barqaror oksidlanish darajasi, shu sababli rim raqami yozilmaydi. [Al(H₂O)₆]³⁺. Nomi: geksaakvaaluminiy xlorid (kitob varianti)."
  },
  {
    id: 41,
    question: "[Cr(H₂O)₆]Cl₃ ning to'g'ri nomini toping.",
    options: ["geksaakvaxrom(III) xlorid", "geksaakvaxrom(II) xlorid", "xrom(III) geksaakvaxlorid", "geksaakvaxromat(III)"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kation", "xrom", "akva"],
    explanation: "H₂O neytral, 3 Cl⁻ — tashqi. Cr + 0 = +3 → Cr(III). Nomi: geksaakvaxrom(III) xlorid."
  },
  {
    id: 42,
    question: "[Fe(H₂O)₆]SO₄ ning to'g'ri nomini toping.",
    options: ["geksaakvatemir(III) sulfat", "geksaakvaferrat(II) sulfat", "geksaakvatemir(II) sulfat", "temir(II) geksaakvasulfat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["kation", "temir", "akva"],
    explanation: "SO₄²⁻ tashqi sferada → kation zaryadi +2. H₂O neytral, demak Fe²⁺. Kation kompleksda temir o'zbekcha. Nomi: geksaakvatemir(II) sulfat."
  },
  {
    id: 43,
    question: "[Co(NH₃)₄Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["dixlorotetraamminkobalt(III) xlorid", "dixlorotetraamminkobalt(II) xlorid", "tetraammindixlorokobalt(III) xlorid", "kobalt(III) tetraammindixlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "xloro"],
    explanation: "Tartib: ANION oldin (xloro), keyin NEYTRAL (ammin). [Co(NH₃)₄Cl₂]⁺ — kation. Co + 4(0) + 2(-1) = +1 → Co = +3. Nomi: dixlorotetraamminkobalt(III) xlorid."
  },
  {
    id: 44,
    question: "[Co(NH₃)₄Br(H₂O)](NO₃)₂ ning to'g'ri nomini toping.",
    options: ["akvabromtetraamminkobalt(III) nitrat", "bromoakvatetraamminkobalt(III) nitrat", "tetraamminbromoakvakobalt(III) nitrat", "bromoakvatetraamminkobaltat(III) nitrat"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "bromo", "akva"],
    explanation: "Anion (bromo) → neytrallar (akva, ammin alifbo bo'yicha). 2 NO₃⁻ tashqi sferada → kation zaryadi +2. Co + (-1) + 0 + 0 = +2 → Co = +3. Nomi: bromoakvatetraamminkobalt(III) nitrat."
  },
  {
    id: 45,
    question: "[Ni(CO)₄] ning to'g'ri nomini toping (neytral kompleks).",
    options: ["tetrakarbonilnikelat(0)", "tetrakarbonilnikel(IV)", "tetrakarbonilnikel(0)", "nikel tetrakarbonil"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["neytral", "nikel", "karbonil"],
    explanation: "[Ni(CO)₄] — neytral kompleks, anion emas, demak nikelat emas. CO neytral, umumiy zaryad 0 → Ni(0). Nomi: tetrakarbonilnikel(0)."
  },
  {
    id: 46,
    question: "[Fe(CO)₅] ning to'g'ri nomini toping.",
    options: ["pentakarbonilferrat(0)", "pentakarboniltemir(II)", "temir pentakarbonil", "pentakarboniltemir(0)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["neytral", "temir", "karbonil"],
    explanation: "Neytral kompleks, demak ferrat emas — temir. CO neytral, Fe(0). Nomi: pentakarboniltemir(0)."
  },
  {
    id: 47,
    question: "[Pt(NH₃)₂Cl₂] ning to'g'ri nomini toping (neytral, sisplatin).",
    options: ["diammindixloroplatina(II)", "dixlorodiamminplatina(IV)", "dixlorodiamminplatina(II)", "platina(II) diammindixlorid"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["neytral", "platina", "ammin", "xloro"],
    explanation: "Tartib: ANION (xloro) oldin, NEYTRAL (ammin) keyin. Umumiy zaryad 0: Pt + 2(0) + 2(-1) = 0 → Pt = +2. Nomi: dixlorodiamminplatina(II) (sisplatin — antishish dori)."
  },
  {
    id: 48,
    question: "[Co(NH₃)₃Cl₃] ning to'g'ri nomini toping (neytral kompleks).",
    options: ["trixlorotriamminkobalt(III)", "triammintrixlorokobalt(III)", "trixlorotriamminkobalt(II)", "kobalt(III) trixlorotriammin"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["neytral", "kobalt", "ammin", "xloro"],
    explanation: "ANION oldin: trixloro, keyin NEYTRAL: triammin. Umumiy zaryad 0 → Co = +3. fac- va mer- izomerlari mavjud."
  },
  {
    id: 49,
    question: "[Co(en)₂Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["bis(etilendiamin)dixlorokobalt(III) xlorid", "dixlorobis(etilendiamin)kobalt(III) xlorid", "di(etilendiamin)dixlorokobalt(III) xlorid", "dixloro(etilendiamin)kobalt(III) xlorid"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "etilendiamin", "xloro"],
    explanation: "ANION oldin (dixloro), keyin POLIDENTAT (bis(etilendiamin)). Kation, 1 Cl⁻ tashqi. Co + (-2) + 0 = +1 → Co = +3. Nomi: dixlorobis(etilendiamin)kobalt(III) xlorid."
  },
  {
    id: 50,
    question: "[Co(NH₃)₅(NO₂)]Cl₂ ning to'g'ri nomini toping (nitro-izomer).",
    options: ["pentaamminnitrokobalt(III) xlorid", "nitropentaamminkobalt(III) xlorid", "pentaamminnitritokobalt(III) xlorid", "nitritopentaamminkobalt(III) xlorid"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "nitro"],
    explanation: "ANION (nitro, N orqali) oldin → NEYTRAL (ammin). Kation, 2 Cl⁻ tashqi. Co + (-1) + 0 = +2 → Co = +3. Nomi: nitropentaamminkobalt(III) xlorid."
  },
  {
    id: 51,
    question: "[Co(NH₃)₅(ONO)]Cl₂ ning to'g'ri nomini toping (nitrito-izomer).",
    options: ["nitritopentaamminkobalt(III) xlorid", "pentaamminnitritokobalt(III) xlorid", "nitropentaamminkobalt(III) xlorid", "pentaamminnitrokobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "nitrito", "linkage"],
    explanation: "NO₂⁻ O orqali bog'langan → 'nitrito'. ANION oldin → NEYTRAL. Nomi: nitritopentaamminkobalt(III) xlorid. Bu nitro-izomer (#50) ning linkage izomeri."
  },
  {
    id: 52,
    question: "[Co(NH₃)₅(SCN)]Cl₂ ning to'g'ri nomini toping (S orqali).",
    options: ["pentaammintiosianatokobalt(III) xlorid", "izotiosianatopentaamminkobalt(III) xlorid", "tiosianatopentaamminkobalt(III) xlorid", "pentaamminizotiosianatokobalt(III) xlorid"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "tiosianato"],
    explanation: "SCN⁻ S orqali bog'langan → 'tiosianato'. ANION oldin → NEYTRAL. Nomi: tiosianatopentaamminkobalt(III) xlorid."
  },
  {
    id: 53,
    question: "[Co(NH₃)₅(NCS)]Cl₂ ning to'g'ri nomini toping (N orqali).",
    options: ["tiosianatopentaamminkobalt(III) xlorid", "nitropentaamminkobalt(III) xlorid", "izotiosianatopentaamminkobalt(III) xlorid", "izotiosianatopentaamminkobalt(II) xlorid"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kation", "kobalt", "ammin", "izotiosianato", "linkage"],
    explanation: "NCS⁻ — SCN⁻ ning N orqali bog'langan shakli → 'izotiosianato'. Bu #52 ning linkage izomeri."
  },
  {
    id: 54,
    question: "[FeCl(H₂O)₅]Cl ning to'g'ri nomini toping.",
    options: ["pentaakvaxlorotemir(II) xlorid", "xloropentaakvaferrat(II) xlorid", "xloropentaakvatemir(II) xlorid", "temir(II) xloropentaakvaxlorid"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kation", "temir", "xloro", "akva"],
    explanation: "ANION (xloro) oldin → NEYTRAL (akva). Kation, 1 Cl⁻ tashqi. Fe + (-1) + 0 = +1 → Fe = +2. Nomi: xloropentaakvatemir(II) xlorid."
  },
  {
    id: 55,
    question: "[Co(NH₃)₆][Cr(CN)₆] ning to'g'ri nomini toping (kation + anion kompleks).",
    options: ["geksaamminkobalt(III) geksasianoxrom(III)", "geksaamminkobaltat(III) geksasianokromat(III)", "geksasianokromat(III) geksaamminkobalt(III)", "geksaamminkobalt(III) geksasianokromat(III)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["kation", "anion", "kobalt", "xrom", "siano"],
    explanation: "[Co(NH₃)₆]³⁺ — kation (kobalt o'zbekcha), [Cr(CN)₆]³⁻ — anion (xrom + lotin -at = kromat). Avval kation, keyin anion."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3-GURUH: ANION KOMPLEKSLAR (25 ta savol) — IDs 56–80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 56,
    question: "[Fe(CN)₆]⁴⁻ ioni qanday nomlanadi?",
    options: ["geksasianoferrat(II)", "geksasianotemir(II)", "geksasianoferrat(III)", "geksasianotemir(IV)"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["anion", "temir", "siano", "ferrat"],
    explanation: "Anion kompleksda Fe → ferrat (lotin Ferrum + -at). 6(-1) + Fe = -4 → Fe = +2. Nomi: geksasianoferrat(II) (sariq qon tuzi anioni)."
  },
  {
    id: 57,
    question: "K₄[Fe(CN)₆] ning to'g'ri nomini toping.",
    options: ["kaliy geksasianoferrat(III)", "kaliy geksasianotemir(II)", "tetrakaliy geksasianoferrat", "kaliy geksasianoferrat(II)"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["anion", "temir", "siano", "kaliy"],
    explanation: "Avval kation (kaliy), keyin anion. [Fe(CN)₆]⁴⁻ → geksasianoferrat(II). To'liq nomi: kaliy geksasianoferrat(II) — 'sariq qon tuzi'."
  },
  {
    id: 58,
    question: "K₃[Fe(CN)₆] ning to'g'ri nomini toping.",
    options: ["kaliy geksasianoferrat(II)", "kaliy geksasianoferrat(III)", "trikaliy geksasianotemir(III)", "kaliy geksasianoferrat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["anion", "temir", "siano", "kaliy"],
    explanation: "6(-1) + Fe = -3 → Fe = +3. Nomi: kaliy geksasianoferrat(III) — 'qizil qon tuzi' (qon analizida ishlatiladi)."
  },
  {
    id: 59,
    question: "K₂[PtCl₆] ning to'g'ri nomini toping.",
    options: ["kaliy geksaxloroplatinat(II)", "kaliy geksaxloroplatina(IV)", "dikaliy geksaxloroplatinat", "kaliy geksaxloroplatinat(IV)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["anion", "platina", "xloro", "kaliy"],
    explanation: "6(-1) + Pt = -2 → Pt = +4. Anion kompleksda Pt → platinat. Nomi: kaliy geksaxloroplatinat(IV)."
  },
  {
    id: 60,
    question: "K₂[PtCl₄] ning to'g'ri nomini toping.",
    options: ["kaliy tetraxloroplatinat(II)", "kaliy tetraxloroplatinat(IV)", "kaliy tetraxloroplatina(II)", "dikaliy tetraxloroplatinat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["anion", "platina", "xloro", "kaliy"],
    explanation: "4(-1) + Pt = -2 → Pt = +2. Nomi: kaliy tetraxloroplatinat(II). Bu kvadrat-tekis kompleks (d⁸)."
  },
  {
    id: 61,
    question: "K₂[CuCl₄] ning to'g'ri nomini toping.",
    options: ["kaliy tetraxlorokuprat(II)", "kaliy tetraxlorokuprat(I)", "kaliy tetraxloromis(II)", "dikaliy tetraxlorokuprum"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["anion", "mis", "xloro", "kuprat"],
    explanation: "Anion kompleksda Cu → kuprat (lot. Cuprum). 4(-1) + Cu = -2 → Cu = +2. Nomi: kaliy tetraxlorokuprat(II)."
  },
  {
    id: 62,
    question: "K₂[CuCl₃] ning to'g'ri nomini toping.",
    options: ["kaliy trixlorokuprat(I)", "kaliy trixlorokuprat(II)", "kaliy trixloromis(I)", "dikaliy trixlorokuprum"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "mis", "xloro", "kuprat"],
    explanation: "3(-1) + Cu = -2 → Cu = +1. Cu(I) holatda kompleks Cu²⁺ ga qaraganda kamroq uchraydi, lekin xlorid bilan mavjud."
  },
  {
    id: 63,
    question: "K₂[SnF₆] ning to'g'ri nomini toping.",
    options: ["kaliy geksaftorostannat(II)", "kaliy geksaftorostannat(IV)", "kaliy geksaftoroqalay(IV)", "kaliy geksaftorostannit"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["anion", "qalay", "ftoro", "stannat"],
    explanation: "Anion kompleksda Sn → stannat (lot. Stannum). 6(-1) + Sn = -2 → Sn = +4. Nomi: kaliy geksaftorostannat(IV)."
  },
  {
    id: 64,
    question: "K₂[Zn(OH)₄] ning to'g'ri nomini toping.",
    options: ["kaliy tetragidroksosinkat(II)", "kaliy tetragidroksosinkat", "kaliy tetragidroksosink(II)", "dikaliy tetragidroksosink"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["anion", "sink", "gidrokso", "sinkat"],
    explanation: "Anion kompleksda Zn → sinkat. Zn faqat +2 oksidlanish darajasiga ega bo'lgani uchun rim raqami yozilmasligi mumkin: kaliy tetragidroksosinkat."
  },
  {
    id: 65,
    question: "Na[Ag(CN)₂] ning to'g'ri nomini toping.",
    options: ["natriy disianoargentat(I)", "natriy disianokumush(I)", "natriy disianoargentat", "natriy disianoargentit"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["anion", "kumush", "siano", "argentat"],
    explanation: "Anion kompleksda Ag → argentat (lot. Argentum). Ag faqat +1 holatda bo'lgani uchun rim raqami ko'rsatilmasligi mumkin: natriy disianoargentat."
  },
  {
    id: 66,
    question: "K₃[Cr(C₂O₄)₃] ning to'g'ri nomini toping.",
    options: ["kaliy trioksalatoxromat(III)", "kaliy tris(oksalato)xrom(III)", "trikaliy tris(oksalato)xromat", "kaliy tris(oksalato)xromat(III)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["anion", "xrom", "oksalato", "polidentat"],
    explanation: "3 ta bidentat ligand → 'tris-' va qavs. 3(-2) + Cr = -3 → Cr = +3. Anion: kromat. Nomi: kaliy tris(oksalato)xromat(III)."
  },
  {
    id: 67,
    question: "K₃[Co(C₂O₄)₃] ning to'g'ri nomini toping.",
    options: ["kaliy tris(oksalato)kobaltat(III)", "kaliy trioksalatokobaltat(III)", "kaliy tris(oksalato)kobalt(III)", "trikaliy tris(oksalato)kobaltat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "kobalt", "oksalato", "polidentat"],
    explanation: "Anion kompleksda Co → kobaltat. 3(-2) + Co = -3 → Co = +3. Nomi: kaliy tris(oksalato)kobaltat(III)."
  },
  {
    id: 68,
    question: "Na₂[PtCl₂(C₂O₄)₂] ning to'g'ri nomini toping.",
    options: ["natriy bis(oksalato)dixloroplatinat(IV)", "natriy dixlorobis(oksalato)platina(IV)", "natriy dixlorobis(oksalato)platinat(IV)", "natriy dixlorodioksalatoplatinat(IV)"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["anion", "platina", "xloro", "oksalato", "polidentat"],
    explanation: "ANION oldin alifboda: dixloro keyin bis(oksalato). 2(-1) + 2(-2) + Pt = -2 → Pt = +4. Nomi: natriy dixlorobis(oksalato)platinat(IV) (kitobning aniq misoli)."
  },
  {
    id: 69,
    question: "K[Fe(EDTA)] ning to'g'ri nomini toping.",
    options: ["kaliy etilendiamintetraatsetatotemir(III)", "kaliy EDTA-ferrat(II)", "kaliy etilendiamintetraatsetatoferrat(II)", "kaliy etilendiamintetraatsetatoferrat(III)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["anion", "temir", "EDTA", "ferrat", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat. (-4) + Fe = -1 → Fe = +3. Anion → ferrat. Nomi: kaliy etilendiamintetraatsetatoferrat(III)."
  },
  {
    id: 70,
    question: "[Ag(NH₃)₂][Ag(CN)₂] ning to'g'ri nomini toping.",
    options: ["diamminargentat disianokumush", "diamminkumush disianoargentat", "bis(ammin)kumush bis(siano)argentat", "diamminkumush(I) disianoargentat(I)"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["kation", "anion", "kumush", "ammin", "siano"],
    explanation: "Kation [Ag(NH₃)₂]⁺ — diamminkumush (o'zbekcha), anion [Ag(CN)₂]⁻ — disianoargentat (lotin -at). Ag(I) bo'lgani uchun rim raqami yozilmaydi (kitob varianti)."
  },
  {
    id: 71,
    question: "Na₂[Ni(CN)₄] ning to'g'ri nomini toping.",
    options: ["natriy tetrasianonikel(II)", "natriy tetrasianonikelat", "natriy tetrasianonikelat(II)", "natriy tetrasianonikkelat(II)"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["anion", "nikel", "siano", "nikelat"],
    explanation: "Anion kompleksda Ni → nikelat. 4(-1) + Ni = -2 → Ni = +2. Nomi: natriy tetrasianonikelat(II). Bu kvadrat-tekis kompleks (d⁸)."
  },
  {
    id: 72,
    question: "K₃[Mn(CN)₆] ning to'g'ri nomini toping.",
    options: ["kaliy geksasianomanganat(III)", "kaliy geksasianomanganat(II)", "kaliy geksasianomarganets(III)", "trikaliy geksasianomanganat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "marganets", "siano", "manganat"],
    explanation: "Anion kompleksda Mn → manganat. 6(-1) + Mn = -3 → Mn = +3. Nomi: kaliy geksasianomanganat(III)."
  },
  {
    id: 73,
    question: "Na[Au(CN)₂] ning to'g'ri nomini toping.",
    options: ["natriy disianooltin(I)", "natriy disianoaurat(I)", "natriy disianoaurat", "natriy disianoaurat(III)"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["anion", "oltin", "siano", "aurat"],
    explanation: "Anion kompleksda Au → aurat (lot. Aurum). 2(-1) + Au = -1 → Au = +1. Au(I) — barqaror holat (oltinni sianidli usul bilan ajratish)."
  },
  {
    id: 74,
    question: "Na₃[AlF₆] ning to'g'ri nomini toping (kriolit).",
    options: ["natriy geksaftoroaluminiy", "natriy geksaftoroaluminat(III)", "natriy geksaftoroaluminit", "natriy geksaftoroaluminat"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["anion", "aluminiy", "ftoro", "aluminat"],
    explanation: "Anion kompleksda Al → aluminat. Al faqat +3 holatda bo'lgani uchun rim raqami yozilmasligi mumkin: natriy geksaftoroaluminat (kriolit, Na₃AlF₆ — alyuminiy elektrolizida ishlatiladi)."
  },
  {
    id: 75,
    question: "K[Co(NH₃)₂(NO₂)₄] ning to'g'ri nomini toping.",
    options: ["kaliy tetranitrodiamminkobaltat(III)", "kaliy diamminitritetrakobaltat(III)", "kaliy diammintetranitrokobaltat(III)", "kaliy diammintetranitrokobalt(III)"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["anion", "kobalt", "ammin", "nitro"],
    explanation: "ANION (tetranitro) oldin, NEYTRAL (diammin) keyin. 4(-1) + 0 + Co = -1 → Co = +3. Anion → kobaltat. Nomi: kaliy tetranitrodiamminkobaltat(III)."
  },
  {
    id: 76,
    question: "[Co(NH₃)₆][Fe(CN)₆] ning to'g'ri nomini toping.",
    options: ["geksaamminkobaltat(III) geksasianoferrat(III)", "geksaamminkobalt(II) geksasianoferrat(II)", "geksasianoferrat(III) geksaamminkobalt(III)", "geksaamminkobalt(III) geksasianoferrat(III)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["kation", "anion", "kobalt", "temir"],
    explanation: "Kation [Co(NH₃)₆]³⁺ — geksaamminkobalt(III). Anion [Fe(CN)₆]³⁻ — geksasianoferrat(III). Avval kation, keyin anion."
  },
  {
    id: 77,
    question: "K₂[HgI₄] ning to'g'ri nomini toping (Nessler reagenti).",
    options: ["kaliy tetrayodosimob(II)", "kaliy tetrayodomerkurat", "kaliy tetrayodomerkurat(II)", "kaliy tetrayodogidrargirat(II)"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["anion", "simob", "yodo", "merkurat"],
    explanation: "Anion kompleksda Hg → merkurat (lot. Mercurius). 4(-1) + Hg = -2 → Hg = +2. Nomi: kaliy tetrayodomerkurat(II) — Nessler reagenti (NH₄⁺ aniqlash uchun)."
  },
  {
    id: 78,
    question: "K₂[Pb(OH)₄] ning to'g'ri nomini toping.",
    options: ["kaliy tetragidroksoqo'rg'oshin(II)", "kaliy tetragidroksoplumbat(IV)", "kaliy tetragidroksoplumbit", "kaliy tetragidroksoplumbat(II)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["anion", "qo'rg'oshin", "gidrokso", "plumbat"],
    explanation: "Anion kompleksda Pb → plumbat (lot. Plumbum). 4(-1) + Pb = -2 → Pb = +2. Nomi: kaliy tetragidroksoplumbat(II)."
  },
  {
    id: 79,
    question: "Anion kompleksda metallning -at qo'shimchasi qaysi metall uchun NOTO'G'RI yozilgan?",
    options: ["Fe → ferrat", "Ni → nikkelat", "Cu → kuprat", "Pb → plumbat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["anion", "nomlash", "qoidalar"],
    explanation: "To'g'ri shakl: Ni → 'nikelat' (bir 'k' bilan). Boshqalari to'g'ri: ferrat, kuprat, plumbat, argentat, aurat, stannat, kobaltat."
  },
  {
    id: 80,
    question: "[Cu(NH₃)₄][PtCl₄] ning to'g'ri nomini toping.",
    options: ["tetraamminkuprum(II) tetraxloroplatinat(II)", "tetraxloroplatinat(II) tetraamminmis(II)", "tetraamminmis(II) tetraxloroplatinat(II)", "tetraamminmis(II) tetraxloroplatina(II)"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kation", "anion", "mis", "platina"],
    explanation: "Kation [Cu(NH₃)₄]²⁺ — tetraamminmis(II) (o'zbekcha). Anion [PtCl₄]²⁻ — tetraxloroplatinat(II) (lotin -at). Avval kation, keyin anion."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-GURUH: OKSIDLANISH DARAJASI HISOBLASH (25 ta savol) — IDs 81–105
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 81,
    question: "[Fe(CN)₆]⁴⁻ da Fe ning oksidlanish darajasi qancha?",
    options: ["+3", "+2", "+4", "+6"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "temir", "anion"],
    explanation: "Har bir CN⁻ = -1, 6 ta CN⁻ = -6. Umumiy zaryad -4. Fe + (-6) = -4 → Fe = +2."
  },
  {
    id: 82,
    question: "[Fe(CN)₆]³⁻ da Fe ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+3", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "temir", "anion"],
    explanation: "6(-1) + Fe = -3 → Fe = +3."
  },
  {
    id: 83,
    question: "[Co(NH₃)₆]Cl₃ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "NH₃ neytral (0), 3 Cl⁻ tashqi → kation +3. 6(0) + Co = +3 → Co = +3."
  },
  {
    id: 84,
    question: "[Co(NH₃)₅Cl]Cl₂ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+3", "+5"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "kation"],
    explanation: "2 Cl⁻ tashqi → kation +2. Ichida: 5(0) + (-1) + Co = +2 → Co = +3."
  },
  {
    id: 85,
    question: "[Ag(NH₃)₂]Cl da Ag ning oksidlanish darajasi qancha?",
    options: ["+2", "+1", "+3", "0"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "kumush", "kation"],
    explanation: "1 Cl⁻ tashqi → kation +1. 2(0) + Ag = +1 → Ag = +1 (kumush uchun odatiy holat)."
  },
  {
    id: 86,
    question: "[Cu(NH₃)₄]SO₄ da Cu ning oksidlanish darajasi qancha?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "mis", "kation"],
    explanation: "SO₄²⁻ tashqi → kation +2. 4(0) + Cu = +2 → Cu = +2."
  },
  {
    id: 87,
    question: "[PtCl₆]²⁻ da Pt ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+6", "+4"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "anion"],
    explanation: "6(-1) + Pt = -2 → Pt = +4."
  },
  {
    id: 88,
    question: "[PtCl₄]²⁻ da Pt ning oksidlanish darajasi qancha?",
    options: ["+3", "+4", "+2", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "anion"],
    explanation: "4(-1) + Pt = -2 → Pt = +2."
  },
  {
    id: 89,
    question: "[Ni(CO)₄] da Ni ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "0"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["oksidlanish", "nikel", "neytral", "karbonil"],
    explanation: "CO neytral (0). Umumiy zaryad 0. 4(0) + Ni = 0 → Ni = 0. Bu karbonilli kompleks past oksidlanish darajasi misoli."
  },
  {
    id: 90,
    question: "[Fe(CO)₅] da Fe ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+5", "0"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["oksidlanish", "temir", "neytral", "karbonil"],
    explanation: "CO neytral. 5(0) + Fe = 0 → Fe = 0."
  },
  {
    id: 91,
    question: "K₃[Cr(C₂O₄)₃] da Cr ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "xrom", "anion", "oksalato"],
    explanation: "3 K⁺ tashqi → anion -3. 3 ta C₂O₄²⁻ = -6. (-6) + Cr = -3 → Cr = +3."
  },
  {
    id: 92,
    question: "[Co(en)₃]Cl₃ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+3", "+6"],
    correct: 2,
    difficulty: "oson",
    tags: ["oksidlanish", "kobalt", "etilendiamin", "kation"],
    explanation: "en — NEYTRAL ligand (0). 3 Cl⁻ tashqi → kation +3. 3(0) + Co = +3 → Co = +3."
  },
  {
    id: 93,
    question: "[Cu(en)₂]SO₄ da Cu ning oksidlanish darajasi qancha?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "oson",
    tags: ["oksidlanish", "mis", "etilendiamin", "kation"],
    explanation: "en neytral, SO₄²⁻ tashqi → kation +2. 2(0) + Cu = +2 → Cu = +2."
  },
  {
    id: 94,
    question: "[Co(NH₃)₄Cl₂]Cl da Co ning oksidlanish darajasi qancha?",
    options: ["+3", "+2", "+4", "+5"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "ammin", "xloro"],
    explanation: "1 Cl⁻ tashqi → kation +1. 4(0) + 2(-1) + Co = +1 → Co = +3."
  },
  {
    id: 95,
    question: "[Pt(NH₃)₂Cl₂] (sisplatin) da Pt ning oksidlanish darajasi qancha?",
    options: ["+3", "+4", "+2", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "platina", "neytral", "sisplatin"],
    explanation: "Neytral kompleks (zaryad 0). 2(0) + 2(-1) + Pt = 0 → Pt = +2."
  },
  {
    id: 96,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "+5"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "ammin", "akva"],
    explanation: "H₂O va NH₃ — ikkalasi ham neytral. 3 Cl⁻ tashqi → kation +3. Co = +3."
  },
  {
    id: 97,
    question: "[Co(NH₃)₅(NO₂)]Cl₂ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+5", "+3"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["oksidlanish", "kobalt", "ammin", "nitro"],
    explanation: "NO₂⁻ = -1, NH₃ = 0. 2 Cl⁻ tashqi → kation +2. 5(0) + (-1) + Co = +2 → Co = +3."
  },
  {
    id: 98,
    question: "[Co(NH₃)₄(SO₄)]NO₃ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+5", "+3"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["oksidlanish", "kobalt", "ammin", "sulfato"],
    explanation: "SO₄²⁻ ligand sifatida = -2, NH₃ = 0, NO₃⁻ tashqi → kation +1. 4(0) + (-2) + Co = +1 → Co = +3."
  },
  {
    id: 99,
    question: "K₄[Mn(CN)₆] da Mn ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["oksidlanish", "marganets", "siano", "anion"],
    explanation: "4 K⁺ tashqi → anion -4. 6(-1) + Mn = -4 → Mn = +2."
  },
  {
    id: 100,
    question: "K[Au(CN)₂] da Au ning oksidlanish darajasi qancha?",
    options: ["+2", "+1", "+3", "+4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["oksidlanish", "oltin", "siano", "anion"],
    explanation: "1 K⁺ tashqi → anion -1. 2(-1) + Au = -1 → Au = +1."
  },
  {
    id: 101,
    question: "[Co(NH₃)₆]₂(SO₄)₃ da Co ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+6", "+3"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["oksidlanish", "kobalt", "ammin", "kation"],
    explanation: "3 SO₄²⁻ tashqi = -6, 2 ta kation → har biri +3. Kompleksda 6(0) + Co = +3 → Co = +3."
  },
  {
    id: 102,
    question: "Na₂[Fe(CN)₅NO] (nitroprussid) da Fe ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "0"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["oksidlanish", "temir", "siano", "nitrozil"],
    explanation: "2 Na⁺ tashqi → anion -2. NO bu yerda NO⁺ deb hisoblanadi (nitrozil ligandi). 5(-1) + (+1) + Fe = -2 → Fe = +2. Nitroprussid — qon bosimini tushiruvchi dori."
  },
  {
    id: 103,
    question: "[Cr(H₂O)₄Cl₂]Cl·2H₂O da Cr ning oksidlanish darajasi qancha?",
    options: ["+2", "+4", "+6", "+3"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["oksidlanish", "xrom", "gidrat", "akva", "xloro"],
    explanation: "Kristallizatsiya suvi (·2H₂O) hisobga olinmaydi. 1 Cl⁻ tashqi → kation +1. 4(0) + 2(-1) + Cr = +1 → Cr = +3."
  },
  {
    id: 104,
    question: "[Pt(NH₃)₄][PtCl₄] da har bir Pt ning oksidlanish darajasi qancha?",
    options: ["ikkalasi +2", "ikkalasi +4", "kationda +4, anionda +2", "kationda +2, anionda +4"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["oksidlanish", "platina", "kation", "anion"],
    explanation: "Kation [Pt(NH₃)₄]²⁺: 4(0) + Pt = +2 → Pt(II). Anion [PtCl₄]²⁻: 4(-1) + Pt = -2 → Pt(II). Ikkalasi ham Pt(II)."
  },
  {
    id: 105,
    question: "K₂[OsCl₆] da Os ning oksidlanish darajasi qancha?",
    options: ["+2", "+3", "+4", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["oksidlanish", "osmiy", "xloro", "anion"],
    explanation: "2 K⁺ tashqi → anion -2. 6(-1) + Os = -2 → Os = +4."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5-GURUH: POLIDENTAT LIGANDLAR & ARALASH KOMPLEKSLAR (25 ta) — IDs 106–130
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 106,
    question: "Polidentat (yoki murakkab nomli) ligand sonini ko'rsatishda qaysi prefikslar ishlatiladi?",
    options: ["di-, tri-, tetra-", "do-, tro-, tetro-", "bis-, tris-, tetrakis-", "uno-, duo-, trio-"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["polidentat", "prefiks", "qoidalar"],
    explanation: "Polidentat ligandlar yoki tarkibida grekcha prefiks bo'lgan ligandlar uchun bis- (2), tris- (3), tetrakis- (4), pentakis- (5) ishlatiladi va ligand qavsga olinadi."
  },
  {
    id: 107,
    question: "en (etilendiamin) nechta donor atomga ega va qaysi atomlar?",
    options: ["2 ta, ikkalasi N", "1 ta, N", "2 ta, N va O", "4 ta, 2 N + 2 H"],
    correct: 0,
    difficulty: "oson",
    tags: ["polidentat", "etilendiamin", "bidentat"],
    explanation: "en (H₂N–CH₂–CH₂–NH₂) — bidentat, ikkita N atomi orqali bog'lanadi. 5-a'zoli xelat halqa hosil qiladi."
  },
  {
    id: 108,
    question: "C₂O₄²⁻ (oksalat) nechta donor atomga ega va qaysi atomlar?",
    options: ["1 ta, O", "2 ta, ikkalasi O", "2 ta, C va O", "4 ta, ikkalasi O dan"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "oksalat", "bidentat"],
    explanation: "C₂O₄²⁻ — bidentat, ikkita karboksilat O atomi orqali bog'lanadi. 5-a'zoli xelat halqa."
  },
  {
    id: 109,
    question: "acac⁻ nechta donor atomga ega va qaysi atomlar?",
    options: ["2 ta, ikkalasi O", "1 ta, O", "2 ta, N va O", "3 ta, 1 C + 2 O"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["polidentat", "atsetilasetonat", "bidentat"],
    explanation: "acac⁻ — bidentat, ikkita karbonil O atomi orqali bog'lanadi. 6-a'zoli xelat halqa hosil qiladi."
  },
  {
    id: 110,
    question: "EDTA⁴⁻ nechta va qaysi donor atomlarga ega?",
    options: ["4 ta O", "8 ta: 4 N + 4 O", "6 ta: 2 N + 4 O", "6 ta: 6 O"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["polidentat", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat: 2 ta uchlamchi amin N atomi + 4 ta karboksilat O atomi. Beshta 5-a'zoli xelat halqa hosil qiladi."
  },
  {
    id: 111,
    question: "Xelat effekti nima?",
    options: ["Faqat anion ligandlarning barqarorligi", "Polidentat ligandlarning monodentat ligandlarga qaraganda kuchliroq va barqarorroq komplekslar hosil qilishi", "Faqat kation komplekslarning barqarorligi", "Ligandning metallga vodorod bog'i hosil qilishi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["polidentat", "xelat", "barqarorlik"],
    explanation: "Xelat effekti — polidentat ligandlar bilan hosil bo'lgan komplekslarning monodentat analoglariga qaraganda yuqori barqarorligi. Asosan entropiya omiliga bog'liq (ΔS > 0)."
  },
  {
    id: 112,
    question: "[Co(en)₃]³⁺ ning koordinatsion soni nechaga teng?",
    options: ["6", "3", "4", "9"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["koordinatsion", "etilendiamin", "bidentat"],
    explanation: "3 ta bidentat ligand × 2 donor atom = 6. Koordinatsion son = 6, geometriya — oktaedrik."
  },
  {
    id: 113,
    question: "[Fe(EDTA)]⁻ ning koordinatsion soni nechaga teng?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["koordinatsion", "EDTA", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat (6 donor). Koordinatsion son = 6, geometriya — buralgan oktaedrik."
  },
  {
    id: 114,
    question: "[Co(en)₂Cl₂]⁺ ning koordinatsion soni nechaga teng?",
    options: ["2", "4", "8", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion", "etilendiamin", "xloro"],
    explanation: "2 ta en (2×2=4 donor) + 2 ta Cl⁻ (2 donor) = 6 donor. Koordinatsion son = 6, oktaedrik."
  },
  {
    id: 115,
    question: "Kompleks birikma nomida nima birinchi aytiladi?",
    options: ["Markaziy metall", "Kation (ichki yoki tashqi sferada)", "Tashqi sferadagi anion", "Ligandlar nomi"],
    correct: 1,
    difficulty: "oson",
    tags: ["nomlash", "qoidalar", "kation"],
    explanation: "IUPAC qoidasi: AVVAL KATION, KEYIN ANION nomi aytiladi. Kation kompleks bo'lsa, kompleks ioni birinchi keladi; anion kompleks bo'lsa — tashqi kation birinchi."
  },
  {
    id: 116,
    question: "Kitobning konventsiyasi bo'yicha ichki sferada ligandlar qaysi tartibda sanaladi?",
    options: ["Faqat alifbo tartibida", "kation → neytral → anion", "Ligand massa bo'yicha", "anion → neytral → kation (har guruh ichida alifbo)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["nomlash", "ligand", "tartib"],
    explanation: "Kitob (Nasimov–Tashpulatov, 2022) qoidasi: anion ligandlar oldin, keyin neytral, keyin kation. Har bir guruh ichida alifbo tartibi. (Eslatma: IUPAC 2005 da faqat alifbo tartibi qabul qilingan.)"
  },
  {
    id: 117,
    question: "Anion kompleksda Fe markaziy atom qanday nomlanadi?",
    options: ["temir", "ferrat", "ferrum", "temir(at)"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "temir", "ferrat"],
    explanation: "Anion kompleksda metall lotincha o'zagi + '-at' bilan nomlanadi: Fe (Ferrum) → ferrat. Misol: [Fe(CN)₆]⁴⁻ — geksasianoferrat(II)."
  },
  {
    id: 118,
    question: "Anion kompleksda Cu markaziy atom qanday nomlanadi?",
    options: ["kuprat", "mis", "kuprum", "misat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "mis", "kuprat"],
    explanation: "Cu (Cuprum) → kuprat. Misol: [CuCl₄]²⁻ — tetraxlorokuprat(II)."
  },
  {
    id: 119,
    question: "Anion kompleksda Au markaziy atom qanday nomlanadi?",
    options: ["oltin", "aurum", "oltinat", "aurat"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "oltin", "aurat"],
    explanation: "Au (Aurum) → aurat. Misol: [Au(CN)₂]⁻ — disianoaurat(I)."
  },
  {
    id: 120,
    question: "Anion kompleksda Sn markaziy atom qanday nomlanadi?",
    options: ["qalay", "stannat", "stannum", "qalayat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "qalay", "stannat"],
    explanation: "Sn (Stannum) → stannat. Misol: [SnF₆]²⁻ — geksaftorostannat(IV)."
  },
  {
    id: 121,
    question: "Anion kompleksda Pb markaziy atom qanday nomlanadi?",
    options: ["plumbat", "qo'rg'oshin", "plumbum", "qo'rg'oshinat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "qo'rg'oshin", "plumbat"],
    explanation: "Pb (Plumbum) → plumbat. Misol: [Pb(OH)₄]²⁻ — tetragidroksoplumbat(II)."
  },
  {
    id: 122,
    question: "Anion kompleksda Ag markaziy atom qanday nomlanadi?",
    options: ["kumush", "argentum", "argentat", "kumushat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["nomlash", "anion", "kumush", "argentat"],
    explanation: "Ag (Argentum) → argentat. Misol: [Ag(CN)₂]⁻ — disianoargentat(I)."
  },
  {
    id: 123,
    question: "Anion kompleksda Hg markaziy atom qanday nomlanadi?",
    options: ["simob", "gidrargirat", "merkurat", "merkurium"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["nomlash", "anion", "simob", "merkurat"],
    explanation: "Hg → merkurat (lat. Mercurius). Misol: [HgI₄]²⁻ — tetrayodomerkurat(II) (Nessler reagenti)."
  },
  {
    id: 124,
    question: "[Co(NH₃)₄Cl₂]⁺ kationining nomi qanday bo'ladi?",
    options: ["tetraammindixlorokobalt(III)", "kobalt(III) tetraammindixlorid", "dixlorotetraamminkobaltat(III)", "dixlorotetraamminkobalt(III)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "xloro"],
    explanation: "Anion (dixloro) oldin, neytral (tetraammin) keyin. Kation kompleks (bukobaltat emas, kobalt). Co = +3."
  },
  {
    id: 125,
    question: "[Co(NH₃)₄(H₂O)₂]Cl₃ ning to'g'ri nomini toping.",
    options: ["tetraammindiakvakobalt(III) xlorid", "diakvatetraamminkobalt(III) trixlorid", "diakvatetraamminkobaltat(III) xlorid", "diakvatetraamminkobalt(III) xlorid"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "akva"],
    explanation: "Faqat neytral ligandlar — alifbo: akva (a-k) keyin ammin (a-m). 3 Cl⁻ tashqi → kation +3. Co = +3."
  },
  {
    id: 126,
    question: "[Co(en)(NH₃)₂Cl₂]Cl ning to'g'ri nomini toping.",
    options: ["dixlorodiammin(etilendiamin)kobalt(III) xlorid", "diammin(etilendiamin)dixlorokobalt(III) xlorid", "dixloro(etilendiamin)diamminkobalt(III) xlorid", "dixlorodiamminetilendiaminkobalt(III) xlorid"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "etilendiamin", "xloro"],
    explanation: "ANION (dixloro) oldin → NEYTRALLAR alifboda: diammin (a-m) keyin (etilendiamin) (e). Murakkab ligand → bis emas, lekin qavs ishlatiladi (faqat 1 ta, demak (etilendiamin))."
  },
  {
    id: 127,
    question: "K[Co(NH₃)₂(C₂O₄)₂] ning to'g'ri nomini toping.",
    options: ["kaliy diamminbis(oksalato)kobaltat(III)", "kaliy bis(oksalato)diamminkobalt(III)", "kaliy bis(oksalato)diamminkobaltat(III)", "kaliy bisoksalatodiamminkobaltat(III)"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["aralash", "kobalt", "ammin", "oksalato", "anion"],
    explanation: "ANION (bis(oksalato)) oldin → NEYTRAL (diammin). 1 K⁺ tashqi → anion -1. 2(0)+2(-2)+Co=-1 → Co=+3. Anion → kobaltat."
  },
  {
    id: 128,
    question: "[Cr(NH₃)₃(H₂O)₃]Cl₃ ning to'g'ri nomini toping.",
    options: ["triammintriakvaxrom(III) xlorid", "triakvatriamminxrom(III) xlorid", "triakvatriamminxrom(III) trixlorid", "triakvatriamminxromat(III) xlorid"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["aralash", "xrom", "ammin", "akva"],
    explanation: "Neytrallar alifboda: triakva (a-k) keyin triammin (a-m). 3 Cl⁻ tashqi → kation +3. Cr = +3. fac- va mer- izomerlari bor."
  },
  {
    id: 129,
    question: "Quyidagi nomlardan qaysi biri sintaktik jihatdan TO'G'RI yozilgan?",
    options: ["tetraamminkobalt(III)", "tetra amin kobalt (III)", "tetra-ammin-kobalt(III)", "tetraamminkobalt (III)"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["nomlash", "sintaksis", "qoidalar"],
    explanation: "Kompleks birikma nomi BIR SO'Z sifatida yoziladi: bo'sh joy yoki tire qo'yilmaydi. Oksidlanish darajasi metall nomidan keyin to'g'ridan-to'g'ri (bo'sh joysiz) qavsda yoziladi: 'tetraamminkobalt(III)'."
  },
  {
    id: 130,
    question: "Quyidagi nomlardan qaysi biri ligand prefikslari uchun TO'G'RI?",
    options: ["bis(etilendiamin) — 2 ta en", "di(etilendiamin) — 2 ta en", "ditrietilendiamin — 2 ta en", "ikki(etilendiamin) — 2 ta en"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["nomlash", "polidentat", "prefiks"],
    explanation: "Murakkab nomli (yoki polidentat) ligand uchun 'di-' o'rniga 'bis-' va qavs ishlatiladi: bis(etilendiamin), tris(etilendiamin)."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6-GURUH: IZOMERIYA & NOMENKLATURA QOIDALARI (20 ta) — IDs 131–150
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 131,
    question: "Kompleks birikmalarning izomeriyasi qaysi ikki katta turga bo'linadi?",
    options: ["organik va noorganik", "geometrik va optik", "tuzilish (struktura) va stereoizomeriya", "ichki va tashqi"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["izomeriya", "tasnif"],
    explanation: "Kompleks birikmalarda IZOMERIYA ikkita katta turga bo'linadi: 1) tuzilish (struktura) izomeriyasi: ionlanish, gidrat, koordinatsion, bog'lanish (linkage); 2) stereoizomeriya: geometrik (sis-trans, fac-mer) va optik."
  },
  {
    id: 132,
    question: "sis-[Co(NH₃)₄Cl₂]⁺ izomerida ikkita Cl ligandi qanday joylashgan?",
    options: ["180° burchak ostida (qarama-qarshi)", "120° burchak ostida", "tasodifiy", "90° burchak ostida (qo'shni qirralar)"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["geometrik", "sis", "oktaedr"],
    explanation: "Sis-izomerda bir xil ligandlar oktaedrning qo'shni uchlarida (90° burchak ostida) joylashgan."
  },
  {
    id: 133,
    question: "trans-[Co(NH₃)₄Cl₂]⁺ izomerida ikkita Cl ligandi qanday joylashgan?",
    options: ["180° burchak ostida (qarama-qarshi)", "90° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "trans", "oktaedr"],
    explanation: "Trans-izomerda bir xil ligandlar oktaedrning qarama-qarshi uchlarida (180° burchak ostida) joylashgan."
  },
  {
    id: 134,
    question: "fac-[Co(NH₃)₃Cl₃] izomerida uchta Cl ligandi qanday joylashgan?",
    options: ["bir uchburchak yuzda (facial)", "meridian bo'ylab (meridional)", "qarama-qarshi", "qator bo'ylab"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometrik", "fac", "oktaedr"],
    explanation: "fac- (facial) izomerda 3 ta bir xil ligand oktaedrning bir uchburchak yuzini hosil qiladi. Har bir juftlik orasidagi burchak — 90°."
  },
  {
    id: 135,
    question: "mer-[Co(NH₃)₃Cl₃] izomerida uchta Cl ligandi qanday joylashgan?",
    options: ["bir yuzda (facial)", "meridian bo'ylab (markaz va ikki qutb)", "qarama-qarshi", "uchburchak burchaklarda"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "mer", "oktaedr"],
    explanation: "mer- (meridional) izomerda 3 ta bir xil ligand oktaedrning meridian chizig'i bo'ylab joylashgan (ikkita 90° va bitta 180° burchak)."
  },
  {
    id: 136,
    question: "[Co(en)₃]³⁺ qaysi turdagi izomeriyaga ega?",
    options: ["optik (Δ va Λ enantiomerlar)", "geometrik (sis-trans)", "linkage", "ionlanish"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["optik", "xelat", "enantiomer"],
    explanation: "[Co(en)₃]³⁺ propellerga o'xshash xiral struktura hosil qiladi: ikkita ko'zgu aksi — Δ (delta, o'ng) va Λ (lambda, chap) enantiomerlar."
  },
  {
    id: 137,
    question: "Δ va Λ belgilari nimani anglatadi?",
    options: ["sis va trans izomerlar", "xiral oktaedrik komplekslarning enantiomerlari (chap va o'ng)", "ionlanish izomerlari", "linkage izomerlari"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer", "xirallik"],
    explanation: "Δ (delta) va Λ (lambda) — xiral oktaedrik komplekslarning enantiomerlarini belgilash. Δ — o'ng propeller, Λ — chap. IUPAC tomonidan rasmiy qabul qilingan."
  },
  {
    id: 138,
    question: "[Co(NH₃)₅(NO₂)]Cl₂ va [Co(NH₃)₅(ONO)]Cl₂ qanday turdagi izomerlar?",
    options: ["geometrik (sis-trans)", "optik (Δ, Λ)", "koordinatsion izomerlar", "bog'lanish (linkage) izomerlari"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["linkage", "ambidentat", "nitro"],
    explanation: "NO₂⁻ — ambidentat ligand: N orqali (nitro) yoki O orqali (nitrito) bog'lanishi mumkin. Bu bog'lanish (linkage) izomeriyasi."
  },
  {
    id: 139,
    question: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday turdagi izomerlar?",
    options: ["geometrik", "optik", "linkage", "koordinatsion izomerlar"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["koordinatsion", "izomeriya"],
    explanation: "Koordinatsion izomeriya: ligandlar ikki metall (kation va anion komplekslar) orasida o'rin almashadi. Bu yerda NH₃ va CN⁻ Co va Cr orasida almashadi."
  },
  {
    id: 140,
    question: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]Br·Cl qanday turdagi izomerlar?",
    options: ["geometrik", "optik", "gidrat izomerlari", "ionlanish izomerlari"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomeriyasi: ichki va tashqi sferalardagi anionlar o'rin almashadi (Cl⁻ va Br⁻). Eritmada turli ionlar hosil qilishadi."
  },
  {
    id: 141,
    question: "[Cr(H₂O)₆]Cl₃ (binafsha) va [Cr(H₂O)₅Cl]Cl₂·H₂O (havorang) qanday izomerlar?",
    options: ["optik", "gidrat izomerlari", "linkage", "geometrik"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["gidrat", "izomeriya", "xrom"],
    explanation: "Gidrat (yoki solvat) izomeriyasi: H₂O molekulalari ichki sfera va kristallizatsiya suvi sifatida o'rin almashadi. Bu izomerlar turli ranglarga ega — klassik misol."
  },
  {
    id: 142,
    question: "[Pt(NH₃)₂Cl₂] sisplatin qaysi geometrik izomeri?",
    options: ["trans-diammindixloroplatina(II)", "sis-diammindixloroplatina(II)", "fac-izomer", "mer-izomer"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "sisplatin", "platina"],
    explanation: "Sisplatin — sis-[Pt(NH₃)₂Cl₂], onkologik dori. trans-izomer fiziologik faol emas. Kvadrat-tekis kompleks (Pt²⁺, d⁸)."
  },
  {
    id: 143,
    question: "Quyidagilardan qaysi biri [Pt(NH₃)₂Cl₂] da geometrik izomeriyaga olib keladi?",
    options: ["Pt ning oktaedrik geometriyasi", "Pt(IV) holati", "ligandlarning xelat hosil qilishi", "Pt ning d⁸ konfiguratsiyasi va kvadrat-tekis geometriya"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["geometrik", "platina", "kvadrat-tekis"],
    explanation: "[Pt(NH₃)₂Cl₂] kvadrat-tekis (kv. tekis, square planar) Pt(II) d⁸ kompleksi. Kvadratning qo'shni (sis) va qarama-qarshi (trans) burchaklari uchun ikki izomer mumkin."
  },
  {
    id: 144,
    question: "Tetraedrik komplekslarda geometrik (sis-trans) izomeriya mavjudmi?",
    options: ["Ha, har doim", "Yo'q, tetraedrda barcha burchaklar teng (109.5°)", "Faqat MA₂B₂ uchun", "Faqat xelatli ligandlar bilan"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "tetraedr"],
    explanation: "Tetraedrik geometriyada barcha 4 ta uchli pozitsiyalar geometrik jihatdan ekvivalent (burchak 109.5°), shu sababli MA₂B₂ tetraedrik kompleksda sis-trans izomeriya YO'Q. Faqat oktaedrik va kvadrat-tekis komplekslarda mavjud."
  },
  {
    id: 145,
    question: "trans-[Co(en)₂Cl₂]⁺ optik izomeriyaga egami?",
    options: ["Ha, ikki enantiomeri bor", "Faqat sis- izomeri optik faol", "Yo'q, ko'zgu aksi bilan o'zi ustma-ust tushadi", "Hech qachon optik faol bo'lmaydi"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "geometrik", "kobalt"],
    explanation: "trans-[Co(en)₂Cl₂]⁺ ning simmetriya tekisligi bor (Cl–Co–Cl o'qiga perpendikulyar), shu sababli optik faol EMAS. Faqat sis-[Co(en)₂Cl₂]⁺ Δ va Λ enantiomerlarga ega."
  },
  {
    id: 146,
    question: "[Co(NH₃)₄Cl₂]⁺ ning nechta geometrik izomeri bor?",
    options: ["1 (faqat bitta)", "2 (sis va trans)", "3 (fac, mer, sis)", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "oktaedr", "kobalt"],
    explanation: "Oktaedrik MA₄B₂ tipi 2 ta geometrik izomerga ega: sis- (B–M–B = 90°) va trans- (B–M–B = 180°)."
  },
  {
    id: 147,
    question: "[Co(NH₃)₃Cl₃] (oktaedrik MA₃B₃) nechta geometrik izomerga ega?",
    options: ["1", "3", "4", "2 (fac va mer)"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["geometrik", "fac", "mer"],
    explanation: "Oktaedrik MA₃B₃ tipi 2 ta izomerga ega: fac- (uchta bir xil ligand bir yuzda) va mer- (uchta bir xil ligand meridian bo'ylab)."
  },
  {
    id: 148,
    question: "Ionlanish izomeriyasi uchun [Co(NH₃)₅Br]SO₄ ning izomeri qaysi?",
    options: ["[Co(NH₃)₅Cl]SO₄", "[Co(NH₃)₄Br₂]SO₄", "[Co(NH₃)₅Br]·H₂SO₄", "[Co(NH₃)₅(SO₄)]Br"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerida Br⁻ va SO₄²⁻ ichki va tashqi sferalar o'rtasida o'rin almashadi: [Co(NH₃)₅Br]SO₄ ↔ [Co(NH₃)₅(SO₄)]Br. Eritmada turli ionlarga dissotsilanadi."
  },
  {
    id: 149,
    question: "Quyidagilardan qaysi biri xelat halqa hosil qilmaydi?",
    options: ["en (etilendiamin)", "oksalat (C₂O₄²⁻)", "EDTA⁴⁻", "ammin (NH₃)"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["xelat", "monodentat", "polidentat"],
    explanation: "Xelat halqa hosil qilish uchun ligand POLIDENTAT bo'lishi kerak (kamida 2 donor). NH₃ — monodentat, shu sababli xelat halqa hosil qilmaydi. Boshqalari — bidentat yoki geksadentat."
  },
  {
    id: 150,
    question: "Quyidagi kompleks nomlardan qaysi biri TO'LIQ TO'G'RI yozilgan?",
    options: ["geksaamminkobalt(III) trixlorid", "geksaminkobalt(III) xlorid", "geksaamminkobaltat(III) xlorid", "geksaamminkobalt(III) xlorid"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["nomlash", "umumlashtirish", "qoidalar"],
    explanation: "[Co(NH₃)₆]Cl₃ — geksaamminkobalt(III) xlorid. ✗ 'trixlorid' yozilmaydi — tashqi sferadagi anion soni nomda ko'rsatilmaydi (kation zaryadidan kelib chiqadi). ✗ 'geksamin' emas 'geksaammin' (ikki 'm'). ✗ kation kompleks — 'kobaltat' emas 'kobalt'."
  }
]

export default QUIZ_BANK
