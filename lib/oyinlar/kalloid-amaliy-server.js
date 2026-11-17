// lib/oyinlar/kalloid-amaliy-server.js
//
// "Kalloid Kimyo amaliy" mavsumiy ochiq dars o'yini uchun sof server mantiqi:
//   - 40 savoldan har bir talabaga 20 ta tasodifiy savol + aralashtirilgan A/B/C/D tanlash
//   - 10 daqiqalik (600 s) server vaqt nazorati va xavfsiz baholash
//   - Qat'iy natija proyektsiyasi: talabaga faqat foiz va soniya,
//     ustoz ekraniga esa faqat boshlaganlar soni hamda yakunlaganlar statistikasi chiqadi.

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { KALLOID_SAVOLLAR } from '../../data/oyinlar/kalloid-kimyo-amaliy.js'
import { ustozPaneliOchiqmi } from '../roles.js'
import { aralashtir, ochHolat, shifrlaHolat } from './oyin-token.js'

export const KALLOID_DARS_SLUG = 'kalloid-kimyo-amaliy'
export const KALLOID_DARS_NOMI = 'Kalloid Kimyo amaliy'
export const KALLOID_STANDART_KOD = 'KALLOID-2026'
export const KALLOID_SAVOL_SONI = 20
export const KALLOID_VAQT_LIMIT_SONIYA = 600
export const KALLOID_GRACE_SONIYA = 15
export const STAT_COOKIE_NOMI = 'jda_ochiq_dars_stat'
const STAT_TOKEN_SPACE = 'kalloid-amaliy-stat/v1'
const STAT_COOKIE_MUDDAT_MS = 12 * 60 * 60 * 1000

export const KALLOID_STANDART_TALABALAR = [
  { tartib: 1, ism: 'Abduazizova Baxtguli', qrToken: 'kk01-baxtguli' },
  { tartib: 2, ism: 'Abduraufov Sardor', qrToken: 'kk02-sardor' },
  { tartib: 3, ism: 'Alibekov Xoʻjamurod', qrToken: 'kk03-xojamurod' },
  { tartib: 4, ism: 'Aliqulova Shaxnoza', qrToken: 'kk04-shaxnoza' },
  { tartib: 5, ism: 'Amirqulova Umida', qrToken: 'kk05-umida-a' },
  { tartib: 6, ism: 'Boymurzayeva Dilshoda', qrToken: 'kk06-dilshoda' },
  { tartib: 7, ism: 'Elomonova Umida', qrToken: 'kk07-umida-e' },
  { tartib: 8, ism: 'Eshonova Sabrina', qrToken: 'kk08-sabrina' },
  { tartib: 9, ism: 'Fayzullayev Ravshan', qrToken: 'kk09-ravshan' },
  { tartib: 10, ism: 'Gʻayratova Dinora', qrToken: 'kk10-dinora' },
  { tartib: 11, ism: 'Ibodullayev Hayitali', qrToken: 'kk11-hayitali' },
  { tartib: 12, ism: 'Ismatova Saida', qrToken: 'kk12-saida' },
  { tartib: 13, ism: 'Kenjayeva Iroda', qrToken: 'kk13-iroda' },
  { tartib: 14, ism: 'Maxmudova Nilufar', qrToken: 'kk14-nilufar' },
  { tartib: 15, ism: 'Murodullayev Halimbek', qrToken: 'kk15-halimbek' },
  { tartib: 16, ism: 'Muxtarova Shaxriniso', qrToken: 'kk16-shaxriniso' },
  { tartib: 17, ism: 'Nomozova Marjona', qrToken: 'kk17-marjona' },
  { tartib: 18, ism: 'Nomozova Muxlisa', qrToken: 'kk18-muxlisa' },
  { tartib: 19, ism: 'Raxmanova Sevinch', qrToken: 'kk19-sevinch-r' },
  { tartib: 20, ism: 'Rahmatova Durdona', qrToken: 'kk20-durdona' },
  { tartib: 21, ism: 'Rustamov Aktamjon', qrToken: 'kk21-aktamjon' },
  { tartib: 22, ism: 'Tohirova Gulsanam', qrToken: 'kk22-gulsanam' },
  { tartib: 23, ism: 'Toshturdiyev Shohjahon', qrToken: 'kk23-shohjahon' },
  { tartib: 24, ism: 'Urinova Sevinch', qrToken: 'kk24-sevinch-u' },
  { tartib: 25, ism: 'Usibov Ravshan', qrToken: 'kk25-ravshan-u' },
  { tartib: 26, ism: 'Xolmuminova Bahor', qrToken: 'kk26-bahor' },
  { tartib: 27, ism: 'Xolnazarov Mirsodiq', qrToken: 'kk27-mirsodiq' },
  { tartib: 28, ism: 'Yangiboyeva Laylo', qrToken: 'kk28-laylo' },
]

