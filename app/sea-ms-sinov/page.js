// app/sea-ms-sinov/page.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import MilliySertifikatTesti from '@/components/hamkorlik/MilliySertifikatTesti'
import Ikon from '@/components/Ikon'
import toast from 'react-hot-toast'

export default function SeaMsSinovSahifasi() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testBoshlandi, setTestBoshlandi] = useState(false)
  const [activeTab, setActiveTab] = useState('haqida') // 'haqida' | 'natijalar'

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

  const { partnership, leaderboard = [], hasSubmitted, userAttempt, savollar = [], isAdmin = false } = data

  // Foydalanuvchi roli — session va API dan tekshiriladi
  const userRole = session?.user?.role?.toLowerCase() || ''
  const isSuperAdmin = isAdmin || ['admin', 'superadmin', 'moderator'].includes(userRole)

  // Vaqt hisob-kitoblari (O'zbekiston vaqti)
  const now = new Date()
  const boshlanishVaqti = new Date(partnership.startsAt)
  const tugashVaqti = new Date(partnership.endsAt)

  // 100 minutlik qoida: 00:00 dan 100 minut oldin (22:20 da) yangi kirish yopiladi
  const yangiKirishYopilishVaqti = new Date(tugashVaqti.getTime() - 100 * 60 * 1000)

  const haliBoshlanmadi = !isSuperAdmin && now < boshlanishVaqti
  const qabulYopildi = !isSuperAdmin && now >= yangiKirishYopilishVaqti && now < tugashVaqti
  const butunlayTugadi = !isSuperAdmin && now >= tugashVaqti

  return (
    <main className="min-h-screen bg-[var(--v3-fon)] text-[var(--v3-matn)] pb-16 antialiased">
      {/* ═══ SUPER ADMIN OGOHLANTIRIShI ═══ */}
      {isSuperAdmin && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 shadow-inner">
          <span className="text-base">👑</span>
          <span>Super Admin Rejimi Faol: Siz testni muddatidan oldin xohlagancha yechib tekshirishingiz mumkin. Natijangiz umumiy hisobot va reytingga kirmaydi.</span>
        </div>
      )}

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative border-b border-[var(--v3-chiziq)] bg-gradient-to-b from-[var(--v3-yuza-2)] to-[var(--v3-fon)] pt-9 pb-11 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>🏆 SEA KIMYO & JDA KIMYO HAMKORLIGI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--v3-matn)] leading-tight">
            Milliy Sertifikat Sinov Testi #1
          </h1>

          <p className="text-sm sm:text-base text-[var(--v3-xira)] max-w-2xl mx-auto leading-relaxed">
            Haqiqiy Milliy Sertifikat standarti bo&apos;yicha 40 ta rasmiy savol: variantli testlar va ochiq masalalar. Ushbu sinov sertifikat bermaydi — asosiy maqsad bilimni sinash, mustahkamlash va haqiqiy imtihonga tayyorgarlikdir!
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
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
            {/* ═══ HOLAT VA HARAKAT KARTASI ═══ */}
            <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-6">
              {hasSubmitted && !isSuperAdmin ? (
                /* Topshirib bo'lgan bo'lsa */
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h2 className="text-xl font-bold">Siz testni topshirdingiz!</h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-md mx-auto leading-relaxed">
                    Natijangiz va to&apos;liq tahlil bugun soat <b>00:00 da</b> ushbu sahifada e&apos;lon qilinadi.
                  </p>
                </div>
              ) : haliBoshlanmadi ? (
                /* Hali 17:00 bo'lmagan bo'lsa */
                <div className="space-y-3">
                  <span className="text-3xl">⏳</span>
                  <h2 className="text-xl font-bold">Test soat 17:00 da ochiladi</h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)]">
                    Sinov O&apos;zbekiston vaqti bilan 6-sentyabr (Bugun, Yakshanba) soat 17:00 da boshlanadi. Sahifani yangilab turing!
                  </p>
                </div>
              ) : qabulYopildi ? (
                /* 22:20 dan keyin bo'lsa */
                <div className="space-y-3">
                  <span className="text-3xl">🛑</span>
                  <h2 className="text-xl font-bold">Sinovga Yangi Qabul Yopildi</h2>
                  <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-md mx-auto leading-relaxed">
                    Sinov muddati 100 daqiqa bo&apos;lgani sababli, yangi kirish soat <b>22:20 da</b> to&apos;xtatildi. Barcha natijalar soat <b>00:00 da</b> e&apos;lon qilinadi.
                  </p>
                </div>
              ) : !isAuthenticated ? (
                /* Tizimga kirmagan bo'lsa */
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-xl">
                    🔐
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base">Testni Boshlash Uchun Tizimga Kiring</h3>
                    <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                      Natijangiz adashmasligi va reytingda chiqishingiz uchun profilingizga kiring yoki 30 soniyada ro&apos;yxatdan o&apos;ting.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      href="/login?callbackUrl=/sea-ms-sinov"
                      className="flex-1 py-3 px-4 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold text-xs sm:text-sm shadow-lg hover:opacity-90 transition-all text-center"
                    >
                      Kirish
                    </Link>
                    <Link
                      href="/register?callbackUrl=/sea-ms-sinov"
                      className="flex-1 py-3 px-4 rounded-xl bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] font-bold text-xs sm:text-sm border border-[var(--v3-chiziq)] hover:bg-[var(--v3-chiziq)] transition-all text-center"
                    >
                      Ro&apos;yxatdan O&apos;tish
                    </Link>
                  </div>
                </div>
              ) : (
                /* Test hozir ochiq va boshlashga tayyor */
                <div className="space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
                    🧪
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--v3-matn)]">
                      {isSuperAdmin ? '👑 Super Admin Sinov Rejimi' : 'Sinov Testi Faol!'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                      {isSuperAdmin
                        ? "Siz tizim administratori sifatida barcha 40 ta savolni muddatidan oldin xohlagancha sinab ko'rishingiz mumkin. Natijangiz hisobot va reytingga kirmaydi."
                        : "Sizga 40 ta savol uchun 100 daqiqa vaqt beriladi. Faqat 1 marta topshirish mumkin."}
                    </p>
                  </div>
                  <button
                    onClick={() => setTestBoshlandi(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
                  >
                    🚀 {isSuperAdmin ? 'Testni Boshlash (Super Admin Sinovi)' : 'Testni Boshlash (100 daqiqa)'}
                  </button>
                </div>
              )}
            </div>

            {/* ═══ 1 OYLIK MARAFON JADVALI ═══ */}
            <div className="v3-panel-karta p-6 space-y-4 border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm sm:text-base">
                <Ikon nom="taqvim" olcham={18} />
                <span>Milliy Sertifikat Oylik Marafoni Jadvali:</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                Bir oy davomida har haftaning <b>Seshanba, Payshanba va Shanba</b> kunlari soat <b>17:00 da</b> yangi rasmiy sinov testlari o&apos;tkaziladi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border-2 border-emerald-500/40 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Bugun!</span>
                  <div className="font-bold text-xs sm:text-sm text-[var(--v3-matn)]">1-Sinov Testi</div>
                  <div className="text-[11px] sm:text-xs text-[var(--v3-xira)]">6-sentyabr (Bugun) 17:00</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Navbatdagi</span>
                  <div className="font-bold text-xs sm:text-sm text-[var(--v3-matn)]">2-Sinov Testi</div>
                  <div className="text-[11px] sm:text-xs text-[var(--v3-xira)]">8-sentyabr (Seshanba) 17:00</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Kelgusi</span>
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

            {/* ═══ NATIJALAR (00:00 dan keyin yoki isAnnounced bo'lganda) ═══ */}
            {partnership.isAnnounced && leaderboard.length > 0 && (
              <div className="v3-panel-karta p-6 space-y-4">
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
