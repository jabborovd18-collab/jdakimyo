import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import robots from '../app/robots.js'
import {
  FANLAR,
  MAKTAB_SINFLARI,
  SAKKIZ_SINF_MAVZULARI,
  YETTI_SINF_MAVZULARI,
  mavzuHavolasi,
  mavzuTayyormi,
  sinfHavolasi,
} from '../lib/fanlar.js'
import {
  ASOSIY_SAHIFALAR,
  SAYT_DOMEN,
  robotsTaqiqlaganmi,
  sitemapYozuvlariniTuz,
  yolniNormallashtir,
} from '../lib/sitemap-qoidalari.js'

const ROOT = path.resolve('.')
const sitemapRoyxat = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'lib', 'sitemap-royxat.json'), 'utf8'),
)
const disallowQoidalari = (robots().rules || []).flatMap((r) => r.disallow || [])

describe('SEO, robots.txt va sitemap.xml tuzilmasi (v4)', () => {
  test("lib/sitemap-royxat.json va yakuniy sitemap da dublikat hamda robots.js taqiqlagan URL lar yo'q", () => {
    const jsonYollar = sitemapRoyxat.map((x) => yolniNormallashtir(x.yol))
    assert.equal(
      new Set(jsonYollar).size,
      jsonYollar.length,
      'lib/sitemap-royxat.json ichida takrorlangan yo‘llar bor',
    )

    for (const yol of jsonYollar) {
      assert.equal(
        robotsTaqiqlaganmi(yol, disallowQoidalari),
        false,
        `robots.js taqiqlagan yo'l sitemap-royxat.json ga kirib qolgan: ${yol || '/'}`,
      )
      assert.notEqual(yol, '/kochat', '/kochat auth talab qilgani uchun sitemapda bo‘lmasligi kerak')
    }

    for (const item of ASOSIY_SAHIFALAR) {
      assert.equal(
        robotsTaqiqlaganmi(item.yol, disallowQoidalari),
        false,
        `ASOSIY_SAHIFALAR ichida taqiqlangan yo'l bor: ${item.yol}`,
      )
      assert.notEqual(item.yol, '/kochat')
    }

    const yakuniy = sitemapYozuvlariniTuz({
      mavzular: sitemapRoyxat,
      kanallar: [{ slug: 'tushunarli-kimyo', updatedAt: new Date('2026-11-17T00:00:00Z') }],
      disallowQoidalari,
      hozir: new Date('2026-11-17T00:00:00Z'),
    })

    const urlSet = new Set(yakuniy.map((e) => e.url))
    assert.equal(urlSet.size, yakuniy.length, 'Yakuniy sitemap da takrorlangan URL bor')
    assert.ok(urlSet.has(SAYT_DOMEN), 'Bosh sahifa URL sitemapda bo‘lishi kerak')
    assert.ok(!urlSet.has(`${SAYT_DOMEN}/`), 'Bosh sahifa trailing slash bilan dublikat bo‘lmasin')
    assert.ok(urlSet.has(`${SAYT_DOMEN}/qidiruv`), '/qidiruv sitemapda bo‘lishi kerak')
    assert.ok(
      urlSet.has(`${SAYT_DOMEN}/kanallar/tushunarli-kimyo`),
      'Ochiq kanal sitemapda bo‘lishi kerak',
    )

    for (const entry of yakuniy) {
      const pathPart = entry.url.replace(SAYT_DOMEN, '') || '/'
      assert.equal(
        robotsTaqiqlaganmi(pathPart, disallowQoidalari),
        false,
        `Yakuniy sitemap da robots taqiqlagan URL bor: ${entry.url}`,
      )
    }

    const sitemapKod = fs.readFileSync(path.join(ROOT, 'app', 'sitemap.js'), 'utf8')
    assert.ok(sitemapKod.includes('sitemapYozuvlariniTuz'))
    assert.ok(sitemapKod.includes('./robots'))
  })

  test("holat !== 'ochiq' fanlar, yopiq sinflar va redirect sahifalari kirmagan", () => {
    const jsonSet = new Set(sitemapRoyxat.map((x) => x.yol))

    for (const fan of FANLAR) {
      const yol = `/fan/${fan.slug}`
      if (fan.holat === 'ochiq') {
        assert.ok(jsonSet.has(yol), `Ochiq fan sitemapga kirmagan: ${yol}`)
      } else {
        assert.ok(!jsonSet.has(yol), `404 qaytaradigan yopiq fan sitemapda turibdi: ${yol}`)
      }
    }

    for (const sinf of MAKTAB_SINFLARI) {
      const yol = sinfHavolasi(sinf)
      if (sinf.ochiq) {
        assert.ok(jsonSet.has(yol), `Ochiq sinf sitemapda yo‘q: ${yol}`)
      } else {
        assert.ok(!jsonSet.has(yol), `Yopiq sinf (ochiq:false) sitemapga kirgan: ${yol}`)
      }
    }

    assert.ok(!jsonSet.has('/sea-ms-sinov'), 'Redirect sahifa /sea-ms-sinov kirmasligi kerak')
    assert.ok(!jsonSet.has('/doska/auth'), '/doska/auth kirmasligi kerak')
    assert.ok(!jsonSet.has('/doska/skaner'), '/doska/skaner kirmasligi kerak')
    assert.ok(!jsonSet.has('/login'), '/login kirmasligi kerak')
    assert.ok(!jsonSet.has('/register'), '/register kirmasligi kerak')
    assert.ok(jsonSet.has('/sertifikat'), '/sertifikat ochiq portal sifatida kirmog‘i kerak')
  })

  test('barcha ochiq statik, katalog, o‘yin va 73 ta 7–8-sinf mavzu sahifalari mavjud', () => {
    const jsonSet = new Set(sitemapRoyxat.map((x) => x.yol))

    const kutilganStatik = [
      '/',
      '/jda-kimyo',
      '/ishlashi',
      '/sertifikat',
      '/milliy-sertifikat/tekshir',
      '/doska',
      '/testlar',
      '/testlar/kimyo-0-dan',
      '/oyinlar',
      '/oyinlar/formulani-top',
      '/oyinlar/element-duel',
      '/oyinlar/formula-konstruktor',
      '/oyinlar/reaksiya-balans',
      '/oyinlar/sifat-detektiv',
      '/maktabkimyo',
      '/oliykimyo',
      '/milliy-sertifikat',
      '/repititorlar',
      '/kimyogarlar',
      '/dolzarb',
      '/masala',
      '/laboratoriya',
      '/kanallar',
      '/dokon',
      '/hamkorlik',
      '/hamkorlik/sayt-hamkorlari',
      '/hamkorlik/faq',
      '/hamkorlik/yangiliklar',
      '/hamkorlik/boglanish',
      '/hamkorlik/jamoaga-taklif',
    ]

    for (const yol of kutilganStatik) {
      assert.ok(jsonSet.has(yol), `Kutilgan statik/katalog sahifa yo‘q: ${yol}`)
    }

    assert.equal(YETTI_SINF_MAVZULARI.length, 28)
    assert.equal(SAKKIZ_SINF_MAVZULARI.length, 45)

    let ochiqMavzularSoni = 0
    for (const sinfRaqam of [7, 8]) {
      const sinf = MAKTAB_SINFLARI.find((s) => s.sinf === sinfRaqam)
      for (const mavzu of sinf.mavzular) {
        assert.equal(mavzuTayyormi(sinfRaqam, mavzu.slug), true)
        const yol = mavzuHavolasi(sinf, mavzu)
        assert.ok(jsonSet.has(yol), `Tayyor maktab mavzusi sitemapda yo‘q: ${yol}`)
        ochiqMavzularSoni += 1
      }
    }
    assert.equal(ochiqMavzularSoni, 73)
  })

  test("yangi katalog layout'lari va ularning dinamik bolalari o'z canonical metadata'siga ega", () => {
    const layoutYollar = [
      'maktabkimyo',
      'oliykimyo',
      'milliy-sertifikat',
      'repititorlar',
      'kimyogarlar',
      'dolzarb',
      'masala',
      'laboratoriya',
      'kanallar',
      'dokon',
      'hamkorlik',
      'hamkorlik/sayt-hamkorlari',
      'hamkorlik/faq',
      'hamkorlik/yangiliklar',
      'hamkorlik/boglanish',
      'hamkorlik/jamoaga-taklif',
    ]

    for (const p of layoutYollar) {
      const fayl = path.join(ROOT, 'app', p, 'layout.js')
      assert.ok(fs.existsSync(fayl), `Layout fayl topilmadi: app/${p}/layout.js`)
      const kod = fs.readFileSync(fayl, 'utf8')
      assert.match(kod, /export\s+const\s+metadata\b/)
      assert.match(kod, /description\s*:/)
      assert.ok(kod.includes(`canonical: "/${p}"`) || kod.includes(`canonical: '/${p}'`))
    }

    // Ota layout canonical'ini meros qilib olmasligi kerak bo'lgan ichki marshrutlar
    for (const faylYoli of [
      'app/dolzarb/[id]/layout.js',
      'app/kanallar/[slug]/layout.js',
      'app/milliy-sertifikat/[slug]/layout.js',
      'app/milliy-sertifikat/tekshir/page.js',
      'app/milliy-sertifikat/tekshir/[id]/page.js',
    ]) {
      const kod = fs.readFileSync(path.join(ROOT, faylYoli), 'utf8')
      assert.match(kod, /alternates\s*:\s*\{[^}]*\bcanonical\b/, `${faylYoli} ichida alternates.canonical yo'q`)
    }
  })

  test("robotsTaqiqlaganmi prefiks va aniq yo'l qoidalarini to'g'ri tekshiradi", () => {
    assert.equal(robotsTaqiqlaganmi('/ustoz/open-quiz', disallowQoidalari), true)
    assert.equal(robotsTaqiqlaganmi('/doska/auth', disallowQoidalari), true)
    assert.equal(robotsTaqiqlaganmi('/doska/skaner', disallowQoidalari), true)
    assert.equal(robotsTaqiqlaganmi('/login', disallowQoidalari), true)
    assert.equal(robotsTaqiqlaganmi('/doska', disallowQoidalari), false)
    assert.equal(robotsTaqiqlaganmi('/sertifikat/verify/AK-JK-2025-1247', disallowQoidalari), false)
  })
})
