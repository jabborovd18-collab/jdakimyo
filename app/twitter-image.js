// app/twitter-image.js
//
// NEGA ALOHIDA FAYL. `opengraph-image` faqat `og:image` tegini
// qo'yadi; `twitter:image` uchun Next.js alohida fayl kutadi. Layout
// metadata'sida `twitter.card = "summary_large_image"` turibdi, ya'ni
// katta rasm VA'DA QILINGAN — bu fayl bo'lmasa va'da bajarilmaydi.
import { ImageResponse } from 'next/og'
import { OgMaket, OG_OLCHAM } from '@/lib/og-maket'

export const alt = 'JDA KIMYO — Oliy kimyo'
export const size = OG_OLCHAM
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <OgMaket
        sarlavha="Oliy kimyo"
        tavsif="O'zbek tilida: nazariya, tahlil usullari, 3D modellar va quizlar"
      />
    ),
    size
  )
}
