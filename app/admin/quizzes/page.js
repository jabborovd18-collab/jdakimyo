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

  const CAT_BADGE_MAP = {
    nomlanishi: 'border-sky-400/40 bg-sky-400/15 text-sky-200',
    klassifikatsiyasi: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
    fazoviy: 'border-indigo-400/40 bg-indigo-400/15 text-indigo-200',
    izomeriya: 'border-amber-400/40 bg-amber-400/15 text-amber-200',
    aralash: 'border-rose-400/40 bg-rose-400/15 text-rose-200',
  }

  const DIFF_BADGE_MAP = {
    easy: { label: 'Oson', cls: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200' },
    medium: { label: "O'rta", cls: 'border-amber-400/40 bg-amber-400/15 text-amber-200' },
    hard: { label: 'Qiyin', cls: 'border-rose-400/40 bg-rose-400/15 text-rose-200' },
  }

  const getCategoryBadge = (cat) =>
    CAT_BADGE_MAP[cat] || 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]'

  const getDifficultyInfo = (diff) =>
    DIFF_BADGE_MAP[diff] || { label: diff, cls: 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]' }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 pb-5 border-b border-[var(--v3-chiziq)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)]">Quiz savollar banki</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--v3-xira)]">
            Mobil ilova va klassik testlar (/api/quiz/bank) uchun kategoriyalangan savollar bazasi
          </p>
        </div>
        <button type="button" onClick={openAddModal} className="v3-tugma v3-tugma-asosiy text-xs">
          + Yangi savol
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="v3-panel-karta p-4">
            <div className="text-xl font-bold text-[var(--v3-matn)]">{stats[cat.id] || 0}</div>
            <div className="text-xs text-[var(--v3-xira)] mt-0.5">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Qidiruv va filtrlar */}
      <div className="v3-panel-karta p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2.5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Savol matni bo'yicha qidirish..."
            className="v3-kiritish flex-1"
          />
          <button type="submit" className="v3-tugma v3-tugma-asosiy text-xs px-4">
            Qidirish
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPagination((p) => ({ ...p, page: 1 }))
            }}
            className="v3-kiritish w-auto min-w-[200px]"
          >
            <option value="all">Barcha kategoriyalar</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value)
              setPagination((p) => ({ ...p, page: 1 }))
            }}
            className="v3-kiritish w-auto min-w-[170px]"
          >
            <option value="all">Barcha qiyinliklar</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Savollar ro'yxati */}
      <div className="v3-panel-karta overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--v3-xira)]">Hozircha savollar topilmadi</div>
        ) : (
          <div className="divide-y divide-[var(--v3-chiziq)]">
            {questions.map((q, idx) => {
              const diff = getDifficultyInfo(q.difficulty)
              return (
                <div key={q.id} className="p-4 hover:bg-[var(--v3-yuza)] transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] flex items-center justify-center text-xs font-bold text-[var(--v3-xira)] shrink-0">
                      {(pagination.page - 1) * pagination.limit + idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getCategoryBadge(q.category)}`}>
                          {CATEGORIES.find((c) => c.id === q.category)?.name || q.category}
                        </span>
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${diff.cls}`}>
                          {diff.label}
                        </span>
                        {!q.isActive && (
                          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-rose-400/40 bg-rose-400/15 text-rose-200">
                            O&apos;chirilgan
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--v3-matn)] font-medium mb-2.5">{q.question}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`px-2.5 py-1.5 rounded-lg border ${
                              i === q.correct
                                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                                : 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
                            }`}
                          >
                            <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => openEditModal(q)} className="v3-tugma text-xs py-1 px-2.5">
                        Tahrir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(q.id, q.question)}
                        className="v3-tugma text-xs py-1 px-2.5 text-rose-300"
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

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
            <span>
              Sahifa <strong className="text-[var(--v3-matn)]">{pagination.page}</strong> /{' '}
              {pagination.totalPages} · jami {pagination.total} ta
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page === 1}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Oldingi
              </button>
              <button
                type="button"
                onClick={() =>
                  setPagination((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
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
              {isEditing ? 'Savolni tahrirlash' : "Yangi savol qo'shish"}
            </h3>

            <div className="space-y-4">
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
                  <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Qiyinlik</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="v3-kiritish"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">Savol *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="v3-kiritish"
                  rows={3}
                  placeholder="[Cu(NH₃)₄]SO₄ ning IUPAC nomi qanday?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--v3-matn)] block">
                  Variantlar * (to&apos;g&apos;ri javob tugmasini belgilang)
                </label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, correct: i })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                        formData.correct === i
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)]'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="v3-kiritish flex-1"
                      placeholder={`${String.fromCharCode(65 + i)} variant`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                  Tushuntirish (ixtiyoriy)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="v3-kiritish"
                  rows={2}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--v3-matn)]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-amber-400"
                />
                <span>Faol (quizlarda ko&apos;rsatilsin)</span>
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
    </div>
  )
}