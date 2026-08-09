// app/api/admin/telegram/guruhlar/route.js
//
// Bot qo'shilgan guruhlar ro'yxati va ularning sozlamalari.
//
// NEGA A'ZOLAR SONI JONLI SO'RALADI. Uni bazada saqlash mumkin edi,
// lekin guruh o'sib-kichrayib turadi va eskirgan raqam noto'g'ri
// qarorga olib keladi ("bu guruh kichkina ekan" deb e'lon
// yuborilmay qolardi). Guruhlar soni oz bo'lgani uchun har safar
// so'rash arzon.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { guruhAzolari, telegramSozlanganmi } from '@/lib/telegram'

/** Guruhlar butun bot uchun umumiy — superadmin ishi */
async function ruxsat() {
  const { isSuperAdmin } = await checkAdminAuth()
  return isSuperAdmin
}

// Bir vaqtda ko'p so'rov yubormaslik uchun: Telegram tez ketma-ket
// so'rovlarda 429 qaytaradi va u butun ro'yxatni bo'sh qoldirardi.
const BIR_GALDA = 5

async function azolarSoni(guruhlar) {
  const natija = new Map()
  if (!telegramSozlanganmi()) return natija

  for (let i = 0; i < guruhlar.length; i += BIR_GALDA) {
    const bolak = guruhlar.slice(i, i + BIR_GALDA)
    const sonlar = await Promise.all(
      bolak.map((g) => guruhAzolari(g.chatId).catch(() => null))
    )
    bolak.forEach((g, j) => natija.set(g.chatId, sonlar[j]))
  }
  return natija
}

export async function GET() {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const guruhlar = await prisma.telegramGuruh.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const sonlar = await azolarSoni(guruhlar.filter((g) => g.faol))

  const royxat = guruhlar.map((g) => ({
    ...g,
    azolar: sonlar.get(g.chatId) ?? null,
  }))

  // QAMROV — marketing uchun asosiy raqam: bitta e'lon necha kishiga
  // yetadi. Faqat bot ichida turgan guruhlar hisoblanadi.
  const qamrov = royxat
    .filter((g) => g.faol && typeof g.azolar === 'number')
    .reduce((s, g) => s + g.azolar, 0)

  return NextResponse.json({
    success: true,
    guruhlar: royxat,
    jami: {
      hammasi: royxat.length,
      faol: royxat.filter((g) => g.faol).length,
      iqtibosli: royxat.filter((g) => g.faol && g.iqtiboslar).length,
      yangilikli: royxat.filter((g) => g.faol && g.yangiliklar).length,
      qamrov,
    },
  })
}

// PATCH — guruh sozlamasini almashtirish
export async function PATCH(request) {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const tana = await request.json().catch(() => null)
  if (!tana?.id) {
    return NextResponse.json({ error: 'id yo\'q' }, { status: 400 })
  }

  const yangi = {}
  if (typeof tana.iqtiboslar === 'boolean') yangi.iqtiboslar = tana.iqtiboslar
  if (typeof tana.yangiliklar === 'boolean') yangi.yangiliklar = tana.yangiliklar
  if (!Object.keys(yangi).length) {
    return NextResponse.json({ error: 'O\'zgartirish yo\'q' }, { status: 400 })
  }

  const guruh = await prisma.telegramGuruh.update({
    where: { id: tana.id },
    data: yangi,
  })
  return NextResponse.json({ success: true, guruh })
}

// DELETE — ro'yxatdan o'chirish
//
// Faqat bot CHIQARILGAN guruhni o'chirish mumkin: faol guruh
// o'chirilsa, u keyingi xabarda yana o'zi ro'yxatga tushardi va
// "o'chirdim, lekin qaytib keldi" degan holat chiqardi.
export async function DELETE(request) {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id yo\'q' }, { status: 400 })

  const guruh = await prisma.telegramGuruh.findUnique({ where: { id } })
  if (!guruh) {
    return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
  }
  if (guruh.faol) {
    return NextResponse.json(
      { error: 'Bot hali shu guruhda. Avval guruhdan chiqaring.' },
      { status: 400 }
    )
  }

  await prisma.telegramGuruh.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
