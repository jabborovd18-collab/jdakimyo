// lib/sandiq.js
//
// Sandiq ochish — TO'LIQ SERVER TOMONDA.
//
// Tasodif client'da bo'lsa, brauzer konsolidan istalgan natijani "chiqarib
// olish" mumkin bo'lardi: foydalanuvchi javobni o'zi yozadi. Shuning uchun
// nima tushgani shu yerda hal qilinadi va faqat natija yuboriladi.
//
// Tasodif manbai — crypto.getRandomValues. Math.random() bashorat qilinadigan
// va ba'zi muhitlarda takrorlanadigan ketma-ketlik beradi; mukofot hal
// qilinadigan joyda unga tayanmaymiz.
import { prisma } from './prisma'
import { LabXatosi, labniOl, taqiqniTekshir, urinib } from './laboratoriya'

const SANDIQLAR = require('../data/laboratoriya/sandiqlar.js')

/** Kun chegarasi — kunlik missiyalar bilan bir xil (UTC yarim tuni) */
function kunBoshi() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/** [0, chegara) oralig'ida kriptografik tasodifiy butun son */
function tasodifiy(chegara) {
  if (chegara <= 0) return 0
  const bayt = new Uint32Array(1)
  // Moduldan kelib chiqadigan siljishni yo'qotamiz: chegaraga bo'linmaydigan
  // yuqori diapazon tashlanadi. Nodir buyum ehtimoli aynan shu joyda
  // buzilishi mumkin edi.
  const chek = Math.floor(0xffffffff / chegara) * chegara
  let q
  do {
    crypto.getRandomValues(bayt)
    q = bayt[0]
  } while (q >= chek)
  return q % chegara
}

/** Ehtimollar bo'yicha nodirlik tanlaydi */
function nodirlikniTanla(ehtimollar) {
  const yigindi = Object.values(ehtimollar).reduce((a, b) => a + b, 0)
  let n = tasodifiy(yigindi)
  for (const [nodirlik, ogirlik] of Object.entries(ehtimollar)) {
    if (n < ogirlik) return nodirlik
    n -= ogirlik
  }
  return 'oddiy'
}

export function sandiqniTop(kalit) {
  return SANDIQLAR.find((s) => s.kalit === kalit) || null
}

/** Sahifada ko'rsatish uchun: sandiqlar va ularning ehtimollari */
export async function sandiqRoyxati(userId) {
  const lab = await labniOl(userId)
  const bugun = kunBoshi()
  const kunlikOlingan =
    lab.oxirgiKunlikSandiq !== null && new Date(lab.oxirgiKunlikSandiq) >= bugun

  return SANDIQLAR.map((s) => ({
    kalit: s.kalit,
    nom: s.nom,
    icon: s.icon,
    tavsif: s.tavsif,
    narx: s.narx,
    buyumSoni: s.buyumSoni,
    ehtimollar: s.ehtimollar,
    kunlik: Boolean(s.kunlik),
    ochilgan: s.kunlik ? kunlikOlingan : false,
  }))
}

/**
 * Sandiqni ochadi: pulni ayiradi, buyumlarni beradi, jurnalga yozadi.
 * Hammasi bitta tranzaksiyada — yarim ochilgan sandiq bo'lmasligi kerak.
 */
