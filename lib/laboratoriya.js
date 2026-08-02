// lib/laboratoriya.js
//
// Laboratoriya savdosining YAGONA joyi.
//
// Hamma hisob shu yerda va HAR DOIM server tomonda bajariladi. Agar balans
// tekshiruvi yoki ayirish client'da bo'lsa, brauzer konsolidan cheksiz tanga
// olish mumkin bo'lardi — o'yin iqtisodiyoti bir kunda tugaydi.
//
// Har bir amal bitta tranzaksiyada: balans qayta o'qiladi, tekshiriladi,
// ayiriladi va inventar yangilanadi. Tranzaksiyasiz ikkita bir vaqtdagi
// so'rov bitta balansni ikki marta sarflashi mumkin edi.
import { prisma } from './prisma'

/** Bir amalda ko'pi bilan shuncha dona — tasodifiy nolni ushlab qoladi */
const MAX_SONI = 999

export class LabXatosi extends Error {
  constructor(message) {
    super(message)
    this.name = 'LabXatosi'
  }
}

/**
 * Vaqtinchalik baza to'qnashuvida qayta urinadi.
 *
 * Nega kerak: bir vaqtda bir necha xarid kelganda Prisma tranzaksiyalari
 * navbatga turadi va ba'zilari vaqt bo'yicha uziladi (P2028) yoki yozuv
 * to'qnashuvi beradi (P2034). Bu mantiqiy xato emas — foydalanuvchiga
 * "server xatosi" ko'rsatish o'rniga jimgina qayta urinamiz.
 */
async function urinib(fn, marta = 3) {
  let oxirgi
  for (let i = 0; i < marta; i++) {
    try {
      return await fn()
    } catch (e) {
      if (e instanceof LabXatosi) throw e // mantiqiy xato — qayta urinish ma'nosiz
      const vaqtinchalik = e?.code === 'P2034' || e?.code === 'P2028'
      if (!vaqtinchalik) throw e
      oxirgi = e
      await new Promise((r) => setTimeout(r, 40 * (i + 1)))
    }
  }
  throw oxirgi
}

function soniniTekshir(xom) {
  const n = Number(xom)
  if (!Number.isInteger(n) || n < 1 || n > MAX_SONI) {
    throw new LabXatosi(`Miqdor 1 dan ${MAX_SONI} gacha butun son bo'lishi kerak`)
  }
  return n
}

/**
 * Laboratoriyani qaytaradi, bo'lmasa yaratadi.
 *
 * Bo'sh laboratoriya — bu ataylab: foydalanuvchi uni o'zi to'ldiradi.
 */
export async function labniOl(userId) {
  const mavjud = await prisma.lab.findUnique({ where: { userId } })
  if (mavjud) return mavjud

  return prisma.lab.create({ data: { userId } })
}

/** Laboratoriya + inventar + balans */
export async function labHolati(userId) {
  const lab = await labniOl(userId)

  const [items, user] = await Promise.all([
    prisma.labItem.findMany({
      where: { labId: lab.id },
      include: { def: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true, gems: true, stars: true },
    }),
  ])

  return {
    lab: { id: lab.id, nom: lab.nom, daraja: lab.daraja, tajriba: lab.tajriba },
    balans: { coins: user?.coins ?? 0, gems: user?.gems ?? 0, stars: user?.stars ?? 0 },
    inventar: items.map((i) => ({
      kalit: i.kalit,
      soni: i.soni,
      nom: i.def.nom,
      turi: i.def.turi,
      guruh: i.def.guruh,
      icon: i.def.icon,
      nodirlik: i.def.nodirlik,
      sotishNarxi: i.def.sotishNarxi,
      sarflanadi: i.def.sarflanadi,
      tavsif: i.def.tavsif,
    })),
  }
}

/**
 * Sotib olish.
 *
 * @param valyuta 'coins' yoki 'gems' — bitta buyumni ikki xil yo'l bilan
 *        olish mumkin bo'lishi kerak: sandiq yagona yo'l bo'lib qolmasin.
 */
