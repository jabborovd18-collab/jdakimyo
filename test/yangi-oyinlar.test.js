import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-uchun-kalit-1234567890abcdef'

import { ELEMENT_BAZA } from '../lib/oyinlar/element-baza.js'
import {
  elementDuelBoshla,
  elementDuelJavob,
  elementDuelTugat,
  elementDuelYordam,
} from '../lib/oyinlar/element-duel-server.js'
import {
  formulaMatnYasa,
  KONSTRUKTOR_ANIONLAR,
  KONSTRUKTOR_KATIONLAR,
  konstruktorBoshla,
  konstruktorOtkaz,
  konstruktorTekshir,
} from '../lib/oyinlar/formula-konstruktor-server.js'
import { ochHolat, shifrlaHolat } from '../lib/oyinlar/oyin-token.js'
import {
  reaksiyaBalansBoshla,
  reaksiyaBalansTekshir,
  reaksiyaBalansTugat,
} from '../lib/oyinlar/reaksiya-balans-server.js'
import {
  sifatDetektivAniqla,
  sifatDetektivBoshla,
  sifatDetektivSinov,
  sifatDetektivTugat,
} from '../lib/oyinlar/sifat-detektiv-server.js'
import { ATOM_MASSALAR } from '../lib/masala-dvigatel.js'

describe('Umumiy o‘yin token shifrlash', () => {
  it('token boshqa namespace bilan ochilmaydi va o‘zgartirishni rad etadi', () => {
    const token = shifrlaHolat({ ball: 120 }, 'oyin-a/v1', 60_000)
    assert.deepEqual(ochHolat(token, 'oyin-a/v1').ball, 120)
    assert.equal(ochHolat(token, 'oyin-b/v1'), null)
    const buzilgan = `${token.slice(0, -3)}xxx`
    assert.equal(ochHolat(buzilgan, 'oyin-a/v1'), null)
  })
})

describe('Elementlar dueli', () => {
  it('IUPAC ATOM_MASSALAR dan foydalanadi va elektron qobiqlar yig‘indisi Z ga teng', () => {
    for (const el of ELEMENT_BAZA) {
      assert.equal(el.massa, ATOM_MASSALAR[el.belgi], `${el.belgi} massasi mos kelishi shart`)
      const qobiqYigindi = el.qobiq.reduce((s, n) => s + n, 0)
      assert.equal(qobiqYigindi, el.z, `${el.belgi} qobiqlar yig‘indisi Z=${el.z} ga teng`)
    }
  })

  it('klientga to‘g‘ri javobni ochiq yubormaydi, 50/50 va 1v1 ishlaydi', () => {
    const bosh = elementDuelBoshla({ rejim: 'duel-savol', daraja: 'orta', p1Ism: 'Ali', p2Ism: 'Vali' })
    assert.equal(bosh.ok, true)
    assert.equal(bosh.umumiySavol.togri, undefined)
    assert.equal(bosh.umumiySavol.variantlar.length, 4)

    const yordam = elementDuelYordam({ token: bosh.token, oyinchi: 'p1' })
    assert.equal(yordam.p1.yordamQoldi, 1)
    assert.equal(yordam.p1.yashirilgan.length, 2)

    const maxfiy = ochHolat(yordam.token, 'element-duel/v1')
    const xatoVariant = maxfiy.umumiySavol.variantlar.find((v) => v !== maxfiy.umumiySavol.togri)
    const xatoNatija = elementDuelJavob({
      token: yordam.token,
      oyinchi: 'p1',
      javob: xatoVariant,
      savolId: bosh.umumiySavol.savolId,
    })
    assert.equal(xatoNatija.natijaKod, 'xato')
    assert.equal(xatoNatija.p1.xato, 1)

    // P2 to'g'ri javob berib raundni oladi
    const togriNatija = elementDuelJavob({
      token: xatoNatija.token,
      oyinchi: 'p2',
      javob: maxfiy.umumiySavol.togri,
      savolId: bosh.umumiySavol.savolId,
    })
    assert.equal(togriNatija.natijaKod, 'togri')
    assert.ok(togriNatija.p2.ball >= 20)
    assert.notEqual(togriNatija.umumiySavol.savolId, bosh.umumiySavol.savolId)

    const yakun = elementDuelTugat({ token: togriNatija.token })
    assert.equal(yakun.tugagan, true)
    assert.equal(yakun.natija.golib, 'p2')
  })
})

