// Protsedural teksturalar — Canvas orqali yasaladi, tarmoqqa chiqmaydi.
//
// NEGA KERAK. Ilgari stol, pol va devorlar bir tekis rangli edi — bu aynan
// "Minecraft" tuyg'usini beradigan asosiy omillardan biri: haqiqiy labda
// yog'ochda gul bor, pol plitkali, devorda mikro-no'xatsimonlik bor. Bir
// tekis rangda bularning hech biri aks etmaydi.
//
// Bularning hammasi `THREE.CanvasTexture` orqali protsedural: hech qanday
// .png/.jpg yuklanmaydi, tarmoqqa chiqilmaydi — faqat bir marta chiziladi va
// GPU xotirasida qoladi. O'lchamlar kichik (≤512), RepeatWrapping bilan
// tekislanadi, shuning uchun ishlash narxi kichik.

import * as THREE from "three";

/**
 * Hex rangni RGB obyektiga aylantiradi.
 * @param {number} hex — 0xRRGGBB
 */
function hexRgb(hex) {
  return {
    r: (hex >> 16) & 255,
    g: (hex >> 8) & 255,
    b: hex & 255,
  };
}

/** 0..1 orasidagi qoraytirish/yoritish koeffitsiyentini rangga qo'llaydi. */
function rangniSozla(rgb, k) {
  const yor = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${yor(rgb.r)},${yor(rgb.g)},${yor(rgb.b)})`;
}

/**
 * Yog'och gul teksturasi — stol sirti uchun.
 *
 * Qatlamli chiziqlar + yumshoq ohang o'zgarishi haqiqiy taxtani beradi.
 * @param {number} asosRang — stolning asosiy rangi (fonlar.js `stol`)
 * @param {number} [olcham=512] — canvas o'lchami (taxta uzunligi)
 */
export function yogochTeksturasi(asosRang = 0x8b5a2b, olcham = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = olcham;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const asos = hexRgb(asosRang);

  // Asosiy to'ldiruvchi — taxtaning o'rta ohangi.
  ctx.fillStyle = rangniSozla(asos, 1.0);
  ctx.fillRect(0, 0, olcham, 128);

  // Uzunlamasiga cho'zilgan gul chiziqlari (daraxt halqalarini eslatadi).
  for (let i = 0; i < 140; i++) {
    const y = Math.random() * 128;
    const qalinlik = 1 + Math.random() * 2.5;
    const quyuq = 0.92 + Math.random() * 0.16; // 0.92..1.08 atrofida
    ctx.fillStyle = rangniSozla(asos, quyuq);
    ctx.globalAlpha = 0.35 + Math.random() * 0.4;
    ctx.fillRect(0, y, olcham, qalinlik);
  }
  ctx.globalAlpha = 1;

  // Yumshoq uzun tolalar — gulga yo'nalish beradi.
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 128;
    ctx.strokeStyle = rangniSozla(asos, 0.96 + Math.random() * 0.08);
    ctx.globalAlpha = 0.15 + Math.random() * 0.25;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= olcham; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 3);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Filtrlash va anizotropiya bu yerda BELGILANMAYDI — ularning yagona
  // egasi `tekstura-sifati.js`. Ilgari bu yerda qattiq `anisotropy = 4`
  // turardi va u faqat yog'ochga tegishli edi; pol bilan devor esa
  // umuman anizotropiyasiz qolgan edi.
  return texture;
}

/**
 * Pol teksturasi — plitka (laboratoriya epoksi/vinil).
 * @param {number} asosRang — polning asosiy rangi (fonlar.js `pol`)
 * @param {number} [katak=4] — kataklar soni (qatorda)
 * @param {number} [olcham=512] — profil belgilagan canvas o'lchami
 */
export function polTeksturasi(asosRang = 0x2c3036, katak = 4, olcham = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = olcham;
  canvas.height = olcham;
  const ctx = canvas.getContext("2d");

  const asos = hexRgb(asosRang);
  const katakOlcham = olcham / katak;

  for (let r = 0; r < katak; r++) {
    for (let c = 0; c < katak; c++) {
      // Har bir plitka bir-biridan biroz farq qiladi (real sirt).
      const farq = 0.97 + Math.random() * 0.06;
      ctx.fillStyle = rangniSozla(asos, farq);
      ctx.fillRect(c * katakOlcham, r * katakOlcham, katakOlcham, katakOlcham);
    }
  }

  // Katak oralig'idagi choklar (grout).
  ctx.strokeStyle = rangniSozla(asos, 0.7);
  ctx.lineWidth = 3;
  for (let i = 0; i <= katak; i++) {
    ctx.beginPath();
    ctx.moveTo(i * katakOlcham, 0);
    ctx.lineTo(i * katakOlcham, olcham);
    ctx.moveTo(0, i * katakOlcham);
    ctx.lineTo(olcham, i * katakOlcham);
    ctx.stroke();
  }

  // Yengil mikro tosh/no'xatsimonlik.
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = rangniSozla(asos, 0.92 + Math.random() * 0.16);
    ctx.globalAlpha = 0.2 + Math.random() * 0.3;
    ctx.fillRect(Math.random() * olcham, Math.random() * olcham, 2, 2);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Devor teksturasi — yengil beton/gips to'sig'i.
 * @param {number} asosRang — devor rangi (fonlar.js `devor`)
 * @param {number} [olcham=256] — profil belgilagan canvas o'lchami
 */
export function devorTeksturasi(asosRang = 0x1e293b, olcham = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = olcham;
  canvas.height = olcham;
  const ctx = canvas.getContext("2d");

  const asos = hexRgb(asosRang);
  ctx.fillStyle = rangniSozla(asos, 1.0);
  ctx.fillRect(0, 0, olcham, olcham);

  // To'siq (plaster) — katta, yumshoq dog'lar.
  for (let i = 0; i < 160; i++) {
    const k = 0.94 + Math.random() * 0.12;
    ctx.fillStyle = rangniSozla(asos, k);
    ctx.globalAlpha = 0.1 + Math.random() * 0.2;
    const s = 6 + Math.random() * 40;
    ctx.fillRect(Math.random() * olcham, Math.random() * olcham, s, s);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
