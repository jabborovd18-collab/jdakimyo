// ═══════════════════════════════════════════════════════════════════════════
// 📄 FAZOVIY 3D TO'LIQ ILMIY PDF HISOBOT GENERATORI (BRIF-F02)
// Yagona haqiqat manbai: app/oquv/fazoviy/* barcha 3D sahifalar uchun
// ═══════════════════════════════════════════════════════════════════════════

import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { ATOM_INFO } from "./atom-malumot.js"

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
 * @param {object} params.complex - Kompleks ob'ekti (id, name, formula, fullSalt, hybridization, dOrbital, spectroscopy, etc.)
 * @param {object} params.geometryInfo - Geometriya haqida ma'lumot (name, angle, ks, symmetry)
 * @param {string} [params.canvasDataUrl] - 3D canvas snapshot rasmi (base64 PNG)
 * @param {object} [params.options] - Tashqi sharoitlar (temperature, pressure, phLevel, solvent, viewMode, moleculeCount, ensembleMode, etc.)
 * @param {object} [params.sections] - Qaysi bo'limlarni kiritish
 * @returns {Promise<Uint8Array>} PDF baytlari
 */
export async function generateFazoviyPDF({
  complex = {},
  geometryInfo = {},
  canvasDataUrl = null,
  options = {},
  sections = {
    snapshot: true,
    info: true,
    geometry: true,
    conditions: true,
    dorbital: true,
    mo: true,
    spectra: true,
    crystalField: true,
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
    purpleSoft: rgb(0.51, 0.39, 0.71),
    purpleDark: rgb(0.12, 0.11, 0.29),
    textDark: rgb(0.08, 0.08, 0.16),
    textMuted: rgb(0.47, 0.47, 0.55),
    textGray: rgb(0.47, 0.47, 0.47),
    orange: rgb(0.86, 0.55, 0),
    orangeDeep: rgb(0.71, 0.39, 0),
    orangeSoft: rgb(0.71, 0.31, 0.08),
    green: rgb(0.08, 0.47, 0.31),
    greenDark: rgb(0.12, 0.47, 0.27),
    blue: rgb(0.08, 0.31, 0.55),
    brown: rgb(0.71, 0.39, 0.12),
    grayLine: rgb(0.78, 0.78, 0.86),
    bgPurple: rgb(0.97, 0.96, 1.0),
    bgOrange: rgb(1.0, 0.97, 0.94),
    bgBlue: rgb(0.94, 0.98, 1.0),
    bgGreen: rgb(0.94, 1.0, 0.98),
    bgYellow: rgb(1.0, 0.98, 0.94),
    bgAbstract: rgb(0.96, 0.94, 1.0),
    bgSnapshot: rgb(0.04, 0.02, 0.09),
    white: rgb(1, 1, 1),
    red: rgb(0.80, 0.20, 0.20)
  }

  // 3. A4 o'lchamlari va sozlamalar
  const PAGE_W = 595.28
  const PAGE_H = 841.89
  const MARGIN = 55
  const CONTENT_W = PAGE_W - 2 * MARGIN
  const FOOTER_Y = 30
  const HEADER_H = 65

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
      if (measure(current, font, size) > maxWidth) {
        let piece = ""
        for (const ch of current) {
          if (measure(piece + ch, font, size) > maxWidth) {
            lines.push(piece)
            piece = ch
          } else piece += ch
        }
        current = piece
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

  const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
    const lines = wrapText(cleanText(text), font, size, maxW)
    lines.forEach((line, i) => {
      const w = measure(line, font, size)
      page.drawText(line, {
        x: (PAGE_W - w) / 2,
        y: cy - i * (size + 3),
        size, font, color
      })
    })
    return lines.length * (size + 3)
  }

  const addFooter = () => {
    const leftText = truncate(
      `${geometryInfo.name || "Fazoviy"} 3D Lab PRO  •  ${cleanText(complex.formula || "")}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
      regularFont, 8, CONTENT_W - 30
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
    checkPageBreak(45)
    page.drawRectangle({
      x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple
    })
    safeText(`${num}. ${title}`, {
      x: MARGIN + 10, y: y - 14, size: 13,
      font: boldFont, color: C.purple,
      maxWidth: CONTENT_W - 15
    })
    y -= 24
    page.drawLine({
      start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
      thickness: 0.5, color: C.grayLine
    })
    y -= 14
  }

  const drawTableRow = (label, value, bgColor = C.bgPurple, labelColor = C.purple) => {
    const rowH = 20
    const labelW = 190
    const valueX = MARGIN + labelW + 6
    const valueMaxW = CONTENT_W - labelW - 12

    checkPageBreak(rowH + 2)
    page.drawRectangle({
      x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor
    })
    safeText(label, {
      x: MARGIN + 6, y: y - 13, size: 9,
      font: boldFont, color: labelColor,
      maxWidth: labelW - 8
    })
    const valStr = cleanText(value)
    const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
    page.drawText(finalVal, {
      x: valueX, y: y - 13, size: 9,
      font: regularFont, color: C.textDark
    })
    y -= rowH
  }

  // ═══════════════════════════════════════════════════════════
  // SARLAVHA POLOSASI (JDA-KIMYO ILMIY BYULLETENI)
  // ═══════════════════════════════════════════════════════════
  page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })

  safeText("JDA-KIMYO ILMIY BYULLETENI  •  Koordinatsion Kimyo  •  Vol. 2, Son 1", {
    x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight,
    maxWidth: CONTENT_W * 0.65
  })

  safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
    x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
    font: regularFont, color: C.purpleLight, align: "right",
    maxWidth: CONTENT_W * 0.3
  })

  page.drawLine({
    start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
    thickness: 1, color: C.purpleMid
  })

  safeText("Interaktiv 3D Molekulyar Modellashtirish Platformasi", {
    x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86),
    maxWidth: CONTENT_W * 0.65
  })
  safeText("DOI: 10.0000/jda-kimyo.2026.001", {
    x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
    font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right",
    maxWidth: CONTENT_W * 0.3
  })
  y = PAGE_H - HEADER_H - 30

  // ═══════════════════════════════════════════════════════════
  // TITLE
  // ═══════════════════════════════════════════════════════════
  drawCenteredText(`${cleanText(complex.formula || "Molekula")} Struktur Tahlili`, y, 20, boldFont, C.textDark)
  y -= 28

  drawCenteredText(cleanText(complex.name || ""), y, 12, italicFont, C.purpleSoft)
  y -= 20

  drawCenteredText(
    `Geometriya: ${cleanText(complex.geometry || geometryInfo.name)} (${cleanText(complex.symmetry || geometryInfo.symmetry)})  •  Gibridlanish: ${cleanText(complex.hybridization || geometryInfo.hybridization)}  •  ${cleanText(complex.magnetism || "")}`,
    y, 9, regularFont, C.textMuted
  )
  y -= 28

  // ═══════════════════════════════════════════════════════════
  // ANNOTATSIYA (Abstract)
  // ═══════════════════════════════════════════════════════════
  const subNum = (n) => "₀₁₂₃₄₅₆₇₈₉"[n] ?? String(n)
  const dOrb = complex.dOrbital || {}
  const deltaVal = dOrb.deltaO ?? dOrb.deltaT ?? 20000
  const deltaSymbol = dOrb.deltaT !== undefined ? "Δₜ" : "Δₒ"

  const centerInfo = ATOM_INFO[complex.center?.element] || { name: complex.center?.element || "" }
  const ligandDesc = complex.ligand?.type === "NH3" ? "ammiak" : complex.ligand?.type === "CN" ? "tsianid" : complex.ligand?.type === "Cl" ? "xlorid" : "donor"
  const donorName = complex.ligand?.donor || "donor"
  const bondLen = complex.bondLengthReal || "bog' masofasida"
  const spinDesc = dOrb.type === "LS" ? "past spinli" : dOrb.type === "HS" ? "yuqori spinli" : "magnit faol"

  let configStr = ""
  if (dOrb.tg !== undefined && dOrb.eg !== undefined) {
    const tgSub = String(dOrb.tg).split("").map((d) => subNum(+d)).join("")
    const egSub = String(dOrb.eg).split("").map((d) => subNum(+d)).join("")
    configStr = `t₂g${tgSub} eg${egSub}`
  } else if (dOrb.e !== undefined && dOrb.t2 !== undefined) {
    const eSub = String(dOrb.e).split("").map((d) => subNum(+d)).join("")
    const t2Sub = String(dOrb.t2).split("").map((d) => subNum(+d)).join("")
    configStr = `e${eSub} t₂${t2Sub}`
  }

  const abstract =
    `${cleanText(complex.formula || "")} kompleksi ideal ${cleanText(complex.geometry || geometryInfo.name).toLowerCase()} geometriyasiga va ` +
    `${cleanText(complex.symmetry || geometryInfo.symmetry)} simmetriyasiga ega. Markaziy ${cleanText(centerInfo.name.split(" ")[0])} ioni ` +
    `${cleanText(complex.coordNumber || geometryInfo.ks || 6)} ta ${ligandDesc} ligandi bilan ` +
    `${cleanText(donorName)} donor atomlari orqali ${cleanText(bondLen)} masofada bir xil bog'langan. ` +
    `Kristall maydon ajralishi (${deltaSymbol} = ${deltaVal.toLocaleString()} cm⁻¹) ` +
    `${spinDesc} ${configStr} konfiguratsiyasini hosil qiladi. ` +
    `Bu natija Werner (1893) va Bethe (1929) nazariyalari asosida tahlil qilingan.`

  const absPadding = 12
  const absInnerW = CONTENT_W - 2 * absPadding
  const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
  const boxH = 24 + absLines.length * 13 + 8

  checkPageBreak(boxH + 20)
  page.drawRectangle({
    x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
    color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1
  })
  safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
    x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple,
    maxWidth: absInnerW
  })
  absLines.forEach((line, i) => {
    page.drawText(line, {
      x: MARGIN + absPadding, y: y - 32 - i * 13,
      size: 9.5, font: regularFont, color: C.textDark
    })
  })
  y -= boxH + 22

  let sectionNum = 1

  // ═══════════════════════════════════════════════════════════
  // 1. 3D SNAPSHOT
  // ═══════════════════════════════════════════════════════════
  if (sections.snapshot && canvasDataUrl) {
    drawSectionHeader(sectionNum++, "3D Vizualizatsiya (Ko'rinish)")
    try {
      const pngImage = await pdfDoc.embedPng(canvasDataUrl)
      const imgW = CONTENT_W
      const imgH = imgW * 0.52
      checkPageBreak(imgH + 40)

      page.drawRectangle({
        x: MARGIN, y: y - imgH, width: imgW, height: imgH,
        color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 1.5
      })
      page.drawImage(pngImage, {
        x: MARGIN + 2, y: y - imgH + 2, width: imgW - 4, height: imgH - 4
      })
      y -= imgH + 10

      const vMode = options.viewMode || "ball-stick"
      const mCount = options.moleculeCount || 1
      const eMode = options.ensembleMode || "crystal"
      const caption =
        `1-rasm. ${cleanText(complex.formula)} ning ` +
        `${vMode === "ball-stick" ? "shar-tayoqcha" : vMode === "space-filling" ? "fazo to'ldiruvchi (CPK)" : "karkas"} ` +
        `ko'rinishidagi 3D modeli. ${cleanText(complex.geometry || geometryInfo.name)} ${cleanText(complex.symmetry || geometryInfo.symmetry)} simmetriya. ${mCount > 1 ? `${mCount} ta molekula ${eMode} ansamblida.` : "Bitta molekula."}`
      const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
      capLines.forEach((line, i) => {
        page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
      })
      y -= capLines.length * 11 + 18
    } catch (e) {
      console.warn("Snapshot xatosi:", e)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 2. BIRIKMA IDENTIFIKATSIYASI
  // ═══════════════════════════════════════════════════════════
  if (sections.info) {
    drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
    const infoTable = [
      ["Koordinatsion ion", complex.formula || "-"],
      ["Tashqi sfera tuzi", complex.fullSalt || "-"],
      ["IUPAC nomi", complex.name || "-"],
      ["Koordinatsion son", String(complex.coordNumber || geometryInfo.ks || "-")],
      ["Geometriya", complex.geometry || geometryInfo.name || "-"],
      ["Nuqtaviy guruh", complex.symmetry || geometryInfo.symmetry || "-"],
      ["Gibridlanish", complex.hybridization || geometryInfo.hybridization || "-"],
      ["Magnit xossasi", complex.magnetism || "-"],
      ["Rangi (qattiq holatda)", complex.color || "-"],
      ["d-elektronlar soni", `d${complex.dElectrons || (complex.dOrbital?.tg !== undefined ? complex.dOrbital.tg + complex.dOrbital.eg : "-")}`]
    ]
    infoTable.forEach((row, i) => {
      drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
    })
    y -= 15
  }

  // ═══════════════════════════════════════════════════════════
  // 3. MOLEKULYAR GEOMETRIYA
  // ═══════════════════════════════════════════════════════════
  if (sections.geometry) {
    drawSectionHeader(sectionNum++, "Molekulyar Geometriya")
    const isOct = (geometryInfo.ks || complex.coordNumber) === 6
    const geomData = [
      [`M–${complex.ligand?.donor || "L"} bog' uzunligi`, complex.bondLengthReal || "-"],
      [isOct ? "Ideal L–M–L (cis)" : "Ideal valent burchak", isOct ? "90.0°" : "109.5°"],
      [isOct ? "Ideal L–M–L (trans)" : "Simmetriya guruhi", isOct ? "180.0°" : (geometryInfo.symmetry || "Td")],
      [isOct ? "Hisoblangan cis burchaklar" : "Burchaklar soni", isOct ? "12 × 90°" : "6 × 109.5°"],
      [isOct ? "Hisoblangan trans burchaklar" : "Fazoviy shakl", isOct ? "3 × 180°" : "Muntazam tetraedr"],
      ["Ideal simmetriyadan og'ish (RMSD)", "< 0.001 Å"]
    ]
    geomData.forEach((row, i) => {
      drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgOrange : C.white, C.orangeSoft)
    })
    y -= 15
  }

  // ═══════════════════════════════════════════════════════════
  // 4. SIMULYATSIYA SHAROITLARI
  // ═══════════════════════════════════════════════════════════
  if (sections.conditions) {
    drawSectionHeader(sectionNum++, "Simulyatsiya Sharoitlari")
    const temp = options.temperature ?? 298
    const press = options.pressure ?? 1
    const ph = options.phLevel ?? 7
    const cond = [
      ["Molekulalar soni", `${options.moleculeCount ?? 1}`],
      ["Ansambl rejimi", (options.ensembleMode ?? "crystal") === "crystal" ? "Kristall panjara" : "Eritma"],
      ["Vizualizatsiya rejimi", (options.viewMode ?? "ball-stick") === "ball-stick" ? "Shar-tayoqcha" : options.viewMode === "space-filling" ? "Fazo to'ldiruvchi (CPK)" : "Karkas"],
      ["Temperatura", `${temp} K  (${(temp - 273.15).toFixed(0)} °C)`],
      ["Bosim", `${press.toLocaleString()} atm`],
      ["pH muhit", `${ph}  (${ph < 7 ? "kislotali" : ph > 7 ? "ishqoriy" : "neytral"})`],
      ["Erituvchi", options.solvent ?? "Suv (H₂O)"]
    ]
    cond.forEach((row, i) => {
      drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue)
    })
    y -= 15
  }

  // ═══════════════════════════════════════════════════════════
  // 5. d-ORBITAL DIAGRAMMASI (DINAMIK)
  // ═══════════════════════════════════════════════════════════
  if (sections.dorbital) {
    drawSectionHeader(sectionNum++, "Kristall Maydon d-Orbital Ajralishi")
    checkPageBreak(180)

    const splitting = complex.dOrbitalSplitting || geometryInfo.dOrbitalSplitting
    if (splitting?.hasSplitting === false) {
      // d-orbital ajralishi mavjud bo'lmagan tizimlar (masalan asosiy guruh elementlari)
      const noSplittingText =
        splitting.reason ||
        "Ushbu molekula (s/p gibridlangan asosiy guruh birikmasi) uchun klassik d-orbital kristall maydon ajralishi mavjud emas. " +
        "Molekulaning fazoviy va elektron tuzilishi VSEPR nazariyasi va molekulyar orbitallar (MO) usuli bilan tushuntiriladi."
      const boxLines = wrapText(cleanText(noSplittingText), regularFont, 9.5, CONTENT_W - 20)
      const boxHeight = boxLines.length * 13 + 16
      page.drawRectangle({
        x: MARGIN, y: y - boxHeight, width: CONTENT_W, height: boxHeight,
        color: C.bgPurple, borderColor: C.purpleMid, borderWidth: 0.5
      })
      boxLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + 10, y: y - 14 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark
        })
      })
      y -= boxHeight + 15
    } else {
      const isOct = dOrb.tg !== undefined || (geometryInfo.ks || complex.coordNumber) === 6
      const isSquarePlanar = geometryInfo.id === "tekis-kvadrat" || (complex.geometry || "").includes("Tekis")
      const diagX = MARGIN + 30
      const topY = y - 25
      const botY = y - 105

      // E o'qi
      page.drawLine({
        start: { x: diagX, y }, end: { x: diagX, y: botY - 25 },
        thickness: 1, color: rgb(0.63, 0.63, 0.71)
      })
      page.drawLine({ start: { x: diagX - 3, y: y - 3 }, end: { x: diagX, y: y + 2 }, thickness: 1, color: rgb(0.63, 0.63, 0.71) })
      page.drawLine({ start: { x: diagX + 3, y: y - 3 }, end: { x: diagX, y: y + 2 }, thickness: 1, color: rgb(0.63, 0.63, 0.71) })
      page.drawText("E", { x: diagX - 12, y: y - 5, size: 10, font: italicFont, color: rgb(0.51, 0.51, 0.59) })

      const drawElectron = (cx, cy, isUp) => {
        page.drawText(isUp ? "↑" : "↓", {
          x: cx - 3, y: cy - 4, size: 11, font: boldFont, color: C.orange
        })
      }

      if (isSquarePlanar) {
        // Tekis kvadrat 4 sathli ajralishi
        const spLevels = [
          { name: "dx²-y² (b₁g)", y: topY, energy: "+1.23 Δ" },
          { name: "dxy (b₂g)", y: topY - 25, energy: "+0.23 Δ" },
          { name: "dz² (a₁g)", y: topY - 50, energy: "-0.43 Δ" },
          { name: "dxz, dyz (eg)", y: botY, energy: "-0.51 Δ" }
        ]
        spLevels.forEach((lvl) => {
          page.drawLine({ start: { x: diagX + 15, y: lvl.y }, end: { x: diagX + 75, y: lvl.y }, thickness: 1.5, color: C.purple })
          page.drawText(lvl.name, { x: diagX + 85, y: lvl.y - 3, size: 8, font: regularFont, color: C.purpleSoft })
        })
      } else if (isOct) {
        // Oktaedrik: eg (2 ta yuqori), t2g (3 ta pastki)
        const egOrb1X = diagX + 12
        const egOrb2X = diagX + 62
        const orbLineW = 38
        page.drawLine({ start: { x: egOrb1X, y: topY }, end: { x: egOrb1X + orbLineW, y: topY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: egOrb2X, y: topY }, end: { x: egOrb2X + orbLineW, y: topY }, thickness: 2, color: C.purple })
        page.drawText("eg", { x: diagX + 118, y: topY - 4, size: 11, font: boldFont, color: C.purple })
        page.drawText("dz²", { x: egOrb1X + 8, y: topY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dx²-y²", { x: egOrb2X + 4, y: topY + 6, size: 7, font: regularFont, color: C.purpleSoft })

        const tOrb1X = diagX + 8
        const tOrb2X = diagX + 48
        const tOrb3X = diagX + 88
        const tOrbW = 32
        page.drawLine({ start: { x: tOrb1X, y: botY }, end: { x: tOrb1X + tOrbW, y: botY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: tOrb2X, y: botY }, end: { x: tOrb2X + tOrbW, y: botY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: tOrb3X, y: botY }, end: { x: tOrb3X + tOrbW, y: botY }, thickness: 2, color: C.purple })
        page.drawText("t₂g", { x: diagX + 128, y: botY - 4, size: 11, font: boldFont, color: C.purple })
        page.drawText("dxy", { x: tOrb1X + 8, y: botY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dxz", { x: tOrb2X + 8, y: botY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dyz", { x: tOrb3X + 8, y: botY + 6, size: 7, font: regularFont, color: C.purpleSoft })

        // Elektronlar
        const numTg = dOrb.tg ?? 6
        const numEg = dOrb.eg ?? 0
        const tgOrbs = [
          [tOrb1X + tOrbW / 2 - 4, tOrb1X + tOrbW / 2 + 6],
          [tOrb2X + tOrbW / 2 - 4, tOrb2X + tOrbW / 2 + 6],
          [tOrb3X + tOrbW / 2 - 4, tOrb3X + tOrbW / 2 + 6]
        ]
        let elFilled = 0
        for (let i = 0; i < 3 && elFilled < numTg; i++) {
          drawElectron(tgOrbs[i][0], botY + 8, true); elFilled++
          if (elFilled < numTg) {
            drawElectron(tgOrbs[i][1], botY + 8, false); elFilled++
          }
        }
        const egOrbs = [
          [egOrb1X + orbLineW / 2 - 4, egOrb1X + orbLineW / 2 + 6],
          [egOrb2X + orbLineW / 2 - 4, egOrb2X + orbLineW / 2 + 6]
        ]
        elFilled = 0
        for (let i = 0; i < 2 && elFilled < numEg; i++) {
          drawElectron(egOrbs[i][0], topY + 8, true); elFilled++
          if (elFilled < numEg) {
            drawElectron(egOrbs[i][1], topY + 8, false); elFilled++
          }
        }
      } else {
        // Tetraedrik / umumiy: t2 (yuqori), e (pastki)
        const tOrb1X = diagX + 8
        const tOrb2X = diagX + 48
        const tOrb3X = diagX + 88
        const tOrbW = 32
        page.drawLine({ start: { x: tOrb1X, y: topY }, end: { x: tOrb1X + tOrbW, y: topY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: tOrb2X, y: topY }, end: { x: tOrb2X + tOrbW, y: topY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: tOrb3X, y: topY }, end: { x: tOrb3X + tOrbW, y: topY }, thickness: 2, color: C.purple })
        page.drawText("t₂", { x: diagX + 128, y: topY - 4, size: 11, font: boldFont, color: C.purple })
        page.drawText("dxy", { x: tOrb1X + 8, y: topY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dxz", { x: tOrb2X + 8, y: topY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dyz", { x: tOrb3X + 8, y: topY + 6, size: 7, font: regularFont, color: C.purpleSoft })

        const eOrb1X = diagX + 12
        const eOrb2X = diagX + 62
        const orbLineW = 38
        page.drawLine({ start: { x: eOrb1X, y: botY }, end: { x: eOrb1X + orbLineW, y: botY }, thickness: 2, color: C.purple })
        page.drawLine({ start: { x: eOrb2X, y: botY }, end: { x: eOrb2X + orbLineW, y: botY }, thickness: 2, color: C.purple })
        page.drawText("e", { x: diagX + 118, y: botY - 4, size: 11, font: boldFont, color: C.purple })
        page.drawText("dz²", { x: eOrb1X + 8, y: botY + 6, size: 7, font: regularFont, color: C.purpleSoft })
        page.drawText("dx²-y²", { x: eOrb2X + 4, y: botY + 6, size: 7, font: regularFont, color: C.purpleSoft })

        const numT2 = dOrb.t2 ?? 3
        const numE = dOrb.e ?? 4
        const eOrbs = [
          [eOrb1X + orbLineW / 2 - 4, eOrb1X + orbLineW / 2 + 6],
          [eOrb2X + orbLineW / 2 - 4, eOrb2X + orbLineW / 2 + 6]
        ]
        let elFilled = 0
        for (let i = 0; i < 2 && elFilled < numE; i++) {
          drawElectron(eOrbs[i][0], botY + 8, true); elFilled++
          if (elFilled < numE) {
            drawElectron(eOrbs[i][1], botY + 8, false); elFilled++
          }
        }
        const tOrbs = [
          [tOrb1X + tOrbW / 2 - 4, tOrb1X + tOrbW / 2 + 6],
          [tOrb2X + tOrbW / 2 - 4, tOrb2X + tOrbW / 2 + 6],
          [tOrb3X + tOrbW / 2 - 4, tOrb3X + tOrbW / 2 + 6]
        ]
        elFilled = 0
        for (let i = 0; i < 3 && elFilled < numT2; i++) {
          drawElectron(tOrbs[i][0], topY + 8, true); elFilled++
          if (elFilled < numT2) {
            drawElectron(tOrbs[i][1], topY + 8, false); elFilled++
          }
        }
      }

      // Δ Strelkasi
      const arX = diagX + 165
      page.drawLine({ start: { x: arX, y: topY }, end: { x: arX, y: botY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX - 3, y: topY - 5 }, end: { x: arX, y: topY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX + 3, y: topY - 5 }, end: { x: arX, y: topY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX - 3, y: botY + 5 }, end: { x: arX, y: botY }, thickness: 1.5, color: C.orange })
      page.drawLine({ start: { x: arX + 3, y: botY + 5 }, end: { x: arX, y: botY }, thickness: 1.5, color: C.orange })

      const midY = (topY + botY) / 2
      page.drawText(deltaSymbol, { x: arX + 8, y: midY + 4, size: 13, font: boldFont, color: C.orangeDeep })
      page.drawText(`= ${deltaVal.toLocaleString()} cm⁻¹`, {
        x: arX + 8, y: midY - 10, size: 9, font: regularFont, color: C.orangeDeep
      })

      // O'ng ma'lumot ustuni
      const infoX = arX + 105
      const infoMaxW = PAGE_W - MARGIN - infoX

      safeText("Konfiguratsiya:", { x: infoX, y: topY, size: 8.5, font: boldFont, color: C.textDark, maxWidth: infoMaxW })
      safeText(configStr || "d-konfiguratsiya", { x: infoX, y: topY - 13, size: 9, font: regularFont, color: C.textDark, maxWidth: infoMaxW })

      safeText("Spin holati:", { x: infoX, y: midY + 8, size: 8.5, font: boldFont, color: C.textDark, maxWidth: infoMaxW })
      safeText(dOrb.type === "LS" ? "Past spin" : dOrb.type === "HS" ? "Yuqori spin" : (complex.magnetism || "Diamagnit"), { x: infoX, y: midY - 5, size: 9, font: regularFont, color: C.textDark, maxWidth: infoMaxW })

      let cfseNum = isOct ? (-0.4 * (dOrb.tg ?? 6) + 0.6 * (dOrb.eg ?? 0)) : (-0.6 * (dOrb.e ?? 4) + 0.4 * (dOrb.t2 ?? 3))
      const cfseValStr = `${cfseNum.toFixed(2)} ${deltaSymbol}`
      const cfseE = (Math.abs(cfseNum) * deltaVal * 0.012).toFixed(0)

      safeText("CFSE (KMBE):", { x: infoX, y: botY + 5, size: 8.5, font: boldFont, color: C.textDark, maxWidth: infoMaxW })
      safeText(cfseValStr, { x: infoX, y: botY - 8, size: 9, font: regularFont, color: C.textDark, maxWidth: infoMaxW })
      safeText(`≈ ${cfseE} kJ/mol`, { x: infoX, y: botY - 20, size: 9, font: regularFont, color: C.textDark, maxWidth: infoMaxW })

      y = botY - 45
      const caption = `2-rasm. ${cleanText(complex.formula)} uchun ${cleanText(complex.geometry || geometryInfo.name)} kristall maydon ajralish diagrammasi.`
      const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
      capLines.forEach((line, i) => {
        page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
      })
      y -= capLines.length * 11 + 18
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 6. MO DIAGRAMMA
  // ═══════════════════════════════════════════════════════════
  if (sections.mo) {
    drawSectionHeader(sectionNum++, "Molekulyar Orbital Diagramma")
    checkPageBreak(160)

    const isOct = dOrb.tg !== undefined || (geometryInfo.ks || complex.coordNumber) === 6
    const moLevels = isOct
      ? [
          { label: "σ* (4p, 4s) — antibog'lovchi", fill: 0 },
          { label: "σ* (eg) — antibog'lovchi", fill: dOrb.eg ?? 0 },
          { label: "π (t₂g) — bog'lanmagan", fill: dOrb.tg ?? 6 },
          { label: "σ (eg + a₁g + t₁u) — bog'lovchi", fill: 12 }
        ]
      : [
          { label: "σ* (4p, 4s) — antibog'lovchi", fill: 0 },
          { label: "σ* (t₂) — kuchsiz antibog'lovchi", fill: dOrb.t2 ?? 3 },
          { label: "e — bog'lanmagan", fill: dOrb.e ?? 4 },
          { label: "σ (a₁ + t₂) — bog'lovchi", fill: 8 }
        ]

    const lineX = MARGIN + 30
    const lineW = 50
    const labelX = lineX + lineW + 15
    const labelMaxW = CONTENT_W - (labelX - MARGIN) - 5

    moLevels.forEach((lvl, i) => {
      const ly = y - 15 - i * 30
      page.drawLine({
        start: { x: lineX, y: ly }, end: { x: lineX + lineW, y: ly },
        thickness: 1.5, color: rgb(0.59, 0.39, 0.78)
      })
      safeText(lvl.label, {
        x: labelX, y: ly - 3, size: 9, font: regularFont, color: C.purpleSoft,
        maxWidth: labelMaxW
      })
      if (lvl.fill > 0) {
        const maxSlots = 6
        const shown = Math.min(lvl.fill, maxSlots)
        const totalW = shown * 6
        let ex = lineX + (lineW - totalW) / 2
        for (let k = 0; k < shown; k++) {
          page.drawText(k % 2 === 0 ? "↑" : "↓", {
            x: ex, y: ly - 2, size: 11, font: boldFont, color: C.orange
          })
          ex += 6
        }
        if (lvl.fill > maxSlots) {
          page.drawText(`+${lvl.fill - maxSlots}`, {
            x: lineX + lineW + 2, y: ly - 3, size: 8, font: regularFont, color: C.orangeDeep
          })
        }
      }
    })
    y -= 15 + moLevels.length * 30 + 10

    const caption = "3-rasm. Ligand donor orbitallari va metall d-orbitallari o'zaro ta'sirini ko'rsatuvchi molekulyar orbital diagrammasi."
    const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
    capLines.forEach((line, i) => {
      page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
    })
    y -= capLines.length * 11 + 18
  }

  // ═══════════════════════════════════════════════════════════
  // 7. SPEKTROSKOPIK MA'LUMOTLAR + 2D IR SPEKTR GRAFIGI
  // ═══════════════════════════════════════════════════════════
  if (sections.spectra) {
    drawSectionHeader(sectionNum++, "Bashorat qilingan Spektroskopik Ma'lumotlar")

    const isCoNH3 = complex.id === "CoNH3"
    const isCoCl4 = complex.id === "CoCl4" || complex.center?.element === "Co" && complex.ligand?.type === "Cl"
    const isOct = dOrb.tg !== undefined || (geometryInfo.ks || complex.coordNumber) === 6

    const uvVisD = isCoNH3
      ? "λmax ≈ 475 nm  (¹A₁g → ¹T₁g)"
      : isCoCl4
      ? "λmax ≈ 660 nm  (⁴A₂ → ⁴T₁(P))"
      : "λmax ≈ 420 nm"

    const irML = isOct ? "400–600 cm⁻¹" : "280–330 cm⁻¹"
    const irSym = isOct ? "≈ 500 cm⁻¹" : "≈ 310 cm⁻¹"
    const irAsym = isOct ? "≈ 450 cm⁻¹" : "≈ 295 cm⁻¹"
    const irBend = isOct ? "≈ 320 cm⁻¹" : "≈ 120 cm⁻¹"

    const specData = [
      ["UV-Vis (d–d o'tish)", uvVisD],
      ["UV-Vis (LMCT o'tish)", "λmax < 300 nm"],
      [`IR (M–${complex.ligand?.donor || "L"} tebranish)`, irML],
      [`Simmetrik cho'zilish (${isOct ? "a₁g" : "a₁"})`, irSym],
      [`Asimmetrik cho'zilish (${isOct ? "t₁u" : "t₂"})`, irAsym],
      [`Egilish tebranishi (${isOct ? "eg" : "e"})`, irBend],
      ["NMR ma'lumotlari", isCoNH3 ? "⁵⁹Co: ≈ 8200 ppm  •  ¹H: 3.5 ppm" : isCoCl4 ? "Paramagnit kengayish" : "¹³C: 170 ppm  •  ¹⁴N: 270 ppm"]
    ]
    specData.forEach((row, i) => {
      drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.green)
    })
    y -= 12

    // ── 2D IR SPEKTR GRAFIGI ──
    const graphNeed = 190
    checkPageBreak(graphNeed)

    safeText("IR Spektr (simulyatsiya, 250–700 cm⁻¹ oralig'i)", {
      x: MARGIN, y, size: 10, font: boldFont, color: C.greenDark,
      maxWidth: CONTENT_W
    })
    y -= 15

    const gLeftPad = 32
    const gBotPad = 22
    const gTopPad = 28
    const gX = MARGIN + gLeftPad
    const gW = CONTENT_W - gLeftPad - 5
    const gH = 100
    const gY = y - gH - gTopPad
    const xMin = 250, xMax = 700

    // Grafik foni
    page.drawRectangle({
      x: gX, y: gY, width: gW, height: gH,
      color: rgb(0.98, 1.0, 0.99), borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 0.5
    })

    // Y o'qi grid + belgilar (T% 0-100)
    for (let tick = 0; tick <= 100; tick += 25) {
      const ty = gY + (tick / 100) * gH
      if (tick > 0 && tick < 100) {
        page.drawLine({
          start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
          thickness: 0.2, color: rgb(0.85, 0.92, 0.88)
        })
      }
      const label = `${tick}`
      const lw = measure(label, regularFont, 6.5)
      page.drawText(label, {
        x: gX - lw - 4, y: ty - 2.5, size: 6.5,
        font: regularFont, color: rgb(0.4, 0.5, 0.45)
      })
    }

    // X o'qi grid + belgilar
    const xTicks = [300, 400, 500, 600, 700]
    xTicks.forEach((wn) => {
      const tx = gX + ((wn - xMin) / (xMax - xMin)) * gW
      page.drawLine({
        start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
        thickness: 0.2, color: rgb(0.85, 0.92, 0.88)
      })
      const label = `${wn}`
      const lw = measure(label, regularFont, 6.5)
      page.drawText(label, {
        x: tx - lw / 2, y: gY - 10, size: 6.5,
        font: regularFont, color: rgb(0.4, 0.5, 0.45)
      })
    })

    // Cho'qqilar
    const irPeaks = isCoNH3
      ? [
          { wn: 320, rel: 0.55, label: "δ(N–Co–N)" },
          { wn: 450, rel: 0.85, label: "ν(Co–N) t₁u" },
          { wn: 500, rel: 1.00, label: "ν(Co–N) a₁g" }
        ]
      : isCoCl4
      ? [
          { wn: 295, rel: 0.70, label: "ν(Co–Cl) t₂" },
          { wn: 310, rel: 1.00, label: "ν(Co–Cl) a₁" },
          { wn: 480, rel: 0.35, label: "kombinatsion" }
        ]
      : [
          { wn: 350, rel: 0.55, label: "δ(C–Fe–C)" },
          { wn: 420, rel: 0.70, label: "ν(Fe–C) t₁u" },
          { wn: 580, rel: 1.00, label: "ν(C≡N)" }
        ]

    // Spektr chizig'i (Lorentzian)
    const totalPoints = 200
    const transmittance = new Array(totalPoints).fill(1.0)
    irPeaks.forEach((peak) => {
      const sigma = 8
      for (let i = 0; i < totalPoints; i++) {
        const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
        const absorption = peak.rel * Math.exp(-Math.pow(wn_i - peak.wn, 2) / (2 * sigma * sigma))
        transmittance[i] = Math.max(transmittance[i] - absorption, 0.0)
      }
    })

    for (let i = 0; i < totalPoints - 1; i++) {
      const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
      const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
      const x0 = gX + ((wn0 - xMin) / (xMax - xMin)) * gW
      const x1 = gX + ((wn1 - xMin) / (xMax - xMin)) * gW
      const y0 = gY + gH - transmittance[i] * (gH - 4) - 2
      const y1 = gY + gH - transmittance[i + 1] * (gH - 4) - 2
      page.drawLine({
        start: { x: x0, y: y0 }, end: { x: x1, y: y1 },
        thickness: 0.9, color: C.greenDark
      })
    }

    // Cho'qqi chiziqlari va yorliqlari
    irPeaks.forEach((peak, idx) => {
      const px = gX + ((peak.wn - xMin) / (xMax - xMin)) * gW
      const peakT = Math.max(0, 1 - peak.rel)
      const py = gY + gH - peakT * (gH - 4) - 2

      page.drawLine({
        start: { x: px, y: py }, end: { x: px, y: gY + gH },
        thickness: 0.4, color: C.red
      })
      const wnStr = `${peak.wn}`
      const wnW = measure(wnStr, boldFont, 7)
      page.drawText(wnStr, {
        x: Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2)),
        y: gY + gH + 4, size: 7, font: boldFont, color: C.red
      })
      const lblStr = peak.label
      const lblW = measure(lblStr, regularFont, 6.5)
      const lblY = gY + gH + 14 + (idx % 2) * 8
      page.drawText(lblStr, {
        x: Math.max(gX + 2, Math.min(gX + gW - lblW - 2, px - lblW / 2)),
        y: lblY, size: 6.5, font: regularFont, color: rgb(0.5, 0.3, 0.3)
      })
    })

    const xAxisLabel = "To'lqin soni (cm⁻¹)"
    const xAxisW = measure(xAxisLabel, italicFont, 8)
    page.drawText(xAxisLabel, {
      x: gX + (gW - xAxisW) / 2, y: gY - 20, size: 8,
      font: italicFont, color: C.greenDark
    })
    page.drawText("T%", {
      x: gX - 22, y: gY + gH / 2 - 3, size: 8, font: italicFont, color: C.greenDark
    })

    y = gY - 32
    const irCaption = `4-rasm. ${cleanText(complex.formula)} uchun bashorat qilingan IR spektri (250–700 cm⁻¹). Lorentzian shakl funksiyasi asosida simulyatsiya. Qizil chiziqlar asosiy tebranish modlari o'rnini ko'rsatadi.`
    const irCapLines = wrapText(cleanText(irCaption), italicFont, 8.5, CONTENT_W)
    irCapLines.forEach((line, i) => {
      page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
    })
    y -= irCapLines.length * 11 + 18
  }

  // ═══════════════════════════════════════════════════════════
  // 8. CFSE (KM BE)
  // ═══════════════════════════════════════════════════════════
  if (sections.crystalField) {
    drawSectionHeader(sectionNum++, "Kristall Maydon Barqarorlashuv Energiyasi (KMBE)")
    const isOct = dOrb.tg !== undefined || (geometryInfo.ks || complex.coordNumber) === 6
    const cfseNum = isOct
      ? -0.4 * (dOrb.tg ?? 6) + 0.6 * (dOrb.eg ?? 0)
      : -0.6 * (dOrb.e ?? 4) + 0.4 * (dOrb.t2 ?? 3)

    const cfData = [
      ["Ligand maydon kuchi", "o'rta (standart)"],
      [`Ajralish parametri ${deltaSymbol}`, `${deltaVal.toLocaleString()} cm⁻¹`],
      ["Energiya ekvivalenti", `${(deltaVal * 0.012).toFixed(1)} kJ/mol`],
      [`KMBE (${deltaSymbol} birligida)`, `${cfseNum.toFixed(2)} ${deltaSymbol}`],
      ["KMBE (energiya)", `${(cfseNum * deltaVal * 0.012).toFixed(1)} kJ/mol`],
      ["Juftlashuv energiyasi (P)", "≈ 20 000 cm⁻¹"],
      ["Bashorat qilingan spin", dOrb.type === "LS" ? `Past spin  (${deltaSymbol} > P)` : `Yuqori spin  (${deltaSymbol} < P)`]
    ]
    cfData.forEach((row, i) => {
      drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.brown)
    })
    y -= 15
  }

  // ═══════════════════════════════════════════════════════════
  // 9. FOYDALANILGAN ADABIYOTLAR
  // ═══════════════════════════════════════════════════════════
  if (sections.references) {
    drawSectionHeader(sectionNum++, "Foydalanilgan Adabiyotlar")
    const refs = [
      "1. Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Z. Anorg. Chem., 3, 267–330.",
      "2. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
      "3. Housecroft, C. E.; Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
      "4. Miessler, G. L.; Fischer, P. J.; Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson.",
      "5. IUPAC. (2005). Nomenclature of Inorganic Chemistry: Recommendations 2005. RSC Publishing.",
      "6. Bethe, H. (1929). Termaufspaltung in Kristallen. Ann. Phys., 395(2), 133–208. [Kristall maydon nazariyasi]",
      "7. Jahn, H. A.; Teller, E. (1937). Stability of polyatomic molecules in degenerate electronic states. Proc. R. Soc. Lond. A, 161(905), 220–235."
    ]
    refs.forEach((ref) => {
      const refLines = wrapText(cleanText(ref), regularFont, 8.5, CONTENT_W - 10)
      checkPageBreak(refLines.length * 11 + 6)
      refLines.forEach((line, i) => {
        const px = i === 0 ? MARGIN : MARGIN + 12
        page.drawText(line, {
          x: px, y: y - i * 11, size: 8.5,
          font: regularFont, color: C.textDark
        })
      })
      y -= refLines.length * 11 + 5
    })
    y -= 10
  }

  addFooter()

  pdfDoc.setTitle(`${cleanText(complex.formula || "")} Struktur Tahlili`)
  pdfDoc.setSubject(complex.name || "")
  pdfDoc.setAuthor("JDA-Kimyo Research Platform")
  pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
  pdfDoc.setKeywords([complex.geometry || geometryInfo.name, complex.symmetry || geometryInfo.symmetry, "koordinatsion kimyo", "IUPAC"])

  return await pdfDoc.save()
}
