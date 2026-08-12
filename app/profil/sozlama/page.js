"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import AvatarUpload from '@/components/AvatarUpload'
import PremiumTanlash from '@/components/PremiumTanlash'
import TelegramUlash from '@/components/TelegramUlash'
import Ikon from '@/components/Ikon'
import {
  SHRIFTLAR, URGU_RANGLARI, ODDIY_INTERFEYS, keshlaVaQoll, tozala,
} from '@/lib/interfeys'

const SECTIONS = [
  { id: 'personal', label: 'Shaxsiy', ikon: 'odam' },
  { id: 'academic', label: 'Akademik', ikon: 'kitob' },
  { id: 'social', label: 'Ijtimoiy', ikon: 'kanal' },
  { id: 'notifications', label: 'Bildirishnomalar', ikon: 'qongiroq' },
  { id: 'interface', label: 'Interfeys', ikon: 'palitra' },
  { id: 'security', label: 'Xavfsizlik', ikon: 'qalqon' },
  { id: 'learning', label: "O'rganish", ikon: 'quiz' },
  { id: 'data', label: "Ma'lumotlar", ikon: 'fayl' }
]

const LANGUAGES = [
  { id: 'uz', name: "O'zbekcha" },
  { id: 'ru', name: 'Русский' },
  { id: 'en', name: 'English' }
]

const LEARNING_STYLES = [
  { id: 'visual', name: 'Vizual', desc: 'Rasmlar, diagrammalar va videolar orqali' },
  { id: 'reading', name: "O'qish", desc: 'Matnlar, maqolalar va kitoblar orqali' },
  { id: 'kinesthetic', name: 'Amaliy', desc: 'Laboratoriya va test mashqlari orqali' }
]

