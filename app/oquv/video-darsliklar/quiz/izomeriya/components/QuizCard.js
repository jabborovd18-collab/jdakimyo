"use client"
import { useState } from "react"

/**
 * QuizCard — Savol kartasi komponenti
 * Premium dizayn, interaktiv, animations
 * 
 * @param {Object} props
 * @param {Object} props.question - savol obyekti
 * @param {number} props.questionIndex - savol indeksi (0 dan)
 * @param {number} props.totalQuestions - jami savollar soni
 * @param {Function} props.onAnswer - javob callback
 */
export default function QuizCard({ question, questionIndex, totalQuestions, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

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
      const isCorrect = selectedAnswer === question.correct
      
      onAnswer({
        questionIndex,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correct,
        isCorrect,
        explanation: question.explanation
      })
    }
  }

  // Variant rangini aniqlash
  const getOptionStyle = (index) => {
    const isSelected = selectedAnswer === index
    const isCorrect = index === question.correct
    const showCorrect = isConfirmed && isCorrect
    const showWrong = isConfirmed && isSelected && !isCorrect

    if (showCorrect) {
      return "bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20"
    }
    if (showWrong) {
      return "bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20"
    }
    if (isSelected) {
      return "bg-purple-800/60 border-purple-500"
    }
    return "bg-purple-950/50 border-purple-700/50 hover:border-purple-500 hover:bg-purple-900/40"
  }

  // Progress
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-purple-300 font-semibold">
            Savol {questionIndex + 1} / {totalQuestions}
          </div>
          <div className="text-sm text-purple-400 font-mono">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-purple-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Savol kartasi */}
      <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-2xl p-8 shadow-2xl">
        {/* Savol raqami va matni */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {questionIndex + 1}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
            {question.difficulty && (
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  question.difficulty === "oson" ? "bg-green-900/40 text-green-400 border border-green-700/50" :
                  question.difficulty === "o'rta" ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700/50" :
                  "bg-red-900/40 text-red-400 border border-red-700/50"
                }`}>
                  {question.difficulty}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Variantlar */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const showCorrect = isConfirmed && index === question.correct
            const showWrong = isConfirmed && selectedAnswer === index && index !== question.correct

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isConfirmed}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${getOptionStyle(index)} ${
                  isConfirmed ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-purple-700/50 flex items-center justify-center font-bold text-lg text-white flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-white">{option}</span>
                  {showCorrect && (
                    <span className="text-green-400 text-2xl flex-shrink-0">✓</span>
                  )}
                  {showWrong && (
                    <span className="text-red-400 text-2xl flex-shrink-0">✗</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Tushuntirish */}
        {isConfirmed && (
          <div className={`p-6 rounded-xl border-2 ${
            selectedAnswer === question.correct
              ? "bg-green-900/20 border-green-700/50"
              : "bg-red-900/20 border-red-700/50"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-2xl ${
                selectedAnswer === question.correct ? "text-green-400" : "text-red-400"
              }`}>
                {selectedAnswer === question.correct ? "✓" : "✗"}
              </span>
              <span className={`text-lg font-bold ${
                selectedAnswer === question.correct ? "text-green-400" : "text-red-400"
              }`}>
                {selectedAnswer === question.correct ? "To'g'ri!" : "Xato"}
              </span>
            </div>
            <div className="text-sm text-purple-200 leading-relaxed">
              {question.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Tugmalar */}
      <div className="flex gap-4">
        {!isConfirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-800 disabled:to-purple-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg disabled:shadow-none"
          >
            Javobni tasdiqlash
          </button>
        ) : (
          <button
            onClick={() => {
              // Reset qilish (parent komponent boshqaradi)
              setSelectedAnswer(null)
              setIsConfirmed(false)
              onAnswer(null) // Keyingi savolga o'tish signali
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
          >
            {questionIndex < totalQuestions - 1 ? "Keyingi savol →" : "Natijalarni ko'rish →"}
          </button>
        )}
      </div>
    </div>
  )
}