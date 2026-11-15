// test/sertifikat-tizimi.test.js
import test from "node:test"
import assert from "node:assert/strict"
import { PDFDocument } from "pdf-lib"
import {
  ajratSertifikatMuhrlar,
  ajratSertifikatTavsifi,
  formatAmalMuddati,
  formatMobileSertifikat,
  milliySertifikatPdfMalumoti,
  qurAdminSertifikatFiltr,
  SERTIFIKAT_TURLARI,
  sertifikatHolati,
  sertifikatIsmSaqlashQarori,
  sertifikatQrHavolasi,
  sertifikatTuriAniqlash,
} from "../lib/sertifikat-tahlil.js"
import { generatsiyaMilliySertifikatPDFBaytlar } from "../lib/milliy-sertifikat-pdf.js"
import { generatsiyaUmumiySertifikatPDFBaytlar } from "../lib/sertifikat-pdf.js"
import {
  generatsiyaSertifikatPDFBaytlar,
  sertifikatFaylNomi,
} from "../lib/sertifikat-pdf-universal.js"
import {
  sertifikatEgasiniTekshir,
  sertifikatRoyxatiXabari,
  sertifikatTelegramIzohi,
} from "../lib/telegram-sertifikat.js"
import { saytniki } from "../lib/telegram-kopruk.js"

test("ajratSertifikatTavsifi — MS JSON va oddiy matnni to'g'ri ajratadi", () => {
  const msCert = {
    certId: "JDA-MS-2026-ABC123",
    description: JSON.stringify({
      theta: 1.42,
      se: 0.34,
      shkalaBalli: 66.2,
      rawScore: 34,
      jamiSavollar: 43,
      oddiyFoiz: 79,
      oddiyBall: 64.5,
      examSlug: "milliy-sertifikat-simulyator",
    }),
  }

  const resMs = ajratSertifikatTavsifi(msCert)
  assert.equal(resMs.isMs, true)
  assert.equal(resMs.matn, null)
  assert.equal(resMs.meta.shkalaBalli, 66.2)
  assert.equal(resMs.meta.oddiyFoiz, 79)
  assert.equal(resMs.fullNameLocked, false)

  const oddiyCert = {
    certId: "JDA-2026-K7M2QP",
    description: "Respublika olimpiadasida 1-o'rin uchun",
  }
  const resOddiy = ajratSertifikatTavsifi(oddiyCert)
  assert.equal(resOddiy.isMs, false)
  assert.equal(resOddiy.meta, null)
  assert.equal(resOddiy.matn, "Respublika olimpiadasida 1-o'rin uchun")

  const buzilganJson = {
    certId: "JDA-2026-BROKEN",
    description: "{xato json matn",
  }
  const resBuzilgan = ajratSertifikatTavsifi(buzilganJson)
  assert.equal(resBuzilgan.isMs, false)
  assert.equal(resBuzilgan.meta, null)
  assert.equal(resBuzilgan.matn, "{xato json matn")
})

test("sertifikatHolati — faol, muddati o'tgan va bekor qilingan holatlarni aniqlaydi", () => {
  const hozir = new Date("2026-11-13T12:00:00Z")

  assert.equal(
    sertifikatHolati({ status: "valid", expiresAt: "2029-11-13T00:00:00Z" }, hozir).yaroqli,
    true
  )
  assert.equal(
    sertifikatHolati({ status: "valid", expiresAt: null }, hozir).holat,
    "valid"
  )
  assert.equal(
    sertifikatHolati({ status: "valid", expiresAt: "2026-01-01T00:00:00Z" }, hozir).holat,
    "expired"
  )
  assert.equal(
    sertifikatHolati({ status: "revoked", expiresAt: "2025-01-01T00:00:00Z" }, hozir).holat,
    "revoked"
  )
})

