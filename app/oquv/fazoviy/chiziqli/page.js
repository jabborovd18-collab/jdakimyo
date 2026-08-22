// /oquv/fazoviy/chiziqli — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/oquv/fazoviy/chiziqli' },
  title: "Chiziqli geometriya (KS = 2)",
  description:
    "Koordinatsion soni 2 bo'lgan komplekslar: sp gibridlanish, 180° valent burchak, D∞h simmetriya. d¹⁰ metallarga xos shakl.",
}

export default function Sahifa() {
  return <Korinish />
}
