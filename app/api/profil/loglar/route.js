// app/api/profil/loglar/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import {
  LOG_TOIFA_TARIFLARI,
  profilLogCsvYasa,
  profilLoglarOlish,
} from '@/lib/profil-log'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const toifa = searchParams.get('toifa') || 'barchasi'
    const holat = searchParams.get('holat') || 'barchasi'
    const qidiruv = searchParams.get('q') || searchParams.get('search') || ''
    const format = (searchParams.get('format') || '').toLowerCase()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25))

    const natija = await profilLoglarOlish(session.user.id, {
      toifa,
      holat,
      qidiruv,
      page,
      limit: format === 'csv' || format === 'json' ? 200 : limit,
    })

    if (format === 'csv') {
      const csv = profilLogCsvYasa(natija.barchaFiltrlangan.slice(0, 200))
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="profil-loglar.csv"',
        },
      })
    }

    if (format === 'json') {
      const payload = JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          total: natija.total,
          xulosa: natija.xulosa,
          items: natija.barchaFiltrlangan.slice(0, 200),
        },
        null,
        2,
      )
      return new NextResponse(payload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'attachment; filename="profil-loglar.json"',
        },
      })
    }

    return NextResponse.json({
      success: true,
      logJadvalTayyor: natija.logJadvalTayyor,
      toifalar: LOG_TOIFA_TARIFLARI,
      items: natija.items,
      total: natija.total,
      jamiBirlashgan: natija.jamiBirlashgan,
      page: natija.page,
      limit: natija.limit,
      hasMore: natija.hasMore,
      xulosa: natija.xulosa,
    })
  } catch (error) {
    console.error('[Profil Loglar GET]', error)
    return NextResponse.json(
      { error: "Profil loglarini yuklashda xatolik" },
      { status: 500 },
    )
  }
}
