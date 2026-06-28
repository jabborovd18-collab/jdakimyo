// app/profil/[userId]/page.js
"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PublicProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [friendshipStatus, setFriendshipStatus] = useState('none')

  useEffect(() => {
    if (params?.userId) {
      fetchProfile()
    }
  }, [params?.userId])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('[Frontend] Fetching profile for userId:', params.userId)
      
      const response = await fetch(`/api/users/${params.userId}`)
      const data = await response.json()
      
      console.log('[Frontend] API Response:', { ok: response.ok, data })
      
      if (!response.ok) {
        throw new Error(data.error || 'Foydalanuvchi topilmadi')
      }

      setProfile(data)
      setFriendshipStatus(data.friendshipStatus || 'none')
    } catch (error) {
      console.error('[Frontend] Error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const sendFriendRequest = async () => {
    if (!session) {
      toast.error('Avval tizimga kiring')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: profile.user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success('Do\'stlik taklifi yuborildi!')
      setFriendshipStatus('sent')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleFriendRequest = async (action) => {
    try {
      const response = await fetch(`/api/friends/request/${profile.requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      fetchProfile()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl mb-4 animate-pulse">
            ⏳
          </div>
          <div className="text-purple-300 text-lg">Profil yuklanmoqda...</div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Profil topilmadi</h2>
          <p className="text-purple-300 mb-6">{error || 'Noma\'lum xatolik'}</p>
          <Link 
            href="/profil"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ← Profilga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { user, friends, achievements, quizResults } = profile

  const roleLabels = {
    bakalavr: '🎓 Bakalavr',
    magistr: '📚 Magistr',
    doktorant: '🔬 Doktorant',
    professor: '👨‍🏫 Professor',
    mustaqil: '🧑‍🎓 Mustaqil'
  }

  // O'z profili - redirect
  if (session?.user?.userId === user.userId) {
    router.push('/profil')
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2"
          >
            <span>←</span>
            <span>Orqaga</span>
          </button>
          <div className="h-6 w-px bg-purple-800"></div>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JDA KIMYO
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl font-bold text-black shadow-2xl shadow-yellow-500/30">
              {user.fullName?.charAt(0)?.toUpperCase() || user.username.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{user.fullName || user.username}</h1>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-800/50 border border-purple-700/50 rounded-full text-sm text-purple-200">
                  @{user.username}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-full text-sm text-yellow-300 font-bold">
                  🆔 {user.userId}
                </span>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-sm">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>

              {user.university && (
                <div className="text-purple-200 text-sm mb-2 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>{user.university}</span>
                  {user.faculty && <span className="text-purple-400">• {user.faculty}</span>}
                </div>
              )}

              {user.bio && (
                <p className="text-purple-200 mt-3 leading-relaxed max-w-2xl italic">
                  "{user.bio}"
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {friendshipStatus === 'none' && session && (
                <button
                  onClick={sendFriendRequest}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Do'stlik taklif qilish</span>
                </button>
              )}

              {friendshipStatus === 'sent' && (
                <div className="px-6 py-3 bg-yellow-600/20 border border-yellow-600/30 rounded-xl text-yellow-400 font-semibold flex items-center gap-2">
                  <span>⏳</span>
                  <span>Taklif yuborildi</span>
                </div>
              )}

              {friendshipStatus === 'received' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFriendRequest('accept')}
                    className="px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>Qabul</span>
                  </button>
                  <button
                    onClick={() => handleFriendRequest('reject')}
                    className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>✗</span>
                    <span>Rad</span>
                  </button>
                </div>
              )}

              {friendshipStatus === 'friend' && (
                <div className="px-6 py-3 bg-green-600/20 border border-green-600/30 rounded-xl text-green-400 font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Do'stlar</span>
                </div>
              )}

              {!session && (
                <Link
                  href="/login"
                  className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold text-center"
                >
                  Do'st bo'lish uchun kiring
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">Lvl {user.level_points}</div>
            <div className="text-xs text-purple-300">Daraja</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{user.totalPoints}</div>
            <div className="text-xs text-purple-300">Umumiy ball</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{friends.length}</div>
            <div className="text-xs text-purple-300">Do'stlar</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{quizResults.length}</div>
            <div className="text-xs text-purple-300">Quizlar</div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🏅</span>
              Yutuqlar ({achievements.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm text-white mb-1">{achievement.name}</div>
                  <div className="text-xs text-purple-400">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends */}
        {friends.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👥</span>
              Do'stlar ({friends.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {friends.map(friend => (
                <Link 
                  key={friend.id} 
                  href={`/profil/${friend.userId}`}
                  className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30 hover:border-yellow-500/50 transition-all"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold mb-2">
                    {friend.fullName?.charAt(0)?.toUpperCase() || friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-semibold text-sm">{friend.fullName || friend.username}</div>
                  <div className="text-xs text-purple-400">@{friend.username}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}