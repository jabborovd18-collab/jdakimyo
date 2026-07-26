"use client"

import Link from "next/link"
import { useState } from "react"
import { sanaQisqa } from "@/lib/sana"
import { kalitSozStat, mualliflarSoni } from "@/lib/maqolalar"
import { useMaqolalar } from "@/lib/use-maqola-stat"

/**
 * Maqolalar bo'limining bosh sahifasi.
 *
 * Avval bu sahifa o'zining alohida qo'lda yozilgan ro'yxatini ko'rsatardi:
 * sarlavhalar, mualliflar va ko'rish sonlari public/data/maqolalar.json
 * bilan mos kelmasdi — ro'yxatdagi sarlavhani bosgan odam butunlay boshqa
 * maqolani ochardi. Statistika kataklari ham (156 / 42 / 28 / 12.5K) va
 * "Mashhur mavzular" raqamlari ham o'ylab yozilgan edi.
 *
 * Endi hammasi haqiqiy manbadan: ro'yxat lib/maqolalar.js, ko'rish va
 * yuklash sonlari bazadan (/api/maqolalar/stats).
 */

/** 12500 → "12.5K" — katak ichiga uzun raqam sig'masligi uchun. */
const qisqaSon = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const bolimlar = [
  {
    href: "/ilmiy/maqolalar/yangi",
    icon: "🆕",
    title: "Yangi maqolalar",
    desc: "Oxirgi 7 kun ichida qo'shilgan eng so'nggi ilmiy maqolalar",
    badge: "So'nggi",
    badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    rang: "hover:border-green-400/50",
    rangText: "group-hover:text-green-400",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    href: "/ilmiy/maqolalar/baza",
    icon: "📚",
    title: "Umumiy maqolalar bazasi",
    desc: "Barcha maqolalar • Qidiruv tizimi • Mavzu bo'yicha filtr",
    badge: "Barchasi",
    badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    rang: "hover:border-blue-400/50",
    rangText: "group-hover:text-blue-400",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    href: "/ilmiy/maqolalar/muhokama",
    icon: "💬",
    title: "Dolzarb mavzular",
    desc: "Kimyoviy savol bering • Tajriba ulashing • Muhokama qiling",
    badge: "Muhokama",
    badgeColor: "bg-purple-600/20 text-purple-300 border-purple-600/30",
    rang: "hover:border-purple-400/50",
    rangText: "group-hover:text-purple-300",
    gradient: "from-purple-600 to-fuchsia-600"
  },
  {
    href: "/ilmiy/maqolalar/yaratish",
    icon: "✍️",
    title: "O'z maqolangizni yarating",
    desc: "DOCX formatida yuklang • Admin tasdiqlashi • Plagiat tekshiruvi",
    badge: "Yangi",
    badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    rang: "hover:border-yellow-400/50",
    rangText: "group-hover:text-yellow-400",
    gradient: "from-yellow-500 to-orange-500"
  }
]

