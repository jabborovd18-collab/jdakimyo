"use client";

import Link from "next/link";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import hajm from "@/lib/ilmiy-hajm.json";
import { maqolalar } from "@/lib/maqolalar";

const BOLIMLAR = [
  {
    href: "/ilmiy/tahlil",
    keng: true,
    title: "Tahlil Usullari",
    desc: "Har bir metod aniq birikmalarda qanday qo'llanilishi va tahlil qilinishi bilan ko'rsatilgan — 20 ta zamonaviy metod, spektrlar va kalkulyatorlar.",
    ion: "[Co(NH₃)₆]³⁺ — amber",
    son: hajm.usulBirikmaTahlili,
    birlik: "usul × birikma tahlili",
    rang: "amber",
    ikon: "nurlar",
  },
  {
    href: "/ilmiy/chuqurlashgan",
    keng: true,
    title: "Chuqurlashgan Mavzular",
    desc: "Kristall va ligand maydon nazariyasi, d-orbital ajralishi, molekulyar simmetriya, Yan-Teller effekti, termodinamika va kinetika — hisob-kitoblar bilan.",
    ion: "[Ti(H₂O)₆]³⁺ — binafsha",
    son: hajm.mavzuSahifalari,
    birlik: `sahifa · ${hajm.mavzular} ta chuqur mavzu`,
    rang: "purple",
    ikon: "atom",
  },
  {
    href: "/ilmiy/birikmalar",
    keng: false,
    title: "Kompleks Birikmalar Birlamchi Baza",
    desc: "Tuzilishi, xossalari, olinishi, kristall parametrlari va 3D molekulyar modeli.",
    ion: "[Cu(H₂O)₆]²⁺ — moviy",
    son: hajm.birikmalar,
    birlik: "kompleks birikma",
    rang: "cyan",
    ikon: "kolba",
    namunalar: ["Ferrosen", "Prussiya ko'ki", "Zeise tuzi", "Sisplatin", "Vitamin B₁₂", "Gemoglobin"],
  },
  {
    href: "/ilmiy/maqolalar",
    keng: false,
    title: "Ilmiy Maqolalar va Tadqiqotlar",
    desc: "Ilmiy maqolalar bazasi, zamonaviy koordinatsion kimyo yutuqlari va tadqiqotlar.",
    ion: "[Ni(H₂O)₆]²⁺ — yashil",
    son: maqolalar.length,
    birlik: "ilmiy maqola",
    rang: "emerald",
    ikon: "kitob",
  },
];

const SANOQLAR = [
  { son: hajm.birikmalar, nom: "Birikma", rang: "text-cyan-400" },
  { son: hajm.usullar, nom: "Tahlil Usuli", rang: "text-[var(--v3-urgu)]" },
  { son: hajm.mavzular, nom: "Chuqur Mavzu", rang: "text-purple-400" },
  { son: hajm.modellar3d, nom: "3D Model", rang: "text-emerald-400" },
];

const TOP_USULLAR = [
  { kalit: "ub-vis", nom: "UB-Vis Spektr", href: "/ilmiy/tahlil/ub-vis", son: 16 },
  { kalit: "iq", nom: "IQ (FT-IR)", href: "/ilmiy/tahlil/iq", son: 21 },
  { kalit: "rentgen", nom: "Rentgen (XRD)", href: "/ilmiy/tahlil/rentgen", son: 12 },
  { kalit: "nmr", nom: "YaMR (NMR)", href: "/ilmiy/tahlil/nmr", son: 12 },
  { kalit: "magnit", nom: "SQUID Magnit", href: "/ilmiy/tahlil/magnit", son: 12 },
  { kalit: "elektrokimyo", nom: "Siklik CV", href: "/ilmiy/tahlil/elektrokimyo", son: 12 },
  { kalit: "termik", nom: "Termik (TGA)", href: "/ilmiy/tahlil/termik", son: 12 },
  { kalit: "epr", nom: "EPR / ESR", href: "/ilmiy/tahlil/epr", son: 4 },
];

