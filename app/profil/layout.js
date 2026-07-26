// app/profil/layout.js
"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isAdminRole, isTeacherRole, roleInfo } from '@/lib/roles'

// Menyu guruhlarga bo'lingan. Avval 15+ havola bitta uzun ro'yxatda edi —
// guruhlar kodda mavjud bo'lsa-da, render qilishdan oldin flat qilinardi.
const MENU_GROUPS = [
  {
    title: 'Asosiy',
    items: [
      { href: '/profil', label: 'Dashboard', icon: '📊', exact: true },
      { href: '/profil/faoliyat', label: 'Faoliyat', icon: '📈' },
    ],
  },
  {
    title: "O'qish",
    items: [
      { href: '/profil/ustozim', label: 'Ustozlarim', icon: '👨‍🏫' },
      { href: '/profil/vazifalar', label: 'Vazifalar', icon: '📋' },
      { href: '/profil/darslar', label: 'Darslar', icon: '🎬' },
      { href: '/profil/quizlar', label: 'Quiz natijalari', icon: '📝' },
      { href: '/profil/elonlar', label: 'Xabarlar', icon: '🔔' },
    ],
  },
  {
    title: 'Yutuqlar',
    items: [
      { href: '/profil/yutuqlar', label: 'Yutuqlar', icon: '🏆' },
      { href: '/profil/sertifikatlar', label: 'Sertifikatlar', icon: '📜' },
      { href: '/profil/reytingim', label: 'Reytingim', icon: '🥇' },
    ],
  },
  {
    title: 'Ijtimoiy',
    items: [
      { href: '/profil/dostlar', label: "Do'stlar", icon: '👥' },
      { href: '/profil/obunachilar', label: 'Obunachilar', icon: '👤' },
      { href: '/profil/obunalar', label: 'Obunalar', icon: '👁️' },
    ],
  },
  {
    title: 'Sozlamalar',
    items: [
      { href: '/profil/sozlama', label: 'Sozlamalar', icon: '⚙️' },
      { href: '/profil/maxfiylik', label: 'Maxfiylik', icon: '🔒' },
    ],
  },
]

export default function ProfilLayout({ children }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sahifa almashganda mobil menyu ochiq qolib ketmasin
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl mb-4 animate-pulse">
            ⏳
          </div>
          <p className="text-purple-300">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Kirish talab qilinadi</h1>
          <Link href="/login" className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl">
            Kirish
          </Link>
        </div>
      </div>
    )
  }

  const user = session.user
  const role = user.role || 'bakalavr'
  const info = roleInfo(role)

  // Panellar alohida ko'rsatiladi — bular profil ichidagi sahifa emas, tashqi bo'lim
  const panels = []
  if (isAdminRole(role)) {
    panels.push({ href: '/admin', label: 'Admin panel', icon: '🛡️', accent: 'orange' })
  }
  if (isTeacherRole(role)) {
    panels.push({ href: '/ustoz', label: 'Ustoz paneli', icon: '👨‍🏫', accent: 'green' })
  }

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  // Joriy sahifa nomi (mobil sarlavha uchun)
  const currentItem = MENU_GROUPS.flatMap(g => g.items).find(isActive)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-purple-950/95 backdrop-blur-xl border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menyu"
              className="md:hidden p-2 -ml-2 text-purple-300 hover:text-white transition-colors"
            >
              {sidebarOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

            <Link href="/" className="flex items-center gap-3 min-w-0">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent whitespace-nowrap">
                JDA KIMYO
              </div>
              <div className="hidden lg:block px-3 py-1 bg-purple-900/60 rounded-full text-xs text-purple-300 border border-purple-700/50">
                Shaxsiy kabinet
              </div>
            </Link>

            {/* Mobilda joriy bo'lim nomi */}
            {currentItem && (
              <span className="md:hidden text-sm text-purple-300 truncate border-l border-purple-800 pl-3">
                {currentItem.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold">{user.fullName || user.username}</div>
                <div className="text-xs text-purple-400">@{user.username}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-purple-700 flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (user.fullName || user.username || 'U')[0].toUpperCase()
                )}
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 md:px-4 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-xl text-red-400 transition-all flex items-center gap-2"
            >
              <span>🚪</span>
              <span className="hidden md:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobil sidebar uchun fon — bosilganda yopiladi */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 md:top-16 left-0 z-40 w-72 flex-shrink-0
            h-[calc(100vh-4rem)] bg-purple-950/95 md:bg-transparent
            border-r border-purple-800/50
            transform transition-transform duration-300 md:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 h-full overflow-y-auto">
            {/* User Quick Info */}
            <div className="mb-5 px-3 py-4 bg-purple-900/40 rounded-2xl border border-purple-700/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl font-bold flex-shrink-0 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.fullName || user.username || 'U')[0].toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{user.fullName || user.username}</div>
                  <div className="text-xs text-purple-400">Level {user.level_points || 1}</div>
                </div>
              </div>
              <div className={`mt-3 px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 ${info.badge}`}>
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </div>
            </div>

            {/* Panellar (admin / ustoz) — eng tepada, chunki bular tashqi bo'lim */}
            {panels.length > 0 && (
              <div className="mb-5 space-y-1.5">
                {panels.map(panel => (
                  <Link
                    key={panel.href}
                    href={panel.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border
                      ${panel.accent === 'orange'
                        ? 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-600/40 text-orange-300'
                        : 'bg-green-600/20 hover:bg-green-600/30 border-green-600/40 text-green-300'}
                    `}
                  >
                    <span className="text-lg w-6">{panel.icon}</span>
                    <span>{panel.label}</span>
                    <span className="ml-auto text-xs opacity-70">↗</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Guruhlangan navigatsiya */}
            <nav className="space-y-5 pb-6">
              {MENU_GROUPS.map(group => (
                <div key={group.title}>
                  <div className="px-4 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-500">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const active = isActive(item)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${active
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg'
                              : 'hover:bg-purple-900/60 text-purple-200 hover:text-white'
                            }
                          `}
                        >
                          <span className="text-base w-5">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
