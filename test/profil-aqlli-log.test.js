// test/profil-aqlli-log.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { BOLIMLAR, DARAJALAR, ODDIY_MAXFIYLIK, korinadimi } from '../lib/maxfiylik.js'
import {
  NOTIFICATION_KEYS,
  ODDIY_BILDIRISHNOMA,
  ODDIY_OQUV_MAQSADLARI,
  bildirishnomaTozala,
  oquvMaqsadTozala,
} from '../lib/profil-tekshiruv.js'
import {
  birlashtirProfilLoglar,
  ipNiMaskala,
  msUrinishdanLog,
  ozgarganMaydonlarXulosasi,
  profilLogCsvYasa,
  qurilmaniAniqlash,
  sertifikatdanLog,
} from '../lib/profil-log-yordamchi.js'
import { jadvalYoqmiXatosi, profilLogYoz, sorovMetaAjrat } from '../lib/profil-log.js'
import {
  kunlikMaqsadHolati,
  msUrinishlarXulosasi,
  muddatiYaqinSertifikatlar,
  qurAqlliProfilXulosa,
} from '../lib/profil-aqlli.js'

test('maxfiylik emojisiz ikon kalitlari va msNatijalar bolimi bilan tuzilgan', () => {
  assert.equal(DARAJALAR.every((d) => Boolean(d.ikon) && !d.icon), true)
  assert.equal(BOLIMLAR.every((b) => Boolean(b.ikon) && !b.icon), true)
  assert.equal(ODDIY_MAXFIYLIK.msNatijalar, 'dostlar')
  assert.equal(korinadimi(ODDIY_MAXFIYLIK, 'msNatijalar', { ozimniki: false, dost: false }), false)
  assert.equal(korinadimi(ODDIY_MAXFIYLIK, 'msNatijalar', { ozimniki: false, dost: true }), true)
})

test('bildirishnomaTozala va oquvMaqsadTozala xavfsiz standart qiymatlarni qaytaradi', () => {
  const n = bildirishnomaTozala({ email_quiz_result: false, admin: true })
  assert.equal(Object.keys(n).length, NOTIFICATION_KEYS.length)
  assert.equal(n.email_quiz_result, false)
  assert.equal(n.email_new_assignment, ODDIY_BILDIRISHNOMA.email_new_assignment)
  assert.equal('admin' in n, false)

  const o = oquvMaqsadTozala({ dailyGoalMinutes: 1000, dailyGoalQuestions: 1, language: 'uz' })
  assert.deepEqual(o, {
    ...ODDIY_OQUV_MAQSADLARI,
    dailyGoalMinutes: 720,
    dailyGoalQuestions: 5,
    language: 'uz',
  })
})

test('profil-log yordamchilari qurilma, IP, diff va CSV himoyasini togri bajaradi', () => {
  assert.equal(
    qurilmaniAniqlash('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0'),
    'Chrome · Windows',
  )
  assert.equal(qurilmaniAniqlash('okhttp/4.12 jda-kimyo-mobile android'), 'Mobil ilova · Android')
  assert.equal(ipNiMaskala('::ffff:192.168.1.44'), '192.168.1.*')

  const diff = ozgarganMaydonlarXulosasi(
    { university: 'TDTU', learningPreferences: { dailyGoalQuestions: 20, dailyGoalMinutes: 30 } },
    { university: 'O‘zMU', learningPreferences: { dailyGoalQuestions: 20, dailyGoalMinutes: 30 } },
  )
  assert.equal(diff.toifa, 'profil')
  assert.deepEqual(diff.maydonlar, ['university'])

  const yashirinLog = msUrinishdanLog(
    { id: 'u1', slug: 'milliy-sertifikat-simulyator', holat: 'topshirildi', shkalaBalli: 78.5, daraja: 'A+' },
    { imtihonNom: 'MS #1' },
  )
  assert.equal(yashirinLog.holat, 'ogohlantirish')
  assert.equal(yashirinLog.tafsilot.includes('78.5'), false)
  assert.equal(yashirinLog.tafsilot.includes('A+'), false)

  const certLog = sertifikatdanLog({
    id: 'c1',
    certId: 'JDA-MS-2026-0001',
    examName: 'MS #1',
    grade: 'A',
    status: 'valid',
    issuedAt: '2026-11-10T10:00:00Z',
  })
  assert.equal(certLog.toifa, 'sertifikat')
  assert.equal(certLog.tafsilot.includes('JDA-MS-2026-0001'), true)

  const merged = birlashtirProfilLoglar({
    saqlangan: [
      { id: 'p1', toifa: 'natija', amal: 'MS_NATIJA_ELON', sarlavha: 'E’lon', holat: 'muvaffaqiyat', meta: { refId: 'u2' }, createdAt: '2026-11-12T10:00:00Z' },
    ],
    tizim: [
      { id: 'ms-u2', toifa: 'natija', amal: 'MS_NATIJA_ELON', sarlavha: 'Dup', holat: 'muvaffaqiyat', meta: { refId: 'u2' }, createdAt: '2026-11-12T10:00:00Z' },
      yashirinLog,
    ],
  })
  assert.equal(merged.length, 2)

  const csv = profilLogCsvYasa([{ createdAt: '2026-11-12', toifa: 'xavfsizlik', amal: 'A', holat: 'ok', sarlavha: '=cmd()' }])
  assert.ok(csv.includes("'=cmd()"))
})

