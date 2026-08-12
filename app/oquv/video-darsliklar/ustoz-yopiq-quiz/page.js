"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"

export default function UstozYopiqQuizRoyxatiPage() {
  const { status } = useSession()
  const [fon, fonTanla] = useFon()
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

  return (
    <main data-fon={fon} className="v3 v3-quiz min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      <header className="v3-header sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/oquv/video-darsliklar" className="v3-ikon-tugma" aria-label="Orqaga">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
            <span className="v3-quiz-header-ajratgich hidden sm:block" />
            <div className="hidden sm:block min-w-0">
              <div className="v3-nishon">O{"'"}qituvchilar testlari</div>
              <div className="v3-quiz-header-nom truncate">Yozma topshiriqlar</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <FonTanlagich fon={fon} onFonTanla={fonTanla} ixcham />
            <Link href="/oquv/video-darsliklar" className="v3-tugma text-xs py-1.5 px-3">
              Markazga qaytish
            </Link>
          </div>
        </div>
      </header>

      <div className="v3-konteyner py-8 sm:py-12 space-y-8 max-w-5xl">
        <div className="space-y-2">
          <div className="v3-nishon">Erkin javobli topshiriqlar</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--v3-matn)]">
            Variantsiz Yozma Testlar
          </h1>
          <p className="text-sm text-[var(--v3-xira)] leading-relaxed max-w-2xl">
            Bu bo{"'"}limdagi savollarga o{"'"}z so{"'"}zingiz bilan matn shaklida javob berasiz. Javobingizni ustoz shaxsan o{"'"}qib chiqadi va baholaydi.
          </p>
        </div>

        {status === "unauthenticated" ? (
          <div className="v3-panel-karta p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
              <Ikon nom="odam" olcham={22} />
            </div>
            <h3 className="font-bold text-base text-[var(--v3-matn)]">Tizimga kirish kerak</h3>
            <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
              Yozma testlarni ko{"'"}rish va topshirish uchun platformadagi hisobingizga kiring.
            </p>
            <Link href="/login" className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 inline-flex font-bold">
              Kirish →
            </Link>
          </div>
        ) : isLoading ? (
          <div className="py-24 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
            <Ikon nom="vaqt" olcham={18} className="animate-spin" />
            <span>Testlar yuklanmoqda...</span>
          </div>
        ) : error ? (
          <div className="v3-panel-karta p-6 text-center text-xs text-red-400">
            {error}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="v3-panel-karta py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
              <Ikon nom="fayl" olcham={24} />
            </div>
            <h3 className="font-bold text-base text-[var(--v3-matn)]">Hozircha yozma testlar yo{"'"}q</h3>
            <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
              Siz a{"'"}zo bo{"'"}lgan guruhlarda yangi yozma topshiriqlar e{"'"}lon qilinganda bu yerda ko{"'"}rinadi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => {
              const deadlineDate = quiz.deadline ? new Date(quiz.deadline) : null
              const isExpired = deadlineDate && Date.now() > deadlineDate.getTime()
              const lastSub = quiz.mySubmissions?.[0]
              const isGraded = lastSub?.status === 'graded'
              const isPending = lastSub?.status === 'pending'

              return (
                <div
                  key={quiz.id}
                  className="v3-panel-karta flex flex-col justify-between p-5 hover:border-[var(--v3-chiziq-2)] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="v3-tag v3-tag-yopiq">
                        <Ikon nom="odamlar" olcham={12} />
                        {quiz.group?.name ? `Guruh: ${quiz.group.name}` : 'Mening guruhim'}
                      </span>

                      {deadlineDate && (
                        <span className={`v3-tag ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                          <Ikon nom="taqvim" olcham={12} />
                          {isExpired ? 'Muddati o\'tgan' : deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-xs text-[var(--v3-xira)] line-clamp-2 mt-1 leading-relaxed">
                          {quiz.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-[var(--v3-xira)] font-mono border-t border-[var(--v3-chiziq)]">
                      <span>Savollar: <strong>{quiz._count?.questions || 0} ta</strong></span>
                      <span>Maksimal ball: <strong>{quiz.maxScore}</strong></span>
                      {quiz.timeLimit && <span>Vaqt: <strong>{quiz.timeLimit} daq</strong></span>}
                    </div>

                    {lastSub && (
                      <div className="p-2.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--v3-xira)]">Holati:</span>
                        <span className={`font-bold ${isGraded ? 'text-green-400' : 'text-amber-300'}`}>
                          {isGraded ? `Baholandi: ${lastSub.score}/${lastSub.maxScore}` : 'Ustoz tekshirmoqda'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-[var(--v3-chiziq)]">
                    <Link
                      href={`/oquv/video-darsliklar/ustoz-yopiq-quiz/${quiz.id}`}
                      className="w-full v3-tugma v3-tugma-asosiy text-xs py-2 justify-center font-bold"
                    >
                      {lastSub ? 'Topshiriqni ko\'rish' : 'Topshiriqni yechish →'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
