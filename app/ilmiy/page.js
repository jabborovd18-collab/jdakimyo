import Link from "next/link"
import hajm from "@/lib/ilmiy-hajm.json"
import { maqolalar } from "@/lib/maqolalar"

/**
 * Ilmiy bo'limning bosh sahifasi.
 *
 * Avvalgi variantda sahifadagi eng ko'zga tashlanadigan element buzuq edi:
 * to'rt bo'limning hammasida progress qo'lda 0 deb yozilgan, qiymat esa
 * localStorage'dagi 'ilmiy-progress' dan o'qilardi — unga loyihada hech kim
 * yozmasdi. Ya'ni odam kirganda birinchi ko'radigani doim "Umumiy progress
 * 0%" bo'lardi. Progressni haqiqiy qilish uchun kuzatuv tizimi kerak, u esa
 * hozir yo'q; shuning uchun sahifa endi bo'lim haqiqatan nimaga egaligini
 * ko'rsatadi — raqamlar lib/ilmiy-hajm.json dan (scripts/count-ilmiy.js
 * sanaydi), qo'lda yozilmaydi.
 *
 * Ranglar avvalgi sahifadagi bo'lim ranglarining o'zi. Yangiligi shundaki,
 * har bir rang o'sha bo'limga mos keladigan haqiqiy kompleks ionining rangi
 * sifatida izohlanadi — shunda rang bezak emas, ma'lumot bo'ladi.
 */

// Sarlavha "Ilmiy bo'lim" emas: uni hech kim qidiruvga yozmaydi.
// Odam "kompleks birikmalar" deb qidiradi, sarlavha ham shundan boshlanadi.
export const metadata = {
  title: "Kompleks birikmalar kutubxonasi",
  description:
    "To'rt yo'nalish: chuqurlashgan mavzular, 20 ta tahlil usuli, birikmalar bazasi va ilmiy maqolalar. Kristall maydon nazariyasidan Mössbauer spektroskopiyasigacha.",
}

// Tailwind klasslari to'liq matn ko'rinishida turishi shart — aks holda
// production build'da purge qilib yuboradi.
const BOLIMLAR = [
  {
    href: "/ilmiy/tahlil",
    keng: true,
    title: "Tahlil usullari",
    desc: "Har bir usul aniq birikmalarda qanday o'qilishi bilan ko'rsatilgan — quruq nazariya emas, spektrlarning o'zi.",
    ion: "[Co(NH₃)₆]³⁺ — amber",
    son: hajm.usulBirikmaTahlili,
    birlik: `usul × birikma tahlili`,
    nuqta: "bg-amber-400 shadow-[0_0_14px] shadow-amber-400/70",
    matn: "text-amber-400",
    chegara: "hover:border-amber-400/60",
  },
  {
    href: "/ilmiy/chuqurlashgan",
    keng: true,
    title: "Chuqurlashgan mavzular",
    desc: "Kristall va ligand maydon nazariyasi, simmetriya, Yan–Teller effekti, termodinamika — hisob-kitob va diagrammalar bilan.",
    ion: "[Ti(H₂O)₆]³⁺ — binafsha",
    son: hajm.mavzuSahifalari,
    birlik: `sahifa · ${hajm.mavzular} mavzu`,
    nuqta: "bg-violet-400 shadow-[0_0_14px] shadow-violet-400/70",
    matn: "text-violet-300",
    chegara: "hover:border-violet-400/60",
  },
  {
    href: "/ilmiy/birikmalar",
    keng: false,
    title: "Kompleks birikmalar",
    desc: "Tuzilishi, xossalari, olinishi va aylantirib ko'riladigan 3D modeli.",
    ion: "[Cu(H₂O)₆]²⁺ — siyan",
    son: hajm.birikmalar,
    birlik: "birikma",
    nuqta: "bg-cyan-400 shadow-[0_0_14px] shadow-cyan-400/70",
    matn: "text-cyan-400",
    chegara: "hover:border-cyan-400/60",
    namunalar: ["ferrosen", "Prussiya ko'ki", "Zeise tuzi", "sisplatin", "vitamin B₁₂", "gemoglobin"],
  },
  {
    href: "/ilmiy/maqolalar",
    keng: false,
    title: "Ilmiy maqolalar",
    desc: "Maqolalar bazasi, dolzarb mavzular muhokamasi va o'z maqolangizni joylash.",
    ion: "[Ni(H₂O)₆]²⁺ — yashil",
    son: maqolalar.length,
    birlik: "maqola · muhokama ochiq",
    nuqta: "bg-emerald-400 shadow-[0_0_14px] shadow-emerald-400/70",
    matn: "text-emerald-400",
    chegara: "hover:border-emerald-400/60",
  },
]

