// app/milliy-sertifikat/[slug]/page.js
"use client"

import { useState, useEffect, useRef, useCallback, useMemo, use } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Ikon from "@/components/Ikon"
import {
  MILLIY_SERTIFIKAT_VARIANTLARI,
  SERTIFIKAT_DARAJALARI
} from "@/lib/milliy-sertifikat-data"
import {
  getSavollarBySlug,
  tekshirJavob
} from "@/data/milliy-sertifikat/savollar-ombromi"
import {
  hisoblaRaschTheta,
  tuzWrightMap
} from "@/lib/rasch-model"
import { hisoblaYakuniyNatija } from "@/lib/milliy-sertifikat-boshqaruvchi"
import { yuklabOlishMilliySertifikatPDF } from "@/lib/milliy-sertifikat-pdf"
import KimyoJadvallarModal from "@/components/milliy-sertifikat/KimyoJadvallarModal"
import VirtualSonlarKlaviatura from "@/components/milliy-sertifikat/VirtualSonlarKlaviatura"
import RaschWrightMap from "@/components/milliy-sertifikat/RaschWrightMap"

function soniyaFormat(s) {
  const m = Math.floor(s / 60)
  const qolganS = s % 60
  return `${m.toString().padStart(2, "0")}:${qolganS.toString().padStart(2, "0")}`
}

