// /ilmiy/birikmalar/ferrosen — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "[Fe(C₅H₅)₂] — ferrosen",
  description:
    "Birinchi sendvich kompleks: η⁵-siklopentadienil halqalari, 18 elektron qoidasi, aromatik xossalari va 1973-yil Nobel mukofoti.",
}

export default function Sahifa() {
  return <Korinish />
}
