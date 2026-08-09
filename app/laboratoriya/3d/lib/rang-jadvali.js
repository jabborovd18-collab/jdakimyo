// Moddalar ko'rinishining YAGONA manbai.
//
// Nega alohida fayl: rang ilgari ikki joyda, ikki xil qiymat bilan yashagan —
// `modda-korinishi.js` (reagent kalitidan rang) va `kuzatuv-tahlil.js`
// (kuzatuv matnidagi rang so'zidan rang). "Sariq" ikkalasida boshqacha
// chiqardi va bitta reaksiyada eritma bir xil sariq, cho'kma boshqa sariq
// bo'lardi. Endi ikkalasi ham shu fayldan oladi.
//
// Bazada 242 ta modda bor va oldin ularning 48 tasigina jadvalda edi —
// qolgan 194 tasi bitta och-havorang qiymatga tushib, ro'yxatda ham,
// idishda ham farqsiz ko'rinardi. Bu yerda hammasi sanab chiqilgan.
//
// Ranglar o'ylab topilmagan: har biri moddaning haqiqiy ko'rinishi. Bu
// muhim, chunki mis kuporosini yashil deb eslab qolgan talaba buni keyin
// haqiqiy laboratoriyada tuzatishi qiyin.

// ─────────────────────────────────────────────────────────────
// PALITRA — nomlangan ranglar
// ─────────────────────────────────────────────────────────────
//
// Nega to'g'ridan hex yozilmaydi: 242 ta mustaqil hex qiymat "tartibli"
// bo'lolmaydi — o'nlab bir-biriga yaqin sariq paydo bo'ladi va sahna
// g'aliz ko'rinadi. Bu yerda cheklangan palitra bor, modda esa shundan
// tanlaydi. Yangi rang kerak bo'lsa avval shu ro'yxatga qo'shiladi.

export const PALITRA = {
  // ── Rangsiz va oq ──
  rangsiz: 0xe3edf8, // suv, kislota va tuz eritmalari
  oq: 0xf8fafc, // oq cho'kma va kukun
  oqSut: 0xeef2f6, // sutsimon suspenziya (ohak suvi)
  krem: 0xfdf6e3, // sarg'ish-oq (AgBr)

  // ── Sariq ──
  sariqOch: 0xfde68a,
  sariq: 0xfacc15,
  sariqToq: 0xeab308,
  oltin: 0xf5b700,

  // ── To'q sariq ──
  toqSariq: 0xea580c,
  qahrabo: 0xd97706,

  // ── Qizil va pushti ──
  qizil: 0xdc2626,
  gishtQizil: 0xb91c1c, // g'ishtsimon qizil (Cu₂O, Ag₂CrO₄)
  qonQizil: 0x991b1b, // Fe(SCN)₃ ning qon-qizili
  qizilJigar: 0x9a3412,
  toqQizil: 0x7f1d1d,
  pushtiOch: 0xfbcfe8, // Mn²⁺ ning zo'rg'a sezilar pushtisi
  pushti: 0xec4899,

  // ── Binafsha ──
  binafsha: 0x7e22ce,
  binafshaToq: 0x4c1d95, // yod kristali
  kokBinafsha: 0x6366f1,

  // ── Ko'k ──
  kok: 0x2563eb,
  misKok: 0x1d4ed8, // mis(II) eritmalari
  kokOch: 0x7dd3fc, // Cu(OH)₂ cho'kmasi
  kokToq: 0x1e3a8a, // Berlin ko'ki, ammiakli mis kompleksi
  kokYashil: 0x0e7490, // CuCl₂

  // ── Yashil ──
  yashil: 0x16a34a,
  yashilToq: 0x166534,
  yashilOch: 0x93c5a8, // temir(II) tuzlarining och yashili
  yashilSariq: 0xbef264, // xlor gazi
  yashilKul: 0x4d7c5f, // Cr(OH)₃

  // ── Jigarrang va qora ──
  jigarrang: 0x92400e,
  qora: 0x111827,
  qoraToq: 0x0f172a, // uglerod
  kuya: 0x292524, // MnO₂ ning qora-jigarrangi

  // ── Metallar ──
  kumush: 0xd1d5db,
  kulrang: 0x6b7280,
  temir: 0x71717a,
  mis: 0xb45309,
  grafit: 0x475569,
};

