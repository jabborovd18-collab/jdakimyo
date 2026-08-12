// components/PlantWidget.jsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from './Ikon'

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

      toast.success(data.message || 'Suv berildi! (+5 XP)')
      setPlant(data.plant)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsWatering(false)
      setTimeout(() => setShowAnimation(false), 1500)
    }
  }

  if (isLoading) {
    return (
      <div className="v3-panel-karta p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--v3-yuza-2)] rounded w-1/3"></div>
          <div className="h-20 bg-[var(--v3-yuza)] rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!plant) return null

  const { stageInfo, canWaterToday, wateredToday, streakStatus } = plant

  const progressInStage = plant.stage < 10 
    ? ((plant.growth - stageInfo.min) / (stageInfo.max - stageInfo.min)) * 100 
    : 100

  return (
    <div className="v3-panel-karta p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0 text-xl">
            🌱
          </div>
          <div>
            <div className="v3-nishon">Gidratatsiya va intizom</div>
            <h3 className="text-sm font-bold text-[var(--v3-matn)]">Mening Ko{"'"}chatim</h3>
          </div>
        </div>
        <Link 
          href="/kochat"
          className="text-xs text-[var(--v3-urgu)] hover:underline font-semibold"
        >
          Bog{"'"}ga o{"'"}tish →
        </Link>
      </div>

      {/* Plant Display */}
      <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center gap-4">
        <div className="relative shrink-0">
          <div 
            className={`text-5xl transition-transform duration-500 ${
              showAnimation ? 'scale-125' : ''
            }`}
          >
            {stageInfo?.emoji || '🌿'}
          </div>
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--v3-matn)] truncate">
              {stageInfo?.name || plant.name}
            </span>
            <span className="text-[10.5px] font-mono text-[var(--v3-urgu)]">
              {plant.stage}/10 bosqich
            </span>
          </div>

          <div className="w-full h-2 bg-[var(--v3-yuza-2)] rounded-full overflow-hidden border border-[var(--v3-chiziq)]">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressInStage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10.5px] text-[var(--v3-xira)] font-mono">
            <span>{plant.growth.toFixed(1)}% o{"'"}sgan</span>
            <span>Streak: {plant.currentStreak} kun</span>
          </div>
        </div>
      </div>

      {/* Water Button */}
      <button
        type="button"
        onClick={handleWater}
        disabled={!canWaterToday || isWatering}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
          canWaterToday
            ? 'v3-tugma v3-tugma-asosiy'
            : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border border-[var(--v3-chiziq)] cursor-not-allowed opacity-60'
        }`}
      >
        {isWatering ? (
          <span>Suv berilmoqda...</span>
        ) : wateredToday ? (
          <span>✓ Bugun suv berildi</span>
        ) : (
          <span>💧 Suv berish (+5 XP)</span>
        )}
      </button>

      {streakStatus === 'warning_1day' && (
        <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center font-mono">
          Eslatma: Bugun suv berishni unutmang!
        </div>
      )}
    </div>
  )
}
