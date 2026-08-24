// Yurish CHEGARASI va stol to'sig'i — sof geometriya.
//
// `useYurish.js` dan ajratildi (BRIF-05). Ichida React ham, THREE ham
// yo'q: kirishi son, chiqishi son. Shuning uchun uni sahifasiz sinash
// mumkin va yurish fizikasi shubha tug'dirsa birinchi shu yerga
// qaraladi.

import { YURISH_CHETLANISHI, xonaChegarasi } from "./sozlama.js";

// Yurish chegarasi — xona o'lchamidan hosila, modul yuklanganda bir marta.
// Old tomon kattaroq chetlanadi: eshik va ostona shu yerda.
export const YURISH = (() => {
  const d = xonaChegarasi();
  return {
    xMin: d.xMin + YURISH_CHETLANISHI.yon,
    xMax: d.xMax - YURISH_CHETLANISHI.yon,
    zMin: d.zMin + YURISH_CHETLANISHI.orqa,
    zMax: d.zMax - YURISH_CHETLANISHI.old,
  };
})();

// Qat'iy AABB to'siq kolliziyasi va itarib chiqarish (Push-out separation)
export function stolKolliziyasi(px, pz, minX, maxX, minZ, maxZ, radius = 0.42) {
  const boxMinX = minX - radius;
  const boxMaxX = maxX + radius;
  const boxMinZ = minZ - radius;
  const boxMaxZ = maxZ + radius;

  let x = px;
  let z = pz;

  if (x > boxMinX && x < boxMaxX && z > boxMinZ && z < boxMaxZ) {
    const dLeft = Math.abs(x - boxMinX);
    const dRight = Math.abs(x - boxMaxX);
    const dBack = Math.abs(z - boxMinZ);
    const dFront = Math.abs(z - boxMaxZ);

    const minD = Math.min(dLeft, dRight, dBack, dFront);
    if (minD === dLeft) x = boxMinX;
    else if (minD === dRight) x = boxMaxX;
    else if (minD === dBack) z = boxMinZ;
    else z = boxMaxZ;
  }
  return { x, z };
}
