"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import ProfileCollection from '@/components/ProfileCollection'

export default function Page() {
  const [tab, setTab] = useState('certificates')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search).get('tab')
    if (p === 'ms' || p === 'ms_urinishlar') setTab('ms_urinishlar')
  }, [])

  return (
    <ProfileCollection
      type={tab}
      actions={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl p-1 bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] gap-1">
            <button
              type="button"
              onClick={() => setTab('certificates')}
              className={`px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 transition-all ${
                tab === 'certificates'
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                  : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
              }`}
            >
              <Ikon nom="fayl" olcham={13} />
              <span>Sertifikatlar</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('ms_urinishlar')}
              className={`px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 transition-all ${
                tab === 'ms_urinishlar'
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                  : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
              }`}
            >
              <Ikon nom="sertifikat" olcham={13} />
              <span>MS natijalari</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/sertifikat" className="v3-tugma text-xs inline-flex items-center gap-1.5">
              <Ikon nom="qalqon" olcham={14} />
              <span>Tekshirish</span>
            </Link>
            <Link
              href="/milliy-sertifikat"
              className="v3-tugma v3-tugma-asosiy text-xs inline-flex items-center gap-1.5"
            >
              <Ikon nom="atom" olcham={14} />
              <span>Sinovlar</span>
            </Link>
          </div>
        </div>
      }
    />
  )
}
