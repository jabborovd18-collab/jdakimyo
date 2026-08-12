"use client";

import { useState, useEffect } from "react";

// 4 Ta Asosiy Bo'lim va Tayyor Namunaviy Masalalar
export const KATEGORIYALAR = [
  {
    id: "eritmalar",
    nom: "💧 Eritmalar va Massaviy Ulush",
    tavsif: "Massaviy ulush (%), suyultirish, bug'latish, molaritet va aralashmalar",
    rang: "from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400",
    namunalar: [
      "200 gramm 15% li CuSO4 eritmasiga 50 gramm suv qo'shilganda hosil bo'lgan yangi eritmaning massaviy ulushini toping.",
      "100 gramm 10% li va 300 gramm 30% li tuz eritmalar aralashtirilganda hosil bo'lgan yangi eritma massaviy ulushi necha foiz?",
      "50 gramm CuSO4·5H2O kristallogidrati 200 gramm suvda eritilganda suvsiz tuz bo'yicha massaviy ulushni hisoblang.",
    ],
  },
  {
    id: "gazlar",
    nom: "💨 Gazlar va Normal Sharoit",
    tavsif: "N.SH. dagi hajm (22.4L), havo va vodorodga nisbatan zichlik",
    rang: "from-sky-500/20 to-indigo-500/10 border-sky-500/40 text-sky-400",
    namunalar: [
      "Normal sharoitda 5.6 litr CO2 gazi necha gramm massaga ega va uning havoga nisbatan zichligi nechaga teng?",
      "40 gramm kislorod (O2) va ozon (O3) gazlar aralashmasining hajmiy nisbatini toping.",
    ],
  },
  {
    id: "stexiometriya",
    nom: "⚖️ Stexiometriya va Reaksiyalar",
    tavsif: "Reaksiya tenglamalari, mollar nisbati va cheklovchi reagent",
    rang: "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400",
    namunalar: [
      "10 gramm NaOH bilan 9.8 gramm H2SO4 ta'sirlashganda qancha Na2SO4 tuzi hosil bo'ladi va qaysi modda ortib qoladi?",
      "0.5 mol HCl ni to'liq neytrallash uchun necha gramm KOH talab etiladi?",
    ],
  },
  {
    id: "atom",
    nom: "⚛️ Atom Tuzilishi va Termokimyo",
    tavsif: "Molyar massa, Avogadro soni, 1 molekula massasi va issiqlik (kJ)",
    rang: "from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400",
    namunalar: [
      "1 ta H2O molekulasining haqiqiy massasi necha gramm bo'ladi?",
      "24 gramm uglerod yonganda 787 kJ issiqlik ajralsa, 1 mol uglerodning yonish issiqlik effektini toping.",
    ],
  },
];

export default function MasalaKiritish({ onYechish, yuklanmoqda }) {
  const [faolKategoriya, setFaolKategoriya] = useState("eritmalar");
  const [matn, setMatn] = useState("");
  const [ovozYozilmoqda, setOvozYozilmoqda] = useState(false);
  const [speechRecog, setSpeechRecog] = useState(null);

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
      alert("Brauzeringiz ovoz bilan yozishni qo'llab-quvvatlamaydi.");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matn.trim()) return;
    if (typeof onYechish === "function") {
      onYechish(matn);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Ta Asosiy Bo'lim Kartochkalari (Main Menu Style Category Cards) */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider v3-xira">
          1. Kerakli Bo&apos;limni Tanlang:
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KATEGORIYALAR.map((kat) => {
            const tanlangan = faolKategoriya === kat.id;
            return (
              <button
                key={kat.id}
                type="button"
                onClick={() => setFaolKategoriya(kat.id)}
                className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${
                  tanlangan
                    ? `bg-gradient-to-br ${kat.rang} shadow-xl ring-1 ring-amber-400/50`
                    : "border-white/10 bg-black/40 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="text-sm font-black tracking-wide">{kat.nom}</div>
                  <div className="mt-1 text-[11px] font-medium v3-xira line-clamp-2">
                    {kat.tavsif}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2 border-white/10">
                  <span className="text-[10px] font-bold text-amber-400">
                    {tanlangan ? "✓ Tanlandi" : "Tanlash →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tanlangan Bo'lim uchun Namunaviy Masalalar (Sample Questions) */}
      <div className="rounded-2xl border p-4 bg-black/30 border-white/10">
        <h4 className="mb-2.5 text-xs font-bold text-amber-400">
          💡 {tanlanganKat.nom} bo&apos;yicha namunaviy masalalar (1-Click Test):
        </h4>
        <div className="flex flex-col gap-2">
          {tanlanganKat.namunalar.map((namuna, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMatn(namuna)}
              className="rounded-xl border p-3 text-left text-xs font-medium transition hover:border-amber-400/60 hover:bg-amber-400/5"
              style={{
                background: "var(--v3-fon)",
                borderColor: "var(--v3-chiziq)",
              }}
            >
              <span className="text-amber-400 font-bold mr-1 border-r pr-1.5 border-white/10">
                #{idx + 1}
              </span>
              <span>{namuna}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Masala Matnini Kiritish Paneli */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border p-5 bg-black/40 border-white/10">
        <label className="text-xs font-bold v3-matn">
          📝 Masala sharti yoki savolingizni kiriting:
        </label>

        <div className="relative">
          <textarea
            rows={4}
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
            placeholder="Masala shartini yozing yoki mikrafon tugmasini bosib o'zbekcha ayting..."
            className="w-full rounded-xl border p-4 text-xs font-medium outline-none transition"
            style={{
              background: "var(--v3-fon)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)",
            }}
          />
          <button
            type="button"
            onClick={handleOvozYozish}
            title="Ovoz bilan aytish"
            className={`absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full border transition ${
              ovozYozilmoqda
                ? "animate-pulse border-red-500 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/30"
                : "border-amber-400/50 bg-amber-400/10 text-amber-400 hover:scale-110"
            }`}
          >
            🎙️
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMatn("")}
            disabled={!matn}
            className="v3-tugma text-xs"
          >
            🗑️ Tozalash
          </button>
          <button
            type="submit"
            disabled={!matn.trim() || yuklanmoqda}
            className="v3-tugma-asosiy text-xs font-bold px-5 py-2.5"
          >
            <span>⚡</span>
            <span>{yuklanmoqda ? "AI Yechmoqda..." : "Masalani Yechish va Ovozli Tushuntirish"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
