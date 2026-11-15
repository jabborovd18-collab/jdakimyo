// test/maktab-animatsiya.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canvasOlchami,
  indekslanganVariantlarniAralashtir,
  kadrniBekorQil,
  kadrSora,
  takrorlashVariantlari,
  umumiyAudio,
  variantlarniAralashtir,
} from '../lib/maktab-animatsiya.js'

function kadrMuhiti({ kamHarakat = false } = {}) {
  const navbat = new Map()
  let id = 0
  globalThis.requestAnimationFrame = (fn) => {
    navbat.set(++id, fn)
    return id
  }
  globalThis.cancelAnimationFrame = (i) => navbat.delete(i)
  globalThis.window = { matchMedia: () => ({ matches: kamHarakat }), devicePixelRatio: 3 }
  return {
    navbat,
    aylan(vaqt) {
      const hozirgi = [...navbat.entries()]
      navbat.clear()
      for (const [, fn] of hozirgi) fn(vaqt)
    },
  }
}

test('Kadr — oddiy holatda keyingi kadrda chizadi', () => {
  const m = kadrMuhiti()
  let soni = 0
  kadrSora(null, () => soni++)
  m.aylan(performance.now() + 16)
  assert.equal(soni, 1)
})

test('Kadr — bekor qilingach chizmaydi', () => {
  const m = kadrMuhiti()
  let soni = 0
  kadrniBekorQil(kadrSora(null, () => soni++))
  m.aylan(performance.now() + 16)
  assert.equal(soni, 0)
  assert.doesNotThrow(() => kadrniBekorQil(undefined))
})

test('Kadr — kam harakat rejimida kadrlar siyraklashadi', () => {
  const m = kadrMuhiti({ kamHarakat: true })
  let soni = 0
  const bosh = performance.now()
  const kadr = kadrSora(null, () => soni++)

  m.aylan(bosh + 16)
  assert.equal(soni, 0, 'Erta kadr chizilmaydi')
  assert.equal(m.navbat.has(kadr.id), true, 'Id yangilanadi, bekor qilish ishlashi uchun')

  m.aylan(bosh + 200)
  assert.equal(soni, 1)
})

test("Canvas — aniqlik 2 bilan cheklanadi, chizish CSS o'lchamida qoladi", () => {
  kadrMuhiti()
  const canvas = { clientWidth: 300, clientHeight: 200, width: 0, height: 0 }
  let transform = null
  const natija = canvasOlchami(canvas, { setTransform: (...a) => (transform = a) })

  assert.deepEqual(natija, { w: 300, h: 200 })
  assert.equal(canvas.width, 600)
  assert.equal(canvas.height, 400)
  assert.deepEqual(transform, [2, 0, 0, 2, 0, 0])
})

test('Ovoz — kontekst bitta marta ochiladi', () => {
  kadrMuhiti()
  let ochildi = 0
  globalThis.window.AudioContext = class {
    state = 'running'
    constructor() {
      ochildi++
    }
  }
  const a = umumiyAudio()
  const b = umumiyAudio()
  assert.equal(a, b)
  assert.equal(ochildi, 1)
})

test('variantlarniAralashtir — deterministik va raund boyicha ozgaradi', () => {
  const kirish = ['Alfa', 'Beta', 'Gamma', 'Delta']
  const r0a = variantlarniAralashtir(kirish, 'Atom massa nima?', 0)
  const r0b = variantlarniAralashtir(kirish, 'Atom massa nima?', 0)

  assert.deepEqual(r0a, r0b)
  assert.deepEqual(kirish, ['Alfa', 'Beta', 'Gamma', 'Delta'])
  assert.deepEqual(
    r0a.map((x) => x.item).sort(),
    [...kirish].sort()
  )
  assert.deepEqual(
    r0a.map((x) => x.origIdx).sort((a, b) => a - b),
    [0, 1, 2, 3]
  )

  const tartiblar = new Set()
  for (let raund = 0; raund < 8; raund++) {
    const r = variantlarniAralashtir(kirish, 'Atom massa nima?', raund)
    tartiblar.add(r.map((x) => x.item).join('|'))
  }
  assert.ok(tartiblar.size > 1)
})

test('takrorlashVariantlari — ikkala formatni qollaydi va A-D boylab taqsimlaydi', () => {
  const objSavol = {
    savol: 'Moddaning eng kichik zarrachasi qaysi?',
    variantlar: [
      { matn: 'Atom', togri: true },
      { matn: 'Gisht', togri: false },
      { matn: 'Qum', togri: false },
      { matn: 'Temir bochasi', togri: false },
    ],
  }
  const objNatija = takrorlashVariantlari(objSavol, 0)
  assert.equal(objNatija.length, 4)
  assert.equal(objNatija.filter((x) => x.togri).length, 1)
  assert.equal(objNatija.find((x) => x.togri)?.matn, 'Atom')

  const strSavol = {
    savol: 'Kislorodning nisbiy atom massasi nechaga teng?',
    variantlar: ['16', '8', '32', '12'],
    togriJavob: '16',
  }
  const strNatija = takrorlashVariantlari(strSavol, 0)
  assert.equal(strNatija.length, 4)
  assert.equal(strNatija.filter((x) => x.togri).length, 1)
  assert.equal(strNatija.find((x) => x.togri)?.matn, '16')

  const indeksToplam = new Set()
  for (let i = 0; i < 20; i++) {
    const res = takrorlashVariantlari(
      {
        savol: `Takrorlash savoli #${i}: Valentlik va massa nisbati`,
        variantlar: [
          { matn: 'Togri javob', togri: true },
          { matn: 'Xato 1', togri: false },
          { matn: 'Xato 2', togri: false },
          { matn: 'Xato 3', togri: false },
        ],
      },
      0
    )
    indeksToplam.add(res.findIndex((x) => x.togri))
  }
  assert.deepEqual([...indeksToplam].sort((a, b) => a - b), [0, 1, 2, 3])
})

test('indekslanganVariantlarniAralashtir — togri indeksni saqlaydi', () => {
  const savol = {
    savol: 'H2O molekulasida nechta vodorod atomi bor?',
    variantlar: ['1 ta', '2 ta', '3 ta', '4 ta'],
    togri: 1,
  }
  const orinlar = new Set()
  for (let raund = 0; raund < 12; raund++) {
    const natija = indekslanganVariantlarniAralashtir(savol, raund)
    assert.equal(natija.variantlar.length, 4)
    assert.equal(natija.variantlar[natija.togri], '2 ta')
    orinlar.add(natija.togri)
  }
  assert.ok(orinlar.size > 1)

  const javobBilan = indekslanganVariantlarniAralashtir(
    {
      vazifa: 'Kumush metallning belgisi qaysi?',
      variantlar: ['Au', 'Cu', 'Ag', 'Fe'],
      javob: 2,
    },
    3
  )
  assert.equal(javobBilan.variantlar[javobBilan.togri], 'Ag')

  const bosh = indekslanganVariantlarniAralashtir({ savol: 'Bosh', variantlar: [] }, 0)
  assert.deepEqual(bosh, { variantlar: [], togri: 0 })
})
