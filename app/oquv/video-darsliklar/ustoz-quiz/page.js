"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'
import QuizUlashishModal from '@/components/QuizUlashishModal'

export default function UstozQuizlarKatalogPage() {
  const { data: session } = useSession()
  const [fon, fonTanla] = useFon()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'public' | 'mine' | 'completed'
  const [search, setSearch] = useState('')

  // Modals
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [shareQuiz, setShareQuiz] = useState(null)

  useEffect(() => {
    fetchQuizzes()
  }, [filter, search])

  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ filter, search })
      const res = await fetch(`/api/oquv/ustoz-quiz?${params}`)
      const data = await res.json()
      if (res.ok) {
        setQuizzes(data.quizzes || [])
      } else {
        toast.error(data.error || 'Testlarni yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Testlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizClick = (quiz) => {
    // Check if expired
    if (quiz.deadline && Date.now() > new Date(quiz.deadline).getTime()) {
      toast.error('Bu testning topshirish muhlati tugagan!')
      return
    }

    if (quiz.accessCode && !quiz.hasAccess) {
      setSelectedQuiz(quiz)
      setShowCodeModal(true)
    } else {
      window.location.href = `/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`
    }
  }

  const handleCodeSubmit = async () => {
    if (!accessCode.trim()) {
      toast.error('Kodni kiriting!')
      return
    }

    try {
      const res = await fetch('/api/oquv/ustoz-quiz/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: selectedQuiz.id,
          code: accessCode
        })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Ruxsat tasdiqlandi!')
        window.location.href = `/oquv/video-darsliklar/ustoz-quiz/${selectedQuiz.id}`
      } else {
        toast.error(data.error || 'Kod noto\'g\'ri!')
      }
    } catch (err) {
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <main data-fon={fon} className="v3 v3-quiz min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Header */}
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
              <div className="v3-quiz-header-nom truncate">Variantli testlar katalogi</div>
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

      <div className="v3-konteyner py-8 sm:py-12 space-y-8">
        {/* Title and Intro */}
        <div className="max-w-3xl space-y-2">
          <div className="v3-nishon">Ochiq va guruhli testlar</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--v3-matn)]">
            Ustozlar Tomonidan Tuzilgan Testlar
          </h1>
          <p className="text-sm text-[var(--v3-xira)] leading-relaxed">
            Platformaning tajribali ustozlari tomonidan tuzilgan variantli testlar. Ommaviy testlarni barcha yechishi mumkin, guruhli testlar esa talabalar bilimini baholashga mo{"'"}ljallangan.
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="v3-panel-karta p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`v3-tugma text-xs py-1.5 px-3.5 whitespace-nowrap ${filter === 'all' ? 'v3-tugma-asosiy' : ''}`}
            >
              Barchasi ({quizzes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('mine')}
              className={`v3-tugma text-xs py-1.5 px-3.5 whitespace-nowrap ${filter === 'mine' ? 'v3-tugma-asosiy' : ''}`}
            >
              Mening ustozlarim
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`v3-tugma text-xs py-1.5 px-3.5 whitespace-nowrap ${filter === 'completed' ? 'v3-tugma-asosiy' : ''}`}
            >
              Yechilganlar
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Test yoki ustoz nomi..."
              className="v3-kiritish text-xs py-1.5 pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
              <Ikon nom="qidiruv" olcham={13} />
            </span>
          </div>
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="py-24 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
            <Ikon nom="vaqt" olcham={18} className="animate-spin" />
            <span>Testlar yuklanmoqda...</span>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="v3-panel-karta py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
              <Ikon nom="quiz" olcham={24} />
            </div>
            <h3 className="font-bold text-base text-[var(--v3-matn)]">Testlar topilmadi</h3>
            <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
              Qidiruv so{"'"}rovingiz bo{"'"}yicha yoki sizning guruhlaringizda hozircha faol testlar yo{"'"}q.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => {
              const deadlineDate = quiz.deadline ? new Date(quiz.deadline) : null
              const isExpired = deadlineDate && Date.now() > deadlineDate.getTime()
              const teacherName = quiz.teacher?.fullName || quiz.teacher?.username || 'O\'qituvchi'
              const userAttempt = quiz.userAttempt

              return (
                <div
                  key={quiz.id}
                  className="v3-panel-karta flex flex-col justify-between p-5 hover:border-[var(--v3-chiziq-2)] transition-all group"
                >
                  <div className="space-y-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {quiz.isPublic ? (
                        <span className="v3-tag v3-tag-ochiq">
                          <Ikon nom="ochiq" olcham={12} />
                          Ommaviy (Public)
                        </span>
                      ) : (
                        <span className="v3-tag v3-tag-yopiq">
                          <Ikon nom="qulf" olcham={12} />
                          {quiz.group?.name || 'Guruhli'}
                        </span>
                      )}

                      {deadlineDate && (
                        <span className={`v3-tag ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                          <Ikon nom="taqvim" olcham={12} />
                          {isExpired ? 'Muhlati o\'tgan' : deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    {/* Teacher info */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                        {quiz.teacher?.avatar ? (
                          <img src={quiz.teacher.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          teacherName[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[var(--v3-matn)] truncate">
                          {teacherName}
                        </div>
                        <div className="text-[10px] text-[var(--v3-xira)] truncate">
                          {quiz.teacher?.university || 'O\'qituvchi'}
                        </div>
                      </div>
                    </div>

                    {/* Quiz Title */}
                    <div>
                      <h3 className="font-bold text-base text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors line-clamp-2">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-xs text-[var(--v3-xira)] line-clamp-2 mt-1 leading-relaxed">
                          {quiz.description.startsWith('{') ? (JSON.parse(quiz.description).originalDescription || '') : quiz.description}
                        </p>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-[var(--v3-xira)] font-mono border-t border-[var(--v3-chiziq)]">
                      <span>Savollar: <strong>{quiz._count?.questions || 0}</strong></span>
                      {quiz.timeLimit && (
                        <span>Vaqt: <strong>{quiz.timeLimit} daq</strong></span>
                      )}
                      <span>Urinishlar: <strong>{quiz._count?.attempts || 0}</strong></span>
                    </div>

                    {/* Previous Result (if attempted) */}
                    {userAttempt && (
                      <div className="p-2.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--v3-xira)]">Oxirgi natijangiz:</span>
                        <span className="font-bold text-[var(--v3-urgu)]">
                          {userAttempt.score}/{userAttempt.maxScore} ({userAttempt.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-[var(--v3-chiziq)]">
                    <button
                      type="button"
                      onClick={() => handleQuizClick(quiz)}
                      disabled={isExpired}
                      className={`flex-1 v3-tugma text-xs py-2 justify-center font-bold ${
                        isExpired ? 'opacity-50 cursor-not-allowed' : 'v3-tugma-asosiy'
                      }`}
                    >
                      {isExpired ? 'Muddati tugagan' : userAttempt ? 'Qayta yechish' : 'Testni boshlash'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShareQuiz(quiz)}
                      className="v3-tugma text-xs p-2 shrink-0"
                      title="Do'stlarga ulashish"
                    >
                      <Ikon nom="ulashish" olcham={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Access Code Modal */}
      {showCodeModal && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[var(--v3-matn)]">Maxfiy kod talab qilinadi</div>
              <button onClick={() => setShowCodeModal(false)} className="text-[var(--v3-xira)] hover:text-[var(--v3-matn)]">
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
              <strong>{selectedQuiz.title}</strong> testiga kirish uchun ustoz bergan maxfiy kodni kiriting:
            </p>

            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Maxfiy kod..."
              className="v3-kiritish text-center font-mono tracking-widest text-base uppercase"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="v3-tugma text-xs py-2 px-3"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleCodeSubmit}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
              >
                Kirish →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareQuiz && (
        <QuizUlashishModal
          quiz={shareQuiz}
          onClose={() => setShareQuiz(null)}
        />
      )}
    </main>
  )
}
