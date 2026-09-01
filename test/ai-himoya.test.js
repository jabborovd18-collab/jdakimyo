const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const { AiKeshManager } = esmRequire(
  'lib/ai-agents/ai-cache.js',
  ['AiKeshManager'],
)
const { aiKunlikLimit } = esmRequire(
  'lib/ai-agents/ai-quota-qoida.js',
  ['aiKunlikLimit'],
)
const { aiYonalishniAniqlash, masalaTuriniAniqlash } = esmRequire(
  'lib/ai-agents/ai-yonalish.js',
  ['aiYonalishniAniqlash', 'masalaTuriniAniqlash'],
)
const { aiModelChaqir, AiGatewayXatosi } = esmRequire(
  'lib/ai-agents/ai-gateway.js',
  ['aiModelChaqir', 'AiGatewayXatosi'],
)
const { latexniOddiyMatnga } = esmRequire(
  'lib/latex-oddiy-matn.js',
  ['latexniOddiyMatnga'],
)
const { pdfVizualniTayyorla } = esmRequire(
  'lib/masala-pdf-vizual.js',
  ['pdfVizualniTayyorla'],
)

describe('AI kesh kaliti', () => {
  const kesh = new AiKeshManager()

  test("bir xil savol ikki foydalanuvchi orasida keshni bo'lishmaydi", () => {
    const a = kesh.kalitYarat({ matn: 'Suv nima?', foydalanuvchiId: 'user-a' })
    const b = kesh.kalitYarat({ matn: 'Suv nima?', foydalanuvchiId: 'user-b' })
    assert.notEqual(a, b)
  })

  test("dastlabki 10 000 belgisi bir xil ikki rasm endi to'qnashmaydi", () => {
    const bosh = 'x'.repeat(10_000)
    const a = kesh.kalitYarat({ rasm: `${bosh}A`, foydalanuvchiId: 'u1' })
    const b = kesh.kalitYarat({ rasm: `${bosh}B`, foydalanuvchiId: 'u1' })
    assert.notEqual(a, b)
  })

  test("bir rasmga berilgan ikki xil ko'rsatma ikki kalit beradi", () => {
    const a = kesh.kalitYarat({ rasm: 'data:image/png;base64,abc', matn: '1-masala', foydalanuvchiId: 'u1' })
    const b = kesh.kalitYarat({ rasm: 'data:image/png;base64,abc', matn: '2-masala', foydalanuvchiId: 'u1' })
    assert.notEqual(a, b)
  })

  test("bir savolning tezkor va chuqur javobi bitta keshga tushmaydi", () => {
    const tezkor = kesh.kalitYarat({ matn: 'Mol nima?', ishlashYonalishi: 'tezkor' })
    const murakkab = kesh.kalitYarat({ matn: 'Mol nima?', ishlashYonalishi: 'murakkab' })
    assert.notEqual(tezkor, murakkab)
  })

  test("bir savol turli lokal xotira kontekstida bitta keshga tushmaydi", () => {
    const a = kesh.kalitYarat({
      matn: 'Menga mashq ber',
      foydalanuvchiId: 'u1',
      xotiraKonteksti: { profil: { mavzular: { organik: 2 } } },
    })
    const b = kesh.kalitYarat({
      matn: 'Menga mashq ber',
      foydalanuvchiId: 'u1',
      xotiraKonteksti: { profil: { mavzular: { eritmalar: 5 } } },
    })
    assert.notEqual(a, b)
  })
})

describe("AI yo'nalish tanlovi", () => {
  test("oddiy suhbat tezkor yo'nalishga tushadi", () => {
    const turi = masalaTuriniAniqlash('Mol tushunchasini sodda qilib ayting')
    const yonalish = aiYonalishniAniqlash({ matn: 'Mol tushunchasini sodda qilib ayting', masalaTuri: turi })
    assert.equal(turi, 'suhbat')
    assert.equal(yonalish.id, 'tezkor')
    assert.equal(yonalish.avtomatik, true)
  })

  test("standart hisoblash oddiy yo'nalishga tushadi", () => {
    const matn = '200 g 10% li NaCl eritmasida necha gramm tuz bor?'
    const turi = masalaTuriniAniqlash(matn)
    const yonalish = aiYonalishniAniqlash({ matn, masalaTuri: turi })
    assert.equal(yonalish.id, 'oddiy')
  })

  test("ko'p belgili olimpiada masalasi murakkab yo'nalishga tushadi", () => {
    const matn = "Noma'lum modda zanjirida qotishma tarkibini tenglamalar sistemasi bilan toping"
    const turi = masalaTuriniAniqlash(matn)
    const yonalish = aiYonalishniAniqlash({ matn, masalaTuri: turi })
    assert.equal(yonalish.id, 'murakkab')
  })

  test("foydalanuvchi tanlovi avtomatik qarordan ustun turadi", () => {
    const yonalish = aiYonalishniAniqlash({ matn: 'Salom', tanlov: 'murakkab' })
    assert.equal(yonalish.id, 'murakkab')
    assert.equal(yonalish.avtomatik, false)
  })
})

