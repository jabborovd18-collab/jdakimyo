import { QUIZ_CATEGORIES } from './quiz-categories'

const ASOSIY_SLUGLAR = QUIZ_CATEGORIES
  .filter((category) => category.slug !== 'aralash')
  .map((category) => category.slug)

export const QUIZ_SAVOL_SONI = 20
export const QUIZ_ENG_KOP_SAVOL = 50

function aralashtir(array) {
  const nusxa = [...array]
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]]
  }
  return nusxa
}
function qiyinlikBilanTanla(bank, count, previousIds) {
  const oldingi = new Set(previousIds)
  let mavjud = bank.filter((question) => !oldingi.has(question.id))
  if (mavjud.length < count) mavjud = bank

  const oson = aralashtir(mavjud.filter((q) => q.difficulty === 'oson'))
  const orta = aralashtir(mavjud.filter((q) => q.difficulty === "o'rta"))
  const qiyin = aralashtir(mavjud.filter((q) => q.difficulty === 'qiyin'))

  const osonSoni = Math.min(Math.floor(count * 0.3), oson.length)
  const ortaSoni = Math.min(Math.floor(count * 0.5), orta.length)
  const qiyinSoni = Math.min(count - osonSoni - ortaSoni, qiyin.length)
  const tanlangan = [
    ...oson.slice(0, osonSoni),
    ...orta.slice(0, ortaSoni),
    ...qiyin.slice(0, qiyinSoni),
  ]

  const tanlanganId = new Set(tanlangan.map((q) => q.id))
  tanlangan.push(...aralashtir(mavjud.filter((q) => !tanlanganId.has(q.id))).slice(0, count - tanlangan.length))
  return aralashtir(tanlangan)
}

/** Tarix va qiyinlik muvozanatini serverda saqlagan holda savollarni tanlaydi. */
export function quizSavollariniTanla(bank, categorySlug, count = QUIZ_SAVOL_SONI, previousIds = []) {
  if (!Number.isInteger(count) || count < 1 || count > QUIZ_ENG_KOP_SAVOL) {
    throw new Error("Savollar soni noto'g'ri")
  }
  if (!Array.isArray(bank) || !Array.isArray(previousIds)) {
    throw new Error("Savollar banki noto'g'ri")
  }

  if (categorySlug !== 'aralash') {
    if (bank.length < count) throw new Error('Bu mavzuda quiz uchun savol yetarli emas')
    return qiyinlikBilanTanla(bank, count, previousIds)
  }

  const asosiy = Math.floor(count / ASOSIY_SLUGLAR.length)
  let qoldiq = count % ASOSIY_SLUGLAR.length
  const tanlangan = []

  for (const slug of ASOSIY_SLUGLAR) {
    const kerak = asosiy + (qoldiq > 0 ? 1 : 0)
    qoldiq -= qoldiq > 0 ? 1 : 0
    const shuMavzu = bank.filter((question) => question.category === slug)
    if (shuMavzu.length < kerak) {
      throw new Error(`${slug} mavzusida aralash test uchun savol yetarli emas`)
    }
    tanlangan.push(...qiyinlikBilanTanla(shuMavzu, kerak, previousIds))
  }

  return aralashtir(tanlangan)
}
