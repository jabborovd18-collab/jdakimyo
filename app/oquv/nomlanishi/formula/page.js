// /oquv/nomlanishi/formula — qidiruv tizimlari uchun server qobig'i.
//
// NEGA BO'LINGAN. Ko'rinish "use client" bo'lgani uchun undan metadata
// eksport qilib bo'lmaydi: Next.js sarlavha va tavsifni faqat server
// komponentidan oladi. Bo'linmaganda butun saytda bitta sarlavha
// ko'rinardi va Google 600 sahifani bir xil hujjat deb qabul qilardi.
// Sahifa mazmuni o'zgarmadi — u korinish.js ga ko'chdi.
import Korinish from './korinish'

export const metadata = {
  title: "Kompleks birikma formulasini yozish",
  description:
    "IUPAC 2005 tavsiyalari bo'yicha formula yozish tartibi: kvadrat qavs, markaziy atom, ligandlar ketma-ketligi va zaryadning ko'rsatilishi.",
}

export default function Sahifa() {
  return <Korinish />
}
