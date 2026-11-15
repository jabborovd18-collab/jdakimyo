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

  const input = 'v3-kiritish text-sm'
  const label = 'text-xs font-semibold text-[var(--v3-matn)] mb-1 block'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 pb-5 border-b border-[var(--v3-chiziq)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)]">Reaksiyalar banki</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--v3-xira)]">
            {stats.total} ta reaksiya · {stats.verifiedCount} tasi tasdiqlangan (mobil ilova va qidiruv indeksi)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="v3-tugma v3-tugma-asosiy text-xs"
        >
          + Yangi reaksiya
        </button>
      </div>

      {stats.verifiedCount < stats.total && (
        <div className="v3-panel-karta border-amber-400/35 bg-amber-400/10 p-4 text-xs sm:text-sm text-amber-200">
          {stats.total - stats.verifiedCount} ta reaksiya hali tasdiqlanmagan. Ilovada ular
          &quot;kimyogar tasdiqlamagan&quot; belgisi bilan ko&apos;rinadi.
        </div>
      )}

      {/* Filtrlar */}
      <div className="v3-panel-karta p-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Qidirish (masalan, H2SO4 deb yozsangiz ham topiladi)"
          className={`${input} flex-1 min-w-[240px]`}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${input} w-auto`}
        >
          <option value="all">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
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
        <div className="v3-panel-karta py-12 text-center text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
      ) : reactions.length === 0 ? (
        <div className="v3-panel-karta py-12 text-center text-sm text-[var(--v3-xira)]">Hech narsa topilmadi</div>
      ) : (
        <div className="space-y-2.5">
          {reactions.map((reaction) => (
            <div
              key={reaction.id}
              className="v3-panel-karta p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--v3-matn)] text-sm break-words">
                  {reaction.equation}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]">
                    {reaction.category}
                  </span>
                  {reaction.temperature && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]">
                      {reaction.temperature}
                    </span>
                  )}
                  {reaction.scale && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]">
                      {reaction.scale}
                    </span>
                  )}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      reaction.isVerified
                        ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200'
                        : 'border-amber-400/40 bg-amber-400/15 text-amber-200'
                    }`}
                  >
                    {reaction.isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
                  </span>

                  {reaction.isVerified && (reaction.verifiedBy || reaction.verifiedAt) && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]">
                      {reaction.verifiedBy?.fullName || reaction.verifiedBy?.username || "noma'lum"}
                      {reaction.verifiedAt
                        ? ` · ${new Date(reaction.verifiedAt).toLocaleDateString('uz-UZ')}`
                        : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing({ ...EMPTY, ...reaction })}
                  className="v3-tugma text-xs py-1 px-2.5"
                >
                  Tahrir
                </button>
                <button
                  type="button"
                  onClick={() => remove(reaction)}
                  className="v3-tugma text-xs py-1 px-2.5 text-rose-300"
                >
                  O&apos;chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tahrirlash oynasi */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null) }}
        >
          <div
            className="v3-panel-karta p-5 sm:p-6 max-w-3xl mx-auto my-4 space-y-5 border-[var(--v3-chiziq-2)]"
            style={{ background: 'var(--v3-fon-2)' }}
          >
            <h3 className="text-lg font-bold text-[var(--v3-matn)]">
              {editing.id ? 'Reaksiyani tahrirlash' : 'Yangi reaksiya'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className={label}>Tenglama *</label>
                <input
                  value={editing.equation}
                  onChange={(e) => set('equation', e.target.value)}
                  placeholder="H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"
                  className={input}
                />
                <p className="text-[11px] text-[var(--v3-xira)] mt-1">
                  Indekssiz yozsangiz ham bo&apos;ladi — qidiruv indeksi avtomatik moslashtiradi.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Nomi</label>
                  <input value={editing.name || ''} onChange={(e) => set('name', e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Kategoriya</label>
                  <input
                    value={editing.category || ''}
                    onChange={(e) => set('category', e.target.value)}
                    placeholder="Asid-baza"
                    className={input}
                  />
                </div>
              </div>
              <div>
                <label className={label}>Tavsif</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => set('description', e.target.value)}
                  rows={2}
                  className={input}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--v3-urgu)] mb-2">
                Borish sharoiti
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['temperature', 'Harorat', '25°C'],
                  ['pressure', 'Bosim', '1 atm'],
                  ['catalyst', 'Katalizator', 'V₂O₅'],
                  ['environment', 'Muhit', 'kislotali'],
                ].map(([key, text, ph]) => (
                  <div key={key}>
                    <label className={label}>{text}</label>
                    <input value={editing[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={ph} className={input} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--v3-urgu)]">
                Mexanizm va oraliq moddalar
              </div>
              <div>
                <label className={label}>Mexanizm</label>
                <textarea
                  value={editing.mechanism || ''}
                  onChange={(e) => set('mechanism', e.target.value)}
                  rows={3}
                  className={input}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--v3-urgu)]">Erituvchi</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Eng samarali erituvchi</label>
                  <input value={editing.bestSolvent || ''} onChange={(e) => set('bestSolvent', e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Ko&apos;lam</label>
                  <select value={editing.scale || ''} onChange={(e) => set('scale', e.target.value)} className={input}>
                    <option value="">— tanlanmagan —</option>
                    {SCALES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Erituvchi ta&apos;siri</label>
                <textarea
                  value={editing.solventEffect || ''}
                  onChange={(e) => set('solventEffect', e.target.value)}
                  rows={2}
                  className={input}
                />
              </div>
            </div>

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
                <p className="text-[11px] text-[var(--v3-xira)] mt-1">{field.hint}</p>
              </div>
            ))}

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
                <p className="text-[11px] text-[var(--v3-xira)] mt-1">Har qatorda bittadan</p>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Kuzatiladigan belgilar</label>
                <textarea
                  value={editing.observations || ''}
                  onChange={(e) => set('observations', e.target.value)}
                  rows={2}
                  className={input}
                />
              </div>
              <div>
                <label className={label}>Unum</label>
                <input value={editing.yieldInfo || ''} onChange={(e) => set('yieldInfo', e.target.value)} className={input} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Manba</label>
                <input value={editing.source || ''} onChange={(e) => set('source', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Manba havolasi</label>
                <input value={editing.sourceUrl || ''} onChange={(e) => set('sourceUrl', e.target.value)} className={input} />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] p-3.5 space-y-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--v3-matn)]">
                <input
                  type="checkbox"
                  checked={Boolean(editing.isVerified)}
                  onChange={(e) => set('isVerified', e.target.checked)}
                  className="accent-emerald-400"
                />
                <span>Kimyoviy jihatdan tekshirdim va tasdiqlayman</span>
              </label>

              <p className="text-[11px] text-[var(--v3-xira)] pl-6">
                Belgilansa, tasdiqlagan foydalanuvchi va sana yoziladi; seed skripti tasdiqlangan
                yozuvni qayta yozmaydi.
              </p>

              {editing.verifiedAt && (
                <p className="text-[11px] text-emerald-300 pl-6">
                  Oxirgi tasdiq: {editing.verifiedBy?.fullName || editing.verifiedBy?.username || "noma'lum"} ·{' '}
                  {new Date(editing.verifiedAt).toLocaleString('uz-UZ')}
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-[var(--v3-chiziq)]">
              <button type="button" onClick={() => setEditing(null)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={save}
                disabled={isSaving}
                className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
              >
                {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
