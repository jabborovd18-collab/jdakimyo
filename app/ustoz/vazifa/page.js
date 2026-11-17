"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

const ASSIGNMENT_TYPES = {
  homework: { label: 'Uy vazifasi', icon: 'kitob' },
  lab: { label: 'Laboratoriya ishi', icon: 'kolba' },
  test: { label: 'Nazorat ishi', icon: 'quiz' },
  project: { label: 'Loyiha / Referat', icon: 'fayl' },
}

export default function VazifaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [assignments, setAssignments] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // all | active | expired | drafts
  const [searchQuery, setSearchQuery] = useState('')
  const [sendingReminderId, setSendingReminderId] = useState(null)

  useEffect(() => {
    const gId = searchParams.get('groupId')
    if (gId) setSelectedGroup(gId)
  }, [searchParams])

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        groupId: selectedGroup,
        status: statusFilter,
        search: searchQuery
      })
      const res = await fetch(`/api/ustoz/vazifa?${params}`)
      const data = await res.json()
      if (res.ok) {
        setAssignments(data.assignments || [])
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'Yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup, statusFilter, searchQuery])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  const sendReminder = async (assignmentId) => {
    setSendingReminderId(assignmentId)
    try {
      const res = await fetch('/api/ustoz/eslatma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'assignment', id: assignmentId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eslatma yuborib bo\'lmadi')
      toast.success(data.message || 'Eslatma yuborildi!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSendingReminderId(null)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" vazifasini o'chirishni tasdiqlaysizmi?`)) return

    try {
      const res = await fetch(`/api/ustoz/vazifa?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(data.message)
      fetchAssignments()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">O{"'"}quv jarayoni</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Uy Vazifalari va Topshiriqlar ({assignments.length})
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Guruhlarga biriktirilgan vazifalar, laboratoriya ishlari va muddatli topshiriqlar nazorati.
          </p>
        </div>

        <Link
          href="/ustoz/new-vazifa"
          className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-4 font-bold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Ikon nom="qosh" olcham={15} />
          Yangi vazifa berish
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="v3-panel-karta p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'active', label: 'Faol (Muddati bor)' },
            { id: 'expired', label: 'Muddati o\'tgan' },
            { id: 'drafts', label: 'Qoralamalar' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`v3-tugma text-xs py-1.5 px-3 ${statusFilter === tab.id ? 'v3-tugma-asosiy' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="v3-kiritish text-xs py-1.5 w-44"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vazifa nomi..."
              className="v3-kiritish text-xs py-1.5 pl-8"
            />
            <span className="absolute left-2.5 top-2 text-[var(--v3-xira)]">
              <Ikon nom="qidiruv" olcham={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
          <Ikon nom="vaqt" olcham={18} className="animate-spin" />
          <span>Vazifalar yuklanmoqda...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="v3-panel-karta py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="kitob" olcham={24} />
          </div>
          <h3 className="font-bold text-base text-[var(--v3-matn)]">Vazifalar topilmadi</h3>
          <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
            Tanlangan filtr bo{"'"}yicha vazifalar yo{"'"}q. Guruhlaringiz uchun yangi topshiriq e{"'"}lon qiling.
          </p>
          <Link
            href="/ustoz/new-vazifa"
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            <Ikon nom="qosh" olcham={15} />
            Birinchi vazifani yaratish
          </Link>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {assignments.map((assignment) => {
            const deadlineDate = assignment.deadline ? new Date(assignment.deadline) : null
            const isExpired = deadlineDate && Date.now() > deadlineDate.getTime()
            const typeInfo = ASSIGNMENT_TYPES[assignment.type] || ASSIGNMENT_TYPES.homework
            const stats = assignment.stats || {}

            return (
              <div
                key={assignment.id}
                className="v3-panel-karta p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="v3-tag v3-tag-ochiq">
                      <Ikon nom={typeInfo.icon} olcham={12} />
                      {typeInfo.label}
                    </span>

                    {assignment.group?.name && (
                      <span className="v3-tag v3-tag-yopiq">
                        Guruh: {assignment.group.name}
                      </span>
                    )}

                    {assignment.isDraft && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                        Qoralama
                      </span>
                    )}

                    {deadlineDate && (
                      <span className={`v3-tag ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                        <Ikon nom="taqvim" olcham={12} />
                        {isExpired ? 'Tugagan: ' : 'Muddat: '}
                        {deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[var(--v3-matn)]">
                      {assignment.title}
                    </h3>
                    {assignment.description && (
                      <p className="text-xs text-[var(--v3-xira)] line-clamp-2 mt-0.5 leading-relaxed">
                        {assignment.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--v3-xira)] pt-1">
                    <span>Maksimal ball: <strong className="text-[var(--v3-matn)]">{assignment.maxScore}</strong></span>
                    <span>Topshirdi: <strong className="text-[var(--v3-urgu)]">{stats.submittedCount ?? assignment._count?.submissions ?? 0} / {stats.totalStudents ?? 0}</strong></span>
                    {(stats.pendingCount || 0) > 0 && (
                      <span className="text-amber-400">
                        ⏳ {stats.pendingCount} ta tekshirish kutilmoqda
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--v3-chiziq)]">
                  {!isExpired && !assignment.isDraft && (
                    <button
                      type="button"
                      onClick={() => sendReminder(assignment.id)}
                      disabled={sendingReminderId === assignment.id}
                      className="v3-tugma text-xs py-1.5 px-3 text-[var(--v3-urgu)] hover:border-[var(--v3-urgu)]"
                      title="Topshirmagan talabalarga eslatma bildirishnomasi yuborish"
                    >
                      <Ikon nom="vaqt" olcham={14} />
                      {sendingReminderId === assignment.id ? '...' : 'Eslatish'}
                    </button>
                  )}

                  <Link
                    href={`/ustoz/new-vazifa?edit=${assignment.id}`}
                    className="v3-tugma text-xs py-1.5 px-3"
                  >
                    Tahrirlash
                  </Link>

                  <Link
                    href={`/ustoz/natijalar?groupId=${assignment.groupId}&tab=assignments`}
                    className="v3-tugma text-xs py-1.5 px-3"
                  >
                    <Ikon nom="orin" olcham={14} />
                    Natijalar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(assignment.id, assignment.title)}
                    className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="O'chirish"
                    aria-label="O'chirish"
                  >
                    <Ikon nom="ochir" olcham={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
