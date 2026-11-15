// components/QuizNatijalarBoshqaruvi.jsx
"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sanaVaqt } from '@/lib/sana'
import {
  MAX_QADALGAN_QUIZ,
  quizSarflanganVaqtMatni,
} from '@/lib/quiz-natija-boshqaruv'

const DEFAULT_SUMMARY = {
  totalAll: 0,
  visibleCount: 0,
  hiddenCount: 0,
  pinnedCount: 0,
  erkinCount: 0,
  officialCount: 0,
  avgPercentage: 0,
  bestPercentage: 0,
  maxPinned: MAX_QADALGAN_QUIZ,
}

const FOIZ_STILI = (foiz) => {
  if (foiz >= 80) return 'v3-tag-ochiq'
  if (foiz >= 60) return 'v3-tag-yopiq'
  return 'bg-red-500/10 text-red-400 border-red-500/25'
}

export default function QuizNatijalarBoshqaruvi() {
  const [items, setItems] = useState([])
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const [filter, setFilter] = useState('all') // 'all' | 'visible' | 'pinned' | 'hidden'
  const [source, setSource] = useState('all') // 'all' | 'erkin' | 'rasmiy'
  const [sort, setSort] = useState('default') // 'default' | 'best' | 'oldest'
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 250)
    return () => clearTimeout(id)
  }, [searchInput])

  const yukla = useCallback(
    async (pageToLoad = 1, { append = false } = {}) => {
      try {
        const params = new URLSearchParams({
          filter,
          source,
          sort,
          page: String(pageToLoad),
          limit: '20',
        })
        if (debouncedSearch) params.set('search', debouncedSearch)

        const res = await fetch(`/api/profil/quizlar?${params.toString()}`, {
          cache: 'no-store',
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(data?.error || 'Quiz natijalarini yuklab bo‘lmadi')
        }

        setItems((prev) => (append ? [...prev, ...(data.items || [])] : (data.items || [])))
        setSummary(data.summary || DEFAULT_SUMMARY)
        setTotal(Number(data.total) || 0)
        setHasMore(Boolean(data.hasMore))
        setPage(pageToLoad)
        setError('')
      } catch (err) {
        setError(err.message || 'Server bilan bog‘lanib bo‘lmadi')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [filter, source, sort, debouncedSearch],
  )

  useEffect(() => {
    setIsLoading(true)
    setConfirmDeleteId(null)
    yukla(1)
  }, [yukla])

  const amalBajar = async (item, action) => {
    if (busyId) return
    setBusyId(item.id)
    try {
      const res = await fetch(`/api/profil/quizlar/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || 'Amalni bajarib bo‘lmadi')
      }

      toast.success(data?.message || 'Saqlandi')
      setConfirmDeleteId(null)
      await yukla(1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const natijaniOchir = async (item) => {
    if (busyId) return
    setBusyId(item.id)
    try {
      const res = await fetch(`/api/profil/quizlar/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || 'Natijani o‘chirib bo‘lmadi')
      }

      toast.success(data?.message || 'Natija o‘chirildi')
      setConfirmDeleteId(null)
      await yukla(1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const filtrlarniTozala = () => {
    setFilter('all')
    setSource('all')
    setSort('default')
    setSearchInput('')
    setDebouncedSearch('')
  }

  const filterlar = [
    { id: 'all', label: 'Hammasi', count: summary.totalAll },
    { id: 'visible', label: 'Ochiq', count: summary.visibleCount },
    { id: 'pinned', label: 'Qadalgan', count: summary.pinnedCount },
    { id: 'hidden', label: 'Yashirilgan', count: summary.hiddenCount },
  ]

  const faolFiltrBormi =
    filter !== 'all' || source !== 'all' || sort !== 'default' || Boolean(debouncedSearch)

  return (
    <div className="space-y-5">
      {/* ─── UMUMIY STATISTIKA ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="v3-panel-karta p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Ochiq natijalar</span>
            <Ikon nom="quiz" olcham={14} className="text-[var(--v3-urgu-2)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {summary.visibleCount}
          </div>
          <div className="text-[10.5px] text-[var(--v3-xira)] mt-0.5">
            Jami {summary.totalAll} tadan ({summary.erkinCount} ta erkin)
          </div>
        </div>

        <div className="v3-panel-karta p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Qadalgan</span>
            <Ikon nom="qadash" olcham={14} className="text-[var(--v3-urgu)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-urgu)] mt-1">
            {summary.pinnedCount}/{summary.maxPinned}
          </div>
          <div className="text-[10.5px] text-[var(--v3-xira)] mt-0.5">
            Profil va kabinet boshida turadi
          </div>
        </div>

        <div className="v3-panel-karta p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">O{"'"}rtacha foiz</span>
            <Ikon nom="grafik" olcham={14} className="text-[var(--v3-yashil)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {summary.avgPercentage}%
          </div>
          <div className="text-[10.5px] text-[var(--v3-xira)] mt-0.5">
            Eng yaxshisi: {summary.bestPercentage}%
          </div>
        </div>

        <div className="v3-panel-karta p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-[var(--v3-xira)]">
            <span className="text-[11px]">Yashirilgan</span>
            <Ikon nom="kuzatuvYopiq" olcham={14} className="text-[var(--v3-xira)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--v3-matn)] mt-1">
            {summary.hiddenCount}
          </div>
          <div className="text-[10.5px] text-[var(--v3-xira)] mt-0.5">
            Ommaviy profilda ko{"'"}rinmaydi
          </div>
        </div>
      </div>

      {/* ─── FILTRLAR VA QIDIRUV ─── */}
      <div className="v3-panel-karta p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {filterlar.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1.5 border ${
                  active
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-transparent font-bold shadow-sm'
                    : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)] hover:border-[var(--v3-chiziq-2)]'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    active ? 'bg-black/15 text-[var(--v3-urgu-matn)]' : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)]'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Ikon
              nom="qidiruv"
              olcham={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] pointer-events-none"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Quiz nomi bo'yicha qidirish..."
              aria-label="Quiz nomi bo'yicha qidirish"
              className="v3-kiritish pl-9 pr-8 py-2 text-xs w-full"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setDebouncedSearch('')
                }}
                aria-label="Qidiruvni tozalash"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {summary.officialCount > 0 && (
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                aria-label="Manba turi"
                className="v3-kiritish py-2 px-3 text-xs bg-[var(--v3-fon-2)]"
              >
                <option value="all">Barcha turlar</option>
                <option value="erkin">Erkin quizlar</option>
                <option value="rasmiy">Ustoz va rasmiy</option>
              </select>
            )}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Saralash tartibi"
              className="v3-kiritish py-2 px-3 text-xs bg-[var(--v3-fon-2)]"
            >
              <option value="default">Qadalgan va yangi</option>
              <option value="best">Eng yuqori ball</option>
              <option value="oldest">Eng eski</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── RO'YXAT HOLATI ─── */}
      {error && items.length === 0 ? (
        <div className="v3-panel-karta p-6 text-center space-y-3">
          <p className="text-xs text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              yukla(1)
            }}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
          >
            <Ikon nom="qayta" olcham={14} />
            Qayta urinish
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
            <Ikon nom="vaqt" olcham={26} className="animate-spin" />
            <span className="text-xs">Natijalar yuklanmoqda...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="v3-panel-karta py-14 px-5 text-center space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="quiz" olcham={20} />
          </div>
          {faolFiltrBormi ? (
            <>
              <div className="text-sm font-bold text-[var(--v3-matn)]">
                Tanlangan filtr bo{"'"}yicha natija topilmadi
              </div>
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
                Qidiruv so{"'"}zini o{"'"}zgartirib ko{"'"}ring yoki barcha natijalarni ko{"'"}rish uchun filtrni tozalang.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={filtrlarniTozala}
                  className="v3-tugma text-xs py-1.5 px-4 font-semibold"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-bold text-[var(--v3-matn)]">
                Hali saqlangan quiz natijalari yo{"'"}q
              </div>
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
                Test yeching — barcha erkin va rasmiy natijalaringiz shu yerda to{"'"}planib, ularni qadash, yashirish yoki boshqarishingiz mumkin bo{"'"}ladi.
              </p>
              <div className="pt-1">
                <Link
                  href="/testlar"
                  className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
                >
                  <Ikon nom="quiz" olcham={14} />
                  Test yechishga o{"'"}tish →
                </Link>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-[11px] text-[var(--v3-xira)] px-0.5">
            <span>
              Ko{"'"}rsatilmoqda: <strong className="text-[var(--v3-matn)] font-mono">{items.length}</strong> / {total}
            </span>
            {faolFiltrBormi && (
              <button
                type="button"
                onClick={filtrlarniTozala}
                className="text-[var(--v3-urgu)] hover:underline font-semibold"
              >
                Filtrni tozalash
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {items.map((item) => {
              const vaqtMatni = quizSarflanganVaqtMatni(item.timeSpent)
              const busy = busyId === item.id
              const confirmingDelete = confirmDeleteId === item.id

              return (
                <article
                  key={item.id}
                  className={`v3-panel-karta p-4 sm:p-5 flex flex-col justify-between gap-3.5 transition-all ${
                    item.isHidden
                      ? 'opacity-80 border-dashed border-[var(--v3-chiziq-2)]'
                      : item.isPinned
                      ? 'border-[var(--v3-urgu)]/55 shadow-[0_0_0_1px_rgba(245,196,81,0.12)]'
                      : ''
                  }`}
                >
                  {/* ─── KARTA TEPASI VA MA'LUMOTLARI ─── */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                          item.isErkin
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
                        }`}
                      >
                        {item.sourceLabel}
                      </span>

                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border bg-amber-500/15 text-amber-400 border-amber-500/35">
                          <Ikon nom="qadash" olcham={11} />
                          Qadalgan
                        </span>
                      )}

                      {item.isHidden && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq-2)]">
                          <Ikon nom="kuzatuvYopiq" olcham={11} />
                          Yashirilgan
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-sm text-[var(--v3-matn)] leading-snug break-words">
                          {item.quizName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[11px] text-[var(--v3-xira)] font-mono">
                          <span>
                            {item.score}/{item.totalQuestions} to{"'"}g{"'"}ri
                          </span>
                          <span>•</span>
                          <span>{sanaVaqt(item.completedAt)}</span>
                          {vaqtMatni && (
                            <>
                              <span>•</span>
                              <span>{vaqtMatni}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-xl border text-sm font-bold font-mono ${FOIZ_STILI(
                          item.percentage,
                        )}`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* ─── BOSHQARUV TUGMALARI ─── */}
                  <div className="pt-2.5 border-t border-[var(--v3-chiziq)]/80">
                    {confirmingDelete ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
                        <span className="text-[11px] text-red-300 font-medium">
                          Natija o{"'"}chiriladi (yig{"'"}ilgan XP saqlanadi). Tasdiqlaysizmi?
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirmDeleteId(null)}
                            className="v3-tugma text-[11px] py-1 px-2.5"
                          >
                            Bekor
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => natijaniOchir(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition disabled:opacity-50"
                          >
                            <Ikon nom={busy ? 'vaqt' : 'ochir'} olcham={12} className={busy ? 'animate-spin' : ''} />
                            {busy ? 'O‘chirilmoqda...' : "Ha, o'chirish"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            disabled={busy || item.isHidden}
                            onClick={() => amalBajar(item, item.isPinned ? 'unpin' : 'pin')}
                            title={
                              item.isHidden
                                ? "Yashirilgan natijani qadash uchun avval ko'rinadigan qiling"
                                : item.isPinned
                                ? 'Qadashni olish'
                                : 'Profil boshiga qadash'
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition min-h-[32px] disabled:opacity-45 disabled:cursor-not-allowed ${
                              item.isPinned
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 hover:bg-amber-500/25'
                                : 'bg-[var(--v3-fon-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/55 hover:text-[var(--v3-urgu)]'
                            }`}
                          >
                            <Ikon nom="qadash" olcham={13} />
                            <span>{item.isPinned ? 'Qadashdan olish' : 'Qadash'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => amalBajar(item, item.isHidden ? 'unhide' : 'hide')}
                            title={
                              item.isHidden
                                ? "Ommaviy profil va kabinetda ko'rsatish"
                                : 'Ommaviy profil va kabinetdan yashirish'
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition min-h-[32px] disabled:opacity-45 ${
                              item.isHidden
                                ? 'bg-[var(--v3-yashil)]/15 text-[var(--v3-yashil)] border-[var(--v3-yashil)]/35 hover:bg-[var(--v3-yashil)]/25'
                                : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)] hover:border-[var(--v3-chiziq-2)]'
                            }`}
                          >
                            <Ikon nom={item.isHidden ? 'kuzatuv' : 'kuzatuvYopiq'} olcham={13} />
                            <span>{item.isHidden ? "Ko'rsatish" : 'Yashirish'}</span>
                          </button>
                        </div>

                        {item.canDelete ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirmDeleteId(item.id)}
                            title="Erkin quiz natijasini o'chirish"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-[11px] font-semibold transition min-h-[32px] disabled:opacity-45"
                          >
                            <Ikon nom="ochir" olcham={13} />
                            <span>O{"'"}chirish</span>
                          </button>
                        ) : (
                          <span
                            className="text-[10.5px] text-[var(--v3-xira)] inline-flex items-center gap-1"
                            title="Ustoz yoki Milliy sertifikat natijalari o'chirilmaydi — kerak bo'lsa yashirishingiz mumkin"
                          >
                            <Ikon nom="qulf" olcham={11} />
                            Rasmiy qayd
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {hasMore && (
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => {
                setIsLoadingMore(true)
                yukla(page + 1, { append: true })
              }}
              className="w-full v3-tugma py-2.5 text-xs font-bold justify-center"
            >
              {isLoadingMore ? 'Yuklanmoqda...' : 'Ko‘proq yuklash ↓'}
            </button>
          )}
        </>
      )}

      {/* ─── MAXFIYLIK ESLATMASI ─── */}
      <div className="v3-panel-karta p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-[var(--v3-xira)]">
          <Ikon nom="qalqon" olcham={16} className="text-[var(--v3-urgu)] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[var(--v3-matn)]">Eslatma:</strong>{' '}
            Qadalgan natijalar (ko{"'"}pi bilan {summary.maxPinned} ta) profilingiz boshida ko{"'"}rinadi. Yashirilgan natijalar esa
            o{"'"}z arxivingizda saqlanadi, lekin boshqalarga ko{"'"}rinmaydi.
          </p>
        </div>
        <Link
          href="/profil/maxfiylik"
          className="text-[var(--v3-urgu)] hover:underline font-semibold whitespace-nowrap shrink-0"
        >
          Umumiy maxfiylik →
        </Link>
      </div>
    </div>
  )
}
