"use client"

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'
import Ikon from './Ikon'

function holat(sertifikat) {
  if (sertifikat.status !== 'valid') {
    return { yaroqli: false, matn: 'Bekor qilingan', tagClass: 'bg-red-500/10 text-red-400 border-red-500/20' }
  }
  if (sertifikat.expiresAt && new Date() > new Date(sertifikat.expiresAt)) {
    return { yaroqli: false, matn: 'Muddati tugagan', tagClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20' }
  }
  return { yaroqli: true, matn: 'Yaroqli', tagClass: 'v3-tag-ochiq' }
}

export default function SertifikatKarta({ sertifikat }) {
  const h = holat(sertifikat)
  const seals = Array.isArray(sertifikat.seals) ? sertifikat.seals : []
  const [yasalmoqda, setYasalmoqda] = useState(false)

  const pdfYuklab = async () => {
    setYasalmoqda(true)
    try {
      const { sertifikatPDFYuklab } = await import('@/lib/sertifikat-pdf')
      await sertifikatPDFYuklab(sertifikat)
    } catch (error) {
      toast.error('PDF yasashda xatolik: ' + error.message)
    } finally {
      setYasalmoqda(false)
    }
  }

  return (
    <article
      className={`v3-panel-karta p-5 space-y-3 transition-all ${
        h.yaroqli ? 'hover:border-[var(--v3-chiziq-2)]' : 'opacity-70'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <code className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--v3-urgu)]">
            {sertifikat.certId}
          </code>
          <span className={`v3-tag text-[10.5px] ${h.tagClass}`}>
            {h.matn}
          </span>
        </div>

        {sertifikat.grade && (
          <span className="v3-tag v3-tag-yopiq text-[10.5px]">
            {sertifikat.grade}
            {sertifikat.score != null ? ` · ${sertifikat.score} ball` : ''}
          </span>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold text-[var(--v3-matn)]">{sertifikat.fullName}</h2>
        <p className="mt-0.5 text-xs text-[var(--v3-xira)]">
          Fan: <strong className="text-[var(--v3-matn)]">{sertifikat.fan}</strong> — {sertifikat.reason}
        </p>
      </div>

      {sertifikat.description && (
        <p className="text-xs leading-relaxed text-[var(--v3-matn)] opacity-85">{sertifikat.description}</p>
      )}

      {seals.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {seals.map((seal) => (
            <img
              key={seal.url}
              src={seal.url}
              alt={seal.label || 'Pechat'}
              title={seal.label || 'Pechat'}
              className="h-9 w-9 rounded-lg bg-white/5 object-contain border border-[var(--v3-chiziq)]"
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--v3-chiziq)] pt-3 text-[11px] font-mono text-[var(--v3-xira)]">
        <span>Berilgan: {sana(sertifikat.issuedAt)}</span>
        {sertifikat.expiresAt && <span>Muddat: {sana(sertifikat.expiresAt)} gacha</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={pdfYuklab}
          disabled={yasalmoqda}
          className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3.5 font-bold"
        >
          {yasalmoqda ? 'Tayyorlanmoqda...' : '📄 PDF yuklab olish'}
        </button>
        <Link
          href={`/sertifikat/verify/${sertifikat.certId}`}
          className="v3-tugma text-xs py-1.5 px-3"
        >
          🔍 Tekshirish
        </Link>
      </div>
    </article>
  )
}
