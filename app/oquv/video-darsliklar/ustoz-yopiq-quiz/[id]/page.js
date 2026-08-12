"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"

export default function YopiqQuizYechishPage() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const [fon, fonTanla] = useFon()

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const startedAt = useRef(Date.now())

  useEffect(() => {
    if (!id) return
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

  // Timer
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

  const handleTextChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (isSubmitting || !data?.canSubmit) return

    const questionIds = (data.quiz?.questions || []).map((q) => q.id)
    const formatted = questionIds.map((qid) => ({
      questionId: qid,
      answer: (answers[qid] || "").trim(),
    }))

    const emptyCount = formatted.filter((item) => !item.answer).length
    if (emptyCount > 0) {
      const ok = confirm(
        `${emptyCount} ta savolga javob yozmadingiz. Shunday bo'lsa ham topshirilsinmi?`
      )
      if (!ok) return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/oquv/yopiq-quiz/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: formatted,
          timeSpent: elapsed,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Topshirib bo'lmadi")

      toast.success("Javoblaringiz qabul qilindi! Ustoz tekshirib baholaydi.")
      
      // Reload details
      const refreshRes = await fetch(`/api/oquv/yopiq-quiz/${id}`)
      const refreshData = await refreshRes.json()
      if (refreshRes.ok) setData(refreshData)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Topshiriq yuklanmoqda...</span>
        </div>
      </main>
    )
  }

  if (error || !data?.quiz) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="font-bold text-lg text-[var(--v3-matn)]">Topshiriq ochilmadi</h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{error || "Topshiriq topilmadi"}</p>
          <Link href="/oquv/video-darsliklar/ustoz-yopiq-quiz" className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex">
            Barcha yozma testlarga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { quiz, lastSubmission, canSubmit, reason } = data

  return (
    <main data-fon={fon} className="v3 v3-quiz min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Top Header */}
      <header className="v3-header sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/oquv/video-darsliklar/ustoz-yopiq-quiz" className="v3-ikon-tugma" aria-label="Orqaga">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--v3-matn)] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {quiz.title}
              </div>
              <div className="text-[10.5px] text-[var(--v3-xira)]">
                Ustoz: {quiz.teacher?.fullName || quiz.teacher?.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {canSubmit && (
              <div className="px-3 py-1 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] border-[var(--v3-chiziq)]">
                <Ikon nom="vaqt" olcham={13} />
                {vaqtMatni(elapsed)}
              </div>
            )}
            <FonTanlagich fon={fon} onFonTanla={fonTanla} ixcham />
          </div>
        </div>
      </header>

      <div className="v3-konteyner py-8 max-w-3xl space-y-6">
        {/* Sarlavha Karta */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="v3-tag v3-tag-yopiq">
              <Ikon nom="fayl" olcham={12} />
              Variantsiz (Yozma)
            </span>
            {quiz.group?.name && (
              <span className="v3-tag v3-tag-ochiq">
                {quiz.group.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
            {quiz.title}
          </h1>

          {quiz.description && (
            <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
              {quiz.description}
            </p>
          )}

          {quiz.instructions && (
            <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-xs text-[var(--v3-xira)] leading-relaxed">
              <strong className="text-[var(--v3-urgu)] block mb-0.5">Ustoz ko{"'"}rsatmasi:</strong>
              {quiz.instructions}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--v3-xira)] pt-2 border-t border-[var(--v3-chiziq)]">
            <span>Savollar: <strong>{quiz.questions?.length || 0} ta</strong></span>
            <span>Maksimal ball: <strong>{quiz.maxScore}</strong></span>
            {quiz.timeLimit && <span>Vaqt chegarasi: <strong>{quiz.timeLimit} daqiqa</strong></span>}
          </div>
        </div>

        {/* Oldingi topshirilgan ish (agar bo'lsa) */}
        {lastSubmission && (
          <div className="v3-panel-karta p-6 space-y-4 border-l-4 border-l-[var(--v3-urgu)]">
            <div className="flex items-center justify-between">
              <span className="v3-nishon">Topshirgan ishingiz holati</span>
              <span className={`v3-tag ${lastSubmission.status === 'graded' ? 'v3-tag-ochiq' : 'v3-tag-yopiq'}`}>
                {lastSubmission.status === 'graded' ? 'Baholangan' : 'Ustoz tekshirmoqda'}
              </span>
            </div>

            {lastSubmission.status === 'graded' ? (
              <div className="space-y-3">
                <div className="text-2xl font-bold font-mono text-green-400">
                  {lastSubmission.score} / {lastSubmission.maxScore} ball
                </div>
                {lastSubmission.feedback && (
                  <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-500/5 text-xs text-[var(--v3-matn)] leading-relaxed">
                    <strong className="text-green-400 block mb-0.5">Ustoz izohi (Feedback):</strong>
                    {lastSubmission.feedback}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--v3-xira)]">
                Javoblaringiz yuborilgan ({new Date(lastSubmission.submittedAt).toLocaleString('uz-UZ')}). Ustoz tekshirib ball qo{"'"}yganida natija shu yerda ko{"'"}rinadi.
              </p>
            )}
          </div>
        )}

        {/* Savollar va Yozish Formasi */}
        {canSubmit ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="v3-nishon">Yozma javoblaringizni kiriting</div>

            <div className="space-y-4">
              {quiz.questions?.map((q, idx) => (
                <div key={q.id} className="v3-panel-karta p-6 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-[var(--v3-urgu)] uppercase">
                      {idx + 1}-SAVOL ({q.maxPoints} ball)
                    </span>
                    {q.hint && (
                      <span className="text-[11px] text-[var(--v3-xira)] italic">
                        Maslahat: {q.hint}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-[var(--v3-matn)] leading-relaxed">
                    {q.questionText}
                  </h3>

                  <textarea
                    rows={4}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    placeholder="Bu yerga to'liq, asoslangan javobingizni yozing..."
                    className="v3-kiritish resize-y text-xs leading-relaxed font-sans"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--v3-chiziq)]">
              <Link href="/oquv/video-darsliklar/ustoz-yopiq-quiz" className="v3-tugma text-xs py-2.5 px-4">
                Bekor qilish
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold"
              >
                {isSubmitting ? 'Yuborilmoqda...' : '✓ Topshirishni tasdiqlash'}
              </button>
            </div>
          </form>
        ) : (
          !lastSubmission && (
            <div className="v3-panel-karta p-6 text-center text-xs text-[var(--v3-xira)]">
              {reason || "Topshirish imkoniyati cheklangan."}
            </div>
          )
        )}
      </div>
    </main>
  )
}
