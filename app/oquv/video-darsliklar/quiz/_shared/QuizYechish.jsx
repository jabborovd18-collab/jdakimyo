"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useQuizBank } from "./useQuizBank"
import { saveQuizHistory, updateQuizStats } from "./utils/storage"
import { quizniTop } from "./quiz-config"

const TEZKOR_KALIT = "jda-quiz-tezkor"

function vaqtniYoz(soniya) {
  const daqiqa = Math.floor(soniya / 60)
  const qoldiq = soniya % 60
  return `${daqiqa}:${String(qoldiq).padStart(2, "0")}`
}

function QuizSarlavha({ fon, fonTanla, nom }) {
  return (
    <header className="v3-header">
      <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/oquv/video-darsliklar/quiz" className="v3-ikon-tugma" aria-label="Quiz menyusiga qaytish">
            <Ikon nom="chap" olcham={18} />
          </Link>
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="v3-logo" aria-hidden="true" />
            <span className="v3-logo-matn hidden sm:inline">JDA KIMYO</span>
          </Link>
          <span className="v3-quiz-header-ajratgich" />
          <div className="min-w-0">
            <div className="v3-nishon">Quiz markazi</div>
            <div className="v3-quiz-header-nom truncate">{nom}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/oquv/video-darsliklar/quiz" className="v3-tugma v3-mobil-yashir">
            Barcha mavzular
          </Link>
          <FonTanlagich fon={fon} tanla={fonTanla} />
        </div>
      </div>
    </header>
  )
}

function TezkorTanlov({ yoqilgan, onChange, ixcham = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={yoqilgan}
      onClick={() => onChange(!yoqilgan)}
      className={`v3-quiz-switch-qator ${ixcham ? "is-ixcham" : ""}`}
    >
      <span className="v3-quiz-switch-matn">
        <span className="v3-quiz-switch-nom">Tezkor davom etish</span>
        {!ixcham && (
          <span className="v3-quiz-switch-izoh">
            Variant bosilishi bilan izohni ochmasdan keyingi savolga o'tadi.
          </span>
        )}
      </span>
      <span className={`v3-quiz-switch ${yoqilgan ? "is-yoqilgan" : ""}`} aria-hidden="true">
        <span />
      </span>
    </button>
  )
}

