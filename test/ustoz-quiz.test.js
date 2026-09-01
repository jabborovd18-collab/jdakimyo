// Variantlar aralashtirilganda ko'ringan indeks emas, token xaritasidagi asl
// indeks baholanishini tekshiradi.
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const { ustozQuizJavoblariniBahola, ustozQuizMeta } = esmRequire(
  'lib/ustoz-quiz.js',
  ['ustozQuizJavoblariniBahola', 'ustozQuizMeta'],
)

describe('ustozQuizJavoblariniBahola', () => {
  const questions = [{
    id: 'q1',
    questionText: 'To\'g\'ri variant qaysi?',
    options: { texts: ['asl-A', 'asl-B', 'asl-C', 'asl-D'] },
    correctAnswer: 1,
    explanation: 'Asl B',
    points: 3,
  }]

  test("aralashtirilgan variantning ko'ringan indeksini to'g'ri baholaydi", () => {
    // Ko'rinish: D, B, A, C. To'g'ri B ekranda 1-indeksda turibdi.
    const result = ustozQuizJavoblariniBahola(
      questions,
      [{ questionId: 'q1', selected: 1 }],
      ['q1'],
      { q1: [3, 1, 0, 2] },
    )

    assert.equal(result.score, 3)
    assert.equal(result.maxScore, 3)
    assert.equal(result.results[0].correctAnswer, 1)
    assert.equal(result.normalizedAnswers[0].selected, 1)
    assert.deepEqual(result.results[0].options, ['asl-D', 'asl-B', 'asl-A', 'asl-C'])
  })

  test("xarita bo'lmasa yoki variant takrorlansa rad etadi", () => {
    assert.throws(
      () => ustozQuizJavoblariniBahola(
        questions,
        [{ questionId: 'q1', selected: 0 }],
        ['q1'],
        { q1: [0, 0, 2, 3] },
      ),
      /xaritasi yaroqsiz/,
    )
  })
})
describe('ustozQuizMeta', () => {
  test("description JSON ichidagi ko'rsatish sozlamalarini o'qiydi", () => {
    const meta = ustozQuizMeta(JSON.stringify({
      originalDescription: 'Sinov',
      shuffleOptions: false,
      showCorrectAnswers: false,
      allowReview: false,
    }))
    assert.deepEqual(meta, {
      originalDescription: 'Sinov',
      shuffleOptions: false,
      showCorrectAnswers: false,
      allowReview: false,
    })
  })
})
