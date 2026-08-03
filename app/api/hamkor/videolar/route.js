// app/api/hamkor/videolar/route.js
//
// Kanal video darsliklari.
//
// Video fayl saqlanmaydi — tashqi havola (YouTube va hokazo) yoziladi.
// Video hosting alohida katta ish va uni sayt o'z zimmasiga olishi shart
// emas; kanalning vazifasi darsni TOPILADIGAN qilish.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { isPartnerRole } from '@/lib/roles'
import { KanalXatosi, kanalimniOl } from '@/lib/kanal'

async function kanalTekshir() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { xato: NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 }) }
  }
  if (!isPartnerRole(session.user.role)) {
    return { xato: NextResponse.json({ error: 'Hamkor huquqi kerak' }, { status: 403 }) }
  }
  try {
    return { kanal: await kanalimniOl(session.user.id) }
  } catch (e) {
    const status = e instanceof KanalXatosi ? e.status : 500
    return { xato: NextResponse.json({ error: e.message }, { status }) }
  }
}

export async function GET() {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  const videolar = await prisma.channelVideo.findMany({
    where: { channelId: kanal.id },
    orderBy: [{ tartib: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ success: true, videolar })
}

export async function POST(request) {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  try {
    const { sarlavha, tavsif, videoUrl, thumbnail, tartib, nashr } = await request.json()

    if (!sarlavha?.trim() || !videoUrl?.trim()) {
      return NextResponse.json({ error: 'Sarlavha va video havolasi majburiy' }, { status: 400 })
    }
    if (!/^https?:\/\//i.test(videoUrl.trim())) {
      return NextResponse.json({ error: 'Havola http:// yoki https:// bilan boshlanishi kerak' }, { status: 400 })
    }

    const video = await prisma.channelVideo.create({
      data: {
        channelId: kanal.id,
        sarlavha: sarlavha.trim().slice(0, 200),
        tavsif: tavsif?.trim() || null,
        videoUrl: videoUrl.trim(),
        thumbnail: thumbnail?.trim() || null,
        tartib: Number.isInteger(tartib) ? tartib : 0,
        nashr: nashr !== false,
      },
    })

    return NextResponse.json({ success: true, video, message: '✓ Video qo\'shildi' })
  } catch (error) {
    console.error('[Hamkor videolar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const { kanal, xato } = await kanalTekshir()
  if (xato) return xato

  try {
    const { id, sarlavha, tavsif, videoUrl, thumbnail, tartib, nashr } = await request.json()
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    const mavjud = await prisma.channelVideo.findFirst({ where: { id, channelId: kanal.id } })
    if (!mavjud) return NextResponse.json({ error: 'Video topilmadi' }, { status: 404 })

    const video = await prisma.channelVideo.update({
      where: { id },
      data: {
        ...(sarlavha?.trim() ? { sarlavha: sarlavha.trim().slice(0, 200) } : {}),
        ...(tavsif !== undefined ? { tavsif: tavsif?.trim() || null } : {}),
        ...(videoUrl?.trim() ? { videoUrl: videoUrl.trim() } : {}),
        ...(thumbnail !== undefined ? { thumbnail: thumbnail?.trim() || null } : {}),
        ...(Number.isInteger(tartib) ? { tartib } : {}),
        ...(nashr !== undefined ? { nashr: Boolean(nashr) } : {}),
      },
    })

    return NextResponse.json({ success: true, video, message: '✓ Video yangilandi' })
  } catch (error) {
    console.error('[Hamkor videolar PUT]', error)
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

    const ochirildi = await prisma.channelVideo.deleteMany({ where: { id, channelId: kanal.id } })
    if (ochirildi.count === 0) {
      return NextResponse.json({ error: 'Video topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: '✓ Video o\'chirildi' })
  } catch (error) {
    console.error('[Hamkor videolar DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
