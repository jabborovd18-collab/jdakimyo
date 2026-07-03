"use client"
import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import QUIZ_BANK from "./data"
import { getRandomQuestions, getPreviousIds, saveQuizHistory } from "./utils/storage"
import { generateQuizPDF, prepareAnswersForPDF } from "./utils/pdf"

export default function QuizNomlanishiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // 🆕 Tizimga kirganmi?
  const isAuthenticated = status === "authenticated"
  
  const [showNameModal, setShowNameModal] = useState(false)
  const [userName, setUserName] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Vaqt hisoblash
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // 20 ta tasodifiy savol tanlash
  const questions = useMemo(() => {
    const previousIds = getPreviousIds("nomlanishi")
    return getRandomQuestions(QUIZ_BANK, 20, previousIds)
  }, [])

  // 🆕 Session yuklanganda avtomatik ismni o'rnatish
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserName(session.user.fullName || session.user.username || "")
      setShowNameModal(false) // Modal kerak emas
    } else if (status === "unauthenticated") {
      setShowNameModal(true) // Mehmonlar uchun modal
    }
  }, [status, session])

  // Timer
  useEffect(() => {
    if (quizStarted && !showResult && startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizStarted, showResult, startTime])

  // Ism-family kiritish (faqat mehmonlar uchun)
  const handleNameSubmit = () => {
    if (userName.trim().length >= 2) {
      setShowNameModal(false)
    }
  }

  // Quiz boshlash
  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  // Javob tanlash
  const handleAnswerSelect = (answerIndex) => {
    if (!isConfirmed) {
      setSelectedAnswer(answerIndex)
    }
  }

  // Javobni tasdiqlash
  const handleConfirm = () => {
    if (selectedAnswer !== null && !isConfirmed) {
      setIsConfirmed(true)
      const currentQuestion = questions[currentQuestionIndex]
      const isCorrect = selectedAnswer === currentQuestion.correct
      setAnswers([
        ...answers,
        {
          questionIndex: currentQuestionIndex,
          question: currentQuestion.question,
          selectedAnswer,
          correctAnswer: currentQuestion.correct,
          isCorrect,
          explanation: currentQuestion.explanation
        }
      ])
    }
  }

  // 🆕 Natijani database'ga saqlash (faqat tizimga kirganlar uchun)
  const submitQuizResult = async (score, percentage, timeSpent) => {
    if (!isAuthenticated) return // Mehmonlar uchun emas
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizName: 'Koordinatsion birikmalarning nomlanishi',
          score,
          totalQuestions: questions.length,
          percentage,
          timeSpent
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Natijani saqlashda xatolik')
      }

      // 🆕 Missiya bajarildi xabari
      if (data.missionResult?.success) {
        setTimeout(() => {
          toast.success(`🎯 ${data.missionResult.message}`, { duration: 4000 })
        }, 1000)
      }

      if (data.missionResult?.starEarned) {
        setTimeout(() => {
          toast.success('🌟 Tabriklaymiz! Siz bugungi yulduzni oldingiz!', { duration: 5000 })
        }, 2500)
      }

      return data
    } catch (error) {
      console.error('[Quiz Submit Error]:', error)
      toast.error('Natijani saqlashda xatolik: ' + error.message)
      return null
    }
  }

  // Keyingi savol
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsConfirmed(false)
    } else {
      setIsSubmitting(true)
      
      // Tarixni saqlash (localStorage - barcha uchun)
      const questionIds = questions.map(q => q.id)
      saveQuizHistory("nomlanishi", questionIds)
      
      // Natijani hisoblash
      const correctCount = answers.filter(a => a.isCorrect).length + 
        (selectedAnswer === questions[currentQuestionIndex].correct ? 1 : 0)
      const percentage = Math.round((correctCount / questions.length) * 100)
      
      // 🆕 Natijani database'ga saqlash (faqat authenticated)
      await submitQuizResult(correctCount, percentage, elapsedTime)
      
      setShowResult(true)
      setIsSubmitting(false)
    }
  }

  // PDF generatsiya
  const handleExportPDF = () => {
    const preparedAnswers = prepareAnswersForPDF(answers)
    generateQuizPDF({
      userName,
      answers: preparedAnswers,
      questions,
      elapsedTime,
      quizName: "Nomlanish"
    })
  }

  // Profilga o'tish
  const goToProfile = () => {
    router.push('/profil?tab=quizzes')
  }

  // Vaqtni formatlash
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Hisoblash
  const correctCount = answers.filter(a => a.isCorrect).length
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  // Loading session
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl mb-4 animate-pulse">
            ⏳
          </div>
          <div className="text-purple-300 text-lg">Yuklanmoqda...</div>
        </div>
      </main>
    )
  }

  // 🆕 Ism-family modal (FAQAT MEHMONLAR UCHUN)
  if (showNameModal && !isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">Ism-familyangizni kiriting</h2>
          <p className="text-purple-300 text-sm mb-6">
            Bu ma'lumot natijalar PDF faylida ko'rsatiladi.
          </p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            placeholder="Masalan: Aliyev Ali"
            className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 outline-none mb-4"
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={userName.trim().length < 2}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Davom etish
          </button>
          <div className="mt-4 text-center">
            <p className="text-purple-400 text-xs mb-2">yoki</p>
            <button
              onClick={() => router.push('/login')}
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
            >
              🔐 Tizimga kiring (natijalaringiz saqlanadi)
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Quiz boshlanmagan
  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-2xl w-full text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Nomlanish Quiz</h2>
          
          {/* 🆕 Tizimga kirganlik xabari */}
          {isAuthenticated && (
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold text-black flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left flex-1">
                <div className="text-green-400 text-sm font-semibold">Salom, {userName}!</div>
                <div className="text-green-300/70 text-xs">Natijalaringiz profilingizga saqlanadi + XP olasiz 🎯</div>
              </div>
            </div>
          )}

          <p className="text-purple-300 mb-6">
            150 ta savol bazasidan 20 ta tasodifiy savol tanlanadi. Har safar yangi savollar!
          </p>
          <div className="bg-purple-950/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-purple-300 font-semibold mb-2">Qanday ishlaydi:</h3>
            <ul className="text-purple-300 text-sm space-y-2">
              <li>✓ Har bir savolda 4 ta variant</li>
              <li>✓ Javobni tanlang va tasdiqlang</li>
              <li>✓ To'g'ri = yashil, xato = qizil + tushuntirish</li>
              <li>✓ Oxirida PDF natija (faqat xato savollar)</li>
              {isAuthenticated && (
                <>
                  <li className="text-yellow-400">⭐ +XP har bir quiz uchun</li>
                  <li className="text-yellow-400">🎯 Kunlik missiya bajariladi</li>
                </>
              )}
            </ul>
          </div>
          <button
            onClick={startQuiz}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Quizni boshlash
          </button>
        </div>
      </main>
    )
  }

  // Natijalar sahifasi
  if (showResult) {
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60
    const timeString = `${minutes} daqiqa ${seconds} soniya`
    
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">Quiz Natijasi</h2>
            
            {/* 🆕 Tizimga kirganlik uchun bonus */}
            {isAuthenticated && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                  <div className="text-yellow-400 font-bold">Tabriklaymiz, {userName}!</div>
                  <div className="text-yellow-300/80 text-sm">
                    Natija profilingizga saqlandi • Kunlik missiya bajarildi ✓
                  </div>
                </div>
                <button
                  onClick={goToProfile}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all"
                >
                  Profilga →
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{correctCount}</div>
                <div className="text-sm text-purple-300">To'g'ri</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{questions.length - correctCount}</div>
                <div className="text-sm text-purple-300">Xato</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-4 text-center">
                <div className={`text-3xl font-bold ${
                  percentage >= 80 ? 'text-green-400' :
                  percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>{percentage}%</div>
                <div className="text-sm text-purple-300">Foiz</div>
              </div>
            </div>
            
            <div className="bg-purple-950/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-purple-300">Ism-familya</div>
                  <div className="text-lg font-semibold text-white">{userName}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-300">Sarflangan vaqt</div>
                  <div className="text-lg font-semibold text-white">{timeString}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleExportPDF}
                className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                📄 PDF yuklab olish
              </button>
              {isAuthenticated && (
                <button
                  onClick={goToProfile}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black py-3 rounded-lg font-bold transition-all"
                >
                  👤 Profildagi natijalar
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="flex-1 min-w-[200px] bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                🔄 Qayta boshlash
              </button>
            </div>
          </div>

          {/* Xato javoblar */}
          {answers.filter(a => !a.isCorrect).length > 0 && (
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">
                Xato javoblar ({answers.filter(a => !a.isCorrect).length} ta)
              </h3>
              <div className="space-y-6">
                {answers.filter(a => !a.isCorrect).map((answer, index) => (
                  <div key={index} className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                    <div className="mb-4">
                      <div className="text-sm text-purple-300 mb-2">Savol {answer.questionIndex + 1}</div>
                      <div className="text-lg font-semibold text-white">{answer.question}</div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">✗</span>
                        <span className="text-red-400">Sizning javob: {String.fromCharCode(65 + answer.selectedAnswer)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-green-400">To'g'ri javob: {String.fromCharCode(65 + answer.correctAnswer)}</span>
                      </div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-purple-300 mb-2">Tushuntirish:</div>
                      <div className="text-sm text-purple-200">{answer.explanation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  // Quiz davom etmoqda
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-purple-300">
              Savol {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div className="flex items-center gap-3">
              {/* 🆕 Foydalanuvchi ismi */}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-yellow-400 text-sm font-semibold hidden sm:inline">
                    {userName.split(' ')[0]}
                  </span>
                </div>
              )}
              <div className="text-sm text-purple-300">
                Vaqt: {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
          <div className="w-full bg-purple-950/50 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Savol */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correct
              const showCorrect = isConfirmed && isCorrect
              const showWrong = isConfirmed && isSelected && !isCorrect
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isConfirmed}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "bg-green-900/40 border-green-500"
                      : showWrong
                      ? "bg-red-900/40 border-red-500"
                      : isSelected
                      ? "bg-purple-800/60 border-purple-500"
                      : "bg-purple-950/50 border-purple-700/50 hover:border-purple-500"
                  } ${isConfirmed ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                    {showCorrect && <span className="ml-auto text-green-400">✓</span>}
                    {showWrong && <span className="ml-auto text-red-400">✗</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Tushuntirish */}
          {isConfirmed && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correct
                ? "bg-green-900/20 border border-green-700/50"
                : "bg-red-900/20 border border-red-700/50"
            }`}>
              <div className="text-sm font-semibold mb-2">
                {selectedAnswer === currentQuestion.correct ? "✓ To'g'ri!" : "✗ Xato"}
              </div>
              <div className="text-sm text-purple-200">{currentQuestion.explanation}</div>
            </div>
          )}
        </div>

        {/* Tugmalar */}
        <div className="flex gap-4">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Javobni tasdiqlash
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>Saqlanmoqda...</span>
                </span>
              ) : (
                currentQuestionIndex < questions.length - 1 ? "Keyingi savol" : "Natijalarni ko'rish"
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}