test("formatAmalMuddati — muddatni dinamik chiqaradi", () => {
  assert.equal(formatAmalMuddati("2026-11-13T00:00:00Z", null), "Muddatsiz")
  assert.equal(
    formatAmalMuddati("2026-11-13T00:00:00Z", "2029-11-13T00:00:00Z"),
    "3 yil (13-noyabr 2029 gacha)"
  )
  assert.equal(
    formatAmalMuddati("2026-11-13T00:00:00Z", "2027-05-20T00:00:00Z"),
    "20-may 2027 gacha"
  )
})

test("sertifikatIsmSaqlashQarori — 1 marta tahrirlash va qulflash qoidasi", () => {
  const boshlangichMeta = {
    theta: 1.15,
    shkalaBalli: 61.5,
    examSlug: "ms-1",
  }
  const cert = {
    certId: "JDA-MS-2026-1122",
    fullName: "Ali Valiyev",
    description: JSON.stringify(boshlangichMeta),
  }

  // O'zgarishsiz saqlash qulfni yoqmaydi
  const birXil = sertifikatIsmSaqlashQarori({ mavjud: cert, yangiIsm: "  Ali   Valiyev " })
  assert.equal(birXil.ok, true)
  assert.equal(birXil.ozgardi, false)
  assert.equal(birXil.fullNameLocked, false)

  // Birinchi tahrir muvaffaqiyatli saqlanadi va qulflanadi
  const birinchi = sertifikatIsmSaqlashQarori({
    mavjud: cert,
    yangiIsm: "Valiyev Ali Bahodir o'g'li",
    hozirIso: "2026-11-13T10:00:00.000Z",
  })
  assert.equal(birinchi.ok, true)
  assert.equal(birinchi.ozgardi, true)
  assert.equal(birinchi.fullNameLocked, true)

  const saqlanganMeta = JSON.parse(birinchi.nextDescription)
  assert.equal(saqlanganMeta.theta, 1.15)
  assert.equal(saqlanganMeta.fullNameLocked, true)
  assert.equal(saqlanganMeta.oldFullName, "Ali Valiyev")

  // Ikkinchi tahrir urinishi bloklanadi (403)
  const ikkinchi = sertifikatIsmSaqlashQarori({
    mavjud: {
      certId: cert.certId,
      fullName: birinchi.fullName,
      description: birinchi.nextDescription,
    },
    yangiIsm: "Boshqa Ism",
  })
  assert.equal(ikkinchi.ok, false)
  assert.equal(ikkinchi.status, 403)
  assert.equal(ikkinchi.locked, true)
})

test("sertifikatQrHavolasi — canonical www.jdakimyo.uz manzilini beradi", () => {
  assert.equal(
    sertifikatQrHavolasi("jda-ms-2026-ab12"),
    "https://www.jdakimyo.uz/sertifikat/verify/JDA-MS-2026-AB12"
  )
})

test("generatsiyaMilliySertifikatPDFBaytlar — bazadagi MS yozuvdan dinamik muddat va holat bilan PDF yaratadi", async () => {
  const bazaCert = {
    certId: "JDA-MS-2026-DB9988",
    fullName: "Karimova Madina Otabek qizi",
    fan: "Kimyo",
    grade: "A",
    score: 64,
    percentage: 81,
    issuedAt: "2026-11-13T08:00:00.000Z",
    expiresAt: "2028-11-13T08:00:00.000Z",
    status: "revoked",
    description: JSON.stringify({
      theta: 1.55,
      se: 0.31,
      shkalaBalli: 64.2,
      oddiyBall: 60.5,
      oddiyFoiz: 81,
      rawScore: 35,
      jamiSavollar: 43,
      kalibrlashUsuli: "cml_kohort",
      examSlug: "ms-2026-1",
    }),
  }

  const norm = milliySertifikatPdfMalumoti(bazaCert)
  assert.equal(norm.oddiyBall, 60.5)
  assert.equal(norm.oddiyFoiz, 81)

  const baytlar = await generatsiyaMilliySertifikatPDFBaytlar(bazaCert)
  assert.equal(baytlar instanceof Uint8Array, true)
  assert.equal(baytlar.length > 5000, true)

  const loaded = await PDFDocument.load(baytlar)
  assert.equal(loaded.getPageCount(), 1)
})

