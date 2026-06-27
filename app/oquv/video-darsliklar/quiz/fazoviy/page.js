// app/oquv/video-darsliklar/quiz/fazoviy/page.js
"use client"

import { useState, useEffect } from 'react'
import { QUIZ_BANK } from './data'
import { getRandomQuestions, getPreviousIds, saveQuizHistory } from './utils/storage'
import { generateQuizPDF, prepareAnswersForPDF } from './utils/pdf'

export default function FazoviyQuizPage() {
  const [showNameModal, setShowNameModal] = useState(true)
  const [name, setName] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const quizName = "Fazoviy tuzilishi"

  // Vaqt hisoblash
  useEffect(() => {
    if (!quizStarted || showResult) return

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResult, startTime])

  // Ism modal
  const handleNameSubmit = () => {
    if (name.trim()) {
      setShowNameModal(false)
    }
  }

  // Quiz boshlash
  const handleStartQuiz = () => {
    const previousIds = getPreviousIds(quizName)
    const randomQuestions = getRandomQuestions(QUIZ_BANK, 20, previousIds)
    setQuestions(randomQuestions)
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
  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct

    const newAnswer = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correct,
      isCorrect,
      explanation: currentQuestion.explanation
    }

    setAnswers([...answers, newAnswer])
    setIsConfirmed(true)
  }

  // Keyingi savol
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsConfirmed(false)
    } else {
      setShowResult(true)
      const questionIds = questions.map(q => q.id)
      saveQuizHistory(quizName, questionIds)
    }
  }

  // PDF eksport
  const handleExportPDF = () => {
    const preparedAnswers = prepareAnswersForPDF(answers)
    generateQuizPDF({
      userName: name,
      answers: preparedAnswers,
      questions,
      elapsedTime,
      quizName
    })
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

  // Ism modal
  if (showNameModal) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">Ismingizni kiriting</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            placeholder="Ismingiz"
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 mb-4"
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={!name.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
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
          <h1 className="text-4xl font-bold text-purple-300 mb-6">Fazoviy Tuzilishi Quiz</h1>
          <p className="text-purple-200 mb-8 text-lg">
            Yirik savol bazasidan 20 ta tasodifiy savol tanlanadi. Har safar yangi savollar!
          </p>
          <div className="bg-purple-950/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Mavzular:</h3>
            <ul className="space-y-3 text-purple-200">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Geometriya turlari (tetraedr, oktaedr, kvadrat tekislik, chiziqli)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Gibridlanish (sp³, dsp², d²sp³)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>VSEPR nazariyasi</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Fazoviy izomeriya (cis/trans, fac/mer)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Kristall maydon nazariyasi asoslari</span>
              </li>
            </ul>
          </div>
          <button
            onClick={handleStartQuiz}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-lg"
          >
            Quizni boshlash
          </button>
        </div>
      </main>
    )
  }

  // Natijalar sahifasi
  if (showResult) {
    const correctCount = answers.filter(a => a.isCorrect).length
    const percentage = Math.round((correctCount / questions.length) * 100)
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60

    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-purple-300 mb-6 text-center">Quiz Natijasi</h1>
            
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
                <div className="text-3xl font-bold text-purple-400 mb-1">{percentage}%</div>
                <div className="text-sm text-purple-300">Foiz</div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-400 mb-1">Ism:</div>
                  <div className="text-lg font-semibold text-purple-200">{name}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-400 mb-1">Vaqt:</div>
                  <div className="text-lg font-semibold text-purple-200">
                    {minutes} daqiqa {seconds} soniya
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExportPDF}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
              >
                📄 PDF yuklab olish
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
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
                      <div className="text-sm text-red-400 mb-1">Savol {answer.questionIndex + 1}</div>
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

  // Quiz davom etmoqda
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-purple-300">
              Savol {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-purple-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-purple-950/50 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                      ? 'bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20'
                      : isWrong
                      ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20'
                      : isSelected
                      ? 'bg-purple-800/60 border-purple-500'
                      : 'bg-purple-950/50 border-purple-700/50 hover:border-purple-500'
                  } ${isConfirmed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                ? 'bg-green-900/20 border border-green-700/50'
                : 'bg-red-900/20 border border-red-700/50'
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
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
              >
                {currentQuestionIndex < questions.length - 1 ? "Keyingi savol →" : "Natijalarni ko'rish"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}