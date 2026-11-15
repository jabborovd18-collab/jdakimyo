// test/milliy-sertifikat-jadval.test.js
import test from "node:test"
import assert from "node:assert/strict"
import {
  jadvalHolatiAniqlash,
  katalogJadvalBilan,
  kohortKalibrlaVaHisobla,
  oddiyBahoHisobla,
  taqqoslashTahlili,
} from "../lib/milliy-sertifikat-kohort.js"
import { sessiyaSavollari } from "../lib/milliy-sertifikat-aralashtirish.js"
import {
  kalibrlaVaElonQil,
  qurPublishedNatija,
  yakunlaSinov,
} from "../lib/milliy-sertifikat-yakunlash.js"
import { raschEhtimollik } from "../lib/rasch-model.js"

const SIR = "jadval-sinov-siri"
const SLUG = "milliy-sertifikat-simulyator"

const NAMUNA_SAVOLLAR = Array.from({ length: 20 }, (_, i) => ({
  id: `ms1-${String(i + 1).padStart(2, "0")}`,
  mavzu: `Mavzu ${i + 1}`,
  soha: i < 10 ? "Umumiy kimyo" : "Organik kimyo",
  turi: i >= 17 ? "ochiq" : "variant",
  qiyinlik: Number((-2.0 + (4.0 * i) / 19).toFixed(2)),
  question: `Savol ${i + 1}`,
  ...(i >= 17
    ? { correct: String(10 + i), altCorrect: String(10 + i), tolerance: 0.01 }
    : { options: [`to'g'ri ${i + 1}`, `xato-a`, `xato-b`, `xato-c`], correct: 0 }),
  explanation: `Ilmiy izoh ${i + 1}`,
}))

function toliqSoxtaBaza({ imtihon = null } = {}) {
  const baza = {
    imtihon,
    urinishlar: [],
    natijalar: [],
    sertifikatlar: [],
  }
  const db = {
    baza,
    msImtihon: {
      findMany: async () => (baza.imtihon ? [{ ...baza.imtihon, _count: { urinishlar: baza.urinishlar.length } }] : []),
      findUnique: async ({ where }) => {
        if (!baza.imtihon) return null
        if (where.slug && baza.imtihon.slug !== where.slug) return null
        if (where.id && baza.imtihon.id !== where.id) return null
        return baza.imtihon
      },
      update: async ({ where, data }) => {
        baza.imtihon = { ...baza.imtihon, ...data }
        return baza.imtihon
      },
    },
    msUrinish: {
      groupBy: async () => {
        const map = new Map()
        for (const u of baza.urinishlar) {
          if (u.user?.role === "superadmin") continue
          map.set(u.slug, (map.get(u.slug) || 0) + 1)
        }
        return Array.from(map.entries()).map(([slug, count]) => ({ slug, _count: { _all: count } }))
      },
      count: async ({ where }) =>
        baza.urinishlar.filter(
          (u) => (!where.userId || u.userId === where.userId) && (!where.slug || u.slug === where.slug)
        ).length,
      findFirst: async ({ where }) =>
        baza.urinishlar.find((u) => {
          if (where.userId && u.userId !== where.userId) return false
          if (Array.isArray(where.OR)) {
            return where.OR.some(
              (c) =>
                (c.sessiyaId && u.sessiyaId === c.sessiyaId) ||
                (c.imtihonId && u.imtihonId === c.imtihonId) ||
                (c.slug && u.slug === c.slug)
            )
          }
          return true
        }) || null,
      findMany: async ({ where } = {}) => {
        if (where?.userId) {
          return baza.urinishlar.filter((u) => u.userId === where.userId)
        }
        return baza.urinishlar
      },
      create: async ({ data }) => {
        if (baza.urinishlar.some((u) => u.sessiyaId === data.sessiyaId)) {
          throw Object.assign(new Error("unique"), { code: "P2002" })
        }
        const id = `ur-${baza.urinishlar.length + 1}`
        const javoblar = (data.javoblar?.create || []).map((j, idx) => ({
          id: `j-${id}-${idx}`,
          urinishId: id,
          ...j,
        }))
        const row = {
          id,
          ...data,
          yakunlanganVaqt: new Date(),
          javoblar,
          user: { id: data.userId, fullName: `Ishtirokchi ${data.userId}`, username: data.userId },
        }
        baza.urinishlar.push(row)
        return row
      },
      update: async ({ where, data }) => {
        const u = baza.urinishlar.find((x) => x.id === where.id)
        if (u) Object.assign(u, data)
        return u
      },
    },
    msJavob: {
      updateMany: async ({ where, data }) => {
        const u = baza.urinishlar.find((x) => x.id === where.urinishId)
        for (const j of u?.javoblar || []) {
          if (j.savolKalit === where.savolKalit) Object.assign(j, data)
        }
        return { count: 1 }
      },
    },
    quizResult: {
      create: async ({ data }) => {
        if (baza.natijalar.some((n) => n.attemptId === data.attemptId)) {
          throw Object.assign(new Error("unique"), { code: "P2002" })
        }
        baza.natijalar.push(data)
        return data
      },
      upsert: async ({ where, update, create }) => {
        const idx = baza.natijalar.findIndex((n) => n.attemptId === where.attemptId)
        if (idx >= 0) {
          baza.natijalar[idx] = { ...baza.natijalar[idx], ...update }
        } else {
          baza.natijalar.push(create)
        }
      },
    },
    certificate: {
      create: async ({ data }) => {
        baza.sertifikatlar.push(data)
        return data
      },
      updateMany: async ({ where, data }) => {
        const c = baza.sertifikatlar.find((x) => x.certId === where.certId)
        if (c) Object.assign(c, data)
        return { count: c ? 1 : 0 }
      },
    },
  }
  db.$transaction = async (fn) => fn(db)
  return db
}

