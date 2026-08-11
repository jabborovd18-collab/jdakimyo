"use client";

// Sandiq ochish modali — HAQIQIY server sandig'i bilan.
//
// NEGA QAYTA YOZILDI. Ilgari bu modal butunlay o'ziniki edi: o'z sandiq
// ro'yxati, o'z narxlari va `Math.random()` bilan tanlangan "mukofot".
// Serverga birorta so'rov yubormasdi, ya'ni:
//   • tanga yechilmasdi
//   • buyum inventarga tushmasdi
//   • ekranda "Inventarga muvaffaqiyatli qo'shildi!" deb yozilardi
// Ro'yxatda hatto katalogda yo'q moddalar bor edi (PtCl₂, AuCl₃).
//
// Holbuki haqiqiy sandiq tizimi allaqachon bor: `lib/sandiq.js` va
// `/api/laboratoriya/sandiq`. Nima tushishini server hal qiladi —
// aks holda javobni brauzerda o'zgartirib istalgan buyumni "chiqarib
// olish" mumkin bo'lardi.

import { useState, useEffect, useCallback } from "react";
import { shishaUrilishi, chokmaTushishi } from "../lib/ovoz.js";

/** Ochilish animatsiyasi shuncha davom etadi (ms) */
const ANIMATSIYA_MS = 1500;

export default function SandiqOchishModal({ onYop, onOchildi }) {
  const [sandiqlar, setSandiqlar] = useState([]);
  const [faol, setFaol] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [ochilmoqda, setOchilmoqda] = useState(false);
  const [tushgan, setTushgan] = useState(null);
  const [xato, setXato] = useState(null);

  const royxatniYukla = useCallback(async () => {
    setYuklanmoqda(true);
    setXato(null);
    try {
      const res = await fetch("/api/laboratoriya/sandiq");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sandiqlar yuklanmadi");
      setSandiqlar(data.sandiqlar || []);
      setFaol((oldingi) => oldingi || data.sandiqlar?.[0] || null);
    } catch (e) {
      setXato(e.message);
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  useEffect(() => {
    royxatniYukla();
  }, [royxatniYukla]);

  const handleOchish = async () => {
    if (!faol || ochilmoqda) return;

    setOchilmoqda(true);
    setTushgan(null);
    setXato(null);
    shishaUrilishi(1800);

    // So'rov DARROV yuboriladi, animatsiya esa parallel o'ynaydi —
    // ketma-ket qilinsa foydalanuvchi ikki karra kutardi.
    const sorov = fetch("/api/laboratoriya/sandiq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kalit: faol.kalit }),
    });

    const kutish = new Promise((r) => setTimeout(r, ANIMATSIYA_MS));

    try {
      const [res] = await Promise.all([sorov, kutish]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sandiq ochilmadi");

      chokmaTushishi();
      setTushgan(data.tushgan || []);

      // Balans va inventar o'zgardi — tashqaridagi sahifa yangilansin.
      if (typeof onOchildi === "function") onOchildi(data);
      royxatniYukla();
    } catch (e) {
      setXato(e.message);
    } finally {
      setOchilmoqda(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border p-5 shadow-2xl"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)",
          color: "var(--v3-matn)",
        }}
      >
        {/* Sarlavha */}
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: "var(--v3-chiziq)" }}
        >
          <h3 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
            🎁 Reagentlar sandig&apos;i
          </h3>
          <button
            type="button"
            onClick={onYop}
            className="rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{ background: "var(--v3-yuza-2)" }}
          >
            ✕
          </button>
        </div>

        {/* Sandiqlar ro'yxati */}
        {yuklanmoqda ? (
          <div className="my-6 text-center text-xs" style={{ color: "var(--v3-xira)" }}>
            Yuklanmoqda...
          </div>
        ) : (
          <div className="my-4 flex gap-2 overflow-x-auto pb-2">
            {sandiqlar.map((s) => {
              const tanlangan = faol?.kalit === s.kalit;
              return (
                <button
                  key={s.kalit}
                  type="button"
                  onClick={() => {
                    setFaol(s);
                    setTushgan(null);
                    setXato(null);
                  }}
                  className={`flex flex-1 shrink-0 flex-col items-center rounded-xl border p-3 text-center transition ${
                    tanlangan ? "" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    background: "var(--v3-fon)",
                    borderColor: tanlangan ? "var(--v3-urgu)" : "var(--v3-chiziq)",
                  }}
                >
                  <span className="text-2xl">{s.icon || "📦"}</span>
                  <span className="mt-1 text-xs font-bold">{s.nom}</span>
                  <span
                    className="mt-1 text-[10px] font-bold"
                    style={{ color: "var(--v3-urgu)" }}
                  >
                    {s.kunlik
                      ? s.ochilgan
                        ? "Bugun olingan"
                        : "Bepul (kunlik)"
                      : [
                          s.narx?.coins ? `${s.narx.coins} 🪙` : null,
                          s.narx?.gems ? `${s.narx.gems} 💎` : null,
                        ]
                          .filter(Boolean)
                          .join(" + ")}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Ochilish maydoni */}
        <div
          className="my-3 flex min-h-40 flex-col items-center justify-center rounded-2xl border p-4 text-center"
          style={{ background: "var(--v3-fon)", borderColor: "var(--v3-chiziq)" }}
        >
          {ochilmoqda ? (
            <div className="flex animate-bounce flex-col items-center">
              <span className="text-5xl">{faol?.icon || "📦"}</span>
              <span className="mt-3 text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
                Sandiq ochilmoqda...
              </span>
            </div>
          ) : tushgan ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold" style={{ color: "var(--v3-urgu-2)" }}>
                🎉 Sandiqdan chiqdi
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {tushgan.map((t, i) => (
                  <span
                    key={i}
                    className="rounded-lg px-2 py-1 text-xs font-bold"
                    style={{ background: "var(--v3-yuza-2)" }}
                  >
                    {t.icon || "⚗️"} {t.nom || t.kalit} ×{t.soni}
                  </span>
                ))}
              </div>
              <span className="text-[11px]" style={{ color: "var(--v3-xira)" }}>
                Inventaringizga qo&apos;shildi.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-4xl">{faol?.icon || "📦"}</span>
              <span className="mt-2 text-xs font-bold">{faol?.nom || "Sandiq"}</span>
              {faol?.tavsif && (
                <span
                  className="mt-1 text-center text-[10px]"
                  style={{ color: "var(--v3-xira)" }}
                >
                  {faol.tavsif}
                </span>
              )}
              {faol?.buyumSoni > 0 && (
                <span className="mt-1 text-[10px]" style={{ color: "var(--v3-xira)" }}>
                  Ichida {faol.buyumSoni} ta buyum
                </span>
              )}
            </div>
          )}
        </div>

        {/* Xato — server nima deganini aynan ko'rsatamiz */}
        {xato && (
          <div
            className="mb-3 rounded-xl border p-2.5 text-xs"
            style={{
              borderColor: "color-mix(in srgb, var(--v3-urgu) 45%, transparent)",
              background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
              color: "var(--v3-urgu)",
            }}
          >
            {xato}
          </div>
        )}

        <button
          type="button"
          disabled={ochilmoqda || !faol || (faol.kunlik && faol.ochilgan)}
          onClick={handleOchish}
          className="w-full rounded-xl py-3 text-xs font-bold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
        >
          {ochilmoqda
            ? "Ochilmoqda..."
            : faol?.kunlik && faol?.ochilgan
            ? "Bugun allaqachon olingan"
            : "🎁 Ochish"}
        </button>
      </div>
    </div>
  );
}
