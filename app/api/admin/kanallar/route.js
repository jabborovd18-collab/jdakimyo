// app/api/admin/kanallar/route.js
//
// Kanallarni boshqarish — FAQAT superadmin.
//
// Kanal ochish egasiga "hamkor" unvonini berish bilan birga ketadi:
// unvonsiz odam dashboardga kira olmaydi va kanal egasiz qolib ketardi.
// Shuning uchun ikkalasi bitta amalda bajariladi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { KANAL_TURLARI, boshSlug } from '@/lib/kanal'
import { qaydEt } from '@/lib/qaydnoma'
import { xabarYubor } from '@/lib/bildirishnoma'

export async function GET() {
  const { isAdmin } = await checkAdminAuth('kanallar')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const kanallar = await prisma.channel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        ega: { select: { id: true, username: true, fullName: true, userId: true, role: true } },
        _count: { select: { obunalar: true, postlar: true, videolar: true } },
      },
    })

    // Egasi bo'la oladiganlar: allaqachon hamkor bo'lganlar birinchi
    const nomzodlar = await prisma.user.findMany({
      where: { isBanned: false },
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
      take: 200,
      select: { id: true, username: true, fullName: true, userId: true, role: true },
    })

    return NextResponse.json({
      success: true,
      kanallar: kanallar.map((k) => ({
        ...k,
        obunachilar: k._count.obunalar,
        postSoni: k._count.postlar,
        videoSoni: k._count.videolar,
        _count: undefined,
      })),
      nomzodlar,
      turlar: KANAL_TURLARI,
    })
  } catch (error) {
    console.error('[Admin kanallar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const { isAdmin, user: admin } = await checkAdminAuth('kanallar')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { nom, egaId, turi, tavsif, ochiq } = await request.json()

    if (!nom?.trim() || !egaId) {
      return NextResponse.json({ error: 'Kanal nomi va egasi majburiy' }, { status: 400 })
    }

    const ega = await prisma.user.findUnique({ where: { id: egaId } })
    if (!ega) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })

    const mavjud = await prisma.channel.findFirst({ where: { egaId } })
    if (mavjud) {
      return NextResponse.json(
        { error: `${ega.username} da allaqachon kanal bor: ${mavjud.nom}` },
        { status: 400 },
      )
    }

    const kanal = await prisma.channel.create({
      data: {
        slug: await boshSlug(nom),
        nom: nom.trim().slice(0, 80),
        tavsif: tavsif?.trim() || null,
        turi: KANAL_TURLARI.some((t) => t.id === turi) ? turi : 'talim',
        ochiq: ochiq !== false,
        egaId,
      },
    })

    // Unvon kanal bilan birga beriladi — aks holda ega o'z kanaliga
    // kira olmasdi. Admin va superadminning roli pasaytirilmaydi.
    const unvonBerildi = !['hamkor', 'admin', 'superadmin'].includes(ega.role)
    if (unvonBerildi) {
      await prisma.user.update({ where: { id: egaId }, data: { role: 'hamkor' } })
    }

    await qaydEt({
      adminId: admin.id,
      action: 'createChannel',
      targetType: 'Channel',
      targetId: kanal.id,
      details: `${kanal.nom} → ${ega.username}${unvonBerildi ? " (hamkor unvoni berildi)" : ''}`,
      request,
    })

    await xabarYubor(egaId, {
      turi: 'kanal',
      icon: '📢',
      sarlavha: `📢 Sizga "${kanal.nom}" kanali ochildi`,
      matn: unvonBerildi
        ? 'Hamkor unvoni berildi. Kanalni hamkorlar dashboardidan yuriting.'
        : 'Kanalni hamkorlar dashboardidan yuriting.',
      havola: '/hamkorlar',
      adminId: admin.id,
    })

    return NextResponse.json({
      success: true,
      kanal,
      message: `✓ "${kanal.nom}" ochildi${unvonBerildi ? ` va ${ega.username} ga hamkor unvoni berildi` : ''}`,
    })
  } catch (error) {
    console.error('[Admin kanallar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const { isAdmin, user: admin } = await checkAdminAuth('kanallar')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { id, ochiq, tavsiyada, faol, turi, nom } = await request.json()
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    const mavjud = await prisma.channel.findUnique({ where: { id } })
    if (!mavjud) return NextResponse.json({ error: 'Kanal topilmadi' }, { status: 404 })

    const data = {}
    if (ochiq !== undefined) data.ochiq = Boolean(ochiq)
    if (tavsiyada !== undefined) data.tavsiyada = Boolean(tavsiyada)
    if (faol !== undefined) data.faol = Boolean(faol)
    if (nom?.trim()) data.nom = nom.trim().slice(0, 80)
    if (KANAL_TURLARI.some((t) => t.id === turi)) data.turi = turi

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'O\'zgartirish yo\'q' }, { status: 400 })
    }

    const kanal = await prisma.channel.update({ where: { id }, data })

    await qaydEt({
      adminId: admin.id,
      action: 'updateChannel',
      targetType: 'Channel',
      targetId: id,
      details: `${kanal.nom}: ${Object.entries(data).map(([k, v]) => `${k}=${v}`).join(', ')}`,
      request,
    })

    // Kanal to'xtatilsa yoki qayta yoqilsa egasi buni bilishi kerak
    if (faol !== undefined && mavjud.faol !== kanal.faol) {
      await xabarYubor(kanal.egaId, {
        turi: 'kanal',
        icon: kanal.faol ? '✅' : '⛔',
        sarlavha: kanal.faol
          ? `✅ "${kanal.nom}" kanali qayta yoqildi`
          : `⛔ "${kanal.nom}" kanali vaqtincha to'xtatildi`,
        havola: '/hamkorlar',
        adminId: admin.id,
      })
    }

    return NextResponse.json({ success: true, kanal, message: '✓ Saqlandi' })
  } catch (error) {
    console.error('[Admin kanallar PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
