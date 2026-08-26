// app/hamkorlik/[slug]/page.js
"use client"

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SinovTesti from '@/components/hamkorlik/SinovTesti'
import { sanaQisqa } from '@/lib/sana'

export default function HamkorlikSahifasi({ params }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testBoshlandi, setTestBoshlandi] = useState(false)
  const [activeTab, setActiveTab] = useState('haqida') // 'haqida' | 'leaderboard'

  const yukla = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/hamkorlik/${slug}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    yukla()
  }, [yukla])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center justify-center text-2xl animate-spin mx-auto">
            🧪
          </div>
          <p className="text-sm text-purple-300">Hamkorlik ma&apos;lumotlari yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  if (error || !data?.partnership) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-800/50 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="text-4xl">❌</div>
          <h1 className="text-xl font-bold text-red-300">Tadbir Topilmadi</h1>
          <p className="text-xs text-purple-300">{error || 'Ushbu mavsumiy hamkorlik sahifasi mavjud emas yoki muddati tugagan.'}</p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { partnership, leaderboard = [], userAttempt } = data
  const now = new Date()
  const startsAt = new Date(partnership.startsAt)
  const endsAt = new Date(partnership.endsAt)
  const isExpired = now > endsAt
  const isUpcoming = now < startsAt
  const isActive = partnership.isActive && !isExpired && !isUpcoming

  // Agar test boshlangan bo'lsa, test oynasini ko'rsatamiz
  if (testBoshlandi) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white py-6">
        <SinovTesti
          partnership={partnership}
          user={session?.user}
          onFinish={() => {
            yukla()
          }}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              JDA KIMYO
            </Link>
            <span className="text-purple-700">✕</span>
            <span className="font-bold text-sm sm:text-base text-yellow-400">
              {partnership.partnerName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {isAuthenticated ? (
              <Link href="/profil" className="px-3.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 border border-purple-700/50 text-purple-200">
                Profilim ({session.user.name || session.user.username})
              </Link>
            ) : (
              <Link
                href={`/login?callbackUrl=/hamkorlik/${slug}`}
                className="px-4 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
              >
                Kirish / Ro&apos;yxatdan o&apos;tish
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Asosiy Kontent */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* HERO KARTASI */}
        <div className="bg-slate-900/80 border border-purple-800/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Hamkor Logotipi va Badj */}
          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold flex items-center gap-2">
              <span>🤝</span>
              <span>Rasmiy Mavsumiy Hamkorlik</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              isActive ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {isActive ? '🟢 SINOV OCHIQ' : isExpired ? '🔴 YAKUNLANGAN' : '🟡 TEZ ORADA'}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {partnership.title}
            </h1>
            <p className="text-sm sm:text-base text-purple-200 max-w-2xl mx-auto leading-relaxed">
              {partnership.certReason || partnership.description}
            </p>
          </div>

          {/* Sinov xarakteristikalari */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs text-purple-300">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">Savollar soni</span>
              <strong className="text-base text-white font-bold">30 ta</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">Vaqt chegarasi</span>
              <strong className="text-base text-yellow-400 font-bold">{partnership.timeLimitMin} daqiqa</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">O&apos;tish bali</span>
              <strong className="text-base text-green-400 font-bold">{partnership.minPassPercent}%</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">Mukofot</span>
              <strong className="text-base text-yellow-300 font-bold">Rasmiy Sertifikat</strong>
            </div>
          </div>

          {/* Muddati haqida */}
          <div className="text-xs text-purple-400 font-mono">
            📅 Sinov muddati: {sanaQisqa(startsAt)} dan — {sanaQisqa(endsAt)} gacha
          </div>

          {/* AMAL TUGMALARI */}
          <div className="pt-2">
            {!isAuthenticated ? (
              <Link
                href={`/login?callbackUrl=/hamkorlik/${slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-base shadow-xl hover:scale-105 transition-transform"
              >
                <span>🔑</span>
                <span>Testda Qatnashish Uchun Tizimga Kiring</span>
              </Link>
            ) : !isActive ? (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-300 text-sm font-bold">
                Ushbu sinov vaqti yakunlangan yoki hali boshlanmagan.
              </div>
            ) : (
              <div className="space-y-4">
                {userAttempt?.passed && userAttempt?.certId ? (
                  <div className="p-4 rounded-2xl bg-green-950/30 border border-green-700/50 max-w-md mx-auto space-y-3">
                    <span className="text-xs text-green-300 font-bold block">
                      🎉 Siz allaqachon ushbu sinovdan o&apos;tgansiz! (Natija: {userAttempt.percentage}%)
                    </span>
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/sertifikat/verify/${userAttempt.certId}`}
                        target="_blank"
                        className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold hover:scale-105 transition-transform"
                      >
                        📜 Sertifikatni Ko&apos;rish ({userAttempt.certId})
                      </Link>
                      <button
                        onClick={() => setTestBoshlandi(true)}
                        className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold"
                      >
                        Qayta topshirish 🔄
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTestBoshlandi(true)}
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-lg shadow-2xl hover:scale-105 transition-transform"
                  >
                    <span>🧪</span>
                    <span>Sinov Testini Boshlash (30 ta savol)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TABLAR (QOIDALAR & TOP REYTING) */}
        <div className="space-y-4">
          <div className="flex border-b border-purple-800/50 gap-2">
            <button
              onClick={() => setActiveTab('haqida')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'haqida' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-purple-300'
              }`}
            >
              📖 Sinov Qoidalari
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'leaderboard' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-purple-300'
              }`}
            >
              🏆 Top Ishtirokchilar Reytingi ({leaderboard.length})
            </button>
          </div>

          {activeTab === 'haqida' && (
            <div className="bg-slate-900/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm text-purple-200">
              <h3 className="font-bold text-white text-base">Sinov tartibi va shartlari:</h3>
              <ul className="space-y-2.5 list-disc list-inside">
                <li>Sinov <strong>30 ta test savolidan</strong> iborat.</li>
                <li>Savollar xaritasi orqali istalgan savolga erkin o&apos;tish va javobni almashtirish mumkin.</li>
                <li>Umumiy ajratilgan vaqt: <strong>{partnership.timeLimitMin} daqiqa</strong>. Vaqt tugagach test avtomatik yakunlanadi.</li>
                <li>Kamida <strong>{partnership.minPassPercent}%</strong> to&apos;plagan ishtirokchilarga <strong>{partnership.partnerName} va JDA Kimyo</strong> rasmiy sertifikati (QR kodli) taqdim etiladi.</li>
                <li>Sertifikat foydalanuvchining shaxsiy kabinetida doimiy saqlanadi va onlayn tasdiqlanadi.</li>
              </ul>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-slate-900/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-white text-base">Eng Yuqori Natijalar (Top 20):</h3>

              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-purple-400 text-xs">
                  Hozircha o&apos;tgan ishtirokchilar yo&apos;q. Birinchilardan bo&apos;lib testni topshiring va 1-o&apos;rinni egallang!
                </div>
              ) : (
                <div className="divide-y divide-purple-900/40">
                  {leaderboard.map((item, idx) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-yellow-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                        </span>
                        <div>
                          <strong className="text-white block text-sm">{item.user?.fullName || item.user?.username}</strong>
                          <span className="text-purple-400 text-[11px]">@{item.user?.username}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 font-bold text-xs">
                          {item.score} ball ({item.percentage}%)
                        </span>
                        <span className="text-[11px] text-purple-400 block font-mono mt-0.5">
                          {Math.floor(item.timeSpentSec / 60)}d {item.timeSpentSec % 60}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
