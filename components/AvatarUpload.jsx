// components/AvatarUpload.jsx
"use client"
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

export default function AvatarUpload({ currentAvatar, userName, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

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

      toast.success('✓ Avatar muvaffaqiyatli yangilandi!')
      
      // Parent komponentga xabar berish
      if (onUploadSuccess) {
        onUploadSuccess(data.avatarUrl)
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
    <div className="relative group">
      {/* Avatar Display */}
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/30 border-4 border-purple-900/50">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl font-bold text-black">
            {initial}
          </div>
        )}
      </div>

      {/* Upload Overlay (hover qilganda ko'rinadi) */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${
          isUploading ? 'opacity-100 cursor-wait' : ''
        }`}
      >
        {isUploading ? (
          <>
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-white font-semibold">Yuklanmoqda...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">📷</span>
            <span className="text-xs text-white font-semibold">O'zgartirish</span>
          </>
        )}
      </div>

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