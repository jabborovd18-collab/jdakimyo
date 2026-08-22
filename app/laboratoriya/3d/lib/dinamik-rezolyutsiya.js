// app/laboratoriya/3d/lib/dinamik-rezolyutsiya.js
//
// BRIF-03 — dinamik rezolyutsiya (DRS).
//
// Sifat profili bir marta, sahna qurilishida tanlanadi va shundan
// keyin o'zgarmaydi. Ya'ni telefon qiynalsa hech narsa yengillashmaydi,
// kuchli kompyuterda esa rezolyutsiya 1.5 da qotib turadi. Egasi
// 2026-08-22 da telefonda sekinlashuvni xabar qildi.
//
// Bu modul kadr vaqtini kuzatib rezolyutsiyani bir qadamdan
// o'zgartiradi. Profil ALMASHTIRILMAYDI — profil almashishi sahnani
// qayta qurishga va ko'rinadigan sakrashga olib keladi.
//
// SIGNAL HAQIDA. `OLCHOV.md` FPS ga ishonmaslikni aytadi va bu to'g'ri:
// o'lchagich ikki SAHNANI taqqoslaydi va unga `gl.finish()` bilan
// olingan aniq vaqt kerak. DRS esa boshqa savolga javob beradi —
// foydalanuvchi ko'rayotgan kadr silliqmi? Aynan shuni kadrlar
// orasidagi vaqt bildiradi. Har biri o'z joyida to'g'ri; ikkalasi
// bir-birining o'rnini bosmaydi.

export const DRS = Object.freeze({
  // Qaror bir kadrdan emas, OYNA medianasidan chiqadi. Bitta sekin
  // kadr (GC, tekstura yuklash) rezolyutsiyani tushirmasligi kerak.
  oyna: 30,
  // Oyna FAQAT kadr soni bilan o'lchanmaydi — vaqt bilan ham.
  //
  // Nega: 30 kadrli oyna 60 FPS da yarim soniya, 10 FPS da esa UCH
  // soniya davom etadi. Ya'ni qurilma qanchalik qiynalsa, boshqaruvchi
  // shunchalik sekin yordam berardi — aynan teskarisi kerak.
  //
  // O'lchandi (telefon profili, 10 soniya): 15 FPS da nisbat 0.6 ga
  // tushardi, 10 FPS da esa atigi 0.7 gacha — chunki oyna to'lishga
  // ulgurmasdi. Yomonroq qurilma yaxshiroq natija olardi.
  //
  // Endi oyna 30 kadr YOKI 500 ms — qaysi biri oldin kelsa. Median
  // ma'noli bo'lishi uchun kamida 5 kadr talab qilinadi.
  oynaEngKamKadr: 5,
  oynaEngKopVaqt: 500,
  qadam: 0.1,
  // O'lik zona: nishonning 1.05 va 1.25 barobari orasida hech narsa
  // qilinmaydi. Zonasiz boshqaruvchi chegara atrofida tebranadi.
  sekinChegara: 1.25,
  // "Tez" = NISHONNI USHLAB TURIBMIZ, "nishondan ancha tez" EMAS.
  //
  // Avval bu 0.7 edi (kadr nishonning 0.7 barobaridan tez bo'lsin) va
  // bu BOSHQARUVCHINI BIR TOMONLAMA QILIB QO'YARDI: 60 Hz ekranda
  // vsync kadrni 16.7 ms dan tez qilishga YO'L QO'YMAYDI, ya'ni nishon
  // 16.7 bo'lganda "tez" sharti hech qachon rost bo'lmasdi. Bir marta
  // tushgan rezolyutsiya abadiy past qolardi — bitta tasodifiy
  // sekinlashuv sifatni doimiy buzardi.
  //
  // 1.05 bilan boshqaruvchi eng yuqori USHLAB TURILADIGAN
  // rezolyutsiyaga yaqinlashadi: ko'taradi, ushlab tura olmasa
  // qaytaradi, va shu nuqtada turadi.
  tezChegara: 1.05,
  // Ikki o'zgarish orasidagi eng kam vaqt.
  kutish: 1000,
  // Ko'tarilish tushishdan SEKINROQ: ko'tarish uchun ketma-ket besh
  // arzon oyna kerak, tushirish uchun bittasi yetadi.
  //
  // Nega assimetrik: sekin sahna darhol sezilaradi va uni tuzatish
  // shoshilinch. Past rezolyutsiya esa sezilmaydi — uni tuzatishga
  // shoshilish shart emas.
  //
  // Nega aynan besh: `tezChegara` nishonni ushlab turishni bildirgani
  // uchun boshqaruvchi ko'tarilib, ushlay olmay qaytishi mumkin. Besh
  // oyna (kutish bilan birga ~5 soniya) bu tebranishni sekinlashtiradi
  // va u sezilmaydigan bo'lib qoladi.
  kotarishUchunOyna: 5,
});

