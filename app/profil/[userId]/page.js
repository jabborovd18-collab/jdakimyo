"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'
import SertifikatKarta from '@/components/SertifikatKarta'

const HAVOLALAR = [
  { kalit: 'telegram', nom: 'Telegram', ikon: 'telegram', oldi: 'https://t.me/' },
  { kalit: 'instagram', nom: 'Instagram', ikon: 'kanal', oldi: 'https://instagram.com/' },
  { kalit: 'twitter', nom: 'X', ikon: 'chat', oldi: 'https://x.com/' },
  { kalit: 'github', nom: 'GitHub', ikon: 'kitob', oldi: 'https://github.com/' },
  { kalit: 'linkedin', nom: 'LinkedIn', ikon: 'odam', oldi: 'https://linkedin.com/in/' },
  { kalit: 'googleScholar', nom: 'Scholar', ikon: 'kitob', toliq: true },
  { kalit: 'orcid', nom: 'ORCID', ikon: 'atom', oldi: 'https://orcid.org/' },
  { kalit: 'website', nom: 'Sayt', ikon: 'doska', toliq: true },
]

function IjtimoiyHavolalar({ user }) {
  const bor = HAVOLALAR.filter((h) => user[h.kalit])
  if (bor.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {bor.map((h) => {
        const qiymat = String(user[h.kalit]).trim()
        const manzil = /^https?:\/\//i.test(qiymat)
          ? qiymat
          : h.toliq
            ? `https://${qiymat}`
            : h.oldi + qiymat.replace(/^@/, '')

        return (
          <a
            key={h.kalit}
            href={manzil}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="v3-tugma text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
          >
            <Ikon nom={h.ikon} olcham={13} />
            <span>{h.nom}</span>
          </a>
        )
      })}
    </div>
  )
}

export default function FoydalanuvchiProfiliPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [fon, fonTanla] = useFon()

  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [followStatus, setFollowStatus] = useState('not_following')
  const [friendshipStatus, setFriendshipStatus] = useState('not_friends')
  const [activeTab, setActiveTab] = useState('haqida')

  useEffect(() => {
    if (params?.userId) fetchProfile()
  }, [params?.userId])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/users/${params.userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Profilni yuklab bo\'lmadi')
      }

      setProfile(data)
      setFollowStatus(data.isFollowing ? 'following' : 'not_following')
      setFriendshipStatus(data.friendshipStatus || 'not_friends')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!session) {
      toast.error('Avval tizimga kiring')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: profile.user.id })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Obuna bo\'lindi')
      setFollowStatus('following')
      fetchProfile()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUnfollow = async () => {
    if (!confirm('Obunani bekor qilmoqchimisiz?')) return

    try {
      const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: profile.user.id })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Obuna bekor qilindi')
      setFollowStatus('not_following')
      fetchProfile()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const sendFriendRequest = async () => {
    if (!session) {
      toast.error('Avval tizimga kiring')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: profile.user.id })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success("Do'stlik taklifi yuborildi!")
      setFriendshipStatus('sent')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (isLoading) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Foydalanuvchi profili yuklanmoqda...</span>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="odam" olcham={24} />
          </div>
          <h2 className="font-bold text-base text-[var(--v3-matn)]">Profil ochilmadi</h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{error || "Foydalanuvchi topilmadi"}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={fetchProfile} className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold">
              Qayta urinish
            </button>
            <Link href="/" className="v3-tugma text-xs py-2 px-4">
              Bosh sahifa
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const {
    user, friends = [], achievements = [], quizResults = [], certificates = [],
    followersCount = 0, followingCount = 0,
  } = profile

  const ism = user.fullName || user.username
  const boshHarf = ism[0].toUpperCase()

  // O'z profili bo'lsa shaxsiy kabinetga yo'naltirish
  if (session?.user?.userId === user.userId) {
    router.push('/profil')
    return null
  }

  return (
    <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="v3-ikon-tugma" aria-label="Orqaga">
              <Ikon nom="chap" olcham={18} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <FonTanlagich fon={fon} tanla={fonTanla} />
            {session && (
              <Link
                href={`/chat`}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold inline-flex items-center gap-1.5"
              >
                <Ikon nom="xabar" olcham={14} />
                <span>Yozish</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Profile Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* User Card */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[var(--v3-yuza-2)] border-2 border-[var(--v3-urgu)] grid place-items-center text-3xl sm:text-4xl font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0 shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                boshHarf
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
                  {ism}
                </h1>
                <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="katta" />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="v3-tag v3-tag-ochiq text-[11px]">
                  @{user.username}
                </span>
                <span className="v3-tag v3-tag-yopiq text-[11px] font-mono font-bold">
                  ID: {user.userId}
                </span>
                <span className="v3-tag text-[11px] bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)]">
                  {user.role}
                </span>
                {user.isTeacher && (
                  <Link
                    href={`/ustoz-profil/${user.userId || user.id}`}
                    className="v3-tag v3-tag-ochiq text-[11px] font-bold hover:scale-105 transition-transform"
                  >
                    👨‍🏫 Ustoz profili →
                  </Link>
                )}
              </div>

              {user.university && (
                <p className="text-xs text-[var(--v3-xira)]">
                  🏛️ {user.university} {user.faculty ? `• ${user.faculty}` : ''}
                </p>
              )}

              {user.bio && (
                <p className="text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed pt-1">
                  {user.bio}
                </p>
              )}

              <IjtimoiyHavolalar user={user} />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-4">
                {followStatus === 'following' ? (
                  <button onClick={handleUnfollow} className="v3-tugma text-xs py-2 px-4">
                    Obunani bekor qilish
                  </button>
                ) : (
                  <button onClick={handleFollow} className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold">
                    + Obuna bo{"'"}lish
                  </button>
                )}

                {friendshipStatus === 'not_friends' && (
                  <button onClick={sendFriendRequest} className="v3-tugma text-xs py-2 px-4">
                    👥 Do{"'"}stlik taklifi
                  </button>
                )}
                {friendshipStatus === 'sent' && (
                  <span className="v3-tag v3-tag-yopiq py-1.5 px-3">
                    Taklif yuborilgan
                  </span>
                )}
                {friendshipStatus === 'friends' && (
                  <span className="v3-tag v3-tag-ochiq py-1.5 px-3">
                    ✓ Do{"'"}stsiz
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="v3-panel-karta p-4 text-center">
            <div className="text-xl font-bold font-mono text-[var(--v3-matn)]">{totalPoints || 0}</div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-0.5">Umumiy ball</div>
          </div>
          <div className="v3-panel-karta p-4 text-center">
            <div className="text-xl font-bold font-mono text-yellow-400">{user.stars || 0} ⭐</div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-0.5">Yulduzlar</div>
          </div>
          <div className="v3-panel-karta p-4 text-center">
            <div className="text-xl font-bold font-mono text-[var(--v3-matn)]">{followersCount}</div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-0.5">Obunachilar</div>
          </div>
          <div className="v3-panel-karta p-4 text-center">
            <div className="text-xl font-bold font-mono text-[var(--v3-matn)]">{followingCount}</div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-0.5">Obunalar</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[var(--v3-chiziq)] pb-2 overflow-x-auto">
          {[
            { id: 'haqida', nom: 'Yutuqlar', son: achievements.length },
            { id: 'quizlar', nom: 'Quizlar', son: quizResults.length },
            { id: 'sertifikatlar', nom: 'Sertifikatlar', son: certificates.length },
            { id: 'dostlar', nom: 'Do\'stlar', son: friends.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                  : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
              }`}
            >
              {tab.nom} ({tab.son})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'haqida' && (
          <div className="space-y-4">
            {achievements.length === 0 ? (
              <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
                Hozircha ochiq yutuqlar yo{"'"}q
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="v3-panel-karta p-4 space-y-1">
                    <div className="font-bold text-xs text-[var(--v3-matn)]">{ach.name}</div>
                    {ach.description && <p className="text-xs text-[var(--v3-xira)]">{ach.description}</p>}
                    <div className="text-[10px] text-[var(--v3-urgu)] font-mono">{ach.rarity || 'Yutuq'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizlar' && (
          <div className="space-y-3">
            {quizResults.length === 0 ? (
              <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
                Hali quiz natijalari yo{"'"}q
              </div>
            ) : (
              quizResults.map((q) => (
                <div key={q.id} className="v3-panel-karta p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-[var(--v3-matn)]">{q.quizName}</div>
                    <div className="text-[10.5px] text-[var(--v3-xira)] font-mono mt-0.5">{sana(q.completedAt)}</div>
                  </div>
                  <span className="font-mono font-bold text-sm text-[var(--v3-urgu)]">
                    {q.percentage}%
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sertifikatlar' && (
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
                Sertifikatlar mavjud emas
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <SertifikatKarta key={cert.id} sertifikat={cert} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dostlar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((f) => (
              <Link
                key={f.id}
                href={`/profil/${f.userId || f.id}`}
                className="v3-panel-karta p-3.5 flex items-center gap-3 hover:border-[var(--v3-chiziq-2)] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                  {f.avatar ? (
                    <img src={f.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (f.fullName?.[0] || f.username?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors truncate">
                    {f.fullName || f.username}
                  </div>
                  <div className="text-[10px] text-[var(--v3-xira)] font-mono truncate">@{f.username}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
