// app/admin/quotes/page.js
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sana } from '@/lib/sana'
import {
  AdminBadge,
  AdminEmpty,
  AdminLoading,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
} from '@/components/admin/AdminUI'

const CATEGORIES = [
  { id: 'motivation', name: 'Motivatsiya', tone: 'primary' },
  { id: 'chemistry', name: 'Kimyo', tone: 'info' },
  { id: 'wisdom', name: 'Hikmat', tone: 'accent' },
  { id: 'study', name: "O'qish", tone: 'success' },
  { id: 'advice', name: 'Maslahat', tone: 'warning' },
]

const QUOTE_COLOR_CARD = {
  purple: 'border-indigo-400/35',
  blue: 'border-sky-400/35',
  green: 'border-emerald-400/35',
  yellow: 'border-amber-400/35',
  pink: 'border-rose-400/35',
  red: 'border-rose-400/35',
  indigo: 'border-indigo-400/35',
  cyan: 'border-sky-400/35',
}

const QUOTE_COLOR_SWATCH = {
  purple: 'bg-indigo-500',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  pink: 'bg-rose-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-600',
  cyan: 'bg-cyan-500',
}

const ICONS = ['💡', '⚗️', '🚀', '💎', '📚', '⭐', '🔥', '🧪', '🎯', '🌟']
const COLORS = ['purple', 'blue', 'green', 'yellow', 'pink', 'cyan']

