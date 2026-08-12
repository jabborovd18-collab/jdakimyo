"use client"

import { useCallback, useEffect, useState } from 'react'
import ProfileCollection from '@/components/ProfileCollection'
import FriendRequests from '@/components/FriendRequests'
import FriendSearch from '@/components/FriendSearch'
import Ikon from '@/components/Ikon'

export default function DostlarPage() {
  const [takliflar, setTakliflar] = useState([])
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

  const ozgardi = useCallback(async () => {
    await taklifniYukla()
    setYangilash((n) => n + 1)
  }, [taklifniYukla])

  return (
    <div className="space-y-6 max-w-5xl">
      <FriendRequests requests={takliflar} onUpdate={ozgardi} />

      <ProfileCollection
        type="friends"
        refreshKey={yangilash}
        actions={
          <div className="v3-panel-karta p-4 sm:p-5">
            <FriendSearch onChange={ozgardi} />
          </div>
        }
      />
    </div>
  )
}
