import Link from "next/link"
export default function OptikIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* HEADER */}
      <header className="border-b border-blue-800/50 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-blue-400 flex-wrap">
            <Link href="/" className="hover:text-blue-300">🏠 Bosh sahifa</Link>
            <span className="text-blue-600">›</span>
            <Link href="/oquv" className="hover:text-blue-300">O'quv</Link>
            <span className="text-blue-600">›</span>
            <Link href="/oquv/izomeriyasi" className="hover:text-blue-300">Izomeriyasi</Link>
            <span className="text-blue-600">›</span>
            <Link href="/oquv/izomeriyasi/stereo" className="hover:text-blue-300">Stereoizomeriya</Link>
            <span className="text-blue-600">›</span>
            <span className="text-violet-400 font-semibold">🔮 Optik izomeriya</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-300 flex items-center gap-2">
                <span className="text-3xl">🔮</span>
                Optik izomeriya
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Enantiomerlar • Xirallik • Qutblangan nur burilishi • Λ/Δ tizimi
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/stereo/optik/3d" className="text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-violet-600/30">
                🧊 3D modelni ochish
              </Link>
              <Link href="/oquv/izomeriyasi/stereo" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Stereoizomeriya
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <div className="bg-gradient-to-br from-violet-900/60 to-purple-900/60 border border-violet-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-600/20 border border-violet-600/30 rounded-full text-xs font-semibold text-violet-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              STEREOIZOMERIYA • XIRALLIK
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Optik izomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">molekulaning ko'zgudagi aksi bilan ustma-ust tushmasligi</span>
            </h2>
            <p className="text-lg md:text-xl text-violet-100 max-w-3xl mb-8 leading-relaxed">
              Optik izomeriya <strong className="text-violet-300">xiral (chiral)</strong> molekulalarda kuzatiladi.
              Xiral molekula o'zining ko'zgudagi aksi bilan <strong className="text-violet-300">ustma-ust tushmaydi</strong>
              (xuddi chap va o'ng qo'lqop kabi). Bunday izomerlar
              <strong className="text-violet-300"> enantiomerlar</strong> deb ataladi va ular
              qutblangan nurni qarama-qarshi tomonga buradi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-violet-950/50 border border-violet-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🖐️</div>
                <div className="text-2xl font-extrabold text-violet-300">Xirallik</div>
                <div className="text-xs text-violet-300 mt-1">Simmetriya yo'qligi</div>
              </div>
              <div className="bg-violet-950/50 border border-violet-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔮</div>
                <div className="text-2xl font-extrabold text-violet-300">Enantiomer</div>
                <div className="text-xs text-violet-300 mt-1">Ko'zgudagi aks</div>
              </div>
              <div className="bg-violet-950/50 border border-violet-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-2xl font-extrabold text-violet-300">Λ / Δ</div>
                <div className="text-xs text-violet-300 mt-1">Absolyut konfiguratsiya</div>
              </div>
              <div className="bg-violet-950/50 border border-violet-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📏</div>
                <div className="text-2xl font-extrabold text-violet-300">[α]D</div>
                <div className="text-xs text-violet-300 mt-1">Solishtirma burilish</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-fuchsia-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/stereo/optik/3d"
            className="relative block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 rounded-3xl p-8 md:p-10 shadow-2xl shadow-violet-600/40 transform hover:scale-[1.02] transition-all group border border-violet-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-y-180 transition-transform duration-700">🔮</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modellarni ochish
                  </h3>
                  <p className="text-violet-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-violet-200 text-xs">Λ-[Co(en)₃]³⁺</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-fuchsia-200 text-xs">Δ-[Co(en)₃]³⁺</span>
                    {' '}— Enantiomerlarning fazoviy farqini va xelat halqalarining burama shaklini ko'ring
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-5 group-hover:bg-white/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-white">Ko'rish →</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 animate-bounce">
              <span className="text-3xl">✨</span>
            </div>
          </Link>
        </div>

        {/* NAZARIY ASOS */}
        <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-violet-100 text-lg leading-relaxed mb-4">
              <strong className="text-violet-300 text-xl">Optik izomeriya</strong> — molekulaning
              <strong className="text-yellow-400"> xiralligi</strong> (chirality) natijasida yuzaga keladigan
              stereoizomeriya turi. Xiral so'zi yunoncha <em>&quot;kheir&quot;</em> (qo'l) so'zidan olingan —
              chunki chap va o'ng qo'llar bir-birining ko'zgudagi aksi bo'lsa-da, ustma-ust tushmaydi.
            </p>
            <p className="text-violet-200 leading-relaxed">
              Kompleks kimyoda optik izomeriya asosan <strong className="text-violet-300">bidentat yoki polidentat
              ligandlar</strong> (etilendiamin, oksalat, fenantrolin) ishtirok etganda kuzatiladi.
              Bu ligandlar metall atrofida <strong className="text-violet-300">&quot;propeller&quot; shaklini</strong>
              hosil qilib, molekulani xiral qiladi.
            </p>
          </div>

          {/* XIRALLIK SHARTLARI */}
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Molekula qachon xiral bo'ladi?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-900/30 border border-red-600/40 rounded-2xl p-5">
              <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <span>❌</span> Simmetriya elementlari BO'LSA → Axiral
              </h4>
              <ul className="text-blue-100 text-sm space-y-2">
                <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Simmetriya tekisligi (σ)</strong> mavjud</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Inversiya markazi (i)</strong> mavjud</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> <strong>Ayniy o'qi (Sₙ)</strong> mavjud</li>
                <li className="text-blue-300 text-xs mt-2">→ Molekula ko'zgudagi aksi bilan ustma-ust tushadi</li>
              </ul>
            </div>
            <div className="bg-green-900/30 border border-green-600/40 rounded-2xl p-5">
              <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span>✅</span> Simmetriya elementlari YO'Q BO'LSA → Xiral
              </h4>
              <ul className="text-blue-100 text-sm space-y-2">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Simmetriya tekisligi <strong>YO'Q</strong></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Inversiya markazi <strong>YO'Q</strong></li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Ayniy o'qi <strong>YO'Q</strong></li>
                <li className="text-green-300 text-xs mt-2">→ Molekula ko'zgudagi aksi bilan ustma-ust TUSHMAYDI</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-violet-700/30 rounded-xl p-4">
            <p className="text-violet-200 text-sm">
              <strong className="text-yellow-400">💡 Muhim:</strong> Oddiy aylanish o'qi (Cₙ) bo'lishi molekulani
              axiral qilmaydi! Faqat <strong>σ, i yoki Sₙ</strong> bo'lsa, molekula achiral hisoblanadi.
              Masalan, [Co(en)₃]³⁺ da C₃ o'qi bor, lekin σ va i yo'q — shuning uchun u <strong>xiral</strong>.
            </p>
          </div>
        </div>

        {/* ENANTIOMERLAR VA DIASTEREOMERLAR */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🪞</span>
            Enantiomerlar va <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Diastereomerlar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-violet-900/30 border border-violet-500/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-violet-300 mb-3 flex items-center gap-2">
                <span>🔮</span> Enantiomerlar
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Bir-birining <strong className="text-yellow-400">ko'zgudagi aksi</strong> bo'lgan va
                ustma-ust tushmaydigan stereoizomerlar.
              </p>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• <strong>Fizik xossalari:</strong> Bir xil (T_erish, T_qaynash, zichlik)</li>
                <li>• <strong>Optik faollik:</strong> Qarama-qarshi (+) va (−)</li>
                <li>• <strong>Kimyoviy xossalari:</strong> Achiral muhitda bir xil</li>
                <li>• <strong>Biologik faollik:</strong> Keskin farq qilishi mumkin!</li>
              </ul>
            </div>

            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-indigo-300 mb-3 flex items-center gap-2">
                <span>🔀</span> Diastereomerlar
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Ko'zgudagi aksi <strong className="text-yellow-400">bo'lmagan</strong> stereoizomerlar
                (enantiomer emas).
              </p>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• <strong>Fizik xossalari:</strong> Har xil (eruvchanlik, rang, T_erish)</li>
                <li>• <strong>Optik faollik:</strong> Turli qiymat va yo'nalish</li>
                <li>• <strong>Kimyoviy xossalari:</strong> Har xil reaksiya tezligi</li>
                <li>• <strong>Ajratish:</strong> Oddiy usullar bilan mumkin (kristallizatsiya)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-slate-950/60 border border-purple-700/30 rounded-xl p-5">
            <h4 className="text-purple-300 font-bold mb-2">📌 Misol: [Co(en)₂Cl₂]⁺</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-purple-950/50 rounded-lg p-3 border border-purple-700/30">
                <p className="text-green-400 font-bold mb-1">cis-Λ</p>
                <p className="text-blue-200 text-xs">Optik faol (+)</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3 border border-purple-700/30">
                <p className="text-fuchsia-400 font-bold mb-1">cis-Δ</p>
                <p className="text-blue-200 text-xs">Optik faol (−) — cis-Λ ning enantiomeri</p>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3 border border-purple-700/30">
                <p className="text-orange-400 font-bold mb-1">trans</p>
                <p className="text-blue-200 text-xs">Optik faol EMAS (simmetriya tekisligi bor)</p>
              </div>
            </div>
            <p className="text-blue-300 text-xs mt-3">
              cis-Λ va cis-Δ — <strong>enantiomerlar</strong>. cis-Λ va trans — <strong>diastereomerlar</strong>.
            </p>
          </div>
        </div>

        {/* Λ VA Δ TIZIMI */}
        <div className="bg-gradient-to-br from-fuchsia-900/40 to-violet-900/40 border border-fuchsia-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔤</span>
            Λ (Lambda) va Δ (Delta): <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Absolyut konfiguratsiya</span>
          </h2>
          <p className="text-fuchsia-100 text-lg mb-6 leading-relaxed">
            Kompleks kimyoda enantiomerlarni belgilash uchun <strong className="text-fuchsia-300">Λ/Δ tizimi</strong>
            ishlatiladi. Bu tizim xelat halqalarining metall atrofidagi
            <strong className="text-fuchsia-300"> burama (helical) yo'nalishiga</strong> asoslangan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-violet-900/30 border border-violet-500/40 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🌀</div>
              <h3 className="text-2xl font-bold text-violet-300 mb-2">Δ (Delta)</h3>
              <p className="text-blue-100 text-sm mb-3">
                Xelat halqalari <strong className="text-yellow-400">o'ng burama</strong> (right-handed helix)
              </p>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-violet-700/30">
                <p className="text-violet-200 text-xs">
                  O'ng qo'l bosh barmog'i yuqoriga qarasa, barmoqlar Δ yo'nalishida bukiladi.
                  Propeller o'ngga aylangandek.
                </p>
              </div>
            </div>

            <div className="bg-fuchsia-900/30 border border-fuchsia-500/40 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-fuchsia-300 mb-2">Λ (Lambda)</h3>
              <p className="text-blue-100 text-sm mb-3">
                Xelat halqalari <strong className="text-yellow-400">chap burama</strong> (left-handed helix)
              </p>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-fuchsia-700/30">
                <p className="text-fuchsia-200 text-xs">
                  Chap qo'l bosh barmog'i yuqoriga qarasa, barmoqlar Λ yo'nalishida bukiladi.
                  Propeller chapga aylangandek.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-400">⚠️ Diqqat:</strong> Λ/Δ belgilari
              <strong> (+)/(−) optik burilish bilan to'g'ridan-to'g'ri bog'liq EMAS</strong>!
              Δ izomer musbat yoki manfiy burilish berishi mumkin — bu eksperimental aniqlanadi.
              Λ/Δ faqat <strong>strukturaviy konfiguratsiyani</strong> bildiradi.
            </p>
          </div>
        </div>

        {/* QUTBLANGAN NUR VA POLYARIMETR */}
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Qutblangan nur va <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Polyarimetr</span>
          </h2>
          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
            Optik izomerlarni farqlashning asosiy usuli — ularning
            <strong className="text-blue-300"> qutblangan nurni burish qobiliyati</strong>.
            Oddiy yorug'lik barcha tekisliklarda tebranadi. Polyarizator orqali o'tgach,
            faqat <strong className="text-blue-300">bitta tekislikda</strong> tebranadigan nur hosil bo'ladi.
          </p>

          {/* POLYARIMETR SXEMASI */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm font-mono text-center">
              <div className="bg-yellow-950/60 px-3 py-2 rounded border border-yellow-600/50">
                <span className="text-yellow-400">💡 Yorug'lik</span>
              </div>
              <span className="text-blue-400">→</span>
              <div className="bg-blue-950/60 px-3 py-2 rounded border border-blue-600/50">
                <span className="text-blue-300">Polyarizator</span>
              </div>
              <span className="text-blue-400">→</span>
              <div className="bg-violet-950/60 px-3 py-2 rounded border border-violet-600/50">
                <span className="text-violet-300">↕ Qutblangan nur</span>
              </div>
              <span className="text-blue-400">→</span>
              <div className="bg-fuchsia-950/60 px-3 py-2 rounded border border-fuchsia-600/50">
                <span className="text-fuchsia-300">🧪 Namuna</span>
              </div>
              <span className="text-blue-400">→</span>
              <div className="bg-green-950/60 px-3 py-2 rounded border border-green-600/50">
                <span className="text-green-300">↗ Burilgan nur</span>
              </div>
              <span className="text-blue-400">→</span>
              <div className="bg-indigo-950/60 px-3 py-2 rounded border border-indigo-600/50">
                <span className="text-indigo-300">Analizator</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 border border-green-600/40 rounded-xl p-5">
              <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                <span>(+)</span> Dekstrorotator
              </h4>
              <p className="text-blue-100 text-sm">
                Qutblangan nurni <strong className="text-green-300">soat strelkasi bo'yicha</strong>
                (o'ngga) buradi. <em>d-</em> yoki <em>(+)</em> prefiksi bilan belgilanadi.
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-600/40 rounded-xl p-5">
              <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                <span>(−)</span> Levorotator
              </h4>
              <p className="text-blue-100 text-sm">
                Qutblangan nurni <strong className="text-red-300">soat strelkasiga qarshi</strong>
                (chapga) buradi. <em>l-</em> yoki <em>(−)</em> prefiksi bilan belgilanadi.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-950/50 border border-blue-700/30 rounded-xl p-5">
            <h4 className="text-blue-300 font-bold mb-2">📐 Solishtirma burilish formulasi</h4>
            <div className="bg-slate-950/60 rounded-lg p-4 text-center font-mono text-lg text-yellow-400 mb-2">
              [α]λᵀ = α / (l × c)
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-blue-200">
              <div><strong>[α]</strong> — solishtirma burilish</div>
              <div><strong>α</strong> — kuzatilgan burilish (°)</div>
              <div><strong>l</strong> — kyuveta uzunligi (dm)</div>
            </div>
            <div className="text-xs text-blue-200 mt-1"><strong>c</strong> — konsentratsiya (g/ml)</div>
          </div>
        </div>

        {/* KLASSIK MISOL */}
        <div className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            Klassik misol: <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">[Co(en)₃]³⁺</span>
          </h2>
          <p className="text-violet-100 text-lg mb-6 leading-relaxed">
            Tris(etilendiamin)kobalt(III) — optik izomeriyaning <strong className="text-violet-300">eng klassik
            va birinchi o'rganilgan</strong> misoli. Alfred Werner 1911-yilda bu kompleksni
            enantiomerlarga ajratib, koordinatsion nazariyasini tasdiqlagan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-violet-900/30 border border-violet-500/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-violet-300 mb-3">Δ-[Co(en)₃]³⁺</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• <strong>Konfiguratsiya:</strong> O'ng burama (Δ)</li>
                <li>• <strong>Optik burilish:</strong> (+) yoki (−) — eksperimental</li>
                <li>• <strong>Simmetriya:</strong> D₃ nuqta guruhi</li>
                <li>• <strong>Xelat halqalari:</strong> 3 ta en, barchasi o'ng propeller</li>
                <li>• Λ izomerining <strong>enantiomeri</strong></li>
              </ul>
            </div>
            <div className="bg-fuchsia-900/30 border border-fuchsia-500/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-fuchsia-300 mb-3">Λ-[Co(en)₃]³⁺</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• <strong>Konfiguratsiya:</strong> Chap burama (Λ)</li>
                <li>• <strong>Optik burilish:</strong> Qarama-qarshi ishora</li>
                <li>• <strong>Simmetriya:</strong> D₃ nuqta guruhi</li>
                <li>• <strong>Xelat halqalari:</strong> 3 ta en, barchasi chap propeller</li>
                <li>• Δ izomerining <strong>enantiomeri</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* REZOLYUTSIYA */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⚗️</span>
            Rezolyutsiya: <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Enantiomerlarni ajratish</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Enantiomerlarning fizik xossalari bir xil bo'lgani uchun, oddiy distillyatsiya yoki
            kristallizatsiya bilan ularni ajratib bo'lmaydi. Maxsus usullar kerak:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧂</span>
                <h3 className="text-lg font-bold text-teal-300">Diastereomer tuzlar</h3>
              </div>
              <p className="text-teal-100 text-sm">
                Rasematni <strong>xiral reagent</strong> bilan reaksiyaga kiritib,
                <strong> diastereomer tuzlar</strong> hosil qilinadi. Diastereomerlarning
                eruvchanligi har xil — kristallizatsiya bilan ajratiladi.
              </p>
            </div>
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-teal-300">Xiral xromatografiya</h3>
              </div>
              <p className="text-teal-100 text-sm">
                <strong>Xiral statsionar faza</strong> (masalan, tselluloza, siklodekstrin)
                ishlatiladi. Enantiomerlar kolonnada turli tezlikda harakatlanadi va
                alohida chiqadi.
              </p>
            </div>
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🦠</span>
                <h3 className="text-lg font-bold text-teal-300">Fermentativ</h3>
              </div>
              <p className="text-teal-100 text-sm">
                Fermentlar <strong>faqat bitta enantiomerni</strong> tanlaydi.
                Biologik usul juda selektiv, lekin sekin va qimmat.
                Farmatsevtikada keng qo'llaniladi.
              </p>
            </div>
          </div>
        </div>

        {/* AMALIY AHAMIYAT — violet-400 */}
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Amaliy <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ahamiyat</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-red-950/40 rounded-2xl p-6 border border-red-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-lg font-bold text-red-300">Talidomid fojiasi (1960)</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>(+)-talidomid</strong> — tinchlantiruvchi dori.
                <strong>(−)-talidomid</strong> — <strong>teratogen</strong> (homila rivojlanishini buzadi).
                Bu fojia farmatsevtikada <strong>enantiomer tozaligini</strong> nazorat qilish zarurligini ko'rsatdi.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Zamonaviy farmatsevtika</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Hozirda dorilar <strong>enantiomer toza</strong> shaklda ishlab chiqariladi.
                Masalan: <em>S-ibuprofen</em> (faol) vs <em>R-ibuprofen</em> (kam faol).
                FDA talabiga ko'ra har bir enantiomer alohida sinovdan o'tkaziladi.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-violet-300">Biologik tanlov</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Tabiat <strong>faqat bitta enantiomerni</strong> tanlaydi:
                oqsillar — <strong>L-aminokislotalar</strong>, DNK/RNK — <strong>D-shakarlar</strong>.
                Bu &quot;biologik xirallik&quot; hayotning asosiy xususiyati.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏭</span>
                <h3 className="text-lg font-bold text-violet-300">Asimmetrik sintez</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>Xiral katalizatorlar</strong> yordamida ma'lum bir enantiomerni
                selektiv sintez qilish. 2001-yil Nobel mukofoti (Knowles, Noyori, Sharpless)
                shu sohaga berilgan.
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-violet-900/40 border border-violet-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🍇</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-amber-400">Louis Pasteur (1848)</h3>
                  </div>
                  <p className="text-violet-200 text-sm">
                    <strong>1848:</strong> Pasteur uzum kislotasi kristallarini mikroskop ostida
                    <strong> qo'lda saralab</strong>, ikki xil enantiomerni ajratdi.
                    Bu <strong>tarixda birinchi rezolyutsiya</strong> edi.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-amber-400">Alfred Werner (1911)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                  </div>
                  <p className="text-violet-200 text-sm">
                    <strong>1911:</strong> Werner <strong>[Co(en)₃]³⁺</strong> ni enantiomerlarga ajratdi —
                    noorganik kimyoda <strong>birinchi optik rezolyutsiya</strong>.
                    Bu uning koordinatsion nazariyasining eng kuchli isboti bo'ldi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-violet-100 list-decimal list-inside">
            <li>
              Optik izomeriya — <strong className="text-violet-300">xiral molekulalar</strong>
              ko'zgudagi aksi bilan ustma-ust tushmasligi natijasida kuzatiladi.
            </li>
            <li>
              Xirallik sharti: molekulada <strong className="text-violet-300">σ, i yoki Sₙ simmetriya elementlari yo'q</strong>.
            </li>
            <li>
              <strong className="text-violet-300">Enantiomerlar</strong> — ko'zgudagi aks, fizik xossalari bir xil,
              optik burilishi qarama-qarshi.
            </li>
            <li>
              <strong className="text-violet-300">Λ/Δ tizimi</strong> — xelat halqalarining burama yo'nalishi
              (chap/o'ng). (+)/(−) bilan to'g'ridan bog'liq emas.
            </li>
            <li>
              <strong className="text-violet-300">Polyarimetr</strong> — optik faollikni o'lchash asbobi.
              Solishtirma burilish: [α] = α/(l×c).
            </li>
            <li>
              Rezolyutsiya usullari: <strong>diastereomer tuzlar, xiral xromatografiya, fermentativ</strong>.
            </li>
            <li>
              Amaliy ahamiyati: <strong>farmatsevtika (talidomid), asimmetrik sintez (Nobel 2001), biologik tanlov</strong>.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔮</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Enantiomerlarni <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">3D da</span> solishtiring!
            </h2>
            <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
              Λ va Δ-[Co(en)₃]³⁺ ning fazoviy tuzilishini, xelat halqalarining burama yo'nalishini,
              ko'zgudagi aks munosabatini interaktiv 3D modelda ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/stereo/optik/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-violet-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/stereo/geometrik" className="px-6 py-3 border border-violet-500 rounded-xl hover:bg-violet-800/50 text-violet-300 text-center">
            ← Geometrik izomeriya
          </Link>
          <Link href="/oquv/izomeriyasi" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-bold text-center">
            Izomeriyasi bo'limi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Optik izomeriya • Enantiomerlar • Λ/Δ • Pasteur (1848), Werner (1911)</p>
        </div>
      </footer>
    </main>
  )
}