"use client"

import { useState } from "react"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const QOIDALAR = [
  {
    num: "1",
    title: "Dastlab kation, keyin anion",
    desc: "Kompleks birikma nomini aytishda dastlab kation qismi, so'ngra anion qismi aytiladi (xuddi oddiy noorganik tuzlardagi kabi).",
    misol: "[Ag(NH₃)₂]Cl",
    javob: "diamminkumush(I) xlorid",
    izoh: "[Ag(NH₃)₂]⁺ (kation) + Cl⁻ (anion)"
  },
  {
    num: "2",
    title: "Ligandlar ketma-ketligi (Alifbo tartibi)",
    desc: "Kompleks ion ichidagi barcha ligandlar ularning nomlari bo'yicha alifbo tartibida nomlanadi (IUPAC 2005 tavsiyasi).",
    misol: "[Co(NH₃)₄(H₂O)Cl]Cl₂",
    javob: "tetraamminakvakloridokobalt(III) xlorid",
    izoh: "ammin (a) → akva (a) → klorido (k)"
  },
  {
    num: "3",
    title: "Neytral ligandlar maxsus nomlari",
    desc: "H₂O — akva, NH₃ — ammin, CO — karbonil, NO — nitrozil. Manfiy (anion) ligandlarga esa '-o' qo'shimchasi qo'shiladi (xlorido, sianido, gidroksido).",
    misol: "K₂[CuCl₄]",
    javob: "kaliy tetraxloridokuprat(II)",
    izoh: "Cl⁻ ligand sifatida 'klorido' deyiladi"
  },
  {
    num: "4",
    title: "Oddiy ligandlar soni prefikslari",
    desc: "Oddiy ligandlar soni mono- (odatda tushirib qoldiriladi), di-, tri-, tetra-, penta-, geksa-, hepta-, okta- grek prefikslari bilan ko'rsatiladi.",
    misol: "K₂[SnF₆]",
    javob: "kaliy geksaftoridostannat(IV)",
    izoh: "6 ta F⁻ → geksaftorido"
  },
  {
    num: "5",
    title: "Murakkab va polidentat ligandlar prefikslari",
    desc: "Agar ligand nomining o'zida son prefiksi bo'lsa yoki u polidentat xelat ligand bo'lsa: bis-, tris-, tetrakis-, pentakis- qo'llanadi va ligand nomi qavs ( ) ga olinadi.",
    misol: "[Cu(en)₂]SO₄",
    javob: "bis(etilendiamin)mis(II) sulfat",
    izoh: "en (etilendiamin) bidentat ligand → bis(etilendiamin)"
  },
  {
    num: "6",
    title: "Anion komplekslarda '-at' qo'shimchasi",
    desc: "Agar kompleks ion anion (manfiy zaryadli) bo'lsa, markaziy metall nomiga '-at' qo'shimchasi qo'shiladi. Kation va neytral komplekslarda esa metall nomi o'zgarmaydi.",
    misol: "K₄[Fe(CN)₆]",
    javob: "kaliy geksatsianidoferrat(II)",
    izoh: "Anion bo'lgani uchun Fe → ferrat"
  },
  {
    num: "7",
    title: "Oksidlanish darajasini ko'rsatish (Stok usuli)",
    desc: "Markaziy metall nomidan keyin uning oksidlanish darajasi qavs ichida rim raqami bilan ko'rsatiladi: (I), (II), (III), (IV).",
    misol: "[Cu(NH₃)₄]SO₄",
    javob: "tetraamminmis(II) sulfat",
    izoh: "Cu zaryadi +2 bo'lgani uchun mis(II)"
  },
  {
    num: "8",
    title: "Ham kation, ham anion kompleks bo'lganda",
    desc: "Birikmaning kationi ham, anioni ham kompleks ion bo'lsa, avval kation kompleks, so'ng anion kompleks to'liq aytiladi.",
    misol: "[Ag(NH₃)₂][Ag(CN)₂]",
    javob: "diamminkumush(I) ditsianidoargentat(I)",
    izoh: "Kationda kumush(I), anionda argentat(I)"
  },
  {
    num: "9",
    title: "Ambidentat ligandlar koordinatsiyasi (κ belgisi)",
    desc: "Bir nechta donor atomga ega bo'lgan ligandlarda bog'lanuvchi atom 'κ' (kappa) harfi bilan ko'rsatiladi: -NO₂ (nitrito-κN), -ONO (nitrito-κO), -SCN (tiosianato-κS), -NCS (tiosianato-κN).",
    misol: "[Co(NH₃)₅(NO₂)]Cl₂",
    javob: "pentaammin(nitrito-κN)kobalt(III) xlorid",
    izoh: "Azot orqali bog'langan"
  },
  {
    num: "10",
    title: "Ko'prikli (ko'p yadroli) komplekslar (μ belgisi)",
    desc: "Ikki yoki undan ortiq markaziy metallni o'zaro bog'lab turgan ko'prik ligandlar oldiga 'μ-' (myu) harfi qo'yiladi.",
    misol: "[(NH₃)₅Cr(μ-OH)Cr(NH₃)₅]Cl₅",
    javob: "μ-gidroksido-bis[pentaamminxrom(III)] xlorid",
    izoh: "OH guruhi ikkita Cr markazini bog'lagan"
  },
  {
    num: "11",
    title: "Lotincha metall o'zaklari (Anionlar uchun)",
    desc: "Anion komplekslarda ayrim metallar uchun lotincha nom o'zagi ishlatiladi: Fe → ferrat, Cu → kuprat, Ag → argentat, Au → aurat, Sn → stannat, Pb → plyumbat.",
    misol: "Na[Au(CN)₄]",
    javob: "natriy tetratsianidoaurat(III)",
    izoh: "Oltin (Au) → aurat"
  }
]

