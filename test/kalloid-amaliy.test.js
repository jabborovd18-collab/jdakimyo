import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import katex from 'katex'
import 'katex/contrib/mhchem'

process.env.AUTH_SECRET ||= 'test-kalloid-amaliy-maxfiy-kalit-32bayt'

import { KALLOID_MODULLAR, KALLOID_SAVOLLAR } from '../data/oyinlar/kalloid-kimyo-amaliy.js'
import { KK_DUEL_MODULLAR, KK_DUEL_SAVOLLAR } from '../data/oyinlar/kk-savollar-duel.js'
import { latexliMatnniBol } from '../lib/latex-oddiy-matn.js'
import {
  KALLOID_SAVOL_SONI,
  KALLOID_STANDART_TALABALAR,
  KALLOID_VAQT_LIMIT_SONIYA,
  kirishKodiniTekshir,
  qolganSoniyaHisobla,
  statTokenTekshir,
  statTokenYarat,
  statistikaRoyxatiniTuz,
  talabaSavollariniTayyorla,
  talabalarRoyxatiniAjrat,
  tasodifiySavolTanla,
  urinishniBahola,
  ustozRuxsatiniTekshir,
} from '../lib/oyinlar/kalloid-amaliy-server.js'

function katexTekshir(matn, yorliq) {
  assert.equal(typeof matn, 'string', `${yorliq} matn bo‘lishi kerak`)
  assert.ok(matn.trim().length > 0, `${yorliq} bo‘sh bo‘lmasligi kerak`)
  assert.equal(/[\f\t\r]/.test(matn), false, `${yorliq} ichida buzilgan nazorat belgisi bor`)

  // Juft dollar ($) belgisi ochilib yopilmagan holatni ushlash
  const tekisDollar = matn.replace(/\$\$/g, '')
  const dollarSoni = (tekisDollar.match(/\$/g) || []).length
  assert.equal(dollarSoni % 2, 0, `${yorliq} ichida yopilmagan $ belgisi bor: ${matn}`)

  const bolaklar = latexliMatnniBol(matn)
  for (const bolak of bolaklar) {
    if (bolak.turi !== 'formula') continue
    assert.doesNotThrow(() => {
      katex.renderToString(bolak.matn, {
        displayMode: Boolean(bolak.blok),
        throwOnError: true,
        output: 'html',
        trust: false,
      })
    }, `${yorliq} KaTeX xatosi: ${bolak.matn}`)
  }
}

describe('Kalloid Kimyo amaliy — 40 ta savol va KaTeX sifati', () => {
  test('40 ta noyob savol, 5 modul (har biri 8 tadan) va 4 tadan A/B/C/D variant mavjud', () => {
    assert.equal(KALLOID_SAVOLLAR.length, 40)

    const idSet = new Set()
    const modulSanoq = { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 }

    for (const savol of KALLOID_SAVOLLAR) {
      assert.ok(savol.id && !idSet.has(savol.id), `Takroriy id: ${savol.id}`)
      idSet.add(savol.id)

      assert.ok(savol.modul in KALLOID_MODULLAR, `Noma’lum modul: ${savol.modul}`)
      modulSanoq[savol.modul] += 1

      assert.equal(Array.isArray(savol.variantlar), true)
      assert.equal(savol.variantlar.length, 4, `${savol.id} da 4 ta variant bo‘lishi kerak`)
      assert.equal(new Set(savol.variantlar).size, 4, `${savol.id} variantlari takrorlanmasligi kerak`)
      assert.ok(
        Number.isInteger(savol.togriIndeks) && savol.togriIndeks >= 0 && savol.togriIndeks <= 3,
        `${savol.id} togriIndeks noto‘g‘ri`,
      )
    }

    assert.deepEqual(modulSanoq, { M1: 8, M2: 8, M3: 8, M4: 8, M5: 8 })
  })

  test('barcha 40 savol va 160 variant KaTeX throwOnError=true da xatosiz renderlanadi', () => {
    for (const savol of KALLOID_SAVOLLAR) {
      katexTekshir(savol.matn, `${savol.id} savoli`)
      savol.variantlar.forEach((v, idx) => {
        katexTekshir(v, `${savol.id} variant-${idx}`)
      })
    }
  })

  test('KK_savollar 1v1 duel bazasida 50 ta savol (5 modul × 10 tadan) va 200 variant KaTeX xatosiz', () => {
    assert.equal(KK_DUEL_SAVOLLAR.length, 50)
    const modulSanoq = { KK_M1: 0, KK_M2: 0, KK_M3: 0, KK_M4: 0, KK_M5: 0 }
    const idSet = new Set()

    for (const savol of KK_DUEL_SAVOLLAR) {
      assert.ok(savol.id && !idSet.has(savol.id), `Takroriy duel id: ${savol.id}`)
      idSet.add(savol.id)
      assert.ok(savol.modul in KK_DUEL_MODULLAR, `Noma’lum duel modul: ${savol.modul}`)
      modulSanoq[savol.modul] += 1
      assert.equal(savol.variantlar.length, 4)
      assert.equal(new Set(savol.variantlar).size, 4)
      assert.equal(savol.togriIndeks, 0)
      katexTekshir(savol.matn, `${savol.id} duel savoli`)
      savol.variantlar.forEach((v, idx) => {
        katexTekshir(v, `${savol.id} duel variant-${idx}`)
      })
    }

    assert.deepEqual(modulSanoq, { KK_M1: 10, KK_M2: 10, KK_M3: 10, KK_M4: 10, KK_M5: 10 })
  })
})

