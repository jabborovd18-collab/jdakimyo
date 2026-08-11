// data/laboratoriya/jihozlar.js
//
// Laboratoriya jihozlari katalogi.
//
// Manba — reaksiyalar bazasidagi `equipment` maydoni (249 reaksiyadan 123
// tasida to'ldirilgan, 73 ta xom qiymat). Xom ro'yxat to'g'ridan-to'g'ri
// ishlatilmaydi, chunki unda uch xil chalkashlik bor:
//
//   1. Bir narsaning ikki nomi — "Spirtovka" va "Qizdirish uchun spirtovka",
//      "Gaz o'tkazuvchi naycha" va "Gaz ajratuvchi naycha".
//   2. Holat idish deb yozilgan — "Toza probirka", "Quruq kolba" idish emas,
//      o'sha idishning holati.
//   3. Bitta qurilmaning qismlari alohida — "Titan anod", "Po'lat katod",
//      "Uglerod elektrodlari" aslida elektrolizyorning elektrodlari.
//
// Shuning uchun quyidagi ro'yxat qo'lda tozalangan. Har bir yozuvda `xom`
// maydoni bor — u qaysi xom qiymatlar shu jihozga birlashtirilganini
// ko'rsatadi, ya'ni seed skript reaksiyani jihozga bog'lay oladi.
//
// NODIRLIK VA NARX — `uchraydi` (nechta reaksiyada kerak) dan kelib chiqadi:
// kam uchraydigan jihoz kamroq reaksiyani ochadi, lekin o'sha reaksiyalar
// boshqa yo'l bilan qilinmaydi. Shuning uchun u qimmat.
//
// `sanoat: true` — talaba laboratoriyasida bo'lmaydigan zavod qurilmasi.
// Ular kech bosqich uchun: tanga bilan emas, olmos bilan olinadi.