describe('Formula konstruktori', () => {
  it('ko‘p atomli ionlar uchun qavs va indekslarni to‘g‘ri formatlaydi', () => {
    const fe3 = KONSTRUKTOR_KATIONLAR.find((k) => k.id === 'Fe3+')
    const so4 = KONSTRUKTOR_ANIONLAR.find((a) => a.id === 'SO42-')
    const nh4 = KONSTRUKTOR_KATIONLAR.find((k) => k.id === 'NH4+')
    const ca2 = KONSTRUKTOR_KATIONLAR.find((k) => k.id === 'Ca2+')
    const oh = KONSTRUKTOR_ANIONLAR.find((a) => a.id === 'OH-')

    assert.equal(formulaMatnYasa(fe3, 2, so4, 3), 'Fe₂(SO₄)₃')
    assert.equal(formulaMatnYasa(nh4, 2, so4, 1), '(NH₄)₂SO₄')
    assert.equal(formulaMatnYasa(ca2, 1, oh, 2), 'Ca(OH)₂')
  })

  it('EKUB > 1 nisbatni rad etadi va to‘g‘ri formulani baholaydi', () => {
    const bosh = konstruktorBoshla({ rejim: 'yakka', daraja: 'qiyin' })
    const maxfiy = ochHolat(bosh.token, 'formula-konstruktor/v1')
    const s = maxfiy.p1Savol

    // Atayin 2 karra orttirilgan indekslar yuboramiz (agar ks va as <= 2 bo'lsa)
    if (s.togriKs <= 2 && s.togriAs <= 2) {
      const ekubXato = konstruktorTekshir({
        token: bosh.token,
        oyinchi: 'p1',
        savolId: s.savolId,
        kId: s.togriK,
        kSoni: s.togriKs * 2,
        aId: s.togriA,
        aSoni: s.togriAs * 2,
      })
      assert.equal(ekubXato.natijaKod, 'xato')
      assert.match(ekubXato.xatoIzoh, /EKUB/)
    }

    const togri = konstruktorTekshir({
      token: bosh.token,
      oyinchi: 'p1',
      savolId: s.savolId,
      kId: s.togriK,
      kSoni: s.togriKs,
      aId: s.togriA,
      aSoni: s.togriAs,
    })
    assert.equal(togri.natijaKod, 'togri')
    assert.ok(togri.p1.ball >= 30)

    const otkaz = konstruktorOtkaz({
      token: togri.token,
      oyinchi: 'p1',
      savolId: togri.p1Savol.savolId,
    })
    assert.equal(otkaz.natijaKod, 'otkaz')
  })
})

describe('Reaksiyani tenglashtir', () => {
  it('balansTekshir va EKUB = 1 qoidasi bilan stexiometriyani tekshiradi', async () => {
    const { azoniOqi: balansOqi } = await import('../lib/chem-balance.js')
    const bosh = reaksiyaBalansBoshla({ rejim: 'duel-vaqt', daraja: 'orta' })
    assert.equal(bosh.p1Savol.togri, undefined)
    assert.ok(bosh.p1Savol.chap.length >= 1)

    const maxfiy = ochHolat(bosh.token, 'reaksiya-balans/v1')
    const [chapRaw, , ongRaw] = maxfiy.p1Savol.tenglama.split(/\s*(→|⇌)\s*/)
    const kChap = chapRaw.split(/\s+\+\s+/).map((q) => balansOqi(q).koeffitsient)
    const kOng = ongRaw.split(/\s+\+\s+/).map((q) => balansOqi(q).koeffitsient)

    // Barcha koeffitsientlarni 2 ga ko'paytirib EKUB tekshiruvini sinash
    const karraNatija = reaksiyaBalansTekshir({
      token: bosh.token,
      oyinchi: 'p1',
      savolId: maxfiy.p1Savol.savolId,
      chapKoeff: kChap.map((n) => n * 2),
      ongKoeff: kOng.map((n) => n * 2),
    })
    assert.equal(karraNatija.natijaKod, 'xato')
    assert.match(karraNatija.xatoIzoh, /EKUB/)

    const togri = reaksiyaBalansTekshir({
      token: karraNatija.token,
      oyinchi: 'p1',
      savolId: maxfiy.p1Savol.savolId,
      chapKoeff: kChap,
      ongKoeff: kOng,
    })
    assert.equal(togri.natijaKod, 'togri')
    assert.ok(togri.p1.ball >= 35)

    const yakun = reaksiyaBalansTugat({ token: togri.token })
    assert.equal(yakun.tugagan, true)
  })
})

describe('Sifat reaksiyalar detektivi', () => {
  it('1v1 bir xil namunada har bir o‘yinchining sinov tarixini alohida saqlaydi', () => {
    const bosh = sifatDetektivBoshla({ rejim: 'duel-savol', daraja: 'qiyin' })
    const p1Sinov = sifatDetektivSinov({
      token: bosh.token,
      oyinchi: 'p1',
      reagentId: 'AgNO3',
      namunaId: bosh.umumiyNamuna.namunaId,
    })
    assert.equal(p1Sinov.umumiyNamuna.sinovTarixi.filter((s) => s.oyinchi === 'p1').length, 1)
    assert.equal(p1Sinov.umumiyNamuna.sinovTarixi.filter((s) => s.oyinchi === 'p2').length, 0)

    const maxfiy = ochHolat(p1Sinov.token, 'sifat-detektiv/v1')
    const p1Topdi = sifatDetektivAniqla({
      token: p1Sinov.token,
      oyinchi: 'p1',
      tanlovId: maxfiy.umumiyNamuna.togriId,
      namunaId: bosh.umumiyNamuna.namunaId,
    })
    assert.equal(p1Topdi.natijaKod, 'togri')
    assert.equal(p1Topdi.p1.ball, 65) // 1 ta sinov -> snayper bonusi

    const yakun = sifatDetektivTugat({ token: p1Topdi.token })
    assert.equal(yakun.tugagan, true)
    assert.equal(yakun.natija.golib, 'p1')
  })
})
