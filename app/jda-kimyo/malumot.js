// app/jda-kimyo/malumot.js
//
// "JDA KIMYO nima?" sahifasining MATNI.
//
// NEGA KO'RINISHDAN AJRATILGAN. Bu matnning bir qismi ikki joyda
// kerak: ekranda (`korinish.js`) va JSON-LD ichida (`page.js`). Agar
// FAQ ro'yxati ikkalasida alohida yozilsa, ular ajralib qoladi va
// Google "schema sahifada yo'q ma'lumot beryapti" deb belgini bekor
// qiladi (AGENTS.md 1-band).
//
// SONLAR BU YERDA YOZILMAYDI. Ular `lib/fanlar.js` va `lib/sayt-malumot.js`
// dan keladi.
import { BAZA, YARATUVCHI, TASHKIL_YILI } from '@/lib/sayt-malumot'
import { FANLAR, ochiqFanlarSoni, YETTI_SINF_MAVZULARI } from '@/lib/fanlar'

/**
 * FAQ — AI qidiruvi uchun eng qimmatli blok.
 *
 * Savollar odam qanday so'rasa shunday yozilgan ("JDA KIMYO bepulmi?"),
 * chunki ChatGPT'ga ham aynan shunday so'raladi. Javob birinchi
 * jumladayoq to'liq bo'lishi kerak: keltirilganda ko'pincha faqat
 * birinchi jumla olinadi.
 */
export const FAQ = [
  {
    q: 'JDA KIMYO nima?',
    a:
      "JDA KIMYO — o'zbek tilidagi maktab va oliy kimyo ta'lim platformasi. Unda " +
      "maktab darslari, oliy kimyo fanlari, ustoz testlari, masala yechish va " +
      'elektron doska bor.',
  },
  {
    q: 'JDA KIMYO kimlar uchun?',
    a:
      "Maktab o'quvchilari, kimyo yo'nalishidagi talabalar, milliy sertifikatga " +
      "tayyorlanayotganlar hamda maktab va oliygoh o'qituvchilari uchun. " +
      "Materiallar o'zbek tilida yozilgan.",
  },
  {
    q: 'JDA KIMYO bepulmi?',
    a:
      "Ha. O'quv materiallari va testlar bepul. Pullik qism faqat tasdiq belgisi " +
      "va unga bog'liq profil bezaklari bilan bog'liq, ular o'quv materialini yopmaydi.",
  },
  {
    q: 'JDA KIMYO davlat sertifikatini beradimi?',
    a:
      "Yo'q. Milliy sertifikatga tayyorgarlik sinovlari taxminiy daraja ko'rsatadi " +
      "va davlat sertifikati hisoblanmaydi.",
  },
  {
    q: "O'qituvchilar uchun panel bormi?",
    a:
      "Ha. Ustoz guruh ochadi, o'quvchilarni qabul qiladi, o'z testini tuzadi, " +
      "vazifa beradi va natijalarni ko'radi. Ustozlik huquqini administratsiya beradi.",
  },
  {
    q: 'JDA KIMYOda qaysi kimyo fanlari bor?',
    a:
      `Oliy kimyoda ${FANLAR.length} ta fan rejalashtirilgan, hozircha ${ochiqFanlarSoni()} tasi ochiq. ` +
      "Tayyor bo'lmagan fan ochiq \"tayyor emas\" deb ko'rsatiladi.",
  },
  {
    q: 'JDA KIMYOni kim yaratgan?',
    a:
      `${YARATUVCHI.nom}. Platforma ${TASHKIL_YILI}-yilda boshlangan. Bog'lanish — ` +
      `Telegram ${YARATUVCHI.telegram.replace('https://t.me/', '@')} yoki ${YARATUVCHI.pochta}.`,
  },
]

/**
 * Faktlar jadvali. AI qidiruvi aynan shunday "nom → qiymat" juftlarini
 * ishonch bilan keltiradi, uzun matndan ko'ra osonroq o'qiydi.
 */
export function FAKTLAR() {
  return [
    { nom: 'Nomi', qiymat: 'JDA KIMYO' },
    { nom: 'Turi', qiymat: "Ta'lim platformasi (veb-sayt)" },
    { nom: 'Tili', qiymat: "O'zbek (lotin)" },
    { nom: 'Yaratuvchi', qiymat: YARATUVCHI.nom },
    { nom: 'Boshlangan', qiymat: `${TASHKIL_YILI}-yil` },
    { nom: 'Narxi', qiymat: "O'quv materiallari bepul" },
    { nom: '7-sinf mavzulari', qiymat: `${YETTI_SINF_MAVZULARI.length} ta` },
    { nom: 'Yutuq turlari', qiymat: BAZA.yutuqlar },
    { nom: 'Fanlar', qiymat: `${FANLAR.length} tadan ${ochiqFanlarSoni()} tasi ochiq` },
  ]
}
