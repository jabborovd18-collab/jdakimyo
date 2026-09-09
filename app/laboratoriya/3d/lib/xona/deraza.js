// app/laboratoriya/3d/lib/xona/deraza.js
//
// Deraza: teshikli chap devor, ram, tokcha, shisha.
//
// BRIF-05 (2-bosqich): `qobiq.js` mazmun bo'yicha bo'lindi. Xatti-
// harakat o'zgarmadi — faqat kodning joyi. Geometriya va pozitsiyalar
// `pol-shift-devor.js` dagi chaqiruv bilan birga avvalgidek.

import * as THREE from "three";
import { DEVOR_QALINLIGI } from "./yordamchi.js";


/**
 * Deraza o'lchamlari xona o'lchamidan hisoblanadi.
 *
 * Soni ham hisoblanadi: uzunroq devorga ko'proq deraza tushadi.
 * Tubi 1.1 m — ish stoli balandligidan yuqori, ya'ni tokcha ostiga
 * jihoz sig'adi. Tepasi shipdan 0.7 m pastda.
 */
export function derazaOlchami(boyi, balandligi) {
  const soni = Math.max(3, Math.round(boyi / 3));
  const oraliq = boyi / soni;
  return {
    soni,
    oraliq,
    eni: Math.min(2.4, oraliq - 1.0),
    tubi: 1.1,
    tepasi: balandligi - 0.7,
  };
}


/**
 * Chap devor — deraza TESHIKLARI bilan.
 *
 * `ExtrudeGeometry` + `Shape.holes` bitta ish bilan uchta narsani
 * beradi: haqiqiy teshik, devor qalinligi va teshik yon yuzalari
 * (chuqurlik/reveal). Ular bo'lmasa deraza tekis oq to'rtburchak
 * bo'lib ko'rinardi.
 *
 * UV lar QO'LDA qayta hisoblanadi: `ExtrudeGeometry` UV ni vertex
 * koordinatasidan oladi, devor teksturasi esa `repeat(6, 4)` bilan
 * 0..1 UV kutadi. Qayta hisoblamasa tekstura metrga 6 marta
 * takrorlanib, devor shovqinga aylanardi.
 */
export function chapDevorniYasa(eni, balandligi, ichkiX, markazZ, devorMat) {
  const yarim = eni / 2;
  const shakl = new THREE.Shape();
  shakl.moveTo(-yarim, 0);
  shakl.lineTo(yarim, 0);
  shakl.lineTo(yarim, balandligi);
  shakl.lineTo(-yarim, balandligi);
  shakl.lineTo(-yarim, 0);

  const d = derazaOlchami(eni, balandligi);
  const teshikMarkazlari = [];
  for (let i = 0; i < d.soni; i += 1) {
    const siljish = (i + 0.5 - d.soni / 2) * d.oraliq;
    teshikMarkazlari.push(siljish);
    const teshik = new THREE.Path();
    const x1 = siljish - d.eni / 2;
    const x2 = siljish + d.eni / 2;
    teshik.moveTo(x1, d.tubi);
    teshik.lineTo(x2, d.tubi);
    teshik.lineTo(x2, d.tepasi);
    teshik.lineTo(x1, d.tepasi);
    teshik.lineTo(x1, d.tubi);
    shakl.holes.push(teshik);
  }

  const geo = new THREE.ExtrudeGeometry(shakl, {
    depth: DEVOR_QALINLIGI,
    bevelEnabled: false,
  });

  const joy = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < joy.count; i += 1) {
    uv.setXY(i, (joy.getX(i) + yarim) / eni, joy.getY(i) / balandligi);
  }
  uv.needsUpdate = true;

  const devor = new THREE.Mesh(geo, devorMat);
  // Y bo'yicha +90 gradus: lokal (x, y, z) -> dunyo (z, y, -x).
  // Ya'ni ekstruziya yo'nalishi dunyo +X ga, shakl kengligi esa -Z ga
  // o'tadi. Devor xonadan TASHQARIGA qalinlashsin uchun boshlanishi
  // ichki yuzadan bir qalinlik chapda turadi.
  devor.rotation.y = Math.PI / 2;
  devor.position.set(ichkiX - DEVOR_QALINLIGI, 0, markazZ);
  devor.receiveShadow = true;
  return { devor, olcham: d, markazlar: teshikMarkazlari };
}


/**
 * Har teshik uchun ram, tokcha va shisha.
 *
 * Geometriyalar bir marta yasaladi va hamma derazaga ulashiladi —
 * BRIF-07 birlashtiruvchisi ularni material bo'yicha yig'adi.
 *
 * `roomGroup.add` tartibi `qobiq.js` dagi asl tartib bilan bir xil —
 * shaffof shisha uchun render tartibi pikselga ta'sir qiladi.
 */
export function derazaBezaklariniQosh(roomGroup, chap, sozlama) {
  const { devorX, markazZ, shishaMat, ramkaMat, devorMat } = sozlama;

  const dz = chap.olcham;
  const derazaBalandlik = dz.tepasi - dz.tubi;
  const derazaMarkazY = (dz.tepasi + dz.tubi) / 2;

  const shishaGeo = new THREE.BoxGeometry(0.018, derazaBalandlik, dz.eni);
  const ramGorizontalGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI, 0.06, dz.eni + 0.12);
  const ramVertikalGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI, derazaBalandlik + 0.12, 0.06);
  const orqaUstunGeo = new THREE.BoxGeometry(0.05, derazaBalandlik, 0.05);
  const tokchaGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI + 0.12, 0.04, dz.eni + 0.22);

  for (const siljish of chap.markazlar) {
    // Devor lokal X dunyo -Z ga o'tadi (chapDevorniYasa dagi burilish).
    const z = markazZ - siljish;

    const shisha = new THREE.Mesh(shishaGeo, shishaMat);
    shisha.position.set(devorX, derazaMarkazY, z);
    roomGroup.add(shisha);

    const ramTepa = new THREE.Mesh(ramGorizontalGeo, ramkaMat);
    ramTepa.position.set(devorX, dz.tepasi + 0.03, z);
    roomGroup.add(ramTepa);

    const ramTub = new THREE.Mesh(ramGorizontalGeo, ramkaMat);
    ramTub.position.set(devorX, dz.tubi - 0.03, z);
    roomGroup.add(ramTub);

    for (const yon of [-1, 1]) {
      const ramYon = new THREE.Mesh(ramVertikalGeo, ramkaMat);
      ramYon.position.set(devorX, derazaMarkazY, z + yon * (dz.eni / 2 + 0.03));
      roomGroup.add(ramYon);
    }

    // O'rta ustun — derazani ikkiga bo'ladi. Usiz 2.4 m keng oyna
    // vitrinaga o'xshaydi, laboratoriya derazasiga emas.
    const ustun = new THREE.Mesh(orqaUstunGeo, ramkaMat);
    ustun.position.set(devorX, derazaMarkazY, z);
    roomGroup.add(ustun);

    // Tokcha — xona ichiga chiqadi va soya beradi, ya'ni deraza
    // devorga chizilgan emas, devorga O'RNATILGAN bo'lib ko'rinadi.
    const tokcha = new THREE.Mesh(tokchaGeo, devorMat);
    tokcha.position.set(devorX + 0.06, dz.tubi - 0.02, z);
    roomGroup.add(tokcha);
  }
}
