// data/reactions/redoks.js
//
// Oksidlanish-qaytarilish reaksiyalari.
//
// Bu yerdagi tenglamalar ko'pincha imtihon va olimpiadada uchraydi, chunki
// koeffitsientlarni elektron balans usulida qo'yish kerak. Har biri
// tekshiruvchidan o'tgan — koeffitsientlar to'g'ri.

module.exports = {
  kategoriya: 'Redoks',

  umumiy: {
    reactionType: 'oksidlanish-qaytarilish',
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O',
      name: 'Kaliy permanganat va konsentrlangan xlorid kislota',
      description:
        'Laboratoriyada xlor olishning klassik usuli. Mn⁺⁷ dan Mn⁺² gacha ' +
        'qaytariladi, xlorid ionlari esa erkin xlorgacha oksidlanadi.',
      environment: 'kislotali muhit',
      mechanism:
        'Elektron balans: Mn⁺⁷ + 5e⁻ → Mn⁺² (2 marta), 2Cl⁻ − 2e⁻ → Cl₂ (5 marta). ' +
        'Shuning uchun permanganat oldida 2, xlor oldida 5 turadi.',
      observations:
        'To\'q binafsha eritma rangsizlanadi, sarg\'ish-yashil o\'tkir hidli gaz ajraladi.',
      techniques: ['Gaz olish', 'So\'rgichli shkafda ishlash'],
      equipment: ['Mo\'rili shkaf', 'Kolba', 'Gaz o\'tkazuvchi naycha'],
      solvents: [{ name: 'Suv', efficiency: 'yuqori' }],
      bestSolvent: 'Suv',
    },
    {
      equation: '2KMnO₄ + 5H₂O₂ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 5O₂↑ + 8H₂O',
      name: 'Permanganatning vodorod peroksid bilan qaytarilishi',
      description:
        'Bu yerda vodorod peroksid qaytaruvchi — kislorodini beradi. Boshqa ' +
        'reaksiyalarda esa u oksidlovchi bo\'ladi. Ikki xil rol o\'ynay olishi ' +
        'peroksidning o\'ziga xosligi.',
      environment: 'kislotali muhit',
      observations: 'Binafsha rang yo\'qoladi, kislorod pufakchalari ajraladi.',
      techniques: ['Permanganatometriya'],
      equipment: ['Byuretka', 'Konussimon kolba'],
    },
    {
      equation: '2KMnO₄ + 10FeSO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + 2MnSO₄ + K₂SO₄ + 8H₂O',
      name: 'Temir (II) ning permanganat bilan titrlanishi',
      description:
        'Analitik kimyoda temir miqdorini aniqlashning asosiy usuli. Indikator ' +
        'kerak emas — permanganatning o\'zi rang beradi.',
      environment: 'kislotali muhit (H₂SO₄)',
      observations:
        'Har tomchi permanganat rangsizlanadi. Ortiqcha tomchi tushishi bilan ' +
        'eritma och pushti bo\'lib qoladi — titrlash tugadi.',
      techniques: ['Permanganatometrik titrlash'],
      equipment: ['Byuretka', 'Konussimon kolba', 'Pipetka'],
      scaleNote: 'Ruda va qotishmalarda temir miqdorini aniqlashda.',
    },
    {
      equation: 'K₂Cr₂O₇ + 6FeSO₄ + 7H₂SO₄ → Cr₂(SO₄)₃ + 3Fe₂(SO₄)₃ + K₂SO₄ + 7H₂O',
      name: 'Dixromat bilan titrlash',
      description:
        'Permanganatdan farqli o\'laroq dixromat eritmasi barqaror va uzoq ' +
        'saqlanadi. Cr⁺⁶ dan Cr⁺³ gacha qaytariladi.',
      environment: 'kislotali muhit',
      observations: 'To\'q sariq eritma yashil tusga o\'tadi (Cr³⁺ rangi).',
      techniques: ['Dixromatometriya'],
      equipment: ['Byuretka', 'Konussimon kolba'],
    },
    {
      equation: '5H₂C₂O₄ + 2KMnO₄ + 3H₂SO₄ → 10CO₂↑ + 2MnSO₄ + K₂SO₄ + 8H₂O',
      name: 'Oksalat kislotaning oksidlanishi',
      description:
        'Permanganat eritmasining aniq konsentratsiyasini belgilashda ishlatiladi ' +
        '(standartlash). Reaksiya avtokataliz bilan boradi.',
      environment: 'kislotali muhit',
      temperature: '60–80 °C',
      rateFactors: [
        { factor: 'Harorat', effect: 'Sovuqda juda sekin — 60–80 °C gacha isitiladi' },
        { factor: 'Mn²⁺ ionlari', effect: 'Hosil bo\'lgan Mn²⁺ o\'zi katalizator — reaksiya asta tezlashadi' },
      ],
      mechanism: 'Avtokataliz: mahsulot (Mn²⁺) katalizator vazifasini bajaradi.',
      observations: 'Boshida sekin, keyin tezlashadi. Gaz ajraladi.',
      techniques: ['Isitib titrlash'],
    },
    {
      equation: 'I₂ + 2Na₂S₂O₃ → 2NaI + Na₂S₄O₆',
      name: 'Yodometrik titrlash',
      description:
        'Yodni tiosulfat bilan titrlash — analitik kimyoning eng ko\'p ishlatiladigan ' +
        'usullaridan biri. Indikator — kraxmal.',
      environment: 'neytral yoki kuchsiz kislotali muhit',
      observations:
        'Jigarrang eritma rangsizlanadi. Kraxmal qo\'shilsa ko\'k rang paydo bo\'ladi ' +
        'va oxirgi tomchida yo\'qoladi.',
      techniques: ['Yodometrik titrlash'],
      equipment: ['Byuretka', 'Konussimon kolba'],
      scaleNote: 'Suvdagi erigan kislorod, vitamin C va mis miqdorini aniqlashda.',
    },
    {
      equation: '2H₂O₂ → 2H₂O + O₂↑',
      name: 'Vodorod peroksidning parchalanishi',
      description:
        'Peroksid o\'z-o\'zidan sekin parchalanadi, katalizator qo\'shilsa ' +
        'shiddatli boradi. Kislorod olishning oson usuli.',
      reactionType: 'parchalanish (disproporsiyalanish)',
      catalyst: 'MnO₂ yoki katalaza fermenti',
      mechanism:
        'Disproporsiyalanish: peroksiddagi kislorod bir vaqtda ham oksidlanadi ' +
        '(O₂ gacha), ham qaytariladi (H₂O gacha).',
      rateFactors: [
        { factor: 'Katalizator (MnO₂)', effect: 'Parchalanish bir zumda boradi' },
        { factor: 'Yorug\'lik', effect: 'Tezlashtiradi — shuning uchun qorong\'i shishada saqlanadi' },
        { factor: 'Harorat', effect: 'Isitishda tezlashadi' },
      ],
      observations: 'Kuchli ko\'pik va issiqlik. Cho\'g\' solingan cho\'p alangalanadi.',
      techniques: ['Gaz to\'plash'],
      equipment: ['Kolba', 'Gaz o\'tkazuvchi naycha'],
    },
    {
      equation: '2KClO₃ → 2KCl + 3O₂↑',
      name: 'Bertole tuzining parchalanishi',
      description:
        'Laboratoriyada kislorod olishning eng keng tarqalgan usuli. Katalizatorsiz ' +
        'ancha yuqori harorat kerak.',
      reactionType: 'parchalanish',
      catalyst: 'MnO₂',
      temperature: '150–300 °C (katalizator bilan), 400 °C dan yuqori (katalizatorsiz)',
      rateFactors: [
        { factor: 'MnO₂ katalizatori', effect: 'Parchalanish haroratini ~150 °C ga tushiradi' },
      ],
      observations: 'Tuz suyuqlanadi, gaz ajraladi. Cho\'g\' yorqin alangalanadi.',
      techniques: ['Qizdirish', 'Suv ustida gaz to\'plash'],
      equipment: ['Probirka', 'Spirtovka', 'Kristallizator'],
    },
    {
      equation: 'Cl₂ + 2KI → 2KCl + I₂',
      name: 'Xlorning yodni siqib chiqarishi',
      description:
        'Galogenlar faollik qatorining isboti: yuqori turgan galogen pastdagisini ' +
        'tuzidan siqib chiqaradi.',
      reactionType: 'o\'rin olish',
      environment: 'suvli eritma',
      observations:
        'Rangsiz eritma sariq-jigarrang tusga kiradi. Kraxmal qo\'shilsa ko\'karadi.',
      techniques: ['Sifat reaksiyasi'],
    },
    {
      equation: 'Br₂ + 2KI → 2KBr + I₂',
      name: 'Bromning yodni siqib chiqarishi',
      description: 'Brom yoddan faolroq, lekin xlordan kuchsizroq.',
      reactionType: 'o\'rin olish',
      environment: 'suvli eritma',
      observations: 'Eritma to\'q jigarrang tusga kiradi.',
    },
    {
      equation: '2FeCl₂ + Cl₂ → 2FeCl₃',
      name: 'Temir (II) ning temir (III) gacha oksidlanishi',
      description:
        'Xlor kuchli oksidlovchi — temirni yuqori valentlikka o\'tkazadi. ' +
        'Rang o\'zgarishi bilan kuzatiladi.',
      reactionType: 'birikish',
      environment: 'suvli eritma',
      observations: 'Och yashil eritma sariq-jigarrang tusga o\'tadi.',
    },
    {
      equation: '2Na + Cl₂ → 2NaCl',
      name: 'Osh tuzining elementlaridan hosil bo\'lishi',
      description:
        'Metall va nometall orasidagi ion bog\'lanishning eng sof misoli. ' +
        'Natriy elektron beradi, xlor oladi.',
      reactionType: 'birikish',
      temperature: 'qizdirilganda',
      environment: 'quruq gaz',
      observations: 'Yorqin sariq alanga, oq tutun — mayda tuz kristallari.',
      equipment: ['Mo\'rili shkaf', 'Himoya ekrani'],
    },
    {
      equation: '2Fe + 3Cl₂ → 2FeCl₃',
      name: 'Temirning xlorda yonishi',
      description:
        'Xlor temirni to\'g\'ridan-to\'g\'ri +3 gacha oksidlaydi (xlorid kislota esa ' +
        'faqat +2 gacha) — oksidlovchi kuchining farqi ko\'rinadi.',
      reactionType: 'birikish',
      temperature: 'qizdirilganda',
      observations: 'Temir simi cho\'g\'lanadi, jigarrang tutun hosil bo\'ladi.',
    },
    {
      equation: '4P + 5O₂ → 2P₂O₅',
      name: 'Fosforning yonishi',
      description:
        'Oq fosfor havoda o\'z-o\'zidan alangalanadi. Hosil bo\'lgan oksid havodagi ' +
        'namlikni yutib, quyuq oq tutun beradi.',
      reactionType: 'yonish',
      temperature: 'oq fosfor uchun 40 °C dan yuqori',
      observations: 'Ko\'z qamashtiruvchi yorqin alanga va quyuq oq tutun.',
      equipment: ['Mo\'rili shkaf', 'Chinni kosacha'],
      scale: 'ikkalasi',
      scaleNote: 'Sanoatda fosfat kislota olishning birinchi bosqichi.',
    },
    {
      equation: 'C + O₂ → CO₂',
      name: 'Uglerodning to\'liq yonishi',
      description:
        'Kislorod yetarli bo\'lganda karbonat angidrid hosil bo\'ladi. Yer yuzidagi ' +
        'energiya olishning asosiy reaksiyasi.',
      reactionType: 'yonish',
      temperature: 'yuqori (700 °C dan)',
      scale: 'ikkalasi',
      observations: 'Cho\'g\'lanish, issiqlik ajralishi.',
      scaleNote: 'Issiqlik energetikasining asosi. Bir mol uglerod ~394 kJ beradi.',
    },
    {
      equation: '2C + O₂ → 2CO',
      name: 'Uglerodning chala yonishi',
      description:
        'Kislorod yetishmaganda zaharli is gazi hosil bo\'ladi. Yopiq xonadagi ' +
        'pechda odam zaharlanishining sababi aynan shu.',
      reactionType: 'yonish',
      temperature: 'yuqori, kislorod yetishmagan sharoit',
      observations: 'Ko\'k alanga. Gaz rangsiz va hidsiz — sezib bo\'lmaydi.',
      scaleNote: 'Domna pechida temir rudasini qaytaruvchi shu gaz.',
    },
    {
      equation: '2Mg + O₂ → 2MgO',
      name: 'Magniyning yonishi',
      description:
        'Ko\'z qamashtiruvchi oq alanga bilan yonadi. Ilgari fotografiyada ' +
        'chaqnoq sifatida ishlatilgan.',
      reactionType: 'yonish',
      temperature: 'alangalanish 600 °C dan',
      observations: 'Juda yorqin oq alanga, oq kukun qoladi.',
      equipment: ['Tigel qisqichi', 'Ko\'z himoyasi'],
    },
    {
      equation: '4Al + 3O₂ → 2Al₂O₃',
      name: 'Alyuminiy oksidlanishi',
      description:
        'Havoda alyuminiy sirtida bir zumda zich oksid pardasi hosil bo\'ladi. ' +
        'Aynan shu parda metallni keyingi yemirilishdan saqlaydi.',
      reactionType: 'birikish',
      observations: 'Kukun holida yorqin alanga bilan yonadi; yaxlit metall faqat parda beradi.',
      scaleNote: 'Anodlash texnologiyasi shu pardani sun\'iy qalinlashtirishga asoslangan.',
    },
    {
      equation: '2H₂ + O₂ → 2H₂O',
      name: 'Vodorodning yonishi ("portlovchi gaz")',
      description:
        'Ikki hajm vodorod va bir hajm kislorod aralashmasi uchqundan portlaydi. ' +
        'Yagona mahsuloti suv — shuning uchun eng toza yoqilg\'i hisoblanadi.',
      reactionType: 'yonish',
      temperature: 'alangalanish ~570 °C yoki uchqun',
      catalyst: 'platina (past haroratda)',
      observations: 'Ko\'rinmas ko\'kish alanga, kuchli portlash tovushi.',
      equipment: ['Himoya ekrani'],
      scale: 'ikkalasi',
      scaleNote: 'Vodorod yoqilg\'i elementlari va raketa dvigatellari.',
    },
    {
      equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
      name: 'Metanning yonishi',
      description:
        'Tabiiy gazning yonishi. Uydagi gaz plitasi va issiqlik elektr stansiyalarining ' +
        'asosiy reaksiyasi.',
      reactionType: 'yonish',
      observations: 'Ko\'k alanga. Sariq alanga kislorod yetishmayotganini bildiradi.',
      scale: 'sanoat',
      scaleNote: 'Bir mol metan yonganda ~890 kJ issiqlik ajraladi.',
    },
    {
      equation: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
      name: 'Alyuminotermiya (termit reaksiyasi)',
      description:
        'Alyuminiy temirni oksididan siqib chiqaradi. Shu qadar ko\'p issiqlik ' +
        'ajraladiki, temir suyuq holda oqadi — relslarni payvandlashda ishlatiladi.',
      reactionType: 'o\'rin olish',
      temperature: 'boshlanishi uchun 1000 °C, jarayonda 2500 °C gacha',
      observations: 'Ko\'z qamashtiruvchi alanga, cho\'g\'langan suyuq temir oqadi.',
      equipment: ['Shamotli tigel', 'Qum to\'shak', 'Himoya ekrani'],
      scale: 'ikkalasi',
      scaleNote: 'Temir yo\'l relslarini joyida payvandlash texnologiyasi.',
    },
    {
      equation: 'CuO + H₂ → Cu + H₂O',
      name: 'Mis oksidining vodorod bilan qaytarilishi',
      description:
        'Vodorodning qaytaruvchi xossasini ko\'rsatuvchi klassik tajriba. ' +
        'Qora kukun qizil metallga aylanadi.',
      reactionType: 'o\'rin olish',
      temperature: '300–400 °C',
      observations:
        'Qora CuO qizg\'ish-yaltiroq misga aylanadi, naycha devorida suv tomchilari.',
      techniques: ['Gaz oqimida qizdirish'],
      equipment: ['Kvars naycha', 'Spirtovka'],
    },
    {
      equation: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O',
      name: 'Xlorning sovuq ishqorda disproporsiyalanishi',
      description:
        'Xlor bir vaqtda ham oksidlanadi (0 → +1), ham qaytariladi (0 → −1). ' +
        'Hosil bo\'lgan aralashma — oqartiruvchi vosita.',
      reactionType: 'disproporsiyalanish',
      temperature: 'sovuq (0–20 °C)',
      environment: 'ishqoriy muhit',
      observations: 'Gaz yutiladi, eritma oqartiruvchi xossaga ega bo\'ladi.',
      scale: 'sanoat',
      scaleNote: 'Maishiy oqartirgichlar (belizna) shu eritma.',
    },
    {
      equation: '3Cl₂ + 6KOH → 5KCl + KClO₃ + 3H₂O',
      name: 'Xlorning issiq ishqorda disproporsiyalanishi',
      description:
        'Xuddi shu reagentlar, lekin issiq muhitda mahsulot boshqacha: gipoxlorit ' +
        'emas, xlorat (Bertole tuzi) hosil bo\'ladi.',
      reactionType: 'disproporsiyalanish',
      temperature: 'issiq (70–100 °C)',
      environment: 'ishqoriy muhit',
      rateFactors: [
        { factor: 'Harorat', effect: 'Mahsulotni butunlay o\'zgartiradi — sovuqda ClO⁻, issiqda ClO₃⁻' },
      ],
    },
    {
      equation: 'MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
      name: 'Permanganat bilan temirning ion tenglamasi',
      description:
        'Yuqoridagi titrlash reaksiyasining qisqartirilgan ion ko\'rinishi. ' +
        'Zaryad ham, atomlar ham ikki tomonda teng.',
      environment: 'kislotali muhit',
      observations: 'Binafsha rang yo\'qoladi.',
    },
    {
      equation: 'Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O',
      name: 'Dixromat bilan temirning ion tenglamasi',
      description: 'Dixromatometrik titrlashning ion ko\'rinishi.',
      environment: 'kislotali muhit',
      observations: 'Sariq eritma yashil tusga o\'tadi.',
    },
  ],
}