// ─────────────────────────────────────────────────────────────
// MODDALAR JADVALI — 242 ta
// ─────────────────────────────────────────────────────────────
//
// Yozuv shakli: "kalit": [palitra, holat, shaffoflik]
//   holat — "s" suyuq (yoki eritma), "q" qattiq, "g" gaz
//   shaffoflik — 0.05 (deyarli ko'rinmas) … 1.0 (butunlay xira)
//
// Kalitlar Unicode pastki indeks bilan yoziladi (H₂O, H2O emas) — server
// aynan shu satrni yuboradi va oddiy "H2O" hech qachon mos kelmaydi.
//
// Ko'p ishlatiladigan tuzlar "s" (eritma) deb belgilangan: talaba ularni
// idishga quyadi, kukun holida emas. Faqat cho'kma va metall "q" bo'ladi.

const J = {
  // ── Suv, kislotalar, ishqorlar ──
  "H₂O": ["rangsiz", "s", 0.12],
  "HCl": ["rangsiz", "s", 0.14],
  "H₂SO₄": ["rangsiz", "s", 0.22], // yog'simon, shuning uchun quyuqroq
  "HNO₃": ["sariqOch", "s", 0.2], // saqlanganda NO₂ dan sarg'ayadi
  "H₃PO₄": ["rangsiz", "s", 0.18],
  "CH₃COOH": ["rangsiz", "s", 0.16],
  "HBr": ["rangsiz", "s", 0.14],
  "HI": ["rangsiz", "s", 0.16],
  "HF": ["rangsiz", "s", 0.14],
  "HCOOH": ["rangsiz", "s", 0.14],
  "H₂C₂O₄": ["rangsiz", "s", 0.14],
  "H₂CO₃": ["rangsiz", "s", 0.12],
  "H₂SO₃": ["rangsiz", "s", 0.14],
  "HClO": ["rangsiz", "s", 0.14],
  "HBrO": ["rangsiz", "s", 0.14],
  "NaOH": ["rangsiz", "s", 0.16],
  "KOH": ["rangsiz", "s", 0.16],
  "Ca(OH)₂": ["oqSut", "s", 0.4], // ohak suvi — loyqa suspenziya
  "Ba(OH)₂": ["rangsiz", "s", 0.18],
  "H₂O₂": ["rangsiz", "s", 0.12],

  // ── Gazlar ──
  "H₂": ["rangsiz", "g", 0.06],
  "O₂": ["rangsiz", "g", 0.08],
  "N₂": ["rangsiz", "g", 0.06],
  "CO": ["rangsiz", "g", 0.06],
  "CO₂": ["rangsiz", "g", 0.1],
  "NH₃": ["rangsiz", "g", 0.1],
  "Cl₂": ["yashilSariq", "g", 0.35], // sarg'ish-yashil
  "F₂": ["sariqOch", "g", 0.25],
  "NO": ["rangsiz", "g", 0.08],
  "NO₂": ["toqSariq", "g", 0.45], // jigarrang-to'q sariq
  "N₂O": ["rangsiz", "g", 0.06],
  "SO₂": ["rangsiz", "g", 0.18], // rangsiz, faqat hidi o'tkir
  "SO₃": ["rangsiz", "g", 0.14],
  "H₂S": ["rangsiz", "g", 0.14],

  // ── Natriy va kaliy tuzlari (rangsiz eritmalar) ──
  "NaCl": ["rangsiz", "s", 0.14],
  "NaBr": ["rangsiz", "s", 0.14],
  "NaI": ["rangsiz", "s", 0.14],
  "Na₂SO₄": ["rangsiz", "s", 0.14],
  "Na₂SO₃": ["rangsiz", "s", 0.14],
  "Na₂CO₃": ["rangsiz", "s", 0.14],
  "NaHCO₃": ["rangsiz", "s", 0.14],
  "NaNO₃": ["rangsiz", "s", 0.14],
  "NaNO₂": ["sariqOch", "s", 0.2],
  "Na₃PO₄": ["rangsiz", "s", 0.14],
  "Na₂HPO₄": ["rangsiz", "s", 0.14],
  "NaH₂PO₄": ["rangsiz", "s", 0.14],
  "NaHSO₄": ["rangsiz", "s", 0.14],
  "Na₂S": ["rangsiz", "s", 0.16],
  "Na₂S₂O₃": ["rangsiz", "s", 0.14],
  "Na₂S₄O₆": ["rangsiz", "s", 0.14],
  "Na₂SiO₃": ["rangsiz", "s", 0.16],
  "NaClO": ["sariqOch", "s", 0.22],
  "NaAlO₂": ["rangsiz", "s", 0.14],
  "CH₃COONa": ["rangsiz", "s", 0.14],
  "KCl": ["rangsiz", "s", 0.14],
  "KBr": ["rangsiz", "s", 0.14],
  "KI": ["rangsiz", "s", 0.14],
  "KNO₃": ["rangsiz", "s", 0.14],
  "K₂SO₄": ["rangsiz", "s", 0.14],
  "K₃PO₄": ["rangsiz", "s", 0.14],
  "KClO₃": ["oq", "q", 0.9],
  "KCN": ["rangsiz", "s", 0.14],
  "KSCN": ["rangsiz", "s", 0.14],
  "Na₂O": ["oq", "q", 0.95],
  "Na": ["kumush", "q", 1],
  "K": ["kumush", "q", 1],

  // ── Ammoniy ──
  "NH₄Cl": ["rangsiz", "s", 0.14],
  "NH₄NO₃": ["rangsiz", "s", 0.14],
  "NH₄HCO₃": ["rangsiz", "s", 0.14],
  "(NH₄)₂SO₄": ["rangsiz", "s", 0.14],
  "CH₃COONH₄": ["rangsiz", "s", 0.14],
  "(NH₄)₂Cr₂O₇": ["toqSariq", "q", 0.95], // to'q sariq kristall

  // ── Mis birikmalari ──
  "CuSO₄": ["misKok", "s", 0.75],
  "CuSO₄·5H₂O": ["kok", "q", 0.95], // ko'k kristallogidrat
  "Cu(NO₃)₂": ["kok", "s", 0.72],
  "CuCl₂": ["kokYashil", "s", 0.7], // ko'k-yashil
  "Cu(OH)₂": ["kokOch", "q", 0.9], // och ko'k jelesimon cho'kma
  "CuO": ["qora", "q", 1],
  "Cu₂O": ["gishtQizil", "q", 0.95], // g'ishtsimon qizil
  "CuS": ["qora", "q", 1],
  "Cu₂S": ["qora", "q", 1],
  "Cu": ["mis", "q", 1],
  "[Cu(NH₃)₄](OH)₂": ["kokToq", "s", 0.85], // to'q ko'k kompleks
  "[Cu(NH₃)₄]SO₄": ["kokToq", "s", 0.85],

  // ── Temir birikmalari ──
  "FeCl₃": ["qahrabo", "s", 0.72], // sarg'ish-jigarrang
  "FeCl₂": ["yashilOch", "s", 0.55],
  "FeSO₄": ["yashilOch", "s", 0.55],
  "Fe₂(SO₄)₃": ["qahrabo", "s", 0.65],
  "Fe(OH)₃": ["qizilJigar", "q", 0.95], // qizil-jigarrang cho'kma
  "Fe(OH)₂": ["yashilOch", "q", 0.9], // havoda tez qorayadi
  "Fe₂O₃": ["toqQizil", "q", 1],
  "Fe₃O₄": ["qora", "q", 1],
  "Fe": ["temir", "q", 1],
  "Fe(SCN)₃": ["qonQizil", "s", 0.9], // qon-qizil — temirning sinov reaksiyasi
  "K₃[Fe(CN)₆]": ["qahrabo", "s", 0.7],
  "K₄[Fe(CN)₆]": ["sariqOch", "s", 0.6],
  "Fe₄[Fe(CN)₆]₃": ["kokToq", "q", 1], // Berlin ko'ki
  "Fe₃[Fe(CN)₆]₂": ["kokToq", "q", 1], // Turnbull ko'ki

  // ── Kumush ──
  "AgNO₃": ["rangsiz", "s", 0.15],
  "AgCl": ["oq", "q", 0.95], // oq, yorug'likda qorayadi
  "AgBr": ["krem", "q", 0.95], // och sarg'ish
  "AgI": ["sariq", "q", 0.95], // sariq
  "Ag₂CrO₄": ["gishtQizil", "q", 0.95],
  "Ag₃PO₄": ["sariq", "q", 0.95],
  "Ag": ["kumush", "q", 1],
  "[Ag(NH₃)₂]OH": ["rangsiz", "s", 0.14], // Tollens reaktivi
  "[Ag(NH₃)₂]Cl": ["rangsiz", "s", 0.14],
  "[Ag(NH₃)₂]NO₃": ["rangsiz", "s", 0.14],
  "Na₃[Ag(S₂O₃)₂]": ["rangsiz", "s", 0.14],

  // ── Rux, alyuminiy, magniy, kalsiy, bariy ──
  "ZnSO₄": ["rangsiz", "s", 0.15],
  "ZnCl₂": ["rangsiz", "s", 0.15],
  "Zn(OH)₂": ["oq", "q", 0.9],
  "ZnO": ["oq", "q", 0.95],
  "Zn": ["kulrang", "q", 1],
  "(CH₃COO)₂Zn": ["rangsiz", "s", 0.15],
  "Na₂[Zn(OH)₄]": ["rangsiz", "s", 0.15],
  "[Zn(NH₃)₄](OH)₂": ["rangsiz", "s", 0.15],
  "AlCl₃": ["rangsiz", "s", 0.15],
  "Al₂(SO₄)₃": ["rangsiz", "s", 0.15],
  "Al(OH)₃": ["oq", "q", 0.9], // oq jelesimon
  "Al₂O₃": ["oq", "q", 0.95],
  "Al": ["kumush", "q", 1],
  "Na[Al(OH)₄]": ["rangsiz", "s", 0.15],
  "MgCl₂": ["rangsiz", "s", 0.15],
  "Mg(OH)₂": ["oq", "q", 0.9],
  "MgO": ["oq", "q", 0.95],
  "MgCO₃": ["oq", "q", 0.92],
  "Mg": ["kumush", "q", 1],
  "CaCl₂": ["rangsiz", "s", 0.15],
  "CaCO₃": ["oq", "q", 0.92],
  "Ca(HCO₃)₂": ["rangsiz", "s", 0.14],
  "CaO": ["oq", "q", 0.95],
  "CaSO₄": ["oq", "q", 0.92],
  "CaSO₄·2H₂O": ["oq", "q", 0.92], // gips
  "CaSiO₃": ["oq", "q", 0.92],
  "Ca₃(PO₄)₂": ["oq", "q", 0.92],
  "CaC₂": ["kulrang", "q", 1],
  "Ca": ["kumush", "q", 1],
  "BaCl₂": ["rangsiz", "s", 0.15],
  "Ba(NO₃)₂": ["rangsiz", "s", 0.15],
  "BaSO₄": ["oq", "q", 0.95], // oq, suvda erimaydi
  "BaCrO₄": ["sariq", "q", 0.95],
  "BaO": ["oq", "q", 0.95],

  // ── Marganes, xrom, nikel, kobalt ──
  "KMnO₄": ["binafsha", "s", 0.88], // to'q binafsha
  "K₂MnO₄": ["yashil", "s", 0.8], // yashil manganat
  "MnO₂": ["kuya", "q", 1], // qora-jigarrang
  "MnSO₄": ["pushtiOch", "s", 0.35], // zo'rg'a sezilar pushti
  "MnCl₂": ["pushtiOch", "s", 0.35],
  "K₂CrO₄": ["sariq", "s", 0.8], // sariq xromat
  "K₂Cr₂O₇": ["toqSariq", "s", 0.85], // to'q sariq dixromat
  "Cr₂(SO₄)₃": ["yashil", "s", 0.75],
  "Cr(OH)₃": ["yashilKul", "q", 0.9],
  "Cr₂O₃": ["yashilToq", "q", 1],
  "Na₃[Cr(OH)₆]": ["yashil", "s", 0.7],
  "NiSO₄": ["yashil", "s", 0.72],
  "[Ni(NH₃)₆]SO₄": ["kokBinafsha", "s", 0.8],
  "CoCl₂": ["pushti", "s", 0.7],
  "[Co(NH₃)₆]Cl₂": ["pushti", "s", 0.7],

  // ── Qo'rg'oshin va simob ──
  "Pb(NO₃)₂": ["rangsiz", "s", 0.15],
  "PbI₂": ["sariq", "q", 0.95], // oltinsimon sariq cho'kma
  "PbSO₄": ["oq", "q", 0.95],
  "PbO": ["sariq", "q", 0.95],
  "HgCl₂": ["oq", "q", 0.95],
  "HgI₂": ["qizil", "q", 0.95],
  "K₂[HgI₄]": ["qahrabo", "s", 0.7], // Nessler reaktivi

  // ── Sof elementlar va oksidlar ──
  "I₂": ["binafshaToq", "q", 1], // to'q binafsha kristall
  "Br₂": ["qizilJigar", "s", 0.85], // qizil-jigarrang suyuqlik
  "S": ["sariq", "q", 1],
  "C": ["qoraToq", "q", 1],
  "P": ["qizil", "q", 1], // qizil fosfor
  "Si": ["grafit", "q", 1],
  "SiO₂": ["oq", "q", 0.9],
  "P₂O₅": ["oq", "q", 0.95],
  "N₂O₅": ["oq", "q", 0.95],
  "PCl₅": ["sariqOch", "q", 0.9],
  "POCl₃": ["rangsiz", "s", 0.14],

  // ── Ionlar (tenglamada alohida yoziladi) ──
  "H⁺": ["rangsiz", "s", 0.1],
  "OH⁻": ["rangsiz", "s", 0.1],
  "Cl⁻": ["rangsiz", "s", 0.1],
  "I⁻": ["rangsiz", "s", 0.1],
  "SCN⁻": ["rangsiz", "s", 0.1],
  "NH₄⁺": ["rangsiz", "s", 0.1],
  "CO₃²⁻": ["rangsiz", "s", 0.1],
  "SO₄²⁻": ["rangsiz", "s", 0.1],
  "SO₃²⁻": ["rangsiz", "s", 0.1],
  "Ag⁺": ["rangsiz", "s", 0.1],
  "Ba²⁺": ["rangsiz", "s", 0.1],
  "Ca²⁺": ["rangsiz", "s", 0.1],
  "Pb²⁺": ["rangsiz", "s", 0.1],
  "Cu²⁺": ["misKok", "s", 0.7],
  "Fe²⁺": ["yashilOch", "s", 0.5],
  "Fe³⁺": ["qahrabo", "s", 0.65],
  "Mn²⁺": ["pushtiOch", "s", 0.3],
  "Cr³⁺": ["yashil", "s", 0.7],
  "MnO₄⁻": ["binafsha", "s", 0.85],
  "Cr₂O₇²⁻": ["toqSariq", "s", 0.8],
  "[Cu(NH₃)₄]²⁺": ["kokToq", "s", 0.85],

  // ── Organik: uglevodorodlar (barchasi rangsiz) ──
  "CH₄": ["rangsiz", "g", 0.06],
  "C₂H₆": ["rangsiz", "g", 0.06],
  "C₃H₈": ["rangsiz", "g", 0.06],
  "C₂H₄": ["rangsiz", "g", 0.06],
  "C₃H₆": ["rangsiz", "g", 0.06],
  "C₂H₂": ["rangsiz", "g", 0.06],
  "C₆H₆": ["rangsiz", "s", 0.1],
  "C₆H₁₂": ["rangsiz", "s", 0.1],
  "C₆H₁₄": ["rangsiz", "s", 0.1],
  "C₆H₅CH₃": ["rangsiz", "s", 0.1],

  // ── Organik: galogen hosilalari ──
  "CH₃Cl": ["rangsiz", "g", 0.06],
  "CH₂Cl₂": ["rangsiz", "s", 0.1],
  "C₂H₅Br": ["rangsiz", "s", 0.12],
  "C₂H₃Cl": ["rangsiz", "g", 0.06],
  "C₂H₄Br₂": ["rangsiz", "s", 0.14],
  "C₂H₂Br₄": ["rangsiz", "s", 0.16],
  "C₆H₅Br": ["rangsiz", "s", 0.12],

  // ── Organik: spirtlar, efirlar, kislotalar ──
  "CH₃OH": ["rangsiz", "s", 0.1],
  "C₂H₅OH": ["rangsiz", "s", 0.1],
  "CH₃CH₂OH": ["rangsiz", "s", 0.1],
  "C₃H₅(OH)₃": ["rangsiz", "s", 0.16], // glitserin — qovushqoq
  "C₂H₅OC₂H₅": ["rangsiz", "s", 0.1],
  "C₂H₅ONa": ["oq", "q", 0.9],
  "CH₃CHO": ["rangsiz", "s", 0.1],
  "HCHO": ["rangsiz", "s", 0.1],
  "CH₃COOC₂H₅": ["rangsiz", "s", 0.1],
  "(CH₃CO)₂O": ["rangsiz", "s", 0.12],
  "CH₃COCl": ["rangsiz", "s", 0.12],
  "C₂H₅CN": ["rangsiz", "s", 0.12],
  "C₃H₆O₃": ["rangsiz", "s", 0.14], // sut kislota

  // ── Organik: fenollar, aminlar, nitrobirikmalar ──
  "C₆H₅OH": ["rangsiz", "q", 0.3], // toza fenol oq, havoda pushtiroq
  "C₆H₅ONa": ["rangsiz", "s", 0.15],
  "C₆H₂Br₃OH": ["oq", "q", 0.9], // oq cho'kma
  "C₆H₂(NO₂)₃OH": ["sariq", "q", 0.95], // pikrin kislota
  "C₆H₂(NO₂)₃CH₃": ["sariqOch", "q", 0.95], // trinitrotoluol
  "C₆H₅NH₂": ["krem", "s", 0.35], // anilin — havoda jigarrangga o'tadi
  "C₆H₅NH₃Cl": ["oq", "q", 0.9],
  "C₆H₅NO₂": ["sariqOch", "s", 0.5], // och sariq, achchiq bodom hidi
  "CH₃NH₂": ["rangsiz", "g", 0.06],
  "CH₃NH₃Cl": ["oq", "q", 0.9],

  // ── Organik: uglevodlar, yog'lar, sovun ──
  "C₆H₁₂O₆": ["rangsiz", "s", 0.15],
  "C₁₂H₂₂O₁₁": ["rangsiz", "s", 0.15],
  "(C₁₇H₃₅COO)₃C₃H₅": ["krem", "q", 0.9], // tristearin
  "C₁₇H₃₅COONa": ["oq", "q", 0.9], // sovun
  "CO(NH₂)₂": ["oq", "q", 0.92], // karbamid
};

