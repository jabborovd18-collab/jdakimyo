// app/kochat/page.js
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const STAGES = [
  { min: 0, max: 9, name: 'Urug\'', emoji: '🌰', xpRequired: 0 },
  { min: 10, max: 19, name: 'Nish', emoji: '🌱', xpRequired: 10 },
  { min: 20, max: 29, name: 'Yosh o\'simlik', emoji: '🌿', xpRequired: 20 },
  { min: 30, max: 39, name: 'O\'simlik', emoji: '🪴', xpRequired: 30 },
  { min: 40, max: 49, name: 'Katta o\'simlik', emoji: '🌾', xpRequired: 40 },
  { min: 50, max: 59, name: 'Daraxt', emoji: '🌲', xpRequired: 50 },
  { min: 60, max: 69, name: 'Katta daraxt', emoji: '🌳', xpRequires: 60 },
  { min: 70, max: 79, name: 'Gullagan', emoji: '🌸', xpRequired: 70 },
  { min: 80, max: 89, name: 'Mevali', emoji: '🍎', xpRequired: 80 },
  { min: 90, max: 100, name: 'Afsonaviy', emoji: '👑', xpRequired: 90 }
]

export default function KochatPage() {
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
      toast.error('Xatolik: ' + error.message)
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
      
      toast.success(data.message, { icon: data.stageUp ? '🎉' : '💧' })
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
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-slate-950 flex items-center justify-center">
        <div className="animate-spin text-6xl">🌱</div>
      </main>
    )
  }

  if (!plant) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-white">Ko'chat yuklanmadi</p>
        </div>
      </main>
    )
  }

  const { stageInfo, canWaterToday } = plant
  const progressInStage = plant.stage < 10 
    ? ((plant.growth - stageInfo.min) / (stageInfo.max - stageInfo.min)) * 100 
    : 100

  // Oxirgi 30 kunlik watering tarixi
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    date.setHours(0, 0, 0, 0)
    
    const watered = plant.waterings?.some(w => {
      const wDate = new Date(w.createdAt)
      wDate.setHours(0, 0, 0, 0)
      return wDate.getTime() === date.getTime()
    })
    
    return { date, watered }
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/profil" className="text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2">
          <span>←</span>
          <span>Profilga qaytish</span>
        </Link>
        <div className="h-8 w-px bg-purple-800"></div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          🌱 Kimyogar Ko'chat
        </h1>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Plant Card */}
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          
          <div className="relative z-10 text-center">
            {/* Plant Emoji */}
            <div className="relative inline-block mb-6">
              <div 
                className={`text-9xl transition-all duration-500 ${
                  showAnimation ? 'animate-bounce scale-125' : ''
                }`}
              >
                {stageInfo.emoji}
              </div>
              {showAnimation && (
                <>
                  <div className="absolute -top-4 -left-4 text-4xl animate-ping">💧</div>
                  <div className="absolute -top-4 -right-4 text-4xl animate-ping" style={{animationDelay: '0.2s'}}>💧</div>
                  <div className="absolute -bottom-4 left-1/2 text-4xl animate-ping" style={{animationDelay: '0.4s'}}>💧</div>
                </>
              )}
            </div>

            {/* Name & Stage */}
            <h2 className="text-3xl font-bold text-white mb-2">{plant.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-600/20 border border-green-500/50 rounded-full text-sm text-green-400 font-semibold">
                {stageInfo.name}
              </span>
              <span className="text-sm text-green-300">
                Bosqich {plant.stage}/10
              </span>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-green-300">O'sish progressi</span>
                <span className="text-white font-bold">{plant.growth.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-green-950/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${plant.growth}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              {plant.stage < 10 && plant.nextStage && (
                <div className="text-xs text-green-300 mt-2">
                  Keyingi bosqich: {plant.nextStage.emoji} {plant.nextStage.name} ({plant.nextStage.min}%)
                </div>
              )}
            </div>

            {/* Water Button */}
            <button
              onClick={handleWater}
              disabled={!canWaterToday || isWatering}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 mx-auto ${
                canWaterToday
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-xl shadow-blue-500/30 hover:scale-105'
                  : 'bg-purple-800/50 text-purple-400 cursor-not-allowed'
              } ${isWatering ? 'opacity-50' : ''}`}
            >
              {isWatering ? (
                <>
                  <span className="animate-spin text-2xl">💧</span>
                  <span>Suv berilmoqda...</span>
                </>
              ) : canWaterToday ? (
                <>
                  <span className="text-2xl">💧</span>
                  <span>Suv berish (+5 XP)</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">✓</span>
                  <span>Bugun suv berildi. Ertaga qayting!</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-white">{plant.currentStreak}</div>
            <div className="text-xs text-purple-400">Hozirgi streak</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">{plant.longestStreak}</div>
            <div className="text-xs text-purple-400">Eng uzun streak</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💧</div>
            <div className="text-2xl font-bold text-blue-400">{plant.totalWaterings}</div>
            <div className="text-xs text-purple-400">Jami suv berilgan</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-green-400">{plant.totalWaterings * 5}</div>
            <div className="text-xs text-purple-400">Jami XP olingan</div>
          </div>
        </div>

        {/* 30 kunlik tarix */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📅</span> Oxirgi 30 kun
          </h3>
          <div className="grid grid-cols-10 md:grid-cols-15 gap-1.5">
            {last30Days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110 ${
                  day.watered
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-purple-950/50 text-purple-500 border border-purple-800/30'
                }`}
                title={day.date.toLocaleDateString('uz-UZ')}
              >
                {day.watered ? '💧' : day.date.getDate()}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-purple-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded"></div>
              <span>Suv berilgan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-950/50 border border-purple-800/30 rounded"></div>
              <span>Suv berilmagan</span>
            </div>
          </div>
        </div>

        {/* Bosqichlar Roadmap */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🗺️</span> O'sish yo'li
          </h3>
          <div className="space-y-3">
            {STAGES.map((stage, idx) => {
              const isCurrent = plant.stage === idx + 1
              const isCompleted = plant.stage > idx + 1
              const isLocked = plant.stage < idx + 1

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500'
                      : isCompleted
                      ? 'bg-green-900/20 border border-green-700/30'
                      : 'bg-purple-950/30 border border-purple-800/30 opacity-60'
                  }`}
                >
                  <div className={`text-4xl ${isLocked ? 'grayscale' : ''}`}>
                    {stage.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isCurrent ? 'text-green-400' : 'text-white'}`}>
                        {stage.name}
                      </span>
                      {isCompleted && <span className="text-green-400">✓</span>}
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-green-600/30 border border-green-500/50 rounded-full text-xs text-green-400">
                          HOZIRGI
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-purple-400">
                      Bosqich {idx + 1} • {stage.min}-{stage.max}% o'sish
                    </div>
                  </div>
                  <div className="text-sm text-purple-300">
                    {stage.min}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Qanday ishlaydi */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Qanday ishlaydi?
          </h3>
          <div className="space-y-3 text-sm text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💧</span>
              <div>
                <strong className="text-white">Har kuni suv bering:</strong> Kuniga bir marta suv bersangiz, ko'chat +2% o'sadi va +5 XP olasiz.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <strong className="text-white">Streak saqlang:</strong> Har kuni ketma-ket suv bersangiz, streak oshadi. Bu sizning intizomingizni ko'rsatadi.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong className="text-white">Uzluksiz bo'lmang:</strong> 1 kun o'tkazib yuborsangiz -5%, 3 kun -20%, 7+ kun - ko'chat so'lib, 0% ga tushadi.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-white">10 bosqich:</strong> 🌰 Urug'dan 👑 Afsonaviy darajagacha. Har bosqichda yangi ko'rinish!
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}