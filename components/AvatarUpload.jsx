// components/AvatarUpload.jsx
"use client"
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

export default function AvatarUpload({ currentAvatar, userName, onUploadSuccess, onAvatarChange }) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // Foydalanuvchining bosh harfi (agar rasm bo'lmasa)
  const initial = userName?.charAt(0)?.toUpperCase() || 'U'

  // Fayl tanlanganda
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validatsiya
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Faqat JPEG, PNG, WebP yoki GIF formatlar ruxsat etilgan')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Rasm hajmi 5MB dan oshmasligi kerak')
      return
    }

    // Preview ko'rsatish
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Yuklash
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Yuklashda xatolik')
      }

      toast.success('Avatar muvaffaqiyatli yangilandi!')

      const callback = onUploadSuccess || onAvatarChange
      if (callback) {
        callback(data.avatarUrl)
      }

      setPreview(null)
    } catch (error) {
      toast.error(error.message)
      setPreview(null)
    } finally {
      setIsUploading(false)
      // Input'ni tozalash
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Ko'rsatiladigan rasm (preview yoki hozirgi avatar)
  const displayImage = preview || currentAvatar

  return (
    <div className="relative group shrink-0">
      {/* Avatar Display */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-[var(--v3-urgu)] bg-[var(--v3-yuza-2)]">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--v3-urgu)] to-[var(--v3-urgu-2)] flex items-center justify-center text-4xl sm:text-5xl font-bold text-[var(--v3-urgu-matn)]">
            {initial}
          </div>
        )}
      </div>

      {/* Upload Overlay (desktop hover va tap uchun) */}
      <button
        type="button"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="Profil rasmini o'zgartirish"
        className={`absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all cursor-pointer ${
          isUploading ? 'opacity-100 cursor-wait' : ''
        }`}
      >
        {isUploading ? (
          <>
            <Ikon nom="vaqt" olcham={22} className="text-[var(--v3-urgu)] animate-spin" />
            <span className="text-[11px] text-white font-semibold">Yuklanmoqda...</span>
          </>
        ) : (
          <>
            <Ikon nom="kamera" olcham={22} className="text-white" />
            <span className="text-[11px] text-white font-semibold">O&apos;zgartirish</span>
          </>
        )}
      </button>

      {/* Mobil qurilmalar uchun doimiy ko'rinadigan burchak tugmasi */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-2 border-[var(--v3-fon-2)] shadow-md flex items-center justify-center md:opacity-90"
      >
        <Ikon nom={isUploading ? 'vaqt' : 'kamera'} olcham={15} className={isUploading ? 'animate-spin' : ''} />
      </span>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}