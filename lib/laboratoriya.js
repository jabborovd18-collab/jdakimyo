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
import { donadanMiqdor, miqdorniFormatla, yetadimi } from './lab-birlik'
import { inventarQosh, inventarSarfla, boshYozuvlarniOchir, cheksizKalitlar } from './lab-inventar'
import { sanaVaqt } from './sana'

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
 * Uchta kod vaqtinchalik hisoblanadi:
 *
 *   P2028 — tranzaksiya vaqt bo'yicha uzildi (navbatda kutib qoldi)
 *   P2034 — yozuv to'qnashuvi / deadlock
 *   P2002 — noyoblik cheklovi buzildi
 *
 * P2002 nima uchun: `upsert` atomik emas. Bir vaqtda kelgan ikkita amal
 * bir xil inventar qatorini qidiradi, ikkalasi ham topmaydi va ikkalasi
 * ham INSERT qilmoqchi bo'ladi — biri noyoblik cheklovига uriladi. Bu
 * mantiqiy xato emas: qayta urinilganda qator allaqachon bor bo'ladi va
 * UPDATE yo'li bilan o'tadi.
 *
 * Bularning hech biri foydalanuvchining xatosi emas, shuning uchun unga
 * "server xatosi" ko'rsatish o'rniga jimgina qayta urinamiz.
 */
