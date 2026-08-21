// ═══════════════════════════════════════════════════════════════════════════
// 📄 FAZOVIY 3D ILMIY PDF HISOBOT GENERATORI
// Yagona haqiqat manbai: app/oquv/fazoviy/* barcha 3D sahifalar uchun
// ═══════════════════════════════════════════════════════════════════════════

import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

/**
 * Matndagi HTML teglar va ortiqcha belgilarni tozalash
 */
export const cleanText = (str) => {
  if (!str) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Fazoviy 3D ilmiy hisobot PDF faylini generatsiya qilish
 * @param {object} params
 * @param {object} params.complex - Kompleks ob'ekti (id, name, formula, fullSalt, hybridization, etc.)
 * @param {object} params.geometryInfo - Geometriya haqida ma'lumot (name, angle, ks, symmetry)
 * @param {string} [params.canvasDataUrl] - 3D canvas snapshot rasmi (base64 PNG)
 * @param {object} [params.options] - Tashqi sharoitlar (temperature, pressure, phLevel, solvent, etc.)
 * @param {object} [params.sections] - Qaysi bo'limlarni kiritish
 * @returns {Promise<Uint8Array>} PDF baytlari
 */
export async function generateFazoviyPDF({
  complex,
  geometryInfo = {},
  canvasDataUrl = null,
  options = {},
  sections = {
    snapshot: true,
    info: true,
    conditions: true,
    geometry: true,
    dorbital: true,
    mo: true,
    spectra: true,
    references: true
  }
}) {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  // 1. DejaVu Sans fontlarini yuklash
  const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then((r) => {
    if (!r.ok) throw new Error("Regular font yuklanmadi")
    return r.arrayBuffer()
  })
  const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then((r) => {
    if (!r.ok) throw new Error("Bold font yuklanmadi")
    return r.arrayBuffer()
  })
  const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then((r) => {
    if (!r.ok) throw new Error("Italic font yuklanmadi")
    return r.arrayBuffer()
  })

  const regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
  const boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
  const italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })

  // 2. Ranglar palitrasi
  const C = {
    purple: rgb(0.30, 0.11, 0.58),
    purpleLight: rgb(0.86, 0.78, 1.0),
    purpleMid: rgb(0.65, 0.55, 0.98),
    purpleDark: rgb(0.12, 0.11, 0.29),
    textDark: rgb(0.08, 0.08, 0.16),
    textMuted: rgb(0.47, 0.47, 0.55),
    textGray: rgb(0.47, 0.47, 0.47),
    blue: rgb(0.08, 0.31, 0.55),
    green: rgb(0.08, 0.47, 0.31),
    orange: rgb(0.86, 0.55, 0),
    grayLine: rgb(0.78, 0.78, 0.86),
    bgPurple: rgb(0.97, 0.96, 1.0),
    bgBlue: rgb(0.94, 0.98, 1.0),
    bgGreen: rgb(0.94, 1.0, 0.98),
    bgYellow: rgb(1.0, 0.98, 0.94),
    bgSnapshot: rgb(0.04, 0.02, 0.09),
    white: rgb(1, 1, 1)
  }

  // 3. A4 o'lchamlari
  const PAGE_W = 595.28
  const PAGE_H = 841.89
  const MARGIN = 50
  const CONTENT_W = PAGE_W - 2 * MARGIN
  const FOOTER_Y = 30

  let page = pdfDoc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN
  let pageNum = 1

  // Yordamchi o'lchash va qisqartirish
  const measure = (text, font, size) => font.widthOfTextAtSize(String(text), size)

  const truncate = (text, font, size, maxWidth) => {
    const s = String(text)
    if (measure(s, font, size) <= maxWidth) return s
    let lo = 0, hi = s.length
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid
      else hi = mid - 1
    }
    return s.slice(0, lo) + "…"
  }

  const wrapText = (text, font, size, maxWidth) => {
    if (!text) return [""]
    const words = String(text).split(/\s+/)
    const lines = []
    let current = ""
    for (const word of words) {
      const test = current ? `${current} ${word}` : word
      if (measure(test, font, size) > maxWidth && current) {
        lines.push(current)
        current = word
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
    return lines
  }

  const safeText = (text, opts) => {
    const {
      x, y: ty, size = 10, font = regularFont, color = C.textDark,
      align = "left", maxWidth = null
    } = opts
    const s = cleanText(text)
    const limit = maxWidth ?? (PAGE_W - MARGIN - x)
    const finalText = truncate(s, font, size, limit)
    let fx = x
    const w = measure(finalText, font, size)
    if (align === "center") fx = x - w / 2
    else if (align === "right") fx = x - w
    page.drawText(finalText, { x: fx, y: ty, size, font, color })
  }

  const addFooter = () => {
    const leftText = truncate(
      `jdakimyo.uz  •  ${cleanText(complex?.formula || "")}  •  ${geometryInfo?.name || "Fazoviy 3D"}`,
      regularFont, 8, CONTENT_W - 40
    )
    page.drawText(leftText, {
      x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
    })
    const pageStr = `${pageNum}`
    const w = measure(pageStr, regularFont, 8)
    page.drawText(pageStr, {
      x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
    })
    page.drawLine({
      start: { x: MARGIN, y: FOOTER_Y + 12 },
      end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
      thickness: 0.3, color: C.grayLine
    })
  }

  const addNewPage = () => {
    addFooter()
    page = pdfDoc.addPage([PAGE_W, PAGE_H])
    pageNum++
    y = PAGE_H - MARGIN
  }

  const checkPageBreak = (need) => {
    if (y - need < FOOTER_Y + 25) addNewPage()
  }

  const drawSectionHeader = (num, title) => {
    checkPageBreak(35)
    y -= 10
    page.drawRectangle({
      x: MARGIN, y: y - 20, width: CONTENT_W, height: 22,
      color: C.bgPurple
    })
    page.drawRectangle({
      x: MARGIN, y: y - 20, width: 4, height: 22,
      color: C.purple
    })
    safeText(`${num}. ${title.toUpperCase()}`, {
      x: MARGIN + 12, y: y - 14, size: 10, font: boldFont, color: C.purple
    })
    y -= 30
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TITUL VA HEADER
  // ═══════════════════════════════════════════════════════════════════════════
  // Sarlavha qutisi
  page.drawRectangle({
    x: MARGIN, y: y - 55, width: CONTENT_W, height: 55,
    color: C.purpleDark
  })
  safeText("JDAKIMYO.UZ • ILMIY-TA'LIMIY PORTALI", {
    x: MARGIN + 14, y: y - 18, size: 8, font: boldFont, color: C.purpleLight
  })
  safeText(`${geometryInfo?.name || "Fazoviy Geometriya"} — 3D Molekulyar Hisobot`, {
    x: MARGIN + 14, y: y - 36, size: 14, font: boldFont, color: C.white
  })
  safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")} | Standart: IUPAC`, {
    x: MARGIN + 14, y: y - 49, size: 7.5, font: italicFont, color: C.purpleLight
  })
  y -= 70

  // ═══════════════════════════════════════════════════════════════════════════
  // CANVAS SNAPSHOT
  // ═══════════════════════════════════════════════════════════════════════════
  if (sections.snapshot && canvasDataUrl) {
    try {
      const pngImage = await pdfDoc.embedPng(canvasDataUrl)
      const imgH = 160
      const imgW = CONTENT_W
      checkPageBreak(imgH + 15)

      page.drawRectangle({
        x: MARGIN, y: y - imgH, width: imgW, height: imgH,
        color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 1
      })
      page.drawImage(pngImage, {
        x: MARGIN + 10, y: y - imgH + 5,
        width: imgW - 20, height: imgH - 10
      })
      y -= imgH + 15
    } catch (e) {
      console.warn("Canvas rasm qo'shishda xato:", e)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. ASOSIY MA'LUMOTLAR
  // ═══════════════════════════════════════════════════════════════════════════
  if (sections.info) {
    drawSectionHeader("1", "Birikma Haqida Asosiy Ma'lumotlar")

    const infoRows = [
      ["Kimyoviy formula:", complex?.formula || "-", "To'liq tuzilishi:", complex?.fullSalt || "-"],
      ["IUPAC nomi:", complex?.name || "-", "Markaziy atom:", `${complex?.center?.element || "-"} (${complex?.center?.charge || ""})`],
      ["Bog' uzunligi:", complex?.bondLengthReal || "-", "Gibridlanish:", complex?.hybridization || geometryInfo?.hybridization || "-"],
      ["Magnit xossasi:", complex?.magnetism || "-", "Rangi / Holati:", complex?.color || "-"]
    ]

    infoRows.forEach(([l1, v1, l2, v2]) => {
      checkPageBreak(18)
      safeText(l1, { x: MARGIN + 8, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 100 })
      safeText(v1, { x: MARGIN + 110, y: y - 10, size: 8.5, font: regularFont, color: C.blue, maxWidth: 130 })
      safeText(l2, { x: MARGIN + 250, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 100 })
      safeText(v2, { x: MARGIN + 350, y: y - 10, size: 8.5, font: regularFont, color: C.blue, maxWidth: 130 })
      y -= 16
    })
    y -= 10
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. FAZOVIY VA SIMMETRIYA PARAMETRLARI
  // ═══════════════════════════════════════════════════════════════════════════
  if (sections.geometry) {
    drawSectionHeader("2", "Fazoviy Geometriya va Simmetriya")

    const geomRows = [
      ["Geometriya shakli:", geometryInfo?.name || complex?.geometry || "-", "Simmetriya nuqtaviy guruhi:", geometryInfo?.symmetry || complex?.symmetry || "-"],
      ["Koordinatsion son (KS):", String(geometryInfo?.ks || complex?.coordNumber || "-"), "Valent burchaklar:", geometryInfo?.angle || "-"]
    ]

    geomRows.forEach(([l1, v1, l2, v2]) => {
      checkPageBreak(18)
      safeText(l1, { x: MARGIN + 8, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 130 })
      safeText(v1, { x: MARGIN + 140, y: y - 10, size: 8.5, font: regularFont, color: C.purple, maxWidth: 100 })
      safeText(l2, { x: MARGIN + 250, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 130 })
      safeText(v2, { x: MARGIN + 380, y: y - 10, size: 8.5, font: regularFont, color: C.purple, maxWidth: 100 })
      y -= 16
    })
    y -= 10
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. TASHQI SHAROITLAR
  // ═══════════════════════════════════════════════════════════════════════════
  if (sections.conditions) {
    drawSectionHeader("3", "Tashqi Sharoitlar va Termodinamika")

    const condRows = [
      ["Harorat (T):", `${options.temperature ?? 298} K (${Math.round((options.temperature ?? 298) - 273.15)} °C)`, "Bosim (P):", `${options.pressure ?? 1} atm`],
      ["Muhit pH darajasi:", `${options.phLevel ?? 7} (${(options.phLevel ?? 7) < 7 ? "Kislotali" : (options.phLevel ?? 7) > 7 ? "Ishqoriy" : "Neytral"})`, "Erituvchi:", options.solvent ?? "Suv (H₂O)"]
    ]

    condRows.forEach(([l1, v1, l2, v2]) => {
      checkPageBreak(18)
      safeText(l1, { x: MARGIN + 8, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 120 })
      safeText(v1, { x: MARGIN + 130, y: y - 10, size: 8.5, font: regularFont, color: C.green, maxWidth: 110 })
      safeText(l2, { x: MARGIN + 250, y: y - 10, size: 8.5, font: boldFont, color: C.textDark, maxWidth: 120 })
      safeText(v2, { x: MARGIN + 370, y: y - 10, size: 8.5, font: regularFont, color: C.green, maxWidth: 110 })
      y -= 16
    })
    y -= 10
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. FOYDALANILGAN ILMIY ADABIYOTLAR
  // ═══════════════════════════════════════════════════════════════════════════
  if (sections.references) {
    drawSectionHeader("4", "Foydalanilgan Ilmiy Adabiyotlar va Standartlar")

    const refs = [
      "1. Miessler, G. L., Fischer, P. J., & Tarr, D. A. (2014). Inorganic Chemistry (5th ed.). Pearson.",
      "2. Housecroft, C. E., & Sharpe, A. G. (2018). Inorganic Chemistry (5th ed.). Pearson Education.",
      "3. IUPAC Compendium of Chemical Terminology (Gold Book), 2nd ed. (1997). Online version (2019-)."
    ]

    refs.forEach((ref) => {
      const lines = wrapText(ref, regularFont, 8, CONTENT_W - 16)
      lines.forEach((line) => {
        checkPageBreak(14)
        safeText(line, { x: MARGIN + 8, y: y - 8, size: 8, font: regularFont, color: C.textGray })
        y -= 12
      })
      y -= 4
    })
  }

  // Oxirgi sahifa footerini qo'yish
  addFooter()

  return await pdfDoc.save()
}
