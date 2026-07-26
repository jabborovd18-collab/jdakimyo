"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

/**
 * Saytga kirganni qayd etadi — kunlik seriya (streak) shu asosda hisoblanadi.
 *
 * Nega kerak: lib/streak.js dagi updateStreak va /api/activity/track
 * allaqachon yozilgan edi, lekin ularni hech kim chaqirmasdi. Natijada
 * barcha foydalanuvchilarda lastActive null, currentStreak va longestStreak
 * esa 0 bo'lib qolgan — profilda "Eng uzun seriya" doim 0 ko'rsatardi.
 *
 * Sessiyaga bir marta yuboriladi: sahifadan sahifaga o'tganda takror
 * so'rov ketmasin. Server tomonda ham bir kunda bir marta hisoblanadi.
 */
export default function ActivityPing() {
  const { status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') return

    const kalit = `faollik:${new Date().toDateString()}`
    try {
      if (sessionStorage.getItem(kalit)) return
      sessionStorage.setItem(kalit, '1')
    } catch {
      // sessionStorage yopiq bo'lsa ham yuboraveramiz
    }

    fetch('/api/activity/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType: 'visit' }),
    }).catch(() => {
      // Seriya yangilanmasa ham sayt ishlashda davom etadi
    })
  }, [status])

  return null
}
