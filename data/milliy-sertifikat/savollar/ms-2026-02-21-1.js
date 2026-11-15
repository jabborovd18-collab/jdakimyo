// 2026-yil 21-fevral, I smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "$200\\text{ g}$ $18{,}3\\%$ li natriyli $X$ tuz eritmasiga $\\ce{CO2}$ va $\\ce{SO3}$ dan iborat $10{,}2\\text{ g}$ gazlar aralashmasi yuttirilganda " +
  "$11{,}7\\text{ g}$ gelsimon cho'kma tushdi. Filtratga bariy atsetat qo'shilganda $65{,}1\\text{ g}$ cho'kmalar aralashmasi hosil bo'ldi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$0{,}15$",
  B: "$0{,}25$",
  C: "$0{,}05$",
  D: "$0{,}1$",
  E: "$0{,}2$",
  F: "$0{,}35$",
}

const savollar = [
  {
    id: "ms-2026-02-21-1-1",
    turi: "variant",
    mavzu: "Oksidlar va ishqorlar orasidagi OQR",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Quyidagi ma'lumotlarga asoslanib $A$ moddani aniqlang: $A$ — binar birikma, $X$ va $Y$ — o'rta tuzlar, $\\ce{A + KOH -> X + Y + H2O}$.",
    options: ["$\\ce{Cl2}$", "$\\ce{NO2}$", "$\\ce{ZnO}$", "$\\ce{SO2}$"],
    correct: 1,
    explanation:
      "$\\ce{Cl2}$ oddiy modda (binar emas). $\\ce{2NO2 + 2KOH -> KNO2 + KNO3 + H2O}$ reaksiyasida binar birikma $\\ce{NO2}$ dan ikkita o'rta tuz ($\\ce{KNO2}$ va $\\ce{KNO3}$) hamda suv hosil bo'ladi.",
  },
  {
    id: "ms-2026-02-21-1-2",
    turi: "variant",
    mavzu: "Benzol gomologlari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Benzol halqasidagi ikki o'rinbosar ($X$ va $Y$) o'rniga qaysi radikal yoki funksional guruhlar qo'yilsa, benzol gomologi ($\\ce{C6H4(X)(Y)}$) hosil bo'ladi?",
    options: [
      "$-\\ce{CHCl-CH3},\\ -\\ce{CH3}$",
      "$-\\ce{OH},\\ -\\ce{NO2}$",
      "$-\\ce{CH3},\\ -\\ce{C2H5}$",
      "$-\\ce{CH=CH2},\\ -\\ce{Cl}$",
    ],
    correct: 2,
    explanation:
      "Benzol gomologlari tarkibi $\\ce{C_n H_{2n-6}}$ ga bo'ysunuvchi to'yingan alkil o'rinbosarli arenlardir. Halqaga $-\\ce{CH3}$ va $-\\ce{C2H5}$ kiritilganda metiletilbenzol hosil bo'ladi.",
  },
  {
    id: "ms-2026-02-21-1-3",
    turi: "variant",
    mavzu: "Eritmalarning kolligativ xossalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Suvga nima qo'shilganda muzlash temperaturasi pasayadi ($P = \\text{const}$)?",
    options: ["sovuq suv", "muz bo'lagi", "issiq suv", "osh tuzi"],
    correct: 3,
    explanation:
      "Suvga uchmaydigan eruvchi modda (masalan, osh tuzi — $\\ce{NaCl}$) qo'shilganda krioskopik qonunga ko'ra eritmaning muzlash temperaturasi $0^\\circ\\text{C}$ dan pastga tushadi.",
  },
  {
    id: "ms-2026-02-21-1-4",
    turi: "variant",
    mavzu: "Kimyoviy moddalarning qo'llanilishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Moddalarni ($a$–$d$) ishlatilish sohalari ($1$–$8$) bilan juftlang:\n" +
      "$a)\\ \\ce{Cl2};\\ b)\\ \\ce{NH3};\\ c)$ osh tuzi; $d)\\ \\ce{S}$.\n" +
      "$1)$ matolarni oqartirish; $2)$ vulkanlash; $3)$ gugurt ishlab chiqarish; $4)$ nitrat kislota olish; $5)$ ichimlik suvlarini tozalash; $6)$ qishloq xo'jaligida o'simliklarni oziqlantirish; $7)$ soda ishlab chiqarish; $8)$ konservalash.",
    options: [
      "$a$-1, 5; $b$-4, 6; $c$-7, 8; $d$-2, 3",
      "$a$-1, 5; $b$-4, 7; $c$-6, 8; $d$-2, 3",
      "$a$-1, 5; $b$-4, 6; $c$-2, 8; $d$-3, 7",
      "$a$-1, 4; $b$-5, 6; $c$-7, 8; $d$-2, 3",
    ],
    correct: 0,
    explanation:
      "Xlor ($1, 5$), ammiak ($4, 6$ — $\\ce{HNO3}$ va o'g'itlar), osh tuzi ($7, 8$ — Solve usulida soda va konservalash), oltingugurt ($2, 3$ — kauchuk vulkanlash va gugurt).",
  },
  {
    id: "ms-2026-02-21-1-5",
    turi: "variant",
    mavzu: "Peptidlar hosil bo'lishi va amfoterlik",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$X$ aminokislota tetrapolimerlanganda (tetrapeptid hosil bo'lganda) massasi $18\\%$ ga kamaydi. $X$ aminokislotaning $\\ce{HBr}$ bilan reaksiyasidan hosil bo'lgan organik moddaning molyar massasini ($\\text{g/mol}$) toping.",
    options: ["$180$", "$156$", "$155$", "$175$"],
    correct: 1,
    explanation:
      "$4$ ta aminokislotadan tetrapeptid olinishida $3$ mol suv ($54\\text{ g}$) ajraladi: $54 / (4M) = 0{,}18 \\Rightarrow M = 75\\text{ g/mol}$ (glitsin). $\\ce{HBr}$ ($81$) bilan hosil bo'lgan tuz massasi: $75 + 81 = 156\\text{ g/mol}$.",
  },
  {
    id: "ms-2026-02-21-1-6",
    turi: "variant",
    mavzu: "Klechkovskiy qoidasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Energetik pog'onachalarning elektronlar bilan to'lib borish ketma-ketligi to'g'ri berilgan javobni aniqlang.",
    options: [
      "$4d, 5s, 5p, 6s, 4f$",
      "$5s, 4d, 5p, 6s, 4f$",
      "$5s, 4d, 5p, 4f, 6s$",
      "$5s, 5p, 4d, 4f, 6s$",
    ],
    correct: 1,
    explanation:
      "Klechkovskiy qoidasiga ($n+l$) ko'ra: $5s\\ (5+0=5) < 4d\\ (4+2=6) < 5p\\ (5+1=6) < 6s\\ (6+0=6) < 4f\\ (4+3=7)$.",
  },
  {
    id: "ms-2026-02-21-1-7",
    turi: "variant",
    mavzu: "Elementlarning elektron formulasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Qaysi elementning qo'zg'almagan holatda tashqi $p$-pog'onachasida $3$ ta toq elektroni mavjud?",
    options: ["mishyak", "temir", "alyuminiy", "xlor"],
    correct: 0,
    explanation:
      "Mishyak ($\\ce{As}$, $4s^2 4p^3$) ning tashqi $4p$-pog'onachasida Hund qoidasi bo'yicha $3$ ta toq elektron joylashgan.",
  },
  {
    id: "ms-2026-02-21-1-8",
    turi: "variant",
    mavzu: "Kristall panjara va koordinatsion son",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Kristall oksid tuzilishi o'rganilganda $X$ atomlari atrofida oktaedrik $\\ce{XO6}$ va kislorod atrofida tetraedrik $\\ce{OX4}$ koordinatsion tuzilish borligi aniqlandi. Shu oksid formulasini toping.",
    options: [
      "$\\ce{Al2O3}$",
      "$\\ce{CrO3}$",
      "$\\ce{MnO2}$",
      "$\\ce{Fe3O4}$",
    ],
    correct: 0,
    explanation:
      "Har bir $X$ atomiga $6$ ta kislorod, har bir kislorod atomiga $4$ ta $X$ to'g'ri kelsa, atomlar nisbati $N(X):N(\\text{O}) = 4:6 = 2:3$ bo'ladi. Bu korund ($\\ce{Al2O3}$) tuzilishiga mos.",
  },
  {
    id: "ms-2026-02-21-1-9",
    turi: "variant",
    mavzu: "Massa ulushi hisoblashlari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Quyidagilarning qaysi birida oltingugurtning massa ulushi xato ko'rsatilgan?",
    options: [
      "$M_r = 96;\\ \\omega(\\text{S}) = 1/3$",
      "$M_r = 98;\\ \\omega(\\text{S}) = 16/49$",
      "$M_r = 126;\\ \\omega(\\text{S}) = 16/63$",
      "$M_r = 120;\\ \\omega(\\text{S}) = 1/6$",
    ],
    correct: 3,
    explanation:
      "Oltingugurt massasi $32\\cdot k$ ko'rinishida bo'ladi: $32/96 = 1/3$, $32/98 = 16/49$, $32/126 = 16/63$. $M_r = 120$ da esa $120\\cdot (1/6) = 20\\text{ g}$, bu $\\text{S}$ atom massasi ($32$) ga karrali emas.",
  },
  {
    id: "ms-2026-02-21-1-10",
    turi: "variant",
    mavzu: "Muvozanat konstantasi ($K_M$)",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$\\ce{2SO2 + O2 <=> 2SO3}$ reaksiyasi uchun $1\\text{ litr}$ li idishga $8\\text{ mol }\\ce{SO2}$ va $4\\text{ mol }\\ce{O2}$ olindi. Muvozanat qaror topgandan so'ng $\\ce{SO2}$ ning $20\\%$ i qoldi. Muvozanat konstantasini ($K_M$) toping.",
    options: ["$4$", "$20$", "$5$", "$16$"],
    correct: 1,
    explanation:
      "Qolgan $[\\ce{SO2}] = 8\\cdot 0{,}2 = 1{,}6\\text{ mol/l}$, sarflangan $= 6{,}4\\text{ mol/l}$. Demak, $[\\ce{O2}] = 4 - 3{,}2 = 0{,}8\\text{ mol/l}$, $[\\ce{SO3}] = 6{,}4\\text{ mol/l}$. $K_M = 6{,}4^2 / (1{,}6^2 \\cdot 0{,}8) = 16 / 0{,}8 = 20$.",
  },
  {
    id: "ms-2026-02-21-1-11",
    turi: "variant",
    mavzu: "Kuchsiz elektrolit dissotsilanishi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$0{,}4\\%$ li $1000\\text{ g}$ ftorid kislota eritmasidagi $\\ce{H+}$ ionlari miqdorini ($\\text{mol}$) toping ($\\alpha = 2\\%$).",
    options: ["$0{,}002$", "$0{,}004$", "$0{,}008$", "$0{,}016$"],
    correct: 1,
    explanation:
      "$n(\\ce{HF}) = (1000\\cdot 0{,}004)/20 = 0{,}2\\text{ mol}$. Dissotsilanish darajasi $\\alpha = 0{,}02$ bo'lgani uchun $n(\\ce{H+}) = 0{,}2 \\cdot 0{,}02 = 0{,}004\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-1-12",
    turi: "variant",
    mavzu: "Molekula qutbliligi va gibridlanish",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Quyidagilarning qaysi birlari to'g'ri?\n" +
      "$1)$ $\\ce{CS2, SF6, FCl, CCl4}$ molekulalari orasida $\\ce{FCl}$ qutbli molekula hisoblanadi;\n" +
      "$2)$ $\\ce{H2O}$ molekulasiga nisbatan $\\ce{H2S}$ termik barqarorroq;\n" +
      "$3)$ sof ketonlar molekulalari orasida vodorod bog' mavjud;\n" +
      "$4)$ benzol tarkibidagi barcha uglerod atomlari $sp^2$ gibridlangan.",
    options: ["$1, 2$", "$2, 3$", "$1, 4$", "$2, 4$"],
    correct: 2,
    explanation:
      "$\\ce{CS2}$ (chiziqli), $\\ce{SF6}$ (oktaedrik) va $\\ce{CCl4}$ (tetraedrik) simmetrik qutbsiz molekulalar, $\\ce{FCl}$ esa dipol momentiga ega qutbli molekula ($1$). Benzolda barcha $\\text{C}$ atomlari $sp^2$ holatda ($4$).",
  },
  {
    id: "ms-2026-02-21-1-13",
    turi: "variant",
    mavzu: "Metallar aralashmasining oksidlanishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$42{,}8\\text{ g}$ temir va noma'lum II valentli metal aralashmasi kislorodda yondirilganda massasi $12{,}8\\text{ g}$ ga ortdi. Xuddi shu aralashma $\\ce{HCl}$ kislota bilan ta'sirlashganda $0{,}7\\text{ mol}$ gaz ajraldi. Noma'lum metalni toping.",
    options: ["$\\ce{Zn}$", "$\\ce{Fe}$", "$\\ce{Cu}$", "$\\ce{Cr}$"],
    correct: 0,
    explanation:
      "$n(\\text{Fe} + \\text{Me}) = 0{,}7\\text{ mol}$, $\\bar{M} = 42{,}8/0{,}7 = 61{,}14\\text{ g/mol}$. Rux ($65$) bilan $56x + 65(0{,}7-x) = 42{,}8 \\Rightarrow x = 0{,}3\\text{ mol }\\ce{Fe}$, $y = 0{,}4\\text{ mol }\\ce{Zn}$. Tekshirish: $\\ce{0,1Fe3O4 + 0,4ZnO}$ uchun $m(\\text{O}) = (0{,}4+0{,}4)\\cdot 16 = 12{,}8\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-14",
    turi: "variant",
    mavzu: "Anilin eritmalarida kislota-asos reaksiyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$15{,}5\\text{ g}$ anilin toluolda eritildi va bu eritmaga $\\ce{HBr}$ yuttirildi (hosil bo'lgan tuz cho'kmaga tushdi). Natijada $200\\text{ g}$ $3{,}1\\%$ li anilin eritmasi qoldi. Eritmadan o'tkazilgan $\\ce{HBr}$ massasini ($\\text{g}$) aniqlang.",
    options: ["$8{,}1$", "$16{,}2$", "$32{,}4$", "$22{,}4$"],
    correct: 0,
    explanation:
      "Dastlabki anilin: $15{,}5/93 = 1/6\\text{ mol}$. Oxirgi eritmada qolgan anilin: $200\\cdot 0{,}031 = 6{,}2\\text{ g} = 1/15\\text{ mol}$. Reaksiyaga kirishgan anilin: $1/6 - 1/15 = 0{,}1\\text{ mol}$. Sarflangan $\\ce{HBr}$: $0{,}1 \\cdot 81 = 8{,}1\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-15",
    turi: "variant",
    mavzu: "Fosfor allotropiyasi va birikmalari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$X\\text{ g}$ oq fosfor kalsiy bilan to'liq reaksiyaga kirishib kalsiy fosfid hosil qildi. $X\\text{ g}$ qizil fosfor esa $\\ce{KClO3}$ bilan to'liq reaksiyaga kirishib fosfor(V) oksid hosil qildi. Hosil bo'lgan fosforli birikmalar massalari farqi $24\\text{ g}$ bo'lsa, $X$ ni toping.",
    options: ["$62$", "$37{,}2$", "$64{,}4$", "$20$"],
    correct: 1,
    explanation:
      "$1\\text{ mol }\\ce{P}$ dan $0{,}5\\text{ mol }\\ce{Ca3P2}$ ($182/2 = 91\\text{ g}$) yoki $0{,}5\\text{ mol }\\ce{P2O5}$ ($142/2 = 71\\text{ g}$) olinadi. $1\\text{ mol }\\ce{P}$ dagi massa farqi $91 - 71 = 20\\text{ g}$. $n(\\text{P}) = 24/20 = 1{,}2\\text{ mol}$, $X = 1{,}2 \\cdot 31 = 37{,}2\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-16",
    turi: "variant",
    mavzu: "Uglevodlar va aldegidlar sifat reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Quyidagi moddalardan NECHTASI «kumush ko'zgu» reaksiyasiga kirishadi?\n" +
      "$1)$ glukoza; $2)$ fruktoza; $3)$ maltoza; $4)$ tregaloza; $5)$ riboza; $6)$ chumoli kislota; $7)$ laktoza; $8)$ saxaroza.",
    options: ["$4$", "$5$", "$3$", "$6$"],
    correct: 1,
    explanation:
      "Aldegid guruhiga ega qaytaruvchi qandlar ($1$-glukoza, $3$-maltoza, $5$-riboza, $7$-laktoza) hamda $6$-chumoli kislota «kumush ko'zgu» reaksiyasiga kirishadi — jami $5$ ta. Fruktoza (ketoza), tregaloza va saxaroza (qaytarmaydigan disaxaridlar) kirishmaydi.",
  },
  {
    id: "ms-2026-02-21-1-17",
    turi: "variant",
    mavzu: "Kimyoviy kinetika: o'rtacha tezlik",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{CO + H2O <=> CO2 + H2}$ reaksiyasining tezligi $0{,}025\\text{ mol/(l}\\cdot\\text{s)}$ ga teng. $4\\text{ minut}$ dan keyin $1\\text{ litr}$ hajmda $\\ce{H2O}$ miqdori $2{,}8\\text{ mol}$ ni tashkil qildi. Suvning dastlabki miqdorini ($\\text{mol}$) toping.",
    options: ["$8{,}8$", "$9{,}9$", "$4$", "$6$"],
    correct: 0,
    explanation:
      "$4\\text{ min} = 240\\text{ s}$. Sarflangan suv: $0{,}025 \\cdot 240 = 6{,}0\\text{ mol}$. Dastlabki miqdor: $6{,}0 + 2{,}8 = 8{,}8\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-1-18",
    turi: "variant",
    mavzu: "Organik reaksiyalarning turlari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Reaksiya turlarini moslang:\n" +
      "$1)\\ \\ce{CH2=CH-CH=CH2 -> (-CH2-CH=CH-CH2-)_n}$;\n" +
      "$2)$ normal butan $\\rightarrow$ izobutan;\n" +
      "$3)$ benzol $+\\ \\ce{Cl2 ->}$ xlorbenzol $+\\ \\ce{HCl}$;\n" +
      "$4)$ etil spirti $\\rightarrow\\ \\ce{C2H4 + H2O}$.\n" +
      "$a)$ parchalanish (degidratatsiya); $b)$ izomerlanish; $c)$ birikish (polimerlanish); $d)$ o'rin olish.",
    options: [
      "$1$b; $2$c; $3$d; $4$a",
      "$1$c; $2$a; $3$d; $4$d",
      "$1$c; $2$b; $3$d; $4$a",
      "$1$c; $2$d; $3$b; $4$a",
    ],
    correct: 2,
    explanation:
      "$1)$ Polimerlanish (birikish, $c$); $2)$ izomerlanish ($b$); $3)$ galogenlanish (o'rin olish, $d$); $4)$ degidratatsiya (parchalanish, $a$).",
  },
  {
    id: "ms-2026-02-21-1-19",
    turi: "variant",
    mavzu: "Reaksiya unumi va texnik kalsiy karbid",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Tarkibida $20\\%$ qo'shimcha saqlagan $32\\text{ g}$ $\\ce{CaC2}$ ga suv bilan ishlov berilganda $6{,}72\\text{ l}$ gaz (n.sh.) ajraldi. Reaksiya unumini ($\\%$) toping.",
    options: ["$75$", "$25$", "$33{,}3$", "$26{,}5$"],
    correct: 0,
    explanation:
      "Sof $\\ce{CaC2}$: $32\\cdot 0{,}8 = 25{,}6\\text{ g} = 0{,}4\\text{ mol}$. Nazariy $0{,}4\\text{ mol }\\ce{C2H2}$, amaliy $6{,}72/22{,}4 = 0{,}3\\text{ mol}$. Unum: $(0{,}3/0{,}4)\\cdot 100\\% = 75\\%$.",
  },
  {
    id: "ms-2026-02-21-1-20",
    turi: "variant",
    mavzu: "Elektrolitlar kuchi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Moddalar orasidan qaysi biri suvda ionlarga yaxshi ajraladi?",
    options: ["$\\ce{NaBr}$", "$\\ce{FeS}$", "$\\ce{BaSO4}$", "$\\ce{H2O}$"],
    correct: 0,
    explanation:
      "Natriy bromid ($\\ce{NaBr}$) suvda yaxshi eriydigan ionli tuz bo'lib, kuchli elektrolitdir. $\\ce{FeS}$ va $\\ce{BaSO4}$ amalda erimaydi, $\\ce{H2O}$ esa kuchsiz elektrolit.",
  },
  {
    id: "ms-2026-02-21-1-21",
    turi: "variant",
    mavzu: "Eritma massa ulushi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "Tarkibida erimaydigan qo'shimcha saqlagan $0{,}1\\text{ kg}$ osh tuzi $0{,}24\\text{ kg}$ suvda eritilganda $25\\%$ li $\\ce{NaCl}$ eritmasi hosil bo'ldi. Osh tuzi tarkibidagi qo'shimchaning massasini ($\\text{g}$) toping.",
    options: ["$15$", "$24$", "$20$", "$18$"],
    correct: 2,
    explanation:
      "$x / (x + 240) = 0{,}25 \\Rightarrow x = 80\\text{ g}$ sof $\\ce{NaCl}$. Qo'shimcha massasi: $100 - 80 = 20\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-22",
    turi: "variant",
    mavzu: "Reaksiyalar tasnifi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Ham birikish, ham oksidlanish-qaytarilish bo'lgan reaksiyani toping.",
    options: [
      "$\\ce{BaO + H2O = Ba(OH)2}$",
      "$\\ce{FeSO4 + Zn = Fe + ZnSO4}$",
      "$\\ce{C + O2 = CO2}$",
      "$\\ce{CaCO3 = CaO + CO2}$",
    ],
    correct: 2,
    explanation:
      "$\\ce{C + O2 = CO2}$ reaksiyasida ikkita modda bitta mahsulotga birikadi va uglerod ($0 \\rightarrow +4$) hamda kislorod ($0 \\rightarrow -2$) oksidlanish darajalari o'zgaradi.",
  },
  {
    id: "ms-2026-02-21-1-23",
    turi: "variant",
    mavzu: "Tuzlarning eruvchanligi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$125\\text{ g}$ dan $20\\%$ li $\\ce{Na2SO4}$ ($1$-idish, eruvchanlik $30\\text{ g}/100\\text{ g }\\ce{H2O}$) va $\\ce{KNO3}$ ($2$-idish, eruvchanlik $38\\text{ g}/100\\text{ g }\\ce{H2O}$) eritmalari mavjud. Har bir idishga tegishli tuzdan $5\\text{ g}$ dan qo'shilsa, qaysi ma'lumotlar to'g'ri?\n" +
      "$1)$ $1$-idishda to'yingan eritma hosil bo'ladi;\n" +
      "$2)$ $2$-idishda to'yinmagan eritma hosil bo'ladi;\n" +
      "$3)$ $2$-idishda o'ta to'yingan eritma hosil bo'ladi;\n" +
      "$4)$ $1$-idishda to'yinmagan eritma hosil bo'ladi.",
    options: ["$1, 2$", "$2, 3$", "$2, 4$", "$1, 4$"],
    correct: 0,
    explanation:
      "$125\\text{ g}$ $20\\%$ li eritmada $25\\text{ g}$ tuz va $100\\text{ g}$ suv bor. $+5\\text{ g}$ qo'shilganda $30\\text{ g}/100\\text{ g }\\ce{H2O}$ bo'ladi: $\\ce{Na2SO4}$ to'yinadi ($1$), $\\ce{KNO3}$ ($30 < 38$) esa to'yinmagan qoladi ($2$).",
  },
  {
    id: "ms-2026-02-21-1-24",
    turi: "variant",
    mavzu: "Nitratlarning termik parchalanishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$X$ tuzga sulfat kislota qo'shilganda yorug'lik va issiqlik ta'sirida tez parchalanadigan o'tkir hidli suyuqlik hosil bo'ldi; u parchalanganda rangsiz hidsiz $A$ gaz, qo'ng'ir rangli zaharli $B$ gaz va suv hosil bo'ldi. $X$ tuzning o'zi qizdirib parchalanganda $A$ gaz, $B$ gaz va qora qoldiq hosil bo'ldi. $X$ ni toping.",
    options: [
      "$\\ce{Zn(NO3)2}$",
      "$\\ce{Cu(NO3)2}$",
      "$\\ce{Cr(NO3)2}$",
      "$\\ce{FeS2}$",
    ],
    correct: 1,
    explanation:
      "O'tkir hidli suyuqlik — $\\ce{HNO3}$ ($A = \\ce{O2}$, $B = \\ce{NO2}$). Termik parchalanganda qora $\\ce{CuO}$ qoldig'i bilan $\\ce{O2}$ va $\\ce{NO2}$ beradigan tuz $\\ce{Cu(NO3)2}$ dir.",
  },
  {
    id: "ms-2026-02-21-1-25",
    turi: "variant",
    mavzu: "Birlamchi spirtlar va oksidlanish aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Birlamchi spirt oksidlanganda spirt, aldegid va karbon kislota $1:2:3$ mol nisbatda bo'lgan $24{,}1\\text{ g}$ aralashma hosil bo'ldi. Shu aralashmaga $\\ce{NaHCO3}$ qo'shilganda $6{,}6\\text{ g}$ $\\ce{CO2}$ ajraldi. Dastlabki spirtni toping.",
    options: [
      "butanol-$2$",
      "butanol-$1$",
      "$2$-metilpropanol-$2$",
      "propanol-$1$",
    ],
    correct: 1,
    explanation:
      "$n(\\text{kislota}) = n(\\ce{CO2}) = 6{,}6/44 = 0{,}15\\text{ mol}$. Nisbatdan: $0{,}05\\text{ mol}$ spirt ($M$), $0{,}10\\text{ mol}$ aldegid ($M-2$), $0{,}15\\text{ mol}$ kislota ($M+14$). $0{,}30M + 1{,}9 = 24{,}1 \\Rightarrow M = 74$ ($\\ce{C4H9OH}$). Variantlar orasidagi yagona birlamchi $\\ce{C4}$ spirt — butanol-$1$.",
  },
  {
    id: "ms-2026-02-21-1-26",
    turi: "variant",
    mavzu: "Spirtlarning oksidlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$30\\text{ g}$ to'yingan bir atomli spirtning $80\\%$ qismi kislotagacha oksidlandi. Hosil bo'lgan karbon kislotaga rux qo'shilganda $4{,}48\\text{ l}$ (n.sh.) gaz ajralgan bo'lsa, spirt formulasini toping.",
    options: [
      "$\\ce{C4H10O}$",
      "$\\ce{C3H8O}$",
      "$\\ce{C2H6O}$",
      "$\\ce{C5H12O}$",
    ],
    correct: 1,
    explanation:
      "$0{,}2\\text{ mol }\\ce{H2}$ ajralishi uchun $0{,}4\\text{ mol}$ karbon kislota kerak. Dastlabki spirt: $0{,}4 / 0{,}8 = 0{,}5\\text{ mol}$. Molyar massasi: $M = 30/0{,}5 = 60\\text{ g/mol}$ — bu propanol ($\\ce{C3H8O}$).",
  },
  {
    id: "ms-2026-02-21-1-27",
    turi: "variant",
    mavzu: "Toluolning bromlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$55{,}2\\text{ g}$ toluolga brom qo'shilganda $2:1$ mol nisbatda $2,4$-dibromtoluol va $2$-bromtoluol hosil bo'ldi. Hosil bo'lgan gazsimon $\\ce{HBr}$ ni neytrallash uchun $20\\%$ li $\\ce{NaOH}$ ($\\rho = 1{,}25\\text{ g/ml}$) eritmasidan necha $\\text{ml}$ kerak bo'ladi?",
    options: ["$160$", "$80$", "$240$", "$120$"],
    correct: 0,
    explanation:
      "$0{,}6\\text{ mol}$ toluol ($0{,}4\\text{ mol}$ dibrom + $0{,}2\\text{ mol}$ monobrom) dan $0{,}4\\cdot 2 + 0{,}2 = 1{,}0\\text{ mol }\\ce{HBr}$ chiqadi. $40\\text{ g }\\ce{NaOH} \\rightarrow 200\\text{ g}$ $20\\%$ li eritma $= 200/1{,}25 = 160\\text{ ml}$.",
  },
  {
    id: "ms-2026-02-21-1-28",
    turi: "variant",
    mavzu: "Dixromat bilan oksidlash",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$1{,}2\\text{ mol }\\ce{FeSO4}$ kislotali muhitda ($\\ce{K2Cr2O7 + H2SO4}$) oksidlovchi bilan to'liq ta'sirlashganda necha gramm $\\ce{Cr2(SO4)3}$ hosil bo'ladi?",
    options: ["$78{,}4$", "$24{,}6$", "$56{,}6$", "$24{,}4$"],
    correct: 0,
    explanation:
      "$\\ce{6FeSO4 + K2Cr2O7 + 7H2SO4 -> 3Fe2(SO4)3 + Cr2(SO4)3 + K2SO4 + 7H2O}$. $n(\\ce{Cr2(SO4)3}) = 1{,}2/6 = 0{,}2\\text{ mol}$, $m = 0{,}2 \\cdot 392 = 78{,}4\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-29",
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "$\\ce{NO2 + 2HI ->}$ reaksiyasining mahsulotlarini ko'rsating.",
    options: [
      "$\\ce{NO + I2 + H2O}$",
      "$\\ce{NH3 + I2}$",
      "$\\ce{N2 + I2 + H2O}$",
      "$\\ce{NH4I + H2O}$",
    ],
    correct: 0,
    explanation:
      "Tenglama $1:2$ mol nisbatda $\\ce{NO2 + 2HI -> NO + I2 + H2O}$ shaklida boradi: azot $+4$ dan $+2$ gacha qaytariladi, yod $-1$ dan $0$ gacha oksidlanadi.",
  },
  {
    id: "ms-2026-02-21-1-30",
    turi: "variant",
    mavzu: "Alkanlarning olinish usullari",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Qaysi moddadan bir bosqichda etan olib bo'lmaydi?",
    options: ["propan kislota", "brometan", "etandiol", "etilen"],
    correct: 2,
    explanation:
      "Etilendan gidrogenlab, brometandan qaytarib ($\\ce{Zn + HCl}$), propan kislota dekarboksillanishidan etan olish mumkin; ikki atomli spirt etandioldan esa bir bosqichda etan olinmaydi.",
  },
  {
    id: "ms-2026-02-21-1-31",
    turi: "variant",
    mavzu: "Laboratoriya jihozlari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-21-1/savol-31.png",
    question: "Rasmda tasvirlangan laboratoriya apparati nomini aniqlang.",
    options: [
      "ajratish voronkasi",
      "Kiryushkin apparati",
      "ozonator",
      "Kipp apparati",
    ],
    correct: 1,
    explanation:
      "Teshikli tutqichga ega yon naychali probirka va voronkadan iborat kichik hajmda gaz olish qurilmasi Kiryushkin apparati deyiladi.",
  },
  {
    id: "ms-2026-02-21-1-32",
    turi: "variant",
    mavzu: "Gravimetrik tahlil",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "Gravimetrik usulda tekshirilayotgan $\\ce{Ba^{2+}}$ ioni erimaydigan cho'kmaga aylantiriladi. Ushbu ion quyidagi tuzlardan qaysi biri bilan cho'ktirilganda hosil bo'lgan cho'kma tarkibida bariyning massa ulushi eng kam bo'ladi?",
    options: [
      "$\\ce{Na2CO3}$",
      "$\\ce{K2CrO4}$",
      "$\\ce{CuSO4}$",
      "$\\ce{Na2SO3}$",
    ],
    correct: 1,
    explanation:
      "Cho'kmalar molyar massalari: $\\ce{BaCO3}$ ($197$), $\\ce{BaSO3}$ ($217$), $\\ce{BaSO4}$ ($233$), $\\ce{BaCrO4}$ ($253$). Bariy ($137$) ulushi eng og'ir cho'kma $\\ce{BaCrO4}$ da ($137/253 \\approx 54{,}15\\%$) eng kichik bo'ladi.",
  },
  {
    id: "ms-2026-02-21-1-33",
    turi: "moslashtirish",
    mavzu: "Silikatlar va kislotali oksidlar reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. Filtratdagi qolgan $X$ tuzning miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "Gelsimon cho'kma $\\ce{H2SiO3}$ ($11{,}7/78 = 0{,}15\\text{ mol}$), demak $X = \\ce{Na2SiO3}$ ($200\\cdot 0{,}183 = 36{,}6\\text{ g} = 0{,}30\\text{ mol}$). Reaksiyaga $0{,}15\\text{ mol}$ kirishib, filtratda $0{,}30 - 0{,}15 = 0{,}15\\text{ mol }\\ce{Na2SiO3}$ qoladi (A).",
  },
  {
    id: "ms-2026-02-21-1-34",
    turi: "moslashtirish",
    mavzu: "Gazlar aralashmasini yuttirish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Hosil bo'lgan eritmadagi $\\ce{Na2SO4}$ miqdorini ($\\text{mol}$) aniqlang.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "$a + b = 0{,}15$ ($\\text{mol}$) va $44a + 80b = 10{,}2 \\Rightarrow 36b = 3{,}6 \\Rightarrow b = n(\\ce{SO3}) = n(\\ce{Na2SO4}) = 0{,}1\\text{ mol}$ (D).",
  },
  {
    id: "ms-2026-02-21-1-35",
    turi: "moslashtirish",
    mavzu: "Karbonat va silikatlar aralashmasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "35. Hosil bo'lgan eritmadagi $\\ce{Na2CO3}$ miqdorini ($\\text{mol}$) aniqlang.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "$a = n(\\ce{CO2}) = 0{,}15 - 0{,}1 = 0{,}05\\text{ mol}$, ya'ni $0{,}05\\text{ mol }\\ce{Na2CO3}$ hosil bo'lgan (C). Tekshirish: $0{,}15\\cdot 213 + 0{,}1\\cdot 233 + 0{,}05\\cdot 197 = 65{,}1\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-1-36",
    turi: "ochiq",
    mavzu: "Yarim reaksiya usuli bilan tenglash",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Quyidagi oksidlanish-qaytarilish reaksiyasini yarim reaksiya usulida tenglang va barcha koeffitsiyentlar yig'indisini toping:\n" +
      "$\\ce{P2S3 + HNO3 -> H3PO4 + SO2 + NO2 + H2O}$",
    correct: "58",
    tolerance: 0,
    birlik: "yig'indi",
    explanation:
      "Oksidlanish: $\\ce{P2S3 + 14H2O -> 2H3PO4 + 3SO2 + 22H+ + 22e-}$. Qaytarilish: $\\ce{NO3- + 2H+ + e- -> NO2 + H2O}$ (×22). To'liq tenglama: $\\ce{P2S3 + 22HNO3 -> 2H3PO4 + 3SO2 + 22NO2 + 8H2O}$. Yig'indi: $1 + 22 + 2 + 3 + 22 + 8 = 58$.",
  },
  {
    id: "ms-2026-02-21-1-37",
    turi: "ochiq",
    mavzu: "Eritmalarni suyultirish va molyar konsentratsiya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Temir(II) nitrat eritmasiga suv qo'shilganda ($\\rho = 1\\text{ g/ml}$) eritma massasi $2$ marta, hajmi esa $2{,}25$ marta ortdi. Hosil bo'lgan eritmada nitrat ionlarining molyar konsentratsiyasi $2\\text{ mol/l}$ ga teng bo'ldi. Dastlabki eritmadagi $\\ce{Fe(NO3)2}$ massa ulushini ($\\%$) toping.",
    correct: "32.4",
    tolerance: 0.1,
    birlik: "%",
    explanation:
      "Dastlab $100\\text{ g}$ eritma va $V_1$ hajm olaylik; $100\\text{ g} = 100\\text{ ml}$ suv qo'shilganda $2{,}25V_1 - V_1 = 100 \\Rightarrow V_1 = 80\\text{ ml}$, $V_2 = 180\\text{ ml}$. $[\\ce{Fe(NO3)2}] = 2/2 = 1\\text{ M} \\Rightarrow n = 0{,}18\\text{ mol}$, $m = 0{,}18 \\cdot 180 = 32{,}4\\text{ g}$, ya'ni $32{,}4\\%$.",
  },
  {
    id: "ms-2026-02-21-1-38",
    turi: "ochiq",
    mavzu: "Ishqoriy metallarning peroksid va superoksidlari",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "I guruh ishqoriy metallning molekulasida $1$ ta metall atomi saqlovchi binar birikmasining $44\\text{ g}$ miqdoriga $\\ce{CO2}$ qo'shildi. Ajralgan kislorod qizdirilgan mis naychadan o'tkazilganda naycha massasi $19{,}2\\text{ g}$ ga ortdi. Ushbu binar birikmaning molyar massasini ($\\text{g/mol}$) toping.",
    correct: "55",
    tolerance: 0.2,
    birlik: "g/mol",
    explanation:
      "$n(\\ce{O2}) = 19{,}2/32 = 0{,}6\\text{ mol}$. $\\ce{4MO2 + 2CO2 -> 2M2CO3 + 3O2}$ ga ko'ra $n(\\ce{MO2}) = 0{,}6 \\cdot 4/3 = 0{,}8\\text{ mol}$. Molyar massasi: $M = 44/0{,}8 = 55\\text{ g/mol}$ ($\\ce{NaO2}$, $A_r(\\ce{Na}) = 23$).",
  },
  {
    id: "ms-2026-02-21-1-39",
    turi: "ochiq",
    mavzu: "Metan konversiyasi va gazlar aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Metan konversiyasida $\\ce{H2}$, $\\ce{CO}$, $\\ce{CO2}$, $\\ce{C2H2}$, $\\ce{CH4}$ va suv bug'lari hosil bo'ldi, bunda $n(\\ce{CO}) = n(\\ce{H2O})$, $n(\\ce{CO2}) = n(\\ce{C2H2})$ va $n(\\ce{CO}) = 3\\,n(\\ce{CO2})$. Suv bug'lari kondensatsiyalangandan so'ng quruq gaz aralashmasining o'rtacha molyar massasi $14\\text{ g/mol}$ chiqdi. Metanning necha foizi ($\\%$) parchalangan?",
    correct: "50",
    tolerance: 0.1,
    birlik: "%",
    explanation:
      "$n(\\ce{CO2}) = 1$, $n(\\ce{C2H2}) = 1$, $n(\\ce{CO}) = 3$, $n(\\ce{H2O}) = 3\\text{ mol}$ desak, $6\\text{ mol}$ $\\ce{CH4}$ parchalangan va $8\\text{ mol}$ $\\ce{H2}$ hosil bo'lgan. Ortiqcha $\\ce{CH4}$ ($x$) bilan: $(170 + 16x)/(13 + x) = 14 \\Rightarrow x = 6\\text{ mol}$. Parchalangan ulush: $6/(6+6)\\cdot 100\\% = 50\\%$.",
  },
  {
    id: "ms-2026-02-21-1-40",
    turi: "ochiq",
    mavzu: "Formalin eritmasi konsentratsiyasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Formaldegidning suvdagi eritmasi $1:3$ massa nisbatda ikki qismga bo'lindi. Birinchi qismga natriy qo'shilganda $0{,}5\\text{ mol}$ gaz ajraldi. Ikkinchi qismga kumush oksidining ammiakdagi eritmasi qo'shilganda $4{,}8\\text{ mol}$ cho'kma ajraldi. Dastlabki formaldegid eritmasining foiz konsentratsiyasini ($\\%$) aniqlang.",
    correct: "40",
    tolerance: 0.1,
    birlik: "%",
    explanation:
      "$1$-qismdagi suv $n(\\ce{H2O}) = 2 \\cdot 0{,}5 = 1{,}0\\text{ mol}$ ($18\\text{ g}$). $2$-qism ($3$ marta katta) da $54\\text{ g}$ suv bor. $1\\text{ mol}$ $\\ce{HCHO}$ dan $4\\text{ mol}$ $\\ce{Ag}$ tushadi: $n(\\ce{HCHO}) = 4{,}8/4 = 1{,}2\\text{ mol} = 36\\text{ g}$. Konsentratsiya: $36/(36+54)\\cdot 100\\% = 40\\%$.",
  },
]

export default savollar
