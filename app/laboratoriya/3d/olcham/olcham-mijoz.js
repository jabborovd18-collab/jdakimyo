"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSahna } from "../hooks/useSahna.js";
import {
  PROFIL_NOMLARI,
  SUKUT_PROFIL,
  profilniOl,
} from "../lib/sifat-profili.js";
import { kadrGistogrammasi, kadrQorami } from "./olcham-hisob.js";
import { yorliqlarniYangila } from "../lib/yorliqlar.js";
import { pointerLockMavjudmi, yawniSiljit } from "../lib/qarash-boshqaruvi.js";
import { HIMOYALANGAN_NOMLAR } from "../lib/geometriya-birlashtirish.js";
import { rezolyutsiyaSinovi } from "../lib/dinamik-rezolyutsiya.js";
import { assetHolati } from "../lib/asset-yuklovchi.js";
import {
  NUQTA_NOMLARI,
  nuqtaniOl,
  supurishNuqtalariniYarat,
} from "./olcham-nuqtalar.js";

function parametrlarniOl() {
  const q = new URLSearchParams(window.location.search);
  const profil = profilniOl(q.get("profil") || SUKUT_PROFIL).nom;
  const nuqta = q.get("nuqta") || "stol";
  // BRIF-03 2-mezon. O'lchov paytida DRS o'chiq bo'lishi SHART, lekin
  // ulash haqiqatan ishlashini ham ko'rsatish kerak. `?drs=1` uni
  // ataylab yoqadi va shu sahifa ideal sinov maydoni: dasturiy
  // renderer sekin, ya'ni kadr nishondan ancha uzoq va boshqaruvchi
  // rezolyutsiyani pastki chegaraga tushirishi SHART.
  //
  // Oddiy o'lchov yo'liga tegmaydi: parametr berilmasa DRS o'chiq.
  const drs = q.get("drs") === "1";
  return { profil, nuqta, drs };
}

function kameraniQoy(kamera, controls, nuqta) {
  kamera.up.set(nuqta.up[0], nuqta.up[1], nuqta.up[2]);
  kamera.position.set(nuqta.kamera[0], nuqta.kamera[1], nuqta.kamera[2]);
  kamera.lookAt(nuqta.nishon[0], nuqta.nishon[1], nuqta.nishon[2]);
  kamera.updateMatrixWorld();
  if (controls) {
    controls.enabled = false;
    controls.target.set(nuqta.nishon[0], nuqta.nishon[1], nuqta.nishon[2]);
  }
}

function kadrPikseliniOqi(renderer) {
  const canvas = renderer.domElement;
  const w = canvas.width;
  const h = canvas.height;
  if (w < 2 || h < 2) {
    throw new Error(`Canvas o'lchami yaroqsiz: ${w}×${h}`);
  }
  const gl = renderer.getContext();
  if (!gl || gl.isContextLost?.()) {
    throw new Error("WebGL kontekst yo'q yoki yo'qolgan");
  }
  const pixels = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return { pixels, w, h, gl };
}

function rendererNominiOl(gl) {
  const kengaytma = gl.getExtension("WEBGL_debug_renderer_info");
  if (kengaytma) {
    const nom = gl.getParameter(kengaytma.UNMASKED_RENDERER_WEBGL);
    if (nom) return String(nom);
  }
  return String(gl.getParameter(gl.RENDERER) || "Noma'lum WebGL renderer");
}

// BRIF-07 — nishon tanlay oladigan ob'ektlar soni.
// useYurish.js ota-zanjir bo'ylab `userData.kalit`/`tanlanadi` ni qidiradi.
function interaktivlarniSana(scene) {
  let soni = 0;
  scene.traverse((o) => {
    if (o.userData?.kalit || o.userData?.tanlanadi) soni += 1;
  });
  return soni;
}