// Sanoq lib/ilmiy-hajm.json dan, ko'rinadigan nom shu yerdan.
const USUL_NOMI = {
  iq: "IQ", "ub-vis": "UB-Vis", nmr: "NMR", raman: "Raman", rentgen: "Rentgen",
  magnit: "Magnit", xps: "XPS", exafs: "EXAFS", mass: "Mass-spektr", cd: "CD",
  fluoressensiya: "Fluoressensiya", aas: "AAS", icp: "ICP",
  "element-analiz": "Element analiz", termik: "Termik analiz", titrlash: "Titrlash",
  konduktometriya: "Konduktometriya", elektrokimyo: "Elektrokimyo",
  mossbauer: "Mössbauer", epr: "EPR",
}

// Mazmuni ko'p usul oldinda — tartib ham ma'lumot beradi
const USULLAR = Object.entries(hajm.usulHajmi).sort((a, b) => b[1] - a[1])

const SANOQLAR = [
  { son: hajm.birikmalar, nom: "Birikma", rang: "text-cyan-400" },
  { son: hajm.usullar, nom: "Tahlil usuli", rang: "text-amber-400" },
  { son: hajm.mavzular, nom: "Chuqur mavzu", rang: "text-violet-300" },
  { son: hajm.modellar3d, nom: "3D model", rang: "text-emerald-400" },
]

