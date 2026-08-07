"use client";

import { useState } from "react";

// Tajriba natijasi, stexiometrik hisobot, sharoit tanlovi yoki yumshoq xabar
// ko'rsatuvchi yon panel (yoki telefonda pastki panel).
// Nega xato qadam qizil emas, sariq rangda va ayblovsiz: talaba xato qilganda
// jazolanayotgandek emas, balki stexiometriyani o'rganayotgandek his qilishi shart.
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
    <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border border-purple-800/60 bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur-xl md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-full md:w-96 md:rounded-l-2xl md:rounded-tr-none">
      {/* Sarlavha va yopish tugmasi */}
      <div className="mb-4 flex items-center justify-between border-b border-purple-800/40 pb-3">
        <h2 className="text-base font-bold text-yellow-400">
          {tanlov ? "Sharoitni Tanlang" : xato ? "Tajriba Ma'lumoti" : "Tajriba Natijasi"}
        </h2>
        <button
          type="button"
          onClick={() => typeof onYop === "function" && onYop()}
          className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs text-purple-300 hover:bg-slate-800 hover:text-white"
        >
          ✕ Yopish
        </button>
      </div>

      {/* Tablar (faqat muvaffaqiyatli natija bo'lganda) */}
      {natija && (
        <div className="mb-4 flex rounded-xl bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => setFaolTab("natija")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              faolTab === "natija"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow"
                : "text-purple-300 hover:text-white"
            }`}
          >
            🔬 Natija
          </button>
          <button
            type="button"
            onClick={() => setFaolTab("hisobot")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              faolTab === "hisobot"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow"
                : "text-purple-300 hover:text-white"
            }`}
          >
            📋 Laboratoriya Daftari
          </button>
        </div>
      )}

      {/* Asosiy kontent */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* 1. TANLOV HOLATI — sharoit tugmalari, TENGLAMA KO'RSATILMAYDI */}
        {tanlov && (
          <div className="flex flex-col gap-3">
            <p className="text-xs leading-relaxed text-purple-200">
              Ushbu reagentlardan turli sharoitda har xil mahsulot hosil bo&apos;ladi. Reaksiyani
              davom ettirish uchun mos sharoitni tanlang:
            </p>
            <div className="flex flex-col gap-2.5">
              {tanlov.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => typeof onTanlovTanla === "function" && onTanlovTanla(item.id)}
                  className="flex flex-col rounded-xl border border-purple-800/60 bg-slate-800/60 p-3.5 text-left transition hover:border-yellow-500 hover:bg-slate-800"
                >
                  <span className="text-sm font-bold text-yellow-300">{item.name}</span>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-purple-300">
                    {item.temperature && (
                      <span className="rounded bg-purple-950/80 px-2 py-0.5">
                        🌡️ {item.temperature}
                      </span>
                    )}
                    {item.environment && (
                      <span className="rounded bg-purple-950/80 px-2 py-0.5">
                        💧 {item.environment}
                      </span>
                    )}
                    {item.catalyst && (
                      <span className="rounded bg-purple-950/80 px-2 py-0.5">
                        ⚡ Katalizator: {item.catalyst}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. XATO HOLATI — yumshoq ohangda */}
        {xato && !tanlov && !natija && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-yellow-500/40 bg-yellow-950/30 p-4 text-xs leading-relaxed text-yellow-200">
              💡 {xato}
            </div>
            <button
              type="button"
              onClick={() => typeof onQaytaUrin === "function" && onQaytaUrin()}
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-2.5 text-center text-xs font-bold text-black shadow-lg hover:opacity-90"
            >
              Qayta Urinish
            </button>
          </div>
        )}

        {/* 3. NATIJA TABI */}
        {natija && faolTab === "natija" && (
          <div className="flex flex-col gap-4">
            {/* Sarlavha va kashfiyot badge'i */}
            <div>
              <h3 className="text-base font-bold text-white">
                {reaksiya?.name || "Kimyoviy Reaksiya"}
              </h3>
              {natija.birinchi && (
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-purple-900/80 px-3 py-1 text-xs font-bold text-yellow-300">
                  🎉 Birinchi kashfiyot!
                </div>
              )}
            </div>

            {/* Tenglama */}
            {reaksiya?.equation && (
              <div className="rounded-xl border border-purple-800/50 bg-slate-950/80 p-3 text-center font-mono text-sm font-bold text-yellow-300">
                {reaksiya.equation}
              </div>
            )}

            {/* Kuzatuv (Observations) */}
            {reaksiya?.observations && (
              <div className="rounded-xl bg-slate-800/50 p-3">
                <span className="text-xs font-semibold uppercase text-purple-400">
                  👁️ Nima ko&apos;rindi:
                </span>
                <p className="mt-1 text-xs leading-relaxed text-purple-100">
                  {reaksiya.observations}
                </p>
              </div>
            )}

            {/* Xavfsizlik ogohlantirishlari */}
            {reaksiya?.hazards && reaksiya.hazards.length > 0 && (
              <div className="rounded-xl border border-yellow-500/50 bg-yellow-950/40 p-3">
                <span className="text-xs font-bold text-yellow-300">
                  ⚠️ Xavfsizlik qoidalari:
                </span>
                <ul className="mt-1 list-disc pl-4 text-xs text-yellow-200">
                  {reaksiya.hazards.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sarflandi va Olindi */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-purple-800/40 bg-slate-950/60 p-2.5">
                <span className="text-[11px] font-semibold text-purple-400">Sarflandi:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(natija.sarflandi || []).map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-white"
                    >
                      {s.kalit} ×{s.soni}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-purple-800/40 bg-slate-950/60 p-2.5">
                <span className="text-[11px] font-semibold text-purple-400">Olindi:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(natija.olindi || []).map((o, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-purple-900/60 px-1.5 py-0.5 text-xs font-bold text-yellow-300"
                    >
                      {o.kalit} ×{o.soni}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tajriba ochkosi va daraja */}
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-900/60 to-slate-900 p-3">
              <div className="flex flex-col">
                <span className="text-xs text-purple-300">Tajriba Ochkosi</span>
                <span className="text-sm font-bold text-yellow-400">
                  +{natija.olinganXP || 10} XP
                </span>
              </div>
              {natija.yangiDaraja && (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-purple-300">Daraja Holati</span>
                  <span className="text-sm font-bold text-purple-200">
                    {natija.yangiDaraja}-daraja
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. HISOBOT TABI (Laboratoriya daftari) */}
        {natija && faolTab === "hisobot" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-slate-950/70 p-3">
              <h4 className="text-xs font-bold text-purple-300">Qadam-baqadam Tahlil:</h4>
              <div className="mt-2 flex flex-col gap-2">
                {(hisobot?.qadamlar || []).map((qadam, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-3 text-xs leading-relaxed ${
                      qadam.xato
                        ? "border-yellow-500/60 bg-yellow-950/30 text-yellow-200"
                        : "border-purple-800/40 bg-slate-800/40 text-purple-100"
                    }`}
                  >
                    {qadam.matn}
                  </div>
                ))}
              </div>
            </div>

            {hisobot?.xulosa && (
              <div className="rounded-xl border border-purple-800/50 bg-slate-800/60 p-3">
                <span className="text-xs font-bold text-yellow-300">Yakuniy Xulosa:</span>
                <p className="mt-1 text-xs leading-relaxed text-purple-100">
                  {hisobot.xulosa}
                </p>
              </div>
            )}

            {hisobot?.ogohlantirishlar && hisobot.ogohlantirishlar.length > 0 && (
              <div className="rounded-xl border border-yellow-500/50 bg-yellow-950/40 p-3">
                <span className="text-xs font-bold text-yellow-300">Tavsiyalar:</span>
                <ul className="mt-1 list-disc pl-4 text-xs text-yellow-200">
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