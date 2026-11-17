import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

import {
  chatRoyxatOzgardimi,
  suhbatOzgardimi,
} from '../lib/chat-interfeys.js'

function qirqIkonKalitlarini(ikonFaylMatni) {
  const yollarBlok = ikonFaylMatni.match(/const YOLLAR = \{([\s\S]*?)\n\}/)?.[1] || ''
  return new Set(
    [...yollarBlok.matchAll(/^\s{2}([a-zA-Z0-9_]+):/gm)].map((m) => m[1]),
  )
}

describe('Shaxsiy chat (/chat) — polling, ikonkalar va render izolyatsiyasi', () => {
  test('chatRoyxatOzgardimi bir xil polling javobini qayta chizmaydi va o‘zgarishni aniq sezadi', () => {
    const namuna = {
      success: true,
      oqilmagan: 1,
      faol: [
        {
          id: 'c1',
          holat: 'faol',
          qadalgan: false,
          qadalganVaqt: null,
          menBoshladim: true,
          oqilmagan: 1,
          updatedAt: '2026-11-16T10:00:00.000Z',
          odam: { id: 'u2', fullName: 'Ali', username: 'ali', avatar: null, isVerified: true },
          oxirgiXabar: {
            matn: 'Salom',
            ochirilgan: false,
            meniki: false,
            createdAt: '2026-11-16T10:00:00.000Z',
          },
        },
      ],
      sorovlar: [],
      yuborilgan: [],
    }

    const nusxa = JSON.parse(JSON.stringify(namuna))
    assert.equal(chatRoyxatOzgardimi(namuna, nusxa), false)

    const oqildi = JSON.parse(JSON.stringify(namuna))
    oqildi.oqilmagan = 0
    oqildi.faol[0].oqilmagan = 0
    assert.equal(chatRoyxatOzgardimi(namuna, oqildi), true)

    const yangiXabar = JSON.parse(JSON.stringify(namuna))
    yangiXabar.faol[0].oxirgiXabar.matn = 'Qalaysiz?'
    assert.equal(chatRoyxatOzgardimi(namuna, yangiXabar), true)
  })

  test('suhbatOzgardimi xabarlar, o‘qilgan holati va blok o‘zgarishini to‘g‘ri aniqlaydi', () => {
    const namuna = {
      suhbat: {
        id: 'c1',
        holat: 'faol',
        menBoshladim: true,
        qadalgan: false,
        qadalganVaqt: null,
        odam: { id: 'u2', fullName: 'Ali', username: 'ali', avatar: null, isVerified: false },
      },
      blok: { meniBlokladi: false, menBlokladim: false },
      xabarlar: [
        {
          id: 'm1',
          matn: 'Assalomu alaykum',
          ochirilgan: false,
          meniki: true,
          oqilgan: false,
          createdAt: '2026-11-16T10:00:00.000Z',
          replyTo: null,
        },
      ],
    }

    const nusxa = JSON.parse(JSON.stringify(namuna))
    assert.equal(suhbatOzgardimi(namuna, nusxa), false)

    const oqilgan = JSON.parse(JSON.stringify(namuna))
    oqilgan.xabarlar[0].oqilgan = true
    assert.equal(suhbatOzgardimi(namuna, oqilgan), true)

    const bloklangan = JSON.parse(JSON.stringify(namuna))
    bloklangan.blok.meniBlokladi = true
    assert.equal(suhbatOzgardimi(namuna, bloklangan), true)

    const ochirilgan = JSON.parse(JSON.stringify(namuna))
    ochirilgan.xabarlar[0].ochirilgan = true
    ochirilgan.xabarlar[0].matn = null
    assert.equal(suhbatOzgardimi(namuna, ochirilgan), true)
  })

  test('app/chat/korinish.js dagi IJTIMOIY_HAVOLALAR va barcha Ikon nomlari components/Ikon.jsx da mavjud', () => {
    const ikonFayl = fs.readFileSync('components/Ikon.jsx', 'utf8')
    const mavjudIkonlar = qirqIkonKalitlarini(ikonFayl)
    const chatFayl = fs.readFileSync('app/chat/korinish.js', 'utf8')

    const havolaBlok = chatFayl.match(/const IJTIMOIY_HAVOLALAR = \[([\s\S]*?)\]/)?.[1] || ''
    assert.ok(havolaBlok.length > 0, 'IJTIMOIY_HAVOLALAR topilishi kerak')
    assert.ok(!havolaBlok.includes("ikon: 'chat'"), "Eskirgan mavjud bo'lmagan 'chat' ikoni qolmasligi kerak")

    const barchaIkonKalitlari = [
      ...[...havolaBlok.matchAll(/ikon:\s*'([a-zA-Z0-9_]+)'/g)].map((m) => m[1]),
      ...[...chatFayl.matchAll(/<Ikon\b[^>]*\bnom=['"]([a-zA-Z0-9_]+)['"]/g)].map((m) => m[1]),
    ]

    for (const nom of barchaIkonKalitlari) {
      assert.ok(
        mavjudIkonlar.has(nom),
        `app/chat/korinish.js da components/Ikon.jsx ichida yo'q ikon ishlatilgan: ${nom}`,
      )
    }
  })

  test('suhbatniTanla matn/javob state bog‘liqligidan xoli va yozish maydoni memo + rAF bilan izolyatsiyalangan', () => {
    const chatFayl = fs.readFileSync('app/chat/korinish.js', 'utf8')

    const tanlaBlok = chatFayl.match(/const suhbatniTanla = useCallback\(([\s\S]*?)\n  \)/)?.[1] || ''
    assert.ok(tanlaBlok.length > 0, 'suhbatniTanla topilishi kerak')
    assert.match(tanlaBlok, /\[urlYangila\]/)
    assert.doesNotMatch(tanlaBlok, /\[tanlangan,\s*matn/)

    assert.match(chatFayl, /const ChatChapYon = memo\(/)
    assert.match(chatFayl, /const ChatXabarLenta = memo\(/)
    assert.match(chatFayl, /const ChatYozishQatori = memo\(/)
    assert.match(chatFayl, /requestAnimationFrame\(/)
    assert.doesNotMatch(chatFayl, /xabarReflar/)
  })
})
