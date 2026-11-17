// app/sitemap.js
//
// Sitemap — qidiruv tizimlari uchun ochiq sahifalar ro'yxati.
//
// Ro'yxat uch manbadan dublikatlarsiz va `app/robots.js` taqiqlariga qat'iy
// amal qilgan holda yig'iladi (`lib/sitemap-qoidalari.js`):
//   1. `ASOSIY_SAHIFALAR` — ustuvorlik (`priority`) va yangilanish chastotasi;
//   2. `lib/sitemap-royxat.json` — `scripts/gen-sitemap-royxat.js` yig'gan
//      metadata'li statik sahifalar, ochiq fanlar hamda 7–8-sinf tayyor darslari;
//   3. Bazadagi ochiq kanallar (`/kanallar/[slug]`).
import { prisma } from '@/lib/prisma'
import mavzular from '@/lib/sitemap-royxat.json'
import robots from './robots'
import { sitemapYozuvlariniTuz } from '@/lib/sitemap-qoidalari'

export default async function sitemap() {
  const robotsNatija = robots()
  const disallowQoidalari = (robotsNatija.rules || []).flatMap((r) => r.disallow || [])

  let kanallar = []
  try {
    kanallar = await prisma.channel.findMany({
      where: { ochiq: true, faol: true },
      select: { slug: true, updatedAt: true },
    })
  } catch (e) {
    console.error('[Sitemap] kanallar olinmadi:', e.message)
  }

  return sitemapYozuvlariniTuz({
    mavzular,
    kanallar,
    disallowQoidalari,
  })
}
