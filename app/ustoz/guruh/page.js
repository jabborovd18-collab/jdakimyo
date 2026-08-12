"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

const COLORS = [
  { id: 'blue', name: 'Moviy', hex: '#3b82f6' },
  { id: 'green', name: 'Yashil', hex: '#10b981' },
  { id: 'purple', name: 'Binafsha', hex: '#8b5cf6' },
  { id: 'orange', name: 'Sariq-olov', hex: '#f59e0b' },
  { id: 'cyan', name: 'Feruza', hex: '#06b6d4' },
]

export default function UstozGuruhlarPage() {
  const { data: session } = useSession()
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    color: 'blue'
  })

  useEffect(() => {
    fetchGroups()
  }, [search])

  const fetchGroups = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search })
      const res = await fetch(`/api/ustoz/guruh?${params}`)
      const data = await res.json()

      if (res.ok) {
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'Yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Guruhlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      name: '',
      description: '',
      color: 'blue'
    })
    setShowModal(true)
  }

  const openEditModal = (group) => {
    setIsEditing(true)
    setFormData({
      id: group.id,
      name: group.name,
      description: group.description || '',
      color: group.color || 'blue'
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Guruh nomini kiriting!')
      return
    }

    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/ustoz/guruh', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Guruh saqlandi')
      setShowModal(false)
      fetchGroups()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" guruhini o'chirmoqchimisiz? Guruhga bog'liq barcha vazifalar ham o'chiriladi.`)) {
      return
    }

    try {
      const res = await fetch(`/api/ustoz/guruh?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Guruh o\'chirildi')
      fetchGroups()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Tuzilma va Guruhlar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            O{"'"}quv Guruhlari
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Talabalarni guruhlarga ajrating, vazifalar va testlarni alohida guruhlarga yo{"'"}naltiring.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2 self-start sm:self-auto font-bold"
        >
          <Ikon nom="qosh" olcham={15} />
          Yangi guruh yaratish
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="v3-panel-karta p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Guruh nomi bo'yicha qidirish..."
            className="v3-kiritish text-xs py-2 pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
            <Ikon nom="qidiruv" olcham={13} />
          </span>
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
          <Ikon nom="vaqt" olcham={18} className="animate-spin" />
          <span>Guruhlar yuklanmoqda...</span>
        </div>
      ) : groups.length === 0 ? (
        <div className="v3-panel-karta py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="kitob" olcham={24} />
          </div>
          <h3 className="font-bold text-base text-[var(--v3-matn)]">
            {search ? 'Guruh topilmadi' : 'Hali guruhlar yaratilmagan'}
          </h3>
          <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
            {search ? 'Boshqa so\'z bilan qidirib ko\'ring' : 'Birinchi guruhingizni yarating va talabalarni taklif qiling.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="v3-panel-karta p-5 flex flex-col justify-between space-y-4 hover:border-[var(--v3-chiziq-2)] transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-[var(--v3-matn)] truncate group-hover:text-[var(--v3-urgu)] transition-colors">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-[var(--v3-xira)] line-clamp-2 mt-0.5 leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(group)}
                      className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                      title="Tahrirlash"
                    >
                      <Ikon nom="tahrir" olcham={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(group.id, group.name)}
                      className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-red-400"
                      title="O'chirish"
                    >
                      <Ikon nom="ochir" olcham={13} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--v3-chiziq)] text-center font-mono">
                  <div className="p-2 rounded-lg bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Talabalar</span>
                    <strong className="text-xs text-[var(--v3-matn)]">{group._count?.students || 0}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Vazifalar</span>
                    <strong className="text-xs text-[var(--v3-matn)]">{group._count?.assignments || 0}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">E{"'"}lonlar</span>
                    <strong className="text-xs text-[var(--v3-matn)]">{group._count?.announcements || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--v3-chiziq)]">
                <Link
                  href={`/ustoz/talaba?groupId=${group.id}`}
                  className="flex-1 v3-tugma text-xs py-1.5 justify-center font-medium"
                >
                  <Ikon nom="odamlar" olcham={13} />
                  Talabalar ({group._count?.students || 0})
                </Link>
                <Link
                  href={`/ustoz/vazifa?groupId=${group.id}`}
                  className="v3-tugma text-xs p-1.5"
                  title="Vazifalar"
                >
                  <Ikon nom="kitob" olcham={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guruh qo'shish / tahrirlash modali */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
              <h3 className="font-bold text-sm text-[var(--v3-matn)]">
                {isEditing ? 'Guruhni tahrirlash' : 'Yangi guruh yaratish'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="v3-yorliq">Guruh nomi *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Kimyo 203, Magistratura A..."
                  className="v3-kiritish"
                  autoFocus
                />
              </div>

              <div>
                <label className="v3-yorliq">Tavsif (ixtiyoriy)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Guruh haqida qisqacha ma'lumot..."
                  rows={3}
                  className="v3-kiritish resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="v3-tugma text-xs py-2 px-4"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
              >
                {isSaving ? 'Saqlanmoqda...' : isEditing ? '✓ Yangilash' : '✓ Yaratish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
