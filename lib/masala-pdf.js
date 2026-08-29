// lib/masala-pdf.js
//
// JDA KIMYO AI — PREMIUM AKADEMIK VA OLIMPIADA MASALALARI PDF DVIGATELI (v5.1 Enterprise)
// Mukammal kimyoviy formulalar, jadvallar, Pearson diagrammasi va toza AI bayonnoma formati.

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { sanaVaqt } from "./sana.js";

const W = 595.28; // A4 Kengligi
const H = 841.89; // A4 Balandligi

// 🎨 AKADEMIK VA ILMIY RANGLAR PALITRASI
const C = {
  oq: rgb(1, 1, 1),
  qora: rgb(0.06, 0.07, 0.11),
  siyohAsos: rgb(0.09, 0.1, 0.22), // Royal Academic Navy
  urguKok: rgb(0.12, 0.44, 0.88),
  yashil: rgb(0.05, 0.58, 0.35),
  yashilOch: rgb(0.92, 0.98, 0.94),
  oltin: rgb(0.85, 0.55, 0.05),
  qizil: rgb(0.85, 0.18, 0.18),
  kulrangToq: rgb(0.3, 0.33, 0.4),
  kulrang: rgb(0.55, 0.58, 0.65),
  kulrangOch: rgb(0.96, 0.97, 0.98),
  chiziq: rgb(0.86, 0.88, 0.92),
  jadvalHeader: rgb(0.15, 0.18, 0.3),
};

/**
 * LaTeX formulalarini PDF da chiroyli Unicode kimyoviy ko'rinishga keltirish
 */
