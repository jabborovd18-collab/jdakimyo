// 2025-yil 3-may, II smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Mol nisbati $1 : 3$ bo'lgan ishqoriy metall gidridlaridan ($\\ce{AH}$ va $\\ce{BH}$) iborat " +
  "$44{,}8\\text{ g}$ aralashma mo'l miqdordagi suvda eritilsa, $1{,}6\\text{ mol}$ gaz ajraldi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$0{,}2$",
  B: "$0{,}7$",
  C: "$0{,}5$",
  D: "$0{,}6$",
  E: "$0{,}4$",
  F: "$0{,}3$",
}

const savollar = [
  {
    id: "ms-2025-05-03-2-1",
    turi: "variant",
    mavzu: "Kimyoviy bog'lanish va moddalar tuzilishi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "To'g'ri fikrni toping.",
    options: [
      "natriy gidrokarbonatda donor-akseptor bog' bor",
      "silanda metall atomi bor",
      "metanda qutbli kovalent bog' bor",
      "fosfinda $2$ ta atom bor",
    ],
    correct: 2,
    explanation:
      "Metan ($\\ce{CH4}$) molekulasida uglerod va vodorod atomlari orasida to'rtta qutbli kovalent bog' mavjud. $\\ce{NaHCO3}$ da donor-akseptor bog' yo'q, silanda ($\\ce{SiH4}$) metall emas nomtallar, fosfinda ($\\ce{PH3}$) esa $4$ ta atom bor.",
  },
  {
    id: "ms-2025-05-03-2-2",
    turi: "variant",
    mavzu: "Kislorod olish, ozon va oksidlanish-qaytarilish",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "$42{,}55\\text{ g}$ $\\ce{KNO3}$ va $\\ce{KClO3}$ aralashmasi katalizator ishtirokida to'liq qizdirildi. Hosil bo'lgan gaz ozonatordan to'liq o'tkazilib olingan modda $\\ce{KI}$ eritmasi bilan reaksiyaga kirishdi. Natijada olingan oddiy moddalarning massa farqi $44{,}4\\text{ g}$ bo'lsa, dastlabki aralashmadagi $\\ce{KNO3}$ miqdorini ($\\text{mol}$) aniqlang.",
    options: ["$0{,}1$", "$0{,}3$", "$0{,}2$", "$0{,}25$"],
    correct: 1,
    explanation:
      "$\\ce{O3 + 2KI + H2O -> I2 + O2 + 2KOH}$ reaksiyasida har $1\\text{ mol}$ ozondan $\\ce{I2}$ ($254\\text{ g}$) va $\\ce{O2}$ ($32\\text{ g}$) hosil bo'ladi; farqi $222\\text{ g}$. $n(\\ce{O3}) = 44{,}4/222 = 0{,}2\\text{ mol} \\Rightarrow n(\\ce{O2}) = 0{,}3\\text{ mol}$. Agar $x\\text{ mol }\\ce{KNO3}$ va $y\\text{ mol }\\ce{KClO3}$ bo'lsa: $0{,}5x + 1{,}5y = 0{,}3$ va $101x + 122{,}5y = 42{,}55 \\Rightarrow x = 0{,}3\\text{ mol}$, $y = 0{,}1\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-2-3",
    turi: "variant",
    mavzu: "Gaz reaksiyalarida hajm va bosim o'zgarishi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$1 : 9$ mol nisbatda olingan $\\ce{A2}$ va $\\ce{B2}$ dan iborat aralashma reaksiyaga kirishganda yagona gazsimon modda hosil bo'lgan. Reaksiyadan keyin bosim dastlabki bosimning $60\\%$ ini tashkil qiladi (o'zgarmas hajm va haroratda). Hosil bo'lgan modda formulasini ko'rsating.",
    options: ["$\\ce{AB3}$", "$\\ce{AB5}$", "$\\ce{A2B6}$", "$\\ce{A3B}$"],
    correct: 1,
    explanation:
      "$1\\text{ mol}$ $\\ce{A2}$ va $9\\text{ mol}$ $\\ce{B2}$ (jami $10\\text{ mol}$) dan keyin $6\\text{ mol}$ gaz qoladi. $\\ce{A2 + 5B2 -> 2AB5}$ reaksiyasida $1\\text{ mol}$ $\\ce{A2}$ va $5\\text{ mol}$ $\\ce{B2}$ dan $2\\text{ mol}$ $\\ce{AB5}$ hosil bo'lib, $4\\text{ mol}$ $\\ce{B2}$ ortadi: jami $2 + 4 = 6\\text{ mol}$ ($60\\%$).",
  },
  {
    id: "ms-2025-05-03-2-4",
    turi: "variant",
    mavzu: "Yog'lar va murakkab efirlarning gidrolizi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$130\\text{ g}$ glitserin tripropionat to'liq gidrolizlanganda hosil bo'lgan karbon kislota massasini ($\\text{g}$) aniqlang.",
    options: ["$55{,}5$", "$333$", "$111$", "$222$"],
    correct: 2,
    explanation:
      "$M(\\ce{C3H5(OOCC2H5)3}) = 41 + 3 \\cdot 73 = 260\\text{ g/mol}$. $n = 130 / 260 = 0{,}5\\text{ mol}$ yog' gidrolizlanganda $1{,}5\\text{ mol}$ propan kislota ($\\ce{C2H5COOH}$, $M = 74$) hosil bo'ladi: $m = 1{,}5 \\cdot 74 = 111\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-5",
    turi: "variant",
    mavzu: "Atom tuzilishi va kvant mexanika qoidalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Klechkovskiy qoidasi keltirilgan qatorni belgilang.",
    options: [
      "Energiyalari bir xil bo'lgan orbitallarda (yacheykalarda) elektronlar shunday joylashadiki, spinlar yig'indisi maksimal qiymatga ega bo'ladi.",
      "Atomda energetik holatlarning elektronlar bilan to'lib borish tartibi bosh va orbital kvant sonlari yig'indisining minimal qiymatga intilishiga bog'liq.",
      "Atomda to'rttala kvant sonlari bir xil qiymatga ega bo'lgan elektronlar mavjud bo'la olmaydi.",
      "Ikki element bir necha birikma hosil qilsa, birining bir xil massasiga to'g'ri keluvchi ikkinchisining massalari kichik butun sonlar nisbatida bo'ladi.",
    ],
    correct: 1,
    explanation:
      "Klechkovskiy qoidasiga binoan elektronlar pog'onachalarni $n + l$ yig'indisi ortib borishi tartibida to'ldiradi ($n + l$ teng bo'lsa, kichik $n$ li pog'onacha avval to'ladi).",
  },
  {
    id: "ms-2025-05-03-2-6",
    turi: "variant",
    mavzu: "Nitratlarning termik parchalanishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Kaliy nitrat tuzi termik parchalanganda azotning oksidlanish darajasi necha birlikka o'zgaradi?",
    options: ["$2$", "$3$", "$5$", "$4$"],
    correct: 0,
    explanation:
      "Kaliy nitrat qizdirilganda $\\ce{2KNO3 -> 2KNO2 + O2 ^}$ reaksiyasi boradi. Azotning oksidlanish darajasi $+5$ dan $+3$ gacha, ya'ni $2$ birlikka o'zgaradi.",
  },
  {
    id: "ms-2025-05-03-2-7",
    turi: "variant",
    mavzu: "Alkenlar gibridlanishi va Vagner reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$sp^3$ va $sp^2$ gibrid orbitallari soni $4 : 3$ nisbatda bo'lgan alken $\\ce{KMnO4}$ ning suvli eritmasidan o'tkazildi. Bunda eritmadagi suv massasi $7{,}2\\text{ g}$ ga kamaydi. Reaksiyaga kirishgan alken massasini ($\\text{g}$) toping.",
    options: ["$7$", "$4{,}2$", "$11{,}2$", "$16{,}8$"],
    correct: 3,
    explanation:
      "Monoalkenda $2$ ta $sp^2$ uglerod ($6$ ta $sp^2$ orbital) bor. $sp^3 : sp^2 = 4:3 = 8:6$ bo'lgani uchun $2$ ta $sp^3$ uglerod bor, ya'ni buten ($\\ce{C4H8}$, $M = 56$). $\\ce{3C4H8 + 2KMnO4 + 4H2O -> 3C4H8(OH)2 + 2MnO2 + 2KOH}$. $7{,}2\\text{ g}$ ($0{,}4\\text{ mol}$) suvga $0{,}3\\text{ mol}$ buten mos: $0{,}3 \\cdot 56 = 16{,}8\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-8",
    turi: "variant",
    mavzu: "Gazlar aralashmasi stexiometriyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "$1{,}1\\text{ mol}$ fosfin ($\\ce{PH3}$) va silan ($\\ce{SiH4}$) aralashmasida vodorod atomlari soni $3{,}6 \\cdot N_A$ ta bo'lsa, aralashmadagi silan massasini ($\\text{g}$) hisoblang.",
    options: ["$3{,}2$", "$9{,}6$", "$27{,}2$", "$12{,}8$"],
    correct: 1,
    explanation:
      "$x\\text{ mol }\\ce{PH3}$ va $(1{,}1 - x)\\text{ mol }\\ce{SiH4}$ uchun: $3x + 4(1{,}1 - x) = 3{,}6 \\Rightarrow x = 0{,}8\\text{ mol}$. Demak, $n(\\ce{SiH4}) = 0{,}3\\text{ mol}$, massasi $0{,}3 \\cdot 32 = 9{,}6\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-9",
    turi: "variant",
    mavzu: "Alkanlarning yonish tenglamasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$0{,}2\\text{ mol}$ alkanni to'liq yoqish uchun sarflangan kislorod massasi shu alkan massasidan $9{,}6\\text{ g}$ ga ko'p bo'lsa, alkanni aniqlang.",
    options: ["etan", "metan", "propan", "butan"],
    correct: 1,
    explanation:
      "$1\\text{ mol}$ $\\ce{C_n H_{2n+2}}$ uchun massa farqi $9{,}6/0{,}2 = 48\\text{ g}$. Sarflanadigan $\\ce{O2}$ massasi $32(1{,}5n + 0{,}5) = 48n + 16$, alkan massasi $14n + 2$. $(48n + 16) - (14n + 2) = 48 \\Rightarrow 34n = 34 \\Rightarrow n = 1$ (metan).",
  },
  {
    id: "ms-2025-05-03-2-10",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{A + 2B -> C + D}$ reaksiya bo'yicha $\\ce{A}$ moddaning sarflanish tezligi $0{,}015\\text{ mol/(l}\\cdot\\text{s)}$, $\\ce{B}$ moddaning dastlabki konsentratsiyasi esa $0{,}45\\text{ mol/l}$ ga teng. $10\\text{ sekunddan}$ keyin ($V = 2\\text{ l}$) $\\ce{B}$ moddaning konsentratsiyasini ($\\text{mol/l}$) toping.",
    options: ["$0{,}3$", "$0{,}15$", "$0{,}2$", "$0{,}25$"],
    correct: 1,
    explanation:
      "$v(\\ce{B}) = 2v(\\ce{A}) = 2 \\cdot 0{,}015 = 0{,}030\\text{ mol/(l}\\cdot\\text{s)}$. $10\\text{ s}$ ichida $\\ce{B}$ ning konsentratsiyasi $0{,}30\\text{ mol/l}$ ga kamayadi: $[\\ce{B}]_{10} = 0{,}45 - 0{,}30 = 0{,}15\\text{ mol/l}$.",
  },
  {
    id: "ms-2025-05-03-2-11",
    turi: "variant",
    mavzu: "Reaksiya tezligi va moddalar tabiati",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Odatdagi sharoitda eng tez sodir bo'ladigan reaksiyani aniqlang.",
    options: [
      "$\\ce{N2 + H2 ->}$",
      "$\\ce{K + H2O ->}$",
      "$\\ce{C2H4 + H2 ->}$",
      "$\\ce{SO2 + H2S ->}$",
    ],
    correct: 1,
    explanation:
      "Faol ishqoriy metall kaliy suv bilan xona haroratidayoq shiddatli va juda tez ta'sirlashadi. Qolgan reaksiyalar qizdirish, bosim yoki katalizator talab etadi yoxud sust boradi.",
  },
  {
    id: "ms-2025-05-03-2-12",
    turi: "variant",
    mavzu: "Eruvchanlik va neytrallanish reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$200\\text{ g}$ $10\\%$ li $\\ce{NaOH}$ eritmasiga stexiometrik yetarli miqdorda $18{,}25\\%$ li xlorid kislota eritmasi qo'shilganda necha gramm $\\ce{NaCl}$ cho'kmaga tushadi? (Ushbu haroratda $S(\\ce{NaCl}) = 10\\text{ g} / 100\\text{ g } \\ce{H2O}$.)",
    options: ["$2{,}175$", "$1{,}275$", "$3{,}125$", "$2{,}715$"],
    correct: 0,
    explanation:
      "$n(\\ce{NaOH}) = 20/40 = 0{,}5\\text{ mol}$ ($180\\text{ g } \\ce{H2O}$). Yetarli $0{,}5\\text{ mol}$ $\\ce{HCl}$ ($18{,}25\\text{ g}$) uchun $100\\text{ g}$ eritma ($81{,}75\\text{ g } \\ce{H2O}$) kerak. Reaksiyada $0{,}5\\text{ mol}$ $\\ce{NaCl}$ ($29{,}25\\text{ g}$) va $9\\text{ g } \\ce{H2O}$ hosil bo'ladi. Jami suv $180 + 81{,}75 + 9 = 270{,}75\\text{ g}$ bo'lib, unda $27{,}075\\text{ g}$ tuz eriydi. Cho'kma: $29{,}25 - 27{,}075 = 2{,}175\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-13",
    turi: "variant",
    mavzu: "Oksidlar tasnifi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Kislotali oksidlar keltirilgan qatorni aniqlang.",
    options: [
      "$\\ce{ZnO}$ va $\\ce{MnO2}$",
      "$\\ce{Na2O}$ va $\\ce{Mn3O4}$",
      "$\\ce{NO}$ va $\\ce{CO}$",
      "$\\ce{CO2}$ va $\\ce{P2O5}$",
    ],
    correct: 3,
    explanation:
      "$\\ce{CO2}$ va $\\ce{P2O5}$ kislotali oksidlar (angidridlar) hisoblanadi. $\\ce{NO}$ va $\\ce{CO}$ befarq, $\\ce{ZnO}$ va $\\ce{MnO2}$ amfoter, $\\ce{Na2O}$ esa asosli oksiddir.",
  },
  {
    id: "ms-2025-05-03-2-14",
    turi: "variant",
    mavzu: "Pirit kuydirilishi va reaksiya unumi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Piritdan ($\\eta = 80\\%$) $4{,}48\\text{ litr}$ (n.sh.) sulfit angidrid olindi. Dastlabki pirit massasini ($\\text{g}$) aniqlang.",
    options: ["$30$", "$20$", "$15$", "$12$"],
    correct: 2,
    explanation:
      "$\\ce{4FeS2 + 11O2 -> 2Fe2O3 + 8SO2}$. $n(\\ce{SO2}) = 4{,}48/22{,}4 = 0{,}2\\text{ mol}$ ga nazariy $0{,}1\\text{ mol}$ ($12\\text{ g}$) $\\ce{FeS2}$ mos keladi. $80\\%$ unum hisobga olinsa: $m = 12 / 0{,}8 = 15\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-15",
    turi: "variant",
    mavzu: "Sopolimerlanish va makromolekula tarkibi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Butadiyen-$1,3$ va etilen teng mol nisbatda sopolimerlanishidan molyar massasi $25625\\text{ g/mol}$ bo'lgan makromolekula olindi. $0{,}2\\text{ mol}$ ushbu polimerdagi barcha atomlar sonini toping.",
    options: [
      "$6{,}02 \\cdot 10^{26}$",
      "$6{,}02 \\cdot 10^{25}$",
      "$3{,}01 \\cdot 10^{27}$",
      "$3{,}01 \\cdot 10^{25}$",
    ],
    correct: 0,
    explanation:
      "Sopolimer elementar bo'g'ini $\\ce{[-CH2-CH=CH-CH2-CH2-CH2-]}$ ($\\ce{C6H10}$): $M_0 = 82\\text{ g/mol}$, atomlar soni $16$. Polimerlanish darajasi $n = 25625 / 82 = 312{,}5$. Bitta makromolekulada $312{,}5 \\cdot 16 = 5000$ ta atom bor. $0{,}2\\text{ mol}$ polimerda $0{,}2 \\cdot 5000 \\cdot N_A = 1000 \\cdot 6{,}02 \\cdot 10^{23} = 6{,}02 \\cdot 10^{26}$ atom.",
  },
  {
    id: "ms-2025-05-03-2-16",
    turi: "variant",
    mavzu: "Saxaroza ishlab chiqarish texnologiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Qand lavlagidan saxaroza (shakar) olish bosqichlarini to'g'ri joylashtiring:\n" +
      "$1)$ eritma begona moddalarni so'rib oladigan aktivlangan ko'mir bilan isitiladi;\n" +
      "$2)$ eritma vakuum apparatida bug'latiladi, shakar kristallari ajratiladi va quritiladi;\n" +
      "$3)$ suvda eruvchan kalsiy saxarati shaklida saxaroza eritmada olinadi;\n" +
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
      "Lavlagini qayta ishlashning to'g'ri texnologik tartibi: ohak suti bilan ishlash ($5$) $\\rightarrow$ kalsiy saxarat eritmasi ($3$) $\\rightarrow$ karbonizatsiya ($4$) $\\rightarrow$ aktivlangan ko'mir bilan tozalash ($1$) $\\rightarrow$ vakuum bug'latish ($2$) $\\rightarrow$ qayta kristallash ($6$).",
  },
  {
    id: "ms-2025-05-03-2-17",
    turi: "variant",
    mavzu: "Konsentrlangan nitrat kislota reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$X\\text{ g}$ fosfor konsentrlangan nitrat kislota bilan to'liq ta'sirlashdi. Xuddi shuncha miqdordagi konsentrlangan nitrat kislota bilan $Y\\text{ g}$ mis ta'sirlashadi ($Y - X = 7$). $\\ce{CuSO4}$ eritmasiga $Z\\text{ g}$ temir tushirilganda $Y\\text{ g}$ mis ajralib chiqsa, $Z$ ni toping.",
    options: ["$8$", "$10$", "$5{,}6$", "$11{,}2$"],
    correct: 1,
    explanation:
      "$\\ce{P + 5HNO3 -> H3PO4 + 5NO2 ^ + H2O}$ ($1\\text{ mol}$ $\\ce{HNO3}$ ga $6{,}2\\text{ g}$ $\\ce{P}$) va $\\ce{Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 ^ + 2H2O}$ ($1\\text{ mol}$ $\\ce{HNO3}$ ga $16\\text{ g}$ $\\ce{Cu}$). $k\\text{ mol}$ kislota uchun: $16k - 6{,}2k = 9{,}8k = 7 \\Rightarrow k = 5/7\\text{ mol}$. Ajralgan mis $n(\\ce{Cu}) = \\frac{5}{28}\\text{ mol}$, uni siqib chiqaradigan temir: $m(\\ce{Fe}) = \\frac{5}{28} \\cdot 56 = 10\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-18",
    turi: "variant",
    mavzu: "Aldegidlar oksidlanishi va eterifikatsiya",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$\\ce{R-CHO ->[Ag2O] R-COOH ->[C2H5OH] RCOOC2H5}$ sxemada birinchi bosqichda $10{,}8\\text{ g}$ kumush cho'kdi, oxirgi bosqichda esa $50\\%$ unum bilan $2{,}55\\text{ g}$ murakkab efir olindi. $R$ radikalni aniqlang.",
    options: ["metil", "propil", "etil", "butil"],
    correct: 2,
    explanation:
      "$n(\\ce{Ag}) = 10{,}8/108 = 0{,}1\\text{ mol} \\Rightarrow n(\\ce{RCOOH}) = 0{,}05\\text{ mol}$. Oxirgi bosqichda $50\\%$ unum bilan $0{,}025\\text{ mol}$ $\\ce{RCOOC2H5}$ hosil bo'lgan. $M(\\text{efir}) = 2{,}55 / 0{,}025 = 102\\text{ g/mol} \\Rightarrow M(R) = 102 - (44 + 29) = 29\\text{ g/mol}$ ($\\ce{-C2H5}$, etil).",
  },
  {
    id: "ms-2025-05-03-2-19",
    turi: "variant",
    mavzu: "Aromatik aminlar nomenklaturasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Trifenilaminning kimyoviy formulasini toping.",
    options: [
      "$\\ce{(CH3)3N}$",
      "$\\ce{(C6H5)3N}$",
      "$\\ce{C6H5NH2}$",
      "$\\ce{(C6H5)2NH}$",
    ],
    correct: 1,
    explanation:
      "Trifenilamin — azot atomidagi uchala vodorod ham fenil ($\\ce{-C6H5}$) radikallariga almashgan uchlamchi aromatik amin: $\\ce{(C6H5)3N}$.",
  },
  {
    id: "ms-2025-05-03-2-20",
    turi: "variant",
    mavzu: "Molyar konsentratsiya va eritmalar aralashtirilishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$300\\text{ ml}$ $0{,}2\\text{ M}$ $\\ce{NaCl}$ eritmasiga $0{,}4\\text{ M}$ li $\\ce{Na2SO4}$ eritmasidan qo'shildi. Hosil bo'lgan eritmada sulfat ionlari konsentratsiyasi $0{,}16\\text{ M}$ ga teng bo'lsa, natriy ionlarining molyar konsentratsiyasini aniqlang.",
    options: ["$0{,}3$", "$0{,}2$", "$0{,}44$", "$0{,}12$"],
    correct: 2,
    explanation:
      "$V\\text{ l}$ $\\ce{Na2SO4}$ qo'shilganda: $0{,}4V / (0{,}3 + V) = 0{,}16 \\Rightarrow 0{,}24V = 0{,}048 \\Rightarrow V = 0{,}2\\text{ l}$. Umumiy hajm $0{,}5\\text{ l}$ da $n(\\ce{Na+}) = 0{,}3 \\cdot 0{,}2 + 2 \\cdot 0{,}4 \\cdot 0{,}2 = 0{,}22\\text{ mol}$, konsentratsiyasi $0{,}22 / 0{,}5 = 0{,}44\\text{ M}$.",
  },
  {
    id: "ms-2025-05-03-2-21",
    turi: "variant",
    mavzu: "Tajriba tahlili va tuzlar olinishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2025-05-03-2/savol-21.png",
    question:
      "Rasmdagi tajribada magnezit ustiga nitrat kislota eritmasi quyilganda probirkada qaysi tuz eritmasi hosil bo'ladi?",
    options: [
      "temir(II)-nitrat",
      "natriy nitrat",
      "magniy nitrat",
      "temir(III)-nitrat",
    ],
    correct: 2,
    explanation:
      "Magnezit — tabiiy magniy karbonat ($\\ce{MgCO3}$). Nitrat kislota bilan reaksiyaga kirishib, eritmada magniy nitrat ($\\ce{Mg(NO3)2}$) tuzini hamda karbonat angidrid gazini hosil qiladi.",
  },
  {
    id: "ms-2025-05-03-2-22",
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish tenglamalarini tenglashtirish",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{AgClO2 + Cl2 -> AgCl + Cl2O + O2}$ reaksiyada faqat $\\ce{Cl2^0 -> Cl^{-1}}$ o'zgarishi sodir bo'lishi ma'lum bo'lsa, tenglamadagi barcha koeffitsiyentlar yig'indisini hisoblang.",
    options: ["$6$", "$9$", "$15$", "$18$"],
    correct: 2,
    explanation:
      "$\\ce{Cl2}$ faqat $\\ce{Cl-}$ ga qaytarilgani uchun barcha $\\ce{AgCl}$ dagi xlor molekulyar xlordan keladi. Elektron va atom balansidan: $\\ce{4AgClO2 + 2Cl2 -> 4AgCl + 2Cl2O + 3O2}$. Koeffitsiyentlar yig'indisi: $4 + 2 + 4 + 2 + 3 = 15$.",
  },
  {
    id: "ms-2025-05-03-2-23",
    turi: "variant",
    mavzu: "Elektroliz va Faradey qonunlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$500\\text{ g}$ $20\\%$ li mis(II)-sulfat eritmasi elektroliz qilinganda eritma massasi $423\\text{ g}$ gacha kamaydi. Xuddi shuncha Faradey tok bilan alyuminiy xlorid suyuqlanmasi elektroliz qilinsa, katodda necha gramm metall ajraladi?",
    options: ["$27$", "$11{,}25$", "$38{,}25$", "$10{,}8$"],
    correct: 2,
    explanation:
      "$n(\\ce{CuSO4}) = 100/160 = 0{,}625\\text{ mol}$. Tuz to'liq parchalanganda $0{,}625\\text{ mol }\\ce{Cu}$ ($40\\text{ g}$) va $0{,}3125\\text{ mol }\\ce{O2}$ ($10\\text{ g}$) chiqib, massa $50\\text{ g}$ kamayadi ($1{,}25\\text{ F}$). Qolgan $77 - 50 = 27\\text{ g}$ ($1{,}5\\text{ mol}$) suv elektroliziga $3{,}0\\text{ F}$ sarflanadi. Jami $4{,}25\\text{ F}$ tok bilan $m(\\ce{Al}) = 4{,}25 \\cdot 9 = 38{,}25\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-24",
    turi: "variant",
    mavzu: "Aminlar aralashmasining o'rtacha molyar massasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Ammiakka noma'lum to'yingan birlamchi alkilamin qo'shilganda azot atomlari soni $10$ marta, vodorod atomlari soni esa $22$ marta ortdi. Hosil bo'lgan aralashmaning o'rtacha molyar massasini ($\\text{g/mol}$) toping.",
    options: ["$42{,}2$", "$32{,}2$", "$20{,}8$", "$45{,}6$"],
    correct: 0,
    explanation:
      "$1\\text{ mol}$ $\\ce{NH3}$ ($1\\text{ N}, 3\\text{ H}$) ga $9\\text{ mol}$ $\\ce{C_n H_{2n+3}N}$ qo'shilgan (azot $1 \\rightarrow 10$). Vodorod: $3 + 9(2n+3) = 3 \\cdot 22 = 66 \\Rightarrow 2n+3 = 7 \\Rightarrow n = 2$ (etilamin, $M = 45$). O'rtacha massa: $(17 + 9 \\cdot 45) / 10 = 42{,}2\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-03-2-25",
    turi: "variant",
    mavzu: "Tabiiy minerallar tarkibi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Asosiy tarkibiy qismida magniy bo'lgan mineralni belgilang.",
    options: ["olivin", "silvinit", "siderit", "magnetit"],
    correct: 0,
    explanation:
      "Olivin tarkibida magniy va temir silikati $\\ce{(Mg,Fe)2SiO4}$ mavjud. Silvinit ($\\ce{KCl \\cdot NaCl}$), siderit ($\\ce{FeCO3}$) va magnetit ($\\ce{Fe3O4}$) tarkibida magniy asosiy komponent emas.",
  },
  {
    id: "ms-2025-05-03-2-26",
    turi: "variant",
    mavzu: "Reaksiya tezligi va Vant-Goff qoidasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\ce{A + B -> C + D}$ reaksiya hajmi $5\\text{ litr}$ bo'lgan idishda o'tkazildi. $10^\\circ\\text{C}$ dagi tezligi $0{,}6\\text{ mol/(l}\\cdot\\text{s)}$, $50^\\circ\\text{C}$ da esa $5\\text{ sekund}$ davomida $240\\text{ mol}$ $\\ce{D}$ modda hosil bo'ldi. Shu reaksiyaning $30^\\circ\\text{C}$ dagi tezligini ($\\text{mol/(l}\\cdot\\text{s)}$) toping.",
    options: ["$9{,}6$", "$2{,}4$", "$1{,}2$", "$4{,}8$"],
    correct: 1,
    explanation:
      "$v_{50} = 240 / (5 \\cdot 5) = 9{,}6\\text{ mol/(l}\\cdot\\text{s)}$. $\\gamma^{(50-10)/10} = 9{,}6 / 0{,}6 = 16 \\Rightarrow \\gamma = 2$. Demak, $v_{30} = 0{,}6 \\cdot 2^{(30-10)/10} = 0{,}6 \\cdot 4 = 2{,}4\\text{ mol/(l}\\cdot\\text{s)}$.",
  },
  {
    id: "ms-2025-05-03-2-27",
    turi: "variant",
    mavzu: "Alkenlarning gidrogenlanishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Molyar massasi $20\\text{ g/mol}$ bo'lgan buten va vodorod aralashmasi reaksiyaga kirishgandan so'ng o'rtacha molyar massa $24\\text{ g/mol}$ bo'ldi. Reaksion aralashma bromli suvdan o'tkazilsa, gazlar hajmi necha marta kamayadi?",
    options: ["$3/4$", "$5/4$", "$1/2$", "$4/3$"],
    correct: 1,
    explanation:
      "$M_{\\text{o'rt}} = 20$ dan buten ($56$) va $\\ce{H2}$ ($2$) $1:2$ nisbatda ($1\\text{ mol}$ buten, $2\\text{ mol}$ $\\ce{H2}$, jami $60\\text{ g}$). Keyingi jami mol $60/24 = 2{,}5\\text{ mol}$ ($0{,}5\\text{ mol}$ $\\ce{C4H8}$, $1{,}5\\text{ mol}$ $\\ce{H2}$, $0{,}5\\text{ mol}$ $\\ce{C4H10}$). Bromli suv $0{,}5\\text{ mol}$ butenni yutib, $2{,}0\\text{ mol}$ gaz qoladi: $2{,}5 / 2{,}0 = 5/4$ marta kamayadi.",
  },
  {
    id: "ms-2025-05-03-2-28",
    turi: "variant",
    mavzu: "Yadro reaksiyalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2025-05-03-2/savol-28.png",
    question:
      "Rasmdagi yadro reaksiyasi natijasida $151{,}2\\text{ g}$ $\\ce{^{252}_{99}Es}$ va $1{,}8 \\cdot N_A$ dona elektron hosil bo'ldi. Dastlabki kyuriy ($\\ce{Cm}$) izotopining nisbiy atom massasini toping.",
    options: ["$245$", "$250$", "$248$", "$242$"],
    correct: 0,
    explanation:
      "Rasmdagi tenglama: $\\ce{^x_{96}Cm + 3y ^1_0n + 2 ^1_1p -> ^{252}_{99}Es + y ^0_{-1}e + z ^0_0\\gamma + ^4_2He}$. $151{,}2/252 = 0{,}6\\text{ mol}$ $\\ce{Es}$ bilan $1{,}8\\text{ mol}$ $e^-$ chiqqan, ya'ni $y = 3$ (zaryad balansi: $96 + 2 = 99 - 3 + 2$). Massa balansi: $x + 9 + 2 = 252 + 4 \\Rightarrow x = 245$.",
  },
  {
    id: "ms-2025-05-03-2-29",
    turi: "variant",
    mavzu: "Arenlarning oksidlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Toluol va stirol aralashmasi $\\ce{KMnO4}$ bilan kislotali sharoitda to'liq oksidlanganda $4{,}48\\text{ litr}$ (n.sh.) gaz ajraldi. Dastlabki aralashmada toluol massasi stiroldan $25{,}2\\text{ g}$ ko'p bo'lsa, hosil bo'lgan organik kislota miqdorini ($\\text{mol}$) toping.",
    options: ["$0{,}7$", "$0{,}9$", "$1{,}2$", "$0{,}5$"],
    correct: 0,
    explanation:
      "Faqat stirol oksidlanishida $\\ce{CO2}$ ajraladi ($n = 4{,}48/22{,}4 = 0{,}2\\text{ mol}$), demak $n(\\text{stirol}) = 0{,}2\\text{ mol}$ ($20{,}8\\text{ g}$). Toluol massasi $20{,}8 + 25{,}2 = 46\\text{ g}$ ($0{,}5\\text{ mol}$). Har ikkisi ham benzoy kislota beradi: jami $0{,}2 + 0{,}5 = 0{,}7\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-2-30",
    turi: "variant",
    mavzu: "Yog'larning gidrolizi va tarkib tahlili",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Moy to'liq gidrolizlanganda $1\\text{ mol}$ $A$, $2\\text{ mol}$ $B$ va $1\\text{ mol}$ $C$ modda aralashmasi hosil bo'ldi. $18{,}4\\text{ g}$ $A$ modda natriy metali bilan ta'sirlashganda $6{,}72\\text{ litr}$ (n.sh.) gaz ajraldi. $B$ modda $2\\text{ mol}$ brom biriktiradi va hosil bo'lgan tetrabromli hosilada $800/15\\%$ brom bor. $C$ moddada kislorod va uglerod atom nisbati $1 : 1{,}5$ ga teng. Moy tarkibidagi kislotalarni toping.",
    options: [
      "palmitin kislota va propan kislota",
      "olein kislota va n-pentan kislota",
      "linolein kislota va n-butan kislota",
      "linol kislota va propan kislota",
    ],
    correct: 3,
    explanation:
      "$18{,}4\\text{ g}$ $A$ ($0{,}2\\text{ mol}$ glitserin) $0{,}3\\text{ mol}$ $\\ce{H2}$ chiqaradi. $B$ ning tetrabrom hosilasida $M(\\ce{Br4}) = 320\\text{ g}$ $53{,}33\\%$ ni tashkil etgani uchun $M_{\\text{tetrabrom}} = 600$, demak $M(B) = 600 - 320 = 280\\text{ g/mol}$ (linol kislota, $\\ce{C17H31COOH}$). $C$ kislotada $2$ ta $\\ce{O}$ ga $3$ ta $\\ce{C}$ mos keladi (propan kislota, $\\ce{C2H5COOH}$).",
  },
  {
    id: "ms-2025-05-03-2-31",
    turi: "variant",
    mavzu: "Tuzlar gidrolizi muvozanati",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{AlCl3}$ ning bosqichli gidroliz jarayonini ($\\ce{Al^{3+} -> AlOH^{2+} -> Al(OH)2+ -> Al(OH)3}$) o'ng tomonga siljitish uchun qaysi amaldan foydalanish kerak?",
    options: [
      "$\\ce{H+}$ ionlarini qo'shish kerak",
      "$\\ce{OH-}$ ionlarini chiqarib yuborish kerak",
      "$\\ce{H+}$ ionlarini chiqarib yuborish kerak",
      "suv miqdorini kamaytirish kerak",
    ],
    correct: 2,
    explanation:
      "Kation bo'yicha gidrolizda har bir bosqichda $\\ce{H+}$ ionlari hosil bo'ladi ($\\ce{Al^{3+} + H2O <=> AlOH^{2+} + H+}$). Le Shatelye prinsipiga ko'ra reaksiya mahsuloti bo'lgan $\\ce{H+}$ ionlarini bog'lab chiqarib yuborish muvozanatni o'ngga siljitadi.",
  },
  {
    id: "ms-2025-05-03-2-32",
    turi: "variant",
    mavzu: "Elektrolitik dissotsilanish",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Dissotsilanganda ikki xil anion hosil qiladigan elektrolit formulasini ko'rsating.",
    options: ["$\\ce{NaOH}$", "$\\ce{H2SO4}$", "$\\ce{NaKSO4}$", "$\\ce{CaCl2}$"],
    correct: 1,
    explanation:
      "Ikki negizli sulfat kislota $\\ce{H2SO4}$ suvli eritmada ikki bosqichda dissotsilanib, $\\ce{HSO4-}$ (gidrosulfat) va $\\ce{SO4^{2-}}$ (sulfat) kabi ikki xil anion hosil qiladi. $\\ce{NaKSO4}$ da esa faqat bitta turdagi anion ($\\ce{SO4^{2-}}$) bor.",
  },
  {
    id: "ms-2025-05-03-2-33",
    turi: "moslashtirish",
    mavzu: "Ishqoriy metall gidridlari aralashmasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "33. $3 : 1$ mol nisbatda olingan $\\ce{AH}$ va $\\ce{BH}$ dan iborat $7{,}2\\text{ g}$ aralashma suvda eritilsa, necha mol gaz ajraladi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "$0{,}4\\text{ mol }\\ce{AH} + 1{,}2\\text{ mol }\\ce{BH} = 44{,}8\\text{ g} \\Rightarrow A + 3B = 108 \\Rightarrow A = 39$ ($\\ce{KH}, M=40$), $B = 23$ ($\\ce{NaH}, M=24$). $3:1$ nisbatda o'rtacha massa $(3 \\cdot 40 + 24)/4 = 36\\text{ g/mol}$. $n = 7{,}2 / 36 = 0{,}2\\text{ mol }\\ce{H2}$ (A).",
  },
  {
    id: "ms-2025-05-03-2-34",
    turi: "moslashtirish",
    mavzu: "Ishqoriy metall gidridlari aralashmasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "34. $1 : 2$ mol nisbatda bo'lgan $\\ce{AH}$ va $\\ce{BH}$ dan iborat $17{,}6\\text{ g}$ aralashma suvda eritilsa, necha mol gaz ajraladi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "$1\\text{ mol }\\ce{KH}$ ($40\\text{ g}$) va $2\\text{ mol }\\ce{NaH}$ ($48\\text{ g}$) ning jami massasi $88\\text{ g}$ ($3\\text{ mol}$ $\\ce{H2}$ chiqaradi). $17{,}6\\text{ g}$ aralashma: $17{,}6 / 88 \\cdot 3 = 0{,}6\\text{ mol }\\ce{H2}$ (D).",
  },
  {
    id: "ms-2025-05-03-2-35",
    turi: "moslashtirish",
    mavzu: "Ishqoriy metall gidridlari aralashmasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "35. $1 : 1$ mol nisbatda bo'lgan $\\ce{BH}$ va $\\ce{AH}$ dan iborat $12{,}8\\text{ g}$ aralashma suvda eritilsa, necha mol gaz ajraladi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "E",
    explanation:
      "$1\\text{ mol }\\ce{NaH} + 1\\text{ mol }\\ce{KH} = 24 + 40 = 64\\text{ g}$ ($2\\text{ mol}$ $\\ce{H2}$ beradi). $12{,}8\\text{ g}$ aralashma eritilganda $12{,}8 / 64 \\cdot 2 = 0{,}4\\text{ mol}$ $\\ce{H2}$ ajraladi (E).",
  },
  {
    id: "ms-2025-05-03-2-36",
    turi: "ochiq",
    mavzu: "Klapeyron-Mendeleyev tenglamasi va gaz portlashi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$126\\text{ mg}$ alyuminiy ishqor eritmasida to'liq eritildi. Ajralib chiqqan gaz havo ($20\\%$ $\\ce{O2}$, $80\\%$ $\\ce{N2}$) bilan aralashtirilib, havosi so'rib olingan $1{,}662\\text{ litr}$ hajmli idishga ($43{,}95\\text{ kPa}$ va $20^\\circ\\text{C}$) joylashtirildi. Aralashma portlatilib dastlabki sharoitga keltirilganda ($\\ce{H2O}$ kondensatlandi) bosim $28{,}5675\\text{ kPa}$ bo'lib qoldi. Keyingi aralashmadagi gazlar miqdorlarining ($\\text{mmol}$) farqini toping ($R = 8{,}31$).",
    correct: "17.3",
    tolerance: 0.1,
    birlik: "mmol",
    explanation:
      "$n(\\ce{H2}) = \\frac{126}{27} \\cdot \\frac{3}{2} = 7\\text{ mmol}$. Dastlabki gazlar miqdori: $n_0 = \\frac{43{,}95 \\cdot 1{,}662}{8{,}31 \\cdot 293} = 30\\text{ mmol}$ ($7\\text{ mmol }\\ce{H2}$ va $23\\text{ mmol}$ havo: $4{,}6\\text{ mmol }\\ce{O2}$, $18{,}4\\text{ mmol }\\ce{N2}$). Reaksiyada $7\\text{ mmol }\\ce{H2}$ $3{,}5\\text{ mmol }\\ce{O2}$ bilan birikib, $1{,}1\\text{ mmol }\\ce{O2}$ va $18{,}4\\text{ mmol }\\ce{N2}$ qoladi ($P = 19{,}5/30 \\cdot 43{,}95 = 28{,}5675\\text{ kPa}$). Farqi: $18{,}4 - 1{,}1 = 17{,}3\\text{ mmol}$.",
  },
  {
    id: "ms-2025-05-03-2-37",
    turi: "ochiq",
    mavzu: "Kristallogidratlar aralashmasi va konsentratsiya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$25\\text{ g}$ $\\ce{Na2SO4 \\cdot 6H2O}$ va tarkibida $24\\%$ suv bo'lgan $\\ce{Al2(SO4)3 \\cdot nH2O}$ aralashmasi suvda eritilganda tarkibida $151{,}6\\text{ g}$ suv bo'lgan eritma olindi. Agar kristallogidratlardagi tuzlar miqdori ($\\text{mol}$) teng bo'lsa, hosil bo'lgan eritmadagi alyuminiy sulfatning foiz konsentratsiyasini ($\\%$) toping.",
    correct: "17.1",
    tolerance: 0.1,
    birlik: "%",
    explanation:
      "$25\\text{ g}$ $\\ce{Na2SO4 \\cdot 6H2O}$ ($M=250$) $0{,}1\\text{ mol}$ tuz ($14{,}2\\text{ g}$ $\\ce{Na2SO4}$) saqlaydi. Shuncha $0{,}1\\text{ mol}$ ($34{,}2\\text{ g}$) $\\ce{Al2(SO4)3}$ esa $76\\%$ ni tashkil etgani uchun alyuminiy kristallogidrati $34{,}2/0{,}76 = 45\\text{ g}$. Umumiy eritma massasi: $151{,}6 + 14{,}2 + 34{,}2 = 200\\text{ g}$. $\\omega(\\ce{Al2(SO4)3}) = 34{,}2 / 200 \\cdot 100\\% = 17{,}1\\%$.",
  },
  {
    id: "ms-2025-05-03-2-38",
    turi: "ochiq",
    mavzu: "Plastinka va tuz eritmasi reaksiyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$217\\text{ ml}$ $(5000/217)\\%$ li mis(II)-sulfat eritmasiga ($\\rho = 1{,}2\\text{ g/ml}$) temir plastinka tushirildi. Ma'lum vaqtdan keyin eritmada $\\ce{CuSO4}$ ning massa ulushi $20\\%$ ni tashkil qilsa, olingan eritmadagi tuzlarning massa farqini ($\\text{g}$) toping.",
    correct: "44.4",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "Dastlabki eritma $217 \\cdot 1{,}2 = 260{,}4\\text{ g}$, undagi $\\ce{CuSO4} = 260{,}4 \\cdot \\frac{50}{217} = 60\\text{ g}$. $x\\text{ mol}$ $\\ce{Fe}$ reaksiyaga kirishsa, eritma massasi $8x\\text{ g}$ ga kamayadi: $\\frac{60 - 160x}{260{,}4 - 8x} = 0{,}2 \\Rightarrow 158{,}4x = 7{,}92 \\Rightarrow x = 0{,}05\\text{ mol}$. Tuzlar: $m(\\ce{CuSO4}) = 60 - 8 = 52\\text{ g}$, $m(\\ce{FeSO4}) = 0{,}05 \\cdot 152 = 7{,}6\\text{ g}$. Farqi: $52 - 7{,}6 = 44{,}4\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-2-39",
    turi: "ochiq",
    mavzu: "Uglevodorodlar aralashmasining zichligi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Propinga noma'lum alkan qo'shilganda tizimdagi atomlar soni $11$ marta, massa esa $6{,}6$ marta ortdi. Hosil bo'lgan aralashmaning geliyga nisbatan zichligini toping.",
    correct: "4.4",
    tolerance: 0.05,
    birlik: "marta",
    explanation:
      "$1\\text{ mol}$ propin ($40\\text{ g}$, $7\\text{ mol}$ atom) ga $x\\text{ mol}$ $\\ce{C_n H_{2n+2}}$ qo'shilganda $x(3n+2) = 70$ va $x(14n+2) = 5{,}6 \\cdot 40 = 224$. Nisbatdan $(14n+2)/(3n+2) = 16/5 \\Rightarrow n = 1$ ($\\ce{CH4}$), $x = 14\\text{ mol}$. $M_{\\text{o'rt}} = (40 + 14 \\cdot 16)/15 = 17{,}6\\text{ g/mol}$, $D_{\\ce{He}} = 17{,}6 / 4 = 4{,}4$.",
  },
  {
    id: "ms-2025-05-03-2-40",
    turi: "ochiq",
    mavzu: "Dibromalkanlar izomeriyasi va ko'p atomli spirtlar",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$3 : 1$ mol nisbatdagi ikki izomer dibromalkanlar aralashmasi ishqorning spirtdagi eritmasida qizdirilganda ikkalasidan ham propin hosil bo'ldi va bromli suvdan o'tkazilib $28{,}8\\text{ g}$ tetrabromalkan olindi. Xuddi shunday aralashma suvli ishqorda gidrolizlanib $\\ce{Cu(OH)2}$ bilan ishlanganda $2{,}88\\text{ g}$ qizil cho'kma tushdi. Eritmaga tiniq ko'k rang beruvchi mis(II) glikolyat kompleksining ($\\ce{Cu(C3H7O2)2}$) massasini ($\\text{g}$) aniqlang.",
    correct: "6.42",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$n(\\ce{C3H4Br4}) = 28{,}8/360 = 0{,}08\\text{ mol}$ ($0{,}06\\text{ mol}$ $1,2$-dibrompropan va $0{,}02\\text{ mol}$ $1,1$-dibrompropan). Gidrolizdan $0{,}02\\text{ mol}$ propanal ($0{,}02\\text{ mol}$ $\\ce{Cu2O} = 2{,}88\\text{ g}$) va $0{,}06\\text{ mol}$ propan-$1,2$-diol hosil bo'ladi. $2\\text{ mol}$ diol $1\\text{ mol}$ $\\ce{Cu(OH)2}$ bilan $1\\text{ mol}$ $\\ce{Cu(C3H7O2)2}$ ($M = 214\\text{ g/mol}$) beradi: $0{,}03 \\cdot 214 = 6{,}42\\text{ g}$.",
  },
]

export default savollar
