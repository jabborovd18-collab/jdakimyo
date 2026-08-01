// lib/sertifikat-pdf.js
//
// Sertifikat PDF'i — brauzerda yasaladi.
//
// Nega pdf-lib va html2canvas emas: eski sertifikat sahifasi html2canvas bilan
// ekran suratini olib PDF'ga solardi — natija xira, hajmi katta va matn
// tanlanmaydigan rasm bo'lardi. pdf-lib esa haqiqiy matnli PDF beradi.
// Loyihadagi 3D sahifalar ham aynan shu yo'ldan boradi.
//
// Nega DejaVu: pdf-lib ning standart shriftlari (Helvetica) WinAnsi bilan
// cheklangan, ya'ni "oʻ", "gʻ" kabi harflarni umuman chiza olmaydi va xato
// tashlaydi. DejaVu — public/fonts/ da turadi.
import { PDFDocument, rgb, degrees } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import QRCode from 'qrcode'
import { sana } from './sana'

// QR kod DOIMIY manzilga ishora qilishi shart.
//
// window.location.origin ishlatilsa, localhost'da yasalgan sertifikatning QR
// kodi localhost'ga ketardi — sertifikat esa qog'ozda yillar davomida qoladi.
// (Eski sahifada bundan ham yomoni bor edi: manzil "jda-kimyo.uz" deb defis
// bilan yozilgan, ya'ni mavjud bo'lmagan domenga ishora qilardi.)
const SAYT = process.env.NEXT_PUBLIC_SAYT_MANZILI || 'https://jdakimyo.uz'

export const tekshirishHavolasi = (certId) => `${SAYT}/sertifikat/verify/${certId}`

// A4 yotiq
const W = 841.89
const H = 595.28

const C = {
  fon: rgb(1, 1, 1),
  siyoh: rgb(0.08, 0.08, 0.16),
  kulrang: rgb(0.42, 0.42, 0.50),
  binafsha: rgb(0.30, 0.11, 0.58),
  binafshaOch: rgb(0.55, 0.36, 0.86),
  oltin: rgb(0.72, 0.55, 0.05),
  oltinOch: rgb(0.93, 0.78, 0.35),
  chiziq: rgb(0.85, 0.85, 0.90),
  qizil: rgb(0.72, 0.15, 0.15),
}

