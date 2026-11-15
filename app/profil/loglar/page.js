"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import { sanaVaqt } from '@/lib/sana'

const TOIFA_TABLAR = [
  { id: 'barchasi', nom: 'Barchasi', ikon: 'royxat' },
  { id: 'xavfsizlik', nom: 'Xavfsizlik', ikon: 'qalqon' },
  { id: 'sozlama', nom: 'Sozlamalar', ikon: 'sozlama' },
  { id: 'maxfiylik', nom: 'Maxfiylik', ikon: 'qulf' },
  { id: 'profil', nom: 'Profil', ikon: 'odam' },
  { id: 'sertifikat', nom: 'Sertifikatlar', ikon: 'sertifikat' },
  { id: 'natija', nom: 'Natijalar', ikon: 'quiz' },
  { id: 'hisob', nom: 'Hisob', ikon: 'vaqt' },
]

const HOLAT_FILTRLAR = [
  { id: 'barchasi', nom: 'Barcha holat' },
  { id: 'muvaffaqiyat', nom: 'Muvaffaqiyat' },
  { id: 'ogohlantirish', nom: 'Ogohlantirish' },
  { id: 'xato', nom: 'Xato' },
]

function holatBadge(holat) {
  if (holat === 'xato') {
    return {
      klass: 'bg-red-500/15 text-red-400 border-red-500/30',
      ikon: 'taqiq',
      matn: 'Xato',
    }
  }
  if (holat === 'ogohlantirish') {
    return {
      klass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      ikon: 'ogohlantirish',
      matn: 'Ogoh',
    }
  }
  return {
    klass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    ikon: 'tasdiq',
    matn: 'Ok',
  }
}

