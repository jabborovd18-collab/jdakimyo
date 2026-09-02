// Saytdagi haqiqiy role qiymatlariga mos kunlik AI limitlari.
// Alohida sof modul bo'lishi role regressiyasini bazasiz sinash imkonini beradi.
const LIMITLAR = {
  bakalavr: 25,
  magistr: 25,
  mustaqil: 25,
  doktorant: 60,
  professor: 60,
  teacher: 1000,
  ustoz: 1000,
  moderator: 25,
  hamkor: 25,
  admin: 99999,
  superadmin: 99999,
}
export function aiKunlikLimit(userRole = 'bakalavr', isTeacher = false, limitlar = LIMITLAR) {
  const role = String(userRole || 'bakalavr').toLowerCase()
  if (['admin', 'superadmin'].includes(role)) return limitlar[role]
  if (isTeacher) return limitlar.teacher
  return limitlar[role] || limitlar.bakalavr
}
