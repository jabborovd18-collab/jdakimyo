"use client"

import { useCallback, useEffect, useState } from 'react'
import ProfileCollection from '@/components/ProfileCollection'
import FriendRequests from '@/components/FriendRequests'
import FriendSearch from '@/components/FriendSearch'

/**
 * Do'stlar sahifasi.
 *
 * Avval bu sahifa faqat mavjud do'stlar ro'yxatini ko'rsatardi. Odam qidirish
 * (FriendSearch) va kelgan taklifga javob berish (FriendRequests) komponentlari
 * loyihada tayyor turardi-yu, hech qayerda ulanmagandi — shu sababli saytda
 * do'st qo'shishning umuman yo'li yo'q edi.
 */
export default function DostlarPage() {
  const [takliflar, setTakliflar] = useState([])
  // Qiymati o'zgarganda do'stlar ro'yxati qayta yuklanadi
  const [yangilash, setYangilash] = useState(0)

  const taklifniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/friends/request')
      if (!res.ok) return
      const data = await res.json()
      setTakliflar(data.requests || [])
    } catch {
      // Takliflar yuklanmasa ham qidiruv va ro'yxat ishlayveradi
    }
  }, [])

  useEffect(() => { taklifniYukla() }, [taklifniYukla])

  // Taklif qabul qilinganda: takliflar ham, do'stlar ro'yxati ham yangilanadi
  const ozgardi = useCallback(async () => {
    await taklifniYukla()
    setYangilash((n) => n + 1)
  }, [taklifniYukla])

  return (
    <div className="space-y-6">
      <FriendRequests requests={takliflar} onUpdate={ozgardi} />

      <ProfileCollection
        type="friends"
        refreshKey={yangilash}
        actions={
          <div className="rounded-2xl border border-purple-700/40 bg-purple-900/20 p-5">
            <FriendSearch onChange={ozgardi} />
          </div>
        }
      />
    </div>
  )
}
