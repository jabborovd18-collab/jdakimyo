"use client";

import { useCallback } from "react";
import * as THREE from "three";

import { shishaUrilishi, taroziBip, tiqinOchilishi } from "../lib/ovoz.js";

// NISHON AMALI — qaralgan narsa ustida bajariladigan yagona harakat.
//
// `useYurish.js` dan ajratildi (BRIF-05). Ichida 15 ta holat bor:
// stenddan jihoz olish, javonga qaytarish, tarozi, spirtovka,
// rakovina, planshet, titrlash, elektroliz, xavfsizlik dushi va
// hokazo.
//
// NEGA ALOHIDA FAYL: bu yagona joyda 3D dunyo LABORATORIYA
// QOIDALARINI biladi. Yurish fizikasi, klaviatura va qarash esa
// mazmundan mustaqil — ular bir tanada turganda har yangi stansiya
// yurish kodini ham ochishni talab qilardi.
//
// BOG'LIQLIK RO'YXATI ATAYLAB UZUN. Uni `amallarRef` bilan
// barqarorlashtirib bo'lardi, lekin u holda effektlarning qayta ishga
// tushish payti o'zgarardi — BRIF-05 esa xatti-harakatni o'zgartirishni
// taqiqlaydi. G'oya YOL-XARITASI ga yozildi.

