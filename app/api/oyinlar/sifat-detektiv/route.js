import { NextResponse } from 'next/server'
import {
  sifatDetektivAniqla,
  sifatDetektivBoshla,
  sifatDetektivSinov,
  sifatDetektivTugat,
} from '@/lib/oyinlar/sifat-detektiv-server'

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
    natija = sifatDetektivBoshla(body.sozlama || body)
  } else if (amal === 'sinov') {
    natija = sifatDetektivSinov(body)
  } else if (amal === 'aniqla') {
    natija = sifatDetektivAniqla(body)
  } else if (amal === 'tugat') {
    natija = sifatDetektivTugat(body)
  } else {
    return NextResponse.json({ ok: false, xato: 'Noma’lum amal.' }, { status: 400 })
  }

  if (!natija.ok) {
    return NextResponse.json(natija, { status: natija.status || 400 })
  }
  return NextResponse.json(natija)
}