export default function SozlamaPage() {
  const { data: session, update } = useSession()
  const [activeSection, setActiveSection] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [avatar, setAvatar] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    birthDate: '',
    university: '',
    faculty: '',
    specialty: '',
    level: '',
    academicDegree: '',
    studentId: '',
    enrollmentYear: '',
    telegram: '',
    instagram: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    googleScholar: '',
    orcid: '',
    notificationSettings: {
      email_new_assignment: true,
      email_quiz_result: true,
      email_friend_request: true,
      email_announcement: true,
      browser_enabled: true,
      daily_digest: false,
      weekly_report: true
    },
    interfaceSettings: ODDIY_INTERFEYS,
    learningPreferences: {
      dailyGoalMinutes: 30,
      dailyGoalQuestions: 20,
      learningStyle: 'visual',
      difficultyPreference: 'adaptive',
      language: 'uz'
    }
  })

  // Xavfsizlik bo'limi
  const [passwords, setPasswords] = useState({
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
        setAvatar(u.avatar)
        setFormData({
          fullName: u.fullName || '',
          bio: u.bio || '',
          location: u.location || '',
          birthDate: u.birthDate ? u.birthDate.split('T')[0] : '',
          university: u.university || '',
          faculty: u.faculty || '',
          specialty: u.specialty || '',
          level: u.level ? String(u.level) : '',
          academicDegree: u.academicDegree || '',
          studentId: u.studentId || '',
          enrollmentYear: u.enrollmentYear ? String(u.enrollmentYear) : '',
          telegram: u.telegram || '',
          instagram: u.instagram || '',
          linkedin: u.linkedin || '',
          github: u.github || '',
          twitter: u.twitter || '',
          website: u.website || '',
          googleScholar: u.googleScholar || '',
          orcid: u.orcid || '',
          notificationSettings: u.notificationSettings || formData.notificationSettings,
          interfaceSettings: u.interfaceSettings || ODDIY_INTERFEYS,
          learningPreferences: u.learningPreferences || formData.learningPreferences
        })
      }
    } catch (err) {
      toast.error('Profilni yuklab bo\'lmadi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
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
      if (!res.ok) throw new Error(data.error || 'Saqlab bo\'lmadi')

      toast.success(data.message || 'Sozlamalar saqlandi!')
      setHasChanges(false)
      if (update) update()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Parollarni to\'liq kiriting')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Yangi parol kamida 6 ta belgidan iborat bo\'lsin')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Yangi parollar mos kelmadi')
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Parolni o\'zgartirib bo\'lmadi')

      toast.success('Parol muvaffaqiyatli o\'zgartirildi!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/profil/export')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `JDA_KIMYO_Profil_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Ma\'lumotlar yuklab olindi')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Sozlamalar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Shaxsiy sozlamalar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="sozlama" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Kabinet Sozlamalari</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Profilingiz, akademik ma{"'"}lumotlaringiz, xavfsizlik va interfeysni boshqaring.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold self-start sm:self-auto disabled:opacity-40"
        >
          {isSaving ? 'Saqlanmoqda...' : '✓ Saqlash'}
        </button>
      </div>

      {/* Sections Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[var(--v3-chiziq)]">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                  : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]'
              }`}
            >
              <Ikon nom={sec.ikon} olcham={14} />
              <span>{sec.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─── 1. SHAXSIY BO'LIM ─── */}
      {activeSection === 'personal' && (
        <div className="space-y-6">
          <div className="v3-panel-karta p-6 space-y-5">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
              Avatar va Shaxsiy Ma{"'"}lumotlar
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <AvatarUpload
                currentAvatar={avatar}
                onAvatarChange={(newUrl) => {
                  setAvatar(newUrl)
                  if (update) update({ avatar: newUrl })
                }}
              />
              <div className="text-xs text-[var(--v3-xira)] space-y-1">
                <div className="font-bold text-[var(--v3-matn)]">Profil surati</div>
                <p>JPG, PNG yoki WEBP formatida yuklang (maksimal 2MB).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="v3-yorliq">To{"'"}liq ism-familiya</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Ali Valiyev"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">Yashash manzili / Shahar</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Toshkent, O'zbekiston"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">Tug{"'"}ilgan sana</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="v3-kiritish font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="v3-yorliq">O{"'"}zingiz haqingizda (Bio)</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Ilmiy qiziqishlaringiz, maqsadlaringiz va qisqacha ma'lumot..."
                  className="v3-kiritish resize-none"
                />
              </div>
            </div>
          </div>

          <PremiumTanlash />
        </div>
      )}

      {/* ─── 2. AKADEMIK BO'LIM ─── */}
      {activeSection === 'academic' && (
        <div className="v3-panel-karta p-6 space-y-4">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            O{"'"}quv yurti va Ilmiy Daraja
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="v3-yorliq">Universitet / Ta{"'"}lim muassasasi</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleChange('university', e.target.value)}
                placeholder="O'zMU, SamDU, va h.k."
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Fakultet</label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => handleChange('faculty', e.target.value)}
                placeholder="Kimyo fakulteti"
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Mutaxassislik</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => handleChange('specialty', e.target.value)}
                placeholder="Noorganik kimyo, Organik kimyo..."
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Kurs / Bosqich</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                placeholder="1 - 4"
                className="v3-kiritish font-mono"
              />
            </div>

            <div>
              <label className="v3-yorliq">Talabalik guvohnomasi (ID)</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                placeholder="ID raqami"
                className="v3-kiritish font-mono"
              />
            </div>

            <div>
              <label className="v3-yorliq">O{"'"}qishga kirgan yil</label>
              <input
                type="number"
                value={formData.enrollmentYear}
                onChange={(e) => handleChange('enrollmentYear', e.target.value)}
                placeholder="2023"
                className="v3-kiritish font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. IJTIMOIY BO'LIM ─── */}
      {activeSection === 'social' && (
        <div className="space-y-6">
          <div className="v3-panel-karta p-6 space-y-4">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
              Ijtimoiy va Akademik Tarmoqlar
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="v3-yorliq">Telegram username</label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value)}
                  placeholder="username"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">Instagram username</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="username"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="profil havolasi yoki username"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">GitHub</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="username"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">Google Scholar URL</label>
                <input
                  type="text"
                  value={formData.googleScholar}
                  onChange={(e) => handleChange('googleScholar', e.target.value)}
                  placeholder="https://scholar.google.com/..."
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">ORCID</label>
                <input
                  type="text"
                  value={formData.orcid}
                  onChange={(e) => handleChange('orcid', e.target.value)}
                  placeholder="0000-0002-1825-0097"
                  className="v3-kiritish font-mono"
                />
              </div>
            </div>
          </div>

          <div className="v3-panel-karta p-6">
            <TelegramUlash />
          </div>
        </div>
      )}

      {/* ─── 4. BILDIRISHNOMALAR ─── */}
      {activeSection === 'notifications' && (
        <div className="v3-panel-karta p-6 space-y-4">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Bildirishnoma Sozlamalari
          </div>

          <div className="space-y-3">
            {[
              { key: 'email_new_assignment', label: 'Yangi vazifa berilganda email xabarnoma' },
              { key: 'email_quiz_result', label: 'Test va quiz natijalari tekshirilganda' },
              { key: 'email_friend_request', label: 'Do\'stlik takliflari kelganda' },
              { key: 'email_announcement', label: 'Ustoz e\'lon yuborganida' },
              { key: 'weekly_report', label: 'Haftalik o\'quv hisoboti va taraqqiyot' },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] cursor-pointer">
                <span className="text-xs font-medium text-[var(--v3-matn)]">{item.label}</span>
                <input
                  type="checkbox"
                  checked={formData.notificationSettings?.[item.key] ?? true}
                  onChange={(e) => handleNestedChange('notificationSettings', item.key, e.target.checked)}
                  className="accent-[var(--v3-urgu)] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ─── 5. INTERFEYS ─── */}
      {activeSection === 'interface' && (
        <div className="v3-panel-karta p-6 space-y-5">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Interfeys va Tashqi Ko{"'"}rinish
          </div>

          <div>
            <label className="v3-yorliq">Asosiy urg{"'"}u rangi</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {URGU_RANGLARI.map(rang => (
                <button
                  key={rang.id}
                  type="button"
                  onClick={() => {
                    handleNestedChange('interfaceSettings', 'urgu', rang.id)
                    keshlaVaQoll({ ...formData.interfaceSettings, urgu: rang.id })
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    formData.interfaceSettings?.urgu === rang.id
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)]'
                      : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-black/20" style={{ background: rang.rang }} />
                  <span>{rang.nom}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. XAVFSIZLIK ─── */}
      {activeSection === 'security' && (
        <div className="v3-panel-karta p-6 space-y-4 max-w-lg">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Parolni Almashtirish
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="v3-yorliq">Hozirgi parol</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Yangi parol</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Yangi parolni tasdiqlang</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="v3-kiritish"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold"
            >
              {isChangingPassword ? 'Yangilanmoqda...' : '✓ Parolni yangilash'}
            </button>
          </form>
        </div>
      )}

      {/* ─── 7. O'RGANISH ─── */}
      {activeSection === 'learning' && (
        <div className="v3-panel-karta p-6 space-y-5">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Ta{"'"}lim Uslubi va Kunlik Maqsadlar
          </div>

          <div>
            <label className="v3-yorliq">O{"'"}rganish uslubi</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {LEARNING_STYLES.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleNestedChange('learningPreferences', 'learningStyle', style.id)}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                    formData.learningPreferences?.learningStyle === style.id
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm'
                      : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]'
                  }`}
                >
                  <div className="font-bold text-xs text-[var(--v3-matn)]">{style.name}</div>
                  <div className="text-[11px] text-[var(--v3-xira)] leading-relaxed">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="v3-yorliq">Kunlik o{"'"}rganish vaqti (daqiqada)</label>
              <input
                type="number"
                value={formData.learningPreferences?.dailyGoalMinutes || 30}
                onChange={(e) => handleNestedChange('learningPreferences', 'dailyGoalMinutes', parseInt(e.target.value) || 30)}
                className="v3-kiritish font-mono"
              />
            </div>

            <div>
              <label className="v3-yorliq">Kunlik test savollari maqsadi</label>
              <input
                type="number"
                value={formData.learningPreferences?.dailyGoalQuestions || 20}
                onChange={(e) => handleNestedChange('learningPreferences', 'dailyGoalQuestions', parseInt(e.target.value) || 20)}
                className="v3-kiritish font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. MA'LUMOTLAR ─── */}
      {activeSection === 'data' && (
        <div className="v3-panel-karta p-6 space-y-4 max-w-lg">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Shaxsiy Ma{"'"}lumotlarni Eksport Qilish
          </div>

          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            Platformada to{"'"}plagan natijalaringiz, testlaringiz va shaxsiy ma{"'"}lumotlaringiz nusxasini JSON formatida yuklab oling.
          </p>

          <button
            type="button"
            onClick={handleExportData}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-2"
          >
            <Ikon nom="fayl" olcham={15} />
            JSON faylini yuklab olish
          </button>
        </div>
      )}
    </div>
  )
}
