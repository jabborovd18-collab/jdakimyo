// lib/repititor-baza.js
//
// Kimyo-biologiya repititorlari interaktiv xaritasi (TutorPin) uchun
// ma'lumotlar bazasi qatlami, Haversine masofa hisoblagichi va hududlar
// koordinatalari. Serverni qayta ishga tushirmasdan ishlashi uchun
// jadvalni IF NOT EXISTS bilan yaratadi.

import { prisma } from '@/lib/prisma'

export const HUDUDLAR_XARITA = [
  { id: 'toshkent-sh', nom: 'Toshkent shahri', markaz: 'Chilonzor, Yunusobod, Beruniy, Oybek', lat: 41.3111, lng: 69.2797, zoom: 12 },
  { id: 'toshkent-v', nom: 'Toshkent viloyati', markaz: 'Chirchiq, Olmaliq, Angren, Nurafshon', lat: 41.0456, lng: 69.3586, zoom: 10 },
  { id: 'samarqand', nom: 'Samarqand', markaz: "Samarqand sh., Kattaqo'rg'on, Urgut", lat: 39.6542, lng: 66.9597, zoom: 11 },
  { id: 'buxoro', nom: 'Buxoro', markaz: "Buxoro sh., G'ijduvon, Kogon, Qorako'l", lat: 39.7747, lng: 64.4286, zoom: 11 },
  { id: 'fargona', nom: "Farg'ona", markaz: "Farg'ona sh., Qo'qon, Marg'ilon, Quva", lat: 40.3842, lng: 71.7843, zoom: 11 },
  { id: 'andijon', nom: 'Andijon', markaz: 'Andijon sh., Asaka, Shahrixon', lat: 40.7821, lng: 72.3442, zoom: 11 },
  { id: 'namangan', nom: 'Namangan', markaz: "Namangan sh., Chust, To'raqo'rg'on, Pop", lat: 40.9983, lng: 71.6726, zoom: 11 },
  { id: 'qashqadaryo', nom: 'Qashqadaryo', markaz: "Qarshi sh., Shahrisabz, Kitob, G'uzor", lat: 38.8606, lng: 65.7891, zoom: 11 },
  { id: 'surxondaryo', nom: 'Surxondaryo', markaz: 'Termiz sh., Denov, Sherobod, Boysun', lat: 37.2242, lng: 67.2783, zoom: 11 },
  { id: 'xorazm', nom: 'Xorazm', markaz: 'Urganch sh., Xiva, Hazorasp, Xonqa', lat: 41.55, lng: 60.6333, zoom: 11 },
  { id: 'navoiy', nom: 'Navoiy', markaz: 'Navoiy sh., Zarafshon, Karmana, Nurota', lat: 40.0844, lng: 65.3792, zoom: 11 },
  { id: 'jizzax', nom: 'Jizzax', markaz: "Jizzax sh., Zomin, G'allaorol, Do'stlik", lat: 40.1158, lng: 67.8422, zoom: 11 },
  { id: 'sirdaryo', nom: 'Sirdaryo', markaz: 'Guliston sh., Yangiyer, Sirdaryo t.', lat: 40.4897, lng: 68.7842, zoom: 11 },
  { id: 'qoraqalpogiston', nom: "Qoraqalpog'iston R.", markaz: "Nukus sh., To'rtko'l, Beruniy, Qo'ng'irot", lat: 42.4619, lng: 59.6166, zoom: 10 },
]

export const FAN_TURLARI = {
  kimyo_biologiya: {
    id: 'kimyo_biologiya',
    nom: 'Kimyo + Biologiya',
    qisqa: 'Kimyo · Biologiya',
    rang: '#10b981', // emerald
  },
  kimyo: {
    id: 'kimyo',
    nom: 'Kimyo',
    qisqa: 'Kimyo',
    rang: '#f59e0b', // amber
  },
  biologiya: {
    id: 'biologiya',
    nom: 'Biologiya',
    qisqa: 'Biologiya',
    rang: '#06b6d4', // cyan
  },
}

/**
 * Ikki geografik nuqta (lat1, lng1) va (lat2, lng2) orasidagi
 * masofani Haversine formulasi bo'yicha kilometrda hisoblaydi.
 */
export function masofaKm(lat1, lng1, lat2, lng2) {
  const a1 = Number(lat1)
  const o1 = Number(lng1)
  const a2 = Number(lat2)
  const o2 = Number(lng2)
  if (![a1, o1, a2, o2].every(Number.isFinite)) return null

  const R = 6371 // Yer radiusi (km)
  const dLat = ((a2 - a1) * Math.PI) / 180
  const dLng = ((o2 - o1) * Math.PI) / 180
  const rad1 = (a1 * Math.PI) / 180
  const rad2 = (a2 * Math.PI) / 180

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h =
    sinDLat * sinDLat +
    Math.cos(rad1) * Math.cos(rad2) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)))
  return Math.round(R * c * 100) / 100
}

