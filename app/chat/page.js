import Korinish from './korinish'

/**
 * SHAXSIY CHAT — alohida bo'lim.
 *
 * NEGA KABINETDAN CHIQARILDI. Chat `/profil/chat` da edi, ya'ni kabinet
 * ichida: yon menyu (272px) va kabinet sarlavhasi (64px) doim ekranda
 * turardi, yozishmaga esa balandlikning yarmi qolardi. Ranglari ham
 * kabinetniki edi — binafsha-slate, qattiq yozilgan, fon almashtirishga
 * bo'ysunmaydigan. Natijada sahifa "kabinetning bir bo'limi" bo'lib
 * ko'rinardi, yozishma joyi emas.
 *
 * Endi u butun ekranni oladi va ranglarni `--v3-*` dan oladi — ya'ni
 * bosh menyu bilan bir tizimda va to'rt fonda ham ishlaydi.
 *
 * Eski manzil `next.config.mjs` da doimiy yo'naltirilgan: bazadagi eski
 * bildirishnomalarda `/profil/chat?suhbat=...` havolasi MATN sifatida
 * saqlangan va ularni qayta yozib bo'lmaydi.
 */

export const metadata = {
  title: 'Xabarlar',
  description: "JDA KIMYO — do'stlar bilan shaxsiy yozishma.",
  // Shaxsiy sahifa: indekslanmaydi. Sitemap ro'yxatiga ham tushmaydi —
  // `scripts/gen-sitemap-royxat.js` dagi YOPIQ_BOLIMLAR ga 'chat'
  // qo'shilgan.
  robots: { index: false, follow: false },
}

export default function ChatSahifasi() {
  return <Korinish />
}
