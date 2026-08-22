// app/robots.js
//
// Qidiruv robotlariga qaysi yo'llar indekslanmasligini aytadi.
//
// Yopiladigan joylar: shaxsiy kabinet, admin va ustoz panellari, API va
// autentifikatsiya sahifalari. Bularning hech biri qidiruvda kerak emas
// va ba'zilari (masalan /chat) shaxsiy.
//
// /sertifikat/verify/* ATAYLAB ochiq: sertifikat haqiqiyligini
// tekshiradigan havola qidiruvdan ham topilishi mumkin bo'lsin.
export default function robots() {
  return {
    rules: [
      {
        // NEGA AI ROBOTLARI ALOHIDA SANALGAN. `*` ularni allaqachon
        // qamrab olardi, ya'ni bu qator ruxsatni O'ZGARTIRMAYDI. U
        // ikki narsa uchun yozilgan:
        //   1) ChatGPT Search (`OAI-SearchBot`), Perplexity va Claude
        //      qidiruvi robots.txt ni tekshirganda o'z nomini ko'rsin —
        //      niyat ochiq bo'lsin, taxminga qolmasin;
        //   2) kelajakda kimdir `*` ni yopib qo'ysa, AI qidiruvi ham
        //      birga yopilib qolgani darrov ko'rinsin.
        //
        // MUHIM: ular BITTA guruhda turibdi, ya'ni taqiqlar ro'yxati
        // hammasiga bir xil. Alohida guruh yozilsa, robots.txt qoidasi
        // bo'yicha nomi aytilgan robot `*` ni umuman o'qimaydi va
        // pastdagi `disallow` ro'yxati unga tegmay qolardi — /admin va
        // /chat AI robotlariga ochilib ketardi.
        //
        // Ro'yxatda MODEL O'QITADIGAN robotlar (`GPTBot`, `CCBot`)
        // ataylab YO'Q: bu fayl qidiruvda ko'rinish haqida, kontentni
        // o'qitishga berish haqida emas. Ular `*` qoidasiga tushadi.
        userAgent: [
          '*',
          'OAI-SearchBot',   // ChatGPT Search indeksi
          'ChatGPT-User',    // ChatGPT foydalanuvchi so'rovi bo'yicha ochadi
          'PerplexityBot',   // Perplexity indeksi
          'Claude-SearchBot',
          'Claude-User',
          'Google-Extended', // Gemini/AI Overviews uchun Google signali
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/ustoz/',
          '/profil/',
          // Shaxsiy yozishma. Sahifada `robots: { index: false }` ham bor —
          // bu qator uni umuman so'ramaslikni aytadi.
          '/chat',
          '/hamkorlar',
          '/login',
          '/register',
          // Elektron doska — kirish ekrani, indekslanishi kerak emas
          '/doska',
        ],
      },
    ],
    // www BILAN: jdakimyo.uz 307 bilan www ga yo'naltiradi, ya'ni
    // kontentni rostdan qaytaradigan yagona host shu. Yo'naltiriladigan
    // manzilni ko'rsatish har bir so'rovga ortiqcha qadam qo'shadi.
    sitemap: 'https://www.jdakimyo.uz/sitemap.xml',
    host: 'https://www.jdakimyo.uz',
  }
}
