// 2024-yil 22-sentabr (Aprobatsiya) — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Sxemadagi o'zgarishlar zanjiri bo'yicha $X$ modda — alkin, $T$ modda esa birlamchi spirtdir."

const MOSLASHTIRISH_KONTEKST_RASM_33_35 =
  "/images/ms/ms-2024-09-22/kontekst-33-35.png"

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$8$",
  B: "$9$",
  C: "$10$",
  D: "$11$",
  E: "$12$",
  F: "$13$",
}

const savollar = [
  {
    id: "ms-2024-09-22-1",
    turi: "variant",
    mavzu: "Modda miqdori va Avogadro soni",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$0{,}2\\text{ mol}$ natriy tetragidroksoalyuminat ($\\ce{Na[Al(OH)4]}$) tarkibidagi jami atomlar sonini toping.",
    options: [
      "$2 \\cdot N_A$",
      "$12{,}04 \\cdot 10^{24}$",
      "$10\\text{ mol}$",
      "$10$",
    ],
    correct: 0,
    explanation:
      "$\\ce{Na[Al(OH)4]}$ ning $1$ formula birligida $1\\text{ Na} + 1\\text{ Al} + 4\\text{ O} + 4\\text{ H} = 10$ ta atom bor. $0{,}2\\text{ mol}$ kompleks tuzda jami atomlar soni $0{,}2 \\cdot 10 \\cdot N_A = 2 \\cdot N_A$ ga teng.",
  },
  {
    id: "ms-2024-09-22-2",
    turi: "variant",
    mavzu: "Gazlar aralashmasining molyar massasi va moddalar xossalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Quyidagi fikrlardan to'g'rilarini aniqlang:\n" +
      "$1)$ Alyuminiy nitrat parchalanganda o'rtacha molyar massasi $43{,}2\\text{ g/mol}$ bo'lgan gazlar aralashmasi hosil bo'ladi;\n" +
      "$2)$ Vodorod palladiyda eriganda faqat molekulyar $\\ce{H2}$ holatida qoladi;\n" +
      "$3)$ Bir xil sharoitda vodorod bilan to'ldirilgan shar havo bilan to'ldirilgan shu shardan tez ko'tariladi;\n" +
      "$4)$ Kislorod va metan aralashmasining o'rtacha molyar massasi $32\\text{ g/mol}$ dan katta, $16\\text{ g/mol}$ dan kichik bo'lmaydi;\n" +
      "$5)$ Teng hajmiy nisbatdagi gazlar aralashmasining o'rtacha molyar massasi ikkala gazning molyar massalari yig'indisining $1/3$ qismini tashkil etadi.",
    options: ["$1, 3, 4$", "$1, 2, 5$", "$2, 4, 5$", "$3, 4, 5$"],
    correct: 0,
    explanation:
      "$1)$ $\\ce{4Al(NO3)3 -> 2Al2O3 + 12NO2 + 3O2}$ bo'yicha $M_{\\text{o'rt}} = \\frac{12 \\cdot 46 + 3 \\cdot 32}{15} = \\frac{648}{15} = 43{,}2\\text{ g/mol}$ (to'g'ri). $2)$ Vodorod palladiyda atomar holatda eriydi (noto'g'ri). $3)$ $\\ce{H2}$ havodan $14{,}5$ marta yengil (to'g'ri). $4)$ Aralashma $M_{\\text{o'rt}}$ har doim $16$ va $32$ oralig'ida yotadi (to'g'ri). $5)$ Teng hajmda $1/2$ qism bo'ladi (noto'g'ri).",
  },
  {
    id: "ms-2024-09-22-3",
    turi: "variant",
    mavzu: "Tuzlarning ekvivalent massasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Kaliy gidroksid va ortofosfat kislota qanday mol nisbatda ta'sirlashsa, hosil bo'lgan tuzning ekvivalent massasi $87\\text{ g/ekv}$ ga teng bo'ladi?",
    options: ["$3:1$", "$1:1$", "$3:2$", "$2:1$"],
    correct: 3,
    explanation:
      "$2 : 1$ mol nisbatda $\\ce{2KOH + H3PO4 -> K2HPO4 + 2H2O}$ reaksiyasi boradi. $\\ce{K2HPO4}$ ($M = 174\\text{ g/mol}$) da $2$ ta $\\ce{K+}$ kationi borligi uchun ekvivalent massasi $E = \\frac{174}{2 \\cdot 1} = 87\\text{ g/ekv}$ ga teng ($\\ce{K3PO4}$ da $70{,}7$, $\\ce{KH2PO4}$ da $136$).",
  },
  {
    id: "ms-2024-09-22-4",
    turi: "variant",
    mavzu: "Ionlarning elektron konfiguratsiyasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Ionlarni elektron konfiguratsiyalari bilan to'g'ri moslang:\n" +
      "Ionlar: $a)$ gidrid ioni; $b)$ nitrid ioni; $c)\\ \\ce{Zn^{2+}}$ kationi; $d)\\ \\ce{Fe^{3+}}$ kationi.\n" +
      "Konfiguratsiyalar: $1)\\ 1s^1$; $2)\\ 1s^2 2s^2 2p^6 3s^2 3p^6 3d^{10}$; $3)\\ [\\ce{Ar}]3d^5$; $4)\\ [\\ce{Ar}]3d^6$; $5)\\ 1s^2 2s^2 2p^6$; $6)\\ 1s^2$.",
    options: [
      "$a - 1;\\; b - 5;\\; c - 4;\\; d - 3$",
      "$a - 6;\\; b - 4;\\; c - 5;\\; d - 1$",
      "$a - 6;\\; b - 5;\\; c - 2;\\; d - 3$",
      "$a - 6;\\; b - 5;\\; c - 4;\\; d - 3$",
    ],
    correct: 2,
    explanation:
      "Gidrid ioni $\\ce{H-}$ ($2e^-$): $1s^2$ ($6$). Nitrid ioni $\\ce{N^{3-}}$ ($10e^-$): $1s^2 2s^2 2p^6$ ($5$). Rux kationi $\\ce{Zn^{2+}}$ ($4s^2$ ketgach $28e^-$): $1s^2 2s^2 2p^6 3s^2 3p^6 3d^{10}$ ($2$). Temir(III) kationi $\\ce{Fe^{3+}}$ ($4s^2 3d^1$ ketgach $23e^-$): $[\\ce{Ar}]3d^5$ ($3$).",
  },
  {
    id: "ms-2024-09-22-5",
    turi: "variant",
    mavzu: "Atom elektron qavatlari va kvant sonlari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2024-09-22/savol-5.png",
    question:
      "Yuqoridagi elektron tuzilishga ega element atomida $M$ va $N$ qavatlardagi elektronlar yig'indisi $x + y = 15$ ga teng. Ushbu elementning eng yuqori oksidlanish darajali ionidagi oxirgi elektroni uchun magnit kvant soni ($m_l$) qiymatini toping.",
    options: ["$+2$", "$-1$", "$+1$", "$0$"],
    correct: 2,
    explanation:
      "$K = 2$, $L = 8$, $M + N = 15$ bo'lgani uchun jami elektronlar $2 + 8 + 15 = 25$ ta — bu marganes ($\\ce{Mn}$, $[\\ce{Ar}]3d^5 4s^2$). Eng yuqori oksidlanish darajali $\\ce{Mn^{7+}}$ ionining konfiguratsiyasi $1s^2 2s^2 2p^6 3s^2 3p^6$ bo'lib, oxirgi $3p^6$ elektroni uchun $l = 1$ ($-1, 0, +1$ tartibida) magnit kvant soni $m_l = +1$ ga teng.",
  },
  {
    id: "ms-2024-09-22-6",
    turi: "variant",
    mavzu: "Ammoniy ioni tuzilishi va xossalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Ammoniy ioni ($\\ce{NH4+}$) uchun to'g'ri ma'lumotlarni toping:\n" +
      "$1)$ Elektronlari soni $10$ ta, neytronlari soni $11$ ta, protonlari soni $11$ ta;\n" +
      "$2)$ Tayyor ammoniy ionida azot atomining taqsimlanmagan elektron jufti saqlanib qoladi;\n" +
      "$3)$ Azot atomi va bitta vodorod atomi orasida donor-akseptor mexanizmida hosil bo'lgan bog'lanish mavjud;\n" +
      "$4)$ Tuzlari suvda yaxshi eriydi.",
    options: ["$1, 4$", "$2, 4$", "$3, 4$", "$1, 3$"],
    correct: 2,
    explanation:
      "$\\ce{NH4+}$ ionida $7 + 4 = 11$ proton, $10$ elektron va $7 + 0 = 7$ neytron bor ($11$ emas, demak $1$ noto'g'ri). Azotning taqsimlanmagan jufti $\\ce{H+}$ ioniga berilib bog' hosil qilgani uchun tayyor ionda erkin juft qolmaydi ($2$ noto'g'ri). Bitta bog' donor-akseptor mexanizmida hosil bo'lgan ($3$ to'g'ri) va barcha ammoniy tuzlari suvda yaxshi eriydi ($4$ to'g'ri).",
  },
  {
    id: "ms-2024-09-22-7",
    turi: "variant",
    mavzu: "Vant-Goff qoidasi va temperatura koeffitsiyenti",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$A + B \\rightarrow C$ reaksiyaning $60\\,^\\circ\\text{C}$ dagi tezligi $3{,}6\\text{ mol/(l}\\cdot\\text{min)}$ bo'lib, $30\\,^\\circ\\text{C}$ da $40$ sekundda $A$ modda konsentratsiyasi $0{,}6\\text{ mol/l}$ dan $0{,}3\\text{ mol/l}$ gacha kamaydi. Ushbu reaksiyaning temperatura koeffitsiyentini ($\\gamma$) toping.",
    options: ["$4$", "$3$", "$2$", "$2{,}5$"],
    correct: 2,
    explanation:
      "$30\\,^\\circ\\text{C}$ dagi tezlik: $\\Delta t = 40\\text{ s} = \\frac{2}{3}\\text{ min}$, $v_{30} = \\frac{0{,}6 - 0{,}3}{2/3} = 0{,}45\\text{ mol/(l}\\cdot\\text{min)}$. Vant-Goff formulasi bo'yicha $\\frac{v_{60}}{v_{30}} = \\frac{3{,}6}{0{,}45} = 8 = \\gamma^{(60-30)/10} = \\gamma^3 \\Rightarrow \\gamma = 2$.",
  },
  {
    id: "ms-2024-09-22-8",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat — Le Shatelye prinsipi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$\\ce{CH4(g) + H2O(g) <=> CO(g) + 3H2(g)} - Q$ reaksiyasida is gazi ($\\ce{CO}$) hosil bo'lish unumini oshirish uchun qaysi amallarni bajarish kerak?",
    options: [
      "Bosimni oshirish; temperaturani kamaytirish; metan konsentratsiyasini oshirish",
      "Bosimni oshirish; temperaturani oshirish; vodorod konsentratsiyasini kamaytirish",
      "Bosimni kamaytirish; temperaturani oshirish; vodorod konsentratsiyasini oshirish",
      "Bosimni kamaytirish; temperaturani oshirish; metan konsentratsiyasini oshirish",
    ],
    correct: 3,
    explanation:
      "O'ng tomonda gazlar hajmi ko'p ($2\\text{ mol} \\to 4\\text{ mol}$), shuning uchun bosimni kamaytirish muvozanatni o'ngga siljitadi. Reaksiya endotermik ($-Q$) bo'lgani uchun temperaturani oshirish hamda chap tomondagi metan konsentratsiyasini oshirish unumni ko'paytiradi.",
  },
  {
    id: "ms-2024-09-22-9",
    turi: "variant",
    mavzu: "Vodorod peroksid parchalanishi va massa ulushi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Vodorod peroksid eritmasi qizdirilganda qisman parchalandi va eritma massasi $8\\%$ ga kamaydi. Shu jarayonda $10\\%$ li eritma hosil bo'lgan bo'lsa, dastlabki eritma konsentratsiyasini ($\\%$) toping.",
    options: ["$17$", "$29{,}6$", "$10$", "$26{,}2$"],
    correct: 3,
    explanation:
      "Dastlabki eritma $100\\text{ g}$ bo'lsin. Uchib chiqqan kislorod massasi $8\\text{ g}$ ($0{,}25\\text{ mol}$ $\\ce{O2}$). $\\ce{2H2O2 -> 2H2O + O2 ^}$ bo'yicha $0{,}5\\text{ mol}$ ($17\\text{ g}$) $\\ce{H2O2}$ parchalangan. Qolgan $92\\text{ g}$ eritmada $92 \\cdot 0{,}10 = 9{,}2\\text{ g}$ $\\ce{H2O2}$ bor. Dastlabki $\\ce{H2O2}$: $17 + 9{,}2 = 26{,}2\\text{ g}$ ($26{,}2\\%$).",
  },
  {
    id: "ms-2024-09-22-10",
    turi: "variant",
    mavzu: "Bosqichli neytrallanish va tuzlar aralashmasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$200\\text{ ml}$ $0{,}5\\text{ M}$ li natriy ortofosfat eritmasiga $50\\text{ ml}$ $1\\text{ M}$ li $\\ce{HCl}$ eritmasi qo'shildi. Natijada uch xil tuz saqlagan aralashma hosil bo'ldi. Aralashma tarkibida qaysi tuz bo'lmaydi?",
    options: [
      "Natriy gidroortofosfat",
      "Natriy digidroortofosfat",
      "Natriy ortofosfat",
      "Natriy xlorid",
    ],
    correct: 1,
    explanation:
      "$n(\\ce{Na3PO4}) = 0{,}2 \\cdot 0{,}5 = 0{,}1\\text{ mol}$, $n(\\ce{HCl}) = 0{,}05 \\cdot 1 = 0{,}05\\text{ mol}$. Reaksiya: $\\ce{Na3PO4 + HCl -> Na2HPO4 + NaCl}$. $0{,}05\\text{ mol}$ $\\ce{HCl}$ faqat yarim $\\ce{Na3PO4}$ ni $\\ce{Na2HPO4}$ ga aylantiradi. Eritmada $\\ce{Na3PO4}$, $\\ce{Na2HPO4}$ va $\\ce{NaCl}$ bo'ladi, lekin $\\ce{NaH2PO4}$ hosil bo'lmaydi.",
  },
  {
    id: "ms-2024-09-22-11",
    turi: "variant",
    mavzu: "Kuchsiz elektrolitlar dissotsiatsiyasi va pH",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    question:
      "$60\\%$ li chumoli kislotaning ikkita bir xil suvli eritmasidan birinchisiga $200\\text{ ml}$ suv, ikkinchisiga esa $200\\text{ ml}$ bromid kislota ($\\ce{HBr}$) eritmasi quyildi (yakuniy hajmlar teng). Quyidagi mulohazalardan nechtasi to'g'ri?\n" +
      "$\\bullet$ Birinchi eritmadagi formiat ionlari miqdori ikkinchi eritmadagidan ko'p;\n" +
      "$\\bullet$ Ikkinchi eritmaning $\\text{pH}$ qiymati birinchi eritmanikidan kichik;\n" +
      "$\\bullet$ Birinchi eritmada dissotsiyalanmagan chumoli kislota molekulalari ikkinchi eritmadagidan kamroq;\n" +
      "$\\bullet$ Ikkinchi eritmadagi vodorod ionlari konsentratsiyasi birinchi eritmadagidan kamroq.",
    options: ["$2$", "$3$", "$1$", "$4$"],
    correct: 1,
    explanation:
      "Kuchli $\\ce{HBr}$ kislotasi $[\\ce{H+}]$ ni keskin oshirib, ikkinchi eritmada $\\text{pH}$ ni tushiradi ($2$-fikr to'g'ri, $4$-fikr xato) hamda umumiy ion effekti bilan $\\ce{HCOOH <=> H+ + HCOO-}$ muvozanatini chapga siljitadi. Natijada birinchi eritmada $\\ce{HCOO-}$ ko'proq ($1$-fikr to'g'ri) va dissotsiyalanmagan $\\ce{HCOOH}$ molekulalari kamroq ($3$-fikr to'g'ri). Jami $3$ tasi to'g'ri.",
  },
  {
    id: "ms-2024-09-22-12",
    turi: "variant",
    mavzu: "Kaliy permanganatning muhitga bog'liq qaytarilishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Jumladagi bo'sh o'rinlarni to'g'ri to'ldiring: \"Pushti-siyohrangli kaliy permanganatning suvli eritmasiga kaliy sulfit ... modda bilan qo'shilsa, eritma rangi ... bo'ladi va permanganat ioni ... ionigacha qaytariladi.\"",
    options: [
      "$\\ce{H2SO4}$; rangsiz; $\\ce{MnO2}$",
      "$\\ce{KOH}$; rangsiz; $\\ce{Mn^{2+}}$",
      "$\\ce{KOH}$; yashil; $\\ce{MnO4^{2-}}$",
      "$\\ce{H2SO4}$; sariq; $\\ce{Mn^{2+}}$",
    ],
    correct: 2,
    explanation:
      "Ishqoriy muhitda ($\\ce{KOH}$) permanganat ioni $\\ce{MnO4-}$ manganat ionigacha ($\\ce{MnO4^{2-}}$) qaytarilib, eritma yashil rangga kiradi: $\\ce{2KMnO4 + K2SO3 + 2KOH -> 2K2MnO4 + K2SO4 + H2O}$.",
  },
  {
    id: "ms-2024-09-22-13",
    turi: "variant",
    mavzu: "Tuzlar aralashmasi va metall plastinka",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Natriy xlorid va kaliy xloriddan iborat $25\\text{ g}$ aralashma suvda eritilib, $840\\text{ ml}$ $0{,}5\\text{ M}$ li $\\ce{AgNO3}$ eritmasi qo'shildi. Hosil bo'lgan yangi eritmaga $100\\text{ g}$ massali mis plastinka tushirildi va ma'lum vaqtdan so'ng tortilganda massasi $101{,}52\\text{ g}$ bo'ldi. Dastlabki aralashmadagi osh tuzining massa ulushini toping.",
    options: ["$0{,}702$", "$0{,}75$", "$0{,}298$", "$0{,}25$"],
    correct: 0,
    explanation:
      "Jami $\\ce{AgNO3}$: $0{,}84 \\cdot 0{,}5 = 0{,}42\\text{ mol}$. Plastinkada $\\ce{Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag}$ reaksiyasi uchun $1\\text{ mol}$ $\\ce{Cu}$ ga massa ortishi $216 - 64 = +152\\text{ g}$. Ortish $1{,}52\\text{ g}$ bo'lgani uchun $0{,}01\\text{ mol}$ $\\ce{Cu}$ va $0{,}02\\text{ mol}$ ortgan $\\ce{AgNO3}$ sarflangan. Xloridlarga ketgan $\\ce{AgNO3}$: $0{,}42 - 0{,}02 = 0{,}40\\text{ mol}$. $58{,}5x + 74{,}5(0{,}40 - x) = 25 \\Rightarrow 16x = 4{,}8 \\Rightarrow x = 0{,}30\\text{ mol}$ $\\ce{NaCl}$ ($17{,}55\\text{ g}$). Ulushi: $17{,}55 / 25 = 0{,}702$.",
  },
  {
    id: "ms-2024-09-22-14",
    turi: "variant",
    mavzu: "Oksidlar va asoslarning suvdagi muhiti",
    soha: "Anorganik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2024-09-22/savol-14.png",
    question:
      "Suv solingan probirkalarga sxemadagi moddalar qo'shilgach, ularga binafsha rangli lakmus tomizildi. Qaysi probirkada lakmus qizil rangga kiradi?",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 2,
    explanation:
      "Lakmus kislotali muhitda qizil rangga kiradi. №$1$ ($\\ce{SiO2}$) va №$4$ ($\\ce{CuO}$) suvda erimaydi; №$2$ ($\\ce{KOH}$) ishqoriy muhit (ko'k rang) beradi; №$3$ probirkada kislotali oksid $\\ce{P2O5}$ suv bilan $\\ce{H3PO4}$ hosil qilib lakmusni qizartiradi.",
  },
  {
    id: "ms-2024-09-22-15",
    turi: "variant",
    mavzu: "Fosfor(V)-oksidning xossalari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$4{,}96\\text{ g}$ $X$ oddiy modda $6{,}4\\text{ g}$ kislorod bilan qoldiqsiz reaksiyaga kirishib, $X_a O_b$ oksidini hosil qildi. Hosil bo'lgan oksid haqidagi to'g'ri fikrni aniqlang.",
    options: [
      "Amfoter oksid hisoblanadi",
      "Tarkibidagi $X$ ning oksidlanish darajasi $+3$",
      "$0{,}48\\text{ mol}$ o'yuvchi natriy bilan reaksiyaga kirishib o'rta tuz hosil qiladi",
      "Suvda erib faqat bir xil kislota hosil qiladi",
    ],
    correct: 2,
    explanation:
      "$n(\\ce{O2}) = 6{,}4 / 32 = 0{,}20\\text{ mol}$ ($0{,}40\\text{ mol}$ $\\ce{O}$). $X$ valentligi $5$ bo'lsa ($\\ce{4P + 5O2 -> 2P2O5}$): $n(X) = 0{,}16\\text{ mol}$, $A_r(X) = 4{,}96 / 0{,}16 = 31$ (fosfor). $0{,}08\\text{ mol}$ $\\ce{P2O5}$ hosil bo'ladi: $\\ce{P2O5 + 6NaOH -> 2Na3PO4 + 3H2O}$ bo'yicha $0{,}08 \\cdot 6 = 0{,}48\\text{ mol}$ $\\ce{NaOH}$ bilan o'rta tuz beradi.",
  },
  {
    id: "ms-2024-09-22-16",
    turi: "variant",
    mavzu: "Element valentligi va gidroksidlar tuzilishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Quyidagi gidroksid grafik formulasiga mos keluvchi metallni aniqlang: $\\ce{HO-Me(OH)-OH}$ (uch valentli metall gidroksidi).",
    options: ["$\\ce{Na}$", "$\\ce{Cd}$", "$\\ce{Mg}$", "$\\ce{Fe}$"],
    correct: 3,
    explanation:
      "Berilgan grafik formulada metall atomi $3$ ta gidroksil guruhiga bog'langan ($\\ce{Me(OH)3}$), ya'ni metall III valentli bo'lishi kerak. Variantlar ichida faqat temir $\\ce{Fe(OH)3}$ hosil qiladi ($\\ce{Na}$ I valentli, $\\ce{Cd}$ va $\\ce{Mg}$ II valentli).",
  },
  {
    id: "ms-2024-09-22-17",
    turi: "variant",
    mavzu: "Konsentrlangan sulfat kislotaning oksidlovchilik xossalari",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Tarkibidagi moddalarning mol nisbati $2 : 1 : 1$ (berilgan tartibda) bo'lgan temir qo'sh oksidi ($\\ce{Fe3O4}$), uglerod va misdan iborat $54\\text{ g}$ aralashmani qizdirib to'liq eritish uchun necha gramm $80\\%$ li sulfat kislota eritmasi kerak bo'ladi? Barcha reaksiyalarda $\\ce{H2SO4}$ ning qaytarilish mahsuloti $\\ce{SO2}$ deb hisoblang.",
    options: ["$196$", "$137{,}2$", "$171{,}5$", "$147$"],
    correct: 2,
    explanation:
      "$2\\,\\ce{Fe3O4} + 1\\,\\ce{C} + 1\\,\\ce{Cu}$ blokining massasi $2 \\cdot 232 + 12 + 64 = 540\\text{ g}$, demak $54\\text{ g}$ da $0{,}2\\text{ mol}$ $\\ce{Fe3O4}$, $0{,}1\\text{ mol}$ $\\ce{C}$, $0{,}1\\text{ mol}$ $\\ce{Cu}$ bor. Reaksiyalar: $\\ce{2Fe3O4 + 10H2SO4 -> 3Fe2(SO4)3 + SO2 + 10H2O}$ ($1{,}0\\text{ mol}$), $\\ce{C + 2H2SO4 -> CO2 + 2SO2 + 2H2O}$ ($0{,}2\\text{ mol}$), $\\ce{Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O}$ ($0{,}2\\text{ mol}$). Jami $1{,}4\\text{ mol}$ $\\ce{H2SO4}$ ($137{,}2\\text{ g}$). $80\\%$ li eritma: $137{,}2 / 0{,}8 = 171{,}5\\text{ g}$.",
  },
  {
    id: "ms-2024-09-22-18",
    turi: "variant",
    mavzu: "Rux va uning birikmalari ishtirokidagi o'zgarishlar",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2024-09-22/savol-18.png",
    question:
      "Bir bosqichli o'zgarishlar sxemasi berilgan ($4$-reaksiyada sariq-qizil rangli metall hosil bo'ladi). Oddiy modda hosil bo'lishi bilan boradigan reaksiya tenglamalari raqamlarini toping.",
    options: ["$1, 3, 4, 5$", "$1, 2, 4, 6$", "$1, 2, 3, 5$", "$3, 4, 5, 6$"],
    correct: 0,
    explanation:
      "$X = \\ce{ZnCl2}$, $Z = \\ce{Na2[Zn(OH)4]}$. $1)\\ \\ce{Zn + NaOH + H2O -> Z + H2 ^}$ (oddiy modda $\\ce{H2}$); $2)\\ Z + \\ce{HCl -> ZnCl2}$ (oddiy modda yo'q); $3)\\ \\ce{ZnCl2 + Mg -> Zn + MgCl2}$ (yoki elektroliz — oddiy modda $\\ce{Zn}$); $4)\\ \\ce{Zn + CuCl2 -> ZnCl2 + Cu}$ (sariq-qizil metall $\\ce{Cu}$); $5)\\ \\ce{Zn + HCl -> ZnCl2 + H2 ^}$ (oddiy modda $\\ce{H2}$); $6)\\ \\ce{ZnCl2 + NaOH -> Z}$ (oddiy modda yo'q). Javob: $1, 3, 4, 5$.",
  },
  {
    id: "ms-2024-09-22-19",
    turi: "variant",
    mavzu: "Metallmaslarning konsentrlangan kislotalar bilan oksidlanishi",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "$1)\\ \\ce{C + H2SO4(kons) -> ...}$\n" +
      "$2)\\ \\ce{P + HNO3(kons) -> ...}$\n" +
      "Ikkala reaksiyada jami $18\\text{ g}$ suv hosil bo'ldi. Ikkinchi reaksiyada hosil bo'lgan ortofosfat kislotaning miqdori ($\\text{mol}$) birinchi reaksiyada hosil bo'lgan gazlarning umumiy miqdoriga ($\\text{mol}$) teng bo'lsa, dastlabki metallmaslarning umumiy massasini ($\\text{g}$) toping.",
    options: ["$21$", "$37$", "$24{,}5$", "$17{,}9$"],
    correct: 0,
    explanation:
      "$1)\\ \\ce{C + 2H2SO4 -> CO2 ^ + 2SO2 ^ + 2H2O}$ ($x\\text{ mol}$ $\\ce{C} \\Rightarrow 3x\\text{ mol}$ gaz va $2x\\text{ mol}$ $\\ce{H2O}$). $2)\\ \\ce{P + 5HNO3 -> H3PO4 + 5NO2 ^ + H2O}$ ($n(\\ce{H3PO4}) = 3x\\text{ mol} \\Rightarrow 3x\\text{ mol}$ $\\ce{P}$ va $3x\\text{ mol}$ $\\ce{H2O}$). Jami suv: $2x + 3x = 5x = 18/18 = 1\\text{ mol} \\Rightarrow x = 0{,}2\\text{ mol}$. Metallmaslar massasi: $0{,}2 \\cdot 12 + 0{,}6 \\cdot 31 = 2{,}4 + 18{,}6 = 21\\text{ g}$.",
  },
  {
    id: "ms-2024-09-22-20",
    turi: "variant",
    mavzu: "Alkanlarning chala yonishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Noma'lum alkan yondirilganda $194{,}4\\text{ g}$ $\\ce{CO}$ va $\\ce{CO2}$ aralashmasi hosil bo'ldi. Ushbu aralashmadagi $\\ce{CO}$ ning miqdori ($\\text{mol}$) $\\ce{CO2}$ ning miqdoridan $10$ marta ko'p hamda alkan va kislorod $1{,}1 : 4$ mol nisbatda reaksiyaga kirishgan bo'lsa, alkanni toping.",
    options: ["Butan", "Metan", "Etan", "Propan"],
    correct: 3,
    explanation:
      "$10k\\text{ mol}$ $\\ce{CO}$ ($280k\\text{ g}$) va $k\\text{ mol}$ $\\ce{CO2}$ ($44k\\text{ g}$) jami $324k = 194{,}4\\text{ g} \\Rightarrow k = 0{,}6\\text{ mol}$. Shunda $n(\\ce{CO}) = 6\\text{ mol}$, $n(\\ce{CO2}) = 0{,}6\\text{ mol}$, jami uglerod $6{,}6\\text{ mol}$. Alkan $\\ce{C_{n}H_{2n+2}}$ moli $6{,}6/n$, kislorod atomlari sonidan $n(\\ce{O2}) = \\frac{6 + 1{,}2 + \\frac{6{,}6}{n}(n+1)}{2}$. Nisbat $\\frac{6{,}6/n}{n(\\ce{O2})} = \\frac{1{,}1}{4}$ tenglamani faqat $n = 3$ ($2{,}2 : 8{,}0 = 1{,}1 : 4$) qanoatlantiradi — propan.",
  },
  {
    id: "ms-2024-09-22-21",
    turi: "variant",
    mavzu: "Alkadiyenlarning bromlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Uglerod va vodorod atomlari soni $2$ taga farq qiladigan alkadiyen $300\\text{ g}$ $3{,}2\\%$ li bromning tetraxlormetandagi eritmasi bilan ta'sirlashib, teng mol miqdordagi dibromalkan va tetrabromalkan hosil qildi. Bunda qanday massadagi ($\\text{g}$) alkadiyen sarflangan?",
    options: ["$1{,}08$", "$2{,}16$", "$3{,}24$", "$4{,}32$"],
    correct: 1,
    explanation:
      "Alkadiyen $\\ce{C_{n}H_{2n-2}}$ da $(2n - 2) - n = 2 \\Rightarrow n = 4$ ($\\ce{C4H6}$, $M = 54\\text{ g/mol}$). Brom moli: $300 \\cdot 0{,}032 / 160 = 0{,}06\\text{ mol}$. $x\\text{ mol}$ dibromid ($x\\text{ mol}$ $\\ce{Br2}$) va $x\\text{ mol}$ tetrabromid ($2x\\text{ mol}$ $\\ce{Br2}$) uchun $x + 2x = 0{,}06 \\Rightarrow x = 0{,}02\\text{ mol}$. Jami alkadiyen $2x = 0{,}04\\text{ mol}$, massasi: $0{,}04 \\cdot 54 = 2{,}16\\text{ g}$.",
  },
  {
    id: "ms-2024-09-22-22",
    turi: "variant",
    mavzu: "Ammiak sintezi uchun vodorod olish",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Tabiiy gazni qayta ishlab ammiak ishlab chiqarish uchun xomashyo (vodorod) tayyorlashda qaysi asosiy reaksiya amalga oshiriladi?",
    options: [
      "Metanning suv bug'i bilan konversiyasi: $\\ce{CH4 + H2O <=> CO + 3H2} - Q$",
      "$\\ce{2CH4 + O2 -> 2CO + 4H2}$",
      "$\\ce{CH4 -> C + 2H2}$",
      "$\\ce{2H2O -> 2H2 + O2}$",
    ],
    correct: 0,
    explanation:
      "Sanoatda ammiak sintezi uchun vodorod olishning asosiy usuli — tabiiy gaz (metan) ning suv bug'i bilan katalitik konversiyasi ($\\ce{CH4 + H2O <=> CO + 3H2} - Q$).",
  },
  {
    id: "ms-2024-09-22-23",
    turi: "variant",
    mavzu: "Formaldegidni gidrogenlash va gaz aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "O'rtacha molyar massasi $12\\text{ g/mol}$ bo'lgan formaldegid va vodorod aralashmasi qizdirilgan katalizator ustidan o'tkazildi. Natijada metanol bug'i hosil bo'lib, olingan gazlar aralashmasining vodorodga nisbatan zichligi $8{,}4$ ga teng bo'ldi. Oxirgi gaz aralashmasidagi vodorodning mol ulushini ($\\%$) toping.",
    options: ["$40$", "$30$", "$50$", "$10$"],
    correct: 2,
    explanation:
      "$\\ce{HCHO}$ ($30$) va $\\ce{H2}$ ($2$) dastlabki mol nisbati: $\\frac{12 - 2}{30 - 12} = \\frac{10}{18} = 5 : 9$ ($5\\text{ mol}$ $\\ce{HCHO}$, $9\\text{ mol}$ $\\ce{H2}$, jami $14\\text{ mol}$, massa $168\\text{ g}$). Reaksiyadan keyingi $M_{\\text{o'rt}} = 8{,}4 \\cdot 2 = 16{,}8\\text{ g/mol}$, jami oxirgi mol $168 / 16{,}8 = 10\\text{ mol}$. Kamaygan mol $14 - 10 = 4\\text{ mol}$ sarflangan $\\ce{H2}$ ga teng. Qolgan $\\ce{H2} = 9 - 4 = 5\\text{ mol}$, ulushi $5 / 10 = 50\\%$.",
  },
  {
    id: "ms-2024-09-22-24",
    turi: "variant",
    mavzu: "Karbon kislota va murakkab efir izomerlari aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Tarkibi $\\ce{C4H8O2}$ bo'lgan $88\\text{ g}$ ikkita izomer modda aralashmasi teng ikki qismga bo'lindi. Birinchi qismi natriy gidrokarbonat bilan ta'sirlashib $4{,}48\\text{ l}$ (n.sh.) gaz hosil qildi. Ikkinchi qismiga $\\ce{NaOH}$ ta'sir ettirilganda hosil bo'lgan spirtning $20\\%$ qismi bug'landi. Bug'langan spirt massasini ($\\text{g}$) aniqlang.",
    options: ["$4{,}6$", "$2{,}76$", "$2{,}3$", "$3{,}68$"],
    correct: 1,
    explanation:
      "Har bir qism massasi $44\\text{ g}$, moli $44 / 88 = 0{,}5\\text{ mol}$. $\\ce{NaHCO3}$ bilan faqat karbon kislota ($\\ce{C3H7COOH}$) reaksiyaga kirishadi: $n = 4{,}48 / 22{,}4 = 0{,}2\\text{ mol}$. Demak har bir qismda $0{,}5 - 0{,}2 = 0{,}3\\text{ mol}$ etilatsetat ($\\ce{CH3COOC2H5}$) bor. Ikkinchi qism gidrolizidan $0{,}3\\text{ mol}$ $\\ce{C2H5OH}$ ($0{,}3 \\cdot 46 = 13{,}8\\text{ g}$) chiqadi; $20\\%$ bug'langan qismi $13{,}8 \\cdot 0{,}20 = 2{,}76\\text{ g}$.",
  },
  {
    id: "ms-2024-09-22-25",
    turi: "variant",
    mavzu: "Polifunksional aromatik birikmalar xossalari",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2024-09-22/savol-25.png",
    question:
      "Yuqorida strukturasi berilgan moddaning $1$ moli mo'l miqdordagi natriy gidroksid bilan reaksiyaga kirishganda hosil bo'ladigan organik tuzning molyar massasini ($\\text{g/mol}$) toping.",
    options: ["$226$", "$204$", "$230$", "$248$"],
    correct: 0,
    explanation:
      "Berilgan modda — $3$-gidroksi-$5$-($2$-gidroksietil)benzoy kislota ($\\ce{C9H10O4}$, $M = 182\\text{ g/mol}$). Suvli $\\ce{NaOH}$ eritmasi bilan karboksil guruhi ($-\\ce{COOH}$) hamda benzol halqasidagi fenol gidroksili ($-\\ce{OH}$) reaksiyaga kirishib natriy tuziga aylanadi, alifatik spirt $-\\ce{CH2CH2OH}$ esa $\\ce{NaOH}$ bilan ta'sirlashmaydi. $2$ ta $\\ce{H}$ ning $\\ce{Na}$ ga almashinishi: $182 + 2(23 - 1) = 226\\text{ g/mol}$.",
  },
  {
    id: "ms-2024-09-22-26",
    turi: "variant",
    mavzu: "Uglevodlar — fruktoza tuzilishi va xossalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Berilgan ma'lumotlardan fruktozaga tegishlilarini toping:\n" +
      "$1)$ geksoza;\n" +
      "$2)$ molekulasining yopiq shakli besh atomni (kislorod bilan birga) o'z ichiga oladi;\n" +
      "$3)$ geterofunksional birikma molekulasida bitta aldegid va beshta gidroksil guruhi bor;\n" +
      "$4)$ gidrolizlanadi;\n" +
      "$5)$ ketoza;\n" +
      "$6)$ aldoza.",
    options: ["$3, 4, 6$", "$1, 2, 5$", "$2, 4, 5$", "$1, 3, 6$"],
    correct: 1,
    explanation:
      "Fruktoza ($\\ce{C6H12O6}$) — olti uglerodli geksoza ($1$) va keton guruhli ketoza ($5$). Siklik furanoza shaklida $4$ ta uglerod va $1$ ta kislorod — jami $5$ a'zoli halqa hosil qiladi ($2$). Monosaxarid bo'lgani uchun gidrolizlanmaydi, aldoza emas ($3, 4, 6$ noto'g'ri).",
  },
  {
    id: "ms-2024-09-22-27",
    turi: "variant",
    mavzu: "Organik birikmalarda oksidlanish darajasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$2,4,6$-tribromanilin molekulasidagi barcha uglerod atomlarining oksidlanish darajalari yig'indisini toping.",
    options: ["$-3$", "$+2$", "$-2$", "$+3$"],
    correct: 1,
    explanation:
      "$2,4,6$-tribromanilin formulasi $\\ce{C6H4Br3N}$. Molekula elektroneytral: $4\\text{ H}$ ($+4$), $3\\text{ Br}$ ($-3$, brom ugleroddan elektromanfiyroq) va aminoguruhdagi $\\text{N}$ ($-3$). Barcha uglerod atomlarining oksidlanish darajalari yig'indisi: $0 - (+4 - 3 - 3) = +2$.",
  },
  {
    id: "ms-2024-09-22-28",
    turi: "variant",
    mavzu: "Aminlarning nitrit kislota bilan reaksiyasi va uglerod turlari",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Birlamchi alifatik aminlar nitrit kislota ($\\ce{NaNO2 + H2SO4}$) bilan ta'sirlashib birlamchi spirt, azot va suv hosil qiladi. $1$-amino-$3,4$-dimetilpentanning nitrit kislota bilan ta'sirlashishidan hosil bo'lgan spirt molekulasida nechta ikkilamchi uglerod atomi mavjud?",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 0,
    explanation:
      "Hosil bo'ladigan spirt — $3,4$-dimetilpentan-$1$-ol: $\\ce{CH3-CH(CH3)-CH(CH3)-CH2-CH2OH}$. $C_1$ ($\\ce{-CH2OH}$) faqat $C_2$ bilan bog'langan (birlamchi); $C_2$ ($\\ce{-CH2-}$) ikkita uglerodga bog'langan (ikkilamchi); $C_3$ va $C_4$ uchlamchi; $C_5$ va yon metil guruhlari birlamchi. Jami $1$ ta ikkilamchi uglerod atomi bor.",
  },
  {
    id: "ms-2024-09-22-29",
    turi: "variant",
    mavzu: "Polimerlar va polimerlanish darajasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$3{,}01 \\cdot 10^{21}$ ta poliizopren makromolekulasi $600\\text{ g}$ $3{,}2\\%$ li bromli suvni rangsizlantirdi (makromolekulada uzilish bo'lmagan). Agar hosil bo'lgan bromlangan polimerda bromning massa ulushi $32\\%$ bo'lsa, polimerlanish darajasini aniqlang.",
    options: ["$120$", "$200$", "$100$", "$240$"],
    correct: 0,
    explanation:
      "Makromolekulalar moli: $3{,}01 \\cdot 10^{21} / 6{,}02 \\cdot 10^{23} = 0{,}005\\text{ mol}$. Birikkan brom massasi: $600 \\cdot 0{,}032 = 19{,}2\\text{ g}$. Polimerlanish darajasi $n$ bo'lsa, poliizopren ($\\ce{(C5H8)_{n}}$, $M_{\\text{zveno}} = 68$) massasi $0{,}005 \\cdot 68n = 0{,}34n\\text{ g}$. Shart bo'yicha $\\frac{19{,}2}{0{,}34n + 19{,}2} = 0{,}32 \\Rightarrow 0{,}34n + 19{,}2 = 60 \\Rightarrow n = \\frac{40{,}8}{0{,}34} = 120$.",
  },
  {
    id: "ms-2024-09-22-30",
    turi: "variant",
    mavzu: "Organik moddalarning sifat reaksiyalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "To'rtta raqamlangan probirkada quyidagi moddalarning suvli eritmalari bor: $1)$ oqsil; $2)$ metilamin; $3)$ glukoza; $4)$ sirka kislota. Moddalarni aniqlab beruvchi reagentlarni toping.",
    options: [
      "$1$ va $3$ — $\\ce{CuSO4 + NaOH}$; $2$ va $4$ — lakmus",
      "$1$ va $3$ — $\\ce{CuSO4 + NaOH}$; $2$ — bromli suv; $4$ — $\\ce{Na}$",
      "$1$ — $\\ce{KMnO4}$; $2$ — $\\ce{HNO3}$; $3$ — $\\ce{Ag2O(NH3)}$; $4$ — $\\ce{H2O}$",
      "$1$ — $\\ce{HNO3}$; $2$ — $\\ce{Ag2O(NH3)}$; $3$ va $4$ — $\\ce{NaOH}$",
    ],
    correct: 0,
    explanation:
      "Ishqoriy muhitdagi $\\ce{CuSO4 + NaOH}$ bilan oqsil ($1$) binafsha rangli biuret reaksiyasini, glukoza ($3$) esa yorqin ko'k eritma va qizdirilganda g'isht-qizil $\\ce{Cu2O}$ cho'kmasini beradi. Lakmus eritmasi metilamin ($2$, asosli muhit) da ko'karadi, sirka kislota ($4$, kislotali muhit) da qizaradi.",
  },
  {
    id: "ms-2024-09-22-31",
    turi: "variant",
    mavzu: "Yog'lar gidrolizi va to'yinmagan yog' kislotalari",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2024-09-22/savol-31.png",
    question:
      "Yuqorida reaksiya tenglamasi keltirilgan jarayon va $X$ modda haqida to'g'ri fikrni tanlang.",
    options: [
      "$X$ modda qoldiqlari asosan qattiq yog'lar tarkibida uchraydi",
      "$X$ modda palmitin kislotadan farqli ravishda bromli suvni rangsizlantiradi",
      "$X$ modda molekulasi tarkibidagi barcha uglerod atomlari $sp^3$ gibridlangan",
      "Sxemada moyning sovunlanish jarayoni keltirilgan",
    ],
    correct: 1,
    explanation:
      "Sxemada triolein (suyuq yog') ning suv bilan gidrolizi tasvirlangan (sovunlanish emas). Hosil bo'ladigan $X$ modda — to'yinmagan olein kislotasi ($\\ce{C17H33COOH}$, $1$ ta $\\ce{C=C}$ qo'sh bog'i va $sp^2$ uglerodlari mavjud). Shu sababli u to'yingan palmitin kislotadan farqli o'laroq bromli suvni rangsizlantiradi.",
  },
  {
    id: "ms-2024-09-22-32",
    turi: "variant",
    mavzu: "Organik moddalarda uglerod va vodorodni aniqlash (sifat tahlili)",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2024-09-22/savol-32.png",
    question:
      "Yuqoridagi tajribada $X$ modda $\\ce{CuO}$ bilan qizdirilganda ohakli suv loyqalanib, oq rangli suvsiz mis(II)-sulfat ko'kardi. Tajribadan qanday asosiy xulosa qilinadi?",
    options: [
      "Spirtning aldegidgacha oksidlanish reaksiyasi",
      "Mis(II)-glitseratning olinishi",
      "Organik modda tarkibida xlor elementi bor",
      "Organik modda tarkibida uglerod va vodorod elementlari bor",
    ],
    correct: 3,
    explanation:
      "$X$ modda $\\ce{CuO}$ bilan oksidlanganda chiqqan suv bug'i suvsiz oq $\\ce{CuSO4}$ ni ko'k rangga ($\\ce{CuSO4 \\cdot 5H2O}$) aylantiradi — bu vodorod borligini, $\\ce{CO2}$ gazi esa ohakli suvni ($\\ce{Ca(OH)2}$) loyqalatishi uglerod borligini isbotlaydi.",
  },
  {
    id: "ms-2024-09-22-33",
    turi: "moslashtirish",
    mavzu: "Uglevodorodlar va kislorodli organik birikmalar zanjiri",
    soha: "Organik kimyo",
    daraja: "qiyin",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    kontekstRasm: MOSLASHTIRISH_KONTEKST_RASM_33_35,
    question: "33. $Y$ modda molekulasidagi atomlar sonini toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "$n$-pentan krekingidan $K$ — propen ($\\ce{C3H6}$) va $\\ce{C2H6}$ olinadi. $K$ vodorod peroksid ishtirokida hidratlanganda birlamchi spirt $T$ — propan-$1$-ol, so'ng $E$ — propanal, kumush ko'zgu reaksiyasidan $Y$ — propion kislota ($\\ce{C3H6O2}$) hosil bo'ladi. Atomlar soni: $3 + 6 + 2 = 11$ (D).",
  },
  {
    id: "ms-2024-09-22-34",
    turi: "moslashtirish",
    mavzu: "Alkinlarni oksidlash va Kucherov reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    kontekstRasm: MOSLASHTIRISH_KONTEKST_RASM_33_35,
    question: "34. $Z$ modda molekulasidagi atomlar sonini toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "Pent-$2$-in ($X$) ning permanganat bilan oksidlanishidan propion ($Y$) va sirka ($Z$) kislotalar hosil bo'ladi (shuningdek $\\ce{C2H6 ->[t^{\\circ}] C2H2 ->[H2O,\\,Hg^{2+}] CH3CHO ->[Cu(OH)2] CH3COOH}$). Sirka kislota ($\\ce{C2H4O2}$) da atomlar soni: $2 + 4 + 2 = 8$ (A).",
  },
  {
    id: "ms-2024-09-22-35",
    turi: "moslashtirish",
    mavzu: "Birlamchi spirtlarni oksidlash",
    soha: "Organik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    kontekstRasm: MOSLASHTIRISH_KONTEKST_RASM_33_35,
    question: "35. $E$ modda molekulasidagi atomlar sonini toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "Birlamchi spirt propan-$1$-ol ($T$) ning mis(II)-oksid bilan oksidlanishidan hosil bo'ladigan $E$ modda — propanal ($\\ce{CH3CH2CHO}$, $\\ce{C3H6O}$). Undagi atomlar soni: $3 + 6 + 1 = 10$ (C).",
  },
  {
    id: "ms-2024-09-22-36",
    turi: "ochiq",
    mavzu: "Nitratlar parchalanishi va metallar oksidlanishi",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Kadmiy nitrat va temirdan iborat $97{,}6\\text{ g}$ aralashma ochiq havoda qizdirildi. Bunda aralashma massasi o'zgarmadi va reaksiyadan so'ng faqat metall oksidlari ($\\ce{CdO}$ va $\\ce{Fe2O3}$) qoldi. Dastlabki aralashmadagi tuzning massasini ($\\text{g}$) aniqlang.",
    correct: "47.2",
    tolerance: 0.2,
    birlik: "g",
    explanation:
      "$\\ce{2Cd(NO3)2 -> 2CdO + 4NO2 ^ + O2 ^}$ ($1\\text{ mol}$ $\\ce{Cd(NO3)2}$, $236\\text{ g} \\to \\ce{CdO}$, $128\\text{ g}$, massa kamayishi $108\\text{ g}$). $\\ce{4Fe + 3O2 -> 2Fe2O3}$ ($1\\text{ mol}$ $\\ce{Fe}$, $56\\text{ g} \\to 0{,}5\\text{ mol}$ $\\ce{Fe2O3}$, $80\\text{ g}$, massa ortishi $24\\text{ g}$). Massa o'zgarmagani uchun $108x = 24y \\Rightarrow y = 4{,}5x$. $236x + 56(4{,}5x) = 488x = 97{,}6 \\Rightarrow x = 0{,}2\\text{ mol}$. Tuz massasi: $0{,}2 \\cdot 236 = 47{,}2\\text{ g}$.",
  },
  {
    id: "ms-2024-09-22-37",
    turi: "ochiq",
    mavzu: "Ketonlarning oksidlanish-qaytarilish reaksiyasini tenglashtirish",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Quyidagi reaksiyani yarim reaksiyalar usulida tenglashtiring va barcha (chap hamda o'ng tomondagi) koeffitsiyentlar yig'indisini aniqlang:\n" +
      "$\\ce{CH3CH2COCH2CH3 + MnO4- + H+ -> CH3CH2COO- + CH3COO- + Mn^{2+} + H2O}$",
    correct: "44",
    tolerance: 0.1,
    birlik: "yig'indi",
    explanation:
      "Yarim reaksiyalar: oksidlanish $\\ce{C5H10O + 3H2O -> C3H5O2- + C2H3O2- + 8H+ + 6e-}$ ($\\times 5$); qaytarilish $\\ce{MnO4- + 8H+ + 5e- -> Mn^{2+} + 4H2O}$ ($\\times 6$). Umumiy tenglama: $\\ce{5CH3CH2COCH2CH3 + 6MnO4- + 8H+ -> 5CH3CH2COO- + 5CH3COO- + 6Mn^{2+} + 9H2O}$. Koeffitsiyentlar yig'indisi: $5 + 6 + 8 + 5 + 5 + 6 + 9 = 44$.",
  },
  {
    id: "ms-2024-09-22-38",
    turi: "ochiq",
    mavzu: "Aralashmani ikki usulda oksidlash (kislorod va H2SO4)",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Mis, uglerod va oltingugurtdan iborat $1{,}6\\text{ mol}$ aralashma teng ikki qismga bo'lindi. Birinchi qismi mo'l kislorodda yondirilganda $0{,}7\\text{ mol}$ gazlar aralashmasi hosil bo'ldi. Ikkinchi qismi konsentrlangan sulfat kislotada eritilganda $136{,}8\\text{ g}$ gazlar aralashmasi ajraldi ($\\ce{S + 2H2SO4 -> 3SO2 ^ + 2H2O}$). Har ikkala jarayonda olingan karbonat angidridning umumiy miqdorini ($\\text{mol}$) toping.",
    correct: "0.4",
    tolerance: 0.02,
    birlik: "mol",
    explanation:
      "Har bir qismda $0{,}8\\text{ mol}$ aralashma bor. $1$-qismda $\\ce{CO2}$ ($b$) $+\\,\\ce{SO2}$ ($c$) $= 0{,}7\\text{ mol}$, demak $n(\\ce{Cu}) = 0{,}8 - 0{,}7 = 0{,}1\\text{ mol}$. $2$-qismda $\\ce{Cu}$ ($0{,}1\\text{ mol}$ $\\ce{SO2}$), $\\ce{C}$ ($b\\,\\ce{CO2} + 2b\\,\\ce{SO2}$) va $\\ce{S}$ ($3c\\,\\ce{SO2}$) jami $44b + 64(0{,}1 + 2b + 3c) = 136{,}8$. $c = 0{,}7 - b$ ni qo'ysak: $140{,}8 - 20b = 136{,}8 \\Rightarrow b = 0{,}2\\text{ mol}$. Ikkala qismdan olingan jami $\\ce{CO2}$: $0{,}2 + 0{,}2 = 0{,}4\\text{ mol}$.",
  },
  {
    id: "ms-2024-09-22-39",
    turi: "ochiq",
    mavzu: "Lassen probasi (organik moddada azotni sifat aniqlash)",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Organik modda (jun tolasi) tarkibida oltingugurt va azot borligini isbotlash uchun quruq probirkada kerosindan tozalangan kaliy bo'lagi bilan qizdirilganda $X$ va $Y$ tuzlar hosil bo'ldi. Suvli filtratga $\\ce{FeSO4}$ qo'shib qizdirilganda $X$ modda u bilan ta'sirlashdi, so'ng $\\ce{FeCl3}$ va $\\ce{HCl}$ tomizilganda berlin lazurining to'q ko'k cho'kmasi tushdi. Azot borligini isbotlashda ishtirok etgan $X$ moddaning molyar massasini ($\\text{g/mol}$) aniqlang.",
    correct: "65",
    tolerance: 0.5,
    birlik: "g/mol",
    explanation:
      "Lassen probasida azotli organik modda kaliy metalli bilan suyultirilganda kaliy sianid ($X = \\ce{KCN}$) hosil bo'ladi ($\\ce{K2S}$ esa oltingugurtga tegishli $Y$). $\\ce{KCN}$ avval $\\ce{FeSO4}$ bilan $\\ce{K4[Fe(CN)6]}$ ga o'tadi, so'ngra $\\ce{FeCl3}$ ta'sirida berlin lazuri $\\ce{Fe4[Fe(CN)6]3}$ cho'kmasi tushadi. $M(\\ce{KCN}) = 39 + 12 + 14 = 65\\text{ g/mol}$.",
  },
  {
    id: "ms-2024-09-22-40",
    turi: "ochiq",
    mavzu: "Chumoli kislota va gomologi aralashmasi (kumush ko'zgu)",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$A$ va $B$ to'yingan monokarbon kislotalardan (gomologik qatorda $A$ avvalroq keladi) iborat $48\\text{ g}$ aralashma $160\\text{ g}$ $28\\%$ li $\\ce{KOH}$ eritmasi bilan to'liq ta'sirlashadi. Xuddi shunday $48\\text{ g}$ aralashma \"kumush ko'zgu\" reaksiyasiga kirishdi va reaksiyadan keyingi moddalar aralashmasiga $\\ce{NaOH}$ ta'sir ettirilganda $200\\text{ g}$ $24\\%$ li ishqor eritmasi sarflandi (nordon tuz hosil bo'lmagan). Aralashmadagi $A$ kislotaning massasini ($\\text{g}$) toping.",
    correct: "18.4",
    tolerance: 0.2,
    birlik: "g",
    explanation:
      "Faqat chumoli kislota ($\\ce{HCOOH}$, $A$) kumush ko'zgu reaksiyasiga kirishib $\\ce{(NH4)2CO3}$ (yoki $\\ce{CO2}$) beradi va $2\\text{ mol}$ $\\ce{NaOH}$ sarflaydi. $n(\\ce{KOH}) = \\frac{160 \\cdot 0{,}28}{56} = 0{,}8\\text{ mol} \\Rightarrow a + b = 0{,}8$. $n(\\ce{NaOH}) = \\frac{200 \\cdot 0{,}24}{40} = 1{,}2\\text{ mol} \\Rightarrow 2a + b = 1{,}2$. Ayirib topsak: $a = 0{,}4\\text{ mol}$ $\\ce{HCOOH}$, $b = 0{,}4\\text{ mol}$ $B$ ($M_B = (48 - 18{,}4)/0{,}4 = 74$, propion kislota). $m(\\ce{HCOOH}) = 0{,}4 \\cdot 46 = 18{,}4\\text{ g}$.",
  },
]

export default savollar
