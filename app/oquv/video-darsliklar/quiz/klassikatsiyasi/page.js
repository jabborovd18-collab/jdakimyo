"use client"

import Link from "next/link"
import { useState } from "react"

export default function QuizKlassifikatsiyasi() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      q: "Kompleks birikmalar qaysi birikmalar sinfiga ko'ra necha turga bo'linadi?",
      options: ["2 ta: kislota va asos", "3 ta: kislota, asos, tuz", "4 ta: kislota, asos, tuz, oksid", "2 ta: ion va molekulyar"],
      correct: 1
    },
    {
      q: "H₂[SiF₆] qaysi sinfga kiradi?",
      options: ["Kompleks asos", "Kompleks tuz", "Kompleks kislota", "Neytral kompleks"],
      correct: 2
    },
    {
      q: "[Ag(NH₃)₂]OH qaysi sinfga kiradi?",
      options: ["Kompleks kislota", "Kompleks asos", "Kompleks tuz", "Neytral kompleks"],
      correct: 1
    },
    {
      q: "Ligandlar tabiatiga ko'ra [Co(H₂O)₆]SO₄ qanday kompleks?",
      options: ["Ammiakat", "Akvakompleks", "Atsidokompleks", "Gidroksokompleks"],
      correct: 1
    },
    {
      q: "[Ag(NH₃)₂]Cl ligandlar tabiatiga ko'ra qanday kompleks?",
      options: ["Akvakompleks", "Atsidokompleks", "Ammiakat", "Gidroksokompleks"],
      correct: 2
    },
    {
      q: "K₂[HgI₄] ligandlar tabiatiga ko'ra qanday kompleks?",
      options: ["Akvakompleks", "Ammiakat", "Gidroksokompleks", "Atsidokompleks"],
      correct: 3
    },
    {
      q: "Na[Al(OH)₄] ligandlar tabiatiga ko'ra qanday kompleks?",
      options: ["Akvakompleks", "Atsidokompleks", "Gidroksokompleks", "Ammiakat"],
      correct: 2
    },
    {
      q: "[Co(NH₃)₆]Cl₃ zaryadiga ko'ra qanday kompleks?",
      options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Amfoter kompleks"],
      correct: 0
    },
    {
      q: "K₄[Fe(CN)₆] zaryadiga ko'ra qanday kompleks?",
      options: ["Kation kompleks", "Anion kompleks", "Neytral kompleks", "Kislotali kompleks"],
      correct: 1
    },
    {
      q: "Neytral komplekslarga qaysi misol to'g'ri keladi?",
      options: ["[Co(NH₃)₆]Cl₃", "K₄[Fe(CN)₆]", "[Pt(NH₃)₂Cl₂]", "[Ag(NH₃)₂]OH"],
      correct: 2
    },
    {
      q: "Kation kompleksning tashqi sferasida nima bo'ladi?",
      options: ["Kationlar", "Anionlar", "Neytral molekulalar", "Tashqi sfera bo'lmaydi"],
      correct: 1
    },
    {
      q: "Anion kompleksda markaziy atom nomiga nima qo'shiladi?",
      options: ["\"id\" qo'shimchasi", "\"at\" qo'shimchasi", "\"it\" qo'shimchasi", "Hech narsa qo'shilmaydi"],
      correct: 1
    },
    {
      q: "Qaysi metallar gidroksokompleks hosil qiladi?",
      options: ["Ishqoriy metallar", "Amfoter metallar", "Galogenlar", "Barcha metallar"],
      correct: 1
    },
    {
      q: "Xelat komplekslar qanday ligandlar bilan hosil bo'ladi?",
      options: ["Monodentat", "Bidentat va polidentat", "Faqat anion", "Faqat neytral"],
      correct: 1
    },
    {
      q: "[Ni(CO)₄] zaryadiga ko'ra qanday kompleks?",
      options: ["Kation", "Anion", "Neytral", "Kislota"],
      correct: 2
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
          <h1 className="text-2xl font-bold text-blue-400">📊 Klassifikatsiyasi — Quiz</h1>
          <p className="text-purple-400 text-sm">15 ta savol • Sinf, ligand, zaryad bo'yicha</p>
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
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
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
                        : "bg-purple-800/30 border-purple-700/30 text-purple-200 hover:bg-purple-700/40 hover:border-blue-400/50"
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
                if (percent >= 90) { emoji = "🏆"; title = "Ajoyib natija!"; color = "text-yellow-400"; message = "Siz klassifikatsiyani mukammal bilasiz! Barcha sinflarni to'g'ri ajrata olasiz!" }
                else if (percent >= 70) { emoji = "👍"; title = "Yaxshi natija!"; color = "text-green-400"; message = "Bilimingiz yaxshi! Klassifikatsiya turlarini yaxshi tushungansiz." }
                else if (percent >= 50) { emoji = "📖"; title = "O'rtacha natija"; color = "text-blue-400"; message = "Asosiy tushunchalar bor, lekin yana takrorlash kerak. Sinflarni qayta ko'rib chiqing." }
                else { emoji = "💪"; title = "Harakat qilish kerak"; color = "text-pink-400"; message = "Hozircha natija pastroq. Klassifikatsiya bo'limini qayta o'rganib chiqing va yana urinib ko'ring!" }

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
                <button onClick={restart} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:from-blue-400 hover:to-cyan-400 transition-all transform hover:scale-105">🔄 Qayta yechish</button>
                <Link href="/oquv/video-darsliklar/quiz" className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all">📋 Boshqa testlar</Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}