"use client";

import { useState, useMemo } from "react";

const GURUH_NOMLARI = {
  shisha: "🧪 Shisha idishlar",
  tayanch: "📐 Tayanch & Shtativlar",
  isitish: "🔥 Isitish jihozlari",
  ajratish: "⚗️ Ajratish apparatlari",
  olchov: "⚖️ O'lchov asboblari",
  boshqa: "🛠️ Boshqa jihozlar",
};

const STANDART_JIHOZLAR = [
  { kalit: "probirka", nom: "Probirka (25ml)", guruh: "shisha", icon: "🧪" },
  { kalit: "stakan", nom: "Kimyoviy stakan (100ml)", guruh: "shisha", icon: "🥛" },
  { kalit: "olchov-kolba", nom: "O'lchov kolbasi (100ml)", guruh: "olchov", icon: "🧴" },
  { kalit: "olchov-silindr", nom: "O'lchov silindri (50ml)", guruh: "olchov", icon: "📏" },
  { kalit: "soat-shishasi", nom: "Soat shishasi (Tarozi uchun)", guruh: "olchov", icon: "🍽️" },
  { kalit: "shisha-tayoqcha", nom: "Shisha tayoqcha (Aralashtirgich)", guruh: "boshqa", icon: "🥢" },
  { kalit: "spatula", nom: "Spatula (Qoshiqcha)", guruh: "boshqa", icon: "🥄" },
  { kalit: "konussimon-kolba", nom: "Erlenmeyyer kolba (120ml)", guruh: "shisha", icon: "🧪" },
  { kalit: "dumaloq-tubli-kolba", nom: "Dumaloq tubli kolba (150ml)", guruh: "shisha", icon: "⚗️" },
  { kalit: "kolba", nom: "Tekis tubli kolba (120ml)", guruh: "shisha", icon: "🧴" },
  { kalit: "kristallizator", nom: "Kristallizator kosasi (80ml)", guruh: "shisha", icon: "🧊" },
  { kalit: "voronka", nom: "Shisha voronka", guruh: "ajratish", icon: "🌪️" },
  { kalit: "byuretka", nom: "Titrlash Byuretkasi (50ml)", guruh: "olchov", icon: "🌡️" },
  { kalit: "spirtovka", nom: "Spirtovka (Alanga)", guruh: "isitish", icon: "🔥" },
  { kalit: "probirka-shtativi", nom: "Probirka shtativi (6 ta)", guruh: "tayanch", icon: "📐" },
  { kalit: "shtativ", nom: "Universal shtativ", guruh: "tayanch", icon: "🏗️" },
  { kalit: "termometr", nom: "Shisha termometr (0-100°C)", guruh: "olchov", icon: "🌡️" },
];

