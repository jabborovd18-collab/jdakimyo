"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Ikon from '@/components/Ikon'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'

const NAV_GROUPS = [
  {
    title: 'Asosiy',
    items: [
      { name: 'Dashboard', href: '/ustoz', ikon: 'grafik', exact: true },
      { name: 'Talabalarim', href: '/ustoz/talaba', ikon: 'odamlar' },
      { name: 'Guruhlar', href: '/ustoz/guruh', ikon: 'kitob' },
    ]
  },
  {
    title: 'Testlar & Vazifalar',
    items: [
      { name: 'Variantli testlar', href: '/ustoz/open-quiz', ikon: 'quiz' },
      { name: 'Yozma testlar', href: '/ustoz/yopiq-quiz', ikon: 'fayl' },
      { name: 'Vazifalar ro\'yxati', href: '/ustoz/vazifa', ikon: 'kitob' },
      { name: 'Yangi vazifa', href: '/ustoz/new-vazifa', ikon: 'qosh' },
    ]
  },
  {
    title: 'Boshqaruv',
    items: [
      { name: 'Natijalar tahlili', href: '/ustoz/natijalar', ikon: 'orin' },
      { name: 'E\'lonlar', href: '/ustoz/elonlar', ikon: 'kanal' },
      { name: 'Ustoz profili', href: '/ustoz/sozlash', ikon: 'sozlama' },
    ]
  }
]

export default function UstozShell({ user, children }) {
  const [fon, fonTanla] = useFon()
  const pathname = usePathname()
  const [mobilSidebar, setMobilSidebar] = useState(false)

  useEffect(() => {
    setMobilSidebar(false)
  }, [pathname])

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const boshHarf = (user?.fullName || user?.username || 'U')[0].toUpperCase()

  return (
    <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobilSidebar(!mobilSidebar)}
              className="md:hidden p-2 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)] transition-all"
              aria-label="Menyuni ochish"
            >
              <Ikon nom={mobilSidebar ? 'yopish' : 'menyu'} olcham={18} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-[var(--v3-chiziq)]" />
            
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[var(--v3-chiziq-2)] bg-[var(--v3-yuza)] text-[var(--v3-urgu)]">
                Ustoz Paneli
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Fon tanlagich (4 rejim: tun, siyoh, grafit, kunduz) */}
            <FonTanlagich fon={fon} onFonTanla={fonTanla} ixcham />

            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-[var(--v3-chiziq)]">
              <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  boshHarf
                )}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold truncate max-w-[140px] text-[var(--v3-matn)]">
                  {user?.fullName || user?.username}
                </div>
                <div className="text-[10.5px] text-[var(--v3-xira)]">O{"'"}qituvchi</div>
              </div>
            </div>

            <Link
              href="/"
              className="v3-tugma text-xs py-1.5 px-3"
            >
              <Ikon nom="chap" olcham={14} />
              <span className="hidden sm:inline">Saytga qaytish</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {mobilSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobilSidebar(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 left-0 z-40 w-64 shrink-0
            h-[calc(100vh-4rem)] bg-[var(--v3-fon)] md:bg-transparent
            border-r border-[var(--v3-chiziq)]
            transform transition-transform duration-200 md:transform-none
            ${mobilSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 h-full overflow-y-auto space-y-6">
            <nav className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="px-3 mb-2 text-[10.5px] font-bold tracking-wider uppercase text-[var(--v3-xira)]">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = isActive(item)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                            ${active
                              ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                              : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)]'
                            }
                          `}
                        >
                          <Ikon nom={item.ikon} olcham={16} qalin={active ? 2 : 1.6} />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="pt-4 border-t border-[var(--v3-chiziq)]">
              <Link
                href="/oquv/video-darsliklar/ustoz-quiz"
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:border-[var(--v3-chiziq-2)] transition-all"
              >
                <span>Talaba nigohi bilan ko{"'"}rish</span>
                <Ikon nom="ong" olcham={14} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
