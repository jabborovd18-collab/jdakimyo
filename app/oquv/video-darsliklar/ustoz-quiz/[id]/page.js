// app/oquv/video-darsliklar/ustoz-quiz/[id]/page.js
"use client"
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UstozQuizSolvePage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const quizId = params.id

  const [quiz, setQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [needCode, setNeedCode] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  // Quiz holatlari
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Natija
  const [results, setResults] = useState(null)
  const [showReview, setShowReview] = useState(false)

  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  // Timer
  useEffect(() => {
    if (!started || timeLeft === null || results) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmit(true) // vaqt tugadi
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [started, results])

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/oquv/ustoz-quiz/${quizId}`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403 && data.needCode) {
          setNeedCode(true)
          setQuiz({ title: data.quizTitle })
          return
        }
        throw new Error(data.error)
      }

      setQuiz(data.quiz)
      if (!data.canAttempt) {
        setError('Siz maksimal urinishlar soniga yetdingiz')
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
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
        body: JSON.stringify({ quizId, code: accessCode })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success('✓ Kod tasdiqlandi!')
      setNeedCode(false)
      fetchQuiz()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStart = () => {
    setStarted(true)
    startTimeRef.current = Date.now()
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60) // daqiqadan soniyaga
    }
    // Javoblarni boshlash
    const initialAnswers = {}
    quiz.questions.forEach(q => {
      initialAnswers[q.id] = { questionId: q.id, selected: -1 }
    })
    setAnswers(initialAnswers)
  }

  const handleAnswer = (questionId, selected) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, selected }
    }))
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return

    if (!autoSubmit) {
      const unanswered = Object.values(answers).filter(a => a.selected === -1).length
      if (unanswered > 0) {
        if (!confirm(`${unanswered} ta savolga javob bermagansiz. Baribir topshirasizmi?`)) {
          return
        }
      }
    }

    setIsSubmitting(true)
    clearInterval(timerRef.current)

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

    try {
      const res = await fetch(`/api/oquv/ustoz-quiz/${quizId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.values(answers),
          timeSpent
        })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setResults(data)

      if (data.passed) {
        toast.success(data.message, { duration: 5000, icon: '🎉' })
      } else {
        toast.error(data.message, { duration: 5000 })
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // ═══════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-7xl mb-4">⏳</div>
          <p className="text-purple-300 text-lg">Quiz yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════
  // ERROR
  // ═══════════════════════════════════════════
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Xatolik</h2>
          <p className="text-purple-300 mb-6">{error}</p>
          <Link
            href="/oquv/video-darsliklar/ustoz-quiz"
            className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-xl text-white font-semibold"
          >
            ← Quizlarga qaytish
          </Link>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════
  // KOD KIRITISH
  // ═══════════════════════════════════════════
  if (needCode) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/80 border border-yellow-600/50 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🔑</div>
            <h2 className="text-2xl font-bold text-white mb-2">Maxfiy kod talab qilinadi</h2>
            <p className="text-purple-300 text-sm">
              "{quiz.title}" quiziga kirish uchun ustozingiz bergan kodni kiriting
            </p>
          </div>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none text-center text-xl font-mono tracking-widest mb-4"
            placeholder="XXXXXX"
            autoFocus
          />
          <div className="flex gap-3">
            <Link
              href="/oquv/video-darsliklar/ustoz-quiz"
              className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl text-center text-purple-200"
            >
              ← Ortga
            </Link>
            <button
              onClick={handleCodeSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
            >
              ✓ Kirish
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════
  // NATIJA EKRANI
  // ═══════════════════════════════════════════
  if (results) {
    const correctCount = results.results.filter(r => r.isCorrect).length
    const wrongCount = results.results.filter(r => !r.isCorrect).length

    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-800/50 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/oquv/video-darsliklar/ustoz-quiz"
                className="w-10 h-10 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center"
              >
                ←
              </Link>
              <div>
                <h1 className="text-lg font-bold">Natija</h1>
                <p className="text-xs text-purple-400">{quiz.title}</p>
              </div>
            </div>
            <button
              onClick={() => setShowReview(!showReview)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                showReview
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
              }`}
            >
              {showReview ? '✕ Yashirish' : '📖 Batafsil ko\'rish'}
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Asosiy natija */}
          <div className={`bg-gradient-to-br ${
            results.passed
              ? 'from-green-900/40 to-emerald-900/40 border-green-700/50'
              : 'from-red-900/40 to-orange-900/40 border-red-700/50'
          } border rounded-3xl p-8 text-center`}>
            <div className="text-7xl mb-4">
              {results.passed ? '🎉' : '😔'}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.passed ? 'Tabriklaymiz!' : 'Afsuski, o\'tmadingiz'}
            </h2>
            <p className="text-lg text-purple-200 mb-6">
              {results.passed
                ? `Siz muvaffaqiyatli topshirdingiz!`
                : `O'tish bali: ${quiz.passingScore || 60}%`}
            </p>

            {/* Ball */}
            <div className="inline-flex items-baseline gap-2 mb-6">
              <span className={`text-7xl font-bold ${results.passed ? 'text-green-400' : 'text-red-400'}`}>
                {results.percentage.toFixed(1)}%
              </span>
              <span className="text-2xl text-purple-300">
                ({results.score}/{results.maxScore} ball)
              </span>
            </div>

            {/* XP mukofoti */}
            {results.passed && results.xpEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-6">
                <span className="text-2xl">⭐</span>
                <span className="text-lg font-bold text-yellow-300">
                  +{results.xpEarned} XP olindi!
                </span>
              </div>
            )}

            {/* Statistika */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-purple-950/50 rounded-xl p-4">
                <div className="text-3xl mb-1">✅</div>
                <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                <div className="text-xs text-purple-300">To'g'ri</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4">
                <div className="text-3xl mb-1">❌</div>
                <div className="text-2xl font-bold text-red-400">{wrongCount}</div>
                <div className="text-xs text-purple-300">Noto'g'ri</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4">
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-2xl font-bold text-purple-300">
                  {formatTime(Math.floor((Date.now() - startTimeRef.current) / 1000))}
                </div>
                <div className="text-xs text-purple-300">Vaqt</div>
              </div>
            </div>
          </div>

          {/* Harakatlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/oquv/video-darsliklar/ustoz-quiz"
              className="py-4 bg-purple-700 hover:bg-purple-600 rounded-xl text-center font-semibold transition-all"
            >
              📚 Boshqa quizlarga qaytish
            </Link>
            <Link
              href="/profil"
              className="py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-xl text-center font-bold transition-all"
            >
              👤 Profilim
            </Link>
          </div>

          {/* Batafsil ko'rib chiqish */}
          {showReview && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>📖</span> Batafsil natijalar
              </h3>
              {results.results.map((r, idx) => (
                <div
                  key={r.questionId}
                  className={`bg-slate-900/50 border rounded-2xl p-5 ${
                    r.isCorrect ? 'border-green-700/50' : 'border-red-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      r.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{r.questionText}</p>
                      <div className="text-xs text-purple-400 mb-3">
                        {r.isCorrect
                          ? `✓ To'g'ri • ${r.points}/${r.maxPoints} ball`
                          : `✗ Noto'g'ri • 0/${r.maxPoints} ball`}
                      </div>
                    </div>
                  </div>

                  {/* Variantlar */}
                  <div className="space-y-2 ml-11">
                    {r.options.map((opt, optIdx) => {
                      const isCorrectOption = optIdx === r.correctAnswer
                      const isUserChoice = optIdx === r.userAnswer
                      let bgClass = 'bg-purple-950/30 border-purple-800/30'
                      let icon = String.fromCharCode(65 + optIdx)

                      if (isCorrectOption) {
                        bgClass = 'bg-green-900/30 border-green-600/50'
                        icon = '✓'
                      } else if (isUserChoice && !isCorrectOption) {
                        bgClass = 'bg-red-900/30 border-red-600/50'
                        icon = '✗'
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${bgClass}`}
                        >
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            isCorrectOption ? 'bg-green-600 text-white' :
                            isUserChoice ? 'bg-red-600 text-white' :
                            'bg-purple-800/50 text-purple-300'
                          }`}>
                            {icon}
                          </span>
                          <span className={`text-sm ${
                            isCorrectOption ? 'text-green-200' :
                            isUserChoice ? 'text-red-200' :
                            'text-purple-300'
                          }`}>
                            {opt}
                          </span>
                          {isCorrectOption && (
                            <span className="ml-auto text-xs text-green-400 font-semibold">
                              To'g'ri javob
                            </span>
                          )}
                          {isUserChoice && !isCorrectOption && (
                            <span className="ml-auto text-xs text-red-400 font-semibold">
                              Sizning javobingiz
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Tushuntirish */}
                  {r.explanation && (
                    <div className="mt-3 ml-11 bg-blue-950/30 border border-blue-700/30 rounded-lg p-3">
                      <div className="text-xs text-blue-400 font-semibold mb-1">💡 Tushuntirish:</div>
                      <p className="text-sm text-blue-200">{r.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════
  // BOSHLASH EKRANI
  // ═══════════════════════════════════════════
  if (!started) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <header className="flex items-center gap-3 mb-8">
            <Link
              href="/oquv/video-darsliklar/ustoz-quiz"
              className="w-10 h-10 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center flex-shrink-0"
            >
              ←
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">Quiz ma'lumotlari</h1>
              <p className="text-xs text-purple-400">O'qishga tayyorlaning</p>
            </div>
          </header>

          {/* Quiz info card */}
          <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border border-purple-700/50 rounded-3xl p-6 sm:p-8 mb-6">
            <div className="text-6xl text-center mb-4">📝</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
              {quiz.title}
            </h2>
            {quiz.description && (
              <p className="text-purple-200 text-center mb-6">{quiz.description}</p>
            )}

            {/* Teacher info */}
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold text-black overflow-hidden">
                {quiz.teacher?.avatar ? (
                  <img src={quiz.teacher.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (quiz.teacher?.fullName?.charAt(0) || '?').toUpperCase()
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{quiz.teacher?.fullName}</div>
                <div className="text-xs text-purple-400">{quiz.teacher?.university || 'O\'qituvchi'}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-lg font-bold">{quiz.totalQuestions}</div>
                <div className="text-xs text-purple-400">Savol</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-lg font-bold">{quiz.maxScore}</div>
                <div className="text-xs text-purple-400">Ball</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-lg font-bold">
                  {quiz.timeLimit ? `${quiz.timeLimit} daq` : '∞'}
                </div>
                <div className="text-xs text-purple-400">Vaqt</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-lg font-bold">{quiz.passingScore || 60}%</div>
                <div className="text-xs text-purple-400">O'tish</div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4 space-y-2 text-sm">
              <h4 className="font-bold text-purple-200 mb-2">📋 Qoidalar:</h4>
              <div className="flex items-start gap-2 text-purple-300">
                <span>•</span>
                <span>Har bir savol uchun bitta variantni tanlang</span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-start gap-2 text-purple-300">
                  <span>•</span>
                  <span>Umumiy vaqt: <strong>{quiz.timeLimit} daqiqa</strong></span>
                </div>
              )}
              <div className="flex items-start gap-2 text-purple-300">
                <span>•</span>
                <span>Urinishlar: {quiz.maxAttempts === 99 ? 'cheksiz' : `${quiz.maxAttempts} marta`}</span>
              </div>
              <div className="flex items-start gap-2 text-purple-300">
                <span>•</span>
                <span>O'tish bali: <strong>{quiz.passingScore || 60}%</strong></span>
              </div>
              <div className="flex items-start gap-2 text-yellow-300">
                <span>⭐</span>
                <span>Topshirganingizda XP olasiz!</span>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-xl font-bold rounded-2xl shadow-xl shadow-yellow-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <span className="text-3xl">🚀</span>
            <span>Quizni boshlash</span>
          </button>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════
  // QUIZ YECHISH
  // ═══════════════════════════════════════════
  const question = quiz.questions[currentQuestion]
  const totalAnswered = Object.values(answers).filter(a => a.selected !== -1).length
  const progress = (totalAnswered / quiz.questions.length) * 100

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-800/50 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm text-purple-400">Savol</span>
              <span className="text-lg font-bold">
                {currentQuestion + 1} / {quiz.questions.length}
              </span>
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${
                timeLeft < 60 ? 'bg-red-600/30 text-red-300 animate-pulse' :
                timeLeft < 300 ? 'bg-yellow-600/30 text-yellow-300' :
                'bg-purple-800/50 text-purple-200'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Question */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
              {currentQuestion + 1}
            </span>
            <span className="text-xs text-purple-400">
              {question.points} ball
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {question.questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = answers[question.id]?.selected === idx
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, idx)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/50 hover:bg-purple-950/50'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                  isSelected
                    ? 'bg-yellow-500 text-black'
                    : 'bg-purple-800/50 text-purple-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`text-sm sm:text-base ${isSelected ? 'text-white font-medium' : 'text-purple-200'}`}>
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        {/* Question navigation */}
        <div className="bg-slate-900/30 border border-purple-800/30 rounded-xl p-3">
          <div className="text-xs text-purple-400 mb-2 px-1">Savollar navigatsiyasi:</div>
          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.id]?.selected !== -1
              const isCurrent = idx === currentQuestion
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black scale-110 shadow-lg'
                      : isAnswered
                      ? 'bg-green-600/30 text-green-300 border border-green-600/50'
                      : 'bg-purple-900/40 text-purple-300 border border-purple-800/30 hover:border-purple-600/50'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex-1 py-4 bg-purple-800/50 hover:bg-purple-700/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold transition-all"
          >
            ← Oldingi
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold transition-all"
            >
              Keyingi →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex-[2] py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Topshirilmoqda...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Topshirish</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Submit anywhere */}
        {totalAnswered > 0 && currentQuestion < quiz.questions.length - 1 && (
          <div className="text-center">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="text-sm text-purple-400 hover:text-yellow-400 underline transition-all"
            >
              {totalAnswered}/{quiz.questions.length} javob berilgan — Hoziroq topshirish
            </button>
          </div>
        )}
      </div>
    </main>
  )
}