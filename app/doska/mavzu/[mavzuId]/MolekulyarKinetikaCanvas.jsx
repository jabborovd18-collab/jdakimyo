// app/doska/mavzu/[mavzuId]/MolekulyarKinetikaCanvas.jsx
//
// Smart Doska — 60 FPS HTML5 Canvas Molekulyar Dinamikasi va Kinetika Simulyatori.
// 1. Haqiqiy Brown harakati va Maksvell-Bolsman tezlik taqsimoti
// 2. Dinamik adsorbsiya (energetik ushlanish) va desorbsiya (termik ajralish)
// 3. Play / Pause / 0.5x / 1x / 2x Tezlik boshqaruvi
// 4. Yuqori aniqlikdagi Retina / 4K Smart Doska renderlash
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Ikon from "@/components/Ikon";

export default function MolekulyarKinetikaCanvas({
  modulId = "lengmyur-regressiya",
  konsentratsiya = 0.05,
  harorat = 298,
  qoplanishUlishi = 0.5,
  am = 4.5,
  param1 = 1,
  nom = "Molekulyar Kinetika",
}) {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Boshqaruv holatlari
  const [faol, setFaol] = useState(true); // true = Play, false = Pause
  const [tezlik, setTezlik] = useState(1); // 0.5 | 1 | 2
  const [statistikalar, setStatistikalar] = useState({
    erkinSoni: 0,
    boglanganiSoni: 0,
    vAds: "0.0",
    vDes: "0.0",
  });

  // Simulyatsiya o'zgaruvchilari (Ref orqali saqlanadi, har bir renderda qayta yaratilmasligi uchun)
  const zarrachalarRef = useRef([]);
  const markazlarRef = useRef([]);
  const chaqnashlarRef = useRef([]); // Adsorbsiyadagi yorug'lik halqalari
  const oxirgiVaqtRef = useRef(0);
  const adsSanoqRef = useRef(0);
  const desSanoqRef = useRef(0);
  const olchovRef = useRef({ w: 600, h: 220, dpr: 1 });

  // ─── 1. SIMULYATSIYA MARKAZLARINI YARATISH ───
  const initMarkazlar = useCallback((w, h) => {
    const markazlar = [];
    const surfaceY = h - 45;

    if (modulId === "lengmyur-regressiya") {
      // 20 ta bir xil energetik markaz
      const soni = 20;
      const step = (w - 60) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        markazlar.push({
          id: i,
          x: 30 + i * step,
          y: surfaceY,
          energiya: 45, // kJ/mol
          band: false,
          zarrachaId: null,
          qavat: 1,
        });
      }
    } else if (modulId === "freyndlix-regressiya") {
      // 16 ta turli energetik o'ralar (65 kJ -> 15 kJ)
      const soni = 16;
      const step = (w - 60) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        const u = i / (soni - 1);
        const e = Math.round(65 - Math.pow(u, 0.6) * 50);
        markazlar.push({
          id: i,
          x: 30 + i * step,
          y: surfaceY,
          energiya: e,
          band: false,
          zarrachaId: null,
          qavat: 1,
        });
      }
    } else if (modulId === "bet-modeli") {
      // 14 ta ko'p qatlamli ustun
      const soni = 14;
      const step = (w - 60) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        markazlar.push({
          id: i,
          x: 30 + i * step,
          y: surfaceY,
          energiya: 50,
          qatlamlar: [], // birikkan zarrachalar ID lari
          maxQatlam: 4,
        });
      }
    } else if (modulId === "gibbs-sirt-taranglik") {
      // Suv-havo sirtidagi 18 ta SFM uyasi
      const soni = 18;
      const step = (w - 60) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        markazlar.push({
          id: i,
          x: 30 + i * step,
          y: h * 0.48, // Suv yuzasi o'rtada
          band: false,
          zarrachaId: null,
        });
      }
    } else if (modulId === "kelvin-kapillyar") {
      // Nanog'ovak ichki tubi
      const soni = 14;
      const minX = w * 0.28;
      const maxX = w * 0.72;
      const step = (maxX - minX) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        markazlar.push({
          id: i,
          x: minX + i * step,
          y: surfaceY - 10,
          band: false,
          zarrachaId: null,
        });
      }
    } else {
      // Default: 18 ta markaz
      const soni = 18;
      const step = (w - 60) / (soni - 1);
      for (let i = 0; i < soni; i++) {
        markazlar.push({
          id: i,
          x: 30 + i * step,
          y: surfaceY,
          energiya: 40,
          band: false,
          zarrachaId: null,
        });
      }
    }

    markazlarRef.current = markazlar;
  }, [modulId]);

  // ─── 2. ZARRACHALARNI YARATISH VA BOSHQARISH ───
  const initZarrachalar = useCallback((w, h) => {
    // Konsentratsiyaga qarab jami zarrachalar soni (15..55 oralig'ida)
    const jamiZarracha = Math.min(55, Math.max(12, Math.round(konsentratsiya * 350 + 10)));
    const zarrachalar = [];
    const speedScale = Math.sqrt(harorat / 298);

    for (let i = 0; i < jamiZarracha; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.8 + Math.random() * 1.4) * speedScale;
      zarrachalar.push({
        id: "z_" + i,
        x: 20 + Math.random() * (w - 40),
        y: 20 + Math.random() * (h * 0.6),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5.5,
        holat: "erkin", // "erkin" | "bog'langan"
        markazId: null,
        qavat: 0,
        tebranishFazasi: Math.random() * Math.PI * 2,
        rang: "#38bdf8",
      });
    }

    zarrachalarRef.current = zarrachalar;
  }, [konsentratsiya, harorat]);

  // ─── 3. CANVASH O'LCHAMINI SOZLASH VA QAYTA ISHGA TUSHIRISH ───
  const qaytaBoshla = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 220;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    olchovRef.current = { w, h, dpr };

    initMarkazlar(w, h);
    initZarrachalar(w, h);
    chaqnashlarRef.current = [];
  }, [initMarkazlar, initZarrachalar]);

  useEffect(() => {
    qaytaBoshla();
    window.addEventListener("resize", qaytaBoshla);
    return () => window.removeEventListener("resize", qaytaBoshla);
  }, [qaytaBoshla]);

  // Konsentratsiya yoki harorat o'zgarganda zarrachalar sonini sinxronlashtirish
  useEffect(() => {
    const { w, h } = olchovRef.current;
    if (w > 0 && h > 0) {
      initZarrachalar(w, h);
    }
  }, [konsentratsiya, harorat, initZarrachalar]);

  // ─── 4. ASOSIY 60 FPS FIZIKA VA RENDERLASH SIKLI ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let oxirgiStatistikaVaqti = Date.now();

    const loop = (hozirgiVaqt) => {
      animFrameIdRef.current = requestAnimationFrame(loop);

      const deltaMs = oxirgiVaqtRef.current ? hozirgiVaqt - oxirgiVaqtRef.current : 16.6;
      oxirgiVaqtRef.current = hozirgiVaqt;

      const dt = Math.min(0.05, deltaMs / 1000) * tezlik;
      const { w, h, dpr } = olchovRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // ─── FON VA SIRT CHIZISH ───
      const surfaceY = h - 45;

      if (modulId === "gibbs-sirt-taranglik") {
        // Suv havzasi foni
        const suvY = h * 0.48;
        ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
        ctx.fillRect(0, 0, w, suvY);
        const suvGrad = ctx.createLinearGradient(0, suvY, 0, h);
        suvGrad.addColorStop(0, "rgba(2, 132, 199, 0.35)");
        suvGrad.addColorStop(1, "rgba(8, 47, 73, 0.85)");
        ctx.fillStyle = suvGrad;
        ctx.fillRect(0, suvY, w, h - suvY);

        // Suv sathi chizig'i
        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(0, suvY);
        ctx.lineTo(w, suvY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (modulId === "kelvin-kapillyar") {
        // Nanog'ovak naychasi devorlari
        const minX = w * 0.25;
        const maxX = w * 0.75;

        // Devorlar
        ctx.fillStyle = "#3b0764";
        ctx.fillRect(minX - 25, 10, 25, h - 20);
        ctx.fillRect(maxX, 10, 25, h - 20);

        ctx.strokeStyle = "#9333ea";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(minX - 25, 10, 25, h - 20);
        ctx.strokeRect(maxX, 10, 25, h - 20);

        // Tubi
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(minX, surfaceY, maxX - minX, 35);
        ctx.strokeStyle = "#6366f1";
        ctx.strokeRect(minX, surfaceY, maxX - minX, 35);
      } else {
        // Standart qattiq adsorbent sirti
        const sirtGrad = ctx.createLinearGradient(0, surfaceY, 0, h);
        sirtGrad.addColorStop(0, "#334155");
        sirtGrad.addColorStop(1, "#0f172a");
        ctx.fillStyle = sirtGrad;
        ctx.fillRect(15, surfaceY, w - 30, h - surfaceY - 5);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(15, surfaceY, w - 30, h - surfaceY - 5);

        // Sirt yozuvi
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("ADSORBENTNING FAOL SIRTI (POTENSIAL O'RALAR)", w / 2, surfaceY + 22);
      }

      // ─── FAOL MARKAZLARNI CHIZISH ───
      const markazlar = markazlarRef.current;
      markazlar.forEach((m) => {
        if (modulId === "freyndlix-regressiya") {
          // Chuqurligi har xil U-o'ralar
          const depth = (m.energiya / 65) * 25;
          ctx.beginPath();
          ctx.arc(m.x, m.y - 2, 7, 0, Math.PI);
          ctx.strokeStyle = m.band ? "#f59e0b" : "#64748b";
          ctx.lineWidth = m.band ? 2 : 1;
          ctx.stroke();

          // Energiya nishoni
          ctx.fillStyle = m.band ? "#fde68a" : "#475569";
          ctx.font = "8px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`${m.energiya}k`, m.x, m.y + 12);
        } else if (modulId !== "gibbs-sirt-taranglik") {
          // Standart markaz
          ctx.beginPath();
          ctx.arc(m.x, m.y - 2, 6, 0, Math.PI * 2);
          ctx.strokeStyle = m.band ? "#10b981" : "#475569";
          ctx.lineWidth = 1.5;
          ctx.setLineDash(m.band ? [] : [2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // ─── CHAQNASH HALQALARI (ENERGETIK TO'LQINLAR) ───
      const chaqnashlar = chaqnashlarRef.current;
      for (let i = chaqnashlar.length - 1; i >= 0; i--) {
        const c = chaqnashlar[i];
        if (faol) {
          c.r += dt * 35;
          c.alpha -= dt * 2.2;
        }
        if (c.alpha <= 0) {
          chaqnashlar.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, c.alpha)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // ─── ZARRACHALAR FIZIKASI VA RENDERLASH ───
      const zarrachalar = zarrachalarRef.current;
      let erkinCount = 0;
      let boglanganCount = 0;

      zarrachalar.forEach((z) => {
        if (z.holat === "erkin") {
          erkinCount++;

          if (faol) {
            // Brown harakati (tasodifiy tebranishlar)
            z.vx += (Math.random() - 0.5) * 0.15;
            z.vy += (Math.random() - 0.5) * 0.15;

            // Tezlik cheklovi
            const maxSpd = 3.5 * Math.sqrt(harorat / 298);
            z.vx = Math.max(-maxSpd, Math.min(maxSpd, z.vx));
            z.vy = Math.max(-maxSpd, Math.min(maxSpd, z.vy));

            z.x += z.vx * dt * 60;
            z.y += z.vy * dt * 60;

            // Devorlardan qaytish
            if (z.x < z.radius + 15) {
              z.x = z.radius + 15;
              z.vx = Math.abs(z.vx);
            }
            if (z.x > w - z.radius - 15) {
              z.x = w - z.radius - 15;
              z.vx = -Math.abs(z.vx);
            }
            if (z.y < z.radius + 10) {
              z.y = z.radius + 10;
              z.vy = Math.abs(z.vy);
            }

            // Sirtga yaqinlashganda adsorbsiya bo'lishi
            const yaqinY = modulId === "gibbs-sirt-taranglik" ? h * 0.48 : surfaceY - 12;

            if (z.y >= yaqinY && z.vy > 0) {
              // Bo'sh markazni qidirish
              const ochiqMarkazlar = markazlar.filter((m) => !m.band);

              if (ochiqMarkazlar.length > 0) {
                // Eng yaqin markazni topish
                let engYaqin = null;
                let engKichikMasofa = 35; // Piksel masofa chegarasi

                ochiqMarkazlar.forEach((m) => {
                  const d = Math.abs(z.x - m.x);
                  if (d < engKichikMasofa) {
                    engKichikMasofa = d;
                    engYaqin = m;
                  }
                });

                if (engYaqin) {
                  // Adsorbsiya yuz berdi!
                  z.holat = "bog'langan";
                  z.markazId = engYaqin.id;
                  engYaqin.band = true;
                  engYaqin.zarrachaId = z.id;
                  adsSanoqRef.current++;

                  // Chaqnash halqasi qo'shish
                  chaqnashlarRef.current.push({
                    x: engYaqin.x,
                    y: engYaqin.y - 6,
                    r: 4,
                    alpha: 0.9,
                  });
                } else {
                  // Sirtga urilib qaytdi
                  z.vy = -Math.abs(z.vy);
                }
              } else {
                // Sirt to'la, qaytadi
                z.vy = -Math.abs(z.vy);
              }
            }
          }

          // Erkin zarrachani chizish
          ctx.beginPath();
          ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.fill();
          ctx.strokeStyle = "#e0f2fe";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Kichik porlash nuqtasi
          ctx.beginPath();
          ctx.arc(z.x - 1.5, z.y - 1.5, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        } else if (z.holat === "bog'langan") {
          boglanganCount++;
          const m = markazlar.find((mk) => mk.id === z.markazId);

          if (m) {
            if (faol) {
              // Markazda garmonik tebranish (haroratga bog'liq)
              z.tebranishFazasi += dt * 15 * (harorat / 298);
              const tebranishAmplituda = 0.8 * (harorat / 298);
              z.x = m.x + Math.sin(z.tebranishFazasi) * tebranishAmplituda;
              z.y = m.y - 8 + Math.cos(z.tebranishFazasi * 0.8) * (tebranishAmplituda * 0.5);

              // ─── DESORBSIYA EHTIMOLLIGI ───
              // Harorat T qancha baland bo'lsa va faol markaz energiyasi qancha past bo'lsa,
              // desorbsiya shunchalik tez yuz beradi (Arrhenius e^-E/RT qonuni)
              const E = m.energiya || 45;
              const desorbsiyaEhtimoli = (0.008 * (harorat / 298) * Math.exp(-E / 55)) * dt * 60;

              if (Math.random() < desorbsiyaEhtimoli) {
                // Desorbsiya yuz berdi!
                z.holat = "erkin";
                z.markazId = null;
                m.band = false;
                m.zarrachaId = null;
                z.vy = -(1.5 + Math.random() * 2.0) * Math.sqrt(harorat / 298);
                z.vx = (Math.random() - 0.5) * 2.0;
                desSanoqRef.current++;
              }
            }

            // Bog'langan zarrachani chizish (Yashil/Sariq/SFM)
            if (modulId === "gibbs-sirt-taranglik") {
              // SFM zarrachasi (Gidrofil boshcha + Gidrofob dumcha)
              // Dumcha havoda
              ctx.beginPath();
              ctx.moveTo(z.x, z.y);
              ctx.lineTo(z.x + Math.sin(z.tebranishFazasi) * 2, z.y - 18);
              ctx.strokeStyle = "#fbbf24";
              ctx.lineWidth = 2.5;
              ctx.stroke();

              // Boshcha suvda
              ctx.beginPath();
              ctx.arc(z.x, z.y, z.radius + 0.5, 0, Math.PI * 2);
              ctx.fillStyle = "#38bdf8";
              ctx.fill();
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1.5;
              ctx.stroke();
            } else {
              // Adsorbsiyalangan monoqavat zarrachasi
              ctx.beginPath();
              ctx.arc(z.x, z.y, z.radius + 1, 0, Math.PI * 2);
              ctx.fillStyle = modulId === "freyndlix-regressiya" ? "#f59e0b" : "#10b981";
              ctx.fill();
              ctx.strokeStyle = "#ecfdf5";
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Markaz bilan bog'lanish chizig'i
              ctx.beginPath();
              ctx.moveTo(z.x, z.y + z.radius);
              ctx.lineTo(m.x, m.y);
              ctx.strokeStyle = modulId === "freyndlix-regressiya" ? "#fbbf24" : "#34d399";
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }
      });

      // ─── STATISTIKALARNI HAR 400 MS DA YANGILASH ───
      const hozirgiVaqtStamp = Date.now();
      if (hozirgiVaqtStamp - oxirgiStatistikaVaqti > 400) {
        oxirgiStatistikaVaqti = hozirgiVaqtStamp;
        const vAds = (adsSanoqRef.current * 2.5).toFixed(1);
        const vDes = (desSanoqRef.current * 2.5).toFixed(1);
        adsSanoqRef.current = 0;
        desSanoqRef.current = 0;

        setStatistikalar({
          erkinSoni: erkinCount,
          boglanganiSoni: boglanganCount,
          vAds,
          vDes,
        });
      }

      ctx.restore();
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [faol, tezlik, harorat, modulId]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5">
      {/* YUQORI BOSHQARUV VA PLAY/PAUSE/SPEED PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            60 FPS Molekulyar Dinamika Simulyatori (Brown Harakati):
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {/* PLAY / PAUSE TUGMASI */}
          <button
            onClick={() => setFaol(!faol)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              faol
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg animate-pulse"
            }`}
            title={faol ? "Simulyatsiyani to'xtatish (Pause)" : "Simulyatsiyani davom ettirish (Play)"}
          >
            <Ikon nom={faol ? "vaqt" : "chaqmoq"} olcham={13} />
            <span>{faol ? "Pauza (⏸)" : "Davom etish (▶)"}</span>
          </button>

          {/* TEZLIK REJIMLARI (0.5x, 1x, 2x) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
            {[0.5, 1, 2].map((t) => (
              <button
                key={t}
                onClick={() => setTezlik(t)}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  tezlik === t
                    ? "bg-slate-800 text-emerald-400 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t}x
              </button>
            ))}
          </div>

          {/* QAYTA TIKLASH (RESET) */}
          <button
            onClick={qaytaBoshla}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Zarrachalarni qayta tarqatish"
          >
            <Ikon nom="yangilash" olcham={14} />
          </button>
        </div>
      </div>

      {/* ASOSIY HTML5 CANVAS EKRANI */}
      <div className="relative w-full aspect-[2.6/1] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Pauza paytidagi suv belgisi */}
        {!faol && (
          <div className="absolute top-3 right-3 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>PAUZA: Kinetika to&apos;xtatildi</span>
          </div>
        )}
      </div>

      {/* JONLI TELEMETRIYA KO'RSATKICHLARI (4 TA METRIKA) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Erkin gaz zarrachalari:</span>
          <span className="font-mono font-bold text-sky-400 text-sm">
            {statistikalar.erkinSoni} ta
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Adsorbsiyalangan (θ):</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            {statistikalar.boglanganiSoni} ta
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Adsorbsiya tezligi:</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            v_ads ≈ {statistikalar.vAds}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Desorbsiya tezligi:</span>
          <span className="font-mono font-bold text-rose-400 text-sm">
            v_des ≈ {statistikalar.vDes}
          </span>
        </div>
      </div>
    </div>
  );
}
