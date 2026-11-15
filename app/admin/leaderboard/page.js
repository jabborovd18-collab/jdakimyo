// app/admin/leaderboard/page.js
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'xp', name: '⭐ XP', icon: '⭐', color: 'yellow' },
  { id: 'streak', name: '🔥 Streak', icon: '🔥', color: 'orange' },
  { id: 'stars', name: '🌟 Yulduzlar', icon: '🌟', color: 'purple' },
  { id: 'achievements', name: '🏆 Yutuqlar', icon: '🏆', color: 'pink' },
  { id: 'quizzes', name: '📝 Quizlar', icon: '📝', color: 'blue' }
]

const PERIODS = [
  { id: 'all', name: 'Umumiy' },
  { id: 'weekly', name: 'Haftalik' },
  { id: 'monthly', name: 'Oylik' }
]

export default function AdminLeaderboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [category, setCategory] = useState('xp')
  const [period, setPeriod] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [category, period, pagination.page, search])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category,
        period,
        page: pagination.page.toString(),
        search
      })
      const res = await fetch(`/api/admin/leaderboard?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setUsers(data.users)
      setStats(data.stats)
      setPagination(data.pagination)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(p => ({ ...p, page: 1 }))
    fetchLeaderboard()
  }

  // Podium uchun top 3
  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  // Qiymatni olish (kategoriya bo'yicha)
  const getValue = (user) => {
    switch (category) {
      case 'xp': return user.totalPoints
      case 'streak': return user.currentStreak
      case 'stars': 
        return period === 'weekly' ? user.weeklyStars :
               period === 'monthly' ? user.monthlyStars : user.stars
      case 'achievements': return user._count?.achievements || 0
      case 'quizzes': return user._count?.quizResults || 0
      default: return 0
    }
  }

  // Qiymat formatlash
  const formatValue = (value) => {
  if (value === undefined || value === null) return '0'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

  const levelTone = (level) => {
    if (level >= 9) return 'primary'
    if (level >= 7) return 'accent'
    if (level >= 5) return 'info'
    if (level >= 3) return 'success'
    return 'neutral'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 pb-5 border-b border-[var(--v3-chiziq)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)]">Reyting jadvali</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--v3-xira)]">
            Foydalanuvchilar XP, streak, yulduz, yutuq va quiz natijalari bo&apos;yicha tartibi
          </p>
        </div>
        <div className="text-xs text-[var(--v3-xira)]">
          Jami: <strong className="text-[var(--v3-matn)]">{stats.totalUsers || 0}</strong> ishtirokchi
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="v3-panel-karta p-4">
          <div className="text-xl font-bold text-[var(--v3-urgu)]">{formatValue(stats.avgXP || 0)}</div>
          <div className="text-xs text-[var(--v3-xira)] mt-0.5">O&apos;rtacha XP</div>
        </div>
        <div className="v3-panel-karta p-4">
          <div className="text-xl font-bold text-orange-300">{stats.maxStreak || 0} kun</div>
          <div className="text-xs text-[var(--v3-xira)] mt-0.5">Eng uzun streak</div>
        </div>
        <div className="v3-panel-karta p-4">
          <div className="text-xl font-bold text-sky-300">{stats.totalUsers || 0}</div>
          <div className="text-xs text-[var(--v3-xira)] mt-0.5">Foydalanuvchilar</div>
        </div>
        <div className="v3-panel-karta p-4">
          <div className="text-xl font-bold text-emerald-300">{stats.totalAchievements || 0}</div>
          <div className="text-xs text-[var(--v3-xira)] mt-0.5">Berilgan yutuqlar</div>
        </div>
      </div>

      {/* Kategoriya va qidiruv */}
      <div className="v3-panel-karta p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id)
                  setPagination((p) => ({ ...p, page: 1 }))
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                    : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {category === 'stars' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--v3-chiziq)]">
            <span className="text-xs text-[var(--v3-xira)]">Davr (yulduzlar uchun):</span>
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPeriod(p.id)
                  setPagination((pg) => ({ ...pg, page: 1 }))
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  period === p.id
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                    : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-2 pt-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Username, email yoki ism bo'yicha qidirish..."
            className="v3-kiritish flex-1"
          />
          <button type="submit" className="v3-tugma v3-tugma-asosiy text-xs px-4">
            Qidirish
          </button>
        </form>
      </div>

      {/* Top 3 */}
      {!isLoading && top3.length > 0 && (
        <div className="v3-panel-karta p-5 space-y-4">
          <h2 className="text-sm font-bold text-[var(--v3-matn)]">Eng kuchli {top3.length} nafar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {top3.slice(0, 3).map((user, idx) => (
              <div
                key={user.id}
                onClick={() => router.push(`/profil/${user.userId}`)}
                className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-colors ${
                  idx === 0
                    ? 'border-amber-400/45 bg-amber-400/10'
                    : 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:bg-[var(--v3-yuza-2)]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                      : 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                  }`}
                >
                  #{idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-[var(--v3-matn)] truncate">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-xs text-[var(--v3-xira)] truncate">@{user.username}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-[var(--v3-urgu)]">
                    {formatValue(getValue(user))}
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)]">Lvl {user.level_points}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jadval */}
      <div className="v3-panel-karta overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--v3-xira)]">Foydalanuvchilar topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-xira)]">
                <tr>
                  <th className="text-left p-3.5 font-semibold w-14">#</th>
                  <th className="text-left p-3.5 font-semibold">Foydalanuvchi</th>
                  <th className="text-left p-3.5 font-semibold">Daraja</th>
                  <th className="text-left p-3.5 font-semibold">
                    {CATEGORIES.find((c) => c.id === category)?.name}
                  </th>
                  <th className="text-left p-3.5 font-semibold">Rol</th>
                  <th className="text-right p-3.5 font-semibold">Profil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {users.map((user, idx) => {
                  const rank = (pagination.page - 1) * pagination.limit + idx + 1
                  const value = getValue(user)
                  const tone = levelTone(user.level_points)
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[var(--v3-yuza)] transition-colors ${
                        rank <= 3 ? 'bg-amber-400/5' : ''
                      }`}
                    >
                      <td className="p-3.5 font-bold text-[var(--v3-matn)]">#{rank}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--v3-matn)] truncate">
                              {user.fullName || user.username}
                            </div>
                            <div className="text-xs text-[var(--v3-xira)] truncate">
                              @{user.username} · {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            tone === 'primary'
                              ? 'border-amber-400/40 bg-amber-400/15 text-amber-200'
                              : tone === 'accent'
                                ? 'border-indigo-400/40 bg-indigo-400/15 text-indigo-200'
                                : tone === 'info'
                                  ? 'border-sky-400/40 bg-sky-400/15 text-sky-200'
                                  : tone === 'success'
                                    ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200'
                                    : 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
                          }`}
                        >
                          Lvl {user.level_points}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[var(--v3-urgu)]">{formatValue(value)}</td>
                      <td className="p-3.5 text-xs text-[var(--v3-xira)]">{user.role}</td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/profil/${user.userId}`)}
                          className="v3-tugma text-xs py-1 px-2.5"
                        >
                          Ochish
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
            <span>
              Sahifa <strong className="text-[var(--v3-matn)]">{pagination.page}</strong> /{' '}
              {pagination.totalPages} · jami {pagination.total} ta
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page === 1}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Oldingi
              </button>
              <button
                type="button"
                onClick={() =>
                  setPagination((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}