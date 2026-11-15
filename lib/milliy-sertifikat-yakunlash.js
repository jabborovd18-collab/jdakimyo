// lib/milliy-sertifikat-yakunlash.js
//
// Sinovni yakunlash, belgilangan kunda natijani yashirish (e'longacha) va
// e'lon paytida barcha ishtirokchilar uchun kohort kalibrlangan Rasch + Oddiy
// natijalarni bir vaqtda chiqarish mantig'i (AGENTS.md 2-band).
import {
  berilganJavobSatri,
  generatsiyaSertifikatId,
  hisoblaYakuniyNatija,
} from "./milliy-sertifikat-boshqaruvchi.js"
import { sessiyaSavollari } from "./milliy-sertifikat-aralashtirish.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "./milliy-sertifikat-data.js"
import { MS_SHKALA_STANDART } from "./ms-format.js"
import { aniqlaDaraja, tuzWrightMap } from "./rasch-model.js"
import {
  jadvalHolatiAniqlash,
  kohortKalibrlaVaHisobla,
  MS_REAL_URINISH_FILTR,
  oddiyBahoHisobla,
  superadminUrinishimi,
  taqqoslashTahlili,
} from "./milliy-sertifikat-kohort.js"
import { getSavollarBySlug } from "../data/milliy-sertifikat/savollar-ombromi.js"
import {
  ajratSertifikatTavsifi,
  SERTIFIKAT_TURLARI,
} from "./sertifikat-tahlil.js"
import { profilLogYoz } from "./profil-log.js"

// Nega zaxira kerak: taymer nolga yetganda brauzer javoblarni o'zi yuboradi va
// so'rov tarmoqda bir necha soniya yo'lda bo'ladi.
const KECHIKISH_ZAXIRASI_MS = 60 * 1000

async function imtihonniOl(db, slug) {
  if (!db?.msImtihon?.findUnique) return null
  try {
    return await db.msImtihon.findUnique({ where: { slug } })
  } catch {
    return null
  }
}

function examNomi(slug, imtihon) {
  return (
    imtihon?.sarlavha ||
    MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug)?.nom ||
    "Kimyo tayyorgarlik sinovi"
  )
}

function sertifikatMetadataObyekti({ rasch, oddiy, sarflanganVaqt, slug, kalibrlashUsuli }) {
  return {
    theta: rasch.theta,
    se: rasch.se,
    infitMnsq: rasch.infitMNSQ,
    outfitMnsq: rasch.outfitMNSQ,
    shkalaBalli: rasch.shkalaBalli,
    rawScore: oddiy?.rawScore ?? rasch.rawScore,
    jamiSavollar: oddiy?.jamiSavollar ?? rasch.total,
    oddiyFoiz: oddiy?.oddiyFoiz ?? null,
    oddiyBall: oddiy?.oddiyBall ?? null,
    sarflanganVaqt,
    daraja: rasch.daraja,
    model: "Georg Rasch IRT",
    kalibrlashUsuli: kalibrlashUsuli || "taxminiy",
    examSlug: slug,
  }
}

function sertifikatDescriptionJson(paramlar) {
  return JSON.stringify(sertifikatMetadataObyekti(paramlar))
}

/**
 * Erkin mashq yoki e'londan keyingi yozuv uchun MsUrinish yozadi.
 */