export default function JihozJavoni({ jihozlar = [], stolda = [], onQosh, onOlib }) {
  const [qidiruv, setQidiruv] = useState("");
  const stoldagiSon = stolda.length;
  const slotlarToldimi = stoldagiSon >= 12; // Kengaytirilgan stol sig'imi

  // Standart to'liq asboblar ro'yxatini birlashtirish
  const birlashganJihozlar = useMemo(() => {
    const mavjudKalitlar = new Set(jihozlar.map((j) => j.kalit));
    const qoshimchalar = STANDART_JIHOZLAR.filter((s) => !mavjudKalitlar.has(s.kalit));
    return [...jihozlar, ...qoshimchalar];
  }, [jihozlar]);

  // Jihoz stolda bormi aniqlash
  const stoldaBormi = (kalit) => {
    return stolda.some((j) => j?.userData?.kalit === kalit);
  };

  // Filtrlash va qidiruv
  const filtrlanganlar = useMemo(() => {
    const matn = qidiruv.toLowerCase().trim();
    if (!matn) return birlashganJihozlar;
    return birlashganJihozlar.filter((item) => {
      const kalit = String(item.kalit || "").toLowerCase();
      const nom = String(item.nom || "").toLowerCase();
      return kalit.includes(matn) || nom.includes(matn);
    });
  }, [birlashganJihozlar, qidiruv]);

  // Guruhlarga ajratish
  const guruhlanganlar = useMemo(() => {
    const guruhlar = {};
    filtrlanganlar.forEach((item) => {
      const g = item.guruh || "boshqa";
      if (!guruhlar[g]) guruhlar[g] = [];
      guruhlar[g].push(item);
    });
    return guruhlar;
  }, [filtrlanganlar]);

  const handleJihozBosildi = (kalit) => {
    if (stoldaBormi(kalit)) {
      if (typeof onOlib === "function") onOlib(kalit);
    } else {
      if (!slotlarToldimi && typeof onQosh === "function") {
        onQosh(kalit);
      }
    }
  };

  return (
    <div
      className="flex h-full flex-col rounded-2xl border p-4 shadow-2xl backdrop-blur-xl"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b pb-2.5" style={{ borderColor: "var(--v3-chiziq)" }}>
        <div className="flex items-center gap-2">
          <span className="text-base">📐</span>
          <h3 className="text-sm font-bold tracking-wide" style={{ color: "var(--v3-matn)" }}>
            Jihozlar Javoni
          </h3>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            background: slotlarToldimi
              ? "color-mix(in srgb, var(--v3-urgu) 25%, transparent)"
              : "var(--v3-yuza-2)",
            color: slotlarToldimi ? "var(--v3-urgu)" : "var(--v3-xira)",
          }}
        >
          Stolda: {stoldagiSon} / 6
        </span>
      </div>

      {slotlarToldimi && (
        <div
          className="mb-3 rounded-xl border p-2 text-xs"
          style={{
            borderColor: "color-mix(in srgb, var(--v3-urgu) 45%, transparent)",
            background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
            color: "var(--v3-urgu)",
          }}
        >
          Stoldagi barcha 6 ta joy band. Yangisini qo&apos;yish uchun avvalgisini olib tashlang.
        </div>
      )}

      {/* Qidiruv Inputi */}
      <div className="relative mb-3">
        <input
          type="text"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Jihoz nomini qidirish..."
          className="w-full rounded-xl border px-3.5 py-2 text-xs outline-none transition"
          style={{
            background: "var(--v3-fon)",
            borderColor: "var(--v3-chiziq)",
            color: "var(--v3-matn)",
          }}
        />
        {qidiruv && (
          <button
            type="button"
            onClick={() => setQidiruv("")}
            className="v3-xira absolute right-3 top-2 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Jihozlar Ro'yxati */}
      <div className="flex-1 overflow-y-auto pr-1">
        {Object.keys(guruhlanganlar).length === 0 ? (
          <div className="v3-xira py-8 text-center text-xs">Jihozlar topilmadi.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(guruhlanganlar).map(([guruhKaliti, roxat]) => (
              <div key={guruhKaliti}>
                <h4 className="v3-nishon mb-2">{GURUH_NOMLARI[guruhKaliti] || "Jihozlar"}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {roxat.map((item) => {
                    const kalit = item.kalit;
                    const bormi = stoldaBormi(kalit);
                    const bloklangan = !bormi && slotlarToldimi;

                    return (
                      <button
                        key={kalit}
                        type="button"
                        disabled={bloklangan}
                        onClick={() => handleJihozBosildi(kalit)}
                        className={`group relative flex flex-col justify-between rounded-xl border p-2.5 text-left transition hover:scale-[1.02] ${
                          bloklangan ? "cursor-not-allowed opacity-40" : ""
                        }`}
                        style={{
                          background: bormi
                            ? "color-mix(in srgb, var(--v3-urgu) 18%, var(--v3-yuza))"
                            : "var(--v3-fon)",
                          borderColor: bormi ? "var(--v3-urgu)" : "var(--v3-chiziq)",
                          boxShadow: bormi ? "0 0 12px rgba(245, 158, 11, 0.25)" : "none",
                          color: "var(--v3-matn)",
                        }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40 text-lg border border-white/10">
                            {item.icon || "🧪"}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-black">{item.nom || kalit}</div>
                            <div className="v3-xira text-[10px]">{bormi ? "Stolda turibdi" : "Stolga qo'yish"}</div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t pt-1.5 border-white/10">
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                            style={
                              bormi
                                ? { background: "var(--v3-urgu)", color: "var(--v3-fon)" }
                                : { background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }
                            }
                          >
                            {bormi ? "✓ Stolda" : "+ Qo'yish"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
