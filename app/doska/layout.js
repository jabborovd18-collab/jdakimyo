// app/doska/layout.js
//
// Doska sahifalari kirish ekrani — qidiruvda chiqishi kerak emas.
// Sahifalarning o'zi "use client", ya'ni ulardan metadata eksport
// qilib bo'lmaydi; shuning uchun shu yupqa qatlam.
export const metadata = {
  title: 'Elektron doska',
  robots: { index: false, follow: false },
}

export default function DoskaLayout({ children }) {
  return children
}
