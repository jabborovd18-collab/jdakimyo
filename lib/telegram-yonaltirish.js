/**
 * Guruh xabari AI uchun ataylab yuborilganmi?
 *
 * Faqat aniq `@bot_nomi` tegi qabul qilinadi. Reply, `/ai` yoki bot
 * nomining oddiy matnda uchrashi yetarli emas: katta guruhda ular
 * tasodifiy va qimmat AI chaqiruvlarini boshlab yuborishi mumkin.
 */
export function guruhAiChaqirildimi(matn, botNomi) {
  const nom = String(botNomi || '')
    .replace(/^@/, '')
    .trim()
    .toLowerCase()

  if (!nom) return false

  const xabar = String(matn || '').toLowerCase()
  const himoyalanganNom = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z0-9_])@${himoyalanganNom}(?![a-z0-9_])`, 'i').test(xabar)
}
