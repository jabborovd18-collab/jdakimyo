// app/(auth)/register/page.js
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ACADEMIC_ROLES, DEFAULT_ROLE } from '@/lib/roles'

// Server tomondagi qoida bilan bir xil (app/api/auth/register/route.js)
const USERNAME_PATTERN = /^[a-z0-9._]{3,30}$/

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: DEFAULT_ROLE,
    university: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    // Username har doim kichik harfda va bo'sh joysiz saqlanadi —
    // shunda keyinchalik login qilishda chalkashlik bo'lmaydi.
    const next = name === 'username' ? value.toLowerCase().replace(/\s/g, '') : value
    setFormData(prev => ({ ...prev, [name]: next }))
  }

  // Jonli validatsiya holati
  const username = formData.username
  const usernameValid = username === '' || USERNAME_PATTERN.test(username)
  const passwordsMatch = formData.confirmPassword === '' || formData.password === formData.confirmPassword
  const passwordLongEnough = formData.password === '' || formData.password.length >= 6

  const canSubmit =
    !isLoading &&
    formData.fullName.trim() &&
    USERNAME_PATTERN.test(username) &&
    formData.email.trim() &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validatsiya
      if (!USERNAME_PATTERN.test(formData.username)) {
        throw new Error('Username faqat kichik harflar, raqamlar, "." va "_" dan iborat bo\'lishi kerak (3-30 ta belgi)')
      }

      if (formData.password.length < 6) {
        throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Parollar mos kelmadi')
      }

      // API ga so'rov
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi')
      }

      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!')

      setTimeout(() => {
        router.push('/login')
      }, 1000)

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none transition-colors"
  const inputErrorClass = "w-full px-4 py-3 bg-purple-950/50 border border-red-600/60 rounded-xl text-white placeholder-purple-500 focus:border-red-500 outline-none transition-colors"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4 py-10">
      <div className="max-w-md w-full">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Ro'yxatdan o'tish
            </h1>
            <p className="text-purple-300 text-sm">
              JDA KIMYO platformasiga qo'shiling
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-purple-300 mb-1 block">Ism-familiya</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jabborov Diyorbek"
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="diyorbek_j"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  className={`${usernameValid ? inputClass : inputErrorClass} pl-9`}
                />
              </div>
              <p className={`text-xs mt-1 ${usernameValid ? 'text-purple-400' : 'text-red-400'}`}>
                {usernameValid
                  ? 'Kichik harflar, raqamlar, "." va "_" — 3 tadan 30 tagacha belgi'
                  : 'Faqat kichik harflar, raqamlar, "." va "_" ishlatiladi (3-30 ta belgi)'}
              </p>
              <p className="text-xs text-purple-500 mt-0.5">
                Saytga shu username bilan kirasiz
              </p>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="diyorbek@example.com"
                autoComplete="email"
                autoCapitalize="none"
                required
                className={inputClass}
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
                  placeholder="Kamida 6 ta belgi"
                  autoComplete="new-password"
                  required
                  className={`${passwordLongEnough ? inputClass : inputErrorClass} pr-12`}
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
              {!passwordLongEnough && (
                <p className="text-xs text-red-400 mt-1">Parol kamida 6 ta belgidan iborat bo'lsin</p>
              )}
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Parolni tasdiqlang</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                autoComplete="new-password"
                required
                className={passwordsMatch ? inputClass : inputErrorClass}
              />
              {!passwordsMatch && (
                <p className="text-xs text-red-400 mt-1">Parollar mos kelmadi</p>
              )}
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Darajangiz</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
              >
                {Object.entries(ACADEMIC_ROLES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-purple-500 mt-1">
                Ustoz huquqi administrator tomonidan beriladi
              </p>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">
                Universitet <span className="text-purple-500">(ixtiyoriy)</span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="SamDU"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-purple-300">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Kirish
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
