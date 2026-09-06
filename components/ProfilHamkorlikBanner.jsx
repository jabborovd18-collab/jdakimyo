// components/ProfilHamkorlikBanner.jsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Ikon from '@/components/Ikon'

export default function ProfilHamkorlikBanner() {
  const { data: session } = useSession()
  const [vaqtMatni, setVaqtMatni] = useState('')

  // Foydalanuvchi super admin ekanligini aniqlash
  const userRole = session?.user?.role?.toLowerCase() || ''
  const username = session?.user?.username?.toLowerCase() || ''
  const email = session?.user?.email?.toLowerCase() || ''
  const isSuperAdmin = ['admin', 'superadmin', 'moderator'].includes(userRole) ||
    ['diyorbek_jabborov', 'jabborov', 'diyorbek'].includes(username) ||
    ['diyorbekjabborov84@gmail.com', 'jabborovd18@gmail.com', 'diyorbekjabborov12@gmail.com'].includes(email)

  useEffect(() => {
    function hisobla() {
      const hozir = new Date()
      // Bugungi sinov 17:00 da boshlanadi va 00:00 da natijalar e'lon qilinadi
      const boshlanish = new Date(hozir)
      boshlanish.setHours(17, 0, 0, 0)
      const tugash = new Date(hozir)
      tugash.setHours(24, 0, 0, 0)

      if (hozir < boshlanish) {
        const farq = boshlanish - hozir
        const h = Math.floor(farq / (1000 * 60 * 60))
        const m = Math.floor((farq % (1000 * 60 * 60)) / (1000 * 60))
        setVaqtMatni(`17:00 da ochiladi (${h}s ${m}d qoldi)`)
      } else if (hozir < tugash) {
        setVaqtMatni('⚡ Hozir faol! (Natijalar 00:00 da)')
      } else {
        setVaqtMatni('🏁 Natijalar e\'lon qilindi')
      }
    }

    hisobla()
    const timer = setInterval(hisobla, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-[var(--v3-yuza-2)] via-[var(--v3-yuza)] to-[var(--v3-yuza-2)] p-4 sm:p-5 shadow-lg transition-all hover:border-amber-400/60">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Chap qism: Belgilar va ma'lumot */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-sm text-xl">
            🧪
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                🏆 SEA Kimyo & JDA Kimyo
              </span>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 font-mono">
                <Ikon nom="soat" olcham={12} />
                <span>{vaqtMatni || 'Bugun 17:00 da'}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[var(--v3-matn)] leading-tight">
              Milliy Sertifikat Sinov Testi #1
            </h3>

            <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
              40 ta rasmiy savol • 100 daqiqa • Haqiqiy imtihon andozasi (bilimni sinash va mustahkamlash uchun)
            </p>
          </div>
        </div>

        {/* O'ng qism: Harakat tugmalari */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          {isSuperAdmin && (
            <Link
              href="/sea-ms-sinov?adminTest=true"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>👑 Super Admin Sinovi</span>
              <Ikon nom="ong" olcham={13} />
            </Link>
          )}

          <Link
            href="/sea-ms-sinov"
            className="px-5 py-2.5 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Sinov Sahifasiga O&apos;tish</span>
            <Ikon nom="ong" olcham={13} />
          </Link>

          <a
            href="https://t.me/AlchemistryIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] text-[var(--v3-matn)] border border-[var(--v3-chiziq)] text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            title="SEA Kimyo Telegram kanali"
          >
            <Ikon nom="telegram" olcham={15} />
            <span className="hidden lg:inline">@AlchemistryIQ</span>
          </a>
        </div>
      </div>
    </div>
  )
}

