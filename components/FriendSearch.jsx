// components/FriendSearch.jsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function FriendSearch() {
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

    const timeoutId = setTimeout(searchUsers, 300) // Debounce
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

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success('Do\'stlik taklifi yuborildi!')
      
      // Statusni yangilash
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'sent' } : u
      ))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getButtonContent = (status) => {
    switch (status) {
      case 'friend':
        return { text: '✓ Do\'st', disabled: true, className: 'bg-green-600/20 text-green-400 border-green-600/30' }
      case 'sent':
        return { text: '⏳ Yuborildi', disabled: true, className: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' }
      case 'received':
        return { text: '📥 Qabul qilish', disabled: false, className: 'bg-blue-600 hover:bg-blue-500 text-white' }
      default:
        return { text: '+ Qo\'shish', disabled: false, className: 'bg-purple-600 hover:bg-purple-500 text-white' }
    }
  }

  return (
    <div className="relative">
      <div className="mb-4">
        <label className="text-sm text-purple-300 mb-2 block">Do'stlarni qidirish</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Username, ism yoki ID bo'yicha qidirish..."
            className="w-full px-4 py-3 pl-11 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">🔍</span>
          {isLoading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
              ⏳
            </span>
          )}
        </div>
      </div>

      {showResults && users.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">
            Topilgan foydalanuvchilar ({users.length})
          </h3>
          {users.map(user => {
            const button = getButtonContent(user.status)
            
            return (
              <div 
                key={user.id} 
                className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 flex items-center gap-4 hover:border-yellow-500/50 transition-all"
              >
                <Link href={`/profil/${user.userId}`} className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold text-black flex-shrink-0">
                    {user.fullName?.charAt(0)?.toUpperCase() || user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{user.fullName || user.username}</div>
                    <div className="text-xs text-purple-400">
                      @{user.username} • ID: {user.userId}
                    </div>
                    {user.university && (
                      <div className="text-xs text-purple-500 mt-0.5">🏛️ {user.university}</div>
                    )}
                  </div>
                </Link>

                <button
                  onClick={() => sendFriendRequest(user.id)}
                  disabled={button.disabled}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all disabled:cursor-not-allowed ${button.className}`}
                >
                  {button.text}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showResults && users.length === 0 && query.length >= 2 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-purple-400">Hech kim topilmadi</p>
        </div>
      )}
    </div>
  )
}