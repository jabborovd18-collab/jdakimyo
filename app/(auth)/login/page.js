// app/(auth)/login/page.js
"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })

  // Google OAuth yoki boshqa xatoliklar URL parametrida kelsa ko'rsatamiz
  useEffect(() => {
    const error = searchParams?.get('error')
    if (error) {
      if (error === 'AccessDenied') {
        toast.error('Kirish rad etildi. Hisobingiz bloklangan bo\'lishi mumkin.')
      } else if (error === 'OAuthAccountNotLinked') {
        toast.error('Ushbu email bilan boshqa usulda ro\'yxatdan o\'tilgan.')
      } else if (error === 'Configuration') {
        toast.error('Google OAuth sozlamalarida xatolik bor.')
      } else {
        toast.error('Kirishda xatolik yuz berdi')
      }
    }
  }, [searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Google OAuth orqali 1 bosishda kirish
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const callbackUrl = searchParams?.get('callbackUrl') || '/profil'
      await signIn('google', { callbackUrl })
    } catch (error) {
      toast.error('Google orqali kirishda xatolik yuz berdi')
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        login: formData.login,
        password: formData.password,
        redirect: false
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success('Muvaffaqiyatli kirdingiz!')
      const callbackUrl = searchParams?.get('callbackUrl') || '/profil'
      router.push(callbackUrl)
      router.refresh()

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const registerHref = searchParams?.get('callbackUrl')
    ? `/register?callbackUrl=${encodeURIComponent(searchParams.get('callbackUrl'))}`
    : '/register'

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Kirish
            </h1>
            <p className="text-purple-300 text-sm">
              JDA KIMYO platformasiga xush kelibsiz
            </p>
          </div>

          {/* GOOGLE ORQALI BIR BOSISHDA KIRISH */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Bog\'lanmoqda...' : 'Google orqali kirish'}</span>
          </button>

          {/* AJRATUVCHI (YOKI) */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-purple-700/50 w-full" />
            <span className="bg-purple-900/60 px-3 text-xs text-purple-300 uppercase tracking-wider relative rounded-full">
              yoki login orqali
            </span>
            <div className="border-t border-purple-700/50 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-purple-300 mb-1 block">Username yoki email</label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="diyorbek_j"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
              {isLoading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          {/* ELEKTRON DOSKA */}
          <div className="mt-6 pt-5 border-t border-purple-800/50">
            <Link
              href="/doska"
              className="flex items-center gap-3 p-3 bg-cyan-900/25 hover:bg-cyan-900/40 border border-cyan-700/50 rounded-xl transition-all group"
            >
              <span className="text-2xl">📺</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-cyan-200">
                  Elektron doska — QR bilan kirish
                </span>
                <span className="block text-xs text-cyan-400/80">
                  Parol terilmaydi. Telefondan skanerlab tasdiqlaysiz.
                </span>
              </span>
              <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-purple-300">
            Hisobingiz yo&apos;qmi?{' '}
            <Link href={registerHref} className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}