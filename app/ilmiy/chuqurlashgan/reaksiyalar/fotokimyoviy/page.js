import Link from "next/link"

export default function FotokimyoviyReaksiyalar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">💡 Fotokimyoviy reaksiyalar</h1>
          <p className="text-purple-400 text-sm">Ligand fotodissotsiatsiyasi • Fotoizomerlanish • Fotoredoks kataliz</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Fotokimyoviy reaksiyalar haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Fotokimyoviy reaksiyalar</strong> — yorug'lik ta'sirida 
              <strong className="text-yellow-400"> qo'zg'algan holatlar orqali</strong> boradigan kimyoviy 
              o'zgarishlar. Kompleks birikmalarda <strong>MLCT, MC (d−d) va LMCT</strong> qo'zg'algan 
              holatlar turli fotokimyoviy reaksiyalarga olib keladi: ligand ajralishi (fotosubstitutsiya), 
              fotoizomerlanish, fotooksidlanish-qaytarilish. Bu reaksiyalar <strong>termal reaksiyalardan 
              farqli mahsulotlar</strong> berishi mumkin — yorug'lik yordamida kinetik to'siqlarni yengib o'tadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Fotokimyoviy reaksiya turlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Fotosubstitutsiya:</strong> ML₆ + hν → ML₅ + L, so'ng L' birikadi</li>
                <li>• <strong>Fotoizomerlanish:</strong> sis ↔ trans, nitro ↔ nitrito yorug'lik ta'sirida</li>
                <li>• <strong>Fotoredoks:</strong> *MLCT holatdan elektron ko'chishi orqali redoks reaksiya</li>
                <li>• <strong>Fotoparchalanish:</strong> Kompleksning qaytmas parchalanishi (fotodegradatsiya)</li>
                <li>• <strong>Fotodimerlanish:</strong> Ikki molekulaning yorug'lik ta'sirida birikishi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Termal vs Fotokimyoviy</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Xususiyat</th><th className="text-left py-2 text-red-400">Termal</th><th className="text-left py-2 text-yellow-400">Fotokimyoviy</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Aktivatsiya","Issiqlik (ΔG‡)","Yorug'lik (hν)"],["Selektivlik","Termodinamik nazorat","Kinetik nazorat (qo'zg'algan holat)"],["Mahsulot","Eng barqaror mahsulot","Kinetik mahsulot (har xil bo'lishi mumkin)"],["Harorat","Yuqori harorat talab qiladi","Past haroratda ham ishlaydi"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5">{r[0]}</td><td className="py-1.5 text-red-300">{r[1]}</td><td className="py-1.5 text-yellow-300">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. FOTOSUBSTITUTSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">☀️ Fotosubstitutsiya — ligandning yorug'lik ta'sirida almashinuvi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Fotosubstitutsiya</strong> — eng ko'p uchraydigan fotokimyoviy 
            reaksiya. Qo'zg'algan holatda metall-ligand bog'i kuchsizlanadi va ligand ajraladi.
            <strong>MC (d−d) qo'zg'algan holatlar</strong> ligand ajralishi uchun ayniqsa samarali — 
            ularning energiyasi M−L bog'ining uzilishiga sarflanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">[Cr(NH₃)₆]³⁺ fotosubstitutsiyasi</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong>Termal reaksiya:</strong> [Cr(NH₃)₆]³⁺ + H₂O → [Cr(NH₃)₅(H₂O)]³⁺ — JUDA SEKIN (inert)</p>
                <p><strong>Fotokimyoviy:</strong> [Cr(NH₃)₆]³⁺ + hν → *[Cr(NH₃)₆]³⁺ → [Cr(NH₃)₅]³⁺ + NH₃</p>
                <p className="text-yellow-400 mt-2"><strong>Kvant unumi:</strong> Φ ≈ 0.3−0.5 (juda samarali!)</p>
                <p className="text-purple-300">Sababi: ⁴T₂g ← ⁴A₂g qo'zg'alish → e_g orbitalda elektron → M−L bog'i kuchsizlanadi</p>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">[Ru(bpy)₃]²⁺ fotosubstitutsiyasi</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong>³MLCT holat:</strong> Barqaror (τ ≈ 1 μs) — fotosubstitutsiya yo'q</p>
                <p><strong>³MC holat:</strong> Termal aktivatsiya (ΔE ≈ 3600 sm⁻¹) — bpy ajraladi!</p>
                <p className="text-yellow-400 mt-2"><strong>Fotoparchalanish:</strong> Yuqori haroratda yoki UV nurlanishda</p>
                <p className="text-purple-300">³MC holatda Ru−N bog'lari cho'zilgan — ligand oson ajraladi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOTOIZOMERLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Fotoizomerlanish — yorug'lik yordamida izomerlararo o'tish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Fotoizomerlanish</strong> — yorug'lik ta'sirida bir izomerdan 
            ikkinchisiga o'tish. Termal izomerlanishdan farqli o'laroq, <strong>kinetik nazorat</strong> ostida 
            boradi va ko'pincha <strong>termodinamik barqaror bo'lmagan izomer</strong> ni olish imkonini beradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nitro → Nitrito fotoizomerlanish</h3>
              <p className="text-purple-200 text-xs mb-2">
                [Co(NH₃)₅NO₂]²⁺ + hν (UV) → [Co(NH₃)₅ONO]²⁺
              </p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• Nitro (N-bog'langan) — termodinamik barqaror</li>
                <li>• Nitrito (O-bog'langan) — fotokimyoviy mahsulot</li>
                <li>• Qaytish: qizdirilganda yana nitro ga o'tadi</li>
                <li>• <strong>LMCT qo'zg'alish</strong> orqali boradi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">sis/trans fotoizomerlanish</h3>
              <p className="text-purple-200 text-xs mb-2">
                trans-[PtCl₂(py)₂] + hν → sis-[PtCl₂(py)₂]
              </p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• Kvadrat planar komplekslarda kuzatiladi</li>
                <li>• MC qo'zg'algan holat orqali</li>
                <li>• Oraliq holat — tetraedrik geometriya</li>
                <li>• <strong>Φ ≈ 0.1−0.3</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. FOTOREDOKS KATALIZ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Fotoredoks kataliz — yorug'lik bilan redoks reaksiyalar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Fotoredoks kataliz</strong> — qo'zg'algan holatning kuchli 
            oksidlovchi va qaytaruvchi xossalaridan foydalanish. <strong>[Ru(bpy)₃]²⁺</strong> va 
            <strong>[Ir(ppy)₃]</strong> eng ko'p qo'llaniladigan fotoredoks katalizatorlari.
            So'nggi 10 yilda organik sintezda <strong>ingilobiy o'zgarish</strong> yasagan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Fotoredoks kataliz sikli:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Qo'zg'alish:</strong> PS + hν → *PS (ko'rinadigan yorug'lik — ko'k LED)</p>
              <p><strong className="text-yellow-400">2. Oksidlovchi so'ndirish:</strong> *PS + A → PS⁺ + A⁻ (elektron akseptorga uzatiladi)</p>
              <p><strong className="text-yellow-400">3. Qaytaruvchi so'ndirish:</strong> *PS + D → PS⁻ + D⁺ (elektron donordan olinadi)</p>
              <p className="text-yellow-300 mt-2"><strong>Natija:</strong> Bir vaqtning o'zida kuchli oksidlovchi (PS⁺) va kuchli qaytaruvchi (PS⁻) hosil bo'ladi — ikkala yo'nalishda ham reaksiya boradi!</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { catalyst: "[Ru(bpy)₃]²⁺", light: "Ko'k LED (450 nm)", ePot: "*Ru²⁺ → Ru³⁺: −0.86V", app: "Trifluorometillash" },
              { catalyst: "[Ir(ppy)₃]", light: "Ko'k LED (450 nm)", ePot: "*Ir³⁺ → Ir⁴⁺: −1.73V", app: "C−H aktivlashtirish" },
              { catalyst: "Organik bo'yoqlar", light: "Yashil LED (525 nm)", ePot: "Turli xil", app: "Metal-free fotoredoks" },
            ].map((r, i) => (
              <div key={i} className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-bold font-mono">{r.catalyst}</p>
                <p className="text-white mt-1">{r.light}</p>
                <p className="text-purple-400 mt-1">{r.ePot}</p>
                <p className="text-green-400 mt-1">{r.app}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Fotosubstitutsiya — <strong className="text-yellow-400">MC qo'zg'algan holat</strong> orqali ligand ajralishi</li>
            <li>Fotoizomerlanish — <strong className="text-yellow-400">yorug'lik yordamida kinetik mahsulot</strong> olish</li>
            <li>Fotoredoks kataliz — <strong className="text-yellow-400">bir vaqtda oksidlovchi va qaytaruvchi</strong> hosil qilish</li>
            <li>Termal va fotokimyoviy reaksiyalar — <strong className="text-yellow-400">turli mahsulotlar</strong> berishi mumkin</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/katalitik-sikllar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Katalitik sikllar</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/kislota-asos" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Kislota-asos reaksiyalari →</Link>
        </div>

      </section>
    </main>
  )
}