async function yozUrinish(
  db,
  { sessiya, natija, userId, sarflanganVaqt, kechikkan, imtihonId = null, holat = "elon_qilindi" }
) {
  try {
    const oldingilar = userId
      ? await db.msUrinish.count({ where: { userId, slug: sessiya.slug } })
      : null

    await db.msUrinish.create({
      data: {
        sessiyaId: sessiya.sid,
        userId,
        slug: sessiya.slug,
        imtihonId,
        urinishTartibi: oldingilar === null ? null : oldingilar + 1,
        theta: natija.theta,
        se: natija.se,
        shkalaBalli: natija.shkalaBalli,
        daraja: natija.daraja,
        infitMNSQ: natija.infitMNSQ,
        outfitMNSQ: natija.outfitMNSQ,
        ishonchsiz: Boolean(natija.ishonchsiz),
        rawScore: natija.rawScore,
        jamiSavollar: natija.jamiSavollar,
        oddiyFoiz: natija.oddiyNatija?.oddiyFoiz ?? natija.foiz,
        oddiyBall: natija.oddiyNatija?.oddiyBall ?? natija.foiz,
        oddiyDaraja: natija.oddiyNatija?.oddiyBaho ?? null,
        holat,
        sarflanganVaqt,
        kechikkan,
        boshlanganVaqt: new Date(sessiya.bosh),
        javoblar: {
          create: natija.savolNatijalari.map((s) => ({
            savolKalit: `${sessiya.slug}#${s.id}`,
            savolId: String(s.id),
            berilganJavob:
              s.berilganJavobSatri !== undefined
                ? s.berilganJavobSatri
                : berilganJavobSatri(null, s.berilganJavob),
            togri: s.togri,
            javobBerildi: s.berilganJavob !== null && s.berilganJavob !== "",
            qiyinlik: s.qiyinlik,
          })),
        },
      },
    })
  } catch (error) {
    if (error?.code !== "P2002") {
      console.error("[Milliy Sertifikat Urinish Yozuvi]", error)
    }
  }
}

/**
 * Belgilangan kunda o'tadigan sinov uchun natijani yashirin saqlaydi:
 * QuizResult va Certificate hali yaratilmaydi, brauzerga ball va kalit chiqmaydi.
 */
async function saqlaJadvalUrinishi({
  db,
  imtihon,
  sessiya,
  natija,
  userId,
  sarflanganVaqt,
  kechikkan,
  hozir,
}) {
  if (db.msUrinish?.findFirst) {
    const mavjud = await db.msUrinish.findFirst({
      where: {
        userId,
        OR: [{ sessiyaId: sessiya.sid }, { imtihonId: imtihon.id }],
      },
      select: { id: true },
    })
    if (mavjud) {
      return {
        status: 409,
        body: { error: "Siz bu imtihonni allaqachon topshirgansiz", takroriy: true },
      }
    }
  }

  let yaratilgan
  try {
    yaratilgan = await db.msUrinish.create({
      data: {
        sessiyaId: sessiya.sid,
        userId,
        slug: sessiya.slug,
        imtihonId: imtihon.id,
        urinishTartibi: 1,
        theta: natija.theta,
        se: natija.se,
        shkalaBalli: natija.shkalaBalli,
        daraja: natija.daraja,
        infitMNSQ: natija.infitMNSQ,
        outfitMNSQ: natija.outfitMNSQ,
        ishonchsiz: Boolean(natija.ishonchsiz),
        rawScore: natija.rawScore,
        jamiSavollar: natija.jamiSavollar,
        oddiyFoiz: natija.oddiyNatija?.oddiyFoiz ?? natija.foiz,
        oddiyBall: natija.oddiyNatija?.oddiyBall ?? natija.foiz,
        oddiyDaraja: natija.oddiyNatija?.oddiyBaho ?? null,
        holat: "topshirildi",
        sarflanganVaqt,
        kechikkan,
        boshlanganVaqt: new Date(sessiya.bosh),
        javoblar: {
          create: natija.savolNatijalari.map((s) => ({
            savolKalit: `${sessiya.slug}#${s.id}`,
            savolId: String(s.id),
            berilganJavob: s.berilganJavobSatri ?? null,
            togri: s.togri,
            javobBerildi: s.berilganJavob !== null && s.berilganJavob !== "",
            qiyinlik: s.qiyinlik,
          })),
        },
      },
    })
  } catch (error) {
    if (error?.code === "P2002") {
      return {
        status: 409,
        body: { error: "Bu sinov allaqachon topshirilgan", takroriy: true },
      }
    }
    throw error
  }

  const javobBerilganSoni = natija.savolNatijalari.filter(
    (s) => s.berilganJavob !== null && s.berilganJavob !== ""
  ).length

  await profilLogYoz({
    db,
    userId,
    toifa: "natija",
    amal: "MS_SINOV_TOPSHIRILDI",
    sarlavha: `MS sinovi topshirildi: ${examNomi(sessiya.slug, imtihon)}`,
    tafsilot: `${javobBerilganSoni}/${natija.jamiSavollar} javob · Natija e’lon qilinishi kutilmoqda`,
    holat: "ogohlantirish",
    meta: { slug: sessiya.slug, refId: yaratilgan?.id },
  })

  return {
    status: 200,
    body: {
      yashirin: true,
      qabulQilindi: {
        urinishId: yaratilgan?.id || sessiya.sid,
        slug: sessiya.slug,
        sarlavha: imtihon.sarlavha,
        holat: "topshirildi",
        topshirilganVaqt: new Date(hozir).toISOString(),
        javobBerilganSoni,
        jamiSavollar: natija.jamiSavollar,
        sarflanganVaqt,
        kechikkan,
        endsAt: imtihon.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
      },
    },
  }
}

