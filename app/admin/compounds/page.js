// app/admin/compounds/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminCompoundsPage() {
  const [compounds, setCompounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    formula: '',
    name: '',
    centralAtom: '',
    ligands: '',
    coordinationNumber: 4,
    geometry: 'Oktaedr',
    oxidationState: 2,
    color: '',
    category: 'Kation',
    description: ''
  })

  useEffect(() => {
    fetchCompounds()
  }, [search, categoryFilter])

  const fetchCompounds = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search, category: categoryFilter })
      const res = await fetch(`/api/admin/compounds?${params}`)
      const data = await res.json()
      if (res.ok) setCompounds(data.compounds)
    } catch (err) {
      toast.error('Xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '', formula: '', name: '', centralAtom: '', ligands: '',
      coordinationNumber: 4, geometry: 'Oktaedr', oxidationState: 2,
      color: '', category: 'Kation', description: ''
    })
    setShowModal(true)
  }

  const openEditModal = (compound) => {
    setIsEditing(true)
    setFormData(compound)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.formula || !formData.name) {
      toast.error('Formula va Nomi majburiy!')
      return
    }
    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/compounds', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchCompounds()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, formula) => {
    if (!confirm(`Haqiqatan ham ${formula} ni o'chirmoqchimisiz?`)) return
    try {
      const res = await fetch(`/api/admin/compounds?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchCompounds()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const getCategoryBadge = (cat) => {
    if (cat === 'Kation') return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
    if (cat === 'Anion') return 'bg-red-600/20 text-red-400 border-red-600/30'
    return 'bg-green-600/20 text-green-400 border-green-600/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🧪 Birikmalar Boshqaruvi</h1>
          <p className="text-purple-300 mt-1">Kompleks birikmalar bazasini to'ldiring va tahrirlang</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
        >
          <span>➕</span> Yangi Birikma
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Formula, nomi yoki markaziy atom bo'yicha qidirish..."
          className="flex-1 px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-purple-500 outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
        >
          <option value="all">Barcha turlari</option>
          <option value="Kation">Kation</option>
          <option value="Anion">Anion</option>
          <option value="Neytral">Neytral</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-purple-300">⏳ Yuklanmoqda...</div>
        ) : compounds.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">🧪</div>
            <p className="text-purple-300">Hozircha birikmalar yo'q. Yangi qo'shing!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-950/50 border-b border-purple-800/50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Formula</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Nomi</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Markaziy Atom</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Geometriya</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Turi</th>
                  <th className="text-right p-4 text-sm font-semibold text-purple-300">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {compounds.map((c) => (
                  <tr key={c.id} className="border-b border-purple-800/30 hover:bg-purple-950/30 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-lg font-bold text-yellow-400">{c.formula}</span>
                    </td>
                    <td className="p-4 text-white text-sm">{c.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-800/50 rounded text-purple-200 text-xs font-bold">{c.centralAtom} ({c.oxidationState > 0 ? '+' : ''}{c.oxidationState})</span>
                    </td>
                    <td className="p-4 text-sm text-purple-300">{c.geometry} (K.S: {c.coordinationNumber})</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadge(c.category)}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400 transition-all"
                        >
                          ✏️ Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.formula)}
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

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Birikmani tahrirlash' : '➕ Yangi birikma qo\'shish'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Formula *</label>
                <input type="text" value={formData.formula} onChange={(e) => setFormData({...formData, formula: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500" placeholder="[Cu(NH3)4]SO4" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">IUPAC Nomi *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500" placeholder="Tetraamminmis(II) sulfat" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Markaziy Atom</label>
                <input type="text" value={formData.centralAtom} onChange={(e) => setFormData({...formData, centralAtom: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" placeholder="Cu" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Oksidlanish darajasi</label>
                <input type="number" value={formData.oxidationState} onChange={(e) => setFormData({...formData, oxidationState: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" placeholder="2" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Ligandlar</label>
                <input type="text" value={formData.ligands} onChange={(e) => setFormData({...formData, ligands: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" placeholder="NH3" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Koordinatsion son</label>
                <input type="number" value={formData.coordinationNumber} onChange={(e) => setFormData({...formData, coordinationNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" placeholder="4" />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Geometriya</label>
                <select value={formData.geometry} onChange={(e) => setFormData({...formData, geometry: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none">
                  <option>Oktaedr</option>
                  <option>Tetraedr</option>
                  <option>Kvadrat tekislik</option>
                  <option>Chiziqli</option>
                  <option>Trigonal bipiramida</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Turi (Kategoriya)</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none">
                  <option>Kation</option>
                  <option>Anion</option>
                  <option>Neytral</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Rangi</label>
                <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" placeholder="Ko'k" />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-purple-300 mb-1 block">Qo'shimcha ma'lumot (Tavsif)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none" rows="3" placeholder="Fizik xossalari, olinishi yoki qo'llanilishi..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all">
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg disabled:opacity-50 transition-all">
                {isSaving ? '⏳ Saqlanmoqda...' : (isEditing ? '✓ Yangilash' : '✓ Saqlash')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}