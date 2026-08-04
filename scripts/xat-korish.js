/**
 * Xat qanday ko'rinishini brauzerda tekshirish uchun.
 *
 * Ishga tushirish: node scripts/xat-korish.js
 * Natija: .xat-namuna.html (git ga tushmaydi)
 *
 * NEGA KERAK. Xatni faqat haqiqiy yuborib ko'rish qimmat: har sinov
 * Resend kvotasini yeydi va ishlab chiqish muhitida kalit umuman yo'q.
 * Maket esa brauzerda ham ko'rinadi — pochta mijozidagi farqlar
 * qoladi, lekin maket buzilgani darrov bilinadi.
 *
 * ISM ATAYLAB ZARARLI YOZILGAN: himoyala() ishlayotganini shu yerda
 * ko'rish mumkin. Chiqqan faylda teg emas, matn ko'rinishi kerak.
 */
const fs = require('fs')
const path = require('path')
const esmRequire = require('./_esm-require')

const { tasdiqXati } = esmRequire('lib/pochta.js', ['tasdiqXati'])

const xat = tasdiqXati({
  ism: 'Diyorbek <img src=x onerror="alert(1)"> Jabborov',
  kod: '482913',
})

const chiqish = path.join(__dirname, '..', '.xat-namuna.html')
fs.writeFileSync(chiqish, xat.html, 'utf8')

console.log('Mavzu:', xat.mavzu)
console.log('HTML:', chiqish)
console.log('')
console.log('--- Oddiy matn ---')
console.log(xat.matn)
