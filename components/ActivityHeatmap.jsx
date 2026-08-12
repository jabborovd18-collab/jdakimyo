"use client"

import { sana } from '@/lib/sana'
import { useState, useEffect } from 'react'
import Ikon from './Ikon'

export default function ActivityHeatmap({ userId }) {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  const getActivityLevel = (totalActivities) => {
    if (totalActivities === 0) return 0
    if (totalActivities === 1) return 1
    if (totalActivities <= 3) return 2
    if (totalActivities <= 6) return 3
    return 4
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-[var(--v3-yuza-2)] border-[var(--v3-chiziq)]'
      case 1: return 'bg-emerald-900/50 border-emerald-700/50'
      case 2: return 'bg-emerald-700/70 border-emerald-500/60'
      case 3: return 'bg-emerald-500/80 border-emerald-400/70'
      case 4: return 'bg-[var(--v3-urgu)] border-[var(--v3-urgu)]'
      default: return 'bg-[var(--v3-yuza-2)] border-[var(--v3-chiziq)]'
    }
  }

  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']

  const totalActivities = activities.reduce((sum, a) => sum + a.totalActivities, 0)
  const activeDays = activities.filter(a => a.totalActivities > 0).length

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

  const maxStreak = calculateMaxStreak(activities)
  const currentStreak = calculateCurrentStreak(activities)

  const createGrid = () => {
    const grid = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)

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
      <div className="v3-panel-karta p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--v3-yuza-2)] rounded w-1/3"></div>
          <div className="h-28 bg-[var(--v3-yuza)] rounded-xl"></div>
        </div>
      </div>
    )
  }

  const grid = createGrid()

  return (
    <div className="v3-panel-karta p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
            <Ikon nom="vaqt" olcham={18} />
          </div>
          <div>
            <div className="v3-nishon">Yillik tahlil</div>
            <h2 className="text-sm font-bold text-[var(--v3-matn)]">Faollik Grafigi</h2>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-base font-bold text-[var(--v3-matn)]">{totalActivities}</div>
          <div className="text-[10.5px] text-[var(--v3-xira)]">Jami amallar</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
          <span className="text-[10px] text-[var(--v3-xira)] block">Hozirgi streak</span>
          <strong className="text-sm text-orange-400">{currentStreak} kun</strong>
        </div>
        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
          <span className="text-[10px] text-[var(--v3-xira)] block">Eng uzun streak</span>
          <strong className="text-sm text-yellow-400">{maxStreak} kun</strong>
        </div>
        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
          <span className="text-[10px] text-[var(--v3-xira)] block">Faol kunlar</span>
          <strong className="text-sm text-green-400">{activeDays} kun</strong>
        </div>
        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
          <span className="text-[10px] text-[var(--v3-xira)] block">Jami XP</span>
          <strong className="text-sm text-[var(--v3-urgu)]">
            {activities.reduce((sum, a) => sum + a.totalXP, 0)}
          </strong>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        <div className="w-8 flex-shrink-0"></div>
        {grid.map((week, weekIndex) => {
          const firstDay = week[0]
          if (!firstDay) return null

          const date = new Date(firstDay.date)
          const monthIndex = date.getMonth()
          const prevWeek = grid[weekIndex - 1]
          const prevMonth = prevWeek?.[0] ? new Date(prevWeek[0].date).getMonth() : -1

          if (monthIndex !== prevMonth) {
            return (
              <div key={weekIndex} className="text-[10px] text-[var(--v3-xira)] w-3 flex-shrink-0 font-mono">
                {months[monthIndex]}
              </div>
            )
          }
          return <div key={weekIndex} className="w-3 flex-shrink-0"></div>
        })}
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 flex-shrink-0">
          {weekDays.map((day, index) => (
            <div key={index} className="h-3 flex items-center">
              {index % 2 === 1 ? (
                <span className="text-[10px] text-[var(--v3-xira)] w-8 font-mono">{day}</span>
              ) : (
                <span className="w-8"></span>
              )}
            </div>
          ))}
        </div>

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
                    className={`w-3 h-3 rounded-sm border transition-all hover:scale-150 relative group ${getLevelColor(day.level)}`}
                    title={`${day.date}: ${day.totalActivities} ta faoliyat`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-[10.5px] font-mono text-[var(--v3-xira)]">
        <span>Kam</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm border ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>Ko{"'"}p</span>
      </div>
    </div>
  )
}
