// test/auth-tekshiruv.test.js
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  USERNAME_PATTERN,
  emailniTekshir,
  xavfsizQaytishManzili,
  nextAuthYonaltirishManzili,
  authXatoMatni,
  xavfsizJwtAvatar,
  sessiyaYaroqliPayload,
  loginFormQiymatlari,
  registerMaydonNormallashtir,
} from '../lib/auth-tekshiruv.js'

describe('Auth yordamchi tekshiruvlari', () => {
  test('xavfsizQaytishManzili tashqi manzil va login halqasini rad etadi', () => {
    assert.equal(xavfsizQaytishManzili('https://evil.com/steal'), '/profil')
    assert.equal(xavfsizQaytishManzili('//evil.com'), '/profil')
    assert.equal(xavfsizQaytishManzili('javascript:alert(1)'), '/profil')
    assert.equal(xavfsizQaytishManzili('/login'), '/profil')
    assert.equal(xavfsizQaytishManzili('/register?x=1'), '/profil')
    assert.equal(xavfsizQaytishManzili('/api/auth/callback/google'), '/profil')
    assert.equal(xavfsizQaytishManzili('/profil/dostlar?tab=1'), '/profil/dostlar?tab=1')
    assert.equal(xavfsizQaytishManzili('/doska/auth/abc'), '/doska/auth/abc')
  })

  test('nextAuthYonaltirishManzili asosiy domenga mos ishlaydi', () => {
    assert.equal(
      nextAuthYonaltirishManzili('/', 'https://www.jdakimyo.uz'),
      'https://www.jdakimyo.uz/'
    )
    assert.equal(
      nextAuthYonaltirishManzili('https://www.jdakimyo.uz/login', 'https://www.jdakimyo.uz'),
      'https://www.jdakimyo.uz/profil'
    )
    assert.equal(
      nextAuthYonaltirishManzili('https://boshqa.uz/test', 'https://www.jdakimyo.uz'),
      'https://www.jdakimyo.uz/profil'
    )
  })

  test('authXatoMatni NextAuth kodlarini va texnik xatolarni o\'zbekchaga o\'giradi', () => {
    assert.match(authXatoMatni('AccessDenied'), /rad etildi/)
    assert.match(authXatoMatni('HisobBloklangan'), /bloklangan/)
    assert.match(authXatoMatni('TasdiqlanmaganGoogleEmail'), /tasdiqlanmagan/)
    assert.match(authXatoMatni('CredentialsSignin'), /Login yoki parol/)
    assert.match(authXatoMatni('Configuration'), /sozlamalarida/)
    assert.equal(authXatoMatni('Bu username band'), 'Bu username band')
    assert.equal(authXatoMatni('PrismaClientKnownRequestError P2002'), 'Kirishda kutilmagan xatolik yuz berdi.')
  })

  test('emailniTekshir va USERNAME_PATTERN to\'g\'ri ishlaydi', () => {
    assert.equal(emailniTekshir('ali@gmail.com').ok, true)
    assert.equal(emailniTekshir('not-email').ok, false)
    assert.equal(emailniTekshir('test@yopmail.com').ok, false)
    assert.equal(USERNAME_PATTERN.test('ali_01.u'), true)
    assert.equal(USERNAME_PATTERN.test('Ali@mail'), false)
    assert.equal(USERNAME_PATTERN.test('ab'), false)
  })

  test('xavfsizJwtAvatar base64 va haddan ortiq uzun rasmni tokenga qo\'ymaydi', () => {
    assert.equal(xavfsizJwtAvatar('https://lh3.googleusercontent.com/a/abc'), 'https://lh3.googleusercontent.com/a/abc')
    assert.equal(xavfsizJwtAvatar('data:image/png;base64,AAA'), null)
    assert.equal(xavfsizJwtAvatar('https://x.uz/' + 'a'.repeat(600)), null)
    assert.equal(xavfsizJwtAvatar(''), null)
  })

  test('sessiyaYaroqliPayload bo\'sh token va muddati o\'tgan doskani rad etadi', () => {
    assert.equal(sessiyaYaroqliPayload(null), false)
    assert.equal(sessiyaYaroqliPayload({}), false)
    assert.equal(sessiyaYaroqliPayload({ sub: 'u1', doskaTugaydi: 1000 }, 2000), false)
    assert.equal(sessiyaYaroqliPayload({ sub: 'u1', doskaTugaydi: 5000 }, 2000), true)
    assert.equal(sessiyaYaroqliPayload({ sub: 'u1' }, 2000), true)
  })

  test('loginFormQiymatlari autofill qilingan DOM qiymatlarini oladi', () => {
    const dom = new Map([
      ['login', ' diyorbek@gmail.com '],
      ['password', 'SirliParol123'],
    ])
    assert.deepEqual(loginFormQiymatlari({ login: '', password: '' }, dom), {
      login: 'diyorbek@gmail.com',
      password: 'SirliParol123',
    })
    assert.deepEqual(loginFormQiymatlari({ login: 'ali_j', password: 'abc' }, null), {
      login: 'ali_j',
      password: 'abc',
    })
  })

  test('registerMaydonNormallashtir username va emailni to\'g\'ri normallashtiradi', () => {
    assert.equal(registerMaydonNormallashtir('username', ' DiyorBek_J '), 'diyorbek_j')
    assert.equal(registerMaydonNormallashtir('email', ' Ali@Gmail.com '), 'Ali@Gmail.com')
    assert.equal(registerMaydonNormallashtir('fullName', 'Ali Valiyev'), 'Ali Valiyev')
  })
})
