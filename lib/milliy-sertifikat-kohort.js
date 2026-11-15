// lib/milliy-sertifikat-kohort.js
//
// Milliy Sertifikat (MS) imtihonlarini belgilangan kunda o'tkazish,
// natijalarni e'longacha yashirish, barcha ishtirokchilar uchun kohort
// Rasch CML kalibrlashini bajarish hamda ikki xil natija (Rasch vs Oddiy)
// ni yonma-yon hisoblashning YAGONA manbai (AGENTS.md 1-band).

import { MS_SHKALA_STANDART } from "./ms-format.js"
import { aniqlaDaraja, hisoblaRaschTheta } from "./rasch-model.js"
import { kalibrla } from "./rasch-kalibrlash.js"
import { kalibrlashgaYaroqli } from "./milliy-sertifikat-eksport.js"
import { sinovKatalogi } from "./milliy-sertifikat-katalog.js"
import { isSuperAdmin } from "./roles.js"

// Superadmin cheksiz sinov yechadi, lekin urinish va natijalari kohort
// kalibrlash, ishtirokchilar soni va reytinglarda umuman chiqmasligi shart.
export const MS_REAL_URINISH_FILTR = {
  NOT: { user: { is: { role: "superadmin" } } },
}

export function superadminUrinishimi(urinish) {
  return isSuperAdmin(urinish?.user?.role)
}

const RASCH_DARAJA_TARTIB = ["A+", "A", "B+", "B", "C+", "C", "Qoniqarsiz"]
const ODDIY_BAHO_TARTIB = ["5 (A'lo)", "4 (Yaxshi)", "3 (Qoniqarli)", "2 (O'tolmadi)"]

function mediana(sonlar = []) {
  if (!sonlar.length) return 0
  const sart = [...sonlar].sort((a, b) => a - b)
  const mid = Math.floor(sart.length / 2)
  return sart.length % 2 === 1 ? sart[mid] : Number(((sart[mid - 1] + sart[mid]) / 2).toFixed(1))
}

function turNomi(turi) {
  if (turi === "ochiq") return "Ochiq sonli masalalar (36–40)"
  if (turi === "moslashtirish") return "Moslashtirish topshiriqlari (A–F)"
  return "Yopiq test savollari (A–D)"
}

// Nega 5 va 10: juda kichik guruhda (2-4 odam) CML item qiyinligi va T-shkala
// dispersiyasi shovqinli chiqadi. 5+ da CML item bahosi barqarorlashadi,
// 10+ va yetarli tarqoqlikda esa BMBA uslubidagi kohort T-shkalasi yoqiladi.
export const MIN_CML_QATOR = 5
export const MIN_TSCORE_KOHORT = 10
const MIN_SD_THETA = 0.25

function clamp(qiymat, min, max) {
  return Math.min(max, Math.max(min, qiymat))
}

function yaxlit1(son) {
  return Math.round(Number(son) * 10) / 10
}

/**
 * Rasch modelisiz oddiy klassik ball tizimi natijasi.
 * Har bir to'g'ri javob qiyinligidan qat'i nazar teng vazn oladi.
 *
 * @param {number} rawScore To'g'ri javoblar soni
 * @param {number} jamiSavollar Jami savollar soni
 */
export function oddiyBahoHisobla(rawScore = 0, jamiSavollar = 0) {
  const jami = Math.max(0, Number(jamiSavollar) || 0)
  const togri = clamp(Number(rawScore) || 0, 0, jami || 0)
  const oddiyFoiz = jami > 0 ? Number(((togri / jami) * 100).toFixed(1)) : 0
  const oddiyBall = oddiyFoiz

  let oddiyBaho = "2 (O'tolmadi)"
  let oddiyBahoQisqa = "2"
  let oddiyBahoRang = "rose"

  if (oddiyFoiz >= 86) {
    oddiyBaho = "5 (A'lo)"
    oddiyBahoQisqa = "5"
    oddiyBahoRang = "emerald"
  } else if (oddiyFoiz >= 71) {
    oddiyBaho = "4 (Yaxshi)"
    oddiyBahoQisqa = "4"
    oddiyBahoRang = "sky"
  } else if (oddiyFoiz >= 56) {
    oddiyBaho = "3 (Qoniqarli)"
    oddiyBahoQisqa = "3"
    oddiyBahoRang = "amber"
  }

  const oddiyDarajaInfo = aniqlaDaraja(oddiyBall)

  return {
    rawScore: togri,
    jamiSavollar: jami,
    oddiyFoiz,
    oddiyBall,
    harSavolBall: jami > 0 ? Number((100 / jami).toFixed(2)) : 0,
    oddiyBaho,
    oddiyBahoQisqa,
    oddiyBahoRang,
    shkalaDaraja: oddiyDarajaInfo.daraja,
    shkalaDarajaNomi: oddiyDarajaInfo.darajaNomi,
  }
}

