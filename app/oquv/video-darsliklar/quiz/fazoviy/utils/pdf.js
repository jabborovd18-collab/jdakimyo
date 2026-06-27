// app/oquv/video-darsliklar/quiz/(mavzu)/utils/pdf.js

import { jsPDF } from "jspdf"

/**
 * ════════════════════════════════════════════════════════════
 * JDA KIMYO — Quiz natijasi PDF generatori
 * ════════════════════════════════════════════════════════════
 * Faqat jsPDF (html2canvas YO'Q). Tezkor, yengil, har qanday
 * brauzerda barqaror ishlaydi.
 *
 * Rang sxemasi — JDA KIMYO logotipidan: teal → purple → magenta
 *
 * Ishlatish:
 *   import { generateQuizPDF } from "../utils/pdf"
 *   generateQuizPDF({ userName, answers, questions, elapsedTime, quizName })
 * ════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────
// Rang sxemasi (RGB massivlari, jsPDF uchun)
// ──────────────────────────────────────────────────────────
const COLORS = {
  bg: [10, 14, 26],            // #0A0E1A — sahifa foni
  bgPanel: [16, 21, 38],       // #101526 — karta/panel foni
  border: [26, 32, 53],        // #1A2035 — nozik chegaralar

  teal: [34, 211, 238],        // #22D3EE
  purple: [168, 85, 247],      // #A855F7
  magenta: [236, 72, 153],     // #EC4899

  success: [45, 212, 191],     // #2DD4BF — to'g'ri javoblar
  danger: [244, 63, 94],       // #F43F5E — xato javoblar

  textPrimary: [241, 245, 249],  // #F1F5F9
  textSecondary: [148, 163, 184],// #94A3B8
  textMuted: [58, 64, 85],       // #3A4055

  white: [255, 255, 255],
}

// Daraja bo'yicha rang va xabar
function getGrade(percentage) {
  if (percentage >= 90) return { grade: "A+", color: COLORS.success, message: "Mukammal natija!" }
  if (percentage >= 80) return { grade: "A", color: COLORS.success, message: "Ajoyib natija!" }
  if (percentage >= 70) return { grade: "B", color: COLORS.purple, message: "Yaxshi natija!" }
  if (percentage >= 60) return { grade: "C", color: COLORS.teal, message: "Qoniqarli" }
  if (percentage >= 50) return { grade: "D", color: [251, 191, 36], message: "Harakat qilish kerak" }
  return { grade: "F", color: COLORS.danger, message: "Qayta o'rganish talab etiladi" }
}

// Ikki rang orasida chiziqli interpolatsiya
function mixColor(c1, c2, t) {
  return [
    c1[0] + (c2[0] - c1[0]) * t,
    c1[1] + (c2[1] - c1[1]) * t,
    c1[2] + (c2[2] - c1[2]) * t,
  ]
}

// Berilgan blokda shaffoflik bilan ishlash (GState orqali, xavfsiz restore bilan)
function withOpacity(doc, opacity, fn) {
  doc.saveGraphicsState()
  doc.setGState(new doc.GState({ opacity }))
  fn()
  doc.restoreGraphicsState()
}

// Gorizontal gradient chizish (rect ichida, kichik bo'lakchalar bilan)
function drawHorizontalGradient(doc, x, y, w, h, colorStart, colorEnd, steps = 60) {
  const stepW = w / steps
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const [r, g, b] = mixColor(colorStart, colorEnd, t)
    doc.setFillColor(r, g, b)
    doc.rect(x + i * stepW, y, stepW + 0.2, h, "F")
  }
}

// Aylana progress-ring — kichik nuqtalar zanjiri orqali (har qanday jsPDF versiyasida ishonchli)
function drawProgressRing(doc, cx, cy, radius, percentage, trackColor, colorStart, colorEnd) {
  const dotR = 1.6
  const trackSteps = 120
  for (let i = 0; i < trackSteps; i++) {
    const angle = (i / trackSteps) * 360 - 90
    const rad = (angle * Math.PI) / 180
    doc.setFillColor(...trackColor)
    doc.circle(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad), dotR, "F")
  }
  if (percentage > 0) {
    const progressSteps = Math.max(2, Math.round((percentage / 100) * trackSteps))
    for (let i = 0; i <= progressSteps; i++) {
      const t = i / progressSteps
      const angle = t * (percentage / 100) * 360 - 90
      const rad = (angle * Math.PI) / 180
      const [r, g, b] = mixColor(colorStart, colorEnd, t)
      doc.setFillColor(r, g, b)
      doc.circle(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad), dotR + 0.3, "F")
    }
  }
}

// Statistika kartasi (To'g'ri / Xato / Jami)
function drawStatCard(doc, x, y, w, h, value, label, color) {
  doc.setFillColor(...COLORS.bgPanel)
  doc.roundedRect(x, y, w, h, 3, 3, "F")
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.4)
  doc.roundedRect(x, y, w, h, 3, 3, "S")

  doc.setFontSize(24)
  doc.setTextColor(...color)
  doc.setFont("helvetica", "bold")
  doc.text(String(value), x + w / 2, y + h / 2 + 2, { align: "center" })

  doc.setFontSize(8)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text(label.toUpperCase(), x + w / 2, y + h - 6, { align: "center" })
}

/**
 * @param {Object} params
 * @param {string} params.userName
 * @param {Array}  params.answers     - [{ isCorrect, ... }]
 * @param {Array}  params.questions
 * @param {number} params.elapsedTime - soniyalarda
 * @param {string} [params.quizName]
 */
