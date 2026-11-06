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

const LABORATORIYA_ISHLARI = [
  {
    id: 1,
    sinf: 7,
    raqam: "1-amaliy ish",
    nom: "Kimyo laboratoriyasida xavfsizlik qoidalari va jihozlar bilan tanishish",
    tavsif: "Probirka, stakan, menzurka, tomizg'ich, spirtovka va shtativ bilan ishlash texnikasi hamda xavf belgilari (GHS piktogrammalari).",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "7.1",
  },
  {
    id: 2,
    sinf: 7,
    raqam: "2-amaliy ish",
    nom: "Modda holatlarining o'zgarishi: suyuqlanish, qaynash va bug'lanish",
    tavsif: "Suv va qattiq moddalarning fazoviy holat o'zgarishlarini kuzatish, qaynash harorati va termometr yordamida o'lchash tajribasi.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "7.2",
  },
  {
    id: 3,
    sinf: 7,
    raqam: "3-amaliy ish",
    nom: "Aralashmalarni ajratish usullari: filtrlash, tindirish va bug'latish",
    tavsif: "Qum va tuz aralashmasini tozalash, qog'oz filtr tayyorlash, tindirish va suvni bug'latib sof tuz kristallarini ajratib olish.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "7.3",
  },
  {
    id: 4,
    sinf: 8,
    raqam: "1-amaliy ish",
    nom: "Kislorod gazini laboratoriyada olish va uning xossalarini tekshirish",
    tavsif: "Kaliy permanganat yoki vodorod peroksidni parchalab kislorod olish, cho'g'langan qirindi bilan gazni aniqlash va olovda yonish tajribasi.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "8.1",
  },
  {
    id: 5,
    sinf: 8,
    raqam: "2-amaliy ish",
    nom: "Kislota va asoslar xossalarini o'rganish, indikatorlar ta'siri",
    tavsif: "Lakmus, fenolftalein va metilzarg'aldoq yordamida kislotali va asosli muhitni aniqlash, neytrallanish reaksiyasini o'tkazish.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "8.2",
  },
  {
    id: 6,
    sinf: 9,
    raqam: "1-amaliy ish",
    nom: "Elektrolitik dissotsiatsiya va ion almashinish reaksiyalari",
    tavsif: "Eritmalarning elektr o'tkazuvchanligini tekshirish, cho'kma tushishi, gaz ajralishi va kuchsiz elektrolit hosil bo'lish shartlari.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "9.1",
  },
  {
    id: 7,
    sinf: 10,
    raqam: "1-amaliy ish",
    nom: "To'yinmagan uglevodorodlar sifat reaksiyalari (bromli suv va KMnO4)",
    tavsif: "Kalsiy karbiddan asetilen gazi olish, uning bromli suvni va kaliy permanganat eritmasini rangsizlantirish tajribasi.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "10.1",
  },
  {
    id: 8,
    sinf: 11,
    raqam: "1-amaliy ish",
    nom: "Spirtlar, aldegidlar va uglevodlar sifat reaksiyalari",
    tavsif: "Kumush ko'zgu reaksiyasi, mis (II) gidroksid bilan aldegid va glyukoza sifat reaksiyasini o'tkazish, kraxmalga yod ta'siri.",
    davomiylik: "45 daqiqa",
    video: true,
    qollanma: true,
    belgi: "11.1",
  },
]

