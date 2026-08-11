"use client";

import { useState } from "react";
import { KATIONLAR, ANIONLAR, MISOLLAR, javobniTekshir } from "../lib/sifat-analiz.js";

export default function SifatAnalizPaneli({ onTopshiriqBoshla, onTopshiriqYakunla, onYop }) {
  const [tanlanganTopshiriqId, setTanlanganTopshiriqId] = useState("topshiriq-1");
  const [faolTopshiriq, setFaolTopshiriq] = useState(null);
  const [javoblar, setJavoblar] = useState({
    X: { kation: "", anion: "" },
    Y: { kation: "", anion: "" },
    Z: { kation: "", anion: "" },
  });
  const [natija, setNatija] = useState(null);

  const handleBoshlash = (topshiriqId) => {
    const t = MISOLLAR.find((m) => m.id === topshiriqId) || MISOLLAR[0];
    setFaolTopshiriq(t);
    setNatija(null);
    setJavoblar({
      X: { kation: "", anion: "" },
      Y: { kation: "", anion: "" },
      Z: { kation: "", anion: "" },
    });
    if (typeof onTopshiriqBoshla === "function") {
      onTopshiriqBoshla(t);
    }
  };

  const handleTekshirish = () => {
    if (!faolTopshiriq) return;
    const res = javobniTekshir(faolTopshiriq, javoblar);
    setNatija(res);
    if (typeof onTopshiriqYakunla === "function") {
      onTopshiriqYakunla(res);
    }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl border p-5 shadow-2xl backdrop-blur-xl md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-full md:w-96 md:rounded-l-2xl md:rounded-tr-none overflow-y-auto"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--v3-chiziq)" }}>
        <h2 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
          🎯 Sifat Analizi va DTM Praktikumi
        </h2>
        <button
          type="button"
          onClick={() => typeof onYop === "function" && onYop()}
          className="rounded-lg px-2.5 py-1 text-xs font-semibold"
          style={{ background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }}
        >
          ✕ Yopish
        </button>
      </div>

      {!faolTopshiriq ? (
        /* Topshiriq tanlash rejimi */
        <div className="flex flex-col gap-3">
          <p className="text-xs leading-relaxed" style={{ color: "var(--v3-xira)" }}>
            DTM va Kimyo Olimpiadasi darajasidagi amaliy sifat analizi topshiriqlari. Noma&apos;lum idishlardagi kation va anionlarni reagentlar yordamida aniqlang.
          </p>
          <div className="flex flex-col gap-2.5">
            {MISOLLAR.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleBoshlash(item.id)}
                className="flex flex-col rounded-xl border p-3.5 text-left transition hover:scale-[1.01]"
                style={{
                  background: "var(--v3-fon)",
                  borderColor: "var(--v3-chiziq)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "var(--v3-matn)" }}>
                    {item.nom}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                    style={{
                      background: "color-mix(in srgb, var(--v3-urgu) 20%, transparent)",
                      color: "var(--v3-urgu)",
                    }}
                  >
                    {item.qiyinlik}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs" style={{ color: "var(--v3-xira)" }}>
                  <span>3 ta noma&apos;lum tuz</span>
                  <span className="font-bold" style={{ color: "var(--v3-urgu)" }}>
                    +{item.xp} XP | +{item.tanga} 🪙
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Topshiriqni bajarish va tekshirish rejimi */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
              {faolTopshiriq.nom}
            </span>
            <button
              type="button"
              onClick={() => setFaolTopshiriq(null)}
              className="text-[11px] underline"
              style={{ color: "var(--v3-xira)" }}
            >
              ← Boshqasi
            </button>
          </div>

          <div
            className="rounded-xl border p-3 text-xs leading-relaxed"
            style={{
              background: "var(--v3-fon)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)",
            }}
          >
            💡 <strong>Vazifa:</strong> Reagentlar javonidan NaOH, HCl, AgNO₃ kabi moddalarni quying. Cho&apos;kma rangi va gazga qarab $X, Y, Z$ tuzlarini aniqlang.
          </div>

          {/* Javob kiritish shakli */}
          <div className="flex flex-col gap-3">
            {faolTopshiriq.tuzlar.map((tuz) => (
              <div
                key={tuz.idish}
                className="rounded-xl border p-3"
                style={{
                  background: "var(--v3-fon)",
                  borderColor: "var(--v3-chiziq)",
                }}
              >
                <div className="mb-2 flex items-center justify-between font-bold">
                  <span>{tuz.idish}-idish: {tuz.tavsif}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[10px]" style={{ color: "var(--v3-xira)" }}>
                      Kation:
                    </label>
                    <select
                      value={javoblar[tuz.idish]?.kation || ""}
                      onChange={(e) =>
                        setJavoblar({
                          ...javoblar,
                          [tuz.idish]: { ...javoblar[tuz.idish], kation: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border p-1.5 text-xs outline-none"
                      style={{
                        background: "var(--v3-yuza-2)",
                        borderColor: "var(--v3-chiziq)",
                        color: "var(--v3-matn)",
                      }}
                    >
                      <option value="">-- Tanlang --</option>
                      {KATIONLAR.map((k) => (
                        <option key={k.kalit} value={k.kalit}>
                          {k.kalit} ({k.nom})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px]" style={{ color: "var(--v3-xira)" }}>
                      Anion:
                    </label>
                    <select
                      value={javoblar[tuz.idish]?.anion || ""}
                      onChange={(e) =>
                        setJavoblar({
                          ...javoblar,
                          [tuz.idish]: { ...javoblar[tuz.idish], anion: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border p-1.5 text-xs outline-none"
                      style={{
                        background: "var(--v3-yuza-2)",
                        borderColor: "var(--v3-chiziq)",
                        color: "var(--v3-matn)",
                      }}
                    >
                      <option value="">-- Tanlang --</option>
                      {ANIONLAR.map((a) => (
                        <option key={a.kalit} value={a.kalit}>
                          {a.kalit} ({a.nom})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTekshirish}
            className="w-full rounded-xl py-3 text-xs font-bold transition hover:scale-[1.01]"
            style={{
              background: "var(--v3-urgu)",
              color: "var(--v3-fon)",
            }}
          >
            ✓ Javobni Tekshirish
          </button>

          {/* Natija paneli */}
          {natija && (
            <div
              className={`rounded-xl border p-4 text-xs ${
                natija.muvaffaqiyat ? "border-green-500/50 bg-green-950/40" : "border-yellow-500/50 bg-yellow-950/40"
              }`}
            >
              <div className="mb-2 font-bold text-sm">
                {natija.muvaffaqiyat ? "🎉 Muvaffaqiyatli topshirildi!" : "💡 Natija: " + natija.foiz + "%"}
              </div>
              <p className="mb-3 text-[11px]">
                Siz {natija.jamiSavollar} ta savoldan {natija.togriCount} tasini to&apos;g&apos;ri topdingiz.
                +{natija.olinganXP} XP {natija.olinganTanga > 0 ? `va +${natija.olinganTanga} 🪙` : ""}
              </p>
              <div className="flex flex-col gap-1.5">
                {Object.entries(natija.natijalar).map(([idish, r]) => (
                  <div key={idish} className="flex items-center justify-between text-[11px] border-t pt-1 border-white/10">
                    <span>{idish}-idish ({r.formula}):</span>
                    <span>
                      {r.kationTogri ? "✓ Kation" : "✕ " + r.haqiqiyKation} |{" "}
                      {r.anionTogri ? "✓ Anion" : "✕ " + r.haqiqiyAnion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