describe('AI role limiti', () => {
  test("bazadagi kichik harf rollari kerakli limitni oladi", () => {
    assert.equal(aiKunlikLimit('bakalavr'), 25)
    assert.equal(aiKunlikLimit('doktorant'), 60)
    assert.equal(aiKunlikLimit('teacher'), 1000)
    assert.equal(aiKunlikLimit('admin'), 99999)
  })

  test("ikkilamchi ustoz bayrog'i akademik rolni ustoz limitiga ko'taradi", () => {
    assert.equal(aiKunlikLimit('bakalavr', true), 1000)
  })
})

describe('AI gateway urinish chegarasi', () => {
  test('provayderlar xato bersa ham ikki martadan ortiq so\'rov yubormaydi', async () => {
    const eskiFetch = global.fetch
    const eskiWarn = console.warn
    const eskiMuhit = {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    }
    let chaqiriqlar = 0

    try {
      process.env.GROQ_API_KEY = 'sinov-groq'
      process.env.GEMINI_API_KEY = 'sinov-gemini'
      delete process.env.DEEPSEEK_API_KEY
      delete process.env.OPENROUTER_API_KEY
      console.warn = () => {}
      global.fetch = async () => {
        chaqiriqlar += 1
        return {
          ok: false,
          status: 500,
          json: async () => ({ error: { message: 'sinov xatosi' } }),
        }
      }

      await assert.rejects(
        aiModelChaqir('sinov', { yonalish: 'tezkor', jsonRejim: false }),
        (error) => error instanceof AiGatewayXatosi && error.kod === 'BARCHA_URINISH_XATO',
      )
      assert.equal(chaqiriqlar, 2)
    } finally {
      global.fetch = eskiFetch
      console.warn = eskiWarn
      for (const [kalit, qiymat] of Object.entries(eskiMuhit)) {
        if (qiymat === undefined) delete process.env[kalit]
        else process.env[kalit] = qiymat
      }
    }
  })
})

describe('Server PDF formulalari', () => {
  test("reaksiya yo'nalishi LaTeX buyrug'i ichida yo'qolmaydi", () => {
    const matn = latexniOddiyMatnga('NaCl \\rightarrow Na^{+} + Cl^{-}')
    assert.equal(matn, 'NaCl → Na⁺ + Cl⁻')
  })

  test("kasr o'qiladigan matnga aylanadi", () => {
    const matn = latexniOddiyMatnga('n = \\frac{m_{NaCl}}{M_{NaCl}}')
    assert.match(matn, /^n = \(m_\(NaCl\)\) \/ \(M_\(NaCl\)\)$/)
    assert.doesNotMatch(matn, /\\frac|[{}]/)
  })
})

describe('PDF jadval va grafik ma\'lumotlari', () => {
  test('Pearson krestidan avtomatik jadval va grafik tayyorlaydi', () => {
    const vizual = pdfVizualniTayyorla({
      krestSxemasi: {
        mavjud: true,
        w1: 40,
        w2: 10,
        wTarget: 20,
        qism1: 10,
        qism2: 20,
        nisbat: '1 : 2',
      },
    })
    assert.equal(vizual.jadvallar[0].qatorlar.length, 3)
    assert.deepEqual(vizual.grafiklar[0].nuqtalar.map((nuqta) => nuqta.qiymat), [40, 20, 10])
  })

  test('AI vizualini xavfsiz o\'lcham va haqiqiy sonlar bilan cheklaydi', () => {
    const vizual = pdfVizualniTayyorla({
      vizual: {
        jadvallar: [{
          sarlavha: 'Natijalar',
          ustunlar: ['A', 'B', 'C', 'D', 'E', 'ortiqcha'],
          qatorlar: Array.from({ length: 20 }, (_, indeks) => [indeks, 'x', 'y', 'z', 'q']),
        }],
        grafiklar: [{
          turi: 'chiziqli',
          sarlavha: 'Harorat ta\'siri',
          nuqtalar: [
            { nom: '20 C', qiymat: 1 },
            { nom: '30 C', qiymat: 2 },
            { nom: 'xato', qiymat: 'son emas' },
          ],
        }],
      },
    })
    assert.equal(vizual.jadvallar[0].ustunlar.length, 5)
    assert.equal(vizual.jadvallar[0].qatorlar.length, 12)
    assert.equal(vizual.grafiklar[0].turi, 'chiziqli')
    assert.equal(vizual.grafiklar[0].nuqtalar.length, 2)
  })
})
