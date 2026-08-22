// app/jda-kimyo/page.js
//
// "JDA KIMYO nima?" — server qobig'i: sarlavha, tavsif va JSON-LD.
//
// NEGA BO'LINGAN. Ko'rinish "use client" (fon almashtirgichi va
// `<details>` uchun), metadata esa faqat server komponentidan
// eksport qilinadi. Bo'linmasa sahifa saytdagi umumiy sarlavha bilan
// indekslanardi.
//
// MANZIL NEGA `/jda-kimyo`. Bu sahifa brendning o'zi haqida, ya'ni
// manzilida brend nomi turishi kerak: qidiruv natijasida havolaning
// o'zi ham "bu JDA KIMYO haqidagi rasmiy sahifa" deb o'qiladi.
import Korinish from './korinish'
import { FAQ } from './malumot'
import { DOMEN, NOM, TARIF_TOLIQ } from '@/lib/sayt-malumot'
import { faqGrafi, yolGrafi, ldJsonProps, TASHKILOT_ID, YARATUVCHI_ID } from '@/lib/tuzilgan-malumot'

export const metadata = {
  // Sarlavha ATAYLAB savol shaklida: odam ChatGPT'da ham, Google'da ham
  // aynan shu jumlani yozadi ("JDA KIMYO nima").
  // `absolute` — ildiz layoutdagi "%s | JDA KIMYO" qolipi QO'LLANMASIN:
  // nom sarlavhaning boshida allaqachon turibdi, qolip uni ikkinchi
  // marta qo'shsa sarlavha 70 belgidan oshadi va natijada kesiladi.
  title: { absolute: "JDA KIMYO nima? — o'zbek tilidagi oliy kimyo platformasi" },
  description: TARIF_TOLIQ,
  alternates: { canonical: '/jda-kimyo' },
  openGraph: {
    type: 'profile',
    title: `${NOM} nima? — platforma haqida`,
    description: TARIF_TOLIQ,
    url: `${DOMEN}/jda-kimyo`,
  },
}

/**
 * Sahifaning tuzilgan ma'lumoti.
 *
 * `AboutPage` — sahifa turi, `mainEntity` esa ildiz layoutdagi
 * tashkilot tuguniga ishora qiladi: shu bog'lanish orqali qidiruv
 * tizimi "bu sahifa aynan o'sha tashkilot haqida" deb tushunadi.
 *
 * FAQ massivi `malumot.js` dan keladi — ya'ni schema'dagi javob va
 * ekrandagi javob bir manbadan chiqadi va hech qachon ajralmaydi.
 */
const SAHIFA_GRAFI = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${DOMEN}/jda-kimyo#sahifa`,
  url: `${DOMEN}/jda-kimyo`,
  name: `${NOM} nima?`,
  description: TARIF_TOLIQ,
  inLanguage: 'uz',
  mainEntity: { '@id': TASHKILOT_ID },
  about: { '@id': TASHKILOT_ID },
  author: { '@id': YARATUVCHI_ID },
}

export default function JdaKimyoSahifasi() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        {...ldJsonProps(
          SAHIFA_GRAFI,
          yolGrafi([{ nom: `${NOM} haqida` }]),
          faqGrafi(FAQ),
        )}
      />
      <Korinish />
    </>
  )
}

// Sahifa faqat kod ichidagi ma'lumotdan quriladi — bazaga so'rov yo'q,
// ya'ni uni statik chizib qo'yish mumkin. Bu robot uchun ham foydali:
// javob keshdan keladi, sekin so'rov kutilmaydi.
export const dynamic = 'force-static'
