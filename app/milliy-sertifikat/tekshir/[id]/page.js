// app/milliy-sertifikat/tekshir/[id]/page.js
"use client"

import { use, useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Ikon from "@/components/Ikon"
import { TAYYORGARLIK_OGOHLANTIRISH } from "@/lib/milliy-sertifikat-data"

export default function SertifikatTekshirishSahifasi({ params }) {
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params
  const certId = (unwrappedParams?.id || "JDA-MS-2026-00000").trim().toUpperCase()

  const [bazaMalumot, setBazaMalumot] = useState(null)
  const [yaroqli, setYaroqli] = useState(false)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    let bekor = false
    async function tekshir() {
      try {
        const res = await fetch(`/api/sertifikat/${certId}`)
        if (res.ok) {
          const d = await res.json()
          if (!bekor && d?.certificate) {
            setBazaMalumot(d.certificate)
            setYaroqli(Boolean(d.valid))
          }
        }
      } catch {}
      if (!bekor) setYuklanmoqda(false)
    }
    tekshir()
    return () => {
      bekor = true
    }
  }, [certId])

  // Description ichidagi qo'shimcha parametrlar
  const extra = useMemo(() => {
    if (!bazaMalumot?.description) return null
    try {
      return JSON.parse(bazaMalumot.description)
    } catch {
      return null
    }
  }, [bazaMalumot])

  // Nega alohida holat: avval sahifa bazada YO'Q raqamni ham "haqiqiy" deb
  // ko'rsatardi. Tasdiq faqat bazadagi yaroqli yozuvdan chiqadi.
  if (yuklanmoqda || !bazaMalumot || !yaroqli) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: "var(--v3-fon)", color: "var(--v3-matn)" }}
      >
        <p className="text-sm font-mono">{certId}</p>
        <p className="text-base font-bold">
          {yuklanmoqda
            ? "Tekshirilmoqda..."
            : bazaMalumot
              ? "Bu sertifikat endi amalda emas"
              : "Bunday raqamli sertifikat topilmadi"}
        </p>
        <Link href="/milliy-sertifikat" className="text-sm underline">
          Sinovlar sahifasiga qaytish
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between p-4 sm:p-6"
    >
      {/* Fon nurlari */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-blue-900/50 pb-4 relative z-10">
        <Link
          href="/milliy-sertifikat"
          className="inline-flex items-center gap-2 text-xs text-blue-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-blue-950/50 border border-blue-800/60"
        >
          <Ikon nom="chap" olcham={16} />
          <span>Milliy sertifikat markaziga</span>
        </Link>

        <div className="text-xs font-mono text-yellow-300">
          JDA Kimyo Tekshiruvi
        </div>
      </header>

      {/* Asosiy Tasdiq Kartasi */}
      <div className="max-w-2xl mx-auto w-full my-8 relative z-10 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-[#0c1b42]/95 via-[#081538]/95 to-[#040a20]/95 shadow-2xl relative overflow-hidden text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl shadow-lg">
            <Ikon nom="tasdiq" olcham={32} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              JDA Kimyo Bazasida Topildi
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sertifikat Haqiqiy va Faol
            </h1>
            <p className="text-xs text-blue-200/80 max-w-md mx-auto">
              Ushbu natija JDA Kimyo platformasida Georg Rasch IRT modeli asosida qayd etilgan.
            </p>
          </div>

          {/* Sertifikat Ma'lumotlari Jadvali */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
              <span className="text-blue-300">Sertifikat Raqami:</span>
              <strong className="text-yellow-300 font-mono font-bold">{certId}</strong>
            </div>

            {bazaMalumot?.fullName && (
              <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
                <span className="text-blue-300">Sertifikat Egasi:</span>
                <strong className="text-white font-bold">{bazaMalumot.fullName}</strong>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
              <span className="text-blue-300">Fan:</span>
              <strong className="text-white">Kimyo</strong>
            </div>

            <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
              <span className="text-blue-300">Baholash Modeli:</span>
              <span className="text-cyan-300 font-semibold">Georg Rasch IRT</span>
            </div>

            {bazaMalumot?.grade && (
              <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
                <span className="text-blue-300">Taxminiy Daraja:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-extrabold text-xs">
                  {bazaMalumot.grade} daraja ({bazaMalumot.score || 0} ball)
                </span>
              </div>
            )}

            {extra?.theta !== undefined && (
              <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
                <span className="text-blue-300">Rasch Logiti (&theta;):</span>
                <span className="font-mono text-yellow-300 font-bold">
                  {extra.theta > 0 ? `+${extra.theta}` : extra.theta} &plusmn; {extra.se || 0.35} logit
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
              <span className="text-blue-300">Sertifikat Holati:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                ✓ Faol (Amalda)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-blue-300">Amal qilish muddati:</span>
              <strong className="text-white font-mono">
                {bazaMalumot.expiresAt
                  ? new Date(bazaMalumot.expiresAt).toLocaleDateString("uz-UZ")
                  : "Muddatsiz"}
              </strong>
            </div>
          </div>

          {/* Qonuniy Imtiyozlar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/10 border border-yellow-500/30 text-left space-y-1.5 text-xs text-blue-100">
            <div className="flex items-center gap-2 text-yellow-300 font-bold">
              <Ikon nom="sertifikat" olcham={15} />
              <span>Muhim:</span>
            </div>
            <p className="leading-relaxed">
              {TAYYORGARLIK_OGOHLANTIRISH}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              href="/milliy-sertifikat"
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-xs font-semibold text-blue-200 hover:text-white transition flex items-center gap-2"
            >
              <Ikon nom="atom" olcham={14} />
              <span>O&apos;z bilimingizni tekshirib ko&apos;ring</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-blue-300/70 border-t border-blue-900/40 pt-4 relative z-10">
        JDA KIMYO &copy; 2026. Milliy sertifikatga tayyorgarlik platformasi.
      </footer>
    </main>
  )
}
