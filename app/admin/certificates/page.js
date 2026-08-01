// app/admin/certificates/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { sanaQisqa } from '@/lib/sana'

const BOSH_FORMA = {
  id: '',
  userId: '',
  fullName: '',
  fan: '',
  reason: '',
  description: '',
  seals: [],
  grade: '',
  score: '',
  expiresAt: '',
}

/** "2026-08-02" — <input type="date"> shu shaklni kutadi */
const dateInput = (qiymat) =>
  qiymat ? new Date(qiymat).toISOString().split('T')[0] : ''

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Filtrlar
  const [fanFilter, setFanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(BOSH_FORMA)

  // Foydalanuvchi tanlash
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)

  const [isUploadingSeal, setIsUploadingSeal] = useState(false)

  useEffect(() => {
    fetchCertificates()
  }, [fanFilter, statusFilter, search])

  const fetchCertificates = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ fan: fanFilter, status: statusFilter, search })
      const res = await fetch(`/api/admin/certificates?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCertificates(data.certificates)
      setStats(data.stats)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Foydalanuvchini qidirish — yozishni to'xtatgandan keyin so'rov ketadi,
  // har bosilgan harfga alohida so'rov yubormaslik uchun.
  useEffect(() => {
    if (!showModal) return
    const so = userSearch.trim()
    if (so.length < 2) {
      setUserResults([])
      return
    }

    const kutish = setTimeout(async () => {
      setIsSearchingUsers(true)
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(so)}&limit=8`)
        const data = await res.json()
        if (res.ok) setUserResults(data.users || [])
      } catch {
        // qidiruv xatosi jim o'tadi — admin yozishda davom etadi
      } finally {
        setIsSearchingUsers(false)
      }
    }, 350)

    return () => clearTimeout(kutish)
  }, [userSearch, showModal])

  const openAddModal = () => {
    setIsEditing(false)
    setFormData(BOSH_FORMA)
    setSelectedUser(null)
    setUserSearch('')
    setUserResults([])
    setShowModal(true)
  }

  // Tahrirlash — xato yozilgan ism yoki fanni tuzatish uchun.
  //
  // Sertifikat raqami va kimga berilgani o'zgarmaydi: raqam QR kodda va
  // tarqatilgan PDF'da turadi, oluvchini almashtirish esa tahrir emas —
  // bu allaqachon berilgan sertifikatni boshqa odamga o'tkazish bo'lardi.
  const openEditModal = (cert) => {
    setIsEditing(true)
    setFormData({
      id: cert.id,
      userId: cert.userId,
      fullName: cert.fullName,
      fan: cert.fan,
      reason: cert.reason,
      description: cert.description || '',
      seals: Array.isArray(cert.seals) ? cert.seals : [],
      grade: cert.grade || '',
      score: cert.score ?? '',
      expiresAt: dateInput(cert.expiresAt),
    })
    setSelectedUser(cert.user || null)
    setUserSearch('')
    setUserResults([])
    setShowModal(true)
  }

  // Profildagi ism taklif sifatida qo'yiladi, lekin admin uni tahrirlaydi:
  // foydalanuvchi profilida taxallus yozgan bo'lishi mumkin, sertifikatda esa
  // rasmiy ism-familya turishi kerak.
  const selectUser = (user) => {
    setSelectedUser(user)
    setFormData((f) => ({ ...f, userId: user.id, fullName: f.fullName || user.fullName || '' }))
    setUserResults([])
    setUserSearch('')
  }

  const handleSealUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingSeal(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/certificates/seal', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setFormData((f) => ({ ...f, seals: [...f.seals, { url: data.url, label: '' }] }))
      toast.success('✓ Pechat yuklandi')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUploadingSeal(false)
      e.target.value = ''
    }
  }

  const updateSealLabel = (idx, label) => {
    setFormData((f) => ({
      ...f,
      seals: f.seals.map((s, i) => (i === idx ? { ...s, label } : s)),
    }))
  }

  const removeSeal = (idx) => {
    setFormData((f) => ({ ...f, seals: f.seals.filter((_, i) => i !== idx) }))
  }

  const handleSave = async () => {
    if (!formData.userId) return toast.error('Foydalanuvchini tanlang!')
    if (!formData.fullName.trim()) return toast.error('Ism-familyani kiriting!')
    if (!formData.fan.trim()) return toast.error('Fanni kiriting!')
    if (!formData.reason.trim()) return toast.error('Nima uchun berilayotganini yozing!')

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/certificates', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowModal(false)
      fetchCertificates()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Bekor qilish — sertifikat tarqatilgan bo'lishi mumkin, shuning uchun
  // o'chirish emas, yaroqsiz deb belgilash tavsiya etiladi: QR kod ishlab
  // turadi va "bekor qilingan" deb ko'rsatadi.
  const toggleStatus = async (cert) => {
    const yangi = cert.status === 'valid' ? 'revoked' : 'valid'
    const savol =
      yangi === 'revoked'
        ? `${cert.certId} bekor qilinsinmi? QR kod "bekor qilingan" deb ko'rsatadi.`
        : `${cert.certId} qayta yaroqli qilinsinmi?`
    if (!confirm(savol)) return

    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cert.id, status: yangi }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchCertificates()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (cert) => {
    if (!confirm(`${cert.certId} butunlay o'chirilsinmi? QR kod "topilmadi" beradi.`)) return
    try {
      const res = await fetch(`/api/admin/certificates?id=${cert.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchCertificates()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const copyVerifyLink = (certId) => {
    const havola = `${window.location.origin}/sertifikat/verify/${certId}`
    navigator.clipboard.writeText(havola)
    toast.success('✓ Tekshirish havolasi nusxalandi')
  }

  const fanlar = Object.keys(stats).sort()

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">🎓 Sertifikatlar</h1>
          <p className="text-purple-300 mt-1">
            Sertifikatni faqat admin beradi — har biri bazada saqlanadi va QR orqali tekshiriladi
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
        >
          <span>➕</span> Yangi sertifikat
        </button>
      </div>

      {/* Fan bo'yicha statistika */}
      {fanlar.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fanlar.map((fan) => (
            <div key={fan} className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats[fan]}</div>
              <div className="text-xs text-purple-400 mt-1 line-clamp-2">{fan}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filtrlar */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Ism, sertifikat raqami yoki sabab bo'yicha qidirish..."
          className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={fanFilter}
            onChange={(e) => setFanFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">📚 Barcha fanlar</option>
            {fanlar.map((fan) => (
              <option key={fan} value={fan}>{fan}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">Barcha holatlar</option>
            <option value="valid">✅ Yaroqli</option>
            <option value="revoked">🚫 Bekor qilingan</option>
          </select>
        </div>
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-white mb-2">Sertifikat yo'q</h3>
          <p className="text-purple-300">Birinchi sertifikatni bering</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => {
            const bekor = cert.status !== 'valid'
            return (
              <div
                key={cert.id}
                className={`bg-slate-900/50 border rounded-xl p-5 transition-all ${
                  bekor ? 'border-red-800/50 opacity-70' : 'border-purple-800/50 hover:border-purple-600/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <code className="px-2 py-0.5 text-xs font-mono bg-purple-950/70 border border-purple-700/50 rounded text-yellow-400">
                        {cert.certId}
                      </code>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                          bekor
                            ? 'bg-red-600/20 text-red-400 border-red-600/30'
                            : 'bg-green-600/20 text-green-400 border-green-600/30'
                        }`}
                      >
                        {bekor ? '🚫 Bekor qilingan' : '✅ Yaroqli'}
                      </span>
                      {cert.grade && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                          {cert.grade}{cert.score !== null ? ` · ${cert.score} ball` : ''}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">{cert.fullName}</h3>
                    <p className="text-sm text-purple-300 mt-0.5">
                      📚 {cert.fan} — {cert.reason}
                    </p>
                    {cert.description && (
                      <p className="text-xs text-purple-400 mt-1 line-clamp-2">{cert.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs text-purple-500 flex-wrap">
                      <span>👤 @{cert.user?.username}</span>
                      <span>📅 {sanaQisqa(cert.issuedAt)}</span>
                      {cert.issuedBy && <span>✍️ {cert.issuedBy.fullName || cert.issuedBy.username}</span>}
                      {cert.expiresAt && (
                        <span>⏳ {sanaQisqa(cert.expiresAt)} gacha</span>
                      )}
                      {Array.isArray(cert.seals) && cert.seals.length > 0 && (
                        <span>🔖 {cert.seals.length} ta pechat</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyVerifyLink(cert.certId)}
                      title="Tekshirish havolasini nusxalash"
                      className="w-9 h-9 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 flex items-center justify-center text-purple-300"
                    >
                      🔗
                    </button>
                    <button
                      onClick={() => openEditModal(cert)}
                      title="Tahrirlash"
                      className="w-9 h-9 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => toggleStatus(cert)}
                      title={bekor ? 'Qayta yaroqli qilish' : 'Bekor qilish'}
                      className="w-9 h-9 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 flex items-center justify-center text-orange-400"
                    >
                      {bekor ? '♻️' : '🚫'}
                    </button>
                    <button
                      onClick={() => handleDelete(cert)}
                      title="O'chirish"
                      className="w-9 h-9 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? '✏️ Sertifikatni tahrirlash' : '🎓 Yangi sertifikat berish'}
            </h3>

            <div className="space-y-4">
              {/* Foydalanuvchi */}
              <div>
                <label className="block text-sm text-purple-300 mb-1.5">Kimga *</label>
                {selectedUser ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-lg">
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">
                        {selectedUser.fullName || selectedUser.username}
                      </div>
                      <div className="text-xs text-purple-400 truncate">
                        @{selectedUser.username} · {selectedUser.email}
                      </div>
                    </div>
                    {/* Tahrirlashda oluvchi qulflanadi — berilgan sertifikatni
                        boshqa odamga o'tkazish tahrir emas. */}
                    {isEditing ? (
                      <span className="text-xs text-purple-500 flex-shrink-0">🔒 o'zgarmaydi</span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedUser(null)
                          setFormData((f) => ({ ...f, userId: '' }))
                        }}
                        className="text-purple-400 hover:text-white text-sm flex-shrink-0"
                      >
                        O'zgartirish
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Username, email yoki ism bo'yicha qidiring..."
                      className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                    />
                    {isSearchingUsers && (
                      <div className="text-xs text-purple-400 mt-1">⏳ Qidirilmoqda...</div>
                    )}
                    {userResults.length > 0 && (
                      <div className="mt-2 border border-purple-800/50 rounded-lg divide-y divide-purple-900/50 max-h-52 overflow-y-auto">
                        {userResults.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => selectUser(u)}
                            className="w-full text-left px-4 py-2.5 hover:bg-purple-800/30 transition-colors"
                          >
                            <div className="text-white text-sm">{u.fullName || u.username}</div>
                            <div className="text-xs text-purple-400">@{u.username} · {u.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Ism-familya */}
              <div>
                <label className="block text-sm text-purple-300 mb-1.5">
                  Sertifikatdagi ism-familya *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Jabborov Diyorbek Arslonovich"
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                />
                <p className="text-xs text-purple-500 mt-1">
                  Profildagi ism taklif sifatida qo'yiladi — foydalanuvchi u yerda taxallus
                  yozgan bo'lishi mumkin, shuning uchun tekshirib chiqing
                </p>
              </div>

              {/* Fan va sabab */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Fan *</label>
                  <input
                    type="text"
                    value={formData.fan}
                    onChange={(e) => setFormData({ ...formData, fan: e.target.value })}
                    placeholder="Kompleks birikmalar kimyosi"
                    list="fanlar-royxati"
                    className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                  />
                  <datalist id="fanlar-royxati">
                    {fanlar.map((fan) => (
                      <option key={fan} value={fan} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Nima uchun *</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Fan olimpiadasi g'olibi"
                    className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-sm text-purple-300 mb-1.5">Tavsif</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Respublika bosqichida 1-o'rin..."
                  className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none resize-none"
                />
              </div>

              {/* Pechatlar */}
              <div>
                <label className="block text-sm text-purple-300 mb-1.5">Pechatlar</label>
                {formData.seals.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {formData.seals.map((seal, idx) => (
                      <div
                        key={seal.url}
                        className="flex items-center gap-3 px-3 py-2 bg-purple-950/50 border border-purple-800/50 rounded-lg"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={seal.url}
                          alt="Pechat"
                          className="w-10 h-10 object-contain flex-shrink-0 bg-white/5 rounded"
                        />
                        <input
                          type="text"
                          value={seal.label}
                          onChange={(e) => updateSealLabel(idx, e.target.value)}
                          placeholder="Pechat nomi (masalan: Rektor muhri)"
                          className="flex-1 min-w-0 px-3 py-1.5 bg-purple-950/70 border border-purple-700/50 rounded text-white text-sm placeholder-purple-500 outline-none focus:border-yellow-500"
                        />
                        <button
                          onClick={() => removeSeal(idx)}
                          className="text-red-400 hover:text-red-300 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/40 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm text-purple-200 cursor-pointer transition-colors">
                  <span>{isUploadingSeal ? '⏳' : '📎'}</span>
                  <span>{isUploadingSeal ? 'Yuklanmoqda...' : 'Pechat qo\'shish'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleSealUpload}
                    disabled={isUploadingSeal}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Ixtiyoriy: baho va muddat */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Daraja</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="A+"
                    className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Ball</label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="98"
                    className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Amal qilish muddati</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-purple-500 -mt-2">
                Daraja, ball va muddat ixtiyoriy — bo'sh qoldirilsa sertifikatda ko'rsatilmaydi
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl disabled:opacity-50"
              >
                {isSaving
                  ? '⏳ Saqlanmoqda...'
                  : isEditing
                    ? '💾 Saqlash'
                    : '🎓 Sertifikat berish'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-xl"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
