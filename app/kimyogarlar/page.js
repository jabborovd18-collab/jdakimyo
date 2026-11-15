"use client"

import Link from "next/link"
import { useState } from "react"
import Ikon from "@/components/Ikon"

const KIMYOGARLAR = [
  {
    id: "beruniy",
    nom: "Abu Rayhon Beruniy",
    yillar: "973–1048",
    turkum: "sharq",
    turkumNom: "Sharq allomalari",
    unvon: "Qomusiy olim, mineralogiya va solishtirma og'irlik asoschisi",
    kashfiyot: "Piknometr asbobi va 50 dan ortiq modda zichligi",
    qisqa:
      "\"Kitob al-jamohir fi ma'rifat al-javohir\" (Mineralogiya) va \"Kitob as-saydana\" (Farmakognoziya) asarlari muallifi. Metall va minerallarning solishtirma og'irligini zamonaviy qiymatlarga juda yaqin aniqlikda o'lchagan.",
    mavzular: [
      "Konusli idish (piknometr) yordamida oltin, simob, mis va zumrad zichligini o'lchash",
      "Ruda va qotishmalarni eritish, tozalash hamda sifatini aniqlash usullari",
      "1000 dan ortiq dorivor moddalar va ma'danlar tasnifi",
    ],
  },
  {
    id: "ibn-sino",
    nom: "Abu Ali ibn Sino",
    yillar: "980–1037",
    turkum: "sharq",
    turkumNom: "Sharq allomalari",
    unvon: "Tibbiyot va farmatsevtik kimyo ustuni",
    kashfiyot: "Sublimatsiya, distillash va dorivor birikmalar sintezi",
    qisqa:
      "\"Tib qonunlari\" asarida 800 dan ziyod oddiy va murakkab dori vositalarining tayyorlanishi, efir moylarini haydash (distillash), simob birikmalari hamda kislota-ishqor reaksiyalarini ilmiy asoslab bergan.",
    mavzular: [
      "Oddiy metallarni oltinga aylantirish (transmutatsiya) haqidagi afsonalarni ilmiy rad etishi",
      "Suv bug'i yordamida gulob va efir moylarini haydash texnologiyasi",
      "Mineral tuzlar, vitriollar va simob xloridlarning tibbiy qo'llanilishi",
    ],
  },
  {
    id: "obid-sodiqov",
    nom: "Akademik Obid Sodiqov",
    yillar: "1913–1987",
    turkum: "uzbek",
    turkumNom: "O'zbekiston kimyogarlari",
    unvon: "Bioorganik kimyo maktabi asoschisi, O'zFA prezidenti",
    kashfiyot: "G'o'za (paxta) kimyosi, alkaloidlar va gossipol tadqiqoti",
    qisqa:
      "O'zbekistonda bioorganik kimyo faniga asos solgan ulkan olim. O'rta Osiyo o'simliklaridan yuzlab yangi alkaloidlar, organik kislotalar, vitaminlar va biologik faol moddalarni ajratib olib, ularning tuzilishini aniqlagan.",
    mavzular: [
      "G'o'za o'simligi bargi, chigiti va po'stlog'idan olingan 100 dan ortiq moddalar",
      "Kolkhamin va gossipol asosida virusga hamda o'smaga qarshi dori vositalari",
      "O'zbekiston Fanlar akademiyasi Bioorganik kimyo institutining tashkil etilishi",
    ],
  },
  {
    id: "sobir-yunusov",
    nom: "Akademik Sobir Yunusov",
    yillar: "1909–1995",
    turkum: "uzbek",
    turkumNom: "O'zbekiston kimyogarlari",
    unvon: "O'simlik moddalari va alkaloidlar kimyosi darg'asi",
    kashfiyot: "700 dan ortiq yangi alkaloidlar va 10+ dori preparatlari",
    qisqa:
      "O'simliklarda alkaloidlarning to'planish dinamikasi qonuniyatini kashf etgan. U asos solgan O'simlik moddalari kimyosi instituti jahon miqyosida tabiiy birikmalar kimyosi bo'yicha yetakchi ilmiy markazga aylangan.",
    mavzular: [
      "O'simlikning rivojlanish davriga qarab alkaloidlar hosil bo'lish qonuniyati",
      "Galantamin, likorin, allapinin kabi mashhur shifobaxsh preparatlar",
      "Tabiiy geterotsiklik birikmalarning fazoviy tuzilishini aniqlash",
    ],
  },
  {
    id: "mendeleyev",
    nom: "Dmitriy Ivanovich Mendeleyev",
    yillar: "1834–1907",
    turkum: "jahon",
    turkumNom: "Jahon olimlari",
    unvon: "Kimyoviy elementlar davriy qonuni kashfiyotchisi",
    kashfiyot: "Davriy jadval (1869) va kashf etilmagan elementlar bashorati",
    qisqa:
      "Atom massasi va kimyoviy xossalar o'rtasidagi davriy bog'liqlikni ochib, hali fanga noma'lum bo'lgan eka-alyuminiy (galliy), eka-bor (skandiy) va eka-kremniy (germaniy) xossalarini yuqori aniqlikda bashorat qilgan.",
    mavzular: [
      "1869-yilgi birinchi davriy jadval va elementlar atom og'irligini tuzatish",
      "Eritmalarning gidrat nazariyasi va Klapeyron-Mendeleyev gaz tenglamasi",
      "Neftni qayta ishlash va metrologiya sohasidagi fundamental ishlari",
    ],
  },
  {
    id: "mariya-kyuri",
    nom: "Mariya Sklodovskaya-Kyuri",
    yillar: "1867–1934",
    turkum: "jahon",
    turkumNom: "Jahon olimlari",
    unvon: "Ikki karra Nobel mukofoti sovrindori (fizika va kimyo)",
    kashfiyot: "Radioaktivlik hodisasi, Poloniy (Po) va Radiy (Ra) elementlari",
    qisqa:
      "Uran rudalaridan tonnalab xomashyoni qo'lda qayta ishlab, ikki yangi radioaktiv element — poloniy va radiyni kashf etgan hamda sof metall holatida radiyni ajratib olgan. Yadro kimyosiga asos solgan.",
    mavzular: [
      "Radioaktivlik atomning ichki xossasi ekanligini isbotlash",
      "Poloniy (Z=84) va Radiy (Z=88) elementlarining ajratib olinishi",
      "Radiologiya va saraton kasalliklarini nurlantirish orqali davolash asoslari",
    ],
  },
  {
    id: "lavuazye",
    nom: "Antuan Loran Lavuazye",
    yillar: "1743–1794",
    turkum: "jahon",
    turkumNom: "Jahon olimlari",
    unvon: "Zamonaviy kimyo otasi",
    kashfiyot: "Yonishning kislorodli nazariyasi va moddalar massasining saqlanish qonuni",
    qisqa:
      "Flogiston nazariyasiga barham berib, yonish va nafas olish jarayonlari moddalarning kislorod bilan birikishi ekanligini tarozi yordamida miqdoriy tajribalar bilan isbotlagan.",
    mavzular: [
      "Yopiq retortada simob va kislorod bilan o'tkazilgan 12 kunlik tarixiy tajriba",
      "Suvning oddiy unsur emas, vodorod va kislorod birikmasi ekanligini aniqlash",
      "Ilk tizimli kimyoviy nomenklatura va elementlar jadvali",
    ],
  },
  {
    id: "poling",
    nom: "Laynus Karl Poling",
    yillar: "1901–1994",
    turkum: "jahon",
    turkumNom: "Jahon olimlari",
    unvon: "Kvant kimyosi va molekulyar biologiya asoschilaridan biri",
    kashfiyot: "Orbitallar gibridlanishi, elektromanfiylik shkalasi va oqsil α-spirali",
    qisqa:
      "Kimyoviy bog'lanish tabiatini kvant mexanikasi yordamida tushuntirib bergan. Poling elektromanfiylik shkalasi, sp³-gibridlanish va rezonans nazariyasi bugungi kunda har bir kimyo darsligining asosini tashkil etadi.",
    mavzular: [
      "Uglerod atomining tetraedrik valent burchagi (109°28') va gibridlanish",
      "Elementlarning nisbiy elektromanfiylik shkalasi va ion-kovalent bog' ulushi",
      "Oqsillarning ikkilamchi strukturasi (alfa-spiral va beta-qavat) kashfiyoti",
    ],
  },
]

