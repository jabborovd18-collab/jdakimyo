// app/laboratoriya/3d/lib/manzara.js
//
// Deraza ortidagi tungi shahar manzarasi.
//
// NEGA GEOMETRIYA EMAS, FON: xona to'rt devor bilan yopiq, ya'ni
// `scene.background` FAQAT deraza teshigidan ko'rinadi. Shu sababli
// manzara uchun bitta ham mesh, bitta ham draw call sarflanmaydi —
// u allaqachon chiziladigan fonning o'rnini egallaydi.
//
// Muqobil variant — derazadan tashqarida ulkan tekislik — 1 mesh,
// 1 material va parallaks muammosi bo'lardi: yurganda uzoqdagi
// bino yaqindagidek siljib ko'rinardi. Ekvirektangulyar fon esa
// cheksiz uzoqlikda turadi, ya'ni fizik jihatdan to'g'ri.
//
// Tekstura BIR MARTA quriladi va sahna bilan birga bo'shatiladi.

import * as THREE from "three";

// Qat'iy urug': manzara har yuklashda AYNI bo'lishi kerak, aks holda
// o'lchagichning oldin/keyin taqqoslashi ma'nosini yo'qotadi
// (`Math.random` bilan har kadr boshqa shahar chiqardi).
function qatiyTasodif(urug) {
  let holat = urug >>> 0;
  return () => {
    holat = (Math.imul(1664525, holat) + 1013904223) >>> 0;
    return holat / 0x100000000;
  };
}

const URUG = 20260822;

// 2:1 nisbat ekvirektangulyar xaritalash uchun majburiy.
const EN = 2048;
const BOY = 1024;

// Ufq kanvasning o'rtasidan biroz pastda: kuzatuvchi ko'zi 1.6 m da,
// binolar esa undan baland — ya'ni manzaraning ko'p qismi ufqdan
// YUQORIDA bo'lishi kerak.
const UFQ = 0.56;

function osmonniChiz(ctx) {
  // Tungi osmon: tepada deyarli qora, ufqda shaharning yorug'lik gumbazi.
  // Bu "light dome" effekti — katta shahar ustidagi haqiqiy ko'rinish.
  const grad = ctx.createLinearGradient(0, 0, 0, BOY * UFQ);
  grad.addColorStop(0, "#05070e");
  grad.addColorStop(0.55, "#0a1020");
  grad.addColorStop(0.85, "#16233c");
  grad.addColorStop(1, "#2b3a55");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, EN, BOY * UFQ);

  // Ufqdan pastda — daryo va yaqin qorong'ilik.
  const past = ctx.createLinearGradient(0, BOY * UFQ, 0, BOY);
  past.addColorStop(0, "#111a2b");
  past.addColorStop(1, "#04060b");
  ctx.fillStyle = past;
  ctx.fillRect(0, BOY * UFQ, EN, BOY * (1 - UFQ));
}

