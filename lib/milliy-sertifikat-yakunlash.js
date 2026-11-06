// lib/milliy-sertifikat-yakunlash.js
//
// Sinovni yakunlash mantig'i. Ball, daraja va sertifikat FAQAT shu yerda
// aniqlanadi (AGENTS.md 2-band).
//
// Nega route ichida emas: baza parametr bo'lib kelgani uchun login qilgan
// foydalanuvchi yo'lini jonli bazaga tegmasdan sinash mumkin.
import { hisoblaYakuniyNatija } from "./milliy-sertifikat-boshqaruvchi.js"
import { sessiyaSavollari } from "./milliy-sertifikat-aralashtirish.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "./milliy-sertifikat-data.js"
import { getSavollarBySlug } from "../data/milliy-sertifikat/savollar-ombromi.js"

// Nega zaxira kerak: taymer nolga yetganda brauzer javoblarni o'zi yuboradi va
// so'rov tarmoqda bir necha soniya yo'lda bo'ladi.
const KECHIKISH_ZAXIRASI_MS = 60 * 1000

/**
 * Kalibrlash uchun xom javoblarni yozadi.
 *
 * Nega xato tashqariga chiqmaydi: bu yozuv tahlil uchun. U yiqilsa, o'quvchi
 * allaqachon ishlab bo'lgan natijasini yo'qotmasligi kerak.
 */
async function yozUrinish(db, { sessiya, natija, userId, sarflanganVaqt, kechikkan }) {
  try {
    // Nega tartib kerak: qayta topshirganda o'quvchi javoblarni ko'rgan bo'ladi.
    // Bunday urinish savol qiyinligini noto'g'ri pasaytiradi, kalibrlash uni tashlaydi.
    const oldingilar = userId
      ? await db.msUrinish.count({ where: { userId, slug: sessiya.slug } })
      : null

    await db.msUrinish.create({
      data: {
        sessiyaId: sessiya.sid,
        userId,
        slug: sessiya.slug,
        urinishTartibi: oldingilar === null ? null : oldingilar + 1,
        theta: natija.theta,
        se: natija.se,
        shkalaBalli: natija.shkalaBalli,
        daraja: natija.daraja,
        rawScore: natija.rawScore,
        jamiSavollar: natija.jamiSavollar,
        sarflanganVaqt,
        kechikkan,
        boshlanganVaqt: new Date(sessiya.bosh),
        javoblar: {
          create: natija.savolNatijalari.map((s) => ({
            savolKalit: `${sessiya.slug}#${s.id}`,
            togri: s.togri,
            javobBerildi: s.berilganJavob !== null && s.berilganJavob !== "",
            qiyinlik: s.qiyinlik,
          })),
        },
      },
    })
  } catch (error) {
    // P2002: mehmon o'sha tokenni qayta yubordi, birinchi yozuv joyida turibdi
    if (error?.code !== "P2002") {
      console.error("[Milliy Sertifikat Urinish Yozuvi]", error)
    }
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
}) {
  // Sessiya ochiq turganda bank tozalangan bo'lishi mumkin
  const bank = savollarOl(sessiya.slug)
  if (bank.length === 0) {
    return { status: 410, body: { error: "Bu sinov endi mavjud emas" } }
  }

  const egasi = Boolean(userId) && sessiya.uid === userId
  const kechikkan = hozir > sessiya.tugash + KECHIKISH_ZAXIRASI_MS
  const sarflanganVaqt = Math.floor((Math.min(hozir, sessiya.tugash) - sessiya.bosh) / 1000)

  const natija = hisoblaYakuniyNatija(
    sessiyaSavollari(bank, sessiya.sid, sir),
    javoblar,
    sarflanganVaqt,
    { toliqIsm }
  )
  const yozuv = { sessiya, natija, userId: egasi ? userId : null, sarflanganVaqt, kechikkan }

  if (!egasi || kechikkan) {
    const darajaYetdi = Boolean(natija.sertifikat)
    natija.sertifikat = null
    if (darajaYetdi) {
      natija.sertifikatIzoh = kechikkan
        ? "Vaqt tugaganidan keyin topshirilgani uchun sertifikat berilmadi."
        : "Sertifikat olish uchun sinovni tizimga kirib topshiring."
    }
    await yozUrinish(db, yozuv)
    return { status: 200, body: { natija } }
  }

  const examName =
    MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === sessiya.slug)?.nom ||
    "Kimyo tayyorgarlik sinovi"

  try {
    await db.$transaction(async (tx) => {
      // Nega natija ham yoziladi: attemptId unique, ya'ni shu qator tokenni
      // bir martalik qiladi. U bo'lmasa javoblarni ko'rib, o'sha sessiyani
      // qayta yuborish mumkin bo'lardi.
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
        await tx.certificate.create({
          data: {
            certId: natija.sertifikat.certId,
            userId,
            fullName: natija.sertifikat.fullName,
            fan: "Kimyo",
            reason: "JDA Kimyo tayyorgarlik sinovi natijasi (davlat sertifikati emas)",
            description: JSON.stringify({
              theta: natija.theta,
              se: natija.se,
              infitMnsq: natija.infitMNSQ,
              outfitMnsq: natija.outfitMNSQ,
              shkalaBalli: natija.shkalaBalli,
              rawScore: natija.rawScore,
              jamiSavollar: natija.jamiSavollar,
              sarflanganVaqt,
              daraja: natija.daraja,
              model: "Georg Rasch IRT",
              examSlug: sessiya.slug,
            }),
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
  return { status: 200, body: { natija } }
}
