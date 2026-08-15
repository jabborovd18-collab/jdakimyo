// app/ilmiy/tahlil/[usul]/birikmalar/page.js
//
// Usul bo'yicha birikmalar ro'yxati.
//
// NEGA REGISTRDAN QURILADI. Eski ro'yxat (`nmr/birikmalar/page.js`,
// 823 qator) har bir birikmaning formulasi, izohi va HAVOLASINI qo'lda
// takrorlagan. Natijada ro'yxat va sahifalar bir-biridan uziladi:
// `/ilmiy/birikmalar` da aynan shu sabab 4 ta havola 404 ga olib
// borgan va 13 ta sahifa umuman ro'yxatga tushmay yetim qolgan.
//
// Bu yerda ro'yxat ma'lumotning O'ZIDAN chiqadi, ya'ni bunday farq
// paydo bo'lishi mumkin emas.

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { USULLAR } from '@/data/ilmiy/tahlil/_usullar'
import { MALUMOTLAR } from '@/data/ilmiy/tahlil/indeks'
import { Blok, Belgi, Formula } from '@/components/ilmiy/Qobiq'
import IlmiyBoshPanel from '@/components/ilmiy/IlmiyBoshPanel'
import Ikon from '@/components/Ikon'

export function generateStaticParams() {
  return Object.keys(MALUMOTLAR).map((usul) => ({ usul }))
}

export const dynamicParams = false

export async function generateMetadata({ params }) {
  const { usul } = await params
  const u = USULLAR[usul]
  if (!u) return {}
  const soni = Object.keys(MALUMOTLAR[usul] || {}).length
  return {
    title: `${u.nom} — birikmalar tahlili`,
    description: `${soni} ta kompleks birikmaning ${u.toliqNom.toLowerCase()} tahlili: kimyoviy siljish, simmetriya, kristall maydon parametrlari va laboratoriya tartibi.`,
    alternates: { canonical: `/ilmiy/tahlil/${usul}/birikmalar` },
  }
}

export default async function BirikmalarRoyxati({ params }) {
  const { usul } = await params
  const u = USULLAR[usul]
  const baza = MALUMOTLAR[usul]
  if (!u || !baza) notFound()

  const tartib = u.tartib || Object.keys(baza)

  return (
    <main className="v3-ilmiy">
      <IlmiyBoshPanel
        bandlar={[
          { nom: 'Ilmiy', havola: '/ilmiy' },
          { nom: 'Tahlil usullari', havola: '/ilmiy/tahlil' },
          { nom: u.nom, havola: `/ilmiy/tahlil/${usul}` },
          { nom: 'Birikmalar' },
        ]}
      />

      <header className="v3-ilmiy-hero">
        <div
          className="v3-ilmiy-formula"
          style={{ fontSize: 'clamp(22px, 5vw, 34px)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <Ikon nom={u.ikon} olcham={30} />
          {u.nom} — birikmalar
        </div>
        <p className="v3-ilmiy-iupac">{u.tavsif}</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Belgi turi="urgu">{tartib.length} ta birikma</Belgi>
          {u.olchaydi?.map((x) => (
            <Belgi key={x}>{x}</Belgi>
          ))}
        </div>
      </header>

      <Blok sarlavha="Tahlil qilingan birikmalar" ikon="kolba">
        <div className="v3-ilmiy-grid ikki">
          {tartib.map((slug) => {
            const m = baza[slug]
            if (!m) return null
            return (
              <Link
                key={slug}
                href={`/ilmiy/tahlil/${usul}/birikmalar/${slug}`}
                className="v3-ilmiy-panel"
                style={{ display: 'block' }}
              >
                <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>
                  <Formula html={m.formulaHTML} />
                </div>
                <p style={{ fontSize: 12.5, opacity: 0.75, marginBottom: 10 }}>{m.iupac}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.commonName && <Belgi turi="urgu">{m.commonName}</Belgi>}
                  <Belgi turi="ikkinchi">{m.pointGroup}</Belgi>
                  {m.color && <Belgi>{m.color}</Belgi>}
                </div>
              </Link>
            )
          })}
        </div>
      </Blok>
    </main>
  )
}
