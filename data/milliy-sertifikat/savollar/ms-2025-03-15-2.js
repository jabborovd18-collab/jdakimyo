// 2025-yil 15-mart, II smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Alyuminiy suyultirilgan nitrat kislota eritmasi bilan ta'sirlashdi. Jarayon natijasida gaz ajralib chiqmagan."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$41$",
  B: "$20$",
  C: "$44$",
  D: "$38$",
  E: "$16{,}2$",
  F: "$21{,}6$",
}

const savollar = [
  {
    id: "ms-2025-03-15-2-1",
    turi: "variant",
    mavzu: "Valentlik va anorganik birikmalarning grafik formulalari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2025-03-15-2/savol-1.png",
    question: "Yuqoridagi grafik formulalarga asoslanib, $X$, $Y$ va $Z$ elementlarni mos ravishda ko'rsating.",
    options: [
      "$\\ce{Na}$; $\\ce{Cr(III)}$; $\\ce{Mg}$",
      "$\\ce{Ca}$; $\\ce{Al}$; $\\ce{K}$",
      "$\\ce{Li}$; $\\ce{Fe(II)}$; $\\ce{Mn(IV)}$",
      "$\\ce{Al}$; $\\ce{Mn(II)}$; $\\ce{Li}$",
    ],
    correct: 1,
    explanation:
      "Birinchi tuz grafik formulasida $X$ elementi ikki kislorodga bog'langan ($X\\ce{CO3}$, demak $X$ II valentli — $\\ce{Ca}$). Ikkinchisida $Y$ uchta kislorodga bog'langan gidroksosulfat — $Y(\\ce{OH})\\ce{SO4}$, demak $Y$ III valentli ($\\ce{Al}$). Uchinchisida $Z$ bir valentli gidrokarbonat $Z\\ce{HCO3}$ — $\\ce{K}$.",
  },
  {
    id: "ms-2025-03-15-2-2",
    turi: "variant",
    mavzu: "Gazlar aralashmasining o'rtacha molyar massasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "O'rtacha molekulyar massasi $11{,}6\\text{ g/mol}$ bo'lgan $\\ce{CO2}$, $\\ce{H2}$ va $X$ gazlar aralashmasida $\\ce{CO2}$ hajmi $\\ce{H2}$ hajmiga teng. Agar $X$ gazining massasi $\\ce{H2}$ massasidan $6$ marta katta bo'lsa, $X$ ni aniqlang.",
    options: ["$\\ce{He}$", "$\\ce{Ne}$", "$\\ce{CO}$", "$\\ce{Ar}$"],
    correct: 0,
    explanation:
      "$V(\\ce{CO2}) = V(\\ce{H2})$ bo'lgani uchun $n(\\ce{CO2}) = n(\\ce{H2}) = 1\\text{ mol}$ deb olaylik: $m(\\ce{CO2}) = 44\\text{ g}$, $m(\\ce{H2}) = 2\\text{ g}$. Shartga ko'ra $m(X) = 6 \\cdot 2 = 12\\text{ g}$. Aralashma umumiy massasi $44 + 2 + 12 = 58\\text{ g}$, umumiy moli $n_{\\text{jami}} = 58 / 11{,}6 = 5\\text{ mol}$. Demak $n(X) = 5 - 2 = 3\\text{ mol}$, $M(X) = 12 / 3 = 4\\text{ g/mol}$ ($\\ce{He}$).",
  },
  {
    id: "ms-2025-03-15-2-3",
    turi: "variant",
    mavzu: "Gaz fazali reaksiyalar va bosim o'zgarishi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$1 : 9$ mol nisbatda olingan $\\ce{A2}$ va $\\ce{B2}$ gazlari aralashmasi to'liq reaksiyaga kirishganda yagona gazsimon modda hosil bo'lgan. Reaksiyadan keyin idishdagi bosim dastlabki bosimning $60\\%$ ini tashkil qiladi (harorat va hajm o'zgarmas). Hosil bo'lgan modda formulasini ko'rsating.",
    options: ["$\\ce{AB3}$", "$\\ce{AB5}$", "$\\ce{A2B6}$", "$\\ce{A3B}$"],
    correct: 1,
    explanation:
      "Dastlab $1\\text{ mol } \\ce{A2}$ va $9\\text{ mol } \\ce{B2}$ (jami $10\\text{ mol}$) olingan bo'lsin. Oxirida bosim $60\\%$ bo'lgani uchun $n_{\\text{yak}} = 6\\text{ mol}$. Reaksiya $\\ce{A2 + 5B2 -> 2AB5}$ bo'yicha borsa, $1\\text{ mol } \\ce{A2}$ va $5\\text{ mol } \\ce{B2}$ sarflanib, $2\\text{ mol } \\ce{AB5}$ hosil bo'ladi va $4\\text{ mol } \\ce{B2}$ ortib qoladi: $4 + 2 = 6\\text{ mol}$ ($60\\%$). ($\\ce{AB3}$ da $8\\text{ mol}$, ya'ni $80\\%$ qolar edi).",
  },
  {
    id: "ms-2025-03-15-2-4",
    turi: "variant",
    mavzu: "Karbon kislotalar tarkibini aniqlash",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$64{,}4\\text{ g}$ bir asosli to'yingan karbon kislota namunasida jami $7\\text{ mol}$ atom mavjud bo'lsa, kislotani aniqlang.",
    options: ["$\\ce{CH3COOH}$", "$\\ce{C2H5COOH}$", "$\\ce{HCOOH}$", "$\\ce{C3H7COOH}$"],
    correct: 2,
    explanation:
      "Bir asosli to'yingan karbon kislota formulasi $\\ce{C_n H_{2n}O2}$ bo'lib, $1\\text{ mol}$ da $(3n + 2)\\text{ mol}$ atom va $M = (14n + 32)\\text{ g/mol}$ massaga ega. $7 / (3n + 2) \\cdot (14n + 32) = 64{,}4 \\Rightarrow 98n + 224 = 193{,}2n + 128{,}8 \\Rightarrow 95{,}2n = 95{,}2 \\Rightarrow n = 1$, ya'ni chumoli kislota ($\\ce{HCOOH}$, $1{,}4\\text{ mol} \\cdot 46 = 64{,}4\\text{ g}$).",
  },
  {
    id: "ms-2025-03-15-2-5",
    turi: "variant",
    mavzu: "Atom tuzilishi va elektron qavatlarning to'lish qoidalari",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Klechkovskiy qoidasi to'g'ri keltirilgan qatorni belgilang.",
    options: [
      "Energiyalari bir xil bo'lgan orbitallarda elektronlar shunday joylashadiki, natijada spinlar yig'indisi maksimal qiymatga ega bo'ladi.",
      "Ikki holatdan qaysi biri uchun $(n + l)$ yig'indisi kichik bo'lsa, o'sha pog'onacha elektronlar bilan birinchi navbatda to'la boshlaydi.",
      "Atomda to'rttala kvant sonlari bir xil qiymatga ega bo'lgan elektronlar mavjud bo'la olmaydi.",
      "Agar ikki element bir-biri bilan bir necha birikma hosil qilsa, bir elementning bir xil massasiga to'g'ri keluvchi ikkinchi element massalari kichik butun sonlar nisbatida bo'ladi.",
    ],
    correct: 1,
    explanation:
      "Klechkovskiyning birinchi qoidasiga ko'ra energetik pog'onachalarning elektronlar bilan to'lishi $(n + l)$ yig'indisining ortib borish tartibida boradi. A band — Hund qoidasi, C band — Pauli prinsipi, D band — karrali nisbatlar qonuni.",
  },
  {
    id: "ms-2025-03-15-2-6",
    turi: "variant",
    mavzu: "Nitratlarning termik parchalanishi va oksidlanish darajasi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Kaliy nitrat tuzi termik parchalanganda azotning oksidlanish darajasi necha birlikka o'zgaradi?",
    options: ["$2$", "$3$", "$5$", "$4$"],
    correct: 0,
    explanation:
      "Ishqoriy metallar nitratlari qizdirilganda nitrit va kislorodga ajraladi: $\\ce{2KNO3 ->[t] 2KNO2 + O2 ^}$. Azotning oksidlanish darajasi $+5$ dan $+3$ gacha pasayadi, ya'ni $2$ birlikka o'zgaradi.",
  },
  {
    id: "ms-2025-03-15-2-7",
    turi: "variant",
    mavzu: "Kovalent bog'lar soni (sigma va pi bog'lar)",
    soha: "Umumiy kimyo",
    daraja: "qiyin",
    rasm: "/images/ms/ms-2025-03-15-2/savol-7.png",
    question:
      "Sxema bo'yicha molekula (yoki formula birligi) tarkibidagi $\\sigma$ va $\\pi$ bog'lar soni yig'indisining o'zgarishi to'g'ri ko'rsatilgan javobni tanlang.",
    options: [
      "$1$ — ortadi; $2$ — o'zgarmaydi; $3$ — kamayadi",
      "$1$ — o'zgarmaydi; $2$ — kamayadi; $3$ — ortadi",
      "$1$ — o'zgarmaydi; $2$ — ortadi; $3$ — kamayadi",
      "$1$ — kamayadi; $2$ — ortadi; $3$ — o'zgarmaydi",
    ],
    correct: 2,
    explanation:
      "Sulfat angidrid ($\\ce{SO3}$) da $3$ ta $\\sigma$ va $3$ ta $\\pi$ bog' (jami $6$ ta). Litiy xlorat ($\\ce{LiClO3}$) da $\\ce{Li-O-Cl(=O)2}$ tuzilishiga ko'ra $4$ ta $\\sigma$ va $2$ ta $\\pi$ bog' (jami $6$ ta — $1$-bosqich o'zgarmaydi). Kaliy manganat ($\\ce{K2MnO4}$) da $(\\ce{K-O})_2\\ce{Mn(=O)2}$ bo'yicha $6$ ta $\\sigma$ va $2$ ta $\\pi$ bog' (jami $8$ ta — $2$-bosqich ortadi). Qaytib $\\ce{SO3}$ ga o'tishda $8 \\rightarrow 6$ ($3$-bosqich kamayadi).",
  },
  {
    id: "ms-2025-03-15-2-8",
    turi: "variant",
    mavzu: "Gazlar aralashmasi va Avogadro soni",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "$1{,}1\\text{ mol}$ fosfin ($\\ce{PH3}$) va silan ($\\ce{SiH4}$) aralashmasida vodorod atomlari soni $3{,}6 \\cdot N_A$ ta bo'lsa, aralashmadagi silan massasini ($\\text{g}$) hisoblang.",
    options: ["$3{,}2$", "$9{,}6$", "$27{,}2$", "$12{,}8$"],
    correct: 1,
    explanation:
      "$n(\\ce{PH3}) = x$, $n(\\ce{SiH4}) = y$ bo'lsin. $x + y = 1{,}1$ va $3x + 4y = 3{,}6$. Birinchi tenglamani $3$ ga ko'paytirib ayiramiz: $y = 3{,}6 - 3{,}3 = 0{,}3\\text{ mol}$ silan. Massasi: $m(\\ce{SiH4}) = 0{,}3 \\cdot 32 = 9{,}6\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-9",
    turi: "variant",
    mavzu: "Tuzlar gidrolizi va muvozanat siljishi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question: "Kaliy silikat ($\\ce{K2SiO3}$) tuzining gidrolizini sekinlashtirish uchun qaysi moddani qo'shish kerak?",
    options: ["Alyuminiy bromid", "Suv", "O'yuvchi natriy", "Simob(II)-nitrat"],
    correct: 2,
    explanation:
      "$\\ce{SiO3^{2-} + H2O <=> HSiO3- + OH-}$. Ishqoriy muhit hosil qiluvchi o'yuvchi natriy ($\\ce{NaOH}$) qo'shilganda $\\ce{OH-}$ ionlari konsentratsiyasi ortadi va muvozanat chapga siljib, gidroliz susayadi. Suv suyultirishi va $\\ce{AlBr3}$, $\\ce{Hg(NO3)2}$ kabi kislotali tuzlar esa gidrolizni kuchaytiradi.",
  },
  {
    id: "ms-2025-03-15-2-10",
    turi: "variant",
    mavzu: "Glyukozaning bijg'ishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Glyukozaning $1/5$ qismi spirtli bijg'itilganda $0{,}6\\text{ mol}$ gaz ajraldi. Qolgan qismi moy kislotali bijg'itilganda jami necha mol gaz ajraladi?",
    options: ["$2{,}4$", "$4{,}8$", "$1{,}2$", "$3{,}6$"],
    correct: 1,
    explanation:
      "Spirtli bijg'ish: $\\ce{C6H12O6 -> 2C2H5OH + 2CO2 ^}$. $0{,}6\\text{ mol}$ $\\ce{CO2}$ hosil bo'lgani uchun $0{,}3\\text{ mol}$ glyukoza ($1/5$ qism) sarflangan; jami glyukoza $1{,}5\\text{ mol}$, qolgani $1{,}2\\text{ mol}$. Moy kislotali bijg'ish: $\\ce{C6H12O6 -> C3H7COOH + 2H2 ^ + 2CO2 ^}$ ($1\\text{ mol}$ dan $4\\text{ mol}$ gaz). Jami gaz: $1{,}2 \\cdot 4 = 4{,}8\\text{ mol}$.",
  },
  {
    id: "ms-2025-03-15-2-11",
    turi: "variant",
    mavzu: "Arenlar gomologlari va gibridlanish",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Benzol gomologi molekulasidagi $sp^3$-gibridlangan orbitallar soni shu molekuladagi barcha vodorod atomlari oksidlanish darajalari yig'indisiga teng bo'lsa, $0{,}25\\text{ mol}$ benzol gomologining massasini ($\\text{g}$) hisoblang.",
    options: ["$120$", "$12$", "$30{,}0$", "$24{,}0$"],
    correct: 2,
    explanation:
      "Benzol gomologi formulasi $\\ce{C_n H_{2n-6}}$. Benzol halqasidan tashqaridagi $(n - 6)$ ta uglerod $sp^3$-gibridlangan bo'lib, $4(n - 6)$ ta $sp^3$ orbital hosil qiladi. Har bir vodorod $+1$ oksidlanish darajasiga ega bo'lgani uchun yig'indi $+(2n - 6)$. Tenglama: $4(n - 6) = 2n - 6 \\Rightarrow 2n = 18 \\Rightarrow n = 9$ ($\\ce{C9H12}$, $M = 120\\text{ g/mol}$). $0{,}25\\text{ mol}$ massasi: $0{,}25 \\cdot 120 = 30{,}0\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-12",
    turi: "variant",
    mavzu: "Tuzlarning eruvchanligi va neytrallanish reaksiyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$200\\text{ g}$ $10\\%$ li $\\ce{NaOH}$ eritmasiga yetarli miqdorda $18{,}25\\%$ li xlorid kislota eritmasi qo'shilganda necha gramm $\\ce{NaCl}$ cho'kmaga tushadi? ($S(\\ce{NaCl}) = 10\\text{ g} / 100\\text{ g suv}$)",
    options: ["$2{,}175$", "$1{,}275$", "$3{,}125$", "$2{,}715$"],
    correct: 0,
    explanation:
      "$m(\\ce{NaOH}) = 200 \\cdot 0{,}10 = 20\\text{ g}$ ($0{,}5\\text{ mol}$) va eritmada $180\\text{ g}$ suv bor. Ekvivalent $\\ce{HCl}$ ($0{,}5\\text{ mol} = 18{,}25\\text{ g}$) uchun $100\\text{ g}$ ($18{,}25\\%$ li) eritma ketadi, unda $81{,}75\\text{ g}$ suv mavjud. Reaksiyada $0{,}5\\text{ mol}$ $\\ce{NaCl}$ ($29{,}25\\text{ g}$) va $0{,}5\\text{ mol}$ suv ($9\\text{ g}$) hosil bo'ladi. Jami suv: $180 + 81{,}75 + 9 = 270{,}75\\text{ g}$. Unda $270{,}75 \\cdot 0{,}10 = 27{,}075\\text{ g}$ tuz eriydi. Cho'kma: $29{,}25 - 27{,}075 = 2{,}175\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-13",
    turi: "variant",
    mavzu: "Karbon kislota va murakkab efirlar izomeriyasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Moy kislotasining ($\\ce{C3H7COOH}$) izomerini ko'rsating.",
    options: [
      "Propil metanoat",
      "Sirka kislotaning propil efiri",
      "Metil propil efiri",
      "Izomoy kislotaning metil efiri",
    ],
    correct: 0,
    explanation:
      "Moy kislotasi tarkibi $\\ce{C4H8O2}$. Propil metanoat ($\\ce{HCOOC3H7}$) tarkibi ham $\\ce{C4H8O2}$ bo'lgani uchun u bilan sinflararo izomerdir. Propil atsetat va metilizobutirat $\\ce{C5H10O2}$, metilpropil efir esa $\\ce{C4H10O}$ tarkibiga ega.",
  },
  {
    id: "ms-2025-03-15-2-14",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Hajmi $6\\text{ litr}$ bo'lgan reaktorda kislorod reaksiyaga kirishganda $90\\text{ sekund}$ davomida uning massasi $160\\text{ g}$ dan $16\\text{ g}$ gacha kamaygan. Reaksiyaning kislorod bo'yicha o'rtacha tezligini ($\\text{mol/(l}\\cdot\\text{soat)}$) hisoblang.",
    options: ["$0{,}5$", "$30$", "$108$", "$0{,}0125$"],
    correct: 1,
    explanation:
      "Sarflangan $\\ce{O2}$: $(160 - 16)/32 = 4{,}5\\text{ mol}$. Konsentratsiya o'zgarishi: $\\Delta C = 4{,}5 / 6 = 0{,}75\\text{ mol/l}$. Vaqt: $90\\text{ s} = 90/3600 = 0{,}025\\text{ soat}$. Tezlik: $v = 0{,}75 / 0{,}025 = 30\\text{ mol/(l}\\cdot\\text{soat)}$.",
  },
  {
    id: "ms-2025-03-15-2-15",
    turi: "variant",
    mavzu: "Yuqori molekulyar birikmalar (polimerlar)",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Polipropilenning o'rtacha nisbiy molekulyar massasi $6720$ ga teng bo'lsa, polimerlanish darajasini toping.",
    options: ["$160$", "$320$", "$240$", "$120$"],
    correct: 0,
    explanation:
      "Polipropilen monomer zvenosi ($-\\ce{CH2-CH(CH3)}-$) ning molyar massasi $M(\\ce{C3H6}) = 42\\text{ g/mol}$. Polimerlanish darajasi: $n = 6720 / 42 = 160$.",
  },
  {
    id: "ms-2025-03-15-2-16",
    turi: "variant",
    mavzu: "Alkenlarning Vagner reaksiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Noma'lum alken kaliy permanganatning neytral suvli eritmasi bilan oksidlandi. Tenglashtirilgan reaksiya tenglamasining chap va o'ng tomondagi jami atomlar soni yig'indisi $84$ ga teng bo'lsa, alkenni aniqlang.",
    options: ["Etilen", "Propilen", "Buten", "Penten"],
    correct: 0,
    explanation:
      "$\\ce{3C_n H_{2n} + 2KMnO4 + 4H2O -> 3C_n H_{2n}(OH)2 + 2MnO2 + 2KOH}$. Har bir tomondagi atomlar soni $3 \\cdot (3n) + 2 \\cdot 6 + 4 \\cdot 3 = 9n + 24$. Ikkala tomondagi atomlar jami $2(9n + 24) = 84 \\Rightarrow 9n + 24 = 42 \\Rightarrow n = 2$, ya'ni etilen ($\\ce{C2H4}$).",
  },
  {
    id: "ms-2025-03-15-2-17",
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish reaksiyalari va stexiometriya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$x\\text{ g}$ fosfor konsentrlangan nitrat kislota bilan to'liq ta'sirlashdi. Xuddi shuncha mol nitrat kislota bilan $y\\text{ g}$ mis ta'sirlashadi ($y - x = 7$). Agar $Z\\text{ g}$ temir $\\ce{CuSO4}$ eritmasiga tushirilganda $y\\text{ g}$ mis siqib chiqarilsa, $Z$ ni toping.",
    options: ["$8$", "$10$", "$5{,}6$", "$11{,}2$"],
    correct: 1,
    explanation:
      "$\\ce{P + 5HNO3 -> H3PO4 + 5NO2 + H2O}$ ($1:5$) va $\\ce{Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O}$ ($1:4$). $\\ce{HNO3}$ miqdorini $20k$ desak, $n(\\ce{P}) = 4k$ ($x = 124k$), $n(\\ce{Cu}) = 5k$ ($y = 320k$). $320k - 124k = 196k = 7 \\Rightarrow k = 1/28\\text{ mol}$. $\\ce{Fe + CuSO4 -> FeSO4 + Cu}$ reaksiyasidan $n(\\ce{Fe}) = n(\\ce{Cu}) = 5/28\\text{ mol}$, demak $Z = (5/28) \\cdot 56 = 10\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-18",
    turi: "variant",
    mavzu: "Ketma-ket organik sintez unumi (Vyurs reaksiyasi)",
    soha: "Organik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2025-03-15-2/savol-18.png",
    question:
      "Yuqoridagi sxemada har bir bosqichning reaksiya unumi bir xil bo'lsa, bir bosqich unumini ($\\%$) aniqlang.",
    options: ["$80$", "$90$", "$75$", "$60$"],
    correct: 0,
    explanation:
      "$10\\text{ l}$ metandan ($\\ce{CH4 ->[+Cl2] CH3Cl}$) unum $x$ bilan $10x\\text{ l}$ xlorometan hosil bo'ladi. Vyurs reaksiyasi ($\\ce{2CH3Cl + 2Na -> C2H6 + 2NaCl}$) da $2\\text{ hajm} \\rightarrow 1\\text{ hajm}$ etan chiqadi: $V(\\ce{C2H6}) = \\frac{10x}{2} \\cdot x = 5x^2 = 3{,}2 \\Rightarrow x^2 = 0{,}64 \\Rightarrow x = 0{,}8 = 80\\%$.",
  },
  {
    id: "ms-2025-03-15-2-19",
    turi: "variant",
    mavzu: "Oleum tarkibini hisoblash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Tarkibida $0{,}3\\text{ mol}$ oltingugurt saqlagan oleumni to'liq neytrallash uchun $24\\%$ li $\\ce{NaOH}$ eritmasi qo'shildi. Hosil bo'lgan eritmaga $174{,}2\\text{ g}$ suv qo'shilganda $14{,}2\\%$ li tuz eritmasi olindi. Dastlabki oleumdagi erituvchi ($\\ce{H2SO4}$) va erigan modda ($\\ce{SO3}$) mol nisbatini aniqlang.",
    options: ["$2 : 3$", "$1 : 5$", "$3 : 5$", "$1 : 2$"],
    correct: 3,
    explanation:
      "$0{,}3\\text{ mol}$ $\\ce{S}$ to'liq $0{,}3\\text{ mol}$ $\\ce{Na2SO4}$ ($0{,}3 \\cdot 142 = 42{,}6\\text{ g}$) beradi va $0{,}6\\text{ mol}$ $\\ce{NaOH}$ ($24\\text{ g}$, $24\\%$ li eritmadan $100\\text{ g}$) sarflaydi. Yakuniy eritma massasi $42{,}6 / 0{,}142 = 300\\text{ g}$. Shundan oleum massasi: $300 - 100 - 174{,}2 = 25{,}8\\text{ g}$. $a + b = 0{,}3$ va $98a + 80b = 25{,}8 \\Rightarrow 18a = 1{,}8 \\Rightarrow a(\\ce{H2SO4}) = 0{,}1\\text{ mol}$, $b(\\ce{SO3}) = 0{,}2\\text{ mol}$, nisbat $1 : 2$.",
  },
  {
    id: "ms-2025-03-15-2-20",
    turi: "variant",
    mavzu: "Kislorodli organik birikma tuzilishini aniqlash",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$\\ce{C_x H_y O_z}$ ($M = 72\\text{ g/mol}$) moddada atomlar soni nisbati $y(\\ce{H}) : x(\\ce{C}) = 2 : 1$, massa nisbati $m(\\ce{O}) : m(\\ce{H}) = 2 : 1$ bo'lib, molekulasida ikkilamchi uglerod atomi yo'q. Ushbu modda qaysi bo'lishi mumkin?",
    options: ["Izomoy aldegid", "Moy aldegid", "Atseton", "Butanon"],
    correct: 0,
    explanation:
      "$y = 2x$ va $16z / (2x) = 2 \\Rightarrow x = 4z$. $z = 1$ da $\\ce{C4H8O}$ ($M = 72\\text{ g/mol}$) chiqadi. Moy aldegid ($\\ce{CH3CH2CH2CHO}$) va butanon ($\\ce{CH3CH2COCH3}$) tarkibida ikkilamchi uglerod mavjud; atseton formulasida $3$ ta uglerod bor. Faqat izomoy aldegid ($\\ce{(CH3)2CH-CHO}$) da ikkilamchi uglerod yo'q.",
  },
  {
    id: "ms-2025-03-15-2-21",
    turi: "variant",
    mavzu: "Kvant sonlari va ionlarning elektron konfiguratsiyasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question: "$\\ce{Ti}$ atomi va $\\ce{Fe^{3+}}$ ionida to'rttala kvant soni bir xil bo'lgan nechta elektron juftligi (elektron) mavjud?",
    options: ["$18$", "$22$", "$20$", "$19$"],
    correct: 2,
    explanation:
      "$\\ce{Ti}$ ($Z=22$): $[\\ce{Ar}]\\,3d^2\\,4s^2$. $\\ce{Fe^{3+}}$ ($26 - 3 = 23\\text{ e}^-$): $[\\ce{Ar}]\\,3d^5$. Ikkalasida ham $[\\ce{Ar}]$ qobig'idagi $18$ ta elektron va Hund qoidasiga ko'ra bir xil yo'nalishli spinga ega dastlabki $2$ ta $3d$-elektronning $(n, l, m_l, m_s)$ kvant sonlari to'liq mos tushishi mumkin ($4s^2$ faqat titanda bor). Jami: $18 + 2 = 20$.",
  },
  {
    id: "ms-2025-03-15-2-22",
    turi: "variant",
    mavzu: "O'tish metallarining xloridlari va gidroksidlari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$A + \\ce{Cl2 -> } B$, $B + A \\rightarrow D$. $D$ moddaga o'yuvchi natriy qo'shilganda osh tuzi va $E$ modda hosil bo'ldi. $E$ modda haqidagi to'g'ri fikrni toping.",
    options: [
      "$\\ce{NaCrO2}$ nisbiy molekulyar massasi bilan bir xil",
      "Formula birligida (molekulasida) $5$ ta atom tutadi",
      "Normal sharoitda gaz hisoblanadi",
      "$\\ce{Cu(OH)2}$ molyar massasi bilan bir xil",
    ],
    correct: 1,
    explanation:
      "Bu ketma-ketlik temirga xos: $\\ce{2Fe + 3Cl2 -> 2FeCl3}$ ($B$), $\\ce{2FeCl3 + Fe -> 3FeCl2}$ ($D$), $\\ce{FeCl2 + 2NaOH -> 2NaCl + Fe(OH)2 v}$ ($E$). $\\ce{Fe(OH)2}$ ($M = 90\\text{ g/mol}$) tarkibida $1\\text{ Fe} + 2\\text{ O} + 2\\text{ H} = 5$ ta atom mavjud (va uning massasi $\\ce{Cu(OH)2}$ ($98$) hamda $\\ce{NaCrO2}$ ($107$) nikiga teng emas).",
  },
  {
    id: "ms-2025-03-15-2-23",
    turi: "variant",
    mavzu: "Elektroliz va eritma massa ulushi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Mis(II)-sulfat eritmasi tuz to'liq sarflanib tugaguncha elektroliz qilindi. Bunda eritma massasi $4\\%$ ga kamaygan bo'lsa, dastlabki eritmadagi tuzning massa ulushini aniqlang.",
    options: ["$4\\%$", "$6\\%$", "$8\\%$", "$10\\%$"],
    correct: 2,
    explanation:
      "Elektroliz: $\\ce{2CuSO4 + 2H2O -> 2Cu v + O2 ^ + 2H2SO4}$. Har $2\\text{ mol}$ $\\ce{CuSO4}$ ($320\\text{ g}$) sarflanganda eritmadan $2\\text{ mol}$ $\\ce{Cu}$ ($128\\text{ g}$) va $1\\text{ mol}$ $\\ce{O2}$ ($32\\text{ g}$), jami $160\\text{ g}$ massa chiqib ketadi ($160 / 320 = 0{,}5$). Demak, $4\\%$ massa yo'qolishi $4\\% \\cdot 2 = 8\\%$ dastlabki tuzga mos keladi.",
  },
  {
    id: "ms-2025-03-15-2-24",
    turi: "variant",
    mavzu: "Organik birikmalarning sinflanishi, izomeriya va gomologiya",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Quyidagi qatorlarning qaysi birida modda, uning izomeri, gomologi va polimerlanish xossasi to'liq to'g'ri berilgan?\n" +
      "$1)$ Modda: buten $|$ Izomeri: penten $|$ Gomologi: geksen $|$ Xossasi: polimerlanadi\n" +
      "$2)$ Modda: etanol $|$ Izomeri: dimetil efir $|$ Gomologi: pentanol $|$ Xossasi: polimerlanadi\n" +
      "$3)$ Modda: ksilol $|$ Izomeri: etilbenzol $|$ Gomologi: propilbenzol $|$ Xossasi: polimerlanmaydi\n" +
      "$4)$ Modda: $2$-nitropropan $|$ Izomeri: glitsin $|$ Gomologi: nitrometan $|$ Xossasi: polimerlanmaydi",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 2,
    explanation:
      "$1$-qatorda buten ($\\ce{C4H8}$) va penten ($\\ce{C5H10}$) izomer emas. $2$-qatorda etanol spirt bo'lgani uchun polimerlanmaydi. $4$-qatorda glitsin ($\\ce{C2H5NO2}$) $2$-nitropropan ($\\ce{C3H7NO2}$) bilan izomer emas. $3$-qatorda ksilol va etilbenzol ikkalasi $\\ce{C8H10}$ (izomer), propilbenzol ($\\ce{C9H12}$) ularning gomologi va arenlar polimerlanmaydi — barchasi to'g'ri.",
  },
  {
    id: "ms-2025-03-15-2-25",
    turi: "variant",
    mavzu: "Minerallar va tabiiy birikmalar formulasi",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "Asosiy tarkibiy qismida magniy elementi bo'lgan mineralni belgilang.",
    options: ["Magnezit", "Silvinit", "Glauber tuzi", "Magnetit"],
    correct: 0,
    explanation:
      "Magnezit — magniy karbonat ($\\ce{MgCO3}$). Silvinit — $\\ce{KCl \\cdot NaCl}$, Glauber tuzi — $\\ce{Na2SO4 \\cdot 10H2O}$, magnetit — $\\ce{Fe3O4}$ (temirtosh).",
  },
  {
    id: "ms-2025-03-15-2-26",
    turi: "variant",
    mavzu: "Oqsillarning sifat reaksiyalari",
    soha: "Organik kimyo",
    daraja: "oson",
    question: "Biuret reaksiyasi qaysi bog' (yoki guruh) uchun sifat reaksiyasi hisoblanadi?",
    options: [
      "$-\\ce{CO-NH}-$",
      "$-\\ce{S-S}-$",
      "$-\\ce{C(=O)-O-R}$",
      "$-\\ce{C-C}-$",
    ],
    correct: 0,
    explanation:
      "Biuret reaksiyasi ishqoriy muhitda mis(II) ionlarining oqsil va polipeptidlardagi peptid bog'lari ($-\\ce{CO-NH}-$) bilan rangli kompleks hosil qilishiga asoslangan.",
  },
  {
    id: "ms-2025-03-15-2-27",
    turi: "variant",
    mavzu: "Biuret reaksiyasi va peptid zanjiri uzunligi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Oqsillar va peptidlarga xos sifat reaksiyalardan biri biuret reaksiyasi hisoblanadi. Peptid zanjiri uzunligiga qarab hosil bo'ladigan ranglar to'g'ri berilgan javobni tanlang.",
    options: [
      "dipeptid — ko'k, tripeptid — binafsha, yuqori peptid — qizil rang beradi",
      "tripeptid — ko'k, dipeptid — binafsha, yuqori peptid — qizil rang beradi",
      "yuqori peptid — ko'k, tripeptid — binafsha, dipeptid — qizil rang beradi",
      "dipeptid — ko'k, yuqori peptid — binafsha, tripeptid — qizil rang beradi",
    ],
    correct: 0,
    explanation:
      "Biuret reaksiyasida $\\ce{Cu^{2+}}$ ionlari ishqoriy muhitda bitta peptid bog'li dipeptid bilan ko'k kompleks, ikkita peptid bog'li tripeptid bilan binafsha kompleks, undan uzun zanjirli yuqori peptidlar bilan esa qizil (qizg'ish-pushti) rangli kompleks hosil qiladi.",
  },
  {
    id: "ms-2025-03-15-2-28",
    turi: "variant",
    mavzu: "Eritmalar pH va pOH ko'rsatkichi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$0{,}4\\text{ litr}$ $24{,}5\\%$ li sulfat kislota eritmasiga ($\\rho = 1{,}25\\text{ g/ml}$) hajmi $2\\text{ m}^3$ bo'lguncha suv quyilib suyultirildi. Hosil bo'lgan eritmaning $\\text{pOH}$ qiymatini (yaqinlashtirilgan holda) toping.",
    options: ["$3$", "$3{,}5$", "$11$", "$11{,}5$"],
    correct: 2,
    explanation:
      "$400\\text{ ml} \\cdot 1{,}25\\text{ g/ml} = 500\\text{ g}$ eritmada $500 \\cdot 0{,}245 = 122{,}5\\text{ g}$ ($1{,}25\\text{ mol}$) $\\ce{H2SO4}$ bor ($2{,}5\\text{ mol}$ $\\ce{H+}$). $2\\text{ m}^3 = 2000\\text{ l}$ da $[\\ce{H+}] = 2{,}5 / 2000 = 1{,}25 \\cdot 10^{-3}\\text{ M}$, ikkinchi bosqich ham deyarli to'liq dissotsiatsiyalanib $\\text{pH} \\approx 3$ ($2{,}92$), shuning uchun $\\text{pOH} = 14 - \\text{pH} \\approx 11$.",
  },
  {
    id: "ms-2025-03-15-2-29",
    turi: "variant",
    mavzu: "Kimyoviy muvozanat doimiysi va reaksiya tezligi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Hajmi $10\\text{ litr}$ bo'lgan idishda noma'lum miqdordagi $\\ce{CO2}$ va $4\\text{ mol}$ $\\ce{H2}$ dan iborat aralashma reaksiyaga kirishdi ($\\ce{CO2 + H2 <=> CO + H2O}$). $72\\text{ sekund}$ vaqt o'tgach muvozanat qaror topdi ($K_m = 1$). Reaksiyaning o'rtacha tezligi $0{,}25\\text{ mol/(l}\\cdot\\text{min)}$ ga teng bo'lsa, dastlabki $\\ce{CO2}$ miqdorini ($\\text{mol}$) aniqlang.",
    options: ["$1{,}2$", "$0{,}9$", "$9$", "$12$"],
    correct: 3,
    explanation:
      "$72\\text{ s} = 1{,}2\\text{ min}$ ichida konsentratsiya $\\Delta C = 0{,}25 \\cdot 1{,}2 = 0{,}3\\text{ mol/l}$ ga, ya'ni $0{,}3 \\cdot 10 = 3\\text{ mol}$ modda reaksiyaga kirishgan. Muvozanatda: $[\\ce{CO}] = [\\ce{H2O}] = 0{,}3$, $[\\ce{H2}] = (4 - 3)/10 = 0{,}1\\text{ mol/l}$. $K_m = \\frac{0{,}3 \\cdot 0{,}3}{[\\ce{CO2}] \\cdot 0{,}1} = 1 \\Rightarrow [\\ce{CO2}]_{\\text{muv}} = 0{,}9\\text{ mol/l}$ ($9\\text{ mol}$). Dastlabki $\\ce{CO2}$: $9 + 3 = 12\\text{ mol}$.",
  },
  {
    id: "ms-2025-03-15-2-30",
    turi: "variant",
    mavzu: "Aminlarning kislotalar bilan reaksiyasi va gazlar aralashmasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$\\ce{CO2}$ va $\\ce{CH3NH2}$ dan iborat $7\\text{ litr}$ gazlar aralashmasi $5\\text{ litr}$ gazsimon $\\ce{HBr}$ bilan ta'sirlashdi. Reaksiyadan so'ng vodorodga nisbatan zichligi $29{,}4$ ga teng bo'lgan $2$ ta gazdan iborat aralashma hosil bo'ldi. Dastlabki aralashmadagi $\\ce{CO2}$ ning hajmini ($\\text{l}$) aniqlang.",
    options: ["$4$", "$6$", "$5$", "$3$"],
    correct: 1,
    explanation:
      "$\\ce{CH3NH2 + HBr -> [CH3NH3]Br}$ (qattiq tuz). Qolgan gazlar zichligi $M_{\\text{o'rt}} = 29{,}4 \\cdot 2 = 58{,}8\\text{ g/mol}$ (bu $\\ce{CO2}=44$ va $\\ce{HBr}=81$ oralig'ida, demak $\\ce{HBr}$ ortib qolgan!). $\\ce{CO2}$ hajmini $x$, $\\ce{CH3NH2}$ ni $(7 - x)$ desak, qolgan $\\ce{HBr}$ hajmi $5 - (7 - x) = x - 2$. $\\frac{44x + 81(x - 2)}{x + (x - 2)} = 58{,}8 \\Rightarrow 125x - 162 = 117{,}6x - 117{,}6 \\Rightarrow 7{,}4x = 44{,}4 \\Rightarrow x = 6\\text{ l}$.",
  },
  {
    id: "ms-2025-03-15-2-31",
    turi: "variant",
    mavzu: "Fosfat kislotaning ko'p bosqichli tuz hosil qilishi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    rasm: "/images/ms/ms-2025-03-15-2/savol-31.png",
    question:
      "Sxema bo'yicha dastlab $5{,}6\\text{ g}$ temir ($0{,}1\\text{ mol}$) va $0{,}2\\text{ mol}$ $\\ce{H3PO4}$ dan boshlab, keyingi bosqichlarda ham $0{,}1\\text{ mol}$ dan temir ta'sir ettirilganda barcha reaksiyalar $100\\%$ unum bilan borgan. Hosil bo'lgan $X_3$ moddaning massasini ($\\text{g}$) toping.",
    options: ["$25{,}8$", "$30{,}4$", "$35{,}8$", "$71{,}6$"],
    correct: 2,
    explanation:
      "$0{,}1\\,\\ce{Fe} + 0{,}2\\,\\ce{H3PO4 ->} 0{,}1\\,\\ce{Fe(H2PO4)2}$ ($X_1$). Ikkinchi bosqichda $+0{,}1\\,\\ce{Fe} \\rightarrow 0{,}2\\,\\ce{FeHPO4}$ ($X_2$). Uchinchi bosqichda $+0{,}1\\,\\ce{Fe} \\rightarrow 0{,}1\\,\\ce{Fe3(PO4)2}$ ($X_3$). Temir(II)-fosfat molyar massasi $3 \\cdot 56 + 2 \\cdot 95 = 358\\text{ g/mol}$, demak $0{,}1\\text{ mol}$ massasi $35{,}8\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-32",
    turi: "variant",
    mavzu: "Xlorning kislorodli kislotalari xossalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question:
      "$\\ce{HClO}$, $\\ce{HClO2}$, $\\ce{HClO3}$, $\\ce{HClO4}$ qatorida chapdan o'ngga qarab kislotalik kuchi, barqarorlik va oksidlovchilik xossasi berilgan tartibda qanday o'zgaradi?",
    options: [
      "ortadi, ortadi, kamayadi",
      "kamayadi, kamayadi, ortadi",
      "kamayadi, ortadi, kamayadi",
      "ortadi, ortadi, ortadi",
    ],
    correct: 0,
    explanation:
      "Xlorning oksidlanish darajasi ($+1 \\rightarrow +7$) va kislorod atomlari soni ortishi bilan suyultirilgan suvli eritmalarda kislota kuchi keskin ortadi, molekulaning termodinamik barqarorligi ortadi, oksidlovchilik faolligi esa kamayadi.",
  },
  {
    id: "ms-2025-03-15-2-33",
    turi: "moslashtirish",
    mavzu: "Alyuminiyning nitrat kislota bilan reaksiyasi koeffitsiyentlari",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. Reaksiyaning chap tomonidagi koeffitsiyentlar yig'indisini toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "Gaz ajralmagani uchun nitrat ionlari ammoniy ionigacha qaytariladi: $\\ce{8Al + 30HNO3 -> 8Al(NO3)3 + 3NH4NO3 + 9H2O}$. Chap tomondagi koeffitsiyentlar yig'indisi: $8 + 30 = 38$ (D).",
  },
  {
    id: "ms-2025-03-15-2-34",
    turi: "moslashtirish",
    mavzu: "Qisqa ionli tenglama koeffitsiyentlari",
    soha: "Umumiy kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. Reaksiyaning qisqa ionli tenglamasidagi ionlar oldidagi koeffitsiyentlar yig'indisini aniqlang.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "Qisqa ionli tenglama: $\\ce{8Al + 30H+ + 3NO3- -> 8Al^{3+} + 3NH4+ + 9H2O}$. Faqat ionlar ($\\ce{H+}$, $\\ce{NO3-}$, $\\ce{Al^{3+}}$, $\\ce{NH4+}$) oldidagi koeffitsiyentlar yig'indisi: $30 + 3 + 8 + 3 = 44$ (C).",
  },
  {
    id: "ms-2025-03-15-2-35",
    turi: "moslashtirish",
    mavzu: "Reaksiya stexiometriyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "35. Agar $0{,}8\\text{ mol}$ $\\ce{Al}$ reaksiyaga kirishgan bo'lsa, hosil bo'lgan suvning massasini ($\\text{g}$) toping.",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "E",
    explanation:
      "Tenglamaga ko'ra $8\\text{ mol}$ $\\ce{Al}$ sarflanganda $9\\text{ mol}$ $\\ce{H2O}$ hosil bo'ladi. $0{,}8\\text{ mol}$ $\\ce{Al}$ dan $0{,}9\\text{ mol}$ suv olinadi: $m(\\ce{H2O}) = 0{,}9 \\cdot 18 = 16{,}2\\text{ g}$ (E).",
  },
  {
    id: "ms-2025-03-15-2-36",
    turi: "ochiq",
    mavzu: "Eritmalarda reaksiya va suv bug'latish",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$10{,}16\\text{ g}$ noma'lum metalmas oksidi ($\\ce{SeO3}$) $110{,}4\\text{ g}$ $10\\%$ li $\\ce{NaOH}$ eritmasi bilan ta'sirlashdi va natijada taxminan $12{,}5\\%$ li o'rta tuz eritmasi olindi. Hosil bo'lgan eritmadan necha gramm suv bug'latilsa, eritmadagi qolgan $\\ce{NaOH}$ konsentratsiyasi reaksiyadan keyingi qiymatiga nisbatan $2{,}5$ marta ortadi?",
    correct: "72.34",
    tolerance: 0.5,
    birlik: "g",
    explanation:
      "Reaksiyadan keyingi eritma massasi $m_1 = 10{,}16 + 110{,}4 = 120{,}56\\text{ g}$. Unda $0{,}08\\text{ mol}$ $\\ce{Na2SeO4}$ ($15{,}12\\text{ g} \\approx 12{,}54\\%$) va ortib qolgan $11{,}04 - 0{,}16 \\cdot 40 = 4{,}64\\text{ g}$ $\\ce{NaOH}$ ($w_1 = 4{,}64/120{,}56 = 3{,}85\\%$) mavjud. Bug'latilgandan keyin $w_2 = 2{,}5 w_1$ bo'lishi uchun eritma massasi $2{,}5$ marta kamayishi kerak: $m_2 = 120{,}56 / 2{,}5 = 48{,}224\\text{ g}$. Bug'latilgan suv: $120{,}56 - 48{,}224 = 72{,}34\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-37",
    turi: "ochiq",
    mavzu: "Eritmalarning atom massa nisbatlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "$9{,}8\\text{ g}$ $\\ce{NH4Br}$ va $5\\%$ $\\ce{CaBr2}$ saqlagan eritma tarkibida brom va kislorod atomlarining massa nisbati $0{,}9 : 7{,}9$ ga teng bo'lsa, eritmaning umumiy massasini ($\\text{g}$) aniqlang.",
    correct: "160",
    tolerance: 0.5,
    birlik: "g",
    explanation:
      "Eritma massasi $M\\text{ g}$ bo'lsin. $9{,}8\\text{ g}$ $\\ce{NH4Br}$ ($0{,}1\\text{ mol}$) da $8\\text{ g}$ $\\ce{Br}$ bor; $0{,}05M\\text{ g}$ $\\ce{CaBr2}$ da esa $0{,}04M\\text{ g}$ $\\ce{Br}$ bor. Suv massasi $M - 9{,}8 - 0{,}05M = 0{,}95M - 9{,}8$, undagi kislorod massasi $\\frac{16}{18}(0{,}95M - 9{,}8)$. Tenglama: $\\frac{8 + 0{,}04M}{\\frac{8}{9}(0{,}95M - 9{,}8)} = \\frac{0{,}9}{7{,}9} \\Rightarrow 63{,}2 + 0{,}316M = 0{,}76M - 7{,}84 \\Rightarrow 0{,}444M = 71{,}04 \\Rightarrow M = 160\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-2-38",
    turi: "ochiq",
    mavzu: "Kristallogidrat tarkibini aniqlash",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "$74{,}4\\text{ g}$ noma'lum metall tuzining kristallogidrati yopiq idishda qizdirilganda o'z kristall suvida erib, $12\\text{ mol/l}$ konsentratsiyali $25\\text{ ml}$ rangsiz eritma hosil qildi. $1\\text{ mol}$ kristallogidrat tarkibida $64\\text{ g}$ oltingugurt va $128\\text{ g}$ kislorod mavjud bo'lib, metall moli oltingugurt moliga teng bo'lsa, kristallogidratning molyar massasini ($\\text{g/mol}$) toping.",
    correct: "248",
    tolerance: 0.5,
    birlik: "g/mol",
    explanation:
      "Kristallogidrat moli: $n = 12 \\cdot 0{,}025 = 0{,}3\\text{ mol}$. Molyar massa: $M = 74{,}4 / 0{,}3 = 248\\text{ g/mol}$. $1\\text{ mol}$ da $64/32 = 2\\text{ mol}$ $\\ce{S}$, $2\\text{ mol}$ metall va $128/16 = 8\\text{ mol}$ $\\ce{O}$ bor. Qolgan massa $248 - 64 - 128 = 56\\text{ g}$ ($2\\text{ mol}$ metall $+\\, x\\text{ H}$): $\\ce{Na2S2O3 \\cdot 5H2O}$ da $2\\text{ Na}$ ($46\\text{ g}$) $+ 10\\text{ H}$ ($10\\text{ g}$) $= 56\\text{ g}$ va $3 + 5 = 8\\text{ O}$ mos keladi. Molyar massasi $248\\text{ g/mol}$.",
  },
  {
    id: "ms-2025-03-15-2-39",
    turi: "ochiq",
    mavzu: "Alkenlarni gidrogenlash va gibridlanish o'zgarishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$6\\text{ mol}$ propenning bir qismi gidrogenlanganda sistemadagi gibridlangan orbitallar soni $18{,}06 \\cdot 10^{23}$ taga ortdi. Gidrogenlanmay ortib qolgan propen to'liq yondirilganda necha mol $\\ce{CO2}$ hosil bo'ladi?",
    correct: "13.5",
    tolerance: 0.1,
    birlik: "mol",
    explanation:
      "Har $1\\text{ ta}$ propen ($\\ce{C3H6}$, $2\\,sp^2 + 1\\,sp^3 \\rightarrow 2\\cdot 3 + 4 = 10$ gibrid orbital) propanga ($3\\,sp^3 \\rightarrow 12$ gibrid orbital) aylanganda gibrid orbitallar soni $2$ taga ortadi. $18{,}06 \\cdot 10^{23} / 6{,}02 \\cdot 10^{23} = 3\\text{ mol}$ ortish $3 / 2 = 1{,}5\\text{ mol}$ propen gidrogenlanganini bildiradi. Ortgan $6 - 1{,}5 = 4{,}5\\text{ mol}$ propen yonganda $4{,}5 \\cdot 3 = 13{,}5\\text{ mol}$ $\\ce{CO2}$ chiqadi.",
  },
  {
    id: "ms-2025-03-15-2-40",
    turi: "ochiq",
    mavzu: "Spirtlar degidratatsiyasi va alkenlarni oksidlash",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$15{,}9\\text{ g}$ ikkita bir atomli to'yingan spirtlar aralashmasi $\\ce{H2SO4}$ ishtirokida $180\\,^\\circ\\text{C}$ da qizdirilganda $0{,}3\\text{ mol}$ gazsimon alkenlar hosil bo'ldi. Alkenlar $\\ce{KMnO4}$ ning suvli eritmasidan o'tkazilganda olingan ikki atomli spirtlardan (diollardan) birining shu sinfga oid $6$ ta tuzilish izomeri (vitsinal va barqaror diollar hisobida) mavjud. Aralashmadagi molyar massasi katta bo'lgan spirtning massasini ($\\text{g}$) aniqlang.",
    correct: "5.55",
    tolerance: 0.05,
    birlik: "g",
    explanation:
      "$0{,}3\\text{ mol}$ gazsimon alken hosil bo'lgani uchun gazsimon alkenlar $\\ce{C2H4}$, $\\ce{C3H6}$ yoki $\\ce{C4H8}$ bo'lishi mumkin. Spirtlarning o'rtacha molyar massasi $15{,}9 / 0{,}3 = 53\\text{ g/mol}$ (demak, biri $\\ce{C2H5OH}$, $M=46$, ikkinchisi katta). $\\ce{C4H8}$ dan Vagner reaksiyasida olinadigan butandiollar ($\\ce{C4H10O2}$) ning $6$ ta barqaror izomeri mavjud ($1,2$-, $1,3$-, $1,4$-, $2,3$-butandiol hamda $2$-metilpropan-$1,2$- va $1,3$-diol). Demak ikkinchi spirt — butanol ($M=74$). $46(0{,}3 - y) + 74y = 15{,}9 \\Rightarrow 28y = 2{,}1 \\Rightarrow y = 0{,}075\\text{ mol}$. Massasi: $0{,}075 \\cdot 74 = 5{,}55\\text{ g}$.",
  },
]

export default savollar
