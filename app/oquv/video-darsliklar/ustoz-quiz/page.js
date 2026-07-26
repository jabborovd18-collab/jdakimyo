// app/oquv/video-darsliklar/ustoz-quiz/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UstozQuizlarPage() {
  const { data: session } = useSession()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, mine, available
  const [search, setSearch] = useState('')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  useEffect(() => {
    fetchQuizzes()
  }, [filter, search])

  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ filter, search })
      const res = await fetch(`/api/oquv/ustoz-quiz?${params}`)
      const data = await res.json()
      if (res.ok) setQuizzes(data.quizzes)
    } catch (error) {
      toast.error('Quizlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizClick = (quiz) => {
    if (quiz.accessCode && !quiz.hasAccess) {
      setSelectedQuiz(quiz)
      setShowCodeModal(true)
    } else {
      window.location.href = `/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`
    }
  }

  const handleCodeSubmit = async () => {
    if (!accessCode.trim()) {
      toast.error('Kodni kiriting!')
      return
    }
    
    try {
      const res = await fetch('/api/oquv/ustoz-quiz/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quizId: selectedQuiz.id, 
          code: accessCode 
        })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success('✓ Kod tasdiqlandi!')
      setShowCodeModal(false)
      setAccessCode('')
      setSelectedQuiz(null)
      window.location.href = `/oquv/video-darsliklar/ustoz-quiz/${selectedQuiz.id}`
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getStatusBadge = (quiz) => {
    if (quiz.userAttempt) {
      const passed = quiz.userAttempt.percentage >= (quiz.passingScore || 60)
      return {
        text: passed ? '✓ Topshirilgan' : '✗ Topshirilgan',
        class: passed 
          ? 'bg-green-600/20 text-green-400 border-green-600/30' 
          : 'bg-orange-600/20 text-orange-400 border-orange-600/30',
        score: `${quiz.userAttempt.percentage.toFixed(0)}%`
      }
    }
    if (quiz.accessCode && !quiz.hasAccess) {
      return {
        text: '🔑 Kod kerak',
        class: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
      }
    }
    return {
      text: '🆕 Yangi',
      class: 'bg-blue-600/20 text-blue-400 border-blue-600/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-purple-950/95 backdrop-blur-xl border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/oquv/video-darsliklar"
              className="w-10 h-10 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-bold">🎓 Ustoz Quizlari</h1>
              <p className="text-xs text-purple-400">O'qituvchilar bergan testlar</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Quiz nomi yoki ustoz bo'yicha qidirish..."
            className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 outline-none"
          />
          <div className="flex gap-2">
            {[
              { id: 'all', label: '📚 Barchasi' },
              { id: 'mine', label: '👨‍🏫 Ustozlarim' },
              { id: 'new', label: '🆕 Yangi' },
              { id: 'completed', label: '✓ Topshirilgan' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quizlar */}
        {isLoading ? (
          <div className="text-center py-12 text-purple-300">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p>Yuklanmoqda...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-2xl font-bold mb-2">Quizlar topilmadi</h3>
            <p className="text-purple-300">Hozircha sizga berilgan testlar yo'q</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map(quiz => {
              const status = getStatusBadge(quiz)
              return (
                <div
                  key={quiz.id}
                  onClick={() => handleQuizClick(quiz)}
                  className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-5 hover:border-yellow-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${status.class}`}>
                        {status.text}
                      </span>
                      {status.score && (
                        <span className="text-xs text-yellow-400 font-bold">
                          {status.score}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-purple-400">
                      {quiz.difficulty === 'easy' && '🟢'}
                      {quiz.difficulty === 'medium' && '🟡'}
                      {quiz.difficulty === 'hard' && '🟠'}
                      {quiz.difficulty === 'expert' && '🔴'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {quiz.title}
                  </h3>

                  {quiz.description && (
                    <p className="text-sm text-purple-300 mb-3 line-clamp-2">
                      {quiz.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-purple-400 mb-3">
                    <span>👨‍🏫 {quiz.teacher?.fullName || 'Ustoz'}</span>
                    <span>📝 {quiz._count?.questions || 0} savol</span>
                    <span>⏱️ {quiz.timeLimit} daq</span>
                  </div>

                  {quiz.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {quiz.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-800/50 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-purple-800/30 flex items-center justify-between">
                    <span className="text-xs text-purple-400">
                      📅 {new Date(quiz.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                    <span className="text-xs text-yellow-400 font-semibold group-hover:translate-x-1 transition-transform">
                      Boshlash →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Kod kiritish modal */}
      {showCodeModal && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-yellow-600/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              🔑 Maxfiy kod kerak
            </h3>
            <p className="text-sm text-purple-300 mb-4">
              "{selectedQuiz.title}" quiziga kirish uchun ustozi bergan kodni kiriting.
            </p>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
              className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none text-center text-xl font-mono tracking-widest"
              placeholder="XXXXXX"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowCodeModal(false)
                  setAccessCode('')
                  setSelectedQuiz(null)
                }}
                className="flex-1 py-3 bg-purple-800/50 rounded-xl"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCodeSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
              >
                ✓ Kirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}