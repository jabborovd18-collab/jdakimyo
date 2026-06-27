// app/oquv/video-darsliklar/quiz/klassifikatsiyasi/data.js

/**
 * Klassifikatsiyasi Quiz - Savol bazasi (100+ savol)
 * Mavzular: kompleks turi, ligand turi, zaryad, koordinatsion son, geometriya
 */

export const QUIZ_BANK = [
  // ═══════════════════════════════════════════════════════════
  // 1-GURUH: KOMPLEKS TURI (KATION/ANION/NEYTRAL) - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 1,
    question: "[Co(NH₃)₆]Cl₃ qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Co(NH₃)₆]³⁺ — kation kompleks. Tashqi sferada 3 ta Cl⁻ anionlari bor."
  },
  {
    id: 2,
    question: "K₄[Fe(CN)₆] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "oson",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Fe(CN)₆]⁴⁻ — anion kompleks. Tashqi sferada 4 ta K⁺ kationlari bor."
  },
  {
    id: 3,
    question: "[Pt(NH₃)₂Cl₂] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 2,
    difficulty: "oson",
    tags: ["kompleks_turi", "neytral"],
    explanation: "[Pt(NH₃)₂Cl₂] — neytral kompleks. Umumiy zaryad 0."
  },
  {
    id: 4,
    question: "[Cu(NH₃)₄]SO₄ qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Cu(NH₃)₄]²⁺ — kation kompleks. Tashqi sferada SO₄²⁻ anion."
  },
  {
    id: 5,
    question: "Na₃[Co(NO₂)₆] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "oson",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Co(NO₂)₆]³⁻ — anion kompleks. Tashqi sferada 3 ta Na⁺ kationlari."
  },
  {
    id: 6,
    question: "[Ni(CO)₄] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 2,
    difficulty: "oson",
    tags: ["kompleks_turi", "neytral"],
    explanation: "[Ni(CO)₄] — neytral kompleks. Ni⁰ va 4 ta neytral CO ligandlari."
  },
  {
    id: 7,
    question: "[Ag(NH₃)₂]Cl qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Ag(NH₃)₂]⁺ — kation kompleks. Tashqi sferada Cl⁻ anion."
  },
  {
    id: 8,
    question: "K₂[PtCl₆] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "oson",
    tags: ["kompleks_turi", "anion"],
    explanation: "[PtCl₆]²⁻ — anion kompleks. Tashqi sferada 2 ta K⁺ kationlari."
  },
  {
    id: 9,
    question: "[Fe(CO)₅] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 2,
    difficulty: "oson",
    tags: ["kompleks_turi", "neytral"],
    explanation: "[Fe(CO)₅] — neytral kompleks. Fe⁰ va 5 ta neytral CO ligandlari."
  },
  {
    id: 10,
    question: "[Co(NH₃)₅Cl]Cl₂ qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Co(NH₃)₅Cl]²⁺ — kation kompleks. Tashqi sferada 2 ta Cl⁻ anionlari."
  },
  {
    id: 11,
    question: "Na₂[Zn(OH)₄] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Zn(OH)₄]²⁻ — anion kompleks. Tashqi sferada 2 ta Na⁺ kationlari."
  },
  {
    id: 12,
    question: "[Cr(H₂O)₆]Cl₃ qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "oson",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Cr(H₂O)₆]³⁺ — kation kompleks. Tashqi sferada 3 ta Cl⁻ anionlari."
  },
  {
    id: 13,
    question: "K₃[Fe(C₂O₄)₃] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Fe(C₂O₄)₃]³⁻ — anion kompleks. Tashqi sferada 3 ta K⁺ kationlari."
  },
  {
    id: 14,
    question: "[Pt(NH₃)₄][PtCl₄] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Koordinatsion birikma"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["kompleks_turi", "koordinatsion"],
    explanation: "[Pt(NH₃)₄]²⁺ va [PtCl₄]²⁻ — koordinatsion birikma. Ikkala qism ham kompleks."
  },
  {
    id: 15,
    question: "[Co(en)₃]Cl₃ qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Co(en)₃]³⁺ — kation kompleks. Tashqi sferada 3 ta Cl⁻ anionlari."
  },
  {
    id: 16,
    question: "K[Ag(CN)₂] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Ag(CN)₂]⁻ — anion kompleks. Tashqi sferada K⁺ kation."
  },
  {
    id: 17,
    question: "[Mo(CO)₆] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "neytral"],
    explanation: "[Mo(CO)₆] — neytral kompleks. Mo⁰ va 6 ta neytral CO ligandlari."
  },
  {
    id: 18,
    question: "[Co(NH₃)₄Cl₂]Cl qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "kation"],
    explanation: "[Co(NH₃)₄Cl₂]⁺ — kation kompleks. Tashqi sferada Cl⁻ anion."
  },
  {
    id: 19,
    question: "Na₂[Ni(CN)₄] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["kompleks_turi", "anion"],
    explanation: "[Ni(CN)₄]²⁻ — anion kompleks. Tashqi sferada 2 ta Na⁺ kationlari."
  },
  {
    id: 20,
    question: "[W(CO)₆] qaysi turdagi kompleks?",
    options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Ionli kompleks"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["kompleks_turi", "neytral"],
    explanation: "[W(CO)₆] — neytral kompleks. W⁰ va 6 ta neytral CO ligandlari."
  },

  // ═══════════════════════════════════════════════════════════
  // 2-GURUH: LIGAND TURI (MONO/BIDE/POLIDENTAT) - 25 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 21,
    question: "NH₃ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand_turi", "monodentat"],
    explanation: "NH₃ — monodentat ligand. Faqat bitta N atomi orqali bog'lanadi."
  },
  {
    id: 22,
    question: "H₂O qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand_turi", "monodentat"],
    explanation: "H₂O — monodentat ligand. Faqat bitta O atomi orqali bog'lanadi."
  },
  {
    id: 23,
    question: "Cl⁻ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 0,
    difficulty: "oson",
    tags: ["ligand_turi", "monodentat"],
    explanation: "Cl⁻ — monodentat ligand. Faqat bitta Cl atomi orqali bog'lanadi."
  },
  {
    id: 24,
    question: "en (etilendiamin) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 1,
    difficulty: "oson",
    tags: ["ligand_turi", "bidentat"],
    explanation: "en — bidentat ligand. Ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 25,
    question: "C₂O₄²⁻ (oksalat) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 1,
    difficulty: "oson",
    tags: ["ligand_turi", "bidentat"],
    explanation: "C₂O₄²⁻ — bidentat ligand. Ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 26,
    question: "phen (1,10-fenantrolin) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand_turi", "bidentat"],
    explanation: "phen — bidentat ligand. Ikkita N atomi orqali bog'lanadi."
  },
  {
    id: 27,
    question: "EDTA⁴⁻ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Geksadentat"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["ligand_turi", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand. 6 ta donor atom (2 N, 4 O)."
  },
  {
    id: 28,
    question: "acac⁻ (atsetilasetonat) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand_turi", "bidentat"],
    explanation: "acac⁻ — bidentat ligand. Ikkita O atomi orqali bog'lanadi."
  },
  {
    id: 29,
    question: "dien (dietilentriamin) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Polidentat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "tridentat"],
    explanation: "dien — tridentat ligand. Uchta N atomi orqali bog'lanadi."
  },
  {
    id: 30,
    question: "trien (trietilentetramin) qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Tridentat", "Tetradentat"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["ligand_turi", "tetradentat"],
    explanation: "trien — tetradentat ligand. To'rtta N atomi orqali bog'lanadi."
  },
  {
    id: 31,
    question: "CN⁻ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Ambidentat", "Polidentat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "ambidentat"],
    explanation: "CN⁻ — ambidentat ligand. C yoki N atomi orqali bog'lanishi mumkin."
  },
  {
    id: 32,
    question: "SCN⁻ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Ambidentat", "Polidentat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "ambidentat"],
    explanation: "SCN⁻ — ambidentat ligand. S yoki N atomi orqali bog'lanishi mumkin."
  },
  {
    id: 33,
    question: "NO₂⁻ qaysi turdagi ligand?",
    options: ["Monodentat", "Bidentat", "Ambidentat", "Polidentat"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "ambidentat"],
    explanation: "NO₂⁻ — ambidentat ligand. N yoki O atomi orqali bog'lanishi mumkin."
  },
  {
    id: 34,
    question: "[Co(NH₃)₆]³⁺ da nechta monodentat ligand bor?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "oson",
    tags: ["ligand_turi", "monodentat"],
    explanation: "6 ta NH₃ — barchasi monodentat ligandlar."
  },
  {
    id: 35,
    question: "[Co(en)₃]³⁺ da nechta bidentat ligand bor?",
    options: ["1", "2", "3", "6"],
    correct: 2,
    difficulty: "oson",
    tags: ["ligand_turi", "bidentat"],
    explanation: "3 ta en — barchasi bidentat ligandlar. Koordinatsion son = 6."
  },
  {
    id: 36,
    question: "[Fe(C₂O₄)₃]³⁻ da nechta bidentat ligand bor?",
    options: ["1", "2", "3", "6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "bidentat"],
    explanation: "3 ta C₂O₄²⁻ — barchasi bidentat ligandlar. Koordinatsion son = 6."
  },
  {
    id: 37,
    question: "[Co(en)₂Cl₂]⁺ da nechta bidentat va monodentat ligand bor?",
    options: ["2 bidentat, 2 monodentat", "1 bidentat, 4 monodentat", "4 bidentat", "2 bidentat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand_turi", "aralash"],
    explanation: "2 ta en (bidentat) + 2 ta Cl⁻ (monodentat). Koordinatsion son = 6."
  },
  {
    id: 38,
    question: "[Fe(EDTA)]⁻ da nechta donor atom bor?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "geksadentat"],
    explanation: "EDTA⁴⁻ — geksadentat ligand. 6 ta donor atom (2 N, 4 O)."
  },
  {
    id: 39,
    question: "[Co(dien)₂]³⁺ da nechta tridentat ligand bor?",
    options: ["1", "2", "3", "6"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["ligand_turi", "tridentat"],
    explanation: "2 ta dien — barchasi tridentat ligandlar. Koordinatsion son = 6."
  },
  {
    id: 40,
    question: "[Co(acac)₃] da nechta bidentat ligand bor?",
    options: ["1", "2", "3", "6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ligand_turi", "bidentat"],
    explanation: "3 ta acac⁻ — barchasi bidentat ligandlar. Koordinatsion son = 6."
  },
  {
    id: 41,
    question: "[Pt(en)Cl₂] da nechta bidentat va monodentat ligand bor?",
    options: ["1 bidentat, 2 monodentat", "2 bidentat, 2 monodentat", "1 bidentat", "2 bidentat"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ligand_turi", "aralash"],
    explanation: "1 ta en (bidentat) + 2 ta Cl⁻ (monodentat). Koordinatsion son = 4."
  },
  {
    id: 42,
    question: "[Cu(phen)₂]²⁺ da nechta bidentat ligand bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ligand_turi", "bidentat"],
    explanation: "2 ta phen — barchasi bidentat ligandlar. Koordinatsion son = 4."
  },
  {
    id: 43,
    question: "[Co(NH₃)₄(C₂O₄)]⁺ da nechta monodentat va bidentat ligand bor?",
    options: ["4 monodentat, 1 bidentat", "2 monodentat, 2 bidentat", "4 monodentat", "1 bidentat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["ligand_turi", "aralash"],
    explanation: "4 ta NH₃ (monodentat) + 1 ta C₂O₄²⁻ (bidentat). Koordinatsion son = 6."
  },
  {
    id: 44,
    question: "[Fe(CN)₆]⁴⁻ da nechta monodentat ligand bor?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "oson",
    tags: ["ligand_turi", "monodentat"],
    explanation: "6 ta CN⁻ — barchasi monodentat ligandlar."
  },
  {
    id: 45,
    question: "[Co(trien)Cl]²⁺ da nechta tetradentat va monodentat ligand bor?",
    options: ["1 tetradentat, 1 monodentat", "2 tetradentat", "1 tetradentat", "1 monodentat"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["ligand_turi", "aralash"],
    explanation: "1 ta trien (tetradentat) + 1 ta Cl⁻ (monodentat). Koordinatsion son = 5."
  },

  // ═══════════════════════════════════════════════════════════
  // 3-GURUH: KOORDINATSION SON - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 46,
    question: "[Co(NH₃)₆]³⁺ ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "oson",
    tags: ["koordinatsion_son", "6"],
    explanation: "6 ta monodentat NH₃ ligandlari. Koordinatsion son = 6."
  },
  {
    id: 47,
    question: "[PtCl₄]²⁻ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "oson",
    tags: ["koordinatsion_son", "4"],
    explanation: "4 ta monodentat Cl⁻ ligandlari. Koordinatsion son = 4."
  },
  {
    id: 48,
    question: "[Ag(NH₃)₂]⁺ ning koordinatsion soni necha?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "oson",
    tags: ["koordinatsion_son", "2"],
    explanation: "2 ta monodentat NH₃ ligandlari. Koordinatsion son = 2."
  },
  {
    id: 49,
    question: "[Cu(en)₂]²⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "4"],
    explanation: "2 ta bidentat en ligandlari (2 × 2 = 4). Koordinatsion son = 4."
  },
  {
    id: 50,
    question: "[Co(en)₃]³⁺ ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "3 ta bidentat en ligandlari (3 × 2 = 6). Koordinatsion son = 6."
  },
  {
    id: 51,
    question: "[Fe(C₂O₄)₃]³⁻ ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "3 ta bidentat C₂O₄²⁻ ligandlari (3 × 2 = 6). Koordinatsion son = 6."
  },
  {
    id: 52,
    question: "[Fe(EDTA)]⁻ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "1 ta geksadentat EDTA⁴⁻ ligandi (6 donor atom). Koordinatsion son = 6."
  },
  {
    id: 53,
    question: "[Pt(NH₃)₂Cl₂] ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "oson",
    tags: ["koordinatsion_son", "4"],
    explanation: "2 ta NH₃ + 2 ta Cl⁻ = 4 ta monodentat ligand. Koordinatsion son = 4."
  },
  {
    id: 54,
    question: "[Co(NH₃)₄Cl₂]⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "5", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "4 ta NH₃ + 2 ta Cl⁻ = 6 ta monodentat ligand. Koordinatsion son = 6."
  },
  {
    id: 55,
    question: "[Ni(CO)₄] ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "oson",
    tags: ["koordinatsion_son", "4"],
    explanation: "4 ta monodentat CO ligandlari. Koordinatsion son = 4."
  },
  {
    id: 56,
    question: "[Fe(CO)₅] ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    difficulty: "oson",
    tags: ["koordinatsion_son", "5"],
    explanation: "5 ta monodentat CO ligandlari. Koordinatsion son = 5."
  },
  {
    id: 57,
    question: "[Mo(CO)₆] ning koordinatsion soni necha?",
    options: ["4", "5", "6", "8"],
    correct: 2,
    difficulty: "oson",
    tags: ["koordinatsion_son", "6"],
    explanation: "6 ta monodentat CO ligandlari. Koordinatsion son = 6."
  },
  {
    id: 58,
    question: "[Co(en)₂Cl₂]⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "5", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "2 ta en (2 × 2 = 4) + 2 ta Cl⁻ = 6. Koordinatsion son = 6."
  },
  {
    id: 59,
    question: "[Cu(phen)₂]²⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "4"],
    explanation: "2 ta bidentat phen ligandlari (2 × 2 = 4). Koordinatsion son = 4."
  },
  {
    id: 60,
    question: "[Co(dien)₂]³⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "5", "6"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["koordinatsion_son", "6"],
    explanation: "2 ta tridentat dien ligandlari (2 × 3 = 6). Koordinatsion son = 6."
  },
  {
    id: 61,
    question: "[Co(acac)₃] ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "6"],
    explanation: "3 ta bidentat acac⁻ ligandlari (3 × 2 = 6). Koordinatsion son = 6."
  },
  {
    id: 62,
    question: "[Pt(en)Cl₂] ning koordinatsion soni necha?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["koordinatsion_son", "4"],
    explanation: "1 ta en (1 × 2 = 2) + 2 ta Cl⁻ = 4. Koordinatsion son = 4."
  },
  {
    id: 63,
    question: "[Co(NH₃)₄(C₂O₄)]⁺ ning koordinatsion soni necha?",
    options: ["4", "5", "6", "8"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["koordinatsion_son", "6"],
    explanation: "4 ta NH₃ (4 × 1 = 4) + 1 ta C₂O₄²⁻ (1 × 2 = 2) = 6. Koordinatsion son = 6."
  },
  {
    id: 64,
    question: "[Zn(NH₃)₄]²⁺ ning koordinatsion soni necha?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "oson",
    tags: ["koordinatsion_son", "4"],
    explanation: "4 ta monodentat NH₃ ligandlari. Koordinatsion son = 4."
  },
  {
    id: 65,
    question: "[Cr(H₂O)₆]³⁺ ning koordinatsion soni necha?",
    options: ["3", "4", "5", "6"],
    correct: 3,
    difficulty: "oson",
    tags: ["koordinatsion_son", "6"],
    explanation: "6 ta monodentat H₂O ligandlari. Koordinatsion son = 6."
  },

  // ═══════════════════════════════════════════════════════════
  // 4-GURUH: GEOMETRIYA - 15 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 66,
    question: "[Ag(NH₃)₂]⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 3,
    difficulty: "oson",
    tags: ["geometriya", "chiziqli"],
    explanation: "Koordinatsion son = 2. Geometriya: chiziqli (linear)."
  },
  {
    id: 67,
    question: "[Ni(CO)₄] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometriya", "tetraedr"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya. Geometriya: tetraedr."
  },
  {
    id: 68,
    question: "[PtCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Pt²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 69,
    question: "[Co(NH₃)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 70,
    question: "[Cu(NH₃)₄]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat"],
    explanation: "Koordinatsion son = 4, d⁹ konfiguratsiya (Cu²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 71,
    question: "[Fe(CN)₆]⁴⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 72,
    question: "[Zn(NH₃)₄]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometriya", "tetraedr"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya (Zn²⁺). Geometriya: tetraedr."
  },
  {
    id: 73,
    question: "[Pt(NH₃)₂Cl₂] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Pt²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 74,
    question: "[Co(en)₃]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr"],
    explanation: "Koordinatsion son = 6 (3 × 2). Geometriya: oktaedr."
  },
  {
    id: 75,
    question: "[Fe(CO)₅] ning geometriyasi qanday?",
    options: ["Trigonal bipiramida", "Kvadrat piramida", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "trigonal"],
    explanation: "Koordinatsion son = 5. Geometriya: trigonal bipiramida."
  },
  {
    id: 76,
    question: "[Ni(CN)₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Ni²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 77,
    question: "[CuCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "tetraedr"],
    explanation: "Koordinatsion son = 4, d⁹ konfiguratsiya (Cu²⁺). Geometriya: tetraedr (distorted)."
  },
  {
    id: 78,
    question: "[Cr(H₂O)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 79,
    question: "[Au(CN)₂]⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["geometriya", "chiziqli"],
    explanation: "Koordinatsion son = 2, d¹⁰ konfiguratsiya (Au⁺). Geometriya: chiziqli."
  },
  {
    id: 80,
    question: "[Mo(CO)₆] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },

  // ═══════════════════════════════════════════════════════════
  // 5-GURUH: ZARYAD HISOBLASH - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 81,
    question: "[Co(NH₃)₆]³⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+6"],
    correct: 2,
    difficulty: "oson",
    tags: ["zaryad", "kation"],
    explanation: "Co³⁺ + 6 × NH₃⁰ = +3. Umumiy zaryad: +3."
  },
  {
    id: 82,
    question: "[Fe(CN)₆]⁴⁻ ning umumiy zaryadi qanday?",
    options: ["-2", "-3", "-4", "-6"],
    correct: 2,
    difficulty: "oson",
    tags: ["zaryad", "anion"],
    explanation: "Fe²⁺ + 6 × CN⁻ = +2 + (-6) = -4. Umumiy zaryad: -4."
  },
  {
    id: 83,
    question: "[PtCl₄]²⁻ ning umumiy zaryadi qanday?",
    options: ["-1", "-2", "-3", "-4"],
    correct: 1,
    difficulty: "oson",
    tags: ["zaryad", "anion"],
    explanation: "Pt²⁺ + 4 × Cl⁻ = +2 + (-4) = -2. Umumiy zaryad: -2."
  },
  {
    id: 84,
    question: "[Cu(NH₃)₄]²⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "oson",
    tags: ["zaryad", "kation"],
    explanation: "Cu²⁺ + 4 × NH₃⁰ = +2. Umumiy zaryad: +2."
  },
  {
    id: 85,
    question: "[Ag(NH₃)₂]⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 0,
    difficulty: "oson",
    tags: ["zaryad", "kation"],
    explanation: "Ag⁺ + 2 × NH₃⁰ = +1. Umumiy zaryad: +1."
  },
  {
    id: 86,
    question: "[Co(NH₃)₅Cl]²⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["zaryad", "kation"],
    explanation: "Co³⁺ + 5 × NH₃⁰ + Cl⁻ = +3 + 0 + (-1) = +2. Umumiy zaryad: +2."
  },
  {
    id: 87,
    question: "[Fe(C₂O₄)₃]³⁻ ning umumiy zaryadi qanday?",
    options: ["-1", "-2", "-3", "-6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["zaryad", "anion"],
    explanation: "Fe³⁺ + 3 × C₂O₄²⁻ = +3 + (-6) = -3. Umumiy zaryad: -3."
  },
  {
    id: 88,
    question: "[Pt(NH₃)₂Cl₂] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "oson",
    tags: ["zaryad", "neytral"],
    explanation: "Pt²⁺ + 2 × NH₃⁰ + 2 × Cl⁻ = +2 + 0 + (-2) = 0. Umumiy zaryad: 0."
  },
  {
    id: 89,
    question: "[Ni(CO)₄] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "oson",
    tags: ["zaryad", "neytral"],
    explanation: "Ni⁰ + 4 × CO⁰ = 0. Umumiy zaryad: 0."
  },
  {
    id: 90,
    question: "[Co(en)₃]³⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+6"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["zaryad", "kation"],
    explanation: "Co³⁺ + 3 × en⁰ = +3. Umumiy zaryad: +3."
  },
  {
    id: 91,
    question: "[Fe(EDTA)]⁻ ning umumiy zaryadi qanday?",
    options: ["-1", "-2", "-3", "-4"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["zaryad", "anion"],
    explanation: "Fe³⁺ + EDTA⁴⁻ = +3 + (-4) = -1. Umumiy zaryad: -1."
  },
  {
    id: 92,
    question: "[Co(NH₃)₄Cl₂]⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["zaryad", "kation"],
    explanation: "Co³⁺ + 4 × NH₃⁰ + 2 × Cl⁻ = +3 + 0 + (-2) = +1. Umumiy zaryad: +1."
  },
  {
    id: 93,
    question: "[Cr(H₂O)₆]³⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+6"],
    correct: 2,
    difficulty: "oson",
    tags: ["zaryad", "kation"],
    explanation: "Cr³⁺ + 6 × H₂O⁰ = +3. Umumiy zaryad: +3."
  },
  {
    id: 94,
    question: "[Zn(OH)₄]²⁻ ning umumiy zaryadi qanday?",
    options: ["-1", "-2", "-3", "-4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["zaryad", "anion"],
    explanation: "Zn²⁺ + 4 × OH⁻ = +2 + (-4) = -2. Umumiy zaryad: -2."
  },
  {
    id: 95,
    question: "[Cu(en)₂]²⁺ ning umumiy zaryadi qanday?",
    options: ["+1", "+2", "+3", "+4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["zaryad", "kation"],
    explanation: "Cu²⁺ + 2 × en⁰ = +2. Umumiy zaryad: +2."
  },
  {
    id: 96,
    question: "[Fe(CO)₅] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "oson",
    tags: ["zaryad", "neytral"],
    explanation: "Fe⁰ + 5 × CO⁰ = 0. Umumiy zaryad: 0."
  },
  {
    id: 97,
    question: "[Co(acac)₃] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["zaryad", "neytral"],
    explanation: "Co³⁺ + 3 × acac⁻ = +3 + (-3) = 0. Umumiy zaryad: 0."
  },
  {
    id: 98,
    question: "[Pt(en)Cl₂] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["zaryad", "neytral"],
    explanation: "Pt²⁺ + en⁰ + 2 × Cl⁻ = +2 + 0 + (-2) = 0. Umumiy zaryad: 0."
  },
  {
    id: 99,
    question: "[Ag(CN)₂]⁻ ning umumiy zaryadi qanday?",
    options: ["-1", "-2", "-3", "-4"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["zaryad", "anion"],
    explanation: "Ag⁺ + 2 × CN⁻ = +1 + (-2) = -1. Umumiy zaryad: -1."
  },
  {
    id: 100,
    question: "[Mo(CO)₆] ning umumiy zaryadi qanday?",
    options: ["0", "+1", "+2", "-1"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["zaryad", "neytral"],
    explanation: "Mo⁰ + 6 × CO⁰ = 0. Umumiy zaryad: 0."
  }
]

export default QUIZ_BANK