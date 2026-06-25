import Link from "next/link"

export default function BoshqaDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧪 Boshqa metall dori vositalari</h1>
          <p className="text-purple-400 text-sm">Ga(III) • Bi(III) • V(IV) • Cu(II) • Ru(II) fotodinamik terapiya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Ga(III) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Ga(III) — "Temir troyan oti"</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Galliy(III)</strong> — Fe³⁺ ga juda o'xshash 
              (ion radiusi: Ga³⁺ 0.62 Å vs Fe³⁺ 0.65 Å). U <strong>temir o'rnini egallab</strong>, 
              lekin redoks reaksiyalarga kirisha olmaydi (Ga³⁺ qaytarilmaydi — faqat bir valentli). 
              Bu xususiyat uni <strong>"temir troyan oti"</strong> qiladi — hujayra ichiga temir 
              o'rnida kiradi, lekin temir funksiyasini bajara olmaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Galliy nitrat</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Formula:</strong> Ga(NO₃)₃ — FDA tasdiqlangan (2003)</li>
                <li>• <strong>Kasallik:</strong> Giperkalsemiya (saraton bilan bog'liq)</li>
                <li>• <strong>Mexanizm:</strong> Suyak rezorbsiyasini ingibirlaydi</li>
                <li>• <strong>Transferrin:</strong> Ga³⁺ transferrin bilan bog'lanadi — saraton hujayralariga kiradi</li>
                <li>• <strong>RNR ingibitori:</strong> Temirga bog'liq ribonukleotid reduktazani bloklaydi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Ga-maltolat (GaM)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Formula:</strong> Ga(C₆H₅O₇) — og'iz orqali qabul qilinadi</li>
                <li>• <strong>Kasallik:</strong> Saraton (limfoma, ko'krak) — klinik sinovlarda</li>
                <li>• <strong>Afzalligi:</strong> Ga(NO₃)₃ dan yaxshiroq biodostupnost</li>
                <li>• <strong>Kombinatsiya:</strong> Sisplatin + GaM — sinergizm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bi(III) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🦠 Bi(III) — Helicobacter pylori ga qarshi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Bismut birikmalari</strong> tibbiyotda <strong>200 yildan 
            ortiq</strong> qo'llaniladi. <strong>Bismut subsitrat (De-Nol)</strong> — oshqozon 
            yarasi va <strong>Helicobacter pylori</strong> infeksiyasini davolashda qo'llaniladigan 
            asosiy dori. U oshqozon shilliq qavatini himoya qiladi va H. pylori ni yo'q qiladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">De-Nol — ko'p tomonlama ta'sir mexanizmi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-200">
              {[
                { title: "Shilliq himoya", desc: "Bi³⁺ oshqozon shilliq qavatida himoya qatlami hosil qiladi — kislota va pepsin ta'siridan saqlaydi." },
                { title: "H. pylori yo'q qilish", desc: "Bakteriya hujayra devoriga kiradi, fermentlarni (ureaza, katalaza) ingibirlaydi, bakteriya lizisga uchraydi." },
                { title: "Yallig'lanishga qarshi", desc: "Prostaglandin E₂ sintezini stimullaydi, yallig'lanish sitokinlarini kamaytiradi." },
                { title: "Angiogenez ingibitori", desc: "O'simta qon tomirlari o'sishini to'xtatadi — saratonga qarshi potensial." },
              ].map((r, i) => (
                <div key={i} className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-bold text-xs">{r.title}</p>
                  <p className="text-purple-300 text-xs mt-1">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* V(IV) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🍬 V(IV) — Insulin mimetik (diabetga qarshi)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Vanadil (VO²⁺) va vanadat (VO₄³⁻)</strong> ionlari 
            <strong>insulinga o'xshash ta'sir</strong> ko'rsatadi — ular hujayra membranasidagi 
            insulin retseptorlarini aktivlashtiradi va glyukoza tashilishini kuchaytiradi. 
            <strong>BMOV (bis(maltolato)oksovanadiy(IV))</strong> — eng ko'p o'rganilgan V(IV) dori.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { compound: "VO(SO₄) (vanadil sulfat)", effect: "Insulin mimetik", status: "Sport qo'shimchasi (kontroversial)" },
              { compound: "BMOV (V(IV)-maltol)", effect: "Glyukoza pasayishi", status: "Klinik sinov (II faza)" },
              { compound: "NaVO₃ (natriy vanadat)", effect: "PTP1B ingibitori", status: "Tadqiqot bosqichida" },
            ].map((r, i) => (
              <div key={i} className="bg-green-600/10 border border-green-500/30 rounded-xl p-3">
                <p className="text-green-400 font-bold font-mono text-xs">{r.compound}</p>
                <p className="text-white mt-1">{r.effect}</p>
                <p className="text-purple-400 mt-1">{r.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cu(II) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 Cu(II) — Yallig'lanish va radiatsion terapiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Mis komplekslari</strong> yallig'lanishga qarshi, 
            antimikrob va saratonga qarshi faollikka ega. 
            <strong>Cu-ATSM</strong> — gipoksik saraton hujayralarida selektiv qaytariladigan 
            Cu(II) kompleksi — radiatsion terapiya uchun istiqbolli agent.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { title: "Cu-ATSM", desc: "Gipoksiyaga selektiv Cu(II) kompleksi. Gipoksik hujayralarda Cu(II) → Cu(I) qaytariladi va radioaktiv ⁶⁴Cu izotopi bilan PET tasvirlash uchun ishlatiladi.", app: "Saraton diagnostikasi + terapiya (teranostika)" },
                { title: "Cu-aspirin komplekslari", desc: "Cu(II)-asetilsalitsilat — aspirindan kuchliroq yallig'lanishga qarshi faollik. SOD (superoksid dismutaza) mimetik.", app: "Yallig'lanish, artrit" },
              ].map((r, i) => (
                <div key={i} className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-bold">{r.title}</p>
                  <p className="text-purple-300 mt-1">{r.desc}</p>
                  <p className="text-yellow-400 mt-1"><strong>Qo'llanish:</strong> {r.app}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ga(III) — <strong className="text-green-400">"temir troyan oti"</strong>, redoks faol emas</li>
            <li>Bi(III) — <strong className="text-green-400">H. pylori eradikatsiyasi</strong>, ko'p tomonlama mexanizm</li>
            <li>V(IV) — <strong className="text-green-400">insulin mimetik</strong>, diabetga qarshi potensial</li>
            <li>Cu(II) — <strong className="text-green-400">gipoksiyaga selektiv</strong>, teranostika uchun</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/temir" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Fe komplekslari</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/mexanizm" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Ta'sir mexanizmlari →</Link>
        </div>

      </section>
    </main>
  )
}