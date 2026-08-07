import { moddaKorinishi } from "./modda-korinishi.js";

// Hex rangni { r, g, b } shakliga o'tkazish (0..255).
// Nega: THREE.Color obyektini ishlatish ushbu toza funksiyani Three.js ga bog'lab qo'yadi.
function hexDanRgb(hex) {
  const son = Number(hex) || 0;
  return {
    r: (son >> 16) & 255,
    g: (son >> 8) & 255,
    b: son & 255,
  };
}

// { r, g, b } ni hex soniga aylantirish.
function rgbDanHex(r, g, b) {
  return ((Math.round(r) & 255) << 16) | ((Math.round(g) & 255) << 8) | (Math.round(b) & 255);
}

// Idishdagi moddalarning hajm bo'yicha og'irlikli o'rtacha rangini hisoblash.
// Nega: rang hech qayerda state'da saqlanmasligi kerak; holat va tarkib o'zgarganda rang ham
// avtomatik ravishda yagona haqiqat manbai (idishdagi suyuqlik hajmi) dan hisoblanishi shart.
export function aralashmaRangi(holat) {
  const moddalar = holat?.moddalar || {};
  const kalitlar = Object.keys(moddalar);

  if (kalitlar.length === 0) {
    return {
      rang: 0xffffff,
      r: 255,
      g: 255,
      b: 255,
      shaffoflik: 0.15,
      loyqalik: 0,
    };
  }

  let jamiMl = 0;
  let rYigindi = 0;
  let gYigindi = 0;
  let bYigindi = 0;
  let shaffoflikYigindi = 0;
  let qattiqMl = 0;

  kalitlar.forEach((kalit) => {
    const modda = moddalar[kalit];
    const ml = Number(modda?.ml) || 0;
    if (ml <= 0) return;

    const korinish = moddaKorinishi(kalit);
    const rgb = hexDanRgb(korinish.rang);

    jamiMl += ml;
    rYigindi += rgb.r * ml;
    gYigindi += rgb.g * ml;
    bYigindi += rgb.b * ml;
    shaffoflikYigindi += (korinish.shaffoflik ?? 0.2) * ml;

    if (korinish.holat === "qattiq") {
      qattiqMl += ml;
    }
  });

  if (jamiMl === 0) {
    return {
      rang: 0xffffff,
      r: 255,
      g: 255,
      b: 255,
      shaffoflik: 0.15,
      loyqalik: 0,
    };
  }

  const rOrtacha = rYigindi / jamiMl;
  const gOrtacha = gYigindi / jamiMl;
  const bOrtacha = bYigindi / jamiMl;
  const shaffoflikOrtacha = shaffoflikYigindi / jamiMl;
  const loyqalik = Math.min(1.0, qattiqMl / jamiMl);

  return {
    rang: rgbDanHex(rOrtacha, gOrtacha, bOrtacha),
    r: rOrtacha,
    g: gOrtacha,
    b: bOrtacha,
    shaffoflik: Number(shaffoflikOrtacha.toFixed(3)),
    loyqalik: Number(loyqalik.toFixed(3)),
  };
}

// Ranglar o'rtasida uzluksiz chiziqli o'tish (lerp): keskin almashtirish o'rniga
// animatsiya va vaqt bo'yicha silliq o'zgarishni ta'minlaydi.
export function rangGaOt(hozirgi, nishon, dt, davomiylik = 0.6) {
  if (!hozirgi || !nishon) return nishon || hozirgi;

  const f = Math.min(1.0, Math.max(0, dt / Math.max(0.001, davomiylik)));

  const r = hozirgi.r + (nishon.r - hozirgi.r) * f;
  const g = hozirgi.g + (nishon.g - hozirgi.g) * f;
  const b = hozirgi.b + (nishon.b - hozirgi.b) * f;
  const shaffoflik = hozirgi.shaffoflik + (nishon.shaffoflik - hozirgi.shaffoflik) * f;
  const loyqalik = (hozirgi.loyqalik || 0) + ((nishon.loyqalik || 0) - (hozirgi.loyqalik || 0)) * f;

  return {
    rang: rgbDanHex(r, g, b),
    r,
    g,
    b,
    shaffoflik: Number(shaffoflik.toFixed(3)),
    loyqalik: Number(loyqalik.toFixed(3)),
  };
}