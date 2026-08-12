// lib/vedomost-pdf.js
//
// Ustozlar uchun Baholash Vedomostini PDF formatida yaratish.
// DejaVu Sans shrifti bilan o'zbekcha harflar (oʻ, gʻ, sh, ch) to'liq to'g'ri chiziladi.
//
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { sanaVaqt } from './sana'

// A4 tik format (Portrait: 595.28 × 841.89 pt)
const W = 595.28
const H = 841.89

const C = {
  oq: rgb(1, 1, 1),
  qora: rgb(0.08, 0.08, 0.12),
  kulrang: rgb(0.45, 0.45, 0.52),
  kulrangOch: rgb(0.94, 0.94, 0.96),
  chiziq: rgb(0.85, 0.85, 0.88),
  siyoh: rgb(0.18, 0.12, 0.38),
  yashil: rgb(0.1, 0.55, 0.3),
  qizil: rgb(0.75, 0.15, 0.15),
  oltin: rgb(0.75, 0.55, 0.05),
}

function toza(matn) {
  if (matn === null || matn === undefined) return ''
  return String(matn).trim()
}

async function baytlar(manzil) {
  const javob = await fetch(manzil)
  if (!javob.ok) throw new Error('Shrift yuklab bo\'lmadi: ' + manzil)
  return javob.arrayBuffer()
}

/**
 * Baholash Vedomosti PDF'ini yaratib yuklab beradi.
 *
 * @param {object} p
 * @param {string} p.ustozNomi - O'qituvchi F.I.Sh.
 * @param {string} p.guruhNomi - Guruh nomi
 * @param {string} p.testNomi  - Test yoki topshiriq sarlavhasi
 * @param {Array}  p.qatorlar  - Talabalar natijalari massivi
 * [{ ism: "Ali Valiyev", username: "ali", ball: "18/20", foiz: 90, otdimi: true, sana: "2026-08-12" }]
 */
