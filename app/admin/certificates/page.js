// app/admin/certificates/page.js
"use client"
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sanaQisqa } from '@/lib/sana'
import {
  SERTIFIKAT_TURLARI,
  ajratSertifikatMuhrlar,
  ajratSertifikatTavsifi,
  sertifikatHolati,
  sertifikatQrHavolasi,
  sertifikatTuriAniqlash,
} from '@/lib/sertifikat-tahlil'
import { sertifikatYuklabOlishUniversal } from '@/lib/sertifikat-yuklab-mijoz'

const BOSH_FORMA = {
  id: '',
  certId: '',
  userId: '',
  fullName: '',
  fan: '',
  reason: '',
  description: '',
  turi: SERTIFIKAT_TURLARI.maxsus,
  metadata: null,
  fullNameLocked: false,
  seals: [],
  partnerSeals: null,
  grade: '',
  score: '',
  percentage: '',
  expiresAt: '',
}

/** "2026-08-02" — <input type="date"> shu shaklni kutadi */
const dateInput = (qiymat) =>
  qiymat ? new Date(qiymat).toISOString().split('T')[0] : ''

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [stats, setStats] = useState({})
  const [manbaCounts, setManbaCounts] = useState({ jami: 0, ms: 0, hamkor: 0, qolda: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Filtrlar
  const [fanFilter, setFanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [manbaFilter, setManbaFilter] = useState('all')
  const [manbaTayyor, setManbaTayyor] = useState(false)
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
  const [tasdiqOyna, setTasdiqOyna] = useState(null)

  useEffect(() => {
    const paramManba = new URLSearchParams(window.location.search).get('manba')
    if (paramManba === 'ms' || paramManba === 'hamkor' || paramManba === 'qolda') {
      setManbaFilter(paramManba)
    }
    setManbaTayyor(true)
  }, [])

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        fan: fanFilter,
        status: statusFilter,
        manba: manbaFilter,
        search,
      })
      const res = await fetch(`/api/admin/certificates?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCertificates(data.certificates)
      setStats(data.stats)
      if (data.manbaCounts) setManbaCounts(data.manbaCounts)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [fanFilter, statusFilter, manbaFilter, search])

  useEffect(() => {
    if (!manbaTayyor) return
    fetchCertificates()
  }, [manbaTayyor, fetchCertificates])

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
    const { fullNameLocked } = ajratSertifikatTavsifi(cert)
    const { rasmlar, hamkorMuhri } = ajratSertifikatMuhrlar(cert.seals)
    setIsEditing(true)
    setFormData({
      id: cert.id,
      certId: cert.certId,
      userId: cert.userId,
      fullName: cert.fullName,
      fan: cert.fan,
      reason: cert.reason,
      description: cert.description || '',
      turi: sertifikatTuriAniqlash(cert),
      metadata: cert.metadata ?? null,
      fullNameLocked,
      seals: rasmlar,
      partnerSeals: hamkorMuhri,
      grade: cert.grade || '',
      score: cert.score ?? '',
      percentage: cert.percentage ?? '',
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
      toast.success('Pechat yuklandi')
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
      const { partnerSeals, ...restForma } = formData
      const payload = {
        ...restForma,
        seals:
          restForma.seals.length > 0
            ? restForma.seals
            : partnerSeals || restForma.seals,
      }
      const res = await fetch('/api/admin/certificates', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  const toggleStatus = (cert) => {
    const yangi = cert.status === 'valid' ? 'revoked' : 'valid'
    const savol =
      yangi === 'revoked'
        ? `${cert.certId} bekor qilinsinmi? QR kod "bekor qilingan" deb ko'rsatadi.`
        : `${cert.certId} qayta yaroqli qilinsinmi?`
    setTasdiqOyna({ cert, tur: 'status', yangi, savol })
  }

  const handleDelete = (cert) => {
    setTasdiqOyna({
      cert,
      tur: 'ochirish',
      savol: `${cert.certId} butunlay o'chirilsinmi? QR kod "topilmadi" beradi.`,
    })
  }

  const tasdiqlaAmal = async () => {
    if (!tasdiqOyna) return
    const { cert, tur, yangi } = tasdiqOyna
    setTasdiqOyna(null)
    try {
      const res =
        tur === 'status'
          ? await fetch('/api/admin/certificates', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: cert.id, status: yangi }),
            })
          : await fetch(`/api/admin/certificates?id=${cert.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchCertificates()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const copyVerifyLink = (certId) => {
    const havola = sertifikatQrHavolasi(certId, window.location.origin)
    navigator.clipboard.writeText(havola)
    toast.success('Tekshirish havolasi nusxalandi')
  }

  const downloadPdf = async (cert) => {
    try {
      await sertifikatYuklabOlishUniversal(cert)
    } catch (error) {
      toast.error('PDF xatosi: ' + error.message)
    }
  }

  const fanlar = Object.keys(stats).sort()

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2.5">
            <Ikon nom="sertifikat" olcham={28} className="text-amber-300" />
            <span>Sertifikatlar</span>
          </h1>
          <p className="text-[var(--v3-xira)] mt-1 text-sm">
            Maxsus, hamkorlik va Milliy Sertifikat (JDA-MS-*) reestri
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/milliy-sertifikat"
            className="px-4 py-2.5 bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 font-semibold rounded-xl text-sm flex items-center gap-2"
          >
            <Ikon nom="medal" olcham={16} />
            <span>MS boshqaruvi</span>
          </Link>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <Ikon nom="qosh" olcham={16} />
            <span>Yangi sertifikat</span>
          </button>
        </div>
      </div>

      {/* Fan bo'yicha statistika */}
      {fanlar.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fanlar.map((fan) => (
            <div key={fan} className="v3-panel-karta p-4">
              <div className="text-2xl font-bold text-white">{stats[fan]}</div>
              <div className="text-xs text-[var(--v3-xira)] mt-1 line-clamp-2">{fan}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filtrlar */}
      <div className="v3-panel-karta p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', nom: `Hammasi (${manbaCounts.jami})`, ikon: null },
            { id: 'ms', nom: `MS (Rasch) (${manbaCounts.ms})`, ikon: 'medal' },
            { id: 'hamkor', nom: `Hamkorlik (${manbaCounts.hamkor ?? 0})`, ikon: 'hamkor' },
            { id: 'qolda', nom: `Maxsus (${manbaCounts.qolda})`, ikon: 'qalam' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setManbaFilter(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition inline-flex items-center gap-1.5 ${
                manbaFilter === m.id
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/60'
                  : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]'
              }`}
            >
              {m.ikon && <Ikon nom={m.ikon} olcham={13} />}
              <span>{m.nom}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Ikon nom="qidiruv" olcham={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, sertifikat raqami yoki sabab..."
            className="v3-kiritish w-full pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={fanFilter}
            onChange={(e) => setFanFilter(e.target.value)}
            className="v3-kiritish"
          >
            <option value="all">Barcha fanlar</option>
            {fanlar.map((fan) => (
              <option key={fan} value={fan}>{fan}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="v3-kiritish"
          >
            <option value="all">Barcha holatlar</option>
            <option value="valid">Yaroqli</option>
            <option value="expired">Muddati tugagan</option>
            <option value="revoked">Bekor qilingan</option>
          </select>
        </div>
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="text-center py-12 text-[var(--v3-xira)] inline-flex w-full items-center justify-center gap-2">
          <Ikon nom="qayta" olcham={16} className="animate-spin" />
          <span>Yuklanmoqda...</span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 v3-panel-karta">
          <Ikon nom="sertifikat" olcham={52} className="mx-auto mb-3 text-[var(--v3-urgu)]" />
          <h3 className="text-xl font-bold text-[var(--v3-matn)] mb-2">Sertifikat yo&apos;q</h3>
          <p className="text-[var(--v3-xira)]">Birinchi sertifikatni bering</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => {
            const revoked = cert.status !== 'valid'
            const holatInfo = sertifikatHolati(cert)
            const yaroqsiz = !holatInfo.yaroqli
            const turi = sertifikatTuriAniqlash(cert)
            const isHamkor = turi === SERTIFIKAT_TURLARI.hamkor
            const { isMs, meta: msMeta, matn: tavsifMatn, fullNameLocked } =
              ajratSertifikatTavsifi(cert)
            const { rasmlar: certSeals, hamkorMuhri } = ajratSertifikatMuhrlar(cert.seals)
            return (
              <div
                key={cert.id}
                className={`v3-panel-karta p-5 transition-all ${
                  yaroqsiz
                    ? 'border-red-500/40 opacity-75'
                    : 'hover:border-[var(--v3-chiziq-2)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <code className="px-2 py-0.5 text-xs font-mono bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded text-[var(--v3-urgu)]">
                        {cert.certId}
                      </code>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border inline-flex items-center gap-1 ${
                          isMs
                            ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                            : isHamkor
                              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)]'
                        }`}
                      >
                        <Ikon nom={isMs ? 'medal' : isHamkor ? 'hamkor' : 'qalam'} olcham={12} />
                        <span>{isMs ? 'MS' : isHamkor ? 'Hamkorlik' : 'Maxsus'}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border inline-flex items-center gap-1 ${
                          holatInfo.holat === 'revoked'
                            ? 'bg-red-600/20 text-red-400 border-red-600/30'
                            : holatInfo.holat === 'expired'
                              ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                              : 'bg-green-600/20 text-green-400 border-green-600/30'
                        }`}
                      >
                        <Ikon
                          nom={
                            holatInfo.holat === 'revoked'
                              ? 'taqiq'
                              : holatInfo.holat === 'expired'
                                ? 'soat'
                                : 'tasdiq'
                          }
                          olcham={12}
                        />
                        <span>
                          {holatInfo.holat === 'revoked'
                            ? 'Bekor qilingan'
                            : holatInfo.holat === 'expired'
                              ? 'Muddati tugagan'
                              : 'Yaroqli'}
                        </span>
                      </span>
                      {fullNameLocked && (
                        <span className="px-2 py-0.5 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full inline-flex items-center gap-1">
                          <Ikon nom="qulf" olcham={11} />
                          <span>F.I.SH qulflangan</span>
                        </span>
                      )}
                      {cert.grade && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                          {cert.grade}{cert.score !== null ? ` · ${cert.score} ball` : ''}
                        </span>
                      )}
                      {cert.percentile !== null && cert.percentile !== undefined && (
                        <span className="px-2 py-0.5 text-xs bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                          Percentile: {cert.percentile}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">{cert.fullName}</h3>
                    <p className="text-sm text-[var(--v3-xira)] mt-0.5 flex items-center gap-1.5">
                      <Ikon nom="kitob" olcham={14} className="shrink-0 text-[var(--v3-xira)]" />
                      <span>{cert.examName || cert.fan} — {cert.reason}</span>
                    </p>
                    {msMeta ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 font-mono">
                          Rasch: {msMeta.shkalaBalli ?? cert.score ?? '—'} (θ={msMeta.theta ?? '—'}, SE={msMeta.se ?? '—'})
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-200 font-mono">
                          Oddiy: {msMeta.rawScore ?? '—'}/{msMeta.jamiSavollar ?? '—'} ({msMeta.oddiyFoiz ?? cert.percentage ?? '—'}%)
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)]">
                          Kalibrlash: {msMeta.kalibrlashUsuli || 'taxminiy'}
                        </span>
                        {msMeta.examSlug && (
                          <Link
                            href={`/admin/milliy-sertifikat?slug=${encodeURIComponent(msMeta.examSlug)}`}
                            className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200"
                          >
                            Hisobotni ochish →
                          </Link>
                        )}
                      </div>
                    ) : tavsifMatn ? (
                      <p className="text-xs text-[var(--v3-xira)] mt-1 line-clamp-2">{tavsifMatn}</p>
                    ) : null}

                    <div className="flex items-center gap-3 mt-3 text-xs text-[var(--v3-xira)] flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Ikon nom="odam" olcham={12} />
                        <span>@{cert.user?.username}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ikon nom="taqvim" olcham={12} />
                        <span>{sanaQisqa(cert.issuedAt)}</span>
                      </span>
                      {cert.issuedBy && (
                        <span className="inline-flex items-center gap-1">
                          <Ikon nom="qalam" olcham={12} />
                          <span>{cert.issuedBy.fullName || cert.issuedBy.username}</span>
                        </span>
                      )}
                      {cert.expiresAt && (
                        <span className="inline-flex items-center gap-1">
                          <Ikon nom="soat" olcham={12} />
                          <span>{sanaQisqa(cert.expiresAt)} gacha</span>
                        </span>
                      )}
                      {certSeals.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Ikon nom="qadash" olcham={12} />
                          <span>{certSeals.length} ta pechat</span>
                        </span>
                      )}
                      {hamkorMuhri?.partnerName && (
                        <span className="inline-flex items-center gap-1">
                          <Ikon nom="hamkor" olcham={12} />
                          <span>Hamkor: {hamkorMuhri.partnerName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => downloadPdf(cert)}
                      title="PDF yuklab olish"
                      className="w-9 h-9 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-amber-300"
                    >
                      <Ikon nom="hujjat" olcham={16} />
                    </button>
                    <a
                      href={`/api/sertifikat/${encodeURIComponent(cert.certId)}/pdf?inline=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Server PDF ni brauzerda ko'rish"
                      className="w-9 h-9 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300"
                    >
                      <Ikon nom="chopEt" olcham={16} />
                    </a>
                    <button
                      onClick={() => copyVerifyLink(cert.certId)}
                      title="Tekshirish havolasini nusxalash"
                      className="w-9 h-9 rounded-lg bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] border border-[var(--v3-chiziq-2)] flex items-center justify-center text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                    >
                      <Ikon nom="havola" olcham={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(cert)}
                      title="Tahrirlash"
                      className="w-9 h-9 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 flex items-center justify-center text-blue-400"
                    >
                      <Ikon nom="tahrir" olcham={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(cert)}
                      title={revoked ? 'Qayta yaroqli qilish' : 'Bekor qilish'}
                      className="w-9 h-9 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 flex items-center justify-center text-orange-400"
                    >
                      <Ikon nom={revoked ? 'qayta' : 'taqiq'} olcham={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cert)}
                      title="O'chirish"
                      className="w-9 h-9 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 flex items-center justify-center text-red-400"
                    >
                      <Ikon nom="ochir" olcham={16} />
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
          <div className="bg-[var(--v3-fon)] border border-[var(--v3-chiziq-2)] rounded-2xl p-6 max-w-2xl w-full my-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Ikon nom={isEditing ? 'tahrir' : 'sertifikat'} olcham={20} className="text-amber-300" />
              <span>{isEditing ? 'Sertifikatni tahrirlash' : 'Yangi sertifikat berish'}</span>
            </h3>

            <div className="space-y-4">
              {/* Foydalanuvchi */}
              <div>
                <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Kimga *</label>
                {selectedUser ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-lg">
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">
                        {selectedUser.fullName || selectedUser.username}
                      </div>
                      <div className="text-xs text-[var(--v3-xira)] truncate">
                        @{selectedUser.username} · {selectedUser.email}
                      </div>
                    </div>
                    {/* Tahrirlashda oluvchi qulflanadi — berilgan sertifikatni
                        boshqa odamga o'tkazish tahrir emas. */}
                    {isEditing ? (
                      <span className="text-xs text-[var(--v3-xira)] flex-shrink-0 inline-flex items-center gap-1">
                        <Ikon nom="qulf" olcham={12} />
                        <span>o&apos;zgarmaydi</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedUser(null)
                          setFormData((f) => ({ ...f, userId: '' }))
                        }}
                        className="text-[var(--v3-xira)] hover:text-[var(--v3-matn)] text-sm flex-shrink-0"
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
                      className="v3-kiritish w-full"
                    />
                    {isSearchingUsers && (
                      <div className="text-xs text-[var(--v3-xira)] mt-1 inline-flex items-center gap-1.5">
                        <Ikon nom="qayta" olcham={12} className="animate-spin" />
                        <span>Qidirilmoqda...</span>
                      </div>
                    )}
                    {userResults.length > 0 && (
                      <div className="mt-2 border border-[var(--v3-chiziq)] rounded-lg divide-y divide-[var(--v3-chiziq)] max-h-52 overflow-y-auto">
                        {userResults.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => selectUser(u)}
                            className="w-full text-left px-4 py-2.5 hover:bg-[var(--v3-yuza-2)] transition-colors"
                          >
                            <div className="text-white text-sm">{u.fullName || u.username}</div>
                            <div className="text-xs text-[var(--v3-xira)]">@{u.username} · {u.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Ism-familya */}
              <div>
                <label className="block text-sm text-[var(--v3-xira)] mb-1.5">
                  Sertifikatdagi ism-familya *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Jabborov Diyorbek Arslonovich"
                  className="v3-kiritish w-full"
                />
                <p className="text-xs text-[var(--v3-xira)] mt-1">
                  Profildagi ism taklif sifatida qo'yiladi — foydalanuvchi u yerda taxallus
                  yozgan bo'lishi mumkin, shuning uchun tekshirib chiqing
                </p>
                {isEditing && (ajratSertifikatTavsifi(formData).isMs || formData.fullNameLocked) && (
                  <label className="mt-2.5 flex items-center gap-2 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.fullNameLocked)}
                      onChange={(e) =>
                        setFormData({ ...formData, fullNameLocked: e.target.checked })
                      }
                      className="rounded accent-amber-400"
                    />
                    <span className="inline-flex items-center gap-1.5">
                      <Ikon nom="qulf" olcham={12} className="shrink-0 text-amber-300" />
                      <span>F.I.SH qulflangan — qayta ochish uchun belgini yeching</span>
                    </span>
                  </label>
                )}
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Sertifikat turi</label>
                  <select
                    value={formData.turi}
                    onChange={(e) => setFormData({ ...formData, turi: e.target.value })}
                    className="v3-kiritish w-full"
                  >
                    <option value={SERTIFIKAT_TURLARI.maxsus}>Admin maxsus / Olimpiada</option>
                    <option value={SERTIFIKAT_TURLARI.hamkor}>Mavsumiy hamkorlik</option>
                    <option value={SERTIFIKAT_TURLARI.milliy}>Milliy Sertifikat</option>
                  </select>
                </div>
              )}

              {/* Fan va sabab */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Fan *</label>
                  <input
                    type="text"
                    value={formData.fan}
                    onChange={(e) => setFormData({ ...formData, fan: e.target.value })}
                    placeholder="Oliy kimyo"
                    list="fanlar-royxati"
                    className="v3-kiritish w-full"
                  />
                  <datalist id="fanlar-royxati">
                    {fanlar.map((fan) => (
                      <option key={fan} value={fan} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Nima uchun *</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Fan olimpiadasi g'olibi"
                    className="v3-kiritish w-full"
                  />
                </div>
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Tavsif</label>
                {isEditing && ajratSertifikatTavsifi(formData).isMs ? (
                  <div className="px-3 py-2.5 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq-2)] text-xs text-[var(--v3-matn)] flex items-start gap-2">
                    <Ikon nom="medal" olcham={15} className="shrink-0 text-indigo-300 mt-0.5" />
                    <span>
                      MS Rasch ko&apos;rsatkichlari metadata sifatida qulflangan. F.I.SH yoki muddatni tahrirlashingiz mumkin.
                    </span>
                  </div>
                ) : (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Respublika bosqichida 1-o'rin..."
                    className="v3-kiritish w-full resize-none"
                  />
                )}
              </div>

              {/* Pechatlar */}
              <div>
                <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Pechatlar</label>
                {formData.partnerSeals && formData.seals.length === 0 && (
                  <div className="mb-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200 flex items-center gap-2">
                    <Ikon nom="hamkor" olcham={15} className="shrink-0 text-emerald-300" />
                    <span>
                      Hamkorlik muhri: <strong>{formData.partnerSeals.partnerName || 'Hamkor'}</strong>
                      {formData.partnerSeals.badgeText ? ` · ${formData.partnerSeals.badgeText}` : ''} (saqlanadi)
                    </span>
                  </div>
                )}
                {formData.seals.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {formData.seals.map((seal, idx) => (
                      <div
                        key={seal.url}
                        className="flex items-center gap-3 px-3 py-2 bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-lg"
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
                          placeholder="Pechat nomi..."
                          className="v3-kiritish flex-1 min-w-0 py-1.5 text-sm"
                        />
                        <button
                          onClick={() => removeSeal(idx)}
                          className="text-red-400 hover:text-red-300 flex-shrink-0 inline-flex items-center"
                          title="Olib tashlash"
                        >
                          <Ikon nom="yopish" olcham={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="v3-tugma text-sm cursor-pointer">
                  <Ikon nom={isUploadingSeal ? 'soat' : 'ilova'} olcham={15} />
                  <span>{isUploadingSeal ? 'Yuklanmoqda...' : "Pechat qo'shish"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleSealUpload}
                    disabled={isUploadingSeal}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Ixtiyoriy: baho, ball, foiz va muddat */}
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Daraja</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="A+"
                    className="v3-kiritish w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Ball</label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="98"
                    className="v3-kiritish w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Foiz (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="96"
                    className="v3-kiritish w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--v3-xira)] mb-1.5">Amal qilish muddati</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="v3-kiritish w-full"
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--v3-xira)] -mt-2">
                Daraja, ball va muddat ixtiyoriy — bo'sh qoldirilsa sertifikatda ko'rsatilmaydi
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <Ikon nom={isSaving ? 'soat' : isEditing ? 'saqlash' : 'sertifikat'} olcham={16} />
                <span>
                  {isSaving
                    ? 'Saqlanmoqda...'
                    : isEditing
                      ? 'Saqlash'
                      : 'Sertifikat berish'}
                </span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="v3-tugma"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {tasdiqOyna && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--v3-fon)] border border-[var(--v3-chiziq-2)] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[var(--v3-matn)]">
              {tasdiqOyna.tur === 'ochirish' ? "Sertifikatni o'chirish" : "Sertifikat holatini o'zgartirish"}
            </h3>
            <p className="text-sm text-[var(--v3-xira)]">{tasdiqOyna.savol}</p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setTasdiqOyna(null)}
                className="v3-tugma text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={tasdiqlaAmal}
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${
                  tasdiqOyna.tur === 'ochirish'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-orange-600 hover:bg-orange-500'
                }`}
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
