// lib/sayt-malumot.js
//
// PLATFORMANING O'ZI HAQIDAGI YAGONA MANBA.
//
// NEGA KERAK BO'LDI. "JDA KIMYO nima?" degan savolga javob saytda uch
// joyda yozilardi: `app/layout.js` dagi JSON-LD, bosh sahifadagi matn va
// `/ishlashi`. Uchtasi bir-biridan mustaqil edi va ular allaqachon
// ajralib ketgan — layout "o'rganish platformasi" desa, `/ishlashi`
// "oliy kimyo platformasi" derdi. Sun'iy intellekt qidiruvi uchun bu
// eng yomon holat: u saytni bitta ANIQ narsa deb tanishi kerak, har
// sahifada boshqacha ta'riflangan narsa deb emas (AGENTS.md 1-band).
//
// Bu yerda faqat platformaning O'ZI haqidagi ma'lumot turadi. Kontent
// hajmi `lib/ilmiy-hajm.json` da (o'zi sanaladi), fanlar ro'yxati
// `lib/fanlar.js` da — ular bu yerda TAKRORLANMAYDI.

/** Sayt manzili. www BILAN: kontentni 200 bilan qaytaradigan yagona host shu. */
export const DOMEN = 'https://www.jdakimyo.uz'

export const NOM = 'JDA KIMYO'

/**
 * BIR JUMLALI TA'RIF. Internetning hamma joyida — saytda, Telegramda,
 * Instagramda — AYNAN shu jumla turishi kerak. AI qidiruvi entity'ni
 * takrorlanadigan ta'rif orqali taniydi; har joyda boshqacha yozilgan
 * ta'rif esa uni ikki xil narsa deb o'ylashga majbur qiladi.
 */
export const TARIF = "O'zbek tilidagi oliy kimyo ta'lim platformasi."

/** Uzunroq ta'rif — meta description va JSON-LD uchun. */
export const TARIF_TOLIQ =
  "JDA KIMYO — o'zbek tilida oliy kimyoni o'rganish uchun bepul ta'lim " +
  "platformasi: koordinatsion kimyo mavzulari, testlar, virtual " +
  "laboratoriya, ilmiy tahlil usullari va aylantirib ko'riladigan 3D modellar."

export const YARATUVCHI = {
  nom: 'Diyorbek Jabborov Arslonivich',
  qisqaNom: 'Diyorbek Jabborov',
  telegram: 'https://t.me/diyorbek_jabborov',
  instagram: 'https://instagram.com/d.arslonivich',
  pochta: 'jabborovd18@gmail.com',
}

/**
 * Tashkil etilgan yil — 2025. Faqat YIL yozilgan, oy va kun emas:
 * aniq sana tasdiqlanmagan, taxminiy sana esa yolg'on son bo'lardi.
 */
export const TASHKIL_YILI = '2025'

/**
 * RASMIY HISOBLAR (schema.org `sameAs`).
 *
 * Bu ro'yxat "JDA KIMYO bu — mana shu hisoblar" degan da'vo. Shuning
 * uchun bu yerga faqat ISHLAYOTGAN va platformaning O'ZIGA tegishli
 * hisob yoziladi. Yaratuvchining shaxsiy hisoblari pastda, alohida:
 * ular Person entity'siga tegishli, tashkilotga emas.
 *
 * Reddit, YouTube va Pinterest hisoblari ochilgach shu yerga
 * qo'shiladi — ochilmasidan oldin emas.
 */
export const RASMIY_HISOBLAR = [
  'https://instagram.com/jdakimyo.uz',
  'https://t.me/jdakimyouz',
  'https://t.me/jdakimyouzbot',
]

/**
 * BAZADAN O'LCHANGAN SONLAR.
 *
 * Bu sonlar bazaga so'rov yuborib o'lchangan va ATAYLAB PASTGA
 * yaxlitlangan. Yaxlitlash yo'nalishi muhim: kontent faqat o'sadi, ya'ni
 * kam aytilgan son vaqt o'tishi bilan ham to'g'ri bo'lib qolaveradi,
 * ko'p aytilgani esa yolg'onga aylanadi.
 *
 * 2026-08-09 da o'lchangan haqiqiy qiymatlar: 445 savol, 249 reaksiya
 * (shundan laboratoriyada o'tkazsa bo'ladigani 207), 312 katalog yozuvi,
 * 16 yutuq ta'rifi.
 *
 * Qayta o'lchash: `node scripts/sayt-sonlarini-olcha.js`
 */
export const BAZA = {
  savollar: '440+',
  // Laboratoriya haqida gapirganda KICHIK son aytiladi (249 emas, 200+):
  // qolgan reaksiyalar katalog uchun va ularni o'tkazib bo'lmaydi —
  // odam sinab ko'rib topa olmasa, son yolg'on bo'lib chiqadi.
  reaksiyalar: '200+',
  katalog: '300+',
  yutuqlar: '16',
  olchanganSana: '2026-08-09',
}

/**
 * Sayt haqidagi ma'lumot oxirgi marta qachon tekshirilgani.
 * `/jda-kimyo` sahifasi shuni ko'rsatadi — AI qidiruvi ma'lumotning
 * qachonligini bilsa, uni ishonch bilan keltiradi.
 */
export const MALUMOT_SANASI = '2026-08-22'
