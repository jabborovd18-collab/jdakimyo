// 2025-yil 3-may, I smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "$0{,}8\\text{ mol}$ natriy, kaliy va kalsiydan iborat aralashma suv bilan to'liq reaksiyaga kirishganda " +
  "$11{,}2\\text{ litr}$ (n.sh.) vodorod gazi ajraldi. Boshlang'ich aralashmadagi kaliy va natriy " +
  "massalarining yig'indisi $17\\text{ g}$ ga teng."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$32$",
  B: "$20$",
  C: "$16$",
  D: "$11{,}6$",
  E: "$5{,}8$",
  F: "$24$",
}

const savollar = [
  {
    id: "ms-2025-05-03-1-1",
    turi: "variant",
    mavzu: "Moddalar xossalari va asosiy kimyoviy tushunchalar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "To'g'ri javobni aniqlang.",
    options: [
      "$1$ moldan olingan silan va metanning massalari teng.",
      "Fosforning allotropik shakl o'zgarishi mavjud emas.",
      "$2\\text{ kg}$ simobning hajmi $2\\text{ kg}$ etanolning hajmidan kam.",
      "Suvning $22{,}4\\text{ litri}$ n.sh. da $18\\text{ g}$ keladi.",
    ],
    correct: 2,
    explanation:
      "Simobning zichligi ($13{,}6\\text{ g/ml}$) etanolnikidan ($0{,}79\\text{ g/ml}$) ancha katta bo'lgani uchun teng massali ($2\\text{ kg}$) simobning hajmi etanol hajmidan kichik bo'ladi.",
  },
  {
    id: "ms-2025-05-03-1-2",
    turi: "variant",
    mavzu: "Atom tarkibi va izotoplar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Temir ($\\ce{_{26}Fe}$) ning ma'lum izotopida neytronlar soni barcha nuklon va elektronlar yig'indisining $8/21$ qismini tashkil etadi. Xuddi shunday neytronlar soniga ega nikel ($\\ce{_{28}Ni}$) izotopining molyar massasini ($\\text{g/mol}$) aniqlang.",
    options: ["$60$", "$57$", "$58$", "$59$"],
    correct: 0,
    explanation:
      "Neytral temir atomida $26$ proton va $26$ elektron (jami $52$ ta) bor. $n / (52 + n) = 8/21 \\Rightarrow 21n = 416 + 8n \\Rightarrow n = 32$. $32$ ta neytronga ega nikel izotopi massasi: $A = 28 + 32 = 60\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-03-1-3",
    turi: "variant",
    mavzu: "Atom elektron qobig'i va Hund qoidasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Hund qoidasi keltirilgan qatorni aniqlang.",
    options: [
      "Energiyalari teng orbitallarda elektronlar spinlar yig'indisi maksimallikka intiladi.",
      "Atomda elektronlarning spinlar yig'indisi minimallikka intiladi.",
      "Energetik pog'onachalarning elektronlar bilan to'lib borish tartibi $n + l$ ga bog'liq.",
      "To'rttala kvant soni bir xil bo'lgan ikkita elektron bo'lishi mumkin emas.",
    ],
    correct: 0,
    explanation:
      "Hund qoidasiga ko'ra bir xil energiyali orbitallar (yacheykalar) elektronlar bilan to'lishida spinlar yig'indisi maksimal qiymatga intiladi.",
  },
  {
    id: "ms-2025-05-03-1-4",
    turi: "variant",
    mavzu: "Yadro reaksiyalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\ce{^x_{92}U + ^{14}_7N -> y ^1_0n + ^{246}_{99}Es}$ yadro reaksiyasida $\\frac{x + 14}{y} = 42$ bo'lsa, $x$ ni toping.",
    options: ["$238$", "$240$", "$236$", "$242$"],
    correct: 0,
    explanation:
      "Massa balansi: $x + 14 = y + 246$. Shartga ko'ra $x + 14 = 42y$. Tenglashtirilsa: $42y = y + 246 \\Rightarrow 41y = 246 \\Rightarrow y = 6$. Demak, $x = 42 \\cdot 6 - 14 = 252 - 14 = 238$ ($\\ce{^{238}_{92}U}$).",
  },
  {
    id: "ms-2025-05-03-1-5",
    turi: "variant",
    mavzu: "Elektrolitik dissotsilanish",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Suvli eritmada dissotsilanganda $2$ xil anion hosil qiladigan moddani aniqlang.",
    options: [
      "$\\ce{H2SO4}$",
      "$\\ce{NaKSO4}$",
      "$\\ce{Ba(OH)2}$",
      "$\\ce{LiOH}$",
    ],
    correct: 0,
    explanation:
      "Sulfat kislota $\\ce{H2SO4}$ ikki bosqichda dissotsilanib, $\\ce{HSO4-}$ va $\\ce{SO4^{2-}}$ kabi ikki xil anion hosil qiladi. $\\ce{NaKSO4}$ da faqat bitta anion ($\\ce{SO4^{2-}}$), ishqorlarda esa faqat $\\ce{OH-}$ anioni bor.",
  },
  {
    id: "ms-2025-05-03-1-6",
    turi: "variant",
    mavzu: "Kovalent bog'lar ($\\sigma$ va $\\pi$)",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{HCN ->[1] SiH4 ->[2] C2H2 ->[3] H2S}$ qatorida $\\sigma$- va $\\pi$-bog'lar soni yig'indisi qanday o'zgaradi?",
    options: [
      "$1$-ortadi; $2$-kamayadi; $3$-kamayadi",
      "$1$-o'zgarmaydi; $2$-kamayadi; $3$-kamayadi",
      "$1$-o'zgarmaydi; $2$-ortadi; $3$-kamayadi",
      "$1$-ortadi; $2$-o'zgarmaydi; $3$-kamayadi",
    ],
    correct: 2,
    explanation:
      "Jami bog'lar ($\\sigma + \\pi$): $\\ce{H-C#N}$ ($2\\sigma + 2\\pi = 4$), $\\ce{SiH4}$ ($4\\sigma = 4$), $\\ce{H-C#C-H}$ ($3\\sigma + 2\\pi = 5$), $\\ce{H2S}$ ($2\\sigma = 2$). O'tishlar: $4 \\rightarrow 4$ (o'zgarmaydi) $\\rightarrow 5$ (ortadi) $\\rightarrow 2$ (kamayadi).",
  },
  {
    id: "ms-2025-05-03-1-7",
    turi: "variant",
    mavzu: "Oksidlar olinishi va tasnifi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Asosli oksid hosil qiladigan reaksiyani aniqlang.",
    options: [
      "$\\ce{ZnO + C ->}$",
      "$\\ce{C + O2 ->}$",
      "$\\ce{Li + O2 ->}$",
      "$\\ce{Al + O2 ->}$",
    ],
    correct: 2,
    explanation:
      "Litiy kislorodda yonganda asosli oksid $\\ce{Li2O}$ hosil qiladi. Uglerod kislotali yoki befarq oksid, alyuminiy esa amfoter oksid ($\\ce{Al2O3}$) beradi.",
  },
  {
    id: "ms-2025-05-03-1-8",
    turi: "variant",
    mavzu: "Bosim va haroratning reaksiya tezligiga ta'siri",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\ce{2NO + O2 <-> 2NO2}$ reaksiyada bosim $8$ marta ortib, harorat $60^\\circ\\text{C}$ ga kamaysa ($\\gamma = 2$), to'g'ri reaksiya tezligi qanday o'zgaradi?",
    options: [
      "$64$ marta ortadi",
      "$8$ marta ortadi",
      "$8$ marta kamayadi",
      "$64$ marta kamayadi",
    ],
    correct: 1,
    explanation:
      "$v = k[\\ce{NO}]^2[\\ce{O2}]$. Bosim $8$ marta ortganda tezlik $8^3 = 512$ marta ortadi; harorat $60^\\circ\\text{C}$ pasayganda esa $2^6 = 64$ marta kamayadi. Natijaviy o'zgarish: $512 / 64 = 8$ marta ortadi.",
  },
  {
    id: "ms-2025-05-03-1-9",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat doimiysi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\ce{A + 3B <=> 2C}$ reaksiyada muvozanat holatida ($V = 1\\text{ litr}$) $\\ce{A}$ modda $4\\text{ mol}$, $\\ce{B}$ modda $1\\text{ mol}$ va $\\ce{C}$ modda $2\\text{ mol}$ bo'lsa, qaysi fikrlar to'g'ri?\n" +
      "$1)$ Dastlab $\\ce{A}$ modda $4\\text{ mol}$, $\\ce{B}$ modda esa $5\\text{ mol}$ bo'lgan;\n" +
      "$2)$ $K_m = 1$;\n" +
      "$3)$ $\\ce{A}$ ning $1/5$ qismi sarflanganda muvozanat qaror topgan.",
    options: ["$2, 3$", "$1, 2, 3$", "$1, 3$", "$1, 2$"],
    correct: 0,
    explanation:
      "$2\\text{ mol}$ $\\ce{C}$ hosil bo'lishi uchun $1\\text{ mol}$ $\\ce{A}$ va $3\\text{ mol}$ $\\ce{B}$ sarflangan, demak dastlab $[\\ce{A}]_0 = 5\\text{ mol}$, $[\\ce{B}]_0 = 4\\text{ mol}$ bo'lgan ($1$ noto'g'ri). $K_m = 2^2 / (4 \\cdot 1^3) = 1$ ($2$ to'g'ri). $\\ce{A}$ dan $1/5$ qismi sarflangan ($3$ to'g'ri).",
  },
  {
    id: "ms-2025-05-03-1-10",
    turi: "variant",
    mavzu: "Yog'lar va oliy karbon kislotalar",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Suyuq yog'lar hosil qilishda asosan ishtirok etadigan kislotalarni belgilang.",
    options: [
      "palmitin, linol, linolen",
      "olein, linol, linolen",
      "palmitin, linolen, olein",
      "palmitin, linolen, stearin",
    ],
    correct: 1,
    explanation:
      "Suyuq yog'lar (moylar) tarkibida asosan to'yinmagan oliy karbon kislotalar — olein ($\\ce{C17H33COOH}$), linol ($\\ce{C17H31COOH}$) va linolen ($\\ce{C17H29COOH}$) kislotalarning glitseridlari bo'ladi.",
  },
  {
    id: "ms-2025-05-03-1-11",
    turi: "variant",
    mavzu: "Gidridlarning gidrolizi va foiz konsentratsiya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$0{,}5\\text{ mol}$ ishqoriy metall gidridi $47\\text{ g}$ suvda eritilganda $24\\%$ li eritma hosil bo'ldi. $8\\text{ g}$ xuddi shu metall gidridi $54\\text{ g}$ suvda eritilganda necha foizli eritma hosil bo'ladi?",
    options: ["$30\\%$", "$40\\%$", "$50\\%$", "$60\\%$"],
    correct: 1,
    explanation:
      "$0{,}5\\text{ mol}$ $\\ce{MH}$ dan $0{,}5\\text{ mol}$ $\\ce{MOH}$ va $0{,}5\\text{ mol}$ $\\ce{H2}$ ($1\\text{ g}$) chiqadi. $\\frac{0{,}5(M+17)}{47 + 0{,}5(M+1) - 1} = 0{,}24 \\Rightarrow M = 7$ ($\\ce{Li}$, gidrid $\\ce{LiH} = 8\\text{ g/mol}$). $8\\text{ g}$ ($1\\text{ mol}$) $\\ce{LiH} + 54\\text{ g } \\ce{H2O}$ dan $24\\text{ g}$ $\\ce{LiOH}$ $60\\text{ g}$ eritmada: $24/60 = 40\\%$.",
  },
  {
    id: "ms-2025-05-03-1-12",
    turi: "variant",
    mavzu: "Uglevodlar texnologiyasi va unum",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Shakarqamish tarkibida $22\\%$ saxaroza bor. $1\\text{ tonna}$ shakarqamishdan $187\\text{ kg}$ saxaroza olindi. Jarayon unumini (ulushda) toping.",
    options: ["$0{,}65$", "$0{,}75$", "$0{,}8$", "$0{,}85$"],
    correct: 3,
    explanation:
      "$1000\\text{ kg}$ shakarqamishda nazariy $1000 \\cdot 0{,}22 = 220\\text{ kg}$ saxaroza mavjud. Amaliy unum: $\\eta = 187 / 220 = 0{,}85$ ($85\\%$).",
  },
  {
    id: "ms-2025-05-03-1-13",
    turi: "variant",
    mavzu: "Eritmalarda ionlar almashinuvi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$0{,}1\\text{ mol}$ $\\ce{Fe(NO3)3}$ va $200\\text{ ml}$ $2\\text{ M}$ $\\ce{NaOH}$ reaksiyasi natijasida hosil bo'lgan eritmada jami necha mol ion bo'ladi?",
    options: ["$0{,}6$", "$0{,}7$", "$0{,}8$", "$1$"],
    correct: 2,
    explanation:
      "$n(\\ce{NaOH}) = 0{,}2 \\cdot 2 = 0{,}4\\text{ mol}$. $\\ce{Fe(NO3)3 + 3NaOH -> Fe(OH)3 v + 3NaNO3}$ reaksiyasi uchun $0{,}3\\text{ mol}$ $\\ce{NaOH}$ sarflanib, $0{,}1\\text{ mol}$ ortadi. Eritmada $0{,}4\\text{ mol}$ $\\ce{Na+}$, $0{,}3\\text{ mol}$ $\\ce{NO3-}$ va $0{,}1\\text{ mol}$ $\\ce{OH-}$ ionlari qoladi: jami $0{,}8\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-1-14",
    turi: "variant",
    mavzu: "Gazlar aralashmasining yonishi va yutilishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$10\\text{ litr}$ (n.sh.) $1:4$ hajmiy nisbatda $\\ce{O2}$ va $\\ce{N2}$ bo'lgan aralashmaga $4\\text{ litr}$ (n.sh.) $\\ce{CO}$ qo'shildi va portlatildi. Hosil bo'lgan aralashma $\\ce{NaOH}$ eritmasiga yuttirilganda gaz hajmi ishqorga yuttirilishdan oldingi hajmiga nisbatan necha foizga kamayadi?",
    options: ["$100/2$", "$100/3$", "$200/3$", "$200/7$"],
    correct: 1,
    explanation:
      "Havoda $2\\text{ l}$ $\\ce{O2}$ va $8\\text{ l}$ $\\ce{N2}$ bor. $\\ce{2CO + O2 -> 2CO2}$ reaksiyasidan keyin $4\\text{ l}$ $\\ce{CO2}$ va $8\\text{ l}$ $\\ce{N2}$ (jami $12\\text{ l}$) hosil bo'ladi. $\\ce{NaOH}$ eritmasi $4\\text{ l}$ $\\ce{CO2}$ ni yutgani uchun hajm $4/12 \\cdot 100\\% = 100/3\\%$ ga kamayadi.",
  },
  {
    id: "ms-2025-05-03-1-15",
    turi: "variant",
    mavzu: "Alkanlarning yonish stexiometriyasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Noma'lum alkanning to'liq yonishidan hosil bo'lgan suvning massasi alkanning massasidan $1{,}5$ marta ko'p bo'lsa, alkanni aniqlang.",
    options: [
      "$\\ce{C2H6}$",
      "$\\ce{C3H8}$",
      "$\\ce{C4H10}$",
      "$\\ce{C5H12}$",
    ],
    correct: 3,
    explanation:
      "$1\\text{ mol}$ $\\ce{C_n H_{2n+2}}$ yonganda $(n+1)\\text{ mol}$ $\\ce{H2O}$ beradi: $18(n+1) = 1{,}5(14n + 2) \\Rightarrow 18n + 18 = 21n + 3 \\Rightarrow 3n = 15 \\Rightarrow n = 5$ (pentan, $\\ce{C5H12}$).",
  },
  {
    id: "ms-2025-05-03-1-16",
    turi: "variant",
    mavzu: "Asosli tuzlar hosil bo'lishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$24{,}5\\text{ g}$ ortofosfat kislota bilan $55{,}5\\text{ g}$ metall gidroksidi reaksiyaga kirishib, $\\ce{(MeOH)3PO4}$ tarkibli asosli tuz va $x\\text{ g}$ suv hosil qildi. $x$ ni aniqlang.",
    options: ["$13{,}5$", "$18$", "$27$", "$36$"],
    correct: 0,
    explanation:
      "$n(\\ce{H3PO4}) = 24{,}5/98 = 0{,}25\\text{ mol}$. $\\ce{3Me(OH)2 + H3PO4 -> (MeOH)3PO4 + 3H2O}$ da $n(\\ce{Me(OH)2}) = 0{,}75\\text{ mol} \\Rightarrow M = 55{,}5/0{,}75 = 74\\text{ g/mol}$ ($\\ce{Ca(OH)2}$). Suv miqdori $0{,}75\\text{ mol} = 0{,}75 \\cdot 18 = 13{,}5\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-1-17",
    turi: "variant",
    mavzu: "Neftni qayta ishlash va oktan soni",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Neftdan $20\\%$ unum bilan benzin hamda $55\\%$ unum bilan mazut olinadi. Mazutdan $60\\%$ unum bilan kreking benzin olinsa, $200\\text{ kg}$ neftdan olingan $\\text{A-}80$ markali benzindagi izooktan ekvivalent massasini ($\\text{kg}$) aniqlang.",
    options: ["$110$", "$120$", "$84{,}8$", "$150$"],
    correct: 2,
    explanation:
      "To'g'ridan-to'g'ri benzin: $200 \\cdot 0{,}2 = 40\\text{ kg}$. Mazutdan benzin: $200 \\cdot 0{,}55 \\cdot 0{,}6 = 66\\text{ kg}$. Jami benzin $106\\text{ kg}$. $\\text{A-}80$ benzinda $80\\%$ izooktan ulushi: $106 \\cdot 0{,}8 = 84{,}8\\text{ kg}$.",
  },
  {
    id: "ms-2025-05-03-1-18",
    turi: "variant",
    mavzu: "Gibridlanish va organik izomeriya",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Xrom(III)-gidroksid molyar massasiga teng molyar massali to'yingan nitrobirikma namunasida $0{,}8\\text{ mol}$ $sp^3$ gibridlangan atom bor. Xuddi shu miqdordagi nitrobirikmaga izomer bo'lgan aminokislotada nechta $sp^3$ gibrid orbital bor?",
    options: [
      "$3{,}2 \\cdot N_A$",
      "$0{,}8 \\cdot N_A$",
      "$4 \\cdot N_A$",
      "$2 \\cdot N_A$",
    ],
    correct: 2,
    explanation:
      "$M(\\ce{Cr(OH)3}) = 103\\text{ g/mol}$, demak nitrobirikma $\\ce{C4H9NO2}$. Unda $4$ ta $sp^3$ uglerod bo'lgani uchun namunada $0{,}8 / 4 = 0{,}2\\text{ mol}$ modda bor. Izomer aminomoy kislotada $3\\text{ C} + 1\\text{ N} + 1\\text{ O}(-\\ce{OH}) = 5$ ta $sp^3$ atom bor: $0{,}2 \\cdot 5 \\cdot 4 \\cdot N_A = 4 \\cdot N_A$.",
  },
  {
    id: "ms-2025-05-03-1-19",
    turi: "variant",
    mavzu: "Ko'p atomli spirtlar va oddiy efirlar",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Umumiy formulasi $\\ce{C_n H_{2n+2} O_2}$ bo'lgan $A$, $B$, $C$ moddalar mavjud. $A$ va $B$ moddalar $\\ce{Na}$ bilan ta'sirlashadi va $\\ce{Cu(OH)2}$ bilan ko'k rangli eritma hosil qiladi. $C$ modda esa na $\\ce{Na}$ bilan, na $\\ce{Cu(OH)2}$ bilan reaksiyaga kirishadi. $C$ moddani aniqlang.",
    options: [
      "$\\ce{CH2(OCH3)-CH2(OCH3)}$",
      "$\\ce{CH2(OH)-CH2(OH)}$",
      "$\\ce{CH3-CH(OCH2CH3)-COOCH3}$",
      "$\\ce{CH3-O-CH2-OH}$",
    ],
    correct: 0,
    explanation:
      "$\\ce{C_n H_{2n+2} O_2}$ formulaga mos kelishi va natriy bilan ta'sirlashmasligi uchun moddada $-\\ce{OH}$ guruhi bo'lmasligi, ya'ni qo'sh efir bo'lishi lozim: $\\ce{CH2(OCH3)-CH2(OCH3)}$ ($\\ce{C4H10O2}$).",
  },
  {
    id: "ms-2025-05-03-1-20",
    turi: "variant",
    mavzu: "Eritmada massa ulushi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "Bodringni tuzlash uchun $1\\text{ litr}$ suvga $40\\text{ g}$ osh tuzi va $20\\text{ g}$ shakar solinadi. Shu nisbatda $5\\text{ litr}$ suvda tayyorlangan eritmada tuzning massa ulushini ($\\%$) toping.",
    options: ["$20/53$", "$200/53$", "$10/52$", "$100/52$"],
    correct: 1,
    explanation:
      "$1\\text{ litr}$ ($1000\\text{ g}$) suvda tayyorlangan eritma massasi $1000 + 40 + 20 = 1060\\text{ g}$. Tuzning massa ulushi: $\\omega = \\frac{40}{1060} \\cdot 100\\% = \\frac{200}{53}\\%$. $5\\text{ litr}$ suvda ham konsentratsiya o'zgarmaydi.",
  },
  {
    id: "ms-2025-05-03-1-21",
    turi: "variant",
    mavzu: "Polimerlar molekulyar massasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Polietilen molekulasining zanjir uzunligi $616\\text{ nm}$, bitta $l(\\ce{C-C}) = 0{,}154\\text{ nm}$ bo'lsa, polietilen molekulyar massasini toping.",
    options: ["$56000$", "$28000$", "$5600$", "$2800$"],
    correct: 0,
    explanation:
      "Zanjirdagi $\\ce{C-C}$ bog'lar (uglerod atomlari) soni: $616 / 0{,}154 = 4000$. Polietilen monomerida ($\\ce{-CH2-CH2-}$) $2$ ta uglerod bo'lgani uchun $n = 4000 / 2 = 2000$. $M = 2000 \\cdot 28 = 56000\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-03-1-22",
    turi: "variant",
    mavzu: "Ishqorlar va asoslarning eruvchanligi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Quyidagi elementlardan nechtasi suvda eriydigan asos (ishqor) hosil qiladi?\n" +
      "$\\ce{K,\\ Fe,\\ Cs,\\ Cr,\\ Mg,\\ Na,\\ Li,\\ Cu,\\ Zn,\\ Ba,\\ Al}$",
    options: ["$3$", "$4$", "$5$", "$6$"],
    correct: 2,
    explanation:
      "Ishqor hosil qiluvchi metallar — barcha ishqoriy metallar ($\\ce{K, Cs, Na, Li}$) hamda og'ir ishqoriy-yer metallari ($\\ce{Ba}$): jami $5$ ta element. $\\ce{Mg(OH)2}$ va qolganlari suvda erimaydi.",
  },
  {
    id: "ms-2025-05-03-1-23",
    turi: "variant",
    mavzu: "Fenolning kimyoviy xossalari va sifat reaksiyalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Fenol ($\\ce{C6H5OH}$) qaysi moddalar bilan ta'sirlashganda quyidagi belgilar ketma-ket kuzatiladi?\n" +
      "$1)$ vodorod gazi ajraladi; $2)$ oq cho'kma hosil bo'ladi; $3)$ sariq cho'kma (pikrin kislota) hosil bo'ladi; $4)$ binafsha rangli kompleks hosil bo'ladi.",
    options: [
      "$\\ce{Na,\\ Br2,\\ HNO3,\\ FeCl3}$",
      "$\\ce{NaOH,\\ Br2,\\ HNO3,\\ FeCl3}$",
      "$\\ce{Na,\\ HNO3,\\ Br2,\\ FeCl3}$",
      "$\\ce{NaOH,\\ HNO3,\\ Br2,\\ FeCl3}$",
    ],
    correct: 0,
    explanation:
      "Fenol $\\ce{Na}$ bilan $\\ce{H2}$ chiqaradi, bromli suv bilan $2,4,6$-tribromfenol (oq cho'kma), konsentrlangan $\\ce{HNO3}$ bilan pikrin kislota (sariq cho'kma) va $\\ce{FeCl3}$ bilan binafsha kompleks hosil qiladi.",
  },
  {
    id: "ms-2025-05-03-1-24",
    turi: "variant",
    mavzu: "Alkinlarning kimyoviy o'zgarishlar zanjiri",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$\\ce{C3H4 -> C3H6O -> C3H7OH -> CH3COOC3H7}$ jarayonida boshlang'ich va oxirgi moddalar massasi farqi $7{,}52\\text{ g}$ ga teng. Umumiy reaksiya unumi $30\\%$ bo'lsa, olingan propinning dastlabki miqdorini ($\\text{mol}$) toping.",
    options: ["$0{,}8$", "$1$", "$0{,}4$", "$0{,}6$"],
    correct: 0,
    explanation:
      "$1\\text{ mol}$ propin ($40\\text{ g}$) dan $30\\%$ unum bilan $0{,}3\\text{ mol}$ propilatsetat ($0{,}3 \\cdot 102 = 30{,}6\\text{ g}$) hosil bo'ladi. $1\\text{ mol}$ uchun massa farqi: $40 - 30{,}6 = 9{,}4\\text{ g}$. Dastlabki propin: $7{,}52 / 9{,}4 = 0{,}8\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-1-25",
    turi: "variant",
    mavzu: "Termokimyoviy tenglamalar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{C4H10 + 6{,}5O2 -> 4CO2 + 5H2O + 2610 kJ}$. Agar jarayonda $652{,}5\\text{ kJ}$ issiqlik ajralib chiqqan bo'lsa, hosil bo'lgan karbonat angidrid tarkibidagi uglerod atomlari sonini toping.",
    options: [
      "$0{,}602 \\cdot 10^{23}$",
      "$6{,}02 \\cdot 10^{23}$",
      "$9{,}03 \\cdot 10^{23}$",
      "$12{,}04 \\cdot 10^{23}$",
    ],
    correct: 1,
    explanation:
      "Yonishda $652{,}5 / 2610 = 0{,}25\\text{ mol}$ butan sarflangan, demak $0{,}25 \\cdot 4 = 1\\text{ mol}$ $\\ce{CO2}$ hosil bo'ladi. Undagi uglerod atomlari soni $1 \\cdot N_A = 6{,}02 \\cdot 10^{23}$.",
  },
  {
    id: "ms-2025-05-03-1-26",
    turi: "variant",
    mavzu: "Gidridlar aralashmasidan elementni aniqlash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$\\ce{3XH3 + YH4}$ aralashmasining o'rtacha molyar massasi $29{,}5\\text{ g/mol}$, $\\ce{2XH3 + YH4}$ aralashmasida esa vodorodning massa ulushi $5/42$ bo'lsa, $X$ elementni aniqlang.",
    options: ["$\\ce{N}$", "$\\ce{P}$", "$\\ce{B}$", "$\\ce{As}$"],
    correct: 1,
    explanation:
      "$3(X+3) + (Y+4) = 4 \\cdot 29{,}5 = 118 \\Rightarrow 3X + Y = 105$. Ikkinchi aralashmada $10\\text{ g}$ vodorod $5/42$ ulushga ega: $2(X+3) + (Y+4) = 84 \\Rightarrow 2X + Y = 74$. Ayirsak: $X = 105 - 74 = 31$ (fosfor, $\\ce{P}$).",
  },
  {
    id: "ms-2025-05-03-1-27",
    turi: "variant",
    mavzu: "Anorganik moddalar identifikatsiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Sariq rangli $A$ modda yondirilganda $B$ gaz hosil bo'ldi. $B$ moddani $C$ mineralini kuydirish orqali ham olish mumkin. $D$ modda $C$ bilan elementlar tarkibi bir xil, ammo foizlari har xil. $D$ modda $\\ce{HCl}$ bilan palag'da tuxum hidli gaz ajratib, hosil bo'lgan eritmaga qizil qon tuzi qo'shilganda turnbul ko'ki hosil bo'ladi. $C$ moddani aniqlang.",
    options: ["$\\ce{FeS2}$", "$\\ce{ZnS}$", "$\\ce{MgCl2}$", "$\\ce{FeS}$"],
    correct: 0,
    explanation:
      "$A$ — oltingugurt ($\\ce{S}$), $B$ — $\\ce{SO2}$, $D$ — $\\ce{FeS}$ ($\\ce{HCl}$ bilan $\\ce{H2S}$ va $\\ce{FeCl2}$ beradi). $D$ bilan element tarkibi bir xil, foizlari farqli va kuydirilganda $\\ce{SO2}$ beruvchi mineral $C$ — pirit ($\\ce{FeS2}$).",
  },
  {
    id: "ms-2025-05-03-1-28",
    turi: "variant",
    mavzu: "Tuzlar gidrolizi va dissotsilanish darajasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$x\\text{ mol}$ $\\ce{Na2CO3}$ suvda eritildi. Hosil bo'lgan eritmada $1{,}02\\text{ g}$ $\\ce{OH-}$ ioni va $0{,}51\\text{ mol}$ $\\ce{CO3^{2-}}$ anioni bor. Natriy karbonatning dissotsilanmagan qismi $5\\%$ ni tashkil etsa (gidroliz $1$-bosqichda borgan deb olinsin), $x$ ni toping.",
    options: ["$0{,}6$", "$0{,}57$", "$0{,}2$", "$0{,}5$"],
    correct: 0,
    explanation:
      "$n(\\ce{OH-}) = 1{,}02/17 = 0{,}06\\text{ mol}$, shuncha mol $\\ce{CO3^{2-}}$ gidrolizlangan. Demak, dissotsilanishdan jami $0{,}51 + 0{,}06 = 0{,}57\\text{ mol}$ $\\ce{CO3^{2-}}$ hosil bo'lgan. $\\alpha = 95\\%$ bo'lgani uchun $0{,}95x = 0{,}57 \\Rightarrow x = 0{,}6\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-1-29",
    turi: "variant",
    mavzu: "Ionli oksidlanish-qaytarilish tenglamalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Quyidagi berilgan reaksiya tenglamasi orqali $X$ zarrachani aniqlang:\n" +
      "$\\ce{2X + 16H+ + 14Cl- -> 2MnCl2 + 5Cl2 + 8H2O}$",
    options: [
      "$\\ce{MnO4^{2-}}$",
      "$\\ce{MnO4-}$",
      "$\\ce{MnO2}$",
      "$\\ce{Mn2O3}$",
    ],
    correct: 1,
    explanation:
      "Atom va zaryad balansidan: o'ngda $2\\text{ Mn}$, $8\\text{ O}$ bor, chapda esa $\\ce{2X}$ bundan tashqari $+16 - 14 = +2$ zaryad mavjud (o'ng taraf $0$). Demak, $2X$ da $2\\text{ Mn}$, $8\\text{ O}$ va $-2$ zaryad bo'lib, $X = \\ce{MnO4-}$.",
  },
  {
    id: "ms-2025-05-03-1-30",
    turi: "variant",
    mavzu: "Uglevodlar xossalari va tuzilishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Quyidagi fikrlardan nechtasi to'g'ri ekanligini toping:\n" +
      "$1)$ Laktoza piranoza shaklidagi $\\beta$-galaktoza va fruktoza qoldiqlaridan tashkil topgan bo'lib, ular o'zaro $(1 \\to 4)$-glikozid bog' orqali ulanadi;\n" +
      "$2)$ Saxaroza aldegid xususiyatini namoyon qiladi;\n" +
      "$3)$ Disaxaridlar mineral kislotalar yoki fermentlar ta'sirida gidrolizlanib, monosaxaridlar hosil qiladi;\n" +
      "$4)$ Sellyuloza o'simlik hujayra devorining asosini tashkil qiladi.",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 1,
    explanation:
      "Laktoza galaktoza va glyukozadan (fruktozadan emas) iborat ($1$ noto'g'ri); saxarozada erkin aldegid guruhi yo'q, qaytaruvchi emas ($2$ noto'g'ri). $3$- va $4$-fikrlar to'g'ri — jami $2$ ta.",
  },
  {
    id: "ms-2025-05-03-1-31",
    turi: "variant",
    mavzu: "Dixloralkanlar gidrolizi va izomeriyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{C_n H_{2n} Cl2}$ tarkibli ikki xil o'zaro izomer dixloralkanlarning umumiy massasi $38{,}1\\text{ g}$, mol nisbati $1 : 5$. Ikkala izomer ishqoriy gidrolizlanganda $\\ce{C_n H_{2n} O}$ hosil bo'ldi. $1$-izomerdan hosil bo'lgan modda gidrogenlanganda $3{,}7\\text{ g}$ birlamchi spirt ($X$), $2$-izomerdan esa $18{,}5\\text{ g}$ ikkilamchi spirt ($Y$) olindi. $X$ da ikkilamchi uglerod yo'q, $Y$ da esa bor. $X$ ni bergan dastlabki dixloralkanni nomlang.",
    options: [
      "$2$-metil-$1,1$-dixlorpropan",
      "$1,1$-dixlorbutan",
      "$2,2$-dixlorbutan",
      "$2,2$-dixlorpropan",
    ],
    correct: 0,
    explanation:
      "$\\frac{38{,}1}{22{,}2} = \\frac{14n+71}{14n+18} = \\frac{127}{74} \\Rightarrow n = 4$ (butanollar). Birlamchi spirtda ($\\ce{(CH3)2CH-CH2OH}$) ikkilamchi $\\ce{C}$ yo'q, demak $1$-izomer tarmoqlangan gem-dixlorid — $2$-metil-$1,1$-dixlorpropandir.",
  },
  {
    id: "ms-2025-05-03-1-32",
    turi: "variant",
    mavzu: "Kislotalar va tuzlar reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "$91{,}25\\text{ g}$ $20\\%$ li $\\ce{HCl}$ eritmasiga ortiqcha marmar bo'lakchalari tashlandi. Hosil bo'lgan eritma ajratib olinib, unga $207\\text{ g}$ $20\\%$ li $\\ce{K2CO3}$ eritmasi qo'shildi. Hosil bo'lgan cho'kma miqdorini ($\\text{mol}$) toping.",
    options: ["$0{,}3$", "$0{,}25$", "$1$", "$0{,}5$"],
    correct: 1,
    explanation:
      "$n(\\ce{HCl}) = 91{,}25 \\cdot 0{,}2 / 36{,}5 = 0{,}5\\text{ mol} \\Rightarrow n(\\ce{CaCl2}) = 0{,}25\\text{ mol}$. $n(\\ce{K2CO3}) = 207 \\cdot 0{,}2 / 138 = 0{,}3\\text{ mol}$ (ortiqcha). Shuning uchun cho'kmaga tushgan $\\ce{CaCO3}$ miqdori $0{,}25\\text{ mol}$.",
  },
  {
    id: "ms-2025-05-03-1-33",
    turi: "moslashtirish",
    mavzu: "Metallar aralashmasining suv bilan reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. Hosil bo'lgan natriy gidroksid massasini ($\\text{g}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "$0{,}5(0{,}8 - z) + z = 0{,}5 \\Rightarrow z = 0{,}2\\text{ mol}$ $\\ce{Ca}$ ($8\\text{ g}$). $n(\\ce{Na}) + n(\\ce{K}) = 0{,}6\\text{ mol}$, $23x + 39(0{,}6-x) = 17 \\Rightarrow x = 0{,}4\\text{ mol}$ $\\ce{Na}$, $0{,}2\\text{ mol}$ $\\ce{K}$. $m(\\ce{NaOH}) = 0{,}4 \\cdot 40 = 16\\text{ g}$ (C).",
  },
  {
    id: "ms-2025-05-03-1-34",
    turi: "moslashtirish",
    mavzu: "Metallar aralashmasining massa ulushi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Boshlang'ich aralashmadagi kalsiyning massa ulushini ($\\%$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "Aralashma umumiy massasi $17 + 8 = 25\\text{ g}$, unda $8\\text{ g}$ kalsiy bor: $\\omega(\\ce{Ca}) = 8 / 25 \\cdot 100\\% = 32\\%$ (A).",
  },
  {
    id: "ms-2025-05-03-1-35",
    turi: "moslashtirish",
    mavzu: "Vodorod bilan ketonlarni qaytarish",
    soha: "Organik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question:
      "35. Kaliyning suv bilan reaksiyasidan ajralgan vodorod necha gramm atsetonni propanol-$2$ gacha qaytarishga yetadi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "E",
    explanation:
      "$0{,}2\\text{ mol}$ $\\ce{K}$ suvdan $0{,}1\\text{ mol}$ $\\ce{H2}$ chiqaradi. Bu $0{,}1\\text{ mol}$ atseton ($\\ce{CH3COCH3}$, $M = 58$) ni qaytaradi: $0{,}1 \\cdot 58 = 5{,}8\\text{ g}$ (E).",
  },
  {
    id: "ms-2025-05-03-1-36",
    turi: "ochiq",
    mavzu: "Murakkab oksidlanish-qaytarilish reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$\\ce{Cu3N + HNO3(suyult.) -> Cu(NO3)2 + NO + H2O}$ va $\\ce{Cu3N + HNO3(kons.) -> Cu(NO3)2 + NO2 + H2O}$ reaksiyalarining har ikkalasida ham $2{,}2\\text{ moldan}$ gaz hosil bo'lgan bo'lsa, reaksiyalarda qatnashgan nitrat kislotalarning massa farqini ($\\text{g}$) aniqlang.",
    correct: "126",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "Tenglamalar: $\\ce{3Cu3N + 26HNO3 -> 9Cu(NO3)2 + 11NO + 13H2O}$ (va $2{,}2\\text{ mol}$ $\\ce{NO}$ uchun $5{,}2\\text{ mol}$ $\\ce{HNO3}$) hamda $\\ce{Cu3N + 16HNO3 -> 3Cu(NO3)2 + 11NO2 + 8H2O}$ ($2{,}2\\text{ mol}$ $\\ce{NO2}$ uchun $3{,}2\\text{ mol}$ $\\ce{HNO3}$). Farqi: $(5{,}2 - 3{,}2) \\cdot 63 = 126\\text{ g}$.",
  },
  {
    id: "ms-2025-05-03-1-37",
    turi: "ochiq",
    mavzu: "Eritmalar konsentratsiyasi algebraik masalasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Tuz eritmasiga shu eritmadagi tuz massasidan $20\\text{ g}$ kam bo'lgan miqdorda tuz qo'shildi va $25\\%$ li eritma olindi. Agar boshlang'ich eritmaga undagi suv massasidan $20\\text{ g}$ kam miqdorda tuz qo'shilsa, $52\\%$ li eritma hosil bo'ladi. Boshlang'ich eritmaning foiz konsentratsiyasini ($\\%$) aniqlang.",
    correct: "20",
    tolerance: 0.05,
    birlik: "%",
    explanation:
      "Tuz $s$, suv $w$ bo'lsin: $(2s - 20)/(2s + w - 20) = 0{,}25 \\Rightarrow w = 6s - 60$. Ikkinchi shart: $(s + w - 20)/(s + 2w - 20) = 0{,}52 \\Rightarrow (7s - 80)/(13s - 140) = 13/25 \\Rightarrow 6s = 180 \\Rightarrow s = 30\\text{ g}$, $w = 120\\text{ g}$. Dastlabki eritma: $30 / (30 + 120) \\cdot 100\\% = 20\\%$.",
  },
  {
    id: "ms-2025-05-03-1-38",
    turi: "ochiq",
    mavzu: "Kristallogidratlar formulasini aniqlash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$1{,}76\\text{ g}$ temir(II) sulfid mo'l miqdorda kislorodda yoqildi. Hosil bo'lgan qattiq qoldiq $35\\%$ li sulfat kislota eritmasida to'liq eritilib, $40\\%$ li to'yingan tuz eritmasi olindi. Eritma sovutilganda $2{,}81\\text{ g}$ kristallogidrat cho'kmaga tushdi, eritmada esa $2\\text{ g}$ suvsiz tuz qoldi. Hosil bo'lgan kristallogidratning molyar massasini ($\\text{g/mol}$) aniqlang.",
    correct: "562",
    tolerance: 0.5,
    birlik: "g/mol",
    explanation:
      "$n(\\ce{FeS}) = 1{,}76/88 = 0{,}02\\text{ mol} \\to 0{,}01\\text{ mol }\\ce{Fe2O3}$ ($1{,}6\\text{ g}$) $\\to 0{,}01\\text{ mol }\\ce{Fe2(SO4)3}$ ($4{,}0\\text{ g}$) $10\\text{ g}$ ($40\\%$) eritmada. $2\\text{ g}$ tuz qolsa, $2{,}0\\text{ g}$ ($0{,}005\\text{ mol}$) $\\ce{Fe2(SO4)3}$ cho'kkan; undagi suv $2{,}81 - 2{,}0 = 0{,}81\\text{ g}$ ($0{,}045\\text{ mol}$). Nisbat $1:9$ ($\\ce{Fe2(SO4)3 \\cdot 9H2O}$), $M = 562\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-05-03-1-39",
    turi: "ochiq",
    mavzu: "Uglevodorodlar aralashmasining yonishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$80\\text{ ml}$ $\\ce{C2H4}$, $\\ce{C3H6}$ va $\\ce{C4H10}$ aralashmasi $830\\text{ ml}$ $\\ce{O2}$ bilan yondirildi. Ortib qolgan $\\ce{O2}$ hajmi ajralib chiqqan $\\ce{CO2}$ hajmidan $1{,}5$ marta ko'p. Dastlab $\\ce{C2H4}$ va $\\ce{C3H6}$ lar $1 : 3$ hajmiy nisbatda olingan bo'lsa, ortib qolgan kislorod hajmini ($\\text{ml}$) toping.",
    correct: "405",
    tolerance: 0.5,
    birlik: "ml",
    explanation:
      "$V(\\ce{C2H4}) = x$, $V(\\ce{C3H6}) = 3x$, $V(\\ce{C4H10}) = 80 - 4x$. $V(\\ce{CO2}) = 320 - 5x$, sarflangan $V(\\ce{O2}) = 520 - 9{,}5x$. Ortib qolgan $\\ce{O2}$: $830 - (520 - 9{,}5x) = 310 + 9{,}5x = 1{,}5(320 - 5x) \\Rightarrow 17x = 170 \\Rightarrow x = 10\\text{ ml}$. Ortgan $\\ce{O2}$: $310 + 95 = 405\\text{ ml}$.",
  },
  {
    id: "ms-2025-05-03-1-40",
    turi: "ochiq",
    mavzu: "Aldegidlar aralashmasining kumush ko'zgu reaksiyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$3{,}88\\text{ g}$ chumoli va sirka aldegidlari aralashmasi kumush oksidining ammiakli eritmasidan to'liq o'tkazildi. Cho'kma ajratib olinib konsentrlangan nitrat kislotada eritilganda $0{,}44\\text{ mol}$ qo'ng'ir gaz ($\\ce{NO2}$) ajralib chiqdi. Hosil bo'lgan sirka kislotaning massasini ($\\text{g}$) aniqlang.",
    correct: "1.2",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$1\\text{ mol}$ $\\ce{HCHO}$ $4\\text{ mol}$, $1\\text{ mol}$ $\\ce{CH3CHO}$ esa $2\\text{ mol}$ $\\ce{Ag}$ beradi (har bir $\\ce{Ag}$ $1\\text{ mol}$ $\\ce{NO2}$ hosil qiladi). $30x + 44y = 3{,}88$ va $4x + 2y = 0{,}44 \\Rightarrow 58x = 5{,}8 \\Rightarrow x = 0{,}1\\text{ mol}$ $\\ce{HCHO}$, $y = 0{,}02\\text{ mol}$ $\\ce{CH3CHO}$. Hosil bo'lgan $\\ce{CH3COOH}$: $0{,}02 \\cdot 60 = 1{,}2\\text{ g}$.",
  },
]

export default savollar
