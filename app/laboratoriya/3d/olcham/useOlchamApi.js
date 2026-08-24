"use client";

import { useEffect } from "react";

import { rezolyutsiyaSinovi } from "../lib/dinamik-rezolyutsiya.js";
import { PROFIL_NOMLARI } from "../lib/sifat-profili.js";
import { NUQTA_NOMLARI } from "./olcham-nuqtalar.js";

// O'LCHAGICHNING TASHQI ESHIGI — `window.__*` funksiyalari.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Playwright skripti
// sahnaga faqat shu funksiyalar orqali tegadi, ya'ni bu fayl
// asbobning SHARTNOMASI: nomi o'zgarsa, `scripts/lab3d-olcham.js` va
// `scripts/lab3d-ish-vaqti.cjs` jim yiqiladi.
//
// Hammasi bitta effektda qoldi — asl kodda ham shunday edi va
// tozalash (`delete`) ro'yxati bitta joyda turgani ma'qul: ikkiga
// bo'linsa, biri tozalanib ikkinchisi qolib ketishi mumkin.

export function useOlchamApi({
  tayyor,
  param,
  sahnaRef,
  kameraRef,
  rendererRef,
  jihozQosh,
  jihozOlib,
  olchamRef,
  supurishRef,
}) {
  useEffect(() => {
    if (!tayyor || !param) return;
    // BRIF-02 qabul mezoni: 20 marta idish qo'yib/olib tashlanganda
    // `renderer.info.memory` o'smasin.
    //
    // Nega aynan shu sinov: asset geometriyasi KESHDAN keladi va barcha
    // nusxalar orasida ulashiladi. Agar `jihozOlib` uni bo'shatsa,
    // qolgan nusxalar ko'rinmas bo'lardi; agar hech kim bo'shatmasa,
    // har qo'yishda yangi geometriya to'planardi. Ikkala xato ham
    // darrov sezilmaydi — ular 10 daqiqadan keyin tab'ni yiqitadi.
    window.__assetSinovi = async (marta = 20) => {
      const renderer = rendererRef.current;
      const scene = sahnaRef.current;
      const kamera = kameraRef.current;
      if (!renderer || !scene || !kamera) throw new Error("Sahna tayyor emas");

      const oqi = () => ({
        geometriya: renderer.info.memory.geometries,
        tekstura: renderer.info.memory.textures,
      });

      // Isinish: bir marta qo'yib, RENDER QILIB, keyin olib tashlaymiz.
      //
      // Render qilish shart. Asset geometriyasi kesh bilan ulashiladi va
      // GPU ga faqat birinchi chizilganda chiqadi. Render qilmasdan olib
      // tashlasak, u bazaviy o'lchovga tushmay qolardi va keyingi siklda
      // "+1 o'sish" bo'lib ko'rinardi — aslida o'sish emas, bir martalik
      // ajratish.
      const isinish = jihozQosh("stakan");
      renderer.render(scene, kamera);
      if (isinish) jihozOlib(isinish.userData.slotIndex);
      renderer.render(scene, kamera);

      const oldin = oqi();
      const qadamlar = [];
      for (let i = 0; i < marta; i += 1) {
        const g = jihozQosh("stakan");
        if (!g) { qadamlar.push("slot yo'q"); break; }
        renderer.render(scene, kamera);
        const qoyilgan = oqi().geometriya;
        jihozOlib(g.userData.slotIndex);
        renderer.render(scene, kamera);
        qadamlar.push(`${qoyilgan}/${oqi().geometriya}`);
      }
      const keyin = oqi();

      return {
        marta,
        oldin,
        keyin,
        qadamlar,
        geometriyaOsdi: keyin.geometriya - oldin.geometriya,
        teksturaOsdi: keyin.tekstura - oldin.tekstura,
      };
    };
    // BRIF-03 — boshqaruvchining sun'iy sinovi. GPU siz ishlaydi,
    // shuning uchun uni o'lchagich har yugurishda chaqiradi va
    // yiqilsa butun o'lchov exit 1 beradi.
    window.__rezolyutsiyaSinovi = () => rezolyutsiyaSinovi();
    // Boshqaruvchi qarori rendererga haqiqatan yetib borganini o'qish.
    window.__pikselNisbati = () => rendererRef.current?.getPixelRatio() ?? 0;
    window.__olcham = (x) => olchamRef.current(x);
    window.__supurish = (x) => supurishRef.current(x);
    window.__olchamSozlama = {
      profillar: PROFIL_NOMLARI,
      nuqtalar: NUQTA_NOMLARI,
      joriyProfil: param.profil,
    };
    return () => {
      if (window.__assetSinovi) delete window.__assetSinovi;
      if (window.__rezolyutsiyaSinovi) delete window.__rezolyutsiyaSinovi;
      if (window.__pikselNisbati) delete window.__pikselNisbati;
      if (window.__olcham) delete window.__olcham;
      if (window.__supurish) delete window.__supurish;
      if (window.__olchamSozlama) delete window.__olchamSozlama;
    };
  }, [tayyor, param]);
}
