// components/PremiumProfil.jsx
//
// Tasdiqlangan hisobning profil ko'rinishi.
//
// NEGA KERAK. Tasdiq belgisi kelajakda pullik obuna bilan beriladi. Kichik
// belgi buni ifodalash uchun yetarli emas: odam pul to'lagach, farqni
// UZOQDAN ko'rish kerak — profilga kirgan boshqa odam ham darrov sezsin.
//
// USLUB QANDAY TANLANDI. Sayt ranglari binafsha-ko'k; premium shu
// palitradan CHIQIB ketmasligi, lekin undan yorqinroq bo'lishi kerak.
// Shuning uchun uch qatlam:
//   1. Aurora — sekin siljiydigan ko'p rangli dog'lar (fon)
//   2. Halqa   — avatar atrofidagi gradient chegara
//   3. Yorliq  — "Tasdiqlangan" yozuvi
//
// Animatsiyalar `prefers-reduced-motion` da o'chadi (globals.css).
// Sayt bo'ylab tezlik sozlamasi ham bor — interfeys sozlamalariga qarang.

/**
 * Profil sarlavhasi ortidagi jonli fon.
 * Ota-element `relative overflow-hidden` bo'lishi kerak.
 */
export function PremiumAurora({ korinsinmi, uslub }) {
  if (!korinsinmi) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${uslubSinfi(uslub)}`}
    >
      {/* Uchta dog' har xil tezlikda suzadi — takrorlanish sezilmasin */}
      <div className="jda-premium-dog jda-premium-dog-1" />
      <div className="jda-premium-dog jda-premium-dog-2" />
      <div className="jda-premium-dog jda-premium-dog-3" />
      {/* Yuqoridan pastga xiralashtiruvchi parda: matn o'qilishi
          dog'lar qayerda turishidan qat'i nazar buzilmasin */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950/70" />
      {/* Sekin o'tadigan yaltiroq chiziq */}
      <div className="jda-premium-shine" />
    </div>
  )
}

/**
 * Avatarni gradient halqa ichiga oladi.
 * Tasdiqlanmagan hisobda bolani o'zgarishsiz qaytaradi.
 */
export function PremiumHalqa({ korinsinmi, children, dumaloq = false, uslub }) {
  if (!korinsinmi) return children

  const shakl = dumaloq ? 'rounded-full' : 'rounded-[1.4rem]'

  // Aylanish ELEMENTGA emas, ichkaridagi gradient qatlamiga beriladi.
  // Avval butun ramka `rotate` bilan aylanardi: dumaloq avatarda bu
  // sezilmasdi, kvadratda esa burchaklar chiqib ketardi. Endi tashqi
  // ramka qimirlamaydi, u faqat aylanayotgan gradientni qirqib turadi.
  return (
    <div
      className={`relative ${shakl} p-[3px] overflow-hidden bg-slate-950 shadow-2xl shadow-black/40 ${uslubSinfi(uslub)}`}
    >
      <span aria-hidden="true" className="jda-premium-halqa" />
      <div className={`relative ${shakl} overflow-hidden bg-slate-950`}>{children}</div>
    </div>
  )
}

/** "Tasdiqlangan" yorlig'i — belgi yonida matn bilan tushuntiradi. */
export function PremiumYorliq({ korinsinmi, matn = 'Tasdiqlangan', uslub }) {
  if (!korinsinmi) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold jda-premium-yorliq ${uslubSinfi(uslub)}`}
    >
      <span className="text-xs">✦</span>
      {matn}
    </span>
  )
}

/**
 * Uslub kalitini CSS sinfiga aylantiradi.
 *
 * Sinf nomi TO'LIQ yoziladi (`jda-uslub-guluzor`), `jda-uslub-${kalit}`
 * kabi yig'ilmaydi — bu oddiy CSS bo'lgani uchun Tailwind muammosi yo'q,
 * lekin noma'lum kalit kelganda mavjud bo'lmagan sinf qo'yilishidan
 * saqlaydi.
 */
function uslubSinfi(uslub) {
  const sinflar = {
    kosmik: 'jda-uslub-kosmik',
    guluzor: 'jda-uslub-guluzor',
    oltin: 'jda-uslub-oltin',
    zumrad: 'jda-uslub-zumrad',
    tungi: 'jda-uslub-tungi',
  }
  return sinflar[uslub] || sinflar.kosmik
}
