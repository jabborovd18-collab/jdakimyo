"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { QUYISH } from "../lib/sozlama.js";
import { quy, jamiHajm } from "../lib/idish-holati.js";
import { aralashmaRangi } from "../lib/rang-aralashtirish.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { yoz } from "../lib/jurnal.js";
import { oqimBoshla, oqimToxtat, tiqinOchilishi } from "../lib/ovoz.js";

// Oqim silindri va tomchilar (Points) yaratish
function oqimVaTomchilarYasa(rang = 0xffffff, balandlik = 0.24, qalinlik = 0.006) {
  const group = new THREE.Group();

  const silindrGeo = new THREE.CylinderGeometry(qalinlik * 0.8, qalinlik * 0.5, balandlik, 12);
  const silindrMat = new THREE.MeshBasicMaterial({ color: rang, transparent: true, opacity: 0.88 });
  const oqimMesh = new THREE.Mesh(silindrGeo, silindrMat);
  oqimMesh.position.y = balandlik / 2;
  group.add(oqimMesh);

  const zarrachaSoni = 24;
  const pozitsiyalar = new Float32Array(zarrachaSoni * 3);
  for (let i = 0; i < zarrachaSoni; i++) {
    pozitsiyalar[i * 3] = (Math.random() - 0.5) * 0.03;
    pozitsiyalar[i * 3 + 1] = Math.random() * 0.05;
    pozitsiyalar[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(pozitsiyalar, 3));
  const pointsMat = new THREE.PointsMaterial({ color: rang, size: 0.008, transparent: true, opacity: 0.85 });
  const tomchilar = new THREE.Points(pointsGeo, pointsMat);
  tomchilar.position.y = 0.01;
  group.add(tomchilar);

  return { group, oqimMesh, tomchilar };
}

// Reagent shishasi
function reagentShishasiYasa(kalit, rang) {
  const group = new THREE.Group();
  const shishaMat = new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const suyuqlikMat = new THREE.MeshStandardMaterial({ color: rang, roughness: 0.25 });

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

/**
 * 1-BOSQICH: Erkin egish va o'zgaruvchan tezlikdagi uzluksiz quyish hooki.
 *
 * Imkoniyatlari:
 *  - Burchakka to'g'ri proporsional quyish tezligi (Kam egilsa: tomchi, Ko'p egilsa: shiddatli oqim).
 *  - Idishdan idishga yoki reagent shishasidan idishga aniq quyish.
 *  - Haqiqiy vaqt rejimida stexiometriya va rang aralashishi.
 */
export function useQuyish({ sahnaRef, holatRef, jurnalRef, onOzgarish }) {
  const [quyilmoqda, setQuyilmoqda] = useState(false);
  const [egishBurchagi, setEgishBurchagi] = useState(0); // 0 dan 80 gradusgacha
  const [hajm, setHajm] = useState(0);
  const [quyishTezligiMl, setQuyishTezligiMl] = useState(0); // ml/s ko'rsatkichi

  const kadrIdRef = useRef(null);
  const vaqtRef = useRef(Date.now());
  const faolReagentRef = useRef(null);
  const manbaIdishRef = useRef(null);
  const nishonIdishRef = useRef(null);
  const vizualGuruhRef = useRef(null);
  const boshlangichHajmRef = useRef(0);
  const burchakRef = useRef(0);

  // Burchakni yangilash (0° - 80°)
  const burchakniOrnat = useCallback((gradus) => {
    const clamped = Math.max(0, Math.min(85, Number(gradus) || 0));
    setEgishBurchagi(clamped);
    burchakRef.current = clamped;

    if (vizualGuruhRef.current?.shisha) {
      vizualGuruhRef.current.shisha.rotation.z = (clamped * Math.PI) / 180;
    }
  }, []);

  // Quyishni boshlash (Reagent yoki Idish orqali)
  const quyishBoshla = useCallback((reagentKaliti, targetGroup, sourceGroup = null, boshlangichBurchak = 45) => {
    if (!targetGroup || !sahnaRef?.current) return;

    faolReagentRef.current = reagentKaliti || sourceGroup?.userData?.kalit;
    manbaIdishRef.current = sourceGroup;
    nishonIdishRef.current = targetGroup;
    boshlangichHajmRef.current = jamiHajm(holatRef?.current);
    vaqtRef.current = Date.now();
    burchakRef.current = boshlangichBurchak;
    setEgishBurchagi(boshlangichBurchak);

    const korinish = moddaKorinishi(faolReagentRef.current || 'suv');
    const ogizY = targetGroup.userData?.ogizBalandligi || 0.28;
    const targetPos = targetGroup.position;

    let shishaGroup = null;
    if (sourceGroup) {
      shishaGroup = sourceGroup;
      shishaGroup.position.set(targetPos.x + 0.14, targetPos.y + ogizY + 0.12, targetPos.z);
      shishaGroup.rotation.z = (boshlangichBurchak * Math.PI) / 180;
    } else {
      shishaGroup = reagentShishasiYasa(faolReagentRef.current, korinish.rang);
      shishaGroup.position.set(targetPos.x + 0.14, targetPos.y + ogizY + 0.12, targetPos.z);
      shishaGroup.rotation.z = (boshlangichBurchak * Math.PI) / 180;
      sahnaRef.current.add(shishaGroup);
    }

    const oqimBalandlik = 0.15;
    const { group: oqimGroup } = oqimVaTomchilarYasa(korinish.rang, oqimBalandlik, 0.006);
    oqimGroup.position.set(targetPos.x, targetPos.y + ogizY, targetPos.z);
    sahnaRef.current.add(oqimGroup);

    vizualGuruhRef.current = {
      shisha: shishaGroup,
      oqim: oqimGroup,
      isExternalBottle: !sourceGroup,
    };

    tiqinOchilishi(); // Tiqin ochilish ovozi
    oqimBoshla();
    setQuyilmoqda(true);
  }, [sahnaRef, holatRef]);

  // Quyishni to'xtatish
  const quyishToxtat = useCallback(() => {
    oqimToxtat();
    if (!quyilmoqda) return;

    if (kadrIdRef.current) {
      cancelAnimationFrame(kadrIdRef.current);
      kadrIdRef.current = null;
    }

    if (sahnaRef?.current && vizualGuruhRef.current) {
      const { shisha, oqim, isExternalBottle } = vizualGuruhRef.current;
      if (shisha) {
        if (isExternalBottle) {
          sahnaRef.current.remove(shisha);
          shisha.traverse((child) => {
            if (child.isMesh && child.geometry) child.geometry.dispose();
          });
        } else {
          shisha.rotation.z = 0;
        }
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
    setQuyishTezligiMl(0);
    faolReagentRef.current = null;
    manbaIdishRef.current = null;
    nishonIdishRef.current = null;
  }, [quyilmoqda, sahnaRef, holatRef, jurnalRef]);

  // Quyish fizikasi animatsiyasi sikli
  useEffect(() => {
    if (!quyilmoqda) return;

    const quyishSikli = () => {
      kadrIdRef.current = requestAnimationFrame(quyishSikli);

      const hozir = Date.now();
      const dt = Math.min(0.1, (hozir - vaqtRef.current) / 1000);
      vaqtRef.current = hozir;

      const reagent = faolReagentRef.current;
      const idishGroup = nishonIdishRef.current;
      if (!reagent || !idishGroup || !holatRef?.current) return;

      const burchak = burchakRef.current;
      
      // Agar burchak < 18° bo'lsa oqim bo'lmaydi
      if (burchak < 18) {
        setQuyishTezligiMl(0);
        if (vizualGuruhRef.current?.oqim) {
          vizualGuruhRef.current.oqim.visible = false;
        }
        return;
      }

      if (vizualGuruhRef.current?.oqim) {
        vizualGuruhRef.current.oqim.visible = true;
      }

      // O'zgaruvchan tezlik: 20° da ~1.5 ml/s, 50° da ~15 ml/s, 80° da ~45 ml/s
      const tezlikKoef = Math.pow((burchak - 18) / 62, 1.6);
      const tezlikMlSec = Math.max(0.5, tezlikKoef * 35.0);
      setQuyishTezligiMl(Number(tezlikMlSec.toFixed(1)));

      const qoshiladigan = tezlikMlSec * dt;

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
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [quyilmoqda, holatRef, onOzgarish]);

  return {
    quyishBoshla,
    quyishToxtat,
    burchakniOrnat,
    egishBurchagi,
    quyilmoqda,
    hajm,
    quyishTezligiMl,
  };
}
