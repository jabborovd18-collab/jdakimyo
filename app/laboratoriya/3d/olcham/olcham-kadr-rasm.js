// Kadr buferini O'QISH va ko'rik uchun kichik PNG yasash.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Ikkalasi ham xom piksel
// bilan ishlaydi, shuning uchun bitta faylda: biri buferni oladi,
// ikkinchisi o'sha buferdan rasm yasaydi.

export function kadrPikseliniOqi(renderer) {
  const canvas = renderer.domElement;
  const w = canvas.width;
  const h = canvas.height;
  if (w < 2 || h < 2) {
    throw new Error(`Canvas o'lchami yaroqsiz: ${w}×${h}`);
  }
  const gl = renderer.getContext();
  if (!gl || gl.isContextLost?.()) {
    throw new Error("WebGL kontekst yo'q yoki yo'qolgan");
  }
  const pixels = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return { pixels, w, h, gl };
}

export function kadrRasminiYarat(pixels, width, height) {
  const rasmW = 640;
  const rasmH = 360;
  const kichik = new Uint8ClampedArray(rasmW * rasmH * 4);

  // readPixels pastki chapdan boshlanadi. Canvas ImageData esa yuqori
  // chapdan: shu yerda aylantirilmasa ko'rik PNG'i teskari chiqadi.
  for (let y = 0; y < rasmH; y += 1) {
    const srcY = height - 1 - Math.min(height - 1, Math.floor((y + 0.5) * height / rasmH));
    for (let x = 0; x < rasmW; x += 1) {
      const srcX = Math.min(width - 1, Math.floor((x + 0.5) * width / rasmW));
      const src = (srcY * width + srcX) * 4;
      const dst = (y * rasmW + x) * 4;
      kichik[dst] = pixels[src];
      kichik[dst + 1] = pixels[src + 1];
      kichik[dst + 2] = pixels[src + 2];
      kichik[dst + 3] = pixels[src + 3];
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = rasmW;
  canvas.height = rasmH;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(new ImageData(kichik, rasmW, rasmH), 0, 0);
  return canvas.toDataURL("image/png");
}
