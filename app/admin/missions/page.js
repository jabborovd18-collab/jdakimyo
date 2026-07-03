// app/admin/missions/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const MISSION_TYPES = [
  { id: 'quiz', name: '📝 Quiz', color: 'blue' },
  { id: 'video', name: '🎬 Video', color: 'purple' },
  { id: 'compound', name: '🧪 Birikma', color: 'pink' },
  { id: 'mission', name: '🎯 Maxsus', color: 'yellow' }
]

const DIFFICULTIES = [
  { id: 'easy', name: 'Oson', color: 'green', xp: 10 },
  { id: 'medium', name: "O'rta", color: 'yellow', xp: 15 },
  { id: 'hard', name: 'Qiyin', color: 'red', xp: 20 }
]

const ICONS = ['🎯', '📝', '🎬', '🧪', '⭐', '🔥', '💎', '🏆', '🚀', '💪']

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState([])
  const [stats, setStats] = useState({ total: 0, todayMissions: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'quiz',
    title: '',
    description: '',
    xpReward: 10,
    icon: '🎯',
    difficulty: 'easy'
  })

  useEffect(() => {
    fetchMissions()
  }, [typeFilter, difficultyFilter, dateFilter])

  const fetchMissions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        type: typeFilter,
        difficulty: difficultyFilter,
        date: dateFilter
      })
      
      const res = await fetch(`/api/admin/missions?${params}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setMissions(data.missions)
      setStats(data.stats)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      date: new Date().toISOString().split('T')[0],
      type: 'quiz',
      title: '',
      description: '',
      xpReward: 10,
      icon: '🎯',
      difficulty: 'easy'
    })
    setShowModal(true)
  }

  const openEditModal = (mission) => {
    setIsEditing(true)
    setFormData({
      id: mission.id,
      date: new Date(mission.date).toISOString().split('T')[0],
      type: mission.type,
      title: mission.title,
      description: mission.description || '',
      xpReward: mission.xpReward,
      icon: mission.icon,
      difficulty: mission.difficulty
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Sarlavha kiriting!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/missions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchMissions()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Haqiqatan ham "${title}" ni o'chirmoqchimisiz?`)) return
    
    try {
      const res = await fetch(`/api/admin/missions?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchMissions()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getTypeBadge = (type) => {
    const t = MISSION_TYPES.find(t => t.id === type)
    if (!t) return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    return `bg-${t.color}-600/20 text-${t.color}-400 border-${t.color}-600/30`
  }

  const getDifficultyBadge = (diff) => {
    const d = DIFFICULTIES.find(d => d.id === diff)
    if (!d) return 'bg-gray-600/20 text-gray-400'
    return `bg-${d.color}-600/20 text-${d.color}-400`
  }

  const setDifficultyAndXP = (diff) => {
    const d = DIFFICULTIES.find(d => d.id === diff)
    setFormData({
      ...formData,
      difficulty: diff,
      xpReward: d ? d.xp : 10
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🎯 Missiyalar Boshqaruvi</h1>
          <p className="text-purple-300 mt-1">Kunlik missiyalarni yaratish va boshqarish</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2"
        >
          <span>➕</span> Yangi Missiya
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-purple-400">Jami missiyalar</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center text-xl">
              📅
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.todayMissions}</div>
              <div className="text-xs text-purple-400">Bugungi</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.byType?.quiz || 0}</div>
              <div className="text-xs text-purple-400">Quiz</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-xl">
              🎬
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.byType?.video || 0}</div>
              <div className="text-xs text-purple-400">Video</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">📚 Barcha turlar</option>
            {MISSION_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">🎯 Barcha qiyinliklar</option>
            {DIFFICULTIES.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          />

          {(typeFilter !== 'all' || difficultyFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setTypeFilter('all')
                setDifficultyFilter('all')
                setDateFilter('')
              }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm"
            >
              ✕ Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Missions Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-purple-300">⏳ Yuklanmoqda...</div>
        ) : missions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">🎯</div>
            <p className="text-purple-300">Hozircha missiyalar yo'q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-950/50 border-b border-purple-800/50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Sana</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Missiya</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Tur</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Qiyinlik</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">XP</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Bajarilgan</th>
                  <th className="text-right p-4 text-sm font-semibold text-purple-300">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => (
                  <tr key={mission.id} className="border-b border-purple-800/30 hover:bg-purple-950/30 transition-colors">
                    <td className="p-4">
                      <div className="text-sm text-white font-semibold">
                        {new Date(mission.date).toLocaleDateString('uz-UZ', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{mission.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{mission.title}</div>
                          {mission.description && (
                            <div className="text-xs text-purple-400 line-clamp-1">{mission.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getTypeBadge(mission.type)}`}>
                        {MISSION_TYPES.find(t => t.id === mission.type)?.name || mission.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(mission.difficulty)}`}>
                        {DIFFICULTIES.find(d => d.id === mission.difficulty)?.name || mission.difficulty}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-yellow-400 font-bold">+{mission.xpReward} XP</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-purple-300">
                        {mission._count?.completions || 0} marta
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(mission)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400 transition-all"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(mission.id, mission.title)}
                          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Missiyani tahrirlash' : '➕ Yangi missiya qo\'shish'}
            </h3>

            <div className="space-y-4">
              {/* Date & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Sana *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Tur *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {MISSION_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Sarlavha *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  placeholder="Masalan: Quiz yeching"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tavsif</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  rows="2"
                  placeholder="Har qanday quizni yechib, bilimingizni sinab ko'ring"
                />
              </div>

              {/* Difficulty & XP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Qiyinlik</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setDifficultyAndXP(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {DIFFICULTIES.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (+{d.xp} XP)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">XP mukofoti</label>
                  <input
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    min="1"
                  />
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Ikonka</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
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
            </div>

            <div className="flex gap-3 mt-6">
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
    </div>
  )
}