// app/doska/skaner/page.js
//
// Sayt ichidagi maxsus QR skaner sahifasi (/doska/skaner).
"use client"

import AuthQobiq from '@/components/AuthQobiq'
import DoskaQrSkaner from '@/components/DoskaQrSkaner'

export default function DoskaSkanerSahifa() {
  return (
    <AuthQobiq
      nishon="Sayt ichidagi skaner"
      sarlavha="QR kodni skanerlash"
      izoh="Elektron doska ekranidagi QR kodga kamerani qarating — parol termasdan hisobingizdan ruxsat bering"
      maxWidthClass="max-w-[500px]"
    >
      <DoskaQrSkaner />
    </AuthQobiq>
  )
}
