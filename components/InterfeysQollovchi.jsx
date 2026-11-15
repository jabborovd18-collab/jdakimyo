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
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { KESH_KALITI, keshlaVaQoll, oxirgiQollashVaqti, qoll } from '@/lib/interfeys'
import { profilniYuklabOl } from '@/lib/profil-kesh'

export default function InterfeysQollovchi() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // 1-bosqich: brauzerdagi nusxa
  useEffect(() => {
    try {
      const saqlangan = localStorage.getItem(KESH_KALITI)
      if (saqlangan) qoll(JSON.parse(saqlangan))
    } catch {
      // Buzuq nusxa bo'lsa oddiy sozlama bilan davom etamiz
    }
  }, [])

  // 2-bosqich: serverdagi haqiqiy sozlama (deduplikatsiya va kesh bilan)
  useEffect(() => {
    if (status !== 'authenticated' || pathname === '/profil') return

    let bekor = false
    const boshlandi = Date.now()

    ;(async () => {
      try {
        const data = await profilniYuklabOl({ sessionUser: session?.user })
        if (bekor || !data?.user) return

        if (oxirgiQollashVaqti() > boshlandi) return

        keshlaVaQoll(data.user.interfaceSettings)
      } catch {
        // Sozlama kelmasa brauzerdagi nusxa ishlayveradi
      }
    })()

    return () => { bekor = true }
  }, [status, pathname, session?.user])

  return null
}
