// app/admin/missions/page.js
'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { ADMIN_MISSION_TYPES } from '@/lib/admin-yordamchi'
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

const DIFFICULTIES = [
  { id: 'easy', name: 'Oson', tone: 'success', xp: 10 },
  { id: 'medium', name: "O'rta", tone: 'warning', xp: 15 },
  { id: 'hard', name: 'Qiyin', tone: 'danger', xp: 20 },
]

const TYPE_TONES = {
  quiz: 'info',
  post: 'accent',
  muhokama: 'primary',
  friend: 'success',
}

const ICONS = ['🎯', '📝', '💬', '🤝', '⭐', '🔥', '💎', '🏆', '🚀', '💪']

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState([])
  const [stats, setStats] = useState({ total: 0, todayMissions: 0, byType: {} })
  const [isLoading, setIsLoading] = useState(true)

  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'quiz',
    title: '',
    description: '',
    xpReward: 10,
    icon: '🎯',
    difficulty: 'easy',
  })

  useEffect(() => {
    fetchMissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, difficultyFilter, dateFilter])

  const fetchMissions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        type: typeFilter,
        difficulty: difficultyFilter,
        date: dateFilter,
      })
      const res = await fetch(`/api/admin/missions?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Missiyalarni yuklashda xatolik')
      setMissions(data.missions || [])
      setStats(data.stats || { total: 0, todayMissions: 0, byType: {} })
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
      date: new Date().toISOString().split('T')[0],
      type: 'quiz',
      title: '',
      description: '',
      xpReward: 10,
      icon: '🎯',
      difficulty: 'easy',
    })
    setShowModal(true)
  }

  const openEditModal = (mission) => {
    setIsEditing(true)
    const v4Type = ADMIN_MISSION_TYPES.some((t) => t.kod === mission.type) ? mission.type : 'quiz'
    setFormData({
      id: mission.id,
      date: new Date(mission.date).toISOString().split('T')[0],
      type: v4Type,
      legacyType: v4Type !== mission.type ? mission.type : null,
      title: mission.title,
      description: mission.description || '',
      xpReward: mission.xpReward,
      icon: mission.icon || '🎯',
      difficulty: mission.difficulty || 'easy',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Sarlavha kiriting!')
      return
    }
    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/missions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Saqlashda xatolik')
      toast.success(data.message)
      setShowModal(false)
      fetchMissions()
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
      const res = await fetch(`/api/admin/missions?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "O'chirishda xatolik")
      toast.success(data.message)
      setDeleteTarget(null)
      fetchMissions()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const setDifficultyAndXP = (diff) => {
    const d = DIFFICULTIES.find((item) => item.id === diff)
    setFormData((prev) => ({
      ...prev,
      difficulty: diff,
      xpReward: d ? d.xp : 10,
    }))
  }

  const formatTypeInfo = (type) => {
    const v4 = ADMIN_MISSION_TYPES.find((t) => t.kod === type)
    if (v4) return { label: v4.nom, tone: TYPE_TONES[type] || 'neutral', legacy: false }
    return { label: `${type} (v3 eski)`, tone: 'neutral', legacy: true }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kunlik missiyalar"
        subtitle="v4 faol missiya turlari: Quiz, Post, Muhokama va Do'st qo'shish"
        ikon="olov"
        actions={
          <button type="button" onClick={openAddModal} className="v3-tugma v3-tugma-asosiy text-xs">
            <Ikon nom="qosh" olcham={15} />
            <span>Yangi missiya</span>
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <AdminStatCard label="Jami missiyalar" value={stats.total || 0} ikon="grafik" tone="info" />
        <AdminStatCard label="Bugungi faol" value={stats.todayMissions || 0} ikon="taqvim" tone="success" />
        <AdminStatCard label="Quiz turlari" value={stats.byType?.quiz || 0} ikon="quiz" tone="primary" />
        <AdminStatCard
          label="Post va muhokama"
          value={(stats.byType?.post || 0) + (stats.byType?.muhokama || 0)}
          ikon="muhokama"
          tone="accent"
        />
      </div>

      {/* Filtrlar */}
      <AdminPanel>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="v3-kiritish w-auto min-w-[180px]"
          >
            <option value="all">Barcha v4 turlar</option>
            {ADMIN_MISSION_TYPES.map((t) => (
              <option key={t.kod} value={t.kod}>
                {t.nom}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="v3-kiritish w-auto min-w-[160px]"
          >
            <option value="all">Barcha qiyinliklar</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="v3-kiritish w-auto"
          />

          {(typeFilter !== 'all' || difficultyFilter !== 'all' || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all')
                setDifficultyFilter('all')
                setDateFilter('')
              }}
              className="v3-tugma text-xs py-2 px-3 text-rose-300"
            >
              <Ikon nom="yopish" olcham={14} />
              <span>Tozalash</span>
            </button>
          )}
        </div>
      </AdminPanel>

      {/* Ro'yxat */}
      {isLoading ? (
        <AdminLoading text="Missiyalar yuklanmoqda..." />
      ) : missions.length === 0 ? (
        <AdminEmpty
          ikon="olov"
          title="Hozircha missiyalar yo'q"
          description="Filtrni o'zgartiring yoki bugungi kun uchun yangi missiya qo'shing."
        />
      ) : (
        <AdminPanel padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-xira)]">
                <tr>
                  <th className="text-left p-3.5 font-semibold">Sana</th>
                  <th className="text-left p-3.5 font-semibold">Missiya</th>
                  <th className="text-left p-3.5 font-semibold">Tur</th>
                  <th className="text-left p-3.5 font-semibold">Qiyinlik</th>
                  <th className="text-left p-3.5 font-semibold">Mukofot</th>
                  <th className="text-left p-3.5 font-semibold">Bajarilgan</th>
                  <th className="text-right p-3.5 font-semibold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {missions.map((mission) => {
                  const typeInfo = formatTypeInfo(mission.type)
                  const diffInfo = DIFFICULTIES.find((d) => d.id === mission.difficulty)
                  return (
                    <tr key={mission.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                      <td className="p-3.5 text-xs font-medium text-[var(--v3-matn)] whitespace-nowrap">
                        {sana(mission.date)}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0" aria-hidden="true">
                            {mission.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--v3-matn)] truncate">
                              {mission.title}
                            </div>
                            {mission.description && (
                              <div className="text-xs text-[var(--v3-xira)] line-clamp-1">
                                {mission.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <AdminBadge tone={typeInfo.tone}>{typeInfo.label}</AdminBadge>
                      </td>
                      <td className="p-3.5">
                        <AdminBadge tone={diffInfo?.tone || 'neutral'}>
                          {diffInfo?.name || mission.difficulty}
                        </AdminBadge>
                      </td>
                      <td className="p-3.5 font-bold text-[var(--v3-urgu)] whitespace-nowrap">
                        +{mission.xpReward} XP
                      </td>
                      <td className="p-3.5 text-xs text-[var(--v3-xira)] whitespace-nowrap">
                        {mission._count?.completions || 0} marta
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(mission)}
                            title="Tahrirlash"
                            className="v3-ikon-tugma"
                          >
                            <Ikon nom="tahrir" olcham={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(mission)}
                            title="O'chirish"
                            className="v3-ikon-tugma text-rose-300"
                          >
                            <Ikon nom="ochir" olcham={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      )}

      {/* Qo'shish / Tahrirlash oynasi */}
      <AdminModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Missiyani tahrirlash' : "Yangi missiya qo'shish"}
        ikon="olov"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {formData.legacyType && (
            <div className="rounded-xl border border-amber-400/35 bg-amber-400/10 p-3 text-xs text-amber-200">
              Eski v3 tur (<code>{formData.legacyType}</code>) v4 da olib tashlangan. Saqlashda v4
              turiga o&apos;tkaziladi.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Sana *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="v3-kiritish"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Tur *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="v3-kiritish"
              >
                {ADMIN_MISSION_TYPES.map((t) => (
                  <option key={t.kod} value={t.kod}>
                    {t.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
              Sarlavha *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="v3-kiritish"
              placeholder="Masalan: 1 ta kimyo quizini yeching"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
              Tavsif
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="v3-kiritish"
              rows={2}
              placeholder="Missiyani bajarish sharti haqida qisqa izoh"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                Qiyinlik
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setDifficultyAndXP(e.target.value)}
                className="v3-kiritish"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (+{d.xp} XP)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1 block">
                XP mukofoti
              </label>
              <input
                type="number"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })}
                className="v3-kiritish"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--v3-matn)] mb-1.5 block">
              Belgicha
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                    formData.icon === icon
                      ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] scale-105'
                      : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:bg-[var(--v3-yuza-2)]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

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

      {/* O'chirish tasdig'i */}
      <AdminModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Missiyani o'chirish"
        ikon="ogohlantirish"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--v3-xira)]">
              <strong className="text-[var(--v3-matn)]">&quot;{deleteTarget.title}&quot;</strong>{' '}
              missiyasini o&apos;chirishni tasdiqlaysizmi?
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
