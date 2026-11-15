// components/admin/AdminShell.jsx
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Ikon from '@/components/Ikon'
import { useFon } from '@/components/FonTanlagich'
import { roleInfo } from '@/lib/roles'
import { AdminBadge } from './AdminUI'

const NAVIGATION = [
  {
    title: 'Asosiy',
    items: [
      { name: 'Dashboard', href: '/admin', ikon: 'grafik', kerak: 'statistika' },
      { name: 'Foydalanuvchilar', href: '/admin/users', ikon: 'odamlar', kerak: 'foydalanuvchilar' },
      { name: 'Milliy Sertifikat', href: '/admin/milliy-sertifikat', ikon: 'medal', kerak: 'sertifikatlar' },
      { name: 'Mavsumiy hamkor', href: '/admin/mavsumiyhamkor', ikon: 'hamkor', kerak: 'sertifikatlar' },
      { name: 'Sertifikatlar', href: '/admin/certificates', ikon: 'sertifikat', kerak: 'sertifikatlar' },
      { name: 'Kanallar', href: '/admin/kanallar', ikon: 'kanal', kerak: 'kanallar' },
    ],
  },
  {
    title: 'Kontent va gamifikatsiya',
    items: [
      { name: 'Quiz banki', href: '/admin/quizzes', ikon: 'quiz', kerak: 'kontent' },
      { name: 'Kimyo 0 dan kursi', href: '/admin/kimyo-0-dan', ikon: 'kolba', kerak: 'kontent' },
      { name: 'Reaksiyalar', href: '/admin/reactions', ikon: 'kolba', kerak: 'kontent' },
      { name: 'Kunlik iqtiboslar', href: '/admin/quotes', ikon: 'qalam', kerak: 'kontent' },
      { name: 'Kunlik missiyalar', href: '/admin/missions', ikon: 'olov', kerak: 'gamifikatsiya' },
      { name: 'Yutuqlar', href: '/admin/achievements', ikon: 'kubok', kerak: 'gamifikatsiya' },
      { name: 'Reyting', href: '/admin/leaderboard', ikon: 'orin', kerak: 'gamifikatsiya' },
      { name: 'Bot valyutasi', href: '/admin/pul', ikon: 'tanga', kerak: 'pul' },
    ],
  },
  {
    title: 'Nazorat va tizim',
    items: [
      { name: 'Muhokama', href: '/admin/forum', ikon: 'muhokama', kerak: 'moderatsiya' },
      { name: 'Chat nazorati', href: '/admin/chat', ikon: 'xabar', kerak: 'moderatsiya' },
      { name: 'Shikoyatlar', href: '/admin/moderation', ikon: 'qalqon', kerak: 'moderatsiya' },
      { name: 'Amallar qaydnomasi', href: '/admin/logs', ikon: 'fayl', kerak: 'qaydnoma' },
      { name: 'Telegram bot', href: '/admin/telegram', ikon: 'bot', kerak: 'bot' },
      { name: 'JDA Kimyo AI', href: '/admin/jdakimyo-ai', ikon: 'uchqun', kerak: 'aiKorish' },
      { name: 'Sozlamalar', href: '/admin/settings', ikon: 'sozlama', kerak: 'sozlamalar' },
    ],
  },
]

function NavMazmun({ groups, pathname, onNavigate, userRoleLabel }) {
  const activeCheck = (href) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="flex flex-col h-full justify-between gap-6">
      <div className="space-y-5">
        {groups.map((section) => (
          <div key={section.title}>
            <div className="v3-nishon px-3 mb-2">{section.title}</div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const active = activeCheck(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                        : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)]'
                    }`}
                  >
                    <Ikon nom={item.ikon} olcham={15} qalin={active ? 2.1 : 1.65} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] p-3 text-[11px] text-[var(--v3-xira)] space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--v3-matn)]">JDA KIMYO v4</span>
          <span className="text-[var(--v3-urgu)] font-mono">Safir</span>
        </div>
        <div>Faol rol: {userRoleLabel}</div>
      </div>
    </div>
  )
}

export default function AdminShell({ user, huquq, children }) {
  const [fon] = useFon()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const visibleGroups = NAVIGATION.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.kerak || huquq[item.kerak]),
  })).filter((section) => section.items.length > 0)

  const rol = roleInfo(user?.role)
  const ism = user?.fullName || user?.username || 'Administrator'

  return (
    <div data-fon={fon} className="v3 min-h-screen flex flex-col">
      {/* Sticky v4 Sarlavha */}
      <header className="v3-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="md:hidden v3-ikon-tugma shrink-0"
              aria-label="Menyuni ochish"
            >
              <Ikon nom={drawerOpen ? 'yopish' : 'menyu'} olcham={18} />
            </button>

            <Link
              href={huquq.statistika ? '/admin' : '/admin/quizzes'}
              className="flex items-center gap-2.5 min-w-0"
            >
              <span className="v3-logo" />
              <span className="v3-logo-matn text-[var(--v3-matn)]">JDA KIMYO</span>
              <span className="hidden sm:inline-block">
                <AdminBadge tone="primary">Admin v4</AdminBadge>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] px-3 py-1.5 text-xs">
              <Ikon nom="qalqon" olcham={14} className="text-[var(--v3-urgu)]" />
              <span className="font-semibold text-[var(--v3-matn)] max-w-[140px] truncate">{ism}</span>
              <span className="text-[var(--v3-xira)]">· {rol.label}</span>
            </div>

            <Link href="/profil" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="odam" olcham={14} />
              <span className="hidden sm:inline">Kabinet</span>
            </Link>

            <Link href="/" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="chap" olcham={14} />
              <span className="hidden sm:inline">Saytga</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobil yon menyu */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false)
          }}
        >
          <aside
            className="w-72 max-w-[85vw] h-full overflow-y-auto border-r border-[var(--v3-chiziq)] p-4"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--v3-chiziq)]">
              <div className="min-w-0">
                <div className="text-sm font-bold text-[var(--v3-matn)] truncate">{ism}</div>
                <div className="text-xs text-[var(--v3-xira)]">{rol.label}</div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="v3-ikon-tugma"
                aria-label="Yopish"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>
            <NavMazmun
              groups={visibleGroups}
              pathname={pathname}
              onNavigate={() => setDrawerOpen(false)}
              userRoleLabel={rol.label}
            />
          </aside>
        </div>
      )}

      {/* Asosiy Konteyner */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        <aside className="hidden md:block w-60 shrink-0">
          <div className="sticky top-20 v3-panel-karta p-3.5 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <NavMazmun
              groups={visibleGroups}
              pathname={pathname}
              userRoleLabel={rol.label}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-10">{children}</main>
      </div>
    </div>
  )
}
