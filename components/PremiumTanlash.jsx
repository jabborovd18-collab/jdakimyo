// components/PremiumTanlash.jsx
//
// Tasdiqlangan hisob uchun profil bezagini tanlash.
//
// Tasdiqlanmagan hisobga ham ro'yxat ko'rsatiladi, lekin tanlash yopiq:
// nima borligini ko'rmasdan turib "tasdiqlansangiz shu bo'ladi" degan
// gap ma'nosiz bo'lardi.
"use client"
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PremiumAurora, PremiumHalqa, PremiumYorliq } from './PremiumProfil'
import TasdiqBelgisi from './TasdiqBelgisi'
import Ikon from './Ikon'
import { profilKeshUserYangila } from '@/lib/profil-kesh'

export default function PremiumTanlash() {
  const [malumot, setMalumot] = useState(null)
  const [tanlangan, setTanlangan] = useState(null)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/profil/premium')
        const d = await res.json()
        if (!res.ok) throw new Error(d.error)
        setMalumot(d)
        setTanlangan(d.tanlangan)
      } catch (e) {
        toast.error(e.message || 'Yuklashda xatolik')
      }
    })()
  }, [])

  const saqla = async (kalit) => {
    setSaqlanmoqda(true)
    const oldingi = tanlangan
    setTanlangan(kalit) // darhol ko'rsatamiz
    try {
      const res = await fetch('/api/profil/premium', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uslub: kalit }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      profilKeshUserYangila({ premiumUslub: kalit })
      toast.success(d.message)
    } catch (e) {
      setTanlangan(oldingi) // saqlanmasa orqaga qaytaramiz
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  if (!malumot) return null

  const { tasdiqlangan, uslublar } = malumot

  return (
    <section className="v3-panel-karta p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] flex items-center gap-2">
          <TasdiqBelgisi tasdiqlangan olcham="orta" />
          <span>Premium bezak</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--v3-xira)] mt-1">
          {tasdiqlangan
            ? "Profilingiz tashqaridan qanday ko'rinishini tanlang."
            : "Bezaklar tasdiqlangan hisoblar uchun. Hozircha faqat ko'rib chiqishingiz mumkin."}
        </p>
      </div>

      {/* Jonli ko'rinish — aurora yorug'ligi to'q safir fonda yaxshi ajraladi */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--v3-chiziq-2)] bg-gradient-to-br from-[#0b1437] via-[#081845] to-[#050d29] p-5">
        <PremiumAurora korinsinmi uslub={tanlangan} />
        <div className="relative z-10 flex items-center gap-4">
          <PremiumHalqa korinsinmi dumaloq uslub={tanlangan}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xl sm:text-2xl font-bold text-[#09122c]">
              A
            </div>
          </PremiumHalqa>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <span>Namuna</span>
              <TasdiqBelgisi tasdiqlangan olcham="katta" jonli />
            </div>
            <div className="mt-1.5">
              <PremiumYorliq korinsinmi uslub={tanlangan} />
            </div>
          </div>
        </div>
      </div>

      {/* Ro'yxat */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {uslublar.map((u) => {
          const faol = tanlangan === u.kalit
          return (
            <button
              key={u.kalit}
              type="button"
              disabled={!tasdiqlangan || saqlanmoqda}
              onClick={() => saqla(u.kalit)}
              className={`text-left rounded-xl border p-3 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                faol
                  ? 'border-[var(--v3-urgu)] bg-[var(--v3-yuza-2)] shadow-sm'
                  : 'border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] hover:border-[var(--v3-chiziq-2)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Rang namunasi */}
                <span className="flex -space-x-1.5 flex-shrink-0">
                  {u.namuna.map((rang) => (
                    <span
                      key={rang}
                      className="w-5 h-5 rounded-full border border-[var(--v3-fon-2)]"
                      style={{ background: rang }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--v3-matn)] text-xs sm:text-sm">{u.nom}</span>
                  <span className="block text-[11px] text-[var(--v3-xira)] truncate">{u.tavsif}</span>
                </span>
                {faol && <Ikon nom="belgi" olcham={15} className="text-[var(--v3-urgu)] flex-shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
