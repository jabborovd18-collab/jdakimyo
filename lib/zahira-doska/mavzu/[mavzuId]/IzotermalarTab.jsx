// app/doska/[mavzuId]/IzotermalarTab.jsx
//
// Smart Doska — Kengaytirilgan Interaktiv Izotermalar & Grafik Simulyator.
// 1. Ko'p modelli taqqoslash (Lengmyur, Freyndlix, BET, Genri) va real adsorbentlar
// 2. IUPAC 6 turdagi izotermalar laboratoriyasi va klassifikatsiyasi (Slayd 16–25)
// 3. 2D Mikroskopik zarrachalar kinetikasi va dinamik muvozanat animatsiyasi
// 4. O'qituvchi uchun metodik qo'llanma va darslik slaydlari protokoli
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import LatexMatn from "@/components/LatexMatn";
import Ikon from "@/components/Ikon";
import {
  LENGMYUR_PRESETLARI,
  FREYNDLIX_PRESETLARI,
} from "./IzotermaGrafiklar";

// ═══ IUPAC 6 TURDAGI ADSORBSIYA IZOTERMALARI BAZASI (SLAYD 16–25) ═══
const IUPAC_IZOTERMALAR = [
  {
    tur: "I tur",
    nomi: "Mikrog'ovakli to'yinish izotermasi (Lengmyur turi)",
    govakTuri: "Mikrog'ovaklar (r < 2 nm) yoki Kimyosorbtsiya",
    adsorbent: "Faollashtirilgan ko'mir (BAU-A), Tseolitlar (NaX, ZSM-5)",
    adsorbat: "N₂ (77 K), Benzol bug'i, CO₂ gazi",
    tavsif:
      "Juda past nisbiy bosimda (p/p₀ < 0.1) egri chiziq keskin ko'tarilib, mikrog'ovaklar to'lgach gorizontal to'yinish platosiga (a_m) chiqadi. Yangi qatlam hosil bo'lmaydi.",
    mexanizm: "Hajmiy mikrog'ovaklar to'lishi (TVFM) va monomolekulyar Langmuir qoplami.",
    slayd: "Slayd 16–17",
    rang: "#10b981",
    path: "M 50,260 Q 70,110 120,95 L 480,95",
  },
  {
    tur: "II tur",
    nomi: "Polimolekulyar adsorbsiya izotermasi (BET klassik S-simon)",
    govakTuri: "G'ovaksiz yoki Makrog'ovakli (r > 50 nm) qattiq jismlar",
    adsorbent: "Dispers titan dioksidi (TiO₂), AEROSIL kremnezemi, Fe₂O₃",
    adsorbat: "N₂ (77 K), Suv bug'i (298 K)",
    tavsif:
      "S-simon egri chiziq. p/p₀ ≈ 0.15 atrofidagi 'B nuqta'da birinchi monoqavat to'ladi (θ = 1.0). Undan keyin cheksiz ko'p qatlamli kondensatsiya davom etadi.",
    mexanizm: "BET poliqatlamli adsorbsiyasi: 1-qatlamdan so'ng 2-, 3-qatlamlar suyuqlik kabi kondensatsiyalanadi.",
    slayd: "Slayd 18–19",
    rang: "#06b6d4",
    path: "M 50,260 Q 90,160 140,150 Q 260,140 380,100 Q 440,70 480,30",
  },
  {
    tur: "III tur",
    nomi: "Kuchsiz o'zaro ta'sir izotermasi (Qabariq pastga)",
    govakTuri: "G'ovaksiz yoki Makrog'ovakli gidrofob yuzalar",
    adsorbent: "Grafitlangan termik kuya (GTCB), Ftoroplast",
    adsorbat: "Suv bug'i (H₂O), Kuchsiz qutbli spirtlar",
    tavsif:
      "Adsorbent va adsorbat o'rtasidagi tortishish kuchsiz (C_BET < 2). Adsorbat molekulalarining o'zaro tortishishi kuchli bo'lgani sababli egri chiziq doimo yuqoriga qarab egiladi.",
    mexanizm: "Klasterli adsorbsiya: molekulalar sirtga emas, bir-birining ustiga o'tiradi.",
    slayd: "Slayd 20–21",
    rang: "#f59e0b",
    path: "M 50,260 Q 200,250 320,200 Q 420,130 480,30",
  },
  {
    tur: "IV tur",
    nomi: "Mezog'ovak kapillyar kondensatsiya va gisterezis",
    govakTuri: "Mezog'ovaklar (2 nm < r < 50 nm)",
    adsorbent: "Mezog'ovak silikagel (KSKG, MCM-41, SBA-15)",
    adsorbat: "N₂ (77 K), Benzol, n-Geksan",
    tavsif:
      "O'rta bosimlarda kapillyar kondensatsiya sababli adsorbsiya keskin sakraydi va desorbsiya paytida botiq menisk tufayli gisterezis sirtmog'i hosil bo'ladi.",
    mexanizm: "Kelvin tenglamasi: botiq menisk ustida to'yingan bug' bosimi tekis sirtdagidan past bo'ladi.",
    slayd: "Slayd 22–23",
    rang: "#8b5cf6",
    pathAds: "M 50,260 Q 100,180 180,170 Q 260,165 300,100 L 420,70 L 480,68",
    pathDes: "M 480,68 L 420,70 Q 320,75 240,140 Q 190,165 180,170",
  },
  {
    tur: "V tur",
    nomi: "Mezog'ovakli kuchsiz tortishish izotermasi",
    govakTuri: "Gidrofob mezog'ovakli sorbentlar",
    adsorbent: "Mezog'ovak faol ko'mir, Uglerod nanotrubkalari",
    adsorbat: "Suv bug'i (H₂O)",
    tavsif:
      "III tur kabi past bosimlarda juda sekin o'sadi, ammo mezog'ovaklar borligi sababli o'rta bosimlarda kapillyar to'lish va gisterezis yuz beradi.",
    mexanizm: "Kuchsiz sirt tortishuvi + mezog'ovaklar kapillyar kondensatsiyasi uyg'unligi.",
    slayd: "Slayd 24",
    rang: "#ec4899",
    pathAds: "M 50,260 Q 200,255 260,230 Q 320,190 350,110 L 440,80 L 480,78",
    pathDes: "M 480,78 L 440,80 Q 360,85 280,180 Q 265,225 260,230",
  },
  {
    tur: "VI tur",
    nomi: "Pog'onali polimolekulyar adsorbsiya",
    govakTuri: "Ideal tekis, energetik mutlaq bir jinsli sirt",
    adsorbent: "Yuqori haroratda grafitlangan termik kuya (GTCB)",
    adsorbat: "Kr (Kripton 77 K), Ar (Argon), Xe (Ksenon)",
    tavsif:
      "Har bir qatlam qat'iy ketma-ket to'ladi: 1-monoqavat to'liq to'lgach plato, keyin 2-qatlam, 3-qatlam pog'ona-pog'ona bo'lib o'sadi.",
    mexanizm: "Energetik bir jinslilik sababli qatlamlar bir-biriga xalaqit bermasdan bosqichma-bosqich hosil bo'ladi.",
    slayd: "Slayd 25",
    rang: "#0ea5e9",
    path: "M 50,260 L 110,260 L 120,200 L 220,200 L 230,140 L 340,140 L 350,80 L 480,80",
  },
];

