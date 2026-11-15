// app/doska/auth/layout.js
//
// Elektron doskaga QR bilan kirish sahifalari qidiruv tizimlarida
// indekslanmasligi kerak.
export const metadata = {
  title: 'Elektron doska — QR bilan kirish',
  robots: { index: false, follow: false },
}

export default function DoskaAuthLayout({ children }) {
  return children
}
