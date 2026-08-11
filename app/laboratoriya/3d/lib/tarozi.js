// Analitik tarozi hisoblash dvigateli (Digital Analytical Balance).
// Idish bo'sh massasi va undagi suyuqlik hamda moddalarining aniq gramm massasi.

const IDISH_BOSH_MASSASI = {
  probirka: 15.45,
  kolba: 85.2,
  stakan: 62.8,
  kolba_vazir: 110.0,
  stakan_olchov: 45.0,
};

export function massaHisobla(idishKaliti = "probirka", moddalar = {}, taraMassa = 0) {
  const boshMassa = IDISH_BOSH_MASSASI[idishKaliti] || 15.45;
  let suyuqlikMassa = 0;

  Object.values(moddalar).forEach((m) => {
    // `.hajm` EMAS, `.ml`: idish holati moddani `{ ml, mol }` bo'lib
    // saqlaydi (lib/idish-holati.js). Noto'g'ri maydon o'qilgani uchun
    // tarozi suyuqlik massasini har doim 0 ko'rsatardi — ekranda faqat
    // bo'sh idishning og'irligi turardi.
    const ml = m?.ml || 0;
    // O'rtacha suyuqlik zichligi ~1.0 g/ml
    suyuqlikMassa += ml * 1.0;
  });

  const bruttoMassa = boshMassa + suyuqlikMassa;
  const nettoMassa = Math.max(0, bruttoMassa - taraMassa);

  return {
    bruttoMassa: Number(bruttoMassa.toFixed(3)),
    nettoMassa: Number(nettoMassa.toFixed(3)),
    boshMassa,
    suyuqlikMassa: Number(suyuqlikMassa.toFixed(3)),
  };
}
