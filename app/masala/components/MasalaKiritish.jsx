// app/masala/components/MasalaKiritish.jsx
//
// JDA KIMYO — Zamonaviy Masala Kiritish va Kimyoviy Klaviatura Ishchi Zonasi (v4.0.0)

"use client";

import { useState, useEffect, useRef } from "react";
import Ikon from "@/components/Ikon";
import toast from "react-hot-toast";

export const REJIMLAR = [
  {
    id: "tuzoq",
    nom: "Yashirin Qopqon & Tuzoq",
    nishon: "⚡ 1-Rejim",
    tavsif: "Olimpiada va DTM uchun: Masaladagi nozik ayyorlik va keng tarqalgan xatolarni ochadi (Javobsiz).",
    ikon: "chaqmoq",
    rang: "border-amber-500/60 text-amber-400 bg-amber-500/10",
  },
  {
    id: "yonalish",
    nom: "Yo'l-yo'riq & Formulalar",
    nishon: "🧭 2-Rejim",
    tavsif: "Mustaqil yechish uchun: Barcha reaksiya tenglamalari va formulalarni beradi, hisoblash talaba zimmasida.",
    ikon: "kitob",
    rang: "border-blue-500/60 text-blue-400 bg-blue-500/10",
  },
  {
    id: "toliq",
    nom: "To'liq Master Yechim",
    nishon: "🎯 3-Rejim",
    tavsif: "Berilgan, Topish kerak, Reaksiyalar, KaTeX bosqichlari va yakuniy aniq javob bilan to'liq tahlil.",
    ikon: "orin",
    rang: "border-emerald-500/60 text-emerald-400 bg-emerald-500/10",
  },
];

export const KATEGORIYALAR = [
  {
    id: "eritmalar",
    nom: "Eritmalar",
    tavsif: "Massaviy ulush (%), suv qo'shish, bug'latish, eritmalar aralashmasi (Pearson kresti)",
    ikon: "kolba",
    namunalar: [
      "200 g 15% li CuSO4 eritmasiga 50 g suv qo'shilganda hosil bo'lgan yangi eritmaning massaviy ulushini (%) toping.",
      "100 g 10% li va 300 g 30% li tuz eritmalar aralashtirilganda hosil bo'lgan yangi eritmaning massaviy ulushi necha foiz bo'ladi?",
      "300 g 20% li eritmadan 100 g suv bug'latilgach yangi eritma konsentratsiyasi necha foizga yetadi?",
    ],
  },
  {
    id: "kristallogidrat",
    nom: "Kristallogidrat",
    tavsif: "CuSO4·5H2O, FeSO4·7H2O kristallari, kristallizatsiya suvi va suvsiz tuz ulushi",
    ikon: "atom",
    namunalar: [
      "25 g mis kuporosi (CuSO4·5H2O) 175 g suvda eritildi. Hosil bo'lgan eritmadagi CuSO4 ning massa ulushini (%) hisoblang.",
      "27.8 g temir kuporosi FeSO4·7H2O 172.2 g suvda eritildi. Hosil bo'lgan eritmaning foiz konsentratsiyasini toping.",
    ],
  },
  {
    id: "stexiometriya",
    nom: "Stexiometriya",
    tavsif: "Reaksiya tenglamalari, mollar nisbati, ortiqcha va cheklovchi reagent",
    ikon: "reaksiya",
    namunalar: [
      "10 g NaOH bilan 9.8 g H2SO4 ta'sirlashganda qancha Na2SO4 tuzi hosil bo'ladi va qaysi modda necha gramm ortib qoladi?",
      "13 g rux metali yetarli miqdordagi xlorid kislotasi bilan reaksiyaga kirishganda normal sharoitda necha litr vodorod ajraladi?",
      "5.4 g alyuminiy xlorid kislotada to'liq eriganda qancha litr (n.sh.) vodorod gazi ajraladi?",
    ],
  },
  {
    id: "gazlar",
    nom: "Gazlar",
    tavsif: "Normal sharoitdagi hajm (22.4 L/mol), nisbiy zichlik (D_havo, D_H2) va gazlar aralashmasi",
    ikon: "bulut",
    namunalar: [
      "Normal sharoitda 5.6 litr CO2 gazi necha gramm massaga ega va uning havoga nisbatan zichligi nechaga teng?",
      "20 litr metan va etan aralashmasi to'liq yondirilganda 32 litr CO2 hosil bo'ldi. Dastlabki aralashmadagi metanning hajm ulushini (%) toping.",
    ],
  },
  {
    id: "elektroliz",
    nom: "Elektroliz",
    tavsif: "Faradey qonunlari, katod va anod jarayonlari, tok kuchi va vaqt",
    ikon: "chaqmoq",
    namunalar: [
      "Mis (II) sulfat eritmasi orqali 5 A tok kuchi 32 daqiqa 10 soniya davomida o'tkazilganda katodda necha gramm mis ajraladi?",
    ],
  },
  {
    id: "muvozanat",
    nom: "Muvozanat",
    tavsif: "Kimyoviy muvozanat konstantasi (K_m), Le Shatelye prinsipi va konsentratsiya",
    ikon: "olov",
    namunalar: [
      "N2 + 3H2 <=> 2NH3 reaksiyasida boshlang'ich moddalar konsentratsiyalari [N2]=2 mol/l, [H2]=4 mol/l. Muvozanat holatida [NH3]=1 mol/l bo'lsa, muvozanat konstantasi K_m ni toping.",
    ],
  },
];

