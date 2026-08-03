// /ilmiy/birikmalar/co-en2-cl2-cl — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "[Co(en)₂Cl₂]Cl — bis(etilendiamin)dixlorokobalt(III)",
  description:
    "Geometrik va optik izomeriyaning klassik namunasi: sis va trans shakllari, Δ/Λ enantiomerlar va rang farqi.",
}

export default function Sahifa() {
  return <Korinish />
}
