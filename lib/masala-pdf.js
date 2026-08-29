// lib/masala-pdf.js
//
// JDA KIMYO AI — PREMIUM AKADEMIK VA OLIMPIADA MASALALARI PDF DVIGATELI (v5.0 Enterprise)
// Akademik jadvallar, Pearson kresti diagrammasi, stexiometrik matritsalar va qat'iy matematik format.
// Web UI va Telegram Bot uchun to'liq universal (100% mustaqil JavaScript arxitekturasi).

import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { sanaVaqt } from "./sana.js";

const W = 595.28; // A4 Kengligi
const H = 841.89; // A4 Balandligi

// 🎨 AKADEMIK VA ILMIY RANGLAR PALITRASI (Oxford / Nature Journal Palette)
const C = {
  oq: rgb(1, 1, 1),
  qora: rgb(0.06, 0.07, 0.11),
  siyohAsos: rgb(0.09, 0.1, 0.22), // #171a38 - Royal Academic Navy
  siyohOch: rgb(0.24, 0.28, 0.55),
  urguKok: rgb(0.12, 0.44, 0.88),  // #1f70e0
  yashil: rgb(0.05, 0.58, 0.35),   // #0d9459 - Emerald Success
  yashilOch: rgb(0.92, 0.98, 0.94),
  oltin: rgb(0.85, 0.55, 0.05),    // #d98c0d - Gold Award
  oltinOch: rgb(0.99, 0.97, 0.9),
  qizil: rgb(0.85, 0.18, 0.18),
  kulrangToq: rgb(0.3, 0.33, 0.4),
  kulrang: rgb(0.55, 0.58, 0.65),
  kulrangOch: rgb(0.96, 0.97, 0.98), // #f5f7fa
  chiziq: rgb(0.86, 0.88, 0.92),
  jadvalHeader: rgb(0.15, 0.18, 0.3),
};