/**
 * Qiyinlik guruhlari va topshiriq turlari kesimida oddiy vs Rasch solishtirmasi.
 * O'quvchiga Rasch modeli nega ko'targani yoki tushirganini tushunarli qiladi.
 */
export function taqqoslashTahlili(raschNatija, oddiyNatija, savolNatijalari = []) {
  const raschBall = Number(raschNatija?.shkalaBalli) || 0
  const oddiyBall = Number(oddiyNatija?.oddiyBall) || 0
  const farqBall = yaxlit1(raschBall - oddiyBall)

  let foydaliTomon = "teng"
  if (farqBall >= 1.0) foydaliTomon = "rasch"
  else if (farqBall <= -1.0) foydaliTomon = "oddiy"

  const guruh = (filtr) => {
    const royxat = savolNatijalari.filter(filtr)
    const togri = royxat.filter((s) => s.togri).length
    return {
      jami: royxat.length,
      togri,
      foiz: royxat.length > 0 ? Math.round((togri / royxat.length) * 100) : 0,
    }
  }

  const qiyinlikGuruhlari = {
    oson: guruh((s) => (Number(s.qiyinlik) || 0) < -0.5),
    orta: guruh((s) => {
      const b = Number(s.qiyinlik) || 0
      return b >= -0.5 && b <= 0.5
    }),
    qiyin: guruh((s) => (Number(s.qiyinlik) || 0) > 0.5),
  }

  const bolimlar = {
    yopiq: guruh((s) => !s.turi || s.turi === "variant"),
    moslashtirish: guruh((s) => s.turi === "moslashtirish"),
    ochiq: guruh((s) => s.turi === "ochiq"),
  }

  let sarlavha = "Ikkala model ham yaqin baho berdi"
  let xulosaMatni =
    "Rasch IRT ballingiz va oddiy foiz ballingiz deyarli teng — natijangiz har ikki tizimda ham barqaror."

  if (foydaliTomon === "rasch") {
    sarlavha = `Rasch modeli sizga +${farqBall} ball ustunlik berdi`
    xulosaMatni =
      qiyinlikGuruhlari.qiyin.jami > 0 && qiyinlikGuruhlari.qiyin.foiz >= 50
        ? `Siz qiyin darajadagi savollardan ${qiyinlikGuruhlari.qiyin.togri}/${qiyinlikGuruhlari.qiyin.jami} tasini to'g'ri yechdingiz. Kohort bo'yicha murakkab savollar vazni va umumiy qiyinlik hisobga olingani uchun Rasch ballingiz oddiy balldan yuqori chiqdi.`
        : "Imtihonning kohort bo'yicha umumiy murakkabligi hisobga olingani uchun Rasch shkalasi natijangizni oddiy foizdan yuqori baholadi."
  } else if (foydaliTomon === "oddiy") {
    sarlavha = `Oddiy ball tizimi +${Math.abs(farqBall)} ball yuqoriroq chiqdi`
    if (
      qiyinlikGuruhlari.oson.jami > 0 &&
      qiyinlikGuruhlari.qiyin.jami > 0 &&
      qiyinlikGuruhlari.oson.foiz < qiyinlikGuruhlari.qiyin.foiz
    ) {
      xulosaMatni = `Siz oson savollardan ${qiyinlikGuruhlari.oson.togri}/${qiyinlikGuruhlari.oson.jami} ta topib, murakkablarida yaxshi ishladingiz (${qiyinlikGuruhlari.qiyin.togri}/${qiyinlikGuruhlari.qiyin.jami}). Rasch modeli oson savollardagi xatolarga sezgir bo'lgani uchun ball biroz pastladi; oddiy tizimda esa har bir savol teng sanaladi.`
    } else {
      xulosaMatni =
        "Ko'pchilik ishtirokchilar oson va o'rta savollarni ham ko'p topgani sababli Rasch kohort shkalasi talabchanroq chiqdi. Oddiy tizimda esa faqat to'g'ri javoblar ulushi sanaladi."
    }
  }

  return {
    farqBall,
    raschBall,
    oddiyBall,
    foydaliTomon,
    sarlavha,
    xulosaMatni,
    osonXatoOgoh:
      Boolean(raschNatija?.ishonchsiz) ||
      (qiyinlikGuruhlari.oson.jami >= 3 &&
        qiyinlikGuruhlari.qiyin.jami >= 3 &&
        qiyinlikGuruhlari.qiyin.foiz - qiyinlikGuruhlari.oson.foiz >= 15),
    qiyinlikGuruhlari,
    bolimlar,
  }
}

/**
 * Belgilangan imtihon holatini aniq qaytaradi.
 * Barcha API va sahifalar shu funksiyadan foydalanadi (boshlash, yakunlash, katalog, natija).
 */
