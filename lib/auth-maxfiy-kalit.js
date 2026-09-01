// Vercel Auth integratsiyasi AUTH_SECRET yaratadi; eski lokal muhitlar esa
// NEXTAUTH_SECRET ishlatadi. Bitta helper ularning qaysi biri haqiqiy ekanini
// hal qiladi, aks holda token turlari turli kalitga o'tib ketishi mumkin.
export function authMaxfiyKaliti() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET sozlanmagan')
  }
  return secret
}
