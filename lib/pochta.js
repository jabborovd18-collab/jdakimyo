// lib/pochta.js
//
// Xat yuborishning yagona joyi.
//
// NEGA PAKET YO'Q. Resend'ning o'z kutubxonasi bor, lekin u faqat
// oddiy HTTP so'rovni o'raydi. Bitta `fetch` uchun bog'liqlik qo'shish
// va uni yangilab yurish keraksiz.
//
// KALIT YO'Q BO'LSA XATO TASHLANMAYDI. Ishlab chiqishda va kalit hali
// qo'yilmagan paytda ro'yxatdan o'tish YIQILMASLIGI kerak: xat
// ketmaydi, kod konsolga yoziladi va foydalanuvchiga "xat yuborilmadi"
// deb ochiq aytiladi. Sukut saqlab "yuborildi" deyish eng yomon variant.

const RESEND_URL = 'https://api.resend.com/emails'

/** Xatlarda ko'rsatiladigan rasmiy manzil */
const SAYT = 'https://www.jdakimyo.uz'

/** Kalit va jo'natuvchi sozlanganmi */
export function pochtaSozlanganmi() {
  return Boolean(process.env.RESEND_API_KEY && process.env.POCHTA_FROM)
}

/**
 * Xat yuboradi.
 * @returns {Promise<{yuborildi: boolean, sabab?: string}>}
 */
export async function xatYubor({ kimga, mavzu, html, matn }) {
  if (!pochtaSozlanganmi()) {
    console.warn('[Pochta] RESEND_API_KEY yoki POCHTA_FROM yo\'q — xat yuborilmadi')
    return { yuborildi: false, sabab: 'sozlanmagan' }
  }

  try {
    const javob = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.POCHTA_FROM,
        to: [kimga],
        subject: mavzu,
        html,
        text: matn,
      }),
    })

    if (!javob.ok) {
      const xato = await javob.text()
      console.error('[Pochta] Resend rad etdi:', javob.status, xato.slice(0, 300))
      return { yuborildi: false, sabab: `xizmat xatosi (${javob.status})` }
    }

    return { yuborildi: true }
  } catch (e) {
    console.error('[Pochta] yuborib bo\'lmadi:', e.message)
    return { yuborildi: false, sabab: 'tarmoq xatosi' }
  }
}

/**
 * Xatga qo'yiladigan matnni zararsizlantiradi.
 *
 * NEGA KERAK. Ilgari foydalanuvchi ismi (`fullName`) xat HTML'iga
 * to'g'ridan-to'g'ri qo'yilardi. Ism ro'yxatdan o'tishda qanday
 * yozilsa shunday saqlanadi — ya'ni `<b>` yoki `<img src=x ...>`
 * deb yozgan odam xatning ko'rinishini buzardi. Bugun xat faqat
 * odamning O'ZIGA boradi, lekin "falonchi sizga sovg'a yubordi"
 * kabi xat qo'shilishi bilan bu birovning xatiga begona HTML
 * qo'yish yo'liga aylanardi.
 */
