// components/TasdiqBelgisi.jsx
//
// Tasdiqlangan hisob belgisi.
//
// NEGA ALOHIDA KOMPONENT. Belgi ism ko'ringan har joyda chiqadi: profil,
// do'stlar, chat, muhokama, talabalar ro'yxati. Har joyda alohida
// chizilsa, shakli va o'lchami bir-biridan farq qila boshlardi.
//
// NEGA SVG, EMOJI EMAS. `✔️` Windows'da qora, Android'da yashil chiqadi
// va rangini boshqarib bo'lmaydi — belgi har qurilmada boshqacha
// ko'rinardi.
//
// NEGA JIMJIMADOR. Belgi kelajakda pullik obuna bilan beriladi, ya'ni u
// sotib olinadigan narsaning ko'rinadigan qismi. Oddiy kulrang belgi
// buni ifodalamaydi: gradient, nur va tebranish uni "qiymatli" qiladi.

/** Gradient ta'riflari bir marta chiziladi — id'lar butun sahifa uchun umumiy. */
function Gradientlar() {
  return (
    <defs>
      <linearGradient id="jda-tasdiq-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="45%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="jda-tasdiq-yaltiroq" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

const OLCHAMLAR = {
  kichik: 'w-3.5 h-3.5',
  orta: 'w-[18px] h-[18px]',
  katta: 'w-6 h-6',
  ulkan: 'w-8 h-8',
}

/**
 * @param {{
 *   tasdiqlangan?: boolean,
 *   olcham?: 'kichik'|'orta'|'katta'|'ulkan',
 *   jonli?: boolean,   // sekin tebranadigan nur (profil sarlavhasi uchun)
 *   className?: string
 * }} props
 */
export default function TasdiqBelgisi({
  tasdiqlangan,
  olcham = 'orta',
  jonli = false,
  className = '',
}) {
  if (!tasdiqlangan) return null

  return (
    <span
      className={`relative inline-flex shrink-0 align-middle ${className}`}
      title="Tasdiqlangan hisob"
    >
      {/* Orqadagi yumshoq nur. Belgining o'zidan kattaroq va xira —
          "yoritilgan" taassurotini shu beradi. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full bg-cyan-400/40 blur-[6px] ${
          jonli ? 'animate-pulse' : ''
        }`}
      />
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label="Tasdiqlangan hisob"
        className={`relative ${OLCHAMLAR[olcham] || OLCHAMLAR.orta}`}
      >
        <Gradientlar />
        {/* Tishli muhr — belgi boshqa dumaloq ikonkalar orasida
            ajralib tursin */}
        <path
          fill="url(#jda-tasdiq-gradient)"
          d="M12 1.3l2.05 1.49 2.5-.27 1.01 2.31 2.28 1.07-.55 2.47.55 2.47-2.28 1.07-1.01 2.31-2.5-.27L12 22.7l-2.05-1.49-2.5.27-1.01-2.31-2.28-1.07.55-2.47-.55-2.47 2.28-1.07 1.01-2.31 2.5.27L12 1.3z"
        />
        {/* Yuqori chap burchakdagi yaltiroq — sirt qavariq ko'rinsin */}
        <path
          fill="url(#jda-tasdiq-yaltiroq)"
          d="M12 1.3l2.05 1.49 2.5-.27 1.01 2.31 2.28 1.07-.55 2.47.55 2.47-2.28 1.07-1.01 2.31-2.5-.27L12 22.7l-2.05-1.49-2.5.27-1.01-2.31-2.28-1.07.55-2.47-.55-2.47 2.28-1.07 1.01-2.31 2.5.27L12 1.3z"
        />
        {/* Belgining o'zi — oq va qalin, kichik o'lchamda ham o'qilsin */}
        <path
          d="M10.4 15.9l-3.3-3.3 1.5-1.5 1.8 1.8 4.9-4.9 1.5 1.5-6.4 6.4z"
          fill="#ffffff"
        />
      </svg>
    </span>
  )
}
