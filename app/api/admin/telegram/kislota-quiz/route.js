// Kislotalar quizini Render'dagi bot orqali boshqarish.
//
// Savollar bot xizmatida yashaydi: Telegram pollini aynan o'sha servis
// yuboradi. Sayt faqat superadmin tanlovini tekshiradi va yopiq ko'prik
// orqali uzatadi; kislotalar ro'yxatini bu yerda takrorlamaydi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

export const maxDuration = 30

const KUTISH_MS = 20000
const AMALLAR = new Set(['sozla', 'boshla', 'toxtat', 'yop'])

async function ruxsat() {
  const { isSuperAdmin } = await checkAdminAuth()
  return isSuperAdmin
}

function sozlama() {
  const manzil = String(process.env.BOT_ISHCHI_URL || '').replace(/\/$/, '')
  const kalit = String(process.env.BOT_KOPRUK_SIR || '').trim()
  return { manzil, kalit }
}

async function botgaSorov(method, tana) {
  const { manzil, kalit } = sozlama()
  if (!manzil || !kalit) return { sozlanmagan: true }

  const uzgich = new AbortController()
  const soat = setTimeout(() => uzgich.abort(), KUTISH_MS)
  try {
    const javob = await fetch(`${manzil}/kislota-quiz`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Bridge-Secret': kalit,
      },
      body: tana ? JSON.stringify(tana) : undefined,
      signal: uzgich.signal,
      cache: 'no-store',
    })
    const malumot = await javob.json().catch(() => null)
    return { javob, malumot }
  } catch (error) {
    return { xato: error.name === 'AbortError' ? 'muddat-tugadi' : 'ulanmadi' }
  } finally {
    clearTimeout(soat)
  }
}

export async function GET() {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const natija = await botgaSorov('GET')
  if (natija.sozlanmagan) {
    return NextResponse.json({ error: 'Bot ko\'prigi sozlanmagan' }, { status: 503 })
  }
  if (natija.xato || !natija.javob?.ok) {
    return NextResponse.json(
      { error: 'Bot xizmatidan holat olinmadi', sabab: natija.xato || natija.malumot?.xato },
      { status: 502 },
    )
  }
  return NextResponse.json(natija.malumot)
}

export async function POST(request) {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const tana = await request.json().catch(() => null)
  if (!tana || !AMALLAR.has(tana.amal)) {
    return NextResponse.json({ error: 'Amal noto\'g\'ri' }, { status: 400 })
  }

  const chatId = String(tana.chatId || '')
  const guruh = await prisma.telegramGuruh.findUnique({ where: { chatId } })
  if (!guruh?.faol) {
    return NextResponse.json({ error: 'Faol Telegram guruhi topilmadi' }, { status: 404 })
  }

  if (tana.amal === 'sozla') {
    const savollarSoni = Number(tana.savollarSoni)
    const vaqtLimiti = Number(tana.vaqtLimiti)
    if (tana.yonalish !== 'aralash' || savollarSoni !== 20) {
      return NextResponse.json({ error: 'Kislotalar testi 58 ta aralash bankdan 20 ta savol oladi' }, { status: 400 })
    }
    if (![15, 30, 60].includes(vaqtLimiti)) {
      return NextResponse.json({ error: 'Vaqt limiti noto\'g\'ri' }, { status: 400 })
    }
    if (![0, 3, 5, 10].includes(Number(tana.boshlashSanogi))) {
      return NextResponse.json({ error: 'Boshlash sanog\'i noto\'g\'ri' }, { status: 400 })
    }
    if (![1, 2, 3, 5].includes(Number(tana.tanaffusSoni))) {
      return NextResponse.json({ error: 'Savollar orasidagi tanaffus noto\'g\'ri' }, { status: 400 })
    }
    if (![5, 10, 20].includes(Number(tana.reytingSoni))) {
      return NextResponse.json({ error: 'Reyting soni noto\'g\'ri' }, { status: 400 })
    }
  }

  const natija = await botgaSorov('POST', {
    amal: tana.amal,
    chatId,
    chatNomi: guruh.nom,
    yonalish: tana.yonalish,
    savollarSoni: Number(tana.savollarSoni),
    vaqtLimiti: Number(tana.vaqtLimiti),
    boshlashSanogi: Number(tana.boshlashSanogi),
    tanaffusSoni: Number(tana.tanaffusSoni),
    oquvchiBoshlashi: tana.oquvchiBoshlashi !== false,
    reytingniKorsat: tana.reytingniKorsat !== false,
    reytingSoni: Number(tana.reytingSoni),
    darhol: Boolean(tana.darhol),
  })

  if (natija.sozlanmagan) {
    return NextResponse.json({ error: 'Bot ko\'prigi sozlanmagan' }, { status: 503 })
  }
  if (natija.xato || !natija.javob?.ok) {
    return NextResponse.json(
      { error: natija.malumot?.xato || 'Bot buyrug\'ini bajarmadi', sabab: natija.xato },
      { status: natija.javob?.status || 502 },
    )
  }
  return NextResponse.json(natija.malumot)
}
