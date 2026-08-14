// app/laboratoriya/3d/lib/tarozi.js
//
// Analitik tarozi hisoblash dvigateli (Digital Analytical Balance).
// Idish bo'sh massasi va undagi suyuqlik hamda moddalarining aniq gramm massasi.

export const IDISH_BOSH_MASSASI = {
  probirka: 15.45,
  kolba: 85.2,
  "konussimon-kolba": 85.2,
  stakan: 62.8,
  "olchov-kolba": 82.5,
  "olchov-silindr": 54.0,
  "soat-shishasi": 18.2,
  "dumaloq-tubli-kolba": 98.0,
  kristallizator: 65.0,
  "chinni-kosa": 42.3,
  voronka: 22.1,
  "shisha-tayoqcha": 12.0,
  spatula: 16.5,
};

/**
 * Tarozidagi brutto, netto va modda massasini aniq hisoblaydi.
 *
 * @param {string|null} idishKaliti - Tarozidagi idish kaliti (null bo'lsa tarozi bo'sh)
 * @param {object} moddalar - Idishdagi moddalar ({ [kalit]: { ml, mol, gramm } })
 * @param {number} taraMassa - Nolga tenglashtirilgan tara massasi (g)
 */
export function massaHisobla(idishKaliti = null, moddalar = {}, taraMassa = 0) {
  // Agar tarozi pallasida idish bo'lmasa -> 0.000 g
  if (!idishKaliti) {
    const netto = taraMassa > 0 ? -taraMassa : 0;
    return {
      bruttoMassa: 0,
      nettoMassa: Number(netto.toFixed(3)),
      boshMassa: 0,
      moddaMassa: 0,
      idishBormi: false,
    };
  }

  const boshMassa = IDISH_BOSH_MASSASI[idishKaliti] || 15.45;
  let moddaMassa = 0;

  Object.values(moddalar || {}).forEach((m) => {
    if (m?.gramm !== undefined && m.gramm > 0) {
      moddaMassa += Number(m.gramm);
    } else {
      const ml = m?.ml || 0;
      // O'rtacha suyuqlik zichligi ~1.0 g/ml
      moddaMassa += ml * 1.0;
    }
  });

  const bruttoMassa = boshMassa + moddaMassa;
  const nettoMassa = bruttoMassa - taraMassa;

  return {
    bruttoMassa: Number(bruttoMassa.toFixed(3)),
    nettoMassa: Number(nettoMassa.toFixed(3)),
    boshMassa,
    moddaMassa: Number(moddaMassa.toFixed(3)),
    suyuqlikMassa: Number(moddaMassa.toFixed(3)),
    idishBormi: true,
  };
}
