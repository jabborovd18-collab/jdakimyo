"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Ikon from './Ikon'
import { sana, sanaVaqt } from '@/lib/sana'
import {
  HAFTA_KUNLARI,
  faollikJadvaliTuz,
  faollikXulosasi,
  kunKalitidanOldin,
  streakHisobla,
  toshkentSanaKaliti,
} from '@/lib/faoliyat'

const FETCH_TIMEOUT_MS = 25000

const ORALIQLAR = [
  { id: 30, nom: '30 kun' },
  { id: 90, nom: '3 oy' },
  { id: 365, nom: '1 yil' },
]

const TOLLIQ_HAFTA_KUNLARI = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
]

const FAOLLIK_KATEGORIYALARI = [
  { key: 'quizCount', label: 'Test va quizlar', shortLabel: 'Quiz', ikon: 'quiz', rang: 'bg-sky-400', matnRang: 'text-sky-300' },
  { key: 'videoCount', label: 'Video darslar', shortLabel: 'Video', ikon: 'video', rang: 'bg-cyan-300', matnRang: 'text-cyan-300' },
  { key: 'missionCount', label: 'Kunlik missiyalar', shortLabel: 'Missiya', ikon: 'kubok', rang: 'bg-[var(--v3-urgu)]', matnRang: 'text-[var(--v3-urgu)]' },
  { key: 'compoundCount', label: 'Modda va laboratoriya', shortLabel: 'Modda', ikon: 'kolba', rang: 'bg-indigo-400', matnRang: 'text-indigo-300' },
]

function levelRangi(level) {
  switch (level) {
    case 1:
      return 'bg-sky-500/25 border-sky-400/40'
    case 2:
      return 'bg-sky-400/50 border-sky-300/65'
    case 3:
      return 'bg-cyan-300/80 border-cyan-200/85'
    case 4:
      return 'bg-[var(--v3-urgu)] border-[var(--v3-urgu)] shadow-[0_0_8px_rgba(250,204,21,0.28)]'
    default:
      return 'bg-[var(--v3-fon)]/85 border-[var(--v3-chiziq)]'
  }
}

function sanaSarlavhasi(dateKey, todayKey) {
  if (!dateKey) return ''
  if (dateKey === todayKey) return `Bugun, ${sana(dateKey)}`
  if (dateKey === kunKalitidanOldin(todayKey, 1)) return `Kecha, ${sana(dateKey)}`
  const [yil, oy, kun] = dateKey.split('-').map(Number)
  const weekday = TOLLIQ_HAFTA_KUNLARI[new Date(Date.UTC(yil, oy - 1, kun)).getUTCDay()]
  return `${sana(dateKey)} (${weekday})`
}

