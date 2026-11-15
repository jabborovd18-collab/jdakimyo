// 2025-yil 25-yanvar, I smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "5,6 litr (n.sh.) fosfin gazi ($\\ce{PH3}$) to'la yondirilishidan hosil bo'lgan fosfor(V)-oksid kalsiy gidroksid eritmasidan o'tkazilganda hosil bo'lgan kalsiy gidrofosfat ($\\ce{CaHPO4}$) tuzi massasi kalsiy digidrofosfat ($\\ce{Ca(H2PO4)2}$) tuzi massasidan $16{,}6\\text{ g}$ kam bo'ldi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$0{,}2$",
  B: "$0{,}05$",
  C: "$0{,}15$",
  D: "$0{,}1$",
  E: "$0{,}25$",
  F: "$0{,}3$",
}

const savollar = [
  {
    id: "ms-2025-01-25-1-1",
    turi: "variant",
    mavzu: "Moddaning eng kichik strukturaviy birliklari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Moddaning kimyoviy xossalarini saqlaydigan eng kichik strukturaviy birligini belgilang.",
    options: ["Molekula", "Atom", "Elektron", "Neytron"],
    correct: 0,
    explanation:
      "Molekula — moddaning kimyoviy xossalarini saqlab qoluvchi eng kichik zarracha. Atom kimyoviy bo'linmaydigan elementar birlik, elektron va neytron esa subatom zarrachalardir.",
  },
  {
    id: "ms-2025-01-25-1-2",
    turi: "variant",
    mavzu: "Yog' kislotalari va empirik formula",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Linol kislotaning empirik (eng sodda) formulasini ko'rsating.",
    options: [
      "$\\ce{C_{n}H_{2n}O2}$",
      "$\\ce{C18H32O2}$",
      "$\\ce{C18H30O2}$",
      "$\\ce{C9H16O}$",
    ],
    correct: 3,
    explanation:
      "Linol kislota tarkibida $18$ ta uglerod, $32$ ta vodorod va $2$ ta kislorod atomi bo'lib, molekulyar formulasi $\\ce{C18H32O2}$. Indekslarni eng katta umumiy bo'luvchi $2$ ga qisqartirsak, empirik formula $\\ce{C9H16O}$ hosil bo'ladi.",
  },
  {
    id: "ms-2025-01-25-1-3",
    turi: "variant",
    mavzu: "Birikmaning formulasini massa ulushi orqali topish",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\frac{1}{55}\\text{ g}$ marganes oksidida $\\frac{5}{515}\\text{ g}$ marganes mavjud. Oksid formulasini aniqlang.",
    options: ["$\\ce{MnO3}$", "$\\ce{Mn2O7}$", "$\\ce{Mn2O3}$", "$\\ce{MnO2}$"],
    correct: 0,
    explanation:
      "$m(\\ce{Mn}) = \\frac{5}{515} = \\frac{1}{103}\\text{ g}$, $m(\\ce{O}) = \\frac{1}{55} - \\frac{1}{103} = \\frac{48}{55 \\cdot 103}\\text{ g}$. Mol nisbati: $n(\\ce{Mn}) : n(\\ce{O}) = \\frac{1}{55 \\cdot 103} : \\frac{48}{16 \\cdot 55 \\cdot 103} = 1 : 3$. Demak, oksid — $\\ce{MnO3}$.",
  },
  {
    id: "ms-2025-01-25-1-4",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat konstantasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$A + B \\rightleftarrows C + D$ reaksiya bo'yicha dastlabki moddalar konsentratsiyasi mos ravishda $6$ va $4\\text{ mol/l}$ dan olindi. Muvozanat yuzaga kelganda $B$ moddaning konsentratsiyasini ($\\text{mol/l}$) aniqlang ($K_M = 1$).",
    options: ["$2{,}4$", "$1{,}6$", "$3{,}6$", "$1{,}8$"],
    correct: 1,
    explanation:
      "Reaksiyaga kirishgan konsentratsiyani $x$ desak, muvozanatda $[A] = 6 - x$, $[B] = 4 - x$, $[C] = [D] = x$. $K_M = \\frac{x^2}{(6 - x)(4 - x)} = 1 \\Rightarrow x^2 = 24 - 10x + x^2 \\Rightarrow x = 2{,}4\\text{ mol/l}$. Shunda $[B] = 4 - 2{,}4 = 1{,}6\\text{ mol/l}$.",
  },
  {
    id: "ms-2025-01-25-1-5",
    turi: "variant",
    mavzu: "Eritmalarni suyultirish",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$100\\text{ g}$ $18\\%$ li eritmadan $0{,}9\\%$ li eritma hosil qilish uchun necha gramm suv bilan suyultirish kerak?",
    options: ["$1900$", "$190$", "$2000$", "$200$"],
    correct: 0,
    explanation:
      "Dastlabki eritmadagi erigan modda massasi $100 \\cdot 0{,}18 = 18\\text{ g}$. $0{,}9\\%$ li yangi eritma massasi $18 / 0{,}009 = 2000\\text{ g}$ bo'lishi kerak. Qo'shiladigan suv massasi: $2000 - 100 = 1900\\text{ g}$.",
  },
  {
    id: "ms-2025-01-25-1-6",
    turi: "variant",
    mavzu: "Tuzlar tarkibidagi metall va metallmas massasi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Tarkibida metall va metallmas atomlari massasi $2\\text{ g/mol}$ ga farq qiluvchi tuzni aniqlang.",
    options: [
      "$\\ce{K2Cr2O7}$",
      "$\\ce{LiMnO4}$",
      "$\\ce{K2SO4}$",
      "$\\ce{NaNO3}$",
    ],
    correct: 1,
    explanation:
      "$\\ce{LiMnO4}$ da ikkita metall atomi bor: $m(\\ce{Li} + \\ce{Mn}) = 7 + 55 = 62\\text{ g/mol}$, metallmas kislorod massasi $m(4\\ce{O}) = 4 \\cdot 16 = 64\\text{ g/mol}$. Farq: $64 - 62 = 2\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-01-25-1-7",
    turi: "variant",
    mavzu: "Yadro reaksiyalari va izotonlar",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "$^{210}_{86}\\ce{Rn} \\rightarrow A + x\\,^{4}_{2}\\alpha + y\\,^{0}_{+1}\\beta$ yadro reaksiyasida $31{,}5\\text{ mg}$ radon parchalanganda $54{,}18 \\cdot 10^{19}$ ta pozitron ($\\beta^+$) hosil bo'ldi. Agar $\\ce{Rn}$ va $A$ o'zaro izoton bo'lsa, $A$ neytral atomi tarkibidagi proton va elektronlar soni yig'indisini toping.",
    options: ["$158$", "$148$", "$164$", "$172$"],
    correct: 1,
    explanation:
      "Radon moli: $0{,}0315 / 210 = 1{,}5 \\cdot 10^{-4}\\text{ mol}$. $\\beta^+$ moli: $54{,}18 \\cdot 10^{19} / 6{,}02 \\cdot 10^{23} = 9 \\cdot 10^{-4}\\text{ mol}$, demak $y = 6$. $A$ ning massa soni $210 - 4x$, tartib raqami $86 - 2x - y$, neytronlari $N_A = 124 - 2x + y$. Izoton sharti: $124 - 2x + 6 = 124 \\Rightarrow x = 3$. Shunda $Z_A = 86 - 6 - 6 = 74$. Neytral atomda $p + e = 74 + 74 = 148$.",
  },
  {
    id: "ms-2025-01-25-1-8",
    turi: "variant",
    mavzu: "Ionlar va neytral atomlar tarkibi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Jadval ma'lumotlari asosida musbat zaryadli zarrachani aniqlang:\n" +
      "$1)\\ \\ce{X}$: $20$ ta proton, $18$ ta elektron\n" +
      "$2)\\ \\ce{Y}$: $9$ ta proton, $10$ ta elektron\n" +
      "$3)\\ \\ce{Z}$: $18$ ta proton, $19$ ta elektron\n" +
      "$4)\\ \\ce{A}$: $8$ ta proton, $10$ ta elektron",
    options: ["$1$", "$2$", "$3, 4$", "$1, 4$"],
    correct: 0,
    explanation:
      "Zarrachada protonlar soni elektronlar sonidan ko'p bo'lsa, u musbat zaryadli (kation) bo'ladi: $1$-zarracha ($X^{2+}$) da $20 - 18 = +2$. Qolganlarida elektronlar ko'p (manfiy zaryadli).",
  },
  {
    id: "ms-2025-01-25-1-9",
    turi: "variant",
    mavzu: "Ammoniy dixromat parchalanishi va amfoter oksidlar",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Ammoniy dixromat parchalanganda $0{,}1\\text{ mol}$ gaz ajraldi. Hosil bo'lgan qattiq qoldiq $0{,}2\\text{ mol}$ $\\ce{NaOH}$ (yetarli miqdor) bilan qizdirib reaksiyaga kirgizildi. Hosil bo'lgan tuz massasini ($\\text{g}$) aniqlang.",
    options: ["$10{,}7$", "$21{,}4$", "$16{,}8$", "$24{,}7$"],
    correct: 1,
    explanation:
      "$\\ce{(NH4)2Cr2O7 -> N2 ^ + Cr2O3 + 4H2O}$ reaksiyasida $0{,}1\\text{ mol}$ $\\ce{N2}$ bilan $0{,}1\\text{ mol}$ $\\ce{Cr2O3}$ hosil bo'ladi. $\\ce{Cr2O3 + 2NaOH -> 2NaCrO2 + H2O}$ bo'yicha $0{,}2\\text{ mol}$ $\\ce{NaCrO2}$ ($M = 107\\text{ g/mol}$) olinadi. Massasi: $0{,}2 \\cdot 107 = 21{,}4\\text{ g}$.",
  },
  {
    id: "ms-2025-01-25-1-10",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Reaksiya jarayonida kislorod sarflanish tezligi $0{,}8\\text{ mol/(l}\\cdot\\text{min)}$ ga teng. $2{,}5\\text{ l}$ li idishda kislorod massasi $128\\text{ g}$ dan $16\\text{ g}$ gacha kamaydi. Reaksiya necha sekund davom etgan?",
    options: ["$210$", "$0{,}075$", "$0{,}5$", "$105$"],
    correct: 3,
    explanation:
      "Sarflangan kislorod massasi $128 - 16 = 112\\text{ g}$, moli $112 / 32 = 3{,}5\\text{ mol}$. Konsentratsiya o'zgarishi $\\Delta C = 3{,}5 / 2{,}5 = 1{,}4\\text{ mol/l}$. Vaqt: $t = \\Delta C / v = 1{,}4 / 0{,}8 = 1{,}75\\text{ min} = 1{,}75 \\cdot 60 = 105\\text{ s}$.",
  },
  {
    id: "ms-2025-01-25-1-11",
    turi: "variant",
    mavzu: "Asoslar va asosli tuzlar hosil bo'lishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Quyidagi asoslardan qaysi biri asosli tuz hosil qilmaydi?",
    options: [
      "$\\ce{KOH}$",
      "$\\ce{Ca(OH)2}$",
      "$\\ce{Al(OH)3}$",
      "$\\ce{Fe(OH)2}$",
    ],
    correct: 0,
    explanation:
      "Asosli tuz hosil qilishi uchun asos tarkibida kamida ikkita $\\ce{OH-}$ guruhi bo'lishi kerak. Bir kislotali asos $\\ce{KOH}$ faqat o'rta tuzlar beradi, asosli tuz hosil qilmaydi.",
  },
  {
    id: "ms-2025-01-25-1-12",
    turi: "variant",
    mavzu: "Tuz eritmasi elektrolizi",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{CuSO4}$ eritmasi inert elektrodlar yordamida elektroliz qilinganda tuzning massa ulushi $12{,}8\\%$ gacha kamaydi, hosil bo'lgan kislotaning massa ulushi esa $4{,}9\\%$ ga yetdi. Dastlabki tuzning massa ulushini ($\\%$) toping.",
    options: ["$19{,}6$", "$20$", "$16{,}8$", "$20{,}8$"],
    correct: 1,
    explanation:
      "Oxirgi eritma massasini $100\\text{ g}$ deb olsak: $m(\\ce{CuSO4}) = 12{,}8\\text{ g}$ ($0{,}08\\text{ mol}$) va $m(\\ce{H2SO4}) = 4{,}9\\text{ g}$ ($0{,}05\\text{ mol}$). Elektroliz: $\\ce{2CuSO4 + 2H2O -> 2Cu v + O2 ^ + 2H2SO4}$. $0{,}05\\text{ mol}$ kislota uchun $0{,}05\\text{ mol}$ tuz sarflanib, eritmadan $0{,}05 \\cdot 64 + 0{,}025 \\cdot 32 = 4\\text{ g}$ massa chiqib ketgan. Dastlabki eritma $104\\text{ g}$, undagi tuz $(0{,}08 + 0{,}05) \\cdot 160 = 20{,}8\\text{ g}$. Ulushi: $20{,}8 / 104 = 20\\%$.",
  },
  {
    id: "ms-2025-01-25-1-13",
    turi: "variant",
    mavzu: "Elektrolitik dissotsiatsiya darajasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{KOH}$ ning $168\\text{ g}$ $10\\%$ li eritmasi dissotsiyalanishidan hosil bo'lgan kationlar molini toping ($\\alpha = 90\\%$).",
    options: ["$0{,}54$", "$1$", "$0{,}27$", "$0{,}6$"],
    correct: 2,
    explanation:
      "Ishqor massasi $168 \\cdot 0{,}10 = 16{,}8\\text{ g}$, moli $16{,}8 / 56 = 0{,}3\\text{ mol}$. $\\ce{KOH -> K+ + OH-}$ bo'yicha dissotsiyalangan qism kation molini beradi: $n(\\ce{K+}) = 0{,}3 \\cdot 0{,}90 = 0{,}27\\text{ mol}$.",
  },
  {
    id: "ms-2025-01-25-1-14",
    turi: "variant",
    mavzu: "Tuzlarning grafik formulalarida sigma va pi bog'lar",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "Kalsiy pirofosfat ($\\ce{Ca2P2O7}$), kalsiy digidroortofosfat ($\\ce{Ca(H2PO4)2}$) va magniy gidroksokarbonat ($\\ce{(MgOH)2CO3}$) tuzlari tarkibidagi jami $\\sigma$-bog'lar soni jami $\\pi$-bog'lar sonidan necha marta ko'p?",
    options: ["$3$", "$4$", "$7$", "$8$"],
    correct: 2,
    explanation:
      "Tuzlarning grafik formulalaridagi bog'lar: $\\ce{Ca2P2O7}$ da $12\\,\\sigma$ va $2\\,\\pi$; $\\ce{Ca(H2PO4)2}$ da $14\\,\\sigma$ va $2\\,\\pi$; $\\ce{(MgOH)2CO3}$ da $9\\,\\sigma$ va $1\\,\\pi$. Jami: $\\sigma = 12 + 14 + 9 = 35$, $\\pi = 2 + 2 + 1 = 5$. Nisbat: $35 / 5 = 7$ marta.",
  },
  {
    id: "ms-2025-01-25-1-15",
    turi: "variant",
    mavzu: "Tuzlar gidrolizi va gidroliz darajasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question: "Seziy nitritning ($\\ce{CsNO2}$) gidroliz darajasini kamaytirish (sekinlashtirish) uchun eritmaga nima qo'shish kerak?",
    options: ["Suv", "Seziy nitrit", "Mis(II)-nitrat", "Rux xlorid"],
    correct: 1,
    explanation:
      "$\\ce{CsNO2}$ anion bo'yicha gidrolizlanadi: $\\ce{NO2- + H2O <=> HNO2 + OH-}$. Suv qo'shish (suyultirish) gidroliz darajasini oshiradi ($h = \\sqrt{K_h/C}$); $\\ce{Cu(NO3)2}$ va $\\ce{ZnCl2}$ kation gidrolizi tufayli $\\ce{OH-}$ ni bog'lab gidrolizni kuchaytiradi. Tuzning o'zini ($\\ce{CsNO2}$) qo'shib konsentratsiyani oshirish esa gidroliz darajasini kamaytiradi.",
  },
  {
    id: "ms-2025-01-25-1-16",
    turi: "variant",
    mavzu: "Vodorod sulfidning kislorod bilan reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$10\\text{ g}$ $\\ce{H2S}$ va $\\ce{O2}$ aralashmasi to'liq reaksiyaga kirishdi va faqat oddiy modda hamda suv hosil bo'ldi. Hosil bo'lgan oddiy modda massasini ($\\text{g}$) aniqlang.",
    options: ["$3{,}2$", "$1{,}6$", "$4{,}8$", "$6{,}4$"],
    correct: 3,
    explanation:
      "Oddiy modda (oltingugurt) hosil bo'lishi: $\\ce{2H2S + O2 -> 2S v + 2H2O}$. $2\\text{ mol}$ $\\ce{H2S}$ ($68\\text{ g}$) va $1\\text{ mol}$ $\\ce{O2}$ ($32\\text{ g}$) jami $100\\text{ g}$ aralashma $2\\text{ mol}$ $\\ce{S}$ ($64\\text{ g}$) beradi. Shunga ko'ra $10\\text{ g}$ aralashmadan $6{,}4\\text{ g}$ oltingugurt hosil bo'ladi.",
  },
  {
    id: "ms-2025-01-25-1-17",
    turi: "variant",
    mavzu: "Uglevodorodlar aralashmasi tarkibi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Etan, propin va propilen aralashmasi $6 : 4 : 7$ massa nisbatda olindi. $255\\text{ g}$ aralashma tarkibidagi propilenning hajmini (litr, n.sh.) aniqlang.",
    options: ["$44{,}8$", "$56$", "$67{,}2$", "$33{,}6$"],
    correct: 1,
    explanation:
      "Umumiy massa qismlari: $6 + 4 + 7 = 17$. Propilen massasi: $255 \\cdot \\frac{7}{17} = 105\\text{ g}$. Propilen ($\\ce{C3H6}$, $M = 42\\text{ g/mol}$) moli $105 / 42 = 2{,}5\\text{ mol}$, hajmi $2{,}5 \\cdot 22{,}4 = 56\\text{ l}$.",
  },
  {
    id: "ms-2025-01-25-1-18",
    turi: "variant",
    mavzu: "Metanning suv bug'i bilan konversiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$\\ce{C}$ va $\\ce{H}$ atomlari soni $1 : 18$ nisbatda bo'lgan metan va suv bug'i aralashmasi to'la ta'sirlashuvidan ($\\ce{CH4 + H2O -> CO + 3H2}$) oddiy modda va kislorod saqlagan gazsimon murakkab moddalar aralashmasi hosil bo'ldi. Aralashma tarkibidagi oddiy moddaning mol (hajmiy) ulushini toping.",
    options: ["$0{,}5$", "$0{,}3$", "$0{,}4$", "$0{,}6$"],
    correct: 1,
    explanation:
      "$1\\text{ mol}$ $\\ce{CH4}$ ($1\\text{ C},\\,4\\text{ H}$) bilan $\\ce{C}:\\ce{H} = 1:18$ bo'lishi uchun yana $14\\text{ H}$, ya'ni $7\\text{ mol}$ $\\ce{H2O}$ olingan. Konversiyada $1\\text{ mol}$ $\\ce{CH4}$ va $1\\text{ mol}$ $\\ce{H2O}$ dan $1\\text{ mol}$ $\\ce{CO}$ va $3\\text{ mol}$ $\\ce{H2}$ hosil bo'ladi, $6\\text{ mol}$ $\\ce{H2O}$ bug'i ortib qoladi. Jami $1 + 3 + 6 = 10\\text{ mol}$ gazda oddiy modda ($\\ce{H2}$) ulushi: $3 / 10 = 0{,}3$.",
  },
  {
    id: "ms-2025-01-25-1-19",
    turi: "variant",
    mavzu: "Benzol gomologlarining yonish reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Benzol gomologi to'liq yonganda $1{,}8\\text{ mol}$ $\\ce{O2}$ sarflandi va $0{,}8\\text{ mol}$ suv hosil bo'ldi. Benzol gomologini aniqlang.",
    options: [
      "$\\ce{C6H6}$",
      "$\\ce{C7H8}$",
      "$\\ce{C8H10}$",
      "$\\ce{C9H12}$",
    ],
    correct: 1,
    explanation:
      "Arenlarning umumiy formulasi $\\ce{C_{n}H_{2n-6}}$. Yonishda $n(\\ce{O2}) : n(\\ce{H2O}) = \\frac{3n - 3}{2} : (n - 3) = 1{,}8 : 0{,}8 = 9 : 4$. Tenglama: $4(1{,}5n - 1{,}5) = 9(n - 3) \\Rightarrow 6n - 6 = 9n - 27 \\Rightarrow 3n = 21 \\Rightarrow n = 7$ ($\\ce{C7H8}$, toluol).",
  },
  {
    id: "ms-2025-01-25-1-20",
    turi: "variant",
    mavzu: "Metanning pirolizi va gazlar aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Metan $1500\\,^\\circ\\text{C}$ haroratda qizdirilishidan hosil bo'lgan gazlar aralashmasi simob(II)-sulfat eritmasidan o'tkazildi. Vodorodga nisbatan zichligi $3{,}8$ bo'lgan $11{,}2\\text{ l}$ (n.sh.) gaz aralashmasi yutilmay qolgan bo'lsa, metanning parchalanish unumini ($\\%$) aniqlang.",
    options: ["$50$", "$60$", "$75$", "$40$"],
    correct: 0,
    explanation:
      "Kucherov eritmasi atsetilenni yutadi; chiqqan $11{,}2\\text{ l}$ ($0{,}5\\text{ mol}$) gaz ortib qolgan $\\ce{CH4}$ ($16$) va $\\ce{H2}$ ($2$) dan iborat, $M_{\\text{o'rt}} = 3{,}8 \\cdot 2 = 7{,}6\\text{ g/mol}$. $16x + 2(0{,}5 - x) = 0{,}5 \\cdot 7{,}6 = 3{,}8 \\Rightarrow x = 0{,}2\\text{ mol}$ ortgan $\\ce{CH4}$ va $0{,}3\\text{ mol}$ $\\ce{H2}$. $\\ce{2CH4 -> C2H2 + 3H2}$ bo'yicha $0{,}3\\text{ mol}$ $\\ce{H2}$ uchun $0{,}2\\text{ mol}$ $\\ce{CH4}$ parchalangan. Unum: $0{,}2 / (0{,}2 + 0{,}2) = 50\\%$.",
  },
  {
    id: "ms-2025-01-25-1-21",
    turi: "variant",
    mavzu: "Aminlar va eritma massa ulushi",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2025-01-25-1/savol-21.png",
    question: "Yuqoridagi sxemada tasvirlangan reaksiya natijasida hosil bo'lgan tuz eritmasining massa ulushini ($\\%$) aniqlang.",
    options: ["$16{,}3$", "$19{,}2$", "$32{,}6$", "$38{,}4$"],
    correct: 2,
    explanation:
      "Reaksiya: $\\ce{C2H5NH2 + HCl -> [C2H5NH3]Cl}$. $2\\text{ mol}$ etilamindan $2\\text{ mol}$ etilammoniy xlorid ($M = 45 + 36{,}5 = 81{,}5\\text{ g/mol}$) hosil bo'ladi: $m = 2 \\cdot 81{,}5 = 163\\text{ g}$. $500\\text{ g}$ eritmadagi massa ulushi: $163 / 500 = 32{,}6\\%$.",
  },
  {
    id: "ms-2025-01-25-1-22",
    turi: "variant",
    mavzu: "Aminlar va sp3 gibridlanish",
    soha: "Organik kimyo",
    daraja: "orta",
    question: "Tarkibida $5$ ta $sp^3$-gibridlangan atomga ega moddani toping.",
    options: [
      "Dietilamin",
      "Pentilamin",
      "Etilpropilamin",
      "Tetrametilamin",
    ],
    correct: 0,
    explanation:
      "Dietilamin ($\\ce{(C2H5)2NH}$) molekulasida $4$ ta uglerod atomi va $1$ ta azot atomi ($\\ce{N}$ ham to'rtta elektron jufti tufayli $sp^3$ gibridlangan) mavjud — jami $5$ ta $sp^3$ atom. Pentilamin va etilpropilaminda $5\\text{ C} + 1\\text{ N} = 6$ ta.",
  },
  {
    id: "ms-2025-01-25-1-23",
    turi: "variant",
    mavzu: "Alkanlarning galogenlanishi — oksidlovchi va qaytaruvchi",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Propan xlorlanganda oksidlovchi vazifasini bajaruvchi moddani toping.",
    options: ["Xlor", "Kislorod", "Vodorod", "Uglerod"],
    correct: 0,
    explanation:
      "$\\ce{C3H8 + Cl2 -> C3H7Cl + HCl}$ reaksiyasida xlor atomlarining oksidlanish darajasi $0$ dan $-1$ gacha pasayadi, ya'ni xlor elektron biriktirib oksidlovchi bo'ladi.",
  },
  {
    id: "ms-2025-01-25-1-24",
    turi: "variant",
    mavzu: "Aldegidlar tarkibi va gomologiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question: "Tarkibida $4 \\cdot N_A$ ta atom bo'lgan, massasi $21{,}5\\text{ g}$ ga teng to'yingan aldegid haqida to'g'ri fikrni toping.",
    options: [
      "Modda miqdori $0{,}25\\text{ mol}$",
      "Molyar massasi $74\\text{ g/mol}$",
      "Izomeri butanon",
      "Gomologi pentanal",
    ],
    correct: 0,
    explanation:
      "To'yingan aldegid $\\ce{C_{n}H_{2n}O}$ da $3n + 1$ ta atom bor va $M = 14n + 16$. Shartga ko'ra $\\frac{4}{3n + 1}(14n + 16) = 21{,}5 \\Rightarrow n = 5$ ($\\ce{C5H10O}$, pentanal, $M = 86\\text{ g/mol}$). Modda miqdori: $21{,}5 / 86 = 0{,}25\\text{ mol}$.",
  },
  {
    id: "ms-2025-01-25-1-25",
    turi: "variant",
    mavzu: "Organik moddalarning molyar massasi, qutbsiz bog'lari va gomologlari",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Qaysi qatorda barcha ma'lumotlar to'g'ri berilgan?\n" +
      "$1)$ Valerian kislota $|$ $M = 102\\text{ g/mol}$ $|$ Qutbsiz bog'lar: $4$ $|$ Gomologi: butilformiat\n" +
      "$2)$ Buten $|$ $M = 56\\text{ g/mol}$ $|$ Qutbsiz bog'lar: $4$ $|$ Gomologi: propen\n" +
      "$3)$ Pentanon $|$ $M = 86\\text{ g/mol}$ $|$ Qutbsiz bog'lar: $5$ $|$ Gomologi: butanon\n" +
      "$4)$ Alanin $|$ $M = 75\\text{ g/mol}$ $|$ Qutbsiz bog'lar: $3$ $|$ Gomologi: glitsin",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 1,
    explanation:
      "$1$-qatorda butilformiat valerian kislotaning gomologi emas, izomeridir. $3$-qatorda pentanonda $\\ce{C-C}$ qutbsiz bog'lar $4$ ta ($5$ emas). $4$-qatorda alaninning molyar massasi $89\\text{ g/mol}$ ($75$ glitsinga tegishli). $2$-qatorda buten ($\\ce{C4H8}$, $M=56$, $2$ yakka $+\\,1$ qo'sh $\\ce{C=C}$ ya'ni $4$ qutbsiz bog' va gomologi propen) to'liq to'g'ri.",
  },
  {
    id: "ms-2025-01-25-1-26",
    turi: "variant",
    mavzu: "Aminokislotalarning amfoter xossalari",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$584\\text{ g}$ diaminomonokarbon kislota ikki qismga ajratildi. Birinchi qismiga xlorid kislota qo'shilganda $438\\text{ g}$ tuz hosil bo'ldi. Qolgan ikkinchi qismiga mo'l $\\ce{KOH}$ qo'shilganda hosil bo'lgan tuz massasini ($\\text{g}$) aniqlang.",
    options: ["$184$", "$368$", "$298$", "$304$"],
    correct: 1,
    explanation:
      "Diaminomonokarbon kislota — lizin ($\\ce{C6H14N2O2}$, $M = 146\\text{ g/mol}$), jami $584 / 146 = 4\\text{ mol}$. Ikkita $\\ce{-NH2}$ guruhi $2\\text{ mol}$ $\\ce{HCl}$ bilan $M = 146 + 73 = 219\\text{ g/mol}$ tuz beradi; $438 / 219 = 2\\text{ mol}$. Ikkinchi qismda qolgan $2\\text{ mol}$ lizin $1\\text{ mol}$ $\\ce{KOH}$ bilan ($M_{\\text{tuz}} = 146 + 38 = 184\\text{ g/mol}$) $2 \\cdot 184 = 368\\text{ g}$ tuz beradi.",
  },
  {
    id: "ms-2025-01-25-1-27",
    turi: "variant",
    mavzu: "Nuklein kislotalar gidrolizi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$10\\text{ g}$ RNK ($M_r = 81000$) to'liq gidroliz qilinganda $10{,}4\\text{ g}$ nukleotidlar hosil bo'ldi. RNK zanjiridagi nukleotidlar sonini toping.",
    options: ["$179$", "$181$", "$3240$", "$180$"],
    correct: 1,
    explanation:
      "$10\\text{ g}$ RNK gidrolizida $10{,}4 - 10 = 0{,}4\\text{ g}$ suv birikkan. $1\\text{ mol}$ RNK ($81000\\text{ g}$) uchun sarflangan suv: $0{,}4 \\cdot \\frac{81000}{10} = 3240\\text{ g}$, ya'ni $3240 / 18 = 180\\text{ mol}$ $\\ce{H2O}$. Chiziqli $n$ ta nukleotiddan iborat zanjir gidrolizida $n - 1$ mol suv sarflanadi: $n = 180 + 1 = 181$.",
  },
  {
    id: "ms-2025-01-25-1-28",
    turi: "variant",
    mavzu: "Oligosaxaridlar gidrolizi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$33{,}3\\text{ g}$ oligosaxarid ($\\ce{(C6H10O5)_{n} \\cdot H2O}$) to'liq gidrolizlanganda $36\\text{ g}$ glukoza hosil bo'ldi. Oligosaxariddagi $n$ qiymatini aniqlang.",
    options: ["$3$", "$5$", "$6$", "$4$"],
    correct: 3,
    explanation:
      "Gidroliz tenglamasi: $\\ce{(C6H10O5)_{n} \\cdot H2O + (n - 1)H2O -> n C6H12O6}$. Proporsiya: $\\frac{162n + 18}{180n} = \\frac{33{,}3}{36} = 0{,}925 \\Rightarrow 162n + 18 = 166{,}5n \\Rightarrow 4{,}5n = 18 \\Rightarrow n = 4$.",
  },
  {
    id: "ms-2025-01-25-1-29",
    turi: "variant",
    mavzu: "Minerallar tarkibi va kriolit formulasi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Kriolit minerali tarkibida $\\ce{NaF}$ va $\\ce{AlF3}$ ning massa ulushi mos ravishda $0{,}6$ va $0{,}4$ bo'lsa, kriolitning formulasini ko'rsating.",
    options: [
      "$\\ce{3NaF \\cdot AlF3}$",
      "$\\ce{Na3AlF3}$",
      "$\\ce{NaAlF2}$",
      "$\\ce{NaF \\cdot AlF3}$",
    ],
    correct: 0,
    explanation:
      "Molyar massalar: $M(\\ce{NaF}) = 42\\text{ g/mol}$, $M(\\ce{AlF3}) = 84\\text{ g/mol}$. Mol nisbati: $n(\\ce{NaF}) : n(\\ce{AlF3}) = \\frac{0{,}6}{42} : \\frac{0{,}4}{84} = \\frac{1{,}2}{84} : \\frac{0{,}4}{84} = 3 : 1$. Formula: $\\ce{3NaF \\cdot AlF3}$.",
  },
  {
    id: "ms-2025-01-25-1-30",
    turi: "variant",
    mavzu: "Uglevodorodlar va kislorodli birikmalar genetik bog'lanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2025-01-25-1/savol-30.png",
    question:
      "Yuqoridagi o'zgarishlar sxemasi asosida $0{,}3\\text{ mol}$ $X$ va $0{,}2\\text{ mol}$ $Y$ moddalarning massalari ($\\text{g}$) yig'indisini toping (barcha moddalar tarkibida uglerod mavjud).",
    options: ["$17{,}6$", "$24{,}6$", "$16{,}6$", "$27{,}8$"],
    correct: 0,
    explanation:
      "Alkindan to'g'ridan-to'g'ri aldegid (Kucherov reaksiyasi) faqat atsetilendan ($\\ce{C2H2}$) olinadi ($\\ce{CH3CHO}$). Shunda alkin $+\\,\\ce{H2}$ dan $X = \\ce{C2H4}$ ($M = 28$), $+\\,\\ce{H2O}$ dan $Y = \\ce{C2H5OH}$ ($M = 46$), $Z = \\ce{C2H6}$, $D = \\ce{C2H5Cl}$. Yig'indi: $0{,}3 \\cdot 28 + 0{,}2 \\cdot 46 = 8{,}4 + 9{,}2 = 17{,}6\\text{ g}$.",
  },
  {
    id: "ms-2025-01-25-1-31",
    turi: "variant",
    mavzu: "Ko'p atomli spirtlar — etilenglikol xossalari",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Uchta idishda $1\\text{ mol}$ dan olingan etilenglikolga yetarli miqdorda natriy, kaliy va vodorod xlorid ($\\ce{HCl}$) qo'shildi. Hosil bo'lgan moddalar haqida to'g'ri javobni tanlang.",
    options: [
      "$108\\text{ g}$ kaliy alkogolyati hosil bo'lgan",
      "$106\\text{ g}$ natriy alkogolyati hosil bo'lgan",
      "$101\\text{ g}$ dixloretan hosil bo'lgan",
      "$128\\text{ g}$ kaliy alkogolyati hosil bo'lgan",
    ],
    correct: 1,
    explanation:
      "$1\\text{ mol}$ etilenglikol ($\\ce{HOCH2CH2OH}$, $M=62$) $2\\text{ mol}$ $\\ce{Na}$ bilan $1\\text{ mol}$ natriy glikolyat $\\ce{NaOCH2CH2ONa}$ ($M = 62 - 2 + 46 = 106\\text{ g}$) beradi. Kaliy alkogolyati $138\\text{ g}$, $1,2$-dixloretan esa $99\\text{ g}$ bo'ladi.",
  },
  {
    id: "ms-2025-01-25-1-32",
    turi: "variant",
    mavzu: "Ruda tarkibi va metallurgiya hisoblashlari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Tarkibida $60\\%$ mis tutmaydigan qo'shimcha va $1 : 1{,}5$ mol nisbatda kuprit ($\\ce{Cu2O}$) hamda tenorit ($\\ce{CuO}$) bo'lgan $132\\text{ kg}$ rudada necha kilogramm mis ajratib olish mumkin?",
    options: ["$67{,}2$", "$44{,}8$", "$22{,}4$", "$33{,}6$"],
    correct: 1,
    explanation:
      "Sof oksidlar massasi $132 \\cdot 0{,}40 = 52{,}8\\text{ kg}$. $1 : 1{,}5 = 2 : 3$ nisbatda $2\\text{ mol}$ $\\ce{Cu2O}$ ($288\\text{ g}$) $+\\,3\\text{ mol}$ $\\ce{CuO}$ ($240\\text{ g}$) $= 528\\text{ g}$ bo'lib, unda $4 + 3 = 7\\text{ mol}$ $\\ce{Cu}$ ($448\\text{ g}$) bor. $52{,}8\\text{ kg}$ dan $52{,}8 \\cdot \\frac{448}{528} = 44{,}8\\text{ kg}$ mis olinadi.",
  },
  {
    id: "ms-2025-01-25-1-33",
    turi: "moslashtirish",
    mavzu: "Fosfor oksidining ishqor bilan ta'sirlashuvi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. Hosil bo'lgan kalsiy gidrofosfat ($\\ce{CaHPO4}$) miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "B",
    explanation:
      "$5{,}6\\text{ l}$ $\\ce{PH3}$ ($0{,}25\\text{ mol}$) dan $0{,}25\\text{ mol}$ $\\ce{P}$ saqlagan oksid hosil bo'ladi. $x\\text{ mol}$ $\\ce{CaHPO4}$ ($M = 136$) va $y\\text{ mol}$ $\\ce{Ca(H2PO4)2}$ ($M = 234$) uchun: $x + 2y = 0{,}25$ va $234y - 136x = 16{,}6 \\Rightarrow 506y = 50{,}6 \\Rightarrow y = 0{,}10\\text{ mol}$, $x = 0{,}05\\text{ mol}$ (B).",
  },
  {
    id: "ms-2025-01-25-1-34",
    turi: "moslashtirish",
    mavzu: "Fosfat tuzlari aralashmasini hisoblash",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Hosil bo'lgan kalsiy digidrofosfat ($\\ce{Ca(H2PO4)2}$) miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "Fosfor va massa balans tenglamalari tizimidan $x = 0{,}25 - 2y$ ni $234y - 136x = 16{,}6$ ga qo'ysak, $234y + 272y - 34 = 16{,}6 \\Rightarrow 506y = 50{,}6 \\Rightarrow y = 0{,}1\\text{ mol}$ $\\ce{Ca(H2PO4)2}$ (D).",
  },
  {
    id: "ms-2025-01-25-1-35",
    turi: "moslashtirish",
    mavzu: "Reaksiyaga sarflangan asos miqdori",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "35. Reaksiyaga sarflangan $\\ce{Ca(OH)2}$ miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "Har ikkala tuzda $\\ce{Ca}$ atomi $1$ tadan ($\\ce{CaHPO4}$ va $\\ce{Ca(H2PO4)2}$). Kalsiy balansi bo'yicha sarflangan $\\ce{Ca(OH)2}$ miqdori: $x + y = 0{,}05 + 0{,}10 = 0{,}15\\text{ mol}$ (C).",
  },
  {
    id: "ms-2025-01-25-1-36",
    turi: "ochiq",
    mavzu: "Kimyoviy muvozanatning siljishi",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "$1\\text{ l}$ li idishda $A + B \\rightleftarrows C + D$ reaksiya bo'yicha muvozanatda turgan sistemada moddalarning muvozanat konsentratsiyalari mos ravishda $4$, $4$, $2$ va $8\\text{ mol/l}$ ga teng. Sistemaga $2\\text{ mol}$ $C$ modda qo'shildi. Yangi muvozanat holatida $A$ va $B$ moddalarning konsentratsiyalari yig'indisini ($\\text{mol/l}$) aniqlang.",
    correct: "9.6",
    tolerance: 0.1,
    birlik: "mol/l",
    explanation:
      "Muvozanat konstantasi $K_M = \\frac{2 \\cdot 8}{4 \\cdot 4} = 1$. $2\\text{ mol/l}$ $C$ qo'shilganda $[C] = 4$ bo'lib, muvozanat chapga $x$ ga siljiydi: $\\frac{(4 - x)(8 - x)}{(4 + x)^2} = 1 \\Rightarrow 32 - 12x + x^2 = 16 + 8x + x^2 \\Rightarrow 20x = 16 \\Rightarrow x = 0{,}8$. Yangi konsentratsiyalar: $[A] + [B] = 4{,}8 + 4{,}8 = 9{,}6\\text{ mol/l}$.",
  },
  {
    id: "ms-2025-01-25-1-37",
    turi: "ochiq",
    mavzu: "Oksidning kislota eritmasi va suv bilan ta'sirlashuvi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$458\\text{ g}$ sulfat kislota eritmasiga $\\ce{Na2O}$ qo'shilganda eritmadagi sulfat ionlarining massa ulushi $\\frac{415}{229}$ marta, suvning massasi esa $\\frac{5}{4}$ marta kamaydi. Reaksiya natijasida hosil bo'lgan tuz massasini ($\\text{g}$) toping.",
    correct: "142",
    tolerance: 0.5,
    birlik: "g",
    explanation:
      "$\\ce{SO4^{2-}}$ ionlari massasi o'zgarmagani uchun eritma massasi $\\frac{415}{229}$ marta ortgan: $m_{\\text{ox}} = 458 \\cdot \\frac{415}{229} = 830\\text{ g}$, qo'shilgan $\\ce{Na2O}$: $830 - 458 = 372\\text{ g}$ ($6\\text{ mol}$). $x\\text{ mol}$ $\\ce{Na2O}$ kislota bilan $\\ce{H2O}$ hosil qiladi ($+18x$), qolgan $(6 - x)\\text{ mol}$ suv bilan reaksiyaga kirishib $-18(6 - x)$ suv sarflaydi. Dastlabki suv $m_{\\text{suv}} = 458 - 98x$; $\\frac{458 - 98x}{(458 - 98x) + 18x - 18(6 - x)} = \\frac{5}{4} \\Rightarrow x = 1\\text{ mol}$ $\\ce{H2SO4}$ (va $360\\text{ g}$ suv $\\to 288\\text{ g}$). Tuz: $1\\text{ mol}$ $\\ce{Na2SO4} = 142\\text{ g}$.",
  },
  {
    id: "ms-2025-01-25-1-38",
    turi: "ochiq",
    mavzu: "Tuzlar orasidagi almashinish reaksiyasi va metallni aniqlash",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "$102{,}6\\text{ g}$ uch valentli $A$ metall sulfati bilan $302{,}4\\text{ g}$ ikki valentli $B$ metall perxlorati aralashtirilganda moddalar qoldiqsiz reaksiyaga kirishib, $209{,}7\\text{ g}$ $B$ metall sulfati hosil bo'ldi. $B$ metallning nisbiy atom massasini ($\\text{g/mol}$) toping.",
    correct: "137",
    tolerance: 0.5,
    birlik: "g/mol",
    explanation:
      "Reaksiya: $\\ce{A2(SO4)3 + 3B(ClO4)2 -> 3BSO4 v + 2A(ClO4)3}$. $B(\\text{ClO}_4)_2$ va $\\ce{BSO4}$ mollari teng ($n$). Perxlorat va sulfat anionlari massasi farqi $2 \\cdot 99{,}5 - 96 = 103\\text{ g/mol}$. Demak $n = \\frac{302{,}4 - 209{,}7}{103} = \\frac{92{,}7}{103} = 0{,}9\\text{ mol}$. Shunda $M(\\ce{BSO4}) = 209{,}7 / 0{,}9 = 233\\text{ g/mol}$, bundan $A_r(B) = 233 - 96 = 137\\text{ g/mol}$ ($\\ce{Ba}$).",
  },
  {
    id: "ms-2025-01-25-1-39",
    turi: "ochiq",
    mavzu: "Uglevodorodlar aralashmasini yondirish",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{C3H8}$, $\\ce{C2H6}$ va $\\ce{C_{x}H_{y}}$ gazlar aralashmasi to'liq yondirilganda $2{,}05\\text{ mol}$ $\\ce{CO2}$ va $2{,}4\\text{ mol}$ suv hosil bo'ldi. $\\ce{C_{x}H_{y}}$ dan hosil bo'lgan suv massasi propandan chiqqan suv massasiga, $\\ce{C_{x}H_{y}}$ dan hosil bo'lgan $\\ce{CO2}$ ning hajmiy ulushi esa etandan chiqqan $\\ce{CO2}$ ning hajmiy ulushiga teng. Agar $n(\\ce{C_{x}H_{y}}) = \\frac{n(\\ce{C2H6})}{2}$ bo'lsa, $m(\\ce{C_{x}H_{y}}) - m(\\ce{C3H8})$ qiymatini ($\\text{g}$) toping.",
    correct: "4.2",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "$n(\\ce{C3H8}) = a$, $n(\\ce{C_{x}H_{y}}) = c$, $n(\\ce{C2H6}) = 2c$ bo'lsin. Shartlar: $cx = 2(2c) = 4c \\Rightarrow x = 4$, hamda $\\frac{cy}{2} = 4a$. Jami: $\\ce{CO2}$ uchun $3a + 4c + 4c = 3a + 8c = 2{,}05$; $\\ce{H2O}$ uchun $4a + 6c + 4a = 8a + 6c = 2{,}4$. Tizimdan $c = 0{,}2\\text{ mol}$, $a = 0{,}15\\text{ mol}$, $y = \\frac{8 \\cdot 0{,}15}{0{,}2} = 6$ ($\\ce{C4H6}$, $M=54$). Farq: $0{,}2 \\cdot 54 - 0{,}15 \\cdot 44 = 10{,}8 - 6{,}6 = 4{,}2\\text{ g}$.",
  },
  {
    id: "ms-2025-01-25-1-40",
    turi: "ochiq",
    mavzu: "Metan va metanol bug'lari aralashmasini yondirish",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "O'rtacha molyar massasi $28{,}8\\text{ g/mol}$ bo'lgan metan va metanol bug'laridan iborat aralashmani to'la yondirish uchun $4{,}8\\text{ mol}$ kislorod sarflangan bo'lsa, aralashmadagi metanolning massasini ($\\text{g}$) aniqlang.",
    correct: "76.8",
    tolerance: 0.2,
    birlik: "g",
    explanation:
      "$\\ce{CH4}$ ($16$) va $\\ce{CH3OH}$ ($32$) mol nisbati: $\\frac{32 - 28{,}8}{28{,}8 - 16} = \\frac{3{,}2}{12{,}8} = 1 : 4$. $a\\text{ mol}$ metan $2a\\text{ mol}$ $\\ce{O2}$, $4a\\text{ mol}$ metanol $1{,}5 \\cdot 4a = 6a\\text{ mol}$ $\\ce{O2}$ sarflaydi. Jami $8a = 4{,}8 \\Rightarrow a = 0{,}6\\text{ mol}$. Metanol $4a = 2{,}4\\text{ mol}$, massasi: $2{,}4 \\cdot 32 = 76{,}8\\text{ g}$.",
  },
]

export default savollar
