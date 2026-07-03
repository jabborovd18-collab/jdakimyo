// app/api/activity/history/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getActivityHistory } from '@/lib/streak'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '365')

    const result = await getActivityHistory(session.user.id, days)

    return NextResponse.json(result)

  } catch (error) {
    console.error('[Activity History API Error]:', error)
    return NextResponse.json(
      { error: 'Faoliyat tarixini olishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}