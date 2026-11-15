// components/StarsDisplay.jsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Ikon from './Ikon'
import TasdiqBelgisi from './TasdiqBelgisi'

const TURLAR = [
  { id: 'stars', label: 'Umumiy yulduzlar', maydon: 'stars', birlik: 'yulduz', ikon: 'yulduz' },
  { id: 'weekly', label: 'Haftalik yulduzlar', maydon: 'weeklyStars', birlik: 'yulduz', ikon: 'olov' },
  { id: 'points', label: 'Umumiy ball', maydon: 'totalPoints', birlik: 'ball', ikon: 'kubok' },
]

export default function StarsDisplay() {
  const [tur, setTur] = useState('stars')
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaderboard = useCallback(async (tanlanganTur) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?tur=${encodeURIComponent(tanlanganTur)}`)
      const data = await response.json()

      if (response.ok) {
        setLeaderboard(data.leaders || [])
        setMyRank(data.myRank || null)
      }
    } catch (error) {
      console.error('[Leaderboard] Error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard(tur)
  }, [tur, fetchLeaderboard])

  const joriyTur = TURLAR.find((t) => t.id === tur) || TURLAR[0]

  return (
    <div className="space-y-5">
      {/* Sizning o'rningiz kartasi */}
      {myRank && (
        <div className="v3-panel-karta p-5 border-[var(--v3-urgu)]/45 bg-[var(--v3-yuza-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-mono font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
              #{myRank.rank}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--v3-urgu)]">
                Sizning joriy o{"'"}rningiz
              </div>
              <div className="font-bold text-sm text-[var(--v3-matn)] truncate flex items-center gap-1.5 mt-0.5">
                <span className="truncate">{myRank.fullName || myRank.username}</span>
                <TasdiqBelgisi tasdiqlangan={myRank.isVerified} olcham="kichik" />
              </div>
              <div className="text-[11px] text-[var(--v3-xira)] font-mono">@{myRank.username}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="p-2.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center min-w-[78px]">
              <div className="font-mono font-bold text-sm text-[var(--v3-urgu)]">{myRank.stars || 0}</div>
              <div className="text-[10px] text-[var(--v3-xira)]">Yulduzlar</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center min-w-[78px]">
              <div className="font-mono font-bold text-sm text-orange-400">{myRank.weeklyStars || 0}</div>
              <div className="text-[10px] text-[var(--v3-xira)]">Haftalik</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center min-w-[78px]">
              <div className="font-mono font-bold text-sm text-[var(--v3-matn)]">{myRank.totalPoints || 0}</div>
              <div className="text-[10px] text-[var(--v3-xira)]">Ball</div>
            </div>
          </div>
        </div>
      )}

      {/* Reyting ro'yxati */}
      <div className="v3-panel-karta p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
              <Ikon nom={joriyTur.ikon} olcham={18} />
            </div>
            <div>
              <div className="v3-nishon">Peshqadamlar jadvali</div>
              <h2 className="text-sm font-bold text-[var(--v3-matn)]">{joriyTur.label} (Top 20)</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TURLAR.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTur(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  tur === t.id
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                    : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                }`}
              >
                <Ikon nom={t.ikon} olcham={13} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-[var(--v3-yuza)] rounded-xl" />
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((user, index) => {
              const ozimmi = myRank && user.id === myRank.id
              const qiymat = user[joriyTur.maydon] || 0

              return (
                <Link
                  key={user.id}
                  href={`/profil/${user.userId || user.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-[var(--v3-chiziq-2)] ${
                    ozimmi
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm'
                      : index === 0
                      ? 'bg-[var(--v3-yuza-2)]/70 border-[var(--v3-urgu)]/50'
                      : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]'
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      index === 0
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                        : index === 1
                        ? 'bg-slate-300 text-slate-900'
                        : index === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (user.fullName?.[0] || user.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1.5">
                      <span className="truncate">{user.fullName || user.username}</span>
                      <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" />
                      {ozimmi && (
                        <span className="v3-tag v3-tag-ochiq text-[10px] !py-0 !px-1.5">Siz</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--v3-xira)] font-mono truncate">
                      @{user.username}
                      {user.university ? ` · ${user.university}` : ''}
                    </div>
                  </div>

                  {/* Metric */}
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs text-[var(--v3-urgu)] font-bold">
                    <span>{qiymat}</span>
                    <Ikon nom={joriyTur.ikon} olcham={13} />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-[var(--v3-xira)] space-y-1">
            <p className="font-bold text-[var(--v3-matn)]">Bu yo{"'"}nalishda hali natijalar shakllanmagan</p>
            <p>Missiyalarni bajarib va testlar yechib, birinchi o{"'"}rinni egallang!</p>
          </div>
        )}
      </div>
    </div>
  )
}
