import Korinish from "./korinish";

// SEO metadata va ijtimoiy tarmoqlarda bo'lishish uchun sahifa sarlavhasi hamda tavsifi.
// Nega page.js server komponent qilib ajratildi: Next.js App Router da 'use client'
// bo'lgan komponentlar ichida metadata eksport qilib bo'lmaydi. Shu bois SEO sozlamasi
// page.js da turadi, interaktiv 3D interfeys esa korinish.js dan chaqiriladi.
export const metadata = {
  title: "3D Laboratoriya | JdaKimyo.uz - Interaktiv kimyoviy tajribalar",
  description:
    "O'zbek tilidagi kimyo platformasida 3D virtual laboratoriya. Probirka va kolbalarda reagentlarni millilitr aniqlik bilan quying, cho'kma va animatsiyani kuzating.",
};

// 3D Laboratoriya bo'limining asosiy kirish nuqtasi.
export default function Sahifa() {
  return <Korinish />;
}