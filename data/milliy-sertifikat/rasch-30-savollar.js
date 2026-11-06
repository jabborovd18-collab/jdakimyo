// data/milliy-sertifikat/rasch-30-savollar.js
//
// JDA KIMYO — RASCH IRT DIAGNOSTIK SAVOLLAR BAZASI (30 TA SAVOL)
// Har bir savol kalibrlangan qiyinlik logiti (b_i), soha va tushuntirishga ega.

export const RASCH_DIAGNOSTIKA_SAVOLLARI = [
  {
    id: 1,
    mavzu: "Oddiy va murakkab moddalar",
    soha: "Umumiy kimyo",
    qiyinlik: -2.2, // Oson savol
    question: "Quyida keltirilgan moddalar ichidan oddiy moddalar to'plamini aniqlang:\n1) grafit; 2) gips; 3) ohaktosh; 4) olmos; 5) oq fosfor; 6) mis kuporosi.",
    options: ["1, 4, 5", "2, 3, 6", "2, 4, 5", "1, 2, 4"],
    correct: 0,
    explanation: "Grafit (C), olmos (C) va oq fosfor (P₄) faqat bitta element atomlaridan tuzilgan oddiy moddalardir. Gips (CaSO₄·2H₂O), ohaktosh (CaCO₃) va mis kuporosi (CuSO₄·5H₂O) esa murakkab moddalardir."
  },
  {
    id: 2,
    mavzu: "Fizik va kimyoviy hodisalar",
    soha: "Umumiy kimyo",
    qiyinlik: -1.9,
    question: "Quyidagi hodisalardan qaysi biri kimyoviy hodisaga kiradi?",
    options: [
      "Temirning havoda zanglashi",
      "Yod kristallarining qizdirilganda sublimatlanishi",
      "Suvning muzga aylanishi",
      "Temir kukunining magnitga tortilishi"
    ],
    correct: 0,
    explanation: "Temir zanglaganda (4Fe + 3O₂ + 2nH₂O → 2Fe₂O₃·nH₂O) yangi kimyoviy birikma hosil bo'ladi. Sublimatsiya, muzlash va magnitlanish esa agregat yoki fizik holat o'zgarishlaridir."
  },
  {
    id: 3,
    mavzu: "Atom va molekula tushunchasi",
    soha: "Umumiy kimyo",
    qiyinlik: -1.6,
    question: "Faqat moddaga (makrotizimga) xos bo'lgan xossalar qatorini toping:\n1) zichlik; 2) yadro zaryadi; 3) qaynash harorati; 4) elektron konfiguratsiya; 5) agregat holat; 6) izotop tarkib.",
    options: ["1, 3, 5", "2, 4, 6", "1, 4, 5", "2, 3, 6"],
    correct: 0,
    explanation: "Zichlik, qaynash harorati va agregat holat — moddaga (katta zarrachalar to'plamiga) xos makroskopik xossalardir. Yadro zaryadi, elektron konfiguratsiya va izotoplar esa yakka atom yoki elementga tegishlidir."
  },
  {
    id: 4,
    mavzu: "Modda miqdori va Avogadro qonuni",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: -1.3,
    question: "Normal sharoitda 44.8 litr hajm egallagan kislorod (O₂) gazida necha dona kislorod atomi mavjud?",
    options: [
      "2.408 × 10²⁴ ta",
      "1.204 × 10²⁴ ta",
      "6.02 × 10²³ ta",
      "4.816 × 10²⁴ ta"
    ],
    correct: 0,
    explanation: "n(O₂) = 44.8 / 22.4 = 2 mol O₂. 1 molekula O₂ da 2 ta O atomi bor, demak n(O) = 2 × 2 = 4 mol. N(O) = 4 × 6.02 × 10²³ = 2.408 × 10²⁴ ta atom."
  },
  {
    id: 5,
    mavzu: "Molyar massa va aralashmalar",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: -1.0,
    question: "2 mol glyukoza (C₆H₁₂O₆) va 8 mol karbonat angidrid (CO₂) gazidagi uglerod atomlarining mol nisbati qanday?",
    options: ["1.5 : 1", "1 : 1", "1.2 : 1", "2 : 1"],
    correct: 0,
    explanation: "Glyukozadagi uglerod: 2 mol × 6 = 12 mol C. CO₂ dagi uglerod: 8 mol × 1 = 8 mol C. Nisbat: 12 : 8 = 1.5 : 1."
  },
  {
    id: 6,
    mavzu: "Davriy qonun va atom radiusi",
    soha: "Umumiy kimyo",
    qiyinlik: -0.7,
    question: "Davriy sistemada bitta guruhning asosiy guruhchasida (yuqoridan pastga) elementlarning qaysi xossasi qonuniy ravishda ortadi?",
    options: [
      "Atom radiusi va metallik xossasi",
      "Elektrmanfiylik va ionlanish energiyasi",
      "Oksidlovchilik xossasi",
      "Valent elektronlari soni"
    ],
    correct: 0,
    explanation: "Guruhda yuqoridan pastga energetik qavatlar soni ortgani uchun atom radiusi kengayadi va metallik (qaytaruvchilik) xossasi ortadi. Valent elektronlar soni esa o'zgarmaydi."
  },
  {
    id: 7,
    mavzu: "Oksidlanish darajasi",
    soha: "Umumiy kimyo",
    qiyinlik: -0.4,
    question: "K₂Cr₂O₇, KMnO₄ va KClO₄ birikmalaridagi xrom, marganets va xlorning oksidlanish darajalarini ketma-ket aniqlang.",
    options: ["+6, +7, +7", "+6, +6, +7", "+3, +7, +5", "+6, +7, +5"],
    correct: 0,
    explanation: "K₂Cr₂O₇: 2(+1) + 2(Cr) + 7(-2) = 0 => Cr = +6. KMnO₄: +1 + Mn + 4(-2) = 0 => Mn = +7. KClO₄: +1 + Cl + 4(-2) = 0 => Cl = +7."
  },
  {
    id: 8,
    mavzu: "Kimyoviy bog'lanish turlari",
    soha: "Umumiy kimyo",
    qiyinlik: -0.2,
    question: "Quyidagi qatorlarning qaysi birida faqat kovalent qutbsiz bog'lanishli moddalar berilgan?",
    options: [
      "N₂, Cl₂, O₃, P₄",
      "HCl, H₂O, NH₃, CH₄",
      "NaCl, KBr, CaCl₂, Na₂O",
      "H₂, H₂S, O₂, CO₂"
    ],
    correct: 0,
    explanation: "Bir xil elektrmanfiylikka ega metallmas atomlari o'rtasida vujudga kelgan bog' — kovalent qutbsiz bog'dir (N₂, Cl₂, O₃, P₄)."
  },
  {
    id: 9,
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Fizik kimyo",
    qiyinlik: 0.0,
    question: "Harorat har 10 °C ga ko'tarilganda tezlik 3 marta ortadigan reaksiyada (γ = 3), harorat 20 °C dan 50 °C gacha ko'tarilsa reaksiya tezligi necha marta ortadi?",
    options: ["27 marta", "9 marta", "81 marta", "30 marta"],
    correct: 0,
    explanation: "Vant-Goff qoidasi: v₂ / v₁ = γ^((T₂ - T₁)/10). Bu yerda (50 - 20) / 10 = 3. Demak, tezlik 3³ = 27 marta ortadi."
  },
  {
    id: 10,
    mavzu: "Kimyoviy muvozanat va Le-Shatelye prinsipi",
    soha: "Fizik kimyo",
    qiyinlik: 0.2,
    question: "N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + Q ekzotermik reaksiyasida muvozanatni ammiak hosil bo'lishi tomoniga siljitish uchun qaysi omillar kerak?",
    options: [
      "Bosimni oshirish va haroratni pasaytirish",
      "Bosimni kamaytirish va haroratni oshirish",
      "Katalizator qo'shish va hajmni kengaytirish",
      "Bosimni va haroratni bir vaqtda oshirish"
    ],
    correct: 0,
    explanation: "Reaksiya gazlar hajmi kamayishi (4 mol gazdan 2 mol gaz) va issiqlik ajralishi (+Q) bilan boradi. Le-Shatelye prinsipiga ko'ra bosimni oshirish hajm kamayish tomoniga, haroratni pasaytirish esa ekzotermik (+Q) tomonga siljitadi."
  },
  {
    id: 11,
    mavzu: "Eritmalar: massa ulush",
    soha: "Eritmalar",
    qiyinlik: 0.4,
    question: "200 g 10% li osh tuzi eritmasiga 50 g suv qo'shilganda hosil bo'lgan yangi eritmaning foiz konsentratsiyasini hisoblang.",
    options: ["8%", "6.5%", "7.5%", "9%"],
    correct: 0,
    explanation: "Tuz massasi: 200 × 0.10 = 20 g. Yangi eritma massasi: 200 + 50 = 250 g. Yangi konsentratsiya: (20 / 250) × 100% = 8%."
  },
  {
    id: 12,
    mavzu: "Elektrolitik dissotsilanish va pH",
    soha: "Eritmalar",
    qiyinlik: 0.6,
    question: "0.001 M xlorid kislota (HCl) eritmasining pH qiymatini toping (dissotsilanish darajasi 100%).",
    options: ["3", "1", "4", "11"],
    correct: 0,
    explanation: "[H⁺] = 0.001 mol/L = 10⁻³ mol/L. pH = -log[H⁺] = -log(10⁻³) = 3."
  },
  {
    id: 13,
    mavzu: "Tuzlar gidrolizi",
    soha: "Anorganik kimyo",
    qiyinlik: 0.8,
    question: "Quyidagi tuzlarning qaysi biri suvda eriganda eritma muhiti ishqoriy (pH > 7) bo'ladi?",
    options: ["Na₂CO₃", "FeCl₃", "NH₄NO₃", "NaCl"],
    correct: 0,
    explanation: "Na₂CO₃ kuchli asos (NaOH) va kuchsiz kislotadan (H₂CO₃) hosil bo'lgan tuz. Anion bo'yicha gidrolizlanadi: CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻. Erkin OH⁻ ionlari tufayli muhit ishqoriy bo'ladi."
  },
  {
    id: 14,
    mavzu: "Oksidlanish-qaytarilish reaksiyalari (OVR)",
    soha: "Umumiy kimyo",
    qiyinlik: 1.0,
    question: "KMnO₄ + K₂SO₃ + H₂SO₄ → MnSO₄ + K₂SO₄ + H₂O reaksiyasida oksidlovchi va qaytaruvchining stexiometrik koeffitsiyentlari nisbati qanday?",
    options: ["2 : 5", "5 : 2", "1 : 3", "2 : 3"],
    correct: 0,
    explanation: "Elektron balans: Mn⁺⁷ + 5e⁻ → Mn⁺² (×2), S⁺⁴ - 2e⁻ → S⁺⁶ (×5). Tenglama: 2KMnO₄ + 5K₂SO₃ + 3H₂SO₄ → 2MnSO₄ + 6K₂SO₄ + 3H₂O. Oksidlovchi (KMnO₄) = 2, Qaytaruvchi (K₂SO₃) = 5. Nisbat: 2 : 5."
  },
  {
    id: 15,
    mavzu: "Gidridlar va vodorodli birikmalar",
    soha: "Anorganik kimyo",
    qiyinlik: 1.1,
    question: "Kalsiy gidrid (CaH₂) suv bilan reaksiyaga kirishganda 4.48 litr (n.sh.) gaz ajralgan bo'lsa, sarflangan CaH₂ massasini (g) hisoblang.",
    options: ["4.2 g", "8.4 g", "2.1 g", "5.6 g"],
    correct: 0,
    explanation: "CaH₂ + 2H₂O → Ca(OH)₂ + 2H₂↑. n(H₂) = 4.48 / 22.4 = 0.2 mol. Reaksiya bo'yicha 1 mol CaH₂ dan 2 mol H₂ ajraladi. Demak, n(CaH₂) = 0.2 / 2 = 0.1 mol. M(CaH₂) = 40 + 2 = 42 g/mol. m = 0.1 × 42 = 4.2 g."
  },
  {
    id: 16,
    mavzu: "Elektroliz qonunlari (Faradey)",
    soha: "Fizik kimyo",
    qiyinlik: 1.3,
    question: "Mis(II) sulfat (CuSO₄) eritmasi orqali 5 A tok kuchi 3860 soniya davomida o'tkazilganda katodda necha gramm mis ajraladi? (Cu = 64, F = 96500 Kl/mol)",
    options: ["6.4 g", "12.8 g", "3.2 g", "1.6 g"],
    correct: 0,
    explanation: "Faradey qonuni: m = (M × I × t) / (z × F). Cu²⁺ uchun z = 2. m = (64 × 5 × 3860) / (2 × 96500) = (1235200) / (193000) = 6.4 g."
  },
  {
    id: 17,
    mavzu: "Eruvchanlik ko'paytmasi (K_s)",
    soha: "Eritmalar",
    qiyinlik: 1.5,
    question: "Kalsiy sulfat (CaSO₄) ning to'yingan suvdagi eritmasida [Ca²⁺] = 0.01 mol/L bo'lsa, uning eruvchanlik ko'paytmasi (K_s) qiymati nechaga teng?",
    options: ["1.0 × 10⁻⁴", "2.0 × 10⁻⁴", "1.0 × 10⁻²", "4.0 × 10⁻⁸"],
    correct: 0,
    explanation: "CaSO₄(q) ⇌ Ca²⁺ + SO₄²⁻. To'yingan eritmada [Ca²⁺] = [SO₄²⁻] = 0.01 = 10⁻² mol/L. K_s = [Ca²⁺] × [SO₄²⁻] = 10⁻² × 10⁻² = 1.0 × 10⁻⁴."
  },
  {
    id: 18,
    mavzu: "Organik kimyo: Alkanlar va radikal almashinish",
    soha: "Organik kimyo",
    qiyinlik: -0.5,
    question: "Metanning xlor bilan yorug'lik ta'siridagi fotokimyoviy xlorlanishi qaysi mexanizm bo'yicha amalga oshadi?",
    options: [
      "Erkin radikalli zanjir almashinish (S_R)",
      "Elektrofil birikish (A_E)",
      "Nukleofil almashinish (S_N)",
      "Eliminirlanish (E)"
    ],
    correct: 0,
    explanation: "Alkanlar hν (yorug'lik kvanti) ta'sirida erkin radikalli zanjir mexanizmi (S_R) bo'yicha gomolitik uzilish orqali almashinadi."
  },
  {
    id: 19,
    mavzu: "Alkenlar va Markovnikov qoidasi",
    soha: "Organik kimyo",
    qiyinlik: 0.1,
    question: "Propen (CH₃-CH=CH₂) ga vodorod xlorid (HCl) birikkanda asosiy mahsulot sifatida nima hosil bo'ladi?",
    options: ["2-xlorpropan", "1-xlorpropan", "1,2-dixlorpropan", "propil spirti"],
    correct: 0,
    explanation: "Markovnikov qoidasiga ko'ra, vodorod ko'proq gidrogenlangan (CH₂) uglerodga, xlor esa kamroq gidrogenlangan (CH) uglerodga birikadi: CH₃-CHCl-CH₃ (2-xlorpropan)."
  },
  {
    id: 20,
    mavzu: "Spirtlar va fenollar tabiati",
    soha: "Organik kimyo",
    qiyinlik: 0.7,
    question: "Etanol va fenolni o'zaro farqlash uchun quyidagi reagentlarning qaysi biri ishlatiladi?",
    options: [
      "FeCl₃ eritmasi (binafsharang kompleks beradi)",
      "Natriy metali (ikkisi ham vodorod ajratadi)",
      "Lakmus qog'ozi",
      "Mis(II) gidroksid (sovuqda)"
    ],
    correct: 0,
    explanation: "Fenol FeCl₃ bilan xarakterli binafsharang kompleks hosil qiladi, bir atomli spirtlar esa bu reaksiyani bermaydi."
  },
  {
    id: 21,
    mavzu: "Aldegidlar va oksidlanish",
    soha: "Organik kimyo",
    qiyinlik: 0.9,
    question: "0.1 mol sirka aldegid (CH₃CHO) ga kumush oksidining ammiakdagi eritmasi (kumush ko'zgu reaksiyasi) ta'sir ettirilganda necha gramm kumush cho'kadi? (Ag = 108)",
    options: ["21.6 g", "10.8 g", "43.2 g", "5.4 g"],
    correct: 0,
    explanation: "CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag↓ + 3NH₃ + H₂O. 1 mol aldegiddan 2 mol Ag cho'kadi. 0.1 mol aldegiddan 0.2 mol Ag ajraladi. m(Ag) = 0.2 × 108 = 21.6 g."
  },
  {
    id: 22,
    mavzu: "Murakkab efirlar va gidroliz",
    soha: "Organik kimyo",
    qiyinlik: 1.2,
    question: "Etilatsetat (CH₃COOC₂H₅) ning ishqoriy gidrolizi (sovunlanishi) natijasida qaysi moddalar hosil bo'ladi?",
    options: [
      "Natriy atsetat va etil spirti",
      "Sirka kislota va natriy etilat",
      "Etanol va atseton",
      "Metanol va natriy propionat"
    ],
    correct: 0,
    explanation: "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH (natriy atsetat va etanol)."
  },
  {
    id: 23,
    mavzu: "Aminokislotalar va amfoterlik",
    soha: "Organik kimyo",
    qiyinlik: 1.4,
    question: "Glitsin (NH₂-CH₂-COOH) molekulasining amfoter xossaga ega bo'lishining asosiy sababi nima?",
    options: [
      "Tarkibida ham asosli (-NH₂), ham kislotali (-COOH) funksional guruhlarning mavjudligi",
      "Uglerod zanjirining qisqaligi",
      "Molekulasida vodorod bog'larining yo'qligi",
      "Azot atomining manfiy zaryadga egaligi"
    ],
    correct: 0,
    explanation: "Aminokislotalar tarkibida asos xossasini beruvchi aminoguruh (-NH₂) va kislota xossasini beruvchi karboksil guruh (-COOH) bo'lganligi uchun amfoter organik birikmalardir."
  },
  {
    id: 24,
    mavzu: "Kristallogidratlar hisobi",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.6,
    question: "25 g mis kuporosi (CuSO₄·5H₂O) 175 g suvda eritilganda hosil bo'lgan eritmadagi suvsiz CuSO₄ ning massa ulushini toping. (Cu = 64, S = 32, O = 16, H = 1)",
    options: ["8.0%", "12.5%", "10.0%", "14.2%"],
    correct: 0,
    explanation: "M(CuSO₄·5H₂O) = 250 g/mol, M(CuSO₄) = 160 g/mol. 250 g kuporosda 160 g tuz bor. 25 g kuporosda x = 16 g CuSO₄ mavjud. Jami eritma: 25 + 175 = 200 g. ω = (16 / 200) × 100% = 8.0%."
  },
  {
    id: 25,
    mavzu: "Stexiometriya va oraliq moddalar",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.8,
    question: "Tarkibida 80% sof kalsiy karbonat (CaCO₃) bo'lgan 250 g ohaktosh qizdirilganda hosil bo'lgan gaz hajmini (litr, n.sh.) hisoblang.",
    options: ["44.8 L", "22.4 L", "56.0 L", "33.6 L"],
    correct: 0,
    explanation: "Sof CaCO₃ massasi: 250 × 0.80 = 200 g. n(CaCO₃) = 200 / 100 = 2 mol. CaCO₃ → CaO + CO₂↑. 2 mol CaCO₃ dan 2 mol CO₂ ajraladi. V(CO₂) = 2 × 22.4 = 44.8 litr."
  },
  {
    id: 26,
    mavzu: "Gazlar aralashmasi va zichlik",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 2.0,
    question: "Metan (CH₄) va kislorod (O₂) gazlari aralashmasining geliyga nisbatan zichligi 5 ga teng bo'lsa, aralashmadagi metanning hajm ulushini (%) aniqlang.",
    options: ["75%", "25%", "50%", "60%"],
    correct: 0,
    explanation: "O'rtacha molyar massa: M_o'rta = 5 × 4 = 20 g/mol. Diagonal (pirson) usuli: CH₄ (16) va O₂ (32) uchun: |16 - 20| = 4; |32 - 20| = 12. Hajmiy nisbat CH₄ : O₂ = 12 : 4 = 3 : 1. Metanning ulushi: 3 / 4 = 0.75 (75%)."
  },
  {
    id: 27,
    mavzu: "Murakkab eritmalar va neytrallanish",
    soha: "Eritmalar",
    qiyinlik: 2.1,
    question: "100 ml 0.2 M NaOH eritmasiga 100 ml 0.1 M H₂SO₄ eritmasi qo'shildi. Hosil bo'lgan eritmaning pH qiymati nechaga teng bo'ladi?",
    options: ["7", "1", "13", "12"],
    correct: 0,
    explanation: "n(NaOH) = 0.1 L × 0.2 M = 0.02 mol OH⁻. n(H₂SO₄) = 0.1 L × 0.1 M = 0.01 mol H₂SO₄ = 0.02 mol H⁺. H⁺ va OH⁻ mollari to'liq teng (0.02 mol = 0.02 mol), eritmada to'liq neytrallanish sodir bo'ladi, pH = 7."
  },
  {
    id: 28,
    mavzu: "Termokimyo va bog' energiyalari",
    soha: "Fizik kimyo",
    qiyinlik: 2.2,
    question: "C(q) + O₂(g) → CO₂(g) reaksiyasining issiqlik effekti +394 kJ bo'lsa, 8.8 g CO₂ hosil bo'lganda necha kJ issiqlik ajraladi?",
    options: ["78.8 kJ", "39.4 kJ", "157.6 kJ", "19.7 kJ"],
    correct: 0,
    explanation: "M(CO₂) = 44 g/mol. n(CO₂) = 8.8 / 44 = 0.2 mol. 1 mol CO₂ da 394 kJ ajraladi. 0.2 mol CO₂ da: 0.2 × 394 = 78.8 kJ."
  },
  {
    id: 29,
    mavzu: "Koordinatsion birikmalar va izomeriya",
    soha: "Anorganik kimyo",
    qiyinlik: 2.3,
    question: "[Co(NH₃)₅Br]SO₄ va [Co(NH₃)₅SO₄]Br birikmalari o'zaro qaysi turdagi kompleks izomeriyaga misol bo'ladi?",
    options: [
      "Ionlanish izomeriyasi",
      "Bog'lanish izomeriyasi",
      "Koordinatsion izomeriya",
      "Gidrat izomeriyasi"
    ],
    correct: 0,
    explanation: "Ichki va tashqi sferadagi ionlarning o'rin almashinuvi natijasida eritmada har xil ionlar beruvchi komplekslar ionlanish izomerlari hisoblanadi (biri Ba²⁺ bilan, ikkinchisi Ag⁺ bilan cho'kma beradi)."
  },
  {
    id: 30,
    mavzu: "Olimpiada darajasi: Redoks va elektron balans",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 2.5, // Eng murakkab savol
    question: "As₂S₃ + HNO₃ + H₂O → H₃AsO₄ + H₂SO₄ + NO reaksiyasi to'liq tenglashtirilganda HNO₃ oldidagi koeffitsiyent nechaga teng bo'ladi?",
    options: ["28", "14", "10", "24"],
    correct: 0,
    explanation: "As₂S₃ qaytaruvchi: 2As⁺³ - 4e⁻ → 2As⁺⁵; 3S⁻² - 24e⁻ → 3S⁺⁶. Jami As₂S₃ 28 ta elektron beradi (×3). N⁺⁵ + 3e⁻ → N⁺² (NO) 3 ta elektron oladi (×28). Tenglama: 3As₂S₃ + 28HNO₃ + 4H₂O → 6H₃AsO₄ + 9H₂SO₄ + 28NO↑. Demak, HNO₃ koeffitsiyenti = 28."
  }
]
