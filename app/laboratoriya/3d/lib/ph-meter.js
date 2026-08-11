// Eritmadagi kislota, ishqor va ionlar miqdoriga qarab
// pH qiymatini (0.00 - 14.00) va indikator ranglarini hisoblovchi modul.

export function pHHisobla(moddalar = {}) {
  const kalitlar = Object.keys(moddalar);
  if (kalitlar.length === 0) {
    return { ph: 7.0, muhit: "Neytral (Suv)", rang: "#38bdf8", indikatorRang: null };
  }

  let totalH = 0;
  let totalOH = 0;
  let totalVolumeMl = 0;

  kalitlar.forEach((kalit) => {
    const info = moddalar[kalit];

    // DIQQAT: idish holati moddani `{ ml, mol }` ko'rinishida saqlaydi
    // (lib/idish-holati.js). Ilgari bu yerda `.hajm` va `.konsentratsiya`
    // o'qilardi — bunday maydonlar yo'q, ya'ni `ml` doim 0 chiqib,
    // `moles` ham 0 bo'lardi va pH-metr nima quyilishidan qat'i nazar
    // har doim 7.0 "Neytral" ko'rsatardi.
    const ml = info?.ml || 0;
    const moles = info?.mol || 0;
    totalVolumeMl += ml;

    // Kislotalar
    if (["HCl", "HNO₃"].includes(kalit)) {
      totalH += moles;
    } else if (kalit === "H₂SO₄") {
      totalH += moles * 2;
    }
    // Ishqorlar
    else if (["NaOH", "KOH"].includes(kalit)) {
      totalOH += moles;
    } else if (kalit === "Ca(OH)₂" || kalit === "Ba(OH)₂") {
      totalOH += moles * 2;
    }
  });

  if (totalVolumeMl <= 0) {
    return { ph: 7.0, muhit: "Neytral", rang: "#38bdf8", indikatorRang: null };
  }

  let ph = 7.0;
  let muhit = "Neytral";
  let rang = "#38bdf8";
  let indikatorRang = "#ffffff"; // Fenolftalein rangsiz

  const netMolesH = totalH - totalOH;
  const netMolesOH = totalOH - totalH;

  if (Math.abs(netMolesH) < 1e-7) {
    ph = 7.0;
    muhit = "Neytral (Muvozanatlangan)";
    rang = "#22c55e";
    indikatorRang = "#ffffff";
  } else if (netMolesH > 0) {
    const concH = netMolesH / (totalVolumeMl / 1000);
    ph = Math.max(0.1, Math.min(6.99, -Math.log10(concH)));
    muhit = ph < 3 ? "Kuchli Kislotali" : "Kuchli bo'lmagan Kislotali";
    rang = "#ef4444";
    // Metiloranj kislotada qizil
    indikatorRang = "#f43f5e";
  } else {
    const concOH = netMolesOH / (totalVolumeMl / 1000);
    const pOH = -Math.log10(concOH);
    ph = Math.min(13.9, Math.max(7.01, 14 - pOH));
    muhit = ph > 11 ? "Kuchli Ishqoriy" : "Och Ishqoriy";
    rang = "#a855f7";
    // Fenolftalein ishqorda pushti
    indikatorRang = "#ec4899";
  }

  return {
    ph: Number(ph.toFixed(2)),
    muhit,
    rang,
    indikatorRang,
  };
}
