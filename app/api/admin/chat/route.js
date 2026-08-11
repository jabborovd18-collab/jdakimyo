// app/api/admin/chat/route.js
//
// Chat nazorati: shikoyatlar, ogohlantirishlar va yozish taqiqi.
//
// Moderatsiya huquqi bilan ochiladi (moderator ham ko'radi — noto'g'ri
// yozishmani tozalash uning ishi), lekin YOZISHMA MATNI faqat shikoyat
// bo'lgan suhbatda va faqat shikoyat ochilganda ko'rsatiladi: shaxsiy
// xatni sababsiz o'qish moderatsiya emas, kuzatuv bo'lardi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { ODAM } from '@/lib/chat'
import { qaydEt } from '@/lib/qaydnoma'
import { xabarYubor } from '@/lib/bildirishnoma'
import { sanaVaqt } from '@/lib/sana'

/** Taqiq eng ko'pi bilan shuncha kunga */
const MAX_KUN = 365

export async function GET(request) {
  const { isAdmin } = await checkAdminAuth('moderatsiya')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const holat = searchParams.get('holat') || 'yangi'
    const suhbatId = searchParams.get('suhbat')

    // Bitta shikoyat ochilganda yozishma ko'rsatiladi
    if (suhbatId) {
      const xabarlar = await prisma.message.findMany({
        where: { conversationId: suhbatId },
        orderBy: { createdAt: 'asc' },
        take: 200,
        include: { sender: { select: ODAM } },
      })
      return NextResponse.json({ success: true, xabarlar })
    }

    const [shikoyatlar, ogohlantirilganlar, taqiqlanganlar, sanoq] = await Promise.all([
      prisma.chatReport.findMany({
        where: holat === 'all' ? {} : { holat },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          reporter: { select: ODAM },
          reported: { select: { ...ODAM, chatWarnings: true, chatBlockedUntil: true } },
        },
      }),
      prisma.user.findMany({
        where: { chatWarnings: { gt: 0 } },
        orderBy: { chatWarnings: 'desc' },
        take: 30,
        select: { ...ODAM, chatWarnings: true, chatBlockedUntil: true, chatBlockedReason: true },
      }),
      prisma.user.findMany({
        where: { chatBlockedUntil: { gt: new Date() } },
        orderBy: { chatBlockedUntil: 'desc' },
        select: { ...ODAM, chatWarnings: true, chatBlockedUntil: true, chatBlockedReason: true },
      }),
      prisma.chatReport.groupBy({ by: ['holat'], _count: true }),
    ])

    // Eng ko'p shikoyat tushgan hisoblar — takroriy muammoni ko'rsatadi
    const kopShikoyat = await prisma.chatReport.groupBy({
      by: ['reportedId'],
      _count: true,
      orderBy: { _count: { reportedId: 'desc' } },
      take: 10,
    })
    const kopOdamlar = await prisma.user.findMany({
      where: { id: { in: kopShikoyat.map((k) => k.reportedId) } },
      select: { ...ODAM, chatWarnings: true, chatBlockedUntil: true },
    })

    return NextResponse.json({
      success: true,
      shikoyatlar,
      ogohlantirilganlar,
      taqiqlanganlar,
      kopShikoyat: kopShikoyat.map((k) => ({
        soni: k._count,
        odam: kopOdamlar.find((o) => o.id === k.reportedId) || null,
      })),
      sanoq: Object.fromEntries(sanoq.map((s) => [s.holat, s._count])),
    })
  } catch (error) {
    console.error('[Admin chat GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const { isAdmin, user: admin } = await checkAdminAuth('moderatsiya')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { amal, userId, shikoyatId, sabab, kunlar, izoh } = await request.json()

    // ─── Shikoyatni yopish ───
    if (amal === 'shikoyatHolati') {
      if (!shikoyatId || !['korildi', 'chora', 'rad'].includes(sabab)) {
        return NextResponse.json({ error: 'Ma\'lumot to\'liq emas' }, { status: 400 })
      }

      await prisma.chatReport.update({
        where: { id: shikoyatId },
        data: {
          holat: sabab,
          korganAdminId: admin.id,
          korilganVaqt: new Date(),
          adminIzohi: izoh?.trim()?.slice(0, 500) || null,
        },
      })

      await qaydEt({
        adminId: admin.id,
        action: 'chatReport:' + sabab,
        targetType: 'ChatReport',
        targetId: shikoyatId,
        details: izoh || null,
        request,
      })

      return NextResponse.json({ success: true, message: '✓ Shikoyat yopildi' })
    }

    if (!userId) return NextResponse.json({ error: 'userId majburiy' }, { status: 400 })

    const nishon = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, chatWarnings: true },
    })
    if (!nishon) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })

    // ─── Ogohlantirish ───
    //
    // Bu jazo emas, ogohlantirish: hisob ishlayveradi, lekin yozuv
    // qoladi va takrorlansa taqiq uchun asos bo'ladi.
    if (amal === 'ogohlantir') {
      if (!sabab?.trim()) {
        return NextResponse.json({ error: 'Sabab yozilishi shart' }, { status: 400 })
      }

      const yangi = await prisma.user.update({
        where: { id: userId },
        data: { chatWarnings: { increment: 1 } },
        select: { chatWarnings: true },
      })

      await qaydEt({
        adminId: admin.id,
        action: 'chatWarn',
        targetType: 'User',
        targetId: userId,
        details: `${nishon.username}: ${sabab}`,
        request,
      })

      await xabarYubor(userId, {
        turi: 'chat',
        icon: '⚠️',
        sarlavha: '⚠️ Chat bo\'yicha ogohlantirish',
        matn: `${sabab}. Bu ${yangi.chatWarnings}-ogohlantirish — takrorlansa yozish vaqtincha to'xtatiladi.`,
        havola: '/chat',
        adminId: admin.id,
      })

      return NextResponse.json({
        success: true,
        message: `✓ ${nishon.username} ogohlantirildi (${yangi.chatWarnings}-marta)`,
      })
    }

    // ─── Yozish taqiqi ───
    if (amal === 'taqiq') {
      const kun = Number(kunlar)
      if (!Number.isInteger(kun) || kun < 1 || kun > MAX_KUN) {
        return NextResponse.json({ error: `Muddat 1–${MAX_KUN} kun` }, { status: 400 })
      }
      if (!sabab?.trim()) {
        return NextResponse.json({ error: 'Sabab yozilishi shart' }, { status: 400 })
      }

      const gacha = new Date(Date.now() + kun * 24 * 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: userId },
        data: { chatBlockedUntil: gacha, chatBlockedReason: sabab.trim().slice(0, 300) },
      })

      await qaydEt({
        adminId: admin.id,
        action: 'chatBlock',
        targetType: 'User',
        targetId: userId,
        details: `${nishon.username}: ${kun} kun — ${sabab}`,
        request,
      })

      await xabarYubor(userId, {
        turi: 'chat',
        icon: '🚫',
        sarlavha: '🚫 Yozish vaqtincha to\'xtatildi',
        matn: `${sanaVaqt(gacha)} gacha shaxsiy xabar yubora olmaysiz. Sabab: ${sabab}`,
        havola: '/chat',
        adminId: admin.id,
      })

      return NextResponse.json({
        success: true,
        message: `✓ ${nishon.username} uchun yozish ${kun} kunga to'xtatildi`,
      })
    }

    if (amal === 'taqiqniOch') {
      await prisma.user.update({
        where: { id: userId },
        data: { chatBlockedUntil: null, chatBlockedReason: null },
      })

      await qaydEt({
        adminId: admin.id,
        action: 'chatUnblock',
        targetType: 'User',
        targetId: userId,
        details: nishon.username,
        request,
      })

      await xabarYubor(userId, {
        turi: 'chat',
        icon: '✅',
        sarlavha: '✅ Yozish taqiqi olib tashlandi',
        havola: '/chat',
        adminId: admin.id,
      })

      return NextResponse.json({ success: true, message: '✓ Taqiq olindi' })
    }

    return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 })
  } catch (error) {
    console.error('[Admin chat POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
