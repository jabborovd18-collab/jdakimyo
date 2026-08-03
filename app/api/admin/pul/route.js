// app/api/admin/pul/route.js
//
// Pul nazorati: hisoblardagi tanga va olmosni ko'rish, berish/olib qo'yish
// va xarid taqiqini boshqarish.
//
// KIM QILA OLADI. Ko'rish — har qanday admin (nazorat hamma uchun ochiq
// bo'lsin). O'zgartirish — FAQAT superadmin: valyuta o'yin iqtisodiyotining
// o'zi, uni cheksiz yaratish mumkin bo'lsa reyting ham, do'kon ham
// ma'nosini yo'qotadi.
//
// Har bir o'zgarish uch joyga yoziladi:
//   AuditLog       — javobgarlik uchun (kim, kimga, qachon)
//   LabTransaction — valyuta harakati uchun ("qayerdan keldi")
//   Notification   — foydalanuvchi uchun ("nima uchun balansim o'zgardi")
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { huquqiBormi } from '@/lib/roles'
import { labniOl, taqiqKuchdami } from '@/lib/laboratoriya'
import { xabarYubor } from '@/lib/bildirishnoma'
import { sanaVaqt } from '@/lib/sana'

/** Bir amalda ko'pi bilan shuncha — nol qo'shib yuborishdan saqlaydi */
const MAX_MIQDOR = 100000

/** Taqiq eng ko'pi bilan shuncha kunga — abadiy taqiq bu yerdan qo'yilmaydi */
const MAX_KUN = 365

const HISOB_MAYDONLARI = {
  id: true, userId: true, username: true, fullName: true, email: true,
  role: true, avatar: true, coins: true, gems: true, stars: true,
  isBanned: true, spendBlockedUntil: true, spendBlockedReason: true,
  createdAt: true, lastActive: true,
}

function ipniOl(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    null
  )
}

