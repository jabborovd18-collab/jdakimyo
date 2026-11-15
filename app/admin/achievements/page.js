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
  
  // Filters & search debounce
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Modals
  const [showModal, setShowModal] = useState(false)
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    key: '',
    name: '',
    description: '',
    icon: '🏆',
    rarity: 'common',
    category: 'general',
    requirement: '',
    xpReward: 10,
    isActive: true,
  })

  // Award modal
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [users, setUsers] = useState([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [isAwarding, setIsAwarding] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    fetchAchievements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, rarityFilter, search])

  const fetchAchievements = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        rarity: rarityFilter,
        search,
      })
      const res = await fetch(`/api/admin/achievements?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yutuqlarni yuklashda xatolik')
      setAchievements(data.achievements || [])
      setStats(data.stats || { total: 0 })
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeed = async () => {
    setIsSaving(true)
    let created = 0
    let skipped = 0

    for (const ach of DEFAULT_ACHIEVEMENTS) {
      try {
        const res = await fetch('/api/admin/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ach),
        })
        if (res.ok) created++
        else skipped++
      } catch {
        skipped++
      }
    }

    setIsSaving(false)
    setShowSeedModal(false)
    toast.success(`${created} ta yutuq qo'shildi, ${skipped} ta o'tkazib yuborildi`)
    fetchAchievements()
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      key: '',
      name: '',
      description: '',
      icon: '🏆',
      rarity: 'common',
      category: 'general',
      requirement: '',
      xpReward: 10,
      isActive: true,
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
      isActive: a.isActive,
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
        body: JSON.stringify(formData),
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

  const RARITY_STYLES = {
    common: { badge: 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] text-[var(--v3-xira)]', bar: 'bg-slate-400' },
    rare: { badge: 'border-sky-400/40 bg-sky-400/15 text-sky-200', bar: 'bg-sky-400' },
    epic: { badge: 'border-indigo-400/40 bg-indigo-400/15 text-indigo-200', bar: 'bg-indigo-400' },
    legendary: { badge: 'border-amber-400/40 bg-amber-400/15 text-amber-200', bar: 'bg-amber-400' },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 pb-5 border-b border-[var(--v3-chiziq)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)]">Yutuqlar boshqaruvi</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--v3-xira)]">
            Yutuq qoidalarini yaratish, tahrirlash va foydalanuvchilarga qo&apos;lda taqdim etish
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowSeedModal(true)} className="v3-tugma text-xs">
            15 ta standart
          </button>
          <button type="button" onClick={openAddModal} className="v3-tugma v3-tugma-asosiy text-xs">
            + Yangi yutuq
          </button>
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="v3-panel-karta p-4">
          <div className="text-xl font-bold text-[var(--v3-matn)]">{stats.total || 0}</div>
          <div className="text-xs text-[var(--v3-xira)] mt-0.5">Jami yutuqlar</div>
        </div>
        {RARITIES.map((r) => {
          const st = RARITY_STYLES[r.id] || RARITY_STYLES.common
          return (
            <div key={r.id} className="v3-panel-karta p-4 flex items-center justify-between gap-2">
              <div>
                <div className="text-xl font-bold text-[var(--v3-matn)]">{stats.byRarity?.[r.id] || 0}</div>
                <div className="text-xs text-[var(--v3-xira)]">{r.name}</div>
              </div>
              <span className={`w-2.5 h-8 rounded-full ${st.bar}`} />
            </div>
          )
        })}
      </div>

      {/* Qidiruv va filtrlar */}
      <div className="v3-panel-karta p-4 space-y-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Yutuq nomi yoki kaliti bo'yicha qidirish..."
          className="v3-kiritish"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="v3-kiritish w-auto min-w-[180px]"
          >
            <option value="all">Barcha kategoriyalar</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="v3-kiritish w-auto min-w-[170px]"
          >
            <option value="all">Barcha darajalar</option>
            {RARITIES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yutuqlar ro'yxati */}
      {isLoading ? (
        <div className="v3-panel-karta py-12 text-center text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
      ) : achievements.length === 0 ? (
        <div className="v3-panel-karta py-12 px-4 text-center space-y-3">
          <h3 className="text-base font-bold text-[var(--v3-matn)]">Yutuqlar topilmadi</h3>
          <p className="text-xs text-[var(--v3-xira)]">15 ta standart yutuqni yuklang yoki yangi qo&apos;shing.</p>
          <button type="button" onClick={() => setShowSeedModal(true)} className="v3-tugma v3-tugma-asosiy text-xs">
            15 ta standart yutuqni yuklash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const st = RARITY_STYLES[a.rarity] || RARITY_STYLES.common
            return (
              <div
                key={a.id}
                className={`v3-panel-karta p-4 flex flex-col justify-between gap-3 relative overflow-hidden ${
                  !a.isActive ? 'opacity-65' : ''
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${st.bar}`} />

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex items-center justify-center text-2xl shrink-0">
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-[var(--v3-matn)] truncate">{a.name}</div>
                      <div className="text-[11px] font-mono text-[var(--v3-xira)] truncate">{a.key}</div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.badge}`}>
                          {getRarityName(a.rarity)}
                        </span>
                        <span className="inline-flex rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] px-2 py-0.5 text-[11px] text-[var(--v3-xira)]">
                          {getCategoryName(a.category)}
                        </span>
                        {!a.isActive && (
                          <span className="inline-flex rounded-full border border-rose-400/40 bg-rose-400/15 px-2 py-0.5 text-[11px] text-rose-200">
                            O&apos;chirilgan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--v3-xira)] line-clamp-2">{a.description}</p>
                </div>

                <div className="space-y-2.5 pt-2.5 border-t border-[var(--v3-chiziq)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--v3-urgu)]">+{a.xpReward} XP</span>
                    <span className="text-[var(--v3-xira)]">{a.earnedCount || 0} nafar olgan</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openAwardModal(a)}
                      className="v3-tugma flex-1 text-xs py-1.5"
                    >
                      Foydalanuvchiga berish
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(a)}
                      className="v3-tugma text-xs py-1.5 px-3"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id, a.name)}
                      className="v3-tugma text-xs py-1.5 px-3 text-rose-300"
                    >
                      O&apos;chirish
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Qo'shish / Tahrirlash oynasi */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            className="v3-panel-karta w-full max-w-2xl p-5 sm:p-6 my-8 border-[var(--v3-chiziq-2)] space-y-4"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <h3 className="text-lg font-bold text-[var(--v3-matn)]">
              {isEditing ? 'Yutuqni tahrirlash' : "Yangi yutuq qo'shish"}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Kalit (key) *</label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                    disabled={isEditing}
                    className="v3-kiritish font-mono text-xs disabled:opacity-50"
                    placeholder="first_quiz"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="v3-kiritish"
                    placeholder="Birinchi qadam"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Tavsif *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="v3-kiritish"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="v3-kiritish"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Noyoblik</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => {
                      const r = RARITIES.find((item) => item.id === e.target.value)
                      setFormData({ ...formData, rarity: e.target.value, xpReward: r?.xp || formData.xpReward })
                    }}
                    className="v3-kiritish"
                  >
                    {RARITIES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (+{r.xp} XP)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">XP mukofoti</label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })}
                  className="v3-kiritish"
                  min="0"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1.5 block">Belgicha</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center ${
                        formData.icon === icon
                          ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]'
                          : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Shart (JSON - ixtiyoriy)</label>
                <textarea
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="v3-kiritish font-mono text-xs"
                  rows={3}
                  placeholder='{"type": "quiz_count", "value": 10}'
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--v3-matn)]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-amber-400"
                />
                <span>Faol</span>
              </label>
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-[var(--v3-chiziq)]">
              <button type="button" onClick={() => setShowModal(false)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
              >
                {isSaving ? 'Saqlanmoqda...' : isEditing ? 'Yangilash' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standart 15 yutuqni yuklash tasdig'i */}
      {showSeedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSeedModal(false) }}
        >
          <div
            className="v3-panel-karta w-full max-w-md p-5 sm:p-6 border-[var(--v3-chiziq-2)] space-y-4"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <h3 className="text-lg font-bold text-[var(--v3-matn)]">15 ta standart yutuq yuklash</h3>
            <p className="text-sm text-[var(--v3-xira)]">
              Allaqachon mavjud kalitli yutuqlar o&apos;tkazib yuboriladi, yangilari qo&apos;shiladi.
            </p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setShowSeedModal(false)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSeed}
                disabled={isSaving}
                className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
              >
                {isSaving ? 'Yuklanmoqda...' : 'Yuklash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yutuq berish oynasi */}
      {showAwardModal && selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAwardModal(false) }}
        >
          <div
            className="v3-panel-karta w-full max-w-xl p-5 sm:p-6 my-8 border-[var(--v3-chiziq-2)] space-y-4"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <h3 className="text-lg font-bold text-[var(--v3-matn)]">
              Yutuq berish: <span className="text-[var(--v3-urgu)]">{selectedAchievement.name}</span>
            </h3>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
              <span className="text-2xl">{selectedAchievement.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-[var(--v3-matn)]">{selectedAchievement.name}</div>
                <div className="text-xs text-[var(--v3-xira)]">{selectedAchievement.description}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                placeholder="Email, username yoki ism bo'yicha qidirish..."
                className="v3-kiritish flex-1"
              />
              <button
                type="button"
                onClick={searchUsers}
                disabled={isSearchingUsers}
                className="v3-tugma v3-tugma-asosiy text-xs px-4"
              >
                {isSearchingUsers ? 'Qidirilmoqda...' : 'Qidirish'}
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {users.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--v3-xira)]">
                  Qidiruv uchun username yoki email kiriting
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] shrink-0">
                      {(u.fullName?.charAt(0) || u.username.charAt(0)).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[var(--v3-matn)] truncate">
                        {u.fullName || u.username}
                      </div>
                      <div className="text-xs text-[var(--v3-xira)] truncate">
                        @{u.username} · {u.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAward(u.id, u.fullName || u.username)}
                      disabled={isAwarding}
                      className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 disabled:opacity-45"
                    >
                      Berish
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[var(--v3-chiziq)] flex justify-end">
              <button type="button" onClick={() => setShowAwardModal(false)} className="v3-tugma text-xs">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}