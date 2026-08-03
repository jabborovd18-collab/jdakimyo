// /ilmiy/chuqurlashgan/zaryad-kochishi — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "Zaryad ko'chishi spektrlari (CT)",
  description:
    "MLCT, LMCT, MMCT, IVCT va XLCT o'tishlari hamda solvatoxromizm — zaryad ko'chishi qanday qilib juda intensiv rang beradi.",
}

export default function Sahifa() {
  return <Korinish />
}
