// app/doska/jang/[xonaId]/page.js
//
// Smart Doska — O'quvchi telefoni interfeysi (Premium).
// Tarmoq uzilishiga chidamli, haptic tebranish, xatolar tahlili,
// anti-cheat va anti-AI himoyasi.
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import LatexMatn from "@/components/LatexMatn";
import Ikon from "@/components/Ikon";

const YANGILANISH_MS = 2000;
const SAVOL_VAQTI_SONIYA = 30; // Qat'iy 30 soniya qoidasi

export default function OquvchiJangSahifasi() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const xonaId = params.xonaId;
  const boshlangichJamoa = Number(searchParams.get("jamoa")) || 1;

  // Foydalanuvchi holatlari
  const [ism, setIsm] = useState("");
  const [jamoaId, setJamoaId] = useState(boshlangichJamoa);
  const [qatnashchiId, setQatnashchiId] = useState(null);
  const [holat, setHolat] = useState(null); // serverdan kelgan holat
  const [xonaInfo, setXonaInfo] = useState(null); // qo'shilishdan oldin xona ma'lumotlari
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState("");
  const [tarmoqAloqasi, setTarmoqAloqasi] = useState(true);

  // Qo'shilishdan oldin xona ma'lumotlarini (jamoalar va holat) olib turish
  useEffect(() => {
    if (!xonaId || qatnashchiId) return;
    let bekor = false;
    const yuklaXonaInfo = async () => {
      try {
        const res = await fetch(`/api/doska/jang?xonaId=${xonaId}`);
        const d = await res.json();
        if (!bekor) {
          if (res.ok && d.holat) {
            setXonaInfo(d.holat);
          } else if (res.status === 404) {
            setXato(d.error || "Bunday xona topilmadi yoki muddati o'tgan");
          }
        }
      } catch {
        // tarmoq xatosi
      }
    };
    yuklaXonaInfo();
    const interval = setInterval(yuklaXonaInfo, YANGILANISH_MS);
    return () => {
      bekor = true;
      clearInterval(interval);
    };
  }, [xonaId, qatnashchiId]);

  // Jamoa ID sini xona sozlamalariga moslashtirish
  useEffect(() => {
    if (xonaInfo?.jamoalar && xonaInfo.jamoalar.length > 0) {
      const mavjud = xonaInfo.jamoalar.some((j) => j.id === jamoaId);
      if (!mavjud) {
        setJamoaId(xonaInfo.jamoalar[0].id);
      }
    }
  }, [xonaInfo, jamoaId]);

  // Xonadan chiqish (boshqa PIN kiritish yoki qayta ulanish uchun)
  const xonadanChiqish = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`doska_q_${xonaId}`);
      localStorage.removeItem(`doska_idx_${xonaId}`);
    }
    setQatnashchiId(null);
    setHolat(null);
    setTahlil(null);
    router.push("/doska/join");
  };

  // Test ishlash holatlari
  const [joriyIndex, setJoriyIndex] = useState(0);
  const [qolganVaqt, setQolganVaqt] = useState(SAVOL_VAQTI_SONIYA);
  const [tanlangan, setTanlangan] = useState(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [tahlil, setTahlil] = useState(null);
  const [tahlilFilter, setTahlilFilter] = useState("barchasi"); // "barchasi" | "xato" | "togri"
  const [umumiySarflanganVaqt, setUmumiySarflanganVaqt] = useState(0);
  const [qoidaBuzildiXabari, setQoidaBuzildiXabari] = useState("");

  const qolganVaqtRef = useRef(SAVOL_VAQTI_SONIYA);
  qolganVaqtRef.current = qolganVaqt;

  const umumiySarflanganVaqtRef = useRef(0);
  umumiySarflanganVaqtRef.current = umumiySarflanganVaqt;

  const joriyIndexRef = useRef(0);
  joriyIndexRef.current = joriyIndex;

  // TAYMER BARQARORLIGI (K2): javobBer polling bilan qayta YARATILMASLIGI uchun
  // holat ref orqali o'qiladi. Avval javobBer holat.savollar ga bog'langan edi —
  // har 2 soniyadagi polling yangi massiv olib kelib taymer effect'ni qayta
  // ishga tushirar va taymer 30 ga reset bo'lardi (o'quvchilar cheksiz vaqt olardi).
  const holatRef = useRef(null);
  holatRef.current = holat;
  const tanlanganRef = useRef(null);
  tanlanganRef.current = tanlangan;
  const yuborilmoqdaRef = useRef(false);
  yuborilmoqdaRef.current = yuborilmoqda;
  const javobBerRef = useRef(null);

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
        // Agar o'quvchi sahifani yangilagan bo'lsa va joriy savolga allaqachon javob berilgan bo'lsa,
        // avtomatik birinchi yechilmagan savolga o'tkazish:
        if (d.holat.savollar && d.holat.belgilanganJavoblar && !d.holat.tugatdi) {
          const firstUnanswered = d.holat.savollar.findIndex(
            (s) => d.holat.belgilanganJavoblar[s.id] === undefined
          );
          if (firstUnanswered !== -1 && firstUnanswered > joriyIndexRef.current) {
            setJoriyIndex(firstUnanswered);
          }
        }
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

  // ─── SAVOLGA JAVOB BERISH ───
  // Barqaror callback: holat ref'dan o'qiladi, shuning uchun polling kelishi
  // funksiyani qayta yaratmaydi va taymer reset bo'lmaydi (K2).
  const javobBer = useCallback(
    async (variantIndex, qoidaBuzildimi = false) => {
      if (tanlanganRef.current !== null || yuborilmoqdaRef.current) return;
      const savollarList = holatRef.current?.savollar || [];
      const currentIdx = joriyIndexRef.current;
      const joriySavol = savollarList[currentIdx];
      if (!joriySavol) return;

      // Haptic tebranish (agar telefon qo'llab-quvvatlasa)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(qoidaBuzildimi ? [100, 50, 100] : 40);
      }

      const qolgan = qolganVaqtRef.current;
      const sarflangan = Math.min(SAVOL_VAQTI_SONIYA, Math.max(1, SAVOL_VAQTI_SONIYA - qolgan));
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
          if (currentIdx + 1 < savollarList.length) {
            setJoriyIndex(currentIdx + 1);
          } else {
            // Oxirgi savolga ham javob berildi — testni yakunlash
            fetch("/api/doska/jang", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "oquvchiTugatdi",
                xonaId,
                qatnashchiId,
                sarflanganVaqtSoniya: umumiySarflanganVaqtRef.current + sarflangan,
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
    [xonaId, qatnashchiId, yangilaOquvchi]
  );
  javobBerRef.current = javobBer;

  // ─── TAYMER (HAR BIR SAVOLGA QAT'IY 30 SONIYA) ───
  // Bog'liqlikda javobBer YO'Q (ref orqali chaqiriladi): polling kelishi
  // taymerni qayta ishga tushirmaydi — 30 soniya chinakam tugaydi (K2).
  useEffect(() => {
    if (holat?.holat !== "jang" || holat?.tugatdi) return;

    setQolganVaqt(SAVOL_VAQTI_SONIYA);
    setTanlangan(null);
    setQoidaBuzildiXabari("");

    const timer = setInterval(() => {
      setQolganVaqt((v) => {
        if (v <= 1) {
          clearInterval(timer);
          // Vaqt tugaganda javob berilmagan deb (-1) keyingi savolga o'tish
          if (javobBerRef.current) javobBerRef.current(-1, false);
          return 0;
        }
        return v - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [joriyIndex, holat?.holat, holat?.tugatdi]);

  // ─── ANTI-CHEAT & ANTI-CHATGPT HIMOYA TIZIMI (QOIDA 1) ───
  // Faqat o'quvchi boshqa ilovaga yoki boshqa tabga o'tsagina (visibilityState === "hidden") ishlaydi.
  // Mobil ekranga teginish, skroll yoki bildirishnomalarda ASLO noo'rin ishlamaydi (blur olib tashlandi).
  useEffect(() => {
    if (holat?.holat !== "jang" || holat?.tugatdi || tanlangan !== null || yuborilmoqda) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setQoidaBuzildiXabari("⚠️ Qoida buzilishi: Ilovadan chiqish yoki ChatGPTga o'tish taqiqlangan! Savol 0 ball bilan bekor qilindi.");
        if (javobBerRef.current) javobBerRef.current(-1, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [holat?.holat, holat?.tugatdi, tanlangan, yuborilmoqda]);

  // ─── TAHLILNI OLISH (TEST TUGAGACH) ───
  const tahlilniYukla = useCallback(async () => {
    if (!xonaId || !qatnashchiId) return;
    try {
      const res = await fetch(`/api/doska/jang?xonaId=${xonaId}&qatnashchiId=${qatnashchiId}&action=tahlil`);
      const d = await res.json();
      if (res.ok && d.tahlil) setTahlil(d.tahlil);
    } catch (e) {
      alert("Tahlilni yuklashda xato: " + e.message);
    }
  }, [xonaId, qatnashchiId]);

  // Ustoz doskada musobaqani yakunlashi bilan tahlilni avtomatik yuklab olish
  useEffect(() => {
    if (holat?.holat === "yakunlandi" && !tahlil && qatnashchiId) {
      tahlilniYukla();
    }
  }, [holat?.holat, tahlil, qatnashchiId, tahlilniYukla]);

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

  // ═══════════════════════════════════════════════════════════════════════
  // 1. ISHGA TUSHISH SHAKLI (ISM VA JAMOA KIRITISH)
  // ═══════════════════════════════════════════════════════════════════════
  if (!qatnashchiId) {
    const aktivJamoalar =
      xonaInfo?.jamoalar && xonaInfo.jamoalar.length > 0
        ? xonaInfo.jamoalar
        : [
            { id: 1, nom: "Kationlar", rang: "emerald", hex: "#10b981", azolariSoni: 0 },
            { id: 2, nom: "Anionlar", rang: "sky", hex: "#0284c7", azolariSoni: 0 },
          ];

    const jangBoshlangan = xonaInfo?.holat === "jang";
    const xonaYakunlangan = xonaInfo?.holat === "yakunlandi";

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
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
              {xato}
            </div>
          )}

          {jangBoshlangan && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-200 text-xs text-center font-semibold">
              ⚠️ Musobaqa allaqachon boshlangan! Kechikkan ishtirokchilar qabul qilinmaydi.
            </div>
          )}

          {xonaYakunlangan && (
            <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs text-center font-semibold">
              🏁 Ushbu musobaqa yakunlangan.
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
                disabled={jangBoshlangan || xonaYakunlangan}
                maxLength={30}
                value={ism}
                onChange={(e) => setIsm(e.target.value)}
                placeholder="Masalan: Sardor Aliyev"
                autoComplete="name"
                autoCapitalize="words"
                spellCheck={false}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Jamoangizni tasdiqlang:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {aktivJamoalar.length} ta jamoa
                </span>
              </div>

              <div className={`grid ${aktivJamoalar.length === 2 ? "grid-cols-2" : "grid-cols-2"} gap-2 sm:gap-2.5`}>
                {aktivJamoalar.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    disabled={jangBoshlangan || xonaYakunlangan}
                    onClick={() => setJamoaId(j.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition disabled:opacity-50 ${
                      jamoaId === j.id
                        ? "bg-slate-800 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: j.hex }} />
                        <span className="text-[10px] text-slate-400 font-mono">{j.id}-jamoa</span>
                      </div>
                      {typeof j.azolariSoni === "number" && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {j.azolariSoni} o&apos;quvchi
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate" style={{ color: jamoaId === j.id ? "#34d399" : undefined }}>
                      {j.nom}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={yuklanmoqda || jangBoshlangan || xonaYakunlangan}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/doska/join"
              className="text-xs text-slate-400 hover:text-emerald-400 transition inline-flex items-center gap-1.5"
            >
              <Ikon nom="chap" olcham={13} />
              <span>Boshqa xona PIN kodini kiritish</span>
            </Link>
          </div>
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
    const jamoalarRoyxati = [...(holat?.jamoalar || [])].sort((a, b) => (b.ball || 0) - (a.ball || 0));
    const engKattaBall = Math.max(1, ...jamoalarRoyxati.map((j) => j.ball || 0));
    const jamiSavollar = holat?.jamiSavollarSoni || 20;
    const togriSoni = holat?.togriSoni || 0;
    const notogriSoni = holat?.notogriSoni || 0;
    const aniqlikFoizi = jamiSavollar > 0 ? Math.round((togriSoni / jamiSavollar) * 100) : 0;
    const xonaYakunlangan = holat?.holat === "yakunlandi";

    const korsatiladiganTahlil = (tahlil || []).filter((t) => {
      if (tahlilFilter === "xato") return !t.togriTopdimi;
      if (tahlilFilter === "togri") return t.togriTopdimi;
      return true;
    });

    const xatolarSoni = (tahlil || []).filter((t) => !t.togriTopdimi).length;
    const togrilarSoni = (tahlil || []).filter((t) => t.togriTopdimi).length;

    return (
      <main className="min-h-[100dvh] p-4 sm:p-6 max-w-xl mx-auto flex flex-col justify-between bg-[#070b14] text-white select-none touch-manipulation py-6 space-y-6">
        <div className="space-y-5">
          {/* ═══ 1. SARLAVHA VA ISHTIROKCHI KARTASI ═══ */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-lg shadow-amber-950/40">
              <Ikon nom="kubok" olcham={32} />
            </div>

            <h2 className="text-2xl font-black text-white mb-1">
              {xonaYakunlangan ? "Musobaqa Yakunlandi!" : "Testni Yakunladingiz!"}
            </h2>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`text-[11px] px-3 py-1 rounded-full font-bold border ${
                xonaYakunlangan
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
              }`}>
                {xonaYakunlangan ? "🏁 Yakuniy natijalar" : "⏳ Doskada jang davom etmoqda"}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <b className="text-white text-sm">{holat?.ism}</b> • <span className="text-emerald-400 font-semibold">{holat?.jamoaNomi}</span>
            </p>
          </div>

          {/* ═══ 2. SHAXSIY NATIJA VA KO'RSATKICHLAR (4 TA METRIKA) ═══ */}
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                To&apos;plangan shaxsiy ball:
              </div>
              <div className="text-5xl font-black font-mono text-white flex items-baseline justify-center gap-2">
                <span>{holat?.ball}</span>
                <span className="text-base font-normal text-slate-400">ball</span>
              </div>
            </div>

            {/* 4 talik to'r (Natijalar) */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">To&apos;g&apos;ri / Noto&apos;g&apos;ri:</span>
                <div className="mt-1">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {togriSoni} ta
                  </span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="font-mono font-bold text-red-400 text-sm">
                    {notogriSoni} ta
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                  {aniqlikFoizi}% aniqlik
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sarflangan vaqt:</span>
                <div className="font-mono font-bold text-sky-400 text-base mt-1">
                  {holat?.sarflanganVaqtSoniya || umumiySarflanganVaqt} soniya
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                  {jamiSavollar} ta savol
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Halollik nazorati:</span>
                <div className="mt-1 font-semibold">
                  {(holat?.qoidabuzarliklar || 0) === 0 ? (
                    <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                      <Ikon nom="tasdiq" olcham={12} className="text-emerald-400" />
                      Halol ishtirokchi
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs font-bold">
                      ⚠️ {holat?.qoidabuzarliklar} ta qoidabuzarlik
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Ilovadan chiqishlar
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vaqt ustunligi:</span>
                <div className="text-[11px] text-slate-300 font-bold mt-1">
                  ⚖️ Nizom qoidasi
                </div>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">
                  Teng ballarda vaqt hal qiladi
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 mt-3.5 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/60 flex items-start gap-2">
              <span className="text-sm shrink-0">⏱️</span>
              <span><b>Nizom:</b> Agar jamoalar yoki o&apos;quvchilar ballari teng kelgan taqdirda, kamroq vaqt sarflagani yuqori o&apos;ringa chiqadi.</span>
            </div>
          </div>

          {/* ═══ 3. JONLI JAMOALAR POYGASINI KUZATISH (MINI-KOLBALAR) ═══ */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Ikon nom="kolba" olcham={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Jamoalar poygasi (Jonli kolbalar)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {xonaYakunlangan ? "Yakuniy" : "Jonli"}
              </span>
            </div>

            <div className="space-y-2.5">
              {jamoalarRoyxati.map((j, idx) => {
                const ozi = j.id === holat?.jamoaId;
                const foiz = Math.min(100, Math.round(((j.ball || 0) / engKattaBall) * 100));

                return (
                  <div
                    key={j.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      ozi
                        ? "bg-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30"
                        : "bg-slate-950/60 border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white">
                          {j.nom}
                        </span>
                        {ozi && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                            Sizning jamoangiz
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-right">
                        <span className="text-emerald-400 font-bold text-sm">{j.ball || 0}</span>
                        <span className="text-slate-400 text-[10px] ml-1">ball ({j.suyuqlikMl || j.ball || 0} ml)</span>
                      </div>
                    </div>

                    {/* Mini suyuqlik chizig'i */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/50">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${foiz}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ 4. XATOLAR USTIDA ISHLASH VA TAHLIL (2-BOSQICHLI TIZIM) ═══ */}
          {!xonaYakunlangan ? (
            /* 1-BOSQICH: DOSKADA JANG TUGAGUNCHA XAVFSIZ KUTISH */
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
                <Ikon nom="qulf" olcham={22} />
              </div>
              <h4 className="text-sm font-bold text-white">
                To&apos;g&apos;ri javoblar va tahlil vaqtincha yopiq
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Boshqa ishtirokchilar hali testni yechishmoqda. Halol raqobatni saqlash maqsadida, ustoz katta doskada musobaqani yakunlashi bilan barcha 20 ta savolning <b>to&apos;g&apos;ri javoblari</b> va <b>darslik slaydlari bo&apos;yicha tahlili</b> ushbu ekranda avtomatik ochiladi!
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5 font-medium">
                <Ikon nom="vaqt" olcham={13} className="text-emerald-400 animate-spin" />
                <span>Sahifani yangilash shart emas — avtomatik ochiladi</span>
              </div>
            </div>
          ) : (
            /* 2-BOSQICH: MUSOBAQA YAKUNLANGANDA OCHILADIGAN TO'LIQ TAHLIL */
            <div className="space-y-4">
              {!tahlil ? (
                <button
                  onClick={tahlilniYukla}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Ikon nom="kitob" olcham={18} />
                  <span>Xatolar ustida ishlash (Tahlilni ko&apos;rish)</span>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Filtrlash tugmalari */}
                  <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <button
                      onClick={() => setTahlilFilter("barchasi")}
                      className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition ${
                        tahlilFilter === "barchasi"
                          ? "bg-slate-800 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Barchasi ({tahlil.length})
                    </button>
                    <button
                      onClick={() => setTahlilFilter("xato")}
                      className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        tahlilFilter === "xato"
                          ? "bg-red-950/80 text-red-300 border border-red-500/40 shadow"
                          : "text-slate-400 hover:text-red-300"
                      }`}
                    >
                      <span>Xatolarim</span>
                      <span className="font-mono px-1.5 py-0.2 rounded-full bg-red-900/60 text-[10px]">
                        {xatolarSoni}
                      </span>
                    </button>
                    <button
                      onClick={() => setTahlilFilter("togri")}
                      className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        tahlilFilter === "togri"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow"
                          : "text-slate-400 hover:text-emerald-300"
                      }`}
                    >
                      <span>To&apos;g&apos;ri</span>
                      <span className="font-mono px-1.5 py-0.2 rounded-full bg-emerald-900/60 text-[10px]">
                        {togrilarSoni}
                      </span>
                    </button>
                  </div>

                  {/* Savollar ro'yxati */}
                  <div className="space-y-3.5 max-h-[65dvh] overflow-y-auto overscroll-contain pr-1">
                    {korsatiladiganTahlil.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/60 rounded-2xl border border-slate-800">
                        Tanlangan filtr bo&apos;yicha savollar yo&apos;q
                      </div>
                    ) : (
                      korsatiladiganTahlil.map((t) => {
                        const sizTanlagan =
                          t.tanlanganIndex !== null && t.tanlanganIndex >= 0
                            ? t.variantlar[t.tanlanganIndex]
                            : "Javob belgilanmadi / Vaqt tugadi";
                        const togriJavob = t.variantlar[t.togriIndex];

                        return (
                          <div
                            key={t.id}
                            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2.5 ${
                              t.togriTopdimi
                                ? "bg-emerald-950/30 border-emerald-500/40"
                                : "bg-red-950/30 border-red-500/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-white text-sm">
                                {t.tartibRaqam}. <LatexMatn matn={t.savol} inline />
                              </span>
                              <span
                                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  t.togriTopdimi
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-red-500/20 text-red-300 border-red-500/40"
                                }`}
                              >
                                {t.togriTopdimi ? `+${t.ball} ball` : "0 ball"}
                              </span>
                            </div>

                            <div className="space-y-1.5 pt-1">
                              {/* To'g'ri javob */}
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
                                <Ikon nom="tasdiq" olcham={14} className="shrink-0 text-emerald-400" />
                                <span>To&apos;g&apos;ri javob: <b><LatexMatn matn={togriJavob} inline /></b></span>
                              </div>

                              {/* Agar noto'g'ri bo'lsa, tanlangan javob */}
                              {!t.togriTopdimi && (
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300">
                                  <Ikon nom="yopish" olcham={14} className="shrink-0 text-red-400" />
                                  <span>Siz tanlagan javob: <b><LatexMatn matn={sizTanlagan} inline /></b></span>
                                </div>
                              )}
                            </div>

                            {/* Darslik slaydi va izohi */}
                            {t.izoh && (
                              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                                  <Ikon nom="nurlar" olcham={13} />
                                  <span>Tushuntirish (Izoh):</span>
                                </div>
                                <div className="text-slate-300 leading-normal pl-4">
                                  <LatexMatn matn={t.izoh} inline />
                                </div>
                                {t.slayd && (
                                  <div className="pl-4 text-[10px] text-sky-400 font-mono font-medium">
                                    📖 Darslikdagi tegishli mavzu: Slayd #{t.slayd}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHIQISH VA YANGI O'YIN TUGMASI */}
          <div className="pt-2">
            <button
              onClick={xonadanChiqish}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Ikon nom="chap" olcham={14} />
              <span>Yangi xonaga ulanish / Chiqish</span>
            </button>
          </div>
        </div>

        {/* PASTKI ESLATMA */}
        <footer className="pt-4 text-center text-[11px] text-slate-500">
          JDA Kimyo • Smart Doska Jangi
        </footer>
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

        {/* VAQT TAYMERI VA RAQAMLI HISOBGICH */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 px-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Ikon nom="vaqt" olcham={13} className={qolganVaqt <= 8 ? "text-red-400 animate-spin" : "text-emerald-400"} />
              <span>Savol taymeri:</span>
            </span>
            <span className={`font-bold text-xs ${qolganVaqt <= 8 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
              {qolganVaqt} soniya <span className="text-slate-400 font-normal text-[10px]">(har bir savolga 30s)</span>
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                qolganVaqt <= 8 ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-emerald-500 to-teal-400"
              }`}
              style={{ width: `${vaqtFoizi}%` }}
            />
          </div>
        </div>

        {/* 20 TA SAVOLNING VISUAL INDIKATORLARI (PROGRES PANEL) */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 mb-4">
          {savollar.map((s, idx) => {
            const javobBerildi = holat?.belgilanganJavoblar && holat.belgilanganJavoblar[s.id] !== undefined;
            const faol = idx === joriyIndex;
            return (
              <div
                key={s.id || idx}
                className={`h-2 sm:h-2.5 rounded-full transition-all ${
                  faol
                    ? "bg-emerald-400 ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/50 scale-105"
                    : javobBerildi
                    ? "bg-emerald-600/80"
                    : "bg-slate-800"
                }`}
                title={`${idx + 1}-savol ${javobBerildi ? "(topshirildi)" : faol ? "(hozirgi)" : ""}`}
              />
            );
          })}
        </div>

        {/* SAVOL MATNI */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl mb-3.5 sm:mb-5">
          <h3 className="text-base sm:text-xl font-bold text-white leading-snug break-words">
            <LatexMatn matn={joriySavol.savol} inline />
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
                    <LatexMatn matn={vMatn} inline />
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
