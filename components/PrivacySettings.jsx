"use client"

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from './Ikon'

export default function PrivacySettings() {
  const [sozlama, setSozlama] = useState(null)
  const [bolimlar, setBolimlar] = useState([])
  const [darajalar, setDarajalar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/profil/privacy')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sozlamalar yuklanmadi')
      setSozlama(data.sozlama)
      setBolimlar(data.bolimlar || [])
      setDarajalar(data.darajalar || [])
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const ozgart = async (kalit, daraja) => {
    const yangi = { ...sozlama, [kalit]: daraja }
    setSozlama(yangi)
    setSaqlanmoqda(true)

    try {
      const res = await fetch('/api/profil/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sozlama: yangi }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSozlama(data.sozlama)
      toast.success('Maxfiylik sozlamasi yangilandi')
    } catch (e) {
      setSozlama(sozlama)
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  if (yuklanmoqda) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Maxfiylik sozlamalari yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (xato) {
    return <div className="v3-panel-karta p-4 text-xs text-red-400">{xato}</div>
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="space-y-3">
        {bolimlar.map((b) => (
          <div
            key={b.kalit}
            className="v3-panel-karta p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-[var(--v3-matn)]">{b.nom}</h3>
              <p className="text-[11px] text-[var(--v3-xira)] mt-0.5">{b.tavsif}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {darajalar.map((d) => {
                const isSelected = sozlama?.[b.kalit] === d.kalit

                return (
                  <button
                    key={d.kalit}
                    type="button"
                    onClick={() => ozgart(b.kalit, d.kalit)}
                    disabled={saqlanmoqda}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                        : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                    }`}
                  >
                    {d.nom}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
