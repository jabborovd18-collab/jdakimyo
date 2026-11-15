// app/doska/auth/page.js
//
// Elektron doska — QR bilan kirish ekrani (Telegram Web / Smart Board uslubida).
//
// Bu sahifa auditoriyadagi katta elektron doska yoki kompyuter ekranida ochiladi:
//   • QR ichidagi havola: /doska/auth/<token>
//   • Ekranda shaxsiy ma'lumot va matn ko'rinishidagi token ko'rsatilmaydi
//   • Telefonda ruxsat berilgach ekran avtomatik kiradi va dars vaqtini sanaydi
"use client"

import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'qrcode'
import Ikon from '@/components/Ikon'
import AuthQobiq, { AuthYuklanmoqda } from '@/components/AuthQobiq'
import { xavfsizQaytishManzili } from '@/lib/auth-tekshiruv'
import { ustozPaneliOchiqmi } from '@/lib/roles'

/** Holatni so'rash oralig'i (ms) */
const SOROV_MS = 2000
const DOSKA_TOKEN_KEY = 'jda_doska_auth_token'

/** ms -> "1:23:45" yoki "2:05" */
function vaqtMatni(ms) {
  const jami = Math.max(0, Math.floor(ms / 1000))
  const s = jami % 60
  const d = Math.floor(jami / 60) % 60
  const h = Math.floor(jami / 3600)
  const ikki = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${ikki(d)}:${ikki(s)}` : `${d}:${ikki(s)}`
}

function saqlanganTokenniOlish() {
  try {
    return window.sessionStorage.getItem(DOSKA_TOKEN_KEY)
  } catch {
    return null
  }
}

function tokenniSaqlash(qiymat) {
  try {
    if (qiymat) window.sessionStorage.setItem(DOSKA_TOKEN_KEY, qiymat)
    else window.sessionStorage.removeItem(DOSKA_TOKEN_KEY)
  } catch {
    // sessionStorage yopiq bo'lsa e'tiborsiz qoldiramiz
  }
}

function DoskaAuthEkran() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()

  const [token, setToken] = useState(null)
  const [qr, setQr] = useState(null)
  const [amalQiladi, setAmalQiladi] = useState(null)
  const [xato, setXato] = useState('')
  const [qrYuklanmoqda, setQrYuklanmoqda] = useState(false)
  const [chiqilmoqda, setChiqilmoqda] = useState(false)
  const [hozir, setHozir] = useState(() => Date.now())

  const kirilmoqda = useRef(false)
  const autoChiqildi = useRef(false)
  const qrSorovRef = useRef(false)
  const boshlandi = useRef(false)

  const rawCallbackUrl = searchParams?.get('callbackUrl')
  const joriyOrigin = typeof window !== 'undefined' ? window.location.origin : null
  const safeCallbackUrl = rawCallbackUrl
    ? xavfsizQaytishManzili(rawCallbackUrl, null, joriyOrigin)
    : null
  const nishonManzil =
    safeCallbackUrl && !safeCallbackUrl.startsWith('/doska/auth') ? safeCallbackUrl : null

  const doskaRejimi = Boolean(session?.user?.doskaTugaydi)

  const yangiQr = useCallback(async () => {
    if (qrSorovRef.current) return
    qrSorovRef.current = true
    setXato('')
    setQr(null)
    setQrYuklanmoqda(true)
    kirilmoqda.current = false
    tokenniSaqlash(null)

    try {
      const res = await fetch('/api/doska', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'QR yaratib bo\'lmadi')

      setToken(d.token)
      tokenniSaqlash(d.token)
      setAmalQiladi(new Date(d.amalQiladi).getTime())

      const manzil = `${window.location.origin}/doska/auth/${d.token}`
      // Yuqori kontrast va keng hoshiya: auditoriya orqasidan ham oson skanerlansin
      setQr(
        await QRCode.toDataURL(manzil, {
          width: 460,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: { dark: '#070c29', light: '#ffffff' },
        })
      )
    } catch (e) {
      setXato(e.message || 'QR yaratilmadi')
    } finally {
      qrSorovRef.current = false
      setQrYuklanmoqda(false)
    }
  }, [])

  // Birinchi QR — faqat tizimga kirmagan holatda bir marta ochiladi
  useEffect(() => {
    if (status === 'loading') return
    if (session?.user) {
      boshlandi.current = false
      return
    }
    if (!boshlandi.current) {
      boshlandi.current = true
      yangiQr()
    }
  }, [status, session?.user, yangiQr])

  // Har soniyada vaqtni yangilash
  useEffect(() => {
    const t = setInterval(() => setHozir(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Doska sessiyasi vaqti tugashi bilan avtomatik chiqish
  useEffect(() => {
    if (!doskaRejimi || !session?.user?.doskaTugaydi || autoChiqildi.current) return
    if (hozir >= Number(session.user.doskaTugaydi)) {
      autoChiqildi.current = true
      const aktivToken = token || saqlanganTokenniOlish()
      if (aktivToken) {
        fetch(`/api/doska?token=${encodeURIComponent(aktivToken)}`, { method: 'DELETE' }).catch(() => {})
      }
      tokenniSaqlash(null)
      signOut({ callbackUrl: '/doska/auth' })
    }
  }, [doskaRejimi, session?.user?.doskaTugaydi, hozir, token])

  // QR tasdiqlanishini kutib turish (sekin tarmoqda so'rovlar ustma-ust tushmasin)
  useEffect(() => {
    if (!token || session?.user || xato) return
    if (amalQiladi && Date.now() >= amalQiladi) return

    let bekor = false
    let timerId = null
    let controller = null

    const tekshir = async () => {
      if (bekor) return
      if (amalQiladi && Date.now() >= amalQiladi) return

      controller = new AbortController()
      try {
        const res = await fetch(`/api/doska?token=${encodeURIComponent(token)}`, {
          signal: controller.signal,
        })
        const d = await res.json()
        if (bekor) return

        if (!res.ok) {
          if (res.status === 404) {
            setXato('QR topilmadi')
            return
          }
        } else {
          if (d.holat === 'muddati-otgan') {
            setXato('QR kodining muddati tugadi')
            return
          }
          if (d.holat === 'bekor') {
            setXato('QR kodi bekor qilindi')
            return
          }
          if (d.holat === 'ishlatilgan' && !kirilmoqda.current) {
            setXato('Bu QR kodi allaqachon ishlatilgan')
            return
          }

          if (d.holat === 'tasdiqlangan' && !kirilmoqda.current) {
            kirilmoqda.current = true
            const kirish = await signIn('doska', { token, redirect: false })
            if (bekor) return
            if (!kirish || kirish.error || kirish.ok === false) {
              kirilmoqda.current = false
              setXato('Doskaga kirishda xatolik yuz berdi. Yangi QR kod oling.')
              return
            }

            await update()
            if (nishonManzil) {
              router.replace(nishonManzil)
            } else {
              router.refresh()
            }
            return
          }
        }
      } catch (e) {
        if (e?.name === 'AbortError' || bekor) return
        // Keyingi urinishda qayta tekshiradi
      }

      if (!bekor && (!amalQiladi || Date.now() < amalQiladi)) {
        timerId = setTimeout(tekshir, SOROV_MS)
      }
    }

    timerId = setTimeout(tekshir, SOROV_MS)

    return () => {
      bekor = true
      if (timerId) clearTimeout(timerId)
      if (controller) controller.abort()
    }
  }, [token, session?.user, xato, amalQiladi, update, nishonManzil, router])

  const darsniTugatish = async () => {
    if (chiqilmoqda) return
    setChiqilmoqda(true)
    const aktivToken = token || saqlanganTokenniOlish()
    if (aktivToken) {
      await fetch(`/api/doska?token=${encodeURIComponent(aktivToken)}`, {
        method: 'DELETE',
      }).catch(() => {})
    }
    tokenniSaqlash(null)
    await signOut({ callbackUrl: '/doska/auth' })
  }

  if (status === 'loading') {
    return <AuthYuklanmoqda matn="Elektron doska yuklanmoqda..." />
  }

  // ─── 1. DOSKA REJIMI FAOL ───
  if (doskaRejimi) {
    const qolgan = Math.max(0, Number(session.user.doskaTugaydi) - hozir)
    return (
      <AuthQobiq
        nishon="Doska rejimi faol"
        sarlavha={session.user.fullName || session.user.username}
        izoh={`@${session.user.username} hisobi vaqtinchalik elektron doskaga ulandi`}
        maxWidthClass="max-w-[500px]"
      >
        <div className="rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-5 text-center mb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--v3-xira)] mb-1.5">
            <Ikon nom="soat" olcham={14} className="text-[var(--v3-urgu)]" />
            <span>Sessiya tugashiga</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--v3-urgu)] tracking-wider">
            {vaqtMatni(qolgan)}
          </div>
          <p className="text-[11px] text-[var(--v3-xira)] mt-2">
            Vaqt tugagach doska sessiyasi avtomatik yopiladi — auditoriyada ochiq qolmaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <Link
            href="/doska"
            className="v3-tugma v3-tugma-asosiy justify-center py-3 text-sm font-bold"
          >
            <Ikon nom="doska" olcham={17} />
            <span>Smart Doska</span>
          </Link>
          <Link
            href="/ustoz"
            className="v3-tugma justify-center py-3 text-sm font-semibold"
          >
            <Ikon nom="ustoz" olcham={17} />
            <span>Ustoz paneli</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={darsniTugatish}
          disabled={chiqilmoqda}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Ikon nom="chiqish" olcham={16} />
          <span>{chiqilmoqda ? 'Chiqilmoqda...' : 'Darsni tugatish va chiqish'}</span>
        </button>
      </AuthQobiq>
    )
  }

  // ─── 2. ODDIY SESSIYA BILAN ALLAQACHON KIRILGAN ───
  if (session?.user) {
    const ustoz = ustozPaneliOchiqmi(session.user)
    return (
      <AuthQobiq
        nishon="Faol hisob"
        sarlavha="Tizimga kirilgan"
        izoh={`Hozir bu brauzerda @${session.user.username} hisobi ochiq turibdi`}
        maxWidthClass="max-w-[480px]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <Link
            href="/doska"
            className="v3-tugma v3-tugma-asosiy justify-center py-3 text-sm font-bold"
          >
            <Ikon nom="doska" olcham={17} />
            <span>Smart Doska</span>
          </Link>
          <Link
            href={ustoz ? '/ustoz' : '/profil'}
            className="v3-tugma justify-center py-3 text-sm font-semibold"
          >
            <Ikon nom={ustoz ? 'ustoz' : 'odam'} olcham={17} />
            <span>{ustoz ? 'Ustoz paneli' : 'Shaxsiy kabinet'}</span>
          </Link>
        </div>

        {ustoz && (
          <Link
            href="/doska/skaner"
            className="v3-tugma w-full justify-center py-2.5 text-xs sm:text-sm font-semibold mb-3 border-[var(--v3-urgu)]/50 text-[var(--v3-urgu)]"
          >
            <Ikon nom="skaner" olcham={16} />
            <span>Boshqa doska QR kodini skanerlash</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/doska/auth' })}
          className="w-full min-h-[42px] px-4 py-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] hover:border-[var(--v3-urgu)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] text-xs font-semibold transition flex items-center justify-center gap-2"
        >
          <Ikon nom="chiqish" olcham={15} />
          <span>Chiqib, yangi QR bilan kirish</span>
        </button>
      </AuthQobiq>
    )
  }

  // ─── 3. QR KIRISH EKRANI ───
  const qrQolgan = amalQiladi ? Math.max(0, amalQiladi - hozir) : 0
  const qrEskirdi = Boolean(amalQiladi && qrQolgan === 0)

  return (
    <AuthQobiq
      nishon="QR bilan kirish"
      sarlavha="Elektron doska"
      izoh="Telefoningizda hisobingiz ochiq bo'lsa, parol termasdan QR orqali kiring"
      maxWidthClass="max-w-[500px]"
      backHref="/login"
      backLabel="Kirishga qaytish"
    >
      <div className="flex flex-col items-center">
        <div className="relative bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 mb-4">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt="Elektron doskaga kirish uchun QR kod"
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain rounded-xl select-none"
            />
          ) : (
            <div className="w-56 h-56 sm:w-72 sm:h-72 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Ikon nom="vaqt" olcham={28} className="animate-spin text-slate-700" />
              <span className="text-xs font-medium">QR tayyorlanmoqda...</span>
            </div>
          )}

          {(qrEskirdi || xato) && (
            <div className="absolute inset-0 bg-[#070c29]/92 rounded-3xl flex flex-col items-center justify-center gap-3 p-5 text-center backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Ikon nom="vaqt" olcham={24} />
              </div>
              <div className="text-sm font-semibold text-white">
                {xato || 'QR kodining muddati tugadi'}
              </div>
              <button
                type="button"
                onClick={yangiQr}
                disabled={qrYuklanmoqda}
                className="v3-tugma v3-tugma-asosiy px-5 py-2.5 text-xs sm:text-sm font-bold disabled:opacity-50"
              >
                <Ikon nom="qayta" olcham={15} />
                <span>Yangi QR olish</span>
              </button>
            </div>
          )}
        </div>

        {/* Amal qilish vaqti va yangilash */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-5">
          {!qrEskirdi && !xato && amalQiladi ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--v3-xira)]">
              <Ikon nom="soat" olcham={14} className="text-[var(--v3-urgu)]" />
              <span>
                QR <strong className="text-[var(--v3-matn)] font-mono">{vaqtMatni(qrQolgan)}</strong> amal qiladi
              </span>
            </span>
          ) : null}

          <button
            type="button"
            onClick={yangiQr}
            disabled={qrYuklanmoqda}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--v3-urgu)] hover:underline disabled:opacity-50"
          >
            <Ikon nom="qayta" olcham={13} />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Qadamlar */}
        <ol className="w-full space-y-2 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-4 text-xs text-[var(--v3-xira)] mb-5">
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] font-bold text-[11px] flex items-center justify-center shrink-0">
              1
            </span>
            <span>Telefonda saytdagi &laquo;Doska skaneri&raquo;ni yoki kamerangizni oching</span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] font-bold text-[11px] flex items-center justify-center shrink-0">
              2
            </span>
            <span>Ekrandagi QR kodni skanerlang va havolani oching</span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] font-bold text-[11px] flex items-center justify-center shrink-0">
              3
            </span>
            <span>Telefonda &laquo;Ruxsat berish&raquo; tugmasini bosing — ekran o&apos;zi kiradi</span>
          </li>
        </ol>

        <p className="text-[11px] text-center text-[var(--v3-xira)] leading-relaxed mb-4">
          Parol auditoriyada terilmaydi. Kirishni faqat telefoningizdagi ustoz hisobi tasdiqlaydi.
        </p>

        <Link
          href={nishonManzil ? `/login?callbackUrl=${encodeURIComponent(nishonManzil)}` : '/login'}
          className="text-xs font-semibold text-[var(--v3-urgu)] hover:underline inline-flex items-center gap-1.5"
        >
          <Ikon nom="chap" olcham={14} />
          <span>Parol bilan kirishga qaytish</span>
        </Link>
      </div>
    </AuthQobiq>
  )
}

export default function DoskaAuthSahifa() {
  return (
    <Suspense fallback={<AuthYuklanmoqda matn="Elektron doska yuklanmoqda..." />}>
      <DoskaAuthEkran />
    </Suspense>
  )
}