test("sertifikatTuriAniqlash va ajratSertifikatTavsifi — turi/metadata/fullNameLocked ustunlarini qo'llab-quvvatlaydi", () => {
  const ustunliMs = {
    certId: "JDA-2026-CUSTOM1",
    turi: SERTIFIKAT_TURLARI.milliy,
    fullNameLocked: true,
    metadata: {
      shkalaBalli: 70.5,
      oddiyBall: 65,
      oddiyFoiz: 88,
      daraja: "A+",
    },
    description: null,
  }

  assert.equal(sertifikatTuriAniqlash(ustunliMs), SERTIFIKAT_TURLARI.milliy)
  const tahlil = ajratSertifikatTavsifi(ustunliMs)
  assert.equal(tahlil.isMs, true)
  assert.equal(tahlil.fullNameLocked, true)
  assert.equal(tahlil.meta.shkalaBalli, 70.5)

  assert.equal(
    sertifikatTuriAniqlash({ certId: "AK-JK-2025-1234", fan: "Mavsumiy Hamkorlik" }),
    SERTIFIKAT_TURLARI.hamkor
  )
  assert.equal(
    sertifikatTuriAniqlash({ certId: "JDA-2026-XYZ123", fan: "Organik kimyo" }),
    SERTIFIKAT_TURLARI.maxsus
  )
})

test("generatsiyaUmumiySertifikatPDFBaytlar — Node muhitida klassik va hamkorlik PDFlarini yaratadi", async () => {
  const klassik = {
    certId: "JDA-2026-K7M2QP",
    fullName: "Qodirov Jasurbek Olim o'g'li",
    fan: "Umumiy va anorganik kimyo",
    reason: "Respublika kimyo olimpiadasida faol ishtiroki uchun",
    grade: "1-daraja",
    score: 96,
    percentage: 96,
    status: "valid",
    issuedAt: "2026-11-13T10:00:00.000Z",
  }
  const klassikBayt = await generatsiyaUmumiySertifikatPDFBaytlar(klassik)
  assert.equal(klassikBayt instanceof Uint8Array, true)
  assert.equal((await PDFDocument.load(klassikBayt)).getPageCount(), 1)

  const hamkor = {
    certId: "AK-JK-2026-5544",
    turi: SERTIFIKAT_TURLARI.hamkor,
    fullName: "Tursunova Malika",
    fan: "Mavsumiy Hamkorlik: DTM Sinov 2026",
    reason: "DTM sinov testida yuqori natija uchun",
    score: 29,
    percentage: 97,
    status: "valid",
    issuedAt: "2026-11-13T10:00:00.000Z",
    seals: { partnerName: "AlchemIQ", badgeText: "TOP 3" },
  }
  const hamkorBayt = await generatsiyaUmumiySertifikatPDFBaytlar(hamkor, 1)
  assert.equal(hamkorBayt instanceof Uint8Array, true)
  assert.equal((await PDFDocument.load(hamkorBayt)).getPageCount(), 1)
})

test("generatsiyaSertifikatPDFBaytlar — MS va klassik sertifikatni yagona dispetcher orqali yaratadi", async () => {
  assert.equal(sertifikatFaylNomi(" jda-ms-2026/a "), "JDA-Sertifikat-JDA-MS-2026A.pdf")

  const msPdf = await generatsiyaSertifikatPDFBaytlar({
    certId: "JDA-MS-2026-UNIV1",
    fullName: "Nazarov Shohruh",
    fan: "Kimyo",
    issuedAt: "2026-11-13T10:00:00.000Z",
    metadata: { theta: 1.1, se: 0.32, shkalaBalli: 61.5, oddiyFoiz: 74, oddiyBall: 55.5 },
  })
  assert.equal((await PDFDocument.load(msPdf)).getPageCount(), 1)

  const oddiyPdf = await generatsiyaSertifikatPDFBaytlar({
    certId: "JDA-2026-UNIV2",
    fullName: "Olimova Zilola",
    fan: "Kimyo asoslari",
    reason: "Kursni muvaffaqiyatli yakunlagani uchun",
    issuedAt: "2026-11-13T10:00:00.000Z",
    status: "valid",
  })
  assert.equal((await PDFDocument.load(oddiyPdf)).getPageCount(), 1)
})

