// test/profil-tizimi.test.js
//
// Tezkor profil keshi (`lib/profil-kesh.js`) uchun birlik testlar.

import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  sessiondanZahiraProfil,
  keshdanProfilniOl,
  profilKeshniSaqla,
  profilKeshUserYangila,
  profilKeshniTozala,
  profilKeshgaObuna,
} from '../lib/profil-kesh.js'
import {
  tegniTekshir,
  matndanTegniTop,
  postlarniTartibla,
  tavsiyalarniSarala,
} from '../lib/post-tavsiyalar.js'
import {
  hikoyaTuriniTekshir,
  hikoyaUslubiniTekshir,
  hikoyalarniGuruhla,
} from '../lib/hikoya-turlari.js'

describe('Tezkor profil keshi (lib/profil-kesh.js)', () => {
  beforeEach(() => {
    profilKeshniTozala()
  })

  test("sessiondanZahiraProfil: session.user dan to'liq boshlang'ich obyektni yaratadi", () => {
    const zaxira = sessiondanZahiraProfil({
      id: 'cuid_123',
      userId: '88776655',
      username: 'kimyogar',
      fullName: 'Ali Valiyev',
      role: 'student',
      isVerified: true,
    })

    assert.ok(zaxira)
    assert.equal(zaxira._zahiradan, true)
    assert.equal(zaxira.user.id, 'cuid_123')
    assert.equal(zaxira.user.userId, '88776655')
    assert.equal(zaxira.user.username, 'kimyogar')
    assert.equal(zaxira.user.fullName, 'Ali Valiyev')
    assert.equal(zaxira.user.isVerified, true)
    assert.deepEqual(zaxira.quizResults, [])
    assert.equal(zaxira.counts.followers, 0)
  })

  test("profilKeshniSaqla va keshdanProfilniOl: saqlangan profilni qaytaradi va boshqa hisobga aralashtirmaydi", () => {
    const namuna = {
      user: {
        id: 'u_1',
        userId: '10002000',
        username: 'rustam',
        fullName: 'Rustam Karimov',
        bio: 'Organik kimyo',
        stars: 45,
      },
      quizResults: [{ id: 'q1', score: 90 }],
      counts: { followers: 5, following: 3, articles: 1, discussions: 0, forumReplies: 2, certificates: 1 },
    }

    profilKeshniSaqla(namuna)

    const olingan = keshdanProfilniOl({ id: 'u_1', userId: '10002000' })
    assert.ok(olingan)
    assert.equal(olingan.user.username, 'rustam')
    assert.equal(olingan.user.stars, 45)
    assert.equal(olingan.counts.followers, 5)

    // Boshqa foydalanuvchi kirganda eski kesh berilmasligi, uning o'z zaxirasi qaytishi shart
    const boshqa = keshdanProfilniOl({ id: 'u_2', userId: '99998888', username: 'boshqa' })
    assert.ok(boshqa)
    assert.equal(boshqa.user.username, 'boshqa')
    assert.equal(boshqa._zahiradan, true)
  })

  test("profilKeshUserYangila: keshdagi user maydonlarini darhol yangilaydi va obunachilarni xabardor qiladi", () => {
    profilKeshniSaqla({
      user: {
        id: 'u_1',
        userId: '10002000',
        username: 'rustam',
        bio: 'Eski bio',
      },
      quizResults: [],
      counts: {},
    })

    let xabarKeldi = null
    const obunaniBekorQil = profilKeshgaObuna((yangi) => {
      xabarKeldi = yangi
    })

    profilKeshUserYangila({ bio: 'Yangi tezkor bio', location: 'Toshkent' })
    obunaniBekorQil()

    const yangilangan = keshdanProfilniOl()
    assert.equal(yangilangan.user.bio, 'Yangi tezkor bio')
    assert.equal(yangilangan.user.location, 'Toshkent')
    assert.ok(xabarKeldi)
    assert.equal(xabarKeldi.user.bio, 'Yangi tezkor bio')
  })
})

