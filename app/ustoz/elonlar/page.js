// app/ustoz/elonlar/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sanaVaqt } from '@/lib/sana'

export default function ElonlarPage() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterGroup, setFilterGroup] = useState('all')
  
  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    groupId: ''
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [filterGroup])

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ groupId: filterGroup })
      const res = await fetch(`/api/ustoz/elonlar?${params}`)
      const data = await res.json()

      if (res.ok) {
        setAnnouncements(data.announcements)
        setGroups(data.groups)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('E\'lonlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    // Validatsiya
    if (!formData.title.trim()) {
      toast.error('Sarlavhani kiriting!')
      return
    }
    if (!formData.content.trim()) {
      toast.error('E\'lon matnini kiriting!')
      return
    }
    if (!formData.groupId) {
      toast.error('Guruhni tanlang!')
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch('/api/ustoz/elonlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message, { duration: 4000, icon: '📢' })
      setShowCreateModal(false)
      setFormData({ title: '', content: '', groupId: '' })
      fetchAnnouncements()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" e'lonini o'chirmoqchimisiz?`)) return

    try {
      const res = await fetch(`/api/ustoz/elonlar?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message)
      fetchAnnouncements()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'hozirgina'
    if (diffMins < 60) return `${diffMins} daqiqa oldin`
    if (diffHours < 24) return `${diffHours} soat oldin`
    if (diffDays < 7) return `${diffDays} kun oldin`
    
    return sanaVaqt(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📢 E'lonlar</h1>
          <p className="text-purple-300 mt-1">
            Guruhlaringizga xabar yuboring ({announcements.length} ta)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>📢</span>
          <span>Yangi e'lon</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
        >
          <option value="all">📚 Barcha guruhlar</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>E'lonlar yuklanmoqda...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
          <div className="text-7xl mb-4">📢</div>
          <h3 className="text-2xl font-bold text-white mb-2">Hali e'lonlar yo'q</h3>
          <p className="text-purple-300 mb-6">Birinchi e'loningizni yarating!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
          >
            📢 Birinchi e'lonni yaratish
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div
              key={announcement.id}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="px-2 py-0.5 text-xs bg-pink-600/30 text-pink-300 border border-pink-600/40 rounded-full">
                      📢 E'lon
                    </span>
                    {announcement.group && (
                      <span className="px-2 py-0.5 text-xs bg-blue-600/30 text-blue-300 border border-blue-600/40 rounded-full">
                        📚 {announcement.group.name}
                      </span>
                    )}
                    <span className="text-xs text-purple-400">
                      {formatDate(announcement.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{announcement.title}</h3>
                  <p className="text-sm text-purple-300 whitespace-pre-wrap leading-relaxed">
                    {announcement.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(announcement.id, announcement.title)}
                  className="w-9 h-9 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 flex items-center justify-center text-red-400 transition-all flex-shrink-0"
                  title="O'chirish"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📢 Yangi E'lon</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Sarlavha */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block font-semibold">
                  Sarlavha <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
                  placeholder="Masalan: Ertaga dars qoldirildi"
                  maxLength={100}
                />
              </div>

              {/* Matn */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block font-semibold">
                  E'lon matni <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
                  rows="6"
                  placeholder="E'lon matnini yozing...

Masalan:
Hurmatli talabalar!
Ertaga (15-yanvar) soat 10:00 da laboratoriya ishi bo'ladi.
Barchangiz tayyor bo'lib keling."
                />
              </div>

              {/* Guruh */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block font-semibold">
                  Qaysi guruhga? <span className="text-red-400">*</span>
                </label>
                {groups.length === 0 ? (
                  <div className="px-4 py-3 bg-red-950/30 border border-red-700/50 rounded-xl text-red-400">
                    ⚠️ Avval guruh yarating
                  </div>
                ) : (
                  <select
                    value={formData.groupId}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  >
                    <option value="">— Tanlang —</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-purple-800/50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl text-purple-200 font-semibold transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-[2] py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>📢</span>
                    <span>E'lonni yuborish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}