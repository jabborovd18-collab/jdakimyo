"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'
import QuizUlashishModal from '@/components/QuizUlashishModal'

export default function UstozQuizSolvePage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const quizId = params?.id
  const [fon, fonTanla] = useFon()

  const [quiz, setQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [needCode, setNeedCode] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  // State
  const [started, setStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: selectedIndex }
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareModal, setShareModal] = useState(false)

  // Results
  const [results, setResults] = useState(null)
  const [showReview, setShowReview] = useState(false)

  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (quizId) fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/oquv/ustoz-quiz/${quizId}`)
      const data = await res.json()

      if (!res.ok) {
        if (data.needCode) {
          setNeedCode(true)
          setIsLoading(false)
          return
        }
        throw new Error(data.error || 'Testni yuklab bo\'lmadi')
      }

      setQuiz(data.quiz)
      if (data.quiz.timeLimit) {
        setTimeLeft(data.quiz.timeLimit * 60)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Timer
  useEffect(() => {
    if (started && timeLeft !== null && !results) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [started, timeLeft, results])

  const startQuiz = () => {
    setStarted(true)
    startTimeRef.current = Date.now()
  }

  const selectAnswer = (questionId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }))
  }

  const handleSubmit = async () => {
    if (isSubmitting || results) return
    setIsSubmitting(true)

    const timeSpent = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0

    const formattedAnswers = Object.entries(answers).map(([qId, selIdx]) => ({
      questionId: qId,
      selected: selIdx
    }))

    try {
      const res = await fetch(`/api/oquv/ustoz-quiz/${quizId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: formattedAnswers,
          timeSpent
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Natijani saqlab bo\'lmadi')

      setResults(data)
      toast.success(data.message || 'Test muvaffaqiyatli topshirildi!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Test tayyorlanmoqda...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="font-bold text-lg text-[var(--v3-matn)]">Kirish imkoni yo{"'"}q</h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{error}</p>
          <Link href="/oquv/video-darsliklar/ustoz-quiz" className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex">
            Barcha testlarga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const currentQ = quiz?.questions?.[currentIdx]
  const totalQ = quiz?.questions?.length || 0
  const answeredCount = Object.keys(answers).length
  const progressPercent = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0

  return (
    <main data-fon={fon} className="v3 v3-quiz min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Top Header */}
      <header className="v3-header sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/oquv/video-darsliklar/ustoz-quiz" className="v3-ikon-tugma" aria-label="Orqaga">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--v3-matn)] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {quiz?.title}
              </div>
              <div className="text-[10.5px] text-[var(--v3-xira)]">
                Ustoz: {quiz?.teacher?.fullName || quiz?.teacher?.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {started && !results && timeLeft !== null && (
              <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                timeLeft < 180
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : 'bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] border-[var(--v3-chiziq)]'
              }`}>
                <Ikon nom="vaqt" olcham={13} />
                {formatTime(timeLeft)}
              </div>
            )}

            <FonTanlagich fon={fon} onFonTanla={fonTanla} ixcham />

            <button
              type="button"
              onClick={() => setShareModal(true)}
              className="v3-tugma text-xs p-2 shrink-0"
              title="Do'stlarga ulashish"
            >
              <Ikon nom="ulashish" olcham={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="v3-konteyner py-8 max-w-4xl space-y-6">
        {/* ─── 1. BOSHLASH OLDIDAN KARTA ─── */}
        {!started && !results && (
          <div className="v3-panel-karta p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="v3-tag v3-tag-ochiq">
                  <Ikon nom="quiz" olcham={12} />
                  Variantli test
                </span>
                {quiz?.group?.name && (
                  <span className="v3-tag v3-tag-yopiq">
                    Guruh: {quiz.group.name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
                {quiz?.title}
              </h1>
              {quiz?.description && (
                <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                  {quiz.description.startsWith('{') ? (JSON.parse(quiz.description).originalDescription || '') : quiz.description}
                </p>
              )}
            </div>

            {/* Test Qoidalari */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-xs font-mono">
              <div>
                <span className="text-[var(--v3-xira)] block text-[10px]">Savollar soni:</span>
                <strong className="text-[var(--v3-matn)] text-base">{totalQ} ta</strong>
              </div>
              <div>
                <span className="text-[var(--v3-xira)] block text-[10px]">Ajratilgan vaqt:</span>
                <strong className="text-[var(--v3-matn)] text-base">{quiz?.timeLimit ? `${quiz.timeLimit} daq` : 'Cheksiz'}</strong>
              </div>
              <div>
                <span className="text-[var(--v3-xira)] block text-[10px]">Maksimal ball:</span>
                <strong className="text-[var(--v3-matn)] text-base">{quiz?.maxScore || totalQ}</strong>
              </div>
              <div>
                <span className="text-[var(--v3-xira)] block text-[10px]">O{"'"}tish bali:</span>
                <strong className="text-[var(--v3-urgu)] text-base">{quiz?.passingScore || 60}%</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--v3-chiziq)]">
              <Link href="/oquv/video-darsliklar/ustoz-quiz" className="v3-tugma text-xs py-2.5 px-4">
                Bekor qilish
              </Link>
              <button
                type="button"
                onClick={startQuiz}
                className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold"
              >
                Testni boshlash →
              </button>
            </div>
          </div>
        )}

        {/* ─── 2. TEST YECHISH JARAYONI ─── */}
        {started && !results && currentQ && (
          <div className="space-y-5">
            {/* Progress & Navigation Bar */}
            <div className="v3-panel-karta p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--v3-matn)]">
                  Savol: {currentIdx + 1} / {totalQ}
                </span>
                <span className="text-[var(--v3-xira)]">
                  Belgilandi: <strong>{answeredCount}</strong> / {totalQ}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[var(--v3-fon-2)] overflow-hidden border border-[var(--v3-chiziq)]">
                <div
                  className="h-full bg-[var(--v3-urgu)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Number Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quiz.questions.map((q, idx) => {
                  const isCurrent = currentIdx === idx
                  const isAnswered = answers[q.id] !== undefined

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                          : isAnswered
                          ? 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border border-[var(--v3-urgu-2)]'
                          : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border border-[var(--v3-chiziq)]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[var(--v3-urgu)] uppercase">
                  {currentIdx + 1}-SAVOL ({currentQ.points || 1} ball)
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-[var(--v3-matn)] leading-relaxed">
                  {currentQ.questionText}
                </h2>
              </div>

              {/* Options */}
              <div className="grid gap-2.5 pt-2">
                {(currentQ.options?.texts || currentQ.options || []).map((opt, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx
                  const harf = String.fromCharCode(65 + optIdx)

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => selectAnswer(currentQ.id, optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3.5 group ${
                        isSelected
                          ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm'
                          : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                          : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] group-hover:text-[var(--v3-matn)]'
                      }`}>
                        {harf}
                      </span>
                      <span className="text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed flex-1">
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-[var(--v3-chiziq)]">
                <button
                  type="button"
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="v3-tugma text-xs py-2 px-4 disabled:opacity-40"
                >
                  <Ikon nom="chap" olcham={14} />
                  Oldingi savol
                </button>

                {currentIdx < totalQ - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
                    className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
                  >
                    Keyingi savol
                    <Ikon nom="ong" olcham={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold bg-green-600 hover:bg-green-500 text-white border-green-500"
                  >
                    {isSubmitting ? 'Topshirilmoqda...' : '✓ Testni yakunlash'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── 3. NATIJA VA XATOLAR TAHLILI ─── */}
        {results && (
          <div className="v3-panel-karta p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold font-mono border-4 ${
                results.passed
                  ? 'border-green-500/40 bg-green-500/10 text-green-400'
                  : 'border-red-500/40 bg-red-500/10 text-red-400'
              }`}>
                {results.percentage.toFixed(0)}%
              </div>

              <h2 className="text-2xl font-bold text-[var(--v3-matn)]">
                {results.passed ? 'Tabriklaymiz, Testdan o\'tdingiz!' : 'Test natijasi qoniqarsiz'}
              </h2>
              <p className="text-xs text-[var(--v3-xira)] max-w-md mx-auto">
                To{"'"}plangan ball: <strong className="text-[var(--v3-matn)]">{results.score} / {results.maxScore}</strong>.
                {results.xpEarned > 0 && <span> Sizga <strong>+{results.xpEarned} XP</strong> berildi.</span>}
              </p>
            </div>

            {/* Amallar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="v3-tugma text-xs py-2.5 px-4"
              >
                <Ikon nom="quiz" olcham={15} />
                {showReview ? 'Tahlilni yashirish' : 'Savollar tahlilini ko\'rish'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResults(null)
                  setStarted(false)
                  setAnswers({})
                  setCurrentIdx(0)
                }}
                className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-4 font-bold"
              >
                <Ikon nom="qayta" olcham={15} />
                Qayta urinish
              </button>

              <Link href="/oquv/video-darsliklar/ustoz-quiz" className="v3-tugma text-xs py-2.5 px-4">
                Barcha testlarga qaytish
              </Link>
            </div>

            {/* Review Section */}
            {showReview && results.results && (
              <div className="space-y-4 pt-6 border-t border-[var(--v3-chiziq)]">
                <div className="v3-nishon">Savollar bo{"'"}yicha batafsil xulosalar</div>

                {results.results.map((r, idx) => {
                  const opts = r.options?.texts || r.options || []

                  return (
                    <div
                      key={r.questionId || idx}
                      className={`p-5 rounded-xl border space-y-3 ${
                        r.isCorrect
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[var(--v3-urgu)]">
                          {idx + 1}-SAVOL ({r.isCorrect ? `${r.points}/${r.maxPoints} ball` : `0/${r.maxPoints} ball`})
                        </span>
                        <span className={`font-semibold ${r.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {r.isCorrect ? '✓ To\'g\'ri' : '✗ Xato'}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[var(--v3-matn)]">
                        {r.questionText}
                      </div>

                      <div className="grid gap-1.5 text-xs">
                        {opts.map((opt, optIdx) => {
                          const isCorrectOpt = r.correctAnswer === optIdx
                          const isUserSel = r.userAnswer === optIdx

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                isCorrectOpt
                                  ? 'bg-green-500/10 border-green-500/30 text-green-300 font-semibold'
                                  : isUserSel
                                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                  : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-xira)]'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                              {isCorrectOpt && <span className="text-[10px] uppercase font-bold">To{"'"}g{"'"}ri javob</span>}
                              {isUserSel && !isCorrectOpt && <span className="text-[10px] uppercase font-bold">Sizning javobingiz</span>}
                            </div>
                          )
                        })}
                      </div>

                      {r.explanation && (
                        <div className="p-3 rounded-lg bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
                          <strong className="text-[var(--v3-urgu-2)] block mb-0.5">Izoh:</strong>
                          {r.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {shareModal && quiz && (
        <QuizUlashishModal
          quiz={quiz}
          onClose={() => setShareModal(false)}
        />
      )}
    </main>
  )
}
