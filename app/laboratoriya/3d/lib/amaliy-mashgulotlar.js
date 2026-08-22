// app/laboratoriya/3d/lib/amaliy-mashgulotlar.js
//
// 4-QADAM: Ssenariyli Amaliy Mashg'ulotlar (Universitet & DTM Dasturi).
// Har bir amaliy ishda aniq qadamlar, tekshiruv shartlari va rasmiy baholash tizimi.

export const AMALIY_MASHGULOTLAR = [
  {
    id: "mashgulot_1",
    raqam: 1,
    nomi: "Ishqoriy Metallarning Suv Bilan Reaksiyasi va Indikatorlar",
    fan: "Anorganik Kimyo",
    daraja: "Boshlang'ich",
    qiyinlik: "Oson",
    xp: 60,
    tanga: 20,
    maqsad: "Ishqoriy metallarning suv bilan shiddatli reaksiyasini va ishqor hosil bo'lishini fenolftalein orqali isbotlash.",
    reagentlar: ["H₂O", "NaOH", "HCl", "Fenolftalein"],
    jihozlar: ["probirka", "stakan", "tomizgich"],
    tenglama: "2 Na + 2 H₂O → 2 NaOH + H₂↑",
    qadamlar: [
      { id: 1, matn: "Probirkaga 15-20 ml distillangan suv (H₂O) quying", kalit: "H₂O", minMl: 10 },
      { id: 2, matn: "Suvga 2-3 tomchi fenolftalein indikatori tomizing", kalit: "indikator" },
      { id: 3, matn: "Ishqor (NaOH) qo'shib eritmaning malina-pushti rangga kirishini kuzating", kalit: "NaOH", minMl: 5 },
      { id: 4, matn: "Xlorid kislota (HCl) qo'shib neytrallang va rangning yo'qolishini tekshiring", kalit: "HCl", minMl: 5 },
    ],
    xulosa: "Kislota-asos indikatorlari yordamida muhitning neytrallanishi isbotlandi.",
  },
  {
    id: "mashgulot_2",
    raqam: 2,
    nomi: "Mis Kuporosidan Standart 0.1 M Eritma Tayyorlash",
    fan: "Analitik Kimyo",
    daraja: "O'rta",
    qiyinlik: "O'rta",
    xp: 80,
    tanga: 30,
    maqsad: "CuSO₄·5H₂O kristallogidratini analitik tarozida tortib, 100 ml o'lchov kolbasida aniq standart eritma tayyorlash.",
    reagentlar: ["CuSO₄*5H₂O", "H₂O"],
    jihozlar: ["kolba", "tarozi", "stakan"],
    tenglama: "CuSO₄·5H₂O + H₂O → CuSO₄ (aq)",
    qadamlar: [
      { id: 1, matn: "Analitik tarozida aniq 2.496 g (yoki 2.50 g) CuSO₄·5H₂O torting", kalit: "tarozi" },
      { id: 2, matn: "Qattiq moddani 100 ml o'lchov kolbasiga soling", kalit: "kolba" },
      { id: 3, matn: "Distillangan suv qo'shib menisk chizig'igacha to'ldiring (100 ml)", kalit: "H₂O", minMl: 90 },
      { id: 4, matn: "Bir jinsli ko'k rangli 0.100 M standart eritma hosil bo'lguncha aralashtiring", kalit: "aralashtirish" },
    ],
    xulosa: "Standart molyar konsentratsiyali mis kuporosi eritmasi tayyorlandi.",
  },
  {
    id: "mashgulot_3",
    raqam: 3,
    nomi: "Sirka Kislotani Ishqor Bilan Volumetrik Titrlash",
    fan: "Analitik Kimyo",
    daraja: "Oliy Ta'lim",
    qiyinlik: "Murakkab",
    xp: 100,
    tanga: 40,
    maqsad: "50 ml li byuretka yordamida noma'lum konsentratsiyali sirka kislotani 0.1 M NaOH bilan titrlash va ekvivalentlik nuqtasini topish.",
    reagentlar: ["CH₃COOH", "NaOH", "Fenolftalein"],
    jihozlar: ["byuretka", "konussimon-kolba"],
    tenglama: "CH₃COOH + NaOH → CH₃COONa + H₂O",
    qadamlar: [
      { id: 1, matn: "50 ml li byuretkaga 0.100 M NaOH standart eritmasini to'ldiring", kalit: "byuretka" },
      { id: 2, matn: "Konussimon kolbaga 20 ml sirka kislota va fenolftalein soling", kalit: "konussimon-kolba" },
      { id: 3, matn: "Jo'mrakni ochib, doimiy och pushti rang hosil bo'lguncha titrlang", kalit: "titrlash" },
      { id: 4, matn: "Sarflangan titrant hajmi bo'yicha kislota molyarligini hisoblang", kalit: "hisob" },
    ],
    xulosa: "Kuchsiz kislota ekvivalentlik nuqtasi pH 8.72 da aniq qayd etildi.",
  },
  {
    id: "mashgulot_4",
    raqam: 4,
    nomi: "Mis(II) Sulfat Eritmasi Elektrolizi va Faradey Qonuni",
    fan: "Fizik Kimyo",
    daraja: "Oliy Ta'lim",
    qiyinlik: "Murakkab",
    xp: 100,
    tanga: 40,
    maqsad: "Tok kuchi va vaqt ta'sirida katodda sof mis ajralishini Faradey tenglamasi orqali isbotlash.",
    reagentlar: ["CuSO₄", "H₂O"],
    jihozlar: ["elektrolizyor", "tok_manbai"],
    tenglama: "2 CuSO₄ + 2 H₂O ➔ 2 Cu↓ + O₂↑ + 2 H₂SO₄",
    qadamlar: [
      { id: 1, matn: "Elektroliz vannasiga 1.0 M CuSO₄ eritmasini quying", kalit: "CuSO₄" },
      { id: 2, matn: "Tok manbaini 2.5 A ga sozlab ulanishni yoqing", kalit: "tok" },
      { id: 3, matn: "Katodda qizil-zarxal mis qatlami qoplanishini kuzating", kalit: "katod" },
      { id: 4, matn: "Ajralgan mis massasini Faradey qonuni bo'yicha tekshiring", kalit: "faradey" },
    ],
    xulosa: "Faradey qonuniga ko'ra ajralgan metall massasi va elektr miqdori to'liq mos keldi.",
  },
  {
    id: "mashgulot_5",
    raqam: 5,
    nomi: "Amfoter Metall Gidroksidlarining Sintezi va Erishi",
    fan: "Anorganik Kimyo",
    daraja: "O'rta",
    qiyinlik: "O'rta",
    xp: 75,
    tanga: 25,
    maqsad: "Zn(OH)₂ oq cho'kmasini hosil qilish va uning ham kislotada, ham mo'l ishqorda erishini isbotlash.",
    reagentlar: ["ZnSO₄", "NaOH", "HCl"],
    jihozlar: ["probirka", "tomizgich"],
    tenglama: "ZnSO₄ + 2 NaOH → Zn(OH)₂↓ ➔ (ortiqcha NaOH) → Na₂[Zn(OH)₄]",
    qadamlar: [
      { id: 1, matn: "Probirkaga 10 ml ZnSO₄ eritmasidan quying", kalit: "ZnSO₄", minMl: 5 },
      { id: 2, matn: "Oq liqildoq Zn(OH)₂ cho'kmasi tushguncha tomchilatib NaOH qo'shing", kalit: "NaOH", minMl: 5 },
      { id: 3, matn: "Mo'l miqdorda NaOH qo'shib cho'kmaning kompleks hosil qilib erishini kuzating", kalit: "NaOH", minMl: 15 },
    ],
    xulosa: "Sink gidroksidning amfoter xossasi va gidroksokompleks hosil bo'lishi isbotlandi.",
  },
  {
    id: "mashgulot_6",
    raqam: 6,
    nomi: "Mis(II) Gidroksid Sintezi va Termik Parchalanishi",
    fan: "Anorganik Kimyo",
    daraja: "O'rta",
    qiyinlik: "O'rta",
    xp: 90,
    tanga: 35,
    maqsad:
      "CuSO₄ eritmasidan Cu(OH)₂ cho'kmasini olish, uni yuvib qizdirish va " +
      "CuO ga aylantirish. Reagentlar nisbati unumga qanday ta'sir qilishini " +
      "o'z ko'zingiz bilan ko'rish.",
    reagentlar: ["CuSO₄", "NaOH", "H₂O"],
    jihozlar: ["stakan", "shisha-tayoqcha", "spirtovka", "termometr"],
    tenglama: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄  ➔ (80–100 °C) CuO + H₂O",
    // STEXIOMETRIK NISBAT BU YERDA YOZILMAYDI.
    //
    // Birinchi qoralamada men uni `nisbat: [{CuSO₄:1},{NaOH:2}]` deb
    // qo'shgandim. Bu IKKINCHI MANBA bo'lardi: server allaqachon
    // `talabniHisobla(reaksiya, ...)` orqali nisbatni MUVOZANATLI
    // TENGLAMANING O'ZIDAN chiqaradi (`lib/tajriba.js`), keyin uni
    // `nisbatniBaho` ga beradi.
    //
    // Ya'ni koeffitsient o'zgarsa (yoki tenglama tuzatilsa) mening
    // nusxam eskirib qolardi va ikkalasi ajralib ketardi — AGENTS.md
    // 1-bandi.
    //
    // Mashg'ulotdan talab qilinadigan yagona narsa: `tenglama` bazadagi
    // haqiqiy tenglamaga mos bo'lsin.
    qadamlar: [
      {
        id: 1,
        matn: "Himoya ko'zoynagini taqing — NaOH korroziy modda",
        kalit: "kozoynak",
        kutilganNatija: "Ko'zoynak taqilgach xavfsizlik chizig'i yashil bo'ladi.",
      },
      {
        id: 2,
        matn: "Stakanga CuSO₄ eritmasidan 20 ml quying",
        kalit: "CuSO₄",
        minMl: 15,
        kutilganNatija: "Tiniq ko'k eritma.",
      },
      {
        id: 3,
        matn: "Tomchilatib NaOH qo'shing va cho'kma tushishini kuzating",
        kalit: "NaOH",
        minMl: 10,
        // Matn kimyo bazasidan: chokma.js -> observations.
        kutilganNatija: "Och ko'k jelesimon cho'kma.",
      },
      {
        id: 4,
        matn: "Shisha tayoqcha bilan sekin aralashtiring",
        kalit: "aralashtirish",
        kutilganNatija: "Cho'kma tekis taqsimlanadi, keyin tubiga o'tiradi.",
      },
      {
        id: 5,
        matn: "Cho'kma o'tirgach ustidagi suyuqlikni to'kib, cho'kmani yuving",
        kalit: "yuvish",
        kutilganNatija: "Yuvilmagan cho'kmada Na₂SO₄ qoladi va unum noto'g'ri chiqadi.",
      },
      {
        id: 6,
        matn: "Cho'kmani spirtovkada 80–100 °C gacha qizdiring",
        kalit: "isitish",
        // Harorat va kuzatuv termik-parchalanish.js dan.
        kutilganNatija: "Och ko'k cho'kma qora kukunga aylanadi.",
      },
      {
        id: 7,
        matn: "Planshetda nisbat, cheklovchi reagent va unumni tekshiring",
        kalit: "hisob",
        kutilganNatija: "Nisbat 1:2 dan uzoqlashsa unum tushadi.",
      },
    ],
    xulosa:
      "Cu(OH)₂ cho'kmasi olindi va qizdirilib CuO ga aylantirildi. " +
      "Nisbat qanchalik 1:2 ga yaqin bo'lsa, unum shuncha yuqori.",
  },
];