export async function vedomostPDFYuklab({ ustozNomi, guruhNomi, testNomi, qatorlar = [] }) {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const [rBaytlar, bBaytlar] = await Promise.all([
    baytlar('/fonts/DejaVuSans.ttf'),
    baytlar('/fonts/DejaVuSans-Bold.ttf'),
  ])

  const oddiy = await doc.embedFont(rBaytlar, { subset: true })
  const qalin = await doc.embedFont(bBaytlar, { subset: true })

  doc.setTitle(`Vedomost — ${toza(guruhNomi)} — ${toza(testNomi)}`)
  doc.setAuthor('JDA KIMYO')
  doc.setCreator('jdakimyo.uz')

  const qatorBalandligi = 20
  const boshBalandligi = 160
  const oyogBalandligi = 80
  const sahifadagiQatorlarSoni = Math.floor((H - boshBalandligi - oyogBalandligi) / qatorBalandligi)

  const sahifalarSoni = Math.max(1, Math.ceil(qatorlar.length / sahifadagiQatorlarSoni))

  for (let s = 0; s < sahifalarSoni; s++) {
    const sahifa = doc.addPage([W, H])
    const boshIdx = s * sahifadagiQatorlarSoni
    const sahifaQatorlari = qatorlar.slice(boshIdx, boshIdx + sahifadagiQatorlarSoni)

    // ─── HEADER ───
    sahifa.drawRectangle({
      x: 30,
      y: H - 55,
      width: W - 60,
      height: 25,
      color: C.siyoh,
    })

    sahifa.drawText('JDA KIMYO — OLIY KIMYO TA\'LIM PLATFORMASI', {
      x: 42,
      y: H - 47,
      size: 9.5,
      font: qalin,
      color: C.oq,
    })

    sahifa.drawText('jdakimyo.uz', {
      x: W - 115,
      y: H - 47,
      size: 9,
      font: oddiy,
      color: C.oq,
    })

    sahifa.drawText('RASMIY AKADEMIK BAHOLASH VEDOMOSTI', {
      x: 30,
      y: H - 85,
      size: 15,
      font: qalin,
      color: C.siyoh,
    })

    // Meta ma'lumotlar
    const metaY = H - 108
    sahifa.drawText(`O'qituvchi: ${toza(ustozNomi)}`, { x: 30, y: metaY, size: 9.5, font: qalin, color: C.qora })
    sahifa.drawText(`Guruh: ${toza(guruhNomi || 'Umumiy')}`, { x: 30, y: metaY - 15, size: 9, font: oddiy, color: C.qora })
    sahifa.drawText(`Topshiriq / Test: ${toza(testNomi)}`, { x: 30, y: metaY - 30, size: 9, font: oddiy, color: C.qora })

    const hozirSana = sanaVaqt(new Date())
    sahifa.drawText(`Chop etilgan sana: ${hozirSana}`, { x: W - 220, y: metaY, size: 8.5, font: oddiy, color: C.kulrang })
    sahifa.drawText(`Sahifa: ${s + 1} / ${sahifalarSoni}`, { x: W - 120, y: metaY - 15, size: 8.5, font: oddiy, color: C.kulrang })

    // ─── JADVAL SARLAVHASI ───
    const jadvalY = H - 165
    sahifa.drawRectangle({
      x: 30,
      y: jadvalY - 4,
      width: W - 60,
      height: 22,
      color: C.kulrangOch,
    })
    sahifa.drawRectangle({
      x: 30,
      y: jadvalY - 4,
      width: W - 60,
      height: 22,
      borderColor: C.chiziq,
      borderWidth: 1,
    })

    // Ustun koordinatalari
    const X = {
      nr: 36,
      ism: 60,
      user: 220,
      ball: 330,
      foiz: 390,
      natija: 450,
      sana: 510,
    }

    sahifa.drawText('№', { x: X.nr, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Talaba F.I.Sh.', { x: X.ism, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Username', { x: X.user, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Ball', { x: X.ball, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Foiz', { x: X.foiz, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Holat', { x: X.natija, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })
    sahifa.drawText('Vaqti', { x: X.sana, y: jadvalY + 4, size: 8.5, font: qalin, color: C.qora })

    // ─── JADVAL QATORLARI ───
    let joriyY = jadvalY - 4

    sahifaQatorlari.forEach((q, i) => {
      const qatorIndex = boshIdx + i + 1
      joriyY -= qatorBalandligi

      if (i % 2 === 1) {
        sahifa.drawRectangle({
          x: 30,
          y: joriyY,
          width: W - 60,
          height: qatorBalandligi,
          color: rgb(0.98, 0.98, 0.99),
        })
      }

      sahifa.drawLine({
        start: { x: 30, y: joriyY },
        end: { x: W - 30, y: joriyY },
        color: C.chiziq,
        thickness: 0.5,
      })

      const matnY = joriyY + 5.5

      sahifa.drawText(String(qatorIndex), { x: X.nr, y: matnY, size: 8, font: oddiy, color: C.kulrang })
      sahifa.drawText(toza(q.ism).slice(0, 26), { x: X.ism, y: matnY, size: 8.5, font: qalin, color: C.qora })
      sahifa.drawText(`@${toza(q.username).slice(0, 18)}`, { x: X.user, y: matnY, size: 8, font: oddiy, color: C.kulrang })
      sahifa.drawText(toza(q.ball || '—'), { x: X.ball, y: matnY, size: 8.5, font: qalin, color: C.qora })
      sahifa.drawText(`${q.foiz !== undefined ? q.foiz.toFixed(0) + '%' : '—'}`, {
        x: X.foiz,
        y: matnY,
        size: 8.5,
        font: qalin,
        color: q.foiz >= 60 ? C.yashil : C.qizil,
      })
      sahifa.drawText(q.otdimi ? 'O\'tdi' : 'O\'tmadi', {
        x: X.natija,
        y: matnY,
        size: 8,
        font: qalin,
        color: q.otdimi ? C.yashil : C.qizil,
      })
      sahifa.drawText(toza(q.sana).slice(0, 10), { x: X.sana, y: matnY, size: 7.5, font: oddiy, color: C.kulrang })
    })

    // Oxirgi sahifada Yakuniy Xulosa va Imzo
    if (s === sahifalarSoni - 1) {
      const xulosaY = Math.max(70, joriyY - 45)

      const jami = qatorlar.length
      const otganlar = qatorlar.filter((q) => q.otdimi).length
      const ortacha = jami > 0 ? (qatorlar.reduce((sum, q) => sum + (q.foiz || 0), 0) / jami).toFixed(1) : 0

      sahifa.drawRectangle({
        x: 30,
        y: xulosaY,
        width: W - 60,
        height: 32,
        color: C.kulrangOch,
        borderColor: C.chiziq,
        borderWidth: 1,
      })

      sahifa.drawText(
        `Jami talabalar: ${jami} ta  |  O'tganlar: ${otganlar} ta (${jami > 0 ? ((otganlar / jami) * 100).toFixed(0) : 0}%)  |  O'rtacha ko'rsatkich: ${ortacha}%`,
        { x: 40, y: xulosaY + 11, size: 9, font: qalin, color: C.siyoh },
      )

      // Imzo joyi
      sahifa.drawText(`O'qituvchi imzosi: ____________________ (${toza(ustozNomi)})`, {
        x: 30,
        y: 40,
        size: 9,
        font: oddiy,
        color: C.qora,
      })

      sahifa.drawText('M.O\'.', {
        x: W - 100,
        y: 40,
        size: 9,
        font: oddiy,
        color: C.kulrang,
      })
    }
  }

  const pdfBytes = await doc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Vedomost_${toza(guruhNomi || 'Umumiy')}_${new Date().toISOString().slice(0, 10)}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