test('profilLogYoz P2021 xatosida tizimni toxtatmaydi', async () => {
  assert.equal(jadvalYoqmiXatosi({ code: 'P2021' }), true)
  const meta = sorovMetaAjrat({
    headers: { get: (k) => (k === 'x-forwarded-for' ? '1.2.3.4, 5.6.7.8' : 'Chrome/130 Windows') },
  })
  assert.deepEqual(meta, { ipAddress: '1.2.3.4', userAgent: 'Chrome/130 Windows' })

  const res = await profilLogYoz({
    userId: 'u1',
    toifa: 'xavfsizlik',
    amal: 'TEST',
    sarlavha: 'Test log',
    db: {
      profilLog: {
        create: async () => {
          const e = new Error('Table does not exist')
          e.code = 'P2021'
          throw e
        },
      },
    },
  })
  assert.equal(res, null)
})

test('aqlli profil dvigateli kunlik maqsad, MS yashirin xavfsizligi va tavsiyalarni hisoblaydi', () => {
  const maqsad = kunlikMaqsadHolati({
    bugungiSavollar: 10,
    bugungiDaqiqalar: 15,
    learningPreferences: { dailyGoalQuestions: 20, dailyGoalMinutes: 30 },
  })
  assert.equal(maqsad.savolFoiz, 50)
  assert.equal(maqsad.bajarildimi, false)

  const ms = msUrinishlarXulosasi([
    { id: '1', slug: 's1', holat: 'topshirildi', shkalaBalli: 99, daraja: 'A+', boshlanganVaqt: '2026-11-13' },
    { id: '2', slug: 's2', holat: 'elon_qilindi', shkalaBalli: 68.4, daraja: 'B+', theta: 0.9, yakunlanganVaqt: '2026-11-12' },
    { id: '3', slug: 's3', holat: 'elon_qilindi', shkalaBalli: 60.0, daraja: 'B', theta: 0.4, yakunlanganVaqt: '2026-11-01' },
  ])
  assert.equal(ms.kutilayotganSoni, 1)
  assert.equal(ms.elonQilinganSoni, 2)
  assert.equal(ms.engYaxshi.daraja, 'B+')
  assert.equal(ms.osish, 8.4)

  const yaqin = muddatiYaqinSertifikatlar(
    [
      { id: 'c1', status: 'valid', expiresAt: '2026-11-25T00:00:00Z' },
      { id: 'c2', status: 'revoked', expiresAt: '2026-11-25T00:00:00Z' },
    ],
    new Date('2026-11-14T00:00:00Z'),
    45,
  )
  assert.equal(yaqin.length, 1)

  const xulosa = qurAqlliProfilXulosa({
    user: { email: 'a@b.uz', emailVerified: null, learningPreferences: { dailyGoalQuestions: 20 } },
    bugungiFaollik: { quizzesTaken: 5, studyMinutes: 5 },
    msUrinishlar: [{ id: '1', slug: 's1', holat: 'topshirildi', shkalaBalli: 99, daraja: 'A+' }],
    topshiriqSanoq: 2,
    telegramUlangan: false,
    xavfsizlikOgohlantirishSoni: 1,
  })
  assert.equal(xulosa.tavsiyalar.length, 4)
  assert.equal(xulosa.tavsiyalar[0].id, 'xavfsizlik-ogoh')
})
