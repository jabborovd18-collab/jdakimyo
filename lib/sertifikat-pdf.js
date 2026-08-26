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

export function formatIsm(raw) {
  if (!raw) return 'Ishtirokchi'
  let matn = toza(raw)
  if (matn.includes('_') || matn.includes('-') || (matn.includes('.') && !matn.includes(' '))) {
    matn = matn.replace(/[_\-\.]+/g, ' ')
  }
  return matn
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
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
 * @param {object} s — Certificate yozuvi (certId, fullName, fan, reason, rank, ...)
 */
export async function sertifikatPDFYuklab(s, customRank = null) {
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
    s.fan?.includes('DTM sinov testi') ||
    s.certId?.startsWith('AK-') ||
    s.examName?.includes('Sinov') ||
    s.examName?.includes('DTM')
  )

  if (isMavsumiy) {
    // ═══════════════════════════════════════════════════════════════
    // 1. ALCHEMIQ & JDA KIMYO RASMIY DTM SERTIFIKAT SHABLONI
    // ═══════════════════════════════════════════════════════════════
    const rank = customRank || s.rank || s.seals?.rank || null

    let alchLogo = null
    let imzo = null
    try {
      const [alchB, imzoB] = await Promise.all([
        baytlar('/images/hamkorlik/alchemiq-logo.jpg'),
        baytlar('/images/hamkorlik/sardor-ergashev-imzo.png'),
      ])
      alchLogo = await doc.embedJpg(alchB)
      imzo = await doc.embedPng(imzoB)
    } catch (e) {
      console.warn('Rasmlarni yuklashda xatolik:', e)
    }

    // 1. Oq/och pergament foni
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: H,
      color: rgb(0.965, 0.945, 0.915),
    });

    // 2. Chapdagi to'q-ko'k / obsidiyan vertikal zona
    sahifa.drawRectangle({
      x: 0, y: 0, width: 235, height: H,
      color: rgb(0.04, 0.07, 0.12),
    });

    // Oltin to'lqin chiziqlari
    sahifa.drawRectangle({
      x: 232, y: 0, width: 5, height: H,
      color: rgb(0.85, 0.68, 0.25),
    });
    sahifa.drawRectangle({
      x: 237, y: 0, width: 1.5, height: H,
      color: rgb(0.95, 0.85, 0.45),
    });

    // Chap panelda AlchemIQ logotipi
    if (alchLogo) {
      sahifa.drawImage(alchLogo, {
        x: 32, y: H - 240, width: 170, height: 170,
      });
    }

    // 3. SERTIFIKAT Sarlavhasi
    const title = 'SERTIFIKAT';
    const titleW = olchov(title, qalin, 46);
    sahifa.drawText(title, {
      x: 240 + (W - 240 - titleW) / 2, y: H - 145, size: 46, font: qalin,
      color: rgb(0.08, 0.10, 0.14),
    });

    const sub = 'Ushbu sertifikat';
    const subW = olchov(sub, oddiy, 13);
    sahifa.drawText(sub, {
      x: 240 + (W - 240 - subW) / 2, y: H - 172, size: 13, font: oddiy,
      color: rgb(0.30, 0.30, 0.35),
    });

    // 4. Qatnashuvchi ismi
    const name = formatIsm(s.fullName || 'Ishtirokchi');
    let nameSize = 26;
    while (nameSize > 14 && olchov(name, qalin, nameSize) > W - 320) nameSize -= 1;
    const nameW = olchov(name, qalin, nameSize);
    sahifa.drawText(name, {
      x: 240 + (W - 240 - nameW) / 2, y: H - 225, size: nameSize, font: qalin,
      color: rgb(0.04, 0.06, 0.10),
    });

    // Ism ostidagi chiziq
    sahifa.drawLine({
      start: { x: 280, y: H - 238 },
      end: { x: W - 60, y: H - 238 },
      thickness: 1, color: rgb(0.20, 0.20, 0.25),
    });

    // 6. Matn bloki: DTM SINOV TESTIDA
    const lines = [
      'AlchemIQ va JDA Kimyo tomonidan tashkil etilgan',
      'DTM SINOV TESTIDA yuqori natija ko\'rsatganligi',
      'va bilim darajasining a\'lo darajada ekanligi uchun',
      'taqdim etiladi.'
    ];
    let ty = H - 268;
    for (let i = 0; i < lines.length; i++) {
      const isBold = i === 1;
      const font = isBold ? qalin : oddiy;
      const sz = isBold ? 12 : 11.5;
      const clr = isBold ? rgb(0.05, 0.05, 0.10) : rgb(0.20, 0.20, 0.25);
      const lw = olchov(lines[i], font, sz);
      sahifa.drawText(lines[i], {
        x: 240 + (W - 240 - lw) / 2, y: ty, size: sz, font, color: clr,
      });
      ty -= 17;
    }

    // Oltin bezak chizig'i
    const cx = 240 + (W - 240) / 2;
    sahifa.drawLine({
      start: { x: cx - 110, y: H - 345 }, end: { x: cx + 110, y: H - 345 },
      thickness: 0.8, color: rgb(0.85, 0.68, 0.25),
    });
    sahifa.drawText('❖', { x: cx - 5, y: H - 349, size: 10, font: qalin, color: rgb(0.85, 0.68, 0.25) });

    // 7. O'rta qator: Natija & Sana (Chapda), Oltin Medalyon (Faqat Top 3 da), ID (O'ngda)
    const midY = H - 380;
    const scoreStr = s.percentage ? `${s.percentage}% (${s.score || 0} ball)` : `${s.score || 0} ball`;
    sahifa.drawText('Natija:', { x: 265, y: midY + 10, size: 11, font: oddiy, color: rgb(0.2, 0.2, 0.25) });
    sahifa.drawText(scoreStr, { x: 315, y: midY + 10, size: 11.5, font: qalin, color: rgb(0.05, 0.05, 0.10) });
    sahifa.drawLine({ start: { x: 310, y: midY + 6 }, end: { x: 420, y: midY + 6 }, thickness: 0.6, color: rgb(0.4, 0.4, 0.4) });

    sahifa.drawText('Sana:', { x: 265, y: midY - 14, size: 10.5, font: oddiy, color: rgb(0.2, 0.2, 0.25) });
    sahifa.drawText(sana(s.issuedAt), { x: 315, y: midY - 14, size: 10.5, font: oddiy, color: rgb(0.05, 0.05, 0.10) });
    sahifa.drawLine({ start: { x: 305, y: midY - 18 }, end: { x: 420, y: midY - 18 }, thickness: 0.6, color: rgb(0.4, 0.4, 0.4) });

    // Markaziy Medal: FAQAT TOP 3 UCHUN (1: I, 2: II, 3: III). Top 3 ga kirmaganlarda bo'lmaydi!
    if (rank && rank >= 1 && rank <= 3) {
      const roman = rank === 1 ? 'I' : rank === 2 ? 'II' : 'III';
      const medalX = 505;
      const medalY = midY - 2;

      // Medal lentalari
      sahifa.drawLine({ start: { x: medalX - 10, y: medalY - 30 }, end: { x: medalX - 16, y: medalY - 50 }, thickness: 12, color: rgb(0.08, 0.10, 0.15) });
      sahifa.drawLine({ start: { x: medalX + 10, y: medalY - 30 }, end: { x: medalX + 16, y: medalY - 50 }, thickness: 12, color: rgb(0.08, 0.10, 0.15) });

      // Oltin disk
      sahifa.drawCircle({
        x: medalX, y: medalY, size: 36,
        color: rgb(0.08, 0.10, 0.15),
        borderColor: rgb(0.85, 0.68, 0.25),
        borderWidth: 2.5,
      });
      sahifa.drawCircle({
        x: medalX, y: medalY, size: 32,
        borderColor: rgb(0.95, 0.85, 0.45),
        borderWidth: 0.8,
      });
      sahifa.drawText('★ ★ ★', { x: medalX - 14, y: medalY + 16, size: 6, font: qalin, color: rgb(0.95, 0.85, 0.45) });
      const rW = olchov(roman, qalin, 16);
      sahifa.drawText(roman, { x: medalX - rW / 2, y: medalY - 5, size: 16, font: qalin, color: rgb(0.95, 0.85, 0.45) });
      sahifa.drawText("O'RIN", { x: medalX - 11, y: medalY - 18, size: 6, font: qalin, color: rgb(0.95, 0.85, 0.45) });
    }

    // O'ngda: Sertifikat ID
    sahifa.drawText('Sertifikat ID:', { x: 585, y: midY + 10, size: 10, font: oddiy, color: rgb(0.3, 0.3, 0.35) });
    sahifa.drawText(s.certId, {
      x: 585, y: midY - 10, size: 13, font: qalin,
      color: rgb(0.75, 0.15, 0.15),
    });

    // 8. Pastda: Faqat Sardor Ergashev imzosi va Haqiqiy QR-kod
    const signY = 95;
    if (imzo) {
      sahifa.drawImage(imzo, {
        x: 275, y: signY + 12, width: 100, height: 50,
      });
    }
    sahifa.drawLine({ start: { x: 260, y: signY + 16 }, end: { x: 395, y: signY + 16 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) });
    sahifa.drawText('AlchemIQ', { x: 300, y: signY + 4, size: 9.5, font: qalin, color: rgb(0.1, 0.1, 0.15) });
    sahifa.drawText('Sardor Ergashev', { x: 285, y: signY - 8, size: 8.5, font: oddiy, color: rgb(0.3, 0.3, 0.35) });

    // O'ng burchakdagi dinamik QR-kod
    const qrDataUrl = await QRCode.toDataURL(tekshirishHavolasi(s.certId), {
      width: 250, margin: 0,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    });
    const qrRasm = await doc.embedPng(await baytlar(qrDataUrl));
    sahifa.drawImage(qrRasm, { x: W - 140, y: signY - 10, width: 68, height: 68 });
    sahifa.drawText('Tekshirish uchun', { x: W - 145, y: signY - 22, size: 6.5, font: oddiy, color: rgb(0.4, 0.4, 0.4) });
    sahifa.drawText('QR kodni skaner qiling', { x: W - 155, y: signY - 30, size: 6.5, font: oddiy, color: rgb(0.4, 0.4, 0.4) });

    // 9. Eng pastki to'q tasma: BILIM - ENG KATTA KUCH
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: 26,
      color: rgb(0.04, 0.07, 0.12),
    });
    const footerText = 'B I L I M   -   E N G   K A T T A   K U C H';
    const footW = olchov(footerText, qalin, 9);
    sahifa.drawText(footerText, {
      x: (W - footW) / 2, y: 9, size: 9, font: qalin,
      color: rgb(0.85, 0.68, 0.25),
    });
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
