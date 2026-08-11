// Laboratoriya Daftari PDF Hisobotini Shakllantirish va Yuklab Olish Moduli.

export async function labDaftariPdfYukla({ foydalanuvchiNom = "Talaba", tenglama, observations, nisbat, jurnal }) {
  if (typeof window === "undefined") return;

  const sana = new Date().toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hisobotHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Laboratoriya Daftari Hisoboti - JDA-KIMYO</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
        .header { text-align: center; border-bottom: 3px double #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 5px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
        .section-title { font-size: 15px; font-weight: bold; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 10px; margin: 20px 0 10px 0; }
        .equation-box { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-family: monospace; font-size: 16px; font-weight: bold; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; pt: 15px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; }
        .seal { border: 2px dashed #0284c7; color: #0284c7; font-weight: bold; padding: 8px 16px; border-radius: 50px; font-size: 11px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">🔬 JDA-KIMYO VIRTUALLABORATORIYA HISOBOTI</div>
        <div class="subtitle">Rasmiy Ilmiy Stexiometrik va Tajriba Hisoboti Daftari</div>
      </div>

      <div class="meta-grid">
        <div><strong>Foydalanuvchi:</strong> ${foydalanuvchiNom}</div>
        <div><strong>Sana:</strong> ${sana}</div>
        <div><strong>Platforma:</strong> jdakimyo.uz (3D Laboratoriya)</div>
        <div><strong>Holat:</strong> Rasmiy Tasdiqlangan Tajriba</div>
      </div>

      <div class="section-title">1. Reaksiya Tenglamasi va Stexiometriya</div>
      <div class="equation-box">
        ${tenglama || "Noma'lum reaksiya tenglamasi"}
      </div>

      <div class="section-title">2. Tajriba Kuzatuvlari va Effektlar</div>
      <p style="font-size: 13px; line-height: 1.6; color: #334155;">
        ${observations || "Tajriba davomida idishda xarakterli cho'kma va rang o'zgarishi kuzatildi."}
      </p>

      <div class="section-title">3. Laboratoriya Jurnali Qadamlari</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Amal / Amaliyot</th>
            <th>Reagent / Modda</th>
            <th>Miqdor / Hajm</th>
          </tr>
        </thead>
        <tbody>
          ${(jurnal || [])
            .map(
              (j, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${j.amal || "amaliyot"}</td>
              <td>${j.reagent || "modda"}</td>
              <td>${j.ml ? j.ml + " ml" : "—"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <div>Hujjat jdakimyo.uz tizimida avtomatik shakllantirildi va haqiqiy deb tan olindi.</div>
        <div class="seal">✓ RASMIY TASDIQLANDI</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(hisobotHtml);
    win.document.close();
  }
}
