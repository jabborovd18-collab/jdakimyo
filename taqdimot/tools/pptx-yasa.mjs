/**
 * PPTX chiqaruvchi: kontent JSON -> tahrirlanadigan PowerPoint fayli.
 *
 * NEGA KERAK: PDF ni tahrirlab bo'lmaydi. Taqdimot topshirilgach odam
 * matnni o'zgartirishi, slayd qo'shishi yoki olib tashlashi mumkin
 * bo'lishi kerak — PowerPoint buni beradi.
 *
 * NEGA O'LCHAMLAR SHU YERDA QAYTA HISOBLANADI: PDF 1280×720 nuqtada
 * chiziladi (96 dpi mantiqi), PPTX esa 13,333×7,5 dyuym (72 dpi).
 * Ikkalasini bog'lovchi ikkita koeffitsiyent bor:
 *     K  = 1/96   — nuqta -> dyuym
 *     KF = 0,75   — shrift o'lchami: PDF nuqtasi -> PPTX nuqtasi
 * Shular orqali PPTX slaydlari PDF bilan bir xil nisbatda chiqadi.
 *
 * RANGLAR BU YERDA YOZILMAYDI: ular `kontent/theme.json` dan olinadi
 * (manba — `tools/theme.py`). Rang ikki joyda yozilsa, biri
 * o'zgartirilganda ikkinchisi eskirib qoladi.
 *
 * ISHLATISH:
 *   node tools/pptx-yasa.mjs                        # siyoh mavzusi
 *   node tools/pptx-yasa.mjs --mavzu neon
 *   node tools/pptx-yasa.mjs --chiqish boshqa.pptx
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PptxGenJS from "pptxgenjs";

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ILDIZ = path.dirname(TOOLS);

// ─── O'lchov koeffitsiyentlari ──────────────────────────────────────
const K = 1 / 96;         // PDF nuqtasi -> dyuym
const KF = 0.75;          // PDF shrift nuqtasi -> PPTX nuqtasi
const W = 13.333, H = 7.5;

const CHEKKA = 92 * K;               // 0.958 dyuym
const PAST = 66 * K;                 // kolontitul zonasi
const CHIZIQ_Y = (720 - 46) * K;     // yuqoridagi urg'u chizig'i

/** PDF ning pastdan-hisoblangan y koordinatasini yuqoridan-hisoblanganga o'giradi. */
const danPast = (nuqta) => (720 - nuqta) * K;
/** Kenglik/balandlik: nuqta -> dyuym. */
const en = (nuqta) => nuqta * K;

/**
 * Matn qatorlarini taxminiy o'lchash.
 *
 * PowerPoint matnni O'ZI o'raydi, lekin qutining balandligini oldindan
 * bilish kerak — aks holda matn qutidan chiqib, ostidagi elementni
 * bosib ketadi. O'rtacha belgi kengligi Inter uchun ≈0,50 em; hisob
 * ataylab sal kattaroq olinadi (xavfsiz tomonga xato qilamiz).
 */
function qatorlargaBol(matn, olchamPdf, kenglikDyuym) {
  const belgiKeng = (olchamPdf * KF) / 72 * 0.52;
  const sigim = Math.max(6, Math.floor(kenglikDyuym / belgiKeng));
  const qatorlar = [];
  for (const xom of String(matn).split("\n")) {
    const sozlar = xom.split(/\s+/).filter(Boolean);
    if (!sozlar.length) { qatorlar.push(""); continue; }
    let qator = sozlar[0];
    for (let i = 1; i < sozlar.length; i += 1) {
      const sinov = `${qator} ${sozlar[i]}`;
      if (sinov.length <= sigim) qator = sinov;
      else { qatorlar.push(qator); qator = sozlar[i]; }
    }
    qatorlar.push(qator);
  }
  return qatorlar;
}

/**
 * Matn egallaydigan taxminiy kenglik (dyuymda).
 *
 * NEGA KERAK: PowerPoint matn qutisining KENGLIGI matnning o'zidan
 * qat'i nazar saqlanadi. Keng quti (masalan butun slayd) keyin
 * geometriya tekshiruvida "ustma-ust tushdi" bo'lib chiqadi, holbuki
 * ko'zga hech narsa to'qnashmaydi. Shuning uchun qisqa yozuvlar
 * (yorliq, karta raqami) uchun quti matn o'lchamiga moslanadi.
 */
const taxminiyKeng = (matn, olchamPdf, tracking = 0, belgiUlushi = 0.58) =>
  String(matn).length * ((olchamPdf * KF) / 72) * belgiUlushi + (tracking * KF / 72) * String(matn).length + 0.08;

