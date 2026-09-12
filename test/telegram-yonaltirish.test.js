const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const esmRequire = require('../scripts/_esm-require')

const { guruhAiChaqirildimi } = esmRequire(
  'lib/telegram-yonaltirish.js',
  ['guruhAiChaqirildimi'],
)

describe('Telegram guruhidagi AI chaqiruvi', () => {
  test('aniq @teg AI ni chaqiradi', () => {
    assert.equal(guruhAiChaqirildimi('@jdakimyouzbot masalani yech', 'jdakimyouzbot'), true)
    assert.equal(guruhAiChaqirildimi('Salom, @JDAKIMYOUZBOT!', 'jdakimyouzbot'), true)
  })

  test('reply va /ai o\'zicha AI ni chaqirmaydi', () => {
    assert.equal(guruhAiChaqirildimi('javobni tushuntiring', 'jdakimyouzbot'), false)
    assert.equal(guruhAiChaqirildimi('/ai masalani yech', 'jdakimyouzbot'), false)
  })

  test('oddiy nom va o\'xshash username qabul qilinmaydi', () => {
    assert.equal(guruhAiChaqirildimi('jdakimyouzbot yordam ber', 'jdakimyouzbot'), false)
    assert.equal(guruhAiChaqirildimi('@jdakimyouzbot_fake yordam ber', 'jdakimyouzbot'), false)
  })
})