export async function urinib(fn, marta = 4) {
  let oxirgi
  for (let i = 0; i < marta; i++) {
    try {
      return await fn()
    } catch (e) {
      if (e instanceof LabXatosi) throw e // mantiqiy xato — qayta urinish ma'nosiz
      const vaqtinchalik = e?.code === 'P2034' || e?.code === 'P2028' || e?.code === 'P2002'
      if (!vaqtinchalik) throw e
      oxirgi = e
      await new Promise((r) => setTimeout(r, 50 * (i + 1)))
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
 * Xarid taqiqi kuchdami.
 *
 * Muddati o'tgan taqiq bazadan tozalanmaydi — shunchaki kuchini yo'qotadi.
 * Shu sababli "qachon va nima uchun taqiqlangan edi" degan ma'lumot
 * saqlanib qoladi va keyin savolga javob bor bo'ladi.
 *
 * @param {{spendBlockedUntil: Date|null, spendBlockedReason: string|null}} user
 * @returns {{gacha: Date, sabab: string|null}|null}
 */
export function taqiqKuchdami(user) {
  const gacha = user?.spendBlockedUntil
  if (!gacha) return null
  const sana = new Date(gacha)
  if (sana <= new Date()) return null
  return { gacha: sana, sabab: user.spendBlockedReason || null }
}

/**
 * Xarid taqiqi bo'lsa xato tashlaydi.
 *
 * Har bir sarflaydigan amal shu yerdan o'tadi: do'kondagi xarid ham,
 * pullik sandiq ham. Bitta joyda bo'lmasa, yangi sarflash yo'li
 * qo'shilganda taqiqni unutib qoldirish juda oson.
 */
export async function taqiqniTekshir(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { spendBlockedUntil: true, spendBlockedReason: true },
  })

  const taqiq = taqiqKuchdami(user)
  if (!taqiq) return

  throw new LabXatosi(
    `Xarid vaqtincha to'xtatilgan (${sanaVaqt(taqiq.gacha)} gacha)` +
      (taqiq.sabab ? `. Sabab: ${taqiq.sabab}` : '') +
      '. Bu vaqtda ham o\'qish, quiz va missiyalar ishlayveradi.',
  )
}

/**
 * Laboratoriya darajasi — to'plangan tajribadan (XP).
 *
 * lib/daraja.js dagi akkaunt darajasi bilan bir xil shakl (kvadrat o'sish):
 * boshida daraja tez ko'tariladi, keyin sekinlashadi, lekin to'xtamaydi.
 * Bo'luvchi 20 — bitta kashfiyot (25 XP) darhol 2-darajani beradi,
 * 5-darajaga esa ~14 ta kashfiyot kerak. Texnikalarning eng yuqorisi
 * 5-darajada ochiladi.
 *
 * Bu yerda turibdi, tajriba.js da emas: daraja xarid darvozasida ham
 * kerak, va u faylni chaqirsa fayllar bir-birini import qilib qolardi.
 */
export function labDaraja(tajriba) {
  const t = Number(tajriba)
  if (!Number.isFinite(t) || t <= 0) return 1
  return Math.floor(Math.sqrt(t / 20)) + 1
}

/** Keyingi darajagacha qancha qolgani — progress chizig'i uchun */
export function labDarajaHolati(tajriba) {
  const t = Math.max(0, Number(tajriba) || 0)
  const d = labDaraja(t)
  const shu = (d - 1) ** 2 * 20
  const keyingi = d ** 2 * 20
  return {
    daraja: d,
    joriy: t - shu,
    kerak: keyingi - shu,
    foiz: Math.min(100, Math.round(((t - shu) / (keyingi - shu)) * 100)),
  }
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

  const [items, cheksizlar, user] = await Promise.all([
    prisma.labItem.findMany({
      where: { labId: lab.id },
      include: { def: true },
      orderBy: { updatedAt: 'desc' },
    }),
    // Cheksiz manbalar (jo'mrak suvi) inventarda yozuv OCHMAYDI — ular
    // sarflanmaydi, ya'ni saqlanadigan qiymati yo'q. Lekin javonda
    // ko'rinmasa, foydalanuvchi ularni tanlay olmaydi va bepul suv
    // borligini umuman bilmaydi. Shuning uchun katalogdan qo'shiladi.
    // Shartli cheksizlar ham olinadi: distillagich o'rnatgan odam uchun
    // distillangan suv ham tugamaydigan manba bo'lib qoladi.
    prisma.labItemDef.findMany({
      where: {
        isActive: true,
        OR: [{ cheksiz: true }, { cheksizAgar: { not: null } }],
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true, gems: true, stars: true, fullName: true, username: true },
    }),
  ])

  // Foydalanuvchida bor kalitlar — shartli cheksizlikni shu hal qiladi
  const borKalitlar = new Set(items.map((i) => i.kalit))
  const cheksizToplam = cheksizKalitlar(cheksizlar, borKalitlar)

  return {
    lab: {
      id: lab.id,
      nom: lab.nom,
      daraja: lab.daraja,
      tajriba: lab.tajriba,
      darajaHolati: labDarajaHolati(lab.tajriba),
    },
    balans: { coins: user?.coins ?? 0, gems: user?.gems ?? 0, stars: user?.stars ?? 0 },
    // Hisobot sarlavhasida ko'rsatish uchun. Ilgari 3D laboratoriya
    // `labMaLumot?.foydalanuvchi?.ism` ni o'qirdi, lekin bunday maydon
    // umuman qaytarilmasdi — PDF da ism har doim "Talaba" chiqardi.
    // `User` modelida `name` maydoni YO'Q — `fullName` (ixtiyoriy) va
    // `username` (majburiy) bor. To'liq ism bo'lmasa username ishlatiladi.
    foydalanuvchi: { ism: user?.fullName || user?.username || null },
    inventar: [
      // Cheksiz manbalar oldinda: ular har doim bor va eng ko'p
      // ishlatiladigani (suv) qidirmasdan topilsin.
      ...cheksizlar
        .filter((d) => cheksizToplam.has(d.kalit))
        .map((d) => ({
        kalit: d.kalit,
        soni: 0,
        miqdor: null,
        birlik: d.birlik,
        cheksiz: true,
        matn: 'cheksiz',
        nom: d.nom,
        turi: d.turi,
        guruh: d.guruh,
        icon: d.icon,
        nodirlik: d.nodirlik,
        sotishNarxi: 0,
        sarflanadi: d.sarflanadi,
        tavsif: d.tavsif,
      })),
      // Cheksizga aylangan modda ikki marta chiqmasin: uning ombordagi
      // qoldig'i endi ahamiyatsiz, manba tugamaydi.
      ...items
        .filter((i) => !cheksizToplam.has(i.kalit))
        .map((i) => ({
      kalit: i.kalit,
      // `soni` — eski, dona hisobidagi maydon; interfeyslar unga hamon
      // tayanadi. `miqdor` haqiqiy o'lchov, `matn` esa tayyor ko'rinish
      // ("75 ml", "5 g") — har bir sahifa formatlashni qaytadan yozmasin.
      soni: i.soni,
      miqdor: i.miqdor,
      birlik: i.def.birlik,
      matn: miqdorniFormatla(i.miqdor, i.def.birlik),
      nom: i.def.nom,
      turi: i.def.turi,
      guruh: i.def.guruh,
      icon: i.def.icon,
      nodirlik: i.def.nodirlik,
      sotishNarxi: i.def.sotishNarxi,
      cheksiz: false,
      sarflanadi: i.def.sarflanadi,
      tavsif: i.def.tavsif,
      })),
    ],
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

  await taqiqniTekshir(userId)

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

    // Do'kon DONALAB sotadi, inventar esa miqdorda yashaydi: bitta dona
    // suyuqlik 25 ml, qattiq modda 5 g (lib/lab-birlik.js). Jihoz uchun
    // ulush 1, ya'ni dona va miqdor bir xil.
    await inventarQosh(tx, lab.id, kalit, donadanMiqdor(soni, def.birlik), def.birlik)

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
  // Tekshiruv MIQDOR bo'yicha, `soni` bo'yicha emas. `soni` miqdordan
  // pastga yaxlitlab olinadi, ya'ni u ba'zan borini kam ko'rsatadi — sotuvni
  // unga qarab hal qilsak, foydalanuvchi o'zining bor moddasini sota olmay
  // qolardi.
  const sotiladiganMiqdor = donadanMiqdor(soni, item.def.birlik)
  if (!yetadimi(item.miqdor, sotiladiganMiqdor)) {
    throw new LabXatosi(
      `Inventarda ${miqdorniFormatla(item.miqdor, item.def.birlik)} bor, ` +
        `${miqdorniFormatla(sotiladiganMiqdor, item.def.birlik)} sotib bo'lmaydi`,
    )
  }
  if (!item.def.sotishNarxi || item.def.sotishNarxi <= 0) {
    throw new LabXatosi(`${item.def.nom} sotilmaydi`)
  }

  const jami = item.def.sotishNarxi * soni

  return urinib(() => prisma.$transaction(async (tx) => {

    // Inventar ham shartli update bilan kamaytiriladi — xariddagi bilan
    // bir xil sabab: bir vaqtda kelgan ikkita sotish oxirgi donani ikki
    // marta sotib yuborishi mumkin edi.
    const yetdi = await inventarSarfla(
      tx, lab.id, kalit, sotiladiganMiqdor, item.def.birlik,
    )

    if (!yetdi) {
      throw new LabXatosi('Inventarda yetarli emas')
    }

    // Nolga tushgan yozuv qoldirilmaydi
    await boshYozuvlarniOchir(tx, lab.id)

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
