// app/admin/analysis/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'klassik', name: '🧪 Klassik', color: 'blue' },
  { id: 'instrumental', name: '📊 Instrumental', color: 'purple' },
  { id: 'elektrokimyoviy', name: '⚡ Elektrokimyoviy', color: 'yellow' },
  { id: 'spektral', name: '🌈 Spektral', color: 'pink' },
  { id: 'xromatografik', name: '🔬 Xromatografik', color: 'green' },
  { id: 'termik', name: '🔥 Termik', color: 'orange' },
  { id: 'boshqa', name: '📦 Boshqa', color: 'gray' }
]

const ICONS = ['🔬', '🧪', '⚗️', '🧫', '📊', '📈', '📉', '⚡', '🔥', '❄️', '💧', '🌡️', '⚖️', '🔋', '💡', '🌈', '🔭', '🧲', '⚙️', '🔧']

const COLORS = [
  { id: 'blue', name: 'Ko\'k', class: 'bg-blue-500' },
  { id: 'purple', name: 'Binafsha', class: 'bg-purple-500' },
  { id: 'pink', name: 'Pushti', class: 'bg-pink-500' },
  { id: 'red', name: 'Qizil', class: 'bg-red-500' },
  { id: 'orange', name: 'To\'q sariq', class: 'bg-orange-500' },
  { id: 'yellow', name: 'Sariq', class: 'bg-yellow-500' },
  { id: 'green', name: 'Yashil', class: 'bg-green-500' },
  { id: 'teal', name: 'Zangori', class: 'bg-teal-500' },
  { id: 'cyan', name: 'Havo rang', class: 'bg-cyan-500' },
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' }
]

