// app/oquv/video-darsliklar/quiz/izomeriya/data.js

/**
 * Izomeriya Quiz - Savol bazasi (100+ savol)
 * Mavzular: strukturaviy izomeriya, geometrik izomeriya, optik izomeriya
 */

export const QUIZ_BANK = [
  // ═══════════════════════════════════════════════════════════
  // 1-GURUH: IONLANISH IZOMERIYASI - 20 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 1,
    question: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]ClBr qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerlar. Cl⁻ va Br⁻ o'rin almashgan (kation ichida va tashqarisida)."
  },
  {
    id: 2,
    question: "[Co(NH₃)₅Br]SO₄ va [Co(NH₃)₅SO₄]Br qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Gidrat izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerlar. Br⁻ va SO₄²⁻ o'rin almashgan."
  },
  {
    id: 3,
    question: "[Co(NH₃)₆]Cl₃ nechta ionlanish izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomeri yo'q. Barcha ligandlar bir xil (NH₃)."
  },
  {
    id: 4,
    question: "[Pt(NH₃)₄Cl₂]Br₂ va [Pt(NH₃)₄Br₂]Cl₂ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerlar. Cl⁻ va Br⁻ o'rin almashgan."
  },
  {
    id: 5,
    question: "Ionlanish izomerlarini qanday ajratish mumkin?",
    options: ["Rangi bo'yicha", "Cho'kma reaksiyalari bilan", "Harorat bo'yicha", "Magnit xossasi bo'yicha"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya", "ajratish"],
    explanation: "Cho'kma reaksiyalari bilan. Masalan, AgNO₃ qo'shilsa, Cl⁻ yoki Br⁻ cho'kma beradi."
  },
  {
    id: 6,
    question: "[Co(en)₂Cl₂]Br va [Co(en)₂ClBr]Cl qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Koordinatsion izomerlar"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerlar. Cl⁻ va Br⁻ o'rin almashgan."
  },
  {
    id: 7,
    question: "[Co(NH₃)₄Cl₂]Cl va [Co(NH₃)₄Cl]Cl₂ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Bunday izomerlar yo'q"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Bunday izomerlar yo'q. Koordinatsion son o'zgargan (6 dan 5 ga)."
  },
  {
    id: 8,
    question: "[Cr(H₂O)₆]Cl₃ va [Cr(H₂O)₅Cl]Cl₂·H₂O qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Gidrat izomerlar", "Geometrik izomerlar", "Optik izomerlar"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["gidrat", "izomeriya"],
    explanation: "Gidrat izomerlar. H₂O kation ichida va tashqarisida."
  },
  {
    id: 9,
    question: "[Co(NH₃)₅(NO₃)]SO₄ va [Co(NH₃)₅(SO₄)]NO₃ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar", "Ionlanish izomerlar", "Linkage izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya"],
    explanation: "Ionlanish izomerlar. NO₃⁻ va SO₄²⁻ o'rin almashgan."
  },
  {
    id: 10,
    question: "Ionlanish izomerlarining qaysi xossasi farq qiladi?",
    options: ["Rangi", "Elektr o'tkazuvchanlik", "Magnit xossasi", "Barchasi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["ionlanish", "izomeriya", "xossa"],
    explanation: "Elektr o'tkazuvchanlik farq qiladi (ionlar soni o'zgaradi)."
  },
  {
    id: 11,
    question: "[Pt(NH₃)₄][PtCl₄] va [Pt(NH₃)₃Cl][Pt(NH₃)Cl₃] qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Geometrik izomerlar", "Optik izomerlar"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["koordinatsion", "izomeriya"],
    explanation: "Koordinatsion izomerlar. Ligandlar ikkala kompleks orasida o'rin almashgan."
  },
  {
    id: 12,
    question: "[Cu(NH₃)₄][PtCl₄] va [Pt(NH₃)₄][CuCl₄] qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Geometrik izomerlar", "Optik izomerlar"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["koordinatsion", "izomeriya"],
    explanation: "Koordinatsion izomerlar. Metall atomlari o'rin almashgan."
  },
  {
    id: 13,
    question: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Geometrik izomerlar", "Optik izomerlar"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["koordinatsion", "izomeriya"],
    explanation: "Koordinatsion izomerlar. Co va Cr o'rin almashgan."
  },
  {
    id: 14,
    question: "[Co(NH₃)₅(SCN)][Zn(CN)₄] va [Zn(NH₃)₅(CN)][Co(CN)₃(SCN)] qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Linkage izomerlar", "Barchasi"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["koordinatsion", "linkage", "izomeriya"],
    explanation: "Koordinatsion va linkage izomerlar (SCN⁻ ambidentat)."
  },
  {
    id: 15,
    question: "Koordinatsion izomeriya qachon yuzaga keladi?",
    options: ["Kation kompleksda", "Anion kompleksda", "Ikkala qism ham kompleks bo'lganda", "Neytral kompleksda"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["koordinatsion", "izomeriya"],
    explanation: "Koordinatsion izomeriya faqat ikkala qism ham kompleks bo'lganda yuzaga keladi."
  },
  {
    id: 16,
    question: "[Co(NH₃)₅(ONO)]Cl₂ va [Co(NH₃)₅(NO₂)]Cl₂ qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Linkage izomerlar", "Geometrik izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["linkage", "izomeriya"],
    explanation: "Linkage izomerlar. NO₂⁻ ambidentat ligand (N yoki O orqali)."
  },
  {
    id: 17,
    question: "[Co(NH₃)₅(SCN)]Cl₂ va [Co(NH₃)₅(NCS)]Cl₂ qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Koordinatsion izomerlar", "Linkage izomerlar", "Geometrik izomerlar"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["linkage", "izomeriya"],
    explanation: "Linkage izomerlar. SCN⁻ ambidentat ligand (S yoki N orqali)."
  },
  {
    id: 18,
    question: "Linkage izomeriya qaysi ligandlarda yuzaga keladi?",
    options: ["Monodentat", "Bidentat", "Ambidentat", "Polidentat"],
    correct: 2,
    difficulty: "oson",
    tags: ["linkage", "izomeriya", "ligand"],
    explanation: "Linkage izomeriya ambidentat ligandlarda yuzaga keladi (NO₂⁻, SCN⁻, CN⁻)."
  },
  {
    id: 19,
    question: "Qaysi ligand linkage izomeriya hosil qilmaydi?",
    options: ["NO₂⁻", "SCN⁻", "CN⁻", "NH₃"],
    correct: 3,
    difficulty: "oson",
    tags: ["linkage", "izomeriya", "ligand"],
    explanation: "NH₃ ambidentat emas, faqat N orqali bog'lanadi."
  },
  {
    id: 20,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ va [Co(NH₃)₅Cl]Cl₂·H₂O qanday izomerlar?",
    options: ["Ionlanish izomerlar", "Gidrat izomerlar", "Linkage izomerlar", "Geometrik izomerlar"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["gidrat", "izomeriya"],
    explanation: "Gidrat izomerlar. H₂O kation ichida va tashqarisida."
  },

  // ═══════════════════════════════════════════════════════════
  // 2-GURUH: GEOMETRIK IZOMERIYA (CIS/TRANS) - 25 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 21,
    question: "[Pt(NH₃)₂Cl₂] nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "oson",
    tags: ["geometrik", "cis_trans", "kvadrat"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 22,
    question: "cis-[Pt(NH₃)₂Cl₂] da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometrik", "cis", "kvadrat"],
    explanation: "cis-izomerda bir xil ligandlar 90° burchak ostida (qo'shni)."
  },
  {
    id: 23,
    question: "trans-[Pt(NH₃)₂Cl₂] da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "oson",
    tags: ["geometrik", "trans", "kvadrat"],
    explanation: "trans-izomerda bir xil ligandlar 180° burchak ostida (qarama-qarshi)."
  },
  {
    id: 24,
    question: "cis-[Pt(NH₃)₂Cl₂] ning tibbiy nomi qanday?",
    options: ["Cisplatin", "Transplatin", "Karboptin", "Oksaliplatin"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometrik", "cis", "tibbiyot"],
    explanation: "cis-[Pt(NH₃)₂Cl₂] — Cisplatin (saraton kasalligiga qarshi dori)."
  },
  {
    id: 25,
    question: "[Co(NH₃)₄Cl₂]⁺ nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "cis_trans", "oktaedr"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 26,
    question: "cis-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "cis", "oktaedr"],
    explanation: "cis-izomerda bir xil ligandlar 90° burchak ostida."
  },
  {
    id: 27,
    question: "trans-[Co(NH₃)₄Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "trans", "oktaedr"],
    explanation: "trans-izomerda bir xil ligandlar 180° burchak ostida."
  },
  {
    id: 28,
    question: "[Co(NH₃)₃Cl₃] nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "fac_mer", "oktaedr"],
    explanation: "2 ta geometrik izomer: fac va mer."
  },
  {
    id: 29,
    question: "fac-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab", "Qarama-qarshi", "Tasodifiy"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "fac", "oktaedr"],
    explanation: "fac-izomerda bir xil ligandlar bir yuzda (facial) joylashgan."
  },
  {
    id: 30,
    question: "mer-[Co(NH₃)₃Cl₃] da Cl ligandlari qanday joylashgan?",
    options: ["Bir yuzda (facial)", "Meridian bo'ylab", "Qarama-qarshi", "Tasodifiy"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "mer", "oktaedr"],
    explanation: "mer-izomerda bir xil ligandlar meridian bo'ylab joylashgan."
  },
  {
    id: 31,
    question: "fac-[Co(NH₃)₃Cl₃] da Cl-Cl-Cl burchagi qancha?",
    options: ["60°", "90°", "120°", "180°"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "fac", "burchak"],
    explanation: "fac-izomerda barcha Cl-Cl-Cl burchaklari 90°."
  },
  {
    id: 32,
    question: "mer-[Co(NH₃)₃Cl₃] da nechta Cl-Cl-Cl burchagi 180°?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "mer", "burchak"],
    explanation: "mer-izomerda 1 ta Cl-Cl-Cl burchagi 180°."
  },
  {
    id: 33,
    question: "[Co(en)₂Cl₂]⁺ nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "cis_trans", "oktaedr"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 34,
    question: "cis-[Co(en)₂Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "cis", "oktaedr"],
    explanation: "cis-izomerda Cl ligandlari 90° burchak ostida."
  },
  {
    id: 35,
    question: "trans-[Co(en)₂Cl₂]⁺ da Cl ligandlari qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "trans", "oktaedr"],
    explanation: "trans-izomerda Cl ligandlari 180° burchak ostida."
  },
  {
    id: 36,
    question: "[Co(NH₃)₄ClBr]⁺ nechta geometrik izomerga ega?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "cis_trans", "oktaedr"],
    explanation: "2 ta geometrik izomer: cis va trans."
  },
  {
    id: 37,
    question: "cis-[Co(NH₃)₄ClBr]⁺ da Cl va Br qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["geometrik", "cis", "oktaedr"],
    explanation: "cis-izomerda Cl va Br 90° burchak ostida."
  },
  {
    id: 38,
    question: "trans-[Co(NH₃)₄ClBr]⁺ da Cl va Br qanday joylashgan?",
    options: ["90° burchak ostida", "180° burchak ostida", "120° burchak ostida", "60° burchak ostida"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["geometrik", "trans", "oktaedr"],
    explanation: "trans-izomerda Cl va Br 180° burchak ostida."
  },
  {
    id: 39,
    question: "[Pt(NH₃)(py)ClBr] nechta geometrik izomerga ega? (py = piridin)",
    options: ["1", "2", "3", "4"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["geometrik", "kvadrat", "murakkab"],
    explanation: "3 ta geometrik izomer (har xil ligandlar juftligi)."
  },
  {
    id: 40,
    question: "Kvadrat tekislik kompleksida nechta geometrik izomer bo'lishi mumkin?",
    options: ["0 yoki 1", "0, 1 yoki 2", "0, 1, 2 yoki 3", "0 dan 4 gacha"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["geometrik", "kvadrat", "nazariya"],
    explanation: "Kvadrat tekislikda 0, 1, 2 yoki 3 geometrik izomer bo'lishi mumkin."
  },
  {
    id: 41,
    question: "Oktaedr kompleksida nechta geometrik izomer bo'lishi mumkin?",
    options: ["0 yoki 1", "0, 1 yoki 2", "0, 1, 2 yoki 3", "0 dan ko'p"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["geometrik", "oktaedr", "nazariya"],
    explanation: "Oktaedrda 0 dan ko'p geometrik izomer bo'lishi mumkin."
  },
  {
    id: 42,
    question: "[Co(NH₃)₅Cl]²⁺ nechta geometrik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometrik", "oktaedr"],
    explanation: "Geometrik izomer yo'q. Faqat 1 ta Cl ligandi bor."
  },
  {
    id: 43,
    question: "[Co(NH₃)₆]³⁺ nechta geometrik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "oson",
    tags: ["geometrik", "oktaedr"],
    explanation: "Geometrik izomer yo'q. Barcha ligandlar bir xil."
  },
  {
    id: 44,
    question: "cis-[Co(en)₂Cl₂]⁺ ning rangi qanday?",
    options: ["Binafsha", "Yashil", "Sariq", "Rangsiz"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["geometrik", "cis", "rang"],
    explanation: "cis-[Co(en)₂Cl₂]⁺ — binafsha rangli."
  },
  {
    id: 45,
    question: "trans-[Co(en)₂Cl₂]⁺ ning rangi qanday?",
    options: ["Binafsha", "Yashil", "Sariq", "Rangsiz"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["geometrik", "trans", "rang"],
    explanation: "trans-[Co(en)₂Cl₂]⁺ — yashil rangli."
  },

  // ═══════════════════════════════════════════════════════════
  // 3-GURUH: OPTIK IZOMERIYA - 25 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 46,
    question: "[Co(en)₃]³⁺ qaysi turdagi izomeriyaga ega?",
    options: ["Geometrik izomeriya", "Optik izomeriya", "Linkage izomeriya", "Koordinatsion izomeriya"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "enantiomer"],
    explanation: "[Co(en)₃]³⁺ — optik izomeriyaga ega (Δ va Λ enantiomerlar)."
  },
  {
    id: 47,
    question: "Δ-[Co(en)₃]³⁺ va Λ-[Co(en)₃]³⁺ qanday izomerlar?",
    options: ["Geometrik izomerlar", "Optik izomerlar (enantiomerlar)", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "enantiomer"],
    explanation: "Δ va Λ — optik izomerlar (enantiomerlar). Ular bir-birining ko'zgudagi aksidir."
  },
  {
    id: 48,
    question: "[Co(en)₃]³⁺ ning nechta optik izomeri bor?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["optik", "enantiomer"],
    explanation: "2 ta optik izomer: Δ va Λ enantiomerlar."
  },
  {
    id: 49,
    question: "Optik izomerlar qanday xossa bilan farqlanadi?",
    options: ["Rangi", "Qaytarilgan yorug'lik yo'nalishi", "Harorat", "Magnit xossasi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "xossa"],
    explanation: "Optik izomerlar qaytarilgan yorug'lik yo'nalishi bilan farqlanadi."
  },
  {
    id: 50,
    question: "Dextro (d) izomer nima qiladi?",
    options: ["Yorug'likni soat yo'nalishida qaytaradi", "Yorug'likni soatga qarshi qaytaradi", "Yorug'likni qaytarmaydi", "Yorug'likni yutadi"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["optik", "dextro"],
    explanation: "Dextro (d) izomer yorug'likni soat yo'nalishida qaytaradi (+)."
  },
  {
    id: 51,
    question: "Levo (l) izomer nima qiladi?",
    options: ["Yorug'likni soat yo'nalishida qaytaradi", "Yorug'likni soatga qarshi qaytaradi", "Yorug'likni qaytarmaydi", "Yorug'likni yutadi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "levo"],
    explanation: "Levo (l) izomer yorug'likni soatga qarshi qaytaradi (-)."
  },
  {
    id: 52,
    question: "Rasemik aralashma nima?",
    options: ["Faqat d-izomer", "Faqat l-izomer", "d va l izomerlarning teng aralashmasi", "Barcha izomerlar aralashmasi"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["optik", "rasemik"],
    explanation: "Rasemik aralashma — d va l izomerlarning teng aralashmasi (optik faol emas)."
  },
  {
    id: 53,
    question: "cis-[Co(en)₂Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["optik", "cis", "enantiomer"],
    explanation: "cis-izomer xiral, 2 ta optik izomer (Δ va Λ) mavjud."
  },
  {
    id: 54,
    question: "trans-[Co(en)₂Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["optik", "trans", "axiral"],
    explanation: "trans-izomer axiral (simmetriya tekisligi bor), optik izomer yo'q."
  },
  {
    id: 55,
    question: "Xiral molekula nima?",
    options: ["Simmetriya tekisligi bor", "Simmetriya tekisligi yo'q", "Simmetriya markazi bor", "Barchasi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "xiral"],
    explanation: "Xiral molekula — simmetriya tekisligi yo'q (ko'zgudagi aksi bilan ustma-ust tushmaydi)."
  },
  {
    id: 56,
    question: "Axiral molekula nima?",
    options: ["Simmetriya tekisligi bor", "Simmetriya tekisligi yo'q", "Optik faol", "Xiral"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["optik", "axiral"],
    explanation: "Axiral molekula — simmetriya tekisligi bor (optik faol emas)."
  },
  {
    id: 57,
    question: "[Co(ox)₃]³⁺ nechta optik izomerga ega? (ox = oksalat)",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer"],
    explanation: "2 ta optik izomer: Δ va Λ enantiomerlar."
  },
  {
    id: 58,
    question: "[Cr(ox)₃]³⁻ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer"],
    explanation: "2 ta optik izomer: Δ va Λ enantiomerlar."
  },
  {
    id: 59,
    question: "[Fe(ox)₃]³⁻ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer"],
    explanation: "2 ta optik izomer: Δ va Λ enantiomerlar."
  },
  {
    id: 60,
    question: "Δ va Λ belgilari nima uchun ishlatiladi?",
    options: ["Geometrik izomerlar uchun", "Optik izomerlar uchun", "Linkage izomerlar uchun", "Koordinatsion izomerlar uchun"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["optik", "belgi"],
    explanation: "Δ va Λ — optik izomerlarni belgilash uchun ishlatiladi."
  },
  {
    id: 61,
    question: "Δ-izomer qanday konfiguratsiyaga ega?",
    options: ["O'ng qo'l", "Chap qo'l", "Aralash", "Aniqlab bo'lmaydi"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["optik", "delta"],
    explanation: "Δ-izomer — o'ng qo'l konfiguratsiya (dextro)."
  },
  {
    id: 62,
    question: "Λ-izomer qanday konfiguratsiyaga ega?",
    options: ["O'ng qo'l", "Chap qo'l", "Aralash", "Aniqlab bo'lmaydi"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "lambda"],
    explanation: "Λ-izomer — chap qo'l konfiguratsiya (levo)."
  },
  {
    id: 63,
    question: "Enantiomerlar qanday xossalari bir xil?",
    options: ["Fizik xossalar", "Kimyoviy xossalar", "Optik xossalar", "A va B"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["optik", "enantiomer", "xossa"],
    explanation: "Enantiomerlarning fizik va kimyoviy xossalari bir xil (faqat optik xossalari farq qiladi)."
  },
  {
    id: 64,
    question: "Diastereomerlar nima?",
    options: ["Ko'zgudagi akslar", "Ko'zgudagi akslar emas", "Bir xil molekulalar", "Barchasi"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "diastereomer"],
    explanation: "Diastereomerlar — ko'zgudagi akslar emas (fizik xossalari farq qiladi)."
  },
  {
    id: 65,
    question: "cis-[Co(en)₂Cl₂]⁺ va trans-[Co(en)₂Cl₂]⁺ qanday izomerlar?",
    options: ["Enantiomerlar", "Diastereomerlar", "Linkage izomerlar", "Koordinatsion izomerlar"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["optik", "diastereomer"],
    explanation: "cis va trans — diastereomerlar (geometrik izomerlar)."
  },
  {
    id: 66,
    question: "[Co(NH₃)₄Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["optik", "axiral"],
    explanation: "Optik izomer yo'q (axiral, simmetriya tekisligi bor)."
  },
  {
    id: 67,
    question: "[Co(NH₃)₃Cl₃] nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 0,
    difficulty: "o'rta",
    tags: ["optik", "axiral"],
    explanation: "Optik izomer yo'q (axiral)."
  },
  {
    id: 68,
    question: "[Co(en)(NH₃)₂Cl₂]⁺ nechta optik izomerga ega?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["optik", "enantiomer"],
    explanation: "2 ta optik izomer (cis-izomer xiral)."
  },
  {
    id: 69,
    question: "Optik izomerlarni qanday ajratish mumkin?",
    options: ["Distillash", "Kristallizatsiya", "Xiral reagentlar bilan", "Barchasi"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["optik", "ajratish"],
    explanation: "Optik izomerlarni xiral reagentlar bilan ajratish mumkin."
  },
  {
    id: 70,
    question: "Polarimetr nima uchun ishlatiladi?",
    options: ["Haroratni o'lchash", "Bosimni o'lchash", "Optik aylanishni o'lchash", "Rangni o'lchash"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["optik", "asbob"],
    explanation: "Polarimetr — optik aylanishni o'lchash uchun ishlatiladi."
  },

  // ═══════════════════════════════════════════════════════════
  // 4-GURUH: IZOMERLAR SONINI HISOBLASH - 15 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 71,
    question: "[Co(NH₃)₄Cl₂]⁺ ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta geometrik izomer (cis va trans), optik izomer yo'q."
  },
  {
    id: 72,
    question: "[Co(en)₂Cl₂]⁺ ning jami nechta izomeri bor?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "3 ta izomer: trans (1 ta), cis (2 ta optik izomer)."
  },
  {
    id: 73,
    question: "[Co(en)₃]³⁺ ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta optik izomer (Δ va Λ)."
  },
  {
    id: 74,
    question: "[Pt(NH₃)₂Cl₂] ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "oson",
    tags: ["izomer_soni", "kvadrat"],
    explanation: "2 ta geometrik izomer (cis va trans)."
  },
  {
    id: 75,
    question: "[Co(NH₃)₃Cl₃] ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta geometrik izomer (fac va mer)."
  },
  {
    id: 76,
    question: "[Co(NH₃)₅Cl]²⁺ ning jami nechta izomeri bor?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    difficulty: "oson",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "1 ta izomer (geometrik va optik izomer yo'q)."
  },
  {
    id: 77,
    question: "[Co(NH₃)₆]³⁺ ning jami nechta izomeri bor?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    difficulty: "oson",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "1 ta izomer (barcha ligandlar bir xil)."
  },
  {
    id: 78,
    question: "[Co(NH₃)₄ClBr]⁺ ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta geometrik izomer (cis va trans)."
  },
  {
    id: 79,
    question: "[Pt(NH₃)(py)ClBr] ning jami nechta izomeri bor?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["izomer_soni", "kvadrat"],
    explanation: "3 ta geometrik izomer."
  },
  {
    id: 80,
    question: "[Co(ox)₂(NH₃)₂]⁻ ning jami nechta izomeri bor?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "3 ta izomer: trans (1 ta), cis (2 ta optik izomer)."
  },
  {
    id: 81,
    question: "[Co(en)(ox)₂]⁻ ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta optik izomer (Δ va Λ)."
  },
  {
    id: 82,
    question: "[Co(dien)₂]³⁺ ning jami nechta izomeri bor?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "4 ta izomer (geometrik va optik)."
  },
  {
    id: 83,
    question: "[Co(trien)Cl₂]⁺ ning jami nechta izomeri bor?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "5 ta izomer (murakkab geometrik va optik)."
  },
  {
    id: 84,
    question: "[Co(EDTA)]⁻ ning jami nechta izomeri bor?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "qiyin",
    tags: ["izomer_soni", "oktaedr"],
    explanation: "2 ta optik izomer (Δ va Λ)."
  },
  {
    id: 85,
    question: "[Pt(en)Cl₂] ning jami nechta izomeri bor?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["izomer_soni", "kvadrat"],
    explanation: "1 ta izomer (geometrik izomer yo'q, en bidentat)."
  },

  // ═══════════════════════════════════════════════════════════
  // 5-GURUH: IZOMERNI ANIQLASH - 15 ta savol
  // ═══════════════════════════════════════════════════════════
  {
    id: 86,
    question: "cis-[Pt(NH₃)₂Cl₂] qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 0,
    difficulty: "oson",
    tags: ["aniqlash", "geometrik"],
    explanation: "cis — geometrik izomer."
  },
  {
    id: 87,
    question: "Δ-[Co(en)₃]³⁺ qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 1,
    difficulty: "oson",
    tags: ["aniqlash", "optik"],
    explanation: "Δ — optik izomer (enantiomer)."
  },
  {
    id: 88,
    question: "fac-[Co(NH₃)₃Cl₃] qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 0,
    difficulty: "oson",
    tags: ["aniqlash", "geometrik"],
    explanation: "fac — geometrik izomer."
  },
  {
    id: 89,
    question: "[Co(NH₃)₅(NO₂)]²⁺ va [Co(NH₃)₅(ONO)]²⁺ qanday izomerlar?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["aniqlash", "linkage"],
    explanation: "Linkage izomerlar (NO₂⁻ ambidentat)."
  },
  {
    id: 90,
    question: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday izomerlar?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 3,
    difficulty: "o'rta",
    tags: ["aniqlash", "koordinatsion"],
    explanation: "Koordinatsion izomerlar."
  },
  {
    id: 91,
    question: "[Co(NH₃)₅Cl]Br₂ va [Co(NH₃)₅Br]ClBr qanday izomerlar?",
    options: ["Geometrik", "Optik", "Ionlanish", "Koordinatsion"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["aniqlash", "ionlanish"],
    explanation: "Ionlanish izomerlar."
  },
  {
    id: 92,
    question: "[Co(NH₃)₅(H₂O)]Cl₃ va [Co(NH₃)₅Cl]Cl₂·H₂O qanday izomerlar?",
    options: ["Geometrik", "Optik", "Gidrat", "Koordinatsion"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["aniqlash", "gidrat"],
    explanation: "Gidrat izomerlar."
  },
  {
    id: 93,
    question: "trans-[Co(en)₂Cl₂]⁺ qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 0,
    difficulty: "oson",
    tags: ["aniqlash", "geometrik"],
    explanation: "trans — geometrik izomer."
  },
  {
    id: 94,
    question: "Λ-[Co(ox)₃]³⁻ qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 1,
    difficulty: "oson",
    tags: ["aniqlash", "optik"],
    explanation: "Λ — optik izomer (enantiomer)."
  },
  {
    id: 95,
    question: "mer-[Co(NH₃)₃Cl₃] qanday izomer?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 0,
    difficulty: "oson",
    tags: ["aniqlash", "geometrik"],
    explanation: "mer — geometrik izomer."
  },
  {
    id: 96,
    question: "[Co(NH₃)₅(SCN)]²⁺ va [Co(NH₃)₅(NCS)]²⁺ qanday izomerlar?",
    options: ["Geometrik", "Optik", "Linkage", "Koordinatsion"],
    correct: 2,
    difficulty: "o'rta",
    tags: ["aniqlash", "linkage"],
    explanation: "Linkage izomerlar (SCN⁻ ambidentat)."
  },
  {
    id: 97,
    question: "[Pt(NH₃)₄][PtCl₄] va [Pt(NH₃)₃Cl][Pt(NH₃)Cl₃] qanday izomerlar?",
    options: ["Geometrik", "Optik", "Ionlanish", "Koordinatsion"],
    correct: 3,
    difficulty: "qiyin",
    tags: ["aniqlash", "koordinatsion"],
    explanation: "Koordinatsion izomerlar."
  },
  {
    id: 98,
    question: "cis-[Co(en)₂Cl₂]⁺ qanday izomer?",
    options: ["Faqat geometrik", "Faqat optik", "Geometrik va optik", "Hech qaysi"],
    correct: 2,
    difficulty: "qiyin",
    tags: ["aniqlash", "aralash"],
    explanation: "cis — geometrik izomer, shuningdek optik izomer (xiral)."
  },
  {
    id: 99,
    question: "trans-[Co(en)₂Cl₂]⁺ qanday izomer?",
    options: ["Faqat geometrik", "Faqat optik", "Geometrik va optik", "Hech qaysi"],
    correct: 0,
    difficulty: "qiyin",
    tags: ["aniqlash", "aralash"],
    explanation: "trans — faqat geometrik izomer (axiral, optik izomer yo'q)."
  },
  {
    id: 100,
    question: "[Co(en)₃]³⁺ qanday izomer?",
    options: ["Faqat geometrik", "Faqat optik", "Geometrik va optik", "Hech qaysi"],
    correct: 1,
    difficulty: "o'rta",
    tags: ["aniqlash", "aralash"],
    explanation: "[Co(en)₃]³⁺ — faqat optik izomer (geometrik izomer yo'q)."
  }
]

export default QUIZ_BANK