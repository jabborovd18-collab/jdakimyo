// app/admin/achievements/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'quiz', name: '📝 Quiz', color: 'blue' },
  { id: 'streak', name: '🔥 Streak', color: 'orange' },
  { id: 'social', name: '👥 Ijtimoiy', color: 'pink' },
  { id: 'milestone', name: '🎯 Bosqich', color: 'purple' },
  { id: 'special', name: '✨ Maxsus', color: 'yellow' },
  { id: 'general', name: '🏆 Umumiy', color: 'green' }
]

const RARITIES = [
  { id: 'common', name: 'Oddiy', color: 'gray', gradient: 'from-gray-500 to-gray-600', xp: 10 },
  { id: 'rare', name: 'Noyob', color: 'blue', gradient: 'from-blue-500 to-cyan-500', xp: 50 },
  { id: 'epic', name: 'Epik', color: 'purple', gradient: 'from-purple-500 to-pink-500', xp: 100 },
  { id: 'legendary', name: 'Afsonaviy', color: 'yellow', gradient: 'from-yellow-500 to-orange-500', xp: 500 }
]

const ICONS = ['🏆', '⭐', '🎯', '🔥', '💎', '👑', '🎖️', '🥇', '🥈', '🥉', '📝', '📚', '🧪', '🔬', '💡', '🚀', '⚡', '🌟', '✨', '🎊', '🎉', '👥', '🤝', '💪', '🦸', '🧙', '🎓', '📊', '🔷', '🧲']

