// data/reactions/biokimyo.js
//
// Tirik organizmdagi va oziq-ovqat sanoatidagi asosiy reaksiyalar.
//
// Bu tenglamalar umumlashtirilgan: haqiqatda har biri o'nlab bosqichdan iborat
// va ferment nazorati ostida boradi. Umumiy tenglama moddalar balansini
// ko'rsatadi, mexanizmni emas — buni ochiq aytish kerak.

module.exports = {
  kategoriya: 'Biokimyo',

  umumiy: {
    environment: 'suvli muhit (hujayra ichida)',
    scale: 'nazariy',
    bestSolvent: 'Suv',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
      name: 'Fotosintez',
      description:
        'Yer yuzidagi deyarli barcha organik moddaning va atmosferadagi ' +
        'kislorodning manbai. Yorug\'lik energiyasi kimyoviy bog\'ga saqlanadi.',
      reactionType: 'yig\'ilish (assimilyatsiya)',
      catalyst: 'xlorofill (yorug\'lik energiyasi bilan)',
      temperature: '15–30 °C (optimal)',
      environment: 'o\'simlik hujayrasi xloroplastida',
      mechanism:
        'Umumiy tenglama. Aslida ikki bosqich: yorug\'lik bosqichida suv ' +
        'parchalanib kislorod ajraladi va ATP hosil bo\'ladi; qorong\'i bosqichda ' +
        '(Kalvin sikli) CO₂ shu energiya hisobiga uglevodga aylanadi.',
      rateFactors: [
        { factor: 'Yorug\'lik kuchi', effect: 'Ma\'lum darajagacha tezlashtiradi, keyin to\'yinadi' },
        { factor: 'CO₂ konsentratsiyasi', effect: 'Issiqxonalarda ataylab oshiriladi' },
        { factor: 'Harorat', effect: '35 °C dan yuqorida fermentlar ishdan chiqadi' },
      ],
      observations: 'Suv o\'simliklarida barg yuzasida kislorod pufakchalari ko\'rinadi.',
      scaleNote:
        'Yer sayyorasida yiliga ~100 milliard tonna uglerod shu yo\'l bilan ' +
        'organik moddaga aylanadi.',
    },
    {
      equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O',
      name: 'Hujayra nafas olishi',
      description:
        'Fotosintezning teskarisi. Glukozadagi energiya bosqichma-bosqich ' +
        'ajratib olinadi — bir yo\'la yonib ketmasligi uchun.',
      reactionType: 'oksidlanish (dissimilyatsiya)',
      catalyst: 'fermentlar zanjiri',
      temperature: '37 °C (odam tanasida)',
      environment: 'hujayra mitoxondriyasida',
      mechanism:
        'Umumiy tenglama. Uch bosqich: glikoliz, Krebs sikli va nafas olish ' +
        'zanjiri. Energiya ATP ko\'rinishida saqlanadi.',
      yieldInfo: 'Bir mol glukozadan ~30 mol ATP (nazariy 38)',
      scaleNote: 'Ajraladigan energiya 2870 kJ/mol — yondirilganda ham shuncha.',
    },
    {
      equation: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂',
      name: 'Spirtli bijg\'ish',
      description:
        'Kislorodsiz sharoitda achitqi glukozani spirtga aylantiradi. Non, pivo ' +
        'va vino ishlab chiqarishning asosi.',
      reactionType: 'bijg\'ish (anaerob)',
      catalyst: 'zimaza fermenti (achitqi)',
      temperature: '25–35 °C (optimal 30 °C)',
      environment: 'kislorodsiz suvli muhit',
      rateFactors: [
        { factor: 'Harorat', effect: '30 °C atrofida eng tez; 40 °C dan yuqorida achitqi nobud bo\'ladi' },
        { factor: 'Spirt konsentratsiyasi', effect: '12–15% dan oshganda achitqi o\'ladi va jarayon to\'xtaydi' },
        { factor: 'Kislorod yo\'qligi', effect: 'Kislorod bo\'lsa achitqi nafas olishga o\'tadi, spirt bermaydi' },
      ],
      observations: 'Gaz pufakchalari, xamir ko\'tariladi, spirt hidi paydo bo\'ladi.',
      scale: 'ikkalasi',
      scaleNote: 'Nonvoyxonada ajralgan CO₂ xamirni ko\'pchitadi, spirt esa pishirishda uchib ketadi.',
    },
    {
      equation: 'C₆H₁₂O₆ → 2C₃H₆O₃',
      name: 'Sut kislotali bijg\'ish',
      description:
        'Sut mahsulotlari (qatiq, tvorog) va turshak shu jarayonda tayyorlanadi. ' +
        'Mushakda kislorod yetishmaganda ham shu reaksiya boradi.',
      reactionType: 'bijg\'ish (anaerob)',
      catalyst: 'sut kislotali bakteriyalar fermentlari',
      temperature: '30–40 °C',
      environment: 'kislorodsiz suvli muhit',
      observations: 'Sut nordonlashadi va uyiydi — kislota kazeinni cho\'ktiradi.',
      scale: 'ikkalasi',
      scaleNote:
        'Mushakdagi og\'riq ilgari sut kislotasiga bog\'lanardi; hozirgi qarash ' +
        'boshqacha, lekin reaksiyaning o\'zi to\'g\'ri.',
    },
    {
      equation: 'C₁₂H₂₂O₁₁ + H₂O → 2C₆H₁₂O₆',
      name: 'Saxarozaning gidrolizi (invert shakar)',
      description:
        'Bir molekula saxarozadan glukoza va fruktoza hosil bo\'ladi. Ikkalasining ' +
        'formulasi bir xil, tuzilishi har xil. Asal tarkibi asosan shu aralashma.',
      reactionType: 'gidroliz',
      catalyst: 'kislota yoki invertaza fermenti',
      temperature: '60–80 °C (kislotali gidrolizda)',
      environment: 'kislotali suvli muhit',
      observations: 'Eritma shirinroq ta\'m oladi — fruktoza saxarozadan shirinroq.',
      scale: 'ikkalasi',
      scaleNote: 'Qandolatchilikda kristallanishni oldini olish uchun ataylab qilinadi.',
    },
    {
      equation: 'C₁₂H₂₂O₁₁ + 12O₂ → 12CO₂ + 11H₂O',
      name: 'Saxarozaning to\'liq yonishi',
      description:
        'Oziq-ovqatning kaloriyasi shu reaksiyaning issiqlik effekti bilan ' +
        'o\'lchanadi (kalorimetrik bomba).',
      reactionType: 'yonish',
      temperature: 'alangalanish 160 °C dan',
      environment: 'kislorod muhiti',
      scale: 'laboratoriya',
      techniques: ['Kalorimetriya'],
      equipment: ['Kalorimetrik bomba'],
    },
    {
      equation: '2NH₃ + CO₂ → CO(NH₂)₂ + H₂O',
      name: 'Karbamid (mochevina) sintezi',
      description:
        'Vyoler 1828-yilda organik moddani noorganikdan olib, "hayotiy kuch" ' +
        'nazariyasini rad etgan. Hozir eng ko\'p ishlab chiqariladigan azotli o\'g\'it.',
      reactionType: 'birikish',
      temperature: '180–200 °C',
      pressure: '150–200 atm',
      environment: 'suyuq faza',
      scale: 'sanoat',
      scaleNote:
        'Yiliga ~200 million tonna ishlab chiqariladi. Ammiak sintezining davomi ' +
        'sifatida bir zavodda o\'tkaziladi.',
      equipment: ['Yuqori bosimli reaktor'],
    },
    {
      equation: 'CO(NH₂)₂ + H₂O → 2NH₃ + CO₂',
      name: 'Karbamidning gidrolizi',
      description:
        'Tuproqqa solingan karbamid ureaza fermenti ta\'sirida ammiakka aylanadi — ' +
        'o\'simlik aynan shu shaklda azotni o\'zlashtiradi.',
      reactionType: 'gidroliz',
      catalyst: 'ureaza fermenti',
      temperature: 'tuproq harorati (10–30 °C)',
      environment: 'nam tuproq',
      observations: 'Ammiak hidi — o\'g\'it yuzada qolsa azot havoga uchib ketadi.',
      scaleNote: 'Shuning uchun karbamid tuproqqa ko\'miladi, yuzaga sochilmaydi.',
    },
  ],
}