// ─────────────────────────────────────────────────────────────
// KUZATUV MATNIDAGI RANG SO'ZLARI
// ─────────────────────────────────────────────────────────────
//
// Server kuzatuvni faqat o'zbekcha matn bilan beradi ("och ko'k cho'kma
// tushadi"). Bu ro'yxat shu so'zlarni yuqoridagi palitraga bog'laydi —
// shuning uchun matndan chiqqan "ko'k" bilan CuSO₄ ning ko'ki bir oilada.
//
// TARTIB MUHIM: uzunroq va aniqroq ibora oldin turadi. "to'q sariq"
// "sariq" dan keyin qolsa, u hech qachon topilmaydi.

export const KUZATUV_RANGLARI = [
  ["qizil-jigarrang", PALITRA.qizilJigar],
  ["g'ishtsimon", PALITRA.gishtQizil],
  ["qon-qizil", PALITRA.qonQizil],
  ["to'q sariq", PALITRA.toqSariq],
  ["och sariq", PALITRA.sariqOch],
  ["to'q ko'k", PALITRA.kokToq],
  ["och ko'k", PALITRA.kokOch],
  ["yashil-ko'k", PALITRA.kokYashil],
  ["ko'k-yashil", PALITRA.kokYashil],
  ["och yashil", PALITRA.yashilOch],
  ["to'q yashil", PALITRA.yashilToq],
  ["och pushti", PALITRA.pushtiOch],
  ["sarg'ish", PALITRA.sariqOch],
  ["rangsiz", PALITRA.rangsiz],
  ["kulrang", PALITRA.kulrang],
  ["binafsha", PALITRA.binafsha],
  ["jigarrang", PALITRA.jigarrang],
  ["pushti", PALITRA.pushti],
  ["sariq", PALITRA.sariq],
  ["qizil", PALITRA.qizil],
  ["yashil", PALITRA.yashil],
  ["ko'k", PALITRA.kok],
  ["qora", PALITRA.qora],
  ["oq", PALITRA.oq],
];

