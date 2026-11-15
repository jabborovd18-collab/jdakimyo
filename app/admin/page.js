// app/admin/page.js
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { huquqiBormi } from '@/lib/roles'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'
import { jadvalHolatiAniqlash, MS_REAL_URINISH_FILTR } from '@/lib/milliy-sertifikat-kohort'
import { qurAdminSertifikatFiltr } from '@/lib/sertifikat-tahlil'
import { TARIF } from '@/lib/sayt-malumot'
import { formatKompaktSon, msDashboardHolatInfo } from '@/lib/admin-yordamchi'
import Ikon from '@/components/Ikon'
import { AdminBadge, AdminPageHeader, AdminPanel } from '@/components/admin/AdminUI'

const RARITY_TARTIB = [
  { id: 'common', nom: 'Oddiy', bar: 'bg-slate-400', tone: 'neutral' },
  { id: 'rare', nom: 'Noyob', bar: 'bg-sky-400', tone: 'info' },
  { id: 'epic', nom: 'Epik', bar: 'bg-indigo-400', tone: 'accent' },
  { id: 'legendary', nom: 'Afsonaviy', bar: 'bg-amber-400', tone: 'primary' },
]

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const rol = session?.user?.role

  if (!huquqiBormi(rol, 'statistika')) {
    redirect('/admin/quizzes')
  }

  const sertifikatRuxsat = huquqiBormi(rol, 'sertifikatlar')
  const moderatsiyaRuxsat = huquqiBormi(rol, 'moderatsiya')
  const kontentRuxsat = huquqiBormi(rol, 'kontent')
  const kanallarRuxsat = huquqiBormi(rol, 'kanallar')
  const superadminmi = rol === 'superadmin'

  const { realUserFiltr: sertRealUserFiltr, msWhere, hamkorWhere } = qurAdminSertifikatFiltr()

  const bugunBoshi = new Date()
  bugunBoshi.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    todayActiveUsers,
    todayRegistrations,
    totalTeachers,
    totalQuizzes,
    todayQuizResults,
    totalMissions,
    activeMissions,
    totalAchievements,
    achievementsByRarity,
    totalAwardedAchievements,
    topUsers,
    msImtihonlar,
    msUrinishSanoq,
    totalCertificates,
    msCertificates,
    hamkorCertificates,
    pendingReports,
    pendingForum,
    pendingChatReports,
    activeQuotes,
    verifiedReactions,
    totalChannels,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActive: { gte: bugunBoshi } } }),
    prisma.user.count({ where: { createdAt: { gte: bugunBoshi } } }),
    prisma.user.count({ where: { OR: [{ role: 'teacher' }, { isTeacher: true }] } }),
    prisma.quizQuestion.count(),
    prisma.quizResult.count({ where: { completedAt: { gte: bugunBoshi } } }),
    prisma.mission.count(),
    prisma.mission.count({ where: { date: { gte: bugunBoshi } } }),
    prisma.achievementDefinition.count(),
    prisma.achievementDefinition.groupBy({ by: ['rarity'], _count: true }),
    prisma.achievement.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { totalPoints: 'desc' },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        avatar: true,
        totalPoints: true,
        level_points: true,
        currentStreak: true,
      },
    }),
    prisma.msImtihon.findMany({ orderBy: { startsAt: 'asc' } }).catch(() => []),
    prisma.msUrinish
      .groupBy({
        by: ['slug'],
        where: MS_REAL_URINISH_FILTR,
        _count: { _all: true },
      })
      .catch(() => []),
    prisma.certificate.count({ where: sertRealUserFiltr }).catch(() => 0),
    prisma.certificate.count({ where: msWhere }).catch(() => 0),
    prisma.certificate.count({ where: hamkorWhere }).catch(() => 0),
    moderatsiyaRuxsat
      ? prisma.report.count({ where: { status: 'pending' } }).catch(() => 0)
      : Promise.resolve(0),
    moderatsiyaRuxsat
      ? prisma.forumPost.count({ where: { status: 'pending' } }).catch(() => 0)
      : Promise.resolve(0),
    moderatsiyaRuxsat
      ? prisma.chatMessage.count({ where: { isReported: true, isDeleted: false } }).catch(() => 0)
      : Promise.resolve(0),
    kontentRuxsat
      ? prisma.dailyQuote.count({ where: { isActive: true } }).catch(() => 0)
      : Promise.resolve(0),
    kontentRuxsat
      ? prisma.reaction.count({ where: { isVerified: true } }).catch(() => 0)
      : Promise.resolve(0),
    kanallarRuxsat ? prisma.channel.count().catch(() => 0) : Promise.resolve(0),
  ])

  const msImtihonMap = new Map(msImtihonlar.map((i) => [i.slug, i]))
  const msSanoqMap = new Map(msUrinishSanoq.map((g) => [g.slug, g._count?._all ?? 0]))
  const msHolatlar = MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => {
    const dbImtihon = msImtihonMap.get(v.slug) || null
    const holatInfo = jadvalHolatiAniqlash(dbImtihon)
    return {
      slug: v.slug,
      nom: v.nom,
      qisqa: v.qisqa,
      imtihon: dbImtihon,
      holat: holatInfo.holat,
      ishtirokchilar: msSanoqMap.get(v.slug) ?? 0,
    }
  })

  const realMsIshtirokchilar = msHolatlar.reduce((s, m) => s + m.ishtirokchilar, 0)
  const ochiqMs = msHolatlar.filter((m) => m.holat === 'ochiq').length
  const kutilayotganMs = msHolatlar.filter((m) => m.holat === 'tekshirilmoqda').length
  const elonQilinganMs = msHolatlar.filter((m) => m.imtihon?.isAnnounced).length
  const qoldaCertificates = Math.max(0, totalCertificates - msCertificates - hamkorCertificates)

  const rarityStats = achievementsByRarity.reduce((acc, r) => {
    acc[r.rarity] = r._count
    return acc
  }, {})

  const faollikFoizi = totalUsers > 0 ? Math.round((todayActiveUsers / totalUsers) * 100) : 0

  const mainStats = [
    {
      title: 'Jami foydalanuvchilar',
      value: formatKompaktSon(totalUsers),
      sub: `${todayRegistrations} ta bugun qo'shildi`,
      ikon: 'odamlar',
      href: '/admin/users',
      rang: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
    },
    {
      title: 'Bugungi faol',
      value: formatKompaktSon(todayActiveUsers),
      sub: `${faollikFoizi}% kunlik faollik`,
      ikon: 'olov',
      href: '/admin/users',
      rang: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
    },
    {
      title: 'Ustozlar',
      value: formatKompaktSon(totalTeachers),
      sub: 'Ustoz paneliga ruxsatli',
      ikon: 'ustoz',
      href: '/admin/users?teacher=true',
      rang: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    },
    {
      title: 'Quiz savollari',
      value: formatKompaktSon(totalQuizzes),
      sub: `${todayQuizResults} ta bugun yechilgan`,
      ikon: 'quiz',
      href: '/admin/quizzes',
      rang: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    },
    {
      title: 'Kunlik missiyalar',
      value: formatKompaktSon(totalMissions),
      sub: `${activeMissions} ta bugungi faol`,
      ikon: 'olov',
      href: '/admin/missions',
      rang: 'bg-indigo-400/15 text-indigo-300 border-indigo-400/30',
    },
    {
      title: 'Yutuqlar',
      value: formatKompaktSon(totalAchievements),
      sub: `${totalAwardedAchievements} marta berilgan`,
      ikon: 'kubok',
      href: '/admin/achievements',
      rang: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    },
    ...(sertifikatRuxsat
      ? [
          {
            title: 'Milliy Sertifikat',
            value: formatKompaktSon(realMsIshtirokchilar),
            sub: `${ochiqMs} ochiq · ${kutilayotganMs} kutmoqda · ${elonQilinganMs} e'lon`,
            ikon: 'medal',
            href: '/admin/milliy-sertifikat',
            rang: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
          },
          {
            title: 'Sertifikatlar',
            value: formatKompaktSon(totalCertificates),
            sub: `${msCertificates} MS · ${hamkorCertificates} hamkor · ${qoldaCertificates} maxsus`,
            ikon: 'sertifikat',
            href: '/admin/certificates',
            rang: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
          },
        ]
      : []),
  ]

  const jamiKutayotgan = pendingReports + pendingForum + pendingChatReports

  const quickActions = [
    { name: 'Quiz savol', href: '/admin/quizzes', ikon: 'quiz' },
    { name: 'Kunlik iqtibos', href: '/admin/quotes', ikon: 'qalam' },
    { name: 'Reaksiyalar', href: '/admin/reactions', ikon: 'kolba' },
    { name: 'Missiya', href: '/admin/missions', ikon: 'olov' },
    { name: 'Yutuqlar', href: '/admin/achievements', ikon: 'kubok' },
    ...(sertifikatRuxsat
      ? [
          { name: 'Milliy Sertifikat', href: '/admin/milliy-sertifikat', ikon: 'medal' },
          { name: 'Sertifikatlar', href: '/admin/certificates', ikon: 'sertifikat' },
        ]
      : []),
    ...(superadminmi ? [{ name: 'Telegram bot', href: '/admin/telegram', ikon: 'bot' }] : []),
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Boshqaruv paneli"
        subtitle={`JDA KIMYO — ${TARIF}`}
        ikon="grafik"
        badge={<AdminBadge tone="success">LIVE · v4</AdminBadge>}
        actions={
          moderatsiyaRuxsat && jamiKutayotgan > 0 ? (
            <Link href="/admin/moderation" className="v3-tugma text-xs py-2 px-3">
              <Ikon nom="qalqon" olcham={15} />
              <span>Nazorat navbati: {jamiKutayotgan}</span>
            </Link>
          ) : null
        }
      />

      {/* Moderatsiya va kontent holati tezkor qatori */}
      {(moderatsiyaRuxsat || kontentRuxsat || kanallarRuxsat) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {moderatsiyaRuxsat && (
            <>
              <Link
                href="/admin/moderation"
                className="v3-panel-karta p-3.5 flex items-center justify-between gap-2 hover:border-[var(--v3-chiziq-2)] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--v3-xira)]">Kutilayotgan shikoyatlar</div>
                  <div className="text-lg font-bold text-[var(--v3-matn)]">{pendingReports} ta</div>
                </div>
                <AdminBadge tone={pendingReports > 0 ? 'warning' : 'success'}>
                  {pendingReports > 0 ? 'Tekshirish' : 'Toza'}
                </AdminBadge>
              </Link>

              <Link
                href="/admin/forum"
                className="v3-panel-karta p-3.5 flex items-center justify-between gap-2 hover:border-[var(--v3-chiziq-2)] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--v3-xira)]">Muhokama tasdig&apos;i</div>
                  <div className="text-lg font-bold text-[var(--v3-matn)]">{pendingForum} ta</div>
                </div>
                <AdminBadge tone={pendingForum > 0 ? 'warning' : 'success'}>
                  {pendingForum > 0 ? 'Navbatda' : 'Toza'}
                </AdminBadge>
              </Link>

              <Link
                href="/admin/chat"
                className="v3-panel-karta p-3.5 flex items-center justify-between gap-2 hover:border-[var(--v3-chiziq-2)] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--v3-xira)]">Chat shikoyatlari</div>
                  <div className="text-lg font-bold text-[var(--v3-matn)]">{pendingChatReports} ta</div>
                </div>
                <AdminBadge tone={pendingChatReports > 0 ? 'danger' : 'success'}>
                  {pendingChatReports > 0 ? 'Diqqat' : 'Tinch'}
                </AdminBadge>
              </Link>
            </>
          )}

          {(kontentRuxsat || kanallarRuxsat) && (
            <Link
              href={kontentRuxsat ? '/admin/quotes' : '/admin/kanallar'}
              className="v3-panel-karta p-3.5 flex items-center justify-between gap-2 hover:border-[var(--v3-chiziq-2)] transition-colors"
            >
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--v3-xira)]">
                  {kontentRuxsat ? 'Faol iqtibos · reaksiya' : 'Hamkor kanallar'}
                </div>
                <div className="text-lg font-bold text-[var(--v3-matn)] truncate">
                  {kontentRuxsat ? `${activeQuotes} / ${verifiedReactions}` : `${totalChannels} ta`}
                </div>
              </div>
              <Ikon nom={kontentRuxsat ? 'qalam' : 'kanal'} olcham={18} className="text-[var(--v3-urgu)] shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* Asosiy statistika */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="v3-panel-karta p-4 hover:border-[var(--v3-chiziq-2)] transition-all group block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.rang}`}>
                <Ikon nom={stat.ikon} olcham={19} />
              </div>
              <Ikon
                nom="ong"
                olcham={16}
                className="text-[var(--v3-xira)] group-hover:translate-x-0.5 group-hover:text-[var(--v3-urgu)] transition-all"
              />
            </div>
            <div className="text-2xl font-bold text-[var(--v3-matn)] mb-0.5">{stat.value}</div>
            <div className="text-sm font-semibold text-[var(--v3-matn)]">{stat.title}</div>
            <div className="text-xs text-[var(--v3-xira)] mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      {/* Milliy Sertifikat — Jonli holat */}
      {sertifikatRuxsat && (
        <AdminPanel className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="medal" olcham={18} className="text-[var(--v3-urgu)]" />
                Milliy Sertifikat (MS) — Jonli holat
              </h2>
              <p className="text-xs text-[var(--v3-xira)] mt-0.5">
                {msHolatlar.length} variant · {ochiqMs} ochiq · {kutilayotganMs} e&apos;lon kutmoqda ·{' '}
                {realMsIshtirokchilar} real qatnashchi
                {superadminmi ? ' (superadmin sinovlarisiz)' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/admin/certificates?manba=ms" className="v3-tugma text-xs py-1.5 px-3">
                <Ikon nom="sertifikat" olcham={14} />
                MS ({msCertificates})
              </Link>
              <Link href="/admin/certificates?manba=hamkor" className="v3-tugma text-xs py-1.5 px-3">
                <Ikon nom="hamkor" olcham={14} />
                Hamkorlik ({hamkorCertificates})
              </Link>
              <Link href="/admin/milliy-sertifikat" className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3">
                <span>Batafsil hisobot</span>
                <Ikon nom="ong" olcham={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {msHolatlar.map((m) => {
              const badge = msDashboardHolatInfo(m.holat)
              const kalibr = m.imtihon?.kalibrlashUsuli
              return (
                <Link
                  key={m.slug}
                  href={`/admin/milliy-sertifikat?slug=${encodeURIComponent(m.slug)}`}
                  className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:bg-[var(--v3-yuza-2)] hover:border-[var(--v3-chiziq-2)] p-3.5 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[var(--v3-urgu)] truncate">
                      {m.qisqa || m.slug}
                    </span>
                    <AdminBadge tone={badge.tone}>{badge.matn}</AdminBadge>
                  </div>
                  <div className="font-bold text-sm text-[var(--v3-matn)] truncate">{m.nom}</div>
                  <div className="flex items-center justify-between text-xs text-[var(--v3-xira)] pt-1.5 border-t border-[var(--v3-chiziq)]">
                    <span>{m.ishtirokchilar} nafar</span>
                    <span>
                      {m.imtihon?.isAnnounced
                        ? "E'lon qilingan"
                        : kalibr
                          ? kalibr
                          : 'Kalibrlanmagan'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </AdminPanel>
      )}

      {/* Yutuqlar + Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminPanel className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kubok" olcham={18} className="text-[var(--v3-urgu)]" />
              Yutuqlar taqsimoti
            </h2>
            <Link href="/admin/achievements" className="text-xs text-[var(--v3-urgu)] hover:underline">
              Barchasi
            </Link>
          </div>
          <div className="space-y-3">
            {RARITY_TARTIB.map((rarity) => {
              const son = rarityStats[rarity.id] || 0
              const foiz = totalAchievements > 0 ? Math.round((son / totalAchievements) * 100) : 0
              return (
                <div key={rarity.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <AdminBadge tone={rarity.tone}>{rarity.nom}</AdminBadge>
                    <span className="text-[var(--v3-matn)] font-semibold">{son} ta</span>
                  </div>
                  <div className="w-full bg-[var(--v3-yuza-2)] rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${rarity.bar} rounded-full`} style={{ width: `${foiz}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="pt-3 border-t border-[var(--v3-chiziq)] flex items-center justify-between text-xs">
            <span className="text-[var(--v3-xira)]">Jami berilgan:</span>
            <span className="font-bold text-[var(--v3-urgu)]">{totalAwardedAchievements} marta</span>
          </div>
        </AdminPanel>

        <AdminPanel className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="orin" olcham={18} className="text-[var(--v3-urgu)]" />
              Top 5 Foydalanuvchi
            </h2>
            <Link href="/admin/leaderboard" className="text-xs text-[var(--v3-urgu)] hover:underline">
              Reyting sahifasi
            </Link>
          </div>

          <div className="space-y-2">
            {topUsers.map((user, idx) => (
              <Link
                key={user.id}
                href={`/profil/${user.userId}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:bg-[var(--v3-yuza-2)] transition-all group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                      : 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-matn)] shrink-0 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--v3-matn)] truncate group-hover:text-[var(--v3-urgu)] transition-colors">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-xs text-[var(--v3-xira)]">
                    @{user.username} · {user.currentStreak} kun streak · Lvl {user.level_points}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--v3-urgu)]">
                    {user.totalPoints.toLocaleString('uz-UZ')}
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)]">XP</div>
                </div>
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>

      {/* Tezkor o'tishlar */}
      <AdminPanel className="space-y-3">
        <h2 className="text-base font-bold text-[var(--v3-matn)] flex items-center gap-2">
          <Ikon nom="uchqun" olcham={18} className="text-[var(--v3-urgu)]" />
          Tezkor bo&apos;limlar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:bg-[var(--v3-yuza-2)] hover:border-[var(--v3-chiziq-2)] p-3.5 text-center transition-all flex flex-col items-center gap-2"
            >
              <Ikon nom={action.ikon} olcham={20} className="text-[var(--v3-urgu)]" />
              <span className="text-xs font-semibold text-[var(--v3-matn)]">{action.name}</span>
            </Link>
          ))}
        </div>
      </AdminPanel>

      {/* Tizim holati */}
      <AdminPanel className="flex items-center justify-between flex-wrap gap-3 text-xs text-[var(--v3-xira)]">
        <div className="flex items-center gap-2.5">
          <AdminBadge tone="success">Tizim faol</AdminBadge>
          <span className="font-medium text-[var(--v3-matn)]">JDA KIMYO Admin v4</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span>Neon PostgreSQL</span>
          <span>Next.js 16</span>
          <span>Prisma 5</span>
          <span className="text-[var(--v3-urgu)] font-mono">Safir</span>
        </div>
      </AdminPanel>
    </div>
  )
}
