// app/oquv/video-darsliklar/ustoz-yopiq-quiz/page.js
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

/**
 * Talaba uchun yopiq (variantsiz) quizlar ro'yxati.
 *
 * Bu sahifa umuman mavjud emas edi — video-darsliklar sahifasidagi
 * "Variantsiz o'qituvchilar testlari" kartasi 404 ga olib borardi.
 */
export default function UstozYopiqQuizRoyxati() {
  const { status } = useSession()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      setIsLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch("/api/oquv/yopiq-quiz")
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Yuklab bo'lmadi")
        if (!cancelled) setQuizzes(data.quizzes || [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [status])

  const holatBelgisi = (quiz) => {
    const oxirgi = quiz.mySubmissions?.[0]
    if (!oxirgi) return null
    if (oxirgi.status === "graded") {
      return {
        matn: `Baholandi: ${oxirgi.score}/${oxirgi.maxScore}`,
        rang: "bg-green-600/20 text-green-400 border-green-600/40",
      }
    }
    return {
      matn: "Tekshirilmoqda",
      rang: "bg-amber-600/20 text-amber-400 border-amber-600/40",
    }
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-xl font-bold text-white mb-2">Kirish talab qilinadi</h1>
          <p className="text-purple-300 text-sm mb-6">
            Ustoz quizlarini ko&apos;rish uchun tizimga kiring
          </p>
          <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl inline-block">
            Kirish
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 bg-purple-950/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-purple-400 mb-2">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span>›</span>
            <Link href="/oquv/video-darsliklar" className="hover:text-purple-300">Video &amp; Quiz</Link>
            <span>›</span>
            <span className="text-amber-400 font-semibold">Variantsiz testlar</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span>✍️</span> Variantsiz testlar
          </h1>
          <p className="text-purple-300 text-sm mt-1">
            Javobni o&apos;zingiz yozasiz — ustoz qo&apos;lda baholaydi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading ? (
          <div className="text-center py-16 text-purple-300">Yuklanmoqda...</div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-purple-900/20 border border-purple-700/40 rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-lg font-bold text-white mb-2">Hozircha test yo&apos;q</h2>
            <p className="text-purple-300 text-sm">
              Ustozingiz variantsiz test yaratganda shu yerda ko&apos;rinadi.
              Avval ustoz sizni o&apos;z guruhiga qo&apos;shishi kerak.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {quizzes.map((quiz) => {
              const holat = holatBelgisi(quiz)
              return (
                <div
                  key={quiz.id}
                  className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-white text-base sm:text-lg break-words">
                        {quiz.title}
                      </h2>
                      <p className="text-purple-400 text-xs mt-1">
                        {quiz.teacher.fullName || quiz.teacher.username}
                        {quiz.group ? ` · ${quiz.group.name}` : ""}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] px-2 py-0.5 bg-purple-950/60 border border-purple-700/50 rounded-full text-purple-300">
                          {quiz.questionCount} savol
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-950/60 border border-purple-700/50 rounded-full text-purple-300">
                          {quiz.maxScore} ball
                        </span>
                        {quiz.timeLimit ? (
                          <span className="text-[10px] px-2 py-0.5 bg-purple-950/60 border border-purple-700/50 rounded-full text-purple-300">
                            ⏱ {quiz.timeLimit} daqiqa
                          </span>
                        ) : null}
                        {quiz.deadline ? (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            quiz.expired
                              ? "bg-red-600/20 text-red-400 border-red-600/40"
                              : "bg-purple-950/60 text-purple-300 border-purple-700/50"
                          }`}>
                            {quiz.expired ? "Muddat tugagan" : `Muddat: ${new Date(quiz.deadline).toLocaleDateString("uz-UZ")}`}
                          </span>
                        ) : null}
                        {holat ? (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${holat.rang}`}>
                            {holat.matn}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:flex-shrink-0">
                      {quiz.canSubmit ? (
                        <Link
                          href={`/oquv/video-darsliklar/ustoz-yopiq-quiz/${quiz.id}`}
                          className="block text-center px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm"
                        >
                          Boshlash
                        </Link>
                      ) : (
                        <Link
                          href={`/oquv/video-darsliklar/ustoz-yopiq-quiz/${quiz.id}`}
                          className="block text-center px-5 py-2.5 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-xl text-sm"
                        >
                          Ko&apos;rish
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
