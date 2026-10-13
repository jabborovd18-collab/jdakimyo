// app/doska/[mavzuId]/JamoalarJangiTab.jsx
//
// Smart Doska — Jamoalar Jangi (Elektron doska markazi).
// Ovoz effektlari (Web Audio), to'liq ekran rejimi (⛶), qayta yuklanganda sessiyani saqlash,
// g'oliblar shohsupasi va jonli kolbalar animatsiyasi.
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { doskaAudio } from "@/lib/doska-audio";
import Ikon from "@/components/Ikon";

const YANGILANISH_MS = 2000;

const SHABLON_NOM_TOPLAMLARI = [
  { nom: "Adsorbsiya", jamoalar: ["Adsorbentlar", "Adsorbatlar", "Desorbsiya", "G'ovaklar"] },
  { nom: "Sirt xossalari", jamoalar: ["Gidrofillar", "Gidrofoblar", "Amfifillar", "Mitsellalar"] },
  { nom: "Buyuk Olimlar", jamoalar: ["Lengmyurchilar", "Freyndlixchilar", "BET jamoasi", "Gibbschilar"] },
  { nom: "Ionlar & Zaryad", jamoalar: ["Kationlar", "Anionlar", "Radikallar", "Komplekslar"] },
  { nom: "Kinetika", jamoalar: ["Katalizatorlar", "Ingibitorlar", "Aktivatorlar", "Promotorlar"] },
  { nom: "Fizikaviy kimyo", jamoalar: ["Kvantlar", "Fotonlar", "Orbitallar", "Izotoplar"] },
];

