// app/api/quotes/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      return NextResponse.json({
        success: true,
        quote: {
          textUz: "Kimyo — bu hayotning tili!",
          author: "JDA KIMYO",
          icon: "🧪",
          color: "purple"
        },
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