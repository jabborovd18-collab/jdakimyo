// app/admin/mavsumiyhamkor/page.js
"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
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

  // Event tafsilotlarini yuklash
  const eventTafsilotiniYukla = async (id) => {
    setEventYuklanmoqda(true)
    try {
      const res = await fetch(`/api/admin/mavsumiyhamkor?id=${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTanlanganEvent(data.event)
      setTab('natijalar')
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setEventYuklanmoqda(false)
    }
  }

  // Tadbirni saqlash
  const saqlash = async (e) => {
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
      toast.success(data.message)
      setFormData(BOSH_HAMKORLIK)
      setTab('royxat')
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Qo'lda sertifikat berish
  const qoldaBerish = async (e) => {
    e.preventDefault()
    if (!selectedUser) {
      toast.error('Foydalanuvchini tanlang')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/mavsumiyhamkor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'issue_manual_cert',
          partnershipId: manualForm.partnershipId,
          userId: selectedUser.id,
          fullName: manualForm.fullName || selectedUser.fullName || selectedUser.username,
          score: manualForm.score,
          percentage: manualForm.percentage,
          customCertId: manualForm.customCertId
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`🎉 ${data.message} ID: ${data.certificate?.certId}`)
      setSelectedUser(null)
      setUserSearch('')
      setManualForm(prev => ({ ...prev, fullName: '', customCertId: '' }))
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  // O'chirish
  const ochirish = async (id, title) => {
    if (!confirm(`"${title}" hamkorligini o'chirishni tasdiqlaysizmi?`)) return
    try {
      const res = await fetch(`/api/admin/mavsumiyhamkor?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('O\'chirildi')
      yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>🤝</span>
            <span>Mavsumiy Hamkorlik & Sertifikatlar</span>
          </h1>
          <p className="text-sm text-purple-300 mt-1">
            Telegram kanallar (AlchemIQ va boshqalar) bilan qo&apos;shma sinovlar, avtomatik va qo&apos;lda rasmiy sertifikat berish paneli.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData(BOSH_HAMKORLIK)
              setTab('yangi')
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-sm shadow-md hover:scale-105 transition-transform"
          >
            ➕ Yangi Hamkorlik
          </button>
          <button
            onClick={() => setTab('qolda_berish')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all"
          >
            🎓 Qo&apos;lda Sertifikat Berish
          </button>
        </div>
      </div>

      {/* Stats kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-purple-800/40 rounded-2xl p-5">
          <span className="text-xs text-purple-400 font-semibold block">Mavsumiy Hamkorliklar</span>
          <strong className="text-2xl font-bold text-white mt-1 block">{stats.totalEvents} ta</strong>
        </div>
        <div className="bg-slate-900/60 border border-purple-800/40 rounded-2xl p-5">
          <span className="text-xs text-purple-400 font-semibold block">Jami Ishtirokchilar</span>
          <strong className="text-2xl font-bold text-yellow-400 mt-1 block">{stats.totalAttempts} ta</strong>
        </div>
        <div className="bg-slate-900/60 border border-purple-800/40 rounded-2xl p-5">
          <span className="text-xs text-purple-400 font-semibold block">Berilgan Sertifikatlar</span>
          <strong className="text-2xl font-bold text-green-400 mt-1 block">{stats.totalCertificates} ta</strong>
        </div>
      </div>

      {/* Tablar */}
      <div className="flex border-b border-purple-800/50 gap-2">
        <button
          onClick={() => setTab('royxat')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            tab === 'royxat'
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-purple-300 hover:text-white'
          }`}
        >
          📋 Tadbirlar Ro&apos;yxati ({events.length})
        </button>
        <button
          onClick={() => setTab('yangi')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            tab === 'yangi'
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-purple-300 hover:text-white'
          }`}
        >
          ✏️ {formData.id ? 'Tahrirlash' : 'Yangi Hamkorlik Yaratish'}
        </button>
        <button
          onClick={() => setTab('qolda_berish')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            tab === 'qolda_berish'
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-purple-300 hover:text-white'
          }`}
        >
          🎓 Qo&apos;lda Sertifikat Berish
        </button>
        {tanlanganEvent && (
          <button
            onClick={() => setTab('natijalar')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              tab === 'natijalar'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-purple-300 hover:text-white'
            }`}
          >
            🏆 {tanlanganEvent.partnerName} Natijalari
          </button>
        )}
      </div>

      {/* ═══ 1. RO'YXAT TABI ═══ */}
      {tab === 'royxat' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
          ) : events.length === 0 ? (
            <div className="bg-slate-900/50 border border-purple-800/30 rounded-2xl p-12 text-center text-purple-300">
              Hozircha hech qanday mavsumiy hamkorlik yo&apos;q. Yuqoridagi &quot;Yangi Hamkorlik&quot; tugmasi orqali AlchemIQ kabi tadbir qo&apos;shing.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-900/80 border border-purple-800/40 hover:border-yellow-500/50 transition-all rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                          {ev.partnerName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          ev.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {ev.isActive ? 'FAOL' : 'NOFAOL'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1.5">{ev.title}</h3>
                      <div className="text-xs text-purple-400 font-mono mt-0.5">
                        Havola: <Link href={`/hamkorlik/${ev.slug}`} target="_blank" className="text-yellow-400 underline">/hamkorlik/{ev.slug}</Link>
                      </div>
                    </div>
                    <div className="text-right text-xs text-purple-300">
                      <div>Ishtirokchilar: <strong className="text-white">{ev._count?.attempts || 0}</strong></div>
                      <div>O&apos;tish: <strong className="text-green-400">{ev.minPassPercent}%</strong></div>
                    </div>
                  </div>

                  <p className="text-xs text-purple-200 line-clamp-2">{ev.certReason || ev.description}</p>

                  <div className="text-xs text-purple-400 border-t border-purple-800/40 pt-3 flex justify-between items-center">
                    <span>📅 {sanaQisqa(ev.startsAt)} — {sanaQisqa(ev.endsAt)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => eventTafsilotiniYukla(ev.id)}
                        className="px-3 py-1.5 rounded-lg bg-purple-700/50 hover:bg-purple-600 text-white text-xs font-bold"
                      >
                        🏆 Natijalar
                      </button>
                      <button
                        onClick={() => {
                          setFormData({
                            ...ev,
                            startsAt: new Date(ev.startsAt).toISOString().slice(0, 16),
                            endsAt: new Date(ev.endsAt).toISOString().slice(0, 16)
                          })
                          setTab('yangi')
                        }}
                        className="px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 text-xs font-bold"
                      >
                        ✏️ Tahrirlash
                      </button>
                      <button
                        onClick={() => ochirish(ev.id, ev.title)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ 2. YANGI HAMKORLIK YARATISH / TAHRIRLASH ═══ */}
      {tab === 'yangi' && (
        <form onSubmit={saqlash} className="bg-slate-900/80 border border-purple-800/40 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📝</span>
            <span>{formData.id ? 'Hamkorlikni Tahrirlash' : 'Yangi Mavsumiy Hamkorlik Qo\'shish'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Havola Slug (URL manzili)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="alchemiq"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
              <span className="text-[11px] text-purple-400">Saytda: jdakimyo.uz/hamkorlik/{formData.slug || 'slug'}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Tadbir Nomi</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="1 Kunlik Sinov Testi"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Hamkor Nomi</label>
              <input
                type="text"
                required
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                placeholder="AlchemIQ"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Hamkor Logotipi URL</label>
              <input
                type="text"
                value={formData.partnerLogo || ''}
                onChange={(e) => setFormData({ ...formData, partnerLogo: e.target.value })}
                placeholder="https://... yoki /images/alchemiq-logo.png"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">1-Imzo Nomi & Lavozimi</label>
              <input
                type="text"
                value={formData.partnerSignName || ''}
                onChange={(e) => setFormData({ ...formData, partnerSignName: e.target.value })}
                placeholder="AlchemIQ Sardor Ergashev"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">1-Imzo Rasmi URL</label>
              <input
                type="text"
                value={formData.partnerSignUrl || ''}
                onChange={(e) => setFormData({ ...formData, partnerSignUrl: e.target.value })}
                placeholder="/images/imzo-alchemiq.png"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">2-Imzo Nomi & Lavozimi</label>
              <input
                type="text"
                value={formData.jdaSignName || ''}
                onChange={(e) => setFormData({ ...formData, jdaSignName: e.target.value })}
                placeholder="JDA Kimyo Jamoasi"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">2-Imzo Rasmi URL</label>
              <input
                type="text"
                value={formData.jdaSignUrl || ''}
                onChange={(e) => setFormData({ ...formData, jdaSignUrl: e.target.value })}
                placeholder="/images/imzo-jda.png"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Sertifikat Prefiksi</label>
              <input
                type="text"
                value={formData.certPrefix}
                onChange={(e) => setFormData({ ...formData, certPrefix: e.target.value })}
                placeholder="AK-JK-2025-"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Gerb/Medal Matni</label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="YUKORI NATIJA"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">O&apos;tish Foizi (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.minPassPercent}
                onChange={(e) => setFormData({ ...formData, minPassPercent: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Test Vaqti (Daqiqa)</label>
              <input
                type="number"
                min="5"
                max="180"
                value={formData.timeLimitMin}
                onChange={(e) => setFormData({ ...formData, timeLimitMin: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Boshlanish Sanasi</label>
              <input
                type="datetime-local"
                required
                value={formData.startsAt}
                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Tugash Sanasi</label>
              <input
                type="datetime-local"
                required
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-purple-300 block mb-1.5">Sertifikatdagi Asosiy Taqdimot Matni</label>
            <textarea
              rows={3}
              value={formData.certReason || ''}
              onChange={(e) => setFormData({ ...formData, certReason: e.target.value })}
              placeholder="AlchemIQ va JDA Kimyo tomonidan tashkil etilgan 1 KUNLIK SINOV TESTIDA..."
              className="w-full bg-black/40 border border-purple-700/50 rounded-xl p-3 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-yellow-500 bg-black/40 border-purple-700/50"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-white cursor-pointer">
              Ushbu hamkorlik faol (saytda va profilda ko&apos;rinsin)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-purple-800/40">
            <button
              type="button"
              onClick={() => setTab('royxat')}
              className="px-5 py-2.5 rounded-xl border border-purple-700/50 text-purple-300 hover:text-white text-sm font-bold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSaving ? 'Saqlanmoqda...' : '💾 Hamkorlikni Saqlash'}
            </button>
          </div>
        </form>
      )}

      {/* ═══ 3. QO'LDA SERTIFIKAT BERISH TABI ═══ */}
      {tab === 'qolda_berish' && (
        <form onSubmit={qoldaBerish} className="bg-slate-900/80 border border-purple-800/40 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎓</span>
              <span>Foydalanuvchiga Mavsumiy Sertifikat Berish</span>
            </h2>
            <p className="text-xs text-purple-300 mt-1">
              Admin yoki Superadmin sifatida istalgan foydalanuvchiga AlchemIQ & JDA Kimyo rasmiy sertifikatini qo&apos;lda berishingiz mumkin.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-purple-300 block mb-1.5">Mavsumiy Tadbirni Tanlang</label>
            <select
              value={manualForm.partnershipId}
              onChange={(e) => setManualForm({ ...manualForm, partnershipId: e.target.value })}
              className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-slate-900">
                  {ev.partnerName} — {ev.title} ({ev.certPrefix})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-purple-300 block mb-1.5">Foydalanuvchini Qidirish (Ism yoki Username)</label>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Username yoki ism yozing..."
              className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
            />
            {isSearchingUsers && <div className="text-xs text-purple-400 mt-1">Qidirilmoqda...</div>}

            {userResults.length > 0 && !selectedUser && (
              <div className="mt-2 bg-slate-950 border border-purple-800/60 rounded-xl divide-y divide-purple-900/50 max-h-48 overflow-y-auto">
                {userResults.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(u)
                      setManualForm(prev => ({ ...prev, fullName: u.fullName || u.username }))
                      setUserResults([])
                      setUserSearch(u.username)
                    }}
                    className="w-full text-left p-3 hover:bg-purple-900/30 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <strong className="text-white block">{u.fullName || u.username}</strong>
                      <span className="text-purple-400">@{u.username} • ID: {u.userId}</span>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-300 font-bold">Tanlash</span>
                  </button>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="mt-3 p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-yellow-400 font-bold block">Tanlangan foydalanuvchi:</span>
                  <strong className="text-white text-sm">{selectedUser.fullName || selectedUser.username}</strong>
                  <span className="text-xs text-purple-300 ml-2">(@{selectedUser.username})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null)
                    setUserSearch('')
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  O&apos;zgartirish
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Sertifikatdagi To&apos;liq Ism</label>
              <input
                type="text"
                required
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                placeholder="Ism Familiya"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Maxsus Sertifikat ID (Ixtiyoriy)</label>
              <input
                type="text"
                value={manualForm.customCertId}
                onChange={(e) => setManualForm({ ...manualForm, customCertId: e.target.value })}
                placeholder="AK-JK-2025-0001 (bo'sh qolsa avtomatik)"
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Ball (masalan, 30 dan)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={manualForm.score}
                onChange={(e) => setManualForm({ ...manualForm, score: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1.5">Foiz (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={manualForm.percentage}
                onChange={(e) => setManualForm({ ...manualForm, percentage: e.target.value })}
                className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:border-yellow-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-purple-800/40 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || !selectedUser}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-black font-extrabold text-sm hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSaving ? 'Berilmoqda...' : '🎖️ Rasmiy Sertifikatni Berish'}
            </button>
          </div>
        </form>
      )}

      {/* ═══ 4. NATIJALAR VA TOP REYTING TABI ═══ */}
      {tab === 'natijalar' && tanlanganEvent && (
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>{tanlanganEvent.partnerName} — {tanlanganEvent.title} Ishtirokchilari</span>
              </h2>
              <p className="text-xs text-purple-300 mt-1">
                Jami urinishlar: {tanlanganEvent.attempts?.length || 0} ta • O&apos;tish chegarasi: {tanlanganEvent.minPassPercent}%
              </p>
            </div>
            <button
              onClick={() => setTab('royxat')}
              className="px-3 py-1.5 rounded-lg border border-purple-700/50 text-xs text-purple-300 hover:text-white"
            >
              ← Orqaga
            </button>
          </div>

          {eventYuklanmoqda ? (
            <div className="text-center py-8 text-purple-300">Yuklanmoqda...</div>
          ) : tanlanganEvent.attempts?.length === 0 ? (
            <div className="text-center py-8 text-purple-300 bg-slate-950/50 rounded-xl">
              Hozircha hech kim ushbu sinov testini topshirmagan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-800/50 text-purple-400">
                    <th className="py-3 px-3">O&apos;rin</th>
                    <th className="py-3 px-3">Ishtirokchi</th>
                    <th className="py-3 px-3">Ball</th>
                    <th className="py-3 px-3">Foiz</th>
                    <th className="py-3 px-3">Vaqt</th>
                    <th className="py-3 px-3">Sertifikat</th>
                    <th className="py-3 px-3">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40 text-purple-200">
                  {tanlanganEvent.attempts.map((att, idx) => (
                    <tr key={att.id} className="hover:bg-purple-950/20">
                      <td className="py-3 px-3 font-bold">
                        {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-white block">{att.user?.fullName || att.user?.username}</strong>
                        <span className="text-purple-400 text-[11px]">@{att.user?.username}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          att.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {Math.floor(att.timeSpentSec / 60)}d {att.timeSpentSec % 60}s
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {att.certId ? (
                          <Link
                            href={`/sertifikat/verify/${att.certId}`}
                            target="_blank"
                            className="text-yellow-400 hover:underline font-bold"
                          >
                            {att.certId}
                          </Link>
                        ) : (
                          <span className="text-purple-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-purple-400">
                        {sanaQisqa(att.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
