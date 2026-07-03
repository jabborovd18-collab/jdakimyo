// app/admin/molecules/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'oktaedr', name: '🔷 Oktaedr', color: 'purple', coordNumber: 6 },
  { id: 'tetraedr', name: '🔺 Tetraedr', color: 'blue', coordNumber: 4 },
  { id: 'kvadrat_tekislik', name: '⬜ Kvadrat tekislik', color: 'green', coordNumber: 4 },
  { id: 'chiziqli', name: '➖ Chiziqli', color: 'yellow', coordNumber: 2 },
  { id: 'trigonal_bipiramida', name: '🔻 Trigonal bipiramida', color: 'orange', coordNumber: 5 },
  { id: 'boshqa', name: '📦 Boshqa', color: 'gray', coordNumber: 0 }
]

const COLORS = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan']

const CENTRAL_ATOMS = ['Cu', 'Fe', 'Co', 'Ni', 'Pt', 'Pd', 'Cr', 'Mn', 'Zn', 'Ag', 'Au', 'Hg', 'Ru', 'Rh', 'Ir', 'Mo', 'W', 'V', 'Ti', 'Cd']

export default function AdminMoleculesPage() {
  const [molecules, setMolecules] = useState([])
  const [stats, setStats] = useState({ total: 0, featured: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [centralAtomFilter, setCentralAtomFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    formula: '',
    smiles: '',
    molData: '',
    pdbData: '',
    category: 'oktaedr',
    centralAtom: 'Cu',
    ligands: '',
    coordinationNumber: 6,
    geometry: '',
    description: '',
    color: 'blue',
    isFeatured: false,
    isActive: true,
    compoundId: ''
  })

  useEffect(() => {
    fetchMolecules()
  }, [categoryFilter, centralAtomFilter, search])

  const fetchMolecules = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        centralAtom: centralAtomFilter,
        search
      })
      
      const res = await fetch(`/api/admin/molecules?${params}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setMolecules(data.molecules)
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
      formula: '',
      smiles: '',
      molData: '',
      pdbData: '',
      category: 'oktaedr',
      centralAtom: 'Cu',
      ligands: '',
      coordinationNumber: 6,
      geometry: 'Oktaedr',
      description: '',
      color: 'blue',
      isFeatured: false,
      isActive: true,
      compoundId: ''
    })
    setShowModal(true)
  }

  const openEditModal = (m) => {
    setIsEditing(true)
    setFormData({
      id: m.id,
      name: m.name,
      formula: m.formula,
      smiles: m.smiles || '',
      molData: m.molData,
      pdbData: m.pdbData || '',
      category: m.category,
      centralAtom: m.centralAtom,
      ligands: m.ligands || '',
      coordinationNumber: m.coordinationNumber,
      geometry: m.geometry || '',
      description: m.description || '',
      color: m.color || 'blue',
      isFeatured: m.isFeatured,
      isActive: m.isActive,
      compoundId: m.compoundId || ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    // Validatsiya
    if (!formData.name.trim()) {
      toast.error('Nomini kiriting!')
      return
    }
    if (!formData.molData.trim()) {
      toast.error('MOL ma\'lumotlarini kiriting!')
      return
    }
    if (!formData.centralAtom) {
      toast.error('Markaziy atomni tanlang!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/molecules', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowModal(false)
      fetchMolecules()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Haqiqatan ham "${name}" ni o'chirmoqchimisiz?`)) return
    
    try {
      const res = await fetch(`/api/admin/molecules?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      fetchMolecules()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleFeatured = async (molecule) => {
    try {
      const res = await fetch('/api/admin/molecules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...molecule,
          isFeatured: !molecule.isFeatured
        })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(molecule.isFeatured ? '⭐ Tanlanganlardan olib tashlandi' : '⭐ Tanlanganlarga qo\'shildi')
      fetchMolecules()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // MOL fayl upload (file reader orqali)
  const handleMolFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData({ ...formData, molData: event.target.result })
      toast.success(`${file.name} yuklandi`)
    }
    reader.readAsText(file)
  }

  const getCategoryBadge = (cat) => {
    const c = CATEGORIES.find(c => c.id === cat)
    if (!c) return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    return `bg-${c.color}-600/20 text-${c.color}-400 border-${c.color}-600/30`
  }

  const getCategoryName = (cat) => CATEGORIES.find(c => c.id === cat)?.name || cat

  // Kategoriyalar bo'yicha guruhlash
  const groupedMolecules = molecules.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">🔷 3D Molekulalar</h1>
          <p className="text-purple-300 mt-1">Kompleks birikmalarning 3D tuzilmalari bazasi</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
        >
          <span>➕</span> Yangi Molekula
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-xl">🔷</div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-purple-400">Jami molekulalar</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center text-xl">⭐</div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.featured}</div>
              <div className="text-xs text-purple-400">Tanlangan</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-xl">🔷</div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.byCategory?.oktaedr || 0}</div>
              <div className="text-xs text-purple-400">Oktaedr</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center text-xl">⬜</div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.byCategory?.kvadrat_tekislik || 0}</div>
              <div className="text-xs text-purple-400">Kvadrat tekislik</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Nomi, formula yoki markaziy atom bo'yicha qidirish..."
            className="flex-1 min-w-[250px] px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">🔷 Barcha kategoriyalar</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={centralAtomFilter}
            onChange={(e) => setCentralAtomFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">⚛️ Barcha metallar</option>
            {CENTRAL_ATOMS.map(atom => (
              <option key={atom} value={atom}>{atom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Molecules */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : molecules.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
          <div className="text-6xl mb-4">🔷</div>
          <h3 className="text-xl font-bold text-white mb-2">Molekulalar yo'q</h3>
          <p className="text-purple-300 mb-4">Birinchi 3D molekulani qo'shing!</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ➕ Birinchi molekulani qo'shish
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.filter(cat => groupedMolecules[cat.id]?.length > 0).map(cat => (
            <div key={cat.id}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>{cat.name}</span>
                <span className="text-sm text-purple-400">({groupedMolecules[cat.id].length} ta)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedMolecules[cat.id].map((m) => (
                  <div
                    key={m.id}
                    className={`bg-slate-900/50 border rounded-xl p-5 hover:scale-105 transition-all ${
                      !m.isActive ? 'opacity-60 border-red-600/30' : `border-${m.color}-700/50 hover:border-${m.color}-500/50`
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-${m.color}-600/20 flex items-center justify-center text-2xl flex-shrink-0`}>
                        {CATEGORIES.find(c => c.id === m.category)?.name.split(' ')[0] || '🔷'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white mb-1 line-clamp-1">{m.name}</div>
                        <div className="text-xs text-purple-400 line-clamp-1">{m.formula}</div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleFeatured(m)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            m.isFeatured
                              ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                              : 'bg-purple-800/50 border border-purple-600/50 text-purple-400 hover:text-yellow-400'
                          }`}
                          title="Tanlangan"
                        >
                          {m.isFeatured ? '⭐' : '☆'}
                        </button>
                        <button
                          onClick={() => openEditModal(m)}
                          className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400"
                          title="Tahrirlash"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400"
                          title="O'chirish"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="bg-purple-950/50 rounded p-2">
                        <div className="text-purple-500">Markaziy atom</div>
                        <div className="font-bold text-white">{m.centralAtom}</div>
                      </div>
                      <div className="bg-purple-950/50 rounded p-2">
                        <div className="text-purple-500">K.S.</div>
                        <div className="font-bold text-white">{m.coordinationNumber}</div>
                      </div>
                    </div>

                    {m.ligands && (
                      <div className="text-xs text-purple-300 mb-2 line-clamp-1">
                        <span className="text-purple-500">Ligandlar:</span> {m.ligands}
                      </div>
                    )}

                    {m.description && (
                      <div className="text-xs text-purple-400 line-clamp-2 mb-2">
                        {m.description}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-800/30">
                      <span className={`px-2 py-0.5 rounded-full border ${getCategoryBadge(m.category)}`}>
                        {getCategoryName(m.category).split(' ').slice(1).join(' ')}
                      </span>
                      {!m.isActive && (
                        <span className="text-red-400">⚠️ O'chirilgan</span>
                      )}
                      {m.isFeatured && (
                        <span className="text-yellow-400">⭐ Tanlangan</span>
                      )}
                    </div>
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
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-4xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Molekulani tahrirlash' : '➕ Yangi 3D molekula'}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Name & Formula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Nomi (IUPAC) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none focus:border-yellow-500"
                    placeholder="Tetraamminmis(II) sulfat"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Formula</label>
                  <input
                    type="text"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="[Cu(NH₃)₄]SO₄"
                  />
                </div>
              </div>

              {/* Category & Central Atom */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = CATEGORIES.find(c => c.id === e.target.value)
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        coordinationNumber: cat?.coordNumber || formData.coordinationNumber,
                        geometry: cat?.name.split(' ').slice(1).join(' ') || ''
                      })
                    }}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Markaziy atom *</label>
                  <select
                    value={formData.centralAtom}
                    onChange={(e) => setFormData({ ...formData, centralAtom: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  >
                    {CENTRAL_ATOMS.map(atom => (
                      <option key={atom} value={atom}>{atom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Koordinatsion son</label>
                  <input
                    type="number"
                    value={formData.coordinationNumber}
                    onChange={(e) => setFormData({ ...formData, coordinationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    min="1"
                    max="12"
                  />
                </div>
              </div>

              {/* Ligands & Geometry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Ligandlar</label>
                  <input
                    type="text"
                    value={formData.ligands}
                    onChange={(e) => setFormData({ ...formData, ligands: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="NH₃, Cl⁻, H₂O"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Geometriya</label>
                  <input
                    type="text"
                    value={formData.geometry}
                    onChange={(e) => setFormData({ ...formData, geometry: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                    placeholder="Kvadrat tekislik"
                  />
                </div>
              </div>

              {/* SMILES (optional) */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">SMILES (ixtiyoriy)</label>
                <input
                  type="text"
                  value={formData.smiles}
                  onChange={(e) => setFormData({ ...formData, smiles: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none font-mono text-sm"
                  placeholder="[Cu+2].N.N.N.N.[O-]S([O-])(=O)=O"
                />
              </div>

              {/* MOL Data */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-purple-300">MOL/SDF ma'lumotlari *</label>
                  <label className="text-xs text-yellow-400 cursor-pointer hover:text-yellow-300 flex items-center gap-1">
                    <span>📁</span> Fayl yuklash
                    <input
                      type="file"
                      accept=".mol,.sdf,.pdb"
                      onChange={handleMolFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  value={formData.molData}
                  onChange={(e) => setFormData({ ...formData, molData: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none font-mono text-xs"
                  rows="6"
                  placeholder="MOL fayl matnini shu yerga joylashtiring yoki fayl yuklang..."
                />
                <p className="text-xs text-purple-500 mt-1">
                  💡 Maslahat: <a href="https://pubchem.ncbi.nlm.nih.gov/" target="_blank" className="text-yellow-400 hover:underline">PubChem</a> yoki <a href="https://www.chemspider.com/" target="_blank" className="text-yellow-400 hover:underline">ChemSpider</a> dan MOL faylni yuklab oling
                </p>
              </div>

              {/* PDB Data (optional) */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block">PDB ma'lumotlari (ixtiyoriy)</label>
                <textarea
                  value={formData.pdbData}
                  onChange={(e) => setFormData({ ...formData, pdbData: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none font-mono text-xs"
                  rows="4"
                  placeholder="PDB formatidagi ma'lumotlar..."
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
                  placeholder="Bu molekula haqida qisqacha ma'lumot..."
                />
              </div>

              {/* Color & Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-purple-300">⭐ Tanlangan (asosiy sahifada ko'rinsin)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-purple-300">✓ Faol</span>
                  </label>
                </div>
              </div>
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