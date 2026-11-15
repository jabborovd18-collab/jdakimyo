// app/api/chat/[id]/route.js
//
// GET    — suhbat xabarlari (ochilganda o'qilgan deb belgilanadi)
// POST   — xabar yuborish
// PUT    — so'rovni qabul qilish yoki rad etish
// DELETE — o'z xabarini o'chirish (?xabarId=)
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  ChatXatosi, MAX_QADALGAN_SUHBAT, MAX_UZUNLIK, ODAM, blokHolati, qatnashchimi, sherik, yozishMumkinmi,
} from '@/lib/chat'
import { xabarYubor } from '@/lib/bildirishnoma'

async function suhbatniTekshir(id, menId) {
  const suhbat = await prisma.conversation.findUnique({
    where: { id },
    include: { user1: { select: ODAM }, user2: { select: ODAM } },
  })

  if (!suhbat || !qatnashchimi(suhbat, menId)) {
    // "Ruxsat yo'q" o'rniga "topilmadi": begona odam suhbat mavjudligini
    // ham bilmasligi kerak
    throw new ChatXatosi('Suhbat topilmadi', 404)
  }
  return suhbat
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { id } = await params
    const menId = session.user.id
    const suhbat = await suhbatniTekshir(id, menId)

    const sherikId = sherik(suhbat, menId)
    const odam = suhbat.user1Id === sherikId ? suhbat.user1 : suhbat.user2

    const [xabarlar, blok] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: 'asc' },
        take: 200,
        include: {
          replyTo: {
            select: { id: true, matn: true, ochirilgan: true, senderId: true },
          },
        },
      }),
      blokHolati(menId, sherikId),
    ])

    // Ochilganda menga kelgan xabarlar o'qilgan bo'ladi
    await prisma.message.updateMany({
      where: { conversationId: id, senderId: { not: menId }, oqilgan: false },
      data: { oqilgan: true },
    })

    const qadalganVaqt = suhbat.user1Id === menId ? suhbat.user1PinnedAt : suhbat.user2PinnedAt

    return NextResponse.json({
      success: true,
      suhbat: {
        id: suhbat.id,
        holat: suhbat.holat,
        menBoshladim: suhbat.boshlovchiId === menId,
        qadalgan: Boolean(qadalganVaqt),
        qadalganVaqt,
        odam,
      },
      blok,
      xabarlar: xabarlar.map((x) => ({
        id: x.id,
        matn: x.ochirilgan ? null : x.matn,
        ochirilgan: x.ochirilgan,
        meniki: x.senderId === menId,
        oqilgan: x.oqilgan,
        createdAt: x.createdAt,
        replyTo: x.replyTo
          ? {
              id: x.replyTo.id,
              matn: x.replyTo.ochirilgan ? null : x.replyTo.matn,
              ochirilgan: x.replyTo.ochirilgan,
              meniki: x.replyTo.senderId === menId,
            }
          : null,
      })),
    })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat suhbat GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { id } = await params
    const menId = session.user.id
    const suhbat = await suhbatniTekshir(id, menId)
    const sherikId = sherik(suhbat, menId)

    const { matn, replyToId } = await request.json()
    const toza = String(matn || '').trim()
    if (!toza) return NextResponse.json({ error: 'Xabar bo\'sh' }, { status: 400 })
    if (toza.length > MAX_UZUNLIK) {
      return NextResponse.json(
        { error: `Xabar ${MAX_UZUNLIK} belgidan oshmasligi kerak` },
        { status: 400 },
      )
    }

    if (suhbat.holat === 'rad') {
      return NextResponse.json({ error: 'Bu suhbat yopilgan' }, { status: 403 })
    }

    // Bloklash va taqiq har xabarda qayta tekshiriladi: suhbat ochilgandan
    // keyin ham bloklanishi mumkin
    await yozishMumkinmi(menId, sherikId)

    let replyTarget = null
    if (typeof replyToId === 'string' && replyToId.trim()) {
      replyTarget = await prisma.message.findFirst({
        where: { id: replyToId.trim(), conversationId: id },
        select: { id: true, matn: true, ochirilgan: true, senderId: true },
      })
      if (!replyTarget) {
        return NextResponse.json({ error: 'Javob berilayotgan xabar topilmadi' }, { status: 400 })
      }
    }

    // So'rov paytida faqat BOSHLOVCHI yoza oladi... aslida teskarisi:
    // qabul qiluvchi javob yozsa, bu so'rovni qabul qilgani bo'ladi.
    const yangiHolat =
      suhbat.holat === 'sorov' && suhbat.boshlovchiId !== menId ? 'faol' : suhbat.holat

    const xabar = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: menId,
        matn: toza,
        ...(replyTarget ? { replyToId: replyTarget.id } : {}),
      },
    })

    await prisma.conversation.update({
      where: { id },
      data: { oxirgiXabar: xabar.createdAt, holat: yangiHolat },
    })

    // So'rov holatidagi xabar bildirishnoma YUBORMAYDI: aks holda
    // so'rovlar bo'limining ma'nosi qolmasdi — istalgan odam
    // bildirishnoma yuborib bezovta qila olardi.
    if (yangiHolat === 'faol') {
      await xabarYubor(sherikId, {
        turi: 'chat',
        icon: '💬',
        sarlavha: `${session.user.fullName || session.user.username}: yangi xabar`,
        matn: toza.slice(0, 120),
        havola: `/chat?suhbat=${id}`,
      })
    }

    return NextResponse.json({
      success: true,
      xabar: {
        id: xabar.id,
        matn: xabar.matn,
        meniki: true,
        ochirilgan: false,
        oqilgan: false,
        createdAt: xabar.createdAt,
        replyTo: replyTarget
          ? {
              id: replyTarget.id,
              matn: replyTarget.ochirilgan ? null : replyTarget.matn,
              ochirilgan: replyTarget.ochirilgan,
              meniki: replyTarget.senderId === menId,
            }
          : null,
      },
      holat: yangiHolat,
    })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat xabar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { id } = await params
    const menId = session.user.id
    const suhbat = await suhbatniTekshir(id, menId)

    const { amal } = await request.json()

    if (amal === 'qada' || amal === 'qadashdan_ol') {
      if (suhbat.holat === 'rad') {
        return NextResponse.json({ error: 'Rad etilgan suhbatni qadab bo\'lmaydi' }, { status: 400 })
      }
      const pinMaydon = suhbat.user1Id === menId ? 'user1PinnedAt' : 'user2PinnedAt'

      if (amal === 'qada') {
        if (suhbat[pinMaydon]) {
          return NextResponse.json({
            success: true,
            holat: suhbat.holat,
            qadalgan: true,
            qadalganVaqt: suhbat[pinMaydon],
            message: 'Suhbat allaqachon qadalgan',
          })
        }

        const yangi = await prisma.$transaction(async (tx) => {
          const qadalganSoni = await tx.conversation.count({
            where: {
              holat: { not: 'rad' },
              OR: [
                { user1Id: menId, user1PinnedAt: { not: null } },
                { user2Id: menId, user2PinnedAt: { not: null } },
              ],
            },
          })
          if (qadalganSoni >= MAX_QADALGAN_SUHBAT) {
            throw new ChatXatosi(`Ko'pi bilan ${MAX_QADALGAN_SUHBAT} ta suhbatni qadash mumkin`, 400)
          }
          return tx.conversation.update({
            where: { id },
            data: { [pinMaydon]: new Date() },
          })
        })

        return NextResponse.json({
          success: true,
          holat: yangi.holat,
          qadalgan: true,
          qadalganVaqt: yangi[pinMaydon],
          message: 'Suhbat yuqoriga qadaldi',
        })
      }

      const yangi = await prisma.conversation.update({
        where: { id },
        data: { [pinMaydon]: null },
      })

      return NextResponse.json({
        success: true,
        holat: yangi.holat,
        qadalgan: false,
        qadalganVaqt: null,
        message: 'Suhbat qadashdan olindi',
      })
    }

    // So'rovga faqat QABUL QILUVCHI javob beradi
    if (suhbat.boshlovchiId === menId) {
      return NextResponse.json(
        { error: 'O\'z so\'rovingizni o\'zingiz qabul qila olmaysiz' },
        { status: 400 },
      )
    }

    if (amal !== 'qabul' && amal !== 'rad') {
      return NextResponse.json({ error: 'Amal noto\'g\'ri' }, { status: 400 })
    }

    const yangi = await prisma.conversation.update({
      where: { id },
      data: { holat: amal === 'qabul' ? 'faol' : 'rad' },
    })

    return NextResponse.json({
      success: true,
      holat: yangi.holat,
      message: amal === 'qabul' ? '✓ So\'rov qabul qilindi' : 'So\'rov rad etildi',
    })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat suhbat PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { id } = await params
    const menId = session.user.id
    await suhbatniTekshir(id, menId)

    const { searchParams } = new URL(request.url)
    const xabarId = searchParams.get('xabarId')
    if (!xabarId) return NextResponse.json({ error: 'xabarId majburiy' }, { status: 400 })

    // `senderId` sharti: faqat yozgan odam o'chira oladi
    const natija = await prisma.message.updateMany({
      where: { id: xabarId, conversationId: id, senderId: menId },
      data: { ochirilgan: true },
    })

    if (natija.count === 0) {
      return NextResponse.json({ error: 'Xabar topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Xabar o\'chirildi' })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat xabar DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
