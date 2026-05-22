"use client"

import { useState, useEffect } from "react"
import { auth } from "@/app/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import Link from "next/link"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-purple-300">Yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex items-center justify-center">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Kirish kerak</h1>
          <p className="text-purple-300 mb-6">Profilni ko'rish uchun avval tizimga kiring</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all inline-block">
            Kirish
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Bosh sahifa
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">👤 Profil</h1>
          <p className="text-purple-400 text-sm">Shaxsiy ma'lumotlaringiz</p>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        
        {/* Profil kartasi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-24 h-24 rounded-full border-4 border-purple-400 mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-purple-400">
              {user.displayName?.charAt(0) || "U"}
            </div>
          )}
          <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
          <p className="text-purple-300 mt-1">{user.email}</p>
        </div>

        {/* Ma'lumotlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Hisob ma'lumotlari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <span className="text-purple-400 text-sm">Ism</span>
              <p className="text-white font-semibold">{user.displayName || "Ko'rsatilmagan"}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <span className="text-purple-400 text-sm">Email</span>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <span className="text-purple-400 text-sm">UID</span>
              <p className="text-white font-mono text-sm">{user.uid}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <span className="text-purple-400 text-sm">Email tasdiqlangan</span>
              <p className="text-white font-semibold">
                {user.emailVerified ? "✅ Ha" : "❌ Yo'q"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistika (kelajakda) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📊 Faollik</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Izohlar</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Saqlangan</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Testlar</div>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}