// app/api/quotes/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DailyQuote jadvali bo'sh bo'lganda ishlatiladigan gaplar. Sana bo'yicha
// aylanadi, ya'ni har kuni boshqasi chiqadi. Admin panelidan haqiqiy gaplar
// qo'shilgach, bu ro'yxatga umuman murojaat qilinmaydi.
const ZAXIRA_GAPLAR = [
  { textUz: "Kimyo — bu hayotning tili.", author: 'JDA KIMYO', icon: '🧪', color: 'purple' },
  { textUz: "Hech narsa yo'qolmaydi, hech narsa yaratilmaydi — hammasi o'zgaradi.", author: 'Antuan Lavuazye', icon: '⚗️', color: 'blue' },
  { textUz: 'Tajribasiz nazariya — quruq gap, nazariyasiz tajriba — ko\'r harakat.', author: 'JDA KIMYO', icon: '🔬', color: 'green' },
  { textUz: 'Elementlarning xossalari ularning atom massalariga davriy bog\'liqdir.', author: 'Dmitriy Mendeleyev', icon: '📊', color: 'amber' },
  { textUz: 'Kuzatishda tasodif faqat tayyorlangan aqlga yor bo\'ladi.', author: 'Lui Paster', icon: '💡', color: 'indigo' },
  { textUz: 'Bir tajriba ming taxminga arziydi.', author: 'JDA KIMYO', icon: '🧫', color: 'rose' },
  { textUz: 'Har bir murakkab birikma oddiy bog\'lanishdan boshlanadi.', author: 'JDA KIMYO', icon: '🔗', color: 'blue' },
]

// GET - Bugungi gapni olish (public, auth kerak emas)
export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Avval bugungi maxsus gap bormi tekshirish
    const todayQuote = await prisma.dailyQuote.findFirst({
      where: {
        isActive: true,
        displayDate: today
      }
    })

    if (todayQuote) {
      // Ko'rsatilgan sonini oshirish
      await prisma.dailyQuote.update({
        where: { id: todayQuote.id },
        data: { timesShown: { increment: 1 } }
      })

      return NextResponse.json({
        success: true,
        quote: todayQuote,
        type: 'special' // Maxsus sana uchun
      })
    }

    // 2. Maxsus gap yo'q bo'lsa, tasodifiy faol gap olish
    const activeQuotes = await prisma.dailyQuote.findMany({
      where: {
        isActive: true,
        OR: [
          { displayDate: null }, // Tasodifiy gaplar
          { displayDate: { lt: today } } // O'tgan maxsus gaplar
        ]
      },
      orderBy: { timesShown: 'asc' } // Eng kam ko'rsatilganlardan boshlash
    })

    if (activeQuotes.length === 0) {
      // Bazada gap bo'lmasa ham har kuni boshqasi ko'rinadi. Avval bu yerda
      // bitta qotib qolgan gap qaytarilardi — DailyQuote jadvali bo'sh
      // bo'lgani uchun foydalanuvchi doim o'sha bir iqtibosni ko'rardi.
      // Admin panelidan gap qo'shilsa, yuqoridagi mantiq ishga tushadi.
      const kun = Math.floor(Date.now() / 86400000)
      const gap = ZAXIRA_GAPLAR[kun % ZAXIRA_GAPLAR.length]

      return NextResponse.json({
        success: true,
        quote: gap,
        type: 'fallback'
      })
    }

    // Tasodifiy gap tanlash (eng kam ko'rsatilganlardan)
    const minShown = activeQuotes[0].timesShown
    const leastShown = activeQuotes.filter(q => q.timesShown === minShown)
    const randomQuote = leastShown[Math.floor(Math.random() * leastShown.length)]

    // Ko'rsatilgan sonini oshirish
    await prisma.dailyQuote.update({
      where: { id: randomQuote.id },
      data: { timesShown: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      quote: randomQuote,
      type: 'random'
    })
  } catch (error) {
    console.error('[Public Quotes GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}