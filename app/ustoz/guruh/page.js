// app/ustoz/guruh/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const COLORS = [
  { id: 'blue', name: 'Ko\'k', hex: '#3b82f6' },
  { id: 'green', name: 'Yashil', hex: '#10b981' },
  { id: 'purple', name: 'Binafsha', hex: '#8b5cf6' },
  { id: 'orange', name: 'To\'q sariq', hex: '#f59e0b' },
  { id: 'red', name: 'Qizil', hex: '#ef4444' },
  { id: 'pink', name: 'Pushti', hex: '#ec4899' },
  { id: 'cyan', name: 'Havo rang', hex: '#06b6d4' },
  { id: 'yellow', name: 'Sariq', hex: '#eab308' }
]

export default function UstozGuruhlarPage() {
  const { data: session } = useSession()
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    color: 'blue'
  })

  useEffect(() => {
    fetchGroups()
  }, [search])

  const fetchGroups = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search })
      const res = await fetch(`/api/ustoz/guruh?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setGroups(data.groups)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Guruhlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      name: '',
      description: '',
      color: 'blue'
    })
    setShowModal(true)
  }

  const openEditModal = (group) => {
    setIsEditing(true)
    setFormData({
      id: group.id,
      name: group.name,
      description: group.description || '',
      color: group.color || 'blue'
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Guruh nomini kiriting!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/ustoz/guruh', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchGroups()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" guruhini o'chirmoqchimisiz?\n\n⚠️ Bu guruhga bog'liq barcha vazifalar va e'lonlar ham o'chiriladi!`)) {
      return
    }

    try {
      const res = await fetch(`/api/ustoz/guruh?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchGroups()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'from-blue-600/20 to-cyan-600/20 border-blue-700/50',
      green: 'from-green-600/20 to-emerald-600/20 border-green-700/50',
      purple: 'from-purple-600/20 to-pink-600/20 border-purple-700/50',
      orange: 'from-orange-600/20 to-amber-600/20 border-orange-700/50',
      red: 'from-red-600/20 to-rose-600/20 border-red-700/50',
      pink: 'from-pink-600/20 to-fuchsia-600/20 border-pink-700/50',
      cyan: 'from-cyan-600/20 to-teal-600/20 border-cyan-700/50',
      yellow: 'from-yellow-600/20 to-orange-600/20 border-yellow-700/50'
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Guruhlarim</h1>
          <p className="text-purple-300 mt-1">
            Talabalar guruhlaringizni boshqaring
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>➕</span>
          <span>Yangi guruh</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Guruh nomi bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>Guruhlar yuklanmoqda...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
          <div className="text-7xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {search ? 'Guruh topilmadi' : 'Hali guruhlar yo\'q'}
          </h3>
          <p className="text-purple-300 mb-6">
            {search 
              ? 'Qidiruv so\'zini o\'zgartirib ko\'ring' 
              : 'Birinchi guruhingizni yarating va talabalarni qo\'shing!'}
          </p>
          {!search && (
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              ➕ Birinchi guruhni yaratish
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`bg-gradient-to-br ${getColorClass(group.color)} border rounded-2xl p-6 hover:scale-[1.02] transition-all group`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="text-sm text-purple-300 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => openEditModal(group)}
                    className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400 transition-all"
                    title="Tahrirlash"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(group.id, group.name)}
                    className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400 transition-all"
                    title="O'chirish"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-purple-950/30 rounded-lg p-2 text-center">
                  <div className="text-lg">👥</div>
                  <div className="text-xs text-purple-300">Talabalar</div>
                  <div className="text-sm font-bold text-white">{group._count.students}</div>
                </div>
                <div className="bg-purple-950/30 rounded-lg p-2 text-center">
                  <div className="text-lg">📝</div>
                  <div className="text-xs text-purple-300">Vazifalar</div>
                  <div className="text-sm font-bold text-white">{group._count.assignments}</div>
                </div>
                <div className="bg-purple-950/30 rounded-lg p-2 text-center">
                  <div className="text-lg">📢</div>
                  <div className="text-xs text-purple-300">E'lonlar</div>
                  <div className="text-sm font-bold text-white">{group._count.announcements}</div>
                </div>
              </div>

              {/* Talabalar preview */}
              {group.students.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-purple-400 mb-2">Talabalar:</div>
                  <div className="flex -space-x-2">
                    {group.students.slice(0, 5).map((ts) => (
                      <div
                        key={ts.id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-purple-900 flex items-center justify-center text-xs font-bold text-black overflow-hidden"
                        title={ts.student.fullName || ts.student.username}
                      >
                        {ts.student.avatar ? (
                          <img src={ts.student.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (ts.student.fullName?.charAt(0) || ts.student.username.charAt(0)).toUpperCase()
                        )}
                      </div>
                    ))}
                    {group._count.students > 5 && (
                      <div className="w-8 h-8 rounded-full bg-purple-800 border-2 border-purple-900 flex items-center justify-center text-xs font-bold text-purple-300">
                        +{group._count.students - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <Link
                href={`/ustoz/guruh/${group.id}`}
                className="block w-full py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-center text-sm font-semibold text-white transition-all"
              >
                Batafsil ko'rish →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Guruhni tahrirlash' : '➕ Yangi guruh yaratish'}
            </h3>

            <div className="space-y-4">
              {/* Guruh nomi */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">
                  Guruh nomi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  placeholder="Kimyo 203, Laboratoriya A, va h.k."
                />
              </div>

              {/* Tavsif */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">
                  Tavsif (ixtiyoriy)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  rows="3"
                  placeholder="Guruh haqida qisqacha ma'lumot..."
                />
              </div>

              {/* Rang */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  Rang
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setFormData({ ...formData, color: color.id })}
                      className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                        formData.color === color.id
                          ? 'border-white scale-110'
                          : 'border-purple-700/50 hover:border-purple-500/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {formData.color === color.id && (
                        <span className="text-white text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg disabled:opacity-50 transition-all"
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