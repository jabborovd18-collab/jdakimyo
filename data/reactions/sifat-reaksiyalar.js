// data/reactions/sifat-reaksiyalar.js
//
// Ionlarni aniqlash — sifat tahlili.
//
// Bu yerda ko'p tenglama QISQARTIRILGAN ION ko'rinishida yozilgan. Sababi:
// cho'kma qanday tuzdan olinganiga bog'liq emas — Ag⁺ va Cl⁻ uchrashsa
// har doim AgCl tushadi. Ion tenglama aynan shu mohiyatni ko'rsatadi.

module.exports = {
  kategoriya: 'Sifat reaksiyalari',

  umumiy: {
    reactionType: 'sifat reaksiyasi',
    environment: 'suvli eritma',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    techniques: ['Sifat tahlili'],
    equipment: ['Probirka', 'Tomizgich', 'Probirka shtativi'],
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'Ag⁺ + Cl⁻ → AgCl↓',
      name: 'Xlorid ionini aniqlash (ion tenglama)',
      description:
        'Qaysi tuzdan bo\'lishidan qat\'i nazar, kumush va xlorid ionlari uchrashsa ' +
        'oq cho\'kma tushadi. Qisqartirilgan ion tenglamaning ma\'nosi shunda.',
      observations: 'Oq tvorogsimon cho\'kma, yorug\'likda qorayadi.',
    },
    {
      equation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
      name: 'Sulfat ionini aniqlash (ion tenglama)',
      description:
        'Kislotada erimaydigan yagona keng tarqalgan oq cho\'kma — shuning uchun ' +
        'sulfat ionini aniqlash ishonchli.',
      observations: 'Oq mayin cho\'kma, HCl qo\'shilganda ham erimaydi.',
    },
    {
      equation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓',
      name: 'Karbonat ionini aniqlash (ion tenglama)',
      description:
        'Oq cho\'kma tushadi, lekin BaSO₄ dan farqli o\'laroq kislotada gaz ajratib ' +
        'eriydi — ikkalasini shu bilan ajratamiz.',
      observations: 'Oq cho\'kma, kislota qo\'shilsa "qaynab" eriydi.',
    },
    {
      equation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',
      name: 'Mis (II) ionini aniqlash (ion tenglama)',
      description: 'Och ko\'k cho\'kma — mis ionining eng oddiy belgisi.',
      observations: 'Och ko\'k jelesimon cho\'kma. Qizdirilsa qora CuO ga aylanadi.',
    },
    {
      equation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓',
      name: 'Temir (III) ionini aniqlash (ion tenglama)',
      description: 'Zang rangidagi cho\'kma temirning +3 holatini bildiradi.',
      observations: 'Qizil-jigarrang jelesimon cho\'kma.',
    },
    {
      equation: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓',
      name: 'Temir (II) ionini aniqlash (ion tenglama)',
      description:
        'Oq-yashil cho\'kma havoda tez jigarranglashadi — Fe²⁺ kislorod bilan ' +
        'Fe³⁺ ga oksidlanadi. Rang o\'zgarishining o\'zi ham tahlil ma\'lumoti.',
      observations: 'Oq-yashil cho\'kma, havoda 1–2 daqiqada jigarranglashadi.',
    },
    {
      equation: 'Fe³⁺ + 3SCN⁻ → Fe(SCN)₃',
      name: 'Temir (III) ga tiosianat sinovi (ion tenglama)',
      description:
        'Gidroksid cho\'kmasidan sezgirroq usul: juda kichik miqdorda ham qon-qizil ' +
        'rang beradi.',
      observations: 'Eritma darhol to\'q qizil tusga kiradi.',
    },
    {
      equation: 'Pb²⁺ + 2I⁻ → PbI₂↓',
      name: 'Qo\'rg\'oshin ionini aniqlash (ion tenglama)',
      description: 'Yorqin sariq cho\'kma. Qizdirib sovutilsa oltinrang kristallar beradi.',
      observations: 'Sariq cho\'kma.',
    },
    {
      equation: 'NH₄⁺ + OH⁻ → NH₃↑ + H₂O',
      name: 'Ammoniy ionini aniqlash (ion tenglama)',
      description:
        'Ishqor qo\'shib qizdirilganda ammiak ajraladi. Nam lakmus qog\'ozi ' +
        'ko\'karadi — bu tekshirishning eng oddiy usuli.',
      temperature: 'qizdirilganda',
      observations:
        'O\'tkir hid. Probirka og\'ziga tutilgan nam qizil lakmus ko\'karadi.',
      techniques: ['Gazni indikator qog\'ozi bilan aniqlash'],
    },
    {
      equation: 'CO₃²⁻ + 2H⁺ → H₂O + CO₂↑',
      name: 'Karbonat ionini kislota bilan aniqlash (ion tenglama)',
      description:
        'Ajralgan gaz ohakli suvni loyqalantiradi — ikki bosqichli tekshiruv ' +
        'natijani ishonchli qiladi.',
      observations: 'Gaz pufakchalari, ohakli suv oqaradi.',
      techniques: ['Gaz ajratish', 'Ohakli suv bilan tasdiqlash'],
    },
    {
      equation: 'SO₃²⁻ + 2H⁺ → SO₂↑ + H₂O',
      name: 'Sulfit ionini aniqlash (ion tenglama)',
      description:
        'Karbonatdan farqi — ajralgan gazning o\'tkir hidi bor va u kaliy ' +
        'permanganatni rangsizlantiradi.',
      observations: 'Kuygan gugurt hidi. Permanganat eritmasi rangsizlanadi.',
      equipment: ['Probirka', 'Mo\'rili shkaf'],
    },
    {
      equation: 'Na₂S + 2HCl → 2NaCl + H₂S↑',
      name: 'Sulfid ionini aniqlash',
      description:
        'Chirigan tuxum hidli zaharli gaz ajraladi. Qo\'rg\'oshin asetatiga ' +
        'shimdirilgan qog\'oz qorayadi — tasdiqlovchi sinov.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Chirigan tuxum hidi, qo\'rg\'oshinli qog\'oz qorayadi.',
      equipment: ['Mo\'rili shkaf', 'Probirka'],
    },
    {
      equation: 'Na₂SO₃ + 2HCl → 2NaCl + SO₂↑ + H₂O',
      name: 'Sulfitdan oltingugurt (IV) oksidi olish',
      description:
        'Laboratoriyada SO₂ olishning oddiy usuli va shu bilan birga sulfitni ' +
        'aniqlash reaksiyasi.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'O\'tkir hidli gaz, gullar rangsizlanadi.',
      equipment: ['Mo\'rili shkaf'],
    },
    {
      equation: '2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O',
      name: 'Laboratoriyada ammiak olish',
      description:
        'Quruq tuzlar aralashmasi qizdiriladi. Ammiak havodan yengil, shuning ' +
        'uchun probirka og\'zi pastga qaratib to\'planadi.',
      reactionType: 'almashinish',
      temperature: 'qizdirilganda',
      environment: 'quruq holda',
      observations: 'O\'tkir hidli gaz, nam lakmus ko\'karadi.',
      techniques: ['Quruq aralashmani qizdirish', 'Gazni og\'zi pastga qaratib to\'plash'],
      equipment: ['Probirka', 'Spirtovka', 'Gaz o\'tkazuvchi naycha'],
    },
  ],
}
