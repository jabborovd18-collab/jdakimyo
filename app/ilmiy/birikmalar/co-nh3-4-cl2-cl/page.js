// /ilmiy/birikmalar/co-nh3-4-cl2-cl — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/co-nh3-4-cl2-cl' },
  title: "[Co(NH₃)₄Cl₂]Cl — tetraammindixlorokobalt(III)",
  description:
    "Sis (violeo) va trans (praseo) izomerlari: rang farqi, sintezi va Verner nazariyasini isbotlashdagi ahamiyati.",
}

export default function Sahifa() {
  return <Korinish />
}