export default function KimyogarlarSahifa() {
  const [turkum, setTurkum] = useState("barchasi")

  const roYxat =
    turkum === "barchasi"
      ? KIMYOGARLAR
      : KIMYOGARLAR.filter((k) => k.turkum === turkum)

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between"
    >
      {/* Ambient nurlar */}
      <div className="absolute top-0 left-1/4 w-[38rem] h-[38rem] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-[34rem] h-[34rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sarlavha */}
      <header className="border-b border-blue-900/50 bg-[#070c29]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition shrink-0"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent truncate">
                  Kimyogarlar haqida maqolalar
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/50 bg-amber-900/40 text-amber-200 font-sans inline-flex items-center gap-1 shrink-0">
                  <Ikon nom="soat" olcham={11} />
                  <span>Tez kunda qo&apos;shiladi</span>
                </span>
              </div>
              <div className="text-xs text-blue-300/80 truncate">
                Buyuk kimyogarlar va zamonaviy olimlarning ilmiy ijodi hamda kashfiyotlari
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20 shrink-0"
          >
            Bosh sahifa
          </Link>
        </div>
      </header>

      {/* Asosiy kontent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 w-full relative z-10 space-y-8">
        {/* Kirish banneri */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#14194a]/80 via-[#0a1738]/80 to-[#070e28]/85 backdrop-blur-md shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/45 bg-amber-500/15 text-xs font-bold text-amber-300 shadow-sm">
            <Ikon nom="maqola" olcham={15} />
            <span>8-rukn · Ilmiy meros va biografik maqolalar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Kimyo fanini yaratgan buyuk shaxslar va ularning ilmiy ijodi
          </h2>
          <p className="text-sm sm:text-base text-blue-200/85 leading-relaxed max-w-2xl mx-auto">
            Sharq Uyg&apos;onish davri allomalari, O&apos;zbekiston kimyo maktabi akademiklari va jahon Nobel mukofoti laureatlarining hayot yo&apos;li, laboratoriya kundaliklari hamda tarixiy kashfiyotlari haqidagi batafsil maqolalar to&apos;plami tayyorlanmoqda.
          </p>
        </div>

        {/* Turkumlar filtri */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "barchasi", nom: "Barcha olimlar" },
            { id: "sharq", nom: "Sharq allomalari" },
            { id: "uzbek", nom: "O'zbekiston kimyogarlari" },
            { id: "jahon", nom: "Jahon olimlari" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTurkum(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                turkum === t.id
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20"
                  : "border border-blue-800/60 bg-[#091538]/70 text-blue-200 hover:text-white hover:border-yellow-400/50"
              }`}
            >
              <span>{t.nom}</span>
            </button>
          ))}
        </div>

        {/* Olimlar va maqolalar kartalari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {roYxat.map((k) => (
            <article
              key={k.id}
              className="p-6 sm:p-7 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/75 via-[#0a1738]/75 to-[#070e28]/80 backdrop-blur-md shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-11 h-11 rounded-2xl bg-yellow-500/15 border border-yellow-500/35 text-yellow-400 flex items-center justify-center shrink-0">
                      <Ikon nom="maqola" olcham={22} />
                    </span>
                    <div>
                      <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                        {k.turkumNom}
                      </span>
                      <span className="text-xs font-mono text-blue-300/80">
                        {k.yillar}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 inline-flex items-center gap-1">
                    <Ikon nom="soat" olcham={11} />
                    <span>Maqola tayyorlanmoqda</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {k.nom}
                </h3>
                <div className="text-xs font-semibold text-cyan-300 mt-1">
                  {k.unvon}
                </div>

                <div className="mt-3 p-3 rounded-2xl border border-blue-800/50 bg-[#081333]/70 text-xs">
                  <span className="text-yellow-300 font-bold">Asosiy ilmiy merosi: </span>
                  <span className="text-blue-100">{k.kashfiyot}</span>
                </div>

                <p className="text-xs sm:text-sm text-blue-200/85 mt-3 leading-relaxed">
                  {k.qisqa}
                </p>

                <div className="mt-4 pt-3 border-t border-blue-900/50 space-y-1.5">
                  <div className="text-[11px] font-semibold text-blue-300/80">
                    Maqolada yoritiladigan mavzular:
                  </div>
                  <ul className="space-y-1">
                    {k.mavzular.map((m, idx) => (
                      <li key={idx} className="text-xs text-blue-200/85 flex items-start gap-2">
                        <span className="text-yellow-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/50 flex items-center justify-between gap-3 text-xs">
                <span className="text-blue-300/70">Ilmiy-biografik ocherk</span>
                <span className="px-3.5 py-1.5 rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-300 font-semibold inline-flex items-center gap-1.5 select-none">
                  <Ikon nom="soat" olcham={13} />
                  <span>Tez kunda qo&apos;shiladi</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
