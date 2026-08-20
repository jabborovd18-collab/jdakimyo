"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Ikon from "@/components/Ikon";
import { muhitNuriniYarat, yonalishNuriniYarat } from "../lib/yoruglik.js";

// CPK Element ranglar standartlari
const CPK_RANGLAR = {
  H: 0xffffff,   // Vodorod — Oq
  O: 0xef4444,   // Kislorod — Qizil
  N: 0x3b82f6,   // Azot — Ko'k
  C: 0x334155,   // Uglerod — To'q kulrang
  Cu: 0x06b6d4,  // Mis — Och ko'k/tsian
  Fe: 0xf97316,  // Temir — Zang/Zarxal
  Ag: 0xe2e8f0,  // Kumush — Kumushrang
  Cl: 0x22c55e,  // Xlor — Yashil
  S: 0xeab308,   // Oltingugurt — Sariq
  Ba: 0xa855f7,  // Bariy — Binafsha
};

// Moddalar uchun atomlar va bog'lanishlar geometriyasi ma'lumotlar bazasi
const MOLEKULALAR = {
  "H₂O": {
    nom: "Suv molekulasi",
    geometriya: "Burchakli (104.5°)",
    tavsif: "sp³ gibridlangan kislorod atomida 2 ta bo'linmagan elektron jufti mavjud.",
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
    tavsif: "sp gibridlangan markaziy C atomi, no-polyar simmetrik molekula.",
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
    geometriya: "Trigonal piramidal (107°)",
    tavsif: "Azot atomining sp³ gibridlanishi va bitta erkin elektron jufti asos xususiyatini beradi.",
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
  "CH₄": {
    nom: "Metan molekulasi",
    geometriya: "Ideal Tetraedr (109.5°)",
    tavsif: "Organik kimyoning asosi bo'lgan mukammal simmetrik sp³ tetraedr.",
    atomlar: [
      { element: "C", pos: [0, 0, 0], r: 0.35 },
      { element: "H", pos: [0, 0.55, 0], r: 0.22 },
      { element: "H", pos: [0.52, -0.2, 0], r: 0.22 },
      { element: "H", pos: [-0.26, -0.2, 0.45], r: 0.22 },
      { element: "H", pos: [-0.26, -0.2, -0.45], r: 0.22 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
  "HCl": {
    nom: "Xlorid kislota",
    geometriya: "Chiziqli qutbli dipol",
    tavsif: "Kovalent qutbli bog', xlor atomi kuchli elektromanziflikka ega.",
    atomlar: [
      { element: "Cl", pos: [-0.3, 0, 0], r: 0.38 },
      { element: "H", pos: [0.35, 0, 0], r: 0.22 },
    ],
    boglar: [[0, 1]],
  },
  "H₂SO₄": {
    nom: "Sulfat kislota",
    geometriya: "Tetraedrik markaziy oltingugurt",
    tavsif: "Markaziy S atomi atrofida 2 ta okso (=O) va 2 ta gidroksil (-OH) guruhlari joylashgan.",
    atomlar: [
      { element: "S", pos: [0, 0, 0], r: 0.4 },
      { element: "O", pos: [0, 0.6, 0], r: 0.3 },
      { element: "O", pos: [0, -0.6, 0], r: 0.3 },
      { element: "O", pos: [-0.6, 0, 0.2], r: 0.3 },
      { element: "H", pos: [-0.95, 0, 0.35], r: 0.2 },
      { element: "O", pos: [0.6, 0, -0.2], r: 0.3 },
      { element: "H", pos: [0.95, 0, -0.35], r: 0.2 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
      [0, 3],
      [3, 4],
      [0, 5],
      [5, 6],
    ],
  },
  "CH₃COOH": {
    nom: "Sirka kislota",
    geometriya: "Karbonil va metil guruhlari",
    tavsif: "sp² gibridlangan karbonil uglerodi va vodorod bog'i hosil qiluvchi karboksil guruhi.",
    atomlar: [
      { element: "C", pos: [-0.5, 0, 0], r: 0.35 },
      { element: "H", pos: [-0.85, 0.35, 0.3], r: 0.2 },
      { element: "H", pos: [-0.85, 0.35, -0.3], r: 0.2 },
      { element: "H", pos: [-0.85, -0.5, 0], r: 0.2 },
      { element: "C", pos: [0.4, 0, 0], r: 0.35 },
      { element: "O", pos: [0.75, 0.55, 0], r: 0.3 },
      { element: "O", pos: [0.85, -0.45, 0], r: 0.3 },
      { element: "H", pos: [1.2, -0.35, 0], r: 0.2 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [4, 5],
      [4, 6],
      [6, 7],
    ],
  },
  "Cu(OH)₂": {
    nom: "Mis(II) gidroksid cho'kmasi",
    geometriya: "Kvadrat planar kompleks panjara",
    tavsif: "Moviy jelatinsimon cho'kma hosil qiluvchi d-metall koordinatsion tuguni.",
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
    tavsif: "Qo'ng'ir-qizil rangli cho'kma, poliyadroli klasterlar hosil qiladi.",
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
  "AgCl": {
    nom: "Kumush xlorid",
    geometriya: "Ion-kovalent kristall klasteri",
    tavsif: "Yorug'lik ta'sirida parchalanuvchi oq tvorogsimon cho'kma.",
    atomlar: [
      { element: "Ag", pos: [-0.35, 0, 0], r: 0.42 },
      { element: "Cl", pos: [0.35, 0, 0], r: 0.38 },
    ],
    boglar: [[0, 1]],
  },
  "[Cu(NH₃)₄]²⁺": {
    nom: "Tetraamminmis(II) kompleksi",
    geometriya: "Kvadrat tekislikdagi kompleks",
    tavsif: "Mis gidroksidiga ortiqcha ammiak qo'shilganda hosil bo'luvchi chuqur moviy/to'q ko'k eritma.",
    atomlar: [
      { element: "Cu", pos: [0, 0, 0], r: 0.45 },
      { element: "N", pos: [-0.85, 0, 0], r: 0.32 },
      { element: "N", pos: [0.85, 0, 0], r: 0.32 },
      { element: "N", pos: [0, 0.85, 0], r: 0.32 },
      { element: "N", pos: [0, -0.85, 0], r: 0.32 },
    ],
    boglar: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
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
    scene.background = new THREE.Color(0x060913); // Chuqur nano-koinot foni

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    konteynerRef.current.replaceChildren(renderer.domElement);

    // Chiroqlar
    const ambientLight = muhitNuriniYarat(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = yonalishNuriniYarat(0xffffff, 1.6);
    dirLight1.position.set(3, 4, 4);
    scene.add(dirLight1);

    const dirLight2 = yonalishNuriniYarat(0x38bdf8, 1.0);
    dirLight2.position.set(-3, -3, -2);
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
        roughness: 0.2,
        metalness: 0.15,
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

      const silindrGeo = new THREE.CylinderGeometry(0.055, 0.055, masofa, 16);
      const silindrMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35 });
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

      molekulaGroup.rotation.y += dt * 0.55;
      molekulaGroup.rotation.x += dt * 0.18;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xl bg-black/80 animate-in fade-in duration-200">
      <div
        className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl bg-[var(--v3-fon-2)] border-[var(--v3-chiziq-2)] text-[var(--v3-matn)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 sm:p-5 border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">🔬 3D Super-Zoom (Shar-Tayoqcha)</div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <span>{joriyData.nom}</span>
              <span className="text-xs font-mono text-[var(--v3-urgu)]">({faolKalit})</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onYop}
            className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {/* 3D Canvas konteyner */}
        <div ref={konteynerRef} className="h-72 sm:h-80 w-full cursor-grab active:cursor-grabbing bg-black/40" />

        {/* Geometriya va Fizik-Kimyoviy Tavsif */}
        <div className="p-4 bg-[var(--v3-yuza)] border-t border-[var(--v3-chiziq)] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[var(--v3-xira)]">Fazo Geometriyasi:</span>
            <strong className="text-cyan-400">{joriyData.geometriya}</strong>
          </div>
          <p className="text-xs text-[var(--v3-matn)] leading-relaxed opacity-90">
            💡 {joriyData.tavsif}
          </p>
        </div>

        {/* Molekula tanlash paneli (Tabs) */}
        <div className="flex gap-1.5 overflow-x-auto p-3 bg-[var(--v3-fon)] border-t border-[var(--v3-chiziq)]">
          {Object.keys(MOLEKULALAR).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFaolKalit(k)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                faolKalit === k
                  ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-md"
                  : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
