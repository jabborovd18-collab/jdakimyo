import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { XONA } from "./sozlama.js";

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
//
// Joylar xona o'lchamining ULUSHI sifatida beriladi, mutlaq metrda emas:
// xona kattalashganda panellar ham yoyiladi, aks holda ship chekkalari
// qorong'i qolardi. Ulushlar hozirgi qiymatlarni AYNAN qaytaradi
// (W=16 -> +-5.0 va +-1.8; D=12, markazZ=0.4 -> -3.0 va 2.5).
const PANEL_X_ULUSHI = Object.freeze([-0.625, -0.225, 0.225, 0.625]);
const PANEL_Z_ULUSHI = Object.freeze([-0.5666666666666667, 0.35]);

export const SHIP_PANEL_JOYLARI = Object.freeze(
  PANEL_Z_ULUSHI.flatMap((uz) =>
    PANEL_X_ULUSHI.map((ux) => Object.freeze([
      (XONA.eni / 2) * ux,
      XONA.markazZ + (XONA.boyi / 2) * uz,
    ])),
  ),
);

// Desktopda sakkiz panel nuri uchta keng zonaga birlashtiriladi. Panel
// meshlarining o'zi sakkiztaligicha qoladi; faqat fragmentga tushadigan
// qimmat LTC manbalari kamayadi.
const DESKTOP_PANEL_NURLARI = Object.freeze([
  Object.freeze([-(XONA.eni / 2) * 0.425, XONA.markazZ + (XONA.boyi / 2) * PANEL_Z_ULUSHI[0], (XONA.eni / 2) * 0.5625, 0.8]),
  Object.freeze([(XONA.eni / 2) * 0.425, XONA.markazZ + (XONA.boyi / 2) * PANEL_Z_ULUSHI[0], (XONA.eni / 2) * 0.5625, 0.8]),
  Object.freeze([0, XONA.markazZ + (XONA.boyi / 2) * PANEL_Z_ULUSHI[1], XONA.eni / 2, 0.8]),
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

// Asosiy nurning yo'nalishi. Ilgari u `position.set(2.5, 4.0, 2.0)` va
// sukut nishon (0,0,0) bilan berilgan edi; shu ikkisining ayirmasi —
// aynan shu vektor. Normallashtirilgan, ya'ni masofani alohida beramiz.
const ASOSIY_YONALISH = new THREE.Vector3(2.5, 4.0, 2.0).normalize();

// Soya kamerasi xonaning BARCHA burchagini qamrashi shart.
//
// Ilgari bu yerda `left/right/top/bottom = +-2.6`, `far = 15` turardi —
// ya'ni 5.2 x 5.2 m maydon, 16 x 12 m xonaning 14% i. Javon, rakovina,
// deraza va davriy jadval soya zonasidan tashqarida qolgan va shuning
// uchun devorga yopishtirilgan qog'ozdek ko'ringan (BRIF-04).
//
// Qamrov qattiq yozilmaydi — xona o'lchamidan hisoblanadi va pastda
// TEKSHIRILADI. Yarim o'lcham xonaning koordinata boshiga nisbatan eng
// uzoq burchagidan olinadi: shunda nur yo'nalishi o'zgarsa ham qamrov
// buzilmaydi.
//
// NARXI — aniqlik. 1024 xarita 5.2 m ga 197 teksel/m berardi; 22 m ga
// esa 46 teksel/m. Shuning uchun xarita 2048 ga ko'tarildi (92 teksel/m).
// Bu soya sifatining yakuniy yechimi EMAS: kaskadli soya (CSM) 1-qavatning
// 1.2 ishi. Hozirgi maqsad — soyaning umuman BO'LISHI.
const SOYA = Object.freeze({
  xarita: 2048,
  masofa: 20,
  chetlanish: 0.6,
});

/** Xonaning 8 ta burchagi (dunyo koordinatasida). */
function xonaBurchaklari() {
  const yx = XONA.eni / 2;
  const yz = XONA.boyi / 2;
  const burchaklar = [];
  for (const x of [-yx, yx]) {
    for (const y of [0, XONA.balandligi]) {
      for (const z of [-yz + XONA.markazZ, yz + XONA.markazZ]) {
        burchaklar.push(new THREE.Vector3(x, y, z));
      }
    }
  }
  return burchaklar;
}

/**
 * Soya kamerasini xona o'lchamidan qurib, qamrovni TEKSHIRADI.
 *
 * Tekshiruv ataylab `throw` qiladi: soya qamrovi jim yetishmasa, sahna
 * "ishlaydi" va faqat ko'z bilan sezilardi — bu esa loyihada bir marta
 * allaqachon sodir bo'lgan (AGENTS.md 11.1).
 */
function soyaKamerasiniQur(nur) {
  const burchaklar = xonaBurchaklari();
  const engUzoq = Math.max(...burchaklar.map((v) => v.length()));
  const yarim = engUzoq + SOYA.chetlanish;

  nur.shadow.mapSize.width = SOYA.xarita;
  nur.shadow.mapSize.height = SOYA.xarita;
  nur.shadow.camera.left = -yarim;
  nur.shadow.camera.right = yarim;
  nur.shadow.camera.top = yarim;
  nur.shadow.camera.bottom = -yarim;
  nur.shadow.camera.near = Math.max(0.5, SOYA.masofa - yarim);
  nur.shadow.camera.far = SOYA.masofa + yarim;
  nur.shadow.bias = -0.0005;
  nur.shadow.normalBias = 0.02;
  nur.shadow.camera.updateProjectionMatrix();

  // Nishon sukut bo'yicha (0,0,0) va u sahnaga qo'shilmagan, ya'ni
  // matrixWorld birlik matritsa. Tekshiruv aynan shu holatni takrorlaydi.
  const sinov = new THREE.OrthographicCamera(-yarim, yarim, yarim, -yarim,
    nur.shadow.camera.near, nur.shadow.camera.far);
  sinov.position.copy(nur.position);
  sinov.lookAt(0, 0, 0);
  sinov.updateMatrixWorld(true);

  const chetda = [];
  for (const v of burchaklar) {
    const k = v.clone().applyMatrix4(sinov.matrixWorldInverse);
    const chuqurlik = -k.z;
    if (Math.abs(k.x) > yarim || Math.abs(k.y) > yarim
      || chuqurlik < nur.shadow.camera.near || chuqurlik > nur.shadow.camera.far) {
      chetda.push(`(${v.x}, ${v.y}, ${v.z})`);
    }
  }
  if (chetda.length) {
    throw new Error(
      `Soya kamerasi xonani qoplamaydi. Tashqarida qolgan burchaklar: ${chetda.join(" ")}`,
    );
  }
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
  // Nur YO'NALISHI o'zgarmaydi (BRIF-01 hududi). DirectionalLight uchun
  // faqat `position - target` yo'nalishi shading'ga ta'sir qiladi; masofa
  // esa yo'q — u faqat soya kamerasi qayerda turishini belgilaydi.
  // Shuning uchun nurni AYNI yo'nalish bo'ylab uzoqroqqa suramiz:
  // yorug'lik bir zarra ham o'zgarmaydi, soya kamerasi esa butun xonani
  // old tomondan ko'radi.
  asosiy.position.copy(ASOSIY_YONALISH).multiplyScalar(SOYA.masofa);
  asosiy.castShadow = profil.soya;
  if (asosiy.castShadow) {
    soyaKamerasiniQur(asosiy);
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
    panel.position.set(x, XONA.balandligi - 0.05, z);
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