// BRIF-07 — nomli stansiyalar joyidami VA ichida mesh qoldimi.
//
// NEGA FAQAT SON YETMAYDI: birlashtirish guruhning O'ZINI qoldirib,
// ichidagi meshlarni tortib olishi mumkin. Shunda `getObjectByName`
// baribir tugun qaytaradi va har qanday "bormi?" sanog'i o'tadi —
// stansiya esa ko'rinmay qoladi. Shuning uchun mesh sanaladi.
//
// Ro'yxat `geometriya-birlashtirish.js` dan keladi: birlashtiruvchi
// himoyalaydi, o'lchagich tekshiradi — ikkalasi bitta manbadan
// (AGENTS.md 1-band).
function stansiyaMeshlariniSana(scene) {
  const natija = {};
  for (const nom of HIMOYALANGAN_NOMLAR) {
    const tugun = scene.getObjectByName(nom);
    let mesh = 0;
    if (tugun) {
      tugun.traverse((o) => {
        if (o.isMesh) mesh += 1;
      });
    }
    natija[nom] = mesh;
  }
  return natija;
}

// ---- KADR VAQTINI O'LCHASH ----
//
// NEGA FPS YETMAYDI. 2026-08-22 da aniqlandi: telefon profilida yuk
// ikki baravar oshdi (chaqiruv 137 -> 190, uchburchak 10686 -> 22316),
// FPS esa O'SDI (44.3 -> 45.9). Bir xil holatdagi o'lchovlar tarqoqligi
// 49%. Sabab — FPS `requestAnimationFrame` oralig'idan hisoblanadi, u
// esa vsync, brauzer rejalashtiruvchisi va fon yukiga bog'liq;
// sahnaning og'irligiga emas.
//
// Ya'ni FPS haqiqiy qurilma bilan taqqoslanmasligi yetmagandek, u
// O'ZI BILAN HAM taqqoslanmaydi. Shunday son bilan hech qanday
// optimallashtirishni tekshirib bo'lmaydi.
//
// O'rniga: kadrni QO'LDA chizamiz va `gl.finish()` bilan GPU tugashini
// kutamiz. Median olinadi — bitta rejalashtiruv sakrashi natijani
// buzmasin.

function bittaKadr(renderer, scene, kamera, composer) {
  if (composer) composer.render();
  else renderer.render(scene, kamera);
}

/**
 * Kadr vaqtini GURUH bilan o'lchaydi.
 *
 * Nega bittalab emas: bitta kadr 0.2-4 ms, `performance.now()` esa
 * brauzerda Spectre himoyasi sabab ~100 mks gacha yaxlitlanadi va har
 * chaqiruvda rejalashtiruv sakrashi qo'shiladi. Natijada bittalab
 * o'lchovning tarqoqligi 100-300% chiqdi (2026-08-22 da o'lchandi) —
 * ya'ni son ishlatib bo'lmasdi.
 *
 * Guruh bo'lib o'lchaganda taymer xatosi guruh kattaligiga bo'linadi
 * va quvur to'la ishlaydi — bu haqiqiy yurish holatiga ham yaqinroq.
 */
function kadrVaqtiniOlch(renderer, scene, kamera, composer, guruhSoni, guruhKattaligi) {
  const gl = renderer.getContext();
  // Isinish: birinchi kadrlar shader kompilyatsiyasi, tekstura yuklash
  // va bufer qayta ajratishni o'z ichiga oladi — o'lchovga tegishli emas.
  for (let i = 0; i < 5; i += 1) bittaKadr(renderer, scene, kamera, composer);
  gl.finish();

  const namuna = [];
  for (let g = 0; g < guruhSoni; g += 1) {
    const t0 = performance.now();
    for (let i = 0; i < guruhKattaligi; i += 1) {
      bittaKadr(renderer, scene, kamera, composer);
    }
    gl.finish();
    namuna.push((performance.now() - t0) / guruhKattaligi);
  }
  namuna.sort((a, b) => a - b);
  const engPast = namuna[0];
  const median = namuna[Math.floor(namuna.length / 2)];
  return {
    // ASOSIY QIYMAT — MINIMUM, median emas.
    //
    // Vaqt o'lchovida shovqin faqat vaqt QO'SHADI: boshqa protsess,
    // rejalashtiruv, termal cheklov. Hech qanday shovqin kadrni
    // haqiqiy narxidan tezroq qila olmaydi. Shuning uchun eng past
    // namuna haqiqiy narxga eng yaqin baho.
    qiymat: engPast,
    median,
    engBaland: namuna[namuna.length - 1],
    // Tarqoqlik — muhit qanchalik shovqinli ekanini KO'RSATADI.
    // U natijani rad etmaydi (minimum shovqinga chidamli), lekin
    // jadvalda ko'rinadi: 2026-08-22 da aynan jim shovqin FPS ni
    // ishonchli qilib ko'rsatgan edi.
    tarqoqlik: engPast > 0 ? (namuna[namuna.length - 1] - engPast) / engPast : 0,
  };
}

