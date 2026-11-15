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
const KESH_YOSHI_MS = 15000
const SANOQ_KESH_KALITI = 'jda-bildirishnoma-sanoq-v1'

let xotiraSanoq = null // { timestamp, sanoq }
let joriySanoqSorov = null

function boshlangichSanoq() {
  if (xotiraSanoq?.sanoq) return xotiraSanoq.sanoq
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(SANOQ_KESH_KALITI)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.sanoq) {
          xotiraSanoq = parsed
          return parsed.sanoq
        }
      }
    } catch {
      // sessionStorage xatosi o'tkazib yuboriladi
    }
  }
  return { oqilmagan: 0, dostTaklifi: 0, ustozTaklifi: 0, chat: 0, jami: 0 }
}

/**
 * @param {boolean} faol  so'rov yuborilsinmi
 *
 * Nega bayroq kerak: bu hook endi bosh sahifa sarlavhasida ham ishlatiladi,
 * u yerda esa mehmonlar (tizimga kirmaganlar) ko'p. Ular uchun so'rov har
 * safar 401 qaytaradi — foydasi yo'q, lekin har ochilgan sahifa uchun
 * bittadan bekor so'rov degani.
 */
export function useBildirishnomaSanoq(faol = true) {
  const [sanoq, setSanoq] = useState(boshlangichSanoq)

  const yangila = useCallback(async (majburiy = false) => {
    if (!faol) return
    if (!majburiy && xotiraSanoq?.sanoq && Date.now() - (xotiraSanoq.timestamp || 0) < KESH_YOSHI_MS) {
      setSanoq(xotiraSanoq.sanoq)
      return
    }
    try {
      if (!joriySanoqSorov) {
        joriySanoqSorov = fetch('/api/bildirishnomalar?sanoq=1')
          .then((res) => (res.ok ? res.json() : null))
          .finally(() => {
            joriySanoqSorov = null
          })
      }
      const data = await joriySanoqSorov
      if (data?.sanoq) {
        const yozuv = { timestamp: Date.now(), sanoq: data.sanoq }
        xotiraSanoq = yozuv
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(SANOQ_KESH_KALITI, JSON.stringify(yozuv))
          } catch {
            // jim
          }
        }
        setSanoq(data.sanoq)
      }
    } catch {
      // Jim: belgi ko'rinmasligi sahifaning ishlashiga to'sqinlik qilmaydi
    }
  }, [faol])

  useEffect(() => {
    if (!faol) return
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
  }, [faol, yangila])

  return { sanoq, yangila }
}
