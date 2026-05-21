import Link from "next/link"

export default function CPKRanglar() {
  const ranglar = [
    { atom: "Vodorod", belgi: "H", rang: "Oq", hex: "#FFFFFF", cpk: "Oq" },
    { atom: "Uglerod", belgi: "C", rang: "Qora", hex: "#1A1A1A", cpk: "Qora" },
    { atom: "Azot", belgi: "N", rang: "Ko'k", hex: "#3050F8", cpk: "Ko'k" },
    { atom: "Kislorod", belgi: "O", rang: "Qizil", hex: "#FF0D0D", cpk: "Qizil" },
    { atom: "Ftor", belgi: "F", rang: "Och yashil", hex: "#90E050", cpk: "Och yashil" },
    { atom: "Xlor", belgi: "Cl", rang: "Yashil", hex: "#1FF01F", cpk: "Yashil" },
    { atom: "Brom", belgi: "Br", rang: "To'q qizil", hex: "#A62929", cpk: "To'q qizil" },
    { atom: "Yod", belgi: "I", rang: "Binafsha", hex: "#940094", cpk: "Binafsha" },
    { atom: "Oltingugurt", belgi: "S", rang: "Sariq", hex: "#FFFF30", cpk: "Sariq" },
    { atom: "Fosfor", belgi: "P", rang: "To'q sariq", hex: "#FF8000", cpk: "To'q sariq" },
    { atom: "Temir", belgi: "Fe", rang: "To'q kulrang", hex: "#808090", cpk: "To'q kulrang" },
    { atom: "Mis", belgi: "Cu", rang: "Mis rang", hex: "#C88033", cpk: "Mis rang" },
    { atom: "Kobalt", belgi: "Co", rang: "Ko'k-binafsha", hex: "#3D4B8C", cpk: "Ko'k-binafsha" },
    { atom: "Nikel", belgi: "Ni", rang: "Yashil-kulrang", hex: "#5D8A6C", cpk: "Yashil-kulrang" },
    { atom: "Rux", belgi: "Zn", rang: "Kulrang", hex: "#7D7D8E", cpk: "Kulrang" },
    { atom: "Platina", belgi: "Pt", rang: "Kumushrang", hex: "#D0D0E0", cpk: "Kumushrang" },
    { atom: "Kumush", belgi: "Ag", rang: "Kumush", hex: "#C0C0D0", cpk: "Kumush" },
    { atom: "Oltin", belgi: "Au", rang: "Oltin", hex: "#FFD123", cpk: "Oltin" },
    { atom: "Xrom", belgi: "Cr", rang: "Kulrang", hex: "#8C8C9C", cpk: "Kulrang" },
    { atom: "Simob", belgi: "Hg", rang: "Kumushrang", hex: "#C0C0D0", cpk: "Kumushrang" },
    { atom: "Vanadiy", belgi: "V", rang: "Kulrang", hex: "#A6A6AB", cpk: "Kulrang" },
    { atom: "Molibden", belgi: "Mo", rang: "Kulrang", hex: "#8B8B95", cpk: "Kulrang" },
    { atom: "Alyuminiy", belgi: "Al", rang: "Kulrang", hex: "#B0B0C0", cpk: "Kulrang" },
    { atom: "Kremniy", belgi: "Si", rang: "Kulrang", hex: "#909090", cpk: "Kulrang" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🎨 CPK ranglar jadvali</h1>
          <p className="text-purple-400 text-sm">Corey-Pauling-Koltun (CPK) • Xalqaro standart • Molekulalarni vizualizatsiya qilish</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 CPK ranglar tizimi haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">CPK ranglar tizimi</strong> (Corey-Pauling-Koltun) — 
              molekulalarni 3D vizualizatsiya qilishda atomlarni ranglash uchun ishlatiladigan 
              <strong className="text-yellow-400"> xalqaro standart</strong>. 
              Robert Corey, Linus Pauling va Walter Koltun tomonidan 1950-yillarda ishlab chiqilgan.
              Dunyodagi barcha ilmiy jurnallar va molekulyar vizualizatorlar shu ranglardan foydalanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun kerak?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Molekulalarni bir xil standartda ko'rsatish</li>
                <li>• Atomlarni tezda farqlash imkoniyati</li>
                <li>• Ilmiy maqolalarda yagona tizim</li>
                <li>• Talabalar va olimlar uchun qulaylik</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy qoidalar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Metallmaslar:</strong> yorqin ranglar</li>
                <li>• <strong>Metallar:</strong> kulrang/kumushrang</li>
                <li>• <strong>Galogenlar:</strong> o'ziga xos ranglar</li>
                <li>• <strong>Vodorod:</strong> oq (eng keng tarqalgan)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. ASOSIY JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 To'liq CPK ranglar jadvali</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Atom</th>
                  <th className="py-3 px-4 text-purple-300">Belgi</th>
                  <th className="py-3 px-4 text-purple-300">Rang namunasi</th>
                  <th className="py-3 px-4 text-purple-300">Hex Code</th>
                  <th className="py-3 px-4 text-purple-300">CPK rangi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {ranglar.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-all">
                    <td className="py-3 px-4 font-semibold">{r.atom}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 font-bold">{r.belgi}</td>
                    <td className="py-3 px-4">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-purple-600 shadow-lg"
                        style={{ backgroundColor: r.hex }}
                      ></div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-purple-400">{r.hex}</td>
                    <td className="py-3 px-4">{r.cpk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ENG KO'P UCHRAYDIGANLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng ko'p uchraydigan atomlar</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { belgi: "H", nomi: "Vodorod", hex: "#FFFFFF", matn: "text-black" },
              { belgi: "C", nomi: "Uglerod", hex: "#1A1A1A" },
              { belgi: "N", nomi: "Azot", hex: "#3050F8" },
              { belgi: "O", nomi: "Kislorod", hex: "#FF0D0D" },
              { belgi: "F", nomi: "Ftor", hex: "#90E050", matn: "text-black" },
              { belgi: "Cl", nomi: "Xlor", hex: "#1FF01F", matn: "text-black" },
              { belgi: "S", nomi: "Oltingugurt", hex: "#FFFF30", matn: "text-black" },
              { belgi: "P", nomi: "Fosfor", hex: "#FF8000" },
            ].map((a, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center hover:scale-105 transition-transform">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-purple-600 shadow-lg"
                  style={{ backgroundColor: a.hex }}
                ></div>
                <p className="text-yellow-400 font-bold text-lg font-mono">{a.belgi}</p>
                <p className={`text-sm ${a.matn || "text-purple-200"}`}>{a.nomi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QO'LLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Qayerda qo'llaniladi?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-yellow-400 font-bold mb-2">Ilmiy jurnallar</h3>
              <p className="text-purple-200 text-sm">Barcha xalqaro kimyo jurnallarida maqolalar CPK ranglarda chop etiladi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="text-yellow-400 font-bold mb-2">Dasturlar</h3>
              <p className="text-purple-200 text-sm">JSmol, PyMOL, Chimera, Avogadro — barchasi CPK standartini qo'llaydi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-yellow-400 font-bold mb-2">Ta'lim</h3>
              <p className="text-purple-200 text-sm">Darsliklar va o'quv qo'llanmalarida molekulalar CPK ranglarda ko'rsatiladi.</p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>CPK — <strong className="text-yellow-400">xalqaro standart</strong> molekulyar vizualizatsiya tizimi</li>
            <li>Metallmaslar — <strong>yorqin ranglar</strong>, metallar — <strong>kulrang/kumushrang</strong></li>
            <li>Eng muhimlari: H (oq), C (qora), N (ko'k), O (qizil)</li>
            <li>Barcha zamonaviy molekulyar dasturlar CPK ni qo'llaydi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-center pt-6">
          <Link 
            href="/oquv/fazoviy" 
            className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 transition-all text-white font-semibold"
          >
            ← Fazoviy tuzilish bo'limi
          </Link>
        </div>

      </section>

    </main>
  )
}