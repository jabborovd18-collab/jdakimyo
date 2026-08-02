// data/laboratoriya/texnikalar.js
//
// Laboratoriya texnikalari — foydalanuvchi o'rganadigan ish usullari.
//
// Manba — reaksiyalardagi `techniques` maydoni (249 tadan 120 tasida
// to'ldirilgan, 69 ta xom qiymat). Xom ro'yxatning yarmidan ko'pi bitta
// usulning turli yozilishi:
//
//   Titrlash ← yodometrik, argentometrik, permanganatometrik, dixromato-
//              metrik, isitib titrlash — hammasi titrlashning turlari
//   Qizdirish ← quruq holda, gaz oqimida, suv hammomida, ehtiyotkorona...
//   Gaz to'plash ← suv ustida, og'zi pastga qaratib, gaz olish, gaz ajratish
//
// Shuning uchun kanonik ro'yxat qo'lda tuzilgan. `xom` maydoni qaysi xom
// qiymatlar shu texnikaga tegishli ekanini ko'rsatadi.
//
// `daraja` — texnikani ochish uchun kerak bo'ladigan laboratoriya darajasi.
// Oddiy usullar boshidan ochiq, murakkabi keyin keladi.
//
// Oltita xom qiymat ataylab kiritilmagan, chunki ular texnika emas:
//
//   "Suvda" (6), "Qattiq" (2), "Issiq" (1)  — muhit yoki modda holati
//   "Redoks" (1)                            — reaksiya turi
//   "Qaytar tajriba" (1)                    — reaksiyaning xossasi
//   "Reagentni ishlatishdan oldin tayyorlash" (1) — umumiy eslatma
//
// Shu sababli qamrov 69 dan 63 ta (ishlatish bo'yicha 93%). Qolgan
// ma'lumot yo'qolmaydi — u reaksiyaning `environment` va `reactionType`
// maydonlarida baribir bor.

