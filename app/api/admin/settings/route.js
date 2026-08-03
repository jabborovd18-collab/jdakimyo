// app/api/admin/settings/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Sozlamalarni olish
export async function GET() {
  try {
    const { isAdmin } = await checkAdminAuth('sozlamalar')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    // Agar yo'q bo'lsa, default qiymatlar bilan yaratish
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'main',
          siteName: 'JDA KIMYO',
          siteDescription: 'Koordinatsion kimyo platformasi'
        }
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('[Settings GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Sozlamalarni yangilash
export async function PUT(request) {
  try {
    const { isSuperAdmin, user: admin } = await checkAdminAuth()
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Faqat SuperAdmin sozlamalarni o\'zgartira oladi' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Oldindan mavjudmi tekshirish
    const existing = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    let settings
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: 'main' },
        data: {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          logo: data.logo || null,
          favicon: data.favicon || null,
          maintenanceMode: data.maintenanceMode || false,
          maintenanceMessage: data.maintenanceMessage || null,
          footerText: data.footerText || null,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          telegramGroup: data.telegramGroup || null,
          instagramLink: data.instagramLink || null,
          defaultXpCommon: parseInt(data.defaultXpCommon) || 10,
          defaultXpRare: parseInt(data.defaultXpRare) || 50,
          defaultXpEpic: parseInt(data.defaultXpEpic) || 100,
          defaultXpLegendary: parseInt(data.defaultXpLegendary) || 500,
          questionsPerQuiz: parseInt(data.questionsPerQuiz) || 20,
          quizTimeLimit: data.quizTimeLimit ? parseInt(data.quizTimeLimit) : null
        }
      })
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'main',
          ...data
        }
      })
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'update_settings',
        targetType: 'settings',
        targetId: 'main',
        details: 'Sayt sozlamalari yangilandi'
      }
    })

    return NextResponse.json({
      success: true,
      settings,
      message: '✓ Sozlamalar muvaffaqiyatli yangilandi'
    })
  } catch (error) {
    console.error('[Settings PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}