export function useNishonAmali({
  kameraRef,
  sahnaRef,
  fpsQolIdish,
  fpsQaralganIdish,
  fpsQaralganStansiya,
  setFpsQolIdish,
  onIdishTanlandi,
  onQuyishBoshla,
  onTaroziTushdi,
  onTarozidanOlingan,
  onTaroziTara,
  onTaroziNol,
  onSpirtovkaBosildi,
  onSpirtovkagaQoyildi,
  onRakovinaKraniBosildi,
  onRakovinagaTushdi,
  onPlanshetBosildi,
  onStansiyaOchildi,
  onStenddanJihozOlish,
  onJavongaQaytar,
  onAralashtirish,
  onSpatulaAmal,
  onTitrlashKran,
  onElektrolizTok,
  onXavfsizlikDushi,
  onKozYuvish,
  onKozoynakTaqish,
  onGazNiqobiTaqish,
}) {
  // Qo'ldagi idishni boshqarish va stansiyalarni faollashtirish
  const qolgaOlYokiQoy = useCallback((amal = "asosiy") => {
    if (!kameraRef?.current || !sahnaRef?.current) return;

    // 1. Agar stenddagi yangi toza jihoz tanlangan bo'lsa (Glassware Rack)
    if (!fpsQolIdish && fpsQaralganIdish?.userData?.stendJihozi) {
      const kalit = fpsQaralganIdish.userData.kalit || "probirka";
      shishaUrilishi(2400);
      tiqinOchilishi();
      if (typeof onStenddanJihozOlish === "function") {
        const yangiIdish = onStenddanJihozOlish(kalit);
        if (yangiIdish) {
          yangiIdish.userData.qolda = true;
          yangiIdish.userData.kotarilgan = true;
          setFpsQolIdish(yangiIdish);
        }
      }
      return;
    }

    // 2. Agar Tarozi sensor tugmalari (TARA / ZERO) bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "tarozi_tara" || fpsQaralganStansiya === "tarozi_tara") {
      taroziBip(2800);
      if (typeof onTaroziTara === "function") onTaroziTara();
      return;
    }
    if (fpsQaralganIdish?.userData?.kalit === "tarozi_nol" || fpsQaralganStansiya === "tarozi_nol") {
      taroziBip(2400);
      if (typeof onTaroziNol === "function") onTaroziNol();
      return;
    }

    // 3. Agar Spirtovka yoqish/o'chirish bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "spirtovka" && !fpsQolIdish) {
      if (typeof onSpirtovkaBosildi === "function") {
        onSpirtovkaBosildi();
      }
      return;
    }

    // 4. Agar Rakovina kran jo'mragi bosilsa
    if ((fpsQaralganIdish?.userData?.kalit === "rakovina_kran" || fpsQaralganStansiya === "rakovina_kran") && !fpsQolIdish) {
      if (typeof onRakovinaKraniBosildi === "function") {
        onRakovinaKraniBosildi();
      }
      return;
    }

    // 5. Agar Byuretka krani bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "titrlash_kran" || fpsQaralganStansiya === "titrlash_kran") {
      if (typeof onTitrlashKran === "function") {
        onTitrlashKran();
      }
      return;
    }

    // 6. Agar Elektroliz tok manbai regulyatori bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "elektroliz_tok" || fpsQaralganStansiya === "elektroliz_tok") {
      if (typeof onElektrolizTok === "function") {
        onElektrolizTok();
      }
      return;
    }

    // 7. Agar Xavfsizlik Dushi zanjiri bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "xavfsizlik_dushi" || fpsQaralganStansiya === "xavfsizlik_dushi") {
      if (typeof onXavfsizlikDushi === "function") {
        onXavfsizlikDushi();
      }
      return;
    }

    // 8. Agar Ko'z Yuvish favvorasi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "koz_yuvish" || fpsQaralganStansiya === "koz_yuvish") {
      if (typeof onKozYuvish === "function") {
        onKozYuvish();
      }
      return;
    }

    // 9. Agar Himoya ko'zoynagi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "himoya_kozoynagi") {
      if (typeof onKozoynakTaqish === "function") {
        onKozoynakTaqish();
      }
      return;
    }

    // 10. Agar Gaz niqobi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "gaz_niqobi") {
      if (typeof onGazNiqobiTaqish === "function") {
        onGazNiqobiTaqish();
      }
      return;
    }

    // 11. Agar Smart Planshet / Monitor bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "lab_planshet" || fpsQaralganStansiya === "lab_planshet") {
      shishaUrilishi(2200);
      if (typeof onPlanshetBosildi === "function") {
        onPlanshetBosildi();
      }
      return;
    }

    // 12. Agar Devor / Stend stansiyalari tanlangan bo'lsa (Davriy jadval, Titrlash, Elektroliz)
    if (!fpsQolIdish && fpsQaralganStansiya && !["tarozi_tara", "tarozi_nol", "rakovina_kran", "lab_planshet", "titrlash_kran", "elektroliz_tok", "xavfsizlik_dushi", "koz_yuvish"].includes(fpsQaralganStansiya)) {
      shishaUrilishi(2200);
      if (typeof onStansiyaOchildi === "function") {
        onStansiyaOchildi(fpsQaralganStansiya);
      }
      return;
    }

    // 13. Agar devor javonidagi reagent shishasiga qaralgan bo'lsa
    if (!fpsQolIdish && fpsQaralganIdish?.userData?.devorShishasi) {
      const kalit = fpsQaralganIdish.userData.kalit;
      tiqinOchilishi();
      if (typeof onIdishTanlandi === "function") {
        onIdishTanlandi(fpsQaralganIdish);
      }
      fpsQaralganIdish.userData.qolda = true;
      fpsQaralganIdish.userData.kotarilgan = true;
      setFpsQolIdish(fpsQaralganIdish);
      return;
    }

    // 14. Agar qo'lda idish bo'lsa -> Qaralgan joyga qo'yish, yuvish yoki quyish
    if (fpsQolIdish) {
      const held = fpsQolIdish;

      // Agar G bosilgan bo'lsa yoki devor shishasi bo'lib devor javoniga qaralgan bo'lsa -> Javonga qaytarish
      if (held.userData?.devorShishasi && (amal === "javonga_qaytar" || fpsQaralganStansiya === "devor_javoni")) {
        tiqinOchilishi();
        if (typeof onJavongaQaytar === "function") {
          onJavongaQaytar();
        }
        setFpsQolIdish(null);
        return;
      }

      // Agar G bosilgan bo'lsa -> To'g'ridan-to'g'ri stolga qo'yish
      if (amal === "stolga_qoy") {
        const dir = new THREE.Vector3();
        kameraRef.current.getWorldDirection(dir);
        const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.0);

        held.position.set(Math.max(-1.5, Math.min(1.5, dropPos.x)), 0.90, Math.max(-0.6, Math.min(0.6, dropPos.z)));
        held.rotation.set(0, 0, 0);
        held.userData.qolda = false;
        held.userData.kotarilgan = false;
        setFpsQolIdish(null);
        shishaUrilishi(2000);
        return;
      }

      // Maxsus stansiyalarga qo'yish yoki aralashtirish
      if (fpsQaralganIdish && fpsQaralganIdish !== held) {
        const targetKalit = fpsQaralganIdish.userData?.kalit;

        // Agar qo'lda Shisha tayoqcha bo'lsa -> Aralashtirish
        if (held.userData?.kalit === "shisha-tayoqcha" && fpsQaralganIdish.userData?.sigim > 0) {
          shishaUrilishi(3200);
          if (typeof onAralashtirish === "function") {
            onAralashtirish(fpsQaralganIdish);
          }
          return;
        }

        // Agar qo'lda Spatula bo'lsa -> Kukun olish yoki solish
        if (held.userData?.kalit === "spatula") {
          shishaUrilishi(2600);
          if (typeof onSpatulaAmal === "function") {
            onSpatulaAmal(fpsQaralganIdish, held);
          }
          return;
        }

        // Tarozi pallasiga qo'yish
        if (targetKalit === "tarozi" || targetKalit === "tarozi_palla" || fpsQaralganStansiya === "tarozi") {
          held.position.set(-3.2, 1.014, 0.18);
          held.rotation.set(0, 0, 0);
          held.userData.tarozida = true;
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onTaroziTushdi === "function") onTaroziTushdi(held);
          return;
        }

        // Spirtovka ustiga qo'yish
        if (targetKalit === "spirtovka") {
          held.position.set(fpsQaralganIdish.position.x, 1.08, fpsQaralganIdish.position.z);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onSpirtovkagaQoyildi === "function") onSpirtovkagaQoyildi(held);
          return;
        }

        // Rakovinada yuvish
        if (targetKalit === "rakovina" || targetKalit === "rakovina_kran" || fpsQaralganStansiya === "yuvinish") {
          if (typeof onRakovinagaTushdi === "function") {
            onRakovinagaTushdi(held);
          }
          return;
        }

        // Boshqa idishga quyish
        if (fpsQaralganIdish.userData?.sigim > 0 || fpsQaralganIdish.userData?.tanlanadi) {
          if (typeof onQuyishBoshla === "function") {
            onQuyishBoshla(held.userData?.kalit, fpsQaralganIdish, held, 45);
          }
          return;
        }
      }

      // Erkin stol ustiga tushirish
      const dir = new THREE.Vector3();
      kameraRef.current.getWorldDirection(dir);
      const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.0);

      held.position.set(Math.max(-1.5, Math.min(1.5, dropPos.x)), 0.90, Math.max(-0.6, Math.min(0.6, dropPos.z)));
      held.rotation.set(0, 0, 0);
      held.userData.qolda = false;
      held.userData.kotarilgan = false;
      setFpsQolIdish(null);
      shishaUrilishi(2000);
      return;
    }

    // 15. Agar qo'l bo'sh bo'lsa va oddiy idishga qaralgan bo'lsa -> Qo'lga olish
    if (fpsQaralganIdish && !fpsQaralganIdish.userData?.stendJihozi) {
      const target = fpsQaralganIdish;
      target.userData.qolda = true;
      target.userData.kotarilgan = true;
      if (target.userData.tarozida && typeof onTarozidanOlingan === "function") {
        onTarozidanOlingan(target);
        target.userData.tarozida = false;
      }
      setFpsQolIdish(target);
      shishaUrilishi(2400);
      tiqinOchilishi();

      if (typeof onIdishTanlandi === "function") {
        onIdishTanlandi(target);
      }
    }
  }, [fpsQolIdish, fpsQaralganIdish, fpsQaralganStansiya, kameraRef, sahnaRef, onIdishTanlandi, onQuyishBoshla, onTaroziTushdi, onTarozidanOlingan, onTaroziTara, onTaroziNol, onSpirtovkaBosildi, onSpirtovkagaQoyildi, onRakovinaKraniBosildi, onRakovinagaTushdi, onPlanshetBosildi, onStansiyaOchildi, onStenddanJihozOlish, onJavongaQaytar, onAralashtirish, onSpatulaAmal, onTitrlashKran, onElektrolizTok, onXavfsizlikDushi, onKozYuvish, onKozoynakTaqish, onGazNiqobiTaqish]);

  return qolgaOlYokiQoy;
}
