"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

export default function NatijalarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openQuizAttempts, setOpenQuizAttempts] = useState([])
  const [closedQuizSubmissions, setClosedQuizSubmissions] = useState([])
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([])
  const [groups, setGroups] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [activeTab, setActiveTab] = useState('open') // open | closed | assignments
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | passed | failed | pending | graded

  // Vazifa baholash modali
  const [gradingSubmission, setGradingSubmission] = useState(null)
  const [gradeScore, setGradeScore] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')
  const [isGrading, setIsGrading] = useState(false)

  useEffect(() => {
    const gId = searchParams.get('groupId')
    const tab = searchParams.get('tab')
    if (gId) setSelectedGroup(gId)
    if (tab && ['open', 'closed', 'assignments'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResults()
    }
  }, [status, selectedGroup])

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedGroup !== 'all') params.set('groupId', selectedGroup)

      const res = await fetch(`/api/ustoz/natijalar?${params}`)
      const data = await res.json()

      if (res.ok) {
        setOpenQuizAttempts(data.openQuizAttempts || [])
        setClosedQuizSubmissions(data.closedQuizSubmissions || [])
        setAssignmentSubmissions(data.assignmentSubmissions || [])
        setGroups(data.groups || [])
        setStats(data.stats)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Yuklab bo\'lmadi')
    } finally {
      setIsLoading(false)
    }
  }

  const openAssignmentGradeModal = (sub) => {
    setGradingSubmission(sub)
    setGradeScore(sub.score !== null && sub.score !== undefined ? String(sub.score) : String(sub.assignment?.maxScore || 100))
    setGradeFeedback(sub.feedback || '')
  }

  const handleAssignmentGradeSave = async () => {
    if (!gradingSubmission) return
    const maxScore = gradingSubmission.assignment?.maxScore || 100
    const parsed = Number(gradeScore)
    if (gradeScore === '' || !Number.isFinite(parsed) || parsed < 0 || parsed > maxScore) {
      toast.error(`Ball 0 dan ${maxScore} gacha bo'lishi kerak`)
      return
    }

    setIsGrading(true)
    try {
      const res = await fetch('/api/ustoz/natijalar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: gradingSubmission.id,
          score: Math.round(parsed),
          feedback: gradeFeedback
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Baholashda xatolik')

      toast.success(data.message || 'Vazifa baholandi!')
      setGradingSubmission(null)
      fetchResults()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsGrading(false)
    }
  }

  // Ochiq quiz urinishlarini filtrlash
  const filteredOpenAttempts = openQuizAttempts.filter(att => {
    const matchSearch = !searchQuery ||
      att.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.student?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.quiz?.title?.toLowerCase().includes(searchQuery.toLowerCase())

    const passed = att.percentage >= (att.quiz?.passingScore || 60)
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'passed' && passed) ||
      (statusFilter === 'failed' && !passed)

    return matchSearch && matchStatus
  })

  // Yopiq quiz topshiriqlarini filtrlash
  const filteredClosedSubmissions = closedQuizSubmissions.filter(sub => {
    const matchSearch = !searchQuery ||
      sub.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.student?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.quiz?.title?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'pending' && sub.status === 'pending') ||
      (statusFilter === 'graded' && sub.status === 'graded')

    return matchSearch && matchStatus
  })

  // Vazifa topshiriqlarini filtrlash
  const filteredAssignments = assignmentSubmissions.filter(sub => {
    const matchSearch = !searchQuery ||
      sub.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.student?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignment?.title?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'pending' && sub.status === 'pending') ||
      (statusFilter === 'graded' && sub.status === 'graded')

    return matchSearch && matchStatus
  })

  // CSV Eksport
  const exportToCSV = () => {
    let rows = []
    let filename = 'natijalar.csv'

    if (activeTab === 'open') {
      filename = 'ochiq-quiz-natijalari.csv'
      rows.push(['Talaba', 'Username', 'Test nomi', 'Guruh', 'Ball', 'Maksimal ball', 'Foiz (%)', 'Vaqt (soniya)', 'Sana'])
      filteredOpenAttempts.forEach(a => {
        rows.push([
          `"${(a.student?.fullName || a.student?.username || '').replace(/"/g, '""')}"`,
          a.student?.username || '',
          `"${(a.quiz?.title || '').replace(/"/g, '""')}"`,
          `"${(a.quiz?.group?.name || 'Ommaviy').replace(/"/g, '""')}"`,
          a.score,
          a.maxScore,
          a.percentage.toFixed(1),
          a.timeSpent || 0,
          new Date(a.completedAt).toLocaleString('uz-UZ')
        ])
      })
    } else if (activeTab === 'closed') {
      filename = 'yopiq-quiz-natijalari.csv'
      rows.push(['Talaba', 'Username', 'Imtihon nomi', 'Guruh', 'Holat', 'Ball', 'Maksimal ball', 'Sana'])
      filteredClosedSubmissions.forEach(s => {
        rows.push([
          `"${(s.student?.fullName || s.student?.username || '').replace(/"/g, '""')}"`,
          s.student?.username || '',
          `"${(s.quiz?.title || '').replace(/"/g, '""')}"`,
          `"${(s.quiz?.group?.name || 'Guruhsiz').replace(/"/g, '""')}"`,
          s.status === 'graded' ? 'Baholangan' : 'Kutilmoqda',
          s.score ?? '-',
          s.maxScore,
          new Date(s.submittedAt).toLocaleString('uz-UZ')
        ])
      })
    } else {
      filename = 'vazifalar-natijalari.csv'
      rows.push(['Talaba', 'Username', 'Vazifa nomi', 'Guruh', 'Holat', 'Ball', 'Maksimal ball', 'Sana'])
      filteredAssignments.forEach(s => {
        rows.push([
          `"${(s.student?.fullName || s.student?.username || '').replace(/"/g, '""')}"`,
          s.student?.username || '',
          `"${(s.assignment?.title || '').replace(/"/g, '""')}"`,
          `"${(s.assignment?.group?.name || '').replace(/"/g, '""')}"`,
          s.status === 'graded' ? 'Baholangan' : 'Kutilmoqda',
          s.score ?? '-',
          s.assignment?.maxScore || 100,
          new Date(s.submittedAt).toLocaleString('uz-UZ')
        ])
      })
    }

    if (rows.length <= 1) {
      toast.error('Eksport qilish uchun ma\'lumot yo\'q')
      return
    }

    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Jadval yuklab olindi!')
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Monitoring va tahlil</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Natijalar va O{"'"}zlashtirish
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Talabalarning variantli testlar, yozma imtihonlar va uy vazifalaridan to{"'"}plagan barcha natijalari.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="v3-tugma text-xs py-2 px-3.5 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Ikon nom="fayl" olcham={15} />
          Excel (CSV) yuklab olish
        </button>
      </div>

      {/* Statistika Kartochkalari */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="v3-panel-karta p-4 space-y-1">
            <div className="text-[11px] text-[var(--v3-xira)] font-mono flex items-center justify-between">
              <span>Jami Quiz Urinishlar</span>
              <Ikon nom="quiz" olcham={14} className="text-[var(--v3-urgu)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.totalQuizAttempts}
            </div>
          </div>

          <div className="v3-panel-karta p-4 space-y-1">
            <div className="text-[11px] text-[var(--v3-xira)] font-mono flex items-center justify-between">
              <span>O{"'"}rtacha Natija</span>
              <Ikon nom="grafik" olcham={14} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-urgu)]">
              {stats.avgOpenQuizScore}%
            </div>
          </div>

          <div className="v3-panel-karta p-4 space-y-1">
            <div className="text-[11px] text-[var(--v3-xira)] font-mono flex items-center justify-between">
              <span>Tekshirish Kutilmoqda</span>
              <Ikon nom="vaqt" olcham={14} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {stats.pendingGrading}
            </div>
          </div>

          <div className="v3-panel-karta p-4 space-y-1">
            <div className="text-[11px] text-[var(--v3-xira)] font-mono flex items-center justify-between">
              <span>Vazifa Topshiriqlari</span>
              <Ikon nom="kitob" olcham={14} className="text-[var(--v3-urgu-2)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-matn)]">
              {stats.totalAssignmentSubmissions}
            </div>
          </div>
        </div>
      )}

      {/* Filter va Tablar paneli */}
      <div className="v3-panel-karta p-4 space-y-4">
        {/* Turi bo'yicha tablar */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[var(--v3-chiziq)]">
          <button
            type="button"
            onClick={() => { setActiveTab('open'); setStatusFilter('all') }}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeTab === 'open' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="quiz" olcham={14} />
            Variantli Testlar ({openQuizAttempts.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('closed'); setStatusFilter('all') }}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeTab === 'closed' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="qulf" olcham={14} />
            Yozma Ishlar ({closedQuizSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('assignments'); setStatusFilter('all') }}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeTab === 'assignments' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="kitob" olcham={14} />
            Vazifalar ({assignmentSubmissions.length})
          </button>
        </div>

        {/* Qidiruv va Guruh filtri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Talaba yoki test nomi bo'yicha qidirish..."
              className="v3-kiritish text-xs py-2 pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
              <Ikon nom="qidiruv" olcham={13} />
            </span>
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="v3-kiritish text-xs py-2"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="v3-kiritish text-xs py-2"
          >
            <option value="all">Barcha holatlar</option>
            {activeTab === 'open' ? (
              <>
                <option value="passed">✓ O{"'"}tganlar</option>
                <option value="failed">✗ Yiqilganlar</option>
              </>
            ) : (
              <>
                <option value="pending">⏳ Tekshirish kutilmoqda</option>
                <option value="graded">✓ Baholanganlar</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ─── JADVAL QISMI ─── */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
          <Ikon nom="vaqt" olcham={18} className="animate-spin" />
          <span>Natijalar yuklanmoqda...</span>
        </div>
      ) : (
        <div className="v3-panel-karta overflow-hidden">
          {/* 1. VARIANTLI TESTLAR JADVALI */}
          {activeTab === 'open' && (
            filteredOpenAttempts.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
                Variantli test natijalari topilmadi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-[10.5px] font-mono uppercase text-[var(--v3-xira)]">
                      <th className="py-3 px-4">Talaba</th>
                      <th className="py-3 px-4">Test Nomi</th>
                      <th className="py-3 px-4">Guruh</th>
                      <th className="py-3 px-4 text-center">Ball</th>
                      <th className="py-3 px-4 text-center">Ko{"'"}rsatkich</th>
                      <th className="py-3 px-4 text-right">Topshirilgan vaqt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v3-chiziq)] text-xs">
                    {filteredOpenAttempts.map((att) => {
                      const passed = att.percentage >= (att.quiz?.passingScore || 60)
                      const ism = att.student?.fullName || att.student?.username || 'Talaba'

                      return (
                        <tr key={att.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                          <td className="py-3 px-4">
                            <Link
                              href={`/profil/${att.student?.userId || att.student?.id}`}
                              className="flex items-center gap-2.5 group"
                            >
                              <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                                {att.student?.avatar ? (
                                  <img src={att.student.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  ism[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors inline-flex items-center gap-1">
                                  <span>{ism}</span>
                                  <TasdiqBelgisi tasdiqlangan={att.student?.isVerified} olcham="kichik" />
                                </div>
                                <div className="text-[10px] font-mono text-[var(--v3-xira)]">
                                  @{att.student?.username}
                                </div>
                              </div>
                            </Link>
                          </td>

                          <td className="py-3 px-4 font-semibold text-[var(--v3-matn)]">
                            {att.quiz?.title}
                          </td>

                          <td className="py-3 px-4">
                            <span className="v3-tag v3-tag-ochiq text-[10px]">
                              {att.quiz?.group?.name || 'Ommaviy'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold text-[var(--v3-matn)]">
                            {att.score} / {att.maxScore}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${
                              passed
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {att.percentage.toFixed(0)}%
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-mono text-[11px] text-[var(--v3-xira)]">
                            {new Date(att.completedAt).toLocaleString('uz-UZ', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* 2. YOZMA ISHLAR JADVALI */}
          {activeTab === 'closed' && (
            filteredClosedSubmissions.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
                Yozma imtihon topshiriqlari topilmadi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-[10.5px] font-mono uppercase text-[var(--v3-xira)]">
                      <th className="py-3 px-4">Talaba</th>
                      <th className="py-3 px-4">Imtihon Nomi</th>
                      <th className="py-3 px-4">Holat</th>
                      <th className="py-3 px-4 text-center">Ball</th>
                      <th className="py-3 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v3-chiziq)] text-xs">
                    {filteredClosedSubmissions.map((sub) => {
                      const ism = sub.student?.fullName || sub.student?.username || 'Talaba'

                      return (
                        <tr key={sub.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[var(--v3-matn)]">{ism}</div>
                            <div className="text-[10px] font-mono text-[var(--v3-xira)]">@{sub.student?.username}</div>
                          </td>

                          <td className="py-3 px-4 font-semibold text-[var(--v3-matn)]">
                            {sub.quiz?.title}
                          </td>

                          <td className="py-3 px-4">
                            {sub.status === 'pending' ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                                ⏳ Kutilmoqda
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono">
                                ✓ Baholangan
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold">
                            {sub.score !== null ? `${sub.score} / ${sub.maxScore}` : '—'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/ustoz/yopiq-quiz?quizId=${sub.quiz?.id || ''}`}
                              className="v3-tugma text-[11px] py-1 px-2.5 inline-flex"
                            >
                              Baholash →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* 3. VAZIFALAR NATIJALARI */}
          {activeTab === 'assignments' && (
            filteredAssignments.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
                Vazifa topshiriqlari topilmadi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-[10.5px] font-mono uppercase text-[var(--v3-xira)]">
                      <th className="py-3 px-4">Talaba</th>
                      <th className="py-3 px-4">Vazifa Nomi</th>
                      <th className="py-3 px-4">Guruh</th>
                      <th className="py-3 px-4">Holat</th>
                      <th className="py-3 px-4 text-center">Ball</th>
                      <th className="py-3 px-4 text-right">Topshirilgan</th>
                      <th className="py-3 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v3-chiziq)] text-xs">
                    {filteredAssignments.map((sub) => {
                      const ism = sub.student?.fullName || sub.student?.username || 'Talaba'

                      return (
                        <tr key={sub.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                          <td className="py-3 px-4">
                            <Link
                              href={`/profil/${sub.student?.userId || sub.student?.id}`}
                              className="font-semibold text-[var(--v3-matn)] hover:text-[var(--v3-urgu)] transition-colors block"
                            >
                              {ism}
                            </Link>
                            <div className="text-[10px] font-mono text-[var(--v3-xira)]">@{sub.student?.username}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-[var(--v3-matn)]">{sub.assignment?.title}</div>
                            {sub.isLate && (
                              <span className="text-[10px] font-mono text-red-400">⏰ Kechikib topshirilgan</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className="v3-tag v3-tag-yopiq text-[10px]">
                              {sub.assignment?.group?.name || 'Guruh'}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {sub.status === 'pending' ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                                ⏳ Kutilmoqda
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono">
                                ✓ Baholangan
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold text-[var(--v3-urgu)]">
                            {sub.score !== null ? `${sub.score} / ${sub.assignment?.maxScore || 100}` : '—'}
                          </td>

                          <td className="py-3 px-4 text-right font-mono text-[11px] text-[var(--v3-xira)]">
                            {new Date(sub.submittedAt).toLocaleString('uz-UZ', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => openAssignmentGradeModal(sub)}
                              className={`v3-tugma text-[11px] py-1 px-2.5 inline-flex ${
                                sub.status === 'pending' ? 'v3-tugma-asosiy font-bold' : ''
                              }`}
                            >
                              {sub.status === 'pending' ? 'Baholash' : 'Ko\'rish / Tahrirlash'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}

      {/* VAZIFA TOPSHIRIG'INI KO'RISH VA BAHOLASH MODALI */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
              <div>
                <div className="v3-nishon">Vazifa topshirig{"'"}i</div>
                <h3 className="font-bold text-base text-[var(--v3-matn)]">
                  {gradingSubmission.assignment?.title}
                </h3>
                <p className="text-xs text-[var(--v3-xira)] mt-0.5">
                  Talaba: <strong className="text-[var(--v3-matn)]">{gradingSubmission.student?.fullName || gradingSubmission.student?.username}</strong> (@{gradingSubmission.student?.username})
                  {gradingSubmission.isLate && <span className="ml-2 text-red-400 font-mono">• Kechikib topshirilgan</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="p-1.5 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {/* Talaba javobi */}
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-mono uppercase text-[var(--v3-xira)] mb-1">
                  Talaba yozgan javob:
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-matn)] whitespace-pre-wrap leading-relaxed">
                  {gradingSubmission.textAnswer || 'Matnli javob yozilmagan'}
                </div>
              </div>

              {Array.isArray(gradingSubmission.fileUrls) && gradingSubmission.fileUrls.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase text-[var(--v3-xira)] mb-1.5">
                    Biriktirilgan fayllar ({gradingSubmission.fileUrls.length} ta):
                  </div>
                  <div className="space-y-1.5">
                    {gradingSubmission.fileUrls.map((f, idx) => {
                      const url = typeof f === 'string' ? f : f.url
                      const name = typeof f === 'string' ? `Fayl #${idx + 1}` : (f.name || `Fayl #${idx + 1}`)
                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-colors"
                        >
                          <span className="inline-flex items-center gap-2 truncate">
                            <Ikon nom="fayl" olcham={14} className="text-[var(--v3-urgu)] shrink-0" />
                            <span className="truncate">{name}</span>
                          </span>
                          <span className="text-[11px] font-mono text-[var(--v3-urgu)] shrink-0">Ochish ↗</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Baho va Izoh */}
            <div className="pt-3 border-t border-[var(--v3-chiziq)] space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="v3-yorliq mb-0">
                    Ball (0 — {gradingSubmission.assignment?.maxScore || 100}) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[100, 80, 60].map((pct) => {
                      const val = Math.round(((gradingSubmission.assignment?.maxScore || 100) * pct) / 100)
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setGradeScore(String(val))}
                          className="px-2 py-0.5 rounded bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[10px] font-mono text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                        >
                          {pct}% ({val})
                        </button>
                      )
                    })}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={gradingSubmission.assignment?.maxScore || 100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  className="v3-kiritish font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="v3-yorliq">Ustoz izohi (ixtiyoriy)</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={3}
                  placeholder="Talabaga xatolari va yutuqlari haqida izoh yozing..."
                  className="v3-kiritish text-xs resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                disabled={isGrading}
                className="v3-tugma text-xs py-2 px-4"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleAssignmentGradeSave}
                disabled={isGrading}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold"
              >
                {isGrading ? 'Saqlanmoqda...' : '✓ Bahoni saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
