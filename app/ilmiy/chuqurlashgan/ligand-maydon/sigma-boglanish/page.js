import Link from "next/link"

export default function SigmaBoglanish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Ligand maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 σ-bog'lanish LMN da</h1>
          <p className="text-purple-400 text-sm">σ-donor ligandlar • Metall orbitallari va ligand SALC lar • Bog'lovchi va bo'shashtiruvchi MO</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 σ-bog'lanish haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">σ-bog'lanish</strong> — barcha koordinatsion birikmalarda mavjud bo'lgan 
              <strong className="text-yellow-400">asosiy bog'lanish turi</strong>. Har bir ligand kamida bitta σ-donor orbitalga ega.
              LMN da 6 ta ligandning 6 ta σ-orbitallari simmetriya bo'yicha <strong>a₁g, t₁u va eg</strong> SALC larga birlashtiriladi.
              Bu SALC lar metallning <strong>s, p va d</strong> orbitallari bilan ta'sirlashib, bog'lovchi va bo'shashtiruvchi MO larni hosil qiladi.
            </p>
          </div>
        </div>

        {/* 2. QANDAY ISHLAYDIGANI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 σ-bog'lanish mexanizmi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Ligand tomoni</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Har bir ligand <strong>1 ta σ-orbital</strong> beradi (taqsimlanmagan elektron jufti)</li>
                <li>• 6 ta ligand → <strong>6 ta σ-orbital</strong></li>
                <li>• Bu 6 ta orbital <strong>SALC</strong> larga birlashtiriladi</li>
                <li>• Har bir SALC <strong>2 ta elektron</strong> tutadi (jami 12 ta e⁻)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Metall tomoni</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Metall <strong>6 ta bo'sh orbital</strong> beradi</li>
                <li>• s (1 ta), p (3 ta), d<sub>z²</sub> va d<sub>x²−y²</sub> (2 ta)</li>
                <li>• Bu orbitallar ligand SALC lar bilan <strong>bir xil simmetriyada</strong></li>
                <li>• d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> — <strong>ishtirok etmaydi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. MO LAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 σ-bog'lanish natijasida hosil bo'lgan MO lar</h2>
          
          <div className="space-y-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Bog'lovchi MO lar — jami 6 ta</h3>
              <div className="grid grid-cols-3 gap-3 text-sm text-center">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-yellow-400 font-bold">a₁g (1σ)</p>
                  <p className="text-purple-300">Eng past energiya</p>
                  <p className="text-purple-400 text-xs">2 ta e⁻</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-yellow-400 font-bold">t₁u (3σ)</p>
                  <p className="text-purple-300">O'rtacha past</p>
                  <p className="text-purple-400 text-xs">6 ta e⁻</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-yellow-400 font-bold">eg (2σ)</p>
                  <p className="text-purple-300">O'rtacha</p>
                  <p className="text-purple-400 text-xs">4 ta e⁻</p>
                </div>
              </div>
              <p className="text-purple-300 text-sm mt-3 text-center">
                <strong>Jami 12 ta elektron</strong> — ligandlarning 6 ta taqsimlanmangan juftidan keladi.
              </p>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Bo'shashtiruvchi MO lar — jami 6 ta</h3>
              <p className="text-purple-200 text-sm">
                Har bir bog'lovchi MO ga mos <strong>bo'shashtiruvchi (σ*)</strong> MO mavjud.
                Ular <strong>yuqori energiyali</strong> va odatda bo'sh bo'ladi.
              </p>
            </div>

            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-5">
              <h3 className="text-gray-400 font-bold mb-2">Bog'lamaydigan MO lar — t₂g (3 ta)</h3>
              <p className="text-purple-200 text-sm">
                Metallning <strong>dxy, dxz, dyz</strong> orbitallari hech qaysi σ-SALC bilan mos kelmaydi.
                Ular <strong>bog'lamaydigan</strong> bo'lib qoladi. Metallning d-elektronlari aynan shu yerda joylashadi.
                <strong className="text-yellow-400">Δo = E(eg*) − E(t₂g)</strong> — aynan shu farq.
              </p>
            </div>
          </div>
        </div>

        {/* 4. ENERGIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📈 MO energiya tartibi (pastdan yuqoriga)</h2>
          
          <div className="space-y-2">
            {[
              { label: "a₁g (1σ) — bog'lovchi", color: "bg-green-600/20 border-green-500/30", text: "text-green-400" },
              { label: "t₁u (3σ) — bog'lovchi", color: "bg-green-600/15 border-green-400/30", text: "text-green-300" },
              { label: "eg (2σ) — bog'lovchi", color: "bg-green-600/10 border-green-300/30", text: "text-green-200" },
              { label: "t₂g — bog'lamaydigan (d-elektronlar)", color: "bg-gray-600/20 border-gray-500/30", text: "text-gray-400" },
              { label: "eg* (2σ*) — bo'shashtiruvchi", color: "bg-red-600/10 border-red-500/30", text: "text-red-400" },
              { label: "a₁g*, t₁u* — bo'shashtiruvchi", color: "bg-red-600/5 border-red-400/30", text: "text-red-300" },
            ].map((r, i) => (
              <div key={i} className={`${r.color} rounded-xl p-4 text-center`}>
                <span className={`font-bold ${r.text}`}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Har bir ligand <strong>1 ta σ-donor orbital</strong> beradi — jami 6 ta</li>
            <li>6 ta σ-orbital simmetriya bo'yicha <strong>a₁g, t₁u, eg</strong> SALC larga ajraladi</li>
            <li>12 ta elektron <strong>bog'lovchi MO larga</strong> joylashadi (ligandlardan)</li>
            <li>Metall d-elektronlari <strong>t₂g (bog'lamaydigan)</strong> orbitallarda</li>
            <li>Δo = E(eg*) − E(t₂g) — t₂g va eg* orasidagi farq</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/asoslari" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← LMN asoslari</Link>
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/pi-boglanish" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">π-bog'lanish →</Link>
        </div>

      </section>
    </main>
  )
}