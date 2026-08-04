// app/ustoz/talaba/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UstozTalabalarPage() {
  const { data: session } = useSession()
  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [groupFilter, search])

  useEffect(() => {
    if (searchQuery.length >= 2 && selectedGroupId) {
      const timeout = setTimeout(() => searchUsers(), 300)
      return () => clearTimeout(timeout)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, selectedGroupId])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        groupId: groupFilter,
        search
      })
      const res = await fetch(`/api/ustoz/talaba?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setStudents(data.students)
        setGroups(data.groups)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Talabalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery || searchQuery.length < 2 || !selectedGroupId) return
    
    setIsSearching(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        groupId: selectedGroupId
      })
      const res = await fetch(`/api/ustoz/talaba/qidiruv?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setSearchResults(data.users)
      }
    } catch (error) {
      console.error('Qidiruvda xatolik:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddStudent = async (studentId, studentName) => {
    if (!selectedGroupId) {
      toast.error('Guruhni tanlang!')
      return
    }

    setIsAdding(true)
    try {
      const res = await fetch('/api/ustoz/talaba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, groupId: selectedGroupId })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setSearchQuery('')
      setSearchResults([])
      setShowAddModal(false)
      fetchStudents()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveStudent = async (id, studentName, groupName) => {
    if (!confirm(`"${studentName}" ni "${groupName}" guruhidan olib tashlamoqchimisiz?`)) {
      return
    }

    try {
      const res = await fetch(`/api/ustoz/talaba?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchStudents()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openAddModal = () => {
    if (groups.length === 0) {
      toast.error('Avval guruh yarating!', {
        icon: '⚠️',
        duration: 3000
      })
      return
    }
    setSelectedGroupId(groups[0].id)
    setSearchQuery('')
    setSearchResults([])
    setShowAddModal(true)
  }

  const getColorClass = (color) => {
    const map = {
      blue: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      green: 'bg-green-600/20 text-green-400 border-green-600/30',
      purple: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      orange: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
      red: 'bg-red-600/20 text-red-400 border-red-600/30',
      pink: 'bg-pink-600/20 text-pink-400 border-pink-600/30',
      cyan: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
      yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
    }
    return map[color] || map.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Talabalarim</h1>
          <p className="text-purple-300 mt-1">
            Jami {students.length} ta talaba
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>➕</span>
          <span>Talaba qo'shish</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Talaba nomi yoki username bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGroupFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              groupFilter === 'all'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
            }`}
          >
            Barchasi ({students.length})
          </button>
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setGroupFilter(g.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                groupFilter === g.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>Talabalar yuklanmoqda...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
          <div className="text-7xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {search ? 'Talaba topilmadi' : 'Hali talabalar yo\'q'}
          </h3>
          <p className="text-purple-300 mb-6">
            {search 
              ? 'Qidiruv so\'zini o\'zgartirib ko\'ring' 
              : 'Birinchi talabangizni guruhga qo\'shing!'}
          </p>
          {!search && (
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              ➕ Birinchi talabani qo'shish
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((ts) => (
            <div
              key={ts.id}
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-2xl p-5 hover:border-yellow-500/50 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl font-bold text-black flex-shrink-0 overflow-hidden">
                  {ts.student.avatar ? (
                    <img src={ts.student.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (ts.student.fullName?.charAt(0) || ts.student.username.charAt(0)).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profil/${ts.student.userId}`}
                    className="font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1"
                  >
                    {ts.student.fullName || ts.student.username}
                  </Link>
                  <div className="text-xs text-purple-400 truncate">@{ts.student.username}</div>
                  {ts.student.university && (
                    <div className="text-xs text-purple-500 mt-1 truncate">🏛️ {ts.student.university}</div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveStudent(
                    ts.id,
                    ts.student.fullName || ts.student.username,
                    ts.group.name
                  )}
                  className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 flex items-center justify-center text-red-400 transition-all flex-shrink-0"
                  title="Guruhdan olib tashlash"
                >
                  ✕
                </button>
              </div>

              {/* Group Badge */}
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${getColorClass(ts.group.color)}`}>
                <span>📚</span>
                <span>{ts.group.name}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-800/30">
                <div className="text-center">
                  <div className="text-lg">📝</div>
                  <div className="text-xs text-purple-400">Topshiriq</div>
                  <div className="text-sm font-bold text-white">{ts.stats.submissions}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">⭐</div>
                  <div className="text-xs text-purple-400">O'rtacha</div>
                  <div className="text-sm font-bold text-yellow-400">
                    {ts.stats.avgScore > 0 ? ts.stats.avgScore.toFixed(0) : '—'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg">🎯</div>
                  <div className="text-xs text-purple-400">Daraja</div>
                  <div className="text-sm font-bold text-white">Lvl {ts.student.level_points}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>➕</span> Talaba qo'shish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {/* Guruh tanlash */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  📚 Qaysi guruhga qo'shish?
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Qidiruv */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  🔍 Talabani qidirish (username yoki ism)
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masalan: akmal yoki test@..."
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 outline-none focus:border-yellow-500"
                  autoFocus
                />
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Kamida 2 ta harf kiriting
                  </p>
                )}
              </div>

              {/* Natijalar */}
              <div className="min-h-[200px]">
                {isSearching ? (
                  <div className="text-center py-8 text-purple-300">
                    <div className="animate-spin text-3xl mb-2">⏳</div>
                    <p className="text-sm">Qidirilmoqda...</p>
                  </div>
                ) : searchQuery.length < 2 ? (
                  <div className="text-center py-8 text-purple-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-sm">Qidiruvni boshlash uchun yozing</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8 text-purple-400">
                    <div className="text-4xl mb-2">😕</div>
                    <p className="text-sm">Hech kim topilmadi</p>
                    <p className="text-xs mt-1">Boshqa so'z bilan urinib ko'ring</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-purple-400 mb-2">
                      {searchResults.length} ta natija topildi:
                    </p>
                    {searchResults.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-purple-950/30 hover:bg-purple-950/50 rounded-lg border border-purple-700/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">
                            {user.fullName || user.username}
                          </div>
                          {/* Email ataylab ko'rsatilmaydi: u profilning
                              ochiq qismi emas. Talabani ajratish uchun
                              username va fakultet yetarli. */}
                          <div className="text-xs text-purple-400 truncate">
                            @{user.username}
                          </div>
                          {(user.university || user.faculty) && (
                            <div className="text-xs text-purple-500 truncate">
                              🏛️ {[user.university, user.faculty].filter(Boolean).join(' • ')}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddStudent(user.id, user.fullName || user.username)}
                          disabled={isAdding}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-xs font-bold rounded-lg transition-all flex-shrink-0 disabled:opacity-50"
                        >
                          {isAdding ? '...' : '+ Qo\'shish'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-4 border-t border-purple-800/50">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full py-2.5 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all"
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