function yulduzlarniChiz(ctx, tasodif) {
  // Kam va xira: shahar ustida yulduz deyarli ko'rinmaydi. Ular
  // butunlay yo'q bo'lsa osmon "o'lik" ko'rinadi, ko'p bo'lsa
  // manzara qishloqqa aylanadi.
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 220; i += 1) {
    const x = tasodif() * EN;
    const y = tasodif() * BOY * UFQ * 0.7;
    const r = tasodif() * 0.9 + 0.3;
    ctx.globalAlpha = 0.06 + tasodif() * 0.16;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * Bir qatlam bino siluetlari.
 *
 * `uzoqlik` 0 (eng uzoq) dan 1 (eng yaqin) gacha: uzoq qatlam ochroq
 * va pastroq — havo perspektivasi. Bu haqiqiy tungi shaharning
 * asosiy belgisi: uzoq binolar tuman ichida yo'qoladi.
 */
function qatlamniChiz(ctx, tasodif, uzoqlik, sozlama) {
  const asosY = BOY * UFQ;
  const rang = sozlama.rang;
  const derazaRang = sozlama.derazaRang;
  const maksBaland = sozlama.maksBaland;
  const minBaland = sozlama.minBaland;
  const enMin = sozlama.enMin;
  const enMaks = sozlama.enMaks;

  let x = -60;
  while (x < EN + 60) {
    const en = enMin + tasodif() * (enMaks - enMin);
    const baland = minBaland + tasodif() * (maksBaland - minBaland);
    const tepaY = asosY - baland;

    ctx.fillStyle = rang;
    ctx.fillRect(x, tepaY, en, baland + 40);

    // Ba'zi binolarda tepa qismi torayadi yoki antenna bo'ladi —
    // aynan shu narsa siluetni "shahar" qiladi, "tarash" emas.
    const shakl = tasodif();
    if (shakl > 0.86) {
      const torEn = en * (0.35 + tasodif() * 0.25);
      const torBaland = baland * (0.14 + tasodif() * 0.18);
      ctx.fillRect(x + (en - torEn) / 2, tepaY - torBaland, torEn, torBaland);
      if (tasodif() > 0.5) {
        ctx.fillRect(x + en / 2 - 1.5, tepaY - torBaland - 34, 3, 34);
      }
    } else if (shakl > 0.72) {
      ctx.beginPath();
      ctx.moveTo(x, tepaY);
      ctx.lineTo(x + en / 2, tepaY - baland * 0.16);
      ctx.lineTo(x + en, tepaY);
      ctx.closePath();
      ctx.fill();
    }

    // Yoritilgan derazalar. Uzoq qatlamda kamroq va xiraroq.
    if (uzoqlik > 0.25) {
      const qadamX = 9;
      const qadamY = 13;
      const chet = 5;
      for (let wy = tepaY + 10; wy < asosY - 6; wy += qadamY) {
        for (let wx = x + chet; wx < x + en - chet - 4; wx += qadamX) {
          if (tasodif() > 0.62) continue;
          ctx.globalAlpha = (0.25 + tasodif() * 0.6) * uzoqlik;
          ctx.fillStyle = tasodif() > 0.88 ? "#dbeafe" : derazaRang;
          ctx.fillRect(wx, wy, 4.5, 6.5);
        }
      }
      ctx.globalAlpha = 1;
    }

    x += en + 3 + tasodif() * 16;
  }
}

function ufqGumbaziniChiz(ctx) {
  // Binolar ustidan yengil tuman: uzoq qatlamni yumshatadi va
  // qatlamlar orasidagi keskin chegarani yo'qotadi.
  const grad = ctx.createLinearGradient(0, BOY * UFQ - 260, 0, BOY * UFQ + 20);
  grad.addColorStop(0, "rgba(43, 58, 85, 0)");
  grad.addColorStop(1, "rgba(58, 78, 112, 0.42)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, BOY * UFQ - 260, EN, 280);
}

/**
 * Tungi shahar manzarasi teksturasi (ekvirektangulyar).
 *
 * `scene.background` ga qo'yiladi. Xona yopiq bo'lgani uchun u faqat
 * deraza teshigidan ko'rinadi.
 */
export function shaharManzarasiniYarat() {
  const canvas = document.createElement("canvas");
  canvas.width = EN;
  canvas.height = BOY;
  const ctx = canvas.getContext("2d");
  const tasodif = qatiyTasodif(URUG);

  osmonniChiz(ctx);
  yulduzlarniChiz(ctx, tasodif);

  // Uch qatlam — uzoqdan yaqinga. Har qatlam to'qroq va balandroq.
  qatlamniChiz(ctx, tasodif, 0.22, {
    rang: "#1b2740", derazaRang: "#93c5fd",
    minBaland: 90, maksBaland: 230, enMin: 34, enMaks: 76,
  });
  qatlamniChiz(ctx, tasodif, 0.6, {
    rang: "#111a2c", derazaRang: "#fcd34d",
    minBaland: 140, maksBaland: 330, enMin: 46, enMaks: 104,
  });
  ufqGumbaziniChiz(ctx);
  qatlamniChiz(ctx, tasodif, 1.0, {
    rang: "#070c16", derazaRang: "#fde68a",
    minBaland: 200, maksBaland: 460, enMin: 58, enMaks: 132,
  });

  const tekstura = new THREE.CanvasTexture(canvas);
  tekstura.mapping = THREE.EquirectangularReflectionMapping;
  tekstura.colorSpace = THREE.SRGBColorSpace;
  tekstura.needsUpdate = true;
  tekstura.name = "Tungi_Shahar_Manzarasi";
  return tekstura;
}
