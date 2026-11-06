"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"

function YaratuvchiRasmi() {
  const [xato, setXato] = useState(false)
  const rasmRef = useRef(null)

  useEffect(() => {
    const el = rasmRef.current
    if (el && el.complete && el.naturalWidth === 0) setXato(true)
  }, [])

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/60 shadow-xl shadow-yellow-500/20 shrink-0">
      {xato ? (
        <span className="w-full h-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
          <Ikon nom="odam" olcham={32} qalin={1.5} />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={rasmRef}
          src="/yaratuvchi.jpg"
          alt="Diyorbek Jabborov"
          className="w-full h-full object-cover rounded-full"
          onError={() => setXato(true)}
        />
      )}
    </div>
  )
}

const MAHSULOT_TOIFALARI = [
  {
    id: "shisha",
    nom: "Kimyoviy shisha idishlar",
    tavsif: "Issiqqa chidamli borosilikat shishadan tayyorlangan probirkalar, kolbalar va menzurkalar.",
    ikon: "kolba",
    mahsulotlar: [
      { nom: "Kimyoviy probirkalar to'plami (10 dona + shtativ)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Konussimon Erlenmeyer kolbasi (250 ml / 500 ml)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "O'lchov menzurkasi (100 ml / 250 ml shkala bilan)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Kimyoviy stakanlar to'plami (50, 100, 250 ml)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Shisha voronka va tomizg'ichlar to'plami", narx: "Kelishilgan", holat: "Mavjud" },
    ],
  },
  {
    id: "asboblar",
    nom: "Laboratoriya asboblari va jihozlari",
    tavsif: "Maktab va o'quv laboratoriyalari uchun xavfsiz va aniq o'lchov asboblari.",
    ikon: "atom",
    mahsulotlar: [
      { nom: "Metall laboratoriya shtativi (qisqich va halqasi bilan)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Laboratoriya spirtovkasi (metall qopqoq va pilik bilan)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Elektron laboratoriya tarozisi (0.01 g aniqlikda)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Laboratoriya termometri (-10°C dan +150°C gacha)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Probirka ushlagich va metall qisqichlar", narx: "Kelishilgan", holat: "Mavjud" },
    ],
  },
  {
    id: "toplamlar",
    nom: "O'quvchi va o'qituvchi to'plamlari",
    tavsif: "Darslikdagi barcha laboratoriya va amaliy mashg'ulotlarni o'tkazish uchun tayyor quti.",
    ikon: "savat",
    mahsulotlar: [
      { nom: "7-sinf kimyo laboratoriya to'plami (to'liq jamlanma)", narx: "Kelishilgan", holat: "Buyurtma asosida" },
      { nom: "8-9 sinf kimyo amaliy ishlar to'plami", narx: "Kelishilgan", holat: "Buyurtma asosida" },
      { nom: "Ko'rgazmali namoyish tajribalari o'qituvchi to'plami", narx: "Kelishilgan", holat: "Buyurtma asosida" },
      { nom: "Uy sharoitida xavfsiz tajribalar to'plami", narx: "Kelishilgan", holat: "Mavjud" },
    ],
  },
  {
    id: "reaktivlar",
    nom: "Xavfsiz o'quv reaktivlari",
    tavsif: "Maktab dasturidagi sifat reaksiyalari va tajribalar uchun maxsus qadoqlangan toza moddalar.",
    ikon: "kristall",
    mahsulotlar: [
      { nom: "Indikatorlar to'plami (lakmus, fenolftalein, metilzarg'aldoq)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Universal pH indikator qog'ozlari (80 ta tasmacha)", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "O'quv tuzlari va kislotalari mini-to'plami", narx: "Kelishilgan", holat: "Mavjud" },
      { nom: "Reaksiya belgilari va cho'kma hosil qilish to'plami", narx: "Kelishilgan", holat: "Mavjud" },
    ],
  },
]

export default function DokonSahifa() {
  const [faolToifa, setFaolToifa] = useState("shisha")

  const joriyToifa =
    MAHSULOT_TOIFALARI.find((t) => t.id === faolToifa) || MAHSULOT_TOIFALARI[0]

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between"
    >
      {/* ─── FON EFFEKTLARI (TO'Q MOVİY-SAFIR AMBIENT NURLAR) ─── */}
      <div className="absolute top-0 left-1/4 w-[42rem] h-[42rem] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-72 -left-20 w-[36rem] h-[36rem] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[38rem] h-[38rem] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-48 left-1/3 w-[40rem] h-[40rem] bg-blue-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. SARLAVHA (HEADER) ─── */}
      <header className="border-b border-blue-900/50 bg-[#070c29]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  Laboratoriya mahsulotlari sotuvi
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-900/40 text-amber-200 font-sans">
                  Sotuv va buyurtma
                </span>
              </div>
              <div className="text-xs text-blue-300/80">
                Maktab va o&apos;quv markazlari uchun sifatli laboratoriya jihozlari
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/laboratoriya"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-cyan-500/50 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-300 transition hidden sm:inline-flex items-center gap-1.5"
            >
              <Ikon nom="kolba" olcham={14} />
              <span>Mashg&apos;ulotlar</span>
            </Link>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. ASOSIY KONTENT ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 w-full relative z-10 space-y-8">
        {/* Kirish banneri */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-semibold text-amber-300 shadow-sm">
            <Ikon nom="savat" olcham={14} />
            <span>Rasmiy laboratoriya do&apos;koni</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Kimyo laboratoriya jihozlari va reaktivlari
          </h2>
          <p className="text-sm sm:text-base text-blue-200/80 leading-relaxed">
            Maktab darslari, repetitorlik xonalari va ilmiy amaliyotlar uchun barcha zarur shisha idishlar, o&apos;lchov asboblari va xavfsiz o&apos;quv reaktivlarini buyurtma qiling.
          </p>
        </div>

        {/* Toifalar tugmalari */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {MAHSULOT_TOIFALARI.map((t) => (
            <button
              key={t.id}
              onClick={() => setFaolToifa(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                faolToifa === t.id
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20"
                  : "border border-blue-800/60 bg-[#091538]/70 text-blue-200 hover:text-white hover:border-yellow-400/50"
              }`}
            >
              <Ikon nom={t.ikon} olcham={14} />
              <span>{t.nom}</span>
            </button>
          ))}
        </div>

        {/* Tanlangan toifaning mahsulotlar ro'yxati */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/70 via-[#0a1738]/70 to-[#070e28]/70 backdrop-blur-md shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/50">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
                  <Ikon nom={joriyToifa.ikon} olcham={18} />
                </span>
                <span>{joriyToifa.nom}</span>
              </h3>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
                {joriyToifa.tavsif}
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-xl border border-blue-800/60 bg-[#091538]/70 text-blue-200 shrink-0 self-start sm:self-center">
              {joriyToifa.mahsulotlar.length} xil mahsulot
            </span>
          </div>

          <div className="space-y-3">
            {joriyToifa.mahsulotlar.map((m, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-blue-900/50 bg-[#09153a]/50 hover:border-yellow-400/50 hover:bg-[#0c1f54]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                      {m.nom}
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {m.holat}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-xs font-semibold text-blue-200/90">
                    Narx: <span className="text-yellow-300 font-bold">{m.narx}</span>
                  </span>
                  <a
                    href="https://t.me/diyorbek_jabborov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-yellow-500/20 flex items-center gap-1.5"
                  >
                    <Ikon nom="telegram" olcham={13} />
                    <span>Buyurtma berish</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buyurtma va maslahat olish bloki */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-yellow-500/40 bg-gradient-to-r from-yellow-950/30 via-[#101b44]/70 to-[#070e28]/70 backdrop-blur-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 flex items-center justify-center shrink-0">
              <Ikon nom="telegram" olcham={28} />
            </span>
            <div>
              <h4 className="text-lg font-bold text-white">
                Maxsus buyurtma yoki maslahat kerakmi?
              </h4>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
                Maktab yoki o&apos;quv markazingiz uchun to&apos;liq laboratoriya jihozlarini yetkazib berish bo&apos;yicha to&apos;g&apos;ridan-to&apos;g&apos;ri bog&apos;laning.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="https://t.me/diyorbek_jabborov"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              <Ikon nom="telegram" olcham={15} />
              <span>@diyorbek_jabborov</span>
            </a>
            <a
              href="https://t.me/jdakimyouzbot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-800/60 bg-[#091538]/70 hover:border-yellow-400/50 hover:bg-[#0c1f54]/80 text-blue-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Ikon nom="bot" olcham={15} />
              <span>Telegram Bot</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 3. YARATUVCHI FOOTER (ASL ESKI USLUBDAGI YARATUVCHI KARTASI) ─── */}
      <footer className="mt-auto border-t border-blue-900/50 bg-[#050920]/90 backdrop-blur-xl py-12 text-xs text-blue-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 md:p-8 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0a1738]/50 to-[#070e28]/40 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              {/* Yaratuvchi ma'lumotlari */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <YaratuvchiRasmi />
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-xs font-semibold text-yellow-300 mb-2">
                    Sayt yaratuvchisi
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-bold text-lg text-white">Diyorbek Jabborov</h4>
                    <TasdiqBelgisi tasdiqlangan olcham="katta" jonli />
                  </div>
                  <p className="text-blue-200/80 text-sm mt-0.5">
                    Kimyo o&apos;qituvchisi · platforma asoschisi
                  </p>

                  <div className="flex flex-wrap gap-2.5 mt-4 justify-center sm:justify-start">
                    <Link
                      href="/profil/343229943"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="odam" olcham={15} />
                      <span>Profil</span>
                    </Link>
                    <a
                      href="https://t.me/diyorbek_jabborov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="telegram" olcham={15} />
                      <span>Telegram</span>
                    </a>
                    <a
                      href="mailto:jabborovd18@gmail.com"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="pochta" olcham={15} />
                      <span>Email</span>
                    </a>
                    <a
                      href="https://t.me/jdakimyouzbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="bot" olcham={15} />
                      <span>Bot</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* O'ng tomon: Versiya, JDA KIMYO nima, copyright */}
              <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-800/50 bg-[#09153a]/60 text-xs font-semibold text-blue-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  v3.0.0
                </span>
                <Link
                  href="/jda-kimyo"
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-1 mt-1 transition"
                >
                  <Ikon nom="atom" olcham={15} />
                  <span>JDA KIMYO nima?</span>
                </Link>
                <p className="text-blue-300/70 text-xs mt-1">© 2026 JDA KIMYO</p>
                <p className="text-blue-300/50 text-[11px]">Kimyo ta&apos;lim platformasi</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
