"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { shishaUrilishi } from "../lib/ovoz.js";
import { SLOTLAR } from "../lib/sozlama.js";

function idishGuruhiniTop(obyekt) {
  let joriy = obyekt;
  while (joriy) {
    if (joriy.userData && joriy.userData.tanlanadi && joriy.userData.kalit) {
      return joriy;
    }
    joriy = joriy.parent;
  }
  return null;
}

/**
 * 3-BOSQICH: IDISHLARNI USHLASH, KO'TARISH VA STOLDA ISHLASHNING ANIQ 3 BOSQICHLI MEXANIKASI.
 *
 * 1-QADAM: Pick & Lift (Y = 1.15m balandlikka ko'tarish, oltin nur, shisha urilish tovushi).
 * 2-QADAM: Drag & Magnetic Snap (Boshqa idish, Tarozi, Byuretka va Spirtovkaga magnitdek tortilish).
 * 3-QADAM: Action & Auto-slot Return (Bo'sh joyga qo'yilganda eng yaqin slotga silliq tushish).
 */
export function useSudrash({
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onIdishKotarildi,
  onNishongaYaqinlashdi,
  onIdishQoyildi,
  onTaroziTushdi,
  onTarozidanOlingan,
  onTaroziBosildi,
  onTaroziTara,
  onTaroziNol,
  onSpirtovkagaQoyildi,
  onRakovinagaTushdi,
}) {
  const [tanlanganIdish, setTanlanganIdish] = useState(null);
  const [kotarilganIdish, setKotarilganIdish] = useState(null);
  const [kursorIdish, setKursorIdish] = useState(null);
  const [yaqinNishon, setYaqinNishon] = useState(null);
  const [nishonTuri, setNishonTuri] = useState(null); // 'idish' | 'tarozi' | 'spirtovka' | 'byuretka'
  const [sudralmoqda, setSudralmoqda] = useState(false);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const avvalgiYoritilganRef = useRef(null);

  // Sudrash tekisligi (Y = 1.15m balandlikda)
  const sudrashTekisligiRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.15));
  const kesishmaNuqtaRef = useRef(new THREE.Vector3());
  const boshlangichPozitsiyaRef = useRef(new THREE.Vector3());
  const sudrashOffsetRef = useRef(new THREE.Vector3());
  const faolGuruhRef = useRef(null);

  // Emissive yoritish yordamchisi
  const yoritishniOzgartir = useCallback((group, yorit, rang = 0x38bdf8) => {
    if (!group) return;
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child === group.userData.suyuqlikMesh || child === group.userData.chokmaMesh) return;
        if (child.material.emissive) {
          if (yorit) {
            child.userData.aslEmissive = child.material.emissive.getHex();
            child.material.emissive.setHex(rang);
            child.material.emissiveIntensity = 0.45;
          } else {
            const asl = child.userData.aslEmissive || 0x000000;
            child.material.emissive.setHex(asl);
            child.material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, []);

  // Eng yaqin magnitli nishonni (Idish, Tarozi, Spirtovka, Byuretka, Rakovina) aniqlash
  const yaqinNishonniTop = useCallback((kotarilganGuruh) => {
    if (!kotarilganGuruh || !sahnaRef?.current) return { nishon: null, turi: null };

    const pos = kotarilganGuruh.position;

    // 1. Chap Stol: Analitik Tarozi ustiga yaqinlashish (X: -3.2, Z: 0.2)
    const taroziMasofa = new THREE.Vector2(pos.x - (-3.2), pos.z - 0.2).length();
    if (taroziMasofa < 0.65) {
      return { nishon: { position: new THREE.Vector3(-3.2, 1.014, 0.18), kalit: "tarozi" }, turi: "tarozi" };
    }

    // 2. O'ng Stol: Byuretka stendiga yaqinlashish (X: 3.2, Z: 0.4)
    const byuretkaMasofa = new THREE.Vector2(pos.x - 3.2, pos.z - 0.4).length();
    if (byuretkaMasofa < 0.65) {
      return { nishon: { position: new THREE.Vector3(3.2, 0.98, 0.4), kalit: "byuretka" }, turi: "byuretka" };
    }

    // 3. Yuvinish Rakovinasi krani tagiga yaqinlashish (X: -5.5, Z: -4.8)
    const rakovinaMasofa = new THREE.Vector2(pos.x - (-5.5), pos.z - (-4.8)).length();
    if (rakovinaMasofa < 0.85) {
      return { nishon: { position: new THREE.Vector3(-5.5, 0.98, -4.8), kalit: "rakovina" }, turi: "rakovina" };
    }

    // 4. Stoldagi boshqa idishlar yoki Spirtovkaga yaqinlashish
    let engYaqin = null;
    let engKamMasofa = 0.45;
    let aniqlanganTur = null;

    sahnaRef.current.children.forEach((obj) => {
      if (
        obj !== kotarilganGuruh &&
        obj.userData &&
        obj.userData.tanlanadi &&
        obj.userData.kalit
      ) {
        const masofa = pos.distanceTo(obj.position);
        if (masofa < engKamMasofa) {
          engKamMasofa = masofa;
          engYaqin = obj;
          aniqlanganTur = obj.userData.kalit === "spirtovka" ? "spirtovka" : "idish";
        }
      }
    });

    return { nishon: engYaqin, turi: aniqlanganTur };
  }, [sahnaRef]);

  // Bo'sh eng yaqin stol slotini topish
  const engYaqinSlotniTop = useCallback((pos) => {
    let engYaqinIndex = 0;
    let minMasofa = Infinity;

    SLOTLAR.forEach(([sx, sy, sz], idx) => {
      const d = Math.hypot(pos.x - sx, pos.z - sz);
      if (d < minMasofa) {
        minMasofa = d;
        engYaqinIndex = idx;
      }
    });

    const [x, y, z] = SLOTLAR[engYaqinIndex];
    return new THREE.Vector3(x, y, z);
  }, []);

  useEffect(() => {
    const rendererElement = rendererRef?.current?.domElement;
    if (!rendererElement || !sahnaRef?.current || !kameraRef?.current) return;

    const koordinataniHisobla = (event) => {
      const rect = rendererElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    };

    // 1-QADAM: USHLASH & KO'TARISH (PICK & LIFT)
    const handlePointerDown = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return;
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);
      const kesishmalar = raycasterRef.current.intersectObjects(sahnaRef.current.children, true);

      // Avval maxsus tugmalarni tekshirish (TARA, NOL yoki Tarozi korpusi)
      for (const kesish of kesishmalar) {
        const obj = kesish.object;
        if (obj?.userData?.kalit === "tarozi_tara") {
          if (typeof onTaroziTara === "function") onTaroziTara();
          return;
        }
        if (obj?.userData?.kalit === "tarozi_nol") {
          if (typeof onTaroziNol === "function") onTaroziNol();
          return;
        }
        let ota = obj;
        while (ota) {
          if (ota.name === "Tarozi_Stansiyasi") {
            if (typeof onTaroziBosildi === "function") onTaroziBosildi();
            break;
          }
          ota = ota.parent;
        }
      }

      let topilganGroup = null;
      for (const kesish of kesishmalar) {
        const group = idishGuruhiniTop(kesish.object);
        if (group) {
          topilganGroup = group;
          break;
        }
      }

      if (topilganGroup) {
        faolGuruhRef.current = topilganGroup;
        boshlangichPozitsiyaRef.current.copy(topilganGroup.position);

        if (controlsRef?.current) {
          controlsRef.current.enabled = false;
        }

        sudrashTekisligiRef.current.constant = -(topilganGroup.position.y + 0.24);

        if (raycasterRef.current.ray.intersectPlane(sudrashTekisligiRef.current, kesishmaNuqtaRef.current)) {
          sudrashOffsetRef.current.copy(topilganGroup.position).sub(kesishmaNuqtaRef.current);
        }

        // Agar tarozi pallasida turgan bo'lsa, undan olinganini bildirish
        if (topilganGroup.userData.tarozida) {
          topilganGroup.userData.tarozida = false;
          if (typeof onTarozidanOlingan === "function") {
            onTarozidanOlingan(topilganGroup);
          }
        }

        // Ko'z oldiga silliq ko'tariladi (Y = 1.15m)
        topilganGroup.position.y = Math.max(1.15, topilganGroup.position.y + 0.25);
        topilganGroup.userData.kotarilgan = true;

        shishaUrilishi(2400);
        yoritishniOzgartir(topilganGroup, true, 0xfacc15); // Oltin neon hoshiya

        setTanlanganIdish(topilganGroup);
        setKotarilganIdish(topilganGroup);
        setSudralmoqda(true);

        if (typeof onIdishTanlandi === "function") onIdishTanlandi(topilganGroup);
        if (typeof onIdishKotarildi === "function") onIdishKotarildi(topilganGroup);
      } else {
        setTanlanganIdish(null);
      }
    };

    // 2-QADAM: ERKIN HARAKATLANTIRISH VA MAGNITLI NISHONLASH (DRAG & SNAP)
    const handlePointerMove = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return;
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);

      if (faolGuruhRef.current && controlsRef?.current?.enabled === false) {
        if (raycasterRef.current.ray.intersectPlane(sudrashTekisligiRef.current, kesishmaNuqtaRef.current)) {
          const yangiPos = kesishmaNuqtaRef.current.add(sudrashOffsetRef.current);

          // Butun 16x12m laboratoriya bo'yicha erkin surish chegaralari
          yangiPos.x = Math.max(-7.0, Math.min(7.0, yangiPos.x));
          yangiPos.z = Math.max(-5.0, Math.min(5.0, yangiPos.z));

          faolGuruhRef.current.position.x = yangiPos.x;
          faolGuruhRef.current.position.z = yangiPos.z;

          // Magnitli nishonni tekshirish
          const { nishon, turi } = yaqinNishonniTop(faolGuruhRef.current);
          if (nishon !== yaqinNishon) {
            if (yaqinNishon && yaqinNishon.userData) yoritishniOzgartir(yaqinNishon, false);
            if (nishon && nishon.userData) yoritishniOzgartir(nishon, true, 0x10b981); // Yashil nishon hoshiya

            setYaqinNishon(nishon);
            setNishonTuri(turi);

            if (nishon) {
              shishaUrilishi(2800);
              if (typeof onNishongaYaqinlashdi === "function") onNishongaYaqinlashdi(nishon, turi);
            }
          }
        }
        return;
      }

      // Oddiy hover
      const kesishmalar = raycasterRef.current.intersectObjects(sahnaRef.current.children, true);
      let topilganGroup = null;
      let maxsusTugma = false;

      for (const kesish of kesishmalar) {
        const obj = kesish.object;
        if (obj?.userData?.kalit === "tarozi_tara" || obj?.userData?.kalit === "tarozi_nol") {
          maxsusTugma = true;
          break;
        }
        const group = idishGuruhiniTop(obj);
        if (group) {
          topilganGroup = group;
          break;
        }
      }

      if (maxsusTugma) {
        rendererElement.style.cursor = "pointer";
        return;
      }

      if (topilganGroup !== avvalgiYoritilganRef.current) {
        if (avvalgiYoritilganRef.current && avvalgiYoritilganRef.current !== kotarilganIdish) {
          yoritishniOzgartir(avvalgiYoritilganRef.current, false);
        }
        if (topilganGroup && topilganGroup !== kotarilganIdish) {
          yoritishniOzgartir(topilganGroup, true);
          rendererElement.style.cursor = "grab";
        } else {
          rendererElement.style.cursor = "default";
        }
        avvalgiYoritilganRef.current = topilganGroup;
        setKursorIdish(topilganGroup);
      }
    };

    // 3-QADAM: AMALLARNI BAJARISH VA JOYIGA QAYTARISH (ACTION & AUTO-SLOT RETURN)
    const handlePointerUp = () => {
      if (faolGuruhRef.current) {
        const guruh = faolGuruhRef.current;

        if (!yaqinNishon) {
          // Eng yaqin bo'sh slotga silliq tushadi
          const slotPos = engYaqinSlotniTop(guruh.position);
          guruh.position.copy(slotPos);
          guruh.userData.kotarilgan = false;
          yoritishniOzgartir(guruh, false);
          setKotarilganIdish(null);
          if (typeof onIdishQoyildi === "function") onIdishQoyildi(guruh);
        } else {
          // Nishon ustida quyish yoki amaliyot holatida qoladi
          if (nishonTuri === "tarozi") {
            // Tarozi pallasiga aniq o'tiradi
            guruh.position.set(-3.2, 1.014, 0.18);
            guruh.rotation.set(0, 0, 0);
            guruh.userData.kotarilgan = false;
            guruh.userData.tarozida = true;
            yoritishniOzgartir(guruh, false);
            setKotarilganIdish(null);

            if (typeof onTaroziTushdi === "function") {
              onTaroziTushdi(guruh);
            }
          } else if (nishonTuri === "spirtovka" && typeof onSpirtovkagaQoyildi === "function") {
            onSpirtovkagaQoyildi(guruh);
          } else if (nishonTuri === "rakovina" && typeof onRakovinagaTushdi === "function") {
            onRakovinagaTushdi(guruh);
          }
        }

        faolGuruhRef.current = null;
        setSudralmoqda(false);
      }

      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }
    };

    rendererElement.addEventListener("pointerdown", handlePointerDown);
    rendererElement.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      rendererElement.removeEventListener("pointerdown", handlePointerDown);
      rendererElement.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (avvalgiYoritilganRef.current) {
        yoritishniOzgartir(avvalgiYoritilganRef.current, false);
      }
    };
  }, [sahnaRef, kameraRef, rendererRef, controlsRef, yoritishniOzgartir, yaqinNishonniTop, engYaqinSlotniTop, yaqinNishon, nishonTuri, kotarilganIdish, onIdishTanlandi, onIdishKotarildi, onNishongaYaqinlashdi, onIdishQoyildi, onTaroziTushdi, onTarozidanOlingan, onTaroziBosildi, onTaroziTara, onTaroziNol, onSpirtovkagaQoyildi, onRakovinagaTushdi]);

  // Idishni qo'lda stol slotiga tushirish
  const idishniJoyigaQoy = useCallback((group) => {
    const nishonGroup = group || kotarilganIdish;
    if (!nishonGroup) return;

    const slotPos = engYaqinSlotniTop(nishonGroup.position);
    nishonGroup.position.copy(slotPos);
    nishonGroup.rotation.set(0, 0, 0);
    nishonGroup.userData.kotarilgan = false;
    yoritishniOzgartir(nishonGroup, false);

    if (nishonGroup.userData.tarozida) {
      nishonGroup.userData.tarozida = false;
      if (typeof onTarozidanOlingan === "function") {
        onTarozidanOlingan(nishonGroup);
      }
    }

    if (yaqinNishon && yaqinNishon.userData) {
      yoritishniOzgartir(yaqinNishon, false);
      setYaqinNishon(null);
      setNishonTuri(null);
    }

    setKotarilganIdish(null);
    setTanlanganIdish(null);
    if (typeof onIdishQoyildi === "function") onIdishQoyildi(nishonGroup);
  }, [kotarilganIdish, yaqinNishon, yoritishniOzgartir, engYaqinSlotniTop, onIdishQoyildi, onTarozidanOlingan]);

  return {
    tanlanganIdish,
    setTanlanganIdish,
    kotarilganIdish,
    kursorIdish,
    yaqinNishon,
    nishonTuri,
    sudralmoqda,
    idishniJoyigaQoy,
  };
}


  // Idishni qo'lda stol slotiga tushirish
  const idishniJoyigaQoy = useCallback((group) => {
    const nishonGroup = group || kotarilganIdish;
    if (!nishonGroup) return;

    const slotPos = engYaqinSlotniTop(nishonGroup.position);
    nishonGroup.position.copy(slotPos);
    nishonGroup.rotation.set(0, 0, 0);
    nishonGroup.userData.kotarilgan = false;
    yoritishniOzgartir(nishonGroup, false);

    if (yaqinNishon && yaqinNishon.userData) {
      yoritishniOzgartir(yaqinNishon, false);
      setYaqinNishon(null);
      setNishonTuri(null);
    }

    setKotarilganIdish(null);
    setTanlanganIdish(null);
    if (typeof onIdishQoyildi === "function") onIdishQoyildi(nishonGroup);
  }, [kotarilganIdish, yaqinNishon, yoritishniOzgartir, engYaqinSlotniTop, onIdishQoyildi]);

  return {
    tanlanganIdish,
    setTanlanganIdish,
    kotarilganIdish,
    kursorIdish,
    yaqinNishon,
    nishonTuri,
    sudralmoqda,
    idishniJoyigaQoy,
  };
}
