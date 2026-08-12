"use client";

import { useState, useEffect } from "react";

const NAMUNAVIY_MASALALAR = [
  {
    sarlavha: " Stexiometriya va Ortiqcha Miqdor",
    matn: "10 gramm NaOH bilan 9.8 gramm H2SO4 ta'sirlashganda qancha Na2SO4 tuzi hosil bo'ladi va qaysi modda ortib qoladi?",
  },
  {
    sarlavha: "💧 Eritma Konsentratsiyasi",
    matn: "200 gramm 15% li CuSO4 eritmasiga 50 gramm suv qo'shilganda hosil bo'lgan yangi eritmaning foiz konsentratsiyasini toping.",
  },
  {
    sarlavha: "💨 Gazlar Hajmi va Normal Sharoit",
    matn: "Normal sharoitda 5.6 litr CO2 gazi hosil bo'lishi uchun qancha gramm CaCO3 parchalanishi kerak?",
  },
  {
    sarlavha: "⚡ Neytrallanish Reaksiyasi",
    matn: "0.5 mol HCl ni to'liq neytrallash uchun necha gramm KOH talab etiladi?",
  },
];

export default function MasalaKiritish({ onYechish, yuklanmoqda }) {
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
        recog.lang = "uz-UZ"; // O'zbek tili sozlamasi
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
    <div
      className="flex flex-col rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition-all"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--v3-chiziq)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🧪</span>
          <h2 className="text-base font-bold tracking-wide">Masala Matnini Kiritish</h2>
        </div>
        <span className="text-xs font-semibold v3-xira">AI Ovozli Yechuvchi</span>
      </div>

      {/* Namunaviy Masalalar (Quick Preset Buttons) */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-bold v3-xira">
          ⚡ Tayyor Namunaviy Masalalar (1-Click Test):
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {NAMUNAVIY_MASALALAR.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMatn(item.matn)}
              className="rounded-xl border p-2.5 text-left text-xs font-semibold transition hover:scale-[1.01]"
              style={{
                background: "var(--v3-fon)",
                borderColor: "var(--v3-chiziq)",
              }}
            >
              <div className="font-bold text-amber-400">{item.sarlavha}</div>
              <div className="v3-xira truncate text-[11px] mt-0.5">{item.matn}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form & Textarea */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            rows={4}
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
            placeholder="Masala shartini shu yerga yozing yoki mikrafon tugmasini bosib ovoz bilan ayting..."
            className="w-full rounded-xl border p-3.5 text-xs outline-none transition"
            style={{
              background: "var(--v3-fon)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)",
            }}
          />
          {/* Microphone Recording Button */}
          <button
            type="button"
            onClick={handleOvozYozish}
            title="Ovoz bilan aytish"
            className={`absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border transition ${
              ovozYozilmoqda ? "animate-pulse border-red-500 bg-red-500/20 text-red-400" : "border-amber-400/50 bg-amber-400/10 text-amber-400"
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
            className="v3-tugma-asosiy text-xs font-bold"
          >
            <span>⚡</span>
            <span>{yuklanmoqda ? "AI Yechmoqda..." : "Masalani Yechish va Ovozli Tushuntirish"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