const baland = (matn, olchamPdf, kenglikDyuym, oraliq = 1.5) =>
  qatorlargaBol(matn, olchamPdf, kenglikDyuym).length * ((olchamPdf * KF) / 72) * oraliq;

// ─── Rang yordamchilari ─────────────────────────────────────────────
const toza = (hex) => String(hex).replace("#", "").toUpperCase();

/** "#RRGGBB" ni och/to'q tomonga suradi (nur effektlari uchun). */
function aralash(hex1, hex2, t) {
  const a = toza(hex1), b = toza(hex2);
  let chiqish = "";
  for (let i = 0; i < 6; i += 2) {
    const v1 = parseInt(a.slice(i, i + 2), 16);
    const v2 = parseInt(b.slice(i, i + 2), 16);
    chiqish += Math.round(v1 + (v2 - v1) * t).toString(16).padStart(2, "0");
  }
  return chiqish.toUpperCase();
}

// ─── Asosiy chizuvchi ───────────────────────────────────────────────
class Taqdimot {
  constructor(kontent, theme, mavzuKalit) {
    this.kontent = kontent;
    this.theme = theme;
    this.mavzu = theme.mavzular[mavzuKalit] || theme.mavzular.siyoh;
    this.oilalar = theme.oilalar;
    this.pptx = new PptxGenJS();
    this.pptx.defineLayout({ name: "16x9", width: W, height: H });
    this.pptx.layout = "16x9";
    this.raqam = 0;
    this.jami = (kontent.slaydlar || []).length;
  }

  /** Shrift oilasi nomi: PDF kaliti ("matn-q") -> PowerPoint oilasi. */
  oila(kalit) {
    return this.oilalar[kalit] || "Inter";
  }

  yangiSlayd() {
    const s = this.pptx.addSlide();
    const fon = path.join(ILDIZ, "chiqish", "fonlar", `fon-${this.mavzuKalit}.png`);
    if (fs.existsSync(fon)) s.background = { path: fon };
    else s.background = { color: toza(this.mavzu.fon[0]) };
    return s;
  }

  /** Matn qutisi. `runs` — [{matn, shrift, rang, qalin}] yoki oddiy satr. */
  yoz(s, { x, y, w, runs, olcham, oraliq = 1.5, h = null, markazdan = false, tracking = 0 }) {
    const olchamPptx = olcham * KF;
    // Qator balandligi PPTX'da ANIQ beriladi (`lineSpacing`), shuning uchun
    // bu yerdagi hisob PowerPoint chizganiga aynan mos tushadi. Avval bu
    // joyda balandlik ikki marta ko'paytirilgan edi va matn qutilari
    // sahifadan chiqib ketardi (tekshiruv buni aniqladi).
    const qatorSoni = qatorlargaBol(runs.map((r) => r.matn).join(" "), olcham, w).length;
    const qatorBaland = (olchamPptx * oraliq) / 72;
    const balandlik = h || qatorSoni * qatorBaland + 0.06;
    const matn = runs.map((r) => ({
      text: r.matn,
      options: {
        fontFace: this.oila(r.shrift || "matn"),
        fontSize: olchamPptx,
        color: toza(r.rang || this.mavzu.matn),
        bold: Boolean(r.qalin),
        charSpacing: tracking ? tracking * KF : 0,
      },
    }));
    s.addText(matn, {
      x, y, w, h: balandlik,
      margin: 0,
      align: markazdan ? "center" : "left",
      valign: "top",
      wrap: true,
      // Xavfsizlik to'ri: PowerPoint o'lchagichimdan boshqacha o'rasa,
      // matn qutidan chiqmaydi — o'zi kichrayadi.
      fit: "shrink",
      lineSpacing: olchamPptx * oraliq,
    });
    return balandlik;
  }

  /** Ko'p qatorli bitta uslubdagi matn. Qutining balandligini qaytaradi. */
  matnBlok(s, x, y, matn, shrift, olcham, rang, w, oraliq = 1.5) {
    return this.yoz(s, { x, y, w, runs: [{ matn, shrift, rang }], olcham, oraliq });
  }

