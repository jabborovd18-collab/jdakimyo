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

  // Tekshiramiz: Mavsumiy Hamkorlik (AlchemIQ) sertifikatimi?
  const isMavsumiy = s.seals?.partnerName || s.fan?.includes('Mavsumiy Hamkorlik') || String(s.certId).startsWith('AK-')

  if (isMavsumiy) {
    // ═══════════════════════════════════════════════════════════════
    // ALCHEMIQ & JDA KIMYO MAVSUMIY SHABLONI
    // ═══════════════════════════════════════════════════════════════
    const partnerName = s.seals?.partnerName || 'AlchemIQ'
    const partnerSignName = s.seals?.partnerSignName || 'AlchemIQ Sardor Ergashev'
    const jdaSignName = s.seals?.jdaSignName || 'JDA Kimyo Jamoasi'
    const badgeText = s.seals?.badgeText || 'YUKORI NATIJA'

    // Oq/och sarg'ish fon
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: H,
      color: rgb(0.96, 0.94, 0.91),
    })

    // Chapdagi to'q-ko'k / qora vertikal zona
    sahifa.drawRectangle({
      x: 0, y: 0, width: 230, height: H,
      color: rgb(0.04, 0.07, 0.12),
    })

    // Oltin to'lqin chizig'i va qirrasi
    sahifa.drawRectangle({
      x: 226, y: 0, width: 6, height: H,
      color: rgb(0.85, 0.68, 0.25),
    })

    // Chap tomondagi AlchemIQ gerbi / logotipi
    sahifa.drawRectangle({
      x: 35, y: H - 180, width: 160, height: 110,
      color: rgb(0.06, 0.10, 0.16),
      borderColor: rgb(0.85, 0.68, 0.25),
      borderWidth: 1.5,
    })
    const alchW = olchov(partnerName, qalin, 20)
    sahifa.drawText(partnerName, {
      x: 35 + (160 - alchW) / 2, y: H - 135, size: 20, font: qalin,
      color: rgb(0.95, 0.85, 0.45),
    })
    const signSubW = olchov(partnerSignName, oddiy, 8)
    sahifa.drawText(partnerSignName, {
      x: 35 + (160 - signSubW) / 2, y: H - 160, size: 8, font: oddiy,
      color: rgb(0.80, 0.80, 0.85),
    })

    // O'ng tepada JDA KIMYO logotipi
    const jdaW = olchov('JDA KIMYO', qalin, 18)
    sahifa.drawText('JDA KIMYO', {
      x: W - 70 - jdaW, y: H - 65, size: 18, font: qalin,
      color: rgb(0.08, 0.10, 0.15),
    })

    // ─── SERTIFIKAT SARLAVHASI ───
    const serW = olchov('SERTIFIKAT', qalin, 42)
    sahifa.drawText('SERTIFIKAT', {
      x: 240 + (W - 240 - serW) / 2, y: H - 145, size: 42, font: qalin,
      color: rgb(0.08, 0.10, 0.15),
    })

    const ushbuW = olchov('Ushbu sertifikat', oddiy, 12)
    sahifa.drawText('Ushbu sertifikat', {
      x: 240 + (W - 240 - ushbuW) / 2, y: H - 168, size: 12, font: oddiy,
      color: rgb(0.35, 0.35, 0.40),
    })

    // ─── QATNASHUVCHI ISMI ───
    const ism = toza(s.fullName)
    let ismOlcham = 28
    while (ismOlcham > 16 && olchov(ism, qalin, ismOlcham) > W - 320) ismOlcham -= 1
    const ismW = olchov(ism, qalin, ismOlcham)
    sahifa.drawText(ism, {
      x: 240 + (W - 240 - ismW) / 2, y: H - 215, size: ismOlcham, font: qalin,
      color: rgb(0.05, 0.08, 0.15),
    })

    // Ism ostidagi chiziq
    sahifa.drawLine({
      start: { x: 280, y: H - 228 },
      end: { x: W - 60, y: H - 228 },
      thickness: 1.2, color: rgb(0.20, 0.20, 0.25),
    })

    // ─── MATN / SABAB ───
    let y = H - 260
    const sababMatnlari = qatorlarga(toza(s.reason), oddiy, 12, W - 360)
    for (const qator of sababMatnlari.slice(0, 4)) {
      const qw = olchov(qator, oddiy, 12)
      sahifa.drawText(qator, {
        x: 240 + (W - 240 - qw) / 2, y, size: 12, font: oddiy,
        color: rgb(0.15, 0.15, 0.20),
      })
      y -= 18
    }

    // ─── O'RTA QISM: Natija, Oltin Medal, Sertifikat ID ───
    const midY = H - 365

    // Chapda: Natija & Sana
    sahifa.drawText('Natija:', { x: 265, y: midY + 18, size: 11, font: oddiy, color: rgb(0.15, 0.15, 0.20) })
    const ballMatn = s.percentage ? `${s.percentage}% (${s.score || 0} ball)` : `${s.score || 0} ball`
    sahifa.drawText(ballMatn, { x: 315, y: midY + 18, size: 11, font: qalin, color: rgb(0.05, 0.05, 0.10) })
    sahifa.drawLine({ start: { x: 310, y: midY + 14 }, end: { x: 420, y: midY + 14 }, thickness: 0.8, color: rgb(0.4, 0.4, 0.4) })

    sahifa.drawText('Sana:', { x: 265, y: midY - 10, size: 11, font: oddiy, color: rgb(0.15, 0.15, 0.20) })
    sahifa.drawText(sana(s.issuedAt), { x: 315, y: midY - 10, size: 11, font: oddiy, color: rgb(0.05, 0.05, 0.10) })
    sahifa.drawLine({ start: { x: 310, y: midY - 14 }, end: { x: 420, y: midY - 14 }, thickness: 0.8, color: rgb(0.4, 0.4, 0.4) })

    // O'rtada: Oltin Medal / Gerb
    sahifa.drawCircle({
      x: 500, y: midY + 5, size: 36,
      color: rgb(0.12, 0.14, 0.18),
      borderColor: rgb(0.85, 0.68, 0.25),
      borderWidth: 2,
    })
    const badgeW = olchov(badgeText, qalin, 8)
    sahifa.drawText('★ ★ ★', { x: 485, y: midY + 20, size: 7, font: qalin, color: rgb(0.95, 0.85, 0.45) })
    sahifa.drawText(badgeText, { x: 500 - badgeW / 2, y: midY + 2, size: 8, font: qalin, color: rgb(0.95, 0.85, 0.45) })
    sahifa.drawText('★ ★ ★', { x: 485, y: midY - 14, size: 7, font: qalin, color: rgb(0.95, 0.85, 0.45) })

    // O'ngda: Sertifikat ID
    sahifa.drawText('Sertifikat ID:', { x: 580, y: midY + 18, size: 10.5, font: oddiy, color: rgb(0.20, 0.20, 0.25) })
    sahifa.drawText(s.certId, {
      x: 580, y: midY - 2, size: 13, font: qalin,
      color: rgb(0.72, 0.15, 0.15), // Qizil sertifikat ID
    })

    // ─── PASTKI IMZOLAR VA QR-KOD ───
    const signY = 100

    // 1-Imzo (AlchemIQ)
    sahifa.drawLine({ start: { x: 260, y: signY + 24 }, end: { x: 400, y: signY + 24 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) })
    sahifa.drawText(partnerName, { x: 300, y: signY + 10, size: 9.5, font: qalin, color: rgb(0.1, 0.1, 0.15) })
    sahifa.drawText(partnerSignName, { x: 280, y: signY - 4, size: 8.5, font: oddiy, color: rgb(0.3, 0.3, 0.35) })

    // 2-Imzo (JDA Kimyo)
    sahifa.drawLine({ start: { x: 460, y: signY + 24 }, end: { x: 600, y: signY + 24 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) })
    sahifa.drawText('JDA Kimyo', { x: 505, y: signY + 10, size: 9.5, font: qalin, color: rgb(0.1, 0.1, 0.15) })
    sahifa.drawText(jdaSignName, { x: 500, y: signY - 4, size: 8.5, font: oddiy, color: rgb(0.3, 0.3, 0.35) })

    // QR Kod
    const qrDataUrl = await QRCode.toDataURL(tekshirishHavolasi(s.certId), {
      width: 250, margin: 0,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    })
    const qrRasm = await doc.embedPng(await baytlar(qrDataUrl))
    const qrSize = 64
    sahifa.drawImage(qrRasm, { x: W - 140, y: signY - 14, width: qrSize, height: qrSize })
    sahifa.drawText('Tekshirish uchun', { x: W - 146, y: signY - 26, size: 6.5, font: oddiy, color: rgb(0.4, 0.4, 0.4) })
    sahifa.drawText('QR kodni skaner qiling', { x: W - 156, y: signY - 34, size: 6.5, font: oddiy, color: rgb(0.4, 0.4, 0.4) })

    // ─── ENG PASTKI TASMA: BILIM - ENG KATTA KUCH ───
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: 28,
      color: rgb(0.04, 0.07, 0.12),
    })
    const footerText = 'B I L I M   -   E N G   K A T T A   K U C H'
    const footW = olchov(footerText, qalin, 9)
    sahifa.drawText(footerText, {
      x: (W - footW) / 2, y: 10, size: 9, font: qalin,
      color: rgb(0.85, 0.68, 0.25),
    })
  } else {
    // ═══════════════════════════════════════════════════════════════
    // KLASSIK JDA KIMYO SERTIFIKAT SHABLONI
    // ═══════════════════════════════════════════════════════════════
    sahifa.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.fon })

    // Ramka
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

    markaz('JDA KIMYO', qalin, 20, H - 78, C.binafsha)
    markaz('jdakimyo.uz', oddiy, 8.5, H - 92, C.kulrang)
    markaz('SERTIFIKAT', qalin, 40, H - 148, C.oltin)

    sahifa.drawLine({
      start: { x: W / 2 - 110, y: H - 166 },
      end: { x: W / 2 + 110, y: H - 166 },
      thickness: 1.5, color: C.oltinOch,
    })

    markaz('Ushbu sertifikat quyidagi shaxsga berildi', oddiy, 11, H - 192, C.kulrang)

    const ism = toza(s.fullName)
    let ismOlcham = 34
    while (ismOlcham > 16 && olchov(ism, qalin, ismOlcham) > W - 180) ismOlcham -= 1
    markaz(ism, qalin, ismOlcham, H - 236, C.siyoh)

    sahifa.drawLine({
      start: { x: 150, y: H - 250 },
      end: { x: W - 150, y: H - 250 },
      thickness: 0.8, color: C.chiziq,
    })

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

    const baholar = []
    if (s.grade) baholar.push(`Daraja: ${toza(s.grade)}`)
    if (s.score !== null && s.score !== undefined) baholar.push(`Ball: ${s.score}`)
    if (s.percentage !== null && s.percentage !== undefined) baholar.push(`${s.percentage}%`)
    if (baholar.length > 0) {
      y -= 6
      markaz(baholar.join('   ·   '), qalin, 11, y, C.oltin)
    }

    if (s.status !== 'valid') {
      sahifa.drawText('BEKOR QILINGAN', {
        x: W / 2 - 190, y: H / 2 - 30, size: 60, font: qalin,
        color: C.qizil, opacity: 0.18, rotate: degrees(20),
      })
    }

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

    sahifa.drawLine({
      start: { x: 62, y: 44 }, end: { x: W - 62, y: 44 },
      thickness: 0.5, color: C.chiziq,
    })
    const havola = tekshirishHavolasi(s.certId)
    const hw = olchov(havola, oddiy, 7.5)
    sahifa.drawText(havola, {
      x: (W - hw) / 2, y: 33, size: 7.5, font: oddiy, color: C.kulrang,
    })
  }

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
