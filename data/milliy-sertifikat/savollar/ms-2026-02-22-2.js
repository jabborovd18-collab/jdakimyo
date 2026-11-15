// 2026-yil 22-fevral, II smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "To'yingan bir asosli karbon kislotaning murakkab efiri $\\ce{NaOH}$ eritmasi bilan gidroliz qilindi. " +
  "Reaksiyadan $2{,}2\\text{ g}$ natriyli tuz va $0{,}64\\text{ g}$ spirt olindi. Spirt ajratib olinib " +
  "natriy metali bilan ishlanganda $0{,}224\\text{ litr}$ (n.sh.) gaz ajraldi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$1{,}59$",
  B: "$2{,}14$",
  C: "$1{,}68$",
  D: "$2{,}04$",
  E: "$0{,}88$",
  F: "$1{,}76$",
}

const savollar = [
  {
    id: "ms-2026-02-22-2-1",
    turi: "variant",
    mavzu: "Modda tarkibi va massa ulushi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Qaysi kislota tarkibida kislota qoldig'ining massa ulushi eng katta?",
    options: [
      "ortofosfat kislota",
      "sulfat kislota",
      "sulfid kislota",
      "karbonat kislota",
    ],
    correct: 1,
    explanation:
      "Kislota qoldig'i massa ulushi: $\\ce{H3PO4}$ da $95/98 \\approx 96{,}94\\%$, $\\ce{H2SO4}$ da $96/98 \\approx 97{,}96\\%$, $\\ce{H2CO3}$ da $60/62 \\approx 96{,}77\\%$, $\\ce{H2S}$ da $32/34 \\approx 94{,}12\\%$. Eng kattasi sulfat kislotada.",
  },
  {
    id: "ms-2026-02-22-2-2",
    turi: "variant",
    mavzu: "Tuzlarning termik parchalanishi va o'rtacha molyar massa",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Quyidagi tuzlar termik parchalanganda hosil bo'ladigan gazlar aralashmasining o'rtacha molyar massasi ($\\text{g/mol}$) ortib borish tartibida joylashtiring:\n" +
      "$1)\\ \\ce{Cu(NO3)2};\\quad 2)\\ \\ce{KNO3};\\quad 3)\\ \\ce{NH4Cl};\\quad 4)\\ \\ce{KHCO3}$.",
    options: [
      "$4, 1, 2, 3$",
      "$3, 2, 1, 4$",
      "$1, 2, 3, 4$",
      "$4, 2, 1, 3$",
    ],
    correct: 1,
    explanation:
      "$\\ce{NH4Cl -> NH3 + HCl}$ uchun $\\bar{M} = (17+36{,}5)/2 = 26{,}75$; $\\ce{KNO3}$ dan $\\ce{O2}$ ($32$); $\\ce{Cu(NO3)2 -> CuO + 2NO2 + 0{,}5O2}$ uchun $(92+16)/2{,}5 = 43{,}2$; $\\ce{KHCO3}$ dan quruq gaz $\\ce{CO2}$ ($44$). Tartib: $3, 2, 1, 4$.",
  },
  {
    id: "ms-2026-02-22-2-3",
    turi: "variant",
    mavzu: "Kimyoning asosiy qonunlari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "To'g'ri fikrni aniqlang.",
    options: [
      "«Moddalar bordan yo'q bo'lmaydi, yo'qdan bor bo'lmaydi» — bu modda massasining saqlanish qonunidir.",
      "Avogadro qonuni faqat gazlar uchun amal qiladi.",
      "Teng hajmdagi azot va bromda molekulalar soni teng.",
      "Teng hajmdagi ftor va yodda molekulalar soni teng.",
    ],
    correct: 1,
    explanation:
      "Avogadro qonuni faqat gazsimon moddalar uchun taalluqli ($\\ce{Br2}$ suyuq, $\\ce{I2}$ qattiq). Kimyoviy reaksiyada esa moddalar o'zgaradi, atomlar soni va umumiy massa saqlanadi.",
  },
  {
    id: "ms-2026-02-22-2-4",
    turi: "variant",
    mavzu: "Atom tuzilishi va Hund qoidasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Hund qoidasiga mos elektron taqsimot berilgan javobni toping.",
    options: [
      "$2p^4$: [  ] [↑↓ ↑↓] [  ]",
      "$2p^3$: [↑] [↑] [↑]",
      "$5d^5$: [  ] [↑↓ ↑↓ ↓] [  ] [  ] [  ]",
      "$3d^3$: [↑↓ ↑] [  ] [  ] [  ] [  ]",
    ],
    correct: 1,
    explanation:
      "Hund qoidasiga ko'ra, bir xil energiyali orbitallarga elektronlar avval bittadan parallel spin bilan joylashadi: $2p^3$ da uchta katakda bittadan bir xil yo'nalishli elektron ($[\\uparrow][\\uparrow][\\uparrow]$) joylashadi.",
  },
  {
    id: "ms-2026-02-22-2-5",
    turi: "variant",
    mavzu: "Izotoplar va nisbiy atom massa",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Tabiiy galliyning o'rtacha nisbiy atom massasi $69{,}72$ ga teng. Galliy tabiatda $^{71}\\text{Ga}$ va $^{69}\\text{Ga}$ izotoplari ko'rinishida uchraydi. $^{71}\\text{Ga}$ izotopining mol ulushini ($\\%$) toping.",
    options: ["$36$", "$45$", "$50$", "$75$"],
    correct: 0,
    explanation:
      "$71x + 69(1 - x) = 69{,}72 \\Rightarrow 2x = 0{,}72 \\Rightarrow x = 0{,}36$, ya'ni $^{71}\\text{Ga}$ izotopining ulushi $36\\%$ ni tashkil etadi.",
  },
  {
    id: "ms-2026-02-22-2-6",
    turi: "variant",
    mavzu: "Molekuladagi kimyoviy bog'lar soni",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-6.png",
    question:
      "Berilgan moddalar ketma-ketligida molekuladagi umumiy bog'lar sonining o'zgarishi to'g'ri ko'rsatilgan javobni tanlang.",
    options: [
      "$1$-ortadi; $2$-kamayadi; $3$-o'zgarmaydi",
      "$1$-kamayadi; $2$-ortadi; $3$-o'zgarmaydi",
      "$1$-ortadi; $2$-o'zgarmaydi; $3$-kamayadi",
      "$1$-kamayadi; $2$-o'zgarmaydi; $3$-ortadi",
    ],
    correct: 1,
    explanation:
      "Glukon kislota ($\\ce{C6H12O7}$) da $(6\\cdot 4 + 12 + 7\\cdot 2)/2 = 25$ ta bog', metilizopropilketon ($\\ce{C5H10O}$) da $(20+10+2)/2 = 16$ ta bog', $2,2,4$-trimetilpentan ($\\ce{C8H18}$) da $(32+18)/2 = 25$ ta bog' bor. Shu sababli $1$-kamayadi, $2$-ortadi, $3$-o'zgarmaydi.",
  },
  {
    id: "ms-2026-02-22-2-7",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi konstantasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-22-2/savol-7.png",
    question:
      "Berilgan grafikda $\\ce{2NO2 -> N2O4}$ reaksiyasi uchun kimyoviy reaksiya tezligi ($\\text{mol/(l}\\cdot\\text{s)}$) va $\\ce{NO2}$ konsentratsiyasining ($\\text{mol/l}$) bog'liqligi tasvirlangan. Grafik asosida tezlik konstantasini toping.",
    options: ["$0{,}25$", "$0{,}5$", "$1$", "$2$"],
    correct: 1,
    explanation:
      "$v = k[\\ce{NO2}]^2$ tenglamaga grafikdagi nuqtalarni qo'ysak: $C = 1$ da $v = 0{,}5$; $C = 2$ da $v = 2$; $C = 4$ da $v = 8$. Demak, $k = v/C^2 = 0{,}5 / 1^2 = 0{,}5\\text{ l/(mol}\\cdot\\text{s)}$.",
  },
  {
    id: "ms-2026-02-22-2-8",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat va Le-Shatelye prinsipi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{N2 + 3H2 <=> 2NH3},\\ \\Delta H = -92\\text{ kJ}$ jarayonida turli ta'sirlar ($1$–$3$) va muvozanat siljishini ($a$–$c$) moslashtiring:\n" +
      "$1)$ hajmni oshirish; $2)$ haroratni oshirish; $3)$ yuqori unumli katalizator qo'shish.\n" +
      "$a)$ chapga; $b)$ o'ngga; $c)$ siljimaydi.",
    options: [
      "$1$-b; $2$-a; $3$-b",
      "$1$-a; $2$-b; $3$-b",
      "$1$-a; $2$-a; $3$-c",
      "$1$-b; $2$-b; $3$-c",
    ],
    correct: 2,
    explanation:
      "Hajmni oshirish (bosim kamayadi) gaz mollari ko'p tomonga — chapga ($1$-a) siljitadi. Ekzotermik reaksiyada haroratni oshirish endotermik tomonga — chapga ($2$-a) siljitadi. Katalizator muvozanatni siljitmaydi ($3$-c).",
  },
  {
    id: "ms-2026-02-22-2-9",
    turi: "variant",
    mavzu: "Eritmalarni aralashtirish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "$100\\text{ g}$ $70\\%$ li, $100\\text{ g}$ $60\\%$ li va $100\\text{ g}$ $30\\%$ li bir xil kislota eritmalaridan $250\\text{ g}$ $55\\%$ li eritma tayyorlash uchun har biridan necha grammdan olish kerak?",
    options: [
      "$100\\text{ g}$ $70\\%$ li, $75\\text{ g}$ $60\\%$ li va $75\\text{ g}$ $30\\%$ li",
      "$75\\text{ g}$ $70\\%$ li, $75\\text{ g}$ $60\\%$ li va $100\\text{ g}$ $30\\%$ li",
      "$70\\text{ g}$ $70\\%$ li, $60\\text{ g}$ $60\\%$ li va $30\\text{ g}$ $30\\%$ li",
      "$30\\text{ g}$ $70\\%$ li, $75\\text{ g}$ $60\\%$ li va $100\\text{ g}$ $30\\%$ li",
    ],
    correct: 0,
    explanation:
      "Kerakli sof kislota: $250 \\cdot 0{,}55 = 137{,}5\\text{ g}$. Tekshirish: $100\\cdot 0{,}7 + 75\\cdot 0{,}6 + 75\\cdot 0{,}3 = 70 + 45 + 22{,}5 = 137{,}5\\text{ g}$ va jami massa $100 + 75 + 75 = 250\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-10",
    turi: "variant",
    mavzu: "Elektrolitlar va elektr o'tkazuvchanlik",
    soha: "Umumiy kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-22-2/savol-10.png",
    question:
      "Berilgan $3$ ta idishlardagi (chapdan o'ngga: $1$, $2$, $3$) eritmalarni elektr o'tkazuvchanligi kamayib borish tartibida joylashtiring. Barcha elektrolitlar uchun $\\alpha = 100\\%$.",
    options: ["$1, 2, 3$", "$3, 1, 2$", "$2, 1, 3$", "$3, 2, 1$"],
    correct: 1,
    explanation:
      "Bir xil $1\\text{ l}$, $2\\text{ M}$ eritmalarda ionlar soni va zaryadi: $3)\\ \\ce{Al(NO3)3}$ ($4\\cdot 2 = 8\\text{ mol}$ ion), $1)\\ \\ce{CaCl2}$ ($3\\cdot 2 = 6\\text{ mol}$ ion), $2)\\ \\ce{CuSO4}$ ($2\\cdot 2 = 4\\text{ mol}$ ion). Kamayish tartibi: $3, 1, 2$.",
  },
  {
    id: "ms-2026-02-22-2-11",
    turi: "variant",
    mavzu: "Elektrolitik dissotsilanish darajasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Sirka kislotaning dissotsilanish darajasi $5\\%$ bo'lgan $500\\text{ ml}$ eritmasida kislotaning konsentratsiyasi $0{,}02\\text{ mol/l}$ ga teng. Eritmadagi $\\ce{H+}$ ionlari miqdorini ($\\text{mol}$) toping.",
    options: [
      "$1 \\cdot 10^{-3}$",
      "$1 \\cdot 10^{-4}$",
      "$5 \\cdot 10^{-3}$",
      "$5 \\cdot 10^{-4}$",
    ],
    correct: 3,
    explanation:
      "Eritmadagi $\\ce{CH3COOH}$ miqdori: $n = C\\cdot V = 0{,}02 \\cdot 0{,}5 = 0{,}01\\text{ mol}$. $\\alpha = 0{,}05$ bo'lgani uchun $n(\\ce{H+}) = 0{,}01 \\cdot 0{,}05 = 5 \\cdot 10^{-4}\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-22-2-12",
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish reaksiyalarini tenglash",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$\\ce{I2 + HNO3 + PbO2 -> Pb(IO3)2 + Pb(NO3)2 + H2O}$ oksidlanish-qaytarilish reaksiyasidagi barcha koeffitsiyentlar yig'indisini toping.",
    options: ["$22$", "$23$", "$24$", "$25$"],
    correct: 1,
    explanation:
      "Tenglashtirilgan reaksiya: $\\ce{I2 + 8HNO3 + 5PbO2 -> Pb(IO3)2 + 4Pb(NO3)2 + 4H2O}$. Koeffitsiyentlar yig'indisi: $1 + 8 + 5 + 1 + 4 + 4 = 23$.",
  },
  {
    id: "ms-2026-02-22-2-13",
    turi: "variant",
    mavzu: "Karbonatlarning parchalanishi va sifat reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-13.png",
    question:
      "Ko'rsatilgan tajribadagi o'ng tomondagi kolbaga xos javobni belgilang:\n" +
      "$a)$ gaz yuttirilganda dastlab loyqalanish kuzatiladi va gaz yuttirilishi davom ettirilganda tiniq eritma hosil bo'ladi;\n" +
      "$b)$ parchalanish reaksiyasi sodir bo'ladi;\n" +
      "$c)$ cho'kmaning formulasi $\\ce{CaCO3}$ ko'rinishida bo'ladi;\n" +
      "$d)$ oksidlanish-qaytarilish reaksiyasi sodir bo'ladi.",
    options: ["$a, b$", "$c, d$", "$a, c$", "$b, d$"],
    correct: 2,
    explanation:
      "Chap probirkada $\\ce{CuCO3 -> CuO + CO2}$ parchalanish boradi. O'ng kolbada $\\ce{Ca(OH)2 + CO2 -> CaCO3 v + H2O}$ (loyqalanish, c) va ortiqcha $\\ce{CO2}$ da $\\ce{Ca(HCO3)2}$ ga erish ($a$) sodir bo'ladi.",
  },
  {
    id: "ms-2026-02-22-2-14",
    turi: "variant",
    mavzu: "Kimyoviy reaksiyalarning turlari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Berilgan reaksiyalardan almashinish reaksiyasini toping.",
    options: [
      "$\\ce{Fe3O4 + Al ->}$",
      "$\\ce{Al4C3 + H2O ->}$",
      "$\\ce{CaCO3 + CO2 + H2O ->}$",
      "$\\ce{Na + H2O ->}$",
    ],
    correct: 1,
    explanation:
      "Karbid gidrolizi ($\\ce{Al4C3 + 12H2O -> 4Al(OH)3 + 3CH4}$) ikki murakkab modda orasida tarkibiy qismlar almashinuvi (almashinish reaksiyasi) orqali boradi.",
  },
  {
    id: "ms-2026-02-22-2-15",
    turi: "variant",
    mavzu: "Gazlar aralashmasi va protonlar soni",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$8{,}96\\text{ litr}$ (n.sh.) $\\ce{NH3}$ va $\\ce{H2S}$ aralashmasida $36{,}12 \\cdot 10^{23}$ ta proton bor bo'lsa, aralashma tarkibidagi vodorod atomlari miqdorini ($\\text{mol}$) toping.",
    options: ["$0{,}75$", "$0{,}95$", "$1{,}5$", "$1{,}25$"],
    correct: 1,
    explanation:
      "$n(\\text{aralashma}) = 8{,}96/22{,}4 = 0{,}4\\text{ mol}$; protonlar $= 36{,}12/6{,}02 = 6\\text{ mol}$. $x + y = 0{,}4$ va $10x + 18y = 6 \\Rightarrow x = 0{,}15\\text{ mol }\\ce{NH3}$, $y = 0{,}25\\text{ mol }\\ce{H2S}$. $n(\\ce{H}) = 3\\cdot 0{,}15 + 2\\cdot 0{,}25 = 0{,}95\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-22-2-16",
    turi: "variant",
    mavzu: "Azot birikmalari va reaksiya turlari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-16.png",
    question:
      "Berilgan sxemadagi o'tishlarning tegishli sharoitda amalga oshishini bilgan holda parchalanish reaksiyasi raqamini tanlang.",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 1,
    explanation:
      "$2$-raqamli o'tish mis(II) nitratning termik parchalanishi: $\\ce{2Cu(NO3)2 -> 2CuO + 4NO2 + O2}$. Bu tipik parchalanish reaksiyasidir.",
  },
  {
    id: "ms-2026-02-22-2-17",
    turi: "variant",
    mavzu: "Galogenlar va ekvivalent massa",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$A$ tuz alangani sariq rangga bo'yaydi va $\\ce{AgNO3}$ eritmasi bilan oq cho'kma hosil qiladi. $A$ tuz konsentrlangan sulfat kislota bilan qizdirilganda gaz ajraladi, uning suvdagi eritmasi kislotadir. Shu kislota bilan $43{,}5\\text{ g}$ $\\ce{MeO2}$ (metall ekvivalenti $13{,}75\\text{ g/mol}$) reaksiyaga kirishganda necha litr (n.sh.) gaz hosil bo'ladi?",
    options: ["$89{,}6$", "$33{,}6$", "$22{,}4$", "$11{,}2$"],
    correct: 3,
    explanation:
      "$A = \\ce{NaCl}$, gaz $\\ce{HCl}$. $\\ce{MeO2}$ da metall IV valentli: $A_r(\\text{Me}) = 4\\cdot 13{,}75 = 55\\ (\\ce{Mn})$, oksid $\\ce{MnO2}$ ($87\\text{ g/mol}$). $n(\\ce{MnO2}) = 43{,}5/87 = 0{,}5\\text{ mol}$. $\\ce{MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O}$ bo'yicha $0{,}5\\text{ mol }\\ce{Cl2} = 11{,}2\\text{ litr}$.",
  },
  {
    id: "ms-2026-02-22-2-18",
    turi: "variant",
    mavzu: "Uglevodlar va eterifikatsiya",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Glukoza mo'l miqdordagi qaysi to'yingan bir asosli karbon kislota bilan ta'sirlashib, bitta molekulasida jami $49$ ta atom saqlaydigan murakkab efir hosil qiladi?",
    options: [
      "chumoli kislota",
      "sirka kislota",
      "propan kislota",
      "moy kislota",
    ],
    correct: 1,
    explanation:
      "Glukozada $5$ ta $-\\ce{OH}$ guruhi bor: $\\ce{C6H7O(OOC-C_n H_{2n+1})5}$ da $29 + 5(3n+1) = 49 \\Rightarrow 5(3n+1) = 20 \\Rightarrow 3n+1 = 4 \\Rightarrow n = 1$. Bu sirka kislota ($\\ce{CH3COOH}$).",
  },
  {
    id: "ms-2026-02-22-2-19",
    turi: "variant",
    mavzu: "Fosfor va fosfat kislota eritmalari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$12{,}4\\text{ g}$ qizil rangli $A$ kukunsimon metallmas havoda yondirilganda oq kristall $B$ modda hosil bo'ldi. $B$ modda $471{,}6\\text{ g}$ qaynoq suvda eritilganda $C$ modda hosil bo'ldi ($C$ tuzi $\\ce{AgNO3}$ bilan sariq cho'kma beradi). Oxirgi eritmaning $50\\text{ g}$ miqdori bilan necha gramm so'ndirilgan ohak reaksiyaga kirishib o'rta tuz hosil qiladi?",
    options: ["$2{,}22$", "$4{,}44$", "$6{,}66$", "$8{,}88$"],
    correct: 1,
    explanation:
      "$A = \\ce{P}$ ($12{,}4/31 = 0{,}4\\text{ mol}$), $B = \\ce{P2O5}$ ($0{,}2\\text{ mol} = 28{,}4\\text{ g}$). Eritma massasi: $28{,}4 + 471{,}6 = 500\\text{ g}$ ($0{,}4\\text{ mol }\\ce{H3PO4}$). $50\\text{ g}$ da $0{,}04\\text{ mol }\\ce{H3PO4}$ bor. $\\ce{2H3PO4 + 3Ca(OH)2 -> Ca3(PO4)2 + 6H2O}$ ga ko'ra $0{,}06\\text{ mol }\\ce{Ca(OH)2} = 4{,}44\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-20",
    turi: "variant",
    mavzu: "Organik reaksiyalarning nomlari",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Qaysi reaksiya turida uglerod zanjirining uzayishi kuzatiladi?",
    options: ["kreking", "Vyurs", "Konovalov", "Dyuma"],
    correct: 1,
    explanation:
      "Vyurs reaksiyasida ($\\ce{2R-Cl + 2Na -> R-R + 2NaCl}$) ikkita alkil radikali birikib, uglerod zanjiri uzayadi. Kreking va Dyuma reaksiyasida zanjir qisqaradi, Konovalov esa nitrolash reaksiyasidir.",
  },
  {
    id: "ms-2026-02-22-2-21",
    turi: "variant",
    mavzu: "Konyugirlangan $\\pi$-sistemalar",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Konyugirlangan $\\pi$-bog'lari $\\sigma$-bog'lar tekisligiga nisbatan perpendikulyar joylashib, uglerodlararo bog' uzunliklari tenglashgan (yoki oddiy bog'larga nisbatan qisqargan) uglevodorodlarni aniqlang:\n" +
      "$1)$ butadiyen-$1,3$;   $2)$ propadiyen;   $3)$ butadiyen-$1,2$;   $4)$ benzol.",
    options: ["$1, 2$", "$3, 4$", "$2, 3$", "$1, 4$"],
    correct: 3,
    explanation:
      "Butadiyen-$1,3$ ($\\ce{CH2=CH-CH=CH2}$) va benzol ($\\ce{C6H6}$) konyugirlangan $\\pi$-bog'li birikmalardir; propadiyen va butadiyen-$1,2$ esa kumulirlangan dienlardir.",
  },
  {
    id: "ms-2026-02-22-2-22",
    turi: "variant",
    mavzu: "Organik moddalarni sifat jihatdan aniqlash",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$4$ ta probirkada stirol, etilbenzol, etil spirti va fenol bor. $1$- va $2$-probirkadagi moddalar $\\ce{KMnO4 + H2SO4}$ bilan oksidlanganda bir xil organik modda chiqadi. $3$- va $4$-probirkadagi moddalar $\\ce{Na}$ bilan ta'sirlashganda $\\ce{H2}$ chiqadi. $1$-probirkadagi modda gidrogenlansa, $2$-probirkadagi modda hosil bo'ladi; $4$-probirkadagi modda kuchsiz kislotali muhitga ega. Moddalar ketma-ketligini toping.",
    options: [
      "etil spirti, benzol, stirol, etilbenzol",
      "etil spirti, stirol, etilbenzol, benzol",
      "etilbenzol, fenol, etil spirti, benzol",
      "stirol, etilbenzol, etil spirti, fenol",
    ],
    correct: 3,
    explanation:
      "Stirol va etilbenzol oksidlanganda benzoy kislota beradi; stirol gidrogenlanib etilbenzolga aylanadi ($1$-stirol, $2$-etilbenzol). Fenol kuchsiz kislotali ($4$-fenol), etil spirti esa $3$-probirkada.",
  },
  {
    id: "ms-2026-02-22-2-23",
    turi: "variant",
    mavzu: "Spirtlar va aldegidlarning oksidlanishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Propanol-$1$ bug'ining havo bilan aralashmasi qizdirilgan $\\ce{Cu}$ ustidan o'tkazildi. Olingan organik birikma $\\ce{Cu(OH)2}$ bilan ishlanganda $115{,}2\\text{ g}$ qizil cho'kma ($\\ce{Cu2O}$) va $0{,}4\\text{ mol}$ sariq cho'kma ($\\ce{CuOH}$) tushdi. Dastlabki reaksiyada sarflangan spirt massasini ($\\text{g}$) toping.",
    options: ["$30$", "$72$", "$60$", "$120$"],
    correct: 2,
    explanation:
      "$n(\\ce{Cu2O}) = 115{,}2/144 = 0{,}8\\text{ mol}$ ($0{,}8\\text{ mol}$ propanalga mos) va $0{,}4\\text{ mol }\\ce{CuOH}$ ($2\\ce{CuOH -> Cu2O + H2O}$ bo'yicha $0{,}2\\text{ mol}$ propanalga mos). Jami spirt: $0{,}8 + 0{,}2 = 1{,}0\\text{ mol}$; $m = 1{,}0 \\cdot 60 = 60\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-24",
    turi: "variant",
    mavzu: "Kumush ko'zgu reaksiyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Formaldegid va chumoli kislotaning $5{,}3\\text{ g}$ aralashmasi kumush oksidining ammiakdagi eritmasi bilan ishlanganda $54\\text{ g}$ cho'kma hosil bo'ldi. Dastlabki aralashmadagi chumoli kislotaning massasini ($\\text{g}$) toping.",
    options: ["$3$", "$2{,}3$", "$4{,}6$", "$1{,}5$"],
    correct: 1,
    explanation:
      "$1\\text{ mol }\\ce{HCHO}$ ($30$) dan $4\\text{ mol }\\ce{Ag}$, $1\\text{ mol }\\ce{HCOOH}$ ($46$) dan $2\\text{ mol }\\ce{Ag}$ tushadi. $30x + 46y = 5{,}3$ va $4x + 2y = 54/108 = 0{,}5 \\Rightarrow x = 0{,}1\\text{ mol}$, $y = 0{,}05\\text{ mol }\\ce{HCOOH} = 0{,}05\\cdot 46 = 2{,}3\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-25",
    turi: "variant",
    mavzu: "Yog'larning tuzilishi va xossalari",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-22-2/savol-25.png",
    question: "Umumiy formulasi rasmda berilgan yog' uchun to'g'ri ma'lumotni aniqlang.",
    options: [
      "Tarkibidagi kislota qoldiqlari to'yingan bo'ladi",
      "Qattiq yog'",
      "Suyuq yog'",
      "Gidrolizlanganda glitserin va palmitin kislota hosil bo'lishi mumkin",
    ],
    correct: 2,
    explanation:
      "Yog' tarkibidagi $-\\ce{C_n H_{2n-1}}$ radikali to'yinmagan karbon kislota (masalan, olein kislota $\\ce{C17H33COOH}$) qoldig'iga mos keladi, shuning uchun bu suyuq yog'dir.",
  },
  {
    id: "ms-2026-02-22-2-26",
    turi: "variant",
    mavzu: "Uglevodlar va organik moddalar formulasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Berilgan moddalarning nechtasi $\\ce{C_n H_{2n} O_n}$ umumiy formulaga mos keladi?\n" +
      "$1)$ chumoli kislota; $2)$ glukoza; $3)$ sirka aldegid; $4)$ saxaroza; $5)$ chumoli aldegid; $6)$ fruktoza; $7)$ sirka kislota.",
    options: ["$2$", "$3$", "$4$", "$5$"],
    correct: 2,
    explanation:
      "$\\ce{C_n H_{2n} O_n}$ formulaga moslari: $2)$ glukoza ($\\ce{C6H12O6}$), $5)$ chumoli aldegid ($\\ce{CH2O}$), $6)$ fruktoza ($\\ce{C6H12O6}$), $7)$ sirka kislota ($\\ce{C2H4O2}$) — jami $4$ ta.",
  },
  {
    id: "ms-2026-02-22-2-27",
    turi: "variant",
    mavzu: "Yuqori molekulyar birikmalar: polivinilxlorid",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-27.png",
    question:
      "Berilgan polimer uchun xos ma'lumotlarni tanlang:\n" +
      "$a)$ polimerlanish reaksiyasi natijasida hosil bo'ladi; $b)$ nomi «vinil xlorid»; $c)$ polimerning massasi $31250$ bo'lganda uning polimerlanish darajasi $500$ ga teng; $d)$ tabiiy polimer; $e)$ u qattiq polimer bo'lib, kristallana olmaydi; $f)$ monomeri etilen; $g)$ undan linoleum ishlab chiqarishda foydalaniladi; $h)$ kaliy permanganat eritmasini rangsizlantiradi.",
    options: [
      "$a, d, e, g$",
      "$a, b, c, d$",
      "$a, c, e, g$",
      "$e, f, g, h$",
    ],
    correct: 2,
    explanation:
      "Bu polimer — polivinilxlorid (PVX). Monomeri vinilxlorid ($M = 62{,}5\\text{ g/mol}$), $31250 / 62{,}5 = 500$ ($a, c$ to'g'ri); qattiq amorf polimer ($e$) va linoleum olishda ishlatiladi ($g$).",
  },
  {
    id: "ms-2026-02-22-2-28",
    turi: "variant",
    mavzu: "Kumush tuzlarining komplekslari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-28.png",
    question:
      "Quyidagi tajribada $\\ce{AgNO3}$ eritmasiga $X$ modda tomizilganda oldin cho'kma hosil bo'lib, tomizish davom ettirilganda cho'kma erib ketgan bo'lsa, $X$ modda qaysi biri bo'lishi mumkin?",
    options: [
      "$\\ce{NH4OH}$",
      "$\\ce{HCl}$",
      "$\\ce{NaOH}$",
      "$\\ce{CH3COOH}$",
    ],
    correct: 0,
    explanation:
      "$\\ce{AgNO3}$ ga $\\ce{NH4OH}$ tomizilganda dastlab $\\ce{Ag2O}$ cho'kmasi tushadi, ortiqcha $\\ce{NH4OH}$ ta'sirida esa suvda eruvchi kompleks tuz $[\\ce{Ag(NH3)2}]\\ce{OH}$ hosil bo'lib cho'kma erib ketadi.",
  },
  {
    id: "ms-2026-02-22-2-29",
    turi: "variant",
    mavzu: "Polimerlar va monomerlar jadvali",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-22-2/savol-29.png",
    question:
      "Polimerlar umumiy holatda $[-\\ce{CH2}-\\ce{CH}(Z)-]_n$ ko'rinishida ifodalanadi. Jadvaldagi $Z$ radikal va tegishli polimer mosligi to'g'ri berilgan qatorlarni tanlang.",
    options: ["$1, 4$", "$1, 2$", "$2, 3$", "$3, 4$"],
    correct: 0,
    explanation:
      "$1$-qator (propilen, $Z = -\\ce{CH3}$, polipropilen) va $4$-qator (vinilxlorid, $Z = -\\ce{Cl}$, PVX) to'g'ri; stirol va etilenda radikal hamda bo'g'in xato yozilgan.",
  },
  {
    id: "ms-2026-02-22-2-30",
    turi: "variant",
    mavzu: "Ammiakning laboratoriyada olinishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-22-2/savol-30.png",
    question:
      "Berilgan kimyoviy tajribaga oid to'g'ri fikrlarni toping:\n" +
      "$a)$ hosil bo'lgan $X$ gaz havodan $1{,}7$ marta yengil;\n" +
      "$b)$ $\\ce{Ca(OH)2}$ o'rniga konsentrlangan $\\ce{H2SO4}$ dan ham foydalanish mumkin;\n" +
      "$c)$ hosil bo'lgan $X$ gaz nitrat kislota parchalanganda ham hosil bo'ladi;\n" +
      "$d)$ $\\ce{NH4Cl}$ o'rniga $\\ce{(NH4)2SO4}$ dan ham foydalanish mumkin.",
    options: ["$c, d$", "$b, c$", "$a, c$", "$a, d$"],
    correct: 3,
    explanation:
      "$\\ce{2NH4Cl + Ca(OH)2 -> CaCl2 + 2NH3 ^ + 2H2O}$. $M(\\ce{NH3}) = 17$, $M(\\text{havo})/17 = 29/17 \\approx 1{,}7$ ($a$ to'g'ri). Ammoniy xlorid o'rniga $\\ce{(NH4)2SO4}$ ishlatish mumkin ($d$ to'g'ri).",
  },
  {
    id: "ms-2026-02-22-2-31",
    turi: "variant",
    mavzu: "Eritmalar elektrolizi va cho'kma reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$300\\text{ g}$ $X\\%$ li $\\ce{CuSO4}$ eritmasiga $300\\text{ g}$ $21\\%$ li $\\ce{NaF}$ eritmasi qo'shildi. Hosil bo'lgan tizim mis ionlari to'liq tugaguncha elektroliz qilindi (bunda $\\ce{CuF2}$ kam eruvchan cho'kma sifatida ajralishi hisobga olinsin). Agar elektrolizda anodda $2{,}4\\text{ g}$ kislorod ajralgan bo'lsa, $X$ ni toping.",
    options: ["$24$", "$36$", "$48$", "$72$"],
    correct: 2,
    explanation:
      "$n(\\ce{NaF}) = (300\\cdot 0{,}21)/42 = 1{,}5\\text{ mol}$ ($0{,}75\\text{ mol }\\ce{CuSO4}$ ni $\\ce{CuF2}$ cho'kmasiga bog'laydi). Anodda $2{,}4/32 = 0{,}075\\text{ mol }\\ce{O2}$ ajralishi uchun $0{,}15\\text{ mol }\\ce{CuSO4}$ elektrolizlanadi. Jami $n(\\ce{CuSO4}) = 0{,}75 + 0{,}15 = 0{,}90\\text{ mol} = 144\\text{ g}$, $X = 144/300 \\cdot 100\\% = 48\\%$.",
  },
  {
    id: "ms-2026-02-22-2-32",
    turi: "variant",
    mavzu: "Aminlar va aralashmalar stexiometriyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Metilamin va ammiak aralashmasi to'liq reaksiyaga kirishishi uchun $0{,}4\\text{ mol}$ $\\ce{HCl}$ tutgan xlorid kislota eritmasi sarflandi. Dastlabki aralashma yondirilganda ajralgan gazlar so'ndirilgan ohak eritmasiga yuttirilganda $30\\text{ g}$ cho'kma tushdi. Dastlabki aralashmadagi aminning mol ulushini toping.",
    options: ["$0{,}25$", "$0{,}75$", "$0{,}4$", "$0{,}6$"],
    correct: 1,
    explanation:
      "Jami asoslar: $n(\\ce{CH3NH2}) + n(\\ce{NH3}) = 0{,}4\\text{ mol}$. Cho'kma $n(\\ce{CaCO3}) = 30/100 = 0{,}3\\text{ mol} \\Rightarrow n(\\ce{CH3NH2}) = 0{,}3\\text{ mol}$. Aminning mol ulushi: $0{,}3 / 0{,}4 = 0{,}75$.",
  },
  {
    id: "ms-2026-02-22-2-33",
    turi: "moslashtirish",
    mavzu: "Murakkab efirlarning gidrolizi va tuzlar pirolizi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "33. Olingan tuz $0{,}6\\text{ g}$ $\\ce{NaOH}$ bilan qizdirilganda necha gramm qattiq qoldiq qoladi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "B",
    explanation:
      "$0{,}224\\text{ l}$ $\\ce{H2}$ ($0{,}01\\text{ mol}$) dan spirt $0{,}02\\text{ mol}$: $M = 0{,}64/0{,}02 = 32\\ (\\ce{CH3OH})$. Tuz ($0{,}02\\text{ mol}$): $M = 2{,}2/0{,}02 = 110\\ (\\ce{C3H7COONa})$. $0{,}6\\text{ g}$ $\\ce{NaOH}$ ($0{,}015\\text{ mol}$) bilan $0{,}015\\text{ mol}$ $\\ce{Na2CO3}$ ($1{,}59\\text{ g}$) hosil bo'ladi va $0{,}005\\text{ mol}$ tuz ($0{,}55\\text{ g}$) ortib qoladi: jami $2{,}14\\text{ g}$ (B).",
  },
  {
    id: "ms-2026-02-22-2-34",
    turi: "moslashtirish",
    mavzu: "Murakkab efirlarning gidrolizi",
    soha: "Organik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Dastlabki murakkab efirning massasini ($\\text{g}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "Efir — metil butirat ($\\ce{C3H7COOCH3}$, $M = 102\\text{ g/mol}$). Miqdori $0{,}02\\text{ mol}$ bo'lgani uchun $m(\\text{efir}) = 0{,}02 \\cdot 102 = 2{,}04\\text{ g}$ (D).",
  },
  {
    id: "ms-2026-02-22-2-35",
    turi: "moslashtirish",
    mavzu: "Karbon kislota tuzlaridan kislota olish",
    soha: "Organik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "35. Olingan $2{,}2\\text{ g}$ natriyli tuz sulfat kislota bilan qizdirilganda olinadigan karbon kislota massasini ($\\text{g}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "F",
    explanation:
      "$0{,}02\\text{ mol}$ $\\ce{C3H7COONa}$ dan $0{,}02\\text{ mol}$ moy kislota ($\\ce{C3H7COOH}$, $M = 88\\text{ g/mol}$) olinadi: $m = 0{,}02 \\cdot 88 = 1{,}76\\text{ g}$ (F).",
  },
  {
    id: "ms-2026-02-22-2-36",
    turi: "ochiq",
    mavzu: "Gazlar aralashmasining yonishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$\\ce{H2}$, $\\ce{N2}$ va $\\ce{O2}$ dan iborat $15\\text{ ml}$ aralashma (tarkibidagi kislorod yordamida) yondirildi va dastlabki sharoitga keltirilganda hajmi $6\\text{ ml}$ ni tashkil qildi. Ushbu aralashmaga yana $10\\text{ ml}$ havo ($80\\%$ $\\ce{N2}$, $20\\%$ $\\ce{O2}$) qo'shib yondirilganda hajm $13\\text{ ml}$ bo'lib qoldi. Dastlabki aralashmadagi vodorod hajmini ($\\text{ml}$) toping.",
    correct: "8",
    tolerance: 0.05,
    birlik: "ml",
    explanation:
      "$2$-bosqichda $6 + 10 = 16\\text{ ml}$ dan $13\\text{ ml}$ gacha ($\\Delta V = 3\\text{ ml}$) kamaygan, bu $2\\text{ ml}$ ortgan $\\ce{H2}$ bilan $1\\text{ ml }\\ce{O2}$ reaksiyasiga mos. $1$-bosqichda $15 - 6 = 9\\text{ ml}$ kamayish $6\\text{ ml }\\ce{H2}$ va $3\\text{ ml }\\ce{O2}$ yonishidan kelib chiqadi. Jami $V(\\ce{H2}) = 6 + 2 = 8\\text{ ml}$.",
  },
  {
    id: "ms-2026-02-22-2-37",
    turi: "ochiq",
    mavzu: "Tuzlar aralashmasi elektrolizi va Faradey qonuni",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Tarkibidagi umumiy elektronlar soni teng bo'lgan mis(II) sulfat va natriy xlorid tuzlari aralashmasi $1\\text{ litr}$ suvda eritilib, katodda metall ajralishi tugaguncha $5{,}36\\text{ A}$ tok bilan $4\\text{ soat}$ davomida elektroliz qilindi ($F = 96500\\text{ Kl/mol}$). Elektrolizdan keyingi eritma to'liq bug'latilganda qolgan qattiq qoldiq massasini ($\\text{g}$) toping.",
    correct: "74.35",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "$Q = 5{,}36 \\cdot 14400 = 77184\\text{ Kl} \\Rightarrow n(e^-) \\approx 0{,}8\\text{ mol}$. Katodda $\\ce{Cu^{2+}}$ tugagani uchun $n(\\ce{CuSO4}) = 0{,}4\\text{ mol}$. $1\\text{ mol }\\ce{CuSO4}$ da $77$, $\\ce{NaCl}$ da $28$ ta elektron bor: $0{,}4\\cdot 77 / 28 = 1{,}1\\text{ mol }\\ce{NaCl}$. Anodda $0{,}8\\text{ mol }\\ce{Cl-}$ oksidlanib, eritmada $0{,}4\\text{ mol }\\ce{Na2SO4}$ ($56{,}8\\text{ g}$) va $0{,}3\\text{ mol }\\ce{NaCl}$ ($17{,}55\\text{ g}$) qoladi: jami $74{,}35\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-38",
    turi: "ochiq",
    mavzu: "Alyumotermiya va qoldiq tahlili",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$x\\text{ g}$ $\\ce{ZnO}$ va $\\ce{Fe2O3}$ oksidlar aralashmasi $\\ce{Al}$ bilan to'liq qaytarildi. Reaksiyadan keyin $94\\text{ g}$ qattiq qoldiq hosil bo'ldi (unda $0{,}4\\text{ mol }\\ce{Al}$ ortib qolgan). Qoldiq teng ikki qismga bo'lindi: birinchi qismga mo'l $\\ce{NaOH}$ eritmasi ta'sir ettirilganda $0{,}45\\text{ mol}$, ikkinchi qismga mo'l $\\ce{HCl}$ ta'sir ettirilganda $0{,}7\\text{ mol}$ gaz ajraldi. $x$ qiymatini ($\\text{g}$) aniqlang.",
    correct: "64.3",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "Har bir qismda $0{,}2\\text{ mol }\\ce{Al}$ ($0{,}3\\text{ mol }\\ce{H2}$ beradi). Ishqorda $\\ce{Al + Zn}$ gaz beradi: $n(\\ce{Zn})/2 = 0{,}45 - 0{,}3 = 0{,}15 \\Rightarrow n(\\ce{Zn}) = 0{,}3\\text{ mol}$. Kislotada $\\ce{Fe}$ ham qo'shiladi: $n(\\ce{Fe})/2 = 0{,}7 - 0{,}45 = 0{,}25 \\Rightarrow n(\\ce{Fe}) = 0{,}5\\text{ mol}$. Tekshirish: $94\\text{ g} = 10{,}8 + 0{,}3\\cdot 65 + 0{,}5\\cdot 56 + (0{,}1+0{,}25)\\cdot 102$. Dastlabki aralashma: $x = 0{,}3\\cdot 81 + 0{,}25\\cdot 160 = 24{,}3 + 40 = 64{,}3\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-39",
    turi: "ochiq",
    mavzu: "Kolbe elektroliz reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$200\\text{ g}$ $11{,}2\\%$ li to'yingan bir asosli karbon kislotaning kaliyli tuzi eritmasi tuz tugaguncha elektroliz qilindi. Hosil bo'lgan gazlar aralashmasi $\\ce{Ba(OH)2}$ eritmasi orqali o'tkazilganda $39{,}4\\text{ g}$ cho'kma ajraldi. Elektrolizdan hosil bo'lgan organik modda massasini ($\\text{g}$) toping.",
    correct: "5.8",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$n(\\ce{CO2}) = n(\\ce{BaCO3}) = 39{,}4/197 = 0{,}2\\text{ mol} \\Rightarrow n(\\text{tuz}) = 0{,}2\\text{ mol}$. $m(\\text{tuz}) = 200\\cdot 0{,}112 = 22{,}4\\text{ g}$, $M(\\ce{RCOOK}) = 22{,}4/0{,}2 = 112\\text{ g/mol} \\Rightarrow \\ce{R} = \\ce{C2H5}$. Anodda $0{,}1\\text{ mol}$ butan ($\\ce{C4H10}$, $M=58$) hosil bo'ladi: $0{,}1\\cdot 58 = 5{,}8\\text{ g}$.",
  },
  {
    id: "ms-2026-02-22-2-40",
    turi: "ochiq",
    mavzu: "Spirtlarning degidratatsiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$30\\text{ g}$ to'yingan bir atomli spirt $\\ce{H2SO4}$ ishtirokida asta-sekin qizdirib borildi. Reaksiyadan ma'lum miqdorda alken, $0{,}1\\text{ mol}$ oddiy efir va $7{,}2\\text{ g}$ suv hosil bo'ldi. Olingan alken massasini ($\\text{g}$) toping.",
    correct: "12.6",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$n(\\ce{H2O}) = 7{,}2/18 = 0{,}4\\text{ mol}$. Efirga $0{,}1\\text{ mol }\\ce{H2O}$ va $0{,}2\\text{ mol}$ spirt, alkenga esa $0{,}3\\text{ mol }\\ce{H2O}$ va $0{,}3\\text{ mol}$ spirt sarflangan. Jami $n(\\text{spirt}) = 0{,}5\\text{ mol}$, $M = 30/0{,}5 = 60\\ (\\ce{C3H7OH})$. Alken — propen ($\\ce{C3H6}$, $M=42$): $m = 0{,}3 \\cdot 42 = 12{,}6\\text{ g}$.",
  },
]

export default savollar
