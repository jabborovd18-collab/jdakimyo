// components/SertifikatYuklab.jsx
"use client"
//
// Sertifikatni PDF qilib yuklab olish tugmasi.
//
// Tekshirish sahifasida ham turadi, ya'ni sertifikatni FAQAT egasi emas,
// havolani ochgan har kim yuklab oladi. Nega shunday: sertifikat
// ko'rsatish uchun beriladi — ish beruvchi yoki o'qituvchi uni qo'lida
// saqlab qo'ymoqchi bo'lishi tabiiy. Bu yerda maxfiy narsa yo'q: sahifada
// ko'rinib turgan ma'lumot PDF ga tushadi, xolos.
//
// Bekor qilingan yoki muddati o'tgan sertifikat ham yuklanadi — PDF da
// uning holati yozilgan bo'ladi va uni yashirish aldashga yo'l ochardi.
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SertifikatYuklab({ sertifikat, sinf = '' }) {
  const [yasalmoqda, setYasalmoqda] = useState(false)

  const yuklab = async () => {
    setYasalmoqda(true)
    try {
      // pdf-lib, fontkit, qrcode va DejaVu shriftlari birgalikda katta
      // hajm — shuning uchun faqat bosilganda yuklanadi
      const { sertifikatPDFYuklab } = await import('@/lib/sertifikat-pdf')
      await sertifikatPDFYuklab(sertifikat)
    } catch (error) {
      toast.error('PDF yasashda xatolik: ' + error.message)
    } finally {
      setYasalmoqda(false)
    }
  }

  return (
    <button
      onClick={yuklab}
      disabled={yasalmoqda}
      className={`px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-50 ${sinf}`}
    >
      {yasalmoqda ? '⏳ Tayyorlanmoqda...' : '📄 PDF yuklab olish'}
    </button>
  )
}
