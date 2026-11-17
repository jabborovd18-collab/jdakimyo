import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import {
  ALL_CONTENT,
  CATEGORIES,
  POPULAR_SEARCHES,
  filtrlaQidiruvNatijalari,
  qidiruvMatnMosmi,
} from '../lib/qidiruv-katalog.js'
import { MAKTAB_SINFLARI } from '../lib/fanlar.js'

function qidiruvSahifaMavjudmi(href) {
  const toza = href.split('?')[0].split('#')[0]
  if (toza === '/') return fs.existsSync(path.join('app', 'page.js'))

  const qismlar = toza.split('/').filter(Boolean)
  const togridan = path.join('app', ...qismlar, 'page.js')
  if (fs.existsSync(togridan)) return true

  // Ochiq maktab sinflari (`/maktabkimyo/7sinf` va `/maktabkimyo/8sinf`) dinamik `[sinf]` sahifasiga tushadi
  if (qismlar.length === 2 && qismlar[0] === 'maktabkimyo') {
    const dinamikSahifa = path.join('app', 'maktabkimyo', '[sinf]', 'page.js')
    const sinfMavjud = MAKTAB_SINFLARI.some((s) => `${s.sinf}sinf` === qismlar[1] && s.ochiq)
    return sinfMavjud && fs.existsSync(dinamikSahifa)
  }

  return false
}

