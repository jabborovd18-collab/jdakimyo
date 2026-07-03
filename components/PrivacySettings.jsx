"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showFriends: true,
    showQuizResults: true,
    showAchievements: true,
    showFollowers: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/profil/privacy')
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('[Privacy] Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    setIsSaving(true)

    try {
      const response = await fetch('/api/profil/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
    } catch (error) {
      // Xato bo'lsa, oldingi holatga qaytarish
      setSettings(settings)
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-purple-800/50 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-purple-800/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  const privacyOptions = [
    {
      key: 'profilePublic',
      title: 'Profilni ochiq qilish',
      description: 'Boshqa foydalanuvchilar profilingizni ko\'ra oladi',
      icon: '👤',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'showFriends',
      title: 'Do\'stlar ro\'yxatini ko\'rsatish',
      description: 'Do\'stlaringizni boshqalar ko\'ra oladi',
      icon: '👥',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'showQuizResults',
      title: 'Quiz natijalarini ko\'rsatish',
      description: 'Quiz natijalaringizni boshqalar ko\'ra oladi',
      icon: '📝',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      key: 'showAchievements',
      title: 'Yutuqlarni ko\'rsatish',
      description: 'Yutuqlaringizni boshqalar ko\'ra oladi',
      icon: '🏆',
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'showFollowers',
      title: 'Obunachilarni ko\'rsatish',
      description: 'Obunachilar va obunalar ro\'yxatini ko\'rsatish',
      icon: '👁️',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          🔒
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Maxfiylik sozlamalari</h2>
          <p className="text-sm text-purple-300">Kim profilingizni ko\'ra olishini boshqaring</p>
        </div>
      </div>

      <div className="space-y-3">
        {privacyOptions.map(option => (
          <div
            key={option.key}
            className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 hover:border-purple-600/50 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white mb-1">
                    {option.title}
                  </div>
                  <div className="text-sm text-purple-300">
                    {option.description}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(option.key)}
                disabled={isSaving}
                className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${
                  settings[option.key]
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-purple-800/50'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                    settings[option.key] ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                settings[option.key]
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                  : 'bg-red-600/20 text-red-400 border border-red-600/30'
              }`}>
                {settings[option.key] ? '✓ Ochiq' : '✗ Yashirin'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-blue-200">
            <strong className="text-blue-400">Maslahat:</strong> Do'stlaringiz har doim sizning to'liq profilingizni ko'ra oladi, maxfiylik sozlamalaridan qat'i nazar.
          </div>
        </div>
      </div>
    </div>
  )
}