export default function QuizYechish({ slug }) {
  const config = quizniTop(slug)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [fon, fonTanla] = useFon()
  const { questions, isLoading: bankLoading, error: bankError } = useQuizBank(slug, 20)

  const isAuthenticated = status === "authenticated"
  const [userName, setUserName] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saqlashNatija, setSaqlashNatija] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [tezkor, setTezkor] = useState(false)

  // Tezkor rejimda ketma-ket ikki marta bosish bitta savolga ikki javob
  // yozmasligi uchun holat React qayta chizishidan oldin ham qulflanadi.
  const otishBandRef = useRef(false)
  const yakunBandRef = useRef(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserName(session.user.fullName || session.user.username || "")
    }
  }, [status, session])

  useEffect(() => {
    try {
      setTezkor(localStorage.getItem(TEZKOR_KALIT) === "1")
    } catch {
      // Maxfiy rejimda localStorage yopiq bo'lsa tanlov faqat shu sahifada qoladi.
    }
  }, [])

  useEffect(() => {
    if (!quizStarted || showResult || !startTime) return
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [quizStarted, showResult, startTime])

  if (!config) return null

  const tezkorTanla = (qiymat) => {
    setTezkor(qiymat)
    try {
      localStorage.setItem(TEZKOR_KALIT, qiymat ? "1" : "0")
    } catch {
      // Tanlov ishlayveradi, faqat keyingi tashrifgacha saqlanmaydi.
    }
  }

  const startQuiz = () => {
    if (!isAuthenticated && userName.trim().length < 2) return
    setQuizStarted(true)
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsConfirmed(false)
    setAnswers([])
    setElapsedTime(0)
    setSaqlashNatija(null)
    setStartTime(Date.now())
    yakunBandRef.current = false
  }

  const javobYasa = (tanlov) => {
    const savol = questions[currentQuestionIndex]
    return {
      questionId: savol.id,
      questionIndex: currentQuestionIndex,
      question: savol.question,
      selectedAnswer: tanlov,
      correctAnswer: savol.correct,
      isCorrect: tanlov === savol.correct,
      explanation: savol.explanation,
      category: savol.category,
    }
  }

  const submitQuizResult = async (yakuniyJavoblar) => {
    if (!isAuthenticated) return null

    const score = yakuniyJavoblar.filter((a) => a.isCorrect).length
    const percentage = Math.round((score / questions.length) * 100)

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizName: config.natijaNomi,
          category: config.slug,
          score,
          totalQuestions: questions.length,
          percentage,
          timeSpent: elapsedTime,
          // Server keyingi bosqichda ballni o'zi tekshirishi uchun haqiqiy
          // javoblar ham yuboriladi; faqat yakuniy songa bog'lanib qolmaymiz.
          answers: yakuniyJavoblar.map((a) => ({
            questionId: a.questionId,
            selected: a.selectedAnswer,
          })),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Natijani saqlab bo'lmadi")

      if (data.missionResult?.success) {
        toast.success("Kunlik quiz missiyasi bajarildi")
      }
      if (data.missionResult?.starEarned) {
        toast.success("Bugungi yulduz hisobingizga qo'shildi")
      }
      return data
    } catch (error) {
      console.error("[Quiz Submit Error]:", error)
      toast.error("Natija serverga saqlanmadi. Mahalliy natijangiz yo'qolmaydi.")
      return null
    }
  }

  const yakunla = async (yakuniyJavoblar) => {
    if (yakunBandRef.current) return
    yakunBandRef.current = true
    setIsSubmitting(true)

    const correctCount = yakuniyJavoblar.filter((a) => a.isCorrect).length
    saveQuizHistory(config.slug, questions.map((q) => q.id))
    updateQuizStats(config.slug, { total: questions.length, correct: correctCount })

    const serverNatija = await submitQuizResult(yakuniyJavoblar)
    setSaqlashNatija(isAuthenticated ? Boolean(serverNatija) : null)
    setShowResult(true)
    setIsSubmitting(false)
  }

  const keyingiYokiYakunla = async (yakuniyJavoblar) => {
    setAnswers(yakuniyJavoblar)

    if (currentQuestionIndex >= questions.length - 1) {
      await yakunla(yakuniyJavoblar)
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
    setSelectedAnswer(null)
    setIsConfirmed(false)
  }

  const handleAnswerSelect = async (answerIndex) => {
    if (isConfirmed || isSubmitting || otishBandRef.current) return
    setSelectedAnswer(answerIndex)

    if (!tezkor) return

    otishBandRef.current = true
    try {
      const yangiJavoblar = [...answers, javobYasa(answerIndex)]
      await keyingiYokiYakunla(yangiJavoblar)
    } finally {
      otishBandRef.current = false
    }
  }

  const handleConfirm = () => {
    if (selectedAnswer === null || isConfirmed || isSubmitting) return
    setAnswers((oldingi) => [...oldingi, javobYasa(selectedAnswer)])
    setIsConfirmed(true)
  }

  const handleNext = async () => {
    if (!isConfirmed || isSubmitting) return
    await keyingiYokiYakunla(answers)
  }

  const handleExportPDF = async () => {
    const { generateQuizPDF, prepareAnswersForPDF } = await import("./utils/pdf")
    generateQuizPDF({
      userName,
      answers: prepareAnswersForPDF(answers),
      questions,
      elapsedTime,
      quizName: config.pdfNomi,
    })
  }

  const qaytaBoshlash = () => {
    // Yangi savollar to'plami server va tarix asosida qayta tanlanishi
    // uchun sahifa yangilanadi; faqat holatni tozalash eski savollarni berardi.
    window.location.reload()
  }

  // Klaviatura bilan ishlash: 1–4 variant, Enter esa tasdiqlash/keyingi.
  useEffect(() => {
    if (!quizStarted || showResult || bankLoading || bankError) return

    const tugma = (event) => {
      const teg = event.target?.tagName?.toLowerCase()
      if (teg === "input" || teg === "textarea" || event.metaKey || event.ctrlKey || event.altKey) return

      const index = ["1", "2", "3", "4"].indexOf(event.key)
      if (index >= 0 && index < (questions[currentQuestionIndex]?.options?.length || 0)) {
        event.preventDefault()
        handleAnswerSelect(index)
        return
      }

      if (event.key === "Enter") {
        if (!isConfirmed && selectedAnswer !== null && !tezkor) {
          event.preventDefault()
          handleConfirm()
        } else if (isConfirmed) {
          event.preventDefault()
          handleNext()
        }
      }
    }

    window.addEventListener("keydown", tugma)
    return () => window.removeEventListener("keydown", tugma)
  }, [
    quizStarted, showResult, bankLoading, bankError, questions,
    currentQuestionIndex, selectedAnswer, isConfirmed, tezkor, answers, isSubmitting,
  ])

  const qobiq = (children, markaz = false) => (
    <main data-fon={fon} className={`v3 v3-quiz min-h-screen ${markaz ? "flex flex-col" : ""}`}>
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>
      <QuizSarlavha fon={fon} fonTanla={fonTanla} nom={config.nom} />
      {children}
    </main>
  )

  if (status === "loading" || bankLoading) {
    return qobiq(
      <section className="v3-quiz-markaz flex-1">
        <div className="v3-quiz-yuklash" aria-live="polite">
          <span className="v3-quiz-spinner" />
          <div>
            <div className="v3-quiz-yuklash-nom">Savollar tayyorlanmoqda</div>
            <div className="v3-xira text-sm">Takrorlanmagan va muvozanatli to'plam tuzilmoqda.</div>
          </div>
        </div>
      </section>,
      true,
    )
  }

  if (bankError) {
    return qobiq(
      <section className="v3-quiz-markaz flex-1 px-4">
        <div className="v3-quiz-xato-karta">
          <span className="v3-quiz-katta-ikon is-xato"><Ikon nom="taqiq" olcham={25} /></span>
          <div className="v3-nishon mb-2">Yuklash xatosi</div>
          <h1 className="v3-quiz-h2 mb-3">Savollarni olib bo'lmadi</h1>
          <p className="v3-xira text-sm leading-relaxed mb-6">{bankError}</p>
          <button onClick={() => window.location.reload()} className="v3-tugma-asosiy v3-katta">
            <Ikon nom="qayta" olcham={17} />
            Qayta urinish
          </button>
        </div>
      </section>,
      true,
    )
  }

  if (!quizStarted) {
    return qobiq(
      <section className="v3-konteyner relative z-10 py-10 md:py-16 w-full">
        <div className="v3-quiz-kirish-grid">
          <div className="v3-quiz-kirish-asosiy">
            <div className="v3-eyebrow mb-5">
              <span className="v3-nuqta" />
              {config.aralash ? "Umumiy bilim sinovi" : `Mavzu ${config.raqam}`}
            </div>
            <h1 className="v3-quiz-h1">{config.sarlavha}</h1>
            <p className="v3-quiz-lid">{config.tavsif}</p>
            <div className="v3-quiz-formula">{config.formula}</div>

            <div className="v3-quiz-kirish-sonlar">
              <div><strong>20</strong><span>savol</span></div>
              <div><strong>4</strong><span>variant</span></div>
              <div><strong>PDF</strong><span>yakuniy hisobot</span></div>
            </div>
          </div>

          <aside className="v3-quiz-sozlama-karta">
            <div className="v3-nishon mb-3">Boshlashdan oldin</div>

            {isAuthenticated ? (
              <div className="v3-quiz-hisob-qator">
                <span className="v3-bosharf">{userName.charAt(0).toUpperCase()}</span>
                <span className="min-w-0">
                  <strong className="block truncate">{userName}</strong>
                  <span className="v3-xira text-xs">Natija profilingizga saqlanadi</span>
                </span>
                <Ikon nom="belgi" olcham={17} className="v3-urgu-matn ml-auto" />
              </div>
            ) : (
              <label className="v3-quiz-maydon">
                <span>Ism-familya</span>
                <input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && startQuiz()}
                  placeholder="PDF hisobot uchun"
                  autoComplete="name"
                />
              </label>
            )}

            <TezkorTanlov yoqilgan={tezkor} onChange={tezkorTanla} />

            <button
              type="button"
              onClick={startQuiz}
              disabled={!isAuthenticated && userName.trim().length < 2}
              className="v3-tugma-asosiy v3-katta w-full justify-center"
            >
              Testni boshlash
              <Ikon nom="ong" olcham={17} />
            </button>

            {!isAuthenticated && (
              <button type="button" onClick={() => router.push("/login")} className="v3-quiz-kirish-havola">
                Tizimga kirish va natijani saqlash
              </button>
            )}
          </aside>
        </div>

        <div className="v3-quiz-mavzular">
          <div className="v3-nishon md:col-span-2 lg:col-span-4">Test qamrovi</div>
          {config.mavzular.map((mavzu, index) => (
            <div key={mavzu} className="v3-quiz-mavzu">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{mavzu}</p>
            </div>
          ))}
        </div>
      </section>,
    )
  }

  const correctCount = answers.filter((a) => a.isCorrect).length
  const percentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0

  if (showResult) {
    const xatolar = answers.filter((a) => !a.isCorrect)
    const categoryStats = config.aralash
      ? ["nomlanishi", "klassifikatsiyasi", "fazoviy", "izomeriya"].map((category) => {
          const shuMavzu = answers.filter((a) => a.category === category)
          return {
            config: quizniTop(category),
            total: shuMavzu.length,
            correct: shuMavzu.filter((a) => a.isCorrect).length,
          }
        })
      : []

    return qobiq(
      <section className="v3-konteyner relative z-10 py-8 md:py-12 w-full">
        <div className="v3-quiz-natija-bosh">
          <div>
            <div className="v3-eyebrow mb-4"><span className="v3-nuqta" /> Test yakunlandi</div>
            <h1 className="v3-quiz-h1 mb-3">Natija va tahlil</h1>
            <p className="v3-quiz-lid mb-0">{config.nom} bo'yicha javoblaringiz bir joyda jamlandi.</p>
          </div>
          <div className="v3-quiz-foiz" style={{ "--quiz-foiz": percentage }}>
            <div><strong>{percentage}%</strong><span>aniqlik</span></div>
          </div>
        </div>

        {isAuthenticated && (
          <div className={`v3-quiz-saqlash ${saqlashNatija ? "is-yaxshi" : "is-xato"}`}>
            <Ikon nom={saqlashNatija ? "belgi" : "taqiq"} olcham={18} />
            <span>
              {saqlashNatija
                ? "Natija profilingizga saqlandi."
                : "Serverga saqlash amalga oshmadi, ammo quyidagi mahalliy natija saqlanib qoldi."}
            </span>
          </div>
        )}

        <div className="v3-quiz-stat-grid">
          <div className="v3-quiz-stat is-yaxshi"><span>To'g'ri</span><strong>{correctCount}</strong></div>
          <div className="v3-quiz-stat is-xato"><span>Xato</span><strong>{questions.length - correctCount}</strong></div>
          <div className="v3-quiz-stat"><span>Jami</span><strong>{questions.length}</strong></div>
          <div className="v3-quiz-stat"><span>Vaqt</span><strong>{vaqtniYoz(elapsedTime)}</strong></div>
        </div>

        {categoryStats.length > 0 && (
          <div className="v3-quiz-kesim-grid">
            {categoryStats.map((stat) => (
              <div key={stat.config.slug} className="v3-quiz-kesim">
                <span>{stat.config.qisqa}</span>
                <strong>{stat.correct}/{stat.total}</strong>
                <small>{stat.config.nom}</small>
              </div>
            ))}
          </div>
        )}

        <div className="v3-quiz-amallar">
          <button onClick={handleExportPDF} className="v3-tugma-asosiy v3-katta">
            <Ikon nom="fayl" olcham={17} />
            PDF hisobot
          </button>
          {isAuthenticated && (
            <button onClick={() => router.push("/profil/quizlar")} className="v3-tugma v3-katta">
              <Ikon nom="grafik" olcham={17} />
              Profil natijalari
            </button>
          )}
          <button onClick={qaytaBoshlash} className="v3-tugma v3-katta">
            <Ikon nom="qayta" olcham={17} />
            Yangi test
          </button>
          <Link href="/oquv/video-darsliklar/quiz" className="v3-tugma v3-katta">
            Boshqa mavzu
          </Link>
        </div>

        <div className="v3-quiz-tahlil-bosh">
          <div>
            <div className="v3-nishon mb-2">Xatolar tahlili</div>
            <h2 className="v3-quiz-h2">Qayta ko'rish kerak bo'lgan savollar</h2>
          </div>
          <span className="v3-chip">{xatolar.length} ta savol</span>
        </div>

        {xatolar.length === 0 ? (
          <div className="v3-quiz-toza">
            <span className="v3-quiz-katta-ikon"><Ikon nom="belgi" olcham={25} /></span>
            <div>
              <strong>Barcha javoblar to'g'ri</strong>
              <p>Bu mavzu bo'yicha xato topilmadi.</p>
            </div>
          </div>
        ) : (
          <div className="v3-quiz-xato-list">
            {xatolar.map((answer) => {
              const savol = questions.find((q) => q.id === answer.questionId)
              return (
                <article key={answer.questionId} className="v3-quiz-xato-band">
                  <div className="v3-quiz-xato-raqam">{String(answer.questionIndex + 1).padStart(2, "0")}</div>
                  <div className="min-w-0">
                    <h3>{answer.question}</h3>
                    <div className="v3-quiz-javob-taqqos">
                      <div className="is-xato"><span>Siz tanlagan</span><strong>{savol?.options?.[answer.selectedAnswer]}</strong></div>
                      <div className="is-yaxshi"><span>To'g'ri javob</span><strong>{savol?.options?.[answer.correctAnswer]}</strong></div>
                    </div>
                    <div className="v3-quiz-izoh"><strong>Tushuntirish</strong><p>{answer.explanation}</p></div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>,
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return qobiq(
    <section className="v3-konteyner relative z-10 py-5 md:py-8 w-full">
      <div className="v3-quiz-ish-panel">
        <div className="v3-quiz-progress-bosh">
          <div>
            <div className="v3-nishon">Savol {String(currentQuestionIndex + 1).padStart(2, "0")}</div>
            <div className="v3-quiz-progress-son">{currentQuestionIndex + 1} / {questions.length}</div>
          </div>
          <div className="v3-quiz-progress-meta">
            {config.aralash && <span className="v3-chip">{quizniTop(currentQuestion.category)?.nom}</span>}
            <span><Ikon nom="vaqt" olcham={15} />{vaqtniYoz(elapsedTime)}</span>
            <TezkorTanlov yoqilgan={tezkor} onChange={tezkorTanla} ixcham />
          </div>
        </div>
        <div className="v3-quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="v3-quiz-yechish-grid">
        <div className="v3-quiz-savol-karta">
          <div className="v3-quiz-savol-bosh">
            <span className="v3-quiz-savol-nishon"><Ikon nom="quiz" olcham={19} /></span>
            <h1>{currentQuestion.question}</h1>
          </div>

          <div className="v3-quiz-variantlar">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = isConfirmed && index === currentQuestion.correct
              const isWrong = isConfirmed && isSelected && index !== currentQuestion.correct

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isConfirmed || isSubmitting}
                  aria-pressed={isSelected}
                  className={`v3-quiz-variant ${isSelected ? "is-tanlangan" : ""} ${isCorrect ? "is-togri" : ""} ${isWrong ? "is-xato" : ""}`}
                >
                  <span className="v3-quiz-harf">{String.fromCharCode(65 + index)}</span>
                  <span className="flex-1">{option}</span>
                  {isCorrect && <Ikon nom="belgi" olcham={18} />}
                  {isWrong && <Ikon nom="yopish" olcham={18} />}
                </button>
              )
            })}
          </div>

          {isConfirmed && (
            <div className={`v3-quiz-xulosa ${selectedAnswer === currentQuestion.correct ? "is-togri" : "is-xato"}`}>
              <div className="v3-quiz-xulosa-bosh">
                <Ikon nom={selectedAnswer === currentQuestion.correct ? "belgi" : "yopish"} olcham={18} />
                <strong>{selectedAnswer === currentQuestion.correct ? "Javob to'g'ri" : "Javob xato"}</strong>
              </div>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="v3-quiz-past-amal">
            {!isConfirmed ? (
              tezkor ? (
                <span className="v3-quiz-tezkor-holat">
                  <Ikon nom="ong" olcham={17} />
                  Bir bosishda davom etish yoqilgan
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={selectedAnswer === null}
                  className="v3-tugma-asosiy v3-katta"
                >
                  Javobni tasdiqlash
                  <Ikon nom="belgi" olcham={17} />
                </button>
              )
            ) : (
              <button type="button" onClick={handleNext} disabled={isSubmitting} className="v3-tugma-asosiy v3-katta">
                {isSubmitting ? "Saqlanmoqda" : currentQuestionIndex < questions.length - 1 ? "Keyingi savol" : "Natijani ko'rish"}
                {!isSubmitting && <Ikon nom="ong" olcham={17} />}
              </button>
            )}
            <span className="v3-quiz-klavish">
              {tezkor ? "Variantni tanlang — keyingi savol avtomatik ochiladi" : "1–4: variant · Enter: davom etish"}
            </span>
          </div>
        </div>

        <aside className="v3-quiz-navigator">
          <div className="v3-nishon mb-3">Savollar xaritasi</div>
          <div className="v3-quiz-nuqta-grid">
            {questions.map((question, index) => (
              <span
                key={question.id}
                className={`${index === currentQuestionIndex ? "is-joriy" : ""} ${index < answers.length ? "is-bajarilgan" : ""}`}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <div className="v3-quiz-navigator-izoh">
            <div><span className="is-joriy" /> Joriy savol</div>
            <div><span className="is-bajarilgan" /> Javob berilgan</div>
          </div>
          <div className="v3-quiz-navigator-past">
            <span>Aniqlik</span>
            <strong>{answers.length ? Math.round((correctCount / answers.length) * 100) : 0}%</strong>
          </div>
        </aside>
      </div>
    </section>,
  )
}
