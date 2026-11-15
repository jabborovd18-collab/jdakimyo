// app/milliy-sertifikat/[slug]/page.js
"use client"

import { useState, useEffect, useRef, useCallback, useMemo, use } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Ikon from "@/components/Ikon"
import {
  MILLIY_SERTIFIKAT_VARIANTLARI,
  SERTIFIKAT_DARAJALARI,
  TAYYORGARLIK_OGOHLANTIRISH
} from "@/lib/milliy-sertifikat-data"
import { yuklabOlishMilliySertifikatPDF } from "@/lib/milliy-sertifikat-pdf"
import { sertifikatVerifyYoli } from "@/lib/sertifikat-tahlil"
import { MS_VARIANT_HARFLAR } from "@/lib/ms-format"
import { sanaVaqt } from "@/lib/sana"
import LatexBoyMatn from "@/components/LatexBoyMatn"
import KimyoJadvallarModal from "@/components/milliy-sertifikat/KimyoJadvallarModal"
import VirtualSonlarKlaviatura from "@/components/milliy-sertifikat/VirtualSonlarKlaviatura"
import RaschWrightMap from "@/components/milliy-sertifikat/RaschWrightMap"
import IkkiNatijaTaqqoslash from "@/components/milliy-sertifikat/IkkiNatijaTaqqoslash"

function muddatFormat(ms) {
  if (!ms || ms <= 0) return "00:00:00"
  const jamiS = Math.floor(ms / 1000)
  const kun = Math.floor(jamiS / 86400)
  const soat = Math.floor((jamiS % 86400) / 3600)
  const daq = Math.floor((jamiS % 3600) / 60)
  const son = jamiS % 60
  const p = (x) => String(x).padStart(2, "0")
  return kun > 0 ? `${kun} kun ${p(soat)}:${p(daq)}:${p(son)}` : `${p(soat)}:${p(daq)}:${p(son)}`
}

function soniyaFormat(s) {
  const m = Math.floor(s / 60)
  const qolganS = s % 60
  return `${m.toString().padStart(2, "0")}:${qolganS.toString().padStart(2, "0")}`
}

function JavobMatni({ savol, qiymat, boshMatn = "Javob berilmagan" }) {
  if (qiymat === undefined || qiymat === null || qiymat === "") {
    return <span>{boshMatn}</span>
  }
  if (typeof qiymat === "object" && !Array.isArray(qiymat)) {
    const juftlar = Object.entries(qiymat)
    if (juftlar.length === 0) return <span>{boshMatn}</span>
    return (
      <span>
        {juftlar.map(([k, v], i) => (
          <span key={k}>
            {i > 0 ? ", " : ""}
            {k} → <LatexBoyMatn matn={String(v)} />
          </span>
        ))}
      </span>
    )
  }
  if (typeof qiymat === "number" && savol?.options) {
    const harf = MS_VARIANT_HARFLAR[qiymat] || String(qiymat)
    const matn = savol.options[qiymat]
    return matn !== undefined ? (
      <span>
        {harf} (<LatexBoyMatn matn={String(matn)} />)
      </span>
    ) : (
      <span>{harf}</span>
    )
  }
  const kalit = String(qiymat)
  if (savol?.optionLabels?.[kalit]) {
    return (
      <span>
        {kalit} (<LatexBoyMatn matn={String(savol.optionLabels[kalit])} />)
      </span>
    )
  }
  if (savol?.turi === "ochiq" && savol?.birlik) {
    return (
      <span>
        {kalit} {savol.birlik}
      </span>
    )
  }
  return <LatexBoyMatn matn={kalit} />
}