export function jadvalHolatiAniqlash(imtihon, hozir = Date.now()) {
  const nowMs = hozir instanceof Date ? hozir.getTime() : Number(hozir)

  if (!imtihon) {
    return {
      holat: "belgilanmagan",
      rejim: "jadval",
      ruxsatOlish: false,
      ruxsatTopshirish: false,
      ruxsatNatija: false,
      xabar: "Imtihon o'tkazilish sanasi hali belgilanmagan.",
    }
  }

  if (!imtihon.faol) {
    return {
      holat: "yopiq",
      rejim: imtihon.rejim || "jadval",
      ruxsatOlish: false,
      ruxsatTopshirish: false,
      ruxsatNatija: Boolean(imtihon.isAnnounced),
      xabar: "Bu imtihon vaqtincha yopilgan.",
    }
  }

  if (imtihon.rejim === "erkin") {
    return {
      holat: "ochiq",
      rejim: "erkin",
      ruxsatOlish: true,
      ruxsatTopshirish: true,
      ruxsatNatija: true,
      xabar: "Istalgan vaqt topshirish uchun ochiq.",
    }
  }

  const boshMs = imtihon.startsAt ? new Date(imtihon.startsAt).getTime() : null
  const tugashMs = imtihon.endsAt ? new Date(imtihon.endsAt).getTime() : null

  if (!boshMs || !tugashMs || Number.isNaN(boshMs) || Number.isNaN(tugashMs)) {
    return {
      holat: "belgilanmagan",
      rejim: "jadval",
      ruxsatOlish: false,
      ruxsatTopshirish: false,
      ruxsatNatija: false,
      xabar: "Imtihon boshlanish va tugash vaqti belgilanmoqda.",
    }
  }

  if (imtihon.isAnnounced) {
    return {
      holat: "elon_qilindi",
      rejim: "jadval",
      boshMs,
      tugashMs,
      ruxsatOlish: false,
      ruxsatTopshirish: false,
      ruxsatNatija: true,
      xabar: "Natijalar barcha ishtirokchilar uchun e'lon qilingan.",
    }
  }

  if (nowMs < boshMs) {
    return {
      holat: "kutilmoqda",
      rejim: "jadval",
      boshMs,
      tugashMs,
      qolganSoniya: Math.max(0, Math.ceil((boshMs - nowMs) / 1000)),
      ruxsatOlish: false,
      ruxsatTopshirish: false,
      ruxsatNatija: false,
      xabar: "Imtihon belgilangan sanada boshlanadi.",
    }
  }

  if (nowMs <= tugashMs) {
    return {
      holat: "ochiq",
      rejim: "jadval",
      boshMs,
      tugashMs,
      qolganSoniya: Math.max(0, Math.floor((tugashMs - nowMs) / 1000)),
      ruxsatOlish: true,
      ruxsatTopshirish: true,
      ruxsatNatija: false,
      xabar: "Imtihon ochiq. Yakunlagach natijalar umumiy e'longacha yashirin saqlanadi.",
    }
  }

  return {
    holat: "tekshirilmoqda",
    rejim: "jadval",
    boshMs,
    tugashMs,
    ruxsatOlish: false,
    ruxsatTopshirish: false,
    ruxsatNatija: false,
    xabar: "Imtihon muddati yakunlandi. Rasch kohort kalibrlashdan so'ng natijalar hammaga bir vaqtda e'lon qilinadi.",
  }
}

/**
 * Bir sinovdagi barcha urinishlar asosida kohort CML kalibrlashini o'tkazadi
 * va har bir ishtirokchining Rasch + Oddiy ball natijalarini qayta hisoblaydi.
 *
 * @param {Array} aslSavollar Savol banki (masalan getSavollarBySlug(slug))
 * @param {Array} urinishlar MsUrinish + javoblar ro'yxati
 * @param {{ slug?: string }} [opts]
 */
