// app/profil/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import DailyMissions from '@/components/DailyMissions'
import StarsDisplay from '@/components/StarsDisplay'
import DailyQuoteCard from '@/components/DailyQuoteCard'
import PlantWidget from '@/components/PlantWidget'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import LabWidget from '@/components/LabWidget'
import { sana } from '@/lib/sana'

// Serverdan javob juda uzoq (yoki umuman) kelmasa, spinner abadiy osilib qolmasligi uchun chegara
const FETCH_TIMEOUT_MS = 15000

export default function ProfilDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch('/api/profil', { signal: controller.signal })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || `Xatolik (${response.status})`)
      }

      if (!data?.user) {
        throw new Error('Profil ma\'lumotlari to\'liq emas')
      }

      setProfile(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server javob berishga juda ko\'p vaqt oldi. Internet aloqangizni tekshirib, qayta urinib ko\'ring.')
      } else {
        console.error('[Profile Fetch Error]:', err)
        setError(err.message)
        toast.error('Profilni yuklashda xatolik: ' + err.message)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl mb-4 animate-pulse">
            ⏳
          </div>
          <div className="text-purple-300 text-lg">Profil yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (error || !profile || !profile.user) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Profil yuklanmadi</h2>
          {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            🔄 Qayta urinib ko'rish
          </button>
        </div>
      </div>
    )
  }

  const { user, quizResults = [], counts = {} } = profile
  const levelPoints = user.level_points || 1
  const experience = user.experience || 0
  const totalPoints = user.totalPoints || 0
  const currentStreak = user.currentStreak || 0
  const longestStreak = user.longestStreak || 0
  const nextLevelXP = levelPoints * 500
  const xpProgress = Math.min((experience / nextLevelXP) * 100, 100)

  const levelTitles = {
    1: 'Boshlovchi',
    2: 'O\'rganuvchi',
    3: 'Kimyogar',
    4: 'Tadqiqotchi',
    5: 'Mutaxassis',
    6: 'Ekspert',
    7: 'Olim',
    8: 'Professor',
    9: 'Akademik',
    10: 'Afsona'
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-black overflow-hidden border-4 border-purple-700/50">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (user.fullName?.charAt(0) || user.username?.charAt(0) || '?').toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold shadow-lg border-4 border-purple-900">
              {levelPoints}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
              {user.fullName || user.username}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-purple-800/50 border border-purple-700/50 rounded-full text-sm">
                @{user.username}
              </span>
              <span className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded-full text-sm text-yellow-300 font-bold">
                🆔 {user.userId}
              </span>
            </div>
            {user.university && (
              <div className="text-purple-200 text-sm flex items-center gap-2">
                <span>🏛️</span>
                <span>{user.university}</span>
              </div>
            )}

            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">Level {levelPoints}</span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                    {levelTitles[levelPoints] || 'Kimyogar'}
                  </span>
                </div>
                <span className="text-xs text-purple-300">
                  {experience} / {nextLevelXP} XP
                </span>
              </div>
              <div className="w-full h-3 bg-purple-950/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Tez havolalar. "Ochiq profilim" ataylab bor: o'z profili
                boshqalarga qanday ko'rinishini tekshirishning yo'li yo'q edi. */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href={`/profil/${user.userId}`}
                className="px-3 py-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 text-xs font-semibold"
              >
                👁️ Ochiq profilim
              </Link>
              <Link
                href="/profil/sozlama"
                className="px-3 py-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 text-xs font-semibold"
              >
                ⚙️ Profilni tahrirlash
              </Link>
              <Link
                href="/laboratoriya"
                className="px-3 py-1.5 rounded-lg bg-cyan-800/40 hover:bg-cyan-700/60 border border-cyan-600/50 text-xs font-semibold"
              >
                🔬 Laboratoriya
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* STATS GRID */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard icon="⭐" label="Umumiy ball" value={totalPoints} color="yellow" />
        <StatCard icon="🌟" label="Yulduz" value={user.stars ?? 0} color="yellow" />
        <StatCard icon="🔥" label="Streak" value={`${currentStreak} kun`} color="orange" />
        <StatCard icon="📝" label="Quizlar" value={counts.quizzes || 0} color="blue" />
        <StatCard icon="🏆" label="Sertifikatlar" value={counts.certificates || 0} color="pink" />
        <StatCard icon="👥" label="Do'stlar" value={counts.friends || 0} color="purple" />
        <StatCard icon="👤" label="Obunachilar" value={counts.followers || 0} color="cyan" />
        <StatCard icon="👁️" label="Obunalar" value={counts.following || 0} color="purple" />
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* STREAK SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🔥</div>
            <div>
              <div className="text-sm text-orange-300 mb-1">Hozirgi seriya</div>
              <div className="text-4xl font-bold text-white">
                {currentStreak} <span className="text-lg text-orange-300">kun</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xs text-orange-300 mb-1">Eng uzun</div>
              <div className="text-2xl font-bold text-orange-400">{longestStreak}</div>
            </div>
            <div className="w-px bg-orange-600/30"></div>
            <div className="text-center">
              <div className="text-xs text-orange-300 mb-1">Jami kunlar</div>
              <div className="text-2xl font-bold text-orange-400">
                {user.createdAt ? Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* WIDGETS */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantWidget />
        <DailyQuoteCard />
      </div>

      <ActivityHeatmap />

      <LabWidget />

      {/* ═══════════════════════════════════════════ */}
      {/* QUICK ACTIONS */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/oquv/video-darsliklar/quiz" className="group bg-gradient-to-br from-green-600/20 to-emerald-900/40 border border-green-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Quiz yechish</h3>
          <p className="text-sm text-purple-300">Bilimingizni sinab ko'ring</p>
        </Link>
        <Link href="/oquv/video-darsliklar" className="group bg-gradient-to-br from-blue-600/20 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Video darslar</h3>
          <p className="text-sm text-purple-300">Yangi mavzularni o'rganing</p>
        </Link>
        <Link href="/birikmalar" className="group bg-gradient-to-br from-pink-600/20 to-rose-900/40 border border-pink-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
          <div className="text-4xl mb-3">🧪</div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Birikmalar</h3>
          <p className="text-sm text-purple-300">120+ kompleks birikma</p>
        </Link>
      </div>

      {/* Daily Missions */}
      <DailyMissions onStatsUpdate={fetchProfile} />

      {/* Stars Leaderboard */}
      <StarsDisplay />

      {/* ═══════════════════════════════════════════ */}
      {/* RECENT ACTIVITY */}
      {/* ═══════════════════════════════════════════ */}
      {quizResults.length > 0 && (
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>⚡</span>
            Oxirgi faoliyat
          </h2>
          <div className="space-y-3">
            {quizResults.slice(0, 5).map(quiz => (
              <div key={quiz.id} className="bg-purple-950/50 rounded-xl p-4 flex justify-between items-center border border-purple-700/30 hover:border-yellow-500/30 transition-all">
                <div>
                  <div className="font-semibold text-white">{quiz.quizName}</div>
                  <div className="text-xs text-purple-400 mt-1">
                    {sana(quiz.completedAt)}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  quiz.percentage >= 80 ? 'text-green-400' :
                  quiz.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {quiz.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════
// STAT CARD COMPONENT
// ═══════════════════════════════════════════
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    yellow: 'from-yellow-900/40 to-orange-900/40 border-yellow-700/50',
    orange: 'from-orange-900/40 to-red-900/40 border-orange-700/50',
    blue: 'from-blue-900/40 to-cyan-900/40 border-blue-700/50',
    pink: 'from-pink-900/40 to-rose-900/40 border-pink-700/50',
    cyan: 'from-cyan-900/40 to-teal-900/40 border-cyan-700/50',
    purple: 'from-purple-900/40 to-indigo-900/40 border-purple-700/50'
  }

  const textColors = {
    yellow: 'text-yellow-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-4 hover:scale-105 transition-all`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${textColors[color]} mb-1`}>{value}</div>
      <div className="text-xs text-purple-300">{label}</div>
    </div>
  )
}
