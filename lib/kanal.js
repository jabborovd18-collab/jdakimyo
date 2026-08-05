// lib/kanal.js
//
// Kanal bilan ishlashning umumiy qismi: slug yasash, egalikni tekshirish
// va ko'rinish uchun tayyorlash.
//
// Nega alohida: kanalga uch tomondan tegiladi — hamkor dashboardi, ochiq
// katalog va admin paneli. Tekshiruvlar har birida alohida yozilsa,
// "kanal faol emas" yoki "bu kanal seniki emas" degan shart bir joyda
// unutilib qolardi.
import { prisma } from './prisma'

export const KANAL_TURLARI = [
  { id: 'talim', nom: "Ta'lim kanali", icon: '📚' },
  { id: 'ilmiy', nom: 'Ilmiy kanal', icon: '🔬' },
  { id: 'amaliy', nom: 'Amaliy kanal', icon: '🧪' },
]

export class KanalXatosi extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'KanalXatosi'
    this.status = status
  }
}

/**
 * Nomdan manzil qismini yasaydi: "Tushunarli Kimyo" → "tushunarli-kimyo".
 *
 * O'zbekcha apostrof (' va ’) olib tashlanadi, chunki u manzilda
 * kodlanib ketadi va havola o'qib bo'lmaydigan bo'lib qoladi.
 */
export function slugYasa(nom) {
  return String(nom || '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/** Slug band bo'lsa oxiriga raqam qo'shadi: tushunarli-kimyo-2 */
export async function boshSlug(xom) {
  const asos = slugYasa(xom) || 'kanal'
  let slug = asos

  for (let i = 2; i < 50; i++) {
    const bor = await prisma.channel.findUnique({ where: { slug }, select: { id: true } })
    if (!bor) return slug
    slug = `${asos}-${i}`
  }

  // Deyarli imkonsiz holat, lekin cheksiz sikl bo'lmasin
  return `${asos}-${Date.now().toString(36)}`
}

/**
 * Foydalanuvchining BARCHA kanallari.
 *
 * Ilgari bu yerda `findFirst` turardi va bitta odamda bitta kanal
 * bo'ladi deb hisoblanardi. Amalda ikkinchi kanal ochilishi bilan
 * ikkinchisiga umuman kirib bo'lmay qoldi: dashboard doim eng
 * eskisini ochardi va almashtirish yo'li yo'q edi.
 */
export async function kanallarim(userId) {
  return prisma.channel.findMany({
    where: { egaId: userId },
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * Tanlov qilinmaganda ochiladigan kanal.
 *
 * AVVAL FAOLI QIDIRILADI. Ilgari shunchaki eng eskisi olinardi va u
 * to'xtatilgan bo'lsa, butun dashboard "Kanal vaqtincha to'xtatilgan"
 * xatosi bilan yopilardi — hamkorning boshqa, ISHLAYOTGAN kanaliga
 * ham kirib bo'lmasdi. Faoli topilmasa, to'xtatilganini qaytaramiz:
 * xato xabari shundagina to'g'ri bo'ladi.
 */
export async function meningKanalim(userId) {
  const faol = await prisma.channel.findFirst({
    where: { egaId: userId, faol: true },
    orderBy: { createdAt: 'asc' },
  })
  if (faol) return faol

  return prisma.channel.findFirst({
    where: { egaId: userId },
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * Kanal shu odamniki ekanini tekshiradi, aks holda xato tashlaydi.
 *
 * @param {string} userId
 * @param {string} [kanalId] Tanlangan kanal. Berilmasa — birinchisi.
 *
 * EGALIK SHU YERDA TEKSHIRILADI. `kanalId` mijozdan keladi, ya'ni
 * uni istalgan qiymatga almashtirib yuborish mumkin. Tekshiruv
 * `egaId` shartida: begona kanal id si berilsa, natija umuman
 * topilmaydi va "sizniki emas" degan xato chiqadi.
 */
export async function kanalimniOl(userId, kanalId = null) {
  const kanal = kanalId
    ? await prisma.channel.findFirst({ where: { id: kanalId, egaId: userId } })
    : await meningKanalim(userId)

  if (!kanal) {
    throw new KanalXatosi(
      kanalId
        ? 'Bunday kanal topilmadi yoki u sizga tegishli emas.'
        : 'Sizga kanal biriktirilmagan. Kanalni sayt administratori ochadi.',
      404,
    )
  }
  if (!kanal.faol) {
    throw new KanalXatosi('Kanal vaqtincha to\'xtatilgan. Administrator bilan bog\'laning.', 403)
  }
  return kanal
}

/**
 * So'rovdan tanlangan kanal id sini oladi.
 *
 * GET da manzil parametri, qolganlarida tana ichida keladi — shuning
 * uchun ikkalasi ham bir joyda qaraladi.
 */
export function sorovdanKanalId(request, body = null) {
  if (body && typeof body.kanalId === 'string' && body.kanalId) return body.kanalId
  try {
    return new URL(request.url).searchParams.get('kanal') || null
  } catch {
    return null
  }
}

/** YouTube havolasidan videoning id sini ajratadi (ko'mish uchun) */
export function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  return m ? m[1] : null
}