describe('Kalloid Kimyo amaliy — test tanlash, baholash va vaqt chegarasi', () => {
  test('40 savoldan 20 ta takrorlanmas tasodifiy savol va 4 variant permuatsiyasini yaratadi', () => {
    const { savolIndekslari, variantTartibi } = tasodifiySavolTanla()
    assert.equal(savolIndekslari.length, KALLOID_SAVOL_SONI)
    assert.equal(new Set(savolIndekslari).size, 20)
    for (const idx of savolIndekslari) {
      assert.ok(idx >= 0 && idx < 40)
    }
    assert.equal(variantTartibi.length, 20)
    for (const tartib of variantTartibi) {
      assert.deepEqual([...tartib].sort((a, b) => a - b), [0, 1, 2, 3])
    }

    const talabaga = talabaSavollariniTayyorla(savolIndekslari, variantTartibi)
    assert.equal(talabaga.length, 20)
    for (const item of talabaga) {
      assert.equal('togriIndeks' in item, false)
      assert.equal(item.variantlar.length, 4)
    }
  })

  test('aralashtirilgan variantlar bo‘yicha aniq foiz va sarflangan soniyani hisoblaydi', () => {
    const { savolIndekslari, variantTartibi } = tasodifiySavolTanla(20, 40)
    const togriJavoblar = savolIndekslari.map((qIdx, i) => {
      const aslTogri = KALLOID_SAVOLLAR[qIdx].togriIndeks
      return variantTartibi[i].indexOf(aslTogri)
    })

    const bosh = new Date('2026-11-17T10:00:00.000Z')
    const tug = new Date('2026-11-17T10:04:15.000Z') // 255 s

    const toliq = urinishniBahola({
      savolIndekslari,
      variantTartibi,
      javoblar: togriJavoblar,
      boshlanganVaqt: bosh,
      hozir: tug,
    })
    assert.equal(toliq.foiz, 100)
    assert.equal(toliq.sarflanganSoniya, 255)

    // Yarmini noto'g'ri yoki bo'sh yuborish (10/20 = 50%), hamda 600 s limitdan oshganda kesilishi
    const yarmi = togriJavoblar.map((v, i) => (i < 10 ? v : -1))
    const kech = new Date('2026-11-17T10:15:00.000Z') // 900 s > 600 s
    const yarimNatija = urinishniBahola({
      savolIndekslari,
      variantTartibi,
      javoblar: yarmi,
      boshlanganVaqt: bosh,
      hozir: kech,
      vaqtLimitSoniya: KALLOID_VAQT_LIMIT_SONIYA,
    })
    assert.equal(yarimNatija.foiz, 50)
    assert.equal(yarimNatija.sarflanganSoniya, 600)
  })

  test('qolganSoniyaHisobla server soatiga ko‘ra aniq kamayadi va 0 da to‘xtaydi', () => {
    const bosh = new Date('2026-11-17T10:00:00.000Z')
    assert.equal(qolganSoniyaHisobla(bosh, 600, new Date('2026-11-17T10:03:00.000Z')), 420)
    assert.equal(qolganSoniyaHisobla(bosh, 600, new Date('2026-11-17T10:12:00.000Z')), 0)
  })
})

