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
// Bu yerda faqat platformaning O'ZI haqidagi ma'lumot turadi. Fanlar ro'yxati
// `lib/fanlar.js` da — u bu yerda TAKRORLANMAYDI.

/** Sayt manzili. www BILAN: kontentni 200 bilan qaytaradigan yagona host shu. */
export const DOMEN = 'https://www.jdakimyo.uz'

export const NOM = 'JDA KIMYO'

/**
 * BIR JUMLALI TA'RIF. Internetning hamma joyida — saytda, Telegramda,
 * Instagramda — AYNAN shu jumla turishi kerak. AI qidiruvi entity'ni
 * takrorlanadigan ta'rif orqali taniydi; har joyda boshqacha yozilgan
 * ta'rif esa uni ikki xil narsa deb o'ylashga majbur qiladi.
 */
export const TARIF = "O'zbek tilidagi maktab va oliy kimyo ta'lim platformasi."

/** Uzunroq ta'rif — meta description va JSON-LD uchun. */
export const TARIF_TOLIQ =
  "JDA KIMYO — o'zbek tilida maktab va oliy kimyoni o'rganish platformasi: " +
  "maktab darsliklari, oliy kimyo video darslari, milliy sertifikat Rasch modeli, " +
  "ustoz testlari va interaktiv elektron doska."

export const YARATUVCHI = {
  nom: 'Diyorbek Jabborov Arslonivich',
  qisqaNom: 'Diyorbek Jabborov',
  telegram: 'https://t.me/diyorbek_jabborov',
  instagram: 'https://instagram.com/d.arslonivich',
  // Kasbiy profil. "Kim yaratgan?" degan savolga javob qidirilganda
  // qidiruv tizimlari uchun bu Telegram yoki Instagramdan og'irroq
  // manba: u yerda lavozim, tashkilot va sayt havolasi bir joyda.
  linkedin: 'https://www.linkedin.com/in/diyorbek-arslonivich',
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
  'https://www.youtube.com/@jdakimyouz',
]

/** Bazadan o'lchangan son. Kam aytilgan son keyin ham to'g'ri bo'lib qoladi. */
export const BAZA = {
  yutuqlar: '16',
}

/**
 * Sayt haqidagi ma'lumot oxirgi marta qachon tekshirilgani.
 * `/jda-kimyo` sahifasi shuni ko'rsatadi — AI qidiruvi ma'lumotning
 * qachonligini bilsa, uni ishonch bilan keltiradi.
 */
export const MALUMOT_SANASI = '2026-11-06'

/**
 * OCHIQ MA'LUMOT TO'PLAMI.
 *
 * `RASMIY_HISOBLAR` (ya'ni `sameAs`) ga ATAYLAB qo'shilmagan: `sameAs`
 * — "bu hisob ham men" degan da'vo, repozitoriya esa hisob emas,
 * mahsulot. Uni o'sha ro'yxatga qo'shish schema'ning ma'nosini buzardi.
 *
 * Bu yerda turishining sababi: sahifada havola bo'lishi shart. Repo
 * README'si saytga havola qiladi; sayt ham repoga havola qilsa,
 * bog'lanish ikki tomonlama bo'ladi va qidiruv tizimi ikkalasini
 * bog'lay oladi.
 *
 * Yasash: node scripts/gen-ochiq-lugat.js
 */
export const OCHIQ_LUGAT = 'https://github.com/jabborovd18-collab/uzbek-kimyo-lugat'
