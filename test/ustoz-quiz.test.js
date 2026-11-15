// Variantlar aralashtirilganda ko'ringan indeks emas, token xaritasidagi asl
// indeks baholanishini hamda ustoz paneli kirish huquqlari va baholash
// chegaralarini tekshiradi.
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const {
  ustozQuizJavoblariniBahola,
  ustozQuizMeta,
  ustozQuizKirishTekshir,
  yopiqQuizKirishTekshir,
  bahoTekshir,
} = esmRequire(
  'lib/ustoz-quiz.js',
  [
    'ustozQuizJavoblariniBahola',
    'ustozQuizMeta',
    'ustozQuizKirishTekshir',
    'yopiqQuizKirishTekshir',
    'bahoTekshir',
  ],
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

describe('ustozQuizKirishTekshir — guruh chegarasi va maxfiy kod himoyasi', () => {
  test("boshqa guruh talabasi maxsus guruhga biriktirilgan yopiq testga kira olmaydi", () => {
    const quiz = {
      id: 'quiz-b',
      teacherId: 'ustoz-1',
      groupId: 'guruh-B',
      isPublic: false,
      isDraft: false,
      accessCode: null,
    }

    // Talaba shu ustozning 'guruh-A' guruhida o'qiydi, lekin 'guruh-B' da emas
    const ruxsat = ustozQuizKirishTekshir(quiz, {
      userId: 'talaba-1',
      activeGroupIds: ['guruh-A'],
      activeTeacherIds: ['ustoz-1'],
      codeValid: false,
    })

    assert.equal(ruxsat.bor, false)
    assert.equal(ruxsat.needCode, false)
  })

  test("shu guruhning faol talabasi guruh testiga kira oladi", () => {
    const quiz = {
      id: 'quiz-b',
      teacherId: 'ustoz-1',
      groupId: 'guruh-B',
      isPublic: false,
      isDraft: false,
      accessCode: null,
    }

    const ruxsat = ustozQuizKirishTekshir(quiz, {
      userId: 'talaba-2',
      activeGroupIds: ['guruh-B'],
      activeTeacherIds: ['ustoz-1'],
      codeValid: false,
    })

    assert.equal(ruxsat.bor, true)
    assert.equal(ruxsat.sabab, 'Guruh talabasi')
  })

  test("maxfiy kod o'rnatilgan ommaviy yoki guruhli test kod kiritilmaguncha ochilmaydi", () => {
    const quiz = {
      id: 'quiz-coded',
      teacherId: 'ustoz-1',
      groupId: null,
      isPublic: true,
      isDraft: false,
      accessCode: 'KIMYO2026',
    }

    const kodsiz = ustozQuizKirishTekshir(quiz, {
      userId: 'talaba-1',
      activeGroupIds: [],
      activeTeacherIds: [],
      codeValid: false,
    })
    assert.equal(kodsiz.bor, false)
    assert.equal(kodsiz.needCode, true)

    const kodBilan = ustozQuizKirishTekshir(quiz, {
      userId: 'talaba-1',
      activeGroupIds: [],
      activeTeacherIds: [],
      codeValid: true,
    })
    assert.equal(kodBilan.bor, true)
    assert.equal(kodBilan.sabab, 'Maxfiy kod orqali')
  })

  test("ustoz o'z testiga qoralama yoki kodli bo'lsa ham doim kira oladi", () => {
    const quiz = {
      id: 'quiz-draft',
      teacherId: 'ustoz-1',
      groupId: 'guruh-B',
      isPublic: false,
      isDraft: true,
      accessCode: 'SECRET',
    }

    const ruxsat = ustozQuizKirishTekshir(quiz, {
      userId: 'ustoz-1',
      activeGroupIds: [],
      activeTeacherIds: [],
      codeValid: false,
    })
    assert.equal(ruxsat.bor, true)
  })
})

describe('yopiqQuizKirishTekshir — yozma imtihon guruh izolyatsiyasi', () => {
  test("guruhga biriktirilgan yozma imtihonga begona guruh talabasi kira olmaydi", () => {
    const quiz = {
      id: 'yopiq-1',
      teacherId: 'ustoz-1',
      groupId: 'guruh-B',
      isDraft: false,
    }

    const begonaGuruh = yopiqQuizKirishTekshir(quiz, {
      userId: 'talaba-1',
      activeGroupIds: ['guruh-A'],
      activeTeacherIds: ['ustoz-1'],
    })
    assert.equal(begonaGuruh.bor, false)

    const ozGuruhi = yopiqQuizKirishTekshir(quiz, {
      userId: 'talaba-2',
      activeGroupIds: ['guruh-B'],
      activeTeacherIds: ['ustoz-1'],
    })
    assert.equal(ozGuruhi.bor, true)
  })
})

describe('bahoTekshir — baholash chegarasi', () => {
  test("maksimal balldan yuqori yoki manfiy ballni rad etadi", () => {
    assert.equal(bahoTekshir(-5, 50).valid, false)
    assert.equal(bahoTekshir(55, 50).valid, false)
    assert.equal(bahoTekshir('', 50).valid, false)
    assert.equal(bahoTekshir('abc', 50).valid, false)

    const ok = bahoTekshir('45', 50)
    assert.equal(ok.valid, true)
    assert.equal(ok.score, 45)
  })
})
