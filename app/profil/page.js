// app/profil/page.js
"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import FriendSearch from '@/components/FriendSearch'
import FriendRequests from '@/components/FriendRequests'

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({})
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const dismissed = localStorage.getItem("mobileWarningDismissed")
    if (isMobile && !dismissed) setShowMobileWarning(true)
  }, [])

  const dismissMobileWarning = () => {
    localStorage.setItem("mobileWarningDismissed", "true")
    setShowMobileWarning(false)
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profil')
      const data = await response.json()
      
      console.log('[Profile API Response]:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Profilni yuklashda xatolik')
      }

      if (!data.user) {
        throw new Error('Profil ma\'lumotlari to\'liq emas')
      }

      setProfile(data)
      setFormData(data.user)
    } catch (error) {
      console.error('[Profile Fetch Error]:', error)
      toast.error('Profilni yuklashda xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Xatolik')

      toast.success('✓ Profil muvaffaqiyatli yangilandi!')
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      toast.error('Saqlashda xatolik: ' + error.message)
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

  // Xavfsiz tekshiruv
  if (!profile || !profile.user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Profil yuklanmadi</h2>
          <p className="text-purple-300 mb-6">Profil ma'lumotlarini olishda xatolik yuz berdi</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            🔄 Qayta yuklash
          </button>
        </div>
      </main>
    )
  }

  const { user, friends = [], friendRequests = [], quizResults = [], certificates = [], achievements = [] } = profile

  // Default qiymatlar
  const levelPoints = user.level_points || 1
  const experience = user.experience || 0
  const totalPoints = user.totalPoints || 0
  const currentStreak = user.currentStreak || 0
  const longestStreak = user.longestStreak || 0
  const nextLevelXP = levelPoints * 500
  const xpProgress = Math.min((experience / nextLevelXP) * 100, 100)

  const roleLabels = {
    bakalavr: '🎓 Bakalavr',
    magistr: '📚 Magistr',
    doktorant: '🔬 Doktorant',
    professor: '👨‍🏫 Professor',
    mustaqil: '🧑‍🎓 Mustaqil'
  }

  const levelTitles = {
    1: 'Boshlovchi',
    2: 'O\'rganuvchi',
    3: 'Kimyogar',
    4: 'Tadqiqotchi',
    5: 'Mutaxassis',
    6: 'Ekspert',
    7: 'Olim',
    8: 'Professor',
    9: 'Akademik',
    10: 'Afsona'
  }

  const rarityColors = {
    common: 'from-slate-500 to-slate-600',
    rare: 'from-blue-500 to-cyan-500',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-yellow-500 to-orange-500'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* MOBILE OGOHLANTIRISH */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-yellow-950/95 to-orange-950/95 border-2 border-yellow-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">📱</div>
              <div>
                <h3 className="text-lg font-bold text-yellow-300">Mobile qurilma</h3>
                <p className="text-xs text-yellow-100/70">Muhim ma'lumot</p>
              </div>
            </div>
            <p className="text-yellow-100 text-sm leading-relaxed mb-4">
              Bu sayt <strong className="text-yellow-300">kompyuterlar uchun</strong> moslashgan.
              Mobil qurilmada ba'zi funksiyalar cheklangan bo'lishi mumkin.
            </p>
            <button
              onClick={dismissMobileWarning}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              Tushundim, davom etish
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JDA KIMYO
          </Link>
          <div className="h-6 w-px bg-purple-800 hidden md:block"></div>
          <span className="text-purple-300 text-sm hidden md:inline">Shaxsiy kabinet</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm transition-all hidden md:inline-flex items-center gap-2">
            <span>🏠</span>
            <span>Bosh sahifa</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-xl text-sm text-red-400 hover:text-red-300 transition-all flex items-center gap-2"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION - PROFIL HEADER */}
      <section className="relative px-4 py-8 md:py-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            
            {/* Edit tugmasi */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20 text-sm z-20"
            >
              {isEditing ? '✖ Bekor qilish' : '✏️ Tahrirlash'}
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl font-bold text-black shadow-2xl shadow-yellow-500/30">
                  {user.fullName?.charAt(0)?.toUpperCase() || user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold shadow-lg border-4 border-purple-900">
                  {levelPoints}
                </div>
              </div>

              {/* Ma'lumotlar */}
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
                  <div className="text-purple-200 text-sm mb-2 flex items-center gap-2 flex-wrap">
                    <span>🏛️</span>
                    <span>{user.university}</span>
                    {user.faculty && <span className="text-purple-400">• {user.faculty}</span>}
                  </div>
                )}

                {user.bio && (
                  <p className="text-purple-200 mt-3 leading-relaxed max-w-2xl italic">
                    &ldquo;{user.bio}&rdquo;
                  </p>
                )}

                {/* Ijtimoiy tarmoqlar */}
                {(user.telegram || user.instagram || user.linkedin) && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {user.telegram && (
                      <a href={`https://t.me/${user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 flex items-center justify-center transition-all">
                        ✈️
                      </a>
                    )}
                    {user.instagram && (
                      <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 border border-pink-600/30 flex items-center justify-center transition-all">
                        📸
                      </a>
                    )}
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-blue-800/20 hover:bg-blue-800/30 border border-blue-800/30 flex items-center justify-center transition-all">
                        💼
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 pt-6 border-t border-purple-700/30">
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-yellow-400 font-bold">Level {levelPoints}</span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                    {levelTitles[levelPoints] || 'Kimyogar'}
                  </span>
                </div>
                <span className="text-xs text-purple-300">
                  {experience} / {nextLevelXP} XP
                </span>
              </div>
              <div className="w-full h-3 bg-purple-950/70 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDIT MODE */}
      {isEditing && (
        <section className="px-4 pb-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                ✏️
              </div>
              <div>
                <h2 className="text-xl font-bold">Profilni tahrirlash</h2>
                <p className="text-sm text-purple-300">Ma'lumotlaringizni yangilang</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Ism-familiya</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Universitet</label>
                <input
                  type="text"
                  value={formData.university || ''}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Fakultet</label>
                <input
                  type="text"
                  value={formData.faculty || ''}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Mutaxassislik</label>
                <input
                  type="text"
                  value={formData.specialty || ''}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Kurs</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.level || ''}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Joylashuv</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                  placeholder="Samarqand, O'zbekiston"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Telegram</label>
                <input
                  type="text"
                  value={formData.telegram || ''}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                  placeholder="@username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-purple-300 mb-1 block">Bio (o'zingiz haqida)</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                  rows="3"
                  placeholder="Kimyo sohasidagi qiziqishlaringiz haqida yozing..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
              >
                <span>✓</span>
                <span>Saqlash</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData(user)
                }}
                className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl transition-all"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STATS GRID */}
      <section className="px-4 pb-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">Lvl {levelPoints}</div>
              <div className="text-xs text-purple-300">Daraja</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{totalPoints}</div>
              <div className="text-xs text-purple-300">Umumiy ball</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{quizResults.length}</div>
              <div className="text-xs text-purple-300">Quizlar</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{certificates.length}</div>
              <div className="text-xs text-purple-300">Sertifikatlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* STREAK */}
      <section className="px-4 pb-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border border-orange-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl animate-bounce" style={{animationDuration: '2s'}}>🔥</div>
              <div>
                <div className="text-sm text-orange-300 mb-1">Hozirgi seriya</div>
                <div className="text-4xl font-bold text-white">{currentStreak} <span className="text-lg text-orange-300">kun</span></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-orange-300 mb-1">Eng uzun</div>
                <div className="text-2xl font-bold text-orange-400">{longestStreak}</div>
              </div>
              <div className="w-px bg-orange-600/30"></div>
              <div className="text-center">
                <div className="text-xs text-orange-300 mb-1">Jami kunlar</div>
                <div className="text-2xl font-bold text-orange-400">
                  {user.createdAt ? Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <section className="px-4 pb-6 max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Umumiy ko\'rinish', count: null },
            { id: 'achievements', label: '🏅 Yutuqlar', count: achievements.length },
            { id: 'friends', label: '👥 Do\'stlar', count: friends.length },
            { id: 'quizzes', label: '📝 Quizlar', count: quizResults.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-purple-900/40 border border-purple-700/50 text-purple-300 hover:border-yellow-500/50'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-black/20' : 'bg-purple-800/50'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="px-4 pb-12 max-w-6xl mx-auto">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <FriendRequests requests={friendRequests} onUpdate={fetchProfile} />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/oquv/video-darsliklar/quiz" className="group bg-gradient-to-br from-green-600/20 to-emerald-900/40 border border-green-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Quiz yechish</h3>
                <p className="text-sm text-purple-300">Bilimingizni sinab ko'ring</p>
              </Link>

              <Link href="/oquv/video-darsliklar" className="group bg-gradient-to-br from-blue-600/20 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
                <div className="text-4xl mb-3">🎬</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Video darslar</h3>
                <p className="text-sm text-purple-300">Yangi mavzularni o'rganing</p>
              </Link>

              <Link href="/birikmalar" className="group bg-gradient-to-br from-pink-600/20 to-rose-900/40 border border-pink-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
                <div className="text-4xl mb-3">🧪</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Birikmalar</h3>
                <p className="text-sm text-purple-300">120+ kompleks birikma</p>
              </Link>
            </div>

            {/* Recent Activity */}
            {quizResults.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  Oxirgi faoliyat
                </h2>
                <div className="space-y-3">
                  {quizResults.slice(0, 3).map(quiz => (
                    <div key={quiz.id} className="bg-purple-950/50 rounded-xl p-4 flex justify-between items-center border border-purple-700/30 hover:border-yellow-500/30 transition-all">
                      <div>
                        <div className="font-semibold text-white">{quiz.quizName}</div>
                        <div className="text-xs text-purple-400 mt-1">
                          {new Date(quiz.completedAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        quiz.percentage >= 80 ? 'text-green-400' :
                        quiz.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {quiz.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🏅</span>
              Mening yutuqlarim
            </h2>

            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className="bg-purple-950/50 rounded-2xl p-5 text-center border border-purple-700/30 hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity] || rarityColors.common} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-3">{achievement.icon}</div>
                      <div className="font-bold text-white mb-1">{achievement.name}</div>
                      <div className="text-xs text-purple-300 mb-2 leading-relaxed">{achievement.description}</div>
                      <div className={`inline-block text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity] || rarityColors.common} text-white font-semibold`}>
                        {(achievement.rarity || 'common').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-xl font-bold text-white mb-2">Hali yutuqlar yo'q</h3>
                <p className="text-purple-300 mb-6">Quizlarni yechib, yangi yutuqlarni qo'lga kiriting!</p>
                <Link 
                  href="/oquv/video-darsliklar/quiz"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
                >
                  Quiz boshlash →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* FRIENDS TAB */}
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Friend Search */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
              <FriendSearch />
            </div>

            {/* Friends List */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👥</span>
                Do'stlarim ({friends.length})
              </h2>

              {friends.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {friends.map(friend => (
                    <Link 
                      key={friend.id} 
                      href={`/profil/${friend.userId}`}
                      className="group bg-purple-950/50 rounded-2xl p-4 text-center border border-purple-700/30 hover:border-yellow-500/50 transition-all transform hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
                        {friend.fullName?.charAt(0)?.toUpperCase() || friend.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-semibold text-sm text-white group-hover:text-yellow-400 transition-colors truncate">
                        {friend.fullName || friend.username}
                      </div>
                      <div className="text-xs text-purple-400 truncate">@{friend.username}</div>
                      {friend.university && (
                        <div className="text-xs text-purple-500 mt-1 truncate">🏛️ {friend.university}</div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-white mb-2">Hali do'stlar yo'q</h3>
                  <p className="text-purple-300">Yuqoridagi qidiruv orqali yangi do'stlar toping!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === 'quizzes' && (
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📝</span>
              Barcha quiz natijalari
            </h2>

            {quizResults.length > 0 ? (
              <div className="space-y-3">
                {quizResults.map(quiz => (
                  <div key={quiz.id} className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 hover:border-yellow-500/30 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">{quiz.quizName}</div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-purple-400">
                          <span>📅 {new Date(quiz.completedAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}</span>
                          <span>⏱️ {Math.floor((quiz.timeSpent || 0) / 60)}:{String((quiz.timeSpent || 0) % 60).padStart(2, '0')}</span>
                          <span>📊 {quiz.score}/{quiz.totalQuestions}</span>
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${
                        quiz.percentage >= 80 ? 'text-green-400' :
                        quiz.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {quiz.percentage}%
                      </div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-purple-800/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          quiz.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          quiz.percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}
                        style={{ width: `${quiz.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-2">Hali quizlar yechilmagan</h3>
                <p className="text-purple-300 mb-6">Birinchi quizingizni yechib, natijalarni kuzating!</p>
                <Link 
                  href="/oquv/video-darsliklar/quiz"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
                >
                  Birinchi quizni boshlash →
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 px-4 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-purple-400 text-sm">
            © 2026 JDA KIMYO • jdakimyo.uz
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-xs font-mono font-bold">v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}