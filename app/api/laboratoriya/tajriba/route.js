// app/api/laboratoriya/tajriba/route.js
//
// GET  — hozirgi inventar bilan mumkin bo'lgan tajribalar va daftar.
// POST — tajriba o'tkazish.
//
// Mantiq lib/tajriba.js da: reaksiyani topish, jihozni tekshirish,
// reagentni sarflash va mahsulotni berish — hammasi server tomonda,
// bitta tranzaksiyada. Bu route faqat sessiyani tekshiradi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { LabXatosi, labDarajaHolati } from '@/lib/laboratoriya'
import { mumkinTajribalar, tajribaJurnali, tajribaniOtkaz } from '@/lib/tajriba'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const [mumkin, jurnal] = await Promise.all([
      mumkinTajribalar(session.user.id),
      tajribaJurnali(session.user.id),
    ])

    return NextResponse.json({ success: true, mumkin, jurnal })
  } catch (error) {
    console.error('[Tajriba GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { kalitlar, reactionId, miqdorlar, idish } = await request.json()
    if (!Array.isArray(kalitlar) || kalitlar.length === 0) {
      return NextResponse.json({ error: 'Reagent tanlanmagan' }, { status: 400 })
    }

    // `miqdorlar` — 3D laboratoriya qo'lda quygan miqdor (kalit → ml/gr).
    // 2D laboratoriya uni yubormaydi va ideal ulush oladi. Qiymatga
    // ishonilmaydi: u faqat nima sarflanishini belgilaydi, inventarda
    // borligini tranzaksiya ichidagi shartli update tekshiradi.
    const tozaMiqdorlar =
      miqdorlar && typeof miqdorlar === 'object' && !Array.isArray(miqdorlar)
        ? miqdorlar
        : null

    const natija = await tajribaniOtkaz(
      session.user.id,
      kalitlar,
      reactionId || null,
      tozaMiqdorlar,
      typeof idish === 'string' && idish ? idish : null,
    )

    // Bir to'plamdan bir nechta reaksiya chiqdi — foydalanuvchi tanlashi
    // kerak. Xato emas, shuning uchun 200.
    if (natija.tanlov) {
      return NextResponse.json({ success: true, tanlov: natija.tanlov })
    }

    const lab = await prisma.lab.findUnique({
      where: { userId: session.user.id },
      select: { tajriba: true, daraja: true },
    })

    return NextResponse.json({
      success: true,
      ...natija,
      daraja: labDarajaHolati(lab?.tajriba ?? 0),
    })
  } catch (error) {
    // "Reaksiya bo'lmadi" ham, "reagent yetmadi" ham foydalanuvchi
    // ko'radigan oddiy natija — server nosozligi emas.
    if (error instanceof LabXatosi) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error?.code === 'P2034' || error?.code === 'P2028') {
      return NextResponse.json(
        { error: 'Baza hozir band. Bir soniyadan keyin qayta urinib ko\'ring.' },
        { status: 409 },
      )
    }
    console.error('[Tajriba POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
