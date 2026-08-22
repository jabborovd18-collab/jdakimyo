// lib/tuzilgan-malumot.js
//
// JSON-LD (schema.org) YIG'UVCHILARI.
//
// NEGA ALOHIDA FAYL. Tuzilgan ma'lumot sahifa matnini TAKRORLAYDI:
// tashkilot nomi, ta'rifi, FAQ javoblari. Har sahifada qo'lda yozilsa,
// ikkinchi nusxa asl matndan uzilib qoladi va Google buni "schema
// sahifada ko'rinmaydigan ma'lumot beryapti" deb hisoblaydi — bunday
// belgi natijadan butunlay olib tashlanadi (AGENTS.md 1-band).
//
// Shuning uchun qoida: JSON-LD sahifadagi MASSIVDAN quriladi, matn esa
// o'sha massivdan chiziladi. Ikkalasi bir manbadan chiqadi.
import { DOMEN, NOM, TARIF, YARATUVCHI, TASHKIL_YILI, RASMIY_HISOBLAR } from './sayt-malumot'

/** Barcha sahifada bir xil bo'lgan tugun manzillari (@id). */
export const TASHKILOT_ID = `${DOMEN}/#tashkilot`
export const SAYT_ID = `${DOMEN}/#sayt`
export const YARATUVCHI_ID = `${DOMEN}/#yaratuvchi`

/**
 * Saytning "kim" ekanini bildiruvchi asosiy graf — ildiz layoutda,
 * ya'ni HAR SAHIFADA turadi.
 *
 * NEGA `sameAs` MUHIM. Sun'iy intellekt qidiruvi "JDA KIMYO" degan
 * nomni internetdagi turli sahifalarda uchratadi. `sameAs` — "o'sha
 * hisoblar ham men" degan rasmiy da'vo; usiz har manba alohida,
 * bog'lanmagan nom bo'lib qoladi.
 *
 * NEGA `SearchAction` YO'Q: `/qidiruv` manzil parametrini (`?q=`)
 * o'qimaydi, so'rovni holatda saqlaydi. Ishlamaydigan harakatni e'lon
 * qilish uni yo'q deyishdan yomonroq — Google sinab ko'rib bo'sh sahifa
 * oladi. Qidiruv `?q=` ni qo'llagan kuni qo'shiladi.
 */
export function saytGrafi() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': TASHKILOT_ID,
        name: NOM,
        alternateName: 'JDAKIMYO',
        url: DOMEN,
        logo: `${DOMEN}/opengraph-image`,
        description: TARIF,
        inLanguage: 'uz',
        foundingDate: TASHKIL_YILI,
        sameAs: RASMIY_HISOBLAR,
        founder: { '@id': YARATUVCHI_ID },
      },
      {
        '@type': 'Person',
        '@id': YARATUVCHI_ID,
        name: YARATUVCHI.nom,
        url: `${DOMEN}/jda-kimyo`,
        sameAs: [YARATUVCHI.telegram, YARATUVCHI.instagram],
      },
      {
        '@type': 'WebSite',
        '@id': SAYT_ID,
        url: DOMEN,
        name: NOM,
        inLanguage: 'uz',
        publisher: { '@id': TASHKILOT_ID },
      },
    ],
  }
}

/**
 * Non ushoqlari (breadcrumb).
 *
 * @param {{nom: string, yol?: string}[]} qadamlar — "Bosh sahifa" qadami
 *        O'ZI qo'shiladi, uni yozish shart emas. Oxirgi qadamda `yol`
 *        bo'lmasligi mumkin: joriy sahifa o'ziga havola bermaydi.
 */
export function yolGrafi(qadamlar) {
  const toliq = [{ nom: 'Bosh sahifa', yol: '/' }, ...qadamlar]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: toliq.map((q, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: q.nom,
      // Oxirgi element uchun `item` berilmaydi — schema.org shuni tavsiya
      // qiladi: joriy sahifa zanjirning oxiri, havola emas.
      ...(q.yol ? { item: `${DOMEN}${q.yol === '/' ? '' : q.yol}` } : {}),
    })),
  }
}

/**
 * FAQ belgisi.
 *
 * SHART: javob matni sahifada KO'RINISHI kerak. Agar javob faqat
 * tugma bosilganda DOM ga qo'shilsa, Google uni "yashirin ma'lumot" deb
 * hisoblaydi va belgini bekor qiladi. Shuning uchun FAQ ro'yxatlari
 * `<details>` bilan chiziladi: matn har doim hujjat ichida turadi.
 *
 * @param {{q: string, a: string}[]} savollar
 */
export function faqGrafi(savollar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: savollar.map((s) => ({
      '@type': 'Question',
      name: s.q,
      acceptedAnswer: { '@type': 'Answer', text: s.a },
    })),
  }
}

/**
 * JSON-LD ni sahifaga yozadigan yordamchi.
 *
 * `dangerouslySetInnerHTML` shart: JSON-LD matn bo'lib turishi kerak,
 * React uni matn tuguni sifatida qochirib yuborsa qidiruv tizimi o'qiy
 * olmaydi. Qiymat kod ichidan keladi — tashqaridan hech narsa tushmaydi.
 */
export function ldJsonProps(...graflar) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(graflar.length === 1 ? graflar[0] : graflar),
    },
  }
}
