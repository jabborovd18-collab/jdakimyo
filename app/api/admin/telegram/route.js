// app/api/admin/telegram/route.js
//
// Telegram botni SERVERNING O'ZIDAN sozlash.
//
// NEGA KERAK BO'LDI. Avval webhook `scripts/telegram-webhook.js`
// orqali ishlab chiqish kompyuteridan ro'yxatdan o'tkazilardi. Skript
// sir kalitni mahalliy `.env` dan olardi va uni Vercel'dagi bilan bir
// xil deb hisoblardi. Amalda ikkisi boshqacha bo'lib chiqdi: Telegram
// bir kalit yuborar, sayt boshqasini kutardi va HAR BIR xabar
// `401 Unauthorized` bilan rad etilardi. Bot esa "jim" ko'rinardi —
// xato faqat `getWebhookInfo` ichida yozilib turardi.
//
// Shuning uchun ro'yxatdan o'tkazish kalit TURGAN joyga ko'chirildi.
// Bu yerda ikki tomon bir xil `process.env` ni o'qiydi, ya'ni ular
// bir-biriga mos kelmasligi mumkin emas.
import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import {
  telegramSozlanganmi, webhookQoy, webhookHolati,
  menyuTugmasiQoy, buyruqlarniQoy, tavsifQoy,
} from '@/lib/telegram'

const SAYT = 'https://www.jdakimyo.uz'

const BUYRUQLAR = [
  { command: 'xabarlar', description: 'Oxirgi bildirishnomalar' },
  { command: 'holat', description: "Hisob ma'lumotlari" },
  { command: 'sozlama', description: "Xabar oqimini yoqish/o'chirish" },
  { command: 'uzish', description: 'Hisobni uzish' },
  { command: 'yordam', description: 'Yordam' },
]

/** Botni sozlash — bot butun sayt uchun bitta, ya'ni superadmin ishi */
async function ruxsat() {
  const { isSuperAdmin } = await checkAdminAuth()
  return isSuperAdmin
}

// GET — holat
export async function GET() {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const holat = {
    tokenBor: telegramSozlanganmi(),
    sirBor: Boolean(process.env.TELEGRAM_WEBHOOK_SIR),
    botNomi: process.env.TELEGRAM_BOT_USERNAME || null,
    kutilganManzil: `${SAYT}/api/telegram/webhook`,
  }

  if (!holat.tokenBor) {
    return NextResponse.json({ success: true, holat, webhook: null })
  }

  const javob = await webhookHolati()
  const w = javob.ok ? javob.natija : null

  return NextResponse.json({
    success: true,
    holat,
    webhook: w
      ? {
          manzil: w.url || null,
          togriManzilmi: w.url === holat.kutilganManzil,
          kutayotgan: w.pending_update_count,
          // Aynan shu maydon "bot nega jim" degan savolga javob beradi
          oxirgiXato: w.last_error_message || null,
          oxirgiXatoVaqti: w.last_error_date
            ? new Date(w.last_error_date * 1000).toISOString()
            : null,
        }
      : { xato: javob.sabab },
  })
}

// POST — webhook, menyu tugmasi, buyruqlar va tavsifni o'rnatish
export async function POST() {
  if (!(await ruxsat())) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  if (!telegramSozlanganmi() || !process.env.TELEGRAM_WEBHOOK_SIR) {
    return NextResponse.json(
      {
        error:
          'TELEGRAM_BOT_TOKEN yoki TELEGRAM_WEBHOOK_SIR qo\'yilmagan. ' +
          'Vercel sozlamalariga qo\'shib, qayta deploy qiling.',
      },
      { status: 503 }
    )
  }

  const url = `${SAYT}/api/telegram/webhook`
  const qadamlar = []

  // Kalit SHU YERDAGI muhitdan olinadi — shuning uchun Telegram
  // yuboradigan qiymat bilan biz kutadigan qiymat doim bir xil
  const w = await webhookQoy(url, process.env.TELEGRAM_WEBHOOK_SIR)
  qadamlar.push({ nom: 'webhook', ok: w.ok, sabab: w.sabab || null })

  const m = await menyuTugmasiQoy('Platforma', SAYT)
  qadamlar.push({ nom: 'menyu tugmasi', ok: m.ok, sabab: m.sabab || null })

  const b = await buyruqlarniQoy(BUYRUQLAR)
  qadamlar.push({ nom: 'buyruqlar', ok: b.ok, sabab: b.sabab || null })

  await tavsifQoy({
    tavsif:
      "JDA KIMYO — o'zbek tilida kompleks birikmalar kimyosi platformasi. " +
      'Bot saytdagi bildirishnomalarni yetkazadi va platformani ochadi.',
    qisqa: 'JDA KIMYO bildirishnomalari',
  })
  qadamlar.push({ nom: 'tavsif', ok: true, sabab: null })

  return NextResponse.json({
    success: qadamlar.every((q) => q.ok),
    manzil: url,
    qadamlar,
  })
}
