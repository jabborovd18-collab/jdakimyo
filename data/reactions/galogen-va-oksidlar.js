// data/reactions/galogen-va-oksidlar.js
//
// Galogenlar va oksidlarning xossalari.
// Oksidlarning kislotali/asosli/amfoter bo'linishi shu reaksiyalarda ko'rinadi.

module.exports = {
  kategoriya: 'Oksidlar va galogenlar',

  umumiy: {
    temperature: 'xona harorati (20–25 °C)',
    scale: 'laboratoriya',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'H₂ + Cl₂ → 2HCl',
      name: 'Vodorod va xlorning birikishi',
      description:
        'Qorong\'ida sekin, yorug\'likda zanjir reaksiyasi bo\'lib portlash darajasida ' +
        'boradi. Radikal mexanizmning klassik misoli.',
      reactionType: 'birikish',
      catalyst: 'yorug\'lik (fotokimyoviy qo\'zg\'atish)',
      mechanism:
        'Zanjir reaksiya: yorug\'lik Cl₂ ni ikki radikalga ajratadi, keyin ' +
        'Cl• + H₂ → HCl + H•, H• + Cl₂ → HCl + Cl• — zanjir davom etaveradi.',
      intermediates: [
        { formula: 'Cl•', name: 'Xlor radikali', note: 'Zanjirni boshlaydi' },
        { formula: 'H•', name: 'Vodorod radikali', note: 'Zanjirni davom ettiradi' },
      ],
      rateFactors: [
        { factor: 'Yorug\'lik', effect: 'To\'g\'ridan-to\'g\'ri yorug\'likda portlaydi' },
      ],
      observations: 'Rangsiz gaz hosil bo\'ladi, havoda "tutaydi" (namlikni yutadi).',
      equipment: ['Himoya ekrani', 'Mo\'rili shkaf'],
    },
    {
      equation: 'Cl₂ + H₂O ⇌ HCl + HClO',
      name: 'Xlorli suv hosil bo\'lishi',
      description:
        'Xlor suvda qisman disproporsiyalanadi. Hosil bo\'lgan gipoxlorit kislota ' +
        'oqartiruvchi va zararsizlantiruvchi ta\'sir beradi.',
      reactionType: 'disproporsiyalanish (qaytar)',
      environment: 'suvli eritma',
      observations: 'Sarg\'ish eritma, o\'tkir hid. Bo\'yoq va gullar rangsizlanadi.',
      scaleNote: 'Suvni xlorlash — ichimlik suvini zararsizlantirishning asosiy usuli.',
    },
    {
      equation: 'Br₂ + H₂O ⇌ HBr + HBrO',
      name: 'Bromli suv',
      description:
        'Bromli suv organik kimyoda qo\'shbog\'ni aniqlash uchun ishlatiladi — ' +
        'alkenlar uni rangsizlantiradi.',
      reactionType: 'disproporsiyalanish (qaytar)',
      environment: 'suvli eritma',
      observations: 'To\'q sariq eritma.',
    },
    {
      equation: '2F₂ + 2H₂O → 4HF + O₂↑',
      name: 'Ftorning suv bilan reaksiyasi',
      description:
        'Ftor shu qadar kuchli oksidlovchiki, suvdan kislorodni siqib chiqaradi. ' +
        'Boshqa galogenlarda bunday bo\'lmaydi.',
      reactionType: 'o\'rin olish',
      observations: 'Shiddatli reaksiya, kislorod ajraladi.',
      equipment: ['Mo\'rili shkaf', 'Maxsus himoya'],
    },
    {
      equation: '2HI + Cl₂ → 2HCl + I₂',
      name: 'Xlorning yodovodoroddan yodni siqib chiqarishi',
      description: 'Galogenlarning oksidlovchilik kuchi yuqoridan pastga kamayadi.',
      reactionType: 'o\'rin olish',
      environment: 'suvli eritma',
      observations: 'Eritma jigarranglashadi, yod cho\'kmasi tushishi mumkin.',
    },
    {
      equation: 'SO₂ + H₂O ⇌ H₂SO₃',
      name: 'Sulfit kislota hosil bo\'lishi',
      description:
        'Kislotali oksid suv bilan kislota beradi. H₂SO₃ beqaror — faqat eritmada ' +
        'mavjud, ajratib olib bo\'lmaydi.',
      reactionType: 'birikish (qaytar)',
      environment: 'suvli eritma',
      observations: 'Eritma nordonlashadi, lakmus qizaradi.',
      scaleNote: 'Atmosferada SO₂ dan kislotali yomg\'ir shu tarzda hosil bo\'ladi.',
    },
    {
      equation: 'CO₂ + H₂O ⇌ H₂CO₃',
      name: 'Karbonat kislota hosil bo\'lishi',
      description:
        'Gazlangan suvning nordon ta\'mi shu kislotadan. Muvozanat kuchli chapga ' +
        'siljigan — CO₂ ning atigi 1% ga yaqini kislotaga aylanadi.',
      reactionType: 'birikish (qaytar)',
      environment: 'suvli eritma',
      observations: 'Lakmus och pushti tusga kiradi.',
    },
    {
      equation: 'N₂O₅ + H₂O → 2HNO₃',
      name: 'Azot (V) oksididan nitrat kislota',
      description: 'Oliy oksid o\'ziga mos oliy kislotani beradi.',
      reactionType: 'birikish',
      environment: 'suvli muhit',
      observations:
        'Oq kristall oksid suvda shiddat bilan eriydi, ko\'p issiqlik ajraladi — ' +
        'aralashma qizib ketadi. Eritma rangsiz, lekin indikator qog\'ozi darhol ' +
        'qizaradi: kuchli kislota hosil bo\'lgan.',
    },
    {
      equation: 'P₂O₅ + 3H₂O → 2H₃PO₄',
      name: 'Fosfat kislota olinishi',
      description:
        'P₂O₅ suvni shu qadar kuchli yutadiki, quritgich sifatida ishlatiladi. ' +
        'Suv bilan reaksiyasi juda shiddatli.',
      reactionType: 'birikish',
      observations: 'Kuchli issiqlik ajraladi, oq kukun eriydi.',
      scale: 'ikkalasi',
      scaleNote: 'Sanoatda o\'g\'it va oziq-ovqat kislotasi olishda.',
    },
    {
      equation: 'Na₂O + H₂O → 2NaOH',
      name: 'Natriy oksidining suv bilan reaksiyasi',
      description: 'Asosli oksid suv bilan ishqor beradi.',
      reactionType: 'birikish',
      observations: 'Shiddatli, ko\'p issiqlik ajraladi. Fenolftalein pushti bo\'ladi.',
    },
    {
      equation: 'BaO + H₂O → Ba(OH)₂',
      name: 'Bariy oksididan bariy gidroksid',
      description: 'Kuchli asos — bariy gidroksid (barit suvi) olinadi.',
      reactionType: 'birikish',
      observations: 'Massa qiziydi, eritma ishqoriy.',
    },
    {
      equation: 'CaO + CO₂ → CaCO₃',
      name: 'Ohakning havodagi CO₂ ni yutishi',
      description:
        'So\'ndirilmagan ohak ochiq havoda asta-sekin karbonatga aylanadi — ' +
        'shuning uchun germetik idishda saqlanadi.',
      reactionType: 'birikish',
      observations: 'Kukun asta-sekin qattiqlashadi.',
    },
    {
      equation: 'CaO + SiO₂ → CaSiO₃',
      name: 'Shlak hosil bo\'lishi',
      description:
        'Domna pechida ohak rudadagi kremnezyomni bog\'lab, suyuq shlakka ' +
        'aylantiradi. Shlak metall ustida qalqib turadi va ajratib olinadi.',
      reactionType: 'birikish',
      temperature: '1200–1500 °C',
      scale: 'sanoat',
      scaleNote: 'Shlak keyin sement ishlab chiqarishda ishlatiladi.',
    },
    {
      equation: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O',
      name: 'Alyuminiy oksidining kislotada erishi',
      description: 'Amfoter oksidning asosli tomoni — kislota bilan tuz beradi.',
      reactionType: 'amfoterlik',
      observations:
        'Oq kukun sovuq kislotada deyarli erimaydi — qizdirish shart. Qizdirilgan ' +
        'sari kukun kamayadi va eritma tiniqlashadi, oxirida rangsiz eritma qoladi. ' +
        'Gaz chiqmaydi: bu neytrallanish, siqib chiqarish emas.',
      temperature: 'qizdirilganda',
    },
    {
      equation: 'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O',
      name: 'Alyuminiy oksidining ishqorda erishi',
      description:
        'Xuddi shu oksid ishqorda ham eriydi — alyuminat hosil qilib. ' +
        'Amfoterlikning to\'liq isboti.',
      reactionType: 'amfoterlik',
      observations:
        'Suvli ishqorda deyarli hech narsa bo\'lmaydi — reaksiya faqat ' +
        'suyuqlantirilganda boradi. Eritmada oq kukun yo\'qoladi va sovutilgach ' +
        'shishasimon massa qoladi. Aynan shu tajriba amfoterlikni isbotlaydi: ' +
        'bir xil oksid ham kislotada, ham ishqorda eriydi.',
      temperature: 'suyuqlantirib (900 °C)',
      scaleNote: 'Bayer usulida boksitni tozalash shu reaksiyaga asoslangan.',
    },
    {
      equation: 'ZnO + 2NaOH + H₂O → Na₂[Zn(OH)₄]',
      name: 'Rux oksidining ishqorda erishi',
      description: 'Amfoter oksid ishqorda gidroksokompleks beradi.',
      reactionType: 'amfoterlik',
      observations:
        'Oq kukun konsentrlangan ishqorda asta eriydi va eritma butunlay ' +
        'tiniqlashadi. Rangsiz gidroksokompleks hosil bo\'ladi — rang ham, ' +
        'cho\'kma ham qolmaydi. Kukunning yo\'qolishi yagona belgi.',
      environment: 'konsentrlangan ishqor eritmasi',
    },
    {
      equation: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O',
      name: 'Kremnezyomning ishqorda erishi',
      description:
        'Shisha ishqorga chidamsiz — shuning uchun ishqor shisha idishda uzoq ' +
        'saqlanmaydi. Hosil bo\'lgan modda "suyuq shisha" deb ataladi.',
      reactionType: 'birikish',
      temperature: 'suyuqlantirib yoki avtoklavda',
      scale: 'sanoat',
      scaleNote: 'Silikat yelim (suyuq shisha) shu tarzda ishlab chiqariladi.',
    },
    {
      equation: 'CuO + 2HCl → CuCl₂ + H₂O',
      name: 'Mis oksidining kislotada erishi',
      description: 'Asosli oksid + kislota = tuz va suv. Eng oddiy qoidaning misoli.',
      reactionType: 'almashinish',
      temperature: 'qizdirilganda',
      observations: 'Qora kukun erib, yashil-ko\'k eritma hosil bo\'ladi.',
    },
    {
      equation: 'SO₂ + 2H₂S → 3S↓ + 2H₂O',
      name: 'Klaus jarayoni — oltingugurt olinishi',
      description:
        'Ikki zaharli gaz bir-birini "zararsizlantiradi" va foydali mahsulot beradi. ' +
        'Neftni tozalashda ajralgan gazlardan oltingugurt shu usulda olinadi.',
      reactionType: 'oksidlanish-qaytarilish',
      temperature: '200–300 °C',
      catalyst: 'Al₂O₃',
      scale: 'sanoat',
      observations: 'Sariq oltingugurt cho\'kmasi hosil bo\'ladi.',
      scaleNote: 'Dunyodagi oltingugurtning katta qismi shu usulda olinadi.',
    },
  ],
}
