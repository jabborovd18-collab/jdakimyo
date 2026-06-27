"use client"
import { useState, useEffect, useMemo } from "react"
import QUIZ_BANK from "./data"
import { getRandomQuestions, getPreviousIds, saveQuizHistory } from "./utils/storage"
import { generateQuizPDF, prepareAnswersForPDF } from "./utils/pdf"

export default function QuizKlassifikatsiyasiPage() {
  const [showNameModal, setShowNameModal] = useState(true)
  const [userName, setUserName] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  
  // Vaqt hisoblash
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // 20 ta tasodifiy savol tanlash
  const questions = useMemo(() => {
    const previousIds = getPreviousIds("klassifikatsiyasi")
    return getRandomQuestions(QUIZ_BANK, 20, previousIds)
  }, [])

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

  // Ism-family kiritish
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

  // Keyingi savol
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsConfirmed(false)
    } else {
      setShowResult(true)
      // Tarixni saqlash
      const questionIds = questions.map(q => q.id)
      saveQuizHistory("klassifikatsiyasi", questionIds)
    }
  }

  // PDF generatsiya (Premium dizayn)
  const handleExportPDF = () => {
    const preparedAnswers = prepareAnswersForPDF(answers)
    
    generateQuizPDF({
      userName,
      answers: preparedAnswers,
      questions,
      elapsedTime,
      quizName: "Klassifikatsiyasi"
    })
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

  // Ism-family modal
  if (showNameModal) {
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
        </div>
      </main>
    )
  }

  // Quiz boshlanmagan
  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-2xl w-full text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Klassifikatsiyasi Quiz</h2>
          <p className="text-purple-300 mb-6">
            Yirik savol bazasidan 20 ta tasodifiy savol tanlanadi. Har safar yangi savollar!
          </p>
          <div className="bg-purple-950/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-purple-300 font-semibold mb-2">Mavzular:</h3>
            <ul className="text-purple-300 text-sm space-y-2">
              <li>✓ Kompleks turi (kation/anion/neytral)</li>
              <li>✓ Ligand turi (monodentat/bidentat/polidentat)</li>
              <li>✓ Koordinatsion son</li>
              <li>✓ Geometriya</li>
              <li>✓ Zaryad hisoblash</li>
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
                <div className="text-3xl font-bold text-purple-300">{percentage}%</div>
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

            <div className="flex gap-4">
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                📄 PDF yuklab olish (faqat xato savollar)
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                🔄 Qayta boshlash
              </button>
            </div>
          </div>

          {/* Xato javoblar */}
          {answers.filter(a => !a.isCorrect).length > 0 && (
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">Xato javoblar ({answers.filter(a => !a.isCorrect).length} ta)</h3>
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
            <div className="text-sm text-purple-300">
              Vaqt: {formatTime(elapsedTime)}
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
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? "Keyingi savol" : "Natijalarni ko'rish"}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}