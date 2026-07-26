"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getPreviousIds, saveQuizHistory } from "../_shared/utils/storage"
import { generateQuizPDF, prepareAnswersForPDF } from "../_shared/utils/pdf"

// Savollar bazadan olinadi (admin panel boshqaradi), avval 4 ta data.js
// faylidan import qilinardi. Kategoriya slug'i -> ko'rsatiladigan nom.
const MAVZULAR = [
  { slug: "nomlanishi", label: "Nomlanishi" },
  { slug: "klassifikatsiyasi", label: "Klassifikatsiyasi" },
  { slug: "fazoviy", label: "Fazoviy" },
  { slug: "izomeriya", label: "Izomeriya" },
]

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Har bir bankdan count ta savol olish
function pickFromBank(bank, count, excludeIds = []) {
  const available = bank.filter(q => !excludeIds.includes(q.id))
  if (available.length < count) {
    return shuffle([...bank]).slice(0, count)
  }
  return shuffle(available).slice(0, count)
}

export default function AralashQuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const isAuthenticated = status === "authenticated"
  
  const [showNameModal, setShowNameModal] = useState(false)
  const [userName, setUserName] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Savollar bazasi (/api/quiz/bank) — barcha mavzular birga keladi
  const [bank, setBank] = useState([])
  const [bankLoading, setBankLoading] = useState(true)
  const [bankError, setBankError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadBank() {
      try {
        const response = await fetch("/api/quiz/bank?category=aralash")
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Savollarni yuklab bo'lmadi")
        if (cancelled) return

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("Bazada savol topilmadi")
        }
        setBank(data.questions)
        setBankLoading(false)
      } catch (error) {
        if (!cancelled) {
          setBankError(error.message)
          setBankLoading(false)
        }
      }
    }

    loadBank()
    return () => { cancelled = true }
  }, [])

  // 🆕 Session yuklanganda avtomatik ismni o'rnatish
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserName(session.user.fullName || session.user.username || "")
      setShowNameModal(false)
    } else if (status === "unauthenticated") {
      setShowNameModal(true)
    }
  }, [status, session])

  // Vaqt hisoblash
  useEffect(() => {
    if (!quizStarted || showResult) return
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [quizStarted, showResult, startTime])

  // Ism modal (faqat mehmonlar uchun)
  const handleNameSubmit = () => {
    if (userName.trim().length >= 2) setShowNameModal(false)
  }

  // Quiz boshlash — har bir mavzudan 5 tadan olib aralashtiramiz
  const handleStartQuiz = () => {
    const previousIds = getPreviousIds("aralash")

    const tanlangan = MAVZULAR.flatMap(({ slug, label }) => {
      const mavzuBank = bank.filter(q => q.category === slug)
      return pickFromBank(mavzuBank, 5, previousIds).map(q => ({ ...q, category: label }))
    })

    setQuestions(shuffle(tanlangan))
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  // Javob tanlash
  const handleAnswerSelect = (answerIndex) => {
    if (!isConfirmed) setSelectedAnswer(answerIndex)
  }

  // Javobni tasdiqlash
  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return
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
        explanation: currentQuestion.explanation,
        category: currentQuestion.category
      }
    ])
    setIsConfirmed(true)
  }

  // 🆕 Natijani database'ga saqlash
  const submitQuizResult = async (score, percentage, timeSpent) => {
    if (!isAuthenticated) return
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizName: 'Aralash test (barcha mavzular)',
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
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsConfirmed(false)
    } else {
      setIsSubmitting(true)
      
      const questionIds = questions.map(q => q.id)
      saveQuizHistory("aralash", questionIds)
      
      const correctCount = answers.filter(a => a.isCorrect).length + 
        (selectedAnswer === questions[currentQuestionIndex].correct ? 1 : 0)
      const percentage = Math.round((correctCount / questions.length) * 100)
      
      await submitQuizResult(correctCount, percentage, elapsedTime)
      
      setShowResult(true)
      setIsSubmitting(false)
    }
  }

  // PDF eksport
  const handleExportPDF = () => {
    const preparedAnswers = prepareAnswersForPDF(answers)
    generateQuizPDF({
      userName,
      answers: preparedAnswers,
      questions,
      elapsedTime,
      quizName: "Aralash test"
    })
  }

  // Profilga o'tish
  const goToProfile = () => {
    router.push('/profil?tab=quizzes')
  }

  // Qayta boshlash
  const handleRestart = () => {
    setQuizStarted(false)
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsConfirmed(false)
    setAnswers([])
    setElapsedTime(0)
  }

  // Kategoriya rangi
  const getCategoryColor = (category) => {
    switch (category) {
      case "Nomlanishi": return "text-red-400 bg-red-900/30 border-red-700/50"
      case "Klassifikatsiyasi": return "text-blue-400 bg-blue-900/30 border-blue-700/50"
      case "Fazoviy": return "text-purple-400 bg-purple-900/30 border-purple-700/50"
      case "Izomeriya": return "text-pink-400 bg-pink-900/30 border-pink-700/50"
      default: return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50"
    }
  }

  // Loading session yoki savollar bazasi
  if (status === "loading" || bankLoading) {
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

  // Savollarni yuklab bo'lmadi
  if (bankError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Savollarni yuklab bo&apos;lmadi</h2>
          <p className="text-purple-300 text-sm mb-6">{bankError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            🔄 Qayta urinish
          </button>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════════════
  // ISM MODAL (FAQAT MEHMONLAR UCHUN)
  // ═══════════════════════════════════════════════════
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
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 mb-4"
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={userName.trim().length < 2}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
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

  // ═══════════════════════════════════════════════════
  // QUIZ BOSHLANMAGAN
  // ═══════════════════════════════════════════════════
  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Aralash Quiz
          </h1>

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
          
          <p className="text-purple-200 mb-8 text-lg">
            Barcha mavzulardan 20 ta tasodifiy savol. Har safar yangi savollar!
          </p>

          {/* Mavzular */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-red-400 font-bold">Nomlanishi</div>
              <div className="text-purple-400 text-sm">5 ta savol</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-blue-400 font-bold">Klassifikatsiyasi</div>
              <div className="text-purple-400 text-sm">5 ta savol</div>
            </div>
            <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-purple-400 font-bold">Fazoviy</div>
              <div className="text-purple-400 text-sm">5 ta savol</div>
            </div>
            <div className="bg-pink-900/20 border border-pink-700/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-pink-400 font-bold">Izomeriya</div>
              <div className="text-purple-400 text-sm">5 ta savol</div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-6 text-left">
              <div className="text-yellow-400 text-sm font-semibold mb-1">🎁 Tizimga kirganlar uchun:</div>
              <ul className="text-yellow-300/80 text-xs space-y-1">
                <li>⭐ +XP har bir quiz uchun</li>
                <li>🎯 Kunlik missiya bajariladi</li>
                <li>📊 Natija profilingizda saqlanadi</li>
              </ul>
            </div>
          )}
          
          <button
            onClick={handleStartQuiz}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-lg font-bold text-lg"
          >
            Quizni boshlash
          </button>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════════════
  // NATIJALAR SAHIFASI
  // ═══════════════════════════════════════════════════
  if (showResult) {
    const correctCount = answers.filter(a => a.isCorrect).length
    const percentage = Math.round((correctCount / questions.length) * 100)
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60
    
    // Mavzu bo'yicha statistika
    const categories = ["Nomlanishi", "Klassifikatsiyasi", "Fazoviy", "Izomeriya"]
    const categoryStats = categories.map(cat => {
      const catAnswers = answers.filter(a => a.category === cat)
      const catCorrect = catAnswers.filter(a => a.isCorrect).length
      return { name: cat, total: catAnswers.length, correct: catCorrect }
    })
    
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-purple-300 mb-6 text-center">Aralash Quiz Natijasi</h1>

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
              <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{correctCount}</div>
                <div className="text-sm text-green-300">To'g'ri</div>
              </div>
              <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">{questions.length - correctCount}</div>
                <div className="text-sm text-red-300">Xato</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4 text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  percentage >= 80 ? 'text-green-400' :
                  percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>{percentage}%</div>
                <div className="text-sm text-purple-300">Foiz</div>
              </div>
            </div>
            
            {/* Mavzu bo'yicha statistika */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {categoryStats.map((cat, i) => (
                <div key={i} className="bg-purple-950/50 rounded-xl p-3 text-center border border-purple-700/30">
                  <div className="text-xs text-purple-400 mb-1">{cat.name}</div>
                  <div className={`text-lg font-bold ${cat.correct >= 4 ? "text-green-400" : cat.correct >= 3 ? "text-yellow-400" : "text-red-400"}`}>
                    {cat.correct}/{cat.total}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-950/50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-400 mb-1">Ism:</div>
                  <div className="text-lg font-semibold text-purple-200">{userName}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-400 mb-1">Vaqt:</div>
                  <div className="text-lg font-semibold text-purple-200">
                    {minutes} daqiqa {seconds} soniya
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleExportPDF}
                className="flex-1 min-w-[200px] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
              >
                📄 PDF yuklab olish
              </button>
              {isAuthenticated && (
                <button
                  onClick={goToProfile}
                  className="flex-1 min-w-[200px] py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-lg font-bold"
                >
                  👤 Profildagi natijalar
                </button>
              )}
              <button
                onClick={handleRestart}
                className="flex-1 min-w-[200px] py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
              >
                🔄 Qayta boshlash
              </button>
            </div>
          </div>
          
          {/* Xato javoblar */}
          {answers.filter(a => !a.isCorrect).length > 0 && (
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">
                Xato javoblar ({answers.filter(a => !a.isCorrect).length} ta)
              </h2>
              <div className="space-y-4">
                {answers.filter(a => !a.isCorrect).map((answer, index) => (
                  <div key={index} className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-red-400">Savol {answer.questionIndex + 1}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(answer.category)}`}>
                          {answer.category}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-white mb-2">{answer.question}</div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-red-400 mr-2">✗</span>
                        <span className="text-red-300">
                          Sizning javob: {String.fromCharCode(65 + answer.selectedAnswer)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-green-300">
                          To'g'ri javob: {String.fromCharCode(65 + answer.correctAnswer)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-950/50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-purple-300 mb-1">Tushuntirish:</div>
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

  // ═══════════════════════════════════════════════════
  // QUIZ DAVOM ETMOQDA
  // ═══════════════════════════════════════════════════
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-purple-300">
                Savol {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(currentQuestion.category)}`}>
                {currentQuestion.category}
              </span>
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
              <span className="text-sm text-purple-300">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-purple-950/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Savol */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = isConfirmed && index === currentQuestion.correct
              const isWrong = isConfirmed && isSelected && index !== currentQuestion.correct
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isConfirmed}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isCorrect
                      ? "bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20"
                      : isWrong
                      ? "bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20"
                      : isSelected
                      ? "bg-purple-800/60 border-purple-500"
                      : "bg-purple-950/50 border-purple-700/50 hover:border-purple-500"
                  } ${isConfirmed ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-700/50 flex items-center justify-center text-sm font-semibold mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white">{option}</span>
                    {isCorrect && <span className="ml-auto text-green-400 text-xl">✓</span>}
                    {isWrong && <span className="ml-auto text-red-400 text-xl">✗</span>}
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Tushuntirish */}
          {isConfirmed && (
            <div className={`p-4 rounded-xl mb-6 ${
              selectedAnswer === currentQuestion.correct
                ? "bg-green-900/20 border border-green-700/50"
                : "bg-red-900/20 border border-red-700/50"
            }`}>
              <div className="text-sm font-semibold text-purple-300 mb-2">Tushuntirish:</div>
              <div className="text-sm text-purple-200">{currentQuestion.explanation}</div>
            </div>
          )}
          
          {/* Tugmalar */}
          <div className="flex gap-4">
            {!isConfirmed ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
              >
                Javobni tasdiqlash
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-lg font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Saqlanmoqda...</span>
                  </span>
                ) : (
                  currentQuestionIndex < questions.length - 1 ? "Keyingi savol →" : "Natijalarni ko'rish"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}