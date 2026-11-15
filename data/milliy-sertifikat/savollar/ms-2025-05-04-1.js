// 2025-yil 4-may, I smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Natriy va kaliy aralashmasi oltingugurt bilan to'liq ta'sirlashganda sulfidlar hosil bo'ldi. " +
  "Dastlabki aralashmada kaliy massasi natriy massasidan $11\\text{ g}$ ko'p. Hosil bo'lgan " +
  "sulfidlar massasi dastlabki metallar massasidan $9{,}6\\text{ g}$ ko'p."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$0{,}8$",
  B: "$0{,}7$",
  C: "$10{,}5$",
  D: "$14{,}2$",
  E: "$0{,}4 \\cdot N_A$",
  F: "$0{,}3 \\cdot N_A$",
}

const savollar = [
  {
    id: "ms-2025-05-04-1-1",
    turi: "variant",
    mavzu: "Aminokislotalar nomenklaturasi va tuzilishi",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2025-05-04-1/savol-1.png",
    question: "Yuqoridagi rasmda keltirilgan aminokislotaning nomini aniqlang.",
    options: ["glitsin", "serin", "sistein", "alanin"],
    correct: 3,
    explanation:
      "Rasmda tuzilish formulasi $\\ce{CH3-CH(NH2)-COOH}$ ($2$-aminopropan kislota) keltirilgan. Bu tabiiy $\\alpha$-aminokislotalardan biri — alanindir (glitsinda yon zanjir $\\ce{-H}$, serinda $\\ce{-CH2OH}$, sisteinda $\\ce{-CH2SH}$ bo'ladi).",
  },
  {
    id: "ms-2025-05-04-1-2",
    turi: "variant",
    mavzu: "Kimyoviy bog' turlari va yonish stexiometriyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Noma'lum alkanning to'liq yonish reaksiyasida uzilgan qutbli va qutbsiz kovalent bog'lar soni $1 : 1{,}6$ nisbatda bo'lsa, ushbu alkanni aniqlang.",
    options: ["metan", "etan", "propan", "butan"],
    correct: 3,
    explanation:
      "$\\ce{C_n H_{2n+2}} + \\frac{3n+1}{2}\\ce{O2 -> } n\\ce{CO2} + (n+1)\\ce{H2O}$. Uzilgan qutbli bog'lar ($\\ce{C-H}$) soni $2n+2$, qutbsiz bog'lar esa $(n-1)$ ta $\\ce{C-C}$ hamda $2 \\cdot \\frac{3n+1}{2} = 3n+1$ ta $\\ce{O=O}$ bog'laridan iborat: jami $4n$. $\\frac{2n+2}{4n} = \\frac{1}{1{,}6} \\Rightarrow n = 4$ (butan).",
  },
  {
    id: "ms-2025-05-04-1-3",
    turi: "variant",
    mavzu: "Uglevodorodlarning yonishi va nisbiy zichlik",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "Noma'lum uglevodorodning to'liq yonish reaksiyasida chap va o'ng tomondagi koeffitsiyentlar yig'indisi teng. Shu uglevodorodning metanga nisbatan zichligini toping.",
    options: ["$1{,}75$", "$2$", "$1{,}5$", "$2{,}25$"],
    correct: 0,
    explanation:
      "$\\ce{C_x H_y} + (x + \\frac{y}{4})\\ce{O2 -> } x\\ce{CO2} + \\frac{y}{2}\\ce{H2O}$. Chap va o'ng koeffitsiyentlar tengligi: $1 + x + \\frac{y}{4} = x + \\frac{y}{2} \\Rightarrow y = 4$. Variandlar ichida faqat $D_{\\ce{CH4}} = 1{,}75$ ga $M = 1{,}75 \\cdot 16 = 28\\text{ g/mol}$ ($\\ce{C2H4}$) real uglevodorod mos keladi.",
  },
  {
    id: "ms-2025-05-04-1-4",
    turi: "variant",
    mavzu: "Oleum tayyorlash hisob-kitoblari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$1000\\text{ g}$ $98{,}2\\%$ li sulfat kislota eritmasiga qancha gramm oltingugurt(VI)-oksid ($\\ce{SO3}$) qo'shilsa, $20\\%$ li oleum hosil bo'ladi?",
    options: ["$80$", "$350$", "$270$", "$360$"],
    correct: 1,
    explanation:
      "$1000\\text{ g}$ eritmada $982\\text{ g}$ $\\ce{H2SO4}$ va $18\\text{ g}$ ($1\\text{ mol}$) $\\ce{H2O}$ bor. Suvni to'liq bog'lash uchun $1\\text{ mol}$ ($80\\text{ g}$) $\\ce{SO3}$ sarflanadi. Qolgan erkin $\\ce{SO3}$ miqdori $(x - 80)\\text{ g}$, umumiy oleum massasi $(1000 + x)\\text{ g}$. Shartga ko'ra $(x - 80)/(1000 + x) = 0{,}2 \\Rightarrow 0{,}8x = 280 \\Rightarrow x = 350\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-5",
    turi: "variant",
    mavzu: "Atom tuzilishi va kvant mexanika qoidalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Hund qoidasi to'g'ri ta'riflangan qatorni belgilang.",
    options: [
      "Energiyalari bir xil bo'lgan orbitallarda (yacheykalarda) elektronlar shunday tartibda joylashadiki, natijada spinlar yig'indisi maksimal qiymatga ega bo'ladi.",
      "Atomda energetik holatlarning elektronlar bilan to'lib borish tartibi bosh va orbital kvant sonlari yig'indisining minimal qiymatga intilishiga bog'liq.",
      "Atomda to'rttala kvant sonlari bir xil qiymatga ega bo'lgan ikkita elektron mavjud bo'la olmaydi.",
      "Agar ikki element o'zaro bir necha birikma hosil qilsa, bir elementning bir xil massasiga to'g'ri keluvchi ikkinchi element massalari kichik butun sonlar nisbatida bo'ladi.",
    ],
    correct: 0,
    explanation:
      "Hund qoidasiga ko'ra bir pog'onachadagi teng energiyali orbitallarga elektronlar avval bittadan parallel spin bilan joylashadi, ya'ni spinlar yig'indisi maksimal bo'ladi. Qolganlari mos ravishda Klechkovskiy, Pauli prinsipi va karrali nisbatlar qonunidir.",
  },
  {
    id: "ms-2025-05-04-1-6",
    turi: "variant",
    mavzu: "Eritmalarda cho'kma reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$500\\text{ g}$ $19{,}6\\%$ li sulfat kislota eritmasiga necha gramm $\\ce{BaCl2 \\cdot 2H2O}$ qo'shilganda hosil bo'lgan eritmadagi sulfat kislotaning massa ulushi $5\\%$ ga teng bo'ladi?",
    options: [
      "$4880/27$",
      "$4470/27$",
      "$4465/27$",
      "$4489/27$",
    ],
    correct: 0,
    explanation:
      "Eritmada $500 \\cdot 0{,}196 = 98\\text{ g}$ ($1\\text{ mol}$) $\\ce{H2SO4}$ bor. $y\\text{ mol}$ $\\ce{BaCl2 \\cdot 2H2O}$ ($M = 244$) qo'shilganda $y\\text{ mol}$ $\\ce{BaSO4}$ ($M = 233$) cho'kmaga tushadi. Tenglash: $\\frac{98(1 - y)}{500 + 244y - 233y} = 0{,}05 \\Rightarrow 98 - 98y = 25 + 0{,}55y \\Rightarrow y = \\frac{73}{98{,}55} = \\frac{20}{27}\\text{ mol}$. Massasi: $244 \\cdot \\frac{20}{27} = \\frac{4880}{27}\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-7",
    turi: "variant",
    mavzu: "Yoqilg'i yonishi va gaz hajmlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "Ko'mir tarkibida uglerodning massa ulushi $68{,}8\\%$, vodorodniki $10\\%$, oltingugurtniki $3{,}2\\%$, qolgani esa yonmaydigan mineral moddalardir. $3\\text{ kg}$ ko'mirning to'liq yonishiga sarflangan kislorod necha $\\text{m}^3$ (n.sh.) havo tarkibida bo'ladi (havo tarkibida kislorod hajmiy ulushi $20\\%$)?",
    options: ["$25$", "$28$", "$26$", "$22{,}4$"],
    correct: 1,
    explanation:
      "$3000\\text{ g}$ ko'mirda: $n(\\ce{C}) = 2064/12 = 172\\text{ mol}$, $n(\\ce{H2}) = 300/2 = 150\\text{ mol}$, $n(\\ce{S}) = 96/32 = 3\\text{ mol}$. Sarflangan kislorod: $n(\\ce{O2}) = 172 + 150/2 + 3 = 250\\text{ mol}$, hajmi $250 \\cdot 22{,}4 = 5600\\text{ l} = 5{,}6\\text{ m}^3$. Havo hajmi: $5{,}6 / 0{,}20 = 28\\text{ m}^3$.",
  },
  {
    id: "ms-2025-05-04-1-8",
    turi: "variant",
    mavzu: "Moddalar xossalari va kimyoning asosiy tushunchalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "To'g'ri fikrni aniqlang.",
    options: [
      "Kumushning elektr o'tkazuvchanligi berilliynikidan yaxshiroq.",
      "$1\\text{ mol}$ qizil fosfor (n.sh.) da $22{,}4\\text{ litr}$ hajmni egallaydi.",
      "Havoda vodorod va kislorod $4:1$ hajmiy nisbatda bo'ladi.",
      "Har qanday kimyoviy reaksiyaga kirishgan va hosil bo'lgan moddalar koeffitsiyentlari yig'indisi teng.",
    ],
    correct: 0,
    explanation:
      "Kumush barcha metallar orasida elektr o'tkazuvchanligi eng yuqori metaldir, shuning uchun berilliydan yaxshiroq o'tkazadi. Qizil fosfor qattiq modda ($22{,}4\\text{ l}$ faqat gazlarga tegishli), havoda $4:1$ nisbat azot va kislorodga tegishli, koeffitsiyentlar yig'indisi esa har doim ham teng bo'lmaydi.",
  },
  {
    id: "ms-2025-05-04-1-9",
    turi: "variant",
    mavzu: "Oksidlar tasnifi va olinishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Qaysi reaksiyada asosli oksid hosil bo'ladi?",
    options: [
      "$\\ce{Li + O2 ->}$",
      "$\\ce{Zn + O2 ->}$",
      "$\\ce{P + O2 ->}$",
      "$\\ce{C + O2 ->}$",
    ],
    correct: 0,
    explanation:
      "Litiy kislorodda yonganda asosli oksid $\\ce{Li2O}$ hosil qiladi ($\\ce{4Li + O2 -> 2Li2O}$). Rux amfoter oksid ($\\ce{ZnO}$), fosfor va uglerod esa kislotali yoki befarq oksidlar ($\\ce{P2O5}$, $\\ce{CO2}$, $\\ce{CO}$) hosil qiladi.",
  },
  {
    id: "ms-2025-05-04-1-10",
    turi: "variant",
    mavzu: "Yuqori molekulyar birikmalar tuzilishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Polietilen $\\ce{(-CH2-CH2-)_n}$ molekulasidagi asosiy uglerod zanjiri uzunligi $308\\text{ nm}$ ga teng bo'lsa, polimerning molekulyar massasini aniqlang. Bitta $\\ce{C-C}$ bog' uzunligi $0{,}154\\text{ nm}$ ga teng.",
    options: ["$56000$", "$28000$", "$2800$", "$5600$"],
    correct: 1,
    explanation:
      "Zanjirdagi $\\ce{C-C}$ bog'lar soni (ya'ni $\\ce{-CH2-}$ bo'g'inlari soni): $308 / 0{,}154 = 2000$. Har bir $\\ce{-CH2-CH2-}$ monomerida $2$ ta uglerod atomi bo'lgani uchun polimerlanish darajasi $n = 2000 / 2 = 1000$. Polimer massasi: $M = 1000 \\cdot 28 = 28000\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-04-1-11",
    turi: "variant",
    mavzu: "Elektrolit eritmalarining elektr o'tkazuvchanligi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Qaysi modda $\\ce{Ba(OH)2}$ eritmasiga qo'shilganda eritmaning elektr o'tkazuvchanligi kamayadi?",
    options: ["$\\ce{NaOH}$", "$\\ce{Na2O}$", "$\\ce{BaCl2}$", "$\\ce{AgF}$"],
    correct: 3,
    explanation:
      "$\\ce{Ba(OH)2 + 2AgF -> BaF2 v + Ag2O v + H2O}$ reaksiyasida barcha ionlar erimaydigan cho'kmalar ($\\ce{BaF2}$ va $\\ce{Ag2O}$) hamda suvga bog'lanadi, natijada eritmadagi erkin ionlar konsentratsiyasi va elektr o'tkazuvchanligi keskin kamayadi.",
  },
  {
    id: "ms-2025-05-04-1-12",
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish reaksiyalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{KMnO4}$ neytral suvli eritmada bir moddani oksidladi. Shu jarayonda marganetsning oksidlanish darajasi necha birlikka o'zgaradi?",
    options: ["$2$", "$3$", "$5$", "$4$"],
    correct: 1,
    explanation:
      "Neytral (suvli) muhitda kaliy permanganat $\\ce{KMnO4}$ ($\\ce{Mn^{+7}}$) kam eruvchan $\\ce{MnO2}$ ($\\ce{Mn^{+4}}$) cho'kmasigacha qaytariladi. Shunday qilib, marganets atomining oksidlanish darajasi $7 - 4 = 3$ birlikka o'zgaradi.",
  },
  {
    id: "ms-2025-05-04-1-13",
    turi: "variant",
    mavzu: "Oksidlar tasnifi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Kislotali oksidlar keltirilgan qatorni aniqlang.",
    options: [
      "$\\ce{ZnO}$ va $\\ce{MnO2}$",
      "$\\ce{Fe3O4}$ va $\\ce{Mn3O4}$",
      "$\\ce{Cr2O3}$ va $\\ce{N2O}$",
      "$\\ce{N2O3}$ va $\\ce{CrO3}$",
    ],
    correct: 3,
    explanation:
      "$\\ce{N2O3}$ (nitrit kislota angidridi) va $\\ce{CrO3}$ (xromat va dixromat kislotalar angidridi) kislotali oksidlardir. $\\ce{ZnO}$, $\\ce{MnO2}$ va $\\ce{Cr2O3}$ amfoter, $\\ce{Fe3O4}$ va $\\ce{Mn3O4}$ aralash, $\\ce{N2O}$ esa tuz hosil qilmaydigan oksiddir.",
  },
  {
    id: "ms-2025-05-04-1-14",
    turi: "variant",
    mavzu: "Organik modda formulasini topish",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$6{,}2\\text{ g}$ noma'lum modda yonganda $8{,}8\\text{ g}$ karbonat angidrid, $9\\text{ g}$ suv va $2{,}8\\text{ g}$ azot hosil bo'lsa, noma'lum moddaning formulasini aniqlang.",
    options: [
      "$\\ce{C6H5NH2}$",
      "$\\ce{CH3CH2NH2}$",
      "$\\ce{C6H5NO2}$",
      "$\\ce{CH3NH2}$",
    ],
    correct: 3,
    explanation:
      "$n(\\ce{C}) = 8{,}8/44 = 0{,}2\\text{ mol}$ ($2{,}4\\text{ g}$), $n(\\ce{H}) = 2 \\cdot (9/18) = 1{,}0\\text{ mol}$ ($1{,}0\\text{ g}$), $n(\\ce{N}) = 2 \\cdot (2{,}8/28) = 0{,}2\\text{ mol}$ ($2{,}8\\text{ g}$). Jami massa $2{,}4 + 1{,}0 + 2{,}8 = 6{,}2\\text{ g}$ (kislorod yo'q). Nisbat $\\ce{C:H:N} = 0{,}2:1{,}0:0{,}2 = 1:5:1$, ya'ni metilamin $\\ce{CH3NH2}$.",
  },
  {
    id: "ms-2025-05-04-1-15",
    turi: "variant",
    mavzu: "Oqsillar va peptidlar gidrolizi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Chiziqli tuzilishli polipeptid $5$ ta glitsin, $10$ ta alanin va $15$ ta serin qoldig'idan tashkil topgan. $23{,}18\\text{ g}$ polipeptidni to'liq gidrolizlash uchun qancha ($\\text{mol}$) suv talab etiladi?",
    options: ["$0{,}30$", "$0{,}45$", "$0{,}29$", "$0{,}49$"],
    correct: 2,
    explanation:
      "$30$ ta aminokislota qoldig'ida $29$ ta peptid bog' bor. Peptid molyar massasi: $5 \\cdot 75 + 10 \\cdot 89 + 15 \\cdot 105 - 29 \\cdot 18 = 2318\\text{ g/mol}$. Miqdori: $n = 23{,}18 / 2318 = 0{,}01\\text{ mol}$. Gidroliz uchun $29 \\cdot 0{,}01 = 0{,}29\\text{ mol}$ suv kerak.",
  },
  {
    id: "ms-2025-05-04-1-16",
    turi: "variant",
    mavzu: "Elektrolitik dissotsilanish nazariyasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Dissotsilanganda ikki xil anion hosil qiladigan elektrolit formulasini ko'rsating.",
    options: [
      "$\\ce{CaOCl2}$",
      "$\\ce{KAl(SO4)2}$",
      "$\\ce{Ca3(PO4)2}$",
      "$\\ce{NaNO3}$",
    ],
    correct: 0,
    explanation:
      "Xlorli ohak — aralash tuz $\\ce{CaOCl2}$ suvli eritmada $\\ce{Ca^{2+}}$, $\\ce{Cl-}$ va $\\ce{ClO-}$ ionlariga ajralib, ikki xil anion hosil qiladi. $\\ce{KAl(SO4)2}$ esa ikki xil kation va bir xil anion ($\\ce{SO4^{2-}}$) beradi.",
  },
  {
    id: "ms-2025-05-04-1-17",
    turi: "variant",
    mavzu: "Konsentrlangan sulfat kislota reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$X\\text{ g}$ fosfor konsentrlangan sulfat kislota bilan to'liq ta'sirlashdi. Xuddi shuncha miqdordagi konsentrlangan sulfat kislota bilan $Y\\text{ g}$ mis ta'sirlashadi ($Y - X = 9{,}8$). $\\ce{CuSO4}$ eritmasiga $Z\\text{ g}$ temir tushirilganda $Y\\text{ g}$ mis ajralib chiqsa, $Z$ ni toping.",
    options: ["$14$", "$10$", "$56$", "$28$"],
    correct: 0,
    explanation:
      "$\\ce{2P + 5H2SO4 -> 2H3PO4 + 5SO2 ^ + 2H2O}$ da $k\\text{ mol}$ $\\ce{H2SO4}$ bilan $0{,}4k\\text{ mol}$ ($12{,}4k\\text{ g}$) $\\ce{P}$ kirishadi. $\\ce{Cu + 2H2SO4 -> CuSO4 + SO2 ^ + 2H2O}$ da $0{,}5k\\text{ mol}$ ($32k\\text{ g}$) $\\ce{Cu}$ kirishadi. $32k - 12{,}4k = 19{,}6k = 9{,}8 \\Rightarrow k = 0{,}5\\text{ mol}$. Demak, $n(\\ce{Cu}) = 0{,}25\\text{ mol}$, uni siqib chiqaradigan temir $0{,}25 \\cdot 56 = 14\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-18",
    turi: "variant",
    mavzu: "Karbon kislotalarning umumiy formulalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Linol kislota quyidagi qaysi umumiy formulaga mos keladi?",
    options: [
      "$\\ce{C_n H_{2n} O_2}$",
      "$\\ce{C_n H_{2n-4} O_2}$",
      "$\\ce{C_n H_{2n-2} O_2}$",
      "$\\ce{C_n H_{2n+2} O_2}$",
    ],
    correct: 1,
    explanation:
      "Linol kislota ($\\ce{C17H31COOH}$ ya'ni $\\ce{C18H32O2}$) uglevodorod zanjirida ikkita $\\ce{C=C}$ qo'shbog' tutuvchi ikki marta to'yinmagan yuqori karbon kislotadir. Umumiy formulasi $\\ce{C_n H_{2n-4} O_2}$ ($36 - 4 = 32$).",
  },
  {
    id: "ms-2025-05-04-1-19",
    turi: "variant",
    mavzu: "Kalsiy karbid olinishi va reaksiya unumi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$8{,}4\\text{ g}$ kalsiy oksid $3{,}6\\text{ g}$ uglerod bilan yuqori haroratda ta'sirlashganda ($\\eta = 75\\%$) qancha litr (n.sh.) gaz ajraladi?",
    options: ["$2{,}52$", "$3{,}36$", "$1{,}68$", "$4{,}37$"],
    correct: 2,
    explanation:
      "$\\ce{CaO + 3C -> CaC2 + CO ^}$. $n(\\ce{CaO}) = 8{,}4/56 = 0{,}15\\text{ mol}$, $n(\\ce{C}) = 3{,}6/12 = 0{,}30\\text{ mol}$. Uglerod yetishmaydi ($0{,}30 / 3 = 0{,}10\\text{ mol}$ $\\ce{CO}$ hosil bo'lishi kerak edi). $75\\%$ unum bilan: $0{,}10 \\cdot 0{,}75 \\cdot 22{,}4 = 1{,}68\\text{ litr}$.",
  },
  {
    id: "ms-2025-05-04-1-20",
    turi: "variant",
    mavzu: "Molyar konsentratsiya va ionlar muvozanati",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$300\\text{ ml}$ $0{,}2\\text{ M}$ $\\ce{NaCl}$ eritmasiga $0{,}4\\text{ M}$ li $\\ce{Na2SO4}$ eritmasidan qo'shildi. Hosil bo'lgan eritmada natriy ionlarining konsentratsiyasi $0{,}44\\text{ M}$ ga teng bo'ldi. Yangi eritmadagi xlorid ionlarining molyar konsentratsiyasini aniqlang.",
    options: ["$0{,}16$", "$0{,}22$", "$0{,}44$", "$0{,}12$"],
    correct: 3,
    explanation:
      "$V\\text{ l}$ $\\ce{Na2SO4}$ qo'shilsa: $\\frac{0{,}3 \\cdot 0{,}2 + 2 \\cdot 0{,}4 \\cdot V}{0{,}3 + V} = 0{,}44 \\Rightarrow 0{,}06 + 0{,}8V = 0{,}132 + 0{,}44V \\Rightarrow 0{,}36V = 0{,}072 \\Rightarrow V = 0{,}2\\text{ l}$. Umumiy hajm $0{,}5\\text{ l}$ da $[\\ce{Cl-}] = 0{,}06 / 0{,}5 = 0{,}12\\text{ M}$.",
  },
  {
    id: "ms-2025-05-04-1-21",
    turi: "variant",
    mavzu: "Tajriba tahlili va karbonatlar",
    soha: "Anorganik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2025-05-04-1/savol-21.png",
    question:
      "Rasmdagi tajribada magnezit ustiga nitrat kislota eritmasi quyilganda ikkinchi probirkaga yig'iladigan gazni aniqlang.",
    options: ["$\\ce{SO3}$", "$\\ce{CO2}$", "$\\ce{SO2}$", "$\\ce{NO2}$"],
    correct: 1,
    explanation:
      "Magnezit minerali magniy karbonat ($\\ce{MgCO3}$) dir. Nitrat kislota ta'sirida $\\ce{MgCO3 + 2HNO3 -> Mg(NO3)2 + CO2 ^ + H2O}$ reaksiyasi borib, karbonat angidrid ($\\ce{CO2}$) gazi ajraladi.",
  },
  {
    id: "ms-2025-05-04-1-22",
    turi: "variant",
    mavzu: "Kristallogidratlar tarkibi va molyar massa",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Tarkibi $\\ce{X \\cdot 2H2O}$ bo'lgan kristallogidratning molyar massasi $436\\text{ g/mol}$ ga teng bo'lsa, $\\ce{X}$ tuzni aniqlang.",
    options: [
      "$\\ce{Al(NO3)3}$",
      "$\\ce{Cr2(SO4)3}$",
      "$\\ce{Ca3(PO4)2}$",
      "$\\ce{Fe2(SO4)3}$",
    ],
    correct: 3,
    explanation:
      "Ikki molekula suv massasi $2 \\cdot 18 = 36\\text{ g/mol}$. Tuzning molyar massasi: $M(\\ce{X}) = 436 - 36 = 400\\text{ g/mol}$. $\\ce{Fe2(SO4)3}$ uchun $2 \\cdot 56 + 3 \\cdot 96 = 112 + 288 = 400\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-04-1-23",
    turi: "variant",
    mavzu: "Tuz eritmalarining elektrolizi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$160\\text{ ml}$ ($\\rho = 1{,}25\\text{ g/ml}$) $11{,}7\\%$ li $\\ce{NaCl}$ eritmasi elektroliz qilindi. Natijada $0{,}7\\text{ mol}$ gazlar aralashmasi hosil bo'ldi. Hosil bo'lgan vodorod massasini ($\\text{g}$) toping.",
    options: ["$1{,}2$", "$0{,}4$", "$0{,}8$", "$0{,}2$"],
    correct: 2,
    explanation:
      "Eritma massasi $160 \\cdot 1{,}25 = 200\\text{ g}$, $n(\\ce{NaCl}) = 200 \\cdot 0{,}117 / 58{,}5 = 0{,}4\\text{ mol}$. Tuz elektrolizida $0{,}2\\text{ mol}$ $\\ce{H2}$ va $0{,}2\\text{ mol}$ $\\ce{Cl2}$ (jami $0{,}4\\text{ mol}$) ajraladi. Qolgan $0{,}3\\text{ mol}$ gaz suv elektrolizidan ($2:1$ nisbatda $0{,}2\\text{ mol}$ $\\ce{H2}$ va $0{,}1\\text{ mol}$ $\\ce{O2}$) hosil bo'ladi. Jami $n(\\ce{H2}) = 0{,}4\\text{ mol} = 0{,}8\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-24",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{A + 2B -> 3C + D}$ reaksiyada $\\ce{C}$ moddaning hosil bo'lish tezligi $0{,}015\\text{ mol/(l}\\cdot\\text{s)}$, $\\ce{B}$ moddaning dastlabki konsentratsiyasi esa $0{,}45\\text{ mol/l}$ ga teng. $10\\text{ sekunddan}$ so'ng hajmi $2\\text{ litr}$ bo'lgan idishda $\\ce{B}$ modda miqdori ($\\text{mol}$) nechaga teng bo'ladi?",
    options: ["$0{,}25$", "$0{,}5$", "$0{,}7$", "$0{,}35$"],
    correct: 2,
    explanation:
      "Stexiometriyaga ko'ra $v(\\ce{B}) = \\frac{2}{3}v(\\ce{C}) = \\frac{2}{3} \\cdot 0{,}015 = 0{,}010\\text{ mol/(l}\\cdot\\text{s)}$. $10\\text{ s}$ da $\\Delta[\\ce{B}] = 0{,}10\\text{ mol/l}$ sarflanib, $[\\ce{B}] = 0{,}45 - 0{,}10 = 0{,}35\\text{ mol/l}$ qoladi. $2\\text{ litr}$ idishda $n(\\ce{B}) = 0{,}35 \\cdot 2 = 0{,}7\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-04-1-25",
    turi: "variant",
    mavzu: "Gibridlanish va organik izomeriya",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Xrom(III)-gidroksidning molyar massasiga teng molyar massali to'yingan nitrobirikma namunasida $0{,}8\\text{ mol}$ $sp^3$ gibridlangan atom bor. Xuddi shu miqdordagi nitrobirikmaga izomer bo'lgan aminokislotada nechta $sp^3$ gibrid orbital bor?",
    options: [
      "$4 \\cdot N_A$",
      "$0{,}8 \\cdot N_A$",
      "$3{,}2 \\cdot N_A$",
      "$2 \\cdot N_A$",
    ],
    correct: 0,
    explanation:
      "$M(\\ce{Cr(OH)3}) = 103\\text{ g/mol}$, demak nitrobirikma $\\ce{C4H9NO2}$ (nitrobutan). Unda $4$ ta $\\ce{C}$ atomi $sp^3$ gibridlangan, shuning uchun namuna miqdori $0{,}8 / 4 = 0{,}2\\text{ mol}$. Izomer aminomoy kislotada ($\\ce{H2N-(CH2)3-COOH}$) $3$ ta $\\ce{C}$ ($sp^3$), $1$ ta $\\ce{N}$ ($-\\ce{NH2}$, $sp^3$) va $1$ ta $\\ce{O}$ ($-\\ce{OH}$, $sp^3$) — jami $5$ ta $sp^3$ atom bor: $0{,}2 \\cdot 5 \\cdot 4 \\cdot N_A = 4 \\cdot N_A$.",
  },
  {
    id: "ms-2025-05-04-1-26",
    turi: "variant",
    mavzu: "Vant-Goff qoidasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Berilgan reaksiya $20^\\circ\\text{C}$ da $54\\text{ sekund}$, $50^\\circ\\text{C}$ da esa $2\\text{ sekund}$ davom etsa, ushbu reaksiya $30^\\circ\\text{C}$ da necha sekundda tugaydi?",
    options: ["$9$", "$18$", "$6$", "$27$"],
    correct: 1,
    explanation:
      "$\\gamma^{(50-20)/10} = \\frac{54}{2} = 27 \\Rightarrow \\gamma^3 = 27 \\Rightarrow \\gamma = 3$. Harorat $20^\\circ\\text{C}$ dan $30^\\circ\\text{C}$ ga ko'tarilganda vaqt $3$ marta kamayadi: $\\tau_{30} = 54 / 3 = 18\\text{ s}$.",
  },
  {
    id: "ms-2025-05-04-1-27",
    turi: "variant",
    mavzu: "Ko'p atomli spirtlar va oddiy efirlar",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Umumiy formulasi $\\ce{C_n H_{2n+2} O_2}$ bo'lgan $A$, $B$, $C$ moddalar mavjud. $A$ va $B$ moddalar natriy metali bilan ta'sirlashadi hamda $\\ce{Cu(OH)2}$ bilan to'q ko'k rangli eritma hosil qiladi. $C$ modda esa natriy bilan ta'sirlashadi, lekin $\\ce{Cu(OH)2}$ bilan reaksiyaga kirishmaydi. $C$ moddani aniqlang.",
    options: [
      "$\\ce{CH3-CH(OH)-CH(OCH3)-CH3}$",
      "$\\ce{CH3-CH(OH)-CH(OH)-CH3}$",
      "$\\ce{CH3-CH(OCH2CH3)-CH(OCH3)-CH3}$",
      "$\\ce{CH3-CH(OCH3)-CH(OCH3)-CH3}$",
    ],
    correct: 0,
    explanation:
      "$\\ce{Na}$ bilan ta'sirlashishi uchun kamida bitta $-\\ce{OH}$ guruhi bo'lishi kerak, $\\ce{Cu(OH)2}$ bilan ko'k eritma bermasligi uchun esa ikkita qo'shni $-\\ce{OH}$ guruhi bo'lmasligi zarur. $\\ce{CH3-CH(OH)-CH(OCH3)-CH3}$ da bitta gidroksil va bitta efir guruhi bor.",
  },
  {
    id: "ms-2025-05-04-1-28",
    turi: "variant",
    mavzu: "Kationlarga sifat reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "Temir(III) ionining sifat reaksiyasida ishlatiladigan moddalarni ko'rsating:\n" +
      "$1)$ qizil qon tuzi; $2)$ sariq qon tuzi; $3)$ natriy rodanid; $4)$ natriy gidroksid; $5)$ mis(II)-gidroksid; $6)$ kaliy sianid.",
    options: ["$1, 2, 4$", "$3, 4, 6$", "$2, 3, 4$", "$2, 5, 6$"],
    correct: 2,
    explanation:
      "$\\ce{Fe^{3+}}$ ionlari sariq qon tuzi ($\\ce{K4[Fe(CN)6]}$) bilan Berlin lazuri cho'kmasi, rodanid ionlari ($\\ce{NaSCN}$) bilan qon-qizil eritma, ishqor ($\\ce{NaOH}$) bilan esa qo'ng'ir $\\ce{Fe(OH)3}$ cho'kmasini hosil qiladi ($2, 3, 4$).",
  },
  {
    id: "ms-2025-05-04-1-29",
    turi: "variant",
    mavzu: "Ishqoriy metallar oksidlari faolligi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Litiy, natriy, kaliy, rubidiy va seziy qatorida oksidlarning suv bilan reaksiyaga kirishish aktivligi qanday o'zgaradi?",
    options: [
      "kamayib boradi",
      "o'zgarmaydi",
      "avval kamayadi, so'ng ortadi",
      "ortib boradi",
    ],
    correct: 3,
    explanation:
      "I-A guruhda yuqoridan pastga ($\\ce{Li2O -> Cs2O}$) tushgan sari metall atom radiusi ortadi, oksidlarning asoslilik kuchi kuchayadi va suv bilan reaksiyaga kirishish faolligi ortib boradi.",
  },
  {
    id: "ms-2025-05-04-1-30",
    turi: "variant",
    mavzu: "Sulfat kislota eritmalarini to'yintirish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Hajmi $500\\text{ ml}$ suvda $6\\text{ mol}$ oltingugurt(VI)-oksid eritilishidan hosil bo'lgan eritmaning ($\\rho = 1{,}4\\text{ g/ml}$) qanday hajmiga ($\\text{ml}$) $33{,}6\\text{ litr}$ (n.sh.) $\\ce{SO3}$ ni eritib, $78{,}75\\%$ li sulfat kislota eritmasini olish mumkin?",
    options: ["$500$", "$280$", "$200$", "$700$"],
    correct: 2,
    explanation:
      "Dastlabki eritma: $500\\text{ g } \\ce{H2O} + 480\\text{ g } \\ce{SO3} = 980\\text{ g}$ eritmada $6 \\cdot 98 = 588\\text{ g}$ ($60\\%$) $\\ce{H2SO4}$ bor. $m\\text{ g}$ eritmaga $1{,}5\\text{ mol}$ ($120\\text{ g}$) $\\ce{SO3}$ yuttirilganda $147\\text{ g}$ $\\ce{H2SO4}$ hosil bo'ladi: $\\frac{0{,}6m + 147}{m + 120} = 0{,}7875 \\Rightarrow 0{,}1875m = 52{,}5 \\Rightarrow m = 280\\text{ g}$. Hajmi: $V = 280 / 1{,}4 = 200\\text{ ml}$.",
  },
  {
    id: "ms-2025-05-04-1-31",
    turi: "variant",
    mavzu: "Saxaroza ishlab chiqarish texnologiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Qand lavlagidan saxaroza (shakar) olish bosqichlarini to'g'ri ketma-ketlikda joylashtiring:\n" +
      "$1)$ eritma begona moddalarni so'rib oladigan aktivlangan ko'mir bilan isitiladi;\n" +
      "$2)$ eritma vakuum apparatida bug'latiladi, shakar kristallari ajratiladi va quritiladi;\n" +
      "$3)$ suvda eruvchan kalsiy saxarat shaklida saxaroza eritmaga o'tkaziladi;\n" +
      "$4)$ eritmadan $\\ce{CO2}$ o'tkazilib, kalsiy saxarat saxaroza va $\\ce{CaCO3}$ ga parchalanadi;\n" +
      "$5)$ ezilgan lavlagi issiq suvda namlanib, olingan eritma ohak suti bilan ishlanadi;\n" +
      "$6)$ bir xil o'lchamdagi shakar kristallarini olish uchun eritma qayta kristallanadi.",
    options: [
      "$6, 2, 3, 4, 5, 1$",
      "$5, 3, 2, 4, 1, 6$",
      "$5, 3, 4, 1, 2, 6$",
      "$4, 3, 5, 1, 6, 2$",
    ],
    correct: 2,
    explanation:
      "Ishlab chiqarish ketma-ketligi: lavlagini issiq suvda yuvib ohak suti bilan ishlash ($5$) $\\rightarrow$ kalsiy saxarat hosil bo'lishi ($3$) $\\rightarrow$ $\\ce{CO2}$ bilan cho'ktirish ($4$) $\\rightarrow$ aktivlangan ko'mir bilan rangsizlantirish ($1$) $\\rightarrow$ vakuumda bug'latib quritish ($2$) $\\rightarrow$ qayta kristallash ($6$).",
  },
  {
    id: "ms-2025-05-04-1-32",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat va Le Shatelye prinsipi",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{CO_{(g)} + H2O_{(g)} <=> CO2_{(g)} + H2_{(g)}}$ reaksiyada moddalarning muvozanat konsentratsiyalari mos ravishda $16, 5, 10, 8\\text{ mol/l}$ ga teng. Hajmi $0{,}4\\text{ litr}$ bo'lgan sistemaga $0{,}4\\text{ mol}$ $\\ce{H2O}$ qo'shilganda yangi muvozanatdagi moddalar konsentratsiyasi to'g'ri berilgan qatorni ko'rsating.",
    options: [
      "$\\ce{CO} = 15{,}6\\text{ mol}$; $\\ce{CO2} = 10{,}4\\text{ mol}$",
      "$\\ce{H2O} = 5{,}6\\text{ mol/l}$; $\\ce{H2} = 8{,}4\\text{ mol/l}$",
      "$\\ce{H2O} = 5{,}6\\text{ mol}$; $\\ce{H2} = 8{,}4\\text{ mol}$",
      "$\\ce{H2} = 5{,}6\\text{ mol/l}$; $\\ce{H2O} = 8{,}4\\text{ mol/l}$",
    ],
    correct: 1,
    explanation:
      "Muvozanat doimiysi $K_m = \\frac{10 \\cdot 8}{16 \\cdot 5} = 1$. $0{,}4\\text{ mol}$ $\\ce{H2O}$ qo'shilganda $[\\ce{H2O}]$ $+0{,}4/0{,}4 = +1\\text{ mol/l}$ ga ($6\\text{ mol/l}$ ga) ortadi. Yangi muvozanatda $\\frac{(10+x)(8+x)}{(16-x)(6-x)} = 1 \\Rightarrow 80+18x = 96-22x \\Rightarrow x = 0{,}4\\text{ mol/l}$. Demak, $[\\ce{H2O}] = 5{,}6\\text{ mol/l}$, $[\\ce{H2}] = 8{,}4\\text{ mol/l}$.",
  },
  {
    id: "ms-2025-05-04-1-33",
    turi: "moslashtirish",
    mavzu: "Ishqoriy metallar va oltingugurt reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. Dastlabki aralashmadagi kaliy atomlari sonini toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "E",
    explanation:
      "Qo'shilgan oltingugurt $n(\\ce{S}) = 9{,}6/32 = 0{,}3\\text{ mol}$, demak $n(\\ce{Na}) + n(\\ce{K}) = 0{,}6\\text{ mol}$. $39n(\\ce{K}) - 23(0{,}6 - n(\\ce{K})) = 11 \\Rightarrow 62n(\\ce{K}) = 24{,}8 \\Rightarrow n(\\ce{K}) = 0{,}4\\text{ mol} = 0{,}4 \\cdot N_A$ atom (E).",
  },
  {
    id: "ms-2025-05-04-1-34",
    turi: "moslashtirish",
    mavzu: "Sulfidlar aralashmasining massa tahlili",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Hosil bo'lgan sulfidlar massa farqini ($\\text{g}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "$0{,}4\\text{ mol}$ $\\ce{K}$ dan $0{,}2\\text{ mol}$ $\\ce{K2S}$ ($0{,}2 \\cdot 110 = 22\\text{ g}$), $0{,}2\\text{ mol}$ $\\ce{Na}$ dan esa $0{,}1\\text{ mol}$ $\\ce{Na2S}$ ($0{,}1 \\cdot 78 = 7{,}8\\text{ g}$) hosil bo'ladi. Massa farqi: $22 - 7{,}8 = 14{,}2\\text{ g}$ (D).",
  },
  {
    id: "ms-2025-05-04-1-35",
    turi: "moslashtirish",
    mavzu: "Tuzlarning birgalikdagi gidrolizi",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "35. Hosil bo'lgan natriy sulfid alyuminiy sulfatning mo'l eritmasiga qo'shilganda eritma massasi necha grammga kamayadi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "$\\ce{3Na2S + Al2(SO4)3 + 6H2O -> 2Al(OH)3 v + 3H2S ^ + 3Na2SO4}$. $0{,}1\\text{ mol}$ $\\ce{Na2S}$ ($7{,}8\\text{ g}$) qo'shilganda $2/30\\text{ mol}$ $\\ce{Al(OH)3}$ ($5{,}2\\text{ g}$) cho'kadi va $0{,}1\\text{ mol}$ $\\ce{H2S}$ ($3{,}4\\text{ g}$) uchib chiqadi. Eritma massasi kamayishi: $(5{,}2 + 3{,}4) - 7{,}8 = 0{,}8\\text{ g}$ (A).",
  },
  {
    id: "ms-2025-05-04-1-36",
    turi: "ochiq",
    mavzu: "Azot birikmalari genetik qatori",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$A$ va $B$ moddalar tarkibida bir xil $X$ elementi bor. $A$ modda yorug'lik va issiqlik ta'sirida parchalanib hosil qilgan oddiy moddada $B$ modda yonadi. $B$ modda katalizatorsiz yonganda $X$ elementi hosil qilgan oddiy moddani, katalizator ishtirokida yonganda esa $XO$ tarkibli oksidni hosil qiladi. $A$ va $B$ moddalar o'zaro ta'sirlashishidan olinadigan tuzning molyar massasini ($\\text{g/mol}$) toping.",
    correct: "80",
    tolerance: 0.1,
    birlik: "g/mol",
    explanation:
      "$X$ elementi — azot ($\\ce{N}$). $A$ — $\\ce{HNO3}$ (yorug'lik va issiqlikda parchalanib $\\ce{O2}$ ajratadi), $B$ — $\\ce{NH3}$ (katalizatorsiz yonsa $\\ce{N2}$, Pt katalizatorida $\\ce{NO}$ beradi). Reaksiya $\\ce{NH3 + HNO3 -> NH4NO3}$, ammoniy nitrat molyar massasi $80\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-04-1-37",
    turi: "ochiq",
    mavzu: "Gazlar aralashmasida alkanlarning yonishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Noma'lum alkan o'z hajmidan $10$ marta ko'p hajmda $\\ce{O2}$ va $\\ce{N2}$ ($M_{\\text{o'rt}} = 30{,}8\\text{ g/mol}$) aralashmasi bilan to'la yondirildi. Hosil bo'lgan aralashmadagi suv bug'lari kondensatlangandan keyin qolgan gazlar aralashmasida azotning hajmiy ulushi $37{,}5\\%$ bo'lsa, karbonat angidridning hajmiy ulushini ($\\%$) toping.",
    correct: "37.5",
    tolerance: 0.1,
    birlik: "%",
    explanation:
      "$1\\text{ mol}$ alkan bilan $10\\text{ mol}$ ($7\\text{ mol }\\ce{O2} + 3\\text{ mol }\\ce{N2}$) gaz olingan. Quruq gazda $3\\text{ mol }\\ce{N2}$ $37{,}5\\%$ ni tashkil qilgani uchun jami quruq gaz $3/0{,}375 = 8\\text{ mol}$. Tenglama: $n(\\ce{CO2}) + (7 - 1{,}5n - 0{,}5) + 3 = 8 \\Rightarrow 9{,}5 - 0{,}5n = 8 \\Rightarrow n = 3$ (propan). $\\varphi(\\ce{CO2}) = 3/8 \\cdot 100\\% = 37{,}5\\%$.",
  },
  {
    id: "ms-2025-05-04-1-38",
    turi: "ochiq",
    mavzu: "Karbonat va gidrokarbonatlar termik parchalanishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Kaliy karbonat va kaliy gidrokarbonat aralashmasi qizdirilganda hosil bo'lgan gazning hajmi qizdirilishdan olingan qattiq qoldiqqa mo'l miqdorda xlorid kislota ta'sir ettirilganda ajralgan gaz hajmining $2/5$ qismini tashkil qiladi. Dastlabki kaliy gidrokarbonat massasi $20\\text{ g}$ bo'lsa, kaliy karbonat massasini ($\\text{g}$) aniqlang.",
    correct: "20.7",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "$20\\text{ g}$ $\\ce{KHCO3}$ ($0{,}2\\text{ mol}$) parchalanganda $0{,}1\\text{ mol}$ $\\ce{K2CO3}$ va $0{,}1\\text{ mol}$ $\\ce{CO2}$ ajraladi. Qoldiqdagi jami karbonatga kislota ta'sirida $(0{,}1 + x)\\text{ mol}$ $\\ce{CO2}$ chiqadi. Shartga ko'ra $0{,}1 = \\frac{2}{5}(0{,}1 + x) \\Rightarrow x = 0{,}15\\text{ mol}$. $m(\\ce{K2CO3}) = 0{,}15 \\cdot 138 = 20{,}7\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-39",
    turi: "ochiq",
    mavzu: "Alkenlarning gidrogenlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$1{,}3\\text{ mol}$ etilen va vodorod aralashmasi ($M_{\\text{o'rt}} = 20\\text{ g/mol}$) katalizator ishtirokida qizdirilganda aralashmaning o'rtacha molyar massasi $26\\text{ g/mol}$ bo'ldi. Necha gramm etan hosil bo'lgan?",
    correct: "9",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "Umumiy massa $m = 1{,}3 \\cdot 20 = 26\\text{ g}$ o'zgarmaydi. Reaksiyadan keyingi gazlar moli $26 / 26 = 1{,}0\\text{ mol}$. Moli kamayishi ($1{,}3 - 1{,}0 = 0{,}3\\text{ mol}$) hosil bo'lgan etan miqdoriga teng. $m(\\ce{C2H6}) = 0{,}3 \\cdot 30 = 9\\text{ g}$.",
  },
  {
    id: "ms-2025-05-04-1-40",
    turi: "ochiq",
    mavzu: "Yog'larning ishqoriy gidrolizi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Glitserin va ikki xil to'yingan bir asosli karbon kislotadan (kislotalar bir-biridan bitta $\\ce{-CH2-}$ guruhga farq qiladi) hosil bo'lgan yog' $\\ce{NaOH}$ eritmasida to'liq gidrolizlandi. Natijada $1{,}84\\%$ glitserin va $6{,}88\\%$ tuzlar saqlagan $200\\text{ g}$ eritma olindi. Dastlabki yog' massasini ($\\text{g}$) aniqlang.",
    correct: "12.64",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "Glitserin: $200 \\cdot 0{,}0184 = 3{,}68\\text{ g}$ ($0{,}04\\text{ mol}$), demak tuzlar jami $0{,}12\\text{ mol}$ ($200 \\cdot 0{,}0688 = 13{,}76\\text{ g}$). Tuzlarning o'rtacha molyar massasi $13{,}76 / 0{,}12 = 114{,}67\\text{ g/mol}$, bu $2:1$ nisbatdagi $\\ce{C3H7COONa}$ ($110$) va $\\ce{C4H9COONa}$ ($124$) ga mos keladi. Yog' $\\ce{C3H5(OOCC3H7)2(OOCC4H9)}$ ning molyar massasi $316\\text{ g/mol}$, massasi $0{,}04 \\cdot 316 = 12{,}64\\text{ g}$.",
  },
]

export default savollar
