// app/ustoz/yopiq-quiz/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function YopiqQuizPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [activeView, setActiveView] = useState('list') // list | create | grade
  const [quizzes, setQuizzes] = useState([])
  const [groups, setGroups] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, graded: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Create form
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    groupId: '',
    timeLimit: '',
    maxAttempts: 1,
    deadline: '',
    questions: [
      { questionText: '', maxPoints: 10, hint: '' }
    ]
  })
  
  // Grade view
  const [selectedQuiz, setSelectedQuiz] = useState(null)
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
        setQuizzes(data.quizzes)
        setGroups(data.groups)
        setStats(data.stats)
      }
    } catch (error) {
      toast.error('Yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const openGradeView = async (quizId) => {
    try {
      const res = await fetch(`/api/ustoz/yopiq-quiz?quizId=${quizId}`)
      const data = await res.json()
      if (res.ok) {
        setSelectedQuiz(data.quiz)
        setActiveView('grade')
      }
    } catch (error) {
      toast.error('Quiz yuklanmadi')
    }
  }

  const selectSubmissionForGrading = (submission) => {
    setSelectedSubmission(submission)
    setGradeData({
      score: submission.score || '',
      feedback: submission.feedback || ''
    })
  }

  const handleCreate = async (asDraft = false) => {
    if (!formData.title.trim()) {
      toast.error('Sarlavhani kiriting!')
      return
    }
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i]
      if (!q.questionText.trim()) {
        toast.error(`${i + 1}-savol matnini kiriting!`)
        return
      }
    }

    setIsCreating(true)
    try {
      const res = await fetch('/api/ustoz/yopiq-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isDraft: asDraft })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message, { icon: '🎉' })
      setActiveView('list')
      setFormData({
        title: '',
        description: '',
        instructions: '',
        groupId: '',
        timeLimit: '',
        maxAttempts: 1,
        deadline: '',
        questions: [{ questionText: '', maxPoints: 10, hint: '' }]
      })
      fetchQuizzes()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" quizni o'chirmoqchimisiz?`)) return
    try {
      const res = await fetch(`/api/ustoz/yopiq-quiz?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchQuizzes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleGrade = async () => {
    if (!selectedSubmission || !gradeData.score) {
      toast.error('Ballni kiriting!')
      return
    }

    setIsGrading(true)
    try {
      const res = await fetch('/api/ustoz/yopiq-quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score: parseInt(gradeData.score),
          feedback: gradeData.feedback,
          status: 'graded'
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message, { 
        icon: '✅',
        duration: 4000 
      })
      setSelectedSubmission(null)
      openGradeView(selectedQuiz.id) // Yangilash
      fetchQuizzes() // Statistika yangilash
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsGrading(false)
    }
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', maxPoints: 10, hint: '' }]
    })
  }

  const removeQuestion = (idx) => {
    if (formData.questions.length <= 1) {
      toast.error('Kamida 1 ta savol kerak')
      return
    }
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== idx)
    })
  }

  const updateQuestion = (idx, field, value) => {
    const updated = [...formData.questions]
    updated[idx] = { ...updated[idx], [field]: value }
    setFormData({ ...formData, questions: updated })
  }

  const totalPoints = formData.questions.reduce((sum, q) => sum + (parseInt(q.maxPoints) || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            ✍️ Variantsiz Quizlar
          </h1>
          <p className="text-purple-300 mt-1">
            Talabalar yozma javob yozadi, siz tekshirasiz
          </p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={() => setActiveView('create')}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            <span>Yangi variantsiz quiz</span>
          </button>
        )}
      </div>

      {/* Stats (faqat list view) */}
      {activeView === 'list' && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-xl p-4">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-purple-300">Jami quizlar</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-700/50 rounded-xl p-4">
            <div className="text-2xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
            <div className="text-xs text-orange-300">Tekshirish kerak</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-xl p-4">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-400">{stats.graded}</div>
            <div className="text-xs text-green-300">Tekshirilgan</div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════ */}
      {/* LIST VIEW */}
      {/* ════════════════════════════════════ */}
      {activeView === 'list' && (
        <>
          {isLoading ? (
            <div className="text-center py-12 text-purple-300">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p>Yuklanmoqda...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
              <div className="text-7xl mb-4">✍️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Hali variantsiz quizlar yo'q</h3>
              <p className="text-purple-300 mb-6">Birinchi variantsiz quizingizni yarating!</p>
              <button
                onClick={() => setActiveView('create')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
              >
                ➕ Birinchi quizni yaratish
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 rounded-2xl p-5 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="px-2 py-0.5 text-xs bg-orange-600/30 text-orange-300 border border-orange-600/40 rounded-full">
                          ✍️ Variantsiz
                        </span>
                        {quiz.group && (
                          <span className="px-2 py-0.5 text-xs bg-blue-600/30 text-blue-300 border border-blue-600/40 rounded-full">
                            📚 {quiz.group.name}
                          </span>
                        )}
                        {quiz.isDraft && (
                          <span className="px-2 py-0.5 text-xs bg-gray-600/30 text-gray-300 rounded-full">
                            💾 Qoralama
                          </span>
                        )}
                        {quiz.pendingCount > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-red-600/40 text-red-200 border border-red-600/50 rounded-full font-bold animate-pulse">
                            ⏳ {quiz.pendingCount} ta tekshirish kerak
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>

                      {quiz.description && (
                        <p className="text-sm text-purple-300 mb-3 line-clamp-2">{quiz.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-purple-400 flex-wrap">
                        <span>📝 {quiz._count.questions} savol</span>
                        <span>👥 {quiz._count.submissions} topshiriq</span>
                        <span>⭐ {quiz.maxScore} ball</span>
                        {quiz.timeLimit && <span>⏱️ {quiz.timeLimit} daq</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openGradeView(quiz.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                          quiz.pendingCount > 0
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
                            : 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                        }`}
                      >
                        <span>📋</span>
                        <span>Topshiriqlar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id, quiz.title)}
                        className="w-9 h-9 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 flex items-center justify-center text-red-400"
                        title="O'chirish"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════ */}
      {/* CREATE VIEW */}
      {/* ════════════════════════════════════ */}
      {activeView === 'create' && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveView('list')}
            className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200"
          >
            ← Ro'yxatga qaytish
          </button>

          {/* Asosiy */}
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📋</span> Asosiy ma'lumotlar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Quiz sarlavhasi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  placeholder="Masalan: [Cu(NH₃)₄]SO₄ ning IUPAC nomini yozing"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tavsif</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  rows="2"
                  placeholder="Quiz haqida qisqacha..."
                />
              </div>
              <div>
                <label className="text-sm text-purple-300 mb-1 block">
                  💡 Talaba uchun ko'rsatmalar
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  rows="3"
                  placeholder="Masalan: Javoblarni to'liq gap bilan yozing. IUPAC qoidalariga amal qiling..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Guruh</label>
                  <select
                    value={formData.groupId}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  >
                    <option value="">— Barcha guruhlar —</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Vaqt (daq)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Muddat</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Savollar */}
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>❓</span> Savollar ({formData.questions.length} ta • Jami: {totalPoints} ball)
              </h2>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-green-400"
              >
                + Savol qo'shish
              </button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, idx) => (
                <div key={idx} className="bg-purple-950/50 border border-purple-700/50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold text-black">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => removeQuestion(idx)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️ O'chirish
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-purple-400 mb-1 block">Savol matni *</label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-white outline-none"
                        rows="3"
                        placeholder="Masalan: [Co(NH₃)₆]Cl₃ ning IUPAC nomini yozing va markaziy atomning oksidlanish darajasini ko'rsating"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-purple-400 mb-1 block">Maksimal ball</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={q.maxPoints}
                          onChange={(e) => updateQuestion(idx, 'maxPoints', e.target.value)}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-400 mb-1 block">Yordam (ixtiyoriy)</label>
                        <input
                          type="text"
                          value={q.hint}
                          onChange={(e) => updateQuestion(idx, 'hint', e.target.value)}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-white outline-none"
                          placeholder="Kichik maslahat..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('list')}
              className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl text-purple-200"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => handleCreate(true)}
              disabled={isCreating}
              className="flex-1 py-3 bg-purple-900/60 rounded-xl font-semibold disabled:opacity-50"
            >
              💾 Qoralama
            </button>
            <button
              onClick={() => handleCreate(false)}
              disabled={isCreating}
              className="flex-[2] py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isCreating ? '⏳ Yaratilmoqda...' : '🚀 Quizni e\'lon qilish'}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════ */}
      {/* GRADE VIEW */}
      {/* ════════════════════════════════════ */}
      {activeView === 'grade' && selectedQuiz && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setActiveView('list'); setSelectedQuiz(null); setSelectedSubmission(null) }}
              className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200"
            >
              ← Ro'yxatga qaytish
            </button>
            <h2 className="text-xl font-bold text-white">{selectedQuiz.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chap: Topshiriqlar ro'yxati */}
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📋</span> Topshiriqlar ({selectedQuiz.submissions.length} ta)
              </h3>

              {selectedQuiz.submissions.length === 0 ? (
                <div className="text-center py-8 text-purple-400">
                  <div className="text-5xl mb-3">📭</div>
                  <p>Hali hech kim topshirmagan</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {selectedQuiz.submissions.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => selectSubmissionForGrading(sub)}
                      className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
                        selectedSubmission?.id === sub.id
                          ? 'bg-yellow-500/20 border-yellow-500'
                          : sub.status === 'graded'
                          ? 'bg-green-900/20 border-green-700/30 hover:border-green-600/50'
                          : 'bg-purple-950/30 border-purple-800/30 hover:border-orange-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black overflow-hidden">
                            {sub.student.avatar ? (
                              <img src={sub.student.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (sub.student.fullName?.charAt(0) || '?').toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {sub.student.fullName || sub.student.username}
                            </div>
                            <div className="text-xs text-purple-400">
                              {new Date(sub.submittedAt).toLocaleString('uz-UZ', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        {sub.status === 'graded' ? (
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-400">
                              {sub.score}/{sub.maxScore}
                            </div>
                            <div className="text-[10px] text-green-300">✓ Tekshirilgan</div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-orange-600/30 text-orange-300 rounded-full animate-pulse">
                            ⏳ Kutilmoqda
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* O'ng: Tekshirish paneli */}
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              {!selectedSubmission ? (
                <div className="text-center py-16 text-purple-400">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-lg font-bold mb-2">Topshiriqni tanlang</h3>
                  <p className="text-sm">Chap tomondagi ro'yxatdan tekshirmoqchi bo'lgan topshiriqni bosing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-purple-800/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold text-black overflow-hidden">
                      {selectedSubmission.student.avatar ? (
                        <img src={selectedSubmission.student.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (selectedSubmission.student.fullName?.charAt(0) || '?').toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {selectedSubmission.student.fullName || selectedSubmission.student.username}
                      </h3>
                      <p className="text-xs text-purple-400">
                        {new Date(selectedSubmission.submittedAt).toLocaleString('uz-UZ')}
                        {' • '}⏱️ {Math.floor(selectedSubmission.timeSpent / 60)}:{String(selectedSubmission.timeSpent % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  {/* Savollar va javoblar */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedQuiz.questions.map((q, idx) => {
                      const answer = selectedSubmission.answers?.find(a => a.questionId === q.id)
                      return (
                        <div key={q.id} className="bg-purple-950/50 border border-purple-800/30 rounded-xl p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium mb-1">{q.questionText}</p>
                              {q.hint && (
                                <p className="text-xs text-yellow-400/80 italic">💡 {q.hint}</p>
                              )}
                            </div>
                            <span className="text-xs text-purple-400">
                              {q.maxPoints} ball
                            </span>
                          </div>
                          <div className="ml-8 bg-purple-900/30 rounded-lg p-3">
                            <p className="text-xs text-purple-400 mb-1">Talabaning javobi:</p>
                            <p className="text-sm text-white whitespace-pre-wrap">
                              {answer?.answer || <span className="text-red-400 italic">Javob berilmagan</span>}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Baho berish */}
                  <div className="pt-4 border-t border-purple-800/50 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-purple-300 mb-1 block">
                          Ball (0 - {selectedQuiz.maxScore})
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={selectedQuiz.maxScore}
                          value={gradeData.score}
                          onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                          className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-lg font-bold outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-sm text-purple-300">
                          Foiz: <span className="text-yellow-400 font-bold">
                            {gradeData.score && selectedQuiz.maxScore 
                              ? ((parseInt(gradeData.score) / selectedQuiz.maxScore) * 100).toFixed(0)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-purple-300 mb-1 block">
                        💬 Izoh (ixtiyoriy — talabaga ko'rinadi)
                      </label>
                      <textarea
                        value={gradeData.feedback}
                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                        rows="3"
                        placeholder="Masalan: IUPAC nomini to'g'ri yozgansiz, lekin oksidlanish darajasini ko'rsatishni unutdingiz..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setGradeData({ score: Math.floor(selectedQuiz.maxScore * 0.6), feedback: '' })}
                        className="py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-xs text-purple-200"
                      >
                        60% qo'yish
                      </button>
                      <button
                        onClick={() => setGradeData({ score: selectedQuiz.maxScore, feedback: 'Ajoyib ish!' })}
                        className="py-2 bg-green-800/50 hover:bg-green-700/50 rounded-lg text-xs text-green-200"
                      >
                        Maksimal ball
                      </button>
                    </div>

                    <button
                      onClick={handleGrade}
                      disabled={isGrading || !gradeData.score}
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isGrading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span>Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <span>✅</span>
                          <span>Bahoni saqlash</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}