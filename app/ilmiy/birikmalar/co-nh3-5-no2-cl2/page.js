// /ilmiy/birikmalar/co-nh3-5-no2-cl2 — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "[Co(NH₃)₅NO₂]Cl₂ — pentaamminnitrokobalt(III)",
  description:
    "Bog'lanish izomeriyasining nitro shakli: NO₂⁻ azot orqali koordinatsiyalanganda rang, IQ spektri va barqarorlik qanday bo'ladi.",
}

export default function Sahifa() {
  return <Korinish />
}
