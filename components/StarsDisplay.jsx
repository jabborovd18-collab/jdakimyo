// components/StarsDisplay.jsx
"use client"

import { useState, useEffect } from 'react'
import Ikon from './Ikon'

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
      <div className="v3-panel-karta p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--v3-yuza-2)] rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-[var(--v3-yuza)] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="v3-panel-karta p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-yellow-400 shrink-0">
            <Ikon nom="yulduz" olcham={18} />
          </div>
          <div>
            <div className="v3-nishon">Peshqadamlar</div>
            <h2 className="text-sm font-bold text-[var(--v3-matn)]">Haftalik Yetakchilar</h2>
          </div>
        </div>
      </div>

      {leaderboard.length > 0 ? (
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                index === 0
                  ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm'
                  : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]'
              }`}
            >
              {/* Rank */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                index === 0
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                  : index === 1
                  ? 'bg-slate-400 text-black'
                  : index === 2
                  ? 'bg-amber-700 text-white'
                  : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
              }`}>
                #{index + 1}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (user.fullName?.[0] || user.username?.[0] || 'U').toUpperCase()
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[var(--v3-matn)] truncate">
                  {user.fullName || user.username}
                </div>
                <div className="text-[10px] text-[var(--v3-xira)] font-mono truncate">
                  @{user.username}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs text-yellow-400 font-bold">
                <span>{user.weeklyStars}</span>
                <Ikon nom="yulduz" olcham={13} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[var(--v3-xira)] space-y-1">
          <p className="font-bold text-[var(--v3-matn)]">Hali reyting shakllanmagan</p>
          <p>Missiyalarni bajarib, yulduzlar yig{"'"}ing va birinchi o{"'"}rinni egallang!</p>
        </div>
      )}
    </div>
  )
}
