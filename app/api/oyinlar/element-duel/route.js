import { NextResponse } from 'next/server'
import {
  elementDuelBoshla,
  elementDuelJavob,
  elementDuelTugat,
  elementDuelYordam,
} from '@/lib/oyinlar/element-duel-server'

export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, xato: 'So‘rov formati noto‘g‘ri.' }, { status: 400 })
  }

  const amal = body.amal || 'boshlash'
  let natija

  if (amal === 'boshlash') {
    natija = elementDuelBoshla(body.sozlama || body)
  } else if (amal === 'javob') {
    natija = elementDuelJavob(body)
  } else if (amal === 'yordam') {
    natija = elementDuelYordam(body)
  } else if (amal === 'tugat') {
    natija = elementDuelTugat(body)
  } else {
    return NextResponse.json({ ok: false, xato: 'Noma’lum amal.' }, { status: 400 })
  }

  if (!natija.ok) {
    return NextResponse.json(natija, { status: natija.status || 400 })
  }
  return NextResponse.json(natija)
}
