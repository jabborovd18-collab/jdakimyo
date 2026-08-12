"use client"
//
// Shaxsiy chatning ko'rinishi.
//
// Yangi xabar SO'ROV bilan olinadi (WebSocket emas): Vercel funksiyalari
// so'rov-javob asosida ishlaydi, uzoq turadigan ulanish ochib bo'lmaydi.
// Suhbat ochiq turganda 4 soniyada bir marta so'raladi va faqat oyna
// ko'rinib turganda — fondagi yorliq serverni bekorga bezovta qilmasin.
//
// Ranglar bu faylda YO'Q: hammasi app/globals.css dagi "SHAXSIY CHAT"
// bo'limida, `--v3-*` o'zgaruvchilari orqali. Shu sababli chat to'rt
// fonda ham (tun / siyoh / grafit / kunduz) to'g'ri ko'rinadi.
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { kunKaliti, kunSarlavhasi, sanaQisqa, soatDaqiqa } from '@/lib/sana'
import { MAX_UZUNLIK } from '@/lib/chat-chegara'
import Ikon from '@/components/Ikon'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const SOROV_ORALIGI = 4000

/** Belgilar sanagichi shu chegaradan keyin ko'rinadi */
const SANAGICH_QOLGAN = 200

/**
 * Ketma-ket xabarlar shu oraliqda bitta guruh bo'ladi.
 *
 * 5 daqiqa: bir fikrni ikki-uch xabarga bo'lib yozish odatiy hol va
 * ular orasida bo'sh joy bo'lmasligi kerak. Undan uzoq tanaffus esa
 * allaqachon boshqa gap.
 */
const GURUH_ORALIGI = 5 * 60 * 1000

export default function Korinish() {
  return (
    <Suspense fallback={<Yuklanish />}>
      <Chat />
    </Suspense>
  )
}

function Yuklanish() {
  return (
    <div className="chat-sahifa">
      <div className="chat-bosh-holat">
        <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={26} /></span>
        <span>Yuklanmoqda...</span>
      </div>
    </div>
  )
}

function Avatar({ odam, olcham = 42 }) {
  const harf = (odam?.fullName || odam?.username || 'U')[0].toUpperCase()
  return (
    <span className="chat-avatar" style={{ width: olcham, height: olcham, fontSize: olcham * 0.4 }}>
      {odam?.avatar ? <img src={odam.avatar} alt="" /> : harf}
    </span>
  )
}

function XabarMazmuni({ matn }) {
  if (!matn) return null

  // Test ulashilgan xabarlarni aniqlash: [quiz:ID:Title] yoki havola
  const quizMatch = matn.match(/\[quiz:([a-zA-Z0-9_\-]+):([^\]]+)\]/)
  const linkMatch = matn.match(/\/oquv\/video-darsliklar\/ustoz-quiz\/([a-zA-Z0-9_\-]+)/)

  if (quizMatch || linkMatch) {
    const quizId = quizMatch ? quizMatch[1] : linkMatch[1]
    const quizTitle = quizMatch ? quizMatch[2] : "Ustoz Testi"
    const cleanText = matn
      .replace(/🧪?\s*\[quiz:[a-zA-Z0-9_\-]+:[^\]]+\]/g, '')
      .replace(/https?:\/\/[^\s]+\/oquv\/video-darsliklar\/ustoz-quiz\/[a-zA-Z0-9_\-]+/g, '')
      .replace(/\/oquv\/video-darsliklar\/ustoz-quiz\/[a-zA-Z0-9_\-]+/g, '')
      .trim()

    return (
      <div>
        {cleanText && <div style={{ whiteSpace: 'pre-line', marginBottom: '8px' }}>{cleanText}</div>}
        <Link
          href={`/oquv/video-darsliklar/ustoz-quiz/${quizId}`}
          className="chat-quiz-karta"
        >
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[var(--v3-urgu)] uppercase tracking-wider">
            <Ikon nom="quiz" olcham={13} />
            <span>Ustoz testi</span>
          </div>
          <div className="chat-quiz-karta-sarlavha">
            {quizTitle}
          </div>
          <div className="chat-quiz-karta-tugma">
            <span>Testni yechish</span>
            <Ikon nom="ong" olcham={13} />
          </div>
        </Link>
      </div>
    )
  }

  return <span style={{ whiteSpace: 'pre-line' }}>{matn}</span>
}

