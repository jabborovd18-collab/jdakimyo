// Laboratoriya daftari hisobotini chop etish / PDF qilib saqlash.
//
// NEGA BRAUZER CHOP ETISHI, jsPDF EMAS. O'zbek yozuvidagi apostrof
// (o', g' — U+2018/2019) jsPDF ning standart shriftlarida umuman
// chiqmaydi; uni tuzatish uchun TTF shriftni faylga joylash kerak, bu
// esa bundle'ga yuzlab kilobayt qo'shadi. Brauzerning o'z chop etish
// oynasi esa "PDF qilib saqlash" ni allaqachon beradi va shriftlar
// tizimniki bo'lgani uchun harflar to'g'ri chiqadi.
//
// XAVFSIZLIK. Bu yerdagi hamma qiymat — foydalanuvchi ismi, kuzatuv
// matni, tenglama, jurnal yozuvlari — HTML ga qo'yiladi. Ilgari ular
// xom holda `document.write` ga uzatilardi, ya'ni ism ichidagi
// `<script>` yangi oynada bajarilardi. Endi hammasi `xavfsiz()` dan
// o'tadi.

/** HTML ga qo'yishdan oldin belgilarni zararsizlantirish */
function xavfsiz(matn) {
  return String(matn ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function labDaftariPdfYukla({
  foydalanuvchiNom = "Talaba",
  tenglama,
  observations,
  nisbat,
  jurnal,
}) {
  if (typeof window === "undefined") return { ochildi: false, sabab: "server" };

  const sana = new Date().toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const qatorlar = (jurnal || [])
    .map(
      (j, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${xavfsiz(j.amal || "amaliyot")}</td>
          <td>${xavfsiz(j.reagent || "modda")}</td>
          <td>${j.ml ? xavfsiz(j.ml) + " ml" : "&mdash;"}</td>
        </tr>`
    )
    .join("");

  const nisbatQatori = nisbat?.izoh
    ? `<p class="nisbat">${xavfsiz(nisbat.izoh)}</p>`
    : "";

  const hisobotHtml = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <title>Laboratoriya daftari — JDA-KIMYO</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
    .header { text-align: center; border-bottom: 3px double #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 22px; font-weight: bold; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 5px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
    .section-title { font-size: 15px; font-weight: bold; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 10px; margin: 20px 0 10px 0; }
    .equation-box { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-family: monospace; font-size: 16px; font-weight: bold; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
    .nisbat { font-size: 12px; color: #475569; background: #f8fafc; border-left: 3px solid #94a3b8; padding: 8px 12px; margin-top: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .belgi { border: 2px dashed #94a3b8; color: #64748b; font-weight: bold; padding: 8px 16px; border-radius: 50px; font-size: 11px; text-transform: uppercase; white-space: nowrap; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">JDA-KIMYO — virtual laboratoriya daftari</div>
    <div class="subtitle">O&#39;quv maqsadida yaratilgan tajriba yozuvi</div>
  </div>

  <div class="meta-grid">
    <div><strong>Foydalanuvchi:</strong> ${xavfsiz(foydalanuvchiNom)}</div>
    <div><strong>Sana:</strong> ${xavfsiz(sana)}</div>
    <div><strong>Platforma:</strong> jdakimyo.uz (3D laboratoriya)</div>
    <div><strong>Turi:</strong> Virtual tajriba</div>
  </div>

  <div class="section-title">1. Reaksiya tenglamasi</div>
  <div class="equation-box">${xavfsiz(tenglama || "Reaksiya tenglamasi yozilmagan")}</div>
  ${nisbatQatori}

  <div class="section-title">2. Kuzatuvlar</div>
  <p style="font-size: 13px; line-height: 1.6; color: #334155;">
    ${xavfsiz(observations || "Kuzatuv yozilmagan.")}
  </p>

  <div class="section-title">3. Laboratoriya jurnali</div>
  <table>
    <thead>
      <tr><th>#</th><th>Amal</th><th>Reagent</th><th>Miqdor</th></tr>
    </thead>
    <tbody>${qatorlar || '<tr><td colspan="4">Yozuv yo&#39;q</td></tr>'}</tbody>
  </table>

  <div class="footer">
    <div>
      Hujjat jdakimyo.uz virtual laboratoriyasida avtomatik shakllantirildi.
      Bu o&#39;quv yozuvi &mdash; rasmiy hujjat emas va haqiqiy laboratoriya
      bayonnomasi o&#39;rnini bosmaydi.
    </div>
    <div class="belgi">O&#39;quv nusxasi</div>
  </div>

  <script>
    window.onload = function () { window.print(); };
  </script>
</body>
</html>`;

  // Popup bloklovchi oynani jimgina to'sib qo'yishi mumkin — bunda
  // foydalanuvchi "tugma ishlamadi" deb o'ylaydi. Shuning uchun natija
  // qaytariladi va chaqiruvchi xabar ko'rsata oladi.
  const win = window.open("", "_blank");
  if (!win) {
    return {
      ochildi: false,
      sabab:
        "Brauzer yangi oynani to'sdi. Manzil qatoridagi qalqib chiquvchi " +
        "oynalar ruxsatini yoqing va qaytadan urinib ko'ring.",
    };
  }

  win.document.write(hisobotHtml);
  win.document.close();
  return { ochildi: true };
}
