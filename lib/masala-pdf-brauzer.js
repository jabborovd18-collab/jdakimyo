// Asosiy yo'l serverdagi Chromium orqali vektorli PDF yaratadi. Eski rastr
// yo'li faqat server vaqtincha ishlamasa foydalanuvchini PDF'siz qoldirmaslik
// uchun saqlanadi.

import { masalaPdfHtmlYarat, MASALA_PDF_USLUBI } from "./masala-pdf-html.js";
import { latexniOddiyMatnga } from "./latex-oddiy-matn.js";

function formulalarniSigdir(maqola) {
  const formulalar = maqola.querySelectorAll(".pdf-formula .pdf-render-formula");
  for (const formula of formulalar) {
    const katex = formula.querySelector(".katex");
    const qobiq = formula.closest(".pdf-formula");
    if (!katex || !qobiq) continue;
    const mavjudKenglik = Math.max(80, qobiq.clientWidth - 18);

    for (let urinish = 0; urinish < 6; urinish += 1) {
      const kerakliKenglik = katex.getBoundingClientRect().width;
      if (kerakliKenglik <= mavjudKenglik + 1) break;
      const hozirgi = Number.parseFloat(getComputedStyle(katex).fontSize) || 16;
      const keyingi = Math.max(9, hozirgi * (mavjudKenglik / kerakliKenglik) * 0.97);
      katex.style.fontSize = `${keyingi}px`;
      if (keyingi <= 9) break;
    }

    // Juda uzun ifoda kichrayganda ham sig'masa, kesib yuborish o'rniga
    // o'qiladigan va qatorga bo'linadigan xom ko'rinish saqlanadi.
    if (katex.getBoundingClientRect().width > mavjudKenglik + 1) {
      const xom = formula.dataset.latex || katex.textContent || "";
      formula.replaceChildren();
      const kod = document.createElement("code");
      kod.className = "pdf-xom-formula";
      kod.textContent = latexniOddiyMatnga(xom);
      formula.appendChild(kod);
    }
  }
}

function sahifaIchidaElementlarniSaqlash(maqola, sahifaBalandligi) {
  maqola.querySelectorAll(".pdf-sahifa-oraliq").forEach((oraliq) => oraliq.remove());
  const elementlar = maqola.querySelectorAll([
    ".pdf-header",
    "section:not(.pdf-yakun) > h1",
    "section:not(.pdf-yakun) > h2",
    ".pdf-karta",
    ".pdf-bosqich",
    ".pdf-yakun",
    ".pdf-jadval-asosiy",
    ".pdf-jadval",
    ".pdf-grafik",
    ".pdf-reja",
  ].join(", "));

  for (const element of elementlar) {
    const maqolaTop = maqola.getBoundingClientRect().top;
    const rect = element.getBoundingClientRect();
    const yuqori = rect.top - maqolaTop;
    const uslub = getComputedStyle(element);
    let balandlik = rect.height + (Number.parseFloat(uslub.marginBottom) || 0);
    if (element.matches("h1, h2")) {
      const keyingi = element.nextElementSibling;
      if (keyingi && !keyingi.classList.contains("pdf-sahifa-oraliq")) {
        const keyingiRect = keyingi.getBoundingClientRect();
        balandlik = Math.min(
          sahifaBalandligi - 10,
          Math.max(balandlik + 70, keyingiRect.bottom - rect.top),
        );
      } else {
        balandlik += 70;
      }
    }
    const sahifadagiJoy = yuqori % sahifaBalandligi;
    const qolganJoy = sahifaBalandligi - sahifadagiJoy;

    // Alohida oraliq margin kollapsiga tushmaydi; shu sabab keyingi blok
    // sahifa boshiga aniq ko'chadi va avvalgi matn bilan ustma-ust tushmaydi.
    if (balandlik < sahifaBalandligi && balandlik + 8 > qolganJoy && sahifadagiJoy > 2) {
      const oraliq = document.createElement("div");
      oraliq.className = "pdf-sahifa-oraliq";
      oraliq.style.height = `${qolganJoy + 2}px`;
      element.before(oraliq);
    }
  }
}

