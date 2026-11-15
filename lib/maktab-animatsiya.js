// lib/maktab-animatsiya.js
//
// Maktab darslari animatsiyalari uchun umumiy yordamchilar.
//
// Nega umumiy: 22 ta dars o'z siklini va o'z ovozini yuritardi. Har bosishda yangi
// AudioContext ochilib yopilmasdi, sikl esa canvas ekrandan chiqqanda ham chizardi.

// Nega 2: undan yuqori aniqlik ko'zga deyarli sezilmaydi, chizish esa kvadratik qimmatlashadi
const MAKS_ANIQLIK = 2
// Nega 100 ms: kam harakat so'ralganda animatsiya sekin ketadi, lekin tugma bosilgach
// jarayon baribir oxiriga yetadi. To'liq to'xtatilsa, dars ishlamay qolardi.
const KAM_HARAKAT_ORALIGI = 100

let audio = null

/** Bitta umumiy AudioContext. Brauzer ularning sonini cheklaydi. */
export function umumiyAudio() {
  if (typeof window === 'undefined') return null
  const Audio = window.AudioContext || window.webkitAudioContext
  if (!Audio) return null
  audio ||= new Audio()
  // Brauzer foydalanuvchi amalidan oldin ochilgan kontekstni to'xtatib qo'yadi
  if (audio.state === 'suspended') audio.resume().catch(() => {})
  return audio
}

const korinmas = new WeakSet()
let kuzatuvchi = null
const kuzatilgan = new WeakSet()

function kuzat(canvas) {
  if (typeof IntersectionObserver === 'undefined' || kuzatilgan.has(canvas)) return
  kuzatuvchi ||= new IntersectionObserver((yozuvlar) => {
    for (const y of yozuvlar) {
      if (y.isIntersecting) korinmas.delete(y.target)
      else korinmas.add(y.target)
    }
  })
  kuzatilgan.add(canvas)
  kuzatuvchi.observe(canvas)
}

function kamHarakatmi() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * requestAnimationFrame o'rnini bosadi. Canvas ko'rinmasa chizmaydi va kam harakat
 * so'ralgan bo'lsa kadrlarni siyraklashtiradi.
 *
 * Nega qaytgan qiymat obyekt: kutish paytida ichki id o'zgaradi, bekor qilish esa
 * doim oxirgisini to'xtatishi kerak.
 *
 * @param {HTMLCanvasElement|null} canvas
 * @param {FrameRequestCallback} chiz
 * @returns {{ id: number }}
 */
export function kadrSora(canvas, chiz) {
  if (canvas) kuzat(canvas)
  const kam = kamHarakatmi()
  const boshlanish = performance.now()
  const kadr = { id: 0 }

  const qadam = (vaqt) => {
    const yopiq = canvas && korinmas.has(canvas)
    const erta = kam && vaqt - boshlanish < KAM_HARAKAT_ORALIGI
    if (yopiq || erta) {
      kadr.id = requestAnimationFrame(qadam)
      return
    }
    chiz(vaqt)
  }

  kadr.id = requestAnimationFrame(qadam)
  return kadr
}

export function kadrniBekorQil(kadr) {
  if (kadr) cancelAnimationFrame(kadr.id)
}

/**
 * Canvasni ekran aniqligiga moslaydi va chizish uchun CSS o'lchamini qaytaradi.
 * O'lcham har kadrda qo'yiladi: bu canvasni tozalaydi va uning holatini tiklaydi,
 * shu darslar ana shunga tayanadi.
 */
export function canvasOlchami(canvas, ctx) {
  const aniqlik = Math.min(window.devicePixelRatio || 1, MAKS_ANIQLIK)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.round(w * aniqlik)
  canvas.height = Math.round(h * aniqlik)
  ctx.setTransform(aniqlik, 0, 0, aniqlik, 0, 0)
  return { w, h }
}

function fnv1aHash(matn) {
  let h = 2166136261
  const s = String(matn || '')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Savol variantlarini deterministik urug' asosida aralashtiradi.
 * SSR va klient boshlang'ich renderi mos keladi; raund oshganda tartib yangilanadi.
 */
export function variantlarniAralashtir(variantlar = [], kalit = '', raund = 0) {
  const nusxa = variantlar.map((item, origIdx) => ({ item, origIdx }))
  let holat = (fnv1aHash(`${kalit}|${raund}`) || 1) >>> 0
  for (let i = nusxa.length - 1; i > 0; i--) {
    holat = (Math.imul(holat, 1664525) + 1013904223) >>> 0
    const j = holat % (i + 1)
    ;[nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]]
  }
  return nusxa
}

/**
 * Turli shakldagi takrorlash savol variantlarini ({ matn, togri } yoki matn + togriJavob)
 * bir xil ko'rinishga keltirib, aralashtirilgan holda qaytaradi.
 */
export function takrorlashVariantlari(savolObj, raund = 0) {
  const xom = Array.isArray(savolObj?.variantlar) ? savolObj.variantlar : []
  const togriMatn = savolObj?.togriJavob ?? savolObj?.togri
  const norm = xom.map((v) =>
    typeof v === 'string'
      ? { matn: v, togri: v === togriMatn }
      : { matn: v?.matn ?? '', togri: Boolean(v?.togri) }
  )
  return variantlarniAralashtir(norm, savolObj?.savol || '', raund).map((x) => x.item)
}

/**
 * Variantlar ro'yxati va `togri` (yoki `javob`) indeksini aralashtirib, yangi `{ variantlar, togri }` qaytaradi.
 */
export function indekslanganVariantlarniAralashtir(savolObj, raund = 0) {
  const xom = Array.isArray(savolObj?.variantlar) ? savolObj.variantlar : []
  const kalit = savolObj?.savol || savolObj?.vazifa || savolObj?.nom || savolObj?.qotishma || ''
  const aralash = variantlarniAralashtir(xom, kalit, raund)
  const kirishTogri = typeof savolObj?.togri === 'number' ? savolObj.togri : savolObj?.javob
  const yangiTogri = aralash.findIndex((x) => x.origIdx === kirishTogri)
  return {
    variantlar: aralash.map((x) => x.item),
    togri: yangiTogri >= 0 ? yangiTogri : 0,
  }
}
