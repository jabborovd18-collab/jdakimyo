"use client";

import { useState, useEffect } from "react";
import Ikon from "@/components/Ikon";
import MasalaVizual from "./MasalaVizual.jsx";
import { masalaPdfYukla } from "@/lib/masala-pdf.js";
import { ovozPleyeri } from "@/lib/ovoz-pleyer.js";
import toast from "react-hot-toast";

export default function YechimPaneli({ natija, onToliqYechimgaOtish, foydalanuvchiNom = "Talaba" }) {
  const [ijroEtilmoqda, setIjroEtilmoqda] = useState(false);
  const [tezlik, setTezlik] = useState(1);
  const [oqituvchiJavobi, setOqituvchiJavobi] = useState("");
  const [pdfYuklanmoqda, setPdfYuklanmoqda] = useState(false);
  const [faolGapIndeks, setFaolGapIndeks] = useState(-1);

  useEffect(() => {
    return () => {
      ovozPleyeri.toxtat();
    };
  }, []);

  if (!natija) return null;

  const handleOvozIjro = () => {
    if (ijroEtilmoqda) {
      ovozPleyeri.pausa();
      setIjroEtilmoqda(false);
    } else {
      const matn = natija?.ovozMatni || natija?.yakuniyJavob || "";
      if (!matn) {
        toast.error("Ovozli o'qish uchun matn topilmadi.");
        return;
      }

      ovozPleyeri.boshla(matn, {
        tezlik,
        onBoshlandi: () => setIjroEtilmoqda(true),
        onTugadi: () => {
          setIjroEtilmoqda(false);
          setFaolGapIndeks(-1);
        },
        onQadam: (idx) => {
          setFaolGapIndeks(idx);
        },
        onXato: () => {
          setIjroEtilmoqda(false);
        },
      });
      setIjroEtilmoqda(true);
    }
  };

  const handleTezlikOzgardi = (yangiTezlik) => {
    setTezlik(yangiTezlik);
    ovozPleyeri.tezlikniOrnat(yangiTezlik);
  };

  const handlePdfYuklabOlish = async () => {
    try {
      setPdfYuklanmoqda(true);
      toast.loading("Masala yechimi PDF hujjati tayyorlanmoqda...", { id: "masala-pdf" });
      await masalaPdfYukla({
        foydalanuvchiNom,
        masalaMatni: natija.masalaMatni || natija.tenglama || "Kimyoviy Masala",
        natija,
      });
      toast.success("PDF hisoboti muvaffaqiyatli yuklandi!", { id: "masala-pdf" });
    } catch (err) {
      toast.error("PDF yaratishda xatolik: " + err.message, { id: "masala-pdf" });
    } finally {
      setPdfYuklanmoqda(false);
    }
  };

  const nusxaOlish = () => {
    const matn = `${natija.tenglama || ""}\n\n${natija.bosqichlar?.map((b) => `${b.sarlavha}:\n${b.matn}`).join("\n\n")}\n\nJavob: ${natija.yakuniyJavob || ""}`;
    navigator.clipboard.writeText(matn);
    toast.success("Yechim matni buferga nusxalandi!");
  };

  const rejim = natija.rejim || "toliq";

  return (
    <div className="rounded-2xl border p-5 sm:p-6 shadow-2xl bg-[var(--v3-yuza)] border-[var(--v3-chiziq-2)] space-y-5 animate-in fade-in duration-200 text-[var(--v3-matn)]">
      {/* ─── HEADER VA AUDIO PLAYER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)]">
            <Ikon nom="kolba" olcham={20} />
          </div>
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">
              {rejim === "tuzoq"
                ? "⚡ 1-Rejim: Keskin Burilish Tahlili"
                : rejim === "yonalish"
                ? "🧭 2-Rejim: Yo'naltirish & Formulalar"
                : "🎯 3-Rejim: To'liq Master Yechim"}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--v3-matn)]">
              {rejim === "tuzoq"
                ? "Masaladagi Yashirin Qopqon"
                : rejim === "yonalish"
                ? "Yechish Rejasi va Formulalar"
                : "Professional Kimyoviy Tahlil"}
            </h3>
          </div>
        </div>

        {/* Audio boshqaruv va Amallar */}
        <div className="flex flex-wrap items-center gap-2">
          {natija.ovozMatni && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-[var(--v3-fon)] border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={handleOvozIjro}
                className={`v3-tugma text-xs py-1.5 px-3 font-bold ${
                  ijroEtilmoqda ? "v3-tugma-asosiy shadow-sm" : ""
                }`}
              >
                <Ikon nom="ovoz" olcham={13} />
                <span>{ijroEtilmoqda ? "To'xtatish" : "Ovozli tushuntirish"}</span>
              </button>

              <div className="flex gap-1 border-l pl-1.5 border-[var(--v3-chiziq)]">
                {[1, 1.25, 1.5].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTezlikOzgardi(t)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                      tezlik === t
                        ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]"
                        : "text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    {t}x
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handlePdfYuklabOlish}
            disabled={pdfYuklanmoqda}
            className="v3-tugma text-xs py-1.5 px-3 font-semibold inline-flex items-center gap-1.5"
            title="PDF formatida yuklab olish"
          >
            <Ikon nom="fayl" olcham={13} />
            <span>PDF Daftari</span>
          </button>

          <button
            type="button"
            onClick={nusxaOlish}
            className="v3-tugma text-xs py-1.5 px-2.5"
            title="Nusxa olish"
          >
            <Ikon nom="belgi" olcham={13} />
          </button>
        </div>
      </div>

      {/* ─── 1-REJIM: TUZOQ VA KESKIN BURILISH BLOKI ─── */}
      {rejim === "tuzoq" && natija.tuzoqTahlili && (
        <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Ikon nom="chaqmoq" olcham={16} />
            <span>Diqqat: Ko{"'"}zdan Qochishi Mumkin Bo{"'"}lgan Nozik Nuqta!</span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[var(--v3-fon)] text-xs text-[var(--v3-matn)] space-y-2">
            <div className="font-bold text-amber-300">
              🔑 Kalit qoida:
            </div>
            <p className="leading-relaxed">{natija.tuzoqTahlili.kalitNuqta}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
              <span className="text-[10.5px] font-mono uppercase text-red-400 block font-bold">
                ⚠️ Keng tarqalgan xato:
              </span>
              <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
                {natija.tuzoqTahlili.kengTarqalganXato}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
              <span className="text-[10.5px] font-mono uppercase text-emerald-400 block font-bold">
                💡 Nima uchun muhim:
              </span>
              <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
                {natija.tuzoqTahlili.nimaUchunMuhim}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2-REJIM: YO'NALTIRISH VA FORMULALAR BLOKI ─── */}
      {rejim === "yonalish" && natija.yonalish && (
        <div className="space-y-4">
          {/* Formulalar */}
          {natija.yonalish.formulalar?.length > 0 && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Ikon nom="doska" olcham={14} />
                <span>Kerakli Fizik-Kimyoviy Formulalar:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                {natija.yonalish.formulalar.map((f, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] text-cyan-400 font-bold"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qadamlar rejasi */}
          {natija.yonalish.qadamlarRejasi?.length > 0 && (
            <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-2">
              <span className="v3-nishon text-[var(--v3-urgu)]">Yechish algoritmi (3 ta qadam):</span>
              <div className="space-y-1.5 text-xs">
                {natija.yonalish.qadamlarRejasi.map((q, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex items-start gap-2 text-[var(--v3-matn)] leading-relaxed"
                  >
                    <span className="font-bold text-[var(--v3-urgu)] shrink-0 font-mono">
                      {i + 1}.
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* O'quvchi Hisoblash Daftarchasi (Interactive Scratchpad) */}
          <div className="p-4 rounded-xl border border-[var(--v3-urgu)]/40 bg-[var(--v3-yuza)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
                <Ikon nom="quiz" olcham={14} className="text-[var(--v3-urgu)]" />
                <span>Hisoblash Daftarchangiz:</span>
              </span>
              <span className="text-[10px] text-[var(--v3-xira)]">Olingan javobingizni tekshiring</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={oqituvchiJavobi}
                onChange={(e) => setOqituvchiJavobi(e.target.value)}
                placeholder="Hisoblab topgan javobingizni yozing (masalan: 12.8% yoki 0.25 mol)..."
                className="v3-kiritish flex-1 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (!oqituvchiJavobi.trim()) {
                    toast.error("Avval hisoblangan javobingizni kiriting!");
                    return;
                  }
                  toast.success("Ajoyib harakat! Endi to'liq master yechim bilan taqqoslang.");
                  if (typeof onToliqYechimgaOtish === "function") {
                    onToliqYechimgaOtish();
                  }
                }}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold shrink-0"
              >
                Tekshirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── REAKSIYA TENGLAMASI ─── */}
      {natija.tenglama && (
        <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] text-center space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--v3-xira)]">
            Asosiy Reaksiya / Kimyoviy Bog{"'"}lanish
          </span>
          <div className="text-sm sm:text-base font-bold font-mono text-[var(--v3-urgu)]">
            {natija.tenglama}
          </div>
        </div>
      )}

      {/* ─── 3-BOSQICH: DINAMIK ILMIY VIZUAL GRAFIK (SXEMA) ─── */}
      {natija.vizualSxema && <MasalaVizual sxema={natija.vizualSxema} />}

      {/* ─── BOSQICHMA-BOSQICH TAHLIL VA HISOBOT ─── */}
      <div className="space-y-2.5">
        <div className="v3-nishon">Qadam-baqadam yechim tahlili:</div>
        <div className="space-y-2">
          {natija.bosqichlar?.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1.5 transition-all hover:border-[var(--v3-urgu)]"
            >
              <div className="text-xs font-bold text-[var(--v3-urgu)] flex items-center gap-1.5">
                <Ikon nom="ong" olcham={12} />
                <span>{b.sarlavha}</span>
              </div>
              <div className="text-xs text-[var(--v3-matn)] leading-relaxed font-mono whitespace-pre-line">
                {b.matn}
              </div>
              {b.formula && (
                <div className="p-2 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[11px] font-mono text-cyan-400">
                  {b.formula}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3-REJIM: YAKUNIY JAVOB KARTASI ─── */}
      {rejim === "toliq" && natija.yakuniyJavob && (
        <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Ikon nom="belgi" olcham={15} />
              <span>🏁 Yakuniy Matematik Javob:</span>
            </span>
            <span className="v3-tag v3-tag-ochiq text-[10px] font-mono font-bold">
              ✓ Tasdiqlangan
            </span>
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-300 font-mono">
            {natija.yakuniyJavob}
          </div>
        </div>
      )}

      {/* Rejimni almashtirish tugmasi (agar 'tuzoq' yoki 'yonalish' bo'lsa) */}
      {rejim !== "toliq" && typeof onToliqYechimgaOtish === "function" && (
        <div className="pt-2 border-t border-[var(--v3-chiziq)] flex justify-end">
          <button
            type="button"
            onClick={onToliqYechimgaOtish}
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold inline-flex items-center gap-2"
          >
            <Ikon nom="orin" olcham={14} />
            <span>To{"'"}liq Master Yechimni Ochish →</span>
          </button>
        </div>
      )}
    </div>
  );
}
