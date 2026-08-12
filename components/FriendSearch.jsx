"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'

export default function FriendSearch({ onChange }) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setUsers([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setUsers(data.users || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Do\'stlik taklifi yuborildi!')
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'sent' } : u
      ))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptFriendRequest = async (user) => {
    if (!user.requestId) {
      toast.error('Taklif topilmadi')
      return
    }

    try {
      const response = await fetch(`/api/friends/request/${user.requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success(data.message || 'Do\'stlik qabul qilindi!')
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, status: 'friend', requestId: null } : u
      ))

      if (onChange) onChange()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="v3-yorliq">Do{"'"}stlarni qidirish</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Username, ism yoki ID bo'yicha qidirish..."
            className="v3-kiritish py-2 pl-9 text-xs"
          />
          <span className="absolute left-3 top-2.5 text-[var(--v3-xira)]">
            <Ikon nom="qidiruv" olcham={14} />
          </span>
        </div>
      </div>

      {showResults && users.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono text-[var(--v3-xira)]">
            {users.length} ta foydalanuvchi topildi:
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {users.map(user => {
              const isFriend = user.status === 'friend'
              const isSent = user.status === 'sent'
              const isReceived = user.status === 'received'

              return (
                <div 
                  key={user.id} 
                  className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center justify-between gap-3 hover:border-[var(--v3-chiziq-2)] transition-all"
                >
                  <Link href={`/profil/${user.userId || user.id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (user.fullName?.[0] || user.username?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                        <span>{user.fullName || user.username}</span>
                        <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" />
                      </div>
                      <div className="text-[10px] text-[var(--v3-xira)] font-mono">
                        @{user.username}
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => isReceived ? acceptFriendRequest(user) : sendFriendRequest(user.id)}
                    disabled={isFriend || isSent}
                    className={`v3-tugma text-xs py-1 px-3 font-semibold shrink-0 ${
                      isFriend
                        ? 'v3-tag-ochiq cursor-default'
                        : isSent
                        ? 'v3-tag-yopiq cursor-default'
                        : isReceived
                        ? 'v3-tugma-asosiy font-bold'
                        : 'hover:border-[var(--v3-urgu)]'
                    }`}
                  >
                    {isFriend ? '✓ Do\'st' : isSent ? 'Yuborildi' : isReceived ? 'Qabul qilish' : '+ Do\'stlashish'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showResults && users.length === 0 && query.length >= 2 && !isLoading && (
        <div className="py-6 text-center text-xs text-[var(--v3-xira)]">
          Foydalanuvchi topilmadi
        </div>
      )}
    </div>
  )
}
