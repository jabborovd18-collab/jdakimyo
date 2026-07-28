// data/reactions/organik-uglevodorod.js
//
// Uglevodorodlar: alkanlar, alkenlar, alkinlar, aromatik birikmalar.
//
// Organik kimyoda "qanday sharoitda" degan savol javobning yarmi: bir xil
// reagentlar bilan yorug'likda va katalizatorda butunlay boshqa mahsulot chiqadi.

module.exports = {
  kategoriya: 'Organik: uglevodorodlar',

  umumiy: {
    scale: 'ikkalasi',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'CH₄ + Cl₂ → CH₃Cl + HCl',
      name: 'Metanning xlorlanishi',
      description:
        'Alkanlar uchun xarakterli reaksiya — o\'rin olish. Yorug\'liksiz reaksiya ' +
        'bormaydi: xlor molekulasini radikallarga ajratish uchun energiya kerak.',
      reactionType: 'radikal o\'rin olish',
      catalyst: 'yorug\'lik (UB nur)',
      environment: 'gaz fazasi',
      temperature: 'xona harorati, yorug\'likda',
      mechanism:
        'Uch bosqich: (1) zanjir boshlanishi — Cl₂ → 2Cl•, (2) zanjir davomi — ' +
        'Cl• + CH₄ → CH₃• + HCl va CH₃• + Cl₂ → CH₃Cl + Cl•, (3) zanjir uzilishi — ' +
        'ikki radikal birikadi.',
      intermediates: [
        { formula: 'Cl•', name: 'Xlor radikali', note: 'Yorug\'lik ta\'sirida hosil bo\'ladi' },
        { formula: 'CH₃•', name: 'Metil radikali', note: 'Zanjirni davom ettiradi' },
      ],
      rateFactors: [
        { factor: 'Yorug\'lik', effect: 'Reaksiyani boshlaydi — qorong\'ida bormaydi' },
        { factor: 'Xlor konsentratsiyasi', effect: 'Ortiqcha xlorda chuqurroq xlorlanadi' },
      ],
      observations: 'Sarg\'ish xlor rangi yo\'qoladi.',
      yieldInfo: 'Aralash mahsulot: CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄ — ajratish kerak',
    },
    {
      equation: 'CH₃Cl + Cl₂ → CH₂Cl₂ + HCl',
      name: 'Xlorlanishning ikkinchi bosqichi',
      description:
        'Reaksiya birinchi mahsulotda to\'xtamaydi — shuning uchun sof CH₃Cl olish ' +
        'uchun xlor miqdorini cheklash kerak.',
      reactionType: 'radikal o\'rin olish',
      catalyst: 'yorug\'lik',
      environment: 'gaz fazasi',
    },
    {
      equation: 'C₂H₄ + H₂ → C₂H₆',
      name: 'Etilenning gidrogenlanishi',
      description:
        'Qo\'shbog\'ga vodorod birikadi. Yog\'larni margarinaga aylantirish shu ' +
        'reaksiyaga asoslangan.',
      reactionType: 'birikish',
      catalyst: 'Ni, Pt yoki Pd',
      temperature: '150–200 °C (Ni bilan)',
      pressure: '1–5 atm',
      mechanism:
        'Katalizator sirtida vodorod molekulasi atomlarga ajraladi va qo\'shbog\'ga ' +
        'ikki tomondan birikadi (sin-birikish).',
      scaleNote: 'Oziq-ovqat sanoatida suyuq yog\'larni qattiqlashtirish.',
    },
    {
      equation: 'C₂H₄ + Br₂ → C₂H₄Br₂',
      name: 'Etilenning bromlanishi — qo\'shbog\'ga sifat reaksiyasi',
      description:
        'Bromli suvning rangsizlanishi qo\'shbog\' borligini bildiradi. Alkanlar ' +
        'bunday qilmaydi — shuning uchun ularni ajratish oson.',
      reactionType: 'elektrofil birikish',
      environment: 'suvli yoki CCl₄ eritmasi',
      temperature: 'xona harorati',
      mechanism:
        'Brom molekulasi qo\'shbog\'ga yaqinlashganda qutblanadi, siklik bromoniy ' +
        'ioni hosil bo\'ladi, keyin brom ioni ikkinchi tomondan birikadi (anti-birikish).',
      intermediates: [
        { formula: 'C₂H₄Br⁺', name: 'Bromoniy ioni', note: 'Siklik oraliq zarracha' },
      ],
      observations: 'To\'q sariq bromli suv bir zumda rangsizlanadi.',
      techniques: ['Sifat reaksiyasi'],
      equipment: ['Probirka'],
      scale: 'laboratoriya',
    },
    {
      equation: 'C₂H₄ + HBr → C₂H₅Br',
      name: 'Etilenga vodorod bromid birikishi',
      description:
        'Nosimmetrik alkenlarda Markovnikov qoidasi ishlaydi: vodorod ko\'proq ' +
        'vodorodli uglerodga birikadi. Etilende ikkala uglerod bir xil.',
      reactionType: 'elektrofil birikish',
      temperature: 'xona harorati',
      mechanism: 'Avval H⁺ birikib karbokation hosil qiladi, keyin Br⁻ unga qo\'shiladi.',
      intermediates: [
        { formula: 'C₂H₅⁺', name: 'Etil karbokation', note: 'Barqarorligi mahsulotni belgilaydi' },
      ],
    },
    {
      equation: 'C₂H₄ + H₂O → C₂H₅OH',
      name: 'Etilenning gidratlanishi — sanoat etanoli',
      description:
        'Spirtni bijg\'itishsiz olish usuli. Sanoatda ishlab chiqariladigan ' +
        'etanolning katta qismi shu reaksiyadan.',
      reactionType: 'birikish',
      catalyst: 'H₃PO₄ (kremniyli tashuvchida)',
      temperature: '280–300 °C',
      pressure: '70–80 atm',
      environment: 'gaz fazasi',
      scale: 'sanoat',
      yieldInfo: 'Bir o\'tishda ~5%, aylantirib qayta yuboriladi',
      scaleNote: 'Bijg\'itish usulidan farqi: xomashyo neft, oziq-ovqat emas.',
    },
    {
      equation: 'C₂H₄ + 3O₂ → 2CO₂ + 2H₂O',
      name: 'Etilenning yonishi',
      description: 'Alkenlar alkanlarga qaraganda ko\'proq is bilan yonadi.',
      reactionType: 'yonish',
      observations: 'Yorug\' alanga, is chiqadi.',
    },
    {
      equation: 'C₂H₂ + H₂ → C₂H₄',
      name: 'Asetilenning qisman gidrogenlanishi',
      description:
        'Katalizatorni "zaharlab" reaksiyani etilen bosqichida to\'xtatish mumkin — ' +
        'aks holda etangacha borib qoladi.',
      reactionType: 'birikish',
      catalyst: 'Lindlar katalizatori (Pd/CaCO₃, qo\'rg\'oshin bilan zaharlangan)',
      temperature: '20–50 °C',
      scaleNote: 'Tanlab gidrogenlash — organik sintezning muhim usuli.',
    },
    {
      equation: 'C₂H₂ + 2Br₂ → C₂H₂Br₄',
      name: 'Asetilenning bromlanishi',
      description:
        'Uch bog\' ikki mol brom biriktiradi — alkenlardan ikki barobar ko\'p. ' +
        'Shu bilan alken va alkinni farqlash mumkin.',
      reactionType: 'birikish',
      environment: 'CCl₄ eritmasi',
      observations: 'Bromli suv rangsizlanadi, alkenga qaraganda ko\'proq brom sarflanadi.',
    },
    {
      equation: 'C₂H₂ + H₂O → CH₃CHO',
      name: 'Kucherov reaksiyasi',
      description:
        'Asetilendan sirka aldegidi. Kutilgan vinil spirt beqaror va darhol ' +
        'aldegidga aylanadi (tautomer qayta guruhlanish).',
      reactionType: 'birikish',
      catalyst: 'HgSO₄ (kislotali muhitda)',
      temperature: '70–100 °C',
      environment: 'kislotali suvli muhit',
      mechanism:
        'Suv uch bog\'ga birikib vinil spirt (CH₂=CH–OH) beradi, u beqaror va ' +
        'darhol sirka aldegidiga aylanadi.',
      intermediates: [
        { formula: 'CH₂=CH–OH', name: 'Vinil spirt', note: 'Beqaror — ajratib olib bo\'lmaydi' },
      ],
      scaleNote: 'Simob tuzlari zaharli — hozir bu usul boshqasi bilan almashtirilgan.',
    },
    {
      equation: 'C₂H₂ + HCl → C₂H₃Cl',
      name: 'Vinilxlorid olinishi',
      description:
        'Polivinilxlorid (PVX) plastmassasining monomeri. Quvur, linoleum va ' +
        'oyna romlari shu polimerdan.',
      reactionType: 'birikish',
      catalyst: 'HgCl₂ (ko\'mirda)',
      temperature: '150–200 °C',
      scale: 'sanoat',
      scaleNote: 'Hozir asosan etilendan olinadi — asetilen usuli qimmatroq.',
    },
    {
      equation: 'CaC₂ + 2H₂O → C₂H₂↑ + Ca(OH)₂',
      name: 'Karbiddan asetilen olish',
      description:
        'Laboratoriyada va payvandlashda asetilen olishning eng oddiy usuli. ' +
        'Texnik karbiddan olingan gaz o\'ziga xos yoqimsiz hidga ega.',
      reactionType: 'gidroliz',
      temperature: 'xona harorati',
      environment: 'suv',
      observations: 'Shiddatli gaz ajraladi, aralashma isiydi, oq loyqa hosil bo\'ladi.',
      techniques: ['Gaz olish'],
      equipment: ['Kolba', 'Tomizuvchi voronka', 'Gaz o\'tkazuvchi naycha'],
      scale: 'ikkalasi',
      scaleNote: 'Asetilen-kislorod alangasi 3000 °C ga yetadi — metall kesish va payvandlash.',
    },
    {
      equation: '3C₂H₂ → C₆H₆',
      name: 'Zelinskiy reaksiyasi — asetilendan benzol',
      description:
        'Uchta asetilen molekulasi halqaga birikadi. Aromatik birikmalarni ' +
        'ochiq zanjirli moddadan olishning klassik yo\'li.',
      reactionType: 'trimerlanish',
      catalyst: 'faollashtirilgan ko\'mir',
      temperature: '400–600 °C',
      yieldInfo: 'Taxminan 20–30%',
    },
    {
      equation: '2CH₄ → C₂H₂ + 3H₂',
      name: 'Metanning piroliz orqali asetilenga aylanishi',
      description:
        'Juda yuqori haroratda va qisqa vaqtda o\'tkaziladi — aks holda mahsulot ' +
        'qurumga aylanadi.',
      reactionType: 'piroliz',
      temperature: '1500 °C, kontakt vaqti ~0.01 s',
      environment: 'kislorodsiz muhit',
      scale: 'sanoat',
      rateFactors: [
        { factor: 'Kontakt vaqti', effect: 'Uzoq ushlansa asetilen parchalanib qurum beradi' },
        { factor: 'Tez sovutish', effect: 'Mahsulotni saqlab qolish uchun darhol sovutiladi' },
      ],
    },
    {
      equation: 'C₂H₆ → C₂H₄ + H₂',
      name: 'Etanning degidrogenlanishi',
      description: 'Alkanni alkenga aylantirish — polimer sanoati uchun xomashyo tayyorlash.',
      reactionType: 'degidrogenlash',
      catalyst: 'Cr₂O₃/Al₂O₃',
      temperature: '550–650 °C',
      scale: 'sanoat',
    },
    {
      equation: 'C₃H₈ → C₃H₆ + H₂',
      name: 'Propanning degidrogenlanishi',
      description: 'Propilen olinishi — polipropilen ishlab chiqarishning boshlanishi.',
      reactionType: 'degidrogenlash',
      catalyst: 'Cr₂O₃ yoki Pt',
      temperature: '550–600 °C',
      scale: 'sanoat',
    },
    {
      equation: '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O',
      name: 'Etanning yonishi',
      description:
        'Alkanlarning yonish tenglamasini muvozanatlashtirish imtihonda ko\'p ' +
        'uchraydi — kislorod koeffitsienti kasr chiqmasligi uchun butun tenglama ikkilanadi.',
      reactionType: 'yonish',
      observations: 'Ko\'k alanga, issiqlik ajraladi.',
    },
    {
      equation: 'C₆H₆ + Br₂ → C₆H₅Br + HBr',
      name: 'Benzolning bromlanishi',
      description:
        'Benzol qo\'shbog\'lari bo\'lsa-da, brom BIRIKMAYDI — o\'rin oladi. ' +
        'Aromatik halqa barqarorligi shunda ko\'rinadi.',
      reactionType: 'elektrofil o\'rin olish',
      catalyst: 'FeBr₃ yoki temir kukuni',
      temperature: 'xona harorati',
      mechanism:
        'Katalizator brom molekulasini qutblab Br⁺ hosil qiladi. U aromatik halqaga ' +
        'hujum qilib σ-kompleks beradi, keyin proton ajralib aromatiklik tiklanadi.',
      intermediates: [
        { formula: 'C₆H₆Br⁺', name: 'σ-kompleks (arenoniy ioni)', note: 'Aromatiklik vaqtincha buziladi' },
      ],
      observations: 'Brom rangi yo\'qoladi, HBr gazi ajraladi (havoda "tutaydi").',
      equipment: ['Qaytar sovutgich', 'Mo\'rili shkaf'],
      techniques: ['Qaytar sovutgich ostida qizdirish'],
    },
    {
      equation: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O',
      name: 'Benzolning nitrolanishi',
      description:
        'Nitrobenzol olinishi — anilin va shundan bo\'yoqlar ishlab chiqarishning ' +
        'birinchi qadami.',
      reactionType: 'elektrofil o\'rin olish',
      catalyst: 'konsentrlangan H₂SO₄',
      temperature: '50–60 °C',
      environment: 'nitrlovchi aralashma (HNO₃ + H₂SO₄)',
      mechanism:
        'Sulfat kislota nitrat kislotadan suv tortib nitroniy ionini (NO₂⁺) hosil ' +
        'qiladi — aynan shu zarracha halqaga hujum qiladi.',
      intermediates: [
        { formula: 'NO₂⁺', name: 'Nitroniy ioni', note: 'Haqiqiy elektrofil' },
      ],
      observations: 'Achchiq bodom hidli sarg\'ish moysimon suyuqlik ajraladi.',
      equipment: ['Qaytar sovutgich', 'Suv hammomi', 'Mo\'rili shkaf'],
      scale: 'sanoat',
      scaleNote: '60 °C dan oshirilsa dinitrobenzol hosil bo\'lib ketadi — harorat nazorati muhim.',
    },
    {
      equation: 'C₆H₆ + 3H₂ → C₆H₁₂',
      name: 'Benzolning gidrogenlanishi',
      description:
        'Aromatik halqani "sindirish" uchun qattiq sharoit kerak — bu uning ' +
        'barqarorligini ko\'rsatadi. Mahsulot — siklogeksan.',
      reactionType: 'birikish',
      catalyst: 'Ni yoki Pt',
      temperature: '180–250 °C',
      pressure: '10–30 atm',
      scale: 'sanoat',
      scaleNote: 'Siklogeksan — kapron (neylon) ishlab chiqarish uchun xomashyo.',
    },
    {
      equation: 'C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl',
      name: 'Fridel-Krafts alkillanishi',
      description:
        'Aromatik halqaga uglevodorod radikali biriktiriladi. Toluol olinadi.',
      reactionType: 'elektrofil o\'rin olish',
      catalyst: 'AlCl₃ (suvsiz)',
      temperature: '25–60 °C',
      environment: 'suvsiz muhit',
      mechanism: 'AlCl₃ metil xloriddan Cl⁻ ni tortib, CH₃⁺ karbokation hosil qiladi.',
      intermediates: [{ formula: 'CH₃⁺', name: 'Metil karbokation', note: 'Elektrofil' }],
      scaleNote: 'Katalizator namlikka juda sezgir — barcha reagentlar quruq bo\'lishi kerak.',
    },
    {
      equation: 'C₆H₅CH₃ + 3HNO₃ → C₆H₂(NO₂)₃CH₃ + 3H₂O',
      name: 'Toluolning trinitrolanishi (trotil olinishi)',
      description:
        'Metil guruhi halqani faollashtiradi, shuning uchun benzoldan farqli ' +
        'o\'laroq uchta nitroguruh kirita olamiz.',
      reactionType: 'elektrofil o\'rin olish',
      catalyst: 'konsentrlangan H₂SO₄',
      temperature: 'bosqichma-bosqich 30 °C dan 100 °C gacha',
      environment: 'nitrlovchi aralashma',
      scale: 'sanoat',
      scaleNote:
        'Portlovchi modda ishlab chiqarish qat\'iy nazorat ostida. Bu yerda faqat ' +
        'o\'rin olish qoidasini tushuntirish uchun keltirilgan.',
    },
    {
      equation: 'CH₃COONa + NaOH → CH₄↑ + Na₂CO₃',
      name: 'Metan olinishi (dekarboksillanish)',
      description:
        'Laboratoriyada metan olishning klassik usuli. Natriy asetat ishqor bilan ' +
        'qizdiriladi va karboksil guruh CO₂ ko\'rinishida ajraladi.',
      reactionType: 'dekarboksillanish',
      temperature: 'qizdirilganda (300 °C)',
      environment: 'quruq holda, natron ohak bilan',
      scale: 'laboratoriya',
      techniques: ['Quruq holda qizdirish', 'Suv ustida gaz to\'plash'],
      equipment: ['Probirka', 'Spirtovka', 'Kristallizator'],
    },
    {
      equation: 'C₆H₁₄ → C₆H₆ + 4H₂',
      name: 'Riforming — geksandan benzol',
      description:
        'Neftni qayta ishlashda to\'g\'ri zanjirli uglevodorodlar aromatik ' +
        'birikmalarga aylantiriladi. Benzinning oktan soni shu bilan oshiriladi.',
      reactionType: 'degidrosiklanish',
      catalyst: 'Pt/Al₂O₃',
      temperature: '480–520 °C',
      pressure: '15–30 atm',
      scale: 'sanoat',
      scaleNote: 'Katalitik riforming — neftni qayta ishlashning asosiy jarayonlaridan.',
    },
  ],
}
