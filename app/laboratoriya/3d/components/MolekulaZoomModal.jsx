"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// CPK Element ranglar standartlari
const CPK_RANGLAR = {
  H: 0xffffff, // Vodorod — Oq
  O: 0xef4444, // Kislorod — Qizil
  N: 0x3b82f6, // Azot — Ko'k
  C: 0x334155, // Uglerod — To'q kulrang
  Cu: 0x06b6d4, // Mis — Och ko'k/tsian
  Fe: 0xf97316, // Temir — Zang/Zarxal
  Ag: 0xe2e8f0, // Kumush — Kumushrang
  Cl: 0x22c55e, // Xlor — Yashil
  S: 0xeab308, // Oltingugurt — Sariq
};

// Moddalar uchun atomlar va bog'lanishlar geometriyasi ma'lumotlar bazasi
const MOLEKULALAR = {
  "H₂O": {
    nom: "Suv molekulasi",
    geometriya: "Burchakli (104.5°)",
    atomlar: [
      { element: "O", pos: [0, 0, 0], r: 0.35 },
      { element: "H", pos: [-0.45, 0.35, 0], r: 0.22 },
      { element: "H", pos: [0.45, 0.35, 0], r: 0.22 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
    ],
  },
  "CO₂": {
    nom: "Uglerod dioksid",
    geometriya: "Chiziqli (180°)",
    atomlar: [
      { element: "C", pos: [0, 0, 0], r: 0.35 },
      { element: "O", pos: [-0.65, 0, 0], r: 0.3 },
      { element: "O", pos: [0.65, 0, 0], r: 0.3 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
    ],
  },
  "NH₃": {
    nom: "Ammiak molekulasi",
    geometriya: "Trigonal piramidal",
    atomlar: [
      { element: "N", pos: [0, 0.2, 0], r: 0.35 },
      { element: "H", pos: [-0.4, -0.2, 0.3], r: 0.22 },
      { element: "H", pos: [0.4, -0.2, 0.3], r: 0.22 },
      { element: "H", pos: [0, -0.2, -0.45], r: 0.22 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  "Cu(OH)₂": {
    nom: "Mis(II) gidroksid cho'kmasi",
    geometriya: "Kompleks panjara tuguni",
    atomlar: [
      { element: "Cu", pos: [0, 0, 0], r: 0.45 },
      { element: "O", pos: [-0.6, 0.4, 0], r: 0.3 },
      { element: "H", pos: [-0.95, 0.6, 0], r: 0.2 },
      { element: "O", pos: [0.6, -0.4, 0], r: 0.3 },
      { element: "H", pos: [0.95, -0.6, 0], r: 0.2 },
    ],
    boglar: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
    ],
  },
  "Fe(OH)₃": {
    nom: "Temir(III) gidroksid cho'kmasi",
    geometriya: "Oktaedrik koordinatsion",
    atomlar: [
      { element: "Fe", pos: [0, 0, 0], r: 0.45 },
      { element: "O", pos: [-0.6, 0.4, 0], r: 0.3 },
      { element: "H", pos: [-0.95, 0.6, 0], r: 0.2 },
      { element: "O", pos: [0.6, 0.4, 0], r: 0.3 },
      { element: "H", pos: [0.95, 0.6, 0], r: 0.2 },
      { element: "O", pos: [0, -0.65, 0], r: 0.3 },
      { element: "H", pos: [0, -0.95, 0.3], r: 0.2 },
    ],
    boglar: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [0, 5],
      [5, 6],
    ],
  },
};

export default function MolekulaZoomModal({ kalit = "H₂O", onYop }) {
  const konteynerRef = useRef(null);
  const [faolKalit, setFaolKalit] = useState(kalit in MOLEKULALAR ? kalit : "H₂O");

  useEffect(() => {
    if (!konteynerRef.current) return;

    const width = konteynerRef.current.clientWidth;
    const height = konteynerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    konteynerRef.current.replaceChildren(renderer.domElement);

    // Chiroqlar
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(2, 3, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-2, -2, -2);
    scene.add(dirLight2);

    // 3D Molekula Guruhini Yasash
    const molekulaGroup = new THREE.Group();
    const data = MOLEKULALAR[faolKalit] || MOLEKULALAR["H₂O"];

    // Atomlarni (sharchalar) chizish
    data.atomlar.forEach((atom) => {
      const rang = CPK_RANGLAR[atom.element] || 0xcccccc;
      const geo = new THREE.SphereGeometry(atom.r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: rang,
        roughness: 0.25,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...atom.pos);
      molekulaGroup.add(mesh);
    });

    // Bog'lanishlarni (tayoqchalar) chizish
    data.boglar.forEach(([i1, i2]) => {
      const p1 = new THREE.Vector3(...data.atomlar[i1].pos);
      const p2 = new THREE.Vector3(...data.atomlar[i2].pos);
      const masofa = p1.distanceTo(p2);

      const silindrGeo = new THREE.CylinderGeometry(0.06, 0.06, masofa, 16);
      const silindrMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
      const tayoq = new THREE.Mesh(silindrGeo, silindrMat);

      const ortacha = p1.clone().add(p2).multiplyScalar(0.5);
      tayoq.position.copy(ortacha);

      tayoq.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      molekulaGroup.add(tayoq);
    });

    scene.add(molekulaGroup);

    // Animatsiya va aylantirish sikli
    let animId = null;
    let oldingiVaqt = Date.now();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const hozir = Date.now();
      const dt = (hozir - oldingiVaqt) / 1000;
      oldingiVaqt = hozir;

      molekulaGroup.rotation.y += dt * 0.6;
      molekulaGroup.rotation.x += dt * 0.2;

      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [faolKalit]);

  const joriyData = MOLEKULALAR[faolKalit] || MOLEKULALAR["H₂O"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)", color: "var(--v3-matn)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--v3-chiziq)" }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--v3-urgu)" }}>
              🔍 Molekulyar Nano-Zoom (3D Shar-Tayoqcha)
            </h3>
            <p className="text-xs" style={{ color: "var(--v3-xira)" }}>
              {joriyData.nom} — {joriyData.geometriya}
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

        {/* 3D Canvas konteyner */}
        <div ref={konteynerRef} className="h-72 w-full cursor-grab active:cursor-grabbing" />

        {/* Molekula tanlash yorliqlari */}
        <div className="flex flex-wrap gap-2 border-t p-3" style={{ borderColor: "var(--v3-chiziq)" }}>
          {Object.keys(MOLEKULALAR).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFaolKalit(k)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                faolKalit === k ? "border border-sky-400 bg-sky-500/20 text-sky-400" : "opacity-70 hover:opacity-100"
              }`}
              style={{ background: faolKalit === k ? undefined : "var(--v3-yuza-2)" }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
