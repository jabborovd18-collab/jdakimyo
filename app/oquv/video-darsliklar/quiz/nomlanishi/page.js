"use client"

import Link from "next/link"
import { useState } from "react"

export default function QuizNomlanishi() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      q: "[Ag(NH₃)₂]Cl ning IUPAC bo'yicha nomi qanday?",
      options: ["diamminkumush(I) xlorid", "diamminkumush(II) xlorid", "kumush diamminklorid", "diaminargentum xlorid"],
      correct: 0
    },
    {
      q: "K₄[Fe(CN)₆] ning IUPAC bo'yicha nomi qanday?",
      options: ["kaliy geksasiyanoferrat(II)", "kaliy geksasiyanoferrat(III)", "kaliy geksasiyanotemir(II)", "temir kaliy sianid"],
      correct: 0
    },
    {
      q: "H₂O ligandi IUPAC bo'yicha qanday nomlanadi?",
      options: ["gidro", "akva", "okso", "gidroksoniy"],
      correct: 1
    },
    {
      q: "NH₃ ligandi IUPAC bo'yicha qanday nomlanadi?",
      options: ["amid", "amin", "ammin", "ammoniy"],
      correct: 2
    },
    {
      q: "CO ligandi IUPAC bo'yicha qanday nomlanadi?",
      options: ["karbonat", "karbonil", "karboksil", "karbon"],
      correct: 1
    },
    {
      q: "Cl⁻ ligandi kompleks birikmada qanday nomlanadi?",
      options: ["xlor", "xlorid", "xloro", "xlorit"],
      correct: 2
    },
    {
      q: "[Co(NH₃)₆]Cl₃ ning to'g'ri nomini toping.",
      options: ["geksaamminkobalt(III) xlorid", "geksaamminkobalt(II) xlorid", "kobalt geksaammin xlorid", "geksaamminxlorokobalt"],
      correct: 0
    },
    {
      q: "CN⁻ ligandi qanday nomlanadi?",
      options: ["sian", "sianid", "siyano", "sianato"],
      correct: 2
    },
    {
      q: "Kompleks birikma nomini aytishda dastlab nima aytiladi?",
      options: ["anion", "kation", "ligand", "markaziy atom"],
      correct: 1
    },
    {
      q: "OH⁻ ligandi qanday nomlanadi?",
      options: ["gidroksil", "gidroksid", "gidrokso", "gidro"],
      correct: 2
    },
    {
      q: "[Fe(CN)₆]³⁻ da Fe ning oksidlanish darajasi necha?",
      options: ["+2", "+3", "+4", "+6"],
      correct: 1
    },
    {
      q: "Polidentat ligandlar sonini ko'rsatishda qanday prefiks ishlatiladi?",
      options: ["di-, tri-, tetra-", "do-, tro-, tetro-", "bis-, tris-, tetrakis-", "ikki, uch, to'rt"],
      correct: 2
    },
    {
      q: "Anion komplekslarda markaziy atom nomiga nima qo'shiladi?",
      options: ["\"it\" qo'shimchasi", "\"at\" qo'shimchasi", "\"id\" qo'shimchasi", "o'zgartirish kiritilmaydi"],
      correct: 1
    },
    {
      q: "Fe anion kompleksda qanday nomlanadi?",
      options: ["temir", "ferrat", "ferrit", "ferrum"],
      correct: 1
    },
    {
      q: "Ligandlar qaysi ketma-ketlikda aytiladi?",
      options: ["kation → neytral → anion", "anion → neytral → kation", "neytral → anion → kation", "alfavit tartibida, zaryadga qaralmaydi"],
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
          <h1 className="text-2xl font-bold text-red-400">📖 Nomlanishi — Quiz</h1>
          <p className="text-purple-400 text-sm">15 ta savol • IUPAC qoidalari asosida</p>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-12">
        
        {!showResult ? (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <div className="flex justify-between mb-3">
                <span className="text-purple-300">Savol {currentQ + 1} / {questions.length}</span>
                <span className="text-purple-400">{Math.round((currentQ / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-purple-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Savol */}
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">{questions[currentQ].q}</h2>
              
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      selectedAnswer === i 
                        ? i === questions[currentQ].correct 
                          ? "bg-green-600/20 border-green-500 text-green-300"
                          : "bg-red-600/20 border-red-500 text-red-300"
                        : "bg-purple-800/30 border-purple-700/30 text-purple-200 hover:bg-purple-700/40 hover:border-red-400/50"
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
          /* NATIJA */
          <div className="text-center">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-10">
              {(() => {
                const score = getScore()
                const percent = Math.round((score / questions.length) * 100)
                
                let emoji, title, message, color
                if (percent >= 90) {
                  emoji = "🏆"; title = "Ajoyib natija!"; color = "text-yellow-400"
                  message = "Siz nomlanish qoidalarini mukammal bilasiz! IUPAC bo'yicha haqiqiy mutaxassissiz!"
                } else if (percent >= 70) {
                  emoji = "👍"; title = "Yaxshi natija!"; color = "text-green-400"
                  message = "Bilimingiz yaxshi, lekin yana bir oz takrorlasangiz mukammal bo'ladi. Davom eting!"
                } else if (percent >= 50) {
                  emoji = "📖"; title = "O'rtacha natija"; color = "text-blue-400"
                  message = "Bilimingiz yetarli, lekin yana ko'proq o'rganish kerak. Nomlanish qoidalarini qayta ko'rib chiqing."
                } else {
                  emoji = "💪"; title = "Harakat qilish kerak"; color = "text-pink-400"
                  message = "Hozircha natija pastroq, lekin bu — o'rganish uchun ajoyib imkoniyat! Qoidalarni takrorlang va qayta urinib ko'ring."
                }

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
                <button 
                  onClick={restart}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold hover:from-red-400 hover:to-orange-400 transition-all transform hover:scale-105"
                >
                  🔄 Qayta yechish
                </button>
                <Link 
                  href="/oquv/video-darsliklar/quiz"
                  className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all"
                >
                  📋 Boshqa testlar
                </Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}