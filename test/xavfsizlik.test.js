import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import {
  vaqtBoyichaTeng,
  tasodifiyKod,
  tasodifiySon,
  tasodifiyBelgilar,
  rasmSehrliBaytTuri,
  pdfSehrliBaytmi,
} from '../lib/xavfsiz.js'
import { ustozPaneliOchiqmi } from '../lib/roles.js'
import {
  yangiXonaYarat,
  doskaHolatiniOlish,
  hostHuquqiniTekshir,
  qatnashchiQosh,
} from '../lib/doska-jang-boshqaruvchi.js'
import { hujjatHtmlYarat } from '../lib/masala-pdf-chromium.js'

describe('Kriptografik va kirish-tekshiruv yordamchilari (lib/xavfsiz.js)', () => {
  test('vaqtBoyichaTeng uzunligi teng va har xil satrlarni togri solishtiradi', () => {
    assert.equal(vaqtBoyichaTeng('mahfiy-kalit-123', 'mahfiy-kalit-123'), true)
    assert.equal(vaqtBoyichaTeng('mahfiy-kalit-123', 'mahfiy-kalit-124'), false)
    assert.equal(vaqtBoyichaTeng('qisqa', 'uzunroq-satr'), false)
    assert.equal(vaqtBoyichaTeng('', ''), true)
    assert.equal(vaqtBoyichaTeng('', 'bir'), false)
    assert.equal(vaqtBoyichaTeng(null, 'abc'), false)
    assert.equal(vaqtBoyichaTeng('abc', undefined), false)
    assert.equal(vaqtBoyichaTeng(123, 123), false)
  })

  test('tasodifiyKod va tasodifiyBelgilar CSPRNG chegaralariga amal qiladi', () => {
    const alifbo = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
    const kod = tasodifiyKod(alifbo, 8)
    assert.equal(kod.length, 8)
    for (const ch of kod) {
      assert.ok(alifbo.includes(ch))
    }

    assert.throws(() => tasodifiyKod('', 6))
    assert.throws(() => tasodifiyKod(alifbo, 0))

    for (let i = 0; i < 30; i++) {
      const n = tasodifiySon(100000, 1000000)
      assert.ok(n >= 100000 && n < 1000000)
    }

    const t1 = tasodifiyBelgilar(24)
    const t2 = tasodifiyBelgilar(24)
    assert.match(t1, /^[0-9a-f]{48}$/)
    assert.notEqual(t1, t2)
  })

  test('rasmSehrliBaytTuri haqiqiy rasm sarlavhalarini taniydi va soxtalarini rad etadi', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])
    const gif = Buffer.from('GIF89a\x01\x00\x01\x00', 'ascii')
    const webp = Buffer.concat([
      Buffer.from('RIFF', 'ascii'),
      Buffer.from([0x24, 0x00, 0x00, 0x00]),
      Buffer.from('WEBP', 'ascii'),
    ])
    const html = Buffer.from('<html><script>alert(1)</script></html>', 'utf8')
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>', 'utf8')
    const riffNotWebp = Buffer.from('RIFF\x00\x00\x00\x00WAVE', 'ascii')

    assert.equal(rasmSehrliBaytTuri(jpeg), 'image/jpeg')
    assert.equal(rasmSehrliBaytTuri(new Uint8Array(png)), 'image/png')
    assert.equal(rasmSehrliBaytTuri(gif), 'image/gif')
    assert.equal(rasmSehrliBaytTuri(webp), 'image/webp')
    assert.equal(rasmSehrliBaytTuri(html), null)
    assert.equal(rasmSehrliBaytTuri(svg), null)
    assert.equal(rasmSehrliBaytTuri(riffNotWebp), null)
    assert.equal(rasmSehrliBaytTuri(Buffer.from([0xff, 0xd8])), null)
  })

  test('pdfSehrliBaytmi haqiqiy PDF sarlavhasini tekshiradi', () => {
    assert.equal(pdfSehrliBaytmi(Buffer.from('%PDF-1.7\n...')), true)
    assert.equal(pdfSehrliBaytmi(Buffer.from('<html>not pdf</html>')), false)
    assert.equal(pdfSehrliBaytmi(Buffer.from('')), false)
  })
})

describe('Elektron doska sessiyasi huquq chegaralari (lib/roles.js)', () => {
  test('doskaTugaydi mavjud bolganda ustozPaneliOchiqmi yopiladi', () => {
    assert.equal(ustozPaneliOchiqmi({ role: 'ustoz', isTeacher: true }), true)
    assert.equal(ustozPaneliOchiqmi({ role: 'superadmin', isTeacher: false }), true)
    assert.equal(
      ustozPaneliOchiqmi({ role: 'ustoz', isTeacher: true, doskaTugaydi: Date.now() + 3600_000 }),
      false
    )
    assert.equal(
      ustozPaneliOchiqmi({ role: 'superadmin', isTeacher: true, doskaTugaydi: Date.now() + 3600_000 }),
      false
    )
  })
})

describe('Jamoalar Jangi xavfsizlik nazorati (lib/doska-jang-boshqaruvchi.js)', () => {
  test('hostToken public doska holatiga sizdirilmaydi va faqat togri token ruxsat beradi', () => {
    const xona = yangiXonaYarat('sirt-hodisalari-adsorbsiya', 2)
    try {
      assert.ok(xona._hostToken && xona._hostToken.length >= 32)
      const publicState = doskaHolatiniOlish(xona.xonaId)
      assert.equal(publicState._hostToken, undefined)
      assert.equal(publicState.hostToken, undefined)

      assert.equal(hostHuquqiniTekshir(xona.xonaId, xona._hostToken).ok, true)
      assert.deepEqual(
        hostHuquqiniTekshir(xona.xonaId, 'notogri-kalit').status,
        403
      )
      assert.deepEqual(hostHuquqiniTekshir(xona.xonaId, null).status, 403)
      assert.deepEqual(hostHuquqiniTekshir('000000', xona._hostToken).status, 404)

      const q = qatnashchiQosh(xona.xonaId, 'Aziza', 1)
      assert.match(q.qatnashchiId, /^q_[0-9a-f]{24}$/)
    } finally {
      globalThis.__doskaXonalar?.delete(xona.xonaId)
    }
  })

  test('bitta xonada ishtirokchilar soni 120 ta bilan cheklanadi', () => {
    const xona = yangiXonaYarat('sirt-hodisalari-adsorbsiya', 2)
    try {
      for (let i = 1; i <= 120; i++) {
        qatnashchiQosh(xona.xonaId, `Oquvchi ${i}`, (i % 2) + 1)
      }
      assert.throws(() => qatnashchiQosh(xona.xonaId, 'Ortiqcha', 1), /Xona to'ldi/)
    } finally {
      globalThis.__doskaXonalar?.delete(xona.xonaId)
    }
  })
})

describe('Chromium PDF HTML hujjati (lib/masala-pdf-chromium.js)', () => {
  test('hujjatHtmlYarat qattiq CSP sarlavhasini va XSS himoyasini qoshadi', async () => {
    const html = await hujjatHtmlYarat({
      masalaMatni: '<script>fetch("https://evil.example")</script>',
      natija: { turi: 'yechim', masalaMatni: 'Test', qadamlar: [], yakuniyJavob: '1 mol' },
    })
    assert.ok(html.includes('http-equiv="Content-Security-Policy"'))
    assert.ok(html.includes("default-src 'none'"))
    assert.equal(html.includes('<script>fetch('), false)
  })
})
