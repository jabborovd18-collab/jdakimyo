// components/ProfilHamkorlikBanner.jsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

export default function ProfilHamkorlikBanner() {
  const [event, setEvent] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    let unmounted = false

    async function loadActiveEvent() {
      try {
        const res = await fetch('/api/admin/mavsumiyhamkor')
        if (!res.ok) return
        const data = await res.json()
        const now = new Date()

        // Hozir faol bo'lgan tadbirni topamiz
        const active = data.events?.find((ev) => {
          if (!ev.isActive) return false
          const start = new Date(ev.startsAt)
          const end = new Date(ev.endsAt)
          return now >= start && now <= end
        })

        if (!unmounted && active) {
          setEvent(active)
        }
      } catch {
        // xatolik yuz bersa yashirin qoladi
      }
    }

    loadActiveEvent()

    return () => {
      unmounted = true
    }
  }, [])

  // Taymerni yangilab turish
  useEffect(() => {
    if (!event) return

    function updateTimer() {
      const now = new Date().getTime()
      const end = new Date(event.endsAt).getTime()
      const diff = end - now

      if (diff <= 0) {
        setEvent(null)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days} kun ${hours} soat`)
      } else {
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [event])

  if (!event) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-3.5 sm:p-4 shadow-lg transition-all hover:border-amber-400/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Ikon nom="kubok" olcham={18} />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Hamkorlik
              </span>
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 font-mono">
                <Ikon nom="soat" olcham={11} />
                <span>{timeLeft} qoldi</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {event.partnerName} & JDA Kimyo — {event.title}
            </h3>
          </div>
        </div>

        <Link
          href={`/hamkorlik/${event.slug}`}
          className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Testga o&apos;tish</span>
          <Ikon nom="ong" olcham={13} />
        </Link>
      </div>
    </div>
  )
}
