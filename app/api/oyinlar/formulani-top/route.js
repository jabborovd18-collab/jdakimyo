import { javobniBaho, oyinniBoshla } from '@/lib/formulani-top-server'

export async function POST(request) {
  const tana = await request.json().catch(() => null)
  if (tana?.amal === 'boshlash') {
    const savol = oyinniBoshla(tana.daraja)
    if (savol) return Response.json(savol)
  }

  if (tana?.amal === 'javob') {
    const natija = javobniBaho(tana.token, tana.tanlov)
    if (natija) return Response.json(natija)
    return Response.json({ xato: 'Savol eskirgan yoki javob yaroqsiz. Raundni qayta boshlang.' }, { status: 400 })
  }

  return Response.json({ xato: 'O‘yin so‘rovi yaroqsiz.' }, { status: 400 })
}
