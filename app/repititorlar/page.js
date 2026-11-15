"use client"

import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"
import RepititorXarita from "@/components/RepititorXarita"
import {
  HUDUDLAR_XARITA,
  FAN_TURLARI,
  masofaKm,
  masofaFormatla,
  engYaqinHududId,
} from "@/lib/repititor-baza"

export default function RepititorlarSahifa() {
  const [repititorlar, setRepititorlar] = useState([])
  const [foydalanuvchi, setFoydalanuvchi] = useState({
    kirganmi: false,
    id: null,
    ism: "",
    username: "",
    superadmin: false,
    ustoz: false,
  })
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  // Filtrlar va xarita markazi
  const [tanlanganHududId, setTanlanganHududId] = useState("barchasi")
  const [tanlanganFan, setTanlanganFan] = useState("barchasi")
  const [qidiruv, setQidiruv] = useState("")
  const [xaritaMarkaz, setXaritaMarkaz] = useState({
    lat: 41.3111,
    lng: 69.2797,
    zoom: 11,
  })
  const [tanlanganRepId, setTanlanganRepId] = useState(null)

  // O'quvchi GPS joylashuvi ("Menga eng yaqin")
  const [gpsNuqta, setGpsNuqta] = useState(null)
  const [gpsYuklanmoqda, setGpsYuklanmoqda] = useState(false)
  const [gpsXabar, setGpsXabar] = useState("")

  // Yangi repititor qo'shish formasi (Karta orqali)
  const [qoshishOchiq, setQoshishOchiq] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState({ tur: "", matn: "" })

  const [forma, setForma] = useState({
    ism: "",
    fan: "kimyo_biologiya",
    sertifikat: "A+",
    markaz: "",
    hudud: "toshkent-sh",
    tuman: "",
    moljal: "",
    lat: 41.3111,
    lng: 69.2797,
    telefon: "+998 ",
    telegram: "",
    narx: "",
    tavsif: "",
  })

  const malumotYukla = useCallback(async () => {
    setYuklanmoqda(true)
    try {
      const res = await fetch("/api/repititorlar")
      const data = await res.json()
      if (Array.isArray(data?.repititorlar)) {
        setRepititorlar(data.repititorlar)
      }
      if (data?.foydalanuvchi) {
        setFoydalanuvchi(data.foydalanuvchi)
        setForma((eski) => ({
          ...eski,
          ism: eski.ism || data.foydalanuvchi.ism || "",
          telegram: eski.telegram || data.foydalanuvchi.username || "",
        }))
      }
    } catch {
      // xato bo'lsa bo'sh ro'yxat qoladi
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => {
    malumotYukla()
  }, [malumotYukla])

  // Hudud tanlanganda xaritani o'sha hududga uchirish
  function hududTanla(hududId) {
    setTanlanganHududId(hududId)
    if (hududId === "barchasi") {
      setXaritaMarkaz({ lat: 41.3111, lng: 69.2797, zoom: 6 })
      return
    }
    const h = HUDUDLAR_XARITA.find((x) => x.id === hududId)
    if (h) {
      setXaritaMarkaz({ lat: h.lat, lng: h.lng, zoom: h.zoom || 11 })
    }
  }

  // Xarita ustidan nuqta bosilganda (Qo'shish rejimida)
  const xaritadanNuqtaTanlandi = useCallback(
    ({ lat, lng }) => {
      if (!qoshishOchiq) return
      const hududAuto = engYaqinHududId(lat, lng)
      setForma((eski) => ({
        ...eski,
        lat,
        lng,
        hudud: hududAuto,
      }))
    },
    [qoshishOchiq]
  )

  // "Menga eng yaqin repititorni top" (GPS)
  function mengaEngYaqininiTop() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsXabar("Brauzeringizda geolokatsiya (GPS) qo'llab-quvvatlanmaydi")
      return
    }
    setGpsYuklanmoqda(true)
    setGpsXabar("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 100000) / 100000
        const lng = Math.round(pos.coords.longitude * 100000) / 100000
        setGpsNuqta({ lat, lng })
        setTanlanganHududId("barchasi")
        setXaritaMarkaz({ lat, lng, zoom: 13 })
        setGpsYuklanmoqda(false)
        setGpsXabar("Joylashuvingiz aniqlandi — repititorlar sizga eng yaqin masofa bo'yicha saralandi!")
      },
      () => {
        setGpsYuklanmoqda(false)
        setGpsXabar("Joylashuvga ruxsat berilmadi. Hududni ro'yxatdan tanlashingiz mumkin.")
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  // Qo'shish formasida "Joriy GPS joylashuvimni nuqta qilib olish"
  function formaUchunGpsOl() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setXabar({ tur: "xato", matn: "Geolokatsiya mavjud emas, xarita ustidan nuqtani bosing" })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 100000) / 100000
        const lng = Math.round(pos.coords.longitude * 100000) / 100000
        const hududAuto = engYaqinHududId(lat, lng)
        setForma((eski) => ({ ...eski, lat, lng, hudud: hududAuto }))
        setXaritaMarkaz({ lat, lng, zoom: 15 })
        setXabar({ tur: "muvaffaqiyat", matn: "Joriy GPS koordinatangiz xaritaga o'rnatildi!" })
      },
      () => {
        setXabar({ tur: "xato", matn: "GPS olinmadi — xarita ustidan kerakli nuqtani bosing" })
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  // Masofa hisoblangan va saralangan repititorlar
  const boyitilganRepititorlar = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    const roYxat = repititorlar
      .map((r) => {
        const km = gpsNuqta ? masofaKm(gpsNuqta.lat, gpsNuqta.lng, r.lat, r.lng) : null
        const hududObj = HUDUDLAR_XARITA.find((h) => h.id === r.hudud)
        return {
          ...r,
          hududNom: hududObj?.nom || r.hudud,
          masofaKm: km,
          masofaMatn: masofaFormatla(km),
        }
      })
      .filter((r) => {
        if (tanlanganHududId !== "barchasi" && r.hudud !== tanlanganHududId) return false
        if (tanlanganFan !== "barchasi" && r.fan !== tanlanganFan) return false
        if (q) {
          const matn = `${r.ism} ${r.markaz} ${r.tuman} ${r.moljal} ${r.tavsif} ${r.hududNom}`.toLowerCase()
          if (!matn.includes(q)) return false
        }
        return true
      })

    if (gpsNuqta) {
      roYxat.sort((a, b) => (a.masofaKm ?? 99999) - (b.masofaKm ?? 99999))
    }
    return roYxat
  }, [repititorlar, gpsNuqta, tanlanganHududId, tanlanganFan, qidiruv])

  // Yangi repititorni bazaga saqlash
  async function repititorSaqla(e) {
    e.preventDefault()
    setXabar({ tur: "", matn: "" })
    setSaqlanmoqda(true)

    try {
      const res = await fetch("/api/repititorlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forma),
      })
      const data = await res.json()
      if (!res.ok) {
        setXabar({ tur: "xato", matn: data?.error || "Xatolik yuz berdi" })
      } else if (data?.repititor) {
        setRepititorlar((eski) => [data.repititor, ...eski])
        setTanlanganRepId(data.repititor.id)
        setXaritaMarkaz({ lat: data.repititor.lat, lng: data.repititor.lng, zoom: 15 })
        setQoshishOchiq(false)
        setXabar({
          tur: "muvaffaqiyat",
          matn: "Repititor nuqtasi xaritaga muvaffaqiyatli qo'shildi!",
        })
      }
    } catch {
      setXabar({ tur: "xato", matn: "Server bilan bog'lanishda xatolik" })
    } finally {
      setSaqlanmoqda(false)
    }
  }

  async function nuqtaniOchir(id) {
    try {
      const res = await fetch(`/api/repititorlar?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setRepititorlar((eski) => eski.filter((r) => r.id !== id))
        if (tanlanganRepId === id) setTanlanganRepId(null)
      }
    } catch {
      // ignore
    }
  }

  function repititorniXaritadaKorsat(rep) {
    setTanlanganRepId(rep.id)
    setXaritaMarkaz({ lat: rep.lat, lng: rep.lng, zoom: 15 })
  }

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between"
    >
      {/* Ambient nurlar */}
      <div className="absolute top-0 left-1/4 w-[38rem] h-[38rem] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. SARLAVHA (HEADER) ─── */}
      <header className="border-b border-blue-900/50 bg-[#070c29]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition shrink-0"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent truncate">
                  Kimyo-biologiya repititorlari xaritasi
                </h1>
                <span className="hidden sm:inline-flex text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/50 bg-emerald-900/40 text-emerald-200 font-sans items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Jonli xarita</span>
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-blue-300/80 truncate">
                Eng yaqin ustozni GPS orqali toping yoki o&apos;z o&apos;quv markazingizni xaritaga qo&apos;shing
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setQoshishOchiq((v) => !v)
                setXabar({ tur: "", matn: "" })
              }}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md ${
                qoshishOchiq
                  ? "border border-rose-500/50 bg-rose-500/20 text-rose-200"
                  : "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 shadow-yellow-500/20"
              }`}
            >
              <Ikon nom={qoshishOchiq ? "yopish" : "qosh"} olcham={15} />
              <span>{qoshishOchiq ? "Yopish" : "Xaritaga qo'shish"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. ASOSIY KONTENT ─── */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 flex-1 w-full relative z-10 space-y-6">
        {/* Xabar bildirishnomasi */}
        {xabar.matn && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
              xabar.tur === "xato"
                ? "border-rose-500/50 bg-rose-500/15 text-rose-200"
                : "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
            }`}
          >
            <span>{xabar.matn}</span>
            <button
              type="button"
              onClick={() => setXabar({ tur: "", matn: "" })}
              className="p-1 rounded-lg hover:bg-white/10"
            >
              <Ikon nom="yopish" olcham={15} />
            </button>
          </div>
        )}

        {/* Yuqori Boshqaruv Paneli: GPS yaqinlik + Fan filtri + Qidiruv */}
        <div className="p-4 sm:p-5 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/80 via-[#0a1738]/80 to-[#070e28]/85 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* 1) GPS "Menga eng yaqinini top" */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={mengaEngYaqininiTop}
                disabled={gpsYuklanmoqda}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Ikon nom="xarita" olcham={16} />
                <span>
                  {gpsYuklanmoqda
                    ? "Joylashuv aniqlanmoqda..."
                    : gpsNuqta
                    ? "Eng yaqinlari ko'rsatilmoqda (GPS faol)"
                    : "Menga eng yaqin repititorni top (GPS)"}
                </span>
              </button>

              {!qoshishOchiq && (
                <button
                  type="button"
                  onClick={() => setQoshishOchiq(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-yellow-500/45 bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Ikon nom="qosh" olcham={15} />
                  <span>Karta orqali repititor qo&apos;shish</span>
                </button>
              )}
            </div>

            {/* 2) Fan turi filtri va Qidiruv */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#081333]/80 p-1 rounded-xl border border-blue-800/60">
                {[
                  { id: "barchasi", nom: "Barchasi" },
                  { id: "kimyo_biologiya", nom: "Kimyo+Bio" },
                  { id: "kimyo", nom: "Kimyo" },
                  { id: "biologiya", nom: "Biologiya" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTanlanganFan(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      tanlanganFan === f.id
                        ? "bg-yellow-500 text-slate-950"
                        : "text-blue-200 hover:text-white"
                    }`}
                  >
                    {f.nom}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={qidiruv}
                  onChange={(e) => setQidiruv(e.target.value)}
                  placeholder="Ustoz, markaz yoki tuman..."
                  className="w-full sm:w-52 pl-8 pr-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333]/90 text-xs text-white placeholder-blue-300/50 focus:outline-none focus:border-yellow-400"
                />
                <span className="absolute left-2.5 top-2.5 text-blue-300/60">
                  <Ikon nom="qidiruv" olcham={14} />
                </span>
              </div>
            </div>
          </div>

          {gpsXabar && (
            <div className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
              <Ikon nom="xarita" olcham={14} />
              <span>{gpsXabar}</span>
            </div>
          )}

          {/* 3) 14 ta hudud bo'yicha tezkor xarita tugmalari */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => hududTanla("barchasi")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition border ${
                tanlanganHududId === "barchasi"
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
                  : "border-blue-800/60 bg-[#091538]/70 text-blue-200 hover:text-white"
              }`}
            >
              O&apos;zbekiston ({repititorlar.length})
            </button>
            {HUDUDLAR_XARITA.map((h) => {
              const faol = tanlanganHududId === h.id
              const soni = repititorlar.filter((r) => r.hudud === h.id).length
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => hududTanla(h.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition border flex items-center gap-1.5 ${
                    faol
                      ? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
                      : "border-blue-800/60 bg-[#091538]/70 text-blue-200 hover:text-white"
                  }`}
                >
                  <span>{h.nom}</span>
                  {soni > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-bold">
                      {soni}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── XARITA VA QO'SHISH PANELI (YONMA-YON) ─── */}
        <div
          className={`grid grid-cols-1 ${
            qoshishOchiq ? "lg:grid-cols-[1.25fr_1fr]" : "lg:grid-cols-[1.5fr_1fr]"
          } gap-6 items-start`}
        >
          {/* CHAP: HAQIQIY INTERAKTIV XARITA (LEAFLET + OPENSTREETMAP) */}
          <div className="w-full h-[380px] sm:h-[500px]">
            <RepititorXarita
              markaz={xaritaMarkaz}
              repititorlar={boyitilganRepititorlar}
              tanlanganId={tanlanganRepId}
              onSelectRepititor={(rep) => setTanlanganRepId(rep.id)}
              tanlashRejimi={qoshishOchiq}
              tanlanganNuqta={qoshishOchiq ? { lat: forma.lat, lng: forma.lng } : null}
              onMapClickNuqta={xaritadanNuqtaTanlandi}
              foydalanuvchiGps={gpsNuqta}
            />
          </div>

          {/* O'NG: YO QO'SHISH FORMASI, YO TANLANGAN / YAQIN REPITITORLAR RO'YXATI */}
          {qoshishOchiq ? (
            <div className="p-5 sm:p-6 rounded-3xl border-2 border-yellow-500/50 bg-gradient-to-br from-[#151a4a]/90 via-[#0a1738]/90 to-[#070e28]/95 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Karta orqali qo&apos;shish
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Yangi repititor nuqtasi
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setQoshishOchiq(false)}
                  className="p-2 rounded-xl border border-blue-800/60 text-blue-200 hover:text-white"
                >
                  <Ikon nom="yopish" olcham={16} />
                </button>
              </div>

              {!foydalanuvchi.kirganmi ? (
                <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-xs sm:text-sm text-amber-200 space-y-3">
                  <p>
                    Xaritaga o&apos;z o&apos;quv markazingiz yoki repititorlik nuqtangizni qo&apos;shish uchun tizimga kiring.
                  </p>
                  <Link
                    href="/login?callbackUrl=%2Frepititorlar"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-500 text-slate-950 font-bold text-xs"
                  >
                    <Ikon nom="odam" olcham={14} />
                    <span>Tizimga kirish</span>
                  </Link>
                </div>
              ) : (
                <form onSubmit={repititorSaqla} className="space-y-3 font-sans">
                  {/* Koordinata va GPS tugmasi */}
                  <div className="p-3 rounded-2xl border border-cyan-500/40 bg-[#081738]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Ikon nom="xarita" olcham={14} />
                        <span>Xaritadan tanlangan nuqta:</span>
                      </div>
                      <div className="font-mono text-[11px] text-blue-200 mt-0.5">
                        {forma.lat}, {forma.lng}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={formaUchunGpsOl}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 text-cyan-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Ikon nom="xarita" olcham={13} />
                      <span>Joriy GPS joyimni olish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Ustoz F.I.Sh *
                      </label>
                      <input
                        type="text"
                        required
                        value={forma.ism}
                        onChange={(e) => setForma({ ...forma, ism: e.target.value })}
                        placeholder="Masalan: Aliyev Sardor"
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        O&apos;quv markazi nomi
                      </label>
                      <input
                        type="text"
                        value={forma.markaz}
                        onChange={(e) => setForma({ ...forma, markaz: e.target.value })}
                        placeholder="Masalan: Kimyo Akademiyasi"
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Fan yo&apos;nalishi *
                      </label>
                      <select
                        value={forma.fan}
                        onChange={(e) => setForma({ ...forma, fan: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="kimyo_biologiya">Kimyo + Biologiya</option>
                        <option value="kimyo">Faqat Kimyo</option>
                        <option value="biologiya">Faqat Biologiya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Sertifikat / Daraja
                      </label>
                      <select
                        value={forma.sertifikat}
                        onChange={(e) => setForma({ ...forma, sertifikat: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Milliy sertifikat A+">Milliy sertifikat A+</option>
                        <option value="Milliy sertifikat A">Milliy sertifikat A</option>
                        <option value="Oliy toifali ustoz">Oliy toifali ustoz</option>
                        <option value="Olimpiada ustozi">Olimpiada ustozi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Viloyat / Hudud
                      </label>
                      <select
                        value={forma.hudud}
                        onChange={(e) => {
                          const hId = e.target.value
                          const h = HUDUDLAR_XARITA.find((x) => x.id === hId)
                          setForma((eski) => ({
                            ...eski,
                            hudud: hId,
                            lat: h ? h.lat : eski.lat,
                            lng: h ? h.lng : eski.lng,
                          }))
                          if (h) setXaritaMarkaz({ lat: h.lat, lng: h.lng, zoom: h.zoom || 12 })
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        {HUDUDLAR_XARITA.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Tuman / Shahar *
                      </label>
                      <input
                        type="text"
                        required
                        value={forma.tuman}
                        onChange={(e) => setForma({ ...forma, tuman: e.target.value })}
                        placeholder="Masalan: Chilonzor tumani"
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                      Aniq manzil va mo&apos;ljal *
                    </label>
                    <input
                      type="text"
                      required
                      value={forma.moljal}
                      onChange={(e) => setForma({ ...forma, moljal: e.target.value })}
                      placeholder="Masalan: Mirzo Ulug'bek metrosi yonida, 2-qavat"
                      className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Telefon raqam *
                      </label>
                      <input
                        type="text"
                        required
                        value={forma.telefon}
                        onChange={(e) => setForma({ ...forma, telefon: e.target.value })}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                        Telegram (@username)
                      </label>
                      <input
                        type="text"
                        value={forma.telegram}
                        onChange={(e) => setForma({ ...forma, telegram: e.target.value })}
                        placeholder="@username"
                        className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200 mb-1">
                      Qisqacha ma&apos;lumot (tayyorlov yo&apos;nalishi va dars vaqtlari)
                    </label>
                    <textarea
                      rows={2}
                      value={forma.tavsif}
                      onChange={(e) => setForma({ ...forma, tavsif: e.target.value })}
                      placeholder="Milliy sertifikat, Tibbiyot oliygohlariga intensiv tayyorlov..."
                      className="w-full px-3 py-2 rounded-xl border border-blue-800/60 bg-[#081333] text-xs text-white focus:outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saqlanmoqda}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                  >
                    <Ikon nom="xarita" olcham={16} />
                    <span>{saqlanmoqda ? "Xaritaga saqlanmoqda..." : "Nuqtani xaritaga joylashtirish"}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* REPITITORLAR RO'YXATI PANELI */
            <div className="p-4 sm:p-5 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/75 via-[#0a1738]/75 to-[#070e28]/80 backdrop-blur-md shadow-xl space-y-3 max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-blue-900/50">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Ikon nom="manzil" olcham={17} className="text-yellow-400" />
                  <span>Xaritadagi repititorlar ({boyitilganRepititorlar.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setQoshishOchiq(true)}
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                >
                  <Ikon nom="qosh" olcham={14} />
                  <span>Qo&apos;shish</span>
                </button>
              </div>

              {yuklanmoqda ? (
                <div className="py-12 text-center text-xs text-blue-300/80">
                  Xaritadagi repititorlar yuklanmoqda...
                </div>
              ) : boyitilganRepititorlar.length === 0 ? (
                <div className="p-6 rounded-2xl border border-blue-800/40 bg-[#081333]/60 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-300 flex items-center justify-center">
                    <Ikon nom="xarita" olcham={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Bu hududda hozircha repititor qo&apos;shilmagan
                    </h3>
                    <p className="text-xs text-blue-200/75 leading-relaxed">
                      Birinchi bo&apos;lib o&apos;z o&apos;quv markazingiz yoki repititorlik nuqtangizni xarita ustidan belgilab qo&apos;shing!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQoshishOchiq(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Ikon nom="qosh" olcham={14} />
                    <span>Birinchi nuqtani qo&apos;shish</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {boyitilganRepititorlar.map((rep) => {
                    const fanInfo = FAN_TURLARI[rep.fan] || FAN_TURLARI.kimyo_biologiya
                    const tanlangan = rep.id === tanlanganRepId
                    const ochiraOladimi =
                      foydalanuvchi.superadmin || (foydalanuvchi.id && rep.userId === foydalanuvchi.id)

                    return (
                      <div
                        key={rep.id}
                        onClick={() => repititorniXaritadaKorsat(rep)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                          tanlangan
                            ? "border-yellow-400 bg-[#13255e]/90 shadow-lg shadow-yellow-500/10"
                            : "border-blue-800/50 bg-[#091538]/75 hover:border-blue-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-sans">
                                {fanInfo.nom}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-sans">
                                {rep.sertifikat}
                              </span>
                              {rep.masofaMatn && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-sans">
                                  Sizdan: {rep.masofaMatn}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1.5">
                              <h3 className="text-sm sm:text-base font-bold text-white">
                                {rep.ism}
                              </h3>
                              {rep.tasdiqlangan && <TasdiqBelgisi tasdiqlangan olcham="kichik" />}
                            </div>

                            {rep.markaz && (
                              <div className="text-xs font-semibold text-yellow-300/90">
                                {rep.markaz}
                              </div>
                            )}
                          </div>

                          {ochiraOladimi && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                nuqtaniOchir(rep.id)
                              }}
                              title="Nuqtani o'chirish"
                              className="p-1.5 rounded-lg text-rose-300/70 hover:text-rose-300 hover:bg-rose-500/15 transition"
                            >
                              <Ikon nom="ochir" olcham={14} />
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-blue-200/85 flex items-start gap-1.5">
                          <Ikon nom="xarita" olcham={14} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>
                            {rep.hududNom}
                            {rep.tuman ? `, ${rep.tuman}` : ""}
                            {rep.moljal ? ` — ${rep.moljal}` : ""}
                          </span>
                        </div>

                        {rep.tavsif && (
                          <p className="text-xs text-blue-300/80 leading-relaxed">{rep.tavsif}</p>
                        )}

                        <div
                          className="pt-2 border-t border-blue-900/50 flex items-center justify-between gap-2 flex-wrap font-sans"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {rep.telefon && (
                              <a
                                href={`tel:${rep.telefon.replace(/\s+/g, "")}`}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold hover:bg-emerald-500/30 transition"
                              >
                                {rep.telefon}
                              </a>
                            )}
                            {rep.telegram && (
                              <a
                                href={`https://t.me/${rep.telegram.replace(/^@/, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-200 text-[11px] font-bold hover:bg-sky-500/30 transition flex items-center gap-1"
                              >
                                <Ikon nom="telegram" olcham={12} />
                                <span>@{rep.telegram.replace(/^@/, "")}</span>
                              </a>
                            )}
                          </div>

                          <a
                            href={`https://www.google.com/maps?q=${rep.lat},${rep.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-blue-700/60 bg-[#07112e] text-blue-200 hover:text-yellow-300 text-[11px] font-semibold transition flex items-center gap-1"
                          >
                            <Ikon nom="tashqi" olcham={12} />
                            <span>Navigator</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