export async function sandiqniOch(userId, sandiqKaliti) {
  const sandiq = sandiqniTop(sandiqKaliti)
  if (!sandiq) throw new LabXatosi('Bunday sandiq yo\'q')

  // Bepul kunlik sandiq taqiq paytida ham ochiladi: taqiq SARFLASHNI
  // to'xtatadi, hisobni butunlay muzlatmaydi.
  if (sandiq.narx) await taqiqniTekshir(userId)

  // BEPUL SANDIQ — TASDIQLANGAN EMAIL BILAN.
  //
  // Undan tushgan buyumlarni sotib tanga qilish mumkin, ya'ni u ham
  // tanga manbai. Pullik sandiqqa bu shart qo'yilmaydi: unda odam
  // allaqachon topgan tangasini sarflaydi, yangi tanga yaratmaydi.
  if (!sandiq.narx) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    })
    if (!user?.emailVerified) {
      throw new LabXatosi('Bepul sandiqni ochish uchun avval emailingizni tasdiqlang')
    }
  }

  const lab = await labniOl(userId)
  const bugun = kunBoshi()

  // Nodirlik bo'yicha nomzodlar — tranzaksiyadan tashqarida o'qiladi,
  // katalog o'zgarmas ma'lumotnoma.
  //
  // `narx > 0` sharti muhim: katalogda faqat tajribada hosil bo'ladigan
  // moddalar ham bor (narxi yo'q). Ular sandiqdan tushsa, "yasab olish"
  // degan yagona yo'l buzilardi va sandiq mazmunini yo'qotardi.
  const nomzodlar = await prisma.labItemDef.findMany({
    where: { isActive: true, turi: 'reagent', narx: { gt: 0 } },
    select: { kalit: true, nom: true, nodirlik: true, icon: true, sotishNarxi: true },
  })

  const nodirlikBoyicha = {}
  for (const n of nomzodlar) {
    ;(nodirlikBoyicha[n.nodirlik] ||= []).push(n)
  }

  // Nima tushishi SHU YERDA hal qilinadi
  const tushgan = []
  for (let i = 0; i < sandiq.buyumSoni; i++) {
    let nodirlik = nodirlikniTanla(sandiq.ehtimollar)
    // Katalogda o'sha nodirlikda buyum bo'lmasa, pastroqqa tushamiz
    const tartib = ['noyob', 'nodir', 'kam', 'oddiy']
    let idx = tartib.indexOf(nodirlik)
    while (idx < tartib.length && !(nodirlikBoyicha[tartib[idx]] || []).length) idx++
    if (idx >= tartib.length) continue
    nodirlik = tartib[idx]

    const royxat = nodirlikBoyicha[nodirlik]
    tushgan.push(royxat[tasodifiy(royxat.length)])
  }

  if (tushgan.length === 0) throw new LabXatosi('Sandiq bo\'sh chiqdi, qayta urinib ko\'ring')

  // Bir xil buyum bir necha marta tushishi mumkin — yig'amiz
  const yigilgan = new Map()
  for (const t of tushgan) {
    yigilgan.set(t.kalit, (yigilgan.get(t.kalit) || 0) + 1)
  }

  // Savdodagi kabi qayta urinish bilan: bir vaqtda kelgan ochishlar bir xil
  // inventar qatorini yaratmoqchi bo'lib to'qnashishi mumkin.
  await urinib(() => prisma.$transaction(async (tx) => {
    if (sandiq.kunlik) {
      // Kunlik sandiq — shartli update: bugun olinmagan bo'lsagina o'tadi.
      // Oddiy tekshiruv bo'lsa, ikkita bir vaqtdagi so'rov ikkalasi ham
      // o'tib ketardi.
      const natija = await tx.lab.updateMany({
        where: {
          id: lab.id,
          OR: [{ oxirgiKunlikSandiq: null }, { oxirgiKunlikSandiq: { lt: bugun } }],
        },
        data: { oxirgiKunlikSandiq: new Date() },
      })
      if (natija.count === 0) {
        throw new LabXatosi('Kunlik sandiq bugun allaqachon olingan. Ertaga qaytib keling.')
      }
    } else {
      const valyuta = sandiq.narx.gems ? 'gems' : 'coins'
      const miqdor = sandiq.narx.gems || sandiq.narx.coins

      const natija = await tx.user.updateMany({
        where: { id: userId, [valyuta]: { gte: miqdor } },
        data: { [valyuta]: { decrement: miqdor } },
      })
      if (natija.count === 0) {
        throw new LabXatosi(
          `Yetarli emas: ${miqdor} ${valyuta === 'gems' ? 'olmos' : 'tanga'} kerak`,
        )
      }

      await tx.labTransaction.create({
        data: {
          labId: lab.id,
          turi: 'sandiq',
          valyuta,
          miqdor: -miqdor,
          kalit: sandiq.kalit,
          soni: 1,
          izoh: sandiq.nom,
        },
      })
    }

    for (const [kalit, soni] of yigilgan) {
      await tx.labItem.upsert({
        where: { labId_kalit: { labId: lab.id, kalit } },
        create: { labId: lab.id, kalit, soni },
        update: { soni: { increment: soni } },
      })
    }
  }))

  return {
    sandiq: { kalit: sandiq.kalit, nom: sandiq.nom, icon: sandiq.icon },
    tushgan: [...yigilgan.entries()].map(([kalit, soni]) => {
      const def = nomzodlar.find((n) => n.kalit === kalit)
      return { kalit, soni, nom: def.nom, nodirlik: def.nodirlik, icon: def.icon }
    }),
  }
}