// 0.1 qadamlar suzuvchi nuqtada 0.7000000000000001 beradi va
// `!==` solishtiruvi chegarada yolg'on ishlaydi.
function birXonagaYaxlit(son) {
  return Math.round(son * 10) / 10;
}

function mediana(qator) {
  const s = [...qator].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/**
 * Boshlang'ich holat.
 *
 * @param {number} boshlangich profilning `pikselNisbati`
 * @param {{past:number, yuqori:number}} oraliq profilning `pikselOraligi`
 * @param {number} nishon maqsad kadr vaqti, ms
 */
export function holatYarat(boshlangich, oraliq, nishon) {
  return Object.freeze({
    nisbat: birXonagaYaxlit(boshlangich),
    oraliq: Object.freeze({ ...oraliq }),
    nishon,
    kadrlar: Object.freeze([]),
    oynaBoshi: null,
    arzonOyna: 0,
    oxirgiOzgarish: -Infinity,
    // Oxirgi chaqiruvda nisbat o'zgardimi. Chaqiruvchi shunga qarab
    // `renderer.setPixelRatio` ni chaqiradi.
    ozgardi: false,
  });
}

/**
 * Bitta kadr vaqtini qabul qilib YANGI holat qaytaradi.
 *
 * SOF FUNKSIYA — kirgan holatni o'zgartirmaydi va tashqi hech narsaga
 * tegmaydi. Nega muhim: shu tufayli boshqaruvchini GPU siz, brauzersiz,
 * sun'iy sonlar bilan sinash mumkin. Butun qabul mezoni shunga
 * tayanadi (BRIF-03).
 *
 * @param {object} holat oldingi holat
 * @param {number} kadrVaqti oxirgi kadr oralig'i, ms
 * @param {number} hozir `performance.now()` qiymati, ms
 */
export function keyingiNisbat(holat, kadrVaqti, hozir) {
  const kadrlar = [...holat.kadrlar, kadrVaqti];
  const oynaBoshi = holat.oynaBoshi === null ? hozir : holat.oynaBoshi;

  // Oyna to'ldimi: kadr soni bo'yicha YOKI vaqt bo'yicha.
  const kadrBoyicha = kadrlar.length >= DRS.oyna;
  const vaqtBoyicha = kadrlar.length >= DRS.oynaEngKamKadr
    && hozir - oynaBoshi >= DRS.oynaEngKopVaqt;

  if (!kadrBoyicha && !vaqtBoyicha) {
    return Object.freeze({
      ...holat,
      kadrlar: Object.freeze(kadrlar),
      oynaBoshi,
      ozgardi: false,
    });
  }

  const med = mediana(kadrlar);
  const sekin = med > holat.nishon * DRS.sekinChegara;
  const tez = med < holat.nishon * DRS.tezChegara;

  // Oyna hisoblangach BO'SHATILADI. Aks holda bitta sekin kadr
  // keyingi 29 qarorda ham qatnashib, bir hodisadan bir necha qadam
  // tushish kelib chiqardi.
  const keyingi = {
    ...holat,
    kadrlar: Object.freeze([]),
    oynaBoshi: hozir,
    ozgardi: false,
  };

  if (hozir - holat.oxirgiOzgarish < DRS.kutish) {
    // Kutish paytida qaror qabul qilinmaydi, lekin arzon oynalar
    // sanaladi — aks holda kutish tugagach hisob noldan boshlanib,
    // ko'tarilish hech qachon yetib kelmasdi.
    keyingi.arzonOyna = tez ? holat.arzonOyna + 1 : 0;
    return Object.freeze(keyingi);
  }

  if (sekin) {
    keyingi.arzonOyna = 0;
    const yangi = Math.max(holat.oraliq.past, birXonagaYaxlit(holat.nisbat - DRS.qadam));
    if (yangi !== holat.nisbat) {
      keyingi.nisbat = yangi;
      keyingi.oxirgiOzgarish = hozir;
      keyingi.ozgardi = true;
    }
    return Object.freeze(keyingi);
  }

  if (tez) {
    keyingi.arzonOyna = holat.arzonOyna + 1;
    if (keyingi.arzonOyna >= DRS.kotarishUchunOyna) {
      keyingi.arzonOyna = 0;
      const yangi = Math.min(holat.oraliq.yuqori, birXonagaYaxlit(holat.nisbat + DRS.qadam));
      if (yangi !== holat.nisbat) {
        keyingi.nisbat = yangi;
        keyingi.oxirgiOzgarish = hozir;
        keyingi.ozgardi = true;
      }
    }
    return Object.freeze(keyingi);
  }

  // O'lik zona — hech narsa qilinmaydi va arzon hisobi nolga tushadi.
  keyingi.arzonOyna = 0;
  return Object.freeze(keyingi);
}

// ---- SUN'IY SINOV ----
//
// Boshqaruvchini GPU siz sinaydi. Har sinov "o'tdi" degan yagona
// so'z emas, KUTILGAN va OLINGAN sonni qaytaradi — aks holda sinov
// nimani tekshirganini hech kim bilmaydi.
//
// Bu sinov `npm run lab3d:olcham` ichidan chaqiriladi va bittasi
// yiqilsa butun o'lchov exit 1 beradi.

function yugurt(holat, kadrVaqti, oynaSoni, boshVaqt = 0) {
  let h = holat;
  let t = boshVaqt;
  for (let oyna = 0; oyna < oynaSoni; oyna += 1) {
    for (let i = 0; i < DRS.oyna; i += 1) {
      t += kadrVaqti;
      h = keyingiNisbat(h, kadrVaqti, t);
    }
  }
  return { holat: h, vaqt: t };
}

export function rezolyutsiyaSinovi() {
  const ORALIQ = { past: 0.6, yuqori: 1.5 };
  const NISHON = 16.7;
  const yangi = () => holatYarat(1.0, ORALIQ, NISHON);
  const sinovlar = [];

  // 1. Sekin sahna — pastki chegaraga tushsin.
  {
    const { holat } = yugurt(yangi(), 50, 30);
    sinovlar.push({
      nom: "sekin",
      izoh: "30 oyna x 50 ms => pastki chegara",
      kutilgan: ORALIQ.past,
      olingan: holat.nisbat,
      otdi: holat.nisbat === ORALIQ.past,
    });
  }

  // 2. Tez sahna — yuqori chegaraga ko'tarilsin.
  {
    const { holat } = yugurt(yangi(), 5, 90);
    sinovlar.push({
      nom: "tez",
      izoh: "90 oyna x 5 ms => yuqori chegara",
      kutilgan: ORALIQ.yuqori,
      olingan: holat.nisbat,
      otdi: holat.nisbat === ORALIQ.yuqori,
    });
  }

  // 3. Chegaradan pastga tushmasin.
  {
    const { holat } = yugurt(yangi(), 50, 200);
    sinovlar.push({
      nom: "chegara",
      izoh: "200 oyna x 50 ms => past chegaradan pastga TUSHMASIN",
      kutilgan: ORALIQ.past,
      olingan: holat.nisbat,
      otdi: holat.nisbat === ORALIQ.past,
    });
  }

  // 4. O'lik zona — nishon atrofidagi kadr hech narsani o'zgartirmasin.
  //
  // 20 ms: 16.7 * 1.25 = 20.875 dan past, 16.7 * 0.7 = 11.69 dan
  // baland. Boshqaruvchi bu yerda JIM turishi shart, aks holda
  // chegarada turgan qurilmada har soniyada sakrardi.
  {
    const { holat } = yugurt(yangi(), 20, 50);
    sinovlar.push({
      nom: "olik_zona",
      izoh: "50 oyna x 20 ms (nishon 16.7) => o'zgarish YO'Q",
      kutilgan: 1.0,
      olingan: holat.nisbat,
      otdi: holat.nisbat === 1.0,
    });
  }

  // 5. Ko'tarilish sekin — to'rt arzon oyna yetmaydi.
  {
    const { holat } = yugurt(yangi(), 5, 4);
    sinovlar.push({
      nom: "sekin_kotarilish",
      izoh: "4 arzon oyna => hali ko'tarilmasin (5 ta kerak)",
      kutilgan: 1.0,
      olingan: holat.nisbat,
      otdi: holat.nisbat === 1.0,
    });
  }

  // 6. VSYNC — eng muhim sinov.
  //
  // 60 Hz ekranda kadr aynan 16.7 ms bo'ladi va undan tez bo'la
  // OLMAYDI. Boshqaruvchi bu holatda ham ko'tarila olishi shart, aks
  // holda u bir tomonlama bo'lib qoladi: bitta sekinlashuvdan keyin
  // rezolyutsiya abadiy past qolardi.
  //
  // Bu nuqson kodda BOR EDI (tezChegara 0.7) va shu sinov yozilganda
  // topildi.
  {
    const { holat } = yugurt(holatYarat(1.0, ORALIQ, NISHON), 16.7, 60);
    sinovlar.push({
      nom: "vsync",
      izoh: "60 oyna x 16.7 ms (nishon 16.7) => ko'tarilishi SHART",
      kutilgan: "> 1.0",
      olingan: holat.nisbat,
      otdi: holat.nisbat > 1.0,
    });
  }

  // 7. JUDA SEKIN QURILMA tez yordam olsin.
  //
  // 10 FPS (100 ms kadr) — 10 soniyada pastki chegaraga yetsin.
  // Oyna faqat kadr soni bilan o'lchanganda bu 0.7 da qolardi, ya'ni
  // 15 FPS li qurilmadan YOMONROQ natija.
  {
    let h = holatYarat(1.0, ORALIQ, NISHON);
    let t = 0;
    for (let i = 0; i < 100; i += 1) {   // 100 kadr x 100 ms = 10 s
      t += 100;
      h = keyingiNisbat(h, 100, t);
    }
    sinovlar.push({
      nom: "juda_sekin",
      izoh: "10 s x 10 FPS => pastki chegaraga yetsin",
      kutilgan: ORALIQ.past,
      olingan: h.nisbat,
      otdi: h.nisbat === ORALIQ.past,
    });
  }

  // 8. Kutish oralig'i — bir soniyada bir qadamdan ko'p emas.
  {
    let h = holatYarat(1.5, ORALIQ, NISHON);
    let t = 0;
    let ozgarish = 0;
    // 10 oyna, har biri 30 x 50 ms = 1500 ms. Kutish 1000 ms bo'lgani
    // uchun har oynada ko'pi bilan bitta qadam tushishi mumkin.
    for (let oyna = 0; oyna < 10; oyna += 1) {
      for (let i = 0; i < DRS.oyna; i += 1) {
        t += 50;
        const oldingi = h.nisbat;
        h = keyingiNisbat(h, 50, t);
        if (h.nisbat !== oldingi) ozgarish += 1;
      }
    }
    sinovlar.push({
      nom: "kutish",
      izoh: "10 oyna x 50 ms => ko'pi bilan 10 qadam (oynada 1)",
      kutilgan: "<= 10",
      olingan: ozgarish,
      otdi: ozgarish <= 10,
    });
  }

  return {
    jami: sinovlar.length,
    yiqilgan: sinovlar.filter((s) => !s.otdi).length,
    sinovlar,
  };
}
