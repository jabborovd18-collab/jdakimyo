// app/admin/milliy-sertifikat/page.js
"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import { sanaVaqt } from '@/lib/sana'

const TOSHKENT_OFFSET_MS = 5 * 60 * 60 * 1000

function toshkentInputFormat(dateInput) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return ''
  const tosh = new Date(d.getTime() + TOSHKENT_OFFSET_MS)
  return tosh.toISOString().slice(0, 16)
}

function boshlangichTezVaqt(soatQosh = 0, davomSoat = 12) {
  const hozir = Date.now()
  const bosh = new Date(hozir + soatQosh * 3600 * 1000)
  const tugash = new Date(bosh.getTime() + davomSoat * 3600 * 1000)
  return {
    startsAt: toshkentInputFormat(bosh),
    endsAt: toshkentInputFormat(tugash),
  }
}

function vaqtFormat(soniya) {
  const s = Math.max(0, Number(soniya) || 0)
  const min = Math.floor(s / 60)
  const qolgan = s % 60
  if (min === 0) return `${qolgan}s`
  return `${min}m ${qolgan}s`
}

function csvKatak(qiymat) {
  const matn = qiymat === null || qiymat === undefined ? '' : String(qiymat)
  return `"${matn.replace(/"/g, '""')}"`
}

