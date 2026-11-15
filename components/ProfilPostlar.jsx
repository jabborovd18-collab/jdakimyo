// components/ProfilPostlar.jsx
"use client"
//
// Kabinetdagi to'liq postlar va rekomendatsiya tizimi:
// 1) Mening postlarim — post yozish (#teg bilan), tepaga qadash (Pin),
//    tahrirlash (Edit), o'chirish va tartiblash;
// 2) Obunalarim — obuna bo'lgan va do'stlar yozgan yangi postlar;
// 3) Tavsiyalar — shaxsiylashtirilgan rekomendatsiya lentasi.

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'
import Ikon from '@/components/Ikon'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import ProfilHikoyalar from '@/components/ProfilHikoyalar'
import {
  POST_TEGLARI,
  tegHaqida,
  postlarniTartibla,
} from '@/lib/post-tavsiyalar'

const MAX_UZUNLIK = 1000

const TABLAR = [
  { id: 'meniki', nom: 'Mening postlarim', ikon: 'qalam' },
  { id: 'tavsiyalar', nom: 'Tavsiyalar', ikon: 'uchqun' },
  { id: 'obunalar', nom: 'Obunalarim', ikon: 'odamlar' },
]

const TARTIBLAR = [
  { id: 'standart', nom: 'Saralangan' },
  { id: 'foydali', nom: 'Eng foydali' },
  { id: 'yangi', nom: 'Eng yangi' },
]

