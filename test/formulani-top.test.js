import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'sinov-kaliti-formulani-top-uchun-32bayt'

import { FORMULA_TOP_MODDALAR, formulaTopIshora } from '../data/formulani-top.js'
import { javobniBaho, kartaAmali, oyinniBoshla } from '../lib/formulani-top-server.js'

function togriVariantniTop(variantlar, ishora, daraja) {
  const mosModda = FORMULA_TOP_MODDALAR.find((m) => formulaTopIshora(m, daraja) === ishora)
  assert.ok(mosModda, 'Ishoraga mos modda topilishi kerak')
  if (daraja >= 3) {
    const k = JSON.stringify(mosModda.tuzilma)
    return variantlar.find((v) => JSON.stringify(v.tuzilma) === k)
  }
  return variantlar.find((v) => v.formula === mosModda.formula)
}

function xatoVariantniTop(variantlar, ishora, daraja) {
  const togri = togriVariantniTop(variantlar, ishora, daraja)
  return variantlar.find((v) => v.id !== togri.id)
}

function vaqtBilan(vaqtMs, fn) {
  const aslNow = Date.now
  Date.now = () => vaqtMs
  try {
    return fn()
  } finally {
    Date.now = aslNow
  }
}

describe('Formulani top — kengaytirilgan server hakami', () => {
  test('yakka rejimda 24 ta variant beriladi va to‘g‘ri javob ball oshiradi', () => {
    const bosh = oyinniBoshla({
      daraja: 1,
      rejim: 'yakka',
      savollarSoni: 7,
      vaqtSekund: 90,
      kartalar: { kombo2x: true, notogriBos: true, vaqt15: true },
    })

    assert.equal(bosh.rejim, 'yakka')
    assert.equal(bosh.variantlar.length, 24)
    assert.equal(bosh.jami, 7)

    const togri = togriVariantniTop(bosh.variantlar, bosh.ishora, bosh.savolDaraja)
    const natija = javobniBaho(bosh.token, togri.id)
    assert.equal(natija.togrimi, true)
    assert.equal(natija.ball, 1)
    assert.equal(natija.seriya, 1)
  })

  test('50/50 Yordam kartasi 12 ta noto‘g‘ri variantni o‘chiradi, to‘g‘risini saqlab qoladi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'yakka',
        vaqtSekund: 90,
        kartalar: { yordam50: true },
      })
    )
    assert.equal(bosh.kartaTaklif.turi, 'yordam50')

    const tKarta = t0 + bosh.kartaTaklif.kechikishMs + 200
    const olindi = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.token, 'karta', { kartaId: bosh.kartaTaklif.id })
    )
    assert.equal(olindi.qabul, true)
    assert.equal(olindi.ochirilganlar.length, 12)
    const togri = togriVariantniTop(bosh.variantlar, bosh.ishora, bosh.savolDaraja)
    assert.equal(olindi.ochirilganlar.includes(togri.id), false)
  })

  test('Qalqon kartasi xato bosishdan saqlaydi va seriyani buzmaydi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'yakka',
        vaqtSekund: 90,
        kartalar: { qalqon: true },
      })
    )
    const tKarta = t0 + bosh.kartaTaklif.kechikishMs + 200
    const qalqonRes = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.token, 'karta', { kartaId: bosh.kartaTaklif.id })
    )
    assert.equal(qalqonRes.qalqon, true)

    const xato = xatoVariantniTop(bosh.variantlar, bosh.ishora, bosh.savolDaraja)
    const himoya = vaqtBilan(tKarta + 300, () => javobniBaho(qalqonRes.token, xato.id))
    assert.equal(himoya.qalqonIshladi, true)
    assert.equal(himoya.qalqon, false)
    assert.ok(himoya.ochirilganlar.includes(xato.id))
  })

  test('Yomon karta Bomba bosilganda -1 ball va -10s jarima beradi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'yakka',
        vaqtSekund: 90,
        kartalar: { bomba: true },
      })
    )
    const togri = togriVariantniTop(bosh.variantlar, bosh.ishora, bosh.savolDaraja)
    const javob1 = vaqtBilan(t0 + 200, () => javobniBaho(bosh.token, togri.id))
    assert.equal(javob1.ball, 1)

    const savol2 = javob1.keyingi
    assert.equal(savol2.kartaTaklif.turi, 'bomba')
    const tBomba = t0 + 200 + savol2.kartaTaklif.kechikishMs + 200
    const portladi = vaqtBilan(tBomba, () =>
      kartaAmali(savol2.token, 'karta', { kartaId: savol2.kartaTaklif.id })
    )
    assert.equal(portladi.qabul, true)
    assert.equal(portladi.turi, 'bomba')
    assert.equal(portladi.ball, 0)
    assert.ok(portladi.qolganMs < 82_000)
  })

  test('Yakka rejimda muzlatish, tuman va aralashtir muddati o‘tsa ta’sir qiladi', () => {
    const t0 = 1_700_000_000_000
    for (const [turi, tekshir] of [
      ['muzlatish', (res) => assert.ok(res.blokQolganMs > 1500)],
      ['tuman', (res) => assert.ok(res.tumanQolganMs > 4000)],
      ['aralashtir', (res, bosh) => {
        const eskiTartib = bosh.variantlar.map((v) => v.id).join(',')
        const yangiTartib = res.variantlar.map((v) => v.id).join(',')
        assert.notEqual(eskiTartib, yangiTartib)
      }],
    ]) {
      const bosh = vaqtBilan(t0, () =>
        oyinniBoshla({ daraja: 1, rejim: 'yakka', vaqtSekund: 90, kartalar: { [turi]: true } })
      )
      const tugash = t0 + bosh.kartaTaklif.kechikishMs + bosh.kartaTaklif.davomiylikMs + 100
      const muddatRes = vaqtBilan(tugash, () =>
        kartaAmali(bosh.token, 'karta-muddat', { kartaId: bosh.kartaTaklif.id })
      )
      assert.equal(muddatRes.qollandi, true)
      assert.equal(muddatRes.qollandiTuri, turi)
      tekshir(muddatRes, bosh)
    }
  })

  test('1v1 da "har-xil" karta rejimi har ikki o‘yinchiga alohida kartalar beradi va hujumlarni ishlatadi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'duel-savol',
        duelKartaTartibi: 'har-xil',
        vaqtSekund: 90,
        kartalar: { muzlatish: true },
      })
    )
    assert.equal(bosh.duelKartaTartibi, 'har-xil')
    assert.equal(bosh.kartaTaklif, null)
    assert.ok(bosh.p1.kartaTaklif && bosh.p2.kartaTaklif)
    assert.notEqual(bosh.p1.kartaTaklif.id, bosh.p2.kartaTaklif.id)

    // 1-o'yinchi o'zining muzlatish kartasini bosib 2-o'yinchini muzlatadi.
    const tKarta = t0 + bosh.p1.kartaTaklif.kechikishMs + 200
    const hujum = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.token, 'karta', { kartaId: bosh.p1.kartaTaklif.id, oyinchi: 1 })
    )
    assert.equal(hujum.qabul, true)
    assert.ok(hujum.p2.blokQolganMs >= 3000)
    assert.equal(hujum.p1.blokQolganMs, 0)
  })

  test('1v1 Bitta savolda poyga: bir-xil karta, tuzoq yechimi va bloklash ishlaydi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'duel-savol',
        duelKartaTartibi: 'bir-xil',
        savollarSoni: 7,
        vaqtSekund: 90,
        kartalar: { notogriBos: true },
      })
    )
    assert.ok(bosh.kartaTaklif)

    const tKarta = t0 + bosh.kartaTaklif.kechikishMs + 200
    const tuzoqRes = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.token, 'karta', { kartaId: bosh.kartaTaklif.id, oyinchi: 1 })
    )
    assert.equal(tuzoqRes.qabul, true)
    assert.equal(tuzoqRes.p2.teskariJuftlik.length, 2)

    const p2Togri = togriVariantniTop(bosh.p2.variantlar, bosh.ishora, bosh.savolDaraja)
    const p2JuftlikXato = tuzoqRes.p2.teskariJuftlik.find((id) => id !== p2Togri.id)
    const qutulish = vaqtBilan(tKarta + 300, () =>
      javobniBaho(tuzoqRes.token, p2JuftlikXato, { oyinchi: 2 })
    )
    assert.equal(qutulish.tuzoqYechimi, 'qutuldi')
  })

  test('1v1 Vaqtga mustaqil bellashuv: tuman hujumi va bir-xil taklifni bekor qilish ishlaydi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 3,
        rejim: 'duel-vaqt',
        duelKartaTartibi: 'bir-xil',
        vaqtSekund: 90,
        kartalar: { tuman: true },
      })
    )
    assert.equal(bosh.p1.kartaTaklif.id, bosh.p2.kartaTaklif.id)

    const tKarta = t0 + bosh.p1.kartaTaklif.kechikishMs + 200
    const p1Karta = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.p1.token, 'karta', { kartaId: bosh.p1.kartaTaklif.id })
    )
    assert.ok(p1Karta.raqibTuzoqToken)

    const p2Tuman = vaqtBilan(tKarta + 100, () =>
      kartaAmali(bosh.p2.token, 'tuzoq-qabul', { tuzoqToken: p1Karta.raqibTuzoqToken })
    )
    assert.equal(p2Tuman.hujumTuri, 'tuman')
    assert.ok(p2Tuman.tumanQolganMs >= 5000)

    const bekor = vaqtBilan(tKarta + 120, () => kartaAmali(p2Tuman.token, 'karta-bekor'))
    assert.ok(bekor.token)
  })

  test('Sirli karta (?), karta ritmi va o‘rtacha javob vaqti to‘g‘ri hisoblanadi', () => {
    const t0 = 1_700_000_000_000
    const bosh = vaqtBilan(t0, () =>
      oyinniBoshla({
        daraja: 1,
        rejim: 'yakka',
        kartaRitm: 'tez',
        vaqtSekund: 90,
        kartalar: { sirli: true },
      })
    )
    assert.equal(bosh.kartaTaklif.turi, 'sirli')
    assert.ok(bosh.kartaTaklif.kechikishMs <= 3800)

    const tKarta = t0 + bosh.kartaTaklif.kechikishMs + 150
    const sirliRes = vaqtBilan(tKarta, () =>
      kartaAmali(bosh.token, 'karta', { kartaId: bosh.kartaTaklif.id })
    )
    assert.equal(sirliRes.qabul, true)
    assert.equal(sirliRes.turi, 'sirli')
    assert.ok(
      ['bonus3', 'kombo2x', 'vaqt15', 'yordam50', 'qalqon', 'tuman', 'aralashtir'].includes(sirliRes.sirliNatija)
    )

    const togri = togriVariantniTop(sirliRes.variantlar, bosh.ishora, bosh.savolDaraja)
    const javob = vaqtBilan(tKarta + 1200, () => javobniBaho(sirliRes.token, togri.id))
    assert.equal(javob.togrimi, true)
    assert.ok(javob.ortachaVaqtMs >= 1000)
  })
})
