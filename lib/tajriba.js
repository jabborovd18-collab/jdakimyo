// lib/tajriba.js
//
// Tajriba o'tkazish — laboratoriyaning halqasini yopadigan qism.
//
// Foydalanuvchi inventaridan reagent tanlaydi, server o'sha to'plamga MOS
// KELADIGAN reaksiyani topadi, jihoz va texnikani tekshiradi, reagentni
// sarflaydi va mahsulotni inventarga qo'shadi.
//
// Nima uchun hammasi server tomonda: lib/laboratoriya.js dagi bilan bir xil
// sabab — natija client'da hisoblansa, brauzer konsolidan istalgan moddani
// "yasab olish" mumkin bo'lardi.
//
// Reaksiya TANLANMAYDI, TOPILADI. Foydalanuvchi "qaysi reaksiyani
// qilaman" deb ro'yxatdan tanlamaydi, u reagentlarni qo'shadi va nima
// bo'lishini ko'radi. Shuning uchun moslash tenglamaning chap tomoni
// bo'yicha ketadi.
import { prisma } from './prisma'
import { LabXatosi, labDaraja, labniOl, urinib } from './laboratoriya'
import { tenglamaniAjrat, toplamKaliti } from './lab-tenglama'
import { balansTekshir } from './chem-balance'
import { koefdanMiqdor, miqdorniFormatla, yetadimi } from './lab-birlik'
import { nisbatniBaho, xpKoeffitsiyenti } from './lab-nisbat'
import { inventarQosh, inventarSarfla, boshYozuvlarniOchir } from './lab-inventar'

/** Bir tajribada ko'pi bilan shuncha xil reagent */
const MAX_REAGENT = 6

/** Har bir tajriba uchun XP */
const TAJRIBA_XP = 5

/**
 * Reaksiyani BIRINCHI marta o'tkazgani uchun qo'shimcha XP.
 *
 * Asosiy XP dan ancha katta: o'yin takrorlashni emas, yangi reaksiya
 * topishni rag'batlantirishi kerak. Aks holda eng arzon reaksiyani
 * qayta-qayta bosish eng foydali strategiya bo'lib qolardi.
 */
const KASHFIYOT_XP = 20

/**
 * Jihozi ko'rsatilmagan reaksiya uchun eng kamida shu kerak.
 *
 * Bazadagi reaksiyalarning yarmiga yaqinida `equipment` bo'sh. "Hech narsa
 * kerak emas" degani noto'g'ri bo'lardi — reaksiya baribir biror idishda
 * o'tkaziladi.
 */
const ENG_KAM_JIHOZ = 'probirka'

// ─────────────────────────────────────────────────────────────
// Reaksiyalar keshi
// ─────────────────────────────────────────────────────────────
//
// Har bir so'rovda 250 ta tenglamani qayta o'qib, muvozanatini tekshirib
// chiqish isrof: reaksiyalar bazasi kunlar davomida o'zgarmaydi. Shuning
// uchun tayyorlangan ro'yxat jarayon xotirasida saqlanadi va vaqti-vaqti
// bilan yangilanadi.
const KESH_UMRI = 5 * 60 * 1000
let kesh = null
let keshVaqti = 0

/**
 * Reaksiyani laboratoriyada o'tkazish mumkinmi.
 *
 * To'rt shart:
 *   1. Tenglama o'qiladi va muvozanatli — noto'g'ri tenglama o'yinga
 *      tushsa, u yodda qoladigan xatoga aylanadi.
 *   2. Ko'lami "nazariy" emas — nazariy reaksiya idishda o'tkazilmaydi.
 *   3. Kuzatuvi bor — foydalanuvchi natijani aynan shu orqali ko'radi.
 *   4. Kerakli jihozining hammasi katalogda bor, aks holda reaksiyani
 *      hech qachon boshlab bo'lmaydi.
 */
