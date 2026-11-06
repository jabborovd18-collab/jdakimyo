// lib/milliy-sertifikat-pdf.js
//
// JDA KIMYO — MILLIY SERTIFIKAT RASMIY VEKTORLI PDF GENERATORI
// Georg Rasch IRT psixometrik modeli va BMBA davlat standarti bo'yicha
// to'liq vektorli, rasmiy QR-kodli va o'zbekcha harflarni to'g'ri ko'rsatuvchi
// hashamatli davlat sertifikati hujjati.

import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import QRCode from "qrcode"

const RANG = {
  fon: rgb(0.985, 0.98, 0.96),
  tilla: rgb(0.85, 0.68, 0.22),
  tillaOch: rgb(0.95, 0.85, 0.45),
  moviy: rgb(0.04, 0.08, 0.22), // To'q safir
  moviyYorqin: rgb(0.12, 0.24, 0.55),
  matn: rgb(0.1, 0.1, 0.15),
  kulrang: rgb(0.4, 0.42, 0.48),
  oq: rgb(1, 1, 1),
  yashil: rgb(0.1, 0.55, 0.3),
}

async function yuklaBaytlar(url) {
  // Data URL bo'lsa (masalan QR-kod)
  if (url.startsWith("data:")) {
    const base64 = url.split(",")[1]
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(base64, "base64"))
    }
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  }

  // Node.js (test yoki server) muhiti
  if (typeof window === "undefined") {
    const fs = await import("fs")
    const path = await import("path")
    const tozaUrl = url.startsWith("/") ? url.slice(1) : url
    const fullPath = path.join(process.cwd(), "public", tozaUrl)
    return new Uint8Array(fs.readFileSync(fullPath))
  }

  // Brauzer muhiti
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fayl topilmadi: ${url}`)
  return new Uint8Array(await res.arrayBuffer())
}

function tozaMatn(matn) {
  if (!matn) return ""
  return String(matn)
    .replace(/[\u2018\u2019`ʻʼ]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}

function sanaFormat(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const oylar = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
  ]
  return `${d.getDate()}-${oylar[d.getMonth()]} ${d.getFullYear()}`
}

function olchov(matn, shrift, olcham) {
  return shrift.widthOfTextAtSize(tozaMatn(matn), olcham)
}

function tekshirishUrl(certId) {
  const asosiyUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://jdakimyo.uz"
  return `${asosiyUrl}/milliy-sertifikat/tekshir/${certId}`
}

/**
 * Milliy Sertifikat PDF baytlarini (Uint8Array) yaratish.
 * Server, API route va brauzerda bir xil ishlaydi.
 */
