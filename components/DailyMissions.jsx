// components/DailyMissions.jsx
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function DailyMissions({ onStatsUpdate }) {
  const [missions, setMissions] = useState([])
  const [stats, setStats] = useState({
    stars: 0,
    weeklyStars: 0,
    monthlyStars: 0,
    totalMissions: 0,
    todayCompleted: 0,
    todayTotal: 3,
    canClaimStars: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [completingMission, setCompletingMission] = useState(null)

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions/daily')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }

      setMissions(data.missions)
      setStats(data.stats)
    } catch (error) {
      console.error('[DailyMissions] Error:', error)
      toast.error('Missiyalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteMission = async (missionId, missionType) => {
    setCompletingMission(missionId)
    
    try {
      // Missiya turiga qarab amalni bajarish
      if (missionType === 'quiz') {
        // Quiz sahifasiga yo'naltirish
        window.location.href = '/oquv/video-darsliklar/quiz'
        return
      } else if (missionType === 'video') {
        // Video darslar sahifasiga yo'naltirish
        window.location.href = '/oquv/video-darsliklar'
        return
      } else if (missionType === 'friend') {
        // Do'st qo'shish - profilga yo'naltirish
        window.location.href = '/profil?tab=friends'
        return
      }

      // Missiyani bajarilgan deb belgilash
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, actionType: missionType })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      
      // Missiyalarni qayta yuklash
      fetchMissions()
      
      // Parent componentga yangilanish haqida xabar berish
      if (onStatsUpdate) {
        onStatsUpdate()
      }

      // Agar yulduz berilgan bo'lsa
      if (data.starEarned) {
        setTimeout(() => {
          toast.success('🌟 Tabriklaymiz! Siz bugungi yulduzni oldingiz!', {
            duration: 5000
          })
        }, 1000)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCompletingMission(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-800/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-purple-800/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = (stats.todayCompleted / stats.todayTotal) * 100

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>🎯</span>
          Kunlik missiyalar
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-300">
            {stats.todayCompleted}/{stats.todayTotal} bajarildi
          </span>
          {stats.canClaimStars && (
            <span className="px-2 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded-full text-xs text-yellow-400 font-bold animate-pulse">
              🌟 Yulduz tayyor!
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-purple-950/70 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {missions.map(mission => (
          <div
            key={mission.id}
            className={`bg-purple-950/50 rounded-xl p-4 border transition-all ${
              mission.completed
                ? 'border-green-600/50 bg-green-900/20'
                : 'border-purple-700/30 hover:border-yellow-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                mission.completed
                  ? 'bg-green-600/30'
                  : 'bg-purple-800/50'
              }`}>
                {mission.completed ? '✅' : mission.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${
                    mission.completed ? 'text-green-400 line-through' : 'text-white'
                  }`}>
                    {mission.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    mission.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
                    mission.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {mission.difficulty === 'easy' ? 'Oson' :
                     mission.difficulty === 'medium' ? 'O\'rta' : 'Qiyin'}
                  </span>
                </div>
                <p className="text-sm text-purple-300 mb-2">
                  {mission.description}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-yellow-400 font-bold">
                    +{mission.xpReward} XP
                  </span>
                  {mission.completed && mission.completedAt && (
                    <span className="text-green-400">
                      ✓ {new Date(mission.completedAt).toLocaleTimeString('uz-UZ', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {!mission.completed && (
                <button
                  onClick={() => handleCompleteMission(mission.id, mission.type)}
                  disabled={completingMission === mission.id}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm flex-shrink-0"
                >
                  {completingMission === mission.id ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span>Bajarish</span>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 pt-4 border-t border-purple-700/30 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.stars}</div>
          <div className="text-xs text-purple-300">Umumiy 🌟</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.weeklyStars}</div>
          <div className="text-xs text-purple-300">Haftalik 🌟</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{stats.monthlyStars}</div>
          <div className="text-xs text-purple-300">Oylik 🌟</div>
        </div>
      </div>
    </div>
  )
}