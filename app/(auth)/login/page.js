// app/(auth)/login/page.js
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
      router.push('/profil')
      router.refresh()

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
              <p className="text-xs text-purple-400 mt-1">
                Username yoki ro'yxatdan o'tgan email manzilingizni kiriting
              </p>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-yellow-400 transition-colors text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
            </button>
          </form>

          {/* ELEKTRON DOSKA.
              Ma'ruza zalida parol terib bo'lmaydi — 100 talaba ekranni
              ko'rib turadi. Bu yo'l aynan login sahifasida turishi kerak:
              odam kirmoqchi bo'lganda shu yerga keladi. */}
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
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}