async function keshniTayyorla() {
  const [reaksiyalar, deflar] = await Promise.all([
    prisma.reaction.findMany({
      where: { isActive: true },
      select: {
        id: true, equation: true, name: true, category: true,
        observations: true, hazards: true, equipment: true, techniques: true,
        temperature: true, catalyst: true, environment: true,
        scale: true, isVerified: true,
      },
    }),
    prisma.labItemDef.findMany({
      where: { isActive: true },
      select: {
        kalit: true, nom: true, turi: true, icon: true, nodirlik: true,
        daraja: true, sarflanadi: true, xom: true, birlik: true,
      },
    }),
  ])

  const defBoyicha = new Map(deflar.map((d) => [d.kalit, d]))

  // Xom qiymat ("Toza probirka") → katalog kaliti ("probirka")
  const xomJihoz = new Map()
  const xomTexnika = new Map()
  for (const d of deflar) {
    for (const x of Array.isArray(d.xom) ? d.xom : []) {
      if (d.turi === 'jihoz') xomJihoz.set(x, d.kalit)
      else if (d.turi === 'texnika') xomTexnika.set(x, d.kalit)
    }
  }

  const yaroqli = []
  for (const r of reaksiyalar) {
    const t = tenglamaniAjrat(r.equation)
    if (!t) continue
    if (!balansTekshir(r.equation).muvozanatli) continue

    const kolam = (r.scale || '').toLowerCase()
    if (!kolam || kolam.includes('nazariy')) continue

    if (!r.observations || !r.observations.trim()) continue

    const xomJihozlar = Array.isArray(r.equipment) ? r.equipment : []
    const jihozlar = [...new Set(xomJihozlar.map((x) => xomJihoz.get(x)))]
    if (jihozlar.some((j) => !j)) continue // katalogda yo'q jihoz — o'tkazib bo'lmaydi
    if (jihozlar.length === 0) jihozlar.push(ENG_KAM_JIHOZ)

    // Texnikada moslanmagani reaksiyani to'smaydi: xom ro'yxatda usul
    // bo'lmagan qiymatlar ham bor ("Suvda", "Qattiq"), ular darvoza emas.
    const texnikalar = [
      ...new Set(
        (Array.isArray(r.techniques) ? r.techniques : [])
          .map((x) => xomTexnika.get(x))
          .filter(Boolean),
      ),
    ]

    yaroqli.push({
      ...r,
      chap: t.chap,
      ong: t.ong,
      toplam: toplamKaliti(t.chap.map((a) => a.kalit)),
      jihozlar,
      texnikalar,
      // Texnikaning eng yuqori darajasi — reaksiyaning darvozasi
      kerakliDaraja: texnikalar.reduce(
        (eng, k) => Math.max(eng, defBoyicha.get(k)?.daraja ?? 1),
        1,
      ),
    })
  }

  // To'plam bo'yicha indeks: bir xil reagentlardan bir nechta reaksiya
  // chiqishi mumkin (H₃PO₄ + NaOH dan uchta turli tuz), shuning uchun
  // qiymat — ro'yxat.
  const toplamBoyicha = new Map()
  for (const r of yaroqli) {
    if (!toplamBoyicha.has(r.toplam)) toplamBoyicha.set(r.toplam, [])
    toplamBoyicha.get(r.toplam).push(r)
  }

  return { yaroqli, toplamBoyicha, defBoyicha }
}

async function keshniOl() {
  if (kesh && Date.now() - keshVaqti < KESH_UMRI) return kesh
  kesh = await keshniTayyorla()
  keshVaqti = Date.now()
  return kesh
}

/** Katalog yoki reaksiyalar o'zgarganda keshni tashlash uchun */
export function keshniTozala() {
  kesh = null
  keshVaqti = 0
}

// ─────────────────────────────────────────────────────────────
// Tekshiruvlar
// ─────────────────────────────────────────────────────────────

/**
 * Inventarni kalit → MIQDOR ko'rinishida beradi.
 *
 * `soni` emas: miqdor haqiqiy o'lchov (ml yoki gramm), `soni` esa undan
 * hosila va faqat eski interfeys uchun qolgan. Jihoz uchun ikkalasi bir
 * xil — ularning birligi "dona", ya'ni ulushi 1.
 */
async function inventarniOl(labId) {
  const items = await prisma.labItem.findMany({
    where: { labId },
    select: { kalit: true, miqdor: true },
  })
  return new Map(items.map((i) => [i.kalit, i.miqdor]))
}

/**
 * Reaksiyaning chap tomonini miqdor bilan tavsiflaydi.
 *
 * Koeffitsient — bu mol nisbati, miqdor esa ml yoki gramm. O'tkazish
 * `lib/lab-birlik.js` da: koef × ulush. Bu kimyoviy mol emas, o'quv
 * sharti — lekin NISBAT to'g'ri qoladi, 1:2 reaksiyada ikkinchisidan
 * haqiqatan ikki barobar ko'p ketadi.
 */
