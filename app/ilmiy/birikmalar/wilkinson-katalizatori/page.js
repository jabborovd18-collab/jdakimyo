// /ilmiy/birikmalar/wilkinson-katalizatori — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/wilkinson-katalizatori' },
  title: "[RhCl(PPh₃)₃] — Wilkinson katalizatori",
  description:
    "Gomogen gidrogenlash katalizatori: kvadrat-planar Rh(I), katalitik sikl bosqichlari va 1973-yil Nobel mukofoti.",
}

export default function Sahifa() {
  return <Korinish />
}
