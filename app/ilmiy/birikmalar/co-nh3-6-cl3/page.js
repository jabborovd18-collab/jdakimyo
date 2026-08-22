// /ilmiy/birikmalar/co-nh3-6-cl3 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/co-nh3-6-cl3' },
  title: "[Co(NH₃)₆]Cl₃ — geksaamminkobalt(III) xlorid",
  description:
    "Luteo-kobalt: oktaedrik quyi spinli d⁶ kompleks, Verner nazariyasining asosiy dalili, sintezi va inertligi.",
}

export default function Sahifa() {
  return <Korinish />
}
