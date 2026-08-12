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
import ProfilPostlar from '@/components/ProfilPostlar'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import EmailTasdiqlash from '@/components/EmailTasdiqlash'
import Ikon from '@/components/Ikon'
import { sana } from '@/lib/sana'
import { daraja, darajaHolati } from '@/lib/daraja'

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
        setError('Server javob berishga juda ko\'p vaqt oldi. Qayta urinib ko\'ring.')
      } else {
        console.error('[Profile Fetch Error]:', err)
        setError(err.message)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Profil ma{"'"}lumotlari yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (error || !profile?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="font-bold text-base text-[var(--v3-matn)]">Profil yuklanmadi</h2>
          {error && <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{error}</p>}
          <button
            onClick={fetchProfile}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
          >
            <Ikon nom="qayta" olcham={14} />
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  const { user, quizResults = [], counts = {} } = profile
  const experience = user.experience || 0
  const totalPoints = user.totalPoints || 0
  const currentStreak = user.currentStreak || 0
  const longestStreak = user.longestStreak || 0
  const starsCount = user.stars || 0
  const coinsCount = user.coins || 0
  const gemsCount = user.gems || 0

  const userDaraja = daraja(starsCount)
  const dHolat = darajaHolati(starsCount)

  const ism = user.fullName || user.username
  const boshHarf = ism[0].toUpperCase()

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Email Tasdiqlash ogohlantirishi */}
      <EmailTasdiqlash />

      {/* ═══ HERO SECTION ═══ */}
      <div className="v3-panel-karta p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--v3-yuza-2)] border-2 border-[var(--v3-urgu)] flex items-center justify-center text-3xl font-bold text-[var(--v3-urgu)] overflow-hidden shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                boshHarf
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-mono font-bold text-[11px] shadow-md">
              Lvl {userDaraja}
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
                {ism}
              </h1>
              <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="katta" jonli />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="v3-tag v3-tag-ochiq text-[11px]">
                @{user.username}
              </span>
              <span className="v3-tag v3-tag-yopiq text-[11px] font-mono font-bold">
                ID: {user.userId}
              </span>
              {user.university && (
                <span className="text-xs text-[var(--v3-xira)] truncate">
                  🏛️ {user.university} {user.faculty ? `• ${user.faculty}` : ''}
                </span>
              )}
            </div>

            {/* Daraja Progress Bar */}
            <div className="pt-2 max-w-lg space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--v3-urgu)] font-bold">
                  {userDaraja}-Daraja
                </span>
                <span className="text-[var(--v3-xira)]">
                  {dHolat.joriy} / {dHolat.kerak} yulduz ({dHolat.foiz}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--v3-fon-2)] overflow-hidden border border-[var(--v3-chiziq)]">
                <div
                  className="h-full bg-[var(--v3-urgu)] transition-all duration-500 rounded-full"
                  style={{ width: `${dHolat.foiz}%` }}
                />
              </div>
            </div>

            {/* Tezkor havolalar */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href={`/profil/${user.userId}`}
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="odam" olcham={13} />
                Ochiq profilim
              </Link>
              <Link
                href="/profil/sozlama"
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="sozlama" olcham={13} />
                Tahrirlash
              </Link>
              {user.isTeacher && (
                <Link
                  href="/ustoz"
                  className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold"
                >
                  <Ikon nom="ustoz" olcham={13} />
                  Ustoz paneli
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STATS GRID ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Yulduzlar</span>
            <Ikon nom="yulduz" olcham={14} className="text-yellow-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">{starsCount}</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Tangalar</span>
            <span className="text-xs">🪙</span>
          </div>
          <div className="text-xl font-bold font-mono text-yellow-400 mt-1">{coinsCount}</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Gems</span>
            <span className="text-xs">💎</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{gemsCount}</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Streak</span>
            <span className="text-xs">🔥</span>
          </div>
          <div className="text-xl font-bold font-mono text-orange-400 mt-1">{currentStreak} kun</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Testlar</span>
            <Ikon nom="quiz" olcham={14} />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">{counts.quizzes || 0}</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Sertifikatlar</span>
            <Ikon nom="fayl" olcham={14} />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">{counts.certificates || 0}</div>
        </div>

        <div className="v3-panel-karta p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Do{"'"}stlar</span>
            <Ikon nom="odamlar" olcham={14} />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">{counts.friends || 0}</div>
        </div>
      </div>

      {/* ═══ WIDGETS SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantWidget />
        <DailyQuoteCard />
      </div>

      {/* Profil Postlari */}
      <ProfilPostlar />

      {/* Faollik Grafigi */}
      <ActivityHeatmap />

      {/* Laboratoriya Inventar Vidjeti */}
      <LabWidget />

      {/* Daily Missions */}
      <DailyMissions onStatsUpdate={fetchProfile} />

      {/* Stars Leaderboard */}
      <StarsDisplay />

      {/* ═══ OXIRGI TEST NATIJALARI ═══ */}
      {quizResults.length > 0 && (
        <div className="v3-panel-karta p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
            <h2 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="quiz" olcham={16} />
              So{"'"}nggi topshirilgan testlar
            </h2>
            <Link href="/profil/quizlar" className="text-xs text-[var(--v3-urgu)] hover:underline font-semibold">
              Barcha natijalarga o{"'"}tish →
            </Link>
          </div>

          <div className="divide-y divide-[var(--v3-chiziq)]">
            {quizResults.slice(0, 5).map(quiz => (
              <div key={quiz.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--v3-matn)] truncate">{quiz.quizName}</div>
                  <div className="text-[10.5px] text-[var(--v3-xira)] font-mono mt-0.5">
                    {sana(quiz.completedAt)}
                  </div>
                </div>
                <div className={`text-base font-bold font-mono px-2.5 py-0.5 rounded-lg ${
                  quiz.percentage >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  quiz.percentage >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
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
