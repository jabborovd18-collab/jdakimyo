// /ilmiy/birikmalar/vaska-kompleksi — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "trans-[IrCl(CO)(PPh₃)₂] — Vaska kompleksi",
  description:
    "Oksidlanish-qo'shilish reaksiyasining model birikmasi: kvadrat-planar Ir(I), O₂ va H₂ ni qaytar biriktirishi.",
}

export default function Sahifa() {
  return <Korinish />
}
