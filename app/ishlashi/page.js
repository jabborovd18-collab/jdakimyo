import Korinish from './korinish'
import { FAQ } from './faq'
import { faqGrafi, yolGrafi, ldJsonProps } from '@/lib/tuzilgan-malumot'

/**
 * SAYT QANDAY ISHLAYDI — v3.0.0 da to'liq qayta yozildi.
 *
 * NEGA QAYTA YOZILDI. Eski sahifa ikki jihatdan yaroqsiz edi.
 *
 * 1) TEKSHIRIB BO'LADIGAN YOLG'ONLAR. "120+ kompleks birikma" (aslida 34),
 *    "Recharts" va "LaTeX" texnologiyalari (loyihada o'rnatilmagan ham),
 *    "Next.js 14+" (16), "PWA ustida ish olib borilmoqda" (manifest ham,
 *    service worker ham yo'q), "sertifikat uchun 80% kerak, 4 daraja:
 *    C/B/A/A+" (sertifikatni admin qo'lda beradi, foiz sharti yo'q),
 *    "har bir mavzu 3 darajada taqdim etilgan" (bunday tizim yo'q).
 *    Eng yomoni — "Mobile-first, barcha qurilmalarda mukammal ishlaydi",
 *    holbuki bosh sahifa mobil foydalanuvchiga aynan buning aksini
 *    ogohlantirib chiqadi. Odam saytdan avval shu sahifani o'qiydi;
 *    bu yerdagi yolg'on butun saytga bo'lgan ishonchni yo'qotadi.
 *
 * 2) SAYTNING YARMI YO'Q EDI. Virtual laboratoriya, ustoz paneli va
 *    guruhlar, elektron doska, kanallar, Telegram bot, missiyalar,
 *    do'stlar va chat, bildirishnomalar — hech biri eslatilmagan.
 *    Sahifa 2024 yildagi saytni tasvirlardi.
 *
 * QOIDA: bu sahifadagi har bir son yo `lib/ilmiy-hajm.json` dan (o'zi
 * yangilanadi), yo bazadan o'lchangan va PASTGA yaxlitlangan. Yaxlitlash
 * yo'nalishi muhim: kontent o'sib borsa, kam aytilgan son to'g'ri bo'lib
 * qolaveradi, ko'p aytilgani esa yolg'onga aylanadi.
 */

export const metadata = {
  title: 'Sayt qanday ishlaydi',
  description:
    "JDA KIMYO platformasining to'liq xaritasi: fanlar, o'quv va ilmiy bo'limlar, testlar, " +
    "virtual laboratoriya, ustoz paneli, kanallar va Telegram bot. Nima tayyor va nima " +
    'hali tayyor emasligi ochiq yozilgan.',
  alternates: { canonical: '/ishlashi' },
}

export default function IshlashiSahifasi() {
  return (
    <>
      {/* FAQ va non ushoqlari — matn `faq.js` dan keladi, ya'ni
          schema'dagi javob ekrandagi javob bilan doim bir xil. */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        {...ldJsonProps(
          yolGrafi([{ nom: 'Sayt qanday ishlaydi' }]),
          faqGrafi(FAQ),
        )}
      />
      <Korinish />
    </>
  )
}
