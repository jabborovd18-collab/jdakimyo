// lib/masala-pdf.js
//
// 4-BOSQICH: Rasmiy Kimyoviy Masala va Yechim Bayonnomasi (PDF Hisoboti).
// pdf-lib va DejaVu Sans shrifti bilan o'zbekcha harflar va formulalar to'liq qo'llab-quvvatlanadi.

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { sanaVaqt } from "./sana.js";

const W = 595.28;
const H = 841.89;

const C = {
  oq: rgb(1, 1, 1),
  qora: rgb(0.08, 0.08, 0.12),
  kulrang: rgb(0.45, 0.45, 0.52),
  kulrangOch: rgb(0.96, 0.96, 0.98),
  chiziq: rgb(0.85, 0.85, 0.88),
  siyoh: rgb(0.18, 0.12, 0.38),
  yashil: rgb(0.1, 0.55, 0.3),
  oltin: rgb(0.8, 0.55, 0.05),
  qizil: rgb(0.8, 0.2, 0.2),
};

function toza(matn) {
  if (matn === null || matn === undefined) return "";
  let s = String(matn).trim();
  // LaTeX sintaksisini toza o'qiladigan matnga aylantirish
  s = s.replace(/\\text\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  s = s.replace(/\\cdot/g, " · ");
  s = s.replace(/\\rightarrow/g, " → ");
  s = s.replace(/\\Delta/g, "Δ");
  s = s.replace(/\\gamma/g, "γ");
  s = s.replace(/\\omega/g, "ω");
  s = s.replace(/\\times/g, " × ");
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
  s = s.replace(/\$/g, "");
  return s;
}

async function baytlar(manzil) {
  const javob = await fetch(manzil);
  if (!javob.ok) throw new Error("Shrift yuklab bo'lmadi: " + manzil);
  return javob.arrayBuffer();
}

/**
 * Kimyoviy masala tahlili va yechimini PDF formatida yuklab beradi.
 *
 * @param {object} p
 * @param {string} p.foydalanuvchiNom - Talaba F.I.Sh.
 * @param {string} p.masalaMatni      - Masala sharti
 * @param {object} p.natija           - Yechim ma'lumotlari
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
      ? "1-Rejim: Keskin Burilish va Tuzoq Tahlili"
      : rejim === "yonalish"
      ? "2-Rejim: Yo'l-yo'riq & Formulalar"
      : "3-Rejim: To'liq Master Yechim";

  doc.setTitle(`Kimyoviy Masala Tahlili — ${toza(foydalanuvchiNom)}`);
  doc.setAuthor("JDA KIMYO Oliy Ta'lim Platformasi");
  doc.setCreator("jdakimyo.uz");

  const sahifa = doc.addPage([W, H]);

  // 1. HEADER
  sahifa.drawRectangle({
    x: 30,
    y: H - 55,
    width: W - 60,
    height: 25,
    color: C.siyoh,
  });

  sahifa.drawText("JDA KIMYO — ILMIY KIMYOVIY MASALALAR TAHLILI", {
    x: 42,
    y: H - 47,
    size: 9.5,
    font: qalin,
    color: C.oq,
  });

  sahifa.drawText("jdakimyo.uz", {
    x: W - 115,
    y: H - 47,
    size: 9,
    font: oddiy,
    color: C.oq,
  });

  sahifa.drawText("KIMYOVIY MASALA VA YECHIM BAYONNOMASI", {
    x: 30,
    y: H - 82,
    size: 14,
    font: qalin,
    color: C.siyoh,
  });

  // Metadatalar
  sahifa.drawText(`Talaba: ${toza(foydalanuvchiNom)}`, {
    x: 30,
    y: H - 102,
    size: 9.5,
    font: qalin,
    color: C.qora,
  });

  sahifa.drawText(`Sana: ${sanaVaqt(new Date())}`, {
    x: 30,
    y: H - 116,
    size: 8.5,
    font: oddiy,
    color: C.kulrang,
  });

  sahifa.drawText(`Rejim: ${rejimNom}`, {
    x: 30,
    y: H - 130,
    size: 8.5,
    font: qalin,
    color: C.oltin,
  });

  sahifa.drawText(`Mavzu: ${toza(natija.masalaTuri || "Umumiy Kimyo")}`, {
    x: W - 200,
    y: H - 102,
    size: 8.5,
    font: oddiy,
    color: C.kulrang,
  });

  sahifa.drawText("Format: AI & Stexiometrik Dvigatel", {
    x: W - 200,
    y: H - 116,
    size: 8,
    font: oddiy,
    color: C.kulrang,
  });

  // Chiziq
  sahifa.drawLine({
    start: { x: 30, y: H - 142 },
    end: { x: W - 30, y: H - 142 },
    thickness: 1,
    color: C.chiziq,
  });

  let curY = H - 160;

  // 2. MASALA SHARTI
  sahifa.drawText("1. Masala Sharti:", {
    x: 30,
    y: curY,
    size: 10,
    font: qalin,
    color: C.siyoh,
  });
  curY -= 16;

  const matn = toza(masalaMatni);
  const qatorlarMatn = matn.match(/.{1,78}(\s|$)/g) || [matn];
  const matnBalandligi = Math.max(30, qatorlarMatn.length * 13 + 12);

  sahifa.drawRectangle({
    x: 30,
    y: curY - matnBalandligi + 10,
    width: W - 60,
    height: matnBalandligi,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  qatorlarMatn.forEach((q, idx) => {
    sahifa.drawText(q.trim(), {
      x: 38,
      y: curY - idx * 13,
      size: 8.5,
      font: oddiy,
      color: C.qora,
    });
  });

  curY -= matnBalandligi + 16;

  // 3. BERILGAN VA TOPISH KERAK
  const berilgan = natija.berilgan || [];
  const topish = natija.topishKerak || [];

  if (berilgan.length > 0 || topish.length > 0) {
    sahifa.drawText("2. Boshlang'ich Parametrlar va Talab:", {
      x: 30,
      y: curY,
      size: 10,
      font: qalin,
      color: C.siyoh,
    });
    curY -= 15;

    const bMatn = berilgan.map((b) => `${toza(b.belgi)}: ${toza(b.qiymat)}`).join("   |   ");
    const tMatn = topish.map((t) => `${toza(t.belgi)} (${toza(t.nom)})`).join("   |   ");

    if (bMatn) {
      sahifa.drawText(`Berilgan: ${bMatn}`, { x: 35, y: curY, size: 8.5, font: oddiy, color: C.qora });
      curY -= 13;
    }
    if (tMatn) {
      sahifa.drawText(`Topish kerak: ${tMatn}`, { x: 35, y: curY, size: 8.5, font: qalin, color: C.oltin });
      curY -= 15;
    }
    curY -= 6;
  }

  // 4. REAKSIYA TENGLAMALARI
  const tenglamalar = natija.tenglamalar || (natija.tenglama ? [natija.tenglama] : []);
  if (tenglamalar.length > 0) {
    sahifa.drawText("Kimyoviy Reaksiyalar:", { x: 30, y: curY, size: 9.5, font: qalin, color: C.siyoh });
    curY -= 14;

    tenglamalar.slice(0, 2).forEach((t) => {
      sahifa.drawText(toza(t), {
        x: 38,
        y: curY,
        size: 8.5,
        font: qalin,
        color: C.siyoh,
      });
      curY -= 14;
    });
    curY -= 4;
  }

  // 5. REJIM BO'YICHA MAXSUS TAHLIL
  if (rejim === "tuzoq" && natija.tuzoqTahlili) {
    sahifa.drawText("3. Masaladagi Nozik Nuqta va Tuzoq Tahlili:", { x: 30, y: curY, size: 10, font: qalin, color: C.oltin });
    curY -= 18;

    sahifa.drawText(`Kalit qoida: ${toza(natija.tuzoqTahlili.kalitNuqta)}`, {
      x: 30,
      y: curY,
      size: 8.5,
      font: qalin,
      color: C.qora,
    });
    curY -= 16;

    if (natija.tuzoqTahlili.kengTarqalganXato) {
      sahifa.drawText(`Keng tarqalgan xato: ${toza(natija.tuzoqTahlili.kengTarqalganXato)}`, {
        x: 30,
        y: curY,
        size: 8,
        font: oddiy,
        color: C.qizil,
      });
      curY -= 16;
    }
  } else if (rejim === "yonalish" && natija.yonalish) {
    sahifa.drawText("3. Yechish Rejasi va Formulalar:", { x: 30, y: curY, size: 10, font: qalin, color: C.siyoh });
    curY -= 18;

    if (natija.yonalish.formulalar?.length > 0) {
      sahifa.drawText(`Formulalar: ${natija.yonalish.formulalar.map(toza).join("  |  ")}`, {
        x: 30,
        y: curY,
        size: 8.5,
        font: qalin,
        color: C.siyoh,
      });
      curY -= 16;
    }

    (natija.yonalish.qadamlarRejasi || []).forEach((q, i) => {
      sahifa.drawText(`${i + 1}. ${toza(q)}`, {
        x: 35,
        y: curY,
        size: 8,
        font: oddiy,
        color: C.qora,
      });
      curY -= 14;
    });
  } else {
    // To'liq yechim bosqichlari
    sahifa.drawText("3. Bosqichma-bosqich Stexiometrik Yechim:", { x: 30, y: curY, size: 10, font: qalin, color: C.siyoh });
    curY -= 16;

    (natija.bosqichlar || []).slice(0, 5).forEach((b, i) => {
      if (curY < 120) return; // Footerga yaqinlashganda to'xtatish

      // 1. Sarlavha
      sahifa.drawText(`${b.sarlavha || `${i + 1}-Bosqich:`}`, {
        x: 30,
        y: curY,
        size: 8.5,
        font: qalin,
        color: C.siyoh,
      });
      curY -= 13;

      // 2. Tushuntirish
      const tushuntirish = toza(b.tushuntirish || b.mantiq || b.matn);
      if (tushuntirish) {
        const qatorlar = tushuntirish.match(/.{1,80}(\s|$)/g) || [tushuntirish];
        qatorlar.slice(0, 2).forEach((q) => {
          sahifa.drawText(toza(q), {
            x: 38,
            y: curY,
            size: 8,
            font: oddiy,
            color: C.qora,
          });
          curY -= 12;
        });
      }

      // 3. Formula
      const formula = toza(b.formula);
      if (formula) {
        sahifa.drawText(`=> ${formula}`, {
          x: 38,
          y: curY,
          size: 8.5,
          font: qalin,
          color: C.yashil,
        });
        curY -= 13;
      }

      curY -= 5;
    });
  }

  // 6. YAKUNIY JAVOB BLOKI
  if (natija.yakuniyJavob && curY > 100) {
    curY -= 10;
    sahifa.drawRectangle({
      x: 30,
      y: curY - 26,
      width: W - 60,
      height: 26,
      color: C.kulrangOch,
      borderColor: C.yashil,
      borderWidth: 1.5,
    });

    sahifa.drawText(`Yakuniy Javob: ${toza(natija.yakuniyJavob)}`, {
      x: 40,
      y: curY - 17,
      size: 9.5,
      font: qalin,
      color: C.yashil,
    });
  }

  // 7. FOOTER
  const footerY = 45;
  sahifa.drawRectangle({
    x: 30,
    y: footerY,
    width: W - 60,
    height: 36,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText("Tekshiruvchi / Ustoz xulosasi: ________________________ (Ball: _____ / 100)", {
    x: 40,
    y: footerY + 22,
    size: 7.5,
    font: oddiy,
    color: C.kulrang,
  });

  sahifa.drawText("Imzo: _______________          Sana: _______________          M.O'.", {
    x: 40,
    y: footerY + 9,
    size: 7.5,
    font: oddiy,
    color: C.kulrang,
  });

  const pdfBaytlar = await doc.save();
  const blob = new Blob([pdfBaytlar], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `JDA-Kimyo-Masala-Yechimi-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
