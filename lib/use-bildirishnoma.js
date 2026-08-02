// lib/use-bildirishnoma.js
"use client"
//
// Qizil belgilar uchun sonlarni oladi.
//
// Nega hook: son bir necha joyda kerak (kabinet menyusi, qo'ng'iroq
// tugmasi, bildirishnomalar sahifasi). Har birida alohida `useEffect`
// yozilsa, bittasi yangilanib, ikkinchisi eski sonda qolib ketardi.
import { useCallback, useEffect, useState } from 'react'

/**
 * Fon so'rovi oralig'i.
 *
 * 60 soniya — sezilarli darajada tez, lekin har bir ochiq oynadan
 * daqiqasiga bittadan ko'p so'rov kelmaydi. Ko'rinmayotgan yorliqda
 * umuman so'ralmaydi: fonda turgan oyna serverni bekorga bezovta
 * qilmasligi kerak.
 */
const ORALIQ_MS = 60000

export function useBildirishnomaSanoq() {
  const [sanoq, setSanoq] = useState({ oqilmagan: 0, dostTaklifi: 0, jami: 0 })

  const yangila = useCallback(async () => {
    try {
      const res = await fetch('/api/bildirishnomalar?sanoq=1')
      if (!res.ok) return
      const data = await res.json()
      if (data?.sanoq) setSanoq(data.sanoq)
    } catch {
      // Jim: belgi ko'rinmasligi sahifaning ishlashiga to'sqinlik qilmaydi
    }
  }, [])

  useEffect(() => {
    yangila()

    const oraliq = setInterval(() => {
      if (document.visibilityState === 'visible') yangila()
    }, ORALIQ_MS)

    // Boshqa yorliqda ish qilib qaytganda darhol yangilanadi
    const korinishda = () => {
      if (document.visibilityState === 'visible') yangila()
    }
    document.addEventListener('visibilitychange', korinishda)

    return () => {
      clearInterval(oraliq)
      document.removeEventListener('visibilitychange', korinishda)
    }
  }, [yangila])

  return { sanoq, yangila }
}
