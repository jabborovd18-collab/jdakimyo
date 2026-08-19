// app/ustoz/new-vazifa/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

// ═══════════════════════════════════════════
// KONSTANTALAR
// ═══════════════════════════════════════════
const TASK_TYPES = [
  { 
    id: 'lab', 
    name: '🧪 Laboratoriya ishi', 
    color: 'green',
    tanlangan: 'border-green-500 bg-green-600/20',
    desc: 'Amaliy laboratoriya topshirig\'i',
    defaultScore: 100,
    icon: '🧪'
  },
  { 
    id: 'essay', 
    name: '📝 Esse / Referat', 
    color: 'blue',
    tanlangan: 'border-blue-500 bg-blue-600/20',
    desc: 'Yozma ish, referat, ma\'ruza',
    defaultScore: 100,
    icon: '📝'
  },
  { 
    id: 'quiz_open', 
    name: '❓ Variantli quiz', 
    color: 'purple',
    tanlangan: 'border-purple-500 bg-purple-600/20',
    desc: 'Variantli test (avtomatik tekshiriladi)',
    defaultScore: 100,
    icon: '❓'
  },
  { 
    id: 'quiz_closed', 
    name: '✍️ Variantsiz quiz', 
    color: 'orange',
    tanlangan: 'border-orange-500 bg-orange-600/20',
    desc: 'Yozma javobli test (qo\'lda tekshiriladi)',
    defaultScore: 100,
    icon: '✍️'
  },
  { 
    id: 'homework', 
    name: '📚 Uy vazifasi', 
    color: 'yellow',
    tanlangan: 'border-yellow-500 bg-yellow-600/20',
    desc: 'Mavzu bo\'yicha uy vazifasi',
    defaultScore: 50,
    icon: '📚'
  },
  { 
    id: 'project', 
    name: '🔬 Loyiha', 
    color: 'pink',
    tanlangan: 'border-pink-500 bg-pink-600/20',
    desc: 'Uzoq muddatli tadqiqot loyihasi',
    defaultScore: 200,
    icon: '🔬'
  }
]

const DEFAULT_HINTS = [
  { text: 'Avval mavzuni o\'qing', revealAfter: 0 },
  { text: 'Formulalarni eslang', revealAfter: 5 },
  { text: 'O\'xshash misolni ko\'ring', revealAfter: 10 }
]

