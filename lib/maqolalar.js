// lib/maqolalar.js
//
// Maqolalar ro'yxati bilan ishlashning yakka manbasi.
//
// Nega kerak: har bir sahifa `fetch("/data/maqolalar.json")` qilardi, bosh
// sahifa esa umuman o'zining alohida qo'lda yozilgan ro'yxatini ishlatardi —
// natijada bosh sahifadagi sarlavha bilan ochilgan maqola bir-biriga mos
// kelmasdi. Endi hamma joy shu fayldan oladi.
//
// JSON'ni `import` qilamiz, `fs` bilan o'qimaymiz: server kodida public/
// papkasi Vercel'ning lambda to'plamiga tushishi kafolatlanmagan, import esa
// build vaqtida bog'lanadi va ikki tomonda (server/klient) bir xil ishlaydi.
import royxat from '@/public/data/maqolalar.json'

/** Maqolalar, yangisi birinchi. */
export const maqolalar = [...royxat].sort(
  (a, b) => new Date(b.sana) - new Date(a.sana)
)

/** id (matn yoki son) bo'yicha bitta maqola. */
export function maqolaTop(id) {
  return maqolalar.find((m) => String(m.id) === String(id)) || null
}

/** Barcha id'lar — sanoqchilarni bitta so'rovda olish uchun. */
export const maqolaIdlar = maqolalar.map((m) => String(m.id))

/**
 * Kalit so'zlar va ular nechta maqolada uchraydi (ko'pdan kamga).
 * Bosh sahifadagi "Mashhur mavzular" avval qo'lda yozilgan raqamlar edi.
 */
export function kalitSozStat() {
  const hisob = new Map()
  for (const m of maqolalar) {
    for (const k of m.kalitSozlar || []) {
      hisob.set(k, (hisob.get(k) || 0) + 1)
    }
  }
  return [...hisob.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/** Oxirgi `kun` kun ichida qo'shilgan maqolalar. */
export function yangiMaqolalar(kun = 7) {
  const chegara = Date.now() - kun * 24 * 60 * 60 * 1000
  return maqolalar.filter((m) => {
    const t = new Date(m.sana).getTime()
    return !Number.isNaN(t) && t >= chegara
  })
}

/** Noyob mualliflar soni. */
export const mualliflarSoni = new Set(maqolalar.map((m) => m.muallif)).size

/**
 * Sanoqchilarni maqolalarga qo'shib beradi.
 * `stat` — { [articleId]: { views, downloads } } ko'rinishidagi API javobi.
 *
 * Sanoqchining yagona manbasi — baza. Yozuv yo'q bo'lsa 0: maqola hali
 * o'qilmagan degani. Avval bu raqamlar JSON ichida qo'lda yozilgan edi,
 * endi u yerda saqlanmaydi — faqat haqiqiy ko'rishlar hisoblanadi.
 */
export function statQoshilgan(stat) {
  return maqolalar.map((m) => {
    const s = stat?.[String(m.id)]
    return {
      ...m,
      korishlar: s?.views ?? 0,
      yuklashlar: s?.downloads ?? 0,
    }
  })
}
