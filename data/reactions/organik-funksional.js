// data/reactions/organik-funksional.js
//
// Kislorodli va azotli organik birikmalar: spirtlar, aldegidlar, kislotalar,
// efirlar, fenollar, aminlar.

module.exports = {
  kategoriya: 'Organik: funksional guruhlar',

  umumiy: {
    scale: 'ikkalasi',
    source: 'JDA Kimyo — o\'quv bazasi',
  },

  reaksiyalar: [
    {
      equation: 'C₂H₅OH + HBr → C₂H₅Br + H₂O',
      name: 'Spirtdan galogenalkan olish',
      description:
        'Gidroksil guruhi bromga almashadi. Kislota katalizatori OH ni suvga ' +
        'aylantirib, uni yaxshi ketuvchi guruhga o\'tkazadi.',
      reactionType: 'nukleofil o\'rin olish',
      catalyst: 'konsentrlangan H₂SO₄',
      temperature: 'qaynatib (~100 °C)',
      mechanism:
        'Avval spirt protonlanadi (C₂H₅OH₂⁺), keyin suv ajralib karbokation yoki ' +
        'to\'g\'ridan-to\'g\'ri Br⁻ hujumi bo\'ladi.',
      techniques: ['Qaytar sovutgich ostida qizdirish', 'Haydash'],
      equipment: ['Qaytar sovutgich', 'Dumaloq tubli kolba'],
    },
    {
      equation: 'C₂H₅OH → C₂H₄ + H₂O',
      name: 'Etanolning suvsizlanishi — etilen olish',
      description:
        '170 °C da molekula ichidan suv ajraladi va qo\'shbog\' hosil bo\'ladi. ' +
        'Haroratni 140 °C ga tushirsak butunlay boshqa mahsulot chiqadi.',
      reactionType: 'ichki suvsizlanish (eliminatsiya)',
      catalyst: 'konsentrlangan H₂SO₄ yoki Al₂O₃',
      temperature: '170 °C dan yuqori',
      rateFactors: [
        { factor: 'Harorat', effect: '170 °C — etilen, 140 °C — dietil efir. Harorat mahsulotni belgilaydi' },
      ],
      observations: 'Gaz ajraladi, bromli suvni rangsizlantiradi.',
      techniques: ['Qizdirib gaz to\'plash'],
      equipment: ['Kolba', 'Termometr', 'Gaz o\'tkazuvchi naycha'],
    },
    {
      equation: '2C₂H₅OH → C₂H₅OC₂H₅ + H₂O',
      name: 'Dietil efir olinishi',
      description:
        'Xuddi shu spirt, xuddi shu kislota — lekin past haroratda ikki molekula ' +
        'orasidan suv ajraladi va efir hosil bo\'ladi.',
      reactionType: 'molekulalararo suvsizlanish',
      catalyst: 'konsentrlangan H₂SO₄',
      temperature: '140 °C',
      observations: 'O\'ziga xos hidli uchuvchan suyuqlik hosil bo\'ladi.',
      equipment: ['Haydash apparati', 'Termometr'],
      scaleNote: 'Dietil efir juda tez alangalanadi — ochiq olov yonida ishlash mumkin emas.',
    },
    {
      equation: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑',
      name: 'Spirtning natriy bilan reaksiyasi',
      description:
        'Spirt kuchsiz kislota sifatida ishlaydi. Suv bilan solishtirilganda ' +
        'reaksiya ancha sekin — spirt suvdan kuchsizroq kislota.',
      reactionType: 'o\'rin olish',
      temperature: 'xona harorati',
      observations: 'Gaz pufakchalari sekin ajraladi, natriy asta eriydi.',
      scale: 'laboratoriya',
      techniques: ['Quruq sharoitda ishlash'],
    },
    {
      equation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
      name: 'Eterifikatsiya — sirka-etil efiri',
      description:
        'Qaytar reaksiya: mahsulot bilan reagent muvozanatda turadi. Unumni ' +
        'oshirish uchun suvni ajratib olish yoki reagentlardan birini ortiqcha berish kerak.',
      reactionType: 'eterifikatsiya (qaytar)',
      catalyst: 'konsentrlangan H₂SO₄',
      temperature: '60–80 °C',
      mechanism:
        'Kislota karboksil guruhini protonlaydi, spirt kislorodi unga hujum qiladi, ' +
        'so\'ng suv ajraladi. Muhim: efirdagi kislorod SPIRTdan keladi — bu izotop ' +
        'tajribasi bilan isbotlangan.',
      rateFactors: [
        { factor: 'Suvni ajratib olish', effect: 'Muvozanat efir tomonga siljiydi' },
        { factor: 'Ortiqcha spirt', effect: 'Unum ortadi' },
        { factor: 'Kislota katalizatori', effect: 'Reaksiyani o\'n barobarlab tezlashtiradi' },
      ],
      observations: 'Yoqimli meva hidi paydo bo\'ladi.',
      techniques: ['Qaytar sovutgich', 'Suvni ajratish (Din-Stark)'],
      equipment: ['Qaytar sovutgich', 'Kolba', 'Suv hammomi'],
      yieldInfo: 'Muvozanatda ~67%; suvni ajratsa 95% gacha',
      scaleNote: 'Meva hidli efirlar oziq-ovqat va parfyumeriyada ishlatiladi.',
    },
    {
      equation: 'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH',
      name: 'Efirning ishqoriy gidrolizi',
      description:
        'Kislotali gidrolizdan farqi: bu qaytmas. Ishqor hosil bo\'lgan kislotani ' +
        'tuzga aylantiradi va teskari reaksiyaga imkon qolmaydi.',
      reactionType: 'gidroliz',
      temperature: 'qaynatib',
      environment: 'ishqoriy suvli muhit',
      observations: 'Efir hidi yo\'qoladi.',
      techniques: ['Qaytar sovutgich ostida qaynatish'],
    },
    {
      equation: '(C₁₇H₃₅COO)₃C₃H₅ + 3NaOH → 3C₁₇H₃₅COONa + C₃H₅(OH)₃',
      name: 'Sovunlanish — yog\'dan sovun olish',
      description:
        'Yog\' (stearin trigliseridi) ishqor bilan qaynatilganda sovun va glitserin ' +
        'beradi. Insoniyat ming yillar davomida qo\'llagan reaksiya.',
      reactionType: 'gidroliz (sovunlanish)',
      temperature: '90–100 °C',
      environment: 'ishqoriy suvli muhit',
      observations:
        'Aralashma quyuqlashadi, sovutilganda qattiq massa hosil bo\'ladi. ' +
        'Osh tuzi qo\'shilsa sovun ajralib yuzaga chiqadi.',
      techniques: ['Uzoq qaynatish', 'Tuzlab ajratish (visolash)'],
      equipment: ['Chinni kosacha', 'Suv hammomi', 'Aralashtirgich'],
      scale: 'ikkalasi',
      scaleNote: 'Glitserin — qimmatli qo\'shimcha mahsulot, kosmetika va dorishunoslikda.',
    },
    {
      equation: '2C₂H₅OH + O₂ → 2CH₃CHO + 2H₂O',
      name: 'Spirtning aldegidgacha oksidlanishi',
      description:
        'Birlamchi spirt aldegid beradi. Mis katalizatori qizdirilib spirt bug\'i ' +
        'o\'tkaziladi — qora CuO qizil misga aylanib turadi.',
      reactionType: 'oksidlanish',
      catalyst: 'Cu',
      temperature: '300 °C',
      environment: 'gaz fazasi',
      observations:
        'Qizdirilgan mis sim spirt bug\'ida qizaradi, o\'tkir hidli aldegid hosil bo\'ladi.',
      techniques: ['Katalitik oksidlash'],
      equipment: ['Mis spiral', 'Spirtovka'],
    },
    {
      equation: 'CH₃CHO + H₂ → C₂H₅OH',
      name: 'Aldegidning qaytarilishi',
      description: 'Teskari yo\'nalish: aldegiddan birlamchi spirt olinadi.',
      reactionType: 'qaytarilish',
      catalyst: 'Ni',
      temperature: '100–150 °C',
      pressure: '5–20 atm',
    },
    {
      equation: 'CH₃CHO + 2Cu(OH)₂ → CH₃COOH + Cu₂O↓ + 2H₂O',
      name: 'Aldegidga sifat reaksiyasi — mis (I) oksidi',
      description:
        'Aldegid ko\'k mis gidroksidni g\'ishtrang cho\'kmagacha qaytaradi. ' +
        'Ketonlar bunday qilmaydi — shu bilan ularni ajratish mumkin.',
      reactionType: 'oksidlanish (sifat reaksiyasi)',
      temperature: 'qizdirib (qaynatish)',
      environment: 'ishqoriy muhit',
      observations:
        'Ko\'k cho\'kma avval sarg\'ayadi, keyin g\'ishtrang-qizil bo\'lib cho\'kadi.',
      techniques: ['Sifat reaksiyasi', 'Suv hammomida qizdirish'],
      equipment: ['Probirka', 'Suv hammomi'],
      scale: 'laboratoriya',
    },
    {
      equation: 'CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag↓ + 3NH₃ + H₂O',
      name: '"Kumush ko\'zgu" reaksiyasi',
      description:
        'Aldegid kumush ionini metall kumushgacha qaytaradi. Probirka devorida ' +
        'yaltiroq ko\'zgu hosil bo\'ladi — eng chiroyli sifat reaksiyalaridan.',
      reactionType: 'oksidlanish (sifat reaksiyasi)',
      temperature: '60–80 °C (suv hammomi)',
      environment: 'ammiakli ishqoriy muhit',
      observations: 'Probirka devori kumush qatlam bilan qoplanadi.',
      rateFactors: [
        { factor: 'Idish tozaligi', effect: 'Devor toza bo\'lmasa ko\'zgu emas, kulrang cho\'kma tushadi' },
        { factor: 'Sekin qizdirish', effect: 'Qaynatib yuborilsa ko\'zgu hosil bo\'lmaydi' },
      ],
      techniques: ['Suv hammomida ehtiyotkorona qizdirish'],
      equipment: ['Toza probirka', 'Suv hammomi'],
      scale: 'laboratoriya',
      scaleNote: 'Sanoatda oynaga kumush qoplashda shu tamoyil ishlatilgan.',
    },
    {
      equation: '2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑',
      name: 'Karbon kislotaning metall bilan reaksiyasi',
      description:
        'Organik kislota ham noorganik kislota kabi metall bilan vodorod ajratadi — ' +
        'faqat ancha sekin, chunki u kuchsiz kislota.',
      reactionType: 'o\'rin olish',
      temperature: 'xona harorati',
      observations: 'Sekin gaz pufakchalari.',
      scale: 'laboratoriya',
    },
    {
      equation: 'CH₃COOH + NH₃ → CH₃COONH₄',
      name: 'Ammoniy asetat olinishi',
      description: 'Kislota va ammiakdan tuz — neytrallanishning organik varianti.',
      reactionType: 'neytrallanish',
      environment: 'suvli eritma',
    },
    {
      equation: '2CH₃COOH → (CH₃CO)₂O + H₂O',
      name: 'Sirka angidridi olinishi',
      description:
        'Ikki kislota molekulasidan suv ajralib angidrid hosil bo\'ladi. ' +
        'Angidrid — atsetillash reaksiyalarida kuchli reagent.',
      reactionType: 'suvsizlanish',
      catalyst: 'P₂O₅ (suv tortuvchi)',
      temperature: '700–800 °C (sanoat usulida keten orqali)',
      scale: 'sanoat',
      scaleNote: 'Aspirin va sellyuloza atsetat ishlab chiqarishda ishlatiladi.',
    },
    {
      equation: 'CH₃COOH + PCl₅ → CH₃COCl + POCl₃ + HCl',
      name: 'Kislota xlorangidridi olinishi',
      description:
        'OH guruhi xlorga almashadi. Hosil bo\'lgan xlorangidrid juda faol — ' +
        'sintezda oraliq reagent sifatida ishlatiladi.',
      reactionType: 'o\'rin olish',
      temperature: 'xona harorati',
      environment: 'suvsiz muhit',
      observations: 'HCl gazi ajraladi, aralashma isiydi.',
      equipment: ['Mo\'rili shkaf', 'Quruq kolba'],
    },
    {
      equation: 'HCOOH → CO↑ + H₂O',
      name: 'Chumoli kislotaning parchalanishi',
      description:
        'Laboratoriyada is gazi olishning usuli. Chumoli kislota o\'ziga xos: ' +
        'tarkibida aldegid guruhi ham bor, shuning uchun kumush ko\'zgu beradi.',
      reactionType: 'parchalanish',
      catalyst: 'konsentrlangan H₂SO₄ (suv tortuvchi)',
      temperature: 'qizdirilganda',
      observations: 'Rangsiz, zaharli gaz ajraladi.',
      equipment: ['Mo\'rili shkaf'],
      scale: 'laboratoriya',
    },
    {
      equation: 'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr',
      name: 'Fenolga sifat reaksiyasi — tribromfenol',
      description:
        'Benzoldan farqli o\'laroq fenol katalizatorsiz va darhol uch joyga brom ' +
        'biriktiradi: OH guruhi halqani kuchli faollashtiradi.',
      reactionType: 'elektrofil o\'rin olish',
      temperature: 'xona harorati',
      environment: 'bromli suv',
      observations: 'Bromli suv rangsizlanadi va oq cho\'kma tushadi.',
      techniques: ['Sifat reaksiyasi'],
      equipment: ['Probirka'],
      scale: 'laboratoriya',
    },
    {
      equation: 'C₆H₅OH + 3HNO₃ → C₆H₂(NO₂)₃OH + 3H₂O',
      name: 'Pikrin kislota olinishi',
      description:
        'Fenolning nitrolanishi ham oson boradi. Mahsulot sariq, achchiq va ' +
        'portlovchi modda.',
      reactionType: 'elektrofil o\'rin olish',
      catalyst: 'H₂SO₄',
      temperature: '50–100 °C',
      observations: 'Sariq kristallar hosil bo\'ladi.',
      equipment: ['Mo\'rili shkaf'],
    },
    {
      equation: 'C₆H₅OH + NaOH → C₆H₅ONa + H₂O',
      name: 'Fenolning ishqorda erishi',
      description:
        'Fenol kuchsiz kislota — spirtlardan farqli o\'laroq ishqor bilan tuz ' +
        'hosil qiladi. Shu sababli "karbol kislota" deb atalgan.',
      reactionType: 'neytrallanish',
      environment: 'suvli eritma',
      observations: 'Suvda yomon eriydigan fenol ishqorda to\'liq eriydi.',
    },
    {
      equation: 'C₆H₅NO₂ + 3H₂ → C₆H₅NH₂ + 2H₂O',
      name: 'Zinin reaksiyasi — anilin olinishi',
      description:
        'Nitrobenzol qaytarilib anilin beradi. Anilin — sintetik bo\'yoqlar ' +
        'sanoatining boshlanish nuqtasi bo\'lgan modda.',
      reactionType: 'qaytarilish',
      catalyst: 'Ni yoki Cu (sanoatda), Fe + HCl (laboratoriyada)',
      temperature: '200–300 °C (katalitik usulda)',
      pressure: '10–30 atm',
      scale: 'sanoat',
      scaleNote:
        'N. N. Zinin 1842-yilda nitrobenzolni qaytarish usulini topgan — sintetik ' +
        'bo\'yoqlar sanoati shundan boshlangan.',
    },
    {
      equation: 'C₆H₅NH₂ + HCl → C₆H₅NH₃Cl',
      name: 'Anilinning tuz hosil qilishi',
      description:
        'Aminlar asos xossasiga ega — kislota bilan tuz beradi. Anilin ammiakdan ' +
        'kuchsizroq asos, chunki azotning elektron jufti halqaga tortiladi.',
      reactionType: 'neytrallanish',
      environment: 'suvli eritma',
      observations: 'Suvda erimaydigan anilin kislotada to\'liq eriydi.',
    },
    {
      equation: 'CH₃NH₂ + HCl → CH₃NH₃Cl',
      name: 'Metilaminning tuzi',
      description:
        'Alkil aminlar ammiakdan kuchliroq asos — alkil guruhi azotga elektron ' +
        'zichligini beradi.',
      reactionType: 'neytrallanish',
      observations: 'Oq tutun (gaz holida qo\'shilsa).',
    },
    {
      equation: 'C₂H₅Br + NaOH → C₂H₅OH + NaBr',
      name: 'Galogenalkanning suvli ishqorda gidrolizi',
      description:
        'Suvli eritmada OH⁻ nukleofil sifatida ishlaydi va spirt hosil bo\'ladi. ' +
        'Erituvchi mahsulotni belgilaydigan klassik misol.',
      reactionType: 'nukleofil o\'rin olish',
      temperature: 'qaynatib',
      environment: 'suvli eritma',
      solvents: [
        { name: 'Suv', efficiency: 'yuqori — spirt beradi' },
        { name: 'Etanol', efficiency: 'boshqa mahsulot — alken beradi' },
      ],
      bestSolvent: 'Suv',
      solventEffect:
        'Suvda OH⁻ nukleofil bo\'lib uglerodga hujum qiladi. Spirtli eritmada esa ' +
        'u asos sifatida protonni tortadi va alken hosil bo\'ladi.',
      techniques: ['Qaytar sovutgich ostida qaynatish'],
    },
    {
      equation: 'C₂H₅Br + KOH → C₂H₄ + KBr + H₂O',
      name: 'Galogenalkandan alken olish (spirtli ishqorda)',
      description:
        'Xuddi shu reagentlar, lekin erituvchi spirt — mahsulot butunlay boshqa. ' +
        'Bu yerda eliminatsiya boradi.',
      reactionType: 'eliminatsiya',
      temperature: 'qaynatib',
      environment: 'spirtli ishqor eritmasi',
      observations: 'Gaz ajraladi, bromli suvni rangsizlantiradi.',
      techniques: ['Qaytar sovutgich', 'Gaz to\'plash'],
    },
    {
      equation: 'C₂H₅Br + KCN → C₂H₅CN + KBr',
      name: 'Nitril olinishi — zanjirni uzaytirish',
      description:
        'Sianid ioni nukleofil sifatida kirib, uglerod zanjirini bir atomga ' +
        'uzaytiradi. Organik sintezda muhim usul.',
      reactionType: 'nukleofil o\'rin olish',
      temperature: 'qaynatib',
      environment: 'spirtli eritma',
      equipment: ['Mo\'rili shkaf', 'Qaytar sovutgich'],
      scaleNote: 'Sianid tuzlari o\'ta zaharli — faqat maxsus sharoitda ishlatiladi.',
    },
    {
      equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑',
      name: 'Karbon kislotaga sifat reaksiyasi',
      description:
        'Karbon kislotalar sodadan CO₂ ni siqib chiqaradi, fenol esa yo\'q — ' +
        'shu bilan ikkalasini farqlash mumkin.',
      reactionType: 'gaz ajralishi bilan almashinish',
      observations: 'Gaz pufakchalari — kislota borligining belgisi.',
      techniques: ['Sifat reaksiyasi'],
      scale: 'laboratoriya',
    },
  ],
}