export default function LaboratoriyaMashgulotlariSahifa() {
  const [tanlanganSinf, setTanlanganSinf] = useState("barchasi")

  const filtrlanganIshlar =
    tanlanganSinf === "barchasi"
      ? LABORATORIYA_ISHLARI
      : LABORATORIYA_ISHLARI.filter((i) => i.sinf === Number(tanlanganSinf))

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
                  Laboratoriya mashg&apos;ulotlari
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/50 bg-cyan-900/40 text-cyan-200 font-sans">
                  Videolar va qo&apos;llanmalar
                </span>
              </div>
              <div className="text-xs text-blue-300/80">
                Amaliy eksperimentlar, xavfsizlik qoidalari va ko&apos;rgazmali tajribalar
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dokon"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-amber-500/50 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20 text-amber-300 transition hidden sm:inline-flex items-center gap-1.5"
            >
              <Ikon nom="savat" olcham={14} />
              <span>Jihozlar sotuvi</span>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-semibold text-cyan-300 shadow-sm">
            <Ikon nom="kolba" olcham={14} />
            <span>Maktab kimyo laboratoriyasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Kimyoviy tajribalar va amaliy mashg&apos;ulotlar
          </h2>
          <p className="text-sm sm:text-base text-blue-200/80 leading-relaxed">
            Darslik bo&apos;yicha har bir sinf uchun belgilangan laboratoriya ishlari, reaktivlar bilan ishlash texnikasi, video namoyishlar va uslubiy ko&apos;rsatmalar.
          </p>
        </div>

        {/* Sinf bo'yicha filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "barchasi", nom: "Barcha mashg'ulotlar" },
            { id: "7", nom: "7-sinf" },
            { id: "8", nom: "8-sinf" },
            { id: "9", nom: "9-sinf" },
            { id: "10", nom: "10-sinf" },
            { id: "11", nom: "11-sinf" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setTanlanganSinf(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tanlanganSinf === s.id
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20"
                  : "border border-blue-800/60 bg-[#091538]/70 text-blue-200 hover:text-white hover:border-yellow-400/50"
              }`}
            >
              <span>{s.nom}</span>
            </button>
          ))}
        </div>

        {/* Mashg'ulotlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filtrlanganIshlar.map((ish) => (
            <div
              key={ish.id}
              className="p-6 sm:p-7 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/70 via-[#0a1738]/70 to-[#070e28]/70 backdrop-blur-md shadow-xl flex flex-col justify-between group hover:border-yellow-400/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                      {ish.sinf}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg border border-blue-800/60 bg-[#081538]/70 text-blue-300 font-semibold">
                      {ish.raqam}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-medium">
                    {ish.davomiylik}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-300 transition-colors leading-snug">
                  {ish.nom}
                </h3>

                <p className="text-xs sm:text-sm text-blue-200/80 mt-2.5 leading-relaxed">
                  {ish.tavsif}
                </p>

                <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1 text-[11px]">
                    <Ikon nom="video" olcham={12} />
                    <span>Video dars</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 flex items-center gap-1 text-[11px]">
                    <Ikon nom="fayl" olcham={12} />
                    <span>Uslubiy qo&apos;llanma</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg border border-blue-700/40 bg-blue-900/20 text-blue-300 text-[11px]">
                    Davlat standarti
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/50 flex items-center justify-between gap-3">
                <span className="text-xs text-blue-300/70">
                  {ish.sinf}-sinf darsligi
                </span>
                <a
                  href="https://t.me/diyorbek_jabborov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-yellow-500/20 flex items-center gap-1.5"
                >
                  <Ikon nom="video" olcham={14} />
                  <span>Videoni ko&apos;rish</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Laboratoriya jihozlariga o'tish chaqirig'i */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-[#101b44]/70 to-[#070e28]/70 backdrop-blur-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Ikon nom="savat" olcham={28} />
            </span>
            <div>
              <h4 className="text-lg font-bold text-white">
                Laboratoriya mashg&apos;ulotlari uchun jihozlar kerakmi?
              </h4>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
                Maktab xonalari va tajribalar uchun barcha turdagi shisha idishlar, probirkalar, tarozilar va toza reaktivlarni xarid qilishingiz mumkin.
              </p>
            </div>
          </div>
          <Link
            href="/dokon"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shrink-0 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Mahsulotlar katalogi</span>
            <Ikon nom="ong" olcham={15} />
          </Link>
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
