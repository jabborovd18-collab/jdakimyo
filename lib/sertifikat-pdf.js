// lib/sertifikat-pdf.js
//
// PDF SERTIFIKAT GENERATORI
// PDFDocument + fontkit orqali to'liq vektorli, o'zbekcha harflarni (o', g')
// to'g'ri ko'rsatadigan rasmiy sertifikat hujjati.
//
// Ushbu modulda 2 xil sertifikat shabloni mavjud:
// 1. AlchemIQ & JDA Kimyo Mavsumiy Hamkorlik shabloni (Hashamatli qora/oltin to'lqinli dizayn)
// 2. Klassik JDA Kimyo Shaxsiy Sertifikat shabloni (Binafsha/oltin ramkali)

import { PDFDocument, rgb, degrees } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import QRCode from 'qrcode'

const C = {
  fon: rgb(0.985, 0.98, 0.96),
  binafsha: rgb(0.35, 0.12, 0.55),
  binafshaOch: rgb(0.55, 0.25, 0.75),
  oltin: rgb(0.85, 0.68, 0.25),
  oltinOch: rgb(0.95, 0.85, 0.45),
  siyoh: rgb(0.10, 0.08, 0.15),
  kulrang: rgb(0.45, 0.45, 0.50),
  chiziq: rgb(0.82, 0.78, 0.72),
  yashil: rgb(0.12, 0.55, 0.32),
  qizil: rgb(0.75, 0.15, 0.15),
  oq: rgb(1, 1, 1),
}

async function baytlar(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fayl topilmadi: ${url}`)
  return new Uint8Array(await res.arrayBuffer())
}

function toza(matn) {
  if (!matn) return ''
  return String(matn)
    .replace(/[\u2018\u2019`ʻʼ]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function sana(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const oylar = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  return `${d.getDate()}-${oylar[d.getMonth()]} ${d.getFullYear()}`
}

function qatorlarga(matn, shrift, olcham, maxKenglik) {
  const sozlar = matn.split(' ')
  const qatorlar = []
  let joriy = ''

  for (const s of sozlar) {
    const sinov = joriy ? `${joriy} ${s}` : s
    const w = shrift.widthOfTextAtSize(sinov, olcham)
    if (w <= maxKenglik) {
      joriy = sinov
    } else {
      if (joriy) qatorlar.push(joriy)
      joriy = s
    }
  }
  if (joriy) qatorlar.push(joriy)
  return qatorlar
}

function olchov(matn, shrift, olcham) {
  return shrift.widthOfTextAtSize(toza(matn), olcham)
}

