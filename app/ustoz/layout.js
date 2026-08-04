// app/ustoz/layout.js
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import { ustozPaneliOchiqmi } from '@/lib/roles'

export const metadata = {
  title: "O'qituvchi paneli",
  // Shaxsiy panel — qidiruvda chiqmasin. robots.txt da `/ustoz/`
  // yopilgan, lekin u `/ustoz` ning o'zini qamramaydi.
  robots: { index: false, follow: false },
}

export default async function UstozLayout({ children }) {
  const session = await getServerSession(authOptions)

  // Auth tekshiruv
  if (!session?.user) {
    redirect('/login?callbackUrl=/ustoz')
  }

  // Tekshiruv endi lib/roles.js da — API'lardagi 29 ta nusxa bilan bitta
  // manbadan oziqlansin. Avval bu yerda va API'larda alohida-alohida
  // yozilgani uchun ular bir-biridan farq qilib ketgandi.
  //
  // MODERATOR ENDI KIRMAYDI: `adminHuquqlari` bo'yicha unda
  // `foydalanuvchilar: false`, ya'ni u foydalanuvchi ma'lumotini
  // ko'rmasligi kerak. Ustoz paneli esa aynan shuni ochadi — talabalar
  // ro'yxati va natijalar. Ustozlik kerak bo'lsa, unga alohida beriladi.
  if (!ustozPaneliOchiqmi(session.user)) {
    redirect('/')
  }

  const navigation = [
    {
      title: 'Asosiy',
      items: [
        { name: 'Dashboard', href: '/ustoz', icon: '📊' },
        { name: 'Talabalarim', href: '/ustoz/talaba', icon: '👥' },
        { name: 'Guruhlar', href: '/ustoz/guruh', icon: '📚' },
      ]
    },
    {
      title: 'Vazifalar',
      items: [
        { name: 'Vazifa yaratish', href: '/ustoz/new-vazifa', icon: '➕' },
        { name: 'Vazifalar ro\'yxati', href: '/ustoz/vazifa', icon: '📝' },
      ]
    },
    {
      title: 'Testlar',
      items: [
        { name: 'Variantli quiz', href: '/ustoz/open-quiz', icon: '❓' },
        { name: 'Variantsiz quiz', href: '/ustoz/yopiq-quiz', icon: '✍️' },
      ]
    },
    {
      title: 'Boshqaruv',
      items: [
        { name: 'Natijalar', href: '/ustoz/natijalar', icon: '📈' },
        { name: 'E\'lonlar', href: '/ustoz/elonlar', icon: '📢' },
        { name: 'Sozlamalar', href: '/ustoz/sozlash', icon: '⚙️' },
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
              👨‍🏫 O'qituvchi Paneli
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
                <div className="text-purple-400 text-xs">O'qituvchi</div>
              </div>
            </div>
            <Link
              href="/profil"
              className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm transition-all"
            >
              👤 Profilim
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