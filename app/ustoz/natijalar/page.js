"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { vedomostPDFYuklab } from '@/lib/vedomost-pdf'

export default function NatijalarPage() {
  const { data: session } = useSession()
  const [quizAttempts, setQuizAttempts] = useState([])
  const [closedQuizSubmissions, setClosedQuizSubmissions] = useState([])
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([])
  const [groups, setGroups] = useState([])
  const [stats, setStats] = useState({
    totalQuizAttempts: 0,
    totalClosedSubmissions: 0,
    totalAssignmentSubmissions: 0,
    avgQuizScore: 0,
    pendingGrading: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filtrlar
  const [activeTab, setActiveTab] = useState('quiz') // 'quiz' | 'yozma' | 'vazifa'
  const [filterGroup, setFilterGroup] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchNatijalar()
  }, [filterGroup])

  const fetchNatijalar = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        groupId: filterGroup
      })
      const res = await fetch(`/api/ustoz/natijalar?${params}`)
      const data = await res.json()

      if (res.ok) {
        setQuizAttempts(data.quizAttempts || [])
        setClosedQuizSubmissions(data.closedQuizSubmissions || [])
        setAssignmentSubmissions(data.assignmentSubmissions || [])
        setGroups(data.groups || [])
        setStats(data.stats || {})
      } else {
        toast.error(data.error || 'Natijalarni yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Natijalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  // Variantli quiz filtri
  const filteredQuizAttempts = quizAttempts.filter(attempt => {
    const name = (attempt.student?.fullName || attempt.student?.username || '').toLowerCase()
    const title = (attempt.quiz?.title || '').toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || title.includes(q)
  })

  // Yozma quiz filtri
  const filteredClosedSubmissions = closedQuizSubmissions.filter(sub => {
    const name = (sub.student?.fullName || sub.student?.username || '').toLowerCase()
    const title = (sub.quiz?.title || '').toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || title.includes(q)
  })

  // Vazifa filtri
  const filteredAssignments = assignmentSubmissions.filter(sub => {
    const name = (sub.student?.fullName || sub.student?.username || '').toLowerCase()
    const title = (sub.assignment?.title || '').toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || title.includes(q)
  })

  const vaqtFormat = (soniya) => {
    if (!soniya) return '0 daq'
    const m = Math.floor(soniya / 60)
    const s = soniya % 60
    return m > 0 ? `${m} daq ${s} son` : `${s} son`
  }

  const exportPDF = async () => {
    try {
      const guruhNomi = filterGroup === 'all'
        ? 'Barcha guruhlar'
        : groups.find(g => g.id === filterGroup)?.name || 'Guruh'

      let qatorlar = []
      let testNomi = 'Variantli va Yozma testlar'

      if (activeTab === 'quiz') {
        testNomi = 'Variantli testlar natijalari'
        qatorlar = filteredQuizAttempts.map(a => ({
          ism: a.student?.fullName || a.student?.username,
          username: a.student?.username || 'user',
          ball: `${a.score}/${a.maxScore}`,
          foiz: a.percentage || 0,
          otdimi: (a.percentage || 0) >= (a.quiz?.passingScore || 60),
          sana: a.completedAt
        }))
      } else if (activeTab === 'yozma') {
        testNomi = 'Yozma testlar natijalari'
        qatorlar = filteredClosedSubmissions.map(s => ({
          ism: s.student?.fullName || s.student?.username,
          username: s.student?.username || 'user',
          ball: s.score !== null ? `${s.score}/${s.quiz?.maxScore}` : 'Tekshirilmoqda',
          foiz: s.score !== null && s.quiz?.maxScore ? (s.score / s.quiz.maxScore) * 100 : 0,
          otdimi: s.score !== null && s.quiz?.maxScore ? (s.score / s.quiz.maxScore) >= 0.6 : false,
          sana: s.submittedAt
        }))
      } else {
        testNomi = 'Vazifalar natijalari'
        qatorlar = filteredAssignments.map(s => ({
          ism: s.student?.fullName || s.student?.username,
          username: s.student?.username || 'user',
          ball: s.score !== null ? `${s.score}/${s.assignment?.maxScore}` : '—',
          foiz: s.score !== null && s.assignment?.maxScore ? (s.score / s.assignment.maxScore) * 100 : 0,
          otdimi: s.score !== null && s.assignment?.maxScore ? (s.score / s.assignment.maxScore) >= 0.6 : false,
          sana: s.submittedAt
        }))
      }

      if (qatorlar.length === 0) {
        toast.error('Yuklab olish uchun natijalar mavjud emas')
        return
      }

      toast.loading('PDF vedomost tayyorlanmoqda...', { id: 'pdf' })
      await vedomostPDFYuklab({
        ustozNomi: session?.user?.fullName || session?.user?.username || 'O\'qituvchi',
        guruhNomi,
        testNomi,
        qatorlar
      })
      toast.success('Vedomost muvaffaqiyatli yuklandi!', { id: 'pdf' })
    } catch (err) {
      toast.error('PDF yaratishda xatolik: ' + err.message, { id: 'pdf' })
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Tahlil va Natijalar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Talabalar Natijalari Paneli
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Faqat siz yaratgan test va topshiriqlarga oid urinishlar hamda baholash hisoboti.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={exportPDF}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-3.5 font-bold inline-flex items-center gap-1.5"
            title="Akademik vedomostni PDF formatida yuklab olish"
          >
            <Ikon nom="fayl" olcham={15} />
            PDF Vedomost
          </button>

          <button
            type="button"
            onClick={fetchNatijalar}
            className="v3-tugma text-xs py-2 px-3"
          >
            <Ikon nom="qayta" olcham={14} />
            Yangilash
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">Variantli test urinishlari</div>
          <div className="text-2xl font-bold font-mono text-[var(--v3-matn)] mt-1">{stats.totalQuizAttempts}</div>
        </div>

        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">Yozma topshirilgan ishlar</div>
          <div className="text-2xl font-bold font-mono text-[var(--v3-matn)] mt-1">{stats.totalClosedSubmissions}</div>
        </div>

        <div className="v3-panel-karta p-4">
          <div className="text-xs text-[var(--v3-xira)] font-medium">O{"'"}rtacha o{"'"}zlashtirish</div>
          <div className="text-2xl font-bold font-mono text-[var(--v3-urgu)] mt-1">
            {stats.avgQuizScore ? `${stats.avgQuizScore.toFixed(1)}%` : '0%'}
          </div>
        </div>

        <div className={`v3-panel-karta p-4 ${stats.pendingGrading > 0 ? 'border-l-4 border-l-[var(--v3-urgu)]' : ''}`}>
          <div className="text-xs text-[var(--v3-xira)] font-medium">Baholash kutilmoqda</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${stats.pendingGrading > 0 ? 'text-[var(--v3-urgu)]' : 'text-[var(--v3-matn)]'}`}>
            {stats.pendingGrading}
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="v3-panel-karta p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`v3-tugma text-xs py-1.5 px-3 whitespace-nowrap ${activeTab === 'quiz' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="quiz" olcham={14} />
            Variantli testlar ({quizAttempts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('yozma')}
            className={`v3-tugma text-xs py-1.5 px-3 whitespace-nowrap ${activeTab === 'yozma' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="fayl" olcham={14} />
            Yozma testlar ({closedQuizSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vazifa')}
            className={`v3-tugma text-xs py-1.5 px-3 whitespace-nowrap ${activeTab === 'vazifa' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="kitob" olcham={14} />
            Vazifalar ({assignmentSubmissions.length})
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Talaba yoki test nomi..."
              className="v3-kiritish text-xs py-1.5 pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
              <Ikon nom="qidiruv" olcham={13} />
            </span>
          </div>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="v3-kiritish text-xs py-1.5 md:w-44"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── TAB 1: VARIANTLI QUIZ NATIJALARI ─── */}
      {activeTab === 'quiz' && (
        <div className="v3-panel-karta p-0 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Natijalar yuklanmoqda...</span>
            </div>
          ) : filteredQuizAttempts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
              Variantli testlar bo{"'"}yicha natijalar topilmadi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--v3-yuza-2)] border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4">Talaba</th>
                    <th className="py-3 px-4">Test sarlavhasi</th>
                    <th className="py-3 px-4">Guruh</th>
                    <th className="py-3 px-4 text-center">To{"'"}plangan ball</th>
                    <th className="py-3 px-4 text-center">Foiz</th>
                    <th className="py-3 px-4">Sarflangan vaqt</th>
                    <th className="py-3 px-4 text-right">Topshirilgan vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v3-chiziq)] font-sans">
                  {filteredQuizAttempts.map((attempt) => {
                    const isPassed = (attempt.percentage || 0) >= (attempt.quiz?.passingScore || 60)

                    return (
                      <tr key={attempt.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--v3-matn)]">
                            {attempt.student?.fullName || attempt.student?.username}
                          </div>
                          <div className="text-[10px] text-[var(--v3-xira)] font-mono">
                            @{attempt.student?.username}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-[220px]">
                          <div className="font-semibold text-[var(--v3-matn)] truncate">
                            {attempt.quiz?.title}
                          </div>
                          <div className="text-[10px] text-[var(--v3-xira)]">
                            {attempt.quiz?.isPublic ? 'Ommaviy test' : 'Guruhli test'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[11px] text-[var(--v3-xira)]">
                            {attempt.quiz?.group?.name || '—'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-bold text-[var(--v3-matn)]">
                          {attempt.score} / {attempt.maxScore}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            isPassed
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {(attempt.percentage || 0).toFixed(1)}%
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[var(--v3-xira)]">
                          {vaqtFormat(attempt.timeSpent)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-[var(--v3-xira)]">
                          {new Date(attempt.completedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: YOZMA QUIZ NATIJALARI ─── */}
      {activeTab === 'yozma' && (
        <div className="v3-panel-karta p-0 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Natijalar yuklanmoqda...</span>
            </div>
          ) : filteredClosedSubmissions.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
              Yozma testlar bo{"'"}yicha topshiriqlar topilmadi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--v3-yuza-2)] border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4">Talaba</th>
                    <th className="py-3 px-4">Test sarlavhasi</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4 text-center">Baho</th>
                    <th className="py-3 px-4">Topshirilgan vaqt</th>
                    <th className="py-3 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v3-chiziq)] font-sans">
                  {filteredClosedSubmissions.map((sub) => {
                    const isGraded = sub.status === 'graded'

                    return (
                      <tr key={sub.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--v3-matn)]">
                            {sub.student?.fullName || sub.student?.username}
                          </div>
                          <div className="text-[10px] text-[var(--v3-xira)] font-mono">
                            @{sub.student?.username}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-[240px]">
                          <div className="font-semibold text-[var(--v3-matn)] truncate">
                            {sub.quiz?.title}
                          </div>
                          <div className="text-[10px] text-[var(--v3-xira)]">
                            {sub.quiz?.group?.name || 'Umumiy'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[10.5px] ${
                            isGraded
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}>
                            <Ikon nom={isGraded ? 'belgi' : 'vaqt'} olcham={11} />
                            {isGraded ? 'Baholangan' : 'Kutilmoqda'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-bold text-[var(--v3-matn)]">
                          {isGraded ? `${sub.score} / ${sub.quiz?.maxScore}` : '—'}
                        </td>

                        <td className="py-3 px-4 font-mono text-[var(--v3-xira)]">
                          {new Date(sub.submittedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/ustoz/yopiq-quiz`}
                            className="v3-tugma text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                          >
                            <Ikon nom="orin" olcham={12} />
                            {isGraded ? 'Qayta ko\'rish' : 'Baholash'}
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: VAZIFALAR NATIJALARI ─── */}
      {activeTab === 'vazifa' && (
        <div className="v3-panel-karta p-0 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Natijalar yuklanmoqda...</span>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--v3-xira)]">
              Vazifalar bo{"'"}yicha topshiriqlar topilmadi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--v3-yuza-2)] border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4">Talaba</th>
                    <th className="py-3 px-4">Vazifa</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4 text-center">Baho</th>
                    <th className="py-3 px-4 text-right">Topshirilgan vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v3-chiziq)] font-sans">
                  {filteredAssignments.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[var(--v3-matn)]">
                          {sub.student?.fullName || sub.student?.username}
                        </div>
                        <div className="text-[10px] text-[var(--v3-xira)] font-mono">
                          @{sub.student?.username}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[var(--v3-matn)]">
                          {sub.assignment?.title}
                        </div>
                        <div className="text-[10px] text-[var(--v3-xira)]">
                          {sub.assignment?.group?.name || 'Guruh'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[10.5px] ${
                          sub.status === 'graded'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {sub.status === 'graded' ? 'Baholangan' : 'Kutilmoqda'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-[var(--v3-matn)]">
                        {sub.score !== null ? `${sub.score} / ${sub.assignment?.maxScore || 100}` : '—'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[var(--v3-xira)]">
                        {new Date(sub.submittedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