/**
 * @param {object} p
 * @param {object} p.db Prisma mijozi
 * @param {object} p.sessiya Tekshirilgan token ma'lumoti
 * @param {object} p.javoblar Brauzer yuborgan javoblar
 * @param {string|null} p.userId Hozirgi foydalanuvchi
 * @param {string} p.toliqIsm
 * @param {string} p.sir
 * @param {number} [p.hozir]
 * @param {(slug: string) => object[]} [p.savollarOl]
 * @param {object|null} [p.imtihon]
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function yakunlaSinov({
  db,
  sessiya,
  javoblar,
  userId,
  toliqIsm,
  sir,
  hozir = Date.now(),
  savollarOl = getSavollarBySlug,
  imtihon: berilganImtihon,
  superadminmi = false,
}) {
  const bank = savollarOl(sessiya.slug)
  if (bank.length === 0) {
    return { status: 410, body: { error: "Bu sinov endi mavjud emas" } }
  }

  const imtihon = berilganImtihon !== undefined ? berilganImtihon : await imtihonniOl(db, sessiya.slug)
  const egasi = Boolean(userId) && sessiya.uid === userId

  if (!userId || !egasi) {
    return {
      status: 401,
      body: {
        error: "Milliy Sertifikat sinovini topshirish uchun shaxsiy profilingizga kiring.",
        loginKerak: true,
      },
    }
  }

  // Superadmin cheksiz sinov rejimi: istalgan vaqt topshiradi, darhol Rasch + Oddiy
  // tahlilini oladi, lekin bazaga (MsUrinish, QuizResult, Certificate) YOZILMAYDI.
  if (superadminmi) {
    const sarflanganVaqt = Math.max(
      0,
      Math.floor((Math.min(hozir, sessiya.tugash) - sessiya.bosh) / 1000)
    )
    const natija = hisoblaYakuniyNatija(
      sessiyaSavollari(bank, sessiya.sid, sir),
      javoblar,
      sarflanganVaqt,
      { toliqIsm }
    )
    natija.sertifikat = null
    natija.superadminSinovi = true
    natija.sertifikatIzoh =
      "Superadmin cheksiz nazorat rejimi: natija bazaga, kohort kalibrlashga, reytingga va sertifikatlarga yozilmadi."
    return { status: 200, body: { natija, superadminSinovi: true } }
  }

  const jadvalRejimi = Boolean(imtihon && imtihon.rejim === "jadval")

  if (jadvalRejimi) {
    const holatInfo = jadvalHolatiAniqlash(imtihon, hozir)
    if (imtihon.isAnnounced) {
      return { status: 403, body: { error: "Natijalar allaqachon e'lon qilingan, javob qabul qilinmaydi" } }
    }
    if (!imtihon.faol || holatInfo.holat === "kutilmoqda" || holatInfo.holat === "belgilanmagan") {
      return { status: 403, body: { error: holatInfo.xabar } }
    }
    // Imtihon tugashidan 15 daqiqadan ko'p o'tib ketsa qabul yopiladi
    const endsMs = imtihon.endsAt ? new Date(imtihon.endsAt).getTime() : null
    if (endsMs && hozir > endsMs + 15 * 60 * 1000) {
      return { status: 403, body: { error: "Imtihon topshirish muddati yakunlangan" } }
    }
  }

  const endsMs = jadvalRejimi && imtihon?.endsAt ? new Date(imtihon.endsAt).getTime() : sessiya.tugash
  const chegaraMs = Math.min(sessiya.tugash, endsMs)
  const kechikkan = hozir > chegaraMs + KECHIKISH_ZAXIRASI_MS
  const sarflanganVaqt = Math.max(0, Math.floor((Math.min(hozir, chegaraMs) - sessiya.bosh) / 1000))

  const natija = hisoblaYakuniyNatija(
    sessiyaSavollari(bank, sessiya.sid, sir),
    javoblar,
    sarflanganVaqt,
    { toliqIsm }
  )

  if (jadvalRejimi) {
    return await saqlaJadvalUrinishi({
      db,
      imtihon,
      sessiya,
      natija,
      userId,
      sarflanganVaqt,
      kechikkan,
      hozir,
    })
  }

  // Erkin mashq rejimi: natija darhol qaytadi
  const yozuv = {
    sessiya,
    natija,
    userId,
    sarflanganVaqt,
    kechikkan,
    imtihonId: imtihon?.id || null,
    holat: "elon_qilindi",
  }

  if (kechikkan) {
    const darajaYetdi = Boolean(natija.sertifikat)
    natija.sertifikat = null
    if (darajaYetdi) {
      natija.sertifikatIzoh = "Vaqt tugaganidan keyin topshirilgani uchun sertifikat berilmadi."
    }
    await yozUrinish(db, yozuv)
    await profilLogYoz({
      db,
      userId,
      toifa: "natija",
      amal: "MS_SINOV_TOPSHIRILDI",
      sarlavha: `MS sinovi topshirildi: ${examNomi(sessiya.slug, imtihon)}`,
      tafsilot: `Daraja: ${natija.daraja} · T-ball: ${Number(natija.shkalaBalli).toFixed(1)} (kechikkan)`,
      holat: "ogohlantirish",
      meta: { slug: sessiya.slug, daraja: natija.daraja },
    })
    return { status: 200, body: { natija } }
  }

  const examName = examNomi(sessiya.slug, imtihon)

  try {
    await db.$transaction(async (tx) => {
      await tx.quizResult.create({
        data: {
          attemptId: `ms-${sessiya.sid}`,
          userId,
          quizName: examName,
          score: natija.rawScore,
          totalQuestions: natija.jamiSavollar,
          percentage: natija.foiz,
          timeSpent: sarflanganVaqt,
        },
      })

      if (natija.sertifikat) {
        const certMeta = sertifikatMetadataObyekti({
          rasch: natija,
          oddiy: natija.oddiyNatija,
          sarflanganVaqt,
          slug: sessiya.slug,
          kalibrlashUsuli: "taxminiy",
        })
        await tx.certificate.create({
          data: {
            certId: natija.sertifikat.certId,
            userId,
            fullName: natija.sertifikat.fullName,
            fan: "Kimyo",
            reason: "JDA Kimyo tayyorgarlik sinovi natijasi (davlat sertifikati emas)",
            turi: SERTIFIKAT_TURLARI.milliy,
            metadata: certMeta,
            description: JSON.stringify(certMeta),
            examName,
            grade: natija.daraja,
            score: Math.round(natija.shkalaBalli),
            percentage: natija.foiz,
            expiresAt: new Date(natija.sertifikat.expiresAt),
            status: "valid",
          },
        })
      }
    })
  } catch (error) {
    if (error?.code === "P2002") {
      return {
        status: 409,
        body: { error: "Bu sinov allaqachon topshirilgan", takroriy: true },
      }
    }
    throw error
  }

  await yozUrinish(db, yozuv)
  await profilLogYoz({
    db,
    userId,
    toifa: "natija",
    amal: "MS_SINOV_TOPSHIRILDI",
    sarlavha: `MS sinovi topshirildi: ${examName}`,
    tafsilot: `Daraja: ${natija.daraja} · T-ball: ${Number(natija.shkalaBalli).toFixed(1)}`,
    holat: "muvaffaqiyat",
    meta: { slug: sessiya.slug, daraja: natija.daraja },
  })
  if (natija.sertifikat?.certId) {
    await profilLogYoz({
      db,
      userId,
      toifa: "sertifikat",
      amal: "SERTIFIKAT_BERILDI",
      sarlavha: `Sertifikat: ${examName}`,
      tafsilot: `${natija.sertifikat.certId} · Daraja: ${natija.daraja}`,
      holat: "muvaffaqiyat",
      meta: { certId: natija.sertifikat.certId },
    })
  }
  return { status: 200, body: { natija } }
}

/**
 * E'lon qilingan imtihon natijasini saqlangan MsUrinish + MsJavob + kalibrlashStats
 * asosida mijozga qayta quradi (Rasch + Oddiy + Wright Map + Savol tahlili + Sertifikat).
 */
