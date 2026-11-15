// components/AuthQobiq.jsx
"use client"

import Link from 'next/link'
import { useFon } from '@/components/FonTanlagich'
import Ikon from '@/components/Ikon'

/**
 * Kirish va ro'yxatdan o'tish sahifalari uchun yagona V4 Safir umumiy qobig'i.
 */
export default function AuthQobiq({
  sarlavha,
  izoh,
  children,
  nishon = 'Shaxsiy kabinet',
  maxWidthClass = 'max-w-[440px]',
  backHref = '/',
  backLabel = 'Bosh sahifa',
}) {
  const [fon] = useFon()

  return (
    <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link
          href={backHref}
          className="justify-self-start inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--v3-xira)] hover:text-[var(--v3-matn)] transition-colors py-2 pr-2 min-w-0"
        >
          <Ikon nom="chap" olcham={16} className="shrink-0" />
          <span className="truncate">{backLabel}</span>
        </Link>

        <Link href="/" className="justify-self-center flex items-center gap-2">
          <span className="v3-logo" aria-hidden="true" />
          <span className="v3-logo-matn text-base sm:text-lg">JDA KIMYO</span>
        </Link>

        <span aria-hidden="true" />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10">
        <div className={`w-full ${maxWidthClass}`}>
          <section className="v3-panel-karta p-5 sm:p-8 shadow-2xl">
            <div className="text-center mb-6 space-y-1.5">
              {nishon && <div className="v3-nishon text-[var(--v3-urgu)]">{nishon}</div>}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--v3-matn)]">
                {sarlavha}
              </h1>
              {izoh && (
                <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                  {izoh}
                </p>
              )}
            </div>

            {children}
          </section>
        </div>
      </main>
    </div>
  )
}

export function GoogleKirishTugma({ onClick, loading, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full min-h-[46px] py-2.5 px-4 rounded-xl border border-[var(--v3-chiziq-2)] bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.99]"
    >
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>{loading ? "Google bilan bog'lanmoqda..." : label}</span>
    </button>
  )
}

export function AuthXatoQutisi({ xato, qoshimcha }) {
  if (!xato) return null
  return (
    <div
      role="alert"
      className="mb-5 p-3.5 rounded-xl border border-red-500/35 bg-red-500/10 text-xs sm:text-[13px] text-red-400 flex items-start gap-2.5 leading-relaxed"
    >
      <Ikon nom="ogohlantirish" olcham={17} className="shrink-0 mt-0.5" />
      <div className="space-y-1 min-w-0">
        <div className="font-semibold">{xato}</div>
        {qoshimcha && <div className="text-[11.5px] text-[var(--v3-xira)]">{qoshimcha}</div>}
      </div>
    </div>
  )
}

export function AuthYuklanmoqda({ matn = 'Yuklanmoqda...' }) {
  const [fon] = useFon()
  return (
    <div data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
        <Ikon nom="vaqt" olcham={30} className="animate-spin text-[var(--v3-urgu)]" />
        <span className="text-xs sm:text-sm">{matn}</span>
      </div>
    </div>
  )
}
