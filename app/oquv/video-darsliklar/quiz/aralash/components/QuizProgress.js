"use client"
import { useState, useEffect } from "react"

/**
 * QuizProgress — Progress bar va timer komponenti
 * Premium dizayn, real-time yangilanish
 * 
 * @param {Object} props
 * @param {number} props.currentQuestion - hozirgi savol indeksi (0 dan)
 * @param {number} props.totalQuestions - jami savollar soni
 * @param {number} props.elapsedTime - o'tgan vaqt (sekundlarda)
 * @param {boolean} props.isPaused - pauza holati (ixtiyoriy)
 */
export default function QuizProgress({ 
  currentQuestion, 
  totalQuestions, 
  elapsedTime,
  isPaused = false 
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  // Progress hisoblash
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  // Smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  // Vaqtni formatlash
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Progress rangini aniqlash
  const getProgressColor = () => {
    if (progress < 25) return "from-red-500 to-orange-500"
    if (progress < 50) return "from-orange-500 to-yellow-500"
    if (progress < 75) return "from-yellow-500 to-green-500"
    return "from-green-500 to-emerald-500"
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col gap-4">
        {/* Yuqori qism: Savol indeksi va vaqt */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
              {currentQuestion + 1}
            </div>
            <div>
              <div className="text-sm text-purple-300 font-semibold">
                Savol {currentQuestion + 1} / {totalQuestions}
              </div>
              <div className="text-xs text-purple-400">
                {Math.round(progress)}% tugatildi
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 bg-purple-950/50 rounded-lg px-4 py-2">
            <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-yellow-400" : "bg-green-400 animate-pulse"}`} />
            <div className="font-mono text-lg font-bold text-white">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-purple-400">
              {isPaused ? "Pauza" : "Davom etmoqda"}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative w-full h-4 bg-purple-950/70 rounded-full overflow-hidden shadow-inner">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)"
              }} />
            </div>
            
            {/* Progress fill */}
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
              style={{ width: `${animatedProgress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${Math.round(progress)}% tugatildi`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Progress markers */}
          <div className="flex justify-between text-xs text-purple-500 px-1">
            <span>0%</span>
            <span className="hidden sm:inline">25%</span>
            <span>50%</span>
            <span className="hidden sm:inline">75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Statistika (ixtiyoriy) */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-purple-700/30">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {currentQuestion}
            </div>
            <div className="text-xs text-purple-400">Tugatilgan</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {totalQuestions - currentQuestion - 1}
            </div>
            <div className="text-xs text-purple-400">Qolgan</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-300">
              {totalQuestions}
            </div>
            <div className="text-xs text-purple-400">Jami</div>
          </div>
        </div>
      </div>
    </div>
  )
}