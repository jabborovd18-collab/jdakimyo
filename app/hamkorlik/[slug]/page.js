// app/hamkorlik/[slug]/page.js
"use client"

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SinovTesti from '@/components/hamkorlik/SinovTesti'
import { ALCHEMIQ_SAVOLLAR } from '@/data/hamkorlik/alchemiq-savollar'
import { sertifikatPDFYuklab } from '@/lib/sertifikat-pdf'
import Ikon from '@/components/Ikon'
import { sanaQisqa } from '@/lib/sana'
import toast from 'react-hot-toast'

export default function HamkorlikSahifasi({ params }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testBoshlandi, setTestBoshlandi] = useState(false)
  const [activeTab, setActiveTab] = useState('natijalar') // 'natijalar' | 'haqida' | 'leaderboard'
  const [pdfYuklanmoqda, setPdfYuklanmoqda] = useState(false)

  const yukla = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/hamkorlik/${slug}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
      if (json.partnership?.isAnnounced) {
        setActiveTab('natijalar')
      } else {
        setActiveTab('haqida')
      }
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

  // Foydalanuvchining umumiy reytingdagi o'rni
  let userRank = null
  if (session?.user?.id && leaderboard.length > 0) {
    const idx = leaderboard.findIndex((a) => a.userId === session.user.id || a.user?.userId === session.user.id)
    if (idx !== -1) userRank = idx + 1
  }

  const handleSertifikatYuklabOlish = async () => {
    if (!userAttempt?.certId) {
      toast.error('Sertifikat topilmadi')
      return
    }
    setPdfYuklanmoqda(true)
    try {
      const certData = {
        certId: userAttempt.certId,
        fullName: session?.user?.name || session?.user?.fullName || session?.user?.username || 'Ishtirokchi',
        fan: 'Mavsumiy Hamkorlik — DTM sinov testi',
        reason: partnership.certReason || 'AlchemIQ va JDA Kimyo tomonidan tashkil etilgan DTM SINOV TESTIDA yuqori natija ko\'rsatganligi uchun taqdim etiladi.',
        score: userAttempt.score || 0,
        percentage: userAttempt.percentage || 0,
        issuedAt: userAttempt.completedAt || new Date(),
        rank: userRank,
        seals: {
          partnerName: partnership.partnerName,
          partnerSignName: partnership.partnerSignName,
          rank: userRank
        }
      }
      await sertifikatPDFYuklab(certData, userRank)
      toast.success('Sertifikat muvaffaqiyatli yuklab olindi!')
    } catch (err) {
      console.error(err)
      toast.error('Sertifikatni yuklashda xatolik yuz berdi')
    } finally {
      setPdfYuklanmoqda(false)
    }
  }

  // Agar test jarayoni ketayotgan bo'lsa yoki e'lon qilinmagan urinish bo'lsa
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
            <Link href="/" className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              JDA KIMYO
            </Link>
            <span className="text-purple-700 font-bold">✕</span>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-400">
              <Ikon nom="hamkor" olcham={15} />
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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HERO KARTASI */}
        <div className="bg-slate-900/80 border border-purple-800/50 rounded-3xl p-6 sm:p-8 text-center space-y-5 relative overflow-hidden shadow-2xl">
          {/* Hamkorlik Badji & Holat */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Ikon nom="hamkor" olcham={15} />
              <span>{partnership.partnerName} & JDA Kimyo Hamkorligi</span>
            </div>

            <div className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
              partnership.isAnnounced
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                partnership.isAnnounced ? 'bg-purple-400' : isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span>{partnership.isAnnounced ? "NATIJALAR E'LON QILINGAN" : isActive ? "SINOV OCHIQ" : isExpired ? "YAKUNLANGAN" : "TEZ ORADA"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {partnership.title}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
              {partnership.certReason || partnership.description}
            </p>
          </div>

          {/* Sinov xarakteristikalari */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto text-xs text-purple-300">
            <div className="p-2.5 rounded-xl bg-black/40 border border-purple-800/40">
              <span className="text-[10px] text-purple-400 block">Savollar soni</span>
              <strong className="text-sm text-white font-bold">30 ta</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-purple-800/40">
              <span className="text-[10px] text-purple-400 block">Vaqt chegarasi</span>
              <strong className="text-sm text-amber-400 font-bold">{partnership.timeLimitMin} daqiqa</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-purple-800/40">
              <span className="text-[10px] text-purple-400 block">O&apos;tish bali</span>
              <strong className="text-sm text-green-400 font-bold">{partnership.minPassPercent}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-purple-800/40">
              <span className="text-[10px] text-purple-400 block">Mukofot</span>
              <strong className="text-sm text-amber-300 font-bold">Rasmiy Sertifikat</strong>
            </div>
          </div>

          {/* AMAL VA NATIJALAR BO'LIMI */}
          <div className="pt-2">
            {/* 1-HOLAT: Natijalar e'lon qilingan va foydalanuvchi test ishlagan */}
            {partnership.isAnnounced && hasSubmitted && userAttempt ? (
              <div className="max-w-md mx-auto space-y-4">
                {userAttempt.passed ? (
                  /* O'TGAN FOYDALANUVCHILAR UCHUN TABRIKLASH */
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-900 to-amber-950/30 border-2 border-amber-400/80 shadow-2xl text-center space-y-3.5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                      <Ikon nom="kubok" olcham={24} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                        {userRank === 1 ? "🥇 1-O'RIN (Oltin medal sohibi)" : userRank === 2 ? "🥈 2-O'RIN (Kumush medal sohibi)" : userRank === 3 ? "🥉 3-O'RIN (Bronza medal sohibi)" : "Sinovdan Muvaffaqiyatli O'tdingiz"}
                      </span>
                      <h3 className="text-lg font-black text-white">
                        Tabriklaymiz! Natijangiz: {userAttempt.percentage}% ({userAttempt.score} ball)
                      </h3>
                      <p className="text-xs text-purple-200">
                        Siz DTM sinov testidan a&apos;lo natija bilan o&apos;tdingiz va rasmiy sertifikat bilan taqdirlandingiz!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSertifikatYuklabOlish}
                      disabled={pdfYuklanmoqda}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Ikon nom="sertifikat" olcham={18} />
                      <span>{pdfYuklanmoqda ? 'PDF Tayyorlanmoqda...' : 'Sertifikatni Yuklab Olish (PDF)'}</span>
                    </button>
                  </div>
                ) : (
                  /* O'TMAGAN FOYDALANUVCHILAR UCHUN OMAD TILASH */
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-800/60 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-purple-900/40 text-purple-300 flex items-center justify-center border border-purple-700/50">
                      <Ikon nom="soat" olcham={22} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wide">
                        Natija: {userAttempt.percentage}% ({userAttempt.score} ball) · O&apos;tish bali: {partnership.minPassPercent}%
                      </span>
                      <h3 className="text-base font-bold text-white">
                        Keyingi Sinovlarda Omad Tilaymiz!
                      </h3>
                      <p className="text-xs text-purple-300 max-w-sm mx-auto leading-relaxed">
                        Afsuski, bu safar ball sertifikat olish uchun yetarli bo&apos;lmadi. Bilim olishdan to&apos;xtamang, navbatdagi olimpiada va sinovlarda albatta yuqori o&apos;rinlarni egallaysiz!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : !isAuthenticated ? (
              /* 2-HOLAT: Kirilmagan */
              <div className="max-w-sm mx-auto space-y-2.5">
                <Link
                  href={`/register?callbackUrl=/hamkorlik/${slug}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Ikon nom="qosh" olcham={18} qalin={2.5} />
                  <span>Ro&apos;yxatdan O&apos;tish</span>
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-xs text-purple-300">
                  <span>Hisobingiz bormi?</span>
                  <Link
                    href={`/login?callbackUrl=/hamkorlik/${slug}`}
                    className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1"
                  >
                    <Ikon nom="chiqish" olcham={12} />
                    <span>Kirish</span>
                  </Link>
                </div>
              </div>
            ) : !isActive || partnership.isAnnounced ? (
              /* 3-HOLAT: Test yakunlangan, lekin o'quvchi test ishlamagan */
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
                <Ikon nom="ogohlantirish" olcham={16} className="text-amber-400" />
                <span>Ushbu DTM sinov testi yakunlangan. Natijalar quyida e&apos;lon qilingan.</span>
              </div>
            ) : (
              /* 4-HOLAT: Test ochiq va foydalanuvchi ishlashi mumkin */
              <button
                type="button"
                onClick={() => setTestBoshlandi(true)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base shadow-2xl hover:scale-105 transition-transform"
              >
                <Ikon nom="kolba" olcham={20} />
                <span>Sinov Testini Boshlash (30 ta savol)</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLAR (NATIJALAR & REYTING & QOIDALAR) */}
        <div className="space-y-4">
          <div className="flex border-b border-purple-800/50 gap-2">
            {partnership.isAnnounced && (
              <button
                onClick={() => setActiveTab('natijalar')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'natijalar' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-300'
                }`}
              >
                <Ikon nom="kubok" olcham={16} />
                <span>Top G&apos;oliblar va Reyting ({leaderboard.length})</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('haqida')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'haqida' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-300'
              }`}
            >
              <Ikon nom="kitob" olcham={16} />
              <span>Sinov Qoidalari</span>
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
                <li>Umumiy ajratilgan vaqt: <strong>{partnership.timeLimitMin} daqiqa</strong>.</li>
                <li>Kamida <strong>{partnership.minPassPercent}%</strong> to&apos;plagan ishtirokchilarga <strong>{partnership.partnerName} va JDA Kimyo</strong> rasmiy QR-kodli DTM sertifikati taqdim etiladi.</li>
                <li>Top 3 ta eng yuqori natija ko&apos;rsatgan ishtirokchilar sertifikatiga <strong>I, II va III darajali maxsus medal muhrlanadi</strong>.</li>
              </ul>
            </div>
          )}

          {activeTab === 'natijalar' && (
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
                          II
                        </span>
                        <strong className="text-white text-xs block truncate">{leaderboard[1]?.user?.fullName || leaderboard[1]?.user?.username}</strong>
                        <span className="text-slate-300 font-mono text-xs font-bold block">{leaderboard[1]?.score} ball ({leaderboard[1]?.percentage}%)</span>
                      </div>

                      {/* 1-o'rin (Oltin) */}
                      <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-yellow-500/20 border-2 border-amber-400 text-center space-y-2 -translate-y-2 order-2 sm:order-2 shadow-lg shadow-amber-500/10">
                        <span className="w-10 h-10 mx-auto rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                          I
                        </span>
                        <strong className="text-amber-300 text-sm block truncate">{leaderboard[0]?.user?.fullName || leaderboard[0]?.user?.username}</strong>
                        <span className="text-amber-300 font-mono text-sm font-extrabold block">{leaderboard[0]?.score} ball ({leaderboard[0]?.percentage}%)</span>
                      </div>

                      {/* 3-o'rin (Bronza) */}
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-900/60 text-center space-y-2 order-3 sm:order-3">
                        <span className="w-8 h-8 mx-auto rounded-full bg-amber-700 text-amber-100 font-bold flex items-center justify-center text-xs">
                          III
                        </span>
                        <strong className="text-white text-xs block truncate">{leaderboard[2]?.user?.fullName || leaderboard[2]?.user?.username}</strong>
                        <span className="text-amber-400/80 font-mono text-xs font-bold block">{leaderboard[2]?.score} ball ({leaderboard[2]?.percentage}%)</span>
                      </div>
                    </div>
                  )}

                  {/* TO'LIQ REYTING JADVALI */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-purple-800/60 text-purple-400 font-semibold uppercase text-[10px]">
                          <th className="py-2.5 px-3">O&apos;rin</th>
                          <th className="py-2.5 px-3">Ishtirokchi</th>
                          <th className="py-2.5 px-3 text-center">Ball</th>
                          <th className="py-2.5 px-3 text-center">Foiz</th>
                          <th className="py-2.5 px-3 text-right">Sertifikat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/30">
                        {leaderboard.map((attempt, index) => {
                          const isCurrentUser = session?.user?.id && (attempt.userId === session.user.id || attempt.user?.userId === session.user.id)
                          const rank = index + 1
                          return (
                            <tr key={attempt.id || index} className={`hover:bg-purple-950/30 transition-colors ${
                              isCurrentUser ? 'bg-amber-500/10 font-bold' : ''
                            }`}>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  rank === 1 ? 'bg-amber-400 text-slate-950' :
                                  rank === 2 ? 'bg-slate-300 text-slate-950' :
                                  rank === 3 ? 'bg-amber-700 text-amber-100' :
                                  'bg-purple-900/40 text-purple-300'
                                }`}>
                                  {rank === 1 ? 'I' : rank === 2 ? 'II' : rank === 3 ? 'III' : rank}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-white">
                                <span>{attempt.user?.fullName || attempt.user?.username || 'Ishtirokchi'}</span>
                                {isCurrentUser && (
                                  <span className="ml-2 text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">Siz</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center text-amber-300 font-mono font-bold">
                                {attempt.score} / 30
                              </td>
                              <td className="py-3 px-3 text-center font-mono">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  attempt.percentage >= 90 ? 'bg-green-500/20 text-green-300' :
                                  attempt.percentage >= 75 ? 'bg-amber-500/20 text-amber-300' :
                                  'bg-red-500/20 text-red-300'
                                }`}>
                                  {attempt.percentage}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {attempt.certId ? (
                                  <Link
                                    href={`/sertifikat/verify/${attempt.certId}`}
                                    target="_blank"
                                    className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px]"
                                  >
                                    {attempt.certId}
                                  </Link>
                                ) : (
                                  <span className="text-purple-500">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
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
