// app/doska/[token]/page.js
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
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const DAVOMIYLIKLAR = [1, 2, 4]

export default function DoskaTasdiqlash() {
  const { token } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [holat, setHolat] = useState(null)
  const [soat, setSoat] = useState(2)
  const [band, setBand] = useState(false)
  const [tugadi, setTugadi] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/doska?token=${encodeURIComponent(token)}`)
        const d = await res.json()
        setHolat(res.ok ? d : { xato: d.error })
      } catch {
        setHolat({ xato: 'Tarmoq xatosi' })
      }
    })()
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
    return <Qobiq><div className="text-purple-300">⏳ Yuklanmoqda...</div></Qobiq>
  }

  // Kirmagan bo'lsa — login'ga, keyin shu sahifaga qaytadi
  if (!session) {
    return (
      <Qobiq>
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-xl font-bold mb-2">Avval tizimga kiring</h1>
        <p className="text-purple-300 text-sm mb-6">
          Doskaga kirish uchun telefoningizda hisobingizga kirgan bo'lishingiz kerak.
        </p>
        <Link
          href={`/login?callbackUrl=/doska/${token}`}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl inline-block"
        >
          Kirish
        </Link>
      </Qobiq>
    )
  }

  if (tugadi) {
    return (
      <Qobiq>
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-xl font-bold mb-2">Doska ochildi</h1>
        <p className="text-purple-300 text-sm mb-6">
          Ekranga qarang — u o'zi kirdi. Sessiya {soat} soatdan keyin
          avtomatik yopiladi.
        </p>
        <button
          onClick={() => router.push('/profil')}
          className="px-6 py-3 bg-purple-700 rounded-xl font-semibold"
        >
          Kabinetga
        </button>
      </Qobiq>
    )
  }

  if (holat.xato || holat.holat === 'muddati-otgan') {
    return (
      <Qobiq>
        <div className="text-5xl mb-4">⏱️</div>
        <h1 className="text-xl font-bold mb-2">QR eskirgan</h1>
        <p className="text-purple-300 text-sm">
          {holat.xato || 'Bu QR ning muddati tugagan.'} Doskada yangi QR oching
          va qaytadan skanerlang.
        </p>
      </Qobiq>
    )
  }

  if (holat.holat !== 'kutilmoqda') {
    return (
      <Qobiq>
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-xl font-bold mb-2">Bu QR ishlatilgan</h1>
        <p className="text-purple-300 text-sm">
          Har bir QR faqat bir marta ishlaydi. Doskada yangisini oching.
        </p>
      </Qobiq>
    )
  }

  return (
    <Qobiq>
      <div className="text-5xl mb-4">📊</div>
      <h1 className="text-xl font-bold mb-1">Doskaga kirishga ruxsat</h1>
      <p className="text-purple-300 text-sm mb-5">
        Ekran <b>{session.user.fullName || session.user.username}</b> hisobi
        bilan ochiladi.
      </p>

      {/* Kim so'rayotganini ko'rsatamiz — odam nima tasdiqlayotganini
          bilishi kerak */}
      <div className="bg-slate-900/60 border border-purple-800/50 rounded-xl p-3 mb-5 text-left">
        <div className="text-[11px] uppercase tracking-wider text-purple-500 mb-1">
          So'rov manbai
        </div>
        <div className="text-xs text-purple-200 break-words">
          {holat.qurilma || 'Noma\'lum qurilma'}
        </div>
      </div>

      <div className="mb-5 text-left">
        <div className="text-sm text-purple-200 mb-2">Sessiya davomiyligi</div>
        <div className="flex gap-2">
          {DAVOMIYLIKLAR.map((s) => (
            <button
              key={s}
              onClick={() => setSoat(s)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                soat === s
                  ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-300'
                  : 'bg-slate-900/50 border-purple-800/50 text-purple-300'
              }`}
            >
              {s} soat
            </button>
          ))}
        </div>
        <p className="text-[11px] text-purple-500 mt-2">
          Vaqt tugagach doska o'zi chiqadi — auditoriyada ochiq qolmaydi.
        </p>
      </div>

      <button
        onClick={tasdiqla}
        disabled={band}
        className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl disabled:opacity-50 mb-2"
      >
        {band ? '⏳' : '✓ Ruxsat berish'}
      </button>
      <button
        onClick={() => router.push('/profil')}
        className="w-full py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-slate-300 text-sm"
      >
        Bekor qilish
      </button>

      <p className="text-[11px] text-purple-500 mt-4">
        Bu QR ni siz oching demagan bo'lsangiz, ruxsat bermang.
      </p>
    </Qobiq>
  )
}

function Qobiq({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center p-5">
      <div className="w-full max-w-sm text-center bg-slate-900/40 border border-purple-800/50 rounded-3xl p-6">
        {children}
      </div>
    </main>
  )
}
