// app/admin/quizzes/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'nomlanishi', name: '📖 Nomlanishi', color: 'red' },
  { id: 'klassifikatsiyasi', name: '📊 Klassifikatsiyasi', color: 'blue' },
  { id: 'fazoviy', name: '💎 Fazoviy', color: 'purple' },
  { id: 'izomeriya', name: '🔄 Izomeriya', color: 'pink' },
  { id: 'aralash', name: '🎯 Aralash', color: 'yellow' }
]

const DIFFICULTIES = [
  { id: 'oson', name: 'Oson', color: 'green' },
  { id: "o'rta", name: "O'rta", color: 'yellow' },
  { id: 'qiyin', name: 'Qiyin', color: 'red' }
]

export default function AdminQuizzesPage() {
  const [questions, setQuestions] = useState([])
  const [stats, setStats] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    category: 'nomlanishi',
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    difficulty: "o'rta",
    tags: [],
    isActive: true
  })

  useEffect(() => {
    fetchQuestions()
  }, [categoryFilter, difficultyFilter, pagination.page])

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        category: categoryFilter,
        difficulty: difficultyFilter,
        search
      })
      
      const res = await fetch(`/api/admin/quizzes?${params}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setQuestions(data.questions)
      setStats(data.stats)
      setPagination(data.pagination)
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
      category: 'nomlanishi',
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      difficulty: "o'rta",
      tags: [],
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (q) => {
    setIsEditing(true)
    setFormData({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation || '',
      difficulty: q.difficulty,
      tags: q.tags || [],
      isActive: q.isActive
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    // Validatsiya
    if (!formData.question.trim()) {
      toast.error('Savol kiriting!')
      return
    }
    if (formData.options.some(o => !o.trim())) {
      toast.error('Barcha variantlarni to\'ldiring!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/quizzes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchQuestions()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, question) => {
    if (!confirm(`Haqiqatan ham o'chirmoqchimisiz?\n\n"${question.substring(0, 50)}..."`)) return
    
    try {
      const res = await fetch(`/api/admin/quizzes?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchQuestions()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(p => ({ ...p, page: 1 }))
    fetchQuestions()
  }

  const updateOption = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const getCategoryBadge = (cat) => {
    const c = CATEGORIES.find(c => c.id === cat)
    if (!c) return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    return `bg-${c.color}-600/20 text-${c.color}-400 border-${c.color}-600/30`
  }

  const getDifficultyBadge = (diff) => {
    const d = DIFFICULTIES.find(d => d.id === diff)
    if (!d) return 'bg-gray-600/20 text-gray-400'
    return `bg-${d.color}-600/20 text-${d.color}-400`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📝 Quiz Savollari</h1>
          <p className="text-purple-300 mt-1">Barcha mavzular bo'yicha savollar bazasi</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2"
        >
          <span>➕</span> Yangi Savol
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
            <div className="text-2xl mb-1">{cat.name.split(' ')[0]}</div>
            <div className="text-2xl font-bold text-white">{stats[cat.id] || 0}</div>
            <div className="text-xs text-purple-400">{cat.name.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Savol matni bo'yicha qidirish..."
            className="flex-1 px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
          >
            Qidirish
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">📚 Barcha kategoriyalar</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">🎯 Barcha qiyinliklar</option>
            {DIFFICULTIES.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-purple-300">⏳ Yuklanmoqda...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-purple-300">Hozircha savollar yo'q</p>
          </div>
        ) : (
          <div className="divide-y divide-purple-800/30">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 hover:bg-purple-950/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-800/50 flex items-center justify-center text-sm font-bold text-purple-300 flex-shrink-0">
                    {(pagination.page - 1) * pagination.limit + idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryBadge(q.category)}`}>
                        {CATEGORIES.find(c => c.id === q.category)?.name || q.category}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyBadge(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      {!q.isActive && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600/20 text-red-400">
                          O'chirilgan
                        </span>
                      )}
                    </div>
                    <div className="text-white font-medium mb-2 line-clamp-2">
                      {q.question}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`px-2 py-1 rounded ${
                            i === q.correct
                              ? 'bg-green-900/30 text-green-400 border border-green-600/30'
                              : 'bg-purple-950/30 text-purple-300'
                          }`}
                        >
                          <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                          {i === q.correct && <span className="ml-1">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(q)}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(q.id, q.question)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-purple-800/50">
            <div className="text-sm text-purple-400">
              {pagination.total} ta savoldan {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} ko'rsatilmoqda
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Oldingi
              </button>
              <span className="px-3 py-1 text-sm font-semibold">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Savolni tahrirlash' : '➕ Yangi savol qo\'shish'}
            </h3>

            <div className="space-y-4">
              {/* Category & Difficulty */}
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
                  <label className="text-sm text-purple-300 mb-1 block">Qiyinlik</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {DIFFICULTIES.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Savol *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  rows="3"
                  placeholder="[Cu(NH₃)₄]SO₄ ning IUPAC nomi qanday?"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="text-sm text-purple-300 block">Variantlar * (to'g'ri javobni tanlang)</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, correct: i })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all ${
                        formData.correct === i
                          ? 'bg-green-500 text-black'
                          : 'bg-purple-800/50 text-purple-400 hover:bg-purple-700/50'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      placeholder={`${String.fromCharCode(65 + i)} variant`}
                    />
                  </div>
                ))}
                <p className="text-xs text-purple-500">
                  💡 Yashil tugma — to'g'ri javob
                </p>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tushuntirish (ixtiyoriy)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  rows="2"
                  placeholder="Nima uchun bu javob to'g'ri?"
                />
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-purple-300">Faol (quizlarda ko'rsatilsin)</span>
              </label>
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