/**
 * Kadr narxini GEOMETRIYA va FRAGMENT qismlariga ajratadi.
 *
 * Usul: bir xil kadr ikki xil rezolyutsiyada chiziladi. Geometriya
 * narxi piksel soniga bog'liq EMAS, fragment narxi esa to'g'ri
 * proporsional. Shundan:
 *
 *   vaqt(1x) = G + F
 *   vaqt(2x chiziqli = 4x piksel) = G + 4F
 *   => F = (vaqt4 - vaqt1) / 3,   G = vaqt1 - F
 *
 * Nega kerak: 0.6 (pishirilgan yorug'lik) ning butun asosi fragment
 * narxi — chiroq soni har piksel uchun to'lanadi. Bu ajratishsiz
 * "lightmap yordam berdimi" degan savolga javob yo'q. Xuddi shu son
 * shaffoflik va overdraw o'zgarishini ham ko'rsatadi.
 */
function narxTaqsimoti(renderer, scene, kamera, composer) {
  const eskiNisbat = renderer.getPixelRatio();
  const olcham = new THREE.Vector2();
  renderer.getSize(olcham);

  const bir = kadrVaqtiniOlch(renderer, scene, kamera, composer, 7, 10);
  const piksel1x = renderer.domElement.width * renderer.domElement.height;

  // QIMMAT KADRDA 4x ZOND O'TKAZIB YUBORILADI.
  //
  // Zond kadrni 4 barobar qimmatlashtiradi va 20 marta chizadi. Kadr
  // allaqachon 12 ms bo'lsa, bu bitta kamera nuqtasiga bir daqiqagacha
  // qo'shadi. `ilova` profilida o'lchov shu sababdan tugamay qoldi
  // (2026-08-22).
  //
  // Bundan tashqari qimmat profilda zond baribir foyda bermadi:
  // desktopda 4x/1x nisbati 1.17 chiqdi va ajratish rad etildi. Ya'ni
  // biz vaqtni "—" natijaga sarflardik.
  if (bir.qiymat > 12) {
    return {
      kadrVaqti: bir.qiymat,
      kadrVaqtiTarqoq: bir.tarqoqlik,
      kadrVaqti4x: 0,
      fragment: 0,
      geometriya: 0,
      fragmentUlushi: 0,
      ishonchli: false,
      narxSababi: "kadr qimmat (>12 ms) — 4x zond o'tkazib yuborildi",
      pikselNisbati: 0,
    };
  }

  renderer.setPixelRatio(eskiNisbat * 2);
  renderer.setSize(olcham.x, olcham.y, false);
  if (composer) composer.setSize(olcham.x * eskiNisbat * 2, olcham.y * eskiNisbat * 2);
  const piksel4x = renderer.domElement.width * renderer.domElement.height;
  const tort = kadrVaqtiniOlch(renderer, scene, kamera, composer, 5, 4);

  renderer.setPixelRatio(eskiNisbat);
  renderer.setSize(olcham.x, olcham.y, false);
  if (composer) composer.setSize(olcham.x * eskiNisbat, olcham.y * eskiNisbat);
  bittaKadr(renderer, scene, kamera, composer);

  // Ajratish faqat o'lchov ISHONCHLI bo'lganda ma'noli. Ikki shart:
  //   - har ikki o'lchovning tarqoqligi 40% dan kichik;
  //   - 4x o'lchov 1x dan katta (aks holda shovqin signaldan katta).
  // Shart buzilsa `ishonchli: false` qaytadi va son ishlatilmaydi.
  // Birinchi shart — REZOLYUTSIYA HAQIQATAN O'ZGARDIMI. Agar bufer
  // kattalashmasa, ikkala o'lchov bir xil kadrni o'lchagan va farq
  // faqat shovqin bo'ladi. Buni tekshirmaslik jim yolg'onga olib
  // kelardi (bugungi FPS saboqi).
  const nisbat = piksel1x > 0 ? piksel4x / piksel1x : 0;
  const rezolyutsiyaOzgardi = nisbat > 3.5 && nisbat < 4.5;
  // Ikkinchi shart — kadr O'LCHASHGA ARZIYDIGAN darajada qimmat
  // bo'lishi. 0.5 ms dan arzon kadrda `performance.now()` ning
  // yaxlitlanishi (~0.1 ms) natijaning katta qismini tashkil qiladi.
  // O'lchandi: `pol` va `ship` nuqtalarida (0.15-0.2 ms) ulush uch
  // yugurishda 39-229% sakradi, `stol` va `xona` da esa (1-3 ms)
  // 7-19% ichida qoldi.
  //
  // Uchinchi shart — 4x kadr sezilarli qimmatroq bo'lishi. Aks holda
  // fragment ulushi shovqin ichida yo'qolgan va ajratish ma'nosiz.
  const olchashgaArziydi = bir.qiymat >= 0.5;
  const ishonchli = rezolyutsiyaOzgardi && olchashgaArziydi
    && tort.qiymat > bir.qiymat * 1.2;
  // Asbob nima uchun rad etganini AYTADI. "—" ning sababsizi keyingi
  // o'quvchini taxmin qilishga majbur qilardi.
  const sabab = ishonchli
    ? ""
    : !rezolyutsiyaOzgardi
      ? `bufer 4 barobar kattalashmadi (nisbat ${nisbat.toFixed(2)})`
      : !olchashgaArziydi
        ? `kadr arzon (${bir.qiymat.toFixed(2)} ms < 0.5) — taymer aniqligi yetmaydi`
        : `4x kadr 1x dan atigi ${(tort.qiymat / bir.qiymat).toFixed(2)} barobar qimmat`;
  const fragment = ishonchli ? (tort.qiymat - bir.qiymat) / 3 : 0;
  const geometriya = ishonchli ? Math.max(0, bir.qiymat - fragment) : 0;
  return {
    kadrVaqti: bir.qiymat,
    kadrVaqtiTarqoq: bir.tarqoqlik,
    kadrVaqti4x: tort.qiymat,
    fragment,
    geometriya,
    // FRAGMENT ULUSHI — kadr vaqtining necha ulushi pikselga ketadi.
    //
    // Nega aynan shu son asosiy: mutlaq millisekund mashina tezligiga
    // bog'liq (bir xil sahna band mashinada ikki barobar sekin
    // o'lchanadi — 2026-08-22 da ikki ketma-ket yugurish 47-141% farq
    // berdi). Ulush esa bo'linma bo'lgani uchun mashina tezligi
    // qisqaradi va oldin/keyin taqqoslash ma'noli bo'ladi.
    //
    // 0.6 (pishirilgan yorug'lik) ning mezoni aynan shu bo'lishi
    // kerak: chiroq soni kamayganda fragment ULUSHI tushishi shart.
    fragmentUlushi: ishonchli && bir.qiymat > 0 ? fragment / bir.qiymat : 0,
    ishonchli,
    narxSababi: sabab,
    pikselNisbati: nisbat,
  };
}