function sha256Qisqa(matn) {
  return createHash('sha256').update(String(matn ?? '')).digest('hex').slice(0, 20)
}

export function qrTokenYarat() {
  return randomBytes(9).toString('base64url')
}

export function talabalarRoyxatiniAjrat(xomMatn = '') {
  const korilgan = new Set()
  const natija = []
  for (const qator of String(xomMatn ?? '').split(/\r?\n/)) {
    const toza = qator
      .replace(/^\s*\d+[\.\)]\s*/, '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 64)
    if (!toza) continue
    const kalit = toza.toLocaleLowerCase('uz')
    if (korilgan.has(kalit)) continue
    korilgan.add(kalit)
    natija.push(toza)
  }
  return natija
}

export function kirishKodiniNormallashtir(kod = '') {
  return String(kod ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
}

export function kirishKodiniTekshir(kiritilgan, haqiqiy) {
  const a = kirishKodiniNormallashtir(kiritilgan).toLocaleUpperCase('en-US')
  const b = kirishKodiniNormallashtir(haqiqiy).toLocaleUpperCase('en-US')
  if (!a || !b) return false
  const bufA = createHash('sha256').update(a).digest()
  const bufB = createHash('sha256').update(b).digest()
  return timingSafeEqual(bufA, bufB)
}

export function statTokenYarat(userId, dars) {
  if (!userId || !dars?.id) return null
  return shifrlaHolat(
    {
      userId: String(userId),
      darsId: String(dars.id),
      kodHash: sha256Qisqa(kirishKodiniNormallashtir(dars.kirishKodi).toLocaleUpperCase('en-US')),
    },
    STAT_TOKEN_SPACE,
    STAT_COOKIE_MUDDAT_MS,
  )
}

export function statTokenTekshir(token, userId, dars) {
  const holat = ochHolat(token, STAT_TOKEN_SPACE)
  if (!holat || !userId || !dars?.id) return false
  const kutilganHash = sha256Qisqa(kirishKodiniNormallashtir(dars.kirishKodi).toLocaleUpperCase('en-US'))
  return (
    holat.userId === String(userId)
    && holat.darsId === String(dars.id)
    && holat.kodHash === kutilganHash
  )
}

export function tasodifiySavolTanla(
  savolSoni = KALLOID_SAVOL_SONI,
  jami = KALLOID_SAVOLLAR.length,
) {
  const son = Math.max(1, Math.min(jami, Number(savolSoni) || KALLOID_SAVOL_SONI))
  const indekslar = Array.from({ length: jami }, (_, i) => i)
  const savolIndekslari = aralashtir(indekslar).slice(0, son)
  const variantTartibi = savolIndekslari.map(() => aralashtir([0, 1, 2, 3]))
  return { savolIndekslari, variantTartibi }
}

export function talabaSavollariniTayyorla(savolIndekslari, variantTartibi) {
  if (!Array.isArray(savolIndekslari) || !Array.isArray(variantTartibi)) return []
  return savolIndekslari.map((qIndeks, tartib) => {
    const savol = KALLOID_SAVOLLAR[qIndeks]
    const tartibXarita = Array.isArray(variantTartibi[tartib]) && variantTartibi[tartib].length === 4
      ? variantTartibi[tartib]
      : [0, 1, 2, 3]
    return {
      tartib: tartib + 1,
      id: savol.id,
      modul: savol.modul,
      matn: savol.matn,
      variantlar: tartibXarita.map((asl) => savol.variantlar[asl]),
    }
  })
}

export function qolganSoniyaHisobla(boshlanganVaqt, vaqtLimitSoniya = KALLOID_VAQT_LIMIT_SONIYA, hozir = new Date()) {
  if (!boshlanganVaqt) return vaqtLimitSoniya
  const otganSoniya = Math.floor((hozir.getTime() - new Date(boshlanganVaqt).getTime()) / 1000)
  return Math.max(0, vaqtLimitSoniya - Math.max(0, otganSoniya))
}

export function urinishniBahola({
  savolIndekslari,
  variantTartibi,
  javoblar,
  boshlanganVaqt,
  hozir = new Date(),
  vaqtLimitSoniya = KALLOID_VAQT_LIMIT_SONIYA,
}) {
  if (!Array.isArray(savolIndekslari) || savolIndekslari.length === 0) {
    throw new Error('Savollar ro‘yxati yaroqsiz.')
  }
  if (!Array.isArray(variantTartibi) || variantTartibi.length !== savolIndekslari.length) {
    throw new Error('Variantlar xaritasi yaroqsiz.')
  }

  const xomJavoblar = Array.isArray(javoblar) ? javoblar : []
  const tozalanganJavoblar = savolIndekslari.map((_, i) => {
    const tanlangan = xomJavoblar[i]
    return Number.isInteger(tanlangan) && tanlangan >= 0 && tanlangan <= 3 ? tanlangan : -1
  })

  let togriSoni = 0
  for (let i = 0; i < savolIndekslari.length; i += 1) {
    const tanlangan = tozalanganJavoblar[i]
    if (tanlangan < 0) continue
    const savol = KALLOID_SAVOLLAR[savolIndekslari[i]]
    const tartib = variantTartibi[i]
    if (!savol || !Array.isArray(tartib)) continue
    const aslIndeks = tartib[tanlangan]
    if (aslIndeks === savol.togriIndeks) {
      togriSoni += 1
    }
  }

  const otganMs = boshlanganVaqt ? hozir.getTime() - new Date(boshlanganVaqt).getTime() : 1000
  const sarflanganSoniya = Math.max(1, Math.min(vaqtLimitSoniya, Math.round(otganMs / 1000)))
  const foiz = Math.round((togriSoni / savolIndekslari.length) * 100)

  return {
    foiz,
    sarflanganSoniya,
    tozalanganJavoblar,
    _ichkiTogriSoni: togriSoni,
  }
}

/**
 * Ustoz ekrani uchun faqat agregat sonlar va yakunlagan talabalar natijasini qaytaradi.
 * Boshlagan / ishlayotgan / kutayotgan talabalar ismlari ataylab kiritilmaydi.
 */
export function statistikaRoyxatiniTuz(dars, ishtirokchilar = []) {
  let kutayotganSoni = 0
  let hozirYechmoqdaSoni = 0
  const yakunlaganlar = []

  for (const x of ishtirokchilar) {
    if (x.holat === 'yakunlandi') {
      yakunlaganlar.push({
        id: x.id,
        ism: x.ism,
        foiz: typeof x.foiz === 'number' ? Math.round(x.foiz) : 0,
        sarflanganSoniya: typeof x.sarflanganSoniya === 'number' ? x.sarflanganSoniya : 0,
        yakunlanganVaqt: x.yakunlanganVaqt ? new Date(x.yakunlanganVaqt).toISOString() : null,
      })
    } else if (x.holat === 'boshlandi') {
      hozirYechmoqdaSoni += 1
    } else {
      kutayotganSoni += 1
    }
  }

  yakunlaganlar.sort((a, b) => {
    if (b.foiz !== a.foiz) return b.foiz - a.foiz
    if (a.sarflanganSoniya !== b.sarflanganSoniya) return a.sarflanganSoniya - b.sarflanganSoniya
    return String(a.yakunlanganVaqt || '').localeCompare(String(b.yakunlanganVaqt || ''))
  })

  const yakunlaganSoni = yakunlaganlar.length
  const boshlaganSoni = hozirYechmoqdaSoni + yakunlaganSoni
  const ortachaFoiz = yakunlaganSoni > 0
    ? Math.round(yakunlaganlar.reduce((s, r) => s + r.foiz, 0) / yakunlaganSoni)
    : null
  const ortachaSoniya = yakunlaganSoni > 0
    ? Math.round(yakunlaganlar.reduce((s, r) => s + r.sarflanganSoniya, 0) / yakunlaganSoni)
    : null

  return {
    darsNom: dars?.nom || KALLOID_DARS_NOMI,
    savolSoni: dars?.savolSoni || KALLOID_SAVOL_SONI,
    vaqtLimitSoniya: dars?.vaqtLimitSoniya || KALLOID_VAQT_LIMIT_SONIYA,
    jamiIshtirokchi: ishtirokchilar.length,
    kutayotganSoni,
    hozirYechmoqdaSoni,
    boshlaganSoni,
    yakunlaganSoni,
    ortachaFoiz,
    ortachaSoniya,
    natijalar: yakunlaganlar,
  }
}

let jadvalTayyorPromise = null

export async function ochiqDarsJadvaliniTayyorla(prismaClient) {
  if (typeof prismaClient?.$executeRawUnsafe !== 'function') return
  if (jadvalTayyorPromise) return jadvalTayyorPromise

  jadvalTayyorPromise = (async () => {
    try {
      await prismaClient.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "OchiqDars" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "slug" TEXT NOT NULL,
          "nom" TEXT NOT NULL,
          "kirishKodi" TEXT NOT NULL DEFAULT 'KALLOID-2026',
          "vaqtLimitSoniya" INTEGER NOT NULL DEFAULT 600,
          "savolSoni" INTEGER NOT NULL DEFAULT 20,
          "faol" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `)
      await prismaClient.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "OchiqDars_slug_key" ON "OchiqDars"("slug");
      `)
      await prismaClient.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "OchiqDarsIshtirokchi" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "darsId" TEXT NOT NULL,
          "ism" TEXT NOT NULL,
          "qrToken" TEXT NOT NULL,
          "holat" TEXT NOT NULL DEFAULT 'kutmoqda',
          "savolIndekslari" JSONB,
          "variantTartibi" JSONB,
          "javoblar" JSONB,
          "boshlanganVaqt" TIMESTAMP(3),
          "yakunlanganVaqt" TIMESTAMP(3),
          "foiz" DOUBLE PRECISION,
          "sarflanganSoniya" INTEGER,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "OchiqDarsIshtirokchi_darsId_fkey" FOREIGN KEY ("darsId") REFERENCES "OchiqDars"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)
      await prismaClient.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "OchiqDarsIshtirokchi_qrToken_key" ON "OchiqDarsIshtirokchi"("qrToken");
      `)
      await prismaClient.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "OchiqDarsIshtirokchi_darsId_holat_idx" ON "OchiqDarsIshtirokchi"("darsId", "holat");
      `)
      await prismaClient.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "OchiqDarsIshtirokchi_darsId_ism_idx" ON "OchiqDarsIshtirokchi"("darsId", "ism");
      `)
    } catch (error) {
      jadvalTayyorPromise = null
      throw error
    }
  })()

  return jadvalTayyorPromise
}

export async function ensureKalloidDars(prismaClient) {
  await ochiqDarsJadvaliniTayyorla(prismaClient)
  const dars = await prismaClient.ochiqDars.upsert({
    where: { slug: KALLOID_DARS_SLUG },
    update: {},
    create: {
      slug: KALLOID_DARS_SLUG,
      nom: KALLOID_DARS_NOMI,
      kirishKodi: KALLOID_STANDART_KOD,
      vaqtLimitSoniya: KALLOID_VAQT_LIMIT_SONIYA,
      savolSoni: KALLOID_SAVOL_SONI,
      faol: true,
    },
  })

  if (
    typeof prismaClient?.ochiqDarsIshtirokchi?.count === 'function'
    && typeof prismaClient?.ochiqDarsIshtirokchi?.createMany === 'function'
  ) {
    const mavjudSoni = await prismaClient.ochiqDarsIshtirokchi.count({
      where: { darsId: dars.id },
    })
    if (mavjudSoni === 0) {
      await prismaClient.ochiqDarsIshtirokchi.createMany({
        data: KALLOID_STANDART_TALABALAR.map((t) => ({
          darsId: dars.id,
          ism: t.ism,
          qrToken: t.qrToken,
        })),
        skipDuplicates: true,
      })
    }
  }

  return dars
}

export async function ustozRuxsatiniTekshir(session, prismaClient) {
  if (!session?.user?.id) {
    return {
      ok: false,
      status: 401,
      holat: 'kirish_kerak',
      xato: 'Statistikani ko‘rish uchun avval profilingizga kiring.',
    }
  }
  if (!ustozPaneliOchiqmi(session.user)) {
    return {
      ok: false,
      status: 403,
      holat: 'ustoz_emas',
      xato: 'Bu oyna faqat ustoz paneli ochiq foydalanuvchilar uchun.',
    }
  }

  const dbUser = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, isTeacher: true, fullName: true, username: true },
  })
  const birlashgan = dbUser ? { ...dbUser, doskaTugaydi: session.user.doskaTugaydi } : null
  if (!ustozPaneliOchiqmi(birlashgan)) {
    return {
      ok: false,
      status: 403,
      holat: 'ustoz_emas',
      xato: 'Ustoz paneli ruxsati tasdiqlanmadi.',
    }
  }

  return { ok: true, user: dbUser }
}

export function prismaXatosiniIzohla(error) {
  const kod = error?.code
  if (kod === 'P2021' || kod === 'P2022' || kod === 'P1001' || kod === 'P1002') {
    return {
      status: 503,
      xato: 'Ma’lumotlar bazasi jadvali hali yangilanmagan yoki ulanish vaqtincha mavjud emas.',
    }
  }
  return {
    status: 500,
    xato: 'Server bilan bog‘lanishda xatolik yuz berdi.',
  }
}
