// app/profil/sozlama/page.js
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import AvatarUpload from '@/components/AvatarUpload'
import {
  SHRIFTLAR, URGU_RANGLARI, ODDIY_INTERFEYS, keshlaVaQoll, tozala,
} from '@/lib/interfeys'

const SECTIONS = [
  { id: 'personal', label: 'Shaxsiy', icon: '👤', color: 'purple' },
  { id: 'academic', label: 'Akademik', icon: '🎓', color: 'blue' },
  { id: 'social', label: 'Ijtimoiy', icon: '📱', color: 'pink' },
  { id: 'notifications', label: 'Bildirishnomalar', icon: '🔔', color: 'yellow' },
  { id: 'interface', label: 'Interfeys', icon: '🎨', color: 'green' },
  { id: 'security', label: 'Xavfsizlik', icon: '🔒', color: 'red' },
  { id: 'learning', label: "O'rganish", icon: '🎯', color: 'orange' },
  { id: 'data', label: "Ma'lumotlar", icon: '💾', color: 'cyan' }
]

const LANGUAGES = [
  { id: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'en', name: 'English', flag: '🇬🇧' }
]

const TIMEZONES = [
  { id: 'Asia/Tashkent', name: 'Toshkent (UTC+5)' },
  { id: 'Asia/Samarkand', name: 'Samarqand (UTC+5)' },
  { id: 'Europe/Moscow', name: 'Moskva (UTC+3)' },
  { id: 'Europe/London', name: 'London (UTC+0)' },
  { id: 'America/New_York', name: 'Nyu-York (UTC-5)' }
]

const LEARNING_STYLES = [
  { id: 'visual', name: 'Vizual', icon: '👁️', desc: 'Rasmlar, diagrammalar, videolar orqali' },
  { id: 'audio', name: 'Audio', icon: '🎧', desc: "Leksiyalar, podkastlar orqali" },
  { id: 'reading', name: "O'qish", icon: '📖', desc: "Matnlar, kitoblar orqali" },
  { id: 'kinesthetic', name: 'Amaliy', icon: '🧪', desc: 'Laboratoriya, amaliyot orqali' }
]