module.exports = [
  {
    kalit: 'qizdirish', nom: 'Qizdirish', daraja: 1, uchraydi: 15, icon: '🔥',
    jihoz: ['spirtovka'],
    tavsif: 'Reaksiyani tezlatish yoki umuman boshlash uchun issiqlik berish.',
    xom: ['Qizdirish', 'Quruq holda qizdirish', 'Gaz oqimida qizdirish',
      'Quruq aralashmani qizdirish', 'Qizdirib gaz to\'plash', 'Uzoq qaynatish'],
  },
  {
    kalit: 'chokitirish', nom: 'Cho\'ktirish', daraja: 1, uchraydi: 21, icon: '🌧️',
    jihoz: ['probirka', 'tomizgich'],
    tavsif: 'Erimaydigan modda hosil qilib, uni eritmadan tushirish.',
    xom: ['Cho\'ktirish', 'Cho\'kmani ajratish', 'Cho\'kmani ortiqcha reagentda eritish',
      'Ortiqcha reagent qo\'shish'],
  },
  {
    kalit: 'filtrlash', nom: 'Filtrlash', daraja: 1, uchraydi: 21, icon: '🔻',
    jihoz: ['voronka', 'filtr-qogozi'],
    tavsif: 'Cho\'kmani eritmadan ajratish. Cho\'ktirishdan keyingi tabiiy qadam.',
    xom: ['Filtrlash'],
  },
  {
    kalit: 'sifat-tahlili', nom: 'Sifat tahlili', daraja: 1, uchraydi: 13, icon: '🔎',
    jihoz: ['probirka', 'tomizgich'],
    tavsif: 'Modda tarkibida qaysi ion borligini aniqlash — rang, cho\'kma yoki gaz bo\'yicha.',
    xom: ['Sifat tahlili', 'Sifat reaksiyasi', 'Gazlarni aniqlash', 'Gazni aniqlash',
      'Ohakli suv bilan aniqlash', 'Ohakli suv bilan tasdiqlash',
      'Gazni indikator qog\'ozi bilan aniqlash', 'Kationlarni ajratish',
      'Indikator qo\'shish'],
  },
  {
    kalit: 'gaz-toplash', nom: 'Gaz to\'plash', daraja: 2, uchraydi: 4, icon: '🫧',
    jihoz: ['gaz-naycha'],
    tavsif: 'Ajralgan gazni yig\'ish. Usuli gazning zichligi va suvda eruvchanligiga bog\'liq.',
    xom: ['Gaz to\'plash', 'Suv ustida gaz to\'plash', 'Gazni og\'zi pastga qaratib to\'plash',
      'Gaz olish', 'Gaz ajratish', 'Kipp apparatida olish'],
  },
  {
    kalit: 'morili-shkafda-ishlash', nom: 'Mo\'rili shkafda ishlash', daraja: 2, uchraydi: 4, icon: '🚪',
    jihoz: ['morili-shkaf'],
    tavsif: 'Zaharli gaz ajraladigan ishni so\'rgichli shkaf ostida bajarish.',
    xom: ['So\'rgichli shkafda ishlash', 'Himoya ekrani orqasida ishlash', 'Quruq sharoitda ishlash'],
  },
  {
    kalit: 'bugllatish', nom: 'Bug\'latish', daraja: 2, uchraydi: 1, icon: '💨',
    jihoz: ['chinni-kosacha', 'spirtovka'],
    tavsif: 'Erituvchini uchirib, erigan moddani qoldirish.',
    xom: ['Bug\'latish', 'Quritish'],
  },
  {
    kalit: 'kristallash', nom: 'Kristallash', daraja: 2, uchraydi: 3, icon: '💠',
    jihoz: ['kristallizator'],
    tavsif: 'Sekin sovitib yoki bug\'latib toza kristall olish. Qayta kristallash — tozalash usuli.',
    xom: ['Kristallash', 'Qayta kristallash', 'Kristall o\'stirish'],
  },
  {
    kalit: 'titrlash', nom: 'Titrlash', daraja: 3, uchraydi: 4, icon: '📏',
    jihoz: ['byuretka', 'konussimon-kolba'],
    tavsif: 'Nomalum konsentratsiyani ma\'lum eritma bilan aniqlash. Miqdoriy tahlilning asosi.',
    xom: ['Titrlash', 'Yodometrik titrlash', 'Argentometrik titrlash (Mor usuli)',
      'Permanganatometriya', 'Permanganatometrik titrlash', 'Dixromatometriya',
      'Isitib titrlash'],
  },
  {
    kalit: 'qaytar-sovutgichda-qaynatish', nom: 'Qaytar sovutgichda qaynatish', daraja: 3, uchraydi: 6, icon: '🌀',
    jihoz: ['qaytar-sovutgich', 'dumaloq-tubli-kolba'],
    tavsif: 'Uzoq qaynatishda bug\' sovib kolbaga qaytadi — modda yo\'qolmaydi.',
    xom: ['Qaytar sovutgich', 'Qaytar sovutgich ostida qizdirish', 'Qaytar sovutgich ostida qaynatish'],
  },
  {
    kalit: 'suv-hammomida-qizdirish', nom: 'Suv hammomida qizdirish', daraja: 2, uchraydi: 2, icon: '♨️',
    jihoz: ['suv-hammomi'],
    tavsif: '100 °C dan oshmaydigan yumshoq isitish — kuyib ketadigan moddalar uchun.',
    xom: ['Suv hammomida qizdirish', 'Suv hammomida ehtiyotkorona qizdirish'],
  },
  {
    kalit: 'haydash', nom: 'Haydash', daraja: 3, uchraydi: 2, icon: '⚙️',
    jihoz: ['haydash-apparati'],
    tavsif: 'Qaynash haroratining farqidan foydalanib suyuqliklarni ajratish.',
    xom: ['Haydash', 'Suvni ajratish (Din-Stark)'],
  },
  {
    kalit: 'sublimatsiya', nom: 'Sublimatsiya', daraja: 3, uchraydi: 1, icon: '❄️',
    jihoz: ['spirtovka'],
    tavsif: 'Qattiq moddaning suyuqlikka aylanmay to\'g\'ridan-to\'g\'ri bug\'ga o\'tishi.',
    xom: ['Sublimatsiya'],
  },
  {
    kalit: 'elektroliz', nom: 'Elektroliz', daraja: 4, uchraydi: 3, icon: '⚡',
    jihoz: ['hofman-apparati'],
    tavsif: 'Elektr toki bilan moddani parchalash.',
    xom: ['Elektroliz', 'Suyuq holda elektroliz'],
  },
  {
    kalit: 'metallni-botirish', nom: 'Metallni eritmaga botirish', daraja: 2, uchraydi: 1, icon: '🔗',
    jihoz: ['metall-namuna', 'stakan'],
    tavsif: 'Faolroq metall kamroq faol metallni tuzidan siqib chiqaradi.',
    xom: ['Metall plastinkani eritmaga botirish'],
  },
  {
    kalit: 'kolorimetriya', nom: 'Kolorimetriya', daraja: 3, uchraydi: 1, icon: '🎨',
    jihoz: ['probirka'],
    tavsif: 'Eritma rangining to\'qligiga qarab konsentratsiyani baholash.',
    xom: ['Kolorimetriya'],
  },
  {
    kalit: 'ph-metriya', nom: 'pH-metriya', daraja: 3, uchraydi: 1, icon: '📟',
    jihoz: ['ph-metr'],
    tavsif: 'Muhit kislotaliligini raqamli o\'lchash.',
    xom: ['pH-metriya'],
  },
  {
    kalit: 'kalorimetriya', nom: 'Kalorimetriya', daraja: 4, uchraydi: 2, icon: '🧨',
    jihoz: ['kalorimetrik-bomba'],
    tavsif: 'Reaksiyada ajralgan yoki yutilgan issiqlikni o\'lchash.',
    xom: ['Kalorimetriya', 'Kalorimetrik bomba'],
  },
  {
    kalit: 'tuzlab-ajratish', nom: 'Tuzlab ajratish', daraja: 3, uchraydi: 1, icon: '🧂',
    jihoz: ['stakan'],
    tavsif: 'Visolash — tuz qo\'shib organik moddani suvli qatlamdan chiqarish.',
    xom: ['Tuzlab ajratish (visolash)'],
  },

  // ─────────────── SANOAT USULLARI ───────────────
  {
    kalit: 'katalitik-oksidlash', nom: 'Katalitik oksidlash', daraja: 5, uchraydi: 3, icon: '🏗️',
    jihoz: ['kontakt-apparati'], sanoat: true,
    tavsif: 'Katalizator yuzasida gaz fazadagi oksidlanish — sanoat sintezining asosi.',
    xom: ['Katalitik oksidlanish', 'Katalitik oksidlash', 'Katalitik sintez'],
  },
  {
    kalit: 'absorbsiya', nom: 'Absorbsiya', daraja: 5, uchraydi: 2, icon: '🗼',
    jihoz: ['absorbsion-minora'], sanoat: true,
    tavsif: 'Gazni suyuqlikka yutdirish. Oleum orqali yutdirish — sulfat kislota olishning oxirgi bosqichi.',
    xom: ['Absorbsiya', 'Oleum orqali yutdirish'],
  },
  {
    kalit: 'aylanma-sikl', nom: 'Aylanma sikl', daraja: 5, uchraydi: 2, icon: '🔄',
    jihoz: ['issiqlik-almashtirgich'], sanoat: true,
    tavsif: 'Reaksiyaga kirmagan moddani qaytarib ishlatish — sanoatning tejamkorligi shunda.',
    xom: ['Aylanma sikl', 'Ammiakni regeneratsiya qilish'],
  },
]
