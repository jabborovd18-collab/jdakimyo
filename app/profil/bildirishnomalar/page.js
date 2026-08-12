"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'
import Ikon from '@/components/Ikon'

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
      // Ignored
    }
  }

  if (yuklanmoqda) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Bildirishnomalar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Xabarlar va bildirishnomalar</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="qongiroq" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Bildirishnomalar</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            {oqilmagan > 0 ? `${oqilmagan} ta yangi o'qilmagan xabar` : 'Barcha xabarlar o\'qilgan'}
          </p>
        </div>

        {oqilmagan > 0 && (
          <button
            onClick={hammasiniBelgila}
            className="v3-tugma text-xs py-2 px-3.5 font-bold self-start sm:self-auto"
          >
            Hammasini o{"'"}qilgan deb belgilash
          </button>
        )}
      </div>

      {xato && (
        <div className="v3-panel-karta p-4 text-xs text-red-400">
          {xato}
        </div>
      )}

      {royxat.length === 0 ? (
        <div className="v3-panel-karta py-20 text-center text-xs text-[var(--v3-xira)] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="qongiroq" olcham={20} />
          </div>
          <p className="font-bold text-sm text-[var(--v3-matn)]">Hozircha xabarlar yo{"'"}q</p>
          <p className="max-w-xs mx-auto leading-relaxed">
            Do{"'"}stlik takliflari, sertifikatlar va ustoz topshiriqlari shu yerda ko{"'"}rinadi.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {royxat.map((b) => {
            const ichi = (
              <div className="flex items-start gap-3.5 p-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0 mt-0.5">
                  <Ikon nom={b.turi === 'chat' ? 'xabar' : b.turi === 'sertifikat' ? 'fayl' : b.turi === 'dost' ? 'odamlar' : 'qongiroq'} olcham={16} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-bold ${b.oqilgan ? 'text-[var(--v3-matn)] opacity-80' : 'text-[var(--v3-matn)]'}`}>
                      {b.sarlavha}
                    </h3>
                    {!b.oqilgan && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                    )}
                  </div>
                  {b.matn && (
                    <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{b.matn}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10.5px] text-[var(--v3-xira)] font-mono pt-0.5">
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
            )

            const wrapperClass = `v3-panel-karta p-0 overflow-hidden transition-all ${
              b.oqilgan ? 'opacity-70' : 'border-[var(--v3-urgu)]/30 hover:border-[var(--v3-urgu)]'
            }`

            return b.havola ? (
              <Link key={b.id} href={b.havola} onClick={() => bittasiniBelgila(b.id)} className={`block ${wrapperClass}`}>
                {ichi}
              </Link>
            ) : (
              <div
                key={b.id}
                onClick={() => !b.oqilgan && bittasiniBelgila(b.id)}
                className={`${wrapperClass} ${b.oqilgan ? '' : 'cursor-pointer'}`}
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
