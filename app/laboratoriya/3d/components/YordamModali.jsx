"use client";

import Ikon from "@/components/Ikon";

import { KLAVIATURA_AMALLARI, muqobilsizAmallar } from "../lib/kirish-usuli.js";

// [H] BOSHQARUV QO'LLANMASI MODALI.
//
// `korinish.js` dan ajratildi (BRIF-05). Bu yerda mantiq yo'q —
// faqat `lib/kirish-usuli.js` dagi ro'yxatni chizadi. Shuning uchun
// u sahnaga ham, tajribaga ham bog'lanmagan va alohida turgani
// ma'qul: qo'llanma matnini o'zgartirish uchun 1200 qatorlik
// komponentni ochish shart emas.
//
// `sensorli` tashqaridan keladi: kirish usuli butun sahifa uchun bir
// marta aniqlanadi (`useKirishUsuli`), uni bu yerda qayta aniqlash
// ikkinchi manba bo'lardi (AGENTS.md 1-band).

export default function YordamModali({ sensorli, yop }) {
  return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => yop()}
      >
        <div
          className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-2xl space-y-4 text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
              <Ikon nom="odam" olcham={18} />
              <span>3D JISMONIY BOSHQARUV QO{"'"}LLANMASI</span>
            </div>
            <button
              type="button"
              onClick={() => yop()}
              className="text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Boshqaruv jadvali `lib/kirish-usuli.js` dagi ro'yxatdan
              yasaladi. Ilgari u shu yerda qo'lda yozilgan va faqat
              klaviaturani ko'rsatardi; telefonda o'quvchi "E" ni
              qayerdan bosishini bilmasdi. */}
          <div className="space-y-1.5 text-xs font-mono">
            {KLAVIATURA_AMALLARI.map((a) => {
              const yoq = sensorli && !a.sensorda;
              return (
                <div
                  key={a.tugma}
                  className={`flex items-start gap-2.5 rounded-xl border p-2 ${
                    yoq
                      ? "border-amber-500/40 bg-amber-500/5"
                      : "border-slate-800 bg-slate-900/70"
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                      yoq ? "bg-amber-500/15 text-amber-300" : "bg-slate-800 text-cyan-300"
                    }`}
                  >
                    {sensorli ? a.sensorda || "yo'q" : a.tugma}
                  </span>
                  <span className="flex-1 text-[11px] text-slate-300 leading-relaxed">
                    {a.amal}
                    {yoq && a.izoh && (
                      <span className="block text-amber-300/80 mt-0.5">{a.izoh}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sensorli qurilmada bajarib bo'lmaydigan amallar ochiq
              aytiladi. Jim qoldirilsa, o'quvchi nima qilishni bilmay
              tajribani tashlab ketardi. */}
          {sensorli && muqobilsizAmallar().length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono text-[11px]">
                <Ikon nom="bayroq" olcham={13} />
                <span>BU QURILMADA BAJARIB BO{"'"}LMAYDI</span>
              </div>
              <p className="text-[11px] text-amber-100/80 leading-relaxed">
                Quyidagi amallar klaviatura talab qiladi. Ularni bajarish uchun
                kompyuterdan kiring — laboratoriyaning qolgan hamma qismi bu
                qurilmada to{"'"}liq ishlaydi.
              </p>
              <ul className="space-y-0.5 pl-1">
                {muqobilsizAmallar().map((a) => (
                  <li key={a.tugma} className="text-[11px] text-amber-200/90">
                    • <strong>{a.amal}</strong>
                    {a.izoh ? ` — ${a.izoh}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <strong className="text-white block font-mono text-cyan-400">Nimadan boshlash kerak:</strong>
            <p>
              • <strong>Reagentlar:</strong> devordagi shkaf oldiga borib shishaga qarang va{" "}
              <code className="text-cyan-300">{ISH.amal}</code> qiling.
            </p>
            <p>
              • <strong>Jihozlar:</strong> stoldagi jihozlar stendidan bo{"'"}sh probirka yoki
              kolbani <code className="text-cyan-300">{ISH.amal}</code> bilan oling.
            </p>
            <p>
              • <strong>Tarozi:</strong> stoldagi tarozi oldiga kelib{" "}
              <code className="text-cyan-300">[TARA]</code> yoki{" "}
              <code className="text-cyan-300">[ZERO]</code> tugmasini bosing.
            </p>
            <p>
              • <strong>Yuvish:</strong> rakovina oldiga borib kran jo{"'"}mragini buring
              yoki idishni yuving.
            </p>
            <p>
              • <strong>Tahlil:</strong> stoldagi smart planshet oldiga kelib{" "}
              <code className="text-cyan-300">{ISH.amal}</code> qiling.
            </p>
          </div>

          <button
            type="button"
            onClick={() => yop()}
            className="w-full py-2 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-all shadow-lg"
          >
            Tushundim, Laboratoriyaga Qaytish →
          </button>
        </div>
      </div>
  );
}
