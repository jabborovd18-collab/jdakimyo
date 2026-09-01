// app/masala/components/YechimPaneli.jsx
//
// JDA KIMYO — Zamonaviy Interaktiv Yechim Doskasi va AI Repetitor Q&A (v4.0.0)

"use client";

import { useState, useEffect } from "react";
import Ikon from "@/components/Ikon";
import LatexMatn from "@/components/LatexMatn.jsx";
import LatexBoyMatn from "@/components/LatexBoyMatn.jsx";
import { masalaPdfYukla } from "@/lib/masala-pdf.js";
import { ovozPleyeri } from "@/lib/ovoz-pleyer.js";
import toast from "react-hot-toast";

export default function YechimPaneli({ natija, onToliqYechimgaOtish, foydalanuvchiNom = "Talaba" }) {
  const [ijroEtilmoqda, setIjroEtilmoqda] = useState(false);
  const [tezlik, setTezlik] = useState(1);
  const [pdfYuklanmoqda, setPdfYuklanmoqda] = useState(false);

  // AI Repetitor Chat holatlari
  const [chatSavol, setChatSavol] = useState("");
  const [chatYuklanmoqda, setChatYuklanmoqda] = useState(false);
  const [chatXabarlar, setChatXabarlar] = useState([]);

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
        onTugadi: () => setIjroEtilmoqda(false),
        onXato: () => setIjroEtilmoqda(false),
      });
      setIjroEtilmoqda(true);
    }
  };

  const handlePdfYuklabOlish = async () => {
    try {
      setPdfYuklanmoqda(true);
      toast.loading("Masala yechimi PDF hujjati tayyorlanmoqda...", { id: "masala-pdf" });
      await masalaPdfYukla({
        foydalanuvchiNom,
        masalaMatni: natija.masalaMatni || "Kimyoviy Masala",
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
    const tenglamalarMatn = natija.tenglamalar?.join("\n") || natija.tenglama || "";
    const bosqichlarMatn = natija.bosqichlar?.map((b) => `${b.sarlavha}:\n${b.tushuntirish || b.matn}\nFormula: ${b.formula || ""}`).join("\n\n") || "";
    const toliqMatn = `KIMYOVIY MASALA YECHIMI:\n\n${natija.masalaMatni || ""}\n\nREAKSIYALAR:\n${tenglamalarMatn}\n\nBOSQICHLAR:\n${bosqichlarMatn}\n\nJAVOB: ${natija.yakuniyJavob || ""}`;
    navigator.clipboard.writeText(toliqMatn);
    toast.success("Yechim konspekti nusxalandi!");
  };

  const handleChatYuborish = async (e) => {
    e.preventDefault();
    if (!chatSavol.trim() || chatYuklanmoqda) return;

    const savolMatni = chatSavol.trim();
    setChatSavol("");
    setChatXabarlar((prev) => [...prev, { rol: "user", matn: savolMatni }]);
    setChatYuklanmoqda(true);

    try {
      const res = await fetch("/api/masala/yech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          masalaMatni: natija.masalaMatni,
          yechim: natija,
          savol: savolMatni,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.xato || "Xatolik yuz berdi");

      setChatXabarlar((prev) => [...prev, { rol: "ai", matn: data.javob }]);
    } catch (err) {
      toast.error("AI Repetitor javob berishda xatolik: " + err.message);
      setChatXabarlar((prev) => [
        ...prev,
        { rol: "ai", matn: "Kechirasiz, qayta so'ray olasizmi? Serverda vaqtinchalik xatolik bo'ldi." },
      ]);
    } finally {
      setChatYuklanmoqda(false);
    }
  };

  const rejim = natija.rejim || "toliq";

  return (
    <div className="rounded-3xl border p-5 sm:p-7 shadow-2xl bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] space-y-6 text-[var(--v3-matn)]">
      {/* ─── 1. HEADER VA BOSHQARUV PANEL ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--v3-chiziq)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shadow-inner">
            <Ikon nom="kolba" olcham={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--v3-urgu)]">
              {rejim === "tuzoq"
                ? "⚡ 1-Rejim: Keskin Burilish Tahlili"
                : rejim === "yonalish"
                ? "🧭 2-Rejim: Yo'naltirish & Formulalar"
                : "🎯 3-Rejim: To'liq Master Yechim"}
            </span>
            <h3 className="text-base sm:text-lg font-black text-[var(--v3-matn)]">
              Professional Kimyoviy Tahlil Doskasi
            </h3>
          </div>
        </div>

        {/* Amallar: Audio, PDF, Nusxa */}
        <div className="flex flex-wrap items-center gap-2">
          {natija.ovozMatni && (
            <button
              type="button"
              onClick={handleOvozIjro}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                ijroEtilmoqda
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                  : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
              }`}
            >
              <Ikon nom={ijroEtilmoqda ? "pausa" : "ovoz"} olcham={15} />
              <span>{ijroEtilmoqda ? "To'xtatish" : "Ovozli o'qish"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePdfYuklabOlish}
            disabled={pdfYuklanmoqda}
            className="px-3 py-1.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5 transition-colors"
            title="PDF formatida yuklab olish"
          >
            <Ikon nom="sertifikat" olcham={15} className="text-[var(--v3-urgu)]" />
            <span>{pdfYuklanmoqda ? "PDF..." : "PDF"}</span>
          </button>

          <button
            type="button"
            onClick={nusxaOlish}
            className="px-3 py-1.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] text-xs font-bold text-[var(--v3-matn)] flex items-center gap-1.5 transition-colors"
            title="Nusxalash"
          >
            <Ikon nom="nusxa" olcham={15} />
            <span>Nusxa</span>
          </button>
        </div>
      </div>

      {/* ─── 2. BERILGAN VA TOPISH KERAK (Darslik Standarti) ─── */}
      {(natija.berilgan?.length > 0 || natija.topishKerak?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Berilgan */}
          {natija.berilgan?.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--v3-urgu)] uppercase tracking-wider flex items-center gap-1.5">
                <Ikon nom="tasdiq" olcham={14} /> Berilgan kattaliklar:
              </span>
              <div className="space-y-1.5">
                {natija.berilgan.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                    <LatexMatn matn={b.belgi || ""} className="font-semibold text-[var(--v3-matn)]" />
                    <strong className="text-[var(--v3-matn)] font-mono">{b.qiymat || ""}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topish kerak */}
          {natija.topishKerak?.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ikon nom="savol" olcham={14} /> Topish kerak:
              </span>
              <div className="space-y-1.5">
                {natija.topishKerak.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
                    <LatexMatn matn={t.belgi || ""} className="font-bold text-amber-300" />
                    <span className="text-[var(--v3-xira)]">{t.nom || "Noma'lum qiymat"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. KIMYOVIY REAKSIYA TENGLAMALARI ─── */}
      {(natija.tenglamalar?.length > 0 || natija.tenglama) && (
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-purple-900/40 space-y-2">
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <Ikon nom="reaksiya" olcham={14} /> Reaksiya Tenglamasi va Munosabat:
          </span>
          <div className="space-y-2">
            {(natija.tenglamalar || [natija.tenglama]).map((t, i) => (
              <div key={i} className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-center text-sm sm:text-base font-mono font-bold text-white overflow-x-auto">
                <LatexMatn matn={t} inline={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 4. YASHIRIN TUZOQ & QOPQON TAHLILI (Agar mavjud bo'lsa) ─── */}
      {natija.tuzoqTahlili?.kalitNuqta && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Ikon nom="chaqmoq" olcham={18} />
            <span>⚡ Masaladagi Yashirin Qopqon (Tuzoq) Tahlili:</span>
          </div>
          <div className="space-y-2 text-xs text-[var(--v3-matn)] leading-relaxed">
            <div className="p-3 rounded-xl bg-[var(--v3-fon)] border border-amber-400/30">
              <strong className="text-amber-300 block mb-1">🔍 Nozik Kalit Nuqta:</strong>
              <p>{natija.tuzoqTahlili.kalitNuqta}</p>
            </div>
            {natija.tuzoqTahlili.kengTarqalganXato && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200">
                <strong className="text-red-400 block mb-1">⚠️ 90% O&apos;quvchilar Yo&apos;l Qo&apos;yadigan Xato:</strong>
                <p>{natija.tuzoqTahlili.kengTarqalganXato}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 5. YO'NALTIRISH & FORMULALAR (Agar 'yonalish' bo'lsa) ─── */}
      {natija.yonalish && (
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Ikon nom="kitob" olcham={18} />
            <span>🧭 Yechish Rejasi va Kerakli Formulalar:</span>
          </div>
          {natija.yonalish.formulalar?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {natija.yonalish.formulalar.map((f, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-[var(--v3-fon)] border border-blue-400/40 text-xs font-mono font-bold text-blue-200">
                  <LatexMatn matn={f} />
                </div>
              ))}
            </div>
          )}
          {natija.yonalish.qadamlarRejasi?.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {natija.yonalish.qadamlarRejasi.map((q, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)]">
                  {q}
                </div>
              ))}
            </div>
          )}
          {rejim !== "toliq" && (
            <button
              type="button"
              onClick={onToliqYechimgaOtish}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
            >
              <Ikon nom="orin" olcham={16} />
              <span>To&apos;liq Master Yechimni Ko&apos;rish ➔</span>
            </button>
          )}
        </div>
      )}

      {/* ─── 6. BOSQICHMA-BOSQICH MASTER YECHIM (KaTeX) ─── */}
      {natija.bosqichlar?.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="orin" olcham={16} className="text-[var(--v3-urgu)]" />
            <span>Bosqichma-bosqich Ilmiy Yechim:</span>
          </span>
          <div className="space-y-3">
            {natija.bosqichlar.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-2 hover:border-[var(--v3-chiziq-2)] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[var(--v3-urgu)] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {b.raqam || i + 1}
                  </span>
                  <strong className="text-xs sm:text-sm font-bold text-[var(--v3-matn)]">
                    {b.sarlavha || `${i + 1}-Bosqich`}
                  </strong>
                </div>

                <div className="text-xs text-[var(--v3-matn)] leading-relaxed pl-8">
                  <LatexBoyMatn matn={b.tushuntirish || b.matn || ""} />
                </div>

                {b.formula && (
                  <div className="ml-8 p-3 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center text-xs sm:text-sm font-mono font-bold text-[var(--v3-urgu)] overflow-x-auto">
                    <LatexMatn matn={b.formula} inline={false} />
                  </div>
                )}

                {b.mantiq && (
                  <div className="ml-8 text-[11px] text-[var(--v3-xira)] italic">
                    💡 Mantiq: <LatexBoyMatn matn={b.mantiq} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 7. PEARSON DIAGONAL KRESTI (Agar mavjud bo'lsa) ─── */}
      {natija.krestSxemasi?.mavjud && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Ikon nom="atom" olcham={15} /> Pearson Diagonal Kresti Sxemasi:
          </span>
          <div className="p-4 rounded-xl bg-black/40 border border-indigo-800/40 flex items-center justify-center font-mono text-xs sm:text-sm text-white">
            <div className="grid grid-cols-3 gap-4 text-center items-center">
              <div className="space-y-4 font-bold text-amber-300">
                <div>{natija.krestSxemasi.w1}%</div>
                <div>{natija.krestSxemasi.w2}%</div>
              </div>
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400 font-extrabold text-white">
                {natija.krestSxemasi.wTarget}%
              </div>
              <div className="space-y-4 font-bold text-emerald-300">
                <div>{natija.krestSxemasi.qism1} qism</div>
                <div>{natija.krestSxemasi.qism2} qism</div>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-indigo-200 font-bold">
            Massa nisbati: {natija.krestSxemasi.nisbat}
          </div>
        </div>
      )}

      {/* ─── 8. YAKUNIY ANIQ JAVOB ─── */}
      {natija.yakuniyJavob && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border-2 border-emerald-500/50 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Ikon nom="tasdiq" olcham={16} /> Yakuniy Natija:
          </span>
          <h4 className="text-base sm:text-lg font-black text-white leading-relaxed">
            <LatexBoyMatn matn={natija.yakuniyJavob} />
          </h4>
        </div>
      )}

      {/* ─── 9. AI REPETITOR BILAN MULOQOT (Follow-up Chat) ─── */}
      <div className="pt-4 border-t border-[var(--v3-chiziq)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom="xabar" olcham={16} className="text-[var(--v3-urgu)]" />
            <span>AI Kimyo Repetitoridan Tushunmagan Qadamingizni So&apos;rang</span>
          </span>
        </div>

        {/* Xabarlar ro'yxati */}
        {chatXabarlar.length > 0 && (
          <div className="space-y-2.5 max-h-64 overflow-y-auto p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)]">
            {chatXabarlar.map((x, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  x.rol === "user"
                    ? "bg-[var(--v3-urgu)] text-white ml-6 font-semibold"
                    : "bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] mr-6"
                }`}
              >
                <span className="text-[10px] opacity-75 block mb-0.5 uppercase tracking-wider font-bold">
                  {x.rol === "user" ? "Sizning savolingiz:" : "👨‍🏫 AI Repetitor:"}
                </span>
                <div><LatexBoyMatn matn={x.matn} /></div>
              </div>
            ))}
            {chatYuklanmoqda && (
              <div className="p-3 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)] mr-6 animate-pulse">
                👨‍🏫 Repetitor tushuntirish yozmoqda...
              </div>
            )}
          </div>
        )}

        {/* Savol kiritish formasi */}
        <form onSubmit={handleChatYuborish} className="flex gap-2">
          <input
            type="text"
            value={chatSavol}
            onChange={(e) => setChatSavol(e.target.value)}
            placeholder="Masalan: 2-bosqichdagi proporsiyani nega bunday tuzdik? Yoki boshqa usuli bormi?"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] placeholder-[var(--v3-xira)] focus:outline-hidden focus:border-[var(--v3-urgu)] font-sans"
          />
          <button
            type="submit"
            disabled={!chatSavol.trim() || chatYuklanmoqda}
            className="px-5 py-2.5 rounded-2xl bg-[var(--v3-urgu)] hover:opacity-90 text-white text-xs font-bold shadow-md disabled:opacity-40 flex items-center gap-1.5 transition-all"
          >
            <Ikon nom="yubor" olcham={14} />
            <span>So&apos;rash</span>
          </button>
        </form>
      </div>
    </div>
  );
}
