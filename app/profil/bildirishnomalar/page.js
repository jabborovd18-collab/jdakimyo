// app/profil/bildirishnomalar/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'

// Turga qarab rang — xabar turi bir qarashda ko'rinsin.
// Tailwind sinflari to'liq yozilgan: yig'ilgan nom build paytida topilmaydi.
const RANG = {
  tanga: 'border-amber-700/50 bg-amber-950/20',
  olmos: 'border-cyan-700/50 bg-cyan-950/20',
  taqiq: 'border-red-700/50 bg-red-950/20',
  'taqiq-olindi': 'border-green-700/50 bg-green-950/20',
  blok: 'border-red-700/50 bg-red-950/20',
  'blok-olindi': 'border-green-700/50 bg-green-950/20',
  rol: 'border-purple-700/50 bg-purple-950/20',
  parol: 'border-orange-700/50 bg-orange-950/20',
  sertifikat: 'border-yellow-700/50 bg-yellow-950/20',
  dost: 'border-blue-700/50 bg-blue-950/20',
  tizim: 'border-purple-800/50 bg-purple-950/20',
}

export default function BildirishnomalarPage() {
  const [royxat, setRoyxat] = useState([])
  const [oqilmagan, setOqilmagan] = useState(0)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/bildirishnomalar?chegara=50')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuklanmadi')
      setRoyxat(data.royxat || [])
      setOqilmagan(data.sanoq?.oqilmagan || 0)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const hammasiniBelgila = async () => {
    try {
      const res = await fetch('/api/bildirishnomalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Server javobini kutmasdan ro'yxatni ham yangilaymiz: qayta so'rov
      // yubormasdan qizil belgilar darhol so'nadi
      setRoyxat((oldin) => oldin.map((b) => ({ ...b, oqilgan: true })))
      setOqilmagan(0)
      toast.success(`${data.soni} ta xabar o'qilgan deb belgilandi`)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const bittasiniBelgila = async (id) => {
    setRoyxat((oldin) => oldin.map((b) => (b.id === id ? { ...b, oqilgan: true } : b)))
    setOqilmagan((n) => Math.max(0, n - 1))
    try {
      await fetch('/api/bildirishnomalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idlar: [id] }),
      })
    } catch {
      // Belgilash o'tmasa keyingi yuklashda qayta ko'rinadi — zarari yo'q
    }
  }

  if (yuklanmoqda) {
    return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">🔔 Bildirishnomalar</h1>
          <p className="text-sm text-purple-300 mt-0.5">
            {oqilmagan > 0 ? `${oqilmagan} ta o'qilmagan xabar` : 'Hammasi o\'qilgan'}
          </p>
        </div>
        {oqilmagan > 0 && (
          <button
            onClick={hammasiniBelgila}
            className="px-4 py-2 rounded-xl bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 text-sm font-semibold"
          >
            Hammasini o'qilgan deb belgilash
          </button>
        )}
      </div>

      {xato && (
        <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-4 text-sm text-red-300">
          {xato}
        </div>
      )}

      {royxat.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-purple-800/50 rounded-2xl">
          <div className="text-5xl mb-3">📭</div>
          <h2 className="text-lg font-bold text-white mb-1">Hozircha xabar yo'q</h2>
          <p className="text-sm text-purple-300 max-w-md mx-auto">
            Do'stlik takliflari, sertifikatlar va administrator qarorlari shu
            yerda ko'rinadi.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {royxat.map((b) => {
            const ichi = (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{b.icon || '🔔'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className={`text-sm font-bold ${b.oqilgan ? 'text-purple-200' : 'text-white'}`}>
                        {b.sarlavha}
                      </h3>
                      {!b.oqilgan && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </div>
                    {b.matn && (
                      <p className="text-[13px] text-purple-300/90 mt-1 leading-relaxed">{b.matn}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-purple-500">
                      <span>{qachon(b.createdAt)}</span>
                      {b.admin && (
                        <>
                          <span>·</span>
                          <span>{b.admin.fullName || b.admin.username}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )

            const sinf = `block rounded-2xl border p-4 transition-all ${
              RANG[b.turi] || RANG.tizim
            } ${b.oqilgan ? 'opacity-70' : 'hover:border-yellow-500/40'}`

            // Havolasi bor xabar bosilganda o'sha joyga olib boradi va
            // o'qilgan bo'lib qoladi; havolasiz xabar shunchaki belgilanadi.
            return b.havola ? (
              <Link key={b.id} href={b.havola} onClick={() => bittasiniBelgila(b.id)} className={sinf}>
                {ichi}
              </Link>
            ) : (
              <div
                key={b.id}
                onClick={() => !b.oqilgan && bittasiniBelgila(b.id)}
                className={sinf + (b.oqilgan ? '' : ' cursor-pointer')}
              >
                {ichi}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
