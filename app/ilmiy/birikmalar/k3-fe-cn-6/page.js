// /ilmiy/birikmalar/k3-fe-cn-6 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "K₃[Fe(CN)₆] — qizil qon tuzi",
  description:
    "Kaliy geksatsianoferrat(III): quyi spinli d⁵ kompleks, Turnbull ko'ki reaksiyasi, redoks xossalari va spektrlari.",
}

export default function Sahifa() {
  return <Korinish />
}