export default function IzotermalarTab() {
  // Rejimlar: "simulyator" | "iupac" | "zarrachalar" | "metodika"
  const [faolRejim, setFaolRejim] = useState("simulyator");

  // ─── 1. SIMULYATOR PARAMETRLARI ───
  const [ce, setCe] = useState(4.5); // Muvozanat konsentratsiyasi (0..15 mmol/L)
  const [am, setAm] = useState(12); // Maksimal monoqavat sig'imi (4..20 mmol/g)
  const [k, setK] = useState(0.85); // Lengmyur doimiysi (0.1..2.5)
  const [harorat, setHarorat] = useState(298); // Kelvin (273..353 K)
  const [tanlanganPreset, setTanlanganPreset] = useState("maxsus"); // "maxsus" | preset.id
  const [korsatFreyndlix, setKorsatFreyndlix] = useState(true);
  const [korsatGenri, setKorsatGenri] = useState(true);
  const [korsatBet, setKorsatBet] = useState(false);

  // ─── 2. IUPAC REJIMI ───
  const [tanlanganIupac, setTanlanganIupac] = useState(0);

  // ─── 3. 2D MOLEKULYAR KINETIKA ANIMATSIYASI ───
  const [zarrachalarSoni, setZarrachalarSoni] = useState(24);
  const [animatsiyaFaol, setAnimatsiyaFaol] = useState(true);
  const canvasRef = useRef(null);

  // Harorat ta'siri koeffitsiyenti (Harorat oshganda ekzotermik adsorbsiya kamayadi - Le Shatelye)
  // ΔH < 0 bo'lgani sababli T oshsa muvozanat desorbsiya tomon siljiydi
  const haroratFaktori = Math.exp(-0.016 * (harorat - 298));

  // Joriy nuqtadagi hisob-kitoblar
  const joriyLengmyur = (am * k * ce * haroratFaktori) / (1 + k * ce);
  const joriyFreyndlix = 3.2 * Math.pow(Math.max(0.01, ce), 0.52) * haroratFaktori;
  const joriyGenri = am * k * ce * haroratFaktori * 0.35;
  const joriyBet = ((am * 0.7) * (ce / 15) * 80) / ((1 - ce / 16) * (1 + 79 * (ce / 16)));

  // Sirt markazlarining to'lishi (16 ta faol markaz)
  const jamiMarkazlar = 16;
  const bandMarkazlarSoni = Math.min(
    jamiMarkazlar,
    Math.round((joriyLengmyur / Math.max(0.1, am)) * jamiMarkazlar)
  );

  // Presetni qo'llash
  const presetQolla = (preset) => {
    setTanlanganPreset(preset.id);
    if (preset.am) setAm(preset.am * 2.5);
    if (preset.K) setK(preset.K / 40);
    if (preset.C) setCe(preset.C * 50);
  };

  // SVG grafik uchun koordinatalar generatsiyasi (C = 0..15 mmol/L)
  const grafikNuqtalar = useMemo(() => {
    const qadamlar = 35;
    const lNuqtalar = [];
    const fNuqtalar = [];
    const gNuqtalar = [];
    const bNuqtalar = [];

    const xMaks = 15;
    const yMaks = 22;

    for (let i = 0; i <= qadamlar; i++) {
      const cVal = (i / qadamlar) * xMaks;
      const lVal = (am * k * cVal * haroratFaktori) / (1 + k * cVal);
      const fVal = 3.2 * Math.pow(Math.max(0.001, cVal), 0.52) * haroratFaktori;
      const gVal = am * k * cVal * haroratFaktori * 0.35;

      // BET yaqinlashuvi
      const xBet = Math.min(0.92, cVal / 16);
      const bVal = ((am * 0.7) * xBet * 80) / ((1 - xBet) * (1 + 79 * xBet));

      const svgX = 55 + (cVal / xMaks) * 420;
      const svgYL = 260 - (Math.min(yMaks, lVal) / yMaks) * 230;
      const svgYF = 260 - (Math.min(yMaks, fVal) / yMaks) * 230;
      const svgYG = 260 - (Math.min(yMaks, gVal) / yMaks) * 230;
      const svgYB = 260 - (Math.min(yMaks, bVal) / yMaks) * 230;

      lNuqtalar.push(`${svgX.toFixed(1)},${svgYL.toFixed(1)}`);
      fNuqtalar.push(`${svgX.toFixed(1)},${svgYF.toFixed(1)}`);
      gNuqtalar.push(`${svgX.toFixed(1)},${svgYG.toFixed(1)}`);
      bNuqtalar.push(`${svgX.toFixed(1)},${svgYB.toFixed(1)}`);
    }

    const joriySvgX = 55 + (ce / xMaks) * 420;
    const joriySvgYL = 260 - (Math.min(yMaks, joriyLengmyur) / yMaks) * 230;

    return {
      lPath: lNuqtalar.join(" "),
      fPath: fNuqtalar.join(" "),
      gPath: gNuqtalar.join(" "),
      bPath: bNuqtalar.join(" "),
      joriySvgX,
      joriySvgYL,
    };
  }, [am, k, ce, haroratFaktori, joriyLengmyur]);

  // ─── 2D KANVAS ZARRACHALAR ANIMATSIYASI ───
  useEffect(() => {
    if (faolRejim !== "zarrachalar" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    const w = canvas.width;
    const h = canvas.height;
    const sirtY = h - 35; // Sirt gorizonti

    // Zarrachalarni initsializatsiya qilish
    const zarrachalar = Array.from({ length: zarrachalarSoni }).map(() => ({
      x: Math.random() * (w - 20) + 10,
      y: Math.random() * (sirtY - 50) + 20,
      vx: (Math.random() - 0.5) * (harorat / 120),
      vy: (Math.random() - 0.5) * (harorat / 120),
      adsorbsiyalangan: false,
      adsorbsiyaVaqti: 0,
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Fazoviy hajm foni
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, sirtY);

      // 2. Qattiq adsorbent sirti
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, sirtY, w, h - sirtY);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, sirtY);
      ctx.lineTo(w, sirtY);
      ctx.stroke();

      // Sirt faol markazlari (16 ta)
      const markazKenglik = w / 16;
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = i < bandMarkazlarSoni ? "#10b98133" : "#33415533";
        ctx.fillRect(i * markazKenglik + 2, sirtY + 4, markazKenglik - 4, 18);
        ctx.strokeStyle = i < bandMarkazlarSoni ? "#10b981" : "#475569";
        ctx.lineWidth = 1;
        ctx.strokeRect(i * markazKenglik + 2, sirtY + 4, markazKenglik - 4, 18);
      }

      // 3. Zarrachalar harakati va adsorbsiya/desorbsiya
      zarrachalar.forEach((z) => {
        if (!z.adsorbsiyalangan) {
          z.x += z.vx;
          z.y += z.vy;

          // Devorlardan qaytish
          if (z.x < 8 || z.x > w - 8) z.vx *= -1;
          if (z.y < 8) z.vy *= -1;

          // Sirtga yetib kelganda adsorbsiya bo'lish ehtimoli
          if (z.y >= sirtY - 8) {
            const adsorbsiyaEhtimoli = (k * 0.4) * (1 - bandMarkazlarSoni / jamiMarkazlar);
            if (Math.random() < adsorbsiyaEhtimoli) {
              z.adsorbsiyalangan = true;
              z.y = sirtY - 6;
              z.adsorbsiyaVaqti = Date.now();
            } else {
              z.vy = -Math.abs(z.vy); // Qaytib ketish
            }
          }
        } else {
          // Adsorbsiyalangan zarrachaning harorat tufayli desorbsiyalanishi
          const yashashVaqti = Date.now() - z.adsorbsiyaVaqti;
          const desorbsiyaEhtimoli = 0.003 * (harorat / 273);
          if (yashashVaqti > 800 && Math.random() < desorbsiyaEhtimoli) {
            z.adsorbsiyalangan = false;
            z.vy = -((Math.random() * 2 + 1) * (harorat / 220));
            z.vx = (Math.random() - 0.5) * 2;
          }
        }

        // Zarrachani chizish
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.adsorbsiyalangan ? 6 : 5, 0, Math.PI * 2);
        ctx.fillStyle = z.adsorbsiyalangan ? "#10b981" : "#38bdf8";
        ctx.shadowColor = z.adsorbsiyalangan ? "#10b981" : "#38bdf8";
        ctx.shadowBlur = z.adsorbsiyalangan ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (animatsiyaFaol) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [faolRejim, zarrachalarSoni, harorat, k, bandMarkazlarSoni, jamiMarkazlar, animatsiyaFaol]);

  return (
    <div className="space-y-6">
      {/* ═══ ASOSIY REJIMLAR TANLOVI (4 TA BO'LIM) ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFaolRejim("simulyator")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              faolRejim === "simulyator"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ikon nom="grafik" olcham={16} />
            <span>1. Ko&apos;p Modelli Simulyator</span>
          </button>

          <button
            onClick={() => setFaolRejim("iupac")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              faolRejim === "iupac"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ikon nom="kitob" olcham={16} />
            <span>2. IUPAC 6 Turdagi Izotermalar</span>
          </button>

          <button
            onClick={() => setFaolRejim("zarrachalar")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              faolRejim === "zarrachalar"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ikon nom="atom" olcham={16} />
            <span>3. 2D Molekulyar Kinetika</span>
          </button>

          <button
            onClick={() => setFaolRejim("metodika")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              faolRejim === "metodika"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ikon nom="ustoz" olcham={16} />
            <span>4. Darslik Metodikasi</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-xl">
          Slayd 16–35 • Universitet Standarti
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          REJIM 1: KO'P MODELLI IZOTERMALAR SIMULYATORI VA SOLISHTIRISH
         ═══════════════════════════════════════════════════════════════════════ */}
      {faolRejim === "simulyator" && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Sarlavha va model yoqish tugmalari */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Interaktiv Dinamik Simulyator
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Lengmyur, Freyndlix va BET Modellari Taqqoslanishi
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Konsentratsiya va haroratni o&apos;zgartirib, egri chiziqlar o&apos;zaro kesishuvi va to&apos;yinish platosini kuzating.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setKorsatFreyndlix(!korsatFreyndlix)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  korsatFreyndlix
                    ? "bg-amber-950/80 border-amber-500/80 text-amber-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                Freyndlix (K_F)
              </button>
              <button
                onClick={() => setKorsatGenri(!korsatGenri)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  korsatGenri
                    ? "bg-sky-950/80 border-sky-500/80 text-sky-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                Genri (K_H)
              </button>
              <button
                onClick={() => setKorsatBet(!korsatBet)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  korsatBet
                    ? "bg-purple-950/80 border-purple-500/80 text-purple-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                BET (Poliqatlam)
              </button>
            </div>
          </div>

          {/* Real namunalar (Presetlar) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Haqiqiy sanoat va laboratoriya namunalari (Presetlar):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LENGMYUR_PRESETLARI.map((p) => {
                const faol = tanlanganPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => presetQolla(p)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      faol
                        ? "bg-emerald-950/80 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-white truncate">{p.nom}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.tavsif}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asosiy SVG grafik va boshqaruv paneli */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* SVG GRAFIK CHIZMASI */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 border border-slate-800/80 shadow-inner">
              <div className="relative w-full aspect-[16/10]">
                <svg className="w-full h-full select-none" viewBox="0 0 500 300">
                  {/* To'rlar (Grid) */}
                  <line x1="55" y1="30" x2="55" y2="260" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="55" y1="260" x2="480" y2="260" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="55" y1="145" x2="480" y2="145" stroke="#1e293b" strokeDasharray="4" strokeWidth="1" />
                  <line x1="265" y1="30" x2="265" y2="260" stroke="#1e293b" strokeDasharray="4" strokeWidth="1" />

                  {/* To'yinish chegarasi (am chizig'i) */}
                  <line
                    x1="55"
                    y1={260 - (am / 22) * 230}
                    x2="480"
                    y2={260 - (am / 22) * 230}
                    stroke="#10b981"
                    strokeDasharray="4 3"
                    strokeWidth="1.2"
                    opacity="0.8"
                  />
                  <text x="475" y={252 - (am / 22) * 230} fill="#10b981" fontSize="10" textAnchor="end" fontWeight="bold">
                    a_m to&apos;yinish platosi ({am} mmol/g)
                  </text>

                  {/* Freyndlix egri chizig'i */}
                  {korsatFreyndlix && (
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      points={grafikNuqtalar.fPath}
                    />
                  )}

                  {/* Genri chizig'i */}
                  {korsatGenri && (
                    <polyline
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2"
                      points={grafikNuqtalar.gPath}
                    />
                  )}

                  {/* BET chizig'i */}
                  {korsatBet && (
                    <polyline
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      points={grafikNuqtalar.bPath}
                    />
                  )}

                  {/* Lengmyur egri chizig'i */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    points={grafikNuqtalar.lPath}
                  />

                  {/* Joriy konsentratsiya va ishchi nuqta */}
                  <line
                    x1={grafikNuqtalar.joriySvgX}
                    y1="30"
                    x2={grafikNuqtalar.joriySvgX}
                    y2="260"
                    stroke="#ffffff"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <circle
                    cx={grafikNuqtalar.joriySvgX}
                    cy={grafikNuqtalar.joriySvgYL}
                    r="8"
                    fill="#10b981"
                    opacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={grafikNuqtalar.joriySvgX}
                    cy={grafikNuqtalar.joriySvgYL}
                    r="6"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* O'q yozuvlari */}
                  <text x="475" y="285" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">
                    C_e (mmol/L) →
                  </text>
                  <text x="60" y="22" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    ↑ Adsorbsiya a (mmol/g)
                  </text>
                  <text x="48" y="275" fill="#64748b" fontSize="11">0</text>
                  <text x="465" y="275" fill="#64748b" fontSize="11">15</text>
                  <text x="30" y="38" fill="#64748b" fontSize="11">22</text>
                </svg>
              </div>

              {/* Afsona (Legend) */}
              <div className="flex flex-wrap items-center justify-center gap-5 pt-3 border-t border-slate-900 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-4 h-1 bg-emerald-500 rounded" /> Lengmyur: a = a_m·(KC)/(1+KC)
                </span>
                {korsatFreyndlix && (
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-4 h-1 bg-amber-500 rounded border-dashed" /> Freyndlix: a = K_F·C^(1/n)
                  </span>
                )}
                {korsatGenri && (
                  <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <span className="w-4 h-1 bg-sky-500 rounded" /> Genri: a = K_H·C
                  </span>
                )}
                {korsatBet && (
                  <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <span className="w-4 h-1 bg-purple-500 rounded" /> BET (Poliqatlam)
                  </span>
                )}
              </div>
            </div>

            {/* SLAYDERLAR VA SIRT BANDLIGI */}
            <div className="lg:col-span-4 space-y-4">
              {/* Konsentratsiya slayderi */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Muvozanat konsentratsiyasi (C_e):</span>
                  <span className="font-mono text-emerald-400 font-bold">{ce} mmol/L</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="15"
                  step="0.2"
                  value={ce}
                  onChange={(e) => setCe(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.2 (Genri sohasi)</span>
                  <span>15.0 (To&apos;yinish)</span>
                </div>
              </div>

              {/* Harorat slayderi */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Harorat (T):</span>
                  <span className="font-mono text-amber-400 font-bold">{harorat} K ({(harorat - 273.15).toFixed(0)}°C)</span>
                </div>
                <input
                  type="range"
                  min="273"
                  max="353"
                  step="2"
                  value={harorat}
                  onChange={(e) => setHarorat(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Le Shatelye: Ekzotermik adsorbsiyada (ΔH &lt; 0) T oshsa, desorbsiya kuchayadi va a kamayadi.
                </div>
              </div>

              {/* Monoqavat sig'imi (a_m) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Maksimal sig&apos;im (a_m):</span>
                  <span className="font-mono text-cyan-400 font-bold">{am} mmol/g</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={am}
                  onChange={(e) => setAm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Sirt to'lish indikatori */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Sirtning qoplanish darajasi (θ):</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {((bandMarkazlarSoni / jamiMarkazlar) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${(bandMarkazlarSoni / jamiMarkazlar) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  a = <b>{joriyLengmyur.toFixed(2)}</b> mmol/g • {bandMarkazlarSoni}/{jamiMarkazlar} faol markaz band
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          REJIM 2: IUPAC 6 TURDAGI ADSORBSIYA IZOTERMALARI ENSIKLOPEDIYASI
         ═══════════════════════════════════════════════════════════════════════ */}
      {faolRejim === "iupac" && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              IUPAC 1985 / 2015 Standart Klassifikatsiyasi
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Fizikaviy Adsorbsiya Izotermalarining 6 ta Asosiy Turi (Slayd 16–25)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              G&apos;ovak o&apos;lchamlari va adsorbent-adsorbat o&apos;zaro ta&apos;sir kuchiga qarab izotermalar shakli qat&apos;iy farqlanadi.
            </p>
          </div>

          {/* 6 ta tur kartalari */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {IUPAC_IZOTERMALAR.map((item, idx) => {
              const faol = tanlanganIupac === idx;
              return (
                <button
                  key={item.tur}
                  onClick={() => setTanlanganIupac(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    faol
                      ? "border-emerald-400 bg-emerald-950/70 text-white ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/50"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <div
                    className="text-xs font-black uppercase font-mono mb-1"
                    style={{ color: item.rang }}
                  >
                    {item.tur}
                  </div>
                  <div className="font-bold text-xs text-white line-clamp-1">{item.nomi.split(" ")[0]}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.govakTuri}</div>
                </button>
              );
            })}
          </div>

          {/* Tanlangan IUPAC turining chuqur tahlili */}
          {(() => {
            const faolItem = IUPAC_IZOTERMALAR[tanlanganIupac] || IUPAC_IZOTERMALAR[0];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 rounded-2xl p-6 border border-slate-800">
                {/* SVG Chizma */}
                <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
                  <div className="flex justify-between items-center mb-2 px-1 text-xs">
                    <span className="font-bold" style={{ color: faolItem.rang }}>
                      {faolItem.tur}: {faolItem.nomi}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{faolItem.slayd}</span>
                  </div>
                  <div className="relative w-full aspect-[16/10]">
                    <svg className="w-full h-full select-none" viewBox="0 0 500 300">
                      <line x1="50" y1="20" x2="50" y2="260" stroke="#334155" strokeWidth="1.5" />
                      <line x1="50" y1="260" x2="480" y2="260" stroke="#334155" strokeWidth="1.5" />

                      {/* Egri chiziq */}
                      {faolItem.path && (
                        <path
                          d={faolItem.path}
                          fill="none"
                          stroke={faolItem.rang}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* IV va V tur gisterezisi */}
                      {faolItem.pathAds && (
                        <>
                          <path
                            d={faolItem.pathAds}
                            fill="none"
                            stroke={faolItem.rang}
                            strokeWidth="3"
                          />
                          <path
                            d={faolItem.pathDes}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2.5"
                            strokeDasharray="4 2"
                          />
                          <text x="350" y="60" fill="#f43f5e" fontSize="9" fontWeight="bold">
                            Desorbsiya shoxi (Gisterezis)
                          </text>
                          <text x="240" y="190" fill={faolItem.rang} fontSize="9" fontWeight="bold">
                            Adsorbsiya shoxi
                          </text>
                        </>
                      )}

                      <text x="475" y="285" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
                        Nisbiy bosim (p / p₀) →
                      </text>
                      <text x="55" y="18" fill="#94a3b8" fontSize="10" fontWeight="bold">
                        ↑ Adsorbsiya a (mmol/g)
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Ilmiy tahlil va namunalar */}
                <div className="lg:col-span-6 space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      🔬 G&apos;ovak tuzilishi & Morfologiya:
                    </span>
                    <span className="font-semibold text-white text-sm">{faolItem.govakTuri}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      💡 Fizikaviy mexanizmi:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{faolItem.mexanizm}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">Adsorbent namunasi:</span>
                      <span className="text-white font-medium mt-0.5 block">{faolItem.adsorbent}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Adsorbat gazi:</span>
                      <span className="text-white font-medium mt-0.5 block">{faolItem.adsorbat}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 leading-relaxed">
                    📖 <b>Darslik xulosasi:</b> {faolItem.tavsif}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          REJIM 3: 2D MOLEKULYAR KINETIKA VA DINAMIK MUVOZANAT ANIMATSIYASI
         ═══════════════════════════════════════════════════════════════════════ */}
      {faolRejim === "zarrachalar" && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Mikroskopik Simulyatsiya
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Molekulalarning Dinamik Adsorbsiyasi va Desorbsiyasi
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Moviy sharchalar — erkin gaz/eritma molekulalari; Yashil sharchalar — sirtga birikkan molekulalar.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnimatsiyaFaol(!animatsiyaFaol)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  animatsiyaFaol
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                <span>{animatsiyaFaol ? "⏸ To'xtatish" : "▶ Davom ettirish"}</span>
              </button>
              <button
                onClick={() => setZarrachalarSoni((n) => Math.min(60, n + 8))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition"
              >
                +8 Zarracha
              </button>
            </div>
          </div>

          {/* Canvas interaktiv oynasi */}
          <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full block"
            />
          </div>

          {/* Pastki ko'rsatkichlar va boshqaruv */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Dinamik muvozanat tezliklari:</span>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-slate-500 block text-[9px]">Adsorbsiya (v_ads):</span>
                  <span className="text-emerald-400 font-bold text-base">
                    {(ce * 0.45 * (1 - bandMarkazlarSoni / jamiMarkazlar)).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Desorbsiya (v_des):</span>
                  <span className="text-amber-400 font-bold text-base">
                    {((harorat / 298) * (bandMarkazlarSoni / jamiMarkazlar) * 1.8).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Harorat va kinetik energiya:</span>
              <div className="text-amber-400 font-bold text-base mt-2">
                {harorat} K <span className="text-xs text-slate-400 font-normal">({(harorat - 273.15).toFixed(0)}°C)</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">E_kin ~ (3/2)·k_B·T</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Monomolekulyar qatlam bandligi:</span>
              <div className="text-emerald-400 font-bold text-base mt-2">
                {bandMarkazlarSoni} / {jamiMarkazlar} faol markaz
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Langmuir postulati: bitta markazda 1 dona molekula
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          REJIM 4: DARSLIK METODIKASI VA O'QITUVCHI PROTOKOLI
         ═══════════════════════════════════════════════════════════════════════ */}
      {faolRejim === "metodika" && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Smart Doska Dars Rejasi & Metodika
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Auditoriyada Doskadan Foydalanish Yo&apos;riqnomasi (Slayd 16–35)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              O&apos;qituvchilar uchun dars jarayonida talabalarga sirt hodisalarini qadam-baqadam namoyish etish ketma-ketligi.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qadam: "1-Qadam",
                sarlavha: "Lengmyur to'yinish platosini ko'rsatish (Slayd 16)",
                matn: "1-rejimda konsentratsiyani (C) 0 dan 15 mmol/L ga oshiring. O'quvchilarga boshida to'g'ri chiziq (Genri sohasi), keyin esa egri chiziq gorizontal a_m platosiga yotishini ko'rsating. 'Nega yangi molekulalar birikmayapti?' savolini bering (Monoqavat to'ldi!).",
              },
              {
                qadam: "2-Qadam",
                sarlavha: "Harorat ta'sirini isbotlash (Le Shatelye, Slayd 34)",
                matn: "Harorat slayderini 298 K dan 353 K ga ko'taring. Butun egri chiziq pastga tushishini ko'rsating. Xulosa: fizikaviy adsorbsiya ekzotermik (ΔH < 0), harorat oshganda desorbsiya kuchayadi.",
              },
              {
                qadam: "3-Qadam",
                sarlavha: "Freyndlix bilan taqqoslash (Slayd 18)",
                matn: "Freyndlix tugmasini yoqing. Real geterogen tuproq yoki torfda plato yo'qligini, sirt notekisligi sababli logarifmik o'sish davom etishini tushuntiring.",
              },
              {
                qadam: "4-Qadam",
                sarlavha: "IUPAC 6 turdagi izotermalarni tahlil qilish (Slayd 22)",
                matn: "2-rejimga o'tib, IV turdagi gisterezis sirtmog'ini ko'rsating: 'Nega adsorbsiya va desorbsiya bir xil chiziqdan bormaydi?' (Kelvin meniski tufayli bug' botiq sirtda ertaroq kondensatsiyalanadi).",
              },
            ].map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    {d.qadam}
                  </span>
                  <span className="text-sm font-bold text-white">{d.sarlavha}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1 pt-1">{d.matn}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
