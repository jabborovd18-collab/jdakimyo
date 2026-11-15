// components/SertifikatNusxalaTugma.jsx
"use client"

import { useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from './Ikon'
import { sertifikatQrHavolasi } from '@/lib/sertifikat-tahlil'

export default function SertifikatNusxalaTugma({ certId }) {
  const [nusxalandi, setNusxalandi] = useState(false)

  const nusxala = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : null
      const url = sertifikatQrHavolasi(certId, origin)
      await navigator.clipboard.writeText(url)
      setNusxalandi(true)
      toast.success('Nusxalandi')
      setTimeout(() => setNusxalandi(false), 2000)
    } catch {
      toast.error('Xatolik')
    }
  }

  return (
    <button
      type="button"
      onClick={nusxala}
      title="Tekshirish havolasini nusxalash"
      className="px-4 py-2.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-xs sm:text-sm font-semibold text-sky-100 inline-flex items-center justify-center gap-2 transition"
    >
      <Ikon nom={nusxalandi ? 'belgi' : 'nusxa'} olcham={15} />
      <span>{nusxalandi ? 'Nusxalandi' : 'Havola'}</span>
    </button>
  )
}
