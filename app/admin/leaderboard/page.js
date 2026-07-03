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

  // Daraja rangi
  const getLevelColor = (level) => {
    if (level >= 9) return 'from-yellow-400 to-orange-500'
    if (level >= 7) return 'from-purple-500 to-pink-500'
    if (level >= 5) return 'from-blue-500 to-cyan-500'
    if (level >= 3) return 'from-green-500 to-emerald-500'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">🏆 Leaderboard</h1>
          <p className="text-purple-300 mt-1">Foydalanuvchilar reytingi va statistikasi</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl px-4 py-2">
            <span className="text-xs text-purple-400">Jami:</span>
            <span className="text-white font-bold ml-2">{stats.totalUsers || 0}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">⭐</div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{formatValue(stats.avgXP || 0)}</div>
              <div className="text-xs text-yellow-300/70">O'rtacha XP</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-xl">🔥</div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.maxStreak || 0}</div>
              <div className="text-xs text-orange-300/70">Eng uzun streak</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">👥</div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalUsers || 0}</div>
              <div className="text-xs text-purple-300/70">Foydalanuvchilar</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-xl">🏆</div>
            <div>
              <div className="text-2xl font-bold text-pink-400">{stats.totalAchievements || 0}</div>
              <div className="text-xs text-pink-300/70">Berilgan yutuqlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setPagination(p => ({ ...p, page: 1 })) }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                category === cat.id
                  ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-lg`
                  : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Period Filter (faqat yulduzlar uchun) */}
        {category === 'stars' && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-purple-800/30">
            <span className="text-sm text-purple-400 self-center mr-2">Davr:</span>
            {PERIODS.map(p => (
              <button
                key={p.id}
                onClick={() => { setPeriod(p.id); setPagination(pg => ({ ...pg, page: 1 })) }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  period === p.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Foydalanuvchi qidirish (username, email, ism)..."
          className="flex-1 px-4 py-2 bg-slate-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
        >
          Qidirish
        </button>
      </form>

      {/* Podium (Top 3) */}
      {!isLoading && top3.length >= 3 && (
        <div className="bg-gradient-to-br from-yellow-900/10 to-purple-900/10 border border-purple-800/50 rounded-2xl p-8">
          <h2 className="text-center text-xl font-bold text-white mb-6">🏆 TOP 3</h2>
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2-o'rin */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🥈</div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-2xl font-bold text-white mb-2 overflow-hidden border-4 border-gray-400 shadow-xl">
                {top3[1].avatar ? (
                  <img src={top3[1].avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (top3[1].fullName?.charAt(0) || top3[1].username.charAt(0)).toUpperCase()
                )}
              </div>
              <div className="text-white font-bold text-sm text-center truncate max-w-full">
                {top3[1].fullName || top3[1].username}
              </div>
              <div className="text-yellow-400 font-bold text-lg">
                {formatValue(getValue(top3[1]))}
              </div>
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-lg text-sm font-bold mt-2">
                2-o'rin
              </div>
            </div>

            {/* 1-o'rin */}
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2 animate-bounce">👑</div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-black mb-2 overflow-hidden border-4 border-yellow-300 shadow-2xl ring-4 ring-yellow-500/30">
                {top3[0].avatar ? (
                  <img src={top3[0].avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (top3[0].fullName?.charAt(0) || top3[0].username.charAt(0)).toUpperCase()
                )}
              </div>
              <div className="text-white font-bold text-base text-center truncate max-w-full">
                {top3[0].fullName || top3[0].username}
              </div>
              <div className="text-yellow-400 font-bold text-xl">
                {formatValue(getValue(top3[0]))}
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-lg text-sm font-bold mt-2">
                🏆 CHAMPION
              </div>
            </div>

            {/* 3-o'rin */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🥉</div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-2xl font-bold text-white mb-2 overflow-hidden border-4 border-orange-700 shadow-xl">
                {top3[2].avatar ? (
                  <img src={top3[2].avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (top3[2].fullName?.charAt(0) || top3[2].username.charAt(0)).toUpperCase()
                )}
              </div>
              <div className="text-white font-bold text-sm text-center truncate max-w-full">
                {top3[2].fullName || top3[2].username}
              </div>
              <div className="text-yellow-400 font-bold text-lg">
                {formatValue(getValue(top3[2]))}
              </div>
              <div className="bg-gradient-to-r from-orange-700 to-orange-800 text-white px-3 py-1 rounded-lg text-sm font-bold mt-2">
                3-o'rin
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-purple-300">⏳ Yuklanmoqda...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-purple-300">Foydalanuvchilar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-950/50 border-b border-purple-800/50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Foydalanuvchi</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Daraja</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">
                    {CATEGORIES.find(c => c.id === category)?.icon} {CATEGORIES.find(c => c.id === category)?.name}
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Rol</th>
                  <th className="text-right p-4 text-sm font-semibold text-purple-300">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const rank = (pagination.page - 1) * pagination.limit + idx + 1
                  const value = getValue(user)
                  
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-purple-800/30 hover:bg-purple-950/30 transition-colors ${
                        rank <= 3 ? 'bg-yellow-900/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                          rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                          'bg-purple-800/50 text-purple-300'
                        }`}>
                          {rank <= 3 ? (rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉') : rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white truncate">
                              {user.fullName || user.username}
                            </div>
                            <div className="text-xs text-purple-400 truncate">
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getLevelColor(user.level_points)} flex items-center justify-center text-xs font-bold text-white`}>
                            {user.level_points}
                          </div>
                          <span className="text-sm text-purple-300">Lvl</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xl font-bold text-yellow-400">
                          {formatValue(value)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'superadmin' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                          user.role === 'admin' ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30' :
                          user.role === 'moderator' ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' :
                          'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => router.push(`/profil/${user.userId}`)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400 transition-all"
                        >
                          👁️ Profil
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-purple-800/50">
            <div className="text-sm text-purple-400">
              {pagination.total} ta foydalanuvchidan {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} ko'rsatilmoqda
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Oldingi
              </button>
              <span className="px-3 py-1 text-sm font-semibold">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}