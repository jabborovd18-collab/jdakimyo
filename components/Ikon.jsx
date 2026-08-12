// components/Ikon.jsx
//
// SVG IKONKALAR — v3.0.0 dan boshlab emoji o'rniga.
//
// NEGA EMOJIDAN VOZ KECHILDI. Emoji uch sababga ko'ra interfeys belgisi
// sifatida yaroqsiz:
//   1) har bir tizimda boshqacha chiziladi (Windows'dagi 🔬 Android'dagi
//      🔬 ga o'xshamaydi) — ya'ni dizaynni nazorat qilib bo'lmaydi;
//   2) rangi qattiq yozilgan, sahifa foni o'zgarganda moslashmaydi;
//   3) o'lchami shrift bilan bog'liq, chiziq qalinligi esa umuman yo'q —
//      yonidagi matn bilan optik jihatdan hech qachon tenglashmaydi.
//
// Bu yerdagilar `currentColor` bilan chiziladi va `stroke-width` bitta:
// shuning uchun ular fon almashganda o'zi moslashadi va yonma-yon
// turganda bir oilaga o'xshaydi.
//
// Barchasi 24×24 to'rda, faqat chiziq (fill yo'q) — Lucide uslubida
// qo'lda yozilgan.

const YOLLAR = {
  // ─── Navigatsiya va boshqaruv ───
  qidiruv: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  menyu: <path d="M4 7h16M4 12h16M4 17h16" />,
  yopish: <path d="M6 6l12 12M18 6L6 18" />,
  ong: <path d="M5 12h13m-5-6 6 6-6 6" />,
  chap: <path d="M19 12H6m5-6-6 6 6 6" />,
  qosh: <path d="M12 5v14M5 12h14" />,
  tahrir: (
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  ),
  ulashish: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ),
  taqvim: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  sozlama: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  nusxa: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  filtr: (
    <>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </>
  ),
  orin: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
      <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
    </>
  ),
  // Uch nuqta — qo'shimcha amallar menyusi
  kop: (
    <>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </>
  ),
  // Xabar yuborish. `telegram` ham qog'oz samolyot, lekin u BRENDNI
  // bildiradi (bot, kanal havolalari) — bu esa amalni. Ikkisi bir xil
  // ikonka bo'lsa, "yuborish" tugmasi Telegramga olib boradiganday
  // ko'rinardi.
  jonat: (
    <>
      <path d="M21 4 3 11.2l6.6 2.6L20.4 5.2z" />
      <path d="m9.6 13.8 2.7 6.4L21 4" />
    </>
  ),
  ochir: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
      <path d="M6.5 7.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7.5" />
    </>
  ),
  bayroq: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4.8c4-2 8 2 12 0v8c-4 2-8-2-12 0z" />
    </>
  ),
  taqiq: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6 6 12 12" />
    </>
  ),
  past: <path d="m6 9 6 6 6-6" />,
  qayta: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M18.2 16.5A8 8 0 1 1 19.5 9" />
    </>
  ),
  vaqt: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  fayl: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M12 11v6m-2.5-2.5L12 17l2.5-2.5" />
    </>
  ),
  tashqi: <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />,

  // ─── Holat ───
  qulf: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1.2" />
    </>
  ),
  ochiq: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.7-1.5" />
      <circle cx="12" cy="15" r="1.2" />
    </>
  ),
  belgi: <path d="m5 12.5 4.5 4.5L19 7.5" />,

  // ─── Fanlar va o'quv ───
  atom: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)" />
    </>
  ),
  kitob: (
    <>
      <path d="M5 4h9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H5z" />
      <path d="M5 4v13.5" />
      <path d="M17 7h2v13H7.5" />
    </>
  ),
  kolba: (
    <>
      <path d="M9.5 3v6.2L4.6 17.6A2 2 0 0 0 6.3 20.6h11.4a2 2 0 0 0 1.7-3L14.5 9.2V3" />
      <path d="M8 3h8" />
      <path d="M7.2 14.5h9.6" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10.5 9.3 4.6 2.7-4.6 2.7z" />
    </>
  ),
  quiz: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="m8 9 1.6 1.6L12.6 7.6" />
      <path d="M14.5 9.5h2.5" />
      <path d="m8 15.5 1.6 1.6 3-3" />
      <path d="M14.5 16h2.5" />
    </>
  ),
  muhokama: (
    <>
      <path d="M20 13.5a3 3 0 0 1-3 3H9l-4.5 3.5v-3.5H5a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" />
      <path d="M7.5 8h9M7.5 11.5h5.5" />
    </>
  ),

  // Shaxsiy chat. `muhokama` dan ATAYLAB farq qiladi: u ommaviy
  // muhokamaning bitta katta pufagi, bu esa ikki kishilik yozishma —
  // ikkita ustma-ust pufak. Bir xil ikonka ikki xil bo'limni bildirsa,
  // menyuda qaysi biri qayerga olib borishini ikonkaga qarab ayta
  // olmaysiz.
  xabar: (
    <>
      <path d="M17 11.5a3 3 0 0 1-3 3H8l-4 3v-3a3 3 0 0 1-1-2.2V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3z" />
      <path d="M17 7.5h1.5a3 3 0 0 1 3 3v3.8a3 3 0 0 1-1 2.2v2.5l-3-2.5h-4" />
    </>
  ),

  // ─── Rollar va shaxsiy bo'lim ───
  odam: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  odamlar: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2" />
      <path d="M17.5 14.2a6.5 6.5 0 0 1 4 5.3" />
    </>
  ),
  qalqon: (
    <>
      <path d="M12 3 4.5 6v6c0 4.4 3.1 7.9 7.5 9 4.4-1.1 7.5-4.6 7.5-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  ustoz: (
    <>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6.5 10.8V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-5.2" />
      <path d="M21.5 8.5V14" />
    </>
  ),
  hamkor: (
    <>
      <path d="M9 12.5 6.5 15a2.1 2.1 0 0 0 3 3l1-1 1 1a2.1 2.1 0 0 0 3-3" />
      <path d="m3 8 3.5-3.5L11 8l-2 2a1.8 1.8 0 0 1-2.5 0z" />
      <path d="m21 8-3.5-3.5L13 8l2 2a1.8 1.8 0 0 0 2.5 0z" />
    </>
  ),
  chiqish: (
    <>
      <path d="M14.5 4.5h-8a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8" />
      <path d="M11 12h9.5m-3-3.2 3 3.2-3 3.2" />
    </>
  ),

  // ─── Bo'limlar ───
  kanal: (
    <>
      <path d="M4 9.5v5a1.5 1.5 0 0 0 1.5 1.5H8l5.5 3.8V5.7L8 9.5z" />
      <path d="M17 9a4.5 4.5 0 0 1 0 6" />
      <path d="M19.8 6.2a8.5 8.5 0 0 1 0 11.6" />
    </>
  ),
  doska: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="7.5" width="16" height="12" rx="3" />
      <path d="M12 3.5v4" />
      <circle cx="9" cy="13" r="1.1" />
      <circle cx="15" cy="13" r="1.1" />
      <path d="M1.5 12.5v3M22.5 12.5v3" />
    </>
  ),
  pochta: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
    </>
  ),
  telegram: <path d="M21 5 3.5 11.6a.5.5 0 0 0 .05.95l4.4 1.25L18.5 7.5l-8.2 7.6.3 4.6a.5.5 0 0 0 .9.25l2.3-2.9 4.3 3.1a.6.6 0 0 0 .93-.35z" />,
  palitra: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7h2A4.6 4.6 0 0 0 21 10 8.2 8.2 0 0 0 12 3.5z" />
      <circle cx="7.8" cy="11.5" r="1.1" />
      <circle cx="11" cy="7.8" r="1.1" />
      <circle cx="15.5" cy="9" r="1.1" />
    </>
  ),
  qongiroq: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9" />
      <path d="M13.8 19a2 2 0 0 1-3.6 0" />
    </>
  ),
  yulduz: <path d="m12 3.8 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 17.2l-5.25 2.75 1-5.85L3.5 9.95l5.9-.85z" />,
  grafik: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="m7.5 15.5 3.5-4.5 3 2.5 4.5-6" />
    </>
  ),
}

/**
 * @param {string} nom      YOLLAR dagi kalit
 * @param {number} olcham   piksel (kenglik = balandlik)
 * @param {number} qalin    chiziq qalinligi
 */
export default function Ikon({ nom, olcham = 20, qalin = 1.6, className = '', ...qolgan }) {
  const yol = YOLLAR[nom]

  // Noma'lum nom kelsa hech narsa chizmaymiz. Ilgari emoji ishlatilganda
  // xato nom ekranda "undefined" bo'lib chiqardi — bu undan yaxshiroq.
  if (!yol) return null

  return (
    <svg
      viewBox="0 0 24 24"
      width={olcham}
      height={olcham}
      fill="none"
      stroke="currentColor"
      strokeWidth={qalin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...qolgan}
    >
      {yol}
    </svg>
  )
}

export const IKON_NOMLARI = Object.keys(YOLLAR)
