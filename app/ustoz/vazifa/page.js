// app/ustoz/vazifa/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const TYPE_LABELS = {
  lab: { name: '🧪 Laboratoriya', color: 'green', bg: 'from-green-600/20 to-emerald-600/20 border-green-700/50' },
  essay: { name: '📝 Esse', color: 'blue', bg: 'from-blue-600/20 to-cyan-600/20 border-blue-700/50' },
  quiz_open: { name: '❓ Variantli quiz', color: 'purple', bg: 'from-purple-600/20 to-pink-600/20 border-purple-700/50' },
  quiz_closed: { name: '✍️ Variantsiz quiz', color: 'orange', bg: 'from-orange-600/20 to-amber-600/20 border-orange-700/50' },
  homework: { name: '📚 Uy vazifasi', color: 'yellow', bg: 'from-yellow-600/20 to-orange-600/20 border-yellow-700/50' },
  project: { name: '🔬 Loyiha', color: 'pink', bg: 'from-pink-600/20 to-rose-600/20 border-pink-700/50' }
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
        setAssignments(data.assignments)
        setGroups(data.groups)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Vazifalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" vazifasini o'chirmoqchimisiz?\n\n⚠️ Barcha topshiriqlar ham o'chiriladi!`)) return

    try {
      const res = await fetch(`/api/ustoz/vazifa?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message)
      fetchAssignments()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (id) => {
    router.push(`/ustoz/new-vazifa?edit=${id}`)
  }

  const isExpired = (deadline) => new Date(deadline) < new Date()
  const isActive = (assignment) => {
    if (assignment.isDraft) return false
    return !isExpired(assignment.deadline)
  }

  const getStatusBadge = (assignment) => {
    if (assignment.isDraft) {
      return { text: '💾 Qoralama', class: 'bg-gray-600/20 text-gray-400 border-gray-600/30' }
    }
    if (isExpired(assignment.deadline)) {
      return { text: '🔴 Muddati o\'tgan', class: 'bg-red-600/20 text-red-400 border-red-600/30' }
    }
    const daysLeft = Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 1) {
      return { text: '⚠️ Bugun tugaydi', class: 'bg-orange-600/20 text-orange-400 border-orange-600/30' }
    }
    if (daysLeft <= 3) {
      return { text: `⏰ ${daysLeft} kun qoldi`, class: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' }
    }
    return { text: `🟢 ${daysLeft} kun qoldi`, class: 'bg-green-600/20 text-green-400 border-green-600/30' }
  }

  const getSubmissionStats = (assignment) => {
    const total = assignment._count?.submissions || 0
    const pending = assignment.pendingCount || 0
    const graded = total - pending
    const totalStudents = assignment.group?._count?.students || 0
    const notSubmitted = Math.max(0, totalStudents - total)
    return { total, pending, graded, totalStudents, notSubmitted }
  }

  // Statistika
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => isActive(a)).length,
    expired: assignments.filter(a => isExpired(a.deadline) && !a.isDraft).length,
    drafts: assignments.filter(a => a.isDraft).length,
    pending: assignments.reduce((sum, a) => sum + (a.pendingCount || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            📝 Vazifalar
          </h1>
          <p className="text-purple-300 mt-1">
            Barcha yaratilgan vazifalar ({assignments.length} ta)
          </p>
        </div>
        <Link
          href="/ustoz/new-vazifa"
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>➕</span>
          <span>Yangi vazifa</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-purple-400">Jami</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl p-4">
          <div className="text-2xl mb-1">🟢</div>
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-green-300/70">Faol</div>
        </div>
        <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-4">
          <div className="text-2xl mb-1">🔴</div>
          <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
          <div className="text-xs text-red-300/70">Muddati o'tgan</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 border border-gray-700/50 rounded-xl p-4">
          <div className="text-2xl mb-1">💾</div>
          <div className="text-2xl font-bold text-gray-400">{stats.drafts}</div>
          <div className="text-xs text-gray-300/70">Qoralama</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border border-orange-700/50 rounded-xl p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
          <div className="text-xs text-orange-300/70">Tekshirish kerak</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Vazifa nomi bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Guruh filter */}
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none text-sm"
          >
            <option value="all">📚 Barcha guruhlar</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Tur filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none text-sm"
          >
            <option value="all">🎯 Barcha turlar</option>
            {Object.entries(TYPE_LABELS).map(([id, info]) => (
              <option key={id} value={id}>{info.name}</option>
            ))}
          </select>

          {/* Holat filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none text-sm"
          >
            <option value="all">📊 Barcha holatlar</option>
            <option value="active">🟢 Faol</option>
            <option value="expired">🔴 Muddati o'tgan</option>
          </select>

          {/* Reset */}
          {(filterGroup !== 'all' || filterType !== 'all' || filterStatus !== 'all' || search) && (
            <button
              onClick={() => {
                setFilterGroup('all')
                setFilterType('all')
                setFilterStatus('all')
                setSearch('')
              }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm flex items-center gap-1"
            >
              <span>✕</span>
              <span>Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>Vazifalar yuklanmoqda...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
          <div className="text-7xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {search || filterGroup !== 'all' || filterType !== 'all' || filterStatus !== 'all'
              ? 'Vazifa topilmadi'
              : 'Hali vazifalar yo\'q'}
          </h3>
          <p className="text-purple-300 mb-6">
            {search || filterGroup !== 'all' || filterType !== 'all' || filterStatus !== 'all'
              ? 'Filtrlarni o\'zgartirib ko\'ring'
              : 'Birinchi vazifangizni yarating!'}
          </p>
          {!search && filterGroup === 'all' && filterType === 'all' && filterStatus === 'all' && (
            <Link
              href="/ustoz/new-vazifa"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              ➕ Birinchi vazifani yaratish
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(assignment => {
            const typeInfo = TYPE_LABELS[assignment.type] || TYPE_LABELS.lab
            const statusBadge = getStatusBadge(assignment)
            const submissionStats = getSubmissionStats(assignment)
            const expired = isExpired(assignment.deadline)

            return (
              <div
                key={assignment.id}
                className={`bg-gradient-to-br ${typeInfo.bg} border rounded-2xl p-5 transition-all hover:scale-[1.01] ${
                  expired || assignment.isDraft ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-${typeInfo.color}-600/30 text-${typeInfo.color}-300 border border-${typeInfo.color}-600/40`}>
                        {typeInfo.name}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-purple-800/60 text-purple-200 border border-purple-700/40 rounded-full">
                        📚 {assignment.group?.name || 'Noma\'lum guruh'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {assignment.title}
                    </h3>

                    {/* Description preview */}
                    {assignment.description && (
                      <p className="text-sm text-purple-300 line-clamp-2 mb-3">
                        {assignment.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-purple-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        📅 Muddat: {new Date(assignment.deadline).toLocaleDateString('uz-UZ', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {assignment.maxScore} ball
                      </span>
                      {assignment.timeLimit && (
                        <span className="flex items-center gap-1">
                          ⏱️ {assignment.timeLimit} daq
                        </span>
                      )}
                    </div>

                    {/* Submission stats */}
                    <div className="mt-3 pt-3 border-t border-purple-800/30">
                      <div className="flex items-center gap-3 flex-wrap text-xs">
                        <span className="flex items-center gap-1 text-blue-400">
                          📥 Topshirgan: <strong>{submissionStats.total}</strong>
                        </span>
                        {submissionStats.graded > 0 && (
                          <span className="flex items-center gap-1 text-green-400">
                            ✓ Tekshirilgan: <strong>{submissionStats.graded}</strong>
                          </span>
                        )}
                        {submissionStats.pending > 0 && (
                          <span className="flex items-center gap-1 text-orange-400 font-semibold">
                            ⏳ Tekshirish kerak: <strong>{submissionStats.pending}</strong>
                          </span>
                        )}
                        {submissionStats.notSubmitted > 0 && (
                          <span className="flex items-center gap-1 text-purple-400">
                            ❌ Topshirmagan: <strong>{submissionStats.notSubmitted}</strong>
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {submissionStats.totalStudents > 0 && (
                        <div className="mt-2 w-full h-1.5 bg-purple-950/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${(submissionStats.total / submissionStats.totalStudents) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(assignment.id)}
                      className="w-10 h-10 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50 flex items-center justify-center text-blue-400 transition-all"
                      title="Tahrirlash"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id, assignment.title)}
                      className="w-10 h-10 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 flex items-center justify-center text-red-400 transition-all"
                      title="O'chirish"
                    >
                      🗑️
                    </button>
                    {submissionStats.total > 0 && (
                      <Link
                        href={`/ustoz/vazifa/${assignment.id}`}
                        className="w-10 h-10 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-600/50 flex items-center justify-center text-purple-400 transition-all"
                        title="Topshiriqlarni ko'rish"
                      >
                        📊
                      </Link>
                    )}
                  </div>
                </div>

                {/* Quick features badges */}
                {(assignment.hints?.length > 0 || assignment.resources?.length > 0 || assignment.attachments?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-purple-800/30 flex items-center gap-2 flex-wrap">
                    {assignment.hints?.length > 0 && (
                      <span className="px-2 py-0.5 text-[10px] bg-amber-600/20 text-amber-300 rounded-full border border-amber-600/30">
                        💡 {assignment.hints.length} maslahat
                      </span>
                    )}
                    {assignment.resources?.length > 0 && (
                      <span className="px-2 py-0.5 text-[10px] bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/30">
                        📚 {assignment.resources.length} resurs
                      </span>
                    )}
                    {assignment.attachments?.length > 0 && (
                      <span className="px-2 py-0.5 text-[10px] bg-pink-600/20 text-pink-300 rounded-full border border-pink-600/30">
                        📎 {assignment.attachments.length} fayl
                      </span>
                    )}
                    {assignment.maxAttempts > 1 && (
                      <span className="px-2 py-0.5 text-[10px] bg-cyan-600/20 text-cyan-300 rounded-full border border-cyan-600/30">
                        🔄 {assignment.maxAttempts} urinish
                      </span>
                    )}
                    {assignment.allowLateSubmission && (
                      <span className="px-2 py-0.5 text-[10px] bg-yellow-600/20 text-yellow-300 rounded-full border border-yellow-600/30">
                        ⏰ Kech ruxsat
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}