describe('Qidiruv katalogi va sahifa integratsiyasi (v4)', () => {
  test('ALL_CONTENT dagi barcha bo‘limlar haqiqiy app/**/page.js sahifalariga mos keladi', () => {
    const idlar = new Set()
    const yollar = new Set()

    for (const item of ALL_CONTENT) {
      assert.ok(!idlar.has(item.id), `Takrorlangan id topildi: ${item.id}`)
      assert.ok(!yollar.has(item.path), `Takrorlangan path topildi: ${item.path}`)
      idlar.add(item.id)
      yollar.add(item.path)

      assert.ok(
        qidiruvSahifaMavjudmi(item.path),
        `ALL_CONTENT ichidagi yo'l mavjud sahifaga olib bormaydi: ${item.path}`,
      )
      assert.ok(
        CATEGORIES.some((c) => c.id === item.category),
        `Noma'lum kategoriya: ${item.category} (${item.path})`,
      )
    }
  })

  test('barcha muhim ommaviy v4 bo‘limlari katalogga kiritilgan', () => {
    const yollar = new Set(ALL_CONTENT.map((item) => item.path))
    for (const kerakliYol of [
      '/oyinlar',
      '/oyinlar/formulani-top',
      '/oyinlar/element-duel',
      '/oyinlar/formula-konstruktor',
      '/oyinlar/reaksiya-balans',
      '/oyinlar/sifat-detektiv',
      '/testlar/kimyo-0-dan',
      '/repititorlar',
      '/kimyogarlar',
      '/kochat',
      '/sertifikat',
      '/milliy-sertifikat',
      '/maktabkimyo',
      '/masala',
      '/doska',
      '/dolzarb',
    ]) {
      assert.ok(yollar.has(kerakliYol), `Katalogda muhim v4 bo'limi yetishmayapti: ${kerakliYol}`)
    }
  })

  test('POPULAR_SEARCHES dagi barcha so‘rovlar natija qaytaradi', () => {
    for (const sorov of POPULAR_SEARCHES) {
      const natija = filtrlaQidiruvNatijalari({ searchQuery: sorov })
      assert.ok(natija.length > 0, `"${sorov}" ommabop qidiruvi bo'sh natija qaytardi`)
    }
  })

  test('qidiruv normallashtiruvi, tutuq belgilari, kimyoviy formulalar va v4 filtrlari ishlaydi', () => {
    assert.equal(qidiruvMatnMosmi("Kimyoviy o'yinlar", 'oyinlar'), true)
    assert.equal(qidiruvMatnMosmi("Kimyogar ko'chati", 'ko‘chat'), true)
    assert.equal(qidiruvMatnMosmi('H2SO4 masalalar', 'H₂SO₄'), true)

    const oyinNatija = filtrlaQidiruvNatijalari({
      searchQuery: 'formulani top',
      activeCategory: "O'yinlar",
    })
    assert.equal(oyinNatija[0]?.path, '/oyinlar/formulani-top')

    for (const [sorov, kutilganYol] of [
      ['Elementlar dueli', '/oyinlar/element-duel'],
      ['element duel', '/oyinlar/element-duel'],
      ['Formula konstruktori', '/oyinlar/formula-konstruktor'],
      ['formula konstruktor', '/oyinlar/formula-konstruktor'],
      ['Reaksiyani tenglashtir', '/oyinlar/reaksiya-balans'],
      ['reaksiya balans', '/oyinlar/reaksiya-balans'],
      ['Sifat reaksiyalar detektivi', '/oyinlar/sifat-detektiv'],
      ['sifat detektiv', '/oyinlar/sifat-detektiv'],
      ['/oyinlar/sifat-detektiv', '/oyinlar/sifat-detektiv'],
      ["cho'kma", '/oyinlar/sifat-detektiv'],
      ['chokma', '/oyinlar/sifat-detektiv'],
    ]) {
      const topilgan = filtrlaQidiruvNatijalari({ searchQuery: sorov })
      assert.equal(
        topilgan[0]?.path,
        kutilganYol,
        `"${sorov}" qidiruvi birinchi natija sifatida ${kutilganYol} ni qaytarishi kerak (qaytardi: ${topilgan[0]?.path})`,
      )
    }

    const tezKundaNatija = filtrlaQidiruvNatijalari({
      filters: { status: 'tez-kunda', audience: 'oliy', tagQuery: '' },
    })
    assert.ok(tezKundaNatija.some((x) => x.path === '/oliykimyo'))
    assert.ok(tezKundaNatija.every((x) => x.status === 'tez-kunda'))

    const tagNatija = filtrlaQidiruvNatijalari({
      filters: { status: 'all', audience: 'all', tagQuery: 'gps' },
    })
    assert.equal(tagNatija[0]?.path, '/repititorlar')

    const aslTartib = ALL_CONTENT.map((x) => x.id)
    filtrlaQidiruvNatijalari({ searchQuery: 'sertifikat' })
    assert.deepEqual(
      ALL_CONTENT.map((x) => x.id),
      aslTartib,
      'filtrlaQidiruvNatijalari ALL_CONTENT massivini mutatsiya qilmasligi kerak',
    )
  })

  test('app/page.js va app/qidiruv/page.js da router, ?q=, Suspense va statik Tailwind saqlangan', () => {
    const boshSahifa = fs.readFileSync('app/page.js', 'utf8')
    const qidiruvSahifa = fs.readFileSync('app/qidiruv/page.js', 'utf8')

    assert.match(boshSahifa, /useRouter/)
    assert.match(boshSahifa, /router\.push\(`\/qidiruv\?q=/)
    assert.doesNotMatch(boshSahifa, /window\.location\.href/)

    for (const oyinNom of [
      'Formulani top',
      'Elementlar dueli',
      'Formula konstruktori',
      'Reaksiyani tenglashtir',
      'Sifat detektivi',
    ]) {
      assert.ok(
        boshSahifa.includes(oyinNom),
        `app/page.js o'yinlar kartasida ${oyinNom} ko'rsatilmagan`,
      )
    }

    assert.match(qidiruvSahifa, /useSearchParams/)
    assert.match(qidiruvSahifa, /<Suspense\b/)
    assert.doesNotMatch(qidiruvSahifa, /(?:bg|border|shadow|text)-\$\{/)

    for (const eskiMatn of [
      'Metall ioni',
      'Koordinatsion son',
      'coordinationNumber',
      'advancedFilters.metal',
      'advancedFilters.ligand',
      'advancedFilters.geometry',
      'Koordinatsion kimyo tahlil portali',
    ]) {
      assert.ok(
        !qidiruvSahifa.includes(eskiMatn),
        `app/qidiruv/page.js da eskirgan v3 qoldig'i topildi: ${eskiMatn}`,
      )
    }
  })
})