// ─── GET: umumiy holat va hisoblar ro'yxati ───
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!huquqiBormi(session.user.role, 'pul')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const qidiruv = (searchParams.get('qidiruv') || '').trim()
    const saralash = searchParams.get('saralash') || 'coins'
    const sahifa = Math.max(1, parseInt(searchParams.get('sahifa') || '1'))
    const chegara = 25

    const where = qidiruv
      ? {
          OR: [
            { username: { contains: qidiruv, mode: 'insensitive' } },
            { fullName: { contains: qidiruv, mode: 'insensitive' } },
            { email: { contains: qidiruv, mode: 'insensitive' } },
            { userId: { contains: qidiruv } },
          ],
        }
      : {}

    // Saralash faqat ro'yxatdagi maydonlar bo'yicha — mijoz yuborgan nomni
    // to'g'ridan-to'g'ri orderBy ga bersak, u istalgan maydonni ocha oladi.
    const tartib = ['coins', 'gems', 'stars', 'createdAt'].includes(saralash) ? saralash : 'coins'

    const [hisoblar, jami, yigindi, taqiqlangan, oxirgiHarakat] = await Promise.all([
      prisma.user.findMany({
        where,
        select: HISOB_MAYDONLARI,
        orderBy: { [tartib]: 'desc' },
        skip: (sahifa - 1) * chegara,
        take: chegara,
      }),
      prisma.user.count({ where }),
      prisma.user.aggregate({ _sum: { coins: true, gems: true, stars: true } }),
      prisma.user.count({ where: { spendBlockedUntil: { gt: new Date() } } }),
      prisma.labTransaction.findMany({
        where: { turi: 'mukofot' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { lab: { select: { user: { select: { username: true, fullName: true } } } } },
      }),
    ])

    return NextResponse.json({
      success: true,
      // O'zgartirish huquqi javobda keladi: tugmalarni ko'rsatish-ko'rsatmaslikni
      // sahifa o'zi rolga qarab taxmin qilmasin.
      ozgartira: session.user.role === 'superadmin',
      hisoblar,
      sahifalash: { sahifa, chegara, jami, sahifalar: Math.ceil(jami / chegara) },
      umumiy: {
        coins: yigindi._sum.coins || 0,
        gems: yigindi._sum.gems || 0,
        stars: yigindi._sum.stars || 0,
        taqiqlangan,
      },
      oxirgiHarakat: oxirgiHarakat.map((t) => ({
        id: t.id,
        valyuta: t.valyuta,
        miqdor: t.miqdor,
        izoh: t.izoh,
        createdAt: t.createdAt,
        kim: t.lab?.user?.fullName || t.lab?.user?.username || '—',
      })),
    })
  } catch (error) {
    console.error('[Admin pul GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST: berish, olib qo'yish, taqiq ───
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Valyutani faqat superadmin boshqaradi' },
        { status: 403 },
      )
    }

    const { userId, amal, valyuta, miqdor, sabab, kunlar } = await request.json()

    if (!userId || !amal) {
      return NextResponse.json({ error: 'userId va amal kerak' }, { status: 400 })
    }

    const nishon = await prisma.user.findUnique({
      where: { id: userId },
      select: HISOB_MAYDONLARI,
    })
    if (!nishon) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    const ip = ipniOl(request)
    const ua = request.headers.get('user-agent') || null

    const qayd = (action, details) =>
      prisma.auditLog.create({
        data: {
          adminId: session.user.id,
          action,
          targetType: 'User',
          targetId: userId,
          details,
          ipAddress: ip,
          userAgent: ua,
        },
      })

    // ─── Valyuta berish yoki olib qo'yish ───
    if (amal === 'ber') {
      if (valyuta !== 'coins' && valyuta !== 'gems') {
        return NextResponse.json({ error: 'Valyuta noto\'g\'ri' }, { status: 400 })
      }

      const n = Number(miqdor)
      if (!Number.isInteger(n) || n === 0 || Math.abs(n) > MAX_MIQDOR) {
        return NextResponse.json(
          { error: `Miqdor noldan farqli butun son bo'lsin (${MAX_MIQDOR} gacha)` },
          { status: 400 },
        )
      }

      // Olib qo'yishda shartli update: balans manfiyga tushmasin. Oddiy
      // decrement bo'lsa, 10 tangasi bor odamdan 50 ta olib qo'yilsa
      // balans −40 bo'lardi.
      if (n < 0) {
        const natija = await prisma.user.updateMany({
          where: { id: userId, [valyuta]: { gte: -n } },
          data: { [valyuta]: { increment: n } },
        })
        if (natija.count === 0) {
          const bor = valyuta === 'gems' ? nishon.gems : nishon.coins
          return NextResponse.json(
            { error: `Hisobda ${bor} ta bor, ${-n} tasini olib bo'lmaydi` },
            { status: 400 },
          )
        }
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { [valyuta]: { increment: n } },
        })
      }

      // Valyuta harakati laboratoriya jurnaliga ham tushadi — "qayerdan
      // keldi" degan savolga javob o'sha yerdan chiqadi.
      const lab = await labniOl(userId)
      await prisma.labTransaction.create({
        data: {
          labId: lab.id,
          turi: 'mukofot',
          valyuta,
          miqdor: n,
          izoh: (sabab || 'Admin qarori').slice(0, 200),
        },
      })

      const belgi = valyuta === 'gems' ? '💎' : '🪙'
      const nom = valyuta === 'gems' ? 'olmos' : 'tanga'

      await qayd(
        n > 0 ? 'giveCurrency' : 'takeCurrency',
        `${nishon.username}: ${n > 0 ? '+' : ''}${n} ${nom}` + (sabab ? ` — ${sabab}` : ''),
      )

      await xabarYubor(userId, {
        turi: valyuta === 'gems' ? 'olmos' : 'tanga',
        sarlavha:
          n > 0
            ? `${belgi} Hisobingizga ${n} ${nom} qo'shildi`
            : `${belgi} Hisobingizdan ${-n} ${nom} yechildi`,
        matn: sabab || (n > 0 ? 'Administrator mukofoti' : 'Administrator qarori'),
        havola: '/laboratoriya',
        adminId: session.user.id,
      })

      const yangi = await prisma.user.findUnique({
        where: { id: userId },
        select: HISOB_MAYDONLARI,
      })

      return NextResponse.json({
        success: true,
        message: `${nishon.username}: ${n > 0 ? '+' : ''}${n} ${nom}`,
        hisob: yangi,
      })
    }

    // ─── Xarid taqiqi ───
    if (amal === 'taqiq') {
      const kun = Number(kunlar)
      if (!Number.isInteger(kun) || kun < 1 || kun > MAX_KUN) {
        return NextResponse.json(
          { error: `Muddat 1 dan ${MAX_KUN} kungacha bo'lsin` },
          { status: 400 },
        )
      }
      if (!sabab || !String(sabab).trim()) {
        // Sabab majburiy: foydalanuvchi nima uchun taqiqlanganini bilmasa,
        // taqiq jazo emas, tushunarsiz nosozlik bo'lib ko'rinadi.
        return NextResponse.json({ error: 'Sabab yozilishi shart' }, { status: 400 })
      }

      const gacha = new Date(Date.now() + kun * 24 * 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: userId },
        data: { spendBlockedUntil: gacha, spendBlockedReason: String(sabab).slice(0, 300) },
      })

      await qayd('blockSpending', `${nishon.username}: ${kun} kun — ${sabab}`)

      await xabarYubor(userId, {
        turi: 'taqiq',
        sarlavha: '🚫 Xarid vaqtincha to\'xtatildi',
        matn:
          `${sanaVaqt(gacha)} gacha do'konda xarid qila olmaysiz va pullik ` +
          `sandiq ocholmaysiz. Sabab: ${sabab}. O'qish, quiz va missiyalar ishlayveradi.`,
        havola: '/laboratoriya',
        adminId: session.user.id,
      })

      return NextResponse.json({
        success: true,
        message: `${nishon.username} uchun xarid ${kun} kunga to'xtatildi`,
      })
    }

    if (amal === 'taqiqniOch') {
      if (!taqiqKuchdami(nishon)) {
        return NextResponse.json({ error: 'Bu hisobda kuchdagi taqiq yo\'q' }, { status: 400 })
      }

      await prisma.user.update({
        where: { id: userId },
        data: { spendBlockedUntil: null, spendBlockedReason: null },
      })

      await qayd('unblockSpending', `${nishon.username}: taqiq muddatidan oldin olindi`)

      await xabarYubor(userId, {
        turi: 'taqiq-olindi',
        sarlavha: '✅ Xarid taqiqi olib tashlandi',
        matn: 'Do\'kon va sandiqlar yana ochiq.',
        havola: '/laboratoriya',
        adminId: session.user.id,
      })

      return NextResponse.json({
        success: true,
        message: `${nishon.username} uchun taqiq olindi`,
      })
    }

    return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 })
  } catch (error) {
    console.error('[Admin pul POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
