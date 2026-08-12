// app/profil/ustozim/page.js
//
// Talabaning ustozlari va unga kelgan takliflar.
//
// NEGA BOR. Ustoz avval istalgan odamni jimgina guruhiga qo'sha olardi
// va talaba buni ko'rmasdi ham, chiqib ketish yo'li ham yo'q edi. Bu
// sahifa uning yagona boshqaruv joyi.
//
// Avval bu yerda `ProfileLearning view="teachers"` turardi — u faqat
// ro'yxatni ko'rsatardi, hech qanday amal yo'q edi.
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

export default function UstozlarimPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qoshilGuruhId = searchParams.get('qoshil')

  const [takliflar, setTakliflar] = useState([])
  const [guruhlarim, setGuruhlarim] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [band, setBand] = useState(null)

  useEffect(() => {
    olib()
  }, [])

  // Havola orqali kelganda guruhga qo'shilish
  useEffect(() => {
    if (qoshilGuruhId) {
      guruhgaQoshil(qoshilGuruhId)
    }
  }, [qoshilGuruhId])

  const guruhgaQoshil = async (groupId) => {
    try {
      const res = await fetch('/api/profil/ustozlarim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Guruhga qo\'shildingiz!')
        router.replace('/profil/ustozim')
        olib()
      } else {
        toast.error(data.error || 'Guruhga qo\'shilib bo\'lmadi')
      }
    } catch (e) {
      toast.error('Guruhga ulanishda xatolik')
    }
  }

  const olib = async () => {
    try {
      const res = await fetch('/api/profil/ustozlarim')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTakliflar(data.takliflar || [])
      setGuruhlarim(data.guruhlarim || [])
    } catch (e) {
      toast.error(e.message || 'Yuklashda xatolik')
    } finally {
      setYuklanmoqda(false)
    }
  }

  const javobBer = async (id, javob) => {
    setBand(id)
    try {
      const res = await fetch('/api/profil/ustozlarim', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, javob }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      olib()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  const chiqish = async (id, guruhNomi) => {
    if (!confirm(`"${guruhNomi}" guruhidan chiqasizmi? Ustoz endi natijalaringizni ko'rmaydi.`)) return
    setBand(id)
    try {
      const res = await fetch(`/api/profil/ustozlarim?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      olib()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  if (yuklanmoqda) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin text-5xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">👨‍🏫 Ustozlarim</h1>
        <p className="text-sm text-purple-300">
          Guruhga qo'shilish sizning ixtiyoringizda. Istalgan vaqtda chiqib ketishingiz mumkin.
        </p>
      </div>

      {/* ─── TAKLIFLAR ─── */}
      {takliflar.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            📬 Yangi takliflar
            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-xs text-yellow-300">
              {takliflar.length}
            </span>
          </h2>
          <div className="space-y-3">
            {takliflar.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-700/40 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar user={t.teacher} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                      {t.teacher.fullName || t.teacher.username}
                      <TasdiqBelgisi tasdiqlangan={t.teacher.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-xs text-purple-400">@{t.teacher.username}</div>
                    <div className="text-sm text-purple-200 mt-1">
                      Sizni <span className="text-yellow-300 font-semibold">{t.group?.name || 'guruhiga'}</span> guruhiga
                      taklif qilmoqda
                    </div>
                  </div>
                </div>

                {/* Nima o'zgarishini oldindan aytamiz: rozilik ma'lumotli
                    bo'lishi kerak, aks holda uning ma'nosi qolmaydi. */}
                <p className="text-xs text-purple-400 mb-3 bg-purple-950/40 rounded-lg p-2.5">
                  Qabul qilsangiz: guruh vazifalari va quizlari sizga ko'rinadi, topshirgan
                  ishlaringiz va baholaringiz ustozga ochiladi.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => javobBer(t.id, 'qabul')}
                    disabled={band === t.id}
                    className="flex-1 px-4 py-2 bg-green-600/30 hover:bg-green-600/40 border border-green-500/50 rounded-xl text-sm font-semibold text-green-200 transition-all disabled:opacity-50"
                  >
                    ✓ Qabul qilish
                  </button>
                  <button
                    onClick={() => javobBer(t.id, 'rad')}
                    disabled={band === t.id}
                    className="flex-1 px-4 py-2 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-sm font-semibold text-slate-300 transition-all disabled:opacity-50"
                  >
                    Rad etish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── FAOL GURUHLAR ─── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">📚 Guruhlarim</h2>
        {guruhlarim.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-purple-800/40 rounded-2xl">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-purple-300 text-sm">Hozircha hech qanday guruhda emassiz</p>
            <p className="text-purple-500 text-xs mt-1">
              Ustoz sizni taklif qilsa, bu yerda ko'rinadi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {guruhlarim.map((g) => (
              <div
                key={g.id}
                className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-4 flex items-start gap-3"
              >
                <Avatar user={g.teacher} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                    {g.teacher.fullName || g.teacher.username}
                    <TasdiqBelgisi tasdiqlangan={g.teacher.isVerified} olcham="kichik" />
                  </div>
                  <div className="text-xs text-purple-400">@{g.teacher.username}</div>
                  {g.group && (
                    <div className="text-sm text-purple-200 mt-1">📚 {g.group.name}</div>
                  )}
                  {g.teacher.university && (
                    <div className="text-xs text-purple-500 mt-0.5">🏛️ {g.teacher.university}</div>
                  )}
                </div>
                <button
                  onClick={() => chiqish(g.id, g.group?.name || 'guruh')}
                  disabled={band === g.id}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 rounded-lg text-xs text-red-300 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  Chiqish
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Avatar({ user }) {
  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden">
      {user.avatar ? (
        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
      ) : (
        (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
      )}
    </div>
  )
}
