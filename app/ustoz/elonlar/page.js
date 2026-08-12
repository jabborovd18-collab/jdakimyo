"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sanaVaqt } from '@/lib/sana'

export default function ElonlarPage() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterGroup, setFilterGroup] = useState('all')

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    groupId: ''
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [filterGroup])

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ groupId: filterGroup })
      const res = await fetch(`/api/ustoz/elonlar?${params}`)
      const data = await res.json()

      if (res.ok) {
        setAnnouncements(data.announcements || [])
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'E\'lonlarni yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('E\'lonlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Sarlavhani kiriting!')
      return
    }
    if (!formData.content.trim()) {
      toast.error('E\'lon matnini kiriting!')
      return
    }
    if (!formData.groupId) {
      toast.error('Guruhni tanlang!')
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch('/api/ustoz/elonlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'E\'lon guruhga yuborildi')
      setShowCreateModal(false)
      setFormData({ title: '', content: '', groupId: '' })
      fetchAnnouncements()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" e'lonini o'chirmoqchimisiz?`)) return

    try {
      const res = await fetch(`/api/ustoz/elonlar?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'E\'lon o\'chirildi')
      fetchAnnouncements()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Axborot va Bildirishnomalar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Guruh E{"'"}lonlari
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Talabalarga yangiliklar, dars jadvallari va muhim ko{"'"}rsatmalarni yetkazing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (groups.length === 0) {
              toast.error('Avval guruh yarating!')
              return
            }
            setFormData({ title: '', content: '', groupId: groups[0]?.id || '' })
            setShowCreateModal(true)
          }}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2 self-start sm:self-auto font-bold"
        >
          <Ikon nom="qosh" olcham={15} />
          Yangi e{"'"}lon berish
        </button>
      </div>

      {/* Filter */}
      <div className="v3-panel-karta p-4">
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="v3-kiritish text-xs py-2 max-w-xs"
        >
          <option value="all">Barcha guruhlar e{"'"}lonlari</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
          <Ikon nom="vaqt" olcham={18} className="animate-spin" />
          <span>E{"'"}lonlar yuklanmoqda...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="v3-panel-karta py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="kanal" olcham={24} />
          </div>
          <h3 className="font-bold text-base text-[var(--v3-matn)]">Hozircha e{"'"}lonlar yo{"'"}q</h3>
          <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
            Guruhlaringiz uchun birinchi e{"'"}lonni yuboring.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {announcements.map(announcement => (
            <div
              key={announcement.id}
              className="v3-panel-karta p-5 hover:border-[var(--v3-chiziq-2)] transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="v3-tag v3-tag-ochiq text-[10.5px]">
                      <Ikon nom="kanal" olcham={11} />
                      E{"'"}lon
                    </span>

                    {announcement.group && (
                      <span className="v3-tag v3-tag-yopiq text-[10.5px]">
                        <Ikon nom="kitob" olcham={11} />
                        {announcement.group.name}
                      </span>
                    )}

                    <span className="text-[11px] text-[var(--v3-xira)] font-mono">
                      {sanaVaqt(announcement.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--v3-matn)]">
                    {announcement.title}
                  </h3>

                  <p className="text-xs text-[var(--v3-matn)] whitespace-pre-wrap leading-relaxed opacity-90">
                    {announcement.content}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(announcement.id, announcement.title)}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="O'chirish"
                >
                  <Ikon nom="ochir" olcham={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
              <h3 className="font-bold text-base text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="kanal" olcham={16} />
                Yangi E{"'"}lon yuborish
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="v3-yorliq">Guruhni tanlang *</label>
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  className="v3-kiritish"
                >
                  <option value="">— Guruhni tanlang —</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v3-yorliq">Sarlavha *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masalan: Keyingi laboratoriya mashg'ulotiga tayyorgarlik"
                  className="v3-kiritish"
                  maxLength={120}
                />
              </div>

              <div>
                <label className="v3-yorliq">E{"'"}lon matni *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Talabalar uchun to'liq xabar matnini yozing..."
                  rows={5}
                  className="v3-kiritish resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="v3-tugma text-xs py-2 px-4"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
              >
                {isCreating ? 'Yuborilmoqda...' : '✓ E\'lonni e\'lon qilish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
