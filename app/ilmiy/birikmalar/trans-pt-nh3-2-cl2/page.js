// /ilmiy/birikmalar/trans-pt-nh3-2-cl2 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/trans-pt-nh3-2-cl2' },
  title: "trans-[Pt(NH₃)₂Cl₂] — transplatin",
  description:
    "Sisplatinning trans-izomeri: nega geometriya o'zgarishi bilan dorivorlik faolligi yo'qoladi — trans-ta'sir va DNK bilan bog'lanish farqi.",
}

export default function Sahifa() {
  return <Korinish />
}