export default function MilliySertifikatTestXonasi({ params }) {
  const router = useRouter()
  // Next.js 15/16 params unwrap
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params
  const slug = unwrappedParams?.slug || "rasch-diagnostika"

  const { data: session } = useSession()
  const [foydalanuvchiIsmi, setFoydalanuvchiIsmi] = useState("")
  useEffect(() => {
    if (session?.user?.name && !foydalanuvchiIsmi) {
      setFoydalanuvchiIsmi(session.user.name)
    }
  }, [session, foydalanuvchiIsmi])

  // Test ma'lumotlari
  const testInfo = useMemo(() => {
    return (
      MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug) ||
      MILLIY_SERTIFIKAT_VARIANTLARI[0]
    )
  }, [slug])

  // Savollar to'plami
  const savollar = useMemo(() => {
    return getSavollarBySlug(slug)
  }, [slug])

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
  useEffect(() => {
    javoblarRef.current = javoblar
  }, [javoblar])

  // LocalStorage kalitlari
  const storageKalit = `jda_ms_test_${slug}`
  const timerKalit = `jda_ms_start_${slug}`

  // 1. Dastlabki yuklash: LocalStorage'dan tiklash
  useEffect(() => {
    try {
      const saqlangan = localStorage.getItem(storageKalit)
      if (saqlangan) {
        const parsed = JSON.parse(saqlangan)
        if (parsed.javoblar) setJavoblar(parsed.javoblar)
        if (parsed.belgilar) setBelgilar(parsed.belgilar)
      }

      let startTs = localStorage.getItem(timerKalit)
      if (!startTs || isNaN(parseInt(startTs, 10))) {
        startTs = Date.now().toString()
        localStorage.setItem(timerKalit, startTs)
      }

      const elapsed = Math.max(0, Math.floor((Date.now() - parseInt(startTs, 10)) / 1000))
      const qolgan = Math.max(0, limitSoniya - elapsed)
      setQolganVaqt(qolgan)

      if (qolgan <= 0) {
        testniYakunla()
      }
    } catch {
      // ignore
    }
  }, [slug, limitSoniya])

  // Javoblar va belgilar o'zgarganda saqlash
  useEffect(() => {
    if (yakunlandi) return
    try {
      localStorage.setItem(
        storageKalit,
        JSON.stringify({ javoblar, belgilar })
      )
    } catch {
      // ignore
    }
  }, [javoblar, belgilar, storageKalit, yakunlandi])

  // 2. Taymer hisobi
  useEffect(() => {
    if (yakunlandi) return

    const interval = setInterval(() => {
      setQolganVaqt((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          testniYakunla()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [yakunlandi])

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
          if (typeof joriy?.correct === "number") {
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

  // 6. Testni yakunlash va Rasch IRT baholash
  const testniYakunla = () => {
    const oxirgiJavoblar = javoblarRef.current || {}

    // Sarflangan vaqt
    let sarflanganVaqt = limitSoniya - qolganVaqt
    try {
      const startTs = localStorage.getItem(timerKalit)
      if (startTs) {
        sarflanganVaqt = Math.floor((Date.now() - parseInt(startTs, 10)) / 1000)
      }
    } catch {}

    // Tozalash
    try {
      localStorage.removeItem(storageKalit)
      localStorage.removeItem(timerKalit)
    } catch {}

    // To'liq Rasch IRT va BMBA boshqaruvchi hisobi
    const aniqIsm = (foydalanuvchiIsmi || session?.user?.name || "Ishtirokchi").trim()
    const yakuniy = hisoblaYakuniyNatija(savollar, oxirgiJavoblar, sarflanganVaqt, {
      ism: aniqIsm,
    })

    if (yakuniy?.sertifikat) {
      try {
        fetch("/api/milliy-sertifikat/saqlash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            certId: yakuniy.sertifikat.certId,
            fullName: aniqIsm,
            daraja: yakuniy.daraja,
            shkalaBalli: yakuniy.shkalaBalli,
            theta: yakuniy.theta,
            se: yakuniy.se,
            infitMnsq: yakuniy.infitMnsq,
            outfitMnsq: yakuniy.outfitMnsq,
            rawScore: yakuniy.rawScore,
            jamiSavollar: yakuniy.jamiSavollar,
            sarflanganVaqt,
            examSlug: slug,
            examName: testInfo?.nom,
            imtiyoz: yakuniy.imtiyoz,
          }),
        }).catch(() => {})
      } catch {}
    }

    setNatija({
      ...yakuniy,
      rawScore: yakuniy.rawScore,
      total: yakuniy.jamiSavollar,
      topshirilganVaqt: new Date().toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      savollarSoni: savollar.length,
    })

    setTasdiqModali(false)
    setYakunlandi(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
      <main
        style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between p-4 sm:p-6"
      >
        {/* Fon nurlari */}
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-900/50 pb-4">
            <Link
              href="/milliy-sertifikat"
              className="inline-flex items-center gap-2 text-xs text-blue-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-blue-950/50 border border-blue-800/60"
            >
              <Ikon nom="chap" olcham={16} />
              <span>Milliy sertifikat markaziga qaytish</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/60 text-xs font-semibold text-blue-200 hover:text-white transition flex items-center gap-1.5"
              >
                <Ikon nom="fayl" olcham={14} />
                <span>Natijani chop etish</span>
              </button>
            </div>
          </div>

          {/* ═══ RASMIY SERTIFIKAT BANNERI ═══ */}
          <div className="p-4 sm:p-8 rounded-3xl border-2 border-yellow-500/40 bg-gradient-to-br from-[#101b4b]/95 via-[#0b163d]/95 to-[#060c25]/95 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-yellow-500/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-bold">
                  <Ikon nom="sertifikat" olcham={16} />
                  <span>JDA KIMYO • Georg Rasch IRT &amp; BMBA Baholash Tizimi</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Milliy Sertifikat Sinov Natijasi
                </h1>

                <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed">
                  {testInfo.nom}. Psixometrik tahlil va Wright Map algoritmlari yordamida bilimingiz logit o&apos;lchovida tasdiqlandi.
                </p>

                <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-xs space-y-1 text-blue-200">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Ikon nom="kubok" olcham={14} />
                    <span>Davlat Standarti Imtiyozi:</span>
                  </div>
                  <p>{natija.imtiyoz}</p>
                </div>

                {/* Ism-familiya kiritish va tahrirlash */}
                {natija.sertifikat && (
                  <div className="p-3 rounded-2xl bg-blue-950/70 border border-blue-800/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-blue-300 font-semibold flex items-center gap-1.5">
                        <Ikon nom="odam" olcham={13} />
                        <span>Sertifikatda chop etiladigan F.I.SH. (Ism va familiya):</span>
                      </span>
                      <span className="text-[10px] text-yellow-300/80 font-mono">Rasmiy hujjat</span>
                    </div>
                    <input
                      type="text"
                      value={natija.sertifikat.fullName || ""}
                      onChange={(e) => {
                        const yangi = e.target.value
                        setFoydalanuvchiIsmi(yangi)
                        setNatija((prev) => ({
                          ...prev,
                          sertifikat: { ...prev.sertifikat, fullName: yangi },
                        }))
                      }}
                      onBlur={() => {
                        if (natija?.sertifikat) {
                          fetch("/api/milliy-sertifikat/saqlash", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              certId: natija.sertifikat.certId,
                              fullName: natija.sertifikat.fullName,
                              daraja: natija.daraja,
                              shkalaBalli: natija.shkalaBalli,
                              theta: natija.theta,
                              se: natija.se,
                              infitMnsq: natija.infitMnsq,
                              outfitMnsq: natija.outfitMnsq,
                              rawScore: natija.rawScore,
                              jamiSavollar: natija.jamiSavollar,
                              sarflanganVaqt: natija.sarflanganVaqt,
                              examSlug: slug,
                              examName: testInfo?.nom,
                              imtiyoz: natija.imtiyoz,
                            }),
                          }).catch(() => {})
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#060e28] border border-blue-700/60 text-white font-serif text-sm focus:outline-none focus:border-yellow-400 placeholder:text-blue-400/50"
                      placeholder="Masalan: Jabborov Diyorbek Bahodir o'g'li"
                    />
                  </div>
                )}

                {/* Sertifikat PDF Yuklab Olish va QR Reestr Tekshiruvi */}
                {natija.sertifikat ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => yuklabOlishMilliySertifikatPDF(natija.sertifikat)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-yellow-300"
                    >
                      <Ikon nom="sertifikat" olcham={16} />
                      <span>Rasmiy Sertifikatni Yuklab Olish (PDF)</span>
                    </button>

                    <Link
                      href={`/milliy-sertifikat/tekshir/${natija.sertifikat.certId}`}
                      target="_blank"
                      className="text-xs text-yellow-300/90 hover:text-white underline underline-offset-4 flex items-center justify-center gap-1 font-mono py-1"
                    >
                      <span>QR tekshiruv: {natija.sertifikat.certId}</span>
                      <Ikon nom="tashqi" olcham={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs text-rose-300/90 pt-1">
                    Sertifikat olish uchun kamida 46% (32.2 ball) to&apos;plash talab etiladi.
                  </div>
                )}
              </div>

              {/* Daraja va Ball Badji */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-yellow-400/50 bg-[#09153a]/90 shadow-xl min-w-[200px] text-center shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400">
                  Sertifikat Darajasi
                </span>
                <div className="text-5xl font-black text-white mt-1 bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  {natija.daraja}
                </div>
                <div className="text-sm font-bold text-yellow-200 mt-1">
                  {natija.darajaNomi}
                </div>

                <div className="mt-4 pt-3 border-t border-blue-800/80 w-full space-y-1 text-xs">
                  <div className="flex justify-between text-blue-300">
                    <span>BMBA shkalasi:</span>
                    <strong className="text-white font-mono">{natija.shkalaBalli} / 70 ball</strong>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>To&apos;g&apos;ri javoblar:</span>
                    <strong className="text-emerald-400 font-mono">
                      {natija.rawScore} / {natija.total} ({natija.foiz}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Sarflangan vaqt:</span>
                    <strong className="text-cyan-300 font-mono">
                      {soniyaFormat(natija.sarflanganVaqt || 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vkladkalar: Wright Map vs Batafsil Savollar Tahlili */}
          <div className="flex items-center gap-2 border-b border-blue-900/60 pb-3">
            <button
              onClick={() => setNatijaVkladka("xarita")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                natijaVkladka === "xarita"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-900/40 border border-transparent"
              }`}
            >
              <Ikon nom="grafik" olcham={14} />
              <span>Rasch &amp; Wright Map Ilmiy Tahlili</span>
            </button>

            <button
              onClick={() => setNatijaVkladka("savollar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                natijaVkladka === "savollar"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-900/40 border border-transparent"
              }`}
            >
              <Ikon nom="quiz" olcham={14} />
              <span>Barcha Savollar Tahlili ({natija.rawScore}/{natija.total})</span>
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
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setSavolFiltr("all")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    savolFiltr === "all"
                      ? "bg-blue-800 text-white border-blue-600"
                      : "bg-blue-950/40 text-blue-300 border-blue-900"
                  }`}
                >
                  Barcha savollar ({savollar.length})
                </button>
                <button
                  onClick={() => setSavolFiltr("togri")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    savolFiltr === "togri"
                      ? "bg-emerald-800 text-emerald-100 border-emerald-600"
                      : "bg-emerald-950/30 text-emerald-300 border-emerald-900/60"
                  }`}
                >
                  ✓ To&apos;g&apos;ri ({natija.rawScore})
                </button>
                <button
                  onClick={() => setSavolFiltr("xato")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    savolFiltr === "xato"
                      ? "bg-rose-800 text-rose-100 border-rose-600"
                      : "bg-rose-950/30 text-rose-300 border-rose-900/60"
                  }`}
                >
                  ✕ Xato yoki belgilanmagan ({natija.total - natija.rawScore})
                </button>
              </div>

              {/* Savollar ro'yxati */}
              <div className="space-y-4">
                {savollar
                  .map((s, index) => {
                    const berilgan = javoblar[s.id]
                    const togri = tekshirJavob(s, berilgan)
                    return { s, index, berilgan, togri }
                  })
                  .filter(({ togri }) => {
                    if (savolFiltr === "togri") return togri
                    if (savolFiltr === "xato") return !togri
                    return true
                  })
                  .map(({ s, index, berilgan, togri }) => {
                    return (
                      <div
                        key={s.id}
                        className={`p-5 rounded-3xl border transition ${
                          togri
                            ? "bg-[#091834]/80 border-emerald-500/40"
                            : "bg-[#180e22]/80 border-rose-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-blue-900/40 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                                togri
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              {s.id}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {s.mavzu || `${index + 1}-savol`}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-200">
                              {s.soha}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-blue-300">
                              Qiyinlik: {s.qiyinlik > 0 ? `+${s.qiyinlik}` : s.qiyinlik} logit
                            </span>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                togri
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              {togri ? "✓ To'g'ri" : "✕ Xato"}
                            </span>
                          </div>
                        </div>

                        {/* Savol matni yoki rasmi */}
                        <div className="py-3 text-xs sm:text-sm text-blue-100">
                          {s.question && (
                            <p className="whitespace-pre-line leading-relaxed font-serif">
                              {s.question}
                            </p>
                          )}
                          {s.rasm && (
                            <div className="mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={s.rasm}
                                alt={`Savol ${s.id}`}
                                className="max-h-72 rounded-xl border border-blue-900/60 mx-auto cursor-zoom-in"
                                onClick={() => setZoomRasm(s.rasm)}
                              />
                            </div>
                          )}
                        </div>

                        {/* Javoblar tahlili */}
                        <div className="p-3 rounded-2xl bg-blue-950/50 border border-blue-900/60 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300">Sizning javobingiz:</span>
                            <strong
                              className={`font-mono text-sm ${
                                togri ? "text-emerald-400" : "text-rose-400"
                              }`}
                            >
                              {berilgan !== undefined && berilgan !== ""
                                ? String(berilgan)
                                : "Javob berilmagan"}
                            </strong>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-blue-300">To&apos;g&apos;ri javob:</span>
                            <strong className="text-emerald-400 font-mono text-sm">
                              {typeof s.correct === "number" && s.options
                                ? `${["A", "B", "C", "D"][s.correct]} (${s.options[s.correct]})`
                                : String(s.correct)}
                            </strong>
                          </div>

                          {s.explanation && (
                            <div className="mt-2 pt-2 border-t border-blue-900/50 text-[11px] text-blue-200/90 leading-relaxed">
                              <span className="font-bold text-yellow-300">Ilmiy izoh: </span>
                              {s.explanation}
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
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-blue-900/60">
            <button
              onClick={() => {
                setYakunlandi(false)
                setNatija(null)
                setJavoblar({})
                setBelgilar({})
                setQolganVaqt(limitSoniya)
                setJoriyIndex(0)
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Ikon nom="qayta" olcham={16} />
              <span>Qaytadan topshirish</span>
            </button>

            <Link
              href="/milliy-sertifikat"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-800 text-blue-200 hover:text-white text-xs font-semibold transition text-center"
            >
              Boshqa variantlarni tanlash →
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

  // ═════════════════════════════════════════════════════════════════════
  // ─── CBT SIMULYATOR TEST ISHLASH INTERFEYSI ───
  // ═════════════════════════════════════════════════════════════════════
  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between select-none"
    >
      {/* Fon nurlari */}
      <div className="absolute top-0 left-1/3 w-[36rem] h-[36rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. STICKY TOP BOSHQARUV PANELI ─── */}
      <header className="sticky top-0 z-40 border-b border-blue-900/60 bg-[#070c29]/90 backdrop-blur-xl shadow-lg">
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
              className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-200 hover:text-white transition"
              title="Chiqish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>

            <button
              onClick={() => setNavigatsiyaModali(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-xs font-bold text-white transition flex items-center gap-1.5"
              title="Barcha savollar xaritasi"
            >
              <span className="text-yellow-400">☰</span>
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
                  ? "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse"
                  : qolganVaqt <= 600
                  ? "bg-amber-950/80 border-amber-500 text-amber-300"
                  : "bg-blue-950/80 border-blue-700/60 text-white"
              }`}
            >
              <Ikon nom="soat" olcham={16} />
              <span>{soniyaFormat(qolganVaqt)}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-blue-300">
              <div className="w-24 h-2 rounded-full bg-blue-950 overflow-hidden border border-blue-800">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${progressFoiz}%` }}
                />
              </div>
              <span className="font-mono">{progressFoiz}%</span>
            </div>
          </div>

          {/* O'ng: Yordamchi Jadvallar & Yakunlash */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setJadvallarModali(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/60 text-xs font-semibold text-blue-200 hover:text-white transition flex items-center gap-1.5"
              title="Mendeleyev va Eruvchanlik jadvallari"
            >
              <Ikon nom="atom" olcham={15} />
              <span className="hidden sm:inline">Jadvallar</span>
            </button>

            <button
              onClick={() => setTasdiqModali(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
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
            <div className="p-3.5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0e163d]/90 via-[#0a1438]/90 to-[#060c26]/90 border border-blue-800/60 shadow-2xl flex flex-col justify-between flex-1 space-y-5">
              {/* Savol bosh qatori */}
              <div className="flex items-center justify-between gap-3 border-b border-blue-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-bold text-sm flex items-center justify-center font-mono">
                    #{joriySavol.id}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {joriySavol.mavzu || `${joriyIndex + 1}-savol`}
                    </div>
                    <div className="text-[11px] text-blue-300/80">
                      {joriySavol.soha || "Umumiy kimyo"} • Rasch: {joriySavol.qiyinlik > 0 ? `+${joriySavol.qiyinlik}` : joriySavol.qiyinlik} logit
                    </div>
                  </div>
                </div>

                {/* Qayta ko'rish uchun belgilash (Flag) */}
                <button
                  onClick={belgiAlmash}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                    joriyBelgilangan
                      ? "bg-purple-500/25 border-purple-400 text-purple-200 shadow-sm"
                      : "bg-blue-950/40 border-blue-800/50 text-blue-300 hover:text-white hover:bg-blue-900/40"
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
                {/* Agar kontekst rasm bo'lsa (masalan 33-35 savollar uchun umumiy matn) */}
                {joriySavol.kontekstRasm && (
                  <div className="p-2 rounded-2xl bg-blue-950/40 border border-blue-900/50">
                    <div className="text-[11px] font-semibold text-yellow-300 mb-1 flex items-center gap-1">
                      <Ikon nom="kitob" olcham={13} />
                      <span>Masala umumiy konteksti (33–35):</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={joriySavol.kontekstRasm}
                      alt="Kontekst rasm"
                      className="max-h-56 rounded-xl border border-blue-900/60 mx-auto cursor-zoom-in"
                      onClick={() => setZoomRasm(joriySavol.kontekstRasm)}
                    />
                  </div>
                )}

                {/* Matnli savol */}
                {joriySavol.question && (
                  <div className="text-sm sm:text-base leading-relaxed text-blue-50 font-serif whitespace-pre-line p-3 rounded-2xl bg-blue-950/30 border border-blue-900/40">
                    {joriySavol.question}
                  </div>
                )}

                {/* Rasm ko'rinishidagi savol */}
                {joriySavol.rasm && (
                  <div className="relative group text-center py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={joriySavol.rasm}
                      alt={`Savol ${joriySavol.id}`}
                      className="max-h-80 sm:max-h-96 rounded-2xl border border-blue-800/60 mx-auto shadow-lg object-contain cursor-zoom-in group-hover:border-yellow-400/50 transition"
                      onClick={() => setZoomRasm(joriySavol.rasm)}
                    />
                    <div className="mt-1 text-[11px] text-blue-400/80">
                      🔍 Rasmni kattalashtirish uchun ustiga bosing
                    </div>
                  </div>
                )}
              </div>

              {/* ═══ INTERAKTIV JAVOB BERISH QISMI ═══ */}
              <div className="pt-2 border-t border-blue-900/60">
                {/* 1-HOLAT: OCHIQ SONLI MASALA (BMBA 36-40) */}
                {joriySavol.turi === "ochiq" ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-yellow-300">
                        <Ikon nom="formula" olcham={14} />
                        <span>Ochiq sonli masala yo&apos;riqnomasi:</span>
                      </div>
                      <p className="leading-relaxed">
                        Masalani qoralama daftaringizda yeching va hosil bo&apos;lgan sonli qiymatni pastdagi maydonga kiriting. Vergul yoki nuqtadan foydalanishingiz mumkin.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={joriyJavob !== undefined ? String(joriyJavob) : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.,-]/g, "")
                            ochiqJavobYoz(val)
                          }}
                          placeholder="Masalan: 22.3 yoki 64"
                          className="w-full h-12 px-4 text-center font-mono font-bold text-xl rounded-2xl bg-blue-950 border-2 border-yellow-400/60 focus:border-yellow-400 text-white outline-none shadow-inner"
                        />
                      </div>

                      {joriyJavob !== undefined && joriyJavob !== "" && (
                        <button
                          type="button"
                          onClick={() => ochiqJavobYoz("")}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold transition flex items-center gap-1"
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
                    <div className="text-xs text-blue-300 flex items-center justify-between">
                      <span>Javob variantini tanlang:</span>
                      <span className="hidden sm:inline text-[11px] text-blue-400">
                        Klaviaturadan [A], [B], [C], [D] tugmalarini bosishingiz mumkin
                      </span>
                    </div>

                    <div
                      className={`grid gap-2.5 ${
                        (joriySavol.options || []).length > 4
                          ? "grid-cols-2 sm:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2"
                      }`}
                    >
                      {(joriySavol.options || ["A", "B", "C", "D"]).map(
                        (variant, vIdx) => {
                          const isOptionIndex = typeof joriySavol.correct === "number"
                          const isSelected = isOptionIndex
                            ? joriyJavob === vIdx
                            : joriyJavob === variant

                          const harflar = ["A", "B", "C", "D", "E", "F"]
                          const harf = harflar[vIdx] || variant
                          const label =
                            joriySavol.optionLabels && joriySavol.optionLabels[harf]
                              ? joriySavol.optionLabels[harf]
                              : null

                          return (
                            <button
                              key={variant}
                              type="button"
                              onClick={() => javobTanla(isOptionIndex ? vIdx : variant)}
                              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 active:scale-[0.98] ${
                                isSelected
                                  ? "bg-gradient-to-r from-yellow-500/25 to-amber-500/15 border-yellow-400 shadow-md ring-2 ring-yellow-400/30 text-white"
                                  : "bg-blue-950/50 hover:bg-blue-900/40 border-blue-800/60 text-blue-100"
                              }`}
                            >
                              <span
                                className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-yellow-400 text-slate-950 shadow-sm"
                                    : "bg-blue-900/60 text-blue-200 border border-blue-700/60"
                                }`}
                              >
                                {harf}
                              </span>

                              <div className="min-w-0 text-xs sm:text-sm font-medium">
                                {label ? (
                                  <span>
                                    {harf}) <strong className="font-mono text-yellow-200">{label}</strong>
                                  </span>
                                ) : isOptionIndex ? (
                                  <span>{variant}</span>
                                ) : (
                                  <span>Variant {variant}</span>
                                )}
                              </div>
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pastki navigatsiya tugmalari (Oldingi / Keyingi) */}
              <div className="pt-3 border-t border-blue-900/60 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
                  disabled={joriyIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition flex items-center gap-1.5"
                >
                  <Ikon nom="chap" olcham={15} />
                  <span>Oldingi savol</span>
                </button>

                <div className="text-xs text-blue-300 font-mono hidden sm:block">
                  {joriyIndex + 1} / {savollar.length}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))
                  }
                  disabled={joriyIndex === savollar.length - 1}
                  className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 border border-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition flex items-center gap-1.5"
                >
                  <span>Keyingi savol</span>
                  <Ikon nom="ong" olcham={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-blue-300">Savollar topilmadi.</div>
          )}
        </section>

        {/* ─── O'NG SIDEBAR: SAVOLLAR PALITRASI (DESKTOP) ─── */}
        <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0d163c]/90 to-[#070f2b]/90 border border-blue-800/60 shadow-xl space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ikon nom="quiz" olcham={16} />
                <span>Savollar Xaritasi</span>
              </h3>
              <span className="text-xs font-mono text-yellow-300">
                {javobBerilganlarSoni}/{savollar.length}
              </span>
            </div>

            {/* Ranglar legendasi */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-200">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-400" />
                <span>Javob berilgan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-500/30 border border-purple-400" />
                <span>Belgilangan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-950 border border-blue-800" />
                <span>Javobsiz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-yellow-400/20 border-2 border-yellow-400" />
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

                let cellClass = "bg-blue-950/60 border-blue-900 text-blue-300"
                if (javobBor) {
                  cellClass = "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold"
                }
                if (isBelgilangan) {
                  cellClass = "bg-purple-500/25 border-purple-400 text-purple-200 font-bold"
                }
                if (isCurrent) {
                  cellClass += " ring-2 ring-yellow-400 border-yellow-400 text-white"
                }

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setJoriyIndex(idx)}
                    className={`h-9 rounded-xl border font-mono text-xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative ${cellClass}`}
                  >
                    <span>{s.id}</span>
                    {isBelgilangan && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Hisobot xulosasi */}
            <div className="p-3 rounded-2xl bg-blue-950/50 border border-blue-900/60 text-xs space-y-1.5 text-blue-200">
              <div className="flex justify-between">
                <span>Javob berildi:</span>
                <strong className="text-emerald-400 font-mono">{javobBerilganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Qayta ko&apos;rish:</span>
                <strong className="text-purple-300 font-mono">{belgilanganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Javobsiz:</span>
                <strong className="text-amber-400 font-mono">{qolganlarSoni} ta</strong>
              </div>
            </div>

            <button
              onClick={() => setTasdiqModali(true)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
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
          <div className="w-full max-w-lg bg-[#0a1338] border border-blue-800 rounded-3xl p-5 space-y-4 text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Ikon nom="quiz" olcham={16} />
                <span>Savollar Palitrasi ({javobBerilganlarSoni}/{savollar.length})</span>
              </h3>
              <button
                onClick={() => setNavigatsiyaModali(false)}
                className="p-1.5 rounded-lg bg-blue-950 text-blue-200"
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

                let cellClass = "bg-blue-950/60 border-blue-900 text-blue-300"
                if (javobBor) cellClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                if (isBelgilangan) cellClass = "bg-purple-500/25 border-purple-400 text-purple-200 font-bold"
                if (isCurrent) cellClass += " ring-2 ring-yellow-400 border-yellow-400 text-white"

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
                    {s.id}
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
          <div className="w-full max-w-md bg-[#0a1338] border border-blue-700/60 rounded-3xl p-6 space-y-4 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-yellow-300 border border-yellow-500/40 flex items-center justify-center mx-auto text-xl">
              <Ikon nom="ogohlantirish" olcham={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">
                Testni rostdan ham yakunlaysizmi?
              </h3>
              <p className="text-xs text-blue-200/80">
                Yakunlaganingizdan so&apos;ng Georg Rasch IRT modeli bo&apos;yicha bilim darajangiz (θ) va sertifikat darajangiz hisoblanadi.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-900/60 text-xs space-y-2 text-blue-200">
              <div className="flex justify-between">
                <span>Javob berilgan:</span>
                <strong className="text-emerald-400 font-mono">{javobBerilganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Qayta ko&apos;rish uchun belgilangan:</span>
                <strong className="text-purple-300 font-mono">{belgilanganlarSoni} ta</strong>
              </div>
              <div className="flex justify-between">
                <span>Javob berilmagan:</span>
                <strong className="text-rose-400 font-mono">{qolganlarSoni} ta</strong>
              </div>
            </div>

            {qolganlarSoni > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                Diqqat: Sizda hali <strong>{qolganlarSoni} ta</strong> javobsiz savol mavjud.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTasdiqModali(false)}
                className="py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-200 text-xs font-semibold transition"
              >
                Davom ettirish
              </button>

              <button
                type="button"
                onClick={testniYakunla}
                className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Ha, yakunlash
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