export default function IUPACQoidalari() {
  const [qidiruv, setQidiruv] = useState("")

  const filtrlangan = QOIDALAR.filter((q) => {
    if (!qidiruv.trim()) return true
    const s = qidiruv.toLowerCase()
    return (
      q.title.toLowerCase().includes(s) ||
      q.desc.toLowerCase().includes(s) ||
      q.misol.toLowerCase().includes(s) ||
      q.javob.toLowerCase().includes(s)
    )
  })

  return (
    <MavzuLayout
      sarlavha="IUPAC nomlanish qoidalari"
      tavsif="IUPAC Red Book va xalqaro anorganik nomenklatura bo'yicha 11 ta asosiy qoida va amaliy namunalar"
      ikon="📖"
      nishon="03-MAVZU"
      yol={[
        { nom: "Nomlanishi", havola: "/oquv/nomlanishi" },
        { nom: "IUPAC qoidalari" }
      ]}
      oldingiMavzu={{ nom: "Formula yozish", havola: "/oquv/nomlanishi/formula" }}
      keyingiMavzu={{ nom: "Ligandlar jadvali", havola: "/oquv/nomlanishi/ligandlar" }}
      quizHavola="/oquv/video-darsliklar/quiz/nomlanishi"
    >
      {/* ═══ QIDIRUV VA KIRISH ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
              11 ta asosiy IUPAC qoidasi
            </h2>
            <p className="v3-xira text-xs sm:text-sm mt-1">
              Har bir qoidaning mohiyati, formulasi va o&apos;zbek tilidagi rasmiy nomi
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Qoidalardan qidirish..."
              className="px-3.5 py-2 pl-9 rounded-xl text-xs sm:text-sm border outline-none w-full sm:w-64"
              style={{
                background: "var(--v3-yuza-2)",
                borderColor: "var(--v3-chiziq)",
                color: "var(--v3-matn)"
              }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50">
              🔍
            </span>
          </div>
        </div>
      </div>

      {/* ═══ QOIDALAR RO'YXATI ═══ */}
      <div className="space-y-4">
        {filtrlangan.map((q) => (
          <div
            key={q.num}
            className="rounded-2xl p-6 border shadow-xs transition-all hover:scale-[1.005]"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-start gap-4">
              {/* Raqam */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs"
                style={{
                  background: "color-mix(in srgb, var(--v3-urgu) 15%, var(--v3-yuza))",
                  color: "var(--v3-urgu)",
                  borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, var(--v3-chiziq))"
                }}
              >
                {q.num}
              </div>

              {/* Tafsilot */}
              <div className="flex-1 min-w-0 space-y-3">
                <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
                  {q.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed">
                  {q.desc}
                </p>

                {/* Namuna bloki */}
                <div
                  className="rounded-xl p-4 border space-y-2"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="font-mono text-sm">
                      <KimyoFormula formula={q.misol} ajratilgan={true} olcham="odatiy" />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold" style={{ color: "var(--v3-urgu)" }}>
                      → {q.javob}
                    </div>
                  </div>
                  {q.izoh && (
                    <div className="v3-xira text-[11px] pt-1 border-t" style={{ borderColor: "var(--v3-chiziq)" }}>
                      💡 {q.izoh}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}