function talabniHisobla(reaksiya, defBoyicha) {
  return reaksiya.chap.map((a) => {
    const birlik = defBoyicha.get(a.kalit)?.birlik ?? 'ml'
    return {
      kalit: a.kalit,
      koef: a.koef,
      birlik,
      miqdor: koefdanMiqdor(a.koef, birlik),
    }
  })
}

/**
 * Reaksiyani o'tkazish uchun nima yetishmayotganini sanaydi.
 * Bo'sh ro'yxat — hammasi joyida.
 */
function nimaYetishmaydi(reaksiya, inventar, daraja, defBoyicha, kerakliMiqdor = null) {
  const kamchilik = []

  for (const t of talabniHisobla(reaksiya, defBoyicha)) {
    // `kerakliMiqdor` berilsa — foydalanuvchi HAQIQATDA quygan miqdor
    // tekshiriladi. Berilmasa — stexiometrik ulush.
    //
    // Nega farq qiladi: "mumkin tajribalar" ro'yxati to'liq ulush bo'yicha
    // tuzilishi kerak (u taklif), lekin tajribaning o'zida foydalanuvchi
    // 5 ml quysa, undan 25 ml borligini talab qilish noto'g'ri bo'lardi —
    // u shuncha quymoqchi ham emas.
    const kerak = kerakliMiqdor ? (kerakliMiqdor[t.kalit] ?? 0) : t.miqdor
    const bor = inventar.get(t.kalit) ?? 0
    if (!yetadimi(bor, kerak)) {
      kamchilik.push({
        turi: 'reagent',
        kalit: t.kalit,
        nom: defBoyicha.get(t.kalit)?.nom ?? t.kalit,
        birlik: t.birlik,
        kerak: miqdorniFormatla(kerak, t.birlik),
        bor: miqdorniFormatla(bor, t.birlik),
      })
    }
  }

  for (const j of reaksiya.jihozlar) {
    if (!yetadimi(inventar.get(j) ?? 0, 1)) {
      kamchilik.push({
        turi: 'jihoz',
        kalit: j,
        nom: defBoyicha.get(j)?.nom ?? j,
        kerak: '1 dona',
        bor: '0 dona',
      })
    }
  }

  if (daraja < reaksiya.kerakliDaraja) {
    kamchilik.push({
      turi: 'daraja',
      kalit: 'daraja',
      nom: `${reaksiya.kerakliDaraja}-daraja laboratoriya`,
      kerak: reaksiya.kerakliDaraja,
      bor: daraja,
    })
  }

  return kamchilik
}

/** Reaksiyani ekranga chiqarish uchun qisqa ko'rinish */
function korinish(r, defBoyicha, kashfEtilgan) {
  return {
    id: r.id,
    // Kashf etilmagan reaksiyaning tenglamasi va nomi berilmaydi: nima
    // hosil bo'lishini tajriba o'zi ko'rsatishi kerak.
    equation: kashfEtilgan ? r.equation : null,
    name: kashfEtilgan ? r.name : null,
    category: r.category,
    kashfEtilgan,
    isVerified: r.isVerified,
    kerakliDaraja: r.kerakliDaraja,
    reagentlar: r.chap.map((a) => ({
      kalit: a.kalit,
      nom: defBoyicha.get(a.kalit)?.nom ?? a.kalit,
      koef: a.koef,
    })),
    jihozlar: r.jihozlar.map((k) => ({
      kalit: k,
      nom: defBoyicha.get(k)?.nom ?? k,
      icon: defBoyicha.get(k)?.icon ?? null,
    })),
  }
}

/**
 * Hozirgi inventar bilan o'tkazish mumkin bo'lgan tajribalar.
 *
 * Nega kerak: 242 ta modda va 200 ga yaqin reaksiya bilan tasodifiy
 * tanlash deyarli har doim "hech narsa bo'lmadi" beradi. Bu esa o'ynashni
 * emas, taxmin qilishni o'rgatadi. Ro'yxat yo'l ko'rsatadi, lekin
 * javobni bermaydi — mahsulot tajribadan keyin ko'rinadi.
 */
