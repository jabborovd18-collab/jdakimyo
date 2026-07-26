// app/oquv/video-darsliklar/ustoz-yopiq-quiz/[id]/page.js
"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

/**
 * Talaba yopiq (variantsiz) quizni yechadigan sahifa.
 * Har bir savolga matn bilan javob yoziladi, ustoz keyin qo'lda baholaydi.
 */
export default function YopiqQuizYechish() {
  const { id } = useParams()
  const router = useRouter()

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const startedAt = useRef(Date.now())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch(`/api/oquv/yopiq-quiz/${id}`)
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "Yuklab bo'lmadi")
        if (!cancelled) {
          setData(payload)
          startedAt.current = Date.now()
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  // Sarflangan vaqt
  useEffect(() => {
    if (!data?.canSubmit) return
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [data?.canSubmit])

  const vaqtMatni = (soniya) => {
    const m = Math.floor(soniya / 60)
    const s = soniya % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  const yozilganSoni = Object.values(answers).filter((v) => v && v.trim()).length

  const topshirish = async () => {
    const tayyor = Object.entries(answers)
      .filter(([, v]) => v && v.trim())
      .map(([questionId, answer]) => ({ questionId, answer }))

    if (tayyor.length === 0) {
      toast.error("Kamida bitta savolga javob yozing")
      return
    }

    const jami = data.quiz.questions.length
    if (tayyor.length < jami) {
      const davom = confirm(
        `${jami} ta savoldan ${tayyor.length} tasiga javob yozdingiz.\nBaribir topshirasizmi?`,
      )
      if (!davom) return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/oquv/yopiq-quiz/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: tayyor,
          timeSpent: Math.floor((Date.now() - startedAt.current) / 1000),
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Yuborib bo'lmadi")

      toast.success(payload.message, { duration: 5000 })
      router.push("/oquv/video-darsliklar/ustoz-yopiq-quiz")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-purple-300">Yuklanmoqda...</div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <Link href="/oquv/video-darsliklar/ustoz-yopiq-quiz" className="px-6 py-3 bg-purple-800/60 border border-purple-600/50 rounded-xl inline-block text-white">
            Orqaga
          </Link>
        </div>
      </main>
    )
  }

  const { quiz, mySubmissions, canSubmit, expired, attemptsUsed } = data
  const oxirgi = mySubmissions?.[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white pb-28">
      {/* Sarlavha */}
      <header className="border-b border-purple-800/50 bg-purple-950/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Link href="/oquv/video-darsliklar/ustoz-yopiq-quiz" className="text-purple-400 text-xs hover:text-purple-300">
                ← Ro&apos;yxatga
              </Link>
              <h1 className="font-bold text-base sm:text-xl truncate">{quiz.title}</h1>
              <p className="text-purple-400 text-xs truncate">
                {quiz.teacher.fullName || quiz.teacher.username} · {quiz.maxScore} ball
              </p>
            </div>
            {canSubmit ? (
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-purple-400">Vaqt</div>
                <div className="font-mono text-sm text-yellow-400">{vaqtMatni(elapsed)}</div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Oldingi topshiriq natijasi */}
        {oxirgi ? (
          <div className={`rounded-2xl p-4 border ${
            oxirgi.status === "graded"
              ? "bg-green-900/20 border-green-700/50"
              : "bg-amber-900/20 border-amber-700/50"
          }`}>
            <h2 className="font-bold text-sm mb-1">
              {oxirgi.status === "graded" ? "✓ Baholandi" : "⏳ Tekshirilmoqda"}
            </h2>
            {oxirgi.status === "graded" ? (
              <>
                <p className="text-2xl font-bold text-green-400">
                  {oxirgi.score} / {oxirgi.maxScore}
                </p>
                {oxirgi.feedback ? (
                  <p className="text-purple-200 text-sm mt-2 whitespace-pre-wrap">{oxirgi.feedback}</p>
                ) : null}
              </>
            ) : (
              <p className="text-purple-300 text-sm">
                Javoblaringiz ustozga yuborildi. Baholangach shu yerda ko&apos;rinadi.
              </p>
            )}
          </div>
        ) : null}

        {/* Ko'rsatmalar */}
        {quiz.instructions ? (
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-2xl p-4">
            <h2 className="font-semibold text-blue-300 text-sm mb-1">📋 Ko&apos;rsatma</h2>
            <p className="text-purple-200 text-sm whitespace-pre-wrap">{quiz.instructions}</p>
          </div>
        ) : null}

        {/* Topshirib bo'lmaydigan holat */}
        {!canSubmit ? (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 text-sm text-purple-300">
            {expired
              ? "Topshirish muddati tugagan."
              : attemptsUsed >= quiz.maxAttempts
              ? `Urinishlar soni tugagan (${quiz.maxAttempts} ta).`
              : "Bu quizda hali savol yo'q."}
          </div>
        ) : null}

        {/* Savollar */}
        {quiz.questions.map((savol, index) => (
          <div key={savol.id} className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-semibold text-sm sm:text-base flex-1">
                <span className="text-yellow-400">{index + 1}.</span> {savol.questionText}
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-purple-950/60 border border-purple-700/50 rounded-full text-purple-300 flex-shrink-0">
                {savol.maxPoints} ball
              </span>
            </div>

            {savol.hint ? (
              <p className="text-purple-400 text-xs mb-3">💡 {savol.hint}</p>
            ) : null}

            {canSubmit ? (
              <textarea
                value={answers[savol.id] || ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [savol.id]: e.target.value }))}
                rows={4}
                placeholder="Javobingizni shu yerga yozing..."
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 focus:border-yellow-500 outline-none resize-y"
              />
            ) : oxirgi ? (
              <div className="bg-purple-950/50 rounded-xl p-3 text-sm text-purple-200 whitespace-pre-wrap">
                {oxirgi.answers?.find((a) => a.questionId === savol.id)?.answer || (
                  <span className="text-purple-500 italic">Javob yozilmagan</span>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </section>

      {/* Pastdagi topshirish paneli — mobil uchun qulay */}
      {canSubmit ? (
        <div className="fixed bottom-0 inset-x-0 border-t border-purple-800/50 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="text-xs text-purple-300">
              {yozilganSoni} / {quiz.questions.length} javob yozildi
            </div>
            <button
              onClick={topshirish}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Yuborilmoqda..." : "Topshirish"}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
