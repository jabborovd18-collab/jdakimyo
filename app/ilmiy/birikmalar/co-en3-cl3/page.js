// /ilmiy/birikmalar/co-en3-cl3 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "[Co(en)₃]Cl₃ — tris(etilendiamin)kobalt(III)",
  description:
    "Verner ajratgan xiral kompleks: uchta xelat halqa, Δ va Λ enantiomerlar, optik faollik va koordinatsion kimyo tarixidagi o'rni.",
}

export default function Sahifa() {
  return <Korinish />
}