function tekshirishHavolasi(certId) {
  const asosiyManzil = (typeof window !== 'undefined' && window.location.origin)
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://jdakimyo.uz')
  return `${asosiyManzil}/sertifikat/verify/${certId}`
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

  // A4 Landscape o'lchami: 841.89 × 595.28 pt
  const W = 841.89
  const H = 595.28
  const sahifa = doc.addPage([W, H])

  const isMavsumiy = Boolean(
    s.seals?.partnerName ||
    s.fan?.includes('Mavsumiy Hamkorlik') ||
    s.certId?.startsWith('AK-') ||
    s.examName?.includes('Sinov')
  )

  if (isMavsumiy) {
    // ═══════════════════════════════════════════════════════════════
    // 1. ALCHEMIQ & JDA KIMYO HASHAMATLI HAMKORLIK SHABLONI
    // ═══════════════════════════════════════════════════════════════
    const partnerName = s.seals?.partnerName || 'AlchemIQ'
    const partnerSignName = s.seals?.partnerSignName || 'AlchemIQ Sardor Ergashev'
    const jdaSignName = s.seals?.jdaSignName || 'JDA Kimyo Jamoasi'
    const badgeText = s.seals?.badgeText || 'YUKORI NATIJA'

    // Oq/och pergament foni
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: H,
      color: rgb(0.97, 0.95, 0.92),
    })

    // Nozik tashqi oltin ramka
    sahifa.drawRectangle({
      x: 12, y: 12, width: W - 24, height: H - 24,
      borderColor: rgb(0.85, 0.68, 0.25),
      borderWidth: 1.5,
    })
    sahifa.drawRectangle({
      x: 16, y: 16, width: W - 32, height: H - 32,
      borderColor: rgb(0.70, 0.55, 0.20),
      borderWidth: 0.6,
    })

    // Chapdagi to'q-ko'k / obsidiyan vertikal zona
    sahifa.drawRectangle({
      x: 16, y: 16, width: 220, height: H - 32,
      color: rgb(0.03, 0.05, 0.10),
    })

    // Oltin to'lqin va qirra lentalari
    sahifa.drawRectangle({
      x: 232, y: 16, width: 4.5, height: H - 32,
      color: rgb(0.85, 0.68, 0.25),
    })
    sahifa.drawRectangle({
      x: 238.5, y: 16, width: 1.5, height: H - 32,
      color: rgb(0.95, 0.85, 0.45),
    })

    // ─── CHAP PANEL: HAMKOR EMBLAMASI ───
    // Gerb ramkasi
    sahifa.drawRectangle({
      x: 35, y: H - 180, width: 180, height: 110,
      color: rgb(0.06, 0.09, 0.16),
      borderColor: rgb(0.85, 0.68, 0.25),
      borderWidth: 1.8,
    })
    sahifa.drawRectangle({
      x: 39, y: H - 176, width: 172, height: 102,
      borderColor: rgb(0.95, 0.85, 0.45),
      borderWidth: 0.6,
    })

    const alchW = olchov(partnerName, qalin, 22)
    sahifa.drawText(partnerName, {
      x: 35 + (180 - alchW) / 2, y: H - 130, size: 22, font: qalin,
      color: rgb(0.95, 0.85, 0.45),
    })

    const signSubW = olchov(partnerSignName, oddiy, 8.5)
    sahifa.drawText(partnerSignName, {
      x: 35 + (180 - signSubW) / 2, y: H - 158, size: 8.5, font: oddiy,
      color: rgb(0.85, 0.85, 0.90),
    })

    // Chap panel pastidagi dekorativ bezaklar
    sahifa.drawText('RASMIY SINOV', {
      x: 75, y: 120, size: 9, font: qalin,
      color: rgb(0.85, 0.68, 0.25),
    })
    sahifa.drawText('OLIMPIADA SINOVI', {
      x: 68, y: 105, size: 8, font: oddiy,
      color: rgb(0.65, 0.70, 0.80),
    })
    sahifa.drawLine({
      start: { x: 50, y: 95 }, end: { x: 200, y: 95 },
      thickness: 0.8, color: rgb(0.85, 0.68, 0.25),
    })

    // ─── O'NG YUQORI: JDA KIMYO BRENDI ───
    const jdaW = olchov('JDA KIMYO', qalin, 18)
    sahifa.drawText('JDA KIMYO', {
      x: W - 50 - jdaW, y: H - 65, size: 18, font: qalin,
      color: rgb(0.06, 0.08, 0.14),
    })
    const portalW = olchov('jdakimyo.uz', oddiy, 8.5)
    sahifa.drawText('jdakimyo.uz', {
      x: W - 50 - portalW, y: H - 78, size: 8.5, font: oddiy,
      color: rgb(0.45, 0.45, 0.50),
    })

    // ─── ASOSIY SARLAVHA: SERTIFIKAT ───
    const serW = olchov('SERTIFIKAT', qalin, 44)
    sahifa.drawText('SERTIFIKAT', {
      x: 250 + (W - 250 - serW) / 2, y: H - 142, size: 44, font: qalin,
      color: rgb(0.06, 0.08, 0.14),
    })

    // Sarlavha ostidagi oltin bezak chizig'i
    const cx = 250 + (W - 250) / 2
    sahifa.drawLine({
      start: { x: cx - 120, y: H - 156 },
      end: { x: cx + 120, y: H - 156 },
      thickness: 1.5, color: rgb(0.85, 0.68, 0.25),
    })

    const ushbuW = olchov('Ushbu sertifikat rasman quyidagi ishtirokchiga taqdim etiladi:', oddiy, 11)
    sahifa.drawText('Ushbu sertifikat rasman quyidagi ishtirokchiga taqdim etiladi:', {
      x: 250 + (W - 250 - ushbuW) / 2, y: H - 176, size: 11, font: oddiy,
      color: rgb(0.35, 0.35, 0.40),
    })

    // ─── QATNASHUVCHI ISMI ───
    const ism = toza(s.fullName)
    let ismOlcham = 30
    while (ismOlcham > 16 && olchov(ism, qalin, ismOlcham) > W - 320) ismOlcham -= 1
    const ismW = olchov(ism, qalin, ismOlcham)
    sahifa.drawText(ism, {
      x: 250 + (W - 250 - ismW) / 2, y: H - 224, size: ismOlcham, font: qalin,
      color: rgb(0.03, 0.06, 0.12),
    })

    // Ism ostidagi chiziq
    sahifa.drawLine({
      start: { x: 280, y: H - 238 },
      end: { x: W - 50, y: H - 238 },
      thickness: 1, color: rgb(0.25, 0.25, 0.30),
    })

    // ─── SABAB VA TAQDIMOT MATNI ───
    let y = H - 268
    const sababMatnlari = qatorlarga(toza(s.reason), oddiy, 11.5, W - 350)
    for (const qator of sababMatnlari.slice(0, 4)) {
      const qw = olchov(qator, oddiy, 11.5)
      sahifa.drawText(qator, {
        x: 250 + (W - 250 - qw) / 2, y, size: 11.5, font: oddiy,
        color: rgb(0.15, 0.15, 0.20),
      })
      y -= 17
    }

    // ─── O'RTA QISM: Natija, Oltin Medal, Sertifikat ID ───
    const midY = H - 370

    // Chapda: Natija & Sana
    sahifa.drawText('Natija:', { x: 275, y: midY + 18, size: 11, font: oddiy, color: rgb(0.20, 0.20, 0.25) })
    const ballMatn = s.percentage ? `${s.percentage}% (${s.score || 0} ball)` : `${s.score || 0} ball`
    sahifa.drawText(ballMatn, { x: 325, y: midY + 18, size: 11.5, font: qalin, color: rgb(0.05, 0.05, 0.10) })
    sahifa.drawLine({ start: { x: 320, y: midY + 14 }, end: { x: 430, y: midY + 14 }, thickness: 0.8, color: rgb(0.5, 0.5, 0.5) })

    sahifa.drawText('Sana:', { x: 275, y: midY - 10, size: 11, font: oddiy, color: rgb(0.20, 0.20, 0.25) })
    sahifa.drawText(sana(s.issuedAt), { x: 325, y: midY - 10, size: 11, font: oddiy, color: rgb(0.05, 0.05, 0.10) })
    sahifa.drawLine({ start: { x: 320, y: midY - 14 }, end: { x: 430, y: midY - 14 }, thickness: 0.8, color: rgb(0.5, 0.5, 0.5) })

    // O'rtada: Oltin Medal / Gerb
    sahifa.drawCircle({
      x: 515, y: midY + 5, size: 38,
      color: rgb(0.08, 0.10, 0.15),
      borderColor: rgb(0.85, 0.68, 0.25),
      borderWidth: 2.2,
    })
    sahifa.drawCircle({
      x: 515, y: midY + 5, size: 34,
      borderColor: rgb(0.95, 0.85, 0.45),
      borderWidth: 0.8,
    })
    const badgeW = olchov(badgeText, qalin, 8)
    sahifa.drawText('★ ★ ★', { x: 500, y: midY + 20, size: 7, font: qalin, color: rgb(0.95, 0.85, 0.45) })
    sahifa.drawText(badgeText, { x: 515 - badgeW / 2, y: midY + 2, size: 8, font: qalin, color: rgb(0.95, 0.85, 0.45) })
    sahifa.drawText('★ ★ ★', { x: 500, y: midY - 14, size: 7, font: qalin, color: rgb(0.95, 0.85, 0.45) })

    // O'ngda: Sertifikat ID Plaketkasi
    sahifa.drawText('Sertifikat ID:', { x: 605, y: midY + 18, size: 10, font: oddiy, color: rgb(0.30, 0.30, 0.35) })
    sahifa.drawText(s.certId, {
      x: 605, y: midY - 2, size: 13, font: qalin,
      color: rgb(0.75, 0.15, 0.15), // Qizil rasmiy ID
    })

    // ─── PASTKI IMZOLAR VA QR-KOD ───
    const signY = 100

    // 1-Imzo (Hamkor)
    sahifa.drawLine({ start: { x: 270, y: signY + 24 }, end: { x: 410, y: signY + 24 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) })
    sahifa.drawText(partnerName, { x: 310, y: signY + 10, size: 9.5, font: qalin, color: rgb(0.1, 0.1, 0.15) })
    sahifa.drawText(partnerSignName, { x: 285, y: signY - 4, size: 8.5, font: oddiy, color: rgb(0.3, 0.3, 0.35) })

    // 2-Imzo (JDA Kimyo)
    sahifa.drawLine({ start: { x: 470, y: signY + 24 }, end: { x: 610, y: signY + 24 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) })
    sahifa.drawText('JDA Kimyo', { x: 515, y: signY + 10, size: 9.5, font: qalin, color: rgb(0.1, 0.1, 0.15) })
    sahifa.drawText(jdaSignName, { x: 505, y: signY - 4, size: 8.5, font: oddiy, color: rgb(0.3, 0.3, 0.35) })

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
      x: 16, y: 16, width: W - 32, height: 26,
      color: rgb(0.03, 0.05, 0.10),
    })
    const footerText = 'B I L I M   -   E N G   K A T T A   K U C H'
    const footW = olchov(footerText, qalin, 9)
    sahifa.drawText(footerText, {
      x: (W - footW) / 2, y: 24, size: 9, font: qalin,
      color: rgb(0.85, 0.68, 0.25),
    })
  } else {
    // ═══════════════════════════════════════════════════════════════
    // 2. KLASSIK JDA KIMYO SERTIFIKAT SHABLONI
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
      x: 62, y: pastY - 14, size: 7.5, font: oddiy, color: C.kulrang,
    })

    const imzoX = W - 260
    sahifa.drawLine({
      start: { x: imzoX, y: pastY + 36 },
      end: { x: W - 62, y: pastY + 36 },
      thickness: 1, color: C.siyoh,
    })
    sahifa.drawText('JDA Kimyo platformasi', {
      x: imzoX, y: pastY + 20, size: 10.5, font: qalin, color: C.siyoh,
    })
    sahifa.drawText(sana(s.issuedAt), {
      x: imzoX, y: pastY + 6, size: 9, font: oddiy, color: C.kulrang,
    })

    sahifa.drawText(`Sertifikat ID: ${s.certId}`, {
      x: W / 2 - olchov(`Sertifikat ID: ${s.certId}`, oddiy, 8.5) / 2,
      y: 38, size: 8.5, font: oddiy, color: C.kulrang,
    })
  }

  const pdfBaytlar = await doc.save()
  const blob = new Blob([pdfBaytlar], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sertifikat-${s.certId}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
