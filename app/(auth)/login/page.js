// app/(auth)/login/page.js
"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import AuthQobiq, {
  AuthXatoQutisi,
  AuthYuklanmoqda,
  GoogleKirishTugma,
} from '@/components/AuthQobiq'
import {
  authXatoMatni,
  loginFormQiymatlari,
  xavfsizQaytishManzili,
} from '@/lib/auth-tekshiruv'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const passwordRef = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [googleHint, setGoogleHint] = useState(false)
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  })

  const rawCallbackUrl = searchParams?.get('callbackUrl')
  const joriyOrigin = typeof window !== 'undefined' ? window.location.origin : null
  const safeCallbackUrl = xavfsizQaytishManzili(rawCallbackUrl, '/profil', joriyOrigin)

  // Allaqachon tizimga kirgan foydalanuvchi /login da qolib ketmasin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      router.replace(safeCallbackUrl)
    }
  }, [status, session?.user?.id, safeCallbackUrl, router])

  // Google OAuth yoki NextAuth xatoliklarini URL parametrida ko'rsatamiz
  useEffect(() => {
    const error = searchParams?.get('error')
    if (!error) return
    const matn = authXatoMatni(error, { kontekst: 'kirish' })
    setFormError(matn)
    toast.error(matn, { id: 'auth-url-error', duration: 4500 })
  }, [searchParams])

  const handleChange = (e) => {
    if (formError) setFormError('')
    setGoogleHint(false)
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Brauzer parol menejeri React onChange ni ishga tushirmay to'ldirganida state ni sinxronlaydi
  const handleAutofillStart = (e) => {
    if (e.animationName !== 'v3-autofill-start') return
    const { name, value } = e.target
    if (!name || !value) return
    setFormData((prev) => (prev[name] ? prev : { ...prev, [name]: value }))
  }

  // Google OAuth orqali 1 bosishda kirish
  const handleGoogleSignIn = async () => {
    setFormError('')
    setGoogleHint(false)
    setIsGoogleLoading(true)
    try {
      const res = await signIn('google', { callbackUrl: safeCallbackUrl })
      if (res?.error) {
        const matn = authXatoMatni(res.error, { kontekst: 'kirish' })
        setFormError(matn)
        toast.error(matn)
        setIsGoogleLoading(false)
      }
    } catch {
      const matn = "Google orqali kirishda xatolik yuz berdi. Qayta urinib ko'ring."
      setFormError(matn)
      toast.error(matn)
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading || isGoogleLoading) return

    setFormError('')
    setGoogleHint(false)
    setIsLoading(true)

    try {
      const domData = e.currentTarget ? new FormData(e.currentTarget) : null
      const { login, password } = loginFormQiymatlari(formData, domData)
      if (login !== formData.login || password !== formData.password) {
        setFormData({ login, password })
      }

      const result = await signIn('credentials', {
        login,
        password,
        redirect: false,
      })

      if (!result || result.error || result.ok === false) {
        const matn = authXatoMatni(result?.error, { kontekst: 'kirish' })
        setFormError(matn)
        setGoogleHint(matn.includes('Login yoki parol'))
        toast.error(matn)
        return
      }

      toast.success('Muvaffaqiyatli kirdingiz!')
      router.push(safeCallbackUrl)
      router.refresh()
    } catch {
      const matn = "Tarmoq xatosi. Internet aloqasini tekshirib qayta urinib ko'ring."
      setFormError(matn)
      toast.error(matn)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'authenticated' && session?.user?.id) {
    return <AuthYuklanmoqda matn="Shaxsiy kabinetga yo'naltirilmoqda..." />
  }

  const registerHref = rawCallbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
    : '/register'

  const doskaHref = rawCallbackUrl
    ? `/doska/auth?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
    : '/doska/auth'

  const band = isLoading || isGoogleLoading

  return (
    <AuthQobiq
      sarlavha="Kirish"
      izoh="JDA KIMYO platformasidagi hisobingizga kiring"
    >
      <AuthXatoQutisi
        xato={formError}
        qoshimcha={
          googleHint
            ? "Agar hisobingizni avval Google orqali ochgan bo'lsangiz, yuqoridagi Google tugmasidan kiring."
            : null
        }
      />

      <GoogleKirishTugma
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        disabled={isLoading}
        label="Google orqali kirish"
      />

      {/* Ajratuvchi */}
      <div className="relative my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--v3-chiziq)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--v3-xira)]">
          yoki login orqali
        </span>
        <div className="h-px flex-1 bg-[var(--v3-chiziq)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-id" className="v3-yorliq">
            Username yoki email
          </label>
          <input
            id="login-id"
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            onAnimationStart={handleAutofillStart}
            placeholder="diyorbek_j yoki email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            className="v3-kiritish py-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="v3-yorliq">
            Parol
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onAnimationStart={handleAutofillStart}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="v3-kiritish py-3 pr-12 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const domParol = passwordRef.current?.value
                if (domParol && !formData.password) {
                  setFormData((prev) => ({ ...prev, password: domParol }))
                }
                setShowPassword((v) => !v)
              }}
              aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)] transition-colors"
            >
              <Ikon nom={showPassword ? 'kuzatuvYopiq' : 'kuzatuv'} olcham={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={band}
          className="v3-tugma v3-tugma-asosiy w-full min-h-[46px] justify-center text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLoading ? 'Kirilmoqda...' : 'Kirish'}</span>
          {!isLoading && <Ikon nom="ong" olcham={16} />}
        </button>
      </form>

      {/* Elektron doska QR kirish */}
      <div className="mt-6 pt-5 border-t border-[var(--v3-chiziq)]">
        <Link
          href={doskaHref}
          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] hover:border-[var(--v3-urgu)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] flex items-center justify-center shrink-0">
            <Ikon nom="doska" olcham={20} />
          </div>
          <span className="flex-1 min-w-0">
            <span className="block text-xs sm:text-sm font-bold text-[var(--v3-matn)]">
              Elektron doska — QR bilan kirish
            </span>
            <span className="block text-[11px] text-[var(--v3-xira)]">
              Parol terilmaydi. Telefondan skanerlab tasdiqlaysiz.
            </span>
          </span>
          <Ikon
            nom="ong"
            olcham={15}
            className="text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </Link>
      </div>

      <div className="mt-6 text-center text-xs sm:text-sm text-[var(--v3-xira)]">
        Hisobingiz yo&apos;qmi?{' '}
        <Link href={registerHref} className="text-[var(--v3-urgu)] hover:underline font-bold">
          Ro&apos;yxatdan o&apos;tish
        </Link>
      </div>
    </AuthQobiq>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthYuklanmoqda matn="Sahifa yuklanmoqda..." />}>
      <LoginForm />
    </Suspense>
  )
}