export function kohortKalibrlaVaHisobla(aslSavollar = [], urinishlar = [], { slug = "" } = {}) {
  const savollar = Array.isArray(aslSavollar) ? aslSavollar : []
  const harakatlar = (Array.isArray(urinishlar) ? urinishlar : []).filter(
    (u) => !superadminUrinishimi(u)
  )

  if (savollar.length === 0) {
    throw new Error("Kalibrlash uchun savol banki bo'sh")
  }

  const kalitOf = (s) => `${slug}#${s.id}`
  const ustunlar = savollar.map(kalitOf)

  // Har bir urinish uchun tez javob xaritasi
  const urinishXaritalari = harakatlar.map((u) => {
    const xarita = new Map()
    for (const j of u.javoblar || []) {
      xarita.set(j.savolKalit, j)
      if (j.savolId !== undefined && j.savolId !== null) {
        xarita.set(`id:${j.savolId}`, j)
      }
    }
    return xarita
  })

  const javobOl = (xarita, savol) =>
    xarita.get(kalitOf(savol)) || xarita.get(`id:${savol.id}`) || null

  // Kohort uchun yaroqli birinchi urinishlar
  const kohortIndekslar = []
  harakatlar.forEach((u, idx) => {
    const birinchiYokiMos = u.urinishTartibi === 1 || u.urinishTartibi === null
    const shaklda = {
      ...u,
      urinishTartibi: birinchiYokiMos ? 1 : u.urinishTartibi,
      javoblar: savollar.map((s) => {
        const j = javobOl(urinishXaritalari[idx], s)
        return {
          savolKalit: kalitOf(s),
          togri: Boolean(j?.togri),
          javobBerildi: Boolean(j?.javobBerildi),
        }
      }),
    }
    if (kalibrlashgaYaroqli(shaklda)) {
      kohortIndekslar.push(idx)
    }
  })

  // Har bir savol bo'yicha kohortdagi empirik to'g'ri topish foizi
  const savolKohortStat = savollar.map((s) => {
    let togri = 0
    for (const idx of kohortIndekslar) {
      const j = javobOl(urinishXaritalari[idx], s)
      if (j?.togri) togri += 1
    }
    const n = kohortIndekslar.length
    return {
      togriSoni: togri,
      jami: n,
      togriFoiz: n > 0 ? Math.round((togri / n) * 100) : null,
    }
  })

  // 1. CML kalibrlashga urinish
  let cmlNatija = null
  let cmlQollanilgan = false
  if (kohortIndekslar.length >= MIN_CML_QATOR) {
    const matritsa = kohortIndekslar.map((idx) =>
      savollar.map((s) => (javobOl(urinishXaritalari[idx], s)?.togri ? 1 : 0))
    )
    try {
      const tekshiruv = kalibrla(matritsa, ustunlar)
      if (tekshiruv?.yaqinlashdi && tekshiruv.savollar.length >= Math.min(savollar.length, 5)) {
        cmlNatija = tekshiruv
        cmlQollanilgan = true
      }
    } catch {
      cmlNatija = null
      cmlQollanilgan = false
    }
  }

  // Chekka savollarga (100% yoki 0% to'g'ri) ham izchil Wright-Stone chegarasi qo'yamiz
  const cmlMap = new Map((cmlNatija?.savollar || []).map((s) => [s.kalit, s]))
  const faolQiyinliklar = (cmlNatija?.savollar || []).map((s) => s.qiyinlik)
  const minActiveB = faolQiyinliklar.length ? Math.min(...faolQiyinliklar) : -2.0
  const maxActiveB = faolQiyinliklar.length ? Math.max(...faolQiyinliklar) : 2.0

  const kalibrlanganSavollar = savollar.map((s, i) => {
    const k = kalitOf(s)
    const cml = cmlMap.get(k)
    const kohort = savolKohortStat[i]

    let yangiQiyinlik = Number(s.qiyinlik) || 0
    let chekka = false

    if (cml) {
      yangiQiyinlik = cml.qiyinlik
    } else if (cmlQollanilgan && kohort.jami > 0) {
      if (kohort.togriSoni === 0) {
        yangiQiyinlik = Number(clamp(Math.max(2.2, maxActiveB + 0.6), -3.2, 3.2).toFixed(3))
        chekka = true
      } else if (kohort.togriSoni === kohort.jami) {
        yangiQiyinlik = Number(clamp(Math.min(-2.2, minActiveB - 0.6), -3.2, 3.2).toFixed(3))
        chekka = true
      }
    }

    return {
      ...s,
      boshlangichQiyinlik: Number(s.qiyinlik) || 0,
      qiyinlik: yangiQiyinlik,
      kalibrlanganSe: cml?.se ?? null,
      infit: cml?.infit ?? null,
      outfit: cml?.outfit ?? null,
      korrelyatsiya: cml?.korrelyatsiya ?? null,
      muammo: cml?.muammo || (chekka ? ["chekka_savol"] : []),
      kohortTogriFoiz: kohort.togriFoiz,
    }
  })

  // 2. Har bir ishtirokchi uchun kalibrlangan theta va oddiy ballni hisoblash
  const dastlabkiHisoblar = harakatlar.map((u, idx) => {
    const xarita = urinishXaritalari[idx]
    const raqamli = savollar.map((s) => (javobOl(xarita, s)?.togri ? 1 : 0))
    const rawScore = raqamli.reduce((a, b) => a + b, 0)
    const rasch = hisoblaRaschTheta(kalibrlanganSavollar, raqamli)
    const oddiy = oddiyBahoHisobla(rawScore, savollar.length)
    return { u, idx, xarita, raqamli, rasch, oddiy }
  })

  // 3. Kohort o'rtacha theta va T-shkala (50 + 10*Z) tekshiruvi
  const kohortThetalar = kohortIndekslar.map((idx) => dastlabkiHisoblar[idx].rasch.theta)
  const kohortN = kohortThetalar.length
  const meanTheta = kohortN > 0 ? kohortThetalar.reduce((a, b) => a + b, 0) / kohortN : 0
  const varianceTheta =
    kohortN > 0
      ? kohortThetalar.reduce((s, t) => s + (t - meanTheta) ** 2, 0) / kohortN
      : 0
  const sdTheta = Math.sqrt(varianceTheta)
  const tShkalaFaol = kohortN >= MIN_TSCORE_KOHORT && sdTheta >= MIN_SD_THETA

  let kalibrlashUsuli = "taxminiy"
  if (cmlQollanilgan && tShkalaFaol) kalibrlashUsuli = "cml_kohort"
  else if (cmlQollanilgan) kalibrlashUsuli = "cml_bazaviy"

  const yakuniyHisoblar = dastlabkiHisoblar.map(({ u, xarita, rasch, oddiy }) => {
    let shkalaBalli = rasch.shkalaBalli
    let ballPast = rasch.ballPast
    let ballYuqori = rasch.ballYuqori
    let darajaInfo = aniqlaDaraja(shkalaBalli)
    let zBaho = null

    if (tShkalaFaol) {
      zBaho = Number(((rasch.theta - meanTheta) / sdTheta).toFixed(2))
      shkalaBalli = yaxlit1(clamp(50 + 10 * zBaho, 0, MS_SHKALA_STANDART.maks))
      const seT = (rasch.se / sdTheta) * 10
      ballPast = yaxlit1(clamp(shkalaBalli - MS_SHKALA_STANDART.ishonchZ * seT, 0, MS_SHKALA_STANDART.maks))
      ballYuqori = yaxlit1(clamp(shkalaBalli + MS_SHKALA_STANDART.ishonchZ * seT, 0, MS_SHKALA_STANDART.maks))
      darajaInfo = aniqlaDaraja(shkalaBalli)
    }

    const yakuniyRasch = {
      ...rasch,
      shkalaBalli,
      ballPast,
      ballYuqori,
      daraja: darajaInfo.daraja,
      darajaNomi: darajaInfo.darajaNomi,
      imtiyoz: darajaInfo.imtiyoz,
      tavsif: darajaInfo.tavsif,
      zBaho,
      tShkalaFaol,
    }

    const savolNatijalari = kalibrlanganSavollar.map((s) => {
      const j = javobOl(xarita, s)
      return {
        id: s.id,
        mavzu: s.mavzu || "",
        soha: s.soha || "Umumiy kimyo",
        qiyinlik: s.qiyinlik,
        turi: s.turi || "variant",
        berilganJavob: j?.berilganJavob ?? null,
        togri: Boolean(j?.togri),
        javobBerildi: Boolean(j?.javobBerildi),
      }
    })

    const sohalarMap = {}
    for (const sn of savolNatijalari) {
      if (!sohalarMap[sn.soha]) sohalarMap[sn.soha] = { jami: 0, togri: 0 }
      sohalarMap[sn.soha].jami += 1
      if (sn.togri) sohalarMap[sn.soha].togri += 1
    }
    const sohalarStatistikasi = Object.entries(sohalarMap).map(([soha, d]) => ({
      soha,
      jami: d.jami,
      togri: d.togri,
      foiz: d.jami > 0 ? Math.round((d.togri / d.jami) * 100) : 0,
    }))

    const taqqoslash = taqqoslashTahlili(yakuniyRasch, oddiy, savolNatijalari)

    return {
      urinishId: u.id,
      sessiyaId: u.sessiyaId,
      userId: u.userId,
      kechikkan: Boolean(u.kechikkan),
      sarflanganVaqt: u.sarflanganVaqt || 0,
      rasch: yakuniyRasch,
      oddiy,
      taqqoslash,
      sohalarStatistikasi,
      savolNatijalari,
      qiyinlikYangilash: kalibrlanganSavollar.map((s) => ({
        savolKalit: kalitOf(s),
        qiyinlik: s.qiyinlik,
      })),
    }
  })

  // 4. O'z vaqtida topshirganlar orasida o'rin (rank) va percentile
  const reytingNomzodlar = yakuniyHisoblar
    .filter((item) => !item.kechikkan)
    .sort((a, b) => {
      if (b.rasch.shkalaBalli !== a.rasch.shkalaBalli) {
        return b.rasch.shkalaBalli - a.rasch.shkalaBalli
      }
      if (b.oddiy.rawScore !== a.oddiy.rawScore) {
        return b.oddiy.rawScore - a.oddiy.rawScore
      }
      return a.sarflanganVaqt - b.sarflanganVaqt
    })

  const reytingJami = reytingNomzodlar.length
  const rankMap = new Map()
  let joriyOrin = 1
  reytingNomzodlar.forEach((item, index) => {
    if (index > 0) {
      const old = reytingNomzodlar[index - 1]
      const teng =
        old.rasch.shkalaBalli === item.rasch.shkalaBalli &&
        old.oddiy.rawScore === item.oddiy.rawScore
      if (!teng) joriyOrin = index + 1
    }
    const percentile =
      reytingJami > 0 ? Number((((reytingJami - joriyOrin + 1) / reytingJami) * 100).toFixed(1)) : 100
    rankMap.set(item.urinishId || item.sessiyaId, {
      cohortRank: joriyOrin,
      cohortTotal: reytingJami,
      percentile,
    })
  })

  const yangilanganUrinishlar = yakuniyHisoblar.map((item) => {
    const r = rankMap.get(item.urinishId || item.sessiyaId)
    return {
      ...item,
      cohortRank: r?.cohortRank ?? null,
      cohortTotal: reytingJami,
      percentile: r?.percentile ?? null,
    }
  })

  // Umumiy kohort statistikasi
  const reytingItemlar = yangilanganUrinishlar.filter((i) => !i.kechikkan)
  const ortachaOddiyFoiz =
    reytingItemlar.length > 0
      ? Number(
          (
            reytingItemlar.reduce((s, i) => s + i.oddiy.oddiyFoiz, 0) / reytingItemlar.length
          ).toFixed(1)
        )
      : 0
  const ortachaRaschBall =
    reytingItemlar.length > 0
      ? Number(
          (
            reytingItemlar.reduce((s, i) => s + i.rasch.shkalaBalli, 0) / reytingItemlar.length
          ).toFixed(1)
        )
      : 0

  const jamiReyting = reytingItemlar.length
  const raschDarajaHisob = new Map(RASCH_DARAJA_TARTIB.map((d) => [d, 0]))
  const oddiyBahoHisob = new Map(ODDIY_BAHO_TARTIB.map((d) => [d, 0]))
  for (const item of reytingItemlar) {
    raschDarajaHisob.set(item.rasch.daraja, (raschDarajaHisob.get(item.rasch.daraja) || 0) + 1)
    oddiyBahoHisob.set(item.oddiy.oddiyBaho, (oddiyBahoHisob.get(item.oddiy.oddiyBaho) || 0) + 1)
  }

  const darajaTaqsimoti = RASCH_DARAJA_TARTIB.map((daraja) => {
    const soni = raschDarajaHisob.get(daraja) || 0
    return {
      daraja,
      soni,
      foiz: jamiReyting > 0 ? Math.round((soni / jamiReyting) * 100) : 0,
    }
  })

  const oddiyTaqsimot = ODDIY_BAHO_TARTIB.map((baho) => {
    const soni = oddiyBahoHisob.get(baho) || 0
    return {
      baho,
      soni,
      foiz: jamiReyting > 0 ? Math.round((soni / jamiReyting) * 100) : 0,
    }
  })

  const raschBallar = reytingItemlar.map((i) => i.rasch.shkalaBalli)
  const oddiyBallar = reytingItemlar.map((i) => i.oddiy.oddiyBall)
  const ishonchsizSoni = harakatlar.filter((u, idx) => dastlabkiHisoblar[idx]?.rasch?.ishonchsiz).length
  const kechikkanSoni = harakatlar.length - jamiReyting
  const sertifikatOladiSoni = reytingItemlar.filter(
    (i) => Boolean(i.userId) && i.rasch.daraja !== "Qoniqarsiz"
  ).length

  let raschFoydaSoni = 0
  let oddiyFoydaSoni = 0
  let tengSoni = 0
  let farqYigindi = 0
  let engKattaMusbatFarq = null
  let engKattaManfiyFarq = null

  reytingItemlar.forEach((item) => {
    const uOrig = harakatlar.find((x) => (x.id || x.sessiyaId) === (item.urinishId || item.sessiyaId))
    const ism = uOrig?.user?.fullName || uOrig?.user?.username || "Ishtirokchi"
    const f = item.taqqoslash.farqBall
    farqYigindi += f
    if (item.taqqoslash.foydaliTomon === "rasch") raschFoydaSoni += 1
    else if (item.taqqoslash.foydaliTomon === "oddiy") oddiyFoydaSoni += 1
    else tengSoni += 1

    if (!engKattaMusbatFarq || f > engKattaMusbatFarq.farqBall) {
      engKattaMusbatFarq = {
        ism,
        userId: item.userId,
        farqBall: f,
        raschBall: item.rasch.shkalaBalli,
        oddiyBall: item.oddiy.oddiyBall,
      }
    }
    if (!engKattaManfiyFarq || f < engKattaManfiyFarq.farqBall) {
      engKattaManfiyFarq = {
        ism,
        userId: item.userId,
        farqBall: f,
        raschBall: item.rasch.shkalaBalli,
        oddiyBall: item.oddiy.oddiyBall,
      }
    }
  })

  const savollarMeta = kalibrlanganSavollar.map((s) => ({
    id: s.id,
    kalit: kalitOf(s),
    mavzu: s.mavzu || "",
    soha: s.soha || "Umumiy kimyo",
    turi: s.turi || "variant",
    boshlangichQiyinlik: s.boshlangichQiyinlik,
    qiyinlik: s.qiyinlik,
    se: s.kalibrlanganSe,
    infit: s.infit,
    outfit: s.outfit,
    korrelyatsiya: s.korrelyatsiya,
    kohortTogriFoiz: s.kohortTogriFoiz,
    muammo: s.muammo,
  }))

  const sohaGuruh = new Map()
  const turGuruh = new Map()
  savollarMeta.forEach((s) => {
    if (!sohaGuruh.has(s.soha)) sohaGuruh.set(s.soha, [])
    sohaGuruh.get(s.soha).push(s)

    const tur = s.turi || "variant"
    if (!turGuruh.has(tur)) turGuruh.set(tur, [])
    turGuruh.get(tur).push(s)
  })

  const sohalarHisoboti = Array.from(sohaGuruh.entries()).map(([soha, list]) => {
    const foizli = list.filter((x) => typeof x.kohortTogriFoiz === "number")
    const ortachaTogriFoiz =
      foizli.length > 0
        ? Math.round(foizli.reduce((sum, x) => sum + x.kohortTogriFoiz, 0) / foizli.length)
        : null
    const ortachaB = Number(
      (list.reduce((sum, x) => sum + (Number(x.qiyinlik) || 0), 0) / list.length).toFixed(2)
    )
    const saralangan = [...list].sort((a, b) => (b.qiyinlik || 0) - (a.qiyinlik || 0))
    return {
      soha,
      savollarSoni: list.length,
      ortachaTogriFoiz,
      ortachaB,
      engQiyinSavolId: saralangan[0]?.id || null,
      engOsonSavolId: saralangan[saralangan.length - 1]?.id || null,
    }
  })

  const turlarHisoboti = ["variant", "moslashtirish", "ochiq"]
    .filter((t) => turGuruh.has(t))
    .map((turi) => {
      const list = turGuruh.get(turi)
      const foizli = list.filter((x) => typeof x.kohortTogriFoiz === "number")
      return {
        turi,
        nom: turNomi(turi),
        savollarSoni: list.length,
        ortachaTogriFoiz:
          foizli.length > 0
            ? Math.round(foizli.reduce((sum, x) => sum + x.kohortTogriFoiz, 0) / foizli.length)
            : null,
      }
    })

  const muammolarHisoboti = savollarMeta
    .map((s) => {
      const sabablar = [...(Array.isArray(s.muammo) ? s.muammo : [])]
      const bDrift = Number((s.qiyinlik - s.boshlangichQiyinlik).toFixed(2))
      if (Math.abs(bDrift) >= 0.8 && !sabablar.includes("qiyinlik_siljishi")) {
        sabablar.push("qiyinlik_siljishi")
      }
      if (sabablar.length === 0) return null
      return {
        id: s.id,
        mavzu: s.mavzu,
        soha: s.soha,
        qiyinlik: s.qiyinlik,
        boshlangichQiyinlik: s.boshlangichQiyinlik,
        bDrift,
        kohortTogriFoiz: s.kohortTogriFoiz,
        infit: s.infit,
        outfit: s.outfit,
        korrelyatsiya: s.korrelyatsiya,
        sabablar,
      }
    })
    .filter(Boolean)

  const kalibrlashStats = {
    kalibrlashUsuli,
    tShkalaFaol,
    jamiUrinish: harakatlar.length,
    yaroqliKohort: kohortN,
    cmlIshlatilgan: cmlNatija?.ishlatilgan ?? 0,
    cmlTashlangan: cmlNatija?.tashlangan ?? 0,
    chetdaSavollar: cmlNatija?.chetda || [],
    ishonchlilik: cmlNatija?.ishonchlilik ?? null,
    yaqinlashdi: cmlQollanilgan,
    iteratsiya: cmlNatija?.iteratsiya ?? 0,
    meanTheta: Number(meanTheta.toFixed(3)),
    sdTheta: Number(sdTheta.toFixed(3)),
    ortachaOddiyFoiz,
    ortachaRaschBall,
    darajaTaqsimoti,
    oddiyTaqsimot,
    raschSifatXulosasi: {
      kechikkanSoni,
      ishonchsizSoni,
      sertifikatOladiSoni,
      sertifikatFoizi: jamiReyting > 0 ? Math.round((sertifikatOladiSoni / jamiReyting) * 100) : 0,
      medianaRasch: mediana(raschBallar),
      engYuqoriRasch: raschBallar.length ? Math.max(...raschBallar) : 0,
      engPastRasch: raschBallar.length ? Math.min(...raschBallar) : 0,
      medianaOddiy: mediana(oddiyBallar),
      engYuqoriOddiy: oddiyBallar.length ? Math.max(...oddiyBallar) : 0,
      engPastOddiy: oddiyBallar.length ? Math.min(...oddiyBallar) : 0,
      ortachaVaqtSoniya:
        jamiReyting > 0
          ? Math.round(reytingItemlar.reduce((s, i) => s + (i.sarflanganVaqt || 0), 0) / jamiReyting)
          : 0,
    },
    taqqoslashXulosasi: {
      raschFoydaSoni,
      oddiyFoydaSoni,
      tengSoni,
      ortachaFarq: jamiReyting > 0 ? Number((farqYigindi / jamiReyting).toFixed(1)) : 0,
      engKattaMusbatFarq,
      engKattaManfiyFarq,
    },
    sohalarHisoboti,
    turlarHisoboti,
    muammolarHisoboti,
    savollarMeta,
  }

  return {
    kalibrlashUsuli,
    kalibrlashStats,
    kalibrlanganSavollar,
    yangilanganUrinishlar,
  }
}

