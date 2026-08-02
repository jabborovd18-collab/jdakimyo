// data/reactions/kislota-asos.js
//
// Neytrallanish va kislota–asos o'zaro ta'siri.
//
// Bu oila eng ko'p qidiriladigan qism: titrlash hisoblari, tuz hosil bo'lishi,
// ko'p asosli kislotalarning bosqichma-bosqich neytrallanishi.

module.exports = {
  kategoriya: 'Kislota-asos',

  umumiy: {
    reactionType: 'neytrallanish',
    environment: 'suvli eritma',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'ikkalasi',
    bestSolvent: 'Suv',
    solvents: [
      { name: 'Suv', efficiency: 'yuqori' },
      { name: 'Etanol', efficiency: 'past', note: 'ionlanish kamayadi' },
    ],
    solventEffect:
      'Reaksiya ionlar orasida boradi, shuning uchun ionlashtiruvchi qobiliyati ' +
      'yuqori erituvchi kerak. Suvda kislota ham, asos ham to\'liq dissotsilanadi.',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'HCl + NaOH → NaCl + H₂O',
      name: 'Xlorid kislotaning natriy gidroksid bilan neytrallanishi',
      description:
        'Kuchli kislota va kuchli asos o\'rtasidagi klassik neytrallanish. ' +
        'Hosil bo\'lgan tuz gidrolizga uchramaydi, shuning uchun eritma neytral (pH ≈ 7).',
      mechanism:
        'Aslida faqat ionlar birikadi: H⁺ + OH⁻ → H₂O. Na⁺ va Cl⁻ eritmada ' +
        'o\'zgarishsiz qoladi (kuzatuvchi ionlar).',
      rateFactors: [
        { factor: 'Aralashtirish', effect: 'Ionlar tez uchrashadi, reaksiya bir zumda tugaydi' },
        { factor: 'Konsentratsiya', effect: 'Quyuq eritmada issiqlik ko\'proq ajraladi' },
      ],
      techniques: ['Titrlash', 'Indikator qo\'shish'],
      equipment: ['Byuretka', 'Konussimon kolba', 'Pipetka', 'Shtativ'],
      observations:
        'Tashqi o\'zgarish ko\'rinmaydi — shuning uchun indikator kerak. Fenolftalein ' +
        'ishqoriy muhitda pushti, neytrallanish tugashi bilan rangsizlanadi. Eritma isiydi.',
      yieldInfo: 'Amalda 100% — qaytmas reaksiya',
      scaleNote:
        'Laboratoriyada ishqor konsentratsiyasini aniqlashda, sanoatda esa oqava ' +
        'suvlarni neytrallashda ishlatiladi.',
    },
    {
      equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
      name: 'Sulfat kislotaning to\'liq neytrallanishi',
      description:
        'Ikki asosli kislota ikki mol ishqor talab qiladi. Titrlashda koeffitsientni ' +
        'unutish eng ko\'p uchraydigan xato — natija ikki barobar farq qiladi.',
      mechanism: 'Ikki bosqichda: avval NaHSO₄, keyin Na₂SO₄ hosil bo\'ladi.',
      intermediates: [
        { formula: 'NaHSO₄', name: 'Natriy gidrosulfat', note: 'Birinchi bosqich mahsuloti, ishqor yetishmasa shu qoladi' },
      ],
      techniques: ['Titrlash'],
      equipment: ['Byuretka', 'Konussimon kolba', 'Pipetka'],
      observations: 'Kuchli issiqlik ajraladi. Rang o\'zgarmaydi, indikator kerak.',
    },
    {
      equation: 'H₂SO₄ + NaOH → NaHSO₄ + H₂O',
      name: 'Sulfat kislotaning qisman neytrallanishi',
      description:
        'Ishqor yetarli bo\'lmaganda nordon tuz — natriy gidrosulfat hosil bo\'ladi. ' +
        'Uning eritmasi kislotali (pH < 7).',
      reactionType: 'qisman neytrallanish',
      observations: 'Eritma nordon qoladi — lakmus qizaradi.',
    },
    {
      equation: 'HNO₃ + NaOH → NaNO₃ + H₂O',
      name: 'Nitrat kislotaning neytrallanishi',
      description:
        'Kuchli kislota va kuchli asos. Hosil bo\'lgan natriy nitrat — o\'g\'it va ' +
        'oksidlovchi sifatida ishlatiladigan tuz.',
      techniques: ['Titrlash', 'Bug\'latish'],
      equipment: ['Byuretka', 'Chinni kosacha'],
      observations: 'Eritma isiydi, bug\'latilganda rangsiz kristallar qoladi.',
    },
    {
      equation: 'H₃PO₄ + NaOH → NaH₂PO₄ + H₂O',
      name: 'Fosfat kislotaning birinchi bosqichda neytrallanishi',
      description:
        'Uch asosli kislotaning birinchi vodorodi ajraladi. Hosil bo\'lgan ' +
        'digidrofosfat eritmasi kislotali.',
      reactionType: 'qisman neytrallanish',
      observations: 'pH ≈ 4.5 — lakmus qizil.',
    },
    {
      equation: 'H₃PO₄ + 2NaOH → Na₂HPO₄ + 2H₂O',
      name: 'Fosfat kislotaning ikkinchi bosqichda neytrallanishi',
      description:
        'Ikkinchi vodorod ajraladi. Na₂HPO₄ eritmasi kuchsiz ishqoriy — bu tuz ' +
        'bufer aralashmalarda ishlatiladi.',
      reactionType: 'qisman neytrallanish',
      observations: 'pH ≈ 9 — fenolftalein och pushti.',
    },
    {
      equation: 'H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',
      name: 'Fosfat kislotaning to\'liq neytrallanishi',
      description:
        'Uchala vodorod ham almashadi. Natriy fosfat eritmasi kuchli ishqoriy ' +
        'muhitga ega (gidrolizlanadi).',
      mechanism:
        'Uch bosqichda ketma-ket boradi: H₃PO₄ → H₂PO₄⁻ → HPO₄²⁻ → PO₄³⁻. ' +
        'Har bosqichning o\'z dissotsilanish konstantasi bor.',
      intermediates: [
        { formula: 'NaH₂PO₄', name: 'Natriy digidrofosfat', note: 'Birinchi bosqich' },
        { formula: 'Na₂HPO₄', name: 'Natriy gidrofosfat', note: 'Ikkinchi bosqich' },
      ],
      observations: 'pH ≈ 12 — kuchli ishqoriy muhit.',
    },
    {
      equation: 'H₃PO₄ + 3KOH → K₃PO₄ + 3H₂O',
      name: 'Fosfat kislota va kaliy gidroksid',
      description:
        'Kaliy fosfat hosil bo\'ladi — kaliyli o\'g\'itlarning tarkibiy qismi.',
      observations:
        'Ikkala eritma ham rangsiz, cho\'kma tushmaydi — tashqaridan hech narsa ' +
        'ko\'rinmaydi. Idish sal isiydi. Uch bosqichli neytrallanish bo\'lgani uchun ' +
        'indikator rangi bir emas, uch marta o\'zgaradi.',
      scaleNote: 'Sanoatda murakkab o\'g\'it ishlab chiqarishda.',
    },
    {
      equation: '2H₃PO₄ + 3Ca(OH)₂ → Ca₃(PO₄)₂↓ + 6H₂O',
      name: 'Kalsiy fosfat hosil bo\'lishi',
      description:
        'Neytrallanish natijasida erimaydigan tuz cho\'kadi. Kalsiy fosfat — ' +
        'suyak va tishning asosiy minerali.',
      reactionType: 'neytrallanish va cho\'ktirish',
      observations: 'Oq, mayin cho\'kma tushadi.',
      techniques: ['Filtrlash', 'Cho\'ktirish'],
      equipment: ['Voronka', 'Filtr qog\'ozi', 'Stakan'],
    },
    {
      equation: '2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O',
      name: 'So\'ndirilgan ohakning kislota bilan neytrallanishi',
      description:
        'Ohakli suv bilan xlorid kislota reaksiyasi. Kalsiy xlorid suvda yaxshi ' +
        'eriydi, shuning uchun cho\'kma tushmaydi.',
      observations: 'Loyqa ohakli suv tiniqlashadi.',
    },
    {
      equation: 'HCl + KOH → KCl + H₂O',
      name: 'Kaliy gidroksidning neytrallanishi',
      description: 'Kuchli kislota va kuchli asos, mahsulot — oshxona tuziga o\'xshash kaliy xlorid.',
      observations:
        'Ko\'zga hech qanday o\'zgarish ko\'rinmaydi: rangsiz eritma rangsiz bo\'lib ' +
        'qoladi, gaz ham, cho\'kma ham chiqmaydi. Yagona belgi — issiqlik. ' +
        'Reaksiya bo\'lgan-bo\'lmaganini faqat indikator yoki termometr aytadi.',
    },
    {
      equation: 'H₂SO₄ + Ca(OH)₂ → CaSO₄↓ + 2H₂O',
      name: 'Gips hosil bo\'lishi',
      description:
        'Kalsiy sulfat suvda kam eriydi va cho\'kma beradi. Tabiatdagi gips shu ' +
        'birikmaning ikki suvli gidrati (CaSO₄·2H₂O).',
      reactionType: 'neytrallanish va cho\'ktirish',
      observations: 'Oq cho\'kma. Reaksiya sirtni qoplab, sekinlashib qoladi.',
      rateFactors: [
        {
          factor: 'Aralashtirish',
          effect: 'Cho\'kma sirtni qoplaydi — aralashtirmasa reaksiya to\'xtaydi',
        },
      ],
    },
    {
      equation: '2HNO₃ + Ba(OH)₂ → Ba(NO₃)₂ + 2H₂O',
      name: 'Bariy gidroksidning neytrallanishi',
      description: 'Ikki kislotali asos ikki mol kislota talab qiladi.',
      observations:
        'Bariy gidroksid eritmasi boshida biroz loyqa bo\'lishi mumkin (havodagi ' +
        'CO₂ dan hosil bo\'lgan BaCO₃), kislota qo\'shilgach u eriydi va eritma ' +
        'tiniqlashadi. Bariy nitrat suvda yaxshi eriydi, shuning uchun cho\'kma qolmaydi.',
    },
    {
      equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
      name: 'Sirka kislotaning neytrallanishi',
      description:
        'Kuchsiz kislota va kuchli asos. Hosil bo\'lgan tuz gidrolizlanadi va ' +
        'eritma ishqoriy bo\'lib qoladi (pH ≈ 8.9).',
      mechanism:
        'Sirka kislota suvda qisman dissotsilanadi. Ishqor H⁺ ni bog\'lagani sari ' +
        'muvozanat o\'ngga siljiydi va kislota to\'liq neytrallanadi.',
      observations:
        'Sirka hidi yo\'qoladi — kislota tuzga aylanadi. Neytrallanish nuqtasi ' +
        'pH 7 da emas, 8.9 da; shuning uchun fenolftalein ishlatiladi.',
      techniques: ['Titrlash', 'pH-metriya'],
      equipment: ['Byuretka', 'pH-metr'],
    },
    {
      equation: '2HCl + Mg(OH)₂ → MgCl₂ + 2H₂O',
      name: 'Magniy gidroksidning eritilishi',
      description:
        'Suvda deyarli erimaydigan Mg(OH)₂ kislotada eriydi. Shu sababli u ' +
        'oshqozon nordonligini kamaytiruvchi dori sifatida ishlatiladi.',
      observations: 'Oq cho\'kma asta-sekin erib, eritma tiniqlashadi.',
      scaleNote: 'Farmatsevtikada antatsid dorilar shu tamoyilda ishlaydi.',
    },
    {
      equation: '3HCl + Al(OH)₃ → AlCl₃ + 3H₂O',
      name: 'Alyuminiy gidroksidning kislotada erishi',
      description:
        'Al(OH)₃ amfoter: kislotada ham, ishqorda ham eriydi. Bu reaksiya uning ' +
        'asosli xossasini ko\'rsatadi.',
      observations: 'Jelesimon oq cho\'kma eriydi.',
    },
    {
      equation: 'Al(OH)₃ + NaOH → Na[Al(OH)₄]',
      name: 'Alyuminiy gidroksidning ishqorda erishi',
      description:
        'Xuddi shu Al(OH)₃ ishqorda ham eriydi — endi kislota vazifasini bajarib, ' +
        'gidroksoalyuminat hosil qiladi. Amfoterlikning to\'g\'ridan-to\'g\'ri isboti.',
      reactionType: 'amfoterlik',
      observations: 'Cho\'kma ortiqcha ishqorda yo\'qoladi.',
      techniques: ['Cho\'kmani ortiqcha reagentda eritish'],
    },
    {
      equation: 'H₂SO₄ + 2NH₃ → (NH₄)₂SO₄',
      name: 'Ammoniy sulfat olinishi',
      description:
        'Gaz holidagi ammiak kislota bilan bevosita birikadi. Mahsulot — eng keng ' +
        'tarqalgan azotli o\'g\'itlardan biri.',
      reactionType: 'birikish',
      environment: 'gaz — suyuqlik chegarasi',
      scale: 'sanoat',
      scaleNote: 'Yiliga o\'n million tonnalab ishlab chiqariladi (o\'g\'it sifatida).',
      observations: 'Oq tutun (mayda kristall zarrachalari) paydo bo\'ladi.',
      techniques: ['Absorbsiya', 'Kristallash'],
      equipment: ['Absorbsion minora'],
    },
    {
      equation: 'NH₃ + HCl → NH₄Cl',
      name: 'Ammiak va xlorid kislotaning "tutuni"',
      description:
        'Ikki gaz uchrashganda qattiq ammoniy xlorid hosil bo\'ladi — havoda oq ' +
        'tutun ko\'rinadi. Ikkala gazni aniqlashning klassik usuli.',
      reactionType: 'birikish',
      environment: 'gaz fazasi',
      observations: 'Quyuq oq tutun — reaksiya ko\'z bilan ko\'rinadi.',
      techniques: ['Gazlarni aniqlash'],
      scale: 'laboratoriya',
    },
    {
      equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
      name: 'Soda va kislota reaksiyasi',
      description:
        'Karbonat kislota beqaror bo\'lgani uchun darhol suv va karbonat angidridga ' +
        'ajraydi. Shuning uchun gaz ajralib chiqadi.',
      reactionType: 'gaz ajralishi bilan almashinish',
      mechanism:
        'Avval H₂CO₃ hosil bo\'ladi, u beqaror va shu zahoti H₂O + CO₂ ga ajraladi.',
      intermediates: [
        { formula: 'H₂CO₃', name: 'Karbonat kislota', note: 'Ajratib olib bo\'lmaydi — darhol parchalanadi' },
      ],
      observations: 'Shiddatli ko\'pik va gaz pufakchalari. Ohakli suv loyqalanadi.',
      techniques: ['Gaz ajratish', 'Ohakli suv bilan aniqlash'],
      equipment: ['Gaz ajratuvchi naycha', 'Probirka'],
    },
    {
      equation: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',
      name: 'Ichimlik sodasining kislota bilan reaksiyasi',
      description:
        'Oshqozondagi ortiqcha kislotani kamaytirish shu reaksiyaga asoslangan. ' +
        'Non yopishda ham xamirni ko\'pchitadigan shu gaz.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Tez gaz ajraladi, aralashma ko\'piradi.',
      scaleNote: 'Oziq-ovqat va farmatsevtikada keng qo\'llaniladi.',
    },
    {
      equation: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑',
      name: 'Soda va sulfat kislota',
      description: 'Kuchliroq kislota kuchsiz karbonat kislotani tuzidan siqib chiqaradi.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Gaz pufakchalari, aralashma isiydi.',
    },
    {
      equation: '2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂↑',
      name: 'Sirka va sodaning reaksiyasi',
      description:
        'Uydagi eng tanish kimyoviy tajriba. Kuchsiz kislota ham karbonatni ' +
        'parchalaydi, chunki karbonat kislota undan ham kuchsiz.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Kuchli ko\'pik. Idish sovib qoladi — reaksiya endotermik.',
      scale: 'laboratoriya',
    },
    {
      equation: 'CO₂ + 2NaOH → Na₂CO₃ + H₂O',
      name: 'Karbonat angidridning ishqorda yutilishi',
      description:
        'Ishqor ortiqcha bo\'lganda o\'rta tuz — soda hosil bo\'ladi. Yopiq ' +
        'joylarda CO₂ ni yutish uchun ishlatiladi.',
      reactionType: 'birikish',
      observations: 'Gaz yutiladi, bosim kamayadi.',
      scaleNote: 'Suvosti kemalari va kosmik kemalarda havo tozalashda.',
    },
    {
      equation: 'CO₂ + NaOH → NaHCO₃',
      name: 'Nordon tuz — natriy gidrokarbonat hosil bo\'lishi',
      description:
        'CO₂ ortiqcha bo\'lganda o\'rta tuz emas, nordon tuz hosil bo\'ladi. ' +
        'Reagent nisbati mahsulotni belgilaydigan yaxshi misol.',
      reactionType: 'birikish',
      observations:
        'Gaz o\'tkazilgan sari ishqor eritmasi asta-sekin o\'z ishqoriyligini ' +
        'yo\'qotadi — fenolftalein pushti rangi so\'nadi. Eritma tiniq qoladi. ' +
        'Ohakli suvdan farqli o\'laroq loyqalanish bo\'lmaydi, chunki NaHCO₃ eriydi.',
    },
    {
      equation: 'SO₂ + 2NaOH → Na₂SO₃ + H₂O',
      name: 'Oltingugurt (IV) oksidining ishqorda yutilishi',
      description:
        'Sanoat tutunidan SO₂ ni tozalashning asosiy usuli — aks holda u ' +
        'atmosferada kislotali yomg\'irga aylanadi.',
      reactionType: 'birikish',
      scale: 'sanoat',
      scaleNote: 'Issiqlik elektr stansiyalarida gaz tozalash (desulfurizatsiya).',
      observations: 'O\'tkir hidli gaz yo\'qoladi.',
    },
    {
      equation: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O',
      name: 'Ohakli suvning loyqalanishi',
      description:
        'CO₂ ni aniqlashning eng mashhur sifat reaksiyasi. Erimaydigan kalsiy ' +
        'karbonat cho\'kib, tiniq eritmani oqartiradi.',
      reactionType: 'sifat reaksiyasi',
      observations:
        'Tiniq ohakli suv sut kabi oqaradi. Gaz uzoq o\'tkazilsa cho\'kma qaytadan ' +
        'eriydi — Ca(HCO₃)₂ hosil bo\'ladi.',
      techniques: ['Gazni aniqlash'],
      equipment: ['Probirka', 'Gaz o\'tkazuvchi naycha'],
      scale: 'laboratoriya',
    },
    {
      equation: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂',
      name: 'Ohaktoshning erishi — g\'orlar qanday paydo bo\'ladi',
      description:
        'CO₂ ga to\'yingan suv ohaktoshni eritadi. Tabiatdagi karst g\'orlari va ' +
        'suvning qattiqligi shu reaksiya natijasi.',
      reactionType: 'birikish',
      temperature: 'tabiiy sharoit (5–20 °C)',
      scale: 'nazariy',
      scaleNote: 'Geokimyoviy jarayon: g\'orlar, stalaktit va stalagmitlar.',
      observations: 'Cho\'kma asta-sekin eriydi, eritma tiniqlashadi.',
    },
  ],
}