  /** Yumaloq karta (fon). */
  karta(s, x, y, w, h, { rang = null, chegara = true, radius = 0.19, shaffof = 0 } = {}) {
    s.addShape(this.pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: toza(rang || this.mavzu.yuza), transparency: shaffof },
      line: chegara
        ? { color: toza(this.mavzu["yuza-chiziq"]), width: 0.75 }
        : { color: toza(this.mavzu.yuza), width: 0 },
      rectRadius: radius,
      shadow: rang ? undefined : undefined,
    });
  }

  /** Ingichka chiziq. */
  chiziq(s, x1, y1, x2, y2, rang, qalinlikPdf = 1, shaffof = 0) {
    s.addShape(this.pptx.ShapeType.line, {
      x: x1, y: y1, w: x2 - x1, h: y2 - y1,
      line: { color: toza(rang), width: qalinlikPdf * K * 72, transparency: shaffof },
    });
  }

  /** Rasmni oq karta ichida joylash. */
  rasmKarta(s, x, y, w, h, yol, { radius = 0.14 } = {}) {
    s.addShape(this.pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: toza(this.mavzu["karta-oq"]) },
      line: { color: toza(this.mavzu["yuza-chiziq"]), width: 0.75 },
      rectRadius: radius,
      shadow: { type: "outer", color: "000000", opacity: this.mavzu.toqmi ? 0.28 : 0.14, blur: 6, offset: 1, angle: 90 },
    });
    if (!yol || !fs.existsSync(yol)) return;
    // Nisbatni saqlaymiz: rasm karta ichiga sig'adigan qilib kichrayadi.
    const olcham = rasmOlchami(yol);
    if (!olcham) return;
    const nisbat = Math.min((w - 0.16) / olcham[0], (h - 0.12) / olcham[1]);
    const iw = olcham[0] * nisbat, ih = olcham[1] * nisbat;
    s.addImage({ path: yol, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
  }

  /** Kolontitul, sahifa raqami va jarayon chizig'i (PDF dagi `ramka` bilan bir xil). */
  ramka(s) {
    const m = this.mavzu;
    this.chiziq(s, CHEKKA, CHIZIQ_Y, CHEKKA + 1.0, CHIZIQ_Y, m.urgu, 2.4);
    this.chiziq(s, CHEKKA + 1.0, CHIZIQ_Y, W - CHEKKA, CHIZIQ_Y, m.chiziq, 0.8, 15);

    const kolontitul = String(this.kontent.meta?.kolontitul || "").toUpperCase();
    if (kolontitul) {
      this.yoz(s, {
        x: CHEKKA, y: danPast(56) - 0.10, w: W - CHEKKA * 2 - 2, olcham: 11.5,
        runs: [{ matn: kolontitul, shrift: "matn-o", rang: m["xira-2"] }], tracking: 1.4,
      });
    }
    this.yoz(s, {
      x: W - CHEKKA - 0.7, y: danPast(56) - 0.10, w: 0.7, olcham: 12,
      runs: [{ matn: String(this.raqam).padStart(2, "0"), shrift: "matn-yarim", rang: m["xira-2"] }],
    });

    const yolBoshi = CHEKKA, yolKeng = W - CHEKKA * 2;
    this.chiziq(s, yolBoshi, danPast(62), yolBoshi + yolKeng, danPast(62), m.chiziq, 1.1, 45);
    const nisbat = Math.min(1, this.raqam / this.jami);
    const uch = yolBoshi + yolKeng * nisbat;
    this.chiziq(s, yolBoshi, danPast(62), uch, danPast(62), m.urgu, 1.6, 0);
    s.addShape(this.pptx.ShapeType.ellipse, {
      x: uch - 0.03, y: danPast(62) - 0.03, w: 0.06, h: 0.06,
      fill: { color: toza(m.urgu) }, line: { color: toza(m.urgu), width: 0 },
    });
  }

  /** Kichik ustki yorliq (harflar orasi keng). */
  yorliq(s, x, y, matn, rang = null) {
    this.yoz(s, {
      x, y, w: Math.min(W - x - CHEKKA, taxminiyKeng(String(matn).toUpperCase(), 12.5, 2.4, 0.72)), olcham: 12.5,
      runs: [{ matn: String(matn).toUpperCase(), shrift: "matn-yarim", rang: rang || this.mavzu["yorliq-rang"] }],
      tracking: 2.4,
    });
  }

  // ── Slayd turlari (PDF dagi tartib bilan) ─────────────────────────
  muqova(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.yorliq) { this.yorliq(s, CHEKKA, y, sl.yorliq); y += 0.42; }
    const balandlik = this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 74, m.matn, W - CHEKKA * 2 - 1.4, 1.12);
    y += balandlik + 0.12;
    this.chiziq(s, CHEKKA, y, CHEKKA + 1.35, y, m.urgu, 3);
    y += 0.32;
    if (sl.kichik) this.matnBlok(s, CHEKKA, y, sl.kichik, "matn", 22, m.xira, W - CHEKKA * 2 - 1.4, 1.4);

    const past = danPast(150);
    this.chiziq(s, CHEKKA, past, W - CHEKKA, past, m.chiziq, 0.8, 40);
    const chap = [this.kontent.meta?.muallif, this.kontent.meta?.tashkilot].filter(Boolean).join(" · ");
    if (chap) this.yoz(s, {
      x: CHEKKA, y: past + 0.16, w: W - CHEKKA * 2 - 1.2, olcham: 15.5,
      runs: [{ matn: chap, shrift: "matn-yarim", rang: m.matn }],
    });
    if (this.kontent.meta?.sana) this.yoz(s, {
      x: W - CHEKKA - 1.2, y: past + 0.16, w: 1.2, olcham: 15.5,
      runs: [{ matn: String(this.kontent.meta.sana), shrift: "matn", rang: m.xira }],
    });
  }

  reja(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.kichik) { this.yorliq(s, CHEKKA, y, sl.kichik); y += 0.42; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 50, m.matn, W - CHEKKA * 2, 1.16) + 0.22;

    const bandlar = sl.bandlar || [];
    const yarim = Math.ceil(bandlar.length / 2);
    const oraliq = 0.48;
    const keng = (W - CHEKKA * 2 - oraliq) / 2;
    const ustunlar = [bandlar.slice(0, yarim), bandlar.slice(yarim)];
    const past = danPast(110);
    // Ustunlar balandligi teng bo'lishi uchun eng uzun ustunga moslashamiz
    const mavjud = past - y;
    const qatorSoni = ustunlar.map((u) => u.reduce(
      (j, b) => j + qatorlargaBol(b, 19, keng - 0.48).length, 0));
    const jami = Math.max(...qatorSoni, 1);
    const qadam = Math.min(0.34, Math.max(0.06, (mavjud - jami * 0.2) / jami));

    ustunlar.forEach((ustun, u) => {
      let kurs = y;
      const x = CHEKKA + u * (keng + oraliq);
      ustun.forEach((band, i) => {
        const raqam = u * yarim + i + 1;
        this.yoz(s, {
          x, y: kurs, w: 0.42, olcham: 19,
          runs: [{ matn: String(raqam).padStart(2, "0"), shrift: "serif-q", rang: m.urgu }],
        });
        const h = this.matnBlok(s, x + 0.44, kurs, band, "matn", 19, m.matn, keng - 0.48, 1.42);
        kurs += h + qadam * 0.5;
      });
    });
    this.ramka(s);
  }

  bolim(s, sl) {
    const m = this.mavzu;
    const raqam = String(sl.raqam || String(this.raqam).padStart(2, "0"));
    // Katta raqam — "suv belgisi". Qutisi MATN O'LCHAMIGA mos qilib
    // toraytiriladi: avval butun o'ng yarim kenglikda edi va tekshiruv
    // uni chapdagi sarlavha bilan ustma-ust deb belgiladi.
    const raqamOlcham = 200;
    const raqamKeng = Math.min(6.0, raqam.length * (raqamOlcham * KF / 72) * 0.62);
    const raqamX = W - CHEKKA - raqamKeng + 0.3;
    this.yoz(s, {
      x: raqamX, y: danPast(430), w: raqamKeng, olcham: raqamOlcham,
      runs: [{ matn: raqam, shrift: "serif-q", rang: aralash(m.fon[0], m.urgu, 0.34) }],
    });
    this.chiziq(s, raqamX + 0.1, danPast(330), W - CHEKKA + 0.2, danPast(330), m.urgu, 1.2, 60);

    // Chapdagi matn zaxirasi: raqamning chap chetidan oshib ketmaydi.
    const kengChap = raqamX - CHEKKA - 0.5;
    let y = danPast(420);
    if (sl.yorliq) { this.yorliq(s, CHEKKA, y, sl.yorliq); y += 0.5; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 58, m.matn, kengChap, 1.14) + 0.16;
    this.chiziq(s, CHEKKA, y, CHEKKA + 1.1, y, m.urgu, 3);
    y += 0.36;
    if (sl.izoh) this.matnBlok(s, CHEKKA, y, sl.izoh, "matn", 22, m.xira, kengChap, 1.45);
    this.ramka(s);
  }

  mavzuSlayd(s, sl) {
    const m = this.mavzu;
    const rasmlar = sl.rasmlar || [];
    const kengRasm = (W - CHEKKA * 2) * 0.44;
    const xRasm = W - CHEKKA - kengRasm;
    // Matn kengligi rasm ustunigacha, ortiq emas — aks holda bloklar
    // rasmlar ustiga tushardi.
    const kengMatn = rasmlar.length ? xRasm - CHEKKA - 0.3 : W - CHEKKA * 2;

    // — sarlavha (raqam + matn bir qatorda, PDF dagi kabi) —
    let y = danPast(636);
    if (sl.bolim) { this.yorliq(s, CHEKKA, y, sl.bolim); y += 0.38; }
    const raqamMatn = sl.raqam != null ? String(sl.raqam).padStart(2, "0") : null;
    let xSarlavha = CHEKKA;
    if (raqamMatn) {
      this.yoz(s, { x: CHEKKA, y, w: 0.72, olcham: 36, runs: [{ matn: raqamMatn, shrift: "serif-q", rang: m.urgu }] });
      xSarlavha = CHEKKA + 0.72;
    }
    y += this.matnBlok(s, xSarlavha, y - 0.04, sl.sarlavha, "sarlavha-j", 36,
      m.matn, kengMatn - (xSarlavha - CHEKKA), 1.14) + 0.14;
    this.chiziq(s, CHEKKA, y, CHEKKA + 1.0, y, m.urgu, 2.6);
    y += 0.26;

    // — matn bloklari —
    const past = danPast(108);
    const bloklar = (sl.bandlar || []).map((b) => (typeof b === "string"
      ? [{ matn: b, shrift: "matn", rang: m.matn }]
      : [
        { matn: b.bosh || "", shrift: "matn-yarim", rang: m.urgu },
        { matn: b.bosh && b.matn ? ": " : "", shrift: "matn-yarim", rang: m.urgu },
        { matn: b.matn || "", shrift: "matn", rang: m.matn },
      ]));
    // Joy yetmasa shrift pog'onali kichraytiriladi: PDF dvigatelida ham
    // xuddi shunday qoida bor. Usiz oxirgi blok kolontitulga tegib
    // ketardi (tekshiruv shuni ko'rsatdi).
    const jamiBaland = (olchamMatn) => bloklar.reduce((j, r) =>
      j + qatorlargaBol(r.map((b) => b.matn).join(" "), olchamMatn, kengMatn - 0.24).length
        * ((olchamMatn * KF * 1.5) / 72), 0);
    let olchamMatn = 19;
    const chegaralangan = Math.max(0.8, past - y);
    while (olchamMatn > 13 && jamiBaland(olchamMatn) + 0.1 * bloklar.length > chegaralangan) {
      olchamMatn -= 1;
    }
    const qadam = Math.min(0.26, Math.max(0.06, (chegaralangan - jamiBaland(olchamMatn)) / Math.max(1, bloklar.length)));

    let kurs = y;
    for (const r of bloklar) {
      s.addShape(this.pptx.ShapeType.diamond, {
        x: CHEKKA, y: kurs + 0.03, w: 0.075, h: 0.075,
        fill: { color: toza(m["urgu-2"]) }, line: { color: toza(m["urgu-2"]), width: 0 },
      });
      const h = this.yoz(s, { x: CHEKKA + 0.24, y: kurs, w: kengMatn - 0.24, runs: r, olcham: olchamMatn, oraliq: 1.5 });
      kurs += h + qadam;
    }

    // — o'ngdagi formula va grafiklar —
    // Ustun sarlavha ostidan boshlanib PASTGA qarab chiziladi: PPTX
    // koordinatasi yuqoridan hisoblanadi (PDF da esa pastdan).
    if (rasmlar.length) {
      this.rasmUstuni(s, rasmlar, xRasm, y + 0.05, kengRasm, Math.max(0.5, past - y - 0.05));
    }
    this.ramka(s);
  }

  rasmUstuni(s, rasmlar, x, past, keng, balandlik) {
    const m = this.mavzu;
    // IZOH — izoh yorlig'i uchun ajratilgan balandlik. 13,5pt matn
    // 1,5 qator oralig'i bilan ≈0,28 dyuym egallaydi; avval 0,26 edi
    // va yorliqning pasti keyingi kartaning ustiga tushardi.
    const IZOH = 0.34, ORA = 0.16;
    const olchovlar = rasmlar.map((r) => {
      const yol = path.join(ILDIZ, "kontent", r.fayl);
      const olcham = rasmOlchami(yol) || [1000, 500];
      return { yol, izoh: r.izoh, h: (keng * olcham[1]) / olcham[0] };
    });
    const izohlar = olchovlar.filter((o) => o.izoh).length * IZOH;
    const kerak = olchovlar.reduce((j, o) => j + o.h, 0) + izohlar + ORA * (olchovlar.length - 1);
    let kf = 1;
    if (kerak > balandlik) kf = Math.max(0.5, (balandlik - izohlar - ORA * (olchovlar.length - 1)) /
      Math.max(0.01, olchovlar.reduce((j, o) => j + o.h, 0)));

    let kurs = past;
    for (const o of olchovlar) {
      if (o.izoh) {
        this.yoz(s, {
          x: x + 0.02, y: kurs, w: keng - 0.05, olcham: 13.5,
          runs: [{ matn: o.izoh, shrift: "matn-yarim", rang: m.matn }],
        });
        this.chiziq(s, x, kurs + 0.19, x + 0.22, kurs + 0.19, m.urgu, 2.2);
        kurs += IZOH;
      }
      const h = o.h * kf;
      this.rasmKarta(s, x, kurs, keng, h, o.yol);
      kurs += h + ORA;
    }
  }

  kartochka(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.kichik) { this.yorliq(s, CHEKKA, y, sl.kichik); y += 0.42; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 44, m.matn, W - CHEKKA * 2, 1.16) + 0.26;

    const kartalar = sl.kartalar || [];
    const oraliq = 0.24;
    const keng = (W - CHEKKA * 2 - oraliq * (kartalar.length - 1)) / kartalar.length;
    const past = danPast(108);

    // Karta balandligi mazmunga qarab: eng baland karta o'lchanadi,
    // qisqalarida bo'sh joy qolib ketmasligi uchun.
    let engKerak = 0.9;
    for (const k of kartalar) {
      const h = 0.78 + (k.belgi ? 0.42 : 0) +
        baland(k.sarlavha || "", 21, keng - 0.5, 1.25) + 0.14 +
        baland(k.matn || "", 17, keng - 0.5, 1.5);
      engKerak = Math.max(engKerak, h);
    }
    const balandlik = Math.min(engKerak, past - y);
    let kartaY = y + Math.max(0, (past - y - balandlik) * 0.3);

    kartalar.forEach((k, i) => {
      const x = CHEKKA + i * (keng + oraliq);
      this.karta(s, x, kartaY, keng, balandlik, {});
      this.chiziq(s, x + 0.26, kartaY + 0.3, x + 0.26 + 0.44, kartaY + 0.3,
        i % 2 === 0 ? m.urgu : m["urgu-2"], 3);
      let yy = kartaY + 0.5;
      if (k.belgi) {
        this.yoz(s, { x: x + 0.26, y: yy, w: taxminiyKeng(String(k.belgi), 28, 0, 0.66), olcham: 28,
          runs: [{ matn: String(k.belgi), shrift: "sarlavha-j", rang: m.urgu }] });
        yy += 0.44;
      }
      yy += this.matnBlok(s, x + 0.26, yy, k.sarlavha || "", "sarlavha-q", 21, m.matn, keng - 0.5, 1.25) + 0.08;
      this.matnBlok(s, x + 0.26, yy, k.matn || "", "matn", 17, m.xira, keng - 0.5, 1.5);
    });
    this.ramka(s);
  }

  matn(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.kichik) { this.yorliq(s, CHEKKA, y, sl.kichik); y += 0.42; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 44, m.matn,
      W - CHEKKA * 2 - (sl.rasm ? 4.2 : 0), 1.16) + 0.3;
    const matnKenglik = W - CHEKKA * 2 - (sl.rasm ? 4.2 : 0);
    const jami = (o) => (sl.bandlar || []).reduce((j, b) =>
      j + qatorlargaBol(b, o, matnKenglik).length * ((o * KF * 1.5) / 72), 0);
    let bandOlcham = 22;
    while (bandOlcham > 14 && jami(bandOlcham) + 0.22 * (sl.bandlar || []).length > danPast(120) - y) {
      bandOlcham -= 1;
    }
    for (const band of sl.bandlar || []) {
      s.addShape(this.pptx.ShapeType.diamond, {
        x: CHEKKA + 0.03, y: y + 0.06, w: 0.09, h: 0.09,
        fill: { color: toza(m.urgu) }, line: { color: toza(m.urgu), width: 0 },
      });
      y += this.matnBlok(s, CHEKKA + 0.32, y, band, "matn", bandOlcham, m.matn,
        matnKenglik, 1.5) + 0.24;
    }
    if (sl.izoh) this.matnBlok(s, CHEKKA, y, sl.izoh, "matn", 18, m.xira, W - CHEKKA * 2, 1.45);
    if (sl.rasm) this.rasmKarta(s, W - CHEKKA - 4.0, danPast(300), 4.0, 3.4,
      path.join(ILDIZ, "kontent", sl.rasm));
    this.ramka(s);
  }

  raqamSlayd(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.kichik) { this.yorliq(s, CHEKKA, y, sl.kichik); y += 0.42; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 44, m.matn, W - CHEKKA * 2, 1.16) + 0.3;

    const raqamlar = sl.raqamlar || [];
    const oraliq = 0.3;
    const keng = (W - CHEKKA * 2 - oraliq * (raqamlar.length - 1)) / raqamlar.length;
    const kartaBaland = 2.3;
    const kartaY = y + 0.15;
    raqamlar.forEach((r, i) => {
      const x = CHEKKA + i * (keng + oraliq);
      this.karta(s, x, kartaY, keng, kartaBaland, { shaffof: 25 });
      this.chiziq(s, x + 0.26, kartaY + 0.3, x + 0.26 + 0.44, kartaY + 0.3,
        i % 2 === 0 ? m.urgu : m["urgu-2"], 3);
      this.yoz(s, { x: x + 0.26, y: kartaY + 0.62, w: keng - 0.5, olcham: 54,
        runs: [{ matn: String(r.qiymat ?? ""), shrift: "serif-q", rang: m.urgu },
          { matn: r.birlik ? ` ${r.birlik}` : "", shrift: "matn-o", rang: m.urgu }] });
      this.matnBlok(s, x + 0.26, kartaY + 1.55, r.izoh || "", "matn", 17, m.xira, keng - 0.5, 1.45);
    });
    if (sl.izoh) this.matnBlok(s, CHEKKA, kartaY + kartaBaland + 0.24, sl.izoh, "matn", 17, m["xira-2"], W - CHEKKA * 2, 1.45);
    this.ramka(s);
  }

  ikki(s, sl) {
    const m = this.mavzu;
    let y = danPast(650);
    if (sl.kichik) { this.yorliq(s, CHEKKA, y, sl.kichik); y += 0.42; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 44, m.matn, W - CHEKKA * 2, 1.16) + 0.3;

    const oraliq = 0.36;
    const keng = (W - CHEKKA * 2 - oraliq) / 2;
    [sl.chap || {}, sl.ong || {}].forEach((tomon, i) => {
      const x = CHEKKA + i * (keng + oraliq);
      if (i === 1) this.chiziq(s, x - oraliq / 2, danPast(110), x - oraliq / 2, y, m.chiziq, 0.8, 30);
      let yy = y;
      if (tomon.sarlavha) {
        yy += this.matnBlok(s, x, yy, tomon.sarlavha, "sarlavha-q", 22,
          i === 0 ? m.urgu : m["urgu-2"], keng, 1.25) + 0.14;
      }
      for (const band of tomon.bandlar || []) {
        s.addShape(this.pptx.ShapeType.ellipse, {
          x: x + 0.02, y: yy + 0.07, w: 0.07, h: 0.07,
          fill: { color: toza(m["urgu-2"]) }, line: { color: toza(m["urgu-2"]), width: 0 },
        });
        yy += this.matnBlok(s, x + 0.22, yy, band, "matn", 19, m.matn, keng - 0.24, 1.5) + 0.14;
      }
      if (tomon.matn) this.matnBlok(s, x, yy, tomon.matn, "matn", 17, m["xira-2"], keng, 1.5);
    });
    this.ramka(s);
  }

  sitata(s, sl) {
    const m = this.mavzu;
    this.yoz(s, { x: CHEKKA, y: danPast(560), w: 2, olcham: 150,
      runs: [{ matn: "\u201C", shrift: "serif-q", rang: aralash(m.fon[0], m.urgu, 0.5) }] });
    let y = danPast(470);
    y += this.matnBlok(s, CHEKKA + 0.16, y, sl.matn, "serif", 36, m.matn, W - CHEKKA * 2 - 1.4, 1.35) + 0.2;
    if (sl.muallif) {
      this.chiziq(s, CHEKKA + 0.16, y, CHEKKA + 1.2, y, m.urgu, 3);
      this.yoz(s, { x: CHEKKA + 0.16, y: y + 0.16, w: 6, olcham: 19,
        runs: [{ matn: sl.muallif, shrift: "matn-yarim", rang: m.xira }] });
      y += 0.5;
    }
    if (sl.izoh) this.matnBlok(s, CHEKKA + 0.16, y + 0.2, sl.izoh, "matn", 17, m["xira-2"], W * 0.7, 1.45);
    this.ramka(s);
  }

  yakun(s, sl) {
    const m = this.mavzu;
    let y = danPast(400);
    if (sl.yorliq) { this.yorliq(s, CHEKKA, y - 0.2, sl.yorliq); y += 0.5; }
    y += this.matnBlok(s, CHEKKA, y, sl.sarlavha, "sarlavha-j", 56, m.matn, W - CHEKKA * 2, 1.14, true) + 0.2;
    this.chiziq(s, W / 2 - 0.7, y, W / 2 + 0.7, y, m.urgu, 3);
    y += 0.34;
    for (const band of sl.bandlar || []) {
      y += this.matnBlok(s, CHEKKA, y, band, "matn", 19, m.xira, W - CHEKKA * 2, 1.4, true) + 0.14;
    }
    if (sl.izoh) this.matnBlok(s, CHEKKA, H - PAST - 0.35, sl.izoh, "matn-o", 16, m["xira-2"], W - CHEKKA * 2, 1.4, true);
  }

  yasa(chiqish, mavzuKalit) {
    this.mavzuKalit = mavzuKalit;
    const turlar = {
      muqova: this.muqova, reja: this.reja, bolim: this.bolim, mavzu: this.mavzuSlayd,
      kartochka: this.kartochka, matn: this.matn, raqam: this.raqamSlayd,
      ikki: this.ikki, sitata: this.sitata, yakun: this.yakun,
    };
    for (const sl of this.kontent.slaydlar || []) {
      const tur = sl.tur || "matn";
      const chizuvchi = turlar[tur];
      if (!chizuvchi) throw new Error(`Noma'lum slayd turi: «${tur}»`);
      this.raqam += 1;
      const s = this.yangiSlayd();
      chizuvchi.call(this, s, sl);
    }
    return this.pptx.writeFile({ fileName: chiqish });
  }
}

