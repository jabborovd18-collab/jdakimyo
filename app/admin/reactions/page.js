// app/admin/reactions/page.js
"use client"
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const SCALES = ['laboratoriya', 'sanoat', 'ikkalasi', 'nazariy']

// Ro'yxat ko'rinishidagi maydonlar: bittada bitta qator
const LIST_FIELDS = [
  { key: 'techniques', label: 'Texnikalar', hint: 'Qaytar sovutgich, Distillash...' },
  { key: 'equipment', label: 'Uskunalar', hint: 'Kolba, Termometr...' },
  { key: 'hazards', label: 'Xavfsizlik ogohlantirishlari', hint: 'Kuchli korroziv...' },
]

// Obyektlar ro'yxati: "a | b" ko'rinishida kiritiladi
const PAIR_FIELDS = [
  {
    key: 'intermediates',
    label: 'Oraliq moddalar',
    cols: ['formula', 'note'],
    hint: 'Har qatorda:  formula | izoh',
  },
  {
    key: 'solvents',
    label: 'Erituvchilar va samaradorlik',
    cols: ['name', 'efficiency'],
    hint: 'Har qatorda:  erituvchi | samaradorlik',
  },
  {
    key: 'rateFactors',
    label: 'Tezlikni oshirish omillari',
    cols: ['factor', 'effect'],
    hint: 'Har qatorda:  omil | ta\'siri',
  },
]

const EMPTY = {
  equation: '', name: '', description: '', category: '', reactionType: '',
  temperature: '', pressure: '', catalyst: '', environment: '',
  mechanism: '', bestSolvent: '', solventEffect: '',
  scale: '', scaleNote: '', observations: '', yieldInfo: '',
  source: '', sourceUrl: '', isVerified: false, isActive: true,
  techniques: [], equipment: [], hazards: [],
  intermediates: [], solvents: [], rateFactors: [],
}

/** ["a","b"] <-> "a\nb" */
const listToText = (value) => (Array.isArray(value) ? value.join('\n') : '')
const textToList = (text) =>
  text.split('\n').map((line) => line.trim()).filter(Boolean)

/** [{a,b}] <-> "a | b" qatorlari */
const pairsToText = (value, cols) =>
  Array.isArray(value)
    ? value.map((item) => cols.map((c) => item?.[c] ?? '').join(' | ')).join('\n')
    : ''

const textToPairs = (text, cols) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim())
      const obj = {}
      cols.forEach((col, index) => {
        if (parts[index]) obj[col] = parts[index]
      })
      return obj
    })
    .filter((obj) => Object.keys(obj).length > 0)

