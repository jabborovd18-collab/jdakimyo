// 2026-yil 21-fevral, II smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Teng mol miqdorda yodid va ortofosfat kislotalar tutuvchi eritmaga $200\\text{ g}$ $15\\%$ li $\\ce{CaBr2}$ eritmasi qo'shildi. " +
  "Hosil bo'lgan cho'kma filtrlab olindi va eritmada faqat kislotalar hamda suv qoldi. " +
  "Filtratga ortiqcha miqdorda $\\ce{AgNO3}$ qo'shilganda jami $0{,}6\\text{ mol}$ cho'kmalar hosil bo'ldi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$0{,}1$",
  B: "$0{,}2$",
  C: "$0{,}4$",
  D: "$0{,}6$",
  E: "$1$",
  F: "$0{,}8$",
}

const savollar = [
  {
    id: "ms-2026-02-21-2-1",
    turi: "variant",
    mavzu: "Metallarning fizik xossalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Berilgan metallar qatori: $\\ce{Cu}$, $\\ce{Hg}$, $\\ce{Au}$, $\\ce{Ag}$, $\\ce{Na}$, $\\ce{W}$. Metallarning quyidagi fizik xossalariga mos keladigan ketma-ketlikni toping: qizil metall; eng yuqori erish haroratiga ega metall; suyuq agregat holatdagi metall (n.sh.); yumshoq metall (pichoq bilan kesish mumkin); sariq metall; oq yaltiroq metall.",
    options: [
      "$\\ce{Na, Ag, Au, Hg, Cu, W}$",
      "$\\ce{Ag, W, Na, Au, Cu, Hg}$",
      "$\\ce{Cu, W, Hg, Na, Au, Ag}$",
      "$\\ce{W, Cu, Na, Hg, Ag, Au}$",
    ],
    correct: 2,
    explanation:
      "Qizil metall — $\\ce{Cu}$, eng qiyin suyuqlanuvchi — $\\ce{W}$, suyuq — $\\ce{Hg}$, pichoq bilan kesiladigan yumshoq — $\\ce{Na}$, sariq — $\\ce{Au}$, oq yaltiroq — $\\ce{Ag}$. Tartib: $\\ce{Cu, W, Hg, Na, Au, Ag}$.",
  },
  {
    id: "ms-2026-02-21-2-2",
    turi: "variant",
    mavzu: "Aromatik uglevodorodlar: naftalin",
    soha: "Organik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-21-2/savol-2.png",
    question:
      "Yuqorida struktur formulasi keltirilgan naftalin haqidagi to'g'ri ma'lumotlarni aniqlang:\n" +
      "$1)$ molyar massasi $130\\text{ g/mol}$;\n" +
      "$2)$ uning molekulasida $18$ ta atom bor;\n" +
      "$3)$ molekuladagi vodorod atomlari soni uglerod atomlari sonidan ko'p;\n" +
      "$4)$ toshko'mir smolasi fraksiyasidan olinadi.",
    options: ["$1, 3$", "$2, 4$", "$1, 4$", "$2, 3$"],
    correct: 1,
    explanation:
      "Naftalinning formulasi $\\ce{C10H8}$, $M = 128\\text{ g/mol}$ ($1$ xato). Atomlar soni $10 + 8 = 18$ ta ($2$ to'g'ri), $8 < 10$ ($3$ xato) va sanoatda toshko'mir smolasidan olinadi ($4$ to'g'ri).",
  },
  {
    id: "ms-2026-02-21-2-3",
    turi: "variant",
    mavzu: "Asosli tuzlar hosil bo'lishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$200\\text{ g}$ $4{,}9\\%$ li sulfat kislota eritmasida $15{,}6\\text{ g}$ $\\ce{Al(OH)3}$ eritildi. Ma'lum vaqtdan so'ng eritmada faqat bitta tuz va suv qoldi. Hosil bo'lgan tuz massasini ($\\text{g}$) toping.",
    options: ["$31{,}8$", "$21{,}8$", "$34{,}2$", "$68{,}4$"],
    correct: 1,
    explanation:
      "$n(\\ce{H2SO4}) = 9{,}8/98 = 0{,}1\\text{ mol}$, $n(\\ce{Al(OH)3}) = 15{,}6/78 = 0{,}2\\text{ mol}$. Reaksiya: $\\ce{2Al(OH)3 + H2SO4 -> [Al(OH)2]2SO4 + 2H2O}$. Tuz massasi: $9{,}8 + 15{,}6 - 0{,}2\\cdot 18 = 21{,}8\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-2-4",
    turi: "variant",
    mavzu: "Atomlarning elektron konfiguratsiyasi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Qo'zg'almagan holatda qaysi elementning tashqi $p$-pog'onachasida $3$ ta elektron mavjud?",
    options: ["Alyuminiy", "Qo'rg'oshin", "Xrom", "Mishyak"],
    correct: 3,
    explanation:
      "VA guruh elementi mishyak ($\\ce{As}$, tartib raqami $33$) ning valent qobig'i $4s^2 4p^3$ bo'lib, tashqi $p$-pog'onachada $3$ ta elektron joylashgan.",
  },
  {
    id: "ms-2026-02-21-2-5",
    turi: "variant",
    mavzu: "Yadro reaksiyalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$^{248}_{97}\\text{Bk} \\rightarrow {}_{90}\\text{Th} + x\\,\\alpha + y\\,e^- + y\\,n + x\\,\\gamma$ yadro reaksiyasida $74{,}4\\text{ g}$ berkliy izotopi parchalanganda $1{,}806 \\cdot 10^{23}$ ta neytron hosil bo'ldi. Toriy izotopidagi neytronlar sonini toping.",
    options: ["$131$", "$141$", "$151$", "$231$"],
    correct: 1,
    explanation:
      "$n(\\text{Bk}) = 74{,}4/248 = 0{,}3\\text{ mol}$, $n(n) = 1{,}806/6{,}02 = 0{,}3\\text{ mol} \\Rightarrow y = 1$. Zaryad saqlanishidan: $97 = 90 + 2x - 1 \\Rightarrow x = 4$. Massa soni: $A_{\\text{Th}} = 248 - 4\\cdot 4 - 1 = 231$. Neytronlar: $231 - 90 = 141$.",
  },
  {
    id: "ms-2026-02-21-2-6",
    turi: "variant",
    mavzu: "Molekulalardagi $\\sigma$-bog'lar soni",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Quyidagi moddalar molekulalarida $\\sigma$-bog'lar sonining o'zgarishi qaysi javobda to'g'ri ko'rsatilgan?\n" +
      "$a)$ Pirofosfat kislotasi ($\\ce{H4P2O7}$);   $b)$ Etoksietan;   $c)$ Moy kislotasi.",
    options: ["$b > c > a$", "$c > a > b$", "$c < a < b$", "$b < c < a$"],
    correct: 0,
    explanation:
      "$\\sigma$-bog'lar soni: etoksietan ($\\ce{C4H10O}$) da $15 - 1 = 14$, moy kislotasi ($\\ce{C3H7COOH}$) da $14 - 1 = 13$, pirofosfat kislotasi ($\\ce{H4P2O7}$) da $12$. Tartib: $b > c > a$.",
  },
  {
    id: "ms-2026-02-21-2-7",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Yopiq $X\\text{ litr}$ hajmli reaktorda etan va kislorod aralashmasi yoqildi. Etanning sarf tezligi $1{,}2\\text{ mol/(l}\\cdot\\text{min)}$ bo'lib, yonish $2\\text{ daqiqa}$ davom etdi. Hosil bo'lgan suv bug'lari kondensatsiyalanib idishdan chiqarildi. Agar idishdagi massa boshlang'ichga nisbatan $324\\text{ g}$ ga kamaygan bo'lsa, $X$ ni aniqlang.",
    options: ["$3$", "$2$", "$1{,}5$", "$2{,}5$"],
    correct: 3,
    explanation:
      "Chiqarilgan suv miqdori $n(\\ce{H2O}) = 324/18 = 18\\text{ mol}$. $\\ce{C2H6}$ dan $3\\text{ mol }\\ce{H2O}$ hosil bo'lgani uchun $n(\\ce{C2H6}) = 18/3 = 6\\text{ mol}$. $C = v\\cdot t = 1{,}2\\cdot 2 = 2{,}4\\text{ mol/l} \\Rightarrow X = 6/2{,}4 = 2{,}5\\text{ litr}$.",
  },
  {
    id: "ms-2026-02-21-2-8",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat hisoblashlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$24{,}2\\text{ g}$ metan va suv bug'i aralashmasi $1\\text{ litr}$ li idishga solindi, bunda vodorod atomlari $3{,}8\\text{ mol}$ edi. $\\ce{CH4(g) + 2H2O(g) <=> CO2(g) + 4H2(g)}$ reaksiyasida muvozanat holatida $[\\ce{H2}] = [\\ce{H2O}]$ bo'ldi. Muvozanat aralashmasi n.sh. ga keltirilganda gazlar hajmini ($\\text{l}$) aniqlang.",
    options: ["$26{,}88$", "$38{,}08$", "$24{,}64$", "$22{,}4$"],
    correct: 2,
    explanation:
      "$16x + 18y = 24{,}2$ va $4x + 2y = 3{,}8 \\Rightarrow x = 0{,}5\\text{ mol }\\ce{CH4}$, $y = 0{,}9\\text{ mol }\\ce{H2O}$. Muvozanatda $4a = 0{,}9 - 2a \\Rightarrow a = 0{,}15\\text{ mol}$. N.sh. da suv kondensatsiyalanadi, qolgan gazlar: $0{,}35\\ (\\ce{CH4}) + 0{,}15\\ (\\ce{CO2}) + 0{,}60\\ (\\ce{H2}) = 1{,}1\\text{ mol} = 24{,}64\\text{ litr}$.",
  },
  {
    id: "ms-2026-02-21-2-9",
    turi: "variant",
    mavzu: "Eritma konsentratsiyasi va eruvchanlik",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "$0{,}1\\text{ kg}$ ifloslangan osh tuzi $0{,}24\\text{ kg}$ suvda eritilganda hosil bo'lgan eritmadagi tuzning massa ulushi $25\\%$ bo'ldi (qo'shimchalar suvda erimaydi). Osh tuzi tarkibidagi qo'shimchaning massa ulushini ($\\%$) toping.",
    options: ["$15$", "$20$", "$40$", "$60$"],
    correct: 1,
    explanation:
      "Eritmaga o'tgan $\\ce{NaCl}$ massasi $x$ bo'lsa, $x / (x + 240) = 0{,}25 \\Rightarrow 0{,}75x = 60 \\Rightarrow x = 80\\text{ g}$. Qo'shimcha massasi $100 - 80 = 20\\text{ g}$, ya'ni $20\\%$.",
  },
  {
    id: "ms-2026-02-21-2-10",
    turi: "variant",
    mavzu: "Tuzlarning gidrolizi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Gidrolizga uchramaydigan tuzni toping.",
    options: [
      "Kaliy xlorid",
      "Magniy nitrat",
      "Alyuminiy xlorid",
      "Natriy sulfit",
    ],
    correct: 0,
    explanation:
      "Kuchli asos ($\\ce{KOH}$) va kuchli kislota ($\\ce{HCl}$) dan hosil bo'lgan kaliy xlorid ($\\ce{KCl}$) suvda gidrolizlanmaydi, muhiti neytral ($\\text{pH} = 7$) bo'ladi.",
  },
  {
    id: "ms-2026-02-21-2-11",
    turi: "variant",
    mavzu: "Kuchsiz kislotalarning dissotsilanishi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$0{,}4\\%$ li $\\ce{HF}$ eritmasining massasi $1000\\text{ g}$. Agar kislotaning dissotsilanish darajasi $2\\%$ bo'lsa, eritmadagi vodorod ionlari ($\\ce{H+}$) miqdorini ($\\text{mol}$) aniqlang.",
    options: ["$0{,}002$", "$0{,}004$", "$0{,}003$", "$0{,}01$"],
    correct: 1,
    explanation:
      "$m(\\ce{HF}) = 1000 \\cdot 0{,}004 = 4\\text{ g}$, $n(\\ce{HF}) = 4/20 = 0{,}2\\text{ mol}$. $\\alpha = 0{,}02$ bo'lgani uchun $n(\\ce{H+}) = 0{,}2 \\cdot 0{,}02 = 0{,}004\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-2-12",
    turi: "variant",
    mavzu: "Valentlik va oksidlanish darajasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Quyidagi moddalardagi qavs ichida ko'rsatilgan element atomining valentligi va oksidlanish darajasini moslang:\n" +
      "$1)\\ \\ce{CH4}\\ (\\text{H});\\quad 2)\\ \\ce{H2O2}\\ (\\text{O});\\quad 3)\\ \\ce{H2Se}\\ (\\text{Se})$.\n" +
      "$a)\\ \\text{II}; -2;\\quad b)\\ \\text{II}; -1;\\quad c)\\ \\text{IV}; -1;\\quad d)\\ \\text{I}; +1;\\quad e)\\ \\text{I}; -1$.",
    options: [
      "$1$-e; $2$-a; $3$-b",
      "$1$-c; $2$-b; $3$-d",
      "$1$-d; $2$-b; $3$-a",
      "$1$-b; $2$-c; $3$-e",
    ],
    correct: 2,
    explanation:
      "$\\ce{CH4}$ da vodorod valentligi I, oksidlanish darajasi $+1$ ($d$); $\\ce{H2O2}$ da kislorod valentligi II, oksidlanish darajasi $-1$ ($b$); $\\ce{H2Se}$ da selen valentligi II, oksidlanish darajasi $-2$ ($a$).",
  },
  {
    id: "ms-2026-02-21-2-13",
    turi: "variant",
    mavzu: "Metallarning korroziyadan himoyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Quyidagi metallar juftidan qaysi biri temir buyumlarni tegishlicha anod va katod qoplamasi sifatida himoya qiladi?",
    options: ["$\\ce{Zn, Cr}$", "$\\ce{Ni, Ti}$", "$\\ce{Zn, Sn}$", "$\\ce{Au, Cr}$"],
    correct: 2,
    explanation:
      "Temirdan aktivroq rux ($\\ce{Zn}$, $E^\\circ = -0{,}76\\text{ V} < -0{,}44\\text{ V}$) anod qoplamasi, passivroq qalay ($\\ce{Sn}$, $E^\\circ = -0{,}14\\text{ V} > -0{,}44\\text{ V}$) esa katod qoplamasi hisoblanadi.",
  },
  {
    id: "ms-2026-02-21-2-14",
    turi: "variant",
    mavzu: "Azot birikmalarining genetik qatori",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-21-2/savol-14.png",
    question:
      "Ushbu sxemadagi noma'lum $B$ modda alyuminiyga juda suyultirilgan $\\ce{HNO3}$ eritmasi ta'sir etganda ham hosil bo'ladi. Sxemadagi $X$ va $A$ moddalarning nisbiy molekulyar massalari yig'indisini aniqlang.",
    options: ["$124$", "$61$", "$97$", "$46$"],
    correct: 1,
    explanation:
      "$\\ce{Al}$ juda suyultirilgan $\\ce{HNO3}$ bilan $\\ce{NH4NO3}$ ($B$) hosil qiladi. $X = \\ce{NH3}$ ($M = 17$), $\\ce{NH4NO3 -> N2O + 2H2O}$ bo'lgani uchun $A = \\ce{N2O}$ ($M = 44$). Yig'indisi: $17 + 44 = 61$.",
  },
  {
    id: "ms-2026-02-21-2-15",
    turi: "variant",
    mavzu: "Karbonillar va uglerod oksidlari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$X$ oksid — inson hayoti uchun xavfli zaharli modda. Uning tarkibida noma'lum element va kislorodning valentliklari teng. Noma'lum element metallar bilan karbonil hosil qiladi. $X$ oksid tarkibidagi noma'lum element valentligini aniqlang.",
    options: ["$2$", "$3$", "$4$", "$1$"],
    correct: 0,
    explanation:
      "Metallar bilan karbonillar ($\\ce{Fe(CO)5}$, $\\ce{Ni(CO)4}$) hosil qiluvchi zaharli oksid — is gazi ($\\ce{CO}$). Unda uglerod va kislorod valentliklari teng (ikkisi ham II valentli, donor-akseptor bog' bilan III valentlik ko'rsatishi ham mumkin; ekvivalentlik shartiga ko'ra II).",
  },
  {
    id: "ms-2026-02-21-2-16",
    turi: "variant",
    mavzu: "Anorganik moddalarning qo'llanilishi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "Moddalarni ($1$–$4$) ularning ishlatilish sohasi ($a$–$h$) bilan to'g'ri moslang:\n" +
      "$1)$ xlor; $2)$ ammiak; $3)$ osh tuzi; $4)$ oltingugurt.\n" +
      "$a)$ matolar va qog'ozni oqartirish; $b)$ $\\ce{HNO3}$ ishlab chiqarish; $c)$ fiziologik eritma tayyorlash; $d)$ gugurt ishlab chiqarish; $e)$ $\\ce{Na}$ va $\\ce{NaOH}$ olish; $f)$ ichimlik suvini tozalash; $g)$ kauchukni vulkanizatsiya qilish; $h)$ mineral o'g'itlar ishlab chiqarish.",
    options: [
      "$1$-a,b; $2$-c,d; $3$-e,f; $4$-g,h",
      "$1$-a,f; $2$-b,h; $3$-c,e; $4$-d,g",
      "$1$-c,h; $2$-d,g; $3$-a,e; $4$-b,f",
      "$1$-d,g; $2$-c,h; $3$-b,f; $4$-a,e",
    ],
    correct: 1,
    explanation:
      "Xlor oqartirish va suvni zararsizlantirishda ($a, f$); ammiak nitrat kislota va o'g'itlarda ($b, h$); osh tuzi fiziologik eritma va natriy/ishqor olishda ($c, e$); oltingugurt gugurt va vulkanizatsiyada ($d, g$) ishlatiladi.",
  },
  {
    id: "ms-2026-02-21-2-17",
    turi: "variant",
    mavzu: "Fosfor kislotalarining tuzilishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "Fosforning barcha anorganik kislotalarda besh valentli ekanligini bilgan holda, $\\ce{H3PO3}$ va $\\ce{H3PO2}$ molekulalari tarkibidagi jami $\\sigma$- va $\\pi$-bog'lar sonini hisoblang.",
    options: ["$10$", "$11$", "$12$", "$13$"],
    correct: 3,
    explanation:
      "$\\ce{H3PO3}$ ($\\ce{H-P(=O)(OH)2}$) da $6$ ta $\\sigma$ va $1$ ta $\\pi$ (jami $7$); $\\ce{H3PO2}$ ($\\ce{H2P(=O)OH}$) da $5$ ta $\\sigma$ va $1$ ta $\\pi$ (jami $6$). Umumiy bog'lar yig'indisi: $7 + 6 = 13$.",
  },
  {
    id: "ms-2026-02-21-2-18",
    turi: "variant",
    mavzu: "Galogenidlar aralashmasi va qattiq qoldiq",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$5{,}34\\text{ g}$ $\\ce{NaCl}$ va $\\ce{NaI}$ aralashmasi solingan idishdan $1{,}12\\text{ litr}$ (n.sh.) xlor gazi o'tkazildi. So'ng aralashma $300^\\circ\\text{C}$ da doimiy massagacha qizdirilganda $3{,}51\\text{ g}$ qattiq qoldiq olindi. Boshlang'ich aralashmadagi osh tuzi massasini ($\\text{g}$) aniqlang.",
    options: ["$3$", "$2{,}34$", "$5{,}85$", "$1{,}17$"],
    correct: 1,
    explanation:
      "$n(\\ce{Cl2}) = 0{,}05\\text{ mol}$ ($0{,}1\\text{ mol }\\ce{NaI}$ gacha siqib chiqaradi). $\\ce{2NaI + Cl2 -> 2NaCl + I2 ^}$ da $1\\text{ mol }\\ce{NaI}$ ($150$) dan $\\ce{NaCl}$ ($58{,}5$) ga o'tishda massa $91{,}5\\text{ g}$ kamayadi. $\\Delta m = 5{,}34 - 3{,}51 = 1{,}83\\text{ g} \\Rightarrow n(\\ce{NaI}) = 1{,}83/91{,}5 = 0{,}02\\text{ mol}$ ($3\\text{ g}$). Demak, $m(\\ce{NaCl}) = 5{,}34 - 3 = 2{,}34\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-2-19",
    turi: "variant",
    mavzu: "Ammofosfatlar aralashmasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$1{,}4\\text{ mol}$ $(\\ce{NH4})_3\\ce{PO4}$, $(\\ce{NH4})_2\\ce{HPO4}$ va $\\ce{NH4H2PO4}$ dan iborat aralashmada azot massasi fosfor massasiga teng ($m(\\text{N}) = m(\\text{P})$). Aralashmadagi azotning massasini ($\\text{g}$) aniqlang.",
    options: ["$49$", "$37{,}8$", "$42$", "$43{,}4$"],
    correct: 3,
    explanation:
      "Har bir tuz formulasida $1$ tadan fosfor atomi bo'lgani uchun $n(\\text{P}) = 1{,}4\\text{ mol}$. Shuning uchun $m(\\text{N}) = m(\\text{P}) = 1{,}4 \\cdot 31 = 43{,}4\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-2-20",
    turi: "variant",
    mavzu: "Alkanlarning termik krekingi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Quyidagi juft moddalardan qaysilari $2$-metilpentanni termik kreking qilishda hosil BO'LMAYDI?\n" +
      "$1)$ $3$-metilbuten-$1$ va metan; $2)$ etan va penten-$2$; $3)$ $2$-metilpropan va eten;\n" +
      "$4)$ $n$-butan va etilen; $5)$ propen va propan; $6)$ etan va buten-$2$.",
    options: ["$1, 4, 6$", "$2, 3, 5$", "$2, 4, 6$", "$1, 3, 5$"],
    correct: 2,
    explanation:
      "$2$-metilpentandan bitta $\\ce{C-C}$ bog' uzilishida tarmoqlanmagan $n$-butan ($4$), etan + buten-$2$ ($6$) yoki etan + penten-$2$ ($2$) juftlari hosil bo'lmaydi. Javob: $2, 4, 6$.",
  },
  {
    id: "ms-2026-02-21-2-21",
    turi: "variant",
    mavzu: "Alkinlar va alkadienlar galogenlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Tarkibi $\\ce{C_n H_{2n-2}}$ bo'lgan uglevodorod to'liq xlorlanganda $21\\text{ g}$ tetraxlor hosilasi olindi. Xuddi shuncha miqdordagi uglevodorod to'liq bromlanganda esa $38{,}8\\text{ g}$ tetrabrom hosilasi olindi. Uglevodorod formulasini toping.",
    options: [
      "$\\ce{C5H8}$",
      "$\\ce{C5H10}$",
      "$\\ce{C4H8}$",
      "$\\ce{C4H10}$",
    ],
    correct: 0,
    explanation:
      "$21 / (14n + 140) = 38{,}8 / (14n + 318)$. $n = 5$ da $21/210 = 0{,}1\\text{ mol}$ va $38{,}8/388 = 0{,}1\\text{ mol}$. Uglevodorod formulasi $\\ce{C5H8}$.",
  },
  {
    id: "ms-2026-02-21-2-22",
    turi: "variant",
    mavzu: "Aldozalarning oksidlanishi va qaytarilishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Noma'lum organik modda kumush oksidining ammiakli eritmasi bilan oksidlanganda $39{,}2\\text{ g}$ kislota hosil bo'ldi. Xuddi shuncha miqdordagi modda qaytarilganda esa $36{,}4\\text{ g}$ spirt olindi. Hosil bo'lgan kislotani aniqlang.",
    options: [
      "moy kislotasi",
      "valerian kislotasi",
      "kapron kislotasi",
      "glukon kislotasi",
    ],
    correct: 3,
    explanation:
      "$-\\ce{CHO}$ dan $-\\ce{COOH}$ ga o'tishda massa $+16$, $-\\ce{CH2OH}$ ga o'tishda $+2$ ortadi. Farq: $16 - 2 = 14\\text{ g/mol}$. $n = (39{,}2 - 36{,}4)/14 = 0{,}2\\text{ mol} \\Rightarrow M(\\text{kislota}) = 39{,}2/0{,}2 = 196\\text{ g/mol}$ — bu glukon kislotasi ($\\ce{C6H12O7}$).",
  },
  {
    id: "ms-2026-02-21-2-23",
    turi: "variant",
    mavzu: "Arenlarning galogenlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$55{,}2\\text{ g}$ toluol bromlanganda $2:1$ mol nisbatda $2,4$-dibromtoluol va $4$-bromtoluol aralashmasi hosil bo'ldi. Ajralgan gazni to'liq neytrallash uchun zarur bo'lgan $20\\%$ li $\\ce{NaOH}$ eritmasi ($\\rho = 1{,}25\\text{ g/ml}$) hajmini ($\\text{ml}$) hisoblang.",
    options: ["$200$", "$160$", "$180$", "$120$"],
    correct: 1,
    explanation:
      "$n(\\text{toluol}) = 55{,}2/92 = 0{,}6\\text{ mol}$ ($0{,}4\\text{ mol}$ dibrom + $0{,}2\\text{ mol}$ monobrom). Ajralgan $\\ce{HBr} = 0{,}4\\cdot 2 + 0{,}2\\cdot 1 = 1{,}0\\text{ mol}$. $m(\\ce{NaOH}) = 40\\text{ g}$, $m(\\text{eritma}) = 200\\text{ g}$, $V = 200/1{,}25 = 160\\text{ ml}$.",
  },
  {
    id: "ms-2026-02-21-2-24",
    turi: "variant",
    mavzu: "Organik moddalarda oksidlanish darajasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Propil atsetat molekulasida uglerod va kislorod atomlarining oksidlanish darajalari yig'indisini toping.",
    options: ["$-11$", "$-12$", "$-10$", "$-13$"],
    correct: 2,
    explanation:
      "Propil atsetat ($\\ce{CH3COOC3H7} = \\ce{C5H10O2}$) elektroneytral molekula bo'lib, $10$ ta vodorod atomining umumiy oksidlanish darajasi $+10$ ga teng. Shuning uchun $\\text{C}$ va $\\text{O}$ atomlarining oksidlanish darajalari yig'indisi $-10$ ga teng.",
  },
  {
    id: "ms-2026-02-21-2-25",
    turi: "variant",
    mavzu: "Izomerlar: karbon kislotalar va murakkab efirlar",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$A$ va $B$ moddalarning umumiy formulasi $\\ce{C_n H_{2n} O2}$. $A$ modda gidrolizlanganda hosil bo'lgan modda «kumush ko'zgu» reaksiyasiga kirishadi, $B$ modda esa lakmusni qizil rangga bo'yaydi. Moddalardan birining $35{,}2\\text{ g}$ miqdori yoqilganda hosil bo'lgan gaz ohakli suvdan o'tkazilib $160\\text{ g}$ cho'kma olindi. $n$ qiymatini toping.",
    options: ["$3$", "$4$", "$5$", "$6$"],
    correct: 1,
    explanation:
      "$n(\\ce{CO2}) = n(\\ce{CaCO3}) = 160/100 = 1{,}6\\text{ mol}$. $35{,}2 / (14n + 32) = 1{,}6 / n \\Rightarrow 35{,}2n = 22{,}4n + 51{,}2 \\Rightarrow 12{,}8n = 51{,}2 \\Rightarrow n = 4$.",
  },
  {
    id: "ms-2026-02-21-2-26",
    turi: "variant",
    mavzu: "Aminlar va aminokislotalarning qiyosiy xossalari",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Metilamin glitsinga o'xshab:\n" +
      "$1)$ to'liq yonishda $\\ce{CO2}$, $\\ce{H2O}$ va $\\ce{N2}$ hosil qiladi;\n" +
      "$2)$ ishqoriy muhitga ega;\n" +
      "$3)$ xlorid kislota bilan reaksiyaga kirishadi;\n" +
      "$4)$ aminokislotalar sinfiga kiradi.",
    options: ["$1, 2$", "$3, 4$", "$2, 4$", "$1, 3$"],
    correct: 3,
    explanation:
      "Ikkala modda ham yonganda $\\ce{CO2, H2O, N2}$ beradi ($1$) va $-\\ce{NH2}$ guruhi hisobiga $\\ce{HCl}$ bilan tuz hosil qiladi ($3$). Glitsin muhiti neytral, metilamin esa aminokislota emas.",
  },
  {
    id: "ms-2026-02-21-2-27",
    turi: "variant",
    mavzu: "Disaxaridlar gidrolizi va bijg'ish",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Maltoza $45\\text{ g}$ suv bilan to'liq gidroliz qilindi. Hosil bo'lgan yagona mahsulot moy kislotali bijg'itildi. Bijg'ish mahsulotlari bilan to'liq reaksiyaga kirishishi uchun necha mol $\\ce{NaOH}$ kerak (o'rta tuzlar hosil bo'ladi deb hisoblang)?",
    options: ["$5$", "$25$", "$10$", "$20$"],
    correct: 1,
    explanation:
      "$45\\text{ g}$ $\\ce{H2O}$ ($2{,}5\\text{ mol}$) dan $5\\text{ mol}$ glukoza olinadi. Moy kislotali bijg'ish: $\\ce{C6H12O6 -> C3H7COOH + 2CO2 + 2H2}$. $5\\text{ mol}$ kislota $5\\text{ mol}$, $10\\text{ mol}$ $\\ce{CO2}$ esa $20\\text{ mol}$ $\\ce{NaOH}$ bilan o'rta tuz beradi: jami $25\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-2-28",
    turi: "variant",
    mavzu: "Tabiiy aminokislotalar aralashmasi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Teng mol nisbatdagi tabiiy aminokislotalar aralashmasi metanol bilan to'liq eterifikatsiyalanganda $9{,}6\\text{ g}$ metanol sarflandi. Xuddi shuncha aralashma to'liq yoqilganda $20{,}16\\text{ l}$ (n.sh.) gaz aralashmasi ($\\ce{CO2 + N2}$) hosil bo'lib, uning o'rtacha molyar massasi $41{,}33\\text{ g/mol}$ chiqdi. Aminokislotalarni aniqlang.",
    options: [
      "Glitsin, alanin",
      "Alanin, serin",
      "Glitsin, fenilalanin",
      "Lizin, fenilalanin",
    ],
    correct: 0,
    explanation:
      "$n(\\ce{CH3OH}) = 9{,}6/32 = 0{,}3\\text{ mol}$. Gaz ($0{,}9\\text{ mol}$): $44(1-f) + 28f = 41{,}33 \\Rightarrow f = 1/6 \\Rightarrow 0{,}15\\text{ mol }\\ce{N2}$ va $0{,}75\\text{ mol }\\ce{CO2}$. Har bir kislotada o'rtacha $\\text{C} = 0{,}75/0{,}3 = 2{,}5$ ta: bu glitsin ($\\ce{C2}$) va alanin ($\\ce{C3}$) dir.",
  },
  {
    // Izoh: manba DOCX da 29-savol jadvalidagi monomer/polimer formulalari bo'sh qolgani uchun 2026-yil 22-fevral I smenadagi 26-savol bilan almashtirildi
    id: "ms-2026-02-21-2-29",
    turi: "variant",
    mavzu: "Polisaxaridlar: kraxmal xossalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Kraxmal haqidagi to'g'ri fikrlarni aniqlang:\n" +
      "$1)$ o'simlikda zaxira energiya vazifasini bajaradigan asosiy polisaxarid;\n" +
      "$2)$ o'simlik hujayra devorida tayanch vazifasini bajaradigan polisaxarid;\n" +
      "$3)$ oq rangli amorf kukun, sovuq suvda erimaydi, issiq suvda bo'kib kolloid eritma hosil qiladi;\n" +
      "$4)$ gidrolizlanganda $\\beta$-glukoza hosil bo'ladi;\n" +
      "$5)$ qog'oz ishlab chiqarishda asosiy xomashyo.",
    options: ["$1, 3$", "$2, 5$", "$1, 5$", "$3, 4$"],
    correct: 0,
    explanation:
      "Kraxmal o'simliklarda energiya zaxirasi bo'lgan ($1$) va issiq suvda kolloid eritma (kleyster) hosil qiluvchi ($3$) $\\alpha$-glukoza polisaxarididir. $2, 4, 5$ xossalar sellyulozaga tegishli.",
  },
  {
    id: "ms-2026-02-21-2-30",
    turi: "variant",
    mavzu: "Laboratoriya qurilmasi va reaksiya turi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2026-02-21-2/savol-30.png",
    question: "Ushbu laboratoriyada olib borilgan jarayon qaysi reaksiya turiga kiradi?",
    options: ["O'rin olish", "Parchalanish", "Almashinish", "Birikish"],
    correct: 0,
    explanation:
      "Rasmda rux metaliga xlorid kislota ta'sir ettirib vodorod olish ($\\ce{Zn + 2HCl -> ZnCl2 + H2 ^}$) ko'rsatilgan — bu o'rin olish reaksiyasidir.",
  },
  {
    id: "ms-2026-02-21-2-31",
    turi: "variant",
    mavzu: "Vodorod olish va oksidlarni qaytarish",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2026-02-21-2/savol-31.png",
    question:
      "Ushbu laboratoriya tajribasiga oid to'g'ri fikrlarni belgilang:\n" +
      "$1)$ Ikkala reaksiya ham oksidlanish-qaytarilish reaksiyalariga kiradi.\n" +
      "$2)$ Ikkala reaksiya ham almashinish reaksiyalari.\n" +
      "$3)$ Ikkala reaksiya natijasida ham vodorod hosil bo'ladi.\n" +
      "$4)$ Chap tomondagi qizdirilayotgan probirkada qora modda qizil moddaga aylanadi.",
    options: ["$1, 2$", "$3, 4$", "$1, 4$", "$2, 3$"],
    correct: 2,
    explanation:
      "O'ng idishda $\\ce{Zn + H2SO4 -> ZnSO4 + H2}$, chapda $\\ce{CuO + H2 -> Cu + H2O}$ boradi. Ikkalasi ham OQR ($1$ to'g'ri) va qora $\\ce{CuO}$ qizil misga qaytariladi ($4$ to'g'ri).",
  },
  {
    id: "ms-2026-02-21-2-32",
    turi: "variant",
    mavzu: "Uglevodorodlar zanjiri: metan, asetilen, benzol",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$A$ modda qizdirilganda $B$ oddiy modda va $C$ murakkab modda hosil bo'ladi. $C$ modda aktivlashtirilgan ko'mir ustidan o'tkazilganda $C$ ga nisbatan $3$ marta og'ir $D$ suyuqlik hosil bo'ladi. $D$ modda yuqori harorat va platina katalizatori ishtirokida ($B$ bilan) $E$ moddani hosil qiladi. $E$ moddani aniqlang.",
    options: ["asetilen", "siklogeksan", "xlorbenzol", "benzol"],
    correct: 1,
    explanation:
      "$A = \\ce{CH4}$ pirolizidan $B = \\ce{H2}$ va $C = \\ce{C2H2}$ ($M=26$) olinadi. Trimerlanishdan $D = \\ce{C6H6}$ ($M = 78 = 3\\cdot 26$). Benzolni $\\text{Pt}$ katalizatorida gidrogenlashdan $E =$ siklogeksan ($\\ce{C6H12}$) hosil bo'ladi.",
  },
  {
    id: "ms-2026-02-21-2-33",
    turi: "moslashtirish",
    mavzu: "Kislotalar va tuzlar orasidagi cho'kma reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. $\\ce{Ag3PO4}$ cho'kmasining miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "A",
    explanation:
      "$n(\\ce{CaBr2}) = (200\\cdot 0{,}15)/200 = 0{,}15\\text{ mol}$ $\\ce{Ca^{2+}}$ ionlari $0{,}1\\text{ mol}$ $\\ce{H3PO4}$ ni $\\ce{Ca3(PO4)2}$ qilib cho'ktiradi va eritmaga $0{,}3\\text{ mol}$ $\\ce{HBr}$ beradi. $x + (x - 0{,}1) + 0{,}3 = 0{,}6 \\Rightarrow x = 0{,}2\\text{ mol}$. Demak, $n(\\ce{Ag3PO4}) = 0{,}2 - 0{,}1 = 0{,}1\\text{ mol}$ (A).",
  },
  {
    id: "ms-2026-02-21-2-34",
    turi: "moslashtirish",
    mavzu: "Galogenidlar aralashmasida cho'ktirish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Kumush yodid ($\\ce{AgI}$) cho'kmasining miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "B",
    explanation:
      "Dastlabki teng molli kislotalardan yodid kislota $\\ce{Ca^{2+}}$ bilan cho'kma bermaydi va to'liq saqlanib qoladi: $n(\\ce{AgI}) = n(\\ce{HI}) = x = 0{,}2\\text{ mol}$ (B).",
  },
  {
    id: "ms-2026-02-21-2-35",
    turi: "moslashtirish",
    mavzu: "Reagent sarfi hisoblashlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "35. Sarflangan $\\ce{AgNO3}$ ning umumiy miqdorini ($\\text{mol}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "F",
    explanation:
      "$0{,}3\\text{ mol }\\ce{AgBr}$ ga $0{,}3\\text{ mol}$, $0{,}2\\text{ mol }\\ce{AgI}$ ga $0{,}2\\text{ mol}$, $0{,}1\\text{ mol }\\ce{Ag3PO4}$ ga $3\\cdot 0{,}1 = 0{,}3\\text{ mol}$ sarflanadi. Jami $n(\\ce{AgNO3}) = 0{,}8\\text{ mol}$ (F).",
  },
  {
    id: "ms-2026-02-21-2-36",
    turi: "ochiq",
    mavzu: "Murakkab OQR stexiometriyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$\\ce{Cu2S + HNO3 -> Cu(NO3)2 + H2SO4 + NO + H2O}$ oksidlanish-qaytarilish reaksiyasida $0{,}16\\text{ mol}$ suv hosil bo'lgan bo'lsa, sarflangan kislotaning miqdorini ($\\text{mol}$) aniqlang.",
    correct: "0.44",
    tolerance: 0.01,
    birlik: "mol",
    explanation:
      "Tenglashtirilgan reaksiya: $\\ce{3Cu2S + 22HNO3 -> 6Cu(NO3)2 + 3H2SO4 + 10NO + 8H2O}$. $8\\text{ mol }\\ce{H2O}$ ga $22\\text{ mol }\\ce{HNO3}$ to'g'ri keladi, demak $n(\\ce{HNO3}) = 0{,}16 \\cdot 22 / 8 = 0{,}44\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-2-37",
    turi: "ochiq",
    mavzu: "Eritmalarda tuzlar va gidrokarbonatlar hosil bo'lishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$222\\text{ g}$ $5\\%$ li kalsiy xlorid eritmasiga $0{,}12\\text{ mol}$ natriy karbonat qo'shildi. Bir oz vaqt o'tib, eritma orqali $1{,}12\\text{ litr}$ (n.sh.) karbonat angidrid gazi o'tkazildi. Oxirgi eritmadagi suvning massasini ($\\text{g}$) aniqlang.",
    correct: "210",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "Dastlabki $\\ce{H2O} = 222\\cdot 0{,}95 = 210{,}9\\text{ g}$. $0{,}1\\text{ mol }\\ce{CaCO3}$ cho'kadi va $0{,}02\\text{ mol }\\ce{Na2CO3}$ ortadi. $0{,}05\\text{ mol }\\ce{CO2}$ avval $0{,}02\\text{ mol }\\ce{Na2CO3}$ bilan, keyin $0{,}03\\text{ mol }\\ce{CaCO3}$ bilan gidrokarbonatga o'tib jami $0{,}05\\text{ mol}$ ($0{,}9\\text{ g}$) suv sarflaydi: $210{,}9 - 0{,}9 = 210\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-2-38",
    turi: "ochiq",
    mavzu: "Permanganat pirolizi va xlorid kislota bilan reaksiya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$X\\text{ mol}$ kaliy permanganat qizdirilganda qattiq qoldiq hosil bo'ldi. Qoldiq $164\\text{ g}$ $36{,}5\\%$ li xlorid kislota eritmasida to'liq eritildi va jarayonda $0{,}49\\text{ mol}$ xlor gazi ajraldi. Dastlabki $X$ qiymatini ($\\text{mol}$) aniqlang.",
    correct: "0.22",
    tolerance: 0.01,
    birlik: "mol",
    explanation:
      "$n(\\ce{HCl}) = 59{,}86/36{,}5 = 1{,}64\\text{ mol}$. Parchalangan $\\ce{KMnO4}$ ($a\\text{ mol}$) dan hosil bo'lgan $\\ce{K2MnO4 + MnO2}$ $6a\\text{ mol }\\ce{HCl}$ sarflab $1{,}5a\\text{ mol }\\ce{Cl2}$, parchalanmay qolgan $b\\text{ mol }\\ce{KMnO4}$ esa $8b\\text{ mol }\\ce{HCl}$ bilan $2{,}5b\\text{ mol }\\ce{Cl2}$ beradi. $6a+8b=1{,}64$ va $1{,}5a+2{,}5b=0{,}49 \\Rightarrow a=0{,}06,\\ b=0{,}16 \\Rightarrow X = 0{,}22\\text{ mol}$.",
  },
  {
    id: "ms-2026-02-21-2-39",
    turi: "ochiq",
    mavzu: "Klatratlarning yonishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$\\ce{C_n H_{2n+2} \\cdot 17H2O}$ klatrat va ortiqcha kislorod idishda to'liq yoqildi. Hosil bo'lgan suvning massasi karbonat angidrid massasidan $12{,}3\\text{ g}$ ko'p, sarflangan kislorod massasi esa $8\\text{ g}$ ga teng bo'lsa, dastlabki klatrat massasini ($\\text{g}$) aniqlang.",
    correct: "17.5",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$n(\\ce{O2}) = 8/32 = 0{,}25\\text{ mol}$. $a(1{,}5n+0{,}5) = 0{,}25$ va $a[18(n+18) - 44n] = 12{,}3 \\Rightarrow (324-26n)/(3n+1) = 24{,}6 \\Rightarrow n = 3$ (propan, $\\ce{C3H8 \\cdot 17H2O}$, $M = 350$). $a = 0{,}05\\text{ mol}$, $m = 0{,}05 \\cdot 350 = 17{,}5\\text{ g}$.",
  },
  {
    id: "ms-2026-02-21-2-40",
    turi: "ochiq",
    mavzu: "Aldegidlarning mis(II) gidroksid bilan oksidlanishi",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$33{,}84\\text{ g}$ ($0{,}18\\text{ mol}$) $\\ce{Cu(NO3)2}$ ga ortiqcha $\\ce{NaOH}$ ta'sir ettirib olingan aralashma $3{,}08\\text{ g}$ aldegid bilan qizdirildi. Hosil bo'lgan cho'kmani $150^\\circ\\text{C}$ da doimiy massagacha quritilganda $13{,}28\\text{ g}$ qattiq qoldiq olindi. Aldegid molekulasidagi $\\sigma$-bog'lar sonini toping.",
    correct: "6",
    tolerance: 0,
    birlik: "ta",
    explanation:
      "Cho'kma $y\\text{ mol }\\ce{Cu2O}$ va $(0{,}18-2y)\\text{ mol }\\ce{CuO}$ dan iborat: $144y + 80(0{,}18-2y) = 13{,}28 \\Rightarrow 16y = 1{,}12 \\Rightarrow y = 0{,}07\\text{ mol}$. $M(\\text{aldegid}) = 3{,}08/0{,}07 = 44\\ (\\ce{CH3CHO})$. Unda $7 - 1 = 6$ ta $\\sigma$-bog' bor.",
  },
]

export default savollar