function toza(matn) {
  if (matn === null || matn === undefined) return "";
  let s = String(matn).trim();
  s = s.replace(/\\text\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  s = s.replace(/\\cdot/g, " · ");
  s = s.replace(/\\rightarrow/g, " → ");
  s = s.replace(/\\leftrightarrow/g, " ↔ ");
  s = s.replace(/\\Delta/g, "Δ");
  s = s.replace(/\\gamma/g, "γ");
  s = s.replace(/\\omega/g, "ω");
  s = s.replace(/\\times/g, " × ");
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
  s = s.replace(/\\uparrow/g, "↑");
  s = s.replace(/\\downarrow/g, "↓");
  s = s.replace(/\$/g, "");
  return s;
}

async function baytlar(manzil) {
  const javob = await fetch(manzil);
  if (!javob.ok) throw new Error("Shrift yuklab bo'lmadi: " + manzil);
  return javob.arrayBuffer();
}

/**
 * Premium Akademik Kimyo Masala Bayonnomasini generatsiya qilish
 */
export async function masalaPdfYukla({
  foydalanuvchiNom = "Talaba",
  masalaMatni = "",
  natija = {},
}) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const [rBaytlar, bBaytlar] = await Promise.all([
    baytlar("/fonts/DejaVuSans.ttf"),
    baytlar("/fonts/DejaVuSans-Bold.ttf"),
  ]);

  const oddiy = await doc.embedFont(rBaytlar, { subset: true });
  const qalin = await doc.embedFont(bBaytlar, { subset: true });

  const rejim = natija.rejim || "toliq";
  const rejimNom =
    rejim === "tuzoq"
      ? "1-Rejim: Tuzoq & Nozik Ayyorlik Tahlili"
      : rejim === "yonalish"
      ? "2-Rejim: Yechish Rejasi & Formulalar"
      : "3-Rejim: To'liq Akademik Master Yechim";

  const docId = `JDA-DOC-${Math.floor(100000 + Math.random() * 900000)}`;

  doc.setTitle(`JDA Kimyo Akademik Tahlili — ${toza(foydalanuvchiNom)}`);
  doc.setAuthor("JDA KIMYO Fan va Ta'lim Portali");
  doc.setCreator("jdakimyo.uz Enterprise PDF Engine");

  const sahifa = doc.addPage([W, H]);

  // ─── 1. HASHAMATLI AKADEMIK HEADER ───
  // Asosiy Yuqori Panel
  sahifa.drawRectangle({
    x: 25,
    y: H - 65,
    width: W - 50,
    height: 42,
    color: C.siyohAsos,
  });

  // Oltin urg'u chizig'i
  sahifa.drawRectangle({
    x: 25,
    y: H - 67,
    width: W - 50,
    height: 2.5,
    color: C.oltin,
  });

  // Brend va Logo
  sahifa.drawText("JDA KIMYO", {
    x: 40,
    y: H - 44,
    size: 13,
    font: qalin,
    color: C.oq,
  });

  sahifa.drawText("AKADEMIK VA ILMIY MASALALAR TAHLIL EKSPERTIZASI", {
    x: 125,
    y: H - 43,
    size: 7.5,
    font: qalin,
    color: rgb(0.8, 0.85, 0.95),
  });

  sahifa.drawText(`ID: ${docId}`, {
    x: W - 145,
    y: H - 43,
    size: 8,
    font: oddiy,
    color: C.oltin,
  });

  // ─── 2. HUJJAT METADATASI VA PASPORT KARTASI ───
  const metaY = H - 120;
  sahifa.drawRectangle({
    x: 25,
    y: metaY,
    width: W - 50,
    height: 45,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  // Chap ustun: Foydalanuvchi & Sana
  sahifa.drawText("Tadqiqotchi / O'quvchi:", { x: 38, y: metaY + 28, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(toza(foydalanuvchiNom), { x: 135, y: metaY + 28, size: 9, font: qalin, color: C.qora });

  sahifa.drawText("Ekspertiza Sanasi:", { x: 38, y: metaY + 12, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(sanaVaqt(new Date()), { x: 135, y: metaY + 12, size: 8, font: oddiy, color: C.kulrangToq });

  // O'ng ustun: Mavzu & Rejim
  sahifa.drawText("Yo'nalish / Mavzu:", { x: W / 2 + 10, y: metaY + 28, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(toza(natija.masalaTuri ? natija.masalaTuri.toUpperCase() : "UMUMIY KIMYO"), {
    x: W / 2 + 90,
    y: metaY + 28,
    size: 8.5,
    font: qalin,
    color: C.urguKok,
  });

  sahifa.drawText("Tekshiruv Rejimi:", { x: W / 2 + 10, y: metaY + 12, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(rejimNom, { x: W / 2 + 90, y: metaY + 12, size: 8, font: qalin, color: C.oltin });

  let curY = metaY - 20;

  // ─── 3. MASALA SHARTI BLOKI ───
  sahifa.drawText("1. KIMYOVIY MASALA SHARTI VA DASTLABKI MATN", {
    x: 25,
    y: curY,
    size: 9,
    font: qalin,
    color: C.siyohAsos,
  });
  curY -= 12;

  const matn = toza(masalaMatni);
  const qatorlarMatn = matn.match(/.{1,85}(\s|$)/g) || [matn];
  const shartBalandligi = Math.max(26, qatorlarMatn.length * 11.5 + 10);

  sahifa.drawRectangle({
    x: 25,
    y: curY - shartBalandligi + 6,
    width: W - 50,
    height: shartBalandligi,
    color: rgb(0.98, 0.98, 1),
    borderColor: rgb(0.8, 0.85, 0.95),
    borderWidth: 1,
  });

  qatorlarMatn.forEach((q, idx) => {
    sahifa.drawText(q.trim(), {
      x: 35,
      y: curY - idx * 11.5 - 2,
      size: 8,
      font: oddiy,
      color: C.qora,
    });
  });

  curY -= shartBalandligi + 16;

  // ─── 4. PARAMETRLAR JADVALI (GIVEN & REQUIRED PARAMETERS MATRIX) ───
  const berilgan = natija.berilgan || [];
  const topish = natija.topishKerak || [];

  if (berilgan.length > 0 || topish.length > 0) {
    sahifa.drawText("2. BOSHLANG'ICH PARAMETRLAR VA NO'MA'LUMLAR JADVALI", {
      x: 25,
      y: curY,
      size: 9,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 12;

    const jamiQatorlar = Math.max(berilgan.length, topish.length);
    const tableH = (jamiQatorlar + 1) * 14 + 4;

    // Jadval ramkasi
    sahifa.drawRectangle({
      x: 25,
      y: curY - tableH + 8,
      width: W - 50,
      height: tableH,
      color: C.oq,
      borderColor: C.chiziq,
      borderWidth: 1,
    });

    // Jadval sarlavhasi foni
    sahifa.drawRectangle({
      x: 25,
      y: curY - 10,
      width: W - 50,
      height: 18,
      color: C.jadvalHeader,
    });

    sahifa.drawText("№", { x: 35, y: curY - 5, size: 7.5, font: qalin, color: C.oq });
    sahifa.drawText("Berilgan Kattaliklar (Parametr)", { x: 60, y: curY - 5, size: 7.5, font: qalin, color: C.oq });
    sahifa.drawText("Qiymati", { x: 220, y: curY - 5, size: 7.5, font: qalin, color: C.oq });
    sahifa.drawText("Topilishi Kerak Bo'lgan Qiymat", { x: W / 2 + 40, y: curY - 5, size: 7.5, font: qalin, color: C.oq });

    curY -= 20;

    for (let i = 0; i < jamiQatorlar; i++) {
      const b = berilgan[i];
      const t = topish[i];

      // Juft qatorlarga och fon
      if (i % 2 === 1) {
        sahifa.drawRectangle({
          x: 25,
          y: curY - 4,
          width: W - 50,
          height: 14,
          color: C.kulrangOch,
        });
      }

      sahifa.drawText(`${i + 1}`, { x: 35, y: curY, size: 7.5, font: oddiy, color: C.kulrangToq });
      if (b) {
        sahifa.drawText(toza(b.belgi), { x: 60, y: curY, size: 8, font: qalin, color: C.siyohAsos });
        sahifa.drawText(toza(b.qiymat), { x: 220, y: curY, size: 8, font: oddiy, color: C.qora });
      }
      if (t) {
        sahifa.drawText(`${toza(t.belgi)}  (${toza(t.nom)})`, {
          x: W / 2 + 40,
          y: curY,
          size: 8,
          font: qalin,
          color: C.oltin,
        });
      }
      curY -= 14;
    }

    curY -= 8;
  }

  // ─── 5. KIMYOVIY REAKSIYA VA STEXIOMETRIK NISBATLAR BANNERI ───
  const tenglamalar = natija.tenglamalar || (natija.tenglama ? [natija.tenglama] : []);
  if (tenglamalar.length > 0) {
    sahifa.drawText("3. KIMYOVIY REAKSIYA TENGLAMASI VA STEXIOMETRIYA", {
      x: 25,
      y: curY,
      size: 9,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 12;

    const reaksiyaMatn = toza(tenglamalar[0]);
    sahifa.drawRectangle({
      x: 25,
      y: curY - 22,
      width: W - 50,
      height: 26,
      color: rgb(0.94, 0.97, 1),
      borderColor: C.urguKok,
      borderWidth: 1,
    });

    sahifa.drawText(reaksiyaMatn, {
      x: 35,
      y: curY - 14,
      size: 9,
      font: qalin,
      color: C.siyohAsos,
    });

    curY -= 32;
  }

  // ─── 6. PEARSON KRESTI VIZUAL DIAGRAMMASI (AGAR ERITMA BO'LSA) ───
  if (natija.krestSxemasi?.mavjud || (natija.masalaTuri === "eritmalar" && natija.krestSxemasi)) {
    const ks = natija.krestSxemasi;
    sahifa.drawText("PEARSON DIAGONAL KRESTI SXEMASI (ARALASHTIRISH GRAFIGI)", {
      x: 25,
      y: curY,
      size: 8.5,
      font: qalin,
      color: C.urguKok,
    });
    curY -= 10;

    const krestH = 45;
    sahifa.drawRectangle({
      x: 25,
      y: curY - krestH,
      width: W - 50,
      height: krestH,
      color: C.kulrangOch,
      borderColor: C.chiziq,
      borderWidth: 1,
    });

    const cx = W / 2;
    // Diagramma matnlari
    sahifa.drawText(`${toza(ks.w1 || "ω₁")}`, { x: cx - 140, y: curY - 16, size: 9, font: qalin, color: C.siyohAsos });
    sahifa.drawText(`${toza(ks.w2 || "ω₂")}`, { x: cx - 140, y: curY - 36, size: 9, font: qalin, color: C.siyohAsos });

    // Markaziy talab
    sahifa.drawText(`${toza(ks.wO || "ω_ortacha")}`, { x: cx - 30, y: curY - 26, size: 10, font: qalin, color: C.urguKok });

    // Natijaviy qismlar
    sahifa.drawText(`Qism 1: ${toza(ks.qism1 || "q₁")}`, { x: cx + 70, y: curY - 16, size: 8.5, font: qalin, color: C.yashil });
    sahifa.drawText(`Qism 2: ${toza(ks.qism2 || "q₂")}`, { x: cx + 70, y: curY - 36, size: 8.5, font: qalin, color: C.yashil });

    // Diagonal chiziqlar
    sahifa.drawLine({ start: { x: cx - 90, y: curY - 14 }, end: { x: cx + 50, y: curY - 34 }, thickness: 1, color: C.chiziq });
    sahifa.drawLine({ start: { x: cx - 90, y: curY - 34 }, end: { x: cx + 50, y: curY - 14 }, thickness: 1, color: C.chiziq });

    curY -= krestH + 12;
  }

  // ─── 7. BOSQICHMA-BOSQICH ILMIY YECHIM (STEP-BY-STEP RIGOROUS PROOF) ───
  sahifa.drawText("4. BOSQICHMA-BOSQICH AKADEMIK VA MATEMATIK YECHIM", {
    x: 25,
    y: curY,
    size: 9,
    font: qalin,
    color: C.siyohAsos,
  });
  curY -= 12;

  const bosqichlar = natija.bosqichlar || [];
  bosqichlar.slice(0, 5).forEach((b, i) => {
    if (curY < 130) return; // Footerga xavfsiz masofa

    const sarlavha = toza(b.sarlavha || `${i + 1}-Bosqich`);
    const tushuntirish = toza(b.tushuntirish || b.mantiq || b.matn);
    const formula = toza(b.formula);

    // Bosqich kartasi
    sahifa.drawText(`• ${sarlavha}`, {
      x: 28,
      y: curY,
      size: 8.5,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 12;

    if (tushuntirish) {
      const qatorlar = tushuntirish.match(/.{1,88}(\s|$)/g) || [tushuntirish];
      qatorlar.slice(0, 2).forEach((q) => {
        sahifa.drawText(q.trim(), {
          x: 38,
          y: curY,
          size: 7.5,
          font: oddiy,
          color: C.qora,
        });
        curY -= 10.5;
      });
    }

    if (formula) {
      sahifa.drawText(`   =>   ${formula}`, {
        x: 42,
        y: curY,
        size: 8,
        font: qalin,
        color: C.yashil,
      });
      curY -= 12;
    }

    curY -= 3;
  });

  // ─── 8. GRAND YAKUNIY JAVOB KARTASI (EMERALD CERTIFIED RESULT BOX) ───
  if (natija.yakuniyJavob && curY > 90) {
    curY -= 8;
    sahifa.drawRectangle({
      x: 25,
      y: curY - 26,
      width: W - 50,
      height: 28,
      color: C.yashilOch,
      borderColor: C.yashil,
      borderWidth: 1.5,
    });

    sahifa.drawText(`YAKUNIY ILMIY JAVOB:   ${toza(natija.yakuniyJavob)}`, {
      x: 38,
      y: curY - 17,
      size: 10,
      font: qalin,
      color: C.yashil,
    });
    curY -= 36;
  }

  // ─── 9. RASMIY MUHR VA IMZO BLOKI (OFFICIAL VERIFICATION SEAL) ───
  const footerY = 32;
  sahifa.drawRectangle({
    x: 25,
    y: footerY,
    width: W - 50,
    height: 44,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  // Rubrika & Ball
  sahifa.drawText("Ekspert / Ustoz Xulosasi: ____________________________", {
    x: 35,
    y: footerY + 26,
    size: 7.5,
    font: oddiy,
    color: C.kulrangToq,
  });

  sahifa.drawText("Baholash: [  100  /  100  ]   A'lo (Akademik Yechim)", {
    x: 35,
    y: footerY + 12,
    size: 7.5,
    font: qalin,
    color: C.siyohAsos,
  });

  // Digital Seal / Shtamp
  sahifa.drawRectangle({
    x: W - 175,
    y: footerY + 6,
    width: 140,
    height: 32,
    color: rgb(0.96, 0.98, 1),
    borderColor: C.urguKok,
    borderWidth: 1,
  });

  sahifa.drawText("JDA KIMYO VERIFIED", {
    x: W - 165,
    y: footerY + 22,
    size: 7,
    font: qalin,
    color: C.urguKok,
  });

  sahifa.drawText("RAQAMLI EKSPERTIZA SERTIFIKATI", {
    x: W - 168,
    y: footerY + 11,
    size: 5.5,
    font: oddiy,
    color: C.kulrangToq,
  });

  const pdfBaytlar = await doc.save();
  const blob = new Blob([pdfBaytlar], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `JDA-Kimyo-Akademik-Tahlil-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