const DEFAULT_ACHIEVEMENTS = [
  {
    key: 'first_quiz',
    name: 'Birinchi qadam',
    description: 'Birinchi quizni muvaffaqiyatli yeching',
    icon: '📝',
    rarity: 'common',
    category: 'quiz',
    xpReward: 10
  },
  {
    key: 'quiz_10',
    name: 'Quiz ustasi',
    description: '10 ta quizni yeching',
    icon: '📚',
    rarity: 'rare',
    category: 'quiz',
    xpReward: 50
  },
  {
    key: 'quiz_50',
    name: 'Bilimdon',
    description: '50 ta quizni yeching',
    icon: '🎓',
    rarity: 'epic',
    category: 'quiz',
    xpReward: 100
  },
  {
    key: 'perfect_score',
    name: 'Mukammal natija',
    description: 'Quizda 100% ball to\'plang',
    icon: '💯',
    rarity: 'epic',
    category: 'quiz',
    xpReward: 100
  },
  {
    key: 'streak_3',
    name: 'Boshlanish',
    description: '3 kun ketma-ket kiring',
    icon: '🔥',
    rarity: 'common',
    category: 'streak',
    xpReward: 20
  },
  {
    key: 'streak_7',
    name: 'Haftalik intizom',
    description: '7 kun ketma-ket kiring',
    icon: '🔥',
    rarity: 'rare',
    category: 'streak',
    xpReward: 50
  },
  {
    key: 'streak_30',
    name: 'Oylik intizom',
    description: '30 kun ketma-ket kiring',
    icon: '🔥',
    rarity: 'epic',
    category: 'streak',
    xpReward: 200
  },
  {
    key: 'streak_100',
    name: 'Afsonaviy streak',
    description: '100 kun ketma-ket kiring',
    icon: '🔥',
    rarity: 'legendary',
    category: 'streak',
    xpReward: 500
  },
  {
    key: 'first_friend',
    name: 'Ijtimoiy qadam',
    description: 'Birinchi do\'stingizni qo\'shing',
    icon: '🤝',
    rarity: 'common',
    category: 'social',
    xpReward: 10
  },
  {
    key: 'friends_5',
    name: 'Do\'stlar davrasi',
    description: '5 ta do\'st qo\'shing',
    icon: '👥',
    rarity: 'rare',
    category: 'social',
    xpReward: 50
  },
  {
    key: 'friends_20',
    name: 'Tarmoq ustasi',
    description: '20 ta do\'st qo\'shing',
    icon: '🌐',
    rarity: 'epic',
    category: 'social',
    xpReward: 100
  },
  {
    key: 'level_5',
    name: 'Tadqiqotchi',
    description: '5-darajaga yeting',
    icon: '🎯',
    rarity: 'rare',
    category: 'milestone',
    xpReward: 50
  },
  {
    key: 'level_10',
    name: 'Afsona',
    description: '10-darajaga yeting',
    icon: '👑',
    rarity: 'legendary',
    category: 'milestone',
    xpReward: 500
  },
  {
    key: 'xp_1000',
    name: 'Minglik',
    description: '1000 XP to\'plang',
    icon: '⭐',
    rarity: 'rare',
    category: 'milestone',
    xpReward: 50
  },
  {
    key: 'xp_10000',
    name: 'O\'n minglik',
    description: '10000 XP to\'plang',
    icon: '💎',
    rarity: 'legendary',
    category: 'milestone',
    xpReward: 500
  }
]

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({ total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '', key: '', name: '', description: '',
    icon: '🏆', rarity: 'common', category: 'general',
    requirement: '', xpReward: 10, isActive: true
  })

  // Award modal
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [users, setUsers] = useState([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [isAwarding, setIsAwarding] = useState(false)

  useEffect(() => {
    fetchAchievements()
  }, [categoryFilter, rarityFilter, search])

  const fetchAchievements = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        rarity: rarityFilter,
        search
      })
      const res = await fetch(`/api/admin/achievements?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAchievements(data.achievements)
      setStats(data.stats)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 15 ta default yutuqni yuklash
  const handleSeed = async () => {
    if (!confirm('15 ta standart yutuqni yuklamoqchimisiz? (Allaqachon mavjud bo\'lganlar o\'tkazib yuboriladi)')) return
    
    let created = 0
    let skipped = 0
    
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      try {
        const res = await fetch('/api/admin/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ach)
        })
        if (res.ok) created++
        else skipped++
      } catch {
        skipped++
      }
    }
    
    toast.success(`✓ ${created} ta yutuq qo'shildi, ${skipped} ta o'tkazib yuborildi`)
    fetchAchievements()
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '', key: '', name: '', description: '',
      icon: '🏆', rarity: 'common', category: 'general',
      requirement: '', xpReward: 10, isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (a) => {
    setIsEditing(true)
    setFormData({
      id: a.id,
      key: a.key,
      name: a.name,
      description: a.description,
      icon: a.icon,
      rarity: a.rarity,
      category: a.category,
      requirement: a.requirement || '',
      xpReward: a.xpReward,
      isActive: a.isActive
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.key.trim()) { toast.error('Kalit (key) majburiy!'); return }
    if (!formData.name.trim()) { toast.error('Nom majburiy!'); return }
    if (!formData.description.trim()) { toast.error('Tavsif majburiy!'); return }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/achievements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowModal(false)
      fetchAchievements()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`⚠️ Haqiqatan ham "${name}" ni o'chirmoqchimisiz?\nBu yutuqni olgan barcha foydalanuvchilardan ham olib qo'yiladi!`)) return
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchAchievements()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openAwardModal = (achievement) => {
    setSelectedAchievement(achievement)
    setUserSearch('')
    setUsers([])
    setShowAwardModal(true)
  }

  const searchUsers = async () => {
    if (!userSearch.trim()) return
    setIsSearchingUsers(true)
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&limit=10`)
      const data = await res.json()
      if (res.ok) setUsers(data.users)
    } catch (error) {
      toast.error('Qidiruvda xatolik')
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleAward = async (userId, username) => {
    if (!confirm(`"${username}" ga "${selectedAchievement.name}" yutug'ini bermoqchimisiz?`)) return
    setIsAwarding(true)
    try {
      const res = await fetch('/api/admin/achievements/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, achievementKey: selectedAchievement.key })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowAwardModal(false)
      fetchAchievements()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAwarding(false)
    }
  }

  const getRarityGradient = (rarity) => {
    return RARITIES.find(r => r.id === rarity)?.gradient || 'from-gray-500 to-gray-600'
  }

  const getCategoryName = (cat) => CATEGORIES.find(c => c.id === cat)?.name || cat
  const getRarityName = (r) => RARITIES.find(r => r.id === r)?.name || r

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">🏆 Yutuqlar Boshqaruvi</h1>
          <p className="text-purple-300 mt-1">Foydalanuvchilar uchun motivatsion yutuqlar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>⚡</span> 15 ta standart
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>➕</span> Yangi Yutuq
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-white">{stats.total || 0}</div>
          <div className="text-xs text-purple-400">Jami yutuqlar</div>
        </div>
        {RARITIES.map(r => (
          <div key={r.id} className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.gradient} mb-1`}></div>
            <div className="text-xl font-bold text-white">{stats.byRarity?.[r.id] || 0}</div>
            <div className="text-xs text-purple-400">{r.name}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Yutuq nomi yoki kaliti bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">🏆 Barcha kategoriyalar</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">⭐ Barcha noyobliklar</option>
            {RARITIES.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Yutuqlar yo'q</h3>
          <p className="text-purple-300 mb-4">15 ta standart yutuqni yuklang yoki yangi qo'shing</p>
          <button
            onClick={handleSeed}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ⚡ 15 ta standart yutuqni yuklash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-5 hover:scale-[1.02] transition-all relative overflow-hidden group"
            >
              {/* Rarity gradient top border */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRarityGradient(a.rarity)}`}></div>
              
              {!a.isActive && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-600/20 border border-red-600/30 rounded-full text-xs text-red-400">
                  O'chirilgan
                </div>
              )}

              <div className="flex items-start gap-3 mb-3 pt-2">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRarityGradient(a.rarity)} flex items-center justify-center text-4xl flex-shrink-0`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white mb-1 line-clamp-1">{a.name}</div>
                  <div className="text-xs text-purple-400 font-mono mb-1">{a.key}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r ${getRarityGradient(a.rarity)} text-white`}>
                      {getRarityName(a.rarity)}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-800/50 text-purple-300">
                      {getCategoryName(a.category)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-purple-300 mb-3 line-clamp-2">{a.description}</p>

              <div className="flex items-center justify-between text-xs mb-3 pt-3 border-t border-purple-800/30">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold">+{a.xpReward} XP</span>
                  <span className="text-purple-400">
                    👥 {a.earnedCount || 0} ta olgan
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openAwardModal(a)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-600/50 rounded-lg text-xs text-green-400 transition-all"
                >
                  🎁 Berish
                </button>
                <button
                  onClick={() => openEditModal(a)}
                  className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400 transition-all"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.name)}
                  className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400 transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Yutuqni tahrirlash' : '➕ Yangi yutuq'}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Key & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Kalit (key) *</label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                    disabled={isEditing}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none disabled:opacity-50 font-mono text-sm"
                    placeholder="first_quiz"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="Birinchi qadam"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tavsif *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  rows="2"
                  placeholder="Bu yutuq nima uchun beriladi?"
                />
              </div>

              {/* Category & Rarity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Noyoblik (Rarity)</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => {
                      const r = RARITIES.find(r => r.id === e.target.value)
                      setFormData({ ...formData, rarity: e.target.value, xpReward: r?.xp || formData.xpReward })
                    }}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {RARITIES.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (+{r.xp} XP)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* XP Reward */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">XP mukofoti</label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  min="0"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Ikonka</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        formData.icon === icon
                          ? 'bg-yellow-500 text-black scale-110'
                          : 'bg-purple-800/50 hover:bg-purple-700/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement JSON */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Shart (JSON - ixtiyoriy)</label>
                <textarea
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none font-mono text-xs"
                  rows="3"
                  placeholder='{"type": "quiz_count", "value": 10}'
                />
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-purple-300">✓ Faol</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-purple-800/50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg disabled:opacity-50"
              >
                {isSaving ? '⏳ Saqlanmoqda...' : (isEditing ? '✓ Yangilash' : '✓ Saqlash')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AWARD MODAL */}
      {showAwardModal && selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              🎁 Yutuq berish: <span className="text-yellow-400">{selectedAchievement.name}</span>
            </h3>

            <div className="flex items-center gap-3 mb-4 p-3 bg-purple-950/50 rounded-lg">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRarityGradient(selectedAchievement.rarity)} flex items-center justify-center text-2xl`}>
                {selectedAchievement.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{selectedAchievement.name}</div>
                <div className="text-xs text-purple-400">{selectedAchievement.description}</div>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                placeholder="Email, username yoki ism bo'yicha qidirish..."
                className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
              />
              <button
                onClick={searchUsers}
                disabled={isSearchingUsers}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
              >
                {isSearchingUsers ? '⏳' : '🔍'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {users.length === 0 ? (
                <div className="text-center py-8 text-purple-400">
                  Qidiruv uchun username yoki email kiriting
                </div>
              ) : (
                users.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 bg-purple-950/30 hover:bg-purple-950/50 rounded-lg transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                      {u.fullName?.charAt(0) || u.username.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {u.fullName || u.username}
                      </div>
                      <div className="text-xs text-purple-400 truncate">
                        @{u.username} • {u.email}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAward(u.id, u.fullName || u.username)}
                      disabled={isAwarding}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                    >
                      🎁 Berish
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-purple-800/50">
              <button
                onClick={() => setShowAwardModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}