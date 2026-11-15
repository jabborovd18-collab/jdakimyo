// app/(auth)/register/page.js
"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ACADEMIC_ROLES, DEFAULT_ROLE } from '@/lib/roles'
import Ikon from '@/components/Ikon'
import AuthQobiq, {
  AuthXatoQutisi,
  AuthYuklanmoqda,
  GoogleKirishTugma,
} from '@/components/AuthQobiq'
import {
  authXatoMatni,
  emailniTekshir,
  PAROL_MAX,
  PAROL_MIN,
  registerMaydonNormallashtir,
  USERNAME_PATTERN,
  xavfsizQaytishManzili,
} from '@/lib/auth-tekshiruv'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: DEFAULT_ROLE,
    university: '',
  })

  const rawCallbackUrl = searchParams?.get('callbackUrl')
  const joriyOrigin = typeof window !== 'undefined' ? window.location.origin : null
  const safeCallbackUrl = xavfsizQaytishManzili(rawCallbackUrl, '/profil', joriyOrigin)

  // Allaqachon kirgan foydalanuvchini kabinetga yo'naltiramiz
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      router.replace(safeCallbackUrl)
    }
  }, [status, session?.user?.id, safeCallbackUrl, router])

  // Google OAuth yoki URL xatoliklarini ko'rsatamiz
  useEffect(() => {
    const error = searchParams?.get('error')
    if (!error) return
    const matn = authXatoMatni(error, { kontekst: 'royxat' })
    setFormError(matn)
    toast.error(matn, { id: 'auth-url-error', duration: 4500 })
  }, [searchParams])

  // Google OAuth orqali 1 bosishda ro'yxatdan o'tish / kirish
  const handleGoogleSignIn = async () => {
    setFormError('')
    setIsGoogleLoading(true)
    try {
      const res = await signIn('google', { callbackUrl: safeCallbackUrl })
      if (res?.error) {
        const matn = authXatoMatni(res.error, { kontekst: 'royxat' })
        setFormError(matn)
        toast.error(matn)
        setIsGoogleLoading(false)
      }
    } catch {
      const matn = "Google orqali ro'yxatdan o'tishda xatolik yuz berdi"
      setFormError(matn)
      toast.error(matn)
      setIsGoogleLoading(false)
    }
  }

  const handleChange = (e) => {
    if (formError) setFormError('')
    const { name, value } = e.target
    const next = registerMaydonNormallashtir(name, value)
    setFormData((prev) => ({ ...prev, [name]: next }))
  }

  // Brauzer autofill qilganida React state bo'sh qolib tugma qulflanib qolmasin
  const handleAutofillStart = (e) => {
    if (e.animationName !== 'v3-autofill-start') return
    const { name, value } = e.target
    if (!name || !value) return
    const next = registerMaydonNormallashtir(name, value)
    setFormData((prev) => (prev[name] ? prev : { ...prev, [name]: next }))
  }

  // Jonli validatsiya
  const username = formData.username
  const usernameValid = username === '' || USERNAME_PATTERN.test(username)
  const emailNatija = formData.email.trim() ? emailniTekshir(formData.email) : { ok: true }
  const emailValid = emailNatija.ok
  const passwordValid =
    formData.password === '' ||
    (formData.password.length >= PAROL_MIN && formData.password.length <= PAROL_MAX)
  const passwordsMatch =
    formData.confirmPassword === '' || formData.password === formData.confirmPassword

  const canSubmit =
    !isLoading &&
    !isGoogleLoading &&
    formData.fullName.trim().length > 0 &&
    USERNAME_PATTERN.test(username) &&
    emailniTekshir(formData.email).ok &&
    formData.password.length >= PAROL_MIN &&
    formData.password.length <= PAROL_MAX &&
    formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading || isGoogleLoading) return

    setFormError('')
    setIsLoading(true)

    try {
      if (!formData.fullName.trim()) {
        throw new Error('Ism-familiyangizni kiriting')
      }
      if (!USERNAME_PATTERN.test(formData.username)) {
        throw new Error('Username faqat kichik harflar, raqamlar, "." va "_" dan iborat bo\'lishi kerak (3-30 ta belgi)')
      }
      const emailTek = emailniTekshir(formData.email)
      if (!emailTek.ok) {
        throw new Error(emailTek.xato)
      }
      if (formData.password.length < PAROL_MIN || formData.password.length > PAROL_MAX) {
        throw new Error(`Parol ${PAROL_MIN} dan ${PAROL_MAX} tagacha belgidan iborat bo'lsin`)
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Parollar mos kelmadi')
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
          university: formData.university.trim(),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "Ro'yxatdan o'tishda xatolik yuz berdi")
      }

      if (data?.xatYuborildi) {
        toast.success("Hisob yaratildi! Tasdiqlash kodi pochtangizga yuborildi.", { duration: 4500 })
      } else {
        toast.success("Hisob yaratildi! Email tasdiqlash kodini kabinetdan qayta yuborishingiz mumkin.", { duration: 5000 })
      }

      // Darhol tizimga kiritamiz
      const loginRes = await signIn('credentials', {
        login: formData.username.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      })

      if (loginRes && !loginRes.error && loginRes.ok !== false) {
        router.push(safeCallbackUrl)
        router.refresh()
      } else {
        toast("Hisobingiz ochildi, endi login bilan kiring.", { duration: 4000 })
        router.push(`/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`)
      }
    } catch (error) {
      const matn = authXatoMatni(error?.message, { kontekst: 'royxat' })
      setFormError(matn)
      toast.error(matn)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'authenticated' && session?.user?.id) {
    return <AuthYuklanmoqda matn="Shaxsiy kabinetga yo'naltirilmoqda..." />
  }

  const loginHref = rawCallbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
    : '/login'

  const inputXato = 'border-red-500/70 focus:border-red-500'

  return (
    <AuthQobiq
      sarlavha="Ro'yxatdan o'tish"
      izoh="JDA KIMYO platformasiga qo'shiling"
    >
      <AuthXatoQutisi xato={formError} />

      <GoogleKirishTugma
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        disabled={isLoading}
        label="Google orqali 1 bosishda kirish"
      />

      {/* Ajratuvchi */}
      <div className="relative my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--v3-chiziq)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--v3-xira)]">
          yoki an&apos;anaviy shakl
        </span>
        <div className="h-px flex-1 bg-[var(--v3-chiziq)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reg-fullname" className="v3-yorliq">Ism-familiya</label>
          <input
            id="reg-fullname"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onAnimationStart={handleAutofillStart}
            placeholder="Jabborov Diyorbek"
            autoComplete="name"
            maxLength={100}
            required
            className="v3-kiritish py-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="reg-username" className="v3-yorliq">Username</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] text-sm pointer-events-none select-none">
              @
            </span>
            <input
              id="reg-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onAnimationStart={handleAutofillStart}
              placeholder="diyorbek_j"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={30}
              required
              className={`v3-kiritish py-3 pl-8 text-sm ${usernameValid ? '' : inputXato}`}
            />
          </div>
          <p className={`text-[11px] mt-1 leading-snug ${usernameValid ? 'text-[var(--v3-xira)]' : 'text-red-400'}`}>
            {usernameValid
              ? 'Kichik harf, raqam, "." va "_" — 3–30 belgi. Saytga shu nom bilan kirasiz.'
              : 'Faqat kichik harflar, raqamlar, "." va "_" ishlatiladi (3–30 ta belgi).'}
          </p>
        </div>

        <div>
          <label htmlFor="reg-email" className="v3-yorliq">Email</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onAnimationStart={handleAutofillStart}
            placeholder="diyorbek@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={254}
            required
            className={`v3-kiritish py-3 text-sm ${emailValid ? '' : inputXato}`}
          />
          {!emailValid && (
            <p className="text-[11px] text-red-400 mt-1">{emailNatija.xato}</p>
          )}
        </div>

        <div>
          <label htmlFor="reg-password" className="v3-yorliq">Parol</label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onAnimationStart={handleAutofillStart}
              placeholder="Kamida 6 ta belgi"
              autoComplete="new-password"
              minLength={PAROL_MIN}
              maxLength={PAROL_MAX}
              required
              className={`v3-kiritish py-3 pr-12 text-sm ${passwordValid ? '' : inputXato}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)] transition-colors"
            >
              <Ikon nom={showPassword ? 'kuzatuvYopiq' : 'kuzatuv'} olcham={18} />
            </button>
          </div>
          {!passwordValid && (
            <p className="text-[11px] text-red-400 mt-1">
              Parol {PAROL_MIN} dan {PAROL_MAX} tagacha belgidan iborat bo&apos;lsin
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-confirm" className="v3-yorliq">Parolni tasdiqlang</label>
          <input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onAnimationStart={handleAutofillStart}
            placeholder="••••••"
            autoComplete="new-password"
            maxLength={PAROL_MAX}
            required
            className={`v3-kiritish py-3 text-sm ${passwordsMatch ? '' : inputXato}`}
          />
          {!passwordsMatch && (
            <p className="text-[11px] text-red-400 mt-1">Parollar mos kelmadi</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-role" className="v3-yorliq">Darajangiz</label>
            <select
              id="reg-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="v3-kiritish py-3 text-sm"
            >
              {Object.entries(ACADEMIC_ROLES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reg-university" className="v3-yorliq">
              Muassasa <span className="normal-case font-normal">(ixtiyoriy)</span>
            </label>
            <input
              id="reg-university"
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="SamDU"
              maxLength={120}
              className="v3-kiritish py-3 text-sm"
            />
          </div>
        </div>
        <p className="text-[11px] text-[var(--v3-xira)] -mt-2">
          Ustoz huquqi administrator tomonidan beriladi.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="v3-tugma v3-tugma-asosiy w-full min-h-[46px] justify-center text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLoading ? 'Saqlanmoqda...' : "Ro'yxatdan o'tish"}</span>
          {!isLoading && <Ikon nom="ong" olcham={16} />}
        </button>
      </form>

      <div className="mt-6 text-center text-xs sm:text-sm text-[var(--v3-xira)]">
        Hisobingiz bormi?{' '}
        <Link href={loginHref} className="text-[var(--v3-urgu)] hover:underline font-bold">
          Kirish
        </Link>
      </div>
    </AuthQobiq>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthYuklanmoqda matn="Sahifa yuklanmoqda..." />}>
      <RegisterForm />
    </Suspense>
  )
}
