// app/api/profil/privacy/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Maxfiylik sozlamalarini olish
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { privacySettings: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Default qiymatlar (agar privacySettings null bo'lsa)
    const defaultSettings = {
      profilePublic: true,
      showFriends: true,
      showQuizResults: true,
      showAchievements: true,
      showFollowers: true
    }

    let settings = defaultSettings
    try {
      if (user.privacySettings) {
        settings = typeof user.privacySettings === 'string' 
          ? JSON.parse(user.privacySettings) 
          : user.privacySettings
      }
    } catch (e) {
      console.error('Privacy settings parse error:', e)
    }

    return NextResponse.json({
      success: true,
      settings: { ...defaultSettings, ...settings }
    })
  } catch (error) {
    console.error('[Privacy GET Error]:', error)
    return NextResponse.json(
      { error: 'Maxfiylik sozlamalarini olishda xatolik' },
      { status: 500 }
    )
  }
}

// PUT - Maxfiylik sozlamalarini yangilash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { profilePublic, showFriends, showQuizResults, showAchievements, showFollowers } = body

    // Validatsiya
    const newSettings = {
      profilePublic: typeof profilePublic === 'boolean' ? profilePublic : true,
      showFriends: typeof showFriends === 'boolean' ? showFriends : true,
      showQuizResults: typeof showQuizResults === 'boolean' ? showQuizResults : true,
      showAchievements: typeof showAchievements === 'boolean' ? showAchievements : true,
      showFollowers: typeof showFollowers === 'boolean' ? showFollowers : true
    }

    // Database'ni yangilash
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        privacySettings: JSON.stringify(newSettings)
      }
    })

    return NextResponse.json({
      success: true,
      message: '✓ Maxfiylik sozlamalari yangilandi',
      settings: newSettings
    })
  } catch (error) {
    console.error('[Privacy PUT Error]:', error)
    return NextResponse.json(
      { error: 'Maxfiylik sozlamalarini yangilashda xatolik' },
      { status: 500 }
    )
  }
}