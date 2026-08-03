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
 * Foydalanuvchining kanali. Hamkor dashboardining kirish nuqtasi.
 *
 * Bitta odamda bitta kanal bo'ladi (hozircha): bir nechta kanal
 * kerak bo'lsa, dashboardga kanal almashtirgich qo'shiladi.
 */
export async function meningKanalim(userId) {
  return prisma.channel.findFirst({
    where: { egaId: userId },
    orderBy: { createdAt: 'asc' },
  })
}

/** Kanal shu odamniki ekanini tekshiradi, aks holda xato tashlaydi */
export async function kanalimniOl(userId) {
  const kanal = await meningKanalim(userId)
  if (!kanal) {
    throw new KanalXatosi(
      'Sizga kanal biriktirilmagan. Kanalni sayt administratori ochadi.',
      404,
    )
  }
  if (!kanal.faol) {
    throw new KanalXatosi('Kanal vaqtincha to\'xtatilgan. Administrator bilan bog\'laning.', 403)
  }
  return kanal
}

/** YouTube havolasidan videoning id sini ajratadi (ko'mish uchun) */
export function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  return m ? m[1] : null
}