export function qurPublishedNatija({ urinish, imtihon, aslSavollar = [], user = null, cert = null }) {
  const stats = imtihon?.kalibrlashStats || {}
  const metaMap = new Map((stats.savollarMeta || []).map((m) => [String(m.id), m]))
  const jMap = new Map()
  for (const j of urinish?.javoblar || []) {
    jMap.set(j.savolKalit, j)
    if (j.savolId !== undefined && j.savolId !== null) {
      jMap.set(`id:${j.savolId}`, j)
    }
  }

  const kalibrlanganSavollar = aslSavollar.map((s) => {
    const j = jMap.get(`${urinish.slug}#${s.id}`) || jMap.get(`id:${s.id}`) || null
    const meta = metaMap.get(String(s.id))
    const qiyinlik =
      meta?.qiyinlik !== undefined
        ? Number(meta.qiyinlik)
        : j?.qiyinlik !== undefined
        ? Number(j.qiyinlik)
        : Number(s.qiyinlik) || 0

    return {
      ...s,
      boshlangichQiyinlik: meta?.boshlangichQiyinlik ?? (Number(s.qiyinlik) || 0),
      qiyinlik,
      kohortTogriFoiz: meta?.kohortTogriFoiz ?? null,
    }
  })

  const savolNatijalari = kalibrlanganSavollar.map((s, index) => {
    const j = jMap.get(`${urinish.slug}#${s.id}`) || jMap.get(`id:${s.id}`) || null
    let berilgan = j?.berilganJavob ?? null
    if (typeof s.correct === "number" && Array.isArray(s.options) && berilgan !== null) {
      const idx = s.options.findIndex((o) => String(o) === String(berilgan))
      if (idx !== -1) berilgan = idx
    }
    return {
      id: s.id,
      index: index + 1,
      mavzu: s.mavzu || `${index + 1}-savol`,
      soha: s.soha || "Umumiy kimyo",
      qiyinlik: s.qiyinlik,
      boshlangichQiyinlik: s.boshlangichQiyinlik,
      kohortTogriFoiz: s.kohortTogriFoiz,
      turi: s.turi || "variant",
      berilganJavob: berilgan,
      togriJavob: s.correct,
      togri: Boolean(j?.togri),
      explanation: s.explanation || null,
    }
  })

  const raqamli = savolNatijalari.map((s) => (s.togri ? 1 : 0))
  const oddiyNatija = oddiyBahoHisobla(urinish.rawScore, urinish.jamiSavollar)
  const darajaInfo = aniqlaDaraja(urinish.shkalaBalli)

  // Ishonch oralig'i: T-shkalada kohort SD ishlatiladi, aks holda logit SE * 10
  const sdTheta = Number(stats.sdTheta) || 0
  const qadam = stats.tShkalaFaol && sdTheta >= 0.25 ? 10 / sdTheta : MS_SHKALA_STANDART.qadam
  const delta = MS_SHKALA_STANDART.ishonchZ * (Number(urinish.se) || 0.3) * qadam
  const ballPast = Math.max(0, Math.round((urinish.shkalaBalli - delta) * 10) / 10)
  const ballYuqori = Math.min(MS_SHKALA_STANDART.maks, Math.round((urinish.shkalaBalli + delta) * 10) / 10)

  const raschUmumiy = {
    theta: urinish.theta,
    se: urinish.se,
    shkalaBalli: urinish.shkalaBalli,
    infitMNSQ: urinish.infitMNSQ ?? 1.0,
    outfitMNSQ: urinish.outfitMNSQ ?? 1.0,
    ishonchsiz: Boolean(urinish.ishonchsiz),
    daraja: darajaInfo.daraja,
    darajaNomi: darajaInfo.darajaNomi,
    imtiyoz: darajaInfo.imtiyoz,
    tavsif: darajaInfo.tavsif,
    ballPast,
    ballYuqori,
  }

  const taqqoslash = taqqoslashTahlili(raschUmumiy, oddiyNatija, savolNatijalari)
  const wrightMapData = tuzWrightMap(urinish.theta, kalibrlanganSavollar, raqamli)

  const sohalarMap = {}
  savolNatijalari.forEach((s) => {
    if (!sohalarMap[s.soha]) sohalarMap[s.soha] = { jami: 0, togri: 0 }
    sohalarMap[s.soha].jami += 1
    if (s.togri) sohalarMap[s.soha].togri += 1
  })
  const sohalarStatistikasi = Object.entries(sohalarMap).map(([soha, d]) => ({
    soha,
    jami: d.jami,
    togri: d.togri,
    foiz: Math.round((d.togri / d.jami) * 100),
  }))

  let sertifikatIzoh = null
  if (!cert) {
    if (urinish.kechikkan) {
      sertifikatIzoh = "Vaqt tugaganidan keyin topshirilgani uchun sertifikat berilmadi."
    } else if (raschUmumiy.daraja === "Qoniqarsiz") {
      sertifikatIzoh = darajaInfo.imtiyoz
    }
  }

  return {
    rawScore: urinish.rawScore,
    jamiSavollar: urinish.jamiSavollar,
    foiz: oddiyNatija.oddiyFoiz,
    shkalaBalli: raschUmumiy.shkalaBalli,
    theta: raschUmumiy.theta,
    se: raschUmumiy.se,
    infitMNSQ: raschUmumiy.infitMNSQ,
    outfitMNSQ: raschUmumiy.outfitMNSQ,
    ballPast,
    ballYuqori,
    ishonchsiz: raschUmumiy.ishonchsiz,
    daraja: raschUmumiy.daraja,
    darajaNomi: raschUmumiy.darajaNomi,
    imtiyoz: raschUmumiy.imtiyoz,
    tavsif: raschUmumiy.tavsif,
    sarflanganVaqt: urinish.sarflanganVaqt || 0,
    oddiyNatija,
    taqqoslash,
    kohort: {
      rank: urinish.cohortRank ?? null,
      total: urinish.cohortTotal ?? stats.jamiUrinish ?? null,
      percentile: urinish.percentile ?? null,
      kalibrlashUsuli: imtihon?.kalibrlashUsuli || "taxminiy",
      tShkalaFaol: Boolean(stats.tShkalaFaol),
      yaroqliKohort: stats.yaroqliKohort ?? 0,
      ishonchlilik: stats.ishonchlilik ?? null,
      ortachaOddiyFoiz: stats.ortachaOddiyFoiz ?? null,
      ortachaRaschBall: stats.ortachaRaschBall ?? null,
      publishedAt: imtihon?.publishedAt ? new Date(imtihon.publishedAt).toISOString() : null,
    },
    wrightMapData,
    sohalarStatistikasi,
    savolNatijalari,
    savollar: kalibrlanganSavollar.map((s) => ({
      ...s,
      correct: undefined,
      altCorrect: undefined,
      explanation: undefined,
    })),
    sertifikat: cert
      ? {
          certId: cert.certId,
          fullName: cert.fullName,
          fan: cert.fan || "Kimyo",
          examName: cert.examName || imtihon?.sarlavha || null,
          daraja: raschUmumiy.daraja,
          shkalaBalli: raschUmumiy.shkalaBalli,
          theta: raschUmumiy.theta,
          se: raschUmumiy.se,
          oddiyBall: oddiyNatija.oddiyBall,
          oddiyFoiz: oddiyNatija.oddiyFoiz,
          rawScore: oddiyNatija.rawScore,
          jamiSavollar: oddiyNatija.jamiSavollar,
          issuedAt: cert.issuedAt ? new Date(cert.issuedAt).toISOString() : new Date().toISOString(),
          expiresAt: cert.expiresAt ? new Date(cert.expiresAt).toISOString() : null,
          status: cert.status || "valid",
          seals: Array.isArray(cert.seals) ? cert.seals : [],
          turi: cert.turi || SERTIFIKAT_TURLARI.milliy,
          metadata: cert.metadata ?? ajratSertifikatTavsifi(cert).meta,
          fullNameLocked: ajratSertifikatTavsifi(cert).fullNameLocked,
          imtiyoz: raschUmumiy.imtiyoz,
        }
      : null,
    sertifikatIzoh,
  }
}

