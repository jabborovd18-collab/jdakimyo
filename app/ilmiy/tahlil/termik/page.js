// /ilmiy/tahlil/termik — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil/termik' },
  title: "Termik tahlil — TGA, DTG, DTA va DSC",
  description:
    "Qizdirishda massa va issiqlik o'zgarishi: kristallizatsion suvni yo'qotish, parchalanish bosqichlari va termik barqarorlik.",
}

export default function Sahifa() {
  return <Korinish />
}
