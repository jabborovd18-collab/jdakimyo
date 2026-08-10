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
    <div
      className="flex h-full flex-col rounded-2xl border p-4 shadow-xl backdrop-blur-md"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)",
        color: "var(--v3-matn)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide">Jihozlar javoni</h3>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }}
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
          Stoldagi barcha 6 ta joy band. Yangi jihoz qo&apos;yish uchun avvalgisini olib tashlang.
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1">
        {Object.keys(guruhlanganlar).length === 0 ? (
          <div className="v3-xira py-8 text-center text-xs">Jihozlar topilmadi.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(guruhlanganlar).map(([guruhKaliti, roxat]) => (
              <div key={guruhKaliti}>
                <h4 className="v3-nishon mb-2">{GURUH_NOMLARI[guruhKaliti] || "Jihozlar"}</h4>
                {/* Bitta ustun: 320px panelda ikki ustun bo'lganda kartaga ~140px
                    tegib, ikonka va "+ Qo'yish" nishonidan keyin nomga ~40px
                    qolardi va hamma jihoz "P...", "F..." bo'lib ko'rinardi. */}
                <div className="flex flex-col gap-2">
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
                          bloklangan ? "cursor-not-allowed opacity-40" : ""
                        }`}
                        style={{
                          background: bormi ? "var(--v3-yuza-2)" : "var(--v3-yuza)",
                          borderColor: bormi ? "var(--v3-urgu-2)" : "var(--v3-chiziq)",
                          color: "var(--v3-matn)",
                        }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-base">{item.icon || "🧪"}</span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold">{item.nom || kalit}</div>
                            <div className="v3-xira text-[11px]">
                              {bormi ? "Stolda turibdi" : "Qo'yish"}
                            </div>
                          </div>
                        </div>

                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                          style={
                            bormi
                              ? {
                                  background:
                                    "color-mix(in srgb, var(--v3-urgu-2) 20%, transparent)",
                                  color: "var(--v3-urgu-2)",
                                }
                              : { background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }
                          }
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
