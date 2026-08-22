// /ilmiy/birikmalar/gemoglobin — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/gemoglobin' },
  title: "Gemoglobin — [Fe(Por)(His)(O₂)]",
  description:
    "Qonda kislorod tashiydigan temir kompleksi: porfirin halqasi, kooperativ bog'lanish va spin holatining o'zgarishi.",
}

export default function Sahifa() {
  return <Korinish />
}
