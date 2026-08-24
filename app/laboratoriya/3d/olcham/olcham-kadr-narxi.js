// Kadr NARXINI o'lchash — vaqt, fragment/geometriya ajratishi.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Ichida React yo'q:
// funksiyalar faqat renderer, sahna va kamerani oladi, hech qanday
// holatga ega emas. Shuning uchun ularni sahifasiz ham sinash mumkin.

import * as THREE from "three";

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
export function narxTaqsimoti(renderer, scene, kamera, composer) {
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

// Supurish narxni O'LCHAMAYDI (24 nuqtaning har biriga ~1 soniya
// qo'shilardi), lekin natija SHAKLI bir xil bo'lishi shart — aks holda
// jadval ustunlari qatorga qarab o'zgarardi.
//
// Nega funksiya: shaklni chaqiruvchi joyda qo'lda yozish
// `narxTaqsimoti` qaytargan obyektning ikkinchi nusxasi bo'lardi va
// yangi maydon qo'shilganda jimgina uzilib qolardi (AGENTS.md 1-band).
export function supurishNarxi() {
  return {
    kadrVaqti: 0,
    kadrVaqtiTarqoq: 0,
    kadrVaqti4x: 0,
    fragment: 0,
    geometriya: 0,
    fragmentUlushi: 0,
    ishonchli: false,
    narxSababi: "supurish",
    pikselNisbati: 0,
  };
}
