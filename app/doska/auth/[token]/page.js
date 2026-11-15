// app/doska/auth/[token]/page.js
//
// QR skanerlangach TELEFONDA ochiladigan tasdiqlash sahifasi.
//
// Bu — butun tizimning xavfsizlik nuqtasi. QR ni auditoriyadagi har
// kim skanerlashi mumkin, lekin bu sahifa telefonda kirgan odamdan
// ANIQ ROZILIK so'raydi. Skanerlagan talaba o'z hisobi bilan kirgan
// bo'ladi va tasdiqlay olmaydi (ustoz huquqi yo'q), o'qituvchi esa
// nima so'ralayotganini ko'rib turib qaror qiladi.
"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import AuthQobiq, { AuthYuklanmoqda } from '@/components/AuthQobiq'
import { ustozPaneliOchiqmi } from '@/lib/roles'

const DAVOMIYLIKLAR = [1, 2, 4]

export default function DoskaTasdiqlash() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const token = Array.isArray(params?.token) ? params.token[0] : params?.token || ''

  const [holat, setHolat] = useState(null)
  const [soat, setSoat] = useState(2)
  const [band, setBand] = useState(false)
  const [tugadi, setTugadi] = useState(false)

  useEffect(() => {
    if (!token) {
      setHolat({ xato: "QR havolasi noto'g'ri" })
      return
    }

    let bekor = false
    ;(async () => {
      try {
        const res = await fetch(`/api/doska?token=${encodeURIComponent(token)}`)
        const d = await res.json()
        if (!bekor) setHolat(res.ok ? d : { xato: d.error })
      } catch {
        if (!bekor) setHolat({ xato: 'Tarmoq xatosi' })
      }
    })()

    return () => {
      bekor = true
    }
  }, [token])

  const tasdiqla = async () => {
    setBand(true)
    try {
      const res = await fetch('/api/doska', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, soat }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message, { duration: 5000 })
      setTugadi(true)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(false)
    }
  }

  if (status === 'loading' || !holat) {
    return <AuthYuklanmoqda matn="QR ma'lumotlari tekshirilmoqda..." />
  }

  if (tugadi) {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="Doska ochildi"
        izoh={`Ekranga qarang — u o'zi kirdi. Sessiya ${soat} soatdan keyin avtomatik yopiladi.`}
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <Ikon nom="tasdiq" olcham={32} />
          </div>
          <div className="space-y-2.5">
            <Link
              href="/doska/skaner"
              className="v3-tugma v3-tugma-asosiy w-full justify-center py-3 text-sm font-bold"
            >
              <Ikon nom="skaner" olcham={16} />
              <span>Doskalar va skanerga o&apos;tish</span>
            </Link>
            <Link
              href="/profil"
              className="v3-tugma w-full justify-center py-2.5 text-xs sm:text-sm font-semibold"
            >
              <span>Kabinetga o&apos;tish</span>
              <Ikon nom="ong" olcham={15} />
            </Link>
          </div>
        </div>
      </AuthQobiq>
    )
  }

  if (holat.xato || holat.holat === 'muddati-otgan') {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="QR eskirgan"
        izoh={`${holat.xato || 'Bu QR kodining muddati tugagan.'} Doskada yangi QR oching va qaytadan skanerlang.`}
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <Ikon nom="vaqt" olcham={32} />
          </div>
          <div className="space-y-2.5">
            <Link
              href="/doska/skaner"
              className="v3-tugma v3-tugma-asosiy w-full justify-center py-3 text-sm font-bold"
            >
              <Ikon nom="skaner" olcham={16} />
              <span>Qayta skanerlash</span>
            </Link>
            <Link
              href="/doska/auth"
              className="v3-tugma w-full justify-center py-2.5 text-xs sm:text-sm font-semibold"
            >
              <Ikon nom="qayta" olcham={15} />
              <span>QR ekraniga o&apos;tish</span>
            </Link>
          </div>
        </div>
      </AuthQobiq>
    )
  }

  if (holat.holat === 'bekor') {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="QR bekor qilingan"
        izoh="Bu QR sessiyasi bekor qilingan. Doskada yangi QR kod oching."
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
            <Ikon nom="taqiq" olcham={32} />
          </div>
          <Link
            href="/"
            className="v3-tugma w-full justify-center py-3 text-sm font-semibold"
          >
            <span>Bosh sahifaga</span>
          </Link>
        </div>
      </AuthQobiq>
    )
  }

  if (holat.holat !== 'kutilmoqda') {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="Bu QR ishlatilgan"
        izoh="Har bir QR faqat bir marta ishlaydi. Doskada yangisini oching."
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
            <Ikon nom="taqiq" olcham={32} />
          </div>
          <Link
            href="/profil"
            className="v3-tugma w-full justify-center py-3 text-sm font-semibold"
          >
            <span>Kabinetga o&apos;tish</span>
          </Link>
        </div>
      </AuthQobiq>
    )
  }

  const returnHref = `/login?callbackUrl=${encodeURIComponent(`/doska/auth/${token}`)}`

  // Kirmagan bo'lsa — login'ga, kirgach shu sahifaga qaytadi
  if (!session?.user) {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="Avval tizimga kiring"
        izoh="Doskaga ruxsat berish uchun telefoningizda hisobingizga kirgan bo'lishingiz kerak."
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
            <Ikon nom="qulf" olcham={32} />
          </div>
          <Link
            href={returnHref}
            className="v3-tugma v3-tugma-asosiy w-full justify-center py-3 text-sm font-bold"
          >
            <span>Kirish</span>
            <Ikon nom="ong" olcham={16} />
          </Link>
        </div>
      </AuthQobiq>
    )
  }

  if (session.user.doskaTugaydi) {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="Tasdiqlash mumkin emas"
        izoh="Doska rejimida turgan qurilmadan boshqa doska ochib bo'lmaydi. Telefoningizdagi asosiy hisobdan skanerlang."
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
            <Ikon nom="ogohlantirish" olcham={32} />
          </div>
          <Link
            href="/"
            className="v3-tugma w-full justify-center py-3 text-sm font-semibold"
          >
            <span>Bosh sahifaga</span>
          </Link>
        </div>
      </AuthQobiq>
    )
  }

  if (!ustozPaneliOchiqmi(session.user)) {
    return (
      <AuthQobiq
        nishon="Elektron doska"
        sarlavha="Faqat ustozlar uchun"
        izoh={`@${session.user.username} hisobida ustoz huquqi yo'q. Elektron doskaga faqat ustoz hisobi bilan kirish mumkin.`}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <Ikon nom="taqiq" olcham={32} />
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: returnHref })}
            className="v3-tugma v3-tugma-asosiy w-full justify-center py-3 text-sm font-bold"
          >
            <span>Ustoz hisobiga kirish</span>
            <Ikon nom="ong" olcham={16} />
          </button>
          <Link
            href="/profil"
            className="v3-tugma w-full justify-center py-2.5 text-xs font-semibold"
          >
            <span>Kabinetga qaytish</span>
          </Link>
        </div>
      </AuthQobiq>
    )
  }

  return (
    <AuthQobiq
      nishon="QR tasdiqlash"
      sarlavha="Doskaga kirishga ruxsat"
      izoh={`Ekran ${session.user.fullName || session.user.username} (@${session.user.username}) hisobi bilan ochiladi.`}
    >
      <div className="space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
          <Ikon nom="doska" olcham={28} />
        </div>

        {/* So'rayotgan qurilma — foydalanuvchi nimani tasdiqlayotganini ko'rishi shart */}
        <div className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-3.5 text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--v3-urgu)] mb-1">
            So&apos;rov manbai
          </div>
          <div className="text-xs text-[var(--v3-matn)] break-all leading-relaxed">
            {holat.qurilma || "Noma'lum qurilma"}
          </div>
        </div>

        <div className="text-left">
          <div className="text-xs font-semibold text-[var(--v3-matn)] mb-2">
            Sessiya davomiyligi
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DAVOMIYLIKLAR.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSoat(s)}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  soat === s
                    ? 'bg-amber-500/20 border-[var(--v3-urgu)] text-[var(--v3-urgu)]'
                    : 'bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:border-[var(--v3-chiziq-2)] hover:text-[var(--v3-matn)]'
                }`}
              >
                {s} soat
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--v3-xira)] mt-2">
            Vaqt tugagach doska o&apos;zi chiqadi — auditoriyada ochiq qolmaydi.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={tasdiqla}
            disabled={band}
            className="v3-tugma v3-tugma-asosiy w-full min-h-[46px] justify-center text-sm font-bold disabled:opacity-50"
          >
            {band ? (
              <span>Tasdiqlanmoqda...</span>
            ) : (
              <>
                <Ikon nom="tasdiq" olcham={18} />
                <span>Ruxsat berish</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/profil')}
            className="v3-tugma w-full justify-center py-2.5 text-xs sm:text-sm font-semibold"
          >
            Bekor qilish
          </button>
        </div>

        <p className="text-[11px] text-center text-[var(--v3-xira)] leading-relaxed">
          Bu QR ni siz oching demagan bo&apos;lsangiz, ruxsat bermang.
        </p>
      </div>
    </AuthQobiq>
  )
}