export function masofaFormatla(km) {
  if (km === null || km === undefined || !Number.isFinite(km)) return null
  if (km < 1) {
    return `${Math.max(50, Math.round(km * 1000))} m`
  }
  return `${km.toFixed(1)} km`
}

/**
 * Koordinata O'zbekiston va unga tutash hududlar chegarasida ekanini tekshiradi.
 */
export function koordinataTogrimi(lat, lng) {
  const a = Number(lat)
  const o = Number(lng)
  if (!Number.isFinite(a) || !Number.isFinite(o)) return false
  return a >= 36.5 && a <= 46.0 && o >= 55.0 && o <= 74.5
}

/**
 * Berilgan (lat, lng) nuqtaga eng yaqin viloyat/hudud identifikatorini topadi.
 */
export function engYaqinHududId(lat, lng) {
  let engYaqin = HUDUDLAR_XARITA[0].id
  let minKm = Infinity
  for (const h of HUDUDLAR_XARITA) {
    const d = masofaKm(lat, lng, h.lat, h.lng)
    if (d !== null && d < minKm) {
      minKm = d
      engYaqin = h.id
    }
  }
  return engYaqin
}

let jadvalPromise = null

export async function repititorJadvaliniTayyorla() {
  if (jadvalPromise) return jadvalPromise

  jadvalPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "TutorPin" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "ism" TEXT NOT NULL,
          "fan" TEXT NOT NULL DEFAULT 'kimyo_biologiya',
          "sertifikat" TEXT NOT NULL DEFAULT 'A+',
          "markaz" TEXT NOT NULL DEFAULT '',
          "hudud" TEXT NOT NULL DEFAULT 'toshkent-sh',
          "tuman" TEXT NOT NULL DEFAULT '',
          "moljal" TEXT NOT NULL DEFAULT '',
          "lat" DOUBLE PRECISION NOT NULL,
          "lng" DOUBLE PRECISION NOT NULL,
          "telefon" TEXT NOT NULL DEFAULT '',
          "telegram" TEXT NOT NULL DEFAULT '',
          "narx" TEXT NOT NULL DEFAULT '',
          "tavsif" TEXT NOT NULL DEFAULT '',
          "tasdiqlangan" BOOLEAN NOT NULL DEFAULT true,
          "holat" TEXT NOT NULL DEFAULT 'faol',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "TutorPin_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "TutorPin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "TutorPin_hudud_holat_idx"
        ON "TutorPin"("hudud", "holat");
      `)
    } catch (err) {
      jadvalPromise = null
      console.warn('[repititorJadvaliniTayyorla ogohlantirish]:', err?.message || err)
    }
  })()

  return jadvalPromise
}

export async function repititorlarniOl({ hudud = null, fan = null, faqatFaol = true } = {}) {
  await repititorJadvaliniTayyorla()

  const qatorlar = await prisma.$queryRaw`
    SELECT
      t."id",
      t."userId",
      t."ism",
      t."fan",
      t."sertifikat",
      t."markaz",
      t."hudud",
      t."tuman",
      t."moljal",
      t."lat",
      t."lng",
      t."telefon",
      t."telegram",
      t."narx",
      t."tavsif",
      t."tasdiqlangan",
      t."holat",
      t."createdAt",
      u."userId" AS "muallifUserId",
      u."username" AS "muallifUsername",
      u."avatar" AS "muallifAvatar",
      u."isVerified" AS "muallifTasdiqlangan"
    FROM "TutorPin" t
    LEFT JOIN "User" u ON u."id" = t."userId"
    ORDER BY t."tasdiqlangan" DESC, t."createdAt" DESC
    LIMIT 300
  `

  return (qatorlar || [])
    .filter((r) => {
      if (faqatFaol && r.holat !== 'faol') return false
      if (hudud && hudud !== 'barchasi' && r.hudud !== hudud) return false
      if (fan && fan !== 'barchasi' && r.fan !== fan) return false
      return true
    })
    .map((r) => ({
      id: r.id,
      userId: r.userId || null,
      ism: r.ism,
      fan: r.fan,
      sertifikat: r.sertifikat,
      markaz: r.markaz || '',
      hudud: r.hudud,
      tuman: r.tuman || '',
      moljal: r.moljal || '',
      lat: Number(r.lat),
      lng: Number(r.lng),
      telefon: r.telefon || '',
      telegram: r.telegram || '',
      narx: r.narx || '',
      tavsif: r.tavsif || '',
      tasdiqlangan: Boolean(r.tasdiqlangan),
      holat: r.holat,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      muallif: r.userId
        ? {
            id: r.userId,
            userId: r.muallifUserId || null,
            username: r.muallifUsername || null,
            avatar: r.muallifAvatar || null,
            tasdiqlangan: Boolean(r.muallifTasdiqlangan),
          }
        : null,
    }))
}

export async function repititorQosh({
  userId = null,
  ism,
  fan = 'kimyo_biologiya',
  sertifikat = 'A+',
  markaz = '',
  hudud = '',
  tuman = '',
  moljal = '',
  lat,
  lng,
  telefon = '',
  telegram = '',
  narx = '',
  tavsif = '',
  tasdiqlangan = false,
  holat = 'faol',
}) {
  await repititorJadvaliniTayyorla()

  const tozaIsm = String(ism || '').trim().slice(0, 90)
  if (!tozaIsm) {
    throw new Error("Ustoz ism-sharifini kiriting")
  }

  const nLat = Number(lat)
  const nLng = Number(lng)
  if (!koordinataTogrimi(nLat, nLng)) {
    throw new Error("Xaritadan O'zbekiston hududidagi nuqtani tanlang")
  }

  const tozaFan = FAN_TURLARI[fan] ? fan : 'kimyo_biologiya'
  const tozaHudud =
    HUDUDLAR_XARITA.some((h) => h.id === hudud) ? hudud : engYaqinHududId(nLat, nLng)
  const tozaSertifikat = String(sertifikat || 'A+').trim().slice(0, 30)
  const tozaMarkaz = String(markaz || '').trim().slice(0, 100)
  const tozaTuman = String(tuman || '').trim().slice(0, 80)
  const tozaMoljal = String(moljal || '').trim().slice(0, 160)
  const tozaTelefon = String(telefon || '').trim().slice(0, 40)
  const tozaTelegram = String(telegram || '')
    .trim()
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^@/, '')
    .slice(0, 60)
  const tozaNarx = String(narx || '').trim().slice(0, 60)
  const tozaTavsif = String(tavsif || '').trim().slice(0, 350)

  const id = `rep_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const foydalanuvchiId = userId ? String(userId) : null
  const tasdiq = Boolean(tasdiqlangan)
  const holatQiymat = holat === 'kutilmoqda' ? 'kutilmoqda' : 'faol'

  await prisma.$executeRaw`
    INSERT INTO "TutorPin" (
      "id", "userId", "ism", "fan", "sertifikat", "markaz",
      "hudud", "tuman", "moljal", "lat", "lng",
      "telefon", "telegram", "narx", "tavsif",
      "tasdiqlangan", "holat", "createdAt"
    ) VALUES (
      ${id}, ${foydalanuvchiId}, ${tozaIsm}, ${tozaFan}, ${tozaSertifikat}, ${tozaMarkaz},
      ${tozaHudud}, ${tozaTuman}, ${tozaMoljal}, ${nLat}, ${nLng},
      ${tozaTelefon}, ${tozaTelegram}, ${tozaNarx}, ${tozaTavsif},
      ${tasdiq}, ${holatQiymat}, NOW()
    )
  `

  return {
    id,
    userId: foydalanuvchiId,
    ism: tozaIsm,
    fan: tozaFan,
    sertifikat: tozaSertifikat,
    markaz: tozaMarkaz,
    hudud: tozaHudud,
    tuman: tozaTuman,
    moljal: tozaMoljal,
    lat: nLat,
    lng: nLng,
    telefon: tozaTelefon,
    telegram: tozaTelegram,
    narx: tozaNarx,
    tavsif: tozaTavsif,
    tasdiqlangan: tasdiq,
    holat: holatQiymat,
    createdAt: new Date().toISOString(),
  }
}

