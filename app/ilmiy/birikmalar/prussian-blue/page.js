// /ilmiy/birikmalar/prussian-blue — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "Fe₄[Fe(CN)₆]₃ — Berlin ko'ki",
  description:
    "Prussian Blue: kubik panjara tuzilishi, aralash valentli Fe(II)/Fe(III) markazlari, ko'k rangning IVCT bilan izohi hamda pigment va tibbiyotdagi qo'llanilishi.",
}

export default function Sahifa() {
  return <Korinish />
}
