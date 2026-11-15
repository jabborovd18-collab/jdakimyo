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
    a: "Yo'q. O'quv materiallari va testlar bepul. Pullik qism faqat tasdiq belgisi va unga bog'liq profil bezaklari bilan bog'liq.",
  },
  {
    q: "Ro'yxatdan o'tish shartmi?",
    a: "O'qish uchun shart emas. Hisob test topshirish, natijalarni saqlash, ustoz guruhiga qo'shilish va xabar yozish uchun kerak.",
  },
  {
    q: "Sertifikatni qanday olaman?",
    a: "Milliy sertifikatga tayyorgarlik sinovida tizimga kirib yetarli ball to'plasangiz, JDA Kimyo sertifikati beriladi. Bu davlat sertifikati emas. Boshqa sertifikatlarni administratsiya beradi.",
  },
  {
    q: "Nega ba'zi fanlarda qulf turibdi?",
    a: "Chunki ular hali yozilmagan. Bo'sh sahifa ochib qo'yishdan ko'ra, ochiq \"tayyor emas\" deb ko'rsatishni to'g'ri deb bildik. Fan tayyor bo'lgach qulf ochiladi.",
  },
  {
    q: "Telefonda ishlaydimi?",
    a: "Ha, sayt telefonda ochiladi. Elektron doska esa katta ekran uchun mo'ljallangan.",
  },
  {
    q: "Xato topsam nima qilay?",
    a: "Telegramda @diyorbek_jabborov ga yozing yoki jabborovd18@gmail.com ga xat yuboring. Qaysi sahifada, nima noto'g'ri ekanini yozsangiz — tezroq tuzatiladi.",
  },
  {
    q: "Ustoz huquqini qanday olaman?",
    a: "Ustozlik ro'yxatdan o'tishda tanlanmaydi — uni administratsiya beradi. Telegram yoki email orqali murojaat qiling: qayerda dars berishingizni yozing.",
  },
]