export function generateQuizPDF({
  userName,
  answers = [],
  questions = [],
  elapsedTime = 0,
  quizName = "Nomlanish",
}) {
  if (!userName) throw new Error("generateQuizPDF: 'userName' talab qilinadi")

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const PAGE_W = 210
  const PAGE_H = 297

  const totalQuestions = questions.length || answers.length || 0
  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.filter((a) => !a.isCorrect).length
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const timeString = `${minutes} daqiqa ${seconds} soniya`

  const currentDate = new Date().toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const { grade, color: gradeColor, message } = getGrade(percentage)

  // ──────────────────────────────────────────────────────────
  // FON
  // ──────────────────────────────────────────────────────────
  doc.setFillColor(...COLORS.bg)
  doc.rect(0, 0, PAGE_W, PAGE_H, "F")

  // Yuqori urg'u chizig'i (teal → purple → magenta)
  drawHorizontalGradient(doc, 0, 0, PAGE_W / 2, 2.2, COLORS.teal, COLORS.purple, 40)
  drawHorizontalGradient(doc, PAGE_W / 2, 0, PAGE_W / 2, 2.2, COLORS.purple, COLORS.magenta, 40)

  // ──────────────────────────────────────────────────────────
  // HEADER
  // ──────────────────────────────────────────────────────────
  let yPos = 18

  doc.setFontSize(18)
  doc.setTextColor(...COLORS.teal)
  doc.setFont("helvetica", "bold")
  doc.text("JDA KIMYO", 20, yPos)
  const logoTextW = doc.getTextWidth("JDA KIMYO")

  doc.setFontSize(9)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "normal")
  doc.text("jdakimyo.uz", 20 + logoTextW + 4, yPos)

  doc.setFontSize(8)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text(`${quizName.toUpperCase()} · QUIZ`, 190, yPos - 3, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.text(currentDate, 190, yPos + 2, { align: "right" })

  yPos += 8
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(20, yPos, 190, yPos)

  // ──────────────────────────────────────────────────────────
  // HERO — Umumiy natija (progress ring + foiz)
  // ──────────────────────────────────────────────────────────
  yPos += 14

  doc.setFontSize(8)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text("UMUMIY NATIJA", PAGE_W / 2, yPos, { align: "center" })

  const ringCx = PAGE_W / 2
  const ringCy = yPos + 32
  const ringR = 26

  drawProgressRing(doc, ringCx, ringCy, ringR, percentage, COLORS.border, COLORS.teal, COLORS.magenta)

  doc.setFontSize(30)
  doc.setTextColor(...COLORS.textPrimary)
  doc.setFont("helvetica", "bold")
  doc.text(String(percentage), ringCx - 2, ringCy + 4, { align: "center" })
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "normal")
  doc.text("%", ringCx + 9, ringCy + 1)

  // Grade pill
  const pillY = ringCy + ringR + 10
  const pillText = `${grade}   ${message}`
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  const pillTextW = doc.getTextWidth(pillText) + 16
  const pillX = PAGE_W / 2 - pillTextW / 2

  withOpacity(doc, 0.12, () => {
    doc.setFillColor(...COLORS.purple)
    doc.roundedRect(pillX, pillY - 5, pillTextW, 10, 5, 5, "F")
  })
  doc.setDrawColor(...COLORS.purple)
  doc.setLineWidth(0.4)
  doc.roundedRect(pillX, pillY - 5, pillTextW, 10, 5, 5, "S")

  doc.setTextColor(...COLORS.purple)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(grade, pillX + 7, pillY + 1.3)
  doc.setDrawColor(...COLORS.purple)
  doc.line(pillX + 13, pillY - 3, pillX + 13, pillY + 4)
  doc.setTextColor(...COLORS.textSecondary)
  doc.setFont("helvetica", "normal")
  doc.text(message, pillX + 17, pillY + 1.3)

  yPos = pillY + 14
  doc.setDrawColor(...COLORS.border)
  doc.line(20, yPos, 190, yPos)

  // ──────────────────────────────────────────────────────────
  // FOYDALANUVCHI / VAQT
  // ──────────────────────────────────────────────────────────
  yPos += 12

  doc.setFontSize(7.5)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text("FOYDALANUVCHI", 20, yPos)

  doc.setFontSize(14)
  doc.setTextColor(...COLORS.textPrimary)
  doc.setFont("helvetica", "bold")
  doc.text(userName, 20, yPos + 7)

  doc.setFontSize(7.5)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text("SARFLANGAN VAQT", 190, yPos, { align: "right" })

  doc.setFontSize(14)
  doc.setTextColor(...COLORS.magenta)
  doc.setFont("helvetica", "bold")
  doc.text(timeString, 190, yPos + 7, { align: "right" })

  yPos += 16
  doc.setDrawColor(...COLORS.border)
  doc.line(20, yPos, 190, yPos)

  // ──────────────────────────────────────────────────────────
  // STATISTIKA KARTALARI
  // ──────────────────────────────────────────────────────────
  yPos += 12

  const cardW = 54
  const cardH = 28
  const gap = 4
  const startX = (PAGE_W - (cardW * 3 + gap * 2)) / 2

  drawStatCard(doc, startX, yPos, cardW, cardH, correctCount, "To'g'ri", COLORS.success)
  drawStatCard(doc, startX + cardW + gap, yPos, cardW, cardH, wrongCount, "Xato", COLORS.danger)
  drawStatCard(doc, startX + (cardW + gap) * 2, yPos, cardW, cardH, totalQuestions, "Jami", COLORS.textSecondary)

  yPos += cardH + 14

  // ──────────────────────────────────────────────────────────
  // PROGRESS BAR
  // ──────────────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setTextColor(...COLORS.textSecondary)
  doc.setFont("helvetica", "normal")
  doc.text("Tugatish darajasi", 20, yPos)
  doc.text(`${correctCount} / ${totalQuestions} savol`, 190, yPos, { align: "right" })

  yPos += 5

  const barX = 20
  const barW = 170
  const barH = 3.2

  doc.setFillColor(...COLORS.border)
  doc.roundedRect(barX, yPos, barW, barH, 1.6, 1.6, "F")

  const fillW = (percentage / 100) * barW
  if (fillW > 1) {
    drawHorizontalGradient(doc, barX, yPos, fillW, barH, COLORS.teal, COLORS.magenta, 50)
    doc.setFillColor(...COLORS.magenta)
    doc.circle(barX + fillW, yPos + barH / 2, 1.8, "F")
  }

  yPos += 16
  doc.setDrawColor(...COLORS.border)
  doc.line(20, yPos, 190, yPos)

  // ──────────────────────────────────────────────────────────
  // TAVSIYA
  // ──────────────────────────────────────────────────────────
  yPos += 11

  doc.setFillColor(...COLORS.teal)
  doc.rect(20, yPos - 4, 1, 22, "F")

  doc.setFontSize(7.5)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "bold")
  doc.text("TAVSIYA", 26, yPos)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...COLORS.textSecondary)

  const adviceText =
    percentage >= 70
      ? `Siz bu mavzuni yaxshi o'zlashtirgansiz. Qolgan ${wrongCount} ta xato javobni ko'rib chiqing va keyingi safar yanada yuqori natija ko'rsating.`
      : percentage >= 50
      ? `Yaxshi boshlanish, ammo yetarli emas. ${wrongCount} ta xato javobni qayta ko'rib chiqing va mashqlarni takrorlang.`
      : `Bu mavzuni qayta o'rganishni va mashqlarni boshidan takrorlashni tavsiya etamiz.`

  const adviceLines = doc.splitTextToSize(adviceText, 160)
  doc.text(adviceLines, 26, yPos + 7)

  // ──────────────────────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────────────────────
  const footerY = PAGE_H - 14

  drawHorizontalGradient(doc, 0, footerY - 4, PAGE_W / 2, 0.6, COLORS.teal, COLORS.purple, 30)
  drawHorizontalGradient(doc, PAGE_W / 2, footerY - 4, PAGE_W / 2, 0.6, COLORS.purple, COLORS.magenta, 30)

  doc.setFontSize(7.5)
  doc.setTextColor(...COLORS.textMuted)
  doc.setFont("helvetica", "normal")
  doc.text(`© ${new Date().getFullYear()} JDA KIMYO`, 20, footerY)
  doc.text("jdakimyo.uz · @diyorbek_jabborov", PAGE_W / 2, footerY, { align: "center" })
  doc.text("1 / 1", 190, footerY, { align: "right" })

  // ──────────────────────────────────────────────────────────
  // SAQLASH
  // ──────────────────────────────────────────────────────────
  const safeUser = userName
    .toLowerCase()
    .replace(/[^a-z0-9čšž\s'-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
  const safeQuiz = quizName.toLowerCase().replace(/\s+/g, "-")
  const fileName = `natija-${safeQuiz}-${safeUser || "foydalanuvchi"}-${Date.now()}.pdf`

  doc.save(fileName)
  return fileName
}

/**
 * PDF/saqlash uchun javoblar massivini tozalash
 */
export function prepareAnswersForPDF(answers) {
  return answers.map((a) => ({
    questionIndex: a.questionIndex,
    question: a.question,
    selectedAnswer: a.selectedAnswer,
    correctAnswer: a.correctAnswer,
    isCorrect: a.isCorrect,
    explanation: a.explanation,
  }))
}