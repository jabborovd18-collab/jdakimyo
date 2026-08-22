// app/laboratoriya/3d/lib/xona-modellari.js
//
// Xona interyerini YIG'ADI. Qismlar `lib/xona/` da.
//
// BRIF-05: bu fayl 1707 qator edi va ikki agent unda bir vaqtda
// ishlay olmasdi (AGENTS.md 11.7). Endi u faqat yig'uvchi.
//
// TASHQI IMZO O'ZGARMADI: `xonaInteryeriniYasa(materiallar, profil)`
// va import yo'li o'sha-o'sha, ya'ni chaqiruvchi kod tegilmadi.

import * as THREE from "three";
import { soyaTashlasin } from "./xona/yordamchi.js";
import { xonaQobiginiYasa } from "./xona/qobiq.js";
import { davriyJadvalPlakati, smartPlanshetYasa } from "./xona/panellar.js";
import {
  taroziStoliYasa,
  titrlashStendiYasa,
  elektrolizVannasiYasa,
} from "./xona/stendlar.js";
import { rakovinaYasa } from "./xona/santexnika.js";
import {
  jihozlarStendiYasa,
  yonStollarniYasa,
  stolDaftarlariYasa,
} from "./xona/mebel.js";


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
