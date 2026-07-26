import Link from "next/link"
export default function KonformatsionIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "δ (delta)",
      name: "Delta konformatsiya",
      rang: "Moviy-ko'k",
      rangColor: "text-sky-400",
      bg: "from-sky-600/10 to-indigo-900/30 border-sky-500/30",
      buklish: "Soat mili bo'yicha",
      buklishQisqa: "↻",
      halqa: "5 a'zoli xelat halqa",
      energiyaningBarqarorligi: "Past energiyali (λ bilan tez almashinadi)",
      izoh: "Xelat halqasi soat mili bo'yicha buklangan. Etilendiamin (en) ligandi Co³⁺ yoki Cr³⁺ bilan bog'langanda C-C bog'ning buklish yo'nalishi soat mili bo'ylab bo'ladi. Bu konformatsiya λ konformatsiya bilan dinamik muvozanatda bo'lib, tez almashinadi (flip-flop).",
    },
    {
      num: 2,
      formula: "λ (lambda)",
      name: "Lambda konformatsiya",
      rang: "Indigo-binafsha",
      rangColor: "text-indigo-400",
      bg: "from-indigo-600/10 to-slate-900/30 border-indigo-500/30",
      buklish: "Soat miliga qarshi",
      buklishQisqa: "↺",
      halqa: "5 a'zoli xelat halqa",
      energiyaningBarqarorligi: "Past energiyali (δ bilan tez almashinadi)",
      izoh: "Xelat halqasi soat miliga qarshi buklangan. δ va λ konformatsiyalari bir-biriga enantiomorfik — biri ikkinchisining ko'zgudagi aksi. Odatda ikkalasi ham mavjud bo'lib, ular tez-tez bir-biriga o'tadi (interconversion).",
    },
  ]

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
            <Link href="/oquv/izomeriyasi/tuzilish" className="hover:text-blue-300">Tuzilish</Link>
            <span className="text-blue-600">›</span>
            <span className="text-sky-400 font-semibold">🌀 Konformatsion izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">🌀</span>
                Konformatsion izomeriyasi
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Xelat halqalarning buklish yo'nalishi farqi • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/konformatsion/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
                🧊 3D modelni ochish
              </Link>
              <Link href="/oquv/izomeriyasi/tuzilish" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Tuzilish bo'limi
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-600/20 border border-sky-600/30 rounded-full text-xs font-semibold text-sky-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              KAM UCHRAYDIGAN TUR • XELAT HALQA BUKLISHI
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Konformatsion izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">xalat halqalarning fazoviy shakli</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Konformatsion izomeriyada <strong className="text-sky-300">xalat (chelate) halqalar</strong>
              ikki xil <strong className="text-sky-300">buklish yo'nalishiga</strong> (conformation) ega bo'lishi mumkin.
              Kimyoviy bog'lar uzilmaydi, faqat <strong className="text-sky-300">fazoviy shakl o'zgaradi</strong>.
              Bu hodisa asosan <strong className="text-sky-300">bidentat va polidentat ligandlar</strong>
              (etilendiamin, dipiridil va hokazo) komplekslarida kuzatiladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🌀</div>
                <div className="text-2xl font-extrabold text-sky-300">δ/λ</div>
                <div className="text-xs text-sky-300 mt-1">Konformatsiya turlari</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔁</div>
                <div className="text-2xl font-extrabold text-sky-300">Flip-flop</div>
                <div className="text-xs text-sky-300 mt-1">Tez almashinuv</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-sky-300">Λ/Δ</div>
                <div className="text-xs text-sky-300 mt-1">Umumiy chiralitet</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧊</div>
                <div className="text-2xl font-extrabold text-sky-300">XRD/CD</div>
                <div className="text-xs text-sky-300 mt-1">Farqlash usullari</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/konformatsion/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-[360deg] transition-transform duration-700">🌀</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-sky-200 text-xs">δ-[Co(en)₃]³⁺</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-indigo-200 text-xs">λ-[Co(en)₃]³⁺</span>
                    {' '}— xalat halqalarning soat mili yo'nalishidagi farqini ko'ring
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

        {/* ASOSIY TA'RIF */}
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-sky-100 text-lg leading-relaxed mb-4">
              <strong className="text-sky-300 text-xl">Konformatsion izomeriyasi</strong>
              (inglizcha: <em>conformational isomerism</em> yoki <em>ring puckering</em>) —
              <strong className="text-yellow-400"> xelat halqalarning buklish yo'nalishi</strong>
              (pucker direction) farq qilishi natijasida yuzaga keladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Kimyoviy bog'lar <strong className="text-sky-300">uzilmaydi</strong> va qayta hosil bo'lmaydi,
              faqat molekulaning <strong className="text-sky-300">fazoviy shakli</strong> (konformatsiyasi) o'zgaradi.
              Bu hodisa organik kimyodagi sikloheksanning &quot;stul&quot; (chair) va &quot;qayiq&quot; (boat)
              konformatsiyalariga o'xshaydi, ammo kompleks kimyoda bu hodisa
              <strong className="text-sky-300"> xelat halqalarga</strong> xos.
            </p>
          </div>

          {/* KONSPIRATSIYA VS IZOMERIYA */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-sky-300 mb-3">⚠️ Muhim farq: konformerlar yoki izomerlar?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                <h4 className="text-sky-400 font-bold mb-2">✅ Haqiqiy konformatsion izomerlar</h4>
                <p className="text-blue-100 text-xs">Xelat halqalari <strong>barqaror</strong> va bir-biriga o'tishi sekin.</p>
                <p className="text-blue-200 text-xs mt-2">Masalan: porfirin halqasida buklish farqi.</p>
              </div>
              <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                <h4 className="text-red-400 font-bold mb-2">⚠️ Ko'pincha — tez almashinuvchi konformerlar</h4>
                <p className="text-blue-100 text-xs">δ va λ tez flip-flop qiladi, izolyatsiya qilinmaydi.</p>
                <p className="text-blue-200 text-xs mt-2">XRD da ikkala konformatsiya ko'rinadi.</p>
              </div>
            </div>
          </div>

          {/* 3 TA ASOSIY KONSEPSIYA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌀</span>
                <h3 className="font-bold text-sky-300">δ (delta) buklish</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Xelat halqasi <strong>soat mili bo'yicha</strong> buklangan.
                Ko'pincha past energiyali konformatsiya.
              </p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌀</span>
                <h3 className="font-bold text-indigo-300">λ (lambda) buklish</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Xelat halqasi <strong>soat miliga qarshi</strong> buklangan.
                δ ning enantiomorfik varianti.
              </p>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="font-bold text-purple-300">Λ/Δ (katta Lambda/Delta)</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Butun kompleksning <strong>chiralligi</strong>. 3 ta xelat halqasi bor [M(en)₃] da uchraydi.
              </p>
            </div>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Xelat halqasi δ va λ</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Alfred Werner davridan beri ma'lum bo'lgan hodisa, ammo
            <strong className="text-sky-300"> 1950-yillarda</strong> Corey va Pauling tomonidan
            stereokimyoviy tahlil qilingan. [Co(en)₃]³⁺ kabi komplekslarda eng yaqqol namoyon bo'ladi.
          </p>

          <div className="space-y-6">
            {izomerlar.map((iz) => (
              <div
                key={iz.num}
                className={`bg-gradient-to-br ${iz.bg} border rounded-3xl p-6 md:p-8 relative overflow-hidden`}
              >
                <div className="absolute top-4 right-4 text-[120px] opacity-5 font-black select-none">
                  {iz.num}
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs text-sky-300 font-bold bg-sky-900/40 px-3 py-1 rounded-full">
                          Konformatsiya {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-sky-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-sky-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  {/* Buklish ko'rgazmali */}
                  <div className="bg-slate-950/60 border border-sky-700/50 rounded-2xl p-5 mb-6">
                    <div className="text-xs text-sky-300 mb-3 font-bold">🌀 BUKLISH YO'NALISHI:</div>
                    <div className="flex items-center justify-center gap-6 flex-wrap font-mono text-lg">
                      <span className="bg-sky-950/80 px-6 py-4 rounded-xl border border-sky-600/50 flex flex-col items-center gap-2">
                        <span className="text-5xl">{iz.buklishQisqa}</span>
                        <span className="text-sky-300 font-bold">{iz.buklish}</span>
                      </span>
                      <span className="text-sky-400 font-bold text-2xl">{iz.num === 1 ? "vs" : "vs"}</span>
                      <span className="bg-indigo-950/80 px-6 py-4 rounded-xl border border-indigo-600/50 flex flex-col items-center gap-2">
                        <span className="text-5xl">{iz.num === 1 ? "↺" : "↻"}</span>
                        <span className="text-indigo-300 font-bold">{iz.num === 1 ? "λ varianti" : "δ varianti"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Halqa o'lchami</div>
                      <div className="text-base md:text-lg font-extrabold text-yellow-400">{iz.halqa}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Buklish</div>
                      <div className="text-base md:text-lg font-extrabold text-cyan-300">{iz.buklish}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Barqarorlik</div>
                      <div className="text-xs font-extrabold text-green-400">{iz.energiyaningBarqarorligi.split(" ")[0]} {iz.energiyaningBarqarorligi.split(" ")[1]}</div>
                    </div>
                  </div>

                  <div className="bg-sky-950/40 rounded-xl p-4 border border-sky-700/30">
                    <div className="text-xs text-sky-300 mb-2">⚡ Energiya farqi:</div>
                    <p className="text-sky-200 text-sm">{iz.energiyaningBarqarorligi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Λ VA Δ — BUTUN KOMPLEKS */}
        <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⚛️</span>
            Λ (katta Lambda) va Δ (katta Delta): <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">butun kompleksning chiralligi</span>
          </h2>

          <p className="text-sky-100 text-lg mb-6 leading-relaxed">
            Kichik δ va λ — bu <strong className="text-sky-300">alohida xelat halqaning</strong> buklish yo'nalishi.
            Katta <strong className="text-yellow-400">Λ va Δ</strong> — butun kompleks ionining umumiy
            <strong className="text-sky-300"> chiraliteti (qo'lqopiyligi)</strong>. [Co(en)₃]³⁺ kabi
            komplekslarda 3 ta en ligandlari birgalikda umumiy spiral shakl hosil qiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Δ izomer */}
            <div className="bg-red-900/20 border border-red-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-2 flex items-center gap-2">
                <span>Δ (katta Delta)</span>
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">Δ-[Co(en)₃]³⁺ — o'ng qo'lqopli spiral</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ Uchala xelat halqasi <strong>o'ng qo'lqopli spiral</strong> hosil qiladi</li>
                <li>✅ O'ng tomonga buruvchi (dextrorotatory)</li>
                <li>✅ Odatda <strong>λ buklishli halqalar</strong> ustunlik qiladi</li>
                <li>✅ Λ izomerining enantiomeri (ko'zgudagi aksi)</li>
              </ul>
              <div className="bg-red-950/50 rounded-xl p-4 text-sm text-blue-100 border border-red-700/30">
                <strong className="text-red-300">Eslatma:</strong> Δ (delta) — bu kompleksning umumiy
                konfiguratsiyasi, kichik δ (delta) — bu alohida halqaning buklish yo'nalishi. Ikkalasi farqli tushunchalar!
              </div>
            </div>

            {/* Λ izomer */}
            <div className="bg-indigo-900/20 border border-indigo-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-indigo-300 mb-2 flex items-center gap-2">
                <span>Λ (katta Lambda)</span>
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">Λ-[Co(en)₃]³⁺ — chap qo'lqopli spiral</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ Uchala xelat halqasi <strong>chap qo'lqopli spiral</strong> hosil qiladi</li>
                <li>✅ Chap tomonga buruvchi (levorotatory)</li>
                <li>✅ Odatda <strong>δ buklishli halqalar</strong> ustunlik qiladi</li>
                <li>✅ Δ izomerining enantiomeri</li>
              </ul>
              <div className="bg-indigo-950/50 rounded-xl p-4 text-sm text-blue-100 border border-indigo-700/30">
                <strong className="text-indigo-300">Optik izomeriya:</strong> Λ va Δ enantiomerlar — ular
                <em> optik izomeriya</em> (stereoizomeriya) turiga kiradi, konformatsion izomeriya EMAS.
              </div>
            </div>
          </div>
        </div>

        {/* STUL VS QAYIQ */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-sky-900/40 border border-indigo-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💺</span>
            Xelat halqasi konformatsiyalari: <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Stul va Qayiq</span>
          </h2>
          <div className="bg-slate-950/50 rounded-2xl p-6 md:p-8 border border-indigo-700/30">
            <p className="text-sky-100 text-lg leading-relaxed mb-4">
              Organik kimyodagi sikloheksan kabi, <strong className="text-yellow-400">xelat halqalari ham
              turli konformatsiyalarda</strong> bo'lishi mumkin. Eng muhim ikkitasi:
              <strong className="text-sky-300"> &quot;stul&quot; (chair) </strong> va
              <strong className="text-sky-300"> &quot;qayiq&quot; (boat)</strong>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-indigo-700">
                    <th className="py-3 px-4 text-sky-300 text-sm">Xususiyat</th>
                    <th className="py-3 px-4 text-sky-300 text-sm">💺 Stul (chair)</th>
                    <th className="py-3 px-4 text-sky-300 text-sm">🚣 Qayiq (boat)</th>
                  </tr>
                </thead>
                <tbody className="text-blue-100 text-sm">
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">Barqarorlik</td>
                    <td className="py-3 px-4 text-green-400 font-bold">Yuqori ✅</td>
                    <td className="py-3 px-4 text-red-400 font-bold">Past ❌</td>
                  </tr>
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">Sterik to'siq</td>
                    <td className="py-3 px-4">Minimal — atomlar uzoq</td>
                    <td className="py-3 px-4">Katta — &quot;flagpole&quot; vodorodlar</td>
                  </tr>
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">Torsion taranglik</td>
                    <td className="py-3 px-4">Past — bog'lar staggered</td>
                    <td className="py-3 px-4">Yuqori — eclipsing bor</td>
                  </tr>
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">XRD da ko'rinadi</td>
                    <td className="py-3 px-4 text-green-400">Ko'p hollarda</td>
                    <td className="py-3 px-4">Kamdan-kam</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">Energiya farqi</td>
                    <td className="py-3 px-4 text-cyan-300">~5-7 kJ/mol pastroq</td>
                    <td className="py-3 px-4 text-yellow-300">~5-7 kJ/mol balandroq</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ANALITIK USULLAR — teal-300/400 */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Konformatsion izomerlar (yoki konformerlar) juda tez almashinadi,
            shuning uchun ularni izolyatsiya qilish qiyin. Asosan quyidagi instrumental usullar ishlatiladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng ishonchli usul — kristallda halqa shakli to'g'ridan ko'rinadi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>δ buklish:</strong> soat mili bo'ylab</li>
                <li>• <strong>λ buklish:</strong> soat miliga qarshi</li>
                <li>• Burchaklar (torsion angles) aniq o'lchanadi</li>
                <li>• Ba'zan ikkala konformatsiya bitta kristallda uchraydi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-teal-300">CD spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Circular Dichroism — chirallikni sezadi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Λ izomer:</strong> musbat Cotton effekti</li>
                <li>• <strong>Δ izomer:</strong> manfiy Cotton effekti</li>
                <li>• Halqa buklish yo'nalishi ham signallarda aks etadi</li>
                <li>• Suyuq holatda ham qo'llaniladi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-teal-300">¹H NMR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Proton signallari halqa shakliga qarab farqlanadi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Stul konformatsiyada:</strong> aksial/ekvatorial protonlar farqlanadi</li>
                <li>• <strong>J-coupling:</strong> dihedral burchakka bog'liq</li>
                <li>• Haroratga bog'liq o'zgarish — tezlikni aniqlash</li>
                <li>• NOE tajribalari — yaqinlikni aniqlash</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌡️</span>
                <h3 className="text-lg font-bold text-teal-300">Dinamik NMR (DNMR)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Flip-flop tezligini o'lchash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Past haroratda:</strong> δ va λ alohida signallar beradi</li>
                <li>• <strong>Yuqori haroratda:</strong> signallar birlashadi (coalescence)</li>
                <li>• Koalescensiya haroratidan <strong>aktivatsiya energiyasi</strong> hisoblanadi</li>
                <li>• [Co(en)₃]³⁺ uchun ΔG‡ ~50-60 kJ/mol</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-blue-900/40 to-sky-900/40 border border-blue-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Konformatsiya <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-blue-700">
                  <th className="py-3 px-4 text-sky-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">δ (delta)</th>
                  <th className="py-3 px-4 text-indigo-300 text-sm">λ (lambda)</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Buklish yo'nalishi</td>
                  <td className="py-3 px-4">Soat mili bo'ylab ↻</td>
                  <td className="py-3 px-4">Soat miliga qarshi ↺</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Enantiomorfik munosabat</td>
                  <td className="py-3 px-4">λ ning aksi</td>
                  <td className="py-3 px-4">δ ning aksi</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Energiya</td>
                  <td className="py-3 px-4">Deyarli bir xil</td>
                  <td className="py-3 px-4">Deyarli bir xil</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Flip-flop tezligi</td>
                  <td className="py-3 px-4 text-yellow-300">Juda tez (xona haroratida)</td>
                  <td className="py-3 px-4 text-yellow-300">Juda tez (xona haroratida)</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">XRD da ko'rinadi</td>
                  <td className="py-3 px-4">Ba'zan ikkalasi ham</td>
                  <td className="py-3 px-4">Ba'zan ikkalasi ham</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">CD da farqi</td>
                  <td className="py-3 px-4">Qarama-qarshi Cotton signali</td>
                  <td className="py-3 px-4">Qarama-qarshi Cotton signali</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MISOLLAR */}
        <div className="bg-gradient-to-br from-sky-900/40 to-indigo-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-sky-100 mb-6 text-sm md:text-base">
            Konformatsion izomeriya nafaqat etilendiaminda, balki boshqa bidentat va polidentat ligandlarda ham uchraydi:
          </p>

          <div className="space-y-4">
            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                🔷 [Co(en)₃]³⁺ — eng klassik misol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Λ-[Co(en)₃]³⁺</p>
                  <p className="text-sky-200 text-xs">Chap qo'lqopli spiral, 3 ta δ halqa</p>
                  <p className="text-sky-300 text-xs mt-1">CD da manfiy Cotton signali</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Δ-[Co(en)₃]³⁺</p>
                  <p className="text-sky-200 text-xs">O'ng qo'lqopli spiral, 3 ta λ halqa</p>
                  <p className="text-sky-300 text-xs mt-1">CD da musbat Cotton signali</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Alfred Werner 1911-yilda [Co(en)₃]³⁺ ni optik ajratgan va bu uning nazariyasining eng kuchli isboti bo'lgan
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-indigo-400 mb-3">
                🌀 [Cu(acac)₂] — Mis(II) asetilasetonat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Tekis konformatsiya</p>
                  <p className="text-sky-200 text-xs">Kvadrat-planar geometriyada</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Egilgan konformatsiya</p>
                  <p className="text-sky-200 text-xs">Jahn-Teller effekti sababli</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Mis(II) ning <strong>d⁹ konfiguratsiyasi</strong> Jahn-Teller effekti orqali konformatsion farqlar beradi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                🧪 [Fe(porphyrin)] — Porphirin kompleksi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Planar (tekis)</p>
                  <p className="text-sky-200 text-xs">Porphirin halqasi tekis</p>
                  <p className="text-sky-300 text-xs mt-1">Gemoglobinda uchraydi</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Ruffled (to'lqinli)</p>
                  <p className="text-sky-200 text-xs">Porphirin halqasi egilgan</p>
                  <p className="text-sky-300 text-xs mt-1">Ba'zi sitoxromlarda</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Porphirin konformatsiyasi O₂ bilan bog'lanish kuchini nazorat qiladi — bu biologik jihatdan muhim!
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
          <p className="text-violet-100 mb-6 text-sm md:text-base">
            Konformatsion izomeriyaning zamonaviy fanda juda muhim qo'llanilishi bor:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Dori dizayni</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Platina asosidagi saraton dorilarida (<em>sisplatin</em> analoglari)
                xelat halqalarning konformatsiyasi <strong>DNK bilan bog'lanish</strong> kuchiga ta'sir qiladi.
                Bir konformatsiya DNK ni egib qo'yadi (samara), boshqasi — egmaydi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏭</span>
                <h3 className="text-lg font-bold text-violet-300">Asimmetrik kataliz</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Xiral ligandlar (masalan, <em>BINAP</em>) da konformatsion qattiqlik
                (conformational rigidity) <strong>enantioselektivlik</strong> uchun juda muhim.
                Qattiq konformatsiyali katalizatorlar 99% ee berishi mumkin.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-violet-300">Biologik modellar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Oqsillardagi metal bog'lanish saytlari (masalan, <em>sink barmoqlari</em>)
                ma'lum konformatsiyalarda bo'lishi kerak. Ularni modellashtirish uchun
                xelat halqalarning konformatsion afzalliklari (preferences) muhim.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔋</span>
                <h3 className="text-lg font-bold text-violet-300">Molekulyar qurilmalar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>Rotaxanes</strong> va <strong>molekulyar motorlarda</strong>
                konformatsion izomeriya — <strong>mexanik harakat</strong> asosi.
                Bir konformatsiyadan ikkinchisiga o'tish — &quot;motorning bir qadami&quot;.
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
            <div className="bg-sky-900/40 border border-sky-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏛️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">Alfred Werner (1911)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                  </div>
                  <p className="text-sky-200 text-sm mb-3">
                    <strong>1911:</strong> Werner <strong>[Co(en)₃]³⁺</strong> ni optik izomerlarga (Λ va Δ) ajratdi.
                    Bu noorganik kimyoda birinchi enantiomerlarning ajratilishi edi.
                  </p>
                  <p className="text-sky-200 text-sm">
                    <strong>Ahamiyati:</strong> Werner o'zining koordinatsion nazariyasini tasdiqladi va
                    <strong> stereoizomeriya noorganik kimyoda ham borligini</strong> ko'rsatdi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧬</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">Corey va Bailar (1959)</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1959:</strong> E.J. Corey va J.C. Bailar Jr. xelat halqalarning
                    <strong> δ va λ konformatsiyalari</strong>ni stereokimyoviy jihatdan tahlil qildi.
                    Ular &quot;stul&quot; va &quot;qayiq&quot; konformatsiyalari ham borligini ko'rsatdi va
                    ularning nisbiy barqarorligini hisoblab chiqdi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-sky-600/10 to-indigo-600/10 border border-sky-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-sky-100 list-decimal list-inside">
            <li>
              Konformatsion izomeriyasi — <strong className="text-sky-300">xalat halqalarning buklish yo'nalishi
              (conformation)</strong> farq qilganda kuzatiladigan tuzilish izomeriyasi turi.
            </li>
            <li>
              Kimyoviy bog'lar <strong>uzilmaydi</strong>, faqat molekulaning fazoviy shakli o'zgaradi.
            </li>
            <li>
              Eng muhim ikki konformatsiya: <strong className="text-sky-300">δ (delta)</strong> — soat mili bo'ylab,
              <strong className="text-sky-300"> λ (lambda)</strong> — soat miliga qarshi.
            </li>
            <li>
              Katta <strong className="text-sky-300">Λ va Δ</strong> — butun kompleksning umumiy chiraliteti
              (kichik δ/λ dan farqli!).
            </li>
            <li>
              Odatda δ va λ tez flip-flop qiladi — izolyatsiya qilib bo'lmaydi.
              <strong> Λ va Δ</strong> esa izolyatsiya qilinadi (enantiomerlar).
            </li>
            <li>
              Farqlash usullari: <strong className="text-sky-300">XRD, CD spektroskopiya, ¹H NMR, DNMR</strong>.
            </li>
            <li>
              Eng klassik misol: <strong className="text-sky-300">[Co(en)₃]³⁺</strong> — Werner 1911-yilda
              optik ajratgan.
            </li>
            <li>
              Zamonaviy qo'llanilishlar: dori dizayni, asimmetrik kataliz, molekulyar qurilmalar.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🌀</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Xalat halqalarni <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> aylantiring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda δ va λ konformatsiyalarning buklish yo'nalishini,
              Λ va Δ enantiomerlarning farqini, &quot;stul&quot; va &quot;qayiq&quot; shakllarini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/konformatsion/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/orinbosar" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← O'rinbosar izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/holat" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Holat izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Konformatsion izomeriyasi • δ/λ xalat halqalari • Werner (1911), Corey & Bailar (1959)</p>
        </div>
      </footer>
    </main>
  )
}