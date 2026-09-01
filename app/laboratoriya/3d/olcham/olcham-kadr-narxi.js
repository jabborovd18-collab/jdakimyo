import * as THREE from "three";

function bittaKadr(renderer, scene, kamera, composer) {
  if (composer) composer.render();
  else renderer.render(scene, kamera);
}

function kadrVaqtiniOlch(renderer, scene, kamera, composer, guruhSoni, guruhKattaligi) {
  const gl = renderer.getContext();

  // Shader kompilyatsiyasi va bufer ajratish oddiy kadr narxiga kirmaydi.
  for (let i = 0; i < 5; i += 1) bittaKadr(renderer, scene, kamera, composer);
  gl.finish();

  const namuna = [];
  for (let guruh = 0; guruh < guruhSoni; guruh += 1) {
    const boshlandi = performance.now();
    for (let kadr = 0; kadr < guruhKattaligi; kadr += 1) {
      bittaKadr(renderer, scene, kamera, composer);
    }
    gl.finish();
    namuna.push((performance.now() - boshlandi) / guruhKattaligi);
  }

  namuna.sort((a, b) => a - b);
  const engPast = namuna[0];
  return {
    qiymat: engPast,
    median: namuna[Math.floor(namuna.length / 2)],
    engBaland: namuna[namuna.length - 1],
    // Tashqi jarayonlar vaqtni faqat oshiradi, shu sabab minimum haqiqiy
    // GPU narxiga median qiymatdan yaqinroq turadi.
    tarqoqlik: engPast > 0 ? (namuna[namuna.length - 1] - engPast) / engPast : 0,
  };
}

/**
 * Bir xil kadrni 1x va 4x pikselda o'lchab, geometriya hamda fragment
 * narxini ajratadi. Bu funksiya faqat haqiqiy GPU rendererida chaqiriladi.
 */
export function narxTaqsimoti(renderer, scene, kamera, composer) {
  const eskiNisbat = renderer.getPixelRatio();
  const olcham = new THREE.Vector2();
  renderer.getSize(olcham);

  const bir = kadrVaqtiniOlch(renderer, scene, kamera, composer, 7, 10);
  const piksel1x = renderer.domElement.width * renderer.domElement.height;

  // Qimmat kadrda 4x zond natijani ishonchli qilmaydi, faqat o'lchovni
  // daqiqalarga cho'zadi.
  if (bir.qiymat > 12) {
    return {
      kadrVaqti: bir.qiymat,
      kadrVaqtiTarqoq: bir.tarqoqlik,
      kadrVaqti4x: 0,
      fragment: 0,
      geometriya: 0,
      fragmentUlushi: 0,
      ishonchli: false,
      narxSababi: "kadr qimmat (>12 ms) — 4x zond o'tkazib yuborildi",
      pikselNisbati: 0,
    };
  }

  renderer.setPixelRatio(eskiNisbat * 2);
  renderer.setSize(olcham.x, olcham.y, false);
  if (composer) composer.setSize(olcham.x * eskiNisbat * 2, olcham.y * eskiNisbat * 2);
  const piksel4x = renderer.domElement.width * renderer.domElement.height;
  const tort = kadrVaqtiniOlch(renderer, scene, kamera, composer, 5, 4);

  renderer.setPixelRatio(eskiNisbat);
  renderer.setSize(olcham.x, olcham.y, false);
  if (composer) composer.setSize(olcham.x * eskiNisbat, olcham.y * eskiNisbat);
  bittaKadr(renderer, scene, kamera, composer);

  const nisbat = piksel1x > 0 ? piksel4x / piksel1x : 0;
  const rezolyutsiyaOzgardi = nisbat > 3.5 && nisbat < 4.5;
  const olchashgaArziydi = bir.qiymat >= 0.5;
  const ishonchli = rezolyutsiyaOzgardi
    && olchashgaArziydi
    && tort.qiymat > bir.qiymat * 1.2;

  const sabab = ishonchli
    ? ""
    : !rezolyutsiyaOzgardi
      ? `bufer 4 barobar kattalashmadi (nisbat ${nisbat.toFixed(2)})`
      : !olchashgaArziydi
        ? `kadr arzon (${bir.qiymat.toFixed(2)} ms < 0.5) — taymer aniqligi yetmaydi`
        : `4x kadr 1x dan atigi ${(tort.qiymat / bir.qiymat).toFixed(2)} barobar qimmat`;
  const fragment = ishonchli ? (tort.qiymat - bir.qiymat) / 3 : 0;
  const geometriya = ishonchli ? Math.max(0, bir.qiymat - fragment) : 0;

  return {
    kadrVaqti: bir.qiymat,
    kadrVaqtiTarqoq: bir.tarqoqlik,
    kadrVaqti4x: tort.qiymat,
    fragment,
    geometriya,
    fragmentUlushi: ishonchli && bir.qiymat > 0 ? fragment / bir.qiymat : 0,
    ishonchli,
    narxSababi: sabab,
    pikselNisbati: nisbat,
  };
}

export function dasturiyRenderer(rendererNomi) {
  return /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|software renderer/i.test(
    rendererNomi || "",
  );
}

export function dasturiyRendererNarxi() {
  return {
    kadrVaqti: 0,
    kadrVaqtiTarqoq: 0,
    kadrVaqti4x: 0,
    fragment: 0,
    geometriya: 0,
    fragmentUlushi: 0,
    ishonchli: false,
    narxSababi: "dasturiy renderer — GPU kadr narxi o'lchanmaydi",
    pikselNisbati: 0,
  };
}
