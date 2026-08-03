// app/profil/[userId]/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'

// Ochiq profilda ko'rsatiladigan havolalar. `to'liq` — qiymat allaqachon
// to'liq manzil bo'lsa (website, orcid), aks holda oldiga sayt qo'shiladi.
const HAVOLALAR = [
  { kalit: 'telegram', nom: 'Telegram', icon: '✈️', oldi: 'https://t.me/' },
  { kalit: 'instagram', nom: 'Instagram', icon: '📷', oldi: 'https://instagram.com/' },
  { kalit: 'twitter', nom: 'X', icon: '𝕏', oldi: 'https://x.com/' },
  { kalit: 'github', nom: 'GitHub', icon: '💻', oldi: 'https://github.com/' },
  { kalit: 'linkedin', nom: 'LinkedIn', icon: '💼', oldi: 'https://linkedin.com/in/' },
  { kalit: 'googleScholar', nom: 'Scholar', icon: '🎓', toliq: true },
  { kalit: 'orcid', nom: 'ORCID', icon: '🆔', oldi: 'https://orcid.org/' },
  { kalit: 'website', nom: 'Sayt', icon: '🌐', toliq: true },
]

function IjtimoiyHavolalar({ user }) {
  const bor = HAVOLALAR.filter((h) => user[h.kalit])
  if (bor.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {bor.map((h) => {
        const qiymat = String(user[h.kalit]).trim()
        // Foydalanuvchi ba'zan to'liq manzil, ba'zan faqat nikni yozadi —
        // ikkalasi ham ishlashi kerak
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-lg text-xs text-purple-200 hover:text-white transition-all"
          >
            <span>{h.icon}</span>
            <span>{h.nom}</span>
          </a>
        )
      })}
    </div>
  )
}

