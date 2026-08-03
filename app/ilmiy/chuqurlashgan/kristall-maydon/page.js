// /ilmiy/chuqurlashgan/kristall-maydon — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "Kristall maydon nazariyasi — chuqurlashgan",
  description:
    "d-orbitallar ajralishi, Δ₀, kristall maydon barqarorlik energiyasi, yuqori va quyi spin, spektrokimyoviy qator va rang — OTM darajasida.",
}

export default function Sahifa() {
  return <Korinish />
}
