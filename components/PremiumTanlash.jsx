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
    <section className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TasdiqBelgisi tasdiqlangan olcham="orta" />
          Premium bezak
        </h2>
        <p className="text-sm text-purple-300 mt-1">
          {tasdiqlangan
            ? "Profilingiz tashqaridan qanday ko'rinishini tanlang."
            : 'Bezaklar tasdiqlangan hisoblar uchun. Hozircha faqat ko\'rib chiqishingiz mumkin.'}
        </p>
      </div>

      {/* Jonli ko'rinish — tanlov darhol shu yerda ko'rinadi */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-700/50 bg-slate-950 p-5">
        <PremiumAurora korinsinmi uslub={tanlangan} />
        <div className="relative z-10 flex items-center gap-4">
          <PremiumHalqa korinsinmi dumaloq uslub={tanlangan}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-black">
              A
            </div>
          </PremiumHalqa>
          <div>
            <div className="text-xl font-extrabold text-white flex items-center gap-2">
              Namuna
              <TasdiqBelgisi tasdiqlangan olcham="katta" jonli />
            </div>
            <div className="mt-1.5">
              <PremiumYorliq korinsinmi uslub={tanlangan} />
            </div>
          </div>
        </div>
      </div>

      {/* Ro'yxat */}
      <div className="grid gap-2 sm:grid-cols-2">
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
                  ? 'border-yellow-500/60 bg-yellow-500/10'
                  : 'border-purple-800/50 bg-purple-950/30 hover:border-purple-600/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Rang namunasi */}
                <span className="flex -space-x-1.5 flex-shrink-0">
                  {u.namuna.map((rang) => (
                    <span
                      key={rang}
                      className="w-5 h-5 rounded-full border border-slate-900"
                      style={{ background: rang }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-white text-sm">{u.nom}</span>
                  <span className="block text-xs text-purple-400 truncate">{u.tavsif}</span>
                </span>
                {faol && <span className="text-yellow-400 flex-shrink-0">✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
