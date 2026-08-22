// /ilmiy/tahlil/fluoressensiya — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil/fluoressensiya' },
  title: "Fluoressensiya spektroskopiya",
  description:
    "Lyuminestsensiya, kvant unumi va antenna effekti: Eu, Tb, Ru va Ir komplekslarining nur chiqarish xossalari.",
}

export default function Sahifa() {
  return <Korinish />
}
