const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const chokma = require('../data/reactions/chokma')
const termik = require('../data/reactions/termik-parchalanish')
const {
  LABORATORIYA_OVOZ_PARAMETRLARI,
  laboratoriyaOvozSozlamasiniTayyorla,
  laboratoriyaFonOvoziniYarat,
} = esmRequire('lib/ovoz.js', [
  'LABORATORIYA_OVOZ_PARAMETRLARI',
  'laboratoriyaOvozSozlamasiniTayyorla',
  'laboratoriyaFonOvoziniYarat',
])

describe('Nano-mexanizm ma\'lumotlari', () => {
  test("cho'ktirish oilasining har bir reaksiyasida oraliq bosqich va vaqt koeffitsienti bor", () => {
    assert.ok(chokma.reaksiyalar.length > 0)
    for (const reaksiya of chokma.reaksiyalar) {
      assert.ok(Array.isArray(reaksiya.intermediates) && reaksiya.intermediates.length > 0, reaksiya.equation)
      assert.ok(reaksiya.rateFactors.some((qator) => qator.factor === 'Nano vaqt koeffitsienti'), reaksiya.equation)
    }
    assert.match(chokma.reaksiyalar[0].intermediates[0].note, /10⁻⁹/)
  })

  test("termik oilasining har bir reaksiyasida bog' uzilishi va nano vaqt bosqichi bor", () => {
    assert.ok(termik.reaksiyalar.length > 0)
    for (const reaksiya of termik.reaksiyalar) {
      assert.ok(Array.isArray(reaksiya.intermediates) && reaksiya.intermediates.length > 0, reaksiya.equation)
      assert.ok(reaksiya.rateFactors.some((qator) => qator.factor === 'Nano vaqt koeffitsienti'), reaksiya.equation)
    }
    assert.match(termik.reaksiyalar[0].intermediates[0].note, /10⁻¹³/)
  })
})

describe('Laboratoriya fon ovozi', () => {
  test("uchta atmosfera kanali xavfsiz standart parametrga ega", () => {
    assert.deepEqual(Object.keys(LABORATORIYA_OVOZ_PARAMETRLARI), ['ventilatsiya', 'spirtovka', 'reaksiya'])
    const sozlama = laboratoriyaOvozSozlamasiniTayyorla()
    assert.equal(sozlama.ventilatsiya.filtrHz, 180)
    assert.equal(sozlama.spirtovka.turi, 'bandpass')
    assert.equal(sozlama.reaksiya.gain, 0.018)
  })

  test("ovoz darajasi va filtr chastotasi eshitish xavfsiz oraliqda cheklanadi", () => {
    const sozlama = laboratoriyaOvozSozlamasiniTayyorla({
      ventilatsiya: { gain: 10, filtrHz: 1 },
      spirtovka: { gain: -1, filtrHz: 99_999 },
    })
    assert.equal(sozlama.ventilatsiya.gain, 0.08)
    assert.equal(sozlama.ventilatsiya.filtrHz, 40)
    assert.equal(sozlama.spirtovka.gain, 0)
    assert.equal(sozlama.spirtovka.filtrHz, 8000)
  })

  test("Web Audio bo'lmagan serverda generator xavfsiz no-op qaytaradi", () => {
    const natija = laboratoriyaFonOvoziniYarat({ kontekst: null })
    assert.equal(natija.mavjud, false)
    assert.equal(natija.boshla(), false)
  })

  test("fon generatori uchta shovqin kanalini boshlaydi, boshqaradi va yopadi", async () => {
    const manbalar = []
    const audio = {
      sampleRate: 8_000,
      state: 'running',
      destination: {},
      createBuffer: () => ({ getChannelData: () => new Float32Array(16) }),
      createBufferSource: () => {
        const manba = { connect: () => {}, start: () => { manba.boshlandi = true }, stop: () => { manba.toxtadi = true } }
        manbalar.push(manba)
        return manba
      },
      createBiquadFilter: () => ({ connect: () => {}, frequency: { value: 0 }, type: null }),
      createGain: () => ({ connect: () => {}, gain: { value: 0 } }),
      close: async () => { audio.state = 'closed' },
    }
    const natija = laboratoriyaFonOvoziniYarat({ kontekst: audio })
    assert.equal(natija.mavjud, true)
    await natija.boshla()
    assert.equal(manbalar.filter((manba) => manba.boshlandi).length, 3)
    assert.equal(natija.darajaniOzgartir('reaksiya', 1), true)
    assert.equal(natija.darajaniOzgartir('noma\'lum', 0.01), false)
    await natija.toxta()
    assert.equal(manbalar.filter((manba) => manba.toxtadi).length, 3)
    assert.equal(audio.state, 'closed')
  })
})