export default function IlmiyKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      {/* ─── YUQORI HEADER ─── */}
      <header className="sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="v3-tugma text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Bosh sahifaga qaytish"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Bosh Sahifa</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="atom" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Kompleks Birikmalar Ilmiy Kutubxonasi
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Koordinatsion kimyo, kristall maydon nazariyasi va tahlil usullari
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/qidiruv"
            className="v3-tugma text-xs py-1.5 px-3 hidden sm:flex items-center gap-2 font-mono text-[var(--v3-xira)]"
          >
            <Ikon nom="qidiruv" olcham={13} />
            <span>Izlash...</span>
            <kbd className="text-[9.5px] px-1 py-0.5 rounded border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
              Ctrl+K
            </kbd>
          </Link>

          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {/* ─── ASOSIY MAZMUN ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* HERO SECTION — CHAPDA ILMIY MATN VA STATISTIKA, O'NGDA OKTAEDRIK D-ORBITAL AJRALISHI */}
        <section className="v3-panel-karta p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--v3-urgu)]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 lg:gap-12 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 v3-tag v3-tag-ochiq text-xs font-mono">
                <Ikon nom="atom" olcham={14} />
                <span>Koordinatsion Kimyo & Kristall Maydon</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--v3-matn)] tracking-tight leading-[1.08]">
                Kompleks Birikmalar <br />
                <span className="text-[var(--v3-urgu)]">Kutubxonasi</span>
              </h2>

              <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-xl leading-relaxed">
                To{"'"}rt yo{"'"}nalish, <strong className="text-[var(--v3-matn)]">{hajm.jamiTahlilVaMavzu} ta</strong> ilmiy
                tahlil va mavzu sahifasi. Kristall maydon nazariyasidan Mössbauer spektroskopiyasigacha —
                har bir birikma o{"'"}z spektrlari, termodinamikasi va 3D kristall modeli bilan.
              </p>

              {/* Sanoqlar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--v3-chiziq)] font-mono text-center">
                {SANOQLAR.map((s) => (
                  <div key={s.nom} className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                    <div className={`text-2xl font-black tabular-nums ${s.rang}`}>{s.son}</div>
                    <div className="text-[10px] text-[var(--v3-xira)] uppercase tracking-wider mt-0.5">
                      {s.nom}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* d-Orbitalning Oktaedrik Maydonda Ajralishi SVG Diagrammasi */}
            <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-3 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-mono pb-2 border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)]">
                <span className="font-bold text-[var(--v3-matn)]">d-Orbital Yoriqlanishi (Oh)</span>
                <span className="text-[var(--v3-urgu)] font-bold">Δo (10 Dq)</span>
              </div>

              <svg viewBox="0 0 360 220" className="w-full max-w-md h-auto" role="img">
                {/* Erkin ion sathi */}
                <line x1="30" y1="110" x2="330" y2="110" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" />
                <text x="30" y="102" fill="currentColor" opacity="0.6" fontSize="9.5" fontFamily="monospace">
                  Erkin ion (Degenerirlangan d⁵)
                </text>

                {/* Yuqori eg sathi (dx2-y2, dz2) */}
                <g>
                  <line x1="200" y1="55" x2="245" y2="55" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="255" y1="55" x2="300" y2="55" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <text x="310" y="59" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    eg (+0.6 Δo)
                  </text>
                </g>

                {/* Quyi t2g sathi (dxy, dxz, dyz) */}
                <g>
                  <line x1="180" y1="155" x2="218" y2="155" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                  <line x1="226" y1="155" x2="264" y2="155" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                  <line x1="272" y1="155" x2="310" y2="155" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                  <text x="318" y="159" fill="#06b6d4" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    t2g (−0.4 Δo)
                  </text>
                </g>

                {/* Delta O o'qi */}
                <g>
                  <line x1="160" y1="55" x2="160" y2="155" stroke="#a855f7" strokeWidth="1.5" />
                  <path d="M156 65 L160 55 L164 65" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  <path d="M156 145 L160 155 L164 145" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  <text x="115" y="110" fill="#a855f7" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    Δo
                  </text>
                </g>
              </svg>

              <div className="text-[10.5px] font-mono text-[var(--v3-xira)] text-center">
                Oktaedrik ligand maydonida 5 ta d-orbital 2 ta <span className="text-amber-400 font-bold">eg</span> va 3 ta <span className="text-cyan-400 font-bold">t2g</span> pog{"'"}onalariga ajraladi.
              </div>
            </div>
          </div>
        </section>

        {/* ─── TO'RT ASOSIY YO'NALISH KARTALARI ─── */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b pb-2 border-[var(--v3-chiziq)]">
            <h3 className="text-base font-bold text-[var(--v3-matn)]">
              Kutubxonaning 4 Asosiy Bo{"'"}limi
            </h3>
            <span className="text-xs font-mono text-[var(--v3-xira)] hidden sm:inline">
              Rang — bo{"'"}limga mos kompleks ionining haqiqiy rangi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {BOLIMLAR.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className={`v3-panel-karta p-6 flex flex-col justify-between hover:border-[var(--v3-urgu)] transition-all group ${
                  b.keng ? "md:col-span-3" : "md:col-span-3"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] group-hover:scale-110 transition-transform">
                      <Ikon nom={b.ikon} olcham={20} />
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]">
                      {b.ion}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                      {b.title}
                    </h4>
                    <p className="text-xs text-[var(--v3-xira)] leading-relaxed mt-1">
                      {b.desc}
                    </p>
                  </div>

                  {b.namunalar && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {b.namunalar.map((n, i) => (
                        <span
                          key={i}
                          className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--v3-chiziq)] flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--v3-urgu)]">{b.birlik}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[var(--v3-matn)] font-bold">
                    <span>Ochish</span>
                    <Ikon nom="ong" olcham={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── 20 TA TAHLIL USULLARIGA TEZKOR O'TISH ─── */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--v3-matn)]">
                Eng Ko{"'"}p Qo{"'"}llaniladigan 8 Ta Tahlil Metodi
              </h3>
              <p className="text-xs text-[var(--v3-xira)]">
                Spektroskopiya va difraksiya katalogiga tezkor kirish:
              </p>
            </div>

            <Link
              href="/ilmiy/tahlil"
              className="v3-tugma text-xs py-1.5 px-3 font-bold flex items-center gap-1 text-[var(--v3-urgu)]"
            >
              <span>Barcha 20 Usul</span>
              <Ikon nom="ong" olcham={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {TOP_USULLAR.map((u) => (
              <Link
                key={u.kalit}
                href={u.href}
                className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] transition-all flex items-center justify-between group"
              >
                <span className="font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                  {u.nom}
                </span>
                <span className="text-[10px] text-[var(--v3-xira)] bg-[var(--v3-fon)] px-1.5 py-0.5 rounded border border-[var(--v3-chiziq)]">
                  {u.son} ta
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