/** Rasm o'lchamini o'qish — PNG konteynerining birinchi 24 bayti yetadi. */
function rasmOlchami(yol) {
  try {
    const b = fs.readFileSync(yol);
    if (b[0] === 0x89 && b[1] === 0x50) {
      return [b.readUInt32BE(16), b.readUInt32BE(20)];
    }
  } catch { /* rasm yo'q — chaqiruvchi o'zi hal qiladi */ }
  return null;
}

// ─── Buyruq qatori ──────────────────────────────────────────────────
const argumentlar = process.argv.slice(2);
const ol = (bayroq, sukut) => {
  const i = argumentlar.indexOf(bayroq);
  return i >= 0 ? argumentlar[i + 1] : sukut;
};

const mavzu = ol("--mavzu", "siyoh");
const kontent = JSON.parse(fs.readFileSync(path.join(ILDIZ, "kontent", "taqdimot.json"), "utf-8"));
// theme.json — theme.py dan yasalgan nusxa (orqasida: tools/theme-chiqar.py).
// Rang yoki shriftni o'zgartirish kerak bo'lsa, theme.py tahrirlanadi.
const themeYoli = path.join(ILDIZ, "kontent", "theme.json");
if (!fs.existsSync(themeYoli)) {
  console.error(
    "❌ kontent/theme.json topilmadi.\n" +
    "   Avval ./ornat.sh (yoki python3 tools/theme-chiqar.py) ni ishga tushiring.");
  process.exit(1);
}
const theme = JSON.parse(fs.readFileSync(themeYoli, "utf-8"));

const nom = ol("--chiqish", path.join("chiqish", `sirt-hodisalari-${mavzu}.pptx`));
const chiqish = path.isAbsolute(nom) ? nom : path.join(ILDIZ, nom);

// Fon rasmi bo'lmasa PPTX tekis rang bilan chiqadi — bu jimgina
// sifatni tushirardi, shuning uchun ochiq ogohlantiramiz.
const fonYoli = path.join(ILDIZ, "chiqish", "fonlar", `fon-${mavzu}.png`);
if (!fs.existsSync(fonYoli)) {
  console.log(`⚠ Fon rasmi topilmadi (${path.relative(ILDIZ, fonYoli)}).`);
  console.log("  Gradient fon uchun avval: python3 tools/pptx-fon.py");
}

const taqdimot = new Taqdimot(kontent, theme, mavzu);
await taqdimot.yasa(chiqish, mavzu);
const hajm = (fs.statSync(chiqish).size / 1024 / 1024).toFixed(2);
console.log(`✅ ${taqdimot.jami} slayd -> ${path.relative(ILDIZ, chiqish)}  (${hajm} MB, mavzu: ${theme.mavzular[mavzu].nom})`);
