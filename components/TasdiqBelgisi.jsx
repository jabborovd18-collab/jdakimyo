// components/TasdiqBelgisi.jsx
//
// Tasdiqlangan hisob belgisi (galochka).
//
// NEGA ALOHIDA KOMPONENT. Belgi ism ko'ringan har joyda chiqadi: profil,
// izohlar, talabalar ro'yxati, reyting. Har joyda alohida chizilsa,
// shakli va o'lchami bir-biridan farq qila boshlardi va keyin ularni bir
// joyda o'zgartirib bo'lmasdi.
//
// SVG, emoji emas: ✔️ emojisi har tizimda boshqacha ko'rinadi (Windows'da
// qora, Android'da yashil) va rangini boshqarib bo'lmaydi.

/**
 * @param {{ tasdiqlangan?: boolean, olcham?: 'kichik'|'orta'|'katta', className?: string }} props
 */
export default function TasdiqBelgisi({ tasdiqlangan, olcham = 'orta', className = '' }) {
  if (!tasdiqlangan) return null

  const olchamlar = {
    kichik: 'w-3.5 h-3.5',
    orta: 'w-4 h-4',
    katta: 'w-5 h-5',
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      // Ekran o'quvchi uchun: belgi bezak emas, ma'lumot beradi
      aria-label="Tasdiqlangan hisob"
      title="Tasdiqlangan hisob"
      className={`inline-block shrink-0 text-blue-400 ${olchamlar[olcham] || olchamlar.orta} ${className}`}
    >
      {/* Tishli doira — belgi boshqa dumaloq ikonkalar orasida
          ajralib tursin */}
      <path d="M12 1.5l2.34 1.7 2.86-.3 1.15 2.64 2.6 1.22-.62 2.82.62 2.82-2.6 1.22-1.15 2.64-2.86-.3L12 22.5l-2.34-1.7-2.86.3-1.15-2.64-2.6-1.22.62-2.82-.62-2.82 2.6-1.22 1.15-2.64 2.86.3L12 1.5z" />
      {/* Ichidagi belgi fon rangida o'yilgan */}
      <path
        d="M10.6 15.4l-3-3 1.4-1.4 1.6 1.6 4.4-4.4 1.4 1.4-5.8 5.8z"
        className="fill-slate-950"
      />
    </svg>
  )
}
