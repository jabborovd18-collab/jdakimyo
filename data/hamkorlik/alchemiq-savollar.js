// data/hamkorlik/alchemiq-savollar.js
//
// AlchemIQ & JDA Kimyo Mavsumiy Hamkorlik Sinov Testi uchun 30 ta sifatli savol.
// Mavzular: Kompleks birikmalar nomenklaturasi, izomeriya, fazoviy tuzilish,
// kristall maydon nazariyasi, d-elementlar kimyosi va zamonaviy koordinatsion kimyo.

export const ALCHEMIQ_SAVOLLAR = [
  {
    id: 1,
    question: "K₂[PtCl₆] kompleks birikmasida markaziy ionning oksidlanish darajasi va koordinatsion soni nechaga teng?",
    options: [
      "+4 va 6",
      "+2 va 6",
      "+4 va 4",
      "+2 va 4"
    ],
    correct: 0,
    explanation: "Kaly kationi +1 zaryadli (jami +2), [PtCl₆]²⁻ kompleks anion. Cl⁻ -1 bo'lgani uchun: Pt + 6(-1) = -2 => Pt = +4. 6 ta xlorid ligand bog'langanligi sababli KS = 6."
  },
  {
    id: 2,
    question: "[Co(NH₃)₄Cl₂]⁺ kompleksi uchun nechta geometrik (sis-trans) izomer mavjud?",
    options: [
      "1 ta",
      "2 ta (sis va trans)",
      "3 ta",
      "4 ta"
    ],
    correct: 1,
    explanation: "[MA₄B₂] tipidagi oktaedrik komplekslar uchun aynan 2 ta geometrik izomer (sis-binafsha va trans-yashil) mavjud."
  },
  {
    id: 3,
    question: "Qaysi ligand xelat hosil qiluvchi bidentat ligand hisoblanadi?",
    options: [
      "Ammiak (NH₃)",
      "Sianid (CN⁻)",
      "Etilendiamin (en = H₂NCH₂CH₂NH₂)",
      "Tiosianat (SCN⁻)"
    ],
    correct: 2,
    explanation: "Etilendiamin (en) o'zida ikkita donor azot atomiga ega bo'lib, metall bilan barqaror 5 a'zoli geterosiklik xelat halqasi hosil qiladi."
  },
  {
    id: 4,
    question: "[Fe(CN)₆]⁴⁻ kompleksi qanday magnit xususiyatga ega?",
    options: [
      "Kuchli paramagnit (4 ta toq elektron)",
      "Diamagnit (toq elektronsiz, past-spin)",
      "Paramagnit (1 ta toq elektron)",
      "Ferromagnit"
    ],
    correct: 1,
    explanation: "Fe²⁺ (d⁶) kationi kuchli maydonli CN⁻ ligandlari ta'sirida past spinli (t₂g⁶ eg⁰) holatga o'tadi, barcha elektronlar juftlashgan, shuning uchun diamagnit."
  },
  {
    id: 5,
    question: "[Ni(CO)₄] tetrakarbonilnikel molekulasining fazoviy geometriyasi va markaziy atomning gibridlanish turi qanday?",
    options: [
      "Tekis kvadrat, dsp²",
      "Tetraedrik, sp³",
      "Oktaedrik, sp³d²",
      "Trigonal bipiramida, sp³d"
    ],
    correct: 1,
    explanation: "Ni⁰ (3d⁸4s²) CO ta'sirida 3d¹⁰ holatga o'tadi va bo'sh 4s hamda 4p orbitallar sp³ gibridlanib, to'g'ri tetraedrik geometriyani hosil qiladi."
  },
  {
    id: 6,
    question: "Quyidagi komplekslarning qaysi birida bog'lanish (linkage) izomeriyasi kuzatiladi?",
    options: [
      "[Co(NH₃)₅(NO₂)]Cl₂ va [Co(NH₃)₅(ONO)]Cl₂",
      "[Co(NH₃)₅Br]SO₄ va [Co(NH₃)₅SO₄]Br",
      "[Cr(H₂O)₆]Cl₃ va [Cr(H₂O)₅Cl]Cl₂·H₂O",
      "[Pt(NH₃)₄][PtCl₄] va [Pt(NH₃)₃Cl][Pt(NH₃)Cl₃]"
    ],
    correct: 0,
    explanation: "Ambidentat NO₂⁻ ligandi N atomi orqali (nitro) yoki O atomi orqali (nitrito) bog'lanishi natijasida bog'lanish izomeriyasi yuzaga keladi."
  },
  {
    id: 7,
    question: "Kristall maydon nazariyasiga ko'ra, oktaedrik maydonda d-orbitallar qanday energetik sathlarga ajraladi?",
    options: [
      "Quyi t₂g (dxy, dyz, dxz) va yuqori eg (dx²-y², dz²)",
      "Quyi eg (dx²-y², dz²) va yuqori t₂g (dxy, dyz, dxz)",
      "Uchta teng sathga",
      "Quyi dz² va yuqori qolgan to'rttasi"
    ],
    correct: 0,
    explanation: "Oktaedrda ligandlar o'qlar bo'ylab yaqinlashgani sababli dx²-y² va dz² (eg) orbitallari ko'proq itarilib energiyasi oshadi, t₂g esa pastga siljiydi."
  },
  {
    id: 8,
    question: "Spektrokimyoviy qatorda qaysi ligand eng kuchli maydon hosil qiluvchi (kuchli maydon ligandi) hisoblanadi?",
    options: [
      "I⁻",
      "H₂O",
      "NH₃",
      "CO (uglerod oksidi)"
    ],
    correct: 3,
    explanation: "Spektrokimyoviy qatorda CO va CN⁻ eng kuchli maydon hosil qiluvchi ligandlar bo'lib, eng katta Δ_o ajralish energiyasini keltirib chiqaradi."
  },
  {
    id: 9,
    question: "Sisplatin [Pt(NH₃)₂Cl₂] tibbiyotda qanday maqsadda qo'llaniladi?",
    options: [
      "Keng qamrovli antibiotik",
      "Xavfli o'smalarga qarshi (onkologik) kimyoterapevtik dori",
      "Og'riqsizlantiruvchi vosita",
      "Antiseptik preparat"
    ],
    correct: 1,
    explanation: "Sisplatin saraton hujayralarining DNK qo'sh spirali bilan bog'lanib, replikatsiyani to'xtatuvchi jahondagi eng mashhur antionkologik dori preparatidir."
  },
  {
    id: 10,
    question: "Ferrosen [Fe(η⁵-C₅H₅)₂] birikmasi qaysi turdagi komplekslarga kiradi?",
    options: [
      "Sendvich (metallosen) π-kompleks",
      "Klassik Verner akvakompleksi",
      "Polinuklear klaster",
      "Gidrido kompleks"
    ],
    correct: 0,
    explanation: "Ferrosen — ikkita parallel siklopentadienil aromatik halqalari orasida temir atomi joylashgan klassik sendvich (metallosen) birikmadir."
  },
  {
    id: 11,
    question: "Yan-Teller effekti qaysi d-elektron konfiguratsiyali oktaedrik komplekslarda eng kuchli tetragonal deformatsiyani (cho'zilish/qisqarish) yuzaga keltiradi?",
    options: [
      "d³ (Cr³⁺)",
      "d⁸ (Ni²⁺)",
      "d⁹ (Cu²⁺) va yuqori spinli d⁴ (Mn³⁺)",
      "d⁶ past spinli (Fe²⁺)"
    ],
    correct: 2,
    explanation: "eg pog'onasida nosimmetrik elektron taqsimoti bo'lgan d⁹ (t₂g⁶ eg³) va yuqori spinli d⁴ (t₂g³ eg¹) komplekslarida kuchli Yan-Teller buzilishi sodir bo'ladi."
  },
  {
    id: 12,
    question: "[Cr(H₂O)₆]Cl₃ kompleksining suvli eritmasiga ortiqcha AgNO₃ qo'shilganda 1 mol kompleksdan necha mol AgCl cho'kmasi tushadi?",
    options: [
      "1 mol",
      "2 mol",
      "3 mol",
      "Cho'kma tushmaydi"
    ],
    correct: 2,
    explanation: "Barcha 3 ta xlor atomi tashqi koordinatsion sferada ion holida bo'lgani sababli, eritmada 3 mol Cl⁻ to'liq 3 mol AgCl bo'lib cho'kadi."
  },
  {
    id: 13,
    question: "Trans-[Co(en)₂Cl₂]⁺ va Sis-[Co(en)₂Cl₂]⁺ izomerlarining qaysi biri optik faol (enantiomerlarga ajraluvchi) hisoblanadi?",
    options: [
      "Faqat Trans-izomer",
      "Faqat Sis-izomer",
      "Ikkalasi ham optik faol",
      "Hech biri optik faol emas"
    ],
    correct: 1,
    explanation: "Trans-izomerda simmetriya tekisligi va inversiya markazi bor (optik nofaol). Sis-izomerda esa simmetriya tekisligi yo'q, u xiral bo'lib d- va l-enantiomerlar hosil qiladi."
  },
  {
    id: 14,
    question: "EDTA⁴⁻ (Etilendiamintetraatsetat) ioni necha tishli (dentatli) ligand hisoblanadi?",
    options: [
      "2 tishli (bidentat)",
      "4 tishli (tetradentat)",
      "6 tishli (geksadentat)",
      "8 tishli (oktadentat)"
    ],
    correct: 2,
    explanation: "EDTA⁴⁻ ioni 2 ta donor azot atomi va 4 ta karboksilat kislorod atomlari orqali markaziy ion bilan bir vaqtda 6 ta koordinatsion bog' hosil qiladi."
  },
  {
    id: 15,
    question: "[Fe(H₂O)₆]³⁺ va [Fe(CN)₆]³⁻ komplekslarida toq elektronlar soni mos ravishda nechaga teng?",
    options: [
      "5 va 1",
      "1 va 5",
      "3 va 3",
      "5 va 0"
    ],
    correct: 0,
    explanation: "Fe³⁺ (d⁵): kuchsiz H₂O maydonida yuqori spinli (t₂g³ eg², 5 ta toq elektron), kuchli CN⁻ maydonida esa past spinli (t₂g⁵ eg⁰, 1 ta toq elektron) bo'ladi."
  },
  {
    id: 16,
    question: "Kvadrat antiprizmatik (KS = 8) geometriyada yuqori va quyi kvadrat asoslar bir-biriga nisbatan necha gradusga burilgan bo'ladi?",
    options: [
      "0° (ustma-ust)",
      "45°",
      "60°",
      "90°"
    ],
    correct: 1,
    explanation: "Kvadrat antiprizmada ligandlararo itarilishni kamaytirish uchun ikkita parallel kvadrat yuzalar bir-biriga nisbatan aynan 45° burchakka buriladi."
  },
  {
    id: 17,
    question: "Qaysi kompleks 18-elektron qoidasiga (barqaror kovalent qobiqqa) to'liq bo'ysunadi?",
    options: [
      "Cr(CO)₆",
      "Fe(CO)₅",
      "Ni(CO)₄",
      "Barcha keltirilgan birikmalar"
    ],
    correct: 3,
    explanation: "Cr⁰(6) + 6×2 = 18e⁻; Fe⁰(8) + 5×2 = 18e⁻; Ni⁰(10) + 4×2 = 18e⁻. Barchasi 18-elektron qoidasiga to'liq mos keladi."
  },
  {
    id: 18,
    question: "JDA Kimyo va AlchemIQ standartiga ko'ra, [Cu(NH₃)₄]²⁺ kompleksi qanday fazoviy tuzilishga ega?",
    options: [
      "Muntazam tetraedrik",
      "Yassi kvadrat (tekis kvadrat)",
      "Trigonal piramida",
      "Chiziqli"
    ],
    correct: 1,
    explanation: "Cu²⁺ (d⁹) koordinatsiyasida Yan-Teller effekti va dsp² gibridlanish natijasida [Cu(NH₃)₄]²⁺ yassi kvadrat (tekis kvadrat) geometriyani hosil qiladi."
  },
  {
    id: 19,
    question: "K₄[Fe(CN)₆] kompleksining IUPAC bo'yicha rasmiy nomi qanday?",
    options: [
      "Kaliy geksatsianoferrat(II)",
      "Kaliy geksatsianoferrat(III)",
      "Geksatsianotemir kaliy",
      "Tetrakaliy geksatsianotemir"
    ],
    correct: 0,
    explanation: "K₄[Fe(CN)₆] da Fe oksidlanish darajasi +2 bo'lgani sababli: Kaliy geksatsianoferrat(II)."
  },
  {
    id: 20,
    question: "Oktaedrik [MA₃B₃] tipidagi komplekslar uchun qanday geometrik izomerlar xarakterli?",
    options: [
      "Sis va trans",
      "Fatsial (fac) va meridional (mer)",
      "Dekstro va levo",
      "Konformatsion izomerlar"
    ],
    correct: 1,
    explanation: "[MA₃B₃] oktaedrlarida uchta bir xil ligand oktaedr bitta uchburchak yuzida joylashsa fatsial (fac), ekvator tekisligi bo'ylab joylashsa meridional (mer) izomer deyiladi."
  },
  {
    id: 21,
    question: "Qaysi metall kationi suvli eritmada d¹⁰ elektron konfiguratsiyaga ega bo'lib, rangsiz diamagnit komplekslar beradi?",
    options: [
      "Zn²⁺",
      "Cu²⁺",
      "Fe³⁺",
      "Ni²⁺"
    ],
    correct: 0,
    explanation: "Zn²⁺ ioni [Ar]3d¹⁰ konfiguratsiyaga ega. d-orbitallari to'liq band bo'lgani uchun d-d o'tishlar sodir bo'lmaydi va uning komplekslari rangsiz hamda diamagnit bo'ladi."
  },
  {
    id: 22,
    question: "Makrosiklik xelat effekti (masalan, porfirin yoki kraun-efirlarda) kompleksning barqarorligiga qanday ta'sir qiladi?",
    options: [
      "Barqarorlikni keskin kamaytiradi",
      "Barqarorlikni bir necha ming/million baravargacha oshiradi (termodinamik va kinetik jihatdan)",
      "Faqat rangiga ta'sir qiladi, barqarorlik o'zgarmaydi",
      "Kompleksni darhol parchalaydi"
    ],
    correct: 1,
    explanation: "Makrosiklik halqalar oldindan shakllangan bo'shliqqa ega bo'lib, entropiya va entalpiya omillari tufayli kompleks barqarorligini keskin (makrosiklik effekt) oshiradi."
  },
  {
    id: 23,
    question: "Gemoglobin oqsilidagi gem guruhining markazida qaysi metall ioni koordinatsiyalangan?",
    options: [
      "Kobalt (Co³⁺)",
      "Magniy (Mg²⁺)",
      "Temir (Fe²⁺)",
      "Mis (Cu²⁺)"
    ],
    correct: 2,
    explanation: "Gemoglobinda protoporfirin IX halqasi markazida Fe²⁺ ioni joylashgan bo'lib, kislorodni qaytar holda bog'lash va tashish vazifasini bajaradi."
  },
  {
    id: 24,
    question: "Xlorofill pigmentining markaziy koordinatsion markazida qaysi element joylashgan?",
    options: [
      "Magniy (Mg²⁺)",
      "Temir (Fe²⁺)",
      "Rux (Zn²⁺)",
      "Marganets (Mn²⁺)"
    ],
    correct: 0,
    explanation: "Xlorofill molekulasidagi xlorin porfirin halqasi markazida Magniy (Mg²⁺) ioni koordinatsion bog'langan."
  },
  {
    id: 25,
    question: "Vodorodning koordinatsion kimyoda ko'prik (bridging) bog'lovchi ligand vazifasini bajarishi qaysi birikmalarda ko'p uchraydi?",
    options: [
      "Borvodorodlar (boranlar, masalan B₂H₆)",
      "Faqat ishqoriy metall gidridlarida",
      "Faqat galogenidlarda",
      "Hech qachon ko'prik bo'la olmaydi"
    ],
    correct: 0,
    explanation: "Diboran B₂H₆ va polinuklear gidrido komplekslarida vodorod 3-markazli 2-elektronli (3c-2e) ko'prik bog'larini hosil qiladi."
  },
  {
    id: 26,
    question: "Dodekaedrik (KS = 8) komplekslar qanday simmetriya guruhiga mansub?",
    options: [
      "O_h",
      "D₂_d",
      "D₄_h",
      "T_d"
    ],
    correct: 1,
    explanation: "[Mo(CN)₈]⁴⁻ kabi sakkiz koordinatali dodekaedrik komplekslar D₂_d simmetriya guruhiga ega."
  },
  {
    id: 27,
    question: "[Ag(NH₃)₂]⁺ kompleks ionining fazoviy shakli qanday?",
    options: [
      "Chiziqli (180°)",
      "Burchakli (104.5°)",
      "Tekis uchburchak",
      "Tetraedrik"
    ],
    correct: 0,
    explanation: "Ag⁺ (d¹⁰) kationi sp gibridlanish orqali ikkita ammiak molekulasi bilan to'g'ri chiziqli (burchagi 180°) kompleks hosil qiladi."
  },
  {
    id: 28,
    question: "Tiosianat ioni (SCN⁻) metallga oltingugurt orqali bog'lansa M-SCN (tiotsianato), azot orqali bog'lansa M-NCS nima deb ataladi?",
    options: [
      "Izotiosianato",
      "Siano",
      "Nitro",
      "Sulfito"
    ],
    correct: 0,
    explanation: "SCN⁻ N-atomi orqali bog'langanda 'izotiosianato', S-atomi orqali bog'langanda 'tiosianato' deb yuritiladi."
  },
  {
    id: 29,
    question: "Nima sababdan lantanoidlar (masalan, Ce⁴⁺, Nd³⁺, La³⁺) ko'pincha KS = 9, 10 va 12 bo'lgan yuqori koordinatsion sonli komplekslar hosil qiladi?",
    options: [
      "Ion radiusining kattaligi va f-orbitallarning fazoviy imkoniyatlari",
      "Faqat yuqori manfiy zaryadga egaligi",
      "Kichik atom massasi",
      "Ular kovalent bog' hosil qilmasligi"
    ],
    correct: 0,
    explanation: "Lantanoidlarning kation radiusi 3d-metallarga nisbatan ancha katta bo'lgani sababli, ularning atrofida sterik to'siqlarsiz 8 tadan 12 tagacha donor atomlar erkin joylasha oladi."
  },
  {
    id: 30,
    question: "AlchemIQ & JDA Kimyo ilmiy shioriga ko'ra koordinatsion kimyoning asosi bo'lgan Verner koordinatsion nazariyasi qachon yaratilgan va qachon Nobel mukofotiga sazovor bo'lgan?",
    options: [
      "1893-yil yaratilgan, 1913-yil Nobel mukofoti berilgan (Alfred Verner)",
      "1950-yil yaratilgan, 1973-yil Nobel berilgan",
      "1905-yil yaratilgan, 1921-yil Nobel berilgan",
      "1869-yil yaratilgan, 1901-yil Nobel berilgan"
    ],
    correct: 0,
    explanation: "Shveysariyalik kimyogar Alfred Verner 1893-yilda koordinatsion nazariyaga asos solgan va 1913-yilda anorganik kimyo sohasidagi birinchi Nobel mukofoti bilan taqdirlangan."
  }
]
