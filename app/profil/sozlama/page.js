"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AvatarUpload from '@/components/AvatarUpload'
import PremiumTanlash from '@/components/PremiumTanlash'
import TelegramUlash from '@/components/TelegramUlash'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import {
  SHRIFTLAR, URGU_RANGLARI, ODDIY_INTERFEYS, keshlaVaQoll, tozala,
} from '@/lib/interfeys'
import { ILMIY_DARAJA_TANLOVLARI } from '@/lib/profil-tahrir'
import { bildirishnomaTozala, oquvMaqsadTozala } from '@/lib/profil-tekshiruv'
import {
  keshdanProfilniOl,
  profilniYuklabOl,
  profilKeshUserYangila,
} from '@/lib/profil-kesh'

const SECTIONS = [
  { id: 'personal', label: 'Shaxsiy', ikon: 'odam' },
  { id: 'academic', label: 'Akademik', ikon: 'kitob' },
  { id: 'learning', label: "O'quv maqsadlari", ikon: 'chaqmoq' },
  { id: 'notifications', label: 'Bildirishnomalar', ikon: 'qongiroq' },
  { id: 'social', label: 'Ijtimoiy va Telegram', ikon: 'kanal' },
  { id: 'interface', label: 'Interfeys', ikon: 'palitra' },
  { id: 'security', label: 'Xavfsizlik', ikon: 'qalqon' },
  { id: 'data', label: "Ma'lumotlar", ikon: 'fayl' }
]

const BILDIRISHNOMA_QATORLARI = [
  { kalit: 'email_new_assignment', nom: 'Yangi vazifalar', izoh: 'Ustoz vazifa yuborganda pochta xabari' },
  { kalit: 'email_quiz_result', nom: 'Test va sinov natijalari', izoh: "Natijalar e'lon qilinganda xabarnoma" },
  { kalit: 'email_friend_request', nom: "Do'stlik takliflari", izoh: "Yangi do'st so'rovi kelganda" },
  { kalit: 'email_announcement', nom: "Platforma e'lonlari", izoh: 'Muhim yangilik va imtihon jadvali' },
  { kalit: 'browser_enabled', nom: 'Brauzer bildirishnomalari', izoh: 'Sayt ichidagi tezkor eslatmalar' },
  { kalit: 'daily_digest', nom: 'Kunlik eslatma', izoh: 'Kunlik o‘quv maqsadini eslatish' },
  { kalit: 'weekly_report', nom: 'Haftalik hisobot', izoh: 'Haftalik faollik va o‘sish qisqacha xulosasi' },
]

function userdanForma(u) {
  if (!u) {
    return {
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
      interfaceSettings: ODDIY_INTERFEYS,
      learningPreferences: oquvMaqsadTozala(null),
      notificationSettings: bildirishnomaTozala(null),
    }
  }
  return {
    fullName: u.fullName || '',
    bio: u.bio || '',
    location: u.location || '',
    birthDate: u.birthDate ? String(u.birthDate).split('T')[0] : '',
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
    interfaceSettings: tozala(u.interfaceSettings),
    learningPreferences: oquvMaqsadTozala(u.learningPreferences),
    notificationSettings: bildirishnomaTozala(u.notificationSettings),
  }
}

