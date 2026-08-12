// data/laboratoriya/sandiqlar.js
//
// Sandiqlar — mexanikasi klassik (bir bosish, animatsiya, mukofot), lekin
// obyekti kimyoviy. "Xazina sandig'i" laboratoriyada g'alati ko'rinardi va
// bizni boshqa o'yinlardan ajratmasdi.
//
// EHTIMOLLAR OSHKORA. Ular sahifada ko'rsatiladi va shu fayldan olinadi —
// ikkita ro'yxat bo'lsa, ko'rsatilgani bilan haqiqiysi farq qilib qolishi
// mumkin edi. App Store ham tasodifiy tushishni oshkor qilishni talab qiladi.
//
// IQTISOD. Reagent sotish narxi xarid narxining 40% i, shuning uchun
// sandiqdan chiqqanini sotib foyda ko'rib bo'lmaydi. Posilka narxi esa
// ichidagining o'rtacha xarid qiymatidan bir oz past — sandiq ochish
// to'g'ridan-to'g'ri sotib olishdan biroz foydali, lekin "sotib olib qayta
// sotish" aylanmasi baribir zarar keltiradi.

const SANDIQLAR = [
  {
    kalit: 'posilka',
    nom: 'Reaktiv posilkasi',
    icon: '📦',
    tavsif:
      'Ta\'minotchidan kelgan oddiy quti. Ichida kundalik ishda ketadigan ' +
      'reagentlar — ko\'pi oddiy, ba\'zan qimmatrog\'i ham tushadi.',
    narx: { coins: 20 },
    buyumSoni: 3,
    ehtimollar: { oddiy: 65, kam: 28, nodir: 7, noyob: 0 },
  },
  {
    kalit: 'kunlik',
    nom: 'Kunlik yetkazib berish',
    icon: '🚚',
    tavsif:
      'Har kuni bir marta bepul keladi. Oddiy posilkadan yaxshiroq: ' +
      'nodir reagent tushish ehtimoli sezilarli, hatto noyobi ham chiqishi mumkin.',
    narx: null, // bepul
    kunlik: true,
    buyumSoni: 3,
    ehtimollar: { oddiy: 50, kam: 30, nodir: 15, noyob: 5 },
  },
  {
    kalit: 'ruda',
    nom: 'Ruda namunasi',
    icon: '🪨',
    tavsif:
      'Qayta ishlanmagan mineral namuna. Uni ochish — aslida ajratib olish: ' +
      'ezish, eritish, cho\'ktirish. Eng qimmat reagentlar shu yerdan chiqadi.',
    narx: { gems: 10 },
    buyumSoni: 4,
    ehtimollar: { oddiy: 20, kam: 35, nodir: 35, noyob: 10 },
  },
]

module.exports = SANDIQLAR
export default SANDIQLAR