export default function ProfilPostlar() {
  const [faolTab, setFaolTab] = useState('meniki')
  const [lentalar, setLentalar] = useState({
    meniki: [],
    obunalar: [],
    tavsiyalar: [],
  })
  const [yuklanganTablar, setYuklanganTablar] = useState({})
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  // Yangi post yozish holati
  const [matn, setMatn] = useState('')
  const [tanlanganTeg, setTanlanganTeg] = useState('')
  const [ishlamoqda, setIshlamoqda] = useState(false)

  // Tartiblash va filtrlash holati
  const [tartib, setTartib] = useState('standart')
  const [tegFiltr, setTegFiltr] = useState('')
  const [qidiruv, setQidiruv] = useState('')

  // Tahrirlash holati
  const [tahrirId, setTahrirId] = useState(null)
  const [tahrirMatn, setTahrirMatn] = useState('')
  const [tahrirTeg, setTahrirTeg] = useState('')
  const [tahrirSaqlanmoqda, setTahrirSaqlanmoqda] = useState(false)

  // Postni 24 soatlik hikoyaga ulashish holati
  const [hikoyaPost, setHikoyaPost] = useState(null)

  const yukla = useCallback(async (rejim = 'meniki', majburiy = false) => {
    if (!majburiy && yuklanganTablar[rejim]) {
      setYuklanmoqda(false)
      return
    }
    setYuklanmoqda(true)
    try {
      const res = await fetch(`/api/profil/postlar?rejim=${rejim}`)
      const data = await res.json().catch(() => ({}))
      if (res.ok && Array.isArray(data.postlar)) {
        setLentalar((oldin) => ({ ...oldin, [rejim]: data.postlar }))
        setYuklanganTablar((oldin) => ({ ...oldin, [rejim]: true }))
      }
    } catch {
      // jim — kabinetning qolgan qismi ishlayveradi
    } finally {
      setYuklanmoqda(false)
    }
  }, [yuklanganTablar])

  useEffect(() => {
    yukla(faolTab)
  }, [faolTab, yukla])

  const joriyRoYxat = useMemo(
    () => lentalar[faolTab] || [],
    [lentalar, faolTab]
  )

  // Joriy ro'yxatda qatnashgan teglar (filtr chiplari uchun)
  const mavjudTeglar = useMemo(() => {
    const toPlam = new Set()
    for (const p of joriyRoYxat) {
      if (p?.teg) toPlam.add(p.teg)
    }
    return POST_TEGLARI.filter((t) => toPlam.has(t.kalit))
  }, [joriyRoYxat])

  const korinadiganPostlar = useMemo(() => {
    // Tavsiyalar tabida 'standart' tanlangan bo'lsa, serverning rekomendatsiya tartibini saqlaymiz
    if (faolTab === 'tavsiyalar' && tartib === 'standart') {
      return joriyRoYxat.filter((p) => {
        if (tegFiltr && p.teg !== tegFiltr) return false
        if (qidiruv.trim()) {
          const s = qidiruv.trim().toLowerCase()
          const m =
            String(p.matn || '').toLowerCase().includes(s) ||
            String(p.muallif?.fullName || '').toLowerCase().includes(s) ||
            String(p.muallif?.username || '').toLowerCase().includes(s)
          if (!m) return false
        }
        return true
      })
    }
    return postlarniTartibla(joriyRoYxat, { tartib, teg: tegFiltr, qidiruv })
  }, [joriyRoYxat, faolTab, tartib, tegFiltr, qidiruv])

  const postniYangilaBarchaTabda = (postId, ozgarishFn) => {
    setLentalar((oldin) => {
      const yangi = {}
      for (const kalit of Object.keys(oldin)) {
        yangi[kalit] = (oldin[kalit] || []).map((p) =>
          p.id === postId ? ozgarishFn(p) : p
        )
      }
      return yangi
    })
  }

  const yubor = async () => {
    if (!matn.trim()) return
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/profil/postlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matn,
          teg: tanlanganTeg || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setMatn('')
      setTanlanganTeg('')
      setLentalar((oldin) => ({
        ...oldin,
        meniki: [data.post, ...(oldin.meniki || [])],
      }))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  const foydaliBos = async (post) => {
    const oldingiYoqdimi = Boolean(post.yoqdimi)
    const oldingiSoni = Number(post.likesCount) || 0
    const yangiYoqdimi = !oldingiYoqdimi
    const yangiSoni = Math.max(0, oldingiSoni + (yangiYoqdimi ? 1 : -1))

    postniYangilaBarchaTabda(post.id, (p) => ({
      ...p,
      yoqdimi: yangiYoqdimi,
      likesCount: yangiSoni,
    }))

    try {
      const res = await fetch('/api/profil/postlar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, amal: 'foydali' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      postniYangilaBarchaTabda(post.id, (p) => ({
        ...p,
        yoqdimi: data.yoqdimi,
        likesCount: data.likesCount,
      }))
    } catch (e) {
      postniYangilaBarchaTabda(post.id, (p) => ({
        ...p,
        yoqdimi: oldingiYoqdimi,
        likesCount: oldingiSoni,
      }))
      toast.error(e.message || 'Amal bajarilmadi')
    }
  }

  const qadashAlmashtir = async (post) => {
    try {
      const res = await fetch('/api/profil/postlar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          amal: 'qadash',
          isPinned: !post.isPinned,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      postniYangilaBarchaTabda(post.id, (p) => ({
        ...p,
        isPinned: data.isPinned,
        pinnedAt: data.pinnedAt,
      }))
      toast.success(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const tahrirBoshla = (post) => {
    setTahrirId(post.id)
    setTahrirMatn(post.matn || '')
    setTahrirTeg(post.teg || '')
  }

  const tahrirSaqla = async (postId) => {
    if (!tahrirMatn.trim()) {
      toast.error("Post matni bo'sh bo'lmasligi kerak")
      return
    }
    setTahrirSaqlanmoqda(true)
    try {
      const res = await fetch('/api/profil/postlar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          amal: 'tahrir',
          matn: tahrirMatn,
          teg: tahrirTeg || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      postniYangilaBarchaTabda(postId, (p) => ({
        ...p,
        ...data.post,
      }))
      setTahrirId(null)
      toast.success(data.message || 'Post yangilandi')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setTahrirSaqlanmoqda(false)
    }
  }

  const ochir = async (id) => {
    if (!confirm("Post o'chirilsinmi?")) return
    try {
      const res = await fetch(`/api/profil/postlar?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLentalar((oldin) => ({
        ...oldin,
        meniki: (oldin.meniki || []).filter((p) => p.id !== id),
      }))
      toast.success(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const muallifgaObunaBol = async (muallifId) => {
    if (!muallifId) return
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: muallifId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setLentalar((oldin) => {
        const yangi = {}
        for (const kalit of Object.keys(oldin)) {
          yangi[kalit] = (oldin[kalit] || []).map((p) =>
            p.muallif?.id === muallifId
              ? { ...p, muallif: { ...p.muallif, obunami: true } }
              : p
          )
        }
        return yangi
      })
      setYuklanganTablar((oldin) => ({ ...oldin, obunalar: false }))
      toast.success("Obuna bo'lindi!")
    } catch (e) {
      toast.error(e.message || "Obuna bo'lib bo'lmadi")
    }
  }

  const qolgan = MAX_UZUNLIK - matn.length

  return (
    <div className="v3-panel-karta p-4 sm:p-6 space-y-4">
      {/* ─── 24 SOATLIK ILMIY HIKOYALAR TASMASI ─── */}
      <ProfilHikoyalar
        ulashilayotganPost={hikoyaPost}
        onUlashishYopildi={() => setHikoyaPost(null)}
      />

      {/* ─── SARLAVHA VA 3 TA TAB ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="qalam" olcham={18} className="text-[var(--v3-urgu)]" />
            <span>Postlar va Tavsiyalar lentasi</span>
          </h2>
          <p className="text-xs text-[var(--v3-xira)] mt-0.5">
            {faolTab === 'meniki' && "Yozganingiz profilingizda ko'rinadi va obunachilaringizga xabar boradi."}
            {faolTab === 'tavsiyalar' && "Ustozlar, o'quv yurtingizdoshlar va faol kimyogarlarning eng foydali postlari."}
            {faolTab === 'obunalar' && "Siz obuna bo'lgan va do'stlashgan foydalanuvchilarning yangi yozuvlari."}
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
          {TABLAR.map((tab) => {
            const faol = faolTab === tab.id
            const sanoq = (lentalar[tab.id] || []).length
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFaolTab(tab.id)
                  setTegFiltr('')
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
                  faol
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                    : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                }`}
              >
                <Ikon nom={tab.ikon} olcham={13} />
                <span>{tab.nom}</span>
                {yuklanganTablar[tab.id] && sanoq > 0 && (
                  <span className="text-[10px] font-mono opacity-80">({sanoq})</span>
                )}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => yukla(faolTab, true)}
            title="Lentani yangilash"
            className="v3-tugma p-1.5 text-[var(--v3-xira)] hover:text-[var(--v3-urgu)]"
          >
            <Ikon nom="qayta" olcham={13} className={yuklanmoqda ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── YANGI POST YOZISH OYNASI (Faqat "Mening postlarim" da) ─── */}
      {faolTab === 'meniki' && (
        <div className="space-y-3 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]/60 p-3.5 sm:p-4">
          <textarea
            value={matn}
            onChange={(e) => setMatn(e.target.value.slice(0, MAX_UZUNLIK))}
            rows={3}
            placeholder="Nima o'rganyapsiz? Fikringiz, masala yechimi yoki maqsadingizni yozing..."
            className="v3-kiritish resize-y min-h-[84px] text-xs sm:text-sm"
          />

          {/* Mavzu teglarini tanlash */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[var(--v3-xira)] mr-1">Mavzu:</span>
              {POST_TEGLARI.map((t) => {
                const tanlangan = tanlanganTeg === t.kalit
                return (
                  <button
                    key={t.kalit}
                    type="button"
                    onClick={() => setTanlanganTeg(tanlangan ? '' : t.kalit)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                      tanlangan
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                        : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                    }`}
                  >
                    {t.nom}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span
                className={`text-[11px] font-mono ${
                  qolgan < 100 ? 'text-amber-500 font-bold' : 'text-[var(--v3-xira)]'
                }`}
              >
                {qolgan} belgi
              </span>
              <button
                type="button"
                onClick={yubor}
                disabled={ishlamoqda || !matn.trim()}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-4 font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                {ishlamoqda ? (
                  <>
                    <Ikon nom="vaqt" olcham={13} className="animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Ikon nom="jonat" olcham={13} />
                    <span>Joylash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARTIBLASH VA FILTR PANELI ─── */}
      {joriyRoYxat.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {TARTIBLAR.map((t) => {
              const faol = tartib === t.id
              const nomMatn =
                faolTab === 'tavsiyalar' && t.id === 'standart'
                  ? 'Aqlli tavsiya'
                  : t.nom
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTartib(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    faol
                      ? 'bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] border border-[var(--v3-urgu)]/45 font-bold'
                      : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
                  }`}
                >
                  {nomMatn}
                </button>
              )
            })}

            {mavjudTeglar.length > 0 && (
              <>
                <span className="text-[var(--v3-chiziq)] px-0.5">|</span>
                {mavjudTeglar.map((t) => {
                  const faol = tegFiltr === t.kalit
                  return (
                    <button
                      key={t.kalit}
                      type="button"
                      onClick={() => setTegFiltr(faol ? '' : t.kalit)}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono transition-all ${
                        faol
                          ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                          : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                      }`}
                    >
                      {t.nom}
                    </button>
                  )
                })}
              </>
            )}
          </div>

          {joriyRoYxat.length >= 4 && (
            <div className="relative w-full sm:w-52">
              <Ikon
                nom="qidiruv"
                olcham={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] pointer-events-none"
              />
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Postlardan qidirish..."
                className="v3-kiritish pl-8 pr-2.5 py-1 text-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* ─── POSTLAR RO'YXATI ─── */}
      {yuklanmoqda && joriyRoYxat.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={24} className="animate-spin" />
          <span className="text-xs">Postlar yuklanmoqda...</span>
        </div>
      ) : korinadiganPostlar.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]/40 py-10 px-4 text-center space-y-2">
          <div className="text-xs sm:text-sm font-semibold text-[var(--v3-matn)]">
            {faolTab === 'meniki' && "Hozircha post yozmagansiz"}
            {faolTab === 'obunalar' && "Obunalaringizdan postlar topilmadi"}
            {faolTab === 'tavsiyalar' && "Hozircha tavsiya qilinadigan postlar yo'q"}
          </div>
          <p className="text-xs text-[var(--v3-xira)] max-w-md mx-auto">
            {faolTab === 'meniki' &&
              "Birinchi postingizni yuqoridagi maydonga yozib qoldiring — obunachilaringizga darhol xabar boradi."}
            {faolTab === 'obunalar' && (
              <>
                Faol kimyogarlar va ustozlarning postlarini kuzatish uchun{' '}
                <button
                  type="button"
                  onClick={() => setFaolTab('tavsiyalar')}
                  className="text-[var(--v3-urgu)] font-bold underline"
                >
                  Tavsiyalar
                </button>{' '}
                bo{"'"}limiga o{"'"}ting.
              </>
            )}
            {faolTab === 'tavsiyalar' &&
              "Filtrlarni tozalab ko'ring yoki o'zingiz yangi ilmiy post joylab lentani boshlab bering!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {korinadiganPostlar.map((p) => {
            const tegInfo = tegHaqida(p.teg)
            const muallif = p.muallif
            const muallifIsm = muallif?.fullName || muallif?.username
            const tahrirlanmoqda = tahrirId === p.id

            return (
              <article
                key={p.id}
                className={`rounded-xl border p-3.5 sm:p-4 space-y-2.5 transition-colors ${
                  p.isPinned && faolTab === 'meniki'
                    ? 'border-[var(--v3-urgu)]/50 bg-[var(--v3-yuza-2)]/65'
                    : 'border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]'
                }`}
              >
                {/* Yuqori qator: Muallif (tavsiyalar/obunalar) yoki Teg/Qadalgan yorliqlari */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  {muallif && faolTab !== 'meniki' ? (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Link
                        href={`/profil/${muallif.userId || muallif.username}`}
                        className="w-8 h-8 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0"
                      >
                        {muallif.avatar ? (
                          <img
                            src={muallif.avatar}
                            alt={muallifIsm}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (muallifIsm?.[0] || 'U').toUpperCase()
                        )}
                      </Link>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/profil/${muallif.userId || muallif.username}`}
                            className="text-xs sm:text-sm font-bold text-[var(--v3-matn)] hover:text-[var(--v3-urgu)] truncate"
                          >
                            {muallifIsm}
                          </Link>
                          <TasdiqBelgisi tasdiqlangan={muallif.isVerified} olcham="kichik" />
                          {muallif.isTeacher && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[var(--v3-urgu)]/15 text-[var(--v3-urgu)]">
                              Ustoz
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--v3-xira)] truncate">
                          <span>@{muallif.username}</span>
                          {muallif.university && (
                            <>
                              <span>•</span>
                              <span className="truncate">{muallif.university}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Ikon nom="qadash" olcham={11} />
                          <span>Qadalgan</span>
                        </span>
                      )}
                      {tegInfo && (
                        <button
                          type="button"
                          onClick={() =>
                            setTegFiltr(tegFiltr === tegInfo.kalit ? '' : tegInfo.kalit)
                          }
                          className="px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]"
                        >
                          {tegInfo.nom}
                        </button>
                      )}
                    </div>
                  )}

                  {/* O'ng tomon: Tavsiya sababi va tezkor obuna */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {faolTab !== 'meniki' && tegInfo && (
                      <button
                        type="button"
                        onClick={() =>
                          setTegFiltr(tegFiltr === tegInfo.kalit ? '' : tegInfo.kalit)
                        }
                        className="px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] border border-[var(--v3-chiziq)]"
                      >
                        {tegInfo.nom}
                      </button>
                    )}
                    {faolTab === 'tavsiyalar' && p.tavsiyaSababi && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--v3-urgu)]/12 text-[var(--v3-urgu)] border border-[var(--v3-urgu)]/25">
                        <Ikon nom="uchqun" olcham={10} />
                        <span>{p.tavsiyaSababi}</span>
                      </span>
                    )}
                    {muallif && !muallif.obunami && !muallif.dostmi && faolTab !== 'meniki' && (
                      <button
                        type="button"
                        onClick={() => muallifgaObunaBol(muallif.id)}
                        className="v3-tugma text-[10.5px] py-0.5 px-2 font-bold text-[var(--v3-urgu)] border-[var(--v3-urgu)]/40 hover:border-[var(--v3-urgu)]"
                      >
                        + Obuna
                      </button>
                    )}
                  </div>
                </div>

                {/* Post matni yoki Tahrirlash oynasi */}
                {tahrirlanmoqda ? (
                  <div className="space-y-2.5 pt-1">
                    <textarea
                      value={tahrirMatn}
                      onChange={(e) => setTahrirMatn(e.target.value.slice(0, MAX_UZUNLIK))}
                      rows={3}
                      className="v3-kiritish text-xs sm:text-sm resize-y"
                      autoFocus
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {POST_TEGLARI.map((t) => (
                          <button
                            key={t.kalit}
                            type="button"
                            onClick={() =>
                              setTahrirTeg(tahrirTeg === t.kalit ? '' : t.kalit)
                            }
                            className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono ${
                              tahrirTeg === t.kalit
                                ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold'
                                : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] border border-[var(--v3-chiziq)]'
                            }`}
                          >
                            {t.nom}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={() => setTahrirId(null)}
                          disabled={tahrirSaqlanmoqda}
                          className="v3-tugma text-xs py-1 px-2.5"
                        >
                          Bekor
                        </button>
                        <button
                          type="button"
                          onClick={() => tahrirSaqla(p.id)}
                          disabled={tahrirSaqlanmoqda}
                          className="v3-tugma v3-tugma-asosiy text-xs py-1 px-3 font-bold"
                        >
                          {tahrirSaqlanmoqda ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[var(--v3-matn)] whitespace-pre-line leading-relaxed break-words">
                    {p.matn}
                  </p>
                )}

                {/* Pastki panel: Vaqt, "Foydali" tugmasi va Boshqaruv amallari */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--v3-chiziq)]/60">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => foydaliBos(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                        p.yoqdimi
                          ? 'bg-[var(--v3-urgu)]/18 text-[var(--v3-urgu)] border border-[var(--v3-urgu)]/45'
                          : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                      }`}
                    >
                      <Ikon nom="olov" olcham={13} />
                      <span>Foydali</span>
                      {Number(p.likesCount) > 0 && (
                        <span className="font-mono font-bold">{p.likesCount}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setHikoyaPost(p)}
                      title="Shu postni 24 soatlik hikoyaga ulashish"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--v3-yuza)] text-[var(--v3-xira)] hover:text-[var(--v3-urgu)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/40 transition-all active:scale-95"
                    >
                      <Ikon nom="uchqun" olcham={12} />
                      <span>Hikoyaga</span>
                    </button>

                    <span className="text-[11px] text-[var(--v3-xira)] font-mono">
                      {qachon(p.createdAt)}
                    </span>
                  </div>

                  {faolTab === 'meniki' && !tahrirlanmoqda && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => qadashAlmashtir(p)}
                        title={p.isPinned ? 'Qadashdan olish' : 'Tepaga qadash'}
                        className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg transition ${
                          p.isPinned
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]'
                        }`}
                      >
                        <Ikon nom="qadash" olcham={13} />
                        <span className="hidden sm:inline">
                          {p.isPinned ? 'Qadalgan' : 'Qadash'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => tahrirBoshla(p)}
                        title="Tahrirlash"
                        className="text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)] inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--v3-yuza-2)] transition"
                      >
                        <Ikon nom="tahrir" olcham={13} />
                        <span className="hidden sm:inline">Tahrir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => ochir(p.id)}
                        title="O'chirish"
                        className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition"
                      >
                        <Ikon nom="ochir" olcham={13} />
                        <span className="hidden sm:inline">O&apos;chirish</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
