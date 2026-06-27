// app/oquv/video-darsliklar/quiz/fazoviy/data.js

/**
 * Fazoviy Tuzilishi Quiz - Savol bazasi (100+ savol)
 * Mavzular: geometriya, gibridlanish, VSEPR, fazoviy izomeriya
 */

export const QUIZ_BANK = [
  // ═══════════════════════════════════════════════════════════
  // 1-GURUH: GEOMETRIYA TURLARI - 25 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 1,
    question: "[Ag(NH₃)₂]⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 3,
    difficulty: "oson",
    tags: ["geometriya", "chiziqli", "KCH_2"],
    explanation: "Koordinatsion son = 2, d¹⁰ konfiguratsiya (Ag⁺). Geometriya: chiziqli (linear), burchak 180°."
  },
  {
    id: 2,
    question: "[Ni(CO)₄] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya (Ni⁰). Geometriya: tetraedr, burchaklar 109.5°."
  },
  {
    id: 3,
    question: "[PtCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Pt²⁺). Geometriya: kvadrat tekislik, burchaklar 90°."
  },
  {
    id: 4,
    question: "[Co(NH₃)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr, burchaklar 90° va 180°."
  },
  {
    id: 5,
    question: "[Cu(NH₃)₄]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁹ konfiguratsiya (Cu²⁺). Geometriya: kvadrat tekislik (Yahn-Teller effekti)."
  },
  {
    id: 6,
    question: "[Fe(CN)₆]⁴⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 7,
    question: "[Zn(NH₃)₄]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya (Zn²⁺). Geometriya: tetraedr."
  },
  {
    id: 8,
    question: "[Pt(NH₃)₂Cl₂] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Pt²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 9,
    question: "[Co(en)₃]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6 (3 × 2). Geometriya: oktaedr."
  },
  {
    id: 10,
    question: "[Fe(CO)₅] ning geometriyasi qanday?",
    options: ["Trigonal bipiramida", "Kvadrat piramida", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "trigonal", "KCH_5"],
    explanation: "Koordinatsion son = 5. Geometriya: trigonal bipiramida."
  },
  {
    id: 11,
    question: "[Ni(CN)₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Ni²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 12,
    question: "[CuCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁹ konfiguratsiya (Cu²⁺). Geometriya: tetraedr (distorted)."
  },
  {
    id: 13,
    question: "[Cr(H₂O)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 14,
    question: "[Au(CN)₂]⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["geometriya", "chiziqli", "KCH_2"],
    explanation: "Koordinatsion son = 2, d¹⁰ konfiguratsiya (Au⁺). Geometriya: chiziqli."
  },
  {
    id: 15,
    question: "[Mo(CO)₆] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 16,
    question: "[PdCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometriya", "kvadrat", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁸ konfiguratsiya (Pd²⁺). Geometriya: kvadrat tekislik."
  },
  {
    id: 17,
    question: "[Fe(H₂O)₆]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "oson",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 18,
    question: "[Cd(NH₃)₄]²⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya (Cd²⁺). Geometriya: tetraedr."
  },
  {
    id: 19,
    question: "[IrCl₆]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 20,
    question: "[HgI₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d¹⁰ konfiguratsiya (Hg²⁺). Geometriya: tetraedr."
  },
  {
    id: 21,
    question: "[Rh(NH₃)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 22,
    question: "[Cu(NH₃)₂]⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["geometriya", "chiziqli", "KCH_2"],
    explanation: "Koordinatsion son = 2, d¹⁰ konfiguratsiya (Cu⁺). Geometriya: chiziqli."
  },
  {
    id: 23,
    question: "[Mn(CO)₆] ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },
  {
    id: 24,
    question: "[CoCl₄]²⁻ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometriya", "tetraedr", "KCH_4"],
    explanation: "Koordinatsion son = 4, d⁷ konfiguratsiya (Co²⁺). Geometriya: tetraedr."
  },
  {
    id: 25,
    question: "[Ru(NH₃)₆]³⁺ ning geometriyasi qanday?",
    options: ["Tetraedr", "Kvadrat tekislik", "Oktaedr", "Chiziqli"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["geometriya", "oktaedr", "KCH_6"],
    explanation: "Koordinatsion son = 6. Geometriya: oktaedr."
  },

  // ═══════════════════════════════════════════════════════════
  // 2-GURUH: GIBRİDLANISH - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 26,
    question: "[Ag(NH₃)₂]⁺ da Ag⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 0,
    difficulty: "oson",
    tags: ["gibridlanish", "sp", "KCH_2"],
    explanation: "Koordinatsion son = 2, chiziqli geometriya. Gibridlanish: sp."
  },
  {
    id: 27,
    question: "[Ni(CO)₄] da Ni ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 2,
    difficulty: "oson",
    tags: ["gibridlanish", "sp3", "KCH_4"],
    explanation: "Koordinatsion son = 4, tetraedr geometriya. Gibridlanish: sp³."
  },
  {
    id: 28,
    question: "[PtCl₄]²⁻ da Pt²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "dsp2", "KCH_4"],
    explanation: "Koordinatsion son = 4, kvadrat tekislik geometriya. Gibridlanish: dsp²."
  },
  {
    id: 29,
    question: "[Co(NH₃)₆]³⁺ da Co³⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, past spinli. Gibridlanish: d²sp³ (ichki orbital)."
  },
  {
    id: 30,
    question: "[Fe(H₂O)₆]²⁺ da Fe²⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "sp3d2", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, yuqori spinli. Gibridlanish: sp³d² (tashqi orbital)."
  },
  {
    id: 31,
    question: "[Zn(NH₃)₄]²⁺ da Zn²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 2,
    difficulty: "oson",
    tags: ["gibridlanish", "sp3", "KCH_4"],
    explanation: "Koordinatsion son = 4, tetraedr geometriya. Gibridlanish: sp³."
  },
  {
    id: 32,
    question: "[Cu(NH₃)₄]²⁺ da Cu²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "dsp2", "KCH_4"],
    explanation: "Koordinatsion son = 4, kvadrat tekislik geometriya. Gibridlanish: dsp²."
  },
  {
    id: 33,
    question: "[Fe(CN)₆]⁴⁻ da Fe²⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, past spinli. Gibridlanish: d²sp³."
  },
  {
    id: 34,
    question: "[CoF₆]³⁻ da Co³⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["gibridlanish", "sp3d2", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, yuqori spinli (F⁻ kuchsiz ligand). Gibridlanish: sp³d²."
  },
  {
    id: 35,
    question: "[Ni(CN)₄]²⁻ da Ni²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "dsp2", "KCH_4"],
    explanation: "Koordinatsion son = 4, kvadrat tekislik geometriya. Gibridlanish: dsp²."
  },
  {
    id: 36,
    question: "[Cr(NH₃)₆]³⁺ da Cr³⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya. Gibridlanish: d²sp³."
  },
  {
    id: 37,
    question: "[Cd(NH₃)₄]²⁺ da Cd²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "sp3", "KCH_4"],
    explanation: "Koordinatsion son = 4, tetraedr geometriya. Gibridlanish: sp³."
  },
  {
    id: 38,
    question: "[PdCl₄]²⁻ da Pd²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "dsp2", "KCH_4"],
    explanation: "Koordinatsion son = 4, kvadrat tekislik geometriya. Gibridlanish: dsp²."
  },
  {
    id: 39,
    question: "[Mn(CN)₆]⁴⁻ da Mn²⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, past spinli. Gibridlanish: d²sp³."
  },
  {
    id: 40,
    question: "[HgI₄]²⁻ da Hg²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["gibridlanish", "sp3", "KCH_4"],
    explanation: "Koordinatsion son = 4, tetraedr geometriya. Gibridlanish: sp³."
  },
  {
    id: 41,
    question: "[Co(en)₃]³⁺ da Co³⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya, past spinli. Gibridlanish: d²sp³."
  },
  {
    id: 42,
    question: "[Cu(NH₃)₂]⁺ da Cu⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["gibridlanish", "sp", "KCH_2"],
    explanation: "Koordinatsion son = 2, chiziqli geometriya. Gibridlanish: sp."
  },
  {
    id: 43,
    question: "[Pt(NH₃)₂Cl₂] da Pt²⁺ ning gibridlanishi qanday?",
    options: ["sp", "sp²", "sp³", "dsp²"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["gibridlanish", "dsp2", "KCH_4"],
    explanation: "Koordinatsion son = 4, kvadrat tekislik geometriya. Gibridlanish: dsp²."
  },
  {
    id: 44,
    question: "[Fe(CO)₅] da Fe ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "dsp³", "d²sp"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["gibridlanish", "dsp3", "KCH_5"],
    explanation: "Koordinatsion son = 5, trigonal bipiramida geometriya. Gibridlanish: dsp³."
  },
  {
    id: 45,
    question: "[Ru(NH₃)₆]³⁺ da Ru³⁺ ning gibridlanishi qanday?",
    options: ["sp³", "dsp²", "d²sp³", "sp³d²"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["gibridlanish", "d2sp3", "KCH_6"],
    explanation: "Koordinatsion son = 6, oktaedr geometriya. Gibridlanish: d²sp³."
  },

  // ═══════════════════════════════════════════════════════════
  // 3-GURUH: VSEPR VA BURCHAKLAR - 15 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 46,
    question: "[Ag(NH₃)₂]⁺ da N-Ag-N burchagi qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 3,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "chiziqli"],
    explanation: "Chiziqli geometriya. Burchak: 180°."
  },
  {
    id: 47,
    question: "[Ni(CO)₄] da C-Ni-C burchagi qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 1,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "tetraedr"],
    explanation: "Tetraedr geometriya. Burchak: 109.5°."
  },
  {
    id: 48,
    question: "[PtCl₄]²⁻ da Cl-Pt-Cl burchagi (qo'shni) qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 0,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "kvadrat"],
    explanation: "Kvadrat tekislik geometriya. Qo'shni burchak: 90°."
  },
  {
    id: 49,
    question: "[Co(NH₃)₆]³⁺ da N-Co-N burchagi (qo'shni) qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 0,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "oktaedr"],
    explanation: "Oktaedr geometriya. Qo'shni burchak: 90°."
  },
  {
    id: 50,
    question: "[Co(NH₃)₆]³⁺ da N-Co-N burchagi (qarama-qarshi) qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 3,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "oktaedr"],
    explanation: "Oktaedr geometriya. Qarama-qarshi burchak: 180°."
  },
  {
    id: 51,
    question: "[Fe(CO)₅] da ekvatorial C-Fe-C burchagi qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["VSEPR", "burchak", "trigonal"],
    explanation: "Trigonal bipiramida geometriya. Ekvatorial burchak: 120°."
  },
  {
    id: 52,
    question: "[Fe(CO)₅] da aksial-ekvatorial C-Fe-C burchagi qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["VSEPR", "burchak", "trigonal"],
    explanation: "Trigonal bipiramida geometriya. Aksial-ekvatorial burchak: 90°."
  },
  {
    id: 53,
    question: "Tetraedr geometriyada nechta burchak bor?",
    options: ["4", "6", "8", "12"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["VSEPR", "burchak", "tetraedr"],
    explanation: "Tetraedrda 6 ta burchak bor (har bir ligand juftligi orasida)."
  },
  {
    id: 54,
    question: "Oktaedr geometriyada nechta 90° burchak bor?",
    options: ["6", "8", "12", "24"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["VSEPR", "burchak", "oktaedr"],
    explanation: "Oktaedrda 12 ta 90° burchak bor."
  },
  {
    id: 55,
    question: "Kvadrat tekislikda nechta 90° burchak bor?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["VSEPR", "burchak", "kvadrat"],
    explanation: "Kvadrat tekislikda 4 ta 90° burchak bor (qo'shni ligandlar orasida)."
  },
  {
    id: 56,
    question: "[Zn(NH₃)₄]²⁺ da N-Zn-N burchagi qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 1,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "tetraedr"],
    explanation: "Tetraedr geometriya. Burchak: 109.5°."
  },
  {
    id: 57,
    question: "[Cu(NH₃)₄]²⁺ da N-Cu-N burchagi (qo'shni) qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 0,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "kvadrat"],
    explanation: "Kvadrat tekislik geometriya. Qo'shni burchak: 90°."
  },
  {
    id: 58,
    question: "Chiziqli geometriyada nechta burchak bor?",
    options: ["1", "2", "3", "4"],
    correct: 0,
    difficulty: "oson",
    tags: ["VSEPR", "burchak", "chiziqli"],
    explanation: "Chiziqli geometriyada 1 ta burchak bor (180°)."
  },
  {
    id: 59,
    question: "Trigonal bipiramida geometriyada nechta 90° burchak bor?",
    options: ["3", "6", "9", "12"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["VSEPR", "burchak", "trigonal"],
    explanation: "Trigonal bipiramida geometriyada 6 ta 90° burchak bor (aksial-ekvatorial)."
  },
  {
    id: 60,
    question: "[Pt(NH₃)₂Cl₂] da Cl-Pt-Cl burchagi (trans-izomer) qancha?",
    options: ["90°", "109.5°", "120°", "180°"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["VSEPR", "burchak", "kvadrat", "trans"],
    explanation: "Trans-izomerda qarama-qarshi ligandlar. Burchak: 180°."
  },

  // ═══════════════════════════════════════════════════════════
  // 4-GURUH: FAZOVIY IZOMERIYA - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 61,
    question: "[Pt(NH₃)₂Cl₂] nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "oson",
    tags: ["izomeriya", "geometrik", "cis_trans"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 62,
    question: "cis-[Pt(NH₃)₂Cl₂] da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "oson",
    tags: ["izomeriya", "geometrik", "cis"],
    explanation: "cis-izomerda bir xil ligandlar 90° burchak ostida (qo'shni)."
  },
  {
    id: 63,
    question: "trans-[Pt(NH₃)₂Cl₂] da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "oson",
    tags: ["izomeriya", "geometrik", "trans"],
    explanation: "trans-izomerda bir xil ligandlar 180° burchak ostida (qarama-qarshi)."
  },
  {
    id: 64,
    question: "[Co(NH₃)₄Cl₂]⁺ nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "cis_trans"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 65,
    question: "cis-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "cis"],
    explanation: "cis-izomerda bir xil ligandlar 90° burchak ostida."
  },
  {
    id: 66,
    question: "trans-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "trans"],
    explanation: "trans-izomerda bir xil ligandlar 180° burchak ostida."
  },
  {
    id: 67,
    question: "[Co(NH₃)₃Cl₃] nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "fac_mer"],
    explanation: "2 ta geometrik izomer: fac va mer."
  },
  {
    id: 68,
    question: "fac-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab", "Qarama-qarshi", "Tasodifiy"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "fac"],
    explanation: "fac-izomerda bir xil ligandlar bir yuzda (facial) joylashgan."
  },
  {
    id: 69,
    question: "mer-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab", "Qarama-qarshi", "Tasodifiy"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "mer"],
    explanation: "mer-izomerda bir xil ligandlar meridian bo'ylab joylashgan."
  },
  {
    id: 70,
    question: "[Co(en)₃]³⁺ qaysi turdagi izomeriyaga ega?",
    options: ["Geometrik izomeriya", "Optik izomeriya", "Linkage izomeriya", "Koordinatsion izomeriya"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "optik", "enantiomer"],
    explanation: "[Co(en)₃]³⁺ — optik izomeriyaga ega (Δ va Λ enantiomerlar)."
  },
  {
    id: 71,
    question: "Δ-[Co(en)₃]³⁺ va Λ-[Co(en)₃]³⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar (enantiomerlar)", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "optik", "enantiomer"],
    explanation: "Δ va Λ — optik izomerlar (enantiomerlar). Ular bir-birining ko'zgudagi aksidir."
  },
  {
    id: 72,
    question: "[Co(en)₂Cl₂]⁺ nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomeriya", "geometrik", "cis_trans"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 73,
    question: "cis-[Co(en)₂Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["izomeriya", "optik", "enantiomer"],
    explanation: "cis-izomer xiral, 2 ta optik izomer (Δ va Λ) mavjud."
  },
  {
    id: 74,
    question: "trans-[Co(en)₂Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["izomeriya", "optik", "axiral"],
    explanation: "trans-izomer axiral (simmetriya tekisligi bor), optik izomer yo'q."
  },
  {
    id: 75,
    question: "[Co(NH₃)₅(NO₂)]²⁺ va [Co(NH₃)₅(ONO)]²⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["izomeriya", "linkage", "ambidentat"],
    explanation: "Linkage izomerlar. NO₂⁻ ambidentat ligand (N yoki O orqali bog'lanadi)."
  },
  {
    id: 76,
    question: "[Co(NH₃)₅(SCN)]²⁺ va [Co(NH₃)₅(NCS)]²⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["izomeriya", "linkage", "ambidentat"],
    explanation: "Linkage izomerlar. SCN⁻ ambidentat ligand (S yoki N orqali bog'lanadi)."
  },
  {
    id: 77,
    question: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["izomeriya", "koordinatsion"],
    explanation: "Koordinatsion izomerlar. Kation va anion komplekslar o'rin almashgan."
  },
  {
    id: 78,
    question: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]ClBr qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["izomeriya", "ionlanish"],
    explanation: "Ionlanish izomerlar. Cl⁻ va Br⁻ o'rin almashgan (kation ichida va tashqarisida)."
  },
  {
    id: 79,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ va [Co(NH₃)₅Cl]Cl₂·H₂O qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Gidrat izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["izomeriya", "gidrat"],
    explanation: "Gidrat izomerlar. H₂O kation ichida va tashqarisida."
  },
  {
    id: 80,
    question: "[Co(en)₃]³⁺ ning nechta optik izomeri bor?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["izomeriya", "optik", "enantiomer"],
    explanation: "2 ta optik izomer: Δ va Λ enantiomerlar."
  },

  // ═══════════════════════════════════════════════════════════
  // 5-GURUH: KRISTALL MAYDON NAZARIYASI - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 81,
    question: "Oktaedr kompleksda d-orbitallar nechta guruhga bo'linadi?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    tags: ["kristall_maydon", "oktaedr", "orbital"],
    explanation: "2 guruh: t₂g (3 ta orbital) va eg (2 ta orbital).",
    difficulty: "oson"
  },
  {
    id: 82,
    question: "Oktaedr kompleksda t₂g orbitallariga qaysilar kiradi?",
    options: ["dxy, dxz, dyz", "dx²-y², dz²", "barchasi", "hech qaysi"],
    correct: 0,
    tags: ["kristall_maydon", "oktaedr", "orbital"],
    explanation: "t₂g: dxy, dxz, dyz (3 ta orbital).",
    difficulty: "oson"
  },
  {
    id: 83,
    question: "Oktaedr kompleksda eg orbitallariga qaysilar kiradi?",
    options: ["dxy, dxz, dyz", "dx²-y², dz²", "barchasi", "hech qaysi"],
    correct: 1,
    tags: ["kristall_maydon", "oktaedr", "orbital"],
    explanation: "eg: dx²-y², dz² (2 ta orbital).",
    difficulty: "oson"
  },
  {
    id: 84,
    question: "Oktaedr kompleksda qaysi orbitallar yuqori energiyaga ega?",
    options: ["t₂g", "eg", "barchasi bir xil", "hech qaysi"],
    correct: 1,
    tags: ["kristall_maydon", "oktaedr", "orbital"],
    explanation: "eg orbitallari yuqori energiyaga ega (ligandlar bilan to'g'ridan-to'g'ri o'zaro ta'sir).",
    difficulty: "oson"
  },
  {
    id: 85,
    question: "Δo (oktaedr bo'linish energiyasi) nima?",
    options: ["t₂g va eg orasidagi energiya farqi", "Barcha d-orbitallar energiyasi", "Ligand energiyasi", "Metall energiyasi"],
    correct: 0,
    tags: ["kristall_maydon", "oktaedr", "delta_o"],
    explanation: "Δo = E(eg) - E(t₂g) — oktaedr bo'linish energiyasi.",
    difficulty: "oson"
  },
  {
    id: 86,
    question: "Past spinli kompleks qachon hosil bo'ladi?",
    options: ["Δo > P", "Δo < P", "Δo = P", "Δo = 0"],
    correct: 0,
    tags: ["kristall_maydon", "past_spin", "yuqori_spin"],
    explanation: "Δo > P (bo'linish energiyasi > juftlanish energiyasi) → past spinli.",
    difficulty: "o'rta"
  },
  {
    id: 87,
    question: "Yuqori spinli kompleks qachon hosil bo'ladi?",
    options: ["Δo > P", "Δo < P", "Δo = P", "Δo = 0"],
    correct: 1,
    tags: ["kristall_maydon", "past_spin", "yuqori_spin"],
    explanation: "Δo < P (bo'linish energiyasi < juftlanish energiyasi) → yuqori spinli.",
    difficulty: "o'rta"
  },
  {
    id: 88,
    question: "[Fe(H₂O)₆]²⁺ qanday kompleks?",
    options: ["Past spinli", "Yuqori spinli", "Aralash spinli", "Hech qaysi"],
    correct: 1,
    tags: ["kristall_maydon", "yuqori_spin", "Fe"],
    explanation: "H₂O kuchsiz ligand → Δo kichik → yuqori spinli.",
    difficulty: "o'rta"
  },
  {
    id: 89,
    question: "[Fe(CN)₆]⁴⁻ qanday kompleks?",
    options: ["Past spinli", "Yuqori spinli", "Aralash spinli", "Hech qaysi"],
    correct: 0,
    tags: ["kristall_maydon", "past_spin", "Fe"],
    explanation: "CN⁻ kuchli ligand → Δo katta → past spinli.",
    difficulty: "o'rta"
  },
  {
    id: 90,
    question: "Spektrokimyoviy qatorda eng kuchli ligand qaysi?",
    options: ["I⁻", "Br⁻", "Cl⁻", "CN⁻"],
    correct: 3,
    tags: ["kristall_maydon", "spektrokimyoviy_qator", "ligand"],
    explanation: "CN⁻ eng kuchli ligand (katta Δo).",
    difficulty: "oson"
  },
  {
    id: 91,
    question: "Spektrokimyoviy qatorda eng kuchsiz ligand qaysi?",
    options: ["I⁻", "Br⁻", "Cl⁻", "F⁻"],
    correct: 0,
    tags: ["kristall_maydon", "spektrokimyoviy_qator", "ligand"],
    explanation: "I⁻ eng kuchsiz ligand (kichik Δo).",
    difficulty: "oson"
  },
  {
    id: 92,
    question: "CFSE (kristall maydon barqarorlik energiyasi) nima?",
    options: ["d-elektronlarning bo'linishdan keyingi energiya kamayishi", "Ligand energiyasi", "Metall energiyasi", "Bog' energiyasi"],
    correct: 0,
    tags: ["kristall_maydon", "CFSE", "barqarorlik"],
    explanation: "CFSE = d-elektronlarning bo'linishdan keyingi energiya kamayishi.",
    difficulty: "o'rta"
  },
  {
    id: 93,
    question: "[Co(NH₃)₆]³⁺ ning CFSE qancha? (past spinli, t₂g⁶)",
    options: ["-2.4 Δo", "-1.2 Δo", "-0.4 Δo", "0"],
    correct: 0,
    tags: ["kristall_maydon", "CFSE", "hisoblash"],
    explanation: "CFSE = 6 × (-0.4 Δo) = -2.4 Δo.",
    difficulty: "qiyin"
  },
  {
    id: 94,
    question: "[Fe(H₂O)₆]²⁺ ning CFSE qancha? (yuqori spinli, t₂g⁴eg²)",
    options: ["-2.4 Δo", "-1.2 Δo", "-0.4 Δo", "0"],
    correct: 2,
    tags: ["kristall_maydon", "CFSE", "hisoblash"],
    explanation: "CFSE = 4 × (-0.4 Δo) + 2 × (0.6 Δo) = -1.6 Δo + 1.2 Δo = -0.4 Δo.",
    difficulty: "qiyin"
  },
  {
    id: 95,
    question: "Tetraedr kompleksda d-orbitallar nechta guruhga bo'linadi?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    tags: ["kristall_maydon", "tetraedr", "orbital"],
    explanation: "2 guruh: e (2 ta orbital) va t₂ (3 ta orbital).",
    difficulty: "o'rta"
  },
  {
    id: 96,
    question: "Tetraedr kompleksda qaysi orbitallar yuqori energiyaga ega?",
    options: ["e", "t₂", "barchasi bir xil", "hech qaysi"],
    correct: 1,
    tags: ["kristall_maydon", "tetraedr", "orbital"],
    explanation: "t₂ orbitallari yuqori energiyaga ega.",
    difficulty: "o'rta"
  },
  {
    id: 97,
    question: "Δt (tetraedr bo'linish energiyasi) Δo bilan qanday bog'liq?",
    options: ["Δt = Δo", "Δt = 4/9 Δo", "Δt = 9/4 Δo", "Δt = 2 Δo"],
    correct: 1,
    tags: ["kristall_maydon", "tetraedr", "delta_t"],
    explanation: "Δt = 4/9 Δo (tetraedr bo'linishi kichikroq).",
    difficulty: "qiyin"
  },
  {
    id: 98,
    question: "Tetraedr komplekslar odatda qanday bo'ladi?",
    options: ["Past spinli", "Yuqori spinli", "Aralash spinli", "Hech qaysi"],
    correct: 1,
    tags: ["kristall_maydon", "tetraedr", "spin"],
    explanation: "Δt kichik → odatda yuqori spinli.",
    difficulty: "o'rta"
  },
  {
    id: 99,
    question: "Kvadrat tekislik kompleksda d-orbitallar nechta guruhga bo'linadi?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    tags: ["kristall_maydon", "kvadrat", "orbital"],
    explanation: "4 guruh (murakkab bo'linish).",
    difficulty: "qiyin"
  },
  {
    id: 100,
    question: "Kvadrat tekislik kompleksda qaysi orbital eng yuqori energiyaga ega?",
    options: ["dxy", "dx²-y²", "dz²", "dxz"],
    correct: 1,
    tags: ["kristall_maydon", "kvadrat", "orbital"],
    explanation: "dx²-y² eng yuqori energiyaga ega (ligandlar bilan to'g'ridan-to'g'ri o'zaro ta'sir).",
    difficulty: "qiyin"
  }
]