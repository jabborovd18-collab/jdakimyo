import Link from "next/link"

export default function BiologikTizimlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧬 Biologik supramolekulyar tizimlar</h1>
          <p className="text-purple-400 text-sm">DNK origami • Oqsil-protein o'zaro ta'siri • Dori yetkazish • Membrana kanallari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Biologik supramolekulyar tizimlar haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Biologik supramolekulyar tizimlar</strong> — tirik 
              organizmlarda <strong>kovalent bo'lmagan o'zaro ta'sirlar</strong> orqali hosil bo'ladigan 
              murakkab tuzilmalar. DNK qo'sh spirali, oqsil folding, membrana tuzilishi, ferment-substrat 
              tanib olish — bularning barchasi <strong>supramolekulyar kimyo prinsiplariga</strong> 
              asoslangan. Sun'iy supramolekulyar tizimlar biologik jarayonlarni <strong>taqlid qilish 
              (biomimetika)</strong> va <strong>dori yetkazib berish</strong> uchun ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Biologik supramolekulyar o'zaro ta'sirlar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Tizim</th><th className="text-left py-2 text-cyan-400">Asosiy o'zaro ta'sir</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["DNK qo'sh spirali","Vodorod bog'lar (A=T, G≡C), π−π stacking"],["Oqsil folding","Vodorod bog'lar, gidrofob effekt, Van der Waals"],["Ferment-substrat","Vodorod bog'lar, elektrostatik, gidrofob"],["Membrana lipid qo'sh qavati","Gidrofob effekt — asosiy harakatlantiruvchi kuch"],["Antigen-antitelo","Vodorod bog'lar, Van der Waals, elektrostatik"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-bold text-cyan-400 text-xs">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td></tr>))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Sun'iy biologik tizimlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>DNK origami:</strong> DNK dan 2D/3D nanostrukturalar yaratish</li>
                <li>• <strong>Supramolekulyar gidrogellar:</strong> Dori yetkazish uchun stimulga sezgir materiallar</li>
                <li>• <strong>Sintetik ion kanallari:</strong> Membrana orqali ion tashish</li>
                <li>• <strong>Host-guest dori yetkazish:</strong> Siklodekstrin, kaliksaren — dori komplekslari</li>
                <li>• <strong>Metalloprotein mimetiklari:</strong> Sun'iy fermentlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. DNK ORIGAMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 DNK origami — nanomasshtabdagi aniq arxitektura</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">DNK origami (Paul Rothemund, 2006)</strong> — uzun DNK 
            zanjirini <strong>yuzlab qisqa DNK shtapellari</strong> yordamida kerakli 2D yoki 3D 
            shaklga yig'ish texnologiyasi. Bu <strong>Vatson-Krik juftlashuvi</strong> (A=T, G≡C) 
            orqali aniq supramolekulyar o'z-o'zini yig'ishga asoslangan. DNK origami strukturalari 
            <strong>dori yetkazish, biosensorlar va molekulyar elektronika</strong> uchun platforma 
            bo'lib xizmat qiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { shape: "2D shakllar", examples: "Uchburchak, kvadrat, yulduz, kulib turgan yuz (smiley)", size: "~100 nm", note: "100+ shtapel zanjirlari" },
              { shape: "3D strukturalar", examples: "Kub, tetraedr, sfera, nanokonteyner", size: "~50−500 nm", note: "Dori yuklash uchun qulflanadigan qopqoq" },
              { shape: "DNK nanorobotlar", examples: "Molekulyar qulf, ochiladigan konteyner", size: "~30−50 nm", note: "Saraton hujayralarini tanib olib ochiladi" },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-3">
                <p className="text-cyan-400 font-bold">{r.shape}</p>
                <p className="text-purple-300 mt-1">{r.examples}</p>
                <p className="text-yellow-400 mt-1">O'lcham: {r.size}</p>
                <p className="text-purple-500 mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DORI YETKAZISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Supramolekulyar dori yetkazish tizimlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Supramolekulyar dori yetkazish</strong> — dorining 
            <strong>eruvchanligini oshirish, nojo'ya ta'sirlarni kamaytirish va targetli yetkazish</strong> 
            uchun host-guest komplekslardan foydalanadi. <strong>Siklodekstrinlar</strong> — eng ko'p 
            qo'llaniladigan host molekulalar. Ular gidrofob dorilarni o'z bo'shlig'iga olib, 
            suvda eruvchanligini 100−1000 marta oshiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-3">Siklodekstrin-dori komplekslari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>β-CD:</strong> 7 glyukoza birligi, bo'shliq ~6.0−6.5 Å</li>
                <li>• <strong>Dori:</strong> Gidrofob molekula (masalan, ibuprofen, doksorubitsin)</li>
                <li>• <strong>Mexanizm:</strong> Dori CD bo'shlig'iga kiradi — gidrofob o'zaro ta'sir</li>
                <li>• <strong>Natija:</strong> Eruvchanlik 100−1000× ortadi, bioavailability yaxshilanadi</li>
                <li>• <strong>FDA tasdiqlangan:</strong> Itrakonazol-CD, Ziprasidon-CD</li>
              </ul>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold text-sm mb-3">Stimulga sezgir gidrogellar</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>pH-sezgir:</strong> Saraton hujayralari kislotali muhit (pH 5.5−6.5) — gel shishadi → dori ajraladi</li>
                <li>• <strong>Harorat-sezgir:</strong> PNIPAM asosidagi gellar — 37°C da yig'iladi</li>
                <li>• <strong>Ferment-sezgir:</strong> Saraton hujayralaridagi MMP fermentlari — gel degradatsiyasi</li>
                <li>• <strong>Redoks-sezgir:</strong> GSH yuqori konsentratsiyasi — disulfid bog'lari uziladi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Biologik tizimlar — <strong className="text-cyan-400">supramolekulyar o'zaro ta'sirlar</strong> asosida ishlaydi</li>
            <li>DNK origami — <strong className="text-cyan-400">Vatson-Krik juftlashuvi orqali</strong> aniq nanostrukturalar</li>
            <li>Siklodekstrinlar — <strong className="text-cyan-400">dori eruvchanligini 100−1000× oshiradi</strong></li>
            <li>Stimulga sezgir gidrogellar — <strong className="text-cyan-400">targetli dori yetkazish</strong> (pH, harorat, ferment)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/sensorlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Sensorlar</Link>
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Ko'p yadroli komplekslar →</Link>
        </div>

      </section>
    </main>
  )
}