test("Telegram sertifikat matni, ro'yxat tugmalari va saytniki yo'naltiruvi to'g'ri ishlaydi", async () => {
  const izoh = sertifikatTelegramIzohi({
    certId: "JDA-MS-2026-TG1",
    fullName: "Aliyev <Test> & Co",
    examName: "Kimyo <MS> #1",
    turi: SERTIFIKAT_TURLARI.milliy,
    metadata: { daraja: "A", shkalaBalli: 65.4, oddiyFoiz: 80 },
    issuedAt: "2026-11-13T10:00:00.000Z",
    expiresAt: "2029-11-13T10:00:00.000Z",
    status: "valid",
  })
  assert.equal(izoh.length <= 1024, true)
  assert.equal(izoh.includes("Aliyev &lt;Test&gt; &amp; Co"), true)
  assert.equal(izoh.includes("<code>JDA-MS-2026-TG1</code>"), true)

  const royxat = sertifikatRoyxatiXabari([
    {
      certId: "JDA-MS-2026-TG1",
      examName: "MS Sinov #1",
      grade: "A",
      issuedAt: "2026-11-13T10:00:00.000Z",
      status: "valid",
    },
  ])
  assert.equal(royxat.reply_markup.inline_keyboard.length, 1)
  assert.equal(royxat.reply_markup.inline_keyboard[0][0].callback_data, "sayt:certpdf:JDA-MS-2026-TG1")

  const boshRoyxat = sertifikatRoyxatiXabari([])
  assert.equal(boshRoyxat.reply_markup, null)

  assert.equal(saytniki("/sertifikatlar", []), true)
  assert.equal(saytniki("/sertifikatlarim@jdakimyouzbot", []), true)
  assert.equal(saytniki("/myquiz", []), false)

  // Egalik huquqi tekshiruvi (callback uchun)
  const mockDb = {
    telegramUlanish: {
      findUnique: async ({ where }) =>
        where.chatId === "1001" ? { userId: "user-1" } : null,
    },
    certificate: {
      findUnique: async ({ where }) =>
        where.certId === "JDA-MS-2026-TG1"
          ? { certId: "JDA-MS-2026-TG1", userId: "user-1" }
          : where.certId === "JDA-2026-OTHER"
          ? { certId: "JDA-2026-OTHER", userId: "user-2" }
          : null,
    },
  }

  assert.equal(
    (await sertifikatEgasiniTekshir({ chatId: "9999", certId: "JDA-MS-2026-TG1", db: mockDb })).sabab,
    "ulanmagan"
  )
  assert.equal(
    (await sertifikatEgasiniTekshir({ chatId: "1001", certId: "YOQ-ID", db: mockDb })).sabab,
    "topilmadi"
  )
  assert.equal(
    (await sertifikatEgasiniTekshir({ chatId: "1001", certId: "JDA-2026-OTHER", db: mockDb })).sabab,
    "egasi_emas"
  )
  const egasiOk = await sertifikatEgasiniTekshir({
    chatId: "1001",
    certId: "jda-ms-2026-tg1",
    db: mockDb,
  })
  assert.equal(egasiOk.ok, true)
  assert.equal(egasiOk.sertifikat.certId, "JDA-MS-2026-TG1")
})