/** HTML qoldiqlari va ortiqcha bo'shliqlarni tozalaydi */
function toza(matn) {
  if (matn === null || matn === undefined) return ''
  return String(matn)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function olchov(matn, shrift, olcham) {
  try {
    return shrift.widthOfTextAtSize(String(matn || ''), olcham)
  } catch {
    return String(matn || '').length * olcham * 0.5
  }
}

/** Matnni berilgan kenglikka sig'adigan qatorlarga bo'ladi */
function qatorlarga(matn, shrift, olcham, maxKenglik) {
  const t = toza(matn)
  if (!t) return []

  const sozlar = t.split(' ')
  const qatorlar = []
  let joriy = ''

  for (const soz of sozlar) {
    const sinov = joriy ? `${joriy} ${soz}` : soz
    if (olchov(sinov, shrift, olcham) <= maxKenglik) {
      joriy = sinov
    } else {
      if (joriy) qatorlar.push(joriy)
      joriy = soz
    }
  }
  if (joriy) qatorlar.push(joriy)
  return qatorlar
}

/** Data URL yoki URL'dan baytlar */
async function baytlar(manzil) {
  const javob = await fetch(manzil)
  if (!javob.ok) throw new Error('Yuklab bo‘lmadi: ' + manzil)
  return javob.arrayBuffer()
}

/**
 * Sertifikat PDF'ini yasab, brauzerda yuklab olishni boshlaydi.
 * @param {object} s — Certificate yozuvi (certId, fullName, fan, reason, ...)
 */
export async function sertifikatPDFYuklab(s) {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const [rBaytlar, bBaytlar] = await Promise.all([
    baytlar('/fonts/DejaVuSans.ttf'),
    baytlar('/fonts/DejaVuSans-Bold.ttf'),
  ])
  const oddiy = await doc.embedFont(rBaytlar, { subset: true })
  const qalin = await doc.embedFont(bBaytlar, { subset: true })

  doc.setTitle(`Sertifikat ${s.certId} — ${toza(s.fullName)}`)
  doc.setAuthor('JDA KIMYO')
  doc.setSubject(toza(s.fan))
  doc.setCreator('jdakimyo.uz')

  const sahifa = doc.addPage([W, H])
  sahifa.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.fon })

  // ─── Ramka ───
  sahifa.drawRectangle({
    x: 22, y: 22, width: W - 44, height: H - 44,
    borderColor: C.binafsha, borderWidth: 2.5,
  })
  sahifa.drawRectangle({
    x: 30, y: 30, width: W - 60, height: H - 60,
    borderColor: C.oltinOch, borderWidth: 0.8,
  })

  const markaz = (matn, shrift, olcham, y, rang = C.siyoh) => {
    const t = toza(matn)
    const w = olchov(t, shrift, olcham)
    sahifa.drawText(t, { x: (W - w) / 2, y, size: olcham, font: shrift, color: rang })
  }

  // ─── Sarlavha ───
  markaz('JDA KIMYO', qalin, 20, H - 78, C.binafsha)
  markaz('jdakimyo.uz', oddiy, 8.5, H - 92, C.kulrang)

  markaz('SERTIFIKAT', qalin, 40, H - 148, C.oltin)

  sahifa.drawLine({
    start: { x: W / 2 - 110, y: H - 166 },
    end: { x: W / 2 + 110, y: H - 166 },
    thickness: 1.5, color: C.oltinOch,
  })

  markaz('Ushbu sertifikat quyidagi shaxsga berildi', oddiy, 11, H - 192, C.kulrang)

  // ─── Ism ───
  // Uzun ism ramkadan chiqib ketmasligi uchun o'lcham bosqichma-bosqich kichrayadi
  const ism = toza(s.fullName)
  let ismOlcham = 34
  while (ismOlcham > 16 && olchov(ism, qalin, ismOlcham) > W - 180) ismOlcham -= 1
  markaz(ism, qalin, ismOlcham, H - 236, C.siyoh)

  sahifa.drawLine({
    start: { x: 150, y: H - 250 },
    end: { x: W - 150, y: H - 250 },
    thickness: 0.8, color: C.chiziq,
  })

  // ─── Fan va sabab ───
  let y = H - 282
  markaz(toza(s.fan), qalin, 15, y, C.binafshaOch)
  y -= 24
  markaz(toza(s.reason), oddiy, 13, y, C.siyoh)
  y -= 22

  if (s.description) {
    for (const qator of qatorlarga(s.description, oddiy, 10.5, W - 260).slice(0, 3)) {
      markaz(qator, oddiy, 10.5, y, C.kulrang)
      y -= 15
    }
  }

  // ─── Daraja va ball ───
  const baholar = []
  if (s.grade) baholar.push(`Daraja: ${toza(s.grade)}`)
  if (s.score !== null && s.score !== undefined) baholar.push(`Ball: ${s.score}`)
  if (s.percentage !== null && s.percentage !== undefined) baholar.push(`${s.percentage}%`)
  if (baholar.length > 0) {
    y -= 6
    markaz(baholar.join('   ·   '), qalin, 11, y, C.oltin)
  }

  // ─── Bekor qilingan bo'lsa — buni yashirmaslik kerak ───
  if (s.status !== 'valid') {
    sahifa.drawText('BEKOR QILINGAN', {
      x: W / 2 - 190, y: H / 2 - 30, size: 60, font: qalin,
      color: C.qizil, opacity: 0.18, rotate: degrees(20),
    })
  }

  // ─── Pastki qism: QR, raqam, pechatlar ───
  const pastY = 62

  const qrDataUrl = await QRCode.toDataURL(tekshirishHavolasi(s.certId), {
    width: 300, margin: 0,
    color: { dark: '#4C1D95', light: '#FFFFFF' },
  })
  const qrRasm = await doc.embedPng(await baytlar(qrDataUrl))
  const qrOlcham = 76
  sahifa.drawImage(qrRasm, { x: 62, y: pastY, width: qrOlcham, height: qrOlcham })
  sahifa.drawText('Tekshirish uchun', {
    x: 62, y: pastY - 12, size: 7, font: oddiy, color: C.kulrang,
  })

  // Raqam va sana — QR yonida
  sahifa.drawText('Sertifikat raqami', {
    x: 152, y: pastY + 58, size: 7.5, font: oddiy, color: C.kulrang,
  })
  sahifa.drawText(s.certId, {
    x: 152, y: pastY + 42, size: 14, font: qalin, color: C.binafsha,
  })
  sahifa.drawText(`Berilgan sana: ${sana(s.issuedAt)}`, {
    x: 152, y: pastY + 24, size: 9, font: oddiy, color: C.siyoh,
  })
  if (s.expiresAt) {
    sahifa.drawText(`Amal qiladi: ${sana(s.expiresAt)} gacha`, {
      x: 152, y: pastY + 10, size: 9, font: oddiy, color: C.kulrang,
    })
  }

  // Pechatlar — o'ngdan chapga
  const pechatlar = Array.isArray(s.seals) ? s.seals : []
  let pechatX = W - 62
  for (const pechat of pechatlar.slice(0, 3)) {
    try {
      const bayt = await baytlar(pechat.url)
      // Kengaytmaga ishonmaymiz — fayl mazmuni bo'yicha aniqlaymiz
      let rasm
      try {
        rasm = await doc.embedPng(bayt)
      } catch {
        rasm = await doc.embedJpg(bayt)
      }

      const olchamP = 68
      const nisbat = rasm.width / rasm.height
      const w = nisbat >= 1 ? olchamP : olchamP * nisbat
      const h = nisbat >= 1 ? olchamP / nisbat : olchamP

      pechatX -= w
      sahifa.drawImage(rasm, { x: pechatX, y: pastY + (olchamP - h) / 2, width: w, height: h })

      if (pechat.label) {
        const yorliq = toza(pechat.label)
        const yw = olchov(yorliq, oddiy, 7)
        sahifa.drawText(yorliq, {
          x: pechatX + (w - yw) / 2, y: pastY - 12, size: 7, font: oddiy, color: C.kulrang,
        })
      }
      pechatX -= 14
    } catch {
      // Pechat yuklanmasa sertifikat baribir chiqadi — muhri yo'q holda
    }
  }

  // ─── Pastki chiziq ───
  sahifa.drawLine({
    start: { x: 62, y: 44 }, end: { x: W - 62, y: 44 },
    thickness: 0.5, color: C.chiziq,
  })
  const havola = tekshirishHavolasi(s.certId)
  const hw = olchov(havola, oddiy, 7.5)
  sahifa.drawText(havola, {
    x: (W - hw) / 2, y: 33, size: 7.5, font: oddiy, color: C.kulrang,
  })

  // ─── Yuklab olish ───
  const pdfBaytlar = await doc.save()
  const blob = new Blob([pdfBaytlar], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const havolaEl = document.createElement('a')
  havolaEl.href = url
  havolaEl.download = `${s.certId}.pdf`
  document.body.appendChild(havolaEl)
  havolaEl.click()
  document.body.removeChild(havolaEl)
  URL.revokeObjectURL(url)
}