describe('Kalloid Kimyo amaliy — kirish kodi, ustoz ruxsati va jonli statistika maxfiyligi', () => {
  test('kirish kodi va stat tokeni boshqa foydalanuvchi yoki o‘zgargan kodda rad etiladi', () => {
    assert.equal(kirishKodiniTekshir(' kalloid-2026 ', 'KALLOID-2026'), true)
    assert.equal(kirishKodiniTekshir('XATO', 'KALLOID-2026'), false)

    const dars = { id: 'dars-1', kirishKodi: 'KALLOID-2026' }
    const token = statTokenYarat('ustoz-1', dars)
    assert.equal(statTokenTekshir(token, 'ustoz-1', dars), true)
    assert.equal(statTokenTekshir(token, 'boshqa-user', dars), false)
    assert.equal(statTokenTekshir(token, 'ustoz-1', { id: 'dars-1', kirishKodi: 'YANGI-KOD' }), false)
  })

  test('statistikaRoyxatiniTuz boshlaganlar sonini beradi, lekin hali yakunlamagan ismlarni yashiradi', () => {
    const ishtirokchilar = [
      { id: '1', ism: 'Kutayotgan Talaba', holat: 'kutmoqda' },
      { id: '2', ism: 'Yechayotgan Sirli', holat: 'boshlandi' },
      { id: '3', ism: 'Shoxjahon', holat: 'yakunlandi', foiz: 85, sarflanganSoniya: 310, yakunlanganVaqt: new Date('2026-11-17T10:05:10Z') },
      { id: '4', ism: 'Madina', holat: 'yakunlandi', foiz: 95, sarflanganSoniya: 280, yakunlanganVaqt: new Date('2026-11-17T10:04:40Z') },
      { id: '5', ism: 'Azizbek', holat: 'yakunlandi', foiz: 85, sarflanganSoniya: 240, yakunlanganVaqt: new Date('2026-11-17T10:04:00Z') },
    ]

    const stat = statistikaRoyxatiniTuz({ nom: 'Kalloid Kimyo amaliy' }, ishtirokchilar)
    assert.equal(stat.boshlaganSoni, 4) // 1 boshlandi + 3 yakunlandi
    assert.equal(stat.hozirYechmoqdaSoni, 1)
    assert.equal(stat.yakunlaganSoni, 3)
    assert.equal(stat.kutayotganSoni, 1)
    assert.deepEqual(
      stat.natijalar.map((x) => [x.ism, x.foiz, x.sarflanganSoniya]),
      [
        ['Madina', 95, 280],
        ['Azizbek', 85, 240],
        ['Shoxjahon', 85, 310],
      ],
    )

    const json = JSON.stringify(stat)
    assert.equal(json.includes('Kutayotgan Talaba'), false)
    assert.equal(json.includes('Yechayotgan Sirli'), false)
  })

  test('ustozRuxsatiniTekshir mehmon, talaba va doska sessiyasini rad etadi, ustozni kiritadi', async () => {
    const mockPrisma = (dbUser) => ({
      user: {
        findUnique: async () => dbUser,
      },
    })

    const mehmon = await ustozRuxsatiniTekshir(null, mockPrisma(null))
    assert.equal(mehmon.ok, false)
    assert.equal(mehmon.status, 401)

    const talaba = await ustozRuxsatiniTekshir(
      { user: { id: 'u1', role: 'student', isTeacher: false } },
      mockPrisma({ id: 'u1', role: 'student', isTeacher: false }),
    )
    assert.equal(talaba.ok, false)
    assert.equal(talaba.status, 403)

    const doska = await ustozRuxsatiniTekshir(
      { user: { id: 'u2', role: 'teacher', isTeacher: true, doskaTugaydi: Date.now() + 10000 } },
      mockPrisma({ id: 'u2', role: 'teacher', isTeacher: true }),
    )
    assert.equal(doska.ok, false)
    assert.equal(doska.status, 403)

    const ustoz = await ustozRuxsatiniTekshir(
      { user: { id: 'u3', role: 'teacher', isTeacher: true } },
      mockPrisma({ id: 'u3', role: 'teacher', isTeacher: true }),
    )
    assert.equal(ustoz.ok, true)
  })

  test('talabalarRoyxatiniAjrat raqamlash, bo‘sh qator va dublikatlarni tozalaydi', () => {
    const ismlar = talabalarRoyxatiniAjrat('1. Shoxjahon\n\n2) Madina\nshoxjahon\n  3. Azizbek  ')
    assert.deepEqual(ismlar, ['Shoxjahon', 'Madina', 'Azizbek'])
  })

  test('28 nafar standart talaba faqat familiya-ism va noyob qrToken bilan saqlangan', () => {
    assert.equal(KALLOID_STANDART_TALABALAR.length, 28)
    const ismlar = new Set(KALLOID_STANDART_TALABALAR.map((t) => t.ism))
    const tokenlar = new Set(KALLOID_STANDART_TALABALAR.map((t) => t.qrToken))
    assert.equal(ismlar.size, 28)
    assert.equal(tokenlar.size, 28)
    assert.equal(ismlar.has('Jabborov Diyorbek'), false)
    for (const t of KALLOID_STANDART_TALABALAR) {
      assert.equal(t.ism.split(' ').length, 2, `${t.ism} faqat familiya va ismdan iborat bo‘lishi kerak`)
    }
  })
})
