"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSahna } from "./hooks/useSahna.js";
import { useSudrash } from "./hooks/useSudrash.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import ReagentJavoni from "./components/ReagentJavoni.jsx";
import JihozJavoni from "./components/JihozJavoni.jsx";
import NatijaPaneli from "./components/NatijaPaneli.jsx";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import FonTanlagich from "./components/FonTanlagich.jsx";
import { idishYarat, tozala, jamiHajm } from "./lib/idish-holati.js";
import { jurnalYarat } from "./lib/jurnal.js";
import { suyuqlikSathiniYangila } from "./lib/jihoz-modellari.js";
import { moddaKorinishi } from "./lib/modda-korinishi.js";
import {
  SUKUT_FON,
  fonKalitiOqi,
  fonKalitiniSaqla,
} from "./lib/fonlar.js";

// Hex rangni '#RRGGBB' css satriga aylantirish.
function hexDanCss(hex) {
  return `#${Number(hex || 0xffffff).toString(16).padStart(6, "0")}`;
}

// 3D Laboratoriya sahifasining asosiy interfeys va sahna yig'uvchi komponenti.
// Nega korinish.js alohida yozildi: SEO metadata page.js da qolishi, client holat va
// 3D grafik kontekst esa faqat brauzerda yuklanishi uchun arxitektura ajratildi.
export default function Korinish() {
  // API dan keluvchi ma'lumotlar
  const [labMaLumot, setLabMaLumot] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kirilmagan, setKirilmagan] = useState(false);
  const [yuklashXatosi, setYuklashXatosi] = useState(false);

  // Faol tanlovlar va holatlar
  const [faolReagent, setFaolReagent] = useState(null);
  const [aralashmaOzgarish, setAralashmaOzgarish] = useState(0); // Rerender triggeri
  const [mobilJavon, setMobilJavon] = useState(null); // "reagentlar" | "jihozlar" | null

  // Sahna foni. Boshlang'ich qiymat ataylab SUKUT_FON: localStorage'ni
  // useState ichida o'qisak, server chizgan HTML bilan brauzer chizgani
  // farq qilib hidratsiya xatosi chiqardi. Saqlangan tanlov effektda olinadi.
  const [fonKaliti, setFonKaliti] = useState(SUKUT_FON);

  useEffect(() => {
    setFonKaliti(fonKalitiOqi());
  }, []);

  const fonniOzgartir = useCallback((kalit) => {
    setFonKaliti(kalit);
    fonKalitiniSaqla(kalit);
  }, []);

  // Idish holati va Jurnal ref lari (60 FPS kadr renderi bilan ajratilgan)
  const holatRef = useRef(idishYarat("probirka", 0));
  const jurnalRef = useRef(jurnalYarat());
  const konteynerRef = useRef(null);

  // 1. 3D Sahna
  const {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
  } = useSahna(konteynerRef, yuklanmoqda, fonKaliti);

  // 2. Sudrash va tanlash
  const { tanlanganIdish, setTanlanganIdish } = useSudrash({
    sahnaRef,
    kameraRef,
    rendererRef,
    onIdishTanlandi: (group) => {
      if (group && group.userData?.kalit) {
        holatRef.current.idish = group.userData.kalit;
      }
    },
  });

  // Har doim hozirgi mo'ljal idishini topish (tanlangan yoki eng birinchisi)
  const nishonIdishGroup = tanlanganIdish || hammaJihozlar[0] || null;

  // 3. Quyish
  const handleHolatOzgardimi = useCallback(() => {
    setAralashmaOzgarish((s) => s + 1);
  }, []);

  const { quyishBoshla, quyishToxtat, quyilmoqda, hajm } = useQuyish({
    sahnaRef,
    holatRef,
    jurnalRef,
    onOzgarish: handleHolatOzgardimi,
  });

  // 4. GET /api/laboratoriya dan inventar va balans o'qish
  const yuklaLab = useCallback(async () => {
    setYuklanmoqda(true);
    setKirilmagan(false);
    setYuklashXatosi(false);

    try {
      const res = await fetch("/api/laboratoriya");
      if (res.status === 401) {
        setKirilmagan(true);
        setYuklanmoqda(false);
        return;
      }
      if (!res.ok) {
        setYuklashXatosi(true);
        setYuklanmoqda(false);
        return;
      }
      const data = await res.json();
      setLabMaLumot(data);
    } catch (e) {
      setYuklashXatosi(true);
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  useEffect(() => {
    yuklaLab();
  }, [yuklaLab]);

  // 5. Tajriba o'tkazish
  const {
    otkaz,
    otkazilmoqda,
    natija,
    tanlov,
    xato,
    nisbatBahosi,
    hisobotMatni,
    setNatija,
    setTanlov,
    setXato,
  } = useTajriba({
    sahnaRef,
    holatRef,
    jurnalRef,
    holatniYangila: yuklaLab,
  });

  // Idishni tozalash amali
  const handleTozalash = () => {
    holatRef.current = tozala(holatRef.current);
    jurnalRef.current = jurnalYarat();
    if (nishonIdishGroup) {
      suyuqlikSathiniYangila(nishonIdishGroup, 0, null, 0);
    }
    setNatija(null);
    setTanlov(null);
    setXato(null);
    setAralashmaOzgarish((s) => s + 1);
  };

  // Reagent va jihozlarni filtrlash
  const inventar = labMaLumot?.inventar || [];
  const reagentlar = inventar.filter((i) => i.turi === "reagent");
  const jihozlar = inventar.filter((i) => i.turi === "jihoz");

  const quyilganModdalar = holatRef.current?.moddalar || {};
  const quyilganKalitlar = Object.keys(quyilganModdalar);
  const jamiMl = jamiHajm(holatRef.current);

  // --- 1. LOGIN TALABI (401) ---
  if (kirilmagan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 p-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-purple-800/60 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50 text-3xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-yellow-400">Tizimga Kirish Talab Etiladi</h2>
          <p className="mt-3 text-sm leading-relaxed text-purple-200">
            3D virtual laboratoriyadan foydalanish, tajribalarni o&apos;tkazish va ochkolar yig&apos;ish
            uchun o&apos;z hisobingizga kiring.
          </p>
          <a
            href="/login?callbackUrl=/laboratoriya/3d"
            className="mt-6 block w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 text-sm font-bold text-black shadow-lg transition hover:opacity-90"
          >
            Kirish / Ro&apos;yxatdan O&apos;tish
          </a>
          <a
            href="/laboratoriya"
            className="mt-4 block text-xs text-purple-400 hover:text-white"
          >
            ← 2D Laboratoriyaga qaytish
          </a>
        </div>
      </div>
    );
  }

  // --- 2. YUKLASH XATOSI YOKI SKELET ---
  if (yuklanmoqda) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 p-4 text-white">
        <div className="mb-4 h-14 w-full animate-pulse rounded-2xl bg-slate-900/60 border border-purple-800/40" />
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-12">
          <div className="hidden h-full animate-pulse rounded-2xl bg-slate-900/60 border border-purple-800/40 md:col-span-3 md:block" />
          <div className="h-[60vh] animate-pulse rounded-2xl bg-slate-900/60 border border-purple-800/40 md:col-span-6 md:h-full" />
          <div className="hidden h-full animate-pulse rounded-2xl bg-slate-900/60 border border-purple-800/40 md:col-span-3 md:block" />
        </div>
      </div>
    );
  }

  if (yuklashXatosi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 p-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-purple-800/60 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/40 text-3xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-yellow-400">Ma&apos;lumot Yuklanmadi</h2>
          <p className="mt-3 text-xs text-purple-200">
            Laboratoriya serveri bilan bog&apos;lanishda xatolik yuz berdi. Iltimos, qayta urinib
            ko&apos;ring.
          </p>
          <button
            type="button"
            onClick={yuklaLab}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 text-sm font-bold text-black shadow-lg hover:opacity-90"
          >
            Qayta Urinish
          </button>
        </div>
      </div>
    );
  }

  const balans = labMaLumot?.balans || { coins: 0, gems: 0, stars: 0 };
  const lab = labMaLumot?.lab || {};
  const daraja = lab.darajaHolati || { daraja: 1, joriy: 0, kerak: 100, foiz: 0 };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white selection:bg-purple-600">
      <MobilOgohlantirish />

      {/* --- YUQUORI SARLAVHA PANELI --- */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-800/40 bg-slate-950/80 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <a
            href="/laboratoriya"
            className="flex items-center gap-1 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Laboratoriya
          </a>
          <h1 className="flex items-center gap-2 text-sm font-bold tracking-wide text-white sm:text-base">
            <span>🔬 3D Laboratoriya</span>
            {kuchsizQurilma && (
              <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-300">
                Arzon Rejim
              </span>
            )}
          </h1>
        </div>

        {/* Daraja chizig'i va balanc */}
        <div className="flex items-center gap-3">
          <FonTanlagich qiymat={fonKaliti} onOzgartir={fonniOzgartir} />

          <div className="hidden flex-col items-end sm:flex">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-yellow-400">{daraja.daraja}-daraja</span>
              <span className="text-purple-300">
                ({daraja.joriy} / {daraja.kerak} XP)
              </span>
            </div>
            <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-purple-950">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                style={{ width: `${Math.min(100, daraja.foiz || 0)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-300">🪙 {balans.coins || 0}</span>
            <span className="text-purple-700">|</span>
            <span className="flex items-center gap-1 text-cyan-300">💎 {balans.gems || 0}</span>
          </div>
        </div>
      </header>

      {/* --- ASOSIY ISH MAYDONI (CANVAS VA JAVONLAR) --- */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Chap panel: Desktop da ikkita javon bloklari */}
        <aside className="hidden w-80 shrink-0 flex-col gap-3 border-r border-purple-800/40 bg-slate-950/40 p-3 md:flex">
          <div className="h-1/2 overflow-hidden">
            <ReagentJavoni
              reagentlar={reagentlar}
              faol={faolReagent}
              onTanla={setFaolReagent}
              quyilgan={quyilganModdalar}
            />
          </div>
          <div className="h-1/2 overflow-hidden">
            <JihozJavoni
              jihozlar={jihozlar}
              stolda={hammaJihozlar}
              onQosh={(kalit) => jihozQosh(kalit)}
              onOlib={(kalit) => jihozOlib(kalit)}
            />
          </div>
        </aside>

        {/* Mobil uchun javonlarni varaq shaklida ochish tugmalari */}
        <div className="flex gap-2 border-b border-purple-800/40 bg-slate-900/60 p-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "reagentlar" ? null : "reagentlar")}
            className="flex-1 rounded-xl bg-slate-800/80 py-2 text-xs font-bold text-purple-200"
          >
            🧪 Reagentlar ({reagentlar.length})
          </button>
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "jihozlar" ? null : "jihozlar")}
            className="flex-1 rounded-xl bg-slate-800/80 py-2 text-xs font-bold text-purple-200"
          >
            🔬 Jihozlar ({hammaJihozlar.length}/6)
          </button>
        </div>

        {/* Mobil sirg'aluvchi varaq */}
        {mobilJavon && (
          <div className="absolute inset-x-0 top-12 z-40 h-80 bg-slate-900/95 p-3 shadow-2xl md:hidden">
            {mobilJavon === "reagentlar" ? (
              <ReagentJavoni
                reagentlar={reagentlar}
                faol={faolReagent}
                onTanla={(kalit) => {
                  setFaolReagent(kalit);
                  setMobilJavon(null);
                }}
                quyilgan={quyilganModdalar}
              />
            ) : (
              <JihozJavoni
                jihozlar={jihozlar}
                stolda={hammaJihozlar}
                onQosh={(kalit) => {
                  jihozQosh(kalit);
                  setMobilJavon(null);
                }}
                onOlib={(kalit) => jihozOlib(kalit)}
              />
            )}
          </div>
        )}

        {/* --- 3D CANVAS HUDUDI --- */}
        <main className="relative flex-1 w-full h-full min-h-[350px] overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
          <div ref={konteynerRef} className="absolute inset-0 h-full w-full" />

          {/* 3D interaktiv yordam matni */}
          <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-slate-900/70 px-3 py-1.5 text-xs text-purple-300 backdrop-blur-sm">
            💡 {faolReagent ? `${faolReagent} tanlandi — quyish tugmasini bosib turing` : "Reagent tanlab idishga quying"}
          </div>
        </main>

        {/* O'ng panel: Tajriba Natijasi va Daftari */}
        <NatijaPaneli
          natija={natija}
          tanlov={tanlov}
          xato={xato}
          hisobot={hisobotMatni}
          nisbatBahosi={nisbatBahosi}
          onYop={() => {
            setNatija(null);
            setTanlov(null);
            setXato(null);
          }}
          onTanlovTanla={(reactionId) => otkaz(reactionId, nishonIdishGroup)}
          onQaytaUrin={() => {
            setXato(null);
            otkaz(null, nishonIdishGroup);
          }}
        />
      </div>

      {/* --- PASTKI BOSHQARUV VA ARALASHMA PANELI --- */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-800/40 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
        {/* Idishdagi joriy tarkib (real vaqtda) */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-purple-400">
              Joriy Idish: {nishonIdishGroup?.userData?.kalit || "Probirka"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-yellow-300">
                {jamiMl.toFixed(1)} ml
              </span>
              <span className="text-xs text-purple-300">
                ({quyilganKalitlar.length} xil modda)
              </span>
            </div>
          </div>

          {/* Quyilgan moddalar nishoni */}
          <div className="hidden flex-wrap gap-1 sm:flex">
            {quyilganKalitlar.map((kalit) => {
              const ml = quyilganModdalar[kalit]?.ml || 0;
              const rang = hexDanCss(moddaKorinishi(kalit).rang);
              return (
                <span
                  key={kalit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2 py-1 text-xs text-white"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: rang }}
                  />
                  {kalit} <strong className="text-yellow-300">{ml} ml</strong>
                </span>
              );
            })}
          </div>
        </div>

        {/* Asosiy amallar: Quyish (bosib turib), Tajriba va Tozalash */}
        <div className="flex items-center gap-2">
          {/* Uzluksiz quyish tugmasi */}
          <button
            type="button"
            disabled={!faolReagent || !nishonIdishGroup}
            onPointerDown={(e) => {
              e.preventDefault();
              if (faolReagent && nishonIdishGroup) {
                quyishBoshla(faolReagent, nishonIdishGroup);
              }
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              quyishToxtat();
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              quyishToxtat();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg transition select-none ${
              faolReagent && nishonIdishGroup
                ? quyilmoqda
                  ? "bg-blue-600 text-white scale-95"
                  : "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-slate-800 text-purple-400/50 cursor-not-allowed"
            }`}
          >
            <span>💧</span>
            <span>
              {quyilmoqda
                ? "Quyilmoqda..."
                : faolReagent
                ? `${faolReagent} quyish (bosib turing)`
                : "Avval reagent tanlang"}
            </span>
          </button>

          {/* Reaksiyani tekshirish tugmasi */}
          <button
            type="button"
            disabled={jamiMl <= 0 || otkazilmoqda}
            onClick={() => otkaz(null, nishonIdishGroup)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition ${
              jamiMl > 0 && !otkazilmoqda
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg hover:opacity-90"
                : "bg-slate-800 text-purple-400/50 cursor-not-allowed"
            }`}
          >
            <span>🔥</span>
            <span>{otkazilmoqda ? "O'tkazilmoqda..." : "Tajriba o'tkazish"}</span>
          </button>

          {/* Tozalash tugmasi */}
          <button
            type="button"
            disabled={jamiMl <= 0 && !natija && !xato}
            onClick={handleTozalash}
            className="rounded-xl border border-purple-800/60 bg-slate-800/70 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-slate-800 hover:text-white"
          >
            🗑️ Tozalash
          </button>
        </div>
      </footer>

      {/* --- QO'SHIMCHA 2D HAVOLA --- */}
      <div className="bg-slate-950 py-1.5 text-center text-[11px] text-purple-400">
        <a href="/laboratoriya" className="hover:text-white hover:underline">
          2D ko&apos;rinishga qaytish → /laboratoriya
        </a>
      </div>
    </div>
  );
}