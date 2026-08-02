// data/reactions/termik-parchalanish.js
//
// Qizdirilganda parchalanadigan moddalar.
// Bu reaksiyalarning "sharoit" maydoni eng muhim qismi — harorat aytilmasa
// tenglama ma'nosini yo'qotadi.

module.exports = {
  kategoriya: 'Termik parchalanish',

  umumiy: {
    reactionType: 'termik parchalanish',
    scale: 'laboratoriya',
    techniques: ['Qizdirish'],
    equipment: ['Probirka', 'Spirtovka', 'Tigel qisqichi'],
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'Cu(OH)₂ → CuO + H₂O',
      name: 'Mis (II) gidroksidning parchalanishi',
      description:
        'Eng beqaror gidroksidlardan biri — qaynoq suvda ham parchalana boshlaydi. ' +
        'Rang o\'zgarishi juda aniq ko\'rinadi.',
      temperature: '80–100 °C',
      observations: 'Och ko\'k cho\'kma qora kukunga aylanadi.',
    },
    {
      equation: '2Fe(OH)₃ → Fe₂O₃ + 3H₂O',
      name: 'Temir (III) gidroksidning parchalanishi',
      description: 'Zang rangidagi cho\'kma qizdirilganda qizil temir oksidiga aylanadi.',
      temperature: '500–600 °C',
      observations: 'Jigarrang cho\'kma qizg\'ish-qo\'ng\'ir kukunga aylanadi.',
    },
    {
      equation: 'Mg(OH)₂ → MgO + H₂O',
      name: 'Magniy gidroksidning parchalanishi',
      description: 'Hosil bo\'lgan magniy oksidi o\'tga chidamli material sifatida ishlatiladi.',
      observations:
        'Oq kukun oq kukunligicha qoladi — rangi o\'zgarmaydi. Probirkaning sovuq ' +
        'devorida suv tomchilari paydo bo\'ladi, bu parchalanish borayotganining ' +
        'yagona ko\'rinadigan belgisi. Massa yengillashadi.',
      temperature: '350–400 °C',
      scale: 'ikkalasi',
      scaleNote: 'Sanoatda o\'tga chidamli g\'isht ishlab chiqarishda.',
    },
    {
      equation: '2Al(OH)₃ → Al₂O₃ + 3H₂O',
      name: 'Alyuminiy gidroksidning parchalanishi',
      description:
        'Alyuminiy ishlab chiqarishning tayyorgarlik bosqichi — boksitdan olingan ' +
        'gidroksid oksidga aylantiriladi.',
      temperature: '1000–1200 °C',
      scale: 'sanoat',
      scaleNote: 'Bayer usulida glinozem (Al₂O₃) olish bosqichi.',
    },
    {
      equation: '2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑',
      name: 'Kaliy permanganatning parchalanishi',
      description:
        'Laboratoriyada kislorod olishning ikkinchi mashhur usuli. Marganes bir ' +
        'vaqtda ham qaytariladi, ham oksidlanadi.',
      reactionType: 'termik disproporsiyalanish',
      temperature: '200–240 °C',
      observations:
        'Binafsha kristallar qora massaga aylanadi. Cho\'g\'langan cho\'p alangalanadi.',
      techniques: ['Qizdirish', 'Suv ustida gaz to\'plash'],
    },
    {
      equation: 'NH₄Cl → NH₃↑ + HCl↑',
      name: 'Ammoniy xloridning sublimatsiyasi',
      description:
        'Qizdirilganda ikki gazga ajraydi, sovuq joyda ular yana birikadi. ' +
        'Shuning uchun modda "uchgandek" ko\'rinadi va boshqa joyda qayta paydo bo\'ladi.',
      temperature: '338 °C',
      observations:
        'Probirka pastida kukun yo\'qoladi, sovuq yuqori qismida oq g\'ubor paydo bo\'ladi.',
      techniques: ['Sublimatsiya'],
    },
    {
      equation: '(NH₄)₂Cr₂O₇ → N₂↑ + Cr₂O₃ + 4H₂O',
      name: 'Ammoniy dixromatning parchalanishi ("vulqon")',
      description:
        'Bir marta yoqilsa o\'zi davom etadigan reaksiya. To\'q sariq kristallardan ' +
        'yashil kukun otilib chiqadi — vulqonga o\'xshaydi.',
      temperature: '180 °C dan boshlanadi, keyin o\'zi davom etadi',
      observations:
        'Uchqunlar sochiladi, hajmi bir necha barobar ortgan yashil kukun to\'planadi.',
      equipment: ['Chinni kosacha', 'Qum to\'shak', 'Mo\'rili shkaf'],
    },
    {
      equation: '2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑',
      name: 'Qo\'rg\'oshin nitratning parchalanishi',
      description:
        'O\'rtacha faollikdagi metall nitratlari oksid, NO₂ va kislorod beradi. ' +
        'Parchalanishda quruq tuz "shitirlaydi".',
      temperature: '470 °C',
      observations: 'Jigarrang gaz ajraladi, oq tuz sariq oksidga aylanadi.',
      equipment: ['Probirka', 'Mo\'rili shkaf'],
    },
    {
      equation: '2AgNO₃ → 2Ag + 2NO₂↑ + O₂↑',
      name: 'Kumush nitratning parchalanishi',
      description:
        'Faolligi past metall nitrati parchalanganda oksid emas, sof metall qoladi — ' +
        'faollik qatorining nitratlar parchalanishidagi aksi.',
      temperature: '440 °C',
      observations: 'Jigarrang gaz va yaltiroq kumush qoldig\'i.',
    },
    {
      equation: '2NaNO₃ → 2NaNO₂ + O₂↑',
      name: 'Natriy nitratning parchalanishi',
      description:
        'Faol metall nitrati faqat kislorodini yo\'qotadi va nitritga aylanadi — ' +
        'oksid hosil bo\'lmaydi.',
      temperature: '380 °C',
      observations: 'Tuz suyuqlanadi, gaz ajraladi, cho\'g\' alangalanadi.',
    },
    {
      equation: 'NH₄NO₃ → N₂O↑ + 2H₂O',
      name: 'Ammoniy nitratning parchalanishi',
      description:
        'Hosil bo\'lgan gaz — "kuldiruvchi gaz". Yuqori haroratda esa bu tuz ' +
        'portlaydi, shuning uchun uni qizdirish xavfli.',
      temperature: '190–245 °C (yuqorida portlash xavfi)',
      observations: 'Tuz suyuqlanib, gaz ajraladi.',
      equipment: ['Mo\'rili shkaf', 'Himoya ekrani'],
    },
    {
      equation: 'NH₄HCO₃ → NH₃↑ + H₂O + CO₂↑',
      name: 'Ammoniy gidrokarbonatning parchalanishi',
      description:
        'Qandolatchilikda ishlatiladigan "ammoniy" xamirturushi. Qizdirilganda ' +
        'butunlay gazga aylanadi — hech qanday qoldiq bermaydi.',
      temperature: '60 °C dan boshlab',
      observations: 'Kukun butunlay yo\'qoladi, o\'tkir ammiak hidi keladi.',
      scale: 'ikkalasi',
      scaleNote: 'Non va pechenye ishlab chiqarishda ko\'pchituvchi sifatida.',
    },
    {
      equation: 'MgCO₃ → MgO + CO₂↑',
      name: 'Magniy karbonatning parchalanishi',
      description: 'Karbonatlarning parchalanish harorati metall faolligiga bog\'liq.',
      temperature: '350–400 °C',
      observations: 'Ohakli suv loyqalanadi — CO₂ ajralgani.',
    },
    {
      equation: 'CuSO₄·5H₂O → CuSO₄ + 5H₂O',
      name: 'Mis kuporosining suvsizlanishi',
      description:
        'Kristallogidratdagi suv kimyoviy bog\'langan. Uni haydab yuborilsa modda ' +
        'ko\'k rangini butunlay yo\'qotadi — suv qaytarilsa rang qaytadi.',
      reactionType: 'suvsizlanish',
      temperature: '110–250 °C (bosqichma-bosqich)',
      observations:
        'Yorqin ko\'k kristallar oq kukunga aylanadi. Suv tomizilsa yana ko\'karadi.',
      techniques: ['Quritish', 'Qaytar tajriba'],
      scaleNote: 'Suvsiz CuSO₄ suvni aniqlash uchun indikator sifatida ishlatiladi.',
    },
    {
      equation: 'CaSO₄·2H₂O → CaSO₄ + 2H₂O',
      name: 'Gipsning kuydirilishi',
      description:
        'Qurilish gipsi shu jarayonda olinadi. Suv qaytarib qo\'shilganda massa ' +
        'yana qotadi — shuning uchun gips qoliplarda ishlatiladi.',
      reactionType: 'suvsizlanish',
      temperature: '150–180 °C',
      scale: 'sanoat',
      scaleNote: 'Amalda yarim gidrat (CaSO₄·0.5H₂O) olinadi — alebastr.',
    },
    {
      equation: '4HNO₃ → 4NO₂↑ + O₂↑ + 2H₂O',
      name: 'Nitrat kislotaning yorug\'likda parchalanishi',
      description:
        'Konsentrlangan nitrat kislota vaqt o\'tishi bilan sarg\'ayadi — ichida ' +
        'erigan NO₂ tufayli. Shuning uchun qorong\'i shishada saqlanadi.',
      temperature: 'yorug\'lik yoki qizdirish ta\'sirida',
      observations: 'Kislota sariq tusga kiradi, ustida jigarrang bug\' paydo bo\'ladi.',
      rateFactors: [
        { factor: 'Yorug\'lik', effect: 'Parchalanishni tezlashtiradi' },
        { factor: 'Harorat', effect: 'Isitilganda tez parchalanadi' },
      ],
    },
  ],
}
