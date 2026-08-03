// app/api/hamkor/postlar/route.js
//
// Kanal lentasi: e'lon yozish, tahrirlash, o'chirish.
//
// Nashr etilgan post obunachilarga BILDIRISHNOMA yuboradi — Telegram
// kanalidagi xabar o'rnini aynan shu bosadi. Qoralama yuborilmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { isPartnerRole } from '@/lib/roles'
import { KanalXatosi, kanalimniOl } from '@/lib/kanal'
import { xabarYuborKopga } from '@/lib/bildirishnoma'

async function kanalTekshir() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { xato: NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 }) }
  }
  if (!isPartnerRole(session.user.role)) {
    return { xato: NextResponse.json({ error: 'Hamkor huquqi kerak' }, { status: 403 }) }
  }
  try {
    return { kanal: await kanalimniOl(session.user.id), user: session.user }
  } catch (e) {
    const status = e instanceof KanalXatosi ? e.status : 500
    return { xato: NextResponse.json({ error: e.message }, { status }) }
  }
}

/** Obunachilarga yangi post haqida xabar */
async function obunachilarniOgohlantir(kanal, post) {
  const obunalar = await prisma.channelSubscription.findMany({
    where: { channelId: kanal.id },
    select: { userId: true },
  })

  await xabarYuborKopga(
    obunalar.map((o) => o.userId),
    {
      turi: 'kanal',
      icon: '📢',
      sarlavha: `${kanal.nom}: ${post.sarlavha}`,
      matn: post.matn.slice(0, 160),
      havola: `/kanallar/${kanal.slug}`,
    },
  )
}

export async function GET() {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  const postlar = await prisma.channelPost.findMany({
    where: { channelId: kanal.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, postlar })
}

export async function POST(request) {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  try {
    const { sarlavha, matn, rasm, nashr } = await request.json()

    if (!sarlavha?.trim() || !matn?.trim()) {
      return NextResponse.json({ error: 'Sarlavha va matn majburiy' }, { status: 400 })
    }

    const post = await prisma.channelPost.create({
      data: {
        channelId: kanal.id,
        sarlavha: sarlavha.trim().slice(0, 200),
        matn: matn.trim(),
        rasm: rasm?.trim() || null,
        nashr: nashr !== false,
      },
    })

    if (post.nashr) await obunachilarniOgohlantir(kanal, post)

    return NextResponse.json({
      success: true,
      post,
      message: post.nashr ? '✓ Post joylandi va obunachilarga xabar berildi' : '✓ Qoralama saqlandi',
    })
  } catch (error) {
    console.error('[Hamkor postlar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  try {
    const { id, sarlavha, matn, rasm, nashr } = await request.json()
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    // `channelId` sharti muhim: id ni bilgan odam boshqa kanalning
    // postini tahrirlay olmasligi kerak
    const mavjud = await prisma.channelPost.findFirst({ where: { id, channelId: kanal.id } })
    if (!mavjud) return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })

    const post = await prisma.channelPost.update({
      where: { id },
      data: {
        ...(sarlavha?.trim() ? { sarlavha: sarlavha.trim().slice(0, 200) } : {}),
        ...(matn?.trim() ? { matn: matn.trim() } : {}),
        ...(rasm !== undefined ? { rasm: rasm?.trim() || null } : {}),
        ...(nashr !== undefined ? { nashr: Boolean(nashr) } : {}),
      },
    })

    // Qoralama endi nashr etildi — obunachilar shundagina xabar oladi
    if (!mavjud.nashr && post.nashr) await obunachilarniOgohlantir(kanal, post)

    return NextResponse.json({ success: true, post, message: '✓ Post yangilandi' })
  } catch (error) {
    console.error('[Hamkor postlar PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    const ochirildi = await prisma.channelPost.deleteMany({ where: { id, channelId: kanal.id } })
    if (ochirildi.count === 0) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: '✓ Post o\'chirildi' })
  } catch (error) {
    console.error('[Hamkor postlar DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