export default function ProfilLoglarPage() {
  const [toifa, setToifa] = useState('barchasi')
  const [holat, setHolat] = useState('barchasi')
  const [qidiruv, setQidiruv] = useState('')
  const [items, setItems] = useState([])
  const [xulosa, setXulosa] = useState(null)
  const [logJadvalTayyor, setLogJadvalTayyor] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const t = params.get('toifa')
    if (t && TOIFA_TABLAR.some((x) => x.id === t)) setToifa(t)
    const h = params.get('holat')
    if (h && HOLAT_FILTRLAR.some((x) => x.id === h)) setHolat(h)
  }, [])

  const yukla = useCallback(async (sahifa, qosh = false) => {
    if (!qosh) setIsLoading(true)
    else setIsLoadingMore(true)
    setError('')

    try {
      const qs = new URLSearchParams({
        toifa,
        holat,
        q: qidiruv.trim(),
        page: String(sahifa),
        limit: '25',
      })
      const res = await fetch(`/api/profil/loglar?${qs.toString()}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "Loglarni yuklab bo'lmadi")

      setItems((prev) => (qosh ? [...prev, ...(data.items || [])] : data.items || []))
      setXulosa(data.xulosa || null)
      setLogJadvalTayyor(data.logJadvalTayyor !== false)
      setPage(data.page || sahifa)
      setHasMore(Boolean(data.hasMore))
      setTotal(Number(data.total) || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [toifa, holat, qidiruv])

  useEffect(() => {
    const t = setTimeout(() => yukla(1, false), 150)
    return () => clearTimeout(t)
  }, [yukla])

  const eksportUrl = (format) => {
    const qs = new URLSearchParams({
      toifa,
      holat,
      q: qidiruv.trim(),
      format,
    })
    return `/api/profil/loglar?${qs.toString()}`
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Shaxsiy jurnal</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="royxat" olcham={22} className="text-[var(--v3-urgu)]" />
            <span>Loglar va tarix</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Kirishlar, sozlama o{"'"}zgarishlari, natijalar va sertifikatlar qaydnomasi
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={eksportUrl('csv')}
            download="profil-loglar.csv"
            className="v3-tugma text-xs py-2 px-3 inline-flex items-center gap-1.5"
          >
            <Ikon nom="fayl" olcham={13} />
            <span>CSV</span>
          </a>
          <a
            href={eksportUrl('json')}
            download="profil-loglar.json"
            className="v3-tugma text-xs py-2 px-3 inline-flex items-center gap-1.5"
          >
            <Ikon nom="hujjat" olcham={13} />
            <span>JSON</span>
          </a>
          <Link
            href="/profil/sozlama?bolim=security"
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-3 inline-flex items-center gap-1.5 font-bold"
          >
            <Ikon nom="qalqon" olcham={13} />
            <span>Xavfsizlik</span>
          </Link>
        </div>
      </div>

      {!logJadvalTayyor && (
        <div className="v3-panel-karta p-3.5 border-amber-500/35 bg-amber-500/10 flex items-center gap-2.5 text-xs text-amber-200">
          <Ikon nom="ogohlantirish" olcham={16} className="text-amber-400 shrink-0" />
          <span>
            Jurnal jadvali migratsiyasi bazaga qo{"'"}llanmaguncha tizim tarixi (sinovlar, sertifikatlar, testlar) ko{"'"}rsatilmoqda.
          </span>
        </div>
      )}

      {/* Qisqa KPI kartalar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="v3-panel-karta p-3.5">
          <div className="flex items-center justify-between text-[var(--v3-xira)] text-[11px]">
            <span>Xavfsizlik</span>
            <Ikon nom="qalqon" olcham={14} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {xulosa?.xavfsizlikSoni ?? 0}
          </div>
        </div>
        <div className="v3-panel-karta p-3.5">
          <div className="flex items-center justify-between text-[var(--v3-xira)] text-[11px]">
            <span>Sozlamalar</span>
            <Ikon nom="sozlama" olcham={14} className="text-[var(--v3-urgu)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {xulosa?.sozlamaSoni ?? 0}
          </div>
        </div>
        <div className="v3-panel-karta p-3.5">
          <div className="flex items-center justify-between text-[var(--v3-xira)] text-[11px]">
            <span>Natija & Sertifikat</span>
            <Ikon nom="sertifikat" olcham={14} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {(xulosa?.natijaSoni ?? 0) + (xulosa?.sertifikatSoni ?? 0)}
          </div>
        </div>
        <div className="v3-panel-karta p-3.5">
          <div className="flex items-center justify-between text-[var(--v3-xira)] text-[11px]">
            <span>Ogohlantirish</span>
            <Ikon nom="ogohlantirish" olcham={14} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {xulosa?.xatoSoni ?? 0}
          </div>
        </div>
      </div>

      {xulosa?.songgiKirish && (
        <div className="v3-panel-karta px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--v3-xira)]">
          <span className="inline-flex items-center gap-1.5 text-[var(--v3-matn)] font-medium">
            <Ikon nom="tasdiq" olcham={13} className="text-emerald-400" />
            So{"'"}nggi kirish: {sanaVaqt(xulosa.songgiKirish.createdAt)}
          </span>
          <span className="font-mono">
            {[xulosa.songgiKirish.qurilma, xulosa.songgiKirish.ipAddress].filter(Boolean).join(' · ') || 'Veb sessiya'}
          </span>
        </div>
      )}

      {/* Filtrlar */}
      <div className="space-y-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TOIFA_TABLAR.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setToifa(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
                toifa === t.id
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                  : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
              }`}
            >
              <Ikon nom={t.ikon} olcham={12} />
              <span>{t.nom}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Ikon
              nom="qidiruv"
              olcham={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--v3-xira)]"
            />
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Amal, sertifikat, IP yoki qurilma bo'yicha qidirish..."
              className="v3-kiritish pl-9 text-xs"
            />
          </div>
          <select
            value={holat}
            onChange={(e) => setHolat(e.target.value)}
            className="v3-kiritish text-xs sm:w-44"
          >
            {HOLAT_FILTRLAR.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ro'yxat */}
      {error ? (
        <div className="v3-panel-karta p-6 text-center space-y-3">
          <p className="text-xs text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => yukla(1, false)}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
          >
            <Ikon nom="qayta" olcham={13} />
            Qayta urinish
          </button>
        </div>
      ) : isLoading ? (
        <div className="v3-panel-karta py-16 flex flex-col items-center justify-center gap-2 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={24} className="animate-spin" />
          <span className="text-xs">Jurnal yuklanmoqda...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="v3-panel-karta py-14 text-center space-y-2 text-xs text-[var(--v3-xira)]">
          <Ikon nom="royxat" olcham={22} className="mx-auto text-[var(--v3-urgu)]" />
          <div className="font-bold text-[var(--v3-matn)]">Qaydlar topilmadi</div>
          <p>Tanlangan filtr bo{"'"}yicha hodisa mavjud emas.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="text-[11px] text-[var(--v3-xira)] font-mono">
            Jami: {total} ta qayd
          </div>
          <div className="v3-panel-karta divide-y divide-[var(--v3-chiziq)] overflow-hidden">
            {items.map((item) => {
              const badge = holatBadge(item.holat)
              const metaTab = TOIFA_TABLAR.find((t) => t.id === item.toifa) || TOIFA_TABLAR[0]
              return (
                <div key={item.id} className="p-3.5 sm:px-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center shrink-0 text-[var(--v3-urgu)] mt-0.5">
                      <Ikon nom={metaTab.ikon} olcham={15} />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-xs text-[var(--v3-matn)] break-words">
                          {item.sarlavha}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.klass}`}>
                          <Ikon nom={badge.ikon} olcham={10} />
                          <span>{badge.matn}</span>
                        </span>
                      </div>
                      {item.tafsilot && (
                        <div className="text-[11px] text-[var(--v3-xira)] break-words">
                          {item.tafsilot}
                        </div>
                      )}
                      {(item.qurilma || item.ipAddress) && (
                        <div className="text-[10.5px] font-mono text-[var(--v3-xira)]/80">
                          {[item.qurilma, item.ipAddress].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10.5px] font-mono text-[var(--v3-xira)] whitespace-nowrap shrink-0">
                    {sanaVaqt(item.createdAt)}
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => yukla(page + 1, true)}
              disabled={isLoadingMore}
              className="w-full v3-tugma py-2.5 text-xs font-bold justify-center"
            >
              {isLoadingMore ? 'Yuklanmoqda...' : "Ko'proq yuklash ↓"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
