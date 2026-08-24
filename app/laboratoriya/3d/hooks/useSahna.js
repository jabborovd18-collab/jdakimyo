"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import { SLOTLAR } from "../lib/sozlama.js";
import { materiallarniTozala } from "../lib/materiallar.js";
import { jihozYasa } from "../lib/jihoz-modellari.js";
import { modelOl, assetlarniQollash, assetlarniTozala } from "../lib/asset-yuklovchi.js";
import { profilniAniqla, profilniOl } from "../lib/sifat-profili.js";
import { quvurniQur } from "../lib/sahna-quvuri.js";
import { mazmunniQur } from "../lib/sahna-mazmuni.js";
import { siklniBoshla } from "../lib/sahna-sikli.js";
import {
  YORLIQLAR_SAQLASH_KALITI,
  yorliqlarniYangila,
} from "../lib/yorliqlar.js";

// 3D sahnani (Scene, Camera, Renderer, Controls) boshqaruvchi asosiy React Hook.
// Nega useSahna hook ichida yozildi: barcha imperativ Three.js kodlari bitta joyda yig'iladi
// va React render siklidan ajralgan holatda 60 FPS ishlashni ta'minlaydi.
export function useSahna(konteynerRef, yuklanmoqda = false, sozlama = {}) {
  // O'lchagich profilni aniq beradi; jonli sahifa esa qurilmadan aniqlaydi.
  // Ref ishlatilishining sababi: sozlama obyektini effect bog'liqligiga
  // qo'shish sahnani har React renderida qayta qurib yuborardi.
  const olchamRef = useRef(!!sozlama.olcham);
  // BRIF-03 2-mezon — o'lchagich sahifasida DRS ni ataylab yoqish.
  // Faqat `?drs=1` bilan; oddiy o'lchov yo'lida har doim `false`.
  const drsMajburiyRef = useRef(!!sozlama.drsMajburiy);
  const aniqProfilRef = useRef(sozlama.profil || null);
  const aniqYorliqRef = useRef(
    typeof sozlama.yorliqlarYoqilgan === "boolean"
      ? sozlama.yorliqlarYoqilgan
      : null,
  );
  olchamRef.current = !!sozlama.olcham;
  drsMajburiyRef.current = !!sozlama.drsMajburiy;
  aniqProfilRef.current = sozlama.profil || null;
  aniqYorliqRef.current = typeof sozlama.yorliqlarYoqilgan === "boolean"
    ? sozlama.yorliqlarYoqilgan
    : null;
  const [tayyor, setTayyor] = useState(false);
  const [hammaJihozlar, setHammaJihozlar] = useState([]);
  const [kuchsizQurilma, setKuchsizQurilma] = useState(false);
  const [yorliqlarYoqilgan, setYorliqlarYoqilgan] = useState(true);

  const sahnaRef = useRef(null);
  const kameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const materiallarRef = useRef(null);
  const profilRef = useRef(null);
  const yorliqlarYoqilganRef = useRef(true);
  const yorliqHolatiRef = useRef({ yorliqSoni: 0, yorliqToqnashuvi: 0 });
  const composerRef = useRef(null);
  const jihozlarMapRef = useRef(new Map()); // slotIndex -> THREE.Group
  // BRIF-07 birlashuv hisoboti — o'lchagich uni o'qiydi.
  const birlashuvRef = useRef({ birlashdi: 0, guruh: 0, otkazildi: 0, bolali: 0 });

  useEffect(() => {
    let yoqilgan = true;
    if (aniqYorliqRef.current !== null) {
      yoqilgan = aniqYorliqRef.current;
    } else {
      try {
        const saqlangan = localStorage.getItem(YORLIQLAR_SAQLASH_KALITI);
        yoqilgan = saqlangan === null ? true : saqlangan !== "0";
      } catch {
        yoqilgan = true;
      }
    }
    yorliqlarYoqilganRef.current = yoqilgan;
    setYorliqlarYoqilgan(yoqilgan);
  }, []);

  const yorliqlarniAlmashtir = useCallback((aniqQiymat) => {
    const yoqilgan = typeof aniqQiymat === "boolean"
      ? aniqQiymat
      : !yorliqlarYoqilganRef.current;
    yorliqlarYoqilganRef.current = yoqilgan;
    setYorliqlarYoqilgan(yoqilgan);
    if (!olchamRef.current) {
      try {
        localStorage.setItem(YORLIQLAR_SAQLASH_KALITI, yoqilgan ? "1" : "0");
      } catch {}
    }
    if (sahnaRef.current && kameraRef.current && rendererRef.current) {
      yorliqHolatiRef.current = yorliqlarniYangila(
        sahnaRef.current,
        kameraRef.current,
        rendererRef.current,
        yoqilgan,
      );
    }
  }, []);

  // Jihozni stoldagi bo'sh slotga qo'shish.
  // Nega bo'sh slot tanlanadi: jihozlar bir-birining ustiga chiqib qolmasligi uchun
  // SLOTLAR panjarasidagi eng birinchi bo'sh joy topiladi.
  const jihozQosh = useCallback((kalit) => {
    if (!sahnaRef.current || !materiallarRef.current || !profilRef.current) return null;

    let boshSlot = -1;
    for (let i = 0; i < SLOTLAR.length; i++) {
      if (!jihozlarMapRef.current.has(i)) {
        boshSlot = i;
        break;
      }
    }

    if (boshSlot === -1) {
      return null; // Stolda 6 ta joy to'ldi
    }

    const group = jihozYasa(kalit, materiallarRef.current, profilRef.current);
    group.userData.slotIndex = boshSlot;

    const [x, y, z] = SLOTLAR[boshSlot];
    group.position.set(x, y, z);
    sahnaRef.current.add(group);
    jihozlarMapRef.current.set(boshSlot, group);

    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));
    return group;
  }, []);

  // Jihozni stoldan va sahnadan olib tashlash.
  const jihozOlib = useCallback((slotIndexYokiKalit) => {
    if (!sahnaRef.current) return;

    let targetSlot = -1;
    if (typeof slotIndexYokiKalit === "number") {
      targetSlot = slotIndexYokiKalit;
    } else {
      for (const [index, group] of jihozlarMapRef.current.entries()) {
        if (group.userData?.kalit === slotIndexYokiKalit) {
          targetSlot = index;
          break;
        }
      }
    }

    const group = jihozlarMapRef.current.get(targetSlot);
    if (!group) return;

    sahnaRef.current.remove(group);
    group.traverse((child) => {
      // Yorliq — Sprite, Mesh EMAS. Shuning uchun u quyidagi `isMesh`
      // shartiga tushmasdi va uning kanvas teksturasi HECH QACHON
      // bo'shatilmasdi. BRIF-02 ning 20 martalik sinovi buni topdi:
      // har qo'yib-olishda tekstura soni bittaga o'sardi.
      if (child.isSprite) {
        child.material?.map?.dispose();
        child.material?.dispose();
        return;
      }
      if (child.isMesh) {
        // BRIF-02 — asset geometriyasi va materiali KESHDAN keladi va
        // barcha nusxalar orasida ulashiladi. Uni shu yerda bo'shatsak,
        // bitta stakanni olib tashlash qolgan hammasini ko'rinmas
        // qilardi. Kesh `assetlarniTozala` bilan bir marta bo'shaydi.
        if (child.userData?.assetdan) return;
        if (child.geometry) child.geometry.dispose();
        // Ilgari faqat geometriya bo'shatilar, material va tekstura GPU da
        // qolib, ko'p marta idish olib-tashlansa xotira sizib borardi (leak).
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => { if (m?.map) m.map.dispose(); m?.dispose(); });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      }
    });

    jihozlarMapRef.current.delete(targetSlot);
    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));
  }, []);

  useEffect(() => {
    if (yuklanmoqda) return;
    if (!konteynerRef || !konteynerRef.current) return;

    // Asinxron ish (asset yuklash) sahna tozalangandan keyin qaytishi
    // mumkin. Bu bayroq shuni ushlaydi: tozalangan sahnaga tegish
    // React'da jim xato beradi va uni topish qiyin.
    let sahnaTirik = true;

    // O'lchagich aniq profilni majburlaydi; jonli sahifa qurilmani o'zi
    // aniqlaydi. Profil obyektining o'zi barcha quruvchilarga uzatiladi.
    const profil = aniqProfilRef.current
      ? profilniOl(aniqProfilRef.current)
      : profilniAniqla();
    profilRef.current = profil;
    setKuchsizQurilma(profil.nom === "telefon");

    // BRIF-05 — effekt endi UCH modulni chaqiradi va natijani ref larga
    // ulaydi. Tartib majburiy: quvur (chizish vositalari) -> mazmun
    // (sahnadagi narsalar, oxirida birlashtirish) -> sikl (har kadr).
    const konteyner = konteynerRef.current;
    const quvur = quvurniQur(konteyner, profil, { olcham: olchamRef.current });
    const { scene, kamera, renderer, composer, controls, materiallar, yoruglik, manzara } = quvur;
    sahnaRef.current = scene;
    kameraRef.current = kamera;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    materiallarRef.current = materiallar;
    composerRef.current = composer;

    const mazmun = mazmunniQur(scene, materiallar, profil);
    jihozlarMapRef.current = mazmun.jihozlar;
    birlashuvRef.current = mazmun.birlashuv;
    setHammaJihozlar(Array.from(mazmun.jihozlar.values()));

    // BRIF-02 — asset quvuri. Sahna allaqachon qurilgan va ishlayapti;
    // model kelganda jihozlar JOYIDA yaxshilanadi.
    //
    // Nega qurilishni kutmaymiz: `useSahna` effekti sinxron va uni
    // `await` bilan bo'lish butun sahna qurilishini qayta yozishni
    // talab qilardi. Bu yo'l esa qo'shimcha foyda beradi — sahna
    // birinchi kadrdayoq ko'rinadi, model esa kelganda qo'shiladi
    // (va umuman kelmasa ham hech narsa buzilmaydi).
    modelOl("stakan", renderer).then((model) => {
      if (!sahnaTirik || !model) return;
      assetlarniQollash(scene);
    });

    const sikl = siklniBoshla({
      konteyner,
      scene,
      kamera,
      renderer,
      composer,
      controls,
      profil,
      olcham: olchamRef.current,
      drsMajburiy: drsMajburiyRef.current,
      yorliqlarYoqilganRef,
      yorliqHolatiRef,
    });

    setTayyor(true);

    // 11. Xotira tozalanadi (cleanup)
    return () => {
      sahnaTirik = false;
      sikl.toxtat();

      // Sahnadagi barcha geometriya, material va teksturalarni tozalash
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      mazmun.stolGeo.dispose();
      mazmun.oyoqGeo.dispose();
      manzara.dispose();
      scene.background = null;
      assetlarniTozala();
      yoruglik.tozala();
      materiallarniTozala(materiallar);

      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (konteynerRef.current) {
        konteynerRef.current.innerHTML = "";
      }
      jihozlarMapRef.current.clear();
      profilRef.current = null;
      yorliqHolatiRef.current = { yorliqSoni: 0, yorliqToqnashuvi: 0 };
    };
  }, [konteynerRef, yuklanmoqda]);

  // kameraRef va rendererRef ham qaytariladi: useSudrash Raycaster uchun kamerani,
  // hodisalarni ulash uchun esa renderer.domElement ni talab qiladi. Ular
  // qaytarilmaganda hook jim ishlamay qolardi — hodisa ulanmagani uchun bosish
  // ham, yoritish ham umuman ishga tushmasdi va xato xabari chiqmasdi.
  return {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    profilRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
    yorliqlarYoqilgan,
    yorliqlarniAlmashtir,
    yorliqHolatiRef,
    birlashuvRef,
    composerRef,
  };
}
