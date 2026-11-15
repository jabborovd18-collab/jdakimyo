"use client"

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sana } from '@/lib/sana'
import Ikon from './Ikon'
import {
  SERTIFIKAT_TURLARI,
  ajratSertifikatMuhrlar,
  ajratSertifikatTavsifi,
  formatAmalMuddati,
  sertifikatHolati,
  sertifikatTuriAniqlash,
  sertifikatVerifyYoli,
} from '@/lib/sertifikat-tahlil'
import { sertifikatYuklabOlishUniversal } from '@/lib/sertifikat-yuklab-mijoz'

function holatUsuli(sertifikat) {
  const h = sertifikatHolati(sertifikat)
  if (h.holat === 'revoked') {
    return {
      yaroqli: false,
      matn: h.belgi,
      tagClass: 'bg-red-500/10 text-red-500 border-red-500/25',
    }
  }
  if (h.holat === 'expired') {
    return {
      yaroqli: false,
      matn: h.belgi,
      tagClass: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    }
  }
  return { yaroqli: true, matn: 'Yaroqli', tagClass: 'v3-tag-ochiq' }
}

export default function SertifikatKarta({ sertifikat }) {
  const h = holatUsuli(sertifikat)
  const { isMs, meta, matn } = ajratSertifikatTavsifi(sertifikat)
  const isHamkor = !isMs && sertifikatTuriAniqlash(sertifikat) === SERTIFIKAT_TURLARI.hamkor
  const { rasmlar: seals, hamkorMuhri } = ajratSertifikatMuhrlar(sertifikat.seals)
  const [yasalmoqda, setYasalmoqda] = useState(false)

  const pdfYuklab = async () => {
    setYasalmoqda(true)
    try {
      await sertifikatYuklabOlishUniversal(sertifikat)
    } catch (error) {
      console.error('[Sertifikat PDF]', error)
      toast.error("PDF faylini tayyorlab bo'lmadi")
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
        <div className="flex items-center gap-2 flex-wrap">
          <code className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--v3-urgu)]">
            {sertifikat.certId}
          </code>
          <span className={`v3-tag text-[10.5px] ${h.tagClass}`}>
            {h.matn}
          </span>
          {isMs && (
            <span className="v3-tag text-[10.5px] bg-sky-500/10 text-sky-400 border-sky-500/25">
              Rasch IRT
            </span>
          )}
          {isHamkor && (
            <span className="v3-tag text-[10.5px] bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
              Hamkorlik
            </span>
          )}
        </div>

        {sertifikat.grade && (
          <span className="v3-tag v3-tag-yopiq text-[10.5px]">
            {sertifikat.grade}
            {meta?.shkalaBalli !== undefined
              ? ` · ${meta.shkalaBalli} ball`
              : sertifikat.score != null
                ? ` · ${sertifikat.score} ball`
                : ''}
          </span>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold text-[var(--v3-matn)]">{sertifikat.fullName}</h2>
        <p className="mt-0.5 text-xs text-[var(--v3-xira)]">
          <strong className="text-[var(--v3-matn)]">{sertifikat.examName || sertifikat.fan}</strong>
          {sertifikat.reason ? ` · ${sertifikat.reason}` : ''}
        </p>
      </div>

      {isMs && meta ? (
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          {meta.shkalaBalli !== undefined && (
            <span className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-1 text-[var(--v3-matn)]">
              Rasch: <strong>{meta.shkalaBalli}</strong> ball
            </span>
          )}
          {meta.theta !== undefined && (
            <span className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-1 text-[var(--v3-xira)]">
              θ = {Number(meta.theta) > 0 ? `+${meta.theta}` : meta.theta} logit
            </span>
          )}
          {(meta.oddiyFoiz !== null && meta.oddiyFoiz !== undefined || meta.rawScore !== undefined) && (
            <span className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-1 text-[var(--v3-xira)]">
              Oddiy:{' '}
              {meta.rawScore !== undefined && meta.jamiSavollar !== undefined
                ? `${meta.rawScore}/${meta.jamiSavollar}`
                : ''}
              {meta.oddiyFoiz !== null && meta.oddiyFoiz !== undefined ? ` (${meta.oddiyFoiz}%)` : ''}
            </span>
          )}
          {sertifikat.percentile !== null && sertifikat.percentile !== undefined && (
            <span className="rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-1 text-[var(--v3-xira)]">
              Top {Math.max(1, 100 - Math.round(sertifikat.percentile))}%
            </span>
          )}
        </div>
      ) : matn ? (
        <p className="text-xs leading-relaxed text-[var(--v3-matn)] opacity-85">{matn}</p>
      ) : null}

      {hamkorMuhri && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--v3-xira)]">
          <span className="inline-flex items-center gap-1 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-0.5 text-[var(--v3-matn)]">
            <Ikon nom="hamkor" olcham={12} className="text-emerald-400" />
            <span>{hamkorMuhri.partnerName || 'Hamkor'}</span>
          </span>
          {hamkorMuhri.badgeText && (
            <span className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-semibold">
              {hamkorMuhri.badgeText}
            </span>
          )}
        </div>
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

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--v3-chiziq)] pt-3 text-[11px] font-mono text-[var(--v3-xira)]">
        <span>{sana(sertifikat.issuedAt)}</span>
        <span>·</span>
        <span>{formatAmalMuddati(sertifikat.issuedAt, sertifikat.expiresAt)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={pdfYuklab}
          disabled={yasalmoqda}
          title="PDF yuklab olish"
          className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3.5 font-bold inline-flex items-center gap-1.5"
        >
          <Ikon nom="fayl" olcham={14} />
          <span>{yasalmoqda ? 'Yuklanmoqda...' : 'PDF'}</span>
        </button>

        <Link
          href={sertifikatVerifyYoli(sertifikat.certId)}
          className="v3-tugma text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
        >
          <Ikon nom="qidiruv" olcham={14} />
          <span>Tekshirish</span>
        </Link>
      </div>
    </article>
  )
}
