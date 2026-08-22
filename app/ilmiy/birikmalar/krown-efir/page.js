// /ilmiy/birikmalar/krown-efir — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/krown-efir' },
  title: "[K(18-kraun-6)]⁺ — kraun-efir kompleksi",
  description:
    "Supramolekulyar kimyoning asosi: makrosiklik efir kaliy ionini tanlab ushlashi, host-guest ta'siri va 1987-yil Nobel mukofoti.",
}

export default function Sahifa() {
  return <Korinish />
}