export async function xarid(userId, kalit, xomSoni = 1, valyuta = 'coins') {
  const soni = soniniTekshir(xomSoni)

  if (valyuta !== 'coins' && valyuta !== 'gems') {
    throw new LabXatosi('Valyuta noto\'g\'ri')
  }

  const lab = await labniOl(userId)

  // Katalog TRANZAKSIYADAN TASHQARIDA o'qiladi: u o'zgarmas ma'lumotnoma,
  // savdo bilan poyga qilmaydi. Tranzaksiya ichida qancha kam ish bo'lsa,
  // qulf shuncha qisqa ushlanadi va bir vaqtdagi so'rovlar uzilmaydi.
  const def = await prisma.labItemDef.findUnique({ where: { kalit } })
  if (!def || !def.isActive) throw new LabXatosi('Bunday buyum yo\'q')
  if (def.turi === 'texnika') {
    throw new LabXatosi('Texnika sotib olinmaydi — u laboratoriya darajasi bilan ochiladi')
  }

  const birlikNarx = valyuta === 'gems' ? def.gemsNarxi : def.narx
  if (!birlikNarx || birlikNarx <= 0) {
    throw new LabXatosi(
      valyuta === 'gems' ? 'Bu buyum olmosga sotilmaydi' : 'Bu buyum tangaga sotilmaydi',
    )
  }

  if (def.daraja > lab.daraja) {
    throw new LabXatosi(`Bu buyum uchun ${def.daraja}-daraja kerak`)
  }

  const jami = birlikNarx * soni

  return urinib(() => prisma.$transaction(async (tx) => {

    // Balans SHARTLI UPDATE bilan ayiriladi — oldin o'qib, keyin ayirib
    // bo'lmaydi.
    //
    // Nega: tranzaksiya ichida findUnique bilan o'qish yetarli emas.
    // Postgres'ning odatiy izolyatsiyasida (Read Committed) bir vaqtda
    // kelgan uchta so'rov ham eski balansni o'qiydi, uchalasi ham
    // tekshiruvdan o'tadi va uchalasi ham ayiradi — balans manfiyga tushadi.
    // Sinovda aynan shunday bo'ldi: 6 tanga bilan 3 ta 4 tangalik xarid
    // o'tib ketdi va balans −6 bo'ldi.
    //
    // Shart WHERE ichida bo'lsa, uni baza qatorni qulflab tekshiradi:
    // faqat bittasi o'tadi, qolganiga count = 0 qaytadi.
    const natija = await tx.user.updateMany({
      where: { id: userId, [valyuta]: { gte: jami } },
      data: { [valyuta]: { decrement: jami } },
    })

    if (natija.count === 0) {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { coins: true, gems: true },
      })
      const bor = valyuta === 'gems' ? user.gems : user.coins
      throw new LabXatosi(
        `Yetarli emas: ${jami} kerak, ${bor} bor (${valyuta === 'gems' ? 'olmos' : 'tanga'})`,
      )
    }

    await tx.labItem.upsert({
      where: { labId_kalit: { labId: lab.id, kalit } },
      create: { labId: lab.id, kalit, soni },
      update: { soni: { increment: soni } },
    })

    await tx.labTransaction.create({
      data: {
        labId: lab.id,
        turi: 'xarid',
        valyuta,
        miqdor: -jami,
        kalit,
        soni,
        izoh: `${def.nom} × ${soni}`,
      },
    })

    return { kalit, nom: def.nom, soni, sarflandi: jami, valyuta }
  }))
}

/**
 * Sotish — faqat tangaga va faqat sotiladigan buyum.
 *
 * Jihoz sotilmaydi (sotishNarxi = 0): sotib olingan asbob laboratoriyada
 * qoladi, aks holda "sotib ol → sot" aylanmasi ma'nosiz qatnov bo'lardi.
 */
export async function sotish(userId, kalit, xomSoni = 1) {
  const soni = soniniTekshir(xomSoni)
  const lab = await labniOl(userId)

  // Xariddagi kabi: tekshiruvlar tranzaksiyadan tashqarida, qulf qisqa bo'lsin.
  const item = await prisma.labItem.findUnique({
    where: { labId_kalit: { labId: lab.id, kalit } },
    include: { def: true },
  })

  if (!item) throw new LabXatosi('Bu buyum inventaringizda yo\'q')
  if (item.soni < soni) {
    throw new LabXatosi(`Inventarda ${item.soni} ta bor, ${soni} ta sotib bo'lmaydi`)
  }
  if (!item.def.sotishNarxi || item.def.sotishNarxi <= 0) {
    throw new LabXatosi(`${item.def.nom} sotilmaydi`)
  }

  const jami = item.def.sotishNarxi * soni

  return urinib(() => prisma.$transaction(async (tx) => {

    // Inventar ham shartli update bilan kamaytiriladi — xariddagi bilan
    // bir xil sabab: bir vaqtda kelgan ikkita sotish oxirgi donani ikki
    // marta sotib yuborishi mumkin edi.
    const kamaydi = await tx.labItem.updateMany({
      where: { id: item.id, soni: { gte: soni } },
      data: { soni: { decrement: soni } },
    })

    if (kamaydi.count === 0) {
      throw new LabXatosi('Inventarda yetarli emas')
    }

    // Nolga tushgan yozuv qoldirilmaydi
    await tx.labItem.deleteMany({ where: { id: item.id, soni: { lte: 0 } } })

    await tx.user.update({
      where: { id: userId },
      data: { coins: { increment: jami } },
    })

    await tx.labTransaction.create({
      data: {
        labId: lab.id,
        turi: 'sotish',
        valyuta: 'coins',
        miqdor: jami,
        kalit,
        soni,
        izoh: `${item.def.nom} × ${soni}`,
      },
    })

    return { kalit, nom: item.def.nom, soni, olindi: jami }
  }))
}
