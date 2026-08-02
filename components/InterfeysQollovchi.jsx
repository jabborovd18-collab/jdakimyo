// components/InterfeysQollovchi.jsx
"use client"
//
// Foydalanuvchining interfeys sozlamasini butun saytga qo'llaydi.
//
// Ildiz layout'da turadi va hech narsa chizmaydi — faqat <html> ustidagi
// atributlarni o'rnatadi.
//
// IKKI BOSQICH. Avval brauzerdagi nusxa qo'llanadi (darhol, so'rovsiz),
// keyin serverdan yangisi kelib ustiga yoziladi. Aks holda har sahifa
// ochilishida shrift avval oddiy, keyin katta bo'lib "sakrab" ketardi.
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { KESH_KALITI, keshlaVaQoll, oxirgiQollashVaqti, qoll } from '@/lib/interfeys'

export default function InterfeysQollovchi() {
  const { status } = useSession()

  // 1-bosqich: brauzerdagi nusxa
  useEffect(() => {
    try {
      const saqlangan = localStorage.getItem(KESH_KALITI)
      if (saqlangan) qoll(JSON.parse(saqlangan))
    } catch {
      // Buzuq nusxa bo'lsa oddiy sozlama bilan davom etamiz
    }
  }, [])

  // 2-bosqich: serverdagi haqiqiy sozlama
  useEffect(() => {
    if (status !== 'authenticated') return

    let bekor = false
    const boshlandi = Date.now()

    ;(async () => {
      try {
        const res = await fetch('/api/profil')
        if (!res.ok) return
        const data = await res.json()
        if (bekor || !data?.user) return

        // So'rov ketayotganda foydalanuvchi sozlamani o'zgartirgan bo'lsa
        // (masalan sozlamalar sahifasida shriftni tanlagan), kechikkan
        // javob uning tanlovini bosib qo'ymasin.
        if (oxirgiQollashVaqti() > boshlandi) return

        keshlaVaQoll(data.user.interfaceSettings)
      } catch {
        // Sozlama kelmasa brauzerdagi nusxa ishlayveradi
      }
    })()

    return () => { bekor = true }
  }, [status])

  return null
}