function toza(matn) {
  if (matn === null || matn === undefined) return "";
  let s = String(matn).trim();

  // Kasrlar: \dfrac{a}{b} va \frac{a}{b} -> (a / b)
  s = s.replace(/\\d?frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");

  // Kasrli sonlar: 0{,}17 -> 0.17
  s = s.replace(/\{,\}/g, ".");
  s = s.replace(/\{(\d+)\}/g, "$1");

  // Matnli teglarni tozalash
  s = s.replace(/\\(?:text|mathrm|mathbf|mathit|textbf)\{([^}]+)\}/g, "$1");

  // Subscript va Superscript larni toza Unicode ga o'girish
  s = s.replace(/\^\{\s*2-\s*\}/g, "²⁻");
  s = s.replace(/\^\{\s*3-\s*\}/g, "³⁻");
  s = s.replace(/\^\{\s*2\+\s*\}/g, "²⁺");
  s = s.replace(/\^\{\s*3\+\s*\}/g, "³⁺");
  s = s.replace(/\^\{\s*\+\s*\}/g, "⁺");
  s = s.replace(/\^\{\s*-\s*\}/g, "⁻");
  s = s.replace(/\^\{\s*([0-9a-zA-Z+-]+)\s*\}/g, "^$1");
  s = s.replace(/\^([0-9+-])/g, "^$1");

  s = s.replace(/_\{umumiy\}/gi, " (umumiy)");
  s = s.replace(/_\{qoldiq\}/gi, " (qoldiq)");
  s = s.replace(/_\{hosil\}/gi, " (hosil)");
  s = s.replace(/_\{sarf\}/gi, " (sarf)");
  s = s.replace(/_\{([0-9a-zA-Z]+)\}/g, "$1");

  s = s.replace(/_2/g, "₂");
  s = s.replace(/_3/g, "₃");
  s = s.replace(/_4/g, "₄");
  s = s.replace(/_5/g, "₅");
  s = s.replace(/_6/g, "₆");
  s = s.replace(/_8/g, "₈");

  // Belgilar
  s = s.replace(/\\cdot/g, " · ");
  s = s.replace(/\\rightarrow/g, " → ");
  s = s.replace(/\\leftrightarrow/g, " ↔ ");
  s = s.replace(/\\Delta/g, "Δ");
  s = s.replace(/\\gamma/g, "γ");
  s = s.replace(/\\omega/g, "ω");
  s = s.replace(/\\times/g, " × ");
  s = s.replace(/\\uparrow/g, "↑");
  s = s.replace(/\\downarrow/g, "↓");
  s = s.replace(/\\alpha/g, "α");
  s = s.replace(/\\beta/g, "β");
  s = s.replace(/\$/g, "");

  return s.trim();
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

  // ─── 1. AKADEMIK HEADER ───
  sahifa.drawRectangle({
    x: 25,
    y: H - 60,
    width: W - 50,
    height: 38,
    color: C.siyohAsos,
  });

  sahifa.drawRectangle({
    x: 25,
    y: H - 62,
    width: W - 50,
    height: 2,
    color: C.oltin,
  });

  sahifa.drawText("JDA KIMYO", {
    x: 38,
    y: H - 42,
    size: 13,
    font: qalin,
    color: C.oq,
  });

  sahifa.drawText("AI KIMYOVIY MASALA VA YECHIM EKSPERTIZASI", {
    x: 125,
    y: H - 41,
    size: 8,
    font: qalin,
    color: rgb(0.82, 0.88, 0.98),
  });

  sahifa.drawText(`ID: ${docId}`, {
    x: W - 140,
    y: H - 41,
    size: 8,
    font: oddiy,
    color: C.oltin,
  });

  // ─── 2. METADATA PASPORTI ───
  const metaY = H - 110;
  sahifa.drawRectangle({
    x: 25,
    y: metaY,
    width: W - 50,
    height: 40,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText("Foydalanuvchi:", { x: 38, y: metaY + 25, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(toza(foydalanuvchiNom), { x: 110, y: metaY + 25, size: 8.5, font: qalin, color: C.qora });

  sahifa.drawText("Yechilgan Sana:", { x: 38, y: metaY + 10, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(sanaVaqt(new Date()), { x: 110, y: metaY + 10, size: 8, font: oddiy, color: C.kulrangToq });

  sahifa.drawText("Mavzu Guruhi:", { x: W / 2 + 10, y: metaY + 25, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(toza(natija.masalaTuri ? natija.masalaTuri.toUpperCase() : "UMUMIY KIMYO"), {
    x: W / 2 + 80,
    y: metaY + 25,
    size: 8.5,
    font: qalin,
    color: C.urguKok,
  });

  sahifa.drawText("Tahlil Rejimi:", { x: W / 2 + 10, y: metaY + 10, size: 7.5, font: oddiy, color: C.kulrangToq });
  sahifa.drawText(rejimNom, { x: W / 2 + 80, y: metaY + 10, size: 8, font: qalin, color: C.oltin });

  let curY = metaY - 18;

  // ─── 3. MASALA SHARTI ───
  sahifa.drawText("1. KIMYOVIY MASALA SHARTI", {
    x: 25,
    y: curY,
    size: 8.5,
    font: qalin,
    color: C.siyohAsos,
  });
  curY -= 12;

  const matn = toza(masalaMatni);
  const qatorlarMatn = matn.match(/.{1,88}(\s|$)/g) || [matn];
  const shartBalandligi = Math.max(24, qatorlarMatn.length * 11 + 10);

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
      y: curY - idx * 11 - 2,
      size: 8,
      font: oddiy,
      color: C.qora,
    });
  });

  curY -= shartBalandligi + 14;

  // ─── 4. PARAMETRLAR JADVALI ───
  const berilgan = natija.berilgan || [];
  const topish = natija.topishKerak || [];

  if (berilgan.length > 0 || topish.length > 0) {
    sahifa.drawText("2. BOSHLANG'ICH PARAMETRLAR VA NOMA'LUMLAR", {
      x: 25,
      y: curY,
      size: 8.5,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 11;

    const jamiQatorlar = Math.max(berilgan.length, topish.length);
    const tableH = (jamiQatorlar + 1) * 13 + 4;

    sahifa.drawRectangle({
      x: 25,
      y: curY - tableH + 8,
      width: W - 50,
      height: tableH,
      color: C.oq,
      borderColor: C.chiziq,
      borderWidth: 1,
    });

    sahifa.drawRectangle({
      x: 25,
      y: curY - 9,
      width: W - 50,
      height: 16,
      color: C.jadvalHeader,
    });

    sahifa.drawText("№", { x: 33, y: curY - 4, size: 7, font: qalin, color: C.oq });
    sahifa.drawText("Berilgan Parametr", { x: 55, y: curY - 4, size: 7, font: qalin, color: C.oq });
    sahifa.drawText("Qiymati", { x: 210, y: curY - 4, size: 7, font: qalin, color: C.oq });
    sahifa.drawText("Topilishi Kerak Bo'lgan Kattalik", { x: W / 2 + 30, y: curY - 4, size: 7, font: qalin, color: C.oq });

    curY -= 18;

    for (let i = 0; i < jamiQatorlar; i++) {
      const b = berilgan[i];
      const t = topish[i];

      if (i % 2 === 1) {
        sahifa.drawRectangle({
          x: 25,
          y: curY - 3,
          width: W - 50,
          height: 13,
          color: C.kulrangOch,
        });
      }

      sahifa.drawText(`${i + 1}`, { x: 33, y: curY, size: 7, font: oddiy, color: C.kulrangToq });
      if (b) {
        sahifa.drawText(toza(b.belgi), { x: 55, y: curY, size: 7.5, font: qalin, color: C.siyohAsos });
        sahifa.drawText(toza(b.qiymat), { x: 210, y: curY, size: 7.5, font: oddiy, color: C.qora });
      }
      if (t) {
        sahifa.drawText(`${toza(t.belgi)}  (${toza(t.nom)})`, {
          x: W / 2 + 30,
          y: curY,
          size: 7.5,
          font: qalin,
          color: C.oltin,
        });
      }
      curY -= 13;
    }

    curY -= 6;
  }

  // ─── 5. KIMYOVIY REAKSIYA VA MUNOSABAT ───
  const tenglamalar = natija.tenglamalar || (natija.tenglama ? [natija.tenglama] : []);
  if (tenglamalar.length > 0) {
    sahifa.drawText("3. KIMYOVIY REAKSIYA TENGLAMASI", {
      x: 25,
      y: curY,
      size: 8.5,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 11;

    const reaksiyaMatn = toza(tenglamalar[0]);
    sahifa.drawRectangle({
      x: 25,
      y: curY - 20,
      width: W - 50,
      height: 24,
      color: rgb(0.94, 0.97, 1),
      borderColor: C.urguKok,
      borderWidth: 1,
    });

    sahifa.drawText(reaksiyaMatn, {
      x: 35,
      y: curY - 13,
      size: 8.5,
      font: qalin,
      color: C.siyohAsos,
    });

    curY -= 28;
  }

  // ─── 6. PEARSON KRESTI (AGAR ERITMA BO'LSA) ───
  if (natija.krestSxemasi?.mavjud || (natija.masalaTuri === "eritmalar" && natija.krestSxemasi)) {
    const ks = natija.krestSxemasi;
    sahifa.drawText("PEARSON DIAGONAL KRESTI SXEMASI", {
      x: 25,
      y: curY,
      size: 8,
      font: qalin,
      color: C.urguKok,
    });
    curY -= 9;

    const krestH = 40;
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
    sahifa.drawText(`${toza(ks.w1 || "ω₁")}`, { x: cx - 130, y: curY - 15, size: 8.5, font: qalin, color: C.siyohAsos });
    sahifa.drawText(`${toza(ks.w2 || "ω₂")}`, { x: cx - 130, y: curY - 33, size: 8.5, font: qalin, color: C.siyohAsos });
    sahifa.drawText(`${toza(ks.wO || "ω_ortacha")}`, { x: cx - 25, y: curY - 24, size: 9, font: qalin, color: C.urguKok });
    sahifa.drawText(`Qism 1: ${toza(ks.qism1 || "q₁")}`, { x: cx + 60, y: curY - 15, size: 8, font: qalin, color: C.yashil });
    sahifa.drawText(`Qism 2: ${toza(ks.qism2 || "q₂")}`, { x: cx + 60, y: curY - 33, size: 8, font: qalin, color: C.yashil });

    sahifa.drawLine({ start: { x: cx - 80, y: curY - 13 }, end: { x: cx + 45, y: curY - 31 }, thickness: 1, color: C.chiziq });
    sahifa.drawLine({ start: { x: cx - 80, y: curY - 31 }, end: { x: cx + 45, y: curY - 13 }, thickness: 1, color: C.chiziq });

    curY -= krestH + 10;
  }

  // ─── 7. BOSQICHMA-BOSQICH ILMIY YECHIM ───
  sahifa.drawText("4. BOSQICHMA-BOSQICH AKADEMIK VA MATEMATIK YECHIM", {
    x: 25,
    y: curY,
    size: 8.5,
    font: qalin,
    color: C.siyohAsos,
  });
  curY -= 11;

  const bosqichlar = natija.bosqichlar || [];
  bosqichlar.slice(0, 5).forEach((b, i) => {
    if (curY < 85) return;

    const sarlavha = toza(b.sarlavha || `${i + 1}-Bosqich`);
    const tushuntirish = toza(b.tushuntirish || b.mantiq || b.matn);
    const formula = toza(b.formula);

    sahifa.drawText(`• ${sarlavha}`, {
      x: 28,
      y: curY,
      size: 8,
      font: qalin,
      color: C.siyohAsos,
    });
    curY -= 11;

    if (tushuntirish) {
      const qatorlar = tushuntirish.match(/.{1,90}(\s|$)/g) || [tushuntirish];
      qatorlar.slice(0, 2).forEach((q) => {
        sahifa.drawText(q.trim(), {
          x: 38,
          y: curY,
          size: 7.5,
          font: oddiy,
          color: C.qora,
        });
        curY -= 9.5;
      });
    }

    if (formula) {
      sahifa.drawText(`   =>   ${formula}`, {
        x: 40,
        y: curY,
        size: 8,
        font: qalin,
        color: C.yashil,
      });
      curY -= 11;
    }

    curY -= 3;
  });

  // ─── 8. YAKUNIY JAVOB KARTASI ───
  if (natija.yakuniyJavob && curY > 55) {
    curY -= 6;
    sahifa.drawRectangle({
      x: 25,
      y: curY - 24,
      width: W - 50,
      height: 26,
      color: C.yashilOch,
      borderColor: C.yashil,
      borderWidth: 1.5,
    });

    sahifa.drawText(`YAKUNIY ILMIY JAVOB:   ${toza(natija.yakuniyJavob)}`, {
      x: 38,
      y: curY - 16,
      size: 9.5,
      font: qalin,
      color: C.yashil,
    });
    curY -= 32;
  }

  // ─── 9. TOZA VA RASMIY AI FOOTER (ORTIQCHA BAHOLASHSIZ) ───
  const footerY = 22;
  sahifa.drawLine({
    start: { x: 25, y: footerY + 14 },
    end: { x: W - 25, y: footerY + 14 },
    thickness: 0.8,
    color: C.chiziq,
  });

  sahifa.drawText("JDA KIMYO AI — AVTOMATIK ILMIY VA MATEMATIK EKSPERTIZA BAYONNOMASI", {
    x: 25,
    y: footerY,
    size: 6.5,
    font: oddiy,
    color: C.kulrang,
  });

  sahifa.drawText(`Hujjat ID: ${docId}   |   jdakimyo.uz`, {
    x: W - 180,
    y: footerY,
    size: 6.5,
    font: oddiy,
    color: C.kulrang,
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
