"use client";

import { useEffect } from "react";
import * as THREE from "three";

import { qadamTovushi } from "../lib/ovoz.js";
import { ishorasiniMosla } from "../lib/kirish-usuli.js";
import { YURISH, stolKolliziyasi } from "../lib/yurish-kolliziya.js";

// YURISH SIKLI — har kadr: kirish, tezlik, to'siq, ko'z balandligi,
// qo'ldagi idishning joyi va crosshair raycasti.
//
// `useYurish.js` dan ajratildi (BRIF-05).
//
// Raycast HAR KADRDA emas, har ikkinchi kadrda bajariladi
// (`raycastFrameRef`): u sahnaning butun daraxti bo'ylab yuradi va
// qimmat. Nishon matni esa faqat O'ZGARGANDA React holatiga yoziladi
// — aks holda har kadr qayta render bo'lardi.

export function useYurishSikli({
  tayyor,
  yurishRejimi,
  kameraRef,
  sahnaRef,
  fpsQolIdish,
  isitimoda,
  setYurmoqda,
  setFpsQaralganIdish,
  setFpsQaralganStansiya,
  setFpsKontekstMatn,
  setFpsKontekstTuri,
  holat,
}) {
  const {
    analogRef,
    avvalgiFpsYoritilganRef,
    bobbingRef,
    centerRaycasterRef,
    eyeHeightRef,
    kadrIdRef,
    keysRef,
    kirishUsuliRef,
    oldingiVaqtRef,
    prevIsMovingRef,
    prevPromptTextRef,
    prevPromptTypeRef,
    prevStansiyaRef,
    qadamVaqtiRef,
    raycastFrameRef,
    rotationRef,
    targetEyeHeightRef,
    velocityRef,
    verticalVelocityRef,
  } = holat;

  useEffect(() => {
    if (!tayyor || !yurishRejimi || !kameraRef?.current || !sahnaRef?.current) return;

    const kamera = kameraRef.current;
    const sahna = sahnaRef.current;
    oldingiVaqtRef.current = performance.now();

    const fpsLoop = () => {
      kadrIdRef.current = requestAnimationFrame(fpsLoop);

      const hozir = performance.now();
      const dt = Math.min(0.08, (hozir - oldingiVaqtRef.current) / 1000);
      oldingiVaqtRef.current = hozir;

      const keys = keysRef.current;
      const analog = analogRef.current;

      // 1. Normalizatsiyalangan kirish signallari
      let rawFwd = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
      let rawStr = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);

      if (analog.vx !== 0 || analog.vz !== 0) {
        rawStr = analog.vx;
        rawFwd = -analog.vz;
      }

      const inputLen = Math.hypot(rawFwd, rawStr);
      let forward = 0;
      let strafe = 0;

      if (inputLen > 0.05) {
        forward = rawFwd / Math.max(1, inputLen);
        strafe = rawStr / Math.max(1, inputLen);
      }

      const isSprint = keys.sprint || analog.sprint;
      const isCrouch = keys.crouch;
      const maxSpeed = isCrouch ? 1.4 : isSprint ? 5.2 : 2.8; // m/s
      const isMoving = inputLen > 0.05;

      if (isMoving !== prevIsMovingRef.current) {
        prevIsMovingRef.current = isMoving;
        setYurmoqda(isMoving);
      }

      // 2. Kamera yo'nalish vektorlari
      const yaw = rotationRef.current.yaw;
      const pitch = rotationRef.current.pitch;

      const forwardVec = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
      const rightVec = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

      const targetVel = new THREE.Vector3();
      if (isMoving) {
        targetVel.addScaledVector(forwardVec, forward);
        targetVel.addScaledVector(rightVec, strafe);
        targetVel.multiplyScalar(maxSpeed);
      }

      velocityRef.current.lerp(targetVel, dt * (isMoving ? 12 : 16));

      // Yangi xom pozitsiya
      let nextX = kamera.position.x + velocityRef.current.x * dt;
      let nextZ = kamera.position.z + velocityRef.current.z * dt;

      // 1. Asosiy markaziy stol to'sig'i itarishi (X: [-1.6, 1.6], Z: [-0.8, 0.8])
      const cMain = stolKolliziyasi(nextX, nextZ, -1.6, 1.6, -0.8, 0.8, 0.45);
      nextX = cMain.x;
      nextZ = cMain.z;

      // 2. Chap stol to'sig'i itarishi (X: [-4.2, -2.2], Z: [-0.5, 0.9])
      const cLeft = stolKolliziyasi(nextX, nextZ, -4.2, -2.2, -0.5, 0.9, 0.45);
      nextX = cLeft.x;
      nextZ = cLeft.z;

      // 3. O'ng stol to'sig'i itarishi (X: [2.2, 4.2], Z: [-0.5, 0.9])
      const cRight = stolKolliziyasi(nextX, nextZ, 2.2, 4.2, -0.5, 0.9, 0.45);
      nextX = cRight.x;
      nextZ = cRight.z;

      // 4. Rakovina uchun alohida to'siq YO'Q.
      //
      // U endi chap devordagi ish yuzasiga o'rnatilgan, devor
      // chegarasi esa o'yinchini yuzadan 0.38 m oldin to'xtatadi
      // (devor -10, yuza chuqurligi 0.42, yurish chegarasi -9.2).
      // Ilgari rakovina xona o'rtasida havoda turgani uchun unga
      // alohida to'siq kerak edi.

      // 5. Qat'iy xona devorlari va eshik chegarasi.
      // Sonlar QO'LDA YOZILMAYDI: ular xona o'lchamidan hisoblanadi
      // (sozlama.js). Ilgari bu yerda -7.2/7.2/-4.8/5.2 turardi va xona
      // o'lchami o'zgarsa foydalanuvchi devordan o'tib ketardi yoki
      // ko'rinmas to'siqqa urilardi.
      kamera.position.x = Math.max(YURISH.xMin, Math.min(YURISH.xMax, nextX));
      kamera.position.z = Math.max(YURISH.zMin, Math.min(YURISH.zMax, nextZ));

      // Ko'z balandligi va cho'qqayish lerp
      eyeHeightRef.current = THREE.MathUtils.lerp(eyeHeightRef.current, targetEyeHeightRef.current, dt * 10);

      // Gravitatsiya va sakrash
      if (verticalVelocityRef.current !== 0 || eyeHeightRef.current > targetEyeHeightRef.current) {
        verticalVelocityRef.current -= 9.8 * dt;
        eyeHeightRef.current += verticalVelocityRef.current * dt;

        if (eyeHeightRef.current <= targetEyeHeightRef.current) {
          eyeHeightRef.current = targetEyeHeightRef.current;
          verticalVelocityRef.current = 0;
        }
      }

      // Qadam tovushi va Head-Bobbing
      if (isMoving && eyeHeightRef.current <= 1.62 && !isCrouch) {
        bobbingRef.current += dt * (isSprint ? 16 : 10);
        kamera.position.y = eyeHeightRef.current + Math.sin(bobbingRef.current) * 0.024;

        qadamVaqtiRef.current += dt;
        if (qadamVaqtiRef.current > (isSprint ? 0.28 : 0.44)) {
          qadamTovushi();
          qadamVaqtiRef.current = 0;
        }
      } else {
        kamera.position.y = eyeHeightRef.current;
      }

      // Kamera yo'nalishi
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const lookTarget = kamera.position.clone().add(lookDir);
      kamera.lookAt(lookTarget);

      // 3. FPS QO'LDAGI IDISHNI KAMERA OLDIGA MAHKAMLASH
      if (fpsQolIdish) {
        const handOffset = new THREE.Vector3(0.24, -0.22, -0.48);
        handOffset.applyEuler(kamera.rotation);
        const handPos = kamera.position.clone().add(handOffset);

        fpsQolIdish.position.lerp(handPos, 0.45);
        fpsQolIdish.rotation.copy(kamera.rotation);
      }

      // 4. CROSSHAIR RAYCASTING
      raycastFrameRef.current++;
      if (raycastFrameRef.current % 2 === 0) {
        centerRaycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), kamera);
        const hits = centerRaycasterRef.current.intersectObjects(sahna.children, true);

        let foundIdish = null;
        let foundStansiya = null;
        let promptText = "";
        let promptType = "oddiy";

        for (const hit of hits) {
          if (hit.distance > 3.4) break;

          const obj = hit.object;

          // Maxsus stansiyalar va tugmalarni tekshirish
          let ota = obj;
          while (ota) {
            if (ota.userData?.kalit === "tarozi_tara") {
              foundStansiya = "tarozi_tara";
              foundIdish = ota;
              promptText = "[E / Klik] Tarozini TARA qilish (Nolga tenglashtirish)";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "tarozi_nol") {
              foundStansiya = "tarozi_nol";
              foundIdish = ota;
              promptText = "[E / Klik] Tarozini NOLGA qaytarish";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "rakovina_kran") {
              foundStansiya = "rakovina_kran";
              foundIdish = ota;
              promptText = "[E / Klik] Distillangan suv kranini burash";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "lab_planshet") {
              foundStansiya = "lab_planshet";
              foundIdish = ota;
              promptText = "[E / Klik] Reaksiya Tahlili va Ilmiy Hisobot";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "titrlash_kran") {
              foundStansiya = "titrlash_kran";
              foundIdish = ota;
              promptText = "[E / Klik] Byuretka kranini burash (Tomchilatish / To'xtatish)";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "elektroliz_tok") {
              foundStansiya = "elektroliz_tok";
              foundIdish = ota;
              promptText = "[E / Klik] DC Tok Manbaini yoqish / o'chirish (Faradey Elektrolizi)";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "xavfsizlik_dushi" || ota.name === "Xavfsizlik_Dushi_Stansiyasi") {
              foundStansiya = "xavfsizlik_dushi";
              foundIdish = ota;
              promptText = "[E / Klik] Favqulodda Xavfsizlik Dushini tortish (Zararsizlantirish)";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "koz_yuvish") {
              foundStansiya = "koz_yuvish";
              foundIdish = ota;
              promptText = "[E / Klik] Ko'z Yuvish Favvorasini ochish";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "himoya_kozoynagi") {
              foundIdish = ota;
              promptText = "[E / Klik] Kimyoviy Himoya Ko'zoynagini taqish / yechish";
              promptType = "urgu";
              break;
            }
            if (ota.userData?.kalit === "gaz_niqobi") {
              foundIdish = ota;
              promptText = "[E / Klik] Kimyoviy Gaz Niqobini (Respirator) taqish / yechish";
              promptType = "urgu";
              break;
            }
            if (ota.name === "Davriy_Jadval_LED_Plakat" || ota.userData?.kalit === "davriy_jadval") {
              foundStansiya = "davriy_jadval";
              promptText = "[E / Klik] Mendeleyev Davriy Jadvali (IUPAC)";
              promptType = "urgu";
              break;
            }
            if (ota.name === "Titrlash_Byuretka_Stansiyasi" || ota.userData?.kalit === "titrlash") {
              foundStansiya = "titrlash";
              promptText = "[E / Klik] 50ml Byuretka Titrlash Stendi";
              promptType = "urgu";
              break;
            }
            if (ota.name === "Elektroliz_Stansiyasi" || ota.userData?.kalit === "elektroliz") {
              foundStansiya = "elektroliz";
              promptText = "[E / Klik] Tok Manbai va Elektroliz Stendi";
              promptType = "urgu";
              break;
            }
            if (ota.name === "Tarozi_Stansiyasi" || ota.userData?.kalit === "tarozi") {
              foundStansiya = "tarozi";
              break;
            }
            if (ota.name === "Yuvinish_Rakovinasi" || ota.userData?.kalit === "rakovina") {
              foundStansiya = "yuvinish";
              break;
            }
            if (ota.name === "3D_Devor_Reagent_Shkaflari") {
              foundStansiya = "devor_javoni";
            }
            ota = ota.parent;
          }

          if (foundStansiya && promptText) break;

          let joriy = obj;
          while (joriy) {
            if (joriy.userData && joriy.userData.tanlanadi && joriy.userData.kalit && joriy !== fpsQolIdish) {
              foundIdish = joriy;
              break;
            }
            joriy = joriy.parent;
          }

          if (foundIdish) break;
        }

        // Dinamik Cyber-HUD matnlarini shakllantirish
        if (fpsQolIdish) {
          const heldNom = fpsQolIdish.userData?.nom || fpsQolIdish.userData?.kalit || "Idish";

          if (foundIdish && foundIdish !== fpsQolIdish) {
            const targetNom = foundIdish.userData?.nom || foundIdish.userData?.kalit || "Idish";

            if (fpsQolIdish.userData?.kalit === "shisha-tayoqcha" && (foundIdish.userData?.sigim > 0 || foundIdish.userData?.tanlanadi)) {
              promptText = `[E / Klik] ${targetNom}ni shisha tayoqcha bilan aralashtirish (Reaksiya jadallashuvi)`;
              promptType = "urgu";
            } else if (fpsQolIdish.userData?.kalit === "spatula") {
              if (foundIdish.userData?.devorShishasi || foundIdish.userData?.kalit?.startsWith("Cu") || foundIdish.userData?.kalit?.startsWith("Ag") || foundIdish.userData?.kalit?.startsWith("KMn") || foundIdish.userData?.kalit?.startsWith("Fe") || foundIdish.userData?.kalit?.startsWith("Ba")) {
                promptText = `[E / Klik] 1.0g ${targetNom} kukunini spatulaga olish`;
                promptType = "urgu";
              } else if (foundIdish.userData?.sigim > 0) {
                promptText = `[E / Klik] 1.0g kukunni ${targetNom}ga solish va eritish`;
                promptType = "quyish";
              }
            } else if (foundIdish.userData?.kalit === "spirtovka") {
              promptText = `[E / Klik] ${heldNom}ni spirtovka ustiga qo'yish`;
              promptType = "urgu";
            } else if (foundIdish.userData?.kalit === "tarozi" || foundIdish.userData?.kalit === "tarozi_palla" || foundStansiya === "tarozi") {
              promptText = `[E / Klik] ${heldNom}ni tarozi pallasiga qo'yish`;
              promptType = "urgu";
            } else if (foundIdish.userData?.kalit === "rakovina" || foundStansiya === "yuvinish") {
              promptText = `[E / Klik] ${heldNom}ni rakovinada yuvish va tozalash`;
              promptType = "yuvish";
            } else if (foundIdish.userData?.sigim > 0 || foundIdish.userData?.tanlanadi) {
              promptText = `[E / LMB] ${targetNom}ga quyish | [1-5] Doza | [G] Stolga`;
              promptType = "quyish";
            }
          } else if (foundStansiya === "devor_javoni" && fpsQolIdish.userData?.devorShishasi) {
            promptText = `[E / G] ${heldNom}ni o'z devor javoniga qaytarish`;
            promptType = "urgu";
          } else {
            promptText = `[E / G] ${heldNom}ni stolga qo'yish`;
            promptType = "oddiy";
          }
        } else {
          if (foundIdish) {
            const targetNom = foundIdish.userData?.nom || foundIdish.userData?.kalit || "Jihoz";

            if (foundIdish.userData?.stendJihozi) {
              promptText = `[E / Klik] Yangi toza ${targetNom}ni olish`;
              promptType = "olish";
            } else if (foundIdish.userData?.devorShishasi) {
              const joriy = Math.round(foundIdish.userData?.joriyHajm || 500);
              const sigim = foundIdish.userData?.sigim || 500;
              promptText = `[E / Klik] ${targetNom} (${joriy}/${sigim}ml) shishasini olish`;
              promptType = "olish";
            } else if (foundIdish.userData?.kalit === "spirtovka") {
              promptText = `[E / Klik] Spirtovkani yoqish / o'chirish (Hozir: ${isitimoda ? "YONMOQDA" : "O'CHIQ"})`;
              promptType = "urgu";
            } else if (!promptText) {
              promptText = `[E / Klik] ${targetNom}ni qo'lga olish`;
              promptType = "olish";
            }
          }
        }

        if (foundIdish !== avvalgiFpsYoritilganRef.current) {
          avvalgiFpsYoritilganRef.current = foundIdish;
          setFpsQaralganIdish(foundIdish);
        }

        if (foundStansiya !== prevStansiyaRef.current) {
          prevStansiyaRef.current = foundStansiya;
          setFpsQaralganStansiya(foundStansiya);
        }

        if (promptText !== prevPromptTextRef.current) {
          prevPromptTextRef.current = promptText;
          // Nishon matnlari klaviatura ishorasi bilan yozilgan va ular
          // 25 ta joyda. Hammasi shu yagona nuqtadan o'tadi, shuning
          // uchun sensorli qurilmaga moslash shu yerda bir marta
          // bajariladi (`lib/kirish-usuli.js`).
          setFpsKontekstMatn(ishorasiniMosla(promptText, kirishUsuliRef.current));
        }

        if (promptType !== prevPromptTypeRef.current) {
          prevPromptTypeRef.current = promptType;
          setFpsKontekstTuri(promptType);
        }
      }
    };

    kadrIdRef.current = requestAnimationFrame(fpsLoop);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [tayyor, yurishRejimi, kameraRef, sahnaRef, fpsQolIdish, isitimoda]);
}