/**
 * Admin tomonidan natijalarni hammaga bir vaqtda e'lon qilish:
 * 1) Barcha urinishlarni kohort CML bilan qayta kalibrlaydi,
 * 2) Har bir urinishda Rasch + Oddiy ballni saqlaydi,
 * 3) Malakali ishtirokchilarga QuizResult va Certificate yaratadi (dublikatsiz).
 */
export async function kalibrlaVaElonQil({ db, imtihon, aslSavollar, hozir = new Date() }) {
  const xomUrinishlar = await db.msUrinish.findMany({
    where: {
      AND: [
        { OR: [{ imtihonId: imtihon.id }, { slug: imtihon.slug }] },
        MS_REAL_URINISH_FILTR,
      ],
    },
    include: {
      javoblar: true,
      user: { select: { id: true, fullName: true, username: true, role: true } },
    },
    orderBy: { yakunlanganVaqt: "asc" },
  })
  const urinishlar = xomUrinishlar.filter((u) => !superadminUrinishimi(u))

  const kalibrlash = kohortKalibrlaVaHisobla(aslSavollar, urinishlar, { slug: imtihon.slug })
  const examName = examNomi(imtihon.slug, imtihon)
  const amalMuddat = new Date(hozir.getFullYear() + 3, hozir.getMonth(), hozir.getDate())

  let yaratilganSertifikatlar = 0
  const yangiCertIdlar = []
  const barchaCertIdlar = []
  const natijaMap = new Map(kalibrlash.yangilanganUrinishlar.map((y) => [y.urinishId, y]))

  for (const u of urinishlar) {
    const yangi = natijaMap.get(u.id)
    if (!yangi) continue

    let certId = u.certId || null
    const sertifikatOladi =
      !u.kechikkan && Boolean(u.userId) && yangi.rasch.daraja !== "Qoniqarsiz"

    if (sertifikatOladi) {
      if (!certId) certId = generatsiyaSertifikatId()
      barchaCertIdlar.push(certId)
      const certMeta = sertifikatMetadataObyekti({
        rasch: yangi.rasch,
        oddiy: yangi.oddiy,
        sarflanganVaqt: u.sarflanganVaqt,
        slug: imtihon.slug,
        kalibrlashUsuli: kalibrlash.kalibrlashUsuli,
      })
      const desc = JSON.stringify(certMeta)

      if (u.certId && db.certificate?.updateMany) {
        await db.certificate.updateMany({
          where: { certId: u.certId },
          data: {
            turi: SERTIFIKAT_TURLARI.milliy,
            grade: yangi.rasch.daraja,
            score: Math.round(yangi.rasch.shkalaBalli),
            percentage: yangi.oddiy.oddiyFoiz,
            percentile: yangi.percentile,
            metadata: certMeta,
            description: desc,
          },
        })
      } else if (db.certificate?.create) {
        await db.certificate.create({
          data: {
            certId,
            userId: u.userId,
            fullName: u.user?.fullName || u.user?.username || "Ishtirokchi",
            fan: "Kimyo",
            reason: "JDA Kimyo tayyorgarlik sinovi natijasi (davlat sertifikati emas)",
            turi: SERTIFIKAT_TURLARI.milliy,
            metadata: certMeta,
            description: desc,
            examName,
            grade: yangi.rasch.daraja,
            score: Math.round(yangi.rasch.shkalaBalli),
            percentage: yangi.oddiy.oddiyFoiz,
            percentile: yangi.percentile,
            expiresAt: amalMuddat,
            status: "valid",
          },
        })
        yaratilganSertifikatlar += 1
        yangiCertIdlar.push(certId)
      }
    }

    if (u.userId && db.quizResult?.upsert) {
      await db.quizResult.upsert({
        where: { attemptId: `ms-${u.sessiyaId}` },
        update: {
          score: yangi.oddiy.rawScore,
          totalQuestions: yangi.oddiy.jamiSavollar,
          percentage: yangi.oddiy.oddiyFoiz,
          timeSpent: u.sarflanganVaqt,
        },
        create: {
          attemptId: `ms-${u.sessiyaId}`,
          userId: u.userId,
          quizName: examName,
          score: yangi.oddiy.rawScore,
          totalQuestions: yangi.oddiy.jamiSavollar,
          percentage: yangi.oddiy.oddiyFoiz,
          timeSpent: u.sarflanganVaqt,
        },
      })
    }

    await db.msUrinish.update({
      where: { id: u.id },
      data: {
        imtihonId: imtihon.id,
        theta: yangi.rasch.theta,
        se: yangi.rasch.se,
        shkalaBalli: yangi.rasch.shkalaBalli,
        daraja: yangi.rasch.daraja,
        infitMNSQ: yangi.rasch.infitMNSQ,
        outfitMNSQ: yangi.rasch.outfitMNSQ,
        ishonchsiz: yangi.rasch.ishonchsiz,
        oddiyFoiz: yangi.oddiy.oddiyFoiz,
        oddiyBall: yangi.oddiy.oddiyBall,
        oddiyDaraja: yangi.oddiy.oddiyBaho,
        cohortRank: yangi.cohortRank,
        cohortTotal: yangi.cohortTotal,
        percentile: yangi.percentile,
        certId,
        holat: "elon_qilindi",
      },
    })

    for (const qItem of yangi.qiyinlikYangilash) {
      await db.msJavob.updateMany({
        where: { urinishId: u.id, savolKalit: qItem.savolKalit },
        data: { qiyinlik: qItem.qiyinlik },
      })
    }

    if (u.userId) {
      await profilLogYoz({
        db,
        userId: u.userId,
        toifa: "natija",
        amal: "MS_NATIJA_ELON",
        sarlavha: `MS natijasi e’lon qilindi: ${imtihon.sarlavha || imtihon.slug}`,
        tafsilot: `Daraja: ${yangi.rasch.daraja} · T-ball: ${Number(yangi.rasch.shkalaBalli).toFixed(1)}`,
        holat: "muvaffaqiyat",
        meta: { slug: imtihon.slug, daraja: yangi.rasch.daraja, refId: u.id },
      })
    }
  }

  const yangilanganImtihon = await db.msImtihon.update({
    where: { id: imtihon.id },
    data: {
      isAnnounced: true,
      publishedAt: imtihon.publishedAt || hozir,
      kalibrlanganAt: hozir,
      kalibrlashUsuli: kalibrlash.kalibrlashUsuli,
      kalibrlashStats: kalibrlash.kalibrlashStats,
    },
  })

  return {
    imtihon: yangilanganImtihon,
    kalibrlash,
    urinishlarSoni: urinishlar.length,
    yaratilganSertifikatlar,
    yangiCertIdlar,
    barchaCertIdlar,
  }
}
