"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Boshlang\'ich' },
  { id: 'medium', name: 'O\'rta' },
  { id: 'hard', name: 'Murakkab' },
  { id: 'expert', name: 'Olimpiada' }
]

export default function OpenQuizManagePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [quizzes, setQuizzes] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list') // 'list' | 'create'
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    groupId: '',
    isPublic: true,
    accessCode: '',
    timeLimit: 30,
    maxAttempts: 1,
    passingScore: 60,
    deadline: '',
    difficulty: 'medium',
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    questions: [
      {
        id: 1,
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1,
      }
    ]
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ustoz/open-quiz')
      const data = await res.json()
      if (res.ok) {
        setQuizzes(data.quizzes || [])
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'Yuklab bo\'lmadi')
      }
    } catch (err) {
      toast.error('Ma\'lumotlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      groupId: '',
      isPublic: true,
      accessCode: '',
      timeLimit: 30,
      maxAttempts: 1,
      passingScore: 60,
      deadline: '',
      difficulty: 'medium',
      shuffleQuestions: true,
      shuffleOptions: true,
      showResults: true,
      questions: [
        {
          id: 1,
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          points: 1,
        }
      ]
    })
  }

  // Savol qo'shish
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          points: 1,
        }
      ]
    }))
  }

  // Savolni o'chirish
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

  // Savol matnini yangilash
  const updateQuestionText = (idx, text) => {
    const next = [...formData.questions]
    next[idx].questionText = text
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Variant matnini yangilash
  const updateOptionText = (qIdx, optIdx, val) => {
    const next = [...formData.questions]
    const nextOpts = [...next[qIdx].options]
    nextOpts[optIdx] = val
    next[qIdx].options = nextOpts
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Variant qo'shish
  const addOption = (qIdx) => {
    if (formData.questions[qIdx].options.length >= 6) {
      toast.error('Ko\'pi bilan 6 ta variant bo\'lishi mumkin')
      return
    }
    const next = [...formData.questions]
    next[qIdx].options = [...next[qIdx].options, '']
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Variantni o'chirish
  const removeOption = (qIdx, optIdx) => {
    if (formData.questions[qIdx].options.length <= 2) {
      toast.error('Kamida 2 ta variant bo\'lishi kerak')
      return
    }
    const next = [...formData.questions]
    next[qIdx].options = next[qIdx].options.filter((_, i) => i !== optIdx)
    if (next[qIdx].correctAnswer >= next[qIdx].options.length) {
      next[qIdx].correctAnswer = 0
    }
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // To'g'ri javobni tanlash
  const setCorrectAnswer = (qIdx, optIdx) => {
    const next = [...formData.questions]
    next[qIdx].correctAnswer = optIdx
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Tushuntirish yoki ballni yangilash
  const updateQuestionMeta = (qIdx, key, val) => {
    const next = [...formData.questions]
    next[qIdx][key] = val
    setFormData(prev => ({ ...prev, questions: next }))
  }

  // Saqlash
  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Quiz sarlavhasini kiriting')
      return
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i]
      if (!q.questionText.trim()) {
        toast.error(`${i + 1}-savol matni bo'sh!`)
        return
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!String(q.options[j]).trim()) {
          toast.error(`${i + 1}-savolning ${j + 1}-varianti bo'sh!`)
          return
        }
      }
    }

    setIsSaving(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        groupId: formData.isPublic ? null : (formData.groupId || null),
        isPublic: formData.isPublic,
        accessCode: formData.accessCode,
        timeLimit: formData.timeLimit,
        maxAttempts: formData.maxAttempts,
        passingScore: formData.passingScore,
        deadline: formData.deadline || null,
        difficulty: formData.difficulty,
        shuffleQuestions: formData.shuffleQuestions,
        shuffleOptions: formData.shuffleOptions,
        showResults: formData.showResults,
        questions: formData.questions.map((q, idx) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order: idx,
        }))
      }

      const res = await fetch('/api/ustoz/open-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Saqlab bo\'lmadi')

      toast.success(data.message || 'Quiz muvaffaqiyatli yaratildi!')
      resetForm()
      setActiveTab('list')
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // O'chirish
  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" testini haqiqatan ham o'chirmoqchimisiz? Barcha talabalar urinishlari ham o'chiriladi.`)) return

    try {
      const res = await fetch(`/api/ustoz/open-quiz?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || 'Quiz o\'chirildi')
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const nusxaOlish = (quizId) => {
    const url = `${window.location.origin}/oquv/video-darsliklar/ustoz-quiz/${quizId}`
    navigator.clipboard.writeText(url)
    toast.success('Havola nusxalandi!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Testlar boshqaruvi</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Variantli Ustoz Testlari
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Barcha foydalanuvchilarga ochiq (Public) yoki faqat o{"'"}z guruhlaringiz uchun muddatli testlar tuzing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { resetForm(); setActiveTab('list') }}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeTab === 'list' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="quiz" olcham={15} />
            Mening testlarim ({quizzes.length})
          </button>
          <button
            type="button"
            onClick={() => { resetForm(); setActiveTab('create') }}
            className={`v3-tugma text-xs py-2 px-3.5 ${activeTab === 'create' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="qosh" olcham={15} />
            Yangi test tuzish
          </button>
        </div>
      </div>

      {/* ─── TAB 1: QUIZLAR RO'YXATI ─── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Testlar yuklanmoqda...</span>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="v3-panel-karta py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto mb-3 text-[var(--v3-urgu)]">
                <Ikon nom="quiz" olcham={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--v3-matn)]">Sizda hali testlar yo{"'"}q</h3>
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto mt-1 mb-5">
                Talabalaringiz bilimini sinash uchun birinchi variantli testingizni yarating.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2"
              >
                <Ikon nom="qosh" olcham={15} />
                Test yaratishni boshlash
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
                        {quiz.isPublic ? (
                          <span className="v3-tag v3-tag-ochiq">
                            <Ikon nom="ochiq" olcham={12} />
                            Ommaviy (Public)
                          </span>
                        ) : (
                          <span className="v3-tag v3-tag-yopiq">
                            <Ikon nom="qulf" olcham={12} />
                            Guruhli: {quiz.group?.name || 'O\'z talabalari'}
                          </span>
                        )}

                        {deadlineDate && (
                          <span className={`v3-tag ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'v3-tag-muhlat'}`}>
                            <Ikon nom="taqvim" olcham={12} />
                            {isExpired ? 'Muddati tugagan: ' : 'Muhlat: '}
                            {deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}

                        {quiz.timeLimit && (
                          <span className="text-[11px] font-mono text-[var(--v3-xira)] flex items-center gap-1">
                            <Ikon nom="vaqt" olcham={12} />
                            {quiz.timeLimit} daqiqa
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-[var(--v3-matn)] leading-snug">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-xs text-[var(--v3-xira)] line-clamp-1 mt-0.5">
                            {quiz.description.startsWith('{') ? (JSON.parse(quiz.description).originalDescription || '') : quiz.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[var(--v3-xira)] font-mono">
                        <span>Savollar: <strong>{quiz._count?.questions || 0} ta</strong></span>
                        <span>Urinishlar: <strong>{quiz._count?.attempts || 0} ta</strong></span>
                        {quiz.avgScore > 0 && (
                          <span>O{"'"}rtacha: <strong>{quiz.avgScore.toFixed(1)}%</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--v3-chiziq)]">
                      <Link
                        href={`/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`}
                        className="v3-tugma text-xs py-1.5 px-3"
                        title="Testni ko'rish va yechish"
                      >
                        <Ikon nom="ong" olcham={14} />
                        Yechish
                      </Link>

                      <button
                        type="button"
                        onClick={() => nusxaOlish(quiz.id)}
                        className="v3-tugma text-xs py-1.5 px-3"
                        title="Havolani nusxalash"
                      >
                        <Ikon nom="nusxa" olcham={14} />
                        Ulashish
                      </button>

                      <Link
                        href={`/ustoz/natijalar?groupId=${quiz.groupId || 'all'}`}
                        className="v3-tugma text-xs py-1.5 px-3"
                        title="Urinishlar natijalari"
                      >
                        <Ikon nom="orin" olcham={14} />
                        Natijalar
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(quiz.id, quiz.title)}
                        className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="O'chirish"
                        aria-label="O'chirish"
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

      {/* ─── TAB 2: YANGI TEST TUZISH ─── */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Asosiy Sozlamalar */}
          <div className="v3-panel-karta p-6 space-y-4">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
              1. Asosiy ma{"'"}lumotlar va kirish huquqi
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="v3-yorliq">Test nomi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masalan: Kompleks birikmalar nomenklaturasi va izomeriyasi"
                  className="v3-kiritish font-semibold text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="v3-yorliq">Tavsif yoki yo{"'"}riqnoma</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Test haqida qisqacha ma'lumot yoki talabalar uchun yo'riqnoma..."
                  rows={2}
                  className="v3-kiritish resize-none"
                />
              </div>

              {/* Kirish doirasi (Public vs Private) */}
              <div>
                <label className="v3-yorliq">Kirish doirasi (Qamrov) *</label>
                <select
                  value={formData.isPublic ? 'public' : 'private'}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'public' })}
                  className="v3-kiritish"
                >
                  <option value="public">🌍 Ommaviy (Barcha talabalar yechishi mumkin)</option>
                  <option value="private">🔒 Yopiq (Faqat mening talabalarim / guruh)</option>
                </select>
              </div>

              {/* Guruh tanlash (agar private bo'lsa) */}
              {!formData.isPublic && (
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
              )}

              {/* Muhlat (Deadline) */}
              <div>
                <label className="v3-yorliq">Topshirish muhlati (Deadline)</label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="v3-kiritish font-mono"
                />
                <span className="text-[11px] text-[var(--v3-xira)] mt-1 block">
                  Belgilangan vaqtdan keyin test yopiladi. Bo{"'"}sh qoldirilsa muddatsiz bo{"'"}ladi.
                </span>
              </div>

              {/* Vaqt chegarasi */}
              <div>
                <label className="v3-yorliq">Test vaqti (daqiqalarda)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  placeholder="30"
                  className="v3-kiritish font-mono"
                />
              </div>

              {/* Urinishlar soni */}
              <div>
                <label className="v3-yorliq">Maksimal urinishlar soni</label>
                <select
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value })}
                  className="v3-kiritish font-mono"
                >
                  <option value="1">1 marta</option>
                  <option value="2">2 marta</option>
                  <option value="3">3 marta</option>
                  <option value="99">Cheksiz</option>
                </select>
              </div>

              {/* O'tish bali */}
              <div>
                <label className="v3-yorliq">O{"'"}tish bali (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                  className="v3-kiritish font-mono"
                />
              </div>
            </div>
          </div>

          {/* Savollar Ro'yxati */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[var(--v3-matn)]">
                2. Test savollari va to{"'"}g{"'"}ri javoblar ({formData.questions.length} ta)
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

            {formData.questions.map((q, qIdx) => (
              <div
                key={q.id || qIdx}
                className="v3-panel-karta p-5 space-y-4 relative border-l-4 border-l-[var(--v3-urgu)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--v3-urgu)] uppercase">
                    {qIdx + 1}-SAVOL
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--v3-xira)]">
                      <span>Ball:</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={q.points || 1}
                        onChange={(e) => updateQuestionMeta(qIdx, 'points', parseInt(e.target.value) || 1)}
                        className="w-14 p-1 rounded bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-center text-xs font-mono text-[var(--v3-matn)]"
                      />
                    </div>

                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Savolni o'chirish"
                      >
                        <Ikon nom="ochir" olcham={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                    placeholder={`${qIdx + 1}-savol matnini kiriting...`}
                    rows={2}
                    className="v3-kiritish"
                  />
                </div>

                {/* Variantlar */}
                <div className="space-y-2 pt-2 border-t border-[var(--v3-chiziq)]">
                  <div className="text-[11px] font-semibold text-[var(--v3-xira)] uppercase tracking-wider">
                    Javob variantlari (To{"'"}g{"'"}ri javobni tanlang):
                  </div>

                  <div className="grid gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx
                      const harf = String.fromCharCode(65 + optIdx) // A, B, C, D...

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)]'
                              : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setCorrectAnswer(qIdx, optIdx)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                              isCorrect
                                ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                                : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                            }`}
                            title="To'g'ri javob sifatida belgilash"
                          >
                            {harf}
                          </button>

                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                            placeholder={`${harf} varianti matni...`}
                            className="flex-1 bg-transparent border-none text-xs text-[var(--v3-matn)] outline-none"
                          />

                          {isCorrect && (
                            <span className="text-[11px] font-bold text-[var(--v3-urgu)] shrink-0 px-2">
                              ✓ To{"'"}g{"'"}ri
                            </span>
                          )}

                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIdx, optIdx)}
                              className="text-[var(--v3-xira)] hover:text-red-400 p-1"
                              title="Variantni o'chirish"
                            >
                              <Ikon nom="yopish" olcham={12} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {q.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => addOption(qIdx)}
                      className="text-xs text-[var(--v3-urgu)] hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                    >
                      + Variant qo{"'"}shish
                    </button>
                  )}
                </div>

                {/* Tushuntirish */}
                <div className="pt-2 border-t border-[var(--v3-chiziq)]">
                  <label className="v3-yorliq">Tushuntirish / Izoh (ixtiyoriy)</label>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={(e) => updateQuestionMeta(qIdx, 'explanation', e.target.value)}
                    placeholder="Talaba testni yechib bo'lgach ko'rinadigan ilmiy izoh..."
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
              Keyingi savolni qo{"'"}shish
            </button>
          </div>

          {/* Saqlash tugmalari */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--v3-chiziq)]">
            <button
              type="button"
              onClick={() => { resetForm(); setActiveTab('list') }}
              className="v3-tugma text-xs py-2.5 px-4"
              disabled={isSaving}
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold"
            >
              {isSaving ? 'Saqlanmoqda...' : '✓ Testni e\'lon qilish'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