// Kimyoviy tezkor belgilar
const TEZKOR_BELGILAR = [
  { belgi: "₀", label: "0" },
  { belgi: "₁", label: "1" },
  { belgi: "₂", label: "2" },
  { belgi: "₃", label: "3" },
  { belgi: "₄", label: "4" },
  { belgi: "₅", label: "5" },
  { belgi: "₆", label: "6" },
  { belgi: "₇", label: "7" },
  { belgi: "₈", label: "8" },
  { belgi: "₉", label: "9" },
  { belgi: "⁺", label: "+" },
  { belgi: "⁻", label: "-" },
  { belgi: "²⁺", label: "2+" },
  { belgi: "³⁺", label: "3+" },
  { belgi: "→", label: "→" },
  { belgi: "⇌", label: "⇌" },
  { belgi: "↑", label: "↑" },
  { belgi: "↓", label: "↓" },
  { belgi: "Δ", label: "Δ" },
  { belgi: "°C", label: "°C" },
  { belgi: "ω", label: "ω" },
  { belgi: "ν", label: "ν" },
  { belgi: "ρ", label: "ρ" },
  { belgi: "pH", label: "pH" },
];

export default function MasalaKiritish({ onYechish, yuklanmoqda }) {
  const [faolRejim, setFaolRejim] = useState("toliq");
  const [faolKategoriya, setFaolKategoriya] = useState("eritmalar");
  const [matn, setMatn] = useState("");
  const [rasmBase64, setRasmBase64] = useState(null);
  const [rasmNomi, setRasmNomi] = useState("");
  const [ovozYozilmoqda, setOvozYozilmoqda] = useState(false);
  const [speechRecog, setSpeechRecog] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = "uz-UZ";

        recognizer.onresult = (event) => {
          let yangiMatn = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            yangiMatn += event.results[i][0].transcript;
          }
          if (yangiMatn) {
            setMatn((prev) => (prev ? prev + " " + yangiMatn : yangiMatn));
          }
        };

        recognizer.onerror = () => {
          setOvozYozilmoqda(false);
        };

        recognizer.onend = () => {
          setOvozYozilmoqda(false);
        };

        setSpeechRecog(recognizer);
      }
    }
  }, []);

  const belgiQosh = (belgi) => {
    if (!textareaRef.current) {
      setMatn((prev) => prev + belgi);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const yangiMatn = matn.substring(0, start) + belgi + matn.substring(end);
    setMatn(yangiMatn);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + belgi.length, start + belgi.length);
    }, 0);
  };

  const handleOvozYozish = () => {
    if (!speechRecog) {
      toast.error("Brauzeringiz ovozli yozishni qo'llab-quvvatlamaydi.");
      return;
    }
    if (ovozYozilmoqda) {
      speechRecog.stop();
      setOvozYozilmoqda(false);
    } else {
      try {
        speechRecog.start();
        setOvozYozilmoqda(true);
        toast("Ovoz yozilmoqda... Masalani dona-dona gapiring.", { icon: "🎙️" });
      } catch (e) {
        setOvozYozilmoqda(false);
      }
    }
  };

  const handleRasmYuklash = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayllarini yuklash mumkin (.jpg, .png, .webp)");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Rasm hajmi 4 MB dan oshmasligi kerak.");
      return;
    }

    setRasmNomi(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setRasmBase64(uploadEvent.target.result);
      toast.success("Rasm yuklandi! Endi 'Masalani Yechish' tugmasini bosing.");
    };
    reader.readAsDataURL(file);
  };

  const handleRasmOchirish = () => {
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matn.trim() && !rasmBase64) {
      toast.error("Iltimos, masala matnini yozing yoki rasmini yuklang.");
      return;
    }
    onYechish(matn, faolRejim, rasmBase64);
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. REJIM TANLASH (3 XIL REJIM) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {REJIMLAR.map((r) => {
          const faolmi = faolRejim === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setFaolRejim(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                faolmi
                  ? `${r.rang} ring-2 ring-[var(--v3-urgu)] shadow-lg`
                  : "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)] opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--v3-fon)] border border-[var(--v3-chiziq)]">
                  {r.nishon}
                </span>
                <Ikon nom={r.ikon} olcham={18} className="text-[var(--v3-urgu)]" />
              </div>
              <strong className="text-sm font-bold text-[var(--v3-matn)] block mb-1">
                {r.nom}
              </strong>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
                {r.tavsif}
              </p>
            </button>
          );
        })}
      </div>

      {/* ─── 2. ASOSIY KIRITISH FORMASI VA KLAVIATURA ─── */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl border bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="qalam" olcham={16} className="text-[var(--v3-urgu)]" />
            <span>Masala Shartini Kiriting yoki Rasm Yuklang</span>
          </label>
          <span className="text-[11px] text-[var(--v3-xira)] font-mono">
            {matn.length}/4000
          </span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={4}
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
            placeholder="Masala matnini kiriting... Masalan: 200 g 10% li osh tuzi eritmasiga 50 g suv qo'shilganda hosil bo'lgan yangi eritmaning massaviy ulushini toping..."
            className="w-full p-4 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] placeholder-[var(--v3-xira)] focus:outline-hidden focus:border-[var(--v3-urgu)] text-sm leading-relaxed font-sans resize-y"
          />
        </div>

        {/* Kimyoviy maxsus belgilar klaviaturasi */}
        <div className="p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[var(--v3-xira)]">
            <span className="font-semibold flex items-center gap-1.5">
              <Ikon nom="atom" olcham={13} className="text-[var(--v3-urgu)]" />
              Kimyoviy tezkor belgilar:
            </span>
            <span className="text-[10px]">Bosish orqali matnga qo&apos;shing</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEZKOR_BELGILAR.map((b) => (
              <button
                key={b.belgi}
                type="button"
                onClick={() => belgiQosh(b.belgi)}
                className="px-2 py-1 rounded-lg bg-[var(--v3-yuza)] hover:bg-[var(--v3-urgu)] hover:text-white border border-[var(--v3-chiziq)] text-xs font-mono font-bold transition-colors"
                title={b.label}
              >
                {b.belgi}
              </button>
            ))}
          </div>
        </div>

        {/* Yuklangan Rasm Ko'rinishi */}
        {rasmBase64 && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={rasmBase64}
                alt="Yuklangan masala"
                className="w-14 h-14 rounded-xl object-cover border border-amber-400/50"
              />
              <div>
                <strong className="text-xs text-white block truncate max-w-[200px] sm:max-w-md">
                  {rasmNomi || "Masala rasmi"}
                </strong>
                <span className="text-[10px] text-amber-400 font-bold">
                  OCR Vision AI tahliliga tayyor
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRasmOchirish}
              className="p-2 rounded-xl bg-black/40 text-red-400 hover:text-red-300 hover:bg-red-950/40"
              title="Rasmni o'chirish"
            >
              <Ikon nom="ochir" olcham={16} />
            </button>
          </div>
        )}

        {/* Tugmalar paneli (Ovoz, Rasm, Tozalash va Yechish) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {/* Rasm yuklash */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleRasmYuklash}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5 transition-colors"
            >
              <Ikon nom="rasm" olcham={16} className="text-[var(--v3-urgu)]" />
              <span>{rasmBase64 ? "Rasmni almashtirish" : "Rasm yuklash"}</span>
            </button>

            {/* Ovozli yozish */}
            <button
              type="button"
              onClick={handleOvozYozish}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                ovozYozilmoqda
                  ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
                  : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-matn)]"
              }`}
            >
              <Ikon nom="mikrofon" olcham={16} />
              <span>{ovozYozilmoqda ? "Tinglamoqda..." : "Ovozli kiritish"}</span>
            </button>

            {matn && (
              <button
                type="button"
                onClick={() => setMatn("")}
                className="p-2 rounded-xl text-[var(--v3-xira)] hover:text-red-400"
                title="Tozalash"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            )}
          </div>

          {/* Asosiy Yechish Tugmasi */}
          <button
            type="submit"
            disabled={yuklanmoqda || (!matn.trim() && !rasmBase64)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-xl flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Ikon nom="yulduz" olcham={18} />
            <span>{yuklanmoqda ? "AI Agentlar Yechmoqda..." : "Masalani Yechish"}</span>
          </button>
        </div>
      </form>

      {/* ─── 3. MASALA TURLARI VA TAYYOR SHABLONLAR ─── */}
      <div className="p-5 rounded-3xl border bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--v3-matn)]">
          <Ikon nom="kitob" olcham={16} className="text-[var(--v3-urgu)]" />
          <span>Tezkor Namunaviy Masalalar (Shablonlar)</span>
        </div>

        {/* Kategoriya tablari */}
        <div className="flex flex-wrap gap-2">
          {KATEGORIYALAR.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setFaolKategoriya(k.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                faolKategoriya === k.id
                  ? "bg-[var(--v3-urgu)] text-white shadow-sm"
                  : "bg-[var(--v3-fon)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]"
              }`}
            >
              {k.nom}
            </button>
          ))}
        </div>

        {/* Tanlangan kategoriya namunalar ro'yxati */}
        <div className="space-y-2 pt-1">
          {KATEGORIYALAR.find((k) => k.id === faolKategoriya)?.namunalar.map((namuna, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMatn(namuna);
                toast.success("Namuna kiritildi!");
              }}
              className="w-full p-3 rounded-2xl bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-left text-xs text-[var(--v3-matn)] leading-relaxed transition-all flex items-start gap-2.5 group"
            >
              <span className="w-5 h-5 rounded-lg bg-[var(--v3-yuza)] text-[var(--v3-urgu)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1">{namuna}</span>
              <span className="text-[10px] font-bold text-[var(--v3-urgu)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                Tanlash ➔
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
