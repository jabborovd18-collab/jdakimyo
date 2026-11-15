// app/api/admin/settings/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { buildSiteSettingsData } from '@/lib/admin-yordamchi'
import { TARIF } from '@/lib/sayt-malumot'

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
          siteDescription: TARIF
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
    const cleanData = buildSiteSettingsData(data)

    const existing = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    let settings
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: 'main' },
        data: cleanData
      })
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'main',
          ...cleanData
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