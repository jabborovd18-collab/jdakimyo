// components/SertifikatQidiruvPortal.jsx
//
// Ommaviy V4 Safir va Oltin sertifikat tekshirish portali (/sertifikat va /milliy-sertifikat/tekshir).
// Foydalanuvchi QR kod skanerlamasdan turib sertifikat raqami (JDA-MS-*, JDA-*, AK-*) orqali tekshiradi.
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Ikon from './Ikon'
import { sertifikatVerifyYoli } from '@/lib/sertifikat-tahlil'

const FORMAT_NAMUNALAR = [
  { kod: 'JDA-MS-2026-', izoh: 'MS' },
  { kod: 'JDA-2026-', izoh: 'Olimpiada' },
  { kod: 'AK-JK-', izoh: 'Hamkor' },
]

export default function SertifikatQidiruvPortal({
  qaytishHref = '/',
  qaytishMatn = 'Bosh sahifa',
  msFokus = false,
}) {
  const router = useRouter()
  const [kod, setKod] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xato, setXato] = useState('')

  const tekshir = async (e) => {
    e.preventDefault()
    const toza = kod.replace(/\s+/g, '').toUpperCase()
    if (!toza) {
      setXato('Sertifikat raqamini kiriting')
      return
    }

    setXato('')
    setYuklanmoqda(true)
    try {
      const res = await fetch(`/api/sertifikat/${encodeURIComponent(toza)}`, {
        cache: 'no-store',
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.certificate) {
        setXato(data?.error || `"${toza}" topilmadi`)
        setYuklanmoqda(false)
        return
      }

      router.push(sertifikatVerifyYoli(data.certificate.certId || toza))
    } catch {
      setXato('Server xatosi. Qayta urining.')
      setYuklanmoqda(false)
    }
  }

  return (
    <main className="ms-akademik ms-fon min-h-screen flex flex-col justify-between text-white relative overflow-x-hidden p-4 sm:p-6">
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-sky-400/25 pb-4 relative z-10 gap-3">
        <Link
          href={qaytishHref}
          className="inline-flex items-center gap-2 text-xs text-sky-100 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35"
        >
          <Ikon nom="chap" olcham={15} />
          <span>{qaytishMatn}</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 font-semibold">
          <Ikon nom="qalqon" olcham={15} />
          <span>JDA KIMYO</span>
        </div>
      </header>

      <section className="max-w-2xl mx-auto w-full my-8 sm:my-12 relative z-10 space-y-6">
        <div className="ms-karta p-6 sm:p-8 rounded-3xl border border-sky-300/35 shadow-[0_24px_55px_-20px_rgba(2,8,34,0.9)] space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/50 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Ikon nom="sertifikat" olcham={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {msFokus ? 'Milliy Sertifikat tekshiruvi' : 'Sertifikat tekshiruvi'}
            </h1>
          </div>

          <form onSubmit={tekshir} className="space-y-3">
            <label htmlFor="sertifikat-kod-input" className="sr-only">
              Sertifikat raqami
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/75 pointer-events-none">
                  <Ikon nom="qidiruv" olcham={18} />
                </span>
                <input
                  id="sertifikat-kod-input"
                  type="text"
                  value={kod}
                  onChange={(e) => {
                    setKod(e.target.value.toUpperCase())
                    if (xato) setXato('')
                  }}
                  placeholder="JDA-MS-2026-..."
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#071134]/95 border border-sky-400/40 focus:border-amber-300 focus:outline-none text-white placeholder:text-sky-300/45 font-mono text-sm tracking-wide transition"
                />
              </div>
              <button
                type="submit"
                disabled={yuklanmoqda}
                className="ms-tugma-oltin px-6 py-3.5 rounded-2xl border border-amber-200 font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shrink-0"
              >
                <Ikon nom={yuklanmoqda ? 'soat' : 'tasdiq'} olcham={17} />
                <span>{yuklanmoqda ? 'Tekshirilmoqda...' : 'Tekshirish'}</span>
              </button>
            </div>

            {xato && (
              <div
                role="alert"
                className="rounded-2xl bg-rose-500/15 border border-rose-400/50 px-4 py-3 text-xs sm:text-sm text-rose-200 flex items-start gap-2.5"
              >
                <Ikon nom="ogohlantirish" olcham={18} className="shrink-0 mt-0.5 text-rose-300" />
                <span>{xato}</span>
              </div>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {FORMAT_NAMUNALAR.map((f) => (
              <button
                key={f.kod}
                type="button"
                onClick={() => {
                  setKod(f.kod)
                  setXato('')
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#091642]/80 hover:bg-[#102260] border border-sky-400/25 hover:border-amber-300/45 px-3 py-1.5 transition cursor-pointer text-[11px]"
              >
                <span className="font-mono font-bold text-amber-300">{f.kod}...</span>
                <span className="text-sky-200/75">{f.izoh}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
            <Link
              href="/milliy-sertifikat"
              className="px-4 py-2 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-sky-100 font-semibold inline-flex items-center gap-1.5 transition"
            >
              <Ikon nom="atom" olcham={14} />
              <span>Sinovlar</span>
            </Link>
            <Link
              href="/profil/sertifikatlar"
              className="px-4 py-2 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-sky-100 font-semibold inline-flex items-center gap-1.5 transition"
            >
              <Ikon nom="sertifikat" olcham={14} />
              <span>Sertifikatlarim</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-[11px] text-sky-200/80 border-t border-sky-400/20 pt-4 relative z-10 flex items-center justify-center gap-2">
        <span>JDA KIMYO &copy; {new Date().getFullYear()}</span>
        <span>·</span>
        <Link href="/hamkorlik/boglanish" className="text-amber-300 hover:underline">
          Bog&apos;lanish
        </Link>
      </footer>
    </main>
  )
}
