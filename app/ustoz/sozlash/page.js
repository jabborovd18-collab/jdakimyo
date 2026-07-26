// app/ustoz/sozlama/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const THEME_COLORS = [
  { id: 'purple', name: 'Binafsha', gradient: 'from-purple-600 to-indigo-600', bg: 'bg-purple-500' },
  { id: 'blue', name: 'Ko\'k', gradient: 'from-blue-600 to-cyan-600', bg: 'bg-blue-500' },
  { id: 'green', name: 'Yashil', gradient: 'from-green-600 to-emerald-600', bg: 'bg-green-500' },
  { id: 'indigo', name: 'Indigo', gradient: 'from-indigo-600 to-blue-700', bg: 'bg-indigo-500' },
  { id: 'amber', name: 'Sariq', gradient: 'from-amber-600 to-orange-600', bg: 'bg-amber-500' },
  { id: 'rose', name: 'Pushti', gradient: 'from-rose-600 to-pink-600', bg: 'bg-rose-500' }
]

const ACADEMIC_TITLES = [
  'Akademik',
  'Professor',
  'Dotsent',
  'Katta o\'qituvchi',
  'O\'qituvchi',
  'Assistent',
  'Kimyo fanlari doktori (DSc)',
  'Kimyo fanlari nomzodi (PhD)',
  'Kafedra mudiri'
]