export default function SozlamaPage() {
  const { data: session, update } = useSession()
  const [activeSection, setActiveSection] = useState('personal')
  const [isLoading, setIsLoading] = useState(() => !keshdanProfilniOl(null)?.user)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [avatar, setAvatar] = useState(() => keshdanProfilniOl(null)?.user?.avatar || null)
  const [securityMeta, setSecurityMeta] = useState({ emailVerified: null, boglanganHisoblar: null })

  const [formData, setFormData] = useState(() =>
    userdanForma(keshdanProfilniOl(null)?.user)
  )

  // Xavfsizlik bo'limi
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // URL dan ?bolim=academic kabi parametrni o'qish
  useEffect(() => {
    if (typeof window === 'undefined') return
    const bolim = new URLSearchParams(window.location.search).get('bolim')
    if (bolim && SECTIONS.some((s) => s.id === bolim)) {
      setActiveSection(bolim)
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    const kesh = keshdanProfilniOl(session?.user)
    if (kesh?.user) {
      setAvatar((prev) => prev || kesh.user.avatar || null)
      setFormData((prev) => (hasChanges ? prev : userdanForma(kesh.user)))
      setIsLoading(false)
    }

    try {
      const data = await profilniYuklabOl({
        majburiy: true,
        sessionUser: session?.user,
      })
      if (data?.user) {
        const u = data.user
        setAvatar(u.avatar)
        setFormData((prev) => (hasChanges ? prev : userdanForma(u)))
        setSecurityMeta({
          emailVerified: u.emailVerified || null,
          boglanganHisoblar: data.boglanganHisoblar || null,
        })
      }
    } catch {
      if (!keshdanProfilniOl(session?.user)?.user) {
        toast.error("Profilni yuklab bo'lmadi")
      }
    } finally {
      setIsLoading(false)
    }
  }, [session?.user, hasChanges])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleInterfaceChange = (field, value) => {
    const next = tozala({ ...formData.interfaceSettings, [field]: value })
    handleChange('interfaceSettings', next)
    keshlaVaQoll(next)
  }

  const handleLearningChange = (field, value) => {
    const next = oquvMaqsadTozala({ ...formData.learningPreferences, [field]: value })
    handleChange('learningPreferences', next)
  }

  const handleNotificationToggle = (kalit, qiymat) => {
    const next = bildirishnomaTozala({ ...formData.notificationSettings, [kalit]: qiymat })
    handleChange('notificationSettings', next)
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

      profilKeshUserYangila(data.user || formData)
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
    if (passwords.newPassword.length < 8 || passwords.newPassword.length > 128) {
      toast.error("Yangi parol 8–128 ta belgidan iborat bo'lsin")
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

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link
            href="/profil/maxfiylik"
            className="v3-tugma text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
          >
            <Ikon nom="qalqon" olcham={14} />
            <span>Maxfiylik</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Ikon nom="tasdiq" olcham={14} />
            <span>{isSaving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
          </button>
        </div>
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

            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
              <AvatarUpload
                currentAvatar={avatar}
                userName={formData.fullName || session?.user?.username}
                onUploadSuccess={(newUrl) => {
                  setAvatar(newUrl)
                  profilKeshUserYangila({ avatar: newUrl })
                  if (update) update({ avatar: newUrl })
                }}
              />
              <div className="text-xs text-[var(--v3-xira)] space-y-1">
                <div className="font-bold text-[var(--v3-matn)]">Profil surati</div>
                <p>JPG, PNG, GIF yoki WEBP formatida yuklang (maksimal 5MB).</p>
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
                  min="1930-01-01"
                  max={new Date().toISOString().split('T')[0]}
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

          <div id="premium-bezak">
            <PremiumTanlash />
          </div>
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
                min={1980}
                max={new Date().getFullYear() + 1}
                value={formData.enrollmentYear}
                onChange={(e) => handleChange('enrollmentYear', e.target.value)}
                placeholder="2023"
                className="v3-kiritish font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="v3-yorliq">Akademik daraja / Bosqich</label>
              <input
                type="text"
                list="ilmiy-daraja-royxat"
                value={formData.academicDegree}
                onChange={(e) => handleChange('academicDegree', e.target.value)}
                placeholder="Bakalavr, Magistr, PhD yoki Abituriyent"
                className="v3-kiritish"
              />
              <datalist id="ilmiy-daraja-royxat">
                {ILMIY_DARAJA_TANLOVLARI.map((darajaNomi) => (
                  <option key={darajaNomi} value={darajaNomi} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2B. O'QUV MAQSADLARI ─── */}
      {activeSection === 'learning' && (
        <div className="v3-panel-karta p-5 sm:p-6 space-y-5 max-w-2xl">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)] flex items-center gap-2">
            <Ikon nom="chaqmoq" olcham={16} className="text-[var(--v3-urgu)]" />
            <span>Kunlik o{"'"}quv maqsadlari va reja</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="v3-yorliq">Kunlik savol maqsadi (5 – 500)</label>
              <input
                type="number"
                min={5}
                max={500}
                value={formData.learningPreferences?.dailyGoalQuestions ?? 20}
                onChange={(e) => handleLearningChange('dailyGoalQuestions', e.target.value)}
                className="v3-kiritish font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="v3-yorliq">Kunlik daqiqa maqsadi (5 – 720)</label>
              <input
                type="number"
                min={5}
                max={720}
                value={formData.learningPreferences?.dailyGoalMinutes ?? 30}
                onChange={(e) => handleLearningChange('dailyGoalMinutes', e.target.value)}
                className="v3-kiritish font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="v3-yorliq">Qiyinlik darajasi</label>
              <select
                value={formData.learningPreferences?.difficultyPreference || 'adaptive'}
                onChange={(e) => handleLearningChange('difficultyPreference', e.target.value)}
                className="v3-kiritish"
              >
                <option value="adaptive">Moslashuvchan (Adaptive)</option>
                <option value="easy">Boshlang{"'"}ich</option>
                <option value="medium">O{"'"}rta</option>
                <option value="hard">Yuqori / Olimpiada</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="v3-yorliq">O{"'"}qish uslubi</label>
              <select
                value={formData.learningPreferences?.learningStyle || 'visual'}
                onChange={(e) => handleLearningChange('learningStyle', e.target.value)}
                className="v3-kiritish"
              >
                <option value="visual">Vizual va laboratoriya</option>
                <option value="reading">Nazariya va matn</option>
                <option value="kinesthetic">Amaliy masalalar</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2C. BILDIRISHNOMALAR ─── */}
      {activeSection === 'notifications' && (
        <div className="v3-panel-karta p-5 sm:p-6 space-y-4 max-w-2xl">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)] flex items-center gap-2">
            <Ikon nom="qongiroq" olcham={16} className="text-[var(--v3-urgu)]" />
            <span>Bildirishnomalarni boshqarish</span>
          </div>

          <div className="space-y-2.5">
            {BILDIRISHNOMA_QATORLARI.map((item) => (
              <label
                key={item.kalit}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-[var(--v3-matn)]">{item.nom}</div>
                  <div className="text-[11px] text-[var(--v3-xira)]">{item.izoh}</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(formData.notificationSettings?.[item.kalit])}
                  onChange={(e) => handleNotificationToggle(item.kalit, e.target.checked)}
                  className="accent-[var(--v3-urgu)] w-4 h-4 shrink-0"
                />
              </label>
            ))}
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

              <div>
                <label className="v3-yorliq">X (Twitter) username</label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  placeholder="username"
                  className="v3-kiritish"
                />
              </div>

              <div>
                <label className="v3-yorliq">Shaxsiy sayt</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.uz"
                  className="v3-kiritish"
                />
              </div>
            </div>

            <TelegramUlash />
          </div>
        </div>
      )}

      {/* ─── 4. INTERFEYS ─── */}
      {activeSection === 'interface' && (
        <div className="v3-panel-karta p-5 sm:p-6 space-y-6">
          <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
            Interfeys va Tashqi Ko{"'"}rinish
          </div>

          <div>
            <label className="v3-yorliq">Shrift o{"'"}lchami</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {SHRIFTLAR.map((shrift) => (
                <button
                  key={shrift.id}
                  type="button"
                  onClick={() => handleInterfaceChange('shrift', shrift.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all ${
                    formData.interfaceSettings?.shrift === shrift.id
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] text-[var(--v3-matn)]'
                      : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                  }`}
                >
                  <span>{shrift.nom}</span>
                  <span className="font-mono text-[10.5px] opacity-75">{shrift.px}px</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="v3-yorliq">Asosiy urg{"'"}u rangi</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {URGU_RANGLARI.map((rang) => (
                <button
                  key={rang.id}
                  type="button"
                  onClick={() => handleInterfaceChange('urgu', rang.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    formData.interfaceSettings?.urgu === rang.id
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] text-[var(--v3-matn)]'
                      : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-black/20 shrink-0" style={{ background: rang.rang }} />
                  <span className="truncate">{rang.nom}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-[var(--v3-matn)]">Harakat va animatsiyalar</div>
                <div className="text-[11px] text-[var(--v3-xira)]">Yumshoq o{"'"}tishlar va aurora effektlarini yoqish</div>
              </div>
              <input
                type="checkbox"
                checked={formData.interfaceSettings?.animatsiya !== false}
                onChange={(e) => handleInterfaceChange('animatsiya', e.target.checked)}
                className="accent-[var(--v3-urgu)] w-4 h-4 shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-[var(--v3-matn)]">Yuqori kontrast</div>
                <div className="text-[11px] text-[var(--v3-xira)]">Xira yozuvlarni yanada aniqroq ko{"'"}rsatish</div>
              </div>
              <input
                type="checkbox"
                checked={formData.interfaceSettings?.kontrast === true}
                onChange={(e) => handleInterfaceChange('kontrast', e.target.checked)}
                className="accent-[var(--v3-urgu)] w-4 h-4 shrink-0"
              />
            </label>
          </div>
        </div>
      )}

      {/* ─── 6. XAVFSIZLIK ─── */}
      {activeSection === 'security' && (
        <div className="space-y-6 max-w-2xl">
          <div className="v3-panel-karta p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--v3-chiziq)]">
              <div className="font-bold text-sm text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="qalqon" olcham={16} className="text-[var(--v3-urgu)]" />
                <span>Xavfsizlik holati va bog{"'"}langan hisoblar</span>
              </div>
              <Link
                href="/profil/loglar?toifa=xavfsizlik"
                className="v3-tugma text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                <Ikon nom="royxat" olcham={13} />
                <span>Xavfsizlik loglari</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                <div className="text-[var(--v3-xira)]">Email tasdiq</div>
                <div className={`font-semibold ${securityMeta.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {securityMeta.emailVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                <div className="text-[var(--v3-xira)]">Telegram bot</div>
                {securityMeta.boglanganHisoblar?.telegram?.ulangan ? (
                  <div className="font-semibold text-emerald-400 truncate">
                    {securityMeta.boglanganHisoblar.telegram.username
                      ? `@${securityMeta.boglanganHisoblar.telegram.username}`
                      : 'Ulangan'}
                  </div>
                ) : (
                  <Link href="/profil/telegram" className="font-semibold text-[var(--v3-urgu)] hover:underline">
                    Ulash →
                  </Link>
                )}
              </div>
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                <div className="text-[var(--v3-xira)]">Kirish usullari</div>
                <div className="font-semibold text-[var(--v3-matn)] truncate">
                  {securityMeta.boglanganHisoblar?.providerlar?.length
                    ? ['Parol', ...securityMeta.boglanganHisoblar.providerlar].join(', ')
                    : 'Parol'}
                </div>
              </div>
            </div>

            {session?.user && ustozPaneliOchiqmi(session.user) && !session.user.doskaTugaydi && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
                    <Ikon nom="skaner" olcham={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--v3-matn)]">Elektron doska skaneri</div>
                    <div className="text-[11px] text-[var(--v3-xira)]">
                      QR orqali kirish va ulangan doskalarni boshqarish
                    </div>
                  </div>
                </div>
                <Link
                  href="/doska/skaner"
                  className="v3-tugma text-xs py-1.5 px-3 font-semibold shrink-0"
                >
                  <Ikon nom="kamera" olcham={14} />
                  <span>Skanerni ochish</span>
                </Link>
              </div>
            )}
          </div>

          <div className="v3-panel-karta p-5 sm:p-6 space-y-4">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)] flex items-center gap-2">
              <Ikon nom="tasdiq" olcham={16} className="text-[var(--v3-urgu)]" />
              <span>Tasdiqlangan Hisob va Imkoniyatlar</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-[var(--v3-matn)] truncate">
                  {session?.user?.fullName || session?.user?.username}
                </span>
                <TasdiqBelgisi tasdiqlangan={session?.user?.isVerified} olcham="orta" />
              </div>
              <span className={`v3-tag text-[11px] font-semibold ${session?.user?.isVerified ? 'v3-tag-ochiq' : 'v3-tag-yopiq'}`}>
                {session?.user?.isVerified ? 'Rasmiy tasdiqlangan' : 'Oddiy hisob'}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                <div className="font-bold text-[var(--v3-matn)]">Email tasdiqlash</div>
                <p className="text-[var(--v3-xira)] leading-relaxed">
                  Tanga topish, kunlik missiya mukofotlari, sovg{"'"}a almashish va laboratoriya xaridlari uchun pochtani{' '}
                  <Link href="/profil#email-tasdiqlash" className="text-[var(--v3-urgu)] underline font-semibold">
                    kabinetda
                  </Link>{' '}
                  tasdiqlash zarur.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                <div className="font-bold text-[var(--v3-matn)]">Rasmiy tasdiq belgisi</div>
                <p className="text-[var(--v3-xira)] leading-relaxed">
                  Reyting, chat, do{"'"}stlar va ustoz sahifasida ko{"'"}k tasdiq belgisi hamda Shaxsiy bo{"'"}limda 5 ta maxsus bezak uslubini ochadi.
                </p>
              </div>
            </div>
          </div>

          <div className="v3-panel-karta p-5 sm:p-6 space-y-4 max-w-lg">
            <div className="font-bold text-sm text-[var(--v3-matn)] pb-2 border-b border-[var(--v3-chiziq)]">
              Parolni Almashtirish
            </div>

          <p className="text-[11.5px] text-[var(--v3-xira)] leading-relaxed">
            Yangi parol kamida 8 ta belgidan iborat bo{"'"}lishi kerak. Google orqali kirilgan hisoblarda parol o{"'"}rnatish uchun parolni tiklash sahifasidan foydalaning.
          </p>

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
                minLength={8}
                maxLength={128}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="v3-kiritish"
              />
            </div>

            <div>
              <label className="v3-yorliq">Yangi parolni tasdiqlang</label>
              <input
                type="password"
                minLength={8}
                maxLength={128}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="v3-kiritish"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
            >
              <Ikon nom="tasdiq" olcham={14} />
              <span>{isChangingPassword ? 'Yangilanmoqda...' : 'Parolni yangilash'}</span>
            </button>
          </form>
          </div>
        </div>
      )}

      {/* ─── 6. MA'LUMOTLAR ─── */}
      {activeSection === 'data' && (
        <div className="v3-panel-karta p-5 sm:p-6 space-y-4 max-w-lg">
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

      {/* Mobil yopishqoq saqlash tugmasi */}
      {hasChanges && (
        <div
          className="md:hidden fixed bottom-[4.5rem] inset-x-3 z-20 p-3 rounded-2xl border border-[var(--v3-urgu)]/45 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3"
          style={{ background: 'color-mix(in srgb, var(--v3-fon-2) 94%, transparent)' }}
        >
          <span className="text-xs font-medium text-[var(--v3-matn)] truncate">
            Saqlanmagan o{"'"}zgarishlar bor
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold shrink-0 inline-flex items-center gap-1.5"
          >
            <Ikon nom="tasdiq" olcham={14} />
            <span>{isSaving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
