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
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days} kun ${hours} soat`)
      } else {
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [event])

  if (!event) return null

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950/50 p-5 sm:p-6 shadow-2xl transition-all hover:border-amber-400">
      {/* Orqa fon nur effekti */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="relative flex items-center shrink-0">
            <img
              src="/images/hamkorlik/jdakimyo-neon-logo.jpg"
              alt="JDA Kimyo"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md shadow-cyan-500/20"
            />
            <img
              src="/images/hamkorlik/alchemiq-logo.jpg"
              alt="AlchemIQ"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-amber-400 -ml-4 shadow-xl shadow-amber-500/30"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Mavsumiy Hamkorlik
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/50 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1.5">
                <Ikon nom="soat" olcham={12} />
                <span>{timeLeft} qoldi</span>
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-black text-white">
              {event.partnerName} & JDA Kimyo — {event.title}
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 line-clamp-1 max-w-xl">
              {event.certReason || "Sinovda qatnashing va rasmiy QR-kodli mavsumiy sertifikatni qo'lga kiriting!"}
            </p>
          </div>
        </div>

        <Link
          href={`/hamkorlik/${event.slug}`}
          className="w-full md:w-auto text-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-transform shrink-0 flex items-center justify-center gap-2"
        >
          <span>Testda Qatnashish</span>
          <Ikon nom="ong" olcham={16} />
        </Link>
      </div>
    </div>
  )
}
