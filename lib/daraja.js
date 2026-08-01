// lib/daraja.js
//
// Akkaunt darajasi — yulduzlardan hisoblanadi.
//
// Nega bazada saqlanmaydi: daraja `stars` ning hosilasi, ya'ni ikkinchi
// nusxa. Ikki joyda saqlansa ular bir-biridan uzilib qoladi (yulduz
// qo'shildi, daraja yangilanmay qoldi). Shuning uchun har safar hisoblanadi.
//
// `User.level_points` maydoni bazada bor, lekin uni hech qayer yangilamaydi
// va u doim 1 bo'lib turadi — eski, tugatilmagan urinish qoldig'i.

/** Berilgan darajaga chiqish uchun kerak bo'ladigan yulduz soni */
export function darajaUchunYulduz(daraja) {
  if (daraja <= 1) return 0
  return (daraja - 1) ** 2
}

/**
 * Yulduzdan daraja: 0→1, 1→2, 4→3, 9→4, 16→5 ...
 *
 * Kvadrat o'sish tanlandi: boshida daraja tez ko'tariladi (yangi
 * foydalanuvchi darhol siljish ko'radi), keyin sekinlashadi, lekin
 * hech qachon to'xtamaydi.
 */
export function daraja(yulduz) {
  const y = Number(yulduz)
  if (!Number.isFinite(y) || y <= 0) return 1
  return Math.floor(Math.sqrt(y)) + 1
}

/**
 * Daraja va keyingi darajagacha bo'lgan progress.
 * @returns {{daraja: number, joriy: number, kerak: number, foiz: number}}
 *          joriy/kerak — shu daraja ichidagi yulduz, progress chizig'i uchun.
 */
export function darajaHolati(yulduz) {
  const y = Math.max(0, Number(yulduz) || 0)
  const d = daraja(y)

  const shuDaraja = darajaUchunYulduz(d)
  const keyingiDaraja = darajaUchunYulduz(d + 1)

  const joriy = y - shuDaraja
  const kerak = keyingiDaraja - shuDaraja

  return {
    daraja: d,
    joriy,
    kerak,
    foiz: kerak > 0 ? Math.min(100, Math.round((joriy / kerak) * 100)) : 0,
  }
}
