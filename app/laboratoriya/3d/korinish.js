"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import { useSahna } from "./hooks/useSahna.js";
import { useSudrash } from "./hooks/useSudrash.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import ReagentJavoni from "./components/ReagentJavoni.jsx";
import JihozJavoni from "./components/JihozJavoni.jsx";
import NatijaPaneli from "./components/NatijaPaneli.jsx";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import { idishYarat, tozala, jamiHajm } from "./lib/idish-holati.js";
import { jurnalYarat } from "./lib/jurnal.js";
import { suyuqlikSathiniYangila } from "./lib/jihoz-modellari.js";
import { moddaKorinishi } from "./lib/modda-korinishi.js";
import { reagentBirligi, hajmniBirlikka, miqdorniFormatla } from "@/lib/lab-birlik.js";

// Hex rangni '#RRGGBB' css satriga aylantirish.
function hexDanCss(hex) {
  return `#${Number(hex || 0xffffff).toString(16).padStart(6, "0")}`;
}

// Tez-tez takrorlanadigan yuza uslubi. Rang qiymati sinf ichida emas, CSS
// o'zgaruvchisida — v3 qoidasi: `bg-slate-900` yozilgan zahoti sahifa
// "kunduz" fonida buziladi va uni keyin tuzatib bo'lmaydi.
const YUZA = {
  background: "var(--v3-yuza)",
  borderColor: "var(--v3-chiziq)",
  color: "var(--v3-matn)",
};

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

  // Sahifa va sahna foni — bitta tanlov.
  //
  // Ilgari bu yerda laboratoriyaning O'Z fon holati bor edi (localStorage
  // kaliti `jda-lab3d-fon`), u faqat canvas rangini o'zgartirardi va sahifa
  // bezagi qattiq yozilgan binafsha bo'lib qolaverardi. Endi sayt tizimidagi
  // `useFon()` ishlatiladi: u `<html>` ga `data-fon` yozadi, CSS
  // o'zgaruvchilari interfeysni bo'yaydi, o'sha kalit esa sahna mavzusini
  // ham tanlaydi (lib/fonlar.js).
  //
  // DIQQAT: `useFon()` sahifadan chiqqanda `data-fon` ni ataylab o'chiradi —
  // saytning qolgan sahifalarida ranglar qattiq yozilgan va ular doim
  // qorong'u fonni nazarda tutadi. Atributni qo'lda qo'ymaslik kerak.
  const [fonKaliti, fonniOzgartir] = useFon();

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
  const handleIdishTanlandi = useCallback((group) => {
    if (group && group.userData?.kalit) {
      holatRef.current.idish = group.userData.kalit;
    }
  }, []);

  const { tanlanganIdish, setTanlanganIdish } = useSudrash({
    sahnaRef,
    kameraRef,
    rendererRef,
    onIdishTanlandi: handleIdishTanlandi,
  });

  // Har doim hozirgi mo'ljal idishini topish (tanlangan yoki eng birinchisi)
  const nishonIdishGroup = tanlanganIdish || hammaJihozlar[0] || null;

  // 3. Quyish
  const handleHolatOzgardimi = useCallback(() => {
    setAralashmaOzgarish((s) => s + 1);
  }, []);

  const { quyishBoshla, quyishToxtat, quyilmoqda } = useQuyish({
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
      <div
        className="flex min-h-screen flex-col items-center justify-center p-6"
        style={{ background: "var(--v3-fon)", color: "var(--v3-matn)" }}
      >
        <div className="v3-modal text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: "var(--v3-yuza-2)" }}
          >
            🔒
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--v3-urgu)" }}>
            Tizimga Kirish Talab Etiladi
          </h2>
          <p className="v3-xira mt-3 text-sm leading-relaxed">
            3D virtual laboratoriyadan foydalanish, tajribalarni o&apos;tkazish va ochkolar yig&apos;ish
            uchun o&apos;z hisobingizga kiring.
          </p>
          <a
            href="/login?callbackUrl=/laboratoriya/3d"
            className="v3-tugma-asosiy mt-6 w-full justify-center"
          >
            Kirish / Ro&apos;yxatdan O&apos;tish
          </a>
          <a href="/laboratoriya" className="v3-xira mt-4 block text-xs hover:underline">
            ← 2D Laboratoriyaga qaytish
          </a>
        </div>
      </div>
    );
  }

  // --- 2. YUKLASH XATOSI YOKI SKELET ---
  if (yuklanmoqda) {
    return (
      <div
        className="flex min-h-screen flex-col p-4"
        style={{ background: "var(--v3-fon)" }}
      >
        <div className="mb-4 h-14 w-full animate-pulse rounded-2xl border" style={YUZA} />
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-12">
          <div className="hidden h-full animate-pulse rounded-2xl border md:col-span-3 md:block" style={YUZA} />
          <div className="h-[60vh] animate-pulse rounded-2xl border md:col-span-6 md:h-full" style={YUZA} />
          <div className="hidden h-full animate-pulse rounded-2xl border md:col-span-3 md:block" style={YUZA} />
        </div>
      </div>
    );
  }

  if (yuklashXatosi) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-6"
        style={{ background: "var(--v3-fon)", color: "var(--v3-matn)" }}
      >
        <div className="v3-modal text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: "var(--v3-yuza-2)" }}
          >
            ⚠️
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--v3-urgu)" }}>
            Ma&apos;lumot Yuklanmadi
          </h2>
          <p className="v3-xira mt-3 text-xs">
            Laboratoriya serveri bilan bog&apos;lanishda xatolik yuz berdi. Iltimos, qayta urinib
            ko&apos;ring.
          </p>
          <button
            type="button"
            onClick={yuklaLab}
            className="v3-tugma-asosiy mt-6 w-full justify-center"
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
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "var(--v3-fon)", color: "var(--v3-matn)" }}
    >
      <MobilOgohlantirish />

      {/* --- YUQORI SARLAVHA PANELI --- */}
      <header
        className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur-md"
        style={{ background: "var(--v3-fon-2)", borderColor: "var(--v3-chiziq)" }}
      >
        <div className="flex items-center gap-3">
          <a href="/laboratoriya" className="v3-tugma text-xs">
            ← Laboratoriya
          </a>
          <h1 className="flex items-center gap-2 text-sm font-bold tracking-wide sm:text-base">
            <span>🔬 3D Laboratoriya</span>
            {kuchsizQurilma && <span className="v3-chip">Arzon Rejim</span>}
          </h1>
        </div>

        {/* Daraja chizig'i va balans */}
        <div className="flex items-center gap-3">
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />

          <div className="hidden flex-col items-end sm:flex">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span style={{ color: "var(--v3-urgu)" }}>{daraja.daraja}-daraja</span>
              <span className="v3-xira">
                ({daraja.joriy} / {daraja.kerak} XP)
              </span>
            </div>
            <div
              className="mt-1 h-1.5 w-28 overflow-hidden rounded-full"
              style={{ background: "var(--v3-yuza-2)" }}
            >
              <div
                className="h-full transition-all"
                style={{ width: `${Math.min(100, daraja.foiz || 0)}%`, background: "var(--v3-urgu)" }}
              />
            </div>
          </div>

          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold"
            style={YUZA}
          >
            <span className="flex items-center gap-1">🪙 {balans.coins || 0}</span>
            <span className="v3-xira">|</span>
            <span className="flex items-center gap-1" style={{ color: "var(--v3-urgu-2)" }}>
              💎 {balans.gems || 0}
            </span>
          </div>
        </div>
      </header>

      {/* --- ASOSIY ISH MAYDONI (CANVAS VA JAVONLAR) --- */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Chap panel: Desktop da ikkita javon bloklari */}
        <aside
          className="hidden w-80 shrink-0 flex-col gap-3 border-r p-3 md:flex"
          style={{ borderColor: "var(--v3-chiziq)" }}
        >
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
        <div
          className="flex gap-2 border-b p-2 md:hidden"
          style={{ background: "var(--v3-fon-2)", borderColor: "var(--v3-chiziq)" }}
        >
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "reagentlar" ? null : "reagentlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            🧪 Reagentlar ({reagentlar.length})
          </button>
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "jihozlar" ? null : "jihozlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            🔬 Jihozlar ({hammaJihozlar.length}/6)
          </button>
        </div>

        {/* Mobil sirg'aluvchi varaq */}
        {mobilJavon && (
          <div
            className="absolute inset-x-0 top-12 z-40 h-80 p-3 shadow-2xl md:hidden"
            style={{ background: "var(--v3-fon-2)" }}
          >
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
        <main className="relative h-full min-h-[350px] w-full flex-1 overflow-hidden">
          <div ref={konteynerRef} className="absolute inset-0 h-full w-full" />

          {/* 3D interaktiv yordam matni */}
          <div
            className="pointer-events-none absolute left-4 top-4 rounded-xl border px-3 py-1.5 text-xs backdrop-blur-sm"
            style={YUZA}
          >
            💡{" "}
            {faolReagent
              ? `${faolReagent} tanlandi — quyish tugmasini bosib turing`
              : "Reagent tanlab idishga quying"}
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
      <footer
        className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 backdrop-blur-md"
        style={{ background: "var(--v3-fon-2)", borderColor: "var(--v3-chiziq)" }}
      >
        {/* Idishdagi joriy tarkib (real vaqtda) */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="v3-nishon">
              Joriy idish: {nishonIdishGroup?.userData?.kalit || "Probirka"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "var(--v3-urgu)" }}>
                {jamiMl.toFixed(1)} ml
              </span>
              <span className="v3-xira text-xs">({quyilganKalitlar.length} xil modda)</span>
            </div>
          </div>

          {/* Quyilgan moddalar nishoni */}
          <div className="hidden flex-wrap gap-1 sm:flex">
            {quyilganKalitlar.map((kalit) => {
              const ml = quyilganModdalar[kalit]?.ml || 0;
              const birlik = reagentBirligi(kalit);
              const rang = hexDanCss(moddaKorinishi(kalit).rang);
              return (
                <span
                  key={kalit}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs"
                  style={YUZA}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: rang }} />
                  {kalit}{" "}
                  <strong style={{ color: "var(--v3-urgu)" }}>
                    {miqdorniFormatla(hajmniBirlikka(ml, birlik), birlik)}
                  </strong>
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
            className={`v3-tugma select-none text-xs ${quyilmoqda ? "scale-95" : ""} ${
              !faolReagent || !nishonIdishGroup ? "cursor-not-allowed opacity-40" : ""
            }`}
            style={
              quyilmoqda
                ? { background: "var(--v3-urgu-2)", color: "var(--v3-urgu-matn)", borderColor: "var(--v3-urgu-2)" }
                : undefined
            }
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
            className={`v3-tugma-asosiy text-xs ${
              jamiMl <= 0 || otkazilmoqda ? "cursor-not-allowed opacity-40" : ""
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
            className="v3-tugma text-xs"
          >
            🗑️ Tozalash
          </button>
        </div>
      </footer>

      {/* --- QO'SHIMCHA 2D HAVOLA --- */}
      <div
        className="py-1.5 text-center text-[11px]"
        style={{ background: "var(--v3-fon)" }}
      >
        <a href="/laboratoriya" className="v3-xira hover:underline">
          2D ko&apos;rinishga qaytish → /laboratoriya
        </a>
      </div>
    </div>
  );
}
