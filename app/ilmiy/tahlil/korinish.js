"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ============================================================================
// 20 TA FIZIKO-KIMYOVIY TAHLIL USULLARI BAZASI (V3 Standart)
// ============================================================================
const USULLAR = [
  // === 1. SPEKTROSKOPIK USULLAR ===
  {
    id: "uv-vis",
    href: "/ilmiy/tahlil/ub-vis",
    ikon: "nurlar",
    title: "UV-Vis spektroskopiya",
    desc: "Ultrabinafsha va ko'rinadigan soha. d-d o'tishlar, Tanabe-Sugano diagrammalari, LMCT/MLCT zaryad ko'chishi va Δo hisoblash.",
    toifa: "spektroskopiya",
    daraja: "boshlang'ich",
    aniqlaydi: ["Eritma rangi va yutilish", "Kristall maydon kuchi (Δo)", "Fazoviy simmetriya", "Yuqori/quyi spin holati"],
    bogliq: ["cd", "fluoressensiya", "titrlash"],
    tarixiy: { yil: 1852, olim: "Beer & Lambert" },
    badge: "Eng ko'p qo'llaniladi",
  },
  {
    id: "ir",
    href: "/ilmiy/tahlil/iq",
    ikon: "grafik",
    title: "IQ (FT-IR) spektroskopiya",
    desc: "Infraqizil soha. M−L valent va deformatsion tebranishlari, ambidentat ligandlar koordinatsiyasi va funksional guruhlar.",
    toifa: "spektroskopiya",
    daraja: "boshlang'ich",
    aniqlaydi: ["Funksional guruhlar", "M−L koordinatsion bog'lanishi", "Ambidentat ligandlar", "Gidratatsiya turlari"],
    bogliq: ["raman", "uv-vis"],
    tarixiy: { yil: 1800, olim: "W. Herschel" },
    badge: "Molekulyar barmoq izi",
  },
  {
    id: "raman",
    href: "/ilmiy/tahlil/raman",
    ikon: "nurlar",
    title: "Raman spektroskopiya",
    desc: "Kombinatsion sochiluvchi spektr. Qutblanish o'zgarishi, simmetrik valent tebranishlar va suvli eritmalarda IQ ga nisbatan afzallik.",
    toifa: "spektroskopiya",
    daraja: "orta",
    aniqlaydi: ["Simmetrik tebranishlar", "M−M metall-metall bog'lar", "Kristallik darajasi", "Past chastotali panjara tebranishlari"],
    bogliq: ["ir", "uv-vis"],
    tarixiy: { yil: 1928, olim: "C.V. Raman" },
    badge: "To'ldiruvchi tebranish",
  },
  {
    id: "nmr",
    href: "/ilmiy/tahlil/nmr",
    ikon: "magnit",
    title: "YaMR (NMR) spektroskopiya",
    desc: "Yadro magnit rezonansi. ¹H, ¹³C, ³¹P, ¹⁹⁵Pt izotoplari, kimyoviy siljish, spin-spin ta'sirlashuvi va Evans paramagnit usuli.",
    toifa: "spektroskopiya",
    daraja: "orta",
    aniqlaydi: ["Koordinatsion sfera strukturasi", "Ligand dinamikasi va almashinuv", "Izotopik bog'lanish", "Magnit moment (Evans)"],
    bogliq: ["epr", "magnit"],
    tarixiy: { yil: 1946, olim: "Bloch & Purcell" },
    badge: "Tuzilish va dinamika",
  },
  {
    id: "epr",
    href: "/ilmiy/tahlil/epr",
    ikon: "tolqin",
    title: "EPR / ESR spektroskopiya",
    desc: "Elektron paramagnit rezonans. Juftlashmagan toq elektronli komplekslar, g-tensor anizotropiyasi, gipernozik bo'linish va ZFS.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["g-faktor tenzori", "Kovalentlik koeffitsienti", "Nol maydon ajralishi (ZFS)", "Toq elektron joylashuvi"],
    bogliq: ["nmr", "magnit", "mossbauer"],
    tarixiy: { yil: 1944, olim: "E.K. Zavoyskiy" },
    badge: "Paramagnit markazlar",
  },
  {
    id: "mossbauer",
    href: "/ilmiy/tahlil/mossbauer",
    ikon: "yadro",
    title: "Mössbauer spektroskopiya",
    desc: "Rezonansli gamma-yutilish. ⁵⁷Fe, ¹¹⁹Sn komplekslarida izomer siljishi (δ), kvadrupol ajralish (ΔEQ) va magnit gipernozik maydon.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Fe(II) vs Fe(III) oksidlanish", "Yuqori va quyi spin holati", "Elektron zichligi (s-elektron)", "Fazoviy simmetriya"],
    bogliq: ["exafs", "epr", "magnit"],
    tarixiy: { yil: 1958, olim: "R. Mössbauer" },
    badge: "Fe va Sn komplekslari",
  },
  {
    id: "cd",
    href: "/ilmiy/tahlil/cd",
    ikon: "aylanma",
    title: "CD (Sirkulyar dixroizm)",
    desc: "Chap va o'ng qutblangan nurlarning turlicha yutilishi. Δ va Λ optik izomerlar, Kotton effekti va absolyut konfiguratsiyani aniqlash.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Xirallik va optik faollik", "Enantiomerik tozalik (ee %)", "Absolyut konfiguratsiya (Δ/Λ)", "Konformatsion o'zgarishlar"],
    bogliq: ["uv-vis"],
    tarixiy: { yil: 1811, olim: "Arago & Biot" },
    badge: "Xirallik va optik izomeriya",
  },
  {
    id: "fluoressensiya",
    href: "/ilmiy/tahlil/fluoressensiya",
    ikon: "nurlar",
    title: "Lyuminessensiya va Fluoressensiya",
    desc: "Qo'zg'atilgan holat emissiyasi. Lantanidlar (Eu³⁺, Tb³⁺) antenna effekti, Ru(II)/Ir(III) komplekslari va OLED emitterlari tahlili.",
    toifa: "spektroskopiya",
    daraja: "orta",
    aniqlaydi: ["Emissiya spektri va rang", "Kvant unumdorligi (Φ)", "Lyuminessensiya yashash vaqti (τ)", "Ligand-metall energiya ko'chishi"],
    bogliq: ["uv-vis"],
    tarixiy: { yil: 1852, olim: "G.G. Stokes" },
    badge: "OLED va bio-sensorlar",
  },
  {
    id: "xps",
    href: "/ilmiy/tahlil/xps",
    ikon: "mikroskop",
    title: "XPS (Rentgen fotoelektron)",
    desc: "Sirt tahlili va ichki qobiq fotoionlanishi. Atomlarning bog'lanish energiyasi (Eb), oksidlanish darajasi va zaryad taqsimoti.",
    toifa: "spektroskopiya",
    daraja: "ilmiy",
    aniqlaydi: ["Bog'lanish energiyasi (Eb)", "Oksidlanish darajasi", "Sirt atomar tarkibi", "Kovalentlik va donorlik"],
    bogliq: ["exafs", "element-analiz"],
    tarixiy: { yil: 1954, olim: "K. Siegbahn" },
    badge: "Sirt va zaryad tahlili",
  },

  // === 2. DIFRAKSION VA RENTGEN TAHLILI ===
  {
    id: "rentgen",
    href: "/ilmiy/tahlil/rentgen",
    ikon: "kristall",
    title: "Rentgen difraksiyasi (XRD / RSAT)",
    desc: "Yagona kristall (SCXRD) va kukun (PXRD). Bragg qonuni, panjara parametrlari (a,b,c), fazoviy guruh va aniq 3D atom koordinatalari.",
    toifa: "difraksiya",
    daraja: "ilmiy",
    aniqlaydi: ["Aniq 3D fazoviy tuzilish", "Bog' uzunliklari va burchaklar", "Kristall panjara parametrlari", "Faza tozaligi (PXRD)"],
    bogliq: ["exafs"],
    tarixiy: { yil: 1912, olim: "von Laue & Bragg" },
    badge: "Aniq 3D kristall tuzilish",
  },
  {
    id: "exafs",
    href: "/ilmiy/tahlil/exafs",
    ikon: "atom",
    title: "EXAFS / XANES spektroskopiyasi",
    desc: "Sinxrotron rentgen yutilishi. Mahalliy geometrik tuzilish: birinchi koordinatsion sfera radiusi (R), koordinatsion son (N) va Debye-Waller omili.",
    toifa: "difraksiya",
    daraja: "ilmiy",
    aniqlaydi: ["M−L bog' uzunligi (R)", "Koordinatsion son (N)", "Amorf va suyuq fazada tuzilish", "Metall oksidlanish darajasi (XANES)"],
    bogliq: ["rentgen", "mossbauer"],
    tarixiy: { yil: 1929, olim: "Kronig & Kossel" },
    badge: "Mahalliy nano-struktura",
  },

  // === 3. MASS VA ELEMENTAR ANALITIK USULLAR ===
  {
    id: "mass",
    href: "/ilmiy/tahlil/mass",
    ikon: "orin",
    title: "Mass-spektrometriya (ESI-MS / MALDI)",
    desc: "Yumshoq ionlanish usullari. Kompleks kation/anion molekulyar massasi, izotopik taqsimot klasterlari va parchalanish fragmentatsiyasi.",
    toifa: "analitik",
    daraja: "orta",
    aniqlaydi: ["Aniq molekulyar massa (m/z)", "Izotopik taqsimot modeli", "Ligandlar ajralish yo'llari", "Ko'p yadroli klaster tarkibi"],
    bogliq: ["element-analiz", "icp"],
    tarixiy: { yil: 1913, olim: "J.J. Thomson" },
    badge: "Molekulyar og'irlik",
  },
  {
    id: "element-analiz",
    href: "/ilmiy/tahlil/element-analiz",
    ikon: "kolba",
    title: "Elementar tahlil (CHNOS / EA)",
    desc: "Avtomatlashgan yuqori haroratli yonish tahlili. Uglerod, vodorod, azot, oltingugurt foiz miqdorlari va brutto formula tasdiqlash.",
    toifa: "analitik",
    daraja: "boshlang'ich",
    aniqlaydi: ["C, H, N, S massa foizi", "Empirik brutto formula", "Namuna tozalik darajasi", "Solvat/gidrat molekulalari soni"],
    bogliq: ["mass", "termik"],
    tarixiy: { yil: 1831, olim: "J. von Liebig" },
    badge: "Empirik formula",
  },
  {
    id: "aas",
    href: "/ilmiy/tahlil/aas",
    ikon: "alanga",
    title: "AAS (Atom-absorbtsion)",
    desc: "Alanga va elektrotermik atomizatsiya. Kompleks birikma tarkibidagi metall ionlarining ppm-ppb miqdoriy konsentratsiyasini aniqlash.",
    toifa: "analitik",
    daraja: "boshlang'ich",
    aniqlaydi: ["Metall massa ulushi (%)", "Konsentratsiya (mg/L, ppm)", "Metall:ligand stexiometriyasi"],
    bogliq: ["icp", "element-analiz"],
    tarixiy: { yil: 1955, olim: "A. Walsh" },
    badge: "Metall miqdoriy tahlili",
  },
  {
    id: "icp",
    href: "/ilmiy/tahlil/icp",
    ikon: "plazma",
    title: "ICP-OES / ICP-MS (Plazma)",
    desc: "Induktiv bog'langan argon plazmasi (6000-10000 K). Bir vaqtning o'zida 70 dan ortiq elementlarni ultra-iz (ppb/ppt) darajasida tahlil qilish.",
    toifa: "analitik",
    daraja: "orta",
    aniqlaydi: ["Bir vaqtda ko'p metalli tarkib", "Ultra-iz miqdorlar (ppb/ppt)", "Izotopik nisbatlar", "Nopokliklar tekshiruvi"],
    bogliq: ["aas", "mass"],
    tarixiy: { yil: 1965, olim: "V.A. Fassel" },
    badge: "Ultra-iz ko'p elementli",
  },

  // === 4. TERMIK VA FIZIKO-KIMYOVIY USULLAR ===
  {
    id: "magnit",
    href: "/ilmiy/tahlil/magnit",
    ikon: "magnit",
    title: "Magnitometriya (SQUID / Gouy)",
    desc: "Magnit sezuvchanlik (χ). Efektiv magnit moment (μeff), Curie-Weiss qonuni, spin krossover hodisasi va ferromagnit/antiferromagnit almashinuv.",
    toifa: "fizik-kimyoviy",
    daraja: "ilmiy",
    aniqlaydi: ["Magnit moment (μeff, BM)", "Toq elektronlar soni (n)", "Spin krossover (LS ↔ HS)", "Almashinuv integrali (J)"],
    bogliq: ["epr", "nmr"],
    tarixiy: { yil: 1964, olim: "J. Zimmerman" },
    badge: "Spin va magnit holat",
  },
  {
    id: "elektrokimyo",
    href: "/ilmiy/tahlil/elektrokimyo",
    ikon: "chaqmoq",
    title: "Siklik voltamperometriya (CV)",
    desc: "Uch elektrodli elektrokimyoviy katakcha. Redoks potensiallar (E1/2), qaytuvchanlik mezoni (ΔEp), diffuziya koeffitsienti va elektronlar soni.",
    toifa: "fizik-kimyoviy",
    daraja: "orta",
    aniqlaydi: ["Redoks potensiali (E°)", "Qaytuvchanlik (Reversibility)", "Kinetika va elektron uzatish", "Oraliq radikal zaryadlar"],
    bogliq: ["uv-vis", "xps"],
    tarixiy: { yil: 1960, olim: "Adams & Nicholson" },
    badge: "Redoks xossalari",
  },
  {
    id: "termik",
    href: "/ilmiy/tahlil/termik",
    ikon: "harorat",
    title: "Termik tahlil (TGA / DTA / DSC)",
    desc: "Boshqariladigan qizdirish dinamikasi. Tashqi va ichki sfera gidrat suvlarini yo'qotish, ligandlar termolizi va parchalanish oraliq fazalari.",
    toifa: "fizik-kimyoviy",
    daraja: "boshlang'ich",
    aniqlaydi: ["Termik barqarorlik chegarasi", "Tashqi va koordinatsion H₂O", "Parchalanish entalpiyasi (ΔH)", "Yakuniy metall oksidi qoldig'i"],
    bogliq: ["rentgen", "element-analiz"],
    tarixiy: { yil: 1887, olim: "H. Le Chatelier" },
    badge: "Termik barqarorlik",
  },
  {
    id: "konduktometriya",
    href: "/ilmiy/tahlil/konduktometriya",
    ikon: "chaqmoq",
    title: "Konduktometriya (Elektr o'tkazuvchanlik)",
    desc: "Molyar elektr o'tkazuvchanlik (ΛM). Kompleksning eritmadagi elektrolit turini (1:1, 1:2, 1:3, neytral) va tashqi sfera ionlarini aniqlash.",
    toifa: "fizik-kimyoviy",
    daraja: "boshlang'ich",
    aniqlaydi: ["Elektrolit turi (1:1, 1:2, 1:3)", "Ichki vs tashqi sfera ionlari", "Verner nazariyasi isboti", "Ionlanish izomeriyasini farqlash"],
    bogliq: ["titrlash", "element-analiz"],
    tarixiy: { yil: 1893, olim: "A. Werner" },
    badge: "Elektrolit va ionlar soni",
  },
  {
    id: "titrlash",
    href: "/ilmiy/tahlil/titrlash",
    ikon: "tomchi",
    title: "Potensiometrik va Spektrofotometrik titrlash",
    desc: "Bosqichma-bosqich kompleks hosil bo'lishi. Umumiy va bosqichli barqarorlik konstantalari (log βn), protonlanish konstantalari va stexiometriya.",
    toifa: "fizik-kimyoviy",
    daraja: "orta",
    aniqlaydi: ["Barqarorlik konstantasi (log β)", "Bosqichli komplekslar tarkibi", "Metall:ligand stexiometriyasi", "pH ga bog'liq shakllar taqsimoti"],
    bogliq: ["uv-vis", "konduktometriya"],
    tarixiy: { yil: 1908, olim: "Job & Bjerrum" },
    badge: "Barqarorlik konstantalari",
  },
];

