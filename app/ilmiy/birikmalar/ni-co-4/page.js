// /ilmiy/birikmalar/ni-co-4 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "[Ni(CO)₄] — nikel tetrakarbonil",
  description:
    "Tetraedrik d¹⁰ karbonil: Mond usulida nikelni tozalash, 18 elektron qoidasi va yuqori zaharliligi.",
}

export default function Sahifa() {
  return <Korinish />
}
