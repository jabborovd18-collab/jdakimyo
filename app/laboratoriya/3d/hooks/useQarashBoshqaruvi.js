"use client";

import { useEffect } from "react";

import { pointerLockMavjudmi, yawniSiljit } from "../lib/qarash-boshqaruvi.js";

// QARASH — pointer lock, sichqoncha, g'ildirak va zaxira rejim.
//
// `useYurish.js` dan ajratildi (BRIF-05).
//
// Zaxira rejim tasodifiy emas: pointer lock API yo'q yoki rad etilgan
// muhitda (ba'zi mobil brauzerlar, o'lchagich) qarash baribir ishlashi
// kerak. Rejim `qarashRejimiRef` da yashaydi va o'lchagich uni
// natijaga yozadi.

export function useQarashBoshqaruvi({
  tayyor,
  yurishRejimi,
  rendererRef,
  fpsQolIdish,
  fpsQaralganIdish,
  qolgaOlYokiQoy,
  onQuyishToxtat,
  onAniqHajmQuy,
  setQarashRejimi,
  setQarashXabari,
  holat,
}) {
  const {
    analogRef,
    fokusFaolRef,
    keysRef,
    pointerLockOxirgiChiqishRef,
    qarashRejimiRef,
    quyishBosilganRef,
    rotationRef,
    sezgirlikRef,
    targetEyeHeightRef,
    velocityRef,
    verticalVelocityRef,
    yawJamiRef,
  } = holat;

  useEffect(() => {
    if (!tayyor || !yurishRejimi || !rendererRef?.current) return;

    const domElement = rendererRef.current.domElement;
    if (!domElement) return;

    const pointerLockBor = pointerLockMavjudmi(domElement);
    let initialized = false;
    let prevX = 0;
    let prevY = 0;
    let lockTekshirId = null;

    const rejimniYoz = (rejim) => {
      qarashRejimiRef.current = rejim;
      setQarashRejimi((oldingi) => oldingi === rejim ? oldingi : rejim);
    };

    const kirishlarniBoshat = () => {
      keysRef.current = {
        w: false,
        s: false,
        a: false,
        d: false,
        sprint: false,
        crouch: false,
      };
      analogRef.current = { vx: 0, vz: 0, sprint: false };
      velocityRef.current.set(0, 0, 0);
      verticalVelocityRef.current = 0;
      targetEyeHeightRef.current = 1.58;
      quyishBosilganRef.current = false;
      initialized = false;
    };

    const lockniSora = () => {
      if (!fokusFaolRef.current || document.hidden) return;
      if (!pointerLockBor) {
        rejimniYoz("zaxira");
        setQarashXabari("Brauzer erkin qarashni qo'llamaydi — zaxira rejim");
        return;
      }
      rejimniYoz("pointerlock");
      if (document.pointerLockElement === domElement) return;
      if (Date.now() - pointerLockOxirgiChiqishRef.current < 1100) {
        setQarashXabari("Erkin qarash uchun sahnani yana bir marta bosing");
        return;
      }

      try {
        const natija = domElement.requestPointerLock();
        Promise.resolve(natija).catch(() => {
          setQarashXabari("Erkin qarash ulanmagan — sahnani bosing");
        });
        if (lockTekshirId) clearTimeout(lockTekshirId);
        lockTekshirId = setTimeout(() => {
          if (
            fokusFaolRef.current
            && !document.hidden
            && document.pointerLockElement !== domElement
          ) {
            setQarashXabari("Erkin qarash uchun sahnani bosing");
          }
        }, 350);
      } catch {
        setQarashXabari("Erkin qarash ulanmagan — sahnani bosing");
      }
    };

    const handleMouseMove = (e) => {
      if (!fokusFaolRef.current || document.hidden) return;

      let dx = 0;
      let dy = 0;
      const sens = sezgirlikRef.current || 1.0;
      if (document.pointerLockElement === domElement) {
        dx = e.movementX || 0;
        dy = e.movementY || 0;
        rejimniYoz("pointerlock");
      } else if (pointerLockBor) {
        // API bor muhitda clientX zaxirasiga jim o'tilmaydi: ekran chekkasi
        // cheksiz yaw va'dasini buzadi. Qayta ulanish faqat foydalanuvchi bosganda.
        return;
      } else {
        rejimniYoz("zaxira");
        if (!initialized) {
          prevX = e.clientX;
          prevY = e.clientY;
          initialized = true;
          return;
        }
        dx = e.clientX - prevX;
        dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
      }

      const yawFarqi = yawniSiljit(rotationRef.current, dx, sens);
      yawJamiRef.current += Math.abs(yawFarqi);
      rotationRef.current.pitch -= dy * sens * 0.0028;
      rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
    };

    const handleMouseDown = (e) => {
      if (e.button !== 0 || !fokusFaolRef.current || document.hidden) return;
      if (document.pointerLockElement !== domElement) lockniSora();
      qolgaOlYokiQoy("asosiy");
      quyishBosilganRef.current = true;
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        quyishBosilganRef.current = false;
        if (typeof onQuyishToxtat === "function") onQuyishToxtat();
      }
    };

    const handleWheel = (e) => {
      if (fpsQolIdish && fpsQaralganIdish && fokusFaolRef.current) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 5 : -5;
        if (typeof onAniqHajmQuy === "function") onAniqHajmQuy(Math.abs(delta));
      }
    };

    const handlePointerLockChange = () => {
      initialized = false;
      if (document.pointerLockElement === domElement) {
        rejimniYoz("pointerlock");
        setQarashXabari("");
        return;
      }
      pointerLockOxirgiChiqishRef.current = Date.now();
      if (fokusFaolRef.current && !document.hidden && pointerLockBor) {
        setQarashXabari("Erkin qarash uchun sahnani bosing");
      }
    };

    const handlePointerLockError = () => {
      rejimniYoz(pointerLockBor ? "pointerlock" : "zaxira");
      setQarashXabari("Erkin qarash ulanmagan — sahnani bosing");
    };

    const fokusniYoqot = () => {
      fokusFaolRef.current = false;
      kirishlarniBoshat();
      if (document.pointerLockElement === domElement) document.exitPointerLock?.();
      pointerLockOxirgiChiqishRef.current = Date.now();
      setQarashXabari("Sahna faol emas — qaytib, sahnani bosing");
    };

    const fokusniQaytar = () => {
      fokusFaolRef.current = true;
      initialized = false;
      if (pointerLockBor) {
        rejimniYoz("pointerlock");
        setQarashXabari("Erkin qarash uchun sahnani bosing");
      } else {
        rejimniYoz("zaxira");
        setQarashXabari("Brauzer erkin qarashni qo'llamaydi — zaxira rejim");
      }
    };

    const handleVisibility = () => {
      if (document.hidden) fokusniYoqot();
      else fokusniQaytar();
    };

    fokusFaolRef.current = !document.hidden;
    if (pointerLockBor) {
      rejimniYoz("pointerlock");
      if (document.pointerLockElement !== domElement) {
        setQarashXabari("Erkin qarash uchun sahnani bosing");
      }
    } else {
      rejimniYoz("zaxira");
      setQarashXabari("Brauzer erkin qarashni qo'llamaydi — zaxira rejim");
    }

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("pointerlockerror", handlePointerLockError);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", fokusniYoqot);
    window.addEventListener("focus", fokusniQaytar);
    window.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (lockTekshirId) clearTimeout(lockTekshirId);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("pointerlockerror", handlePointerLockError);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", fokusniYoqot);
      window.removeEventListener("focus", fokusniQaytar);
      window.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("wheel", handleWheel);
    };
  }, [
    tayyor,
    yurishRejimi,
    rendererRef,
    qolgaOlYokiQoy,
    onQuyishToxtat,
    onAniqHajmQuy,
    fpsQolIdish,
    fpsQaralganIdish,
  ]);

}
