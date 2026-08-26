// app/admin/mavsumiyhamkor/page.js
"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sanaQisqa } from '@/lib/sana'

const BOSH_HAMKORLIK = {
  id: '',
  slug: 'alchemiq',
  title: '1 Kunlik Sinov Testi',
  partnerName: 'AlchemIQ',
  partnerLogo: '',
  partnerSignName: 'AlchemIQ Sardor Ergashev',
  partnerSignUrl: '',
  jdaSignName: 'JDA Kimyo Jamoasi',
  jdaSignUrl: '',
  description: 'AlchemIQ va JDA Kimyo hamkorligidagi maxsus olimpiada sinovi.',
  certReason: 'AlchemIQ va JDA Kimyo tomonidan tashkil etilgan 1 KUNLIK SINOV TESTIDA yuqori natija ko\'rsatganligi va bilim darajasining a\'lo darajada ekanligi uchun taqdim etiladi.',
  certPrefix: 'AK-JK-2025-',
  badgeText: 'YUKORI NATIJA',
  minPassPercent: 75,
  timeLimitMin: 40,
  startsAt: new Date().toISOString().split('T')[0] + 'T00:00',
  endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T23:59',
  isActive: true
}

export default function AdminMavsumiyHamkorPage() {
  const [tab, setTab] = useState('royxat') // 'royxat' | 'yangi' | 'qolda_berish' | 'natijalar'
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({ totalEvents: 0, totalAttempts: 0, totalCertificates: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState(BOSH_HAMKORLIK)
  const [isSaving, setIsSaving] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Qo'lda sertifikat berish holati
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [manualForm, setManualForm] = useState({
    partnershipId: '',
    fullName: '',
    score: 28,
    percentage: 93.3,
    customCertId: ''
  })

  // Natijalarni ko'rish
  const [tanlanganEvent, setTanlanganEvent] = useState(null)
  const [eventYuklanmoqda, setEventYuklanmoqda] = useState(false)

  const yukla = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEvents(data.events || [])
      setStats(data.stats || { totalEvents: 0, totalAttempts: 0, totalCertificates: 0 })
      if (data.events?.length > 0 && !manualForm.partnershipId) {
        setManualForm(prev => ({ ...prev, partnershipId: data.events[0].id }))
      }
    } catch (e) {
      toast.error('Yuklashda xatolik: ' + e.message)
    } finally {
      setIsLoading(false)
    }
  }, [manualForm.partnershipId])

  useEffect(() => {
    yukla()
  }, [yukla])

  // Foydalanuvchini qidirish
  useEffect(() => {
    if (tab !== 'qolda_berish') return
    const s = userSearch.trim()
    if (s.length < 2) {
      setUserResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true)
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(s)}&limit=6`)
        const data = await res.json()
        if (res.ok) setUserResults(data.users || [])
      } catch {
        // jim o'tadi
      } finally {
        setIsSearchingUsers(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [userSearch, tab])

  // Havoladan nusxa olish
  const havolaNusxaOlish = (slug) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jdakimyo.uz'
    const link = `${origin}/hamkorlik/${slug}`
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(link)
      toast.success(`Havola nusxalandi: ${link}`, { icon: '📋' })
    } else {
      toast.success(`Havola: ${link}`)
    }
  }

  // Natijalarni e'lon qilish
  const natijalarniElonQilish = async (eventId, e) => {
    if (e) e.stopPropagation()
    if (!confirm("Rostdan ham ushbu sinov natijalarini rasman e'lon qilmoqchimisiz? O'tish balidan o'tgan barcha ishtirokchilarga rasmiy sertifikat taqdim etiladi.")) {
      return
    }

    setActionLoadingId(eventId)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_results',
          partnershipId: eventId
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || "Natijalar rasman e'lon qilindi!")
      await yukla()
      if (tanlanganEvent?.id === eventId) {
        eventNatijalariniYukla(eventId)
      }
    } catch (err) {
      toast.error(err.message || "Xatolik yuz berdi")
    } finally {
      setActionLoadingId(null)
    }
  }

  // Natijalar e'lonini bekor qilish
  const natijalarEloniniBekorQilish = async (eventId, e) => {
    if (e) e.stopPropagation()
    if (!confirm("Natijalar e'lonini bekor qilmoqchimisiz? Ishtirokchilar natijalari yana kutilmoqda holatiga o'tadi.")) {
      return
    }

    setActionLoadingId(eventId)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unpublish_results',
          partnershipId: eventId
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || "Natijalar e'loni bekor qilindi.")
      await yukla()
      if (tanlanganEvent?.id === eventId) {
        eventNatijalariniYukla(eventId)
      }
    } catch (err) {
      toast.error(err.message || "Xatolik yuz berdi")
    } finally {
      setActionLoadingId(null)
    }
  }

  // Saqlash (Yangi / Tahrirlash)
  const saqlaHamkorlik = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Saqlandi!')
      setFormData(BOSH_HAMKORLIK)
      setTab('royxat')
      yukla()
    } catch (err) {
      toast.error(err.message || 'Saqlashda xatolik')
    } finally {
      setIsSaving(false)
    }
  }

  // Tahrirlash uchun ochish
  const tahrirlash = (ev) => {
    setFormData({
      id: ev.id,
      slug: ev.slug,
      title: ev.title,
      partnerName: ev.partnerName,
      partnerLogo: ev.partnerLogo || '',
      partnerSignName: ev.partnerSignName || '',
      partnerSignUrl: ev.partnerSignUrl || '',
      jdaSignName: ev.jdaSignName || 'JDA Kimyo Jamoasi',
      jdaSignUrl: ev.jdaSignUrl || '',
      description: ev.description || '',
      certReason: ev.certReason || '',
      certPrefix: ev.certPrefix || 'AK-JK-2025-',
      badgeText: ev.badgeText || 'YUKORI NATIJA',
      minPassPercent: ev.minPassPercent || 75,
      timeLimitMin: ev.timeLimitMin || 40,
      startsAt: new Date(ev.startsAt).toISOString().slice(0, 16),
      endsAt: new Date(ev.endsAt).toISOString().slice(0, 16),
      isActive: ev.isActive
    })
    setTab('yangi')
  }

  // O'chirish
  const ochirish = async (id, title) => {
    if (!confirm(`"${title}" tadbirini o'chirishni tasdiqlaysizmi? Barcha urinishlar ham o'chib ketadi!`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/mavsumiyhamkor?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('O\'chirildi')
      yukla()
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Qo'lda sertifikat rasmiylashtirish
  const berishSertifikat = async (e) => {
    e.preventDefault()
    if (!selectedUser) {
      toast.error('Iltimos, avval foydalanuvchini tanlang')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'issue_manual_cert',
          partnershipId: manualForm.partnershipId || null,
          userId: selectedUser.id,
          fullName: manualForm.fullName || selectedUser.fullName || selectedUser.username,
          score: manualForm.score,
          percentage: manualForm.percentage,
          customCertId: manualForm.customCertId
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(`Sertifikat berildi! ID: ${data.certificate?.certId}`)
      setSelectedUser(null)
      setUserSearch('')
      setManualForm(prev => ({ ...prev, customCertId: '' }))
      yukla()
    } catch (err) {
      toast.error(err.message || 'Sertifikat berishda xatolik')
    } finally {
      setIsSaving(false)
    }
  }

  // Event natijalarini ko'rish
  const eventNatijalariniYukla = async (id) => {
    setEventYuklanmoqda(true)
    setTab('natijalar')
    try {
      const res = await fetch(`/api/admin/mavsumiyhamkor?id=${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTanlanganEvent(data.event)
    } catch (e) {
      toast.error('Natijalarni yuklab bo\'lmadi: ' + e.message)
    } finally {
      setEventYuklanmoqda(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Yuqori Sarlavha va Statistika */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Ikon nom="hamkor" olcham={28} className="text-amber-400" />
            <span>Mavsumiy Hamkorlik va Sertifikatlar</span>
          </h1>
          <p className="text-xs text-purple-300">
            Telegram kanallar va tashkilotlar bilan qo&apos;shma sinovlar hamda rasmiy sertifikatlar boshqaruvi
          </p>
        </div>

        {/* Tablar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-purple-800/40 rounded-2xl">
          <button
            onClick={() => { setTab('royxat'); setFormData(BOSH_HAMKORLIK) }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'royxat' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Ikon nom="fayl" olcham={14} />
            <span>Tadbirlar ({events.length})</span>
          </button>
          <button
            onClick={() => { setTab('yangi'); setFormData(BOSH_HAMKORLIK) }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'yangi' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Ikon nom="qosh" olcham={14} />
            <span>{formData.id ? 'Tahrirlash' : 'Yangi qo\'shish'}</span>
          </button>
          <button
            onClick={() => setTab('qolda_berish')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'qolda_berish' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Ikon nom="sertifikat" olcham={14} />
            <span>Qo&apos;lda Sertifikat Berish</span>
          </button>
        </div>
      </div>

      {/* Statistika Bloklari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-purple-800/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Ikon nom="hamkor" olcham={24} />
          </div>
          <div>
            <span className="text-xs text-purple-400 font-medium block">Faol Hamkorliklar</span>
            <strong className="text-2xl font-black text-white">{stats.totalEvents} ta</strong>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-purple-800/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Ikon nom="quiz" olcham={24} />
          </div>
          <div>
            <span className="text-xs text-purple-400 font-medium block">Jami Urinishlar</span>
            <strong className="text-2xl font-black text-white">{stats.totalAttempts} ta</strong>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-purple-800/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <Ikon nom="sertifikat" olcham={24} />
          </div>
          <div>
            <span className="text-xs text-purple-400 font-medium block">Berilgan Sertifikatlar</span>
            <strong className="text-2xl font-black text-white">{stats.totalCertificates} ta</strong>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: TADBIRLAR RO'YXATI
      ═══════════════════════════════════════════════════════════════ */}
      {tab === 'royxat' && (
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Ikon nom="fayl" olcham={18} className="text-amber-400" />
            <span>Mavjud Hamkorlik Tadbirlari</span>
          </h2>

          {isLoading ? (
            <div className="text-center py-10 text-xs text-purple-300">Yuklanmoqda...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-xs text-purple-400">
              Hozircha hech qanday hamkorlik tadbiri mavjud emas. Yuqoridagi &quot;Yangi qo&apos;shish&quot; tugmasi orqali yarating.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => {
                const now = new Date()
                const start = new Date(ev.startsAt)
                const end = new Date(ev.endsAt)
                const isFaol = ev.isActive && now >= start && now <= end

                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-2xl bg-black/40 border border-purple-800/40 hover:border-amber-400/60 transition-all space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {ev.partnerName}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Natijalar e'lon holati */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.isAnnounced
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {ev.isAnnounced ? "Natijalar e'lon qilingan" : "Natijalar kutilmoqda"}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFaol
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}>
                            {isFaol ? 'Faol' : 'Nofaol'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-extrabold text-white leading-snug">
                        {ev.title}
                      </h3>

                      <p className="text-xs text-purple-300 line-clamp-2">
                        {ev.description || ev.certReason}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-purple-400 pt-2 border-t border-purple-900/40 font-mono">
                        <div>Savollar: <strong>30 ta</strong></div>
                        <div>O&apos;tish: <strong>{ev.minPassPercent}%</strong></div>
                        <div>Urinishlar: <strong>{ev._count?.attempts || 0} ta</strong></div>
                        <div>Prefiks: <strong>{ev.certPrefix}</strong></div>
                        <div className="col-span-2 text-[10px]">
                          Muddat: {sanaQisqa(start)} — {sanaQisqa(end)}
                        </div>
                      </div>
                    </div>

                    {/* Amallar */}
                    <div className="flex items-center gap-2 pt-3 border-t border-purple-900/40 flex-wrap">
                      {/* Havoladan nusxa olish */}
                      <button
                        type="button"
                        onClick={() => havolaNusxaOlish(ev.slug)}
                        className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
                        title="Ishtirokchilarga yuborish uchun havolani nusxalash"
                      >
                        <Ikon nom="nusxa" olcham={14} />
                        <span>Nusxa</span>
                      </button>

                      {/* Sahifani ko'rish */}
                      <Link
                        href={`/hamkorlik/${ev.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Ikon nom="tashqi" olcham={14} />
                        <span>Ko&apos;rish</span>
                      </Link>

                      {/* Natijalarni e'lon qilish / bekor qilish */}
                      {!ev.isAnnounced ? (
                        <button
                          type="button"
                          onClick={(e) => natijalarniElonQilish(ev.id, e)}
                          disabled={actionLoadingId === ev.id}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                        >
                          <Ikon nom="elon" olcham={14} />
                          <span>{actionLoadingId === ev.id ? 'E\'lon qilinmoqda...' : 'Natijalarni E\'lon Qilish'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => natijalarEloniniBekorQilish(ev.id, e)}
                          disabled={actionLoadingId === ev.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Ikon nom="yopish" olcham={14} />
                          <span>E&apos;lonni yashirish</span>
                        </button>
                      )}

                      {/* Natijalar jadvali */}
                      <button
                        type="button"
                        onClick={() => eventNatijalariniYukla(ev.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-indigo-200 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Ikon nom="kubok" olcham={14} />
                        <span>Reyting</span>
                      </button>

                      {/* Tahrirlash & O'chirish */}
                      <button
                        type="button"
                        onClick={() => tahrirlash(ev)}
                        className="p-1.5 rounded-xl bg-black/40 hover:bg-purple-900/50 text-purple-300 hover:text-white"
                        title="Tahrirlash"
                      >
                        <Ikon nom="tahrir" olcham={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => ochirish(ev.id, ev.title)}
                        className="p-1.5 rounded-xl bg-black/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 ml-auto"
                        title="O'chirish"
                      >
                        <Ikon nom="ochir" olcham={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: YANGI YARATISH / TAHRIRLASH
      ═══════════════════════════════════════════════════════════════ */}
      {tab === 'yangi' && (
        <form onSubmit={saqlaHamkorlik} className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Ikon nom="tahrir" olcham={20} className="text-amber-400" />
              <span>{formData.id ? 'Hamkorlik Tadbirini Tahrirlash' : 'Yangi Mavsumiy Hamkorlik Yaratish'}</span>
            </h2>
            <button
              type="button"
              onClick={() => { setFormData(BOSH_HAMKORLIK); setTab('royxat') }}
              className="text-xs text-purple-400 hover:text-white flex items-center gap-1"
            >
              <Ikon nom="yopish" olcham={16} /> Bekor qilish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Havola Nomi (Slug) *</label>
              <div className="flex items-center bg-black/40 border border-purple-800/40 rounded-xl px-3 py-2 text-white">
                <span className="text-purple-500 select-none">/hamkorlik/</span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="alchemiq"
                  className="bg-transparent border-none outline-hidden text-white font-mono flex-1 ml-1"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Tadbir Nomi *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="1 Kunlik Sinov Testi"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Hamkor Nomi */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Hamkor Tashkilot / Kanal Nomi *</label>
              <input
                type="text"
                required
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                placeholder="AlchemIQ"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Hamkor Logotipi URL */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Hamkor Logotipi URL (Ixtiyoriy)</label>
              <input
                type="text"
                value={formData.partnerLogo}
                onChange={(e) => setFormData({ ...formData, partnerLogo: e.target.value })}
                placeholder="/images/alchemiq-logo.png"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* 1-Imzo Nomi (Hamkor) */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">1-Imzo Egasi (Hamkor)</label>
              <input
                type="text"
                value={formData.partnerSignName}
                onChange={(e) => setFormData({ ...formData, partnerSignName: e.target.value })}
                placeholder="AlchemIQ Sardor Ergashev"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* 2-Imzo Nomi (JDA) */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">2-Imzo Egasi (JDA Kimyo)</label>
              <input
                type="text"
                value={formData.jdaSignName}
                onChange={(e) => setFormData({ ...formData, jdaSignName: e.target.value })}
                placeholder="JDA Kimyo Jamoasi"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Boshlanish vaqti */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Boshlanish Sanasi *</label>
              <input
                type="datetime-local"
                required
                value={formData.startsAt}
                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Tugash vaqti */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Tugash Sanasi *</label>
              <input
                type="datetime-local"
                required
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              />
            </div>

            {/* O'tish foizi va Vaqt */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">O&apos;tish Bali (% da)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.minPassPercent}
                onChange={(e) => setFormData({ ...formData, minPassPercent: e.target.value })}
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Vaqt Chegarasi (Daqiqada)</label>
              <input
                type="number"
                min="5"
                max="180"
                value={formData.timeLimitMin}
                onChange={(e) => setFormData({ ...formData, timeLimitMin: e.target.value })}
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            {/* Sertifikat Prefiksi */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Sertifikat Prefiksi</label>
              <input
                type="text"
                value={formData.certPrefix}
                onChange={(e) => setFormData({ ...formData, certPrefix: e.target.value })}
                placeholder="AK-JK-2025-"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            {/* Holat */}
            <div className="space-y-1.5 flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-xs font-bold text-white">Faol holatda</span>
              </label>
            </div>

            {/* Sertifikat sababi / matni */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-purple-300 font-semibold block">Sertifikatda Ko&apos;rsatiladigan Asosiy Matn</label>
              <textarea
                rows={3}
                value={formData.certReason}
                onChange={(e) => setFormData({ ...formData, certReason: e.target.value })}
                placeholder="AlchemIQ va JDA Kimyo tomonidan tashkil etilgan 1 KUNLIK SINOV TESTIDA..."
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl p-3 text-white outline-hidden focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-800/40">
            <button
              type="button"
              onClick={() => { setFormData(BOSH_HAMKORLIK); setTab('royxat') }}
              className="px-5 py-2.5 rounded-xl bg-black/40 border border-purple-800/40 text-purple-300 hover:text-white text-xs font-bold"
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-extrabold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <Ikon nom="tasdiq" olcham={16} />
              <span>{isSaving ? 'Saqlanmoqda...' : 'Tadbirni Saqlash'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: QO'LDA SERTIFIKAT BERISH
      ═══════════════════════════════════════════════════════════════ */}
      {tab === 'qolda_berish' && (
        <form onSubmit={berishSertifikat} className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div className="space-y-1 border-b border-purple-800/40 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Ikon nom="sertifikat" olcham={20} className="text-amber-400" />
              <span>Foydalanuvchiga Qo&apos;lda Sertifikat Berish</span>
            </h2>
            <p className="text-xs text-purple-300">
              Admin va Superadminlar istalgan o&apos;quvchini qidirib, unga mavsumiy hamkorlik sertifikatini rasmiylashtirishi mumkin.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Hamkorlikni tanlash */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Mavsumiy Hamkorlik Tadbiri</label>
              <select
                value={manualForm.partnershipId}
                onChange={(e) => setManualForm({ ...manualForm, partnershipId: e.target.value })}
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id} className="bg-slate-900 text-white">
                    {ev.partnerName} — {ev.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Foydalanuvchini qidirish */}
            <div className="space-y-1.5 relative">
              <label className="text-purple-300 font-semibold block">Foydalanuvchini Qidirish (Ism yoki Username) *</label>
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Username yoki ismni yozing..."
                  className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400"
                />
                {isSearchingUsers && (
                  <div className="absolute right-3 top-2.5 text-purple-400 text-xs animate-spin">
                    ⏳
                  </div>
                )}
              </div>

              {/* Qidiruv natijalari popup */}
              {userResults.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-900 border border-purple-700 rounded-2xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
                  {userResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(u)
                        setManualForm(prev => ({ ...prev, fullName: u.fullName || u.username }))
                        setUserResults([])
                        setUserSearch('')
                      }}
                      className="w-full p-2 rounded-xl hover:bg-purple-900/40 text-left flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-white block">{u.fullName || u.username}</strong>
                        <span className="text-purple-400 font-mono">@{u.username}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Tanlash
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tanlangan foydalanuvchi kartasi */}
            {selectedUser && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Tanlangan foydalanuvchi:</span>
                  <strong className="text-sm text-white block">{selectedUser.fullName || selectedUser.username}</strong>
                  <span className="text-xs text-purple-300 font-mono">@{selectedUser.username} ({selectedUser.email || 'Email yo\'q'})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1 rounded-xl bg-black/40 text-red-400 hover:bg-black/60 font-bold text-xs"
                >
                  O&apos;zgartirish
                </button>
              </div>
            )}

            {/* Sertifikatdagi Ism Familiya */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Sertifikatda Yoziladigan To&apos;liq Ism *</label>
              <input
                type="text"
                required
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                placeholder="Jasurbek Karimov"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-semibold"
              />
            </div>

            {/* Ball va Foiz */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-purple-300 font-semibold block">To&apos;g&apos;ri Javoblar Soni (30 dan)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={manualForm.score}
                  onChange={(e) => {
                    const sc = parseInt(e.target.value, 10) || 0
                    setManualForm({
                      ...manualForm,
                      score: sc,
                      percentage: Number(((sc / 30) * 100).toFixed(1))
                    })
                  }}
                  className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-purple-300 font-semibold block">Natija Foizi (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={manualForm.percentage}
                  onChange={(e) => setManualForm({ ...manualForm, percentage: e.target.value })}
                  className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Maxsus Sertifikat ID */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-semibold block">Maxsus Sertifikat ID (Bo&apos;sh qoldirilsa avtomatik generatsiya bo&apos;ladi)</label>
              <input
                type="text"
                value={manualForm.customCertId}
                onChange={(e) => setManualForm({ ...manualForm, customCertId: e.target.value })}
                placeholder="AK-JK-2025-7788"
                className="w-full bg-black/40 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white outline-hidden focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-purple-800/40 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || !selectedUser}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-xl disabled:opacity-40 flex items-center gap-2"
            >
              <Ikon nom="sertifikat" olcham={18} />
              <span>{isSaving ? 'Rasmiylashtirilmoqda...' : 'Sertifikatni Taqdim Etish'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: NATIJALAR VA TOP REYTING JADVALI
      ═══════════════════════════════════════════════════════════════ */}
      {tab === 'natijalar' && (
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-4">
            <div>
              <span className="text-xs text-amber-400 font-mono block font-bold">
                {tanlanganEvent?.partnerName} hamkorligida
              </span>
              <h2 className="text-xl font-black text-white">
                {tanlanganEvent?.title} — Ishtirokchilar Natijalari
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {!tanlanganEvent?.isAnnounced ? (
                <button
                  type="button"
                  onClick={(e) => natijalarniElonQilish(tanlanganEvent?.id, e)}
                  disabled={actionLoadingId === tanlanganEvent?.id}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Ikon nom="elon" olcham={16} />
                  <span>{actionLoadingId === tanlanganEvent?.id ? 'E\'lon qilinmoqda...' : 'Natijalarni E\'lon Qilish'}</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-300 border border-green-500/40 text-xs font-bold flex items-center gap-1.5">
                  <Ikon nom="tasdiq" olcham={14} />
                  <span>Rasman E&apos;lon Qilingan</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setTab('royxat')}
                className="px-4 py-2 rounded-xl bg-black/40 border border-purple-800/40 text-purple-300 hover:text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Ikon nom="chap" olcham={14} /> Ortga
              </button>
            </div>
          </div>

          {eventYuklanmoqda ? (
            <div className="text-center py-10 text-xs text-purple-300">Natijalar yuklanmoqda...</div>
          ) : !tanlanganEvent?.attempts || tanlanganEvent.attempts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Ikon nom="odamlar" olcham={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Hozircha urinishlar yo&apos;q</h4>
              <p className="text-xs text-purple-400">Ushbu tadbirda hali hech kim test topshirmagan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TOP 3 PODIUM */}
              {tanlanganEvent.attempts.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/30 border border-purple-900/40">
                  {/* 2-o'rin */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-600 text-center space-y-1">
                    <span className="w-7 h-7 mx-auto rounded-full bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <strong className="text-white text-xs block truncate">{tanlanganEvent.attempts[1]?.user?.fullName || tanlanganEvent.attempts[1]?.user?.username}</strong>
                    <span className="text-slate-300 font-mono text-xs font-bold block">{tanlanganEvent.attempts[1]?.score} ball ({tanlanganEvent.attempts[1]?.percentage}%)</span>
                  </div>

                  {/* 1-o'rin */}
                  <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/20 to-yellow-500/20 border-2 border-amber-400 text-center space-y-1 -translate-y-1 shadow-md">
                    <span className="w-8 h-8 mx-auto rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-xs shadow-md">
                      1
                    </span>
                    <strong className="text-amber-300 text-xs sm:text-sm block truncate">{tanlanganEvent.attempts[0]?.user?.fullName || tanlanganEvent.attempts[0]?.user?.username}</strong>
                    <span className="text-amber-300 font-mono text-xs sm:text-sm font-extrabold block">{tanlanganEvent.attempts[0]?.score} ball ({tanlanganEvent.attempts[0]?.percentage}%)</span>
                  </div>

                  {/* 3-o'rin */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-amber-800 text-center space-y-1">
                    <span className="w-7 h-7 mx-auto rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <strong className="text-white text-xs block truncate">{tanlanganEvent.attempts[2]?.user?.fullName || tanlanganEvent.attempts[2]?.user?.username}</strong>
                    <span className="text-amber-600 font-mono text-xs font-bold block">{tanlanganEvent.attempts[2]?.score} ball ({tanlanganEvent.attempts[2]?.percentage}%)</span>
                  </div>
                </div>
              )}

              {/* JADVAL */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-purple-300 uppercase tracking-wider text-[10px] font-mono">
                    <tr>
                      <th className="p-3 rounded-l-xl">O&apos;rin</th>
                      <th className="p-3">Foydalanuvchi</th>
                      <th className="p-3">Ball (30 dan)</th>
                      <th className="p-3">Foiz</th>
                      <th className="p-3">Sarflangan Vaqt</th>
                      <th className="p-3">Holat</th>
                      <th className="p-3 rounded-r-xl">Sertifikat ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
                    {tanlanganEvent.attempts.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-purple-950/20">
                        <td className="p-3 font-mono font-bold text-amber-400">
                          {idx + 1}.
                        </td>
                        <td className="p-3">
                          <strong className="text-white block">{att.user?.fullName || att.user?.username}</strong>
                          <span className="text-purple-400 font-mono text-[11px]">@{att.user?.username}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          {att.score} / {att.totalQuestions}
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-300">
                          {att.percentage}%
                        </td>
                        <td className="p-3 font-mono text-purple-300">
                          {Math.floor(att.timeSpentSec / 60)}d {att.timeSpentSec % 60}s
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            att.passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {att.passed ? 'O\'tdi' : 'O\'tmadi'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-purple-200">
                          {att.certId ? (
                            <Link
                              href={`/sertifikat/verify/${att.certId}`}
                              target="_blank"
                              className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                            >
                              <Ikon nom="sertifikat" olcham={12} />
                              <span>{att.certId}</span>
                            </Link>
                          ) : (
                            <span className="text-purple-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