export default function ActivityHeatmap() {
  const [activities, setActivities] = useState([])
  const [todayKey, setTodayKey] = useState(() => toshkentSanaKaliti())
  const [meta, setMeta] = useState({
    visitStreak: 0,
    longestVisitStreak: 0,
    lastActive: null,
  })
  const [rangeDays, setRangeDays] = useState(365)
  const [selectedDate, setSelectedDate] = useState('')
  const [hoveredDate, setHoveredDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollerRef = useRef(null)

  const fetchActivityHistory = useCallback(async () => {
    setIsLoading(true)
    setError('')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch('/api/activity/history?days=365', {
        signal: controller.signal,
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.activities) {
        throw new Error(data?.error || `Faoliyat tarixi yuklanmadi (${response.status})`)
      }

      const joriyKun = data.todayKey || toshkentSanaKaliti()
      setActivities(data.activities)
      setTodayKey(joriyKun)
      setMeta({
        visitStreak: Number(data.summary?.visitStreak) || 0,
        longestVisitStreak: Number(data.summary?.longestVisitStreak) || 0,
        lastActive: data.summary?.lastActive || null,
      })
      setSelectedDate((prev) => prev || joriyKun)
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server javob berishga juda ko‘p vaqt oldi. Qayta urinib ko‘ring.')
      } else {
        setError(err.message || 'Faoliyat tarixini yuklashda xatolik yuz berdi.')
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivityHistory()
  }, [fetchActivityHistory])

  const windowActivities = useMemo(() => {
    if (rangeDays >= 365) return activities
    const startKey = kunKalitidanOldin(todayKey, rangeDays - 1)
    return activities.filter((a) => a.date >= startKey && a.date <= todayKey)
  }, [activities, rangeDays, todayKey])

  const { weeks, monthLabels } = useMemo(
    () => faollikJadvaliTuz(windowActivities, { todayKey, days: rangeDays }),
    [windowActivities, todayKey, rangeDays]
  )

  const summary = useMemo(
    () => faollikXulosasi(windowActivities, todayKey),
    [windowActivities, todayKey]
  )

  const yearStreak = useMemo(
    () => streakHisobla(activities, todayKey),
    [activities, todayKey]
  )

  const dayMap = useMemo(() => {
    const m = new Map()
    for (const week of weeks) {
      for (const day of week) {
        if (day) m.set(day.date, day)
      }
    }
    return m
  }, [weeks])

  // Oraliq o'zgarganda tanlangan kun diapazonda qolishini ta'minlaymiz
  const activeDate = useMemo(() => {
    if (hoveredDate && dayMap.has(hoveredDate)) return hoveredDate
    if (selectedDate && dayMap.has(selectedDate)) return selectedDate
    return todayKey
  }, [hoveredDate, selectedDate, dayMap, todayKey])

  const activeDay = dayMap.get(activeDate) || {
    date: activeDate || todayKey,
    totalActivities: 0,
    level: 0,
    quizCount: 0,
    videoCount: 0,
    missionCount: 0,
    compoundCount: 0,
    totalXP: 0,
    isToday: activeDate === todayKey,
  }

  const recentActiveDays = useMemo(
    () =>
      windowActivities
        .filter((d) => d.totalActivities > 0)
        .slice(-6)
        .reverse(),
    [windowActivities]
  )

  // Mobil va kichik ekranda eng so'nggi (Bugungi) haftalar darhol ko'rinishi uchun o'ngga suramiz
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const frame = requestAnimationFrame(() => {
      el.scrollLeft = Math.max(0, el.scrollWidth - el.clientWidth)
    })
    return () => cancelAnimationFrame(frame)
  }, [rangeDays, weeks.length, isLoading])

  if (isLoading) {
    return (
      <div className="v3-panel-karta p-5 sm:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 bg-[var(--v3-yuza-2)] rounded w-44" />
            <div className="h-7 bg-[var(--v3-yuza-2)] rounded-lg w-40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[var(--v3-yuza)] rounded-xl" />
            ))}
          </div>
          <div className="h-36 bg-[var(--v3-yuza)] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="v3-panel-karta p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center mx-auto">
          <Ikon nom="taqiq" olcham={22} />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-[var(--v3-matn)]">Faollik grafigi yuklanmadi</h2>
          <p className="text-xs text-[var(--v3-xira)] max-w-md mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchActivityHistory}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
        >
          <Ikon nom="qayta" olcham={14} />
          <span>Qayta urinish</span>
        </button>
      </div>
    )
  }

  const consistencyPct = Math.round((summary.activeDays / Math.max(1, windowActivities.length)) * 100)

  return (
    <div className="space-y-5">
      {/* Asosiy Heatmap kartasi */}
      <div className="v3-panel-karta p-4 sm:p-6 space-y-5">
        {/* Sarlavha va davr tanlagich */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
              <Ikon nom="grafik" olcham={18} />
            </div>
            <div>
              <div className="v3-nishon">Kunlik monitoring</div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--v3-matn)]">
                O{"'"}quv faolligi xaritasi
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <div
              className="inline-flex p-1 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]"
              role="group"
              aria-label="Vaqt oralig'i"
            >
              {ORALIQLAR.map((opt) => {
                const active = rangeDays === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRangeDays(opt.id)}
                    aria-pressed={active}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      active
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm font-bold'
                        : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                    }`}
                  >
                    {opt.nom}
                  </button>
                )
              })}
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-right font-mono">
              <span className="text-xs font-bold text-[var(--v3-matn)]">{summary.totalActivities}</span>
              <span className="text-[10.5px] text-[var(--v3-xira)] ml-1.5">amal</span>
            </div>
          </div>
        </div>

        {/* Asosiy 4 ko'rsatkich */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
            <div className="flex items-center justify-between text-[10.5px] text-[var(--v3-xira)]">
              <span>O{"'"}quv seriyasi</span>
              <Ikon nom="olov" olcham={13} className="text-orange-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-orange-400">
              {yearStreak.currentStreak} kun
            </div>
            <div className="text-[10px] text-[var(--v3-xira)] truncate">
              {yearStreak.bugunFaolmi
                ? 'Bugun bajarildi'
                : yearStreak.currentStreak > 0
                ? 'Bugun hali 0 — davom eting'
                : `Kirish seriyasi: ${meta.visitStreak} kun`}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
            <div className="flex items-center justify-between text-[10.5px] text-[var(--v3-xira)]">
              <span>Eng uzun seriya</span>
              <Ikon nom="kubok" olcham={13} className="text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-400">
              {yearStreak.maxStreak} kun
            </div>
            <div className="text-[10px] text-[var(--v3-xira)] truncate">
              Kirish rekordi: {meta.longestVisitStreak} kun
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
            <div className="flex items-center justify-between text-[10.5px] text-[var(--v3-xira)]">
              <span>Faol kunlar</span>
              <Ikon nom="taqvim" olcham={13} className="text-[var(--v3-urgu-2)]" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-[var(--v3-urgu-2)]">
              {summary.activeDays} kun
            </div>
            <div className="text-[10px] text-[var(--v3-xira)] truncate">
              {windowActivities.length} kundan {consistencyPct}% muntazam
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
            <div className="flex items-center justify-between text-[10.5px] text-[var(--v3-xira)]">
              <span>Davr XP si</span>
              <Ikon nom="uchqun" olcham={13} className="text-[var(--v3-urgu)]" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-[var(--v3-urgu)]">
              {summary.totalXP} XP
            </div>
            <div className="text-[10px] text-[var(--v3-xira)] truncate">
              Bugun: +{summary.bugungi.totalXP} XP
            </div>
          </div>
        </div>

        {/* Sinxronlashtirilgan Heatmap Grid (oylar va hafta kataklari birga scroll bo'ladi) */}
        <div className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-3 sm:p-4 space-y-3">
          <div ref={scrollerRef} className="overflow-x-auto pb-1.5">
            <div className="inline-flex min-w-full items-start">
              {/* Chapdagi qotirilgan hafta kunlari ustuni */}
              <div className="sticky left-0 z-10 pr-2.5 bg-[var(--v3-fon-2)] shrink-0">
                <div className="h-5" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  {HAFTA_KUNLARI.map((kun, idx) => (
                    <div
                      key={kun}
                      className="h-3.5 w-5 flex items-center justify-end text-[10px] font-mono text-[var(--v3-xira)] select-none"
                    >
                      {idx % 2 === 0 ? kun : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Oylar va hafta ustunlari */}
              <div className="flex flex-col">
                <div className="flex gap-1 h-5 items-center">
                  {monthLabels.map((label, idx) => (
                    <div key={idx} className="w-3.5 shrink-0 relative overflow-visible">
                      {label && (
                        <span className="absolute left-0 top-0.5 text-[10px] font-mono text-[var(--v3-xira)] whitespace-nowrap pointer-events-none select-none">
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1" role="grid" aria-label="Kunlik faollik jadvali">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
                      {week.map((day, dayIndex) => {
                        if (!day) {
                          return <div key={dayIndex} className="w-3.5 h-3.5" aria-hidden="true" />
                        }

                        const isSelected = activeDate === day.date

                        return (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => setSelectedDate(day.date)}
                            onMouseEnter={() => setHoveredDate(day.date)}
                            onMouseLeave={() => setHoveredDate(null)}
                            onFocus={() => setHoveredDate(day.date)}
                            onBlur={() => setHoveredDate(null)}
                            aria-label={`${sana(day.date)}: ${day.totalActivities} ta amal, ${day.totalXP} XP`}
                            aria-pressed={isSelected}
                            className={`w-3.5 h-3.5 rounded-[3px] border transition-colors focus:outline-none ${levelRangi(day.level)} ${
                              isSelected
                                ? 'ring-2 ring-[var(--v3-urgu)] ring-offset-1 ring-offset-[var(--v3-fon-2)]'
                                : day.isToday
                                ? 'ring-1 ring-[var(--v3-urgu-2)]/75'
                                : 'hover:border-white/70'
                            }`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pastki legenda */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--v3-chiziq)]/60 text-[10.5px] font-mono text-[var(--v3-xira)]">
            <span>Tafsilot uchun istalgan katakni bosing</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span>Kam</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-[3px] border ${levelRangi(level)}`}
                  />
                ))}
              </div>
              <span>Ko{"'"}p</span>
            </div>
          </div>
        </div>

        {/* Tanlangan kun tafsiloti (desktop hover + mobile tap) */}
        <div className="rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-3.5 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[var(--v3-matn)]">
                {sanaSarlavhasi(activeDay.date, todayKey)}
              </span>
              {activeDay.isToday && (
                <span className="v3-tag v3-tag-ochiq text-[10px]">Bugun</span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)] font-bold">
                {activeDay.totalActivities} amal
              </span>
              <span className="px-2 py-0.5 rounded-lg border border-[var(--v3-urgu)]/30 bg-[var(--v3-urgu)]/10 text-[var(--v3-urgu)] font-bold">
                +{activeDay.totalXP} XP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FAOLLIK_KATEGORIYALARI.map((cat) => (
              <div
                key={cat.key}
                className="px-3 py-2 rounded-lg border border-[var(--v3-chiziq)]/80 bg-[var(--v3-yuza)]/40 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Ikon nom={cat.ikon} olcham={13} className={`${cat.matnRang} shrink-0`} />
                  <span className="text-[11px] text-[var(--v3-xira)] truncate">{cat.shortLabel}</span>
                </div>
                <span className="text-xs font-bold font-mono text-[var(--v3-matn)]">
                  {activeDay[cat.key] || 0}
                </span>
              </div>
            ))}
          </div>

          {activeDay.totalActivities === 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--v3-xira)]">
              <span>Bu kunda qayd etilgan o{"'"}quv faoliyati yo{"'"}q.</span>
              {activeDay.isToday && (
                <Link href="/testlar" className="text-[var(--v3-urgu)] font-semibold hover:underline">
                  Bugun test yechish →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pastki tahlil va oxirgi faol kunlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Faoliyat tarkibi */}
        <div className="v3-panel-karta p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--v3-chiziq)]">
            <h3 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="uchqun" olcham={16} className="text-[var(--v3-urgu)]" />
              <span>Faoliyat tarkibi</span>
            </h3>
            <span className="text-[10.5px] font-mono text-[var(--v3-xira)]">
              Oxirgi {rangeDays === 365 ? '1 yil' : `${rangeDays} kun`}
            </span>
          </div>

          <div className="space-y-3">
            {FAOLLIK_KATEGORIYALARI.map((cat) => {
              const count = summary[cat.key] || 0
              const pct = summary.totalActivities > 0
                ? Math.round((count / summary.totalActivities) * 100)
                : 0
              return (
                <div key={cat.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[var(--v3-matn)]">
                      <Ikon nom={cat.ikon} olcham={14} className={cat.matnRang} />
                      <span>{cat.label}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--v3-xira)]">
                      <strong className="text-[var(--v3-matn)]">{count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--v3-fon-2)] overflow-hidden border border-[var(--v3-chiziq)]/60">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${cat.rang}`}
                      style={{ width: `${count > 0 ? Math.max(4, pct) : 0}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-3 border-t border-[var(--v3-chiziq)]/70 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
              <span className="text-[var(--v3-xira)] block">Eng faol kun</span>
              <strong className="text-[var(--v3-matn)] font-mono mt-0.5 block truncate">
                {summary.engFaolKun
                  ? `${sana(summary.engFaolKun.date)} (${summary.engFaolKun.totalActivities} amal)`
                  : 'Hali qayd etilmagan'}
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)]">
              <span className="text-[var(--v3-xira)] block">Oxirgi kirish</span>
              <strong className="text-[var(--v3-matn)] font-mono mt-0.5 block truncate">
                {meta.lastActive ? sanaVaqt(meta.lastActive) : 'Hozir'}
              </strong>
            </div>
          </div>
        </div>

        {/* So'nggi faol kunlar jurnali */}
        <div className="v3-panel-karta p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--v3-chiziq)]">
            <h3 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="vaqt" olcham={16} className="text-[var(--v3-urgu-2)]" />
              <span>So{"'"}nggi faol kunlar</span>
            </h3>
            <Link href="/profil/quizlar" className="text-[11px] font-semibold text-[var(--v3-urgu)] hover:underline">
              Quiz tarixi →
            </Link>
          </div>

          {recentActiveDays.length === 0 ? (
            <div className="py-6 text-center space-y-4">
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto leading-relaxed">
                Bu oraliqda hali o{"'"}quv amallari yozilmagan. Quyidagi bo{"'"}limlardan birida qatnashing — barcha natijalar shu jadvalda avtomatik aks etadi:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link href="/testlar" className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3.5 font-bold">
                  Test yechish
                </Link>
                <Link href="/maktabkimyo" className="v3-tugma text-xs py-1.5 px-3.5">
                  Video darslar
                </Link>
                <Link href="/profil" className="v3-tugma text-xs py-1.5 px-3.5">
                  Kunlik missiyalar
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActiveDays.map((day) => {
                const isSelected = activeDate === day.date
                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[var(--v3-urgu)] bg-[var(--v3-urgu)]/10'
                        : 'border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] hover:border-[var(--v3-chiziq-2)]'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs font-bold text-[var(--v3-matn)] truncate">
                        {sanaSarlavhasi(day.date, todayKey)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-[var(--v3-xira)] font-mono">
                        {day.quizCount > 0 && <span>{day.quizCount} quiz</span>}
                        {day.videoCount > 0 && <span>{day.videoCount} video</span>}
                        {day.missionCount > 0 && <span>{day.missionCount} missiya</span>}
                        {day.compoundCount > 0 && <span>{day.compoundCount} modda</span>}
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-bold text-[var(--v3-matn)]">{day.totalActivities} amal</div>
                      <div className="text-[10.5px] text-[var(--v3-urgu)]">+{day.totalXP} XP</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
