// components/PlantWidget.jsx
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PlantWidget() {
  const [plant, setPlant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWatering, setIsWatering] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    fetchPlant()
  }, [])

  const fetchPlant = async () => {
    try {
      const res = await fetch('/api/plant')
      const data = await res.json()
      if (res.ok) setPlant(data.plant)
    } catch (error) {
      console.error('Plant fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWater = async () => {
    if (!plant?.canWaterToday || isWatering) return
    
    setIsWatering(true)
    setShowAnimation(true)
    
    try {
      const res = await fetch('/api/plant', { method: 'POST' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message, { 
        icon: data.stageUp ? '🎉' : '💧',
        duration: 4000 
      })
      
      setPlant(data.plant)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsWatering(false)
      setTimeout(() => setShowAnimation(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-2xl p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-green-800/50 rounded w-1/2 mb-3"></div>
          <div className="h-32 bg-green-800/30 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!plant) return null

  const { stageInfo, canWaterToday, wateredToday, streakStatus } = plant

  // Progress foizi
  const progressInStage = plant.stage < 10 
    ? ((plant.growth - stageInfo.min) / (stageInfo.max - stageInfo.min)) * 100 
    : 100

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-2xl p-5 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="text-lg font-bold text-white">Mening Ko'chatim</h3>
              <p className="text-xs text-green-300">{plant.name}</p>
            </div>
          </div>
          <Link 
            href="/kochat"
            className="text-xs text-green-400 hover:text-green-300 transition-colors"
          >
            Batafsil →
          </Link>
        </div>

        {/* Plant Display */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div 
              className={`text-6xl transition-transform duration-500 ${
                showAnimation ? 'animate-bounce scale-125' : ''
              }`}
            >
              {stageInfo.emoji}
            </div>
            {showAnimation && (
              <div className="absolute -top-2 -right-2 text-2xl animate-ping">
                💧
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">
                {stageInfo.name}
              </span>
              <span className="text-xs text-green-300">
                Bosqich {plant.stage}/10
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-green-950/50 rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressInStage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-green-300">
              <span>{plant.growth.toFixed(1)}% o'sgan</span>
              {plant.stage < 10 && plant.nextStage && (
                <span>Keyingi: {plant.nextStage.emoji}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-950/30 rounded-lg p-2 text-center">
            <div className="text-lg">🔥</div>
            <div className="text-xs text-green-300">Streak</div>
            <div className="text-sm font-bold text-white">{plant.currentStreak}</div>
          </div>
          <div className="bg-green-950/30 rounded-lg p-2 text-center">
            <div className="text-lg">💧</div>
            <div className="text-xs text-green-300">Suv berilgan</div>
            <div className="text-sm font-bold text-white">{plant.totalWaterings}</div>
          </div>
          <div className="bg-green-950/30 rounded-lg p-2 text-center">
            <div className="text-lg">🏆</div>
            <div className="text-xs text-green-300">Eng uzun</div>
            <div className="text-sm font-bold text-white">{plant.longestStreak}</div>
          </div>
        </div>

        {/* Water Button */}
        <button
          onClick={handleWater}
          disabled={!canWaterToday || isWatering}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            canWaterToday
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30 hover:scale-105'
              : 'bg-purple-800/50 text-purple-400 cursor-not-allowed'
          } ${isWatering ? 'opacity-50' : ''}`}
        >
          {isWatering ? (
            <>
              <span className="animate-spin">💧</span>
              <span>Suv berilmoqda...</span>
            </>
          ) : wateredToday ? (
            <>
              <span>✓</span>
              <span>Bugun suv berildi</span>
            </>
          ) : (
            <>
              <span>💧</span>
              <span>Suv berish (+5 XP)</span>
            </>
          )}
        </button>

        {/* Status messages */}
        {streakStatus === 'warning_1day' && (
          <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2 text-center">
            ⚠️ 1 kun o'tdi! Streak uzilishi mumkin
          </div>
        )}
        {streakStatus === 'warning_3days' && (
          <div className="mt-3 text-xs text-orange-400 bg-orange-900/20 border border-orange-700/30 rounded-lg p-2 text-center">
            ⚠️ Ko'chatingiz so'limoqda! Tez suv bering
          </div>
        )}
        {streakStatus === 'dead' && (
          <div className="mt-3 text-xs text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg p-2 text-center">
            💀 Ko'chatingiz so'lib qoldi. Suv bersangiz qayta o'sadi
          </div>
        )}
      </div>
    </div>
  )
}