export default function JamoalarJangiTab({ mavzuId }) {
  const [jamoalarSoni, setJamoalarSoni] = useState(2);
  const [jamoaNomlari, setJamoaNomlari] = useState(["Adsorbentlar", "Adsorbatlar", "Desorbsiya", "G'ovaklar"]);
  const [tahrirlanayotganJamoaId, setTahrirlanayotganJamoaId] = useState(null);
  const [vaqtinchalikNom, setVaqtinchalikNom] = useState("");
  const [xona, setXona] = useState(null);
  const [ustozKalit, setUstozKalit] = useState(null);
  const [qrKodlar, setQrKodlar] = useState({});
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState("");
  const [moderatsiyaOchiq, setModeratsiyaOchiq] = useState(false);
  const [ovozFaol, setOvozFaol] = useState(true);
  const [toliqEkran, setToliqEkran] = useState(false);
  const [aloqaBor, setAloqaBor] = useState(true);
  const [sensorQulfi, setSensorQulfi] = useState(false);

  const xonaIdRef = useRef(null);
  xonaIdRef.current = xona?.xonaId;
  const oldingiBallRef = useRef({});

  // ─── SAQLANGAN XONANI TIKLASH (SESSION RECOVERY) ───
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saqlanganId = sessionStorage.getItem(`doska_ustoz_xona_${mavzuId}`);
    if (saqlanganId) {
      // Ustoz kaliti ham shu brauzerda saqlangan — usiz boshlash/yakunlash ishlamaydi
      const saqlanganKalit = sessionStorage.getItem(`doska_ustoz_kalit_${saqlanganId}`);
      if (saqlanganKalit) setUstozKalit(saqlanganKalit);
      fetch(`/api/doska/jang?xonaId=${saqlanganId}&rol=doska`)
        .then((r) => r.json())
        .then(async (d) => {
          if (d.ok && d.holat) {
            setXona(d.holat);
            // QR larni tiklash
            const origin = window.location.origin;
            const jQrs = {};
            for (const j of d.holat.jamoalar) {
              jQrs[j.id] = await QRCode.toDataURL(`${origin}/doska/jang/${d.holat.xonaId}?jamoa=${j.id}`, {
                width: 240,
                margin: 1,
                color: { dark: "#070b14", light: "#ffffff" },
              });
            }
            setQrKodlar(jQrs);
          }
        })
        .catch(() => {});
    }
  }, [mavzuId]);

  // ─── YANGI XONA YARATISH ───
  const yangiXonaBoshla = async (soni = jamoalarSoni) => {
    setYuklanmoqda(true);
    setXato("");
    try {
      const res = await fetch("/api/doska/jang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "yaratish",
          mavzuId,
          jamoalarSoni: soni,
          jamoaNomlari: jamoaNomlari.slice(0, soni),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Xona ochilmadi");

      setXona(d.holat);
      // Ustoz kaliti FAQAT xona yaratilganda BIR marta keladi — uni darhol saqlaymiz.
      // Usiz bu xonani boshlab/yakunlab bo'lmaydi (boshqa brauzerdan kirgan odam boshqara olmaydi).
      if (d.ustozKalit) {
        setUstozKalit(d.ustozKalit);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`doska_ustoz_xona_${mavzuId}`, d.xonaId);
          sessionStorage.setItem(`doska_ustoz_kalit_${d.xonaId}`, d.ustozKalit);
        }
      } else if (typeof window !== "undefined") {
        sessionStorage.setItem(`doska_ustoz_xona_${mavzuId}`, d.xonaId);
      }

      // QR kodlarni generatsiya qilish
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const jQrs = {};
      for (const j of d.holat.jamoalar) {
        const jHavola = `${origin}/doska/jang/${d.xonaId}?jamoa=${j.id}`;
        jQrs[j.id] = await QRCode.toDataURL(jHavola, {
          width: 240,
          margin: 1,
          color: { dark: "#070b14", light: "#ffffff" },
        });
      }
      setQrKodlar(jQrs);
    } catch (e) {
      setXato(e.message);
    } finally {
      setYuklanmoqda(false);
    }
  };

  // ─── USTOZ HARAKATLARI UCHUN UMUMIY SO'ROV ───
  // Har bir boshqaruv so'roviga ustoz kaliti qo'shiladi. Kalit yo'qolsa (masalan,
  // sessiya tozalangan bo'lsa) server 403 qaytaradi — unda yangi xona ochish kerak.
  const ustozSorovi = async (action, qoshimcha = {}) => {
    const res = await fetch("/api/doska/jang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, xonaId: xona.xonaId, ustozKalit, ...qoshimcha }),
    });
    const d = await res.json();
    if (res.status === 403) {
      throw new Error("Bu xonani boshqarish huquqi yo'q (ustoz kaliti topilmadi). Sahifani yangilab, yangi xona oching.");
    }
    if (!res.ok) throw new Error(d.error || "Xatolik yuz berdi");
    if (d.holat) setXona(d.holat);
    return d;
  };

  // ─── LOBBYDA JAMOA NOMINI YANGILASH ───
  const jamoaNominiSaqla = async (jamoaId, yangiNom) => {
    if (!xona || !yangiNom.trim()) return;
    try {
      await ustozSorovi("nomniYangila", { jamoaId, yangiNom: yangiNom.trim() });
      setTahrirlanayotganJamoaId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  // ─── DOSKA HOLATINI DOIMIY SO'RASH (POLLING) ───
  const yangilaDoska = useCallback(async () => {
    if (!xonaIdRef.current) return;
    try {
      const res = await fetch(`/api/doska/jang?xonaId=${xonaIdRef.current}&rol=doska`);
      const d = await res.json();
      if (res.ok && d.holat) {
        setAloqaBor(true);
        // Ball oshgan bo'lsa yoqimli audio effekt berish
        let yangiBallBor = false;
        d.holat.jamoalar.forEach((j) => {
          const eski = oldingiBallRef.current[j.id] || 0;
          if (j.ball > eski) yangiBallBor = true;
          oldingiBallRef.current[j.id] = j.ball;
        });

        if (yangiBallBor && d.holat.holat === "jang") {
          doskaAudio.chalBall();
        }

        setXona(d.holat);
      } else {
        setAloqaBor(false);
      }
    } catch {
      setAloqaBor(false);
    }
  }, []);

  useEffect(() => {
    if (!xona?.xonaId) return;
    const interval = setInterval(yangilaDoska, YANGILANISH_MS);
    return () => clearInterval(interval);
  }, [xona?.xonaId, yangilaDoska]);

  // ─── TO'LIQ EKRAN REJIMI (FULLSCREEN) ───
  const toliqEkranAlmashtir = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setToliqEkran(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setToliqEkran(false);
    }
  };

  // ─── JANGNI BOSHLASH (START) ───
  const startBer = async () => {
    if (!xona) return;
    try {
      await ustozSorovi("boshlash");
      doskaAudio.chalStart();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  // ─── JANGNI YAKUNLASH ───
  const yakunla = async () => {
    if (!xona) return;
    const haliYechayotganlar = (xona.qatnashchilar || []).filter((q) => !q.tugatdi);
    let xabar = "Haqiqatan ham musobaqani yakunlab, natijalarni e'lon qilmoqchimisiz?";
    if (haliYechayotganlar.length > 0) {
      xabar = `Diqqat! Hali ${haliYechayotganlar.length} nafar o'quvchi testni yechmoqda.\n\nMusobaqani muddatidan oldin yakunlasangiz, ularning joriy natijalari hisoblanadi. Yakunlashni tasdiqlaysizmi?`;
    }
    if (!confirm(xabar)) return;
    try {
      await ustozSorovi("tugatish");
      doskaAudio.chalGolib();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  // ─── MODERATSIYA (SOXTA HISOBNI CHETLATISH) ───
  const chetlat = async (qatnashchiId, ism) => {
    if (!confirm(`${ism} ni musobaqadan chetlatib, uning ballarini jamoa hisobidan olib tashlamoqchimisiz?`)) return;
    try {
      await ustozSorovi("chetlatish", { qatnashchiId });
    } catch (e) {
      alert("Chetlatishda xato: " + e.message);
    }
  };

  // Jamoalar soniga qarab qat'iy Tailwind grid sinflari (purging xavfisiz)
  const gridSinflari = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[xona?.jamoalarSoni || 2] || "grid-cols-1 md:grid-cols-2";

  // ═══════════════════════════════════════════════════════════════════════
  // 1. DASTLABKI HOLAT: XONA HALI YARATILMAGAN
  // ═══════════════════════════════════════════════════════════════════════
  if (!xona) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-950/60 text-white">
          <Ikon nom="kubok" olcham={40} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Jamoalar Jangi — Smart Musobaqa
        </h2>
        <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          O&apos;quvchilarni jamoalarga ajrating. Har bir jamoa uchun QR kod chiqariladi.
          Telefonlarida test ishlashadi va to&apos;g&apos;ri javoblar hisobiga doskada kimyoviy kolbalar to&apos;lib boradi!
        </p>

        {xato && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm">
            {xato}
          </div>
        )}

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6 max-w-md mx-auto">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Jamoalar sonini tanlang:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map((son) => (
              <button
                key={son}
                onClick={() => setJamoalarSoni(son)}
                className={`py-3 rounded-xl font-bold text-lg border transition ${
                  jamoalarSoni === son
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {son} ta jamoa
              </button>
            ))}
          </div>
        </div>

        {/* Jamoalar nomlari va shablonlar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-8 max-w-xl mx-auto text-left">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Jamoalar nomlari (Shablon tanlang yoki tahrirlang):
          </label>

          {/* Tezkor kimyoviy shablonlar */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SHABLON_NOM_TOPLAMLARI.map((sh, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJamoaNomlari([...sh.jamoalar])}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 transition"
              >
                {sh.nom}
              </button>
            ))}
          </div>

          {/* Har bir jamoa uchun alohida nom maydoni */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: jamoalarSoni }).map((_, idx) => (
              <div key={idx}>
                <span className="block text-[11px] text-slate-400 font-bold mb-1">
                  {idx + 1}-jamoa:
                </span>
                <input
                  type="text"
                  value={jamoaNomlari[idx] || ""}
                  onChange={(e) => {
                    const nusxa = [...jamoaNomlari];
                    nusxa[idx] = e.target.value;
                    setJamoaNomlari(nusxa);
                  }}
                  placeholder={`${idx + 1}-jamoa nomi`}
                  maxLength={25}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => yangiXonaBoshla(jamoalarSoni)}
          disabled={yuklanmoqda}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-950/60 transition inline-flex items-center justify-center gap-2"
        >
          {yuklanmoqda ? (
            <span>Xona ochilmoqda...</span>
          ) : (
            <>
              <Ikon nom="chaqmoq" olcham={22} />
              <span>Yangi Jang Xonasini Ochish</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. KUTISH ZALI (LOBBY): QR KODLAR VA ISHTIROKCHILAR RO'YXATI
  // ═══════════════════════════════════════════════════════════════════════
  if (xona.holat === "lobby") {
    const jamiUlanganlar = xona.qatnashchilar.length;

    return (
      <div className="space-y-6">
        {/* YUQORI BOSHQARUV PANEL */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-base font-black">
                PIN: {xona.xonaId}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold animate-pulse">
                Kutish zali (Lobby)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              O&apos;quvchilar ulanishi kutilmoqda ({jamiUlanganlar} nafar tayyor)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Ovoz tugmasi */}
            <button
              onClick={() => setOvozFaol(doskaAudio.holatniAlmashtir())}
              className={`p-3 rounded-2xl border text-base transition ${
                ovozFaol
                  ? "bg-slate-950 border-slate-700 text-emerald-400"
                  : "bg-slate-950 border-slate-800 text-slate-500"
              }`}
              title={ovozFaol ? "Ovoz yoqilgan (O'chirish)" : "Ovoz o'chiq (Yoqish)"}
            >
              <Ikon nom="ovoz" olcham={20} className={ovozFaol ? "text-emerald-400" : "text-slate-500"} />
            </button>

            {/* To'liq ekran tugmasi */}
            <button
              onClick={toliqEkranAlmashtir}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white"
              title="To'liq ekran rejimiga o'tish"
            >
              <Ikon nom="tashqi" olcham={20} />
            </button>

            {/* Start tugmasi */}
            <button
              onClick={startBer}
              disabled={jamiUlanganlar === 0}
              className={`px-8 py-3.5 rounded-2xl font-black text-base shadow-xl transition flex items-center gap-2 ${
                jamiUlanganlar > 0
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 shadow-emerald-950/60 cursor-pointer"
                  : "bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>BOSHLASH (START)</span>
              <Ikon nom="ong" olcham={18} />
            </button>
          </div>
        </div>

        {/* QR KODLAR KARTALARI (HAR BIR JAMOA UCHUN) */}
        <div className={`grid ${gridSinflari} gap-6`}>
          {xona.jamoalar.map((j) => {
            const jamoaAzzolari = xona.qatnashchilar.filter((q) => q.jamoaId === j.id);
            return (
              <div
                key={j.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden"
              >
                <div
                  className="absolute top-0 inset-x-0 h-2"
                  style={{ backgroundColor: j.hex }}
                />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {j.id}-Jamoa
                </span>

                {tahrirlanayotganJamoaId === j.id ? (
                  <div className="flex items-center gap-1.5 mb-4 w-full max-w-[200px]">
                    <input
                      type="text"
                      value={vaqtinchalikNom}
                      onChange={(e) => setVaqtinchalikNom(e.target.value)}
                      maxLength={25}
                      className="flex-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-emerald-500 text-white text-sm font-bold focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") jamoaNominiSaqla(j.id, vaqtinchalikNom);
                        if (e.key === "Escape") setTahrirlanayotganJamoaId(null);
                      }}
                    />
                    <button
                      onClick={() => jamoaNominiSaqla(j.id, vaqtinchalikNom)}
                      className="p-1 rounded-lg bg-emerald-600 text-white font-bold"
                      title="Saqlash"
                    >
                      <Ikon nom="tasdiq" olcham={14} />
                    </button>
                    <button
                      onClick={() => setTahrirlanayotganJamoaId(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400"
                      title="Bekor qilish"
                    >
                      <Ikon nom="yopish" olcham={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center gap-1.5 mb-4 group cursor-pointer"
                    onClick={() => {
                      setTahrirlanayotganJamoaId(j.id);
                      setVaqtinchalikNom(j.nom);
                    }}
                    title="Nomni o'zgartirish uchun bosing"
                  >
                    <h3 className="text-2xl font-black text-white hover:opacity-90 transition" style={{ color: j.hex }}>
                      {j.nom}
                    </h3>
                    <span className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-1 rounded transition text-xs">
                      ✎
                    </span>
                  </div>
                )}

                {/* QR KOD */}
                <div className="bg-white p-3.5 rounded-2xl shadow-xl mb-4">
                  {qrKodlar[j.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrKodlar[j.id]}
                      alt={`${j.nom} QR kodi`}
                      className="w-44 h-44 object-contain"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                      Yuklanmoqda...
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-300 mb-4 font-medium">
                  Telefoningiz bilan skanerlang va ismingizni yozing
                </div>

                {/* JAMOA AZZOLARI RO'YXATI */}
                <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3 pb-2 border-b border-slate-800">
                    <span>Ulandilar:</span>
                    <span className="font-mono text-emerald-400">{jamoaAzzolari.length} nafar</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 text-left">
                    {jamoaAzzolari.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800/60 text-xs"
                      >
                        <span className="text-slate-200 font-medium truncate">{q.ism}</span>
                        <button
                          onClick={() => chetlat(q.id, q.ism)}
                          className="text-red-400 hover:text-red-300 p-1 font-bold"
                          title="Chetlatish (soxta hisob)"
                        >
                          <Ikon nom="yopish" olcham={13} />
                        </button>
                      </div>
                    ))}
                    {jamoaAzzolari.length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-4">
                        Kutilmoqda...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. JONLI JANG (KOLBALAR POYGASI) VA YAKUNLANISH
  // ═══════════════════════════════════════════════════════════════════════
  const yakunlangan = xona.holat === "yakunlandi";
  const tartiblanganJamoalar = [...xona.jamoalar].sort((a, b) => {
    if (b.ball !== a.ball) return b.ball - a.ball;
    return (a.sarflanganVaqt || 0) - (b.sarflanganVaqt || 0);
  });
  const golib = tartiblanganJamoalar[0];

  return (
    <div className={`space-y-6 ${sensorQulfi ? "pointer-events-none select-none" : ""}`}>
      {/* ═══ OFFLINE XAVF BILDIRISHNOMASI ═══ */}
      {!aloqaBor && (
        <div className="py-2.5 px-4 rounded-2xl bg-amber-950/90 border border-amber-500/80 text-amber-200 text-xs text-center font-bold animate-pulse flex items-center justify-center gap-2">
          <Ikon nom="ogohlantirish" olcham={16} className="text-amber-400 shrink-0" />
          <span>📡 Smart doska server bilan aloqasi uzildi. Qayta ulanmoqda... (O&apos;quvchilar javoblari xotirada saqlanadi)</span>
        </div>
      )}

      {/* ═══ SENSOR QULFI BILDIRISHNOMASI ═══ */}
      {sensorQulfi && (
        <div className="py-2.5 px-4 rounded-2xl bg-sky-950/90 border border-sky-500/80 text-sky-200 text-xs text-center font-bold flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Ikon nom="qulf" olcham={16} className="text-sky-400 shrink-0" />
            <span>🔒 Doska sensor himoyasi faol: tasodifiy teginishlar bloklandi.</span>
          </div>
          <button
            onClick={() => setSensorQulfi(false)}
            className="px-3 py-1 rounded-xl bg-sky-600 text-white font-bold text-xs"
          >
            Qulfni ochish
          </button>
        </div>
      )}

      {/* ═══ YUQORI DOSKA BOSHQARUVI ═══ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono text-base font-black">
            PIN: {xona.xonaId}
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold border ${
              yakunlangan
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
            }`}
          >
            {yakunlangan ? "Musobaqa Yakunlandi" : "Jonli Musobaqa Ketmoqda"}
          </span>
          <span className="text-xs text-slate-300 font-semibold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            Topshirdi: <span className="font-mono text-emerald-400 font-bold">{(xona.qatnashchilar || []).filter((q) => q.tugatdi).length}</span> / {(xona.qatnashchilar || []).length} nafar
          </span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Sensor himoyasi (Palm rejection) */}
          <button
            onClick={() => setSensorQulfi(!sensorQulfi)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              sensorQulfi
                ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Doskaga tasodifiy teginishdan himoyalanish"
          >
            <Ikon nom={sensorQulfi ? "qulf" : "ochiq"} olcham={16} />
            <span>{sensorQulfi ? "🔒 Himoya faol" : "🔓 Sensor himoyasi"}</span>
          </button>

          {/* Ovoz tugmasi */}
          <button
            onClick={() => setOvozFaol(doskaAudio.holatniAlmashtir())}
            className={`p-2.5 rounded-xl border text-sm transition ${
              ovozFaol ? "bg-slate-950 border-slate-700 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-500"
            }`}
            title="Ovozni yoqish/o'chirish"
          >
            <Ikon nom="ovoz" olcham={18} className={ovozFaol ? "text-emerald-400" : "text-slate-500"} />
          </button>

          {/* To'liq ekran */}
          <button
            onClick={toliqEkranAlmashtir}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white"
            title="To'liq ekran"
          >
            <Ikon nom="tashqi" olcham={18} />
          </button>

          {/* O'quvchilar ro'yxati (Moderatsiya) */}
          <button
            onClick={() => setModeratsiyaOchiq(!moderatsiyaOchiq)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2"
          >
            <Ikon nom="ustoz" olcham={16} />
            <span>Ro&apos;yxat ({xona.qatnashchilar.length})</span>
          </button>

          {!yakunlangan ? (
            <button
              onClick={yakunla}
              className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-bold text-xs flex items-center gap-1.5"
            >
              <span>Yakunlash</span>
              <Ikon nom="bayroq" olcham={16} />
            </button>
          ) : (
            <button
              onClick={() => yangiXonaBoshla(jamoalarSoni)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <span>Yangi Jang</span>
              <Ikon nom="qayta" olcham={16} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ MODERATSIYA MODALI (O'QUVCHILARNI KO'RISH VA CHETLATISH) ═══ */}
      {moderatsiyaOchiq && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Ikon nom="ustoz" olcham={18} className="text-amber-400" />
              <span>O&apos;qituvchi boshqaruvi: qatnashchilar va soxta hisoblarni chetlatish</span>
            </h4>
            <button
              onClick={() => setModeratsiyaOchiq(false)}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
            >
              <Ikon nom="yopish" olcham={14} />
              <span>Yopish</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto">
            {xona.qatnashchilar.map((q) => {
              const jamoa = xona.jamoalar.find((j) => j.id === q.jamoaId);
              return (
                <div
                  key={q.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{q.ism}</div>
                    <div className="text-[11px] text-slate-400">
                      <span style={{ color: jamoa?.hex }}>{jamoa?.nom}</span> •{" "}
                      <span className="text-emerald-400 font-mono">{q.ball} ball</span> •{" "}
                      <span className="text-slate-300 font-mono">{q.ishlaganSavollar || 0}/20</span>{" "}
                      {q.tugatdi ? (
                        <span className="text-emerald-400 font-semibold">(Tugatdi)</span>
                      ) : (
                        <span className="text-amber-400/80">(Yechmoqda)</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => chetlat(q.id, q.ism)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded font-bold"
                    title="Chetlatish (soxta hisob)"
                  >
                    <Ikon nom="yopish" olcham={14} className="text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ G'OLIBLAR SHOHSUPASI (PODIUM) ═══ */}
      {yakunlangan && golib && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-2 border-amber-500/80 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 animate-bounce">
            <Ikon nom="kubok" olcham={36} />
          </div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            G&apos;olib Jamoa
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-amber-300">
            {golib.nom}!
          </h3>
          <p className="text-slate-200 text-base mt-2">
            To&apos;plangan umumiy ball:{" "}
            <span className="font-mono font-black text-white text-2xl">{golib.ball} ball</span>
            <span className="text-slate-400 text-sm ml-3 font-mono">
              (⏱️ {golib.sarflanganVaqt || 0} soniya)
            </span>
          </p>
          {golib.vaqtUstunligi && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold mt-2">
              <span>⏱️ Ballar teng — kamroq vaqt sarflagani hisobiga g&apos;olib!</span>
            </div>
          )}

          {/* O'rinlar taqsimoti */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-800/80">
            {tartiblanganJamoalar.map((j, orinIndex) => (
              <div
                key={j.id}
                className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 text-sm"
              >
                <Ikon
                  nom="medal"
                  olcham={20}
                  className={orinIndex === 0 ? "text-amber-400" : orinIndex === 1 ? "text-slate-300" : orinIndex === 2 ? "text-amber-600" : "text-slate-500"}
                />
                <span className="font-bold" style={{ color: j.hex }}>{j.nom}</span>
                <span className="font-mono text-slate-300 font-bold">{j.ball} ball</span>
                <span className="text-xs font-mono text-slate-400">⏱️ {j.sarflanganVaqt || 0}s</span>
                {j.vaqtUstunligi && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ⏱️ Vaqt ustunligi!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ JAMOAVIY KOLBALAR (ERLENMEYER KOLBALARI) ═══ */}
      <div className={`grid ${gridSinflari} gap-6`}>
        {xona.jamoalar.map((j) => {
          // Kolba suyuqlik foizi (maksimal 500 ml yoki eng yuqori ballga nisbatan)
          const foiz = Math.min(100, Math.max(8, (j.suyuqlikMl / 300) * 100));

          return (
            <div
              key={j.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-xl relative overflow-hidden"
            >
              <div
                className="absolute top-0 inset-x-0 h-2"
                style={{ backgroundColor: j.hex }}
              />

              {/* JAMOA SARLAVHASI VA BALL */}
              <div className="w-full pb-4 border-b border-slate-800/80 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {j.id}-Jamoa
                </span>
                <h3 className="text-2xl font-black" style={{ color: j.hex }}>
                  {j.nom}
                </h3>
                <div className="text-4xl font-black font-mono text-white mt-1">
                  {j.ball} <span className="text-xs font-normal text-slate-400">ball</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                  <span>{j.azolariSoni || 0} o&apos;quvchi</span> •{" "}
                  <span className="font-mono text-slate-300">o&apos;rtacha {j.ortachaBall || 0} b.</span> •{" "}
                  <span className="font-mono text-cyan-400 font-semibold">⏱️ {j.sarflanganVaqt || 0}s</span>
                </div>
              </div>

              {/* TOP-1 YETAKCHI O'QUVCHI KARTASI */}
              <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 mb-6">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1">
                  <Ikon nom="yulduz" olcham={13} className="text-amber-400" />
                  <span>Jamoa Yetakchisi (TOP 1)</span>
                </div>
                {j.topIshtirokchi ? (
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-bold text-white truncate max-w-[130px]">
                      {j.topIshtirokchi.ism}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {j.topIshtirokchi.ball} b.
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Hali savol yechilmadi</div>
                )}
              </div>

              {/* KIMYOVIY KOLBA (SVG ANIMATSIYASI) */}
              <div className="relative w-48 h-64 flex items-center justify-center my-2">
                <svg className="w-full h-full" viewBox="0 0 200 260">
                  <defs>
                    <clipPath id={`kolba-qirqish-${j.id}`}>
                      {/* Erlenmeyer kolbasi ichki konturi */}
                      <path d="M 85,20 L 115,20 L 115,80 L 180,230 C 185,245 175,255 160,255 L 40,255 C 25,255 15,245 20,230 L 85,80 Z" />
                    </clipPath>
                    <linearGradient id={`suyuqlik-rang-${j.id}`} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor={j.hex} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={j.suyuqlikRang} stopOpacity="0.85" />
                    </linearGradient>
                  </defs>

                  {/* Shisha idish orqa foni */}
                  <path
                    d="M 85,20 L 115,20 L 115,80 L 180,230 C 185,245 175,255 160,255 L 40,255 C 25,255 15,245 20,230 L 85,80 Z"
                    fill="#030712"
                    stroke="#334155"
                    strokeWidth="4"
                  />

                  {/* Suyuqlik darajasi (to'lish balandligi) */}
                  <g clipPath={`url(#kolba-qirqish-${j.id})`}>
                    <rect
                      x="0"
                      y={260 - (foiz / 100) * 200}
                      width="200"
                      height="260"
                      fill={`url(#suyuqlik-rang-${j.id})`}
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Suyuqlik yuzasidagi to'lqin / ko'pik chizig'i */}
                    <line
                      x1="0"
                      y1={260 - (foiz / 100) * 200}
                      x2="200"
                      y2={260 - (foiz / 100) * 200}
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeOpacity="0.6"
                    />

                    {/* Ko'pik pufakchalari */}
                    <circle cx="80" cy={250 - (foiz / 100) * 160} r="3" fill="#ffffff" opacity="0.5" />
                    <circle cx="120" cy={250 - (foiz / 100) * 120} r="4" fill="#ffffff" opacity="0.4" />
                    <circle cx="100" cy={250 - (foiz / 100) * 80} r="2.5" fill="#ffffff" opacity="0.6" />
                  </g>

                  {/* O'lchov shkalasi chiziqlari */}
                  <line x1="75" y1="200" x2="90" y2="200" stroke="#94a3b8" strokeWidth="1.5" opacity="0.7" />
                  <line x1="80" y1="170" x2="90" y2="170" stroke="#94a3b8" strokeWidth="1.5" opacity="0.7" />
                  <line x1="85" y1="140" x2="95" y2="140" stroke="#94a3b8" strokeWidth="1.5" opacity="0.7" />
                  <line x1="90" y1="110" x2="100" y2="110" stroke="#94a3b8" strokeWidth="1.5" opacity="0.7" />

                  {/* Idish bo'yni gardishi */}
                  <rect x="80" y="15" width="40" height="6" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
                </svg>

                {/* Suyuqlik sathi ml da */}
                <div className="absolute bottom-6 font-mono text-xs font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded-full shadow">
                  {j.suyuqlikMl} ml
                </div>
              </div>

              {/* Jamoa ishtirokchilari soni */}
              <div className="text-xs text-slate-400 mt-2 font-medium">
                A&apos;zolar: {j.azolariSoni} nafar
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ JONLI HODISALAR LENTASI ═══ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Jonli Jang Lentasi (Oxirgi to&apos;g&apos;ri javoblar):
        </h4>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {xona.jonliLenta.map((hodisa) => {
            return (
              <div
                key={hodisa.id}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white">{hodisa.ism}</span>
                  <span className="text-slate-400">({hodisa.jamoaNomi})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {hodisa.daraja}-daraja
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  +{hodisa.ball} ball!
                </span>
              </div>
            );
          })}
          {xona.jonliLenta.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-4">
              Jang boshlandi! O&apos;quvchilar javob yuborishi bilan ballar shu yerda paydo bo&apos;ladi...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