async function premiumPdfniOl(sozlamalar) {
  const boshqaruvchi = new AbortController();
  const taymer = window.setTimeout(() => boshqaruvchi.abort(), 55_000);
  try {
    const javob = await fetch("/api/masala/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: boshqaruvchi.signal,
      body: JSON.stringify({
        masalaMatni: sozlamalar?.masalaMatni || sozlamalar?.natija?.masalaMatni || "",
        natija: sozlamalar?.natija || {},
      }),
    });
    if (!javob.ok) {
      const xato = await javob.json().catch(() => null);
      throw new Error(xato?.xato || `PDF serveri ${javob.status} xato qaytardi.`);
    }
    if (!javob.headers.get("content-type")?.includes("application/pdf")) {
      throw new Error("PDF serveri noto'g'ri javob qaytardi.");
    }

    const baytlar = new Uint8Array(await javob.arrayBuffer());
    if (sozlamalar?.yuklabOl !== false) {
      const blob = new Blob([baytlar], { type: "application/pdf" });
      const manzil = URL.createObjectURL(blob);
      const havola = document.createElement("a");
      havola.href = manzil;
      havola.download = `JDA-Kimyo-Premium-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(havola);
      havola.click();
      havola.remove();
      window.setTimeout(() => URL.revokeObjectURL(manzil), 1_000);
    }
    return baytlar;
  } finally {
    window.clearTimeout(taymer);
  }
}

async function rastrPdfBrauzerdaYukla(sozlamalar) {
  const yuklabOl = sozlamalar?.yuklabOl !== false;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const qobiq = document.createElement("div");
  qobiq.setAttribute("aria-hidden", "true");
  qobiq.style.position = "fixed";
  qobiq.style.left = "-100000px";
  qobiq.style.top = "0";
  qobiq.style.width = "794px";
  qobiq.style.background = "#ffffff";

  const uslub = document.createElement("style");
  uslub.textContent = MASALA_PDF_USLUBI;
  qobiq.appendChild(uslub);

  const kontent = document.createElement("div");
  kontent.innerHTML = masalaPdfHtmlYarat(sozlamalar);
  qobiq.appendChild(kontent);
  document.body.appendChild(qobiq);

  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const maqola = qobiq.querySelector(".jda-pdf");
    const a4W = 595.28;
    const a4H = 841.89;
    const yuqoriChegara = 28;
    const yonChegara = 28;
    const quyiChegara = 42;
    const ichkiW = a4W - yonChegara * 2;
    const ichkiH = a4H - yuqoriChegara - quyiChegara;
    const cssSahifaBalandligi = ichkiH * (maqola.offsetWidth / ichkiW);
    formulalarniSigdir(maqola);
    sahifaIchidaElementlarniSaqlash(maqola, cssSahifaBalandligi);

    const canvas = await html2canvas(maqola, {
      backgroundColor: "#ffffff",
      scale: 1.6,
      useCORS: true,
      logging: false,
      windowWidth: 794,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const sahifaW = pdf.internal.pageSize.getWidth();
    const sahifaH = pdf.internal.pageSize.getHeight();
    const haqiqiyIchkiW = sahifaW - yonChegara * 2;
    const haqiqiyIchkiH = sahifaH - yuqoriChegara - quyiChegara;
    const pikselNisbat = haqiqiyIchkiW / canvas.width;
    const bolakBalandligi = Math.max(1, Math.floor(haqiqiyIchkiH / pikselNisbat));

    let yuqori = 0;
    let sahifaIndeksi = 0;
    while (yuqori < canvas.height) {
      const joriyBalandlik = Math.min(bolakBalandligi, canvas.height - yuqori);
      const bolak = document.createElement("canvas");
      bolak.width = canvas.width;
      bolak.height = joriyBalandlik;
      const context = bolak.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, bolak.width, bolak.height);
      context.drawImage(
        canvas,
        0,
        yuqori,
        canvas.width,
        joriyBalandlik,
        0,
        0,
        canvas.width,
        joriyBalandlik,
      );

      if (sahifaIndeksi > 0) pdf.addPage();
      pdf.addImage(
        bolak.toDataURL("image/png"),
        "PNG",
        yonChegara,
        yuqoriChegara,
        haqiqiyIchkiW,
        joriyBalandlik * pikselNisbat,
        undefined,
        "FAST",
      );

      yuqori += joriyBalandlik;
      sahifaIndeksi += 1;
    }

    const jamiSahifalar = pdf.getNumberOfPages();
    for (let sahifaRaqami = 1; sahifaRaqami <= jamiSahifalar; sahifaRaqami++) {
      pdf.setPage(sahifaRaqami);
      pdf.setDrawColor(219, 226, 234);
      pdf.line(yonChegara, sahifaH - 28, sahifaW - yonChegara, sahifaH - 28);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text("JDA KIMYO AI · jdakimyo.uz", yonChegara, sahifaH - 16);
      pdf.text(`${sahifaRaqami} / ${jamiSahifalar}`, sahifaW - yonChegara, sahifaH - 16, {
        align: "right",
      });
    }

    const faylNomi = `JDA-Kimyo-Akademik-Tahlil-${Date.now()}.pdf`;
    if (yuklabOl) pdf.save(faylNomi);
    return new Uint8Array(pdf.output("arraybuffer"));
  } finally {
    qobiq.remove();
  }
}

export async function masalaPdfBrauzerdaYukla(sozlamalar) {
  try {
    return await premiumPdfniOl(sozlamalar);
  } catch (xato) {
    // Vektorli yo'l ishlamagan paytda ham o'quvchi natijasini oladi; sabab
    // konsolda qoladi va keyingi deploy diagnostikasida ko'rinadi.
    console.warn("[Premium PDF zaxira rejimiga o'tdi]", xato);
    return rastrPdfBrauzerdaYukla(sozlamalar);
  }
}