function chiroqlarniSana(scene) {
  let soni = 0;
  scene.traverse((obyekt) => {
    if (obyekt instanceof THREE.Light) soni += 1;
  });
  return soni;
}

function kadrRasminiYarat(pixels, width, height) {
  const rasmW = 640;
  const rasmH = 360;
  const kichik = new Uint8ClampedArray(rasmW * rasmH * 4);

  // readPixels pastki chapdan boshlanadi. Canvas ImageData esa yuqori
  // chapdan: shu yerda aylantirilmasa ko'rik PNG'i teskari chiqadi.
  for (let y = 0; y < rasmH; y += 1) {
    const srcY = height - 1 - Math.min(height - 1, Math.floor((y + 0.5) * height / rasmH));
    for (let x = 0; x < rasmW; x += 1) {
      const srcX = Math.min(width - 1, Math.floor((x + 0.5) * width / rasmW));
      const src = (srcY * width + srcX) * 4;
      const dst = (y * rasmW + x) * 4;
      kichik[dst] = pixels[src];
      kichik[dst + 1] = pixels[src + 1];
      kichik[dst + 2] = pixels[src + 2];
      kichik[dst + 3] = pixels[src + 3];
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = rasmW;
  canvas.height = rasmH;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(new ImageData(kichik, rasmW, rasmH), 0, 0);
  return canvas.toDataURL("image/png");
}

function kadrlarniKut(fpsRef, birinchi) {
  const boshlangich = fpsRef.current.kadr;
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const kut = () => {
      const otdi = fpsRef.current.kadr - boshlangich;
      const vaqt = performance.now() - t0;
      const birinchiTayyor = otdi >= 60 || (otdi >= 8 && vaqt >= 2000);
      if ((birinchi && birinchiTayyor) || (!birinchi && otdi >= 2)) {
        resolve();
        return;
      }
      if (vaqt > 90000) {
        reject(new Error(`Sahna barqarorlashmadi (otdi=${otdi})`));
        return;
      }
      requestAnimationFrame(kut);
    };
    kut();
  });
}

