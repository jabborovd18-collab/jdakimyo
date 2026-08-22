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
// SONLAR BU YERDA YOZILMAYDI. Ular `lib/ilmiy-hajm.json` (o'zi
// sanaladi) va `lib/sayt-malumot.js` (bazadan o'lchangan) dan keladi.
import HAJM from '@/lib/ilmiy-hajm.json'
import { BAZA, YARATUVCHI, TASHKIL_YILI } from '@/lib/sayt-malumot'
import { FANLAR, ochiqFanlarSoni } from '@/lib/fanlar'

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
      "JDA KIMYO — o'zbek tilidagi oliy kimyo ta'lim platformasi. Unda " +
      "koordinatsion (kompleks) kimyo bo'yicha nazariy mavzular, " +
      `${HAJM.jamiTahlilVaMavzu} ta ilmiy sahifa, ${BAZA.savollar} test savoli, ` +
      `virtual laboratoriya va ${HAJM.modellar3d} ta aylantirib ko'riladigan ` +
      '3D model bor.',
  },
  {
    q: 'JDA KIMYO kimlar uchun?',
    a:
      "Kimyo yo'nalishidagi talabalar, oliy kimyoni mustaqil o'rganayotganlar, " +
      "maktab va oliygoh o'qituvchilari hamda olimpiadaga tayyorlanayotgan " +
      "o'quvchilar uchun. Materiallar o'zbek tilida yozilgan — bu daraja " +
      "uchun o'zbekcha manba deyarli yo'q.",
  },
  {
    q: 'JDA KIMYO bepulmi?',
    a:
      "Ha. Barcha mavzular, birikma sahifalari, testlar va virtual " +
      "laboratoriya bepul. Pullik qismi faqat tasdiq belgisi (galochka) va " +
      "unga bog'liq profil bezaklari — ular hech qanday o'quv materialini " +
      'yopmaydi.',
  },
  {
    q: "Koordinatsion kimyoni o'zbek tilida qayerdan o'rganish mumkin?",
    a:
      "JDA KIMYO platformasining /oquv bo'limida: klassifikatsiya, IUPAC " +
      "nomlanishi, kimyoviy bog'lanish, izomeriya va fazoviy tuzilish " +
      "ketma-ket bosqichlarda berilgan. Chuqurroq material — /ilmiy " +
      `bo'limida: ${HAJM.usullar} ta fiziko-kimyoviy tahlil usuli va ` +
      `${HAJM.birikmalar} ta birikmaning to'liq sahifasi.`,
  },
  {
    q: 'JDA KIMYOda nechta test savoli bor?',
    a:
      `${BAZA.savollar} test savoli, besh yo'nalish bo'yicha. Bundan tashqari ` +
      "ustozlar o'z testlarini tuzishi va guruhiga berishi mumkin. Son " +
      `${BAZA.olchanganSana} da o'lchangan va pastga yaxlitlangan.`,
  },
  {
    q: 'Virtual laboratoriya qanday ishlaydi?',
    a:
      `Brauzerda ochiladigan 3D xona: reagent tanlanadi, idishga quyiladi va ` +
      `reaksiya natijasi ko'rsatiladi. Bazada ${BAZA.reaksiyalar} reaksiya bor — ` +
      "tenglamasi, kuzatuvi va xavfsizlik belgilari bilan. Reaksiyalar hali " +
      'mutaxassis tomonidan tasdiqlanmagan.',
  },
  {
    q: '3D modellar mavjudmi?',
    a:
      `Ha. ${HAJM.modellar3d} ta kompleks birikmaning fazoviy modelini sichqoncha ` +
      "bilan aylantirib ko'rish mumkin — oktaedrik, tetraedrik va kvadrat " +
      "tekis tuzilishlar. Ular kompyuter uchun yozilgan; telefonda sekin " +
      'ishlashi mumkin.',
  },
  {
    q: "O'qituvchilar uchun panel bormi?",
    a:
      "Ha. Ustoz guruh ochadi, o'quvchilarni qabul qiladi, o'z testini tuzadi " +
      "(ochiq yoki yopiq), vazifa beradi va natijalarni ko'radi. Ustozlik " +
      "huquqini administratsiya beradi — ro'yxatdan o'tishda tanlanmaydi.",
  },
  {
    q: 'JDA KIMYOda qaysi kimyo fanlari bor?',
    a:
      `Rejada ${FANLAR.length} ta fan bor, hozircha ${ochiqFanlarSoni()} tasi ochiq: ` +
      "koordinatsion kimyo to'liq yozilgan. Qolganlari (analitik, fizikaviy, " +
      "organik, anorganik, kolloid va biokimyo) tayyor bo'lguncha ochiq " +
      "\"tayyor emas\" deb ko'rsatiladi — bo'sh sahifa ochib qo'yilmaydi.",
  },
  {
    q: 'JDA KIMYOni kim yaratgan?',
    a:
      `${YARATUVCHI.nom}. Platforma ${TASHKIL_YILI}-yilda boshlangan va bir kishi ` +
      "tomonidan yuritiladi: kontent, kod va tekshiruv ham. Bog'lanish — " +
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
    { nom: 'Ilmiy sahifa', qiymat: `${HAJM.jamiTahlilVaMavzu} ta` },
    { nom: 'Test savoli', qiymat: BAZA.savollar },
    { nom: 'Laboratoriya reaksiyasi', qiymat: BAZA.reaksiyalar },
    { nom: '3D model', qiymat: `${HAJM.modellar3d} ta` },
    { nom: 'Tahlil usuli', qiymat: `${HAJM.usullar} ta` },
    { nom: 'Birikma sahifasi', qiymat: `${HAJM.birikmalar} ta` },
    { nom: 'Fanlar', qiymat: `${FANLAR.length} tadan ${ochiqFanlarSoni()} tasi ochiq` },
  ]
}
