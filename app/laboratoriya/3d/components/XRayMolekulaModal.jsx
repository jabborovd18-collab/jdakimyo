"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Ikon from "@/components/Ikon";
import {
  XRAY_REAKSIYALAR,
  ATOM_RANGLARI,
  xrayProfiliniTop,
} from "../lib/xray-dvigatel.js";
import { pufakchaChiqishi, shishaUrilishi } from "../lib/ovoz.js";
import { muhitNuriniYarat, nuqtaNuriniYarat } from "../lib/yoruglik.js";

export default function XRayMolekulaModal({ reaksiyaTenglamasi, onYop }) {
  const [faolProfil, setFaolProfil] = useState(() =>
    xrayProfiliniTop(reaksiyaTenglamasi || "HCl + NaOH")
  );
  const [faza, setFaza] = useState(1); // 1: Reagentlar, 2: X-Ray Uzilish, 3: Oraliq Kompleks, 4: Mahsulotlar
  const [ijro, setIjro] = useState(true);
  const [tezlik, setTezlik] = useState(0.5); // 0.1x to 1.0x Slow-mo

  const canvasRef = useRef(null);
  const animIdRef = useRef(null);
  const molGroupRef = useRef(null);
  const sceneRef = useRef(null);

  // 3D Canvas va Sahna Initsializatsiyasi
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // Chuqur qorong'u koinot/nano fon
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.replaceChildren(renderer.domElement);

    // Chiroqlar
    const ambientLight = muhitNuriniYarat(0xffffff, 1.4);
    scene.add(ambientLight);

    const pointLight = nuqtaNuriniYarat(0x38bdf8, 2.5, 8);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const xRayGlow = nuqtaNuriniYarat(0xf43f5e, 2.0, 6);
    xRayGlow.position.set(-2, -2, 2);
    scene.add(xRayGlow);

    // 3D Molekulyar Guruh
    const molGroup = new THREE.Group();
    molGroupRef.current = molGroup;
    scene.add(molGroup);

    // Render sikli
    let oldingiVaqt = performance.now();

    const loop = () => {
      animIdRef.current = requestAnimationFrame(loop);
      const hozir = performance.now();
      const dt = ((hozir - oldingiVaqt) / 1000) * tezlik;
      oldingiVaqt = hozir;

      if (molGroup) {
        molGroup.rotation.y += dt * 0.45;
        molGroup.rotation.x = Math.sin(hozir * 0.001) * 0.12;
      }

      renderer.render(scene, camera);
    };

    loop();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Faza o'zgarganda 3D atomlar va bog'larni qayta chizish
  useEffect(() => {
    if (!molGroupRef.current) return;
    const group = molGroupRef.current;

    // Tozalash
    while (group.children.length > 0) {
      const c = group.children[0];
      group.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }

    const profil = faolProfil;

    // 1-FAZA: REAGENTLAR
    if (faza === 1) {
      profil.boshlangichMolekulalar.forEach((mol) => {
        const mGroup = new THREE.Group();
        mol.atomlar.forEach((a) => {
          const geo = new THREE.SphereGeometry(a.r, 32, 32);
          const mat = new THREE.MeshStandardMaterial({
            color: ATOM_RANGLARI[a.elem] || 0xffffff,
            roughness: 0.2,
            metalness: 0.1,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(...a.pos);
          mGroup.add(mesh);
        });

        // Bog'lar
        mol.boglar?.forEach(([i1, i2]) => {
          const p1 = new THREE.Vector3(...mol.atomlar[i1].pos);
          const p2 = new THREE.Vector3(...mol.atomlar[i2].pos);
          const dist = p1.distanceTo(p2);
          const bGeo = new THREE.CylinderGeometry(0.06, 0.06, dist, 16);
          const bMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
          const cyl = new THREE.Mesh(bGeo, bMat);
          cyl.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
          cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
          mGroup.add(cyl);
        });

        group.add(mGroup);
      });
    }

    // 2-FAZA: X-RAY BOG'LAR UZILISHI (MORTAL KOMBAT X-RAY CRACK)
    else if (faza === 2) {
      shishaUrilishi(1400);

      const m = profil.oraliqKompleks;
      m.atomlar.forEach((a) => {
        const geo = new THREE.SphereGeometry(a.r, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: ATOM_RANGLARI[a.elem] || 0xffffff,
          emissive: 0xf43f5e,
          emissiveIntensity: a.kuch === "uzilmoqda" ? 0.8 : 0.2,
          roughness: 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...a.pos);
        group.add(mesh);
      });

      // Qizil qizigan, uzilayotgan kovalent bog'
      const p1 = new THREE.Vector3(...m.atomlar[0].pos);
      const p2 = new THREE.Vector3(...m.atomlar[1].pos);
      const dist = p1.distanceTo(p2);
      const bGeo = new THREE.CylinderGeometry(0.04, 0.04, dist, 16);
      const bMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true });
      const cyl = new THREE.Mesh(bGeo, bMat);
      cyl.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      group.add(cyl);
    }

    // 3-FAZA: ORALIQ KOMPLEKS [...]‡ (TRANSITION STATE)
    else if (faza === 3) {
      pufakchaChiqishi();

      const m = profil.oraliqKompleks;
      m.atomlar.forEach((a) => {
        const geo = new THREE.SphereGeometry(a.r * 1.05, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: ATOM_RANGLARI[a.elem] || 0xffffff,
          emissive: 0xfacc15,
          emissiveIntensity: 0.6,
          roughness: 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...a.pos);
        group.add(mesh);
      });
    }

    // 4-FAZA: YAKUNIY MAHSULOT MOLEKULALARI
    else if (faza === 4) {
      profil.mahsulotlar.forEach((mol) => {
        const mGroup = new THREE.Group();
        mol.atomlar.forEach((a) => {
          const geo = new THREE.SphereGeometry(a.r, 32, 32);
          const mat = new THREE.MeshStandardMaterial({
            color: ATOM_RANGLARI[a.elem] || 0xffffff,
            roughness: 0.2,
            metalness: 0.2,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(...a.pos);
          mGroup.add(mesh);
        });

        // Yangi hosil bo'lgan bog'lar (Yashil/Moviy)
        mol.boglar?.forEach(([i1, i2]) => {
          const p1 = new THREE.Vector3(...mol.atomlar[i1].pos);
          const p2 = new THREE.Vector3(...mol.atomlar[i2].pos);
          const dist = p1.distanceTo(p2);
          const bGeo = new THREE.CylinderGeometry(0.065, 0.065, dist, 16);
          const bMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2 });
          const cyl = new THREE.Mesh(bGeo, bMat);
          cyl.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
          cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
          mGroup.add(cyl);
        });

        group.add(mGroup);
      });
    }
  }, [faza, faolProfil]);

  // Joriy fazada ko'rsatilayotgan tuzilishning izohi.
  //
  // 1 va 2-faza boshlang'ich molekulalarni, 3 oraliq kompleksni,
  // 4 mahsulotlarni ko'rsatadi — izoh ham shunga ergashadi.
  const joriyIzoh = (() => {
    if (faza === 3) return faolProfil.oraliqKompleks?.izoh || "";
    const guruhlar = faza === 4
      ? faolProfil.mahsulotlar
      : faolProfil.boshlangichMolekulalar;
    return (guruhlar || []).map((g) => g.izoh).filter(Boolean).join(" ");
  })();

  // Avtomatik Slow-Mo ijrosi
  useEffect(() => {
    let timer = null;
    if (ijro) {
      timer = setInterval(() => {
        setFaza((prev) => (prev >= 4 ? 1 : prev + 1));
      }, 2400 / tezlik);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [ijro, tezlik]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-5 sm:p-7 space-y-5 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* ─── HEADER ─── */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">⚡ Mortal Kombat X-Ray Slow-Motion Dvigateli</div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="atom" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Kimyoviy Bog{"'"}lar Uzilishi va Oraliq Komplekslar</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onYop}
            className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {/* ─── REAKSIYA VARIANTLARI ─── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {XRAY_REAKSIYALAR.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setFaolProfil(r);
                setFaza(1);
              }}
              className={`p-2.5 rounded-xl border text-left shrink-0 text-xs font-mono transition-all ${
                faolProfil.id === r.id
                  ? "bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] text-[var(--v3-urgu)] font-bold shadow-sm"
                  : "bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              }`}
            >
              {r.nomi}
            </button>
          ))}
        </div>

        {/* ─── 3D X-RAY KINEMATIK MAYDONI ─── */}
        <div className="relative rounded-2xl border border-[var(--v3-chiziq)] bg-black/60 overflow-hidden shadow-2xl">
          {/* 3D Canvas */}
          <div ref={canvasRef} className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing" />

          {/* Faza Indikatori (X-Ray HUD Overlay) */}
          <div className="absolute top-4 left-4 z-20 space-y-1 backdrop-blur-md p-3 rounded-xl border border-white/10 bg-black/50 text-xs font-mono">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {faza === 1
                ? "1. Boshlang'ich Molekulalar"
                : faza === 2
                ? "⚡ 2. X-Ray: Kovalent Bog'lar Uzilmoqda"
                : faza === 3
                ? "💥 3. Oraliq Faollangan Kompleks [..]‡"
                : "✓ 4. Yangi Mahsulot Molekulalari"}
            </div>
            <div className="font-bold text-white text-sm">{faolProfil.tenglama}</div>
            {/* Shu fazadagi tuzilishning ILMIY izohi. Manbasi profil
                ma'lumoti; bu yerda matn yozilmaydi. */}
            {joriyIzoh && (
              <p className="max-w-sm text-[11px] leading-relaxed text-slate-300 font-sans pt-1 border-t border-white/10">
                {joriyIzoh}
              </p>
            )}
          </div>

          {/* Energetik Koordinata Diagrammasi (Kichik Grafik) */}
          <div className="absolute top-4 right-4 z-20 p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-mono space-y-1">
            <div className="text-cyan-400 font-bold">Faollanish Energiyasi:</div>
            <div className="text-amber-300 font-bold">{faolProfil.faollanishEnergiyasi}</div>
            <div className="text-emerald-400 font-bold">{faolProfil.entalpiya}</div>
          </div>

          {/* Pastki Slow-Mo Pleyer Boshqaruvi */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-black/70 backdrop-blur-md">
            {/* 4 ta Faza Steplari */}
            <div className="flex gap-1.5 font-mono text-[11px]">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setFaza(s);
                    setIjro(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                    faza === s
                      ? "bg-amber-500 text-black border-amber-400 shadow-md"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s}-Faza
                </button>
              ))}
            </div>

            {/* Slow-Mo Tezlik va Play/Pause */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIjro(!ijro)}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold"
              >
                {ijro ? "⏸️ To'xtatish" : "▶️ Slow-Mo Ijro"}
              </button>

              <div className="flex gap-1 font-mono text-[10px]">
                {[0.25, 0.5, 1.0].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTezlik(t)}
                    className={`px-2 py-1 rounded-md border font-bold ${
                      tezlik === t ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/5 text-white/70 border-white/10"
                    }`}
                  >
                    {t}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── ILMIY MEXANIZM TUSHUNTIRIShI ─── */}
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-2 text-xs">
          <div className="font-bold text-[var(--v3-urgu)] flex items-center gap-1.5 font-mono">
            <Ikon nom="quiz" olcham={14} />
            <span>X-Ray Kinetik Mexanizm Tahlili:</span>
          </div>
          <p className="text-[var(--v3-matn)] leading-relaxed">{faolProfil.tavsif}</p>

          {/* MANBA. Loyiha qoidasi: ilmiy son manbasiz yozilmaydi
              (data/reactions/_umumiy.js 2-qoida). Profilda manba
              bo'lsa u ko'rsatiladi — o'quvchi qayerdan kelganini
              bilsin va tekshira olsin. */}
          {faolProfil.manba && (
            <p className="text-[10px] leading-relaxed text-[var(--v3-xira)] italic border-l-2 border-[var(--v3-chiziq)] pl-2">
              Manba: {faolProfil.manba}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 space-y-0.5">
              <span className="text-red-400 font-bold block">⚡ Uziladigan Bog{"'"}lar:</span>
              <ul className="list-disc list-inside text-[var(--v3-xira)]">
                {faolProfil.oraliqKompleks.uziladiganBoglar.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 space-y-0.5">
              <span className="text-emerald-400 font-bold block">✓ Hosil Bo{"'"}ladigan Bog{"'"}lar:</span>
              <ul className="list-disc list-inside text-[var(--v3-xira)]">
                {faolProfil.oraliqKompleks.hosilBoladiganBoglar.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
