// app/laboratoriya/3d/lib/javon/reagentlar.js
//
// Reagent ro'yxati va ularning javondagi joyi.
//
// BRIF-05: `javon-3d.js` (868 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";


// DEVOR BO'YLAB O'RNATILGAN BIR NECHTA MAXSUS REAGENTLAR JAVONLARI (Wall Cabinets).
// O'rtadagi to'siq olib tashlandi: xona markazi to'liq ochiq, keng va erkin.
// 4 ta alohida devor shkaflari:
//  1. Kislotalar va Oksidlovchilar (Orqa devor chap qanoti)
//  2. Ishqorlar va Asoslar (Orqa devor o'ng qanoti)
//  3. Toza Qattiq Tuzlar va Reaktivlar (O'ng devor javoni)
//  4. Standart Eritmalar va Indikatorlar (Chap devor javoni)

export const DEVOR_JAVON_REAGENTLARI = [
  // ─── 1-JAVON: KISLOTALAR VA OKSIDLOVCHILAR (Orqa chap devorda: X = -4.5, Z = -5.3) ───
  { kalit: "HCl", nom: "Xlorid kislota", sigim: 500, joriyHajm: 450, rang: 0xf8fafc, ghs: "korroziy", shishaTuri: "tiniq", pos: [-5.1, 1.65, -5.25], javon: "kislota" },
  { kalit: "HNO₃", nom: "Nitrat kislota", sigim: 500, joriyHajm: 420, rang: 0xfef08a, ghs: "oksidlovchi", shishaTuri: "amber", pos: [-4.7, 1.65, -5.25], javon: "kislota" },
  { kalit: "H₂SO₄", nom: "Sulfat kislota (Quyuq)", sigim: 500, joriyHajm: 480, rang: 0xfacc15, ghs: "korroziy", shishaTuri: "amber", pos: [-4.3, 1.65, -5.25], javon: "kislota" },
  { kalit: "CH₃COOH", nom: "Sirka kislota (Muzdek)", sigim: 500, joriyHajm: 380, rang: 0xe2e8f0, ghs: "yonuvchan", shishaTuri: "tiniq", pos: [-3.9, 1.65, -5.25], javon: "kislota" },

  // ─── 2-JAVON: ISHQORLAR VA ASOSLAR (Orqa o'ng devorda: X = 4.5, Z = -5.3) ───
  { kalit: "NaOH", nom: "Natriy gidroksid ishqori", sigim: 500, joriyHajm: 400, rang: 0xbae6fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [3.9, 1.65, -5.25], javon: "ishqor" },
  { kalit: "KOH", nom: "Kaliy gidroksid", sigim: 500, joriyHajm: 350, rang: 0x93c5fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [4.3, 1.65, -5.25], javon: "ishqor" },
  { kalit: "NH₃", nom: "Ammiakli suv (25%)", sigim: 500, joriyHajm: 450, rang: 0xcfe8ff, ghs: "toksik", shishaTuri: "amber", pos: [4.7, 1.65, -5.25], javon: "ishqor" },
  { kalit: "Ba(OH)₂", nom: "Bariy gidroksid", sigim: 250, joriyHajm: 200, rang: 0xf1f5f9, ghs: "korroziy", shishaTuri: "tiniq", pos: [5.1, 1.65, -5.25], javon: "ishqor" },

  // ─── 3-JAVON: TOZA QATTIQ TUZLAR (O'ng devor: X = 7.5, Z = -1.5) ───
  { kalit: "CuSO₄", nom: "Mis(II) sulfat", sigim: 100, joriyHajm: 85, rang: 0x0284c7, ghs: "xavfsiz", shishaTuri: "orta", pos: [7.42, 1.65, -2.1], javon: "tuz" },
  { kalit: "AgNO₃", nom: "Kumush nitrat", sigim: 100, joriyHajm: 70, rang: 0x94a3b8, ghs: "korroziy", shishaTuri: "amber", pos: [7.42, 1.65, -1.7], javon: "tuz" },
  { kalit: "KMnO₄", nom: "Kaliy permanganat", sigim: 100, joriyHajm: 90, rang: 0x7e22ce, ghs: "oksidlovchi", shishaTuri: "amber", pos: [7.42, 1.65, -1.3], javon: "tuz" },
  { kalit: "FeCl₃", nom: "Temir(III) xlorid", sigim: 100, joriyHajm: 75, rang: 0xc2410c, ghs: "korroziy", shishaTuri: "orta", pos: [7.42, 1.65, -0.9], javon: "tuz" },
  { kalit: "BaCl₂", nom: "Bariy xlorid", sigim: 100, joriyHajm: 80, rang: 0xf1f5f9, ghs: "toksik", shishaTuri: "orta", pos: [7.42, 1.25, -2.1], javon: "tuz" },
  { kalit: "KI", nom: "Kaliy yodid", sigim: 100, joriyHajm: 95, rang: 0xfef08a, ghs: "xavfsiz", shishaTuri: "orta", pos: [7.42, 1.25, -1.7], javon: "tuz" },
  // ZnSO₄ mashg'ulot_5 (amfoter gidroksidlar) uchun SHART, lekin javonda
  // yo'q edi — ya'ni o'sha mashg'ulotni bajarib bo'lmasdi. 2026-08-22 da
  // qamrov tekshiruvi buni topdi.
  //
  // `rang` moddalar bazasiga mos: lab-modda.js da ZnSO₄ = "rangsiz",
  // shuning uchun BaCl₂ bilan bir xil oq-kulrang tus.
  //
  // `ghs: "toksik"` — ZnSO₄ yutilganda zararli va suv organizmlari uchun
  // juda toksik. Mavjud beshta toifadan eng yaqini shu; xavfsizlik
  // yorlig'i shubhali holatda ehtiyot tomonga og'ishi kerak.
  { kalit: "ZnSO₄", nom: "Rux sulfat", sigim: 100, joriyHajm: 80, rang: 0xf1f5f9, ghs: "toksik", shishaTuri: "orta", pos: [7.42, 1.25, -1.3], javon: "tuz" },

  // ─── 4-JAVON: ERITMALAR VA INDIKATORLAR (Chap devor: X = -7.5, Z = -1.5) ───
  { kalit: "H₂O", nom: "Distillangan suv", sigim: 1000, joriyHajm: 950, rang: 0x38bdf8, ghs: "xavfsiz", shishaTuri: "bak", pos: [7.42, 1.65, 0.2], javon: "eritma" },
  { kalit: "Fenolftalein", indikator: true, nom: "Fenolftalein", sigim: 25, joriyHajm: 20, rang: 0xffffff, ghs: "yonuvchan", shishaTuri: "tomizgich", pos: [7.42, 1.65, 0.6], javon: "eritma" },
  { kalit: "Metiloranj", indikator: true, nom: "Metiloranj", sigim: 25, joriyHajm: 22, rang: 0xf97316, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [7.42, 1.65, 1.0], javon: "eritma" },
  { kalit: "Lakmus", indikator: true, nom: "Lakmus indikatori", sigim: 25, joriyHajm: 18, rang: 0x8b5cf6, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [7.42, 1.65, 1.4], javon: "eritma" },
];


