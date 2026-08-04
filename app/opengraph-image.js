// app/opengraph-image.js
//
// Ildizdagi rasm — o'z rasmi bo'lmagan HAMMA sahifa shuni oladi.
// Next.js buni fayl joylashuviga qarab o'zi topadi va `og:image`
// tegini o'zi qo'shadi.
import { ImageResponse } from 'next/og'
import { OgMaket, OG_OLCHAM } from '@/lib/og-maket'

export const alt = 'JDA KIMYO — Kompleks birikmalar kimyosi'
export const size = OG_OLCHAM
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <OgMaket
        sarlavha="Kompleks birikmalar kimyosi"
        tavsif="O'zbek tilida: nazariya, tahlil usullari, 3D modellar va quizlar"
      />
    ),
    size
  )
}
