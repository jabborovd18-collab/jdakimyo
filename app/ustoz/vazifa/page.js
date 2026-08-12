"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

const TYPE_MAP = {
  lab: { name: 'Laboratoriya ishi', tagClass: 'v3-tag-ochiq' },
  essay: { name: 'Esse / Referat', tagClass: 'v3-tag-yopiq' },
  quiz_open: { name: 'Variantli test', tagClass: 'v3-tag-muhlat' },
  quiz_closed: { name: 'Yozma test', tagClass: 'v3-tag-yopiq' },
  homework: { name: 'Uy vazifasi', tagClass: 'v3-tag-ochiq' },
  project: { name: 'Ilmiy loyiha', tagClass: 'v3-tag-muhlat' }
}

export default function VazifalarPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtrlar
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAssignments()
  }, [filterGroup, filterType, filterStatus, search])

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        groupId: filterGroup,
        type: filterType,
        status: filterStatus,
        search
      })
      const res = await fetch(`/api/ustoz/vazifa?${params}`)
      const data = await res.json()

      if (res.ok) {
        setAssignments(data.assignments || [])
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'Vazifalarni yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Vazifalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" vazifasini o'chirmoqchimisiz? Barcha topshirilgan ishlar ham o'chiriladi.`)) return

    try {
      const res = await fetch(`/api/ustoz/vazifa?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Vazifa o\'chirildi')
      fetchAssignments()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (id) => {
    router.push(`/ustoz/new-vazifa?edit=${id}`)
  }

  const isExpired = (deadline) => deadline && new Date(deadline) < new Date()

  // Statistika
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => !isExpired(a.deadline) && !a.isDraft).length,
    expired: assignments.filter(a => isExpired(a.deadline) && !a.isDraft).length,
    pending: assignments.reduce((sum, a) => sum + (a.pendingCount || 0), 0)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Topshiriqlar boshqaruvi</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Berilgan Vazifalar
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Guruhlar uchun amaliy, yozma va laboratoriya vazifalari monitoringi.
          </p>
        </div>

        <Link
          href="/ustoz/new-vazifa"
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2 self-start sm:self-auto font-bold"
        >
          <Ikon nom="qosh" olcham={15} />
          Yangi vazifa yaratish
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">Jami vazifalar</div>
          <div className="text-2xl font-bold font-mono text-[var(--v3-matn)] mt-1">{stats.total}</div>
        </div>
        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">Faol topshiriqlar</div>
          <div className="text-2xl font-bold font-mono text-green-400 mt-1">{stats.active}</div>
        </div>
        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">Muddati o{"'"}tgan</div>
          <div className="text-2xl font-bold font-mono text-[var(--v3-xira)] mt-1">{stats.expired}</div>
        </div>
        <div className={`v3-panel-karta p-4 ${stats.pending > 0 ? 'border-l-4 border-l-[var(--v3-urgu)]' : ''}`}>
          <div className="text-xs text-[var(--v3-xira)] font-medium">Tekshirish kutilmoqda</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${stats.pending > 0 ? 'text-[var(--v3-urgu)]' : 'text-[var(--v3-matn)]'}`}>
            {stats.pending}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="v3-panel-karta p-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vazifa sarlavhasi bo'yicha qidirish..."
            className="v3-kiritish text-xs py-2 pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
            <Ikon nom="qidiruv" olcham={13} />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="v3-kiritish text-xs py-1.5 w-auto"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="v3-kiritish text-xs py-1.5 w-auto"
          >
            <option value="all">Barcha turlar</option>
            {Object.entries(TYPE_MAP).map(([id, info]) => (
              <option key={id} value={id}>{info.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="v3-kiritish text-xs py-1.5 w-auto"
          >
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="expired">Muddati o'tgan</option>
          </select>

          {(filterGroup !== 'all' || filterType !== 'all' || filterStatus !== 'all' || search) && (
            <button
              type="button"
              onClick={() => {
                setFilterGroup('all')
                setFilterType('all')
                setFilterStatus('all')
                setSearch('')
              }}
              className="v3-tugma text-xs py-1.5 px-3"
            >
              Filtrni tozalash
            </button>
          )}
        </div>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
          <Ikon nom="vaqt" olcham={18} className="animate-spin" />
          <span>Vazifalar yuklanmoqda...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="v3-panel-karta py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="kitob" olcham={24} />
          </div>
          <h3 className="font-bold text-base text-[var(--v3-matn)]">
            {search ? 'Vazifa topilmadi' : 'Hozircha vazifalar mavjud emas'}
          </h3>
          <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
            {search ? 'Qidiruv so\'zini o\'zgartirib ko\'ring' : 'Guruhlaringiz uchun birinchi vazifani yarating.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {assignments.map(assignment => {
            const typeInfo = TYPE_MAP[assignment.type] || TYPE_MAP.lab
            const expired = isExpired(assignment.deadline)
            const deadlineDate = assignment.deadline ? new Date(assignment.deadline) : null

            return (
              <div
                key={assignment.id}
                className="v3-panel-karta p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--v3-chiziq-2)] transition-all"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`v3-tag ${typeInfo.tagClass}`}>
                      {typeInfo.name}
                    </span>

                    <span className="v3-tag v3-tag-yopiq">
                      <Ikon nom="kitob" olcham={11} />
                      {assignment.group?.name || 'Guruh'}
                    </span>

                    {deadlineDate && (
                      <span className={`v3-tag ${expired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                        <Ikon nom="taqvim" olcham={11} />
                        {expired ? 'Muddati o\'tgan' : 'Muddat: '}
                        {deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}

                    {assignment.pendingCount > 0 && (
                      <span className="v3-tag bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                        {assignment.pendingCount} ta tekshirish kutilmoqda
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[var(--v3-matn)] leading-snug">
                      {assignment.title}
                    </h3>
                    {assignment.description && (
                      <p className="text-xs text-[var(--v3-xira)] line-clamp-2 mt-0.5 leading-relaxed">
                        {assignment.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[var(--v3-xira)] pt-1">
                    <span>Maksimal ball: <strong>{assignment.maxScore}</strong></span>
                    <span>Topshirganlar: <strong>{assignment._count?.submissions || 0} ta</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--v3-chiziq)]">
                  <Link
                    href={`/ustoz/natijalar?groupId=${assignment.groupId}`}
                    className="v3-tugma text-xs py-1.5 px-3"
                    title="Topshiriq natijalarini ko'rish"
                  >
                    <Ikon nom="orin" olcham={14} />
                    Natijalar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleEdit(assignment.id)}
                    className="p-2 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                    title="Tahrirlash"
                  >
                    <Ikon nom="tahrir" olcham={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(assignment.id, assignment.title)}
                    className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10"
                    title="O'chirish"
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
