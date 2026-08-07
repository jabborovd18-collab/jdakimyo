"use client";

import { useMemo } from "react";

// Guruh nomlarini o'zbek tilida chiroyli sarlavha qilish uchun lug'at.
// Nega: API dan keluvchi "shisha", "tayanch" kabi kalit so'zlarni interfeysda
// talaba uchun tushunarli va seliqali bo'limlarga ajratamiz.
const GURUH_NOMLARI = {
  shisha: "Shisha idishlar",
  tayanch: "Tayanch va shtativlar",
  isitish: "Isitish jihozlari",
  ajratish: "Ajratish va haydash",
  olchov: "O'lchov asboblari",
  chinni: "Chinni va tigellar",
  gaz: "Gaz apparatlari",
  himoya: "Himoya vositalari",
  sanoat: "Sanoat qurilmalari",
  boshqa: "Boshqa jihozlar",
};

// Jihozlar javoni paneli: inventardagi asboblarni guruhlab ko'rsatadi va
// bosilganda stoldagi 6 ta slotdan biriga joylaydi yoki qaytarib oladi.
// Nega bosilganda qo'yib, yana bosilganda olinadi: 3D sahnada idishni qo'lda
// sudrab o'tirmasdan, bir tugma bilan boshqarish telefonda eng qulay uslub.
export default function JihozJavoni({ jihozlar = [], stolda = [], onQosh, onOlib }) {
  const stoldagiSon = stolda.length;
  const slotlarToldimi = stoldagiSon >= 6;

  // Jihozlarni guruhlari bo'yicha yig'ish (shisha, tayanch, isitish...)
  const guruhlanganlar = useMemo(() => {
    const guruhlar = {};
    jihozlar.forEach((item) => {
      const g = item.guruh || "boshqa";
      if (!guruhlar[g]) guruhlar[g] = [];
      guruhlar[g].push(item);
    });
    return guruhlar;
  }, [jihozlar]);

  // Jihoz stolda bormi aniqlash
  const stoldaBormi = (kalit) => {
    return stolda.some((j) => j?.userData?.kalit === kalit);
  };

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
    <div className="flex h-full flex-col rounded-2xl border border-purple-800/50 bg-slate-900/80 p-4 text-white shadow-xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-purple-300">
          Jihozlar Javoni
        </h3>
        <span className="rounded-full bg-purple-950/80 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
          Stolda: {stoldagiSon} / 6
        </span>
      </div>

      {slotlarToldimi && (
        <div className="mb-3 rounded-xl border border-amber-500/50 bg-amber-950/50 p-2 text-xs text-amber-300">
          Stoldagi barcha 6 ta joy band. Yangi jihoz qo&apos;yish uchun avvalgisini olib tashlang.
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1">
        {Object.keys(guruhlanganlar).length === 0 ? (
          <div className="py-8 text-center text-xs text-purple-400/70">
            Jihozlar topilmadi.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(guruhlanganlar).map(([guruhKaliti, roxat]) => (
              <div key={guruhKaliti}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  {GURUH_NOMLARI[guruhKaliti] || "Jihozlar"}
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
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
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                          bormi
                            ? "border-green-500 bg-green-950/40 shadow-md shadow-green-950/50"
                            : "border-purple-800/50 bg-slate-800/50 hover:bg-slate-800/90"
                        } ${bloklangan ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-base">{item.icon || "🧪"}</span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-white">
                              {item.nom || kalit}
                            </div>
                            <div className="text-[11px] text-purple-400">
                              {bormi ? "Stolda turibdi" : "Qo'yish"}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            bormi
                              ? "bg-green-500/20 text-green-300"
                              : "bg-purple-950/80 text-purple-300"
                          }`}
                        >
                          {bormi ? "✓ Stolda" : "+ Qo'yish"}
                        </span>
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