test("qurAdminSertifikatFiltr — manba, muddati tugagan holat va qidiruvni to'qnashuvsiz quradi", () => {
  const hozir = new Date("2026-11-13T12:00:00.000Z")

  const hamkorValid = qurAdminSertifikatFiltr({
    fan: "Kimyo",
    status: "valid",
    manba: "hamkor",
    search: "Karimov",
    hozir,
  })

  assert.equal(Array.isArray(hamkorValid.where.AND), true)
  // realUserFiltr + fan + status + manba + search = 5 ta mustaqil shart
  assert.equal(hamkorValid.where.AND.length, 5)
  assert.deepEqual(hamkorValid.where.AND[1], { fan: "Kimyo" })
  assert.deepEqual(hamkorValid.where.AND[2], {
    status: "valid",
    OR: [{ expiresAt: null }, { expiresAt: { gt: hozir } }],
  })

  const expiredFiltr = qurAdminSertifikatFiltr({ status: "expired", manba: "ms", hozir })
  assert.deepEqual(expiredFiltr.where.AND[1], {
    status: "valid",
    expiresAt: { lte: hozir },
  })

  const revokedFiltr = qurAdminSertifikatFiltr({ status: "revoked" })
  assert.deepEqual(revokedFiltr.where.AND[1], { status: { not: "valid" } })
})

test("formatMobileSertifikat — MS va muddati tugagan hamkor sertifikatini URLlar bilan qaytaradi", () => {
  const msMobil = formatMobileSertifikat(
    {
      id: "c1",
      certId: "jda-ms-2026-mob1",
      fullName: "Xolmatov Aziz",
      fan: "Kimyo",
      reason: "Milliy sertifikat tayyorlik sinovi",
      turi: SERTIFIKAT_TURLARI.milliy,
      fullNameLocked: true,
      metadata: { shkalaBalli: 68.4, oddiyFoiz: 85, daraja: "A" },
      status: "valid",
      issuedAt: "2026-11-13T08:00:00.000Z",
      expiresAt: "2099-11-13T08:00:00.000Z",
    },
    "https://www.jdakimyo.uz/"
  )

  assert.equal(msMobil.certId, "JDA-MS-2026-MOB1")
  assert.equal(msMobil.turi, SERTIFIKAT_TURLARI.milliy)
  assert.equal(msMobil.isMs, true)
  assert.equal(msMobil.fullNameLocked, true)
  assert.equal(msMobil.yaroqli, true)
  assert.equal(msMobil.holat, "valid")
  assert.equal(msMobil.grade, "A")
  assert.equal(msMobil.verifyUrl, "https://www.jdakimyo.uz/sertifikat/verify/JDA-MS-2026-MOB1")
  assert.equal(msMobil.pdfUrl, "https://www.jdakimyo.uz/api/sertifikat/JDA-MS-2026-MOB1/pdf")

  const eskiHamkor = formatMobileSertifikat({
    id: "c2",
    certId: "AK-JK-2024-99",
    fullName: "Saidova Mohira",
    fan: "Mavsumiy Hamkorlik",
    reason: "DTM sinov testi g'olibi",
    status: "valid",
    issuedAt: "2024-01-01T00:00:00.000Z",
    expiresAt: "2025-01-01T00:00:00.000Z",
  })

  assert.equal(eskiHamkor.turi, SERTIFIKAT_TURLARI.hamkor)
  assert.equal(eskiHamkor.isMs, false)
  assert.equal(eskiHamkor.holat, "expired")
  assert.equal(eskiHamkor.yaroqli, false)
})

test("ajratSertifikatMuhrlar — rasm massiv va hamkor muhr obyektini xavfsiz ajratadi", () => {
  const massivdan = ajratSertifikatMuhrlar([
    { url: "/seal1.png", label: "Rektor" },
    { url: "", label: "Bo'sh" },
    null,
  ])
  assert.equal(massivdan.rasmlar.length, 1)
  assert.equal(massivdan.rasmlar[0].url, "/seal1.png")
  assert.equal(massivdan.hamkorMuhri, null)

  const obyektdan = ajratSertifikatMuhrlar({
    partnerName: "AlchemIQ",
    badgeText: "TOP 10",
  })
  assert.equal(obyektdan.rasmlar.length, 0)
  assert.equal(obyektdan.hamkorMuhri?.partnerName, "AlchemIQ")

  const bosh = ajratSertifikatMuhrlar(null)
  assert.deepEqual(bosh, { rasmlar: [], hamkorMuhri: null })
})