function togriJavoblarSessiya(sid) {
  const s = sessiyaSavollari(NAMUNA_SAVOLLAR, sid, SIR)
  return Object.fromEntries(s.map((q) => [q.id, q.correct]))
}

test("Jadval holati — boshlanishdan oldin, jarayonda, yopiq va e'londan keyin", () => {
  const t0 = 1_000_000_000
  const asos = {
    id: "imt-1",
    slug: SLUG,
    rejim: "jadval",
    faol: true,
    isAnnounced: false,
    startsAt: new Date(t0 + 60_000),
    endsAt: new Date(t0 + 3_600_000),
  }

  assert.equal(jadvalHolatiAniqlash(null, t0).holat, "belgilanmagan")
  assert.equal(jadvalHolatiAniqlash({ ...asos, faol: false }, t0).holat, "yopiq")

  const kutilmoqda = jadvalHolatiAniqlash(asos, t0)
  assert.equal(kutilmoqda.holat, "kutilmoqda")
  assert.equal(kutilmoqda.ruxsatOlish, false)

  const ochiq = jadvalHolatiAniqlash(asos, t0 + 120_000)
  assert.equal(ochiq.holat, "ochiq")
  assert.equal(ochiq.ruxsatOlish, true)

  const yopiqKutilmoqda = jadvalHolatiAniqlash(asos, t0 + 4_000_000)
  assert.equal(yopiqKutilmoqda.holat, "tekshirilmoqda")
  assert.equal(yopiqKutilmoqda.ruxsatNatija, false)

  const elon = jadvalHolatiAniqlash({ ...asos, isAnnounced: true }, t0 + 4_000_000)
  assert.equal(elon.holat, "elon_qilindi")
  assert.equal(elon.ruxsatNatija, true)
  assert.equal(elon.ruxsatOlish, false)
})