export default function Maqolalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { maqolalar } = useMaqolalar()

  // kalitSozStat() ko'pdan kamga tartiblangan; bo'limga eng yuqorisi tushadi,
  // aks holda "Mashhur mavzular" ostida barcha kalit so'z chiqib ketadi.
  const barchaMavzular = kalitSozStat()
  const mavzular = barchaMavzular.slice(0, 12)

  // Statistika — o'ylab yozilgan raqamlar emas, haqiqiy ro'yxatdan
  const jamiKorish = maqolalar.reduce((s, m) => s + (m.korishlar || 0), 0)

  // Tavsiya etilgan maqola = eng ko'p o'qilgani (avval id 3 qotib qolgan edi)
  const tavsiya = maqolalar.reduce(
    (eng, m) => (!eng || (m.korishlar || 0) > (eng.korishlar || 0) ? m : eng),
    null
  )

  // Bosh sahifada uzun ro'yxat kerak emas — eng yangi 5 tasi
  const oxirgilar = maqolalar.slice(0, 5)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Maqolalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-3">
                <span className="text-3xl">📝</span>
                Maqolalar
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Ilmiy maqolalar bazasi • Koordinatsion kimyo • Tadqiqotlar
              </p>
            </div>
            <Link
              href="/ilmiy"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Ilmiy bo'lim
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8">

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-green-400">{maqolalar.length}</div>
            <div className="text-xs text-purple-400">Jami maqolalar</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">👨‍🔬</div>
            <div className="text-2xl font-bold text-blue-400">{mualliflarSoni}</div>
            <div className="text-xs text-purple-400">Mualliflar</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏷️</div>
            <div className="text-2xl font-bold text-yellow-400">{barchaMavzular.length}</div>
            <div className="text-xs text-purple-400">Mavzular</div>
          </div>
          <div className="bg-pink-900/30 border border-pink-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-2xl font-bold text-pink-400">{qisqaSon(jamiKorish)}</div>
            <div className="text-xs text-purple-400">Ko'rishlar</div>
          </div>
        </div>

        {/* QIDIRUV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <form
            action="/ilmiy/maqolalar/baza"
            className="relative"
          >
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Maqola nomi, muallif yoki kalit so'z bo'yicha qidirish..."
              className="w-full px-5 py-4 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-green-400 transition-colors"
              aria-label="Maqolalarni qidirish"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-lg"
                aria-label="Qidiruvni tozalash"
              >
                ✕
              </button>
            )}
          </form>
          {searchQuery && (
            <div className="mt-3 text-sm text-purple-300">
              <Link
                href={`/ilmiy/maqolalar/baza?q=${encodeURIComponent(searchQuery)}`}
                className="text-green-400 hover:text-green-300"
              >
                "{searchQuery}" bo'yicha qidirish →
              </Link>
            </div>
          )}
        </div>

        {/* TAVSIYA ETILGAN MAQOLA */}
        {tavsiya && (
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">⭐</span>
              <div>
                <h2 className="text-lg font-bold text-green-400">Tavsiya etilgan maqola</h2>
                <p className="text-purple-400 text-xs">Eng ko'p o'qilgan maqola</p>
              </div>
            </div>

            <Link href={`/ilmiy/maqolalar/${tavsiya.id}`} className="block group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                {tavsiya.sarlavha}
              </h3>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed line-clamp-3">
                {tavsiya.qisqacha}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-purple-400">
                <span className="font-semibold text-green-400">{tavsiya.muallif}</span>
                <span>{sanaQisqa(tavsiya.sana)}</span>
                <span className="flex items-center gap-1">
                  <span>👁️</span>
                  <span>{tavsiya.korishlar} ko'rish</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>📥</span>
                  <span>{tavsiya.yuklashlar} yuklash</span>
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* ASOSIY BO'LIMLAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {bolimlar.map((b, i) => (
            <Link
              key={i}
              href={b.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {b.icon}
              </div>
              <h3 className={`text-lg font-bold text-white mb-2 ${b.rangText} transition-colors`}>
                {b.title}
              </h3>
              <p className="text-purple-300 text-xs mb-3">{b.desc}</p>
              <span className={`inline-block text-xs px-3 py-1 rounded-full border ${b.badgeColor} font-semibold`}>
                {b.badge}
              </span>
            </Link>
          ))}
        </div>

        {/* OXIRGI MAQOLALAR */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📰</span> Oxirgi maqolalar
            </h2>
            <Link href="/ilmiy/maqolalar/baza" className="text-green-400 hover:text-green-300 text-sm font-semibold">
              Barchasi →
            </Link>
          </div>

          <div className="space-y-4">
            {oxirgilar.map((maqola) => (
              <Link
                key={maqola.id}
                href={`/ilmiy/maqolalar/${maqola.id}`}
                className="block bg-purple-800/30 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-800/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-base font-bold text-white group-hover:text-green-400 transition-colors">
                    {maqola.sarlavha}
                  </h3>
                  {maqola.kalitSozlar?.[0] && (
                    <span className="text-xs bg-purple-700/50 text-purple-300 px-2 py-1 rounded-full whitespace-nowrap">
                      {maqola.kalitSozlar[0]}
                    </span>
                  )}
                </div>

                <p className="text-purple-300 text-sm mb-3 line-clamp-2">
                  {maqola.qisqacha}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-purple-400">
                  <span className="font-semibold text-green-400">{maqola.muallif}</span>
                  <span>{sanaQisqa(maqola.sana)}</span>
                  <span className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{maqola.korishlar}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📥</span>
                    <span>{maqola.yuklashlar}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* MASHHUR MAVZULAR */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🏷️</span> Mashhur mavzular
          </h2>

          <div className="flex flex-wrap gap-2">
            {mavzular.map((mavzu) => (
              <Link
                key={mavzu.name}
                href={`/ilmiy/maqolalar/baza?kalit=${encodeURIComponent(mavzu.name)}`}
                className="bg-purple-800/40 border border-purple-700/30 px-4 py-2 rounded-full text-sm hover:bg-purple-700/60 hover:border-green-500/50 transition-all group"
              >
                <span className="text-purple-200 group-hover:text-green-400 transition-colors">
                  {mavzu.name}
                </span>
                <span className="ml-2 text-xs text-purple-500">
                  ({mavzu.count})
                </span>
              </Link>
            ))}
            {barchaMavzular.length > mavzular.length && (
              <Link
                href="/ilmiy/maqolalar/baza"
                className="px-4 py-2 rounded-full text-sm text-purple-400 hover:text-green-400 transition-colors"
              >
                +{barchaMavzular.length - mavzular.length} ta yana →
              </Link>
            )}
          </div>
        </div>

        {/* MAQOLA STANDARTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📝</span> Maqola standartlari
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200 text-sm mb-4">
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Sarlavha (o'zbek yoki ingliz tilida)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Muallif(lar) — ism, familiya, ilmiy daraja</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Annotatsiya (100-200 so'z)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Kalit so'zlar (5-10 ta)</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Kirish qismi</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Asosiy qism (metodologiya, natijalar)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Xulosalar</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Foydalanilgan adabiyotlar ro'yxati</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
              Hajmi: 3-15 bet
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">
              Til: O'zbek, Rus, Ingliz
            </span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">
              Plagiat: 80%+ original
            </span>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📝 Barcha maqolalar admin tasdiqlashidan va plagiat tekshiruvidan o'tkaziladi
          </p>
        </div>

      </section>
    </main>
  )
}
