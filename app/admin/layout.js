// app/admin/layout.js
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  // Auth tekshiruv
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  // Admin roli tekshiruv
  const isAdmin = session.user.role === 'admin' || 
                  session.user.role === 'superadmin' || 
                  session.user.role === 'moderator'

  if (!isAdmin) {
    redirect('/')
  }

  const navigation = [
    {
      title: 'Asosiy',
      items: [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Foydalanuvchilar', href: '/admin/users', icon: '👥' },
        { name: 'Sertifikatlar', href: '/admin/certificates', icon: '🎓' },
      ]
    },
    {
      title: 'Kontent',
      items: [
        { name: 'Birikmalar', href: '/admin/compounds', icon: '🧪' },
        { name: 'Reaksiyalar', href: '/admin/reactions', icon: '⚗️' },
        { name: 'Quiz savollari', href: '/admin/quizzes', icon: '📝' },
        { name: 'Tahlil usullari', href: '/admin/analysis', icon: '🔬' },
        { name: '3D Molekulalar', href: '/admin/molecules', icon: '🔷' },
      ]
    },
    {
      title: 'Gamification',
      items: [
        { name: 'Missiyalar', href: '/admin/missions', icon: '🎯' },
        { name: 'Yutuqlar', href: '/admin/achievements', icon: '🏆' },
        { name: 'Leaderboard', href: '/admin/leaderboard', icon: '⭐' },
      ]
    },
    {
      title: 'Tizim',
      items: [
        { name: 'Muhokama', href: '/admin/forum', icon: '💬' },
        { name: 'Moderatsiya', href: '/admin/moderation', icon: '🛡️' },
        { name: 'Loglar', href: '/admin/logs', icon: '📋' },
        { name: 'Sozlamalar', href: '/admin/settings', icon: '⚙️' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-800/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              JDA KIMYO
            </Link>
            <div className="h-6 w-px bg-purple-800"></div>
            <span className="text-purple-300 text-sm font-semibold">
              Admin Panel
            </span>
            {session.user.role === 'superadmin' && (
              <span className="px-2 py-0.5 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-xs text-yellow-400 font-bold">
                👑 SUPER ADMIN
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                {session.user.fullName?.charAt(0) || session.user.username.charAt(0)}
              </div>
              <div className="text-sm">
                <div className="text-white font-semibold">{session.user.fullName || session.user.username}</div>
                <div className="text-purple-400 text-xs">{session.user.role}</div>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm transition-all"
            >
              🏠 Saytga qaytish
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900/50 border-r border-purple-800/50 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-6">
            {navigation.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-purple-200 hover:bg-purple-800/30 hover:text-white transition-all"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}