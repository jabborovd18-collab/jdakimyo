// app/laboratoriya/3d/lib/xona/index.js
//
// Xona interyerini YIG'ADI — faqat yig'adi, geometriya yasamaydi.
// Qismlar shu katalogda:
//
//   pol-shift-devor.js   xonaning qobig'i (pol, ship, devorlar, eshik)
//   deraza.js            deraza teshiklari, ram, tokcha, shisha
//   mebel.js             stol, javon, tokcha, xavfsizlik shkafi
//   santexnika.js        rakovina, dush, ko'z yuvish
//   stendlar.js          titrlash, elektroliz, tarozi stendi
//   panellar.js          davriy jadval, planshet, EXIT, iqlim stansiyasi
//   yordamchi.js         soyaTashlasin, DEVOR_QALINLIGI
//
// TASHQI IMZO O'ZGARMADI: `xonaInteryeriniYasa(materiallar, profil)` —
// chaqiruvchi kod (`useSahna.js`) `../lib/xona-modellari.js` orqali
// keladi va u shu faylni re-export qiladi.

import * as THREE from "three";
import { soyaTashlasin } from "./yordamchi.js";
import { xonaQobiginiYasa } from "./pol-shift-devor.js";
import { davriyJadvalPlakati, smartPlanshetYasa } from "./panellar.js";
import {
  taroziStoliYasa,
  titrlashStendiYasa,
  elektrolizVannasiYasa,
} from "./stendlar.js";
import { rakovinaYasa } from "./santexnika.js";
import {
  jihozlarStendiYasa,
  yonStollarniYasa,
  stolDaftarlariYasa,
} from "./mebel.js";


export function xonaInteryeriniYasa(materiallar, profil) {
  if (!profil) throw new Error("Xona uchun sifat profili berilmadi");
  const roomGroup = new THREE.Group();
  roomGroup.name = "3D_Laboratoriya_Interyeri";
  // BRIF-01 shu profil orqali xona ichidagi chiroq to'plamini kesadi.
  // Hozir faqat saqlanadi: yorug'lik soni va qiymati o'zgarmaydi.
  roomGroup.userData.profil = profil;

  // 1. To'liq 16x12m Katta Zal Devorlari va Shift LED panellari
  roomGroup.add(xonaQobiginiYasa(materiallar, profil));

  // 2. Orqa Devordagi Keng Formatli Davriy Jadval Plakati
  roomGroup.add(davriyJadvalPlakati());

  // 3. Yon Ishchi Tajriba Stollari (Chap & O'ng)
  roomGroup.add(soyaTashlasin(yonStollarniYasa(materiallar), profil));

  // 4. Analitik Tarozi Stantsiyasi (Chap stolda)
  roomGroup.add(soyaTashlasin(taroziStoliYasa(materiallar), profil));

  // 5. Byuretka va Titrlash Stendi (O'ng stolda)
  roomGroup.add(soyaTashlasin(titrlashStendiYasa(materiallar), profil));

  // 6. Elektroliz va Tok Manbai Stendi (O'ng stolda)
  roomGroup.add(soyaTashlasin(elektrolizVannasiYasa(materiallar), profil));

  // 7. Yuvinish Rakovinasi (Chap orqa burchakda)
  roomGroup.add(soyaTashlasin(rakovinaYasa(materiallar), profil));

  // 8. Stoldagi 3D Jihozlar Stendi (Glassware Rack — Probirkalar, Kolba, Stakan, Silindr, Spatula)
  roomGroup.add(soyaTashlasin(jihozlarStendiYasa(materiallar), profil));

  // 9. Stoldagi 3D Smart Laboratoriya Plansheti (Smart Monitor & Notebook)
  roomGroup.add(soyaTashlasin(smartPlanshetYasa(materiallar), profil));

  // 10. Stol ustidagi mayda realist detallar (qog'oz bloknot, ruchka)
  roomGroup.add(soyaTashlasin(stolDaftarlariYasa(), profil));

  return roomGroup;
}
