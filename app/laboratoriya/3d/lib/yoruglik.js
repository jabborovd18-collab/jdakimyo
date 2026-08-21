import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

RectAreaLightUniformsLib.init();

const YORUGLIK_PROFILLARI = Object.freeze({
  telefon: Object.freeze({
    // Kamroq chiroq qorong'i sahna degani emas: ambient desktopdagi panel,
    // deraza va fill yo'qligini qoplaydi, directional esa kontrastni saqlaydi.
    muhit: Object.freeze({ rang: 0x404060, kuch: 0.9 }),
    asosiy: Object.freeze({ rang: 0xfffbeb, kuch: 2.2 }),
    toldiruvchi: Object.freeze({ rang: 0xdbeafe, kuch: 0.4 }),
  }),
  desktop: Object.freeze({
    muhit: Object.freeze({ rang: 0x404060, kuch: 0.3 }),
    asosiy: Object.freeze({ rang: 0xfffbeb, kuch: 1.4 }),
    toldiruvchi: Object.freeze({ rang: 0xdbeafe, kuch: 0.4 }),
  }),
  ilova: Object.freeze({
    muhit: Object.freeze({ rang: 0x404060, kuch: 0.3 }),
    asosiy: Object.freeze({ rang: 0xfffbeb, kuch: 1.4 }),
    toldiruvchi: Object.freeze({ rang: 0xdbeafe, kuch: 0.4 }),
  }),
});

// Profil byudjeti (boshlang'ich yashirin spirtovka PointLight'i bilan):
//
// | profil  | statik to'plam                                      | jami |
// | telefon | ambient 0.9 + asosiy directional 2.2                | 2+1=3 |
// | desktop | ambient 0.3 + asosiy 1.4 + fill/deraza + 3 area    | 7+1=8 |
// | ilova   | desktop asoslari + 8 area                            | 12+1=13 |
//
// Dinamik qizish effekti o'lchov paytida faol emas. Pishirilgan yorug'lik
// keyingi 0.6 bosqich; bu yerda real-time byudjet profil chegarasida.

// Panel mesh va uning nuri bir joyga qarashi kerak. Koordinata shu faylda
// bitta marta turadi; xona modeli faqat yuzalarni shu ro'yxatdan yasaydi.
export const SHIP_PANEL_JOYLARI = Object.freeze([
  Object.freeze([-5.0, -3.0]),
  Object.freeze([-1.8, -3.0]),
  Object.freeze([1.8, -3.0]),
  Object.freeze([5.0, -3.0]),
  Object.freeze([-5.0, 2.5]),
  Object.freeze([-1.8, 2.5]),
  Object.freeze([1.8, 2.5]),
  Object.freeze([5.0, 2.5]),
]);

// Desktopda sakkiz panel nuri uchta keng zonaga birlashtiriladi. Panel
// meshlarining o'zi sakkiztaligicha qoladi; faqat fragmentga tushadigan
// qimmat LTC manbalari kamayadi.
const DESKTOP_PANEL_NURLARI = Object.freeze([
  Object.freeze([-3.4, -3.0, 4.5, 0.8]),
  Object.freeze([3.4, -3.0, 4.5, 0.8]),
  Object.freeze([0, 2.5, 8.0, 0.8]),
]);

// Boshlang'ich spirtovka yashirin PointLight saqlaydi va scene.traverse uni
// sanaydi. Statik quruvchi byudjetda shu bitta joyni oldindan zaxiralaydi.
const DINAMIK_CHIROQ_ZAXIRASI = 1;

// BRIF-01B: 0.87 oq nuqtasiz xira qoldi; yuqori ekspozitsiya va lokal
// hotspotlar esa o'rtacha/supurishni buzdi. 0.95 + past ambient sun'iy
// doirasiz eng yorug' tabiiy variant bo'lib o'lchandi.
export const TONE_MAPPING_EKSPOZITSIYA = 0.95;

// Quyidagi kichik factory'lar modal, jihoz va vaqtinchalik effektlarda ham
// Light konstruktorining yagona egasini saqlaydi. Ular qiymatni o'zgartirmaydi.
export function muhitNuriniYarat(rang, kuch) {
  return new THREE.AmbientLight(rang, kuch);
}

export function yonalishNuriniYarat(rang, kuch) {
  return new THREE.DirectionalLight(rang, kuch);
}

export function nuqtaNuriniYarat(rang, kuch, masofa = 0, decay = 2) {
  return new THREE.PointLight(rang, kuch, masofa, decay);
}

export function maydonNuriniYarat(rang, kuch, eni, boyi) {
  return new THREE.RectAreaLight(rang, kuch, eni, boyi);
}

export function alangaNuriniYarat() {
  const nur = nuqtaNuriniYarat(0xfbbf24, 1.4, 1.2);
  nur.name = "Yoruglik_Spirtovka";
  return nur;
}

