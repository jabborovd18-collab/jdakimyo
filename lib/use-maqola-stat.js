"use client"

// lib/use-maqola-stat.js
//
// Maqola sanoqchilarini klient tomonda o'qish va oshirish.
// Uchta sahifa (bosh, baza, yangi) va maqola sahifasi shu hookdan foydalanadi.
import { useCallback, useEffect, useState } from 'react'
import { statQoshilgan } from '@/lib/maqolalar'

/**
 * Maqolalar + jonli sanoqchilar.
 *
 * `yuklandi` — sanoqchilar bazadan kelganini bildiradi. Shu paytgacha
 * raqamlar 0 turadi, shuning uchun sahifalar `yuklandi` ni tekshirib
 * "yangilanmoqda" belgisini ko'rsatadi.
 */
export function useMaqolalar() {
  const [maqolalar, setMaqolalar] = useState(() => statQoshilgan(null))
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    let bekor = false

    fetch('/api/maqolalar/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (bekor || !d?.stat) return
        setMaqolalar(statQoshilgan(d.stat))
      })
      .catch(() => {})
      .finally(() => { if (!bekor) setYuklandi(true) })

    return () => { bekor = true }
  }, [])

  /**
   * Fayl yuklab olinganda — sanoqchini oshiradi va ro'yxatdagi raqamni
   * serverdan kelgan qiymatga yangilaydi (sahifani qayta yuklamasdan).
   */
  const yuklashniHisobla = useCallback(async (articleId) => {
    const d = await sanoqchiYubor(articleId, 'yuklash')
    if (!d) return
    setMaqolalar((oldin) =>
      oldin.map((m) =>
        String(m.id) === String(articleId)
          ? { ...m, korishlar: d.views, yuklashlar: d.downloads }
          : m
      )
    )
  }, [])

  return { maqolalar, yuklandi, yuklashniHisobla }
}

/**
 * Sanoqchini oshirish.
 *
 * `birMarta` — sessiya davomida shu maqola uchun faqat bir marta yuborsin.
 * Ko'rish uchun shart: aks holda sahifani yangilagan har safar hisoblanadi.
 * Yuklash uchun shart emas — odam faylni ataylab qayta yuklashi mumkin.
 */
export async function sanoqchiYubor(articleId, tur, { birMarta = false } = {}) {
  const kalit = `maqola:${tur}:${articleId}`

  if (birMarta) {
    try {
      if (sessionStorage.getItem(kalit)) return null
      sessionStorage.setItem(kalit, '1')
    } catch {
      // sessionStorage yopiq (private rejim) — shunchaki yuboramiz
    }
  }

  try {
    const r = await fetch('/api/maqolalar/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: String(articleId), tur }),
    })
    if (!r.ok) return null
    return await r.json()
  } catch {
    // Sanoqchi ishlamasa ham sahifa ishlashda davom etadi
    return null
  }
}

/**
 * Bitta maqolaning sanoqchisi + ochilganda ko'rishni hisoblash.
 * `hisobla` false bo'lsa faqat o'qiydi (masalan maqola hali yuklanmagan).
 */
export function useMaqolaKorish(articleId, hisobla = true) {
  const [stat, setStat] = useState(null)

  useEffect(() => {
    if (!articleId || !hisobla) return
    let bekor = false

    sanoqchiYubor(articleId, 'korish', { birMarta: true }).then((d) => {
      if (bekor) return
      if (d) return setStat({ views: d.views, downloads: d.downloads })

      // Sessiyada allaqachon hisoblangan — joriy holatni o'qib olamiz
      fetch('/api/maqolalar/stats')
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => {
          if (bekor || !s?.stat) return
          const men = s.stat[String(articleId)]
          if (men) setStat(men)
        })
        .catch(() => {})
    })

    return () => { bekor = true }
  }, [articleId, hisobla])

  const yuklashniHisobla = useCallback(async () => {
    const d = await sanoqchiYubor(articleId, 'yuklash')
    if (d) setStat({ views: d.views, downloads: d.downloads })
  }, [articleId])

  return { stat, yuklashniHisobla }
}