export async function mumkinTajribalar(userId, chegara = 40) {
  const lab = await labniOl(userId)
  const { yaroqli, defBoyicha } = await keshniOl()
  const inventar = await inventarniOl(lab.id)

  const kashfEtilgan = new Set(
    (
      await prisma.labExperiment.findMany({
        where: { labId: lab.id },
        select: { reactionId: true },
        distinct: ['reactionId'],
      })
    ).map((e) => e.reactionId),
  )

  const mumkin = []
  for (const r of yaroqli) {
    if (nimaYetishmaydi(r, inventar, lab.daraja, defBoyicha).length > 0) continue
    mumkin.push(korinish(r, defBoyicha, kashfEtilgan.has(r.id)))
  }

  // Yangisi oldinda: kashf etilmagani birinchi, keyin reagenti kamrog'i.
  mumkin.sort(
    (a, b) =>
      Number(a.kashfEtilgan) - Number(b.kashfEtilgan) ||
      a.reagentlar.length - b.reagentlar.length,
  )

  return {
    jami: mumkin.length,
    kashfEtilgan: kashfEtilgan.size,
    jamiReaksiya: yaroqli.length,
    royxat: mumkin.slice(0, chegara),
  }
}

/** Laboratoriya daftari — oxirgi tajribalar */
export async function tajribaJurnali(userId, chegara = 20) {
  const lab = await labniOl(userId)

  const yozuvlar = await prisma.labExperiment.findMany({
    where: { labId: lab.id },
    orderBy: { createdAt: 'desc' },
    take: chegara,
  })

  return yozuvlar.map((y) => ({
    id: y.id,
    equation: y.equation,
    tajriba: y.tajriba,
    birinchi: y.birinchi,
    createdAt: y.createdAt,
  }))
}

// ─────────────────────────────────────────────────────────────
// Tajriba o'tkazish
// ─────────────────────────────────────────────────────────────

/**
 * Tanlangan reagentlar bilan tajriba o'tkazadi.
 *
 * @param {string[]} kalitlar — inventardagi reagent kalitlari
 * @param {string=} reactionId — bitta to'plamdan bir nechta reaksiya
 *        chiqsa, qaysi biri (foydalanuvchi tanlaydi)
 * @param {Record<string, number>=} miqdorlar — HAQIQATDA quyilgan miqdor
 *        (ml yoki gramm). 3D laboratoriya qo'lda quyadi va shu maydonni
 *        yuboradi; 2D laboratoriya bir bosishda ideal miqdorni oladi va
 *        uni yubormaydi. Kelmasa — stexiometrik ulush olinadi, ya'ni eski
 *        xatti-harakat aynan saqlanadi.
 * @returns natija, yoki {tanlov: [...]} — tanlash kerakligini bildiradi
 */
