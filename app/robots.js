// app/robots.js
//
// Qidiruv robotlariga qaysi yo'llar indekslanmasligini aytadi.
//
// Yopiladigan joylar: shaxsiy kabinet, admin va ustoz panellari, API va
// autentifikatsiya sahifalari. Bularning hech biri qidiruvda kerak emas
// va ba'zilari (masalan /profil/chat) shaxsiy.
//
// /sertifikat/verify/* ATAYLAB ochiq: sertifikat haqiqiyligini
// tekshiradigan havola qidiruvdan ham topilishi mumkin bo'lsin.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/ustoz/',
          '/profil/',
          '/hamkorlar',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: 'https://jdakimyo.uz/sitemap.xml',
    host: 'https://jdakimyo.uz',
  }
}
