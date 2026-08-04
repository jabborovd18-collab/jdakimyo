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

/** Tasdiqlash kodi xati */
export function tasdiqXati({ ism, kod }) {
  const mavzu = `${kod} — JDA KIMYO tasdiqlash kodi`

  const matn = [
    `Salom, ${ism}!`,
    '',
    `JDA KIMYO uchun tasdiqlash kodingiz: ${kod}`,
    '',
    'Kod 30 daqiqa amal qiladi.',
    'Agar bu siz bo\'lmasangiz, bu xatni e\'tiborsiz qoldiring.',
  ].join('\n')

  // Uslub xatning ICHIDA yozilgan: pochta mijozlari tashqi CSS ni
  // va ko'pincha <style> blokini ham o'chirib tashlaydi.
  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0f0a1e;padding:32px 16px">
  <div style="max-width:480px;margin:0 auto;background:#1a1030;border:1px solid #4c1d95;border-radius:16px;padding:28px">
    <div style="font-size:20px;font-weight:700;color:#fbbf24;margin-bottom:4px">JDA KIMYO</div>
    <div style="font-size:13px;color:#a78bfa;margin-bottom:22px">Kompleks birikmalar kimyosi</div>

    <div style="font-size:15px;color:#e9d5ff;margin-bottom:18px">Salom, ${ism}!</div>
    <div style="font-size:14px;color:#c4b5fd;margin-bottom:18px">
      Ro'yxatdan o'tishni yakunlash uchun quyidagi kodni saytga kiriting:
    </div>

    <div style="background:#2e1065;border:1px solid #7c3aed;border-radius:12px;padding:18px;text-align:center;margin-bottom:18px">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#fde68a">${kod}</span>
    </div>

    <div style="font-size:13px;color:#a78bfa;margin-bottom:6px">Kod 30 daqiqa amal qiladi.</div>
    <div style="font-size:12px;color:#7c6aa8">
      Agar bu siz bo'lmasangiz, bu xatni e'tiborsiz qoldiring — hech narsa o'zgarmaydi.
    </div>
  </div>
</div>`.trim()

  return { mavzu, html, matn }
}
