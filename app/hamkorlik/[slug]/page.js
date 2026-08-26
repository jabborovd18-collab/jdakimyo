// app/hamkorlik/[slug]/page.js
"use client"

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SinovTesti from '@/components/hamkorlik/SinovTesti'
import { ALCHEMIQ_SAVOLLAR } from '@/data/hamkorlik/alchemiq-savollar'
import Ikon from '@/components/Ikon'
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
            <Ikon nom="kolba" olcham={24} className="animate-spin" />
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
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <Ikon nom="xato" olcham={32} />
          </div>
          <h1 className="text-xl font-bold text-red-300">Tadbir Topilmadi</h1>
          <p className="text-xs text-purple-300">{error || 'Ushbu mavsumiy hamkorlik sahifasi mavjud emas yoki muddati tugagan.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold">
            <Ikon nom="chap" olcham={16} /> Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { partnership, leaderboard = [], userAttempt, hasSubmitted } = data
  const now = new Date()
  const startsAt = new Date(partnership.startsAt)
  const endsAt = new Date(partnership.endsAt)
  const isExpired = now > endsAt
  const isUpcoming = now < startsAt
  const isActive = partnership.isActive && !isExpired && !isUpcoming

  // Agar test boshlangan bo'lsa, test oynasini ko'rsatamiz
  if (testBoshlandi || (hasSubmitted && !partnership.isAnnounced)) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white py-6">
        <SinovTesti
          partnership={partnership}
          savollar={ALCHEMIQ_SAVOLLAR}
          userAttempt={userAttempt}
          isLoggedIn={isAuthenticated}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/hamkorlik/jdakimyo-neon-logo.jpg"
                alt="JDA Kimyo"
                className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40"
              />
              <span className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                JDA KIMYO
              </span>
            </Link>
            <span className="text-purple-700 font-bold">✕</span>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-400">
              <img
                src="/images/hamkorlik/alchemiq-logo.jpg"
                alt={partnership.partnerName}
                className="w-6 h-6 rounded-md object-cover border border-amber-400/40"
              />
              <span>{partnership.partnerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {isAuthenticated ? (
              <Link href="/profil" className="px-3.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 border border-purple-700/50 text-purple-200 flex items-center gap-1.5 font-semibold">
                <Ikon nom="odam" olcham={14} />
                <span>Profilim ({session.user.name || session.user.username})</span>
              </Link>
            ) : (
              <>
                <Link
                  href={`/login?callbackUrl=/hamkorlik/${slug}`}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-purple-900/40 border border-purple-700/50 text-purple-200 font-semibold"
                >
                  Kirish
                </Link>
                <Link
                  href={`/register?callbackUrl=/hamkorlik/${slug}`}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Asosiy Kontent */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* HERO KARTASI */}
        <div className="bg-slate-900/80 border border-purple-800/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Dual Brand Showcase (JDA Kimyo ✕ AlchemIQ) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/images/hamkorlik/jdakimyo-neon-logo.jpg"
                alt="JDA Kimyo"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/60 shadow-xl shadow-cyan-500/25 transition-transform hover:scale-105"
              />
              <span className="text-[11px] font-extrabold text-cyan-300">JDA KIMYO</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-amber-400 font-black text-xl sm:text-2xl animate-pulse">✕</span>
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Hamkorlik
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <img
                src="/images/hamkorlik/alchemiq-logo.jpg"
                alt={partnership.partnerName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-500/25 transition-transform hover:scale-105"
              />
              <span className="text-[11px] font-extrabold text-amber-300">{partnership.partnerName}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
              isActive ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{isActive ? "SINOV OCHIQ" : isExpired ? "YAKUNLANGAN" : "TEZ ORADA"}</span>
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
              <strong className="text-base text-amber-400 font-bold">{partnership.timeLimitMin} daqiqa</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">O&apos;tish bali</span>
              <strong className="text-base text-green-400 font-bold">{partnership.minPassPercent}%</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block">Mukofot</span>
              <strong className="text-base text-amber-300 font-bold">Rasmiy Sertifikat</strong>
            </div>
          </div>

          {/* Muddati haqida */}
          <div className="text-xs text-purple-400 font-mono flex items-center justify-center gap-1.5">
            <Ikon nom="taqvim" olcham={14} />
            <span>Sinov muddati: {sanaQisqa(startsAt)} dan — {sanaQisqa(endsAt)} gacha</span>
          </div>

          {/* AMAL TUGMALARI */}
          <div className="pt-3">
            {!isAuthenticated ? (
              <div className="max-w-md mx-auto space-y-3">
                {/* KATTA ASOSIY RO'YXATDAN O'TISH TUGMASI */}
                <Link
                  href={`/register?callbackUrl=/hamkorlik/${slug}`}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Ikon nom="qosh" olcham={22} qalin={2.5} />
                  <span>Ro&apos;yxatdan O&apos;tish va Testni Boshlash</span>
                </Link>

                {/* KICHIKROQ KIRISH HAVOLASI */}
                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-purple-300">
                  <span>Hisobingiz bormi?</span>
                  <Link
                    href={`/login?callbackUrl=/hamkorlik/${slug}`}
                    className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1"
                  >
                    <Ikon nom="chiqish" olcham={13} />
                    <span>Kirish</span>
                  </Link>
                </div>
              </div>
            ) : !isActive ? (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-300 text-sm font-bold flex items-center justify-center gap-2">
                <Ikon nom="ogohlantirish" olcham={18} />
                <span>Ushbu sinov vaqti yakunlangan yoki hali boshlanmagan.</span>
              </div>
            ) : hasSubmitted ? (
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/50 max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                  <Ikon nom="tasdiq" olcham={18} />
                  <span>Siz sinov testini topshirgansiz</span>
                </div>
                <p className="text-xs text-purple-300">
                  {partnership.isAnnounced
                    ? `Sizning natijangiz: ${userAttempt?.percentage || 0}%`
                    : "Javoblaringiz qabul qilingan. Rasmiy natijalar va sertifikatlar muddat yakunlangach e'lon qilinadi."}
                </p>
                {partnership.isAnnounced && userAttempt?.certId && (
                  <Link
                    href={`/sertifikat/verify/${userAttempt.certId}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
                  >
                    <Ikon nom="sertifikat" olcham={16} />
                    <span>Sertifikatni Ko&apos;rish</span>
                  </Link>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setTestBoshlandi(true)}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-lg shadow-2xl hover:scale-105 transition-transform"
              >
                <Ikon nom="kolba" olcham={24} />
                <span>Sinov Testini Boshlash (30 ta savol)</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLAR (QOIDALAR & TOP REYTING) */}
        <div className="space-y-4">
          <div className="flex border-b border-purple-800/50 gap-2">
            <button
              onClick={() => setActiveTab('haqida')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'haqida' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-300'
              }`}
            >
              <Ikon nom="kitob" olcham={16} />
              <span>Sinov Qoidalari</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'leaderboard' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-300'
              }`}
            >
              <Ikon nom="kubok" olcham={16} />
              <span>Top Ishtirokchilar ({leaderboard.length})</span>
            </button>
          </div>

          {activeTab === 'haqida' && (
            <div className="bg-slate-900/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm text-purple-200">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Ikon nom="belgi" olcham={18} className="text-amber-400" />
                <span>Sinov tartibi va shartlari:</span>
              </h3>
              <ul className="space-y-2.5 list-disc list-inside">
                <li>Sinov <strong>30 ta test savolidan</strong> iborat.</li>
                <li>Har bir foydalanuvchi hisobiga <strong>faqat bitta urinish</strong> beriladi.</li>
                <li>Savollar xaritasi orqali istalgan savolga erkin o&apos;tish va javobni almashtirish mumkin.</li>
                <li>Umumiy ajratilgan vaqt: <strong>{partnership.timeLimitMin} daqiqa</strong>. Vaqt tugagach test avtomatik yakunlanadi.</li>
                <li>Xolislikni ta&apos;minlash maqsadida to&apos;g&apos;ri javoblar va ballar sinov muddati yakunlangach <strong>bir vaqtda</strong> rasman e&apos;lon qilinadi.</li>
                <li>Kamida <strong>{partnership.minPassPercent}%</strong> to&apos;plagan ishtirokchilarga <strong>{partnership.partnerName} va JDA Kimyo</strong> rasmiy QR-kodli sertifikati taqdim etiladi.</li>
              </ul>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-slate-900/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
              {!partnership.isAnnounced ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Ikon nom="soat" olcham={28} />
                  </div>
                  <h4 className="text-lg font-bold text-white">Natijalar Yaqin Kunlarda E&apos;lon Qilinadi</h4>
                  <p className="text-xs text-purple-300 max-w-md mx-auto">
                    Sinov yakunlangach, barcha qatnashuvchilar natijalari va Top 3 g&apos;oliblar ushbu reyting jadvalida paydo bo&apos;ladi.
                  </p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-purple-400 text-xs">
                  Hozircha natijalar mavjud emas.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* TOP 3 PODIUM */}
                  {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {/* 2-o'rin (Kumush) */}
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-600 text-center space-y-2 order-1 sm:order-1">
                        <span className="w-8 h-8 mx-auto rounded-full bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-xs">
                          2
                        </span>
                        <strong className="text-white text-xs block truncate">{leaderboard[1]?.user?.fullName || leaderboard[1]?.user?.username}</strong>
                        <span className="text-slate-300 font-mono text-xs font-bold block">{leaderboard[1]?.score} ball</span>
                      </div>

                      {/* 1-o'rin (Oltin) */}
                      <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-yellow-500/20 border-2 border-amber-400 text-center space-y-2 -translate-y-2 order-2 sm:order-2 shadow-lg shadow-amber-500/10">
                        <span className="w-10 h-10 mx-auto rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                          1
                        </span>
                        <strong className="text-amber-300 text-sm block truncate">{leaderboard[0]?.user?.fullName || leaderboard[0]?.user?.username}</strong>
                        <span className="text-amber-300 font-mono text-sm font-extrabold block">{leaderboard[0]?.score} ball ({leaderboard[0]?.percentage}%)</span>
                      </div>

                      {/* 3-o'rin (Bronza) */}
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-800 text-center space-y-2 order-3 sm:order-3">
                        <span className="w-8 h-8 mx-auto rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                          3
                        </span>
                        <strong className="text-white text-xs block truncate">{leaderboard[2]?.user?.fullName || leaderboard[2]?.user?.username}</strong>
                        <span className="text-amber-600 font-mono text-xs font-bold block">{leaderboard[2]?.score} ball</span>
                      </div>
                    </div>
                  )}

                  {/* TO'LIQ RO'YXAT */}
                  <div className="divide-y divide-purple-900/40 pt-2">
                    {leaderboard.map((item, idx) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center font-bold text-amber-400 font-mono">
                            {idx + 1}.
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
