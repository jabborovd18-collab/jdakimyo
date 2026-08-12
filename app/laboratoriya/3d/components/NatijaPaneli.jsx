"use client";

import { useState } from "react";
import Ikon from "@/components/Ikon";

export default function NatijaPaneli({
  natija,
  tanlov,
  xato,
  hisobot,
  nisbatBahosi,
  kinetika,
  onYop,
  onTanlovTanla,
  onQaytaUrin,
  onMolekulaZoom,
  onEkspertTahlil,
  onPdfYukla,
}) {
  const [faolTab, setFaolTab] = useState("natija"); // "natija" | "kinetika" | "hisobot"

  if (!natija && !tanlov && !xato) return null;

  const reaksiya = natija?.reaksiya;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border p-5 shadow-2xl backdrop-blur-xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-full md:w-96 md:rounded-l-2xl md:rounded-tr-none v3-panel-karta bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq-2)] text-[var(--v3-matn)]"
    >
      {/* Sarlavha va yopish tugmasi */}
      <div
        className="mb-3.5 flex items-center justify-between border-b pb-3 border-[var(--v3-chiziq)]"
      >
        <h2 className="text-sm font-bold text-[var(--v3-urgu)] flex items-center gap-1.5">
          <Ikon nom="atom" olcham={16} />
          <span>{tanlov ? "Sharoitni tanlang" : xato ? "Tajriba ma'lumoti" : "Tajriba natijasi"}</span>
        </h2>
        <button
          type="button"
          onClick={() => typeof onYop === "function" && onYop()}
          className="p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
        >
          <Ikon nom="yopish" olcham={15} />
        </button>
      </div>

      {/* Tablar */}
      {natija && (
        <div className="mb-3.5 flex gap-1 rounded-xl p-1 bg-[var(--v3-fon)] border border-[var(--v3-chiziq)]">
          {[
            ["natija", "Natija"],
            ["kinetika", "3-Bosqich: Unum"],
            ["hisobot", "Daftar"],
          ].map(([kalit, matn]) => (
            <button
              key={kalit}
              type="button"
              onClick={() => setFaolTab(kalit)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                faolTab === kalit
                  ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm"
                  : "text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              }`}
            >
              {matn}
            </button>
          ))}
        </div>
      )}

      {/* Asosiy kontent */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs">
        {/* 1. TANLOV HOLATI */}
        {tanlov && (
          <div className="space-y-3">
            <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
              Ushbu reagentlardan turli sharoitda har xil mahsulot hosil bo&apos;ladi. Mos sharoitni tanlang:
            </p>
            <div className="space-y-2">
              {tanlov.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => typeof onTanlovTanla === "function" && onTanlovTanla(item.id)}
                  className="w-full text-left p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-urgu)] transition space-y-1.5"
                >
                  <span className="text-xs font-bold text-[var(--v3-urgu)] block">
                    {item.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[10.5px] font-mono text-[var(--v3-xira)]">
                    {item.temperature && <span>🌡️ {item.temperature}</span>}
                    {item.catalyst && <span>⚡ Kat: {item.catalyst}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. XATO HOLATI */}
        {xato && !tanlov && !natija && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 leading-relaxed">
              💡 {xato}
            </div>
            <button
              type="button"
              onClick={() => typeof onQaytaUrin === "function" && onQaytaUrin()}
              className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-2 font-bold"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* 3. NATIJA TABI */}
        {natija && faolTab === "natija" && (
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-[var(--v3-matn)]">{reaksiya?.name || "Kimyoviy reaksiya"}</h3>
              {natija.birinchi && (
                <span className="v3-tag v3-tag-ochiq mt-1">
                  🎉 Yangi kashfiyot!
                </span>
              )}
            </div>

            {/* Reaksiya Tenglamasi */}
            {reaksiya?.equation && (
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] text-center font-mono text-xs font-bold text-[var(--v3-urgu)]">
                {reaksiya.equation}
              </div>
            )}

            {/* Kuzatuv */}
            {reaksiya?.observations && (
              <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
                <span className="v3-nishon">Kuzatuv (Observations):</span>
                <p className="text-xs text-[var(--v3-matn)] leading-relaxed">{reaksiya.observations}</p>
              </div>
            )}

            {/* Sarflandi / Olindi */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)]">
                <span className="v3-nishon block mb-1">Sarflandi</span>
                <div className="space-y-0.5">
                  {(natija.sarflandi || []).map((s, idx) => (
                    <div key={idx} className="text-[11px] text-[var(--v3-matn)] truncate">
                      {s.kalit} {s.matn || `×${s.soni}`}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)]">
                <span className="v3-nishon block mb-1">Hosil bo{"'"}ldi</span>
                <div className="space-y-0.5">
                  {(natija.olindi || []).map((o, idx) => (
                    <div key={idx} className="text-[11px] text-[var(--v3-urgu)] font-bold truncate">
                      {o.kalit} {o.matn || `×${o.soni}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* XP va Daraja */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
              <div>
                <span className="v3-nishon">Olingan XP:</span>
                <div className="text-sm font-bold text-yellow-400 font-mono">+{natija.olinganXP || 10} XP</div>
              </div>
              {natija.yangiDaraja && (
                <div className="text-right">
                  <span className="v3-nishon">Laboratoriya:</span>
                  <div className="text-sm font-bold text-[var(--v3-matn)] font-mono">{natija.yangiDaraja}-daraja</div>
                </div>
              )}
            </div>

            {/* 🔍 Molekulyar Nano-Zoom va Ekspert Tahlili Tugmalari */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => typeof onEkspertTahlil === "function" && onEkspertTahlil()}
                className="w-full v3-tugma v3-tugma-asosiy text-xs py-2 justify-center font-bold"
              >
                <Ikon nom="orin" olcham={14} />
                <span>Ilmiy Ekspert Xulosasi</span>
              </button>

              <button
                type="button"
                onClick={() => typeof onMolekulaZoom === "function" && onMolekulaZoom("H₂O")}
                className="w-full v3-tugma text-xs py-2 justify-center font-bold"
              >
                <Ikon nom="atom" olcham={14} />
                <span>3D Molekula Tuzilishi</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. 3-BOSQICH: KINETIKA VA UNUM TABI */}
        {natija && faolTab === "kinetika" && (
          <div className="space-y-3.5">
            <div className="v3-nishon text-[var(--v3-urgu)]">3-Bosqich: Kinetika va Stexiometriya</div>

            {/* Unum ko'rsatkichi */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-1">
              <div className="text-[10px] uppercase font-mono text-[var(--v3-xira)]">Reaksiya Unumi (Yield)</div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {kinetika?.unumFoizi || 92.5}%
              </div>
              <p className="text-[11px] text-[var(--v3-xira)]">
                Nazariy hosil bo{"'"}lish: <strong>{kinetika?.nazariyMassa || 0} g</strong> · Amaliy olingan: <strong className="text-emerald-300">{kinetika?.amaliyMassa || 0} g</strong>
              </p>
            </div>

            {/* Harorat va Tezlik koeffitsiyenti */}
            <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--v3-xira)]">Idish harorati:</span>
                <strong className="text-amber-400">{kinetika?.harorat || 25}°C</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--v3-xira)]">Tezlik koeffitsiyenti (Vant-Goff):</span>
                <strong className="text-cyan-400">×{kinetika?.haroratTezligiKoef || 1.0} barobar</strong>
              </div>
              <div className="flex justify-between border-t border-[var(--v3-chiziq)] pt-1.5">
                <span className="text-[var(--v3-xira)]">O{"'"}rtacha konsentratsiya:</span>
                <strong className="text-[var(--v3-matn)]">{kinetika?.ortachaKonsentratsiya || 0.5} M</strong>
              </div>
            </div>

            {/* Kutilmagan hodisalar */}
            {kinetika?.kutilmaganHolatlar?.length > 0 && (
              <div className="space-y-2">
                <div className="v3-nishon">Kuzatilgan hodisalar:</div>
                {kinetika.kutilmaganHolatlar.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-0.5">
                    <div className="font-bold text-xs text-amber-300">{h.nom}</div>
                    <p className="text-[11px] text-[var(--v3-matn)] opacity-85 leading-relaxed">{h.matn}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. HISOBOT TABI */}
        {natija && faolTab === "hisobot" && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] space-y-2">
              <h4 className="v3-nishon">Qadam-baqadam tahlil</h4>
              <div className="space-y-1.5">
                {(hisobot?.qadamlar || []).map((qadam, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                      qadam.xato
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-matn)]'
                    }`}
                  >
                    {qadam.matn}
                  </div>
                ))}
              </div>
            </div>

            {hisobot?.xulosa && (
              <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
                <span className="v3-nishon text-[var(--v3-urgu)]">Yakuniy xulosa:</span>
                <p className="text-xs text-[var(--v3-matn)] leading-relaxed">{hisobot.xulosa}</p>
              </div>
            )}

            {/* PDF Hisobot Yuklash Tugmasi */}
            <button
              type="button"
              onClick={() => typeof onPdfYukla === "function" && onPdfYukla()}
              className="w-full v3-tugma v3-tugma-asosiy text-xs py-2.5 font-bold justify-center"
            >
              <Ikon nom="fayl" olcham={14} />
              <span>Laboratoriya Daftarini Yuklash (PDF)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
