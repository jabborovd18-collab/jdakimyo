// data/reactions/sanoat.js
//
// Sanoat jarayonlari.
//
// Bu reaksiyalarda sharoit (harorat, bosim, katalizator) tasodifiy tanlanmagan —
// har bir qiymat unum va tezlik o'rtasidagi murosaning natijasi. Shuning uchun
// bu yerda "nega aynan shu harorat" degan izoh ham bor.

module.exports = {
  kategoriya: 'Sanoat jarayonlari',

  umumiy: {
    scale: 'sanoat',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'N₂ + 3H₂ ⇌ 2NH₃',
      name: 'Haber-Bosh usuli — ammiak sintezi',
      description:
        'Havodagi azotni o\'g\'itga aylantirgan jarayon. Yer aholisining katta ' +
        'qismi shu reaksiya bergan o\'g\'it hisobiga oziqlanadi.',
      reactionType: 'birikish (qaytar)',
      temperature: '400–500 °C',
      pressure: '200–300 atm',
      catalyst: 'Temir (Fe) — K₂O va Al₂O₃ qo\'shimchalari bilan',
      environment: 'gaz fazasi, inert sharoit',
      mechanism:
        'Azot molekulasidagi uch bog\' juda mustahkam. Katalizator sirtida N₂ va H₂ ' +
        'adsorbsiyalanib, bog\'lar bo\'shashadi va atomlar bosqichma-bosqich birikadi.',
      rateFactors: [
        { factor: 'Bosim', effect: 'Bosim ortishi muvozanatni ammiak tomonga siljitadi (hajm kamayadi)' },
        { factor: 'Harorat', effect: 'Isitish tezlashtiradi, lekin unumni kamaytiradi — ekzotermik reaksiya' },
        { factor: 'Katalizator', effect: 'Aktivlanish energiyasini tushiradi, muvozanatni siljitmaydi' },
        { factor: 'Ammiakni ajratib olish', effect: 'Suyultirib chiqarib turilsa muvozanat o\'ngga siljiydi' },
      ],
      scaleNote:
        '400–500 °C tanlanishi murosa: past haroratda unum yuqori, lekin reaksiya ' +
        'juda sekin; yuqori haroratda tez, lekin ammiak parchalanadi.',
      yieldInfo: 'Bir o\'tishda 15–20%; reagentlar aylantirib qayta yuboriladi',
      equipment: ['Yuqori bosimli kolonna', 'Kompressor', 'Sovutgich-kondensator'],
      techniques: ['Aylanma sikl', 'Katalitik sintez'],
    },
    {
      equation: '2SO₂ + O₂ ⇌ 2SO₃',
      name: 'Kontakt usuli — oltingugurt (VI) oksidi olinishi',
      description:
        'Sulfat kislota ishlab chiqarishning eng muhim bosqichi. Sulfat kislota ' +
        'esa sanoatning "noni" — undan qolgan hamma narsa boshlanadi.',
      reactionType: 'birikish (qaytar)',
      temperature: '400–500 °C',
      pressure: '1–2 atm',
      catalyst: 'V₂O₅ (vanadiy (V) oksidi)',
      environment: 'gaz fazasi',
      rateFactors: [
        { factor: 'Katalizator', effect: 'V₂O₅ bo\'lmasa reaksiya amalda bormaydi' },
        { factor: 'Ortiqcha kislorod', effect: 'Muvozanatni SO₃ tomonga siljitadi' },
        { factor: 'Harorat', effect: '400 °C dan past — sekin; 600 °C dan yuqori — unum tushadi' },
      ],
      yieldInfo: '98% gacha (bir necha qatlamli katalizator va oraliq sovutish bilan)',
      equipment: ['Kontakt apparati', 'Issiqlik almashtirgich'],
      scaleNote: 'Platina katalizator ham ishlaydi, lekin qimmat va zaharlanishga moyil.',
    },
    {
      equation: 'SO₃ + H₂O → H₂SO₄',
      name: 'Sulfat kislota olinishi',
      description:
        'To\'g\'ridan-to\'g\'ri suvga yutdirilmaydi: reaksiya shu qadar issiqlik ' +
        'beradiki, tuman hosil bo\'lib gaz yo\'qoladi. Shuning uchun avval ' +
        'konsentrlangan kislotada yutiladi (oleum), keyin suyultiriladi.',
      reactionType: 'birikish',
      temperature: '60–80 °C',
      environment: 'konsentrlangan H₂SO₄ (oleum) muhitida',
      observations: 'Kuchli issiqlik ajraladi.',
      equipment: ['Absorbsion minora'],
      techniques: ['Oleum orqali yutdirish'],
      scaleNote: 'Yiliga ~250 million tonna ishlab chiqariladi — barcha kimyoviy moddalar ichida birinchi.',
    },
    {
      equation: '4NH₃ + 5O₂ → 4NO + 6H₂O',
      name: 'Ostvald usuli, 1-bosqich: ammiakning katalitik oksidlanishi',
      description:
        'Nitrat kislota ishlab chiqarishning boshlanishi. Katalizatorsiz ammiak ' +
        'yonib azot beradi — kerakli mahsulot chiqmaydi.',
      reactionType: 'katalitik oksidlanish',
      temperature: '800–900 °C',
      pressure: '1–10 atm',
      catalyst: 'Platina-rodiy to\'ri',
      environment: 'gaz fazasi',
      rateFactors: [
        { factor: 'Kontakt vaqti', effect: 'Juda qisqa bo\'lishi kerak (~1 millisekund) — aks holda NO parchalanadi' },
        { factor: 'Katalizator', effect: 'Pt-Rh bo\'lmasa mahsulot NO emas, N₂ bo\'ladi' },
      ],
      yieldInfo: '95–98%',
      equipment: ['Kontakt apparati (platina to\'r bilan)'],
    },
    {
      equation: '2NO + O₂ → 2NO₂',
      name: 'Ostvald usuli, 2-bosqich: azot oksidining oksidlanishi',
      description:
        'Rangsiz NO havodagi kislorod bilan darhol jigarrang NO₂ ga aylanadi. ' +
        'Kam uchraydigan holat: harorat pasayganda reaksiya tezlashadi.',
      reactionType: 'birikish',
      temperature: '25–50 °C (sovutilgan gaz)',
      observations: 'Rangsiz gaz jigarrang tusga kiradi.',
      rateFactors: [
        { factor: 'Sovutish', effect: 'Past haroratda tezlashadi — bu qoidadan istisno' },
      ],
    },
    {
      equation: '3NO₂ + H₂O → 2HNO₃ + NO',
      name: 'Ostvald usuli, 3-bosqich: nitrat kislota hosil bo\'lishi',
      description:
        'NO₂ suvda disproporsiyalanadi. Ajralgan NO qayta oksidlanib sikldan ' +
        'o\'tadi — shuning uchun hech narsa isrof bo\'lmaydi.',
      reactionType: 'disproporsiyalanish',
      temperature: '25–40 °C',
      pressure: '5–10 atm',
      environment: 'suvli muhit',
      equipment: ['Absorbsion kolonna'],
      yieldInfo: 'Konsentratsiyasi 50–60% li kislota olinadi',
      scaleNote: 'Konsentrlash uchun oleum yoki Mg(NO₃)₂ bilan suvsizlantiriladi.',
    },
    {
      equation: '2NaCl + 2H₂O → 2NaOH + H₂↑ + Cl₂↑',
      name: 'Osh tuzi eritmasining elektrolizi (xlor-ishqor sanoati)',
      description:
        'Bitta arzon xomashyodan uchta muhim mahsulot: ishqor, xlor va vodorod. ' +
        'Katod va anod bo\'shliqlari ajratilmasa mahsulotlar o\'zaro reaksiyaga kirishadi.',
      reactionType: 'elektroliz',
      temperature: '80–90 °C',
      environment: 'to\'yingan NaCl eritmasi, membrana bilan ajratilgan',
      mechanism:
        'Katodda suv qaytariladi: 2H₂O + 2e⁻ → H₂ + 2OH⁻. Anodda xlorid ionlari ' +
        'oksidlanadi: 2Cl⁻ − 2e⁻ → Cl₂.',
      equipment: ['Membranali elektrolizyor', 'Titan anod', 'Po\'lat katod'],
      techniques: ['Elektroliz'],
      scaleNote: 'Membrana texnologiyasi simobli usulni siqib chiqardi — ekologik sabab.',
    },
    {
      equation: '2H₂O → 2H₂↑ + O₂↑',
      name: 'Suvning elektrolizi',
      description:
        'Toza suv tokni yaxshi o\'tkazmaydi — ozgina ishqor yoki kislota qo\'shiladi. ' +
        'Vodorod energetikasining asosiy usuli.',
      reactionType: 'elektroliz',
      environment: 'ishqor yoki kislota qo\'shilgan suv',
      observations: 'Katodda ikki hajm vodorod, anodda bir hajm kislorod ajraladi.',
      equipment: ['Elektrolizyor', 'Hofman apparati'],
      scale: 'ikkalasi',
      techniques: ['Elektroliz', 'Gaz to\'plash'],
    },
    {
      equation: '2Al₂O₃ → 4Al + 3O₂↑',
      name: 'Alyuminiy olinishi (Xoll-Eru usuli)',
      description:
        'Alyuminiy oksidining suyuqlanish harorati 2050 °C. Kriolitda eritilsa ' +
        '950 °C yetadi — shu kashfiyot alyuminiyni qimmatbaho metalldan ' +
        'kundalik materialga aylantirgan.',
      reactionType: 'elektroliz',
      temperature: '950–980 °C',
      catalyst: 'kriolit Na₃AlF₆ (erituvchi muhit)',
      environment: 'suyuq kriolitdagi eritma',
      equipment: ['Elektroliz vannasi', 'Uglerod anodlari'],
      scaleNote:
        '1 tonna alyuminiy uchun ~14 000 kWh elektr kerak. Shuning uchun zavodlar ' +
        'GESlar yonida quriladi.',
      techniques: ['Suyuq holda elektroliz'],
    },
    {
      equation: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂',
      name: 'Domna jarayoni — temir olinishi',
      description:
        'Rudani qaytaruvchi — koksdan hosil bo\'lgan is gazi. Uglerodning o\'zi ' +
        'emas, aynan CO asosiy ish bajaradi.',
      reactionType: 'qaytarilish',
      temperature: '700–1200 °C (bosqichma-bosqich)',
      environment: 'domna pechi, koks muhiti',
      mechanism:
        'Bosqichli qaytarilish: Fe₂O₃ → Fe₃O₄ → FeO → Fe. Har bosqich o\'z ' +
        'harorat oralig\'ida boradi.',
      intermediates: [
        { formula: 'Fe₃O₄', name: 'Magnetit', note: 'Birinchi qaytarilish mahsuloti' },
        { formula: 'FeO', name: 'Vyustit', note: 'Yuqori haroratda hosil bo\'ladi' },
      ],
      equipment: ['Domna pechi', 'Havo isitgich'],
      scaleNote: 'Dunyodagi temirning ~90% i shu usulda olinadi.',
    },
    {
      equation: 'CaCO₃ → CaO + CO₂↑',
      name: 'Ohak pishirish',
      description:
        'Insoniyat qo\'llagan eng qadimgi kimyoviy jarayonlardan biri. Qurilish ' +
        'ohagi, sement va shishaning boshlanish nuqtasi.',
      reactionType: 'termik parchalanish',
      temperature: '900–1000 °C',
      environment: 'ochiq pech, CO₂ chiqib turadi',
      rateFactors: [
        { factor: 'CO₂ ni chiqarib yuborish', effect: 'Muvozanat mahsulot tomonga siljiydi' },
        { factor: 'Bo\'lakning kattaligi', effect: 'Mayda bo\'lak tez pishadi' },
      ],
      equipment: ['Aylanma pech', 'Shaxta pechi'],
      observations: 'Toshdan gaz chiqadi, massa yengillashadi.',
    },
    {
      equation: 'CaO + H₂O → Ca(OH)₂',
      name: 'Ohakni so\'ndirish',
      description:
        'Juda ko\'p issiqlik ajraladi — suv qaynab ketadi. Qurilishda ohak ' +
        'shu tarzda tayyorlanadi.',
      reactionType: 'birikish',
      temperature: 'o\'z-o\'zidan 100 °C gacha qiziydi',
      observations: 'Massa qiziydi, bug\' chiqadi, tosh kukunga aylanadi.',
      scale: 'ikkalasi',
      equipment: ['So\'ndirish chuqurchasi'],
    },
    {
      equation: 'CH₄ + H₂O → CO + 3H₂',
      name: 'Metanning bug\' bilan konversiyasi',
      description:
        'Sanoat vodorodining asosiy manbai. Ammiak sintezi uchun vodorod aynan ' +
        'shu yerdan olinadi.',
      reactionType: 'konversiya',
      temperature: '700–1000 °C',
      pressure: '15–30 atm',
      catalyst: 'Nikel (Ni)',
      environment: 'gaz fazasi, suv bug\'i ortiqchaligida',
      scaleNote: 'Dunyodagi vodorodning ~50% i shu usulda ishlab chiqariladi.',
      equipment: ['Reforming pechi'],
    },
    {
      equation: 'CO + H₂O ⇌ CO₂ + H₂',
      name: 'Suv gazi konversiyasi',
      description:
        'Oldingi bosqichda qolgan is gazini ham vodorodga aylantiradi. ' +
        'CO₂ keyin yutib olinadi va toza vodorod qoladi.',
      reactionType: 'konversiya (qaytar)',
      temperature: '350–450 °C (yuqori haroratli bosqich), 200 °C (past haroratli)',
      catalyst: 'Fe₂O₃/Cr₂O₃, keyin CuO/ZnO',
      environment: 'gaz fazasi',
      rateFactors: [
        { factor: 'Ortiqcha suv bug\'i', effect: 'Muvozanatni vodorod tomonga siljitadi' },
      ],
    },
    {
      equation: 'NaCl + NH₃ + CO₂ + H₂O → NaHCO₃↓ + NH₄Cl',
      name: 'Solve usuli — kalsinlangan soda olinishi',
      description:
        'Natriy gidrokarbonat kam eriydi va cho\'kadi — jarayonning butun mohiyati ' +
        'shunda. Ammiak keyin qaytarib olinadi va yana ishlatiladi.',
      reactionType: 'almashinish',
      temperature: '30–40 °C',
      environment: 'to\'yingan tuz eritmasi, ammiak bilan to\'yintirilgan',
      observations: 'Oq cho\'kma — natriy gidrokarbonat.',
      equipment: ['Karbonatlash minorasi', 'Filtr'],
      techniques: ['Cho\'ktirish', 'Filtrlash', 'Ammiakni regeneratsiya qilish'],
      scaleNote: 'Ammiakni qayta ishlatish jarayonni tejamli qilgan — 1861-yildan beri asosiy usul.',
    },
    {
      equation: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑',
      name: 'Solve usuli, yakuniy bosqich: sodani kalsinlash',
      description:
        'Cho\'kma qizdirilib kalsinlangan sodaga aylantiriladi. Ajralgan CO₂ ' +
        'jarayonning boshiga qaytariladi.',
      reactionType: 'termik parchalanish',
      temperature: '150–200 °C',
      observations: 'Kukun massasi kamayadi, gaz ajraladi.',
      equipment: ['Kalsinlash pechi'],
    },
    {
      equation: 'SiO₂ + 2C → Si + 2CO↑',
      name: 'Texnik kremniy olinishi',
      description:
        'Quruq qumdan kremniy. Keyin qo\'shimcha tozalashdan o\'tib quyosh ' +
        'panellari va mikrosxemalarga aylanadi.',
      reactionType: 'qaytarilish',
      temperature: '1800–2000 °C',
      environment: 'elektr yoyi pechi',
      equipment: ['Elektr yoyi pechi', 'Uglerod elektrodlari'],
      yieldInfo: 'Texnik kremniy tozaligi 98–99%',
    },
    {
      equation: 'Cu₂S + O₂ → 2Cu + SO₂↑',
      name: 'Mis olinishi (konvertorda)',
      description:
        'Mis sulfidli rudadan olinadi. Ajralgan SO₂ atmosferaga chiqarilmasdan ' +
        'sulfat kislota ishlab chiqarishga yuboriladi.',
      reactionType: 'oksidlanish',
      temperature: '1200–1300 °C',
      environment: 'konvertor, havo puflanadi',
      observations: 'Suyuq qora mis hosil bo\'ladi.',
      equipment: ['Konvertor'],
      scaleNote: 'Toza mis olish uchun keyin elektrokimyoviy tozalash o\'tkaziladi.',
    },
    {
      equation: 'ZnO + C → Zn + CO↑',
      name: 'Rux olinishi (pirometallurgik usul)',
      description:
        'Rux 907 °C da qaynaydi — jarayonda bug\' holida ajralib chiqadi va ' +
        'kondensatorda yig\'iladi.',
      reactionType: 'qaytarilish',
      temperature: '1100–1200 °C',
      equipment: ['Retorta pechi', 'Kondensator'],
      observations: 'Rux bug\'i sovutgichda suyuq metallga aylanadi.',
    },
    {
      equation: 'CaCO₃ + SiO₂ → CaSiO₃ + CO₂↑',
      name: 'Shisha pishirish reaksiyasi',
      description:
        'Soda, ohaktosh va qumdan shisha olinadi. Bu — uning kalsiyli qismini ' +
        'hosil qiluvchi reaksiya.',
      reactionType: 'birikish',
      temperature: '1200–1500 °C',
      environment: 'suyuqlangan massa',
      equipment: ['Vanna pechi'],
      scaleNote: 'Oddiy oyna shishasi taxminan Na₂O·CaO·6SiO₂ tarkibiga ega.',
    },
  ],
}
