import Link from "next/link"

export default function DOrbitalShakli() {
  const orbitallar = [
    {
      nomi: "dxy",
      shape: "To'rt bo'lakli — o'qlar orasida",
      tekislik: "xz va yz tekisliklari",
      desc: "4 ta bo'lak x va y o'qlari orasida (45° burchak ostida) joylashgan. x va y o'qlarida tugun tekisliklari mavjud.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Ligandlar yo'nalishida emas — energiyasi pastroq.",
      guruh: "t₂g",
      energiya: "−0.4Δo ↓",
      rang: "text-red-400"
    },
    {
      nomi: "dxz",
      shape: "To'rt bo'lakli — o'qlar orasida",
      tekislik: "xy va yz tekisliklari",
      desc: "4 ta bo'lak x va z o'qlari orasida joylashgan. x va z o'qlarida tugun tekisliklari mavjud.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Energiyasi pasaygan (stabillashgan).",
      guruh: "t₂g",
      energiya: "−0.4Δo ↓",
      rang: "text-green-400"
    },
    {
      nomi: "dyz",
      shape: "To'rt bo'lakli — o'qlar orasida",
      tekislik: "xy va xz tekisliklari",
      desc: "4 ta bo'lak y va z o'qlari orasida joylashgan. y va z o'qlarida tugun tekisliklari mavjud.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Energiyasi pasaygan (stabillashgan).",
      guruh: "t₂g",
      energiya: "−0.4Δo ↓",
      rang: "text-blue-400"
    },
    {
      nomi: "dz²",
      shape: "Ikki bo'lakli + halqa (dumbbell + donut)",
      tekislik: "xy tekisligida halqa",
      desc: "2 ta katta bo'lak z o'qi bo'ylab + ekvatorial halqa (donut shaklida). Boshqa orbitallardan keskin farq qiladi. Shakli eng murakkab.",
      ahamiyat: "Oktaedrik maydonda eg guruhiga kiradi. Shakli boshqa orbitallardan farq qilgani uchun alohida energiyaga ega.",
      guruh: "eg",
      energiya: "+0.6Δo ↑",
      rang: "text-orange-400"
    },
    {
      nomi: "dx²−y²",
      shape: "To'rt bo'lakli — o'qlar ustida",
      tekislik: "xz va yz tekisliklari (45° da)",
      desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida joylashgan. Ligandlar aynan shu orbital yo'nalishida bo'ladi.",
      ahamiyat: "Oktaedrik maydonda ligandlar aynan shu orbital yo'nalishida joylashadi — eng yuqori energiyaga ega bo'ladi (eg guruhida).",
      guruh: "eg",
      energiya: "+0.6Δo ↑",
      rang: "text-pink-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🎯 d-orbitallarning shakli</h1>
          <p className="text-purple-400 text-sm">5 ta d-orbital • Shakli va fazoviy yo'nalishi • 3D model</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-purple-200">Barcha 5 ta d-orbital — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 d-orbitallar haqida</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-orbitallar</strong> — burchak momenti l = 2 bo'lgan orbitallar.
              Hammasi bo'lib <strong>5 ta</strong> d-orbital mavjud. Ularning shakli va fazoviy yo'nalishi
              <strong className="text-yellow-400"> kompleks birikmalarning geometriyasini, rangini va magnit xossalarini</strong> belgilaydi.
              Erkin ionda barcha 5 ta orbital <strong>bir xil energiyaga</strong> ega (degenerat holat).
            </p>
          </div>
        </div>

        {/* 5 TA ORBITAL */}
        <div className="space-y-6">
          {orbitallar.map((o, i) => (
            <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-4xl font-extrabold font-mono ${o.rang}`}>{o.nomi}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{o.shape}</h3>
                  <p className="text-purple-400 text-sm">Tugun tekisliklari: {o.tekislik}</p>
                </div>
              </div>
              <p className="text-purple-200 leading-relaxed mb-4">{o.desc}</p>
              
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h4 className="text-yellow-400 font-bold text-sm mb-2">🧪 Komplekslar uchun ahamiyati:</h4>
                <p className="text-purple-300 text-sm">{o.ahamiyat}</p>
              </div>
            </div>
          ))}
        </div>

        {/* JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Oktaedrik maydonda d-orbitallar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Orbital</th>
                <th className="py-3 px-4 text-purple-300">Guruh</th>
                <th className="py-3 px-4 text-purple-300">Energiya</th>
                <th className="py-3 px-4 text-purple-300">Yo'nalishi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-mono text-red-400">dxy</td><td className="py-3 px-4 text-green-400 font-bold">t₂g</td><td className="py-3 px-4">−0.4Δo</td><td className="py-3 px-4 text-sm">O'qlar orasida</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-mono text-green-400">dxz</td><td className="py-3 px-4 text-green-400 font-bold">t₂g</td><td className="py-3 px-4">−0.4Δo</td><td className="py-3 px-4 text-sm">O'qlar orasida</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-mono text-blue-400">dyz</td><td className="py-3 px-4 text-green-400 font-bold">t₂g</td><td className="py-3 px-4">−0.4Δo</td><td className="py-3 px-4 text-sm">O'qlar orasida</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-mono text-orange-400">dz²</td><td className="py-3 px-4 text-red-400 font-bold">eg</td><td className="py-3 px-4">+0.6Δo</td><td className="py-3 px-4 text-sm">z o'qi bo'ylab</td></tr>
                <tr><td className="py-3 px-4 font-mono text-pink-400">dx²−y²</td><td className="py-3 px-4 text-red-400 font-bold">eg</td><td className="py-3 px-4">+0.6Δo</td><td className="py-3 px-4 text-sm">x va y o'qlarida</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>5 ta d-orbital: <strong className="text-yellow-400">dxy, dxz, dyz, dz², dx²−y²</strong></li>
            <li>Oktaedrik maydonda: <strong>t₂g (3 ta) — stabillashgan, eg (2 ta) — destabillashgan</strong></li>
            <li>dx²−y² — ligandlar yo'nalishida, <strong>eng yuqori energiya</strong></li>
            <li>Orbitallarning shakli — rang, magnit xossasi va geometriyaning <strong>asosiy sababi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kvant sonlar</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">d-orbital energiyasi →</Link>
        </div>

      </section>
    </main>
  )
}