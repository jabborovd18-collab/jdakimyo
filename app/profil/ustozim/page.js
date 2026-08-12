// app/profil/ustozim/page.js
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'

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
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Ustozlar ro{"'"}yxati yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-4 border-b border-[var(--v3-chiziq)]">
        <div className="v3-nishon">Ta{"'"}lim aloqasi</div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
          <Ikon nom="ustoz" olcham={22} className="text-[var(--v3-urgu)]" />
          <span>Mening Ustozlarim</span>
        </h1>
        <p className="text-xs text-[var(--v3-xira)] mt-1">
          Guruhga qo{"'"}shilish sizning ixtiyoringizda. Istalgan vaqtda guruhdan chiqib ketishingiz mumkin.
        </p>
      </div>

      {/* ─── TAKLIFLAR ─── */}
      {takliflar.length > 0 && (
        <section className="space-y-3">
          <div className="v3-nishon">Yangi takliflar ({takliflar.length})</div>
          <div className="space-y-3">
            {takliflar.map((t) => (
              <div
                key={t.id}
                className="v3-panel-karta p-5 space-y-4 border-[var(--v3-urgu)]/40 bg-[var(--v3-yuza-2)]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                    {t.teacher?.avatar ? (
                      <img src={t.teacher.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (t.teacher?.fullName?.[0] || t.teacher?.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="font-bold text-sm text-[var(--v3-matn)] flex items-center gap-1.5 flex-wrap">
                      <span>{t.teacher?.fullName || t.teacher?.username}</span>
                      <TasdiqBelgisi tasdiqlangan={t.teacher?.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-[11px] text-[var(--v3-xira)] font-mono">@{t.teacher?.username}</div>
                    <div className="text-xs text-[var(--v3-matn)] pt-1">
                      Sizni <span className="text-[var(--v3-urgu)] font-bold">{t.group?.name || 'guruhiga'}</span> guruhiga taklif qilmoqda
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--v3-xira)] leading-relaxed p-3 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
                  Qabul qilsangiz: guruh vazifalari va testlari sizga ochiladi, natijalaringiz ustozga ko{"'"}rinadi.
                </p>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => javobBer(t.id, 'qabul')}
                    disabled={band === t.id}
                    className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold flex-1"
                  >
                    ✓ Qabul qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => javobBer(t.id, 'rad')}
                    disabled={band === t.id}
                    className="v3-tugma text-xs py-2 px-4 flex-1 text-red-400"
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
      <section className="space-y-3">
        <div className="v3-nishon">A{"'"}zo bo{"'"}lgan guruhlarim</div>
        {guruhlarim.length === 0 ? (
          <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
              <Ikon nom="ustoz" olcham={20} />
            </div>
            <p className="font-bold text-sm text-[var(--v3-matn)]">Hozircha guruhlar mavjud emas</p>
            <p>Ustozingiz taklif havolasini yuborganida shu yerda tasdiqlaysiz.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {guruhlarim.map((g) => (
              <div
                key={g.id}
                className="v3-panel-karta p-4 flex items-center justify-between gap-3"
              >
                <Link href={`/ustoz-profil/${g.teacher?.userId || g.teacher?.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                    {g.teacher?.avatar ? (
                      <img src={g.teacher.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (g.teacher?.fullName?.[0] || g.teacher?.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                      <span>{g.teacher?.fullName || g.teacher?.username}</span>
                      <TasdiqBelgisi tasdiqlangan={g.teacher?.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-[10.5px] text-[var(--v3-urgu)] font-mono truncate">
                      {g.group?.name || 'Guruh'}
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => chiqish(g.id, g.group?.name || 'guruh')}
                  disabled={band === g.id}
                  className="v3-tugma text-xs py-1.5 px-3 text-red-400 hover:border-red-500/30 shrink-0"
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
