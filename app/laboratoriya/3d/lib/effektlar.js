import * as THREE from "three";
import { EFFEKT_DAVOMIYLIGI, ZARRA_SONI } from "./sozlama.js";
import { EFFEKT_RANGLARI } from "./rang-jadvali.js";
import { suyuqlikSathiniYangila } from "./jihoz-modellari.js";

// 1. PUFAK EFFEKTI — suyuqlik tubidan gaz pufakchalari ko'tarilishi.
// Nega Points ishlatildi: alohida 60 ta silindr yoki sfera yasalib render qilinsa,
// GPU da 60 ta draw-call ketadi; Points esa bitta BufferGeometry da barchasini kadriga
// 1 ta draw-call bilan chizadi.
export function pufakEffekti(sahna, idish, sozlama = {}) {
  const zarraSoni = sozlama.zarraSoni || ZARRA_SONI.pufak || 60;
  const davomiylik = sozlama.davomiylik || EFFEKT_DAVOMIYLIGI.pufak || 2.5;

  const pozitsiyalar = new Float32Array(zarraSoni * 3);
  const tezliklar = new Float32Array(zarraSoni);

  const ogizY = idish?.userData?.suyuqlikMaxBalandlik || 0.2;
  const tubY = idish?.userData?.suyuqlikTubY || 0.02;

  for (let i = 0; i < zarraSoni; i++) {
    pozitsiyalar[i * 3] = (Math.random() - 0.5) * 0.05;
    pozitsiyalar[i * 3 + 1] = tubY + Math.random() * (ogizY - tubY);
    pozitsiyalar[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    tezliklar[i] = 0.04 + Math.random() * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pozitsiyalar, 3));

  const mat = new THREE.PointsMaterial({
    color: EFFEKT_RANGLARI.pufak,
    size: 0.008,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geo, mat);
  if (idish) {
    idish.add(points);
  } else if (sahna) {
    sahna.add(points);
  }

  return {
    yangila(dt, otganVaqt) {
      const posAttr = geo.getAttribute("position");
      const array = posAttr.array;

      for (let i = 0; i < zarraSoni; i++) {
        array[i * 3 + 1] += tezliklar[i] * dt;
        if (array[i * 3 + 1] > ogizY) {
          array[i * 3 + 1] = tubY;
        }
      }
      posAttr.needsUpdate = true;
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (idish && points.parent === idish) {
        idish.remove(points);
      } else if (sahna && points.parent === sahna) {
        sahna.remove(points);
      }
      geo.dispose();
      mat.dispose();
    },
  };
}

// 2. CHO'KMA EFFEKTI — zarrachalar tepadan tushib, tubda qalinlashadi.
export function chokmaEffekti(sahna, idish, sozlama = {}) {
  const zarraSoni = sozlama.zarraSoni || ZARRA_SONI.chokma || 120;
  const davomiylik = sozlama.davomiylik || EFFEKT_DAVOMIYLIGI.chokma || 4.0;
  const kuch = sozlama.kuch ?? 1.0;
  const rang = sozlama.rang || EFFEKT_RANGLARI.chokmaSukut;

  const pozitsiyalar = new Float32Array(zarraSoni * 3);
  const ogizY = idish?.userData?.suyuqlikMaxBalandlik || 0.2;
  const tubY = idish?.userData?.suyuqlikTubY || 0.02;

  for (let i = 0; i < zarraSoni; i++) {
    pozitsiyalar[i * 3] = (Math.random() - 0.5) * 0.06;
    pozitsiyalar[i * 3 + 1] = ogizY - Math.random() * 0.05;
    pozitsiyalar[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pozitsiyalar, 3));

  const mat = new THREE.PointsMaterial({
    color: rang,
    size: 0.009,
    transparent: true,
    opacity: 0.9,
  });

  const points = new THREE.Points(geo, mat);
  if (idish) idish.add(points);

  return {
    yangila(dt, otganVaqt) {
      const posAttr = geo.getAttribute("position");
      const array = posAttr.array;

      for (let i = 0; i < zarraSoni; i++) {
        if (array[i * 3 + 1] > tubY + 0.01) {
          array[i * 3 + 1] -= 0.05 * dt;
        }
      }
      posAttr.needsUpdate = true;

      // Cho'kma qatlamining qalinligini stexiometric kuch bo'yicha o'stiramiz
      const chokmaMl = Math.min(15, (otganVaqt / davomiylik) * kuch * 15);
      suyuqlikSathiniYangila(idish, idish?.userData?.sigim * 0.5 || 25, null, chokmaMl, rang);
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (idish && points.parent === idish) {
        idish.remove(points);
      }
      geo.dispose();
      mat.dispose();
    },
  };
}

// 3. RANG EFFEKTI — lerp orqali 0.6s ichida suyuqlik rangini silliq o'zgartirish.
// Nega 0.6s lerp: keskin almashtirish sun'iy ko'rinadi va kimyoviy diffuziyani eslatmaydi.
export function rangEffekti(sahna, idish, sozlama = {}) {
  const davomiylik = 0.6;
  const nishonRang = new THREE.Color(sozlama.rang || 0xffffff);

  const suyuqlikMesh = idish?.userData?.suyuqlikMesh;
  const boshlangichRang = suyuqlikMesh?.material?.color?.clone() || new THREE.Color(0xffffff);

  return {
    yangila(dt, otganVaqt) {
      if (!suyuqlikMesh || !suyuqlikMesh.material) return;
      const foiz = Math.min(1, otganVaqt / davomiylik);
      suyuqlikMesh.material.color.lerpColors(boshlangichRang, nishonRang, foiz);
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (suyuqlikMesh && suyuqlikMesh.material) {
        suyuqlikMesh.material.color.copy(nishonRang);
      }
    },
  };
}

// 4. BUG' EFFEKTI — idish og'zidan ko'tarilib tarqaluvchi hovur.
export function bugEffekti(sahna, idish, sozlama = {}) {
  const zarraSoni = ZARRA_SONI.bug || 40;
  const davomiylik = EFFEKT_DAVOMIYLIGI.bug || 2.0;
  const ogizY = idish?.userData?.ogizBalandligi || 0.28;

  const pozitsiyalar = new Float32Array(zarraSoni * 3);
  for (let i = 0; i < zarraSoni; i++) {
    pozitsiyalar[i * 3] = (Math.random() - 0.5) * 0.04;
    pozitsiyalar[i * 3 + 1] = ogizY + Math.random() * 0.05;
    pozitsiyalar[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pozitsiyalar, 3));

  const mat = new THREE.PointsMaterial({
    color: EFFEKT_RANGLARI.bug,
    size: 0.015,
    transparent: true,
    opacity: 0.5,
  });

  const points = new THREE.Points(geo, mat);
  if (idish) idish.add(points);

  return {
    yangila(dt, otganVaqt) {
      const posAttr = geo.getAttribute("position");
      const array = posAttr.array;

      for (let i = 0; i < zarraSoni; i++) {
        array[i * 3 + 1] += 0.06 * dt;
        array[i * 3] += (Math.random() - 0.5) * 0.002;
      }
      posAttr.needsUpdate = true;
      mat.opacity = Math.max(0, 0.5 * (1 - otganVaqt / davomiylik));
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (idish && points.parent === idish) {
        idish.remove(points);
      }
      geo.dispose();
      mat.dispose();
    },
  };
}

// 5. ALANGA EFFEKTI — spirtovka alangasi, Math.sin bilan tebranadi.
export function alangaEffekti(sahna, idish, sozlama = {}) {
  const alangaMesh = idish?.userData?.alanga;
  const davomiylik = 3.0;

  if (alangaMesh) {
    alangaMesh.visible = true;
  }

  return {
    yangila(dt, otganVaqt) {
      if (!alangaMesh) return;
      const tebranish = Math.sin(otganVaqt * 12) * 0.1;
      alangaMesh.scale.set(1 + tebranish, 1 - tebranish * 0.5, 1 + tebranish);
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (alangaMesh) {
        alangaMesh.visible = false;
        alangaMesh.scale.set(1, 1, 1);
      }
    },
  };
}

// 6. QIZISH EFFEKTI — qizil-to'q sariq PointLight vaqtincha yonishi.
export function qizishEffekti(sahna, idish, sozlama = {}) {
  const davomiylik = 2.5;
  const light = new THREE.PointLight(EFFEKT_RANGLARI.qizish, 1.5, 1.8);
  if (idish) {
    light.position.set(0, 0.1, 0);
    idish.add(light);
  }

  return {
    yangila(dt, otganVaqt) {
      const foiz = Math.max(0, 1 - otganVaqt / davomiylik);
      light.intensity = 1.5 * foiz;
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (idish && light.parent === idish) {
        idish.remove(light);
      }
      light.dispose();
    },
  };
}

// 7. LOYQA EFFEKTI — suyuqlik materialining shaffofligi va silliqligi o'zgarishi.
export function loyqaEffekti(sahna, idish, sozlama = {}) {
  const davomiylik = 1.5;
  const suyuqlikMesh = idish?.userData?.suyuqlikMesh;

  return {
    yangila(dt, otganVaqt) {
      if (!suyuqlikMesh || !suyuqlikMesh.material) return;
      suyuqlikMesh.material.roughness = Math.min(0.7, 0.1 + (otganVaqt / davomiylik) * 0.6);
      suyuqlikMesh.material.opacity = Math.max(0.35, 0.7 - (otganVaqt / davomiylik) * 0.35);
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {},
  };
}

// 8. HID EFFEKTI — og'izdan kengayuvchi shaffof halqalar.
export function hidEffekti(sahna, idish, sozlama = {}) {
  const davomiylik = 2.5;
  const ogizY = idish?.userData?.ogizBalandligi || 0.28;

  const geo = new THREE.TorusGeometry(0.04, 0.004, 12, 32);
  const mat = new THREE.MeshBasicMaterial({ color: EFFEKT_RANGLARI.hid, transparent: true, opacity: 0.7 });
  const halqa = new THREE.Mesh(geo, mat);
  halqa.rotation.x = Math.PI / 2;
  halqa.position.y = ogizY;

  if (idish) idish.add(halqa);

  return {
    yangila(dt, otganVaqt) {
      const s = 1 + otganVaqt * 1.5;
      halqa.scale.set(s, s, s);
      halqa.position.y = ogizY + otganVaqt * 0.08;
      mat.opacity = Math.max(0, 0.7 * (1 - otganVaqt / davomiylik));
    },
    tugadimi(otganVaqt) {
      return otganVaqt >= davomiylik;
    },
    tozala() {
      if (idish && halqa.parent === idish) {
        idish.remove(halqa);
      }
      geo.dispose();
      mat.dispose();
    },
  };
}

// 9. ARALASHISH EFFEKTI (ZAXIRA) — yengil zarrachalar aylanishi.
export function aralashishEffekti(sahna, idish, sozlama = {}) {
  const davomiylik = 1.5;
  return pufakEffekti(sahna, idish, { ...sozlama, zarraSoni: 30, davomiylik });
}

// Effekt turiga qarab mos funksiyani tanlash
function effektYasa(turi, sahna, idish, sozlama) {
  switch (turi) {
    case "chokma":
      return chokmaEffekti(sahna, idish, sozlama);
    case "pufak":
      return pufakEffekti(sahna, idish, sozlama);
    case "rang":
    case "tiniq":
    case "indikator":
    case "holat":
      return rangEffekti(sahna, idish, sozlama);
    case "bug":
      return bugEffekti(sahna, idish, sozlama);
    case "alanga":
      return alangaEffekti(sahna, idish, sozlama);
    case "qizish":
      return qizishEffekti(sahna, idish, sozlama);
    case "loyqa":
      return loyqaEffekti(sahna, idish, sozlama);
    case "hid":
      return hidEffekti(sahna, idish, sozlama);
    default:
      return aralashishEffekti(sahna, idish, sozlama);
  }
}

// Barcha tahlil qilingan effektlarni kechikishlarni hisobga olib ishga tushirish
// va yagona boshqaruvchi (controller) obyekt qaytarish.
// Nega yagona boshqaruvchi: render siklida har bir effektni alohida kuzatish o'rniga,
// bitta yangila(dt) chaqiruvida barcha effektlarning vaqti sinxron boshqariladi.
export function effektlarniIshgaTushir(sahna, idish, tavsiflar = []) {
  const reja = tavsiflar.map((tavsif) => ({
    ...tavsif,
    kechikish: tavsif.kechikish || 0,
    boshlandimi: false,
    ekzemplyar: null,
  }));

  let umumiyVaqt = 0;

  return {
    yangila(dt) {
      umumiyVaqt += dt;
      reja.forEach((qadam) => {
        if (!qadam.boshlandimi && umumiyVaqt >= qadam.kechikish) {
          qadam.boshlandimi = true;
          qadam.ekzemplyar = effektYasa(qadam.turi, sahna, idish, qadam);
        }
        if (qadam.boshlandimi && qadam.ekzemplyar) {
          const otgan = umumiyVaqt - qadam.kechikish;
          qadam.ekzemplyar.yangila(dt, otgan);
        }
      });
    },
    tugadimi() {
      return reja.every((qadam) => {
        if (!qadam.boshlandimi) return false;
        if (!qadam.ekzemplyar) return true;
        return qadam.ekzemplyar.tugadimi(umumiyVaqt - qadam.kechikish);
      });
    },
    tozala() {
      reja.forEach((qadam) => {
        if (qadam.ekzemplyar && typeof qadam.ekzemplyar.tozala === "function") {
          qadam.ekzemplyar.tozala();
        }
      });
    },
  };
}