"use client";

import { useState, useEffect, useRef } from "react";
import Ikon from "@/components/Ikon";
import toast from "react-hot-toast";

export const REJIMLAR = [
  {
    id: "tuzoq",
    nom: "Keskin Burilish (Tuzoq)",
    nishon: "⚡ 1-Rejim",
    tavsif: "O'z ustida ishlayotganlar uchun: Masaladagi ko'zdan qochishi mumkin bo'lgan kalit tuzoq va ayyorlikni ochadi (Javobsiz).",
    ikon: "chaqmoq",
  },
  {
    id: "yonalish",
    nom: "Yo'l-yo'riq & Formulalar",
    nishon: "🧭 2-Rejim",
    tavsif: "Bosqichma-bosqich yechishga yordam: Reaksiya tenglamalari va formulalarni beradi, hisoblash talaba zimmasida.",
    ikon: "kitob",
  },
  {
    id: "toliq",
    nom: "To'liq Master Yechim",
    nishon: "🎯 3-Rejim",
    tavsif: "Barcha bosqichlar, stexiometrik proporsiyalar va yakuniy matematik javob bilan mukammal tushuntirilgan yechim.",
    ikon: "orin",
  },
];

export const KATEGORIYALAR = [
  {
    id: "eritmalar",
    nom: "Eritmalar va Massaviy Ulush",
    tavsif: "Massaviy ulush (%), suv qo'shish, bug'latish, eritmalar aralashmasi (Krest qoidasi)",
    ikon: "kolba",
    namunalar: [
      "200 gramm 15% li CuSO4 eritmasiga 50 gramm suv qo'shilganda hosil bo'lgan yangi eritmaning massaviy ulushini toping.",
      "100 gramm 10% li va 300 gramm 30% li tuz eritmalar aralashtirilganda hosil bo'lgan yangi eritma massaviy ulushi necha foiz?",
      "300 gramm 20% li eritmadan 100 gramm suv bug'latilgach massaviy ulush necha foizga yetadi?",
    ],
  },
  {
    id: "kristallogidrat",
    nom: "Kristallogidratlar",
    tavsif: "CuSO₄·5H₂O, FeSO₄·7H₂O kristallari, kristallizatsiya suvi va suvsiz tuz ulushi",
    ikon: "atom",
    namunalar: [
      "50 gramm CuSO4·5H2O kristallogidrati 200 gramm suvda eritilganda hosil bo'lgan eritmadagi suvsiz tuz massaviy ulushini hisoblang.",
      "27.8 gramm FeSO4·7H2O temir kuporosi 172.2 gramm suvda eritildi. Hosil bo'lgan eritmaning foiz konsentratsiyasini toping.",
    ],
  },
  {
    id: "stexiometriya",
    nom: "Stexiometriya va Reaksiyalar",
    tavsif: "Reaksiya tenglamalari, mollar nisbati, ortib qolgan va cheklovchi reagent",
    ikon: "reaksiya",
    namunalar: [
      "10 gramm NaOH bilan 9.8 gramm H2SO4 ta'sirlashganda qancha Na2SO4 tuzi hosil bo'ladi va qaysi modda necha gramm ortib qoladi?",
      "0.5 mol HCl ni to'liq neytrallash uchun necha gramm KOH talab etiladi?",
      "5.4 gramm Al metalli mo'l miqdordagi xlorid kislotada eriganida normal sharoitda necha litr vodorod ajraladi?",
    ],
  },
  {
    id: "gazlar",
    nom: "Gazlar va Normal Sharoit",
    tavsif: "N.SH. dagi hajm (22.4L), havo va vodorodga nisbatan zichlik (D)",
    ikon: "bulut",
    namunalar: [
      "Normal sharoitda 5.6 litr CO2 gazi necha gramm massaga ega va uning havoga nisbatan zichligi nechaga teng?",
      "40 gramm kislorod (O2) va ozon (O3) gazlar aralashmasining havoga ko'ra zichligi 1.25 bo'lsa, aralashmadagi O2 hajmini toping.",
    ],
  },
  {
    id: "termokimyo",
    nom: "Termokimyo va Atom Tuzilishi",
    tavsif: "Yonish issiqligi (kJ), Avogadro soni (N_A), 1 ta yakka molekula massasi",
    ikon: "olov",
    namunalar: [
      "24 gramm uglerod yonganda 787 kJ issiqlik ajralsa, 1 mol uglerodning yonish issiqlik effektini toping.",
      "1 dona H2O molekulasining haqiqiy massasi necha gramm bo'ladi?",
    ],
  },
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.lang = "uz-UZ";
        recog.onresult = (e) => {
          const aytilganMatn = e.results[0][0].transcript;
          setMatn((prev) => (prev ? prev + " " + aytilganMatn : aytilganMatn));
          setOvozYozilmoqda(false);
        };
        recog.onerror = () => setOvozYozilmoqda(false);
        recog.onend = () => setOvozYozilmoqda(false);
        setSpeechRecog(recog);
      }
    }
  }, []);

  const tanlanganKat = KATEGORIYALAR.find((k) => k.id === faolKategoriya) || KATEGORIYALAR[0];

  const handleOvozYozish = () => {
    if (!speechRecog) {
      toast.error("Brauzeringiz ovoz bilan kiritishni qo'llab-quvvatlamaydi.");
      return;
    }
    if (ovozYozilmoqda) {
      speechRecog.stop();
      setOvozYozilmoqda(false);
    } else {
      speechRecog.start();
      setOvozYozilmoqda(true);
    }
  };

  const handleRasmTanlandi = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayllarini yuklash mumkin!");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Rasm hajmi 8 MB dan oshmasligi kerak!");
      return;
    }

    setRasmNomi(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRasmBase64(reader.result);
      toast.success("Rasm biriktirildi! AI rasm ichidagi masalani o'qiydi.");
    };
    reader.readAsDataURL(file);
  };

  const handleRasmOchir = () => {
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matn.trim() && !rasmBase64) {
      toast.error("Iltimos, masala matnini yozing yoki rasm biriktiring!");
      return;
    }
    if (typeof onYechish === "function") {
      onYechish(matn, faolRejim, rasmBase64);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* ─── 1. REJIMNI TANLASH TUGMALARI (3 TA ASOSIY REJIM) ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="v3-nishon text-[var(--v3-urgu)]">1. Tahlil va Yechim Rejimini Tanlang:</label>
          <span className="text-[11px] text-[var(--v3-xira)] font-mono">
            Tanlangan: <strong>{REJIMLAR.find((r) => r.id === faolRejim)?.nom}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {REJIMLAR.map((r) => {
            const isActive = faolRejim === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setFaolRejim(r.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? "bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-lg ring-1 ring-[var(--v3-urgu)]"
                    : "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--v3-urgu)]">
                      {r.nishon}
                    </span>
                    {isActive && (
                      <span className="v3-tag v3-tag-ochiq text-[10px] font-bold">
                        ✓ Faol
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
                    <Ikon nom={r.ikon} olcham={16} className="text-[var(--v3-urgu)]" />
                    <span>{r.nom}</span>
                  </h4>
                  <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
                    {r.tavsif}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. KIMYOVIY MAVZULAR VA KATEGORIYALAR ─── */}
      <div className="space-y-2">
        <label className="v3-nishon">2. Mavzu Bo{"'"}yicha Namunalar (1-Click Test):</label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {KATEGORIYALAR.map((kat) => {
            const tanlangan = faolKategoriya === kat.id;
            return (
              <button
                key={kat.id}
                type="button"
                onClick={() => setFaolKategoriya(kat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  tanlangan
                    ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold border-[var(--v3-urgu)] shadow-sm"
                    : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
                }`}
              >
                <Ikon nom={kat.ikon} olcham={14} />
                <span>{kat.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Tanlangan bo'lim uchun namunalar */}
        <div className="p-4 rounded-2xl border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] space-y-2.5">
          <div className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
            <Ikon nom="quiz" olcham={14} className="text-[var(--v3-urgu)]" />
            <span>{tanlanganKat.nom} — Tezkor namunaviy savollar:</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {tanlanganKat.namunalar.map((namuna, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMatn(namuna)}
                className="p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
              >
                <span className="font-mono text-[11px] text-[var(--v3-urgu)] font-bold shrink-0">
                  #{idx + 1}
                </span>
                <span className="leading-relaxed">{namuna}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. MASALA MATNINI KIRITISH SHAKLI (MATN, OVOZ VA RASM) ─── */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl border bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="fayl" olcham={15} className="text-[var(--v3-urgu)]" />
            <span>Masala shartini yozing yoki kitobdan rasmga oling:</span>
          </label>

          <span className="text-[11px] text-[var(--v3-xira)] font-mono">
            {matn.length} belgi
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={4}
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
            placeholder="Masala shartini yozing, mikrafon orqali ayting yoki pastdagi tugma orqali kitobdan rasm yuklang..."
            className="v3-kiritish w-full text-xs font-medium p-3.5 leading-relaxed pr-12 resize-none"
          />
          <button
            type="button"
            onClick={handleOvozYozish}
            title={ovozYozilmoqda ? "Ovoz yozilmoqda..." : "Ovoz bilan aytish"}
            className={`absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              ovozYozilmoqda
                ? "animate-pulse border-red-500 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/30"
                : "border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] hover:scale-105"
            }`}
          >
            <Ikon nom="ovoz" olcham={16} />
          </button>
        </div>

        {/* Biriktirilgan Rasm Preview bloki */}
        {rasmBase64 && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--v3-urgu)]/50 bg-[var(--v3-fon)] gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={rasmBase64}
                alt="Masala rasmi"
                className="w-12 h-12 object-cover rounded-lg border border-[var(--v3-chiziq)]"
              />
              <div className="min-w-0 text-xs font-mono">
                <div className="font-bold text-[var(--v3-matn)] truncate">{rasmNomi || "Masala_rasmi.jpg"}</div>
                <div className="text-[10px] text-emerald-400">✓ AI Multimodal rasm biriktirildi</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRasmOchir}
              className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-red-400 transition"
              title="Rasmni o'chirish"
            >
              <Ikon nom="ochir" olcham={14} />
            </button>
          </div>
        )}

        {/* Yashirin Fayl Inputi */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleRasmTanlandi}
          className="hidden"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="v3-tugma text-xs py-2 px-3 inline-flex items-center gap-1.5"
            >
              <Ikon nom="rasm" olcham={14} />
              <span>{rasmBase64 ? "Rasmni almashtirish" : "📷 Rasm yuklash / Rasmga olish"}</span>
            </button>

            {(matn || rasmBase64) && (
              <button
                type="button"
                onClick={() => {
                  setMatn("");
                  handleRasmOchir();
                }}
                className="v3-tugma text-xs py-2 px-3 text-[var(--v3-xira)] hover:text-red-400"
              >
                <Ikon nom="ochir" olcham={13} />
                <span>Tozalash</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={(!matn.trim() && !rasmBase64) || yuklanmoqda}
            className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2 disabled:opacity-40"
          >
            {yuklanmoqda ? (
              <>
                <Ikon nom="vaqt" olcham={15} className="animate-spin" />
                <span>AI Masalani yechmoqda...</span>
              </>
            ) : (
              <>
                <Ikon nom="chaqmoq" olcham={15} />
                <span>
                  {faolRejim === "tuzoq"
                    ? "Tuzoqlarni aniqlash"
                    : faolRejim === "yonalish"
                    ? "Yo'l-yo'riq olish"
                    : "Masalani yechish"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