/** Ro'yxatdagi vaqt: bugungi suhbat — soat, eskisi — sana */
function royxatVaqti(qiymat) {
  if (!qiymat) return ''
  return kunKaliti(qiymat) === kunKaliti(new Date()) ? soatDaqiqa(qiymat) : sanaQisqa(qiymat)
}

function Chat() {
  const { data: session, status } = useSession()
  const [fon, fonTanla] = useFon()
  const qidiruvParam = useSearchParams()

  const [royxat, setRoyxat] = useState(null)
  const [tanlangan, setTanlangan] = useState(qidiruvParam.get('suhbat') || null)
  const [suhbat, setSuhbat] = useState(null)
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [bolim, setBolim] = useState('faol')
  const [qidiruv, setQidiruv] = useState('')
  const [amalMenyu, setAmalMenyu] = useState(false)

  // Do'stlar paneli — "kimga yozaman?" degan savolning javobi.
  const [dostPanel, setDostPanel] = useState(false)
  const [dostlar, setDostlar] = useState(null)
  const [dostQidiruv, setDostQidiruv] = useState('')

  const oxirgiRef = useRef(null)
  const oynaRef = useRef(null)
  const maydonRef = useRef(null)
  // Eski xabarlarni o'qiyotganda pastga sakrab tushmaslik uchun
  const pastdaRef = useRef(true)

  const kirgan = status === 'authenticated'

  const royxatniYukla = useCallback(async () => {
    if (!kirgan) return
    try {
      const res = await fetch('/api/chat')
      const data = await res.json()
      if (res.ok) setRoyxat(data)
    } catch {
      // jim — keyingi so'rovda qayta urinadi
    }
  }, [kirgan])

  const suhbatniYukla = useCallback(async (id) => {
    if (!id) return
    try {
      const res = await fetch(`/api/chat/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuhbat(data)
    } catch (e) {
      toast.error(e.message)
      setTanlangan(null)
    }
  }, [])

  useEffect(() => { royxatniYukla() }, [royxatniYukla])
  useEffect(() => { if (tanlangan) suhbatniYukla(tanlangan) }, [tanlangan, suhbatniYukla])

  useEffect(() => {
    if (!kirgan) return
    const oraliq = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      royxatniYukla()
      if (tanlangan) suhbatniYukla(tanlangan)
    }, SOROV_ORALIGI)
    return () => clearInterval(oraliq)
  }, [kirgan, tanlangan, royxatniYukla, suhbatniYukla])

  useEffect(() => {
    if (pastdaRef.current) oxirgiRef.current?.scrollIntoView({ block: 'end' })
  }, [suhbat?.xabarlar?.length])

  useEffect(() => {
    pastdaRef.current = true
    setMatn('')
    setAmalMenyu(false)
    if (maydonRef.current) maydonRef.current.style.height = 'auto'
  }, [tanlangan])

  const siljish = () => {
    const el = oynaRef.current
    if (!el) return
    // 80px — "deyarli pastda". Nol bo'lsa, bir piksel siljish ham
    // avtomatik tushishni o'chirib qo'yardi.
    pastdaRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const yubor = async () => {
    const toza = matn.trim()
    if (!toza || !tanlangan || yuborilmoqda) return
    setYuborilmoqda(true)
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn: toza }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMatn('')
      if (maydonRef.current) maydonRef.current.style.height = 'auto'
      pastdaRef.current = true
      setSuhbat((s) => (s ? { ...s, xabarlar: [...s.xabarlar, data.xabar] } : s))
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const sorovga = async (amal) => {
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      if (amal === 'rad') setTanlangan(null)
      else suhbatniYukla(tanlangan)
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const xabarniOchir = async (xabarId) => {
    if (!confirm('Xabar o\'chirilsinmi?')) return
    try {
      const res = await fetch(`/api/chat/${tanlangan}?xabarId=${xabarId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const blokla = async () => {
    const odam = suhbat?.suhbat?.odam
    if (!odam) return
    setAmalMenyu(false)
    if (!confirm(`${odam.fullName || odam.username} bloklansinmi? U sizga yoza olmaydi va profilingizni ko'rmaydi.`)) return
    try {
      const res = await fetch('/api/chat/bloklash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: odam.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const blokniOch = async () => {
    setAmalMenyu(false)
    try {
      const res = await fetch(`/api/chat/bloklash?userId=${suhbat.suhbat.odam.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      suhbatniYukla(tanlangan)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const shikoyat = async () => {
    setAmalMenyu(false)
    const sabab = prompt('Shikoyat sababi — administrator yozishmani ko\'rib chiqadi:')
    if (!sabab?.trim()) return
    try {
      const res = await fetch('/api/chat/shikoyat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suhbatId: tanlangan, sabab }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  // ─── Do'stlar paneli ───

  const dostlarniYukla = useCallback(async () => {
    try {
      // Do'stlar ro'yxatining YAGONA manbai — profil kolleksiyasi API'si.
      // Chat uchun alohida endpoint yozilsa, do'stlik sharti ikki joyda
      // ta'riflanardi.
      const res = await fetch('/api/profil/collection?type=friends&limit=50')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDostlar(data.items || [])
    } catch (e) {
      toast.error(e.message || "Do'stlar yuklanmadi")
      setDostlar([])
    }
  }, [])

  const dostPanelniOch = () => {
    setDostPanel(true)
    setDostQidiruv('')
    if (dostlar === null) dostlarniYukla()
  }

  const dostBilanYoz = async (odam) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Manzilda ommaviy `userId` yuboriladi, ichki id emas
        body: JSON.stringify({ userId: odam.userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDostPanel(false)
      setBolim(data.holat === 'sorov' ? 'yuborilgan' : 'faol')
      setTanlangan(data.suhbatId)
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const dostRoyxati = useMemo(() => {
    if (!dostlar) return null
    const s = dostQidiruv.trim().toLowerCase()
    if (!s) return dostlar
    return dostlar.filter((d) =>
      [d.fullName, d.username, d.userId].some((x) => String(x || '').toLowerCase().includes(s)),
    )
  }, [dostlar, dostQidiruv])

  // ─── Ro'yxat ───

  const bolimlar = useMemo(() => {
    if (!royxat) return []
    return [
      { id: 'faol', nom: 'Suhbatlar', royxat: royxat.faol },
      { id: 'sorov', nom: "So'rovlar", royxat: royxat.sorovlar },
      { id: 'yuborilgan', nom: 'Yuborilgan', royxat: royxat.yuborilgan },
    ]
  }, [royxat])

  const joriyRoyxat = useMemo(() => {
    const b = bolimlar.find((x) => x.id === bolim)
    if (!b) return []
    const s = qidiruv.trim().toLowerCase()
    if (!s) return b.royxat
    return b.royxat.filter((x) =>
      [x.odam.fullName, x.odam.username, x.odam.userId].some((v) =>
        String(v || '').toLowerCase().includes(s),
      ),
    )
  }, [bolimlar, bolim, qidiruv])

  // ─── Kirish talabi ───

  if (status === 'loading') return <Yuklanish />

  // Diqqat: `data-fon` hech qayerda QO'LDA qo'yilmaydi — uni `useFon()`
  // <html> ga yozadi va sahifadan chiqilganda o'chiradi. Qo'lda qo'yilsa,
  // "kunduz" foni ranglari qattiq yozilgan eski sahifalarga ham o'tib
  // ketardi (oq fonda oq matn).
  if (!session) {
    return (
      <div className="chat-sahifa">
        <div className="chat-bosh-holat">
          <span className="chat-bosh-ikon"><Ikon nom="qulf" olcham={26} /></span>
          <div>
            <div style={{ color: 'var(--v3-matn)', fontWeight: 600, fontSize: 15 }}>
              Xabarlar shaxsiy bo{"'"}lim
            </div>
            <p style={{ marginTop: 4 }}>Yozishmani ko{"'"}rish uchun hisobingizga kiring.</p>
          </div>
          <Link href="/login" className="v3-tugma-asosiy">Kirish</Link>
        </div>
      </div>
    )
  }

  const odam = suhbat?.suhbat?.odam
  const qolgan = MAX_UZUNLIK - matn.length
  const jamiOqilmagan = royxat?.oqilmagan || 0

  return (
    <div className="chat-sahifa">
      {/* ─── Sarlavha ─── */}
      <header className="chat-bosh">
        {/* Logotip, strelka EMAS: suhbat ochiq turganda yozishma
            sarlavhasida ham "orqaga" strelkasi bor va ikkita bir xil
            strelka yonma-yon turganda qaysi biri qayerga qaytarishini
            aytib bo'lmasdi. Logotip esa doim bitta narsani bildiradi —
            saytning boshi. */}
        <Link href="/" className="flex items-center gap-2.5" title="Bosh sahifa">
          <span className="v3-logo" aria-hidden="true" />
          <span className="chat-bosh-nom">Xabarlar</span>
        </Link>
        {jamiOqilmagan > 0 && (
          <span className="chat-nishon">{jamiOqilmagan > 99 ? '99+' : jamiOqilmagan}</span>
        )}

        <span style={{ flex: 1 }} />

        <FonTanlagich fon={fon} tanla={fonTanla} />
        <Link href="/profil" className="v3-ikon-tugma" title="Shaxsiy kabinet" aria-label="Shaxsiy kabinet">
          <Ikon nom="odam" olcham={17} />
        </Link>
      </header>

      {/* `data-korinish` — mobil almashinuvni CSS hal qiladi: telefonda
          bir vaqtda faqat bitta ustun ko'rinadi. */}
      <div className="chat-tana" data-korinish={tanlangan ? 'suhbat' : 'royxat'}>

        {/* ─── Chap ustun ─── */}
        <aside className="chat-yon">
          {dostPanel ? (
            <>
              <div className="chat-yon-bosh">
                <div className="flex items-center gap-2">
                  <button onClick={() => setDostPanel(false)} className="v3-ikon-tugma" aria-label="Orqaga">
                    <Ikon nom="chap" olcham={16} />
                  </button>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>Kimga yozasiz?</span>
                </div>
                <input
                  className="chat-kirit"
                  value={dostQidiruv}
                  onChange={(e) => setDostQidiruv(e.target.value)}
                  placeholder="Do'stlar ichidan qidirish"
                />
              </div>

              <div className="chat-royxat">
                {dostRoyxati === null ? (
                  <div className="chat-bosh-holat">Yuklanmoqda...</div>
                ) : dostRoyxati.length === 0 ? (
                  <div className="chat-bosh-holat">
                    <span className="chat-bosh-ikon"><Ikon nom="odamlar" olcham={24} /></span>
                    <span>{dostQidiruv ? 'Hech kim topilmadi' : "Hali do'stingiz yo'q"}</span>
                    {!dostQidiruv && (
                      <Link href="/profil/dostlar" className="v3-tugma">Do{"'"}st qidirish</Link>
                    )}
                  </div>
                ) : (
                  dostRoyxati.map((d) => (
                    <button key={d.id} onClick={() => dostBilanYoz(d)} className="chat-qator">
                      <Avatar odam={d} olcham={38} />
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="chat-qator-nom">
                          <span className="truncate">{d.fullName || d.username}</span>
                          <TasdiqBelgisi tasdiqlangan={d.isVerified} olcham="kichik" />
                        </span>
                        <span className="chat-qator-matn" style={{ display: 'block' }}>@{d.username}</span>
                      </span>
                      <Ikon nom="jonat" olcham={15} />
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="chat-yon-bosh">
                <button onClick={dostPanelniOch} className="v3-tugma-asosiy" style={{ justifyContent: 'center' }}>
                  <Ikon nom="xabar" olcham={16} />
                  Yangi suhbat
                </button>

                <input
                  className="chat-kirit"
                  value={qidiruv}
                  onChange={(e) => setQidiruv(e.target.value)}
                  placeholder="Suhbatlardan qidirish"
                />

                <div className="chat-tablar">
                  {bolimlar.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBolim(b.id)}
                      className={`chat-tab ${bolim === b.id ? 'is-faol' : ''}`}
                    >
                      {b.nom} {b.royxat.length > 0 && `(${b.royxat.length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chat-royxat">
                {!royxat ? (
                  <div className="chat-bosh-holat">Yuklanmoqda...</div>
                ) : joriyRoyxat.length === 0 ? (
                  <div className="chat-bosh-holat">
                    <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={24} /></span>
                    <span>
                      {qidiruv
                        ? 'Topilmadi'
                        : bolim === 'faol'
                          ? "Hali suhbat yo'q — do'stingizga birinchi bo'lib yozing"
                          : "Bo'sh"}
                    </span>
                  </div>
                ) : (
                  joriyRoyxat.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTanlangan(s.id)}
                      className={`chat-qator ${tanlangan === s.id ? 'is-tanlangan' : ''}`}
                    >
                      <Avatar odam={s.odam} olcham={42} />
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="flex items-center justify-between gap-2">
                          <span className="chat-qator-nom">
                            <span className="truncate">{s.odam.fullName || s.odam.username}</span>
                            <TasdiqBelgisi tasdiqlangan={s.odam.isVerified} olcham="kichik" />
                          </span>
                          <span className="chat-qator-vaqt">{royxatVaqti(s.updatedAt)}</span>
                        </span>
                        <span className="flex items-center justify-between gap-2" style={{ marginTop: 2 }}>
                          <span className="chat-qator-matn">
                            {s.oxirgiXabar
                              ? (s.oxirgiXabar.meniki ? 'Siz: ' : '') +
                                (s.oxirgiXabar.ochirilgan ? 'xabar o\'chirildi' : s.oxirgiXabar.matn)
                              : 'Hali xabar yo\'q'}
                          </span>
                          {s.oqilmagan > 0 && <span className="chat-nishon">{s.oqilmagan}</span>}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* ─── O'ng ustun ─── */}
        <section className="chat-oyna">
          {!tanlangan || !suhbat ? (
            <div className="chat-bosh-holat">
              <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={26} /></span>
              <div>
                <div style={{ color: 'var(--v3-matn)', fontWeight: 600, fontSize: 15 }}>
                  Yozishmani tanlang
                </div>
                <p style={{ marginTop: 4 }}>
                  Chapdagi ro{"'"}yxatdan suhbat tanlang yoki do{"'"}stingizga yangi xabar yozing.
                </p>
              </div>
              <button onClick={dostPanelniOch} className="v3-tugma">
                <Ikon nom="odamlar" olcham={16} />
                Do{"'"}stlarim
              </button>
            </div>
          ) : (
            <>
              <div className="chat-oyna-bosh">
                <button
                  onClick={() => setTanlangan(null)}
                  className="v3-ikon-tugma chat-orqaga"
                  aria-label="Ro'yxatga qaytish"
                >
                  <Ikon nom="chap" olcham={17} />
                </button>

                <Link
                  href={`/profil/${odam.userId}`}
                  className="flex items-center gap-2.5"
                  style={{ minWidth: 0, flex: 1 }}
                >
                  <Avatar odam={odam} olcham={38} />
                  <span style={{ minWidth: 0 }}>
                    <span className="chat-qator-nom">
                      <span className="truncate">{odam.fullName || odam.username}</span>
                      <TasdiqBelgisi tasdiqlangan={odam.isVerified} olcham="orta" />
                    </span>
                    <span className="chat-qator-matn" style={{ display: 'block' }}>
                      {suhbat.suhbat.holat === 'sorov' ? "So'rov holatida" : `@${odam.username}`}
                    </span>
                  </span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setAmalMenyu((v) => !v)}
                    className="v3-ikon-tugma"
                    aria-label="Qo'shimcha amallar"
                    aria-expanded={amalMenyu}
                  >
                    <Ikon nom="kop" olcham={17} />
                  </button>

                  {amalMenyu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAmalMenyu(false)} />
                      <div className="v3-menyu v3-tushish absolute right-0 mt-2 w-52 z-50 p-1.5">
                        <Link
                          href={`/profil/${odam.userId}`}
                          onClick={() => setAmalMenyu(false)}
                          className="v3-menyu-qator"
                        >
                          <Ikon nom="odam" olcham={16} />
                          <span className="flex-1 text-[13px]">Profilga o{"'"}tish</span>
                        </Link>
                        <button onClick={shikoyat} className="v3-menyu-qator w-full text-left">
                          <Ikon nom="bayroq" olcham={16} />
                          <span className="flex-1 text-[13px]">Shikoyat qilish</span>
                        </button>
                        {suhbat.blok.menBlokladim ? (
                          <button onClick={blokniOch} className="v3-menyu-qator w-full text-left">
                            <Ikon nom="ochiq" olcham={16} />
                            <span className="flex-1 text-[13px]">Blokni ochish</span>
                          </button>
                        ) : (
                          <button onClick={blokla} className="v3-menyu-qator is-xavf w-full text-left">
                            <Ikon nom="taqiq" olcham={16} />
                            <span className="flex-1 text-[13px]">Bloklash</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Xabarlar */}
              <div ref={oynaRef} onScroll={siljish} className="chat-lenta">
                {suhbat.xabarlar.length === 0 && (
                  <div className="chat-bosh-holat">
                    <span className="chat-bosh-ikon"><Ikon nom="jonat" olcham={24} /></span>
                    <span>Birinchi xabarni yozing</span>
                  </div>
                )}

                {suhbat.xabarlar.map((x, i) => {
                  const oldingi = suhbat.xabarlar[i - 1]
                  const keyingi = suhbat.xabarlar[i + 1]
                  const yangiKun = !oldingi || kunKaliti(oldingi.createdAt) !== kunKaliti(x.createdAt)
                  // Guruh oxiri: keyingisi boshqa odamdan, boshqa kunda
                  // yoki uzoq tanaffusdan keyin
                  const guruhOxiri =
                    !keyingi ||
                    keyingi.meniki !== x.meniki ||
                    kunKaliti(keyingi.createdAt) !== kunKaliti(x.createdAt) ||
                    new Date(keyingi.createdAt) - new Date(x.createdAt) > GURUH_ORALIGI

                  return (
                    <div key={x.id}>
                      {yangiKun && (
                        <div className="chat-kun"><span>{kunSarlavhasi(x.createdAt)}</span></div>
                      )}

                      <div className={`chat-satr ${x.meniki ? 'is-meniki' : ''} ${guruhOxiri ? 'is-oxirgi' : ''}`}>
                        <div
                          className={`chat-pufak ${x.meniki ? 'is-meniki' : 'is-uniki'} ${
                            x.ochirilgan ? 'is-ochirilgan' : ''
                          }`}
                        >
                          {x.ochirilgan ? (
                            <span>Xabar o{"'"}chirildi</span>
                          ) : (
                            <XabarMazmuni matn={x.matn} />
                          )}

                          <span className="chat-pufak-oyoq">
                            {x.meniki && !x.ochirilgan && (
                              <button
                                onClick={() => xabarniOchir(x.id)}
                                className="chat-ochir"
                                title="Xabarni o'chirish"
                                aria-label="Xabarni o'chirish"
                              >
                                <Ikon nom="ochir" olcham={12} />
                              </button>
                            )}
                            <span>{soatDaqiqa(x.createdAt)}</span>
                            {/* Yetkazildi/o'qildi — faqat o'z xabaringda:
                                sherikning xabari ko'ringan bo'lsa, u
                                allaqachon o'qilgan. */}
                            {x.meniki && !x.ochirilgan && (
                              <span title={x.oqilgan ? "O'qildi" : 'Yuborildi'}>
                                {x.oqilgan ? '✓✓' : '✓'}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={oxirgiRef} />
              </div>

              {/* Yozish qatori */}
              <div className="chat-yozish">
                {suhbat.blok.meniBlokladi ? (
                  <p style={{ textAlign: 'center', color: 'var(--v3-xira)', fontSize: 13 }}>
                    Bu suhbatda xabar yuborib bo{"'"}lmaydi
                  </p>
                ) : suhbat.blok.menBlokladim ? (
                  <p style={{ textAlign: 'center', color: 'var(--v3-xira)', fontSize: 13 }}>
                    Siz bu foydalanuvchini bloklagansiz — yozish uchun blokni oching
                  </p>
                ) : suhbat.suhbat.holat === 'sorov' && !suhbat.suhbat.menBoshladim ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <p style={{ textAlign: 'center', color: 'var(--v3-xira)', fontSize: 12.5 }}>
                      Bu do{"'"}st bo{"'"}lmagan foydalanuvchining so{"'"}rovi. Javob yozsangiz
                      suhbat ochiladi.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => sorovga('qabul')} className="v3-tugma-asosiy" style={{ flex: 1, justifyContent: 'center' }}>
                        Qabul qilish
                      </button>
                      <button onClick={() => sorovga('rad')} className="v3-tugma" style={{ flex: 1, justifyContent: 'center' }}>
                        Rad etish
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="chat-quti">
                      {/* `textarea`: chegara 2000 belgi, ya'ni bir necha
                          qatorli xabar kutilyapti. Enter — yuborish,
                          Shift+Enter — yangi qator. */}
                      <textarea
                        ref={maydonRef}
                        rows={1}
                        className="chat-matn"
                        value={matn}
                        maxLength={MAX_UZUNLIK}
                        onChange={(e) => {
                          setMatn(e.target.value)
                          const el = e.target
                          el.style.height = 'auto'
                          el.style.height = `${Math.min(el.scrollHeight, 148)}px`
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); yubor() }
                        }}
                        placeholder={
                          suhbat.suhbat.holat === 'sorov'
                            ? "So'rov yuborilgan — javobni kuting"
                            : 'Xabar yozing...'
                        }
                      />
                      <button
                        onClick={yubor}
                        disabled={yuborilmoqda || !matn.trim()}
                        className="chat-jonat"
                        aria-label="Yuborish"
                        title="Yuborish (Enter)"
                      >
                        <Ikon nom="jonat" olcham={17} />
                      </button>
                    </div>
                    {qolgan <= SANAGICH_QOLGAN && (
                      <div
                        style={{
                          textAlign: 'right', fontSize: 11, marginTop: 4,
                          color: qolgan <= 0 ? '#f87171' : 'var(--v3-xira)',
                        }}
                      >
                        {qolgan} belgi qoldi
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
