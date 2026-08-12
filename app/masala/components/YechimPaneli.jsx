"use client";

import { useState, useEffect, useRef } from "react";

export default function YechimPaneli({ natija }) {
  const [ijroEtilmoqda, setIjroEtilmoqda] = useState(false);
  const [tezlik, setTezlik] = useState(1);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Utterance tayyorlash
    if (typeof window !== "undefined" && natija?.ovozMatni) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Avvalgi ijrolarni to'xtatish
        const ut = new SpeechSynthesisUtterance(natija.ovozMatni);
        ut.lang = "uz-UZ";
        ut.rate = tezlik;
        ut.onend = () => setIjroEtilmoqda(false);
        ut.onerror = () => setIjroEtilmoqda(false);
        utteranceRef.current = ut;
      }
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [natija, tezlik]);

  if (!natija) return null;

  const handleOvozIjro = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Brauzeringiz ovozli o'qishni qo'llab-quvvatlamaydi.");
      return;
    }

    if (ijroEtilmoqda) {
      window.speechSynthesis.pause();
      setIjroEtilmoqda(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        if (utteranceRef.current) {
          utteranceRef.current.rate = tezlik;
          window.speechSynthesis.speak(utteranceRef.current);
        }
      }
      setIjroEtilmoqda(true);
    }
  };

  const handleTezlikOzgardi = (yangiTezlik) => {
    setTezlik(yangiTezlik);
    if (ijroEtilmoqda) {
      window.speechSynthesis.cancel();
      if (utteranceRef.current) {
        utteranceRef.current.rate = yangiTezlik;
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition-all"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      {/* Header & Audio Player Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: "var(--v3-chiziq)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <div>
            <h3 className="text-sm font-bold tracking-wide">AI Ovozli Yechim Tahlili</h3>
            <div className="v3-xira text-[11px]">Server Stexiometrik Dvigateli tomonidan hisoblandi</div>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center gap-2 rounded-xl border p-1.5" style={{ background: "var(--v3-fon)", borderColor: "var(--v3-chiziq)" }}>
          <button
            type="button"
            onClick={handleOvozIjro}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              ijroEtilmoqda ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20" : "bg-amber-400/10 text-amber-400"
            }`}
          >
            <span>{ijroEtilmoqda ? "⏸️ Pausa" : "🔊 Ovozli Tushuntirish"}</span>
          </button>

          {/* Tezlik Tugmalari */}
          <div className="flex gap-1 border-l pl-2 border-white/10">
            {[1, 1.25, 1.5].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTezlikOzgardi(t)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
                  tezlik === t ? "bg-amber-400 text-black" : "v3-xira hover:text-white"
                }`}
              >
                {t}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Yakuniy Javob Highlight Card */}
      <div
        className="rounded-xl border p-4 text-xs font-bold shadow-lg"
        style={{
          borderColor: "color-mix(in srgb, var(--v3-urgu) 60%, transparent)",
          background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
          color: "var(--v3-matn)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-amber-400">🏁 YAKUNIY JAVOB:</span>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
            ✓ Matematik Tasdiqlangan
          </span>
        </div>
        <div className="text-sm font-black tracking-wide text-emerald-400">{natija.yakuniyJavob}</div>
      </div>

      {/* Reaksiya Tenglamasi */}
      <div className="rounded-xl border p-3 text-center bg-black/30 border-white/10">
        <div className="v3-xira text-[10px] font-bold mb-1">REAKSIYA TENGLAMASI:</div>
        <div className="text-sm font-black text-amber-400 tracking-wider font-mono">{natija.tenglama}</div>
      </div>

      {/* Bosqichma-bosqich Yechim Kartochkalari */}
      <div className="flex flex-col gap-2.5">
        {natija.bosqichlar?.map((b, idx) => (
          <div
            key={idx}
            className="rounded-xl border p-3.5 text-xs transition hover:border-amber-400/50"
            style={{
              background: "var(--v3-fon)",
              borderColor: "var(--v3-chiziq)",
            }}
          >
            <div className="font-bold text-amber-400 mb-1">{b.sarlavha}</div>
            <div className="v3-matn whitespace-pre-line leading-relaxed font-medium">{b.matn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
