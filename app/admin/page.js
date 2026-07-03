// app/admin/page.js
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  // Parallel ravishda barcha statistikalarni olish
  const [
    totalUsers,
    todayActiveUsers,
    todayRegistrations,
    totalQuizzes,
    todayQuizResults,
    totalCompounds,
    totalMissions,
    activeMissions,
    totalAnalysisMethods,
    totalMolecules,
    featuredMolecules,
    totalAchievements,
    achievementsByRarity,
    totalAwardedAchievements,
    topUsers
  ] = await Promise.all([
    // Users
    prisma.user.count(),
    prisma.user.count({
      where: {
        lastActive: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    // Quizzes
    prisma.quizQuestion.count(),
    prisma.quizResult.count({
      where: {
        completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    // Compounds
    prisma.compound.count(),
    // Missions
    prisma.mission.count(),
    prisma.mission.count({
      where: {
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    // Analysis
    prisma.analysisMethod.count(),
    // Molecules
    prisma.molecule3D.count(),
    prisma.molecule3D.count({ where: { isFeatured: true } }),
    // Achievements
    prisma.achievementDefinition.count(),
    prisma.achievementDefinition.groupBy({
      by: ['rarity'],
      _count: true
    }),
    prisma.achievement.count(),
    // Top users
    prisma.user.findMany({
      take: 5,
      orderBy: { totalPoints: 'desc' },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        totalPoints: true,
        level_points: true,
        currentStreak: true
      }
    })
  ])

  // Rarity statistikasini obyektga aylantirish
  const rarityStats = achievementsByRarity.reduce((acc, r) => {
    acc[r.rarity] = r._count
    return acc
  }, {})

  const mainStats = [
    {
      title: 'Jami foydalanuvchilar',
      value: totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-700/50',
      subtitle: `${todayRegistrations} ta bugun ro'yxatdan o'tdi`,
      href: '/admin/users'
    },
    {
      title: 'Bugungi faol',
      value: todayActiveUsers,
      icon: '🔥',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-600/20 to-red-600/20',
      borderColor: 'border-orange-700/50',
      subtitle: `${totalUsers > 0 ? Math.round((todayActiveUsers / totalUsers) * 100) : 0}% faollik`,
      href: '/admin/users'
    },
    {
      title: 'Quiz savollari',
      value: totalQuizzes,
      icon: '📝',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-700/50',
      subtitle: `${todayQuizResults} ta bugun yechilgan`,
      href: '/admin/quizzes'
    },
    {
      title: 'Birikmalar',
      value: totalCompounds,
      icon: '🧪',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-700/50',
      subtitle: 'Kompleks birikmalar bazasi',
      href: '/admin/compounds'
    },
    {
      title: 'Missiyalar',
      value: totalMissions,
      icon: '🎯',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-600/20 to-purple-600/20',
      borderColor: 'border-indigo-700/50',
      subtitle: `${activeMissions} ta bugungi`,
      href: '/admin/missions'
    },
    {
      title: 'Tahlil usullari',
      value: totalAnalysisMethods,
      icon: '🔬',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-600/20 to-cyan-600/20',
      borderColor: 'border-teal-700/50',
      subtitle: '20 ta professional usul',
      href: '/admin/analysis'
    },
    {
      title: '3D Molekulalar',
      value: totalMolecules,
      icon: '🔷',
      color: 'from-sky-500 to-blue-500',
      bgColor: 'from-sky-600/20 to-blue-600/20',
      borderColor: 'border-sky-700/50',
      subtitle: `${featuredMolecules} ta tanlangan`,
      href: '/admin/molecules'
    },
    {
      title: 'Yutuqlar',
      value: totalAchievements,
      icon: '🏆',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-600/20 to-orange-600/20',
      borderColor: 'border-yellow-700/50',
      subtitle: `${totalAwardedAchievements} marta berilgan`,
      href: '/admin/achievements'
    }
  ]

  const quickActions = [
    { name: 'Yangi birikma', href: '/admin/compounds', icon: '➕', color: 'from-purple-600/20 to-pink-600/20', border: 'border-purple-700/50' },
    { name: 'Quiz savol', href: '/admin/quizzes', icon: '📝', color: 'from-green-600/20 to-emerald-600/20', border: 'border-green-700/50' },
    { name: 'Missiya yaratish', href: '/admin/missions', icon: '🎯', color: 'from-yellow-600/20 to-orange-600/20', border: 'border-yellow-700/50' },
    { name: 'Yutuq berish', href: '/admin/achievements', icon: '🏆', color: 'from-pink-600/20 to-rose-600/20', border: 'border-pink-700/50' },
    { name: '3D molekula', href: '/admin/molecules', icon: '🔷', color: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-700/50' },
    { name: 'Tahlil usuli', href: '/admin/analysis', icon: '🔬', color: 'from-teal-600/20 to-cyan-600/20', border: 'border-teal-700/50' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            📊 Dashboard
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full text-xs text-yellow-400 font-bold">
              LIVE
            </span>
          </h1>
          <p className="text-purple-300">JDA KIMYO platformasi — real vaqtda statistika</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-purple-400">
            Oxirgi yangilanish: <span className="text-white font-semibold">{new Date().toLocaleTimeString('uz-UZ')}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {mainStats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-2xl p-5 hover:scale-[1.02] transition-all group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-purple-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-purple-200 font-semibold mb-1">{stat.title}</div>
            <div className="text-xs text-purple-400">{stat.subtitle}</div>
          </Link>
        ))}
      </div>

      {/* Achievements Rarity + Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements by Rarity */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🏆</span> Yutuqlar (rarity)
            </h2>
            <Link href="/admin/achievements" className="text-xs text-yellow-400 hover:text-yellow-300">
              Barchasi →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { id: 'common', name: 'Oddiy', gradient: 'from-gray-500 to-gray-600', icon: '⚪' },
              { id: 'rare', name: 'Noyob', gradient: 'from-blue-500 to-cyan-500', icon: '🔵' },
              { id: 'epic', name: 'Epik', gradient: 'from-purple-500 to-pink-500', icon: '🟣' },
              { id: 'legendary', name: 'Afsonaviy', gradient: 'from-yellow-500 to-orange-500', icon: '🟡' }
            ].map(rarity => (
              <div key={rarity.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rarity.gradient} flex items-center justify-center text-lg`}>
                  {rarity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-semibold">{rarity.name}</span>
                    <span className="text-sm text-purple-300">{rarityStats[rarity.id] || 0} ta</span>
                  </div>
                  <div className="w-full bg-purple-950/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${rarity.gradient} rounded-full transition-all`}
                      style={{ width: `${totalAchievements > 0 ? ((rarityStats[rarity.id] || 0) / totalAchievements) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-purple-800/30 flex items-center justify-between">
            <span className="text-xs text-purple-400">Berilgan yutuqlar:</span>
            <span className="text-sm font-bold text-yellow-400">{totalAwardedAchievements} marta</span>
          </div>
        </div>

        {/* Top 5 Users */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👑</span> Top 5 Foydalanuvchilar
            </h2>
            <Link href="/admin/leaderboard" className="text-xs text-yellow-400 hover:text-yellow-300">
              Leaderboard →
            </Link>
          </div>
          <div className="space-y-2">
            {topUsers.map((user, idx) => (
              <Link
                key={user.id}
                href={`/profil/${user.userId}`}
                className="flex items-center gap-3 p-3 bg-purple-950/30 hover:bg-purple-950/50 rounded-xl transition-all group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                  idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                  idx === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                  'bg-purple-800/50 text-purple-300'
                }`}>
                  {idx === 0 ? '👑' : idx + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-xs text-purple-400 flex items-center gap-2">
                    <span>🔥 {user.currentStreak} kun</span>
                    <span>•</span>
                    <span>Lvl {user.level_points}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-yellow-400">{user.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-purple-400">XP</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Tezkor harakatlar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className={`bg-gradient-to-br ${action.color} border ${action.border} rounded-xl p-4 hover:scale-105 transition-all text-center`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-sm font-semibold text-white">{action.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-xs font-mono font-bold">SYSTEM ONLINE</span>
            </div>
            <span className="text-purple-300 text-sm">JDA KIMYO Admin Panel</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-purple-400">
            <span>📦 Database: <span className="text-green-400">Neon PostgreSQL</span></span>
            <span>🚀 Next.js 16.0.10</span>
            <span>🎯 Prisma 5.22.0</span>
            <span className="text-yellow-400 font-mono">v2.5.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}