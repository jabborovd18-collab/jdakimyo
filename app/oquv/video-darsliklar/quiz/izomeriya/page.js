"use client"

import Link from "next/link"
import { useState } from "react"

export default function QuizIzomeriya() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      q: "Tuzilish izomeriyasida formulalar qanday farq qiladi?",
      options: ["Bir xil yoziladi", "Har xil yoziladi", "Faqat indekslar farq qiladi", "Hech qanday farq yo'q"],
      correct: 1
    },
    {
      q: "Stereoizomeriyada formulalar qanday bo'ladi?",
      options: ["Har xil yoziladi", "Bir xil yoziladi, lekin fazoda farqli", "Faqat koeffitsiyentlar farq qiladi", "Ikkalasi ham to'g'ri"],
      correct: 1
    },
    {
      q: "Ionlanish izomeriyasiga qaysi juftlik misol bo'ladi?",
      options: ["sis-[PtCl₂(NH₃)₂] va trans-[PtCl₂(NH₃)₂]", "[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br", "fac-[Co(NH₃)₃Cl₃] va mer-[Co(NH₃)₃Cl₃]", "[Cr(H₂O)₆]Cl₃ va [CrCl(H₂O)₅]Cl₂·H₂O"],
      correct: 1
    },
    {
      q: "Gidrat izomeriyada nima farq qiladi?",
      options: ["Metall ionining zaryadi", "Ligandning donor atomi", "Suv molekulalarining ichki yoki tashqi sferada joylashishi", "Koordinatsion son"],
      correct: 2
    },
    {
      q: "CrCl₃·6H₂O nechta gidrat izomerga ega?",
      options: ["1 ta", "2 ta", "3 ta", "4 ta"],
      correct: 2
    },
    {
      q: "Bog'lanish izomeriyasi qanday ligandlar uchun xarakterli?",
      options: ["Monodentat ligandlar", "Ambidentat ligandlar", "Polidentat ligandlar", "Neytral ligandlar"],
      correct: 1
    },
    {
      q: "[Co(NH₃)₅NO₂]²⁺ va [Co(NH₃)₅ONO]²⁺ — bu qanday izomerlar?",
      options: ["Ionlanish izomerlari", "Gidrat izomerlari", "Bog'lanish izomerlari", "Geometrik izomerlar"],
      correct: 2
    },
    {
      q: "sis-[PtCl₂(NH₃)₂] ning biologik ahamiyati nimada?",
      options: ["Antibiotik", "Saraton davosi (sisplatin)", "Vitamin", "Ferment"],
      correct: 1
    },
    {
      q: "trans-[PtCl₂(NH₃)₂] biologik faolmi?",
      options: ["Ha, sisizomerdan kuchliroq", "Ha, lekin kuchsizroq", "Yo'q, biologik faol emas", "Ikkalasi ham bir xil"],
      correct: 2
    },
    {
      q: "fac-mer izomeriya qaysi tipdagi komplekslarda kuzatiladi?",
      options: ["MA₂B₂ tekis kvadrat", "MA₃B₃ oktaedrik", "MA₄B₂ oktaedrik", "MA₂B₂ tetraedrik"],
      correct: 1
    },
    {
      q: "Koordinatsion izomeriyaga misol qaysi?",
      options: ["[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br", "[Cr(NH₃)₆][Fe(CN)₆] va [Fe(NH₃)₆][Cr(CN)₆]", "[Co(NH₃)₅NO₂]Cl₂ va [Co(NH₃)₅ONO]Cl₂", "[Cr(H₂O)₆]Cl₃ va [CrCl(H₂O)₅]Cl₂·H₂O"],
      correct: 1
    },
    {
      q: "Optik izomeriya qanday molekulalarda kuzatiladi?",
      options: ["Simmetrik molekulalarda", "Xiral molekulalarda", "Chiziqli molekulalarda", "Barcha komplekslarda"],
      correct: 1
    },
    {
      q: "Qaysi izomer [Co(en)₂Cl₂]⁺ da optik faol?",
      options: ["trans-izomer", "sis-izomer", "Ikkalasi ham", "Ikkalasi ham emas"],
      correct: 1
    },
    {
      q: "Tetraedrik komplekslarda geometrik izomeriya bo'ladimi?",
      options: ["Ha, sis-trans shaklida", "Ha, fac-mer shaklida", "Yo'q, chunki 4 ta uch ekvivalent", "Faqat optik izomeriya bo'ladi"],
      correct: 2
    },
    {
      q: "Enantiomerlar qanday xususiyatga ega?",
      options: ["Qutblangan nur tekisligini buradi", "Rangi bir xil bo'lmaydi", "Kimyoviy formulasi har xil", "Faqat qattiq holatda mavjud"],
      correct: 0
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
          <h1 className="text-2xl font-bold text-pink-400">🔄 Izomeriyasi — Quiz</h1>
          <p className="text-purple-400 text-sm">15 ta savol • Tuzilish va stereoizomeriya</p>
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
                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
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
                        : "bg-purple-800/30 border-purple-700/30 text-purple-200 hover:bg-purple-700/40 hover:border-pink-400/50"
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
                if (percent >= 90) { emoji = "🏆"; title = "Ajoyib natija!"; color = "text-yellow-400"; message = "Siz izomeriyani mukammal bilasiz! Barcha izomeriya turlarini to'g'ri ajrata olasiz!" }
                else if (percent >= 70) { emoji = "👍"; title = "Yaxshi natija!"; color = "text-green-400"; message = "Izomeriya turlarini yaxshi tushungansiz. Sis-trans va fac-mer farqini bilasiz!" }
                else if (percent >= 50) { emoji = "📖"; title = "O'rtacha natija"; color = "text-blue-400"; message = "Asosiy tushunchalar bor. Izomeriya turlarini qayta ko'rib chiqing." }
                else { emoji = "💪"; title = "Harakat qilish kerak"; color = "text-pink-400"; message = "Izomeriya bo'limini qayta o'rganing. 3D modellar farqini ko'rishga yordam beradi!" }

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
                <button onClick={restart} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold hover:from-pink-400 hover:to-rose-400 transition-all transform hover:scale-105">🔄 Qayta yechish</button>
                <Link href="/oquv/video-darsliklar/quiz" className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all">📋 Boshqa testlar</Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}