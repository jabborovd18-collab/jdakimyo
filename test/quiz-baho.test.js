// Quiz balli faqat server olgan savollar va tanlovlardan hisoblanishini
// tekshiradi. Mijoz yuborgan tayyor score bu modulga umuman kirmaydi.
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const { quizJavoblariniBahola } = esmRequire(
  'lib/quiz-baho.js',
  ['quizJavoblariniBahola'],
)

const questions = [
  {
    id: 'q1',
    category: 'nomlanishi',
    options: ['A', 'B', 'C', 'D'],
    correct: 1,
    explanation: 'B to\'g\'ri',
  },
  {
    id: 'q2',
    category: 'nomlanishi',
    options: { texts: ['W', 'X', 'Y', 'Z'] },
    correct: 3,
    explanation: null,
  },
]

describe('quizJavoblariniBahola', () => {
  test("ballni bazadagi correct bilan o'zi hisoblaydi", () => {
    const result = quizJavoblariniBahola(
      questions,
      [
        { questionId: 'q1', selected: 1 },
        { questionId: 'q2', selected: 0 },
      ],
      ['q1', 'q2'],
    )

    assert.equal(result.score, 1)
    assert.equal(result.totalQuestions, 2)
    assert.equal(result.percentage, 50)
    assert.equal(result.results[0].isCorrect, true)
    assert.equal(result.results[1].correctAnswer, 3)
  })

  test("bitta savolni ikki marta yuborishni rad etadi", () => {
    assert.throws(
      () => quizJavoblariniBahola(
        questions,
        [
          { questionId: 'q1', selected: 1 },
          { questionId: 'q1', selected: 1 },
        ],
        ['q1', 'q2'],
      ),
      /takroriy/,
    )
  })

  test("urinishdagi savolni almashtirishni rad etadi", () => {
    assert.throws(
      () => quizJavoblariniBahola(
        questions,
        [
          { questionId: 'q1', selected: 1 },
          { questionId: 'begona', selected: 0 },
        ],
        ['q1', 'q2'],
      ),
      /mos emas/,
    )
  })

  test("variant chegarasidan tashqaridagi tanlovni rad etadi", () => {
    assert.throws(
      () => quizJavoblariniBahola(
        questions,
        [
          { questionId: 'q1', selected: 9 },
          { questionId: 'q2', selected: 3 },
        ],
        ['q1', 'q2'],
      ),
      /variant noto'g'ri/,
    )
  })
})
