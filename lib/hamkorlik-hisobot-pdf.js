// lib/hamkorlik-hisobot-pdf.js
//
// MAVSUMIY HAMKORLIK SINOV TESTI NATIJALARI BO'YICHA RASMIY PDF HISOBOT
// Admin/Super admin uchun barcha ishtirokchilar ro'yxati, ballar, sarflangan vaqt
// va sertifikatlar holatini to'liq ifodalovchi ko'p sahifali rasmiy hujjat.
//

import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { formatIsm } from '@/lib/sertifikat-pdf'

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

function sanaFormat(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const oylar = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  const soat = String(d.getHours()).padStart(2, '0')
  const daq = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()}-${oylar[d.getMonth()]} ${d.getFullYear()}, ${soat}:${daq}`
}

function vaqtFormat(sekund) {
  const s = parseInt(sekund, 10) || 0
  const m = Math.floor(s / 60)
  const qolgan = s % 60
  return `${m} daq ${qolgan} son`
}

/**
 * Mavsumiy hamkorlik tadbirining to'liq ishtirokchilar hisobotini PDF shaklida yaratib yuklaydi.
 * @param {object} event — SeasonalPartnership ma'lumotlari
 * @param {Array} attempts — PartnershipAttempt ro'yxati (user bilan)
 */
export async function hisobotPDFYuklab(event, attempts = []) {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const [rBaytlar, bBaytlar] = await Promise.all([
    baytlar('/fonts/DejaVuSans.ttf'),
    baytlar('/fonts/DejaVuSans-Bold.ttf'),
  ])
  const oddiy = await doc.embedFont(rBaytlar, { subset: true })
  const qalin = await doc.embedFont(bBaytlar, { subset: true })

  // A4 Portrait: 595.28 × 841.89 pt
  const W = 595.28
  const H = 841.89

  // Umumiy hisob-kitoblar
  const jami = attempts.length
  const otganlar = attempts.filter((a) => a.passed).length
  const otishFoizi = jami > 0 ? ((otganlar / jami) * 100).toFixed(1) : 0
  const engYuqori = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0
  const ortachaFoiz = jami > 0 ? (attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / jami).toFixed(1) : 0

  const QATOR_BALANDLIGI = 24
  const BIRINCHI_SAHIFA_MAX = 14
  const KEYINGI_SAHIFA_MAX = 24

  // Sahifalarga bo'lish
  const sahifalar = []
  if (attempts.length === 0) {
    sahifalar.push([])
  } else {
    sahifalar.push(attempts.slice(0, BIRINCHI_SAHIFA_MAX))
    let qolgan = attempts.slice(BIRINCHI_SAHIFA_MAX)
    while (qolgan.length > 0) {
      sahifalar.push(qolgan.slice(0, KEYINGI_SAHIFA_MAX))
      qolgan = qolgan.slice(KEYINGI_SAHIFA_MAX)
    }
  }

  const jamiSahifalar = sahifalar.length

  for (let pIdx = 0; pIdx < sahifalar.length; pIdx++) {
    const sahifa = doc.addPage([W, H])
    const isBirinchi = pIdx === 0
    const joriyAttempts = sahifalar[pIdx]

    // Fon
    sahifa.drawRectangle({
      x: 0, y: 0, width: W, height: H,
      color: rgb(0.985, 0.985, 0.99),
    })

    // Yuqori sarlavha paneli
    if (isBirinchi) {
      // To'q navy header bloki
      sahifa.drawRectangle({
        x: 0, y: H - 90, width: W, height: 90,
        color: rgb(0.04, 0.07, 0.14),
      })
      sahifa.drawRectangle({
        x: 0, y: H - 93, width: W, height: 3,
        color: rgb(0.85, 0.68, 0.25),
      })

      // Tashkilotlar
      sahifa.drawText('JDA KIMYO PLATFORMASI', {
        x: 35, y: H - 32, size: 14, font: qalin,
        color: rgb(0.95, 0.85, 0.45),
      })
      sahifa.drawText(`Hamkor: ${toza(event.partnerName || 'AlchemIQ')}`, {
        x: W - 35 - qalin.widthOfTextAtSize(`Hamkor: ${toza(event.partnerName || 'AlchemIQ')}`, 11),
        y: H - 32, size: 11, font: qalin,
        color: rgb(1, 1, 1),
      })

      // Hujjat nomi
      sahifa.drawText('MAVSUMIY HAMKORLIK — DTM SINOV TESTI NATIJALARI HISOBOTI', {
        x: 35, y: H - 54, size: 10, font: qalin,
        color: rgb(0.90, 0.92, 0.96),
      })
      const sanaMatn = `Hisobot sanasi: ${sanaFormat(new Date())}`
      sahifa.drawText(sanaMatn, {
        x: 35, y: H - 72, size: 8, font: oddiy,
        color: rgb(0.65, 0.70, 0.80),
      })

      // Statistika bloklari (4 ta kartochka)
      const statY = H - 150
      const kartKenglik = (W - 70 - 18) / 4

      const kartochkalar = [
        { label: 'Jami Ishtirokchilar', qiymat: `${jami} nafar`, rang: rgb(0.15, 0.25, 0.55) },
        { label: "O'tganlar (>= 75%)", qiymat: `${otganlar} ta (${otishFoizi}%)`, rang: rgb(0.10, 0.50, 0.25) },
        { label: 'Eng Yuqori Ball', qiymat: `${engYuqori} / 30 ball`, rang: rgb(0.70, 0.45, 0.10) },
        { label: "O'rtacha Ko'rsatkich", qiymat: `${ortachaFoiz}%`, rang: rgb(0.40, 0.20, 0.60) },
      ]

      kartochkalar.forEach((k, i) => {
        const kx = 35 + i * (kartKenglik + 6)
        sahifa.drawRectangle({
          x: kx, y: statY, width: kartKenglik, height: 44,
          color: rgb(1, 1, 1),
          borderColor: rgb(0.85, 0.88, 0.92),
          borderWidth: 1,
        })
        sahifa.drawText(k.label, {
          x: kx + 8, y: statY + 28, size: 7.5, font: oddiy,
          color: rgb(0.40, 0.45, 0.55),
        })
        sahifa.drawText(k.qiymat, {
          x: kx + 8, y: statY + 10, size: 10, font: qalin,
          color: k.rang,
        })
      })

      // Top 3 Podium Mini Banner (agar kamida 3 ta ishtirokchi bo'lsa)
      let tableStartY = H - 175
      if (attempts.length >= 3) {
        const podY = H - 215
        sahifa.drawRectangle({
          x: 35, y: podY, width: W - 70, height: 50,
          color: rgb(0.94, 0.96, 1.0),
          borderColor: rgb(0.75, 0.82, 0.95),
          borderWidth: 1,
        })

        sahifa.drawText("TOP 3 G'OLIBLAR SHOHSUPASI", {
          x: 45, y: podY + 34, size: 8.5, font: qalin,
          color: rgb(0.10, 0.20, 0.45),
        })

        const top1Ism = formatIsm(attempts[0]?.user?.fullName || attempts[0]?.user?.username)
        const top2Ism = formatIsm(attempts[1]?.user?.fullName || attempts[1]?.user?.username)
        const top3Ism = formatIsm(attempts[2]?.user?.fullName || attempts[2]?.user?.username)

        sahifa.drawText(`1. I  ${top1Ism} — ${attempts[0]?.score} ball (${attempts[0]?.percentage}%)`, {
          x: 45, y: podY + 18, size: 8.5, font: qalin, color: rgb(0.65, 0.45, 0.05),
        })
        sahifa.drawText(`2. II  ${top2Ism} — ${attempts[1]?.score} ball`, {
          x: 45, y: podY + 6, size: 8, font: oddiy, color: rgb(0.30, 0.35, 0.45),
        })
        sahifa.drawText(`3. III  ${top3Ism} — ${attempts[2]?.score} ball`, {
          x: 280, y: podY + 6, size: 8, font: oddiy, color: rgb(0.45, 0.30, 0.15),
        })

        tableStartY = H - 235
      }

      // Jadvalni chizish (1-sahifa)
      chizJadval(sahifa, joriyAttempts, 0, tableStartY)
    } else {
      // 2- va keyingi sahifalar sarlavhasi
      sahifa.drawRectangle({
        x: 0, y: H - 45, width: W, height: 45,
        color: rgb(0.04, 0.07, 0.14),
      })
      sahifa.drawText('MAVSUMIY HAMKORLIK — DTM SINOV TESTI NATIJALARI (DAVOMI)', {
        x: 35, y: H - 28, size: 10, font: qalin,
        color: rgb(0.95, 0.85, 0.45),
      })

      const oldingiBoshlanish = BIRINCHI_SAHIFA_MAX + (pIdx - 1) * KEYINGI_SAHIFA_MAX
      chizJadval(sahifa, joriyAttempts, oldingiBoshlanish, H - 65)
    }

    // Har bir sahifaning pastki qismi (Footer)
    sahifa.drawLine({
      start: { x: 35, y: 35 }, end: { x: W - 35, y: 35 },
      thickness: 0.8, color: rgb(0.80, 0.82, 0.88),
    })
    sahifa.drawText('JDA KIMYO · Rasmiy Ta\'lim Platformasi · jdakimyo.uz', {
      x: 35, y: 22, size: 7.5, font: oddiy,
      color: rgb(0.50, 0.55, 0.65),
    })
    const sahifaMatn = `Sahifa ${pIdx + 1} / ${jamiSahifalar}`
    sahifa.drawText(sahifaMatn, {
      x: W - 35 - oddiy.widthOfTextAtSize(sahifaMatn, 7.5),
      y: 22, size: 7.5, font: oddiy,
      color: rgb(0.50, 0.55, 0.65),
    })
  }

  function chizJadval(sahifa, attemptsQatorlar, boshlangichIndeks, startY) {
    // Jadval Sarlavhasi (Header row)
    const thY = startY
    sahifa.drawRectangle({
      x: 35, y: thY - 18, width: W - 70, height: 22,
      color: rgb(0.12, 0.16, 0.26),
    })

    sahifa.drawText('O\'rin', { x: 42, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Ishtirokchi (Ism-familiya)', { x: 75, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Ball', { x: 255, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Foiz', { x: 295, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Vaqt', { x: 340, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Holati', { x: 405, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })
    sahifa.drawText('Sertifikat ID', { x: 470, y: thY - 12, size: 8, font: qalin, color: rgb(1, 1, 1) })

    let rowY = thY - 18

    attemptsQatorlar.forEach((att, idx) => {
      const globalRank = boshlangichIndeks + idx + 1
      const isEven = idx % 2 === 0
      rowY -= QATOR_BALANDLIGI

      // Qator foni
      sahifa.drawRectangle({
        x: 35, y: rowY, width: W - 70, height: QATOR_BALANDLIGI,
        color: isEven ? rgb(1, 1, 1) : rgb(0.96, 0.97, 0.985),
        borderColor: rgb(0.88, 0.90, 0.94),
        borderWidth: 0.5,
      })

      // O'rin (Top 3 ga maxsus belgi)
      let orinMatn = `${globalRank}.`
      let orinFont = oddiy
      let orinRang = rgb(0.20, 0.25, 0.35)

      if (globalRank === 1) {
        orinMatn = 'I.'
        orinFont = qalin
        orinRang = rgb(0.75, 0.55, 0.05)
      } else if (globalRank === 2) {
        orinMatn = 'II.'
        orinFont = qalin
        orinRang = rgb(0.40, 0.45, 0.55)
      } else if (globalRank === 3) {
        orinMatn = 'III.'
        orinFont = qalin
        orinRang = rgb(0.60, 0.35, 0.15)
      }

      sahifa.drawText(orinMatn, { x: 42, y: rowY + 7, size: 8.5, font: orinFont, color: orinRang })

      // Ism
      const ism = formatIsm(att.user?.fullName || att.user?.username || 'Ishtirokchi')
      let kesilganIsm = ism
      if (qalin.widthOfTextAtSize(kesilganIsm, 8.5) > 170) {
        while (kesilganIsm.length > 3 && qalin.widthOfTextAtSize(kesilganIsm + '...', 8.5) > 170) {
          kesilganIsm = kesilganIsm.slice(0, -1)
        }
        kesilganIsm += '...'
      }
      sahifa.drawText(kesilganIsm, { x: 75, y: rowY + 7, size: 8.5, font: qalin, color: rgb(0.08, 0.10, 0.15) })

      // Ball
      sahifa.drawText(`${att.score}/30`, { x: 255, y: rowY + 7, size: 8.5, font: oddiy, color: rgb(0.05, 0.05, 0.10) })

      // Foiz
      const foizRang = att.percentage >= 75 ? rgb(0.10, 0.55, 0.25) : rgb(0.75, 0.20, 0.20)
      sahifa.drawText(`${att.percentage}%`, { x: 295, y: rowY + 7, size: 8.5, font: qalin, color: foizRang })

      // Vaqt
      sahifa.drawText(vaqtFormat(att.timeSpentSec), { x: 340, y: rowY + 7, size: 7.5, font: oddiy, color: rgb(0.40, 0.45, 0.55) })

      // Holati
      const holatMatn = att.passed ? "O'tdi" : "O'tmadi"
      const holatRang = att.passed ? rgb(0.10, 0.55, 0.25) : rgb(0.70, 0.20, 0.20)
      sahifa.drawText(holatMatn, { x: 405, y: rowY + 7, size: 8, font: qalin, color: holatRang })

      // Sertifikat ID
      const certMatn = att.certId ? att.certId : '—'
      const certRang = att.certId ? rgb(0.75, 0.15, 0.15) : rgb(0.6, 0.6, 0.6)
      sahifa.drawText(certMatn, { x: 470, y: rowY + 7, size: 8, font: oddiy, color: certRang })
    })
  }

  const pdfBaytlar = await doc.save()
  const blob = new Blob([pdfBaytlar], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hisobot-${event.slug || 'hamkorlik'}-natijalar.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