describe('Postlarni tartiblash va rekomendatsiya algoritmi (lib/post-tavsiyalar.js)', () => {
  test("tegniTekshir va matndanTegniTop: teglarni to'g'ri ajratadi", () => {
    assert.equal(tegniTekshir('#Olimpiada'), 'olimpiada')
    assert.equal(tegniTekshir('masala'), 'masala')
    assert.equal(tegniTekshir('noma_lum_teg'), null)
    assert.equal(matndanTegniTop('Bugun #konspekt yozdim'), 'konspekt')
    assert.equal(matndanTegniTop('Oddiy matn'), null)
  })

  test("postlarniTartibla: standart (qadalgan + yangi), foydali va teg filtri bo'yicha saralaydi", () => {
    const postlar = [
      { id: '1', matn: 'Eski oddiy post', teg: 'masala', isPinned: false, likesCount: 2, createdAt: '2026-11-10T10:00:00Z' },
      { id: '2', matn: 'Yangi oddiy post', teg: 'konspekt', isPinned: false, likesCount: 8, createdAt: '2026-11-14T10:00:00Z' },
      { id: '3', matn: 'Qadalgan muhim post', teg: 'masala', isPinned: true, pinnedAt: '2026-11-12T10:00:00Z', likesCount: 1, createdAt: '2026-11-08T10:00:00Z' },
    ]

    const standart = postlarniTartibla(postlar, { tartib: 'standart' })
    assert.deepEqual(standart.map((p) => p.id), ['3', '2', '1'])

    const foydali = postlarniTartibla(postlar, { tartib: 'foydali' })
    assert.deepEqual(foydali.map((p) => p.id), ['2', '1', '3'])

    const faqatMasala = postlarniTartibla(postlar, { tartib: 'standart', teg: 'masala' })
    assert.deepEqual(faqatMasala.map((p) => p.id), ['3', '1'])
  })

  test("tavsiyalarniSarala: ustoz/OTM mosligiga yuqori ball beradi va bitta muallifdan ko'pi bilan 2 ta post qoldiradi", () => {
    const hozir = new Date('2026-11-14T12:00:00Z').getTime()
    const koruvchi = { university: "O'zMU", specialty: 'Organik kimyo', role: 'bakalavr' }

    const postlar = [
      {
        id: 'p_oddiy_1',
        matn: 'Qisqa post 1',
        likesCount: 0,
        createdAt: '2026-11-14T11:00:00Z',
        muallif: { id: 'u_spam', username: 'talaba1', university: 'TATU' },
      },
      {
        id: 'p_oddiy_2',
        matn: 'Qisqa post 2',
        likesCount: 0,
        createdAt: '2026-11-14T11:05:00Z',
        muallif: { id: 'u_spam', username: 'talaba1', university: 'TATU' },
      },
      {
        id: 'p_oddiy_3',
        matn: 'Qisqa post 3 (limitdan oshgan)',
        likesCount: 0,
        createdAt: '2026-11-14T11:10:00Z',
        muallif: { id: 'u_spam', username: 'talaba1', university: 'TATU' },
      },
      {
        id: 'p_ustoz',
        matn: "SN1 va SN2 reaksiyalar mexanizmi bo'yicha to'liq konspekt va misollar",
        teg: 'konspekt',
        likesCount: 6,
        createdAt: '2026-11-14T10:30:00Z',
        muallif: { id: 'u_ustoz', username: 'prof_karimov', isTeacher: true, isVerified: true, university: "O'zMU" },
      },
    ]

    const natija = tavsiyalarniSarala(postlar, koruvchi, { hozir })
    assert.equal(natija[0].id, 'p_ustoz')
    assert.ok(natija[0].tavsiyaSababi)
    // u_spam muallifidan 3 ta postdan faqat 2 tasi qolishi shart
    const spamSoni = natija.filter((p) => p.muallif.id === 'u_spam').length
    assert.equal(spamSoni, 2)
  })
})

describe('24 soatlik Ilmiy Hikoyalar (lib/hikoya-turlari.js)', () => {
  test("hikoyaTuriniTekshir va hikoyaUslubiniTekshir: noto'g'ri qiymatlarni standartga qaytaradi", () => {
    assert.equal(hikoyaTuriniTekshir('formula'), 'formula')
    assert.equal(hikoyaTuriniTekshir('repost'), 'repost')
    assert.equal(hikoyaTuriniTekshir('xato_tur'), 'dolzarb')
    assert.equal(hikoyaUslubiniTekshir('zumrad'), 'zumrad')
    assert.equal(hikoyaUslubiniTekshir('xato_uslub'), 'kosmik')
  })

  test("hikoyalarniGuruhla: o'z hikoyasini 1-o'ringa, yangi (ko'rilmagan) hikoyalarni esa ko'rilganlardan oldinga qo'yadi", () => {
    const hikoyalar = [
      {
        id: 'h_korilgan',
        userId: 'u_korilgan',
        turi: 'dolzarb',
        matn: 'Korilgan hikoya',
        korildimi: true,
        createdAt: '2026-11-14T10:00:00Z',
        muallif: { id: 'u_korilgan', username: 'aziz' },
      },
      {
        id: 'h_yangi',
        userId: 'u_yangi',
        turi: 'formula',
        matn: 'Yangi korilmagan hikoya',
        korildimi: false,
        createdAt: '2026-11-14T09:00:00Z',
        muallif: { id: 'u_yangi', username: 'ustoz_nodir', isTeacher: true },
      },
      {
        id: 'h_ozim_1',
        userId: 'u_men',
        turi: 'maqsad',
        matn: 'Mening 1-hikoyam',
        korildimi: true,
        createdAt: '2026-11-14T08:00:00Z',
        muallif: { id: 'u_men', username: 'men' },
      },
      {
        id: 'h_ozim_2',
        userId: 'u_men',
        turi: 'repost',
        matn: 'Mening 2-hikoyam',
        korildimi: true,
        createdAt: '2026-11-14T11:00:00Z',
        muallif: { id: 'u_men', username: 'men' },
      },
    ]

    const guruhlar = hikoyalarniGuruhla(hikoyalar, 'u_men')
    assert.equal(guruhlar.length, 3)
    assert.equal(guruhlar[0].muallifId, 'u_men')
    assert.equal(guruhlar[0].ozimniki, true)
    assert.equal(guruhlar[0].hikoyalar.length, 2)
    assert.equal(guruhlar[1].muallifId, 'u_yangi')
    assert.equal(guruhlar[1].yangiSoni, 1)
    assert.equal(guruhlar[2].muallifId, 'u_korilgan')
  })
})