function SavolJadval({ jadval }) {
  if (!jadval || !Array.isArray(jadval.ustunlar) || !Array.isArray(jadval.qatorlar)) return null
  return (
    <div className="overflow-x-auto rounded-2xl border border-sky-400/35 bg-[#0a1847]/90 shadow-inner">
      <table className="w-full text-xs sm:text-sm text-center border-collapse">
        <thead>
          <tr className="border-b border-sky-400/30 bg-sky-500/20 text-amber-200 font-bold">
            {jadval.ustunlar.map((ustun, idx) => (
              <th key={idx} className="px-3 py-2 border-r last:border-r-0 border-sky-400/25">
                <LatexBoyMatn matn={String(ustun)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jadval.qatorlar.map((qator, qIdx) => (
            <tr key={qIdx} className="border-b last:border-b-0 border-sky-400/20 odd:bg-[#0b1946]/70 even:bg-[#0e1f56]/60 text-sky-50">
              {qator.map((katak, kIdx) => (
                <td key={kIdx} className="px-3 py-2 border-r last:border-r-0 border-sky-400/20">
                  <LatexBoyMatn matn={String(katak)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MilliySertifikatTestXonasi({ params }) {
  const router = useRouter()
  // Next.js 15/16 params unwrap
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params
  const slug = unwrappedParams?.slug || "rasch-diagnostika"

  const { data: session } = useSession()
  const [foydalanuvchiIsmi, setFoydalanuvchiIsmi] = useState("")
  useEffect(() => {
    const ism = session?.user?.fullName || session?.user?.username || session?.user?.name
    if (ism && !foydalanuvchiIsmi) {
      setFoydalanuvchiIsmi(ism)
    }
  }, [session, foydalanuvchiIsmi])

  // Test ma'lumotlari
  const testInfo = useMemo(() => {
    return (
      MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug) ||
      MILLIY_SERTIFIKAT_VARIANTLARI[0]
    )
  }, [slug])

  // Savollar serverdan keladi va ularda javob yo'q (AGENTS.md 2-band)
  const [savollar, setSavollar] = useState([])
  const [sessiyaHolat, setSessiyaHolat] = useState("yuklanmoqda")
  const [xatoMatn, setXatoMatn] = useState("")
  const [imtihonInfo, setImtihonInfo] = useState(null)
  const [superadminRejimi, setSuperadminRejimi] = useState(false)
  const [qabulQilindi, setQabulQilindi] = useState(null)
  const [soatFarqiMs, setSoatFarqiMs] = useState(0)
  const [hozirMs, setHozirMs] = useState(() => Date.now())
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [qaytaTekshirilmoqda, setQaytaTekshirilmoqda] = useState(false)
  const [ismSaqlanmoqda, setIsmSaqlanmoqda] = useState(false)
  const [ismHolatXabar, setIsmHolatXabar] = useState("")
  const tokenRef = useRef(null)
  const yuborilmoqdaRef = useRef(false)

  const limitSoniya = (testInfo?.vaqtMin || 100) * 60

  // State
  const [joriyIndex, setJoriyIndex] = useState(0)
  const [javoblar, setJavoblar] = useState({})
  const [belgilar, setBelgilar] = useState({}) // Qayta ko'rish uchun belgilangan savollar
  const [qolganVaqt, setQolganVaqt] = useState(limitSoniya)
  const [yakunlandi, setYakunlandi] = useState(false)
  const [natija, setNatija] = useState(null)
  const [natijaVkladka, setNatijaVkladka] = useState("xarita") // "xarita" | "savollar"
  const [savolFiltr, setSavolFiltr] = useState("all") // "all" | "togri" | "xato"

  // Modallar
  const [tasdiqModali, setTasdiqModali] = useState(false)
  const [navigatsiyaModali, setNavigatsiyaModali] = useState(false)
  const [jadvallarModali, setJadvallarModali] = useState(false)
  const [zoomRasm, setZoomRasm] = useState(null)

  const javoblarRef = useRef(javoblar)
  const testniYakunlaRef = useRef(null)
  useEffect(() => {
    javoblarRef.current = javoblar
  }, [javoblar])

  // LocalStorage kaliti
  const storageKalit = `jda_ms_test_${slug}`

  const sessiyaniOch = useCallback(
    async (eskiToken) => {
      const res = await fetch("/api/milliy-sertifikat/boshlash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token: eskiToken }),
      })
      const d = await res.json().catch(() => null)
      if (!res.ok || !d?.token) {
        const err = new Error(d?.error || "Sinovni yuklab bo'lmadi")
        err.status = res.status
        err.kod = d?.loginKerak
          ? "login_kerak"
          : d?.allaqachonTopshirilgan
          ? "allaqachon_topshirilgan"
          : d?.holat || null
        err.meta = d
        throw err
      }
      return d
    },
    [slug]
  )

  const holatniTekshir = useCallback(async () => {
    setQaytaTekshirilmoqda(true)
    try {
      const res = await fetch(`/api/milliy-sertifikat/natija?slug=${encodeURIComponent(slug)}`)
      const d = await res.json().catch(() => null)
      if (!res.ok || !d) return null
      if (d.imtihon) setImtihonInfo(d.imtihon)
      if (d.serverVaqt) {
        const sv = new Date(d.serverVaqt).getTime()
        if (!Number.isNaN(sv)) setSoatFarqiMs(sv - Date.now())
      }
      if (d.holat === "elon_qilindi" && d.natija) {
        setSavollar(d.savollar || [])
        setNatija({ ...d.natija, total: d.natija.jamiSavollar })
        setYakunlandi(true)
        setSessiyaHolat("elon_qilindi")
      } else if (d.holat === "kutilmoqda_elon" && d.qabulQilindi) {
        try {
          localStorage.removeItem(storageKalit)
        } catch {}
        setQabulQilindi(d.qabulQilindi)
        setSessiyaHolat("qabul_qilindi")
      }
      return d
    } finally {
      setQaytaTekshirilmoqda(false)
    }
  }, [slug, storageKalit])

  // Real-vaqtda kutish taymeri (imtihon boshlanishini kutish oynasi uchun)
  useEffect(() => {
    if (sessiyaHolat !== "kutish") return
    const t = setInterval(() => setHozirMs(Date.now() + soatFarqiMs), 1000)
    return () => clearInterval(t)
  }, [sessiyaHolat, soatFarqiMs])

  // 1. Avval holat va natijani tekshiramiz, so'ng ochiq bo'lsa sessiya ochamiz
  useEffect(() => {
    let bekor = false

    async function yukla() {
      let saqlangan = null
      try {
        saqlangan = JSON.parse(localStorage.getItem(storageKalit) || "null")
      } catch {
        // ignore
      }

      try {
        const holatRes = await fetch(`/api/milliy-sertifikat/natija?slug=${encodeURIComponent(slug)}`)
        const hData = await holatRes.json().catch(() => null)
        if (bekor) return

        if (holatRes.ok && hData) {
          if (hData.imtihon) setImtihonInfo(hData.imtihon)
          if (hData.superadminRejimi) setSuperadminRejimi(true)
          if (hData.serverVaqt) {
            const sv = new Date(hData.serverVaqt).getTime()
            if (!Number.isNaN(sv)) setSoatFarqiMs(sv - Date.now())
          }

          if (hData.holat === "elon_qilindi" && hData.natija) {
            setSavollar(hData.savollar || [])
            setNatija({ ...hData.natija, total: hData.natija.jamiSavollar })
            setYakunlandi(true)
            setSessiyaHolat("elon_qilindi")
            return
          }

          if (hData.holat === "kutilmoqda_elon" && hData.qabulQilindi) {
            try {
              localStorage.removeItem(storageKalit)
            } catch {}
            setQabulQilindi(hData.qabulQilindi)
            setSessiyaHolat("qabul_qilindi")
            return
          }

          const imtHolat = hData.imtihon?.holat
          if (!hData.superadminRejimi && hData.kirilmagan) {
            setSessiyaHolat("login_kerak")
            return
          }
          if (!hData.superadminRejimi && hData.imtihon?.rejim === "jadval") {
            if (imtHolat === "kutilmoqda") {
              setSessiyaHolat("kutish")
              return
            }
            if (["belgilanmagan", "yopiq", "tekshirilmoqda", "elon_qilindi"].includes(imtHolat)) {
              setXatoMatn(hData.imtihon.xabar || "Imtihon hozircha ochiq emas.")
              setSessiyaHolat("yopiq")
              return
            }
          }
        }

        const d = await sessiyaniOch(saqlangan?.token)
        if (bekor) return

        tokenRef.current = d.token
        if (d.superadminRejimi) setSuperadminRejimi(true)
        if (d.rejim || d.endsAt || d.sarlavha) {
          setImtihonInfo((prev) => ({ ...(prev || {}), rejim: d.rejim, endsAt: d.endsAt, sarlavha: d.sarlavha }))
        }
        setSavollar(d.savollar)
        setQolganVaqt(d.qolganSoniya)
        if (saqlangan?.token === d.token) {
          setJavoblar(saqlangan.javoblar || {})
          setBelgilar(saqlangan.belgilar || {})
        }
        setSessiyaHolat("tayyor")
      } catch (e) {
        if (bekor) return
        if (e.kod === "login_kerak") {
          setSessiyaHolat("login_kerak")
          return
        }
        if (e.kod === "allaqachon_topshirilgan") {
          await holatniTekshir()
          return
        }
        if (e.kod === "kutilmoqda") {
          setSessiyaHolat("kutish")
          return
        }
        setXatoMatn(e.message)
        setSessiyaHolat("xato")
      }
    }

    yukla()
    return () => {
      bekor = true
    }
  }, [slug, storageKalit, sessiyaniOch, holatniTekshir])

  // Javoblar va belgilar o'zgarganda saqlash
  useEffect(() => {
    if (yakunlandi || sessiyaHolat !== "tayyor") return
    try {
      localStorage.setItem(
        storageKalit,
        JSON.stringify({ token: tokenRef.current, javoblar, belgilar })
      )
    } catch {
      // ignore
    }
  }, [javoblar, belgilar, storageKalit, yakunlandi, sessiyaHolat])

  // 2. Taymer hisobi
  useEffect(() => {
    if (yakunlandi || sessiyaHolat !== "tayyor") return

    const interval = setInterval(() => {
      setQolganVaqt((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          testniYakunlaRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [yakunlandi, sessiyaHolat])

  // 3. Variant javobini tanlash
  const javobTanla = useCallback(
    (variant) => {
      if (yakunlandi) return
      const joriy = savollar[joriyIndex]
      if (!joriy) return

      setJavoblar((prev) => ({
        ...prev,
        [joriy.id]: variant,
      }))
    },
    [yakunlandi, savollar, joriyIndex]
  )

  // 4. Ochiq savol javobini yozish (36-40)
  const ochiqJavobYoz = useCallback(
    (qiymat) => {
      if (yakunlandi) return
      const joriy = savollar[joriyIndex]
      if (!joriy) return

      setJavoblar((prev) => ({
        ...prev,
        [joriy.id]: qiymat,
      }))
    },
    [yakunlandi, savollar, joriyIndex]
  )

  // 5. Qayta ko'rish belgisini yoqish/o'chirish (Flag)
  const belgiAlmash = useCallback(() => {
    const joriy = savollar[joriyIndex]
    if (!joriy) return

    setBelgilar((prev) => ({
      ...prev,
      [joriy.id]: !prev[joriy.id],
    }))
  }, [savollar, joriyIndex])

  // Klaviaturadan A, B, C, D va strelkalar orqali tezkor ishlash
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (tasdiqModali || navigatsiyaModali || jadvallarModali || zoomRasm || yakunlandi) return
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return

      const harf = e.key.toUpperCase()
      const joriy = savollar[joriyIndex]

      if (joriy?.turi !== "ochiq") {
        const variantlar = joriy?.options || ["A", "B", "C", "D"]
        // Agar options matnlar bo'lsa (0, 1, 2, 3)
        if (["A", "B", "C", "D"].includes(harf)) {
          e.preventDefault()
          if (joriy?.javobIndeks) {
            const ind = ["A", "B", "C", "D"].indexOf(harf)
            javobTanla(ind)
          } else {
            javobTanla(harf)
          }
        }
      }

      if (e.key === "ArrowRight") {
        e.preventDefault()
        setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setJoriyIndex((i) => Math.max(0, i - 1))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [joriyIndex, savollar, javobTanla, tasdiqModali, navigatsiyaModali, jadvallarModali, zoomRasm, yakunlandi])

  // 6. Testni yakunlash: ball va daraja serverda hisoblanadi
  const testniYakunla = async () => {
    if (yuborilmoqdaRef.current || !tokenRef.current) return
    yuborilmoqdaRef.current = true
    setYuborilmoqda(true)
    setXatoMatn("")

    try {
      const res = await fetch("/api/milliy-sertifikat/yakunlash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenRef.current,
          javoblar: javoblarRef.current || {},
        }),
      })
      const d = await res.json().catch(() => null)

      if (res.ok && d?.yashirin && d?.qabulQilindi) {
        try {
          localStorage.removeItem(storageKalit)
        } catch {}
        tokenRef.current = null
        setQabulQilindi(d.qabulQilindi)
        setTasdiqModali(false)
        setSessiyaHolat("qabul_qilindi")
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }

      if (!res.ok || !d?.natija) {
        if (d?.takroriy) {
          try {
            localStorage.removeItem(storageKalit)
          } catch {}
        }
        setXatoMatn(d?.error || "Natijani olib bo'lmadi. Qayta urinib ko'ring.")
        setTasdiqModali(true)
        return
      }

      try {
        localStorage.removeItem(storageKalit)
      } catch {}
      tokenRef.current = null

      setNatija({ ...d.natija, total: d.natija.jamiSavollar })
      setTasdiqModali(false)
      setYakunlandi(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      // Javoblar joyida qoladi, foydalanuvchi qayta yubora oladi
      setXatoMatn("Internet bilan aloqa uzildi. Qayta urinib ko'ring.")
      setTasdiqModali(true)
    } finally {
      yuborilmoqdaRef.current = false
      setYuborilmoqda(false)
    }
  }

  useEffect(() => {
    testniYakunlaRef.current = testniYakunla
  })

  // Natijadan keyin yangi sessiya bilan qayta boshlash
  const qaytaBoshla = async () => {
    setSessiyaHolat("yuklanmoqda")
    setYakunlandi(false)
    setNatija(null)
    setJavoblar({})
    setBelgilar({})
    setJoriyIndex(0)
    setXatoMatn("")
    try {
      const d = await sessiyaniOch(null)
      tokenRef.current = d.token
      setSavollar(d.savollar)
      setQolganVaqt(d.qolganSoniya)
      setSessiyaHolat("tayyor")
    } catch (e) {
      setXatoMatn(e.message)
      setSessiyaHolat("xato")
    }
  }

  // Hisoblagichlar
  const javobBerilganlarSoni = Object.keys(javoblar).filter(
    (k) => javoblar[k] !== undefined && javoblar[k] !== ""
  ).length
  const belgilanganlarSoni = Object.keys(belgilar).filter((k) => belgilar[k]).length
  const qolganlarSoni = savollar.length - javobBerilganlarSoni
  const progressFoiz = Math.round((javobBerilganlarSoni / (savollar.length || 1)) * 100)

  const joriySavol = savollar[joriyIndex]
  const joriyJavob = joriySavol ? javoblar[joriySavol.id] : undefined
  const joriyBelgilangan = joriySavol ? Boolean(belgilar[joriySavol.id]) : false

  // ═════════════════════════════════════════════════════════════════════
  // ─── NATIJA KO'RINISHI (YAKUNLANGANDAN SO'NG RASCH HISOBOTI) ───
  // ═════════════════════════════════════════════════════════════════════
  if (yakunlandi && natija) {
    const darajaMalumot = SERTIFIKAT_DARAJALARI.find((d) => d.daraja === natija.daraja) || {
      daraja: natija.daraja,
      chegaraRang: "border-slate-500 bg-slate-900/40 text-slate-300",
      imtiyoz: natija.imtiyoz,
    }

    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col text-white relative overflow-x-hidden justify-between p-4 sm:p-6">
        {/* Fon nurlari */}
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sky-400/25 pb-4">
            <Link
              href="/milliy-sertifikat"
              className="inline-flex items-center gap-2 text-xs text-sky-100 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35"
            >
              <Ikon nom="chap" olcham={16} />
              <span>Orqaga</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-xs font-semibold text-sky-100 hover:text-white transition flex items-center gap-1.5"
              >
                <Ikon nom="fayl" olcham={14} />
                <span>Chop etish</span>
              </button>
            </div>
          </div>

          {/* ═══ NATIJA BANNERI ═══ */}
          <div className="ms-karta-oltin p-4 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {testInfo.nom}
                </h1>

                <p className="text-xs text-sky-100/85 leading-relaxed">
                  {TAYYORGARLIK_OGOHLANTIRISH}
                </p>

                <div className="ms-karta-ichki px-3.5 py-2.5 rounded-2xl text-xs flex items-start gap-2 text-sky-100">
                  <Ikon nom="kubok" olcham={14} className="text-amber-300 shrink-0 mt-0.5" />
                  <span>{natija.imtiyoz}</span>
                </div>

                {natija.superadminSinovi && (
                  <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-300/45 text-xs text-cyan-100 flex items-center gap-2">
                    <Ikon nom="toj" olcham={15} className="text-cyan-300 shrink-0" />
                    <span>
                      <strong>Superadmin:</strong> cheksiz sinov, natija bazaga yozilmaydi.
                    </span>
                  </div>
                )}

                {natija.ishonchsiz && (
                  <div className="p-3 rounded-2xl bg-amber-400/15 border border-amber-300/50 text-xs text-amber-100">
                    Javoblar qiyinlik tartibiga mos kelmadi — natija taxminiy bo&apos;lishi mumkin.
                  </div>
                )}

                {/* Ism-familiya kiritish va tahrirlash */}
                {natija.sertifikat && (
                  <div className="ms-karta-ichki p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] text-sky-200 font-semibold flex items-center gap-1.5">
                        <Ikon nom="odam" olcham={13} />
                        <span>Sertifikat F.I.SH.</span>
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                          natija.sertifikat.fullNameLocked
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
                            : "bg-amber-400/15 text-amber-300 border-amber-300/40"
                        }`}
                      >
                        {natija.sertifikat.fullNameLocked ? (
                          <>
                            <Ikon nom="tasdiq" olcham={11} />
                            <span>Tasdiqlangan</span>
                          </>
                        ) : (
                          "1 marta tahrirlash"
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={natija.sertifikat.fullName || ""}
                        disabled={Boolean(natija.sertifikat.fullNameLocked) || ismSaqlanmoqda}
                        maxLength={80}
                        onChange={(e) => {
                          const yangi = e.target.value
                          setIsmHolatXabar("")
                          setFoydalanuvchiIsmi(yangi)
                          setNatija((prev) => ({
                            ...prev,
                            sertifikat: { ...prev.sertifikat, fullName: yangi },
                          }))
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#091642] border border-sky-400/45 text-white font-serif text-sm focus:outline-none focus:border-amber-300 placeholder:text-sky-200/45 disabled:opacity-70"
                        placeholder="Familiya Ism Sharif"
                      />
                      {!natija.sertifikat.fullNameLocked && (
                        <button
                          type="button"
                          disabled={ismSaqlanmoqda || !String(natija.sertifikat.fullName || "").trim()}
                          onClick={async () => {
                            if (!natija?.sertifikat) return
                            setIsmSaqlanmoqda(true)
                            setIsmHolatXabar("")
                            try {
                              const res = await fetch("/api/milliy-sertifikat/saqlash", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  certId: natija.sertifikat.certId,
                                  fullName: natija.sertifikat.fullName,
                                }),
                              })
                              const d = await res.json().catch(() => ({}))
                              if (!res.ok) {
                                setIsmHolatXabar(d?.error || "Saqlanmadi")
                                if (d?.locked) {
                                  setNatija((prev) => ({
                                    ...prev,
                                    sertifikat: { ...prev.sertifikat, fullNameLocked: true },
                                  }))
                                }
                                return
                              }
                              setNatija((prev) => ({
                                ...prev,
                                sertifikat: {
                                  ...prev.sertifikat,
                                  fullName: d.fullName ?? prev.sertifikat.fullName,
                                  fullNameLocked: Boolean(d.fullNameLocked),
                                },
                              }))
                              setIsmHolatXabar(
                                d.unchanged ? "O'zgarmadi" : "Tasdiqlandi"
                              )
                            } catch {
                              setIsmHolatXabar("Xatolik, qayta urining")
                            } finally {
                              setIsmSaqlanmoqda(false)
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-sky-500/25 hover:bg-sky-500/40 border border-sky-400/45 text-xs font-bold text-white whitespace-nowrap disabled:opacity-50 transition"
                        >
                          {ismSaqlanmoqda ? "Saqlanmoqda..." : "Tasdiqlash"}
                        </button>
                      )}
                    </div>

                    {ismHolatXabar && (
                      <p className="text-[11px] text-amber-200">{ismHolatXabar}</p>
                    )}
                  </div>
                )}

                {/* Sertifikat PDF Yuklab Olish va QR Reestr Tekshiruvi */}
                {natija.sertifikat ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => yuklabOlishMilliySertifikatPDF(natija.sertifikat)}
                      className="ms-tugma-oltin px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-amber-200"
                    >
                      <Ikon nom="sertifikat" olcham={16} />
                      <span>PDF yuklab olish</span>
                    </button>

                    <Link
                      href={sertifikatVerifyYoli(natija.sertifikat.certId)}
                      target="_blank"
                      className="text-xs text-amber-300 hover:text-white underline underline-offset-4 flex items-center justify-center gap-1 font-mono py-1"
                    >
                      <span>{natija.sertifikat.certId}</span>
                      <Ikon nom="tashqi" olcham={13} />
                    </Link>
                  </div>
                ) : natija.sertifikatIzoh ? (
                  <div className="text-xs text-rose-300 pt-1">
                    {natija.sertifikatIzoh}
                  </div>
                ) : null}
              </div>

              {/* Daraja va Ball Badji */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-amber-300/65 bg-gradient-to-b from-[#132663] to-[#0a1642] shadow-xl shadow-amber-500/15 min-w-[205px] text-center shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  Taxminiy Daraja
                </span>
                <div className="text-4xl font-extrabold text-white mt-1 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  {natija.daraja}
                </div>
                <div className="text-sm font-bold text-amber-100 mt-1">
                  {natija.darajaNomi}
                </div>

                <div className="mt-4 pt-3 border-t border-sky-400/25 w-full space-y-1 text-xs">
                  <div className="flex justify-between text-sky-200">
                    <span>Taxminiy ball:</span>
                    <strong className="text-white font-mono">{natija.shkalaBalli} ball</strong>
                  </div>
                  <div className="flex justify-between text-sky-200">
                    <span>Ishonch oralig&apos;i:</span>
                    <strong className="text-white font-mono">
                      {natija.ballPast} – {natija.ballYuqori}
                    </strong>
                  </div>
                  <div className="flex justify-between text-sky-200">
                    <span>To&apos;g&apos;ri</span>
                    <strong className="text-emerald-300 font-mono">
                      {natija.rawScore} / {natija.total} ({natija.foiz}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-sky-200">
                    <span>Vaqt</span>
                    <strong className="text-cyan-300 font-mono">
                      {soniyaFormat(natija.sarflanganVaqt || 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ IKKI XIL NATIJA TAQQOSLAMASI (RASCH IRT VS ODDIY BALL) ═══ */}
          <IkkiNatijaTaqqoslash natija={natija} />

          {/* Vkladkalar: Wright Map vs Batafsil Savollar Tahlili */}
          <div className="flex flex-wrap items-center gap-2 border-b border-sky-400/25 pb-3">
            <button
              onClick={() => setNatijaVkladka("xarita")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                natijaVkladka === "xarita"
                  ? "bg-amber-400/25 text-amber-200 border border-amber-300/55 shadow-sm"
                  : "bg-[#10225e]/85 text-sky-200 hover:bg-[#173287] border border-sky-400/25"
              }`}
            >
              <Ikon nom="grafik" olcham={14} />
              <span>Wright Map</span>
            </button>

            <button
              onClick={() => setNatijaVkladka("savollar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                natijaVkladka === "savollar"
                  ? "bg-amber-400/25 text-amber-200 border border-amber-300/55 shadow-sm"
                  : "bg-[#10225e]/85 text-sky-200 hover:bg-[#173287] border border-sky-400/25"
              }`}
            >
              <Ikon nom="quiz" olcham={14} />
              <span>Savollar ({natija.rawScore}/{natija.total})</span>
            </button>
          </div>

          {/* ═══ 1. WRIGHT MAP VA ILMIY TAHLIL ═══ */}
          {natijaVkladka === "xarita" && (
            <RaschWrightMap
              theta={natija.theta}
              se={natija.se}
              infitMNSQ={natija.infitMNSQ}
              outfitMNSQ={natija.outfitMNSQ}
              savollar={savollar}
              wrightMapData={natija.wrightMapData}
            />
          )}

          {/* ═══ 2. SAVOLLAR BO'YICHA TAHLIL VA TO'G'RI JAVOBLAR ═══ */}
          {natijaVkladka === "savollar" && (
            <div className="space-y-4">
              {/* Filtr tugmalari */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setSavolFiltr("all")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    savolFiltr === "all"
                      ? "bg-sky-600 text-white border-sky-400 shadow-sm"
                      : "bg-[#0e1f56]/80 text-sky-200 border-sky-400/30 hover:border-sky-300/50"
                  }`}
                >
                  Barcha savollar ({savollar.length})
                </button>
                <button
                  onClick={() => setSavolFiltr("togri")}
                  className={`px-3 py-1.5 rounded-lg border transition inline-flex items-center gap-1.5 ${
                    savolFiltr === "togri"
                      ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                      : "bg-emerald-500/15 text-emerald-200 border-emerald-400/40"
                  }`}
                >
                  <Ikon nom="belgi" olcham={12} />
                  <span>To&apos;g&apos;ri ({natija.rawScore})</span>
                </button>
                <button
                  onClick={() => setSavolFiltr("xato")}
                  className={`px-3 py-1.5 rounded-lg border transition inline-flex items-center gap-1.5 ${
                    savolFiltr === "xato"
                      ? "bg-rose-600 text-white border-rose-400 shadow-sm"
                      : "bg-rose-500/15 text-rose-200 border-rose-400/40"
                  }`}
                >
                  <Ikon nom="yopish" olcham={12} />
                  <span>Xato ({natija.total - natija.rawScore})</span>
                </button>
              </div>

              {/* Savollar ro'yxati */}
              <div className="space-y-4">
                {savollar
                  .map((s, index) => {
                    const tahlil = natija.savolNatijalari[index]
                    return {
                      s,
                      index,
                      berilgan: tahlil.berilganJavob,
                      togri: tahlil.togri,
                      togriJavob: tahlil.togriJavob,
                      izoh: tahlil.explanation,
                      kohortTogriFoiz: tahlil.kohortTogriFoiz,
                    }
                  })
                  .filter(({ togri }) => {
                    if (savolFiltr === "togri") return togri
                    if (savolFiltr === "xato") return !togri
                    return true
                  })
                  .map(({ s, index, berilgan, togri, togriJavob, izoh, kohortTogriFoiz }) => {
                    return (
                      <div
                        key={s.id}
                        className={`p-5 rounded-3xl border shadow-lg transition ${
                          togri
                            ? "bg-gradient-to-br from-[#0e2759]/90 to-[#0a1c44]/95 border-emerald-400/50"
                            : "bg-gradient-to-br from-[#231545]/90 to-[#160f35]/95 border-rose-400/50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-400/20 pb-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`min-w-7 h-7 px-1.5 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                togri
                                  ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/60"
                                  : "bg-rose-500/25 text-rose-200 border border-rose-400/60"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {s.mavzu || `${index + 1}-savol`}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-400/20 border border-sky-300/35 text-sky-100">
                              {s.soha}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {kohortTogriFoiz !== null && kohortTogriFoiz !== undefined && (
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-300/40 text-cyan-200">
                                Kohort: {kohortTogriFoiz}% to&apos;g&apos;ri
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-sky-200">
                              Qiyinlik: {s.qiyinlik > 0 ? `+${s.qiyinlik}` : s.qiyinlik} logit
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                togri
                                  ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/60"
                                  : "bg-rose-500/25 text-rose-200 border border-rose-400/60"
                              }`}
                            >
                              <Ikon nom={togri ? "belgi" : "yopish"} olcham={12} />
                              <span>{togri ? "To'g'ri" : "Xato"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Savol matni yoki rasmi */}
                        <div className="py-3 text-xs sm:text-sm text-white space-y-2">
                          {s.kontekstMatn && (
                            <div className="ms-karta-ichki p-2.5 rounded-xl text-xs leading-relaxed text-sky-50">
                              <LatexBoyMatn matn={s.kontekstMatn} />
                            </div>
                          )}
                          {s.question && (
                            <div className="leading-relaxed font-serif">
                              <LatexBoyMatn matn={s.question} />
                            </div>
                          )}
                          <SavolJadval jadval={s.jadval} />
                          {s.rasm && (
                            <div className="mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={s.rasm}
                                alt={`Savol ${s.id}`}
                                className="max-h-72 rounded-xl border border-sky-400/35 mx-auto cursor-zoom-in"
                                onClick={() => setZoomRasm(s.rasm)}
                              />
                            </div>
                          )}
                        </div>

                        {/* Javoblar tahlili */}
                        <div className="ms-karta-ichki p-3 rounded-2xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sky-200 shrink-0">Sizning javobingiz:</span>
                            <strong
                              className={`font-mono text-sm text-right ${
                                togri ? "text-emerald-300" : "text-rose-300"
                              }`}
                            >
                              <JavobMatni savol={s} qiymat={berilgan} />
                            </strong>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sky-200 shrink-0">To&apos;g&apos;ri javob:</span>
                            <strong className="text-emerald-300 font-mono text-sm text-right">
                              <JavobMatni savol={s} qiymat={togriJavob} boshMatn="—" />
                            </strong>
                          </div>

                          {izoh && (
                            <div className="mt-2 pt-2 border-t border-sky-400/20 text-[11px] text-sky-100 leading-relaxed">
                              <span className="font-bold text-amber-300">Ilmiy izoh: </span>
                              <LatexBoyMatn matn={izoh} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Pastki tugmalar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sky-400/25">
            {(imtihonInfo?.rejim !== "jadval" || natija?.superadminSinovi || superadminRejimi) && (
              <button
                onClick={qaytaBoshla}
                className="ms-tugma-oltin w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs border border-amber-200 flex items-center justify-center gap-2"
              >
                <Ikon nom="qayta" olcham={16} />
                <span>
                  {natija?.superadminSinovi || superadminRejimi
                    ? "Yana qayta yechish (Superadmin)"
                    : "Qaytadan topshirish"}
                </span>
              </button>
            )}

            <Link
              href="/milliy-sertifikat"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#112462]/85 hover:bg-[#173287] border border-sky-400/35 text-sky-100 hover:text-white text-xs font-semibold transition text-center"
            >
              Milliy sertifikat markaziga qaytish →
            </Link>
          </div>
        </div>

        {/* Lightbox Zoom Modal */}
        {zoomRasm && (
          <div
            onClick={() => setZoomRasm(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomRasm}
              alt="Kattalashtirilgan rasm"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-blue-800"
            />
          </div>
        )}
      </main>
    )
  }

  if (sessiyaHolat === "qabul_qilindi" && qabulQilindi) {
    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-x-hidden">
        <div className="absolute top-0 left-1/4 w-[34rem] h-[34rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="ms-karta-oltin max-w-2xl w-full p-6 sm:p-8 rounded-3xl space-y-6 relative z-10">
          <div className="flex items-start justify-between gap-4 border-b border-amber-300/25 pb-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/50 text-emerald-200 text-xs font-bold">
                <Ikon nom="tasdiq" olcham={14} />
                <span>Qabul qilindi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {qabulQilindi.sarlavha || testInfo.nom}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/55 text-amber-200 flex items-center justify-center shrink-0">
              <Ikon nom="soat" olcham={24} />
            </div>
          </div>

          <div className="ms-karta-ichki p-4 rounded-2xl text-xs sm:text-sm text-sky-100 leading-relaxed space-y-1">
            <p className="font-bold text-amber-200">
              Natijalar imtihon yakunlangach e&apos;lon qilinadi.
            </p>
            <p className="text-xs text-sky-200">
              Rasch IRT va oddiy ball natijalari barcha uchun bir vaqtda ochiladi.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/80">Javoblar</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {qabulQilindi.javobBerilganSoni} / {qabulQilindi.jamiSavollar}
              </div>
            </div>
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/80">Vaqt</div>
              <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                {soniyaFormat(qabulQilindi.sarflanganVaqt || 0)}
              </div>
            </div>
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/80">Topshirildi</div>
              <div className="text-xs font-bold text-white font-mono mt-1">
                {sanaVaqt(qabulQilindi.topshirilganVaqt)}
              </div>
            </div>
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/80">Yopiladi</div>
              <div className="text-xs font-bold text-amber-200 font-mono mt-1">
                {qabulQilindi.endsAt ? sanaVaqt(qabulQilindi.endsAt) : "—"}
              </div>
            </div>
          </div>

          {qabulQilindi.kechikkan && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-xs text-amber-200">
              Vaqtdan keyin yuborilgan.
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-300/20">
            <button
              onClick={holatniTekshir}
              disabled={qaytaTekshirilmoqda}
              className="ms-tugma-oltin w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs border border-amber-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Ikon nom="qayta" olcham={15} />
              <span>{qaytaTekshirilmoqda ? "Tekshirilmoqda..." : "Yangilash"}</span>
            </button>

            <Link
              href="/milliy-sertifikat"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#112462]/85 hover:bg-[#173287] border border-sky-400/35 text-xs font-semibold text-sky-100 hover:text-white text-center transition"
            >
              Ro&apos;yxat
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (sessiyaHolat === "kutish") {
    const boshMs = imtihonInfo?.startsAt ? new Date(imtihonInfo.startsAt).getTime() : null
    const qoldiMs = boshMs ? Math.max(0, boshMs - hozirMs) : 0
    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-white">
        <div className="ms-karta-oltin max-w-lg w-full p-7 rounded-3xl space-y-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-bold">
            <Ikon nom="soat" olcham={14} />
            <span>Kutish xonasi</span>
          </div>
          <h1 className="text-xl font-bold text-white">{imtihonInfo?.sarlavha || testInfo.nom}</h1>
          {boshMs && (
            <div className="ms-karta-ichki p-4 rounded-2xl space-y-2">
              <div className="text-xs text-sky-200">Boshlanishiga</div>
              <div className="text-3xl font-extrabold font-mono text-amber-300 tracking-wide">
                {muddatFormat(qoldiMs)}
              </div>
              <div className="text-xs text-sky-200 pt-1">
                Ochilish: <strong className="text-white">{sanaVaqt(imtihonInfo.startsAt)}</strong>
              </div>
              {imtihonInfo?.endsAt && (
                <div className="text-xs text-sky-200">
                  Yopilish: <strong className="text-white">{sanaVaqt(imtihonInfo.endsAt)}</strong>
                </div>
              )}
            </div>
          )}
          <p className="text-xs text-sky-100/90">
            Vaqt kirgach sahifani yangilang.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="ms-tugma-oltin flex-1 py-2.5 rounded-xl font-bold text-xs border border-amber-200"
            >
              Yangilash
            </button>
            <Link
              href="/milliy-sertifikat"
              className="flex-1 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-xs font-semibold text-sky-100 flex items-center justify-center"
            >
              Ro&apos;yxat
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (sessiyaHolat === "login_kerak") {
    const qaytish = encodeURIComponent(`/milliy-sertifikat/${slug}`)
    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-white">
        <div className="ms-karta-oltin max-w-md w-full p-7 rounded-3xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/50 text-amber-200 flex items-center justify-center mx-auto">
            <Ikon nom="odam" olcham={24} />
          </div>
          <h1 className="text-lg font-bold text-white">{imtihonInfo?.sarlavha || testInfo.nom}</h1>
          <p className="text-xs text-sky-100">
            Sinov va sertifikat uchun hisobingizga kiring.
          </p>
          {imtihonInfo?.startsAt && imtihonInfo?.endsAt && imtihonInfo?.rejim === "jadval" && (
            <div className="ms-karta-ichki p-3 rounded-xl text-[11px] text-sky-200 space-y-1">
              <div>Boshlanish: <strong className="text-white font-mono">{sanaVaqt(imtihonInfo.startsAt)}</strong></div>
              <div>Yopilish: <strong className="text-white font-mono">{sanaVaqt(imtihonInfo.endsAt)}</strong></div>
            </div>
          )}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href={`/login?callbackUrl=${qaytish}`}
              className="ms-tugma-oltin w-full py-2.5 rounded-xl font-bold text-xs border border-amber-200"
            >
              Kirish
            </Link>
            <Link
              href={`/register?callbackUrl=${qaytish}`}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/45 text-xs font-semibold text-emerald-100"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
            <Link
              href="/milliy-sertifikat"
              className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-xs font-semibold text-sky-100"
            >
              Ro&apos;yxat
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (sessiyaHolat !== "tayyor") {
    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="ms-karta max-w-md w-full p-7 rounded-3xl space-y-4">
          <p className="text-sm font-semibold text-sky-100">
            {sessiyaHolat === "xato" || sessiyaHolat === "yopiq" ? xatoMatn : "Sinov yuklanmoqda..."}
          </p>
          {imtihonInfo?.endsAt && sessiyaHolat === "yopiq" && (
            <div className="text-xs text-sky-200">
              Imtihon oynasi: {sanaVaqt(imtihonInfo.startsAt)} — {sanaVaqt(imtihonInfo.endsAt)}
            </div>
          )}
          {(sessiyaHolat === "xato" || sessiyaHolat === "yopiq") && (
            <Link
              href="/milliy-sertifikat"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-xs font-semibold text-sky-100 transition"
            >
              Sinovlar ro&apos;yxatiga qaytish
            </Link>
          )}
        </div>
      </main>
    )
  }

  // ═════════════════════════════════════════════════════════════════════
  // ─── CBT SIMULYATOR TEST ISHLASH INTERFEYSI ───
  // ═════════════════════════════════════════════════════════════════════
  return (
    <main className="ms-akademik ms-fon min-h-screen flex flex-col text-white relative overflow-x-hidden justify-between select-none">
      {/* Fon nurlari */}
      <div className="absolute top-0 left-1/3 w-[36rem] h-[36rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. STICKY TOP BOSHQARUV PANELI ─── */}
      <header className="ms-header sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Chap: Qaytish va Savollar palitrasi tugmasi */}
          <div className="flex items-center gap-2">
            <Link
              href="/milliy-sertifikat"
              onClick={(e) => {
                if (javobBerilganlarSoni > 0 && !window.confirm("Test jarayoni to'xtatiladi. Bosh sahifaga qaytasizmi?")) {
                  e.preventDefault()
                }
              }}
              className="p-2 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-sky-100 hover:text-white transition"
              title="Chiqish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>

            <button
              onClick={() => setNavigatsiyaModali(true)}
              className="px-3 py-1.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-xs font-bold text-white transition flex items-center gap-1.5"
              title="Savollar xaritasi"
            >
              <Ikon nom="panjara" olcham={14} className="text-amber-300" />
              <span>
                {joriyIndex + 1} / {savollar.length}
              </span>
            </button>
          </div>

          {/* O'rta: Taymer va Progress */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-2 font-mono font-bold text-xs sm:text-sm shadow-md transition-all ${
                qolganVaqt <= 180
                  ? "bg-rose-900/80 border-rose-400 text-rose-200 animate-pulse"
                  : qolganVaqt <= 600
                  ? "bg-amber-900/80 border-amber-400 text-amber-200"
                  : "bg-[#112566]/90 border-sky-400/45 text-white"
              }`}
            >
              <Ikon nom="soat" olcham={16} />
              <span>{soniyaFormat(qolganVaqt)}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-sky-200">
              <div className="w-24 h-2 rounded-full bg-[#091642] overflow-hidden border border-sky-400/35">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300"
                  style={{ width: `${progressFoiz}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-sky-100">{progressFoiz}%</span>
            </div>

            {superadminRejimi && (
              <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-[10px] font-bold text-amber-200">
                <Ikon nom="toj" olcham={12} />
                <span>Superadmin · natija yozilmaydi</span>
              </span>
            )}
          </div>

          {/* O'ng: Yordamchi Jadvallar & Yakunlash */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setJadvallarModali(true)}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-xs font-semibold text-sky-100 hover:text-white transition flex items-center gap-1.5"
              title="Mendeleyev va Eruvchanlik jadvallari"
            >
              <Ikon nom="atom" olcham={15} />
              <span className="hidden sm:inline">Jadvallar</span>
            </button>

            <button
              onClick={() => setTasdiqModali(true)}
              className="ms-tugma-oltin px-3.5 py-1.5 rounded-xl border border-amber-200 font-bold text-xs flex items-center gap-1.5"
            >
              <Ikon nom="tasdiq" olcham={14} />
              <span>Yakunlash</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. ASOSIY TEST ISHLASH MAYDONI ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 relative z-10">
        {/* CHAP / ASOSIY MAYDON (SAVOL VA JAVOBLAR) */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-4">
          {joriySavol ? (
            <div className="ms-karta p-3.5 sm:p-7 rounded-3xl flex flex-col justify-between flex-1 space-y-5">
              {/* Savol bosh qatori */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-400/25 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="min-w-8 h-8 px-2 rounded-xl bg-amber-400/20 border border-amber-300/55 text-amber-200 font-bold text-sm flex items-center justify-center font-mono shrink-0 shadow-sm shadow-amber-500/15">
                    {joriyIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {joriySavol.mavzu || `${joriyIndex + 1}-savol`}
                    </div>
                    <div className="text-[11px] text-sky-200/90">
                      {joriySavol.soha || "Umumiy kimyo"} •{" "}
                      {joriySavol.turi === "ochiq"
                        ? "Ochiq masala"
                        : joriySavol.turi === "moslashtirish"
                        ? "Moslashtirish (A–F)"
                        : "Test savoli (A–D)"}
                    </div>
                  </div>
                </div>

                {/* Qayta ko'rish uchun belgilash (Flag) */}
                <button
                  onClick={belgiAlmash}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                    joriyBelgilangan
                      ? "bg-violet-500/30 border-violet-300 text-violet-100 shadow-sm"
                      : "bg-[#102260]/85 border-sky-400/35 text-sky-100 hover:text-white hover:bg-[#173287]"
                  }`}
                  title="Qayta ko'rib chiqish uchun belgilash"
                >
                  <Ikon nom="bayroq" olcham={14} />
                  <span className="hidden sm:inline">
                    {joriyBelgilangan ? "Belgilangan" : "Qayta ko'rish"}
                  </span>
                </button>
              </div>

              {/* Savol matni yoki rasmi */}
              <div className="space-y-3 flex-1">
                {/* Agar kontekst matn yoki rasm bo'lsa (masalan 33-35 savollar uchun umumiy kontekst) */}
                {(joriySavol.kontekstMatn || joriySavol.kontekstRasm) && (
                  <div className="ms-karta-ichki p-3.5 rounded-2xl space-y-2">
                    <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <Ikon nom="kitob" olcham={13} />
                      <span>Masala umumiy konteksti:</span>
                    </div>
                    {joriySavol.kontekstMatn && (
                      <div className="text-xs sm:text-sm leading-relaxed text-sky-50 font-serif">
                        <LatexBoyMatn matn={joriySavol.kontekstMatn} />
                      </div>
                    )}
                    {joriySavol.kontekstRasm && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={joriySavol.kontekstRasm}
                        alt="Kontekst rasm"
                        className="max-h-56 rounded-xl border border-sky-400/35 mx-auto cursor-zoom-in"
                        onClick={() => setZoomRasm(joriySavol.kontekstRasm)}
                      />
                    )}
                  </div>
                )}

                {/* Matnli savol */}
                {joriySavol.question && (
                  <div className="ms-karta-ichki text-sm sm:text-base leading-relaxed text-white font-serif p-4 rounded-2xl">
                    <LatexBoyMatn matn={joriySavol.question} />
                  </div>
                )}

                <SavolJadval jadval={joriySavol.jadval} />

                {/* Rasm ko'rinishidagi savol */}
                {joriySavol.rasm && (
                  <div className="relative group text-center py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={joriySavol.rasm}
                      alt={`Savol ${joriySavol.id}`}
                      className="max-h-80 sm:max-h-96 rounded-2xl border border-sky-400/40 mx-auto shadow-lg object-contain cursor-zoom-in group-hover:border-amber-300/70 transition"
                      onClick={() => setZoomRasm(joriySavol.rasm)}
                    />
                    <div className="mt-1 text-[11px] text-sky-200/85 inline-flex items-center gap-1 justify-center">
                      <Ikon nom="qidiruv" olcham={12} />
                      <span>Kattalashtirish</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ═══ INTERAKTIV JAVOB BERISH QISMI ═══ */}
              <div className="pt-2 border-t border-sky-400/25">
                {/* 1-HOLAT: OCHIQ SONLI MASALA (36-40) */}
                {joriySavol.turi === "ochiq" ? (
                  <div className="space-y-4">
                    <div className="ms-karta-ichki p-3.5 rounded-2xl text-xs text-sky-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Ikon nom="formula" olcham={14} />
                        <span>Ochiq sonli masala yo&apos;riqnomasi:</span>
                      </div>
                      <p className="leading-relaxed">
                        Masalani qoralama daftaringizda yeching va hosil bo&apos;lgan sonli qiymatni pastdagi maydonga kiriting. Vergul yoki nuqtadan foydalanishingiz mumkin.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="relative w-full max-w-xs flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={joriyJavob !== undefined ? String(joriyJavob) : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.,-]/g, "")
                            ochiqJavobYoz(val)
                          }}
                          placeholder="Masalan: 22.3 yoki 64"
                          className="w-full h-12 px-4 text-center font-mono font-bold text-xl rounded-2xl bg-[#091848] border-2 border-amber-300/70 focus:border-amber-300 text-white outline-none shadow-inner"
                        />
                        {joriySavol.birlik && (
                          <span className="shrink-0 px-3 py-2.5 rounded-xl bg-[#102260] border border-sky-400/40 text-amber-300 font-mono text-sm font-bold">
                            {joriySavol.birlik}
                          </span>
                        )}
                      </div>

                      {joriyJavob !== undefined && joriyJavob !== "" && (
                        <button
                          type="button"
                          onClick={() => ochiqJavobYoz("")}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Ikon nom="ochir" olcham={14} />
                          <span>O&apos;chirish</span>
                        </button>
                      )}
                    </div>

                    {/* Sensorli virtual raqamlar klaviaturasi */}
                    <div className="pt-2">
                      <VirtualSonlarKlaviatura
                        qiymat={joriyJavob !== undefined ? String(joriyJavob) : ""}
                        onChange={ochiqJavobYoz}
                        onTozalash={() => ochiqJavobYoz("")}
                      />
                    </div>
                  </div>
                ) : (
                  /* 2-HOLAT: VARIANTLI TEST (A-D YOKI A-F MOSLASHTIRISH) */
                  <div className="space-y-3">
                    {(() => {
                      const variantlar =
                        joriySavol.options ||
                        (joriySavol.turi === "moslashtirish"
                          ? MS_VARIANT_HARFLAR
                          : MS_VARIANT_HARFLAR.slice(0, 4))
                      return (
                        <>
                          <div className="text-xs text-sky-200 flex items-center justify-between">
                            <span>Javob variantini tanlang:</span>
                            <span className="hidden sm:inline text-[11px] text-sky-300/90">
                              Klaviaturadan [A]–[{MS_VARIANT_HARFLAR[Math.min(variantlar.length, MS_VARIANT_HARFLAR.length) - 1] || "D"}] tugmalarini bosishingiz mumkin
                            </span>
                          </div>

                          <div
                            className={`grid gap-2.5 ${
                              variantlar.length > 4
                                ? "grid-cols-2 sm:grid-cols-3"
                                : "grid-cols-1 sm:grid-cols-2"
                            }`}
                          >
                            {variantlar.map((variant, vIdx) => {
                              const isOptionIndex = Boolean(joriySavol.javobIndeks)
                              const isSelected = isOptionIndex
                                ? joriyJavob === vIdx
                                : joriyJavob === variant

                              const harf = MS_VARIANT_HARFLAR[vIdx] || variant
                              const label =
                                joriySavol.optionLabels && joriySavol.optionLabels[harf]
                                  ? joriySavol.optionLabels[harf]
                                  : null

                              return (
                                <button
                                  key={`${harf}-${vIdx}`}
                                  type="button"
                                  onClick={() => javobTanla(isOptionIndex ? vIdx : variant)}
                                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 active:scale-[0.98] ${
                                    isSelected
                                      ? "bg-gradient-to-r from-amber-400/25 via-yellow-400/20 to-amber-500/15 border-amber-300 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/40 text-white"
                                      : "bg-[#0d1f59]/90 hover:bg-[#132c7a]/95 border-sky-400/35 hover:border-amber-300/70 text-sky-50"
                                  }`}
                                >
                                  <span
                                    className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? "bg-gradient-to-br from-amber-300 to-yellow-400 text-slate-950 shadow-md shadow-amber-400/30"
                                        : "bg-sky-500/20 text-sky-100 border border-sky-400/45"
                                    }`}
                                  >
                                    {harf}
                                  </span>

                                  <div className="min-w-0 text-xs sm:text-sm font-medium">
                                    {label ? (
                                      <span className="font-semibold text-white">
                                        <LatexBoyMatn matn={String(label)} />
                                      </span>
                                    ) : isOptionIndex ? (
                                      <LatexBoyMatn matn={String(variant)} />
                                    ) : (
                                      <span>Variant {variant}</span>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Pastki navigatsiya tugmalari (Oldingi / Keyingi) */}
              <div className="pt-3 border-t border-sky-400/25 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
                  disabled={joriyIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition flex items-center gap-1.5"
                >
                  <Ikon nom="chap" olcham={15} />
                  <span>Oldingi savol</span>
                </button>

                <div className="text-xs text-sky-200 font-mono hidden sm:block">
                  {joriyIndex + 1} / {savollar.length}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))
                  }
                  disabled={joriyIndex === savollar.length - 1}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 border border-sky-400/55 shadow-md shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition flex items-center gap-1.5"
                >
                  <span>Keyingi savol</span>
                  <Ikon nom="ong" olcham={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="ms-karta p-8 rounded-3xl text-center text-sky-200">Savollar topilmadi.</div>
          )}
        </section>

        {/* ─── O'NG SIDEBAR: SAVOLLAR PALITRASI (DESKTOP) ─── */}
        <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col space-y-4">
          <div className="ms-karta p-4 sm:p-5 rounded-3xl space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-sky-400/25 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ikon nom="quiz" olcham={16} className="text-cyan-300" />
                <span>Savollar Xaritasi</span>
              </h3>
              <span className="text-xs font-mono text-amber-300 font-bold">
                {javobBerilganlarSoni}/{savollar.length}
              </span>
            </div>

            {/* Ranglar legendasi */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-sky-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-400/35 border border-emerald-300" />
                <span>Javob berilgan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-violet-400/35 border border-violet-300" />
                <span>Belgilangan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0e215e] border border-sky-400/45" />
                <span>Javobsiz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-300/30 border-2 border-amber-300" />
                <span>Hozirgi savol</span>
              </div>
            </div>

            {/* Savollar kataklari (1..30 yoki 1..40) */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {savollar.map((s, idx) => {
                const javobBor =
                  javoblar[s.id] !== undefined && javoblar[s.id] !== ""
                const isBelgilangan = Boolean(belgilar[s.id])
                const isCurrent = idx === joriyIndex

                let cellClass = "bg-[#0d1e57] border-sky-400/30 hover:border-sky-300/60 text-sky-100"
                if (javobBor) {
                  cellClass = "bg-emerald-500/25 border-emerald-400/75 text-emerald-200 font-bold shadow-sm shadow-emerald-500/10"
                }
                if (isBelgilangan) {
                  cellClass = "bg-violet-500/30 border-violet-300 text-violet-100 font-bold"
                }
                if (isCurrent) {
                  cellClass += " ring-2 ring-amber-300 border-amber-300 text-white"
                }

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setJoriyIndex(idx)}
                    className={`h-9 rounded-xl border font-mono text-xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative ${cellClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isBelgilangan && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-violet-300" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Hisobot xulosasi */}
            <div className="ms-karta-ichki p-3 rounded-2xl text-xs space-y-1.5 text-sky-100">
              <div className="flex justify-between">
                <span>Javob berildi:</span>
                <strong className="text-emerald-300 font-mono">{javobBerilganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Qayta ko&apos;rish:</span>
                <strong className="text-violet-200 font-mono">{belgilanganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Javobsiz:</span>
                <strong className="text-amber-300 font-mono">{qolganlarSoni} ta</strong>
              </div>
            </div>

            <button
              onClick={() => setTasdiqModali(true)}
              className="ms-tugma-oltin w-full py-2.5 rounded-xl border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Ikon nom="tasdiq" olcham={15} />
              <span>Testni yakunlash</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ─── 3. MOBIL SAVOLLAR XARITASI MODALI ─── */}
      {navigatsiyaModali && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="ms-karta w-full max-w-lg rounded-3xl p-5 space-y-4 text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sky-400/25 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Ikon nom="quiz" olcham={16} className="text-cyan-300" />
                <span>Savollar Palitrasi ({javobBerilganlarSoni}/{savollar.length})</span>
              </h3>
              <button
                onClick={() => setNavigatsiyaModali(false)}
                className="p-1.5 rounded-lg bg-[#102260] border border-sky-400/35 text-sky-100"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {savollar.map((s, idx) => {
                const javobBor =
                  javoblar[s.id] !== undefined && javoblar[s.id] !== ""
                const isBelgilangan = Boolean(belgilar[s.id])
                const isCurrent = idx === joriyIndex

                let cellClass = "bg-[#0d1e57] border-sky-400/30 text-sky-100"
                if (javobBor) cellClass = "bg-emerald-500/25 border-emerald-400/75 text-emerald-200 font-bold"
                if (isBelgilangan) cellClass = "bg-violet-500/30 border-violet-300 text-violet-100 font-bold"
                if (isCurrent) cellClass += " ring-2 ring-amber-300 border-amber-300 text-white"

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setJoriyIndex(idx)
                      setNavigatsiyaModali(false)
                    }}
                    className={`h-10 rounded-xl border font-mono text-xs flex items-center justify-center ${cellClass}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. YAKUNLASHNI TASDIQLASH MODALI ─── */}
      {tasdiqModali && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="ms-karta w-full max-w-md rounded-3xl p-6 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/55 flex items-center justify-center mx-auto text-xl">
              <Ikon nom="ogohlantirish" olcham={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">
                Testni yakunlaysizmi?
              </h3>
              <p className="text-xs text-sky-100/85">
                {imtihonInfo?.rejim === "jadval"
                  ? "Natija imtihon yakunida e'lon qilinadi."
                  : "Rasch IRT va oddiy ball hisoblanadi."}
              </p>
            </div>

            <div className="ms-karta-ichki p-3.5 rounded-2xl text-xs space-y-2 text-sky-100">
              <div className="flex justify-between">
                <span>Javob</span>
                <strong className="text-emerald-300 font-mono">{javobBerilganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Belgilangan</span>
                <strong className="text-violet-200 font-mono">{belgilanganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Javobsiz</span>
                <strong className="text-rose-300 font-mono">{qolganlarSoni} ta</strong>
              </div>
            </div>

            {qolganlarSoni > 0 && (
              <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-300/45 text-[11px] text-amber-100">
                <strong>{qolganlarSoni} ta</strong> savol javobsiz.
              </div>
            )}

            {xatoMatn && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/50 text-[11px] text-rose-100">
                {xatoMatn}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTasdiqModali(false)}
                className="py-2.5 rounded-xl bg-[#102260] hover:bg-[#173287] border border-sky-400/35 text-sky-100 text-xs font-semibold transition"
              >
                Davom etish
              </button>

              <button
                type="button"
                onClick={testniYakunla}
                disabled={yuborilmoqda}
                className="ms-tugma-oltin py-2.5 rounded-xl border border-amber-200 disabled:opacity-60 font-bold text-xs"
              >
                {yuborilmoqda ? "Hisoblanmoqda..." : "Yakunlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. KIMYO JADVALLARI MODALI ─── */}
      <KimyoJadvallarModal
        ochiq={jadvallarModali}
        onYopish={() => setJadvallarModali(false)}
      />

      {/* ─── 6. LIGHTBOX ZOOM MODALI ─── */}
      {zoomRasm && (
        <div
          onClick={() => setZoomRasm(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomRasm}
            alt="Kattalashtirilgan rasm"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-blue-800"
          />
        </div>
      )}
    </main>
  )
}
