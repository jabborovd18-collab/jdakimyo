"use client";

import { useState, useMemo } from "react";
import { moddaKorinishi } from "../lib/modda-korinishi.js";
import { reagentBirligi, hajmniBirlikka, miqdorniFormatla } from "@/lib/lab-birlik.js";

// Nodirlik chegarasi. Bu ranglar ataylab v3 o'zgaruvchilaridan olinmaydi:
// ular mavzuga emas, MA'NOGA bog'liq (yashil — kam, ko'k — nodir, binafsha —
// noyob) va 2D laboratoriyada ham xuddi shunday. To'yingan 600-darajali
// ohanglar yorug' fonda ham, qorong'uda ham o'qiladi.
function nodirlikChegarasi(nodirlik) {
  switch (nodirlik) {
    case "kam":
      return "border-green-600/70 hover:border-green-500";
    case "nodir":
      return "border-blue-600/70 hover:border-blue-500";
    case "noyob":
      return "border-purple-600/70 hover:border-purple-500";
    default:
      return "";
  }
}

// Hex sonini HTML va CSS uchun '#RRGGBB' satriga aylantirish.
function hexDanCss(hexSon) {
  const son = Number(hexSon) || 0xffffff;
  return `#${son.toString(16).padStart(6, "0")}`;
}

// Modda nishonini holatiga qarab boshqacha shaklda chizish.
//
// Nega faqat rang yetmaydi: 242 moddaning ko'pchiligi — kislotalar, natriy va
// kaliy tuzlari — haqiqatan ham rangsiz. Ularga o'ylab topilgan rang berish
// noto'g'ri bo'lardi (talaba HCl ni yashil deb eslab qolardi), lekin bir xil
// oqish nuqta ham javonni o'qib bo'lmas qiladi. Shakl kimyoviy ma'lumot
// qo'shadi: to'ldirilgan doira — suyuqlik yoki eritma, kvadrat — qattiq
// modda, ichi bo'sh halqa — gaz.
function NishonShakli({ korinish, rang }) {
  if (korinish.holat === "gaz") {
    return (
      <span
        className="h-4 w-4 shrink-0 rounded-full border-2 shadow-sm"
        style={{ borderColor: rang, backgroundColor: "transparent" }}
        title="Gaz"
      />
    );
  }

  if (korinish.holat === "qattiq") {
    return (
      <span
        className="h-4 w-4 shrink-0 rounded-[3px] shadow-sm"
        style={{ backgroundColor: rang, outline: "1px solid var(--v3-chiziq-2)" }}
        title="Qattiq modda"
      />
    );
  }

  return (
    <span
      className="h-4 w-4 shrink-0 rounded-full shadow-sm"
      style={{ backgroundColor: rang, outline: "1px solid var(--v3-chiziq-2)" }}
      title="Suyuqlik yoki eritma"
    />
  );
}

