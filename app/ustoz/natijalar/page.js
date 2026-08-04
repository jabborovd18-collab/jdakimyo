// app/ustoz/natijalar/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function NatijalarPage() {
  const { data: session } = useSession()
  const [quizAttempts, setQuizAttempts] = useState([])
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([])
  const [groups, setGroups] = useState([])
  const [stats, setStats] = useState({
    totalQuizAttempts: 0,
    totalAssignmentSubmissions: 0,
    avgQuizScore: 0,
    pendingGrading: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filtrlar
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterType, setFilterType] = useState('all') // all | quiz | assignment
  const [searchQuery, setSearchQuery] = useState('')

  // Tur bo'yicha filtr pastda, ro'yxatni chizishda qo'llanadi — server
  // uni baribir hisobga olmasdi. Shuning uchun u o'zgarganda qayta
  // so'rov yubormaymiz: ma'lumot allaqachon qo'lda.
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
        setAssignmentSubmissions(data.assignmentSubmissions || [])
        setGroups(data.groups || [])
        setStats(data.stats || {})
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Natijalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  // Qidiruv bo'yicha filtrlash
  const filteredQuizAttempts = quizAttempts.filter(attempt =>
    attempt.student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attempt.student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attempt.quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSubmissions = assignmentSubmissions.filter(sub =>
    sub.student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
      graded: 'bg-green-600/20 text-green-400 border-green-600/30',
      late: 'bg-red-600/20 text-red-400 border-red-600/30'
    }
    return badges[status] || badges.pending
  }

  const getAssignmentTypeLabel = (type) => {
    const labels = {
      lab: '🧪 Laboratoriya',
      essay: '📝 Esse',
      quiz_open: '❓ Variantli quiz',
      quiz_closed: '✍️ Variantsiz quiz',
      homework: '📚 Uy vazifasi',
      project: '🔬 Loyiha'
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Natijalar</h1>
          <p className="text-purple-300 mt-1">
            Quiz va vazifa natijalari
          </p>
        </div>
        <Link
          href="/ustoz"
          className="px-5 py-2.5 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-xl text-purple-200"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-5">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-3xl font-bold text-blue-400">{stats.totalQuizAttempts}</div>
          <div className="text-xs text-purple-300">Quiz urinishlari</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-2xl p-5">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-3xl font-bold text-purple-400">{stats.totalAssignmentSubmissions}</div>
          <div className="text-xs text-purple-300">Vazifa topshiriqlari</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-2xl p-5">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-green-400">
            {stats.avgQuizScore.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-300">O'rtacha quiz bali</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-700/50 rounded-2xl p-5">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-3xl font-bold text-orange-400">{stats.pendingGrading}</div>
          <div className="text-xs text-purple-300">Tekshirish kerak</div>
        </div>
      </div>

      {/* Filtrlar */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Talaba yoki vazifa nomi bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <div className="flex flex-wrap gap-3">
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

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none text-sm"
          >
            <option value="all">📊 Barcha natijalar</option>
            <option value="quiz">❓ Faqat quizlar</option>
            <option value="assignment">📋 Faqat vazifalar</option>
          </select>
        </div>
      </div>

      {/* Natijalar */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>Natijalar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quiz Natijalari */}
          {(filterType === 'all' || filterType === 'quiz') && filteredQuizAttempts.length > 0 && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>❓</span> Quiz Natijalari ({filteredQuizAttempts.length})
              </h2>
              <div className="space-y-3">
                {filteredQuizAttempts.map(attempt => (
                  <div
                    key={attempt.id}
                    className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold text-black flex-shrink-0 overflow-hidden">
                          {attempt.student.avatar ? (
                            <img src={attempt.student.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (attempt.student.fullName?.charAt(0) || '?').toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/profil/${attempt.student.userId}`}
                            className="text-white font-semibold hover:text-yellow-400 transition-colors"
                          >
                            {attempt.student.fullName || attempt.student.username}
                          </Link>
                          <div className="text-sm text-purple-300 mt-1">
                            {attempt.quiz.title}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-purple-400 flex-wrap">
                            {attempt.quiz.group && (
                              <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-full">
                                📚 {attempt.quiz.group.name}
                              </span>
                            )}
                            <span>
                              📅 {new Date(attempt.completedAt).toLocaleDateString('uz-UZ', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                            <span>⏱️ {Math.floor(attempt.timeSpent / 60)}:{String(attempt.timeSpent % 60).padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                          {attempt.percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-purple-400 mt-1">
                          {attempt.score}/{attempt.maxScore} ball
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vazifa Natijalari */}
          {(filterType === 'all' || filterType === 'assignment') && filteredSubmissions.length > 0 && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📋</span> Vazifa Natijalari ({filteredSubmissions.length})
              </h2>
              <div className="space-y-3">
                {filteredSubmissions.map(sub => (
                  <div
                    key={sub.id}
                    className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0 overflow-hidden">
                          {sub.student.avatar ? (
                            <img src={sub.student.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (sub.student.fullName?.charAt(0) || '?').toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/profil/${sub.student.userId}`}
                            className="text-white font-semibold hover:text-yellow-400 transition-colors"
                          >
                            {sub.student.fullName || sub.student.username}
                          </Link>
                          <div className="text-sm text-purple-300 mt-1">
                            {sub.assignment.title}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-purple-400 flex-wrap">
                            {sub.assignment.group && (
                              <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-full">
                                📚 {sub.assignment.group.name}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded-full">
                              {getAssignmentTypeLabel(sub.assignment.type)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full border ${getStatusBadge(sub.status)}`}>
                              {sub.status === 'pending' ? '⏳ Kutilmoqda' : 
                               sub.status === 'graded' ? '✓ Baholangan' : '⚠️ Kechikkan'}
                            </span>
                          </div>
                          {sub.feedback && (
                            <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-xs text-yellow-300">
                              💬 {sub.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {sub.status === 'graded' ? (
                          <>
                            <div className="text-2xl font-bold text-green-400">
                              {((sub.score / sub.assignment.maxScore) * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-purple-400 mt-1">
                              {sub.score}/{sub.assignment.maxScore} ball
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-orange-400 font-semibold">
                            Kutilmoqda
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bo'sh holat */}
          {filteredQuizAttempts.length === 0 && filteredSubmissions.length === 0 && (
            <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
              <div className="text-7xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-white mb-2">Natijalar topilmadi</h3>
              <p className="text-purple-300">
                {searchQuery || filterGroup !== 'all' || filterType !== 'all'
                  ? 'Filtrlarni o\'zgartirib ko\'ring'
                  : 'Hali hech kim quiz yechmagan yoki vazifa topshirmagan'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}