// app/laboratoriya/3d/lib/eritma-tayyorlash.js
//
// 2-BOSQICH: Eritma tayyorlash, molyarlik va konsentratsiya hisoblash dvigateli.
//
// Haqiqiy kimyoviy qoidalar:
//   n = m / M  (mol)
//   C_M = n / V  (mol/l)
//   w = (m / (m + m_suv)) * 100%  (massaviy ulush)
//
import { molyarMassaHisobla } from "@/lib/masala-dvigatel.js";
import { moddaKorinishi } from "./modda-korinishi.js";

/** Qattiq laboratoriya reagentlari katalogi (molyar massa va standart konsentratsiya bilan) */
export const ERITMA_REAGENTLARI = [
  { kalit: 'CuSO4', nom: 'Mis(II) sulfat', formula: 'CuSO4', rang: 0x2563eb, holat: 'kristall', standartM: 0.1 },
  { kalit: 'NaCl', nom: 'Natriy xlorid', formula: 'NaCl', rang: 0xf8fafc, holat: 'tuz', standartM: 0.1 },
  { kalit: 'NaOH', nom: 'Natriy gidroksid', formula: 'NaOH', rang: 0xffffff, holat: 'granula', standartM: 0.1 },
  { kalit: 'KMnO4', nom: 'Kaliy permanganat', formula: 'KMnO4', rang: 0x7e22ce, holat: 'kristall', standartM: 0.02 },
  { kalit: 'FeSO4', nom: 'Temir(II) sulfat', formula: 'FeSO4', rang: 0x10b981, holat: 'kristall', standartM: 0.1 },
  { kalit: 'AgNO3', nom: 'Kumush nitrat', formula: 'AgNO3', rang: 0xffffff, holat: 'kristall', standartM: 0.05 },
  { kalit: 'BaCl2', nom: 'Bariy xlorid', formula: 'BaCl2', rang: 0xf1f5f9, holat: 'kristall', standartM: 0.1 },
  { kalit: 'K2Cr2O7', nom: 'Kaliy dixromat', formula: 'K2Cr2O7', rang: 0xea580c, holat: 'kristall', standartM: 0.05 },
  { kalit: 'Na2CO3', nom: 'Natriy karbonat', formula: 'Na2CO3', rang: 0xffffff, holat: 'kukun', standartM: 0.1 },
  { kalit: 'KI', nom: 'Kaliy yodid', formula: 'KI', rang: 0xffffff, holat: 'kristall', standartM: 0.1 },
];

/** O'lchov kolbalari sig'imlari (ml) */
export const OLCHOV_KOLBALARI = [
  { hajm: 50, nom: '50 ml o\'lchov kolbasi' },
  { hajm: 100, nom: '100 ml o\'lchov kolbasi' },
  { hajm: 250, nom: '250 ml o\'lchov kolbasi' },
  { hajm: 500, nom: '500 ml o\'lchov kolbasi' },
];

/**
 * Berilgan reagent, massa va hajm bo'yicha eritma parametrlarini to'liq hisoblaydi.
 *
 * @param {string} reagentKaliti - Modda kaliti yoki formulasi
 * @param {number} massaGramm   - Tortilgan qattiq modda massasi (g)
 * @param {number} hajmMl       - O'lchov kolbasiga quyilgan suv hajmi (ml)
 * @param {number} [maqsadM]    - Rejalashtirilgan maqsadli molyarlik (ixtiyoriy)
 */
export function eritmaHisobla(reagentKaliti, massaGramm, hajmMl, maqsadM = null) {
  const m = Math.max(0, Number(massaGramm) || 0);
  const V_ml = Math.max(0.1, Number(hajmMl) || 0);
  const V_litr = V_ml / 1000;

  // Molyar massa hisoblash
  const M = molyarMassaHisobla(reagentKaliti) || 100;

  // Modda miqdori (mol)
  const n = m / M;

  // Molyar konsentratsiya (C_M = mol / L)
  const C_M = n / V_litr;

  // Massaviy ulush (w = m_modda / (m_modda + m_suv) * 100%)
  // Suv zichligi = 1.0 g/ml -> m_suv = V_ml gramm
  const m_eritma = m + V_ml;
  const massaviyUlush = m_eritma > 0 ? (m / m_eritma) * 100 : 0;

  // Maqsadli konsentratsiyaga nisbatan aniqlik foizi
  let aniqlikFoizi = 100;
  if (maqsadM && maqsadM > 0) {
    const farq = Math.abs(C_M - maqsadM);
    aniqlikFoizi = Math.max(0, 100 - (farq / maqsadM) * 100);
  }

  // Rang va vizual shaffoflik
  const korinish = moddaKorinishi(reagentKaliti);

  return {
    reagent: reagentKaliti,
    massaGramm: Number(m.toFixed(3)),
    hajmMl: Number(V_ml.toFixed(1)),
    molyarMassa: Number(M.toFixed(2)),
    molMiqdori: Number(n.toFixed(5)),
    molyarlik: Number(C_M.toFixed(4)),
    massaviyUlush: Number(massaviyUlush.toFixed(2)),
    aniqlikFoizi: Number(aniqlikFoizi.toFixed(1)),
    rang: korinish.rang,
    shaffoflik: Math.min(0.9, Math.max(0.3, C_M * 0.8)),
  };
}

/**
 * Kerakli konsentratsiya va hajm uchun qancha gramm modda tortish kerakligini hisoblaydi.
 * m = C_M * V (litr) * M
 */
export function kerakliMassaHisobla(reagentKaliti, maqsadM, hajmMl) {
  const M = molyarMassaHisobla(reagentKaliti) || 100;
  const V_litr = (Number(hajmMl) || 100) / 1000;
  const C_M = Number(maqsadM) || 0.1;
  const m = C_M * V_litr * M;
  return Number(m.toFixed(3));
}
