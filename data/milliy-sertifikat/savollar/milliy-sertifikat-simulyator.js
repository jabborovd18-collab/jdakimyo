// data/milliy-sertifikat/savollar/milliy-sertifikat-simulyator.js
//
// Tayyorgarlik sinovi #1 savollari (3-Mock Sertifikat asosida, 1–40 CBT topshiriqlar).
// Shakl: docs/milliy-sertifikat/SAVOL-QOSHISH.md
// Tekshirish: npm run ms:bank

const savollar = [
  {
    id: "ms1-01",
    turi: "variant",
    mavzu: "Atom tuzilishi va izotoplar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -1.35,
    question:
      "$\\ce{^{m}S8}$ molekulasi tarkibidagi elementar zarrachalar soni $400$ ta. $m$ qiymatini toping.",
    options: ["31", "32", "33", "34"],
    correct: 3,
    explanation:
      "Oltingugurt ($\\ce{S}$) atomida $16$ ta proton va $16$ ta elektron mavjud. Neytronlar soni $m - 16$ ga teng. Bitta atomdagi elementar zarrachalar soni $16 + 16 + (m - 16) = m + 16$. $\\ce{S8}$ molekulasida $8$ ta atom bo'lgani uchun $8 \\cdot (m + 16) = 400 \\implies m + 16 = 50 \\implies m = 34$.",
  },
  {
    id: "ms1-02",
    turi: "variant",
    mavzu: "Nisbiy atom massa va massa ulushi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -1.1,
    question:
      "Quyidagi jadvaldan foydalanib, $\\ce{A2B5}$ birikmadagi $A$ ning massa ulushini toping.",
    jadval: {
      ustunlar: ["Element", "Protonlar soni", "Neytronlar soni"],
      qatorlar: [
        ["$A$", "$2x$", "$2{,}5x$"],
        ["$B$", "$1{,}2x$", "$3x$"],
      ],
    },
    options: ["0,3", "0,7", "0,48", "0,52"],
    correct: 0,
    explanation:
      "Elementlarning nisbiy atom massalari proton va neytronlar yig'indisiga teng: $A_r(A) = 2x + 2{,}5x = 4{,}5x$, $A_r(B) = 1{,}2x + 3x = 4{,}2x$. $\\ce{A2B5}$ formulasida $m(A) = 2 \\cdot 4{,}5x = 9x$, $m(B) = 5 \\cdot 4{,}2x = 21x$, umumiy massa $9x + 21x = 30x$. Demak, $\\omega(A) = \\frac{9x}{30x} = 0{,}3$.",
  },
  {
    id: "ms1-03",
    turi: "variant",
    mavzu: "Gazlar aralashmasi va nisbiy zichlik",
    soha: "Umumiy kimyo",
    daraja: "orta",
    qiyinlik: -0.35,
    question:
      "Kislorodga o'zining massasidan $40\\text{ g}$ ga yengil geliy qo'shilganda vodorodga nisbatan zichligi $8$ bo'lgan aralashma hosil bo'ldi. Qo'shilgan geliy massasini ($\\text{g}$) aniqlang.",
    options: ["4", "24", "16", "8"],
    correct: 3,
    explanation:
      "Geliy massasini $x\\text{ g}$ desak, kislorod massasi $(x + 40)\\text{ g}$ bo'ladi. Aralashmaning o'rtacha molyar massasi $M_{\\text{ar}} = 8 \\cdot 2 = 16\\text{ g/mol}$. Formula bo'yicha $\\frac{x + x + 40}{\\frac{x}{4} + \\frac{x + 40}{32}} = 16 \\implies 2x + 40 = 4x + 0{,}5x + 20 \\implies 2{,}5x = 20 \\implies x = 8\\text{ g}$.",
  },
  {
    id: "ms1-04",
    turi: "variant",
    mavzu: "Kvant sonlari va elektron konfiguratsiya",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -0.85,
    question:
      "Oxirgi elektronining kvant sonlari quyidagicha bo'lgan atom uchun to'g'ri ma'lumotlar sonini toping: $n = 3$, $l = 1$, $m_l = -1$, $m_s = +\\frac{1}{2}$.\n1) elektronlar soni $= 13$ ta;\n2) yacheykalar soni $= 14$ ta;\n3) energetik pog'onalar soni $= 3$ ta;\n4) pog'onachalar soni $= 6$ ta.",
    options: ["1", "2", "3", "4"],
    correct: 3,
    explanation:
      "Kvant sonlari $n = 3, l = 1, m_l = -1, m_s = +\\frac{1}{2}$ bo'lgan elektron $3p^1$ holatiga mos keladi — bu alyuminiy ($\\ce{Al}$, $Z = 13$) atomidir. Konfiguratsiyasi $1s^2 2s^2 2p^6 3s^2 3p^1$: jami $13$ ta elektron (1-to'g'ri), $3$ ta energetik pog'ona (3-to'g'ri). $3$ ta pog'onadagi jami orbital (yacheyka)lar soni $1^2 + 2^2 + 3^2 = 14$ ta (2-to'g'ri) va jami pog'onachalar ($1s, 2s, 2p, 3s, 3p, 3d$) soni $1 + 2 + 3 = 6$ ta (4-to'g'ri). Barcha $4$ ta fikr to'g'ri.",
  },
  {
    id: "ms1-05",
    turi: "variant",
    mavzu: "Izotoplar va o'rtacha atom massa",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -0.95,
    question:
      "Kaliy ikkita izotopdan tashkil topgan: $\\ce{^{39}K}$ va $\\ce{^{40}K}$. Agar $A_r(\\ce{K}) = 39{,}2$ bo'lsa, $2\\text{ mol}$ kaliydagi $\\ce{^{40}K}$ izotopining massasini ($\\text{g}$) hisoblang.",
    options: ["4", "8", "12", "16"],
    correct: 3,
    explanation:
      "$\\ce{^{40}K}$ izotopining molyar ulushini $w$ desak: $40w + 39(1 - w) = 39{,}2 \\implies w = 0{,}2$ ($20\\%$). $2\\text{ mol}$ kaliy tarkibida $n(\\ce{^{40}K}) = 2 \\cdot 0{,}2 = 0{,}4\\text{ mol}$ bo'ladi. Uning massasi $m = 0{,}4 \\cdot 40 = 16\\text{ g}$.",
  },
  {
    id: "ms1-06",
    turi: "variant",
    mavzu: "Gibridlanish va kimyoviy bog'lanish",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    qiyinlik: 1.05,
    question:
      "Sulfat kislota molekulasida bog' hosil qilishda qatnashgan barcha orbitallarning necha foizini $sp^2$-orbitallar tashkil etadi?",
    options: ["6,25", "12,5", "25", "50"],
    correct: 1,
    explanation:
      "$\\ce{H2SO4}$ tuzilishida $(\\text{HO})_2\\text{SO}_2$: $2$ ta $\\ce{H}$ atomi $2$ ta $1s$-orbital; $2$ ta $\\ce{-O-}$ atomi ($sp^3$) jami $4$ ta $sp^3$-orbital; $2$ ta $\\ce{=O}$ atomi har biri bittadan $sp^2$ ($\\sigma$-bog') va bittadan $p$ ($\\pi$-bog') — jami $2$ ta $sp^2$ va $2$ ta $p$-orbital; markaziy $\\ce{S}$ atomi $4$ ta $sp^3$ ($\\sigma$) va $2$ ta $d$ ($\\pi$) — jami $6$ ta orbital beradi. Bog' hosil qilishda qatnashgan barcha orbitallar soni $2 + 4 + 4 + 6 = 16$ ta. Shundan $sp^2$-orbitallar $2$ ta bo'lib, ulushi $\\frac{2}{16} \\cdot 100\\% = 12{,}5\\%$.",
  },
  {
    id: "ms1-07",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi va Vant-Goff qoidasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    qiyinlik: 0.45,
    question:
      "$30^\\circ\\text{C}$ da $X$ modda konsentratsiyasi $2$ marta kamayishi uchun $10\\text{ s}$ vaqt sarflandi. $10^\\circ\\text{C}$ da $4$ marta kamayishi uchun esa $135\\text{ s}$ sarflandi. Qanday temperaturada ($^\\circ\\text{C}$) $X$ modda konsentratsiyasi $6$ marta kamayishi uchun $50\\text{ s}$ vaqt sarflanadi?",
    options: ["-20", "-10", "10", "20"],
    correct: 3,
    explanation:
      "Boshlang'ich konsentratsiyani $C_0 = 1\\text{ mol/l}$ desak: $30^\\circ\\text{C}$ da $\\Delta C = 1 - \\frac{1}{2} = \\frac{1}{2}$, $v_{30} = \\frac{0{,}5}{10} = \\frac{1}{20}$. $10^\\circ\\text{C}$ da $\\Delta C = 1 - \\frac{1}{4} = \\frac{3}{4}$, $v_{10} = \\frac{3/4}{135} = \\frac{1}{180}$. Tezliklar nisbati $\\frac{v_{30}}{v_{10}} = 9 = \\gamma^{\\frac{30-10}{10}} = \\gamma^2 \\implies \\gamma = 3$. $T^\\circ\\text{C}$ da $\\Delta C = 1 - \\frac{1}{6} = \\frac{5}{6}$, $v_T = \\frac{5/6}{50} = \\frac{1}{60}$. $\\frac{v_{30}}{v_T} = \\frac{60}{20} = 3 = 3^{\\frac{30-T}{10}} \\implies 30 - T = 10 \\implies T = 20^\\circ\\text{C}$.",
  },
  {
    id: "ms1-08",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat va Le-Shatelye prinsipi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -0.7,
    question:
      "Muvozanatdagi $\\ce{2NO2(g) <=> 2NO(g) + O2(g)} - Q$ sistemada harorat tezda tushirildi va doimiy shu holatda ushlab turildi. Sistemada sodir bo'luvchi o'zgarishlarni ko'rsating:\na) $\\ce{NO}$ miqdori ortadi;\nb) $\\ce{NO2}$ miqdori ortadi;\nc) $\\ce{O2}$ miqdori ortadi;\nd) molekulalarning umumiy soni kamayadi.",
    options: ["a, b", "a, c", "b, d", "c, d"],
    correct: 2,
    explanation:
      "To'g'ri reaksiya endotermik ($-Q$) bo'lgani uchun haroratni pasaytirish muvozanatni ekzotermik teskari reaksiya ($\\ce{2NO + O2 -> 2NO2}$) tomonga siljitadi. Natijada $\\ce{NO2}$ miqdori ortadi (b), $3\\text{ mol}$ gazdan $2\\text{ mol}$ gaz hosil bo'lgani sababli molekulalarning umumiy soni kamayadi (d).",
  },
  {
    id: "ms1-09",
    turi: "variant",
    mavzu: "Eritmalar va sulfat kislota reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    qiyinlik: 0.55,
    question:
      "$200\\text{ g}$ sulfat kislota eritmasida mis eritilganda $13{,}44\\text{ l}$ (n.sh.) gaz ajraldi. Hosil bo'lgan eritmada tuz va kislotaning massa farqi $38{,}6\\text{ g}$ ni tashkil etdi. Kislotaning boshlang'ich konsentratsiyasini ($\\%$) aniqlang.",
    options: ["73,5", "67,2", "75,6", "87,5"],
    correct: 3,
    explanation:
      "$\\ce{Cu + 2H2SO4 -> CuSO4 + SO2 ^ + 2H2O}$. Ajralgan gaz $n(\\ce{SO2}) = \\frac{13{,}44}{22{,}4} = 0{,}6\\text{ mol}$. Demak, $0{,}6\\text{ mol}$ tuz ($m(\\ce{CuSO4}) = 0{,}6 \\cdot 160 = 96\\text{ g}$) hosil bo'lgan va $1{,}2\\text{ mol}$ kislota ($1{,}2 \\cdot 98 = 117{,}6\\text{ g}$) sarflangan. Shartga ko'ra $96 - m_{\\text{qolgan}} = 38{,}6 \\implies m_{\\text{qolgan}} = 57{,}4\\text{ g}$. Dastlabki $\\ce{H2SO4}$ massasi $117{,}6 + 57{,}4 = 175\\text{ g}$, konsentratsiyasi $\\omega = \\frac{175}{200} \\cdot 100\\% = 87{,}5\\%$.",
  },
  {
    id: "ms1-10",
    turi: "variant",
    mavzu: "Metallarning faollik qatori va gidroksidlar amfoterligi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    qiyinlik: 0.2,
    question:
      "To'rtta raqamlangan probirkalarda quyida ko'rsatilgan ionlarni tutuvchi anorganik moddalarning eritmalari mavjud.\n- Barcha probirkalarga rux plastinka tutib turilganda plastinka massasi 4-probirkada ortadi, 1-probirkada kamayadi, 2- va 3-probirkalarda o'zgarmaydi;\n- Barcha probirkalarga $\\ce{NaOH}$ eritmasi qo'shilganda 1-, 2-, 3- va 4-probirkalarda cho'kma tushadi, ammo 2- va 4-probirkalardagi cho'kma ishqor mo'l bo'lganda erib ketadi.\nIon formulasi va u joylashgan probirka raqamlari mosligini aniqlang.\na) $\\ce{Pb^2+}$; b) $\\ce{Cu^2+}$; c) $\\ce{Zn^2+}$; d) $\\ce{Mg^2+}$.",
    options: [
      "a-4; b-1; c-3; d-2",
      "a-1; b-4; c-3; d-2",
      "a-4; b-1; c-2; d-3",
      "a-1; b-4; c-2; d-3",
    ],
    correct: 2,
    explanation:
      "Rux ($M = 65$) eritmadan o'zidan kuchsiz metallarni siqib chiqaradi: $\\ce{Pb}$ ($M = 207 > 65$) ajralsa plastinka massasi ortadi (4-probirka $\\ce{Pb^2+}$, ya'ni a-4); $\\ce{Cu}$ ($M = 64 < 65$) ajralsa massa kamayadi (1-probirka $\\ce{Cu^2+}$, ya'ni b-1). $\\ce{Zn^2+}$ va $\\ce{Mg^2+}$ bilan rux plastinka massasi o'zgarmaydi (2- va 3-probirkalar). Mo'l ishqorda amfoter $\\ce{Zn(OH)2}$ eriydi, $\\ce{Mg(OH)2}$ esa erimaydi — demak, 2-probirkada $\\ce{Zn^2+}$ (c-2), 3-probirkada $\\ce{Mg^2+}$ (d-3).",
  },
  {
    id: "ms1-11",
    turi: "variant",
    mavzu: "Kuchsiz elektrolitlar dissotsilanishi va pH",
    soha: "Umumiy kimyo",
    daraja: "orta",
    qiyinlik: 0.35,
    question:
      "Bir asosli kislotaning $0{,}5\\%$ li eritmasining ($\\rho = 0{,}8\\text{ g/ml}$) $\\text{pH}$ qiymati $2$ ga teng ($K_d = 5 \\cdot 10^{-4}$). Kislota formulasini aniqlang.",
    options: ["$\\ce{HNO2}$", "$\\ce{HF}$", "$\\ce{CH3COOH}$", "$\\ce{HCOOH}$"],
    correct: 1,
    explanation:
      "$\\text{pH} = 2 \\implies [\\ce{H+}] = 10^{-2}\\text{ mol/l}$. Ostvald qonuniga ko'ra $K_d \\approx \\frac{[\\ce{H+}]^2}{C_M} \\implies C_M = \\frac{(10^{-2})^2}{5 \\cdot 10^{-4}} = 0{,}2\\text{ mol/l}$. Eritmaning foiz va molyar konsentratsiyalari bog'liqligidan: $C_M = \\frac{10 \\cdot \\rho \\cdot \\omega}{M} \\implies M = \\frac{10 \\cdot 0{,}8 \\cdot 0{,}5}{0{,}2} = 20\\text{ g/mol}$. Bu $\\ce{HF}$ kislotasiga mos keladi ($M(\\ce{HF}) = 20\\text{ g/mol}$).",
  },
  {
    id: "ms1-12",
    turi: "variant",
    mavzu: "Oksidlanish darajasi va ion zaryadi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -1.4,
    question:
      "$17$ ta proton va $14$ ta elektronga ega zarracha $2$ ta elektron berganidan so'ng oksidlanish darajasi qanday bo'ladi?",
    options: ["+3", "+1", "+5", "+7"],
    correct: 2,
    explanation:
      "Dastlabki zarrachada protonlar soni $17$ ta, elektronlar soni $14$ ta, demak uning zaryadi $17 - 14 = +3$. Yana $2$ ta elektron berganda elektronlar soni $12$ taga tushadi va oksidlanish darajasi $17 - 12 = +5$ bo'ladi.",
  },
  {
    id: "ms1-13",
    turi: "variant",
    mavzu: "Tuz eritmalari elektrolizi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -0.45,
    question:
      "$200\\text{ g}$ $32\\%$ li natriy sulfat eritmasi elektroliz qilindi. Natijada $50\\%$ li eritma hosil bo'ldi. Anodda ajralgan gaz hajmini ($\\text{l}$, n.sh.) aniqlang.",
    options: ["22,4", "44,8", "67,2", "89,6"],
    correct: 1,
    explanation:
      "Dastlabki eritmadagi $\\ce{Na2SO4}$ massasi $200 \\cdot 0{,}32 = 64\\text{ g}$. Elektrolizda faqat suv parchalangani ($\\ce{2H2O -> 2H2 + O2}$) uchun tuz massasi o'zgarmaydi. Yakuniy eritma massasi $\\frac{64}{0{,}5} = 128\\text{ g}$. Elektrolizga uchragan suv massasi $200 - 128 = 72\\text{ g}$ ($4\\text{ mol}$). Anodda ajralgan kislorod $n(\\ce{O2}) = \\frac{4}{2} = 2\\text{ mol}$, hajmi $2 \\cdot 22{,}4 = 44{,}8\\text{ l}$.",
  },
  {
    id: "ms1-14",
    turi: "variant",
    mavzu: "Tuzlar nomenklaturasi va kislotalar negizligi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    qiyinlik: -0.6,
    question: "Quyidagi tuzni nomlang: $\\ce{Al2(HPO3)3}$",
    options: [
      "alyuminiy gidrofosfit",
      "alyuminiy fosfit",
      "alyuminiy digidrofosfit",
      "alyuminiy gidrofosfat",
    ],
    correct: 1,
    explanation:
      "Fosfit kislota ($\\ce{H3PO3}$) uchta vodorod atomiga ega bo'lsa-da, tarkibida faqat ikkita $\\ce{-OH}$ guruhi borligi sababli ikki negizli kislotadir ($\\ce{H2[HPO3]}$). Undagi uchinchi vodorod to'g'ridan-to'g'ri fosfor bilan bog'langan bo'lib, metallga almashmaydi. Shu bois $\\ce{HPO3^{2-}}$ qoldig'i o'rta tuz anionidir va $\\ce{Al2(HPO3)3}$ alyuminiy fosfit deb nomlanadi.",
  },
  {
    id: "ms1-15",
    turi: "variant",
    mavzu: "Kislotali oksid va ishqor reaksiyalari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    qiyinlik: -0.25,
    question:
      "$13{,}44\\text{ l}$ (n.sh.) $\\ce{SO2}$ $\\ce{NaOH}$ eritmasi orqali o'tkazilganda $71{,}2\\text{ g}$ nordon va o'rta tuz aralashmasi hosil bo'ldi. O'rta tuz miqdorini ($\\text{mol}$) toping.",
    options: ["0,1", "0,2", "0,3", "0,4"],
    correct: 3,
    explanation:
      "$n(\\ce{SO2}) = \\frac{13{,}44}{22{,}4} = 0{,}6\\text{ mol}$. O'rta tuz $\\ce{Na2SO3}$ ($M = 126$) miqdorini $x$, nordon tuz $\\ce{NaHSO3}$ ($M = 104$) miqdorini $y$ desak: $x + y = 0{,}6$ va $126x + 104y = 71{,}2$. Ikkinchi tenglamaga $y = 0{,}6 - x$ ni qo'ysak: $126x + 62{,}4 - 104x = 71{,}2 \\implies 22x = 8{,}8 \\implies x = 0{,}4\\text{ mol}$.",
  },
  {
    id: "ms1-16",
    turi: "variant",
    mavzu: "Biogen elementlar va ularning ahamiyati",
    soha: "Anorganik kimyo",
    daraja: "oson",
    qiyinlik: -0.9,
    question:
      "Qaysi element tirik organizmlarda C vitamini hosil bo'lishida va siydik hosil bo'lishida muhim ahamiyatga ega?",
    options: ["$\\ce{Zn}$", "$\\ce{Mo}$", "$\\ce{Mn}$", "$\\ce{Co}$"],
    correct: 2,
    explanation:
      "Marganes ($\\ce{Mn}$) tirik organizmlardagi ko'plab fermentlar tarkibiga kirib, askorbin kislota (C vitamini) sintezida hamda arginaza fermenti tarkibida siydik (karbamid) hosil bo'lish jarayonlarida muhim rol o'ynaydi.",
  },
  {
    id: "ms1-17",
    turi: "variant",
    mavzu: "Nitratlarning termik parchalanishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    qiyinlik: 0.4,
    question:
      "$44\\text{ g}$ mis va mis (II)-nitrat aralashmasi havoda qizdirildi. Bunda aralashma massasi $20\\text{ g}$ ga kamaydi. Dastlabki aralashmadagi misning miqdorini ($\\text{mol}$) aniqlang.",
    options: ["0,1", "0,15", "0,2", "0,05"],
    correct: 0,
    explanation:
      "Havoda qizdirilganda: $2\\ce{Cu} + \\ce{O2 -> 2CuO}$ ($1\\text{ mol Cu}$ dan $1\\text{ mol CuO}$, massa $+16\\text{ g}$ ortadi) va $2\\ce{Cu(NO3)2 -> 2CuO + 4NO2 ^ + O2 ^}$ ($1\\text{ mol}$ tuzdan $1\\text{ mol CuO}$, massa $188 - 80 = 108\\text{ g}$ kamayadi). Misni $x\\text{ mol}$, tuzni $y\\text{ mol}$ desak: $64x + 188y = 44$ va $108y - 16x = 20$. Ikkinchi tenglamani $4$ ga ko'paytirib birinchisiga qo'shsak: $620y = 124 \\implies y = 0{,}2\\text{ mol}$, bundan $x = \\frac{44 - 37{,}6}{64} = 0{,}1\\text{ mol}$.",
  },
  {
    id: "ms1-18",
    turi: "variant",
    mavzu: "Temir va ishqoriy metallar reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    qiyinlik: -1.2,
    question:
      "Quyida keltirilgan reaksiyalar asosida $X$ va $Y$ moddalarni aniqlang.\n$\\ce{Fe + Cl2 -> X}$\n$\\ce{Li + O2 -> Y}$",
    options: [
      "$X$ — $\\ce{FeCl2}$; $Y$ — $\\ce{Li2O2}$",
      "$X$ — $\\ce{FeCl3}$; $Y$ — $\\ce{Li2O2}$",
      "$X$ — $\\ce{FeCl2}$; $Y$ — $\\ce{Li2O}$",
      "$X$ — $\\ce{FeCl3}$; $Y$ — $\\ce{Li2O}$",
    ],
    correct: 3,
    explanation:
      "Xlor kuchli oksidlovchi bo'lgani uchun temirni $+3$ oksidlanish darajasigacha oksidlaydi: $2\\ce{Fe} + 3\\ce{Cl2 -> 2FeCl3}$ ($X = \\ce{FeCl3}$). Ishqoriy metallardan litiy kislorodda yonganda boshqa ishqoriy metallardan farqli ravishda oddiy oksid hosil qiladi: $4\\ce{Li} + \\ce{O2 -> 2Li2O}$ ($Y = \\ce{Li2O}$).",
  },
  {
    id: "ms1-19",
    turi: "variant",
    mavzu: "Metall aralashmalari tahlili",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    qiyinlik: 0.15,
    question:
      "$17{,}4\\text{ g}$ mis, temir va alyuminiy aralashmasi mo'l miqdordagi xlorid kislotada eritilganda $8{,}96\\text{ l}$ (n.sh.) gaz ajraldi. Bunda $6{,}4\\text{ g}$ qoldiq erimasdan qoldi. Shunday aralashma namunasi mo'l natriy gidroksid eritmasida eritilganda qanday hajmda ($\\text{l}$, n.sh.) gaz ajraladi?",
    options: ["2,24", "3,36", "4,48", "6,72"],
    correct: 3,
    explanation:
      "Mis $\\ce{HCl}$ bilan reaksiyaga kirishmaydi, shuning uchun qoldiq $m(\\ce{Cu}) = 6{,}4\\text{ g}$, demak $m(\\ce{Fe} + \\ce{Al}) = 17{,}4 - 6{,}4 = 11\\text{ g}$. Ajralgan vodorod $n(\\ce{H2}) = \\frac{8{,}96}{22{,}4} = 0{,}4\\text{ mol}$. Temirni $x\\text{ mol}$, alyuminiyni $y\\text{ mol}$ desak: $56x + 27y = 11$ va $x + 1{,}5y = 0{,}4$. Bundan $56(0{,}4 - 1{,}5y) + 27y = 11 \\implies 22{,}4 - 57y = 11 \\implies y = 0{,}2\\text{ mol}$ ($\\ce{Al}$). $\\ce{NaOH}$ bilan faqat amfoter $\\ce{Al}$ reaksiyaga kirishadi: $n(\\ce{H2}) = 1{,}5 \\cdot 0{,}2 = 0{,}3\\text{ mol}$, hajmi $0{,}3 \\cdot 22{,}4 = 6{,}72\\text{ l}$.",
  },
  {
    id: "ms1-20",
    turi: "variant",
    mavzu: "Organik kimyo tarixi va valentlik nazariyasi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    qiyinlik: -1.0,
    question:
      "Nuqtalar o'rniga mos keluvchi javobni tanlang.\n«... valentlikni formulalarda chiziqcha bilan yozishni taklif qildi.»",
    options: ["Libix", "Vyoler", "Kuper", "Kekule"],
    correct: 2,
    explanation:
      "$1858$-yilda shotland kimyogari Archibald Skott Kuper (A. Couper) kimyoviy tuzilish formulalarida atomlar orasidagi valent bog'larni chiziqcha (shtrix) bilan tasvirlashni taklif qilgan.",
  },
  {
    id: "ms1-21",
    turi: "variant",
    mavzu: "Alkanlar sintezi (Fisher-Tropsh)",
    soha: "Organik kimyo",
    daraja: "oson",
    qiyinlik: -0.3,
    question:
      "Fisher-Tropsh sintezi bo'yicha ($\\ce{CO + H2 -> C_{n}H_{2n+2} + H2O}$) propan olishda reagentlarning o'rtacha molyar massasini ($\\text{g/mol}$) toping.",
    options: ["7,2", "8,5", "9,8", "10,4"],
    correct: 2,
    explanation:
      "Propan ($n = 3$) olish reaksiyasi tenglamasi: $3\\ce{CO} + 7\\ce{H2 -> C3H8 + 3H2O}$. Reagentlarning umumiy massasi $3 \\cdot 28 + 7 \\cdot 2 = 98\\text{ g}$, umumiy modda miqdori $3 + 7 = 10\\text{ mol}$. O'rtacha molyar massa $M_{\\text{o'rt}} = \\frac{98}{10} = 9{,}8\\text{ g/mol}$.",
  },
  {
    id: "ms1-22",
    turi: "variant",
    mavzu: "Alkinlarning umumiy formulasi",
    soha: "Organik kimyo",
    daraja: "oson",
    qiyinlik: -1.3,
    question:
      "Agar alkin molekulasida uglerod atomlari soni $x + 2$ ta bo'lsa, undagi vodorod atomlari sonini aniqlang.",
    options: ["$2x - 2$", "$2x + 2$", "$2x - 4$", "$2x + 4$"],
    correct: 1,
    explanation:
      "Alkinlarning umumiy formulasi $\\ce{C_{n}H_{2n-2}}$. Agar uglerod atomlari soni $n = x + 2$ bo'lsa, vodorod atomlari soni $2n - 2 = 2(x + 2) - 2 = 2x + 2$ ga teng bo'ladi.",
  },
  {
    id: "ms1-23",
    turi: "variant",
    mavzu: "Alkenlarning Vagner reaksiyasi va yonish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.25,
    question:
      "Buten-2 va propandan iborat gazlar aralashmasi kaliy permanganatning suvli eritmasidan o'tkazildi. Bunda eritma massasi $0{,}6\\text{ g}$ ga kamaydi. Shuncha aralashma yondirilganda $2{,}1\\text{ mol}$ karbonat angidrid ajraldi. Boshlang'ich aralashma hajmini ($\\text{l}$, n.sh.) aniqlang.",
    options: ["13,44", "26,88", "22,4", "11,2"],
    correct: 0,
    explanation:
      "Propan $\\ce{KMnO4}$ bilan ta'sirlashmaydi. Buten-2 Vagner reaksiyasi bo'yicha oksidlanadi: $3\\ce{C4H8} + 2\\ce{KMnO4} + 4\\ce{H2O -> 3C4H8(OH)2} + 2\\ce{MnO2 v} + 2\\ce{KOH}$. $3\\text{ mol}$ ($168\\text{ g}$) buten-2 yutilganda $2\\text{ mol}$ ($174\\text{ g}$) $\\ce{MnO2}$ cho'kmaga tushadi, ya'ni eritma massasi $174 - 168 = 6\\text{ g}$ ga kamayadi ($1\\text{ mol}$ buten uchun $2\\text{ g}$ kamayish). Massa $0{,}6\\text{ g}$ kamaygani uchun $n(\\ce{C4H8}) = \\frac{0{,}6}{2} = 0{,}3\\text{ mol}$. Yonishda $4 \\cdot 0{,}3 + 3n(\\ce{C3H8}) = 2{,}1 \\implies n(\\ce{C3H8}) = 0{,}3\\text{ mol}$. Jami aralashma $0{,}6\\text{ mol} = 0{,}6 \\cdot 22{,}4 = 13{,}44\\text{ l}$.",
  },
  {
    id: "ms1-24",
    turi: "variant",
    mavzu: "Spirtlar izomeriyasi va oksidlanishi",
    soha: "Organik kimyo",
    daraja: "oson",
    qiyinlik: -0.55,
    question:
      "$\\ce{C5H11OH}$ tarkibli spirtning struktura izomerlaridan nechtasi oksidlanganda $\\ce{C5H10O}$ tarkibli aldegid hosil bo'ladi?",
    options: ["5", "2", "3", "4"],
    correct: 3,
    explanation:
      "Aldegid hosil qilish uchun spirt birlamchi ($\\ce{C4H9-CH2OH}$) bo'lishi shart. $\\ce{C4H9-}$ butil radikalining $4$ ta struktura izomeri mavjud: pentanol-1, 2-metilbutanol-1, 3-metilbutanol-1 va 2,2-dimetilpropanol-1. Demak, $4$ ta spirt oksidlanib aldegid beradi.",
  },
  {
    id: "ms1-25",
    turi: "variant",
    mavzu: "Ko'p atomli spirtlar reaksiyalari",
    soha: "Organik kimyo",
    daraja: "orta",
    qiyinlik: 0.3,
    question:
      "Har biri $15{,}5\\text{ g}$ dan bo'lgan etilenglikolning ikkita porsiyasidan olinadigan azot saqlovchi $X$ modda va nomolekulyar tuzilishli $Y$ moddalarning massalari ($\\text{g}$) yig'indisini toping.\n$$\\ce{X <-[\\text{0,5 mol HNO}_3/\\text{H}_2\\text{SO}_4] \\text{etilenglikol} ->[\\text{0,25 mol Na}] Y}$$",
    options: ["64,5", "59", "47,75", "68"],
    correct: 1,
    explanation:
      "$15{,}5\\text{ g}$ etilenglikol ($M = 62$) $n = \\frac{15{,}5}{62} = 0{,}25\\text{ mol}$ ni tashkil etadi. 1-porsiya $0{,}5\\text{ mol}$ $\\ce{HNO3}$ bilan to'liq eterifikatsiyalanib $0{,}25\\text{ mol}$ etilenglikol dinitrat ($X = \\ce{C2H4(ONO2)2}$, $M = 152$) beradi: $m(X) = 0{,}25 \\cdot 152 = 38\\text{ g}$. 2-porsiya $0{,}25\\text{ mol}$ natriy bilan reaksiyaga kirishib $0{,}25\\text{ mol}$ monoglikolyat ($Y = \\ce{HOCH2CH2ONa}$, $M = 84$) hosil qiladi: $m(Y) = 0{,}25 \\cdot 84 = 21\\text{ g}$. Yig'indisi $38 + 21 = 59\\text{ g}$.",
  },
  {
    id: "ms1-26",
    turi: "variant",
    mavzu: "Murakkab efirlar va meva essensiyalari",
    soha: "Organik kimyo",
    daraja: "oson",
    qiyinlik: -1.15,
    question: "Qaysi murakkab efir limonadga nok ta'mini beradi?",
    options: [
      "metilatsetat",
      "izoamilatsetat",
      "pentilmetanoat",
      "etilatsetat",
    ],
    correct: 1,
    explanation:
      "Izoamilatsetat (sirka kislotaning izoamil efiri) kuchli nok hidiga ega bo'lib, oziq-ovqat sanoatida nok essensiyasi sifatida limonad va qandolat mahsulotlariga qo'shiladi.",
  },
  {
    id: "ms1-27",
    turi: "variant",
    mavzu: "Uglevodlar gidrolizi va bijg'ishi",
    soha: "Organik kimyo",
    daraja: "orta",
    qiyinlik: 0.25,
    question:
      "Maltoza gidrolizidan olingan glyukoza spirtli bijg'itildi. Olingan etanol sulfat kislota ishtirokida kuchli qizdirildi. Bunda $11{,}2\\text{ g}$ alken hosil bo'ldi. Uglevodlar massa farqini ($\\text{g}$) toping.",
    options: ["1,8", "0,9", "2,7", "3,6"],
    correct: 0,
    explanation:
      "$n(\\ce{C2H4}) = \\frac{11{,}2}{28} = 0{,}4\\text{ mol}$. Reaksiya zanjiriga ko'ra $0{,}4\\text{ mol}$ etilen $0{,}4\\text{ mol}$ etanoldan olingan; bu esa $0{,}2\\text{ mol}$ glyukozaning ($36\\text{ g}$) spirtli bijg'ishidan hosil bo'lgan. $0{,}2\\text{ mol}$ glyukoza $0{,}1\\text{ mol}$ maltozaning ($34{,}2\\text{ g}$) gidrolizidan olingan. Uglevodlar massa farqi: $36{,}0 - 34{,}2 = 1{,}8\\text{ g}$.",
  },
  {
    id: "ms1-28",
    turi: "variant",
    mavzu: "Aminokislotalar va ularning efirlari",
    soha: "Organik kimyo",
    daraja: "oson",
    qiyinlik: -0.65,
    question:
      "Noma'lum aminokislota va etanol molyar massasi $103\\text{ g/mol}$ bo'lgan murakkab efir hosil qiladi. Aminokislotani toping.",
    options: ["glitsin", "alanin", "sistein", "serin"],
    correct: 0,
    explanation:
      "Eterifikatsiya reaksiyasida aminokislota + etanol ($M = 46$) $\\to$ efir ($M = 103$) + suv ($M = 18$). Massa saqlanishidan aminokislota molyar massasi $M = 103 + 18 - 46 = 75\\text{ g/mol}$. Bu eng oddiy aminokislota — glitsindir ($\\ce{H2N-CH2-COOH}$).",
  },
  {
    id: "ms1-29",
    turi: "variant",
    mavzu: "Aminlarning yonishi",
    soha: "Organik kimyo",
    daraja: "orta",
    qiyinlik: 0.1,
    question:
      "Etilamin yetarli miqdorda olingan kislorodda to'liq yondirildi. Sistema normal sharoitga keltirilganda $11{,}2\\text{ l}$ (n.sh.) gazlar aralashmasi hosil bo'ldi. Etilamin yondirish uchun sarflangan kislorod hajmini ($\\text{l}$, n.sh.) toping.",
    options: ["16,8", "20,16", "17,92", "10,08"],
    correct: 0,
    explanation:
      "$4\\ce{C2H5NH2} + 15\\ce{O2 -> 8CO2 + 2N2 + 14H2O}$. Normal sharoitda suv suyuq holatga o'tadi, gazlar aralashmasi esa $\\ce{CO2}$ va $\\ce{N2}$ dan iborat bo'ladi. Tenglamaning $10\\text{ mol}$ gaziga $15\\text{ mol}$ $\\ce{O2}$ to'g'ri keladi. $n(\\text{gaz}) = \\frac{11{,}2}{22{,}4} = 0{,}5\\text{ mol}$ bo'lgani uchun sarflangan $n(\\ce{O2}) = 0{,}5 \\cdot \\frac{15}{10} = 0{,}75\\text{ mol}$, ya'ni $V(\\ce{O2}) = 0{,}75 \\cdot 22{,}4 = 16{,}8\\text{ l}$.",
  },
  {
    id: "ms1-30",
    turi: "variant",
    mavzu: "Moddalar va aralashmalarni ajratish usullari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -0.95,
    question:
      "To'g'ri fikrlar sonini aniqlang.\n1) Tibbiyotda ishlatiluvchi yodning spirtli eritmasi bir jinsli aralashma hisoblanadi;\n2) Filtrlashdan so'ng olingan tuz eritmasi sof moddadir;\n3) Havoni tarkibiy qismlarga ajratishda distillash usulidan foydalaniladi;\n4) Temir va yog'och qipiqlarini ajratishda magnitdan foydalanish mumkin.",
    options: ["1", "2", "3", "4"],
    correct: 2,
    explanation:
      "1) Yodning spirtli eritmasi chin eritma — bir jinsli (gomogen) aralashma (to'g'ri); 2) Filtrlashdan keyingi tuz eritmasi hali ham suv va tuz aralashmasidir (noto'g'ri); 3) Suyultirilgan havoni fraksiyali distillash orqali $\\ce{N2}$ va $\\ce{O2}$ ga ajratiladi (to'g'ri); 4) Magnit temirni tortib yog'och qipiqlaridan ajratadi (to'g'ri). Jami $3$ ta fikr to'g'ri.",
  },
  {
    id: "ms1-31",
    turi: "variant",
    mavzu: "Laboratoriya usullari va jihozlari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    qiyinlik: -1.65,
    question: "Rasmda moddalarning qaysi ajratish usuli ko'rsatilgan?",
    rasm: "/images/ms/milliy-sertifikat-simulyator/savol-31-filtrlash.svg",
    options: ["filtrlash", "dekantatsiya", "xromatografiya", "distillash"],
    correct: 0,
    explanation:
      "Rasmda voronka va filtr qog'ozi yordamida qattiq cho'kmani suyuq fazadan (filtratdan) ajratish — filtrlash usuli tasvirlangan.",
  },
  {
    id: "ms1-32",
    turi: "variant",
    mavzu: "Qishloq xo'jaligi kimyosi va pestitsidlar",
    soha: "Anorganik kimyo",
    daraja: "oson",
    qiyinlik: -1.05,
    question: "Akaritsidlar qishloq xo'jaligida ... ishlatiladi.",
    options: [
      "barglarni quritish vositasi sifatida",
      "kasallik tarqatuvchi zamburug'larga qarshi",
      "kemiruvchilarga qarshi kurashishda",
      "kanalardan (zararkunandalardan) himoyalashda",
    ],
    correct: 3,
    explanation:
      "Akaritsidlar — o'simlik va hayvonlarga zarar yetkazuvchi kanalar (o'rgimchakkana va boshqalar) ga qarshi qo'llaniladigan kimyoviy preparatlar. Zamburug'larga fungitsidlar, kemiruvchilarga rodentitsidlar, barg quritishga defoliant/desikantlar ishlatiladi.",
  },
  {
    id: "ms1-33",
    turi: "moslashtirish",
    mavzu: "Nitratlar termolizi va gazlar yutilishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 0.95,
    kontekstMatn:
      "$0{,}06\\text{ mol}$ simob (II)-nitrat va temir (III)-nitrat aralashmasi $500^\\circ\\text{C}$ da qizdirildi. Olingan gazlar aralashmasi litiy gidroksid eritmasidan o'tkazildi. Eritmadan o'tgan gaz hajmi (n.sh.) $448\\text{ ml}$ ni tashkil etdi.",
    question: "Aralashmadagi temir (III)-nitrat miqdorini ($\\text{mol}$) aniqlang.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: {
      A: "0,08",
      B: "0,14",
      C: "1,6",
      D: "9,64",
      E: "0,04",
      F: "0,02",
    },
    correct: "F",
    explanation:
      "$\\ce{Hg(NO3)2 -> Hg + 2NO2 + O2}$ ($x\\text{ mol}$) va $4\\ce{Fe(NO3)3 -> 2Fe2O3 + 12NO2 + 3O2}$ ($y\\text{ mol}$). $\\ce{LiOH}$ eritmasi gazlarni $4\\ce{NO2} + \\ce{O2} + 4\\ce{LiOH -> 4LiNO3 + 2H2O}$ nisbatida yutadi. $\\ce{Fe(NO3)3}$ bergan $\\ce{NO2}:\\ce{O2}$ nisbati aynan $4:1$ bo'lgani uchun to'liq yutiladi. $\\ce{Hg(NO3)2}$ esa $2x\\text{ mol}$ $\\ce{NO2}$ bilan faqat $0{,}5x\\text{ mol}$ $\\ce{O2}$ sarflaydi va $0{,}5x\\text{ mol}$ $\\ce{O2}$ ortib qoladi: $0{,}5x = \\frac{0{,}448}{22{,}4} = 0{,}02 \\implies x = 0{,}04\\text{ mol}$. Shunda $n(\\ce{Fe(NO3)3}) = 0{,}06 - 0{,}04 = 0{,}02\\text{ mol}$ (F).",
  },
  {
    id: "ms1-34",
    turi: "moslashtirish",
    mavzu: "Nitratlar termolizi va gazlar yutilishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.15,
    kontekstMatn:
      "$0{,}06\\text{ mol}$ simob (II)-nitrat va temir (III)-nitrat aralashmasi $500^\\circ\\text{C}$ da qizdirildi. Olingan gazlar aralashmasi litiy gidroksid eritmasidan o'tkazildi. Eritmadan o'tgan gaz hajmi (n.sh.) $448\\text{ ml}$ ni tashkil etdi.",
    question:
      "Boshlang'ich aralashma to'liq qizdirilganda hosil bo'ladigan qattiq qoldiq massasini ($\\text{g}$) aniqlang.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: {
      A: "0,08",
      B: "0,14",
      C: "1,6",
      D: "9,64",
      E: "0,04",
      F: "0,02",
    },
    correct: "C",
    explanation:
      "$500^\\circ\\text{C}$ da simob (qaynash harorati $357^\\circ\\text{C}$) bug'lanib chiqib ketadi, shu sababli qattiq qoldiq faqat $\\ce{Fe2O3}$ dan iborat bo'ladi. $0{,}02\\text{ mol}$ $\\ce{Fe(NO3)3}$ parchalanganda $0{,}01\\text{ mol}$ $\\ce{Fe2O3}$ hosil bo'ladi: $m = 0{,}01 \\cdot 160 = 1{,}6\\text{ g}$ (C).",
  },
  {
    id: "ms1-35",
    turi: "moslashtirish",
    mavzu: "Nitratlar termolizi va gazlar yutilishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.05,
    kontekstMatn:
      "$0{,}06\\text{ mol}$ simob (II)-nitrat va temir (III)-nitrat aralashmasi $500^\\circ\\text{C}$ da qizdirildi. Olingan gazlar aralashmasi litiy gidroksid eritmasidan o'tkazildi. Eritmadan o'tgan gaz hajmi (n.sh.) $448\\text{ ml}$ ni tashkil etdi.",
    question:
      "Litiy gidroksid eritmasidan gazlar o'tkazilganda necha mol tuz hosil bo'lgan?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: {
      A: "0,08",
      B: "0,14",
      C: "1,6",
      D: "9,64",
      E: "0,04",
      F: "0,02",
    },
    correct: "B",
    explanation:
      "$4\\ce{NO2} + \\ce{O2} + 4\\ce{LiOH -> 4LiNO3 + 2H2O}$ tenglamasiga ko'ra hosil bo'lgan tuz ($\\ce{LiNO3}$) miqdori yutilgan $\\ce{NO2}$ miqdoriga teng. Jami $n(\\ce{NO2}) = 2 \\cdot 0{,}04 + 3 \\cdot 0{,}02 = 0{,}08 + 0{,}06 = 0{,}14\\text{ mol}$ (B).",
  },
  {
    id: "ms1-36",
    turi: "ochiq",
    mavzu: "Gidrid va nitridlar gidrolizi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.2,
    question:
      "Bir valentli metall gidridi va nitrididan iborat $38\\text{ g}$ aralashma suvda eritilganda $13{,}44\\text{ l}$ (n.sh.) gazlar hosil bo'ldi. Olingan gazlar aralashmasi $\\ce{HCl}$ eritmasi orqali o'tkazildi. Agar gazlarning $1/3$ qismi $\\ce{HCl}$ eritmasiga yutilmagan bo'lsa, boshlang'ich aralashmadagi gidrid massasini ($\\text{g}$) aniqlang.",
    correct: "4.8",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "Hosil bo'lgan gazlar ($\\ce{H2}$ va $\\ce{NH3}$) jami miqdori $\\frac{13{,}44}{22{,}4} = 0{,}6\\text{ mol}$. $\\ce{HCl}$ eritmasiga yutilmagan $1/3$ qism vodoroddir: $n(\\ce{H2}) = 0{,}2\\text{ mol}$, demak $n(\\ce{NH3}) = 0{,}4\\text{ mol}$. $\\ce{MH + H2O -> MOH + H2}$ dan $n(\\ce{MH}) = 0{,}2\\text{ mol}$; $\\ce{M3N + 3H2O -> 3MOH + NH3}$ dan $n(\\ce{M3N}) = 0{,}4\\text{ mol}$. Metall atom massasi $A$: $0{,}2(A + 1) + 0{,}4(3A + 14) = 38 \\implies 1{,}4A + 5{,}8 = 38 \\implies A = 23$ ($\\ce{Na}$). Gidrid massasi $m(\\ce{NaH}) = 0{,}2 \\cdot 24 = 4{,}8\\text{ g}$.",
  },
  {
    id: "ms1-37",
    turi: "ochiq",
    mavzu: "Ion almashinish va cho'kma hosil bo'lishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.55,
    question:
      "$200\\text{ g}$ natriy fosfat va $231\\text{ g}$ kalsiy xlorid eritmalari aralashtirildi. Olingan eritmada fosfat ionlari miqdori $1{,}5$ marta kamaydi, natriy ionlarining ulushi esa $2$ marta kamaydi. Boshlang'ich eritmalardagi tuzlarning mollari yig'indisini toping.",
    correct: "0.9",
    tolerance: 0.02,
    birlik: "mol",
    explanation:
      "$2\\ce{Na3PO4} + 3\\ce{CaCl2 -> Ca3(PO4)2 v} + 6\\ce{NaCl}$. $\\ce{Na+}$ ionlari cho'kmaga tushmagani sababli ularning massa ulushi $2$ marta kamayishi uchun eritma massasi $2$ marta ortishi shart: $m_{\\text{oxirgi}} = 2 \\cdot 200 = 400\\text{ g}$. Aralashtirilgan massa $200 + 231 = 431\\text{ g}$ bo'lgani uchun cho'kma massasi $m(\\ce{Ca3(PO4)2}) = 431 - 400 = 31\\text{ g}$ ($0{,}1\\text{ mol}$). Reaksiyada $0{,}2\\text{ mol}$ $\\ce{Na3PO4}$ va barcha $0{,}3\\text{ mol}$ $\\ce{CaCl2}$ sarflangan. Fosfat ionlari $1{,}5$ marta kamaygani ($n_{\\text{oxirgi}} = \\frac{2}{3}n_0$) demak uning $1/3$ qismi ($0{,}2\\text{ mol}$) cho'kmaga tushgan: $n_0(\\ce{Na3PO4}) = 0{,}6\\text{ mol}$. Jami tuzlar yig'indisi $0{,}6 + 0{,}3 = 0{,}9\\text{ mol}$.",
  },
  {
    id: "ms1-38",
    turi: "ochiq",
    mavzu: "Mis korroziyasi va oksidlovchi kislota bilan erish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    qiyinlik: 1.75,
    question:
      "$64\\text{ g}$ mis metali uzoq vaqt nam havoda qoldirildi. Olingan qattiq massa konsentrlangan sulfat kislotada eritilganda eritma massasi $71{,}2\\text{ g}$ ga ortdi. Nam havo ta'siri ostida mis metalining massasi necha $\\text{g}$ ga ortgan?",
    correct: "37.6",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "Dastlabki mis $1\\text{ mol}$. Shundan $x\\text{ mol}$ mis nam havoda malaxitga aylangan ($2\\ce{Cu} + \\ce{H2O} + \\ce{CO2} + \\ce{O2 -> (CuOH)2CO3}$): $0{,}5x\\text{ mol}$ malaxit hosil bo'ladi va plastinka massasi $47x\\text{ g}$ ga ortib $(64 + 47x)\\text{ g}$ bo'ladi. Konsentrlangan $\\ce{H2SO4}$ da qolgan $(1 - x)\\text{ mol}$ mis $(1 - x)\\text{ mol}$ $\\ce{SO2}$ ($64(1 - x)\\text{ g}$), $0{,}5x\\text{ mol}$ malaxit esa $0{,}5x\\text{ mol}$ $\\ce{CO2}$ ($22x\\text{ g}$) chiqaradi. Eritma massasi ortishi: $(64 + 47x) - 64(1 - x) - 22x = 89x = 71{,}2 \\implies x = 0{,}8\\text{ mol}$. Nam havodagi massa ortishi $47 \\cdot 0{,}8 = 37{,}6\\text{ g}$.",
  },
  {
    id: "ms1-39",
    turi: "ochiq",
    mavzu: "Uglevodorodlar aralashmasi va bromlash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    qiyinlik: 0.75,
    question:
      "Butan, propen va 2-metilpropendan iborat $43{,}6\\text{ g}$ gazlar aralashmasi bromning suvli eritmasi orqali o'tkazildi. $56\\text{ g}$ brom reaksiyaga kirishdi. Agar dastlabki aralashmaning molyar massasi $54{,}5\\text{ g/mol}$ bo'lsa, undagi 2-metilpropenning hajmiy ulushini ($\\%$) hisoblang.",
    correct: "25",
    tolerance: 0.2,
    birlik: "%",
    explanation:
      "Aralashmaning umumiy miqdori $n_{\\text{jami}} = \\frac{43{,}6}{54{,}5} = 0{,}8\\text{ mol}$. Alkenlar ($y\\text{ mol}$ propen va $z\\text{ mol}$ 2-metilpropen) $\\ce{Br2}$ bilan $1:1$ nisbatda birikadi: $y + z = \\frac{56}{160} = 0{,}35\\text{ mol}$. Shunda butan $0{,}8 - 0{,}35 = 0{,}45\\text{ mol}$ ($0{,}45 \\cdot 58 = 26{,}1\\text{ g}$). Alkenlar massasi $43{,}6 - 26{,}1 = 17{,}5\\text{ g}$. Tenglama: $42(0{,}35 - z) + 56z = 17{,}5 \\implies 14{,}7 + 14z = 17{,}5 \\implies z = 0{,}2\\text{ mol}$. Hajmiy ulush $\\varphi = \\frac{0{,}2}{0{,}8} \\cdot 100\\% = 25\\%$.",
  },
  {
    id: "ms1-40",
    turi: "ochiq",
    mavzu: "Karbon kislotalar formulasi va titrlash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    qiyinlik: 0.65,
    question:
      "To'yingan bir asosli karbon kislota to'liq yondirilganda $11{,}2\\text{ l}$ (n.sh.) karbonat angidrid hosil bo'ldi. Xuddi shuncha miqdordagi kislotani neytrallash uchun $32\\text{ ml}$ ($\\rho = 1{,}25\\text{ g/ml}$) $12{,}5\\%$ li $\\ce{NaOH}$ eritmasi sarflanadi. Karbon kislotaning molyar massasini ($\\text{g/mol}$) aniqlang.",
    correct: "88",
    tolerance: 0,
    birlik: "g/mol",
    explanation:
      "$n(\\ce{CO2}) = \\frac{11{,}2}{22{,}4} = 0{,}5\\text{ mol}$. Neytrallashga sarflangan $\\ce{NaOH}$ massasi $32 \\cdot 1{,}25 \\cdot 0{,}125 = 5\\text{ g}$, miqdori $\\frac{5}{40} = 0{,}125\\text{ mol}$. Bir asosli kislota ham $0{,}125\\text{ mol}$. Bitta kislota molekulasidagi uglerod atomlari soni $\\frac{0{,}5}{0{,}125} = 4$ ta ($\\ce{C3H7COOH}$, moy kislota). Molyar massasi $M(\\ce{C4H8O2}) = 4 \\cdot 12 + 8 \\cdot 1 + 2 \\cdot 16 = 88\\text{ g/mol}$.",
  },
];

export default savollar;