export default function AdminReactionsPage() {
  const [reactions, setReactions] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total: 0, verifiedCount: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')

  const [editing, setEditing] = useState(null) // null | {…} (yangi uchun EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q: search,
        category: categoryFilter,
        verified: verifiedFilter,
      })
      const response = await fetch(`/api/admin/reactions?${params}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setReactions(data.reactions)
      setCategories(data.categories)
      setStats({ total: data.total, verifiedCount: data.verifiedCount })
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [search, categoryFilter, verifiedFilter])

  useEffect(() => {
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [load])

  const save = async () => {
    if (!editing.equation?.trim()) {
      toast.error('Tenglama majburiy')
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/reactions', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success(editing.id ? '✓ Yangilandi' : '✓ Qo\'shildi')
      setEditing(null)
      load()
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async (reaction) => {
    if (!confirm(`"${reaction.equation}" o'chirilsinmi?`)) return
    try {
      const response = await fetch(`/api/admin/reactions?id=${reaction.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      toast.success('✓ O\'chirildi')
      load()
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    }
  }

  const set = (key, value) => setEditing((prev) => ({ ...prev, [key]: value }))

  const input = 'w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm focus:border-yellow-500 outline-none'
  const label = 'text-xs text-purple-300 mb-1 block'

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">⚗️ Reaksiyalar</h1>
          <p className="text-purple-300 text-sm">
            {stats.total} ta reaksiya · {stats.verifiedCount} tasi tasdiqlangan
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm"
        >
          ➕ Yangi reaksiya
        </button>
      </div>

      {/* To'ldirilmagan ma'lumot haqida eslatma */}
      {stats.verifiedCount < stats.total && (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
          <p className="text-sm text-amber-300">
            ⚠️ {stats.total - stats.verifiedCount} ta reaksiya hali tasdiqlanmagan.
            Ilovada ular &quot;kimyogar tasdiqlamagan&quot; belgisi bilan ko&apos;rinadi.
          </p>
        </div>
      )}

      {/* Filtrlar */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Qidirish (H2SO4 deb yozsangiz ham topiladi)"
          className={`${input} flex-1 min-w-[240px]`}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${input} w-auto`}
        >
          <option value="all">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
          ))}
        </select>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className={`${input} w-auto`}
        >
          <option value="all">Hammasi</option>
          <option value="no">Tasdiqlanmagan</option>
          <option value="yes">Tasdiqlangan</option>
        </select>
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-400">Yuklanmoqda...</div>
      ) : reactions.length === 0 ? (
        <div className="text-center py-12 text-purple-400">Hech narsa topilmadi</div>
      ) : (
        <div className="space-y-2">
          {reactions.map((reaction) => (
            <div
              key={reaction.id}
              className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm break-words">
                  {reaction.equation}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-purple-800/50 rounded-full text-purple-300">
                    {reaction.category}
                  </span>
                  {reaction.temperature && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-950/50 border border-purple-700/50 rounded-full text-purple-400">
                      🌡 {reaction.temperature}
                    </span>
                  )}
                  {reaction.scale && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-950/50 border border-purple-700/50 rounded-full text-purple-400">
                      {reaction.scale}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      reaction.isVerified
                        ? 'bg-green-600/20 text-green-400 border-green-600/30'
                        : 'bg-amber-600/20 text-amber-400 border-amber-600/30'
                    }`}
                  >
                    {reaction.isVerified ? '✓ tasdiqlangan' : 'tasdiqlanmagan'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditing({ ...EMPTY, ...reaction })}
                  className="px-3 py-1.5 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-xs text-white"
                >
                  ✏️
                </button>
                <button
                  onClick={() => remove(reaction)}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tahrirlash oynasi */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-3xl mx-auto my-4 space-y-5">
            <h3 className="text-xl font-bold text-white">
              {editing.id ? 'Reaksiyani tahrirlash' : 'Yangi reaksiya'}
            </h3>

            {/* Asosiy */}
            <div className="space-y-3">
              <div>
                <label className={label}>Tenglama *</label>
                <input
                  value={editing.equation}
                  onChange={(e) => set('equation', e.target.value)}
                  placeholder="H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"
                  className={input}
                />
                <p className="text-[10px] text-purple-500 mt-1">
                  Indekssiz yozsangiz ham bo&apos;ladi — qidiruv ikkalasini ham topadi
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Nomi</label>
                  <input value={editing.name || ''} onChange={(e) => set('name', e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Kategoriya</label>
                  <input value={editing.category || ''} onChange={(e) => set('category', e.target.value)} placeholder="Asid-baza" className={input} />
                </div>
              </div>
              <div>
                <label className={label}>Tavsif</label>
                <textarea value={editing.description || ''} onChange={(e) => set('description', e.target.value)} rows={2} className={input} />
              </div>
            </div>

            {/* Sharoit */}
            <div>
              <div className="text-sm font-semibold text-yellow-400 mb-2">🌡 Borish sharoiti</div>
              <div className="grid grid-cols-2 gap-3">
                {[['temperature','Harorat','25°C'],['pressure','Bosim','1 atm'],['catalyst','Katalizator','V₂O₅'],['environment','Muhit','kislotali']].map(([key,text,ph]) => (
                  <div key={key}>
                    <label className={label}>{text}</label>
                    <input value={editing[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={ph} className={input} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mexanizm */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-yellow-400">⚛️ Mexanizm va oraliq moddalar</div>
              <div>
                <label className={label}>Mexanizm</label>
                <textarea value={editing.mechanism || ''} onChange={(e) => set('mechanism', e.target.value)} rows={3} className={input} />
              </div>
            </div>

            {/* Erituvchi */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-yellow-400">🧪 Erituvchi</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Eng samarali erituvchi</label>
                  <input value={editing.bestSolvent || ''} onChange={(e) => set('bestSolvent', e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Ko&apos;lam</label>
                  <select value={editing.scale || ''} onChange={(e) => set('scale', e.target.value)} className={input}>
                    <option value="">— tanlanmagan —</option>
                    {SCALES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Erituvchi ta&apos;siri</label>
                <textarea value={editing.solventEffect || ''} onChange={(e) => set('solventEffect', e.target.value)} rows={2} className={input} />
              </div>
            </div>

            {/* Juftlik maydonlari */}
            {PAIR_FIELDS.map((field) => (
              <div key={field.key}>
                <label className={label}>{field.label}</label>
                <textarea
                  value={pairsToText(editing[field.key], field.cols)}
                  onChange={(e) => set(field.key, textToPairs(e.target.value, field.cols))}
                  rows={3}
                  placeholder={field.hint}
                  className={input}
                />
                <p className="text-[10px] text-purple-500 mt-1">{field.hint}</p>
              </div>
            ))}

            {/* Ro'yxat maydonlari */}
            {LIST_FIELDS.map((field) => (
              <div key={field.key}>
                <label className={label}>{field.label}</label>
                <textarea
                  value={listToText(editing[field.key])}
                  onChange={(e) => set(field.key, textToList(e.target.value))}
                  rows={2}
                  placeholder={field.hint}
                  className={input}
                />
                <p className="text-[10px] text-purple-500 mt-1">Har qatorda bittadan</p>
              </div>
            ))}

            {/* Qolgan */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Kuzatiladigan belgilar</label>
                <textarea value={editing.observations || ''} onChange={(e) => set('observations', e.target.value)} rows={2} className={input} />
              </div>
              <div>
                <label className={label}>Unum</label>
                <input value={editing.yieldInfo || ''} onChange={(e) => set('yieldInfo', e.target.value)} className={input} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Manba</label>
                <input value={editing.source || ''} onChange={(e) => set('source', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Manba havolasi</label>
                <input value={editing.sourceUrl || ''} onChange={(e) => set('sourceUrl', e.target.value)} className={input} />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editing.isVerified)}
                onChange={(e) => set('isVerified', e.target.checked)}
                className="accent-green-500"
              />
              <span className="text-sm text-white">
                Kimyoviy jihatdan tekshirdim va tasdiqlayman
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-white"
              >
                Bekor qilish
              </button>
              <button
                onClick={save}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg disabled:opacity-50"
              >
                {isSaving ? '⏳...' : '✓ Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
