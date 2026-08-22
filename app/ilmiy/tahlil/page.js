// /ilmiy/tahlil — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil' },
  title: "Tahlil usullari — 20 ta zamonaviy metod",
  description:
    "Kompleks birikmalarni o'rganishning fizik-kimyoviy usullari: YaMR, IQ, UB-Vis, Mössbauer, EPR, rentgen difraksiyasi va boshqalar, birikma misollari bilan.",
}

export default function Sahifa() {
  return <Korinish />
}
