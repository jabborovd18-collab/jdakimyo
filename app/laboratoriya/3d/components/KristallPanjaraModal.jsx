"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { muhitNuriniYarat, yonalishNuriniYarat } from "../lib/yoruglik.js";

const KRISTALLAR = {
  NaCl: {
    nom: "Osh Tuzi (NaCl)",
    panjara: "Yuzada markazlashgan kubik (FCC)",
    tavsif: "Na⁺ (sariq) va Cl⁻ (yashil) ionlari 6:6 koordinatsiya soni bilan navbatlashadi.",
    ionlar: [
      // 3x3x3 cubic grid of alternating Na+ and Cl-
      { type: "Na", pos: [0, 0, 0] },
      { type: "Cl", pos: [0.5, 0, 0] },
      { type: "Na", pos: [1, 0, 0] },
      { type: "Cl", pos: [0, 0.5, 0] },
      { type: "Na", pos: [0.5, 0.5, 0] },
      { type: "Cl", pos: [1, 0.5, 0] },
      { type: "Na", pos: [0, 1, 0] },
      { type: "Cl", pos: [0.5, 1, 0] },
      { type: "Na", pos: [1, 1, 0] },

      { type: "Cl", pos: [0, 0, 0.5] },
      { type: "Na", pos: [0.5, 0, 0.5] },
      { type: "Cl", pos: [1, 0, 0.5] },
      { type: "Na", pos: [0, 0.5, 0.5] },
      { type: "Cl", pos: [0.5, 0.5, 0.5] },
      { type: "Na", pos: [1, 0.5, 0.5] },
      { type: "Cl", pos: [0, 1, 0.5] },
      { type: "Na", pos: [0.5, 1, 0.5] },
      { type: "Cl", pos: [1, 1, 0.5] },

      { type: "Na", pos: [0, 0, 1] },
      { type: "Cl", pos: [0.5, 0, 1] },
      { type: "Na", pos: [1, 0, 1] },
      { type: "Cl", pos: [0, 0.5, 1] },
      { type: "Na", pos: [0.5, 0.5, 1] },
      { type: "Cl", pos: [1, 0.5, 1] },
      { type: "Na", pos: [0, 1, 1] },
      { type: "Cl", pos: [0.5, 1, 1] },
      { type: "Na", pos: [1, 1, 1] },
    ],
  },
  Olmos: {
    nom: "Olmos (Uglerod Allotropiyasi)",
    panjara: "Tetraedrik kovalent kovalent panjara",
    tavsif: "Har bir C atomi 4 ta qo'shni C atomi bilan $109.5^\circ$ burchak ostida bog'langan.",
    ionlar: [
      { type: "C", pos: [0, 0, 0] },
      { type: "C", pos: [0.5, 0.5, 0] },
      { type: "C", pos: [0, 0.5, 0.5] },
      { type: "C", pos: [0.5, 0, 0.5] },
      { type: "C", pos: [0.25, 0.25, 0.25] },
      { type: "C", pos: [0.75, 0.75, 0.25] },
      { type: "C", pos: [0.75, 0.25, 0.75] },
      { type: "C", pos: [0.25, 0.75, 0.75] },
    ],
  },
  Muz: {
    nom: "Muz (H₂O Hexagonal)",
    panjara: "Vodorod bog'li hexagonal kristal",
    tavsif: "Muz muzlaganda zichligi kamayadi va suv ustida qalqiydi.",
    ionlar: [
      { type: "O", pos: [0, 0, 0] },
      { type: "O", pos: [0.6, 0, 0] },
      { type: "O", pos: [0.3, 0.5, 0] },
      { type: "O", pos: [0.3, 0.2, 0.5] },
      { type: "O", pos: [0.9, 0.2, 0.5] },
    ],
  },
};

const ION_RANGLAR = {
  Na: 0xeab308, // Na+ — Sariq
  Cl: 0x22c55e, // Cl- — Yashil
  C: 0x38bdf8, // C — Zangori
  O: 0xef4444, // O — Qizil
};

export default function KristallPanjaraModal({ onYop }) {
  const konteynerRef = useRef(null);
  const [faolKristall, setFaolKristall] = useState("NaCl");

  useEffect(() => {
    if (!konteynerRef.current) return;

    const width = konteynerRef.current.clientWidth;
    const height = konteynerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2, 2, 3.5);
    camera.lookAt(0.5, 0.5, 0.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    konteynerRef.current.replaceChildren(renderer.domElement);

    // Chiroqlar
    const ambientLight = muhitNuriniYarat(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = yonalishNuriniYarat(0xffffff, 1.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // Kristall Panjara Guruhini Yaratish
    const panjaraGroup = new THREE.Group();
    const data = KRISTALLAR[faolKristall] || KRISTALLAR["NaCl"];

    // Ion va atomlarni joylashtirish
    data.ionlar.forEach((ion) => {
      const rang = ION_RANGLAR[ion.type] || 0xffffff;
      const r = ion.type === "Cl" ? 0.12 : ion.type === "Na" ? 0.09 : 0.1;
      const geo = new THREE.SphereGeometry(r, 24, 24);
      const mat = new THREE.MeshStandardMaterial({ color: rang, roughness: 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...ion.pos);
      panjaraGroup.add(mesh);
    });

    // Kristall karkas chiziqlarini (Unit Cell Box) chizish
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.set(0.5, 0.5, 0.5);
    panjaraGroup.add(wireframe);

    scene.add(panjaraGroup);

    // Rotatsiya animatsiyasi
    let animId = null;
    let oldingiVaqt = Date.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const hozir = Date.now();
      const dt = (hozir - oldingiVaqt) / 1000;
      oldingiVaqt = hozir;

      panjaraGroup.rotation.y += dt * 0.5;
      panjaraGroup.rotation.x += dt * 0.2;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [faolKristall]);

  const joriyData = KRISTALLAR[faolKristall] || KRISTALLAR["NaCl"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)",
          color: "var(--v3-matn)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--v3-chiziq)" }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
              🧊 3D Kristall Panjaralar Vizualizatori
            </h3>
            <p className="text-xs" style={{ color: "var(--v3-xira)" }}>
              {joriyData.nom} — {joriyData.panjara}
            </p>
          </div>
          <button
            type="button"
            onClick={onYop}
            className="rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{ background: "var(--v3-yuza-2)" }}
          >
            ✕
          </button>
        </div>

        {/* 3D Canvas */}
        <div ref={konteynerRef} className="h-72 w-full cursor-grab active:cursor-grabbing" />

        {/* Tavsif va Kristall tanlash */}
        <div className="flex flex-col gap-3 border-t p-4" style={{ borderColor: "var(--v3-chiziq)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "var(--v3-xira)" }}>
            💡 <strong>Tuzilish:</strong> {joriyData.tavsif}
          </p>
          <div className="flex gap-2">
            {Object.keys(KRISTALLAR).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFaolKristall(k)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  faolKristall === k ? "border border-cyan-400 bg-cyan-500/20 text-cyan-400" : "opacity-70 hover:opacity-100"
                }`}
                style={{ background: faolKristall === k ? undefined : "var(--v3-yuza-2)" }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
