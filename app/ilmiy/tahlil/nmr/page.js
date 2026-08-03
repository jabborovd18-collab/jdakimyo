// /ilmiy/tahlil/nmr — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "YaMR (NMR) spektroskopiya",
  description:
    "Yadro magnit rezonansi: Zeeman effektidan Larmor chastotasigacha, kimyoviy siljish va dinamik jarayonlar. 13 ta kompleks birikma misoli bilan.",
}

export default function Sahifa() {
  return <Korinish />
}
