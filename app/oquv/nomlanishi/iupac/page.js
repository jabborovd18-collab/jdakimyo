import Link from "next/link"

export default function IUPACQoidalari() {
  const qoidalar = [
    {
      num: "1",
      title: "Dastlab kation, keyin anion",
      desc: "Kompleks birikma nomini aytishda dastlab kation, keyin anion aytiladi. Xuddi oddiy tuzlardagi kabi.",
      misol: "[Ag(NH₃)₂]Cl",
      javob: "diamminkumush xlorid"
    },
    {
      num: "2",
      title: "Ligandlar ketma-ketligi",
      desc: "Anion ligandlar → neytral ligandlar → kation ligandlar. Dastlab sodda, keyin murakkab ligandlar alfavit ketma-ketligida.",
      misol: "[Co(NH₃)₄Br(H₂O)](NO₃)₂",
      javob: "bromoakvatetraamminkobalt(III) nitrat"
    },
    {
      num: "3",
      title: "Neytral ligandlar maxsus nomlari",
      desc: "H₂O — akva, NH₃ — ammin, CO — karbonil. Manfiy ligandlarga \"o\" qo'shimchasi qo'shiladi.",
      misol: "K₂[CuCl₄]",
      javob: "kaliy tetraxlorokuprat(II)"
    },
    {
      num: "4",
      title: "Ligandlar soni",
      desc: "di-, tri-, tetra-, penta-, geksa- prefikslari bilan ko'rsatiladi.",
      misol: "K₂[SnF₆]",
      javob: "kaliy geksaftorostannat(IV)"
    },
    {
      num: "5",
      title: "Polidentat ligandlar uchun maxsus prefikslar",
      desc: "Agar ligand nomida grekcha prefiks bo'lsa yoki polidentat bo'lsa: bis-, tris-, tetrakis- qo'llaniladi. Ligand nomi qavs ichiga olinadi.",
      misol: "[Cu(en)₂]SO₄",
      javob: "bis(etilendiamin)mis(II) sulfat"
    },
    {
      num: "6",
      title: "Anion komplekslarda \"at\" qo'shimchasi",
      desc: "Anion komplekslarda markaziy atom nomiga \"at\" qo'shiladi. Neytral va kation komplekslarda o'zgartirish kiritilmaydi.",
      misol: "K₄[Fe(CN)₆]",
      javob: "kaliy geksasiyanoferrat(II)"
    },
    {
      num: "7",
      title: "Oksidlanish darajasi",
      desc: "Markaziy atomning oksidlanish darajasi qavs ichida rim raqamida ko'rsatiladi.",
      misol: "[Cu(NH₃)₂]Cl",
      javob: "diaminmis(I) xlorid"
    },
    {
      num: "8",
      title: "Ham kation, ham anion kompleks bo'lsa",
      desc: "Avval kation kompleks nomi, keyin anion kompleks nomi aytiladi.",
      misol: "[Ag(NH₃)₂][Ag(CN)₂]",
      javob: "diamminkumush disianoargentat"
    },
    {
      num: "9",
      title: "Ambidentat ligandlarda κ belgisi",
      desc: "Ligand nomidan keyin donor atom qavs ichida κ harfi bilan ko'rsatiladi.",
      misol: "[Fe(NCS)(H₂O)₅]²⁺",
      javob: "tiosianato(κN)pentaakvatemir(III)"
    },
    {
      num: "10",
      title: "Ko'p yadroli komplekslarda μ belgisi",
      desc: "Metall ionlari ko'prik ligandlar orqali bog'langan bo'lsa, ligand oldidan μ harfi qo'llaniladi.",
      misol: "[(en)₂Co(μ-NH₂)(μ-OH)Co(en)₂]⁴⁺",
      javob: "μ-amido-μ-gidrokso kompleks"
    },
    {
      num: "11",
      title: "Metallning lotincha nomi",
      desc: "Agar belgi lotincha nomdan olingan bo'lsa, o'sha nom bilan aytiladi.",
      misol: "Fe — ferrat, Pb — plyumbat, Cu — kuprat",
      javob: ""
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/nomlanishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">📖 IUPAC nomlanish qoidalari</h1>
          <p className="text-purple-400 text-sm">IUPAC Red Book asosida • 11 ta asosiy qoida</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">

        {/* Kirish */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <p className="text-purple-200">
            Quyida kompleks birikmalarni IUPAC bo'yicha nomlashning <strong className="text-yellow-400">11 ta asosiy qoidasi</strong> keltirilgan. 
            Har bir qoida uchun misol va tayyor javob ko'rsatilgan.
          </p>
        </div>

        {/* Qoidalar */}
        {qoidalar.map((q, i) => (
          <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-pink-400/30 transition-all">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-600/30 rounded-full flex items-center justify-center text-pink-400 font-bold text-lg flex-shrink-0">
                {q.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{q.title}</h3>
                <p className="text-purple-300 mb-4">{q.desc}</p>
                
                {q.misol && (
                  <div className="bg-purple-800/40 rounded-xl p-4">
                    <div className="font-mono text-pink-400 mb-2">{q.misol}</div>
                    {q.javob && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">→</span>
                        <span className="text-green-300 font-semibold">{q.javob}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi/formula" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Formula yozish
          </Link>
          <Link 
            href="/oquv/nomlanishi/ligandlar" 
            className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 transition-all text-white font-semibold"
          >
            Keyingi: Ligandlar nomlanishi →
          </Link>
        </div>

      </section>

    </main>
  )
}