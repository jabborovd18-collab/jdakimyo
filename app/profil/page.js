"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import DailyMissions from '@/components/DailyMissions'
import DailyQuoteCard from '@/components/DailyQuoteCard'
import PlantWidget from '@/components/PlantWidget'
import ProfilPostlar from '@/components/ProfilPostlar'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import { PremiumAurora, PremiumHalqa, PremiumYorliq } from '@/components/PremiumProfil'
import EmailTasdiqlash from '@/components/EmailTasdiqlash'
import ProfilHamkorlikBanner from '@/components/ProfilHamkorlikBanner'
import Ikon from '@/components/Ikon'
import { sana } from '@/lib/sana'
import { daraja, darajaHolati } from '@/lib/daraja'
import { uslubniTop } from '@/lib/premium'
import { keshlaVaQoll, oxirgiQollashVaqti } from '@/lib/interfeys'
import {
  keshdanProfilniOl,
  profilniYuklabOl,
  profilKeshgaObuna,
  profilKeshUserYangila,
} from '@/lib/profil-kesh'

const FETCH_TIMEOUT_MS = 35000

export default function ProfilDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState(() => keshdanProfilniOl(null))
  const [isLoading, setIsLoading] = useState(() => !keshdanProfilniOl(null)?.user)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  // Tezkor Bio tahrirlash holati
  const [bioTahrir, setBioTahrir] = useState(false)
  const [bioMatn, setBioMatn] = useState('')
  const [bioSaqlanmoqda, setBioSaqlanmoqda] = useState(false)

  // Session tayyor bo'lganda kesh yoki session zaxirasidan 0ms da ko'rsatish
  useEffect(() => {
    if (!profile?.user && session?.user) {
      const zaxira = keshdanProfilniOl(session.user)
      if (zaxira?.user) {
        setProfile(zaxira)
        setIsLoading(false)
      }
    }
  }, [session?.user, profile?.user])

  // Umumiy profil keshidagi o'zgarishlarni kuzatib borish
  useEffect(() => {
    return profilKeshgaObuna((yangiKesh) => {
      if (yangiKesh?.user) {
        setProfile(yangiKesh)
        setIsLoading(false)
        setError('')
      }
    })
  }, [])

  const fetchProfile = useCallback(async (qoldaYangilash = false) => {
    const joriy = keshdanProfilniOl(session?.user)
    if (joriy?.user) {
      setProfile((prev) => prev?.user ? prev : joriy)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }

    setIsRefreshing(true)
    setError('')
    const boshlandi = Date.now()

    try {
      const data = await profilniYuklabOl({
        majburiy: true,
        sessionUser: session?.user,
        timeoutMs: FETCH_TIMEOUT_MS,
      })

      if (!data?.user) {
        throw new Error("Profil ma'lumotlari to'liq emas")
      }

      setProfile(data)
      if (oxirgiQollashVaqti() <= boshlandi && data.user.interfaceSettings) {
        keshlaVaQoll(data.user.interfaceSettings)
      }
      if (qoldaYangilash) {
        toast.success('Profil yangilandi')
      }
    } catch (err) {
      console.error('[Profile Fetch Error]:', err)
      const xabar =
        err.name === 'AbortError'
          ? "Server javob berishga ko'p vaqt oldi."
          : err.message || "Profilni yuklab bo'lmadi"

      const mavjud = keshdanProfilniOl(session?.user)
      if (mavjud?.user) {
        setProfile((prev) => prev?.user ? prev : mavjud)
        if (qoldaYangilash) {
          toast.error(xabar)
        }
      } else {
        setError(xabar)
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [session?.user])

  useEffect(() => {
    fetchProfile(false)
  }, [fetchProfile])

  const nusxala = async (matn, sarlavha) => {
    try {
      await navigator.clipboard.writeText(matn)
      toast.success(`${sarlavha} nusxalandi: ${matn}`)
    } catch {
      toast.error('Nusxalab bo‘lmadi')
    }
  }

  const profilniUlashish = async (userObj) => {
    if (typeof window === 'undefined' || !userObj) return
    const havola = `${window.location.origin}/profil/${userObj.userId || userObj.username}`
    const ismMatn = userObj.fullName || userObj.username
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ismMatn} — JDA KIMYO profili`,
          text: `${ismMatn} (@${userObj.username}) ning JDA KIMYO platformasidagi profili`,
          url: havola,
        })
        return
      } catch {
        // foydalanuvchi bekor qilgan bo'lsa yoki xato bo'lsa, nusxalashga o'tamiz
      }
    }
    try {
      await navigator.clipboard.writeText(havola)
      toast.success('Profil havolasi nusxalandi!')
    } catch {
      toast.error('Havolani nusxalab bo‘lmadi')
    }
  }

  const bioSaqlash = async (e) => {
    if (e) e.preventDefault()
    const tozaBio = bioMatn.trim().slice(0, 500)
    setBioSaqlanmoqda(true)
    try {
      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: tozaBio }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Bioni saqlab bo'lmadi")

      profilKeshUserYangila({ bio: tozaBio })
      setProfile((prev) =>
        prev?.user ? { ...prev, user: { ...prev.user, bio: tozaBio } } : prev
      )
      setBioTahrir(false)
      toast.success('Bio saqlandi!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBioSaqlanmoqda(false)
    }
  }

  if (isLoading && !profile?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Profil ma{"'"}lumotlari yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (!profile?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="font-bold text-base text-[var(--v3-matn)]">Profil yuklanmadi</h2>
          {error && <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{error}</p>}
          <button
            onClick={() => fetchProfile(true)}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
          >
            <Ikon nom="qayta" olcham={14} />
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  const { user, quizResults = [], counts = {}, aqlliXulosa = null } = profile
  const currentStreak = user.currentStreak || 0
  const starsCount = user.stars || 0

  const userDaraja = daraja(starsCount)
  const dHolat = darajaHolati(starsCount)

  const ism = user.fullName || user.username || 'Foydalanuvchi'
  const boshHarf = (ism[0] || 'U').toUpperCase()

  // Profil to'liqligi hisob-kitobi
  const toliqlikQadamlari = [
    {
      id: 'fullName',
      bajarildi: Boolean(user.fullName && user.fullName.trim().length >= 2),
      yorliq: "+ To'liq ism",
      href: '/profil/sozlama?bolim=personal',
    },
    {
      id: 'avatar',
      bajarildi: Boolean(user.avatar),
      yorliq: '+ Profil rasmi',
      href: '/profil/sozlama?bolim=personal',
    },
    {
      id: 'bio',
      bajarildi: Boolean(user.bio && user.bio.trim().length > 0),
      yorliq: '+ Bio yozish',
      amal: () => {
        setBioMatn(user.bio || '')
        setBioTahrir(true)
      },
    },
    {
      id: 'academic',
      bajarildi: Boolean(user.university || user.specialty || user.academicDegree),
      yorliq: "+ O'quv yurti",
      href: '/profil/sozlama?bolim=academic',
    },
    {
      id: 'social',
      bajarildi: Boolean(user.telegram || user.instagram || user.github || user.linkedin),
      yorliq: '+ Telegram / tarmoq',
      href: '/profil/sozlama?bolim=social',
    },
    {
      id: 'email',
      bajarildi: Boolean(user.emailVerified),
      yorliq: '+ Email tasdiqlash',
      href: '/profil/sozlama?bolim=security',
    },
  ]
  const bajarilganSoni = toliqlikQadamlari.filter((q) => q.bajarildi).length
  const toliqlikFoiz = Math.round((bajarilganSoni / toliqlikQadamlari.length) * 100)
  const kamchiliklar = toliqlikQadamlari.filter((q) => !q.bajarildi)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Email Tasdiqlash ogohlantirishi */}
      <EmailTasdiqlash onVerified={() => fetchProfile(true)} />

      {/* ═══ MILLIY SERTIFIKAT VA RASCH DIAGNOSTIKASI BANNERI ═══ */}
      <ProfilHamkorlikBanner />

      {/* ═══ HERO SECTION ═══ */}
      <div className="v3-panel-karta p-4 sm:p-8 relative overflow-hidden space-y-4 sm:space-y-6">
        <PremiumAurora korinsinmi={user.isVerified} uslub={user.premiumUslub} />

        {/* Yuqori o'ng burchak: tezkor fon sinxronizatsiya / yangilash tugmasi */}
        <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fetchProfile(true)}
            disabled={isRefreshing}
            title="Profil ma'lumotlarini yangilash"
            className="v3-tugma text-[11px] py-1 px-2.5 inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 disabled:opacity-50"
          >
            <Ikon nom="qayta" olcham={12} className={isRefreshing ? 'animate-spin text-[var(--v3-urgu)]' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Yangilanmoqda...' : 'Yangilash'}</span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Mobilda Avatar va Ism/Teglar yonma-yon, kompyuterda klassik */}
          <div className="flex items-center gap-3.5 sm:gap-0 w-full sm:w-auto pr-12 sm:pr-0">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <PremiumHalqa korinsinmi={user.isVerified} uslub={user.premiumUslub}>
                <div
                  className={`w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-[var(--v3-yuza-2)] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[var(--v3-urgu)] overflow-hidden shadow-lg ${
                    user.isVerified ? '' : 'border-2 border-[var(--v3-urgu)]'
                  }`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={ism} className="w-full h-full object-cover" />
                  ) : (
                    boshHarf
                  )}
                </div>
              </PremiumHalqa>
              <Link
                href="/profil/sozlama?bolim=personal"
                title="Profil rasmini o'zgartirish"
                className="absolute inset-0 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <Ikon nom="tahrir" olcham={18} />
              </Link>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 z-10 px-1.5 sm:px-2 py-0.5 rounded-md bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-mono font-bold text-[10px] sm:text-[11px] shadow-md">
                Lvl {userDaraja}
              </div>
            </div>

            {/* Mobilda ism va teglar avatar yonida ko'rinadi */}
            <div className="sm:hidden min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-bold tracking-tight text-[var(--v3-matn)] truncate">
                  {ism}
                </h1>
                <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="kichik" jonli />
                <PremiumYorliq korinsinmi={user.isVerified} uslub={user.premiumUslub} />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => nusxala(`@${user.username}`, 'Username')}
                  title="Nusxalash uchun bosing"
                  className="v3-tag v3-tag-ochiq text-[10px] py-0.5 px-2 inline-flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span>@{user.username}</span>
                  <Ikon nom="nusxa" olcham={10} className="opacity-70" />
                </button>
                {user.userId && (
                  <button
                    type="button"
                    onClick={() => nusxala(String(user.userId), 'ID')}
                    title="ID raqamni nusxalash uchun bosing"
                    className="v3-tag v3-tag-yopiq text-[10px] py-0.5 px-2 font-mono font-bold inline-flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>ID: {user.userId}</span>
                    <Ikon nom="nusxa" olcham={10} className="opacity-70" />
                  </button>
                )}
                {user.academicDegree && (
                  <span className="v3-tag text-[10px] py-0.5 px-2 bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)]">
                    {user.academicDegree}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1 w-full space-y-2.5">
            <div className="hidden sm:flex items-center gap-2 flex-wrap pr-28">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
                {ism}
              </h1>
              <TasdiqBelgisi tasdiqlangan={user.isVerified} olcham="katta" jonli />
              <PremiumYorliq korinsinmi={user.isVerified} uslub={user.premiumUslub} />
            </div>

            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => nusxala(`@${user.username}`, 'Username')}
                title="Username'ni nusxalash"
                className="v3-tag v3-tag-ochiq text-[11px] inline-flex items-center gap-1.5 hover:border-[var(--v3-urgu)] active:scale-95 transition-all cursor-pointer"
              >
                <span>@{user.username}</span>
                <Ikon nom="nusxa" olcham={11} className="opacity-70" />
              </button>
              {user.userId && (
                <button
                  type="button"
                  onClick={() => nusxala(String(user.userId), 'ID')}
                  title="ID raqamni nusxalash"
                  className="v3-tag v3-tag-yopiq text-[11px] font-mono font-bold inline-flex items-center gap-1.5 hover:border-[var(--v3-urgu)] active:scale-95 transition-all cursor-pointer"
                >
                  <span>ID: {user.userId}</span>
                  <Ikon nom="nusxa" olcham={11} className="opacity-70" />
                </button>
              )}
              {user.academicDegree && (
                <span className="v3-tag text-[11px] bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)]">
                  {user.academicDegree}
                </span>
              )}
            </div>

            {(user.university || user.specialty || user.level || user.enrollmentYear || user.location) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--v3-xira)]">
                {user.university && (
                  <span className="inline-flex items-center gap-1 max-w-full truncate">
                    <Ikon nom="oliy" olcham={13} className="shrink-0 text-[var(--v3-urgu-2)]" />
                    <span className="truncate">
                      {user.university} {user.faculty ? `• ${user.faculty}` : ''}
                    </span>
                  </span>
                )}
                {user.specialty && (
                  <span className="inline-flex items-center gap-1">
                    <Ikon nom="kitob" olcham={13} className="shrink-0" />
                    <span>{user.specialty}</span>
                  </span>
                )}
                {(user.level || user.enrollmentYear) && (
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Ikon nom="taqvim" olcham={13} className="shrink-0" />
                    <span>
                      {[
                        user.level ? `${user.level}-kurs` : null,
                        user.enrollmentYear ? `${user.enrollmentYear}-yildan` : null,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  </span>
                )}
                {user.location && (
                  <span className="inline-flex items-center gap-1">
                    <Ikon nom="orin" olcham={13} className="shrink-0" />
                    <span>{user.location}</span>
                  </span>
                )}
              </div>
            )}

            {/* Tezkor Bio ko'rinishi va tahrirlagichi */}
            {bioTahrir ? (
              <form onSubmit={bioSaqlash} className="max-w-xl space-y-2 pt-1">
                <textarea
                  rows={2}
                  maxLength={500}
                  value={bioMatn}
                  onChange={(e) => setBioMatn(e.target.value)}
                  placeholder="O'zingiz haqingizda qisqacha bio yoki status yozing..."
                  className="v3-kiritish text-xs sm:text-sm py-2 px-3 resize-none"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[var(--v3-xira)]">
                    {bioMatn.length}/500
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBioTahrir(false)}
                      disabled={bioSaqlanmoqda}
                      className="v3-tugma text-xs py-1 px-3"
                    >
                      Bekor
                    </button>
                    <button
                      type="submit"
                      disabled={bioSaqlanmoqda}
                      className="v3-tugma v3-tugma-asosiy text-xs py-1 px-3.5 font-bold"
                    >
                      {bioSaqlanmoqda ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </div>
              </form>
            ) : user.bio ? (
              <div className="group flex items-start gap-2 max-w-2xl">
                <p className="text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
                  {user.bio}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBioMatn(user.bio || '')
                    setBioTahrir(true)
                  }}
                  title="Bioni tezkor tahrirlash"
                  className="shrink-0 p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-urgu)] hover:bg-[var(--v3-yuza-2)] opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                >
                  <Ikon nom="tahrir" olcham={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setBioMatn('')
                  setBioTahrir(true)
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--v3-xira)] hover:text-[var(--v3-urgu)] transition-colors"
              >
                <Ikon nom="qosh" olcham={12} />
                <span>Qisqacha bio yoki status qo{"'"}shish</span>
              </button>
            )}

            {/* Daraja Progress Bar */}
            <div className="pt-2 max-w-lg space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--v3-urgu)] font-bold">
                  {userDaraja}-Daraja
                </span>
                <span className="text-[var(--v3-xira)]">
                  {dHolat.joriy} / {dHolat.kerak} yulduz ({dHolat.foiz}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--v3-fon-2)] overflow-hidden border border-[var(--v3-chiziq)]">
                <div
                  className="h-full bg-[var(--v3-urgu)] transition-all duration-500 rounded-full"
                  style={{ width: `${dHolat.foiz}%` }}
                />
              </div>
            </div>

            {/* Tezkor havolalar */}
            <div className="flex flex-wrap gap-2 pt-2">
              {user.userId && (
                <Link
                  href={`/profil/${user.userId}`}
                  className="v3-tugma text-xs py-1.5 px-3"
                >
                  <Ikon nom="odam" olcham={13} />
                  Ochiq profilim
                </Link>
              )}
              <button
                type="button"
                onClick={() => profilniUlashish(user)}
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="ulashish" olcham={13} />
                Ulashish
              </button>
              <Link
                href="/chat"
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="xabar" olcham={13} />
                Xabarlar
              </Link>
              <Link
                href="/profil/sozlama"
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="sozlama" olcham={13} />
                Tahrirlash
              </Link>
              <Link
                href="/profil/maxfiylik"
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="qalqon" olcham={13} />
                Maxfiylik
              </Link>
              {user.isVerified && (
                <Link
                  href="/profil/sozlama#premium-bezak"
                  className="v3-tugma text-xs py-1.5 px-3 border-[var(--v3-urgu)]/45 text-[var(--v3-urgu)]"
                >
                  <Ikon nom="palitra" olcham={13} />
                  Bezak: {uslubniTop(user.premiumUslub).nom}
                </Link>
              )}
              {user.isTeacher && (
                <Link
                  href="/ustoz"
                  className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold"
                >
                  <Ikon nom="ustoz" olcham={13} />
                  Ustoz paneli
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PROFIL TO'LIQLIGI KO'RSATKICHI (100% dan kam bo'lganda) ═══ */}
      {toliqlikFoiz < 100 && (
        <div className="v3-panel-karta p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-dashed">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-2.5 text-xs">
              <span className="font-bold text-[var(--v3-matn)] inline-flex items-center gap-1.5">
                <Ikon nom="tasdiq" olcham={14} className="text-[var(--v3-urgu)]" />
                Profil to{"'"}liqligi: {toliqlikFoiz}%
              </span>
              <span className="text-[11px] text-[var(--v3-xira)] font-mono">
                ({bajarilganSoni}/{toliqlikQadamlari.length} to{"'"}ldirilgan)
              </span>
            </div>
            <div className="w-full sm:max-w-xs h-1.5 rounded-full bg-[var(--v3-fon-2)] overflow-hidden border border-[var(--v3-chiziq)]">
              <div
                className="h-full bg-[var(--v3-urgu)] transition-all duration-500 rounded-full"
                style={{ width: `${toliqlikFoiz}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {kamchiliklar.map((item) =>
              item.amal ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.amal}
                  className="v3-tag v3-tag-ochiq text-[11px] py-1 px-2.5 hover:border-[var(--v3-urgu)] transition-colors cursor-pointer"
                >
                  {item.yorliq}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="v3-tag v3-tag-ochiq text-[11px] py-1 px-2.5 hover:border-[var(--v3-urgu)] transition-colors"
                >
                  {item.yorliq}
                </Link>
              )
            )}
          </div>
        </div>
      )}

      {/* ═══ STATS GRID ═══ */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <Link
          href="/profil/reytingim"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Yulduzlar</span>
            <Ikon nom="yulduz" olcham={13} className="text-[var(--v3-urgu)] shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-base sm:text-xl font-bold font-mono text-[var(--v3-matn)]">{starsCount}</div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Reyting →
            </span>
          </div>
        </Link>

        <Link
          href="/profil/sovgalar"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Valyuta</span>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <Ikon nom="tanga" olcham={13} className="text-amber-400" />
              <Ikon nom="olmos" olcham={12} className="text-cyan-400" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-xs sm:text-base font-bold font-mono text-[var(--v3-matn)] flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="inline-flex items-center gap-0.5 text-amber-400" title="Tangalar">
                {user.coins || 0}
                <Ikon nom="tanga" olcham={12} />
              </span>
              <span className="inline-flex items-center gap-0.5 text-cyan-400" title="Olmoslar">
                {user.gems || 0}
                <Ikon nom="olmos" olcham={11} />
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Sovg{"'"}a →
            </span>
          </div>
        </Link>

        <Link
          href="/profil/faoliyat"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Streak</span>
            <Ikon nom="olov" olcham={13} className="text-orange-400 shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-base sm:text-xl font-bold font-mono text-orange-400">{currentStreak} kun</div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Grafik →
            </span>
          </div>
        </Link>

        <Link
          href="/profil/quizlar"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Testlar</span>
            <Ikon nom="quiz" olcham={13} className="text-[var(--v3-urgu-2)] shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-base sm:text-xl font-bold font-mono text-[var(--v3-matn)]">{counts.quizzes || 0}</div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Boshqarish →
            </span>
          </div>
        </Link>

        <Link
          href="/profil/sertifikatlar"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Sertifikat</span>
            <Ikon nom="fayl" olcham={13} className="shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-base sm:text-xl font-bold font-mono text-[var(--v3-matn)]">{counts.certificates || 0}</div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Ko{"'"}rish →
            </span>
          </div>
        </Link>

        <Link
          href="/profil/dostlar"
          className="v3-panel-karta p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[var(--v3-urgu)]/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[10px] sm:text-[11px] truncate">Do{"'"}stlar</span>
            <Ikon nom="odamlar" olcham={13} className="shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-1 mt-1">
            <div className="text-base sm:text-xl font-bold font-mono text-[var(--v3-matn)]">{counts.friends || 0}</div>
            <span className="hidden sm:inline text-[10px] text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors">
              Ro{"'"}yxat →
            </span>
          </div>
        </Link>
      </div>

      {/* ═══ AQLLI TAHLIL VA BOSHQARUV ═══ */}
      {aqlliXulosa && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="v3-panel-karta p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--v3-chiziq)]">
              <div className="font-bold text-xs text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="chaqmoq" olcham={15} className="text-[var(--v3-urgu)]" />
                <span>Kunlik maqsad va MS natijalar</span>
              </div>
              <Link
                href="/profil/sozlama?bolim=learning"
                className="text-[11px] text-[var(--v3-urgu)] hover:underline"
              >
                Maqsad →
              </Link>
            </div>

            {aqlliXulosa.kunlikMaqsad && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--v3-xira)]">
                    Bugun: {aqlliXulosa.kunlikMaqsad.savollar}/{aqlliXulosa.kunlikMaqsad.savolMaqsad} savol · {aqlliXulosa.kunlikMaqsad.daqiqalar}/{aqlliXulosa.kunlikMaqsad.daqiqaMaqsad} daq
                  </span>
                  <span className="font-mono font-bold text-[var(--v3-matn)]">
                    {aqlliXulosa.kunlikMaqsad.savolFoiz}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--v3-yuza-2)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${aqlliXulosa.kunlikMaqsad.savolFoiz}%`,
                      background: 'var(--v3-urgu)',
                    }}
                  />
                </div>
              </div>
            )}

            {aqlliXulosa.msXulosa && (
              <div className="pt-2 border-t border-[var(--v3-chiziq)] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {aqlliXulosa.msXulosa.engYaxshi ? (
                    <>
                      <div className="text-[11px] text-[var(--v3-xira)] truncate">
                        Eng yaxshi MS: {aqlliXulosa.msXulosa.engYaxshi.examName || aqlliXulosa.msXulosa.engYaxshi.slug}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs font-mono font-bold text-[var(--v3-matn)]">
                        <span className="v3-tag v3-tag-ochiq text-[11px]">
                          {aqlliXulosa.msXulosa.engYaxshi.daraja || '—'} · {aqlliXulosa.msXulosa.engYaxshi.shkalaBalli}
                        </span>
                        {aqlliXulosa.msXulosa.osish !== null && aqlliXulosa.msXulosa.osish !== 0 && (
                          <span className={aqlliXulosa.msXulosa.osish > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                            {aqlliXulosa.msXulosa.osish > 0 ? `+${aqlliXulosa.msXulosa.osish}` : aqlliXulosa.msXulosa.osish}
                          </span>
                        )}
                      </div>
                    </>
                  ) : aqlliXulosa.msXulosa.kutilayotganSoni > 0 ? (
                    <div className="text-xs text-amber-300 flex items-center gap-1.5">
                      <Ikon nom="vaqt" olcham={13} />
                      <span>{aqlliXulosa.msXulosa.kutilayotganSoni} ta MS sinov natijasi kutilmoqda</span>
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--v3-xira)]">
                      Hali Milliy Sertifikat sinovi topshirilmagan
                    </div>
                  )}
                </div>
                <Link
                  href="/profil/sertifikatlar?tab=ms"
                  className="v3-tugma text-[11px] py-1.5 px-2.5 shrink-0 inline-flex items-center gap-1"
                >
                  <Ikon nom="sertifikat" olcham={12} />
                  <span>Natijalar</span>
                </Link>
              </div>
            )}
          </div>

          <div className="v3-panel-karta p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--v3-chiziq)]">
              <div className="font-bold text-xs text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="qalqon" olcham={15} className="text-emerald-400" />
                <span>Xavfsizlik ({aqlliXulosa.xavfsizlik?.ball ?? 0}%)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Link href="/profil/loglar" className="text-[11px] text-[var(--v3-urgu)] hover:underline">
                  Loglar
                </Link>
                <Link href="/profil/sozlama" className="text-[11px] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]">
                  Sozlama →
                </Link>
              </div>
            </div>

            {Array.isArray(aqlliXulosa.tavsiyalar) && aqlliXulosa.tavsiyalar.length > 0 ? (
              <div className="space-y-1.5">
                {aqlliXulosa.tavsiyalar.slice(0, 3).map((t) => (
                  <Link
                    key={t.id}
                    href={t.href}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Ikon
                        nom={t.ikon}
                        olcham={14}
                        className={
                          t.daraja === 'ogohlantirish'
                            ? 'text-amber-400 shrink-0'
                            : 'text-[var(--v3-urgu)] shrink-0'
                        }
                      />
                      <span className="text-xs text-[var(--v3-matn)] truncate">{t.sarlavha}</span>
                    </div>
                    <span className="text-[11px] text-[var(--v3-urgu)] font-semibold shrink-0">
                      {t.tugmaMatn} →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 flex items-center gap-2 py-2">
                <Ikon nom="tasdiq" olcham={15} />
                <span>Barcha asosiy vazifalar va xavfsizlik holati joyida.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ WIDGETS SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantWidget />
        <DailyQuoteCard />
      </div>

      {/* Profil Postlari */}
      <ProfilPostlar />

      {/* Daily Missions */}
      <DailyMissions onStatsUpdate={fetchProfile} />

      {/* ═══ OXIRGI TEST NATIJALARI ═══ */}
      {quizResults.length > 0 && (
        <div className="v3-panel-karta p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
            <h2 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="quiz" olcham={16} />
              So{"'"}nggi va qadalgan testlar
            </h2>
            <Link href="/profil/quizlar" className="text-xs text-[var(--v3-urgu)] hover:underline font-semibold">
              Boshqarish / Barchasi →
            </Link>
          </div>

          <div className="divide-y divide-[var(--v3-chiziq)]">
            {quizResults.slice(0, 5).map(quiz => (
              <div key={quiz.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {quiz.isPinned && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Ikon nom="qadash" olcham={10} />
                        Qadalgan
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[var(--v3-matn)] truncate">{quiz.quizName}</span>
                  </div>
                  <div className="text-[10.5px] text-[var(--v3-xira)] font-mono mt-0.5 flex flex-wrap items-center gap-2">
                    {quiz.totalQuestions > 0 && (
                      <span>{quiz.score}/{quiz.totalQuestions} to{"'"}g{"'"}ri</span>
                    )}
                    <span>{sana(quiz.completedAt)}</span>
                  </div>
                </div>
                <div className={`text-base font-bold font-mono px-2.5 py-0.5 rounded-lg border shrink-0 ${
                  quiz.percentage >= 80 ? 'v3-tag-ochiq' :
                  quiz.percentage >= 60 ? 'v3-tag-yopiq' :
                  'bg-red-500/10 text-red-500 border-red-500/25'
                }`}>
                  {quiz.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
