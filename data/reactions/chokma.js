// data/reactions/chokma.js
//
// Almashinish reaksiyalari va cho'kma hosil bo'lishi.
//
// Bu oilaning ma'nosi bitta qoidada: reaksiya oxirigacha borishi uchun
// mahsulotlardan biri eritmadan chiqib ketishi kerak — cho'kma, gaz yoki
// kam dissotsilanuvchi modda (suv) ko'rinishida.

module.exports = {
  kategoriya: 'Cho\'ktirish',

  umumiy: {
    reactionType: 'almashinish',
    environment: 'suvli eritma',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    bestSolvent: 'Suv',
    solventEffect:
      'Reaksiya ionlar orasida boradi. Suvda ikkala tuz ham dissotsilanadi, ' +
      'ionlar erkin uchrashadi va erimaydigan juftlik darhol cho\'kadi.',
    techniques: ['Cho\'ktirish', 'Filtrlash'],
    equipment: ['Probirka', 'Voronka', 'Filtr qog\'ozi'],
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
      name: 'Kumush xlorid cho\'kmasi',
      description:
        'Xlorid ionini aniqlashning asosiy usuli. Cho\'kma yorug\'likda qorayadi — ' +
        'shu xossa fotografiyaning asosi bo\'lgan.',
      reactionType: 'cho\'ktirish',
      observations:
        'Oq, tvorogsimon cho\'kma. Yorug\'likda binafsha-kulrangga o\'tadi. ' +
        'Ammiakda eriydi — bu uni AgBr va AgI dan farqlaydi.',
      rateFactors: [
        { factor: 'Konsentratsiya', effect: 'Quyuq eritmada cho\'kma darhol tushadi' },
      ],
      scaleNote: 'Analitik kimyoda argentometriya (Mor usuli) shu reaksiyaga asoslangan.',
    },
    {
      equation: 'AgNO₃ + KBr → AgBr↓ + KNO₃',
      name: 'Kumush bromid cho\'kmasi',
      description:
        'Fotoplyonkaning yorug\'likka sezgir qatlami aynan kumush bromiddan iborat edi.',
      reactionType: 'cho\'ktirish',
      observations: 'Och sariq cho\'kma. Ammiakda qiyin eriydi.',
    },
    {
      equation: 'AgNO₃ + KI → AgI↓ + KNO₃',
      name: 'Kumush yodid cho\'kmasi',
      description:
        'Uch kumush galogenidi ichida eng kam eriydigani. Rangi bo\'yicha ' +
        'galogenlarni ajratish mumkin.',
      reactionType: 'cho\'ktirish',
      observations: 'Sariq cho\'kma. Ammiakda erimaydi.',
    },
    {
      equation: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl',
      name: 'Sulfat ionini aniqlash',
      description:
        'Bariy sulfat suvda ham, kislotada ham erimaydi — shuning uchun sulfat ' +
        'ionini aniqlashda ishonchli.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Oq, mayin cho\'kma. Kislota qo\'shilsa ham erimaydi.',
      scaleNote: 'Tibbiyotda bariy sulfat rentgen kontrast moddasi sifatida ishlatiladi.',
    },
    {
      equation: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
      name: 'Bariy sulfat olinishi',
      description: 'Ikki eriydigan tuzdan bittasi erimaydigan mahsulot beradi.',
      reactionType: 'cho\'ktirish',
      observations: 'Zich oq cho\'kma tez tushadi.',
    },
    {
      equation: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',
      name: 'Qo\'rg\'oshin yodid — "oltin yomg\'ir"',
      description:
        'Eng ko\'rkam maktab tajribalaridan biri. Cho\'kma qizdirilganda eriydi, ' +
        'sovuganda oltin rangli plastinkalar bo\'lib qayta cho\'kadi.',
      reactionType: 'cho\'ktirish',
      observations:
        'Yorqin sariq cho\'kma. Qizdirib sovutilganda yaltiroq oltinrang kristallar tushadi.',
      techniques: ['Qayta kristallash'],
      rateFactors: [
        { factor: 'Harorat', effect: 'Isitilganda eruvchanlik ortadi, sovuganda kristall tushadi' },
      ],
    },
    {
      equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
      name: 'Mis (II) gidroksid cho\'kmasi',
      description:
        'Cu²⁺ ionini aniqlash. Hosil bo\'lgan ko\'k cho\'kma qizdirilganda qora ' +
        'CuO ga aylanadi.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Och ko\'k jelesimon cho\'kma. Qizdirilsa qorayadi.',
    },
    {
      equation: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
      name: 'Temir (III) gidroksid cho\'kmasi',
      description:
        'Fe³⁺ ionini aniqlash. Zang rangidagi cho\'kma temirning uch valentli ' +
        'ekanini bildiradi.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Qizil-jigarrang jelesimon cho\'kma.',
    },
    {
      equation: 'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',
      name: 'Temir (II) gidroksid cho\'kmasi',
      description:
        'Havoda turgan cho\'kma kislorod ta\'sirida Fe(OH)₃ ga oksidlanadi — ' +
        'rangi ko\'z oldida o\'zgaradi.',
      reactionType: 'sifat reaksiyasi',
      observations:
        'Avval oq-yashil cho\'kma, havoda tez jigarrangga o\'tadi (oksidlanish).',
    },
    {
      equation: 'AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',
      name: 'Alyuminiy gidroksid cho\'kmasi',
      description:
        'Ishqor tomchilab qo\'shilsa cho\'kma tushadi, ortiqcha qo\'shilsa qaytadan ' +
        'eriydi — amfoterlik alomati.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Oq jelesimon cho\'kma, ortiqcha ishqorda eriydi.',
    },
    {
      equation: 'MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl',
      name: 'Magniy gidroksid cho\'kmasi',
      description:
        'Al(OH)₃ dan farqli o\'laroq ortiqcha ishqorda erimaydi — ikkalasini ' +
        'shu bilan ajratish mumkin.',
      reactionType: 'cho\'ktirish',
      observations: 'Oq cho\'kma, ortiqcha ishqorda ham qoladi.',
    },
    {
      equation: 'ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄',
      name: 'Rux gidroksid cho\'kmasi',
      description: 'Amfoter gidroksid — ortiqcha ishqorda gidroksokompleks berib eriydi.',
      reactionType: 'cho\'ktirish',
      observations: 'Oq cho\'kma, ortiqcha ishqorda yo\'qoladi.',
    },
    {
      equation: 'Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄]',
      name: 'Rux gidroksidning ishqorda erishi',
      description: 'Amfoterlikning ikkinchi yarmi: gidroksid kislota vazifasini bajaradi.',
      reactionType: 'amfoterlik',
      observations: 'Cho\'kma tiniq eritmaga aylanadi.',
      techniques: ['Ortiqcha reagent qo\'shish'],
    },
    {
      equation: 'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',
      name: 'Kalsiy karbonat cho\'kmasi',
      description:
        'Suvning qattiqligini yo\'qotishning eng oddiy usuli — soda qo\'shish. ' +
        'Kalsiy ioni cho\'kmaga o\'tadi.',
      reactionType: 'cho\'ktirish',
      observations: 'Oq cho\'kma. Kislota qo\'shilsa gaz ajratib eriydi.',
      scaleNote: 'Suvni yumshatish (qattiqlikni yo\'qotish) sanoatda shu tamoyilda.',
    },
    {
      equation: 'Na₂S + CuSO₄ → CuS↓ + Na₂SO₄',
      name: 'Mis sulfid cho\'kmasi',
      description:
        'Og\'ir metall sulfidlari juda kam eriydi. Shu sababli sulfid ionlari ' +
        'og\'ir metallarni oqava suvdan tozalashda ishlatiladi.',
      reactionType: 'cho\'ktirish',
      observations: 'Qora cho\'kma, deyarli darhol tushadi.',
      scaleNote: 'Ekologiya: og\'ir metallardan oqavani tozalash.',
    },
    {
      equation: '3AgNO₃ + Na₃PO₄ → Ag₃PO₄↓ + 3NaNO₃',
      name: 'Kumush fosfat cho\'kmasi',
      description: 'Fosfat ionini aniqlash usullaridan biri.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Sariq cho\'kma. Nitrat kislotada eriydi.',
    },
    {
      equation: 'Pb(NO₃)₂ + Na₂SO₄ → PbSO₄↓ + 2NaNO₃',
      name: 'Qo\'rg\'oshin sulfat cho\'kmasi',
      description:
        'Qo\'rg\'oshin akkumulyatorining ishlashi shu birikma hosil bo\'lishi va ' +
        'qayta parchalanishiga asoslangan.',
      reactionType: 'cho\'ktirish',
      observations: 'Oq cho\'kma.',
    },
    {
      equation: 'BaCl₂ + K₂CrO₄ → BaCrO₄↓ + 2KCl',
      name: 'Bariy xromat cho\'kmasi',
      description: 'Sariq cho\'kma — bariy ionini aniqlashning yana bir yo\'li.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Yorqin sariq cho\'kma.',
    },
    {
      equation: '2AgNO₃ + K₂CrO₄ → Ag₂CrO₄↓ + 2KNO₃',
      name: 'Kumush xromat — Mor titrlashining indikatori',
      description:
        'Xlorid ionlari tugagandan keyingina qizg\'ish kumush xromat cho\'kadi. ' +
        'Shu rang o\'zgarishi titrlash tugaganini bildiradi.',
      reactionType: 'sifat reaksiyasi',
      observations: 'G\'ishtrang-qizil cho\'kma.',
      techniques: ['Argentometrik titrlash (Mor usuli)'],
      equipment: ['Byuretka', 'Konussimon kolba'],
      scale: 'laboratoriya',
    },
    {
      equation: 'Ba(NO₃)₂ + Na₂SO₄ → BaSO₄↓ + 2NaNO₃',
      name: 'Bariy nitratdan bariy sulfat',
      description: 'Sulfat ionini aniqlashning boshqa bir varianti.',
      reactionType: 'cho\'ktirish',
      observations: 'Oq mayin cho\'kma.',
    },
    {
      equation: 'Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O',
      name: 'Cho\'kmani kislotada eritish',
      description:
        'Gidroksid cho\'kmalari kislotada eriydi — chunki OH⁻ ionlari H⁺ bilan ' +
        'birikib suv hosil qiladi va muvozanat siljiydi.',
      reactionType: 'neytrallanish',
      observations: 'Ko\'k cho\'kma erib, yashil-ko\'k eritma hosil bo\'ladi.',
    },
    {
      equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
      name: 'Karbonat cho\'kmasining kislotada erishi',
      description:
        'Karbonat cho\'kmasini boshqa oq cho\'kmalardan ajratish usuli: faqat u ' +
        'kislotada gaz ajratib eriydi.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Cho\'kma "qaynab" eriydi, gaz pufakchalari chiqadi.',
    },
  ],
}
