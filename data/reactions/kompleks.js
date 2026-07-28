// data/reactions/kompleks.js
//
// Kompleks birikmalar hosil bo'lishi.
//
// Kompleks hosil bo'lishining amaliy ma'nosi: erimaydigan modda eriydi,
// rangsiz eritma rang oladi, aniqlab bo'lmaydigan ion aniqlanadigan bo'ladi.

module.exports = {
  kategoriya: 'Kompleks birikmalar',

  umumiy: {
    reactionType: 'kompleks hosil bo\'lishi',
    environment: 'suvli eritma',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    bestSolvent: 'Suv',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄',
      name: 'Mis-ammiakli kompleks',
      description:
        'Mis ionini aniqlashning eng ko\'rkam usuli: och ko\'k eritma to\'q ' +
        'binafsha-ko\'k tusga kiradi. Koordinatsion son — 4.',
      mechanism:
        'Ammiak molekulalari o\'zining bo\'linmagan elektron juftini mis ioniga ' +
        'beradi — donor-akseptor bog\' hosil bo\'ladi. Suv molekulalari ' +
        'ichki sferadan siqib chiqariladi.',
      intermediates: [
        { formula: '[Cu(H₂O)₄]²⁺', name: 'Akvakompleks', note: 'Boshlang\'ich holat — eritmadagi och ko\'k rang shundan' },
        { formula: 'Cu(OH)₂', name: 'Mis gidroksid', note: 'Ammiak oz bo\'lsa avval cho\'kma tushadi' },
      ],
      observations:
        'Avval och ko\'k cho\'kma tushadi, ortiqcha ammiakda erib to\'q ko\'k-binafsha ' +
        'tiniq eritma hosil bo\'ladi.',
      techniques: ['Ortiqcha reagent qo\'shish'],
      equipment: ['Probirka', 'Tomizgich'],
      scaleNote: 'Shvayzer reaktivi — sellulozani eritish uchun shu kompleks ishlatiladi.',
    },
    {
      equation: 'Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂',
      name: 'Mis gidroksidning ammiakda erishi',
      description:
        'Erimaydigan cho\'kma kompleks hosil qilib eriydi — kompleks hosil ' +
        'bo\'lishining eng amaliy oqibati.',
      observations: 'Ko\'k cho\'kma to\'q ko\'k tiniq eritmaga aylanadi.',
    },
    {
      equation: 'AgCl + 2NH₃ → [Ag(NH₃)₂]Cl',
      name: 'Kumush xloridning ammiakda erishi',
      description:
        'AgCl ni AgBr va AgI dan ajratish usuli: faqat xlorid ammiakda oson eriydi.',
      observations: 'Oq cho\'kma butunlay erib, tiniq eritma qoladi.',
      techniques: ['Cho\'kmani ajratish'],
    },
    {
      equation: 'AgNO₃ + 2NH₃ → [Ag(NH₃)₂]NO₃',
      name: 'Tollens reaktivi tayyorlash',
      description:
        '"Kumush ko\'zgu" reaksiyasi uchun reagent. Aldegidlarni aniqlashda ' +
        'ishlatiladi. Uzoq saqlanmaydi — portlovchi birikma hosil bo\'lishi mumkin.',
      observations: 'Cho\'kma erib tiniq eritma hosil bo\'ladi.',
      techniques: ['Reagentni ishlatishdan oldin tayyorlash'],
      scaleNote: 'Tayyorlangan reaktiv o\'sha kuni ishlatilishi kerak.',
    },
    {
      equation: 'AgBr + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaBr',
      name: 'Fotografiyada fiksaj',
      description:
        'Yorug\'lik tushmagan kumush bromidni plyonkadan yuvib tashlash. Tiosulfat ' +
        'uni eriydigan kompleksga aylantiradi.',
      observations: 'Sutrang qatlam tiniqlashadi.',
      scale: 'ikkalasi',
      scaleNote: 'An\'anaviy fotografiyaning asosiy bosqichi (gipofosfit — fiksaj tuzi).',
    },
    {
      equation: '4FeCl₃ + 3K₄[Fe(CN)₆] → Fe₄[Fe(CN)₆]₃↓ + 12KCl',
      name: 'Berlin ko\'ki hosil bo\'lishi',
      description:
        'Fe³⁺ ionini aniqlashning eng sezgir usuli. Hosil bo\'lgan pigment ' +
        'rassomlikda ham ishlatilgan.',
      reactionType: 'sifat reaksiyasi',
      observations: 'To\'q ko\'k cho\'kma darhol tushadi.',
      techniques: ['Sifat tahlili'],
      equipment: ['Probirka'],
    },
    {
      equation: '3FeSO₄ + 2K₃[Fe(CN)₆] → Fe₃[Fe(CN)₆]₂↓ + 3K₂SO₄',
      name: 'Turnbull ko\'ki hosil bo\'lishi',
      description:
        'Bu safar Fe²⁺ ioni aniqlanadi. Ikki reaksiyani birga ishlatib, temirning ' +
        'qaysi valentlikda ekanini aniq aytish mumkin.',
      reactionType: 'sifat reaksiyasi',
      observations: 'To\'q ko\'k cho\'kma.',
    },
    {
      equation: 'CoCl₂ + 6NH₃ → [Co(NH₃)₆]Cl₂',
      name: 'Kobalt-ammiakli kompleks',
      description:
        'Koordinatsion son 6 — oktaedrik tuzilish. Verner koordinatsion nazariyani ' +
        'aynan kobalt komplekslarini o\'rganib yaratgan.',
      observations: 'Pushti eritma sarg\'ish-jigarrang tusga o\'tadi.',
      scaleNote: 'Alfred Verner shu komplekslar uchun 1913-yilda Nobel mukofotini olgan.',
    },
    {
      equation: 'NiSO₄ + 6NH₃ → [Ni(NH₃)₆]SO₄',
      name: 'Nikel-ammiakli kompleks',
      description: 'Koordinatsion son 6. Nikel ionini aniqlashda ishlatiladi.',
      observations: 'Yashil eritma ko\'k-binafsha tusga kiradi.',
    },
    {
      equation: 'Zn(OH)₂ + 4NH₃ → [Zn(NH₃)₄](OH)₂',
      name: 'Rux gidroksidning ammiakda erishi',
      description:
        'Rux gidroksidi ham ishqorda, ham ammiakda eriydi — Al(OH)₃ esa ammiakda ' +
        'erimaydi. Shu farq ikkalasini ajratishga imkon beradi.',
      observations: 'Oq cho\'kma tiniq eritmaga aylanadi.',
      techniques: ['Kationlarni ajratish'],
    },
    {
      equation: 'Cr(OH)₃ + 3NaOH → Na₃[Cr(OH)₆]',
      name: 'Xrom gidroksidning ishqorda erishi',
      description: 'Amfoter gidroksid gidroksokompleks berib eriydi.',
      reactionType: 'amfoterlik',
      observations: 'Kulrang-yashil cho\'kma yorqin yashil eritmaga aylanadi.',
    },
    {
      equation: 'HgI₂ + 2KI → K₂[HgI₄]',
      name: 'Nessler reaktivining asosi',
      description:
        'Erimaydigan simob yodid ortiqcha yodidda erib kompleks beradi. Bu eritma ' +
        'suvda ammiakni aniqlashda ishlatiladi.',
      observations: 'Qizil cho\'kma erib rangsiz eritma qoladi.',
      scaleNote: 'Suv sifatini nazorat qilishda ammoniy ionini aniqlash uchun.',
    },
    {
      equation: 'HgCl₂ + 2KI → HgI₂↓ + 2KCl',
      name: 'Simob (II) yodid cho\'kmasi',
      description: 'Yuqoridagi kompleks hosil bo\'lishidan oldingi bosqich.',
      reactionType: 'cho\'ktirish',
      observations: 'Yorqin qizil-to\'q sariq cho\'kma.',
    },
    {
      equation: 'FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl',
      name: 'Temir (III) tiosianat — "qon" reaksiyasi',
      description:
        'Fe³⁺ ni aniqlashning eng sezgir usuli: juda kichik konsentratsiyada ham ' +
        'qon-qizil rang beradi.',
      reactionType: 'sifat reaksiyasi',
      observations: 'Eritma darhol to\'q qizil (qon rangi) tusga kiradi.',
      techniques: ['Sifat tahlili', 'Kolorimetriya'],
      scaleNote: 'Miqdoriy tahlilda ham ishlatiladi — rang quyuqligi konsentratsiyaga bog\'liq.',
    },
    {
      equation: 'AgI + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaI',
      name: 'Kumush yodidning tiosulfatda erishi',
      description:
        'Ammiakda erimaydigan AgI ham tiosulfatda eriydi — kompleks barqarorligi ' +
        'ligandga bog\'liqligining isboti.',
      observations: 'Sariq cho\'kma asta-sekin eriydi.',
    },
  ],
}