export default function OlchamMijoz() {
  const [param, setParam] = useState(null);
  const konteynerRef = useRef(null);
  const fpsRef = useRef({ namuna: [], oxirgi: 0, kadr: 0 });
  const ilkOlchovRef = useRef(true);
  const olchamRef = useRef(null);
  const supurishRef = useRef(null);
  const qarashSinoviRef = useRef({
    rejim: "pointerlock",
    yaw: 0,
    yawJami: 0,
    faol: true,
  });

  useEffect(() => {
    setParam(parametrlarniOl());
  }, []);

  const {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    composerRef,
    profilRef,
    yorliqHolatiRef,
    birlashuvRef,
    jihozQosh,
    jihozOlib,
  } = useSahna(
    konteynerRef,
    !param,
    {
      olcham: true,
      profil: param?.profil || SUKUT_PROFIL,
      yorliqlarYoqilgan: true,
      drsMajburiy: !!param?.drs,
    },
  );

  useEffect(() => {
    if (!tayyor || !kameraRef.current || !param) return;
    kameraniQoy(kameraRef.current, controlsRef.current, nuqtaniOl(param.nuqta));
  }, [tayyor, param, kameraRef, controlsRef]);

  useEffect(() => {
    if (!tayyor) return;
    let id = 0;
    const tik = (t) => {
      const s = fpsRef.current;
      if (s.oxirgi > 0) {
        const dt = t - s.oxirgi;
        if (dt > 0) {
          s.namuna.push(1000 / dt);
          if (s.namuna.length > 120) s.namuna.shift();
        }
      }
      s.oxirgi = t;
      s.kadr += 1;
      id = requestAnimationFrame(tik);
    };
    id = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(id);
  }, [tayyor]);

  useEffect(() => {
    if (!tayyor || !rendererRef.current) return;
    const sinov = qarashSinoviRef.current;
    sinov.rejim = pointerLockMavjudmi(rendererRef.current.domElement)
      ? "pointerlock"
      : "zaxira";
    sinov.faol = !document.hidden;

    const fokusYoqotildi = () => { sinov.faol = false; };
    const fokusQaytdi = () => { sinov.faol = true; };
    const visibility = () => { sinov.faol = !document.hidden; };

    window.__qarashSinovi = (piksel) => {
      const oldin = sinov.yaw;
      let farq = 0;
      if (sinov.faol) {
        farq = yawniSiljit(sinov, Number(piksel) || 0, 1);
        sinov.yawJami += Math.abs(farq);
      }
      return {
        qarashRejimi: sinov.rejim,
        oldin,
        keyin: sinov.yaw,
        farq,
        yawJami: sinov.yawJami,
        faol: sinov.faol,
      };
    };

    window.addEventListener("blur", fokusYoqotildi);
    window.addEventListener("focus", fokusQaytdi);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", fokusYoqotildi);
      window.removeEventListener("focus", fokusQaytdi);
      document.removeEventListener("visibilitychange", visibility);
      if (window.__qarashSinovi) delete window.__qarashSinovi;
    };
  }, [tayyor, rendererRef]);

  const olcham = useCallback(async (ozgartirish = {}) => {
    const renderer = rendererRef.current;
    const kamera = kameraRef.current;
    const scene = sahnaRef.current;
    const profil = profilRef.current;
    if (!renderer || !kamera || !scene || !profil || !param) {
      throw new Error("Sahna hali tayyor emas");
    }

    const nuqtaNom = ozgartirish.nuqta || param.nuqta;
    const kameraNuqta = ozgartirish.kameraNuqta || nuqtaniOl(nuqtaNom);
    kameraniQoy(kamera, controlsRef.current, kameraNuqta);

    // Birinchi kadr sahna yukini kutadi. Keyingi nomli kamerada ikki kadr
    // matritsa almashganini tasdiqlaydi; supurish esa har namunani o'zi
    // sinxron render qiladi, aks holda 24 nuqta asossiz sekinlashadi.
    if (!ozgartirish.tez) {
      await kadrlarniKut(fpsRef, ilkOlchovRef.current);
      ilkOlchovRef.current = false;
    }

    // Kamera o'zgargach label siklining navbatdagi 5-kadrini kutmaymiz:
    // bu qator aynan o'lchanayotgan kamera uchun collision holatini oladi.
    const yorliqHolati = yorliqlarniYangila(scene, kamera, renderer, true);
    yorliqHolatiRef.current = yorliqHolati;

    // autoReset o'chiq: kompozitor bir necha pass qiladi, oxirgisi
    // fullscreen quad — yig'indini olamiz, so'ng avvalgi holatni qaytaramiz.
    const eskiAutoReset = renderer.info.autoReset;
    renderer.info.autoReset = false;
    renderer.info.reset();
    if (composerRef.current) composerRef.current.render();
    else renderer.render(scene, kamera);
    const uchburchak = renderer.info.render.triangles;
    const chaqiruv = renderer.info.render.calls;
    const teksturaXotira = renderer.info.memory.textures;
    renderer.info.autoReset = eskiAutoReset;

    const { pixels, w, h, gl } = kadrPikseliniOqi(renderer);
    if (kadrQorami(pixels)) {
      throw new Error("Kadr qora — WebGL buferi o'qilmadi");
    }

    const gist = kadrGistogrammasi(pixels, w, h, { origin: "bottom-left" });

    // Kadr narxi — piksel o'qilgandan KEYIN, chunki o'lchov vaqtincha
    // bufer o'lchamini o'zgartiradi. Supurishda o'tkazib yuboriladi:
    // 24 nuqtaning har birida ~1 soniya qo'shilardi va supurishning
    // vazifasi qamrov, narx emas.
    const narx = ozgartirish.tez
      ? { kadrVaqti: 0, kadrVaqtiTarqoq: 0, kadrVaqti4x: 0, fragment: 0, geometriya: 0, fragmentUlushi: 0, ishonchli: false, narxSababi: "supurish", pikselNisbati: 0 }
      : narxTaqsimoti(renderer, scene, kamera, composerRef.current);

    const namuna = fpsRef.current.namuna;
    const fps = namuna.length
      ? namuna.reduce((a, b) => a + b, 0) / namuna.length
      : 0;
    const chiroqSoni = chiroqlarniSana(scene);
    // BRIF-07 — birlashtirish interaktivlikni yeb qo'ymaganini ikki
    // xil tomondan tekshiradi: `userData` bilan tanlanadiganlar soni va
    // nomli stansiyalarning mesh qoldig'i.
    const interaktivSoni = interaktivlarniSana(scene);
    const stansiyaMeshlari = stansiyaMeshlariniSana(scene);
    const qarashSinovi = qarashSinoviRef.current;

    const natija = {
      profil: profil.nom,
      qarashRejimi: qarashSinovi.rejim,
      yawJami: qarashSinovi.yawJami,
      nuqta: nuqtaNom,
      chiroqBudjeti: profil.chiroqBudjeti,
      chiroqBudjetiBuzildi: chiroqSoni > profil.chiroqBudjeti,
      kuygan: gist.kuygan,
      qora: gist.qora,
      ortacha: gist.ortacha,
      p50: gist.p50,
      p95: gist.p95,
      yuqoriSoha: gist.yuqoriSoha,
      quyiSoha: gist.quyiSoha,
      // FPS SAQLANADI, lekin unga tayanilmaydi — u sahna og'irligini
      // sezmaydi (yuqoridagi izoh). Haqiqiy o'lchov `kadrVaqti`.
      fps,
      kadrVaqti: narx.kadrVaqti,
      kadrVaqtiTarqoq: narx.kadrVaqtiTarqoq,
      kadrVaqti4x: narx.kadrVaqti4x,
      fragmentNarxi: narx.fragment,
      geometriyaNarxi: narx.geometriya,
      fragmentUlushi: narx.fragmentUlushi,
      narxIshonchli: narx.ishonchli,
      narxSababi: narx.narxSababi,
      narxPikselNisbati: narx.pikselNisbati,
      uchburchak,
      chaqiruv,
      teksturaXotira,
      renderer: rendererNominiOl(gl),
      chiroqSoni,
      // BRIF-03 — o'lchov paytida rezolyutsiya qotib turishi shart.
      // `kutilgan` profil va ekran zichligidan hisoblanadi; ikkisi teng
      // bo'lmasa DRS o'lchagichda ishlab ketgan degani.
      pikselNisbati: renderer.getPixelRatio(),
      pikselNisbatiKutilgan: Math.min(window.devicePixelRatio || 1, profil.pikselNisbati),
      interaktivSoni,
      stansiyaMeshlari,
      // BRIF-07 dalili: nechta mesh birlashdi, nechta guruh hosil bo'ldi,
      // nechta tanlanadigan shox chetlab o'tildi.
      birlashuv: { ...(birlashuvRef?.current || {}) },
      // BRIF-02 dalili: nechta asset so'raldi, nechtasi keldi, nechtasi
      // xato berdi. `xato > 0` bo'lsa sahna protsedural zaxirada.
      asset: assetHolati(),
      yorliqSoni: yorliqHolati.yorliqSoni,
      yorliqToqnashuvi: yorliqHolati.yorliqToqnashuvi,
    };
    if (ozgartirish.rasm) {
      natija.rasm = kadrRasminiYarat(pixels, w, h);
    }
    return natija;
  }, [
    param,
    rendererRef,
    sahnaRef,
    kameraRef,
    controlsRef,
    composerRef,
    profilRef,
    yorliqHolatiRef,
    qarashSinoviRef,
  ]);

  olchamRef.current = olcham;

  const supurish = useCallback(async (sozlama = {}) => {
    const { urug, nuqtalar } = supurishNuqtalariniYarat(sozlama.urug);
    let engYomon = null;
    let engKopYorliq = 0;
    let engKopToqnashuv = 0;

    for (const kameraNuqta of nuqtalar) {
      const natija = await olchamRef.current({
        nuqta: "sweep",
        kameraNuqta,
        tez: true,
      });
      engKopYorliq = Math.max(engKopYorliq, natija.yorliqSoni);
      engKopToqnashuv = Math.max(
        engKopToqnashuv,
        natija.yorliqToqnashuvi,
      );
      if (!engYomon || natija.kuygan > engYomon.natija.kuygan) {
        engYomon = { natija, kameraNuqta };
      }
    }

    if (!engYomon) throw new Error("Supurish nuqtasi yaratilmagan");

    // Sikl oxirida kamera boshqa joyda qoladi. Eng yomon joyni yana bir
    // marta chizib, aynan o'sha joy PNG'ga tushishini kafolatlaymiz.
    const rasmli = await olchamRef.current({
      nuqta: "sweep",
      kameraNuqta: engYomon.kameraNuqta,
      tez: true,
      rasm: true,
    });

    return {
      ...engYomon.natija,
      sweepEngYomon: engYomon.natija.kuygan,
      sweepJoy: engYomon.kameraNuqta.joy,
      // Sweep satrida label maydonlari 24 nuqtaning maksimumi: kuyish-worst
      // kamera label-worst kamerani yashirib qo'ymasligi kerak.
      yorliqSoni: engKopYorliq,
      yorliqToqnashuvi: engKopToqnashuv,
      sweepUrug: urug,
      sweepNamunaSoni: nuqtalar.length,
      rasm: rasmli.rasm,
    };
  }, []);

  supurishRef.current = supurish;

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

  return (
    <div
      ref={konteynerRef}
      data-olcham="1"
      style={{ position: "fixed", inset: 0, background: "#000" }}
    />
  );
}