export async function tajribaniOtkaz(userId, kalitlar, reactionId = null, miqdorlar = null) {
  const tanlangan = [...new Set((kalitlar || []).map((k) => String(k || '').trim()).filter(Boolean))]

  if (tanlangan.length === 0) throw new LabXatosi('Reagent tanlanmagan')
  if (tanlangan.length > MAX_REAGENT) {
    throw new LabXatosi(`Bir tajribada ko'pi bilan ${MAX_REAGENT} xil reagent ishlatiladi`)
  }

  const lab = await labniOl(userId)
  const { toplamBoyicha, defBoyicha } = await keshniOl()

  const nomzodlar = toplamBoyicha.get(toplamKaliti(tanlangan)) || []

  if (nomzodlar.length === 0) {
    // Bu xato emas, natija: aralashtirish har doim reaksiya bermaydi.
    throw new LabXatosi(
      'Bu reagentlar bir-biri bilan reaksiyaga kirishmadi. ' +
        'Idishda aralashma qoldi — hech narsa sarflanmadi.',
    )
  }

  let reaksiya
  if (nomzodlar.length === 1) {
    reaksiya = nomzodlar[0]
  } else if (reactionId) {
    reaksiya = nomzodlar.find((r) => r.id === reactionId)
    if (!reaksiya) throw new LabXatosi('Tanlangan reaksiya bu reagentlarga mos kelmadi')
  } else {
    // Bir xil reagentlardan sharoitga qarab har xil mahsulot chiqadi
    // (H₃PO₄ + NaOH → uchta turli tuz). Qaysi biri kerakligini server
    // o'zi hal qilmaydi — bu foydalanuvchining qarori.
    return {
      tanlov: nomzodlar.map((r) => ({
        id: r.id,
        name: r.name,
        temperature: r.temperature,
        catalyst: r.catalyst,
        environment: r.environment,
        // Tenglama bu yerda ham berilmaydi — tanlov sharoit bo'yicha
        // qilinadi, tayyor javobdan emas.
        reagentlar: r.chap.map((a) => ({
          kalit: a.kalit,
          nom: defBoyicha.get(a.kalit)?.nom ?? a.kalit,
          koef: a.koef,
        })),
      })),
    }
  }

  // Bitta reaksiya ulushi uchun kerakli miqdorlar
  const talab = talabniHisobla(reaksiya, defBoyicha)

  // Haqiqatda quyilgani. 3D laboratoriya buni yuboradi; 2D yubormaydi va
  // shunda ideal ulush olinadi — bu ataylab, chunki 2D "bir bosishda
  // tayyor" rejimi, 3D esa "qo'ling bilan quyasan" rejimi.
  //
  // Client yuborgan songa ishonilmaydi: u faqat NIMA SARFLANISHINI
  // belgilaydi, inventarda borligini esa tranzaksiya ichidagi shartli
  // update tekshiradi. Ya'ni brauzer konsolidan katta son yuborib
  // yo'qdan mahsulot yasab bo'lmaydi.
  const quyilgan = {}
  for (const t of talab) {
    const xom = miqdorlar ? Number(miqdorlar[t.kalit]) : NaN
    quyilgan[t.kalit] = Number.isFinite(xom) && xom > 0 ? xom : t.miqdor
  }

  const baho = nisbatniBaho(quyilgan, talab)

  const inventar = await inventarniOl(lab.id)
  const kamchilik = nimaYetishmaydi(reaksiya, inventar, lab.daraja, defBoyicha, quyilgan)
  if (kamchilik.length > 0) {
    const matn = kamchilik
      .map((k) =>
        k.turi === 'daraja'
          ? k.nom
          : `${k.nom} (kerak ${k.kerak}, bor ${k.bor})`,
      )
      .join(', ')
    throw new LabXatosi(`Yetishmayapti: ${matn}`)
  }

  // Sarflanadigan jihozlar (filtr qog'ozi kabi) — reagentdan alohida
  // hisoblanadi, chunki ular koeffitsientsiz, bittadan ketadi.
  const sarfJihozlar = reaksiya.jihozlar.filter((k) => defBoyicha.get(k)?.sarflanadi)

  // Mahsulotlardan faqat katalogda borlari inventarga tushadi. Katalog
  // reaksiyalardan generatsiya qilinadi, ya'ni odatda hammasi bor; lekin
  // katalog eskirgan bo'lsa tajriba shu sababli yiqilmasligi kerak.
  const mahsulotlar = reaksiya.ong.filter((a) => defBoyicha.has(a.kalit))

  // Tranzaksiyaga qo'shimcha vaqt beriladi. Sabab: bu yerdagi amallar
  // savdodagidan ko'p — har bir reagent uchun bittadan kamaytirish, har bir
  // mahsulot uchun bittadan qo'shish, ustiga jurnal va daraja. Har biri
  // bazaga alohida borish, ya'ni uzoq ulanishda (mahalliy kompyuterdan
  // Neon'gacha) yig'ilib 5 soniyalik odatiy chegaradan oshib ketardi va
  // tajriba "baza band" xatosi bilan uzilardi.
  const natija = await urinib(() => prisma.$transaction(async (tx) => {
    // Kashfiyot tranzaksiya ichida sanaladi: ikkita bir vaqtdagi so'rov
    // ikkalasi ham "birinchi" bo'lib qolmasin.
    const oldingi = await tx.labExperiment.count({
      where: { labId: lab.id, reactionId: reaksiya.id },
    })
    const birinchi = oldingi === 0

    // Nisbat XP ga ta'sir qiladi. Kashfiyot mukofoti esa TEGILMAYDI:
    // yangi reaksiya topgan odam, nisbatni chalkashtirgan bo'lsa ham,
    // baribir yangi narsa topgan.
    const asosiyXP = Math.max(1, Math.round(TAJRIBA_XP * xpKoeffitsiyenti(baho.holat)))
    const olinganXP = asosiyXP + (birinchi ? KASHFIYOT_XP : 0)

    // Reagentlar SHARTLI kamaytiriladi — lib/laboratoriya.js dagi savdo
    // bilan bir xil sabab: oldin o'qib, keyin ayirish ikkita bir vaqtdagi
    // tajribaga bitta reagentni ikki marta sarflashga imkon berardi.
    //
    // QUYILGANI sarflanadi, kerakligi emas: ortiqcha quyilgan modda
    // idishga tushgan, ya'ni shishaga qaytmaydi. Stexiometriyani hamyon
    // orqali o'rgatadigan joy aynan shu.
    for (const t of talab) {
      const yetdi = await inventarSarfla(tx, lab.id, t.kalit, quyilgan[t.kalit], t.birlik)
      if (!yetdi) {
        const nom = defBoyicha.get(t.kalit)?.nom ?? t.kalit
        throw new LabXatosi(
          `${nom} yetarli emas (${miqdorniFormatla(quyilgan[t.kalit], t.birlik)} kerak)`,
        )
      }
    }

    for (const k of sarfJihozlar) {
      const yetdi = await inventarSarfla(tx, lab.id, k, 1, 'dona')
      if (!yetdi) {
        throw new LabXatosi(`${defBoyicha.get(k)?.nom ?? k} tugadi`)
      }
    }

    await boshYozuvlarniOchir(tx, lab.id)

    // Mahsulot UNUM ga qarab chiqadi: cheklovchi reagent qancha reaksiya
    // ulushiga yetsa, shuncha mahsulot hosil bo'ladi. Ikki barobar ko'p
    // (lekin mutanosib) quysang — ikki barobar mahsulot; bittasini kam
    // quysang — hammasi o'shanga qarab kamayadi.
    for (const a of mahsulotlar) {
      const birlik = defBoyicha.get(a.kalit)?.birlik ?? 'ml'
      const chiqdi = koefdanMiqdor(a.koef, birlik) * baho.unum
      await inventarQosh(tx, lab.id, a.kalit, chiqdi, birlik)
    }

    const yangiTajriba = lab.tajriba + olinganXP
    const yangiDaraja = labDaraja(yangiTajriba)

    await tx.lab.update({
      where: { id: lab.id },
      data: { tajriba: { increment: olinganXP }, daraja: yangiDaraja },
    })

    await tx.labExperiment.create({
      data: {
        labId: lab.id,
        reactionId: reaksiya.id,
        equation: reaksiya.equation,
        tajriba: olinganXP,
        birinchi,
      },
    })

    return { birinchi, olinganXP, yangiDaraja, darajaOshdi: yangiDaraja > lab.daraja }
  }, { timeout: 20000, maxWait: 10000 }))

  return {
    reaksiya: {
      id: reaksiya.id,
      equation: reaksiya.equation,
      name: reaksiya.name,
      category: reaksiya.category,
      observations: reaksiya.observations,
      hazards: Array.isArray(reaksiya.hazards) ? reaksiya.hazards : [],
      temperature: reaksiya.temperature,
      catalyst: reaksiya.catalyst,
      environment: reaksiya.environment,
      isVerified: reaksiya.isVerified,
    },
    // `soni` — tenglamadagi koeffitsient, ataylab saqlanadi: 3D
    // laboratoriya nisbatni oldindan ko'rsatishda aynan shuni o'qiydi.
    // Yoniga haqiqiy miqdor qo'shildi.
    sarflandi: reaksiya.chap.map((a) => {
      const birlik = defBoyicha.get(a.kalit)?.birlik ?? 'ml'
      return {
        kalit: a.kalit,
        nom: defBoyicha.get(a.kalit)?.nom ?? a.kalit,
        soni: a.koef,
        birlik,
        miqdor: Number((quyilgan[a.kalit] ?? 0).toFixed(3)),
        kerakEdi: koefdanMiqdor(a.koef, birlik),
        matn: miqdorniFormatla(quyilgan[a.kalit] ?? 0, birlik),
      }
    }),
    olindi: mahsulotlar.map((a) => {
      const birlik = defBoyicha.get(a.kalit)?.birlik ?? 'ml'
      const chiqdi = koefdanMiqdor(a.koef, birlik) * baho.unum
      return {
        kalit: a.kalit,
        nom: defBoyicha.get(a.kalit)?.nom ?? a.kalit,
        soni: a.koef,
        birlik,
        miqdor: Number(chiqdi.toFixed(3)),
        matn: miqdorniFormatla(chiqdi, birlik),
        nodirlik: defBoyicha.get(a.kalit)?.nodirlik ?? 'oddiy',
        icon: defBoyicha.get(a.kalit)?.icon ?? null,
      }
    }),
    // Stexiometrik baho endi SERVERDAN keladi. Ilgari uni client o'zi
    // hisoblardi va natijaga hech qanday ta'siri yo'q edi.
    nisbat: baho,
    ...natija,
  }
}
