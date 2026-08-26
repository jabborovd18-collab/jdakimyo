// data/hamkorlik/alchemiq-savollar.js
//
// AlchemIQ Test № 4 — Muallif: Sardor Ergashev (@AlchemistryIQ)
// JDA Kimyo & AlchemIQ Mavsumiy Hamkorlik Rasmiy Sinov Testi (30 ta savol)

export const ALCHEMIQ_SAVOLLAR = [
  {
    id: 1,
    question: "1. 2 mol glukon kislota va 8 mol karbonat angidrid tarkibidagi uglerod atomlari o‘zaro qanday nisbatda bo‘ladi?",
    options: [
      "1:1,5",
      "1,5:1",
      "1:1",
      "1,5:3,5"
    ],
    correct: 1, // B) 1,5:1
    explanation: "Glukon kislota (C₆H₁₂O₇) da 6 ta uglerod bor: 2 mol × 6 = 12 mol C. Karbonat angidrid (CO₂) da 1 ta C bor: 8 mol × 1 = 8 mol C. Nisbat: 12 : 8 = 1,5 : 1."
  },
  {
    id: 2,
    question: "2. Moddaga tegishli bo‘lgan xossalarni aniqlang.\n1) zichlik\n2) yadro zaryadi\n3) elektron qavatlar\n4) qaynash va suyuqlanish temperaturalari\n5) izotoplar\n6) rang\n7) atom massa\n8) agregat holat",
    options: [
      "2, 3, 5, 7",
      "1, 3, 5, 8",
      "2, 4, 6, 7",
      "1, 4, 6, 8"
    ],
    correct: 3, // D) 1, 4, 6, 8
    explanation: "Zichlik (1), qaynash/suyuqlanish haroratlari (4), rang (6) va agregat holat (8) — moddaga xos makroskopik fizik xossalar. Yadro zaryadi, elektron qavatlar, izotoplar va atom massa esa atom/elementga tegishli."
  },
  {
    id: 3,
    question: "3. Quyidagilardan kimyoviy hodisani aniqlang.",
    options: [
      "Temirning zanglashi",
      "Yodning sublimatlanishi",
      "Yog‘ning sovuqda qotishi",
      "Temirning magnitga tortilishi"
    ],
    correct: 0, // A) temirning zanglashi
    explanation: "Temirning zanglashi (Fe + O₂ + H₂O → Fe₂O₃·nH₂O) natijasida yangi modda hosil bo'ladi — bu kimyoviy hodisa. Qolganlari (sublimatsiya, qotish, magnitlanish) fizik hodisalar."
  },
  {
    id: 4,
    question: "4. Keltirilgan moddalar ichidan oddiy moddalarni aniqlang.\n1) grafit\n2) gips\n3) ohaktosh\n4) olmos\n5) oq fosfor\n6) mis kuporosi",
    options: [
      "1, 4, 5",
      "2, 3, 6",
      "2, 4, 5",
      "1, 2, 4"
    ],
    correct: 0, // A) 1, 4, 5
    explanation: "Grafit (C), olmos (C) va oq fosfor (P₄) — bitta element atomlaridan tashkil topgan oddiy moddalar. Gips (CaSO₄·2H₂O), ohaktosh (CaCO₃) va mis kuporosi (CuSO₄·5H₂O) — murakkab moddalar."
  },
  {
    id: 5,
    question: "5.☆ Element vodorod bilan hosil qilgan birikmasida musbat oksidlanish darajasini namoyon qiladi. Shu element oksidini aniqlang.",
    options: [
      "SO₂",
      "RhO₄",
      "Na₂O",
      "H₂O₂"
    ],
    correct: 2, // C) Na2O
    explanation: "Natriy (Na) vodorod bilan gidrid (Na⁺H⁻) hosil qiladi, bunda Na musbat (+1), vodorod esa manfiy (-1) oksidlanish darajasiga ega. Shu element oksidi — Na₂O."
  },
  {
    id: 6,
    question: "6. Temir (III) sulfat Fe₂(SO₄)₃·nH₂O tarkibida oltingugurt bilan temirning massa ulushi 37,0 % ga teng bo‘lsa, n ning qiymatini toping.",
    options: [
      "8",
      "10",
      "12",
      "9"
    ],
    correct: 3, // D) 9
    explanation: "M(Fe₂(SO₄)₃) = 400 g/mol. m(2Fe + 3S) = 112 + 96 = 208 g. 208 / (400 + 18n) = 0.37 => 400 + 18n = 562.16 => 18n = 162.16 => n = 9."
  },
  {
    id: 7,
    question: "7. Quyidagi reaksiyalardagi barcha koeffitsiyentlar yig‘indisi ortib borish tartibida joylashgan qatorni aniqlang.\n1. Sulfit kislota + kalsiy gidroksid =\n2. Rux atsetat + temir (III) sulfat =\n3. Nitrat kislota + alyuminiy gidroksid =\n4. Kaliy fosfat + mis (II) xlorid =\n5. Alyuminiy xlorid + natriy fosfat =",
    options: [
      "4, 3, 2, 5, 1",
      "4, 2, 3, 5, 1",
      "1, 5, 3, 2, 4",
      "1, 5, 2, 3, 4"
    ],
    correct: 2, // C) 1, 5, 3, 2, 4
    explanation: "1) H₂SO₃ + Ca(OH)₂ = CaSO₃ + 2H₂O (∑=5)\n5) AlCl₃ + Na₃PO₄ = AlPO₄ + 3NaCl (∑=6)\n3) 3HNO₃ + Al(OH)₃ = Al(NO₃)₃ + 3H₂O (∑=8)\n2) 3Zn(CH₃COO)₂ + Fe₂(SO₄)₃ = 3ZnSO₄ + 2Fe(CH₃COO)₃ (∑=9)\n4) 2K₃PO₄ + 3CuCl₂ = Cu₃(PO₄)₂ + 6KCl (∑=12). Ortish tartibi: 1, 5, 3, 2, 4."
  },
  {
    id: 8,
    question: "8.☆ Quyidagi moddaning burchak gradusini aniqlang.",
    image: "/images/hamkorlik/alchemiq-q8-water.svg",
    options: [
      "104,5°",
      "107°",
      "109,5°",
      "120°"
    ],
    correct: 0, // A) 104,5°
    explanation: "Tasvirlangan model suv (H₂O) molekulasi bo'lib, kisloroddagi ikkita bo'linmagan elektron juftlarining itarilishi natijasida valent burchagi 104,5° ga teng."
  },
  {
    id: 9,
    question: "9. 39,5 g KMnO₄ parchalanganda hosil bo‘lgan kislorodning massasini (g) hisoblang. (Reaksiya unumi 75%)",
    options: [
      "4",
      "3",
      "8",
      "6,4"
    ],
    correct: 1, // B) 3
    explanation: "2KMnO₄ → K₂MnO₄ + MnO₂ + O₂. n(KMnO₄) = 39,5 / 158 = 0,25 mol => n(O₂) = 0,125 mol => m(nazariy) = 0,125 × 32 = 4 g. Unum 75%: 4 × 0,75 = 3 g."
  },
  {
    id: 10,
    question: "10. 10,4 g Al(OH)₃ 25,2 g noma'lum kislota bilan qoldiqsiz reaksiyaga kirishishi ma'lum bo‘lsa, noma'lum kislotani aniqlang.",
    options: [
      "H₂SO₄",
      "HNO₃",
      "H₃PO₄",
      "HCl"
    ],
    correct: 1, // B) HNO3
    explanation: "n(Al(OH)₃) = 10,4 / 78 = 0,1333 mol (2/15 mol). Al(OH)₃ + 3HX → AlX₃ + 3H₂O reaksiyasida n(HX) = 0,1333 × 3 = 0,4 mol. M(kislota) = 25,2 / 0,4 = 63 g/mol. Bu HNO₃ (nitrat kislota)."
  },
  {
    id: 11,
    question: "11. Zichligi 2,5 gr/l ga teng bo‘lgan oltingugurt (IV) oksid va karbonat angidrididan iborat gazlar aralashmasidagi karbonat angidridining hajmiy ulushini hisoblang?",
    options: [
      "68,57%",
      "31,43%",
      "40%",
      "60%"
    ],
    correct: 2, // C) 40%
    explanation: "M_o'rtacha = 2,5 × 22,4 = 56 g/mol. SO₂ (64) va CO₂ (44) aralashmasi. Diaganal bo'yicha: |64 - 56| = 8 (CO₂ ulushi), |44 - 56| = 12 (SO₂ ulushi). φ(CO₂) = 8 / (8 + 12) × 100% = 40%."
  },
  {
    id: 12,
    question: "12. 1 g mis va alyuminiy qotishmasi mo‘l kaliy gidroksid eritmasida eritilganda, n.sh.da 1,12 L gaz ajralib chiqdi. Qotishma tarkibidagi misning massa ulushini aniqlang.",
    options: [
      "10",
      "20",
      "30",
      "40"
    ],
    correct: 0, // A) 10
    explanation: "Mis ishqorda erimaydi. 2Al + 2KOH + 6H₂O → 2K[Al(OH)₄] + 3H₂↑. 67,2 L H₂ ga 54 g Al to'g'ri kelsa, 1,12 L H₂ ga 0,9 g Al to'g'ri keladi. Qotishmadagi Cu massasi = 1,0 - 0,9 = 0,1 g. ω(Cu) = (0,1 / 1,0) × 100% = 10%."
  },
  {
    id: 13,
    question: "13. Qanday temperaturada (K) 7,1 g xlor 101,3 kPa bosimda 2,24 litr hajmni egallaydi?",
    options: [
      "0",
      "247",
      "273",
      "35"
    ],
    correct: 2, // C) 273
    explanation: "n(Cl₂) = 7,1 / 71 = 0,1 mol. Klapeyron-Mendeleyev tenglamasidan: T = (P·V) / (n·R) = (101,3 × 2,24) / (0,1 × 8,314) ≈ 273 K (0 °C)."
  },
  {
    id: 14,
    question: "14. Diagonal o‘xshashlikka ega element juftlarini ko‘rsating.",
    options: [
      "Mg va Ca; P va N",
      "C va Si; N va P",
      "Al va B; Mg va Ca",
      "Al va Be; Al va Ge"
    ],
    correct: 3, // D) Al va Be; Al va Ge
    explanation: "Davriy sistemada 2 va 3-davr elementlari o'rtasidagi diagonal o'xshashlik qoidasiga ko'ra Berilliy (Be) va Alyuminiy (Al) o'xshash amfoter xossalarga ega."
  },
  {
    id: 15,
    question: "15. Texnetsiyning qisqa elektron konfiguratsiyasini aniqlang.",
    options: [
      "… 4d⁴ 5s²",
      "… 4d⁶ 5s²",
      "… 4d⁶ 5s¹",
      "… 4d⁵ 5s²"
    ],
    correct: 3, // D) … 4d⁵ 5s²
    explanation: "Texnetsiy (Tc, Z=43) 5-davr, 7-guruh qo'shimcha guruhcha elementi bo'lib, valent elektron konfiguratsiyasi [Kr] 4d⁵ 5s² ko'rinishida bo'ladi."
  },
  {
    id: 16,
    question: "16. Ushbu yadro reaksiyasi natijasida 46,8 mg neptuniy izotopi hosil bo'lsa, qancha elektron ajralib chiqqan?",
    image: "/images/hamkorlik/alchemiq-q16-nuclear.svg",
    options: [
      "3,612·10²⁰",
      "1,204·10²⁰",
      "2,408·10²⁰",
      "4,816·10²⁰"
    ],
    correct: 2, // C) 2,408·10²⁰
    explanation: "Massa balansi: 246 = 234 + 4x => x = 3 ta α. Zaryad balansi: 97 = 93 + 2(3) - y => 97 = 99 - y => y = 2 ta β⁻ (elektron). n(Np) = 0,0468 / 234 = 0,0002 mol. Ajralgan elektronlar = 0,0002 × 2 = 0,0004 mol = 0,0004 × 6,02·10²³ = 2,408·10²⁰ dona."
  },
  {
    id: 17,
    question: "17. Vodorod va metandan iborat 11,2 L (n.sh.) aralashma yondirilganda 290 kJ issiqlik ajralgan. Termokimyoviy tenglamalar asosida aralashmadagi metanning miqdorini (mol) hisoblang.\n2H₂ + O₂ = 2H₂O + 500 kJ\nCH₄ + 2O₂ = CO₂ + 2H₂O + 800 kJ",
    options: [
      "0,1",
      "0,2",
      "0,3",
      "0,4"
    ],
    correct: 2, // C) 0,3
    explanation: "Jami gaz = 11,2 / 22,4 = 0,5 mol. n(H₂) = x, n(CH₄) = y. x + y = 0,5 va 250x + 800y = 290. 250(0,5 - y) + 800y = 290 => 550y = 165 => y = 0,3 mol CH₄."
  },
  {
    id: 18,
    question: "18. Oddiy moddalarda kimyoviy bog‘larning qaysi turlari hosil bo‘lishi mumkin?\n1) ionli\n2) qutbsiz kovalent\n3) qutbli kovalent\n4) metall\n5) donor-akseptor\n6) vodorod",
    options: [
      "1, 2, 6",
      "2, 4, 5",
      "2, 4",
      "1, 5, 6"
    ],
    correct: 2, // C) 2, 4
    explanation: "Oddiy moddalarda bir xil atomlar o'rtasida qutbsiz kovalent bog' (Cl₂, O₂, N₂) hamda metall kristall panjarasida metall bog' (Na, Fe, Cu) hosil bo'ladi."
  },
  {
    id: 19,
    question: "19.☆ Quyida qaysi moddaning kristall panjara tuzilishi tasvirlangan?",
    image: "/images/hamkorlik/alchemiq-q19-graphite.svg",
    options: [
      "Olmos",
      "Grafit",
      "Karbin",
      "Fulleren"
    ],
    correct: 1, // B) Grafit
    explanation: "Tasvirlangan modelda uglerod atomlari geksagonal qatlamlar hosil qilgan va qatlamlar o'rtasida kuchsiz Van-der-Vaals bog'lari mavjud — bu grafitning qatlamli atom kristall panjarasidir."
  },
  {
    id: 20,
    question: "20. Qaysi molekulada faqat sp²-gibridlanish ro‘y beradi?",
    options: [
      "NH₃",
      "SiO₂",
      "CO₂",
      "SO₂"
    ],
    correct: 3, // D) SO2
    explanation: "SO₂ da markaziy S atomi ikkita σ-bog' va bitta bo'linmagan elektron juftiga ega bo'lib, sp² gibridlanish holatida bo'ladi (burchakli V-shaklli)."
  },
  {
    id: 21,
    question: "21. Qaysi qatorda faqat kuchsiz elektrolitlar joylashgan?",
    options: [
      "KCl, Na₂SO₄, KOH, Ca(NO₃)₂",
      "KNO₃, HCl, CaCO₃, LiOH",
      "Ni(OH)₂, HClO₄, NH₄OH, H₂CO₃",
      "CH₃COOH, H₂CO₃, H₂SO₃, NH₄OH"
    ],
    correct: 3, // D) CH3COOH, H2CO3, H2SO3, NH4OH
    explanation: "Sirka kislota (CH₃COOH), karbonat kislota (H₂CO₃), sulfit kislota (H₂SO₃) va ammoniy gidroksid (NH₄OH) barchasi suvli eritmada qisman ionlarga ajraluvchi kuchsiz elektrolitlardir."
  },
  {
    id: 22,
    question: "22. Alyuminiy sulfat eritmasida dissotsiyalanmagan molekulalari soni 25 ta bo‘lsa, eritmadagi alyuminiy ionlari sonini hisoblang (α = 80%).",
    options: [
      "100",
      "500",
      "200",
      "300"
    ],
    correct: 2, // C) 200
    explanation: "α = 80% bo'lsa, dissotsiyalanmagan ulush 20% (0,2). 0,2 qism = 25 ta molekula => jami molekulalar = 125 ta. Dissotsiyalangan = 125 × 0,8 = 100 ta. Al₂(SO₄)₃ → 2Al³⁺ + 3SO₄²⁻ bo'lgani uchun Al³⁺ ionlari soni = 100 × 2 = 200 ta."
  },
  {
    id: 23,
    question: "23. Qaysi tuzlar faqat kation bo‘yicha gidrolizga uchraydi?",
    options: [
      "CaCO₃; CaSO₃; Ca(CH₃COO)₂",
      "K₂CO₃; KCN; KHCO₃",
      "NH₄Cl; (NH₄)₂SO₄; NH₄CH₃COO",
      "ZnCl₂; Zn(NO₃)₂; ZnSO₄"
    ],
    correct: 3, // D) ZnCl2; Zn(NO3)2; ZnSO4
    explanation: "ZnCl₂, Zn(NO₃)₂ va ZnSO₄ kuchsiz asos Zn(OH)₂ va kuchli kislotalardan hosil bo'lgani sababli faqat kation (Zn²⁺) bo'yicha gidrolizlanadi va kislotali muhit hosil qiladi."
  },
  {
    id: 24,
    question: "24. Qaysi tuzning 0,01 molyarli eritmasida H⁺ ionining konsentratsiyasi yuqori bo‘ladi?",
    options: [
      "Na₂SO₄",
      "NaCl",
      "Na₂SO₃",
      "ZnCl₂"
    ],
    correct: 3, // D) ZnCl2
    explanation: "ZnCl₂ kation bo'yicha gidrolizga uchrab, eritmani kislotali (pH < 7) qiladi va [H⁺] konsentratsiyasini oshiradi. Na₂SO₄ va NaCl neytral, Na₂SO₃ esa ishqoriy muhit beradi."
  },
  {
    id: 25,
    question: "25. Gazlarning eruvchanligi temperatura ko‘tarilishi bilan … va bosim ko‘tarilishi bilan …",
    options: [
      "ortadi, ortadi",
      "ortadi, kamayadi",
      "kamayadi, ortadi",
      "kamayadi, kamayadi"
    ],
    correct: 2, // C) kamayadi, ortadi
    explanation: "Gazlar erishi ekzotermik jarayon bo'lgani uchun harorat oshishi bilan ularning eruvchanligi kamayadi, Genri qonuniga ko'ra bosim oshganda esa eruvchanlik ortadi."
  },
  {
    id: 26,
    question: "26. Metilyodid bilan etilyodid aralashmasiga Na metalli ta'sir ettirilganda qanday to‘yingan uglevodorodlar olinadi?",
    options: [
      "C₂H₆; C₃H₈; n-C₄H₁₀",
      "C₂H₆; C₃H₈",
      "faqat C₃H₈",
      "C₂H₆; n-C₄H₆"
    ],
    correct: 0, // A) C2H6; C3H8; n-C4H10
    explanation: "Vyurs reaksiyasida uch xil juftlik birikishi sodir bo'ladi: CH₃-CH₃ (etan C₂H₆), CH₃-C₂H₅ (propan C₃H₈) va C₂H₅-C₂H₅ (butan C₄H₁₀)."
  },
  {
    id: 27,
    question: "27. 1,1-dimetilsiklopropan olish uchun qaysi moddaga Zn metallini ta'sir ettirish kerak?",
    options: [
      "2,3-dixlor-2-metilbutan",
      "1,3-dixlor-2-metilbutan",
      "1,4-dixlor-2-metilbutan",
      "1,3-dixlor-3-metilbutan"
    ],
    correct: 3, // D) 1,3-dixlor-3-metilbutan
    explanation: "1,3-dixlor-3-metilbutan: Cl-CH₂-CH₂-C(Cl)(CH₃)₂ + Zn → 1,1-dimetilsiklopropan + ZnCl₂ reaksiyasi orqali uch a'zoli sikl hosil bo'ladi."
  },
  {
    id: 28,
    question: "28. Quyidagi moddani nomlang: CH₃CH(CH₃)CHC(C₂H₅)CH₃",
    options: [
      "2-metil-4-etilpenten-2",
      "2-metil-4-etilpenten-3",
      "2,4-dimetilgeksen-2",
      "2,4-dimetilgeksen-3"
    ],
    correct: 3, // D) 2,4-dimetilgeksen-3
    explanation: "Tuzilishi: CH₃-CH(CH₃)-CH=C(C₂H₅)-CH₃. Eng uzun uglerod zanjiri 6 ta ugleroddan (geksen) iborat. Raqamlash qo'shbog' va radikallarga eng yaqin tomondan berilganda: 2,4-dimetilgeksen-3."
  },
  {
    id: 29,
    question: "29.☆ Asetilen tarkibidagi sigma va pi bog‘lar sonini toping (Berilgan tartibda).",
    options: [
      "3 va 2",
      "2 va 3",
      "2 va 2",
      "3 va 3"
    ],
    correct: 0, // A) 3 va 2
    explanation: "Asetilen (H-C≡C-H) da 2 ta C-H va 1 ta C-C σ-bog' (jami 3 ta sigma bog') hamda uchlamchi bog' tarkibida 2 ta π-bog' mavjud."
  },
  {
    id: 30,
    question: "30. Quyidagi uglevodorodni sistematik nomenklatura bo'yicha to‘g‘ri nomlangan javobni aniqlang.",
    image: "/images/hamkorlik/alchemiq-q30-formula.svg",
    options: [
      "1,4-geksadien",
      "1,5-geksadien",
      "3-etin buten-1",
      "3-metilpentadien-1,4"
    ],
    correct: 3, // D) 3-metilpentadien -1,4
    explanation: "Tuzilishi: CH₂=CH-CH(CH₃)-CH=CH₂. Asosiy zanjirda 5 ta uglerod va ikkita qo'shbog' (1 va 4-uglerodlarda), 3-uglerodda esa metil guruhi mavjud: 3-metilpentadien-1,4."
  }
]
