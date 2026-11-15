// components/DailyMissions.jsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Ikon from './Ikon'

export default function DailyMissions({ onStatsUpdate }) {
  const router = useRouter()
  const [missions, setMissions] = useState([])
  const [stats, setStats] = useState({
    stars: 0,
    weeklyStars: 0,
    monthlyStars: 0,
    totalMissions: 0,
    coins: 0,
    gems: 0,
    todayCompleted: 0,
    todayTotal: 0,
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

      setMissions(data.missions || [])
      setStats(data.stats || {})
    } catch (error) {
      console.error('[DailyMissions] Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteMission = async (missionId, missionType, mission) => {
    if (mission && !mission.tayyor) {
      if (mission.havola) {
        router.push(mission.havola)
      } else {
        toast('Avval vazifani bajaring')
      }
      return
    }

    setCompletingMission(missionId)

    try {
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, actionType: missionType })
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (data.emailKerak) {
          const el = document.getElementById('email-tasdiqlash')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        throw new Error(data.error || 'Missiya bajarilmadi')
      }

      toast.success(data.message)
      fetchMissions()

      if (onStatsUpdate) onStatsUpdate()

      if (data.starEarned) {
        setTimeout(() => {
          toast.success('Tabriklaymiz! Siz bugungi yulduzni oldingiz!', { duration: 5000 })
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
      <div className="v3-panel-karta p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--v3-yuza-2)] rounded w-1/3"></div>
          <div className="h-24 bg-[var(--v3-yuza)] rounded-xl"></div>
        </div>
      </div>
    )
  }

  const progressPercentage =
    stats.todayTotal > 0 ? (stats.todayCompleted / stats.todayTotal) * 100 : 0

  return (
    <div className="v3-panel-karta p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
            <Ikon nom="quiz" olcham={18} />
          </div>
          <div>
            <div className="v3-nishon">Kunlik intizom</div>
            <h2 className="text-sm font-bold text-[var(--v3-matn)]">Kunlik Missiyalar</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--v3-xira)]">
            {stats.todayCompleted}/{stats.todayTotal} bajarildi
          </span>
          {stats.canClaimStars && (
            <span className="v3-tag v3-tag-ochiq font-bold">
              <Ikon nom="yulduz" olcham={11} />
              <span>Yulduz tayyor!</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 bg-[var(--v3-fon-2)] rounded-full overflow-hidden border border-[var(--v3-chiziq)]">
          <div 
            className="h-full bg-[var(--v3-urgu)] rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-2.5">
        {missions.map(mission => (
          <div
            key={mission.id}
            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              mission.completed
                ? 'bg-[var(--v3-yuza)] border-emerald-500/25 opacity-75'
                : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
            }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`font-bold text-xs ${
                  mission.completed ? 'text-emerald-500 line-through' : 'text-[var(--v3-matn)]'
                }`}>
                  {mission.title}
                </h3>
                <span className={`v3-tag text-[10px] font-mono !py-0.5 !px-1.5 ${
                  mission.difficulty === 'easy'
                    ? 'v3-tag-ochiq'
                    : mission.difficulty === 'medium'
                    ? 'v3-tag-yopiq'
                    : 'bg-red-500/10 text-red-500 border border-red-500/25'
                }`}>
                  {mission.difficulty === 'easy' ? 'Oson' : mission.difficulty === 'medium' ? 'O\'rta' : 'Qiyin'}
                </span>
              </div>

              <p className="text-xs text-[var(--v3-xira)] line-clamp-1">
                {mission.description}
              </p>

              <div className="text-[11px] font-mono text-[var(--v3-urgu)]">
                +{mission.xpReward} XP
              </div>
            </div>

            {!mission.completed && (
              <button
                type="button"
                onClick={() => handleCompleteMission(mission.id, mission.type, mission)}
                disabled={completingMission === mission.id}
                className={`v3-tugma text-xs py-1.5 px-3 font-bold shrink-0 ${
                  mission.tayyor ? 'v3-tugma-asosiy' : ''
                }`}
              >
                {completingMission === mission.id ? (
                  <span>...</span>
                ) : mission.tayyor ? (
                  <span>Mukofotni olish</span>
                ) : (
                  <span>Boshlash →</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