export async function generatsiyaMilliySertifikatPDFBaytlar(s) {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  // Vektorli shriftlarni yuklash (o', g' harflari va o'zbekcha matnlar uchun)
  const [oddiyBayt, qalinBayt] = await Promise.all([
    yuklaBaytlar("/fonts/DejaVuSans.ttf"),
    yuklaBaytlar("/fonts/DejaVuSans-Bold.ttf"),
  ])
  const oddiy = await doc.embedFont(oddiyBayt, { subset: true })
  const qalin = await doc.embedFont(qalinBayt, { subset: true })

  // A4 Landscape o'lchami: 841.89 × 595.28 pt
  const W = 841.89
  const H = 595.28
  const sahifa = doc.addPage([W, H])

  // 1. ASOSIY FON VA BO'YALGAN QISMLAR
  sahifa.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: H,
    color: RANG.fon,
  })

  // Hashamatli to'q moviy chap bezak tasmasi
  sahifa.drawRectangle({
    x: 0,
    y: 0,
    width: 220,
    height: H,
    color: RANG.moviy,
  })

  // Oltin chiziqli ajratuvchi
  sahifa.drawLine({
    start: { x: 220, y: 0 },
    end: { x: 220, y: H },
    thickness: 3,
    color: RANG.tilla,
  })

  // O'ng perimetr oltin ramkasi
  sahifa.drawRectangle({
    x: 236,
    y: 16,
    width: W - 252,
    height: H - 32,
    borderColor: RANG.tilla,
    borderWidth: 1.5,
  })

  sahifa.drawRectangle({
    x: 242,
    y: 22,
    width: W - 264,
    height: H - 44,
    borderColor: rgb(0.9, 0.85, 0.75),
    borderWidth: 0.8,
  })

  // ─── 2. CHAP TO'Q PANELDAGI ELEMENTLAR ───
  // Ilmiy Logotip ramkasi
  sahifa.drawCircle({
    x: 110,
    y: H - 85,
    size: 40,
    color: RANG.moviyYorqin,
    borderColor: RANG.tilla,
    borderWidth: 2,
  })
  sahifa.drawText("JDA", {
    x: 110 - olchov("JDA", qalin, 18) / 2,
    y: H - 80,
    size: 18,
    font: qalin,
    color: RANG.tillaOch,
  })
  sahifa.drawText("KIMYO", {
    x: 110 - olchov("KIMYO", oddiy, 10) / 2,
    y: H - 96,
    size: 10,
    font: oddiy,
    color: RANG.oq,
  })

  // Chap paneldagi rasmiy yozuvlar
  const chapYozuvlar = [
    { t: "GEORG RASCH", sz: 12, f: qalin, c: RANG.tillaOch, y: H - 155 },
    { t: "IRT ILMIY MODELI", sz: 10, f: oddiy, c: RANG.oq, y: H - 170 },
    { t: "BMBA DAVLAT STANDARTI", sz: 8.5, f: oddiy, c: RANG.tilla, y: H - 195 },
    { t: "KIMYO FANI SINOVI", sz: 8.5, f: oddiy, c: RANG.oq, y: H - 210 },
  ]
  chapYozuvlar.forEach((item) => {
    const w = olchov(item.t, item.f, item.sz)
    sahifa.drawText(item.t, {
      x: 110 - w / 2,
      y: item.y,
      size: item.sz,
      font: item.f,
      color: item.c,
    })
  })

  // Chap paneldagi Daraja Medali
  const daraja = s.daraja || "A"
  sahifa.drawCircle({
    x: 110,
    y: H - 300,
    size: 52,
    color: RANG.moviyYorqin,
    borderColor: RANG.tilla,
    borderWidth: 3,
  })
  sahifa.drawCircle({
    x: 110,
    y: H - 300,
    size: 46,
    borderColor: RANG.tillaOch,
    borderWidth: 1,
  })

  sahifa.drawText("DARAJA", {
    x: 110 - olchov("DARAJA", oddiy, 8) / 2,
    y: H - 275,
    size: 8,
    font: oddiy,
    color: RANG.tillaOch,
  })
  const dW = olchov(daraja, qalin, 32)
  sahifa.drawText(daraja, {
    x: 110 - dW / 2,
    y: H - 308,
    size: 32,
    font: qalin,
    color: RANG.tillaOch,
  })
  sahifa.drawText("★ ★ ★", {
    x: 110 - olchov("★ ★ ★", qalin, 9) / 2,
    y: H - 325,
    size: 9,
    font: qalin,
    color: RANG.tilla,
  })

  // Chap paneldagi Raqamli Ko'rsatkichlar
  sahifa.drawText("BMBA Shkalasi:", {
    x: 35,
    y: H - 380,
    size: 9,
    font: oddiy,
    color: RANG.kulrang,
  })
  sahifa.drawText(`${s.shkalaBalli || "0.0"} / 70 ball`, {
    x: 35,
    y: H - 396,
    size: 13,
    font: qalin,
    color: RANG.tillaOch,
  })

  sahifa.drawText("Rasch Bilim Qobiliyati:", {
    x: 35,
    y: H - 425,
    size: 9,
    font: oddiy,
    color: RANG.kulrang,
  })
  const thetaMatn = `θ = ${s.theta > 0 ? `+${s.theta}` : s.theta} logit`
  sahifa.drawText(thetaMatn, {
    x: 35,
    y: H - 441,
    size: 12,
    font: qalin,
    color: RANG.oq,
  })

  sahifa.drawText(`Standart xatolik: SE = ${s.se || "0.35"}`, {
    x: 35,
    y: H - 457,
    size: 8,
    font: oddiy,
    color: RANG.kulrang,
  })

  // Chap panel pastki reestr ID
  sahifa.drawText("REESTR RAQAMI:", {
    x: 35,
    y: 50,
    size: 7.5,
    font: oddiy,
    color: RANG.tilla,
  })
  sahifa.drawText(s.certId || "JDA-MS-2026-00000", {
    x: 35,
    y: 35,
    size: 9.5,
    font: qalin,
    color: RANG.oq,
  })

  // ─── 3. O'NG ASOSIY HUJJAT BLOKI ───
  const markazX = 220 + (W - 220) / 2

  // Yuqori sarlavha
  const tepaSarlavha = "O'ZBEKISTON RESPUBLIKASI"
  sahifa.drawText(tepaSarlavha, {
    x: markazX - olchov(tepaSarlavha, oddiy, 10) / 2,
    y: H - 65,
    size: 10,
    font: oddiy,
    color: RANG.kulrang,
  })

  const vazirlik = "BILIM VA MALAKALARNI BAHOLASH AGENTLIGI ANDOZASI"
  sahifa.drawText(vazirlik, {
    x: markazX - olchov(vazirlik, qalin, 11) / 2,
    y: H - 82,
    size: 11,
    font: qalin,
    color: RANG.moviy,
  })

  const institut = "JDA KIMYO ILMIY VA AKADEMIK TADQIQOTLAR MARKAZI"
  sahifa.drawText(institut, {
    x: markazX - olchov(institut, oddiy, 9) / 2,
    y: H - 98,
    size: 9,
    font: oddiy,
    color: RANG.kulrang,
  })

  // Katta Oltin Ajratuvchi Bezak
  sahifa.drawLine({
    start: { x: markazX - 160, y: H - 115 },
    end: { x: markazX + 160, y: H - 115 },
    thickness: 1,
    color: RANG.tilla,
  })
  sahifa.drawCircle({
    x: markazX,
    y: H - 115,
    size: 4,
    color: RANG.tilla,
  })

  // ASOSIY HUJJAT NOMI
  const sertifikatMatni = "MILLIY SERTIFIKAT"
  sahifa.drawText(sertifikatMatni, {
    x: markazX - olchov(sertifikatMatni, qalin, 28) / 2,
    y: H - 155,
    size: 28,
    font: qalin,
    color: RANG.moviy,
  })

  const fanNomi = "KIMYO FANI BO'YICHA"
  sahifa.drawText(fanNomi, {
    x: markazX - olchov(fanNomi, qalin, 13) / 2,
    y: H - 175,
    size: 13,
    font: qalin,
    color: RANG.tilla,
  })

  // Taqdim etiladi matni
  const beriladiMatni = "Ushbu sertifikat rasmiy ravishda tasdiqlab beriladi:"
  sahifa.drawText(beriladiMatni, {
    x: markazX - olchov(beriladiMatni, oddiy, 10.5) / 2,
    y: H - 212,
    size: 10.5,
    font: oddiy,
    color: RANG.matn,
  })

  // FOYDALANUVCHI F.I.SH.
  const ism = tozaMatn(s.fullName || "Ishtirokchi")
  const ismOlcham = ism.length > 28 ? 20 : 23
  sahifa.drawText(ism, {
    x: markazX - olchov(ism, qalin, ismOlcham) / 2,
    y: H - 245,
    size: ismOlcham,
    font: qalin,
    color: RANG.moviy,
  })

  // Ism tagidagi oltin chiziq
  const ismW = Math.max(olchov(ism, qalin, ismOlcham) + 40, 240)
  sahifa.drawLine({
    start: { x: markazX - ismW / 2, y: H - 253 },
    end: { x: markazX + ismW / 2, y: H - 253 },
    thickness: 1.2,
    color: RANG.tilla,
  })

  // Tavsif matni
  const tavsif1 = "Kimyo fani bo'yicha Georg Rasch Item Response Theory (IRT) modeli hamda"
  const tavsif2 = "davlat standarti bo'yicha o'tkazilgan maxsus sinovda muvaffaqiyatli ishtirok etib,"
  const tavsif3 = `umumiy ${s.shkalaBalli || "0.0"} ball (Rasch logiti: ${s.theta > 0 ? `+${s.theta}` : s.theta}) to'plagan holda`
  const tavsif4 = `rasmiy «${daraja}» darajali Milliy Sertifikat talablarini to'liq bajardi.`

  const qatorlar = [tavsif1, tavsif2, tavsif3, tavsif4]
  let qatorY = H - 280
  qatorlar.forEach((q, idx) => {
    const isBold = idx >= 2
    const font = isBold ? qalin : oddiy
    const color = isBold ? RANG.moviy : RANG.matn
    sahifa.drawText(q, {
      x: markazX - olchov(q, font, 10) / 2,
      y: qatorY,
      size: 10,
      font,
      color,
    })
    qatorY -= 17
  })

  // Qonuniy Imtiyoz Kapsulasi
  const imtiyozMatni = tozaMatn(s.imtiyoz || "Davlat OTMlariga kirish imtihonlarida maksimal ball imtiyozi beriladi.")
  sahifa.drawRectangle({
    x: markazX - 250,
    y: H - 395,
    width: 500,
    height: 38,
    color: rgb(0.96, 0.94, 0.88),
    borderColor: RANG.tilla,
    borderWidth: 1,
  })
  sahifa.drawText("DAVLAT IMTIYOZI VA PEDAGOGIK PRIVILEGIYA:", {
    x: markazX - 240,
    y: H - 373,
    size: 7.5,
    font: qalin,
    color: RANG.tilla,
  })
  sahifa.drawText(imtiyozMatni, {
    x: markazX - 240,
    y: H - 388,
    size: 9,
    font: oddiy,
    color: RANG.moviy,
  })

  // ─── 4. PASTKI IMZOLAR, PECHAT VA QR-KOD ───
  const pastkiY = 75

  // Chapda: Berilgan sana va amal qilish muddati
  sahifa.drawText("Berilgan sana:", {
    x: 260,
    y: pastkiY + 22,
    size: 8.5,
    font: oddiy,
    color: RANG.kulrang,
  })
  sahifa.drawText(sanaFormat(s.issuedAt) || "2026-yil", {
    x: 260,
    y: pastkiY + 8,
    size: 9.5,
    font: qalin,
    color: RANG.moviy,
  })

  sahifa.drawText("Amal qilish muddati:", {
    x: 260,
    y: pastkiY - 8,
    size: 8.5,
    font: oddiy,
    color: RANG.kulrang,
  })
  sahifa.drawText("3 yil (muddati: 2029-yil)", {
    x: 260,
    y: pastkiY - 22,
    size: 9.5,
    font: oddiy,
    color: RANG.moviy,
  })

  // O'rtada: Rasmiy Ilmiy Muhr (Vektorli Davra Pechati)
  const muhrX = markazX
  sahifa.drawCircle({
    x: muhrX,
    y: pastkiY,
    size: 38,
    color: rgb(0.97, 0.97, 1),
    borderColor: RANG.moviyYorqin,
    borderWidth: 2,
  })
  sahifa.drawCircle({
    x: muhrX,
    y: pastkiY,
    size: 34,
    borderColor: RANG.tilla,
    borderWidth: 1,
  })
  sahifa.drawText("JDA KIMYO", {
    x: muhrX - olchov("JDA KIMYO", qalin, 8) / 2,
    y: pastkiY + 12,
    size: 8,
    font: qalin,
    color: RANG.moviy,
  })
  sahifa.drawText("ILMIY KENGASH", {
    x: muhrX - olchov("ILMIY KENGASH", oddiy, 7) / 2,
    y: pastkiY + 1,
    size: 7,
    font: oddiy,
    color: RANG.moviyYorqin,
  })
  sahifa.drawText("TASDIQLANGAN", {
    x: muhrX - olchov("TASDIQLANGAN", qalin, 6.5) / 2,
    y: pastkiY - 10,
    size: 6.5,
    font: qalin,
    color: RANG.yashil,
  })
  sahifa.drawText("★ 2026 ★", {
    x: muhrX - olchov("★ 2026 ★", oddiy, 6.5) / 2,
    y: pastkiY - 20,
    size: 6.5,
    font: oddiy,
    color: RANG.tilla,
  })

  // O'ngda: Dinamik Haqiqiy QR-kod (Davlat Reestri Tekshiruvi)
  const qrManzil = tekshirishUrl(s.certId || "JDA-MS-2026-00000")
  const qrDataUrl = await QRCode.toDataURL(qrManzil, {
    width: 140,
    margin: 0,
    color: { dark: "#060c25", light: "#FFFFFF" },
  })
  const qrRasm = await doc.embedPng(await yuklaBaytlar(qrDataUrl))
  sahifa.drawImage(qrRasm, {
    x: W - 130,
    y: pastkiY - 8,
    width: 65,
    height: 65,
  })

  sahifa.drawText("Haqiqiyligini tekshirish", {
    x: W - 145,
    y: pastkiY - 20,
    size: 7,
    font: oddiy,
    color: RANG.kulrang,
  })
  sahifa.drawText("Kamerada skaner qiling", {
    x: W - 145,
    y: pastkiY - 30,
    size: 6.5,
    font: oddiy,
    color: RANG.kulrang,
  })

  // 5. PDF baytlarini yaratish va qaytarish
  return await doc.save()
}

/**
 * Milliy Sertifikat PDF faylini generatsiya qilib brauzerda yuklab berish.
 *
 * @param {object} s { certId, fullName, daraja, shkalaBalli, theta, se, issuedAt, expiresAt, imtiyoz }
 */
export async function yuklabOlishMilliySertifikatPDF(s) {
  const pdfBaytlar = await generatsiyaMilliySertifikatPDFBaytlar(s)
  const blob = new Blob([pdfBaytlar], { type: "application/pdf" })
  const yuklashUrl = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = yuklashUrl
  a.download = `Milliy_Sertifikat_${s.certId || "JDA"}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(yuklashUrl)
}
