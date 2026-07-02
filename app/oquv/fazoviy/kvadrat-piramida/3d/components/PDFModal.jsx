"use client"

import { useState } from "react"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import * as THREE from "three"
import { ATOM_INFO } from "../lib/constants"

// ═══════════════════════════════════════════════════════════════════════════
// 📄 PDF EKSPORT MODAL — TRIGONAL-PIRAMIDA UCHUN
// VSEPR nazariyasi, sp³ gibridlanish, AX₃E₁ modeli
// ═══════════════════════════════════════════════════════════════════════════

export default function PDFModal({
  isOpen,
  onClose,
  complex,
  currentComplex,
  rendererRef,
  sceneRef,
  cameraRef,
  controlsRef,
  containerRef,
  viewMode,
  moleculeCount,
  ensembleMode,
  showTemperature,
  temperature,
  showPressure,
  pressure,
  showSolvation,
  solventType,
  solvationDensity,
  computeAllAngles,
}) {
  const [pdfSections, setPdfSections] = useState({
    snapshot: true,
    info: true,
    geometry: true,
    vsepr: true,
    hybridization: true,
    conditions: true,
    spectra: true,
    references: true,
  })
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      // ── Font yuklash ─────────────────────────────────
      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => {
          if (!r.ok) throw new Error("Regular font yuklanmadi")
          return r.arrayBuffer()
        })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => {
          if (!r.ok) throw new Error("Bold font yuklanmadi")
          return r.arrayBuffer()
        })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => {
          if (!r.ok) throw new Error("Italic font yuklanmadi")
          return r.arrayBuffer()
        })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
        console.log("✅ DejaVu Sans fontlari yuklandi")
      } catch (fontErr) {
        console.error("❌ Font yuklashda xato:", fontErr)
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }

      // ── Ranglar ─────────────────────────────────────
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
        cyan: rgb(0.05, 0.50, 0.60),
        brown: rgb(0.71, 0.39, 0.12),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.94),
        bgCyan: rgb(0.94, 0.99, 1.0),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        bgSnapshot: rgb(0.04, 0.02, 0.09),
        white: rgb(1, 1, 1),
        red: rgb(0.80, 0.20, 0.20),
        yellow: rgb(0.95, 0.85, 0.10),
      }

      // ═══════════════════════════════════════════════════════════
      // O'LCHAMLAR — A4 va marginlar
      // ═══════════════════════════════════════════════════════════
      const PAGE_W = 595.28
      const PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30
      const HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      // ═══════════════════════════════════════════════════════════
      // YORDAMCHI FUNKSIYALAR
      // ═══════════════════════════════════════════════════════════
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
          const test = current ? current + " " + word : word
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
          align = "left", maxWidth = null,
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
            size, font, color,
          })
        })
        return lines.length * (size + 3)
      }

      const addFooter = () => {
        const leftText = truncate(
          `Trigonal-Piramida 3D Lab PRO  •  ${cleanText(complex.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, {
          x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray,
        })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, {
          x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8,
          font: regularFont, color: C.textGray,
        })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
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
          x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple,
        })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.purple,
          maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
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
          x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor,
        })
        safeText(label, {
          x: MARGIN + 6, y: y - 13, size: 9,
          font: boldFont, color: labelColor,
          maxWidth: labelW - 8,
        })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, {
          x: valueX, y: y - 13, size: 9,
          font: regularFont, color: C.textDark,
        })
        y -= rowH
      }

      // ═══════════════════════════════════════════════════════════
      // SARLAVHA POLOSASI
      // ═══════════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  Molekulyar Geometriya  •  Vol. 3, Son 1", {
        x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight,
        maxWidth: CONTENT_W * 0.65,
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, align: "right",
        maxWidth: CONTENT_W * 0.3,
      })
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid,
      })
      safeText("VSEPR Nazariyasi va 3D Molekulyar Modellashtirish", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86),
        maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.2026.trig.001", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right",
        maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      // ═══════════════════════════════════════════════════════════
      // TITLE
      // ═══════════════════════════════════════════════════════════
      drawCenteredText(
        `${cleanText(complex.formula)} Struktur Tahlili`,
        y, 20, boldFont, C.textDark
      )
      y -= 28
      drawCenteredText(cleanText(complex.name), y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Geometriya: ${cleanText(complex.geometry)} (${cleanText(complex.symmetry)})  •  Gibridlanish: ${cleanText(complex.hybridization)}  •  Bog' burchagi: ${complex.bondAngle}°`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══════════════════════════════════════════════════════════
      // ANNOTATSIYA
      // ═══════════════════════════════════════════════════════════
      const abstract =
        `${cleanText(complex.formula)} molekulasi ${cleanText(complex.geometry).toLowerCase()} geometriyasiga va ` +
        `${cleanText(complex.symmetry)} nuqtaviy guruhiga ega bo'lgan AX₃E₁ tipidagi VSEPR modelidir. ` +
        `Markaziy ${cleanText(ATOM_INFO[complex.center.element].name.split(" ")[0])} atomi ` +
        `${complex.hybridization} gibridlangan bo'lib, 3 ta ${complex.ligand.type} ligandi bilan ` +
        `${cleanText(complex.bondLengthReal)} masofada bog'langan. ` +
        `Bitta yolg'iz elektron jufti (lone pair) ligandlarni pastga bosadi, natijada ` +
        `ideal tetraedral burchak (109.5°) ${complex.bondAngle}° ga kamayadi. ` +
        `Dipol momenti ${complex.dipoleMoment} ga teng. ` +
        `Bu tahlil Gillespie va Nyholm (1957) VSEPR nazariyasi asosida o'tkazilgan.`

      const absPadding = 12
      const absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)

      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple,
        maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // ═══════════════════════════════════════════════════════════
      // 1. 3D SNAPSHOT
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.snapshot) {
        drawSectionHeader(sectionNum++, "3D Vizualizatsiya (Ko'rinish)")
        const renderer = rendererRef.current
        if (renderer && sceneRef.current && cameraRef.current) {
          const cam = cameraRef.current
          const savedPos = cam.position.clone()
          const savedTarget = controlsRef.current?.target?.clone?.() || new THREE.Vector3()
          const originalPixelRatio = renderer.getPixelRatio()

          renderer.setPixelRatio(2)
          renderer.setSize(1920, 1080)
          cam.aspect = 1920 / 1080
          cam.updateProjectionMatrix()
          cam.position.set(5, 4, 6)
          cam.lookAt(0, 0, 0)
          if (controlsRef.current) controlsRef.current.target.set(0, 0, 0)
          renderer.setClearColor(0x0a0418, 1)
          renderer.render(sceneRef.current, cam)

          const pngDataUrl = renderer.domElement.toDataURL("image/png", 1.0)
          const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer())
          const pngImage = await pdfDoc.embedPng(pngBytes)

          renderer.setPixelRatio(originalPixelRatio)
          const container = containerRef.current
          if (container) {
            renderer.setSize(container.clientWidth, container.clientHeight)
            cam.aspect = container.clientWidth / container.clientHeight
            cam.updateProjectionMatrix()
          }
          cam.position.copy(savedPos)
          if (controlsRef.current) controlsRef.current.target.copy(savedTarget)
          cam.lookAt(savedTarget)
          renderer.render(sceneRef.current, cam)

          const imgW = CONTENT_W
          const imgH = imgW * (1080 / 1920)
          checkPageBreak(imgH + 40)

          page.drawRectangle({
            x: MARGIN, y: y - imgH, width: imgW, height: imgH,
            color: C.bgSnapshot, borderColor: C.purpleMid, borderWidth: 1.5,
          })
          page.drawImage(pngImage, {
            x: MARGIN + 2, y: y - imgH + 2, width: imgW - 4, height: imgH - 4,
          })
          y -= imgH + 10

          const caption =
            `1-rasm. ${cleanText(complex.formula)} ning ` +
            `${viewMode === "ball-stick" ? "shar-tayoqcha" : viewMode === "space-filling" ? "fazo to'ldiruvchi (CPK)" : "karkas"} ` +
            `ko'rinishidagi 3D modeli. Trigonal-piramidal ${cleanText(complex.symmetry)} simmetriya. ` +
            `Sariq lobe tepada — yolg'iz elektron jufti. ` +
            `${moleculeCount > 1 ? `${moleculeCount} ta molekula ${ensembleMode} ansamblida.` : "Bitta molekula."}`
          const capLines = wrapText(cleanText(caption), italicFont, 8.5, CONTENT_W)
          capLines.forEach((line, i) => {
            page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
          })
          y -= capLines.length * 11 + 18
        }
      }

      // ═══════════════════════════════════════════════════════════
      // 2. BIRIKMA IDENTIFIKATSIYASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.info) {
        drawSectionHeader(sectionNum++, "Molekula Identifikatsiyasi")
        const infoTable = [
          ["Kimyoviy formula", complex.formula],
          ["IUPAC nomi", complex.name],
          ["Molekulyar massa", complex.molecularWeight],
          ["Geometriya", complex.geometry],
          ["Nuqtaviy guruh", complex.symmetry],
          ["Gibridlanish", complex.hybridization],
          ["VSEPR tipi", "AX₃E₁ (trigonal-piramida)"],
          ["Bog' burchagi (L–M–L)", `${complex.bondAngle}°`],
          ["Bog' uzunligi", complex.bondLengthReal],
          ["Dipol momenti", complex.dipoleMoment],
          ["Qaynash harorati", complex.boilingPoint],
          ["Magnit xossasi", complex.magnetism],
          ["Rangi (qattiq/suyuq)", complex.color],
          ["Yolg'iz juftlar soni", `${complex.lonePairs} ta`],
        ]
        infoTable.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
        })
        y -= 15
      }

      // ═══════════════════════════════════════════════════════════
      // 3. MOLEKULYAR GEOMETRIYA
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.geometry) {
        drawSectionHeader(sectionNum++, "Molekulyar Geometriya")
        const angles = computeAllAngles()
        const geomData = [
          [`M–${complex.ligand.donor} bog' uzunligi`, complex.bondLengthReal],
          ["L–M–L burchagi (haqiqiy)", `${complex.boundAngle || complex.bondAngle}°`],
          ["L–M–L burchagi (ideal tetraedral)", "109.5°"],
          ["Burchak og'ishi", `${(109.5 - complex.bondAngle).toFixed(1)}° (yolg'iz juft tufayli)`],
          ["Hisoblangan cis burchaklar", angles.length > 0 ? `${angles.length} × ${angles[0]?.angle || "—"}°` : "—"],
          ["Lone pair – M – L burchagi", "> 109.5° (VSEPR bashorati)"],
          ["Asos tekisligi radiusi", "r = d · sin(α)"],
          ["Ideal C₃ᵥ dan og'ish (RMSD)", "< 0.001 Å"],
        ]
        geomData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgOrange : C.white, C.orangeSoft)
        })
        y -= 15

        // Burchak tahlili tushuntirishi
        checkPageBreak(50)
        page.drawRectangle({
          x: MARGIN, y: y - 45, width: CONTENT_W, height: 45,
          color: C.bgYellow, borderColor: C.orange, borderWidth: 0.5,
        })
        safeText("💡 Tahlil:", {
          x: MARGIN + 8, y: y - 12, size: 10, font: boldFont, color: C.orangeDeep,
        })
        const analysis =
          `Yolg'iz elektron jufti (lone pair) bog'lanish juftlariga qaraganda ko'proq joy egallaydi, ` +
          `chunki u faqat bitta atom yadrosi tomonidan tortiladi. Bu ligandlarni pastga bosib, ` +
          `burchakni ideal tetraedral burchakdan (109.5°) ${complex.bondAngle}° ga kichraytiradi.`
        const analysisLines = wrapText(cleanText(analysis), italicFont, 9, CONTENT_W - 20)
        analysisLines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN + 8, y: y - 25 - i * 11, size: 9, font: italicFont, color: C.textDark,
          })
        })
        y -= 55
      }

      // ═══════════════════════════════════════════════════════════
      // 4. VSEPR NAZARIYASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.vsepr) {
        drawSectionHeader(sectionNum++, "VSEPR Nazariyasi (Valence Shell Electron Pair Repulsion)")
        checkPageBreak(180)

        // VSEPR modeli — diagramma
        const diagX = MARGIN + 30
        const diagW = 200
        const diagH = 140
        const diagY = y - diagH

        // Fon
        page.drawRectangle({
          x: diagX, y: diagY, width: diagW, height: diagH,
          color: C.bgCyan, borderColor: C.cyan, borderWidth: 1,
        })

        // Markaz (A atomi)
        const centerX = diagX + diagW / 2
        const centerY = diagY + diagH / 2
        page.drawCircle({
          x: centerX, y: centerY, size: 12,
          color: C.purple, borderColor: C.purpleDark, borderWidth: 1.5,
        })
        page.drawText("A", {
          x: centerX - 3, y: centerY - 4, size: 11, font: boldFont, color: C.white,
        })

        // 3 ta ligand (pastda, 120° oraliqda)
        const ligandDist = 50
        const bondAngleRad = (complex.bondAngle * Math.PI) / 180
        // Trigonal-piramida: ligandlar pastda, y = -h, radius = r
        const h = ligandDist * Math.cos((Math.PI - bondAngleRad) / 2)
        const r = ligandDist * Math.sin((Math.PI - bondAngleRad) / 2)

        for (let i = 0; i < 3; i++) {
          const phi = (i * 2 * Math.PI) / 3
          const lx = centerX + r * Math.cos(phi)
          const ly = centerY - h + r * Math.sin(phi) * 0.3 // perspektiva

          // Bog'
          page.drawLine({
            start: { x: centerX, y: centerY },
            end: { x: lx, y: ly },
            thickness: 2, color: C.orange,
          })

          // Ligand atomi
          page.drawCircle({
            x: lx, y: ly, size: 8,
            color: C.orange, borderColor: C.orangeDeep, borderWidth: 1,
          })
          page.drawText("X", {
            x: lx - 3, y: ly - 3, size: 9, font: boldFont, color: C.white,
          })
        }

        // Yolg'iz juft (tepada)
        const lpX = centerX
        const lpY = centerY + 45
        page.drawEllipse({
          x: lpX, y: lpY, xScale: 15, yScale: 10,
          color: C.yellow, borderColor: C.orangeDeep, borderWidth: 1,
        })
        page.drawText("••", {
          x: lpX - 5, y: lpY - 3, size: 11, font: boldFont, color: C.orangeDeep,
        })

        // LP–A bog' (chiziqli)
        page.drawLine({
          start: { x: centerX, y: centerY + 12 },
          end: { x: lpX, y: lpY - 10 },
          thickness: 1.5, color: C.orangeDeep, dashArray: [3, 2],
        })

        // Yorliqlar
        page.drawText("Yolg'iz juft (E)", {
          x: lpX + 18, y: lpY - 3, size: 9, font: italicFont, color: C.orangeDeep,
        })
        page.drawText("3 ta bog' jufti (X₃)", {
          x: centerX + r + 15, y: centerY - h + 5, size: 9, font: italicFont, color: C.orange,
        })

        // Burchak ko'rsatkichi
        const angleArcX = centerX - 25
        const angleArcY = centerY - 15
        page.drawText(`${complex.bondAngle}°`, {
          x: angleArcX, y: angleArcY, size: 10, font: boldFont, color: C.red,
        })

        // O'ng tomondagi ma'lumotlar
        const infoX = diagX + diagW + 20
        const infoMaxW = PAGE_W - MARGIN - infoX

        safeText("AX₃E₁ Modeli", {
          x: infoX, y: y - 15, size: 11, font: boldFont, color: C.purple,
          maxWidth: infoMaxW,
        })
        safeText(`A: ${complex.center.element} (markaziy atom)`, {
          x: infoX, y: y - 30, size: 9, font: regularFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText(`X₃: 3 ta ${complex.ligand.type} ligandi`, {
          x: infoX, y: y - 43, size: 9, font: regularFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText("E₁: 1 ta yolg'iz elektron jufti", {
          x: infoX, y: y - 56, size: 9, font: regularFont, color: C.orangeDeep,
          maxWidth: infoMaxW,
        })
        safeText(`Jami: 4 ta elektron jufti`, {
          x: infoX, y: y - 72, size: 10, font: boldFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText("→ sp³ gibridlanish", {
          x: infoX, y: y - 87, size: 9, font: italicFont, color: C.purple,
          maxWidth: infoMaxW,
        })
        safeText(`Burchak: ${complex.bondAngle}° < 109.5°`, {
          x: infoX, y: y - 102, size: 9, font: regularFont, color: C.red,
          maxWidth: infoMaxW,
        })
        safeText("(LP kuchliroq itaradi)", {
          x: infoX, y: y - 115, size: 8, font: italicFont, color: C.textMuted,
          maxWidth: infoMaxW,
        })

        // Qaytarish kuchlari tartibi
        safeText("Itarish kuchlari:", {
          x: infoX, y: y - 132, size: 9, font: boldFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText("LP–LP > LP–BP > BP–BP", {
          x: infoX, y: y - 145, size: 9, font: italicFont, color: C.red,
          maxWidth: infoMaxW,
        })

        y = diagY - 15

        // Caption
        const vseprCaption =
          `2-rasm. ${cleanText(complex.formula)} uchun VSEPR modeli (AX₃E₁). ` +
          `4 ta elektron jufti (3 ta bog' + 1 ta yolg'iz juft) sp³ gibridlanishga ega. ` +
          `Yolg'iz juft kuchliroq itarish kuchi bilan ligandlarni pastga bosib, ` +
          `burchakni ideal tetraedral burchakdan ${complex.bondAngle}° ga kichraytiradi.`
        const vseprCapLines = wrapText(cleanText(vseprCaption), italicFont, 8.5, CONTENT_W)
        vseprCapLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= vseprCapLines.length * 11 + 18
      }

      // ═══════════════════════════════════════════════════════════
      // 5. sp³ GIBRIDLASH DIAGRAMMASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.hybridization) {
        drawSectionHeader(sectionNum++, "sp³ Gibridlanish Diagrammasi")
        checkPageBreak(180)

        // Diagramma joylashuvi
        const diagX = MARGIN + 20
        const colW = 60
        const arrowW = 25
        const diagY = y - 130

        // Ustunlar: s | p (3 ta) | → | sp³ (4 ta)
        const sX = diagX
        const pX = diagX + colW + arrowW
        const sp3X = pX + colW * 3 + arrowW + 10

        // Ustun sarlavhalari
        page.drawText("s", {
          x: sX + colW / 2 - 3, y: y - 10, size: 11, font: boldFont, color: C.purple,
        })
        page.drawText("p", {
          x: pX + colW * 1.5 - 3, y: y - 10, size: 11, font: boldFont, color: C.purple,
        })
        page.drawText("sp³", {
          x: sp3X + colW * 2 - 6, y: y - 10, size: 11, font: boldFont, color: C.orangeDeep,
        })

        // Orbital chiziqlari
        const lineY = diagY + 60
        const orbLineW = 45

        // s orbital (1 ta)
        page.drawLine({
          start: { x: sX + (colW - orbLineW) / 2, y: lineY },
          end: { x: sX + (colW + orbLineW) / 2, y: lineY },
          thickness: 2, color: C.purple,
        })
        // 2 ta elektron
        page.drawText("↑↓", {
          x: sX + colW / 2 - 5, y: lineY + 5, size: 11, font: boldFont, color: C.orange,
        })

        // p orbitallar (3 ta)
        for (let i = 0; i < 3; i++) {
          const px = pX + i * colW + (colW - orbLineW) / 2
          page.drawLine({
            start: { x: px, y: lineY },
            end: { x: px + orbLineW, y: lineY },
            thickness: 2, color: C.purple,
          })
          // Har birida 1 ta elektron (Azot uchun: 2s² 2p³)
          page.drawText("↑", {
            x: px + orbLineW / 2 - 2, y: lineY + 5, size: 11, font: boldFont, color: C.orange,
          })
        }

        // → strelka
        const arrowX1 = sX + colW + 5
        const arrowX2 = pX - 10
        page.drawLine({
          start: { x: arrowX1, y: lineY },
          end: { x: arrowX2, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })
        page.drawLine({
          start: { x: arrowX2 - 5, y: lineY + 3 },
          end: { x: arrowX2, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })
        page.drawLine({
          start: { x: arrowX2 - 5, y: lineY - 3 },
          end: { x: arrowX2, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })

        // Ikkinchi strelka (p → sp³)
        const arrowX3 = pX + colW * 3 + 5
        const arrowX4 = sp3X - 5
        page.drawLine({
          start: { x: arrowX3, y: lineY },
          end: { x: arrowX4, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })
        page.drawLine({
          start: { x: arrowX4 - 5, y: lineY + 3 },
          end: { x: arrowX4, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })
        page.drawLine({
          start: { x: arrowX4 - 5, y: lineY - 3 },
          end: { x: arrowX4, y: lineY },
          thickness: 1.5, color: C.textMuted,
        })

        // sp³ orbitallar (4 ta)
        for (let i = 0; i < 4; i++) {
          const px = sp3X + i * colW + (colW - orbLineW) / 2
          page.drawLine({
            start: { x: px, y: lineY },
            end: { x: px + orbLineW, y: lineY },
            thickness: 2, color: C.orangeDeep,
          })
          // 3 tasi bog' (1 ta elektron), 1 tasi lone pair (2 elektron)
          if (i < 3) {
            page.drawText("↑", {
              x: px + orbLineW / 2 - 2, y: lineY + 5, size: 11, font: boldFont, color: C.orange,
            })
          } else {
            page.drawText("↑↓", {
              x: px + orbLineW / 2 - 5, y: lineY + 5, size: 11, font: boldFont, color: C.orange,
            })
          }
        }

        // Yorliqlar
        page.drawText("Atom", {
          x: sX + colW / 2 - 10, y: lineY - 25, size: 9, font: italicFont, color: C.textMuted,
        })
        page.drawText("Gibrid", {
          x: sp3X + colW * 2 - 10, y: lineY - 25, size: 9, font: italicFont, color: C.orangeDeep,
        })
        page.drawText("bog'", {
          x: sp3X + colW * 0.5 - 5, y: lineY + 25, size: 8, font: regularFont, color: C.textMuted,
        })
        page.drawText("LP", {
          x: sp3X + colW * 3.5 - 5, y: lineY + 25, size: 8, font: regularFont, color: C.orangeDeep,
        })

        // O'ng tomondagi ma'lumotlar
        const infoX = sp3X + colW * 4 + 20
        const infoMaxW = PAGE_W - MARGIN - infoX

        safeText("Gibridlanish xususiyatlari:", {
          x: infoX, y: y - 15, size: 10, font: boldFont, color: C.purple,
          maxWidth: infoMaxW,
        })
        safeText(`• Tipi: ${complex.hybridization}`, {
          x: infoX, y: y - 30, size: 9, font: regularFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText("• Geometriya: tetraedral asos", {
          x: infoX, y: y - 43, size: 9, font: regularFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText(`• Ideal burchak: 109.5°`, {
          x: infoX, y: y - 56, size: 9, font: regularFont, color: C.textDark,
          maxWidth: infoMaxW,
        })
        safeText(`• Haqiqiy: ${complex.bondAngle}°`, {
          x: infoX, y: y - 69, size: 9, font: regularFont, color: C.red,
          maxWidth: infoMaxW,
        })
        safeText("• 3 ta bog' + 1 ta LP", {
          x: infoX, y: y - 85, size: 9, font: boldFont, color: C.orangeDeep,
          maxWidth: infoMaxW,
        })

        y = diagY - 20

        // Caption
        const hybCaption =
          `3-rasm. ${cleanText(complex.formula)} uchun sp³ gibridlanish diagrammasi. ` +
          `Markaziy atomning 1 ta s va 3 ta p orbitallari aralashib, ` +
          `4 ta ekvivalent sp³ gibrid orbital hosil qiladi. ` +
          `Ulardan 3 tasi ligandlar bilan bog'lanadi, 1 tasi yolg'iz juftni saqlaydi.`
        const hybCapLines = wrapText(cleanText(hybCaption), italicFont, 8.5, CONTENT_W)
        hybCapLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= hybCapLines.length * 11 + 18
      }

      // ═══════════════════════════════════════════════════════════
      // 6. SIMULYATSIYA SHAROITLARI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.conditions) {
        drawSectionHeader(sectionNum++, "Simulyatsiya Sharoitlari")
        const cond = [
          ["Molekulalar soni", `${moleculeCount}`],
          ["Ansambl rejimi", ensembleMode === "crystal" ? "Kristall panjara" : "Eritma"],
          ["Vizualizatsiya rejimi", viewMode === "ball-stick" ? "Shar-tayoqcha" : viewMode === "space-filling" ? "Fazo to'ldiruvchi (CPK)" : "Karkas"],
        ]
        if (showTemperature) cond.push(["Temperatura", `${temperature} K  (${(temperature - 273).toFixed(0)} °C)`])
        if (showPressure) cond.push(["Bosim", `${pressure.toLocaleString()} atm`])
        if (showSolvation) {
          cond.push(["Erituvchi", solventType])
          cond.push(["Solvatatsiya qobig'i", `${solvationDensity} ta molekula`])
        }
        cond.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue)
        })
        y -= 15
      }

      // ═══════════════════════════════════════════════════════════
      // 7. SPEKTROSKOPIK MA'LUMOTLAR + IR GRAFIK
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.spectra) {
        drawSectionHeader(sectionNum++, "Bashorat qilingan Spektroskopik Ma'lumotlar")
        const specData = [
          ["IR (M–X tebranish)", "400–800 cm⁻¹"],
          ["Simmetrik cho'zilish (a₁)", "≈ 3300 cm⁻¹ (NH₃)"],
          ["Asimmetrik cho'zilish (e)", "≈ 3400 cm⁻¹ (NH₃)"],
          ["Egilish tebranishi (e)", "≈ 1600 cm⁻¹"],
          ["Umbrella mode (a₁)", "≈ 950 cm⁻¹ (NH₃ uchun)"],
          ["NMR (¹H)", currentComplex === "NH3" ? "0.25 ppm" : currentComplex === "NF3" ? "— ppm" : "— ppm"],
          ["Dipol momenti", complex.dipoleMoment],
        ]
        specData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgGreen : C.white, C.green)
        })
        y -= 12

        // IR SPEKTR GRAFIGI
        const graphNeed = 190
        checkPageBreak(graphNeed)
        safeText("IR Spektr (simulyatsiya, 400–4000 cm⁻¹ oralig'i)", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.greenDark,
          maxWidth: CONTENT_W,
        })
        y -= 15

        const gLeftPad = 32
        const gBotPad = 22
        const gTopPad = 28
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 100
        const gY = y - gH - gTopPad
        const xMin = 400, xMax = 4000

        // Fon
        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(0.98, 1.0, 0.99), borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 0.5,
        })

        // Y grid + belgilar (T% 0-100)
        for (let tick = 0; tick <= 100; tick += 25) {
          const ty = gY + (tick / 100) * gH
          if (tick > 0 && tick < 100) {
            page.drawLine({
              start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
              thickness: 0.2, color: rgb(0.85, 0.92, 0.88),
            })
          }
          const label = `${tick}`
          const lw = measure(label, regularFont, 6.5)
          page.drawText(label, {
            x: gX - lw - 4, y: ty - 2.5, size: 6.5,
            font: regularFont, color: rgb(0.4, 0.5, 0.45),
          })
        }

        // X grid + belgilar
        const xTicks = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]
        xTicks.forEach(wn => {
          const tx = gX + ((wn - xMin) / (xMax - xMin)) * gW
          page.drawLine({
            start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
            thickness: 0.2, color: rgb(0.85, 0.92, 0.88),
          })
          if (wn % 1000 === 0) {
            const label = `${wn}`
            const lw = measure(label, regularFont, 6.5)
            page.drawText(label, {
              x: tx - lw / 2, y: gY - 10, size: 6.5,
              font: regularFont, color: rgb(0.4, 0.5, 0.45),
            })
          }
        })

        // IR cho'qqilari (NH₃ uchun)
        const irPeaks = currentComplex === "NH3"
          ? [
              { wn: 950, rel: 0.60, label: "umbrella" },
              { wn: 1627, rel: 0.75, label: "δ(NH₂)" },
              { wn: 3337, rel: 0.85, label: "νₛ(NH)" },
              { wn: 3414, rel: 1.00, label: "νₐ(NH)" },
            ]
          : currentComplex === "NF3"
          ? [
              { wn: 494, rel: 0.60, label: "δ(NF₂)" },
              { wn: 909, rel: 0.85, label: "νₛ(NF)" },
              { wn: 1030, rel: 1.00, label: "νₐ(NF)" },
            ]
          : [
              { wn: 490, rel: 0.70, label: "δ(PCl₂)" },
              { wn: 503, rel: 0.85, label: "νₛ(PCl)" },
              { wn: 582, rel: 1.00, label: "νₐ(PCl)" },
            ]

        // Spektr chizig'i (Lorentzian)
        const totalPoints = 300
        const transmittance = new Array(totalPoints).fill(1.0)
        irPeaks.forEach(peak => {
          const sigma = 25
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
            thickness: 0.9, color: C.greenDark,
          })
        }

        // Cho'qqi belgilari
        irPeaks.forEach((peak, idx) => {
          const px = gX + ((peak.wn - xMin) / (xMax - xMin)) * gW
          const peakT = Math.max(0, 1 - peak.rel)
          const py = gY + gH - peakT * (gH - 4) - 2
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: 0.4, color: C.red,
          })
          const wnStr = `${peak.wn}`
          const wnW = measure(wnStr, boldFont, 7)
          page.drawText(wnStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2)),
            y: gY + gH + 4, size: 7, font: boldFont, color: C.red,
          })
          const lblStr = peak.label
          const lblW = measure(lblStr, regularFont, 6.5)
          const lblY = gY + gH + 14 + (idx % 2) * 8
          page.drawText(lblStr, {
            x: Math.max(gX + 2, Math.min(gX + gW - lblW - 2, px - lblW / 2)),
            y: lblY, size: 6.5, font: regularFont, color: rgb(0.5, 0.3, 0.3),
          })
        })

        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 8)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY - 20, size: 8,
          font: italicFont, color: C.greenDark,
        })
        page.drawText("T%", {
          x: gX - 22, y: gY + gH / 2 - 3, size: 8, font: italicFont, color: C.greenDark,
        })

        y = gY - 32

        const irCaption = `4-rasm. ${cleanText(complex.formula)} uchun bashorat qilingan IR spektri (400–4000 cm⁻¹). Lorentzian shakl funksiyasi asosida simulyatsiya.`
        const irCapLines = wrapText(cleanText(irCaption), italicFont, 8.5, CONTENT_W)
        irCapLines.forEach((line, i) => {
          page.drawText(line, { x: MARGIN, y: y - i * 11, size: 8.5, font: italicFont, color: C.purpleSoft })
        })
        y -= irCapLines.length * 11 + 18
      }

      // ═══════════════════════════════════════════════════════════
      // 8. ADABIYOTLAR
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.references) {
        drawSectionHeader(sectionNum++, "Foydalanilgan Adabiyotlar")
        const refs = [
          "1. Gillespie, R. J.; Nyholm, R. S. (1957). Inorganic stereochemistry. Quart. Rev. Chem. Soc., 11, 339–380. [VSEPR asoschilari]",
          "2. Cotton, F. A.; Wilkinson, G.; Murillo, C. A.; Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
          "3. Housecroft, C. E.; Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
          "4. Miessler, G. L.; Fischer, P. J.; Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson.",
          "5. IUPAC. (2005). Nomenclature of Inorganic Chemistry: Recommendations 2005. RSC Publishing.",
          "6. Pauling, L. (1960). The Nature of the Chemical Bond, 3rd ed. Cornell University Press. [Gibridlanish nazariyasi]",
          "7. Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Z. Anorg. Chem., 3, 267–330.",
        ]
        refs.forEach(ref => {
          const refLines = wrapText(cleanText(ref), regularFont, 8.5, CONTENT_W - 10)
          checkPageBreak(refLines.length * 11 + 6)
          refLines.forEach((line, i) => {
            const px = i === 0 ? MARGIN : MARGIN + 12
            page.drawText(line, {
              x: px, y: y - i * 11, size: 8.5,
              font: regularFont, color: C.textDark,
            })
          })
          y -= refLines.length * 11 + 5
        })
        y -= 10
      }

      addFooter()

      pdfDoc.setTitle(`${cleanText(complex.formula)} Struktur Tahlili`)
      pdfDoc.setSubject(complex.name)
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Trigonal-Piramida 3D Lab")
      pdfDoc.setKeywords([complex.geometry, complex.symmetry, "VSEPR", "sp³ gibridlanish", "IUPAC"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onClose()
    } catch (err) {
      console.error("PDF yaratishda xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={() => !pdfGenerating && onClose()}
    >
      <div
        className="bg-gradient-to-br from-purple-950/98 via-indigo-950/98 to-purple-950/98 rounded-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-500/20 max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b-2 border-purple-500/30 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">📄</div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Ilmiy Hisobot
                  <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30 font-mono">v3.0</span>
                </h2>
                <p className="text-xs text-purple-300">{cleanText(complex.formula)} • {new Date().toLocaleDateString("uz-UZ")}</p>
              </div>
            </div>
            <button
              onClick={() => !pdfGenerating && onClose()}
              disabled={pdfGenerating}
              className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all disabled:opacity-30 flex items-center justify-center"
            >✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* STATISTIKA */}
          <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
            <div className="text-xs text-yellow-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
              <span>📊</span> Hisobot statistikasi
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  {Object.values(pdfSections).filter(Boolean).length}
                </div>
                <div className="text-xs text-yellow-200/70 mt-0.5">Bo'lim</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  ~{Math.max(1, Math.ceil(Object.values(pdfSections).filter(Boolean).length * 0.7))}
                </div>
                <div className="text-xs text-yellow-200/70 mt-0.5">Sahifa</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">A4</div>
                <div className="text-xs text-yellow-200/70 mt-0.5">Format</div>
              </div>
            </div>
          </div>

          {/* TEZKOR TANLASH */}
          <div>
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
              <span>⚡</span> Tezkor tanlash
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPdfSections({
                  snapshot: true, info: true, conditions: true,
                  geometry: true, vsepr: true, hybridization: true,
                  spectra: false, references: false,
                })}
                className="py-2 px-3 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-lg text-xs text-purple-100 font-semibold transition-all"
              >📄 Standart</button>
              <button
                onClick={() => setPdfSections({
                  snapshot: true, info: true, conditions: true,
                  geometry: true, vsepr: true, hybridization: true,
                  spectra: true, references: true,
                })}
                className="py-2 px-3 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 hover:from-yellow-500/50 hover:to-orange-500/50 border border-yellow-500/40 rounded-lg text-xs text-yellow-100 font-semibold transition-all"
              >📚 To'liq (ilmiy)</button>
              <button
                onClick={() => setPdfSections({
                  snapshot: false, info: false, conditions: false,
                  geometry: false, vsepr: false, hybridization: false,
                  spectra: false, references: false,
                })}
                className="py-2 px-3 bg-red-900/30 hover:bg-red-800/40 border border-red-700/40 rounded-lg text-xs text-red-200 font-semibold transition-all"
              >✕ Tozalash</button>
            </div>
          </div>

          {/* BO'LIMLAR RO'YXATI */}
          <div>
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
              <span>📋</span> Hisobot bo'limlari
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { key: "snapshot", icon: "📸", label: "3D Vizualizatsiya", desc: "Yuqori sifatli snapshot (1920×1080)" },
                { key: "info", icon: "📋", label: "Molekula identifikatsiyasi", desc: "Formula, VSEPR tipi, xossalar" },
                { key: "geometry", icon: "📐", label: "Molekulyar geometriya", desc: "Burchaklar, masofalar, burchak og'ishi" },
                { key: "vsepr", icon: "🔺", label: "VSEPR diagramma", desc: "AX₃E₁ modeli, yolg'iz juft", highlight: true },
                { key: "hybridization", icon: "⚛️", label: "sp³ gibridlanish", desc: "Orbital aralashuvi diagrammasi", highlight: true },
                { key: "conditions", icon: "🧪", label: "Simulyatsiya shartlari", desc: "T, P, erituvchi" },
                { key: "spectra", icon: "📡", label: "IR spektr grafik", desc: "Tebranish modlari, cho'qqilar" },
                { key: "references", icon: "📚", label: "Adabiyotlar", desc: "7 ta ilmiy manba (Gillespie, Pauling, Werner)", highlight: true },
              ].map(item => (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    pdfSections[item.key]
                      ? item.highlight
                        ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                        : 'bg-gradient-to-br from-purple-700/40 to-indigo-700/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={pdfSections[item.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [item.key]: e.target.checked })}
                    className={`mt-1 w-4 h-4 cursor-pointer flex-shrink-0 ${
                      item.highlight ? 'accent-yellow-500' : 'accent-purple-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold flex items-center gap-2 ${
                      pdfSections[item.key]
                        ? item.highlight ? 'text-yellow-200' : 'text-purple-100'
                        : 'text-purple-300'
                    }`}>
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.highlight && pdfSections[item.key] && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/30 text-yellow-200 rounded-full border border-yellow-500/40 font-mono">
                          MUHIM
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      pdfSections[item.key] ? 'text-purple-200/80' : 'text-purple-400/70'
                    }`}>
                      {item.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Maslahat */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <strong className="text-blue-100">Maslahat:</strong> Ilmiy ish uchun "To'liq (ilmiy)" variantini tanlang.
              VSEPR va sp³ gibridlanish diagrammalari trigonal-piramida geometriyasini to'liq tushuntiradi.
            </div>
          </div>

          {/* TUGMALAR */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={pdfGenerating}
              className="flex-1 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 font-semibold transition-all border border-purple-700/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Bekor qilish
            </button>
            <button
              onClick={generatePDF}
              disabled={pdfGenerating || Object.values(pdfSections).filter(Boolean).length === 0}
              className="flex-[1.5] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-400/30"
            >
              {pdfGenerating ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Yaratilmoqda...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">⬇️</span>
                  <span>Ilmiy hisobotni yuklab olish</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-purple-400 text-center font-mono pt-1">
            📁 {cleanText(complex.formula).replace(/[^a-zA-Z0-9]/g, "_")}_hisobot_{new Date().toISOString().slice(0, 10)}.pdf
          </p>
        </div>
      </div>
    </div>
  )
}