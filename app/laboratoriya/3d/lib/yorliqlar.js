import * as THREE from "three";

export const YORLIQLAR_SAQLASH_KALITI = "lab-3d-yorliqlar";
export const YORLIQ_TEKSHIRISH_QADAMI = 5;

const YORLIQ_BELGISI = "lab3dYorliq";
const TOSIQ_BELGISI = "lab3dYorliqTosigi";
// Boshlang'ich stol yorliqlari 2–3 m da qoladi; 5 m dan naridagi boshqa
// stol/javon yozuvlari o'qilmaydi va ekranni band qilmaydi.
export const YORLIQ_ENG_UZOQ_MASOFA = 5;
const ORALIQ_PX = 3;

/** Faqat o'quv nomi/formulasi bo'lgan Sprite'ni boshqariladigan qiladi. */
export function yorliqniBelgila(sprite) {
  if (!sprite) return sprite;
  sprite.userData[YORLIQ_BELGISI] = true;
  sprite.userData.yorliqGlobalYoqilgan = true;
  sprite.userData.yorliqQoldaYashirin = false;
  sprite.userData.yorliqToqnashuvda = false;
  sprite.userData.yorliqMasofada = false;
  return sprite;
}

/** Masalan, termometrning 25°C ko'rsatkichi: yashirilmaydi, ammo joyi band. */
export function yorliqTosigiSifatidaBelgila(sprite) {
  if (!sprite) return sprite;
  sprite.userData[TOSIQ_BELGISI] = true;
  return sprite;
}

function kesishadimi(a, b) {
  return !(
    a.ong + ORALIQ_PX <= b.chap
    || a.chap >= b.ong + ORALIQ_PX
    || a.past + ORALIQ_PX <= b.tepa
    || a.tepa >= b.past + ORALIQ_PX
  );
}

function ekranTortburchagi(sprite, kamera, kenglik, balandlik) {
  const dunyoJoy = new THREE.Vector3();
  const dunyoScale = new THREE.Vector3();
  sprite.getWorldPosition(dunyoJoy);
  sprite.getWorldScale(dunyoScale);

  const kameraJoy = dunyoJoy.clone().applyMatrix4(kamera.matrixWorldInverse);
  const chuqurlik = -kameraJoy.z;
  if (chuqurlik <= 0.01) return null;

  const ndc = dunyoJoy.clone().project(kamera);
  if (ndc.z < -1 || ndc.z > 1) return null;

  const markazX = (ndc.x * 0.5 + 0.5) * kenglik;
  const markazY = (-ndc.y * 0.5 + 0.5) * balandlik;
  const yarimFov = THREE.MathUtils.degToRad(kamera.fov) / 2;
  const pikselBirlik = balandlik / (2 * Math.tan(yarimFov) * chuqurlik);
  const eni = Math.abs(dunyoScale.x) * pikselBirlik;
  const boyi = Math.abs(dunyoScale.y) * pikselBirlik;

  const tortburchak = {
    chap: markazX - eni / 2,
    ong: markazX + eni / 2,
    tepa: markazY - boyi / 2,
    past: markazY + boyi / 2,
  };
  if (
    tortburchak.ong < 0
    || tortburchak.chap > kenglik
    || tortburchak.past < 0
    || tortburchak.tepa > balandlik
  ) {
    return null;
  }

  return {
    ...tortburchak,
    masofa: dunyoJoy.distanceTo(kamera.position),
  };
}

function egasiQoldami(yorliq) {
  const egasi = yorliq.parent;
  return Boolean(egasi?.userData?.qolda || egasi?.userData?.kotarilgan);
}

/** Idish ko'tarilishi bilan keyingi 5-kadrni kutmasdan yorliqni yashiradi. */
export function idishYorliginiQoldaYangila(idish, qolda) {
  if (!idish) return;
  idish.traverse((obyekt) => {
    if (!obyekt.userData?.[YORLIQ_BELGISI]) return;
    obyekt.userData.yorliqQoldaYashirin = Boolean(qolda);
    if (qolda) {
      obyekt.visible = false;
      return;
    }
    obyekt.visible = Boolean(
      obyekt.userData.yorliqGlobalYoqilgan
      && !obyekt.userData.yorliqToqnashuvda
      && !obyekt.userData.yorliqMasofada,
    );
  });
}

/**
 * Yaqin yorliq ustun: to'siq va oldingi yaqin yorliq bilan kesishgan uzoq
 * Sprite yashiriladi. Funksiya render qilmaydi; faqat `visible` holatini yozadi.
 */
export function yorliqlarniYangila(scene, kamera, renderer, yoqilgan = true) {
  if (!scene || !kamera || !renderer) {
    return { yorliqSoni: 0, yorliqToqnashuvi: 0 };
  }

  kamera.updateMatrixWorld();
  kamera.matrixWorldInverse.copy(kamera.matrixWorld).invert();
  scene.updateMatrixWorld(true);

  const canvas = renderer.domElement;
  const kenglik = Math.max(1, canvas.clientWidth || canvas.width || 1);
  const balandlik = Math.max(1, canvas.clientHeight || canvas.height || 1);
  const yorliqlar = [];
  const bandJoylar = [];

  scene.traverse((obyekt) => {
    if (obyekt.userData?.[TOSIQ_BELGISI] && obyekt.visible) {
      const rect = ekranTortburchagi(obyekt, kamera, kenglik, balandlik);
      if (rect) bandJoylar.push(rect);
      return;
    }
    if (!obyekt.userData?.[YORLIQ_BELGISI]) return;

    obyekt.userData.yorliqGlobalYoqilgan = Boolean(yoqilgan);
    obyekt.userData.yorliqQoldaYashirin = egasiQoldami(obyekt);
    obyekt.userData.yorliqToqnashuvda = false;

    if (!yoqilgan || obyekt.userData.yorliqQoldaYashirin) {
      obyekt.visible = false;
      return;
    }

    const rect = ekranTortburchagi(obyekt, kamera, kenglik, balandlik);
    const uzoq = !rect || rect.masofa > YORLIQ_ENG_UZOQ_MASOFA;
    obyekt.userData.yorliqMasofada = uzoq;
    if (uzoq) {
      obyekt.visible = false;
      return;
    }
    yorliqlar.push({ obyekt, rect });
  });

  yorliqlar.sort((a, b) => a.rect.masofa - b.rect.masofa);
  const korinadigan = [];
  for (const yozuv of yorliqlar) {
    const toqnashdi = bandJoylar.some((rect) => kesishadimi(yozuv.rect, rect));
    yozuv.obyekt.userData.yorliqToqnashuvda = toqnashdi;
    yozuv.obyekt.visible = !toqnashdi;
    if (!toqnashdi) {
      bandJoylar.push(yozuv.rect);
      korinadigan.push(yozuv);
    }
  }

  let toqnashuv = 0;
  for (let i = 0; i < korinadigan.length; i += 1) {
    for (let j = i + 1; j < korinadigan.length; j += 1) {
      if (kesishadimi(korinadigan[i].rect, korinadigan[j].rect)) toqnashuv += 1;
    }
  }

  return {
    yorliqSoni: korinadigan.length,
    yorliqToqnashuvi: toqnashuv,
  };
}
