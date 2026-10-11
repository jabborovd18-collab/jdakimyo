// data/doska/adsorbsiya-savollar.js
//
// KK_M4 — Adsorbsiya jarayonlari va izotermalari bo'yicha 80 ta test savollari.
// Manba: Bahora Nayimova ma'ruza slaydlari (KK_M4.pdf).
// Test tuzuvchisi: @diyorbek_jabborov
//
// Darajalar:
//   1 = Oson (nazariya va asosiy tushunchalar) -> 5 ball
//   2 = O'rta (formulalar va bog'liqliklar) -> 10 ball
//   3 = Murakkab (hisob-kitob va modellar) -> 15 ball
export const ADSORBSIYA_SAVOLLARI = [
  {
    "id": 1,
    "savol": "Adsorbsiya nima?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Moddaning yutuvchi fazaning butun hajmiga bir tekis tarqalishi",
      "Moddaning fazalar chegarasidagi sirt qatlamida to'planishi",
      "Erituvchining qaynab, bug'ga aylanishi",
      "Eritilgan moddaning kristall holatda cho'kishi"
    ],
    "togriJavob": 1,
    "slayd": "3",
    "izoh": "Adsorbsiya fazalararo sirtda modda konsentratsiyasining ortishi bilan bog'liq.",
    "daraja": 1
  },
  {
    "id": 2,
    "savol": "Absorbsiya adsorbsiyadan qanday farq qiladi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Yutilgan modda yutuvchi fazaning butun hajmiga tarqaladi",
      "Yutilgan modda faqat sirtning bitta nuqtasida qoladi",
      "Faqat adsorbentning tashqi sirtida sodir bo'ladi",
      "Har doim ionlarning ekvivalent almashinishidan iborat bo'ladi"
    ],
    "togriJavob": 0,
    "slayd": "3",
    "izoh": "Absorbsiya hajmiy, adsorbsiya esa sirt hodisasidir.",
    "daraja": 1
  },
  {
    "id": 3,
    "savol": "Adsorbent deb nimaga aytiladi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Adsorbsiya boshlanishidan oldingi yutiluvchi moddaga",
      "Sirtdan ajralib chiqayotgan moddaga",
      "O'z sirtida boshqa modda zarrachalarini tutib qoluvchi moddaga",
      "Adsorbsiyaning tezligini o'lchovchi asbobga"
    ],
    "togriJavob": 2,
    "slayd": "4",
    "izoh": "Adsorbent yutuvchi sirtga ega bo'lgan moddadir.",
    "daraja": 1
  },
  {
    "id": 4,
    "savol": "Adsorbat nima?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Eritmaning umumiy hajmi",
      "Adsorbentning g'ovaklari orasidagi bo'shliq",
      "Adsorbsiya sodir bo'ladigan idish",
      "Adsorbent sirtida adsorbsiyalangan modda"
    ],
    "togriJavob": 3,
    "slayd": "4",
    "izoh": "Adsorbat — adsorbent sirtida to'plangan modda.",
    "daraja": 1
  },
  {
    "id": 5,
    "savol": "Adsorbtiv atamasi qaysi moddaga nisbatan ishlatiladi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Adsorbsiyalanishidan oldingi yutiluvchi moddaga",
      "Faqat kimyoviy bog' hosil qilgan sirt markaziga",
      "Adsorbentning erimaydigan qismiga",
      "Adsorbsiyadan keyingi adsorbent massasiga"
    ],
    "togriJavob": 0,
    "slayd": "4",
    "izoh": "Yutiluvchi modda sirtga birikishidan oldin adsorbtiv deb ataladi.",
    "daraja": 1
  },
  {
    "id": 6,
    "savol": "Desorbsiya qanday jarayon?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Adsorbent sirtida yangi g'ovaklar hosil bo'lishi",
      "Adsorbentning maydalab kukunga aylantirilishi",
      "Adsorbatning adsorbent sirtidan ajralib chiqishi",
      "Eritilgan moddaning qattiq cho'kmaga aylanishi"
    ],
    "togriJavob": 2,
    "slayd": "4",
    "izoh": "Desorbsiya adsorbsiyaga teskari jarayondir.",
    "daraja": 1
  },
  {
    "id": 7,
    "savol": "Adsorbsiya natijasida sirtning erkin energiyasi odatda qanday o'zgaradi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Har doim ortadi",
      "Kamayadi",
      "Har doim nolga teng bo'lib qoladi",
      "Sirt energiyasi adsorbsiya bilan bog'liq emas"
    ],
    "togriJavob": 1,
    "slayd": "5",
    "izoh": "Sirtda zarrachalarning to'planishi sirt erkin energiyasini kamaytirishi mumkin.",
    "daraja": 1
  },
  {
    "id": 8,
    "savol": "Jarayonning o'z-o'zidan borishi uchun Gibbs energiyasi o'zgarishining ishorasi qanday bo'lishi kerak?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "ΔG > 0",
      "ΔG = +1",
      "ΔG har doim ΔH ga teng bo'lishi kerak",
      "ΔG < 0"
    ],
    "togriJavob": 3,
    "slayd": "5, 33",
    "izoh": "Berilgan sharoitda ΔG < 0 jarayonning termodinamik jihatdan o'z-o'zidan borishini bildiradi.",
    "daraja": 1
  },
  {
    "id": 9,
    "savol": "Adsorbsiya miqdori a = n_ads / m ifodasida m nimani bildiradi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Adsorbatning molyar massasini",
      "Adsorbent massasini",
      "Eritmaning umumiy hajmini",
      "Adsorbsiyalangan moddaning mol sonini"
    ],
    "togriJavob": 1,
    "slayd": "4, 13",
    "izoh": "Adsorbsiyalangan modda miqdori adsorbent massasiga bo'linadi.",
    "daraja": 2
  },
  {
    "id": 10,
    "savol": "Adsorbsiyalangan modda mol bilan, adsorbent massasi gramm bilan berilsa, a ning birligi qanday bo'ladi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "mol/g",
      "g/mol",
      "mol/L",
      "m²/g"
    ],
    "togriJavob": 0,
    "slayd": "13",
    "izoh": "a = n_ads / m bo'lgani uchun birlik mol/g bo'ladi.",
    "daraja": 2
  },
  {
    "id": 11,
    "savol": "Fizik adsorbsiyada zarrachalarni sirtda asosan qaysi kuchlar tutib turadi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Kovalent kimyoviy bog'lar",
      "Ionlarning ekvivalent almashinuvi",
      "Van-der-Vaals kuchlari",
      "Kristall panjaraning to'liq parchalanishi"
    ],
    "togriJavob": 2,
    "slayd": "7",
    "izoh": "Fizik adsorbsiyaning asosini molekulalararo kuchlar tashkil etadi.",
    "daraja": 1
  },
  {
    "id": 12,
    "savol": "Fizik adsorbsiyaga qaysi xususiyat xos?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Har doim faqat bitta qatlam hosil qiladi",
      "Faqat yuqori haroratda sodir bo'ladi",
      "Adsorbat albatta yangi kimyoviy modda hosil qiladi",
      "Ko'p qatlamli adsorbsiya yuz berishi mumkin"
    ],
    "togriJavob": 3,
    "slayd": "7, 9",
    "izoh": "Fizik adsorbsiyada monoqavatdan keyin qo'shimcha qatlamlar hosil bo'lishi mumkin.",
    "daraja": 1
  },
  {
    "id": 13,
    "savol": "Xemosorbsiya qaysi jarayon hisobiga yuz beradi?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Adsorbat bilan sirtning faol markazlari o'rtasida kimyoviy bog'lar hosil bo'lishi",
      "Gazning adsorbent atrofida siqilishi",
      "Adsorbentning mexanik maydalanganligi",
      "Adsorbatning erituvchida bir tekis tarqalishi"
    ],
    "togriJavob": 0,
    "slayd": "8",
    "izoh": "Xemosorbsiya — kimyoviy adsorbsiya.",
    "daraja": 1
  },
  {
    "id": 14,
    "savol": "Fizik va kimyoviy adsorbsiyaning selektivligini taqqoslaganda qaysi fikr to'g'ri?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Fizik adsorbsiya doimo mutlaq selektiv bo'ladi",
      "Kimyoviy adsorbsiya odatda ko'proq selektiv bo'ladi",
      "Ikkalasida ham selektivlik bo'lishi mumkin emas",
      "Selektivlik faqat adsorbent massasiga bog'liq"
    ],
    "togriJavob": 1,
    "slayd": "9",
    "izoh": "Kimyoviy bog' hosil bo'lishi muayyan modda va sirt markazining mosligini talab qiladi.",
    "daraja": 1
  },
  {
    "id": 15,
    "savol": "Kimyoviy adsorbsiya tezligining harorat oshganda ortishi nimaga bog'liq bo'lishi mumkin?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Har qanday adsorbsiya albatta endotermik bo'lishiga",
      "Adsorbent massasi harorat bilan cheksiz ortishiga",
      "Sirt markazlari sonining cheksiz ko'payishiga",
      "Jarayon uchun aktivlanish energiyasi talab qilinishiga"
    ],
    "togriJavob": 3,
    "slayd": "8, 34",
    "izoh": "Harorat ortishi aktivlanish to'sig'ini yengishni tezlashtirishi mumkin; bu muvozanat sig'imi ortadi degani emas.",
    "daraja": 2
  },
  {
    "id": 16,
    "savol": "Kapillyar kondensatsiya nima?",
    "bolim": "ADSORBSIYANING ASOSIY TUSHUNCHALARI",
    "variantlar": [
      "Erituvchining qattiq kristallarga aylanishi",
      "Ionlarning adsorbentdan ekvivalent miqdorda chiqishi",
      "Bug'ning g'ovaklarda kondensatsiyalanishi",
      "Adsorbentning yuqori haroratda yonishi"
    ],
    "togriJavob": 2,
    "slayd": "6, 12",
    "izoh": "Kapillyar kondensatsiya adsorbent g'ovaklarida suyuq faza hosil bo'lishi bilan bog'liq.",
    "daraja": 1
  },
  {
    "id": 17,
    "savol": "Qaysi adsorbent molekulyar elak sifatida tavsiflanadi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Faollashtirilgan ko'mir",
      "Seolit",
      "Silikagel",
      "Ionit"
    ],
    "togriJavob": 1,
    "slayd": "10",
    "izoh": "Seolitning selektiv g'ovaklari molekulalarni ajratishda ishlatiladi.",
    "daraja": 1
  },
  {
    "id": 18,
    "savol": "Namlikni yutish va quritishda ishlatiladigan, qutbli sirtga ega adsorbent qaysi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Silikagel",
      "Kationit",
      "Anionit",
      "Xromatografiyaning harakatchan fazasi"
    ],
    "togriJavob": 0,
    "slayd": "10",
    "izoh": "Silikagel qutbli sirtga ega bo'lib, namlikni yutishda qo'llanadi.",
    "daraja": 1
  },
  {
    "id": 19,
    "savol": "Faollashtirilgan ko'mirning adsorbent sifatidagi muhim xususiyati qaysi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Ion almashinish guruhlari bilan suvni yumshatishi",
      "Faqat tashqi sirtining mavjudligi",
      "Katta solishtirma sirt va mikrog'ovaklarga ega bo'lishi",
      "Har doim g'ovaksiz tuzilishga ega bo'lishi"
    ],
    "togriJavob": 2,
    "slayd": "10",
    "izoh": "Rivojlangan sirt va mikrog'ovaklar uning adsorbsion imkoniyatini oshiradi.",
    "daraja": 1
  },
  {
    "id": 20,
    "savol": "Suvni yumshatishda ion almashinish guruhlari hisobiga ishlaydigan adsorbent qaysi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Silikagel",
      "Faollashtirilgan ko'mir",
      "Alumogel",
      "Ionit"
    ],
    "togriJavob": 3,
    "slayd": "10, 37",
    "izoh": "Ionitlar ion almashinish orqali suvni yumshatishda ishlatiladi.",
    "daraja": 1
  },
  {
    "id": 21,
    "savol": "Solishtirma sirt qanday aniqlanadi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Adsorbent massasi uning sirt maydoniga bo'linadi",
      "Adsorbent sirt maydoni uning massasiga bo'linadi",
      "G'ovak hajmi eritma konsentratsiyasiga bo'linadi",
      "Adsorbatning molyar massasi uning miqdoriga bo'linadi"
    ],
    "togriJavob": 1,
    "slayd": "11",
    "izoh": "S_solishtirma = A / m.",
    "daraja": 2
  },
  {
    "id": 22,
    "savol": "Solishtirma sirtning slaydda keltirilgan birligi qaysi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "mol/g",
      "cm³/g",
      "g/m²",
      "m²/g"
    ],
    "togriJavob": 3,
    "slayd": "11",
    "izoh": "Bir gramm adsorbentga to'g'ri keladigan sirt maydoni m²/g bilan ifodalanadi.",
    "daraja": 1
  },
  {
    "id": 23,
    "savol": "Sirt maydoni 1200 m², massasi 3 g bo'lgan adsorbentning solishtirma sirti qancha?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "400 m²/g",
      "3600 m²/g",
      "1197 m²/g",
      "0,0025 m²/g"
    ],
    "togriJavob": 0,
    "slayd": "11",
    "izoh": "S = A / m = 1200 / 3 = 400 m²/g.",
    "daraja": 3
  },
  {
    "id": 24,
    "savol": "Adsorbentning OH, COOH va amin guruhlari asosan nimaga ta'sir qiladi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Faqat adsorbent idishining shakliga",
      "Faqat eritmaning tashqi rangiga",
      "Sirtning kimyoviy tabiatiga va moddalarga moyilligiga",
      "Har qanday moddaning molyar massasiga"
    ],
    "togriJavob": 2,
    "slayd": "11",
    "izoh": "Sirt funksional guruhlari adsorbent va adsorbat o'zaro ta'sirini belgilashda qatnashadi.",
    "daraja": 1
  },
  {
    "id": 25,
    "savol": "Mikrog'ovaklarning diametri qanday chegaraga ega?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "2–50 nm",
      "2 nm dan kichik",
      "50 nm dan katta",
      "50–100 nm"
    ],
    "togriJavob": 1,
    "slayd": "12",
    "izoh": "Slayddagi tasnifda mikrog'ovaklar d < 2 nm bilan berilgan.",
    "daraja": 2
  },
  {
    "id": 26,
    "savol": "Diametri 10 nm bo'lgan g'ovak qaysi turga kiradi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Mikrog'ovak",
      "Makrog'ovak",
      "G'ovaksiz sirt",
      "Mezog'ovak"
    ],
    "togriJavob": 3,
    "slayd": "12",
    "izoh": "Mezog'ovaklar diametri 2–50 nm oralig'ida bo'ladi.",
    "daraja": 2
  },
  {
    "id": 27,
    "savol": "Makrog'ovaklarning adsorbentdagi muhim vazifasi qaysi?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Moddalarning o'tishi uchun diffuziya va massa almashinish yo'llarini ta'minlash",
      "Faqat bitta molekulani kimyoviy bog' bilan tutish",
      "Adsorbentning barcha ichki sirtini yo'qotish",
      "Eritmadagi barcha ionlarni teng miqdorda hosil qilish"
    ],
    "togriJavob": 0,
    "slayd": "12",
    "izoh": "Katta g'ovaklar moddalarning ichki sohaga o'tishiga yordam beradi.",
    "daraja": 1
  },
  {
    "id": 28,
    "savol": "Adsorbentni regeneratsiya qilishdan asosiy maqsad nima?",
    "bolim": "ADSORBENTLAR VA G'OVAKLAR",
    "variantlar": [
      "Uning solishtirma sirtini har doim nolga tushirish",
      "Adsorbat miqdorini cheksiz oshirish",
      "Adsorbentning ishlash qobiliyatini tiklab, qayta foydalanish",
      "Muvozanat konsentratsiyasini o'lchamaslik"
    ],
    "togriJavob": 2,
    "slayd": "11, 39",
    "izoh": "Regeneratsiya adsorbentdan qayta foydalanish imkonini beradi.",
    "daraja": 1
  },
  {
    "id": 29,
    "savol": "Eritmadan adsorbsiyalangan miqdor qaysi ifoda bilan hisoblanadi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "a = (C_0 + C_e) V / m",
      "a = (C_0 - C_e) V / m",
      "a = (C_0 - C_e) m / V",
      "a = C_e / (V m)"
    ],
    "togriJavob": 1,
    "slayd": "13, 35",
    "izoh": "Eritmadagi modda miqdorining kamayishi adsorbent massasiga bo'linadi.",
    "daraja": 2
  },
  {
    "id": 30,
    "savol": "a = (C_0 - C_e) V / m ifodasida C_e nimani bildiradi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Adsorbsiya muvozanatidagi eritma konsentratsiyasini",
      "Adsorbentning solishtirma sirtini",
      "Boshlang'ich eritma hajmini",
      "Adsorbentning molyar massasini"
    ],
    "togriJavob": 0,
    "slayd": "13",
    "izoh": "C_e — muvozanat konsentratsiyasi; C_0 esa boshlang'ich konsentratsiya.",
    "daraja": 2
  },
  {
    "id": 31,
    "savol": "C_0 = 10 mmol/L, C_e = 4 mmol/L, V = 0,5 L, m = 2 g. Adsorbsiya miqdori qancha?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "3 mmol/g",
      "6 mmol/g",
      "1,5 mmol/g",
      "7 mmol/g"
    ],
    "togriJavob": 2,
    "slayd": "13, 35",
    "izoh": "a = (10 - 4) × 0,5 / 2 = 1,5 mmol/g.",
    "daraja": 3
  },
  {
    "id": 32,
    "savol": "4 g adsorbent 8 mmol modda yutdi. Adsorbsiya miqdori a qancha?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "32 mmol/g",
      "0,5 mmol/g",
      "12 mmol/g",
      "2 mmol/g"
    ],
    "togriJavob": 3,
    "slayd": "13",
    "izoh": "a = n_ads / m = 8 / 4 = 2 mmol/g.",
    "daraja": 3
  },
  {
    "id": 33,
    "savol": "Gibbs sirt ortiqchaligi Γ qanday birlikda ifodalanadi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "mol/g",
      "mol/m²",
      "m²/mol",
      "g/L"
    ],
    "togriJavob": 1,
    "slayd": "14",
    "izoh": "Γ = n^s / A, ya'ni sirt ortiqcha miqdori sirt maydoniga bo'linadi.",
    "daraja": 2
  },
  {
    "id": 34,
    "savol": "Γ > 0 bo'lishi nimani bildiradi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Musbat adsorbsiyani",
      "Manfiy adsorbsiyani",
      "Adsorbent g'ovaklari butunlay yo'qolganini",
      "Adsorbsiya va desorbsiya doimo to'xtaganini"
    ],
    "togriJavob": 0,
    "slayd": "14",
    "izoh": "Musbat sirt ortiqchaligi musbat adsorbsiyaga mos keladi.",
    "daraja": 1
  },
  {
    "id": 35,
    "savol": "Adsorbsiya muvozanatida qaysi tenglik bajariladi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Adsorbent massasi adsorbat massasiga teng bo'ladi",
      "Boshlang'ich konsentratsiya doimo nolga teng bo'ladi",
      "Adsorbsiya tezligi desorbsiya tezligidan doimo katta bo'ladi",
      "Adsorbsiya tezligi desorbsiya tezligiga teng bo'ladi"
    ],
    "togriJavob": 3,
    "slayd": "15",
    "izoh": "Muvozanat dinamik bo'lib, ikki qarama-qarshi jarayonning tezliklari tenglashadi.",
    "daraja": 1
  },
  {
    "id": 36,
    "savol": "Dinamik adsorbsiya muvozanati haqida qaysi fikr to'g'ri?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Adsorbsiya va desorbsiya butunlay to'xtaydi",
      "Adsorbatning barcha molekulalari sirtdan ajraladi",
      "Adsorbsiya va desorbsiya davom etadi, ammo umumiy adsorbsiyalangan miqdor o'zgarmaydi",
      "Adsorbsiyalangan miqdor cheksiz ortib boradi"
    ],
    "togriJavob": 2,
    "slayd": "15",
    "izoh": "Muvozanat jarayonlarning to'xtashi emas, tezliklarining tenglashishidir.",
    "daraja": 1
  },
  {
    "id": 37,
    "savol": "Adsorbsiya izotermasi qaysi bog'lanishni ifodalaydi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "O'zgarmas haroratda muvozanat adsorbsiya miqdorining bosim yoki konsentratsiyaga bog'lanishini",
      "O'zgarmas bosimda adsorbent massasining vaqtga bog'lanishini",
      "O'zgarmas hajmda molyar massaning haroratga bog'lanishini",
      "Faqat desorbsiya tezligining adsorbent rangiga bog'lanishini"
    ],
    "togriJavob": 0,
    "slayd": "16",
    "izoh": "Izoterma olishda harorat o'zgarmas saqlanadi.",
    "daraja": 2
  },
  {
    "id": 38,
    "savol": "I turdagi adsorbsiya izotermasi asosan qaysi adsorbentlarga xos?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Faqat makrog'ovakli adsorbentlarga",
      "Mikrog'ovakli adsorbentlarga",
      "Faqat g'ovaksiz suyuqliklarga",
      "Faqat ion almashinuvchi eritmalarga"
    ],
    "togriJavob": 1,
    "slayd": "17",
    "izoh": "I tur mikrog'ovaklarning to'lishi va chegaraviy adsorbsiya bilan bog'liq.",
    "daraja": 2
  },
  {
    "id": 39,
    "savol": "IV turdagi izotermada kuzatiladigan gisterezis asosan nima bilan bog'liq?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Faqat adsorbent massasining o'lchash xatosi bilan",
      "Ionlarning yadro reaksiyasi bilan",
      "Erituvchining mutlaq yo'qligi bilan",
      "Mezog'ovaklarda kapillyar kondensatsiya va g'ovak geometriyasi bilan"
    ],
    "togriJavob": 3,
    "slayd": "17",
    "izoh": "Adsorbsiya va desorbsiya yo'llarining farqlanishi gisterezis halqasini hosil qiladi.",
    "daraja": 3
  },
  {
    "id": 40,
    "savol": "VI turdagi izotermaning pog'onasimon ko'rinishi nimani ifodalaydi?",
    "bolim": "ADSORBSIYA MIQDORI VA MUVOZANAT",
    "variantlar": [
      "Faqat ion almashinishini",
      "Adsorbentning birdan erib ketishini",
      "Qatlamlarning ketma-ket hosil bo'lishini",
      "Adsorbsiya miqdorining har doim nol bo'lishini"
    ],
    "togriJavob": 2,
    "slayd": "17",
    "izoh": "VI turdagi izoterma qatlamma-qatlam adsorbsiyaga mos keladi.",
    "daraja": 3
  },
  {
    "id": 41,
    "savol": "Genri izotermasi asosan qaysi sharoitda qo'llanadi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "Past bosim yoki past konsentratsiyada",
      "Sirt to'liq to'yingandan keyin",
      "Faqat cheksiz yuqori bosimda",
      "Faqat adsorbent erib ketganda"
    ],
    "togriJavob": 0,
    "slayd": "18",
    "izoh": "Sirtning oz qismi band bo'lganda adsorbsiya miqdori bosim yoki konsentratsiyaga chiziqli bog'lanadi.",
    "daraja": 2
  },
  {
    "id": 42,
    "savol": "Eritma uchun Genri izotermasining tenglamasi qaysi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "a = K_H / C_e",
      "a = K_H + C_e",
      "a = K_H C_e²",
      "a = K_H C_e"
    ],
    "togriJavob": 3,
    "slayd": "18",
    "izoh": "Genri sohasida adsorbsiya miqdori muvozanat konsentratsiyasiga to'g'ri proporsional.",
    "daraja": 2
  },
  {
    "id": 43,
    "savol": "Genri qonuni amal qiladigan sohada gaz bosimi 2 marta oshsa, adsorbsiya miqdori qanday o'zgaradi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "2 marta kamayadi",
      "2 marta ortadi",
      "4 marta ortadi",
      "O'zgarmaydi"
    ],
    "togriJavob": 1,
    "slayd": "18",
    "izoh": "a = K_H p; harorat o'zgarmasa va Genri sohasi saqlansa, a bosimga proporsional.",
    "daraja": 3
  },
  {
    "id": 44,
    "savol": "Freyndlix izotermasining tenglamasi qaysi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "a = a_m K C_e / (1 + K C_e)",
      "a = K_H / C_e",
      "a = K_F C_e^(1/n)",
      "a = C_e / a_m"
    ],
    "togriJavob": 2,
    "slayd": "19",
    "izoh": "Freyndlix modeli darajali empirik bog'lanishdir.",
    "daraja": 2
  },
  {
    "id": 45,
    "savol": "Freyndlix modeli qaysi sirtni tavsiflashda qo'llanadi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "Faqat barcha markazlari bir xil energiyali sirtni",
      "Energetik jihatdan bir jinsli bo'lmagan sirtni",
      "Faqat adsorbsiya markazlari yo'q sirtni",
      "Faqat suyuqlikning butun hajmini"
    ],
    "togriJavob": 1,
    "slayd": "19",
    "izoh": "Freyndlix modeli geterogen sirt adsorbsiyasini ifodalashda ishlatiladi.",
    "daraja": 2
  },
  {
    "id": 46,
    "savol": "Freyndlix tenglamasining chiziqlashtirilgan ko'rinishi qaysi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "lg a = lg K_F + (1/n) lg C_e",
      "lg a = lg K_F - n lg C_e",
      "a = lg K_F + n C_e",
      "C_e/a = lg K_F + lg C_e"
    ],
    "togriJavob": 0,
    "slayd": "19, 20",
    "izoh": "a = K_F C_e^(1/n) tenglamasidan o'nli logarifm olinadi.",
    "daraja": 3
  },
  {
    "id": 47,
    "savol": "lg a ning lg C_e ga bog'liqlik grafigida to'g'ri chiziqning qiyaligi nimaga teng?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "K_F",
      "lg K_F",
      "1/n",
      "a_m"
    ],
    "togriJavob": 2,
    "slayd": "20",
    "izoh": "y = lg a va x = lg C_e bo'lganda qiyalik 1/n bo'ladi.",
    "daraja": 2
  },
  {
    "id": 48,
    "savol": "Freyndlix chiziqli grafigining qiyaligi 0,5 bo'lsa, n qancha?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "0,5",
      "1",
      "4",
      "2"
    ],
    "togriJavob": 3,
    "slayd": "20",
    "izoh": "1/n = 0,5; demak n = 2.",
    "daraja": 3
  },
  {
    "id": 49,
    "savol": "Freyndlix tenglamasida 1/n = 1 bo'lsa, adsorbsiya miqdori konsentratsiyaga qanday bog'lanadi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "Chiziqli ravishda",
      "Konsentratsiyaning kvadratiga proporsional",
      "Konsentratsiyaga teskari proporsional",
      "Konsentratsiyadan butunlay mustaqil"
    ],
    "togriJavob": 0,
    "slayd": "21",
    "izoh": "Bu holda a = K_F C_e bo'ladi.",
    "daraja": 2
  },
  {
    "id": 50,
    "savol": "Freyndlix modelining muhim cheklovi qaysi?",
    "bolim": "GENRI VA FREYNDLIX IZOTERMALARI",
    "variantlar": [
      "Faqat sirt to'liq to'yingandan keyin ishlashi",
      "Hech qanday tajriba ma'lumotiga mos kelmasligi",
      "Haroratni doimo nol deb qabul qilishi",
      "Chegaraviy to'yinish sig'imini tenglamada belgilamasligi"
    ],
    "togriJavob": 3,
    "slayd": "19, 26",
    "izoh": "Freyndlix tenglamasida a_m kabi chekli to'yinish miqdori mavjud emas.",
    "daraja": 2
  },
  {
    "id": 51,
    "savol": "Lengmyur modelida adsorbent sirt markazlari qanday deb olinadi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "Energetik jihatdan doimo turlicha",
      "Energetik jihatdan bir xil",
      "Adsorbatdan to'liq mustaqil va mavjud emas",
      "Faqat suyuqlik hajmida joylashgan"
    ],
    "togriJavob": 1,
    "slayd": "22",
    "izoh": "Model energetik bir jinsli sirtni qabul qiladi.",
    "daraja": 1
  },
  {
    "id": 52,
    "savol": "Lengmyur modelida bitta adsorbsiya markazi nechta molekulani tutadi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "Ikki molekulani",
      "Cheksiz ko'p molekulani",
      "Bitta molekulani",
      "Faqat adsorbentning barcha molekulalarini birgalikda"
    ],
    "togriJavob": 2,
    "slayd": "22",
    "izoh": "Har bir markazga bitta adsorbat molekulasi joylashadi.",
    "daraja": 1
  },
  {
    "id": 53,
    "savol": "Lengmyur modelida adsorbsiyalangan molekulalar orasidagi yonlama o'zaro ta'sir qanday hisobga olinadi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "Hisobga olinmaydi",
      "Har doim eng kuchli ta'sir deb olinadi",
      "Faqat ko'p qatlam hosil bo'lganda hisoblanadi",
      "Adsorbent massasiga teng deb olinadi"
    ],
    "togriJavob": 0,
    "slayd": "22",
    "izoh": "Yonlama o'zaro ta'sirni e'tiborga olmaslik modelning farazlaridan biridir.",
    "daraja": 1
  },
  {
    "id": 54,
    "savol": "Eritma uchun Lengmyur tenglamasi qaysi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "a = K_F C_e^(1/n)",
      "a = a_m K C_e / (1 + K C_e)",
      "a = a_m / (K C_e)",
      "a = a_m (1 + K C_e)"
    ],
    "togriJavob": 1,
    "slayd": "23",
    "izoh": "Tenglama monoqavat hosil bo'lishi va chekli sirt markazlarini ifodalaydi.",
    "daraja": 2
  },
  {
    "id": 55,
    "savol": "Lengmyur tenglamasidagi a_m nimani bildiradi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "Eritmaning boshlang'ich konsentratsiyasini",
      "Muvozanat tezligini",
      "Adsorbentning molyar massasini",
      "Monoqavat to'liq hosil bo'lgandagi chegaraviy adsorbsiya sig'imini"
    ],
    "togriJavob": 3,
    "slayd": "23, 25",
    "izoh": "a_m sirt markazlari to'liq band bo'lgandagi maksimal monoqavat miqdoridir.",
    "daraja": 2
  },
  {
    "id": 56,
    "savol": "Lengmyur tenglamasida K C_e juda katta bo'lsa, a qaysi qiymatga yaqinlashadi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "Nolga",
      "K ga",
      "a_m ga",
      "C_e ga"
    ],
    "togriJavob": 2,
    "slayd": "23",
    "izoh": "K C_e >> 1 bo'lganda a ≈ a_m, ya'ni to'yinish kuzatiladi.",
    "daraja": 2
  },
  {
    "id": 57,
    "savol": "K C_e juda kichik bo'lganda Lengmyur tenglamasi qanday soddalashadi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "a ≈ a_m K C_e",
      "a ≈ a_m / C_e",
      "a ≈ a_m + K",
      "a ≈ 1 / (a_m K C_e)"
    ],
    "togriJavob": 0,
    "slayd": "23",
    "izoh": "K C_e << 1 bo'lsa, maxrajdagi 1 + K C_e ≈ 1 bo'ladi.",
    "daraja": 2
  },
  {
    "id": 58,
    "savol": "Lengmyur tenglamasining chiziqlashtirilgan ko'rinishi qaysi?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "C_e/a = a_m K + a_m C_e",
      "a/C_e = C_e/a_m + K",
      "lg a = lg a_m + lg C_e",
      "C_e/a = 1/(a_m K) + C_e/a_m"
    ],
    "togriJavob": 3,
    "slayd": "24",
    "izoh": "Bu ko'rinishda C_e/a ning C_e ga bog'lanishi to'g'ri chiziq beradi.",
    "daraja": 3
  },
  {
    "id": 59,
    "savol": "C_e/a ning C_e ga bog'liqlik grafigidagi qiyalik nimaga teng?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "a_m",
      "1/a_m",
      "K",
      "1/K"
    ],
    "togriJavob": 1,
    "slayd": "24",
    "izoh": "Chiziqli tenglamada C_e oldidagi koeffitsiyent 1/a_m.",
    "daraja": 2
  },
  {
    "id": 60,
    "savol": "Lengmyur modelida sirtning bandlik ulushi θ qaysi ifodaga teng?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "θ = 1 + K C_e",
      "θ = a_m / C_e",
      "θ = K C_e / (1 + K C_e)",
      "θ = K C_e²"
    ],
    "togriJavob": 2,
    "slayd": "25",
    "izoh": "θ = a/a_m; qiymati 0 dan 1 gacha bo'ladi.",
    "daraja": 2
  },
  {
    "id": 61,
    "savol": "K C_e = 1 bo'lsa, sirtning bandlik ulushi θ qancha?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "0",
      "0,5",
      "1",
      "2"
    ],
    "togriJavob": 1,
    "slayd": "25",
    "izoh": "θ = 1/(1 + 1) = 0,5, ya'ni sirtning yarmi band.",
    "daraja": 3
  },
  {
    "id": 62,
    "savol": "a_m = 10 mmol/g va K C_e = 1 bo'lsa, adsorbsiya miqdori qancha?",
    "bolim": "LENGMYUR IZOTERMASI VA SIRTNING BANDLIGI",
    "variantlar": [
      "5 mmol/g",
      "10 mmol/g",
      "20 mmol/g",
      "1 mmol/g"
    ],
    "togriJavob": 0,
    "slayd": "23, 25",
    "izoh": "a = 10 × 1/(1 + 1) = 5 mmol/g.",
    "daraja": 3
  },
  {
    "id": 63,
    "savol": "Sips modeli qaysi ikki modelning xususiyatlarini birlashtiradi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Genri va BET",
      "Temkin va BET",
      "Lengmyur va Freyndlix",
      "Genri va Gibbs"
    ],
    "togriJavob": 2,
    "slayd": "27",
    "izoh": "Sips modeli Lengmyur–Freyndlix modeli sifatida ham ko'rsatilgan.",
    "daraja": 2
  },
  {
    "id": 64,
    "savol": "Slayddagi Sips tenglamasida n = 1 bo'lsa, qaysi model hosil bo'ladi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "BET modeli",
      "Temkin modeli",
      "Dubinin–Radushkevich modeli",
      "Lengmyur modeli"
    ],
    "togriJavob": 3,
    "slayd": "27",
    "izoh": "a = a_m (K_s C_e)^n / [1 + (K_s C_e)^n] da n = 1 Lengmyur ko'rinishini beradi.",
    "daraja": 3
  },
  {
    "id": 65,
    "savol": "Temkin modelida adsorbsiya issiqligi sirt bandligi ortishi bilan qanday o'zgaradi deb olinadi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Chiziqli ortadi",
      "Chiziqli kamayadi",
      "Cheksiz ortadi",
      "Har doim mutlaq nol bo'ladi"
    ],
    "togriJavob": 1,
    "slayd": "28",
    "izoh": "Temkin modeli adsorbatlar o'zaro ta'sirini va adsorbsiya issiqligining kamayishini hisobga oladi.",
    "daraja": 2
  },
  {
    "id": 66,
    "savol": "Temkin tenglamasi a = B ln(A_T C_e) bo'lsa, a ning ln C_e ga bog'liqlik grafigi qiyaligi nimaga teng?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "B",
      "A_T",
      "1/B",
      "C_e"
    ],
    "togriJavob": 0,
    "slayd": "28",
    "izoh": "a = B ln A_T + B ln C_e; ln C_e oldidagi koeffitsiyent B.",
    "daraja": 3
  },
  {
    "id": 67,
    "savol": "Dubinin–Radushkevich modeli asosan qaysi jarayonni tavsiflaydi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Faqat adsorbentning tashqi sirtida ko'p qatlam hosil bo'lishini",
      "Ionlarning ekvivalent almashinishini",
      "Mikrog'ovaklar hajmining adsorbat bilan to'lishini",
      "Faqat eritmaning butun hajmida absorbsiya borishini"
    ],
    "togriJavob": 2,
    "slayd": "29",
    "izoh": "Model mikrog'ovakli adsorbentlar, jumladan faollashtirilgan ko'mir uchun qo'llanadi.",
    "daraja": 2
  },
  {
    "id": 68,
    "savol": "BET modelida birinchi adsorbsion qatlamdan keyingi qatlamlar qayerda hosil bo'ladi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Faqat adsorbentning hali band bo'lmagan markazlarida",
      "Faqat eritma hajmining markazida",
      "Adsorbentdan tashqaridagi bo'sh idishda",
      "Oldingi adsorbat qatlamlari ustida"
    ],
    "togriJavob": 3,
    "slayd": "30",
    "izoh": "BET ko'p qatlamli fizik adsorbsiyani tavsiflaydi.",
    "daraja": 2
  },
  {
    "id": 69,
    "savol": "BET usulida monoqavat sig'imidan qaysi muhim xususiyatni aniqlashda foydalaniladi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Adsorbentning atom raqamini",
      "Adsorbentning solishtirma sirtini",
      "Adsorbatning yadro tarkibini",
      "Erituvchining molyar massasini"
    ],
    "togriJavob": 1,
    "slayd": "30, 32",
    "izoh": "Monoqavat miqdori adsorbent sirt maydonini baholashga yordam beradi.",
    "daraja": 2
  },
  {
    "id": 70,
    "savol": "BET o'lchashlarida slaydda ko'rsatilgan keng qo'llanadigan gaz va harorat qaysi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Azot, 77 K",
      "Azot, 77 °C",
      "Kislorod, 273 °C",
      "Vodorod, 1000 K"
    ],
    "togriJavob": 0,
    "slayd": "32",
    "izoh": "Slaydda N₂ bilan 77 K da o'lchash keltirilgan.",
    "daraja": 1
  },
  {
    "id": 71,
    "savol": "BET tenglamasidagi p_0 nimani bildiradi?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "Adsorbentning boshlang'ich massasini",
      "Adsorbsiyalangan moddaning konsentratsiyasini",
      "O'lchash haroratidagi to'yingan bug' bosimini",
      "Adsorbsiya markazlarining umumiy sonini"
    ],
    "togriJavob": 2,
    "slayd": "31",
    "izoh": "p/p_0 — nisbiy bosim.",
    "daraja": 3
  },
  {
    "id": 72,
    "savol": "Slaydda BET chiziqli sohasi uchun odatda qaysi nisbiy bosim oralig'i keltirilgan?",
    "bolim": "BOSHQA IZOTERMALAR VA BET USULI",
    "variantlar": [
      "0,50 < p/p_0 < 0,90",
      "1,00 < p/p_0 < 2,00",
      "0,30 < p/p_0 < 0,80",
      "0,05 < p/p_0 < 0,30"
    ],
    "togriJavob": 3,
    "slayd": "31",
    "izoh": "Bu slaydda keltirilgan odatiy oraliq; har bir namuna uchun modelga moslik alohida baholanadi.",
    "daraja": 3
  },
  {
    "id": 73,
    "savol": "Gibbs energiyasi, entalpiya va entropiya orasidagi bog'lanish qaysi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "ΔG = ΔH + TΔS",
      "ΔG = ΔH - TΔS",
      "ΔG = TΔH - ΔS",
      "ΔG = ΔS - TΔH"
    ],
    "togriJavob": 1,
    "slayd": "33",
    "izoh": "T mutlaq haroratni bildiradi.",
    "daraja": 2
  },
  {
    "id": 74,
    "savol": "Adsorbsiyada ΔH < 0 bo'lsa, jarayon qanday tavsiflanadi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Ekzotermik, ya'ni issiqlik ajraladigan",
      "Endotermik, ya'ni issiqlik yutiladigan",
      "Issiqlik almashinuvi mavjud bo'lmagan",
      "Faqat mexanik ish sodir bo'ladigan"
    ],
    "togriJavob": 0,
    "slayd": "33",
    "izoh": "Manfiy entalpiya o'zgarishi issiqlik ajralishini bildiradi.",
    "daraja": 2
  },
  {
    "id": 75,
    "savol": "Ekzotermik fizik adsorbsiyada harorat oshirilsa, muvozanat odatda qaysi tomonga siljiydi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Adsorbsiyaning ortishi tomoniga",
      "Har doim monoqavatning ko'p qatlamga aylanishi tomoniga",
      "Desorbsiya tomoniga",
      "Adsorbent massasining ortishi tomoniga"
    ],
    "togriJavob": 2,
    "slayd": "34",
    "izoh": "Harorat ortishi ekzotermik adsorbsiyaga qarama-qarshi jarayonni kuchaytiradi.",
    "daraja": 2
  },
  {
    "id": 76,
    "savol": "Eritmada bir nechta adsorbsiyalanuvchi modda bo'lsa, ular o'rtasida qanday hodisa yuz berishi mumkin?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Barcha moddalarning muvozanat konsentratsiyasi bir xil bo'lishi shart",
      "Har bir modda faqat alohida, boshqa moddalar kira olmaydigan sirtga ega bo'ladi",
      "Adsorbsiya haroratga bog'liq bo'lmay qoladi",
      "Bir xil sirt markazlari uchun raqobat"
    ],
    "togriJavob": 3,
    "slayd": "35",
    "izoh": "Erituvchi va boshqa erigan moddalar adsorbsiya markazlari uchun raqobatlashishi mumkin.",
    "daraja": 2
  },
  {
    "id": 77,
    "savol": "Gibbs adsorbsiya tenglamasiga ko'ra, dσ/dln c < 0 bo'lsa, Γ ning ishorasi qanday?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Musbat",
      "Manfiy",
      "Albatta nol",
      "Haroratdan qat'i nazar aniqlab bo'lmaydi"
    ],
    "togriJavob": 0,
    "slayd": "36",
    "izoh": "Γ = -(1/RT)(dσ/dln c); R va T musbat bo'lgani uchun manfiy hosila musbat Γ beradi.",
    "daraja": 2
  },
  {
    "id": 78,
    "savol": "Kationitlar va anionitlar qaysi ionlarni almashadi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Kationitlar manfiy, anionitlar musbat ionlarni",
      "Ikkalasi faqat neytral molekulalarni",
      "Kationitlar musbat, anionitlar manfiy ionlarni",
      "Ikkalasi faqat elektronlarni"
    ],
    "togriJavob": 2,
    "slayd": "37",
    "izoh": "Kationit kationlarni, anionit anionlarni almashadi.",
    "daraja": 1
  },
  {
    "id": 79,
    "savol": "Natriy shaklidagi kationit bitta Ca²⁺ ionini tutganda, ekvivalent almashinish bo'yicha nechta Na⁺ ionini chiqaradi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Bitta",
      "Ikkita",
      "Uchta",
      "To'rtta"
    ],
    "togriJavob": 1,
    "slayd": "37",
    "izoh": "Bitta Ca²⁺ ning zaryadi ikkita Na⁺ zaryadiga teng. Muvozanatlangan yozuv: 2R-SO₃Na + Ca²⁺ ↔ (R-SO₃)₂Ca + 2Na⁺.",
    "daraja": 3
  },
  {
    "id": 80,
    "savol": "Adsorbsion xromatografiyada boshqa sharoitlar bir xil bo'lsa, qo'zg'almas fazaga kuchliroq adsorbsiyalanuvchi modda qanday harakat qiladi?",
    "bolim": "TERMODINAMIKA, ERITMALAR VA AMALIY QO'LLANISH",
    "variantlar": [
      "Kolonnadan tezroq chiqadi",
      "Qo'zg'almas faza bilan umuman ta'sirlashmaydi",
      "Har doim erituvchi bilan bir vaqtda chiqadi",
      "Ko'proq ushlanadi va kolonnadan kechroq chiqadi"
    ],
    "togriJavob": 3,
    "slayd": "38",
    "izoh": "Moddalarning adsorbsiya va desorbsiya farqlari ularni ajratishga imkon beradi.",
    "daraja": 2
  }
];
