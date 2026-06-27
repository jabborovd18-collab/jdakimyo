import Link from "next/link"

export default function VideoDarsliklar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
          <span>←</span>
          <span>Orqaga</span>
        </Link>
        <div className="h-8 w-px bg-purple-800"></div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🎬 Video darsliklar va Quiz
          </h1>
          <p className="text-purple-400 text-sm">O'z bilimingizni sinab ko'ring • Premium kontent</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-400 mb-4">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              PREMIUM TA'LIM KONTENTLARI
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Kompleks birikmalar kimyosini
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                professional darajada o'rganing
              </span>
            </h2>
            
            <p className="text-purple-200 text-lg mb-8 max-w-2xl">
              Yirik savol bazasidan tuzilgan interaktiv testlar va professional video darsliklar. 
              Har safar yangi savollar, batafsil tushuntirishlar va PDF natijalar bilan.
            </p>

            {/* Umumiy statistika */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-yellow-400">5</div>
                <div className="text-purple-400 text-xs">Mavzu</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-yellow-400">500+</div>
                <div className="text-purple-400 text-xs">Savollar bazasi</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">🎬</div>
                <div className="text-2xl font-bold text-yellow-400">20+</div>
                <div className="text-purple-400 text-xs">Video darslik</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-yellow-400">PDF</div>
                <div className="text-purple-400 text-xs">Sertifikat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Asosiy kartalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Quiz Test */}
          <Link 
            href="/oquv/video-darsliklar/quiz" 
            className="group bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/10 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                  📝
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  BEPUL
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                Quiz Test
              </h2>
              <p className="text-purple-300 mb-6 leading-relaxed">
                Koordinatsion kimyo bo'yicha bilimingizni sinab ko'ring. Har safar yangi savollar va batafsil tushuntirishlar.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  5 ta mavzu
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  Yirik baza
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  PDF natija
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  Takrorlanmaydi
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-purple-700/30">
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <span>🎯</span>
                  <span>20 ta tasodifiy savol</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  <span>Boshlash</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Video darsliklar — Tez kunda */}
          <div className="group bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-700/50 rounded-3xl p-8 relative overflow-hidden opacity-70 cursor-not-allowed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/20">
                  🎬
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full text-xs font-semibold">
                  <span>⏳</span>
                  TEZ KUNDA
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Video darsliklar
              </h2>
              <p className="text-purple-300 mb-6 leading-relaxed">
                Barcha mavzular bo'yicha professional video darsliklar. 3D modellar va interaktiv tushuntirishlar.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  20+ video
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  3D modellar
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  Sertifikat
                </span>
                <span className="bg-purple-950/50 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs">
                  Premium
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-purple-700/30">
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <span>🔒</span>
                  <span>Obuna talab etiladi</span>
                </div>
                <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
                  <span>Tez kunda</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Qanday ishlaydi */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 mb-10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span>🎯</span>
            Quiz qanday ishlaydi?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-yellow-500/20">
                1
              </div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">Mavzuni tanlang</h4>
              <p className="text-purple-300 text-sm leading-relaxed">
                5 ta mavzudan birini yoki barcha mavzulardan aralash testni tanlang.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-yellow-500/20">
                2
              </div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">20 ta savolga javob bering</h4>
              <p className="text-purple-300 text-sm leading-relaxed">
                Har bir savolda 4 ta variant, tasdiqlash tugmasi va batafsil tushuntirish.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-yellow-500/20">
                3
              </div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">PDF natijani yuklab oling</h4>
              <p className="text-purple-300 text-sm leading-relaxed">
                Natijalar varaqchasi bilan premium PDF. Ismingiz bilan birga.
              </p>
            </div>
          </div>
        </div>

        {/* Afzalliklar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-green-500/20">
                🔄
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Takrorlanmaydigan savollar</h4>
                <p className="text-purple-300 text-sm leading-relaxed">
                  Har bir testda yirik bazadan yangi savollar tanlanadi. Oldingi savollar chiqarib tashlanadi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-blue-500/20">
                📚
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Batafsil tushuntirishlar</h4>
                <p className="text-purple-300 text-sm leading-relaxed">
                  Har bir savol uchun to'liq tushuntirish. Xato javoblaringizni qayta o'rganing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-purple-500/20">
                📊
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Progress tracking</h4>
                <p className="text-purple-300 text-sm leading-relaxed">
                  Barcha testlaringiz statistikasi saqlanadi. O'sish dinamikasini kuzatib boring.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-pink-500/20">
                📄
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">PDF sertifikat</h4>
                <p className="text-purple-300 text-sm leading-relaxed">
                  Natijalaringizni PDF formatida yuklab oling. Ismingiz bilan birga rasmiy hujjat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mavzular ro'yxati */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 mb-10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span>📋</span>
            Mavzular
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                📖
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Nomlanishi</div>
                <div className="text-purple-400 text-xs">IUPAC qoidalari, ligandlar, formula yozish</div>
              </div>
              <span className="text-green-400 text-xs font-semibold">✓ Tayyor</span>
            </div>

            <div className="flex items-center gap-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-xl flex-shrink-0">
                📊
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Klassifikatsiyasi</div>
                <div className="text-purple-400 text-xs">Sinf, ligand, zaryad bo'yicha tasniflash</div>
              </div>
              <span className="text-green-400 text-xs font-semibold">✓ Tayyor</span>
            </div>

            <div className="flex items-center gap-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl flex-shrink-0">
                💎
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Fazoviy tuzilishi</div>
                <div className="text-purple-400 text-xs">Geometriya, gibridlanish, VSEPR</div>
              </div>
              <span className="text-green-400 text-xs font-semibold">✓ Tayyor</span>
            </div>

            <div className="flex items-center gap-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-xl flex-shrink-0">
                🔄
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Izomeriyasi</div>
                <div className="text-purple-400 text-xs">Geometrik, optik, linkage izomerlar</div>
              </div>
              <span className="text-green-400 text-xs font-semibold">✓ Tayyor</span>
            </div>

            <div className="flex items-center gap-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xl flex-shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Aralash test</div>
                <div className="text-purple-400 text-xs">Barcha mavzulardan 20 ta savol</div>
              </div>
              <span className="text-green-400 text-xs font-semibold">✓ Tayyor</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-8 text-center mb-10">
          <h3 className="text-2xl font-bold text-white mb-4">
            🚀 Bilimingizni sinab ko'rishga tayyormisiz?
          </h3>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
            Hoziroq birinchi testni boshlang va natijalaringizni kuzatib boring. Har bir test — bu yangi bilim!
          </p>
          <Link
            href="/oquv/video-darsliklar/quiz"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            <span>📝</span>
            <span>Quizni boshlash</span>
            <span>→</span>
          </Link>
        </div>

        {/* Manba */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 text-center mb-6">
          <p className="text-purple-300 text-sm mb-2">
            📚 <strong>Manba:</strong> A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
          <p className="text-purple-400 text-xs">
            Barcha test savollari akademik manbalar asosida tuzilgan
          </p>
        </div>

        {/* Footer */}
        <footer className="border-t border-purple-800/30 pt-6 text-center">
          <p className="text-purple-500 text-xs">
            © 2026 JDA KIMYO • jdakimyo.uz • @diyorbek_jabborov
          </p>
        </footer>

      </section>
    </main>
  )
}