function Stat({ icon, qiymat, nom, rang }) {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-4 backdrop-blur-sm text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-bold mb-0.5 ${rang}`}>{qiymat}</div>
      <div className="text-[11px] text-purple-300">{nom}</div>
    </div>
  )
}

export default function PublicProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [friendshipStatus, setFriendshipStatus] = useState('none')
  const [followStatus, setFollowStatus] = useState('none')
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [chatOchilmoqda, setChatOchilmoqda] = useState(false)

  // Suhbatni ochish: server do'stlikni tekshiradi va suhbatni "faol"
  // yoki "sorov" holatida yaratadi
  const chatniOch = async () => {
    setChatOchilmoqda(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: params.userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.holat === 'sorov') {
        toast('Do\'st emassiz — xabaringiz so\'rov bo\'lib tushadi', { icon: '📨' })
      }
      router.push(`/profil/chat?suhbat=${data.suhbatId}`)
    } catch (e) {
      toast.error(e.message)
      setChatOchilmoqda(false)
    }
  }

  useEffect(() => {
    if (params?.userId) {
      fetchProfile()
    }
  }, [params?.userId])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('[Frontend] Fetching profile for userId:', params.userId)
      const response = await fetch(`/api/users/${params.userId}`)
      const data = await response.json()
      console.log('[Frontend] API Response:', { ok: response.ok, data })

      if (!response.ok) {
        throw new Error(data.error || 'Foydalanuvchi topilmadi')
      }

      setProfile(data)
      setFriendshipStatus(data.friendshipStatus || 'none')
      setFollowStatus(data.followStatus || 'none')
    } catch (error) {
      console.error('[Frontend] Error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 🆕 Obuna bo'lish (Follow)
  const handleFollow = async () => {
    if (!session) {
      toast.error('Avval tizimga kiring')
      router.push('/login')
      return
    }

    setIsFollowLoading(true)
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: profile.user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success('✓ Obuna bo\'ldingiz!')
      setFollowStatus('following')
      // Profilni yangilash (sonlar o'zgarishi uchun)
      fetchProfile()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsFollowLoading(false)
    }
  }

  // 🆕 Obunani bekor qilish (Unfollow)
  const handleUnfollow = async () => {
    if (!confirm('Obunani bekor qilmoqchimisiz?')) return

    setIsFollowLoading(true)
    try {
      const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: profile.user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success('Obuna bekor qilindi')
      setFollowStatus('not_following')
      fetchProfile()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsFollowLoading(false)
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
      if (!response.ok) {
        throw new Error(data.error)
      }
      toast.success("Do'stlik taklifi yuborildi!")
      setFriendshipStatus('sent')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleFriendRequest = async (action) => {
    try {
      const response = await fetch(`/api/friends/request/${profile.requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error)
      }
      toast.success(data.message)
      fetchProfile()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl mb-4 animate-pulse">
            ⏳
          </div>
          <div className="text-purple-300 text-lg">Profil yuklanmoqda...</div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Profil ochilmadi</h2>
          <p className="text-purple-300 text-sm mb-6 break-words">{error || "Noma'lum xatolik"}</p>

          {/* Qayta urinish tugmasi shart: xato ko'pincha profil yo'qligidan
              emas, baza javob bermaganidan bo'ladi. Avval yagona yo'l orqaga
              qaytish edi — foydalanuvchi profil o'chirilgan deb o'ylardi. */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={fetchProfile}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
            >
              🔄 Qayta urinish
            </button>
            <Link
              href="/profil"
              className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl font-semibold"
            >
              ← Profilga qaytish
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const {
    user, friends, achievements, quizResults, certificates, postlar,
    followersCount, followingCount, korinadi = {},
  } = profile
  const roleLabels = {
    bakalavr: '🎓 Bakalavr',
    magistr: '📚 Magistr',
    doktorant: '🔬 Doktorant',
    professor: '👨‍🏫 Professor',
    mustaqil: '🧑‍🎓 Mustaqil'
  }

  // O'z profili - redirect
  if (session?.user?.userId === user.userId) {
    router.push('/profil')
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2"
          >
            <span>←</span>
            <span>Orqaga</span>
          </button>
          <div className="h-6 w-px bg-purple-800"></div>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JDA KIMYO
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl font-bold text-black shadow-2xl shadow-yellow-500/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user.fullName?.charAt(0)?.toUpperCase() || user.username.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{user.fullName || user.username}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-800/50 border border-purple-700/50 rounded-full text-sm text-purple-200">
                  @{user.username}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-full text-sm text-yellow-300 font-bold">
                  🆔 {user.userId}
                </span>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-sm">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
              {user.university && (
                <div className="text-purple-200 text-sm mb-2 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>{user.university}</span>
                  {user.faculty && <span className="text-purple-400">• {user.faculty}</span>}
                </div>
              )}
              {user.location && (
                <div className="text-purple-300 text-sm mb-2 flex items-center gap-2">
                  <span>📍</span>
                  <span>{user.location}</span>
                </div>
              )}
              {user.bio && (
                <p className="text-purple-200 mt-3 leading-relaxed max-w-2xl italic">
                  &ldquo;{user.bio}&rdquo;
                </p>
              )}

              {/* Havolalar sozlamalarda to'ldirilardi-yu, hech qayerda
                  ko'rinmasdi — kiritishning ma'nosi yo'q edi */}
              <IjtimoiyHavolalar user={user} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Do'stlar to'g'ridan-to'g'ri yozadi, boshqalarniki so'rov
                  bo'lib tushadi — buni bosishdan oldin aytib qo'yamiz */}
              {session && (
                <button
                  onClick={chatniOch}
                  disabled={chatOchilmoqda}
                  className="px-6 py-3 bg-purple-700/60 hover:bg-purple-600/70 border border-purple-500/50 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>💬</span>
                  <span>{chatOchilmoqda ? 'Ochilmoqda...' : 'Xabar yozish'}</span>
                </button>
              )}

              {/* 🆕 FOLLOW TUGMASI */}
              {session && (
                <>
                  {followStatus === 'not_following' && (
                    <button
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isFollowLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>➕</span>
                      )}
                      <span>Obuna bo'lish</span>
                    </button>
                  )}
                  {followStatus === 'following' && (
                    <button
                      onClick={handleUnfollow}
                      disabled={isFollowLoading}
                      className="px-6 py-3 bg-blue-600/20 border border-blue-600/30 hover:bg-red-600/20 hover:border-red-600/30 text-blue-400 hover:text-red-400 font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isFollowLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>✓</span>
                      )}
                      <span>Obuna</span>
                    </button>
                  )}
                </>
              )}

              {/* FRIENDSHIP TUGMALARI */}
              {friendshipStatus === 'none' && session && (
                <button
                  onClick={sendFriendRequest}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Do'stlik taklif qilish</span>
                </button>
              )}
              {friendshipStatus === 'sent' && (
                <div className="px-6 py-3 bg-yellow-600/20 border border-yellow-600/30 rounded-xl text-yellow-400 font-semibold flex items-center gap-2">
                  <span>⏳</span>
                  <span>Taklif yuborildi</span>
                </div>
              )}
              {friendshipStatus === 'received' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFriendRequest('accept')}
                    className="px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>Qabul</span>
                  </button>
                  <button
                    onClick={() => handleFriendRequest('reject')}
                    className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>✗</span>
                    <span>Rad</span>
                  </button>
                </div>
              )}
              {friendshipStatus === 'friend' && (
                <div className="px-6 py-3 bg-green-600/20 border border-green-600/30 rounded-xl text-green-400 font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Do'stlar</span>
                </div>
              )}
              {!session && (
                <Link
                  href="/login"
                  className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold text-center"
                >
                  Obuna bo'lish uchun kiring
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <Stat icon="🎯" qiymat={`Lvl ${user.level_points}`} nom="Daraja" rang="text-yellow-400" />
          <Stat icon="⭐" qiymat={user.totalPoints} nom="Umumiy ball" rang="text-yellow-400" />
          <Stat icon="🌟" qiymat={user.stars ?? 0} nom="Yulduz" rang="text-yellow-300" />
          <Stat icon="🔥" qiymat={user.currentStreak ?? 0} nom="Kunlik seriya" rang="text-orange-400" />
          <Stat
            icon="👥"
            qiymat={korinadi.dostlar === false ? '—' : friends.length}
            nom="Do'stlar"
            rang="text-yellow-400"
          />
          <Stat
            icon="👤"
            qiymat={followersCount ?? '—'}
            nom="Obunachilar"
            rang="text-cyan-400"
          />
          <Stat
            icon="👁️"
            qiymat={followingCount ?? '—'}
            nom="Obuna bo'lgan"
            rang="text-cyan-400"
          />
        </div>

        {/* A'zolik sanasi */}
        {user.createdAt && (
          <div className="text-center text-xs text-purple-500 mb-6">
            JDA KIMYO a'zosi · {sana(user.createdAt)} dan beri
            {user.longestStreak > 0 && ` · eng uzun seriyasi ${user.longestStreak} kun`}
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🏅</span>
              Yutuqlar ({achievements.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm text-white mb-1">{achievement.name}</div>
                  <div className="text-xs text-purple-400">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profil postlari — obuna bo'lganlar aynan shuni ko'radi */}
        {postlar?.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>✍️</span>
              Postlar
            </h2>
            <div className="space-y-3">
              {postlar.map(post => (
                <div key={post.id} className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                  <p className="text-sm text-purple-100 whitespace-pre-line leading-relaxed">
                    {post.matn}
                  </p>
                  <div className="text-[11px] text-purple-500 mt-2">{sana(post.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maxfiylik tufayli yopilgan bo'limlar. Ularni jimgina yashirish
            chalg'ituvchi bo'lardi: profil bo'sh ko'rinardi, holbuki egasi
            shunday tanlagan. */}
        {(() => {
          const yopiq = [
            korinadi.postlar === false && 'postlar',
            korinadi.dostlar === false && "do'stlar ro'yxati",
            korinadi.quiz === false && 'quiz natijalari',
            korinadi.yutuqlar === false && 'yutuqlar',
            korinadi.sertifikatlar === false && 'sertifikatlar',
            korinadi.obunachilar === false && 'obunachilar',
          ].filter(Boolean)

          if (yopiq.length === 0) return null

          return (
            <div className="bg-slate-900/40 border border-purple-800/50 rounded-2xl p-4 mb-6 text-center">
              <span className="text-sm text-purple-400">
                🔒 Bu foydalanuvchi {yopiq.join(', ')} bo'limini yopgan
              </span>
            </div>
          )
        })()}

        {/* Sertifikatlar — admin bergan, QR bilan tekshiriladigan hujjatlar */}
        {certificates?.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📜</span>
              Sertifikatlar ({certificates.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certificates.slice(0, 6).map(sert => (
                <Link
                  key={sert.id}
                  href={`/sertifikat/verify/${sert.certId}`}
                  className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏅</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-white">{sert.fan}</div>
                      <div className="text-xs text-purple-400 mt-0.5">{sert.reason}</div>
                      <div className="text-[10px] text-purple-500 mt-1 font-mono">
                        {sert.certId} · {sana(sert.issuedAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quiz natijalari — maxfiylik sozlamasi ruxsat bergan bo'lsa keladi.
            Avval ular API dan olinardi-yu, sahifada umuman chizilmasdi. */}
        {quizResults?.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📝</span>
              Oxirgi quiz natijalari
            </h2>
            <div className="space-y-2">
              {quizResults.slice(0, 5).map(natija => (
                <div
                  key={natija.id}
                  className="bg-purple-950/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3 border border-purple-700/30"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{natija.quizName}</div>
                    <div className="text-[11px] text-purple-400">{sana(natija.completedAt)}</div>
                  </div>
                  <div
                    className={`text-xl font-bold flex-shrink-0 ${
                      natija.percentage >= 80
                        ? 'text-green-400'
                        : natija.percentage >= 60
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {natija.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends */}
        {friends.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👥</span>
              Do'stlar ({friends.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {friends.map(friend => (
                <Link
                  key={friend.id}
                  href={`/profil/${friend.userId}`}
                  className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30 hover:border-yellow-500/50 transition-all"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold mb-2">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.fullName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      friend.fullName?.charAt(0)?.toUpperCase() || friend.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="font-semibold text-sm">{friend.fullName || friend.username}</div>
                  <div className="text-xs text-purple-400">@{friend.username}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}