function himoyala(matn) {
  return String(matn ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Barcha xatlar uchun umumiy rasmiy qobiq.
 *
 * NEGA JADVAL, DIV EMAS. Pochta mijozlari (ayniqsa Outlook) flexbox
 * va grid ni tushunmaydi — maket jadvalsiz tarqab ketadi. Bu veb
 * emas, shuning uchun 2005-yilgi usul ataylab ishlatilgan.
 *
 * NEGA OQ FON. Avval xat to'q binafsha edi: saytga o'xshardi, lekin
 * pochta qutisida o'yin reklamasiga o'xshab turardi va Gmail'ning
 * qorong'i rejimida ranglar ag'darilib ketardi. Rasmiy xat — oq fon,
 * qora matn; brend rangi faqat sarlavha va urg'uda qoladi.
 *
 * NEGA PREHEADER. Pochta ro'yxatida mavzu yonida xatning birinchi
 * matni ko'rinadi. Boshqarilmasa u yerga tasodifiy so'z tushadi.
 *
 * @param {object} p
 * @param {string} p.sarlavha Xat ichidagi asosiy sarlavha
 * @param {string} p.ostki Ro'yxatda ko'rinadigan qisqa matn (preheader)
 * @param {string} p.tana Tayyor HTML (chaqiruvchi himoyalab beradi)
 */
function xatQobigi({ sarlavha, ostki, tana }) {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${himoyala(sarlavha)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f2f6;">
  <!-- Preheader: pochta ro'yxatida mavzu yonida shu matn ko'rinadi,
       xatning o'zida ko'rinmaydi -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${himoyala(ostki)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f2f6;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e3e5ea;border-radius:8px;overflow:hidden;">

          <!-- Sarlavha -->
          <tr>
            <td style="background:#2e1065;padding:22px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">
                    JDA KIMYO
                  </td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#c4b5fd;">
                    jdakimyo.uz
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tana -->
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;">
              <div style="font-size:18px;font-weight:bold;color:#111827;margin:0 0 18px 0;">
                ${himoyala(sarlavha)}
              </div>
              ${tana}
            </td>
          </tr>

          <!-- Ajratgich -->
          <tr>
            <td style="padding:0 32px;">
              <div style="border-top:1px solid #e3e5ea;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Poyabzal -->
          <tr>
            <td style="padding:20px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6b7280;">
              <p style="margin:0 0 8px 0;">
                Bu xat <a href="${SAYT}" style="color:#5b21b6;text-decoration:none;">jdakimyo.uz</a>
                — oliy kimyo platformasi tomonidan avtomatik yuborildi.
              </p>
              <p style="margin:0;color:#9ca3af;">
                Xatga javob yozmang — bu manzil javoblarni qabul qilmaydi.
              </p>
            </td>
          </tr>

        </table>

        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#9ca3af;padding:16px 8px 0 8px;">
          © ${new Date().getFullYear()} JDA KIMYO
        </div>

      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Tasdiqlash kodi xati */
export function tasdiqXati({ ism, kod }) {
  // Mavzuda kod BOSHIDA turadi: telefon bildirishnomasida mavzuning
  // faqat boshi ko'rinadi va odam xatni ochmasdan kodni ko'ra oladi.
  const mavzu = `${kod} — JDA KIMYO tasdiqlash kodi`

  const matn = [
    `Salom, ${ism}!`,
    '',
    `JDA KIMYO uchun tasdiqlash kodingiz: ${kod}`,
    '',
    'Kodni saytdagi tasdiqlash oynasiga kiriting.',
    'Kod 30 daqiqa amal qiladi.',
    '',
    'Agar ro\'yxatdan o\'tmagan bo\'lsangiz, bu xatni e\'tiborsiz qoldiring —',
    'hech qanday hisob ochilmaydi va hech narsa o\'zgarmaydi.',
    '',
    '—',
    'jdakimyo.uz | Bu avtomatik xat, javob bermang.',
  ].join('\n')

  const tana = `
              <p style="font-size:15px;line-height:23px;color:#374151;margin:0 0 16px 0;">
                Assalomu alaykum, <strong>${himoyala(ism)}</strong>!
              </p>
              <p style="font-size:15px;line-height:23px;color:#374151;margin:0 0 22px 0;">
                Hisobingizni tasdiqlash uchun quyidagi kodni saytdagi
                tasdiqlash oynasiga kiriting:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px 0;">
                <tr>
                  <td align="center" style="background:#f6f4ff;border:1px solid #ddd6fe;border-radius:6px;padding:20px;">
                    <div style="font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:9px;color:#2e1065;">
                      ${himoyala(kod)}
                    </div>
                    <div style="font-size:12px;color:#6b7280;padding-top:8px;">
                      Kod 30 daqiqa amal qiladi
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;line-height:20px;color:#6b7280;margin:0;">
                Agar siz ro'yxatdan o'tmagan bo'lsangiz, bu xatni e'tiborsiz
                qoldiring — hech qanday hisob ochilmaydi va hech narsa
                o'zgarmaydi. Kodni hech kimga aytmang.
              </p>`

  const html = xatQobigi({
    sarlavha: 'Elektron pochtani tasdiqlash',
    // Ro'yxatda ko'rinadigan matn. Kodning O'ZI bu yerga qo'yilmadi:
    // preheader qulflanmagan ekranda ham ko'rinadi.
    ostki: 'Hisobingizni tasdiqlash uchun kod yuborildi.',
    tana,
  })

  return { mavzu, html, matn }
}
