import { javobniBaho, kartaAmali, oyinniBoshla } from '@/lib/formulani-top-server'

const KARTA_AMALLARI = new Set([
  'karta',
  'karta-yangi',
  'karta-muddat',
  'karta-bekor',
  'tuzoq-qabul',
  'pauza',
  'davom',
  'tugat',
])

export async function POST(request) {
  const tana = await request.json().catch(() => null)
  if (!tana || typeof tana !== 'object') {
    return Response.json({ xato: 'O‘yin so‘rovi yaroqsiz.' }, { status: 400 })
  }

  if (tana.amal === 'boshlash') {
    const savol = oyinniBoshla(tana.sozlama ?? tana.daraja)
    if (savol) return Response.json(savol)
  }

  if (tana.amal === 'javob') {
    const natija = javobniBaho(tana.token, tana.tanlov, { oyinchi: tana.oyinchi })
    if (natija) return Response.json(natija)
    return Response.json({ xato: 'Savol eskirgan yoki javob yaroqsiz. Raundni qayta boshlang.' }, { status: 400 })
  }

  if (KARTA_AMALLARI.has(tana.amal)) {
    const natija = kartaAmali(tana.token, tana.amal, tana)
    if (natija) return Response.json(natija)
    return Response.json({ xato: 'O‘yin holati eskirgan. Qayta boshlang.' }, { status: 400 })
  }

  return Response.json({ xato: 'O‘yin so‘rovi yaroqsiz.' }, { status: 400 })
}