// ─────────────────────────────────────────────────────────────
// FIZIK EFFEKT RANGLARI
// ─────────────────────────────────────────────────────────────
//
// Bular moddaning rangi emas — hodisaning rangi. Gaz pufakchasi qanday
// modda ajralayotganidan qat'i nazar oq ko'rinadi, alanga esa to'q sariq.
// Shuning uchun palitradan alohida turadi, lekin baribir bitta joyda:
// ilgari bu qiymatlar `kuzatuv-tahlil.js` va `effektlar.js` da ikki nusxada
// yozilgan edi va biri o'zgarsa ikkinchisi eskiligicha qolardi.

export const EFFEKT_RANGLARI = {
  pufak: 0xffffff, // gaz pufakchalari
  bug: 0xe2e8f0, // hovur va bug'
  hid: 0xc4b5fd, // og'izdan tarqaluvchi halqalar
  qizish: 0xf97316, // issiqlik ajralishi (PointLight)
  alanga: 0xfb923c, // spirtovka alangasi
  tiniq: 0xffffff, // rangsizlanish nishoni
  chokmaSukut: 0x88bbee, // rang aniqlanmagan cho'kma
};

// ─────────────────────────────────────────────────────────────
// O'QISH
// ─────────────────────────────────────────────────────────────

const HOLAT_NOMI = { s: "suyuq", q: "qattiq", g: "gaz" };

/**
 * Jadvaldagi yozuvni to'liq obyektga yoyadi.
 * Jadvalda yo'q bo'lsa `null` qaytaradi — taxmin qilish
 * `modda-korinishi.js` ning ishi.
 */
export function jadvaldanOl(kalit) {
  const yozuv = J[kalit];
  if (!yozuv) return null;

  const [palitraKaliti, holatBelgisi, shaffoflik] = yozuv;
  return {
    rang: PALITRA[palitraKaliti] ?? PALITRA.rangsiz,
    holat: HOLAT_NOMI[holatBelgisi] || "suyuq",
    shaffoflik,
  };
}

/** Jadvalda nechta modda borligi — sinov skripti shuni tekshiradi. */
export function jadvalHajmi() {
  return Object.keys(J).length;
}

/** Sinov uchun: jadvaldagi barcha kalitlar. */
export function jadvalKalitlari() {
  return Object.keys(J);
}
