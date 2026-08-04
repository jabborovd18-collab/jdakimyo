// app/api/admin/telegram/elon/route.js
//
// Botga ulangan HAMMA foydalanuvchiga e'lon yuborish.
//
// NEGA ALOHIDA YO'L, `xabarYuborKopga` EMAS. Bildirishnoma — saytdagi
// yozuv, u kabinetdagi qo'ng'iroqda turadi va o'qilgan/o'qilmagan
// holati bor. E'lon esa faqat Telegramga ketadi: saytda 12 ta
// foydalanuvchiga 12 ta keraksiz yozuv yaratmaydi.
//
// NEGA FAQAT SUPERADMIN. Bu tugma butun auditoriyaga bir vaqtda
// yozadi va ortga qaytarib bo'lmaydi — yuborilgan xabarni Telegramdan
// qaytarib olib bo'lmaydi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { qaydEt } from '@/lib/qaydnoma'
import {
  telegramYubor, telegramRasmYubor, tgHimoyala, telegramSozlanganmi,
  ulanishOlikmi, CHEGARA,
} from '@/lib/telegram'

// Ko'p odamga yuborish sekin. Vercel'ning sukutdagi chegarasi buni
// yarmida uzib qo'yardi.
export const maxDuration = 60

/** Bir bo'lakdagi xabar soni. Telegram sekundiga ~30 tani qabul qiladi. */
const BOLAK = 20

/** Bo'laklar orasidagi tanaffus (ms) */
const TANAFFUS = 1100

export async function POST(request) {
  const { isSuperAdmin, user } = await checkAdminAuth()
  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  if (!telegramSozlanganmi()) {
    return NextResponse.json({ error: 'Bot sozlanmagan' }, { status: 503 })
  }

  const tana = await request.json().catch(() => null)
  const matn = String(tana?.matn || '').trim()
  const rasm = String(tana?.rasm || '').trim()
  const havolaUrl = String(tana?.havolaUrl || '').trim()
  const havolaMatn = String(tana?.havolaMatn || '').trim()

  if (!matn && !rasm) {
    return NextResponse.json({ error: 'Matn yoki rasm kerak' }, { status: 400 })
  }

  // Chegarani OLDINDAN tekshiramiz. Aks holda birinchi foydalanuvchida
  // Telegram rad etardi va e'lon yarim yo'lda to'xtardi.
  const chegara = rasm ? CHEGARA.izoh : CHEGARA.matn
  if (matn.length > chegara) {
    return NextResponse.json(
      {
        error: rasm
          ? `Rasm bilan yuborilganda matn ${CHEGARA.izoh} belgidan oshmasligi kerak (hozir ${matn.length}). Rasmni olib tashlang yoki matnni qisqartiring.`
          : `Matn ${CHEGARA.matn} belgidan oshmasligi kerak (hozir ${matn.length}).`,
      },
      { status: 400 }
    )
  }

  // Faqat oqimi yoqilganlar. Bloklagan odam `xabarlar: false` ga
  // o'tadi (webhook'dagi `my_chat_member`), ya'ni bu yerga tushmaydi.
  const oluvchilar = await prisma.telegramUlanish.findMany({
    where: { xabarlar: true },
    select: { chatId: true },
  })

  if (oluvchilar.length === 0) {
    return NextResponse.json(
      { error: 'Botga ulangan foydalanuvchi yo\'q' },
      { status: 400 }
    )
  }

  // Matn HTML rejimida ketadi. Admin yozgan `<` belgisi Telegramni
  // xato qaytarishga majbur qilardi, shuning uchun himoyalaymiz.
  // Qalin/qiya yozuv kerak bo'lsa, uni keyin alohida qo'shamiz.
  const tayyorMatn = tgHimoyala(matn)
  const havola = havolaUrl
    ? { matn: havolaMatn || 'Saytda ochish', url: havolaUrl }
    : undefined

  let yetdi = 0
  const xatolar = []
  const olikChatlar = []

  for (let i = 0; i < oluvchilar.length; i += BOLAK) {
    const bolak = oluvchilar.slice(i, i + BOLAK)

    const natijalar = await Promise.allSettled(
      bolak.map((u) =>
        rasm
          ? telegramRasmYubor(u.chatId, rasm, tayyorMatn, { havola })
          : telegramYubor(u.chatId, tayyorMatn, { havola })
      )
    )

    natijalar.forEach((n, j) => {
      const javob = n.status === 'fulfilled' ? n.value : { ok: false, sabab: 'yiqildi' }
      if (javob.ok) {
        yetdi++
        return
      }
      if (ulanishOlikmi(javob)) olikChatlar.push(bolak[j].chatId)
      if (xatolar.length < 5) xatolar.push(javob.sabab)
    })

    // Oxirgi bo'lakdan keyin kutish shart emas
    if (i + BOLAK < oluvchilar.length) {
      await new Promise((r) => setTimeout(r, TANAFFUS))
    }
  }

  // O'LIK YOZUVLARNI TOZALAYMIZ. Bloklangan yoki o'chirilgan chat har
  // e'londa qayta urinib ko'rilsa, vaqt va tezlik kvotasi behuda
  // ketardi. Bu xatolar o'tkinchi emas.
  if (olikChatlar.length > 0) {
    await prisma.telegramUlanish
      .deleteMany({ where: { chatId: { in: olikChatlar } } })
      .catch(() => {})
  }

  await qaydEt({
    adminId: user.id,
    action: 'Telegram e\'loni yuborildi',
    targetType: 'Telegram',
    details:
      `${yetdi}/${oluvchilar.length} yetdi` +
      (rasm ? ', rasm bilan' : '') +
      (olikChatlar.length ? `, ${olikChatlar.length} o'lik ulanish tozalandi` : '') +
      ` — "${matn.slice(0, 120)}"`,
    request,
  })

  return NextResponse.json({
    success: true,
    jami: oluvchilar.length,
    yetdi,
    yetmadi: oluvchilar.length - yetdi,
    tozalandi: olikChatlar.length,
    xatolar,
  })
}

// GET — nechta odamga ketishini oldindan ko'rsatish
export async function GET() {
  const { isSuperAdmin } = await checkAdminAuth()
  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const [jami, faol] = await Promise.all([
    prisma.telegramUlanish.count(),
    prisma.telegramUlanish.count({ where: { xabarlar: true } }),
  ])

  return NextResponse.json({
    success: true,
    jami,
    faol,
    chegara: CHEGARA,
  })
}
