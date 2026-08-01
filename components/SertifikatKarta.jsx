"use client"

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'

// Sertifikat kartasi — profildagi umumiy kartadan alohida.
//
// Umumiy karta faqat nom, tavsif va bitta raqam ko'rsatadi. Sertifikatda esa
// raqam, fan, sabab, holat va pechatlar bor va ularning har biri muhim:
// sertifikat tekshiriladigan hujjat, ro'yxatdagi bezak emas.

/**
 * Holatni hisoblaydi. Muddat bazada emas, ko'rish vaqtida tekshiriladi —
 * shuning uchun "yaroqli" deb saqlangan sertifikat muddati o'tgan bo'lsa ham
 * bu yerda o'tgan deb ko'rsatiladi. Tekshirish sahifasi ham xuddi shunday
 * hisoblaydi (lib/sertifikat.js).
 */
function holat(sertifikat) {
  if (sertifikat.status !== 'valid') {
    return { yaroqli: false, matn: 'Bekor qilingan', rang: 'red' }
  }
  if (sertifikat.expiresAt && new Date() > new Date(sertifikat.expiresAt)) {
    return { yaroqli: false, matn: 'Muddati tugagan', rang: 'orange' }
  }
  return { yaroqli: true, matn: 'Yaroqli', rang: 'green' }
}

const RANGLAR = {
  green: 'bg-green-600/20 text-green-400 border-green-600/30',
  red: 'bg-red-600/20 text-red-400 border-red-600/30',
  orange: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
}

export default function SertifikatKarta({ sertifikat }) {
  const h = holat(sertifikat)
  const seals = Array.isArray(sertifikat.seals) ? sertifikat.seals : []
  const [yasalmoqda, setYasalmoqda] = useState(false)

  // pdf-lib, fontkit, qrcode va DejaVu shriftlari birgalikda katta hajm.
  // Ular faqat tugma bosilganda yuklanadi — profil sahifasi ochilganda emas.
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
      className={`rounded-2xl border bg-slate-900/50 p-5 transition ${
        h.yaroqli
          ? 'border-purple-700/40 hover:border-yellow-500/50'
          : 'border-red-800/40 opacity-75'
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <code className="rounded border border-purple-700/50 bg-purple-950/70 px-2 py-0.5 font-mono text-xs text-yellow-400">
          {sertifikat.certId}
        </code>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${RANGLAR[h.rang]}`}>
          {h.matn}
        </span>
        {sertifikat.grade && (
          <span className="rounded-full border border-yellow-600/30 bg-yellow-600/20 px-2 py-0.5 text-xs text-yellow-400">
            {sertifikat.grade}
            {sertifikat.score != null ? ` · ${sertifikat.score} ball` : ''}
          </span>
        )}
      </div>

      <h2 className="text-lg font-bold text-white">{sertifikat.fullName}</h2>
      <p className="mt-1 text-sm text-purple-300">
        📚 {sertifikat.fan} — {sertifikat.reason}
      </p>
      {sertifikat.description && (
        <p className="mt-2 text-xs leading-relaxed text-purple-400">{sertifikat.description}</p>
      )}

      {seals.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {seals.map((seal) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={seal.url}
              src={seal.url}
              alt={seal.label || 'Pechat'}
              title={seal.label || 'Pechat'}
              className="h-10 w-10 rounded bg-white/5 object-contain"
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-purple-800/30 pt-3 text-xs text-purple-500">
        <span>📅 {sana(sertifikat.issuedAt)}</span>
        {sertifikat.expiresAt && <span>⏳ {sana(sertifikat.expiresAt)} gacha</span>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={pdfYuklab}
          disabled={yasalmoqda}
          className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-2 text-xs font-bold text-black transition hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50"
        >
          {yasalmoqda ? '⏳ Tayyorlanmoqda...' : '📄 PDF yuklab olish'}
        </button>
        <Link
          href={`/sertifikat/verify/${sertifikat.certId}`}
          className="rounded-lg border border-purple-600/50 bg-purple-800/40 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-700/50"
        >
          🔍 Tekshirish sahifasi
        </Link>
      </div>
    </article>
  )
}