export default function SozlamaPage() {
  const { data: session, update } = useSession()
  const [activeSection, setActiveSection] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  // Avatar alohida: u shaklga kirmaydi, chunki darhol yuklanadi va
  // "Saqlash" tugmasini kutmaydi
  const [avatar, setAvatar] = useState(null)

  const [formData, setFormData] = useState({
    // Shaxsiy
    fullName: '',
    bio: '',
    location: '',
    birthDate: '',
    
    // Akademik
    university: '',
    faculty: '',
    specialty: '',
    level: '',
    academicDegree: '',
    studentId: '',
    enrollmentYear: '',
    
    // Ijtimoiy
    telegram: '',
    instagram: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    googleScholar: '',
    orcid: '',
    
    // Bildirishnomalar
    notificationSettings: {
      email_new_assignment: true,
      email_quiz_result: true,
      email_friend_request: true,
      email_announcement: true,
      browser_enabled: true,
      daily_digest: false,
      weekly_report: true
    },
    
    // Interfeys — oddiy qiymatlar lib/interfeys.js da, chunki ularni
    // qo'llaydigan komponent ham o'sha ro'yxatga qaraydi
    interfaceSettings: { ...ODDIY_INTERFEYS },
    
    // O'rganish
    learningPreferences: {
      dailyGoal: 30,
      difficulty: 'auto',
      favoriteSubjects: [],
      learningStyle: 'visual'
    }
  })

  // Parol o'zgartirish uchun alohida state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profil')
      const data = await res.json()
      
      if (res.ok && data.user) {
        const u = data.user
        setAvatar(u.avatar || null)
        setFormData(prev => ({
          ...prev,
          fullName: u.fullName || '',
          bio: u.bio || '',
          location: u.location || '',
          birthDate: u.birthDate ? new Date(u.birthDate).toISOString().split('T')[0] : '',
          
          university: u.university || '',
          faculty: u.faculty || '',
          specialty: u.specialty || '',
          level: u.level || '',
          academicDegree: u.academicDegree || '',
          studentId: u.studentId || '',
          enrollmentYear: u.enrollmentYear || '',
          
          telegram: u.telegram || '',
          instagram: u.instagram || '',
          linkedin: u.linkedin || '',
          github: u.github || '',
          twitter: u.twitter || '',
          website: u.website || '',
          googleScholar: u.googleScholar || '',
          orcid: u.orcid || '',
          
          notificationSettings: u.notificationSettings || prev.notificationSettings,
          interfaceSettings: tozala(u.interfaceSettings),
          learningPreferences: u.learningPreferences || prev.learningPreferences
        }))
      }
    } catch (error) {
      toast.error('Profilni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateNested = (section, field, value) => {
    setFormData(prev => {
      const yangi = { ...prev, [section]: { ...prev[section], [field]: value } }

      // Interfeys sozlamasi DARHOL qo'llanadi — saqlashni kutmaydi.
      // Nega: shrift yoki rang tanlaganda natijani ko'rmasdan qaror qabul
      // qilib bo'lmaydi. "Saqlash" tugmasi faqat serverga yozadi.
      if (section === 'interfaceSettings') keshlaVaQoll(yangi.interfaceSettings)

      return yangi
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message, { icon: '✅', duration: 3000 })
      setHasChanges(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak!")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Parollar mos kelmadi!")
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success("✓ Parol muvaffaqiyatli o'zgartirildi", { icon: '🔐' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/profil/export')
      const data = await res.json()
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `profil_${data.user.username}_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("✓ Ma'lumotlar eksport qilindi", { icon: '📥' })
    } catch (error) {
      toast.error('Eksport qilishda xatolik')
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("⚠️ DIQQAT!\n\nProfilingiz butunlay o'chiriladi.\nBarcha ma'lumotlar, natijalar, yutuqlar yo'qoladi.\n\nBu amalni qaytarib bo'lmaydi!\n\nDavom etmoqchimisiz?")) {
      if (prompt("Tasdiqlash uchun 'OCHIRISH' so'zini kiriting:") === 'OCHIRISH') {
        toast.error("Bu funksiya hozircha faol emas. Admin bilan bog'laning.", { duration: 5000 })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-purple-300">Sozlamalar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Sozlamalar
          </h1>
          <p className="text-purple-300 mt-1">
            Profilingizni shaxsiylashtiring va boshqaring
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-yellow-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Saqlanmagan o'zgarishlar
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Saqlash</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Section Navigation */}
        <aside className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-3 lg:sticky lg:top-24">
            <nav className="space-y-1">
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? `bg-gradient-to-r from-${section.color}-500/20 to-${section.color}-600/20 text-${section.color}-300 border border-${section.color}-500/50`
                      : 'text-purple-300 hover:bg-purple-800/30'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="flex-1 text-left">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ═══════════════════════════════════ */}
          {/* SHAXSIY MA'LUMOTLAR */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'personal' && (
            <SectionCard icon="👤" title="Shaxsiy Ma'lumotlar" color="purple">
              <div className="space-y-4">
                {/* Avatar yuklash. Komponent ham, API ham bor edi, lekin
                    hech qayerga qo'yilmagan edi — ya'ni rasm almashtirish
                    yo'li umuman yo'q edi. */}
                <div className="flex justify-center pb-2">
                  <AvatarUpload
                    currentAvatar={avatar}
                    userName={formData.fullName || session?.user?.username}
                    onUploadSuccess={(url) => {
                      setAvatar(url)
                      // Sessiyadagi rasm ham yangilansin, aks holda
                      // sarlavhadagi eski avatar chiqib turadi
                      update?.({ avatar: url })
                    }}
                  />
                </div>

                <InputField
                  label="Ism-familiya"
                  value={formData.fullName}
                  onChange={(v) => updateField('fullName', v)}
                  placeholder="Akmal Jabborov"
                />
                
                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    O'zingiz haqida (Bio)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 transition-all"
                    rows="4"
                    maxLength={500}
                    placeholder="Kimyo sohasidagi qiziqishlaringiz, maqsadlaringiz haqida yozing..."
                  />
                  <div className="text-xs text-purple-400 mt-1 text-right">
                    {formData.bio.length}/500
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="📍 Joylashuv"
                    value={formData.location}
                    onChange={(v) => updateField('location', v)}
                    placeholder="Samarqand, O'zbekiston"
                  />
                  <InputField
                    label="🎂 Tug'ilgan sana"
                    type="date"
                    value={formData.birthDate}
                    onChange={(v) => updateField('birthDate', v)}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* AKADEMIK */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'academic' && (
            <SectionCard icon="🎓" title="Akademik Ma'lumotlar" color="blue">
              <div className="space-y-4">
                <InputField
                  label="🏛️ Universitet"
                  value={formData.university}
                  onChange={(v) => updateField('university', v)}
                  placeholder="Samarqand Davlat Universiteti"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="📚 Fakultet"
                    value={formData.faculty}
                    onChange={(v) => updateField('faculty', v)}
                    placeholder="Kimyo fakulteti"
                  />
                  <InputField
                    label="🔬 Mutaxassislik"
                    value={formData.specialty}
                    onChange={(v) => updateField('specialty', v)}
                    placeholder="Organik kimyo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">
                      Kurs / Bosqich
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      <option value="">Tanlang</option>
                      <option value="1">1-kurs</option>
                      <option value="2">2-kurs</option>
                      <option value="3">3-kurs</option>
                      <option value="4">4-kurs</option>
                      <option value="5">Magistratura 1</option>
                      <option value="6">Magistratura 2</option>
                      <option value="7">Doktorantura</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-1 block font-semibold">
                      🎖️ Ilmiy daraja
                    </label>
                    <select
                      value={formData.academicDegree}
                      onChange={(e) => updateField('academicDegree', e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                    >
                      <option value="">Yo'q</option>
                      <option value="bakalavr">Bakalavr</option>
                      <option value="magistr">Magistr</option>
                      <option value="phd">PhD</option>
                      <option value="dsc">DSc</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>

                  <InputField
                    label="📅 Qabul yili"
                    type="number"
                    value={formData.enrollmentYear}
                    onChange={(v) => updateField('enrollmentYear', v)}
                    placeholder="2023"
                  />
                </div>

                <InputField
                  label="🆔 Talaba ID raqami"
                  value={formData.studentId}
                  onChange={(v) => updateField('studentId', v)}
                  placeholder="STU-2023-1234"
                />
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* IJTIMOIY TARMOQLAR */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'social' && (
            <SectionCard icon="📱" title="Ijtimoiy Tarmoqlar" color="pink">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="✈️ Telegram"
                    value={formData.telegram}
                    onChange={(v) => updateField('telegram', v)}
                    placeholder="@username"
                    icon="✈️"
                  />
                  <InputField
                    label="📸 Instagram"
                    value={formData.instagram}
                    onChange={(v) => updateField('instagram', v)}
                    placeholder="@username"
                    icon="📸"
                  />
                  <InputField
                    label="💼 LinkedIn"
                    value={formData.linkedin}
                    onChange={(v) => updateField('linkedin', v)}
                    placeholder="https://linkedin.com/in/..."
                    icon="💼"
                  />
                  <InputField
                    label="🐙 GitHub"
                    value={formData.github}
                    onChange={(v) => updateField('github', v)}
                    placeholder="https://github.com/..."
                    icon="🐙"
                  />
                  <InputField
                    label="🐦 Twitter/X"
                    value={formData.twitter}
                    onChange={(v) => updateField('twitter', v)}
                    placeholder="@username"
                    icon="🐦"
                  />
                  <InputField
                    label="🌐 Shaxsiy veb-sayt"
                    value={formData.website}
                    onChange={(v) => updateField('website', v)}
                    placeholder="https://..."
                    icon="🌐"
                  />
                </div>

                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <span>🎓</span> Akademik tarmoqlar
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="📚 Google Scholar"
                      value={formData.googleScholar}
                      onChange={(v) => updateField('googleScholar', v)}
                      placeholder="https://scholar.google.com/..."
                    />
                    <InputField
                      label="🆔 ORCID"
                      value={formData.orcid}
                      onChange={(v) => updateField('orcid', v)}
                      placeholder="0000-0000-0000-0000"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* BILDIRISHNOMALAR */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'notifications' && (
            <SectionCard icon="🔔" title="Bildirishnomalar" color="yellow">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-yellow-300 mb-2">📧 Email bildirishnomalar</h4>
                <ToggleItem
                  label="Yangi vazifa tayinlanganda"
                  desc="Ustozingiz yangi vazifa berganda"
                  checked={formData.notificationSettings.email_new_assignment}
                  onChange={(v) => updateNested('notificationSettings', 'email_new_assignment', v)}
                />
                <ToggleItem
                  label="Quiz natijasi tekshirilganda"
                  desc="Variantsiz quiz natijangiz baholanganda"
                  checked={formData.notificationSettings.email_quiz_result}
                  onChange={(v) => updateNested('notificationSettings', 'email_quiz_result', v)}
                />
                <ToggleItem
                  label="Do'stlik so'rovi"
                  desc="Kimdir sizga do'stlik taklif qilganda"
                  checked={formData.notificationSettings.email_friend_request}
                  onChange={(v) => updateNested('notificationSettings', 'email_friend_request', v)}
                />
                <ToggleItem
                  label="Yangi e'lon"
                  desc="Ustoz yoki admin e'lon yuborganda"
                  checked={formData.notificationSettings.email_announcement}
                  onChange={(v) => updateNested('notificationSettings', 'email_announcement', v)}
                />

                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-yellow-300 mb-2">🔔 Brauzer bildirishnomalar</h4>
                  <ToggleItem
                    label="Brauzer push bildirishnomalari"
                    desc="Sayt ochiq bo'lmaganda ham xabar olish"
                    checked={formData.notificationSettings.browser_enabled}
                    onChange={(v) => updateNested('notificationSettings', 'browser_enabled', v)}
                  />
                </div>

                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-yellow-300 mb-2">📊 Hisobotlar</h4>
                  <ToggleItem
                    label="Kunlik hisobot"
                    desc="Har kuni kechqurun faoliyatingiz haqida"
                    checked={formData.notificationSettings.daily_digest}
                    onChange={(v) => updateNested('notificationSettings', 'daily_digest', v)}
                  />
                  <ToggleItem
                    label="Haftalik hisobot"
                    desc="Har dushanba kuni haftalik natijalar"
                    checked={formData.notificationSettings.weekly_report}
                    onChange={(v) => updateNested('notificationSettings', 'weekly_report', v)}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* INTERFEYS */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'interface' && (
            <SectionCard icon="🎨" title="Interfeys Sozlamalari" color="green">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🌍 Til
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => updateNested('interfaceSettings', 'language', lang.id)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.interfaceSettings.language === lang.id
                            ? 'bg-green-600/20 border-green-500 text-green-300'
                            : 'bg-purple-950/30 border-purple-800/50 text-purple-300 hover:border-purple-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-xs font-semibold">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    🕐 Vaqt zonasi
                  </label>
                  <select
                    value={formData.interfaceSettings.timezone}
                    onChange={(e) => updateNested('interfaceSettings', 'timezone', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.id} value={tz.id}>{tz.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    📅 Sana formati
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['DD.MM.YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => updateNested('interfaceSettings', 'dateFormat', fmt)}
                        className={`p-3 rounded-xl border-2 text-sm font-mono transition-all ${
                          formData.interfaceSettings.dateFormat === fmt
                            ? 'bg-green-600/20 border-green-500 text-green-300'
                            : 'bg-purple-950/30 border-purple-800/50 text-purple-300 hover:border-purple-600'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Ko'rinish: o'zgarish darhol qo'llanadi ─── */}
                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-yellow-300 mb-1">🖌️ Ko'rinish</h4>
                  <p className="text-[11px] text-purple-400 mb-3">
                    Quyidagilar butun saytga darhol qo'llanadi — natijani shu yerda
                    ko'rasiz, "Saqlash" esa tanlovingizni hisobingizga yozadi.
                  </p>

                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🔠 Shrift o'lchami
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {SHRIFTLAR.map(s => (
                      <button
                        key={s.id}
                        onClick={() => updateNested('interfaceSettings', 'shrift', s.id)}
                        className={`py-3 rounded-xl border-2 transition-all ${
                          formData.interfaceSettings.shrift === s.id
                            ? 'bg-green-600/20 border-green-500 text-green-300'
                            : 'bg-purple-950/30 border-purple-800/50 text-purple-300 hover:border-purple-600'
                        }`}
                      >
                        <div style={{ fontSize: s.px }} className="font-bold leading-none">Aa</div>
                        <div className="text-[10px] mt-1.5">{s.nom}</div>
                      </button>
                    ))}
                  </div>

                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🎨 Urg'u rangi
                  </label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {URGU_RANGLARI.map(u => (
                      <button
                        key={u.id}
                        onClick={() => updateNested('interfaceSettings', 'urgu', u.id)}
                        title={u.nom}
                        className={`w-11 h-11 rounded-xl border-2 transition-all ${
                          formData.interfaceSettings.urgu === u.id
                            ? 'border-white scale-110'
                            : 'border-purple-800/50 hover:border-purple-500'
                        }`}
                        style={{ background: u.rang }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-purple-500 mb-4">
                    Matn ajratish, fokus halqasi va aylantirish chizig'i shu rangda
                    bo'ladi. Sahifalarning asosiy ranglari o'zgarmaydi — ular har bir
                    bo'limning o'z bezagi.
                  </p>

                  <ToggleItem
                    label="Animatsiyalar"
                    desc="O'chirilsa o'tishlar va harakatlar to'xtaydi — sekin qurilmada sayt yengillashadi"
                    checked={formData.interfaceSettings.animatsiya}
                    onChange={(v) => updateNested('interfaceSettings', 'animatsiya', v)}
                  />
                  <ToggleItem
                    label="Yuqori kontrast"
                    desc="Xira ko'k matnlar yorug'roq bo'ladi — kichik ekranda va yorug' xonada o'qish osonlashadi"
                    checked={formData.interfaceSettings.kontrast}
                    onChange={(v) => updateNested('interfaceSettings', 'kontrast', v)}
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🌙 Mavzu
                  </label>
                  <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌙</span>
                      <div>
                        <div className="text-sm font-semibold text-white">Qorong'i — yagona mavzu</div>
                        <div className="text-[11px] text-purple-400 mt-0.5">
                          Sayt ranglari sahifalar ichida to'g'ridan-to'g'ri yozilgan,
                          shuning uchun yorug' mavzu hozircha yo'q. Uni qo'shish
                          alohida katta ish — va'da qilib qo'yilmasligi uchun shunday
                          yozib qo'yildi.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* XAVFSIZLIK */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'security' && (
            <SectionCard icon="🔒" title="Xavfsizlik" color="red">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <span>🔑</span> Parolni o'zgartirish
                  </h4>
                  <div className="space-y-3">
                    <InputField
                      label="Hozirgi parol"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(v) => setPasswordData(p => ({ ...p, currentPassword: v }))}
                      placeholder="••••••••"
                    />
                    <InputField
                      label="Yangi parol"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(v) => setPasswordData(p => ({ ...p, newPassword: v }))}
                      placeholder="Kamida 6 ta belgi"
                    />
                    <InputField
                      label="Yangi parolni tasdiqlang"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(v) => setPasswordData(p => ({ ...p, confirmPassword: v }))}
                      placeholder="••••••••"
                    />
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isChangingPassword ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span>O'zgartirilmoqda...</span>
                        </>
                      ) : (
                        <>
                          <span>🔐</span>
                          <span>Parolni yangilash</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <span>📱</span> Ikki bosqichli tasdiqlash (2FA)
                  </h4>
                  <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">2FA hozircha faol emas</div>
                      <div className="text-xs text-purple-400 mt-1">
                        Qo'shimcha xavfsizlik uchun tez orada qo'shiladi
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-purple-800/50 text-purple-300 rounded-lg text-sm cursor-not-allowed opacity-50">
                      Tez orada
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-800/50">
                  <h4 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <span>💻</span> Faol sessiyalar
                  </h4>
                  <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💻</span>
                        <div>
                          <div className="text-sm font-semibold text-white">Hozirgi qurilma</div>
                          <div className="text-xs text-purple-400">
                            {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                             navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Browser'} • 
                            {' '}{new Date().toLocaleString('uz-UZ')}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                        Faol
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* O'RGANISH */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'learning' && (
            <SectionCard icon="🎯" title="O'rganish Afzalliklari" color="orange">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🎯 Kunlik o'qish maqsadi: <span className="text-orange-400 font-bold">{formData.learningPreferences.dailyGoal} daqiqa</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="10"
                    value={formData.learningPreferences.dailyGoal}
                    onChange={(e) => updateNested('learningPreferences', 'dailyGoal', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-purple-400 mt-1">
                    <span>10 daq</span>
                    <span>1 soat</span>
                    <span>2 soat</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">
                    🧠 O'rganish uslubi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {LEARNING_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => updateNested('learningPreferences', 'learningStyle', style.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.learningPreferences.learningStyle === style.id
                            ? 'bg-orange-600/20 border-orange-500'
                            : 'bg-purple-950/30 border-purple-800/50 hover:border-orange-600/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{style.icon}</div>
                        <div className="text-sm font-bold text-white mb-1">{style.name}</div>
                        <div className="text-xs text-purple-400">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block font-semibold">
                    ⚡ Qiyinchilik darajasi
                  </label>
                  <select
                    value={formData.learningPreferences.difficulty}
                    onChange={(e) => updateNested('learningPreferences', 'difficulty', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
                  >
                    <option value="auto">🤖 Avtomatik (AI tavsiyasi)</option>
                    <option value="easy">🟢 Oson</option>
                    <option value="medium">🟡 O'rta</option>
                    <option value="hard">🟠 Qiyin</option>
                    <option value="expert">🔴 Ekspert</option>
                  </select>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ═══════════════════════════════════ */}
          {/* MA'LUMOTLAR */}
          {/* ═══════════════════════════════════ */}
          {activeSection === 'data' && (
            <SectionCard icon="💾" title="Ma'lumotlar va Maxfiylik" color="cyan">
              <div className="space-y-4">
                <div className="bg-cyan-950/30 border border-cyan-700/50 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📥</div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-white mb-1">
                        Ma'lumotlaringizni eksport qilish
                      </h4>
                      <p className="text-sm text-cyan-200 mb-3">
                        Barcha profil ma'lumotlaringiz, natijalar va yutuqlaringizni JSON formatida yuklab oling.
                      </p>
                      <button
                        onClick={handleExportData}
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg flex items-center gap-2"
                      >
                        <span>📥</span>
                        <span>JSON yuklab olish</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/20 border border-red-700/50 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⚠️</div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-red-300 mb-1">
                        Xavfli zona
                      </h4>
                      <p className="text-sm text-red-200/80 mb-3">
                        Profilingizni butunlay o'chirish. Bu amalni <strong>qaytarib bo'lmaydi</strong>.
                        Barcha ma'lumotlar, natijalar, yutuqlar va do'stlar yo'qoladi.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-5 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-300 font-semibold rounded-lg"
                      >
                        🗑️ Profilni o'chirish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-purple-200 mb-2 flex items-center gap-2">
                    <span>📊</span> Hisob statistikasi
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-yellow-400">
                        {session?.user?.level_points || 1}
                      </div>
                      <div className="text-xs text-purple-400">Daraja</div>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-yellow-400">
                        {session?.user?.totalPoints || 0}
                      </div>
                      <div className="text-xs text-purple-400">Ball</div>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">
                        {session?.user?.currentStreak || 0}
                      </div>
                      <div className="text-xs text-purple-400">Streak</div>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">
                        v2.7
                      </div>
                      <div className="text-xs text-purple-400">Versiya</div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// YORDAMCHI KOMPONENTLAR
// ═══════════════════════════════════════════

function SectionCard({ icon, title, color, children }) {
  return (
    <div className={`bg-slate-900/50 border border-${color}-800/50 rounded-2xl p-6`}>
      <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 text-${color}-300`}>
        <span className="text-2xl">{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', icon = null }) {
  return (
    <div>
      <label className="text-sm text-purple-300 mb-1 block font-semibold">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 transition-all"
        placeholder={placeholder}
      />
    </div>
  )
}

function ToggleItem({ label, desc, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-4 bg-purple-950/30 border border-purple-800/30 rounded-xl cursor-pointer hover:bg-purple-950/50 transition-all">
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-purple-400 mt-0.5">{desc}</div>
      </div>
      <div
        onClick={(e) => { e.preventDefault(); onChange(!checked) }}
        className={`w-12 h-6 rounded-full transition-all relative cursor-pointer flex-shrink-0 ${
          checked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-purple-900'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
          checked ? 'left-6' : 'left-0.5'
        }`}></div>
      </div>
    </label>
  )
}