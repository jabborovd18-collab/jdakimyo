// scripts/indexnow.js
//
// INDEXNOW — yangi va o'zgargan sahifalarni Bing indeksiga xabar qiladi.
//
// NEGA KERAK. Google saytni o'zi kelib so'raydi va yangi domenga kam
// byudjet beradi: 2026-08-22 holatiga 101 sahifa "topilgan, lekin
// indekslanmagan" bo'lib turardi. IndexNow teskari ishlaydi — sayt
// o'zi "mana bu manzillar o'zgardi" deb aytadi va Bing ularni odatda
// bir necha soatda oladi.
//
// NEGA AYNAN BING. ChatGPT Search javob uchun manba tanlaganda Bing
// indeksiga ham qaraydi. Ya'ni bu skript sun'iy intellekt qidiruvida
// ko'rinish uchun Google Search Console'dan tezroq ta'sir beradi.
// Yandex ham shu protokolni qo'llaydi; Google qo'llamaydi.
//
// KALIT QAYERDA. `public/<kalit>.txt` — fayl nomi kalitning O'ZI,
// ichida ham xuddi shu satr turadi. IndexNow egalikni shu bilan
// tekshiradi: kalit faylni qo'ya oladigan odam saytga ega demakdir.
// Kalit shu yerda TAKRORLANMAYDI — skript uni fayl nomidan o'qiydi
// (AGENTS.md 1-band). Fayl o'chsa, skript ishlamaydi va buni aytadi.
//
// ISHLATISH:
//   node scripts/indexnow.js            # sitemapdagi hamma manzil
//   node scripts/indexnow.js /jda-kimyo /ishlashi   # faqat sanalganlar
//
// Sahifa o'zgarganda qayta yuborish mumkin — takroriy yuborish jazoga
// olib kelmaydi, lekin o'zgarmagan sahifani har kuni yuborish signalni
// qadrsizlantiradi. Yangi yoki rostdan yangilangan manzil yuboriladi.

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SAYT = 'https://www.jdakimyo.uz'
const HOST = 'www.jdakimyo.uz'

/** Kalitni `public/` dagi fayl nomidan topadi. */
function kalitniTop() {
  const papka = path.join(ROOT, 'public')
  const nom = fs
    .readdirSync(papka)
    .find((f) => /^[a-f0-9]{16,128}\.txt$/.test(f))

  if (!nom) {
    throw new Error(
      "IndexNow kaliti topilmadi: public/ ichida <kalit>.txt fayli yo'q.",
    )
  }

  const kalit = nom.replace(/\.txt$/, '')
  const ichi = fs.readFileSync(path.join(papka, nom), 'utf8').trim()

  // Fayl nomi va ichidagi satr bir xil bo'lishi SHART — aks holda
  // IndexNow egalikni tasdiqlamaydi va hamma so'rov 403 bo'ladi.
  if (ichi !== kalit) {
    throw new Error(
      `Kalit fayli buzuq: nomi "${kalit}", ichida "${ichi}". Ular bir xil bo'lishi kerak.`,
    )
  }

  return kalit
}

/** Jonli sitemapdan manzillarni oladi — ro'yxatning yagona manbai o'sha. */
async function sitemapdanOl() {
  const javob = await fetch(`${SAYT}/sitemap.xml`)
  if (!javob.ok) throw new Error(`sitemap.xml ${javob.status} qaytardi`)

  const xml = await javob.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function main() {
  const kalit = kalitniTop()
  const argv = process.argv.slice(2)

  const manzillar = argv.length
    ? argv.map((y) => (y.startsWith('http') ? y : `${SAYT}${y}`))
    : await sitemapdanOl()

  if (!manzillar.length) {
    console.log("Yuboriladigan manzil yo'q.")
    return
  }

  console.log(`IndexNow: ${manzillar.length} ta manzil yuborilmoqda...`)

  const javob = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: kalit,
      keyLocation: `${SAYT}/${kalit}.txt`,
      urlList: manzillar,
    }),
  })

  // IndexNow 200 va 202 ni ikkalasini ham "qabul qilindi" deb beradi:
  // 202 — kalit hali tekshirilmoqda. 403 — kalit fayli topilmadi
  // (deploy qilinmagan bo'lishi mumkin), 422 — manzil host'ga mos emas.
  const matn = await javob.text()
  console.log(`Javob: ${javob.status} ${javob.statusText}`)
  if (matn.trim()) console.log(matn.trim())

  if (javob.status === 403) {
    console.log(
      `\nKalit fayli ochilmayapti. Tekshiring: ${SAYT}/${kalit}.txt`,
    )
  }

  process.exitCode = javob.ok ? 0 : 1
}

main().catch((e) => {
  console.error('IndexNow xatosi:', e.message)
  process.exitCode = 1
})
