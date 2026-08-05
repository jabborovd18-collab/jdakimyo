// app/api/telegram/ulash/route.js
//
// Telegram bilan bog'lanishni saytdan boshqarish: holatni ko'rish,
// bog'lash kodini olish va ulanishni uzish.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { telegramSozlanganmi, telegramYubor } from '@/lib/telegram'
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from '@/lib/ip-cheklov'

/** Kod necha daqiqa amal qiladi */
const AMAL_DAQIQA = 10

/**
 * Chalkashadigan belgilar (0/O, 1/I/L) ATAYLAB olib tashlangan:
 * kodni odam ekrandan o'qib telefonga ko'chiradi.
 */
const ALIFBO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function kodYarat() {
  let kod = ''
  for (let i = 0; i < 8; i++) {
    kod += ALIFBO[Math.floor(Math.random() * ALIFBO.length)]
  }
  return kod
}

/** Bot manzili — deep link uchun */
function botNomi() {
  return (process.env.TELEGRAM_BOT_USERNAME || '').replace(/^@/, '')
}

// GET — holat
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ulanish = await prisma.telegramUlanish.findUnique({
      where: { userId: session.user.id },
      select: { username: true, xabarlar: true, bogladi: true },
    })

    return NextResponse.json({
      success: true,
      // Sozlanmagan bo'lsa UI bo'limni umuman ko'rsatmaydi — ishlamaydigan
      // tugmani chizib qo'yish eng chalg'ituvchi variant
      ishlaydi: telegramSozlanganmi() && Boolean(botNomi()),
      bot: botNomi() || null,
      ulangan: Boolean(ulanish),
      ulanish: ulanish || null,
    })
  } catch (error) {
    console.error('[Telegram ulash GET]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}

// POST — yangi bog'lash kodi
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!telegramSozlanganmi() || !botNomi()) {
      return NextResponse.json(
        { error: 'Telegram boti hali sozlanmagan' },
        { status: 503 }
      )
    }

    const mavjud = await prisma.telegramUlanish.findUnique({
      where: { userId: session.user.id },
    })
    if (mavjud) {
      return NextResponse.json(
        { error: 'Hisobingiz allaqachon Telegramga ulangan' },
        { status: 400 }
      )
    }

    const kod = kodYarat()
    const amalQiladi = new Date(Date.now() + AMAL_DAQIQA * 60 * 1000)

    // Har so'rovda ESKI kod almashtiriladi: bir vaqtda ikkita amal
    // qiluvchi kod qolsa, birinchisini ko'rib qolgan odam keyin ham
    // ishlatib qolardi.
    await prisma.telegramKod.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, kod, amalQiladi },
      update: { kod, amalQiladi },
    })

    return NextResponse.json({
      success: true,
      kod,
      daqiqa: AMAL_DAQIQA,
      // Deep link: odam bosadi, Telegram ochiladi va kod o'zi yuboriladi.
      // Kodni qo'lda ko'chirish kerak emas — eng ko'p xato shu yerda
      // bo'ladi.
      havola: `https://t.me/${botNomi()}?start=${kod}`,
    })
  } catch (error) {
    console.error('[Telegram ulash POST]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}

/**
 * PUT — BOTDAN olingan kodni qabul qilish (ikkinchi usul).
 *
 * Birinchi usul: sayt kod beradi → botga yuboriladi.
 * Ikkinchi usul: bot kod beradi → shu yerga kiritiladi.
 *
 * Ikkalasi ham kerak, chunki odam ishni qayerdan boshlagani oldindan
 * ma'lum emas: kimdir saytda o'tiradi, kimdir Telegramda.
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { kod } = await request.json().catch(() => ({}))
    const tozaKod = String(kod || '').trim().toUpperCase()

    if (!tozaKod) {
      return NextResponse.json({ error: 'Kodni kiriting' }, { status: 400 })
    }

    // Taxmin qilishdan himoya IP darajasida: noto'g'ri kod bo'yicha
    // hech qanday yozuv topilmaydi, ya'ni urinishni kodning o'zida
    // sanab bo'lmaydi.
    const ip = soravchiIp(request)
    const cheklov = await chekloqniTekshir('tgkod', ip)
    if (!cheklov.ok) {
      return NextResponse.json(
        { error: `Juda ko'p urinish. ${kutishMatni(cheklov.kutish)} dan keyin qayta urining.` },
        { status: 429 }
      )
    }
    await urinishniQayd('tgkod', ip)

    const mavjud = await prisma.telegramUlanish.findUnique({
      where: { userId: session.user.id },
    })
    if (mavjud) {
      return NextResponse.json(
        { error: 'Hisobingiz allaqachon Telegramga ulangan' },
        { status: 400 }
      )
    }

    const yozuv = await prisma.telegramBotKod.findUnique({ where: { kod: tozaKod } })

    // NOTO'G'RI VA MUDDATI O'TGAN KOD BIR XIL XABAR BERADI. Farqlansa,
    // taxmin qilayotgan odam "bunday kod bor, lekin eskirgan" degan
    // ma'lumotni olardi.
    if (!yozuv || yozuv.amalQiladi < new Date()) {
      return NextResponse.json(
        { error: 'Kod noto\'g\'ri yoki muddati tugagan. Botdan yangisini oling.' },
        { status: 400 }
      )
    }

    // O'sha Telegram hisobi boshqa foydalanuvchiga ulangan bo'lishi
    // mumkin — `chatId` yagona bo'lishi shart
    const bandmi = await prisma.telegramUlanish.findUnique({
      where: { chatId: yozuv.chatId },
    })
    if (bandmi) {
      return NextResponse.json(
        { error: 'Bu Telegram hisobi boshqa foydalanuvchiga ulangan' },
        { status: 400 }
      )
    }

    // Kod ISHLATILDI — darhol o'chiriladi. Bir martalik bo'lmasa,
    // kodni ko'rib qolgan odam keyin ham ishlatib qolardi.
    await prisma.$transaction([
      prisma.telegramUlanish.create({
        data: {
          userId: session.user.id,
          chatId: yozuv.chatId,
          username: yozuv.username,
        },
      }),
      prisma.telegramBotKod.delete({ where: { id: yozuv.id } }),
      // Boshqa yo'nalishdagi kod ham keraksiz bo'lib qoldi
      prisma.telegramKod.deleteMany({ where: { userId: session.user.id } }),
    ])

    // Ulanganini botda ham tasdiqlaymiz: odam saytda tugma bosdi,
    // natijani Telegramda ko'rishi kerak
    telegramYubor(
      yozuv.chatId,
      '✅ Ulandi.\n\nEndi saytdagi bildirishnomalar shu yerga ham keladi.',
      { klaviatura: true }
    ).catch(() => {})

    return NextResponse.json({ success: true, message: '✓ Telegram ulandi' })
  } catch (error) {
    console.error('[Telegram ulash PUT]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}

// DELETE — ulanishni uzish
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // `deleteMany` — yozuv bo'lmasa ham xato bermaydi, ya'ni ikki marta
    // bosilgan tugma 500 qaytarmaydi
    await prisma.telegramUlanish.deleteMany({ where: { userId: session.user.id } })
    await prisma.telegramKod.deleteMany({ where: { userId: session.user.id } })

    return NextResponse.json({ success: true, message: 'Telegram uzildi' })
  } catch (error) {
    console.error('[Telegram ulash DELETE]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
