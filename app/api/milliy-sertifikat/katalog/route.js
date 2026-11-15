// app/api/milliy-sertifikat/katalog/route.js
//
// Qaysi sinovlar qachon ochiqligini, jadval vaqtini va foydalanuvchi
// topshirgan-topshirmaganini aytadi. Savollar, kalitlar va e'longacha ballar chiqmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { katalogJadvalBilan } from '@/lib/milliy-sertifikat-kohort'
import { isSuperAdmin } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const authSessiya = await getServerSession(authOptions)
    const superadminmi = isSuperAdmin(authSessiya?.user?.role)
    const sinovlar = await katalogJadvalBilan(prisma, {
      userId: authSessiya?.user?.id || null,
      isSuperAdmin: superadminmi,
    })

    const ochiq = sinovlar.filter((v) => v.holat === 'ochiq').map((v) => v.slug)
    return NextResponse.json({
      ochiq,
      sinovlar,
      kirganmi: Boolean(authSessiya?.user?.id),
      superadminRejimi: superadminmi,
      serverVaqt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Milliy Sertifikat Katalog]', err)
    return NextResponse.json({ error: "Katalogni yuklab bo'lmadi" }, { status: 500 })
  }
}