export default function NewVazifaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [groups, setGroups] = useState([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  // Fayl yuklanayotganda saqlash tugmasi ham to'siladi: yuklanmagan
  // fayl bilan vazifani saqlash yarim natija berardi
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [isLoadingEdit, setIsLoadingEdit] = useState(!!editId)
  const [activeSection, setActiveSection] = useState('basic') // qaysi bo'lim ochiq

  // ═══════════════════════════════════════════
  // ASOSIY FORM DATA
  // ═══════════════════════════════════════════
  const [formData, setFormData] = useState({
    // Asosiy
    title: '',
    description: '',
    groupId: '',
    type: 'lab',
    
    // Muddat
    deadline: '',
    timeLimit: null,
    startDate: null,
    
    // Baholash
    maxScore: 100,
    passingScore: null,
    gradingCriteria: [],
    
    // Urinishlar
    maxAttempts: 1,
    allowLateSubmission: false,
    latePenalty: 10,
    
    // Mazmun
    instructions: '',
    attachments: [],
    hints: [],
    resources: [],
    
    // Sozlamalar
    isDraft: false,
    visibility: 'group',
    requireFile: false,
    allowedFileTypes: '',
    maxFileSize: 10
  })

  // ═══════════════════════════════════════════
  // INITIAL LOAD
  // ═══════════════════════════════════════════
  useEffect(() => {
    fetchGroups()
    
    // Default deadline: 7 kun keyin
    if (!editId) {
      const defaultDeadline = new Date()
      defaultDeadline.setDate(defaultDeadline.getDate() + 7)
      defaultDeadline.setHours(23, 59, 0, 0)
      setFormData(prev => ({ 
        ...prev, 
        deadline: defaultDeadline.toISOString().slice(0, 16) 
      }))
    }
  }, [])

  // Tahrirlash rejimi - mavjud vazifani yuklash
  useEffect(() => {
    if (editId) {
      fetchAssignment()
    }
  }, [editId])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/ustoz/guruh')
      const data = await res.json()
      if (res.ok) {
        setGroups(data.groups || [])
        if (data.groups?.length > 0 && !formData.groupId && !editId) {
          setFormData(prev => ({ ...prev, groupId: data.groups[0].id }))
        }
      }
    } catch (error) {
      toast.error('Guruhlarni yuklashda xatolik')
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const fetchAssignment = async () => {
    try {
      const res = await fetch(`/api/ustoz/new-vazifa?id=${editId}`)
      const data = await res.json()
      
      if (res.ok && data.assignment) {
        const a = data.assignment
        setFormData({
          title: a.title,
          description: a.description || '',
          groupId: a.groupId,
          type: a.type,
          deadline: new Date(a.deadline).toISOString().slice(0, 16),
          timeLimit: a.timeLimit,
          startDate: a.startDate ? new Date(a.startDate).toISOString().slice(0, 16) : null,
          maxScore: a.maxScore,
          passingScore: a.passingScore,
          gradingCriteria: a.gradingCriteria || [],
          maxAttempts: a.maxAttempts,
          allowLateSubmission: a.allowLateSubmission,
          latePenalty: a.latePenalty,
          instructions: a.instructions || '',
          attachments: a.attachments || [],
          hints: a.hints || [],
          resources: a.resources || [],
          isDraft: a.isDraft,
          visibility: a.visibility,
          requireFile: a.requireFile,
          allowedFileTypes: a.allowedFileTypes || '',
          maxFileSize: a.maxFileSize || 10
        })
      } else {
        toast.error('Vazifani yuklashda xatolik')
        router.push('/ustoz/vazifa')
      }
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoadingEdit(false)
    }
  }

  // ═══════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════
  const handleTypeChange = (typeId) => {
    const selectedType = TASK_TYPES.find(t => t.id === typeId)
    setFormData(prev => ({
      ...prev,
      type: typeId,
      maxScore: selectedType?.defaultScore || prev.maxScore
    }))
  }

  const addGradingCriterion = () => {
    setFormData(prev => ({
      ...prev,
      gradingCriteria: [...prev.gradingCriteria, { criterion: '', points: 10, description: '' }]
    }))
  }

  const updateGradingCriterion = (index, field, value) => {
    const updated = [...formData.gradingCriteria]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, gradingCriteria: updated }))
  }

  const removeGradingCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      gradingCriteria: prev.gradingCriteria.filter((_, i) => i !== index)
    }))
  }

  const addHint = () => {
    setFormData(prev => ({
      ...prev,
      hints: [...prev.hints, { text: '', revealAfter: 0 }]
    }))
  }

  const updateHint = (index, field, value) => {
    const updated = [...formData.hints]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, hints: updated }))
  }

  const removeHint = (index) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }))
  }

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '', description: '' }]
    }))
  }

  const updateResource = (index, field, value) => {
    const updated = [...formData.resources]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, resources: updated }))
  }

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  /**
   * Fayl biriktirish — Vercel Blob'ga HAQIQIY yuklash.
   *
   * Avval bu yerda `URL.createObjectURL(file)` chaqirilib, natija
   * bazaga yozilardi. Bunday `blob:` manzil faqat o'sha brauzer
   * oynasida yashaydi — talabalarda hech qachon ochilmasdi, ustoz esa
   * "fayl qo'shildi" degan yashil xabarni ko'rardi.
   *
   * Fayllar birma-bir yuklanadi: bittasi yiqilsa qolganlari saqlanib
   * qolsin va qaysi biri o'tmaganini aytish mumkin bo'lsin.
   */
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    if (files.length === 0) return

    setYuklanmoqda(true)
    let muvaffaq = 0

    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/ustoz/fayl', { method: 'POST', body: fd })
        const d = await res.json()
        if (!res.ok) throw new Error(d.error)

        setFormData((oldin) => ({
          ...oldin,
          attachments: [...oldin.attachments, d.fayl],
        }))
        muvaffaq++
      } catch (err) {
        toast.error(`"${file.name}": ${err.message}`)
      }
    }

    setYuklanmoqda(false)
    if (muvaffaq > 0) toast.success(`${muvaffaq} ta fayl yuklandi`)
  }

  /**
   * Biriktirilgan faylni olib tashlash.
   *
   * Ro'yxatdan chiqarish bilan birga Blob'dan ham o'chiramiz — aks
   * holda yuklangan, lekin hech qayerda ko'rinmaydigan fayllar
   * to'planib, joyni bekorga egallab yotardi.
   *
   * O'chirish yiqilsa ham ro'yxatdan chiqaramiz: ustoz uchun muhimi
   * fayl vazifada turmasligi, Blob'dagi qoldiq esa uning muammosi emas.
   */
  const removeAttachment = async (index) => {
    const fayl = formData.attachments[index]

    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))

    if (fayl?.url?.startsWith('http')) {
      fetch('/api/ustoz/fayl', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fayl.url }),
      }).catch(() => {})
    }
  }

  // ═══════════════════════════════════════════
  // SUBMIT
  // ═══════════════════════════════════════════
  const handleSubmit = async (saveAsDraft = false) => {
    // Validatsiya
    if (!formData.title.trim()) {
      toast.error('Sarlavhani kiriting!')
      setActiveSection('basic')
      return
    }
    if (!formData.groupId) {
      toast.error('Guruhni tanlang!')
      setActiveSection('basic')
      return
    }
    if (!formData.deadline) {
      toast.error('Muddatni belgilang!')
      setActiveSection('timing')
      return
    }

    const deadlineDate = new Date(formData.deadline)
    if (deadlineDate <= new Date() && !editId) {
      toast.error('Muddat kelajakda bo\'lishi kerak!')
      setActiveSection('timing')
      return
    }

    setIsSaving(true)
    try {
      const submitData = {
        ...formData,
        isDraft: saveAsDraft
      }

      const method = editId ? 'PUT' : 'POST'
      const url = editId ? '/api/ustoz/new-vazifa' : '/api/ustoz/new-vazifa'
      
      if (editId) submitData.id = editId

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message, { duration: 3000, icon: '🎉' })
      
      setTimeout(() => {
        router.push('/ustoz/vazifa')
      }, 1000)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // ═══════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════
  const getDeadlineInfo = () => {
    if (!formData.deadline) return null
    const diff = new Date(formData.deadline) - new Date()
    if (diff <= 0) return { text: 'Muddat o\'tgan!', color: 'text-red-400', icon: '❌' }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return { text: `${days} kun ${hours} soat qoldi`, color: 'text-green-400', icon: '✅' }
    return { text: `${hours} soat qoldi`, color: hours < 6 ? 'text-red-400' : 'text-yellow-400', icon: '⚠️' }
  }

  const deadlineInfo = getDeadlineInfo()
  const selectedType = TASK_TYPES.find(t => t.id === formData.type)
  const totalCriteriaPoints = formData.gradingCriteria.reduce((sum, c) => sum + (parseInt(c.points) || 0), 0)

  // Loading states
  if (isLoadingGroups || isLoadingEdit) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">{editId ? 'Vazifa yuklanmoqda...' : 'Sahifa tayyorlanmoqda...'}</span>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="space-y-6 max-w-7xl">
      {/* ═══ TITLE BAR ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Vazifalar boshqaruvi</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            {editId ? 'Vazifani tahrirlash' : 'Yangi Vazifa Yaratish'}
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            {selectedType?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSaving || yuklanmoqda}
            className="v3-tugma text-xs py-2 px-3.5"
          >
            Qoralama
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSaving || yuklanmoqda}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
          >
            {isSaving ? 'Saqlanmoqda...' : editId ? 'Yangilash' : '✓ E\'lon qilish'}
          </button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ═══════════════════════════════════════ */}
          {/* CHAP: NAVIGATSIYA (sidebar) */}
          {/* ═══════════════════════════════════════ */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-2">
              {[
                { id: 'basic', icon: '📋', label: 'Asosiy ma\'lumotlar', required: true },
                { id: 'type', icon: '🎯', label: 'Vazifa turi', required: true },
                { id: 'timing', icon: '⏰', label: 'Muddat va vaqt', required: true },
                { id: 'grading', icon: '⭐', label: 'Baholash' },
                { id: 'attempts', icon: '🔄', label: 'Urinishlar' },
                { id: 'content', icon: '📎', label: 'Mazmun va fayllar' },
                { id: 'hints', icon: '💡', label: 'Yordam va resurslar' },
                { id: 'settings', icon: '⚙️', label: 'Nashr sozlamalari' },
                { id: 'preview', icon: '👁️', label: 'Xulosa' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/60 border border-purple-800/30'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="flex-1 text-left">{section.label}</span>
                  {section.required && (
                    <span className="text-xs text-red-400">*</span>
                  )}
                </button>
              ))}

              {/* Progress indicator */}
              <div className="mt-6 p-4 bg-purple-900/40 border border-purple-800/30 rounded-xl">
                <div className="text-xs text-purple-400 mb-2">Tayyorlik</div>
                <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ 
                      width: `${
                        (formData.title ? 20 : 0) + 
                        (formData.groupId ? 20 : 0) + 
                        (formData.deadline ? 20 : 0) + 
                        (formData.type ? 20 : 0) + 
                        (formData.instructions ? 20 : 0)
                      }%` 
                    }}
                  />
                </div>
                <div className="text-xs text-purple-300 mt-2">
                  {formData.title && formData.groupId && formData.deadline 
                    ? '✅ E\'lon qilishga tayyor' 
                    : '⚠️ Majburiy maydonlarni to\'ldiring'}
                </div>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════════════════ */}
          {/* O'NG: ASOSIY KONTENT */}
          {/* ═══════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-6">

            {/* ═══ SECTION 1: ASOSIY ═══ */}
            {activeSection === 'basic' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl">
                    📋
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Asosiy ma'lumotlar</h2>
                    <p className="text-sm text-purple-300">Vazifa haqida asosiy axborot</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    Vazifa sarlavhasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all text-lg"
                    placeholder="Masalan: Kompleks birikmalarning sintezi"
                    maxLength={150}
                  />
                  <div className="text-xs text-purple-400 mt-1 text-right">
                    {formData.title.length}/150
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    Qisqacha tavsif
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                    rows="3"
                    placeholder="Vazifa haqida qisqacha ma'lumot..."
                    maxLength={500}
                  />
                  <div className="text-xs text-purple-400 mt-1 text-right">
                    {formData.description.length}/500
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    Qaysi guruhga? <span className="text-red-400">*</span>
                  </label>
                  {groups.length === 0 ? (
                    <div className="px-4 py-3 bg-red-950/30 border border-red-700/50 rounded-xl text-red-400 text-sm">
                      ⚠️ Avval guruh yarating!
                      <Link href="/ustoz/guruh" className="ml-2 text-yellow-400 underline">
                        Guruh yaratish →
                      </Link>
                    </div>
                  ) : (
                    <select
                      value={formData.groupId}
                      onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                    >
                      <option value="">Guruhni tanlang...</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g._count?.students || 0} talaba)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveSection('type')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Vazifa turi →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 2: VAZIFA TURI ═══ */}
            {activeSection === 'type' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl">
                    🎯
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Vazifa turi</h2>
                    <p className="text-sm text-purple-300">Qanday topshiriq turi?</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TASK_TYPES.map(taskType => (
                    <button
                      key={taskType.id}
                      type="button"
                      onClick={() => handleTypeChange(taskType.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.type === taskType.id
                          ? `${taskType.tanlangan} shadow-lg`
                          : 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{taskType.icon}</div>
                      <div className="font-bold text-sm mb-1">{taskType.name}</div>
                      <div className="text-xs text-purple-400">{taskType.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('basic')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('timing')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Muddat →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 3: MUDDAT VA VAQT ═══ */}
            {activeSection === 'timing' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl">
                    ⏰
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Muddat va vaqt</h2>
                    <p className="text-sm text-purple-300">Vazifa qachon tugaydi?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">
                      Topshirish muddati <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                    />
                    {deadlineInfo && (
                      <p className={`text-xs mt-1 ${deadlineInfo.color} flex items-center gap-1`}>
                        <span>{deadlineInfo.icon}</span>
                        <span>{deadlineInfo.text}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">
                      Boshlanish sanasi (ixtiyoriy)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value || null })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                    />
                    <p className="text-xs text-purple-400 mt-1">
                      Bo'sh qoldirilsa - darhol ko'rinadi
                    </p>
                  </div>
                </div>

                {/* Tez muddat tugmalari */}
                <div>
                  <span className="text-sm text-purple-300 font-semibold">⚡ Tez muddat:</span>
                  <div className="inline-flex gap-2 flex-wrap ml-2 mt-2">
                    {[
                      { label: '3 kun', days: 3 },
                      { label: '1 hafta', days: 7 },
                      { label: '2 hafta', days: 14 },
                      { label: '1 oy', days: 30 }
                    ].map(opt => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => {
                          const d = new Date()
                          d.setDate(d.getDate() + opt.days)
                          d.setHours(23, 59, 0, 0)
                          setFormData({ ...formData, deadline: d.toISOString().slice(0, 16) })
                        }}
                        className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/30 rounded-lg text-sm text-purple-200 transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vaqt limiti */}
                <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.timeLimit !== null}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        timeLimit: e.target.checked ? 60 : null 
                      })}
                      className="w-5 h-5 accent-purple-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">⏱️ Vaqt limiti qo'yish</div>
                      <div className="text-xs text-purple-400">Talaba belgilangan vaqtda topshirishi kerak</div>
                    </div>
                  </label>
                  
                  {formData.timeLimit !== null && (
                    <div className="ml-8 space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="1440"
                          value={formData.timeLimit}
                          onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 60 })}
                          className="w-24 px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-white outline-none"
                        />
                        <span className="text-sm text-purple-300">daqiqa</span>
                        <span className="text-xs text-purple-400">
                          ({Math.floor(formData.timeLimit / 60)} soat {formData.timeLimit % 60} daq)
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {[30, 60, 90, 120, 180].map(mins => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeLimit: mins })}
                            className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 rounded text-xs text-purple-200"
                          >
                            {mins} daq
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('type')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('grading')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Baholash →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 4: BAHOLASH ═══ */}
            {activeSection === 'grading' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xl">
                    ⭐
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Baholash mezonlari</h2>
                    <p className="text-sm text-purple-300">Talaba qanday baholanadi?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">
                      Maksimal ball
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all text-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">
                      O'tish bali (ixtiyoriy)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.maxScore}
                      value={formData.passingScore || ''}
                      onChange={(e) => setFormData({ ...formData, passingScore: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
                      placeholder="60"
                    />
                    <p className="text-xs text-purple-400 mt-1">
                      Shu balldan past bo'lsa - "topshirmadi" deb hisoblanadi
                    </p>
                  </div>
                </div>

                {/* Grading Criteria */}
                <div className="border-t border-purple-800/30 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">📊 Baholash mezonlari</h3>
                      <p className="text-xs text-purple-400">Har bir mezon uchun ball ajrating</p>
                    </div>
                    <button
                      type="button"
                      onClick={addGradingCriterion}
                      className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-sm text-green-400 transition-all"
                    >
                      + Mezon qo'shish
                    </button>
                  </div>

                  {formData.gradingCriteria.length === 0 ? (
                    <div className="text-center py-8 bg-purple-950/20 border border-dashed border-purple-700/30 rounded-xl">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm text-purple-400">
                        Hali baholash mezonlari qo'shilmagan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.gradingCriteria.map((crit, idx) => (
                        <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 flex gap-3 items-start">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={crit.criterion}
                              onChange={(e) => updateGradingCriterion(idx, 'criterion', e.target.value)}
                              placeholder="Masalan: To'g'ri formula"
                              className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                            />
                            <textarea
                              value={crit.description || ''}
                              onChange={(e) => updateGradingCriterion(idx, 'description', e.target.value)}
                              placeholder="Tavsif (ixtiyoriy)"
                              rows="2"
                              className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2 items-center">
                            <input
                              type="number"
                              min="0"
                              value={crit.points}
                              onChange={(e) => updateGradingCriterion(idx, 'points', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-300 text-center font-bold outline-none"
                            />
                            <span className="text-xs text-purple-400">ball</span>
                            <button
                              type="button"
                              onClick={() => removeGradingCriterion(idx)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-3 border-t border-purple-800/30">
                        <span className="text-sm text-purple-300">Jami mezonlar:</span>
                        <span className={`font-bold ${
                          totalCriteriaPoints === formData.maxScore 
                            ? 'text-green-400' 
                            : 'text-yellow-400'
                        }`}>
                          {totalCriteriaPoints} / {formData.maxScore} ball
                          {totalCriteriaPoints !== formData.maxScore && (
                            <span className="text-xs ml-2">
                              ({totalCriteriaPoints > formData.maxScore ? 'ortiqcha' : 'kam'})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('timing')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('attempts')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Urinishlar →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 5: URINISHLAR ═══ */}
            {activeSection === 'attempts' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                    🔄
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Urinishlar va kechikish</h2>
                    <p className="text-sm text-purple-300">Necha marta topshirish mumkin?</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    Maksimal urinishlar soni
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 5, 99].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, maxAttempts: num })}
                        className={`py-3 rounded-xl font-bold transition-all ${
                          formData.maxAttempts === num
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg'
                            : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/60 border border-purple-700/50'
                        }`}
                      >
                        {num === 99 ? '∞' : num}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-purple-400 mt-2">
                    {formData.maxAttempts === 1 && '🎯 Faqat bitta urinish - diqqatli bo\'lish kerak'}
                    {formData.maxAttempts === 2 && '✨ 2 marta urinish - xatolarni tuzatish imkoniyati'}
                    {formData.maxAttempts >= 3 && formData.maxAttempts < 99 && '🔄 Bir necha urinish'}
                    {formData.maxAttempts === 99 && '♾️ Cheksiz urinishlar'}
                  </p>
                </div>

                {/* Late submission */}
                <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.allowLateSubmission}
                      onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                      className="w-5 h-5 accent-purple-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">⏰ Kech topshirishga ruxsat</div>
                      <div className="text-xs text-purple-400">Muddatdan keyin ham topshirish mumkin (jarima bilan)</div>
                    </div>
                  </label>

                  {formData.allowLateSubmission && (
                    <div className="ml-8 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-purple-300">Har kun uchun jarima:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.latePenalty}
                          onChange={(e) => setFormData({ ...formData, latePenalty: parseFloat(e.target.value) || 10 })}
                          className="w-20 px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white outline-none text-center"
                        />
                        <span className="text-sm text-purple-300">%</span>
                      </div>
                      <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-700/30 rounded p-2">
                        💡 Masalan: 10% jarima bilan, 100 balldan 1 kun kechiksa 90 ball oladi
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('grading')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('content')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Mazmun →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 6: MAZMUN VA FAYLLAR ═══ */}
            {activeSection === 'content' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl">
                    📎
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Mazmun va fayllar</h2>
                    <p className="text-sm text-purple-300">Qo'shimcha materiallar</p>
                  </div>
                </div>

                {/* Batafsil ko'rsatmalar */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    📖 Batafsil ko'rsatmalar
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none transition-all font-mono text-sm"
                    rows="6"
                    placeholder={`Masalan:
1. Berilgan formulani tahlil qiling
2. Markaziy atomni aniqlang
3. Ligandlarni ro'yxatga oling
4. IUPAC nomini yozing
5. PDF formatida yuklang`}
                  />
                </div>

                {/* Fayllar */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    📎 Qo'shimcha fayllar
                  </label>
                  <div className="border-2 border-dashed border-purple-700/50 rounded-xl p-6 text-center hover:border-yellow-500/50 transition-all">
                    <input
                      type="file"
                      multiple
                      disabled={yuklanmoqda}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      // Serverdagi oq ro'yxat bilan bir xil: tanlash
                      // oynasida ham keraksiz fayllar ko'rinmasin
                      accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                    />
                    <label htmlFor="file-upload" className={yuklanmoqda ? 'cursor-wait' : 'cursor-pointer'}>
                      <div className="text-5xl mb-2">{yuklanmoqda ? '⏳' : '📁'}</div>
                      <div className="text-sm text-purple-300 mb-1">
                        {yuklanmoqda ? 'Yuklanmoqda...' : 'Fayllarni yuklash uchun bosing'}
                      </div>
                      <div className="text-xs text-purple-400">
                        PDF, Word, Excel, PowerPoint, rasm yoki ZIP (max 8 MB)
                      </div>
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-purple-950/30 border border-purple-800/30 rounded-lg p-3">
                          <div className="text-2xl">
                            {file.type?.includes('pdf') ? '📄' :
                             file.type?.includes('image') ? '🖼️' :
                             file.type?.includes('word') ? '📝' : '📁'}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Havola: ustoz yuklagan faylini shu yerdan
                                ochib, to'g'ri fayl ekanini tekshira olsin */}
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white truncate hover:text-yellow-400 block"
                            >
                              {file.name}
                            </a>
                            <div className="text-xs text-purple-400">{file.size} KB</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Talaba fayl yuklashi */}
                <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.requireFile}
                      onChange={(e) => setFormData({ ...formData, requireFile: e.target.checked })}
                      className="w-5 h-5 accent-purple-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">📤 Talaba fayl yuklashi shart</div>
                      <div className="text-xs text-purple-400">Javob fayl ko'rinishida bo'lishi kerak</div>
                    </div>
                  </label>

                  {formData.requireFile && (
                    <div className="ml-8 space-y-3">
                      <div>
                        <label className="text-xs text-purple-300 mb-1 block">Ruxsat etilgan formatlar</label>
                        <input
                          type="text"
                          value={formData.allowedFileTypes}
                          onChange={(e) => setFormData({ ...formData, allowedFileTypes: e.target.value })}
                          placeholder="pdf,docx,jpg,png"
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-300 mb-1 block">Maksimal fayl hajmi (MB)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.maxFileSize}
                          onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) || 10 })}
                          className="w-24 px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('attempts')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('hints')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Yordam →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 7: YORDAM VA RESURSLAR ═══ */}
            {activeSection === 'hints' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-xl">
                    💡
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Yordam va resurslar</h2>
                    <p className="text-sm text-purple-300">Talabaga qo'shimcha yordam</p>
                  </div>
                </div>

                {/* Yordam maslahatlari */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">💡 Yordam maslahatlari</h3>
                      <p className="text-xs text-purple-400">Talaba qiynalganda ko'rsatiladi</p>
                    </div>
                    <button
                      type="button"
                      onClick={addHint}
                      className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 rounded-lg text-sm text-amber-400"
                    >
                      + Maslahat
                    </button>
                  </div>

                  {formData.hints.length === 0 ? (
                    <div className="text-center py-6 bg-purple-950/20 border border-dashed border-purple-700/30 rounded-xl">
                      <div className="text-3xl mb-2">💡</div>
                      <p className="text-xs text-purple-400">Hali maslahat qo'shilmagan</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.hints.map((hint, idx) => (
                        <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 flex gap-3">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={hint.text}
                              onChange={(e) => updateHint(idx, 'text', e.target.value)}
                              placeholder="Maslahat matni"
                              className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-purple-400">Ko'rsatish:</span>
                              <input
                                type="number"
                                min="0"
                                value={hint.revealAfter}
                                onChange={(e) => updateHint(idx, 'revealAfter', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none text-center"
                              />
                              <span className="text-xs text-purple-400">daqiqadan keyin</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHint(idx)}
                            className="text-red-400 hover:text-red-300 self-start"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* O'rganish resurslari */}
                <div className="border-t border-purple-800/30 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">📚 O'rganish resurslari</h3>
                      <p className="text-xs text-purple-400">Foydali havolalar va materiallar</p>
                    </div>
                    <button
                      type="button"
                      onClick={addResource}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-sm text-blue-400"
                    >
                      + Resurs
                    </button>
                  </div>

                  {formData.resources.length === 0 ? (
                    <div className="text-center py-6 bg-purple-950/20 border border-dashed border-purple-700/30 rounded-xl">
                      <div className="text-3xl mb-2">📚</div>
                      <p className="text-xs text-purple-400">Hali resurs qo'shilmagan</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.resources.map((res, idx) => (
                        <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={res.title}
                              onChange={(e) => updateResource(idx, 'title', e.target.value)}
                              placeholder="Resurs nomi"
                              className="flex-1 px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeResource(idx)}
                              className="text-red-400 hover:text-red-300 px-2"
                            >
                              🗑️
                            </button>
                          </div>
                          <input
                            type="url"
                            value={res.url}
                            onChange={(e) => updateResource(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none font-mono"
                          />
                          <input
                            type="text"
                            value={res.description || ''}
                            onChange={(e) => updateResource(idx, 'description', e.target.value)}
                            placeholder="Tavsif (ixtiyoriy)"
                            className="w-full px-3 py-2 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('content')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Keyingi: Sozlamalar →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 8: SOZLAMALAR ═══ */}
            {activeSection === 'settings' && (
              <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center text-xl">
                    ⚙️
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nashr sozlamalari</h2>
                    <p className="text-sm text-purple-300">Vazifa qanday e'lon qilinadi?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isDraft}
                        onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                        className="w-5 h-5 accent-yellow-500"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">💾 Qoralama sifatida saqlash</div>
                        <div className="text-xs text-purple-400">Talabalar ko'rmaydi, keyinroq e'lon qilasiz</div>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">
                      Ko'rinish
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
                    >
                      <option value="group">👥 Faqat guruhga</option>
                      <option value="individual">👤 Alohida talabalarga</option>
                      <option value="all">🌐 Barcha guruhlarga</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveSection('hints')}
                    className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => setActiveSection('preview')}
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Xulosa →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECTION 9: XULOSA (PREVIEW) ═══ */}
            {activeSection === 'preview' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-2xl">
                      👁️
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Vazifa xulosasi</h2>
                      <p className="text-sm text-yellow-300">E'lon qilishdan oldin tekshiring</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Sarlavha</div>
                        <div className="text-white font-semibold">{formData.title || '—'}</div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Turi</div>
                        <div className="text-white font-semibold">{selectedType?.icon} {selectedType?.name || '—'}</div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Guruh</div>
                        <div className="text-white font-semibold">
                          {groups.find(g => g.id === formData.groupId)?.name || '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Muddat</div>
                        <div className="text-white font-semibold">
                          {formData.deadline 
                            ? new Date(formData.deadline).toLocaleString('uz-UZ', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })
                            : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Maksimal ball</div>
                        <div className="text-yellow-400 font-bold">{formData.maxScore} ball</div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Urinishlar</div>
                        <div className="text-white font-semibold">
                          {formData.maxAttempts === 99 ? 'Cheksiz' : `${formData.maxAttempts} marta`}
                        </div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Vaqt limiti</div>
                        <div className="text-white font-semibold">
                          {formData.timeLimit ? `${formData.timeLimit} daqiqa` : 'Cheksiz'}
                        </div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs mb-1">Kech topshirish</div>
                        <div className="text-white font-semibold">
                          {formData.allowLateSubmission 
                            ? `✅ Ha (-${formData.latePenalty}% kuniga)` 
                            : '❌ Yo\'q'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-800/30">
                      <div className="text-center p-2 bg-purple-950/30 rounded-lg">
                        <div className="text-2xl">📎</div>
                        <div className="text-xs text-purple-300">Fayllar</div>
                        <div className="text-sm font-bold text-white">{formData.attachments.length}</div>
                      </div>
                      <div className="text-center p-2 bg-purple-950/30 rounded-lg">
                        <div className="text-2xl">💡</div>
                        <div className="text-xs text-purple-300">Maslahatlar</div>
                        <div className="text-sm font-bold text-white">{formData.hints.length}</div>
                      </div>
                      <div className="text-center p-2 bg-purple-950/30 rounded-lg">
                        <div className="text-2xl">📊</div>
                        <div className="text-xs text-purple-300">Mezonlar</div>
                        <div className="text-sm font-bold text-white">{formData.gradingCriteria.length}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TUGMALAR */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl text-purple-200 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isSaving || yuklanmoqda}
                    className="flex-1 py-3 bg-purple-900/60 hover:bg-purple-800/70 rounded-xl text-purple-200 font-semibold transition-all border border-purple-700/50 disabled:opacity-50"
                  >
                    💾 Qoralama saqlash
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSaving || yuklanmoqda}
                    className="flex-[2] py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Saqlanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>{editId ? 'Yangilash va e\'lon qilish' : 'Vazifani e\'lon qilish'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}