// app/laboratoriya/3d/lib/pdf-hisobot.js
//
// 5-BOSQICH: Rasmiy Laboratoriya Tajriba Daftari (PDF Hisoboti).
// pdf-lib va DejaVu Sans shrifti bilan brauzerda to'g'ridan-to'g'ri PDF yaratiladi.
//
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { sanaVaqt } from "@/lib/sana";

const W = 595.28;
const H = 841.89;

const C = {
  oq: rgb(1, 1, 1),
  qora: rgb(0.08, 0.08, 0.12),
  kulrang: rgb(0.45, 0.45, 0.52),
  kulrangOch: rgb(0.95, 0.95, 0.97),
  chiziq: rgb(0.85, 0.85, 0.88),
  siyoh: rgb(0.18, 0.12, 0.38),
  yashil: rgb(0.1, 0.55, 0.3),
  oltin: rgb(0.75, 0.55, 0.05),
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
 * Rasmiy Laboratoriya Daftari PDF hisobotini yaratib, yuklab beradi.
 *
 * @param {object} p
 * @param {string} p.foydalanuvchiNom - Talaba F.I.Sh.
 * @param {string} p.tenglama         - Reaksiya tenglamasi
 * @param {string} p.observations     - Kuzatuv matni
 * @param {object} p.nisbat           - Stexiometriya bahosi
 * @param {object} p.kinetika         - Kinetika va unum tahlili
 * @param {Array}  p.jurnal           - Jurnal qadamlari
 */
export async function labDaftariPdfYukla({
  foydalanuvchiNom = "Talaba",
  tenglama = "Reaksiya",
  observations = "",
  nisbat = null,
  kinetika = null,
  jurnal = [],
}) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const [rBaytlar, bBaytlar] = await Promise.all([
    baytlar("/fonts/DejaVuSans.ttf"),
    baytlar("/fonts/DejaVuSans-Bold.ttf"),
  ]);

  const oddiy = await doc.embedFont(rBaytlar, { subset: true });
  const qalin = await doc.embedFont(bBaytlar, { subset: true });

  doc.setTitle(`Laboratoriya Daftari — ${toza(foydalanuvchiNom)}`);
  doc.setAuthor("JDA KIMYO Virtual Laboratoriya");
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

  sahifa.drawText("JDA KIMYO — 3D VIRTUAL LABORATORIYA HISOBOTI", {
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

  sahifa.drawText("LABORATORIYA TAJRIBA BAYONNOMASI", {
    x: 30,
    y: H - 85,
    size: 15,
    font: qalin,
    color: C.siyoh,
  });

  // 2. META GRID
  const metaY = H - 110;
  sahifa.drawText(`Talaba: ${toza(foydalanuvchiNom)}`, { x: 30, y: metaY, size: 9.5, font: qalin, color: C.qora });
  sahifa.drawText(`Sana: ${sanaVaqt(new Date())}`, { x: 30, y: metaY - 15, size: 9, font: oddiy, color: C.qora });
  sahifa.drawText(`Tajriba turi: 3D Virtual amaliyot`, { x: 30, y: metaY - 30, size: 9, font: oddiy, color: C.qora });

  const unum = kinetika?.unumFoizi || 92.5;
  const T = kinetika?.harorat || 25;

  sahifa.drawText(`Reaksiya unumi: ${unum}%`, { x: W - 200, y: metaY, size: 9.5, font: qalin, color: C.yashil });
  sahifa.drawText(`Harorat: ${T}°C`, { x: W - 200, y: metaY - 15, size: 9, font: oddiy, color: C.qora });
  sahifa.drawText(`Nisbat: ${toza(nisbat?.holat || "To'g'ri")}`, { x: W - 200, y: metaY - 30, size: 9, font: oddiy, color: C.qora });

  // 3. REAKSIYA TENGLAMASI
  const tenglamaY = H - 165;
  sahifa.drawText("1. Kimyoviy Reaksiya Tenglamasi:", { x: 30, y: tenglamaY, size: 10, font: qalin, color: C.siyoh });

  sahifa.drawRectangle({
    x: 30,
    y: tenglamaY - 30,
    width: W - 60,
    height: 24,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText(toza(tenglama), {
    x: 40,
    y: tenglamaY - 22,
    size: 9.5,
    font: qalin,
    color: C.siyoh,
  });

  // 4. KUZATUVLAR VA XULOSA
  const kuzatuvY = tenglamaY - 55;
  sahifa.drawText("2. Kuzatilgan Hodisalar va Xulosalar:", { x: 30, y: kuzatuvY, size: 10, font: qalin, color: C.siyoh });

  sahifa.drawText(`Kuzatuv: ${toza(observations || "O'zgarishlar qayd etildi.")}`, {
    x: 30,
    y: kuzatuvY - 16,
    size: 8.5,
    font: oddiy,
    color: C.qora,
  });

  if (nisbat?.izoh) {
    sahifa.drawText(`Stexiometriya tahlili: ${toza(nisbat.izoh)}`, {
      x: 30,
      y: kuzatuvY - 30,
      size: 8.5,
      font: oddiy,
      color: C.kulrang,
    });
  }

  // 5. LABORATORIYA JURNALI JADVALI
  const jadvalY = kuzatuvY - 60;
  sahifa.drawText("3. Qadam-baqadam Amaliyot Jurnali:", { x: 30, y: jadvalY, size: 10, font: qalin, color: C.siyoh });

  sahifa.drawRectangle({
    x: 30,
    y: jadvalY - 24,
    width: W - 60,
    height: 20,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText("№", { x: 40, y: jadvalY - 17, size: 8, font: qalin, color: C.qora });
  sahifa.drawText("Bajarilgan amal", { x: 75, y: jadvalY - 17, size: 8, font: qalin, color: C.qora });
  sahifa.drawText("Reagent / Modda", { x: 220, y: jadvalY - 17, size: 8, font: qalin, color: C.qora });
  sahifa.drawText("Miqdori (ml/g)", { x: 420, y: jadvalY - 17, size: 8, font: qalin, color: C.qora });

  let qatorY = jadvalY - 24;
  const qatorlar = jurnal.slice(0, 12); // Birinchi 12 qadam

  qatorlar.forEach((j, i) => {
    qatorY -= 18;
    sahifa.drawLine({
      start: { x: 30, y: qatorY },
      end: { x: W - 30, y: qatorY },
      color: C.chiziq,
      thickness: 0.5,
    });

    sahifa.drawText(String(i + 1), { x: 40, y: qatorY + 5, size: 7.5, font: oddiy, color: C.kulrang });
    sahifa.drawText(toza(j.amal || "quyish"), { x: 75, y: qatorY + 5, size: 8, font: oddiy, color: C.qora });
    sahifa.drawText(toza(j.reagent || "Modda"), { x: 220, y: qatorY + 5, size: 8, font: qalin, color: C.qora });
    sahifa.drawText(j.ml ? `${j.ml} ml` : "—", { x: 420, y: qatorY + 5, size: 8, font: oddiy, color: C.qora });
  });

  // 6. O'QITUVCHI BAHOSI VA IMZO
  const footerY = 70;
  sahifa.drawRectangle({
    x: 30,
    y: footerY,
    width: W - 60,
    height: 45,
    color: C.kulrangOch,
    borderColor: C.chiziq,
    borderWidth: 1,
  });

  sahifa.drawText("O'qituvchi xulosasi va bahosi: ____________________ (Ball: _____ / 100)", {
    x: 40,
    y: footerY + 26,
    size: 8.5,
    font: oddiy,
    color: C.qora,
  });

  sahifa.drawText("Imzo: _________________________        Sana: ___________________        M.O'.", {
    x: 40,
    y: footerY + 10,
    size: 8.5,
    font: oddiy,
    color: C.kulrang,
  });

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Lab_Hisoboti_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { ochildi: true };
}
