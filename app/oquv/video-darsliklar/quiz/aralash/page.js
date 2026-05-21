"use client"

import Link from "next/link"
import { useState } from "react"

export default function QuizAralash() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      q: "[Cu(NH₃)₄]SO₄ ning IUPAC nomi qanday?",
      options: ["tetraamminmis(II) sulfat", "tetraamminkuprat(II) sulfat", "mis tetraammin sulfat", "tetraamminmis(I) sulfat"],
      correct: 0,
      topic: "Nomlanishi"
    },
    {
      q: "K₃[Fe(CN)₆] da Fe ning oksidlanish darajasi necha?",
      options: ["+2", "+3", "+4", "+6"],
      correct: 1,
      topic: "Nomlanishi"
    },
    {
      q: "H₂[PtCl₆] qaysi sinfga kiradi?",
      options: ["Kompleks asos", "Kompleks tuz", "Kompleks kislota", "Neytral kompleks"],
      correct: 2,
      topic: "Klassifikatsiya"
    },
    {
      q: "Na[Al(OH)₄] ligandlar tabiatiga ko'ra qanday kompleks?",
      options: ["Akvakompleks", "Atsidokompleks", "Ammiakat", "Gidroksokompleks"],
      correct: 3,
      topic: "Klassifikatsiya"
    },
    {
      q: "[Ni(CO)₄] zaryadiga ko'ra qanday kompleks?",
      options: ["Kation", "Anion", "Neytral", "Kislota"],
      correct: 2,
      topic: "Klassifikatsiya"
    },
    {
      q: "Oktaedrik kompleksda gibridlanish qanday?",
      options: ["sp", "sp³", "d²sp³ yoki sp³d²", "sp³d"],
      correct: 2,
      topic: "Fazoviy tuzilish"
    },
    {
      q: "Tetraedrik kompleksda valent burchak necha gradus?",
      options: ["90°", "109.5°", "120°", "180°"],
      correct: 1,
      topic: "Fazoviy tuzilish"
    },
    {
      q: "Chiziqli komplekslar asosan qaysi konfiguratsiyali ionlar uchun xarakterli?",
      options: ["d⁵", "d⁸", "d¹⁰", "d³"],
      correct: 2,
      topic: "Fazoviy tuzilish"
    },
    {
      q: "sis-[PtCl₂(NH₃)₂] ning trans-izomeridan farqi nimada?",
      options: ["Faqat rangida", "Faqat eruvchanligida", "Biologik faolligida — sisplatin saraton davosi", "Hech qanday farqi yo'q"],
      correct: 2,
      topic: "Izomeriya"
    },
    {
      q: "Bog'lanish izomeriyasiga misol qaysi?",
      options: ["[Cr(H₂O)₆]Cl₃ va [CrCl(H₂O)₅]Cl₂·H₂O", "[Co(NH₃)₅NO₂]Cl₂ va [Co(NH₃)₅ONO]Cl₂", "[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br", "fac-[Co(NH₃)₃Cl₃] va mer-[Co(NH₃)₃Cl₃]"],
      correct: 1,
      topic: "Izomeriya"
    },
    {
      q: "Tetraedrik komplekslarda geometrik izomeriya bo'ladimi?",
      options: ["Ha, sis-trans", "Ha, fac-mer", "Yo'q", "Faqat optik izomeriya"],
      correct: 2,
      topic: "Izomeriya"
    },
    {
      q: "CN⁻ ligandi IUPAC bo'yicha qanday nomlanadi?",
      options: ["sian", "sianid", "siyano", "sianato"],
      correct: 2,
      topic: "Nomlanishi"
    },
    {
      q: "KS = 5, sp³d gibridlanish qaysi geometriyalarda uchraydi?",
      options: ["Faqat oktaedr", "Trigonal bipiramida va kvadrat piramida", "Faqat tetraedr", "Chiziqli va tekis kvadrat"],
      correct: 1,
      topic: "Fazoviy tuzilish"
    },
    {
      q: "Anion komplekslarda Fe qanday nomlanadi?",
      options: ["temir", "ferrat", "ferrum", "ferrit"],
      correct: 1,
      topic: "Nomlanishi"
    },
    {
      q: "Gidrat izomeriyada CrCl₃·6H₂O nechta izomer hosil qiladi?",
      options: ["1 ta", "2 ta", "3 ta", "4 ta"],
      correct: 2,
      topic: "Izomeriya"
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
          <h1 className="text-2xl font-bold text-yellow-400">🎯 Aralash test</h1>
          <p className="text-purple-400 text-sm">15 ta savol • Barcha mavzulardan aralash</p>
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
                <div className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 py-0.5 rounded-full text-xs">
                  {questions[currentQ].topic}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-6">{questions[currentQ].q}</h2>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      selectedAnswer === i 
                        ? i === questions[currentQ].correct 
                          ? "bg-green-600/20 border-green-500 text-green-300"
                          : "bg-red-600/20 border-red-500 text-red-300"
                        : "bg-purple-800/30 border-purple-700/30 text-purple-200 hover:bg-purple-700/40 hover:border-yellow-400/50"
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
                if (percent >= 90) { emoji = "🏆"; title = "Ajoyib natija!"; color = "text-yellow-400"; message = "Siz kompleks birikmalar bo'yicha haqiqiy mutaxassissiz! Barcha mavzularni mukammal bilasiz!" }
                else if (percent >= 70) { emoji = "👍"; title = "Yaxshi natija!"; color = "text-green-400"; message = "Bilimingiz mustahkam! Ayrim mavzularni biroz takrorlasangiz mukammal bo'ladi." }
                else if (percent >= 50) { emoji = "📖"; title = "O'rtacha natija"; color = "text-blue-400"; message = "Yaxshi boshlang'ich! Qaysi mavzuda xato qilganingizni tekshirib, o'sha bo'limni qayta o'rganing." }
                else { emoji = "💪"; title = "Harakat qilish kerak"; color = "text-pink-400"; message = "Xafa bo'lmang! Bu ajoyib boshlanish. Barcha bo'limlarni qayta ko'rib chiqing va yana urinib ko'ring!" }

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
                <button onClick={restart} className="px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl font-bold hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-105">🔄 Qayta yechish</button>
                <Link href="/oquv/video-darsliklar/quiz" className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all">📋 Boshqa testlar</Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}