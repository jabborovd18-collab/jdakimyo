// app/api/profil/quizlar/[id]/route.js
// Quiz natijasini qadash, qadashdan olish, yashirish, ochish va erkin quizni o'chirish.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { profilLogYoz } from '@/lib/profil-log'
import {
  quizNatijaAmalRejasi,
  quizNatijaniBoyit,
} from '@/lib/quiz-natija-boshqaruv'

const PATCH_ACTIONS = new Set(['pin', 'unpin', 'hide', 'unhide'])

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Natija ID ko'rsatilmagan" }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const action = body?.action
    if (!PATCH_ACTIONS.has(action)) {
      return NextResponse.json({ error: "Noto'g'ri amal yuborildi" }, { status: 400 })
    }

    const userId = session.user.id

    const outcome = await prisma.$transaction(async (tx) => {
      const existing = await tx.quizResult.findFirst({
        where: { id, userId },
      })

      if (!existing) {
        return { ok: false, status: 404, error: 'Quiz natijasi topilmadi' }
      }

      const pinnedCount = action === 'pin'
        ? await tx.quizResult.count({
            where: { userId, isPinned: true, isHidden: false },
          })
        : 0

      const reja = quizNatijaAmalRejasi({
        natija: existing,
        amal: action,
        joriyQadalganSoni: pinnedCount,
      })

      if (!reja.ok) return reja

      if (reja.operation === 'noop') {
        return { ok: true, status: 200, item: existing, message: reja.message }
      }

      const updated = await tx.quizResult.update({
        where: { id },
        data: reja.data,
      })

      return { ok: true, status: 200, item: updated, message: reja.message }
    })

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status })
    }

    await profilLogYoz({
      userId,
      toifa: 'natija',
      amal: 'QUIZ_NATIJA_TAHRIR',
      sarlavha: `Quiz natijasi: ${outcome.item.quizName}`,
      tafsilot: outcome.message,
      holat: 'muvaffaqiyat',
      request,
      meta: { refId: id },
    })

    return NextResponse.json({
      success: true,
      item: quizNatijaniBoyit(outcome.item),
      message: outcome.message,
    })
  } catch (error) {
    console.error('[Profil quizlar PATCH]', error)
    return NextResponse.json(
      { error: 'Quiz natijasini yangilashda xatolik' },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Natija ID ko'rsatilmagan" }, { status: 400 })
    }

    const userId = session.user.id

    const outcome = await prisma.$transaction(async (tx) => {
      const existing = await tx.quizResult.findFirst({
        where: { id, userId },
      })

      const reja = quizNatijaAmalRejasi({
        natija: existing,
        amal: 'delete',
      })

      if (!reja.ok) return reja

      await tx.quizResult.delete({ where: { id } })
      return reja
    })

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status })
    }

    await profilLogYoz({
      userId,
      toifa: 'natija',
      amal: 'QUIZ_NATIJA_OCHIRILDI',
      sarlavha: "Quiz natijasi o'chirildi",
      tafsilot: outcome.message,
      holat: 'ogohlantirish',
      request,
      meta: { deletedId: id },
    })

    return NextResponse.json({
      success: true,
      deletedId: id,
      message: outcome.message,
    })
  } catch (error) {
    console.error('[Profil quizlar DELETE]', error)
    return NextResponse.json(
      { error: "Quiz natijasini o'chirishda xatolik" },
      { status: 500 },
    )
  }
}
