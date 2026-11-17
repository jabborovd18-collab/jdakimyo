// test/maktab-animatsiya.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
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

function jsFayllarniYig(papka) {
  const natija = []
  for (const kirish of fs.readdirSync(papka, { withFileTypes: true })) {
    const manzil = path.join(papka, kirish.name)
    if (kirish.isDirectory()) natija.push(...jsFayllarniYig(manzil))
    else if (/\.(js|jsx)$/.test(kirish.name)) natija.push(manzil)
  }
  return natija
}

test("app/ va components/ dagi barcha Ikon kalitlari components/Ikon.jsx da mavjud", () => {
  const ikonManba = fs.readFileSync('components/Ikon.jsx', 'utf8')
  const yollarStart = ikonManba.indexOf('const YOLLAR = {')
  const yollarEnd = ikonManba.indexOf('\n}', yollarStart)
  assert.ok(yollarStart !== -1 && yollarEnd !== -1, 'components/Ikon.jsx ichida YOLLAR topilmadi')

  const mavjudKalitlar = new Set(
    [...ikonManba.slice(yollarStart, yollarEnd).matchAll(/^\s*(?:'([^']+)'|"([^"]+)"|([a-zA-Z0-9_]+))\s*:/gm)]
      .map((m) => m[1] || m[2] || m[3]),
  )

  for (const zarur of ['yangilash', 'shamol', 'tajriba', 'hisob', 'jadval', 'tarozi']) {
    assert.ok(mavjudKalitlar.has(zarur), `YOLLAR da '${zarur}' kaliti bo'lishi shart`)
  }

  const tekshiriladiganFayllar = [...jsFayllarniYig('app'), ...jsFayllarniYig('components')]
  const xatolar = []

  for (const fayl of tekshiriladiganFayllar) {
    const matn = fs.readFileSync(fayl, 'utf8')
    const normFayl = fayl.replace(/\\/g, '/')
    const maktabFaylmi = normFayl.startsWith('components/maktab/')
    const ikonImportBormi = /(?:from|import)\s+['"][^'"]*Ikon(?:\.jsx?)?['"]/.test(matn)
    if (!ikonImportBormi && !maktabFaylmi) continue

    for (const m of matn.matchAll(/<Ikon\b[\s\S]*?(?:\/>|>)/g)) {
      const nomMos = /\bnom\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*['"]([^'"]+)['"]\s*\})/.exec(m[0])
      if (!nomMos) continue
      const kalit = nomMos[1] || nomMos[2] || nomMos[3]
      if (!mavjudKalitlar.has(kalit)) {
        const qator = matn.slice(0, m.index).split(/\r?\n/).length
        xatolar.push(`${normFayl}:${qator} -> <Ikon nom="${kalit}" />`)
      }
    }

    if (maktabFaylmi) {
      const qatorlar = matn.split(/\r?\n/)
      qatorlar.forEach((q, idx) => {
        for (const m of q.matchAll(/\bikon\s*:\s*['"]([a-zA-Z0-9_-]+)['"]/g)) {
          const kalit = m[1]
          if (!mavjudKalitlar.has(kalit)) {
            xatolar.push(`${normFayl}:${idx + 1} -> ikon: "${kalit}"`)
          }
        }
      })
    }
  }

  assert.deepEqual(xatolar, [], `Ikon.jsx da topilmagan ikonka kalitlari:\n${xatolar.join('\n')}`)
})

