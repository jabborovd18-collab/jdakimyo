// /ilmiy/birikmalar/zeise-tuzi — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "K[PtCl₃(C₂H₄)] — Zeise tuzi",
  description:
    "Birinchi organometall birikma (1827): etilenning π-koordinatsiyasi, Dyuar-Chatt-Dunkanson modeli va organometall kimyo boshlanishi.",
}

export default function Sahifa() {
  return <Korinish />
}
