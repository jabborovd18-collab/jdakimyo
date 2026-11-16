import { NextResponse } from 'next/server'
import {
  reaksiyaBalansBoshla,
  reaksiyaBalansOtkaz,
  reaksiyaBalansTekshir,
  reaksiyaBalansTugat,
} from '@/lib/oyinlar/reaksiya-balans-server'

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
    natija = reaksiyaBalansBoshla(body.sozlama || body)
  } else if (amal === 'tekshir') {
    natija = reaksiyaBalansTekshir(body)
  } else if (amal === 'otkaz') {
    natija = reaksiyaBalansOtkaz(body)
  } else if (amal === 'tugat') {
    natija = reaksiyaBalansTugat(body)
  } else {
    return NextResponse.json({ ok: false, xato: 'Noma’lum amal.' }, { status: 400 })
  }

  if (!natija.ok) {
    return NextResponse.json(natija, { status: natija.status || 400 })
  }
  return NextResponse.json(natija)
}
