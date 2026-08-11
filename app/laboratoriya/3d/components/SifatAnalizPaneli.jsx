"use client";

import { useState, useEffect, useCallback } from "react";
// KATIONLAR va ANIONLAR — faqat tanlash ro'yxati uchun, ular javob emas.
// Topshiriqlarning O'ZI serverdan keladi va javoblari olib tashlangan
// bo'ladi: MISOLLAR client bo'lagiga tushsa, o'quvchi kation va anionni
// manbadan o'qib olardi.
import { KATIONLAR, ANIONLAR } from "@/lib/lab-sifat-analiz.js";

const BOSH_JAVOB = {
  X: { kation: "", anion: "" },
  Y: { kation: "", anion: "" },
  Z: { kation: "", anion: "" },
};

export default function SifatAnalizPaneli({ onTopshiriqBoshla, onTopshiriqYakunla, onYop }) {
  const [topshiriqlar, setTopshiriqlar] = useState([]);
  const [faolTopshiriq, setFaolTopshiriq] = useState(null);
  const [javoblar, setJavoblar] = useState(BOSH_JAVOB);
  const [natija, setNatija] = useState(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [xato, setXato] = useState(null);

  const royxatniYukla = useCallback(async () => {
    try {
      const res = await fetch("/api/laboratoriya/sifat-analiz");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Topshiriqlar yuklanmadi");
      setTopshiriqlar(data.topshiriqlar || []);
    } catch (e) {
      setXato(e.message);
    }
  }, []);

  useEffect(() => {
    royxatniYukla();
  }, [royxatniYukla]);

  const handleBoshlash = (topshiriqId) => {
    const t = topshiriqlar.find((m) => m.id === topshiriqId) || topshiriqlar[0];
    if (!t) return;
    setFaolTopshiriq(t);
    setNatija(null);
    setXato(null);
    setJavoblar(BOSH_JAVOB);
    if (typeof onTopshiriqBoshla === "function") {
      onTopshiriqBoshla(t);
    }
  };

  // Javobni SERVER tekshiradi va mukofotni o'zi beradi. Ilgari ball
  // client'da hisoblanib ekranga "+200 XP va +60 🪙" deb yozilardi,
  // lekin hech qayerga yuborilmasdi — mukofot va'da qilinib berilmasdi.
  const handleTekshirish = async () => {
    if (!faolTopshiriq || yuborilmoqda) return;
    setYuborilmoqda(true);
    setXato(null);
    try {
      const res = await fetch("/api/laboratoriya/sifat-analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topshiriqId: faolTopshiriq.id, javoblar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Javob yuborilmadi");
      setNatija(data);
      royxatniYukla();
      if (typeof onTopshiriqYakunla === "function") {
        onTopshiriqYakunla(data);
      }
    } catch (e) {
      setXato(e.message);
    } finally {
      setYuborilmoqda(false);
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
            {topshiriqlar.map((item) => (
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
            disabled={yuborilmoqda}
            onClick={handleTekshirish}
            className="w-full rounded-xl py-3 text-xs font-bold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: "var(--v3-urgu)",
              color: "var(--v3-urgu-matn)",
            }}
          >
            {yuborilmoqda ? "Tekshirilmoqda..." : "✓ Javobni tekshirish"}
          </button>

          {xato && (
            <div
              className="rounded-xl border p-2.5 text-xs"
              style={{
                borderColor: "color-mix(in srgb, var(--v3-urgu) 45%, transparent)",
                background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
                color: "var(--v3-urgu)",
              }}
            >
              {xato}
            </div>
          )}

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
                {" "}
                {/* Mukofot serverdan keladi va haqiqatan berilgan bo'ladi.
                    Takrorlaganda tanga berilmaydi — bitta oson topshiriqni
                    qayta-qayta yechish foydali strategiya bo'lib qolmasin. */}
                <strong>+{natija.olinganXP} XP</strong>
                {natija.olinganTanga > 0 ? ` va +${natija.olinganTanga} 🪙` : ""}
                {natija.birinchi === false && (
                  <span className="block mt-1 opacity-80">
                    Bu topshiriq avval yechilgan — takror uchun tanga berilmaydi.
                  </span>
                )}
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
