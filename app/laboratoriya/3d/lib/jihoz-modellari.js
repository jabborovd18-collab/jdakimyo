// app/laboratoriya/3d/lib/jihoz-modellari.js
//
// Jihozlarni YIG'ADI va assetga almashtiradi. Modellar `lib/jihoz/` da.
//
// BRIF-05: bu fayl 1184 qator edi (AGENTS.md 11.7 chegarasi 600).
//
// TASHQI IMZO O'ZGARMADI: `jihozYasa(kalit, materiallar, profil)`,
// `qaynashniYangila` va `suyuqlikSathiniYangila` shu fayldan
// eksport qilinaveradi — chaqiruvchi kod tegilmadi.

import * as THREE from "three";
import { assetlarniQollash } from "./asset-yuklovchi.js";
import { suyuqlikYasa } from "./materiallar.js";
import { idishmi, idishSigimi } from "@/lib/lab-idish.js";
import { soyalarniYoq } from "./jihoz/yordamchi.js";
import {
  probirkaYasa,
  stakanYasa,
  konussimonKolbaYasa,
  dumaloqTubliKolbaYasa,
  kolbaYasa,
  kristallizatorYasa,
  olchovKolbasiYasa,
  olchovSilindriYasa,
  soatShishasiYasa,
} from "./jihoz/idishlar.js";
import {
  byuretkaYasa,
  tomizgichYasa,
  termometrYasa,
  voronkaYasa,
  shishaTayoqchaYasa,
  spatulaYasa,
} from "./jihoz/asboblar.js";
import {
  spirtovkaYasa,
  shtativYasa,
  probirkaShtativiYasa,
} from "./jihoz/issiqlik.js";

// Eski import yo'lini saqlash uchun qayta eksport.
export { qaynashniYangila, suyuqlikSathiniYangila } from "./jihoz/yordamchi.js";


// 14. ZAXIRA MODEL — Maxsus model taqdim etilmagan apparatlar uchun quti, quvur va nom yorlig'idan iborat zaxira model.
function zaxiraModel(kalit, materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 });
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const qutiGeo = new THREE.BoxGeometry(0.16, 0.14, 0.14);
  const quti = new THREE.Mesh(qutiGeo, metallMat);
  quti.position.y = 0.07;
  group.add(quti);

  const quvurGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16);
  const quvur = new THREE.Mesh(quvurGeo, shishaMat);
  quvur.position.y = 0.18;
  group.add(quvur);

  const suyuqlikGeo = new THREE.BoxGeometry(0.14, 0.1, 0.12);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit,
    suyuqlikMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.22,
    suyuqlikMaxBalandlik: 0.1,
    suyuqlikTubY: 0.02,
    tanlanadi: true,
  };

  const tozaNom = String(kalit || "Apparat")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  yorliqQosh(group, tozaNom);

  return group;
}


// Jihoz turiga qarab mos protsedural 3D model yaratish dispetcher funksiyasi.
// Nega: tashqi .glb / .gltf yuklamasdan, barcha geometriya Three.js ichida yasalishi
// tarmoq trafigini va yuklanish vaqtini 10 barobargacha tejaydi.
export function jihozYasa(kalit, materiallar, profil) {
  if (!profil) throw new Error("Jihoz uchun sifat profili berilmadi");
  const group = modelYasa(kalit, materiallar);
  group.userData.profil = profil;
  soyalarniYoq(group);

  // Sig'im `lib/lab-idish.js` dan olinadi, model ichida yozilmaydi.
  //
  // Ilgari har bir modelda o'z soni bor edi va SERVER ularni umuman
  // ko'rmasdi — Three.js ni import qiladigan fayldan o'qib bo'lmaydi.
  // Natijada "idishga sig'maydi" degan tekshiruv yo'q edi: 25 ml
  // probirkaga 500 ml quyish mumkin edi. Endi ikkala tomon bitta
  // qiymatni o'qiydi.
  //
  // Idish bo'lmagani (shtativ, termometr, spirtovka) nol oladi:
  // `idishSigimi` noma'lum kalitga zaxira qiymat qaytaradi, u esa bu
  // yerda noto'g'ri bo'lardi.
  group.userData.sigim = idishmi(kalit) ? idishSigimi(kalit) : 0;

  // BRIF-02 — model allaqachon keshda bo'lsa shu yerda almashadi.
  // Keshda bo'lmasa hech narsa qilmaydi va jihoz protsedural qoladi;
  // model keyinroq kelganda `useSahna` butun sahnani bir marta
  // qaytadan o'tkazadi.
  assetlarniQollash(group);

  return group;
}


function modelYasa(kalit, materiallar) {
  switch (kalit) {
    case "probirka":
      return probirkaYasa(materiallar);
    case "stakan":
      return stakanYasa(materiallar);
    case "konussimon-kolba":
      return konussimonKolbaYasa(materiallar);
    case "dumaloq-tubli-kolba":
      return dumaloqTubliKolbaYasa(materiallar);
    case "kolba":
      return kolbaYasa(materiallar);
    case "olchov-kolba":
      return olchovKolbasiYasa(materiallar);
    case "olchov-silindr":
      return olchovSilindriYasa(materiallar);
    case "soat-shishasi":
      return soatShishasiYasa(materiallar);
    case "shisha-tayoqcha":
      return shishaTayoqchaYasa(materiallar);
    case "spatula":
      return spatulaYasa(materiallar);
    case "kristallizator":
      return kristallizatorYasa(materiallar);
    case "byuretka":
      return byuretkaYasa(materiallar);
    case "tomizgich":
      return tomizgichYasa(materiallar);
    case "spirtovka":
      return spirtovkaYasa(materiallar);
    case "shtativ":
      return shtativYasa(materiallar);
    case "probirka-shtativi":
      return probirkaShtativiYasa(materiallar);
    case "termometr":
      return termometrYasa(materiallar);
    case "voronka":
    case "tomizuvchi-voronka":
      return voronkaYasa(materiallar);
    default:
      return zaxiraModel(kalit, materiallar);
  }
}
