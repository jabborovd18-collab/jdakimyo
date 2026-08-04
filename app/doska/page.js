// app/doska/page.js
//
// Elektron doska — QR bilan kirish ekrani.
//
// Bu sahifa AUDITORIYADAGI EKRANDA turadi, ya'ni uni o'nlab odam
// ko'radi. Shuning uchun:
//   • QR dan boshqa hech qanday shaxsiy ma'lumot chiqmaydi
//   • token matn ko'rinishida yozilmaydi (faqat QR ichida)
//   • kirgandan keyin qolgan vaqt va "Darsni tugatish" tugmasi turadi
"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import QRCode from 'qrcode'

/** Holatni so'rash oralig'i */
const SOROV_MS = 2500

export default function DoskaPage() {
  const { data: session, status } = useSession()
  const [token, setToken] = useState(null)
  const [qr, setQr] = useState(null)
  const [amalQiladi, setAmalQiladi] = useState(null)
  const [xato, setXato] = useState('')
  const [hozir, setHozir] = useState(Date.now())
  // Kirish bir marta chaqirilsin: so'rov 2.5 soniyada takrorlanadi va
  // tasdiqlangan holat bir necha marta kelishi mumkin
  const kirilmoqda = useRef(false)

  const doskaRejimi = Boolean(session?.user?.doskaTugaydi)

  /** Yangi QR so'raydi */
  const yangiQr = useCallback(async () => {
    setXato('')
    setQr(null)
    try {
      const res = await fetch('/api/doska', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)

      setToken(d.token)
      setAmalQiladi(new Date(d.amalQiladi).getTime())

      const manzil = `${window.location.origin}/doska/${d.token}`
      // Yuqori kontrast va katta modul: zal orqasidan ham skanerlansin
      setQr(await QRCode.toDataURL(manzil, {
        width: 460,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#0f0a1e', light: '#ffffff' },
      }))
    } catch (e) {
      setXato(e.message || 'QR yaratilmadi')
    }
  }, [])

  // Birinchi QR — faqat kirilmagan bo'lsa
  useEffect(() => {
    if (status === 'loading') return
    if (!session) yangiQr()
  }, [status, session, yangiQr])

  // Soat
  useEffect(() => {
    const t = setInterval(() => setHozir(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Holatni so'rab turish
  useEffect(() => {
    if (!token || session) return

    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/doska?token=${encodeURIComponent(token)}`)
        const d = await res.json()
        if (!res.ok) return

        if (d.holat === 'muddati-otgan') {
          setXato('QR muddati tugadi')
          return
        }

        if (d.holat === 'tasdiqlangan' && !kirilmoqda.current) {
          kirilmoqda.current = true
          await signIn('doska', { token, redirect: false })
          window.location.reload()
        }
      } catch {
        // jim: keyingi so'rovda qayta urinadi
      }
    }, SOROV_MS)

    return () => clearInterval(t)
  }, [token, session])

  // ─── KIRGAN HOLAT ───
  if (doskaRejimi) {
    const qolgan = Math.max(0, session.user.doskaTugaydi - hozir)
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-bold mb-2">
            {session.user.fullName || session.user.username}
          </h1>
          <p className="text-purple-300 mb-6">Doska rejimi faol</p>

          <div className="bg-slate-900/60 border border-purple-700/50 rounded-2xl p-6 mb-6">
            <div className="text-sm text-purple-400 mb-1">Sessiya tugashiga</div>
            <div className="text-4xl font-bold font-mono text-yellow-400">
              {vaqtMatni(qolgan)}
            </div>
            <div className="text-xs text-purple-500 mt-2">
              Vaqt tugagach ekran o'zi chiqadi
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/ustoz"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
            >
              Ustoz paneli →
            </a>
            <button
              onClick={async () => {
                await fetch(`/api/doska?token=${encodeURIComponent(token || '')}`, { method: 'DELETE' }).catch(() => {})
                signOut({ callbackUrl: '/doska' })
              }}
              className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-300 font-semibold rounded-xl"
            >
              Darsni tugatish
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Oddiy (doska bo'lmagan) sessiya bilan ochilgan bo'lsa
  if (session) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-purple-200 mb-4">
            Siz allaqachon <b>{session.user.username}</b> sifatida kirgansiz.
          </p>
          <a href="/ustoz" className="px-6 py-3 bg-purple-700 rounded-xl font-semibold">
            Ustoz paneli →
          </a>
        </div>
      </main>
    )
  }

  // ─── QR EKRANI ───
  const qrQolgan = amalQiladi ? Math.max(0, amalQiladi - hozir) : 0
  const qrEskirdi = amalQiladi && qrQolgan === 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-xl w-full">
        <div className="text-sm tracking-[0.3em] text-purple-400 mb-2">JDA KIMYO</div>
        <h1 className="text-4xl font-extrabold mb-2">Elektron doska</h1>
        <p className="text-purple-300 mb-8">
          Telefoningiz kamerasi bilan QR ni skanerlang va telefonda tasdiqlang
        </p>

        <div className="bg-white rounded-3xl p-6 inline-block shadow-2xl mb-6 relative">
          {qr ? (
            <img src={qr} alt="Kirish uchun QR kod" className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]" />
          ) : (
            <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center text-slate-400">
              ⏳
            </div>
          )}

          {/* Muddati o'tgan QR ustidan yopiladi: eski kodni skanerlab
              ovora bo'lmasin */}
          {(qrEskirdi || xato) && (
            <div className="absolute inset-0 bg-slate-950/90 rounded-3xl flex flex-col items-center justify-center gap-3">
              <div className="text-4xl">⏱️</div>
              <div className="text-purple-200 text-sm">{xato || 'QR muddati tugadi'}</div>
              <button
                onClick={yangiQr}
                className="px-5 py-2.5 bg-yellow-500 text-black font-bold rounded-xl"
              >
                Yangi QR
              </button>
            </div>
          )}
        </div>

        {!qrEskirdi && !xato && amalQiladi && (
          <div className="text-purple-400 text-sm">
            QR {vaqtMatni(qrQolgan)} amal qiladi
          </div>
        )}

        <div className="mt-8 text-xs text-purple-500 max-w-sm mx-auto">
          Parol terilmaydi. Kirishni faqat telefon egasi tasdiqlaydi —
          QR ni skanerlagan boshqa odam hisobga kira olmaydi.
        </div>
      </div>
    </main>
  )
}

/** ms -> "1:23:45" yoki "2:05" */
function vaqtMatni(ms) {
  const jami = Math.floor(ms / 1000)
  const s = jami % 60
  const d = Math.floor(jami / 60) % 60
  const h = Math.floor(jami / 3600)
  const ikki = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${ikki(d)}:${ikki(s)}` : `${d}:${ikki(s)}`
}