export async function repititorOchir({ id, joriyUserId, superadmin = false }) {
  await repititorJadvaliniTayyorla()
  const pinId = String(id || '').trim()
  if (!pinId) throw new Error('ID topilmadi')

  const mavjud = await prisma.$queryRaw`
    SELECT "id", "userId" FROM "TutorPin" WHERE "id" = ${pinId} LIMIT 1
  `
  const pin = mavjud?.[0]
  if (!pin) throw new Error('Repititor nuqtasi topilmadi')

  if (!superadmin && (!joriyUserId || pin.userId !== String(joriyUserId))) {
    throw new Error("Faqat o'zingiz qo'shgan nuqtani o'chira olasiz")
  }

  await prisma.$executeRaw`
    DELETE FROM "TutorPin" WHERE "id" = ${pinId}
  `
  return { ok: true, id: pinId }
}

export async function repititorHolatYangila({ id, holat = 'faol', tasdiqlangan = true }) {
  await repititorJadvaliniTayyorla()
  const pinId = String(id || '').trim()
  if (!pinId) throw new Error('ID topilmadi')

  const yangiHolat = holat === 'kutilmoqda' ? 'kutilmoqda' : 'faol'
  const tasdiq = Boolean(tasdiqlangan)

  await prisma.$executeRaw`
    UPDATE "TutorPin"
    SET "holat" = ${yangiHolat}, "tasdiqlangan" = ${tasdiq}
    WHERE "id" = ${pinId}
  `
  return { ok: true, id: pinId, holat: yangiHolat, tasdiqlangan: tasdiq }
}
