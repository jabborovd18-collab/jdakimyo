"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { QUYISH } from "../lib/sozlama.js";
import { quy, jamiHajm } from "../lib/idish-holati.js";
import { aralashmaRangi } from "../lib/rang-aralashtirish.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { yoz } from "../lib/jurnal.js";

// Reagent quyilganda shishaning oqim chizig'i (ingichka silindr) va
// uning uchida sachraydigan tomchilar (Points) yaratuvchi yordamchi funksiya.
// Nega oqim va tomchilar yasaladi: foydalanuvchi qachon modda idishga tushayotganini
// vizual his qilishi va miqdorni aniq kuzatishi uchun.
function oqimVaTomchilarYasa(rang = 0xffffff, balandlik = 0.22) {
  const group = new THREE.Group();

  // Oqim silindri
  const silindrGeo = new THREE.CylinderGeometry(0.005, 0.004, balandlik, 12);
  const silindrMat = new THREE.MeshBasicMaterial({ color: rang, transparent: true, opacity: 0.85 });
  const oqimMesh = new THREE.Mesh(silindrGeo, silindrMat);
  oqimMesh.position.y = balandlik / 2;
  group.add(oqimMesh);

  // Tomchilar (Points)
  const zarrachaSoni = 18;
  const pozitsiyalar = new Float32Array(zarrachaSoni * 3);
  for (let i = 0; i < zarrachaSoni; i++) {
    pozitsiyalar[i * 3] = (Math.random() - 0.5) * 0.02;
    pozitsiyalar[i * 3 + 1] = Math.random() * 0.04;
    pozitsiyalar[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(pozitsiyalar, 3));
  const pointsMat = new THREE.PointsMaterial({ color: rang, size: 0.007, transparent: true, opacity: 0.8 });
  const tomchilar = new THREE.Points(pointsGeo, pointsMat);
  tomchilar.position.y = 0.01;
  group.add(tomchilar);

  return { group, oqimMesh, tomchilar };
}

// Vaqtincha vizual reagent shishasini yaratib egish.
function reagentShishasiYasa(kalit, rang) {
  const group = new THREE.Group();
  const shishaMat = new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const suyuqlikMat = new THREE.MeshStandardMaterial({ color: rang, roughness: 0.3 });

  const silindrGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 24);
  const tana = new THREE.Mesh(silindrGeo, shishaMat);
  tana.position.y = 0.08;
  group.add(tana);

  const boyinGeo = new THREE.CylinderGeometry(0.018, 0.03, 0.05, 16);
  const boyin = new THREE.Mesh(boyinGeo, shishaMat);
  boyin.position.y = 0.185;
  group.add(boyin);

  const ichkiGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.12, 24);
  const ichki = new THREE.Mesh(ichkiGeo, suyuqlikMat);
  ichki.position.y = 0.07;
  group.add(ichki);

  return group;
}

