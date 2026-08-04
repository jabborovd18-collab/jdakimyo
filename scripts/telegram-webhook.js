/**
 * Telegram webhook manzilini ro'yxatdan o'tkazish va tekshirish.
 *
 *   node scripts/telegram-webhook.js holat    — hozirgi holatni ko'rish
 *   node scripts/telegram-webhook.js qoy      — webhook'ni o'rnatish
 *
 * NEGA QO'LDA. Webhook bir marta o'rnatiladi va Telegram uni o'zida
 * saqlaydi — har deploy'da qayta yozish shart emas va zararli ham:
 * deploy paytida chaqirilsa, har chiqarishda Telegramga keraksiz
 * so'rov ketardi.
 *
 * Kerakli o'zgaruvchilar (.env yoki muhitdan):
 *   TELEGRAM_BOT_TOKEN    — @BotFather bergan token
 *   TELEGRAM_WEBHOOK_SIR  — o'zingiz o'ylab topgan uzun maxfiy satr
 *   SAYT_MANZIL           — ixtiyoriy, sukut bo'yicha www.jdakimyo.uz
 */
const fs = require('fs')
const path = require('path')
const esmRequire = require('./_esm-require')

// .env ni o'qiymiz: skript Next.js dan tashqarida ishlaydi va
// o'zgaruvchilar o'zi yuklanmaydi
const envYol = path.join(__dirname, '..', '.env')
if (fs.existsSync(envYol)) {
  for (const qator of fs.readFileSync(envYol, 'utf8').split('\n')) {
    const m = qator.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const {
  webhookQoy, webhookHolati, telegramSozlanganmi,
  menyuTugmasiQoy, buyruqlarniQoy, tavsifQoy,
} = esmRequire('lib/telegram.js', [
  'webhookQoy',
  'webhookHolati',
  'telegramSozlanganmi',
  'menyuTugmasiQoy',
  'buyruqlarniQoy',
  'tavsifQoy',
])

const SAYT = process.env.SAYT_MANZIL || 'https://www.jdakimyo.uz'

/** "/" bosilganda chiqadigan ro'yxat */
const BUYRUQLAR = [
  { command: 'xabarlar', description: 'Oxirgi bildirishnomalar' },
  { command: 'holat', description: "Hisob ma'lumotlari" },
  { command: 'sozlama', description: "Xabar oqimini yoqish/o'chirish" },
  { command: 'uzish', description: 'Hisobni uzish' },
  { command: 'yordam', description: 'Yordam' },
]

async function main() {
  const amal = process.argv[2] || 'holat'

  if (!telegramSozlanganmi()) {
    console.error('TELEGRAM_BOT_TOKEN qo\'yilmagan.')
    process.exit(1)
  }

  if (amal === 'holat') {
    const javob = await webhookHolati()
    if (!javob.ok) {
      console.error('Xato:', javob.sabab)
      process.exit(1)
    }
    const h = javob.natija
    console.log('Manzil        :', h.url || '(o\'rnatilmagan)')
    console.log('Kutayotgan    :', h.pending_update_count)
    console.log('Sir kalit bor :', h.has_custom_certificate === false && h.url ? 'ha (Telegram ko\'rsatmaydi)' : '—')
    if (h.last_error_message) {
      console.log('Oxirgi xato   :', h.last_error_message)
    }
    return
  }

  if (amal === 'qoy') {
    if (!process.env.TELEGRAM_WEBHOOK_SIR) {
      console.error('TELEGRAM_WEBHOOK_SIR qo\'yilmagan — sirsiz webhook ochiq qoladi.')
      process.exit(1)
    }

    const url = `${SAYT}/api/telegram/webhook`
    const javob = await webhookQoy(url, process.env.TELEGRAM_WEBHOOK_SIR)

    if (!javob.ok) {
      console.error('O\'rnatilmadi:', javob.sabab)
      process.exit(1)
    }
    console.log('Webhook o\'rnatildi:', url)

    // MENYU TUGMASI — yozuv maydoni yonida turadi va saytni Telegram
    // ichida ochadi. Sukut bo'yicha u yerda "/" bo'ladi; nomlangan
    // tugma botni saytga kirish nuqtasiga aylantiradi.
    const menyu = await menyuTugmasiQoy('Platforma', SAYT)
    console.log(menyu.ok ? 'Menyu tugmasi: Platforma' : `Menyu tugmasi XATO: ${menyu.sabab}`)

    const buyruqlar = await buyruqlarniQoy(BUYRUQLAR)
    console.log(buyruqlar.ok ? `Buyruqlar: ${BUYRUQLAR.length} ta` : `Buyruqlar XATO: ${buyruqlar.sabab}`)

    await tavsifQoy({
      tavsif:
        "JDA KIMYO — o'zbek tilida kompleks birikmalar kimyosi platformasi. " +
        'Bot saytdagi bildirishnomalarni yetkazadi va platformani ochadi.',
      qisqa: 'JDA KIMYO bildirishnomalari',
    })
    console.log('Tavsif yozildi')
    return
  }

  console.error('Noma\'lum amal. "holat" yoki "qoy".')
  process.exit(1)
}

main()
