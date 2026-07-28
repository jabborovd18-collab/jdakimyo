// data/reactions/metall-kislota.js
//
// Metallarning kislota, suv va tuz eritmalari bilan reaksiyalari.
// Metallar faollik qatorining amaldagi ko'rinishi.

module.exports = {
  kategoriya: 'Metall reaksiyalari',

  umumiy: {
    environment: 'suvli eritma',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    bestSolvent: 'Suv',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
      name: 'Ruxning xlorid kislotada erishi',
      description:
        'Vodoroddan chapda turgan metall kislotadan vodorodni siqib chiqaradi. ' +
        'Laboratoriyada vodorod olishning eng qulay usuli.',
      reactionType: 'o\'rin olish',
      mechanism:
        'Rux elektron beradi (Zn⁰ → Zn²⁺ + 2e⁻), kislotaning vodorod ioni ' +
        'elektronni oladi (2H⁺ + 2e⁻ → H₂). Ya\'ni bu oddiy almashinish emas, redoks.',
      rateFactors: [
        { factor: 'Metall maydalanishi', effect: 'Kukun holida sirt katta — reaksiya bir necha barobar tez' },
        { factor: 'Kislota konsentratsiyasi', effect: 'Quyuqroq eritmada tezroq' },
        { factor: 'Harorat', effect: '10 °C ortishi tezlikni ~2 barobar oshiradi' },
        { factor: 'Mis tuzi qo\'shish', effect: 'Galvanik juft hosil bo\'lib, ajralish tezlashadi' },
      ],
      observations: 'Metall sirtida gaz pufakchalari, aralashma isiydi, rux asta eriydi.',
      techniques: ['Gaz to\'plash', 'Kipp apparatida olish'],
      equipment: ['Kipp apparati', 'Probirka', 'Gaz o\'tkazuvchi naycha'],
      yieldInfo: 'Deyarli to\'liq — metall butunlay eriydi',
    },
    {
      equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
      name: 'Magniyning kislotada erishi',
      description:
        'Magniy ruxdan faolroq — reaksiya sezilarli tezroq va issiqroq boradi. ' +
        'Faollik qatorini solishtirishga qulay tajriba.',
      reactionType: 'o\'rin olish',
      observations: 'Shiddatli gaz ajraladi, probirka qiziydi, metall tez yo\'qoladi.',
    },
    {
      equation: 'Fe + 2HCl → FeCl₂ + H₂↑',
      name: 'Temirning xlorid kislotada erishi',
      description:
        'Temir Fe²⁺ holatiga o\'tadi, Fe³⁺ ga emas — vodorod ioni uni bundan ' +
        'ortiq oksidlay olmaydi.',
      reactionType: 'o\'rin olish',
      observations: 'Och yashil eritma hosil bo\'ladi, gaz sekin ajraladi.',
    },
    {
      equation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
      name: 'Alyuminiyning kislotada erishi',
      description:
        'Alyuminiy juda faol metall, lekin sirtidagi oksid pardasi uni himoya qiladi. ' +
        'Kislota pardani yemirgach reaksiya jadallashadi.',
      reactionType: 'o\'rin olish',
      observations:
        'Boshida sekin (oksid pardasi), keyin tez. Ko\'p issiqlik ajraladi.',
      rateFactors: [
        { factor: 'Oksid pardasini yo\'qotish', effect: 'Sirt tozalangach reaksiya keskin tezlashadi' },
      ],
    },
    {
      equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
      name: 'Rux va suyultirilgan sulfat kislota',
      description:
        'Suyultirilgan sulfat kislotada oksidlovchi — vodorod ioni, shuning uchun ' +
        'vodorod ajraladi. Konsentrlangani bilan reaksiya butunlay boshqacha.',
      reactionType: 'o\'rin olish',
      environment: 'suyultirilgan kislota',
      observations: 'Rangsiz gaz ajraladi.',
    },
    {
      equation: 'Cu + 2H₂SO₄ → CuSO₄ + SO₂↑ + 2H₂O',
      name: 'Mis va konsentrlangan sulfat kislota',
      description:
        'Mis vodoroddan o\'ngda — suyultirilgan kislotada erimaydi. Lekin ' +
        'konsentrlangan kislotada oksidlovchi vazifasini S⁺⁶ bajaradi va mis eriydi.',
      reactionType: 'oksidlanish-qaytarilish',
      environment: 'konsentrlangan kislota',
      temperature: 'qizdirilganda (60–100 °C)',
      observations:
        'O\'tkir hidli gaz (SO₂), eritma ko\'karadi — Cu²⁺ hosil bo\'ladi.',
      techniques: ['So\'rgichli shkafda ishlash'],
      equipment: ['Mo\'rili shkaf', 'Qizdirish uchun spirtovka'],
    },
    {
      equation: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
      name: 'Mis va suyultirilgan nitrat kislota',
      description:
        'Suyultirilgan nitrat kislotada azot +2 gacha qaytariladi. Ajralgan rangsiz ' +
        'NO havoda darhol jigarrang NO₂ ga aylanadi.',
      reactionType: 'oksidlanish-qaytarilish',
      environment: 'suyultirilgan kislota',
      observations:
        'Eritma ko\'k tusga kiradi. Probirka og\'zida rangsiz gaz jigarrangga aylanadi.',
      techniques: ['So\'rgichli shkafda ishlash'],
      equipment: ['Mo\'rili shkaf'],
    },
    {
      equation: 'Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O',
      name: 'Mis va konsentrlangan nitrat kislota',
      description:
        'Konsentrlangan kislotada azot faqat +4 gacha qaytariladi. Bir xil ' +
        'reagentlar, lekin konsentratsiya mahsulotni o\'zgartiradi.',
      reactionType: 'oksidlanish-qaytarilish',
      environment: 'konsentrlangan kislota',
      observations: 'Quyuq jigarrang gaz shiddat bilan ajraladi, eritma ko\'k-yashil.',
      techniques: ['So\'rgichli shkafda ishlash'],
      equipment: ['Mo\'rili shkaf'],
    },
    {
      equation: '2Na + 2H₂O → 2NaOH + H₂↑',
      name: 'Natriyning suv bilan reaksiyasi',
      description:
        'Ishqoriy metall suvni ham parchalaydi. Ajralgan vodorod issiqlikdan ' +
        'o\'z-o\'zidan alangalanishi mumkin.',
      reactionType: 'o\'rin olish',
      observations:
        'Metall sharcha suv yuzida yuguradi, shitirlaydi, ba\'zan sariq alanga bilan yonadi. ' +
        'Fenolftalein qo\'shilsa eritma pushti — ishqor hosil bo\'lgani.',
      techniques: ['Himoya ekrani orqasida ishlash'],
      equipment: ['Kristallizator', 'Pinset', 'Himoya ekrani'],
      rateFactors: [
        { factor: 'Metall bo\'lagining kattaligi', effect: 'Katta bo\'lak portlash darajasida shiddatli reaksiya beradi' },
      ],
    },
    {
      equation: '2K + 2H₂O → 2KOH + H₂↑',
      name: 'Kaliyning suv bilan reaksiyasi',
      description:
        'Kaliy natriydan ham faolroq — vodorod deyarli har doim binafsha alanga ' +
        'bilan yonadi.',
      reactionType: 'o\'rin olish',
      observations: 'Binafsha alanga, shiddatli shitirlash.',
    },
    {
      equation: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
      name: 'Kalsiyning suv bilan reaksiyasi',
      description:
        'Ishqoriy-yer metalli sekinroq, lekin barqaror reaksiyaga kirishadi. ' +
        'Hosil bo\'lgan Ca(OH)₂ kam eriydi va eritmani loyqalantiradi.',
      reactionType: 'o\'rin olish',
      observations: 'Metall yuzasidan gaz pufakchalari, suv oqarib loyqalanadi.',
    },
    {
      equation: '3Fe + 4H₂O → Fe₃O₄ + 4H₂↑',
      name: 'Qizigan temir ustidan suv bug\'i o\'tkazish',
      description:
        'Oddiy haroratda temir suv bilan reaksiyaga kirishmaydi, lekin qizdirilganda ' +
        'temir okalinasi hosil bo\'ladi. Vodorod olishning eski sanoat usuli.',
      reactionType: 'o\'rin olish',
      temperature: '600–700 °C',
      environment: 'suv bug\'i',
      scale: 'nazariy',
      observations: 'Temir qorayadi — Fe₃O₄ qatlami hosil bo\'ladi.',
      equipment: ['Kvars naycha', 'Pech'],
    },
    {
      equation: 'Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂↑',
      name: 'Ruxning ishqorda erishi',
      description:
        'Rux amfoter metall — kislotada ham, ishqorda ham eriydi. Ishqorda ' +
        'gidroksokompleks hosil bo\'ladi.',
      reactionType: 'amfoterlik',
      environment: 'konsentrlangan ishqor',
      temperature: 'qizdirilganda',
      observations: 'Gaz ajraladi, metall eriydi.',
    },
    {
      equation: '2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑',
      name: 'Alyuminiyning ishqorda erishi',
      description:
        'Alyuminiy ham amfoter. Shu sababli alyuminiy idishda ishqor saqlab ' +
        'bo\'lmaydi — idish yemiriladi.',
      reactionType: 'amfoterlik',
      environment: 'ishqor eritmasi',
      observations: 'Shiddatli gaz ajraladi, metall yemiriladi.',
      scaleNote: 'Amalda: quvur tozalash vositalari shu reaksiyaga asoslangan.',
    },
    {
      equation: 'Fe + CuSO₄ → FeSO₄ + Cu↓',
      name: 'Temirning misni tuzidan siqib chiqarishi',
      description:
        'Faolroq metall kamroq faolini tuz eritmasidan siqib chiqaradi. ' +
        'Faollik qatorini ko\'rsatuvchi eng ko\'rgazmali tajriba.',
      reactionType: 'o\'rin olish',
      observations:
        'Temir mixda qizg\'ish mis qatlami paydo bo\'ladi, ko\'k eritma och yashil tusga o\'tadi.',
      techniques: ['Metall plastinkani eritmaga botirish'],
      equipment: ['Stakan', 'Temir mix yoki plastinka'],
    },
    {
      equation: 'Zn + CuSO₄ → ZnSO₄ + Cu↓',
      name: 'Rux va mis kuporosi',
      description:
        'Daniell galvanik elementining asosidagi reaksiya. To\'g\'ridan-to\'g\'ri ' +
        'o\'tkazilsa issiqlik, ajratib o\'tkazilsa elektr toki beradi.',
      reactionType: 'o\'rin olish',
      observations: 'Rux plastinkasida qizil-jigarrang mis, eritma rangsizlanadi.',
      scaleNote: 'Galvanik element (batareyka) ishlash tamoyili shu.',
    },
    {
      equation: 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓',
      name: 'Misning kumushni siqib chiqarishi ("kumush daraxt")',
      description:
        'Mis kumushdan faolroq. Kumush ignasimon kristallar shaklida o\'sib chiqadi — ' +
        'shuning uchun "kumush daraxt" deyiladi.',
      reactionType: 'o\'rin olish',
      observations:
        'Mis simda yaltiroq kumush kristallari o\'sadi, eritma asta ko\'karadi.',
      techniques: ['Kristall o\'stirish'],
      equipment: ['Stakan', 'Mis sim'],
    },
    {
      equation: 'Mg + 2H₂O → Mg(OH)₂ + H₂↑',
      name: 'Magniy va qaynoq suv',
      description:
        'Sovuq suvda magniy deyarli reaksiyaga kirishmaydi, qaynoq suvda esa ' +
        'sekin vodorod ajratadi.',
      reactionType: 'o\'rin olish',
      temperature: 'qaynoq suv (100 °C)',
      observations: 'Sekin gaz pufakchalari, oq cho\'kma.',
    },
    {
      equation: '2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑',
      name: 'Alyuminiy va suyultirilgan sulfat kislota',
      description: 'Alyuminiy sulfat olinishi — suv tozalashda koagulyant sifatida ishlatiladi.',
      reactionType: 'o\'rin olish',
      environment: 'suyultirilgan kislota',
      scale: 'ikkalasi',
      scaleNote: 'Sanoatda suv tozalash uchun alyuminiy sulfat ishlab chiqariladi.',
    },
    {
      equation: 'Fe + H₂SO₄ → FeSO₄ + H₂↑',
      name: 'Temir kuporosi olinishi',
      description:
        'Temir (II) sulfat — o\'g\'it, suv tozalash reagenti va temir tanqisligiga ' +
        'qarshi dori tarkibidagi tuz.',
      reactionType: 'o\'rin olish',
      environment: 'suyultirilgan kislota',
      scale: 'ikkalasi',
      observations: 'Och yashil eritma, gaz ajraladi.',
    },
  ],
}
