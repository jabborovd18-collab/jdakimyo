// scripts/seed-mavsumiy-alchemiq.js
// AlchemIQ & JDA Kimyo mavsumiy hamkorlik tadbirini bazaga kiritish
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 AlchemIQ & JDA Kimyo mavsumiy hamkorlik tadbiri kiritilmoqda...")

  const startsAt = new Date()
  const endsAt = new Date(Date.now() + 14 * 24 * 3600 * 1000)

  const event = await prisma.seasonalPartnership.upsert({
    where: { slug: 'alchemiq' },
    update: {
      title: 'DTM Sinov Testi',
      partnerName: 'AlchemIQ',
      partnerSignName: 'AlchemIQ Sardor Ergashev',
      jdaSignName: 'JDA Kimyo Jamoasi',
      certPrefix: 'AK-JK-2025-',
      badgeText: 'YUKORI NATIJA',
      minPassPercent: 75.0,
      timeLimitMin: 40,
      startsAt,
      endsAt,
      isActive: true,
      certReason: 'AlchemIQ va JDA Kimyo tomonidan tashkil etilgan DTM SINOV TESTIDA yuqori natija ko\'rsatganligi va bilim darajasining a\'lo darajada ekanligi uchun taqdim etiladi.',
      description: 'AlchemIQ va JDA Kimyo hamkorligidagi rasmiy DTM sinov testi.'
    },
    create: {
      slug: 'alchemiq',
      title: 'DTM Sinov Testi',
      partnerName: 'AlchemIQ',
      partnerSignName: 'AlchemIQ Sardor Ergashev',
      jdaSignName: 'JDA Kimyo Jamoasi',
      certPrefix: 'AK-JK-2025-',
      badgeText: 'YUKORI NATIJA',
      minPassPercent: 75.0,
      timeLimitMin: 40,
      startsAt,
      endsAt,
      isActive: true,
      certReason: 'AlchemIQ va JDA Kimyo tomonidan tashkil etilgan DTM SINOV TESTIDA yuqori natija ko\'rsatganligi va bilim darajasining a\'lo darajada ekanligi uchun taqdim etiladi.',
      description: 'AlchemIQ va JDA Kimyo hamkorligidagi rasmiy DTM sinov testi.'
    }
  })

  console.log(`✅ Muvaffaqiyatli saqlandi: ID = ${event.id}, Slug = ${event.slug}`)
}

main()
  .catch((e) => {
    console.error("❌ Xatolik:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