function faylYuklabOl(nom, matn, bom = true) {
  const tarkib = bom ? `\uFEFF${matn}` : matn
  const blob = new Blob([tarkib], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nom
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const HOLAT_KO_RINISH = {
  belgilanmagan: { matn: 'Sana belgilanmagan', rang: 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)]' },
  kutilmoqda: { matn: 'Kutilmoqda (Boshlanmagan)', rang: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
  ochiq: { matn: 'Hozir ochiq (Imtihon ketmoqda)', rang: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' },
  tekshirilmoqda: { matn: 'Yakunlangan (E\'lon kutilmoqda)', rang: 'bg-sky-500/20 text-sky-300 border-sky-400/50' },
  elon_qilindi: { matn: 'Natijalar hammaga e\'lon qilingan', rang: 'bg-violet-500/20 text-violet-300 border-violet-400/50' },
  yopiq: { matn: 'Vaqtincha yopiq', rang: 'bg-rose-500/20 text-rose-300 border-rose-400/50' },
}

const MUAMMO_YORLIQLARI = {
  yuqori_shovqin_infit: 'Infit > 1.3 (shovqinli)',
  juda_tekis_infit: 'Infit < 0.7 (ortiqcha mos)',
  chekka_outfit: 'Outfit > 1.5 (tasodifiy xato)',
  past_korrelyatsiya: 'Past diskriminatsiya (r < 0.15)',
  manfiy_korrelyatsiya: 'Manfiy korrelyatsiya (tekshiring!)',
  chekka_savol: 'Chekka savol (0% yoki 100%)',
  qiyinlik_siljishi: 'Qiyinlik siljishi (|Δb| ≥ 0.8)',
}

const DARAJA_RANG = {
  'A+': 'from-amber-400 to-yellow-500',
  A: 'from-emerald-400 to-teal-500',
  'B+': 'from-cyan-400 to-sky-500',
  B: 'from-blue-400 to-indigo-500',
  'C+': 'from-violet-400 to-purple-500',
  C: 'from-purple-400 to-fuchsia-500',
  Qoniqarsiz: 'from-rose-500 to-red-600',
}

export default function AdminMilliySertifikatPage() {
  const [banklar, setBanklar] = useState([])
  const [msUmumiyStat, setMsUmumiyStat] = useState(null)
  const [superadminRejimi, setSuperadminRejimi] = useState(false)
  const [migratsiyaXato, setMigratsiyaXato] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [tanlanganSlug, setTanlanganSlug] = useState('milliy-sertifikat-simulyator')
  const joriySlugRef = useRef(tanlanganSlug)
  joriySlugRef.current = tanlanganSlug
  const [detal, setDetal] = useState(null)
  const [detalYuklanmoqda, setDetalYuklanmoqda] = useState(false)
  const [detalTab, setDetalTab] = useState('tahlil') // 'tahlil' | 'qatnashchilar' | 'savollar'

  // Qatnashchilar va savollar filtrlari
  const [qidiruv, setQidiruv] = useState('')
  const [qatnashchiFiltr, setQatnashchiFiltr] = useState('hammasi')
  const [qatnashchiSaralash, setQatnashchiSaralash] = useState('rasch')
  const [savolSohaFiltr, setSavolSohaFiltr] = useState('hammasi')
  const [faqatMuammoli, setFaqatMuammoli] = useState(false)
  const [tanlanganQatnashchi, setTanlanganQatnashchi] = useState(null)

  const [form, setForm] = useState(() => ({
    slug: 'milliy-sertifikat-simulyator',
    sarlavha: '',
    tavsif: '',
    rejim: 'jadval',
    vaqtMin: 100,
    faol: true,
    ...boshlangichTezVaqt(0, 12),
  }))

  useEffect(() => {
    const paramSlug = new URLSearchParams(window.location.search).get('slug')
    if (paramSlug) {
      setTanlanganSlug(paramSlug)
    }
  }, [])

  const yukla = useCallback(async (slugForDetail = null) => {
    setYuklanmoqda(true)
    try {
      const res = await fetch('/api/admin/milliy-sertifikat')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBanklar(data.banklar || [])
      setMsUmumiyStat(data.msUmumiyStat || null)
      setSuperadminRejimi(Boolean(data.superadminRejimi))
      setMigratsiyaXato(data.migratsiyaXato || null)

      const maqsadSlug = slugForDetail || joriySlugRef.current
      const joriy = (data.banklar || []).find((b) => b.slug === maqsadSlug)
      if (joriy) {
        const imt = joriy.imtihon
        const tez = boshlangichTezVaqt(0, 12)
        setForm({
          slug: joriy.slug,
          sarlavha: imt?.sarlavha || joriy.nom,
          tavsif: imt?.tavsif || joriy.qisqa || '',
          rejim: imt?.rejim || 'jadval',
          vaqtMin: imt?.vaqtMin || joriy.vaqtMin || 100,
          faol: imt ? imt.faol : true,
          startsAt: imt?.startsAt ? toshkentInputFormat(imt.startsAt) : tez.startsAt,
          endsAt: imt?.endsAt ? toshkentInputFormat(imt.endsAt) : tez.endsAt,
        })
      }
    } catch (e) {
      toast.error('Yuklashda xatolik: ' + e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  const detalYukla = useCallback(async (slug) => {
    setDetalYuklanmoqda(true)
    try {
      const res = await fetch(`/api/admin/milliy-sertifikat?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDetal(data.tanlanganDetal || null)
      if (data.msUmumiyStat) setMsUmumiyStat(data.msUmumiyStat)
    } catch (e) {
      toast.error('Tafsilotlarni yuklab bo\'lmadi: ' + e.message)
    } finally {
      setDetalYuklanmoqda(false)
    }
  }, [])

  useEffect(() => {
    yukla()
  }, [yukla])

  useEffect(() => {
    if (tanlanganSlug) {
      detalYukla(tanlanganSlug)
    }
  }, [tanlanganSlug, detalYukla])

  const tanlaSinov = (bank) => {
    setTanlanganSlug(bank.slug)
    setTanlanganQatnashchi(null)
    const imt = bank.imtihon
    const tez = boshlangichTezVaqt(0, 12)
    setForm({
      slug: bank.slug,
      sarlavha: imt?.sarlavha || bank.nom,
      tavsif: imt?.tavsif || bank.qisqa || '',
      rejim: imt?.rejim || 'jadval',
      vaqtMin: imt?.vaqtMin || bank.vaqtMin || 100,
      faol: imt ? imt.faol : true,
      startsAt: imt?.startsAt ? toshkentInputFormat(imt.startsAt) : tez.startsAt,
      endsAt: imt?.endsAt ? toshkentInputFormat(imt.endsAt) : tez.endsAt,
    })
  }

  const jadvalSaqla = async (e) => {
    e.preventDefault()
    setSaqlanmoqda(true)
    try {
      const res = await fetch('/api/admin/milliy-sertifikat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_exam', ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || 'Saqlandi')
      await yukla(form.slug)
      await detalYukla(form.slug)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const natijaniElonQil = async (slug) => {
    setSaqlanmoqda(true)
    try {
      const res = await fetch('/api/admin/milliy-sertifikat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish_results', slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      await yukla(slug)
      await detalYukla(slug)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const elonniYashir = async (slug) => {
    setSaqlanmoqda(true)
    try {
      const res = await fetch('/api/admin/milliy-sertifikat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish_results', slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      await yukla(slug)
      await detalYukla(slug)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const tezPresetQoy = (tur) => {
    const endOfDayTosh = (dayOffset) => {
      const d = new Date(Date.now() + dayOffset * 86400 * 1000 + TOSHKENT_OFFSET_MS)
      const sanaStr = d.toISOString().slice(0, 10)
      return {
        startsAt: `${sanaStr}T09:00`,
        endsAt: `${sanaStr}T22:00`,
      }
    }
    if (tur === 'hozir_2soat') {
      setForm((p) => ({ ...p, rejim: 'jadval', faol: true, ...boshlangichTezVaqt(0, 2) }))
    } else if (tur === 'bugun') {
      setForm((p) => ({ ...p, rejim: 'jadval', faol: true, ...endOfDayTosh(0) }))
    } else if (tur === 'ertaga') {
      setForm((p) => ({ ...p, rejim: 'jadval', faol: true, ...endOfDayTosh(1) }))
    }
  }

  const joriyBank = banklar.find((b) => b.slug === tanlanganSlug)
  const joriyImtihon = detal?.imtihon || joriyBank?.imtihon
  const kalibrlash = detal?.kalibrlashOldindan
  const stats = kalibrlash?.stats || null
  const sifat = stats?.raschSifatXulosasi || null
  const taq = stats?.taqqoslashXulosasi || null

  const eksportToliqCsv = () => {
    const qat = kalibrlash?.qatnashchilar || []
    if (qat.length === 0) {
      toast.error('Eksport qilish uchun qatnashchilar yo\'q')
      return
    }
    const sarlavhalar = [
      "O'rin",
      'Ism',
      'Username',
      'Rasch ball',
      'Rasch daraja',
      'Theta',
      'SE',
      'Infit MNSQ',
      'Outfit MNSQ',
      'Ishonchsiz fit',
      "Oddiy to'g'ri",
      'Jami savol',
      'Oddiy %',
      'Oddiy baho',
      'Farq (Rasch - Oddiy)',
      'Foydali tomon',
      'Percentile',
      'Sarflangan vaqt (s)',
      'Kechikkan',
      'Holat',
      'Sertifikat ID',
      'Yakunlangan vaqt',
    ]
    const qatorlar = qat.map((q, i) => [
      q.rasch?.rank ?? i + 1,
      q.ism,
      q.username || '',
      q.rasch?.shkalaBalli ?? '',
      q.rasch?.daraja ?? '',
      q.rasch?.theta ?? '',
      q.rasch?.se ?? '',
      q.rasch?.infit ?? '',
      q.rasch?.outfit ?? '',
      q.rasch?.ishonchsiz ? 'Ha' : "Yo'q",
      q.oddiy?.rawScore ?? '',
      q.oddiy?.jamiSavollar ?? '',
      q.oddiy?.oddiyFoiz ?? '',
      q.oddiy?.oddiyBaho ?? '',
      q.taqqoslash?.farqBall ?? '',
      q.taqqoslash?.foydaliTomon ?? '',
      q.rasch?.percentile ?? '',
      q.sarflanganVaqt ?? 0,
      q.kechikkan ? 'Ha' : "Yo'q",
      q.holat || '',
      q.certId || '',
      q.yakunlanganVaqt || '',
    ])
    const matn = [
      sarlavhalar.map(csvKatak).join(','),
      ...qatorlar.map((r) => r.map(csvKatak).join(',')),
    ].join('\n')
    const sana = new Date().toISOString().slice(0, 10)
    faylYuklabOl(`ms-hisobot-${tanlanganSlug}-${sana}.csv`, matn, true)
    toast.success('Excel CSV hisobot yuklab olindi')
  }

  const eksportAnonimCmlCsv = () => {
    const csvObj = detal?.csvAnonim
    if (!csvObj?.matn || csvObj.qatorlar === 0) {
      toast.error('CML 0/1 matritsa uchun yaroqli birinchi urinishlar topilmadi')
      return
    }
    const sana = new Date().toISOString().slice(0, 10)
    faylYuklabOl(`ms-cml-matritsa-${tanlanganSlug}-${sana}.csv`, csvObj.matn, false)
    toast.success(`Anonim CML matritsa (${csvObj.qatorlar} qator) yuklab olindi`)
  }

  const saralanganQatnashchilar = useMemo(() => {
    const xom = kalibrlash?.qatnashchilar || []
    const q = qidiruv.trim().toLowerCase()
    const filtrlangan = xom.filter((item) => {
      if (q) {
        const mos =
          (item.ism || '').toLowerCase().includes(q) ||
          (item.username || '').toLowerCase().includes(q) ||
          (item.certId || '').toLowerCase().includes(q)
        if (!mos) return false
      }
      if (qatnashchiFiltr === 'sertifikat') {
        return !item.kechikkan && item.rasch?.daraja && item.rasch.daraja !== 'Qoniqarsiz'
      }
      if (qatnashchiFiltr === 'qoniqarsiz') {
        return item.rasch?.daraja === 'Qoniqarsiz'
      }
      if (qatnashchiFiltr === 'rasch_foyda') {
        return item.taqqoslash?.foydaliTomon === 'rasch'
      }
      if (qatnashchiFiltr === 'oddiy_foyda') {
        return item.taqqoslash?.foydaliTomon === 'oddiy'
      }
      if (qatnashchiFiltr === 'ishonchsiz') {
        return Boolean(item.rasch?.ishonchsiz)
      }
      if (qatnashchiFiltr === 'kechikkan') {
        return Boolean(item.kechikkan)
      }
      return true
    })

    return [...filtrlangan].sort((a, b) => {
      if (qatnashchiSaralash === 'oddiy') {
        return (b.oddiy?.oddiyFoiz ?? 0) - (a.oddiy?.oddiyFoiz ?? 0)
      }
      if (qatnashchiSaralash === 'farq') {
        return (b.taqqoslash?.farqBall ?? 0) - (a.taqqoslash?.farqBall ?? 0)
      }
      if (qatnashchiSaralash === 'vaqt') {
        return (a.sarflanganVaqt ?? 0) - (b.sarflanganVaqt ?? 0)
      }
      return (b.rasch?.shkalaBalli ?? 0) - (a.rasch?.shkalaBalli ?? 0)
    })
  }, [kalibrlash, qidiruv, qatnashchiFiltr, qatnashchiSaralash])

  const savolSohalar = useMemo(() => {
    const meta = stats?.savollarMeta || []
    return Array.from(new Set(meta.map((s) => s.soha).filter(Boolean)))
  }, [stats])

  const filtrlanganSavollar = useMemo(() => {
    const meta = stats?.savollarMeta || []
    return meta.filter((s) => {
      if (savolSohaFiltr !== 'hammasi' && s.soha !== savolSohaFiltr) return false
      if (faqatMuammoli) {
        const bDrift = Math.abs((s.qiyinlik || 0) - (s.boshlangichQiyinlik || 0)) >= 0.8
        if ((!s.muammo || s.muammo.length === 0) && !bDrift) return false
      }
      return true
    })
  }, [stats, savolSohaFiltr, faqatMuammoli])

  return (
    <div className="space-y-6">
      {/* Yuqori sarlavha va bog'lamalar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
            <Ikon nom="medal" olcham={22} className="text-amber-300 shrink-0" />
            <span>Milliy Sertifikat (MS) Boshqaruvi va Psixometrik Hisobot</span>
            {superadminRejimi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-400/50">
                <Ikon nom="toj" olcham={13} />
                <span>Superadmin</span>
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--v3-xira)] mt-1">
            Belgilangan sana, yashirin yig&apos;ish, kohort Rasch CML kalibrlash, Rasch vs Oddiy tahlil hamda Excel eksporti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="v3-tugma text-xs"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/certificates?manba=ms"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 transition"
          >
            <Ikon nom="sertifikat" olcham={14} />
            <span>Sertifikatlar ({msUmumiyStat?.msSertifikatlarSoni ?? 0})</span>
          </Link>
          <Link
            href="/admin/logs?targetType=MsImtihon"
            className="v3-tugma text-xs"
          >
            <Ikon nom="royxat" olcham={14} />
            <span>Loglar</span>
          </Link>
          {superadminRejimi && joriyBank?.bankTayyor && (
            <Link
              href={`/milliy-sertifikat/${encodeURIComponent(tanlanganSlug)}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-400/60 text-xs font-bold text-amber-200 transition"
            >
              <Ikon nom="toj" olcham={14} />
              <span>Sinovdan o&apos;tish</span>
            </Link>
          )}
          <button
            onClick={() => {
              yukla()
              detalYukla(tanlanganSlug)
            }}
            className="v3-tugma v3-tugma-asosiy text-xs"
          >
            <Ikon nom="qayta" olcham={14} />
            <span>Yangilash</span>
          </button>
        </div>
      </div>

      {/* Umumiy platforma MS ko'rsatkichlari */}
      {msUmumiyStat && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
            <div className="text-[11px] text-[var(--v3-xira)]">Tayyor test banklari</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {msUmumiyStat.tayyorBanklar} <span className="text-xs text-[var(--v3-xira)]">/ {msUmumiyStat.jamiBanklar} ta</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-emerald-500/30">
            <div className="text-[11px] text-emerald-300">Rejalangan / Ochiq</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">
              {msUmumiyStat.rejalanganlar} <span className="text-xs text-emerald-400/80">({msUmumiyStat.ochiqSinovlar} ochiq)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-sky-500/30">
            <div className="text-[11px] text-sky-300">E&apos;lon kutilmoqda / E&apos;lon</div>
            <div className="text-xl font-bold text-sky-300 mt-0.5">
              {msUmumiyStat.elonKutilayotgan} <span className="text-xs text-violet-300">/ {msUmumiyStat.elonQilingan} e&apos;lon</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--v3-yuza)] border border-amber-500/30">
            <div className="text-[11px] text-amber-300">Real qatnashchilar (superadminsiz)</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">
              {msUmumiyStat.jamiIshtirokchilar} <span className="text-xs text-amber-200/70">· {msUmumiyStat.msSertifikatlarSoni} sertifikat</span>
            </div>
          </div>
        </div>
      )}

      {migratsiyaXato && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/50 text-rose-200 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Ikon nom="ogohlantirish" olcham={15} className="text-rose-300 shrink-0" />
            <span>Bazada jadval migratsiyasi xatosi</span>
          </div>
          <div>Xato: {migratsiyaXato}</div>
          <div className="font-mono text-amber-300 pt-1">npx prisma migrate deploy</div>
        </div>
      )}

      {/* Sinov banklari ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {banklar.map((b) => {
          const holat = b.imtihon?.holat || (b.bankTayyor ? 'belgilanmagan' : 'yopiq')
          const badge = HOLAT_KO_RINISH[holat] || HOLAT_KO_RINISH.belgilanmagan
          const aktiv = b.slug === tanlanganSlug
          return (
            <button
              key={b.slug}
              onClick={() => tanlaSinov(b)}
              className={`text-left p-4 rounded-2xl border transition ${
                aktiv
                  ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-lg'
                  : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-amber-300">
                  {b.mavjudSavollar}/{b.savollarSoni} savol
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.rang}`}>
                  {b.bankTayyor ? badge.matn : 'Bank to\'lmagan'}
                </span>
              </div>
              <div className="font-bold text-white text-sm mt-2 line-clamp-2">{b.nom}</div>
              <div className="text-[11px] text-[var(--v3-xira)] mt-1 flex items-center justify-between">
                <span>
                  Qatnashchilar: <strong className="text-white">{b.imtihon?.urinishlarSoni ?? 0}</strong> ta
                </span>
                {b.imtihon?.kalibrlashUsuli && (
                  <span className="font-mono text-cyan-300">{b.imtihon.kalibrlashUsuli}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Tanlangan sinov sozlamalari va boy hisobot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chap panel: Jadval va muddat */}
        <form
          onSubmit={jadvalSaqla}
          className="lg:col-span-4 v3-panel-karta p-5 space-y-4 h-fit"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Ikon nom="taqvim" olcham={17} className="text-amber-300 shrink-0" />
              <span>Imtihon sanasi va rejimi</span>
            </h2>
            {!joriyBank?.bankTayyor && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Bank tayyor emas
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs text-[var(--v3-xira)] mb-1">Sarlavha</label>
            <input
              type="text"
              value={form.sarlavha}
              onChange={(e) => setForm((p) => ({ ...p, sarlavha: e.target.value }))}
              className="v3-kiritish w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--v3-xira)] mb-1">O&apos;tkazish rejimi</label>
              <select
                value={form.rejim}
                onChange={(e) => setForm((p) => ({ ...p, rejim: e.target.value }))}
                className="v3-kiritish w-full text-sm"
              >
                <option value="jadval">Belgilangan sana (Umumiy e&apos;lon)</option>
                <option value="erkin">Erkin mashq (Darhol natija)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--v3-xira)] mb-1">Test vaqti (daqiqa)</label>
              <input
                type="number"
                min={10}
                max={300}
                value={form.vaqtMin}
                onChange={(e) => setForm((p) => ({ ...p, vaqtMin: e.target.value }))}
                className="v3-kiritish w-full text-sm"
              />
            </div>
          </div>

          {form.rejim === 'jadval' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => tezPresetQoy('hozir_2soat')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600/25 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-600/40"
                >
                  Hozir +2 soat (Sinov)
                </button>
                <button
                  type="button"
                  onClick={() => tezPresetQoy('bugun')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-600/25 border border-sky-500/40 text-sky-200 hover:bg-sky-600/40"
                >
                  Bugun 09:00–22:00
                </button>
                <button
                  type="button"
                  onClick={() => tezPresetQoy('ertaga')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-600/25 border border-amber-500/40 text-amber-200 hover:bg-amber-600/40"
                >
                  Ertaga 09:00–22:00
                </button>
              </div>

              <div>
                <label className="block text-xs text-[var(--v3-xira)] mb-1">
                  Boshlanish vaqti (Toshkent UTC+5)
                </label>
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm((p) => ({ ...p, startsAt: e.target.value }))}
                  className="v3-kiritish w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--v3-xira)] mb-1">
                  Yopilish vaqti (Toshkent UTC+5)
                </label>
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))}
                  className="v3-kiritish w-full text-sm"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)] cursor-pointer">
            <input
              type="checkbox"
              checked={form.faol}
              onChange={(e) => setForm((p) => ({ ...p, faol: e.target.checked }))}
              className="rounded border-[var(--v3-chiziq-2)]"
            />
            <span>Imtihon faol (o&apos;quvchilar uchun ko&apos;rinadi)</span>
          </label>

          <button
            type="submit"
            disabled={saqlanmoqda || yuklanmoqda}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm hover:opacity-95 disabled:opacity-50 transition"
          >
            {saqlanmoqda ? 'Saqlanmoqda...' : 'Jadvalni saqlash'}
          </button>

          {superadminRejimi && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Ikon nom="toj" olcham={15} className="text-amber-300 shrink-0 mt-0.5" />
              <span>
                <strong>Superadmin nazorat qoidasi:</strong> Siz har qanday sinovni istalgan vaqt cheksiz yechishingiz mumkin — natijangiz darhol ko&apos;rsatiladi, lekin hech qachon bazaga, reytingga, sertifikatlarga va bu statistikaga yozilmaydi.
              </span>
            </div>
          )}
        </form>

        {/* O'ng panel: Boy Psixometrik Hisobot va E'lon */}
        <div className="lg:col-span-8 v3-panel-karta p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Ikon nom="ustunGrafik" olcham={17} className="text-amber-300 shrink-0" />
                <span>Kohort Rasch kalibrlash, Tahlil va E&apos;lon</span>
              </h2>
              <div className="text-xs text-[var(--v3-xira)] mt-0.5">
                {joriyImtihon?.publishedAt
                  ? `Oxirgi e'lon: ${sanaVaqt(joriyImtihon.publishedAt)}`
                  : 'Natijalar hali ommaga e\'lon qilinmagan'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {kalibrlash && (
                <>
                  <button
                    type="button"
                    onClick={eksportToliqCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 font-semibold text-xs transition"
                  >
                    <Ikon nom="fayl" olcham={14} />
                    <span>Excel CSV</span>
                  </button>
                  {detal?.csvAnonim?.qatorlar > 0 && (
                    <button
                      type="button"
                      onClick={eksportAnonimCmlCsv}
                      title="Psixometrik tahlil (R / Python eRm / TAM) uchun anonim 0/1 matritsa"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-semibold text-xs transition"
                    >
                      <Ikon nom="panjara" olcham={14} />
                      <span>CML 0/1 ({detal.csvAnonim.qatorlar})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="v3-tugma text-xs"
                  >
                    <Ikon nom="chopEt" olcham={14} />
                    <span>Chop etish</span>
                  </button>
                </>
              )}
              {joriyImtihon && (
                <>
                  <button
                    type="button"
                    onClick={() => natijaniElonQil(tanlanganSlug)}
                    disabled={saqlanmoqda || !kalibrlash}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition disabled:opacity-50"
                  >
                    <Ikon nom="elon" olcham={14} />
                    <span>Rasch kalibrlash &amp; Hammaga e&apos;lon</span>
                  </button>
                  {joriyImtihon.isAnnounced && (
                    <button
                      type="button"
                      onClick={() => elonniYashir(tanlanganSlug)}
                      disabled={saqlanmoqda}
                      className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-xs transition"
                    >
                      Yashirish
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {detalYuklanmoqda ? (
            <div className="py-12 text-center text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
          ) : !kalibrlash || !stats ? (
            <div className="py-12 text-center text-sm text-[var(--v3-xira)] border border-dashed border-[var(--v3-chiziq)] rounded-2xl">
              Hozircha bu imtihon bo&apos;yicha haqiqiy o&apos;quvchilar topshirgan urinishlar yo&apos;q.
            </div>
          ) : (
            <div className="space-y-5">
              {/* 6 ta KPI kartalar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]">
                  <div className="text-[11px] text-[var(--v3-xira)]">Jami topshirgan</div>
                  <div className="text-lg font-bold text-white">{stats.jamiUrinish} nafar</div>
                  <div className="text-[10px] text-[var(--v3-xira)] mt-0.5">
                    {stats.jamiUrinish - (sifat?.kechikkanSoni || 0)} o&apos;z vaqtida · {sifat?.kechikkanSoni || 0} kechikkan
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-cyan-500/30">
                  <div className="text-[11px] text-cyan-300">CML Kohort / Ishonchlilik</div>
                  <div className="text-lg font-bold text-cyan-300">
                    {stats.yaroqliKohort} <span className="text-xs font-mono">({kalibrlash.kalibrlashUsuli})</span>
                  </div>
                  <div className="text-[10px] text-[var(--v3-xira)] mt-0.5">
                    Sep: {stats.ishonchlilik ?? '—'} · T-shkala: {stats.tShkalaFaol ? 'Faol' : 'Standart'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-amber-500/30">
                  <div className="text-[11px] text-amber-300">Rasch ball (O&apos;rtacha)</div>
                  <div className="text-lg font-bold text-amber-300">{stats.ortachaRaschBall}</div>
                  <div className="text-[10px] text-[var(--v3-xira)] mt-0.5">
                    Med: {sifat?.medianaRasch ?? '—'} · [{sifat?.engPastRasch ?? 0}..{sifat?.engYuqoriRasch ?? 0}]
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-sky-500/30">
                  <div className="text-[11px] text-sky-300">Oddiy foiz (O&apos;rtacha)</div>
                  <div className="text-lg font-bold text-sky-300">{stats.ortachaOddiyFoiz}%</div>
                  <div className="text-[10px] text-[var(--v3-xira)] mt-0.5">
                    Med: {sifat?.medianaOddiy ?? '—'}% · Vaqt: ~{vaqtFormat(sifat?.ortachaVaqtSoniya)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-emerald-500/30">
                  <div className="text-[11px] text-emerald-300">Sertifikat oluvchilar (C+)</div>
                  <div className="text-lg font-bold text-emerald-300">
                    {sifat?.sertifikatOladiSoni ?? 0} <span className="text-xs">({sifat?.sertifikatFoizi ?? 0}%)</span>
                  </div>
                  <div className="text-[10px] text-rose-300/80 mt-0.5">
                    Ishonchsiz fit: {sifat?.ishonchsizSoni ?? 0} ta
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--v3-yuza-2)] border border-violet-500/30">
                  <div className="text-[11px] text-violet-300">Rasch vs Oddiy ustunligi</div>
                  <div className="text-sm font-bold text-white mt-1">
                    <span className="text-emerald-300">R+:{taq?.raschFoydaSoni ?? 0}</span> ·{' '}
                    <span className="text-rose-300">O+:{taq?.oddiyFoydaSoni ?? 0}</span> ·{' '}
                    <span className="text-[var(--v3-xira)]">=:{taq?.tengSoni ?? 0}</span>
                  </div>
                  <div className="text-[10px] text-[var(--v3-xira)] mt-0.5">
                    O&apos;rt. farq: {(taq?.ortachaFarq ?? 0) >= 0 ? '+' : ''}{taq?.ortachaFarq ?? 0} ball
                  </div>
                </div>
              </div>

              {/* Tablar */}
              <div className="flex flex-wrap gap-2 border-b border-[var(--v3-chiziq)] pb-2">
                {[
                  { id: 'tahlil', nom: 'Umumiy tahlil va Taqsimot', ikon: 'grafik' },
                  { id: 'qatnashchilar', nom: `Qatnashchilar (${kalibrlash.qatnashchilar.length})`, ikon: 'odamlar' },
                  { id: 'savollar', nom: `Savollar kalibrlashi (${stats.savollarMeta.length})`, ikon: 'mikroskop' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDetalTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      detalTab === t.id
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50'
                        : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                    }`}
                  >
                    <Ikon nom={t.ikon} olcham={14} />
                    <span>{t.nom}</span>
                  </button>
                ))}
              </div>

              {/* TAB 1: UMUMIY TAHLIL VA TAQSIMOT */}
              {detalTab === 'tahlil' && (
                <div className="space-y-5">
                  {/* Rasch Darajalar vs Oddiy Baholar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          Rasch Daraja Taqsimoti
                        </h3>
                        <span className="text-[11px] text-[var(--v3-xira)]">
                          μθ={stats.meanTheta} · SD={stats.sdTheta}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {(stats.darajaTaqsimoti || []).map((d) => (
                          <div key={d.daraja} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{d.daraja}</span>
                              <span className="font-mono text-[var(--v3-xira)]">
                                {d.soni} nafar ({d.foiz}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${DARAJA_RANG[d.daraja] || 'from-amber-400 to-orange-500'}`}
                                style={{ width: `${d.foiz}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] space-y-3">
                      <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                        Oddiy Tizim Baholari (Rasch&apos;siz)
                      </h3>
                      <div className="space-y-2">
                        {(stats.oddiyTaqsimot || []).map((o) => (
                          <div key={o.baho} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-white">{o.baho}</span>
                              <span className="font-mono text-[var(--v3-xira)]">
                                {o.soni} nafar ({o.foiz}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                                style={{ width: `${o.foiz}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Rasch vs Oddiy ekstremumlar */}
                      <div className="pt-2 border-t border-[var(--v3-chiziq)] grid grid-cols-1 gap-2 text-xs">
                        {taq?.engKattaMusbatFarq && (
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="text-[10px] text-emerald-300">Rasch eng ko&apos;p qo&apos;llab-quvvatlagan:</div>
                            <div className="font-semibold text-white mt-0.5 flex justify-between gap-2">
                              <span className="truncate">{taq.engKattaMusbatFarq.ism}</span>
                              <span className="font-mono text-emerald-300">
                                +{taq.engKattaMusbatFarq.farqBall} ({taq.engKattaMusbatFarq.raschBall} vs {taq.engKattaMusbatFarq.oddiyBall}%)
                              </span>
                            </div>
                          </div>
                        )}
                        {taq?.engKattaManfiyFarq && (
                          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                            <div className="text-[10px] text-rose-300">Oddiy ball yuqoriroq chiqqan (oson xato):</div>
                            <div className="font-semibold text-white mt-0.5 flex justify-between gap-2">
                              <span className="truncate">{taq.engKattaManfiyFarq.ism}</span>
                              <span className="font-mono text-rose-300">
                                {taq.engKattaManfiyFarq.farqBall} ({taq.engKattaManfiyFarq.raschBall} vs {taq.engKattaManfiyFarq.oddiyBall}%)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kimyo sohalari va Topshiriq turlari */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] space-y-2.5">
                      <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Kimyo sohalari bo&apos;yicha o&apos;zlashtirish
                      </h3>
                      <div className="space-y-2.5">
                        {(stats.sohalarHisoboti || []).map((s) => (
                          <div key={s.soha} className="space-y-1">
                            <div className="flex items-center justify-between text-xs gap-2">
                              <span className="font-semibold text-white truncate">
                                {s.soha} <span className="text-[var(--v3-xira)] font-normal">({s.savollarSoni} savol)</span>
                              </span>
                              <span className="font-mono text-cyan-300 flex-shrink-0">
                                {s.ortachaTogriFoiz !== null ? `${s.ortachaTogriFoiz}%` : '—'} · b={s.ortachaB}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                                style={{ width: `${s.ortachaTogriFoiz ?? 0}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-[var(--v3-xira)] flex justify-between">
                              <span>Eng oson: #{s.engOsonSavolId}</span>
                              <span>Eng qiyin: #{s.engQiyinSavolId}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] space-y-2.5">
                      <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Topshiriq turlari kesimi
                      </h3>
                      <div className="space-y-2.5">
                        {(stats.turlarHisoboti || []).map((t) => (
                          <div key={t.turi} className="space-y-1">
                            <div className="flex items-center justify-between text-xs gap-2">
                              <span className="font-semibold text-white truncate">{t.nom}</span>
                              <span className="font-mono text-emerald-300 flex-shrink-0">
                                {t.ortachaTogriFoiz !== null ? `${t.ortachaTogriFoiz}%` : '—'} ({t.savollarSoni} ta)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                                style={{ width: `${t.ortachaTogriFoiz ?? 0}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Psixometrik ogohlantirishlar */}
                  <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Ikon nom="ogohlantirish" olcham={14} />
                        <span>Psixometrik ogohlantirishlar (Muammoli savollar)</span>
                      </h3>
                      <span className="text-xs font-mono text-[var(--v3-xira)]">
                        {(stats.muammolarHisoboti || []).length} ta savol
                      </span>
                    </div>
                    {(stats.muammolarHisoboti || []).length === 0 ? (
                      <div className="text-xs text-emerald-300 py-2 flex items-center gap-1.5">
                        <Ikon nom="tasdiq" olcham={14} className="shrink-0" />
                        <span>Barcha savollar psixometrik Infit/Outfit va qiyinlik siljishi me&apos;yorida.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {stats.muammolarHisoboti.map((m) => (
                          <div
                            key={m.id}
                            className="p-2.5 rounded-lg bg-rose-950/25 border border-rose-700/40 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-amber-300 font-mono">
                                #{m.id} · {m.soha}
                              </span>
                              <span className="font-mono text-[var(--v3-xira)]">
                                b: {m.boshlangichQiyinlik} → {m.qiyinlik} ({m.bDrift >= 0 ? '+' : ''}{m.bDrift})
                              </span>
                            </div>
                            <div className="text-[var(--v3-matn)] truncate">{m.mavzu}</div>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {m.sabablar.map((sabab) => (
                                <span
                                  key={sabab}
                                  className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/40 text-[10px]"
                                >
                                  {MUAMMO_YORLIQLARI[sabab] || sabab}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: QATNASHCHILAR JADVALI */}
              {detalTab === 'qatnashchilar' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="relative">
                      <Ikon
                        nom="qidiruv"
                        olcham={14}
                        className="text-[var(--v3-xira)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={qidiruv}
                        onChange={(e) => setQidiruv(e.target.value)}
                        placeholder="Ism, @username yoki JDA-MS-..."
                        className="v3-kiritish pl-8 text-xs"
                      />
                    </div>
                    <select
                      value={qatnashchiFiltr}
                      onChange={(e) => setQatnashchiFiltr(e.target.value)}
                      className="v3-kiritish text-xs"
                    >
                      <option value="hammasi">Barchasi</option>
                      <option value="sertifikat">Sertifikat oladi (C+..A+)</option>
                      <option value="qoniqarsiz">Qoniqarsiz</option>
                      <option value="rasch_foyda">Rasch yuqoriroq chiqqan</option>
                      <option value="oddiy_foyda">Oddiy ball yuqoriroq chiqqan</option>
                      <option value="ishonchsiz">Ishonchsiz fit (Infit &gt; 1.3)</option>
                      <option value="kechikkan">Kechikkan urinishlar</option>
                    </select>
                    <select
                      value={qatnashchiSaralash}
                      onChange={(e) => setQatnashchiSaralash(e.target.value)}
                      className="v3-kiritish text-xs"
                    >
                      <option value="rasch">Saralash: Rasch ball ↓</option>
                      <option value="oddiy">Saralash: Oddiy foiz ↓</option>
                      <option value="farq">Saralash: Farq (Rasch − Oddiy) ↓</option>
                      <option value="vaqt">Saralash: Sarflangan vaqt ↑</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto max-h-[32rem] rounded-xl border border-[var(--v3-chiziq)]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] sticky top-0 z-10">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Ishtirokchi</th>
                          <th className="p-2.5">Rasch (θ ± SE)</th>
                          <th className="p-2.5">Oddiy ball</th>
                          <th className="p-2.5">Farq</th>
                          <th className="p-2.5">Vaqt / Sertifikat</th>
                          <th className="p-2.5 text-right">Amal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--v3-chiziq)] text-[var(--v3-matn)]">
                        {saralanganQatnashchilar.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-[var(--v3-xira)]">
                              Filtr bo&apos;yicha qatnashchi topilmadi
                            </td>
                          </tr>
                        ) : (
                          saralanganQatnashchilar.map((q, idx) => {
                            const rank = q.rasch?.rank
                            const medalRangi =
                              rank === 1
                                ? 'text-amber-300'
                                : rank === 2
                                  ? 'text-slate-300'
                                  : rank === 3
                                    ? 'text-orange-400'
                                    : null
                            return (
                              <tr key={q.id} className="hover:bg-[var(--v3-yuza-2)]">
                                <td className="p-2.5 font-mono text-[var(--v3-xira)] whitespace-nowrap">
                                  {medalRangi ? (
                                    <span className={`inline-flex items-center gap-1 font-bold ${medalRangi}`}>
                                      <Ikon nom="medal" olcham={14} />
                                      <span>{rank}</span>
                                    </span>
                                  ) : (
                                    rank || idx + 1
                                  )}
                                </td>
                                <td className="p-2.5">
                                  <div className="font-semibold text-white flex items-center gap-1.5">
                                    <span>{q.ism}</span>
                                    {q.rasch?.ishonchsiz && (
                                      <span title="Infit/Outfit shovqini" className="text-rose-400 inline-flex items-center">
                                        <Ikon nom="ogohlantirish" olcham={13} />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[var(--v3-xira)] flex items-center gap-2">
                                    {q.username && <span>@{q.username}</span>}
                                    {q.profilId && (
                                      <Link
                                        href={`/profil/${encodeURIComponent(q.profilId)}`}
                                        className="text-sky-300 hover:underline"
                                      >
                                        Profil →
                                      </Link>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono whitespace-nowrap">
                                  <div>
                                    <span className="text-amber-300 font-bold">{q.rasch?.shkalaBalli}</span>{' '}
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px]">
                                      {q.rasch?.daraja}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[var(--v3-xira)]">
                                    θ={q.rasch?.theta} · ±{q.rasch?.se}
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono whitespace-nowrap">
                                  <div>
                                    {q.oddiy?.rawScore}/{q.oddiy?.jamiSavollar} ({q.oddiy?.oddiyFoiz}%)
                                  </div>
                                  <div className="text-[10px] text-[var(--v3-xira)]">{q.oddiy?.oddiyBaho}</div>
                                </td>
                                <td className="p-2.5 font-mono whitespace-nowrap">
                                  <span
                                    className={
                                      q.taqqoslash?.farqBall >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'
                                    }
                                  >
                                    {q.taqqoslash?.farqBall >= 0 ? '+' : ''}
                                    {q.taqqoslash?.farqBall}
                                  </span>
                                </td>
                                <td className="p-2.5 whitespace-nowrap">
                                  <div className="text-[11px] font-mono text-[var(--v3-matn)] flex items-center gap-1">
                                    <span>{vaqtFormat(q.sarflanganVaqt)}</span>
                                    {q.kechikkan && (
                                      <span className="inline-flex items-center gap-0.5 text-amber-300">
                                        · <Ikon nom="soat" olcham={11} /> Kechikkan
                                      </span>
                                    )}
                                  </div>
                                  {q.certId ? (
                                    <Link
                                      href={`/sertifikat/verify/${encodeURIComponent(q.certId)}`}
                                      className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 hover:underline"
                                    >
                                      <Ikon nom="sertifikat" olcham={11} />
                                      <span>{q.certId}</span>
                                    </Link>
                                  ) : (
                                    <span className="text-[10px] text-[var(--v3-xira)]">{q.holat}</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setTanlanganQatnashchi(q)}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-400/40 text-indigo-200 text-[11px] font-semibold"
                                  >
                                    Tafsilot
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: SAVOLLAR KALIBRLASHI */}
              {detalTab === 'savollar' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <select
                      value={savolSohaFiltr}
                      onChange={(e) => setSavolSohaFiltr(e.target.value)}
                      className="v3-kiritish py-1.5 text-xs"
                    >
                      <option value="hammasi">Barcha kimyo sohalari ({stats.savollarMeta.length})</option>
                      {savolSohalar.map((soha) => (
                        <option key={soha} value={soha}>{soha}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={faqatMuammoli}
                        onChange={(e) => setFaqatMuammoli(e.target.checked)}
                        className="rounded border-[var(--v3-chiziq-2)]"
                      />
                      <span>Faqat psixometrik ogohlantirishli savollar</span>
                    </label>
                  </div>

                  <div className="overflow-x-auto max-h-[32rem] rounded-xl border border-[var(--v3-chiziq)]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] sticky top-0 z-10">
                        <tr>
                          <th className="p-2.5">Savol</th>
                          <th className="p-2.5">Boshl. b → Kalib. b</th>
                          <th className="p-2.5">Kohort to&apos;g&apos;ri %</th>
                          <th className="p-2.5">Infit / Outfit</th>
                          <th className="p-2.5">Korrel. / Holat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--v3-chiziq)] text-[var(--v3-matn)]">
                        {filtrlanganSavollar.map((s) => {
                          const delta = Number(((s.qiyinlik || 0) - (s.boshlangichQiyinlik || 0)).toFixed(2))
                          const fitShovqin = (s.infit && (s.infit > 1.3 || s.infit < 0.7)) || (s.outfit && s.outfit > 1.5)
                          return (
                            <tr key={s.kalit} className="hover:bg-[var(--v3-yuza-2)]">
                              <td className="p-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-amber-300 font-bold">#{s.id}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)]">
                                    {s.soha}
                                  </span>
                                </div>
                                <div className="text-[var(--v3-matn)] mt-0.5 line-clamp-1">{s.mavzu}</div>
                              </td>
                              <td className="p-2.5 font-mono whitespace-nowrap">
                                <span className="text-[var(--v3-xira)]">{s.boshlangichQiyinlik}</span> →{' '}
                                <span className="text-cyan-300 font-bold">{s.qiyinlik}</span>
                                <div
                                  className={`text-[10px] ${
                                    Math.abs(delta) >= 0.8
                                      ? 'text-amber-300'
                                      : 'text-[var(--v3-xira)]'
                                  }`}
                                >
                                  Δb: {delta >= 0 ? '+' : ''}{delta}
                                </div>
                              </td>
                              <td className="p-2.5 w-36">
                                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                                  <span>{s.kohortTogriFoiz !== null ? `${s.kohortTogriFoiz}%` : '—'}</span>
                                </div>
                                {s.kohortTogriFoiz !== null && (
                                  <div className="w-full h-1.5 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                                      style={{ width: `${s.kohortTogriFoiz}%` }}
                                    />
                                  </div>
                                )}
                              </td>
                              <td className={`p-2.5 font-mono text-[11px] whitespace-nowrap ${fitShovqin ? 'text-rose-300 font-bold' : ''}`}>
                                {s.infit ?? '—'} / {s.outfit ?? '—'}
                              </td>
                              <td className="p-2.5">
                                <div className="font-mono text-[11px] text-[var(--v3-matn)]">
                                  r={s.korrelyatsiya ?? '—'}
                                </div>
                                {Array.isArray(s.muammo) && s.muammo.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    {s.muammo.map((m) => (
                                      <span
                                        key={m}
                                        className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 text-[10px]"
                                      >
                                        {MUAMMO_YORLIQLARI[m] || m}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ishtirokchi tafsiloti modali */}
      {tanlanganQatnashchi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--v3-fon)] border border-[var(--v3-chiziq-2)] rounded-2xl p-6 max-w-3xl w-full my-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>{tanlanganQatnashchi.ism}</span>
                  {tanlanganQatnashchi.rasch?.rank && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-400/50">
                      #{tanlanganQatnashchi.rasch.rank} / {tanlanganQatnashchi.rasch.cohortTotal}
                      {tanlanganQatnashchi.rasch.percentile !== null
                        ? ` · ${tanlanganQatnashchi.rasch.percentile}%`
                        : ''}
                    </span>
                  )}
                </h3>
                <div className="text-xs text-[var(--v3-xira)] mt-1 flex flex-wrap items-center gap-3">
                  {tanlanganQatnashchi.username && <span>@{tanlanganQatnashchi.username}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Ikon nom="soat" olcham={13} />
                    <span>{vaqtFormat(tanlanganQatnashchi.sarflanganVaqt)}</span>
                  </span>
                  {tanlanganQatnashchi.certId && (
                    <Link
                      href={`/sertifikat/verify/${encodeURIComponent(tanlanganQatnashchi.certId)}`}
                      className="inline-flex items-center gap-1 text-emerald-300 hover:underline font-mono"
                    >
                      <Ikon nom="sertifikat" olcham={13} />
                      <span>{tanlanganQatnashchi.certId}</span>
                    </Link>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTanlanganQatnashchi(null)}
                className="v3-tugma text-xs py-1.5 px-3"
              >
                <Ikon nom="yopish" olcham={13} />
                <span>Yopish</span>
              </button>
            </div>

            {/* Rasch vs Oddiy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-1.5">
                <div className="text-xs font-bold text-amber-300 uppercase">Georg Rasch Natijasi</div>
                <div className="text-2xl font-bold text-white">
                  {tanlanganQatnashchi.rasch?.shkalaBalli} ball{' '}
                  <span className="text-base text-amber-300">({tanlanganQatnashchi.rasch?.daraja})</span>
                </div>
                <div className="text-xs text-[var(--v3-matn)] font-mono">
                  θ={tanlanganQatnashchi.rasch?.theta} · SE=±{tanlanganQatnashchi.rasch?.se} · Infit={tanlanganQatnashchi.rasch?.infit} · Outfit={tanlanganQatnashchi.rasch?.outfit}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/40 space-y-1.5">
                <div className="text-xs font-bold text-sky-300 uppercase">Oddiy Ball Tizimi</div>
                <div className="text-2xl font-bold text-white">
                  {tanlanganQatnashchi.oddiy?.oddiyFoiz}%{' '}
                  <span className="text-base text-sky-300">
                    ({tanlanganQatnashchi.oddiy?.rawScore}/{tanlanganQatnashchi.oddiy?.jamiSavollar})
                  </span>
                </div>
                <div className="text-xs text-[var(--v3-matn)]">{tanlanganQatnashchi.oddiy?.oddiyBaho}</div>
              </div>
            </div>

            {tanlanganQatnashchi.taqqoslash && (
              <div className="p-3.5 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-xs space-y-1">
                <div className="font-bold text-[var(--v3-matn)]">{tanlanganQatnashchi.taqqoslash.sarlavha}</div>
                <div className="text-[var(--v3-xira)]">{tanlanganQatnashchi.taqqoslash.xulosaMatni}</div>
              </div>
            )}

            {/* Sohalar kesimi */}
            {Array.isArray(tanlanganQatnashchi.sohalarStatistikasi) &&
              tanlanganQatnashchi.sohalarStatistikasi.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--v3-xira)] uppercase">Kimyo sohalari kesimi</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tanlanganQatnashchi.sohalarStatistikasi.map((sh) => (
                      <div key={sh.soha} className="p-2.5 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white font-semibold">{sh.soha}</span>
                          <span className="font-mono text-cyan-300">
                            {sh.togri}/{sh.jami} ({sh.foiz}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[var(--v3-yuza)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                            style={{ width: `${sh.foiz}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Savol-javoblar xaritasi */}
            {Array.isArray(tanlanganQatnashchi.savolNatijalari) &&
              tanlanganQatnashchi.savolNatijalari.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--v3-xira)] uppercase">
                    Savollar bo&apos;yicha javoblar ({tanlanganQatnashchi.savolNatijalari.length} ta)
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                    {tanlanganQatnashchi.savolNatijalari.map((sn) => (
                      <div
                        key={sn.id}
                        title={`#${sn.id} (${sn.soha}, b=${sn.qiyinlik}): ${sn.berilganJavob || 'bo\'sh'}`}
                        className={`p-1.5 rounded-lg border text-center text-[11px] font-mono ${
                          sn.togri
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                            : sn.javobBerildi
                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                              : 'bg-[var(--v3-yuza-2)] border-[var(--v3-chiziq)] text-[var(--v3-xira)]'
                        }`}
                      >
                        <div className="font-bold">#{sn.id}</div>
                        <div className="text-[10px] truncate">{sn.berilganJavob || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
