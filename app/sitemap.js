// app/sitemap.js
//
// Sitemap — qidiruv tizimlari uchun sahifalar ro'yxati.
//
// NEGA KERAK EDI. Saytda 700 dan ortiq sahifa bor, lekin ularning
// ko'pchiligiga ichki havola uzun yo'l orqali boradi. Google faqat
// havola bo'yicha yursa, chuqurdagi sahifalarni oylab topmasligi
// mumkin. Sitemap ularning hammasini bir joyda ko'rsatadi.
//
// Ro'yxat FAYL TIZIMIDAN emas, qo'lda tuzilgan bo'limlardan chiqadi:
// shaxsiy kabinet, admin panel va API sahifalari indekslanmasligi kerak,
// fayllarni sanab chiqsak esa ular ham tushib qolardi.
import { prisma } from '@/lib/prisma'

const SAYT = 'https://jdakimyo.uz'

/** Qo'lda kiritiladigan asosiy bo'limlar */
const ASOSIY = [
  { yol: '', muhimlik: 1.0, yangilanish: 'daily' },
  { yol: '/oquv', muhimlik: 0.9, yangilanish: 'weekly' },
  { yol: '/ilmiy', muhimlik: 0.9, yangilanish: 'weekly' },
  { yol: '/birikmalar', muhimlik: 0.9, yangilanish: 'weekly' },
  { yol: '/oquv/video-darsliklar', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/laboratoriya', muhimlik: 0.7, yangilanish: 'weekly' },
  { yol: '/kanallar', muhimlik: 0.7, yangilanish: 'daily' },
  { yol: '/hamkorlik', muhimlik: 0.6, yangilanish: 'monthly' },
  { yol: '/hamkorlik/sayt-hamkorlari', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/faq', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/yangiliklar', muhimlik: 0.5, yangilanish: 'weekly' },
  { yol: '/qidiruv', muhimlik: 0.4, yangilanish: 'monthly' },
  { yol: '/ishlashi', muhimlik: 0.4, yangilanish: 'monthly' },
  { yol: '/login', muhimlik: 0.3, yangilanish: 'yearly' },
  { yol: '/register', muhimlik: 0.4, yangilanish: 'yearly' },
]

export default async function sitemap() {
  const hozir = new Date()

  const royxat = ASOSIY.map((s) => ({
    url: `${SAYT}${s.yol}`,
    lastModified: hozir,
    changeFrequency: s.yangilanish,
    priority: s.muhimlik,
  }))

  // Ochiq kanallar — ular tez-tez yangilanadi va indekslanishi foydali.
  // Baza javob bermasa sitemap baribir qaytadi: qidiruv tizimi bo'sh
  // javob olgandan ko'ra qisqa ro'yxat olgani yaxshi.
  try {
    const kanallar = await prisma.channel.findMany({
      where: { ochiq: true, faol: true },
      select: { slug: true, updatedAt: true },
    })

    for (const k of kanallar) {
      royxat.push({
        url: `${SAYT}/kanallar/${k.slug}`,
        lastModified: k.updatedAt,
        changeFrequency: 'daily',
        priority: 0.6,
      })
    }
  } catch (e) {
    console.error('[Sitemap] kanallar olinmadi:', e.message)
  }

  return royxat
}
