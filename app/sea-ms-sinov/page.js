// app/sea-ms-sinov/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import MilliySertifikatTesti from '@/components/hamkorlik/MilliySertifikatTesti'
import Ikon from '@/components/Ikon'

export default function SeaMsSinovSahifasi() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testBoshlandi, setTestBoshlandi] = useState(false)
  const [activeTab, setActiveTab] = useState('haqida') // 'haqida' | 'natijalar'
  const [now, setNow] = useState(new Date())

  // BARCHA HOOKLAR TOP LEVELDA (Early returnlardan oldin)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const slug = 'sea-ms-sinov'

  const yukla = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/hamkorlik/${slug}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ma\'lumot yuklanmadi')
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

  // Foydalanuvchi roli — session va API dan tekshiriladi
  const userRole = session?.user?.role?.toLowerCase() || ''
  const username = session?.user?.username?.toLowerCase() || ''
  const email = session?.user?.email?.toLowerCase() || ''
  const isSuperAdmin = data?.isAdmin ||
    ['admin', 'superadmin', 'moderator'].includes(userRole) ||
    ['diyorbek_jabborov', 'jabborov', 'diyorbek'].includes(username) ||
    ['diyorbekjabborov84@gmail.com', 'jabborovd18@gmail.com', 'diyorbekjabborov12@gmail.com'].includes(email)

  // URL da adminTest=true parametri kelsa va superadmin bo'lsa, avtomatik testni boshlash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('adminTest=true') && isSuperAdmin) {
      setTestBoshlandi(true)
    }
  }, [isSuperAdmin])

  // EARLY RETURNLAR FAQAT HOOKLAR TUGAGANDAN SO'NG
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--v3-fon)] text-[var(--v3-matn)] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-spin">
            <Ikon nom="kolba" olcham={24} />
          </div>
          <p className="text-sm text-[var(--v3-xira)]">Sinov ma&apos;lumotlari yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[var(--v3-fon)] text-[var(--v3-matn)] flex items-center justify-center p-6">
        <div className="v3-panel-karta p-8 max-w-md w-full text-center space-y-4">
          <span className="text-4xl">⚠️</span>
          <h1 className="text-xl font-bold">Xatolik yuz berdi</h1>
          <p className="text-sm text-[var(--v3-xira)]">{error || 'Sinov topilmadi'}</p>
          <button
            onClick={yukla}
            className="px-4 py-2 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] text-xs font-bold"
          >
            Qayta urinish
          </button>
        </div>
      </main>
    )
  }

  const { partnership, leaderboard = [], hasSubmitted, userAttempt, savollar = [] } = data

  const boshlanishVaqti = new Date(partnership.startsAt)
  const tugashVaqti = new Date(partnership.endsAt)

  // 100 minutlik qoida: 00:00 dan 100 minut oldin (22:20 da) yangi kirish yopiladi
  const yangiKirishYopilishVaqti = new Date(tugashVaqti.getTime() - 100 * 60 * 1000)

  const haliBoshlanmadi = !isSuperAdmin && now < boshlanishVaqti
  const qabulYopildi = !isSuperAdmin && now >= yangiKirishYopilishVaqti && now < tugashVaqti
  const butunlayTugadi = !isSuperAdmin && now >= tugashVaqti

  // 17:00 gacha qolgan vaqt hisobi
  const ochilishFarqMs = Math.max(0, boshlanishVaqti.getTime() - now.getTime())
  const ochilishSoat = Math.floor(ochilishFarqMs / (1000 * 60 * 60))
  const ochilishMin = Math.floor((ochilishFarqMs % (1000 * 60 * 60)) / (1000 * 60))
  const ochilishSek = Math.floor((ochilishFarqMs % (1000 * 60)) / 1000)
  const ochilishTaymerMatni = `${ochilishSoat.toString().padStart(2, '0')}:${ochilishMin.toString().padStart(2, '0')}:${ochilishSek.toString().padStart(2, '0')}`

  return (
    <main className="min-h-screen bg-[var(--v3-fon)] text-[var(--v3-matn)] pb-16 antialiased">
      {/* ═══ SUPER ADMIN OGOHLANTIRIShI ═══ */}
      {isSuperAdmin && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 shadow-inner">
          <span className="text-base">👑</span>
          <span>Super Admin Rejimi Faol: Siz testni muddatidan oldin xohlagancha yechib tekshirishingiz mumkin. Natijangiz hisobot va umumiy reytingga kirmaydi.</span>
        </div>
      )}

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative border-b border-[var(--v3-chiziq)] bg-gradient-to-b from-[var(--v3-yuza-2)] via-[var(--v3-yuza)] to-[var(--v3-fon)] pt-8 pb-10 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>🏆 SEA KIMYO & JDA KIMYO HAMKORLIGI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--v3-matn)] leading-tight">
            Milliy Sertifikat Sinov Testi #1
          </h1>

          <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-2xl mx-auto leading-relaxed">
            Haqiqiy Milliy Sertifikat imtihoni standarti bo&apos;yicha 40 ta rasmiy savol: variantli testlar va ochiq masalalar. Ushbu sinov sertifikat bermaydi — asosiy maqsad bilimni sinash, mustahkamlash va imtihonga mukammal tayyorgarlikdir!
          </p>

          {/* Asosiy ko'rsatkichlar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <span className="v3-tag v3-tag-ochiq text-xs font-semibold">
              📝 40 ta savol
            </span>
            <span className="v3-tag v3-tag-ochiq text-xs font-semibold">
              ⏱️ 100 daqiqa
            </span>
            <span className="v3-tag v3-tag-yopiq text-xs font-semibold">
              🎯 Maqsad: Bilimni sinash
            </span>
            <span className="v3-tag v3-tag-yopiq text-xs font-semibold text-emerald-400">
              ⚡ Natijalar: Bugun 00:00 da
            </span>
          </div>
        </div>
      </section>

      {/* ═══ ASOSIY KONTENT ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* SUPER ADMIN TEZKOR BOSHLASH PANELI */}
        {isSuperAdmin && !testBoshlandi && (
          <div className="v3-panel-karta p-5 sm:p-6 border-2 border-amber-400/80 bg-amber-500/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 font-extrabold text-sm sm:text-base text-amber-300">
                <span>👑 Super Admin Boshqaruv Rejimi</span>
              </div>
              <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
                Siz muddatidan oldin barcha 40 ta savolni to&apos;liq ishlab, rasmlar va javoblarni tekshirishingiz mumkin.
              </p>
            </div>
            <button
              onClick={() => setTestBoshlandi(true)}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
            >
              <span>🚀 Testni Hoziroq Boshlash (Admin)</span>
            </button>
          </div>
        )}

        {/* Test jarayoni boshlangan bo'lsa */}
        {testBoshlandi ? (
          <MilliySertifikatTesti
            partnership={{ ...partnership, isAdmin: isSuperAdmin }}
            savollar={savollar}
            userAttempt={isSuperAdmin ? null : userAttempt}
            isLoggedIn={isAuthenticated}
          />
        ) : (
          <>
            {/* ═══ 1. ASOSIY HOLAT KARTASI ═══ */}
            {!isAuthenticated ? (
              /* A) TIZIMGA KIRMAGAN MEHMONLAR UCHUN (Hozir Telegramdan kirganlar darhol ko'radi) */
              <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-6 rounded-3xl border-2 border-amber-500/40 shadow-xl">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  🔐
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                    Sinovda Qatnashish Uchun Tizimga Kiring
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                    {haliBoshlanmadi ? (
                      <>
                        Sinov bugun soat <b>17:00 da</b> boshlanadi. Ungacha profilingizga kiring yoki 30 soniyada ro&apos;yxatdan o&apos;tib tayyor turing!
                      </>
                    ) : (
                      <>
                        Natijangiz serverda saqlanishi va Respublika reytingida chiqishingiz uchun tizimga kiring yoki yangi hisob oching.
                      </>
                    )}
                  </p>
                </div>

                {/* Hali 17:00 bo'lmagan bo'lsa — Mehmonlarga ham taymer chiqadi */}
                {haliBoshlanmadi && (
                  <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-[var(--v3-yuza-2)] border-2 border-amber-500/30 shadow-inner">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Sinov Boshlanishiga Qoldi:
                    </span>
                    <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-black text-amber-400">
                      <Ikon nom="soat" olcham={22} />
                      <span>{ochilishTaymerMatni}</span>
                    </div>
                  </div>
                )}

                {/* Kirish va Ro'yxatdan o'tish tugmalari — Yaqqol taktil tugmalar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto pt-2">
                  <Link
                    href="/login?callbackUrl=/sea-ms-sinov"
                    className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 border-2 border-blue-400/40 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🔑</span>
                    <div className="text-left">
                      <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold leading-none">
                        Menda hisob bor
                      </div>
                      <div className="text-base font-black text-white leading-tight mt-1">
                        Tizimga Kirish →
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/register?callbackUrl=/sea-ms-sinov"
                    className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 border-2 border-emerald-400/40 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                    <div className="text-left">
                      <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold leading-none">
                        Yangi o&apos;quvchilar
                      </div>
                      <div className="text-base font-black text-white leading-tight mt-1">
                        Ro&apos;yxatdan O&apos;tish →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ) : hasSubmitted && !isSuperAdmin ? (
              /* B) TOPSHIRIB BO'LGAN FOYDALANUVCHILAR UCHUN */
              <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-4 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl shadow-sm">
                  ✓
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                  Siz testni topshirdingiz!
                </h2>
                <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-md mx-auto leading-relaxed">
                  Sizning javoblaringiz qabul qilingan. Natijangiz va to&apos;liq tahlil bugun soat <b>00:00 da</b> ushbu sahifada e&apos;lon qilinadi.
                </p>
              </div>
            ) : haliBoshlanmadi ? (
              /* C) TIZIMGA KIRGAN, LEKIN HALI 17:00 BO'LMAGAN */
              <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-4 max-w-md mx-auto rounded-3xl border border-amber-500/30">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-sm animate-pulse">
                  ⏳
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-1">
                    ✓ Profilingizga kirdingiz: @{username || session?.user?.username || 'Foydalanuvchi'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                    Test soat 17:00 da avtomatik ochiladi
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                    Sahifani yangilash shart emas, taymer tugashi bilan test avtomatik faollashadi!
                  </p>
                </div>

                {/* Jonli Teskari Taymer Kartasi */}
                <div className="p-4 rounded-2xl bg-[var(--v3-yuza-2)] border-2 border-amber-500/40 shadow-inner flex flex-col items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Sinov Boshlanishiga Qoldi:
                  </span>
                  <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                    <Ikon nom="soat" olcham={22} />
                    <span>{ochilishTaymerMatni}</span>
                  </div>
                </div>
              </div>
            ) : qabulYopildi ? (
              /* D) 22:20 DAN KEYIN QABUL YOPILGANDA */
              <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-3 rounded-3xl">
                <span className="text-3xl">🛑</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                  Sinovga Yangi Qabul Yopildi
                </h2>
                <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-md mx-auto leading-relaxed">
                  Sinov muddati 100 daqiqa bo&apos;lgani sababli, yangi kirish soat <b>22:20 da</b> to&apos;xtatildi. Barcha natijalar soat <b>00:00 da</b> e&apos;lon qilinadi.
                </p>
              </div>
            ) : (
              /* E) HOZIR OCHIQ VA TIZIMGA KIRGAN */
              <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-6 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl shadow-sm">
                  🧪
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                    Sinov Testi Faol!
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                    Sizga 40 ta savol uchun 100 daqiqa vaqt beriladi. Har bir ishtirokchi faqat 1 marta topshirishi mumkin.
                  </p>
                </div>
                <button
                  onClick={() => setTestBoshlandi(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
                >
                  🚀 Testni Boshlash (100 daqiqa)
                </button>
              </div>
            )}

            {/* ═══ 2. 1 OYLIK MARAFON JADVALI ═══ */}
            <div className="v3-panel-karta p-5 sm:p-6 space-y-4 border border-blue-500/30 bg-blue-500/5 rounded-3xl">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm sm:text-base">
                <Ikon nom="taqvim" olcham={18} />
                <span>Milliy Sertifikat Oylik Marafoni Jadvali:</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                Bir oy davomida har haftaning <b>Seshanba, Payshanba va Shanba</b> kunlari soat <b>17:00 da</b> yangi rasmiy sinov testlari o&apos;tkaziladi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[var(--v3-yuza)] border-2 border-emerald-500/40 text-center space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Bugun!</span>
                  <div className="font-bold text-xs sm:text-sm text-[var(--v3-matn)]">1-Sinov Testi</div>
                  <div className="text-[11px] sm:text-xs text-[var(--v3-xira)]">6-sentyabr (Bugun) 17:00</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">Navbatdagi</span>
                  <div className="font-bold text-xs sm:text-sm text-[var(--v3-matn)]">2-Sinov Testi</div>
                  <div className="text-[11px] sm:text-xs text-[var(--v3-xira)]">8-sentyabr (Seshanba) 17:00</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider">Kelgusi</span>
                  <div className="font-bold text-xs sm:text-sm text-[var(--v3-matn)]">3-Sinov Testi</div>
                  <div className="text-[11px] sm:text-xs text-[var(--v3-xira)]">10-sentyabr (Payshanba) 17:00</div>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://t.me/AlchemistryIQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  <Ikon nom="telegram" olcham={16} />
                  <span>SEA Kimyo Telegram kanali (@AlchemistryIQ)</span>
                </a>
              </div>
            </div>

            {/* ═══ 3. NATIJALAR (00:00 dan keyin yoki isAnnounced bo'lganda) ═══ */}
            {partnership.isAnnounced && leaderboard.length > 0 && (
              <div className="v3-panel-karta p-6 space-y-4 rounded-3xl">
                <h3 className="font-bold text-base text-[var(--v3-matn)] flex items-center gap-2">
                  <span>🏆 Respublika Bo&apos;yicha Top Natijalar</span>
                </h3>

                <div className="divide-y divide-[var(--v3-chiziq)] text-xs">
                  {leaderboard.map((item, idx) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] ${
                          idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'text-[var(--v3-xira)]'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-[var(--v3-matn)]">
                          {item.user?.fullName || item.user?.username || 'Talaba'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-emerald-400 font-bold">{item.score} / 40</span>
                        <span className="text-[var(--v3-xira)] text-[11px]">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}


