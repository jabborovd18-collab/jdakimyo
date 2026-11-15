"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isAdminRole, ustozPaneliOchiqmi } from '@/lib/roles'
import { useBildirishnomaSanoq } from '@/lib/use-bildirishnoma'
import { chatKirishHavolasi } from '@/lib/chat-interfeys'
import { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const MENU_GROUPS = [
  {
    title: 'Asosiy',
    items: [
      { href: '/profil', label: 'Bosh sahifa', ikon: 'grafik', exact: true },
      { href: '/profil/bildirishnomalar', label: 'Bildirishnomalar', ikon: 'qongiroq', belgi: 'oqilmagan' },
      { href: '/profil/faoliyat', label: 'Faollik grafigi', ikon: 'vaqt' },
    ],
  },
  {
    title: "O'qish & Ta'lim",
    items: [
      { href: '/profil/ustozim', label: 'Ustozlarim', ikon: 'ustoz', belgi: 'ustozTaklifi' },
      { href: '/profil/vazifalar', label: 'Vazifalar', ikon: 'kitob' },
      { href: '/profil/darslar', label: 'Darslar va testlar', ikon: 'video' },
      { href: '/profil/quizlar', label: 'Quiz natijalari', ikon: 'quiz' },
      { href: '/profil/elonlar', label: 'Xabarnomalar', ikon: 'kanal' },
    ],
  },
  {
    title: 'Yutuqlar',
    items: [
      { href: '/profil/yutuqlar', label: 'Yutuqlar', ikon: 'orin' },
      { href: '/profil/sertifikatlar', label: 'Sertifikatlar', ikon: 'fayl' },
      { href: '/profil/reytingim', label: 'Reytingim', ikon: 'yulduz' },
    ],
  },
  {
    title: 'Ijtimoiy',
    items: [
      { href: '/chat', label: 'Shaxsiy chat', ikon: 'xabar', belgi: 'chat', tashqi: true },
      { href: '/profil/dostlar', label: "Do'stlar", ikon: 'odamlar', belgi: 'dostTaklifi' },
      { href: '/profil/sovgalar', label: "Kunlik sovg'alar", ikon: 'sovga' },
      { href: '/profil/obunachilar', label: 'Obunachilar', ikon: 'odam' },
      { href: '/profil/obunalar', label: 'Obunalar', ikon: 'tashqi' },
    ],
  },
  {
    title: 'Sozlamalar',
    items: [
      { href: '/profil/sozlama', label: 'Sozlamalar', ikon: 'sozlama' },
      { href: '/profil/maxfiylik', label: 'Maxfiylik', ikon: 'qalqon' },
      { href: '/profil/loglar', label: 'Loglar va tarix', ikon: 'royxat' },
    ],
  },
]

function Nishon({ soni }) {
  if (!soni) return null
  return (
    <span className="ml-auto min-w-[18px] h-[18px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
      {soni > 99 ? '99+' : soni}
    </span>
  )
}

function ProfilMenyuTarkibi({ panels, isActive, sanoq, onNavigate, mobil = false }) {
  return (
    <>
      {panels.length > 0 && (
        <div className={mobil ? 'p-3 border-b border-[var(--v3-chiziq)] space-y-1.5' : 'space-y-1.5'}>
          {panels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              onClick={onNavigate}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs font-semibold text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all"
            >
              <Ikon nom={panel.ikon} olcham={15} />
              <span>{panel.label}</span>
              <Ikon nom="tashqi" olcham={12} className="ml-auto text-[var(--v3-xira)]" />
            </Link>
          ))}
        </div>
      )}

      <nav className={mobil ? 'flex-1 overflow-y-auto p-3.5 space-y-5' : 'space-y-5 pb-6'} aria-label="Kabinet menyusi">
        {MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <div className={`px-3 mb-1.5 text-[10px] font-bold tracking-wider uppercase ${mobil ? 'text-[var(--v3-urgu)]' : 'text-[var(--v3-xira)]'}`}>
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`
                      flex items-center gap-2.5 px-3 py-2.5 md:py-2 rounded-xl text-xs font-medium transition-all
                      ${active
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                        : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)]'
                      }
                    `}
                  >
                    <Ikon nom={item.ikon} olcham={15} qalin={active ? 2 : 1.6} />
                    <span>{item.label}</span>
                    {item.belgi && <Nishon soni={sanoq[item.belgi]} />}
                    {item.tashqi && (
                      <Ikon nom="tashqi" olcham={11} className="ml-auto opacity-60" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  )
}

export default function ProfilLayout({ children }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [fon] = useFon()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { sanoq } = useBildirishnomaSanoq(Boolean(session))

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return (
      <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Kabinet yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (!session?.user?.id) {
    const kirishHref = pathname && pathname !== '/profil'
      ? `/login?callbackUrl=${encodeURIComponent(pathname)}`
      : '/login'
    return (
      <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-sm w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="odam" olcham={24} />
          </div>
          <h1 className="text-lg font-bold text-[var(--v3-matn)]">Kirish talab qilinadi</h1>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            Shaxsiy kabinetdan foydalanish uchun hisobingizga kiring.
          </p>
          <Link href={kirishHref} className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold inline-flex items-center gap-1.5">
            <span>Kirish</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </div>
    )
  }

  const user = session.user
  const role = user.role || 'bakalavr'
  const ism = user.fullName || user.username || 'Foydalanuvchi'
  const boshHarf = ism[0].toUpperCase()

  const panels = []
  if (isAdminRole(role) && !user.doskaTugaydi) {
    panels.push({ href: '/admin', label: 'Admin paneli', ikon: 'qalqon' })
  }
  if (ustozPaneliOchiqmi(user)) {
    panels.push({ href: '/ustoz', label: 'Ustoz paneli', ikon: 'ustoz' })
    if (!user.doskaTugaydi) {
      panels.push({ href: '/doska/skaner', label: 'Doska skaneri', ikon: 'skaner' })
    }
  }

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const mobilTugmalar = [
    { href: '/profil', label: 'Asosiy', ikon: 'grafik', exact: true },
    { href: '/profil/darslar', label: 'Darslar', ikon: 'video' },
    { href: '/chat', label: 'Chat', ikon: 'xabar', belgi: 'chat' },
    { href: '/profil/sozlama', label: 'Sozlama', ikon: 'sozlama' },
  ]
  const jamiYangi = (sanoq.oqilmagan || 0) + (sanoq.dostTaklifi || 0) + (sanoq.ustozTaklifi || 0)

  return (
    <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Header */}
      <header className="v3-header z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all shrink-0"
              aria-label="Menyu"
            >
              <Ikon nom="menyu" olcham={20} />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn text-base sm:text-lg">JDA KIMYO</span>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-[var(--v3-chiziq)]" />

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="v3-tag v3-tag-muhlat text-[11px] font-bold">
                Shaxsiy Kabinet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href={chatKirishHavolasi({ qaytish: pathname })}
              className="relative p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all flex items-center justify-center shrink-0"
              aria-label="Xabarlar"
              title="Xabarlar"
            >
              <Ikon nom="xabar" olcham={17} />
              {sanoq.chat > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9.5px] font-bold leading-none">
                  {sanoq.chat > 99 ? '99+' : sanoq.chat}
                </span>
              )}
            </Link>

            <Link
              href="/profil/bildirishnomalar"
              className="relative p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all flex items-center justify-center shrink-0"
              aria-label="Bildirishnomalar"
            >
              <Ikon nom="qongiroq" olcham={17} />
              {sanoq.oqilmagan > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9.5px] font-bold leading-none">
                  {sanoq.oqilmagan > 99 ? '99+' : sanoq.oqilmagan}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-[var(--v3-chiziq)]">
              <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  boshHarf
                )}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold truncate max-w-[130px] text-[var(--v3-matn)] flex items-center gap-1">
                  <span>{ism}</span>
                  <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" />
                </div>
                <div className="text-[10px] text-[var(--v3-xira)]">@{user.username}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="v3-tugma text-xs py-1.5 px-2.5 sm:px-3 text-red-400 hover:border-red-500/40"
              aria-label="Chiqish"
              title="Chiqish"
            >
              <Ikon nom="chiqish" olcham={14} />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ MOBIL SIDEBAR DRAWER ═══ */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--v3-fon-2)] border-r border-[var(--v3-chiziq-2)] shadow-2xl flex flex-col md:hidden animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-[var(--v3-chiziq)] flex items-center justify-between bg-[var(--v3-yuza)]">
              <div className="flex items-center gap-2">
                <span className="v3-logo" aria-hidden="true" />
                <div>
                  <div className="font-bold text-xs text-[var(--v3-matn)]">JDA KIMYO</div>
                  <div className="text-[10px] text-[var(--v3-urgu)] font-semibold">Shaxsiy Kabinet</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                aria-label="Menyuni yopish"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {/* User Quick Info */}
            <div className="p-4 border-b border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-urgu)] flex items-center justify-center font-bold text-sm text-[var(--v3-urgu)] overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    boshHarf
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--v3-matn)] truncate flex items-center gap-1">
                    <span>{ism}</span>
                    <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" />
                  </div>
                  <div className="text-[10.5px] text-[var(--v3-xira)] font-mono truncate">
                    @{user.username}
                  </div>
                </div>
              </div>
            </div>

            <ProfilMenyuTarkibi
              panels={panels}
              isActive={isActive}
              sanoq={sanoq}
              onNavigate={() => setSidebarOpen(false)}
              mobil
            />
          </div>
        </>
      )}

      {/* ═══ DESKTOP MAIN LAYOUT ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:sticky md:top-16 md:w-64 md:h-[calc(100vh-4rem)] md:shrink-0 md:border-r md:border-[var(--v3-chiziq)]">
          <div className="p-4 h-full overflow-y-auto space-y-5">
            {/* User Quick Info */}
            <div className="v3-panel-karta p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-urgu)] flex items-center justify-center font-bold text-sm text-[var(--v3-urgu)] overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    boshHarf
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                    <span>{ism}</span>
                    <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" />
                  </div>
                  <div className="text-[10px] text-[var(--v3-xira)] font-mono">@{user.username}</div>
                </div>
              </div>
            </div>

            <ProfilMenyuTarkibi
              panels={panels}
              isActive={isActive}
              sanoq={sanoq}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* ═══ MOBIL PASTKI NAVIGATSIYA BAR ═══ */}
      <nav
        aria-label="Tezkor mobil menyu"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--v3-chiziq)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
        style={{ background: 'color-mix(in srgb, var(--v3-fon-2) 92%, transparent)' }}
      >
        <div className="grid grid-cols-5 h-16">
          {mobilTugmalar.map((item) => {
            const active = isActive(item)
            const badge = item.belgi ? sanoq[item.belgi] : 0
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  active ? 'text-[var(--v3-urgu)]' : 'text-[var(--v3-xira)]'
                }`}
              >
                <div className="relative">
                  <Ikon nom={item.ikon} olcham={19} qalin={active ? 2 : 1.6} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-full px-1">{item.label}</span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-[var(--v3-xira)] hover:text-[var(--v3-matn)] transition-colors"
            aria-label="Barcha bo'limlar"
          >
            <div className="relative">
              <Ikon nom="menyu" olcham={19} />
              {jamiYangi > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                  {jamiYangi > 99 ? '99+' : jamiYangi}
                </span>
              )}
            </div>
            <span>Bo&apos;limlar</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
