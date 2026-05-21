"use client"

import Link from "next/link"
import { useState } from "react"

export default function QuizFazoviy() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      q: "KS = 2 bo'lgan chiziqli kompleksda gibridlanish qanday?",
      options: ["sp²", "sp³", "sp", "dsp²"],
      correct: 2
    },
    {
      q: "Chiziqli kompleksda valent burchak necha gradus?",
      options: ["90°", "109.5°", "120°", "180°"],
      correct: 3
    },
    {
      q: "Tetraedrik kompleksda gibridlanish qanday?",
      options: ["sp", "sp²", "sp³", "dsp²"],
      correct: 2
    },
    {
      q: "Tetraedrik kompleksda valent burchak necha gradus?",
      options: ["90°", "109.5°", "120°", "180°"],
      correct: 1
    },
    {
      q: "Tekis kvadrat kompleksda gibridlanish qanday?",
      options: ["sp³", "dsp² (sp²d)", "sp³d", "sp³d²"],
      correct: 1
    },
    {
      q: "KS = 6 bo'lgan oktaedrik kompleksda gibridlanish qanday?",
      options: ["sp³", "sp³d", "d²sp³ yoki sp³d²", "sp³d²f"],
      correct: 2
    },
    {
      q: "Oktaedrik kompleksda qo'shni ligandlar orasidagi burchak necha gradus?",
      options: ["60°", "90°", "109.5°", "120°"],
      correct: 1
    },
    {
      q: "Qaysi komplekslar asosan d¹⁰ konfiguratsiyali ionlar uchun xarakterli?",
      options: ["Oktaedrik", "Tetraedrik", "Chiziqli", "Trigonal bipiramida"],
      correct: 2
    },
    {
      q: "KS = 5, sp³d gibridlanish — qaysi geometriya?",
      options: ["Faqat trigonal bipiramida", "Faqat kvadrat piramida", "Trigonal bipiramida yoki kvadrat piramida", "Oktaedrik"],
      correct: 2
    },
    {
      q: "Qaysi geometrik shaklda geometrik izomeriya bo'lmaydi?",
      options: ["Tekis kvadrat", "Oktaedrik", "Tetraedrik", "Trigonal bipiramida"],
      correct: 2
    },
    {
      q: "[Ag(NH₃)₂]⁺ kompleksining fazoviy tuzilishi qanday?",
      options: ["Tetraedrik", "Chiziqli", "Tekis kvadrat", "Oktaedrik"],
      correct: 1
    },
    {
      q: "[Zn(OH)₄]²⁻ kompleksining fazoviy tuzilishi qanday?",
      options: ["Tekis kvadrat", "Oktaedrik", "Chiziqli", "Tetraedrik"],
      correct: 3
    },
    {
      q: "[Ni(CN)₄]²⁻ kompleksining fazoviy tuzilishi qanday?",
      options: ["Tetraedrik", "Oktaedrik", "Tekis kvadrat", "Chiziqli"],
      correct: 2
    },
    {
      q: "[Co(H₂O)₆]³⁺ kompleksining fazoviy tuzilishi qanday?",
      options: ["Tetraedrik", "Tekis kvadrat", "Trigonal bipiramida", "Oktaedrik"],
      correct: 3
    },
    {
      q: "Oktaedrik maydonda d-orbitallar nechta guruhga ajraladi?",
      options: ["1 ta", "2 ta: t₂g va eg", "3 ta: t₁, t₂, e", "4 ta"],
      correct: 1
    }
  ]

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    setTimeout(() => {
      const newAnswers = [...answers, index]
      setAnswers(newAnswers)
      setSelectedAnswer(null)
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1)
      } else {
        setShowResult(true)
      }
    }, 600)
  }

  const getScore = () => {
    let correct = 0
    answers.forEach((ans, i) => {
      if (ans === questions[i].correct) correct++
    })
    return correct
  }

  const restart = () => {
    setCurrentQ(0)
    setAnswers([])
    setShowResult(false)
    setSelectedAnswer(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/video-darsliklar/quiz" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">💎 Fazoviy tuzilishi — Quiz</h1>
          <p className="text-purple-400 text-sm">15 ta savol • Geometriya, gibridlanish, KS</p>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-12">
        
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <div className="flex justify-between mb-3">
                <span className="text-purple-300">Savol {currentQ + 1} / {questions.length}</span>
                <span className="text-purple-400">{Math.round((currentQ / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-purple-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">{questions[currentQ].q}</h2>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      selectedAnswer === i 
                        ? i === questions[currentQ].correct 
                          ? "bg-green-600/20 border-green-500 text-green-300"
                          : "bg-red-600/20 border-red-500 text-red-300"
                        : "bg-purple-800/30 border-purple-700/30 text-purple-200 hover:bg-purple-700/40 hover:border-purple-400/50"
                    }`}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-10">
              {(() => {
                const score = getScore()
                const percent = Math.round((score / questions.length) * 100)
                let emoji, title, message, color
                if (percent >= 90) { emoji = "🏆"; title = "Ajoyib natija!"; color = "text-yellow-400"; message = "Siz fazoviy tuzilishlarni mukammal bilasiz! Barcha geometriyalarni to'g'ri aniqlay olasiz!" }
                else if (percent >= 70) { emoji = "👍"; title = "Yaxshi natija!"; color = "text-green-400"; message = "Geometriyalarni yaxshi tushungansiz. Gibridlanishlarni biroz takrorlasangiz mukammal bo'ladi." }
                else if (percent >= 50) { emoji = "📖"; title = "O'rtacha natija"; color = "text-blue-400"; message = "Asosiy geometriyalarni bilasiz, lekin KS va gibridlanishni qayta ko'rib chiqing." }
                else { emoji = "💪"; title = "Harakat qilish kerak"; color = "text-pink-400"; message = "Fazoviy tuzilish bo'limini qayta o'rganing. 3D modellar yordamida geometriyalarni ko'rib chiqing!" }

                return (
                  <>
                    <div className="text-7xl mb-4">{emoji}</div>
                    <h2 className={`text-3xl font-bold ${color} mb-2`}>{title}</h2>
                    <div className="text-5xl font-extrabold text-white my-4">{percent}%</div>
                    <p className="text-purple-300 text-sm mb-2">To'g'ri javoblar: {score} / {questions.length}</p>
                    <p className="text-purple-200 mb-8">{message}</p>
                  </>
                )
              })()}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={restart} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-bold hover:from-purple-400 hover:to-indigo-400 transition-all transform hover:scale-105">🔄 Qayta yechish</button>
                <Link href="/oquv/video-darsliklar/quiz" className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all">📋 Boshqa testlar</Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}