test("Oldindan natija yo'q — belgilangan imtihonda topshirgach ball va kalit yashirin qoladi", async () => {
  const bosh = 10_000_000
  const tugash = bosh + 3_600_000
  const imtihon = {
    id: "imt-1",
    slug: SLUG,
    sarlavha: "MS Sinov #1 (Belgilangan)",
    rejim: "jadval",
    faol: true,
    isAnnounced: false,
    startsAt: new Date(bosh),
    endsAt: new Date(tugash),
  }
  const db = toliqSoxtaBaza({ imtihon })
  const s = { sid: "sid-jadval-1", slug: SLUG, uid: "u1", bosh, tugash }

  // Mehmonga ruxsat yo'q
  const mehmon = await yakunlaSinov({
    db,
    sessiya: { ...s, uid: null },
    javoblar: {},
    userId: null,
    toliqIsm: "Mehmon",
    sir: SIR,
    hozir: bosh + 10_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(mehmon.status, 401)

  // Vaqtidan oldin ruxsat yo'q
  const erta = await yakunlaSinov({
    db,
    sessiya: s,
    javoblar: {},
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: bosh - 5000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(erta.status, 403)

  // Ochiq vaqtda topshirish: FAQAT yashirin kvitansiya qaytadi
  const topshirish = await yakunlaSinov({
    db,
    sessiya: s,
    javoblar: togriJavoblarSessiya(s.sid),
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: bosh + 600_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(topshirish.status, 200)
  assert.equal(topshirish.body.yashirin, true)
  assert.equal("natija" in topshirish.body, false, "E'londan oldin natija chiqmasligi shart")
  assert.equal("rawScore" in topshirish.body.qabulQilindi, false)
  assert.equal("shkalaBalli" in topshirish.body.qabulQilindi, false)
  assert.equal(topshirish.body.qabulQilindi.javobBerilganSoni, 20)
  assert.equal(db.baza.natijalar.length, 0, "QuizResult ham e'longacha yozilmaydi")
  assert.equal(db.baza.sertifikatlar.length, 0, "Sertifikat ham e'longacha berilmaydi")
  assert.equal(db.baza.urinishlar[0].holat, "topshirildi")
  assert.equal(typeof db.baza.urinishlar[0].javoblar[0].berilganJavob, "string")

  // Qayta topshirish bloklanadi
  const qayta = await yakunlaSinov({
    db,
    sessiya: { ...s, sid: "sid-jadval-2" },
    javoblar: {},
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: bosh + 700_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(qayta.status, 409)
  assert.equal(qayta.body.takroriy, true)
})

test("Oddiy ball tizimi va solishtirma tahlil aniq ishlaydi", () => {
  const oddiy = oddiyBahoHisobla(32, 40)
  assert.equal(oddiy.oddiyFoiz, 80)
  assert.equal(oddiy.oddiyBall, 80)
  assert.equal(oddiy.oddiyBaho, "4 (Yaxshi)")
  assert.equal(oddiy.harSavolBall, 2.5)

  const alo = oddiyBahoHisobla(36, 40)
  assert.equal(alo.oddiyBaho, "5 (A'lo)")

  const taq = taqqoslashTahlili(
    { shkalaBalli: 76.4, ishonchsiz: false },
    { oddiyBall: 65.0 },
    [
      { qiyinlik: -1.2, turi: "variant", togri: true },
      { qiyinlik: 1.5, turi: "ochiq", togri: true },
    ]
  )
  assert.equal(taq.farqBall, 11.4)
  assert.equal(taq.foydaliTomon, "rasch")
})

test("Umumiy e'lon — kohort kalibrlash, hammaga bir xil ochilish va ikki xil natija (qiyin vs oson imtihon)", async () => {
  const bosh = 20_000_000
  const tugash = bosh + 3_600_000

  async function kohortSimulyatsiya(thetaSiljish) {
    const imtihon = {
      id: "imt-sim",
      slug: SLUG,
      sarlavha: "MS Kohort Simulyatsiyasi",
      rejim: "jadval",
      faol: true,
      isAnnounced: false,
      startsAt: new Date(bosh),
      endsAt: new Date(tugash),
    }
    const db = toliqSoxtaBaza({ imtihon })

    // 18 ta o'quvchi (deterministik RNG bilan)
    let seed = 42
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed / 2 ** 32
    }

    for (let u = 1; u <= 18; u++) {
      const uid = `user-${u}`
      const sid = `sid-${u}`
      // thetaSiljish manfiy bo'lsa qiyin imtihon, musbat bo'lsa oson imtihon muhiti
      const haqiqiyTheta = -1.6 + (3.2 * (u - 1)) / 17 + thetaSiljish
      const sessiyaSav = sessiyaSavollari(NAMUNA_SAVOLLAR, sid, SIR)
      const javoblar = {}

      sessiyaSav.forEach((s) => {
        const p = raschEhtimollik(haqiqiyTheta, s.qiyinlik)
        const topdi = rand() < p
        if (s.turi === "ochiq") {
          javoblar[s.id] = topdi ? s.correct : "999"
        } else {
          javoblar[s.id] = topdi ? s.correct : (s.correct + 1) % 4
        }
      })

      const res = await yakunlaSinov({
        db,
        sessiya: { sid, slug: SLUG, uid, bosh, tugash },
        javoblar,
        userId: uid,
        toliqIsm: `Talaba ${u}`,
        sir: SIR,
        hozir: bosh + 1_200_000 + u * 1000,
        savollarOl: () => NAMUNA_SAVOLLAR,
      })
      assert.equal(res.status, 200)
      assert.equal(res.body.yashirin, true)
    }

    // E'londan oldin natija va sertifikat yo'q
    assert.equal(db.baza.natijalar.length, 0)
    assert.equal(db.baza.sertifikatlar.length, 0)

    const elon = await kalibrlaVaElonQil({
      db,
      imtihon: db.baza.imtihon,
      aslSavollar: NAMUNA_SAVOLLAR,
      hozir: new Date(tugash + 60_000),
    })

    // Qayta e'lon qilish sertifikatlarni dublikat qilmasligi kerak
    const sertSoniBirinchi = db.baza.sertifikatlar.length
    await kalibrlaVaElonQil({
      db,
      imtihon: elon.imtihon,
      aslSavollar: NAMUNA_SAVOLLAR,
      hozir: new Date(tugash + 120_000),
    })
    assert.equal(db.baza.sertifikatlar.length, sertSoniBirinchi)
    assert.equal(elon.imtihon.isAnnounced, true)
    assert.equal(db.baza.urinishlar.every((u) => u.holat === "elon_qilindi"), true)
    assert.equal(db.baza.natijalar.length, 18)

    return { db, elon }
  }

  // 1. Qiyin imtihon muhiti (ko'pchilik kam topgan, lekin kuchli o'quvchi ajralib chiqadi)
  const qiyinKohort = await kohortSimulyatsiya(-1.4)
  const kuchliUrinish = qiyinKohort.db.baza.urinishlar[17] // user-18
  const kuchliCert = qiyinKohort.db.baza.sertifikatlar.find(
    (c) => c.certId === kuchliUrinish.certId
  )
  const kuchliNatija = qurPublishedNatija({
    urinish: kuchliUrinish,
    imtihon: qiyinKohort.elon.imtihon,
    aslSavollar: NAMUNA_SAVOLLAR,
    cert: kuchliCert,
  })
  assert.equal(kuchliNatija.kohort.rank, 1)
  assert.equal(kuchliNatija.kohort.tShkalaFaol, true)
  assert.equal(typeof kuchliNatija.oddiyNatija.oddiyBall, "number")
  assert.equal(
    kuchliNatija.shkalaBalli > kuchliNatija.oddiyNatija.oddiyBall,
    true,
    `Qiyin imtihonda yetakchi Rasch (${kuchliNatija.shkalaBalli}) oddiy balldan (${kuchliNatija.oddiyNatija.oddiyBall}) yuqori bo'lishi kerak`
  )
  assert.equal(kuchliNatija.taqqoslash.foydaliTomon, "rasch")
  // Saqlangan berilganJavob aralashtirishdan keyin ham tiklanadi
  assert.equal(kuchliNatija.savolNatijalari.length, 20)
  assert.equal(
    kuchliNatija.savolNatijalari.every(
      (s) => typeof s.kohortTogriFoiz === "number" && s.berilganJavob !== null
    ),
    true
  )

  // 2. Oson imtihon muhiti (ko'pchilik yuqori foiz olgan): o'rta ishtirokchi uchun oddiy foiz Raschdan yuqori
  const osonKohort = await kohortSimulyatsiya(+1.0)
  const ortaUrinish = osonKohort.db.baza.urinishlar[8] // o'rtadagi o'quvchi
  const ortaNatija = qurPublishedNatija({
    urinish: ortaUrinish,
    imtihon: osonKohort.elon.imtihon,
    aslSavollar: NAMUNA_SAVOLLAR,
  })
  assert.equal(
    ortaNatija.oddiyNatija.oddiyBall > ortaNatija.shkalaBalli,
    true,
    `Oson imtihonda o'rta o'quvchiga oddiy ball (${ortaNatija.oddiyNatija.oddiyBall}) Rasch (${ortaNatija.shkalaBalli}) dan yuqori bo'ladi`
  )
  assert.equal(ortaNatija.taqqoslash.foydaliTomon, "oddiy")
})

test("Superadmin cheksiz yechishi — muddat/holat cheklovisiz ishlaydi va natijasi bazaga hamda reytingga yozilmaydi", async () => {
  const kelajakBosh = Date.now() + 86_400_000
  const db = toliqSoxtaBaza({
    imtihon: {
      id: "imt-sa",
      slug: SLUG,
      sarlavha: "Yopiq va kelajakdagi imtihon",
      rejim: "jadval",
      faol: false,
      isAnnounced: false,
      startsAt: new Date(kelajakBosh),
      endsAt: new Date(kelajakBosh + 3_600_000),
    },
  })

  // Superadmin 3 marta ketma-ket yopiq/boshlanmagan imtihonni yechib ko'radi
  for (let i = 1; i <= 3; i++) {
    const sid = `sa-sessiya-${i}`
    const res = await yakunlaSinov({
      db,
      sessiya: { sid, slug: SLUG, uid: "sa-1", bosh: 1000, tugash: 1000 + 3_600_000 },
      javoblar: togriJavoblarSessiya(sid),
      userId: "sa-1",
      toliqIsm: "Super Admin",
      sir: SIR,
      hozir: 1000 + i * 300_000,
      savollarOl: () => NAMUNA_SAVOLLAR,
      superadminmi: true,
    })

    assert.equal(res.status, 200)
    assert.equal(res.body.superadminSinovi, true)
    assert.equal(res.body.natija.superadminSinovi, true)
    assert.equal(typeof res.body.natija.shkalaBalli, "number")
    assert.equal(res.body.natija.oddiyNatija.oddiyFoiz, 100)
    assert.equal(res.body.natija.sertifikat, null)
  }

  // Bazada hech qanday urinish, QuizResult va sertifikat yozilmagan bo'lishi shart
  assert.equal(db.baza.urinishlar.length, 0)
  assert.equal(db.baza.natijalar.length, 0)
  assert.equal(db.baza.sertifikatlar.length, 0)

  const katalog = await katalogJadvalBilan(db, {
    userId: "sa-1",
    isSuperAdmin: true,
  })
  const tanlangan = katalog.find((k) => k.slug === SLUG)
  assert.equal(tanlangan.bankTayyor, true)
  assert.equal(tanlangan.superadminRejimi, true)
  assert.equal(tanlangan.meningUrinishim, null)
})

test("Superadmin qatorlari kohort kalibrlash, ishtirokchilar soni, reyting va boy hisobotlardan chetlatiladi", async () => {
  const bosh = 30_000_000
  const tugash = bosh + 3_600_000
  const db = toliqSoxtaBaza({
    imtihon: {
      id: "imt-hisobot",
      slug: SLUG,
      sarlavha: "Boy Hisobot Simulyatsiyasi",
      rejim: "jadval",
      faol: true,
      isAnnounced: false,
      startsAt: new Date(bosh),
      endsAt: new Date(tugash),
    },
  })

  // 6 nafar haqiqiy o'quvchi
  for (let u = 1; u <= 6; u++) {
    const uid = `talaba-${u}`
    const sid = `sid-h-${u}`
    const s = sessiyaSavollari(NAMUNA_SAVOLLAR, sid, SIR)
    const javoblar = {}
    s.forEach((savol, idx) => {
      const togriQilsin = idx < 6 + u * 2
      javoblar[savol.id] =
        savol.turi === "ochiq"
          ? togriQilsin
            ? savol.correct
            : "0"
          : togriQilsin
            ? savol.correct
            : (savol.correct + 1) % 4
    })
    await yakunlaSinov({
      db,
      sessiya: { sid, slug: SLUG, uid, bosh, tugash },
      javoblar,
      userId: uid,
      toliqIsm: `Talaba ${u}`,
      sir: SIR,
      hozir: bosh + 900_000 + u * 10_000,
      savollarOl: () => NAMUNA_SAVOLLAR,
    })
  }

  // Ehtiyot chorasi: bazada eski superadmin urinishi yotgan bo'lsa ham hisobga kirmasligi kerak
  db.baza.urinishlar.push({
    id: "ur-superadmin-legacy",
    sessiyaId: "sa-legacy-sessiya",
    userId: "sa-legacy",
    slug: SLUG,
    imtihonId: "imt-hisobot",
    urinishTartibi: 1,
    kechikkan: false,
    sarflanganVaqt: 120,
    holat: "yashirin",
    rawScore: 20,
    jamiSavollar: 20,
    shkalaBalli: 99,
    daraja: "A+",
    yakunlanganVaqt: new Date(),
    user: { id: "sa-legacy", role: "superadmin", fullName: "Legacy Superadmin", username: "superadmin" },
    javoblar: NAMUNA_SAVOLLAR.map((s) => ({
      savolKalit: `${SLUG}#${s.id}`,
      savolId: s.id,
      berilganJavob: String(s.correct),
      togri: true,
      javobBerildi: true,
    })),
  })

  const boshHisob = kohortKalibrlaVaHisobla(NAMUNA_SAVOLLAR, [], { slug: SLUG })
  assert.equal(boshHisob.kalibrlashStats.jamiUrinish, 0)
  assert.equal(boshHisob.yangilanganUrinishlar.length, 0)

  const hisob = kohortKalibrlaVaHisobla(NAMUNA_SAVOLLAR, db.baza.urinishlar, { slug: SLUG })
  assert.equal(hisob.yangilanganUrinishlar.length, 6)
  assert.equal(hisob.kalibrlashStats.jamiUrinish, 6)
  assert.equal(
    hisob.yangilanganUrinishlar.some((u) => u.userId === "sa-legacy"),
    false
  )

  // Boy admin hisobot maydonlari to'liq va izchil ekanini tekshirish
  const darajaYigindi = hisob.kalibrlashStats.darajaTaqsimoti.reduce((s, d) => s + d.soni, 0)
  const oddiyYigindi = hisob.kalibrlashStats.oddiyTaqsimot.reduce((s, d) => s + d.soni, 0)
  assert.equal(darajaYigindi, 6)
  assert.equal(oddiyYigindi, 6)
  assert.equal(hisob.kalibrlashStats.sohalarHisoboti.length, 2)
  assert.equal(hisob.kalibrlashStats.turlarHisoboti.length, 2)
  assert.equal(typeof hisob.kalibrlashStats.raschSifatXulosasi.medianaRasch, "number")
  assert.equal(typeof hisob.kalibrlashStats.taqqoslashXulosasi.ortachaFarq, "number")

  // Katalog ishtirokchilar sonida ham superadmin hisoblanmasligi kerak (6 ta)
  const katalog = await katalogJadvalBilan(db, {
    userId: "talaba-1",
  })
  assert.equal(katalog.find((k) => k.slug === SLUG)?.jadval?.qatnashchilarSoni, 6)

  // E'londa superadminga sertifikat/QuizResult yaratilmaydi, real talabalarga percentile saqlanadi
  await kalibrlaVaElonQil({
    db,
    imtihon: db.baza.imtihon,
    aslSavollar: NAMUNA_SAVOLLAR,
    hozir: new Date(tugash + 30_000),
  })
  assert.equal(db.baza.natijalar.length, 6)
  assert.equal(
    db.baza.sertifikatlar.some((c) => c.userId === "sa-legacy"),
    false
  )
  assert.equal(
    db.baza.sertifikatlar.every((c) => typeof c.percentile === "number"),
    true
  )
})

test("Erkin mashq rejimida ham profil kirish majburiyati ishlaydi (mehmonga 401)", async () => {
  const db = toliqSoxtaBaza({
    imtihon: {
      id: "imt-erkin",
      slug: SLUG,
      sarlavha: "Erkin Mashq MS",
      rejim: "erkin",
      faol: true,
      isAnnounced: false,
    },
  })

  const mehmon = await yakunlaSinov({
    db,
    sessiya: { sid: "erkin-1", slug: SLUG, uid: null, bosh: 1000, tugash: 3_601_000 },
    javoblar: togriJavoblarSessiya("erkin-1"),
    userId: null,
    toliqIsm: "Mehmon",
    sir: SIR,
    hozir: 500_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(mehmon.status, 401)
  assert.equal(mehmon.body.loginKerak, true)

  const begona = await yakunlaSinov({
    db,
    sessiya: { sid: "erkin-2", slug: SLUG, uid: "boshqa-odam", bosh: 1000, tugash: 3_601_000 },
    javoblar: {},
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: 500_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(begona.status, 401)
  assert.equal(begona.body.loginKerak, true)
  assert.equal(db.baza.urinishlar.length, 0)
  assert.equal(db.baza.natijalar.length, 0)
  assert.equal(db.baza.sertifikatlar.length, 0)

  // Profilga kirgan foydalanuvchi esa erkin mashqni muvaffaqiyatli yakunlaydi
  const kirgan = await yakunlaSinov({
    db,
    sessiya: { sid: "erkin-3", slug: SLUG, uid: "u1", bosh: 1000, tugash: 3_601_000 },
    javoblar: togriJavoblarSessiya("erkin-3"),
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: 500_000,
    savollarOl: () => NAMUNA_SAVOLLAR,
  })
  assert.equal(kirgan.status, 200)
  assert.equal(kirgan.body.natija.rawScore, 20)
})