// Uzluksiz oqim quyishni (bosib ushlab turib quyish) boshqaruvchi hook.
// Nega diskret (+5 ml) tugma taqiqlandi: talaba miqdor reaksiyaga va cho'kmaga qanday
// ta'sir qilishini oqim tezligi bilan o'z qo'li orqali sezishi shart.
export function useQuyish({ sahnaRef, holatRef, jurnalRef, onOzgarish }) {
  const [quyilmoqda, setQuyilmoqda] = useState(false);
  const [hajm, setHajm] = useState(0);

  const kadrIdRef = useRef(null);
  const vaqtRef = useRef(Date.now());
  const faolReagentRef = useRef(null);
  const nishonIdishRef = useRef(null);
  const vizualGuruhRef = useRef(null);
  const boshlangichHajmRef = useRef(0);

  // Quyishni boshlash
  const quyishBoshla = useCallback((reagentKaliti, idishGroup) => {
    if (!reagentKaliti || !idishGroup || !sahnaRef?.current) return;

    faolReagentRef.current = reagentKaliti;
    nishonIdishRef.current = idishGroup;
    boshlangichHajmRef.current = jamiHajm(holatRef?.current);
    vaqtRef.current = Date.now();

    const korinish = moddaKorinishi(reagentKaliti);
    const shishaGroup = reagentShishasiYasa(reagentKaliti, korinish.rang);

    // Idish ustiga joylashtirib rotation.z bilan egish (~50° = ~0.87 rad)
    const ogizY = idishGroup.userData?.ogizBalandligi || 0.28;
    const idishPos = idishGroup.position;
    shishaGroup.position.set(idishPos.x + 0.12, idishPos.y + ogizY + 0.12, idishPos.z);
    shishaGroup.rotation.z = Math.PI / 3.5; // ~51 gradus egiladi
    sahnaRef.current.add(shishaGroup);

    const oqimBalandlik = 0.14;
    const { group: oqimGroup } = oqimVaTomchilarYasa(korinish.rang, oqimBalandlik);
    oqimGroup.position.set(idishPos.x, idishPos.y + ogizY, idishPos.z);
    sahnaRef.current.add(oqimGroup);

    vizualGuruhRef.current = {
      shisha: shishaGroup,
      oqim: oqimGroup,
    };

    setQuyilmoqda(true);
  }, [sahnaRef, holatRef]);

  // Quyishni to'xtatish: vaqtincha animatsiya shishasini o'chiradi va jurnalga yozadi
  const quyishToxtat = useCallback(() => {
    if (!quyilmoqda) return;

    if (kadrIdRef.current) {
      cancelAnimationFrame(kadrIdRef.current);
      kadrIdRef.current = null;
    }

    if (sahnaRef?.current && vizualGuruhRef.current) {
      const { shisha, oqim } = vizualGuruhRef.current;
      if (shisha) {
        sahnaRef.current.remove(shisha);
        shisha.traverse((child) => {
          if (child.isMesh && child.geometry) child.geometry.dispose();
        });
      }
      if (oqim) {
        sahnaRef.current.remove(oqim);
        oqim.traverse((child) => {
          if (child.isMesh && child.geometry) child.geometry.dispose();
        });
      }
      vizualGuruhRef.current = null;
    }

    const hozirgiJami = jamiHajm(holatRef?.current);
    const qoshilganMl = Number((hozirgiJami - boshlangichHajmRef.current).toFixed(1));

    if (qoshilganMl > 0.05 && jurnalRef?.current && faolReagentRef.current) {
      yoz(jurnalRef.current, {
        amal: "quyish",
        reagent: faolReagentRef.current,
        ml: qoshilganMl,
      });
    }

    setQuyilmoqda(false);
    faolReagentRef.current = null;
    nishonIdishRef.current = null;
  }, [quyilmoqda, sahnaRef, holatRef, jurnalRef]);

  useEffect(() => {
    if (!quyilmoqda) return;

    const quyishSikli = () => {
      kadrIdRef.current = requestAnimationFrame(quyishSikli);

      const hozir = Date.now();
      const dt = (hozir - vaqtRef.current) / 1000;
      vaqtRef.current = hozir;

      const reagent = faolReagentRef.current;
      const idishGroup = nishonIdishRef.current;
      if (!reagent || !idishGroup || !holatRef?.current) return;

      // Byuretka bo'lsa jo'mrak burchagiga ko'paytiriladi, aks holda standart 1.0
      const jomrakBurchagi = idishGroup.userData?.jomrakBurchagi;
      const koef = jomrakBurchagi !== undefined && jomrakBurchagi > 0
        ? jomrakBurchagi / (Math.PI / 2)
        : 1.0;

      const qoshiladigan = QUYISH.oqim * koef * dt;

      // 150 ml dan oshsa ham taqiqlamaymiz: idish to'lib toshishi ham talaba uchun natija
      const yangiHolat = quy(holatRef.current, reagent, qoshiladigan);
      holatRef.current = yangiHolat;

      const yangiHajm = jamiHajm(yangiHolat);
      setHajm(yangiHajm);

      const rangObj = aralashmaRangi(yangiHolat);
      suyuqlikSathiniYangila(idishGroup, yangiHajm, rangObj);

      if (typeof onOzgarish === "function") {
        onOzgarish(yangiHolat);
      }
    };

    kadrIdRef.current = requestAnimationFrame(quyishSikli);

    return () => {
      if (kadrIdRef.current) {
        cancelAnimationFrame(kadrIdRef.current);
      }
    };
  }, [quyilmoqda, holatRef, onOzgarish]);

  // Global mouseup / touchend bo'lganda quyish to'xtaydi
  useEffect(() => {
    const handleUp = () => {
      if (quyilmoqda) {
        quyishToxtat();
      }
    };

    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [quyilmoqda, quyishToxtat]);

  return {
    quyishBoshla,
    quyishToxtat,
    quyilmoqda,
    hajm,
  };
}