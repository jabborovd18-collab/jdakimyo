// scripts/seed-sea-ms-sinov.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Milliy Sertifikat Sinov Testi #1 (sea-ms-sinov) kiritilmoqda...");

  // O'zbekiston vaqti (UTC+5):
  // 6-sentyabr 17:00 UZT = 6-sentyabr 12:00 UTC
  // 6-sentyabr 00:00 (kechasi) UZT = 6-sentyabr 19:00 UTC
  const startsAt = new Date('2026-09-06T12:00:00.000Z');
  const endsAt = new Date('2026-09-06T19:00:00.000Z');

  const event = await prisma.seasonalPartnership.upsert({
    where: { slug: 'sea-ms-sinov' },
    update: {
      title: 'Milliy Sertifikat Sinov Testi #1',
      partnerName: 'Spectrum Nashriyoti',
      partnerLogo: '/images/hamkorlik/spectrum-logo.png',
      partnerSignName: 'Spectrum Nashriyoti',
      jdaSignName: 'JDA Kimyo Jamoasi',
      certPrefix: 'MS-2026-',
      badgeText: 'MILLIY SERTIFIKAT',
      minPassPercent: 60.0,
      timeLimitMin: 100,
      startsAt,
      endsAt,
      isActive: true,
      isAnnounced: false,
      description: 'Milliy sertifikatga tayyorgarlik 1-sonli rasmiy sinov testi (40 ta savol, 100 minut).'
    },
    create: {
      slug: 'sea-ms-sinov',
      title: 'Milliy Sertifikat Sinov Testi #1',
      partnerName: 'Spectrum Nashriyoti',
      partnerLogo: '/images/hamkorlik/spectrum-logo.png',
      partnerSignName: 'Spectrum Nashriyoti',
      jdaSignName: 'JDA Kimyo Jamoasi',
      certPrefix: 'MS-2026-',
      badgeText: 'MILLIY SERTIFIKAT',
      minPassPercent: 60.0,
      timeLimitMin: 100,
      startsAt,
      endsAt,
      isActive: true,
      isAnnounced: false,
      description: 'Milliy sertifikatga tayyorgarlik 1-sonli rasmiy sinov testi (40 ta savol, 100 minut).'
    }
  });

  console.log(`✅ Muvaffaqiyatli saqlandi: ID = ${event.id}, Slug = ${event.slug}`);
}

main()
  .catch((e) => {
    console.error("❌ Xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
