"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

export default function YopiqQuizManagePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [activeView, setActiveView] = useState('list') // 'list' | 'create' | 'grade'
  const [quizzes, setQuizzes] = useState([])
  const [groups, setGroups] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, graded: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Create form state
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    groupId: '',
    timeLimit: 45,
    maxAttempts: 1,
    deadline: '',
    questions: [
      { questionText: '', maxPoints: 10, hint: '' }
    ]
  })

  // Grade view state
  const [selectedQuizId, setSelectedQuizId] = useState(null)
  const [quizDetails, setQuizDetails] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' })
  const [isGrading, setIsGrading] = useState(false)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ustoz/yopiq-quiz')
      const data = await res.json()
      if (res.ok) {
        setQuizzes(data.quizzes || [])
        setGroups(data.groups || [])
        setStats(data.stats || { total: 0, pending: 0, graded: 0 })
      } else {
        toast.error(data.error || 'Yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Ma\'lumotlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  // Bitta quizning topshiriqlarini tekshirish uchun ochish
  const openGradeView = async (quizId) => {
    setSelectedQuizId(quizId)
    setActiveView('grade')
    setSelectedSubmission(null)
    setIsLoading(true)

    try {
      const res = await fetch(`/api/ustoz/yopiq-quiz?quizId=${quizId}`)
      const data = await res.json()
      if (res.ok && data.quiz) {
        setQuizDetails(data.quiz)
        if (data.quiz.submissions?.length > 0) {
          const firstPending = data.quiz.submissions.find(s => s.status === 'pending') || data.quiz.submissions[0]
          selectSubmissionToGrade(firstPending)
        }
      } else {
        toast.error(data.error || 'Topshiriqlar topilmadi')
      }
    } catch (err) {
      toast.error('Yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const selectSubmissionToGrade = (sub) => {
    setSelectedSubmission(sub)
    setGradeData({
      score: sub.score !== null ? String(sub.score) : '',
      feedback: sub.feedback || ''
    })
  }

  // Baholash
  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return

    const s = parseInt(gradeData.score)
    if (isNaN(s) || s < 0 || s > selectedSubmission.maxScore) {
      toast.error(`Ball 0 dan ${selectedSubmission.maxScore} gacha bo'lishi kerak`)
      return
    }

    setIsGrading(true)
    try {
      const res = await fetch('/api/ustoz/yopiq-quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score: s,
          feedback: gradeData.feedback,
          status: 'graded'
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Baholab bo\'lmadi')

      toast.success(data.message || 'Baho muvaffaqiyatli saqlandi!')
      
      // Ro'yxatni yangilash
      openGradeView(selectedQuizId)
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsGrading(false)
    }
  }

  // Savol qo'shish
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: '', maxPoints: 10, hint: '' }
      ]
    }))
  }

  const removeQuestion = (idx) => {
    if (formData.questions.length <= 1) {
      toast.error('Kamida 1 ta savol bo\'lishi shart')
      return
    }
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }))
  }

  const updateQuestion = (idx, field, value) => {
    const next = [...formData.questions]
    next[idx][field] = value
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Yaratish
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Quiz sarlavhasini kiriting')
      return
    }

    for (let i = 0; i < formData.questions.length; i++) {
      if (!formData.questions[i].questionText.trim()) {
        toast.error(`${i + 1}-savol matnini kiriting`)
        return
      }
    }

    setIsCreating(true)
    try {
      const res = await fetch('/api/ustoz/yopiq-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          instructions: formData.instructions,
          groupId: formData.groupId || null,
          timeLimit: formData.timeLimit,
          maxAttempts: formData.maxAttempts,
          deadline: formData.deadline || null,
          questions: formData.questions
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yaratib bo\'lmadi')

      toast.success(data.message || 'Yozma quiz yaratildi!')
      setActiveView('list')
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  // O'chirish
  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" yozma quizini haqiqatan ham o'chirmoqchimisiz?`)) return
    try {
      const res = await fetch(`/api/ustoz/yopiq-quiz?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || 'Quiz o\'chirildi')
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Yozma topshiriqlar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Variantsiz (Yozma) Ustoz Testlari
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Erkin javobli savollar tuzing va talabalarning javoblarini shaxsan tekshirib, ball qo{"'"}ying.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('list')}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeView === 'list' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="fayl" olcham={15} />
            Testlar ro{"'"}yxati ({quizzes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('create')}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeView === 'create' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="qosh" olcham={15} />
            Yangi yozma test
          </button>
        </div>
      </div>

      {/* Stats row */}
      {activeView === 'list' && (
        <div className="grid grid-cols-3 gap-3.5">
          <div className="v3-panel-karta p-4">
            <div className="text-xs text-[var(--v3-xira)] font-medium">Jami yozma testlar</div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-matn)] mt-1">{stats.total}</div>
          </div>
          <div className="v3-panel-karta p-4 border-l-4 border-l-[var(--v3-urgu)]">
            <div className="text-xs text-[var(--v3-xira)] font-medium">Tekshirish kutilayotgan</div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-urgu)] mt-1">{stats.pending}</div>
          </div>
          <div className="v3-panel-karta p-4">
            <div className="text-xs text-[var(--v3-xira)] font-medium">Baholangan ishlar</div>
            <div className="text-2xl font-bold font-mono text-[var(--v3-matn)] mt-1">{stats.graded}</div>
          </div>
        </div>
      )}

      {/* ─── VIEW 1: LIST ─── */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Yozma testlar yuklanmoqda...</span>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="v3-panel-karta py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto mb-3 text-[var(--v3-urgu)]">
                <Ikon nom="fayl" olcham={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--v3-matn)]">Yozma testlar mavjud emas</h3>
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto mt-1 mb-5">
                Talabalar erkin matn shaklida javob qaytaradigan savollar to{"'"}plamini yarating.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('create')}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2"
              >
                <Ikon nom="qosh" olcham={15} />
                Yangi test tuzish
              </button>
            </div>
          ) : (
            <div className="grid gap-3.5">
              {quizzes.map((quiz) => {
                const deadlineDate = quiz.deadline ? new Date(quiz.deadline) : null
                const isExpired = deadlineDate && Date.now() > deadlineDate.getTime()

                return (
                  <div
                    key={quiz.id}
                    className="v3-panel-karta p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="v3-tag v3-tag-yopiq">
                          <Ikon nom="odamlar" olcham={12} />
                          {quiz.group?.name ? `Guruh: ${quiz.group.name}` : 'Barcha talabalar'}
                        </span>

                        {deadlineDate && (
                          <span className={`v3-tag ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                            <Ikon nom="taqvim" olcham={12} />
                            {isExpired ? 'Muddati o\'tgan' : 'Muhlat: '}
                            {deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}

                        {quiz.pendingCount > 0 && (
                          <span className="v3-tag bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse font-bold">
                            <Ikon nom="vaqt" olcham={12} />
                            {quiz.pendingCount} ta baholash kutilmoqda
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-[var(--v3-matn)] leading-snug">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-xs text-[var(--v3-xira)] line-clamp-1 mt-0.5">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[var(--v3-xira)] font-mono">
                        <span>Savollar: <strong>{quiz._count?.questions || 0} ta</strong></span>
                        <span>Topshirilgan: <strong>{quiz._count?.submissions || 0} ta</strong></span>
                        <span>Maksimal ball: <strong>{quiz.maxScore}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--v3-chiziq)]">
                      <button
                        type="button"
                        onClick={() => openGradeView(quiz.id)}
                        className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold"
                      >
                        <Ikon nom="orin" olcham={14} />
                        Tekshirish va Baholash ({quiz._count?.submissions || 0})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(quiz.id, quiz.title)}
                        className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="O'chirish"
                      >
                        <Ikon nom="ochir" olcham={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── VIEW 2: BAHOLASH (GRADE VIEW) ─── */}
      {activeView === 'grade' && quizDetails && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
            <div>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)] inline-flex items-center gap-1 mb-1 font-semibold"
              >
                <Ikon nom="chap" olcham={14} />
                Orqaga qaytish
              </button>
              <h2 className="text-xl font-bold text-[var(--v3-matn)]">
                {quizDetails.title} — Talabalar topshiriqlari
              </h2>
            </div>

            <span className="text-xs font-mono text-[var(--v3-xira)]">
              Jami: {quizDetails.submissions?.length || 0} ta ish
            </span>
          </div>

          {quizDetails.submissions?.length === 0 ? (
            <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
              Bu testga hali hech qaysi talaba javob topshirmagan
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Talabalar ro'yxati (Sidebar) */}
              <div className="space-y-2 lg:col-span-1">
                <div className="v3-nishon mb-2">Topshirgan talabalar</div>
                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {quizDetails.submissions.map((sub) => {
                    const isSelected = selectedSubmission?.id === sub.id
                    const isGraded = sub.status === 'graded'

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => selectSubmissionToGrade(sub)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)]'
                            : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[var(--v3-matn)] truncate">
                            {sub.student.fullName || sub.student.username}
                          </div>
                          <div className="text-[10.5px] text-[var(--v3-xira)] font-mono">
                            {new Date(sub.submittedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                          isGraded
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {isGraded ? `${sub.score}/${sub.maxScore}` : 'Kutilmoqda'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tanlangan topshiriq va baholash formasi */}
              <div className="lg:col-span-2 space-y-4">
                {selectedSubmission ? (
                  <div className="v3-panel-karta p-6 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
                      <div>
                        <div className="text-sm font-bold text-[var(--v3-matn)]">
                          {selectedSubmission.student.fullName || selectedSubmission.student.username}
                        </div>
                        <div className="text-xs text-[var(--v3-xira)] font-mono">
                          @{selectedSubmission.student.username} • Topshirildi: {new Date(selectedSubmission.submittedAt).toLocaleString('uz-UZ')}
                        </div>
                      </div>

                      <span className={`v3-tag ${selectedSubmission.status === 'graded' ? 'v3-tag-ochiq' : 'v3-tag-yopiq'}`}>
                        {selectedSubmission.status === 'graded' ? 'Baholangan' : 'Kutilmoqda'}
                      </span>
                    </div>

                    {/* Savollar va Talaba Javoblari */}
                    <div className="space-y-4">
                      <div className="v3-nishon">Talabaning yozma javoblari</div>
                      {quizDetails.questions.map((q, idx) => {
                        // answers is JSON [{questionId, answer}]
                        const studentAnswer = Array.isArray(selectedSubmission.answers)
                          ? selectedSubmission.answers.find(a => a.questionId === q.id)?.answer || ''
                          : (selectedSubmission.answers?.[q.id] || '')

                        return (
                          <div key={q.id} className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-[var(--v3-urgu)]">
                                {idx + 1}-SAVOL ({q.maxPoints} ball)
                              </span>
                              {q.hint && <span className="text-[10px] text-[var(--v3-xira)] italic">Ko{"'"}rsatma: {q.hint}</span>}
                            </div>
                            <div className="text-xs font-semibold text-[var(--v3-matn)]">
                              {q.questionText}
                            </div>

                            <div className="pt-2 border-t border-[var(--v3-chiziq)]">
                              <div className="text-[10.5px] text-[var(--v3-xira)] mb-1">Talaba javobi:</div>
                              <div className="p-3 rounded-lg bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] whitespace-pre-wrap font-sans leading-relaxed">
                                {studentAnswer || <span className="italic opacity-50">Javob yozilmagan</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Ustoz Bahosi va Izohi */}
                    <div className="p-4 rounded-xl border border-[var(--v3-urgu)]/30 bg-[var(--v3-yuza-2)] space-y-3">
                      <div className="font-bold text-xs text-[var(--v3-matn)] uppercase tracking-wider">
                        Ustoz xulosasi va baholash
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="v3-yorliq">Qo{"'"}yiladigan ball (max {selectedSubmission.maxScore}) *</label>
                          <input
                            type="number"
                            min="0"
                            max={selectedSubmission.maxScore}
                            value={gradeData.score}
                            onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                            placeholder={`0 - ${selectedSubmission.maxScore}`}
                            className="v3-kiritish font-mono font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="v3-yorliq">Talaba uchun shaxsiy izoh / feedback</label>
                          <input
                            type="text"
                            value={gradeData.feedback}
                            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                            placeholder="Xatolar yoki qoniqarli javoblar haqida izoh..."
                            className="v3-kiritish text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleGradeSubmit}
                          disabled={isGrading}
                          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold"
                        >
                          {isGrading ? 'Saqlanmoqda...' : '✓ Bahoni tasdiqlash'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
                    Chapdagi ro{"'"}yxatdan tekshirish uchun talabani tanlang
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── VIEW 3: CREATE ─── */}
      {activeView === 'create' && (
        <div className="space-y-6">
          <div className="v3-panel-karta p-6 space-y-4">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
              1. Asosiy ma{"'"}lumotlar va muddat
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="v3-yorliq">Yozma test sarlavhasi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masalan: Koordinatsion birikmalar termodinamikasi bo'yicha nazorat ishi"
                  className="v3-kiritish font-semibold text-sm"
                />
              </div>

              <div>
                <label className="v3-yorliq">Biriktiriladigan guruh</label>
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  className="v3-kiritish"
                >
                  <option value="">Barcha o{"'"}z talabalarimga</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v3-yorliq">Topshirish muhlati (Deadline)</label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="v3-kiritish font-mono"
                />
              </div>

              <div>
                <label className="v3-yorliq">Vaqt chegarasi (daqiqalarda)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  className="v3-kiritish font-mono"
                />
              </div>

              <div>
                <label className="v3-yorliq">Ko{"'"}rsatmalar yoki eslatma</label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Javoblarni asoslab yozing..."
                  className="v3-kiritish text-xs"
                />
              </div>
            </div>
          </div>

          {/* Savollar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[var(--v3-matn)]">
                2. Yozma savollar ({formData.questions.length} ta)
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                <Ikon nom="qosh" olcham={14} />
                Savol qo{"'"}shish
              </button>
            </div>

            {formData.questions.map((q, idx) => (
              <div key={idx} className="v3-panel-karta p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--v3-urgu)]">
                    {idx + 1}-SAVOL
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--v3-xira)]">
                      <span>Max ball:</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={q.maxPoints}
                        onChange={(e) => updateQuestion(idx, 'maxPoints', parseInt(e.target.value) || 10)}
                        className="w-14 p-1 rounded bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center text-xs font-mono text-[var(--v3-matn)]"
                      />
                    </div>

                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-red-400 hover:bg-red-500/10"
                      >
                        <Ikon nom="ochir" olcham={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                    placeholder="Savol matnini yozing..."
                    rows={3}
                    className="v3-kiritish"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={q.hint || ''}
                    onChange={(e) => updateQuestion(idx, 'hint', e.target.value)}
                    placeholder="Ixtiyoriy yo'naltiruvchi maslahat yoki formula eslatmasi..."
                    className="v3-kiritish text-xs"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3.5 rounded-xl border border-dashed border-[var(--v3-chiziq-2)] hover:border-[var(--v3-urgu)] text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)] flex items-center justify-center gap-2 transition-colors bg-[var(--v3-yuza)]"
            >
              <Ikon nom="qosh" olcham={15} />
              Keyingi yozma savolni qo{"'"}shish
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--v3-chiziq)]">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="v3-tugma text-xs py-2.5 px-4"
              disabled={isCreating}
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold"
            >
              {isCreating ? 'Saqlanmoqda...' : '✓ Yozma testni e\'lon qilish'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