export default function UstozSozlamaPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [stats, setStats] = useState({ students: 0, groups: 0, quizzes: 0, assignments: 0 })

  const [formData, setFormData] = useState({
    // Asosiy
    displayName: '',
    title: '',
    bio: '',
    university: '',
    department: '',
    position: '',
    
    // Ilmiy
    experienceYears: '',
    specialties: [],
    education: [],
    publications: '',
    citations: '',
    hIndex: '',
    awards: [],
    researchAreas: [],
    currentProjects: [],
    courses: [],
    
    // Tarmoqlar
    website: '',
    googleScholar: '',
    researchGate: '',
    orcid: '',
    scopus: '',
    
    // Sozlamalar
    showEmail: false,
    showPhone: false,
    showStats: true,
    showCourses: true,
    showPublications: true,
    
    // Vizual
    themeColor: 'purple',
    coverImage: '',
    bannerQuote: '',
    
    isActive: true
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/ustoz-profil')
      const data = await res.json()
      if (res.ok) {
        setFormData({
          displayName: data.profile.displayName || '',
          title: data.profile.title || '',
          bio: data.profile.bio || '',
          university: data.profile.university || '',
          department: data.profile.department || '',
          position: data.profile.position || '',
          experienceYears: data.profile.experienceYears || '',
          specialties: data.profile.specialties || [],
          education: data.profile.education || [],
          publications: data.profile.publications || '',
          citations: data.profile.citations || '',
          hIndex: data.profile.hIndex || '',
          awards: data.profile.awards || [],
          researchAreas: data.profile.researchAreas || [],
          currentProjects: data.profile.currentProjects || [],
          courses: data.profile.courses || [],
          website: data.profile.website || '',
          googleScholar: data.profile.googleScholar || '',
          researchGate: data.profile.researchGate || '',
          orcid: data.profile.orcid || '',
          scopus: data.profile.scopus || '',
          showEmail: data.profile.showEmail || false,
          showPhone: data.profile.showPhone || false,
          showStats: data.profile.showStats ?? true,
          showCourses: data.profile.showCourses ?? true,
          showPublications: data.profile.showPublications ?? true,
          themeColor: data.profile.themeColor || 'purple',
          coverImage: data.profile.coverImage || '',
          bannerQuote: data.profile.bannerQuote || '',
          isActive: data.profile.isActive ?? true
        })
        setStats(data.stats || { students: 0, groups: 0, quizzes: 0, assignments: 0 })
      }
    } catch (error) {
      toast.error('Profilni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.displayName?.trim()) {
      toast.error('Ismni kiriting!')
      setActiveTab('basic')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/ustoz-profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message, { duration: 3000, icon: '🎓' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // ═══ HELPER FUNKSIYALAR ═══
  const addSpecialty = () => {
    const specialty = prompt('Mutaxassislikni kiriting (masalan: Koordinatsion kimyo):')
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialty] })
    }
  }

  const removeSpecialty = (idx) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((_, i) => i !== idx) })
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', university: '', year: '' }]
    })
  }

  const updateEducation = (idx, field, value) => {
    const updated = [...formData.education]
    updated[idx][field] = value
    setFormData({ ...formData, education: updated })
  }

  const removeEducation = (idx) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== idx) })
  }

  const addAward = () => {
    setFormData({
      ...formData,
      awards: [...formData.awards, { title: '', year: '', organization: '' }]
    })
  }

  const updateAward = (idx, field, value) => {
    const updated = [...formData.awards]
    updated[idx][field] = value
    setFormData({ ...formData, awards: updated })
  }

  const removeAward = (idx) => {
    setFormData({ ...formData, awards: formData.awards.filter((_, i) => i !== idx) })
  }

  const addResearchArea = () => {
    setFormData({
      ...formData,
      researchAreas: [...formData.researchAreas, { name: '', description: '' }]
    })
  }

  const updateResearchArea = (idx, field, value) => {
    const updated = [...formData.researchAreas]
    updated[idx][field] = value
    setFormData({ ...formData, researchAreas: updated })
  }

  const removeResearchArea = (idx) => {
    setFormData({ ...formData, researchAreas: formData.researchAreas.filter((_, i) => i !== idx) })
  }

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [...formData.courses, { name: '', semester: '', credits: '', description: '' }]
    })
  }

  const updateCourse = (idx, field, value) => {
    const updated = [...formData.courses]
    updated[idx][field] = value
    setFormData({ ...formData, courses: updated })
  }

  const removeCourse = (idx) => {
    setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== idx) })
  }

  const tabs = [
    { id: 'basic', label: '👤 Asosiy', icon: '👤' },
    { id: 'academic', label: '🎓 Ilmiy', icon: '🎓' },
    { id: 'research', label: '🔬 Tadqiqot', icon: '🔬' },
    { id: 'courses', label: '📚 Kurslar', icon: '📚' },
    { id: 'networks', label: '🌐 Tarmoqlar', icon: '🌐' },
    { id: 'visibility', label: '👁️ Ko\'rinish', icon: '👁️' },
    { id: 'design', label: '🎨 Dizayn', icon: '🎨' }
  ]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-7xl mb-4">⏳</div>
          <p className="text-purple-300">Profil yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-purple-950/95 backdrop-blur-xl border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/ustoz"
                className="w-10 h-10 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center flex-shrink-0"
              >
                ←
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate flex items-center gap-2">
                  <span>🎓</span>
                  <span>Ommaviy akademik profil</span>
                </h1>
                <p className="text-xs text-purple-400 truncate">
                  Talabalar va hamkasblar ko'radigan profil
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/ustoz-profil/${session?.user?.id}`}
                target="_blank"
                className="hidden sm:flex px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-sm items-center gap-2"
              >
                <span>👁️</span>
                <span>Ko'rish</span>
              </Link>
              <button
                onClick={handleSave}
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
                    <span>💾</span>
                    <span className="hidden sm:inline">Saqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg'
                    : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══ PREVIEW CARD (har doim ko'rinadi) ═══ */}
        <div className="mb-6 bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase flex items-center gap-2">
              <span>👁️</span> Ko'rinish (jonli preview)
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">👥</span>
                <span className="font-bold text-white">{stats.students}</span>
                <span className="text-purple-400">talaba</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">📝</span>
                <span className="font-bold text-white">{stats.quizzes}</span>
                <span className="text-purple-400">quiz</span>
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${THEME_COLORS.find(t => t.id === formData.themeColor)?.gradient || 'from-purple-600 to-indigo-600'} rounded-xl p-6 relative overflow-hidden`}>
            {formData.coverImage && (
              <img src={formData.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-white/30">
                  {session?.user?.avatar ? (
                    <img src={session.user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (formData.displayName?.charAt(0) || session?.user?.username?.charAt(0) || '?').toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {formData.displayName || session?.user?.fullName || session?.user?.username}
                  </h2>
                  {formData.title && (
                    <p className="text-white/90 text-sm mt-1">{formData.title}</p>
                  )}
                  {formData.position && formData.department && (
                    <p className="text-white/80 text-xs mt-1">
                      {formData.position} • {formData.department}
                    </p>
                  )}
                  {formData.university && (
                    <p className="text-white/70 text-xs mt-0.5">🏛️ {formData.university}</p>
                  )}
                </div>
              </div>
              {formData.bannerQuote && (
                <p className="mt-4 text-white/90 text-sm italic border-l-4 border-white/40 pl-3">
                  &ldquo;{formData.bannerQuote}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ TAB: ASOSIY ═══ */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👤</span> Asosiy ma'lumotlar
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    Ko'rsatiladigan ism <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none text-lg"
                    placeholder="Masalan: Prof. A. Karimov"
                  />
                  <p className="text-xs text-purple-400 mt-1">
                    Talabalar va hamkasblar ko'radigan ism
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">
                      Ilmiy unvon / lavozim
                    </label>
                    <select
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      <option value="">— Tanlang —</option>
                      {ACADEMIC_TITLES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">
                      Lavozim
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                      placeholder="Masalan: Kafedra mudiri"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    Universitet
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    placeholder="Masalan: Samarqand Davlat Universiteti"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    Kafedra / Bo'lim
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    placeholder="Masalan: Organik kimyo kafedrasi"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    📖 O'zingiz haqida
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    rows="4"
                    placeholder="Ilmiy qiziqishlaringiz, tajribangiz, missiyangiz haqida yozing..."
                    maxLength={1000}
                  />
                  <p className="text-xs text-purple-400 mt-1 text-right">
                    {formData.bio.length}/1000
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: ILMIY ═══ */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🎓</span> Ilmiy faoliyat
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">Tajriba (yil)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">Nashrlar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.publications}
                    onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">Iqtiboslar</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.citations}
                    onChange={(e) => setFormData({ ...formData, citations: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">h-index</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hIndex}
                    onChange={(e) => setFormData({ ...formData, hIndex: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              {/* Mutaxassisliklar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-purple-300 font-semibold">
                    🎯 Mutaxassisliklar
                  </label>
                  <button
                    onClick={addSpecialty}
                    className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-xs text-green-400"
                  >
                    + Qo'shish
                  </button>
                </div>
                {formData.specialties.length === 0 ? (
                  <p className="text-xs text-purple-400 italic">Hali mutaxassislik qo'shilmagan</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-800/50 border border-purple-600/50 rounded-full text-sm"
                      >
                        {s}
                        <button
                          onClick={() => removeSpecialty(idx)}
                          className="text-red-400 hover:text-red-300 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Ta'lim */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-purple-300 font-semibold">
                    🎓 Ta'lim
                  </label>
                  <button
                    onClick={addEducation}
                    className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400"
                  >
                    + Qo'shish
                  </button>
                </div>
                {formData.education.length === 0 ? (
                  <p className="text-xs text-purple-400 italic">Hali ta'lim qo'shilmagan</p>
                ) : (
                  <div className="space-y-3">
                    {formData.education.map((edu, idx) => (
                      <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                            placeholder="Daraja (PhD, MSc, BSc)"
                            className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                          />
                          <input
                            type="number"
                            value={edu.year}
                            onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                            placeholder="Yil"
                            className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.university}
                            onChange={(e) => updateEducation(idx, 'university', e.target.value)}
                            placeholder="Universitet"
                            className="flex-1 px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                          />
                          <button
                            onClick={() => removeEducation(idx)}
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
            </div>

            {/* Mukofotlar */}
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🏆</span> Mukofotlar va yutuqlar
                </h2>
                <button
                  onClick={addAward}
                  className="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/50 rounded-lg text-xs text-yellow-400"
                >
                  + Mukofot qo'shish
                </button>
              </div>
              {formData.awards.length === 0 ? (
                <p className="text-xs text-purple-400 italic">Hali mukofot qo'shilmagan</p>
              ) : (
                <div className="space-y-3">
                  {formData.awards.map((award, idx) => (
                    <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => updateAward(idx, 'title', e.target.value)}
                          placeholder="Mukofot nomi"
                          className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                        />
                        <input
                          type="number"
                          value={award.year}
                          onChange={(e) => updateAward(idx, 'year', e.target.value)}
                          placeholder="Yil"
                          className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={award.organization || ''}
                          onChange={(e) => updateAward(idx, 'organization', e.target.value)}
                          placeholder="Tashkilot"
                          className="flex-1 px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                        />
                        <button
                          onClick={() => removeAward(idx)}
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
          </div>
        )}

        {/* ═══ TAB: TADQIQOT ═══ */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🔬</span> Tadqiqot yo'nalishlari
                </h2>
                <button
                  onClick={addResearchArea}
                  className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded-lg text-xs text-cyan-400"
                >
                  + Yo'nalish qo'shish
                </button>
              </div>
              {formData.researchAreas.length === 0 ? (
                <p className="text-xs text-purple-400 italic">Hali tadqiqot yo'nalishi qo'shilmagan</p>
              ) : (
                <div className="space-y-3">
                  {formData.researchAreas.map((area, idx) => (
                    <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateResearchArea(idx, 'name', e.target.value)}
                        placeholder="Yo'nalish nomi (masalan: Koordinatsion kimyo)"
                        className="w-full px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <textarea
                          value={area.description || ''}
                          onChange={(e) => updateResearchArea(idx, 'description', e.target.value)}
                          placeholder="Qisqacha tavsif..."
                          rows="2"
                          className="flex-1 px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                        />
                        <button
                          onClick={() => removeResearchArea(idx)}
                          className="text-red-400 hover:text-red-300 px-2 self-start"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB: KURSLAR ═══ */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📚</span> Dars beradigan kurslar
                </h2>
                <button
                  onClick={addCourse}
                  className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/50 rounded-lg text-xs text-indigo-400"
                >
                  + Kurs qo'shish
                </button>
              </div>
              {formData.courses.length === 0 ? (
                <p className="text-xs text-purple-400 italic">Hali kurs qo'shilmagan</p>
              ) : (
                <div className="space-y-3">
                  {formData.courses.map((course, idx) => (
                    <div key={idx} className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                        placeholder="Kurs nomi (masalan: Organik kimyo)"
                        className="w-full px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-sm outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={course.semester || ''}
                          onChange={(e) => updateCourse(idx, 'semester', e.target.value)}
                          placeholder="Semestr (masalan: 3-kurs, 5-semestr)"
                          className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={course.credits || ''}
                          onChange={(e) => updateCourse(idx, 'credits', e.target.value)}
                          placeholder="Kreditlar (masalan: 6)"
                          className="px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <textarea
                          value={course.description || ''}
                          onChange={(e) => updateCourse(idx, 'description', e.target.value)}
                          placeholder="Kurs haqida qisqacha..."
                          rows="2"
                          className="flex-1 px-3 py-1.5 bg-purple-900/50 border border-purple-700/50 rounded text-white text-xs outline-none"
                        />
                        <button
                          onClick={() => removeCourse(idx)}
                          className="text-red-400 hover:text-red-300 px-2 self-start"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB: TARMOQLAR ═══ */}
        {activeTab === 'networks' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🌐</span> Akademik tarmoqlar
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">🌍 Shaxsiy veb-sayt</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">📚 Google Scholar</label>
                  <input
                    type="url"
                    value={formData.googleScholar}
                    onChange={(e) => setFormData({ ...formData, googleScholar: e.target.value })}
                    placeholder="https://scholar.google.com/citations?user=..."
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">🔬 ResearchGate</label>
                  <input
                    type="url"
                    value={formData.researchGate}
                    onChange={(e) => setFormData({ ...formData, researchGate: e.target.value })}
                    placeholder="https://www.researchgate.net/profile/..."
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">🆔 ORCID</label>
                  <input
                    type="url"
                    value={formData.orcid}
                    onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                    placeholder="https://orcid.org/0000-0000-0000-0000"
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">📊 Scopus</label>
                  <input
                    type="url"
                    value={formData.scopus}
                    onChange={(e) => setFormData({ ...formData, scopus: e.target.value })}
                    placeholder="https://www.scopus.com/authid/..."
                    className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: KO'RINISH ═══ */}
        {activeTab === 'visibility' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👁️</span> Ko'rinish sozlamalari
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'showEmail', label: '📧 Email manzilini ko\'rsatish', desc: 'Talabalar emailingizni ko\'ra oladi' },
                  { key: 'showPhone', label: '📱 Telefon raqamini ko\'rsatish', desc: 'Telefon raqamingizni ochiq qilish' },
                  { key: 'showStats', label: '📊 Statistikalarni ko\'rsatish', desc: 'Talabalar, guruhlar, quizlar soni' },
                  { key: 'showCourses', label: '📚 Kurslarni ko\'rsatish', desc: 'Dars beradigan fanlaringiz' },
                  { key: 'showPublications', label: '📄 Nashrlarni ko\'rsatish', desc: 'Maqolalar va nashrlar soni' },
                  { key: 'isActive', label: '✅ Profilni faol qilish', desc: 'O\'chirilgan bo\'lsa, hech kim ko\'ra olmaydi' }
                ].map(item => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-purple-950/30 border border-purple-800/30 rounded-xl cursor-pointer hover:bg-purple-950/50 transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-purple-400 mt-0.5">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData[item.key]}
                      onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                      className="w-5 h-5 accent-purple-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: DIZAYN ═══ */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🎨</span> Profil dizayni
              </h2>

              {/* Rang tanlash */}
              <div className="mb-6">
                <label className="text-sm text-purple-300 mb-3 block font-semibold">
                  Asosiy rang
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {THEME_COLORS.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setFormData({ ...formData, themeColor: color.id })}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        formData.themeColor === color.id
                          ? 'border-white scale-105 shadow-xl'
                          : 'border-purple-800/30 hover:border-purple-600/50'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${color.gradient} mb-2`}></div>
                      <div className="text-xs text-center">{color.name}</div>
                      {formData.themeColor === color.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-green-600 text-sm">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qopqoq rasmi */}
              <div className="mb-6">
                <label className="text-sm text-purple-300 mb-1 block font-semibold">
                  🖼️ Qopqoq rasmi (URL)
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://... (ixtiyoriy)"
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                />
              </div>

              {/* Banner iqtibosi */}
              <div>
                <label className="text-sm text-purple-300 mb-1 block font-semibold">
                  💬 Banner iqtibosi
                </label>
                <textarea
                  value={formData.bannerQuote}
                  onChange={(e) => setFormData({ ...formData, bannerQuote: e.target.value })}
                  placeholder="Masalan: Kimyo - bu tabiatning eng go'zal sirlarini ochish kalitidir"
                  rows="2"
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="mt-8 flex gap-3 sticky bottom-4 z-20">
          <Link
            href={`/ustoz-profil/${session?.user?.id}`}
            target="_blank"
            className="flex-1 py-4 bg-purple-900/80 backdrop-blur-xl hover:bg-purple-800/80 rounded-xl font-semibold text-center border border-purple-700/50 flex items-center justify-center gap-2"
          >
            <span>👁️</span>
            <span>Ommaviy profilni ko'rish</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-xl shadow-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Barcha o'zgarishlarni saqlash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}