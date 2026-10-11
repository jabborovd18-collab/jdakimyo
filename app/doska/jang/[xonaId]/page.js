// app/doska/jang/[xonaId]/page.js
//
// Smart Doska — O'quvchi telefoni interfeysi (Premium).
// Tarmoq uzilishiga chidamli, haptic tebranish, xatolar tahlili,
// anti-cheat va anti-AI himoyasi.
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Ikon from "@/components/Ikon";

const YANGILANISH_MS = 2000;
const SAVOL_VAQTI_SONIYA = 30; // Qat'iy 30 soniya qoidasi

export default function OquvchiJangSahifasi() {
  const params = useParams();
  const searchParams = useSearchParams();
  const xonaId = params.xonaId;
  const boshlangichJamoa = Number(searchParams.get("jamoa")) || 1;

  // Foydalanuvchi holatlari
  const [ism, setIsm] = useState("");
  const [jamoaId, setJamoaId] = useState(boshlangichJamoa);
  const [qatnashchiId, setQatnashchiId] = useState(null);
  const [holat, setHolat] = useState(null); // serverdan kelgan holat
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState("");
  const [tarmoqAloqasi, setTarmoqAloqasi] = useState(true);

  // Test ishlash holatlari
  const [joriyIndex, setJoriyIndex] = useState(0);
  const [qolganVaqt, setQolganVaqt] = useState(SAVOL_VAQTI_SONIYA);
  const [tanlangan, setTanlangan] = useState(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [tahlil, setTahlil] = useState(null);
  const [umumiySarflanganVaqt, setUmumiySarflanganVaqt] = useState(0);
  const [qoidaBuzildiXabari, setQoidaBuzildiXabari] = useState("");

  // LocalStorage dan qatnashchiId va joriyIndex ni tiklash
  useEffect(() => {
    if (typeof window !== "undefined" && xonaId) {
      const saqlanganId = localStorage.getItem(`doska_q_${xonaId}`);
      if (saqlanganId) setQatnashchiId(saqlanganId);

      const saqlanganIndex = localStorage.getItem(`doska_idx_${xonaId}`);
      if (saqlanganIndex) setJoriyIndex(Number(saqlanganIndex) || 0);
    }
  }, [xonaId]);

  // Joriy savol indeksini saqlash
  useEffect(() => {
    if (typeof window !== "undefined" && xonaId) {
      localStorage.setItem(`doska_idx_${xonaId}`, String(joriyIndex));
    }
  }, [joriyIndex, xonaId]);

  // ─── QATNASHCHI HOLATINI SO'RAB TURISH (POLLING) ───
  const yangilaOquvchi = useCallback(async () => {
    if (!xonaId || !qatnashchiId) return;
    try {
      const res = await fetch(`/api/doska/jang?xonaId=${xonaId}&qatnashchiId=${qatnashchiId}`);
      const d = await res.json();
      if (res.ok && d.holat) {
        setHolat(d.holat);
        setTarmoqAloqasi(true);
      } else if (res.status === 404) {
        // Sessiya serverda mavjud emas (muddati o'tgan yoki o'chirilgan)
        if (typeof window !== "undefined") {
          localStorage.removeItem(`doska_q_${xonaId}`);
          localStorage.removeItem(`doska_idx_${xonaId}`);
        }
        setQatnashchiId(null);
        setXato(d.error || "Xona sessiyasi muddati yakunlangan");
      }
    } catch {
      setTarmoqAloqasi(false);
    }
  }, [xonaId, qatnashchiId]);

  useEffect(() => {
    if (!qatnashchiId) return;
    yangilaOquvchi();
    const interval = setInterval(yangilaOquvchi, YANGILANISH_MS);
    return () => clearInterval(interval);
  }, [qatnashchiId, yangilaOquvchi]);

  // ─── TAYMER (HAR BIR SAVOLGA QAT'IY 30 SONIYA) ───
  useEffect(() => {
    if (holat?.holat !== "jang" || holat?.tugatdi) return;

    setQolganVaqt(SAVOL_VAQTI_SONIYA);
    setTanlangan(null);
    setQoidaBuzildiXabari("");

    const timer = setInterval(() => {
      setQolganVaqt((v) => {
        if (v <= 1) {
          // Vaqt tugaganda keyingi savolga o'tish
          setUmumiySarflanganVaqt((prev) => prev + SAVOL_VAQTI_SONIYA);
          setJoriyIndex((idx) => {
            if (holat?.savollar && idx + 1 < holat.savollar.length) {
              return idx + 1;
            }
            // Agar oxirgi savolda vaqt tugasa — testni to'liq yakunlash
            fetch("/api/doska/jang", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "oquvchiTugatdi",
                xonaId,
                qatnashchiId,
                sarflanganVaqtSoniya: umumiySarflanganVaqt + SAVOL_VAQTI_SONIYA,
              }),
            })
              .then(() => yangilaOquvchi())
              .catch(() => {});
            return idx;
          });
          return SAVOL_VAQTI_SONIYA;
        }
        return v - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [joriyIndex, holat?.holat, holat?.tugatdi, holat?.savollar, xonaId, qatnashchiId, yangilaOquvchi, umumiySarflanganVaqt]);

  // ─── JAMOA VA XONAGA QO'SHILISH ───
  const qoshil = async (e) => {
    e.preventDefault();
    if (!ism.trim()) {
      setXato("Iltimos, ism va familiyangizni yozing");
      return;
    }
    setYuklanmoqda(true);
    setXato("");

    try {
      const res = await fetch("/api/doska/jang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "qoshilish",
          xonaId,
          ism: ism.trim(),
          jamoaId,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Ulanishda xatolik");

      setQatnashchiId(d.qatnashchiId);
      localStorage.setItem(`doska_q_${xonaId}`, d.qatnashchiId);
      yangilaOquvchi();
    } catch (err) {
      setXato(err.message);
    } finally {
      setYuklanmoqda(false);
    }
  };

  // ─── SAVOLGA JAVOB BERISH ───
  const javobBer = useCallback(
    async (variantIndex, qoidaBuzildimi = false) => {
      if (tanlangan !== null || yuborilmoqda) return;
      const joriySavol = holat?.savollar?.[joriyIndex];
      if (!joriySavol) return;

      // Haptic tebranish (agar telefon qo'llab-quvvatlasa)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(qoidaBuzildimi ? [100, 50, 100] : 40);
      }

      const sarflangan = Math.min(SAVOL_VAQTI_SONIYA, Math.max(1, SAVOL_VAQTI_SONIYA - qolganVaqt));
      setUmumiySarflanganVaqt((prev) => prev + sarflangan);
      setTanlangan(variantIndex);
      setYuborilmoqda(true);

      try {
        await fetch("/api/doska/jang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "javob",
            xonaId,
            qatnashchiId,
            savolId: joriySavol.id,
            tanlanganIndex: qoidaBuzildimi ? -1 : variantIndex,
            sarflanganVaqtSoniya: sarflangan,
            qoidaBuzildi: qoidaBuzildimi,
          }),
        });

        // 600 ms "Qabul qilindi" deb turib, keyingi savolga o'tadi
        setTimeout(() => {
          if (joriyIndex + 1 < (holat?.savollar?.length || 0)) {
            setJoriyIndex((i) => i + 1);
          } else {
            // Oxirgi savolga ham javob berildi — testni yakunlash
            fetch("/api/doska/jang", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "oquvchiTugatdi",
                xonaId,
                qatnashchiId,
                sarflanganVaqtSoniya: umumiySarflanganVaqt + sarflangan,
              }),
            })
              .then(() => yangilaOquvchi())
              .catch(() => {});
          }
          setTanlangan(null);
          setYuborilmoqda(false);
        }, 600);
      } catch {
        setYuborilmoqda(false);
      }
    },
    [tanlangan, yuborilmoqda, holat?.savollar, joriyIndex, qolganVaqt, umumiySarflanganVaqt, xonaId, qatnashchiId, yangilaOquvchi]
  );

  // ─── ANTI-CHEAT & ANTI-CHATGPT HIMOYA TIZIMI (QOIDA 1) ───
  // Agar o'quvchi boshqa ilovaga o'tsa yoki skrinshot olsa: savol 0 ball bilan bekor qilinadi
  useEffect(() => {
    if (holat?.holat !== "jang" || holat?.tugatdi || tanlangan !== null || yuborilmoqda) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setQoidaBuzildiXabari("⚠️ Qoida buzilishi: Ilovadan chiqish yoki ChatGPTga o'tish taqiqlangan! Savol 0 ball bilan bekor qilindi.");
        javobBer(-1, true);
      }
    };

    const handleBlur = () => {
      setQoidaBuzildiXabari("⚠️ Qoida buzilishi: Ekranni almashtirish aniqlandi! Joriy savol 0 ball bilan bekor qilindi.");
      javobBer(-1, true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [holat?.holat, holat?.tugatdi, tanlangan, yuborilmoqda, javobBer]);

  // ─── TAHLILNI OLISH (TEST TUGAGACH) ───
  const tahlilniYukla = async () => {
    try {
      const res = await fetch(`/api/doska/jang?xonaId=${xonaId}&qatnashchiId=${qatnashchiId}&action=tahlil`);
      const d = await res.json();
      if (res.ok && d.tahlil) setTahlil(d.tahlil);
    } catch (e) {
      alert("Tahlilni yuklashda xato: " + e.message);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 1. ISHGA TUSHISH SHAKLI (ISM VA JAMOA KIRITISH)
  // ═══════════════════════════════════════════════════════════════════════
  if (!qatnashchiId) {
    return (
      <main className="min-h-[100dvh] p-4 sm:p-6 flex items-center justify-center bg-[#070b14] text-white select-none touch-manipulation overflow-y-auto py-8">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
          <div className="text-center mb-6">
            <span className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 inline-flex items-center justify-center mb-3">
              <Ikon nom="kolba" olcham={32} className="text-emerald-400" />
            </span>
            <h1 className="text-2xl font-black text-white">Smart Doska Jangi</h1>
            <p className="text-xs text-slate-400 mt-1">
              Xona kodi: <span className="font-mono text-emerald-400 font-bold">{xonaId}</span>
            </p>
          </div>

          {xato && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
              {xato}
            </div>
          )}

          <form onSubmit={qoshil} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Ism va Familiyangiz:
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={ism}
                onChange={(e) => setIsm(e.target.value)}
                placeholder="Masalan: Sardor Aliyev"
                autoComplete="name"
                autoCapitalize="words"
                spellCheck={false}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Jamoangizni tasdiqlang:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {[
                  { id: 1, nom: "Kationlar", rang: "emerald", hex: "#10b981" },
                  { id: 2, nom: "Anionlar", rang: "sky", hex: "#0284c7" },
                  { id: 3, nom: "Radikallar", rang: "amber", hex: "#f59e0b" },
                  { id: 4, nom: "Komplekslar", rang: "rose", hex: "#f43f5e" },
                ].map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => setJamoaId(j.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
                      jamoaId === j.id
                        ? "bg-slate-800 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: j.hex }} />
                      <span className="text-[10px] text-slate-400 font-mono">{j.id}-jamoa</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate">{j.nom}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={yuklanmoqda}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {yuklanmoqda ? (
                <span>Ulanmoqda...</span>
              ) : (
                <>
                  <span>Jamoaga Qo&apos;shilish</span>
                  <Ikon nom="chaqmoq" olcham={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. CHETLATILGAN HOLAT (AGAR USTOZ CHETLATGAN BO'LSA)
  // ═══════════════════════════════════════════════════════════════════════
  if (holat?.chetlatildi) {
    return (
      <main className="min-h-[100dvh] p-6 flex items-center justify-center bg-[#070b14] text-white text-center select-none touch-manipulation">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400">
            <Ikon nom="taqiq" olcham={32} />
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Musobaqadan chetlatildingiz</h2>
          <p className="text-sm text-slate-300 mb-6">
            O&apos;qituvchi tomonidan hisobingiz musobaqadan chiqarildi.
          </p>
          <Link href="/doska" className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition">
            Doskaga qaytish
          </Link>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. KUTISH ZALI (LOBBY): USTOZ START BERISHINI KUTISH
  // ═══════════════════════════════════════════════════════════════════════
  if (holat?.holat === "lobby") {
    return (
      <main className="min-h-[100dvh] p-4 sm:p-6 flex flex-col items-center justify-center bg-[#070b14] text-white text-center select-none touch-manipulation">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Ikon nom="vaqt" olcham={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-1">
            Xush kelibsiz, {holat?.ism}!
          </h2>
          <div className="inline-block px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold mb-6">
            Jamoangiz: {holat?.jamoaNomi}
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Siz muvaffaqiyatli ulandingiz! Ustoz katta doskada <b>&quot;BOSHLASH&quot;</b> tugmasini bosishi bilan test hammaga bir vaqtda boshlanadi.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Telefoningizni o&apos;chirmang, tayyor turing...
          </div>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. TEST TUGAGAN YOKI XONA YAKUNLANGAN HOLAT
  // ═══════════════════════════════════════════════════════════════════════
  if (holat?.tugatdi || holat?.holat === "yakunlandi") {
    return (
      <main className="min-h-[100dvh] p-4 sm:p-6 max-w-xl mx-auto flex flex-col justify-center bg-[#070b14] text-white select-none touch-manipulation py-8">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Ikon nom="kubok" olcham={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-1">
            Test yakunlandi!
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            {holat?.ism} • {holat?.jamoaNomi}
          </p>

          <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 mb-6">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              To&apos;plangan shaxsiy ball:
            </div>
            <div className="text-5xl font-black font-mono text-white">
              {holat?.ball} <span className="text-base font-normal text-slate-400">ball</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sarflangan vaqt:</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {holat?.sarflanganVaqtSoniya || umumiySarflanganVaqt} soniya
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Qoidabuzarlik:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {holat?.qoidabuzarliklar || 0} ta
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 mt-3 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/60">
              ⏱️ <b>Nizom:</b> Ballar teng bo&apos;lsa, kamroq vaqt sarflagan jamoa yuqori o&apos;rinni egallaydi!
            </div>
          </div>

          {/* TAHLIL TUGMASI (AGAR XONA YAKUNLANGAN BO'LSA) */}
          {holat?.holat === "yakunlandi" ? (
            <div>
              {!tahlil ? (
                <button
                  onClick={tahlilniYukla}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Ikon nom="kitob" olcham={18} />
                  <span>Xatolar ustida ishlash (Tahlilni ko&apos;rish)</span>
                </button>
              ) : (
                <div className="text-left space-y-4 mt-6">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    Barcha 20 ta savol tahlili:
                  </h4>
                  <div className="space-y-3 max-h-[60dvh] sm:max-h-96 overflow-y-auto overscroll-contain pr-1">
                    {tahlil.map((t) => (
                      <div
                        key={t.id}
                        className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                          t.togriTopdimi
                            ? "bg-emerald-950/30 border-emerald-500/50"
                            : "bg-red-950/30 border-red-500/50"
                        }`}
                      >
                        <div className="font-bold text-white mb-2 text-sm">
                          {t.tartibRaqam}. {t.savol}
                        </div>
                        <div className="space-y-1.5 mb-2">
                          <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                            <Ikon nom="tasdiq" olcham={14} className="shrink-0 text-emerald-400" />
                            <span>To&apos;g&apos;ri javob: <b>{t.variantlar[t.togriIndex]}</b></span>
                          </div>
                          {!t.togriTopdimi && t.tanlanganIndex !== null && (
                            <div className="flex items-center gap-1.5 text-red-300 font-medium">
                              <Ikon nom="yopish" olcham={14} className="shrink-0 text-red-400" />
                              <span>Siz tanlagan javob: <b>{t.variantlar[t.tanlanganIndex]}</b></span>
                            </div>
                          )}
                        </div>
                        {t.izoh && (
                          <div className="flex items-start gap-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                            <Ikon nom="nurlar" olcham={13} className="shrink-0 text-amber-400 mt-0.5" />
                            <span>Izoh: {t.izoh} (Slayd: {t.slayd})</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Boshqa o&apos;rtoqlaringiz hali yechishmoqda. Ustoz katta doskada musobaqani yakunlashi bilan to&apos;liq tahlil va to&apos;g&apos;ri javoblar ochiladi!
            </div>
          )}
        </div>
      </main>
    );
  }
  // ═══════════════════════════════════════════════════════════════════════
  // 5. FAOL JANG HOLATI: TEST ISHLASH EKRANI (ANTI-CHEAT & ANTI-AI)
  // ═══════════════════════════════════════════════════════════════════════
  const savollar = holat?.savollar || [];
  const joriySavol = savollar[joriyIndex];

  if (!joriySavol) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-[#070b14] text-white select-none">
        <div className="text-slate-400 text-sm animate-pulse">Savollar yuklanmoqda...</div>
      </main>
    );
  }

  const vaqtFoizi = (qolganVaqt / SAVOL_VAQTI_SONIYA) * 100;

  return (
    <main
      className="min-h-[100dvh] p-3.5 sm:p-6 max-w-xl mx-auto flex flex-col justify-between bg-[#070b14] text-white select-none touch-manipulation pb-8"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* YUQORI KO'RSATKICHLAR */}
      <div>
        {!tarmoqAloqasi && (
          <div className="mb-3 py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] text-center font-bold flex items-center justify-center gap-1.5">
            <Ikon nom="ogohlantirish" olcham={14} className="shrink-0" />
            <span>Tarmoq aloqasi tiklanmoqda... Javoblaringiz saqlanmoqda</span>
          </div>
        )}

        {qoidaBuzildiXabari && (
          <div className="mb-3 py-2 px-3.5 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs text-center font-bold animate-pulse flex items-center justify-center gap-2">
            <Ikon nom="ogohlantirish" olcham={16} className="shrink-0 text-red-400" />
            <span>{qoidaBuzildiXabari}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
              {joriyIndex + 1} / {savollar.length}
            </span>
            <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {joriySavol.daraja}-daraja ({joriySavol.daraja === 1 ? "+5" : joriySavol.daraja === 2 ? "+10" : "+15"} b)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 truncate max-w-[120px]">{holat?.jamoaNomi}</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">
              {holat?.ball} b.
            </span>
          </div>
        </div>

        {/* VAQT TAYMER CHIZIG'I */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 sm:h-2 mb-4 sm:mb-6 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              qolganVaqt <= 10 ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            }`}
            style={{ width: `${vaqtFoizi}%` }}
          />
        </div>

        {/* SAVOL MATNI */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl mb-3.5 sm:mb-5">
          <h3 className="text-base sm:text-xl font-bold text-white leading-snug break-words">
            {joriySavol.savol}
          </h3>
        </div>

        {/* VARIANTLAR (KATTA TOUCH TUGMALAR) */}
        <div className="space-y-2.5 sm:space-y-3">
          {joriySavol.variantlar.map((vMatn, idx) => {
            const tanlandi = tanlangan === idx;
            return (
              <button
                key={idx}
                onClick={() => javobBer(idx)}
                disabled={tanlangan !== null}
                className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all active:scale-[0.98] ${
                  tanlandi
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-xl ring-2 ring-emerald-300"
                    : "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-800 flex items-center justify-center text-xs sm:text-sm font-mono font-bold text-slate-300 shrink-0 select-none">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base font-semibold leading-snug break-words flex-1 pt-0.5">
                    {vMatn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* JAVOB QABUL QILINDI BILDIRISHNOMASI */}
        {tanlangan !== null && (
          <div className="mt-4 p-3 rounded-xl sm:rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-center text-xs font-bold animate-pulse flex items-center justify-center gap-1.5">
            <Ikon nom="tasdiq" olcham={16} className="shrink-0 text-emerald-400" />
            <span>Javobingiz qabul qilindi! Keyingi savolga o&apos;tilmoqda...</span>
          </div>
        )}
      </div>

      {/* PASTKI ESLATMA */}
      <footer className="pt-4 sm:pt-6 text-center text-[11px] text-slate-500">
        JDA Kimyo • Smart Doska Jangi
      </footer>
    </main>
  );
}
