// /ilmiy/tahlil/iq — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil/iq' },
  title: "IQ (infraqizil) spektroskopiya",
  description:
    "Molekulyar tebranish spektroskopiyasi: guruh nazariyasi, metall–ligand tebranishlari, FT-IR, ATR va FIR usullari. 22 ta birikma misoli bilan.",
}

export default function Sahifa() {
  return <Korinish />
}