// Indikator hisoblangan reagentlar — ro'yxatdan HOSILA.
//
// `mashgulot_1` da qadam kaliti umumiy "indikator": qaysi indikator
// tomizilgani muhim emas, tomizilgani muhim. Ro'yxatni qo'lda
// takrorlamaymiz — yangi indikator qo'shilsa u avtomatik qo'shiladi.
export const INDIKATORLAR = Object.freeze(
  DEVOR_JAVON_REAGENTLARI.filter((r) => r.indikator).map((r) => r.kalit),
);


// Qaysi reagent guruhi qaysi qatorda va uning qaysi qismida turadi.
//
// MUAMMO (egasi jonli sahifada ko'rsatdi, 2026-08-22): xona
// kattalashtirilganda javon qatorlari xona o'lchamidan hisoblandi,
// lekin shishalar joyi `DEVOR_JAVON_REAGENTLARI` dagi `pos` da qattiq
// yozilgan bo'lib qoldi. Natijada shishalar devordan 2.5 m narida —
// HAVODA osilib turdi, ikkitasi esa polda ko'rindi.
//
// Ildiz sabab AGENTS.md 1-bandi: bir ma'lumot (javon qayerda) ikki
// joyda yozilgan edi. Endi shishalar joyi qatordan HISOBLANADI va
// `pos` faqat tartibni belgilaydi.
export const REAGENT_TAQSIMOTI = Object.freeze({
  kislota: Object.freeze({ qator: "orqaChap", bosh: 0.30, oxir: 0.70 }),
  ishqor: Object.freeze({ qator: "orqaOng", bosh: 0.30, oxir: 0.70 }),
  tuz: Object.freeze({ qator: "ong", bosh: 0.12, oxir: 0.40 }),
  eritma: Object.freeze({ qator: "ong", bosh: 0.60, oxir: 0.88 }),
});


// Shisha tokcha sirtidan shu qadar oldinda turadi (tokcha chuqurligi
// 0.35, ya'ni shisha uning o'rtasiga tushadi).
export const SHISHA_CHUQURLIGI = 0.10;


/**
 * Har reagentga dunyo koordinatasini beradi.
 *
 * Qator ichida bir xil balandlikdagi shishalar teng taqsimlanadi:
 * ikki qatorli javonda (tuz) pastki qator yuqorigisining ostiga
 * tushadi, chunki ikkalasi ham bir xil oraliqqa yoyiladi.
 */
export function reagentJoylari(Q) {
  const natija = new Map();
  const guruhlar = new Map();
  for (const item of DEVOR_JAVON_REAGENTLARI) {
    const kalit = `${item.javon}|${item.pos[1]}`;
    if (!guruhlar.has(kalit)) guruhlar.set(kalit, []);
    guruhlar.get(kalit).push(item);
  }

  for (const [kalit, ro] of guruhlar) {
    const [javon] = kalit.split("|");
    const t = REAGENT_TAQSIMOTI[javon];
    if (!t) continue;
    const n = ro.length;
    for (let i = 0; i < n; i += 1) {
      // n ta shisha [bosh, oxir] oralig'iga teng joylashadi.
      const ulush = n === 1
        ? (t.bosh + t.oxir) / 2
        : t.bosh + (t.oxir - t.bosh) * (i / (n - 1));
      const siljish = (ulush - 0.5);
      const y = ro[i].pos[1];
      let joy;
      let mahalliyX;
      if (t.qator === "ong") {
        mahalliyX = siljish * Q.ongKenglik;
        joy = [Q.ongX - SHISHA_CHUQURLIGI, y, Q.ongMarkazZ + mahalliyX];
      } else {
        const markaz = t.qator === "orqaOng" ? Q.orqaMarkaz : -Q.orqaMarkaz;
        mahalliyX = siljish * Q.orqaKenglik;
        joy = [markaz + mahalliyX, y, Q.orqaZ + SHISHA_CHUQURLIGI];
      }
      natija.set(ro[i].kalit, { joy, qator: t.qator, mahalliyX });
    }
  }
  return natija;
}
