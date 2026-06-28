// app/(auth)/register/page.js
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'bakalavr',
    university: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validatsiya
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Parollar mos kelmadi')
      }

      if (formData.password.length < 6) {
        throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      }

      if (formData.username.length < 3) {
        throw new Error('Username kamida 3 ta belgidan iborat bo\'lishi kerak')
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 backdrop-blur-sm">
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
                required
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="diyorbek_j"
                required
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
              <p className="text-xs text-purple-400 mt-1">Faqat harflar, raqamlar va _</p>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="diyorbek@example.com"
                required
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-purple-300 mb-1 block">Parol</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-purple-300 mb-1 block">Tasdiqlang</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-purple-300 mb-1 block">Darajangiz</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
              >
                <option value="bakalavr">Bakalavr</option>
                <option value="magistr">Magistr</option>
                <option value="doktorant">Doktorant</option>
                <option value="professor">Professor</option>
                <option value="mustaqil">Mustaqil o'rganuvchi</option>
              </select>
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
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
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