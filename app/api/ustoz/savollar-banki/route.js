// app/api/ustoz/savollar-banki/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // 1. Ustozning o'zi avval yaratgan barcha savollari
    const where = {
      quiz: { teacherId: session.user.id },
      ...(search && {
        questionText: { contains: search, mode: 'insensitive' }
      })
    }

    const questions = await prisma.teacherQuizQuestion.findMany({
      where,
      include: {
        quiz: { select: { id: true, title: true } }
      },
      orderBy: { id: 'desc' },
      take: 100
    })

    const formatted = questions.map(q => {
      const opts = q.options?.texts || (Array.isArray(q.options) ? q.options : [])
      return {
        id: q.id,
        questionText: q.questionText,
        options: opts.length > 0 ? opts : ['', '', '', ''],
        correctAnswer: q.correctAnswer || 0,
        explanation: q.explanation || '',
        points: q.points || 1,
        quizTitle: q.quiz?.title || 'Oldingi test'
      }
    })

    return NextResponse.json({
      success: true,
      questions: formatted,
      total: formatted.length
    })
  } catch (error) {
    console.error('[Savollar Banki Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
