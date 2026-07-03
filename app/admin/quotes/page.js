// app/admin/quotes/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'motivation', name: '💪 Motivatsion', color: 'yellow' },
  { id: 'science', name: '🔬 Ilmiy', color: 'blue' },
  { id: 'history', name: '📜 Tarixiy', color: 'purple' },
  { id: 'humor', name: '😄 Hazil', color: 'pink' },
  { id: 'advice', name: '💡 Maslahat', color: 'green' }
]

const COLORS = ['purple', 'blue', 'green', 'yellow', 'pink', 'red', 'orange', 'teal']

const ICONS = ['💡', '💪', '🔬', '📜', '😄', '🎯', '⭐', '🏆', '🚀', '✨', '🧪', '⚗️', '🔥', '💎', '🌟']

const DEFAULT_QUOTES = [
  {
    textUz: "Kimyo — bu tabiatning sirli tillarini o'rganish san'atidir.",
    author: "D.I. Mendeleyev",
    authorInfo: "Davriy jadval yaratuvchisi (1834-1907)",
    category: "science",
    icon: "🔬",
    color: "blue"
  },
  {
    textUz: "Har bir muvaffaqiyat — bu minglab kichik urinishlar natijasidir.",
    author: "A.S. Pushkin",
    category: "motivation",
    icon: "💪",
    color: "yellow"
  },
  {
    textUz: "Laboratoriyada o'tkazilgan bir soat — kutubxonada o'qilgan bir haftaga teng.",
    author: "M.V. Lomonosov",
    authorInfo: "Rus olimi, Moskva universitati asoschisi",
    category: "science",
    icon: "🧪",
    color: "purple"
  },
  {
    textUz: "Kimyogar bo'lish uchun avvalo sabrli bo'lish kerak.",
    author: "Antoine Lavoisier",
    authorInfo: "Zamonaviy kimyo otasi (1743-1794)",
    category: "advice",
    icon: "💡",
    color: "green"
  },
  {
    textUz: "Fan — bu doimiy savol berish san'atidir.",
    author: "Albert Einstein",
    category: "science",
    icon: "🎯",
    color: "blue"
  },
  {
    textUz: "Muvaffaqiyat — bu 1% iste'dod va 99% mehnat.",
    author: "Thomas Edison",
    category: "motivation",
    icon: "💪",
    color: "yellow"
  },
  {
    textUz: "Eng yaxshi tajriba — bu xatolardan o'rganishdir.",
    author: "Marie Curie",
    authorInfo: "Ikki karra Nobel mukofoti sovrindori",
    category: "advice",
    icon: "⭐",
    color: "pink"
  },
  {
    textUz: "Kimyo — bu moddalarning o'zgarish haqidagi fandir.",
    author: "N.N. Zinin",
    category: "science",
    icon: "🔬",
    color: "blue"
  },
  {
    textUz: "Har kuni bir qadam oldinga — bu ham progress.",
    author: "Xalq maqoli",
    category: "motivation",
    icon: "🚀",
    color: "green"
  },
  {
    textUz: "Bilim — bu kuch, lekin uni to'g'ri ishlatish kerak.",
    author: "Abu Ali Ibn Sino",
    authorInfo: "Buyuk tabib va olim (980-1037)",
    category: "advice",
    icon: "💎",
    color: "purple"
  }
]

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    textUz: '',
    textEn: '',
    author: '',
    authorInfo: '',
    category: 'motivation',
    tags: [],
    icon: '💡',
    color: 'purple',
    isActive: true,
    displayDate: ''
  })

  useEffect(() => {
    fetchQuotes()
  }, [categoryFilter, search])

  const fetchQuotes = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        search
      })
      const res = await fetch(`/api/admin/quotes?${params}`)
      const data = await res.json()
      if (res.ok) {
        setQuotes(data.quotes)
        setStats(data.stats)
      }
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 10 ta default gapni yuklash
  const handleSeed = async () => {
    if (!confirm('10 ta standart gapni yuklamoqchimisiz?')) return
    
    let created = 0
    for (const quote of DEFAULT_QUOTES) {
      try {
        const res = await fetch('/api/admin/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quote)
        })
        if (res.ok) created++
      } catch {}
    }
    
    toast.success(`✓ ${created} ta gap qo'shildi`)
    fetchQuotes()
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      textUz: '',
      textEn: '',
      author: '',
      authorInfo: '',
      category: 'motivation',
      tags: [],
      icon: '💡',
      color: 'purple',
      isActive: true,
      displayDate: ''
    })
    setShowModal(true)
  }

  const openEditModal = (quote) => {
    setIsEditing(true)
    setFormData({
      id: quote.id,
      textUz: quote.textUz,
      textEn: quote.textEn || '',
      author: quote.author,
      authorInfo: quote.authorInfo || '',
      category: quote.category,
      tags: quote.tags || [],
      icon: quote.icon || '💡',
      color: quote.color || 'purple',
      isActive: quote.isActive,
      displayDate: quote.displayDate ? new Date(quote.displayDate).toISOString().split('T')[0] : ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.textUz.trim()) {
      toast.error('Gapni kiriting!')
      return
    }
    if (!formData.author.trim()) {
      toast.error('Muallifni kiriting!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/quotes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowModal(false)
      fetchQuotes()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, text) => {
    if (!confirm(`"${text.substring(0, 50)}..." ni o'chirmoqchimisiz?`)) return
    try {
      const res = await fetch(`/api/admin/quotes?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchQuotes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCategoryBadge = (category) => {
    const c = CATEGORIES.find(c => c.id === category)
    if (!c) return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    return `bg-${c.color}-600/20 text-${c.color}-400 border-${c.color}-600/30`
  }

  const getCategoryName = (category) => {
    return CATEGORIES.find(c => c.id === category)?.name || category
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">💬 Motivatsion Gaplar</h1>
          <p className="text-purple-300 mt-1">Foydalanuvchilar uchun kunlik iqtiboslar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>⚡</span> 10 ta standart
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>➕</span> Yangi gap
          </button>
        </div>
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
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Gap yoki muallif bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">📚 Barcha kategoriyalar</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotes Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">Gaplar yo'q</h3>
          <p className="text-purple-300 mb-4">10 ta standart gapni yuklang yoki yangi qo'shing</p>
          <button
            onClick={handleSeed}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ⚡ 10 ta standart gapni yuklash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`bg-slate-900/50 border border-${quote.color}-700/50 rounded-xl p-5 hover:border-${quote.color}-500/50 transition-all group ${
                !quote.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-${quote.color}-600/20 flex items-center justify-center text-2xl flex-shrink-0`}>
                  {quote.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryBadge(quote.category)}`}>
                      {getCategoryName(quote.category)}
                    </span>
                    {quote.displayDate && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                        📅 {new Date(quote.displayDate).toLocaleDateString('uz-UZ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(quote)}
                    className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(quote.id, quote.textUz)}
                    className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <blockquote className="text-white text-sm leading-relaxed mb-3 italic">
                "{quote.textUz}"
              </blockquote>

              <div className="border-t border-purple-800/30 pt-3">
                <div className="font-semibold text-white text-sm">{quote.author}</div>
                {quote.authorInfo && (
                  <div className="text-xs text-purple-400 mt-1 line-clamp-1">{quote.authorInfo}</div>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-800/30 text-xs">
                <span className="text-purple-500">👁️ {quote.timesShown} marta ko'rsatilgan</span>
                {!quote.isActive && (
                  <span className="text-red-400">⚠️ O'chirilgan</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Gapni tahrirlash' : '➕ Yangi gap qo\'shish'}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Gap (O'zbekcha) */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Gap (O'zbekcha) *</label>
                <textarea
                  value={formData.textUz}
                  onChange={(e) => setFormData({ ...formData, textUz: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  rows="3"
                  placeholder="Kimyo — bu tabiatning sirli tillarini o'rganish san'atidir."
                />
              </div>

              {/* Gap (Inglizcha) */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Gap (Inglizcha - ixtiyoriy)</label>
                <textarea
                  value={formData.textEn}
                  onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  rows="2"
                  placeholder="Chemistry is the art of learning the mysterious languages of nature."
                />
              </div>

              {/* Muallif */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Muallif *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="D.I. Mendeleyev"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Muallif haqida</label>
                  <input
                    type="text"
                    value={formData.authorInfo}
                    onChange={(e) => setFormData({ ...formData, authorInfo: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="Davriy jadval yaratuvchisi (1834-1907)"
                  />
                </div>
              </div>

              {/* Kategoriya */}
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

              {/* Maxsus sana */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">
                  Maxsus sana (ixtiyoriy - bo'sh qoldirilsa tasodifiy ko'rsatiladi)
                </label>
                <input
                  type="date"
                  value={formData.displayDate}
                  onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                />
              </div>

              {/* Ikonka */}
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

              {/* Rang */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Rang</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg bg-${color}-500 transition-all flex items-center justify-center ${
                        formData.color === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {formData.color === color && <span className="text-white font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faol */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-purple-300">✓ Faol (foydalanuvchilarga ko'rinsin)</span>
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
    </div>
  )
}