const DEFAULT_QUOTES = [
  {
    textUz: "Kimyo — bu tabiatning sirli tillarini o'rganish san'atidir.",
    author: 'D.I. Mendeleyev',
    authorInfo: 'Davriy jadval yaratuvchisi (1834-1907)',
    category: 'chemistry',
    icon: '⚗️',
    color: 'blue',
  },
  {
    textUz: "Har kuni bir foiz yaxshiroq bo'lish — yil oxirida 37 barobar o'sish demakdir.",
    author: 'Jeyms Klir',
    authorInfo: 'Atomic Habits muallifi',
    category: 'motivation',
    icon: '🚀',
    color: 'green',
  },
  {
    textUz: "Hech narsa yo'qolmaydi va hech narsa yo'qdan paydo bo'lmaydi, faqat bir shakldan ikkinchisiga o'tadi.",
    author: 'M.V. Lomonosov',
    authorInfo: 'Massaning saqlanish qonuni asoschisi',
    category: 'chemistry',
    icon: '🧪',
    color: 'cyan',
  },
  {
    textUz: "Ilm — insonning eng ishonchli qanotidir; qayerga bormasin, uni yuksaltiradi.",
    author: 'Alisher Navoiy',
    authorInfo: 'Mutafakkir shoir (1441-1501)',
    category: 'wisdom',
    icon: '📚',
    color: 'yellow',
  },
  {
    textUz: "Xatolar — tajriba yig'ishning eng qisqa yo'li. Muhimi, har safar xulosa chiqarishdir.",
    author: 'Mariya Kyuri',
    authorInfo: 'Ikki karra Nobel mukofoti sohibasi',
    category: 'motivation',
    icon: '⭐',
    color: 'purple',
  },
  {
    textUz: "Bugun o'qilgan bitta mavzu ertangi murakkab masalaning kaliti bo'ladi.",
    author: 'JDA KIMYO',
    authorInfo: 'Platforma eslatmasi',
    category: 'study',
    icon: '🎯',
    color: 'blue',
  },
  {
    textUz: "Haqiqiy olim savol berishdan qo'rqmaydi, chunki har bir kashfiyot savoldan boshlanadi.",
    author: 'Laynus Poling',
    authorInfo: 'Kimyo bog\'lari nazariyotchisi',
    category: 'chemistry',
    icon: '💡',
    color: 'yellow',
  },
  {
    textUz: "Sabr va izchillik har qanday qiyin formuladan kuchliroqdir.",
    author: 'Xalq hikmati',
    authorInfo: '',
    category: 'advice',
    icon: '🔥',
    color: 'pink',
  },
  {
    textUz: "Intizom iste'dod yetmagan joyda yo'l ochib beradi.",
    author: 'Xalq maqoli',
    category: 'motivation',
    icon: '🚀',
    color: 'green',
  },
  {
    textUz: "Bilim — bu kuch, lekin uni to'g'ri ishlatish kerak.",
    author: 'Abu Ali Ibn Sino',
    authorInfo: 'Buyuk tabib va olim (980-1037)',
    category: 'advice',
    icon: '💎',
    color: 'purple',
  },
]

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
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
    displayDate: '',
  })

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    fetchQuotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, search])

  const fetchQuotes = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ category: categoryFilter, search })
      const res = await fetch(`/api/admin/quotes?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Iqtiboslarni yuklashda xatolik')
      setQuotes(data.quotes || [])
      setStats(data.stats || {})
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeed = async () => {
    setIsSaving(true)
    let created = 0
    for (const quote of DEFAULT_QUOTES) {
      try {
        const res = await fetch('/api/admin/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quote),
        })
        if (res.ok) created++
      } catch {
        // davom etadi
      }
    }
    setIsSaving(false)
    setShowSeedModal(false)
    toast.success(`${created} ta iqtibos qo'shildi`)
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
      displayDate: '',
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
      category: quote.category || 'motivation',
      tags: quote.tags || [],
      icon: quote.icon || '💡',
      color: quote.color || 'purple',
      isActive: quote.isActive,
      displayDate: quote.displayDate ? new Date(quote.displayDate).toISOString().split('T')[0] : '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.textUz.trim()) {
      toast.error('Iqtibos matnini kiriting!')
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
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Saqlashda xatolik')
      toast.success(data.message)
      setShowModal(false)
      fetchQuotes()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/quotes?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "O'chirishda xatolik")
      toast.success(data.message)
      setDeleteTarget(null)
      fetchQuotes()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kunlik iqtiboslar"
        subtitle="Foydalanuvchi profili (/profil) va Telegram kanali uchun kunlik hikmat va motivatsiya banki"
        ikon="qalam"
        actions={
          <>
            <Link href="/admin/telegram" className="v3-tugma text-xs">
              <Ikon nom="bot" olcham={15} />
              <span>Telegram tarqatish</span>
            </Link>
            <button type="button" onClick={() => setShowSeedModal(true)} className="v3-tugma text-xs">
              <Ikon nom="uchqun" olcham={15} />
              <span>10 ta standart</span>
            </button>
            <button type="button" onClick={openAddModal} className="v3-tugma v3-tugma-asosiy text-xs">
              <Ikon nom="qosh" olcham={15} />
              <span>Yangi iqtibos</span>
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <AdminStatCard
            key={cat.id}
            label={cat.name}
            value={stats[cat.id] || 0}
            ikon="qalam"
            tone={cat.tone}
          />
        ))}
      </div>

      {/* Qidiruv va filtr */}
      <AdminPanel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Ikon
              nom="qidiruv"
              olcham={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)]"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Iqtibos matni yoki muallif bo'yicha qidirish..."
              className="v3-kiritish pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="v3-kiritish"
          >
            <option value="all">Barcha kategoriyalar</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </AdminPanel>

      {/* Iqtiboslar ro'yxati */}
      {isLoading ? (
        <AdminLoading text="Iqtiboslar yuklanmoqda..." />
      ) : quotes.length === 0 ? (
        <AdminEmpty
          ikon="qalam"
          title="Iqtiboslar topilmadi"
          description="10 ta tayyor to'plamni yuklang yoki yangi iqtibos qo'shing."
          action={
            <button
              type="button"
              onClick={() => setShowSeedModal(true)}
              className="v3-tugma v3-tugma-asosiy text-xs"
            >
              10 ta standart yuklash
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => {
            const cat = CATEGORIES.find((c) => c.id === quote.category)
            const cardBorder = QUOTE_COLOR_CARD[quote.color] || QUOTE_COLOR_CARD.purple
            return (
              <AdminPanel
                key={quote.id}
                className={`flex flex-col justify-between gap-3 ${cardBorder} ${
                  !quote.isActive ? 'opacity-65' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg" aria-hidden="true">
                        {quote.icon || '💡'}
                      </span>
                      <AdminBadge tone={cat?.tone || 'neutral'}>{cat?.name || quote.category}</AdminBadge>
                      {quote.displayDate && (
                        <AdminBadge tone="primary">{sana(quote.displayDate)}</AdminBadge>
                      )}
                      {!quote.isActive && <AdminBadge tone="danger">O&apos;chirilgan</AdminBadge>}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(quote)}
                        className="v3-ikon-tugma"
                        title="Tahrirlash"
                      >
                        <Ikon nom="tahrir" olcham={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(quote)}
                        className="v3-ikon-tugma text-rose-300"
                        title="O'chirish"
                      >
                        <Ikon nom="ochir" olcham={14} />
                      </button>
                    </div>
                  </div>

                  <blockquote className="text-sm text-[var(--v3-matn)] leading-relaxed italic">
                    &quot;{quote.textUz}&quot;
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-[var(--v3-chiziq)] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[var(--v3-matn)] truncate">
                      {quote.author}
                    </span>
                    <span className="text-[11px] text-[var(--v3-xira)] shrink-0">
                      {quote.timesShown || 0} ko&apos;rilgan
                    </span>
                  </div>
                  {quote.authorInfo && (
                    <div className="text-[11px] text-[var(--v3-xira)] truncate">{quote.authorInfo}</div>
                  )}
                </div>
              </AdminPanel>
            )
          })}
        </div>
      )}

      {/* Qo'shish / Tahrirlash oynasi */}
      <AdminModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Iqtibosni tahrirlash' : "Yangi iqtibos qo'shish"}
        ikon="qalam"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
              Iqtibos (o&apos;zbekcha) *
            </label>
            <textarea
              value={formData.textUz}
              onChange={(e) => setFormData({ ...formData, textUz: e.target.value })}
              className="v3-kiritish"
              rows={3}
              placeholder="Kimyo — bu tabiatning sirli tillarini o'rganish san'atidir."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
              Inglizcha tarjima (ixtiyoriy)
            </label>
            <textarea
              value={formData.textEn}
              onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
              className="v3-kiritish"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Muallif *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="v3-kiritish"
                placeholder="D.I. Mendeleyev"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Muallif haqida
              </label>
              <input
                type="text"
                value={formData.authorInfo}
                onChange={(e) => setFormData({ ...formData, authorInfo: e.target.value })}
                className="v3-kiritish"
                placeholder="Davriy jadval yaratuvchisi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Kategoriya
              </label>
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
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Maxsus sana (ixtiyoriy)
              </label>
              <input
                type="date"
                value={formData.displayDate}
                onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
                className="v3-kiritish"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1.5 block">Belgicha</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center ${
                    formData.icon === icon
                      ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]'
                      : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1.5 block">Rang</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-xl ${QUOTE_COLOR_SWATCH[color]} flex items-center justify-center transition-transform ${
                    formData.color === color ? 'ring-2 ring-white scale-110' : 'opacity-70'
                  }`}
                >
                  {formData.color === color && <Ikon nom="tasdiq" olcham={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--v3-matn)]">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="accent-amber-400"
            />
            <span>Faol (foydalanuvchi profilida ko&apos;rinsin)</span>
          </label>

          <div className="flex gap-2.5 pt-2">
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
      </AdminModal>

      {/* Standart to'plam tasdig'i */}
      <AdminModal
        open={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        title="10 ta standart iqtibos yuklash"
        ikon="uchqun"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--v3-xira)]">
            Kimyo olimlari va motivatsiyaga oid 10 ta tayyor iqtibos bazaga qo&apos;shiladi.
          </p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setShowSeedModal(false)} className="v3-tugma flex-1">
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleSeed}
              disabled={isSaving}
              className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
            >
              {isSaving ? 'Yuklanmoqda...' : 'Yuklash'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* O'chirish tasdig'i */}
      <AdminModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Iqtibosni o'chirish"
        ikon="ogohlantirish"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--v3-xira)]">
              <strong className="text-[var(--v3-matn)]">&quot;{deleteTarget.textUz.slice(0, 70)}...&quot;</strong>{' '}
              yozuvini o&apos;chirishni tasdiqlaysizmi?
            </p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setDeleteTarget(null)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="v3-tugma flex-1 bg-rose-500/20 border-rose-400/40 text-rose-200 disabled:opacity-45"
              >
                {isSaving ? "O'chirilmoqda..." : "O'chirish"}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
