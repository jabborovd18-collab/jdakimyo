"use client"
import { sana } from '@/lib/sana'
import { useState, useEffect } from 'react'

export default function ActivityHeatmap({ userId }) {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('all')

  useEffect(() => {
    fetchActivityHistory()
  }, [])

  const fetchActivityHistory = async () => {
    try {
      const response = await fetch('/api/activity/history?days=365')
      const data = await response.json()
      
      if (response.ok && data.activities) {
        setActivities(data.activities)
      }
    } catch (error) {
      console.error('[ActivityHeatmap] Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Faoliyat darajasini aniqlash (0-4)
  const getActivityLevel = (totalActivities) => {
    if (totalActivities === 0) return 0
    if (totalActivities === 1) return 1
    if (totalActivities <= 3) return 2
    if (totalActivities <= 6) return 3
    return 4
  }

  // Rang sxemasi (GitHub-style)
  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-purple-950/50 border-purple-800/30'
      case 1: return 'bg-purple-700/60 border-purple-600/50'
      case 2: return 'bg-purple-600/70 border-purple-500/60'
      case 3: return 'bg-purple-500/80 border-purple-400/70'
      case 4: return 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400/80'
      default: return 'bg-purple-950/50 border-purple-800/30'
    }
  }

  // Hafta kunlari
  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']
  
  // Oylar
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']

  // Jami statistika
  const totalActivities = activities.reduce((sum, a) => sum + a.totalActivities, 0)
  const activeDays = activities.filter(a => a.totalActivities > 0).length
  const maxStreak = calculateMaxStreak(activities)

  // Eng ko'p faol bo'lgan kun
  const mostActiveDay = activities.reduce((max, a) => 
    a.totalActivities > (max?.totalActivities || 0) ? a : max
  , null)

  // Hozirgi streak
  const currentStreak = calculateCurrentStreak(activities)

  // Max streak hisoblash
  function calculateMaxStreak(activities) {
    let maxStreak = 0
    let currentStreak = 0
    
    activities.forEach(activity => {
      if (activity.totalActivities > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })
    
    return maxStreak
  }

  // Hozirgi streak hisoblash
  function calculateCurrentStreak(activities) {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = activities.length - 1; i >= 0; i--) {
      const activityDate = new Date(activities[i].date)
      activityDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak && activities[i].totalActivities > 0) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }
    
    return streak
  }

  // Grid yaratish (53 hafta × 7 kun)
  const createGrid = () => {
    const grid = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 365 kun oldin
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    
    // Birinchi dushanba kunigacha orqaga
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1)
    }
    
    let currentDate = new Date(startDate)
    let week = []
    
    while (currentDate <= today || week.length > 0) {
      const dateKey = currentDate.toISOString().split('T')[0]
      const activity = activities.find(a => a.date === dateKey)
      const totalActivities = activity ? activity.totalActivities : 0
      const level = getActivityLevel(totalActivities)
      
      week.push({
        date: dateKey,
        totalActivities,
        level,
        quizCount: activity?.quizCount || 0,
        videoCount: activity?.videoCount || 0,
        missionCount: activity?.missionCount || 0,
        xp: activity?.totalXP || 0
      })
      
      if (week.length === 7) {
        grid.push(week)
        week = []
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
      
      // Bugundan keyin bo'lsa, bo'sh qoldirish
      if (currentDate > today && week.length > 0) {
        while (week.length < 7) {
          week.push(null)
        }
        grid.push(week)
        break
      }
    }
    
    return grid
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-800/50 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-purple-800/30 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const grid = createGrid()

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Faoliyat grafigi</h2>
            <p className="text-sm text-purple-300">Oxirgi 365 kunlik faoliyatingiz</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{totalActivities}</div>
            <div className="text-xs text-purple-300">Jami faoliyat</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xl font-bold text-orange-400">{currentStreak}</div>
          <div className="text-xs text-purple-300">Hozirgi streak</div>
        </div>
        <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xl font-bold text-yellow-400">{maxStreak}</div>
          <div className="text-xs text-purple-300">Eng uzun streak</div>
        </div>
        <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-bold text-green-400">{activeDays}</div>
          <div className="text-xs text-purple-300">Faol kunlar</div>
        </div>
        <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xl font-bold text-cyan-400">
            {activities.reduce((sum, a) => sum + a.totalXP, 0)}
          </div>
          <div className="text-xs text-purple-300">Jami XP</div>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-2">
        <div className="w-8 flex-shrink-0"></div>
        {grid.map((week, weekIndex) => {
          const firstDay = week[0]
          if (!firstDay) return null
          
          const date = new Date(firstDay.date)
          const monthIndex = date.getMonth()
          
          // Faqat oyning birinchi haftasida ko'rsatish
          const prevWeek = grid[weekIndex - 1]
          const prevMonth = prevWeek?.[0] ? new Date(prevWeek[0].date).getMonth() : -1
          
          if (monthIndex !== prevMonth) {
            return (
              <div key={weekIndex} className="text-xs text-purple-400 w-3 flex-shrink-0">
                {months[monthIndex]}
              </div>
            )
          }
          return <div key={weekIndex} className="w-3 flex-shrink-0"></div>
        })}
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1 overflow-x-auto pb-4">
        {/* Week Day Labels */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {weekDays.map((day, index) => (
            <div key={index} className="h-3 flex items-center">
              {index % 2 === 1 ? (
                <span className="text-xs text-purple-400 w-8">{day}</span>
              ) : (
                <span className="w-8"></span>
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={dayIndex} className="w-3 h-3"></div>
                }

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm border transition-all cursor-pointer hover:scale-150 hover:z-10 relative group ${getLevelColor(day.level)}`}
                    title={`${day.date}: ${day.totalActivities} ta faoliyat`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className="bg-purple-950 border border-purple-700 rounded-lg p-2 shadow-xl whitespace-nowrap">
                        <div className="text-xs font-bold text-white mb-1">
                          {sana(day.date)}
                        </div>
                        <div className="text-xs text-purple-300 space-y-0.5">
                          {day.quizCount > 0 && <div>📝 {day.quizCount} ta quiz</div>}
                          {day.videoCount > 0 && <div>🎬 {day.videoCount} ta video</div>}
                          {day.missionCount > 0 && <div>🎯 {day.missionCount} ta missiya</div>}
                          {day.xp > 0 && <div>⭐ {day.xp} XP</div>}
                          {day.totalActivities === 0 && <div className="text-purple-500">Faoliyat yo'q</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-purple-400">Kam</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm border ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span className="text-xs text-purple-400">Ko'p</span>
      </div>

      {/* Most Active Day */}
      {mostActiveDay && mostActiveDay.totalActivities > 0 && (
        <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏅</div>
            <div className="flex-1">
              <div className="text-sm text-yellow-400 font-bold">Eng faol kun</div>
              <div className="text-xs text-yellow-200/80">
                {sana(mostActiveDay.date)} — {mostActiveDay.totalActivities} ta faoliyat
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-blue-200">
            <strong className="text-blue-400">Maslahat:</strong> Har kuni kamida 1 ta quiz yeching yoki video dars ko'ring. Streak'ingizni saqlang va yangi yutuqlarni qo'lga kiriting!
          </div>
        </div>
      </div>
    </div>
  )
}