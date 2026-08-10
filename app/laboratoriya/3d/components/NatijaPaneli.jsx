"use client";

import { useState } from "react";

// Tajriba natijasi, stexiometrik hisobot, sharoit tanlovi yoki yumshoq xabar
// ko'rsatuvchi yon panel (yoki telefonda pastki panel).
// Nega xato qadam qizil emas, sariq rangda va ayblovsiz: talaba xato qilganda
// jazolanayotgandek emas, balki stexiometriyani o'rganayotgandek his qilishi shart.

// Rang qiymatlari sinf ichida emas, CSS o'zgaruvchisida — v3 qoidasi.
const YUZA = { background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" };
const CHUQUR = { background: "var(--v3-fon)", borderColor: "var(--v3-chiziq)" };

// Ogohlantirish va "yumshoq xato" uslubi. `--v3-urgu` har to'rt mavzuda ham
// oltin-jigarrang oilasidan, ya'ni yorug' fonda ham ogohlantirish bo'lib
// o'qiladi — shuning uchun alohida sariq qattiq yozilmaydi.
const OGOH = {
  borderColor: "color-mix(in srgb, var(--v3-urgu) 45%, transparent)",
  background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
  color: "var(--v3-urgu)",
};

export default function NatijaPaneli({
  natija,
  tanlov,
  xato,
  hisobot,
  nisbatBahosi,
  onYop,
  onTanlovTanla,
  onQaytaUrin,
}) {
  const [faolTab, setFaolTab] = useState("natija"); // "natija" yoki "hisobot"

  // Agar hech qanday natija, tanlov yoki xato bo'lmasa panel ochilmaydi
  if (!natija && !tanlov && !xato) return null;

  const reaksiya = natija?.reaksiya;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border p-5 shadow-2xl backdrop-blur-xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-full md:w-96 md:rounded-l-2xl md:rounded-tr-none"
      style={{
        background: "var(--v3-fon-2)",
        borderColor: "var(--v3-chiziq-2)",
        color: "var(--v3-matn)",
      }}
    >
      {/* Sarlavha va yopish tugmasi */}
      <div
        className="mb-4 flex items-center justify-between border-b pb-3"
        style={{ borderColor: "var(--v3-chiziq)" }}
      >
        <h2 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
          {tanlov ? "Sharoitni tanlang" : xato ? "Tajriba ma'lumoti" : "Tajriba natijasi"}
        </h2>
        <button
          type="button"
          onClick={() => typeof onYop === "function" && onYop()}
          className="v3-tugma text-xs"
        >
          ✕ Yopish
        </button>
      </div>

      {/* Tablar (faqat muvaffaqiyatli natija bo'lganda) */}
      {natija && (
        <div className="mb-4 flex gap-1 rounded-xl p-1" style={{ background: "var(--v3-fon)" }}>
          {[
            ["natija", "🔬 Natija"],
            ["hisobot", "📋 Laboratoriya daftari"],
          ].map(([kalit, matn]) => (
            <button
              key={kalit}
              type="button"
              onClick={() => setFaolTab(kalit)}
              className="flex-1 rounded-lg py-1.5 text-xs font-bold transition"
              style={
                faolTab === kalit
                  ? { background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }
                  : { color: "var(--v3-xira)" }
              }
            >
              {matn}
            </button>
          ))}
        </div>
      )}

      {/* Asosiy kontent */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* 1. TANLOV HOLATI — sharoit tugmalari, TENGLAMA KO'RSATILMAYDI */}
        {tanlov && (
          <div className="flex flex-col gap-3">
            <p className="v3-xira text-xs leading-relaxed">
              Ushbu reagentlardan turli sharoitda har xil mahsulot hosil bo&apos;ladi. Reaksiyani
              davom ettirish uchun mos sharoitni tanlang:
            </p>
            <div className="flex flex-col gap-2.5">
              {tanlov.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => typeof onTanlovTanla === "function" && onTanlovTanla(item.id)}
                  className="flex flex-col rounded-xl border p-3.5 text-left transition"
                  style={YUZA}
                >
                  <span className="text-sm font-bold" style={{ color: "var(--v3-urgu)" }}>
                    {item.name}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-[11px]">
                    {[
                      item.temperature && `🌡️ ${item.temperature}`,
                      item.environment && `💧 ${item.environment}`,
                      item.catalyst && `⚡ Katalizator: ${item.catalyst}`,
                    ]
                      .filter(Boolean)
                      .map((matn, i) => (
                        <span
                          key={i}
                          className="rounded px-2 py-0.5"
                          style={{ background: "var(--v3-yuza-2)", color: "var(--v3-xira)" }}
                        >
                          {matn}
                        </span>
                      ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. XATO HOLATI — yumshoq ohangda */}
        {xato && !tanlov && !natija && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border p-4 text-xs leading-relaxed" style={OGOH}>
              💡 {xato}
            </div>
            <button
              type="button"
              onClick={() => typeof onQaytaUrin === "function" && onQaytaUrin()}
              className="v3-tugma-asosiy justify-center text-xs"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* 3. NATIJA TABI */}
        {natija && faolTab === "natija" && (
          <div className="flex flex-col gap-4">
            {/* Sarlavha va kashfiyot badge'i */}
            <div>
              <h3 className="text-base font-bold">{reaksiya?.name || "Kimyoviy reaksiya"}</h3>
              {natija.birinchi && (
                <div className="v3-chip mt-1 inline-flex items-center gap-1.5">
                  🎉 Birinchi kashfiyot!
                </div>
              )}
            </div>

            {/* Tenglama */}
            {reaksiya?.equation && (
              <div
                className="rounded-xl border p-3 text-center font-mono text-sm font-bold"
                style={{ ...CHUQUR, color: "var(--v3-urgu)" }}
              >
                {reaksiya.equation}
              </div>
            )}

            {/* Kuzatuv (Observations) */}
            {reaksiya?.observations && (
              <div className="rounded-xl border p-3" style={YUZA}>
                <span className="v3-nishon">👁️ Nima ko&apos;rindi</span>
                <p className="mt-1 text-xs leading-relaxed">{reaksiya.observations}</p>
              </div>
            )}

            {/* Xavfsizlik ogohlantirishlari */}
            {reaksiya?.hazards && reaksiya.hazards.length > 0 && (
              <div className="rounded-xl border p-3" style={OGOH}>
                <span className="text-xs font-bold">⚠️ Xavfsizlik qoidalari:</span>
                <ul className="mt-1 list-disc pl-4 text-xs">
                  {reaksiya.hazards.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sarflandi va Olindi */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border p-2.5" style={CHUQUR}>
                <span className="v3-nishon">Sarflandi</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(natija.sarflandi || []).map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded px-1.5 py-0.5 text-xs"
                      style={{ background: "var(--v3-yuza-2)" }}
                    >
                      {s.kalit} {s.matn || `×${s.soni}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-2.5" style={CHUQUR}>
                <span className="v3-nishon">Olindi</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(natija.olindi || []).map((o, idx) => (
                    <span
                      key={idx}
                      className="rounded px-1.5 py-0.5 text-xs font-bold"
                      style={{
                        background: "color-mix(in srgb, var(--v3-urgu) 16%, transparent)",
                        color: "var(--v3-urgu)",
                      }}
                    >
                      {o.kalit} {o.matn || `×${o.soni}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tajriba ochkosi va daraja */}
            <div
              className="flex items-center justify-between rounded-xl border p-3"
              style={YUZA}
            >
              <div className="flex flex-col">
                <span className="v3-nishon">Tajriba ochkosi</span>
                <span className="text-sm font-bold" style={{ color: "var(--v3-urgu)" }}>
                  +{natija.olinganXP || 10} XP
                </span>
              </div>
              {natija.yangiDaraja && (
                <div className="flex flex-col items-end">
                  <span className="v3-nishon">Daraja holati</span>
                  <span className="text-sm font-bold">{natija.yangiDaraja}-daraja</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. HISOBOT TABI (Laboratoriya daftari) */}
        {natija && faolTab === "hisobot" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border p-3" style={CHUQUR}>
              <h4 className="v3-nishon">Qadam-baqadam tahlil</h4>
              <div className="mt-2 flex flex-col gap-2">
                {(hisobot?.qadamlar || []).map((qadam, i) => (
                  <div
                    key={i}
                    className="rounded-xl border p-3 text-xs leading-relaxed"
                    style={qadam.xato ? OGOH : YUZA}
                  >
                    {qadam.matn}
                  </div>
                ))}
              </div>
            </div>

            {hisobot?.xulosa && (
              <div className="rounded-xl border p-3" style={YUZA}>
                <span className="text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
                  Yakuniy xulosa:
                </span>
                <p className="mt-1 text-xs leading-relaxed">{hisobot.xulosa}</p>
              </div>
            )}

            {hisobot?.ogohlantirishlar && hisobot.ogohlantirishlar.length > 0 && (
              <div className="rounded-xl border p-3" style={OGOH}>
                <span className="text-xs font-bold">Tavsiyalar:</span>
                <ul className="mt-1 list-disc pl-4 text-xs">
                  {hisobot.ogohlantirishlar.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