export default function AdminAnalysisPage() {
  const [methods, setMethods] = useState([])
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
    name: '',
    nameUz: '',
    nameEn: '',
    category: 'klassik',
    description: '',
    application: '',
    advantages: '',
    disadvantages: '',
    accuracy: 'O\'rta',
    cost: 'O\'rta',
    time: 'O\'rta',
    icon: '🔬',
    color: 'blue',
    isActive: true
  })

  useEffect(() => {
    fetchMethods()
  }, [categoryFilter, search])

  const fetchMethods = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        search
      })
      
      const res = await fetch(`/api/admin/analysis?${params}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setMethods(data.methods)
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
      name: '',
      nameUz: '',
      nameEn: '',
      category: 'klassik',
      description: '',
      application: '',
      advantages: '',
      disadvantages: '',
      accuracy: 'O\'rta',
      cost: 'O\'rta',
      time: 'O\'rta',
      icon: '🔬',
      color: 'blue',
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (method) => {
    setIsEditing(true)
    setFormData({
      id: method.id,
      name: method.name,
      nameUz: method.nameUz || method.name,
      nameEn: method.nameEn || '',
      category: method.category,
      description: method.description || '',
      application: method.application || '',
      advantages: method.advantages || '',
      disadvantages: method.disadvantages || '',
      accuracy: method.accuracy || 'O\'rta',
      cost: method.cost || 'O\'rta',
      time: method.time || 'O\'rta',
      icon: method.icon || '🔬',
      color: method.color || 'blue',
      isActive: method.isActive
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nomini kiriting!')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Tavsifini kiriting!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/analysis', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchMethods()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Haqiqatan ham "${name}" ni o'chirmoqchimisiz?`)) return
    
    try {
      const res = await fetch(`/api/admin/analysis?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchMethods()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCategoryBadge = (cat) => {
    const c = CATEGORIES.find(c => c.id === cat)
    if (!c) return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    return `bg-${c.color}-600/20 text-${c.color}-400 border-${c.color}-600/30`
  }

  const getCategoryName = (cat) => {
    return CATEGORIES.find(c => c.id === cat)?.name || cat
  }

  // Kategoriyalar bo'yicha guruhlash
  const groupedMethods = methods.reduce((acc, method) => {
    if (!acc[method.category]) acc[method.category] = []
    acc[method.category].push(method)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🔬 Tahlil Usullari</h1>
          <p className="text-purple-300 mt-1">Kompleks birikmalarni tahlil qilish usullari bazasi</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2"
        >
          <span>➕</span> Yangi Usul
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id}
            className={`bg-slate-900/50 border border-purple-800/50 rounded-xl p-3 cursor-pointer transition-all hover:border-${cat.color}-500/50 ${
              categoryFilter === cat.id ? `ring-2 ring-${cat.color}-500` : ''
            }`}
            onClick={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
          >
            <div className="text-lg mb-1">{cat.name.split(' ')[0]}</div>
            <div className="text-xl font-bold text-white">{stats[cat.id] || 0}</div>
            <div className="text-xs text-purple-400 truncate">{cat.name.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tahlil usuli nomi yoki tavsifi bo'yicha qidirish..."
            className="flex-1 px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
          />
          {(categoryFilter !== 'all' || search) && (
            <button
              onClick={() => { setCategoryFilter('all'); setSearch('') }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm"
            >
              ✕ Tozalash
            </button>
          )}
        </div>
        <div className="mt-3 text-sm text-purple-400">
          Jami: <span className="text-white font-bold">{methods.length}</span> ta tahlil usuli
        </div>
      </div>

      {/* Methods Grid - Kategoriyalar bo'yicha guruhlangan */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : Object.keys(groupedMethods).length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-bold text-white mb-2">Tahlil usullari yo'q</h3>
          <p className="text-purple-300 mb-4">Birinchi tahlil usulini qo'shing!</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ➕ Birinchi usulni qo'shish
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMethods).map(([category, categoryMethods]) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>{getCategoryName(category)}</span>
                <span className="text-sm text-purple-400">({categoryMethods.length} ta)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`bg-slate-900/50 border border-purple-800/50 rounded-xl p-5 hover:border-${method.color}-500/50 transition-all group ${
                      !method.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-${method.color}-600/20 flex items-center justify-center text-2xl flex-shrink-0`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white mb-1 line-clamp-1">{method.name}</div>
                        {method.nameUz && method.nameUz !== method.name && (
                          <div className="text-xs text-purple-400 line-clamp-1">{method.nameUz}</div>
                        )}
                        {method.nameEn && (
                          <div className="text-xs text-purple-500 italic line-clamp-1">{method.nameEn}</div>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(method)}
                          className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400 transition-all"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(method.id, method.name)}
                          className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-purple-300 line-clamp-2 mb-3">
                      {method.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {method.accuracy && (
                        <div className="bg-purple-950/50 rounded-lg p-2 text-center">
                          <div className="text-purple-500 mb-1">Aniqlik</div>
                          <div className={`font-bold ${
                            method.accuracy === 'Yuqori' ? 'text-green-400' :
                            method.accuracy === 'Past' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {method.accuracy}
                          </div>
                        </div>
                      )}
                      {method.cost && (
                        <div className="bg-purple-950/50 rounded-lg p-2 text-center">
                          <div className="text-purple-500 mb-1">Narxi</div>
                          <div className={`font-bold ${
                            method.cost === 'Arzon' ? 'text-green-400' :
                            method.cost === 'Qimmat' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {method.cost}
                          </div>
                        </div>
                      )}
                      {method.time && (
                        <div className="bg-purple-950/50 rounded-lg p-2 text-center">
                          <div className="text-purple-500 mb-1">Vaqt</div>
                          <div className={`font-bold ${
                            method.time === 'Tez' ? 'text-green-400' :
                            method.time === 'Sekin' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {method.time}
                          </div>
                        </div>
                      )}
                    </div>

                    {!method.isActive && (
                      <div className="mt-3 text-xs text-red-400 bg-red-600/10 border border-red-600/30 rounded-lg px-2 py-1 text-center">
                        ⚠️ O'chirilgan
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-3xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Tahlil usulini tahrirlash' : '➕ Yangi tahlil usuli'}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Nomi (asosiy) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                    placeholder="Gravimetrik tahlil"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Kategoriya *</label>
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
              </div>

              {/* Name translations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">O'zbekcha nomi</label>
                  <input
                    type="text"
                    value={formData.nameUz}
                    onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="Og'irlik usuli"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Inglizcha nomi</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="Gravimetric analysis"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tavsif *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                  rows="3"
                  placeholder="Bu usulning qisqacha tavsifi..."
                />
              </div>

              {/* Application */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Qo'llanilishi</label>
                <textarea
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  rows="2"
                  placeholder="Qaysi kompleks birikmalar uchun qo'llaniladi?"
                />
              </div>

              {/* Advantages & Disadvantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">✅ Afzalliklari</label>
                  <textarea
                    value={formData.advantages}
                    onChange={(e) => setFormData({ ...formData, advantages: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    rows="3"
                    placeholder="Yuqori aniqlik, oddiy..."
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">❌ Kamchiliklari</label>
                  <textarea
                    value={formData.disadvantages}
                    onChange={(e) => setFormData({ ...formData, disadvantages: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    rows="3"
                    placeholder="Uzoq vaqt talab qiladi..."
                  />
                </div>
              </div>

              {/* Accuracy, Cost, Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">🎯 Aniqlik</label>
                  <select
                    value={formData.accuracy}
                    onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    <option value="Yuqori">Yuqori</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">💰 Narxi</label>
                  <select
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    <option value="Arzon">Arzon</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Qimmat">Qimmat</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">⏱️ Vaqt</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    <option value="Tez">Tez</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Sekin">Sekin</option>
                  </select>
                </div>
              </div>

              {/* Icon Selection */}
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

              {/* Color Selection */}
              <div>
                <label className="text-sm text-purple-300 mb-2 block">Rang</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.id })}
                      className={`w-10 h-10 rounded-lg ${color.class} transition-all flex items-center justify-center ${
                        formData.color === color.id
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={color.name}
                    >
                      {formData.color === color.id && <span className="text-white font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-purple-300">Faol (foydalanuvchilarga ko'rinsin)</span>
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