module.exports = [
  // ─────────────── SHISHA IDISHLAR ───────────────
  {
    kalit: 'probirka', nom: 'Probirka', guruh: 'shisha', uchraydi: 58,
    narx: 10, icon: '🧪',
    tavsif: 'Eng asosiy idish. Kichik hajmdagi reaksiyalar shu yerda o\'tkaziladi.',
    xom: ['Probirka', 'Toza probirka'],
  },
  {
    kalit: 'probirka-shtativi', nom: 'Probirka shtativi', guruh: 'tayanch', uchraydi: 10,
    narx: 15, icon: '🗄️',
    tavsif: 'Probirkalarni tik ushlab turadi — bir vaqtda bir nechta tajriba uchun.',
    xom: ['Probirka shtativi'],
  },
  {
    kalit: 'kolba', nom: 'Kolba', guruh: 'shisha', uchraydi: 5,
    narx: 40, icon: '⚗️',
    tavsif: 'Umumiy maqsadli kolba. Aralashtirish va qizdirish uchun.',
    xom: ['Kolba', 'Quruq kolba'],
  },
  {
    kalit: 'konussimon-kolba', nom: 'Konussimon kolba', guruh: 'shisha', uchraydi: 7,
    narx: 55, icon: '⚗️',
    tavsif: 'Erlenmeyer kolbasi. Tor bo\'g\'zi tufayli chayqatib aralashtirsa ham to\'kilmaydi — titrlashning asosiy idishi.',
    xom: ['Konussimon kolba'],
  },
  {
    kalit: 'dumaloq-tubli-kolba', nom: 'Dumaloq tubli kolba', guruh: 'shisha', uchraydi: 1,
    narx: 180, icon: '🫧',
    tavsif: 'Bir tekis qizdirish uchun. Qaytar sovutgich va haydash apparati shunga ulanadi.',
    xom: ['Dumaloq tubli kolba'],
  },
  {
    kalit: 'stakan', nom: 'Kimyoviy stakan', guruh: 'shisha', uchraydi: 3,
    narx: 25, icon: '🥛',
    tavsif: 'Eritma tayyorlash va oraliq idish sifatida.',
    xom: ['Stakan'],
  },
  {
    kalit: 'kristallizator', nom: 'Kristallizator', guruh: 'shisha', uchraydi: 3,
    narx: 70, icon: '💠',
    tavsif: 'Eritmani sekin bug\'latib kristall o\'stirish uchun keng yassi idish.',
    xom: ['Kristallizator'],
  },

  // ─────────────── QUYISH VA O'LCHASH ───────────────
  {
    kalit: 'voronka', nom: 'Voronka', guruh: 'ajratish', uchraydi: 22,
    narx: 20, icon: '🔻',
    tavsif: 'Suyuqlikni tor bo\'g\'izli idishga quyish va filtrlash uchun.',
    xom: ['Voronka'],
  },
  {
    kalit: 'tomizuvchi-voronka', nom: 'Tomizuvchi voronka', guruh: 'ajratish', uchraydi: 1,
    narx: 200, icon: '💧',
    tavsif: 'Reagentni tomchilab qo\'shadi — shiddatli reaksiyani boshqarish uchun.',
    xom: ['Tomizuvchi voronka'],
  },
  {
    kalit: 'filtr-qogozi', nom: 'Filtr qog\'ozi', guruh: 'ajratish', uchraydi: 22,
    narx: 5, sarflanadi: true, icon: '📄',
    tavsif: 'Cho\'kmani eritmadan ajratadi. Har filtrlashda yangisi ketadi.',
    xom: ['Filtr qog\'ozi', 'Filtr'],
  },
  {
    kalit: 'tomizgich', nom: 'Tomizgich', guruh: 'olchov', uchraydi: 11,
    narx: 12, icon: '💉',
    tavsif: 'Reagentni tomchilab qo\'shish uchun. Sifat tahlilining asosiy asbobi.',
    xom: ['Tomizgich'],
  },
  {
    kalit: 'pipetka', nom: 'Pipetka', guruh: 'olchov', uchraydi: 3,
    narx: 45, icon: '🧫',
    tavsif: 'Aniq hajmni o\'lchab olish uchun.',
    xom: ['Pipetka'],
  },
  {
    kalit: 'byuretka', nom: 'Byuretka', guruh: 'olchov', uchraydi: 9,
    narx: 90, icon: '📏',
    tavsif: 'Titrlash uchun. Sarflangan hajmni 0.1 ml aniqlikda o\'lchaydi.',
    xom: ['Byuretka'],
  },
  {
    kalit: 'termometr', nom: 'Termometr', guruh: 'olchov', uchraydi: 2,
    narx: 110, icon: '🌡️',
    tavsif: 'Harorat rejimini nazorat qiladi — haroratga bog\'liq reaksiyalar uchun shart.',
    xom: ['Termometr'],
  },
  {
    kalit: 'ph-metr', nom: 'pH-metr', guruh: 'olchov', uchraydi: 1,
    narx: 350, icon: '📟',
    tavsif: 'Muhitni raqamli o\'lchaydi. Indikatorga qaraganda aniq.',
    xom: ['pH-metr'],
  },
  {
    kalit: 'kalorimetrik-bomba', nom: 'Kalorimetrik bomba', guruh: 'olchov', uchraydi: 1,
    narx: 400, icon: '🧨',
    tavsif: 'Yonish issiqligini o\'lchaydi. Yopiq po\'lat idishda namuna yondiriladi.',
    xom: ['Kalorimetrik bomba'],
  },

  // ─────────────── ISITISH ───────────────
  {
    kalit: 'spirtovka', nom: 'Spirtovka', guruh: 'isitish', uchraydi: 18,
    narx: 30, icon: '🔥',
    tavsif: 'Ochiq alangali isitgich. Qizdirish talab qiladigan reaksiyalar uchun.',
    xom: ['Spirtovka', 'Qizdirish uchun spirtovka'],
  },
  {
    kalit: 'suv-hammomi', nom: 'Suv hammomi', guruh: 'isitish', uchraydi: 5,
    narx: 100, icon: '♨️',
    tavsif: 'Yumshoq va bir tekis qizdirish, 100 °C dan oshmaydi — kuyib ketmaydigan moddalar uchun.',
    xom: ['Suv hammomi'],
  },
  {
    kalit: 'qum-toshak', nom: 'Qum to\'shak', guruh: 'isitish', uchraydi: 2,
    narx: 60, icon: '🏖️',
    tavsif: 'Suv hammomidan issiqroq, lekin ochiq alangadan yumshoqroq.',
    xom: ['Qum to\'shak'],
  },
  {
    kalit: 'pech', nom: 'Muffel pechi', guruh: 'isitish', uchraydi: 1,
    narx: 300, icon: '🏭',
    tavsif: 'Yuqori harorat (500 °C dan yuqori). Kalsinlash va termik parchalanish uchun.',
    xom: ['Pech'],
  },

  // ─────────────── TAYANCH VA TUTQICH ───────────────
  {
    kalit: 'shtativ', nom: 'Shtativ', guruh: 'tayanch', uchraydi: 1,
    narx: 50, icon: '🔩',
    tavsif: 'Kolba, byuretka va sovutgichni mahkamlaydi.',
    xom: ['Shtativ'],
  },
  {
    kalit: 'tigel-qisqichi', nom: 'Tigel qisqichi', guruh: 'tayanch', uchraydi: 14,
    narx: 18, icon: '🗜️',
    tavsif: 'Qizigan probirka va tigelni ushlash uchun.',
    xom: ['Tigel qisqichi'],
  },
  {
    kalit: 'pinset', nom: 'Pinset', guruh: 'tayanch', uchraydi: 1,
    narx: 20, icon: '🥢',
    tavsif: 'Mayda qattiq namunalarni olish uchun.',
    xom: ['Pinset'],
  },

  // ─────────────── CHINNI VA O'TGA CHIDAMLI ───────────────
  {
    kalit: 'chinni-kosacha', nom: 'Chinni kosacha', guruh: 'chinni', uchraydi: 4,
    narx: 35, icon: '🥣',
    tavsif: 'Bug\'latish va quruq qizdirish uchun. Kislotaga chidamli.',
    xom: ['Chinni kosacha'],
  },
  {
    kalit: 'shamotli-tigel', nom: 'Shamotli tigel', guruh: 'chinni', uchraydi: 1,
    narx: 150, icon: '🫖',
    tavsif: 'Juda yuqori haroratga chidaydi — metall eritish uchun.',
    xom: ['Shamotli tigel'],
  },

  // ─────────────── AJRATISH ───────────────
  {
    kalit: 'qaytar-sovutgich', nom: 'Qaytar sovutgich', guruh: 'ajratish', uchraydi: 5,
    narx: 220, icon: '🌀',
    tavsif: 'Bug\'ni sovitib kolbaga qaytaradi — uzoq qaynatishda modda yo\'qolmaydi.',
    xom: ['Qaytar sovutgich', 'Sovutgich-kondensator', 'Kondensator'],
  },
  {
    kalit: 'haydash-apparati', nom: 'Haydash apparati', guruh: 'ajratish', uchraydi: 1,
    narx: 280, icon: '⚙️',
    tavsif: "Qaynash haroratiga qarab suyuqliklarni ajratadi. O'rnatilgach distillangan suv cheksiz bo'ladi — uni boshqa sotib olmaysiz.",
    xom: ['Haydash apparati'],
  },
  {
    kalit: 'gaz-naycha', nom: 'Gaz o\'tkazuvchi naycha', guruh: 'gaz', uchraydi: 7,
    narx: 28, icon: '🪈',
    tavsif: 'Ajralgan gazni boshqa idishga o\'tkazadi — gaz to\'plash uchun.',
    xom: ['Gaz o\'tkazuvchi naycha', 'Gaz ajratuvchi naycha'],
  },
  {
    kalit: 'kvars-naycha', nom: 'Kvars naycha', guruh: 'gaz', uchraydi: 2,
    narx: 190, icon: '🔬',
    tavsif: 'Yuqori haroratda ham erimaydi — gaz oqimida qizdirish uchun.',
    xom: ['Kvars naycha'],
  },

  // ─────────────── XAVFSIZLIK ───────────────
  {
    kalit: 'morili-shkaf', nom: 'Mo\'rili shkaf', guruh: 'himoya', uchraydi: 20,
    narx: 250, icon: '🚪',
    tavsif: 'Zaharli gaz ajraladigan reaksiyalar FAQAT shu yerda o\'tkaziladi.',
    xom: ['Mo\'rili shkaf'],
  },
  {
    kalit: 'himoya-ekrani', nom: 'Himoya ekrani', guruh: 'himoya', uchraydi: 6,
    narx: 80, icon: '🛡️',
    tavsif: 'Portlash xavfi bor reaksiyalarda ish joyini to\'sadi.',
    xom: ['Himoya ekrani', 'Maxsus himoya'],
  },
  {
    kalit: 'koz-himoyasi', nom: 'Ko\'zoynak', guruh: 'himoya', uchraydi: 1,
    narx: 15, icon: '🥽',
    tavsif: 'Ko\'zni sachragan reagentdan saqlaydi. Arzon, lekin hech qachon ortiqcha emas.',
    xom: ['Ko\'z himoyasi'],
  },

  // ─────────────── MAXSUS QURILMALAR ───────────────
  {
    kalit: 'kipp-apparati', nom: 'Kipp apparati', guruh: 'gaz', uchraydi: 1,
    narx: 320, icon: '🧯',
    tavsif: 'Gazni kerakli paytda kerakli miqdorda beradi — jarayonni to\'xtatib turish mumkin.',
    xom: ['Kipp apparati'],
  },
  {
    kalit: 'hofman-apparati', nom: 'Hofman apparati', guruh: 'elektr', uchraydi: 1,
    narx: 330, icon: '⚡',
    tavsif: 'Suvni elektroliz qilib vodorod va kislorodni alohida to\'playdi.',
    xom: ['Hofman apparati'],
  },
  {
    kalit: 'aralashtirgich', nom: 'Aralashtirgich', guruh: 'tayanch', uchraydi: 1,
    narx: 130, icon: '🌪️',
    tavsif: 'Eritmani uzluksiz aralashtiradi — bir tekis borishi uchun.',
    xom: ['Aralashtirgich'],
  },
  {
    kalit: 'metall-namuna', nom: 'Metall plastinka va simlar', guruh: 'sarf', uchraydi: 3,
    narx: 25, sarflanadi: true, icon: '🔗',
    tavsif: 'Temir mix, mis sim, mis spiral — siqib chiqarish reaksiyalari uchun.',
    xom: ['Temir mix yoki plastinka', 'Mis sim', 'Mis spiral'],
  },
  {
    kalit: 'sondirish-chuqurchasi', nom: 'So\'ndirish chuqurchasi', guruh: 'tayanch', uchraydi: 1,
    narx: 40, icon: '🕳️',
    tavsif: 'Ohak so\'ndirish kabi issiqlik ajratadigan jarayonlar uchun.',
    xom: ['So\'ndirish chuqurchasi'],
  },

  // ─────────────── SANOAT QURILMALARI ───────────────
  // Bular talaba laboratoriyasida bo'lmaydi. Ular `scale: sanoat` bo'lgan
  // reaksiyalarni ochadi va olmosga olinadi.
  {
    kalit: 'elektrolizyor', nom: 'Elektrolizyor', guruh: 'sanoat', uchraydi: 3,
    narx: 0, gemsNarxi: 40, sanoat: true, icon: '🔋',
    tavsif: 'Sanoat elektrolizi: eritma yoki suyuqlanmadan metall va gaz ajratadi.',
    xom: ['Elektrolizyor', 'Membranali elektrolizyor', 'Elektroliz vannasi'],
  },
  {
    kalit: 'elektrodlar', nom: 'Sanoat elektrodlari', guruh: 'sanoat', uchraydi: 4,
    narx: 0, gemsNarxi: 15, sanoat: true, sarflanadi: true, icon: '🪫',
    tavsif: 'Titan anod, po\'lat katod, uglerod elektrodlari — elektrolizyorga kerak.',
    xom: ['Titan anod', 'Po\'lat katod', 'Uglerod anodlari', 'Uglerod elektrodlari'],
  },
  {
    kalit: 'kontakt-apparati', nom: 'Kontakt apparati', guruh: 'sanoat', uchraydi: 2,
    narx: 0, gemsNarxi: 50, sanoat: true, icon: '🏗️',
    tavsif: 'Katalizator qatlamida gaz fazadagi oksidlanish — sulfat kislota ishlab chiqarishning yuragi.',
    xom: ['Kontakt apparati', 'Kontakt apparati (platina to\'r bilan)'],
  },
  {
    kalit: 'absorbsion-minora', nom: 'Absorbsion minora', guruh: 'sanoat', uchraydi: 4,
    narx: 0, gemsNarxi: 35, sanoat: true, icon: '🗼',
    tavsif: 'Gazni suyuqlikka yutdiradi. Karbonatlash va oleum minoralari shu turkumda.',
    xom: ['Absorbsion minora', 'Absorbsion kolonna', 'Karbonatlash minorasi'],
  },
  {
    kalit: 'yuqori-bosim', nom: 'Yuqori bosimli reaktor', guruh: 'sanoat', uchraydi: 2,
    narx: 0, gemsNarxi: 60, sanoat: true, icon: '🛢️',
    tavsif: 'Yuzlab atmosfera bosim — ammiak sintezi kabi jarayonlar uchun.',
    xom: ['Yuqori bosimli kolonna', 'Yuqori bosimli reaktor'],
  },
  {
    kalit: 'kompressor', nom: 'Kompressor', guruh: 'sanoat', uchraydi: 1,
    narx: 0, gemsNarxi: 30, sanoat: true, icon: '🌬️',
    tavsif: 'Gazni siqadi. Yuqori bosimli reaktorsiz ma\'nosi yo\'q.',
    xom: ['Kompressor'],
  },
  {
    kalit: 'issiqlik-almashtirgich', nom: 'Issiqlik almashtirgich', guruh: 'sanoat', uchraydi: 2,
    narx: 0, gemsNarxi: 25, sanoat: true, icon: '🔀',
    tavsif: 'Chiqayotgan issiq oqim kirayotgan sovuq oqimni isitadi — sanoat jarayonining tejamkorligi shunda.',
    xom: ['Issiqlik almashtirgich', 'Havo isitgich'],
  },
  {
    kalit: 'domna-pechi', nom: 'Domna pechi', guruh: 'sanoat', uchraydi: 1,
    narx: 0, gemsNarxi: 80, sanoat: true, icon: '🌋',
    tavsif: 'Temir rudasidan cho\'yan olish. Eng yirik metallurgiya qurilmasi.',
    xom: ['Domna pechi'],
  },
  {
    kalit: 'konvertor', nom: 'Konvertor', guruh: 'sanoat', uchraydi: 1,
    narx: 0, gemsNarxi: 55, sanoat: true, icon: '🫗',
    tavsif: 'Cho\'yandan po\'lat oladi: kislorod puflab ortiqcha uglerodni yondiradi.',
    xom: ['Konvertor'],
  },
  {
    kalit: 'elektr-yoyi-pechi', nom: 'Elektr yoyi pechi', guruh: 'sanoat', uchraydi: 1,
    narx: 0, gemsNarxi: 65, sanoat: true, icon: '⚡',
    tavsif: 'Elektr yoyi bilan 3000 °C gacha — eng chidamli moddalar uchun.',
    xom: ['Elektr yoyi pechi'],
  },
  {
    kalit: 'sanoat-pechi', nom: 'Sanoat pechi', guruh: 'sanoat', uchraydi: 5,
    narx: 0, gemsNarxi: 45, sanoat: true, icon: '🏭',
    tavsif: 'Aylanma, shaxta, reforming, kalsinlash va retorta pechlari — uzluksiz yuqori haroratli qayta ishlash.',
    xom: ['Aylanma pech', 'Shaxta pechi', 'Reforming pechi', 'Kalsinlash pechi', 'Retorta pechi', 'Vanna pechi'],
  },
]