export default function Ilmiy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-2 text-xs text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">Ilmiy bo'lim</span>
          </nav>
          <Link
            href="/qidiruv"
            className="flex items-center gap-2 px-4 py-2 bg-purple-900/60 hover:bg-purple-800/70 border border-purple-700/50 rounded-xl text-sm text-purple-300 transition-colors"
          >
            🔍 Birikma, usul yoki mavzu izlash
            <kbd className="hidden sm:inline-block text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700">Ctrl+K</kbd>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">

        {/* HERO — chap tomonda hajm, o'ngda mavzuning o'zi */}
        <section className="grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 items-center py-12 md:py-16">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-amber-400 font-semibold mb-5">
              Koordinatsion kimyo
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.02] mb-5 text-balance">
              Kompleks birikmalar
              <br />
              <span className="text-purple-400">kutubxonasi</span>
            </h1>
            <p className="text-purple-200 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              To'rt yo'nalish, <strong className="text-white font-semibold">{hajm.jamiTahlilVaMavzu} ta</strong> tahlil
              va mavzu sahifasi. Kristall maydon nazariyasidan Mössbauer
              spektroskopiyasigacha — har bir birikma o'z spektrlari va 3D modeli bilan.
            </p>

            <div className="flex flex-wrap gap-x-9 gap-y-5">
              {SANOQLAR.map((s) => (
                <div key={s.nom}>
                  <div className={`text-3xl font-extrabold tabular-nums leading-none mb-1.5 ${s.rang}`}>
                    {s.son}
                  </div>
                  <div className="text-[10.5px] tracking-[0.09em] uppercase text-purple-500">
                    {s.nom}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* d-orbitalning oktaedrik maydonda ajralishi — bu bo'limning
              eng xarakterli tasviri, shuning uchun hero'da shu turadi */}
          <svg
            viewBox="0 0 360 240"
            className="w-full max-w-md mx-auto lg:mx-0 h-auto"
            role="img"
            aria-labelledby="orb-sarlavha orb-izoh"
          >
            <title id="orb-sarlavha">d-orbitallarning oktaedrik maydonda ajralishi</title>
            <desc id="orb-izoh">
              Erkin ionda beshta d-orbital bir xil energiyada; oktaedrik ligand
              maydonida ular ikkita yuqori eg va uchta quyi t2g pog'onasiga
              ajraladi, orasidagi farq delta o deb belgilanadi.
            </desc>

            <line x1="34" y1="120" x2="326" y2="120" stroke="#6B21A8" strokeWidth="1" strokeDasharray="2 4" />
            <text x="34" y="112" fill="#A855F7" fontSize="9.5" letterSpacing="0.06em">erkin ion</text>

            <g className="ilmiy-eg">
              <line x1="206" y1="66" x2="248" y2="66" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="258" y1="66" x2="300" y2="66" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
              <text x="308" y="70" fill="#F3E8FF" fontSize="11">e</text>
              <text x="316" y="73" fill="#A855F7" fontSize="8.5">g</text>
            </g>

            <g className="ilmiy-t2g">
              <line x1="188" y1="163" x2="222" y2="163" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="230" y1="163" x2="264" y2="163" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="272" y1="163" x2="306" y2="163" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
              <text x="314" y="167" fill="#F3E8FF" fontSize="11">t</text>
              <text x="320" y="170" fill="#A855F7" fontSize="8.5">2g</text>
            </g>

            <g className="ilmiy-delta">
              <line x1="172" y1="66" x2="172" y2="163" stroke="#A855F7" strokeWidth="1" />
              <path d="M168 74 L172 64 L176 74" fill="none" stroke="#A855F7" strokeWidth="1" />
              <path d="M168 155 L172 165 L176 155" fill="none" stroke="#A855F7" strokeWidth="1" />
              <text x="128" y="118" fill="#F3E8FF" fontSize="12" fontWeight="600">Δo</text>
              <line x1="120" y1="120" x2="62" y2="120" stroke="#6B21A8" strokeWidth="1" strokeDasharray="2 4" />
              <text x="62" y="136" fill="#A855F7" fontSize="9.5">oktaedrik</text>
              <text x="62" y="148" fill="#A855F7" fontSize="9.5">maydon</text>
            </g>
          </svg>
        </section>

        {/* YO'NALISHLAR */}
        <div className="flex items-baseline gap-4 flex-wrap border-b border-purple-800/40 pb-3 mb-5">
          <h2 className="text-base font-bold text-white">Yo'nalishlar</h2>
          <p className="text-xs text-purple-500 ml-auto">
            Rang — bo'limga mos kompleks ionining haqiqiy rangi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
          {BOLIMLAR.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className={`group flex flex-col bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-purple-900/60 ${b.chegara} ${
                b.keng ? "md:col-span-4" : "md:col-span-2"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-4 text-[10.5px] tracking-[0.05em] text-purple-400">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${b.nuqta}`} aria-hidden="true" />
                {b.ion}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
              <p className="text-purple-300 text-sm leading-relaxed mb-5 max-w-prose">{b.desc}</p>

              <div className={`text-5xl font-extrabold tabular-nums leading-none ${b.matn}`}>
                {b.son}
              </div>
              <div className="text-[10.5px] tracking-[0.09em] uppercase text-purple-500 mt-2">
                {b.birlik}
              </div>

              {b.namunalar && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {b.namunalar.map((n) => (
                    <span
                      key={n}
                      className="text-[10.5px] px-2 py-1 rounded-md border border-purple-700/50 bg-purple-950/40 text-purple-300"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}

              <div className={`flex items-center gap-2 text-sm font-semibold mt-auto pt-5 ${b.matn}`}>
                Ochish
                <span className="transition-transform group-hover:translate-x-1.5">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* USULLAR RELI */}
        <div className="flex items-baseline gap-4 flex-wrap border-b border-purple-800/40 pb-3 mb-5 mt-14">
          <h2 className="text-base font-bold text-white">{hajm.usullar} ta tahlil usuli</h2>
          <p className="text-xs text-purple-500 ml-auto">Yon tomonga suriladi</p>
        </div>

        <div className="overflow-x-auto pb-2">
          <ul className="flex gap-2 min-w-min list-none p-0 m-0">
            {USULLAR.map(([kalit, soni]) => (
              <li key={kalit} className="shrink-0">
                <Link
                  href={`/ilmiy/tahlil/${kalit}`}
                  className="block min-w-[112px] px-4 py-3 bg-purple-900/40 border border-purple-700/50 rounded-xl hover:border-amber-400/60 hover:bg-purple-900/60 hover:-translate-y-0.5 transition-all"
                >
                  <div className="font-bold text-sm text-white whitespace-nowrap mb-1">
                    {USUL_NOMI[kalit] || kalit}
                  </div>
                  <div className="text-[10px] text-purple-400 tabular-nums">{soni} birikma</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* BITTA KIRISH NUQTASI */}
        <div className="mt-14 rounded-2xl border border-purple-700/50 bg-gradient-to-br from-amber-600/10 via-purple-900/40 to-purple-900/40 p-8 flex flex-wrap items-center gap-7">
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Qaydan boshlash kerak?</h3>
            <p className="text-purple-300 text-sm leading-relaxed max-w-prose">
              Nazariyani oldindan bilish shart emas. Eng qisqa yo'l — bitta
              birikmani tanlab, uning spektrlarini o'qish. Ferrosen buning uchun
              eng qulay birinchi misol.
            </p>
          </div>
          <Link
            href="/ilmiy/birikmalar/ferrosen"
            className="group shrink-0 inline-flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            Ferrosendan boshlash
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-12 pb-4">
          <Link
            href="/"
            className="px-6 py-3 border border-purple-600/50 rounded-xl hover:bg-purple-800/40 text-purple-300 text-center text-sm transition-colors"
          >
            ← Bosh sahifa
          </Link>
          <Link
            href="/oquv"
            className="px-6 py-3 bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-semibold text-center text-sm transition-colors"
          >
            📚 O'quv bo'lim →
          </Link>
        </div>
      </div>

      <footer className="border-t border-purple-800/30 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.06em] uppercase text-purple-600">
          <span>© 2026 JDA KIMYO — Ilmiy bo'lim</span>
          <span>
            {hajm.birikmalar} birikma · {hajm.usullar} usul · {hajm.mavzular} mavzu · {hajm.modellar3d} 3D model
          </span>
        </div>
      </footer>
    </main>
  )
}
