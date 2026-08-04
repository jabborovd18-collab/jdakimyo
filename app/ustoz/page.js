// app/ustoz/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UstozDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    activeAssignments: 0,
    pendingSubmissions: 0,
    totalAnnouncements: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/ustoz/dashboard')
      const data = await res.json()
      if (res.ok) {
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      }
    } catch (error) {
      toast.error('Dashboard ma\'lumotlarini yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="animate-spin text-6xl">⏳</div>
      </main>
    )
  }

  // Sinflar TO'LIQ yozilgan, `from-${color}-900/30` kabi yig'ilmaydi.
  // Tailwind manba matnini o'qib sinf yasaydi — qismlarga bo'lingan nomni
  // u ko'rmaydi. Avval shunday yozilgani uchun `to-...-800/30` olti
  // rangning hech biri uchun yaratilmagan va gradient ikkinchi rangga
  // emas, shaffofga tugardi.
  const quickActions = [
    { href: '/ustoz/guruh', icon: '👥', label: 'Guruh yaratish', style: 'from-blue-900/30 to-blue-800/30 border-blue-700/50 hover:border-blue-500/50' },
    { href: '/ustoz/new-vazifa', icon: '📝', label: 'Vazifa yaratish', style: 'from-green-900/30 to-green-800/30 border-green-700/50 hover:border-green-500/50' },
    { href: '/ustoz/open-quiz', icon: '❓', label: 'Variantli quiz', style: 'from-purple-900/30 to-purple-800/30 border-purple-700/50 hover:border-purple-500/50' },
    { href: '/ustoz/yopiq-quiz', icon: '✍️', label: 'Variantsiz quiz', style: 'from-orange-900/30 to-orange-800/30 border-orange-700/50 hover:border-orange-500/50' },
    { href: '/ustoz/elonlar', icon: '📢', label: 'E\'lon qilish', style: 'from-pink-900/30 to-pink-800/30 border-pink-700/50 hover:border-pink-500/50' },
    { href: '/ustoz/natijalar', icon: '📊', label: 'Natijalar', style: 'from-cyan-900/30 to-cyan-800/30 border-cyan-700/50 hover:border-cyan-500/50' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              JDA KIMYO
            </Link>
            <div className="h-6 w-px bg-purple-800"></div>
            <span className="text-purple-300 text-sm">O'qituvchi Paneli</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/profil" className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl text-sm">
              👤 Profilim
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Xush kelibsiz, <span className="text-yellow-400">{session?.user?.fullName || session?.user?.username}</span>! 👋
          </h1>
          <p className="text-purple-300">Bugungi statistika va tezkor harakatlar</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-5">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-blue-400">{stats.totalStudents}</div>
            <div className="text-xs text-purple-300">Talabalar</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-2xl p-5">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold text-green-400">{stats.totalGroups}</div>
            <div className="text-xs text-purple-300">Guruhlar</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-2xl p-5">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold text-purple-400">{stats.activeAssignments}</div>
            <div className="text-xs text-purple-300">Faol vazifalar</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-700/50 rounded-2xl p-5">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-orange-400">{stats.pendingSubmissions}</div>
            <div className="text-xs text-purple-300">Tekshirish kerak</div>
          </div>
          <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-700/50 rounded-2xl p-5">
            <div className="text-3xl mb-2">📢</div>
            <div className="text-3xl font-bold text-pink-400">{stats.totalAnnouncements}</div>
            <div className="text-xs text-purple-300">E'lonlar</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">⚡ Tezkor harakatlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className={`bg-gradient-to-br ${action.style} border rounded-2xl p-6 transition-all transform hover:-translate-y-1 text-center group`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                <div className="text-sm font-semibold text-white">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">📋 Oxirgi faoliyat</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="bg-purple-950/30 rounded-xl p-4 flex items-center gap-4">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{activity.title}</div>
                    <div className="text-xs text-purple-400">{activity.time}</div>
                  </div>
                  <div className="text-xs text-purple-300">{activity.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-purple-400">
              <div className="text-6xl mb-4">📭</div>
              <p>Hali faoliyat yo'q</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}