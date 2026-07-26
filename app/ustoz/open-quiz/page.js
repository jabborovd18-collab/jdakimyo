// app/ustoz/open-quiz/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Oson', color: 'green', icon: '🟢', timeMultiplier: 1.5 },
  { id: 'medium', name: "O'rta", color: 'yellow', icon: '🟡', timeMultiplier: 1.0 },
  { id: 'hard', name: 'Qiyin', color: 'orange', icon: '🟠', timeMultiplier: 0.8 },
  { id: 'expert', name: 'Ekspert', color: 'red', icon: '🔴', timeMultiplier: 0.6 }
]

const QUESTION_TYPES = [
  { id: 'single', name: 'Bitta javob', icon: '⭕' },
  { id: 'multiple', name: "Ko'p javob", icon: '☑️' },
  { id: 'truefalse', name: "To'g'ri/Noto'g'ri", icon: '✓✗' },
  { id: 'fill', name: "Bo'sh joy to'ldirish", icon: '___' }
]

export default function OpenQuizCreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const [formData, setFormData] = useState({
    // Asosiy
    title: '',
    description: '',
    groupId: '',
    category: 'general',

    // Sozlamalar
    timeLimit: 30,
    isPublic: false,
    accessCode: '',
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    showCorrectAnswers: true,
    allowReview: true,
    maxAttempts: 1,
    passingScore: 60,

    // Ilmiy
    difficulty: 'medium',
    tags: [],
    references: [],

    // Savollar
    questions: [
      {
        id: 1,
        type: 'single',
        text: '',
        options: ['', '', '', ''],
        correctAnswers: [0],
        explanation: '',
        points: 1,
        timePerQuestion: 60,
        hints: [],
        imageUrl: ''
      }
    ]
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/ustoz/guruh')
      const data = await res.json()
      if (res.ok) setGroups(data.groups || [])
    } catch (error) {
      console.error('Guruhlar yuklanmadi:', error)
    }
  }

  // ═══════════════════════════════════════════
  // SAVOL BOSHQARUV
  // ═══════════════════════════════════════════
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: Date.now(),
          type: 'single',
          text: '',
          options: ['', '', '', ''],
          correctAnswers: [0],
          explanation: '',
          points: 1,
          timePerQuestion: 60,
          hints: [],
          imageUrl: ''
        }
      ]
    })
  }

  const removeQuestion = (idx) => {
    if (formData.questions.length <= 1) {
      toast.error('Kamida 1 ta savol bo\'lishi kerak')
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

  const updateOption = (qIdx, optIdx, value) => {
    const updated = [...formData.questions]
    updated[qIdx].options[optIdx] = value
    setFormData({ ...formData, questions: updated })
  }

  const addOption = (qIdx) => {
    const updated = [...formData.questions]
    if (updated[qIdx].options.length >= 8) {
      toast.error('Maksimum 8 ta variant')
      return
    }
    updated[qIdx].options.push('')
    setFormData({ ...formData, questions: updated })
  }

  const removeOption = (qIdx, optIdx) => {
    const updated = [...formData.questions]
    if (updated[qIdx].options.length <= 2) {
      toast.error('Kamida 2 ta variant bo\'lishi kerak')
      return
    }
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx)
    updated[qIdx].correctAnswers = updated[qIdx].correctAnswers
      .filter(a => a !== optIdx)
      .map(a => a > optIdx ? a - 1 : a)
    if (updated[qIdx].correctAnswers.length === 0) {
      updated[qIdx].correctAnswers = [0]
    }
    setFormData({ ...formData, questions: updated })
  }

  const toggleCorrectAnswer = (qIdx, optIdx) => {
    const updated = [...formData.questions]
    const q = updated[qIdx]

    if (q.type === 'single' || q.type === 'truefalse') {
      q.correctAnswers = [optIdx]
    } else {
      if (q.correctAnswers.includes(optIdx)) {
        q.correctAnswers = q.correctAnswers.filter(a => a !== optIdx)
        if (q.correctAnswers.length === 0) q.correctAnswers = [0]
      } else {
        q.correctAnswers.push(optIdx)
      }
    }
    setFormData({ ...formData, questions: updated })
  }

  const addHint = (qIdx) => {
    const updated = [...formData.questions]
    updated[qIdx].hints.push({ text: '', penalty: 10 })
    setFormData({ ...formData, questions: updated })
  }

  const updateHint = (qIdx, hintIdx, field, value) => {
    const updated = [...formData.questions]
    updated[qIdx].hints[hintIdx][field] = value
    setFormData({ ...formData, questions: updated })
  }

  const removeHint = (qIdx, hintIdx) => {
    const updated = [...formData.questions]
    updated[qIdx].hints = updated[qIdx].hints.filter((_, i) => i !== hintIdx)
    setFormData({ ...formData, questions: updated })
  }

  const addTag = () => {
    const tag = prompt('Yangi teg kiriting:')
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const addReference = () => {
    setFormData({
      ...formData,
      references: [...formData.references, { title: '', url: '', authors: '' }]
    })
  }

  const updateReference = (idx, field, value) => {
    const updated = [...formData.references]
    updated[idx][field] = value
    setFormData({ ...formData, references: updated })
  }

  const removeReference = (idx) => {
    setFormData({
      ...formData,
      references: formData.references.filter((_, i) => i !== idx)
    })
  }

  // ═══════════════════════════════════════════
  // STATISTIKA
  // ═══════════════════════════════════════════
  const totalPoints = formData.questions.reduce((sum, q) => sum + (q.points || 0), 0)
  const estimatedTime = formData.questions.reduce((sum, q) => sum + (q.timePerQuestion || 60), 0)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === formData.difficulty)

  // ═══════════════════════════════════════════
  // VALIDATSIYA
  // ═══════════════════════════════════════════
  const validate = () => {
    if (!formData.title.trim()) {
      toast.error('Quiz sarlavhasini kiriting!')
      setActiveStep(1)
      return false
    }
    if (!formData.groupId && !formData.isPublic) {
      toast.error('Guruhni tanlang yoki ochiq qiling!')
      setActiveStep(1)
      return false
    }
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i]
      if (!q.text || !q.text.trim()) {
        toast.error(`${i + 1}-savol matnini kiriting!`)
        setActiveStep(2)
        return false
      }
      if (q.type !== 'fill') {
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j] || !q.options[j].trim()) {
            toast.error(`${i + 1}-savol ${j + 1}-variantini kiriting!`)
            setActiveStep(2)
            return false
          }
        }
        if (!q.correctAnswers || q.correctAnswers.length === 0) {
          toast.error(`${i + 1}-savolda to'g'ri javobni belgilang!`)
          setActiveStep(2)
          return false
        }
      }
    }
    return true
  }

  // ═══════════════════════════════════════════
  // SAQLASH
  // ═══════════════════════════════════════════
  const handleSave = async (asDraft = false) => {
    if (!asDraft && !validate()) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/ustoz/open-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isDraft: asDraft })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message, { duration: 4000, icon: '🎉' })
      setTimeout(() => router.push('/ustoz/open-quiz'), 1500)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // ═══════════════════════════════════════════
  // UI
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-purple-950/95 backdrop-blur-xl border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/ustoz/open-quiz"
                className="w-10 h-10 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center flex-shrink-0"
              >
                ←
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">
                  🎓 Ilmiy Quiz Yaratish
                </h1>
                <p className="text-xs text-purple-400 truncate">
                  Professional darajadagi test tizimi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="hidden sm:block px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-sm disabled:opacity-50"
              >
                💾 Qoralama
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="hidden sm:inline">Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span className="hidden sm:inline">E'lon qilish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PROGRESS STEPS */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { num: 1, label: 'Asosiy', icon: '📋' },
              { num: 2, label: 'Savollar', icon: '❓' },
              { num: 3, label: 'Sozlamalar', icon: '⚙️' },
              { num: 4, label: 'Xulosa', icon: '👁️' }
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeStep === step.num
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                      : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {idx < 3 && <div className="w-4 h-0.5 bg-purple-800/50 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══ STEP 1: ASOSIY ═══ */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📋</span> Asosiy ma'lumotlar
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    Quiz sarlavhasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none text-lg"
                    placeholder="Masalan: Koordinatsion birikmalar nazariyasi"
                    maxLength={150}
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">Tavsif</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
                    rows="3"
                    placeholder="Quiz haqida batafsil ma'lumot..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">Kategoriya</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      <option value="general">📘 Umumiy</option>
                      <option value="laboratory">🧪 Laboratoriya</option>
                      <option value="theory">📖 Nazariya</option>
                      <option value="practice">💪 Amaliyot</option>
                      <option value="exam">📝 Imtihon</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">Qiyinlik darajasi</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      {DIFFICULTY_LEVELS.map(d => (
                        <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    Qaysi guruhga? <span className="text-red-400">*</span>
                  </label>
                  {groups.length === 0 ? (
                    <div className="px-4 py-3 bg-red-950/30 border border-red-700/50 rounded-xl text-red-400">
                      ⚠️ Avval guruh yarating
                    </div>
                  ) : (
                    <select
                      value={formData.groupId}
                      onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      <option value="">— Tanlang —</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Teglar */}
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <span>🏷️</span> Teglar (kalit so'zlar)
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-800/50 rounded-full text-sm"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">×</button>
                  </span>
                ))}
                <button
                  onClick={addTag}
                  className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-full text-sm text-green-400"
                >
                  + Teg qo'shish
                </button>
              </div>
            </div>

            {/* Ilmiy manbalar */}
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>📚</span> Ilmiy manbalar (ixtiyoriy)
                </h3>
                <button
                  onClick={addReference}
                  className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400"
                >
                  + Manba qo'shish
                </button>
              </div>
              {formData.references.length === 0 ? (
                <p className="text-xs text-purple-400">
                  Hali manba qo'shilmagan. Kitob, maqola yoki ilmiy ish havolalarini qo'shing.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.references.map((ref, idx) => (
                    <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={ref.title}
                        onChange={(e) => updateReference(idx, 'title', e.target.value)}
                        placeholder="Manba nomi"
                        className="w-full px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                      <input
                        type="text"
                        value={ref.authors || ''}
                        onChange={(e) => updateReference(idx, 'authors', e.target.value)}
                        placeholder="Mualliflar"
                        className="w-full px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={ref.url || ''}
                          onChange={(e) => updateReference(idx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none font-mono"
                        />
                        <button
                          onClick={() => removeReference(idx)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-xl font-semibold"
              >
                Keyingi: Savollar →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: SAVOLLAR ═══ */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">❓ Savollar ({formData.questions.length} ta)</h2>
                <p className="text-sm text-purple-400">
                  Jami: {totalPoints} ball • Taxminiy vaqt: {Math.ceil(estimatedTime / 60)} daq
                </p>
              </div>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-xl text-green-400 font-semibold"
              >
                + Savol qo'shish
              </button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                        {qIdx + 1}
                      </span>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                        className="px-3 py-1 bg-purple-900/50 border border-purple-700/50 rounded-lg text-sm text-white outline-none"
                      >
                        {QUESTION_TYPES.map(t => (
                          <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeQuestion(qIdx)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️ O'chirish
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-purple-400 mb-1 block">Savol matni *</label>
                    <textarea
                      value={q.text}
                      onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      rows="2"
                      placeholder="Savolni kiriting..."
                    />
                  </div>

                  {q.type !== 'fill' && (
                    <div className="space-y-2 mb-4">
                      <label className="text-xs text-purple-400 block">
                        Variantlar (✓ = to'g'ri javob)
                      </label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCorrectAnswer(qIdx, optIdx)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                              q.correctAnswers.includes(optIdx)
                                ? 'bg-green-600 text-white'
                                : 'bg-purple-900/50 border border-purple-700/50 text-purple-400'
                            }`}
                          >
                            {q.correctAnswers.includes(optIdx) ? '✓' : String.fromCharCode(65 + optIdx)}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                            className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm outline-none"
                            placeholder={`Variant ${String.fromCharCode(65 + optIdx)}`}
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => removeOption(qIdx, optIdx)}
                              className="text-red-400 hover:text-red-300 text-xs px-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      {q.options.length < 8 && (
                        <button
                          onClick={() => addOption(qIdx)}
                          className="text-xs text-purple-400 hover:text-purple-300 ml-10"
                        >
                          + Variant qo'shish
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="text-xs text-purple-400 mb-1 block">
                      💡 Tushuntirish (ixtiyoriy)
                    </label>
                    <textarea
                      value={q.explanation || ''}
                      onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm outline-none"
                      rows="2"
                      placeholder="Nega bu javob to'g'ri?"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-purple-800/30">
                    <div>
                      <label className="text-[10px] text-purple-400 block">Ball</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={q.points}
                        onChange={(e) => updateQuestion(qIdx, 'points', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-purple-400 block">Vaqt (soniya)</label>
                      <input
                        type="number"
                        min="10"
                        max="600"
                        value={q.timePerQuestion}
                        onChange={(e) => updateQuestion(qIdx, 'timePerQuestion', parseInt(e.target.value) || 60)}
                        className="w-full px-2 py-1 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-purple-400 block">Yordam (hints)</label>
                      <div className="flex gap-1 flex-wrap">
                        {q.hints?.map((hint, hIdx) => (
                          <span key={hIdx} className="text-[10px] bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
                            #{hIdx + 1}
                          </span>
                        ))}
                        <button
                          onClick={() => addHint(qIdx)}
                          className="text-[10px] text-yellow-400 hover:text-yellow-300"
                        >
                          + Hint
                        </button>
                      </div>
                    </div>
                  </div>

                  {q.hints && q.hints.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {q.hints.map((hint, hIdx) => (
                        <div key={hIdx} className="flex gap-2 items-center bg-yellow-950/20 border border-yellow-800/30 rounded p-2">
                          <input
                            type="text"
                            value={hint.text}
                            onChange={(e) => updateHint(qIdx, hIdx, 'text', e.target.value)}
                            placeholder="Yordam matni"
                            className="flex-1 px-2 py-1 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                          />
                          <span className="text-xs text-yellow-400">-{hint.penalty}%</span>
                          <button
                            onClick={() => removeHint(qIdx, hIdx)}
                            className="text-red-400 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 bg-purple-800/50 rounded-xl"
              >
                ← Orqaga
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-xl font-semibold"
              >
                Keyingi: Sozlamalar →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: SOZLAMALAR ═══ */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">⏱️ Vaqt va urinishlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Umumiy vaqt limiti (daqiqa)</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Maksimal urinishlar</label>
                  <select
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  >
                    {[1, 2, 3, 5, 10, 99].map(n => (
                      <option key={n} value={n}>{n === 99 ? 'Cheksiz' : n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">🔒 Kirish sozlamalari</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <div className="text-sm font-semibold">🌐 Ochiq quiz (hamma ko'radi)</div>
                    <div className="text-xs text-purple-400">Barcha talabalar ko'ra oladi</div>
                  </div>
                </label>
                {formData.isPublic && (
                  <div className="ml-8">
                    <label className="text-xs text-purple-400 mb-1 block">
                      🔑 Maxfiy kod (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white outline-none font-mono"
                      placeholder="TEST2026"
                      maxLength={20}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">🎲 Tasodifiylik</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shuffleQuestions}
                    onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <div className="text-sm">🔀 Savollarni aralashtirish</div>
                    <div className="text-xs text-purple-400">Har talaba boshqa tartibda ko'radi</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shuffleOptions}
                    onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <div className="text-sm">🔀 Variantlarni aralashtirish</div>
                    <div className="text-xs text-purple-400">A/B/C/D har safar boshqa joyda</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">📊 Natija va baholash</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showResults}
                    onChange={(e) => setFormData({ ...formData, showResults: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <span className="text-sm">Natijani darhol ko'rsatish</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showCorrectAnswers}
                    onChange={(e) => setFormData({ ...formData, showCorrectAnswers: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <span className="text-sm">To'g'ri javoblarni ko'rsatish</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowReview}
                    onChange={(e) => setFormData({ ...formData, allowReview: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <span className="text-sm">Keyinroq ko'rib chiqishga ruxsat</span>
                </label>
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">O'tish bali (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 60 })}
                    className="w-32 px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-purple-800/50 rounded-xl"
              >
                ← Orqaga
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-xl font-semibold"
              >
                Xulosa →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: XULOSA ═══ */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👁️</span> Quiz xulosasi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Sarlavha</div>
                  <div className="font-semibold truncate">{formData.title || '—'}</div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Savollar</div>
                  <div className="font-semibold">{formData.questions.length} ta</div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Jami ball</div>
                  <div className="font-semibold text-yellow-400">{totalPoints}</div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Vaqt</div>
                  <div className="font-semibold">{formData.timeLimit} daq</div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Qiyinlik</div>
                  <div className="font-semibold">{difficultyInfo?.icon} {difficultyInfo?.name}</div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Guruh</div>
                  <div className="font-semibold truncate">
                    {groups.find(g => g.id === formData.groupId)?.name || 'Ochiq'}
                  </div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Urinishlar</div>
                  <div className="font-semibold">
                    {formData.maxAttempts === 99 ? '∞' : formData.maxAttempts}
                  </div>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">O'tish bali</div>
                  <div className="font-semibold">{formData.passingScore}%</div>
                </div>
              </div>
              {formData.isPublic && formData.accessCode && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <div className="text-xs text-yellow-400">🔑 Maxfiy kod:</div>
                  <div className="text-lg font-mono font-bold text-yellow-300">{formData.accessCode}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveStep(3)}
                className="px-6 py-3 bg-purple-800/50 rounded-xl"
              >
                ← Orqaga
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex-1 py-3 bg-purple-900/60 rounded-xl font-semibold disabled:opacity-50"
              >
                💾 Qoralama
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex-[2] py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? '⏳ Saqlanmoqda...' : "🚀 Quizni e'lon qilish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}