export function qizishNuriniYarat(rang) {
  const nur = nuqtaNuriniYarat(rang, 1.5, 1.8);
  nur.name = "Yoruglik_Qizish_Effekti";
  return nur;
}

export function tortmaShkafNuriniYarat() {
  const nur = nuqtaNuriniYarat(0xffffff, 1.0, 1.8);
  nur.name = "Yoruglik_Tortma_Shkaf";
  return nur;
}

/**
 * Asosiy laboratoriya sahnasining barcha statik nuri va IBL muhiti.
 *
 * Renderer PMREM uchun majburiy: RoomEnvironment Scene, scene.environment
 * esa Texture kutadi. Shu sabab renderer yashirin global emas, aniq argument.
 */
export function yoruglikniQur(scene, profil, renderer) {
  if (!scene || !profil || !renderer) {
    throw new Error("Yorug'lik uchun scene, profil va renderer kerak");
  }
  const daraja = YORUGLIK_PROFILLARI[profil.nom];
  if (!daraja) throw new Error(`Yorug'lik profili topilmadi: ${profil.nom}`);

  renderer.toneMappingExposure = TONE_MAPPING_EKSPOZITSIYA;
  const chiroqlar = [];
  const qosh = (chiroq, nom) => {
    chiroq.name = nom;
    scene.add(chiroq);
    chiroqlar.push(chiroq);
    return chiroq;
  };

  const muhit = qosh(
    muhitNuriniYarat(daraja.muhit.rang, daraja.muhit.kuch),
    "Yoruglik_Muhit",
  );

  const asosiy = qosh(
    yonalishNuriniYarat(daraja.asosiy.rang, daraja.asosiy.kuch),
    "Yoruglik_Asosiy",
  );
  asosiy.position.set(2.5, 4.0, 2.0);
  asosiy.castShadow = profil.soya;
  if (asosiy.castShadow) {
    asosiy.shadow.mapSize.width = 1024;
    asosiy.shadow.mapSize.height = 1024;
    asosiy.shadow.camera.near = 0.5;
    asosiy.shadow.camera.far = 15;
    asosiy.shadow.camera.left = -2.6;
    asosiy.shadow.camera.right = 2.6;
    asosiy.shadow.camera.top = 2.6;
    asosiy.shadow.camera.bottom = -2.6;
    asosiy.shadow.bias = -0.0005;
    asosiy.shadow.normalBias = 0.02;
  }

  let toldiruvchi = null;
  if (profil.nom !== "telefon") {
    toldiruvchi = qosh(
      yonalishNuriniYarat(
        daraja.toldiruvchi.rang,
        daraja.toldiruvchi.kuch,
      ),
      "Yoruglik_Toldiruvchi",
    );
    toldiruvchi.position.set(-2.5, 2.0, -2.0);
    toldiruvchi.castShadow = false;
  }

  const panelNurlari = profil.nom === "ilova"
    ? SHIP_PANEL_JOYLARI.map(([x, z]) => [x, z, 2.0, 0.8])
    : profil.nom === "desktop"
      ? DESKTOP_PANEL_NURLARI
      : [];
  for (const [indeks, [x, z, eni, boyi]] of panelNurlari.entries()) {
    const panel = qosh(
      maydonNuriniYarat(0xeef4ff, 1.4, eni, boyi),
      `Yoruglik_Panel_${indeks + 1}`,
    );
    panel.position.set(x, 4.15, z);
    panel.lookAt(x, 0.6, z);
  }

  if (profil.nom !== "telefon") {
    const derazaNuri = qosh(
      yonalishNuriniYarat(0xe0f2fe, 1.4),
      "Yoruglik_Deraza",
    );
    derazaNuri.position.set(-12.0, 6.0, 1.0);
    derazaNuri.target.position.set(0, 1.0, 0);
  }

  const kutilganJami = chiroqlar.length + DINAMIK_CHIROQ_ZAXIRASI;
  if (kutilganJami > profil.chiroqBudjeti) {
    throw new Error(
      `${profil.nom} yorug'lik byudjeti buzildi: ` +
        `${kutilganJami} > ${profil.chiroqBudjeti}`,
    );
  }

  let muhitXaritasi = null;
  if (profil.IBL) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    muhitXaritasi = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = muhitXaritasi;
    pmrem.dispose();
  }

  scene.userData.yoruglik = {
    profil: profil.nom,
    chiroqlar,
    muhit,
    asosiy,
    toldiruvchi,
  };

  return {
    chiroqlar,
    muhitXaritasi,
    tozala() {
      for (const chiroq of chiroqlar) {
        scene.remove(chiroq);
        chiroq.dispose?.();
      }
      muhitXaritasi?.dispose();
      scene.environment = null;
      delete scene.userData.yoruglik;
    },
  };
}
