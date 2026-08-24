// Animatsiya SIKLI va uning atrofi — o'lcham kuzatuvchisi, sahifa
// ko'rinishi, yorliq jadvali va dinamik rezolyutsiya.
//
// `useSahna.js` dan ajratildi (BRIF-05).
//
// NEGA BIR FAYLDA: bularning hammasi bitta savolga javob beradi —
// KEYINGI KADR qanday chiziladi. Resize kadr o'lchamini, visibility
// kadr chizilishini, DRS esa piksel zichligini boshqaradi. Ular
// ajratilganda har biri o'z tozalash yo'lini talab qilardi va
// birortasi unutilsa, sahifa fonda ham rAF yig'ib turaverardi.
//
// Sahna MAZMUNIGA bog'liq yagona qism — alanga va pufakchalar —
// `sahna-jonli-effektlar.js` ga chiqarilgan.

import { jonliEffektlarniYangila } from "./sahna-jonli-effektlar.js";
import { keyingiNisbat, holatYarat } from "./dinamik-rezolyutsiya.js";
import { YORLIQ_TEKSHIRISH_QADAMI, yorliqlarniYangila } from "./yorliqlar.js";

export function siklniBoshla({
  konteyner,
  scene,
  kamera,
  renderer,
  composer,
  controls,
  profil,
  olcham = false,
  drsMajburiy = false,
  yorliqlarYoqilganRef,
  yorliqHolatiRef,
}) {
  let kadrId = null;

  // 8. ResizeObserver (window.resize emas, chunki panel yig'ilganda ham canvas o'zgaradi)
  const handleResize = () => {
    if (!konteyner || !renderer || !kamera) return;
    const w = konteyner.clientWidth;
    const h = Math.max(1, konteyner.clientHeight);
    kamera.aspect = w / h;
    kamera.updateProjectionMatrix();
    renderer.setSize(w, h);
    // Kompozitor o'lchami ham yangilanadi, aks holda bloom yorilib ketadi.
    if (composer) composer.setSize(w, h);
  };

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  resizeObserver.observe(konteyner);

  // 9. Sahifa fonga o'tsa render to'xtashi uchun visibilitychange
  let faolRender = true;
  const handleVisibility = () => {
    faolRender = !document.hidden;
  };
  document.addEventListener("visibilitychange", handleVisibility);

  // Yorliq collision hisobi renderdan arzonroq bo'lsa ham har kadrda
  // takrorlanmaydi. Kamera/idish harakati uchun 5-kadr yetarli.
  let yorliqKadri = 0;
  yorliqHolatiRef.current = yorliqlarniYangila(
    scene,
    kamera,
    renderer,
    yorliqlarYoqilganRef.current,
  );

  // BRIF-03 — dinamik rezolyutsiya holati.
  //
  // O'LCHAGICHDA O'CHIQ (`olchamRef`). Sabab: o'lchagichning butun
  // vazifasi oldin/keyin taqqoslash. Rezolyutsiya o'lchov paytida
  // o'zgarsa, har qator boshqa sharoitda o'lchanadi va taqqoslash
  // ma'nosini yo'qotadi.
  //
  // Yuqori chegara ekranning haqiqiy piksel zichligidan oshmaydi —
  // undan yuqorida chizish ko'rinishga hech narsa qo'shmaydi.
  let drsHolat = olcham && !drsMajburiy
    ? null
    : holatYarat(
        renderer.getPixelRatio(),
        {
          past: profil.pikselOraligi.past,
          yuqori: Math.min(window.devicePixelRatio || 1, profil.pikselOraligi.yuqori),
        },
        profil.nishonKadrVaqti,
      );
  let drsOxirgiKadr = 0;

  // 10. Animatsiya sikli
  const animate = () => {
    kadrId = requestAnimationFrame(animate);
    if (!faolRender) return;
    yorliqKadri += 1;
    if (yorliqKadri % YORLIQ_TEKSHIRISH_QADAMI === 0) {
      yorliqHolatiRef.current = yorliqlarniYangila(
        scene,
        kamera,
        renderer,
        yorliqlarYoqilganRef.current,
      );
    }
    if (controls.enabled) {
      controls.update();
    }

    jonliEffektlarniYangila(scene);

    // BRIF-03 — kadr oralig'ini boshqaruvchiga beramiz.
    //
    // Signal aynan rAF oralig'i: DRS foydalanuvchi KO'RAYOTGAN kadr
    // silliqmi degan savolga javob beradi. (O'lchagich boshqa savolga
    // javob beradi va unga `gl.finish()` bilan olingan aniq vaqt
    // kerak — `OLCHOV.md`. Ikkalasi bir-birining o'rnini bosmaydi.)
    if (drsHolat) {
      const hozir = performance.now();
      if (drsOxirgiKadr > 0) {
        drsHolat = keyingiNisbat(drsHolat, hozir - drsOxirgiKadr, hozir);
        if (drsHolat.ozgardi) {
          const quti = konteyner;
          renderer.setPixelRatio(drsHolat.nisbat);
          if (quti) {
            const w = quti.clientWidth;
            const h = Math.max(1, quti.clientHeight);
            renderer.setSize(w, h);
            if (composer) composer.setSize(w, h);
          }
          if (process.env.NODE_ENV !== "production") {
            console.info(`[DRS] pikselNisbati -> ${drsHolat.nisbat}`);
          }
        }
      }
      drsOxirgiKadr = hozir;
    }

    // Bloom yoqilgan bo'lsa kompozitor chizadi, aks holda oddiy render.
    if (composer) composer.render();
    else renderer.render(scene, kamera);
  };
  animate();

  // Siklni to'xtatish HOOKNING ishi emas: rAF, kuzatuvchi va hodisa
  // shu yerda tug'ilgan, demak shu yerda o'ladi. Hook faqat chaqiradi.
  const toxtat = () => {
    if (kadrId) cancelAnimationFrame(kadrId);
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
  };

  return { toxtat };
}
