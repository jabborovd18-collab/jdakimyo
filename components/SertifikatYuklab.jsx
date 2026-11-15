// components/SertifikatYuklab.jsx
"use client"
//
// Sertifikatni PDF qilib yuklab olish tugmasi (MS va umumiy sertifikatlar uchun).
import { useState } from 'react'
import toast from 'react-hot-toast'
import Ikon from './Ikon'
import { sertifikatYuklabOlishUniversal } from '@/lib/sertifikat-yuklab-mijoz'

export default function SertifikatYuklab({ sertifikat, customRank = null, sinf = '' }) {
  const [yasalmoqda, setYasalmoqda] = useState(false)

  const yuklab = async () => {
    setYasalmoqda(true)
    try {
      await sertifikatYuklabOlishUniversal(sertifikat, customRank)
    } catch (error) {
      toast.error('PDF yasashda xatolik: ' + error.message)
    } finally {
      setYasalmoqda(false)
    }
  }

  return (
    <button
      type="button"
      onClick={yuklab}
      disabled={yasalmoqda}
      title="PDF yuklab olish"
      className={
        sinf ||
        'ms-tugma-oltin px-5 py-2.5 rounded-xl border border-amber-200/80 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50'
      }
    >
      <Ikon nom="fayl" olcham={16} />
      <span>{yasalmoqda ? 'Yuklanmoqda...' : 'PDF'}</span>
    </button>
  )
}