// Reagentlar javoni paneli: foydalanuvchi inventaridagi 242 ta modda ichidan qidirib,
// reaksiyaga qo'shmoqchi bo'lgan moddasini tanlaydigan interfeys.
// Nega 6 ta reagent chegarasi qo'yilgan: server bir tajribada ko'pi bilan 6 xil moddani
// qabul qiladi; 7-chisini yubormaslik uchun client tomonda bloklab, sababi ochiq yoziladi.
export default function ReagentJavoni({ reagentlar = [], faol, onTanla, quyilgan = {} }) {
  const [qidiruv, setQidiruv] = useState("");

  const quyilganKalitlar = Object.keys(quyilgan || {});
  const chegaraToldimi = quyilganKalitlar.length >= 6;

  // Qidiruv bo'yicha moddalarni filtrlash: 242 ta modda orasidan tez topish imkonini beradi.
  const filtrlanganlar = useMemo(() => {
    const matn = qidiruv.toLowerCase().trim();
    if (!matn) return reagentlar;
    return reagentlar.filter((item) => {
      const kalit = String(item.kalit || "").toLowerCase();
      const nom = String(item.nom || "").toLowerCase();
      return kalit.includes(matn) || nom.includes(matn);
    });
  }, [reagentlar, qidiruv]);

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
        <h3 className="text-sm font-bold tracking-wide">Reagentlar javoni</h3>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }}
        >
          {quyilganKalitlar.length} / 6
        </span>
      </div>

      {chegaraToldimi && (
        <div
          className="mb-3 rounded-xl border p-2 text-xs"
          style={{
            borderColor: "color-mix(in srgb, var(--v3-urgu) 45%, transparent)",
            background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
            color: "var(--v3-urgu)",
          }}
        >
          Bir tajribada ko&apos;pi bilan 6 xil reagent aralashtirish mumkin (server chegarasi).
        </div>
      )}

      <div className="relative mb-3">
        <input
          type="text"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Modda formulasi yoki nomini qidirish..."
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

      <div className="flex-1 overflow-y-auto pr-1">
        {filtrlanganlar.length === 0 ? (
          <div className="v3-xira py-8 text-center text-xs">Reagentlar topilmadi.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtrlanganlar.map((item) => {
              const kalit = item.kalit;
              const soni = item.soni ?? 0;

              // Mavjudlik MIQDOR bo'yicha tekshiriladi. `soni` pastga
              // yaxlitlanadi, ya'ni 12.5 ml qolgan reagentda u 0 bo'ladi va
              // shunga qarab bloklasak, foydalanuvchi o'zining bor moddasini
              // ishlata olmay qolardi.
              const bor = item.miqdor ?? soni;

              // `quyilgan[kalit]` — obyekt (`{ml, mol}`), son emas. Ilgari u
              // to'g'ridan `> 0` bilan solishtirilardi va shart hech qachon
              // bajarilmasdi: quyilgan miqdor nishoni umuman ko'rinmagan,
              // ko'ringanda ham "[object Object] ml" bo'lardi.
              const quyilganMl = quyilgan[kalit]?.ml || 0;
              const birlik = reagentBirligi(kalit);
              const quyilganMiqdor = hajmniBirlikka(quyilganMl, birlik);
              const bloklangan = chegaraToldimi && quyilganMl <= 0;
              const tanlangan = faol === kalit;

              const korinish = moddaKorinishi(kalit);
              const cssRang = hexDanCss(korinish.rang);

              return (
                <button
                  key={kalit}
                  type="button"
                  disabled={bloklangan || bor <= 0}
                  onClick={() => typeof onTanla === "function" && onTanla(kalit)}
                  className={`group relative flex items-center justify-between rounded-xl border p-2.5 text-left transition ${nodirlikChegarasi(
                    item.nodirlik,
                  )} ${bloklangan || bor <= 0 ? "cursor-not-allowed opacity-40" : ""}`}
                  style={{
                    background: tanlangan ? "var(--v3-yuza-2)" : "var(--v3-yuza)",
                    color: "var(--v3-matn)",
                    ...(tanlangan
                      ? { borderColor: "var(--v3-urgu)", boxShadow: "0 0 0 1px var(--v3-urgu)" }
                      : item.nodirlik && item.nodirlik !== "oddiy"
                      ? {}
                      : { borderColor: "var(--v3-chiziq)" }),
                  }}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <NishonShakli korinish={korinish} rang={cssRang} />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold">{kalit}</div>
                      <div className="v3-xira text-[11px]">{item.nom || kalit}</div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span
                      className="rounded px-1.5 py-0.5 text-[11px] font-semibold"
                      style={{ background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }}
                    >
                      {item.matn || `×${soni}`}
                    </span>
                    {quyilganMl > 0 && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          background: "color-mix(in srgb, var(--v3-urgu) 18%, transparent)",
                          color: "var(--v3-urgu)",
                        }}
                      >
                        {miqdorniFormatla(quyilganMiqdor, birlik)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
