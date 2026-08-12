"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Ikon from '@/components/Ikon'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

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

  // Sahifa o'zgarganda mobil menyuni avtomatik yopish
  useEffect(() => {
    setMobilSidebar(false)
  }, [pathname])

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const ism = user?.fullName || user?.username || 'Ustoz'
  const boshHarf = ism[0].toUpperCase()

  return (
    <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[var(--v3-fon-2)]/95 backdrop-blur-xl border-b border-[var(--v3-chiziq)] transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile drawer trigger */}
            <button
              type="button"
              onClick={() => setMobilSidebar(true)}
              className="md:hidden p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all flex items-center justify-center shrink-0"
              aria-label="Menyuni ochish"
            >
              <Ikon nom="menyu" olcham={20} />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn text-base sm:text-lg">JDA KIMYO</span>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-[var(--v3-chiziq)]" />

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="v3-tag v3-tag-yopiq text-[11px] font-bold">
                Ustoz Paneli
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fon tanlagich (4 rejim: tun, siyoh, grafit, kunduz) */}
            <FonTanlagich fon={fon} tanla={fonTanla} />

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-2.5 pl-2.5 border-l border-[var(--v3-chiziq)]">
              <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  boshHarf
                )}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold truncate max-w-[130px] text-[var(--v3-matn)] flex items-center gap-1">
                  <span>{ism}</span>
                  <TasdiqBelgisi tasdiqlangan={user?.isVerified} olcham="kichik" />
                </div>
                <div className="text-[10px] text-[var(--v3-xira)]">O{"'"}qituvchi</div>
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

      {/* ═══ MOBIL SIDEBAR DRAWER ═══ */}
      {mobilSidebar && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setMobilSidebar(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--v3-fon-2)] border-r border-[var(--v3-chiziq-2)] shadow-2xl flex flex-col md:hidden animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[var(--v3-chiziq)] flex items-center justify-between bg-[var(--v3-yuza)]">
              <div className="flex items-center gap-2">
                <span className="v3-logo" aria-hidden="true" />
                <div>
                  <div className="font-bold text-xs text-[var(--v3-matn)]">JDA KIMYO</div>
                  <div className="text-[10px] text-[var(--v3-urgu)] font-semibold">Ustoz Paneli</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobilSidebar(false)}
                className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                aria-label="Yopish"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {/* Teacher Profile Quick Card */}
            <div className="p-4 border-b border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-urgu)] flex items-center justify-center font-bold text-sm text-[var(--v3-urgu)] overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    boshHarf
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--v3-matn)] truncate flex items-center gap-1">
                    <span>{ism}</span>
                    <TasdiqBelgisi tasdiqlangan={user?.isVerified} olcham="kichik" />
                  </div>
                  <div className="text-[10.5px] text-[var(--v3-xira)] font-mono truncate">
                    @{user?.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-[var(--v3-urgu)]">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = isActive(item)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobilSidebar(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                            ${active
                              ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                              : 'text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]'
                            }
                          `}
                        >
                          <Ikon nom={item.ikon} olcham={17} qalin={active ? 2 : 1.7} />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Bottom */}
            <div className="p-3 border-t border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-2">
              <Link
                href="/oquv/video-darsliklar/ustoz-quiz"
                onClick={() => setMobilSidebar(false)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-xs text-[var(--v3-matn)] font-medium"
              >
                <span>Talaba nigohi bilan ko{"'"}rish</span>
                <Ikon nom="ong" olcham={13} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ═══ MAIN LAYOUT (DESKTOP + CONTENT) ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto flex">
        {/* Desktop Sidebar (Only visible on md and up) */}
        <aside className="hidden md:block md:sticky md:top-16 md:w-64 md:h-[calc(100vh-4rem)] md:shrink-0 md:border-r md:border-[var(--v3-chiziq)]">
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
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
