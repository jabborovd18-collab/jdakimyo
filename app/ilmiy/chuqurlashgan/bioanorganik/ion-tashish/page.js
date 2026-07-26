import Link from "next/link"

/**
 * Ion tashish bo'limining bosh sahifasi.
 *
 * Eslatma: bu faylda avval butunlay boshqa mazmun turardi — "Kompleks
 * birikmalar izomeriyasi" sahifasi (funksiya nomi ham `Izomeriyasi` edi).
 * Natijada:
 *   • bo'limga kirgan talaba mutlaqo boshqa mavzuni ko'rardi
 *   • bo'limning uchta sahifasiga havola yo'q edi
 *   • Na-K nasos sahifasiga umuman kirib bo'lmasdi
 *
 * Quyidagi sarlavha va tavsiflar sahifalarning O'Z matnidan olingan.
 */
const SAHIFALAR = [
  {
    href: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/na-k-kanal",
    icon: "⚡",
    title: "Na⁺/K⁺-ATPase (Na-K nasos)",
    desc: "Membrana transporti • Nobel mukofoti 1997",
    accent: "text-cyan-400",
    hover: "group-hover:text-cyan-400",
    border: "hover:border-cyan-400/60",
  },
  {
    href: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/ca-nasos",
    icon: "🔋",
    title: "Ca²⁺ nasos (Ca-ATPase)",
    desc: "Ion tashish mexanizmlari",
    accent: "text-amber-400",
    hover: "group-hover:text-amber-400",
    border: "hover:border-amber-400/60",
  },
  {
    href: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin",
    icon: "🩸",
    title: "Transferrin",
    desc: "Fe³⁺ tashish • Karbonat ko'prigi • Endotsitoz",
    accent: "text-rose-400",
    hover: "group-hover:text-rose-400",
    border: "hover:border-rose-400/60",
  },
]

export default function IonTashish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <header className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-purple-800/50">
        <Link
          href="/ilmiy/chuqurlashgan/bioanorganik"
          className="text-purple-400 hover:text-purple-300 text-lg shrink-0"
        >
          ←
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
            🔄 Ion tashish
          </h1>
          <p className="text-purple-400 text-sm">
            Biologik membranalar orqali ion transporti
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 sm:p-6">
          <p className="text-purple-200 text-sm leading-relaxed">
            Hujayra ichidagi ion konsentratsiyasi tashqarisidagidan keskin farq
            qiladi. Bu farqni saqlab turish uchun maxsus oqsillar ionlarni
            membrana orqali faol tashiydi — koordinatsion kimyoning tirik
            organizmdagi eng aniq ko&apos;rinishlaridan biri.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {SAHIFALAR.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group flex items-center gap-4 bg-purple-900/30 border border-purple-700/50 ${s.border} rounded-2xl p-4 sm:p-5 transition-all hover:bg-purple-900/50`}
            >
              <span className="text-3xl sm:text-4xl shrink-0">{s.icon}</span>
              <div className="min-w-0 flex-1">
                <h2 className={`font-bold text-base sm:text-lg text-white ${s.hover} transition-colors`}>
                  {s.title}
                </h2>
                <p className="text-purple-300 text-xs sm:text-sm mt-0.5">{s.desc}</p>
              </div>
              <span className={`${s.accent} group-hover:translate-x-1 transition-transform shrink-0`}>
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <Link
            href="/ilmiy/chuqurlashgan/bioanorganik"
            className="px-6 py-3 border border-purple-600/50 rounded-xl hover:bg-purple-800/40 text-purple-300 text-center text-sm transition-colors"
          >
            ← Bioanorganik kimyo
          </Link>
          <Link
            href="/ilmiy/chuqurlashgan"
            className="px-6 py-3 bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-semibold text-center text-sm transition-colors"
          >
            Chuqurlashgan bo&apos;lim →
          </Link>
        </div>
      </section>
    </main>
  )
}
