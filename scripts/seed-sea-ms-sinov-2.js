const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Milliy Sertifikat Sinov Testi #2 (sea-ms-sinov-2) kiritilmoqda...");

  // O'zbekiston vaqti (UTC+5): 8-sentyabr 17:00 dan 9-sentyabr 00:00 gacha.
  const startsAt = new Date('2026-09-08T12:00:00.000Z');
  const endsAt = new Date('2026-09-08T19:00:00.000Z');
  const data = {
    title: 'Milliy Sertifikat Sinov Testi #2',
    partnerName: 'SEA Kimyo',
    partnerLogo: '/images/hamkorlik/sea-kimyo-logo.png',
    partnerSignName: 'SEA Kimyo',
    jdaSignName: 'JDA Kimyo Jamoasi',
    certPrefix: 'MS-2026-',
    badgeText: 'MILLIY SERTIFIKAT',
    minPassPercent: 0,
    timeLimitMin: 100,
    startsAt,
    endsAt,
    isActive: true,
    isAnnounced: false,
    description: 'SEA Kimyo va JDA Kimyo hamkorligida Milliy sertifikatga tayyorgarlik 2-sonli rasmiy sinov testi. Bilimni sinash va mustahkamlash uchun (40 ta savol, 100 daqiqa).'
  };

  const event = await prisma.seasonalPartnership.upsert({
    where: { slug: 'sea-ms-sinov-2' },
    update: data,
    create: { slug: 'sea-ms-sinov-2', ...data }
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