/**
 * Bazadagi MsImtihon jadvallari bilan server katalogini boyitadi.
 * Natijalar e'lon qilinmaguncha o'quvchi urinishi haqidagi ballar sir tutiladi.
 */
export async function katalogJadvalBilan(
  db,
  { userId = null, isSuperAdmin: superadminmi = false, hozir = Date.now(), savollarOl } = {}
) {
  const bazaviy = sinovKatalogi(savollarOl)

  let imtihonlar = []
  let foydalanuvchiUrinishlari = []
  const urinishSanoq = new Map()

  if (db?.msImtihon?.findMany) {
    try {
      imtihonlar = await db.msImtihon.findMany({
        select: {
          id: true,
          slug: true,
          sarlavha: true,
          tavsif: true,
          startsAt: true,
          endsAt: true,
          rejim: true,
          vaqtMin: true,
          faol: true,
          isAnnounced: true,
          publishedAt: true,
          kalibrlashUsuli: true,
          _count: { select: { urinishlar: true } },
        },
      })
    } catch {
      imtihonlar = []
    }
  }

  // Haqiqiy ishtirokchilar soni: superadmin sinov urinishlari hisoblanmaydi
  if (db?.msUrinish?.groupBy) {
    try {
      const guruhlangan = await db.msUrinish.groupBy({
        by: ["slug"],
        where: MS_REAL_URINISH_FILTR,
        _count: { _all: true },
      })
      for (const g of guruhlangan) {
        urinishSanoq.set(g.slug, g._count?._all ?? 0)
      }
    } catch {
      imtihonlar.forEach((i) => urinishSanoq.set(i.slug, i._count?.urinishlar ?? 0))
    }
  } else {
    imtihonlar.forEach((i) => urinishSanoq.set(i.slug, i._count?.urinishlar ?? 0))
  }

  if (userId && !superadminmi && db?.msUrinish?.findMany) {
    try {
      foydalanuvchiUrinishlari = await db.msUrinish.findMany({
        where: { userId },
        orderBy: { yakunlanganVaqt: "desc" },
        select: {
          id: true,
          slug: true,
          imtihonId: true,
          holat: true,
          yakunlanganVaqt: true,
        },
      })
    } catch {
      foydalanuvchiUrinishlari = []
    }
  }

  const imtihonMap = new Map(imtihonlar.map((i) => [i.slug, i]))

  return bazaviy.map((variant) => {
    const bankTayyor = variant.holat === "ochiq"
    if (!bankTayyor) {
      return {
        ...variant,
        bankTayyor: false,
        holat: "tayyorlanmoqda",
        jadval: null,
        meningUrinishim: null,
        superadminRejimi: superadminmi,
      }
    }

    const imtihon = imtihonMap.get(variant.slug) || null
    const holatInfo = jadvalHolatiAniqlash(imtihon, hozir)
    const meningUrinish = superadminmi
      ? null
      : foydalanuvchiUrinishlari.find(
          (u) => (imtihon && u.imtihonId === imtihon.id) || u.slug === variant.slug
        )

    return {
      ...variant,
      vaqtMin: imtihon?.vaqtMin || variant.vaqtMin,
      bankTayyor: true,
      holat: holatInfo.holat,
      rejim: holatInfo.rejim,
      superadminRejimi: superadminmi,
      jadval: imtihon
        ? {
            id: imtihon.id,
            sarlavha: imtihon.sarlavha,
            tavsif: imtihon.tavsif,
            startsAt: imtihon.startsAt ? new Date(imtihon.startsAt).toISOString() : null,
            endsAt: imtihon.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
            rejim: imtihon.rejim,
            faol: imtihon.faol,
            isAnnounced: imtihon.isAnnounced,
            publishedAt: imtihon.publishedAt ? new Date(imtihon.publishedAt).toISOString() : null,
            kalibrlashUsuli: imtihon.kalibrlashUsuli || null,
            qatnashchilarSoni: urinishSanoq.get(variant.slug) || 0,
            qolganSoniya: holatInfo.qolganSoniya ?? null,
          }
        : null,
      // Diqqat: bu yerda hech qachon ball/foiz/daraja qaytarilmaydi — faqat topshirganmi yo'qmi
      meningUrinishim: meningUrinish
        ? {
            topshirildi: true,
            topshirilganVaqt: new Date(meningUrinish.yakunlanganVaqt).toISOString(),
            natijaOchiq:
              holatInfo.rejim === "erkin" || Boolean(imtihon?.isAnnounced),
          }
        : null,
    }
  })
}