const TOIFALAR = [
  { id: "hammasi", label: "Barchasi", ikon: "kolba", soni: 20 },
  { id: "spektroskopiya", label: "Spektroskopiya", ikon: "nurlar", soni: 9 },
  { id: "difraksiya", label: "Difraksiya va X-Ray", ikon: "kristall", soni: 2 },
  { id: "analitik", label: "Elementar & Mass", ikon: "orin", soni: 4 },
  { id: "fizik-kimyoviy", label: "Fiziko-Kimyoviy", ikon: "chaqmoq", soni: 5 },
];

const DARAJALAR = [
  { id: "hammasi", label: "Barcha darajalar" },
  { id: "boshlang'ich", label: "Boshlang'ich (Bakalavr)" },
  { id: "orta", label: "O'rta (Magistratura)" },
  { id: "ilmiy", label: "Ilmiy / Chuqur (PhD)" },
];

export default function TahlilUsullariKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [activeToifa, setActiveToifa] = useState("hammasi");
  const [activeDaraja, setActiveDaraja] = useState("hammasi");
  const [qidiruv, setQidiruv] = useState("");
  const [selectedUsulId, setSelectedUsulId] = useState(null);

  const filteredUsullar = useMemo(() => {
    return USULLAR.filter((u) => {
      const toifaMos = activeToifa === "hammasi" || u.toifa === activeToifa;
      const darajaMos = activeDaraja === "hammasi" || u.daraja === activeDaraja;
      const qidiruvMos =
        qidiruv === "" ||
        u.title.toLowerCase().includes(qidiruv.toLowerCase()) ||
        u.desc.toLowerCase().includes(qidiruv.toLowerCase()) ||
        u.aniqlaydi.some((a) => a.toLowerCase().includes(qidiruv.toLowerCase()));
      return toifaMos && darajaMos && qidiruvMos;
    });
  }, [activeToifa, activeDaraja, qidiruv]);

  const selectedUsul = useMemo(() => {
    return USULLAR.find((u) => u.id === selectedUsulId) || null;
  }, [selectedUsulId]);

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      {/* ─── YUQORI NAVIGATSIYA HEADER ─── */}
      <header className="sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ilmiy"
            className="v3-tugma text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Ilmiy bo'limga qaytish"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Ilmiy Bo{"'"}lim</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="nurlar" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Kompleks Birikmalarning Tahlil Usullari
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                20 ta zamonaviy fiziko-kimyoviy va spektroskopik tahlil metodi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {/* ─── ASOSIY MAZMUN ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* STATISTIK BANNER */}
        <div className="v3-panel-karta p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--v3-urgu)]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 v3-tag v3-tag-ochiq text-xs font-mono">
              <Ikon nom="atom" olcham={14} />
              <span>Oliy Kimyo & Ilmiy Tadqiqot Metodologiyasi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[var(--v3-matn)] tracking-tight">
              Koordinatsion Birikmalarni Identifikatsiya Qilish
            </h2>

            <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-3xl leading-relaxed">
              Sintez qilingan har bir kompleks birikmaning fazoviy geometriyasi, elektron strukturasi,
              magnit xossalari va barqarorligini to{"'"}liq isbotlash uchun fiziko-kimyoviy usullarning
              uzluksiz ketma-ketligi qo{"'"}llaniladi.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[var(--v3-chiziq)] font-mono text-center">
              <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                <div className="text-xl sm:text-2xl font-black text-[var(--v3-urgu)]">20</div>
                <div className="text-[10px] text-[var(--v3-xira)] uppercase">Tahlil Metodi</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                <div className="text-xl sm:text-2xl font-black text-cyan-400">9</div>
                <div className="text-[10px] text-[var(--v3-xira)] uppercase">Spektroskopiya</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">350+</div>
                <div className="text-[10px] text-[var(--v3-xira)] uppercase">Birikma Tahlili</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                <div className="text-xl sm:text-2xl font-black text-amber-400">3D</div>
                <div className="text-[10px] text-[var(--v3-xira)] uppercase">Kristall & Bog{"'"}lar</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-black text-purple-400">100%</div>
                <div className="text-[10px] text-[var(--v3-xira)] uppercase">IUPAC & Ilmiy Baza</div>
              </div>
            </div>
          </div>
        </div>

        {/* QIDIRUV VA TOIFA FILTRI */}
        <div className="v3-panel-karta p-6 space-y-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[var(--v3-xira)]">
                <Ikon nom="qidiruv" olcham={16} />
              </div>
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Metod nomi, aniqlanadigan xususiyat (masalan: spin, bog' uzunligi, Δo, xirallik)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] placeholder-[var(--v3-xira)] focus:outline-none focus:border-[var(--v3-urgu)] focus:ring-1 focus:ring-[var(--v3-urgu)] transition-all font-mono"
              />
              {qidiruv && (
                <button
                  type="button"
                  onClick={() => setQidiruv("")}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Daraja selektori */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--v3-xira)] whitespace-nowrap hidden sm:inline">
                Murakkablik:
              </span>
              <select
                value={activeDaraja}
                onChange={(e) => setActiveDaraja(e.target.value)}
                className="px-3 py-2 rounded-xl border text-xs font-mono bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] focus:outline-none focus:border-[var(--v3-urgu)] cursor-pointer"
              >
                {DARAJALAR.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[var(--v3-fon-2)] text-[var(--v3-matn)]">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toifalar tugmalari */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--v3-chiziq)]">
            {TOIFALAR.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveToifa(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                  activeToifa === t.id
                    ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-md"
                    : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                }`}
              >
                <Ikon nom={t.ikon} olcham={13} />
                <span>{t.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({t.soni})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 20 TA USUL GRIDI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsullar.map((u) => {
            const tanlangan = selectedUsulId === u.id;
            return (
              <div
                key={u.id}
                onMouseEnter={() => setSelectedUsulId(u.id)}
                className={`v3-panel-karta p-5 flex flex-col justify-between transition-all duration-200 group relative border ${
                  tanlangan
                    ? "border-[var(--v3-urgu)] ring-1 ring-[var(--v3-urgu)]/30 -translate-y-1 shadow-xl"
                    : "hover:border-[var(--v3-chiziq-2)] hover:-translate-y-0.5"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] group-hover:scale-110 transition-transform">
                      <Ikon nom={u.ikon} olcham={20} />
                    </div>

                    <span
                      className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                        u.daraja === "boshlang'ich"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : u.daraja === "orta"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {u.daraja === "boshlang'ich"
                        ? "Bakalavr"
                        : u.daraja === "orta"
                        ? "Magistratura"
                        : "Ilmiy (PhD)"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                      {u.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono text-[var(--v3-urgu)] font-bold mt-0.5">
                      {u.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--v3-xira)] leading-relaxed line-clamp-3">
                    {u.desc}
                  </p>

                  {/* Aniqlaydi teglar */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {u.aniqlaydi.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--v3-chiziq)] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--v3-xira)] text-[10px]">
                    {u.tarixiy.yil} · {u.tarixiy.olim}
                  </span>

                  <Link
                    href={u.href}
                    className="v3-tugma v3-tugma-asosiy text-xs py-1 px-2.5 font-bold flex items-center gap-1 group-hover:shadow-md"
                  >
                    <span>O{"'"}rganish</span>
                    <Ikon nom="ong" olcham={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* HECH NIMA TOPILMAGANDA */}
        {filteredUsullar.length === 0 && (
          <div className="v3-panel-karta p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Ikon nom="taqiq" olcham={24} />
            </div>
            <h3 className="text-base font-bold text-[var(--v3-matn)]">
              Mos Tahlil Usuli Topilmadi
            </h3>
            <p className="text-xs text-[var(--v3-xira)]">
              Qidiruv so{"'"}zini yoki toifa filtrlarini o{"'"}zgartirib ko{"'"}ring.
            </p>
            <button
              type="button"
              onClick={() => {
                setQidiruv("");
                setActiveToifa("hammasi");
                setActiveDaraja("hammasi");
              }}
              className="v3-tugma text-xs py-1.5 px-4 font-bold"
            >
              Filtrlarni Tozalash
            </button>
          </div>
        )}

        {/* ─── INTERAKTIV WORKFLOW: TADQIQOTCHI AMALIY METODOLOGIYASI ─── */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Laboratoriya Protokoli</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>Kompleks Birikmani To{"'"}liq Tahlil Qilish Bosqichlari</span>
            </h2>
            <p className="text-xs text-[var(--v3-xira)]">
              Yangi sintez qilingan koordinatsion birikmani jahon ilmiy standartlarida (Q1 jurnallari talabida) tasdiqlash yo{"'"}li:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                bosqich: "1-Bosqich: Tarkib va Barqarorlik",
                usullar: [
                  { nom: "Elementar tahlil (CHNOS)", href: "/ilmiy/tahlil/element-analiz" },
                  { nom: "Mass-spektrometriya (ESI-MS)", href: "/ilmiy/tahlil/mass" },
                  { nom: "Termik tahlil (TGA/DTA)", href: "/ilmiy/tahlil/termik" },
                ],
                natija: "Empirik formula, molekulyar massa va kristallizatsion suv miqdori aniqlanadi.",
                rang: "emerald",
              },
              {
                bosqich: "2-Bosqich: 3D Geometriya va Bog'lar",
                usullar: [
                  { nom: "Rentgen difraksiyasi (SCXRD)", href: "/ilmiy/tahlil/rentgen" },
                  { nom: "IQ (FT-IR) spektroskopiya", href: "/ilmiy/tahlil/iq" },
                  { nom: "Raman spektroskopiyasi", href: "/ilmiy/tahlil/raman" },
                ],
                natija: "Atomlarning 3D koordinatalari, M-L bog' uzunliklari va koordinatsion sfera aniqlanadi.",
                rang: "cyan",
              },
              {
                bosqich: "3-Bosqich: Elektron Tuzilish va Optika",
                usullar: [
                  { nom: "UV-Vis spektroskopiyasi", href: "/ilmiy/tahlil/ub-vis" },
                  { nom: "CD (Sirkulyar dixroizm)", href: "/ilmiy/tahlil/cd" },
                  { nom: "Fluoressensiya spektri", href: "/ilmiy/tahlil/fluoressensiya" },
                ],
                natija: "d-d o'tishlar, Δo ajralish energiyasi, LMCT/MLCT va optik xirallik tasdiqlanadi.",
                rang: "purple",
              },
              {
                bosqich: "4-Bosqich: Magnit va Spin Holati",
                usullar: [
                  { nom: "SQUID magnitometriyasi", href: "/ilmiy/tahlil/magnit" },
                  { nom: "EPR (Paramagnit rezonans)", href: "/ilmiy/tahlil/epr" },
                  { nom: "Mössbauer spektroskopiyasi", href: "/ilmiy/tahlil/mossbauer" },
                ],
                natija: "Toq elektronlar soni (μeff), spin krossover va metallning oksidlanish darajasi aniqlanadi.",
                rang: "amber",
              },
              {
                bosqich: "5-Bosqich: Eritmadagi Fiziko-Kimyo",
                usullar: [
                  { nom: "Siklik voltamperometriya (CV)", href: "/ilmiy/tahlil/elektrokimyo" },
                  { nom: "Molyar elektr o'tkazuvchanlik", href: "/ilmiy/tahlil/konduktometriya" },
                  { nom: "Spektrofotometrik titrlash", href: "/ilmiy/tahlil/titrlash" },
                ],
                natija: "Redoks potensiallar (E°), elektrolit tipi (1:1, 1:2) va barqarorlik konstantalari (log β).",
                rang: "sky",
              },
              {
                bosqich: "6-Bosqich: Sirt va Sinxrotron Tahlili",
                usullar: [
                  { nom: "XPS rentgen fotoelektron", href: "/ilmiy/tahlil/xps" },
                  { nom: "EXAFS / XANES sinxrotron", href: "/ilmiy/tahlil/exafs" },
                  { nom: "ICP-MS ultra-iz tahlili", href: "/ilmiy/tahlil/icp" },
                ],
                natija: "Mahalliy sinxrotron radiusi, atomik zaryad taqsimoti va ppb darajadagi tozalik.",
                rang: "rose",
              },
            ].map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase text-[var(--v3-urgu)]">
                    {b.bosqich}
                  </div>

                  <div className="space-y-1">
                    {b.usullar.map((u, i) => (
                      <Link
                        key={i}
                        href={u.href}
                        className="block text-xs font-bold text-[var(--v3-matn)] hover:text-[var(--v3-urgu)] transition-colors py-0.5"
                      >
                        → {u.nom}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--v3-chiziq)] text-[11px] text-[var(--v3-xira)] leading-relaxed">
                  <strong>Natija:</strong> {b.natija}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
