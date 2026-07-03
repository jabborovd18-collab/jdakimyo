// components/StarsDisplay.jsx
"use client"
import { useState, useEffect } from 'react'

export default function StarsDisplay() {
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      
      if (response.ok) {
        setLeaderboard(data.leaders || [])
      }
    } catch (error) {
      console.error('[Leaderboard] Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-yellow-800/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-yellow-800/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🏆</span>
        Haftalik yetakchilar
      </h2>

      {leaderboard.length > 0 ? (
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-500/50'
                  : index === 1
                  ? 'bg-gradient-to-r from-slate-600/30 to-slate-700/30 border border-slate-500/50'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-800/30 to-orange-900/30 border border-orange-700/50'
                  : 'bg-purple-950/50 border border-purple-700/30'
              }`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                index === 0
                  ? 'bg-yellow-500 text-black'
                  : index === 1
                  ? 'bg-slate-400 text-black'
                  : index === 2
                  ? 'bg-orange-600 text-white'
                  : 'bg-purple-800/50 text-purple-300'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0).toUpperCase()
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {user.fullName || user.username}
                </div>
                <div className="text-xs text-purple-400 truncate">
                  @{user.username}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-yellow-400 font-bold">{user.weeklyStars}</span>
                <span className="text-lg">🌟</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-purple-300 mb-2">Hali reyting shakllanmagan</p>
          <p className="text-xs text-purple-400">
            Missiyalarni bajarib, reytingga kiring!
          </p>
        </div>
      )}
    </div>
  )
}