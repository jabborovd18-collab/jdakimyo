// app/ishlashi/faq.js
//
// `/ishlashi` sahifasining savol-javoblari.
//
// NEGA ALOHIDA FAYL. Bu ro'yxat ikki joyda kerak: ekranda
// (`korinish.js`, u "use client") va JSON-LD ichida (`page.js`, u
// server). Ikkalasida alohida yozilsa ular ajralib qoladi va Google
// "schema sahifada ko'rinmaydigan ma'lumot beryapti" deb FAQ belgisini
// bekor qiladi (AGENTS.md 1-band).
//
// "JDA KIMYO nima?", "bepulmi?" kabi PLATFORMA haqidagi savollar bu
// yerda emas — ular `/jda-kimyo` sahifasida. Bu yerda saytdan
// FOYDALANISH haqidagi savollar turadi.

export const FAQ = [
  {
    q: "Sayt pullikmi?",
    a: "Yo'q. Barcha mavzular, birikmalar, testlar va laboratoriya bepul. Kelajakda tasdiq belgisi (galochka) va unga bog'liq profil bezaklari pullik obuna bilan beriladi — lekin ular hech qanday o'quv materialini yopmaydi.",
  },
  {
    q: "Ro'yxatdan o'tish shartmi?",
    a: "O'qish uchun shart emas: mavzular, birikmalar va tahlil usullari hammaga ochiq. Hisob quyidagilar uchun kerak — test natijalarini saqlash, laboratoriya, sertifikat, do'stlar va chat, ustoz guruhiga qo'shilish.",
  },
  {
    q: "Sertifikatni qanday olaman?",
    a: "Sertifikatni JDA KIMYO administratsiyasi beradi — avtomatik berilmaydi va uni test topshirib \"yutib\" bo'lmaydi. Berilgan sertifikat bazada saqlanadi, noyob raqamga ega bo'ladi, QR kod orqali istalgan vaqtda tekshiriladi va PDF shaklida yuklab olinadi.",
  },
  {
    q: "Nega ba'zi fanlarda qulf turibdi?",
    a: "Chunki ular hali yozilmagan. Bo'sh sahifa ochib qo'yishdan ko'ra, ochiq \"tayyor emas\" deb ko'rsatishni to'g'ri deb bildik. Fan tayyor bo'lgach qulf ochiladi.",
  },
  {
    q: "Telefonda ishlaydimi?",
    a: "Matnli bo'limlar — ha. 3D modellar va laboratoriya xonasi esa kompyuter uchun yozilgan; telefonda ular sekin ishlashi yoki ochilmasligi mumkin. Shuning uchun telefonda kirganingizda ogohlantirish chiqadi.",
  },
  {
    q: "Ma'lumotlar qayerdan olingan?",
    a: "Ilmiy qism nufuzli darsliklar va bazalarga tayanadi: Cotton–Wilkinson, Miessler–Tarr, Greenwood–Earnshaw, SDBS va CSD. Laboratoriya reaksiyalari esa hali tasdiqlanmagan — buni sahifaning o'zi ham aytadi.",
  },
  {
    q: "Xato topsam nima qilay?",
    a: "Telegramda @diyorbek_jabborov ga yozing yoki jabborovd18@gmail.com ga xat yuboring. Qaysi sahifada, nima noto'g'ri ekanini yozsangiz — tezroq tuzatiladi.",
  },
  {
    q: "O'z maqolamni joylay olamanmi?",
    a: "Ha. Ilmiy bo'limda maqolani DOCX shaklida yuklaysiz, admin ko'rib chiqadi va tasdiqlangach bazada chiqadi.",
  },
  {
    q: "Ustoz huquqini qanday olaman?",
    a: "Ustozlik ro'yxatdan o'tishda tanlanmaydi — uni administratsiya beradi. Telegram yoki email orqali murojaat qiling: qayerda dars berishingizni yozing.",
  },
]
