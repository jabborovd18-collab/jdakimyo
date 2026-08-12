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
  return String(matn).trim();
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
    y: H - 85,
    size: 14,
    font: qalin,
    color: C.siyoh,
  });

  // 2. META GRID
  const metaY = H - 110;
  sahifa.drawText(`Talaba: ${toza(foydalanuvchiNom)}`, { x: 30, y: metaY, size: 9.5, font: qalin, color: C.qora });
  sahifa.drawText(`Sana: ${sanaVaqt(new Date())}`, { x: 30, y: metaY - 15, size: 8.5, font: oddiy, color: C.qora });
  sahifa.drawText(`Rejim: ${rejimNom}`, { x: 30, y: metaY - 30, size: 9, font: qalin, color: C.oltin });

  sahifa.drawText(`Mavzu: ${toza(natija.turi || "Stexiometriya")}`, { x: W - 200, y: metaY, size: 9, font: oddiy, color: C.qora });
  sahifa.drawText(`Format: AI & Stexiometrik Dvigatel`, { x: W - 200, y: metaY - 15, size: 8.5, font: oddiy, color: C.kulrang });

  // 3. MASALA SHARTI
  let curY = H - 165;
  sahifa.drawText("1. Masala Sharti:", { x: 30, y: curY, size: 10, font: qalin, color: C.siyoh });
  curY -= 8;

  sahifa.drawRectangle({
    x: 30,
    y: curY - 36,
    width: W - 60,
    height: 36,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  const qisqaMatn = toza(masalaMatni).slice(0, 160) + (masalaMatni.length > 160 ? "..." : "");
  sahifa.drawText(qisqaMatn, {
    x: 40,
    y: curY - 22,
    size: 8.5,
    font: oddiy,
    color: C.qora,
  });
  curY -= 50;

  // 4. REAKSIYA TENGLAMASI
  if (natija.tenglama) {
    sahifa.drawText("2. Asosiy Kimyoviy Munosabat / Reaksiya:", { x: 30, y: curY, size: 10, font: qalin, color: C.siyoh });
    curY -= 25;

    sahifa.drawRectangle({
      x: 30,
      y: curY,
      width: W - 60,
      height: 22,
      color: C.kulrangOch,
      borderColor: C.chiziq,
      borderWidth: 1,
    });

    sahifa.drawText(toza(natija.tenglama), {
      x: 40,
      y: curY + 6,
      size: 9,
      font: qalin,
      color: C.siyoh,
    });
    curY -= 20;
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
      sahifa.drawText(`Formulalar: ${natija.yonalish.formulalar.join("  |  ")}`, {
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
    curY -= 18;

    (natija.bosqichlar || []).slice(0, 4).forEach((b) => {
      sahifa.drawText(toza(b.sarlavha), {
        x: 30,
        y: curY,
        size: 8.5,
        font: qalin,
        color: C.siyoh,
      });
      curY -= 13;

      const qatorlar = toza(b.matn).split("\n").slice(0, 2);
      qatorlar.forEach((q) => {
        sahifa.drawText(toza(q), {
          x: 35,
          y: curY,
          size: 8,
          font: oddiy,
          color: C.qora,
        });
        curY -= 12;
      });
      curY -= 4;
    });
  }

  // 6. YAKUNIY JAVOB BLOKI
  if (natija.yakuniyJavob) {
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

    sahifa.drawText(`Javob: ${toza(natija.yakuniyJavob)}`, {
      x: 40,
      y: curY - 17,
      size: 9.5,
      font: qalin,
      color: C.yashil,
    });
  }

  // 7. FOOTER
  const footerY = 55;
  sahifa.drawRectangle({
    x: 30,
    y: footerY,
    width: W - 60,
    height: 40,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText("Tekshiruvchi / Ustoz xulosasi: ________________________ (Ball: _____ / 100)", {
    x: 40,
    y: footerY + 24,
    size: 8,
    font: oddiy,
    color: C.qora,
  });

  sahifa.drawText("Imzo: _________________________        Sana: ___________________        M.O'.", {
    x: 40,
    y: footerY + 9,
    size: 8,
    font: oddiy,
    color: C.kulrang,
  });

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Masala_Yechimi_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { ochildi: true };
}
