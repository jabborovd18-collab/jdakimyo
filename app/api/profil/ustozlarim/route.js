// app/api/profil/ustozlarim/route.js
//
// Talabaning o'z ustozlari va ularga kelgan takliflar.
//
// NEGA KERAK. Avval ustoz istalgan odamni jimgina guruhiga qo'sha olardi
// va talaba buni ko'rmasdi ham — chiqib ketish yo'li ham yo'q edi. Endi
// qo'shish taklif bo'ladi va bu sahifa uning yagona boshqaruv joyi:
// qabul qilish, rad etish va istalgan vaqtda guruhdan chiqish.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xabarYubor } from '@/lib/bildirishnoma'

const USTOZ_MAYDONLARI = {
  select: {
    id: true,
    username: true,
    fullName: true,
    avatar: true,
    university: true,
    isVerified: true,
  },
}

// GET — takliflar va faol guruhlar
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const yozuvlar = await prisma.teacherStudent.findMany({
      where: {
        studentId: session.user.id,
        // Rad etilganlar ko'rsatilmaydi: talaba qarorini allaqachon
        // bergan, ro'yxatda turishi faqat bezovta qiladi.
        holat: { in: ['sorov', 'faol'] },
      },
      include: {
        teacher: USTOZ_MAYDONLARI,
        group: { select: { id: true, name: true, color: true, description: true } },
      },
      orderBy: { joinedAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      takliflar: yozuvlar.filter((y) => y.holat === 'sorov'),
      guruhlarim: yozuvlar.filter((y) => y.holat === 'faol'),
    })
  } catch (error) {
    console.error('[Ustozlarim GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — taklif havolasi orqali guruhga qo'shilish so'rovi yuborish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = await request.json()
    if (!groupId) {
      return NextResponse.json({ error: 'Guruh ID kerak' }, { status: 400 })
    }

    const group = await prisma.teacherGroup.findUnique({
      where: { id: groupId },
      include: { teacher: { select: { id: true, fullName: true, username: true } } }
    })

    if (!group) {
      return NextResponse.json({ error: 'Guruh topilmadi' }, { status: 404 })
    }

    // O'z guruhiga o'zi qo'shila olmaydi
    if (group.teacherId === session.user.id) {
      return NextResponse.json({ error: 'O\'zingizning guruhingizga talaba sifatida qo\'shila olmaysiz' }, { status: 400 })
    }

    // Allaqachon a'zomi?
    const existing = await prisma.teacherStudent.findFirst({
      where: {
        teacherId: group.teacherId,
        studentId: session.user.id,
        groupId
      }
    })

    if (existing) {
      if (existing.holat === 'faol') {
        return NextResponse.json({ error: 'Siz allaqachon ushbu guruh a\'zosisiz' }, { status: 400 })
      }
      if (existing.holat === 'sorov') {
        // Agar taklif allaqachon tushgan bo'lsa, uni darhol qabul qilamiz
        await prisma.teacherStudent.update({
          where: { id: existing.id },
          data: { holat: 'faol', javobVaqt: new Date() }
        })
        return NextResponse.json({ success: true, message: `✓ "${group.name}" guruhiga qo'shildingiz!` })
      }
    }

    // Yangi qo'shilish
    await prisma.teacherStudent.create({
      data: {
        teacherId: group.teacherId,
        studentId: session.user.id,
        groupId,
        holat: 'faol',
        javobVaqt: new Date()
      }
    })

    const talabaNomi = session.user.fullName || session.user.username
    await xabarYubor(group.teacherId, {
      turi: 'tizim',
      sarlavha: `✅ ${talabaNomi} guruhingizga qo'shildi`,
      matn: `Guruh: ${group.name}`,
      havola: '/ustoz/talaba',
      icon: '✅',
    })

    return NextResponse.json({
      success: true,
      message: `✓ "${group.name}" guruhiga muvaffaqiyatli qo'shildingiz!`
    })
  } catch (error) {
    console.error('[Ustozlarim POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — taklifga javob berish
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, javob } = await request.json()

    if (!id || !['qabul', 'rad'].includes(javob)) {
      return NextResponse.json(
        { error: 'id va javob (qabul/rad) kerak' },
        { status: 400 }
      )
    }

    // Yozuv SHU talabaniki ekanini tekshiramiz — aks holda boshqa
    // odamning taklifiga javob berib bo'lardi.
    const yozuv = await prisma.teacherStudent.findFirst({
      where: { id, studentId: session.user.id, holat: 'sorov' },
      include: {
        teacher: { select: { id: true, username: true, fullName: true } },
        group: { select: { name: true } },
      },
    })

    if (!yozuv) {
      return NextResponse.json(
        { error: 'Taklif topilmadi yoki unga allaqachon javob berilgan' },
        { status: 404 }
      )
    }

    await prisma.teacherStudent.update({
      where: { id },
      data: {
        holat: javob === 'qabul' ? 'faol' : 'rad',
        javobVaqt: new Date(),
      },
    })

    const talabaNomi = session.user.fullName || session.user.username
    await xabarYubor(yozuv.teacher.id, {
      turi: 'tizim',
      sarlavha:
        javob === 'qabul'
          ? `✅ ${talabaNomi} guruhingizga qo'shildi`
          : `${talabaNomi} taklifni rad etdi`,
      matn: `Guruh: ${yozuv.group?.name || '—'}`,
      havola: '/ustoz/talaba',
      icon: javob === 'qabul' ? '✅' : '↩️',
    })

    return NextResponse.json({
      success: true,
      message:
        javob === 'qabul'
          ? `✓ "${yozuv.group?.name}" guruhiga qo'shildingiz`
          : '✓ Taklif rad etildi',
    })
  } catch (error) {
    console.error('[Ustozlarim PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE — guruhdan chiqish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id kerak' }, { status: 400 })
    }

    const yozuv = await prisma.teacherStudent.findFirst({
      where: { id, studentId: session.user.id },
      include: {
        teacher: { select: { id: true } },
        group: { select: { name: true } },
      },
    })

    if (!yozuv) {
      return NextResponse.json({ error: 'Yozuv topilmadi' }, { status: 404 })
    }

    // Butunlay o'chiramiz, 'rad' qilib qo'ymaymiz: bu talabaning o'z
    // qarori bilan chiqishi va u keyin qaytadan taklif olishi mumkin
    // bo'lishi kerak. Topshirgan ishlari `AssignmentSubmission` da
    // qoladi — baho tarixini o'chirish noto'g'ri bo'lardi.
    await prisma.teacherStudent.delete({ where: { id } })

    const talabaNomi = session.user.fullName || session.user.username
    await xabarYubor(yozuv.teacher.id, {
      turi: 'tizim',
      sarlavha: `${talabaNomi} guruhdan chiqdi`,
      matn: `Guruh: ${yozuv.group?.name || '—'}`,
      havola: '/ustoz/talaba',
      icon: '↩️',
    })

    return NextResponse.json({ success: true, message: '✓ Guruhdan chiqdingiz' })
  } catch (error) {
    console.error('[Ustozlarim DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
