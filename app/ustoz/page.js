"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

export default function UstozDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    activeAssignments: 0,
    pendingSubmissions: 0,
    totalAnnouncements: 0,
    totalQuizzes: 0,
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
        setStats(data.stats || {})
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      toast.error('Dashboard ma\'lumotlarini yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { href: '/ustoz/open-quiz', ikon: 'quiz', label: 'Variantli test yaratish', tavsif: 'Ochiq va yopiq variantli testlar' },
    { href: '/ustoz/yopiq-quiz', ikon: 'fayl', label: 'Yozma test va baholash', tavsif: 'Erkin javobli savollarni tekshirish' },
    { href: '/ustoz/natijalar', ikon: 'orin', label: 'Natijalar tahlili', tavsif: 'Talabalarning o\'zlashtirish ko\'rsatkichlari' },
    { href: '/ustoz/talaba', ikon: 'odamlar', label: 'Talabalarni boshqarish', tavsif: 'Takliflar va talabalar ro\'yxati' },
    { href: '/ustoz/guruh', ikon: 'kitob', label: 'Guruhlar tuzish', tavsif: 'Kurslar va guruhlarni ajratish' },
    { href: '/ustoz/new-vazifa', ikon: 'qosh', label: 'Vazifa berish', tavsif: 'Muddatli mustaqil ishlar' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Ma{"'"}lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="v3-panel-karta relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="v3-nishon mb-1">Ustoz ish stoli</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
              Assalomu alaykum, <span className="text-[var(--v3-urgu)]">{session?.user?.fullName || session?.user?.username}</span>
            </h1>
            <p className="text-sm text-[var(--v3-xira)] mt-1 max-w-xl leading-relaxed">
              Ochiq va guruhli testlaringizni boshqaring, talabalar yechimlarini tekshiring va shaxsiy tahlillarni kuzating.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/ustoz/open-quiz"
              className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4"
            >
              <Ikon nom="qosh" olcham={15} />
              Yangi test tuzish
            </Link>
            <Link
              href="/oquv/video-darsliklar/ustoz-quiz"
              className="v3-tugma text-xs py-2 px-4"
            >
              <Ikon nom="tashqi" olcham={15} />
              Barcha ochiq testlar
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <div className="v3-nishon mb-3">Umumiy ko{"'"}rsatkichlar</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="v3-panel-karta p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--v3-xira)] mb-2">
              <span className="text-xs font-semibold">Talabalar</span>
              <Ikon nom="odamlar" olcham={18} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.totalStudents || 0}
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1">Faol a{"'"}zolar</div>
          </div>

          <div className="v3-panel-karta p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--v3-xira)] mb-2">
              <span className="text-xs font-semibold">Guruhlar</span>
              <Ikon nom="kitob" olcham={18} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.totalGroups || 0}
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1">O{"'"}quv guruhlari</div>
          </div>

          <div className="v3-panel-karta p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--v3-xira)] mb-2">
              <span className="text-xs font-semibold">Vazifalar</span>
              <Ikon nom="kitob" olcham={18} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.activeAssignments || 0}
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1">Berilgan topshiriqlar</div>
          </div>

          <div className="v3-panel-karta p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--v3-xira)] mb-2">
              <span className="text-xs font-semibold">Tekshirishda</span>
              <Ikon nom="vaqt" olcham={18} className={stats.pendingSubmissions > 0 ? 'text-[var(--v3-urgu)]' : ''} />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold font-mono ${stats.pendingSubmissions > 0 ? 'text-[var(--v3-urgu)]' : 'text-[var(--v3-matn)]'}`}>
              {stats.pendingSubmissions || 0}
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1">Baho kutayotgan</div>
          </div>

          <div className="v3-panel-karta p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--v3-xira)] mb-2">
              <span className="text-xs font-semibold">E{"'"}lonlar</span>
              <Ikon nom="kanal" olcham={18} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.totalAnnouncements || 0}
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1">Yetkazilgan xabarlar</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="v3-nishon mb-3">Bo{"'"}limlar va amallar</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="v3-panel-karta group flex items-start gap-4 p-5 hover:border-[var(--v3-urgu)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] group-hover:bg-[var(--v3-urgu)] group-hover:text-[var(--v3-urgu-matn)] transition-all shrink-0">
                <Ikon nom={action.ikon} olcham={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors flex items-center justify-between">
                  <span>{action.label}</span>
                  <Ikon nom="ong" olcham={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-[var(--v3-xira)] mt-1 line-clamp-2 leading-relaxed">
                  {action.tavsif}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="v3-panel-karta p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--v3-chiziq)]">
          <div className="font-bold text-sm text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="vaqt" olcham={16} />
            So{"'"}nggi faoliyat
          </div>
          <Link href="/ustoz/natijalar" className="text-xs text-[var(--v3-urgu)] hover:underline font-semibold">
            Barcha natijalarga o{"'"}tish →
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="divide-y divide-[var(--v3-chiziq)]">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-xira)] shrink-0">
                    <Ikon nom="quiz" olcham={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--v3-matn)] truncate">
                      {activity.title}
                    </div>
                    <div className="text-[11px] text-[var(--v3-xira)]">{activity.time}</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--v3-urgu-2)] shrink-0">
                  {activity.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-[var(--v3-xira)]">
            Hozircha yangi topshiriqlar yoki urinishlar mavjud emas
          </div>
        )}
      </div>
    </div>
  )
}
